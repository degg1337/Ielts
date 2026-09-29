/* Калькулятор итогового балла IELTS. */
(() => {
  "use strict";
  const { app, $, $$, rawToBand } = App;

  App.pages.calc = () => {
    const bandOpts = Array.from({ length: 19 }, (_, i) => 9 - i * 0.5)
      .map((b) => `<option value="${b}"${b === 6 ? " selected" : ""}>${b.toFixed(1)}</option>`).join("");
    app.innerHTML = `
      <h1>Калькулятор IELTS</h1>
      <p class="lead">Введите количество правильных ответов (из 40) для Listening и Reading и ваши оценки за Writing и Speaking.</p>
      <div class="card">
        <div class="calc-grid">
          <div><label for="cModule">Модуль</label><select id="cModule"><option value="academic">Academic</option><option value="general">General Training</option></select></div>
          <div><label for="cL">Listening (из 40)</label><input id="cL" type="number" inputmode="numeric" min="0" max="40" value="30"></div>
          <div><label for="cR">Reading (из 40)</label><input id="cR" type="number" inputmode="numeric" min="0" max="40" value="30"></div>
          <div><label for="cW">Writing (band)</label><select id="cW">${bandOpts}</select></div>
          <div><label for="cS">Speaking (band)</label><select id="cS">${bandOpts}</select></div>
        </div>
      </div>
      <div class="card row gap-xl" aria-live="polite">
        <div><div class="muted small">Overall Band</div><div class="band-out" id="cOut"></div></div>
        <div id="cDetail"></div>
      </div>
      <section class="card">
        <h2 class="card-title">Как считается итоговый балл</h2>
        <p>Overall — среднее арифметическое четырёх оценок, округлённое до ближайшей половины балла. Если среднее заканчивается на .25 — округляется вверх до .5, если на .75 — вверх до целого.</p>
        <p class="muted small">Например: (6.5 + 6.5 + 5.5 + 6.0) / 4 = 6.125 → 6.0; (7 + 6.5 + 6 + 6.5) / 4 = 6.5; (6 + 6.5 + 6 + 6.5) / 4 = 6.25 → 6.5.</p>
      </section>`;

    const clamp = (v) => Math.max(0, Math.min(40, Math.round(Number(v) || 0)));
    const calc = () => {
      const l = rawToBand(clamp($("#cL").value), BAND_TABLES.listening);
      const rTable = $("#cModule").value === "general" ? BAND_TABLES.readingGeneral : BAND_TABLES.readingAcademic;
      const r = rawToBand(clamp($("#cR").value), rTable);
      const w = Number($("#cW").value);
      const s = Number($("#cS").value);
      const overall = Math.round(((l + r + w + s) / 4) * 2) / 2;
      $("#cOut").textContent = overall.toFixed(1);
      $("#cDetail").innerHTML = `Listening: <b>${l.toFixed(1)}</b><br>Reading: <b>${r.toFixed(1)}</b><br>Writing: <b>${w.toFixed(1)}</b><br>Speaking: <b>${s.toFixed(1)}</b>`;
    };
    $$("input, select", app).forEach((el) => el.addEventListener("input", calc));
    calc();
  };
})();
