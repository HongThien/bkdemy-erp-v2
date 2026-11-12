// Soát kỹ thuật ebook2/*.json: kí tự điều khiển (mất \ trong LaTeX), \n nuốt lệnh (\neq,\nu), số $ lẻ trên 1 dòng
const fs = require("fs"), path = require("path"), E = path.join(__dirname, "ebook2");
for (const f of fs.readdirSync(E).filter(f => /^[A-Z]\.json$/.test(f))) {
  const j = JSON.parse(fs.readFileSync(path.join(E, f), "utf8"));
  for (const x of [...(j.nhom || []), ...(j.dang || [])]) for (const k of ["ly_thuyet", "ly_thuyet_sgk", "vi_du"]) {
    const s = x[k] || ""; if (!s) continue;
    if (/[\t\f\b\r\v]/.test(s)) console.log("ĐIỀU KHIỂN", f, x.id, k, JSON.stringify(s.match(/[\t\f\b\r\v].{0,6}/g).slice(0, 3)));
    const nl = s.match(/\n(eq|u\b|abla|ot\b|ewline)[^\n]{0,15}/g); if (nl) console.log("\\n NUỐT", f, x.id, k, JSON.stringify(nl));
    s.split("\n").forEach(l => { const n = (l.replace(/\\\$/g, "").match(/\$/g) || []).length; if (n % 2) console.log("LẺ $", f, x.id, k, l.slice(0, 100)); });
  }
}
