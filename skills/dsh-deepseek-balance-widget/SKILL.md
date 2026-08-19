---
name: dsh-deepseek-balance-widget
description: 安装、卸载或检查 dsh 的 DeepSeek 余额侧边栏插件（dsh-deepseek-balance-widget）。用户提到「余额插件」「DeepSeek 余额」「安装余额显示」「装余额小部件」等时使用本技能。
whenToUse: 用户要求安装、卸载或检查 DeepSeek 余额显示插件（dsh-deepseek-balance-widget）时。
user-invocable: true
---

# dsh-deepseek-balance-widget 安装技能

在用户的 dsh（DeepSeek Harness）中安装 / 卸载 / 检查「DeepSeek 余额侧边栏小部件」插件。

## 背景

- 包名：`dsh-deepseek-balance-widget`（已发布到 npm，GitHub 托管源码）
- 作用：侧边栏显示余额 / 今日消费 / 今日Token，点击弹出详情；数据由宿主端用**本机**凭据实时查询，不内置任何密钥。
- 机制：`dsh plugin --profile web add <包>` 在 pnpm 安装成功后，会**自动把声明了 `dsh.bundle` 的包注册进 `dsh.profile.bundles`**，无需手动改配置文件。

## 安装步骤

1. **检查前置**：确认 `dsh` 与 `pnpm` 可用（`dsh --version`、`pnpm --version`）。
2. **安装（npm 直装，无需 git）**：
   ```bash
   dsh plugin --profile web add dsh-deepseek-balance-widget
   ```
   - 若 npm registry 不可达，可退回 GitHub 直装（需要 git）：`dsh plugin --profile web add github:crazy-L118/dsh-deepseek-balance-widget`
   - 若用户手上有本地源码目录，也可用 `file:` 规格安装。
3. **验证注册**：读取 `~/.dsh/profiles/web/package.json`（Windows 下为 `%USERPROFILE%\.dsh\profiles\web\package.json`），确认：
   - `dependencies` 中有 `dsh-deepseek-balance-widget`
   - `dsh.profile.bundles` 数组包含 `dsh-deepseek-balance-widget`
   - 若 bundles 里没有（旧版 dsh 才可能出现），用编辑工具把它追加进 `dsh.profile.bundles`。
4. **提示用户**：
   - **重启 `dsh web`** 后侧边栏才会出现余额按钮（安装只改配置文件，不热生效）。
   - 余额需要 `DEEPSEEK_API_KEY`：确认 `~/.dsh/.credentials.yaml` 中已配置（dsh 原本就用 DeepSeek API 的话通常已有）。注意：**只检查键是否存在，不要读取或回显密钥值**。
   - 实时用量（累计/本月/今日消费、请求次数）可选：配置 `DEEPSEEK_PLATFORM_TOKEN`（platform.deepseek.com 登录后 F12 → Application → Cookies → `userToken`）。未配置时余额仍正常显示。

## 卸载

```bash
dsh plugin --profile web rm dsh-deepseek-balance-widget
```
`dsh plugin rm` 会同时从 `dsh.profile.bundles` 移除该层；若残留，手动从 `~/.dsh/profiles/web/package.json` 的 `dependencies` 与 `dsh.profile.bundles` 中删除同名条目。

## 注意

- 安装后必须重启 `dsh web` 才生效；不要重启用户的 dsh 服务（重启动作由用户决定）。
- 全程不要读取、打印或提交任何凭据值（API Key / userToken）。
- 若安装失败，先检查 pnpm 是否可用、网络是否可达，再检查报错信息。
