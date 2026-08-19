#Requires -Version 5.1
<#
.SYNOPSIS
  Install dsh-deepseek-balance-widget into the local dsh web profile.

.DESCRIPTION
  By default this copies the plugin source (this repo) to
  $DSH_HOME/custom-plugins/dsh-deepseek-balance-widget and installs it via
  `dsh plugin --profile web add "file:..."`.

  With -FromNpm it skips the copy and installs the published package straight
  from the npm registry (`dsh plugin --profile web add dsh-deepseek-balance-widget`).

  Either way it also registers the plugin in dsh.profile.bundles inside the
  profile package.json.

  Usage (Windows PowerShell):
    powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1          # from local repo
    powershell -ExecutionPolicy Bypass -File .\scripts\install.ps1 -FromNpm # from npm registry
#>
[CmdletBinding()]
param(
  [switch]$FromNpm
)
$ErrorActionPreference = "Stop"

$pluginName = "dsh-deepseek-balance-widget"

$dshHome = if ($env:DSH_HOME) { $env:DSH_HOME } else { Join-Path $HOME ".dsh" }
$customPluginsDir = Join-Path $dshHome "custom-plugins"
$pluginDir = Join-Path $customPluginsDir $pluginName
$profileDir = Join-Path $dshHome "profiles" "web"
$profilePkg = Join-Path $profileDir "package.json"

# 0. dsh on PATH?
if (-not (Get-Command dsh -ErrorAction SilentlyContinue)) {
  Write-Host "[error] 'dsh' not found on PATH. Install DeepSeek Harness first." -ForegroundColor Red
  exit 1
}

# 1. web profile initialized?
if (-not (Test-Path $profilePkg)) {
  Write-Host "[error] web profile not found: $profilePkg" -ForegroundColor Red
  Write-Host "        Run 'dsh web' (or 'dsh --profile web --help') once to initialize the profile, then re-run this script."
  exit 1
}

# 2. copy plugin source (local mode only)
if ($FromNpm) {
  Write-Host "==> Installing from npm registry (no local copy)"
} else {
  $source = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
  Write-Host "==> Copying plugin to $pluginDir"
  New-Item -ItemType Directory -Force -Path $customPluginsDir | Out-Null
  if (Test-Path $pluginDir) { Remove-Item -Recurse -Force $pluginDir }
  Copy-Item -Recurse -Force -Path $source -Destination $pluginDir
  Get-ChildItem -Force $pluginDir -ErrorAction SilentlyContinue |
    Where-Object { $_.Name -in @("node_modules", ".git") } |
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
}

# 3. install via dsh plugin (pnpm add)
if ($FromNpm) {
  Write-Host "==> Installing into web profile: dsh plugin --profile web add $pluginName"
} else {
  $fileSpec = "file:" + ($pluginDir -replace "\\", "/")
  Write-Host "==> Installing into web profile: dsh plugin --profile web add $fileSpec"
}
Push-Location $profileDir
try {
  if ($FromNpm) {
    & dsh plugin --profile web add $pluginName
  } else {
    & dsh plugin --profile web add ("file:" + ($pluginDir -replace "\\", "/"))
  }
  if ($LASTEXITCODE -ne 0) { throw "dsh plugin add failed (exit code $LASTEXITCODE)" }
} finally {
  Pop-Location
}

# 4. register in dsh.profile.bundles (idempotent safety net).
#    Modern dsh auto-registers any installed dependency that declares
#    dsh.bundle after `dsh plugin add`, so this usually reports
#    "Already registered". It only matters for older dsh versions or when
#    the package was installed with raw pnpm/npm instead of `dsh plugin`.
Write-Host "==> Registering in dsh.profile.bundles"
$raw = [System.IO.File]::ReadAllText($profilePkg)
$pattern = '"bundles"\s*:\s*\[[^\]]*?\]'
$m = [regex]::Match($raw, $pattern)
if (-not $m.Success) {
  throw "Could not locate the dsh.profile.bundles array in $profilePkg. Please add `"$pluginName`" to it manually."
}
$arrayText = $m.Value
if ($arrayText -match '"dsh-deepseek-balance-widget"') {
  Write-Host "    Already registered, skipping."
} else {
  # Insert before the closing bracket; make sure there is a separating comma.
  $newArrayText = $arrayText.Substring(0, $arrayText.Length - 1).TrimEnd()
  if (-not $newArrayText.EndsWith(",")) { $newArrayText += "," }
  $newArrayText += "`n      `"$pluginName`"]"
  $raw = $raw.Substring(0, $m.Index) + $newArrayText + $raw.Substring($m.Index + $m.Length)
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($profilePkg, $raw, $utf8NoBom)
  Write-Host "    + Added $pluginName to bundles"
}

# 5. install the AI skill (idempotent): local copy first, npm-installed fallback
Write-Host "==> Installing AI skill"
$skillSource = Join-Path $pluginDir "skills\dsh-deepseek-balance-widget\SKILL.md"
if (-not (Test-Path $skillSource)) {
  $skillSource = Join-Path $profileDir ("node_modules\" + $pluginName + "\skills\dsh-deepseek-balance-widget\SKILL.md")
}
if (Test-Path $skillSource) {
  $skillDir = Join-Path $dshHome "skills\dsh-deepseek-balance-widget"
  New-Item -ItemType Directory -Force -Path $skillDir | Out-Null
  Copy-Item -Force $skillSource (Join-Path $skillDir "SKILL.md")
  Write-Host "    + Skill ready at $skillDir (AI picks it up in new sessions)"
} else {
  Write-Host "    (no skill source found, skipping)"
}

Write-Host ""
Write-Host "Installation complete. Next steps:"
Write-Host "  1. Edit $dshHome\.credentials.yaml and add (if not already set):"
Write-Host "       DEEPSEEK_API_KEY: sk-xxxx            # required - balance"
Write-Host "       DEEPSEEK_PLATFORM_TOKEN: xxxx        # optional - live usage (userToken from platform.deepseek.com)"
Write-Host "  2. Restart dsh web. The balance widget appears in the sidebar."
