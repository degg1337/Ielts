/* Общая логика словаря: темы, свои слова и интервальное повторение.
   Используется тренажёром слов и главной страницей. */
(() => {
  "use strict";
  const { store } = App;

  // Простое интервальное повторение (система Лейтнера): у каждого слова есть «коробка» 0–6.
  // 0 — новое, 1 — не знаю, чем выше коробка, тем реже слово показывается. С коробки 3 слово считается выученным.
  const LEARNED_BOX = 3;
  const MAX_BOX = 6;
  const MIN = 60 * 1000;
  const DAY = 24 * 60 * MIN;
  const INTERVALS = [0, MIN, 10 * MIN, DAY, 3 * DAY, 7 * DAY, 21 * DAY];

  const CUSTOM_ID = "custom";
  const builtinIds = new Set(WORD_TOPICS.map((t) => t.id));

  // Свои слова хранятся одним массивом; поле topic — id встроенной темы, название своей темы или пусто («Мои слова»).
  const customWords = () => store.get("customWords", []);
  const saveCustom = (list) => store.setNow("customWords", list);
  const userTopicId = (name) => "u:" + name.toLowerCase();

  function topics() {
    const list = WORD_TOPICS.map((t) => ({
      id: t.id, name: t.name, ru: t.ru, icon: t.icon,
      words: t.words.map(([w, ipa, ru, ex]) => ({ id: w.toLowerCase(), w, ipa, ru, ex, topic: t.id }))
    }));
    const byId = new Map(list.map((t) => [t.id, t]));
    const mine = { id: CUSTOM_ID, name: "My words", ru: "Мои слова", icon: "⭐", words: [] };
    const userTopics = new Map();
    customWords().forEach((c) => {
      const w = { ...c, custom: true };
      if (!c.topic) { w.topic = CUSTOM_ID; mine.words.push(w); return; }
      if (builtinIds.has(c.topic)) { byId.get(c.topic).words.push(w); return; }
      const id = userTopicId(c.topic);
      if (!userTopics.has(id)) userTopics.set(id, { id, name: c.topic, ru: "Своя тема", icon: "🏷️", words: [], user: true });
      w.topic = id;
      userTopics.get(id).words.push(w);
    });
    return [...list, mine, ...userTopics.values()];
  }

  // Все слова словаря в нижнем регистре — для поиска дублей.
  function knownWords() {
    const set = new Set();
    WORD_TOPICS.forEach((t) => t.words.forEach((w) => set.add(w[0].toLowerCase())));
    customWords().forEach((c) => set.add(c.w.toLowerCase()));
    return set;
  }

  function loadSrs() {
    const srs = store.get("srs", {});
    // Перенос прогресса из самой первой версии словаря (список выученных слов).
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
    save(srs, (latest) => { latest[id] = st; });
  }

  // Изменения пишем в самую свежую версию прогресса (её могла обновить другая вкладка),
  // а копию страницы обновляем, чтобы она видела свои же ответы.
  function save(srs, change) {
    const latest = store.get("srs", {});
    change(latest);
    if (latest !== srs) change(srs);
    store.set("srs", latest);
  }
  const forget = (srs, ids) => save(srs, (s) => ids.forEach((id) => { delete s[id]; }));

  function stats(words, srs) {
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
    let sum = pool.reduce((s, p) => s + p.weight, 0);
    const out = [];
    while (out.length < n && pool.length) {
      let r = Math.random() * sum;
      let i = 0;
      while (i < pool.length - 1 && (r -= pool[i].weight) > 0) i++;
      const [p] = pool.splice(i, 1);
      sum -= p.weight;
      out.push(p.w);
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

  App.vocab = {
    builtinIds,
    topics, knownWords, customWords, saveCustom,
    loadSrs, wordState, recordAnswer, forget, stats, weightedSample, whenText, statusBadge
  };
})();
