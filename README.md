# dsh-deepseek-balance-widget

[English](README_EN.md) | 中文

在 DeepSeek Harness（dsh）Web 侧边栏显示 DeepSeek 余额的小插件：实时展示**余额 / 今日消费 / 今日Token**，点击弹出详情（累计消费、本月消耗、API 请求次数、Tokens），每 30 秒自动刷新。

> 本插件完全运行在你自己的机器上：余额和用量由 **dsh 宿主端**用**你本机的凭据**（`~/.dsh/.credentials.yaml` 或环境变量）向 DeepSeek 官方接口实时查询。代码中**不内置任何 API Key / Token / 个人数据**，所以**每个人看到的都是自己的余额**，互不可见。

## 功能

- 侧边栏常驻按钮：`余额`、`今日消费`、`今日Token` 三个数值，30 秒自动刷新
- 点击弹出详情卡片：
  - 余额（`$`，来自 `api.deepseek.com/user/balance`）
  - 累计消费（全部时间，来自平台用量接口按月累加）
  - 今日消费 / 今日Token（平台实时接口，按 GMT+8 当日统计）
  - 本月消耗：本月消费、API 请求次数、Tokens
- 未配置平台 Token 时，余额照常显示，用量区域显示中性提示（不展示任何人的历史快照）
- 深色主题，跟随 dsh 侧边栏样式；自动适配官方皮肤与 Maid-atelier 等第三方皮肤

## 工作原理（隐私说明）

```
浏览器 (dsh web 前端)  ──GET /deepseek-balance──▶  dsh 宿主端（你自己的机器）
                                                    │
                                                    ├─ 读取本机 ~/.dsh/.credentials.yaml 的
                                                    │   DEEPSEEK_API_KEY / DEEPSEEK_PLATFORM_TOKEN
                                                    │   （或环境变量），绝不硬编码
                                                    ▼
                                          api.deepseek.com / platform.deepseek.com
                                                    │
                                                    ◀── 返回「你这个账号」的余额与用量
```

- 余额数据来自 DeepSeek 官方余额接口 `GET https://api.deepseek.com/user/balance`
- 用量统计来自平台接口（需要 `userToken`），见下方配置说明
- 请求全部由宿主端发起（服务端到服务端），浏览器端不接触任何密钥

## 环境要求

- DeepSeek Harness（`dsh`）已安装并可用 `dsh web`
- Node.js ≥ 18（全局 `fetch`）
- pnpm（`dsh plugin` 内部转发给 pnpm）

## 安装

插件已发布到 npm，包名 **`dsh-deepseek-balance-widget`**。一条命令安装：

```bash
dsh plugin --profile web add dsh-deepseek-balance-widget
```

安装成功后 dsh 会**自动把该包注册进 `dsh.profile.bundles`**，**无需手动改任何配置文件**。本包**没有构建脚本**，pnpm 不会拦截（无需在 `pnpm-workspace.yaml` 的 `allowBuilds` 里批准）。

完成后**重启 `dsh web`**，侧边栏出现余额按钮即可。

## 配置凭据（关键一步）

编辑 `~/.dsh/.credentials.yaml`：

```yaml
DEEPSEEK_API_KEY: sk-xxxxxxxxxxxxxxxx
DEEPSEEK_PLATFORM_TOKEN: xxxxxxxxxxxxxxxx   # 可选，见下
```

> 如果你本来就在用 DeepSeek API（dsh 里已经能跑对话），`DEEPSEEK_API_KEY` 通常已经配置好了，余额部分**开箱即用**。

| 凭据 | 必填 | 用途 | 获取方式 |
|---|---|---|---|
| `DEEPSEEK_API_KEY` | ✅ | 余额 | [platform.deepseek.com](https://platform.deepseek.com) → API Keys |
| `DEEPSEEK_PLATFORM_TOKEN` | ⭕ 可选 | 用量统计（累计/本月/今日消费、请求次数、Tokens） | 登录 [platform.deepseek.com](https://platform.deepseek.com) → 按 `F12` → `Application` → `Cookies` → 复制 `userToken` 的值 |

未配置 `DEEPSEEK_PLATFORM_TOKEN` 时：余额正常显示，今日消费 / 今日Token 显示 `—`，用量区块显示配置提示。

> ⚠️ `userToken` 等同于你的平台登录会话，请勿提交到 Git 或分享给他人。

## 使用

1. 重启 `dsh web`。
2. 左侧边栏（或底部设置栏旁）会出现余额按钮，显示 `余额 / 今日消费 / 今日Token`。
3. 点击按钮查看详情卡片，卡片右下角有「刷新」按钮，或等待 30 秒自动刷新。

## 卸载

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```

dsh 会自动从 `dsh.profile.bundles` 移除该层；若还残留（旧版 dsh），手动删除 `~/.dsh/profiles/web/package.json` 中 `dependencies` 与 `dsh.profile.bundles` 里的同名条目。

## 常见问题

- **侧边栏没出现按钮？** 确认 `dsh web` 已重启；不同皮肤下按钮会出现在侧边栏或底部工具栏，插件会自动寻找合适位置。
- **余额显示「失败」？** 检查 `DEEPSEEK_API_KEY` 是否有效、机器能否访问 `api.deepseek.com`；在弹窗的错误行能看到原因。
- **用量一直显示提示？** `DEEPSEEK_PLATFORM_TOKEN` 未配置或已过期（平台会话有时效，过期后重新登录复制新值）。

## 开发

- 宿主端：`lib/index.js`（cordis 插件，注册 `/deepseek-balance`、`/deepseek-usage` 两个路由）
- 客户端：`lib/client.js`（注入 web 前端，挂载侧边栏小组件）
- 修改后重新执行安装命令并重启 `dsh web` 生效（或本地调试时用 `dsh plugin --profile web add "file:<仓库路径>"`）

## 免责声明

- 本项目与 DeepSeek 官方无任何关联，非官方产品。
- 用量统计使用 DeepSeek 平台的内部接口，可能随平台改版而失效，属尽力而为。
- 请遵守 [DeepSeek 平台服务条款](https://platform.deepseek.com/terms) 与 API 使用政策。

## License

[MIT](LICENSE)
