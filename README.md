# dsh-deepseek-balance-widget

[English](README_EN.md) | 中文

在 dsh Web 侧边栏显示 AI 余额的多平台插件：内置 **DeepSeek**，可添加 **MiMo（小米）**，每 30 秒自动刷新。

## 功能

![AI 余额侧边栏展示](assets/screenshot.png)

- 侧边栏实时显示余额 / 今日消费 / 今日 Token，30 秒自动刷新，并随当前平台切换
- 弹窗顶部显示当前平台标题：点「**更换**」在已添加的平台间切换，点「**×**」可移除该平台
- 弹窗右上角「**+ 添加**」：加入 MiMo
- 详情字段：余额、累计消费、今日消费、今日 Token、本月消耗（本月消费 / Tokens）
- 「**AI 帮我配置**」：复制提示语发给智能体，AI 会一步步指导你抓取凭证并完成配置
- 弹窗底部显示版本号，有新版时一键自动更新
- 支持中 / EN 界面切换

## 安装

需要：已安装 dsh（可用 `dsh web`）。

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget@2.4.0
```

从 npm 拉取安装，dsh 自动注册到 `dsh.profile.bundles`，完成后**重启 `dsh web`** 即可。

> **务必写死版本号 `@2.4.0`**（当前最新稳定版）。不要用 `@latest`——它会被本地 pnpm/npm 缓存或镜像源解析成旧版本，导致装到老版。如果未来发布了更高版本，把这里的版本号换成最新的即可。

也可以直接对 AI 说：

> 帮我用 npm 安装 dsh-deepseek-balance-widget 插件，执行 `dsh plugin --profile web add dsh-deepseek-balance-widget@2.4.0`。

## 配置

插件首次使用会自动创建 DeepSeek 条目，读取你本机的 `DEEPSEEK_API_KEY`。

要加入 MiMo，打开弹窗点右上角「+ 添加」，再点「AI 帮我配置」，把提示语发给智能体；也可以直接对 AI 说：

> 帮我配置 dsh-deepseek-balance-widget。

AI 会接管全部：问 API Key / 引导获取平台 Cookie → 写入本机 → 提醒重启 `dsh web`。

| 平台 | 凭据 | 备注 |
| --- | --- | --- |
| DeepSeek | `DEEPSEEK_API_KEY` | 必填，余额 |
| DeepSeek 用量 | `DEEPSEEK_PLATFORM_TOKEN` | 可选，统计累计消费 / 本月 / 今日 |
| MiMo（小米） | 登录 Cookie | AI 引导获取 |

凭据保存在你本机的 `~/.dsh/ai-balances.json`，不随插件分发、不上传。

## 更新

无论你当前是哪个旧版本，都推荐升级到 npm 上的最新稳定版。

### 方式一：弹窗一键更新（推荐，已装用户）

1. 打开余额弹窗，底部会显示版本号；有新版本时显示 `vX → vY 更新`（`vY` 为 npm 上 semver 最高的版本）。
2. 点击「**检查更新**」，插件会自动从 npm 拉取并安装最高版本。
3. 安装完成后**必须彻底重启 `dsh web`**（关掉 `dsh web` 进程 / 退出桌面端再重开，**仅刷新浏览器页面无效**）才能加载新版本。

> 弹窗的「检查更新」会跳过 `latest` tag，直接安装 npm 上 semver 最高的版本，所以即使有人把 `latest` 改低了也能升到最新。

### 方式二：命令行强制更新（最稳妥，适合卡住或装不上的情况）

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget@2.4.0
```

**写死版本号 `@2.4.0`** 可绕过本地缓存 / 镜像源不同步 / `latest` 解析成旧版的问题，一步到位。装完**彻底重启 `dsh web`**。

### 方式三：手动更新（命令行更新失败时兜底）

```bash
cd ~/.dsh/profiles/web
npm install dsh-deepseek-balance-widget@2.4.0   # 若目录内有 pnpm-lock.yaml 则用 pnpm add
# 验证磁盘上确实变了
cat node_modules/dsh-deepseek-balance-widget/package.json | grep '"version"'
```

确认输出 `2.4.0` 后，**彻底重启 `dsh web`** 即可。

> 如果你的环境里弹窗/命令行的更新一直失败（提示版本没变），通常是 Agent 主机（如 WorkBuddy）通过 `NODE_OPTIONS` 注入了文件删除拦截导致 pnpm/npm 更新中断。此时在**普通终端**（不通过 Agent 运行）里执行上面的命令即可成功；或先执行 `set NODE_OPTIONS=`（PowerShell）再重试。

## 卸载

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

或者直接对 AI 说：

> 帮我用 npm 卸载 dsh-deepseek-balance-widget 插件。

## 联系

有问题或建议，欢迎联系：

- 邮箱：crazy_l118@icloud.com

## 赞助

如果这个插件对你有帮助，可以给我的晚餐加一根火腿肠 🍗

![赞赏码](assets/sponsor.jpg)

## License

[MIT](LICENSE)
