window.__ModuleLoader__.load({
  id: "dsh-deepseek-balance-widget",
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    /** Route the host half exposes (same origin). */
    const ENDPOINT = "/deepseek-balance";
    /** Real-time usage route (platform userToken backed; neutral placeholder when unset). */
    const USAGE_ENDPOINT = "/deepseek-usage";
    /** NPM version check route (local version vs latest published). */
    const VERSION_ENDPOINT = "/deepseek-balance-version";
    /** One-click update route (runs npm install on the host). */
    const UPDATE_ENDPOINT = "/deepseek-balance-update";
    /** Provider management route (list / add / remove AI balances). */
    const PROVIDERS_ENDPOINT = "/ai-balances";
    /** Per-provider balance route. */
    const PROVIDER_BALANCE_ENDPOINT = "/ai-provider-balance";
    /** One-shot sync from dsh settings to the local balance store. */
    const SYNC_ENDPOINT = "/ai-balances-sync";
    /** Client-side provider metadata (label only; balance logic lives on host). */
    const PROVIDER_META = {
      deepseek: { label: { zh: "DeepSeek", en: "DeepSeek" } },
      mimo: { label: { zh: "MiMo（小米）", en: "MiMo" } }
    };
    /** Auto-refresh cadence, milliseconds. */
    const REFRESH_MS = 30000;
    /** LocalStorage key for the UI language preference (no longer used; dsh settings drive language). */
    const LANG_KEY = null;
    /** Supported UI languages. */
    const I18N = {
      zh: {
        entryAriaLabel: "AI 余额（余额 / 今日消费 / 今日Token）",
        balance: "余额",
        todaySpend: "今日消费",
        todayTokens: "今日Token",
        checking: "检查中…",
        checkFailed: "检查失败",
        upToDate: "已是最新",
        updating: "更新中…",
        updateSuccess: "成功，请重启 dsh",
        updateFailed: "更新失败",
        failed: "失败",
        usageUnavailable: "用量接口不可用（{0}）",
        usageNotConfigured: "未配置 DEEPSEEK_PLATFORM_TOKEN，仅显示余额。对 AI 说「帮我配置用量统计」，AI 会帮你设置（可选）。",
        usageThisMonth: "本月消耗",
        usageDisabled: "未启用",
        periodSpend: "{0}消耗",
        all: "全部",
        thisMonthSpend: "本月消费",
        tokens: "Tokens",
        yi: "亿",
        wan: "万",
        error: "错误",
        cumulativeSpend: "累计消费",
        items: "项",
        mimoFieldLabels: {
          code: "状态码", message: "消息", frozenBalance: "冻结余额", overdraftLimit: "透支额度",
          remainingOverdraftLimit: "剩余透支额度", giftBalance: "赠送余额", cashBalance: "现金余额",
          rechargeBalance: "充值余额", accountBalance: "账户余额", walletBalance: "钱包余额",
          plan: "套餐", expiredAt: "过期时间"
        },
        dailyUsage: "每日消耗",
        date: "日期",
        requests: "请求",
        spend: "消费",
        needSetup: "需设置",
        remove: "移除",
        switch: "更换",
        mimoCookieHint: "MiMo 余额需用浏览器登录 Cookie 查询。请重新在浏览器登录 platform.xiaomimimo.com 后，将 Cookie 更新到 ~/.dsh/ai-balances.json 对应条目中。",
        readFailed: "读取失败：{0}",
        rawPrefix: "原始响应：",
        aiGuide: "AI 帮我配置",
        configMethod: "配置方式",
        aiGuideNote: "点「AI 帮我配置」会复制一句话，发给智能体后它会读取本机教程文件、一步步引导你抓取凭证并写入插件。数据仅存本机，不上传。",
        localKeyNote: "密钥仅保存在本机 ~/.dsh/ai-balances.json，不会上传。",
        platform: "平台",
        mimoOption: "MiMo（小米）",
        deepseekOption: "DeepSeek",
        name: "名称",
        namePlaceholderDeepseek: "例如 DeepSeek",
        namePlaceholderMimo: "例如 MiMo",
        save: "保存",
        cancel: "取消",
        saving: "保存中…",
        aiChatGuideTitle: "让 AI 在聊天里帮你配置",
        step1: "Step 1",
        step2: "Step 2",
        openMimoBalance: "打开 platform.xiaomimimo.com/#/console/balance",
        copyPromptToChat: "复制提示语 → 和智能体对话",
        step1Desc: "点击下方链接打开 MiMo 余额页并登录",
        step2Desc: "复制下方提示语，发送给智能体，AI 会在对话中一步步引导你完成配置",
        manualPasteCookie: "我要手动粘贴 Cookie",
        manualCookieTitle: "手动粘贴 Cookie",
        cookiePlaceholder: "粘贴 Cookie / cURL / 请求头…",
        extractResult: "识别结果：",
        cookieNotFound: "未识别到 Cookie，请粘贴完整 cURL 或请求头",
        backToAiGuide: "返回 AI 引导",
        syncFailed: "同步失败：{0}",
        syncAddedN: "已从 dsh 设置同步 {0} 个平台",
        aiBalance: "AI 余额",
        add: "+ 添加",
        noProviders: "还没有任何 AI 余额，点右上角「+ 添加」。",
        updatedAt: "更新于 ",
        checkUpdate: "检查更新",
        update: "更新",
        fillName: "请填写名称",
        saveFailed: "保存失败：{0}",
        confirmRemove: "确定移除该 AI 余额？",
        pasteCookieHint: "请粘贴 Cookie 或 cURL，AI 会自动提取",
        copied: "已复制",
        copyFailed: "复制失败",
        copyError: "复制错误信息",
        refresh: "刷新",
        peakPeriod: "繁忙时段",
        offPeakPeriod: "空闲时段"
      },
      en: {
        entryAriaLabel: "AI Balance (Balance / Today Spend / Today Tokens)",
        balance: "Balance",
        todaySpend: "Today Spend",
        todayTokens: "Today Tokens",
        checking: "Checking…",
        checkFailed: "Check failed",
        upToDate: "Up to date",
        updating: "Updating…",
        updateSuccess: "Success, please restart dsh",
        updateFailed: "Update failed",
        failed: "Failed",
        usageUnavailable: "Usage API unavailable ({0})",
        usageNotConfigured: "DEEPSEEK_PLATFORM_TOKEN not configured, showing balance only. Tell the AI 'help me configure usage stats' to set it up (optional).",
        usageThisMonth: "This Month",
        usageDisabled: "Disabled",
        periodSpend: "{0} Usage",
        all: "All",
        thisMonthSpend: "This Month Spend",
        tokens: "Tokens",
        yi: "B",
        wan: "M",
        error: "Error",
        cumulativeSpend: "Cumulative Spend",
        items: "items",
        mimoFieldLabels: {
          code: "Code", message: "Message", frozenBalance: "Frozen Balance", overdraftLimit: "Overdraft Limit",
          remainingOverdraftLimit: "Remaining Overdraft", giftBalance: "Gift Balance", cashBalance: "Cash Balance",
          rechargeBalance: "Recharge Balance", accountBalance: "Account Balance", walletBalance: "Wallet Balance",
          plan: "Plan", expiredAt: "Expires At"
        },
        dailyUsage: "Daily Usage",
        date: "Date",
        requests: "Requests",
        spend: "Spend",
        needSetup: "Setup",
        remove: "Remove",
        switch: "Switch",
        mimoCookieHint: "MiMo balance requires a browser login Cookie. Please log in to platform.xiaomimimo.com again, then update the Cookie in ~/.dsh/ai-balances.json.",
        readFailed: "Read failed: {0}",
        rawPrefix: "Raw response: ",
        aiGuide: "AI Configure",
        configMethod: "Configuration",
        aiGuideNote: "Clicking 'AI Configure' copies a prompt. Send it to the AI and it will read the local guide, walk you through capturing credentials, and write them to the plugin. Data stays local.",
        localKeyNote: "Keys are only stored locally in ~/.dsh/ai-balances.json and are never uploaded.",
        platform: "Platform",
        mimoOption: "MiMo (Xiaomi)",
        deepseekOption: "DeepSeek",
        name: "Name",
        namePlaceholderDeepseek: "e.g. DeepSeek",
        namePlaceholderMimo: "e.g. MiMo",
        save: "Save",
        cancel: "Cancel",
        saving: "Saving…",
        aiChatGuideTitle: "Let the AI configure it in chat",
        step1: "Step 1",
        step2: "Step 2",
        openMimoBalance: "Open platform.xiaomimimo.com/#/console/balance",
        copyPromptToChat: "Copy prompt → chat with AI",
        step1Desc: "Click the link below to open the MiMo balance page and log in",
        step2Desc: "Copy the prompt below and send it to the AI. It will guide you step by step.",
        manualPasteCookie: "I'll paste the Cookie manually",
        manualCookieTitle: "Paste Cookie manually",
        cookiePlaceholder: "Paste Cookie / cURL / headers…",
        extractResult: "Extracted: ",
        cookieNotFound: "No Cookie found. Paste the full cURL or headers.",
        backToAiGuide: "Back to AI guide",
        syncFailed: "Sync failed: {0}",
        syncAddedN: "Synced {0} providers from dsh settings",
        aiBalance: "AI Balance",
        add: "+ Add",
        noProviders: "No AI balances yet. Click '+ Add' in the top right.",
        updatedAt: "Updated ",
        checkUpdate: "Check update",
        update: "Update",
        fillName: "Please enter a name",
        saveFailed: "Save failed: {0}",
        confirmRemove: "Remove this AI balance?",
        pasteCookieHint: "Paste a Cookie or cURL; the AI will extract it",
        copied: "Copied",
        copyFailed: "Copy failed",
        copyError: "Copy error",
        refresh: "Refresh",
        peakPeriod: "Peak",
        offPeakPeriod: "Off-peak"
      }
    };
    /** Authoritative source: host route reads ~/.dsh/settings.yaml locale.preference. */
    const LOCALE_ENDPOINT = "/deepseek-balance-locale";
    async function fetchDshLang() {
      try {
        const res = await fetch(LOCALE_ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        if (!res.ok) return null;
        const env = await res.json();
        if (env && (env.lang === "en" || env.lang === "zh")) return env.lang;
      } catch { /* ignore */ }
      return null;
    }
    /** Fallback: read dsh's <html lang> attribute (only useful if dsh updates it). */
    function detectLangFromHtml() {
      const raw = (document?.documentElement?.lang || "").trim().toLowerCase();
      if (raw.startsWith("en")) return "en";
      if (raw.startsWith("zh")) return "zh";
      return null;
    }
    let currentLang = "zh";
    function applyLangChange(next) {
      if (next !== currentLang) {
        currentLang = next;
        if (typeof remountEntry === "function") remountEntry();
        if (typeof updateEntryLabels === "function") updateEntryLabels();
        if (lastEnvelope !== void 0) renderValue(lastEnvelope, lastUsage);
        if (popRef !== null) renderPopover();
      }
    }
    /** Poll the host route (authoritative settings.yaml) and re-render on change. */
    async function pollDshLang() {
      const next = await fetchDshLang();
      if (next !== null) applyLangChange(next);
      else {
        const fb = detectLangFromHtml();
        if (fb !== null) applyLangChange(fb);
      }
    }
    if (typeof document !== "undefined" && document.documentElement) {
      // 启动时立即问宿主端；之后每 8 秒问一次。
      pollDshLang();
      setInterval(pollDshLang, 8000);
      // dsh 偶尔改 <html lang> 时也能跟上。
      new MutationObserver(() => {
        const fb = detectLangFromHtml();
        if (fb !== null) applyLangChange(fb);
      }).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
    }
    /** Translate a key, optionally replacing {0}, {1}... placeholders. */
    function t(key, ...args) {
      const dict = I18N[currentLang] || I18N.zh;
      let text = dict[key];
      if (text === void 0) text = I18N.zh[key] ?? key;
      if (args.length && typeof text === "string") {
        text = text.replace(/\{(\d+)\}/g, (_, n) => String(args[Number(n)] ?? ""));
      }
      return text;
    }
    /** Update sidebar entry stat labels to the current language. */
    function updateEntryLabels() {
      // 用 data-stat-key 按语义查找 label，避免位置错乱（即便 dsh 注入了其他 .dshBalanceStatLabel 也不会错位）。
      const entry = document.querySelector("[data-dsh-balance-entry]");
      if (!entry) return;
      const spendLabel = entry.querySelector('[data-stat-key="todaySpend"] .dshBalanceStatLabel');
      const tokenLabel = entry.querySelector('[data-stat-key="todayTokens"] .dshBalanceStatLabel');
      if (spendLabel) spendLabel.textContent = t("todaySpend");
      if (tokenLabel) tokenLabel.textContent = t("todayTokens");
      entry.setAttribute("aria-label", t("entryAriaLabel"));
    }
    /** Remove the entry from DOM; dsh's rootObserver (childList:true) will rebuild it via createEntry(),
     *  which calls statHtml with the current currentLang — so the new entry comes up in the right language. */
    function remountEntry() {
      const entry = document.querySelector("[data-dsh-balance-entry]");
      if (!entry) return;
      entry.remove();
    }
    /** How long the "update succeeded, restart dsh" message stays visible, milliseconds.
     *  Set to infinite so the message persists until dsh is restarted.
     *  dsh restart re-executes client.js, resetting all variables (including updateSuccessUntil),
     *  which makes the success message disappear and restores the normal version check button. */
    const UPDATE_SUCCESS_MS = Number.MAX_SAFE_INTEGER;
    /**
     * Fixed path to the AI-setup guide file that the host copies from the
     * plugin package into the user's ~/.dsh directory at startup. Using this
     * space-free, home-relative path avoids the "cannot read / glob failed"
     * errors dsh chat AIs hit when the workspace path contains spaces.
     */
    const AI_GUIDE_FILE = "~/.dsh/AI_BALANCE_SETUP_GUIDE.md";
    /** Prompt copied to the chat when the user asks the AI to configure MiMo Cookie. */
    const MIMO_COOKIE_GUIDE_PROMPT = `请先读取文件 ${AI_GUIDE_FILE}，按里面「MiMo（小米）」章节的流程一步步引导我配置，最后把凭证写入本机插件。`;
    /** Prompt copied to the chat when the user asks the AI to configure DeepSeek balance. */
    const DEEPSEEK_GUIDE_PROMPT = `请先读取文件 ${AI_GUIDE_FILE}，按里面「DeepSeek」章节的流程一步步引导我配置，最后把凭证写入本机插件。`;
    /** Map a provider kind to the AI-guide prompt copied to the chat. */
    const AI_GUIDE_PROMPT_BY_KIND = { mimo: MIMO_COOKIE_GUIDE_PROMPT, deepseek: DEEPSEEK_GUIDE_PROMPT };

    /** Inline icon (matches the shell's 16px nav-icon look). */
    const ICON = '<svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 4L8 8.5 11.5 4M8 8.5v4M5.5 9.5h5M5.5 11.5h5"/></svg>';

    /**
     * 注意：本插件不在客户端内置任何个人数据。
     * 余额与用量全部由宿主端用「本机」的凭据实时查询；未配置
     * DEEPSEEK_PLATFORM_TOKEN 时，用量区域显示中性提示而不是任何人的快照。
     */

    /** Inject the widget stylesheet once. */
    function ensureStyle() {
      const tagId = "dsh-deepseek-balance-widget-css";
      if (document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") !== null) return;
      const css = [
        ".dshBalanceEntry{appearance:none;width:100%;font:inherit;color:inherit;text-align:left;cursor:pointer;background:0 0;border:0;border-radius:8px;align-items:center;gap:10px;padding:9px 12px;display:flex;transition:background .14s}",
        ".dshBalanceEntry:hover{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.06))}",
        ".dshBalanceEntry[data-active=true]{background:var(--dsw-alias-bg-layer-2,rgba(255,255,255,.06))}",
        ".dshBalanceEntry.compact{width:auto;gap:10px;padding:6px 8px;flex:none}",
        ".dshBalanceIcon{color:var(--dsw-alias-label-secondary,#9aa4b2);flex:none;display:flex}",
        ".dshBalanceEntry.compact .dshBalanceIcon{width:16px;height:16px;justify-content:center;align-items:center}",
        ".dshBalanceLabel{color:var(--dsw-alias-label-primary,#e6e9ef);font-size:14px;font-weight:500;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
        ".dshBalanceValue{color:var(--dsw-alias-label-tertiary,#7b8494);font-size:12px;font-variant-numeric:tabular-nums;flex:none}",
        ".dshBalanceEntry.compact .dshBalanceValue{font-size:12px;font-weight:500}",
        ".dshBalanceValue[data-state=ok]{color:#3fb950}",
        ".dshBalanceValue[data-state=err]{color:#f85149}",
        ".dshBalanceValue[data-state=loading],.dshBalanceValue[data-state=muted]{color:var(--dsw-alias-label-tertiary,#7b8494)}",
        ".dshBalanceStat{display:flex;flex-direction:column;align-items:flex-start;gap:1px;min-width:0;line-height:1.2}",
        ".dshBalanceStatLabel{font-size:9px;color:#7b8494;white-space:nowrap;letter-spacing:.02em}",
        ".dshBalanceStat .dshBalanceValue,.dshBalanceStat .dshBalanceToday,.dshBalanceStat .dshBalanceTodayTok{font-size:12px;font-weight:500;font-variant-numeric:tabular-nums;white-space:nowrap}",
        ".dshBalanceToday[data-state=ok]{color:#e6e9ef}",
        ".dshBalanceTodayTok[data-state=ok]{color:#9aa4b2}",
        ".dshBalanceToday[data-state=err],.dshBalanceTodayTok[data-state=err]{color:#f85149}",
        ".dshBalanceToday[data-state=loading],.dshBalanceTodayTok[data-state=loading]{color:var(--dsw-alias-label-tertiary,#7b8494)}",
        ".dshBalanceToday[data-state=muted],.dshBalanceTodayTok[data-state=muted]{color:var(--dsw-alias-label-tertiary,#7b8494)}",
        ".dshBalancePop{position:fixed;z-index:9999;width:280px;max-height:calc(100vh - 16px);overflow-x:hidden;overflow-y:auto;box-sizing:border-box;background:#1b1f27;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);padding:14px 16px;color:#e6e9ef;font-size:13px;line-height:1.5}",
        ".dshBalancePop::-webkit-scrollbar{width:8px}",
        ".dshBalancePop::-webkit-scrollbar-thumb{background:rgba(255,255,255,.18);border-radius:4px}",
        ".dshBalancePop h4{margin:0 0 10px;padding-bottom:10px;border-bottom:1px solid rgba(255,255,255,.08);font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}",
        ".dshBalanceRow{display:flex;justify-content:space-between;gap:12px;padding:3px 0}",
        ".dshBalanceRow span:first-child{color:#9aa4b2}",
        ".dshBalanceRow span:last-child{font-variant-numeric:tabular-nums}",
        ".dshBalanceDivider{height:0;margin:8px 0;border-top:1px solid rgba(255,255,255,.08)}",
        // Footer 内的按钮不许被 flex 压缩成单字符宽度导致文字竖排（英文 label 更长时容易触发）。
        ".dshBalanceFoot .dshBalanceBtn,.dshBalanceFoot .dshBalanceVersionBtn{white-space:nowrap;flex-shrink:0}",
        ".dshBalanceFoot{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:6px;margin-top:12px;padding-top:10px;color:#7b8494;font-size:11px}",
        ".dshBalanceBtn{appearance:none;cursor:pointer;background:#2d333b;color:#e6e9ef;border:1px solid rgba(255,255,255,.12);border-radius:7px;padding:4px 10px;font:inherit;font-size:12px}",
        ".dshBalanceBtn:hover{background:#363d47}",
        ".dshBalanceVersion{display:flex;align-items:center;gap:6px;font-size:11px;color:#7b8494}",
        ".dshBalanceVersion[data-state=ok]{color:#7b8494}",
        ".dshBalanceVersion[data-state=update]{color:#d29922}",
        ".dshBalanceVersion[data-state=err]{color:#f85149}",
        ".dshBalanceVersionBtn{appearance:none;cursor:pointer;background:transparent;border:0;padding:0;margin:0;font:inherit;font-size:11px;color:#58a6ff;text-decoration:underline}",
        ".dshBalanceVersionBtn:hover{color:#79b8ff}",
        ".dshBalanceVersionBtn:disabled{cursor:not-allowed;color:#7b8494;text-decoration:none}",
        ".dshBalanceDot{width:7px;height:7px;border-radius:50%;flex:none}",
        ".dshBalanceDot[data-state=ok]{background:#3fb950}",
        ".dshBalanceDot[data-state=err]{background:#f85149}",
        ".dshBalanceDot[data-state=loading],.dshBalanceDot[data-state=muted]{background:#d29922}",
        ".dshBalanceUsage{display:block;margin-top:6px}",
        ".dshBalanceUsageTitle{font-size:11px;color:#7b8494;letter-spacing:.04em;margin:0 0 2px;display:flex;align-items:baseline;gap:6px}",
        ".dshBalanceUsageTitle b{color:#9aa4b2;font-weight:600;text-transform:uppercase}",
        ".dshBalanceDaily{margin-top:6px;font-size:12px}",
        ".dshBalanceDailyHead,.dshBalanceDailyRow{display:flex;justify-content:space-between;gap:8px;padding:2px 0}",
        ".dshBalanceDailyHead{color:#7b8494;border-bottom:1px solid rgba(255,255,255,.08);margin-bottom:2px;padding-bottom:4px}",
        ".dshBalanceDailyRow span{font-variant-numeric:tabular-nums;flex:1;text-align:right}",
        ".dshBalanceDailyRow span:first-child{flex:1.2;text-align:left;color:#9aa4b2}",
        ".dshBalanceHint{font-size:12px;color:#7b8494;line-height:1.6;margin:2px 0 0}",
        ".dshBalanceAddBtn{appearance:none;cursor:pointer;background:#2d333b;color:#e6e9ef;border:1px solid rgba(255,255,255,.12);border-radius:7px;padding:2px 9px;font:inherit;font-size:12px;margin-left:auto}",
        ".dshBalanceAddBtn:hover{background:#363d47}",
        ".dshBalanceProviders{margin-top:2px}",
        ".dshBalanceProv{padding:9px 0;border-top:1px solid rgba(255,255,255,.08)}",
        ".dshBalanceProv:first-child{border-top:0;padding-top:4px}",
        ".dshBalanceProvHead{display:flex;align-items:center;gap:8px}",
        ".dshBalanceProvName{font-size:13px;font-weight:500;color:#e6e9ef;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}",
        ".dshBalanceProvBal{font-size:13px;font-weight:600;font-variant-numeric:tabular-nums;color:#3fb950}",
        ".dshBalanceProvBal[data-state=err]{color:#f85149}",
        ".dshBalanceProvRemove{appearance:none;cursor:pointer;background:transparent;border:0;color:#7b8494;font-size:16px;line-height:1;padding:0 4px}",
        ".dshBalanceProvRemove:hover{color:#f85149}",
        ".dshBalanceAddForm{margin-top:10px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);display:flex;flex-direction:column;gap:8px}",
        ".dshBalanceField{display:flex;flex-direction:column;gap:3px}",
        ".dshBalanceField label{font-size:11px;color:#9aa4b2}",
        ".dshBalanceInput{background:#0f1216;border:1px solid rgba(255,255,255,.14);border-radius:7px;color:#e6e9ef;font:inherit;font-size:13px;padding:6px 8px;width:100%;box-sizing:border-box}",
        ".dshBalanceInput:focus{outline:none;border-color:#58a6ff}",
        ".dshBalanceFormBtns{display:flex;gap:8px;margin-top:2px}",
        ".dshBalanceSyncHint{font-size:12px;padding:6px 8px;border-radius:7px;margin:8px 0 2px}",
        ".dshBalanceSyncHint[data-state=ok]{background:rgba(35,197,94,.12);color:#3fb950}",
        ".dshBalanceSyncHint[data-state=err]{background:rgba(248,81,73,.12);color:#f85149}",
        ".dshBalanceProvCookie{appearance:none;cursor:pointer;background:transparent;border:0;color:#58a6ff;font:inherit;font-size:11px;text-decoration:underline;padding:0 4px;flex:none}",
        ".dshBalanceProvCookie:hover{color:#79b8ff}",
        ".dshBalanceTabs{display:flex;gap:6px;margin-bottom:10px;border-bottom:1px solid rgba(255,255,255,.08);padding-bottom:8px}",
        ".dshBalanceTabsRow{display:flex;align-items:flex-end;gap:8px;margin-bottom:0;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.08)}",
        ".dshBalanceTabsRow .dshBalanceTabs{margin-bottom:0;border-bottom:none;padding-bottom:0;flex:1}",
        ".dshBalanceTabContent{padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,.08)}",
        ".dshBalanceSwitchBtn{appearance:none;cursor:pointer;flex-shrink:0;background:#2d333b;border:1px solid rgba(255,255,255,.14);color:#e6e9ef;font:inherit;font-size:12px;padding:5px 10px;border-radius:7px;white-space:nowrap}",
        ".dshBalanceSwitchBtn:hover{background:#353c47}",
        ".dshBalanceTab{position:relative;appearance:none;cursor:default;background:transparent;border:0;color:#e6e9ef;font:inherit;font-size:13px;padding:5px 10px;border-radius:7px;display:flex;align-items:center;gap:6px;flex:0 1 auto;justify-content:flex-start;white-space:nowrap}",
        ".dshBalanceTab.active{padding-left:0}",
        ".dshBalanceTabBal{font-size:12px;font-weight:600;color:#3fb950;font-variant-numeric:tabular-nums}",
        ".dshBalanceTabBal[data-state=err]{color:#f85149}",
        ".dshBalanceTabTitle{font-size:14px;font-weight:600}",
        ".dshBalancePeriodBadge{font-size:11px;padding:2px 6px;border-radius:4px;color:#9aa4b2;background:rgba(255,255,255,.08);white-space:nowrap}",
        ".dshBalancePeriodBadge[data-period=peak]{color:#f85149;background:rgba(248,81,73,.12)}",
        ".dshBalancePeriodBadge[data-period=offPeak]{color:#3fb950;background:rgba(35,197,94,.12)}",
        ".dshBalanceTabMenu{appearance:none;cursor:pointer;margin-left:4px;font-size:16px;font-weight:600;line-height:1;color:#7b8494;user-select:none;width:18px;height:18px;display:flex;align-items:center;justify-content:center;border-radius:4px}",
        ".dshBalanceTabMenu:hover{color:#f85149;background:rgba(248,81,73,.12)}",
        ".dshBalanceCtxMenu{position:absolute;z-index:10000;background:#161b22;border:1px solid rgba(255,255,255,.12);border-radius:6px;box-shadow:0 8px 24px rgba(0,0,0,.35);padding:4px 0;min-width:120px}",
        ".dshBalanceCtxMenuItem{width:100%;text-align:left;background:transparent;border:none;color:#c9d1d9;padding:6px 12px;font-size:13px;cursor:pointer;font:inherit}",
        ".dshBalanceCtxMenuItem:hover{background:#21262d;color:#58a6ff}",
        ".dshBalanceCtxMenuItem:disabled{cursor:default;color:#5b626a}",
        ".dshBalanceCtxMenuItem:disabled:hover{background:transparent;color:#5b626a}",
        ".dshBalanceProvActions{display:flex;gap:8px;margin-top:10px;align-items:center}",
        ".dshBalanceProvActions .dshBalanceProvRemove{font-size:12px;color:#7b8494}",
        ".dshBalanceProvActions .dshBalanceProvRemove:hover{color:#f85149}",
        ".dshBalanceTextarea{min-height:66px;resize:vertical;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:11px;line-height:1.5}",
        ".dshBalanceCookiePanel{margin-top:8px;display:flex;flex-direction:column;gap:8px}",
        ".dshBalanceCookiePanel code{font-size:10px;opacity:.7;word-break:break-all}",
        ".dshBalanceRawHint{font-size:10px;opacity:.75;word-break:break-all}",
        ".dshBalanceWizard{display:flex;flex-direction:column;gap:10px}",
        ".dshBalanceWizardStep{display:flex;flex-direction:column;gap:6px}",
        ".dshBalanceWizardStep b{font-size:12px;color:#9aa4b2}",
        ".dshBalanceWizardStep kbd{font-family:inherit;font-size:11px;background:rgba(255,255,255,.12);border-radius:4px;padding:1px 4px}",
        ".dshBalanceWizardStep p{margin:0;font-size:12px;color:#7b8494;line-height:1.5}",
        ".dshBalanceWizardLink{align-self:flex-start;color:#58a6ff;font-size:12px;text-decoration:underline;cursor:pointer}",
        ".dshBalanceWizardLink:hover{color:#79b8ff}",
        ".dshBalanceCookiePreview{font-size:11px;color:#7b8494;background:rgba(255,255,255,.05);border-radius:6px;padding:6px 8px;word-break:break-all}",
        ".dshBalanceCookiePreview code{color:#e6e9ef;font-size:10px}",
        ".dshBalanceCookiePreview[data-found=false]{display:none}",
        ".dshBalanceUpdateErr{margin-top:10px;border:1px solid rgba(248,81,73,.25);border-radius:8px;background:rgba(248,81,73,.08);padding:8px 10px}",
        ".dshBalanceUpdateErrHead{display:flex;justify-content:space-between;align-items:center;font-size:12px;font-weight:600;color:#f85149;margin-bottom:6px}",
        ".dshBalanceUpdateErrClose{appearance:none;background:transparent;border:0;color:#9aa4b2;font-size:18px;line-height:1;cursor:pointer;padding:0 2px}",
        ".dshBalanceUpdateErrClose:hover{color:#f85149}",
        ".dshBalanceUpdateErrBody{max-height:120px;overflow:auto;background:#0f1216;border:1px solid rgba(255,255,255,.08);border-radius:6px;padding:6px 8px;margin:0 0 8px;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:10px;line-height:1.4;color:#c9d1d9;white-space:pre-wrap;word-break:break-all}"
      ].join("");
      const tag = document.createElement("style");
      tag.dataset.plugin = "dsh-deepseek-balance-widget";
      tag.dataset.pluginCss = tagId;
      tag.textContent = css;
      document.head.appendChild(tag);
    }

    /** Find the sidebar shell root element, or undefined while not yet mounted. */
    function sidebarRoot() {
      const column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]');
      if (column === null) return void 0;
      return column.querySelector('[class*="logoRow"]')?.parentElement ?? column.firstElementChild;
    }

    /** Try to locate the bottom toolbar that holds Settings/Download/Call icons. */
    function bottomToolbar() {
      const column = document.querySelector('[data-pane="sidebar"], [class*="sidebarCol"]');
      if (column === null) return void 0;
      // Official dsh sidebar slots: the Settings trigger lives under [data-slot='sidebar.settings'].
      const settingsSlot = column.querySelector("[data-slot='sidebar.settings']");
      if (settingsSlot !== null) {
        // Maid-atelier and similar skins mark the footer via [data-maid-sidebar-footer].
        let row = settingsSlot.closest("[data-maid-sidebar-footer]");
        if (row !== null) return row;
        // Otherwise the immediate parent is the horizontal actions row.
        row = settingsSlot.parentElement;
        if (row !== null && row !== column) return row;
      }
      // Fallback: any bottom row containing a settings-ish button.
      const settingsBtn = column.querySelector('button[aria-label="设置"], button[aria-label="Settings"], button[title="设置"], button[title="Settings"]');
      if (settingsBtn !== null) {
        const row = settingsBtn.closest('[class*="row"], [class*="bar"], [class*="toolbar"], [class*="actions"], [class*="bottom"]');
        if (row !== null && row.parentElement === column) return row;
        return settingsBtn.parentElement;
      }
      // Heuristic: last few children of the sidebar that look like a horizontal button row.
      const candidates = Array.from(column.children).filter((el) => {
        if (el.tagName !== "DIV") return false;
        const buttons = el.querySelectorAll("button");
        return buttons.length >= 2 && el.clientHeight < 80;
      });
      return candidates[candidates.length - 1];
    }

    /** The New Session button: nested in the logo row on current shells. */
    function newSessionButton(root) {
      const nested = root.querySelector("button[class*=\"newSession\"]");
      if (nested !== null) return nested;
      for (const child of root.children) if (child.tagName === "BUTTON") return child;
    }

    /** One labeled stat column (label above value). key 用作 data-stat-key 标记，便于按语义查找。 */
    function statHtml(label, valueHtml, key) {
      return '<span class="dshBalanceStat" data-stat-key="' + key + '"><span class="dshBalanceStatLabel">' + label + "</span>" + valueHtml + "</span>";
    }

    /** Build the entry row (a detached button). */
    function createEntry(variant) {
      const entry = document.createElement("button");
      entry.type = "button";
      entry.dataset.dshBalanceEntry = "";
      entry.className = "dshBalanceEntry" + (variant === "compact" ? " compact" : "");
      entry.setAttribute("aria-label", t("entryAriaLabel"));
      entry.innerHTML =
        statHtml('<span class="dshBalanceStatLabel dshBalanceProviderLabel">' + t("balance") + "</span>", '<span class="dshBalanceValue" data-state="loading">…</span>', "balance") +
        statHtml(t("todaySpend"), '<span class="dshBalanceToday" data-state="loading">…</span>', "todaySpend") +
        statHtml(t("todayTokens"), '<span class="dshBalanceTodayTok" data-state="loading">…</span>', "todayTokens");
      return entry;
    }

    /** Re-insert the entry after the New Session row (sidebar mode). */
    function placeSidebar(root, entry) {
      const button = newSessionButton(root);
      if (button === void 0) return false;
      if (entry.parentElement !== root) {
        const row = button.closest('[class*="logoRow"]');
        const base = row !== null && row.parentElement === root ? row : button;
        const anchor = base.nextElementSibling ?? null;
        root.insertBefore(entry, anchor);
      }
      return true;
    }

    /** Insert the compact entry before the Settings slot/button (bottom toolbar mode). */
    function placeToolbar(toolbar, entry) {
      if (toolbar === void 0 || toolbar === null) return false;
      if (entry.parentElement === toolbar) return true;
      const settingsSlot = toolbar.querySelector("[data-slot='sidebar.settings']");
      if (settingsSlot !== null) {
        toolbar.insertBefore(entry, settingsSlot);
        return true;
      }
      const settingsBtn = toolbar.querySelector('button[aria-label="设置"], button[aria-label="Settings"], button[title="设置"], button[title="Settings"]');
      if (settingsBtn !== null && settingsBtn.parentElement === toolbar) {
        toolbar.insertBefore(entry, settingsBtn);
      } else {
        toolbar.appendChild(entry);
      }
      return true;
    }

    /** Map a currency code to a display symbol. */
    function sym(currency) {
      if (currency === "USD") return "$";
      if (currency === "CNY") return "¥";
      return currency || "";
    }

    /** Fetch the latest balance envelope from the host route. */
    async function fetchBalance() {
      const res = await fetch(ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
      return await res.json();
    }

    /** Check → update flow. Always starts with a version check, then updates only if needed. */
    async function handleUpdateClick(btn) {
      btn.disabled = true;
      const originalText = btn.textContent;
      btn.textContent = t("checking");
      const version = await fetchVersion();
      lastVersion = version;
      if (!version || version.ok === false) {
        btn.textContent = t("checkFailed");
        btn.title = version ? String(version.error || "") : "";
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; btn.title = ""; }, 2000);
        return;
      }
      if (!version.updateAvailable) {
        btn.textContent = t("upToDate");
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1500);
        return;
      }
      btn.textContent = t("updating");
      const result = await updatePackage();
      if (result.ok) {
        btn.textContent = t("updateSuccess");
        btn.disabled = true;
        // Keep the success message visible for a while before reverting to version info.
        updateSuccessUntil = Date.now() + UPDATE_SUCCESS_MS;
        setTimeout(() => checkVersion(), UPDATE_SUCCESS_MS);
      } else {
        btn.textContent = t("updateFailed");
        btn.title = String(result.error || t("updateFailed")) + (result.output ? "\n" + result.output.slice(-200) : "");
        updateErrorDetail = { error: result.error || t("updateFailed"), output: result.output || "" };
        renderPopover();
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; btn.title = ""; }, 3000);
      }
    }

    /** Trigger the host-side npm install (best-effort; returns JSON envelope). */
    async function updatePackage() {
      try {
        const res = await fetch(UPDATE_ENDPOINT, {
          method: "POST",
          headers: { Accept: "application/json" }
        });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Fetch the latest usage envelope from the host route (never throws). */
    async function fetchUsage() {
      try {
        const res = await fetch(USAGE_ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Fetch the local vs latest npm version envelope from the host route (never throws). */
    async function fetchVersion() {
      try {
        const res = await fetch(VERSION_ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Fetch the provider list from the host (never throws). */
    async function fetchProviders() {
      try {
        const res = await fetch(PROVIDERS_ENDPOINT, { method: "GET", headers: { Accept: "application/json" } });
        const json = await res.json();
        return json && Array.isArray(json.providers) ? json.providers : [];
      } catch (e) {
        return [];
      }
    }

    /** Add or update a provider on the host (never throws). */
    async function saveProvider(body) {
      try {
        const res = await fetch(PROVIDERS_ENDPOINT, {
          method: "POST",
          headers: { "content-type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body)
        });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Remove a provider on the host (never throws). */
    async function removeProvider(id) {
      try {
        const res = await fetch(PROVIDERS_ENDPOINT + "?id=" + encodeURIComponent(id), {
          method: "DELETE",
          headers: { Accept: "application/json" }
        });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Fetch a single provider's balance (never throws). */
    async function fetchProviderBalance(id) {
      try {
        const res = await fetch(PROVIDER_BALANCE_ENDPOINT + "?provider=" + encodeURIComponent(id), {
          method: "GET",
          headers: { Accept: "application/json" }
        });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Sync dsh settings to the local balance store (never throws). */
    async function fetchSync() {
      try {
        const res = await fetch(SYNC_ENDPOINT, { method: "POST", headers: { Accept: "application/json" } });
        return await res.json();
      } catch (e) {
        return { ok: false, error: String(e?.message ?? e) };
      }
    }

    /** Compact number for the entry (1.2万 style). */
    function fmtCompact(n) {
      if (n === void 0 || n === null || n === "") return "—";
      const v = Number(String(n).replace(/,/g, ""));
      if (!Number.isFinite(v)) return String(n);
      if (v >= 1e8) return (v / 1e8).toFixed(1) + t("yi");
      if (v >= 1e4) return (v / 1e4).toFixed(1) + t("wan");
      return v.toLocaleString();
    }

    /** Integer with thousand separators (precise, for token counts). */
    function fmtInt(n) {
      const v = Number(String(n ?? "").replace(/,/g, ""));
      if (!Number.isFinite(v)) return String(n ?? "—");
      return v.toLocaleString();
    }

    /** 宿主端返回的今日消费是纯数字（如 "0.00"），弹窗里补上 ¥ 展示。 */
    function fmtYuan(s) {
      const v = String(s ?? "");
      if (/^[\d.]+$/.test(v)) return "¥" + v;
      return v;
    }

    /** Escape user-provided text for safe HTML insertion. */
    function escapeHtml(s) {
      return String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    }

    /** Format a normalized provider balance for display. */
    function formatProviderBalance(data) {
      if (!data) return "—";
      if (data.balance_infos) {
        const info = data.balance_infos[0];
        if (!info) return "—";
        return (sym(info.currency) || "") + (info.total_balance !== void 0 ? info.total_balance : "—");
      }
      if (data.total !== void 0 && data.total !== null && data.total !== "") {
        return (sym(data.currency) || "") + data.total;
      }
      return "—";
    }

    /** Try to extract a Cookie value from raw cURL / devtools headers / plain cookie. */
    function extractCookie(raw) {
      if (!raw) return "";
      const text = raw.trim();
      // Cookie: header
      const headerMatch = text.match(/Cookie:\s*([^\r\n]+)/i);
      if (headerMatch) return headerMatch[1].trim();
      // cURL -H/--header 'Cookie: ...'
      const curlHeaderMatch = text.match(/(?:-H|--header)\s+['"]Cookie:\s*([^'"]+)['"]/i);
      if (curlHeaderMatch) return curlHeaderMatch[1].trim();
      // cURL --cookie '...'
      const curlCookieMatch = text.match(/--cookie\s+['"]([^'"]+)['"]/i);
      if (curlCookieMatch) return curlCookieMatch[1].trim();
      // Otherwise treat the whole trimmed text as a plain cookie string.
      return text;
    }

    /**
     * 用量来源解析：宿主端实时数据优先；拿不到时返回 null（绝不回退到
     * 任何人的硬编码快照，保证每个人看到的都是自己的数据）。
     * @returns {{src:object|null, state:string, error?:string}}
     */
    function usageStateOf(usageEnvelope) {
      if (usageEnvelope && usageEnvelope.ok && usageEnvelope.data) {
        return { src: usageEnvelope.data, state: "ok" };
      }
      if (usageEnvelope && usageEnvelope.ok === false && usageEnvelope.error) {
        return { src: null, state: "err", error: usageEnvelope.error };
      }
      return { src: null, state: "muted" };
    }

    /** Return the provider currently shown in the popover; default to DeepSeek. */
    function activeProvider() {
      if (activeProviderId) {
        const found = providers.find((p) => p.id === activeProviderId);
        if (found) return found;
      }
      const deepseek = providers.find((p) => p.kind === "deepseek");
      if (deepseek) return deepseek;
      return providers[0] || { id: "deepseek", kind: "deepseek", label: "DeepSeek" };
    }

    /** Render balance + today stats into the entry spans. */
    function renderValue(envelope, usageEnvelope) {
      // 每次刷新都从 DOM 重新拿 entry，并按当前语言同步所有 stat label —— 避免 dsh 自愈重建或 React 重渲染导致 label 不同步。
      // 直接问宿主端读 settings.yaml（权威）。fire-and-forget：不等返回，下次轮询或下次 refresh 时自动同步。
      pollDshLang();
      const entry = document.querySelector("[data-dsh-balance-entry]");
      if (entry) {
        entryRef = entry;
        const spendLabel = entry.querySelector('[data-stat-key="todaySpend"] .dshBalanceStatLabel');
        const tokenLabel = entry.querySelector('[data-stat-key="todayTokens"] .dshBalanceStatLabel');
        if (spendLabel) spendLabel.textContent = t("todaySpend");
        if (tokenLabel) tokenLabel.textContent = t("todayTokens");
        entry.setAttribute("aria-label", t("entryAriaLabel"));
      }
      const provider = activeProvider();
      const isDeepseek = provider && provider.kind === "deepseek";
      const bal = isDeepseek ? envelope : (balances[provider.id] || null);

      const labelEl = entryRef && entryRef.querySelector(".dshBalanceProviderLabel");
      const valueEl = entryRef && entryRef.querySelector(".dshBalanceValue");
      const todayEl = entryRef && entryRef.querySelector(".dshBalanceToday");
      const tokEl = entryRef && entryRef.querySelector(".dshBalanceTodayTok");

      // 平台名称（提醒这是哪个 provider 的余额）；按当前语言查 PROVIDER_META，避免宿主端硬编码的中文混入英文界面。
      if (labelEl !== null) {
        const meta = provider ? PROVIDER_META[provider.kind] : null;
        const metaLabel = meta ? meta.label[currentLang] : null;
        const fallbackLabel = provider ? (provider.label || provider.kind) : t("balance");
        labelEl.textContent = metaLabel || fallbackLabel;
      }

      // 余额（统一显示货币符号，与 MiMo 入口保持一致）
      if (valueEl !== null) {
        if (!bal || bal.ok === false) {
          valueEl.dataset.state = "err";
          valueEl.textContent = t("failed");
        } else {
          valueEl.dataset.state = "ok";
          valueEl.textContent = formatProviderBalance(bal.data);
        }
      }

      // 今日消费 / 今日Token（实时数据优先；未配置/不可用时显示中性占位）
      let todaySpend = void 0;
      let todayTokens = void 0;
      let todayState = "muted";
      if (isDeepseek) {
        const usage = usageStateOf(usageEnvelope);
        todayState = usage.state;
        if (usage.src) {
          todaySpend = usage.src.todaySpend ? String(usage.src.todaySpend).replace(/[¥$]/g, "").replace(" CNY", "") : void 0;
          todayTokens = usage.src.todayTokens;
        }
      } else if (bal && bal.ok && bal.data && bal.data.today) {
        todayState = "ok";
        todaySpend = bal.data.today.cost !== void 0 ? Number(bal.data.today.cost).toFixed(2) : void 0;
        todayTokens = bal.data.today.tokens;
      } else if (bal && bal.ok) {
        // 有余额但无今日记录：按之前约定显示 0
        todayState = "ok";
        todaySpend = "0.00";
        todayTokens = 0;
      }
      if (todayEl !== null) {
        todayEl.dataset.state = todayState;
        todayEl.textContent = todaySpend !== void 0 ? todaySpend : "—";
      }
      if (tokEl !== null) {
        tokEl.dataset.state = todayState;
        tokEl.textContent = todayTokens !== void 0 ? fmtCompact(todayTokens) : "—";
      }
    }

    /** Update the detail popover if it is open. */
    function renderPopover() {
      if (popRef === null) return;
      popRef.innerHTML = popoverHtml();
      positionPopover();
      const refreshBtn = popRef.querySelector("[data-refresh]");
      if (refreshBtn !== null) refreshBtn.addEventListener("click", () => { refresh(true); checkVersion(); });
      const langBtn = popRef.querySelector("[data-lang-toggle]");
      if (langBtn !== null) langBtn.remove();
      const updateBtn = popRef.querySelector("[data-update-cmd]");
      if (updateBtn !== null) {
        updateBtn.addEventListener("click", () => handleUpdateClick(updateBtn));
      }
      const updateErrClose = popRef.querySelector("[data-update-err-close]");
      if (updateErrClose !== null) {
        updateErrClose.addEventListener("click", () => { updateErrorDetail = null; renderPopover(); });
      }
      const updateErrCopy = popRef.querySelector("[data-update-err-copy]");
      if (updateErrCopy !== null) {
        updateErrCopy.addEventListener("click", () => {
          if (!updateErrorDetail) return;
          const text = String(updateErrorDetail.error || "") + "\n" + String(updateErrorDetail.output || "");
          navigator.clipboard?.writeText(text).then(() => {
            updateErrCopy.textContent = t("copied");
            setTimeout(() => updateErrCopy.textContent = t("copyError"), 1500);
          }).catch(() => {
            updateErrCopy.textContent = t("copyFailed");
            setTimeout(() => updateErrCopy.textContent = t("copyError"), 1500);
          });
        });
      }
      const addBtn = popRef.querySelector("[data-add]");
      if (addBtn !== null) addBtn.addEventListener("click", () => { addFormState = { kind: "mimo", label: "", key: "", cookie: "" }; showAddForm = true; renderPopover(); });
      const cancelBtn = popRef.querySelector("[data-cancel]");
      if (cancelBtn !== null) cancelBtn.addEventListener("click", () => { addFormState = { kind: "mimo", label: "", key: "", cookie: "" }; showAddForm = false; renderPopover(); });
      const saveBtn = popRef.querySelector("[data-save]");
      if (saveBtn !== null) saveBtn.addEventListener("click", () => onSaveProvider());
      popRef.querySelectorAll("[data-tab]").forEach((tb) => {
        tb.addEventListener("click", () => {
          closeContextMenu();
        });
      });
      const tabsEl = popRef.querySelector("[data-tabs]");
      if (tabsEl !== null) {
        tabsEl.style.cursor = "default";
      }
      const switchBtn = popRef.querySelector("[data-switch]");
      if (switchBtn !== null) {
        switchBtn.addEventListener("click", () => {
          if (providers.length <= 1) return;
          const rect = switchBtn.getBoundingClientRect();
          const popRect = popRef.getBoundingClientRect();
          renderProviderSwitchMenu(rect.left - popRect.left, rect.bottom - popRect.top);
        });
      }
      popRef.querySelectorAll("[data-tab-remove]").forEach((mb) => {
        mb.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          const tabEl = mb.closest("[data-tab]");
          if (!tabEl) return;
          onRemoveProvider(tabEl.getAttribute("data-tab"));
        });
      });
      const kindSel = popRef.querySelector("[data-f-kind]");
      if (kindSel !== null) kindSel.addEventListener("change", (e) => { addFormState.kind = e.target.value; });
      const labelInp = popRef.querySelector("[data-f-label]");
      if (labelInp !== null) labelInp.addEventListener("input", (e) => { addFormState.label = e.target.value; });
      const cookieFormInp = popRef.querySelector("[data-f-cookie]");
      if (cookieFormInp !== null) cookieFormInp.addEventListener("input", (e) => { addFormState.cookie = e.target.value; });
      const aiGuideBtn = popRef.querySelector("[data-ai-guide]");
      if (aiGuideBtn !== null) {
        aiGuideBtn.addEventListener("click", async () => {
          const prompt = AI_GUIDE_PROMPT_BY_KIND[addFormState.kind] || MIMO_COOKIE_GUIDE_PROMPT;
          try {
            await navigator.clipboard.writeText(prompt);
            aiGuideBtn.textContent = t("copied");
          } catch {
            aiGuideBtn.textContent = t("copyFailed");
          }
          setTimeout(() => aiGuideBtn.textContent = t("aiGuide"), 1500);
        });
      }
      const aiGuideCookieBtn = popRef.querySelector("[data-ai-guide-cookie]");
      if (aiGuideCookieBtn !== null) {
        aiGuideCookieBtn.addEventListener("click", () => {
          cookieEditId = aiGuideCookieBtn.getAttribute("data-provider-id");
          cookieManualMode = false;
          renderPopover();
        });
      }
      const cookieCancel = popRef.querySelector("[data-cookie-cancel]");
      if (cookieCancel !== null) cookieCancel.addEventListener("click", () => { cookieEditId = null; cookieEditValue = ""; cookieExtracted = ""; cookieManualMode = false; renderPopover(); });
      const cookieSave = popRef.querySelector("[data-cookie-save]");
      if (cookieSave !== null) cookieSave.addEventListener("click", () => onSaveCookie());
      const cookieValue = popRef.querySelector("[data-cookie-value]");
      if (cookieValue !== null) {
        cookieValue.addEventListener("input", (e) => {
          cookieEditValue = e.target.value;
          cookieExtracted = extractCookie(cookieEditValue);
          const previewEl = popRef.querySelector(".dshBalanceCookiePreview");
          if (previewEl !== null) {
            previewEl.dataset.found = String(!!cookieExtracted);
            previewEl.innerHTML = '<b>' + t("extractResult") + "</b>" + (cookieExtracted
              ? '<code>' + escapeHtml(cookieExtracted.slice(0, 180) + (cookieExtracted.length > 180 ? '…' : '')) + '</code>'
              : t("cookieNotFound"));
          }
        });
      }
      const openMiMo = popRef.querySelector("[data-open-mimo]");
      if (openMiMo !== null) openMiMo.addEventListener("click", () => window.open("https://platform.xiaomimimo.com/#/console/balance", "_blank"));
      const copyStep2 = popRef.querySelector("[data-copy-step2]");
      if (copyStep2 !== null) {
        copyStep2.addEventListener("click", async () => {
          const prompt = MIMO_COOKIE_GUIDE_PROMPT;
          try {
            await navigator.clipboard.writeText(prompt);
            copyStep2.textContent = t("copied");
          } catch {
            copyStep2.textContent = t("copyFailed");
          }
          setTimeout(() => copyStep2.textContent = t("copyPromptToChat"), 1500);
        });
      }
      const cookieManual = popRef.querySelector("[data-cookie-manual]");
      if (cookieManual !== null) cookieManual.addEventListener("click", () => { cookieManualMode = true; renderPopover(); });
      const cookieGuide = popRef.querySelector("[data-cookie-guide]");
      if (cookieGuide !== null) cookieGuide.addEventListener("click", () => { cookieManualMode = false; renderPopover(); });
    }

    /** Build the usage block: live platform data first, neutral hint otherwise. */
    function usageHtmlOf(usageEnvelope) {
      const usage = usageStateOf(usageEnvelope);
      if (!usage.src) {
        const hint = usage.state === "err"
          ? t("usageUnavailable", String(usage.error || "").slice(0, 60))
          : t("usageNotConfigured");
        return '<div class="dshBalanceUsage">' +
          '<div class="dshBalanceUsageTitle"><b>' + t("usageThisMonth") + "</b><span>" + t("usageDisabled") + "</span></div>" +
          '<div class="dshBalanceHint">' + hint + "</div>" +
          "</div>";
      }
      const src = usage.src;
      return '<div class="dshBalanceUsage">' +
        // 宿主端 src.apiKey 是硬编码的中文「API Key 全部」，英文下不能用；DeepSeek 当前只有 1 个 API Key，直接用 i18n key。
        '<div class="dshBalanceUsageTitle"><b>' + t("usageThisMonth") + "</b><span>" + t("all") + "</span></div>" +
        '<div class="dshBalanceRow"><span>' + t("thisMonthSpend") + "</span><span>" + String(src.totalSpend ?? "—") + "</span></div>" +
        '<div class="dshBalanceRow"><span>' + t("tokens") + "</span><span>" + String(src.tokens ?? "—") + "</span></div>" +
        "</div>";
    }

    /** Build the DeepSeek detail block (balance rows + usage). */
    function deepseekDetailHtml(envelope, usageEnvelope) {
      const info = envelope && envelope.data && envelope.data.balance_infos && envelope.data.balance_infos[0];
      // 宿主已把 currency 清空（入口不显示货币符号）；弹窗里仍展示 ¥。
      const cur = info ? (sym(info.currency) || "¥") : "¥";
      let rows = "";
      if (envelope && envelope.error && !info) {
        rows += '<div class="dshBalanceRow"><span>' + t("error") + "</span><span>" + String(envelope.error).slice(0, 80) + "</span></div>";
      } else if (!info) {
        rows += '<div class="dshBalanceRow"><span>' + t("balance") + "</span><span>—</span></div>";
      } else {
        const total = info.total_balance;
        rows += '<div class="dshBalanceRow"><span>' + t("balance") + "</span><span>" + cur + (total !== void 0 ? total : "—") + "</span></div>";
      }
      // 累计消费（全部时间）——放在余额下面，不属于「本月消耗」区块
      const usage = usageStateOf(usageEnvelope);
      const usageSrc = usage.src;
      if (usageSrc && usageSrc.cumulativeSpend) {
        rows += '<div class="dshBalanceRow"><span>' + t("cumulativeSpend") + "</span><span>" + String(usageSrc.cumulativeSpend) + "</span></div>";
      }
      if (usageSrc && usageSrc.todaySpend) {
        rows += '<div class="dshBalanceRow"><span>' + t("todaySpend") + "</span><span>" + fmtYuan(usageSrc.todaySpend) + "</span></div>";
      }
      if (usageSrc && usageSrc.todayTokens) {
        rows += '<div class="dshBalanceRow"><span>' + t("todayTokens") + "</span><span>" + String(usageSrc.todayTokens) + "</span></div>";
      }
      rows += '<div class="dshBalanceDivider"></div>';
      return rows + usageHtmlOf(usageEnvelope);
    }

    /** Flatten a balance API response object into [key, value] rows (up to 2 levels). */
    function flattenBalanceRows(obj, depth, out, skip) {
      if (!obj || typeof obj !== "object") return;
      for (const [k, v] of Object.entries(obj)) {
        if (v === null || v === undefined) continue;
        if (skip && skip.has(k)) continue;
        if (typeof v === "object" && !Array.isArray(v)) {
          if (depth < 1) { flattenBalanceRows(v, depth + 1, out, skip); continue; }
          const s = JSON.stringify(v);
          out.push([k, s.length > 48 ? s.slice(0, 48) + "…" : s]);
        } else if (Array.isArray(v)) {
          out.push([k, "[" + v.length + " " + t("items") + "]"]);
        } else {
          out.push([k, String(v)]);
        }
      }
    }

    /** Labels for known MiMo balance response fields (localized). */
    function mimoFieldLabel(key) {
      return (I18N[currentLang]?.mimoFieldLabels ?? I18N.zh.mimoFieldLabels)[key] || key;
    }

    /** Build the MiMo usage block (from /api/v1/usage): 与 DeepSeek「本月消耗」一模一样. */
    function mimoUsageHtml(usage) {
      if (!usage || typeof usage !== "object") return "";
      const cost = usage.costUsage || {};
      const token = usage.tokenUsage || {};
      const plugin = usage.pluginUsage || {};
      let totalSpend = "—";
      if (cost.currentMonthCost !== void 0) totalSpend = "¥" + String(cost.currentMonthCost);
      const tokens = token.totalToken !== void 0 ? fmtInt(token.totalToken) : "—";
      if (totalSpend === "—" && tokens === "—") return "";
      return '<div class="dshBalanceUsage">' +
        '<div class="dshBalanceUsageTitle"><b>' + t("usageThisMonth") + "</b><span>" + t("all") + "</span></div>" +
        '<div class="dshBalanceRow"><span>' + t("thisMonthSpend") + "</span><span>" + totalSpend + "</span></div>" +
        '<div class="dshBalanceRow"><span>' + t("tokens") + "</span><span>" + tokens + "</span></div>" +
        "</div>";
    }

    /** Build the MiMo detail block: 余额 + 累计/今日（真实数据）+ 本月消耗（与 DeepSeek 同款结构）. */
    function mimoDetailHtml(bal) {
      if (!bal || bal.ok === false) return "";
      const data = bal.data || {};
      const cur = sym(data.currency) || "¥";
      // 余额（首行，与 DeepSeek 一致）
      let rows = '<div class="dshBalanceRow"><span>' + t("balance") + "</span><span>" + cur + (data.total !== void 0 ? data.total : "—") + "</span></div>";
      const usage = data.usage || null;
      const cost = usage ? (usage.costUsage || {}) : {};
      // 与 DeepSeek 同款：累计消费 + 今日消费/今日Token（来自 /usage/detail 逐日明细；无今日记录则显示 0）
      if (cost.totalCost !== void 0) {
        rows += '<div class="dshBalanceRow"><span>' + t("cumulativeSpend") + "</span><span>¥" + String(cost.totalCost) + "</span></div>";
      }
      const today = data.today || null;
      rows += '<div class="dshBalanceRow"><span>' + t("todaySpend") + "</span><span>" + (today ? fmtYuan(today.cost) : "¥0.00") + "</span></div>";
      rows += '<div class="dshBalanceRow"><span>' + t("todayTokens") + "</span><span>" + (today ? fmtInt(today.tokens) : "0") + "</span></div>";
      // 本月消耗区块（与 DeepSeek 同款样式）
      const usageBlock = mimoUsageHtml(usage);
      if (usageBlock) {
        rows += '<div class="dshBalanceDivider"></div>' + usageBlock;
      }
      return rows;
    }

    /** Build the MiMo daily consumption table (from /api/v1/usage/detail). */
    function mimoDailyHtml(daily) {
      if (!Array.isArray(daily) || daily.length === 0) return "";
      // 接口按日期升序返回，全部展示（一个月最多 31 行）。
      let html = '<div class="dshBalanceUsage">' +
        '<div class="dshBalanceUsageTitle"><b>' + t("dailyUsage") + "</b><span>MiMo</span></div>" +
        '<div class="dshBalanceDaily">' +
        '<div class="dshBalanceDailyHead"><span>' + t("date") + "</span><span>Token</span><span>" + t("requests") + "</span><span>" + t("spend") + "</span></div>";
      for (const d of daily) {
        const costStr = Number(d.cost) > 0 ? String(d.cost) : "0";
        html += '<div class="dshBalanceDailyRow">' +
          "<span>" + escapeHtml(d.date) + "</span>" +
          "<span>" + fmtInt(d.total) + "</span>" +
          "<span>" + fmtInt(d.requests) + "</span>" +
          "<span>¥" + costStr + "</span>" +
          "</div>";
      }
      html += "</div></div>";
      return html;
    }

    /** DeepSeek peak/off-peak period based on Beijing time (UTC+8). Peak: 09-12, 14-18. */
    function currentDeepseekPeriod() {
      const hour = (new Date().getUTCHours() + 8) % 24;
      return ((hour >= 9 && hour < 12) || (hour >= 14 && hour < 18)) ? "peak" : "offPeak";
    }

    /** Build one tab button for the provider switcher. */
    function providerTabHtml(p, bal, isActive) {
      const meta = PROVIDER_META[p.kind] || { label: p.kind };
      const label = p.label || meta.label;
      let balanceText = "—";
      let stateAttr = "";
      if (bal) {
        if (bal.ok === false) { balanceText = bal.needCookie ? t("needSetup") : t("failed"); stateAttr = ' data-state="err"'; }
        else balanceText = formatProviderBalance(bal.data);
      }
      const removeBtn =
        '<span class="dshBalanceTabMenu" data-tab-remove type="button" role="button" aria-label="' + t("remove") + '" title="' + t("remove") + '">×</span>';
      const titleCls = isActive ? ' class="dshBalanceTabTitle"' : '';
      const balanceSpan = isActive ? '' : '<span class="dshBalanceTabBal"' + stateAttr + ">" + balanceText + "</span>";
      const period = currentDeepseekPeriod();
      const periodBadge = (isActive && p.kind === "deepseek")
        ? '<span class="dshBalancePeriodBadge" data-period="' + period + '">' + t(period + "Period") + "</span>"
        : "";
      return '<button class="dshBalanceTab' + (isActive ? " active" : "") + '" type="button" data-tab="' + escapeHtml(p.id) + '">' +
        '<span' + titleCls + '>' + escapeHtml(label) + '</span>' + periodBadge + balanceSpan + removeBtn + "</button>";
    }

    /** Build the detail pane for the currently active provider. */
    function providerContentHtml(p, bal) {
      let detail = "";
      if (p.kind === "deepseek") detail = deepseekDetailHtml(lastEnvelope, lastUsage);
      else if (p.kind === "mimo") detail = mimoDetailHtml(bal);

      // 移除操作已放到 provider tab 的右键菜单里，详情区不再显示。
      let actions = "";

      let errHint = "";
      if (bal && bal.ok === false) {
        if (bal.needCookie) {
          errHint = '<div class="dshBalanceHint" style="margin-top:8px">' + t("mimoCookieHint") + "</div>" +
            '<div class="dshBalanceProvActions" style="margin-top:8px">' +
            '<button class="dshBalanceBtn" type="button" data-ai-guide-cookie data-provider-id="' + escapeHtml(p.id) + '">' + t("aiGuide") + "</button>" +
            "</div>";
        } else {
          const raw = bal.data && bal.data.raw ? String(bal.data.raw).slice(0, 260) : "";
          errHint = '<div class="dshBalanceHint" style="margin-top:8px">' + t("readFailed", String(bal.error || "").slice(0, 50)) +
            (raw ? '<br><span class="dshBalanceRawHint">' + t("rawPrefix") + escapeHtml(raw) + "</span>" : "") + "</div>";
        }
      }
      return detail + actions + errHint;
    }

    /** The "add a provider" form. */
    function addFormHtml() {
      const mimoSelected = addFormState.kind === "mimo" ? ' selected' : '';
      const deepseekSelected = addFormState.kind === "deepseek" ? ' selected' : '';
      const isMimo = addFormState.kind === "mimo";
      const isDeepseek = addFormState.kind === "deepseek";
      const aiGuide = (isMimo || isDeepseek)
        ? '<div class="dshBalanceField"><label>' + t("configMethod") + "</label>" +
          '<button class="dshBalanceBtn" type="button" data-ai-guide style="width:100%;justify-content:center">' + t("aiGuide") + "</button></div>"
        : "";
      const note = (isMimo || isDeepseek)
        ? '<div class="dshBalanceHint">' + t("aiGuideNote") + "</div>"
        : '<div class="dshBalanceHint">' + t("localKeyNote") + "</div>";
      return '<div class="dshBalanceAddForm">' +
        '<div class="dshBalanceField"><label>' + t("platform") + '</label><select class="dshBalanceInput" data-f-kind>' +
        '<option value="mimo"' + mimoSelected + ">" + t("mimoOption") + "</option>" +
        '<option value="deepseek"' + deepseekSelected + ">" + t("deepseekOption") + "</option></select></div>" +
        '<div class="dshBalanceField"><label>' + t("name") + "</label><input class=\"dshBalanceInput\" data-f-label value=\"" + escapeHtml(addFormState.label) + "\" placeholder=\"" + (addFormState.kind === "deepseek" ? t("namePlaceholderDeepseek") : t("namePlaceholderMimo")) + "\" /></div>" +
        aiGuide +
        '<div class="dshBalanceFormBtns"><button class="dshBalanceBtn" type="button" data-save>' + t("save") + "</button>" +
        '<button class="dshBalanceBtn" type="button" data-cancel>' + t("cancel") + "</button></div>" +
        note + "</div>";
    }

    /** Build the chat-based AI guide panel for MiMo Cookie configuration. */
    function aiGuideCookiePanelHtml() {
      return '<div class="dshBalanceCookiePanel">' +
        '<div class="dshBalanceHint" style="margin-bottom:4px;font-weight:600">' + t("aiChatGuideTitle") + "</div>" +
        '<div class="dshBalanceWizard">' +
        '<div class="dshBalanceWizardStep"><b>' + t("step1") + "</b><span>" + t("step1Desc") + "</span>" +
        '<span class="dshBalanceWizardLink" data-open-mimo>' + t("openMimoBalance") + "</span></div>" +
        '<div class="dshBalanceWizardStep"><b>' + t("step2") + "</b><span>" + t("step2Desc") + "</span>" +
        '<span class="dshBalanceWizardLink" data-copy-step2>' + t("copyPromptToChat") + "</span></div>" +
        '</div>' +
        '<div class="dshBalanceFormBtns"><button class="dshBalanceBtn" type="button" data-cookie-cancel>' + t("cancel") + "</button></div>" +
        '<div style="margin-top:6px"><span class="dshBalanceWizardLink" data-cookie-manual>' + t("manualPasteCookie") + "</span></div></div>";
    }

    /** Build the manual fallback textarea for Cookie configuration. */
    function manualCookiePanelHtml() {
      const preview = cookieExtracted
        ? '<code>' + escapeHtml(cookieExtracted.slice(0, 180) + (cookieExtracted.length > 180 ? '…' : '')) + '</code>'
        : t("cookieNotFound");
      const found = !!cookieExtracted;
      return '<div class="dshBalanceCookiePanel">' +
        '<div class="dshBalanceHint" style="margin-bottom:4px;font-weight:600">' + t("manualCookieTitle") + "</div>" +
        '<textarea class="dshBalanceInput dshBalanceTextarea" data-cookie-value placeholder="' + t("cookiePlaceholder") + '">' + escapeHtml(cookieEditValue) + '</textarea>' +
        '<div class="dshBalanceCookiePreview" data-found="' + found + '"><b>' + t("extractResult") + "</b>" + preview + '</div>' +
        '<div class="dshBalanceFormBtns"><button class="dshBalanceBtn" type="button" data-cookie-save>' + t("save") + '</button>' +
        '<button class="dshBalanceBtn" type="button" data-cookie-cancel>' + t("cancel") + '</button></div>' +
        '<div style="margin-top:6px"><span class="dshBalanceWizardLink" data-cookie-guide>' + t("backToAiGuide") + "</span></div></div>";
    }

    /** Build the MiMo Cookie configuration panel (AI guide or manual fallback). */
    function cookiePanelHtml() {
      return cookieManualMode ? manualCookiePanelHtml() : aiGuideCookiePanelHtml();
    }

    /** Build a small hint about the last dsh settings sync. */
    function syncHintHtml() {
      if (!lastSyncResult) return "";
      if (!lastSyncResult.ok) {
        return '<div class="dshBalanceSyncHint" data-state="err">' + t("syncFailed", escapeHtml(String(lastSyncResult.error || "").slice(0, 60))) + "</div>";
      }
      if (lastSyncResult.added > 0) {
        return '<div class="dshBalanceSyncHint" data-state="ok">' + t("syncAddedN", lastSyncResult.added) + "</div>";
      }
      return "";
    }

    /** Build the popover HTML from current state. */
    function popoverHtml() {
      const header = '<h4>' + t("aiBalance") + '<button class="dshBalanceAddBtn" type="button" data-add>' + t("add") + "</button></h4>";
      const syncHint = showAddForm ? "" : syncHintHtml();
      let body;
      if (showAddForm) {
        body = addFormHtml();
      } else if (cookieEditId) {
        body = cookiePanelHtml();
      } else {
        body = '<div class="dshBalanceProviders">';
        if (providers.length === 0) {
          body += '<div class="dshBalanceHint">' + t("noProviders") + "</div>";
        } else {
          const activeP = providers.find((p) => p.id === activeProviderId) || activeProvider();
          body += '<div class="dshBalanceTabsRow">';
          body += '<div class="dshBalanceTabs" data-tabs>';
          body += providerTabHtml(activeP, balances[activeP.id], true);
          body += '</div>';
          if (providers.length > 1) {
            body += '<button class="dshBalanceSwitchBtn" type="button" data-switch title="' + t("switch") + '">' + t("switch") + "</button>";
          }
          body += '</div><div class="dshBalanceTabContent">' + providerContentHtml(activeP, balances[activeP.id]) + "</div>";
        }
        body += "</div>";
      }
      const updated = lastUpdated ? lastUpdated.toLocaleTimeString() : "—";
      const versionHtml = versionHtmlOf(lastVersion);
      const errorPanel = updateErrorDetail ? updateErrorHtml(updateErrorDetail) : "";
      return header + syncHint + body +
        '<div class="dshBalanceFoot">' + versionHtml +
        '<span style="display:flex;align-items:center;gap:8px">' +
        '<button class="dshBalanceBtn" type="button" data-refresh>' + t("refresh") + "</button>" +
        '<span>' + t("updatedAt") + updated + "</span></span></div>" + errorPanel;
    }

    /** Render the update-failure detail panel shown below the footer. */
    function updateErrorHtml(detail) {
      const summary = String(detail.error || t("updateFailed"));
      const text = (detail.output || "").trim();
      const snippet = text.slice(-500) || summary;
      const escaped = snippet.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
      return '<div class="dshBalanceUpdateErr">' +
        '<div class="dshBalanceUpdateErrHead">' +
        '<span>' + t("updateFailed") + "</span>" +
        '<button class="dshBalanceUpdateErrClose" type="button" data-update-err-close aria-label="close">×</button>' +
        "</div>" +
        '<pre class="dshBalanceUpdateErrBody" title="' + t("updateFailed") + '">' + escaped + "</pre>" +
        '<button class="dshBalanceBtn" type="button" data-update-err-copy>' + t("copyError") + "</button>" +
        "</div>";
    }

    /** Build the npm version snippet shown in the footer (always a clickable button). */
    function versionHtmlOf(versionEnvelope) {
      if (Date.now() < updateSuccessUntil) {
        return '<span class="dshBalanceVersion" data-state="ok">' + t("updateSuccess") + "</span>";
      }
      if (!versionEnvelope) {
        return '<span class="dshBalanceVersion" data-state="ok"><button class="dshBalanceVersionBtn" type="button" data-update-cmd>' + t("checkUpdate") + "</button></span>";
      }
      if (versionEnvelope.ok === false) {
        return '<span class="dshBalanceVersion" data-state="err"><button class="dshBalanceVersionBtn" type="button" data-update-cmd>' + t("checkUpdate") + "</button></span>";
      }
      const local = versionEnvelope.local || "?";
      if (versionEnvelope.updateAvailable && versionEnvelope.latest) {
        return '<span class="dshBalanceVersion" data-state="update">' +
          'v' + local + " → v" + versionEnvelope.latest +
          '<button class="dshBalanceVersionBtn" type="button" data-update-cmd>' + t("update") + "</button>" +
          "</span>";
      }
      return '<span class="dshBalanceVersion" data-state="ok">' +
        'v' + local + '<button class="dshBalanceVersionBtn" type="button" data-update-cmd>' + t("checkUpdate") + "</button>" +
        "</span>";
    }

    /** Handle the "save" action from the add form. */
    async function onSaveProvider() {
      if (popRef === null) return;
      const kind = (popRef.querySelector("[data-f-kind]")?.value || "mimo");
      const label = (popRef.querySelector("[data-f-label]")?.value || "").trim();
      if (!label) {
        window.alert(t("fillName"));
        return;
      }
      const saveBtn = popRef.querySelector("[data-save]");
      if (saveBtn !== null) { saveBtn.disabled = true; saveBtn.textContent = t("saving"); }
      const body = { label, kind };
      const result = await saveProvider(body);
      if (result && result.ok) {
        addFormState = { kind: "mimo", label: "", key: "", cookie: "" };
        showAddForm = false;
        await refresh(true);
      } else {
        if (saveBtn !== null) { saveBtn.disabled = false; saveBtn.textContent = t("save"); }
        window.alert(t("saveFailed", result && result.error ? result.error : "unknown"));
      }
    }

    /** Handle the "remove" action for a provider. */
    async function onRemoveProvider(id) {
      if (!window.confirm(t("confirmRemove"))) return;
      await removeProvider(id);
      if (activeProviderId === id) activeProviderId = null;
      await refresh(true);
    }

    /** Handle the "save cookie" action from the MiMo cookie panel. */
    async function onSaveCookie() {
      if (popRef === null || !cookieEditId) return;
      if (!cookieExtracted) { window.alert(t("pasteCookieHint")); return; }
      const saveBtn = popRef.querySelector("[data-cookie-save]");
      if (saveBtn !== null) { saveBtn.disabled = true; saveBtn.textContent = t("saving"); }
      const result = await saveProvider({ id: cookieEditId, kind: "mimo", cookie: cookieExtracted });
      if (result && result.ok) {
        cookieEditId = null; cookieEditValue = ""; cookieExtracted = "";
        await refresh(true);
      } else {
        if (saveBtn !== null) { saveBtn.disabled = false; saveBtn.textContent = t("save"); }
        window.alert(t("saveFailed", result && result.error ? result.error : "unknown"));
      }
    }

    /** Close the context menu if it is open. */
    function closeContextMenu() {
      if (contextMenuEl !== null) {
        contextMenuEl.remove();
        contextMenuEl = null;
      }
    }

    /** Render a dropdown menu to switch between providers. */
    function renderProviderSwitchMenu(x, y) {
      closeContextMenu();
      if (popRef === null || providers.length <= 1) return;
      const menu = document.createElement("div");
      menu.className = "dshBalanceCtxMenu";
      for (const p of providers) {
        const meta = PROVIDER_META[p.kind] || { label: p.kind };
        const label = p.label || meta.label;
        const bal = balances[p.id];
        let balanceText = "—";
        if (bal) {
          if (bal.ok === false) balanceText = bal.needCookie ? t("needSetup") : t("failed");
          else balanceText = formatProviderBalance(bal.data);
        }
        const item = document.createElement("button");
        item.className = "dshBalanceCtxMenuItem";
        item.type = "button";
        item.textContent = label + "  " + balanceText;
        if (p.id === activeProviderId) {
          item.disabled = true;
          item.title = currentLang === "en" ? "Currently viewing" : "当前正在查看";
        } else {
          item.addEventListener("click", () => {
            closeContextMenu();
            activeProviderId = p.id;
            renderValue(lastEnvelope, lastUsage);
            renderPopover();
          });
        }
        menu.appendChild(item);
      }
      popRef.appendChild(menu);
      contextMenuEl = menu;
      const popRect = popRef.getBoundingClientRect();
      let left = x;
      let top = y;
      const menuW = menu.offsetWidth || 160;
      const menuH = menu.offsetHeight || 100;
      if (left + menuW > popRect.width) left = Math.max(4, popRect.width - menuW - 4);
      if (left < 4) left = 4;
      if (top + menuH > popRect.height) top = Math.max(4, popRect.height - menuH - 4);
      if (top < 4) top = 4;
      menu.style.left = left + "px";
      menu.style.top = top + "px";
    }

    /** Close the popover and detach the outside-click listener. */
    function closePopover() {
      if (popRef === null) return;
      closeContextMenu();
      popRef.remove();
      popRef = null;
      if (outsideHandler !== null) {
        document.removeEventListener("mousedown", outsideHandler);
        outsideHandler = null;
      }
      // 关闭后重置面板状态（保留 activeProviderId，让入口与弹窗 Tab 保持一致）。
      showAddForm = false;
      cookieEditId = null;
      cookieEditValue = "";
      cookieExtracted = "";
      cookieManualMode = false;
      addFormState = { kind: "mimo", label: "", key: "", cookie: "" };
    }

    /** Reposition the open popover against the entry, clamped inside the viewport. */
    function positionPopover() {
      if (popRef === null || entryRef === null) return;
      const margin = 8;
      const rect = entryRef.getBoundingClientRect();
      const popW = popRef.offsetWidth || 280;
      const popH = popRef.offsetHeight || 220;
      // 默认贴着侧边栏入口右侧展开；右侧放不下就放到入口左侧。
      let left = rect.right + margin;
      if (left + popW > window.innerWidth - margin) {
        left = rect.left - popW - margin;
      }
      if (left < margin) left = margin;
      // 顶部与入口对齐，超出底部则向上夹回视口内。
      let top = rect.top;
      if (top + popH > window.innerHeight - margin) {
        top = Math.max(margin, window.innerHeight - popH - margin);
      }
      popRef.style.left = left + "px";
      popRef.style.top = top + "px";
    }

    /** Toggle the detail popover relative to the entry. */
    function togglePopover() {
      if (popRef !== null) {
        closePopover();
        return;
      }
      const pop = document.createElement("div");
      pop.className = "dshBalancePop";
      document.body.appendChild(pop);
      popRef = pop;
      // 点击弹窗内非菜单区域时收起右键菜单。
      pop.addEventListener("mousedown", (e) => {
        if (contextMenuEl && !contextMenuEl.contains(e.target)) closeContextMenu();
      });
      // renderPopover() 内部会按入口位置重新定位弹窗。
      renderPopover();

      outsideHandler = (event) => {
        const target = event.target;
        if (!(target instanceof Node)) return;
        if (entryRef && entryRef.contains(target)) return;
        if (pop.contains(target)) return;
        closePopover();
      };
      document.addEventListener("mousedown", outsideHandler);
    }

    let entryRef = null;
    let popRef = null;
    let outsideHandler = null;
    let lastEnvelope = null;
    let lastUsage = null;
    let lastVersion = null;
    let lastUpdated = null;
    let providers = [];
    let balances = {};
    /** Id of the provider currently shown in the tabbed popover. */
    let activeProviderId = null;
    let showAddForm = false;
    /** Current values of the "add provider" form; survives popover re-renders. */
    let addFormState = { kind: "mimo", label: "", key: "", cookie: "" };
    /** When set, the popover shows the MiMo cookie editor for this provider id. */
    let cookieEditId = null;
    /** Text of the cookie editor textarea; survives popover re-renders. */
    let cookieEditValue = "";
    /** Cookie string extracted from the raw pasted cURL/headers by the AI helper. */
    let cookieExtracted = "";
    /** When true, the cookie editor shows the manual textarea instead of the AI chat guide. */
    let cookieManualMode = false;
    /** Provider switch dropdown menu state. */
    let contextMenuX = 0;
    let contextMenuY = 0;
    let contextMenuEl = null;
    /** Result of the most recent /ai-balances-sync call (used for UI hint). */
    let lastSyncResult = null;
    let timer = null;
    let versionTimer = null;
    let updateSuccessUntil = 0;
    /** When the last update attempt failed, hold {error, output} so the user can inspect it. */
    let updateErrorDetail = null;

    /** One refresh cycle: fetch balance + usage + providers, update entry and popover. */
    async function refresh(manual) {
      const valueEl = entryRef && entryRef.querySelector(".dshBalanceValue");
      if (valueEl && !manual) valueEl.dataset.state = "loading";
      try {
        // Sync dsh model providers first so newly configured keys appear automatically.
        const syncResult = await fetchSync();
        lastSyncResult = syncResult;
        const [envelope, usage] = await Promise.all([fetchBalance(), fetchUsage()]);
        lastEnvelope = envelope;
        lastUsage = usage;
        providers = (syncResult && Array.isArray(syncResult.providers)) ? syncResult.providers : ((await fetchProviders()) || []);
        const others = providers.filter((p) => p.kind !== "deepseek");
        const balResults = await Promise.all(others.map((p) => fetchProviderBalance(p.id).then((b) => [p.id, b])));
        balances = {};
        for (const [id, b] of balResults) balances[id] = b;
        balances["deepseek"] = envelope; // 侧边栏/详情用同一份
        lastUpdated = new Date();
        renderValue(envelope, usage);
        // 正在用 AI 引导配置 Cookie 时，不重绘弹窗以免打断输入焦点。
        if (!cookieEditId) renderPopover();
      } catch (e) {
        if (entryRef) {
          const v = entryRef.querySelector(".dshBalanceValue");
          if (v) { v.dataset.state = "err"; v.textContent = t("failed"); }
        }
        lastEnvelope = { ok: false, error: String(e?.message ?? e) };
        renderPopover();
      }
    }

    /** Check npm version; updates the popover footer when done. */
    async function checkVersion() {
      try {
        lastVersion = await fetchVersion();
        renderPopover();
      } catch {
        // Silent: version info is best-effort.
      }
    }

    /** Apply the client half: mount the widget and start polling. */
    function apply(ctx) {
      ensureStyle();
      if (typeof document !== "undefined" && document.querySelector("[data-dsh-balance-entry]") !== null) return () => {};
      // 用 dsh 的 LocaleRuntime 服务读取/订阅语言（ctx.locale 由 @deepseek-ai/dsh-client-locale provide）。
      let offLocaleChange = null;
      try {
        const snap = ctx.locale && typeof ctx.locale.getLocale === "function" ? ctx.locale.getLocale() : null;
        if (snap && typeof snap.active === "string") currentLang = snap.active === "en" ? "en" : "zh";
        if (ctx.locale && typeof ctx.locale.subscribe === "function") {
          offLocaleChange = ctx.locale.subscribe(() => {
            const s = ctx.locale.getLocale();
            const next = s && s.active === "en" ? "en" : "zh";
            if (next !== currentLang) {
              currentLang = next;
              applyLangChange(next);
            }
          });
        }
      } catch { /* locale service optional */ }
      const effect = ctx.effect(() => {
        const entry = createEntry("compact");
        entryRef = entry;
        entry.addEventListener("click", togglePopover);

        let root;
        let mode = "toolbar";
        let placed = false;

        const tryPlace = () => {
          if (root !== void 0 && !root.isConnected) { rootObserver.disconnect(); root = void 0; placed = false; }
          if (placed) {
            if (document.body.contains(entry)) return;
            rootObserver.disconnect(); root = void 0; placed = false;
          }
          // Prefer bottom toolbar (Settings row).
          root = bottomToolbar();
          if (root !== void 0) {
            mode = "toolbar";
            if (!entry.classList.contains("compact")) entry.classList.add("compact");
            placed = placeToolbar(root, entry);
          }
          // Fall back to sidebar under New Session.
          if (!placed) {
            root = sidebarRoot();
            if (root !== void 0) {
              mode = "sidebar";
              entry.classList.remove("compact");
              placed = placeSidebar(root, entry);
            }
          }
          if (placed) rootObserver.observe(root, { childList: true, subtree: true });
        };

        const waitObserver = new MutationObserver(() => tryPlace());
        waitObserver.observe(document.body, { childList: true, subtree: true });
        const rootObserver = new MutationObserver(() => {
          if (root === void 0 || !root.isConnected) { placed = false; tryPlace(); return; }
          if (!root.contains(entry)) placed = mode === "toolbar" ? placeToolbar(root, entry) : placeSidebar(root, entry);
        });
        tryPlace();

        refresh(false);
        checkVersion();
        timer = setInterval(() => refresh(false), REFRESH_MS);
        // 版本检查频率低一些（5 分钟），避免对 npm 造成压力。
        versionTimer = setInterval(() => checkVersion(), 300000);

        return () => {
          waitObserver.disconnect();
          rootObserver.disconnect();
          if (offLocaleChange !== null) { try { offLocaleChange(); } catch { /* ignore */ } offLocaleChange = null; }
          if (timer !== null) clearInterval(timer);
          if (versionTimer !== null) clearInterval(versionTimer);
          if (outsideHandler !== null) {
            document.removeEventListener("mousedown", outsideHandler);
            outsideHandler = null;
          }
          updateSuccessUntil = 0;
          if (popRef !== null) popRef.remove();
          entry.remove();
          entryRef = null;
          popRef = null;
        };
      }, "dsh-deepseek-balance-widget: mount");
      return effect;
    }

    exports.apply = apply;
    /** Declare the locale service dependency so ctx.locale is available (dsh i18n). */
    exports.inject = ["locale"];
    return module.exports;
  }
});
