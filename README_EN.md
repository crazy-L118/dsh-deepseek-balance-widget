# dsh-deepseek-balance-widget

English | [中文](README.md)

A small plugin that shows your DeepSeek balance in the DeepSeek Harness (dsh) web sidebar: live **balance / today spend / today tokens**, click to open a detail card (cumulative spend, monthly usage, request count, tokens), auto-refreshed every 30 seconds.

> This plugin runs entirely on your own machine: the dsh host resolves **your local credentials** (`~/.dsh/.credentials.yaml` or environment variables) and queries the official DeepSeek APIs server-side. No API key / token / personal data is bundled in the code, so **every user sees only their own balance**.

## Features

- Persistent sidebar widget: `余额` (balance), `今日消费` (today spend), `今日Token` (today tokens), auto-refresh every 30 s
- Click for a detail card:
  - Balance (`$`, from `api.deepseek.com/user/balance`)
  - Cumulative spend (all time, summed per month from the platform usage API)
  - Today spend / today tokens (platform realtime API, GMT+8 day buckets)
  - Current-month usage: spend, API request count, tokens
- When the platform token is not configured, the balance still works and the usage area shows a neutral hint (never anyone's historical snapshot)
- Dark theme matching the dsh sidebar; adapts to official skins and third-party skins like Maid-atelier

## How it works (privacy)

```
Browser (dsh web frontend)  ──GET /deepseek-balance──▶  dsh host (your machine)
                                                       │
                                                       ├─ reads DEEPSEEK_API_KEY / DEEPSEEK_PLATFORM_TOKEN
                                                       │   from local ~/.dsh/.credentials.yaml (or env),
                                                       │   never hardcoded
                                                       ▼
                                             api.deepseek.com / platform.deepseek.com
                                                       │
                                                       ◀── returns balance & usage of YOUR account
```

- Balance comes from the official endpoint `GET https://api.deepseek.com/user/balance`
- Usage stats come from the platform endpoints (requires `userToken`), see configuration below
- All requests are made by the host (server-to-server); the browser never touches any secret

## Requirements

- DeepSeek Harness (`dsh`) with `dsh web` working
- Node.js ≥ 18 (global `fetch`)
- pnpm (`dsh plugin` forwards to pnpm internally)

## Install

The plugin is published to npm as **`dsh-deepseek-balance-widget`**. Install with a single command (**no git, no GitHub account needed**):

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

After a successful `dsh plugin` install, dsh **automatically registers the package in `dsh.profile.bundles`** (verified end-to-end), so **no manual config editing is needed**. This package has **no build script**, so pnpm does not block it (no `allowBuilds` approval needed).

Then **restart `dsh web`** — the balance button appears in the sidebar.

> Only for older dsh versions (without the auto-registration mechanism) or when bypassing `dsh plugin` with raw `pnpm/npm install`: manually append `"dsh-deepseek-balance-widget"` to the `dsh.profile.bundles` array in `~/.dsh/profiles/web/package.json`.

### 🤖 Let the AI install it

You have an Agent — let it install itself. Open DeepSeek Harness and drop this sentence in:

> Install the dsh-deepseek-balance-widget plugin for me (npm package: dsh-deepseek-balance-widget)

The agent will run `dsh plugin --profile web add dsh-deepseek-balance-widget` (from npm, no git needed), verify the bundle registration, then tell you to restart.

### Alternative: GitHub install

If the npm registry is unreachable, install straight from GitHub instead:

```bash
dsh plugin --profile web add github:crazy-L118/dsh-deepseek-balance-widget
```

(Note: this requires git on the machine.)

## Configure credentials (important)

Edit `~/.dsh/.credentials.yaml`:

```yaml
DEEPSEEK_API_KEY: sk-xxxxxxxxxxxxxxxx
DEEPSEEK_PLATFORM_TOKEN: xxxxxxxxxxxxxxxx   # optional, see below
```

> If you already use the DeepSeek API in dsh, `DEEPSEEK_API_KEY` is usually already configured and the balance part works out of the box.

| Credential | Required | Purpose | How to get it |
|---|---|---|---|
| `DEEPSEEK_API_KEY` | ✅ | Balance | [platform.deepseek.com](https://platform.deepseek.com) → API Keys |
| `DEEPSEEK_PLATFORM_TOKEN` | ⭕ optional | Usage stats (cumulative/month/today spend, requests, tokens) | Log in to [platform.deepseek.com](https://platform.deepseek.com) → press `F12` → `Application` → `Cookies` → copy the value of `userToken` |

Without `DEEPSEEK_PLATFORM_TOKEN`, the balance still shows; today spend / tokens show `—` and the usage block shows a configuration hint.

> ⚠️ `userToken` is your platform login session. Never commit it to Git or share it.

## Usage

1. Restart `dsh web`.
2. A balance button appears in the left sidebar (or next to the bottom Settings row) showing `余额 / 今日消费 / 今日Token`.
3. Click it for the detail card; use the "刷新" (refresh) button or wait 30 s for auto-refresh.

## Uninstall

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

dsh removes the layer from `dsh.profile.bundles` automatically; if anything remains (older dsh), delete the `dsh-deepseek-balance-widget` entries from `dependencies` and `dsh.profile.bundles` in `~/.dsh/profiles/web/package.json`.

## FAQ

- **No button in the sidebar?** Make sure `dsh web` was restarted. On different skins the button appears in the sidebar or the bottom toolbar; the plugin finds a spot automatically.
- **Balance shows "失败" (failed)?** Check that `DEEPSEEK_API_KEY` is valid and your machine can reach `api.deepseek.com`; the error line in the popover explains why.
- **Usage always shows the hint?** `DEEPSEEK_PLATFORM_TOKEN` is missing or expired (platform sessions expire; log in again and copy a fresh `userToken`).

## Development

- Host half: `lib/index.js` (cordis plugin registering `/deepseek-balance` and `/deepseek-usage`)
- Client half: `lib/client.js` (injected into the web frontend, mounts the sidebar widget)
- After changes, re-run the install command and restart `dsh web` (or use `dsh plugin --profile web add "file:<repo path>"` for local iteration)

## Disclaimer

- Not affiliated with or endorsed by DeepSeek.
- Usage stats rely on DeepSeek platform internal endpoints that may change at any time; best effort only.
- Please follow the [DeepSeek Platform Terms](https://platform.deepseek.com/terms) and API usage policy.

## License

[MIT](LICENSE)
