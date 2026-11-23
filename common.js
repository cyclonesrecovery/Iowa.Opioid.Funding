window.IA = (function () {
  const escapeHtml = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  // Strict: only full 5-digit Iowa codes (19xxx).
  const normalizeFips = (raw) => { const s = String(raw ?? "").trim().replace(/\.0$/, ""); return /^19\d{3}$/.test(s) ? s : ""; };
  const parseNumber = (v) => { const n = Number(String(v ?? "0").replace(/[$,]/g, "")); return Number.isFinite(n) ? n : 0; };
  const money = (v) => Number(v || 0).toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });
  const loadCsv = (url) => new Promise((resolve, reject) => Papa.parse(url, {
    download: true, header: true, skipEmptyLines: true,
    transformHeader: (h) => String(h).replace(/^\uFEFF/, "").trim(), // guards against BOM / stray spaces
    complete: (r) => resolve(r.data || []),
    error: (e) => reject(new Error(`Failed to load ${url}: ${e.message || e}`))
  }));
  return { escapeHtml, normalizeFips, parseNumber, money, loadCsv };
})();
