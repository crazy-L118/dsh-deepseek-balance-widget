# dsh-deepseek-balance-widget

[English](README_EN.md) | 中文

在 dsh Web 侧边栏显示 AI 余额的多平台插件：内置 **DeepSeek**，可添加 **MiMo（小米）** 等平台，每 30 秒自动刷新。

## 功能

![AI 余额侧边栏展示](assets/screenshot.png)

- 侧边栏实时显示余额 / 今日消费 / 今日 Token，30 秒自动刷新，并随当前平台切换
- 弹窗顶部 **Tab** 切换平台（DeepSeek / MiMo…），侧边栏数值同步更新
- 弹窗右上角「**+ 添加**」：随时加入 MiMo 等其他 AI 平台
- 详情字段：余额、累计消费、今日消费、今日 Token、本月消耗（本月消费 / Tokens）
- 「**AI 帮我配置**」：凭证抓取与写入全交给智能体，无需手动翻 Cookies
- 弹窗底部显示版本号，有新版时一键自动更新

## 安装

需要：已安装 dsh（可用 `dsh web`）。

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

从 npm 拉取安装，dsh 自动注册到 `dsh.profile.bundles`，完成后**重启 `dsh web`** 即可。

也可以直接对 AI 说：*帮我用 npm 安装 dsh-deepseek-balance-widget 插件。*

## 配置

插件首次使用会自动创建 DeepSeek 条目，读取你本机的 `DEEPSEEK_API_KEY`。其他平台通过弹窗「+ 添加」加入。两种方式任选：

**方式一：弹窗内添加**
1. 打开弹窗，点右上角「+ 添加」。
2. 选择平台，点「AI 帮我配置」，把提示语发给智能体。
3. AI 一步步引导你获取凭证，自动写入本机配置。

**方式二：直接对 AI 说**

> 帮我配置 dsh-deepseek-balance-widget。

AI 会接管全部：问 API Key / 引导获取平台 Cookie → 写入本机 → 提醒重启 `dsh web`。

| 平台 | 凭据 | 备注 |
|---|---|---|
| DeepSeek | `DEEPSEEK_API_KEY` | 必填，余额 |
| DeepSeek 用量 | `DEEPSEEK_PLATFORM_TOKEN` | 可选，统计累计消费 / 本月 / 今日 |
| MiMo（小米） | 登录 Cookie | AI 引导获取 |

凭据保存在你本机的 `~/.dsh/ai-balances.json`，不随插件分发。

## 卸载

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

或者直接对 AI 说：*帮我用 npm 卸载 dsh-deepseek-balance-widget 插件。*

## License

[MIT](LICENSE)