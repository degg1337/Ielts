/* Данные расписания: задачи по дням, дата экзамена, экспорт и импорт.
   Используется страницей «План» и главной (задачи на сегодня, отсчёт до экзамена). */
(() => {
  "use strict";
  const { store, dayKey } = App;

  const SECTIONS = [
    { id: "reading", label: "Reading", icon: "📖", color: 1 },
    { id: "listening", label: "Listening", icon: "🎧", color: 2 },
    { id: "writing", label: "Writing", icon: "✍️", color: 3 },
    { id: "speaking", label: "Speaking", icon: "🗣️", color: 4 },
    { id: "vocab", label: "Слова", icon: "🃏", color: 5 },
    { id: "exam", label: "Пробный экзамен", icon: "🎓", color: 7 },
    { id: "other", label: "Другое", icon: "📌", color: 6 }
  ];
  const COLORS = [1, 2, 3, 4, 5, 6, 7, 8];
  const COLOR_NAMES = { 1: "синий", 2: "оранжевый", 3: "бирюзовый", 4: "жёлтый", 5: "розовый", 6: "зелёный", 7: "фиолетовый", 8: "красный" };
  const KEY = "planTasks";
  const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

  const tasks = () => store.get(KEY, []);
  const save = (list) => store.setNow(KEY, list);
  const section = (id) => SECTIONS.find((s) => s.id === id) || SECTIONS[SECTIONS.length - 1];

  function clean(t) {
    const text = String(t.text || "").trim().slice(0, 200);
    if (!text || !DATE_RE.test(t.date)) return null;
    const sec = section(t.section).id;
    const color = COLORS.includes(Number(t.color)) ? Number(t.color) : section(sec).color;
    return { id: String(t.id || "t" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6)), date: t.date, text, section: sec, color, done: !!t.done };
  }

  const plan = {
    SECTIONS, COLORS, COLOR_NAMES, section,
    tasks,
    forDate: (date) => tasks().filter((t) => t.date === date),
    add(t) { const c = clean(t); if (c) save([...tasks(), c]); return c; },
    update(id, patch) { save(tasks().map((t) => (t.id === id ? clean({ ...t, ...patch, id }) || t : t))); },
    remove(id) { save(tasks().filter((t) => t.id !== id)); },
    toggle(id) { save(tasks().map((t) => (t.id === id ? { ...t, done: !t.done } : t))); },

    examDate: () => store.get("examDate", null),
    setExamDate(d) { store.setNow("examDate", d && DATE_RE.test(d) ? d : null); },
    // Сколько дней осталось до экзамена (0 — сегодня, отрицательное — уже прошёл).
    daysLeft() {
      const d = plan.examDate();
      if (!d) return null;
      const a = new Date(dayKey() + "T12:00:00");
      const b = new Date(d + "T12:00:00");
      return Math.round((b - a) / 86400000);
    },

    exportData: () => ({ app: "ielts-prep", kind: "plan", version: 1, exportedAt: new Date().toISOString(), examDate: plan.examDate(), tasks: tasks() }),
    // Возвращает число импортированных задач; бросает ошибку, если файл не похож на резервную копию плана.
    importData(data, { replace = false } = {}) {
      if (!data || data.kind !== "plan" || !Array.isArray(data.tasks)) throw new Error("Это не файл расписания IELTS Prep.");
      const incoming = data.tasks.map(clean).filter(Boolean);
      const base = replace ? [] : tasks();
      const ids = new Set(base.map((t) => t.id));
      const merged = [...base, ...incoming.filter((t) => !ids.has(t.id))];
      save(merged);
      if (data.examDate && (replace || !plan.examDate())) plan.setExamDate(data.examDate);
      return merged.length - base.length;
    }
  };

  App.plan = plan;
})();
