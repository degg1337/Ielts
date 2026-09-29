/* SVG-графики для Writing Task 1: линейный, столбчатый (сгруппированный) и круговые диаграммы.
   Цвета серий — из проверенной палитры (css: --series-1…5), подписи — цветом текста.
   Под каждым графиком есть таблица данных для экранного диктора и для точных значений. */
(() => {
  "use strict";
  const { esc } = App;

  const W = 480; // ширина viewBox; размер шрифта задаёт CSS (на телефоне крупнее, чтобы подписи читались)
  const fmt = (v, unit) => (unit === "%" ? `${v}%` : `${v}${unit ? " " + unit : ""}`);

  function legend(series) {
    if (series.length < 2) return "";
    return `<ul class="chart-legend" aria-hidden="true">${series.map((s, i) =>
      `<li><span class="swatch s${i + 1}"></span>${esc(s.name)}</li>`).join("")}</ul>`;
  }

  function table(chart) {
    const isPie = chart.type === "pie";
    const head = isPie ? ["", ...chart.series.map((s) => s.name)] : ["", ...chart.labels];
    const rows = isPie
      ? chart.labels.map((l, i) => [l, ...chart.series.map((s) => fmt(s.values[i], chart.unit))])
      : chart.series.map((s) => [s.name, ...s.values.map((v) => fmt(v, chart.unit))]);
    return `<details class="chart-table"><summary>Таблица данных</summary>
      <div class="table-wrap" tabindex="0" role="region" aria-label="Данные графика"><table class="data">
        <thead><tr>${head.map((h) => `<th scope="col">${esc(h)}</th>`).join("")}</tr></thead>
        <tbody>${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th>${r.slice(1).map((c) => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody>
      </table></div></details>`;
  }

  // Общая часть осей: горизонтальная сетка и подписи значений.
  function axes(max, step, plot, unit) {
    let out = "";
    for (let v = 0; v <= max; v += step) {
      const y = plot.y + plot.h - (v / max) * plot.h;
      out += `<line class="grid" x1="${plot.x}" x2="${plot.x + plot.w}" y1="${y}" y2="${y}"/>`;
      out += `<text class="tick" x="${plot.x - 8}" y="${y + 5}" text-anchor="end">${fmt(v, unit === "%" ? "%" : "")}</text>`;
    }
    return out;
  }

  function line(chart) {
    const H = 330;
    const plot = { x: 50, y: 16, w: W - 50 - 100, h: H - 16 - 40 };
    const max = chart.max;
    const step = max <= 30 ? 5 : 10;
    const xAt = (i) => plot.x + (plot.w * i) / (chart.labels.length - 1);
    const yAt = (v) => plot.y + plot.h - (v / max) * plot.h;
    let svg = axes(max, step, plot, chart.unit);
    chart.labels.forEach((l, i) => { svg += `<text class="tick" x="${xAt(i)}" y="${H - 12}" text-anchor="middle">${esc(l)}</text>`; });
    // Прямые подписи в конце линий; разводим их, если значения близки.
    const ends = chart.series.map((s, i) => ({ i, y: yAt(s.values[s.values.length - 1]) })).sort((a, b) => a.y - b.y);
    for (let k = 1; k < ends.length; k++) if (ends[k].y - ends[k - 1].y < 18) ends[k].y = ends[k - 1].y + 18;
    chart.series.forEach((s, si) => {
      const pts = s.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(" ");
      svg += `<polyline class="ln s${si + 1}" points="${pts}"/>`;
      s.values.forEach((v, i) => {
        svg += `<g class="pt"><circle class="hit" cx="${xAt(i)}" cy="${yAt(v)}" r="12"/><circle class="dot s${si + 1}" cx="${xAt(i)}" cy="${yAt(v)}" r="4.5"/><title>${esc(s.name)}, ${esc(chart.labels[i])}: ${fmt(v, chart.unit)}</title></g>`;
      });
      const end = ends.find((e) => e.i === si);
      svg += `<text class="direct" x="${plot.x + plot.w + 10}" y="${end.y + 5}">${esc(s.name)}</text>`;
    });
    return wrapSvg(svg, H, chart);
  }

  function bars(chart) {
    const H = 330;
    const plot = { x: 50, y: 16, w: W - 50 - 8, h: H - 16 - 40 };
    const max = chart.max;
    const step = max <= 30 ? 5 : 10;
    const groupW = plot.w / chart.labels.length;
    const n = chart.series.length;
    const barW = Math.min(30, (groupW * 0.72 - (n - 1) * 2) / n);
    let svg = axes(max, step, plot, chart.unit);
    chart.labels.forEach((l, gi) => {
      const gx = plot.x + gi * groupW + (groupW - (n * barW + (n - 1) * 2)) / 2;
      chart.series.forEach((s, si) => {
        const v = s.values[gi];
        const h = (v / max) * plot.h;
        const x = gx + si * (barW + 2);
        const y = plot.y + plot.h - h;
        const r = Math.min(4, h / 2);
        // Скруглены только верхние углы — основание стоит на оси.
        const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${y + h} Z`;
        svg += `<g class="pt"><path class="bar s${si + 1}" d="${d}"/><rect class="hit" x="${x - 1}" y="${plot.y}" width="${barW + 2}" height="${plot.h}"/><title>${esc(s.name)}, ${esc(l)}: ${fmt(v, chart.unit)}</title></g>`;
      });
      svg += `<text class="tick" x="${plot.x + gi * groupW + groupW / 2}" y="${H - 12}" text-anchor="middle">${esc(l)}</text>`;
    });
    svg += `<line class="baseline" x1="${plot.x}" x2="${plot.x + plot.w}" y1="${plot.y + plot.h}" y2="${plot.y + plot.h}"/>`;
    return wrapSvg(svg, H, chart);
  }

  function pies(chart) {
    // Каждая диаграмма — отдельный SVG: на телефоне они встают друг под другом.
    return `<div class="pie-row">${chart.series.map((s) => {
      const size = 300;
      const cx = size / 2, cy = size / 2 + 12, r = 92;
      const total = s.values.reduce((a, b) => a + b, 0);
      let a0 = -Math.PI / 2;
      let slices = "", labels = "";
      s.values.forEach((v, i) => {
        const a1 = a0 + (v / total) * Math.PI * 2;
        const large = a1 - a0 > Math.PI ? 1 : 0;
        const p = (a, rad) => `${cx + rad * Math.cos(a)},${cy + rad * Math.sin(a)}`;
        slices += `<g class="pt"><path class="slice s${i + 1}" d="M${cx},${cy} L${p(a0, r)} A${r},${r} 0 ${large} 1 ${p(a1, r)} Z"/><title>${esc(chart.labels[i])} (${esc(s.name)}): ${fmt(v, chart.unit)}</title></g>`;
        const mid = (a0 + a1) / 2;
        const lx = cx + (r + 24) * Math.cos(mid);
        const ly = cy + (r + 24) * Math.sin(mid);
        labels += `<text class="direct pct" x="${lx}" y="${ly + 5}" text-anchor="middle">${fmt(v, chart.unit)}</text>`;
        a0 = a1;
      });
      return `<figure class="pie"><svg viewBox="0 0 ${size} ${size + 16}" role="img" aria-label="${esc(chart.title)}, ${esc(s.name)}">
        <text class="pie-title" x="${cx}" y="18" text-anchor="middle">${esc(s.name)}</text>${slices}${labels}</svg></figure>`;
    }).join("")}</div>`;
  }

  function wrapSvg(inner, H, chart) {
    return `<svg class="chart-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(chart.title)}">${inner}</svg>`;
  }

  function render(chart) {
    const body = chart.type === "line" ? line(chart) : chart.type === "bar" ? bars(chart) : pies(chart);
    const keys = chart.type === "pie"
      ? legend(chart.labels.map((name) => ({ name })))
      : legend(chart.series);
    return `<figure class="chart">
      <figcaption class="chart-title">${esc(chart.title)}</figcaption>
      ${keys}${body}${table(chart)}
    </figure>`;
  }

  App.charts = { render };
})();
