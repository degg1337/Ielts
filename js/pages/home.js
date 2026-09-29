/* Главная страница: разделы, прогресс, формат экзамена. */
(() => {
  "use strict";
  const { app, esc, $, store, bar, activity, dayKey } = App;
  const V = App.vocab;
  const P = App.plan;
  const MONTHS = ["янв", "фев", "мар", "апр", "май", "июн", "июл", "авг", "сен", "окт", "ноя", "дек"];
  const WEEKS = 26; // полгода активности

  const plural = (n, one, few, many) => {
    const a = n % 10, b = n % 100;
    return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many;
  };

  // Уровень активности дня для сетки: 0 — не засчитан, 1–4 — чем больше сделано, тем темнее.
  function level(e) {
    if (!activity.isActive(e)) return e && (e.t || e.w) ? 0.5 : 0;
    const score = (e.t || 0) + (e.w || 0) / activity.WORDS_FOR_DAY;
    return score <= 1 ? 1 : score <= 3 ? 2 : score <= 6 ? 3 : 4;
  }

  function heatmap() {
    const log = activity.log();
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const monday = (today.getDay() + 6) % 7;
    const start = new Date(today);
    start.setDate(start.getDate() - monday - (WEEKS - 1) * 7);
    let cells = "", months = "", activeDays = 0, lastMonth = -1;
    for (let w = 0; w < WEEKS; w++) {
      const weekStart = new Date(start);
      weekStart.setDate(start.getDate() + w * 7);
      const m = weekStart.getMonth();
      months += `<span style="grid-column:${w + 1}">${m !== lastMonth && weekStart.getDate() <= 7 || w === 0 ? MONTHS[m] : ""}</span>`;
      lastMonth = m;
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        if (day > today) { cells += '<i class="hm-cell hm-future"></i>'; continue; }
        const key = dayKey(day);
        const e = log[key];
        const lv = level(e);
        if (lv >= 1) activeDays++;
        const tip = `${day.getDate()} ${MONTHS[day.getMonth()]}: ${e ? `${e.t || 0} ${plural(e.t || 0, "задание", "задания", "заданий")}, ${e.w || 0} ${plural(e.w || 0, "слово", "слова", "слов")}` : "нет занятий"}`;
        cells += `<i class="hm-cell hm-${String(lv).replace(".", "")}${key === dayKey() ? " hm-today" : ""}" title="${tip}"></i>`;
      }
    }
    return `
      <div class="heatmap-scroll" tabindex="0" role="region" aria-label="Календарь активности">
        <div class="heatmap" role="img" aria-label="Активность за последние полгода: ${activeDays} ${plural(activeDays, "активный день", "активных дня", "активных дней")}">
          <div class="hm-months" aria-hidden="true">${months}</div>
          <div class="hm-days" aria-hidden="true"><span>Пн</span><span></span><span>Ср</span><span></span><span>Пт</span><span></span><span></span></div>
          <div class="hm-grid" aria-hidden="true">${cells}</div>
        </div>
      </div>
      <div class="hm-legend" aria-hidden="true">меньше <i class="hm-cell hm-0"></i><i class="hm-cell hm-1"></i><i class="hm-cell hm-2"></i><i class="hm-cell hm-3"></i><i class="hm-cell hm-4"></i> больше</div>
      <p class="muted small">${activeDays} ${plural(activeDays, "активный день", "активных дня", "активных дней")} за полгода.</p>`;
  }

  function streakCard() {
    const st = activity.streak();
    const today = activity.today();
    const need = activity.WORDS_FOR_DAY;
    const status = st.todayActive
      ? "✓ Сегодня день засчитан — так держать!"
      : st.current > 0
        ? "Позанимайтесь сегодня, чтобы не потерять серию."
        : "Сделайте одно задание или выучите 10 слов — и серия начнётся.";
    return `
      <section class="card streak-card" aria-labelledby="streakTitle">
        <div class="streak-top">
          <div class="flame${st.current ? "" : " off"}" aria-hidden="true">🔥</div>
          <div>
            <h2 class="card-title" id="streakTitle"><b class="streak-num">${st.current}</b> ${plural(st.current, "день", "дня", "дней")} подряд</h2>
            <p class="muted small">Рекорд: <b>${st.best}</b> ${plural(st.best, "день", "дня", "дней")}</p>
          </div>
        </div>
        <p class="small ${st.todayActive ? "ok-text" : ""}">${status}</p>
        <div class="today-progress">
          <div><span class="small">Задания сегодня</span><b>${today.t || 0}</b></div>
          <div><span class="small">Слова сегодня</span><b>${Math.min(today.w || 0, 999)}/${need}</b>${bar(Math.min(100, ((today.w || 0) / need) * 100), "Слова сегодня")}</div>
        </div>
        ${heatmap()}
      </section>`;
  }

  function todayCard() {
    const tasks = P.forDate(dayKey());
    const left = P.daysLeft();
    const exam = left === null
      ? '<p class="small"><a href="#plan">Укажите дату экзамена</a>, чтобы видеть обратный отсчёт.</p>'
      : left > 0
        ? `<div class="countdown"><b>${left}</b><span>${plural(left, "день", "дня", "дней")} до экзамена</span></div>`
        : left === 0 ? '<div class="countdown"><b>🎯</b><span>Экзамен сегодня. Удачи!</span></div>'
          : '<p class="small muted">Дата экзамена прошла. <a href="#plan">Обновите её</a> в расписании.</p>';
    return `
      <section class="card today-card" aria-labelledby="todayTitle">
        <div class="row between"><h2 class="card-title" id="todayTitle">Сегодня</h2><a class="small" href="#plan">Расписание →</a></div>
        ${exam}
        ${tasks.length ? `<ul class="task-list" id="homeTasks">${tasks.map((t) => {
          const sec = P.section(t.section);
          return `<li class="task pc-${t.color}${t.done ? " done" : ""}"><label><input type="checkbox" data-id="${esc(t.id)}"${t.done ? " checked" : ""}> <span>${sec.icon} ${esc(t.text)}</span></label></li>`;
        }).join("")}</ul>` : '<p class="muted small">На сегодня задач нет. <a href="#plan">Запланируйте занятия</a>.</p>'}
      </section>`;
  }

  App.pages.home = () => {
    const best = store.get("best", {});
    const essays = Object.keys(store.get("drafts", {})).length;
    const srs = V.loadSrs();
    const topics = V.topics().filter((t) => t.words.length);
    const words = topics.flatMap((t) => t.words);
    const vs = V.stats(words, srs);
    const examRow = () => {
      const hist = store.get("examHistory", []);
      const top = hist.reduce((m, h) => (h.overall !== null && (!m || h.overall > m.overall) ? h : m), null);
      return `<li><span>Пробный экзамен — Overall</span>${top ? `<a href="#exam/result/${esc(top.id)}"><b>${top.overall.toFixed(1)}</b></a>` : '<span class="muted small">ещё не сдавали</span>'}</li>`;
    };
    const bestRow = (key, label) => {
      const b = best[key];
      return `<li><span>${esc(label)}</span>${b ? `<b>${b.score}/${b.total}</b>` : '<span class="muted small">ещё не решали</span>'}</li>`;
    };

    app.innerHTML = `
      <section class="hero" aria-labelledby="heroTitle">
        <div class="hero-text">
          <span class="hero-kicker">Academic · General Training</span>
          <h1 id="heroTitle">Подготовка к IELTS без стресса</h1>
          <p>Практика всех четырёх частей экзамена: таймеры как на настоящем тесте, автопроверка ответов, тренажёр слов по темам и калькулятор итогового балла.</p>
          <div class="row">
            <a class="btn light" href="#listening">Пройти Listening</a>
            <a class="btn outline-light" href="#vocab">Учить слова</a>
          </div>
        </div>
        <div class="hero-stats">
          <div><b>${words.length}</b><span>слов по темам</span></div>
          <div><b>40</b><span>вопросов в Listening</span></div>
          <div><b>${vs.learned}</b><span>вы уже выучили</span></div>
        </div>
      </section>

      <div class="home-top">${streakCard()}${todayCard()}</div>

      <h2 class="sr-only">Разделы</h2>
      <div class="grid tiles">
        <a class="card tile" href="#reading"><div class="icon c1" aria-hidden="true">📖</div><h3>Reading</h3><p>Академические тексты, TRUE/FALSE/NOT GIVEN, выбор ответа, пропуски. 20 минут на текст.</p></a>
        <a class="card tile" href="#listening"><div class="icon c2" aria-hidden="true">🎧</div><h3>Listening</h3><p>4 части как на экзамене: режим «Экзамен» без паузы и перемотки и режим «Тренировка».</p></a>
        <a class="card tile" href="#writing"><div class="icon c3" aria-hidden="true">✍️</div><h3>Writing</h3><p>Task 1 и Task 2 с таймером, счётчиком слов, полезными фразами и чек-листом.</p></a>
        <a class="card tile" href="#speaking"><div class="icon c4" aria-hidden="true">🗣️</div><h3>Speaking</h3><p>Part 1, карточки Part 2 с таймером подготовки, Part 3 и запись своего ответа.</p></a>
        <a class="card tile" href="#vocab"><div class="icon c5" aria-hidden="true">🃏</div><h3>Тренажёр слов</h3><p>Карточки с интервальным повторением, тест, ${topics.length} тем, импорт своих слов.</p></a>
        <a class="card tile" href="#exam"><div class="icon c1" aria-hidden="true">🎓</div><h3>Пробный экзамен</h3><p>Все 4 секции подряд с таймерами, 3 варианта, итоговый Overall и история попыток.</p></a>
        <a class="card tile" href="#plan"><div class="icon c3" aria-hidden="true">🗓️</div><h3>Расписание</h3><p>Календарь занятий по дням, задачи по разделам и отсчёт до даты экзамена.</p></a>
        <a class="card tile" href="#calc"><div class="icon c6" aria-hidden="true">🧮</div><h3>Калькулятор</h3><p>Перевод сырых баллов в band и расчёт итоговой оценки Overall.</p></a>
      </div>

      <h2>Ваш прогресс</h2>
      <div class="grid">
        <section class="card">
          <h3>Лучшие результаты</h3>
          <ul class="best-list">
            ${READING.map((r) => bestRow("reading:" + r.id, "Reading — " + r.title)).join("")}
            ${examRow()}
            ${bestRow("listening:exam", "Listening — полный тест")}
            ${LISTENING.parts.map((p, i) => bestRow("listening:" + p.id, `Listening — Part ${i + 1}`)).join("")}
          </ul>
          <p class="muted small">Сохранённых черновиков эссе: <b>${essays}</b></p>
        </section>
        <section class="card">
          <div class="row between"><h3>Словарь</h3><a class="small" href="#vocab/topics">Подробнее →</a></div>
          <p>Выучено <b>${vs.learned}</b> из ${vs.total} слов</p>
          ${topics.map((t) => {
            const s = V.stats(t.words, srs);
            return `<div class="mini-bar"><span>${t.icon} ${esc(t.name)}</span>${bar((s.learned / s.total) * 100, "Прогресс " + t.name)}<span class="muted small">${s.learned}/${s.total}</span></div>`;
          }).join("")}
        </section>
      </div>

      <h2>Формат экзамена</h2>
      <div class="card table-wrap" tabindex="0" role="region" aria-label="Формат экзамена">
        <table class="data">
          <thead><tr><th scope="col">Часть</th><th scope="col">Время</th><th scope="col">Задания</th></tr></thead>
          <tbody>
            <tr><td>Listening</td><td>~30 мин (+10 мин на перенос в бумажной версии)</td><td>4 части, 40 вопросов</td></tr>
            <tr><td>Reading</td><td>60 мин</td><td>3 текста, 40 вопросов</td></tr>
            <tr><td>Writing</td><td>60 мин</td><td>Task 1 (150+ слов, ~20 мин), Task 2 (250+ слов, ~40 мин)</td></tr>
            <tr><td>Speaking</td><td>11–14 мин</td><td>Part 1 интервью, Part 2 монолог 2 мин, Part 3 дискуссия</td></tr>
          </tbody>
        </table>
      </div>`;

    // Отметка задач на сегодня прямо с главной.
    const list = $("#homeTasks");
    if (list) list.addEventListener("change", (e) => {
      const cb = e.target.closest("input[data-id]");
      if (!cb) return;
      P.toggle(cb.dataset.id);
      cb.closest(".task").classList.toggle("done", cb.checked);
    });
    const scroller = $(".heatmap-scroll");
    // На телефоне показываем последние недели (в следующем кадре, после отрисовки).
    if (scroller) requestAnimationFrame(() => { scroller.scrollLeft = scroller.scrollWidth; });
  };
})();
