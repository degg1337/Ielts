/* Общий движок Listening: озвучка через Web Speech API, подбор голосов, шаги записи.
   Используется разделом Listening и пробным экзаменом. */
(() => {
  "use strict";
  const { esc, $, voices, onLeave, sleep, renderQuestions } = App;
  const synth = window.speechSynthesis;
  const BASE_RATE = 0.95;

  // Короткие фразы озвучиваются надёжнее: длинные реплики Chrome иногда обрывает.
  const sentences = (t) => (t.match(/[^.!?]+[.!?]+["'”’]?|[^.!?]+$/g) || [t]).map((s) => s.trim()).filter(Boolean);

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

    async function run(steps, from, { onStep, onTick = () => {}, rate }) {
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

  /* Набор частей Listening (4 части практики или экзамена).
     cfg: { parts, readSeconds, gapSeconds } — время читается при каждой сборке шагов. */
  function createSet(cfg) {
    const parts = cfg.parts;
    const count = (p) => p.questions.filter((q) => q.type !== "info").length;
    const starts = [];
    let n = 1;
    parts.forEach((p) => { starts.push(n); n += count(p); });
    const total = n - 1;
    const range = (pi) => `${starts[pi]}–${starts[pi] + count(parts[pi]) - 1}`;

    // Голоса подбираются один раз: у каждой части свои говорящие, диктор общий.
    let casting = null;
    function castFor(pi) {
      if (!casting || casting.voiceCount !== voices.list.length) {
        const perPart = parts.map((p) => voices.cast(p.speakers));
        casting = { voiceCount: voices.list.length, perPart, narrator: voices.narrator(perPart) };
      }
      return { ...casting.perPart[pi], N: casting.narrator };
    }

    function buildSteps(partIdxs, { exam }) {
      const readMs = (cfg.readSeconds ?? 30) * 1000;
      const gapMs = (cfg.gapSeconds ?? 5) * 1000;
      const steps = [];
      partIdxs.forEach((pi, k) => {
        const part = parts[pi];
        const cast = castFor(pi);
        if (exam) {
          steps.push({ type: "say", text: part.intro, cast: cast.N, part: pi, narr: true });
          steps.push({ type: "wait", ms: readMs, part: pi, label: `Прочитайте вопросы ${range(pi)}` });
        }
        part.script.forEach(([sp, text], li) => steps.push({ type: "say", text, cast: cast[sp], part: pi, line: li, speaker: sp }));
        if (exam) {
          steps.push({ type: "say", text: `That is the end of Part ${pi + 1}.`, cast: cast.N, part: pi, narr: true });
          if (k < partIdxs.length - 1) steps.push({ type: "wait", ms: gapMs, part: pi, label: "Пауза перед следующей частью" });
        }
      });
      if (exam) steps.push({ type: "say", text: "That is the end of the listening test.", cast: castFor(0).N, part: partIdxs[partIdxs.length - 1], narr: true });
      return steps;
    }

    const transcriptHtml = (pi, clickable) => {
      const part = parts[pi];
      const names = Object.fromEntries(part.speakers.map((s) => [s.id, s.name]));
      return `<ol class="transcript" lang="en">${part.script.map(([sp, t], li) =>
        `<li data-line="${li}">${clickable ? `<button class="line-btn" data-line="${li}" aria-label="Слушать с этой реплики">▶</button>` : ""}<b>${esc(names[sp])}:</b> ${esc(t)}</li>`).join("")}</ol>`;
    };

    const questionsHtml = (pi, idPrefix = "part") => `
      <section class="card part-block" data-part="${pi}" id="${idPrefix}-${pi}" aria-labelledby="${idPrefix}h-${pi}">
        <div class="row between">
          <h2 class="card-title" id="${idPrefix}h-${pi}">Part ${pi + 1} · Questions ${range(pi)}</h2>
          <span class="badge">${esc(parts[pi].kind)}</span>
        </div>
        <div lang="en">${renderQuestions(parts[pi].questions, { prefix: `p${pi}q`, start: starts[pi] })}</div>
        <div class="part-result" aria-live="polite"></div>
      </section>`;

    return { parts, starts, total, range, buildSteps, transcriptHtml, questionsHtml };
  }

  // Примерная длительность: ~150 слов в минуту плюс паузы.
  function estimateMinutes(steps) {
    let sec = 0;
    steps.forEach((s) => { sec += s.type === "wait" ? s.ms / 1000 : (s.text.split(/\s+/).length / (150 * BASE_RATE)) * 60 + 0.4; });
    return Math.round(sec / 60);
  }

  /* Сообщение о состоянии голосов; onReady(true/false) — можно ли включать звук. */
  async function voiceStatus(el, { onReady, fallback = "Пока можно тренироваться по транскрипту в режиме «Тренировка»." }) {
    if (!voices.supported || !synth) {
      el.innerHTML = `<div class="notice bad"><b>Озвучка не поддерживается этим браузером.</b> Откройте сайт в Chrome, Edge или Safari. ${esc(fallback)}</div>`;
      return onReady(false);
    }
    el.innerHTML = '<div class="notice">Загружаем голоса для озвучки…</div>';
    const list = await voices.ready();
    const en = voices.english();
    if (!list.length) {
      el.innerHTML = `<div class="notice bad"><b>Голоса для озвучки не загрузились.</b> Обновите страницу. Если не поможет — установите английский голос в настройках системы
        (Windows: «Время и язык → Речь», Android: «Синтез речи», macOS: «Универсальный доступ → Устный контент»).
        <button class="btn sm secondary" id="vTry">Попробовать всё равно</button></div>`;
      $("#vTry", el).onclick = () => { el.innerHTML = '<div class="notice">Пробуем голос по умолчанию.</div>'; onReady(true); };
      // Голоса могут прийти позже — тогда обновим сообщение.
      const late = () => { synth.removeEventListener("voiceschanged", late); voiceStatus(el, { onReady, fallback }); };
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

  App.listen = { BASE_RATE, createEngine, createSet, estimateMinutes, voiceStatus };
})();
