#!/usr/bin/env bash
# Install dsh-deepseek-balance-widget into the local dsh web profile.
#
# By default this copies the plugin source (this repo) to
# $DSH_HOME/custom-plugins/dsh-deepseek-balance-widget and installs it via
# `dsh plugin --profile web add "file:..."`.
#
# With --from-npm it skips the copy and installs the published package
# straight from the npm registry.
#
# Either way it also registers the plugin in dsh.profile.bundles inside the
# profile package.json.
#
# Usage:
#   bash scripts/install.sh             # from local repo
#   bash scripts/install.sh --from-npm  # from npm registry
set -euo pipefail

FROM_NPM=0
if [ "${1:-}" = "--from-npm" ]; then FROM_NPM=1; fi

PLUGIN_NAME="dsh-deepseek-balance-widget"
DSH_HOME="${DSH_HOME:-$HOME/.dsh}"
CUSTOM_PLUGINS="$DSH_HOME/custom-plugins"
PLUGIN_DIR="$CUSTOM_PLUGINS/$PLUGIN_NAME"
PROFILE_DIR="$DSH_HOME/profiles/web"
PROFILE_PKG="$PROFILE_DIR/package.json"

if ! command -v dsh >/dev/null 2>&1; then
  echo "[error] 'dsh' not found on PATH. Install DeepSeek Harness first." >&2
  exit 1
fi

if [ ! -f "$PROFILE_PKG" ]; then
  echo "[error] web profile not found: $PROFILE_PKG" >&2
  echo "        Run 'dsh web' (or 'dsh --profile web --help') once to initialize the profile, then re-run this script." >&2
  exit 1
fi

if [ "$FROM_NPM" = "1" ]; then
  echo "==> Installing from npm registry (no local copy)"
else
  SOURCE="$(cd "$(dirname "$0")/.." && pwd)"
  echo "==> Copying plugin to $PLUGIN_DIR"
  mkdir -p "$CUSTOM_PLUGINS"
  rm -rf "$PLUGIN_DIR"
  cp -R "$SOURCE" "$PLUGIN_DIR"
  rm -rf "$PLUGIN_DIR/node_modules" "$PLUGIN_DIR/.git"
fi

echo "==> Installing into web profile"
if [ "$FROM_NPM" = "1" ]; then
  ( cd "$PROFILE_DIR" && dsh plugin --profile web add "$PLUGIN_NAME" )
else
  ( cd "$PROFILE_DIR" && dsh plugin --profile web add "file:$PLUGIN_DIR" )
fi

# Idempotent safety net: modern dsh auto-registers any installed dependency
# that declares dsh.bundle after `dsh plugin add`, so this usually prints
# "Already registered". It only matters for older dsh versions or when the
# package was installed with raw pnpm/npm instead of `dsh plugin`.
echo "==> Registering in dsh.profile.bundles"
node - "$PROFILE_PKG" "$PLUGIN_NAME" <<'NODEEOF'
const fs = require("fs");
const pkgPath = process.argv[2];
const pluginName = process.argv[3];
const data = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const profile = data.dsh && data.dsh.profile;
const bundles = profile && Array.isArray(profile.bundles) ? profile.bundles : null;
if (bundles === null) {
  console.error("[error] dsh.profile.bundles not found in " + pkgPath +
    " - add \"" + pluginName + "\" to it manually.");
  process.exit(1);
}
if (bundles.includes(pluginName)) {
  console.log("    Already registered, skipping.");
} else {
  bundles.push(pluginName);
  fs.writeFileSync(pkgPath, JSON.stringify(data, null, 2) + "\n", "utf8");
  console.log("    + Added " + pluginName + " to bundles");
}
NODEEOF

# Install the AI skill (idempotent): local copy first, npm-installed fallback
echo "==> Installing AI skill"
SKILL_SRC="$PLUGIN_DIR/skills/dsh-deepseek-balance-widget/SKILL.md"
if [ ! -f "$SKILL_SRC" ]; then
  SKILL_SRC="$PROFILE_DIR/node_modules/$PLUGIN_NAME/skills/dsh-deepseek-balance-widget/SKILL.md"
fi
if [ -f "$SKILL_SRC" ]; then
  mkdir -p "$DSH_HOME/skills/dsh-deepseek-balance-widget"
  cp -f "$SKILL_SRC" "$DSH_HOME/skills/dsh-deepseek-balance-widget/SKILL.md"
  echo "    + Skill ready at $DSH_HOME/skills/dsh-deepseek-balance-widget (AI picks it up in new sessions)"
else
  echo "    (no skill source found, skipping)"
fi

echo ""
echo "Installation complete. Next steps:"
echo "  1. Edit $DSH_HOME/.credentials.yaml and add (if not already set):"
echo "       DEEPSEEK_API_KEY: sk-xxxx            # required - balance"
echo "       DEEPSEEK_PLATFORM_TOKEN: xxxx        # optional - live usage (userToken from platform.deepseek.com)"
echo "  2. Restart dsh web. The balance widget appears in the sidebar."
