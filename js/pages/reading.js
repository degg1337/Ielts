/* Раздел Reading: текст, вопросы, таймер и автопроверка. */
(() => {
  "use strict";
  const { app, esc, $, tabs, renderQuestions, checkQuestions, resetQuestions, makeTimer, rawToBand, saveBest, activity } = App;

  App.pages.reading = (param) => {
    const test = READING.find((r) => r.id === param) || READING[0];
    const letters = test.paragraphs.map((p) => p[0]);
    app.innerHTML = `
      <h1>Reading</h1>
      <p class="lead">Прочитайте текст и ответьте на вопросы. Рекомендуемое время — ${test.minutes} минут.</p>`;
    app.appendChild(tabs(READING.map((r) => ({ id: r.id, label: r.title })), test.id, "reading", "Тексты"));

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="card row">
        <span class="badge">${esc(test.level)}</span>
        <span class="timer" id="rTimer" role="timer" aria-label="Оставшееся время"></span>
        <button class="btn secondary" id="rStart">▶ Старт таймера</button>
        <span class="muted small">Таймер необязателен — можно решать и без него.</span>
      </div>
      <div class="split">
        <article class="card passage" lang="en" tabindex="0" aria-label="Текст для чтения">
          <h2 class="card-title">${esc(test.title)}</h2>
          ${test.paragraphs.map(([l, t]) => `<p><span class="para-label">${l}</span>${esc(t)}</p>`).join("")}
        </article>
        <section class="card" id="rQs" aria-label="Вопросы">
          <div lang="en">${renderQuestions(test.questions, { letters })}</div>
          <div class="row mt">
            <button class="btn" id="rCheck">Проверить ответы</button>
            <button class="btn secondary" id="rReset">Сбросить</button>
          </div>
          <div id="rResult" aria-live="polite"></div>
        </section>
      </div>`;
    app.appendChild(wrap);

    const qs = $("#rQs");
    const startBtn = $("#rStart");
    const timer = makeTimer($("#rTimer"), test.minutes * 60, {
      onEnd: () => { check(); $("#rResult").insertAdjacentHTML("afterbegin", '<p class="bad-text">Время вышло!</p>'); }
    });
    startBtn.onclick = () => {
      if (timer.running) { timer.stop(); startBtn.textContent = "▶ Продолжить"; }
      else { timer.start(); startBtn.textContent = "⏸ Пауза"; }
    };

    function check() {
      timer.stop();
      startBtn.textContent = "▶ Продолжить";
      const { score, total } = checkQuestions(qs, test.questions);
      const band = rawToBand(Math.round((score / total) * 40), BAND_TABLES.readingAcademic);
      saveBest("reading:" + test.id, score, total);
      activity.task("reading");
      $("#rResult").innerHTML = `<div class="result">Результат: ${score} / ${total} — примерно Band ${band.toFixed(1)}</div>
        <p class="muted small">Оценка band пересчитана пропорционально на 40 вопросов и носит ориентировочный характер.</p>`;
    }
    $("#rCheck").onclick = check;
    $("#rReset").onclick = () => {
      resetQuestions(qs);
      $("#rResult").innerHTML = "";
      timer.reset();
      startBtn.textContent = "▶ Старт таймера";
    };
  };
})();
