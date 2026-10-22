/* =========================================================
   Обзвон · слой данных
   Два режима:
     cloud — общая база (Supabase / Postgres) для всей команды
     local — локальное хранилище браузера (одна машина, без сервера)
   ========================================================= */
window.ObzvonApi = (function () {
  "use strict";

  const K = {
    cfgUrl: "obzvon.db.url",
    cfgKey: "obzvon.db.key",
    token: "obzvon.db.token",
    ownerToken: "obzvon.db.owner",
    auth: "obzvon.auth.v1",
    session: "obzvon.session.v1",
    data: "obzvon.data.v1."
  };

  const TTL = 30 * 24 * 60 * 60 * 1000;

  const ls = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch { } },
    del(k) { try { localStorage.removeItem(k); } catch { } },
    sget(k) { try { return sessionStorage.getItem(k); } catch { return null; } },
    sset(k, v) { try { sessionStorage.setItem(k, v); } catch { } },
    sdel(k) { try { sessionStorage.removeItem(k); } catch { } }
  };

  const json = {
    parse(raw, fallback) { try { return raw ? JSON.parse(raw) : fallback; } catch { return fallback; } },
    str(v) { return JSON.stringify(v); }
  };

  function makeError(code) {
    const e = new Error(code);
    e.code = code;
    return e;
  }

  const normId = (v) => String(v == null ? "" : v).trim().toLowerCase();

  /* ---------------- хеширование (совпадает с SQL-функцией) ---------------- */
  const K256 = new Uint32Array([
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ]);
  const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) | 0;

  function sha256(str) {
    const bytes = new TextEncoder().encode(str);
    const len = bytes.length;
    const buf = new Uint8Array(((((len + 8) >> 6) + 1) << 6));
    buf.set(bytes);
    buf[len] = 0x80;
    const dv = new DataView(buf.buffer);
    const bitLen = len * 8;
    dv.setUint32(buf.length - 8, Math.floor(bitLen / 4294967296));
    dv.setUint32(buf.length - 4, bitLen >>> 0);
    const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
    const w = new Uint32Array(64);
    for (let off = 0; off < buf.length; off += 64) {
      for (let i = 0; i < 16; i++) w[i] = dv.getUint32(off + i * 4);
      for (let i = 16; i < 64; i++) {
        const x = w[i - 15], y = w[i - 2];
        w[i] = (w[i - 16] + (rotr(x, 7) ^ rotr(x, 18) ^ (x >>> 3)) + (w[i - 7] + (rotr(y, 17) ^ rotr(y, 19) ^ (y >>> 10)))) | 0;
      }
      let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
      for (let i = 0; i < 64; i++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const t1 = (hh + S1 + ((e & f) ^ (~e & g)) + K256[i] + w[i]) | 0;
        const t2 = ((rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22)) + ((a & b) ^ (a & c) ^ (b & c))) | 0;
        hh = g; g = f; f = e; e = (d + t1) | 0; d = c; c = b; b = a; a = (t1 + t2) | 0;
      }
      h[0] = (h[0] + a) | 0; h[1] = (h[1] + b) | 0; h[2] = (h[2] + c) | 0; h[3] = (h[3] + d) | 0;
      h[4] = (h[4] + e) | 0; h[5] = (h[5] + f) | 0; h[6] = (h[6] + g) | 0; h[7] = (h[7] + hh) | 0;
    }
    let out = "";
    for (let i = 0; i < 8; i++) out += ("00000000" + h[i].toString(16)).slice(-8);
    return out;
  }

  function randomHex(bytes = 16) {
    const a = new Uint8Array(bytes);
    if (window.crypto && window.crypto.getRandomValues) window.crypto.getRandomValues(a);
    else a.forEach((_, i) => (a[i] = Math.floor(Math.random() * 256)));
    return Array.from(a).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  function derivePassword(password, salt, iterations = 2000) {
    let h = salt + "|" + password;
    for (let i = 0; i < iterations; i++) h = sha256(h + "|" + i);
    return h;
  }

  /* =========================================================
     ЛОКАЛЬНЫЙ РЕЖИМ (localStorage)
     ========================================================= */
  const local = {
    auth: null,
    loadAuth() {
      const raw = ls.get(K.auth);
      this.auth = json.parse(raw, { version: 1, owner: null, users: [] });
      if (!Array.isArray(this.auth.users)) this.auth.users = [];
      return this.auth;
    },
    saveAuth() {
      this.auth.updatedAt = Date.now();
      ls.set(K.auth, json.str(this.auth));
    },
    sessions() { return json.parse(ls.get(K.session), {}); },
    saveSessions(s) { ls.set(K.session, json.str(s)); },
    findUser(id) {
      const n = normId(id);
      if (!n) return null;
      return this.auth.users.find((u) => normId(u.id) === n) || null;
    },
    issueToken(profileId, isOwner, remember) {
      const token = randomHex(24);
      const s = this.sessions();
      s[token] = { profileId, isOwner: !!isOwner, expires: Date.now() + TTL };
      this.saveSessions(s);
      const key = isOwner ? K.ownerToken : K.token;
      ls.del(key); ls.sdel(key);
      if (remember !== false) ls.set(key, token);
      else ls.sset(key, token);
      return token;
    },
    currentToken() { return ls.get(K.token) || ls.sget(K.token); },
    ownerToken() { return ls.get(K.ownerToken) || ls.sget(K.ownerToken); },
    clearToken() { ls.del(K.token); ls.sdel(K.token); },
    clearOwnerToken() { ls.del(K.ownerToken); ls.sdel(K.ownerToken); },
    dataKey(profileId) { return K.data + profileId; }
  };

  /* =========================================================
     ОБЛАЧНЫЙ РЕЖИМ (Supabase)
     ========================================================= */
  let client = null;
  let clientPromise = null;

  function loadScript(src) {
    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.async = true;
      s.onload = () => resolve();
      s.onerror = () => reject(makeError("NO_SCRIPT"));
      document.head.appendChild(s);
    });
  }

  function readConfig() {
    const w = window.OBZVON_CONFIG || {};
    const supa = w.supabase || {};
    config = {
      url: (ls.get(K.cfgUrl) || supa.url || "").trim(),
      key: (ls.get(K.cfgKey) || supa.anonKey || "").trim()
    };
    return config;
  }

  async function ensureClient() {
    if (client) return client;
    if (clientPromise) return clientPromise;
    clientPromise = (async () => {
      const cfg = readConfig();
      if (!cfg.url || !cfg.key) throw makeError("NO_DB");
      if (!window.supabase) {
        try {
          await loadScript("https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2");
        } catch { throw makeError("NO_SCRIPT"); }
      }
      if (!window.supabase) throw makeError("NO_SCRIPT");
      client = window.supabase.createClient(cfg.url, cfg.key, {
        auth: { persistSession: false, autoRefreshToken: false }
      });
      return client;
    })();
    try {
      return await clientPromise;
    } catch (e) {
      clientPromise = null;
      throw e;
    }
  }

  function mapError(message) {
    const m = String(message || "");
    const known = ["NO_ACCESS", "DISABLED", "BAD_PASSWORD", "NO_OWNER", "OWNER_EXISTS", "WEAK_PASSWORD", "DB_DOWN"];
    for (const code of known) if (m.includes(code)) return code;
    return "DB_ERROR";
  }

  async function rpc(name, params) {
    const c = await ensureClient();
    const { data, error } = await c.rpc(name, params);
    if (error) throw makeError(mapError(error.message));
    return data;
  }

  /* =========================================================
     ПУБЛИЧНОЕ API
     ========================================================= */
  let config = { url: "", key: "" };

  const api = {
    mode: "local",
    lastError: null,
    user: null,
    isOwnerSession: false,

    /* ---------- настройки подключения ---------- */
    readConfig,
    connection() {
      const c = readConfig();
      return { url: c.url, key: c.key, connected: !!(c.url && c.key) };
    },
    configure(url, key) {
      const u = (url || "").trim(), k = (key || "").trim();
      if (u) ls.set(K.cfgUrl, u); else ls.del(K.cfgUrl);
      if (k) ls.set(K.cfgKey, k); else ls.del(K.cfgKey);
      client = null;
      clientPromise = null;
      readConfig();
    },
    async testConnection() {
      try {
        await ensureClient();
        const ok = await rpc("obzvon_owner_status", {});
        return { ok: true, initialized: !!ok };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    /* ---------- вход / выход ---------- */
    async login(id, remember) {
      try {
        if (api.mode === "cloud") {
          const token = await rpc("obzvon_login", { p_id: String(id).trim() });
          ls.del(K.token); ls.sdel(K.token);
          if (remember === false) ls.sset(K.token, token); else ls.set(K.token, token);
          const user = await rpc("obzvon_resume", { p_token: token });
          api.user = user;
          api.isOwnerSession = false;
          return { ok: true, user };
        }
        local.loadAuth();
        const u = local.findUser(id);
        if (!u) throw makeError("NO_ACCESS");
        if (u.active === false) throw makeError("DISABLED");
        u.lastLogin = Date.now();
        u.logins = (u.logins || 0) + 1;
        local.saveAuth();
        local.issueToken(u.id, false, remember !== false);
        api.user = u;
        return { ok: true, user: u };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async resume() {
      const out = { user: null, owner: false };
      try {
        const token = local.currentToken();
        if (token) {
          if (api.mode === "cloud") {
            const user = await rpc("obzvon_resume", { p_token: token });
            if (user) {
              api.user = user;
              api.isOwnerSession = !!user.isOwner;
              out.user = user;
              out.owner = api.isOwnerSession;
              return out;
            }
          } else {
            const s = local.sessions()[token];
            if (s && s.expires > Date.now()) {
              local.loadAuth();
              const u = s.isOwner ? null : local.findUser(s.profileId);
              if (s.isOwner || (u && u.active !== false)) {
                api.user = u || { id: "__owner__", nick: "Владелец", role: "Администратор", isOwner: true };
                api.isOwnerSession = !!s.isOwner;
                out.user = api.user;
                out.owner = api.isOwnerSession;
                return out;
              }
            }
          }
          api.clearToken();
        }
      } catch { /* токен недействителен — молча выходим на гейт */ }

      try {
        const ot = local.ownerToken();
        if (ot) {
          if (api.mode === "cloud") {
            const owner = await rpc("obzvon_resume", { p_token: ot });
            if (owner && owner.isOwner) { api.isOwnerSession = true; out.owner = true; return out; }
          } else {
            const s = local.sessions()[ot];
            if (s && s.expires > Date.now() && s.isOwner) { api.isOwnerSession = true; out.owner = true; return out; }
          }
          api.clearOwnerToken();
        }
      } catch { /* игнорируем */ }

      return out;
    },

    async logout() {
      const token = local.currentToken();
      try {
        if (api.mode === "cloud" && token) await rpc("obzvon_logout", { p_token: token });
      } catch { }
      api.clearToken();
      api.user = null;
      api.isOwnerSession = false;
    },

    async ownerLogout() {
      const token = local.ownerToken();
      try {
        if (api.mode === "cloud" && token) await rpc("obzvon_logout", { p_token: token });
      } catch { }
      api.clearOwnerToken();
      api.isOwnerSession = false;
    },

    /* ---------- владелец ---------- */
    async ownerStatus() {
      try {
        if (api.mode === "cloud") return { initialized: !!(await rpc("obzvon_owner_status", {})) };
        local.loadAuth();
        return { initialized: !!local.auth.owner };
      } catch (e) {
        return { initialized: false, error: e.code };
      }
    },

    async ownerSetup(password, ownerId) {
      try {
        if (api.mode === "cloud") {
          const token = await rpc("obzvon_owner_setup", { p_password: password, p_owner_id: ownerId || null });
          ls.del(K.ownerToken); ls.sdel(K.ownerToken);
          ls.set(K.ownerToken, token);
          api.user = { id: "__owner__", nick: "Владелец", role: "Администратор", isOwner: true };
          api.isOwnerSession = true;
          return { ok: true };
        }
        local.loadAuth();
        if (local.auth.owner) throw makeError("OWNER_EXISTS");
        if (!password || password.length < 4) throw makeError("WEAK_PASSWORD");
        const salt = randomHex(16);
        local.auth.owner = { salt, hash: derivePassword(password, salt), iterations: 2000, createdAt: Date.now() };
        const oid = (ownerId || "").trim();
        if (oid) {
          const ex = local.findUser(oid);
          if (ex) { ex.role = "Администратор"; ex.active = true; }
          else local.auth.users.push({ id: oid, nick: "Владелец", role: "Администратор", active: true, addedAt: Date.now(), lastLogin: null, logins: 0 });
        }
        local.saveAuth();
        local.issueToken("__owner__", true, true);
        api.user = { id: "__owner__", nick: "Владелец", role: "Администратор", isOwner: true };
        api.isOwnerSession = true;
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async ownerLogin(password) {
      try {
        if (api.mode === "cloud") {
          const token = await rpc("obzvon_owner_login", { p_password: password });
          ls.del(K.ownerToken); ls.sdel(K.ownerToken);
          ls.set(K.ownerToken, token);
          api.user = { id: "__owner__", nick: "Владелец", role: "Администратор", isOwner: true };
          api.isOwnerSession = true;
          return { ok: true };
        }
        local.loadAuth();
        const o = local.auth.owner;
        if (!o) throw makeError("NO_OWNER");
        if (derivePassword(password, o.salt, o.iterations || 2000) !== o.hash) throw makeError("BAD_PASSWORD");
        local.issueToken("__owner__", true, true);
        api.user = { id: "__owner__", nick: "Владелец", role: "Администратор", isOwner: true };
        api.isOwnerSession = true;
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async changeOwnerPassword(oldPw, newPw) {
      try {
        if (!newPw || newPw.length < 4) throw makeError("WEAK_PASSWORD");
        if (api.mode === "cloud") {
          await rpc("obzvon_owner_change_password", {
            p_token: local.ownerToken() || local.currentToken(),
            p_old: oldPw, p_new: newPw
          });
          return { ok: true };
        }
        local.loadAuth();
        const o = local.auth.owner;
        if (!o) throw makeError("NO_OWNER");
        if (derivePassword(oldPw, o.salt, o.iterations || 2000) !== o.hash) throw makeError("BAD_PASSWORD");
        const salt = randomHex(16);
        local.auth.owner = { salt, hash: derivePassword(newPw, salt), iterations: 2000, createdAt: o.createdAt };
        local.saveAuth();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    /* ---------- профили ---------- */
    async listProfiles() {
      if (api.mode === "cloud") {
        const rows = await rpc("obzvon_list_profiles", { p_token: local.ownerToken() || local.currentToken() });
        return Array.isArray(rows) ? rows : [];
      }
      local.loadAuth();
      return local.auth.users.slice();
    },

    async saveProfile(profile) {
      try {
        if (api.mode === "cloud") {
          await rpc("obzvon_upsert_profile", {
            p_token: local.ownerToken() || local.currentToken(),
            p_id: String(profile.id).trim(),
            p_nick: profile.nick === undefined ? null : String(profile.nick),
            p_role: profile.role === undefined ? null : String(profile.role),
            p_active: profile.active === undefined ? null : (profile.active !== false)
          });
          return { ok: true };
        }
        local.loadAuth();
        const ex = local.findUser(profile.id);
        if (ex) {
          if (profile.nick !== undefined) ex.nick = profile.nick;
          if (profile.role !== undefined) ex.role = profile.role;
          if (profile.active !== undefined) ex.active = profile.active !== false;
        } else {
          local.auth.users.push({
            id: String(profile.id).trim(),
            nick: profile.nick || String(profile.id).trim(),
            role: profile.role || "Администратор",
            active: profile.active !== false,
            addedAt: Date.now(),
            lastLogin: null,
            logins: 0
          });
        }
        local.saveAuth();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async deleteProfile(id) {
      try {
        if (api.mode === "cloud") {
          await rpc("obzvon_delete_profile", { p_token: local.ownerToken() || local.currentToken(), p_id: String(id) });
          return { ok: true };
        }
        local.loadAuth();
        local.auth.users = local.auth.users.filter((u) => normId(u.id) !== normId(id));
        local.saveAuth();
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async bulkAdd(ids, role) {
      try {
        if (api.mode === "cloud") {
          const added = await rpc("obzvon_bulk_add", {
            p_token: local.ownerToken() || local.currentToken(),
            p_ids: ids, p_role: role
          });
          return { ok: true, added: Number(added) || 0 };
        }
        local.loadAuth();
        let added = 0;
        ids.forEach((id) => {
          if (local.findUser(id)) return;
          local.auth.users.push({ id, nick: id, role: role || "Администратор", active: true, addedAt: Date.now(), lastLogin: null, logins: 0 });
          added++;
        });
        local.saveAuth();
        return { ok: true, added };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async exportBase() {
      if (api.mode === "cloud") {
        const data = await rpc("obzvon_export_base", { p_token: local.ownerToken() || local.currentToken() });
        return data || { users: [] };
      }
      local.loadAuth();
      return { version: 1, owner: local.auth.owner || null, users: local.auth.users.slice(), exported_at: new Date().toISOString() };
    },

    async importBase(payload) {
      try {
        const users = Array.isArray(payload.users) ? payload.users : [];
        if (api.mode === "cloud") {
          const n = await rpc("obzvon_import_base", {
            p_token: local.ownerToken() || local.currentToken(),
            p_users: users
          });
          return { ok: true, added: Number(n) || 0 };
        }
        local.loadAuth();
        let added = 0;
        users.forEach((u) => {
          if (!u || !u.id) return;
          if (local.findUser(u.id)) return;
          local.auth.users.push({
            id: String(u.id).trim(),
            nick: u.nick || String(u.id).trim(),
            role: u.role || "Администратор",
            active: u.active !== false,
            addedAt: Date.now(),
            lastLogin: u.lastLogin || null,
            logins: u.logins || 0
          });
          added++;
        });
        local.saveAuth();
        return { ok: true, added };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async resetLocalBase() {
      if (api.mode === "cloud") return { ok: false, error: "CLOUD" };
      local.loadAuth();
      local.auth = { version: 1, owner: null, users: [], updatedAt: Date.now() };
      local.saveAuth();
      api.clearOwnerToken();
      return { ok: true };
    },

    /* ---------- рабочее пространство пользователя ---------- */
    async getState() {
      try {
        if (api.mode === "cloud") {
          const token = local.currentToken() || local.ownerToken();
          const data = await rpc("obzvon_get_state", { p_token: token });
          return data || {};
        }
        const uid = api.user ? api.user.id : "guest";
        return json.parse(ls.get(local.dataKey(uid)) || ls.sget(local.dataKey(uid)), {});
      } catch {
        return {};
      }
    },

    async saveState(payload) {
      try {
        if (api.mode === "cloud") {
          const token = local.currentToken() || local.ownerToken();
          await rpc("obzvon_save_state", { p_token: token, p_data: payload });
          return { ok: true };
        }
        const uid = api.user ? api.user.id : "guest";
        const raw = json.str(payload);
        ls.set(local.dataKey(uid), raw);
        ls.sset(local.dataKey(uid), raw);
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    async setNick(nick) {
      try {
        if (api.mode === "cloud") {
          await rpc("obzvon_set_nick", { p_token: local.currentToken(), p_nick: nick });
          if (api.user) api.user.nick = nick;
          return { ok: true };
        }
        local.loadAuth();
        const u = api.user ? local.findUser(api.user.id) : null;
        if (u) { u.nick = nick; local.saveAuth(); }
        if (api.user) api.user.nick = nick;
        return { ok: true };
      } catch (e) {
        return { ok: false, error: e.code || "DB_ERROR" };
      }
    },

    /* ---------- режим ---------- */
    async detectMode() {
      const cfg = readConfig();
      api.lastError = null;
      if (cfg.url && cfg.key) {
        try {
          await ensureClient();
          await rpc("obzvon_owner_status", {});
          api.mode = "cloud";
          return { mode: "cloud" };
        } catch (e) {
          api.mode = "local";
          api.lastError = e.code || "DB_ERROR";
          return { mode: "local", error: api.lastError };
        }
      }
      api.mode = "local";
      return { mode: "local" };
    },

    /* ---------- служебное ---------- */
    sha256,
    derivePassword,
    currentToken: local.currentToken,
    ownerToken: local.ownerToken,
    clearToken: local.clearToken,
    clearOwnerToken: local.clearOwnerToken
  };

  return api;
})();
