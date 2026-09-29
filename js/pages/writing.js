/* Раздел Writing: задания Task 1/2, таймер, счётчик слов, черновики. */
(() => {
  "use strict";
  const { app, esc, $, pick, store, tabs, makeTimer, activity } = App;

  App.pages.writing = (param) => {
    const task = param === "task1" ? "task1" : "task2";
    const list = WRITING[task];
    const minWords = task === "task1" ? 150 : 250;
    const minutes = task === "task1" ? 20 : 40;
    let current = store.get("writing:" + task, list[0].id);
    if (!list.some((p) => p.id === current)) current = list[0].id;

    app.innerHTML = `
      <h1>Writing</h1>
      <p class="lead">Выберите задание, запустите таймер и пишите. Черновик сохраняется автоматически.</p>`;
    app.appendChild(tabs([{ id: "task1", label: "Task 1 (Academic)" }, { id: "task2", label: "Task 2 (Essay)" }], task, "writing", "Задания"));

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="card">
        <div class="row mb">
          <select id="wSel" class="select-pill" aria-label="Выбор задания">
            ${list.map((p) => `<option value="${p.id}">${esc(p.title || p.type)}</option>`).join("")}
          </select>
          <button class="btn secondary" id="wRandom">🎲 Случайная тема</button>
        </div>
        <div id="wPrompt" lang="en"></div>
      </div>
      <div class="card">
        <div class="row between mb">
          <div class="row">
            <span class="timer" id="wTimer" role="timer" aria-label="Оставшееся время"></span>
            <button class="btn secondary" id="wStart">▶ Старт</button>
          </div>
          <span class="wordcount" id="wCount" aria-live="polite"></span>
        </div>
        <textarea id="wText" lang="en" aria-label="Текст ответа" placeholder="Начните писать здесь…"></textarea>
        <div class="row mt">
          <button class="btn secondary" id="wClear">Очистить</button>
          <button class="btn secondary" id="wCopy">Скопировать текст</button>
          <span id="wMsg" class="small" aria-live="polite"></span>
        </div>
      </div>
      <div class="grid">
        <div class="card checklist">
          <h2 class="card-title">Самопроверка</h2>
          ${WRITING.checklist.map((c) => `<label><input type="checkbox"> <span>${esc(c)}</span></label>`).join("")}
        </div>
        <div class="card">
          <h2 class="card-title">Полезные фразы</h2>
          ${Object.entries(WRITING.phrases).map(([k, v]) => `<p class="phrase-head"><b>${esc(k)}</b></p><ul class="phrases" lang="en">${v.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
        </div>
      </div>`;
    app.appendChild(wrap);

    const sel = $("#wSel");
    const text = $("#wText");
    const count = $("#wCount");
    const msg = $("#wMsg");
    const startBtn = $("#wStart");
    const timer = makeTimer($("#wTimer"), minutes * 60, {
      onEnd: () => { msg.className = "small bad-text"; msg.textContent = "Время вышло! Отложите ручку 🙂"; startBtn.textContent = "▶ Старт"; }
    });

    const updateCount = () => {
      const n = (text.value.match(/[A-Za-zÀ-ÿ0-9'’-]+/g) || []).length;
      count.textContent = `${n} / ${minWords}+ слов`;
      count.className = "wordcount " + (n >= minWords ? "ok" : n > 0 ? "low" : "");
      return n;
    };

    const load = (id) => {
      current = id;
      store.set("writing:" + task, id);
      sel.value = id;
      const p = list.find((x) => x.id === id);
      let html = `<p><b>You should spend about ${minutes} minutes on this task.</b></p><p>${esc(p.prompt)}</p>`;
      if (p.table) {
        html += `<div class="table-wrap" tabindex="0" role="region" aria-label="Таблица"><table class="data"><tr>${p.table.head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr>
          ${p.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div>`;
      }
      html += `<p class="muted small">Write at least ${minWords} words.</p>`;
      $("#wPrompt").innerHTML = html;
      text.value = store.get("drafts", {})[id] || "";
      updateCount();
      timer.reset();
      startBtn.textContent = "▶ Старт";
      msg.textContent = "";
    };

    // Черновик пишется в хранилище с задержкой (store.set сам откладывает запись).
    text.addEventListener("input", () => {
      // Эссе нужной длины засчитывается в серию один раз в день — только когда его пишут, а не просто открывают.
      if (updateCount() >= minWords) activity.task("writing:" + current, { once: true });
      const drafts = { ...store.get("drafts", {}) };
      if (text.value.trim()) drafts[current] = text.value; else delete drafts[current];
      store.set("drafts", drafts);
    });
    sel.onchange = () => load(sel.value);
    $("#wRandom").onclick = () => load(pick(list.filter((p) => p.id !== current)).id);
    startBtn.onclick = () => {
      if (timer.running) { timer.stop(); startBtn.textContent = "▶ Продолжить"; }
      else { timer.start(); startBtn.textContent = "⏸ Пауза"; msg.textContent = ""; }
    };
    $("#wClear").onclick = () => {
      if (text.value && !confirm("Удалить текст?")) return;
      text.value = "";
      text.dispatchEvent(new Event("input"));
    };
    $("#wCopy").onclick = async () => {
      try {
        await navigator.clipboard.writeText(text.value);
        msg.className = "small ok-text";
        msg.textContent = "Скопировано ✔";
      } catch { text.select(); }
    };
    load(current);
  };
})();
