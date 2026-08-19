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
    /** Auto-refresh cadence, milliseconds. */
    const REFRESH_MS = 30000;
    /** How long the "update succeeded, restart dsh" message stays visible, milliseconds. */
    const UPDATE_SUCCESS_MS = 5000;

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
        ".dshBalancePop{position:fixed;z-index:9999;width:280px;background:#1b1f27;border:1px solid rgba(255,255,255,.1);border-radius:12px;box-shadow:0 12px 40px rgba(0,0,0,.5);padding:14px 16px;color:#e6e9ef;font-size:13px;line-height:1.5}",
        ".dshBalancePop h4{margin:0 0 10px;font-size:14px;font-weight:600;display:flex;align-items:center;gap:8px}",
        ".dshBalanceRow{display:flex;justify-content:space-between;gap:12px;padding:3px 0}",
        ".dshBalanceRow span:first-child{color:#9aa4b2}",
        ".dshBalanceRow span:last-child{font-variant-numeric:tabular-nums}",
        ".dshBalanceFoot{display:flex;justify-content:space-between;align-items:center;margin-top:12px;padding-top:10px;border-top:1px solid rgba(255,255,255,.08);color:#7b8494;font-size:11px}",
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
        ".dshBalanceUsage{display:block;margin-top:12px;padding-top:11px;border-top:1px solid rgba(255,255,255,.08)}",
        ".dshBalanceUsageTitle{font-size:11px;color:#7b8494;letter-spacing:.04em;margin:0 0 2px;display:flex;align-items:baseline;gap:6px}",
        ".dshBalanceUsageTitle b{color:#9aa4b2;font-weight:600;text-transform:uppercase}",
        ".dshBalanceHint{font-size:12px;color:#7b8494;line-height:1.6;margin:2px 0 0}"
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

    /** One labeled stat column (label above value). */
    function statHtml(label, valueHtml) {
      return '<span class="dshBalanceStat"><span class="dshBalanceStatLabel">' + label + "</span>" + valueHtml + "</span>";
    }

    /** Build the entry row (a detached button). */
    function createEntry(variant) {
      const entry = document.createElement("button");
      entry.type = "button";
      entry.dataset.dshBalanceEntry = "";
      entry.className = "dshBalanceEntry" + (variant === "compact" ? " compact" : "");
      entry.setAttribute("aria-label", "DeepSeek 余额（余额 / 今日消费 / 今日Token）");
      entry.innerHTML =
        statHtml("余额", '<span class="dshBalanceValue" data-state="loading">…</span>') +
        statHtml("今日消费", '<span class="dshBalanceToday" data-state="loading">…</span>') +
        statHtml("今日Token", '<span class="dshBalanceTodayTok" data-state="loading">…</span>');
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
      btn.textContent = "检查中…";
      const version = await fetchVersion();
      lastVersion = version;
      if (!version || version.ok === false) {
        btn.textContent = "检查失败";
        btn.title = version ? String(version.error || "") : "";
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; btn.title = ""; }, 2000);
        return;
      }
      if (!version.updateAvailable) {
        btn.textContent = "已是最新";
        setTimeout(() => { btn.textContent = originalText; btn.disabled = false; }, 1500);
        return;
      }
      btn.textContent = "更新中…";
      const result = await updatePackage();
      if (result.ok) {
        btn.textContent = "成功，请重启 dsh";
        btn.disabled = true;
        // Keep the success message visible for a while before reverting to version info.
        updateSuccessUntil = Date.now() + UPDATE_SUCCESS_MS;
        setTimeout(() => checkVersion(), UPDATE_SUCCESS_MS);
      } else {
        btn.textContent = "更新失败";
        btn.title = String(result.error || "更新失败") + (result.output ? "\n" + result.output.slice(-200) : "");
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

    /** Compact number for the entry (1.2万 style). */
    function fmtCompact(n) {
      if (n === void 0 || n === null || n === "") return "—";
      const v = Number(String(n).replace(/,/g, ""));
      if (!Number.isFinite(v)) return String(n);
      if (v >= 1e8) return (v / 1e8).toFixed(1) + "亿";
      if (v >= 1e4) return (v / 1e4).toFixed(1) + "万";
      return v.toLocaleString();
    }

    /** 宿主端返回的今日消费是纯数字（如 "0.00"），弹窗里补上 ¥ 展示。 */
    function fmtYuan(s) {
      const v = String(s ?? "");
      if (/^[\d.]+$/.test(v)) return "¥" + v;
      return v;
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

    /** Render balance + today stats into the entry spans. */
    function renderValue(envelope, usageEnvelope) {
      const valueEl = entryRef && entryRef.querySelector(".dshBalanceValue");
      const todayEl = entryRef && entryRef.querySelector(".dshBalanceToday");
      const tokEl = entryRef && entryRef.querySelector(".dshBalanceTodayTok");

      // 余额（入口处不显示货币符号）
      if (valueEl !== null) {
        if (!envelope || envelope.ok === false) {
          valueEl.dataset.state = "err";
          valueEl.textContent = "失败";
        } else {
          const info = (envelope.data && envelope.data.balance_infos && envelope.data.balance_infos[0]) || null;
          if (info === null) {
            valueEl.dataset.state = "ok";
            valueEl.textContent = "—";
          } else {
            const total = info.total_balance;
            valueEl.dataset.state = "ok";
            valueEl.textContent = total !== void 0 ? total : "—";
          }
        }
      }

      // 今日消费 / 今日Token（实时数据优先；未配置/不可用时显示中性占位）
      const usage = usageStateOf(usageEnvelope);
      if (todayEl !== null) {
        todayEl.dataset.state = usage.state === "ok" ? "ok" : usage.state;
        todayEl.textContent = usage.src && usage.src.todaySpend ? String(usage.src.todaySpend).replace(/[¥$]/g, "").replace(" CNY", "") : "—";
      }
      if (tokEl !== null) {
        tokEl.dataset.state = usage.state === "ok" ? "ok" : usage.state;
        tokEl.textContent = usage.src ? fmtCompact(usage.src.todayTokens) : "—";
      }
    }

    /** Update the detail popover if it is open. */
    function renderPopover(envelope, usageEnvelope) {
      if (popRef === null) return;
      popRef.innerHTML = popoverHtml(envelope, usageEnvelope);
      const btn = popRef.querySelector(".dshBalanceBtn");
      if (btn !== null) btn.addEventListener("click", () => { refresh(true); checkVersion(); });
      const updateBtn = popRef.querySelector("[data-update-cmd]");
      if (updateBtn !== null) {
        updateBtn.addEventListener("click", () => handleUpdateClick(updateBtn));
      }
    }

    /** Build the usage block: live platform data first, neutral hint otherwise. */
    function usageHtmlOf(usageEnvelope) {
      const usage = usageStateOf(usageEnvelope);
      if (!usage.src) {
        const hint = usage.state === "err"
          ? "用量接口不可用（" + String(usage.error || "").slice(0, 60) + "）"
          : "未配置 DEEPSEEK_PLATFORM_TOKEN，仅显示余额。登录 platform.deepseek.com 后把 userToken 写入 ~/.dsh/.credentials.yaml 即可显示实时用量（可选）。";
        return '<div class="dshBalanceUsage">' +
          '<div class="dshBalanceUsageTitle"><b>本月消耗</b><span>未启用</span></div>' +
          '<div class="dshBalanceHint">' + hint + "</div>" +
          "</div>";
      }
      const src = usage.src;
      return '<div class="dshBalanceUsage">' +
        '<div class="dshBalanceUsageTitle"><b>' + (src.period || "本月") + "消耗</b><span>" + (src.apiKey || "全部") + "</span></div>" +
        '<div class="dshBalanceRow"><span>本月消费</span><span>' + String(src.totalSpend ?? "—") + "</span></div>" +
        '<div class="dshBalanceRow"><span>API 请求次数</span><span>' + String(src.requestCount ?? "—") + "</span></div>" +
        '<div class="dshBalanceRow"><span>Tokens</span><span>' + String(src.tokens ?? "—") + "</span></div>" +
        "</div>";
    }

    /** Build the popover HTML from an envelope. */
    function popoverHtml(envelope, usageEnvelope) {
      const info = envelope && envelope.data && envelope.data.balance_infos && envelope.data.balance_infos[0];
      // 宿主已把 currency 清空（入口不显示货币符号）；弹窗里仍展示 ¥。
      const cur = info ? (sym(info.currency) || "¥") : "¥";

      let rows = "";
      if (envelope && envelope.error && !info) {
        rows += '<div class="dshBalanceRow"><span>错误</span><span>' + String(envelope.error).slice(0, 80) + "</span></div>";
      } else if (!info) {
        rows += '<div class="dshBalanceRow"><span>余额</span><span>—</span></div>';
      } else {
        const total = info.total_balance;
        rows += '<div class="dshBalanceRow"><span>余额</span><span>' + cur + (total !== void 0 ? total : "—") + "</span></div>";
      }
      // 累计消费（全部时间）——放在余额下面，不属于「本月消耗」区块
      const usage = usageStateOf(usageEnvelope);
      const usageSrc = usage.src;
      if (usageSrc && usageSrc.cumulativeSpend) {
        rows += '<div class="dshBalanceRow"><span>累计消费</span><span>' + String(usageSrc.cumulativeSpend) + "</span></div>";
      }
      if (usageSrc && usageSrc.todaySpend) {
        rows += '<div class="dshBalanceRow"><span>今日消费</span><span>' + fmtYuan(usageSrc.todaySpend) + "</span></div>";
      }
      if (usageSrc && usageSrc.todayTokens) {
        rows += '<div class="dshBalanceRow"><span>今日Token</span><span>' + String(usageSrc.todayTokens) + "</span></div>";
      }

      const updated = lastUpdated ? lastUpdated.toLocaleTimeString() : "—";

      // 用量区块：实时平台数据优先，中性提示兜底
      const usageHtml = usageHtmlOf(usageEnvelope);

      // 版本信息
      const versionHtml = versionHtmlOf(lastVersion);

      return "<h4>DeepSeek 余额</h4>" + rows + usageHtml +
        '<div class="dshBalanceFoot">' + versionHtml +
        '<span style="display:flex;align-items:center;gap:8px">' +
        '<span>更新于 ' + updated + "</span>" +
        '<button class="dshBalanceBtn" type="button">刷新</button></span></div>';
    }

    /** Build the npm version snippet shown in the footer (always a clickable button). */
    function versionHtmlOf(versionEnvelope) {
      if (Date.now() < updateSuccessUntil) {
        return '<span class="dshBalanceVersion" data-state="ok">成功，请重启 dsh</span>';
      }
      if (!versionEnvelope) {
        return '<span class="dshBalanceVersion" data-state="ok"><button class="dshBalanceVersionBtn" type="button" data-update-cmd>检查更新</button></span>';
      }
      if (versionEnvelope.ok === false) {
        return '<span class="dshBalanceVersion" data-state="err"><button class="dshBalanceVersionBtn" type="button" data-update-cmd>检查更新</button></span>';
      }
      const local = versionEnvelope.local || "?";
      if (versionEnvelope.updateAvailable && versionEnvelope.latest) {
        return '<span class="dshBalanceVersion" data-state="update">' +
          'v' + local + " → v" + versionEnvelope.latest +
          '<button class="dshBalanceVersionBtn" type="button" data-update-cmd>更新</button>' +
          "</span>";
      }
      return '<span class="dshBalanceVersion" data-state="ok">' +
        'v' + local + '<button class="dshBalanceVersionBtn" type="button" data-update-cmd>检查更新</button>' +
        "</span>";
    }

    /** Close the popover and detach the outside-click listener. */
    function closePopover() {
      if (popRef === null) return;
      popRef.remove();
      popRef = null;
      if (outsideHandler !== null) {
        document.removeEventListener("mousedown", outsideHandler);
        outsideHandler = null;
      }
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
      renderPopover(lastEnvelope, lastUsage);
      const rect = entryRef.getBoundingClientRect();
      const popHeight = pop.offsetHeight || 220;
      const spaceBelow = window.innerHeight - rect.bottom;
      let top;
      if (spaceBelow < popHeight + 12 && rect.top > popHeight + 12) {
        top = rect.top - popHeight - 8;
      } else {
        top = rect.bottom + 8;
      }
      pop.style.left = Math.max(8, Math.min(rect.left, window.innerWidth - 296)) + "px";
      pop.style.top = top + "px";

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
    let timer = null;
    let versionTimer = null;
    let updateSuccessUntil = 0;

    /** One refresh cycle: fetch balance + usage, update entry stats and popover. */
    async function refresh(manual) {
      const valueEl = entryRef && entryRef.querySelector(".dshBalanceValue");
      if (valueEl && !manual) valueEl.dataset.state = "loading";
      try {
        const [envelope, usage] = await Promise.all([fetchBalance(), fetchUsage()]);
        lastEnvelope = envelope;
        lastUsage = usage;
        lastUpdated = new Date();
        renderValue(envelope, usage);
        renderPopover(envelope, usage);
      } catch (e) {
        if (entryRef) {
          const v = entryRef.querySelector(".dshBalanceValue");
          if (v) { v.dataset.state = "err"; v.textContent = "失败"; }
        }
        lastEnvelope = { ok: false, error: String(e?.message ?? e) };
        renderPopover(lastEnvelope, lastUsage);
      }
    }

    /** Check npm version; updates the popover footer when done. */
    async function checkVersion() {
      try {
        lastVersion = await fetchVersion();
        renderPopover(lastEnvelope, lastUsage);
      } catch {
        // Silent: version info is best-effort.
      }
    }

    /** Apply the client half: mount the widget and start polling. */
    function apply(ctx) {
      ensureStyle();
      if (typeof document !== "undefined" && document.querySelector("[data-dsh-balance-entry]") !== null) return () => {};
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
    exports.inject = [];
    return module.exports;
  }
});
