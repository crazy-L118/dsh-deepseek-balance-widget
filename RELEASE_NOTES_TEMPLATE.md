# dsh-deepseek-balance-widget Releases 文案草稿

按 GitHub Release 页面「Create a new release」格式，每个版本复制一段到 Release description，标题填版本号。

---

## v2.4.3

**Tag:** `v2.4.3` → main

**Description:**

```markdown
### 修复
- 修复与 maid-atelier 等皮肤插件共存时，余额卡片完全不显示、控制台持续抛 `Uncaught NotFoundError: insertBefore` 的问题
- 侧栏 / 底栏插入统一改用安全插入 helper：校验锚点后插入，失效时退化为 appendChild，永不抛异常
- `tryPlace()` 整体容错，单次失败不再中断重试；放置后下一帧自动复查归位
- `sidebarRoot()` 增加 `[data-maid-sidebar-footer]` 皮肤标记兜底

### 其他
- 中英文 README 新增皮肤兼容说明与更新日志，版本引用统一为 @2.4.3
- 感谢用户「朱鹭咲泽」提交的详细根因分析与修复补丁
```

---

## v2.4.2

**Tag:** `v2.4.2` → main

**Description:**

```markdown
### 更新
- 全面重写中英文 README，功能清单与实际代码一致
- 修正英文 README 中与界面实际文案不一致的措辞（Today Spend / Update / AI Configure）
- 版本号统一为 @2.4.2
```

---

## v2.4.1

**Tag:** `v2.4.1` → main

**Description:**

```markdown
### 修复
- 修复 Windows 下自动更新失败：cleanEnv() 全面清理 NODE_OPTIONS 中的 safe-delete 注入，避免 pnpm/npm 更新临时文件时被拦截
```

---

## v2.4.0

**Tag:** `v2.4.0` → main

**Description:**

```markdown
### 更新
- 版本号 2.3.9 → 2.4.0，中英文 README 版本引用同步
```

---

## v2.3.9

**Tag:** `v2.3.9` → main

**Description:**

```markdown
### 更新
- 更新失败时弹出错误详情面板，引导用户手动更新并附 GitHub 链接
```
