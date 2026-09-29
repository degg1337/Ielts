/* Пробный экзамен IELTS Academic: Listening → Reading → Writing → Speaking → самооценка → итог.
   Состояние сохраняется после каждого действия (store "examRun"), поэтому экзамен можно продолжить
   после закрытия вкладки. Записи Speaking хранятся в IndexedDB. */
(() => {
  "use strict";
  const {
    app, esc, $, $$, store, bar, fmtTime, rawToBand, roundBand, renderQuestions, checkQuestions,
    onLeave, voices, beep, activity, loadScript, speak
  } = App;
  const L = App.listen;

  const RUN = "examRun";
  const HIST = "examHistory";
  const SECTIONS = ["listening", "reading", "writing", "speaking"];
  const NAMES = { listening: "Listening", reading: "Reading", writing: "Writing", speaking: "Speaking" };
  const TIME = { reading: 60 * 60, writing: 60 * 60, review: 2 * 60 };
  const MIN_WORDS = { t1: 150, t2: 250 };
  const HISTORY_LIMIT = 30;
  const KEEP_RECORDINGS = 5; // записи храним для последних попыток

  /* ---------- Критерии самооценки ---------- */
  const CRITERIA = {
    t1: [
      ["TA", "Task Achievement", "Описаны главные тенденции и есть обзор (overview); данные точные, сравнения уместные; не меньше 150 слов, без личного мнения."],
      ["CC", "Coherence & Cohesion", "Логичный порядок, абзацы по смыслу, связки (while, whereas, in contrast) используются уместно и без перебора."],
      ["LR", "Lexical Resource", "Разнообразная и точная лексика для описания изменений (rose sharply, remained stable); мало повторов и ошибок в словах."],
      ["GRA", "Grammatical Range & Accuracy", "Есть сложные предложения и разные конструкции; большая часть предложений без ошибок."]
    ],
    t2: [
      ["TR", "Task Response", "Раскрыты все части вопроса, позиция ясна от начала до конца, идеи развиты и подкреплены примерами; не меньше 250 слов."],
      ["CC", "Coherence & Cohesion", "Введение, абзацы с одной главной мыслью, заключение; связки помогают, а не мешают читать."],
      ["LR", "Lexical Resource", "Точные слова по теме, коллокации, синонимы вместо повторов; орфография почти без ошибок."],
      ["GRA", "Grammatical Range & Accuracy", "Разнообразие конструкций (условные, придаточные, пассив) и много предложений без ошибок."]
    ],
    speaking: [
      ["FC", "Fluency & Coherence", "Говорите без долгих пауз и частых самоисправлений, развиваете ответ, связываете мысли."],
      ["LR", "Lexical Resource", "Хватает слов, чтобы говорить на тему подробно; используете синонимы и устойчивые выражения."],
      ["GRA", "Grammatical Range & Accuracy", "Используете и простые, и сложные предложения; ошибки редкие и не мешают понимать."],
      ["P", "Pronunciation", "Вас легко понять: звуки, ударение в словах, интонация и ритм фраз."]
    ]
  };
  const BAND_LABELS = {
    9: "9 — уровень эксперта", 8: "8 — очень хорошо, редкие неточности", 7: "7 — хорошо, ошибки не мешают",
    6: "6 — уверенно, но заметные ошибки", 5: "5 — ограниченно, ошибки мешают", 4: "4 — слабо",
    3: "3 — очень слабо", 2: "2 — почти нет ответа", 1: "1 — нет ответа"
  };

  /* ---------- Записи голоса: IndexedDB ---------- */
  const rec = {
    db: null,
    open() {
      if (rec.db) return Promise.resolve(rec.db);
      return new Promise((resolve, reject) => {
        if (!window.indexedDB) return reject(new Error("no idb"));
        const r = indexedDB.open("ielts-prep", 1);
        r.onupgradeneeded = () => r.result.createObjectStore("recordings", { keyPath: "key" });
        r.onsuccess = () => resolve((rec.db = r.result));
        r.onerror = () => reject(r.error);
      });
    },
    async tx(mode, fn) {
      const db = await rec.open();
      return new Promise((resolve, reject) => {
        const t = db.transaction("recordings", mode);
        const out = fn(t.objectStore("recordings"));
        t.oncomplete = () => resolve(out && out.result);
        t.onerror = () => reject(t.error);
      });
    },
    put: (key, blob, attempt) => rec.tx("readwrite", (s) => s.put({ key, blob, attempt, date: Date.now() })).catch(() => null),
    get: (key) => rec.tx("readonly", (s) => s.get(key)).catch(() => null),
    async prune(keepAttempts) {
      try {
        const all = await rec.tx("readonly", (s) => s.getAll());
        const old = (all || []).filter((r) => !keepAttempts.includes(r.attempt));
        if (old.length) await rec.tx("readwrite", (s) => old.forEach((r) => s.delete(r.key)));
      } catch { /* нет IndexedDB — нечего чистить */ }
    }
  };

  /* ---------- Помощники ---------- */
  const words = (t) => (t.match(/[A-Za-zÀ-ÿ0-9'’-]+/g) || []).length;
  const bandText = (b) => (b === null || b === undefined ? "—" : b.toFixed(1));
  const now = () => Date.now();

  function collect(root) {
    const out = {};
    $$("input, select", root).forEach((el) => {
      if (!el.name) return;
      if (el.type === "radio") { if (el.checked) out[el.name] = el.value; }
      else if (el.value) out[el.name] = el.value;
    });
    return out;
  }
  function restore(root, answers) {
    Object.entries(answers || {}).forEach(([name, v]) => {
      const radio = $(`input[type=radio][name="${name}"][value="${CSS.escape(v)}"]`, root);
      if (radio) radio.checked = true;
      else { const el = $(`[name="${name}"]`, root); if (el) el.value = v; }
    });
  }

  function loadVariant(id) {
    const meta = EXAM_LIST.find((e) => e.id === id);
    return loadScript(`js/data/${meta.file}.js`).then(() => window.EXAMS[id]);
  }

  // Счётчик по реальному времени: не сбивается, если вкладка была в фоне. getLeft/setLeft — секунды в состоянии.
  function countdown(el, getLeft, setLeft, onEnd) {
    let startAt = now();
    let base = getLeft();
    let lastShown = null;
    const tick = () => {
      const left = Math.max(0, Math.ceil(base - (now() - startAt) / 1000));
      if (left !== lastShown) {
        lastShown = left;
        setLeft(left);
        if (el) { el.textContent = fmtTime(left); el.classList.toggle("low", left <= 300); }
      }
      if (left <= 0) { stop(); onEnd(); }
    };
    const id = setInterval(tick, 250);
    const stop = () => clearInterval(id);
    onLeave(stop);
    tick();
    return { stop, reset() { startAt = now(); base = getLeft(); } };
  }

  /* ---------- Состояние ---------- */
  const getRun = () => store.get(RUN, null);
  const saveRun = (run) => store.set(RUN, { ...run, updatedAt: now() });
  function newRun(variant) {
    return {
      v: 1, id: "x" + now().toString(36), variant, startedAt: now(), stage: "listening",
      sec: {
        listening: { started: false, step: 0, finished: false, review: TIME.review, answers: {} },
        reading: { started: false, left: TIME.reading, answers: {}, passage: 0 },
        writing: { started: false, left: TIME.writing, t1: "", t2: "", task: 1 },
        speaking: { started: false, part: 1, notes: "", done: {} }
      },
      skipped: {},
      assess: { t1: {}, t2: {}, speaking: {} },
      results: {}
    };
  }

  /* ---------- Страница ---------- */
  App.pages.exam = (param = "") => {
    const [mode, id] = param.split("/");
    if (mode === "run") return renderRun();
    if (mode === "result") return renderResult(id);
    renderLanding();
  };

  /* ---------- Выбор варианта ---------- */
  function renderLanding() {
    const run = getRun();
    const hist = store.get(HIST, []);
    const active = run && run.stage !== "done" ? run : null;
    const activeInfo = active ? describeRun(active) : "";

    app.innerHTML = `
      <h1>Пробный экзамен</h1>
      <p class="lead">Полный IELTS Academic в одном блоке: Listening, Reading, Writing и Speaking подряд, с таймерами как на экзамене. Listening и Reading проверяются автоматически, Writing и Speaking вы оцениваете сами по критериям IELTS.</p>
      ${active ? `
        <section class="card resume-card" aria-labelledby="resumeTitle">
          <h2 class="card-title" id="resumeTitle">⏸ Незавершённый экзамен</h2>
          <p>${activeInfo}</p>
          <div class="row"><a class="btn" href="#exam/run">Продолжить</a><button class="btn ghost" id="exDiscard">Сбросить и начать заново</button></div>
        </section>` : ""}
      <section aria-labelledby="fmtTitle">
        <h2 id="fmtTitle">Как проходит экзамен</h2>
        <div class="exam-steps">
          <div class="card"><b>🎧 Listening</b><span>≈ 30 мин · 4 части, 40 вопросов. Запись звучит один раз, перед каждой частью время прочитать вопросы, в конце 2 минуты на проверку.</span></div>
          <div class="card"><b>📖 Reading</b><span>60 мин · 3 текста, 40 вопросов: TRUE/FALSE/NOT GIVEN, заголовки, пропуски, выбор ответа.</span></div>
          <div class="card"><b>✍️ Writing</b><span>60 мин · Task 1 (график, 150+ слов) и Task 2 (эссе, 250+ слов).</span></div>
          <div class="card"><b>🗣️ Speaking</b><span>11–14 мин · вопросы задаёт голос экзаменатора, ответы записываются с микрофона.</span></div>
        </div>
        <p class="muted small">Между секциями можно сделать перерыв: следующая секция начинается по кнопке. Если закрыть вкладку, прогресс сохранится; время секции останавливается, пока экзамен закрыт.</p>
      </section>
      <section aria-labelledby="varTitle">
        <h2 id="varTitle">Выберите вариант</h2>
        <div class="grid">
          ${EXAM_LIST.map((v) => {
            const tries = hist.filter((h) => h.variant === v.id);
            const best = tries.reduce((m, h) => (h.overall !== null && h.overall > m ? h.overall : m), -1);
            return `<article class="card variant-card">
              <div class="row between"><h3 class="card-title">${esc(v.title)}</h3>${tries.length ? `<span class="badge ok">лучший: ${best >= 0 ? best.toFixed(1) : "—"}</span>` : '<span class="badge">не пройден</span>'}</div>
              <dl class="topics">
                ${SECTIONS.map((s) => `<dt>${NAMES[s]}</dt><dd>${esc(v.topics[s])}</dd>`).join("")}
              </dl>
              <button class="btn" data-start="${v.id}">Начать ${esc(v.title.toLowerCase())}</button>
            </article>`;
          }).join("")}
        </div>
      </section>
      <section aria-labelledby="histTitle">
        <h2 id="histTitle">История попыток</h2>
        <div class="card" id="exHistory">${historyHtml(hist)}</div>
      </section>
      <section aria-labelledby="realTitle">
        <h2 id="realTitle">Реальные тесты</h2>
        <div class="card">
          <p class="muted small">Официальные бесплатные материалы от организаторов экзамена — полезно пройти хотя бы один перед реальным IELTS. Ссылки открываются в новой вкладке.</p>
          <ul class="link-list">
            ${OFFICIAL_TESTS.map((t) => `<li><a href="${esc(t.url)}" target="_blank" rel="noopener noreferrer">${esc(t.name)} ↗</a><span class="muted small"> — ${esc(t.org)}. ${esc(t.note)}</span></li>`).join("")}
          </ul>
        </div>
      </section>`;

    app.addEventListener("click", onLandingClick);
    onLeave(() => app.removeEventListener("click", onLandingClick));
  }

  function onLandingClick(e) {
    const start = e.target.closest("[data-start]");
    if (start) {
      const run = getRun();
      if (run && run.stage !== "done" && !confirm("Есть незавершённый экзамен. Сбросить его и начать новый?")) return;
      store.setNow(RUN, newRun(start.dataset.start));
      location.hash = "exam/run";
      return;
    }
    if (e.target.id === "exDiscard") {
      if (!confirm("Сбросить незавершённый экзамен? Ответы будут потеряны.")) return;
      store.setNow(RUN, null);
      app.removeEventListener("click", onLandingClick);
      renderLanding();
      return;
    }
    const del = e.target.closest("[data-del]");
    if (del && confirm("Удалить эту попытку из истории?")) {
      store.setNow(HIST, store.get(HIST, []).filter((h) => h.id !== del.dataset.del));
      $("#exHistory").innerHTML = historyHtml(store.get(HIST, []));
    }
  }

  function describeRun(run) {
    const meta = EXAM_LIST.find((v) => v.id === run.variant);
    const s = run.sec;
    let where = "";
    if (run.stage === "assess") where = "осталась самооценка Writing и Speaking";
    else {
      const sec = s[run.stage];
      where = `секция ${NAMES[run.stage]}`;
      if (!sec.started) where += " (ещё не начата)";
      else if (run.stage === "reading" || run.stage === "writing") where += `, осталось ${fmtTime(sec.left)}`;
      else if (run.stage === "speaking") where += `, Part ${sec.part}`;
    }
    return `${esc(meta ? meta.title : run.variant)} — ${where}.`;
  }

  function historyHtml(hist) {
    if (!hist.length) return '<p class="muted">Пока нет пройденных экзаменов.</p>';
    return `<div class="table-wrap" tabindex="0" role="region" aria-label="История попыток"><table class="data hist-table">
      <thead><tr><th scope="col">Дата</th><th scope="col">Вариант</th><th scope="col">L</th><th scope="col">R</th><th scope="col">W</th><th scope="col">S</th><th scope="col">Overall</th><th scope="col"><span class="sr-only">Действия</span></th></tr></thead>
      <tbody>${hist.map((h) => `<tr>
        <td>${new Date(h.finishedAt).toLocaleDateString("ru-RU")}</td>
        <td>${esc((EXAM_LIST.find((v) => v.id === h.variant) || {}).title || h.variant)}</td>
        <td>${bandText(h.bands.listening)}</td><td>${bandText(h.bands.reading)}</td>
        <td>${bandText(h.bands.writing)}</td><td>${bandText(h.bands.speaking)}</td>
        <td><b>${bandText(h.overall)}</b></td>
        <td class="nowrap"><a class="btn sm secondary" href="#exam/result/${esc(h.id)}">Разбор</a> <button class="btn sm ghost" data-del="${esc(h.id)}" aria-label="Удалить попытку">🗑</button></td>
      </tr>`).join("")}</tbody></table></div>`;
  }

  /* ---------- Идущий экзамен ---------- */
  async function renderRun() {
    const run = getRun();
    if (!run || run.stage === "done") { location.hash = "exam"; return; }
    app.innerHTML = '<div class="loading" role="status">Загрузка варианта…</div>';
    let exam;
    try { exam = await loadVariant(run.variant); }
    catch { app.innerHTML = '<div class="card" role="alert">Не удалось загрузить вариант. Проверьте интернет и обновите страницу.</div>'; return; }
    if (location.hash !== "#exam/run") return;
    const ctx = { run, exam };
    drawShell(ctx);
    drawStage(ctx);
  }

  function drawShell(ctx) {
    const { run } = ctx;
    const meta = EXAM_LIST.find((v) => v.id === run.variant);
    app.innerHTML = `
      <h1 class="sr-only">Пробный экзамен — ${esc(meta.title)}</h1>
      <div class="exam-bar card" id="exBar">
        <div class="row between">
          <div class="row">
            <b>${esc(meta.title)}</b>
            <ol class="stepper" aria-label="Секции экзамена">${[...SECTIONS, "assess"].map((s) => `<li data-s="${s}">${s === "assess" ? "Оценка" : NAMES[s]}</li>`).join("")}</ol>
          </div>
          <div class="row">
            <span class="timer" id="exTimer" role="timer" aria-live="off"></span>
            <button class="btn sm secondary" id="exFinish" hidden>Завершить секцию</button>
          </div>
        </div>
      </div>
      <div id="exStage"></div>`;
  }

  function drawStepper(run) {
    const idx = [...SECTIONS, "assess"].indexOf(run.stage);
    $$(".stepper li").forEach((li, i) => {
      li.classList.toggle("done", i < idx);
      li.classList.toggle("now", i === idx);
      if (i === idx) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
  }

  function drawStage(ctx) {
    const { run } = ctx;
    drawStepper(run);
    $("#exTimer").textContent = "";
    $("#exTimer").classList.remove("low");
    $("#exFinish").hidden = true;
    $("#exFinish").onclick = null;
    // Новый контейнер на каждую секцию: обработчики прошлой секции не должны срабатывать в следующей.
    const old = $("#exStage");
    const stage = old.cloneNode(false);
    old.replaceWith(stage);
    window.scrollTo(0, 0);
    ({ listening: stageListening, reading: stageReading, writing: stageWriting, speaking: stageSpeaking, assess: stageAssess })[run.stage](ctx, stage);
  }

  // Переход к следующей секции.
  function nextStage(ctx, section, extra = {}) {
    const run = ctx.run;
    Object.assign(run.results, extra);
    if (!run.skipped[section]) activity.task("exam-" + section);
    const i = SECTIONS.indexOf(section);
    run.stage = i < SECTIONS.length - 1 ? SECTIONS[i + 1] : "assess";
    store.setNow(RUN, run);
    runCleanupsLocal();
    drawStage(ctx);
  }
  // Останавливаем таймеры и звук текущей секции, не уходя со страницы.
  let localCleanups = [];
  const onStage = (fn) => { localCleanups.push(fn); onLeave(fn); };
  function runCleanupsLocal() { localCleanups.forEach((fn) => fn()); localCleanups = []; }

  function intro(stage, { title, items, button, extra = "" }) {
    stage.innerHTML = `
      <section class="card stage-intro">
        <h2 class="card-title">${title}</h2>
        <ul class="rules">${items.map((i) => `<li>${i}</li>`).join("")}</ul>
        ${extra}
        <div class="row"><button class="btn" id="exGo">${button}</button></div>
      </section>`;
    return $("#exGo");
  }

  /* ---------- Listening ---------- */
  function stageListening(ctx, stage) {
    const { run, exam } = ctx;
    const sec = run.sec.listening;
    const set = L.createSet(exam.listening);
    const engine = L.createEngine();
    onStage(() => engine.cancel());
    let canPlay = false;
    const steps = () => set.buildSteps([0, 1, 2, 3], { exam: true });

    stage.innerHTML = `
      <div id="exVoice" aria-live="polite"></div>
      <section class="card stage-intro" id="lsIntro">
        <h2 class="card-title">Listening · 4 части, 40 вопросов</h2>
        <ul class="rules">
          <li>Запись звучит <b>один раз</b>, без паузы и перемотки. Отвечайте во время прослушивания.</li>
          <li>Перед каждой частью — 30 секунд на чтение вопросов. После записи — 2 минуты, чтобы проверить ответы.</li>
          <li>Если вкладка закроется, запись продолжится с той реплики, на которой прервалась.</li>
        </ul>
        <div class="row"><button class="btn" id="lsGo" disabled>▶ ${sec.started ? "Продолжить запись" : "Начать Listening"}</button>
          <button class="btn ghost" id="lsSkip" hidden>Пропустить Listening</button>
          <span class="muted small" id="lsNote"></span></div>
      </section>
      <div class="card player-bar" id="lsBar" hidden><div class="player-status" id="lsStatus"></div><div class="muted small" id="lsSub"></div><div id="lsProg"></div></div>
      <form id="lsQs" autocomplete="off" onsubmit="return false">${set.parts.map((_, i) => set.questionsHtml(i, "xl")).join("")}</form>`;
    const qs = $("#lsQs");
    restore(qs, sec.answers);
    qs.addEventListener("input", () => { sec.answers = collect(qs); saveRun(run); });
    qs.addEventListener("change", () => { sec.answers = collect(qs); saveRun(run); });

    if (sec.started && sec.step > 0 && !sec.finished) {
      const part = steps()[Math.min(sec.step, steps().length - 1)].part;
      $("#lsNote").textContent = `Запись была прервана на Part ${part + 1}. Продолжим с той же реплики.`;
    }

    const finishListening = () => {
      const r = scoreListening(exam, collect(qs));
      sec.answers = collect(qs);
      nextStage(ctx, "listening", { listening: r });
    };

    const startReview = () => {
      $("#lsIntro").hidden = true;
      $("#lsBar").hidden = false;
      $("#lsStatus").textContent = "Запись окончена. Проверьте ответы.";
      $("#lsSub").textContent = "Когда будете готовы, нажмите «Завершить секцию».";
      $("#exFinish").hidden = false;
      $("#exFinish").textContent = "Завершить Listening";
      $("#exFinish").onclick = () => finishListening();
      const t = countdown($("#exTimer"), () => sec.review, (v) => { sec.review = v; saveRun(run); }, finishListening);
      onStage(t.stop);
    };

    if (sec.finished) { startReview(); return; }

    L.voiceStatus($("#exVoice"), {
      fallback: "Без озвучки Listening пройти нельзя — эту секцию можно пропустить, тогда Overall не посчитается.",
      onReady: (ok) => {
        canPlay = ok;
        $("#lsGo").disabled = !ok;
        $("#lsSkip").hidden = ok;
      }
    });
    $("#lsSkip").onclick = () => {
      if (!confirm("Пропустить Listening? Балл за секцию и Overall посчитаны не будут.")) return;
      run.skipped.listening = true;
      nextStage(ctx, "listening", { listening: null });
    };

    let currentPart = -1;
    $("#lsGo").onclick = async () => {
      if (!canPlay) return;
      engine.unlock();
      const all = steps();
      sec.started = true;
      saveRun(run);
      $("#lsIntro").hidden = true;
      $("#lsBar").hidden = false;
      const startedAt = now();
      const elapsed = $("#exTimer");
      const clock = setInterval(() => { elapsed.textContent = "⏱ " + fmtTime(Math.floor((now() - startedAt) / 1000)); }, 500);
      onStage(() => clearInterval(clock));
      const res = await engine.run(all, sec.step, {
        rate: () => L.BASE_RATE,
        onStep: (i, st) => {
          sec.step = i;
          saveRun(run);
          $("#lsProg").innerHTML = bar(((i + 1) / all.length) * 100, "Прогресс записи");
          if (st.part !== currentPart) {
            currentPart = st.part;
            $$(".part-block", qs).forEach((b) => b.classList.toggle("current", Number(b.dataset.part) === st.part));
            $(`#xl-${st.part}`).scrollIntoView({ behavior: "smooth", block: "start" });
          }
          if (st.type === "say") {
            $("#lsStatus").textContent = `Part ${st.part + 1} · ${st.narr ? "Объявление" : "Идёт запись"}`;
            $("#lsSub").textContent = "Запись нельзя поставить на паузу или перемотать.";
          }
        },
        onTick: (s, st) => { $("#lsStatus").textContent = `Part ${st.part + 1} · ${st.label}`; $("#lsSub").textContent = `Осталось ${s} с`; }
      });
      clearInterval(clock);
      if (res.cancelled) return;
      if (res.error && !res.started) {
        $("#lsIntro").hidden = false;
        $("#lsBar").hidden = true;
        $("#lsNote").innerHTML = '<span class="bad-text">Браузер не дал включить звук. Нажмите кнопку ещё раз.</span>';
        return;
      }
      sec.finished = true;
      saveRun(run);
      startReview();
    };
  }

  function scoreListening(exam, answers) {
    const box = document.createElement("div");
    const set = L.createSet(exam.listening);
    box.innerHTML = set.parts.map((_, i) => set.questionsHtml(i, "tmp")).join("");
    restore(box, answers);
    let raw = 0;
    const parts = set.parts.map((p, pi) => {
      const r = checkQuestions($(`#tmp-${pi}`, box), p.questions, { prefix: `p${pi}q` });
      raw += r.score;
      return r.score;
    });
    return { raw, band: rawToBand(raw, BAND_TABLES.listening), parts };
  }

  /* ---------- Reading ---------- */
  const readingQs = (exam) => {
    let start = 1;
    return exam.reading.passages.map((p, pi) => {
      const count = p.questions.filter((q) => q.type !== "info").length;
      const html = renderQuestions(p.questions, { letters: p.paragraphs.map((x) => x[0]), prefix: `r${pi}q`, start });
      const res = { html, start, count };
      start += count;
      return res;
    });
  };

  function stageReading(ctx, stage) {
    const { run, exam } = ctx;
    const sec = run.sec.reading;
    if (!sec.started) {
      intro(stage, {
        title: "Reading · 3 текста, 40 вопросов, 60 минут",
        items: ["Время пойдёт после нажатия кнопки и будет видно вверху.", "Переключайтесь между текстами вкладками; номера вопросов внизу показывают, на что вы уже ответили.", "Когда время закончится, ответы сохранятся и секция завершится автоматически."],
        button: "▶ Начать Reading"
      }).onclick = () => { sec.started = true; store.setNow(RUN, run); drawStage(ctx); };
      return;
    }
    const blocks = readingQs(exam);
    stage.innerHTML = `
      <nav class="tabs" aria-label="Тексты">${exam.reading.passages.map((p, i) => `<button class="tab" data-p="${i}" aria-pressed="false">Passage ${i + 1}</button>`).join("")}</nav>
      <form id="rdForm" autocomplete="off" onsubmit="return false">
        ${exam.reading.passages.map((p, pi) => `
          <div class="split rd-passage" data-p="${pi}" hidden>
            <article class="card passage" lang="en" tabindex="0" aria-label="Текст ${pi + 1}">
              <h2 class="card-title">${esc(p.title)}</h2>
              ${p.paragraphs.map(([l, t]) => `<p><span class="para-label">${l}</span>${esc(t)}</p>`).join("")}
            </article>
            <section class="card" aria-label="Вопросы ${blocks[pi].start}–${blocks[pi].start + blocks[pi].count - 1}">
              <div lang="en">${blocks[pi].html}</div>
              ${pi < 2 ? `<button type="button" class="btn secondary mt" data-p="${pi + 1}">Следующий текст →</button>` : ""}
            </section>
          </div>`).join("")}
      </form>
      <div class="card qnav" aria-label="Навигация по вопросам"><div class="qnav-grid" id="rdNav"></div></div>`;
    const form = $("#rdForm");
    restore(form, sec.answers);

    // Номера вопросов 1–40: быстрый переход и отметка отвеченных.
    const qList = [];
    exam.reading.passages.forEach((p, pi) => p.questions.forEach((q, i) => { if (q.type !== "info") qList.push({ pi, name: `r${pi}q${i}`, i }); }));
    $("#rdNav").innerHTML = qList.map((q, k) => `<button type="button" class="qn" data-k="${k}" aria-label="Вопрос ${k + 1}">${k + 1}</button>`).join("");
    const markNav = () => {
      const a = collect(form);
      $$(".qn", stage).forEach((b) => b.classList.toggle("answered", !!a[qList[b.dataset.k].name]));
    };
    const showPassage = (pi) => {
      sec.passage = pi;
      saveRun(run);
      $$(".rd-passage", stage).forEach((d) => { d.hidden = Number(d.dataset.p) !== pi; });
      $$(".tabs .tab", stage).forEach((t) => { const on = Number(t.dataset.p) === pi; t.classList.toggle("active", on); t.setAttribute("aria-pressed", String(on)); });
    };
    stage.addEventListener("click", (e) => {
      const t = e.target.closest("[data-p]");
      if (t && t.tagName === "BUTTON") { showPassage(Number(t.dataset.p)); window.scrollTo(0, 0); return; }
      const n = e.target.closest(".qn");
      if (n) {
        const q = qList[n.dataset.k];
        showPassage(q.pi);
        const box = $(`.rd-passage[data-p="${q.pi}"] .q[data-i="${q.i}"]`, stage);
        box.scrollIntoView({ behavior: "smooth", block: "center" });
        const input = $("input, select", box);
        if (input) input.focus({ preventScroll: true });
      }
    });
    const save = () => { sec.answers = collect(form); saveRun(run); markNav(); };
    form.addEventListener("input", save);
    form.addEventListener("change", save);
    showPassage(sec.passage || 0);
    markNav();

    const finish = (auto) => {
      sec.answers = collect(form);
      const box = document.createElement("div");
      box.innerHTML = form.innerHTML;
      restore(box, sec.answers);
      let raw = 0;
      const parts = exam.reading.passages.map((p, pi) => {
        const r = checkQuestions($(`.rd-passage[data-p="${pi}"]`, box), p.questions, { prefix: `r${pi}q` });
        raw += r.score;
        return r.score;
      });
      if (auto) alertTimeUp("Reading");
      nextStage(ctx, "reading", { reading: { raw, band: rawToBand(raw, BAND_TABLES.readingAcademic), parts } });
    };
    $("#exFinish").hidden = false;
    $("#exFinish").textContent = "Завершить Reading";
    $("#exFinish").onclick = () => {
      const left = qList.length - Object.keys(collect(form)).length;
      if (confirm(left > 0 ? `Без ответа ${left} вопр. Завершить Reading?` : "Завершить Reading?")) finish(false);
    };
    const t = countdown($("#exTimer"), () => sec.left, (v) => { sec.left = v; saveRun(run); }, () => finish(true));
    onStage(t.stop);
  }

  function alertTimeUp(name) {
    const n = document.createElement("div");
    n.className = "toast";
    n.setAttribute("role", "status");
    n.textContent = `Время ${name} вышло — ответы сохранены.`;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 5000);
  }

  /* ---------- Writing ---------- */
  function stageWriting(ctx, stage) {
    const { run, exam } = ctx;
    const sec = run.sec.writing;
    if (!sec.started) {
      intro(stage, {
        title: "Writing · 2 задания, 60 минут",
        items: ["Task 1: опишите график — не меньше 150 слов, примерно 20 минут.", "Task 2: эссе — не меньше 250 слов, примерно 40 минут. Task 2 весит в оценке вдвое больше.", "Текст сохраняется автоматически. Когда время закончится, секция завершится."],
        button: "▶ Начать Writing"
      }).onclick = () => { sec.started = true; store.setNow(RUN, run); drawStage(ctx); };
      return;
    }
    const w = exam.writing;
    stage.innerHTML = `
      <nav class="tabs" aria-label="Задания">
        <button class="tab" data-t="1" aria-pressed="false">Task 1</button>
        <button class="tab" data-t="2" aria-pressed="false">Task 2</button>
      </nav>
      <section class="card wr-task" data-t="1" hidden>
        <h2 class="card-title">Writing Task 1</h2>
        <p class="muted small">You should spend about 20 minutes on this task.</p>
        <p lang="en">${esc(w.task1.prompt)}</p>
        ${App.charts.render(w.task1.chart)}
        <p class="muted small" lang="en">Write at least 150 words.</p>
        <label class="sr-only" for="wr1">Ответ Task 1</label>
        <textarea id="wr1" lang="en" spellcheck="false"></textarea>
        <div class="wc" id="wc1" aria-live="polite"></div>
      </section>
      <section class="card wr-task" data-t="2" hidden>
        <h2 class="card-title">Writing Task 2</h2>
        <p class="muted small">You should spend about 40 minutes on this task.</p>
        <p lang="en">${esc(w.task2.prompt)}</p>
        <p class="muted small" lang="en">Write at least 250 words.</p>
        <label class="sr-only" for="wr2">Ответ Task 2</label>
        <textarea id="wr2" lang="en" spellcheck="false"></textarea>
        <div class="wc" id="wc2" aria-live="polite"></div>
      </section>`;
    const t1 = $("#wr1"), t2 = $("#wr2");
    t1.value = sec.t1;
    t2.value = sec.t2;
    const count = () => {
      [[t1, "#wc1", MIN_WORDS.t1], [t2, "#wc2", MIN_WORDS.t2]].forEach(([el, id, min]) => {
        const n = words(el.value);
        const box = $(id);
        box.className = "wc " + (n >= min ? "ok" : n ? "low" : "");
        box.textContent = n >= min ? `${n} слов ✓` : `${n} слов — ${n ? `мало, нужно ещё ${min - n}` : `нужно не меньше ${min}`}`;
      });
    };
    const save = () => { sec.t1 = t1.value; sec.t2 = t2.value; saveRun(run); count(); };
    t1.addEventListener("input", save);
    t2.addEventListener("input", save);
    count();
    const showTask = (n) => {
      sec.task = n;
      saveRun(run);
      $$(".wr-task", stage).forEach((s) => { s.hidden = Number(s.dataset.t) !== n; });
      $$(".tabs .tab", stage).forEach((t) => { const on = Number(t.dataset.t) === n; t.classList.toggle("active", on); t.setAttribute("aria-pressed", String(on)); });
    };
    stage.addEventListener("click", (e) => { const t = e.target.closest(".tab"); if (t) showTask(Number(t.dataset.t)); });
    showTask(sec.task || 1);

    const finish = (auto) => {
      save();
      if (auto) alertTimeUp("Writing");
      nextStage(ctx, "writing", { writing: { words1: words(sec.t1), words2: words(sec.t2) } });
    };
    $("#exFinish").hidden = false;
    $("#exFinish").textContent = "Завершить Writing";
    $("#exFinish").onclick = () => {
      const n1 = words(t1.value), n2 = words(t2.value);
      const warn = [n1 < MIN_WORDS.t1 ? `в Task 1 ${n1} слов (нужно 150+)` : "", n2 < MIN_WORDS.t2 ? `в Task 2 ${n2} слов (нужно 250+)` : ""].filter(Boolean);
      if (confirm(warn.length ? `Внимание: ${warn.join(", ")}. За короткий ответ снижают оценку. Всё равно завершить?` : "Завершить Writing?")) finish(false);
    };
    const t = countdown($("#exTimer"), () => sec.left, (v) => { sec.left = v; saveRun(run); }, () => finish(true));
    onStage(t.stop);
  }

  /* ---------- Speaking ---------- */
  function stageSpeaking(ctx, stage) {
    const { run, exam } = ctx;
    const sec = run.sec.speaking;
    const sp = exam.speaking;
    const engine = L.createEngine();
    let examinerCast = null;
    let token = 0;
    let recorder = null, stream = null, chunks = [];
    onStage(() => { token++; engine.cancel(); stopRecording(false); if (stream) stream.getTracks().forEach((t) => t.stop()); });
    // Объявлены до ветвлений ниже: обработчики кнопок используют их в любом сценарии.
    let skipFlag = false;
    const recBadge = () => (stream ? '<span class="rec-dot" aria-label="Идёт запись">● REC</span>' : '<span class="badge">без записи</span>');

    if (!sec.started || sec.part > 3) {
      stage.innerHTML = `
        <section class="card stage-intro">
          <h2 class="card-title">Speaking · 3 части, 11–14 минут</h2>
          <ul class="rules">
            <li>Вопросы задаёт голос экзаменатора и показывает их на экране. Отвечайте вслух, как на экзамене.</li>
            <li>Part 1 — вопросы о вас (4–5 мин), Part 2 — карточка: 1 минута подготовки и до 2 минут ответа, Part 3 — обсуждение (4–5 мин).</li>
            <li>Ответы записываются с микрофона, чтобы потом переслушать и оценить себя. Записи хранятся только в вашем браузере.</li>
          </ul>
          <div class="row"><button class="btn secondary" id="spMic">🎙️ Проверить микрофон</button><span class="small" id="spMicMsg" aria-live="polite"></span></div>
          <div class="row mt"><button class="btn" id="exGo">▶ Начать Speaking</button></div>
        </section>`;
      $("#spMic").onclick = async () => {
        const ok = await getMic();
        $("#spMicMsg").className = "small " + (ok ? "ok-text" : "bad-text");
        $("#spMicMsg").textContent = ok ? "Микрофон работает ✓" : "Нет доступа к микрофону — экзамен пройдёт без записи.";
      };
      $("#exGo").onclick = async () => {
        engine.unlock();
        sec.started = true;
        store.setNow(RUN, run);
        await getMic();
        runPart();
      };
      return;
    }
    // Возвращение после перезагрузки: начинаем текущую часть заново (нужно нажатие для звука).
    stage.innerHTML = `
      <section class="card stage-intro">
        <h2 class="card-title">Speaking · продолжение</h2>
        <p>Экзамен был прерван во время Part ${sec.part}. Эта часть начнётся заново${sec.part > 1 ? ", записи предыдущих частей сохранены" : ""}.</p>
        <div class="row"><button class="btn" id="exGo">▶ Продолжить с Part ${sec.part}</button></div>
      </section>`;
    $("#exGo").onclick = async () => { engine.unlock(); await getMic(); runPart(); };

    async function getMic() {
      if (stream) return true;
      if (!navigator.mediaDevices || !window.MediaRecorder) return false;
      try { stream = await navigator.mediaDevices.getUserMedia({ audio: true }); return true; }
      catch { return false; }
    }
    function startRecording() {
      chunks = [];
      if (!stream) return;
      try {
        recorder = new MediaRecorder(stream);
        recorder.ondataavailable = (e) => { if (e.data.size) chunks.push(e.data); };
        recorder.start(1000);
      } catch { recorder = null; }
    }
    function stopRecording(save = true) {
      return new Promise((resolve) => {
        if (!recorder || recorder.state === "inactive") return resolve();
        const r = recorder;
        r.onstop = async () => {
          if (save && chunks.length) await rec.put(`${run.id}:s${sec.part}`, new Blob(chunks, { type: r.mimeType }), run.id);
          resolve();
        };
        r.stop();
        recorder = null;
      });
    }

    // Экзаменатор говорит; если голосов нет, просто показываем текст.
    async function say(text, my) {
      if (my !== token) return;
      if (!voices.supported) { await wait(1200, my); return; }
      await voices.ready();
      if (!examinerCast) examinerCast = voices.cast([{ id: "E", gender: "f" }]).E;
      await engine.run([{ type: "say", text, cast: examinerCast }], 0, { onStep() {}, rate: () => L.BASE_RATE });
    }
    function wait(ms, my, onTick) {
      return new Promise((resolve) => {
        const end = now() + ms;
        const id = setInterval(() => {
          const left = Math.max(0, Math.ceil((end - now()) / 1000));
          if (onTick) onTick(left);
          if (my !== token || left <= 0 || skipFlag) { clearInterval(id); skipFlag = false; resolve(); }
        }, 200);
        if (onTick) onTick(Math.ceil(ms / 1000));
      });
    }
    function screen(html) {
      stage.innerHTML = `<section class="card speak-card" aria-live="polite">${html}</section>`;
    }

    async function ask(label, question, seconds, my) {
      screen(`
        <div class="row between"><span class="badge">${label}</span>${recBadge()}</div>
        <p class="big-q" lang="en">${esc(question)}</p>
        <div class="row between"><span class="timer" id="spT"></span><button class="btn" id="spNext">Следующий вопрос →</button></div>`);
      $("#spNext").onclick = () => { skipFlag = true; engine.cancel(); };
      await say(question, my);
      if (skipFlag) { skipFlag = false; return; }
      await wait(seconds * 1000, my, (left) => { const t = $("#spT"); if (t) t.textContent = fmtTime(left); });
    }

    async function runPart() {
      const my = ++token;
      const total = $("#exTimer");
      const t0 = now() - (sec.elapsed || 0) * 1000;
      const clock = setInterval(() => { sec.elapsed = Math.floor((now() - t0) / 1000); total.textContent = "⏱ " + fmtTime(sec.elapsed); }, 500);
      onStage(() => clearInterval(clock));

      while (sec.part <= 3 && my === token) {
        startRecording();
        if (sec.part === 1) {
          await ask("Part 1", "Good morning. My name is Emma, and I'll be your examiner today. Can you tell me your full name, please?", 15, my);
          for (const [ti, topic] of sp.part1.entries()) {
            for (const [qi, q] of topic.qs.entries()) {
              if (my !== token) return;
              const lead = qi === 0 ? (ti === 0 ? `Now, let's talk about ${topic.topic.toLowerCase()}. ` : `Let's move on to ${topic.topic.toLowerCase()}. `) : "";
              await ask(`Part 1 · ${topic.topic}`, lead + q, 35, my);
            }
          }
        } else if (sec.part === 2) {
          const card = sp.part2;
          const cardHtml = `<div class="cue" lang="en"><h2 class="card-title">${esc(card.title)}</h2><p class="muted">You should say:</p><ul>${card.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul></div>`;
          screen(`<div class="row between"><span class="badge">Part 2</span>${recBadge()}</div>${cardHtml}<p class="muted">Слушайте инструкцию экзаменатора…</p>`);
          await say("Now I'm going to give you a topic, and I'd like you to talk about it for one to two minutes. Before you talk, you'll have one minute to think about what you're going to say. You can make some notes if you wish.", my);
          if (my !== token) return;
          screen(`<div class="row between"><span class="badge">Part 2 · подготовка</span>${recBadge()}</div>${cardHtml}
            <div class="row between"><span class="timer big" id="spT">01:00</span><button class="btn secondary" id="spSkip">Я готов(а) говорить</button></div>
            <label class="sr-only" for="spNotes">Заметки</label><textarea id="spNotes" class="notes" lang="en" placeholder="Заметки: ключевые слова…"></textarea>`);
          $("#spNotes").value = sec.notes || "";
          $("#spNotes").oninput = (e) => { sec.notes = e.target.value; saveRun(run); };
          $("#spSkip").onclick = () => { skipFlag = true; };
          await wait(60000, my, (left) => { const t = $("#spT"); if (t) t.textContent = fmtTime(left); });
          if (my !== token) return;
          beep();
          await say("All right? Remember, you have one to two minutes for this. Please start speaking now.", my);
          if (my !== token) return;
          const notes = sec.notes ? `<details class="mt"><summary>Мои заметки</summary><p class="small" lang="en">${esc(sec.notes)}</p></details>` : "";
          screen(`<div class="row between"><span class="badge">Part 2 · ответ</span>${recBadge()}</div>${cardHtml}
            <div class="row between"><span class="timer big" id="spT">02:00</span><button class="btn secondary" id="spSkip">Закончить ответ</button></div>${notes}`);
          $("#spSkip").onclick = () => { skipFlag = true; };
          await wait(120000, my, (left) => { const t = $("#spT"); if (t) t.textContent = fmtTime(left); });
          if (my !== token) return;
          beep();
          await ask("Part 2", "Thank you. " + card.followUp, 20, my);
        } else {
          await say("We've been talking about " + sp.part2.title.replace(/^Describe /, "").replace(/\.$/, "") + ". I'd now like to ask you some more general questions related to this.", my);
          for (const q of sp.part3) {
            if (my !== token) return;
            await ask("Part 3", q, 50, my);
          }
          await say("Thank you. That is the end of the speaking test.", my);
        }
        if (my !== token) return;
        await stopRecording(true);
        sec.done[`p${sec.part}`] = true;
        sec.part += 1;
        store.setNow(RUN, run);
      }
      clearInterval(clock);
      if (my !== token) return;
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
      nextStage(ctx, "speaking", { speaking: { minutes: Math.round((sec.elapsed || 0) / 60) } });
    }
  }

  /* ---------- Самооценка ---------- */
  function stageAssess(ctx, stage) {
    const { run, exam } = ctx;
    const w = run.sec.writing;
    const a = run.assess;
    const select = (group, key) => `<select data-g="${group}" data-k="${key}" aria-label="${group} ${key}">
      <option value="">—</option>${[9, 8, 7, 6, 5, 4, 3, 2, 1].map((b) => `<option value="${b}"${a[group][key] == b ? " selected" : ""}>${BAND_LABELS[b]}</option>`).join("")}</select>`;
    const criteria = (group, list) => `<div class="criteria">${list.map(([k, name, hint]) => `
      <div class="crit">
        <div><b>${name}</b><details><summary class="small">Что это значит</summary><p class="small muted">${hint}</p></details></div>
        ${select(group, k)}
      </div>`).join("")}</div>`;

    stage.innerHTML = `
      <section class="card">
        <h2 class="card-title">Самооценка Writing и Speaking</h2>
        <p class="muted small">Оцените себя честно по четырём критериям IELTS. Балл за задание — среднее по критериям; в Writing Task 2 весит вдвое больше, чем Task 1 (как на экзамене). Округление — как в IELTS: .25 и .75 — вверх.</p>
      </section>
      <section class="card">
        <h3 class="card-title">Writing Task 1 <span class="muted small">(${words(w.t1)} слов)</span></h3>
        <details><summary>Ваш текст</summary><div class="essay" lang="en">${esc(w.t1 || "—")}</div></details>
        ${criteria("t1", CRITERIA.t1)}
        <p class="small">Балл за Task 1: <b id="as-t1">—</b></p>
      </section>
      <section class="card">
        <h3 class="card-title">Writing Task 2 <span class="muted small">(${words(w.t2)} слов)</span></h3>
        <details><summary>Ваш текст</summary><div class="essay" lang="en">${esc(w.t2 || "—")}</div></details>
        ${criteria("t2", CRITERIA.t2)}
        <p class="small">Балл за Task 2: <b id="as-t2">—</b> · Writing итого: <b id="as-w">—</b></p>
      </section>
      <section class="card">
        <h3 class="card-title">Speaking</h3>
        <div id="asRec" class="rec-list">Загружаем записи…</div>
        ${criteria("speaking", CRITERIA.speaking)}
        <p class="small">Speaking итого: <b id="as-s">—</b></p>
      </section>
      <div class="card row"><button class="btn" id="asDone">Показать итог</button><span class="small" id="asMsg" aria-live="polite"></span></div>`;

    recordingsHtml(run.id).then((html) => { const el = $("#asRec"); if (el) el.innerHTML = html; });
    const update = () => {
      const b = assessBands(a);
      $("#as-t1").textContent = bandText(b.t1);
      $("#as-t2").textContent = bandText(b.t2);
      $("#as-w").textContent = bandText(b.writing);
      $("#as-s").textContent = bandText(b.speaking);
    };
    stage.addEventListener("change", (e) => {
      const s = e.target.closest("select[data-g]");
      if (!s) return;
      a[s.dataset.g] = { ...a[s.dataset.g], [s.dataset.k]: s.value ? Number(s.value) : undefined };
      saveRun(run);
      update();
    });
    update();
    $("#asDone").onclick = () => {
      const b = assessBands(a);
      if (b.writing === null || b.speaking === null) {
        $("#asMsg").className = "small bad-text";
        $("#asMsg").textContent = "Заполните все 12 критериев.";
        return;
      }
      finishExam(ctx, b);
    };
  }

  function avgCriteria(obj, keys) {
    const vals = keys.map((k) => obj[k]).filter((v) => typeof v === "number");
    return vals.length === keys.length ? roundBand(vals.reduce((s, v) => s + v, 0) / vals.length) : null;
  }
  function assessBands(a) {
    const t1 = avgCriteria(a.t1, CRITERIA.t1.map((c) => c[0]));
    const t2 = avgCriteria(a.t2, CRITERIA.t2.map((c) => c[0]));
    const writing = t1 !== null && t2 !== null ? roundBand((t1 + 2 * t2) / 3) : null;
    const speaking = avgCriteria(a.speaking, CRITERIA.speaking.map((c) => c[0]));
    return { t1, t2, writing, speaking };
  }

  function finishExam(ctx, b) {
    const { run } = ctx;
    const bands = {
      listening: run.results.listening ? run.results.listening.band : null,
      reading: run.results.reading ? run.results.reading.band : null,
      writing: b.writing,
      speaking: b.speaking
    };
    const all = SECTIONS.map((s) => bands[s]);
    const overall = all.every((x) => x !== null) ? roundBand(all.reduce((s, x) => s + x, 0) / 4) : null;
    const entry = {
      id: run.id, variant: run.variant, startedAt: run.startedAt, finishedAt: now(),
      bands, overall,
      raw: { listening: run.results.listening ? run.results.listening.raw : null, reading: run.results.reading ? run.results.reading.raw : null },
      parts: { listening: run.results.listening ? run.results.listening.parts : null, reading: run.results.reading ? run.results.reading.parts : null },
      writing: { t1: run.sec.writing.t1, t2: run.sec.writing.t2, t1Band: b.t1, t2Band: b.t2 },
      assess: run.assess,
      answers: { listening: run.sec.listening.answers, reading: run.sec.reading.answers },
      speakingMinutes: run.results.speaking ? run.results.speaking.minutes : null
    };
    const hist = [entry, ...store.get(HIST, []).filter((h) => h.id !== run.id)].slice(0, HISTORY_LIMIT);
    store.setNow(HIST, hist);
    store.setNow(RUN, { ...run, stage: "done" });
    rec.prune(hist.slice(0, KEEP_RECORDINGS).map((h) => h.id));
    location.hash = "exam/result/" + run.id;
  }

  async function recordingsHtml(attemptId) {
    const items = [];
    for (const p of [1, 2, 3]) {
      const r = await rec.get(`${attemptId}:s${p}`);
      items.push(`<div class="rec-item"><b>Part ${p}</b>${r && r.blob ? `<audio controls preload="metadata" src="${URL.createObjectURL(r.blob)}"></audio>` : '<span class="muted small">записи нет</span>'}</div>`);
    }
    return items.join("");
  }

  /* ---------- Итог и разбор ---------- */
  async function renderResult(id) {
    const h = store.get(HIST, []).find((x) => x.id === id);
    if (!h) { app.innerHTML = '<div class="card empty-state"><h1>Попытка не найдена</h1><a class="btn" href="#exam">К экзаменам</a></div>'; return; }
    const meta = EXAM_LIST.find((v) => v.id === h.variant);
    const cell = (s) => `<div class="band-cell"><span class="muted small">${NAMES[s]}</span><b>${bandText(h.bands[s])}</b>${h.raw[s] !== undefined && h.raw[s] !== null ? `<span class="small muted">${h.raw[s]} / 40</span>` : ""}</div>`;
    app.innerHTML = `
      <h1>Результат: ${esc(meta ? meta.title : h.variant)}</h1>
      <p class="lead">${new Date(h.finishedAt).toLocaleString("ru-RU", { dateStyle: "long", timeStyle: "short" })}</p>
      <section class="card result-hero" aria-label="Баллы">
        <div class="band-overall"><span class="muted small">Overall</span><b>${bandText(h.overall)}</b>${h.overall === null ? '<span class="small muted">не все секции пройдены</span>' : ""}</div>
        <div class="band-grid">${SECTIONS.map(cell).join("")}</div>
      </section>
      <p class="muted small">Listening и Reading переведены в band по официальной шкале (Academic). Writing и Speaking — ваша самооценка по критериям. Overall — среднее четырёх секций, округлённое как в IELTS.</p>
      <div id="resDetail"><div class="loading" role="status">Готовим разбор ответов…</div></div>
      <div class="row mt"><a class="btn" href="#exam">К списку экзаменов</a><a class="btn secondary" href="#calc">Калькулятор баллов</a></div>`;

    let exam;
    try { exam = await loadVariant(h.variant); } catch { $("#resDetail").innerHTML = ""; return; }
    if (!location.hash.startsWith("#exam/result/")) return;
    const lset = L.createSet(exam.listening);
    const rq = readingQs(exam);
    const detail = $("#resDetail");
    detail.innerHTML = `
      <details class="card review"><summary><b>🎧 Listening — разбор</b> ${h.parts.listening ? `<span class="muted small">по частям: ${h.parts.listening.join(" · ")}</span>` : ""}</summary>
        <div id="rvL">${h.answers.listening ? lset.parts.map((_, i) => lset.questionsHtml(i, "rv")).join("") : '<p class="muted">Секция пропущена.</p>'}</div>
      </details>
      <details class="card review"><summary><b>📖 Reading — разбор</b> ${h.parts.reading ? `<span class="muted small">по текстам: ${h.parts.reading.join(" · ")}</span>` : ""}</summary>
        <div id="rvR">${exam.reading.passages.map((p, pi) => `<div class="rv-passage" data-p="${pi}"><h3 class="card-title">Passage ${pi + 1}: ${esc(p.title)}</h3><div lang="en">${rq[pi].html}</div></div>`).join("")}</div>
      </details>
      <details class="card review"><summary><b>✍️ Writing</b> <span class="muted small">Task 1: ${bandText(h.writing.t1Band)} · Task 2: ${bandText(h.writing.t2Band)}</span></summary>
        <h3 class="card-title">Task 1 (${words(h.writing.t1)} слов)</h3><div class="essay" lang="en">${esc(h.writing.t1 || "—")}</div>
        <h3 class="card-title mt">Task 2 (${words(h.writing.t2)} слов)</h3><div class="essay" lang="en">${esc(h.writing.t2 || "—")}</div>
      </details>
      <details class="card review"><summary><b>🗣️ Speaking — записи</b></summary><div id="rvS" class="rec-list">Загружаем…</div>
        <p class="muted small">Записи хранятся в браузере для ${KEEP_RECORDINGS} последних попыток.</p></details>`;
    if (h.answers.listening) {
      const box = $("#rvL");
      restore(box, h.answers.listening);
      lset.parts.forEach((p, pi) => {
        const block = $(`#rv-${pi}`, box);
        checkQuestions(block, p.questions, { prefix: `p${pi}q` });
        $(".part-result", block).innerHTML = `<details class="transcript-box"><summary>📄 Текст записи</summary>${lset.transcriptHtml(pi, false)}</details>`;
      });
      $$("input, select", box).forEach((el) => { el.disabled = true; });
    }
    const rbox = $("#rvR");
    restore(rbox, h.answers.reading || {});
    exam.reading.passages.forEach((p, pi) => checkQuestions($(`.rv-passage[data-p="${pi}"]`, rbox), p.questions, { prefix: `r${pi}q` }));
    $$("input, select", rbox).forEach((el) => { el.disabled = true; });
    recordingsHtml(h.id).then((html) => { const el = $("#rvS"); if (el) el.innerHTML = html; });
  }

  // Для главной страницы: последний и лучший результат.
  App.examSummary = () => {
    const hist = store.get(HIST, []);
    return { last: hist[0] || null, best: hist.reduce((m, x) => (x.overall !== null && (!m || x.overall > m.overall) ? x : m), null), count: hist.length };
  };
})();
