/* Вкладка «Мои слова»: добавление по одному, массовый импорт (текст или файл), экспорт в CSV. */
(() => {
  "use strict";
  const { esc, $, store, download } = App;
  const V = App.vocab;

  const LIMITS = { w: 80, ru: 200, ex: 300, ipa: 80 };
  const PREVIEW_ROWS = 50;
  const MAX_FILE = 5 * 1024 * 1024;
  const HEADER_W = /^(word|words|english|en|term|слово|слова|английский)$/i;
  const HEADER_RU = /^(translation|russian|ru|meaning|перевод|значение|русский)$/i;
  const IPA_RE = /^[/[].*[/\]]$/;
  const CYR = /[а-яё]/i;
  const LAT = /[a-z]/i;

  /* ---------- Разбор строк ---------- */

  // Разбивает строку CSV с учётом кавычек: "a;b";c → ['a;b', 'c'].
  function splitCsv(line, sep) {
    const out = [];
    let cur = "";
    let quoted = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (quoted) {
        if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (ch === '"') quoted = false;
        else cur += ch;
      } else if (ch === '"' && cur.trim() === "") { quoted = true; cur = ""; }
      else if (ch === sep) { out.push(cur); cur = ""; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }

  // Поддерживаемые форматы: «word - перевод», «word;перевод;пример», «word<Tab>перевод», CSV через запятую.
  function splitLine(line) {
    if (line.includes("\t")) return line.split("\t");
    if (line.includes(";")) return splitCsv(line, ";");
    if (/\s[-–—](\s|$)/.test(line)) {
      const [w, ru, ...rest] = line.split(/\s+[-–—](?:\s+|$)/);
      return rest.length ? [w, ru, rest.join(" - ")] : [w, ru];
    }
    if (/[–—]/.test(line)) return line.split(/\s*[–—]\s*/);
    if (line.includes(",")) return splitCsv(line, ",");
    if (line.includes("=")) return line.split(/\s*=\s*/);
    return null;
  }

  function parseLine(line) {
    const cols = splitLine(line);
    if (!cols) return { error: "не найден разделитель ( - , ; или Tab)" };
    const clean = cols.map((c) => c.trim().replace(/^"(.*)"$/, "$1").trim());
    let [w = "", ru = "", ...rest] = clean;
    // Если перепутаны колонки (перевод слева), меняем местами.
    if (CYR.test(w) && !LAT.test(w) && LAT.test(ru) && !CYR.test(ru)) [w, ru] = [ru, w];
    if (!w) return { error: "нет слова" };
    if (!ru) return { error: "нет перевода" };
    let ipa = "";
    let ex = "";
    let topic = "";
    rest.forEach((c, i) => {
      if (!c) return;
      if (!ipa && IPA_RE.test(c)) ipa = c;
      else if (!ex && i === 0) ex = c;
      else if (!ipa && i === 1) ipa = c;
      else if (!topic && i >= 2) topic = c;
      else if (!ex) ex = c;
    });
    if (w.length > LIMITS.w) return { error: `слово длиннее ${LIMITS.w} символов` };
    if (ru.length > LIMITS.ru) return { error: `перевод длиннее ${LIMITS.ru} символов` };
    return { w: w.replace(/\s+/g, " "), ru, ex: ex.slice(0, LIMITS.ex), ipa: ipa.slice(0, LIMITS.ipa), topic };
  }

  const keyOf = (w) => w.toLowerCase().replace(/\s+/g, " ").trim();

  // Разбор порциями: каждые ~12 мс отдаём управление браузеру, чтобы большой список не подвешивал страницу.
  const yieldToBrowser = () => new Promise((r) => setTimeout(r, 0));
  async function parseText(text, onProgress) {
    const lines = text.replace(/^﻿/, "").split(/\r\n|\n|\r/);
    const known = V.knownWords();
    const seen = new Map();
    const res = { ok: [], dups: [], errors: [], hasTopicCol: false, lines: 0 };
    let headerChecked = false;
    let sliceStart = performance.now();
    for (let i = 0; i < lines.length; i++) {
      if (performance.now() - sliceStart > 12) {
        onProgress(i, lines.length);
        await yieldToBrowser();
        sliceStart = performance.now();
      }
      const line = lines[i].trim();
      if (!line || line.startsWith("#")) continue;
      res.lines++;
      const r = parseLine(line);
      if (!headerChecked) {
        headerChecked = true;
        if (!r.error && HEADER_W.test(r.w) && HEADER_RU.test(r.ru)) continue; // строка заголовков CSV
      }
      if (r.error) { res.errors.push({ n: i + 1, line, reason: r.error }); continue; }
      const k = keyOf(r.w);
      if (known.has(k)) { res.dups.push({ n: i + 1, w: r.w, reason: "уже есть в словаре" }); continue; }
      if (seen.has(k)) { res.dups.push({ n: i + 1, w: r.w, reason: `повтор строки ${seen.get(k)}` }); continue; }
      seen.set(k, i + 1);
      if (r.topic) res.hasTopicCol = true;
      res.ok.push(r);
    }
    onProgress(lines.length, lines.length);
    return res;
  }

  // Файл может быть в UTF-8 или (из старого Excel) в Windows-1251.
  async function readFile(file) {
    const buf = await file.arrayBuffer();
    try { return new TextDecoder("utf-8", { fatal: true }).decode(buf); }
    catch { return new TextDecoder("windows-1251").decode(buf); }
  }

  /* ---------- Темы ---------- */
  function topicOptions(topics, { withFile = false } = {}) {
    const builtins = topics.filter((t) => V.builtinIds.has(t.id));
    const users = topics.filter((t) => t.user);
    return `
      <option value="">⭐ Мои слова</option>
      ${withFile ? '<option value="__file">📄 Как в файле (колонка «тема»)</option>' : ""}
      <optgroup label="Темы IELTS">${builtins.map((t) => `<option value="${esc(t.id)}">${t.icon} ${esc(t.name)}</option>`).join("")}</optgroup>
      ${users.length ? `<optgroup label="Мои темы">${users.map((t) => `<option value="${esc("u:" + t.name)}">🏷️ ${esc(t.name)}</option>`).join("")}</optgroup>` : ""}
      <option value="__new">➕ Новая тема…</option>`;
  }

  // Приводит выбранную тему к тому, что храним в слове: id встроенной темы, название своей или "".
  function resolveTopic(value, newName, rowTopic) {
    if (value === "__new") return newName.trim().slice(0, 40);
    if (value === "__file") {
      const t = (rowTopic || "").trim();
      if (!t) return "";
      const builtin = WORD_TOPICS.find((x) => x.id === t.toLowerCase() || x.name.toLowerCase() === t.toLowerCase());
      return builtin ? builtin.id : t.slice(0, 40);
    }
    if (value.startsWith("u:")) return value.slice(2);
    return value;
  }

  /* ---------- CSV-экспорт ---------- */
  const csvCell = (v) => (/[;"\n\r]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v);
  function exportCsv() {
    const words = V.customWords();
    const topicName = (t) => { const b = WORD_TOPICS.find((x) => x.id === t); return b ? b.name : t || ""; };
    const rows = [["word", "translation", "example", "transcription", "topic"],
      ...words.map((w) => [w.w, w.ru, w.ex || "", w.ipa || "", topicName(w.topic)])];
    // BOM и «;» — чтобы Excel с русской локалью сразу разложил по колонкам.
    download(`ielts-my-words-${new Date().toISOString().slice(0, 10)}.csv`, "﻿" + rows.map((r) => r.map(csvCell).join(";")).join("\r\n"));
  }

  /* ---------- Вкладка ---------- */
  App.vocabMine = (wrap, { srs }) => {
    let topics = V.topics();
    let parsed = null;

    wrap.innerHTML = `
      <section class="card" aria-labelledby="impTitle">
        <h2 class="card-title" id="impTitle">📥 Импорт списка слов</h2>
        <p class="muted small">Вставьте сразу сотни или тысячи слов — по одному на строку — или загрузите файл .txt / .csv. Перед сохранением покажем, что распознано.</p>
        <div class="formats">
          <code>resilient - стойкий</code>
          <code>resilient;стойкий;Children are resilient.</code>
          <code>resilient<span class="tab-mark" title="Tab">⇥</span>стойкий</code>
        </div>
        <label class="sr-only" for="impText">Список слов</label>
        <textarea id="impText" class="import-area" spellcheck="false" placeholder="resilient - стойкий&#10;scarce;редкий, дефицитный;Water is scarce in the desert.&#10;thrive	процветать"></textarea>
        <div class="row between mt">
          <div class="row">
            <label class="btn secondary file-btn">📄 Загрузить файл<input type="file" id="impFile" accept=".txt,.csv,.tsv,text/plain,text/csv" class="sr-only"></label>
            <span class="muted small" id="impFileName"></span>
          </div>
          <div class="row">
            <label class="small" for="impTopic">Тема:</label>
            <select id="impTopic">${topicOptions(topics)}</select>
            <input id="impNewTopic" class="input" placeholder="Название темы" maxlength="40" hidden aria-label="Название новой темы">
          </div>
        </div>
        <div class="row mt">
          <button class="btn" id="impParse">Проверить список</button>
          <button class="btn ghost" id="impClear">Очистить</button>
          <span class="small muted" id="impProgress" aria-live="polite"></span>
        </div>
        <div id="impPreview" aria-live="polite"></div>
      </section>

      <section class="card" aria-labelledby="oneTitle">
        <h2 class="card-title" id="oneTitle">➕ Добавить одно слово</h2>
        <form id="addForm" class="form-grid">
          <label>Слово (англ.) *<input class="input" name="w" required maxlength="${LIMITS.w}" placeholder="e.g. resilient" autocapitalize="off"></label>
          <label>Перевод *<input class="input" name="ru" required maxlength="${LIMITS.ru}" placeholder="напр. стойкий, устойчивый"></label>
          <label>Транскрипция<input class="input" name="ipa" maxlength="${LIMITS.ipa}" placeholder="/rɪˈzɪliənt/"></label>
          <label class="wide">Пример<input class="input" name="ex" maxlength="${LIMITS.ex}" placeholder="Children are often more resilient than adults."></label>
          <div class="wide row"><button class="btn" type="submit">Добавить</button><span id="addMsg" class="small" aria-live="polite"></span></div>
        </form>
      </section>

      <section class="card" aria-labelledby="myTitle">
        <div class="row between">
          <h2 class="card-title" id="myTitle">Мои слова <span class="muted small" id="myCount"></span></h2>
          <div class="row">
            <input id="mySearch" class="input search" type="search" placeholder="Поиск…" aria-label="Поиск по моим словам">
            <button class="btn sm secondary" id="myExport">⬇ Экспорт CSV</button>
            <button class="btn sm ghost" id="myClearAll">Удалить все</button>
          </div>
        </div>
        <div id="myList"></div>
      </section>`;

    const text = $("#impText");
    const topicSel = $("#impTopic");
    const newTopic = $("#impNewTopic");
    const progress = $("#impProgress");
    const preview = $("#impPreview");

    /* --- Список своих слов --- */
    let searchTimer;
    function renderList() {
      const all = V.customWords();
      const q = $("#mySearch").value.trim().toLowerCase();
      const list = q ? all.filter((w) => w.w.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q)) : all;
      $("#myCount").textContent = `(${all.length})`;
      $("#myExport").disabled = !all.length;
      $("#myClearAll").hidden = !all.length;
      App.vocabUI.pagedWordTable($("#myList"), list, srs, {
        deletable: true,
        empty: q ? "Ничего не найдено." : "Пока пусто. Добавьте слова, которые встретили в текстах или фильмах, или импортируйте свой список."
      });
    }
    $("#mySearch").oninput = () => { clearTimeout(searchTimer); searchTimer = setTimeout(renderList, 200); };
    $("#myExport").onclick = exportCsv;
    $("#myClearAll").onclick = () => {
      const all = V.customWords();
      if (!confirm(`Удалить все свои слова (${all.length})? Сначала можно сохранить их через «Экспорт CSV».`)) return;
      all.forEach((w) => { delete srs[w.id]; });
      store.set("srs", srs);
      V.saveCustom([]);
      refreshTopics();
      renderList();
    };
    $("#myList").addEventListener("click", (e) => {
      const b = e.target.closest("[data-del]");
      if (!b || !confirm("Удалить слово?")) return;
      V.saveCustom(V.customWords().filter((w) => w.id !== b.dataset.del));
      delete srs[b.dataset.del];
      store.set("srs", srs);
      renderList();
    });

    function refreshTopics(keep) {
      topics = V.topics();
      const cur = keep !== undefined ? keep : topicSel.value;
      topicSel.innerHTML = topicOptions(topics, { withFile: parsed && parsed.hasTopicCol });
      topicSel.value = [...topicSel.options].some((o) => o.value === cur) ? cur : "";
      newTopic.hidden = topicSel.value !== "__new";
    }
    topicSel.onchange = () => {
      newTopic.hidden = topicSel.value !== "__new";
      if (!newTopic.hidden) newTopic.focus();
    };

    /* --- Одно слово --- */
    $("#addForm").onsubmit = (e) => {
      e.preventDefault();
      const f = e.target;
      const msg = $("#addMsg");
      const w = f.w.value.trim().replace(/\s+/g, " ");
      const ru = f.ru.value.trim();
      if (!w || !ru) return;
      if (V.knownWords().has(keyOf(w))) {
        msg.className = "small bad-text";
        msg.textContent = `Слово «${w}» уже есть в словаре.`;
        return;
      }
      const word = { id: "my:" + Date.now().toString(36), w, ru };
      if (f.ex.value.trim()) word.ex = f.ex.value.trim();
      if (f.ipa.value.trim()) word.ipa = f.ipa.value.trim();
      if (!V.saveCustom([word, ...V.customWords()])) {
        msg.className = "small bad-text";
        msg.textContent = "Не хватает места в хранилище браузера.";
        return;
      }
      f.reset();
      f.w.focus();
      msg.className = "small ok-text";
      msg.textContent = `Добавлено: ${w}`;
      renderList();
    };

    /* --- Импорт --- */
    async function loadFile(file) {
      if (!file) return;
      if (file.size > MAX_FILE) { progress.textContent = "Файл больше 5 МБ — разделите его на части."; return; }
      $("#impFileName").textContent = file.name;
      text.value = await readFile(file);
      runParse();
    }
    $("#impFile").onchange = (e) => {
      loadFile(e.target.files[0]);
      e.target.value = ""; // чтобы повторный выбор того же файла снова сработал
    };
    text.addEventListener("dragover", (e) => { e.preventDefault(); text.classList.add("drag"); });
    text.addEventListener("dragleave", () => text.classList.remove("drag"));
    text.addEventListener("drop", (e) => {
      e.preventDefault();
      text.classList.remove("drag");
      if (e.dataTransfer.files.length) loadFile(e.dataTransfer.files[0]);
    });
    text.addEventListener("input", () => { if (parsed) { parsed = null; preview.innerHTML = ""; } });
    $("#impClear").onclick = () => { text.value = ""; parsed = null; preview.innerHTML = ""; progress.textContent = ""; $("#impFileName").textContent = ""; text.focus(); };
    $("#impParse").onclick = runParse;

    let parsing = false;
    async function runParse() {
      if (parsing) return;
      if (!text.value.trim()) { progress.textContent = "Вставьте список слов или загрузите файл."; return; }
      parsing = true;
      $("#impParse").disabled = true;
      preview.innerHTML = "";
      const t0 = performance.now();
      parsed = await parseText(text.value, (i, n) => { progress.textContent = `Обработано ${i} из ${n} строк…`; });
      progress.textContent = `Готово за ${Math.max(1, Math.round(performance.now() - t0))} мс.`;
      parsing = false;
      $("#impParse").disabled = false;
      refreshTopics();
      renderPreview();
    }

    function renderPreview() {
      const { ok, dups, errors } = parsed;
      const more = (n) => (n > PREVIEW_ROWS ? `<p class="muted small">…и ещё ${n - PREVIEW_ROWS}</p>` : "");
      preview.innerHTML = `
        <div class="preview">
          <div class="preview-stats">
            <div class="pstat ok"><b>${ok.length}</b><span>новых слов</span></div>
            <div class="pstat"><b>${dups.length}</b><span>дублей (пропустим)</span></div>
            <div class="pstat ${errors.length ? "bad" : ""}"><b>${errors.length}</b><span>строк с ошибками</span></div>
          </div>
          ${ok.length ? `<details open><summary>Будут добавлены (${ok.length})</summary>
            <div class="table-wrap"><table class="data words-table"><thead><tr><th scope="col">Слово</th><th scope="col">Перевод</th><th scope="col">Пример</th>${parsed.hasTopicCol ? '<th scope="col">Тема в файле</th>' : ""}</tr></thead><tbody>
            ${ok.slice(0, PREVIEW_ROWS).map((r) => `<tr><td><b lang="en">${esc(r.w)}</b>${r.ipa ? `<div class="ipa small">${esc(r.ipa)}</div>` : ""}</td><td>${esc(r.ru)}</td><td class="muted" lang="en">${esc(r.ex)}</td>${parsed.hasTopicCol ? `<td>${esc(r.topic)}</td>` : ""}</tr>`).join("")}
            </tbody></table></div>${more(ok.length)}</details>` : ""}
          ${dups.length ? `<details><summary>Дубли (${dups.length})</summary><ul class="issue-list">
            ${dups.slice(0, PREVIEW_ROWS).map((d) => `<li><span class="muted">стр. ${d.n}</span> <b lang="en">${esc(d.w)}</b> — ${esc(d.reason)}</li>`).join("")}</ul>${more(dups.length)}</details>` : ""}
          ${errors.length ? `<details ${ok.length ? "" : "open"}><summary class="bad-text">Ошибки (${errors.length})</summary><ul class="issue-list">
            ${errors.slice(0, PREVIEW_ROWS).map((e) => `<li><span class="muted">стр. ${e.n}</span> <code>${esc(e.line.slice(0, 80))}</code> — ${esc(e.reason)}</li>`).join("")}</ul>${more(errors.length)}</details>` : ""}
          <div class="row mt">
            <button class="btn success" id="impSave" ${ok.length ? "" : "disabled"}>Добавить ${ok.length} ${plural(ok.length, "слово", "слова", "слов")}</button>
            <span class="small" id="impMsg" aria-live="polite"></span>
          </div>
        </div>`;
      $("#impSave").onclick = save;
    }

    function save() {
      if (!parsed || !parsed.ok.length) return;
      const msg = $("#impMsg");
      if (topicSel.value === "__new" && !newTopic.value.trim()) {
        msg.className = "small bad-text";
        msg.textContent = "Введите название новой темы.";
        newTopic.focus();
        return;
      }
      // Пока список был на превью, часть слов могла появиться в словаре — проверяем ещё раз.
      const known = V.knownWords();
      const stamp = Date.now().toString(36);
      const fresh = [];
      parsed.ok.forEach((r, i) => {
        if (known.has(keyOf(r.w))) return;
        known.add(keyOf(r.w));
        const word = { id: `my:${stamp}-${i.toString(36)}`, w: r.w, ru: r.ru };
        if (r.ex) word.ex = r.ex;
        if (r.ipa) word.ipa = r.ipa;
        const topic = resolveTopic(topicSel.value, newTopic.value, r.topic);
        if (topic) word.topic = topic;
        fresh.push(word);
      });
      const prev = V.customWords();
      if (!V.saveCustom([...fresh, ...prev])) {
        V.saveCustom(prev);
        msg.className = "small bad-text";
        msg.textContent = "Не хватает места в хранилище браузера. Разделите список на части или удалите старые слова.";
        return;
      }
      const topicLabel = topicSel.value === "__new" ? newTopic.value.trim() : topicSel.value === "__file" ? "по файлу" : topicSel.selectedOptions[0].textContent.trim();
      parsed = null;
      text.value = "";
      $("#impFileName").textContent = "";
      progress.textContent = "";
      preview.innerHTML = `<div class="notice ok">✔ Добавлено ${fresh.length} ${plural(fresh.length, "слово", "слова", "слов")} (тема: ${esc(topicLabel)}). Они уже есть в карточках и тестах.</div>`;
      refreshTopics(topicSel.value === "__new" ? "u:" + newTopic.value.trim() : topicSel.value === "__file" ? "" : topicSel.value);
      newTopic.value = "";
      renderList();
    }

    renderList();
  };

  function plural(n, one, few, many) {
    const m10 = n % 10, m100 = n % 100;
    if (m10 === 1 && m100 !== 11) return one;
    if (m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20)) return few;
    return many;
  }

  // Для проверок и отладки.
  App.vocabImport = { parseLine, parseText, splitCsv };
})();
