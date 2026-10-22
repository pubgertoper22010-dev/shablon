/* =========================================================
   Обзвон · шаблон набора администрации
   Гейт доступа · общая база данных · панель владельца
   ========================================================= */
(() => {
  "use strict";

  /* ---------------------------------------------------------
     1. ДАННЫЕ СКРИПТА
     --------------------------------------------------------- */
  const SCRIPT = [
    {
      id: "basics",
      title: "Шаблон обзвона на администрацию",
      subtitle: "Базовые понятия и термины проекта",
      items: [
        { q: "Что такое ДМ?", a: "Убийство или нанесение урона <strong>без причины</strong>.", tags: ["определение"] },
        { q: "Что такое ДБ?", a: "Убийство или нанесение урона <strong>машиной</strong>.", tags: ["определение"] },
        {
          q: "Назовите RK в трёх видах.",
          a: "<ol><li>Убийство одного и того же игрока <strong>2 или более раза</strong>.</li><li>Убивать игрока за то, что он убил тебя.</li><li>Возвращение на место смерти.</li></ol>",
          tags: ["определение"]
        },
        { q: "Что такое OOC?", a: "Информация, которая касается <strong>реального мира</strong>. Сюда относится вся информация, поступившая из реального мира.", tags: ["определение"] },
        { q: "Что такое IC?", a: "Чат, который касается <strong>игрового процесса</strong>, то есть всего, что происходит в игре.", tags: ["определение"] },
        { q: "Чем отличается ФФ от ТК?", a: "Тем, что <strong>ФФ — это только нанесение урона своим</strong> (не убийство), а <strong>ТК — убийство</strong>.", tags: ["определение"] }
      ]
    },
    {
      id: "capt",
      title: "Правила семейных КАПТОВ",
      subtitle: "Отдельные наказания за нарушения во время КАПТов",
      items: [
        {
          q: "Что даётся за багаюз во время проведения семейных КАПТОВ?",
          a: "<strong>Деморган / блокировка аккаунта</strong> и лишение семьи <strong>2 000 репутации</strong>.",
          note: "В зависимости от ситуации выдаётся деморган либо блокировка аккаунта; семья в любом случае теряет 2 000 репутации.",
          tags: ["деморган", "репутация"]
        },
        {
          q: "Игрок во время проведения семейных КАПТОВ, будучи сотрудником УМВД, надел наручники на игрока. Что за это даётся?",
          a: "<strong>Деморган 120 минут</strong> и <strong>увольнение из фракции</strong>.",
          tags: ["деморган", "фракция"]
        },
        {
          q: "Что даётся за продажу либо передачу репутации семьи другим семьям?",
          a: "<strong>Перманентная блокировка аккаунта</strong> и <strong>обнуление всей репутации</strong>.",
          tags: ["перманент", "репутация"]
        },
        {
          q: "Что даётся за использование посторонних ПО, дающих преимущество на капте?",
          a: "<strong>Перманентная блокировка аккаунта</strong> и лишение семьи <strong>3 000 репутации</strong>.",
          note: "Примечание: за массовые нарушения данного правила семья может лишиться всей заработанной репутации.",
          tags: ["перманент", "репутация"]
        }
      ]
    },
    {
      id: "rules",
      title: "Правила проекта и выдачи наказаний",
      subtitle: "Наказания за нарушения правил проекта",
      items: [
        { q: "Что даётся за передачу аккаунта третьим лицам?", a: "<strong>Перманентная блокировка</strong>.", tags: ["перманент"] },
        { q: "Что даётся за продажу аккаунта / передачу аккаунта?", a: "<strong>Перманентная блокировка</strong>.", tags: ["перманент"] },
        {
          q: "Что будет за передачу имущества с твинк-аккаунта на основной?",
          a: "<strong>Блокировка аккаунта от 30 дней до перманентной блокировки.</strong>",
          note: "Примечание: блокировка выдаётся в зависимости от ценности переданного имущества.",
          tags: ["блокировка аккаунта", "имущество"]
        },
        { q: "Что даётся за продажу игровой валюты / имущества за реальные рубли?", a: "<strong>Перманентная блокировка</strong>.", tags: ["перманент"] },
        {
          q: "Запрещено ли иметь имущество на твинках (дом, бизнес)? Если да — назовите наказание.",
          a: "Да, <strong>запрещено</strong>. <strong>Блокировка аккаунта от 14 до 30 дней</strong> + <strong>изъятие имущества</strong>.",
          tags: ["блокировка аккаунта", "имущество"]
        },
        {
          q: "Запрещено ли обмениваться бизнесами на определённый срок? Если да — назовите наказание.",
          a: "Да, <strong>запрещено</strong>. <strong>Изъятие бизнесов / блокировка аккаунта от 30 дней до перманентной блокировки.</strong>",
          tags: ["блокировка аккаунта", "имущество"]
        },
        { q: "Что даётся за ДМ?", a: "Наказание — <strong>60 минут деморгана</strong>.", tags: ["деморган"] },
        { q: "Что даётся за массовый ДМ и от скольких человек он насчитывается?", a: "<strong>120 минут деморгана</strong>, от <strong>3 человек</strong>.", tags: ["деморган"] },
        { q: "Что даётся за ДБ?", a: "<strong>Деморган на 60 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за SK?", a: "<strong>Деморган 60 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за PG?", a: "<strong>Деморган на 60 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за нон-RP поведение?", a: "<strong>Деморган 50 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за МГ?", a: "<strong>Блокировка чата на 30 минут</strong>.", tags: ["блокировка чата"] },
        { q: "Что даётся за нахождение сотрудника на бу-рынке 5+ ранга?", a: "<strong>Деморган 20 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за нон-RP крышу?", a: "<strong>Деморган на 30 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за флуд / спам сообщениями?", a: "<strong>Блокировка чата на 30 минут</strong>.", tags: ["блокировка чата"] },
        { q: "Что даётся за использование капслока?", a: "Сначала <strong>предупреждение</strong>, при повторном нарушении — <strong>блокировка чата на 30 минут</strong>.", tags: ["блокировка чата", "предупреждение"] },
        { q: "Что даётся за ООС / оскорбление игроков?", a: "<strong>Блокировка чата на 60 минут</strong>.", tags: ["блокировка чата"] },
        { q: "Что даётся за провокацию на конфликт в VIP-чате?", a: "<strong>Блокировка чата на 30 минут</strong>.", tags: ["блокировка чата"] },
        { q: "Что даётся за использование транслита в VIP-чате?", a: "<strong>Блокировка чата на 30 минут</strong>.", tags: ["блокировка чата"] },
        { q: "Что даётся за помеху работе администрации?", a: "<strong>Деморган 60 минут</strong>.", tags: ["деморган"] },
        { q: "Что даётся за введение администратора в заблуждение (либо же обман)?", a: "<strong>Блокировка чата на 60 минут</strong>.", tags: ["блокировка чата"] }
      ]
    }
  ];

  const ROLES = ["Администратор", "Старший администратор", "Помощник", "Наблюдатель", "Интервьюер"];

  /* ---------------------------------------------------------
     2. СЛУЖЕБНОЕ
     --------------------------------------------------------- */
  const api = window.ObzvonApi;
  const THEME_KEY = "obzvon.theme";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const safe = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, val) { try { localStorage.setItem(key, val); } catch { } },
    del(key) { try { localStorage.removeItem(key); } catch { } }
  };

  const ERRORS = {
    NO_ACCESS: "Доступ не найден. Проверьте ID или обратитесь к администратору.",
    DISABLED: "Профиль отключён администратором.",
    BAD_PASSWORD: "Неверный пароль.",
    NO_OWNER: "Система не инициализирована: задайте пароль владельца.",
    OWNER_EXISTS: "Владелец уже создан.",
    WEAK_PASSWORD: "Пароль слишком короткий (минимум 4 символа).",
    DB_ERROR: "Ошибка базы данных. Попробуйте ещё раз.",
    DB_DOWN: "Нет связи с базой данных. Проверьте подключение.",
    NO_SCRIPT: "Не удалось загрузить клиент базы данных. Проверьте интернет.",
    NO_DB: "База данных не настроена.",
    CLOUD: "В облачном режиме баз управляют через Supabase."
  };
  const errText = (code) => ERRORS[code] || ERRORS.DB_ERROR;

  const state = {
    user: null,          // текущий пользователь { id, nick, role, ... }
    profiles: [],        // список профилей (панель владельца)
    checked: new Set(),
    candidate: { nick: "", age: "", tz: "", hours: "", discord: "", notes: "", exp: "" },
    notes: "",
    verdict: "",
    comment: ""
  };

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, (c) => (
      { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
    ));
  }

  const normId = (v) => String(v == null ? "" : v).trim().toLowerCase();

  function toDate(v) {
    if (!v) return null;
    const d = new Date(v);
    return isNaN(d.getTime()) ? null : d;
  }

  const fmtDate = (d) => d ? d.toLocaleDateString("ru-RU") : "—";
  const fmtDateTime = (d) => d ? d.toLocaleString("ru-RU", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "—";

  let toastTimer = null;
  function toast(msg) {
    const el = $("#toast");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("is-show"), 2400);
  }

  function legacyCopy(text) {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      const ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch { return false; }
  }

  async function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(text); return true; } catch { }
    }
    return legacyCopy(text);
  }

/* ---------------------------------------------------------
     3. ГЕЙТ ДОСТУПА
     --------------------------------------------------------- */
  const gateEl = $("#gate");
  const gateMsg = $("#gate-msg");

  function gateMessage(text, kind = "err") {
    if (!gateMsg) return;
    gateMsg.textContent = text || "";
    gateMsg.className = "gate__msg" + (text ? " gate__msg--" + kind : "");
  }

  function showGate() {
    document.body.classList.add("is-locked");
    gateEl.hidden = false;
    setTimeout(() => { const el = $("#gate-id"); if (el) el.focus(); }, 40);
  }

  function hideGate() {
    document.body.classList.remove("is-locked");
    gateEl.hidden = true;
  }

  $("#gate-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const id = $("#gate-id").value.trim();
    if (!id) { gateMessage("Введите ваш ID."); return; }
    const btn = $("#gate-form button[type=submit]");
    if (btn) btn.disabled = true;
    gateMessage("Проверяем доступ…", "info");
    const res = await api.login(id, $("#gate-remember").checked);
    if (btn) btn.disabled = false;
    if (!res.ok) { gateMessage(errText(res.error)); return; }
    gateMessage("");
    state.user = res.user;
    await enterSite();
    toast(`Здравствуйте, ${res.user.nick || res.user.id}!`);
  });

  /* ---------------------------------------------------------
     4. РЕЖИМ РАБОТЫ: ОБЩАЯ БАЗА / ЛОКАЛЬНЫЙ РЕЖИМ
     --------------------------------------------------------- */
  function renderMode() {
    const cloud = api.mode === "cloud";
    const badge = $("#mode-badge");
    if (badge) {
      badge.textContent = cloud ? "Общая база" : "Локально";
      badge.className = "mode-badge " + (cloud ? "mode-badge--cloud" : "mode-badge--local");
    }
    const top = $("#mode-badge-top");
    if (top) {
      top.hidden = !state.user;
      top.textContent = cloud ? "☁ общая база" : "▣ этот браузер";
      top.className = "mode-badge mode-badge--top " + (cloud ? "mode-badge--cloud" : "mode-badge--local");
    }
    const note = $("#storage-note");
    if (note) {
      note.textContent = cloud
        ? "Анкеты, отметки и профили хранятся в общей базе проекта — команда работает из любого браузера."
        : "Данные хранятся только в этом браузере. Подключите общую базу, чтобы работать командой из разных браузеров.";
    }
  }

  /* ---- панель подключения к базе ---- */
  const dbUrl = $("#db-url");
  const dbKey = $("#db-key");
  const dbMsg = $("#db-msg");

  function dbMessage(text, kind = "err") {
    if (!dbMsg) return;
    dbMsg.textContent = text || "";
    dbMsg.className = "gate__msg" + (text ? " gate__msg--" + kind : "");
  }

  function fillDbFields() {
    const c = api.connection();
    if (dbUrl) dbUrl.value = c.url;
    if (dbKey) dbKey.value = c.key;
  }

  $("#gate-db-toggle").addEventListener("click", () => {
    const panel = $("#gate-db-panel");
    panel.hidden = !panel.hidden;
    if (!panel.hidden) fillDbFields();
  });

  $("#db-test").addEventListener("click", async () => {
    api.configure(dbUrl.value, dbKey.value);
    dbMessage("Проверяем подключение…", "info");
    const r = await api.testConnection();
    if (!r.ok) { dbMessage("Не удалось подключиться: " + errText(r.error).toLowerCase(), "err"); return; }
    dbMessage(r.initialized
      ? "Подключение работает. База настроена — войдите как владелец."
      : "Подключение работает. База пустая — выполните SQL-схему и создайте владельца.", "ok");
  });

  $("#db-save").addEventListener("click", async () => {
    api.configure(dbUrl.value, dbKey.value);
    const res = await api.detectMode();
    api.clearToken();
    api.clearOwnerToken();
    renderMode();
    if (res.mode === "cloud") dbMessage("Подключение сохранено — активна общая база.", "ok");
    else dbMessage("Подключиться не удалось (" + errText(res.error) + "). Включён локальный режим.", "err");
  });

  $("#db-reset").addEventListener("click", async () => {
    api.configure("", "");
    await api.detectMode();
    api.clearToken();
    api.clearOwnerToken();
    fillDbFields();
    renderMode();
    dbMessage("Подключение отключено — работает локальный режим.", "ok");
  });

  /* ---------------------------------------------------------
     5. ПАНЕЛЬ ВЛАДЕЛЬЦА
     --------------------------------------------------------- */
  const ownerModal = $("#owner-modal");
  const ownerBody = $("#owner-body");

  function openOwner() {
    ownerModal.hidden = false;
    document.body.classList.add("modal-open");
    ownerBody.innerHTML = `<p class="muted">Загрузка…</p>`;
    renderOwner();
  }

  function closeOwner() {
    ownerModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  $("#owner-close").addEventListener("click", closeOwner);
  $("#gate-owner-btn").addEventListener("click", openOwner);
  $("#btn-owner-open").addEventListener("click", openOwner);
  ownerModal.addEventListener("click", (e) => { if (e.target === ownerModal) closeOwner(); });

  async function renderOwner() {
    const st = await api.ownerStatus();
    if (!st.initialized) { renderOwnerSetup(); return; }
    if (!api.isOwnerSession) { renderOwnerLogin(); return; }
    await renderOwnerDashboard();
  }

  function renderOwnerSetup() {
    ownerBody.innerHTML = `
      <h3 class="modal__title">Первоначальная настройка</h3>
      <p class="muted">Система ещё не инициализирована. Задайте пароль владельца — он понадобится, чтобы выдавать ID сотрудникам и управлять профилями.</p>
      <form id="owner-setup" class="owner-form">
        <div class="field"><label for="own-pass">Пароль владельца</label><input id="own-pass" type="password" autocomplete="new-password" placeholder="Минимум 4 символа" /></div>
        <div class="field"><label for="own-pass2">Повторите пароль</label><input id="own-pass2" type="password" autocomplete="new-password" /></div>
        <div class="field"><label for="own-id">Ваш ID (чтобы входить без пароля)</label><input id="own-id" type="text" placeholder="например: 100001" spellcheck="false" /></div>
        <button class="btn btn--primary" type="submit">Создать и войти</button>
      </form>`;

    $("#owner-setup").addEventListener("submit", async (e) => {
      e.preventDefault();
      const p1 = $("#own-pass").value, p2 = $("#own-pass2").value, oid = $("#own-id").value.trim();
      if (p1.length < 4) { toast("Пароль слишком короткий"); return; }
      if (p1 !== p2) { toast("Пароли не совпадают"); return; }
      const res = await api.ownerSetup(p1, oid);
      if (!res.ok) { toast(errText(res.error)); return; }
      toast("Владелец создан");
      await renderOwner();
    });
  }

  function renderOwnerLogin() {
    ownerBody.innerHTML = `
      <h3 class="modal__title">Вход для владельца</h3>
      <p class="muted">Введите пароль владельца, чтобы управлять профилями.</p>
      <form id="owner-login" class="owner-form">
        <div class="field"><label for="own-pass-in">Пароль</label><input id="own-pass-in" type="password" autocomplete="current-password" /></div>
        <button class="btn btn--primary" type="submit">Войти</button>
      </form>`;

    $("#owner-login").addEventListener("submit", async (e) => {
      e.preventDefault();
      const pwd = $("#own-pass-in").value;
      const res = await api.ownerLogin(pwd);
      if (!res.ok) { toast(errText(res.error)); return; }
      toast("Вход в панель владельца");
      await renderOwner();
    });
  }

  async function renderOwnerDashboard() {
    let users = [];
    try {
      users = await api.listProfiles();
    } catch (e) {
      ownerBody.innerHTML = `<h3 class="modal__title">Панель владельца</h3><p class="gate__msg gate__msg--err">${escapeHtml(errText(e.code))}</p>`;
      return;
    }
    state.profiles = users;

    const rows = users.map((u, i) => `
      <tr data-i="${i}">
        <td class="mono">${escapeHtml(u.id)}</td>
        <td><input class="cell-input" data-field="nick" value="${escapeHtml(u.nick || "")}" placeholder="ник" /></td>
        <td>
          <select class="cell-input" data-field="role">
            ${ROLES.map((r) => `<option ${normId(r) === normId(u.role) ? "selected" : ""}>${r}</option>`).join("")}
          </select>
        </td>
        <td>
          <button class="switch ${u.active === false ? "" : "is-on"}" data-act="toggle" title="Вкл/выкл доступ">
            <span></span><em>${u.active === false ? "выключен" : "активен"}</em>
          </button>
        </td>
        <td class="mono xs">${u.logins || 0}</td>
        <td class="mono xs">${fmtDateTime(toDate(u.last_login || u.lastLogin))}</td>
        <td>
          <button class="icon-btn icon-btn--danger" data-act="del" title="Удалить профиль">
            <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 7h16M9 7V5h6v2M7 7l1 13h8l1-13"/></svg>
          </button>
        </td>
      </tr>`).join("");

    const cloud = api.mode === "cloud";

    ownerBody.innerHTML = `
      <div class="modal__head">
        <div>
          <h3 class="modal__title">Панель владельца</h3>
          <p class="muted xs">Профили сотрудников: ${users.length} всего, ${users.filter((u) => u.active !== false).length} активных</p>
        </div>
        <button class="btn btn--ghost btn--sm" id="owner-logout">Выйти из панели</button>
      </div>

      <div class="owner-grid">
        <form class="owner-add" id="owner-add">
          <h4>Выдать доступ</h4>
          <div class="field"><label for="new-id">ID сотрудника</label><input id="new-id" type="text" placeholder="ID или ник в проекте" spellcheck="false" /></div>
          <div class="field"><label for="new-nick">Отображаемое имя</label><input id="new-nick" type="text" placeholder="Например: Кирилл" /></div>
          <div class="field"><label for="new-role">Роль</label><select id="new-role">${ROLES.map((r) => `<option>${r}</option>`).join("")}</select></div>
          <button class="btn btn--primary" type="submit">Добавить профиль</button>
        </form>

        <form class="owner-bulk" id="owner-bulk">
          <h4>Массовое добавление</h4>
          <div class="field">
            <label for="bulk-ids">Список ID (каждый с новой строки или через запятую)</label>
            <textarea id="bulk-ids" rows="5" placeholder="100001&#10;100002&#10;100003"></textarea>
          </div>
          <div class="owner-bulk__row">
            <div class="field"><label for="bulk-role">Роль</label><select id="bulk-role">${ROLES.map((r) => `<option>${r}</option>`).join("")}</select></div>
            <button class="btn btn--soft" type="submit">Добавить всех</button>
          </div>
        </form>
      </div>

      <div class="owner-table-wrap">
        <table class="owner-table">
          <thead><tr><th>ID</th><th>Имя</th><th>Роль</th><th>Доступ</th><th>Входов</th><th>Последний вход</th><th></th></tr></thead>
          <tbody id="owner-rows">${rows || `<tr><td colspan="7" class="muted">Профилей пока нет — добавьте первого.</td></tr>`}</tbody>
        </table>
      </div>

      <div class="owner-foot">
        <button class="btn btn--ghost btn--sm" id="owner-export">Экспорт базы</button>
        <button class="btn btn--ghost btn--sm" id="owner-import">Импорт базы</button>
        <button class="btn btn--ghost btn--sm" id="owner-pass">Сменить пароль</button>
        ${cloud ? "" : `<button class="btn btn--ghost btn--sm" id="owner-reset">Сбросить базу</button>`}
        <input type="file" id="owner-file" accept="application/json" hidden />
      </div>
      <p class="owner-note">${cloud
        ? "Профили хранятся в общей базе проекта: изменения видны всем сотрудникам во всех браузерах."
        : "База и все данные анкет хранятся только в этом браузере. Чтобы перенести доступ на другой компьютер — используйте «Экспорт базы» и «Импорт базы»."}</p>`;

    $("#owner-add").addEventListener("submit", async (e) => {
      e.preventDefault();
      const id = $("#new-id").value.trim();
      if (!id) { toast("Укажите ID"); return; }
      const res = await api.saveProfile({
        id,
        nick: $("#new-nick").value.trim() || id,
        role: $("#new-role").value,
        active: true
      });
      if (!res.ok) { toast(errText(res.error)); return; }
      await renderOwnerDashboard();
      toast("Профиль добавлен");
    });

    $("#owner-bulk").addEventListener("submit", async (e) => {
      e.preventDefault();
      const raw = $("#bulk-ids").value;
      const ids = raw.split(/[\s,;]+/).map((s) => s.trim()).filter(Boolean);
      if (!ids.length) { toast("Список пуст"); return; }
      const res = await api.bulkAdd(ids, $("#bulk-role").value);
      if (!res.ok) { toast(errText(res.error)); return; }
      await renderOwnerDashboard();
      toast(`Добавлено профилей: ${res.added}`);
    });

    $("#owner-rows").addEventListener("click", async (e) => {
      const btn = e.target.closest("[data-act]");
      if (!btn) return;
      const tr = btn.closest("tr");
      const u = state.profiles[Number(tr.dataset.i)];
      if (!u) return;
      if (btn.dataset.act === "toggle") {
        const res = await api.saveProfile({ id: u.id, active: u.active === false });
        if (!res.ok) { toast(errText(res.error)); return; }
        await renderOwnerDashboard();
      }
      if (btn.dataset.act === "del") {
        if (!confirm(`Удалить профиль ${u.id}? Доступ сотрудника будет отозван.`)) return;
        const res = await api.deleteProfile(u.id);
        if (!res.ok) { toast(errText(res.error)); return; }
        await renderOwnerDashboard();
        toast("Профиль удалён");
      }
    });

    $("#owner-rows").addEventListener("change", async (e) => {
      const input = e.target.closest("[data-field]");
      if (!input) return;
      const tr = input.closest("tr");
      const u = state.profiles[Number(tr.dataset.i)];
      if (!u) return;
      const patch = { id: u.id };
      patch[input.dataset.field] = input.value;
      const res = await api.saveProfile(patch);
      if (!res.ok) { toast(errText(res.error)); return; }
      toast("Сохранено");
    });

    $("#owner-logout").addEventListener("click", async () => {
      await api.ownerLogout();
      renderOwner();
      toast("Вы вышли из панели");
    });

    $("#owner-export").addEventListener("click", async () => {
      try {
        const data = await api.exportBase();
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "obzvon_access_" + new Date().toISOString().slice(0, 10) + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
        toast("База выгружена");
      } catch (e) {
        toast(errText(e.code));
      }
    });

    $("#owner-import").addEventListener("click", () => $("#owner-file").click());
    $("#owner-file").addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const data = JSON.parse(await file.text());
        if (!data || !Array.isArray(data.users)) throw new Error("bad");
        const res = await api.importBase(data);
        if (!res.ok) { toast(errText(res.error)); return; }
        await renderOwnerDashboard();
        toast(`База импортирована: ${res.added}`);
      } catch {
        toast("Не удалось прочитать файл");
      }
      e.target.value = "";
    });

    $("#owner-pass").addEventListener("click", async () => {
      const oldPw = prompt("Текущий пароль владельца:");
      if (!oldPw) return;
      const newPw = prompt("Новый пароль владельца (минимум 4 символа):");
      if (!newPw) return;
      if (newPw.length < 4) { toast("Пароль слишком короткий"); return; }
      const res = await api.changeOwnerPassword(oldPw, newPw);
      if (!res.ok) { toast(errText(res.error)); return; }
      toast("Пароль изменён");
    });

    $("#owner-reset")?.addEventListener("click", async () => {
      if (!confirm("Удалить всех профили и пароль владельца? Потребуется настроить систему заново.")) return;
      const res = await api.resetLocalBase();
      if (!res.ok) { toast(errText(res.error)); return; }
      api.isOwnerSession = false;
      renderOwner();
      toast("База сброшена");
    });
  }

/* ---------------------------------------------------------
     6. ПРОФИЛЬ ПОЛЬЗОВАТЕЛЯ
     --------------------------------------------------------- */
  const profileModal = $("#profile-modal");

  function openProfile() {
    const u = state.user;
    if (!u) return;
    const created = toDate(u.created_at || u.addedAt);
    $("#profile-body").innerHTML = `
      <div class="modal__head">
        <div>
          <h3 class="modal__title">Профиль</h3>
          <p class="muted xs">${escapeHtml(u.id)}</p>
        </div>
        <button class="icon-btn" id="profile-close-x" title="Закрыть">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
        </button>
      </div>
      <form id="profile-form" class="owner-form">
        <div class="field"><label for="pf-nick">Отображаемое имя</label><input id="pf-nick" type="text" value="${escapeHtml(u.nick || "")}" /></div>
        <div class="field"><label>ID</label><input type="text" value="${escapeHtml(u.id)}" disabled /></div>
        <div class="field"><label>Роль</label><input type="text" value="${escapeHtml(u.role || "")}" disabled /></div>
        <div class="field"><label>Доступ выдан</label><input type="text" value="${fmtDate(created)}" disabled /></div>
        <div class="field"><label>Входов</label><input type="text" value="${u.logins || 0}" disabled /></div>
        <div class="form__actions">
          <button class="btn btn--primary" type="submit">Сохранить</button>
          <button class="btn btn--ghost" type="button" id="profile-logout">Выйти из сайта</button>
        </div>
      </form>`;
    $("#profile-close-x").addEventListener("click", closeProfile);
    $("#profile-logout").addEventListener("click", () => { closeProfile(); logout(); });
    $("#profile-form").addEventListener("submit", async (e) => {
      e.preventDefault();
      const nick = $("#pf-nick").value.trim() || state.user.id;
      const res = await api.setNick(nick);
      if (!res.ok) { toast(errText(res.error)); return; }
      state.user.nick = nick;
      renderProfileChip();
      closeProfile();
      toast("Профиль обновлён");
    });
    profileModal.hidden = false;
    document.body.classList.add("modal-open");
  }

  function closeProfile() {
    profileModal.hidden = true;
    document.body.classList.remove("modal-open");
  }

  $("#profile-modal").addEventListener("click", (e) => { if (e.target === profileModal) closeProfile(); });
  $("#btn-logout").addEventListener("click", logout);
  $("#btn-profile").addEventListener("click", openProfile);

  function renderProfileChip() {
    const u = state.user;
    const chip = $("#profile-chip");
    if (!u) { chip.hidden = true; renderMode(); return; }
    chip.hidden = false;
    $("#profile-avatar").textContent = (u.nick || u.id).trim().charAt(0).toUpperCase() || "?";
    $("#profile-nick").textContent = u.nick || u.id;
    $("#profile-role").textContent = u.role || "Сотрудник";
    renderMode();
  }

  /* ---------------------------------------------------------
     7. РЕНДЕР СКРИПТА
     --------------------------------------------------------- */
  const sectionsEl = $("#sections");
  const navEl = $("#section-nav");
  let total = 0;
  const flat = [];

  function renderScript() {
    let n = 0;
    sectionsEl.innerHTML = "";
    navEl.innerHTML = "";
    flat.length = 0;

    SCRIPT.forEach((block, bi) => {
      const blockEl = document.createElement("section");
      blockEl.className = "block";
      blockEl.id = "block-" + block.id;

      const head = document.createElement("div");
      head.className = "block__head";
      head.innerHTML = `
        <span class="block__num">${bi + 1}</span>
        <div>
          <h3>${escapeHtml(block.title)}</h3>
          <p>${escapeHtml(block.subtitle)}</p>
        </div>`;
      blockEl.appendChild(head);

      block.items.forEach((item) => {
        n += 1;
        const id = "q" + n;
        const searchText = (item.q + " " + item.a.replace(/<[^>]+>/g, " ") + " " + (item.note || "") + " " + (item.tags || []).join(" ")).toLowerCase();
        flat.push({ id, n, block: block.id, item, search: searchText });

        const q = document.createElement("article");
        q.className = "q";
        q.id = "q-" + id;
        q.dataset.id = id;

        const tags = (item.tags || []).map((t) => `<span class="q__tag">${escapeHtml(t)}</span>`).join("");

        q.innerHTML = `
          <div class="q__row">
            <span class="q__num">${n}</span>
            <div class="q__body">
              <div class="q__text">${escapeHtml(item.q)}</div>
              ${tags ? `<div class="q__tags">${tags}</div>` : ""}
            </div>
            <div class="q__actions">
              <button class="icon-btn icon-btn--ok" type="button" data-act="check" title="Отметить как проверенный" aria-label="Отметить как проверенный">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m4 12.5 5 5L20 6.5"/></svg>
              </button>
              <button class="icon-btn icon-btn--copy" type="button" data-act="copy" title="Скопировать ответ" aria-label="Скопировать ответ">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h8"/></svg>
              </button>
              <button class="btn btn--soft btn--sm" type="button" data-act="toggle" aria-expanded="false">Ответ</button>
            </div>
          </div>
          <div class="q__answer">
            <div class="answer">
              <div class="answer__label">Эталонный ответ</div>
              <div>${item.a}</div>
              ${item.note ? `<p class="answer__note">${item.note}</p>` : ""}
            </div>
          </div>`;

        blockEl.appendChild(q);
      });

      sectionsEl.appendChild(blockEl);

      const link = document.createElement("a");
      link.href = "#block-" + block.id;
      link.dataset.target = block.id;
      link.innerHTML = `${escapeHtml(block.title)} <span>${block.items.length}</span>`;
      navEl.appendChild(link);
    });

    total = n;
    $("#stat-questions").textContent = n;
    $("#stat-sections").textContent = SCRIPT.length + 1;
    $("#pbar-text").textContent = `0 / ${n} проверено`;
    applyChecks();
  }

  /* ---------------------------------------------------------
     8. ДЕЙСТВИЯ С ВОПРОСАМИ
     --------------------------------------------------------- */
  sectionsEl.addEventListener("click", async (e) => {
    const btn = e.target.closest("[data-act]");
    if (!btn) return;
    const card = btn.closest(".q");
    const id = card.dataset.id;
    const entry = flat.find((f) => f.id === id);

    if (btn.dataset.act === "toggle") {
      const open = card.classList.toggle("is-open");
      btn.textContent = open ? "Скрыть" : "Ответ";
      btn.setAttribute("aria-expanded", String(open));
    }

    if (btn.dataset.act === "check") {
      const now = !state.checked.has(id);
      if (now) state.checked.add(id); else state.checked.delete(id);
      card.classList.toggle("is-checked", now);
      btn.classList.toggle("is-active", now);
      updateProgress();
      save();
    }

    if (btn.dataset.act === "copy") {
      const text = `${entry.n}. ${entry.item.q}\n— ${entry.item.a.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()}${entry.item.note ? "\nПримечание: " + entry.item.note.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() : ""}`;
      const ok = await copyText(text);
      toast(ok ? "Ответ скопирован" : "Не удалось скопировать");
    }
  });

  function setAll(open) {
    $$(".q").forEach((card) => {
      card.classList.toggle("is-open", open);
      const btn = $("[data-act='toggle']", card);
      if (btn) {
        btn.textContent = open ? "Скрыть" : "Ответ";
        btn.setAttribute("aria-expanded", String(open));
      }
    });
  }

  $("#btn-show-all").addEventListener("click", () => setAll(true));
  $("#btn-hide-all").addEventListener("click", () => setAll(false));

  $("#btn-reset-checks").addEventListener("click", () => {
    state.checked.clear();
    $$(".q").forEach((c) => {
      c.classList.remove("is-checked");
      $(".icon-btn--ok", c)?.classList.remove("is-active");
    });
    updateProgress();
    save();
    toast("Отметки сброшены");
  });

  /* ---------------------------------------------------------
     9. ПОИСК
     --------------------------------------------------------- */
  const searchEl = $("#search");
  const emptyEl = $("#empty");

  searchEl.addEventListener("input", () => {
    const q = searchEl.value.trim().toLowerCase();
    let visible = 0;
    flat.forEach((f) => {
      const card = document.getElementById("q-" + f.id);
      const hit = !q || f.search.includes(q);
      card.style.display = hit ? "" : "none";
      if (hit) visible++;
    });
    $$(".block").forEach((b) => {
      const any = $$(".q", b).some((c) => c.style.display !== "none");
      b.style.display = any ? "" : "none";
    });
    $$(".chips-nav a").forEach((a) => {
      const block = document.getElementById("block-" + a.dataset.target);
      a.style.display = block && block.style.display === "none" ? "none" : "";
    });
    emptyEl.hidden = visible > 0;
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchEl && !/input|textarea|select/i.test(document.activeElement.tagName)) {
      e.preventDefault();
      searchEl.focus();
    }
    if (e.key === "Escape") { closeOwner(); closeProfile(); }
  });

  /* ---------------------------------------------------------
     10. ПРОГРЕСС
     --------------------------------------------------------- */
  function applyChecks() {
    $$(".q").forEach((c) => {
      const on = state.checked.has(c.dataset.id);
      c.classList.toggle("is-checked", on);
      $(".icon-btn--ok", c)?.classList.toggle("is-active", on);
    });
  }

  function updateProgress() {
    const done = state.checked.size;
    const pct = total ? Math.round((done / total) * 100) : 0;
    $("#pbar-fill").style.width = pct + "%";
    $("#progress-bar").style.width = pct + "%";
    $("#pbar-text").textContent = `${done} / ${total} проверено`;
    $("#summary-fill").style.width = pct + "%";
    $("#summary-text").textContent = `${done} из ${total} вопросов проверено (${pct}%)`;

    const missed = flat.filter((f) => !state.checked.has(f.id));
    $("#summary").innerHTML = `
      <dt>Кандидат</dt><dd>${escapeHtml(state.candidate.nick || "—")}</dd>
      <dt>Возраст</dt><dd>${escapeHtml(state.candidate.age || "—")}</dd>
      <dt>Часовой пояс</dt><dd>${escapeHtml(state.candidate.tz || "—")}</dd>
      <dt>Время на проект</dt><dd>${escapeHtml(state.candidate.hours || "—")}</dd>
      <dt>Опыт</dt><dd>${escapeHtml(state.candidate.exp || "—")}</dd>
      <dt>Проверено</dt><dd>${done} / ${total} (${pct}%)</dd>
      <dt>Не проверено</dt><dd>${missed.length}</dd>
      <dt>Вердикт</dt><dd>${escapeHtml(state.verdict || "—")}</dd>`;
  }

  /* ---------------------------------------------------------
     11. ЧАСОВЫЕ ПОЯСА
     --------------------------------------------------------- */
  const TZ = [
    [-12, "UTC−12:00 — Мидуэй"], [-11, "UTC−11:00 — Алеутские острова"], [-10, "UTC−10:00 — Гонолулу, Гавайи"],
    [-9, "UTC−09:00 — Анкоридж"], [-8, "UTC−08:00 — Лос-Анджелес, Ванкувер"], [-7, "UTC−07:00 — Денвер, Финикс"],
    [-6, "UTC−06:00 — Чикаго, Мехико"], [-5, "UTC−05:00 — Нью-Йорк, Богота"], [-4, "UTC−04:00 — Каракас, Ла-Пас"],
    [-3, "UTC−03:00 — Сан-Паулу, Буэнос-Айрес"], [-2, "UTC−02:00 — Южная Георгия"], [-1, "UTC−01:00 — Азорские острова"],
    [0, "UTC±00:00 — Лондон, Лиссабон"], [1, "UTC+01:00 — Берлин, Прага, Варшава"], [2, "UTC+02:00 — Киев, Калининград, Хельсинки"],
    [3, "UTC+03:00 — Москва, Минск, Стамбул"], [4, "UTC+04:00 — Самара, Тбилиси, Ереван"], [5, "UTC+05:00 — Екатеринбург, Омск"],
    [6, "UTC+06:00 — Новосибирск, Красноярск"], [7, "UTC+07:00 — Иркутск, Ханты-Мансийск"], [8, "UTC+08:00 — Владивосток, Улан-Удэ"],
    [9, "UTC+09:00 — Якутск"], [10, "UTC+10:00 — Магадан, Петропавловск-Камчатский"], [11, "UTC+11:00 — Сахалин"],
    [12, "UTC+12:00 — Камчатка, Новая Зеландия"]
  ];

  function fillTimezones() {
    const sel = $("#c-tz");
    const current = -new Date().getTimezoneOffset() / 60;
    let best = 3, bestDiff = Infinity;
    TZ.forEach(([off]) => {
      const diff = Math.abs(off - current);
      if (diff < bestDiff) { bestDiff = diff; best = off; }
    });
    sel.innerHTML = `<option value="">— выберите пояс —</option>` +
      TZ.map(([off, label]) => `<option value="${label}">${label}</option>`).join("") +
      `<option value="Другой / гибкий график">Другой / гибкий график</option>`;
    return TZ[best][1];
  }

/* ---------------------------------------------------------
     12. КАНДИДАТ / ЗАМЕТКИ / ОТЧЁТ
     --------------------------------------------------------- */
  const form = $("#candidate-form");
  const fields = ["nick", "age", "tz", "hours", "discord", "notes", "exp"];

  function readForm() {
    const data = {};
    fields.forEach((f) => {
      const el = form.elements[f];
      if (!el) return;
      data[f] = el.type === "radio" ? (form.querySelector(`input[name="${f}"]:checked`)?.value ?? "") : el.value;
    });
    state.candidate = { ...state.candidate, ...data };
    return data;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    readForm();
    await pushState();
    updateProgress();
    const ok = $("#form-status");
    ok.classList.remove("err");
    ok.textContent = "Анкета сохранена";
    toast("Анкета кандидата сохранена");
  });

  form.addEventListener("input", () => {
    readForm();
    save();
    updateProgress();
  });

  $("#btn-clear-candidate").addEventListener("click", async () => {
    form.reset();
    readForm();
    await pushState();
    updateProgress();
    toast("Анкета очищена");
  });

  const notesEl = $("#quick-notes");
  notesEl.addEventListener("input", () => {
    state.notes = notesEl.value;
    save();
  });

  $("#btn-copy-notes").addEventListener("click", async () => {
    const ok = await copyText(notesEl.value);
    toast(ok ? "Заметки скопированы" : "Не удалось скопировать");
  });

  $$('input[name="verdict"]').forEach((r) => {
    r.addEventListener("change", () => {
      state.verdict = r.value;
      $$(".verdict__box").forEach((b) => b.classList.remove("is-on"));
      r.nextElementSibling.classList.add("is-on");
      save();
      updateProgress();
    });
  });

  const commentEl = $("#r-comment");
  commentEl.addEventListener("input", () => {
    state.comment = commentEl.value;
    save();
  });

  function buildReport() {
    const c = state.candidate;
    const done = state.checked.size;
    const missed = flat.filter((f) => !state.checked.has(f.id));
    const lines = [];
    lines.push("ОТЧЁТ ПО ОБЗВОНУ НА АДМИНИСТРАЦИЮ");
    lines.push("Дата: " + new Date().toLocaleString("ru-RU"));
    lines.push("");
    lines.push("КАНДИДАТ");
    const row = (label, value) => "  " + label.padEnd(16, " ") + ": " + (value || "—");
    lines.push(row("Никнейм", c.nick));
    lines.push(row("Возраст", c.age));
    lines.push(row("Часовой пояс", c.tz));
    lines.push(row("Время на проект", c.hours));
    lines.push(row("Опыт", c.exp));
    lines.push(row("Discord/контакт", c.discord));
    lines.push("");
    lines.push("РЕЗУЛЬТАТ");
    lines.push("  Проверено вопросов: " + done + " / " + total + (total ? " (" + Math.round(done / total * 100) + "%)" : ""));
    lines.push("  Вердикт: " + (state.verdict || "не выбран"));
    if (state.comment.trim()) lines.push("  Комментарий: " + state.comment.trim());
    if (missed.length) {
      lines.push("");
      lines.push("НЕ ПРОВЕРЕННЫЕ ВОПРОСЫ (" + missed.length + ")");
      missed.forEach((f) => lines.push("  " + f.n + ". " + f.item.q));
    }
    if (c.notes.trim()) {
      lines.push("");
      lines.push("ЗАМЕТКИ О КАНДИДАТЕ");
      lines.push("  " + c.notes.trim().replace(/\n/g, "\n  "));
    }
    if (state.notes.trim()) {
      lines.push("");
      lines.push("ЗАМЕТКИ С СОБЕСЕДОВАНИЯ");
      lines.push("  " + state.notes.trim().replace(/\n/g, "\n  "));
    }
    lines.push("");
    lines.push("— Сгенерировано сервисом «Обзвон»");
    return lines.join("\n");
  }

  $("#btn-report").addEventListener("click", async () => {
    readForm();
    await pushState();
    const ok = await copyText(buildReport());
    const st = $("#report-status");
    st.classList.toggle("err", !ok);
    st.textContent = ok ? "Отчёт скопирован в буфер обмена" : "Не удалось скопировать отчёт";
    if (ok) toast("Отчёт скопирован");
  });

  $("#btn-report-file").addEventListener("click", async () => {
    readForm();
    await pushState();
    const blob = new Blob(["\uFEFF" + buildReport()], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "obzvon_" + (state.candidate.nick || "kandidat").replace(/[^\wа-яА-ЯёЁ-]/gi, "_") + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    $("#report-status").textContent = "Файл отчёта скачан";
  });

  $("#btn-print-report").addEventListener("click", () => window.print());
  $("#btn-print").addEventListener("click", () => window.print());

  /* ---------------------------------------------------------
     13. ТЕМА
     --------------------------------------------------------- */
  function setTheme(theme, animate = true) {
    const root = document.documentElement;
    if (animate) {
      root.classList.add("theme-switching");
      requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("theme-switching")));
    }
    root.dataset.theme = theme;
    safe.set(THEME_KEY, theme);
  }

  $("#btn-theme").addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    setTheme(next);
    toast(next === "dark" ? "Тёмная тема" : "Светлая тема");
  });

  /* ---------------------------------------------------------
     14. СБРОС ДАННЫХ
     --------------------------------------------------------- */
  $("#btn-reset-all").addEventListener("click", async () => {
    if (!confirm("Сбросить анкету, отметки, заметки и вердикт?")) return;
    state.checked.clear();
    state.candidate = { nick: "", age: "", tz: "", hours: "", discord: "", notes: "", exp: "" };
    state.notes = "";
    state.verdict = "";
    state.comment = "";
    form.reset();
    notesEl.value = "";
    commentEl.value = "";
    $$(".q").forEach((c) => { c.classList.remove("is-checked"); $(".icon-btn--ok", c)?.classList.remove("is-active"); });
    $$('input[name="verdict"]').forEach((r) => r.checked = false);
    $$(".verdict__box").forEach((b) => b.classList.remove("is-on"));
    await pushState();
    updateProgress();
    toast("Все данные сброшены");
  });

  /* ---------------------------------------------------------
     15. АКТИВНЫЙ ПУНКТ НАВИГАЦИИ
     --------------------------------------------------------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id.replace("block-", "");
      $$(".chips-nav a").forEach((a) => a.classList.toggle("is-active", a.dataset.target === id));
    });
  }, { rootMargin: "-25% 0px -65% 0px" });

  /* ---------------------------------------------------------
     16. СОХРАНЕНИЕ / ЗАГРУЗКА ДАННЫХ ПОЛЬЗОВАТЕЛЯ
     --------------------------------------------------------- */
  let saveTimer = null;

  function collectState() {
    return {
      candidate: state.candidate,
      notes: state.notes,
      verdict: state.verdict,
      comment: state.comment,
      checked: Array.from(state.checked)
    };
  }

  function save() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(pushState, 450);
  }

  async function pushState() {
    clearTimeout(saveTimer);
    const res = await api.saveState(collectState());
    const time = new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    const el = $("#notes-status");
    if (res && res.ok === false) {
      if (el) el.textContent = "Не удалось сохранить (" + errText(res.error) + ")";
      return;
    }
    if (el) el.textContent = (api.mode === "cloud" ? "Сохранено в общей базе " : "Сохранено ") + time;
  }

  async function loadUserData() {
    const saved = await api.getState();
    state.candidate = { nick: "", age: "", tz: "", hours: "", discord: "", notes: "", exp: "", ...(saved.candidate || {}) };
    state.notes = saved.notes || "";
    state.verdict = saved.verdict || "";
    state.comment = saved.comment || "";
    state.checked = new Set(Array.isArray(saved.checked) ? saved.checked : []);
  }

  function fillForm() {
    fields.forEach((f) => {
      const el = form.elements[f];
      if (!el) return;
      const value = state.candidate[f];
      if (el.type === "radio") {
        const r = value ? form.querySelector(`input[name="${f}"][value="${CSS.escape(String(value))}"]`) : null;
        if (r) r.checked = true;
      } else if (value) {
        el.value = value;
      }
    });
    notesEl.value = state.notes;
    commentEl.value = state.comment;
    if (state.verdict) {
      const r = document.querySelector(`input[name="verdict"][value="${CSS.escape(state.verdict)}"]`);
      if (r) { r.checked = true; r.nextElementSibling.classList.add("is-on"); }
    }
  }

  /* ---------------------------------------------------------
     17. ВХОД / ВЫХОД В САЙТ
     --------------------------------------------------------- */
  async function enterSite() {
    hideGate();
    await loadUserData();
    fillForm();
    renderScript();
    updateProgress();
    renderProfileChip();
    $("#btn-owner-open").hidden = !api.isOwnerSession;
    $$(".block").forEach((b) => observer.observe(b));
    $$(".chips-nav a")[0]?.classList.add("is-active");
  }

  async function logout() {
    await api.logout();
    state.user = null;
    state.checked = new Set();
    window.location.reload();
  }

  /* ---------------------------------------------------------
     18. ЗАПУСК
     --------------------------------------------------------- */
  async function init() {
    // тема и списки
    setTheme(safe.get(THEME_KEY) || "dark", false);
    fillTimezones();

    // определяем режим работы: общая база или локально
    const modeRes = await api.detectMode();
    renderMode();

    // восстанавливаем сессию
    const res = await api.resume();
    if (res.user) {
      state.user = res.user;
      await enterSite();
      if (res.owner) toast("Сессия владельца восстановлена");
      return;
    }

    // экран доступа
    showGate();
    fillDbFields();

    const st = await api.ownerStatus();
    if (modeRes.error) {
      gateMessage("Общая база недоступна (" + errText(modeRes.error) + "). Включён локальный режим.", "info");
    } else if (res.owner) {
      gateMessage("Сессия владельца восстановлена — откройте панель управления.", "info");
    } else if (!st.initialized) {
      gateMessage("Система не инициализирована: войдите как владелец и задайте пароль.", "info");
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // служебное — для проверки в консоли
  window.__obzvon = {
    sha256: (s) => api.sha256(s),
    derivePassword: (p, s, i) => api.derivePassword(p, s, i),
    state, api,
    loginUser: (id, remember) => api.login(id, remember),
    logout
  };
})();

