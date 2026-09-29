/* Тренажёр слов: карточки, тест, темы и прогресс. Вкладка «Мои слова» грузится отдельно (vocab-mine.js). */
(() => {
  "use strict";
  const { app, esc, $, $$, norm, shuffle, store, tabs, bar, speak, onKey, onLeave, activity } = App;
  const V = App.vocab;

  const SESSION_SIZE = 20;
  const QUIZ_SIZE = 10;
  const PAGE_SIZE = 100;

  /* Таблица слов, которая рисуется порциями: сначала 100 строк, остальные — по кнопке или при прокрутке. */
  function pagedWordTable(container, words, srs, { deletable = false, empty = "Слов нет." } = {}) {
    if (!words.length) { container.innerHTML = `<p class="muted">${empty}</p>`; return; }
    let shown = 0;
    container.innerHTML = `
      <div class="table-wrap" tabindex="0" role="region" aria-label="Таблица"><table class="data words-table">
        <thead><tr><th scope="col">Слово</th><th scope="col">Перевод</th><th scope="col">Пример</th><th scope="col">Статус</th>${deletable ? '<th scope="col"><span class="sr-only">Действия</span></th>' : ""}</tr></thead>
        <tbody></tbody></table></div>
      <div class="row center mt"><button class="btn secondary sm more-btn">Показать ещё</button></div>`;
    const tbody = $("tbody", container);
    const more = $(".more-btn", container);
    const row = (w) => `<tr>
      <td><b lang="en">${esc(w.w)}</b>${w.ipa ? `<div class="ipa small">${esc(w.ipa)}</div>` : ""}</td>
      <td>${esc(w.ru)}</td>
      <td class="muted" lang="en">${esc(w.ex || "")}</td>
      <td>${V.statusBadge(srs, w.id)}</td>
      ${deletable ? `<td><button class="btn sm ghost" data-del="${esc(w.id)}" aria-label="Удалить ${esc(w.w)}">🗑</button></td>` : ""}</tr>`;
    const renderMore = () => {
      const next = words.slice(shown, shown + PAGE_SIZE);
      tbody.insertAdjacentHTML("beforeend", next.map(row).join(""));
      shown += next.length;
      more.hidden = shown >= words.length;
      more.textContent = `Показать ещё (${words.length - shown})`;
    };
    more.onclick = renderMore;
    // Подгружаем автоматически, когда кнопка появляется на экране.
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver((entries) => { if (entries[0].isIntersecting && !more.hidden) renderMore(); }, { rootMargin: "300px" });
      io.observe(more);
      onLeave(() => io.disconnect());
    }
    renderMore();
  }

  App.vocabUI = { pagedWordTable };

  App.pages.vocab = (param) => {
    const mode = ["cards", "quiz", "topics", "add"].includes(param) ? param : "cards";
    const srs = V.loadSrs();
    const topics = V.topics();
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
    ], mode, "vocab", "Режимы тренажёра"));

    const wrap = document.createElement("div");
    app.appendChild(wrap);

    const topicWords = () => (topicId === "all" ? allWords : topics.find((t) => t.id === topicId).words);

    const topicPicker = (onChange) => {
      const el = document.createElement("div");
      el.className = "chips";
      el.setAttribute("role", "group");
      el.setAttribute("aria-label", "Тема");
      const items = [{ id: "all", icon: "🌐", name: "Все темы" }, ...topics.filter((t) => t.words.length)];
      el.innerHTML = items.map((t) =>
        `<button class="chip${t.id === topicId ? " active" : ""}" data-id="${esc(t.id)}" aria-pressed="${t.id === topicId}">${t.icon} ${esc(t.name)}</button>`).join("");
      el.addEventListener("click", (e) => {
        const b = e.target.closest(".chip");
        if (!b) return;
        topicId = b.dataset.id;
        store.set("vocabTopic", topicId);
        $$(".chip", el).forEach((c) => { c.classList.toggle("active", c === b); c.setAttribute("aria-pressed", String(c === b)); });
        onChange();
      });
      return el;
    };

    if (mode === "cards") renderCards();
    else if (mode === "quiz") renderQuiz();
    else if (mode === "topics") renderTopics();
    else renderMine();

    function statRow(words, extra) {
      const st = V.stats(words, srs);
      const pct = st.total ? Math.round((st.learned / st.total) * 100) : 0;
      return `
        <div class="card stat-row">
          <div><div class="stat-num">${st.learned}<span>/${st.total}</span></div><div class="muted small">выучено</div></div>
          <div><div class="stat-num">${st.learning}</div><div class="muted small">изучаю</div></div>
          ${extra}
          <div class="stat-bar">${bar(pct, "Прогресс темы")}<div class="muted small">${pct}% ${topicId === "all" ? "всех слов" : "темы"}</div></div>
        </div>`;
    }

    function renderCards() {
      const body = document.createElement("div");
      wrap.append(topicPicker(() => start()), body);
      let queue = [];
      let done = 0;
      let flipped = false;

      function start(practice = false) {
        const words = topicWords();
        const now = Date.now();
        if (practice) {
          queue = V.weightedSample(words, srs, SESSION_SIZE);
        } else {
          const due = words.filter((w) => { const s = V.wordState(srs, w.id); return s.box > 0 && s.due <= now; })
            .sort((a, b) => V.wordState(srs, a.id).box - V.wordState(srs, b.id).box);
          const fresh = words.filter((w) => V.wordState(srs, w.id).box === 0);
          queue = [...due, ...shuffle(fresh).slice(0, SESSION_SIZE)].slice(0, SESSION_SIZE);
        }
        done = 0;
        show();
      }

      function show() {
        const words = topicWords();
        const head = statRow(words, `<div><div class="stat-num">${queue.length}</div><div class="muted small">осталось в сессии</div></div>`);

        if (!queue.length) {
          const next = words.map((w) => V.wordState(srs, w.id)).filter((s) => s.box > 0).reduce((m, s) => Math.min(m, s.due), Infinity);
          body.innerHTML = head + `
            <div class="card empty-state">
              <div class="big-emoji" aria-hidden="true">🎉</div>
              <h2 class="card-title">${done ? `Сессия окончена: повторено ${done} слов` : "Все слова на сегодня повторены"}</h2>
              <p class="muted">${next !== Infinity ? `Следующее повторение ${V.whenText(next)}.` : "Выберите другую тему или потренируйтесь ещё."}</p>
              <div class="row center">
                <button class="btn" id="vAgain">Тренироваться ещё</button>
                <a class="btn secondary" href="#vocab/quiz">Пройти тест</a>
              </div>
            </div>`;
          $("#vAgain").onclick = () => start(true);
          return;
        }

        const hadFocus = body.contains(document.activeElement);
        const w = queue[0];
        const topic = topics.find((t) => t.id === w.topic) || topics[0];
        flipped = false;
        body.innerHTML = head + `
          <div class="flash-wrap">
            <div class="flash" id="vCard" tabindex="0" role="button" aria-describedby="vHint">
              <div class="flash-face flash-front">
                <span class="badge">${topic.icon} ${esc(topic.name)}</span>
                <div class="word" lang="en">${esc(w.w)}</div>
                <div class="muted small">нажмите, чтобы увидеть перевод</div>
              </div>
              <div class="flash-face flash-back" aria-hidden="true">
                <div class="word sm" lang="en">${esc(w.w)}</div>
                ${w.ipa ? `<div class="ipa">${esc(w.ipa)}</div>` : ""}
                <div class="ru">${esc(w.ru)}</div>
                ${w.ex ? `<div class="ex" lang="en">“${esc(w.ex)}”</div>` : ""}
              </div>
            </div>
            <div class="row center card-actions">
              <button class="btn danger" id="vNo">✗ Не знаю</button>
              <button class="btn icon-btn secondary" id="vSay" aria-label="Произнести слово" title="Произнести">🔊</button>
              <button class="btn success" id="vYes">✓ Знаю</button>
            </div>
            <p class="muted small center" id="vHint"><kbd>Пробел</kbd> — перевернуть · <kbd>←</kbd> не знаю · <kbd>→</kbd> знаю</p>
          </div>`;
        const card = $("#vCard");
        card.onclick = flip;
        card.onkeydown = (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); } };
        $("#vSay").onclick = () => speak(w.w);
        $("#vYes").onclick = () => answer(true);
        $("#vNo").onclick = () => answer(false);
        if (hadFocus) card.focus();
      }

      function flip() {
        flipped = !flipped;
        const card = $("#vCard");
        card.classList.toggle("flipped", flipped);
        $(".flash-front", card).setAttribute("aria-hidden", String(flipped));
        $(".flash-back", card).setAttribute("aria-hidden", String(!flipped));
      }

      function answer(knew) {
        const w = queue.shift();
        V.recordAnswer(srs, w.id, knew);
        if (knew) activity.word(w.id);
        if (knew) done++;
        // Незнакомое слово возвращается через пару карточек.
        else queue.splice(Math.min(3, queue.length), 0, w);
        show();
      }

      onKey((e) => {
        if (!queue.length || !$("#vCard")) return;
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); flip(); }
        else if (e.key === "ArrowRight") { e.preventDefault(); answer(true); }
        else if (e.key === "ArrowLeft") { e.preventDefault(); answer(false); }
      });
      start();
    }

    function renderQuiz() {
      const body = document.createElement("div");
      wrap.append(topicPicker(() => start()), body);
      let questions = [];
      let qi = 0;
      let score = 0;
      let mistakes = [];
      let answered = false;

      function start() {
        const words = topicWords();
        if (words.length < 2) {
          body.innerHTML = '<div class="card empty-state"><p>В этой теме слишком мало слов для теста.</p></div>';
          return;
        }
        // Варианты берём из той же темы, чтобы было сложнее; если слов мало — из всех.
        const source = words.length >= 4 ? words : allWords;
        questions = V.weightedSample(words, srs, QUIZ_SIZE).map((w) => {
          const wrong = [];
          for (const o of shuffle(source)) {
            if (wrong.length === 3) break;
            if (o.ru !== w.ru && !wrong.includes(o.ru)) wrong.push(o.ru);
          }
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
            ${bar((qi / questions.length) * 100, "Прогресс теста")}
            <div class="quiz-word"><span lang="en" id="qWord">${esc(w.w)}</span> <button class="btn icon-btn secondary" id="qSay" aria-label="Произнести слово">🔊</button></div>
            ${w.ipa ? `<div class="ipa center">${esc(w.ipa)}</div>` : ""}
            <p class="muted center" id="qHint">Выберите правильный перевод</p>
            <div class="options" role="group" aria-labelledby="qWord qHint">
              ${options.map((o, i) => `<button class="option" data-i="${i}"><span class="key" aria-hidden="true">${i + 1}</span>${esc(o)}</button>`).join("")}
            </div>
            <div id="qFeedback" aria-live="polite"></div>
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
        V.recordAnswer(srs, w.id, ok, { fromQuiz: true });
        if (ok) activity.word(w.id);
        $$(".option", body).forEach((b, k) => {
          b.disabled = true;
          if (options[k] === w.ru) b.classList.add("correct");
          else if (k === i) b.classList.add("wrong");
        });
        $("#qFeedback").innerHTML = `
          <div class="feedback ${ok ? "ok" : "bad"}">
            <b>${ok ? "Верно!" : "Неверно."}</b> <span lang="en">${esc(w.w)}</span> — ${esc(w.ru)}
            ${w.ex ? `<div class="ex" lang="en">“${esc(w.ex)}”</div>` : ""}
          </div>
          <div class="row center"><button class="btn" id="qNext">${qi + 1 < questions.length ? "Далее →" : "Результат"}</button></div>`;
        $("#qNext").onclick = () => { qi++; show(); };
        $("#qNext").focus();
      }

      function finish() {
        activity.task("vocab-quiz");
        const pct = Math.round((score / questions.length) * 100);
        body.innerHTML = `
          <div class="card empty-state">
            <div class="big-emoji" aria-hidden="true">${pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</div>
            <h2 class="card-title">Результат: ${score} из ${questions.length} (${pct}%)</h2>
            ${mistakes.length ? `<p class="muted">Эти слова будут показываться чаще в карточках:</p>
              <ul class="mistakes">${mistakes.map((w) => `<li><b lang="en">${esc(w.w)}</b> — ${esc(w.ru)}</li>`).join("")}</ul>` : '<p class="muted">Без ошибок — отлично!</p>'}
            <div class="row center">
              <button class="btn" id="qAgain">Пройти ещё раз</button>
              <a class="btn secondary" href="#vocab/cards">К карточкам</a>
            </div>
          </div>`;
        $("#qAgain").onclick = start;
        $("#qAgain").focus();
      }

      onKey((e) => {
        if (!questions.length || qi >= questions.length) return;
        if (!answered && /^[1-4]$/.test(e.key)) choose(Number(e.key) - 1);
        else if (answered && e.key === "Enter") $("#qNext").click();
      });
      start();
    }

    function renderTopics() {
      const all = V.stats(allWords, srs);
      wrap.innerHTML = `
        <div class="card stat-row">
          <div><div class="stat-num">${all.learned}<span>/${all.total}</span></div><div class="muted small">слов выучено</div></div>
          <div><div class="stat-num">${all.learning}</div><div class="muted small">изучаю</div></div>
          <div><div class="stat-num">${all.total - all.learned - all.learning}</div><div class="muted small">новых</div></div>
          <div class="stat-bar">${bar(all.total ? (all.learned / all.total) * 100 : 0, "Всего выучено")}
            <div class="muted small">Слово считается выученным после нескольких ответов «Знаю» с перерывами.</div></div>
        </div>
        <div class="grid">
          ${topics.map((t) => {
            const s = V.stats(t.words, srs);
            const pct = s.total ? Math.round((s.learned / s.total) * 100) : 0;
            return `<section class="card topic-card">
              <div class="row between"><span class="topic-icon" aria-hidden="true">${t.icon}</span><span class="muted small">${pct}%</span></div>
              <h2 class="card-title">${esc(t.name)}</h2>
              <p class="muted small">${esc(t.ru)} · ${s.learned} из ${s.total} выучено${s.learning ? ` · ${s.learning} изучаю` : ""}</p>
              ${bar(pct, "Прогресс темы " + t.name)}
              ${s.total ? `<div class="row">
                <button class="btn sm" data-go="cards" data-t="${esc(t.id)}">Карточки</button>
                <button class="btn sm secondary" data-go="quiz" data-t="${esc(t.id)}">Тест</button>
                <button class="btn sm ghost" data-list="${esc(t.id)}">Слова</button>
              </div>` : '<a class="btn sm secondary" href="#vocab/add">Добавить слова</a>'}
            </section>`;
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
          <section class="card">
            <div class="row between"><h2 class="card-title">${t.icon} ${esc(t.name)} — все слова</h2>
              <input id="vSearch" class="input search" type="search" placeholder="Поиск…" aria-label="Поиск по словам темы"></div>
            <div id="vTable"></div>
          </section>`;
        const renderRows = () => {
          const q = norm($("#vSearch").value);
          const rows = q ? t.words.filter((w) => w.w.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q)) : t.words;
          pagedWordTable($("#vTable"), rows, srs, { empty: "Ничего не найдено." });
        };
        let tm;
        $("#vSearch").oninput = () => { clearTimeout(tm); tm = setTimeout(renderRows, 150); };
        renderRows();
        $("#vList").scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }

    // Вкладка «Мои слова» с импортом тяжелее остальных — её код грузим только при открытии.
    function renderMine() {
      wrap.innerHTML = '<div class="loading" role="status">Загрузка…</div>';
      const s = document.createElement("script");
      if (App.vocabMine) return App.vocabMine(wrap, { srs, topics });
      s.src = "js/pages/vocab-mine.js?v=4";
      s.onload = () => App.vocabMine(wrap, { srs, topics });
      s.onerror = () => { wrap.innerHTML = '<div class="card" role="alert">Не удалось загрузить раздел. Проверьте интернет и обновите страницу.</div>'; };
      document.head.appendChild(s);
    }
  };
})();
