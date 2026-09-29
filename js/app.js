(() => {
  "use strict";

  const app = document.getElementById("app");

  /* ---------- Helpers ---------- */
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const norm = (s) => String(s).toLowerCase().trim().replace(/\s+/g, " ").replace(/[.,]$/, "");
  const shuffle = (arr) => {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  };
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
  const fmtTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  // localStorage может быть недоступен (приватный режим) — сайт должен работать и без него.
  const store = {
    get(key, fallback) {
      try {
        const v = localStorage.getItem("ielts:" + key);
        return v === null ? fallback : JSON.parse(v);
      } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem("ielts:" + key, JSON.stringify(value)); } catch { /* ignore */ }
    }
  };

  // Всё, что нужно остановить при уходе со страницы (таймеры, озвучка, запись).
  let cleanups = [];
  const onLeave = (fn) => cleanups.push(fn);
  const runCleanups = () => { cleanups.forEach((fn) => fn()); cleanups = []; };

  function makeTimer(el, seconds, { onEnd, countUp = false } = {}) {
    let left = seconds;
    let id = null;
    const render = () => {
      el.textContent = fmtTime(countUp ? seconds - left : left);
      el.classList.toggle("low", !countUp && left <= 60 && left > 0);
    };
    const t = {
      start() {
        if (id) return;
        id = setInterval(() => {
          left--;
          render();
          if (left <= 0) { t.stop(); onEnd && onEnd(); }
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

  function rawToBand(raw, table) {
    for (const [min, band] of table) if (raw >= min) return band;
    return 0;
  }

  function saveBest(key, score, total) {
    const best = store.get("best", {});
    const prev = best[key];
    if (!prev || score / total > prev.score / prev.total) {
      best[key] = { score, total, date: new Date().toISOString().slice(0, 10) };
      store.set("best", best);
    }
  }

  /* ---------- Questions (Reading + Listening) ---------- */
  const SELECT_OPTS = {
    tfng: ["TRUE", "FALSE", "NOT GIVEN"],
    yng: ["YES", "NO", "NOT GIVEN"]
  };

  function renderQuestions(questions, ctx) {
    let n = 0;
    return questions.map((q, i) => {
      if (q.type === "info") return `<div class="instructions">${esc(q.text)}</div>`;
      n++;
      const name = `q${i}`;
      let input = "";
      if (q.type === "mcq") {
        input = q.options.map((o, k) =>
          `<label><input type="radio" name="${name}" value="${k}"> ${"ABCD"[k]}. ${esc(o)}</label>`).join("");
      } else if (q.type === "gap") {
        input = `<input type="text" name="${name}" autocomplete="off" spellcheck="false" placeholder="ваш ответ">`;
      } else {
        const opts = q.type === "para" ? ctx.letters : SELECT_OPTS[q.type];
        input = `<select name="${name}"><option value="">—</option>${opts.map((o) => `<option>${o}</option>`).join("")}</select>`;
      }
      return `<div class="q" data-i="${i}">
        <div class="q-text"><span class="q-num">${n}.</span>${esc(q.text)}</div>
        ${input}
        <div class="answer-note"></div>
      </div>`;
    }).join("");
  }

  function checkQuestions(root, questions) {
    let score = 0, total = 0;
    questions.forEach((q, i) => {
      if (q.type === "info") return;
      total++;
      const box = $(`.q[data-i="${i}"]`, root);
      let given, ok, correctText;
      if (q.type === "mcq") {
        const r = $(`input[name="q${i}"]:checked`, root);
        given = r ? Number(r.value) : null;
        ok = given === q.answer;
        correctText = `${"ABCD"[q.answer]}. ${q.options[q.answer]}`;
      } else if (q.type === "gap") {
        given = norm($(`[name="q${i}"]`, root).value);
        ok = q.answer.some((a) => norm(a) === given);
        correctText = q.answer[0];
      } else {
        given = $(`[name="q${i}"]`, root).value;
        ok = given === q.answer;
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

  function tabs(items, activeId, onClick) {
    const wrap = document.createElement("div");
    wrap.className = "tabs";
    wrap.innerHTML = items.map((it) =>
      `<button class="tab ${it.id === activeId ? "active" : ""}" data-id="${esc(it.id)}">${esc(it.label)}</button>`).join("");
    wrap.addEventListener("click", (e) => {
      const b = e.target.closest(".tab");
      if (b) onClick(b.dataset.id);
    });
    return wrap;
  }

  /* ---------- Pages ---------- */
  const pages = {};

  pages.home = () => {
    const best = store.get("best", {});
    const known = store.get("vocabKnown", []).length;
    const essays = Object.keys(store.get("drafts", {})).length;
    const bestRow = (key, label) => {
      const b = best[key];
      return `<li>${label}: ${b ? `<b>${b.score}/${b.total}</b> <span class="muted small">(${b.date})</span>` : '<span class="muted">ещё не решали</span>'}</li>`;
    };

    app.innerHTML = `
      <section class="card hero">
        <h1>Подготовка к IELTS</h1>
        <p>Практика всех четырёх частей экзамена: Reading, Listening, Writing и Speaking. Таймеры как на настоящем экзамене, автопроверка ответов, словарь академической лексики и калькулятор итогового балла.</p>
      </section>

      <div class="grid">
        <a class="card tile" href="#reading"><div class="icon">📖</div><h3>Reading</h3><p>Академические тексты, вопросы TRUE/FALSE/NOT GIVEN, выбор ответа, пропуски. 20 минут на текст.</p></a>
        <a class="card tile" href="#listening"><div class="icon">🎧</div><h3>Listening</h3><p>Диалоги и монологи с озвучкой, заполнение форм. Можно слушать только один раз — как на экзамене.</p></a>
        <a class="card tile" href="#writing"><div class="icon">✍️</div><h3>Writing</h3><p>Task 1 и Task 2 с таймером, счётчиком слов, полезными фразами и чек-листом по критериям.</p></a>
        <a class="card tile" href="#speaking"><div class="icon">🗣️</div><h3>Speaking</h3><p>Вопросы Part 1, карточки Part 2 с таймером подготовки, Part 3 и запись своего ответа.</p></a>
        <a class="card tile" href="#vocab"><div class="icon">🃏</div><h3>Словарь</h3><p>${VOCAB.length} академических слов с переводом и примерами. Флэш-карточки.</p></a>
        <a class="card tile" href="#calc"><div class="icon">🧮</div><h3>Калькулятор</h3><p>Перевод сырых баллов в band и расчёт итоговой оценки Overall.</p></a>
      </div>

      <h2>Ваш прогресс</h2>
      <div class="grid">
        <div class="card">
          <h3>Лучшие результаты</h3>
          <ul>
            ${READING.map((r) => bestRow("reading:" + r.id, "Reading — " + esc(r.title))).join("")}
            ${LISTENING.map((l) => bestRow("listening:" + l.id, "Listening — " + esc(l.title))).join("")}
          </ul>
        </div>
        <div class="card">
          <h3>Словарь и эссе</h3>
          <p>Выучено слов: <b>${known}</b> из ${VOCAB.length}</p>
          <div class="progress"><div style="width:${Math.round((known / VOCAB.length) * 100)}%"></div></div>
          <p>Сохранённых черновиков эссе: <b>${essays}</b></p>
        </div>
      </div>

      <h2>Формат экзамена</h2>
      <div class="card chart-box">
        <table class="data">
          <tr><th>Часть</th><th>Время</th><th>Задания</th></tr>
          <tr><td>Listening</td><td>~30 мин (+10 мин на перенос в бумажной версии)</td><td>4 части, 40 вопросов</td></tr>
          <tr><td>Reading</td><td>60 мин</td><td>3 текста, 40 вопросов</td></tr>
          <tr><td>Writing</td><td>60 мин</td><td>Task 1 (150+ слов, ~20 мин), Task 2 (250+ слов, ~40 мин)</td></tr>
          <tr><td>Speaking</td><td>11–14 мин</td><td>Part 1 интервью, Part 2 монолог 2 мин, Part 3 дискуссия</td></tr>
        </table>
      </div>`;
  };

  pages.reading = (param) => {
    const test = READING.find((r) => r.id === param) || READING[0];
    const letters = test.paragraphs.map((p) => p[0]);
    app.innerHTML = `
      <h1>Reading</h1>
      <p class="lead">Прочитайте текст и ответьте на вопросы. Рекомендуемое время — ${test.minutes} минут.</p>`;
    app.appendChild(tabs(READING.map((r) => ({ id: r.id, label: r.title })), test.id, (id) => { location.hash = "reading/" + id; }));

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="card row">
        <span class="badge">${esc(test.level)}</span>
        <span class="timer" id="rTimer"></span>
        <button class="btn secondary" id="rStart">▶ Старт таймера</button>
        <span class="muted small">Таймер необязателен — можно решать и без него.</span>
      </div>
      <div class="split">
        <div class="card passage">
          <h3>${esc(test.title)}</h3>
          ${test.paragraphs.map(([l, t]) => `<p><span class="para-label">${l}</span>${esc(t)}</p>`).join("")}
        </div>
        <div class="card" id="rQs">
          ${renderQuestions(test.questions, { letters })}
          <div class="row" style="margin-top:16px">
            <button class="btn" id="rCheck">Проверить ответы</button>
            <button class="btn secondary" id="rReset">Сбросить</button>
          </div>
          <div id="rResult"></div>
        </div>
      </div>`;
    app.appendChild(wrap);

    const qs = $("#rQs");
    const timer = makeTimer($("#rTimer"), test.minutes * 60, {
      onEnd: () => { alert("Время вышло! Проверяем ответы."); $("#rCheck").click(); }
    });
    $("#rStart").onclick = (e) => {
      if (timer.running) { timer.stop(); e.target.textContent = "▶ Продолжить"; }
      else { timer.start(); e.target.textContent = "⏸ Пауза"; }
    };
    $("#rCheck").onclick = () => {
      timer.stop();
      const { score, total } = checkQuestions(qs, test.questions);
      const band = rawToBand(Math.round((score / total) * 40), BAND_TABLES.readingAcademic);
      saveBest("reading:" + test.id, score, total);
      $("#rResult").innerHTML = `<div class="result">Результат: ${score} / ${total} — примерно Band ${band.toFixed(1)}</div>
        <p class="muted small">Оценка band пересчитана пропорционально на 40 вопросов и носит ориентировочный характер.</p>`;
    };
    $("#rReset").onclick = () => {
      resetQuestions(qs);
      $("#rResult").innerHTML = "";
      timer.reset();
      $("#rStart").textContent = "▶ Старт таймера";
    };
  };

  pages.listening = (param) => {
    const test = LISTENING.find((l) => l.id === param) || LISTENING[0];
    const synth = window.speechSynthesis;
    app.innerHTML = `
      <h1>Listening</h1>
      <p class="lead">Прочитайте вопросы, затем нажмите «Слушать». Текст озвучивается синтезатором речи вашего браузера (лучше всего в Chrome, Edge или Safari).</p>`;
    app.appendChild(tabs(LISTENING.map((l) => ({ id: l.id, label: l.title })), test.id, (id) => { location.hash = "listening/" + id; }));

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="card">
        <p>${esc(test.desc)}</p>
        <div class="row">
          <button class="btn" id="lPlay">▶ Слушать</button>
          <button class="btn secondary" id="lStop" disabled>■ Стоп</button>
          <label class="small"><input type="checkbox" id="lOnce" checked> Как на экзамене: только один раз</label>
          <label class="small">Скорость
            <select id="lRate"><option value="0.85">медленно</option><option value="1" selected>нормально</option><option value="1.1">быстро</option></select>
          </label>
        </div>
        <p class="muted small" id="lStatus"></p>
      </div>
      <div class="card" id="lQs">
        ${renderQuestions(test.questions, {})}
        <div class="row" style="margin-top:16px">
          <button class="btn" id="lCheck">Проверить ответы</button>
          <button class="btn secondary" id="lReset">Сбросить</button>
        </div>
        <div id="lResult"></div>
      </div>
      <div class="card" id="lScript" hidden>
        <h3>Транскрипт</h3>
        ${test.script.map(([who, t]) => `<p><b>${esc(test.voices[who])}:</b> ${esc(t)}</p>`).join("")}
      </div>`;
    app.appendChild(wrap);

    const status = $("#lStatus");
    const playBtn = $("#lPlay");
    const stopBtn = $("#lStop");
    let played = false;

    if (!synth) {
      playBtn.disabled = true;
      status.textContent = "Ваш браузер не поддерживает озвучку. Откройте транскрипт и потренируйтесь в чтении вслух.";
      $("#lScript").hidden = false;
    }

    const pickVoices = () => {
      const en = synth.getVoices().filter((v) => /^en[-_]/i.test(v.lang));
      const gb = en.filter((v) => /GB|AU/i.test(v.lang));
      const pool = gb.length >= 2 ? gb : en;
      return { A: pool[0] || null, B: pool[1] || pool[0] || null };
    };

    const stop = () => {
      if (synth) synth.cancel();
      stopBtn.disabled = true;
      playBtn.disabled = $("#lOnce").checked && played;
    };
    onLeave(() => synth && synth.cancel());

    playBtn.onclick = () => {
      synth.cancel();
      const voices = pickVoices();
      const rate = Number($("#lRate").value);
      played = true;
      playBtn.disabled = true;
      stopBtn.disabled = false;
      status.textContent = "Идёт запись…";
      test.script.forEach(([who, text], idx) => {
        const u = new SpeechSynthesisUtterance(text);
        u.lang = "en-GB";
        if (voices[who]) u.voice = voices[who];
        // Если голос всего один — различаем собеседников высотой тона.
        u.pitch = who === "B" && voices.A === voices.B ? 1.35 : 1;
        u.rate = rate;
        if (idx === test.script.length - 1) {
          u.onend = () => { status.textContent = "Запись закончилась. Проверьте ответы."; stop(); };
        }
        synth.speak(u);
      });
    };
    stopBtn.onclick = () => { status.textContent = "Остановлено."; stop(); };

    const qs = $("#lQs");
    $("#lCheck").onclick = () => {
      const { score, total } = checkQuestions(qs, test.questions);
      saveBest("listening:" + test.id, score, total);
      $("#lResult").innerHTML = `<div class="result">Результат: ${score} / ${total}</div>`;
      $("#lScript").hidden = false;
    };
    $("#lReset").onclick = () => {
      stop();
      played = false;
      playBtn.disabled = !synth;
      resetQuestions(qs);
      $("#lResult").innerHTML = "";
      $("#lScript").hidden = !!synth;
      status.textContent = "";
    };
  };

  pages.writing = (param) => {
    const task = param === "task1" ? "task1" : "task2";
    const list = WRITING[task];
    const minWords = task === "task1" ? 150 : 250;
    const minutes = task === "task1" ? 20 : 40;
    let current = store.get("writing:" + task, list[0].id);
    if (!list.some((p) => p.id === current)) current = list[0].id;

    app.innerHTML = `
      <h1>Writing</h1>
      <p class="lead">Выберите задание, запустите таймер и пишите. Черновик сохраняется автоматически.</p>`;
    app.appendChild(tabs([{ id: "task1", label: "Task 1 (Academic)" }, { id: "task2", label: "Task 2 (Essay)" }], task, (id) => { location.hash = "writing/" + id; }));

    const wrap = document.createElement("div");
    wrap.innerHTML = `
      <div class="card">
        <div class="row" style="margin-bottom:12px">
          <select id="wSel" class="tab">
            ${list.map((p) => `<option value="${p.id}">${esc(p.title || p.type)}</option>`).join("")}
          </select>
          <button class="btn secondary" id="wRandom">🎲 Случайная тема</button>
        </div>
        <div id="wPrompt"></div>
      </div>
      <div class="card">
        <div class="row" style="justify-content:space-between;margin-bottom:10px">
          <div class="row">
            <span class="timer" id="wTimer"></span>
            <button class="btn secondary" id="wStart">▶ Старт</button>
          </div>
          <span class="wordcount" id="wCount"></span>
        </div>
        <textarea id="wText" placeholder="Начните писать здесь…"></textarea>
        <div class="row" style="margin-top:10px">
          <button class="btn secondary" id="wClear">Очистить</button>
          <button class="btn secondary" id="wCopy">Скопировать текст</button>
        </div>
      </div>
      <div class="grid">
        <div class="card checklist">
          <h3>Самопроверка</h3>
          ${WRITING.checklist.map((c, i) => `<label><input type="checkbox" data-c="${i}"> ${esc(c)}</label>`).join("")}
        </div>
        <div class="card">
          <h3>Полезные фразы</h3>
          ${Object.entries(WRITING.phrases).map(([k, v]) => `<p style="margin:10px 0 4px"><b>${esc(k)}</b></p><ul class="phrases">${v.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`).join("")}
        </div>
      </div>`;
    app.appendChild(wrap);

    const sel = $("#wSel");
    const text = $("#wText");
    const count = $("#wCount");
    const timer = makeTimer($("#wTimer"), minutes * 60, { onEnd: () => alert("Время вышло! Отложите ручку 🙂") });

    const updateCount = () => {
      const n = (text.value.match(/[A-Za-zÀ-ÿ0-9'’-]+/g) || []).length;
      count.textContent = `${n} / ${minWords}+ слов`;
      count.className = "wordcount " + (n >= minWords ? "ok" : n > 0 ? "low" : "");
    };

    const load = (id) => {
      current = id;
      store.set("writing:" + task, id);
      sel.value = id;
      const p = list.find((x) => x.id === id);
      let html = `<p><b>${task === "task1" ? "You should spend about 20 minutes on this task." : "You should spend about 40 minutes on this task."}</b></p><p>${esc(p.prompt)}</p>`;
      if (p.table) {
        html += `<div class="chart-box"><table class="data"><tr>${p.table.head.map((h) => `<th>${esc(h)}</th>`).join("")}</tr>
          ${p.table.rows.map((r) => `<tr>${r.map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</table></div>`;
      }
      html += `<p class="muted small">Write at least ${minWords} words.</p>`;
      $("#wPrompt").innerHTML = html;
      text.value = store.get("drafts", {})[id] || "";
      updateCount();
      timer.reset();
      $("#wStart").textContent = "▶ Старт";
    };

    text.addEventListener("input", () => {
      updateCount();
      const drafts = store.get("drafts", {});
      if (text.value.trim()) drafts[current] = text.value; else delete drafts[current];
      store.set("drafts", drafts);
    });
    sel.onchange = () => load(sel.value);
    $("#wRandom").onclick = () => load(pick(list.filter((p) => p.id !== current)).id);
    $("#wStart").onclick = (e) => {
      if (timer.running) { timer.stop(); e.target.textContent = "▶ Продолжить"; }
      else { timer.start(); e.target.textContent = "⏸ Пауза"; }
    };
    $("#wClear").onclick = () => {
      if (text.value && !confirm("Удалить текст?")) return;
      text.value = "";
      text.dispatchEvent(new Event("input"));
    };
    $("#wCopy").onclick = async () => {
      try { await navigator.clipboard.writeText(text.value); $("#wCopy").textContent = "Скопировано ✔"; }
      catch { text.select(); }
    };
    load(current);
  };

  pages.speaking = (param) => {
    const part = ["part1", "part2", "part3"].includes(param) ? param : "part1";
    app.innerHTML = `
      <h1>Speaking</h1>
      <p class="lead">Отвечайте вслух. Можно записать себя и прослушать — так легче заметить паузы и ошибки.</p>`;
    app.appendChild(tabs([
      { id: "part1", label: "Part 1 — Интервью" },
      { id: "part2", label: "Part 2 — Карточка" },
      { id: "part3", label: "Part 3 — Дискуссия" }
    ], part, (id) => { location.hash = "speaking/" + id; }));

    const wrap = document.createElement("div");
    app.appendChild(wrap);

    if (part === "part1") {
      let topic = pick(SPEAKING.part1);
      let qi = 0;
      wrap.innerHTML = `
        <div class="card">
          <div class="row" style="justify-content:space-between">
            <span class="badge" id="sTopic"></span>
            <span class="muted small" id="sNum"></span>
          </div>
          <div class="big-q" id="sQ"></div>
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
      $("#sNext").onclick = () => {
        qi++;
        if (qi >= topic.qs.length) { topic = pick(SPEAKING.part1.filter((t) => t !== topic)); qi = 0; }
        show();
      };
      $("#sNew").onclick = () => { topic = pick(SPEAKING.part1.filter((t) => t !== topic)); qi = 0; show(); };
      $("#sSay").onclick = () => speak($("#sQ").textContent);
      show();
    } else if (part === "part2") {
      let card = pick(SPEAKING.part2);
      wrap.innerHTML = `
        <div class="card">
          <div class="cue" id="sCue"></div>
          <div class="row" style="margin-top:20px">
            <span class="timer big" id="sTimer">01:00</span>
            <div>
              <div id="sPhase" class="muted" style="margin-bottom:8px">Нажмите «Начать»: 1 минута на подготовку, затем 2 минуты на ответ.</div>
              <div class="row">
                <button class="btn" id="sGo">▶ Начать</button>
                <button class="btn secondary" id="sNew">🎲 Другая карточка</button>
              </div>
            </div>
          </div>
          <textarea id="sNotes" style="min-height:100px;margin-top:16px" placeholder="Заметки на время подготовки (ключевые слова)…"></textarea>
        </div>`;
      const showCard = () => {
        $("#sCue").innerHTML = `<h3>${esc(card.title)}</h3><p class="muted">You should say:</p><ul>${card.points.map((p) => `<li>${esc(p)}</li>`).join("")}</ul>`;
      };
      const phase = $("#sPhase");
      let speakTimer;
      const prepTimer = makeTimer($("#sTimer"), 60, {
        onEnd: () => {
          beep();
          phase.textContent = "Говорите! У вас 2 минуты.";
          speakTimer = makeTimer($("#sTimer"), 120, {
            onEnd: () => { beep(); phase.textContent = "Время вышло. Отлично! Попробуйте ответить на вопросы Part 3 по этой теме."; $("#sGo").disabled = false; }
          });
          speakTimer.start();
        }
      });
      $("#sGo").onclick = () => {
        $("#sGo").disabled = true;
        if (speakTimer) speakTimer.stop();
        prepTimer.reset(60);
        phase.textContent = "Подготовка: запишите ключевые слова.";
        prepTimer.start();
      };
      $("#sNew").onclick = () => {
        prepTimer.reset(60);
        if (speakTimer) speakTimer.stop();
        $("#sGo").disabled = false;
        phase.textContent = "Нажмите «Начать»: 1 минута на подготовку, затем 2 минуты на ответ.";
        $("#sNotes").value = "";
        card = pick(SPEAKING.part2.filter((c) => c !== card));
        store.set("part2", card.title);
        showCard();
      };
      store.set("part2", card.title);
      showCard();
    } else {
      const last = store.get("part2", null);
      const start = SPEAKING.part2.find((c) => c.title === last) || SPEAKING.part2[0];
      wrap.innerHTML = `
        <div class="card">
          <label class="small muted">Тема (связана с карточкой Part 2):</label><br>
          <select id="sSel" class="tab" style="margin:6px 0 12px;max-width:100%">
            ${SPEAKING.part2.map((c, i) => `<option value="${i}">${esc(c.title)}</option>`).join("")}
          </select>
          <div id="sList"></div>
          <p class="muted small">Совет: отвечайте 4–6 предложениями — мнение, причина, пример, другая точка зрения.</p>
        </div>`;
      const sel = $("#sSel");
      const render = () => {
        const c = SPEAKING.part2[sel.value];
        $("#sList").innerHTML = c.part3.map((q) => `<div class="q"><span class="big-q" style="font-size:1.1rem">${esc(q)}</span> <button class="btn secondary" data-say="${esc(q)}" style="padding:4px 10px">🔊</button></div>`).join("");
      };
      sel.value = SPEAKING.part2.indexOf(start);
      sel.onchange = render;
      $("#sList").addEventListener("click", (e) => { const b = e.target.closest("[data-say]"); if (b) speak(b.dataset.say); });
      render();
    }

    // Recorder — общий для всех частей.
    const rec = document.createElement("div");
    rec.className = "card";
    rec.innerHTML = `
      <h3>🎙️ Запись ответа</h3>
      <div class="row">
        <button class="btn" id="recBtn">● Записать</button>
        <audio id="recAudio" controls hidden></audio>
      </div>
      <p class="muted small" id="recMsg">Запись остаётся только в вашем браузере и никуда не отправляется.</p>`;
    wrap.appendChild(rec);
    setupRecorder();

    const tips = document.createElement("div");
    tips.className = "card";
    tips.innerHTML = `<h3>Советы</h3><ul>${SPEAKING.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    wrap.appendChild(tips);
  };

  function speak(text) {
    if (!window.speechSynthesis) return;
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "en-GB";
    speechSynthesis.speak(u);
    onLeave(() => speechSynthesis.cancel());
  }

  function beep() {
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const o = ctx.createOscillator();
      o.frequency.value = 880;
      o.connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + 0.25);
    } catch { /* без звука */ }
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

  pages.vocab = (param) => {
    const mode = param === "list" ? "list" : "cards";
    app.innerHTML = `
      <h1>Академический словарь</h1>
      <p class="lead">Слова, которые часто встречаются в Reading и помогают поднять оценку за Lexical Resource в Writing и Speaking.</p>`;
    app.appendChild(tabs([{ id: "cards", label: "Карточки" }, { id: "list", label: "Список" }], mode, (id) => { location.hash = "vocab/" + id; }));

    const wrap = document.createElement("div");
    app.appendChild(wrap);
    const known = new Set(store.get("vocabKnown", []));
    const saveKnown = () => store.set("vocabKnown", Array.from(known));

    if (mode === "list") {
      wrap.innerHTML = `
        <div class="card">
          <input id="vSearch" class="tab" style="width:100%;border-radius:10px;padding:10px 14px" placeholder="Поиск по слову или переводу…">
        </div>
        <div class="card chart-box"><table class="data" id="vTable"></table></div>`;
      const render = () => {
        const q = norm($("#vSearch").value);
        const rows = VOCAB.filter(([w, , ru]) => !q || w.includes(q) || ru.toLowerCase().includes(q));
        $("#vTable").innerHTML = `<tr><th>Слово</th><th>Перевод</th><th>Пример</th><th>Знаю</th></tr>` +
          rows.map(([w, pos, ru, ex]) => `<tr>
            <td style="text-align:left"><b>${esc(w)}</b> <span class="muted small">${esc(pos)}</span></td>
            <td style="text-align:left">${esc(ru)}</td>
            <td style="text-align:left" class="muted">${esc(ex)}</td>
            <td><input type="checkbox" data-w="${esc(w)}" ${known.has(w) ? "checked" : ""}></td></tr>`).join("");
      };
      $("#vSearch").oninput = render;
      $("#vTable").addEventListener("change", (e) => {
        const w = e.target.dataset.w;
        if (!w) return;
        e.target.checked ? known.add(w) : known.delete(w);
        saveKnown();
      });
      render();
      return;
    }

    wrap.innerHTML = `
      <div class="card">
        <div class="row" style="justify-content:space-between">
          <label class="small"><input type="checkbox" id="vOnlyNew" checked> Показывать только невыученные</label>
          <span class="small muted" id="vStat"></span>
        </div>
        <div class="progress"><div id="vBar"></div></div>
      </div>
      <div class="flash-wrap">
        <div class="flash" id="vCard">
          <div class="flash-face flash-front"></div>
          <div class="flash-face flash-back"></div>
        </div>
        <p class="muted small" style="text-align:center">Нажмите на карточку, чтобы перевернуть</p>
        <div class="row" style="justify-content:center">
          <button class="btn secondary" id="vNo">Повторить ещё</button>
          <button class="btn" id="vYes">Знаю ✔</button>
          <button class="btn secondary" id="vSay">🔊</button>
        </div>
      </div>`;

    const cardEl = $("#vCard");
    let deck = [];
    let idx = 0;

    const stat = () => {
      $("#vStat").textContent = `Выучено: ${known.size} / ${VOCAB.length}`;
      $("#vBar").style.width = `${(known.size / VOCAB.length) * 100}%`;
    };
    const build = () => {
      const pool = $("#vOnlyNew").checked ? VOCAB.filter((v) => !known.has(v[0])) : VOCAB;
      deck = shuffle(pool);
      idx = 0;
      show();
    };
    const show = () => {
      stat();
      cardEl.classList.remove("flipped");
      const front = $(".flash-front", cardEl);
      const back = $(".flash-back", cardEl);
      if (!deck.length) {
        front.innerHTML = `<div class="word">🎉</div><p>Все слова выучены! Снимите галочку «только невыученные», чтобы повторить.</p>`;
        back.innerHTML = "";
        return;
      }
      const [w, pos, ru, ex] = deck[idx % deck.length];
      front.innerHTML = `<div class="word">${esc(w)}</div><div class="pos">${esc(pos)}</div>`;
      back.innerHTML = `<div class="ru">${esc(ru)}</div><div class="ex">“${esc(ex)}”</div>`;
    };
    cardEl.onclick = () => cardEl.classList.toggle("flipped");
    $("#vYes").onclick = () => {
      if (!deck.length) return;
      known.add(deck[idx % deck.length][0]);
      saveKnown();
      if ($("#vOnlyNew").checked) deck.splice(idx % deck.length, 1); else idx++;
      show();
    };
    $("#vNo").onclick = () => { if (!deck.length) return; idx++; show(); };
    $("#vSay").onclick = () => { if (deck.length) speak(deck[idx % deck.length][0]); };
    $("#vOnlyNew").onchange = build;
    build();
  };

  pages.calc = () => {
    const bandOpts = Array.from({ length: 19 }, (_, i) => 9 - i * 0.5).map((b) => `<option value="${b}" ${b === 6 ? "selected" : ""}>${b.toFixed(1)}</option>`).join("");
    app.innerHTML = `
      <h1>Калькулятор IELTS</h1>
      <p class="lead">Введите количество правильных ответов (из 40) для Listening и Reading и ваши оценки за Writing и Speaking.</p>
      <div class="card">
        <div class="calc-grid">
          <div><label>Модуль</label><select id="cModule"><option value="academic">Academic</option><option value="general">General Training</option></select></div>
          <div><label>Listening (из 40)</label><input id="cL" type="number" min="0" max="40" value="30"></div>
          <div><label>Reading (из 40)</label><input id="cR" type="number" min="0" max="40" value="30"></div>
          <div><label>Writing (band)</label><select id="cW">${bandOpts}</select></div>
          <div><label>Speaking (band)</label><select id="cS">${bandOpts}</select></div>
        </div>
      </div>
      <div class="card row" style="gap:32px">
        <div><div class="muted small">Overall Band</div><div class="band-out" id="cOut"></div></div>
        <div id="cDetail"></div>
      </div>
      <div class="card">
        <h3>Как считается итоговый балл</h3>
        <p>Overall — среднее арифметическое четырёх оценок, округлённое до ближайшей половины балла. Если среднее заканчивается на .25 — округляется вверх до .5, если на .75 — вверх до целого.</p>
        <p class="muted small">Например: (6.5 + 6.5 + 5.5 + 6.0) / 4 = 6.125 → 6.0; (7 + 6.5 + 6 + 6.5) / 4 = 6.5; (6 + 6.5 + 6 + 6.5) / 4 = 6.25 → 6.5.</p>
      </div>`;

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

  /* ---------- Router ---------- */
  function route() {
    runCleanups();
    const [name, param] = (location.hash.slice(1) || "home").split("/");
    const page = pages[name] ? name : "home";
    pages[page](param);
    $$("nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === page));
    $("#nav").classList.remove("open");
    $("#menuBtn").setAttribute("aria-expanded", "false");
    window.scrollTo(0, 0);
  }

  $("#menuBtn").onclick = () => {
    const open = $("#nav").classList.toggle("open");
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  };
  window.addEventListener("hashchange", route);
  route();
})();
