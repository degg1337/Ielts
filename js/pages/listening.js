/* Раздел Listening: 4 части как на экзамене.
   «Экзамен» — запись звучит один раз, без паузы и перемотки, с временем на чтение вопросов.
   «Тренировка» — пауза, переход по репликам, транскрипт после ответа. */
(() => {
  "use strict";
  const { app, esc, $, $$, tabs, bar, renderQuestions, checkQuestions, resetQuestions, rawToBand, saveBest, voices, onLeave, onKey, sleep } = App;
  const synth = window.speechSynthesis;
  const BASE_RATE = 0.95;
  const PARTS = LISTENING.parts;

  // Номер первого вопроса каждой части (1, 11, 21, 31).
  const starts = [];
  let counter = 1;
  PARTS.forEach((p) => { starts.push(counter); counter += p.questions.filter((q) => q.type !== "info").length; });
  const TOTAL = counter - 1;
  const range = (pi) => `${starts[pi]}–${starts[pi] + PARTS[pi].questions.filter((q) => q.type !== "info").length - 1}`;

  // Короткие фразы озвучиваются надёжнее: длинные реплики Chrome иногда обрывает.
  const sentences = (t) => (t.match(/[^.!?]+[.!?]+["'”’]?|[^.!?]+$/g) || [t]).map((s) => s.trim()).filter(Boolean);

  /* ---------- Движок озвучки ---------- */
  function createEngine() {
    let token = 0;
    let started = false;

    function sayOnce(text, cast, rate) {
      return new Promise((resolve) => {
        const u = new SpeechSynthesisUtterance(text);
        if (cast && cast.voice) { u.voice = cast.voice; u.lang = cast.voice.lang; } else u.lang = "en-GB";
        u.pitch = cast ? cast.pitch : 1;
        u.rate = rate;
        let done = false;
        const finish = (err) => { if (done) return; done = true; clearTimeout(guard); resolve(err || null); };
        // Страховка: в некоторых браузерах событие onend иногда не приходит.
        const guard = setTimeout(() => finish(), 5000 + (text.length * 120) / rate);
        u.onstart = () => { started = true; };
        u.onend = () => finish();
        u.onerror = (e) => finish(e.error || "error");
        synth.speak(u);
      });
    }

    async function run(steps, from, { onStep, onTick, rate }) {
      const my = ++token;
      for (let i = from; i < steps.length; i++) {
        if (my !== token) return { cancelled: true };
        const st = steps[i];
        onStep(i, st);
        if (st.type === "wait") {
          const end = Date.now() + st.ms;
          for (let left = end - Date.now(); left > 0; left = end - Date.now()) {
            if (my !== token) return { cancelled: true };
            onTick(Math.ceil(left / 1000), st);
            await sleep(Math.min(250, left));
          }
        } else {
          for (const s of sentences(st.text)) {
            if (my !== token) return { cancelled: true };
            const err = await sayOnce(s, st.cast, rate());
            if (my !== token) return { cancelled: true };
            if (err && err !== "interrupted" && err !== "canceled") return { error: err, started };
          }
        }
      }
      return my === token ? { done: true } : { cancelled: true };
    }

    function cancel() { token++; if (synth) synth.cancel(); }
    // iOS/Safari разрешают звук только в ответ на нажатие — «будим» синтезатор прямо в обработчике клика.
    function unlock() { try { synth.cancel(); synth.speak(Object.assign(new SpeechSynthesisUtterance(" "), { volume: 0 })); } catch { /* ignore */ } }
    return { run, cancel, unlock, get started() { return started; } };
  }

  // Голоса подбираются один раз на страницу: у каждой части свои говорящие, диктор общий.
  let casting = null;
  function castFor(part) {
    if (!casting || casting.voiceCount !== voices.list.length) {
      const perPart = PARTS.map((p) => voices.cast(p.speakers));
      casting = { voiceCount: voices.list.length, perPart, narrator: voices.narrator(perPart) };
    }
    return { ...casting.perPart[PARTS.indexOf(part)], N: casting.narrator };
  }

  function buildSteps(partIdxs, { exam }) {
    const steps = [];
    partIdxs.forEach((pi, k) => {
      const part = PARTS[pi];
      const cast = castFor(part);
      if (exam) {
        steps.push({ type: "say", text: part.intro, cast: cast.N, part: pi, narr: true });
        steps.push({ type: "wait", ms: LISTENING.readSeconds * 1000, part: pi, label: `Прочитайте вопросы ${range(pi)}` });
      }
      part.script.forEach(([sp, text], li) => steps.push({ type: "say", text, cast: cast[sp], part: pi, line: li, speaker: sp }));
      if (exam) {
        steps.push({ type: "say", text: `That is the end of Part ${pi + 1}.`, cast: cast.N, part: pi, narr: true });
        if (k < partIdxs.length - 1) steps.push({ type: "wait", ms: LISTENING.gapSeconds * 1000, part: pi, label: "Пауза перед следующей частью" });
      }
    });
    if (exam) steps.push({ type: "say", text: "That is the end of the listening test.", cast: castFor(PARTS[0]).N, part: partIdxs[partIdxs.length - 1], narr: true });
    return steps;
  }

  // Примерная длительность: ~150 слов в минуту плюс паузы.
  function estimateMinutes(steps) {
    let sec = 0;
    steps.forEach((s) => { sec += s.type === "wait" ? s.ms / 1000 : (s.text.split(/\s+/).length / (150 * BASE_RATE)) * 60 + 0.4; });
    return Math.round(sec / 60);
  }

  const transcriptHtml = (pi, clickable) => {
    const part = PARTS[pi];
    const names = Object.fromEntries(part.speakers.map((s) => [s.id, s.name]));
    return `<ol class="transcript" lang="en">${part.script.map(([sp, t], li) =>
      `<li data-line="${li}">${clickable ? `<button class="line-btn" data-line="${li}" aria-label="Слушать с этой реплики">▶</button>` : ""}<b>${esc(names[sp])}:</b> ${esc(t)}</li>`).join("")}</ol>`;
  };

  const questionsHtml = (pi) => `
    <section class="card part-block" data-part="${pi}" id="part-${pi}" aria-labelledby="ph-${pi}">
      <div class="row between">
        <h2 class="card-title" id="ph-${pi}">Part ${pi + 1} · Questions ${range(pi)}</h2>
        <span class="badge">${esc(PARTS[pi].kind)}</span>
      </div>
      <div lang="en">${renderQuestions(PARTS[pi].questions, { prefix: `p${pi}q`, start: starts[pi] })}</div>
      <div class="part-result" aria-live="polite"></div>
    </section>`;

  /* ---------- Состояние голосов ---------- */
  async function voiceStatus(el, { onReady }) {
    if (!voices.supported || !synth) {
      el.innerHTML = `<div class="notice bad"><b>Озвучка не поддерживается этим браузером.</b> Откройте сайт в Chrome, Edge или Safari. Пока можно тренироваться по транскрипту в режиме «Тренировка».</div>`;
      return onReady(false);
    }
    el.innerHTML = '<div class="notice">Загружаем голоса для озвучки…</div>';
    const list = await voices.ready();
    const en = voices.english();
    if (!list.length) {
      el.innerHTML = `<div class="notice bad"><b>Голоса для озвучки не загрузились.</b> Обновите страницу. Если не поможет — установите английский голос в настройках системы
        (Windows: «Время и язык → Речь», Android: «Синтез речи», macOS: «Универсальный доступ → Устной контент»).
        <button class="btn sm secondary" id="vTry">Попробовать всё равно</button></div>`;
      $("#vTry", el).onclick = () => { el.innerHTML = '<div class="notice">Пробуем голос по умолчанию.</div>'; onReady(true); };
      // Голоса могут прийти позже — тогда обновим сообщение.
      const late = () => { synth.removeEventListener("voiceschanged", late); voiceStatus(el, { onReady }); };
      synth.addEventListener("voiceschanged", late);
      onLeave(() => synth.removeEventListener("voiceschanged", late));
      return onReady(false);
    }
    const gb = en.filter((v) => /GB/i.test(v.lang)).length;
    const note = !en.length
      ? "Английский голос не найден — текст прочитает голос по умолчанию, произношение может быть неточным."
      : gb ? `Британских голосов: ${gb}. Разные говорящие озвучиваются разными голосами.` : "Британский голос не найден — используем другой английский.";
    el.innerHTML = `<div class="notice ok">🔊 ${note}</div>`;
    onReady(true);
  }

  /* ---------- Страница ---------- */
  App.pages.listening = (param = "") => {
    const [mode, partId] = param.split("/");
    const isPractice = mode === "practice";
    app.innerHTML = `
      <h1>Listening</h1>
      <p class="lead">4 части, 40 вопросов — от бытового диалога до академической лекции. Текст озвучивает синтезатор речи вашего браузера.</p>`;
    app.appendChild(tabs([
      { id: "exam", label: "🎓 Экзамен" },
      { id: "practice", label: "🎧 Тренировка" }
    ], isPractice ? "practice" : "exam", "listening", "Режим"));
    const status = document.createElement("div");
    status.id = "lVoice";
    status.setAttribute("aria-live", "polite");
    app.appendChild(status);
    const wrap = document.createElement("div");
    app.appendChild(wrap);
    if (isPractice) renderPractice(wrap, status, Math.max(0, PARTS.findIndex((p) => p.id === partId)));
    else renderExam(wrap, status);
  };

  /* ---------- Режим «Экзамен» ---------- */
  function renderExam(wrap, status) {
    const engine = createEngine();
    let steps = buildSteps(PARTS.map((_, i) => i), { exam: true });
    let state = "idle"; // idle → running → finished → checked
    let canPlay = false;

    wrap.innerHTML = `
      <section class="card" id="lIntro">
        <h2 class="card-title">Полный тест: ${PARTS.length} части, ${TOTAL} вопросов, ≈ ${estimateMinutes(steps)} минут</h2>
        <ul class="rules">
          <li>Запись звучит <b>только один раз</b> — паузы и перемотки нет, как на настоящем экзамене.</li>
          <li>Перед каждой частью — ${LISTENING.readSeconds} секунд, чтобы прочитать вопросы. Между частями — короткая пауза.</li>
          <li>Отвечайте прямо во время прослушивания. Проверить ответы можно после окончания записи.</li>
          <li>Наденьте наушники и проверьте громкость заранее.</li>
        </ul>
        <div class="row"><button class="btn" id="lStart" disabled>▶ Начать экзамен</button><span class="muted small" id="lStartNote"></span></div>
      </section>
      <div class="player-bar card" id="lBar" hidden>
        <div class="row between">
          <div><div class="player-status" id="lStatus">Подготовка…</div><div class="muted small" id="lSub"></div></div>
          <button class="btn sm ghost" id="lAbort">Завершить досрочно</button>
        </div>
        <div id="lProg"></div>
      </div>
      <form id="lQs" autocomplete="off" onsubmit="return false">${PARTS.map((_, i) => questionsHtml(i)).join("")}</form>
      <div class="card row" id="lActions">
        <button class="btn" id="lCheck" disabled>Проверить ответы</button>
        <button class="btn secondary" id="lReset" hidden>Пройти заново</button>
        <span class="muted small" id="lCheckNote">Проверка откроется после окончания записи.</span>
      </div>
      <div id="lResult" aria-live="polite"></div>`;

    const startBtn = $("#lStart");
    const qs = $("#lQs");

    voiceStatus(status, {
      onReady: (ok) => {
        canPlay = ok;
        if (state !== "idle") return;
        startBtn.disabled = !ok;
        $("#lStartNote").textContent = ok ? "" : "Озвучка недоступна.";
        if (ok) steps = buildSteps(PARTS.map((_, i) => i), { exam: true }); // голоса могли загрузиться позже
      }
    });

    const setProgress = (i) => { $("#lProg").innerHTML = bar(((i + 1) / steps.length) * 100, "Прогресс записи"); };
    let currentPart = -1;
    const onStep = (i, st) => {
      setProgress(i);
      if (st.part !== currentPart) {
        currentPart = st.part;
        $$(".part-block", qs).forEach((b) => b.classList.toggle("current", Number(b.dataset.part) === st.part));
        $(`#part-${st.part}`).scrollIntoView({ behavior: "smooth", block: "start" });
      }
      if (st.type === "say") {
        $("#lStatus").textContent = `Part ${st.part + 1} · ${st.narr ? "Объявление" : "Идёт запись"}`;
        $("#lSub").textContent = "Запись нельзя поставить на паузу или перемотать.";
      }
    };
    const onTick = (sec, st) => {
      $("#lStatus").textContent = `Part ${st.part + 1} · ${st.label}`;
      $("#lSub").textContent = `Осталось ${sec} с`;
    };

    // Переход в другой раздел во время экзамена прерывает тест — спрашиваем.
    const guardNav = (e) => {
      const a = e.target.closest("a[href^='#']");
      if (a && state === "running" && !confirm("Выйти из раздела? Экзамен будет прерван.")) { e.preventDefault(); e.stopPropagation(); }
    };
    const beforeUnload = (e) => { if (state === "running") { e.preventDefault(); e.returnValue = ""; } };
    document.addEventListener("click", guardNav, true);
    window.addEventListener("beforeunload", beforeUnload);
    onLeave(() => {
      engine.cancel();
      document.removeEventListener("click", guardNav, true);
      window.removeEventListener("beforeunload", beforeUnload);
    });

    startBtn.onclick = async () => {
      if (!canPlay || state !== "idle") return;
      engine.unlock();
      state = "running";
      steps = buildSteps(PARTS.map((_, i) => i), { exam: true });
      $("#lIntro").hidden = true;
      $("#lBar").hidden = false;
      $("#lCheckNote").textContent = "Проверка откроется после окончания записи.";
      const res = await engine.run(steps, 0, { onStep, onTick, rate: () => BASE_RATE });
      if (res.cancelled) return;
      if (res.error && !res.started) {
        // Браузер не дал запустить звук — попытка не засчитывается, можно начать снова.
        state = "idle";
        $("#lIntro").hidden = false;
        $("#lBar").hidden = true;
        $("#lStartNote").innerHTML = '<span class="bad-text">Браузер не дал включить звук. Нажмите «Начать экзамен» ещё раз.</span>';
        return;
      }
      finish(res.error ? "Озвучка прервалась из-за ошибки браузера." : "Запись окончена. Проверьте ответы.");
    };

    $("#lAbort").onclick = () => {
      if (!confirm("Завершить экзамен досрочно? Переслушать запись будет нельзя.")) return;
      engine.cancel();
      finish("Экзамен завершён досрочно.");
    };

    function finish(text) {
      state = "finished";
      $("#lStatus").textContent = text;
      $("#lSub").textContent = "";
      $("#lAbort").hidden = true;
      setProgress(steps.length - 1);
      $("#lCheck").disabled = false;
      $("#lCheckNote").textContent = "";
      $("#lCheck").focus({ preventScroll: true });
    }

    $("#lCheck").onclick = () => {
      if (state !== "finished" && state !== "checked") return;
      state = "checked";
      let score = 0;
      const perPart = PARTS.map((p, pi) => {
        const block = $(`#part-${pi}`);
        const r = checkQuestions(block, p.questions, { prefix: `p${pi}q` });
        score += r.score;
        $(".part-result", block).innerHTML = `<p class="small"><b>${r.score} / ${r.total}</b> в этой части</p>
          <details class="transcript-box"><summary>📄 Текст записи Part ${pi + 1}</summary>${transcriptHtml(pi, false)}</details>`;
        return r.score;
      });
      const band = rawToBand(score, BAND_TABLES.listening);
      saveBest("listening:exam", score, TOTAL);
      $("#lResult").innerHTML = `<div class="result">Результат: ${score} / ${TOTAL} — Band ${band.toFixed(1)}</div>
        <p class="muted small">По частям: ${perPart.map((s, i) => `Part ${i + 1} — ${s}`).join(", ")}. Правильные ответы и тексты записей — под каждой частью.</p>`;
      $("#lCheck").disabled = true;
      $("#lReset").hidden = false;
      $("#lResult").scrollIntoView({ behavior: "smooth", block: "center" });
    };

    $("#lReset").onclick = () => {
      resetQuestions(qs);
      $$(".part-result", qs).forEach((el) => { el.innerHTML = ""; });
      $$(".part-block", qs).forEach((b) => b.classList.remove("current"));
      $("#lResult").innerHTML = "";
      $("#lReset").hidden = true;
      $("#lCheck").disabled = true;
      $("#lAbort").hidden = false;
      $("#lBar").hidden = true;
      $("#lIntro").hidden = false;
      $("#lStartNote").textContent = "";
      currentPart = -1;
      state = "idle";
      startBtn.disabled = !canPlay;
      window.scrollTo(0, 0);
    };
  }

  /* ---------- Режим «Тренировка» ---------- */
  function renderPractice(wrap, status, pi) {
    const part = PARTS[pi];
    const engine = createEngine();
    let steps = buildSteps([pi], { exam: false });
    let pos = 0;
    let playing = false;
    let checked = false;
    let rate = BASE_RATE;

    wrap.appendChild(tabs(PARTS.map((p, i) => ({ id: p.id, label: `Part ${i + 1}` })), part.id, "listening/practice", "Части"));
    const box = document.createElement("div");
    wrap.appendChild(box);
    box.innerHTML = `
      <section class="card">
        <h2 class="card-title">${esc(part.title)}</h2>
        <p class="muted small">${esc(part.kind)} · ${part.script.length} реплик · говорящие: ${part.speakers.map((s) => esc(s.name)).join(", ")}</p>
        <div class="player-controls row">
          <button class="btn icon-btn secondary" id="pPrev" aria-label="Предыдущая реплика" title="Предыдущая реплика (←)">⏮</button>
          <button class="btn play-btn" id="pPlay" disabled>▶ Слушать</button>
          <button class="btn icon-btn secondary" id="pNext" aria-label="Следующая реплика" title="Следующая реплика (→)">⏭</button>
          <button class="btn icon-btn secondary" id="pRestart" aria-label="Слушать с начала" title="С начала">↺</button>
          <label class="small rate-label">Скорость
            <select id="pRate"><option value="0.8">0.8×</option><option value="0.95" selected>0.95×</option><option value="1.1">1.1×</option></select>
          </label>
        </div>
        <div class="muted small" id="pPos" aria-live="polite"></div>
        <div id="pProg"></div>
        <p class="muted small"><kbd>K</kbd> — пауза/продолжить · <kbd>←</kbd> <kbd>→</kbd> — предыдущая/следующая реплика</p>
      </section>
      <form id="pQs" autocomplete="off" onsubmit="return false">${questionsHtml(pi)}</form>
      <div class="card row">
        <button class="btn" id="pCheck">Проверить ответы</button>
        <button class="btn secondary" id="pReset">Сбросить</button>
        <button class="btn secondary" id="pShow" disabled aria-expanded="false" aria-controls="pScript">📄 Показать текст</button>
        <span class="muted small" id="pShowNote">Текст записи откроется после проверки ответов.</span>
      </div>
      <div id="pResult" aria-live="polite"></div>
      <section class="card" id="pScript" hidden aria-label="Текст записи"></section>`;

    const playBtn = $("#pPlay");
    const script = $("#pScript");
    const renderPos = () => {
      const st = steps[Math.min(pos, steps.length - 1)];
      $("#pPos").textContent = `Реплика ${Math.min(pos + 1, steps.length)} из ${steps.length}`;
      $("#pProg").innerHTML = bar((pos / steps.length) * 100, "Прогресс записи");
      $$("li[data-line]", script).forEach((li) => li.classList.toggle("now", Number(li.dataset.line) === st.line));
    };
    const setPlaying = (on) => {
      playing = on;
      playBtn.textContent = on ? "⏸ Пауза" : pos > 0 && pos < steps.length ? "▶ Продолжить" : "▶ Слушать";
      playBtn.setAttribute("aria-pressed", String(on));
    };

    async function play() {
      if (pos >= steps.length) pos = 0;
      engine.unlock();
      setPlaying(true);
      const res = await engine.run(steps, pos, {
        onStep: (i) => { pos = i; renderPos(); },
        onTick: () => {},
        rate: () => rate
      });
      if (res.cancelled) return;
      if (res.done) pos = steps.length;
      setPlaying(false);
      renderPos();
      if (res.error) $("#pPos").textContent = res.started ? "Озвучка прервалась. Нажмите «Слушать», чтобы продолжить." : "Браузер не дал включить звук. Нажмите «Слушать» ещё раз.";
      else $("#pPos").textContent = "Запись закончилась. Проверьте ответы.";
    }
    const pause = () => { engine.cancel(); setPlaying(false); renderPos(); };
    const jump = (to) => {
      pos = Math.max(0, Math.min(steps.length - 1, to));
      if (playing) { engine.cancel(); play(); } else { setPlaying(false); renderPos(); }
    };

    playBtn.onclick = () => (playing ? pause() : play());
    $("#pPrev").onclick = () => jump(pos - 1);
    $("#pNext").onclick = () => jump(pos + 1);
    $("#pRestart").onclick = () => jump(0);
    $("#pRate").onchange = (e) => { rate = Number(e.target.value); if (playing) jump(pos); };
    onLeave(() => engine.cancel());
    onKey((e) => {
      if (e.key === "k" || e.key === "K" || e.key === "л" || e.key === "Л") { e.preventDefault(); if (!playBtn.disabled) playBtn.click(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); jump(pos - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); jump(pos + 1); }
    });

    const showScript = () => {
      script.innerHTML = `<h2 class="card-title">Текст записи</h2><p class="muted small">Нажмите ▶ у реплики, чтобы прослушать с этого места.</p>${transcriptHtml(pi, true)}`;
      $("#pShow").disabled = false;
      $("#pShowNote").textContent = "";
    };
    script.addEventListener("click", (e) => {
      const b = e.target.closest(".line-btn");
      if (!b || playBtn.disabled) return;
      const idx = steps.findIndex((s) => s.line === Number(b.dataset.line));
      pos = idx;
      engine.cancel();
      play();
    });
    $("#pShow").onclick = () => {
      script.hidden = !script.hidden;
      $("#pShow").textContent = script.hidden ? "📄 Показать текст" : "📄 Скрыть текст";
      $("#pShow").setAttribute("aria-expanded", String(!script.hidden));
      if (!script.hidden) renderPos();
    };

    $("#pCheck").onclick = () => {
      const { score, total } = checkQuestions($("#pQs"), part.questions, { prefix: `p${pi}q` });
      saveBest("listening:" + part.id, score, total);
      $("#pResult").innerHTML = `<div class="result">Результат: ${score} / ${total}</div>`;
      if (!checked) { checked = true; showScript(); }
    };
    $("#pReset").onclick = () => {
      resetQuestions($("#pQs"));
      $("#pResult").innerHTML = "";
    };

    voiceStatus(status, {
      onReady: (ok) => {
        playBtn.disabled = !ok;
        steps = buildSteps([pi], { exam: false });
        renderPos();
        // Без озвучки можно хотя бы читать текст.
        if (!ok && !checked) { showScript(); $("#pShowNote").textContent = "Озвучка недоступна — тренируйтесь по тексту."; }
      }
    });
    renderPos();
  }
})();
