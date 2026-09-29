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
    const essays = Object.keys(store.get("drafts", {})).length;
    const srs = loadSrs();
    const topics = vocabTopics().filter((t) => t.words.length);
    const words = topics.flatMap((t) => t.words);
    const vs = topicStats(words, srs);
    const bestRow = (key, label) => {
      const b = best[key];
      return `<li><span>${label}</span>${b ? `<b>${b.score}/${b.total}</b>` : '<span class="muted small">ещё не решали</span>'}</li>`;
    };

    app.innerHTML = `
      <section class="hero">
        <div class="hero-text">
          <span class="hero-kicker">Academic · General Training</span>
          <h1>Подготовка к IELTS без стресса</h1>
          <p>Практика всех четырёх частей экзамена: таймеры как на настоящем тесте, автопроверка ответов, тренажёр слов по темам и калькулятор итогового балла.</p>
          <div class="row">
            <a class="btn light" href="#reading">Начать с Reading</a>
            <a class="btn outline-light" href="#vocab">Учить слова</a>
          </div>
        </div>
        <div class="hero-stats">
          <div><b>${words.length}</b><span>слов по темам</span></div>
          <div><b>4</b><span>части экзамена</span></div>
          <div><b>${vs.learned}</b><span>вы уже выучили</span></div>
        </div>
      </section>

      <div class="grid tiles">
        <a class="card tile" href="#reading"><div class="icon c1">📖</div><h3>Reading</h3><p>Академические тексты, TRUE/FALSE/NOT GIVEN, выбор ответа, пропуски. 20 минут на текст.</p></a>
        <a class="card tile" href="#listening"><div class="icon c2">🎧</div><h3>Listening</h3><p>Диалоги и монологи с озвучкой. Можно слушать только один раз — как на экзамене.</p></a>
        <a class="card tile" href="#writing"><div class="icon c3">✍️</div><h3>Writing</h3><p>Task 1 и Task 2 с таймером, счётчиком слов, полезными фразами и чек-листом.</p></a>
        <a class="card tile" href="#speaking"><div class="icon c4">🗣️</div><h3>Speaking</h3><p>Part 1, карточки Part 2 с таймером подготовки, Part 3 и запись своего ответа.</p></a>
        <a class="card tile" href="#vocab"><div class="icon c5">🃏</div><h3>Тренажёр слов</h3><p>Карточки с интервальным повторением, тест, ${topics.length} тем и свои слова.</p></a>
        <a class="card tile" href="#calc"><div class="icon c6">🧮</div><h3>Калькулятор</h3><p>Перевод сырых баллов в band и расчёт итоговой оценки Overall.</p></a>
      </div>

      <h2>Ваш прогресс</h2>
      <div class="grid">
        <div class="card">
          <h3>Лучшие результаты</h3>
          <ul class="best-list">
            ${READING.map((r) => bestRow("reading:" + r.id, "Reading — " + esc(r.title))).join("")}
            ${LISTENING.map((l) => bestRow("listening:" + l.id, "Listening — " + esc(l.title))).join("")}
          </ul>
          <p class="muted small">Сохранённых черновиков эссе: <b>${essays}</b></p>
        </div>
        <div class="card">
          <div class="row between"><h3>Словарь</h3><a class="small" href="#vocab/topics">Подробнее →</a></div>
          <p>Выучено <b>${vs.learned}</b> из ${vs.total} слов</p>
          ${topics.map((t) => {
            const s = topicStats(t.words, srs);
            const pct = Math.round((s.learned / s.total) * 100);
            return `<div class="mini-bar"><span>${t.icon} ${esc(t.name)}</span><div class="progress"><div style="width:${pct}%"></div></div><span class="muted small">${s.learned}/${s.total}</span></div>`;
          }).join("")}
        </div>
      </div>

      <h2>Формат экзамена</h2>
      <div class="card table-wrap">
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

  /* ---------- Тренажёр слов ---------- */
  // Простое интервальное повторение (система Лейтнера): у каждого слова есть «коробка» 0–6.
  // 0 — новое, 1 — не знаю, чем выше коробка, тем реже слово показывается. С коробки 3 слово считается выученным.
  const LEARNED_BOX = 3;
  const MAX_BOX = 6;
  const MIN = 60 * 1000;
  const DAY = 24 * 60 * MIN;
  const INTERVALS = [0, MIN, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 21 * DAY];
  const SESSION_SIZE = 20;
  const QUIZ_SIZE = 10;

  function vocabTopics() {
    const topics = WORD_TOPICS.map((t) => ({
      ...t,
      words: t.words.map(([w, ipa, ru, ex]) => ({ id: w.toLowerCase(), w, ipa, ru, ex, topic: t.id }))
    }));
    const custom = store.get("customWords", []);
    topics.push({ id: "custom", name: "My words", ru: "Мои слова", icon: "⭐", words: custom.map((c) => ({ ...c, topic: "custom" })) });
    return topics;
  }

  function loadSrs() {
    const srs = store.get("srs", {});
    // Перенос прогресса из старой версии словаря (список выученных слов).
    if (!store.get("srsMigrated", false)) {
      store.get("vocabKnown", []).forEach((w) => {
        const id = w.toLowerCase();
        if (!srs[id]) srs[id] = { box: LEARNED_BOX, due: Date.now() + DAY };
      });
      store.set("srs", srs);
      store.set("srsMigrated", true);
    }
    return srs;
  }

  const wordState = (srs, id) => srs[id] || { box: 0, due: 0 };
  const isLearned = (srs, id) => wordState(srs, id).box >= LEARNED_BOX;

  function recordAnswer(srs, id, knew, { fromQuiz = false } = {}) {
    const now = Date.now();
    const st = { ...wordState(srs, id) };
    if (knew) {
      // Новое слово, которое уже знаешь, сразу уходит в «выученные»; в тесте угадать проще, поэтому скромнее.
      if (st.box === 0) st.box = fromQuiz ? 2 : LEARNED_BOX;
      else if (st.due <= now) st.box = Math.min(MAX_BOX, st.box + 1);
      st.due = now + INTERVALS[st.box];
    } else {
      st.box = 1;
      st.due = now;
    }
    srs[id] = st;
    store.set("srs", srs);
  }

  function topicStats(words, srs) {
    let learned = 0, learning = 0;
    words.forEach((w) => {
      const b = wordState(srs, w.id).box;
      if (b >= LEARNED_BOX) learned++;
      else if (b > 0) learning++;
    });
    return { total: words.length, learned, learning };
  }

  // Слова, которые знаешь хуже, выпадают чаще.
  function weightedSample(words, srs, n) {
    const pool = words.map((w) => ({ w, weight: MAX_BOX + 1 - wordState(srs, w.id).box }));
    const out = [];
    while (out.length < n && pool.length) {
      let r = Math.random() * pool.reduce((s, p) => s + p.weight, 0);
      let i = 0;
      while ((r -= pool[i].weight) > 0) i++;
      out.push(pool.splice(i, 1)[0].w);
    }
    return out;
  }

  function whenText(ms) {
    const diff = ms - Date.now();
    if (diff < MIN) return "через минуту";
    if (diff < 60 * MIN) return `через ${Math.ceil(diff / MIN)} мин`;
    if (diff < DAY) return `через ${Math.ceil(diff / (60 * MIN))} ч`;
    return `через ${Math.ceil(diff / DAY)} дн`;
  }

  function statusBadge(srs, id) {
    const b = wordState(srs, id).box;
    if (b >= LEARNED_BOX) return '<span class="badge ok">выучено</span>';
    if (b > 0) return '<span class="badge warn">изучаю</span>';
    return '<span class="badge">новое</span>';
  }

  pages.vocab = (param) => {
    const mode = ["cards", "quiz", "topics", "add"].includes(param) ? param : "cards";
    const srs = loadSrs();
    const topics = vocabTopics();
    const allWords = topics.flatMap((t) => t.words);
    let topicId = store.get("vocabTopic", "all");
    if (topicId !== "all" && !topics.some((t) => t.id === topicId && t.words.length)) topicId = "all";

    app.innerHTML = `
      <h1>Тренажёр слов</h1>
      <p class="lead">${allWords.length} слов по темам IELTS с транскрипцией и примерами. Слова, которые вы не знаете, повторяются чаще.</p>`;
    app.appendChild(tabs([
      { id: "cards", label: "🃏 Карточки" },
      { id: "quiz", label: "✅ Тест" },
      { id: "topics", label: "📊 Темы и прогресс" },
      { id: "add", label: "➕ Мои слова" }
    ], mode, (id) => { location.hash = "vocab/" + id; }));

    const wrap = document.createElement("div");
    wrap.className = "fade-in";
    app.appendChild(wrap);

    const topicWords = () => (topicId === "all" ? allWords : topics.find((t) => t.id === topicId).words);

    const topicPicker = (onChange) => {
      const el = document.createElement("div");
      el.className = "chips";
      const items = [{ id: "all", icon: "🌐", name: "Все темы" }, ...topics.filter((t) => t.words.length)];
      el.innerHTML = items.map((t) =>
        `<button class="chip ${t.id === topicId ? "active" : ""}" data-id="${t.id}">${t.icon} ${esc(t.name)}</button>`).join("");
      el.addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        topicId = b.dataset.id;
        store.set("vocabTopic", topicId);
        $$(".chip", el).forEach((c) => c.classList.toggle("active", c === b));
        onChange();
      });
      return el;
    };

    const onKey = (handler) => {
      const h = (e) => {
        if (e.target.closest("input, textarea, select")) return;
        // Пробел и Enter на кнопке браузер и так превращает в клик.
        if ((e.key === " " || e.key === "Enter") && e.target.closest("button, a")) return;
        handler(e);
      };
      document.addEventListener("keydown", h);
      onLeave(() => document.removeEventListener("keydown", h));
    };

    if (mode === "cards") renderCards();
    else if (mode === "quiz") renderQuiz();
    else if (mode === "topics") renderTopics();
    else renderAdd();

    function renderCards() {
      const body = document.createElement("div");
      wrap.append(topicPicker(start), body);
      let queue = [];
      let done = 0;
      let flipped = false;

      function start(practice = false) {
        const words = topicWords();
        const now = Date.now();
        if (practice) {
          queue = weightedSample(words, srs, SESSION_SIZE);
        } else {
          const due = words.filter((w) => { const s = wordState(srs, w.id); return s.box > 0 && s.due <= now; })
            .sort((a, b) => wordState(srs, a.id).box - wordState(srs, b.id).box);
          const fresh = shuffle(words.filter((w) => wordState(srs, w.id).box === 0));
          queue = [...due, ...fresh].slice(0, SESSION_SIZE);
        }
        done = 0;
        show();
      }

      function show() {
        const words = topicWords();
        const st = topicStats(words, srs);
        const pct = st.total ? Math.round((st.learned / st.total) * 100) : 0;
        const head = `
          <div class="card stat-row">
            <div><div class="stat-num">${st.learned}<span>/${st.total}</span></div><div class="muted small">выучено</div></div>
            <div><div class="stat-num">${st.learning}</div><div class="muted small">изучаю</div></div>
            <div><div class="stat-num">${queue.length}</div><div class="muted small">осталось в сессии</div></div>
            <div class="stat-bar"><div class="progress"><div style="width:${pct}%"></div></div><div class="muted small">${pct}% темы</div></div>
          </div>`;

        if (!queue.length) {
          const next = words.map((w) => wordState(srs, w.id)).filter((s) => s.box > 0).map((s) => s.due).sort((a, b) => a - b)[0];
          body.innerHTML = head + `
            <div class="card empty-state">
              <div class="big-emoji">🎉</div>
              <h3>${done ? `Сессия окончена: повторено ${done} слов` : "Все слова на сегодня повторены"}</h3>
              <p class="muted">${next ? `Следующее повторение ${whenText(next)}.` : "Выберите другую тему или потренируйтесь ещё."}</p>
              <div class="row center">
                <button class="btn" id="vAgain">Тренироваться ещё</button>
                <a class="btn secondary" href="#vocab/quiz">Пройти тест</a>
              </div>
            </div>`;
          $("#vAgain").onclick = () => start(true);
          return;
        }

        const w = queue[0];
        const topic = topics.find((t) => t.id === w.topic);
        flipped = false;
        body.innerHTML = head + `
          <div class="flash-wrap">
            <div class="flash" id="vCard" tabindex="0" role="button" aria-label="Перевернуть карточку">
              <div class="flash-face flash-front">
                <span class="badge">${topic.icon} ${esc(topic.name)}</span>
                <div class="word">${esc(w.w)}</div>
                <div class="muted small">нажмите, чтобы увидеть перевод</div>
              </div>
              <div class="flash-face flash-back">
                <div class="word sm">${esc(w.w)}</div>
                ${w.ipa ? `<div class="ipa">${esc(w.ipa)}</div>` : ""}
                <div class="ru">${esc(w.ru)}</div>
                ${w.ex ? `<div class="ex">“${esc(w.ex)}”</div>` : ""}
              </div>
            </div>
            <div class="row center card-actions">
              <button class="btn danger" id="vNo">✗ Не знаю</button>
              <button class="btn icon-btn secondary" id="vSay" title="Произнести">🔊</button>
              <button class="btn success" id="vYes">✓ Знаю</button>
            </div>
            <p class="muted small center">Пробел — перевернуть · ← не знаю · → знаю</p>
          </div>`;
        const card = $("#vCard");
        card.onclick = flip;
        $("#vSay").onclick = () => speak(w.w);
        $("#vYes").onclick = () => answer(true);
        $("#vNo").onclick = () => answer(false);
      }

      function flip() {
        flipped = !flipped;
        $("#vCard").classList.toggle("flipped", flipped);
      }

      function answer(knew) {
        const w = queue.shift();
        recordAnswer(srs, w.id, knew);
        if (knew) done++;
        // Незнакомое слово возвращается через пару карточек.
        else queue.splice(Math.min(3, queue.length), 0, w);
        show();
      }

      onKey((e) => {
        if (!queue.length || !$("#vCard")) return;
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
        else if (e.key === "ArrowRight") answer(true);
        else if (e.key === "ArrowLeft") answer(false);
      });
      start();
    }

    function renderQuiz() {
      const body = document.createElement("div");
      wrap.append(topicPicker(start), body);
      let questions = [];
      let qi = 0;
      let score = 0;
      let mistakes = [];
      let answered = false;

      function start() {
        const words = topicWords();
        if (words.length < 2) {
          body.innerHTML = `<div class="card empty-state"><p>В этой теме слишком мало слов для теста.</p></div>`;
          return;
        }
        questions = weightedSample(words, srs, QUIZ_SIZE).map((w) => {
          // Варианты берём из той же темы, чтобы было сложнее; если слов мало — из всех.
          const source = words.length >= 4 ? words : allWords;
          const wrong = shuffle(source.filter((o) => o.ru !== w.ru)).reduce((acc, o) => {
            if (acc.length < 3 && !acc.includes(o.ru)) acc.push(o.ru);
            return acc;
          }, []);
          return { w, options: shuffle([w.ru, ...wrong]) };
        });
        qi = 0; score = 0; mistakes = [];
        show();
      }

      function show() {
        if (qi >= questions.length) return finish();
        answered = false;
        const { w, options } = questions[qi];
        body.innerHTML = `
          <div class="card quiz">
            <div class="row between">
              <span class="muted small">Вопрос ${qi + 1} из ${questions.length}</span>
              <span class="badge ok">Верно: ${score}</span>
            </div>
            <div class="progress"><div style="width:${(qi / questions.length) * 100}%"></div></div>
            <div class="quiz-word">${esc(w.w)} <button class="btn icon-btn secondary" id="qSay" title="Произнести">🔊</button></div>
            ${w.ipa ? `<div class="ipa center">${esc(w.ipa)}</div>` : ""}
            <p class="muted center">Выберите правильный перевод</p>
            <div class="options">
              ${options.map((o, i) => `<button class="option" data-i="${i}"><span class="key">${i + 1}</span>${esc(o)}</button>`).join("")}
            </div>
            <div id="qFeedback"></div>
          </div>`;
        $("#qSay").onclick = () => speak(w.w);
        $$(".option", body).forEach((b) => { b.onclick = () => choose(Number(b.dataset.i)); });
      }

      function choose(i) {
        if (answered) return;
        answered = true;
        const { w, options } = questions[qi];
        const ok = options[i] === w.ru;
        if (ok) score++; else mistakes.push(w);
        recordAnswer(srs, w.id, ok, { fromQuiz: true });
        $$(".option", body).forEach((b, k) => {
          b.disabled = true;
          if (options[k] === w.ru) b.classList.add("correct");
          else if (k === i) b.classList.add("wrong");
        });
        $("#qFeedback").innerHTML = `
          <div class="feedback ${ok ? "ok" : "bad"}">
            <b>${ok ? "Верно!" : "Неверно."}</b> ${esc(w.w)} — ${esc(w.ru)}
            ${w.ex ? `<div class="ex">“${esc(w.ex)}”</div>` : ""}
          </div>
          <div class="row center"><button class="btn" id="qNext">${qi + 1 < questions.length ? "Далее →" : "Результат"}</button></div>`;
        $("#qNext").onclick = () => { qi++; show(); };
        $("#qNext").focus();
      }

      function finish() {
        const pct = Math.round((score / questions.length) * 100);
        body.innerHTML = `
          <div class="card empty-state">
            <div class="big-emoji">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</div>
            <h3>Результат: ${score} из ${questions.length} (${pct}%)</h3>
            ${mistakes.length ? `<p class="muted">Эти слова будут показываться чаще в карточках:</p>
              <ul class="mistakes">${mistakes.map((w) => `<li><b>${esc(w.w)}</b> — ${esc(w.ru)}</li>`).join("")}</ul>` : "<p class=\"muted\">Без ошибок — отлично!</p>"}
            <div class="row center">
              <button class="btn" id="qAgain">Пройти ещё раз</button>
              <a class="btn secondary" href="#vocab/cards">К карточкам</a>
            </div>
          </div>`;
        $("#qAgain").onclick = start;
      }

      onKey((e) => {
        if (!questions.length || qi >= questions.length) return;
        if (!answered && /^[1-4]$/.test(e.key)) choose(Number(e.key) - 1);
        else if (answered && e.key === "Enter" && document.activeElement !== $("#qNext")) $("#qNext").click();
      });
      start();
    }

    function renderTopics() {
      const all = topicStats(allWords, srs);
      wrap.innerHTML = `
        <div class="card stat-row">
          <div><div class="stat-num">${all.learned}<span>/${all.total}</span></div><div class="muted small">слов выучено</div></div>
          <div><div class="stat-num">${all.learning}</div><div class="muted small">изучаю</div></div>
          <div><div class="stat-num">${all.total - all.learned - all.learning}</div><div class="muted small">новых</div></div>
          <div class="stat-bar"><div class="progress"><div style="width:${all.total ? (all.learned / all.total) * 100 : 0}%"></div></div>
            <div class="muted small">Слово считается выученным после нескольких ответов «Знаю» с перерывами.</div></div>
        </div>
        <div class="grid">
          ${topics.map((t) => {
            const s = topicStats(t.words, srs);
            const pct = s.total ? Math.round((s.learned / s.total) * 100) : 0;
            return `<div class="card topic-card">
              <div class="row between"><span class="topic-icon">${t.icon}</span><span class="muted small">${pct}%</span></div>
              <h3>${esc(t.name)}</h3>
              <p class="muted small">${esc(t.ru)} · ${s.learned} из ${s.total} выучено${s.learning ? ` · ${s.learning} изучаю` : ""}</p>
              <div class="progress"><div style="width:${pct}%"></div></div>
              ${s.total ? `<div class="row">
                <button class="btn sm" data-go="cards" data-t="${t.id}">Карточки</button>
                <button class="btn sm secondary" data-go="quiz" data-t="${t.id}">Тест</button>
                <button class="btn sm ghost" data-list="${t.id}">Слова</button>
              </div>` : '<a class="btn sm secondary" href="#vocab/add">Добавить слова</a>'}
            </div>`;
          }).join("")}
        </div>
        <div id="vList"></div>`;

      wrap.addEventListener("click", (e) => {
        const go = e.target.closest("[data-go]");
        if (go) {
          store.set("vocabTopic", go.dataset.t);
          location.hash = "vocab/" + go.dataset.go;
          return;
        }
        const lb = e.target.closest("[data-list]");
        if (!lb) return;
        const t = topics.find((x) => x.id === lb.dataset.list);
        $("#vList").innerHTML = `
          <div class="card">
            <div class="row between"><h3>${t.icon} ${esc(t.name)} — все слова</h3>
              <input id="vSearch" class="input" placeholder="Поиск…" style="max-width:220px"></div>
            <div class="table-wrap"><table class="data words-table" id="vTable"></table></div>
          </div>`;
        const renderRows = () => {
          const q = norm($("#vSearch").value);
          const rows = t.words.filter((w) => !q || w.w.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q));
          $("#vTable").innerHTML = `<tr><th>Слово</th><th>Перевод</th><th>Пример</th><th>Статус</th></tr>` +
            rows.map((w) => `<tr>
              <td><b>${esc(w.w)}</b><div class="ipa small">${esc(w.ipa || "")}</div></td>
              <td>${esc(w.ru)}</td>
              <td class="muted">${esc(w.ex || "")}</td>
              <td>${statusBadge(srs, w.id)}</td></tr>`).join("");
        };
        $("#vSearch").oninput = renderRows;
        renderRows();
        $("#vList").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    function renderAdd() {
      wrap.innerHTML = `
        <div class="card">
          <h3>Добавить своё слово</h3>
          <p class="muted small">Слова попадут в тему «⭐ My words» и будут участвовать в карточках и тестах.</p>
          <form id="addForm" class="form-grid">
            <label>Слово (англ.) *<input class="input" name="w" required maxlength="60" placeholder="e.g. resilient"></label>
            <label>Перевод *<input class="input" name="ru" required maxlength="100" placeholder="напр. стойкий, устойчивый"></label>
            <label>Транскрипция<input class="input" name="ipa" maxlength="60" placeholder="/rɪˈzɪliənt/"></label>
            <label class="wide">Пример<input class="input" name="ex" maxlength="200" placeholder="Children are often more resilient than adults."></label>
            <div class="wide row"><button class="btn" type="submit">Добавить</button><span id="addMsg" class="small"></span></div>
          </form>
        </div>
        <div class="card">
          <h3>Мои слова <span class="muted small" id="myCount"></span></h3>
          <div id="myList"></div>
        </div>`;

      const renderList = () => {
        const custom = store.get("customWords", []);
        $("#myCount").textContent = `(${custom.length})`;
        $("#myList").innerHTML = custom.length
          ? `<div class="table-wrap"><table class="data words-table"><tr><th>Слово</th><th>Перевод</th><th>Пример</th><th>Статус</th><th></th></tr>
              ${custom.map((w) => `<tr>
                <td><b>${esc(w.w)}</b><div class="ipa small">${esc(w.ipa || "")}</div></td>
                <td>${esc(w.ru)}</td><td class="muted">${esc(w.ex || "")}</td>
                <td>${statusBadge(srs, w.id)}</td>
                <td><button class="btn sm ghost" data-del="${esc(w.id)}" title="Удалить">🗑</button></td></tr>`).join("")}
            </table></div>`
          : '<p class="muted">Пока пусто. Добавьте слова, которые встретили в текстах или фильмах.</p>';
      };

      $("#addForm").onsubmit = (e) => {
        e.preventDefault();
        const f = e.target;
        const w = f.w.value.trim();
        const ru = f.ru.value.trim();
        const msg = $("#addMsg");
        if (!w || !ru) return;
        if (allWords.some((x) => x.w.toLowerCase() === w.toLowerCase()) ||
            store.get("customWords", []).some((x) => x.w.toLowerCase() === w.toLowerCase())) {
          msg.className = "small bad-text";
          msg.textContent = `Слово «${w}» уже есть в словаре.`;
          return;
        }
        const custom = store.get("customWords", []);
        custom.unshift({ id: "my:" + Date.now(), w, ru, ipa: f.ipa.value.trim(), ex: f.ex.value.trim() });
        store.set("customWords", custom);
        f.reset();
        f.w.focus();
        msg.className = "small ok-text";
        msg.textContent = `Добавлено: ${w}`;
        renderList();
      };

      $("#myList").addEventListener("click", (e) => {
        const b = e.target.closest("[data-del]");
        if (!b || !confirm("Удалить слово?")) return;
        store.set("customWords", store.get("customWords", []).filter((w) => w.id !== b.dataset.del));
        delete srs[b.dataset.del];
        store.set("srs", srs);
        renderList();
      });
      renderList();
    }
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
    app.classList.remove("page-enter");
    void app.offsetWidth; // перезапуск анимации появления
    app.classList.add("page-enter");
    $$("nav a").forEach((a) => a.classList.toggle("active", a.dataset.route === page));
    setMenu(false);
    window.scrollTo(0, 0);
  }

  function setMenu(open) {
    document.body.classList.toggle("menu-open", open);
    $("#menuBtn").setAttribute("aria-expanded", String(open));
  }
  $("#menuBtn").onclick = () => setMenu(!document.body.classList.contains("menu-open"));
  $("#navBackdrop").onclick = () => setMenu(false);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

  /* ---------- Тема ---------- */
  const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  const currentTheme = () => document.documentElement.dataset.theme || (darkQuery.matches ? "dark" : "light");
  function renderThemeBtn() {
    const dark = currentTheme() === "dark";
    const btn = $("#themeBtn");
    btn.textContent = dark ? "☀️" : "🌙";
    btn.setAttribute("aria-label", dark ? "Включить светлую тему" : "Включить тёмную тему");
    btn.title = btn.getAttribute("aria-label");
  }
  $("#themeBtn").onclick = () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    store.set("theme", next);
    renderThemeBtn();
  };
  darkQuery.addEventListener("change", renderThemeBtn);
  renderThemeBtn();

  window.addEventListener("hashchange", route);
  route();
})();
