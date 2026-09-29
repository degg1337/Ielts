/* Раздел Speaking: вопросы Part 1–3, таймер Part 2, запись ответа. */
(() => {
  "use strict";
  const { app, esc, $, pick, store, tabs, makeTimer, speak, beep, onLeave } = App;

  App.pages.speaking = (param) => {
    const part = ["part1", "part2", "part3"].includes(param) ? param : "part1";
    app.innerHTML = `
      <h1>Speaking</h1>
      <p class="lead">Отвечайте вслух. Можно записать себя и прослушать — так легче заметить паузы и ошибки.</p>`;
    app.appendChild(tabs([
      { id: "part1", label: "Part 1 — Интервью" },
      { id: "part2", label: "Part 2 — Карточка" },
      { id: "part3", label: "Part 3 — Дискуссия" }
    ], part, "speaking", "Части"));

    const wrap = document.createElement("div");
    app.appendChild(wrap);

    if (part === "part1") renderPart1(wrap);
    else if (part === "part2") renderPart2(wrap);
    else renderPart3(wrap);

    const rec = document.createElement("section");
    rec.className = "card";
    rec.innerHTML = `
      <h2 class="card-title">🎙️ Запись ответа</h2>
      <div class="row">
        <button class="btn" id="recBtn">● Записать</button>
        <audio id="recAudio" controls hidden></audio>
      </div>
      <p class="muted small" id="recMsg" aria-live="polite">Запись остаётся только в вашем браузере и никуда не отправляется.</p>`;
    wrap.appendChild(rec);
    setupRecorder();

    const tips = document.createElement("section");
    tips.className = "card";
    tips.innerHTML = `<h2 class="card-title">Советы</h2><ul>${SPEAKING.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    wrap.appendChild(tips);
  };

  function renderPart1(wrap) {
    let topic = pick(SPEAKING.part1);
    let qi = 0;
    wrap.innerHTML = `
      <div class="card">
        <div class="row between">
          <span class="badge" id="sTopic"></span>
          <span class="muted small" id="sNum"></span>
        </div>
        <p class="big-q" id="sQ" lang="en" aria-live="polite"></p>
        <div class="row">
          <button class="btn" id="sNext">Следующий вопрос →</button>
          <button class="btn secondary" id="sNew">🎲 Другая тема</button>
          <button class="btn secondary" id="sSay">🔊 Озвучить вопрос</button>
        </div>
      </div>`;
    const show = () => {
      $("#sTopic").textContent = topic.topic;
      $("#sNum").textContent = `Вопрос ${qi + 1} из ${topic.qs.length}`;
      $("#sQ").textContent = topic.qs[qi];
    };
    const newTopic = () => { topic = pick(SPEAKING.part1.filter((t) => t !== topic)); qi = 0; };
    $("#sNext").onclick = () => {
      qi++;
      if (qi >= topic.qs.length) newTopic();
      show();
    };
    $("#sNew").onclick = () => { newTopic(); show(); };
    $("#sSay").onclick = () => speak($("#sQ").textContent);
    show();
  }

  function renderPart2(wrap) {
    const IDLE = "Нажмите «Начать»: 1 минута на подготовку, затем 2 минуты на ответ.";
    let card = pick(SPEAKING.part2);
    wrap.innerHTML = `
      <div class="card">
        <div class="cue" id="sCue" lang="en"></div>
        <div class="row mt-lg">
          <span class="timer big" id="sTimer" role="timer">01:00</span>
          <div>
            <p id="sPhase" class="muted mb-sm" aria-live="polite">${IDLE}</p>
            <div class="row">
              <button class="btn" id="sGo">▶ Начать</button>
              <button class="btn secondary" id="sNew">🎲 Другая карточка</button>
            </div>
          </div>
        </div>
        <textarea id="sNotes" class="notes" aria-label="Заметки" placeholder="Заметки на время подготовки (ключевые слова)…"></textarea>
      </div>`;
    const phase = $("#sPhase");
    const goBtn = $("#sGo");
    const showCard = () => {
      store.set("part2", card.title);
      $("#sCue").innerHTML = `<h2 class="card-title">${esc(card.title)}</h2><p class="muted">You should say:</p><ul>${card.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
    };
    const speakTimer = makeTimer($("#sTimer"), 120, {
      onEnd: () => { beep(); phase.textContent = "Время вышло. Отлично! Попробуйте ответить на вопросы Part 3 по этой теме."; goBtn.disabled = false; }
    });
    const prepTimer = makeTimer($("#sTimer"), 60, {
      onEnd: () => {
        beep();
        phase.textContent = "Говорите! У вас 2 минуты.";
        speakTimer.reset(120);
        speakTimer.start();
      }
    });
    goBtn.onclick = () => {
      goBtn.disabled = true;
      speakTimer.stop();
      prepTimer.reset(60);
      phase.textContent = "Подготовка: запишите ключевые слова.";
      prepTimer.start();
    };
    $("#sNew").onclick = () => {
      speakTimer.stop();
      prepTimer.reset(60);
      goBtn.disabled = false;
      phase.textContent = IDLE;
      $("#sNotes").value = "";
      card = pick(SPEAKING.part2.filter((c) => c !== card));
      showCard();
    };
    showCard();
  }

  function renderPart3(wrap) {
    const last = store.get("part2", null);
    const start = SPEAKING.part2.find((c) => c.title === last) || SPEAKING.part2[0];
    wrap.innerHTML = `
      <div class="card">
        <label class="small muted" for="sSel">Тема (связана с карточкой Part 2):</label>
        <select id="sSel" class="select-pill block">
          ${SPEAKING.part2.map((c, i) => `<option value="${i}">${esc(c.title)}</option>`).join("")}
        </select>
        <div id="sList" lang="en"></div>
        <p class="muted small">Совет: отвечайте 4–6 предложениями — мнение, причина, пример, другая точка зрения.</p>
      </div>`;
    const sel = $("#sSel");
    const render = () => {
      const c = SPEAKING.part2[sel.value];
      $("#sList").innerHTML = c.part3.map((q) => `<div class="q row between"><span class="big-q sm">${esc(q)}</span>
        <button class="btn secondary icon-btn" data-say="${esc(q)}" aria-label="Озвучить вопрос">🔊</button></div>`).join("");
    };
    sel.value = SPEAKING.part2.indexOf(start);
    sel.onchange = render;
    $("#sList").addEventListener("click", (e) => { const b = e.target.closest("[data-say]"); if (b) speak(b.dataset.say); });
    render();
  }

  function setupRecorder() {
    const btn = $("#recBtn");
    const audio = $("#recAudio");
    const msg = $("#recMsg");
    if (!navigator.mediaDevices || !window.MediaRecorder) {
      btn.disabled = true;
      msg.textContent = "Ваш браузер не поддерживает запись звука.";
      return;
    }
    let recorder = null;
    let stream = null;
    const release = () => {
      if (recorder && recorder.state !== "inactive") recorder.stop();
      if (stream) stream.getTracks().forEach((t) => t.stop());
      stream = null;
    };
    onLeave(release);
    btn.onclick = async () => {
      if (recorder && recorder.state === "recording") {
        recorder.stop();
        return;
      }
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      } catch {
        msg.textContent = "Нет доступа к микрофону. Разрешите его в настройках браузера.";
        return;
      }
      const chunks = [];
      recorder = new MediaRecorder(stream);
      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        if (audio.src) URL.revokeObjectURL(audio.src);
        audio.src = URL.createObjectURL(new Blob(chunks, { type: recorder.mimeType }));
        audio.hidden = false;
        btn.textContent = "● Записать заново";
        msg.textContent = "Прослушайте себя: есть ли длинные паузы? Повторяются ли одни и те же слова?";
        release();
      };
      recorder.start();
      btn.textContent = "■ Остановить";
      msg.textContent = "Идёт запись…";
    };
  }
})();
