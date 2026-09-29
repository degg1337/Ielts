/* Расписание: календарь на месяц и неделю, задачи по дням, дата экзамена, резервная копия. */
(() => {
  "use strict";
  const { app, esc, $, $$, store, tabs, dayKey, download } = App;
  const P = App.plan;

  const MONTHS = ["январь", "февраль", "март", "апрель", "май", "июнь", "июль", "август", "сентябрь", "октябрь", "ноябрь", "декабрь"];
  const MONTHS_GEN = ["января", "февраля", "марта", "апреля", "мая", "июня", "июля", "августа", "сентября", "октября", "ноября", "декабря"];
  const WD = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
  const WD_FULL = ["понедельник", "вторник", "среда", "четверг", "пятница", "суббота", "воскресенье"];
  const QUICK = [
    ["Reading: тест", "reading"], ["Listening: одна часть", "listening"], ["Эссе Task 2", "writing"],
    ["Speaking: карточка Part 2", "speaking"], ["50 слов", "vocab"], ["Пробный экзамен", "exam"]
  ];

  const parse = (key) => new Date(key + "T12:00:00");
  const addDays = (key, n) => { const d = parse(key); d.setDate(d.getDate() + n); return dayKey(d); };
  const weekStart = (key) => { const d = parse(key); return addDays(key, -((d.getDay() + 6) % 7)); };
  const human = (key) => { const d = parse(key); return `${d.getDate()} ${MONTHS_GEN[d.getMonth()]}, ${WD_FULL[(d.getDay() + 6) % 7]}`; };
  const plural = (n, one, few, many) => { const a = n % 10, b = n % 100; return a === 1 && b !== 11 ? one : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? few : many; };

  App.pages.plan = (param) => {
    const view = param === "week" ? "week" : "month";
    const ui = { selected: dayKey(), cursor: dayKey(), editing: null, ...store.get("planUi", {}) };
    // Если вернулись на страницу в другой день, открываем сегодняшний.
    if (ui.openedOn !== dayKey()) { ui.selected = dayKey(); ui.cursor = dayKey(); ui.openedOn = dayKey(); }
    ui.editing = null;
    const saveUi = () => store.set("planUi", { selected: ui.selected, cursor: ui.cursor, openedOn: ui.openedOn });

    app.innerHTML = `
      <h1>Расписание</h1>
      <p class="lead">Планируйте занятия по дням: что делать, по какому разделу. Отмечайте выполненное — сегодняшние задачи видны на главной.</p>
      <section class="card exam-date-card" aria-labelledby="edTitle">
        <div class="row between">
          <div>
            <h2 class="card-title" id="edTitle">🎯 Дата экзамена</h2>
            <div id="edCount" aria-live="polite"></div>
          </div>
          <div class="row">
            <label class="sr-only" for="edInput">Дата экзамена</label>
            <input type="date" id="edInput" class="input">
            <button class="btn sm ghost" id="edClear">Убрать</button>
          </div>
        </div>
      </section>`;
    app.appendChild(tabs([{ id: "month", label: "📅 Месяц" }, { id: "week", label: "🗓️ Неделя" }], view, "plan", "Вид календаря"));

    const wrap = document.createElement("div");
    wrap.className = "plan-layout";
    wrap.innerHTML = `
      <section class="card cal-card" aria-label="Календарь">
        <div class="row between cal-head">
          <button class="btn sm secondary icon-btn" id="calPrev" aria-label="${view === "month" ? "Предыдущий месяц" : "Предыдущая неделя"}">←</button>
          <h2 class="card-title cal-title" id="calTitle" aria-live="polite"></h2>
          <div class="row">
            <button class="btn sm ghost" id="calToday">Сегодня</button>
            <button class="btn sm secondary icon-btn" id="calNext" aria-label="${view === "month" ? "Следующий месяц" : "Следующая неделя"}">→</button>
          </div>
        </div>
        <div id="calBody"></div>
      </section>
      <section class="card day-card" aria-labelledby="dayTitle">
        <h2 class="card-title" id="dayTitle"></h2>
        <ul class="task-list" id="dayTasks"></ul>
        <form id="taskForm" class="task-form" autocomplete="off">
          <h3 class="small form-title" id="formTitle">Добавить задачу</h3>
          <label class="sr-only" for="tfText">Что сделать</label>
          <input id="tfText" class="input" maxlength="200" required placeholder="Например: Reading тест 2 или 50 слов Environment">
          <div class="quick" aria-label="Быстрые шаблоны">${QUICK.map(([t, s]) => `<button type="button" class="chip sm" data-q="${esc(t)}" data-s="${s}">${esc(t)}</button>`).join("")}</div>
          <div class="row">
            <label class="small" for="tfSection">Раздел</label>
            <select id="tfSection">${P.SECTIONS.map((s) => `<option value="${s.id}">${s.icon} ${esc(s.label)}</option>`).join("")}</select>
            <label class="small" for="tfDate">Дата</label>
            <input type="date" id="tfDate" class="input">
          </div>
          <fieldset class="colors">
            <legend class="small">Цвет</legend>
            ${P.COLORS.map((c) => `<label class="color-opt"><input type="radio" name="tfColor" value="${c}"><span class="sw pc-bg-${c}" title="${P.COLOR_NAMES[c]}"></span><span class="sr-only">${P.COLOR_NAMES[c]}</span></label>`).join("")}
          </fieldset>
          <div class="row">
            <button class="btn" type="submit" id="tfSave">Добавить</button>
            <button class="btn ghost" type="button" id="tfCancel" hidden>Отмена</button>
            <span class="small" id="tfMsg" aria-live="polite"></span>
          </div>
        </form>
      </section>
      <section class="card backup-card" aria-labelledby="bkTitle">
        <h2 class="card-title" id="bkTitle">Резервная копия</h2>
        <p class="muted small">Расписание хранится в этом браузере. Сохраните файл, чтобы перенести его на другое устройство или не потерять при очистке браузера.</p>
        <div class="row">
          <button class="btn secondary" id="bkExport">⬇ Экспорт в файл</button>
          <label class="btn secondary file-btn">⬆ Импорт из файла<input type="file" id="bkImport" accept=".json,application/json" class="sr-only"></label>
          <span class="small" id="bkMsg" aria-live="polite"></span>
        </div>
      </section>`;
    app.appendChild(wrap);

    /* ----- Дата экзамена ----- */
    const edInput = $("#edInput");
    const renderExamDate = () => {
      edInput.value = P.examDate() || "";
      const left = P.daysLeft();
      $("#edClear").hidden = left === null;
      $("#edCount").innerHTML = left === null
        ? '<p class="muted small">Не указана. Выберите дату — на главной появится обратный отсчёт.</p>'
        : left > 0 ? `<div class="countdown"><b>${left}</b><span>${plural(left, "день", "дня", "дней")} до экзамена · ${esc(human(P.examDate()))}</span></div>`
          : left === 0 ? '<div class="countdown"><b>🎯</b><span>Экзамен сегодня. Удачи!</span></div>'
            : `<p class="muted small">Экзамен был ${Math.abs(left)} ${plural(Math.abs(left), "день", "дня", "дней")} назад.</p>`;
    };
    edInput.addEventListener("change", () => { P.setExamDate(edInput.value); renderExamDate(); renderCal(); });
    $("#edClear").onclick = () => { P.setExamDate(null); renderExamDate(); renderCal(); };
    renderExamDate();

    /* ----- Календарь ----- */
    function chip(t) {
      return `<span class="cal-chip pc-${t.color}${t.done ? " done" : ""}">${esc(t.text)}</span>`;
    }
    function dayCellLabel(key, list) {
      const done = list.filter((t) => t.done).length;
      return `${human(key)}${key === dayKey() ? ", сегодня" : ""}${key === P.examDate() ? ", экзамен" : ""}: ${list.length ? `${list.length} ${plural(list.length, "задача", "задачи", "задач")}, выполнено ${done}` : "задач нет"}`;
    }

    function renderCal() {
      const all = P.tasks();
      const byDate = {};
      all.forEach((t) => { (byDate[t.date] = byDate[t.date] || []).push(t); });
      const today = dayKey();
      const exam = P.examDate();
      const body = $("#calBody");
      if (view === "month") {
        const c = parse(ui.cursor);
        const first = dayKey(new Date(c.getFullYear(), c.getMonth(), 1, 12));
        const start = weekStart(first);
        $("#calTitle").textContent = `${MONTHS[c.getMonth()][0].toUpperCase() + MONTHS[c.getMonth()].slice(1)} ${c.getFullYear()}`;
        let cells = "";
        for (let i = 0; i < 42; i++) {
          const key = addDays(start, i);
          const d = parse(key);
          if (i === 35 && d.getMonth() !== c.getMonth()) break; // шестая строка не нужна
          const list = byDate[key] || [];
          const cls = ["cal-day", d.getMonth() !== c.getMonth() ? "other" : "", key === today ? "today" : "", key === ui.selected ? "selected" : "", key === exam ? "exam" : ""].join(" ");
          cells += `<button type="button" class="${cls}" data-date="${key}" aria-label="${esc(dayCellLabel(key, list))}" aria-pressed="${key === ui.selected}">
            <span class="cal-num">${d.getDate()}${key === exam ? " 🎯" : ""}</span>
            <span class="cal-chips" aria-hidden="true">${list.slice(0, 3).map(chip).join("")}${list.length > 3 ? `<span class="cal-more">+${list.length - 3}</span>` : ""}</span>
            <span class="cal-dots" aria-hidden="true">${list.slice(0, 4).map((t) => `<i class="dot-c pc-bg-${t.color}${t.done ? " done" : ""}"></i>`).join("")}</span>
          </button>`;
        }
        body.innerHTML = `<div class="cal-grid month" role="group" aria-label="Дни месяца">${WD.map((w) => `<div class="cal-wd" aria-hidden="true">${w}</div>`).join("")}${cells}</div>`;
      } else {
        const start = weekStart(ui.cursor);
        const end = addDays(start, 6);
        const s = parse(start), e = parse(end);
        $("#calTitle").textContent = s.getMonth() === e.getMonth()
          ? `${s.getDate()}–${e.getDate()} ${MONTHS_GEN[s.getMonth()]} ${e.getFullYear()}`
          : `${s.getDate()} ${MONTHS_GEN[s.getMonth()]} – ${e.getDate()} ${MONTHS_GEN[e.getMonth()]} ${e.getFullYear()}`;
        let cols = "";
        for (let i = 0; i < 7; i++) {
          const key = addDays(start, i);
          const d = parse(key);
          const list = byDate[key] || [];
          cols += `<div class="week-day${key === today ? " today" : ""}${key === ui.selected ? " selected" : ""}${key === exam ? " exam" : ""}">
            <button type="button" class="week-head" data-date="${key}" aria-pressed="${key === ui.selected}" aria-label="${esc(dayCellLabel(key, list))}">
              <span>${WD[i]}</span><b>${d.getDate()}</b>${key === exam ? "<span>🎯</span>" : ""}
            </button>
            <ul class="task-list">${list.map((t) => taskItem(t, true)).join("")}</ul>
            <button type="button" class="btn sm ghost week-add" data-add="${key}" aria-label="Добавить задачу на ${esc(human(key))}">+ задача</button>
          </div>`;
        }
        body.innerHTML = `<div class="cal-grid week">${cols}</div>`;
      }
    }

    function taskItem(t, compact = false) {
      const sec = P.section(t.section);
      return `<li class="task pc-${t.color}${t.done ? " done" : ""}" data-id="${esc(t.id)}">
        <label><input type="checkbox" data-toggle="${esc(t.id)}"${t.done ? " checked" : ""}> <span>${sec.icon} ${esc(t.text)}</span></label>
        ${compact ? "" : `<div class="task-actions">
          <button type="button" class="btn sm ghost" data-edit="${esc(t.id)}" aria-label="Изменить: ${esc(t.text)}">✏️</button>
          <button type="button" class="btn sm ghost" data-del="${esc(t.id)}" aria-label="Удалить: ${esc(t.text)}">🗑</button>
        </div>`}
      </li>`;
    }

    /* ----- Панель дня и форма ----- */
    const form = $("#taskForm");
    function setColor(c) { $$('input[name="tfColor"]', form).forEach((r) => { r.checked = Number(r.value) === Number(c); }); }
    function resetForm() {
      ui.editing = null;
      form.reset();
      $("#tfDate").value = ui.selected;
      $("#tfSection").value = "reading";
      setColor(P.section("reading").color);
      $("#formTitle").textContent = "Добавить задачу";
      $("#tfSave").textContent = "Добавить";
      $("#tfCancel").hidden = true;
    }
    function renderDay() {
      const list = P.forDate(ui.selected);
      $("#dayTitle").textContent = `${human(ui.selected)[0].toUpperCase()}${human(ui.selected).slice(1)}${ui.selected === dayKey() ? " · сегодня" : ""}`;
      $("#dayTasks").innerHTML = list.length ? list.map((t) => taskItem(t)).join("") : '<li class="muted small empty">Задач пока нет.</li>';
      if (!ui.editing) $("#tfDate").value = ui.selected;
    }
    function select(key) {
      const hadFocus = document.activeElement && document.activeElement.closest("#calBody");
      ui.selected = key;
      ui.cursor = key;
      saveUi();
      renderCal();
      renderDay();
      // Календарь перерисован — возвращаем фокус на выбранный день, чтобы с клавиатуры было удобно.
      if (hadFocus) { const b = $(`#calBody [data-date="${key}"]`); if (b) b.focus(); }
    }

    $("#tfSection").onchange = () => { if (!ui.editing) setColor(P.section($("#tfSection").value).color); };
    form.addEventListener("click", (e) => {
      const q = e.target.closest("[data-q]");
      if (!q) return;
      $("#tfText").value = q.dataset.q;
      $("#tfSection").value = q.dataset.s;
      setColor(P.section(q.dataset.s).color);
      $("#tfText").focus();
    });
    form.onsubmit = (e) => {
      e.preventDefault();
      const data = {
        text: $("#tfText").value,
        section: $("#tfSection").value,
        color: Number(($('input[name="tfColor"]:checked', form) || {}).value) || P.section($("#tfSection").value).color,
        date: $("#tfDate").value || ui.selected
      };
      const msg = $("#tfMsg");
      if (!data.text.trim()) { msg.className = "small bad-text"; msg.textContent = "Напишите, что сделать."; return; }
      if (ui.editing) { P.update(ui.editing, data); msg.textContent = "Сохранено ✓"; }
      else { P.add(data); msg.textContent = "Добавлено ✓"; }
      msg.className = "small ok-text";
      const target = data.date;
      resetForm();
      select(target);
      $("#tfText").focus();
    };
    $("#tfCancel").onclick = () => { resetForm(); $("#tfMsg").textContent = ""; };

    function startEdit(id) {
      const t = P.tasks().find((x) => x.id === id);
      if (!t) return;
      ui.editing = id;
      $("#tfText").value = t.text;
      $("#tfSection").value = t.section;
      $("#tfDate").value = t.date;
      setColor(t.color);
      $("#formTitle").textContent = "Изменить задачу";
      $("#tfSave").textContent = "Сохранить";
      $("#tfCancel").hidden = false;
      $("#tfMsg").textContent = "";
      $("#tfText").focus();
    }

    wrap.addEventListener("click", (e) => {
      const day = e.target.closest("[data-date]");
      if (day) { select(day.dataset.date); return; }
      const add = e.target.closest("[data-add]");
      if (add) { select(add.dataset.add); resetForm(); $("#tfText").focus(); $("#taskForm").scrollIntoView({ behavior: "smooth", block: "center" }); return; }
      const ed = e.target.closest("[data-edit]");
      if (ed) { startEdit(ed.dataset.edit); return; }
      const del = e.target.closest("[data-del]");
      if (del) {
        if (!confirm("Удалить задачу?")) return;
        P.remove(del.dataset.del);
        if (ui.editing === del.dataset.del) resetForm();
        renderCal();
        renderDay();
      }
    });
    wrap.addEventListener("change", (e) => {
      const cb = e.target.closest("[data-toggle]");
      if (!cb) return;
      P.toggle(cb.dataset.toggle);
      renderCal();
      renderDay();
    });

    $("#calPrev").onclick = () => shift(-1);
    $("#calNext").onclick = () => shift(1);
    $("#calToday").onclick = () => select(dayKey());
    function shift(dir) {
      if (view === "month") {
        const c = parse(ui.cursor);
        ui.cursor = dayKey(new Date(c.getFullYear(), c.getMonth() + dir, 1, 12));
      } else ui.cursor = addDays(ui.cursor, dir * 7);
      saveUi();
      renderCal();
    }

    /* ----- Резервная копия ----- */
    $("#bkExport").onclick = () => {
      download(`ielts-plan-${dayKey()}.json`, JSON.stringify(P.exportData(), null, 2), "application/json");
      $("#bkMsg").className = "small ok-text";
      $("#bkMsg").textContent = `Сохранено задач: ${P.tasks().length}`;
    };
    $("#bkImport").onchange = async (e) => {
      const file = e.target.files[0];
      e.target.value = "";
      if (!file) return;
      const msg = $("#bkMsg");
      try {
        const data = JSON.parse(await file.text());
        const replace = P.tasks().length > 0 && confirm("Заменить текущее расписание данными из файла?\n\nОК — заменить, Отмена — добавить к существующему.");
        const n = P.importData(data, { replace });
        msg.className = "small ok-text";
        msg.textContent = replace ? `Расписание заменено: ${P.tasks().length} задач.` : `Добавлено задач: ${n}.`;
        renderExamDate();
        renderCal();
        renderDay();
      } catch (err) {
        msg.className = "small bad-text";
        msg.textContent = err instanceof SyntaxError ? "Файл повреждён или это не JSON." : err.message;
      }
    };

    resetForm();
    renderCal();
    renderDay();
  };
})();
