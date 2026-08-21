# dsh-deepseek-balance-widget

English | [中文](README.md)

A multi-provider AI balance widget for the dsh web sidebar. **DeepSeek** is built in; add **MiMo (Xiaomi)** and others with one click. Auto-refreshes every 30 seconds.

## Features

![AI balance sidebar](assets/screenshot-en.png)

- Sidebar shows Balance / Today spend / Today tokens, auto-refresh every 30 s; values follow the selected provider
- **Tabs** in the popover switch between providers (DeepSeek / MiMo…), sidebar updates with the tab
- **"＋ Add"** button: add MiMo or any other AI provider at any time
- Details: balance, cumulative spend, today spend, today tokens, monthly usage (monthly spend / tokens)
- **"AI 帮我配置"**: credentials are handled by your AI — no digging through cookies by hand
- Version shown in the popover footer; one-click auto-update when a new version is available

## Install

Requires: dsh installed (with `dsh web` working).

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

Installed from npm and auto-registered by dsh. **Restart `dsh web`** and the balance button appears in the sidebar.

Or just tell your AI: *Install the dsh-deepseek-balance-widget plugin for me via npm.*

## Configuration

On first use the plugin creates a DeepSeek entry and reads your local `DEEPSEEK_API_KEY`. Other providers are added via "＋ Add". Either:

**Option 1: Add inside the popover**
1. Open the popover and click "＋ Add".
2. Pick a provider, then click "AI 帮我配置" and send the copied prompt to your AI.
3. Your AI walks you through getting the credentials and writes them locally.

**Option 2: Just tell your AI**

> Configure dsh-deepseek-balance-widget for me.

The AI takes care of everything: asks for your API key / guides you through getting the platform cookie → writes the local config → reminds you to **restart `dsh web`**.

| Provider | Credential | Notes |
|---|---|---|
| DeepSeek | `DEEPSEEK_API_KEY` | Required, balance |
| DeepSeek usage | `DEEPSEEK_PLATFORM_TOKEN` | Optional, cumulative / monthly / today stats |
| MiMo (Xiaomi) | Login cookie | Guided by your AI |

Credentials are stored locally in `~/.dsh/ai-balances.json`; nothing is shipped with the plugin.

## Uninstall

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

Or just tell your AI: *Uninstall the dsh-deepseek-balance-widget plugin for me via npm.*

## License

[MIT](LICENSE)