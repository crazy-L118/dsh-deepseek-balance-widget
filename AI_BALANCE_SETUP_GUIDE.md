# AI 余额插件 · 智能体配置引导教程

> 本文件供**智能体（AI 助手）**在聊天中读取。当用户说"帮我配置 MiMo / DeepSeek 余额"时，智能体应先完整读完本文件，再按对应章节一步步引导用户，不要跳过任何步骤。

---

## 0. 智能体的职责与边界

你是这个 dsh 插件的"配置向导"。你的任务：

1. 读完整份教程，理解两平台的差异（MiMo 用 Cookie，DeepSeek 用 API Key）。
2. 引导用户用浏览器开发者工具抓取请求（cURL / 请求头）。
3. 从用户粘贴的内容里**精准提取**鉴权凭证。
4. 把凭证**写入本机** `~/.dsh/ai-balances.json`（Windows 实际路径：`C:\Users\<用户名>\.dsh\ai-balances.json`）。
5. 验证余额能读到。
6. 提醒用户**彻底重启 dsh** 让凭证生效。

**边界（务必遵守）：**
- 你**不能**替用户登录任何平台，也**不能**跨域抓取 Cookie（浏览器同源策略 + 隐私限制）。
- 所有数据只写在本机 `~/.dsh/ai-balances.json`，**不上传**任何外部服务器。
- 写文件前必须先读取现状，用精确的方式修改，**绝不能删除或破坏其他已有条目**（尤其 `deepseek` 这条）。

---

## 1. 通用步骤：如何抓取浏览器请求（两种方法）

无论哪个平台，第一步都是让用户从浏览器里把"带鉴权信息的请求"复制给你。

### 方法 A：Copy as cURL（推荐，信息最全）
1. 在浏览器打开对应平台的余额/控制台页面并**保持登录**。
2. 按 `F12` 打开开发者工具 → 切到 **Network（网络）** 标签。
3. 按 `F5` 刷新页面，让请求重新发出。
4. 在过滤框输入关键词（见各平台章节），找到目标请求。
5. 右键该请求 → **Copy（复制）** → **Copy as cURL (bash)**。
6. 把复制出来的那一长串（以 `curl 'https://...` 开头）直接粘贴到对话里发给我。

### 方法 B：只复制请求头（轻量）
若用户不愿贴整段 cURL，可在 Network 里点开目标请求 → 切到 **Headers（标头）** → 找到 `Cookie:`（MiMo）或 `Authorization:`（DeepSeek）那一行 → 只复制该请求头的完整内容。

> 提醒用户：cURL / 请求头里含有登录凭证，**只发给我（本机 AI），不要发到任何公开/外部聊天**。

---

## 2. MiMo（小米）配置

- **平台网址**：`https://platform.xiaomimimo.com/#/console/balance`
- **鉴权方式**：**登录 Cookie**（MiMo 余额接口只对登录 Cookie 开放，API Key 查不到余额）。
- **抓取关键词**：在 Network 过滤框输入 `api` 或 `balance`，找域名是 `platform.xiaomimimo.com` / `api.xiaomimimo.com` 的请求。

### 提取 Cookie
- 若用户贴的是 cURL：找其中 `-H 'Cookie: ...'` 或 `--cookie '...'` 部分，提取 `Cookie:` 之后、`'` 之前的完整内容。
- 若用户贴的是请求头：直接取其 `Cookie:` 整行内容。
- Cookie 是一长串 `key=value; key2=value2; ...`，原样保留，不要截断。

### 写入格式
目标文件：`~/.dsh/ai-balances.json`（JSON 数组）。找到或新增一条 MiMo 记录：

```json
{
  "id": "mimo",
  "label": "MiMo（小米）",
  "kind": "mimo",
  "apiKey": "",
  "cookie": "<这里放提取到的完整 Cookie 字符串>",
  "enabled": true
}
```

> 注意 `id` 用 `mimo`，插件据此识别。若数组里已有 `id:"mimo"` 的条目，只更新它的 `cookie` 字段，保留其他字段。

### 备注
- MiMo 的 Cookie 约 **1–7 天**过期，过期后余额会显示 401。届时需要重新走一遍本流程更新 Cookie。
- 若提取后余额仍报"失败"，把插件弹窗里显示的原始响应片段发给我，我再精确适配字段。
- MiMo 余额接口常见返回字段（插件弹窗里会显示中文标签）：
  - `giftBalance` → 赠送余额
  - `cashBalance` → 现金余额
  - `frozenBalance` → 冻结余额
  - `overdraftLimit` → 透支额度
  - `remainingOverdraftLimit` → 剩余透支额度
  - `code` / `message` → 状态码 / 消息
  - 若还有未识别的字段，会保持原样显示。

---

## 3. DeepSeek 配置

- **平台网址**：`https://platform.deepseek.com/`（控制台）
- **鉴权方式**：**API Key**（即 `Authorization: Bearer sk-...` 凭证）。DeepSeek 余额接口 `https://api.deepseek.com/user/balance` 用 Bearer 鉴权。
- **抓取关键词**：在 Network 过滤框输入 `user` 或 `balance`，找域名是 `api.deepseek.com` / `platform.deepseek.com` 的请求。

### 提取 API Key
- 若用户贴的是 cURL：找其中 `-H 'Authorization: Bearer sk-...'` 部分，提取 `sk-` 开头的完整密钥。
- 若用户贴的是请求头：直接取 `Authorization: Bearer sk-...` 中 `sk-` 开头部分。
- 完整密钥形如 `sk-xxxxxxxxxxxxxxxx`，**一字不差**原样保留。

### 写入格式
目标文件：`~/.dsh/ai-balances.json`（JSON 数组）。找到或新增一条 DeepSeek 记录：

```json
{
  "id": "deepseek",
  "label": "DeepSeek",
  "kind": "deepseek",
  "apiKey": "<这里放提取到的 sk-... 密钥>",
  "enabled": true
}
```

> `id:"deepseek"` 是固定项，插件默认就有，且**不能被移除**。若已存在，只更新 `apiKey` 字段。
> 如果用户机器上 DeepSeek 的密钥已经配置在 dsh 的 `.credentials.yaml`（`DEEPSEEK_API_KEY`）里，可把 `apiKey` 写成字符串 `"__credentials__"`，插件运行时会自动从环境变量解析，无需把明文写进本文件。

---

## 4. 写入目标文件的操作要点

- 路径（Windows）：`C:\Users\<用户名>\.dsh\ai-balances.json`
- 它是一个 **JSON 数组**，形如 `[ {深度条目}, {其他条目} ]`。
- 修改步骤：
  1. 用 Read 读取该文件，确认当前内容（若文件不存在，说明用户还没初始化，先创建 `[]` 再追加）。
  2. 用 Edit / Write 精确修改对应 `id` 的条目，**不要改动其他条目**。
  3. 写回后再次 Read 确认 JSON 合法、结构完整。
- 不要写入任何多余字段；`cookie` 和 `apiKey` 只填当前平台需要的那个，另一个留空字符串或省略均可。

---

## 5. 验证

写入后，任选一种方式验证余额能读到：

- **方式一（插件侧）**：让用户彻底重启 dsh，打开插件弹窗，看对应平台是否显示余额数字。
- **方式二（直接请求）**：
  - DeepSeek：`curl -s https://api.deepseek.com/user/balance -H "Authorization: Bearer <sk-密钥>"`，看返回 `balance_infos`。
  - MiMo：`curl -s https://platform.xiaomimimo.com/api/v1/balance -H "Cookie: <Cookie>"`，看返回余额字段。
- 若返回 401 / 404 / 失败：说明凭证过期或提取有误，引导用户重抓。

---

## 6. 收尾提醒

配置写入成功后，务必告诉用户：

> **必须彻底重启 dsh**（命令行 `Ctrl+C` 停掉 `dsh web` 或关闭桌面端窗口，再重新启动），浏览器刷新不会重新加载插件凭证。重启后打开插件弹窗即可看到余额。

---

## 附：常见坑

- **MiMo 用 API Key 查不到余额**：MiMo 余额接口只对登录 Cookie 开放，必须用 Cookie，不能用 API Key。
- **Cookie 过期**：MiMo 登录态会过期，余额变 401 时重新走第 2 章。
- **别删 deepseek 条目**：它是插件默认项，删了会导致 DeepSeek 余额消失。
- **JSON 写坏**：写文件前后都要 Read 校验，确保数组闭合、逗号正确。
