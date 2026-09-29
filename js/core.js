/* Ядро сайта: общие функции, хранилище, роутер с ленивой загрузкой разделов, тема, меню, голоса.
   Каждый раздел лежит в js/pages/*.js и регистрирует себя в App.pages. */
(() => {
  "use strict";

  const VERSION = "3";
  const app = document.getElementById("app");
  const App = (window.App = { pages: {} });

  /* ---------- Мелкие помощники ---------- */
  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const norm = (s) => String(s).toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,]$/, "");
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const nextFrame = () => new Promise((r) => requestAnimationFrame(() => r()));
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function fmtTime(sec) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  }

  // Полоска прогресса анимируется через transform — это дешевле, чем менять ширину.
  function bar(pct, label = "") {
    const v = Math.max(0, Math.min(100, pct || 0));
    return `<div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(v)}"${label ? ` aria-label="${esc(label)}"` : ""}><div style="transform:scaleX(${v / 100})"></div></div>`;
  }

  function download(filename, text, type = "text/csv;charset=utf-8") {
    const url = URL.createObjectURL(new Blob([text], { type }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  /* ---------- Хранилище ----------
     Значения держим в памяти, а в localStorage пишем пачкой с задержкой,
     чтобы частые изменения (набор текста, карточки) не дёргали диск.
     localStorage может быть недоступен (приватный режим) — сайт должен работать и без него. */
  const PREFIX = "ielts:";
  const cache = new Map();
  const dirty = new Set();
  let flushTimer = null;

  const store = {
    get(key, fallback) {
      if (!cache.has(key)) {
        let v;
        try {
          const raw = localStorage.getItem(PREFIX + key);
          v = raw === null ? undefined : JSON.parse(raw);
        } catch { v = undefined; }
        cache.set(key, v);
      }
      const v = cache.get(key);
      return v === undefined ? fallback : v;
    },
    set(key, value) {
      cache.set(key, value);
      dirty.add(key);
      clearTimeout(flushTimer);
      flushTimer = setTimeout(store.flush, 400);
    },
    // Немедленная запись; возвращает false, если места не хватило.
    setNow(key, value) {
      store.set(key, value);
      return store.flush();
    },
    flush() {
      clearTimeout(flushTimer);
      let ok = true;
      dirty.forEach((key) => {
        try {
          const v = cache.get(key);
          if (v === undefined) localStorage.removeItem(PREFIX + key);
          else localStorage.setItem(PREFIX + key, JSON.stringify(v));
        } catch { ok = false; }
      });
      dirty.clear();
      return ok;
    }
  };
  window.addEventListener("pagehide", store.flush);
  document.addEventListener("visibilitychange", () => { if (document.hidden) store.flush(); });

  /* ---------- Уборка при уходе со страницы ---------- */
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);
  function runCleanups() {
    const list = cleanups;
    cleanups = [];
    list.forEach((fn) => { try { fn(); } catch (e) { console.warn(e); } });
  }

  function onKey(handler) {
    const h = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (e.target.closest("input, textarea, select, [contenteditable]")) return;
      // Пробел и Enter на кнопке браузер и так превращает в клик.
      if ((e.key === " " || e.key === "Enter") && e.target.closest("button, a, [role=button]")) return;
      handler(e);
    };
    document.addEventListener("keydown", h);
    onLeave(() => document.removeEventListener("keydown", h));
  }

  function makeTimer(el, seconds, { onEnd } = {}) {
    let left = seconds;
    let id = null;
    const render = () => {
      el.textContent = fmtTime(left);
      el.classList.toggle("low", left <= 60 && left > 0);
    };
    const t = {
      start() {
        if (id) return;
        id = setInterval(() => {
          left--;
          render();
          if (left <= 0) { t.stop(); if (onEnd) onEnd(); }
        }, 1000);
      },
      stop() { clearInterval(id); id = null; },
      reset(sec = seconds) { t.stop(); seconds = sec; left = sec; render(); },
      get running() { return id !== null; }
    };
    render();
    onLeave(t.stop);
    return t;
  }

  /* ---------- Результаты ---------- */
  function rawToBand(raw, table) {
    for (const [min, band] of table) if (raw >= min) return band;
    return 0;
  }

  function saveBest(key, score, total) {
    const best = store.get("best", {});
    const prev = best[key];
    if (!prev || score / total > prev.score / prev.total) {
      best[key] = { score, total, date: new Date().toISOString().slice(0, 10) };
      store.set("best", { ...best });
    }
  }

  /* ---------- Вопросы (Reading и Listening) ---------- */
  const SELECT_OPTS = { tfng: ["TRUE", "FALSE", "NOT GIVEN"], yng: ["YES", "NO", "NOT GIVEN"] };

  // prefix нужен, когда на странице несколько блоков вопросов; start — номер первого вопроса.
  function renderQuestions(questions, { letters = [], prefix = "q", start = 1 } = {}) {
    let n = start - 1;
    return questions.map((q, i) => {
      if (q.type === "info") {
        const list = q.list ? `<ul class="opt-list">${q.list.map(([k, v]) => `<li><b>${esc(k)}</b> ${esc(v)}</li>`).join("")}</ul>` : "";
        return `<div class="instructions">${esc(q.text)}${list}</div>`;
      }
      n++;
      const name = `${prefix}${i}`;
      const labelId = `${name}-t`;
      let input;
      if (q.type === "mcq") {
        input = `<div role="radiogroup" aria-labelledby="${labelId}">${q.options.map((o, k) =>
          `<label class="opt"><input type="radio" name="${name}" value="${k}"> <span><b>${"ABCD"[k]}</b> ${esc(o)}</span></label>`).join("")}</div>`;
      } else if (q.type === "gap") {
        input = `<input type="text" name="${name}" autocomplete="off" autocapitalize="off" spellcheck="false" placeholder="ваш ответ" aria-labelledby="${labelId}">`;
      } else {
        const opts = q.type === "para" ? letters : q.type === "match" ? q.options.split("") : SELECT_OPTS[q.type];
        input = `<select name="${name}" aria-labelledby="${labelId}"><option value="">—</option>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
      }
      return `<div class="q" data-i="${i}">
        <div class="q-text" id="${labelId}"><span class="q-num">${n}</span>${esc(q.text)}</div>
        ${input}
        <div class="answer-note" aria-live="polite"></div>
      </div>`;
    }).join("");
  }

  function checkQuestions(root, questions, { prefix = "q" } = {}) {
    let score = 0, total = 0;
    questions.forEach((q, i) => {
      if (q.type === "info") return;
      total++;
      const name = `${prefix}${i}`;
      const box = $(`.q[data-i="${i}"]`, root);
      let ok, correctText;
      if (q.type === "mcq") {
        const r = $(`input[name="${name}"]:checked`, root);
        ok = r !== null && Number(r.value) === q.answer;
        correctText = `${"ABCD"[q.answer]}. ${q.options[q.answer]}`;
      } else if (q.type === "gap") {
        const given = norm($(`[name="${name}"]`, root).value);
        ok = q.answer.some((a) => norm(a) === given);
        correctText = q.answer[0];
      } else {
        ok = $(`[name="${name}"]`, root).value === q.answer;
        correctText = q.answer;
      }
      if (ok) score++;
      box.classList.remove("correct", "wrong");
      box.classList.add(ok ? "correct" : "wrong");
      $(".answer-note", box).innerHTML = ok ? "✔ Верно" : `✘ Правильный ответ: <b>${esc(correctText)}</b>`;
    });
    return { score, total };
  }

  function resetQuestions(root) {
    $$(".q", root).forEach((b) => { b.classList.remove("correct", "wrong"); $(".answer-note", b).textContent = ""; });
    $$("input[type=text], select", root).forEach((el) => { el.value = ""; });
    $$("input[type=radio]", root).forEach((el) => { el.checked = false; });
  }

  // Вкладки внутри раздела — обычные ссылки, поэтому работают с клавиатуры и кнопкой «Назад».
  function tabs(items, activeId, base, label = "Подразделы") {
    const nav = document.createElement("nav");
    nav.className = "tabs";
    nav.setAttribute("aria-label", label);
    nav.innerHTML = items.map((it) =>
      `<a class="tab${it.id === activeId ? " active" : ""}" href="#${base}/${esc(it.id)}"${it.id === activeId ? ' aria-current="page"' : ""}>${esc(it.label)}</a>`).join("");
    return nav;
  }

  /* ---------- Голоса (Web Speech API) ---------- */
  const synth = window.speechSynthesis || null;
  const FEMALE = /female|woman|samantha|serena|kate|libby|sonia|hazel|susan|martha|fiona|karen|moira|tessa|victoria|zira|aria|jenny|emma|amy|mia|olivia|natasha|catherine|allison|ava|joanna|kendra|salli|maisie|bella/i;
  const MALE = /\bmale\b|\bman\b|daniel|george|ryan|thomas|arthur|oliver|alex\b|fred|david|mark|guy|brian|james|rishi|william|lee|gordon|aaron|matthew|joey|justin|eric|christopher|andrew|roger/i;

  const voices = {
    supported: !!synth && typeof window.SpeechSynthesisUtterance === "function",
    list: [],
    // Голоса в Chrome приходят асинхронно — ждём событие voiceschanged, но не дольше timeout.
    ready(timeout = 2500) {
      if (!voices.supported) return Promise.resolve([]);
      const now = synth.getVoices();
      if (now.length) return Promise.resolve((voices.list = now));
      return new Promise((resolve) => {
        const done = () => {
          synth.removeEventListener("voiceschanged", done);
          clearTimeout(t);
          resolve((voices.list = synth.getVoices()));
        };
        const t = setTimeout(done, timeout);
        synth.addEventListener("voiceschanged", done);
      });
    },
    english() {
      const en = voices.list.filter((v) => /^en[-_]/i.test(v.lang) || v.lang === "en");
      const rank = (v) => (/GB/i.test(v.lang) ? 0 : /AU|IE|NZ/i.test(v.lang) ? 1 : 2) * 10 + (v.localService ? 0 : 1);
      return en.sort((a, b) => rank(a) - rank(b));
    },
    gender(v) {
      if (FEMALE.test(v.name)) return "f";
      if (MALE.test(v.name)) return "m";
      return "?";
    },
    // Подбирает голоса для говорящих: сначала нужный пол, затем британский акцент, затем — чтобы голоса не повторялись.
    // Если голос всё же приходится повторить, меняем высоту тона, чтобы говорящих было легко различить.
    cast(speakers) {
      const en = voices.english();
      const uses = new Map();
      const result = {};
      speakers.forEach((sp) => {
        const score = (v) => {
          const g = voices.gender(v);
          return (g === sp.gender ? 0 : g === "?" ? 3 : 6) + (/GB/i.test(v.lang) ? 0 : 2) + (uses.get(v) || 0) * 4;
        };
        let voice = null;
        en.forEach((v) => { if (!voice || score(v) < score(voice)) voice = v; });
        const reused = voice ? uses.get(voice) || 0 : 0;
        if (voice) uses.set(voice, reused + 1);
        const genderOk = voice && voices.gender(voice) === sp.gender;
        let pitch = genderOk ? (sp.gender === "f" ? 1.05 : 0.95) : sp.gender === "f" ? 1.3 : 0.75;
        if (reused || !voice) pitch *= sp.gender === "f" ? 1.12 : 0.88;
        result[sp.id] = { voice, pitch: Math.round(pitch * 100) / 100 };
      });
      return result;
    },
    // Голос диктора — британский и как можно реже занятый говорящими.
    narrator(casts) {
      const en = voices.english();
      const count = new Map();
      casts.forEach((c) => Object.values(c).forEach(({ voice }) => { if (voice) count.set(voice, (count.get(voice) || 0) + 1); }));
      let best = null;
      const score = (v) => (/GB/i.test(v.lang) ? 0 : 100) + (count.get(v) || 0);
      en.forEach((v) => { if (!best || score(v) < score(best)) best = v; });
      return { voice: best, pitch: 1 };
    }
  };

  function speak(text) {
    if (!voices.supported) return;
    voices.ready().then(() => {
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text);
      const v = voices.english()[0];
      if (v) { u.voice = v; u.lang = v.lang; } else u.lang = "en-GB";
      u.rate = 0.95;
      synth.speak(u);
    });
    onLeave(() => synth.cancel());
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      o.frequency.value = 880;
      o.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.25);
      o.onended = () => ctx.close();
    } catch { /* без звука */ }
  }

  /* ---------- Ленивая загрузка разделов ---------- */
  const DATA = (n) => `js/data/${n}.js`;
  const PAGE = (n) => `js/pages/${n}.js`;
  const ROUTES = {
    home: [DATA("reading"), DATA("listening"), DATA("words"), "js/vocab-core.js", PAGE("home")],
    reading: [DATA("reading"), DATA("bands"), PAGE("reading")],
    listening: [DATA("listening"), DATA("bands"), PAGE("listening")],
    writing: [DATA("writing"), PAGE("writing")],
    speaking: [DATA("speaking"), PAGE("speaking")],
    vocab: [DATA("words"), "js/vocab-core.js", PAGE("vocab")],
    calc: [DATA("bands"), PAGE("calc")]
  };
  const scripts = {};

  function loadScript(src) {
    if (!scripts[src]) {
      scripts[src] = new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${src}?v=${VERSION}`;
        s.async = false; // качаются параллельно, выполняются по порядку
        s.onload = resolve;
        s.onerror = () => { delete scripts[src]; s.remove(); reject(new Error("Не удалось загрузить " + src)); };
        document.head.appendChild(s);
      });
    }
    return scripts[src];
  }

  let routeSeq = 0;
  let firstRoute = true;

  async function route() {
    const seq = ++routeSeq;
    runCleanups();
    const [name, ...rest] = (location.hash.slice(1) || "home").split("/");
    const param = rest.join("/");
    const page = ROUTES[name] ? name : "home";
    setActiveNav(page);
    setMenu(false);

    if (!App.pages[page]) {
      app.setAttribute("aria-busy", "true");
      const slow = setTimeout(() => { app.innerHTML = '<div class="loading" role="status">Загрузка…</div>'; }, 150);
      try {
        await Promise.all(ROUTES[page].map(loadScript));
      } catch (e) {
        clearTimeout(slow);
        app.removeAttribute("aria-busy");
        app.innerHTML = `<div class="card empty-state" role="alert"><h1>Раздел не загрузился</h1>
          <p class="muted">Проверьте подключение к интернету.</p><button class="btn" id="retry">Повторить</button></div>`;
        $("#retry").onclick = route;
        return;
      }
      clearTimeout(slow);
      app.removeAttribute("aria-busy");
      if (seq !== routeSeq) return; // пользователь уже ушёл в другой раздел
    }

    App.pages[page](param);
    app.classList.remove("page-enter");
    void app.offsetWidth; // перезапуск анимации появления
    app.classList.add("page-enter");
    const title = $("h1", app);
    document.title = (title && page !== "home" ? title.textContent + " — " : "") + "IELTS Prep";
    window.scrollTo(0, 0);
    // При переходе переводим фокус на заголовок, чтобы экранный диктор прочитал новый раздел.
    if (!firstRoute && title) {
      title.setAttribute("tabindex", "-1");
      title.focus({ preventScroll: true });
    }
    firstRoute = false;
  }

  function setActiveNav(page) {
    $$("#nav a").forEach((a) => {
      const on = a.dataset.route === page;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
  }

  /* ---------- Меню ---------- */
  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  }
  $("#menuBtn").addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  $("#navBackdrop").addEventListener("click", () => setMenu(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("menu-open")) {
      setMenu(false);
      $("#menuBtn").focus();
    }
  });

  /* ---------- Тема ---------- */
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light");
  function renderThemeBtn() {
    const dark = currentTheme() === "dark";
    const btn = $("#themeBtn");
    btn.querySelector("span").textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
    btn.title = btn.getAttribute("aria-label");
    $('meta[name="theme-color"]').content = dark ? "#0c0f1d" : "#4f46e5";
  }
  $("#themeBtn").addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.setNow("theme", next);
    renderThemeBtn();
  });
  darkQuery.addEventListener("change", renderThemeBtn);
  renderThemeBtn();

  Object.assign(App, {
    app, esc, $, $$, norm, pick, shuffle, fmtTime, bar, download, nextFrame, sleep,
    store, onLeave, onKey, makeTimer, rawToBand, saveBest,
    renderQuestions, checkQuestions, resetQuestions, tabs,
    voices, speak, beep
  });

  window.addEventListener("hashchange", route);
  route();
})();
