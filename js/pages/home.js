/* Главная страница: разделы, прогресс, формат экзамена. */
(() => {
  "use strict";
  const { app, esc, store, bar } = App;
  const V = App.vocab;

  App.pages.home = () => {
    const best = store.get("best", {});
    const essays = Object.keys(store.get("drafts", {})).length;
    const srs = V.loadSrs();
    const topics = V.topics().filter((t) => t.words.length);
    const words = topics.flatMap((t) => t.words);
    const vs = V.stats(words, srs);
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

      <h2 class="sr-only">Разделы</h2>
      <div class="grid tiles">
        <a class="card tile" href="#reading"><div class="icon c1" aria-hidden="true">📖</div><h3>Reading</h3><p>Академические тексты, TRUE/FALSE/NOT GIVEN, выбор ответа, пропуски. 20 минут на текст.</p></a>
        <a class="card tile" href="#listening"><div class="icon c2" aria-hidden="true">🎧</div><h3>Listening</h3><p>4 части как на экзамене: режим «Экзамен» без паузы и перемотки и режим «Тренировка».</p></a>
        <a class="card tile" href="#writing"><div class="icon c3" aria-hidden="true">✍️</div><h3>Writing</h3><p>Task 1 и Task 2 с таймером, счётчиком слов, полезными фразами и чек-листом.</p></a>
        <a class="card tile" href="#speaking"><div class="icon c4" aria-hidden="true">🗣️</div><h3>Speaking</h3><p>Part 1, карточки Part 2 с таймером подготовки, Part 3 и запись своего ответа.</p></a>
        <a class="card tile" href="#vocab"><div class="icon c5" aria-hidden="true">🃏</div><h3>Тренажёр слов</h3><p>Карточки с интервальным повторением, тест, ${topics.length} тем, импорт своих слов.</p></a>
        <a class="card tile" href="#calc"><div class="icon c6" aria-hidden="true">🧮</div><h3>Калькулятор</h3><p>Перевод сырых баллов в band и расчёт итоговой оценки Overall.</p></a>
      </div>

      <h2>Ваш прогресс</h2>
      <div class="grid">
        <section class="card">
          <h3>Лучшие результаты</h3>
          <ul class="best-list">
            ${READING.map((r) => bestRow("reading:" + r.id, "Reading — " + r.title)).join("")}
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
      <div class="card table-wrap">
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
  };
})();
