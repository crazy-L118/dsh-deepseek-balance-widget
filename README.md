# dsh-deepseek-balance-widget

[English](README_EN.md) | 中文

在 dsh Web 侧边栏显示 AI 余额的插件：内置 DeepSeek，可添加 MiMo 等平台，实时展示**余额 / 今日消费 / 今日 Token**，每 30 秒自动刷新。

## 功能

![AI 余额侧边栏展示](assets/screenshot.png)

- 侧边栏显示余额 / 今日消费 / 今日 Token，30 秒自动刷新
- 点击弹出详情：累计消费、本月消耗、Tokens
- 多平台 Tab 切换（DeepSeek / MiMo…），可「+ 添加」新平台

## 安装

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

从 npm 拉取安装，dsh 自动注册，**重启 `dsh web`** 后侧边栏出现余额按钮。

也可以直接对 AI 说：*帮我用 npm 安装 dsh-deepseek-balance-widget 插件。*

## 配置

打开弹窗 →「+ 添加」→ 选平台 →「AI 帮我配置」→ 把提示语发给智能体，AI 会引导你完成配置并写入本机。

## 卸载

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

## License

[MIT](LICENSE)
