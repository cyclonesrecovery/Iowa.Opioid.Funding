(function () {
  const { escapeHtml: esc, normalizeFips, parseNumber, money, loadCsv } = window.IA;
  const $ = (id) => document.getElementById(id);
  const num = (v) => (String(v ?? "").trim() === "" ? null : parseNumber(v)); // blank = not reported, not $0
  const reported = (c) => [c.start, c.received, c.spent, c.end].some((v) => v !== null);
  const counties = [], byFips = new Map();

  async function init() {
    try {
      const rows = await loadCsv(window.IA_CONFIG.files.funding);
      let totalRow = null;
      for (const r of rows) {
        const c = { fips: normalizeFips(r.FIPS), name: String(r.County || "").trim(),
          start: num(r["Start Balance"]), received: num(r["Funds Received"]), spent: num(r.Expenditures),
          end: num(r["End Balance"]), activities: String(r["Funded Activities"] || "").trim() };
        if (c.fips) { counties.push(c); byFips.set(c.fips, c); } else if (/^total$/i.test(c.name)) totalRow = c;
      }
      const sum = (k) => counties.reduce((a, c) => a + (c[k] || 0), 0);
      if (totalRow && ["start", "received", "spent", "end"].some((k) => Math.abs(sum(k) - totalRow[k]) > 1))
        console.warn("Total row does not match the sum of counties. Check the data file.");
      renderState(sum);
      setupSearch();
      const p = new URLSearchParams(location.search);
      const c = byFips.get(normalizeFips(p.get("fips"))) ||
        counties.find((x) => x.name.toLowerCase() === String(p.get("county") || "").toLowerCase().replace(/ county$/, ""));
      if (c) { $("q").value = `${c.name} County`; show(c, false); }
      $("status").hidden = true;
    } catch (err) {
      console.error(err);
      $("status").textContent = `Could not load the funding data. ${err.message}`;
    }
  }

  function renderState(sum) {
    const rep = counties.filter(reported);
    const spent = rep.map((c) => c.spent || 0).sort((a, b) => a - b), m = spent.length >> 1;
    const median = spent.length % 2 ? spent[m] : (spent[m - 1] + spent[m]) / 2;
    const withSpend = rep.filter((c) => c.spent > 0).length, zero = rep.length - withSpend;
    const none = counties.length - rep.length;
    $("state").innerHTML = `
      <dl class="ledger">
        <div><dt>Funds received</dt><dd>${money(sum("received"))}</dd></div>
        <div><dt>Spent</dt><dd>${money(sum("spent"))}</dd></div>
        <div><dt>Combined end balances</dt><dd>${money(sum("end"))}</dd></div>
        <div><dt>Median county spending</dt><dd>${money(median)}</dd></div>
      </dl>
      <p>${withSpend} counties reported spending. ${zero} reported $0 spent${none ? `, and ${none} did not report figures` : ""}.</p>`;
  }

  function activities(t) {
    if (!t) return `<p class="note">No funded activities were listed.</p>`;
    if (t.length <= 600) return `<p class="acts">${esc(t)}</p>`;
    const cut = t.lastIndexOf(" ", 600);
    return `<p class="acts">${esc(t.slice(0, cut))} …</p><details><summary>Read the rest</summary><p class="acts">${esc(t.slice(cut))}</p></details>`;
  }

  function show(c, updateUrl = true) {
    if (updateUrl) history.replaceState(null, "", `?fips=${c.fips}`);
    let body;
    if (!reported(c)) {
      body = `<p class="note">${esc(c.name)} County has no funding figures in this dataset. That is different from spending nothing.</p>`;
    } else {
      const row = (l, v) => `<div><dt>${l}</dt><dd>${v === null ? "Not reported" : money(v)}</dd></div>`;
      const gap = Math.abs((c.start || 0) + (c.received || 0) - (c.spent || 0) - (c.end || 0)) > 1;
      const line = c.spent === 0 ? `${esc(c.name)} County reported spending $0 in 2025.`
        : c.received > 0 && c.spent ? `Spending equals ${Math.round((c.spent / c.received) * 100)}% of the funds received during the year.` : "";
      body = `<dl class="ledger">${row("Start balance", c.start)}${row("Funds received", c.received)}${row("Spent", c.spent)}${row("End balance", c.end)}</dl>
        ${line ? `<p>${line}</p>` : ""}
        ${gap ? `<p class="note">Start balance + funds received − spent does not equal the reported end balance. Figures are shown as reported.</p>` : ""}
        <h3>What the county reported funding</h3>${activities(c.activities)}`;
    }
    const link = window.IA_CONFIG.directoryCountyUrl + c.fips;
    $("county").innerHTML = `<h2 tabindex="-1" id="county-name">${esc(c.name)} County</h2>${body}
      <p><a href="${esc(link)}">See this county’s fire, EMS, health and hospital listings</a></p>`;
    if (updateUrl) $("county-name").focus();
  }

  function setupSearch() {
    const input = $("q"), list = $("results");
    let items = [], active = -1;
    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); active = -1; };
    const setActive = (i) => {
      active = i;
      [...list.children].forEach((li, j) => li.setAttribute("aria-selected", String(j === i)));
      if (i >= 0) input.setAttribute("aria-activedescendant", list.children[i].id);
    };
    const choose = (c) => { input.value = `${c.name} County`; close(); show(c); };
    input.addEventListener("input", () => {
      const q = input.value.trim().toLowerCase().replace(/ county$/, "");
      if (!q) return close();
      items = counties.filter((c) => c.name.toLowerCase().includes(q) || c.fips.includes(q))
        .sort((a, b) => b.name.toLowerCase().startsWith(q) - a.name.toLowerCase().startsWith(q) || a.name.localeCompare(b.name))
        .slice(0, 8);
      list.innerHTML = items.length
        ? items.map((c, i) => `<li role="option" id="opt-${i}" data-i="${i}">${esc(c.name)} County</li>`).join("")
        : `<li class="none">No Iowa county matches “${esc(input.value.trim())}”.</li>`;
      list.hidden = false; input.setAttribute("aria-expanded", "true"); setActive(items.length ? 0 : -1);
    });
    input.addEventListener("keydown", (e) => {
      if (list.hidden) return;
      if (e.key === "ArrowDown") { e.preventDefault(); setActive(Math.min(active + 1, items.length - 1)); }
      else if (e.key === "ArrowUp") { e.preventDefault(); setActive(Math.max(active - 1, 0)); }
      else if (e.key === "Enter" && active >= 0) { e.preventDefault(); choose(items[active]); }
      else if (e.key === "Escape") close();
    });
    list.addEventListener("mousedown", (e) => { const li = e.target.closest("[data-i]"); if (li) { e.preventDefault(); choose(items[li.dataset.i]); } });
    input.addEventListener("blur", close);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
