// Choropleth of Iowa counties. No basemap tiles: just county shapes.
window.IAMap = (function () {
  const { escapeHtml: esc, normalizeFips, money } = window.IA;
  const RAMP = ["#d7ece9", "#a6d5cf", "#6bb8af", "#2f918a", "#0e6b66"];
  const ZERO = "#ffffff", NONE = "#cfd6db", INK = "#18232d";
  const compact = (v) => v.toLocaleString("en-US", { style: "currency", currency: "USD", notation: "compact", maximumFractionDigits: 1 });
  const pct = (v) => `${Math.round(v * 100)}%`;
  const METRICS = {
    spent: { label: "Spent in 2025", get: (c) => c.spent, fmt: money, short: compact },
    share: { label: "Spending as a share of funds received", get: (c) => (c.received > 0 && c.spent !== null ? c.spent / c.received : null), fmt: pct, short: pct },
    end: { label: "End balance", get: (c) => c.end, fmt: money, short: compact }
  };
  let counties = [], layer = null, onSelect = () => {}, metric = "spent", selected = "", breaks = [], range = [0, 0];

  const nameKey = (s) => String(s || "").toLowerCase().replace(/\s+county$/, "").replace(/[^a-z0-9]/g, "");

  // Handles COUNTY_FIPS_CODE (e.g. 141), full 19xxx codes, then falls back to county name (O'Brien vs Obrien).
  function match(props = {}) {
    const byFips = new Map(counties.map((c) => [c.fips, c]));
    for (const [k, v] of Object.entries(props)) {
      if (!/fips|geoid/i.test(k)) continue;
      const s = String(v ?? "").trim().replace(/\.0$/, "");
      const f = /^\d{1,3}$/.test(s) && /county|cnty/i.test(k) ? `19${s.padStart(3, "0")}` : normalizeFips(s);
      if (byFips.has(f)) return byFips.get(f);
    }
    for (const [k, v] of Object.entries(props)) {
      if (/^(name|county|countyname|county_name|namelsad)$/i.test(k)) {
        const hit = counties.find((c) => nameKey(c.name) === nameKey(v));
        if (hit) return hit;
      }
    }
    return null;
  }

  function computeBreaks() {
    const vals = counties.map(METRICS[metric].get).filter((v) => v > 0).sort((a, b) => a - b);
    breaks = [1, 2, 3, 4].map((q) => vals[Math.floor((vals.length * q) / 5)]);
    range = [vals[0] || 0, vals[vals.length - 1] || 0];
  }

  function colorOf(c) {
    const v = c && METRICS[metric].get(c);
    if (v === null || v === undefined) return NONE;
    if (v <= 0) return ZERO;
    return RAMP[breaks.filter((t) => v >= t).length];
  }

  const styleOf = (c) => ({ color: c && c.fips === selected ? INK : "#ffffff", weight: c && c.fips === selected ? 3 : 1, fillColor: colorOf(c), fillOpacity: 1 });

  function renderLegend() {
    const m = METRICS[metric], edges = [range[0], ...breaks, range[1]];
    const items = [[NONE, "No data"], [ZERO, metric === "share" ? "0%" : "Reported $0"]];
    RAMP.forEach((col, i) => items.push([col, `${m.short(edges[i])} to ${m.short(edges[i + 1])}`]));
    document.getElementById("legend").innerHTML = items
      .map(([col, t]) => `<li><span class="sw" style="background:${col}"></span>${esc(t)}</li>`).join("");
  }

  const restyle = () => layer && layer.eachLayer((l) => l.setStyle(styleOf(l.county)));

  function tip(c) {
    const m = METRICS[metric], v = m.get(c);
    return `<strong>${esc(c.name)} County</strong><br>${esc(m.label)}: ${v === null ? "Not reported" : m.fmt(v)}`;
  }

  async function init(opts) {
    counties = opts.counties; onSelect = opts.onSelect;
    const el = document.getElementById("map");
    if (!el || typeof L === "undefined") return;
    try {
      const res = await fetch(window.IA_CONFIG.countyGeoJson);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const geo = await res.json();
      const map = L.map("map", { scrollWheelZoom: false, attributionControl: false });
      let matched = 0; const miss = [];
      computeBreaks();
      layer = L.geoJSON(geo, {
        style: (f) => styleOf(match(f.properties)),
        onEachFeature: (f, l) => {
          const c = match(f.properties);
          l.county = c;
          if (!c) { miss.push(f.properties); return; }
          matched += 1;
          l.bindTooltip(() => tip(c), { sticky: true });
          l.on({
            mouseover: (e) => e.target.setStyle({ color: INK, weight: 2 }), // no bringToFront(): it breaks mouseout in Edge
            mouseout: (e) => { e.target.setStyle(styleOf(c)); e.target.closeTooltip(); },
            click: () => onSelect(c)
          });
        }
      }).addTo(map);
      map.on("mouseout", () => { restyle(); layer.eachLayer((l) => l.closeTooltip()); });
      map.fitBounds(layer.getBounds(), { padding: [8, 8] });
      console.info(`Map: ${matched} of ${geo.features.length} features matched a county.`);
      if (miss.length) console.warn("Map: unmatched features (first 3):", JSON.stringify(miss.slice(0, 3)));
      renderLegend();
      document.getElementById("metric").addEventListener("change", (e) => { metric = e.target.value; computeBreaks(); restyle(); renderLegend(); });
    } catch (err) {
      console.warn("Map skipped:", err);
      el.innerHTML = `<p class="note">The map could not load ${esc(window.IA_CONFIG.countyGeoJson)}. Copy County.geojson into this folder. You can still use the search box.</p>`;
    }
  }

  function highlight(fips) { selected = fips; restyle(); }
  return { init, highlight, match, _setCounties: (c) => (counties = c) };
})();
