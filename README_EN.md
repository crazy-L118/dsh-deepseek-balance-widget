# dsh-deepseek-balance-widget

English | [中文](README.md)

A plugin that shows AI balances in the dsh web sidebar: DeepSeek built in, add MiMo and more, with live **balance / today spend / today tokens**, auto-refreshed every 30 s.

## Features

![AI balance sidebar](assets/screenshot.png)

- Sidebar widget: Balance / Today spend / Today tokens, auto-refresh every 30 s
- Click for details: cumulative spend, monthly usage, tokens
- Multi-provider tabs (DeepSeek / MiMo…), "＋ Add" to add new providers

## Install

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

Installed from npm and auto-registered by dsh. **Restart `dsh web`** and the balance button appears in the sidebar.

Or just tell your AI: *Install the dsh-deepseek-balance-widget plugin for me via npm.*

## Configuration

Open the popover → "＋ Add" → pick a provider → "AI 帮我配置" → send the copied prompt to your AI; it will guide you through the setup and write the config locally.

## Uninstall

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

## License

[MIT](LICENSE)
