import { launchEnvironmentOf } from "@deepseek-ai/dsh-launch-environment";
import { readFile, stat } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { spawn } from "node:child_process";

/** Plugin id; must match the cordis.patch.yml insert id. */
const name = "deepseek-balance-widget";

/** Services required before this plugin can mount its route. */
const inject = ["webServer", "credentials"];

/** NPM registry endpoint for this package (public access, no auth). */
const NPM_REGISTRY_URL = "https://registry.npmjs.org/dsh-deepseek-balance-widget/latest";

/** Absolute path to this plugin's package root (where package.json lives). */
const PLUGIN_ROOT = (() => {
  try {
    return dirname(dirname(fileURLToPath(import.meta.url)));
  } catch {
    return process.cwd();
  }
})();

/** The directory that should run npm install to update this plugin. */
const UPDATE_CWD = (() => {
  // If the plugin lives under a node_modules folder, run npm install in the
  // project/profile root (the parent of node_modules). This covers the
  // standard dsh profile layout: ~/.dsh/profiles/web/node_modules/<pkg>/.
  const parts = PLUGIN_ROOT.replace(/\\/g, "/").split("/");
  const nmIndex = parts.lastIndexOf("node_modules");
  if (nmIndex > 0) {
    return parts.slice(0, nmIndex).join("/");
  }
  return PLUGIN_ROOT;
})();

/** Local package.json version (read once at startup). */
const LOCAL_VERSION = await (async () => {
  try {
    const base = dirname(fileURLToPath(import.meta.url));
    const pkg = JSON.parse(await readFile(resolve(base, "../package.json"), "utf8"));
    return pkg.version || "0.0.0";
  } catch {
    return "0.0.0";
  }
})();

/** DeepSeek official balance endpoint (OpenAI-compatible auth). */
const BALANCE_URL = "https://api.deepseek.com/user/balance";

/** DeepSeek Platform private usage endpoints (require a platform userToken). */
const PLATFORM = "https://platform.deepseek.com";
const USAGE_AMOUNT_URL = `${PLATFORM}/api/v0/usage/amount?month=__MONTH__&year=__YEAR__`;
const USAGE_COST_URL = `${PLATFORM}/api/v0/usage/cost?month=__MONTH__&year=__YEAR__`;
const PLATFORM_HEADERS = {
  "x-app-version": "1.0.0",
  Accept: "*/*",
  Referer: "https://platform.deepseek.com/usage",
  Origin: "https://platform.deepseek.com",
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36"
};

/**
 * Query the NPM registry for the latest published version of this package.
 * @returns {Promise<{ok:boolean, local:string, latest?:string, updateAvailable?:boolean, error?:string}>}
 */
async function queryNpmVersion() {
  let response;
  try {
    response = await fetch(NPM_REGISTRY_URL, {
      method: "GET",
      headers: { Accept: "application/json" }
    });
  } catch (error) {
    return { ok: false, local: LOCAL_VERSION, error: `network: ${String(error?.message ?? error)}` };
  }
  let data = null;
  try {
    data = await response.json();
  } catch {
    const text = await response.text();
    return { ok: false, local: LOCAL_VERSION, error: `bad json (HTTP ${response.status})` };
  }
  const latest = data?.version;
  if (typeof latest !== "string") {
    return { ok: false, local: LOCAL_VERSION, error: "version field missing" };
  }
  // Simple semantic-ish comparison: split by dot and compare numeric parts.
  const toParts = (v) => String(v).split(".").map((p) => Number.parseInt(p, 10) || 0);
  const localParts = toParts(LOCAL_VERSION);
  const latestParts = toParts(latest);
  let updateAvailable = false;
  for (let i = 0; i < Math.max(localParts.length, latestParts.length); i++) {
    const a = localParts[i] ?? 0;
    const b = latestParts[i] ?? 0;
    if (b > a) { updateAvailable = true; break; }
    if (b < a) { break; }
  }
  return { ok: true, local: LOCAL_VERSION, latest, updateAvailable };
}

/** @returns {Promise<boolean>} whether the given path exists. */
async function fileExists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * Detect the package manager used by UPDATE_CWD.
 * @returns {Promise<"pnpm" | "npm">}
 */
async function detectPackageManager() {
  const pnpmLock = resolve(UPDATE_CWD, "pnpm-lock.yaml");
  const pnpmLockYml = resolve(UPDATE_CWD, "pnpm-lock.yml");
  if (await fileExists(pnpmLock) || await fileExists(pnpmLockYml)) return "pnpm";
  return "npm";
}

/**
 * Run the package-manager update command for this package in the discovered project root.
 * Uses shell mode on Windows so that .cmd scripts (npm.cmd / pnpm.cmd) can actually spawn.
 * @returns {Promise<{ok:boolean, output:string, error?:string}>}
 */
async function runPackageUpdate() {
  const pm = await detectPackageManager();
  const isWin = process.platform === "win32";
  const cmd = isWin ? (pm === "pnpm" ? "pnpm.cmd" : "npm.cmd") : pm;
  const args = pm === "pnpm"
    ? ["add", "dsh-deepseek-balance-widget@latest"]
    : ["install", "dsh-deepseek-balance-widget@latest"];
  return new Promise((resolve) => {
    const child = spawn(cmd, args, {
      cwd: UPDATE_CWD,
      shell: isWin,
      env: { ...process.env, NPM_CONFIG_FUND: "false", NPM_CONFIG_AUDIT: "false" }
    });
    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => { stdout += String(chunk); });
    child.stderr.on("data", (chunk) => { stderr += String(chunk); });
    child.on("error", (error) => {
      resolve({ ok: false, output: stdout + stderr, error: String(error?.message ?? error) });
    });
    child.on("close", (code) => {
      const output = (stdout + "\n" + stderr).trim();
      if (code === 0) {
        resolve({ ok: true, output: output.slice(-800) });
      } else {
        resolve({ ok: false, output, error: `${pm} ${args.join(" ")} exited with code ${code}` });
      }
    });
  });
}

/**
 * Query the DeepSeek balance API for one key.
 * @param {string} apiKey - the resolved DeepSeek API key.
 * @returns the normalized envelope ({ ok, status, data }).
 */
async function queryBalance(apiKey) {
  let response;
  try {
    response = await fetch(BALANCE_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "application/json"
      }
    });
  } catch (error) {
    return { ok: false, status: 0, error: `network: ${String(error?.message ?? error)}` };
  }
  const text = await response.text();
  let data = null;
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text.slice(0, 512) };
  }
  return { ok: response.ok, status: response.status, data };
}

/**
 * Resolve the DeepSeek key from the credential seam or launch environment.
 * The credential seam reads THIS machine's own `$DSH_HOME/.credentials.yaml`
 * (or the ambient environment), so every user queries with their own key and
 * sees their own balance. Nothing is ever hardcoded in this plugin.
 * @param {import("@deepseek-ai/cordis").Context} ctx - plugin context.
 * @returns {Promise<string|undefined>} the key, or undefined when unset.
 */
async function resolveKey(ctx) {
  if (ctx.credentials !== void 0) {
    const hit = await ctx.credentials.resolve("DEEPSEEK_API_KEY");
    if (hit !== void 0 && typeof hit.value === "string" && hit.value.length > 0) return hit.value;
  }
  const ambient = launchEnvironmentOf(ctx).get("DEEPSEEK_API_KEY");
  if (ambient !== void 0 && typeof ambient.value === "string" && ambient.value.length > 0) return ambient.value;
  return void 0;
}

/**
 * Resolve the DeepSeek Platform session token (userToken) from the
 * credential seam or launch environment. Required for the private
 * usage/cost dashboard endpoints; an API key cannot authenticate them.
 * @param {import("@deepseek-ai/cordis").Context} ctx - plugin context.
 * @returns {Promise<string|undefined>} the token, or undefined when unset.
 */
async function resolvePlatformToken(ctx) {
  if (ctx.credentials !== void 0) {
    const hit = await ctx.credentials.resolve("DEEPSEEK_PLATFORM_TOKEN");
    if (hit !== void 0 && typeof hit.value === "string" && hit.value.length > 0) return hit.value;
  }
  const ambient = launchEnvironmentOf(ctx).get("DEEPSEEK_PLATFORM_TOKEN");
  if (ambient !== void 0 && typeof ambient.value === "string" && ambient.value.length > 0) return ambient.value;
  return void 0;
}

/** @returns {Promise<{code:number,msg?:string,data?:any}|{error:string}>} a JSON-ish body. */
async function fetchJson(url, token) {
  let response;
  try {
    response = await fetch(url, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}`, ...PLATFORM_HEADERS }
    });
  } catch (error) {
    return { error: `network: ${String(error?.message ?? error)}` };
  }
  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { error: `bad json (HTTP ${response.status})` };
  }
}

/** Earliest year to scan for all-time spend (DeepSeek platform launched 2024). */
const CUMULATIVE_START_YEAR = 2024;

/** Per-month cost map ("YYYY-MM" -> CNY). Filled once on first request. */
let monthlyCostMap = null;
/** In-flight initial scan guard. */
let monthlyInitPromise = null;

/** Fetch one month's total cost from the cost endpoint. */
async function monthCostOf(token, month, year) {
  const url = USAGE_COST_URL.replace("__MONTH__", String(month)).replace("__YEAR__", String(year));
  const resp = await fetchJson(url, token);
  if (resp.error !== void 0) throw new Error(resp.error);
  if (resp.code !== void 0 && resp.code !== 0) throw new Error(`platform ${resp.code}: ${resp.msg ?? "unknown"}`);
  const raw = resp?.data?.biz_data;
  const data = Array.isArray(raw) ? raw[0] : raw;
  let total = 0;
  if (data && Array.isArray(data.total) && data.total.length > 0) {
    for (const modelEntry of data.total) {
      for (const entry of modelEntry.usage ?? []) total += Number.parseFloat(entry.amount) || 0;
    }
  }
  return Math.round(total * 100) / 100;
}

/** One-time full scan 2024-01..current month; fills monthlyCostMap. */
async function ensureMonthlyMap(token) {
  if (monthlyCostMap !== null) return;
  if (monthlyInitPromise === null) {
    monthlyInitPromise = (async () => {
      const map = {};
      const now = new Date();
      for (let y = CUMULATIVE_START_YEAR; y <= now.getFullYear(); y++) {
        const mEnd = y === now.getFullYear() ? now.getMonth() + 1 : 12;
        for (let m = 1; m <= mEnd; m++) {
          map[`${y}-${String(m).padStart(2, "0")}`] = await monthCostOf(token, m, y);
        }
      }
      monthlyCostMap = map;
    })();
  }
  try {
    await monthlyInitPromise;
  } finally {
    monthlyInitPromise = null;
  }
}

/**
 * Sum the month map; upserts the running month's fresh cost when given.
 * Past months are billing-final, so only the current month needs updating —
 * this makes the cumulative figure effectively real-time at zero extra cost.
 * @returns {number|null} rounded CNY total, or null before the map is ready.
 */
function cumulativeFromMap(key, value) {
  if (monthlyCostMap === null) return null;
  if (key !== void 0) monthlyCostMap[key] = value;
  let total = 0;
  for (const k of Object.keys(monthlyCostMap)) total += monthlyCostMap[k];
  return Math.round(total * 100) / 100;
}

/**
 * Fetch and normalize the current-month usage from the platform dashboard.
 * @param {string} token - platform userToken.
 * @param {number} month - 1..12.
 * @param {number} year - e.g. 2026.
 * @returns normalized envelope ({ ok, status, data }).
 */
async function queryPlatformUsage(token, month, year) {
  const [amount, cost] = await Promise.all([
    fetchJson(USAGE_AMOUNT_URL.replace("__MONTH__", String(month)).replace("__YEAR__", String(year)), token),
    fetchJson(USAGE_COST_URL.replace("__MONTH__", String(month)).replace("__YEAR__", String(year)), token)
  ]);

  const failed = [amount, cost].find((r) => r.error !== void 0);
  if (failed !== void 0) return { ok: false, status: 0, error: failed.error };

  // Platform private endpoints answer { code, msg, data } — 40002/40003 = bad/expired session.
  for (const r of [amount, cost]) {
    if (r.code !== void 0 && r.code !== 0) {
      return { ok: false, status: 401, error: `platform ${r.code}: ${r.msg ?? "unknown"}` };
    }
  }

  const bizData = (resp) => {
    const raw = resp?.data?.biz_data;
    return Array.isArray(raw) ? raw[0] : raw;
  };
  const amountData = bizData(amount);
  const costData = bizData(cost);
  if (!amountData || !Array.isArray(amountData.days)) {
    return { ok: false, status: 200, error: "amount response missing days" };
  }

  const isToken = (t) => typeof t === "string" && /TOKEN/i.test(t);
  const isRequest = (t) => typeof t === "string" && /REQUEST|REQ_|_REQ|COUNT|CALLS?/i.test(t);

  // Prefer biz_data.total (month aggregate); fall back to summing the days.
  const usageEntries = () => {
    const entries = [];
    const collect = (modelEntries) => {
      for (const modelEntry of modelEntries ?? []) {
        for (const entry of modelEntry.usage ?? []) entries.push(entry);
      }
    };
    if (Array.isArray(amountData.total) && amountData.total.length > 0) {
      collect(amountData.total);
    } else {
      for (const day of amountData.days ?? []) collect(day.data);
    }
    return entries;
  };

  let tokens = 0;
  let requests = 0;
  for (const entry of usageEntries()) {
    const v = Number.parseFloat(entry.amount) || 0;
    if (isToken(entry.type)) tokens += Math.round(v);
    else if (isRequest(entry.type)) requests += Math.round(v);
  }

  let costValue = 0;
  const sumUsage = (modelEntries) => {
    for (const modelEntry of modelEntries ?? []) {
      for (const entry of modelEntry.usage ?? []) costValue += Number.parseFloat(entry.amount) || 0;
    }
  };
  if (costData) {
    // biz_data.total is the month aggregate; fall back to summing the days.
    if (Array.isArray(costData.total) && costData.total.length > 0) {
      sumUsage(costData.total);
    } else {
      for (const day of costData.days ?? []) sumUsage(day.data);
    }
  }
  costValue = Math.round(costValue * 100) / 100;

  // 今日数据：平台实时接口（by_api_key），按 [今日 0 点 GMT+8, 明日 0 点) 的小时桶求和。
  // （月度接口的逐日明细滞后一天，今天的数据要查实时端点才能拿到。）
  const TZ_SHANGHAI = 8 * 3600; // 秒
  const shMidnightSec = Math.floor((Date.now() + TZ_SHANGHAI * 1000) / 86400000) * 86400 - TZ_SHANGHAI;
  const todayStart = shMidnightSec;
  const todayEnd = todayStart + 86400;
  const todayKey = (ep) => `${PLATFORM}/api/v0/usage/by_api_key/${ep}?start=${todayStart}&end=${todayEnd}&tz=${TZ_SHANGHAI}`;
  let todayCost = 0;
  let todayTokens = 0;
  let todayRequests = 0;
  const [todayAmount, todayCostResp] = await Promise.all([
    fetchJson(todayKey("amount"), token),
    fetchJson(todayKey("cost"), token)
  ]);
  const tA = todayAmount?.data?.biz_data;
  if (tA && Array.isArray(tA.series)) {
    for (const series of tA.series) {
      for (const bucket of series.buckets ?? []) {
        const u = bucket.usage ?? {};
        for (const k of Object.keys(u)) {
          const v = Number.parseFloat(u[k]) || 0;
          if (isToken(k)) todayTokens += Math.round(v);
          else if (isRequest(k)) todayRequests += Math.round(v);
        }
      }
    }
  }
  const tC = todayCostResp?.data?.biz_data;
  if (tC) {
    const seriesList = Array.isArray(tC.series)
      ? tC.series
      : Array.isArray(tC.data)
        ? tC.data.flatMap((d) => d.series ?? [])
        : [];
    for (const series of seriesList) {
      for (const bucket of series.buckets ?? []) todayCost += Number.parseFloat(bucket.cost) || 0;
    }
  }
  todayCost = Math.round(todayCost * 100) / 100;

  // 累计消费 = 全月份成本求和；当月数值用本次实时结果更新，过去月份账目已定。
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;
  const cumulativeValue = cumulativeFromMap(monthKey, costValue);

  return {
    ok: true,
    status: 200,
    data: {
      month,
      year,
      period: "本月",
      apiKey: "API Key 全部",
      totalSpend: `¥${costValue.toFixed(2)}`,
      cumulativeSpend: cumulativeValue === null ? null : `¥${cumulativeValue.toFixed(2)}`,
      todaySpend: todayCost.toFixed(2),
      todayTokens: String(todayTokens).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      todayRequests: String(todayRequests).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      requestCount: String(requests).replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      tokens: String(tokens).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  };
}

/**
 * cordis plugin apply: register the balance route on the shared webserver.
 * @param {import("@deepseek-ai/cordis").Context} ctx - plugin context.
 */
function apply(ctx) {
  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: "prefix",
      path: "/deepseek-balance",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        if (req.method !== "GET" || url.pathname !== "/deepseek-balance") {
          res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: "not found" }));
          return;
        }
        try {
          const key = await resolveKey(ctx);
          if (key === void 0) {
            res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: "DEEPSEEK_API_KEY 未配置（请在 ~/.dsh/.credentials.yaml 设置）" }));
            return;
          }
          const result = await queryBalance(key);
          // 入口不展示货币符号：把币种字段清空，任何版本的前端都不会拼出 ¥。
          if (result.ok && Array.isArray(result.data?.balance_infos)) {
            for (const info of result.data.balance_infos) info.currency = "";
          }
          res.writeHead(result.ok ? 200 : 502, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: String(error?.message ?? error) }));
        }
      }
    });
    return dispose;
  }, "deepseek-balance-widget: route");

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: "prefix",
      path: "/deepseek-usage",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        if (req.method !== "GET" || url.pathname !== "/deepseek-usage") {
          res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: "not found" }));
          return;
        }
        try {
          const token = await resolvePlatformToken(ctx);
          if (token === void 0) {
            res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: "DEEPSEEK_PLATFORM_TOKEN 未配置（请登录 platform.deepseek.com 后设置，用于实时用量统计）" }));
            return;
          }
          const now = new Date();
          // 首次请求做一次全月份扫描（之后只在内存里更新当月，零额外请求）。
          try {
            await ensureMonthlyMap(token);
          } catch {
            // 扫描失败时本轮累计值保持 null，客户端回退到快照；下轮重试。
          }
          const result = await queryPlatformUsage(token, now.getMonth() + 1, now.getFullYear());
          res.writeHead(result.ok ? 200 : 502, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: String(error?.message ?? error) }));
        }
      }
    });
    return dispose;
  }, "deepseek-balance-widget: usage route");

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: "prefix",
      path: "/deepseek-balance-version",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        if (req.method !== "GET" || url.pathname !== "/deepseek-balance-version") {
          res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: "not found" }));
          return;
        }
        try {
          const result = await queryNpmVersion();
          res.writeHead(result.ok ? 200 : 502, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify(result));
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, local: LOCAL_VERSION, error: String(error?.message ?? error) }));
        }
      }
    });
    return dispose;
  }, "deepseek-balance-widget: version route");

  ctx.effect(() => {
    const dispose = ctx.webServer.register({
      kind: "prefix",
      path: "/deepseek-balance-update",
      handler: async (req, res) => {
        const url = new URL(req.url ?? "/", "http://x");
        if (req.method !== "POST" || url.pathname !== "/deepseek-balance-update") {
          res.writeHead(404, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: "not found" }));
          return;
        }
        try {
          const before = await queryNpmVersion();
          if (before.ok && !before.updateAvailable) {
            res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: true, noOp: true, local: before.local, latest: before.latest, message: "已是最新版本" }));
            return;
          }
          const result = await runPackageUpdate();
          if (result.ok) {
            res.writeHead(200, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: true, message: "更新成功，请彻底重启 dsh 以加载新版本", output: result.output }));
          } else {
            res.writeHead(502, { "content-type": "application/json; charset=utf-8" });
            res.end(JSON.stringify({ ok: false, error: result.error, output: result.output }));
          }
        } catch (error) {
          res.writeHead(500, { "content-type": "application/json; charset=utf-8" });
          res.end(JSON.stringify({ ok: false, error: String(error?.message ?? error) }));
        }
      }
    });
    return dispose;
  }, "deepseek-balance-widget: update route");
}

export { name, inject, apply };
