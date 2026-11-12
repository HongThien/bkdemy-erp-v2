// Đề CÓ LỜI GIẢI CHI TIẾT (tvhl, 2025+, đề thật) ⇒ câu kèm lời giải, ghép theo (phần, số câu).
// node trich2.cjs <outdir>  ⇒ de-lg.tsv (thứ tự đề) + cau-lg.jsonl
const fs = require("fs"), path = require("path"), cp = require("child_process");
const OUT = process.argv[2];
const DIR = "C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/.nhap-tam/vatly-thuvienhoclieu";
const ds = JSON.parse(fs.readFileSync(path.join(DIR, "_danh-sach.json"), "utf8"))
  .filter(x => x.tep && /202[5-7]/.test(x.tep) && !/(^|-)Bo-(\d|de)|On-thi|on-thi|DGNL|Danh-gia|Chuyen-de|10-De/i.test(x.tep) && /giải chi tiết/i.test(x.bai));
const uu = x => /Bo-GD|Bộ Giáo Dục|minh-hoa|Minh Họa/i.test(x.tep + x.bai) ? 0 : 1;
const h = s => { let v = 0; for (const c of s) v = (v * 31 + c.charCodeAt(0)) >>> 0; return v; };
ds.sort((a, b) => uu(a) - uu(b) || h(a.tep) - h(b.tep));

function txt(p) {
  if (/\.docx$/i.test(p)) {
    const xml = cp.execFileSync("unzip", ["-p", p, "word/document.xml"], { maxBuffer: 1 << 28 }).toString("utf8");
    return xml.replace(/<wp:posOffset>[^<]*<\/wp:posOffset>|<wp:align>[^<]*<\/wp:align>|<wp14:pctWidth>[^<]*<\/wp14:pctWidth>|<wp14:pctHeight>[^<]*<\/wp14:pctHeight>/g, "")
      .replace(/(Câu\s*\d{1,2}\s*[.:])/g, "\n$1")
      .replace(/<w:tab\/>/g, " ").replace(/<\/w:p>/g, "\n").replace(/<w:br\/>/g, "\n")
      .replace(/<m:t[^>]*>([^<]*)<\/m:t>/g, "$1").replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, "$1").replace(/<[^>]+>/g, "")
      .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
  }
  return cp.execFileSync("antiword", ["-w", "0", p], { maxBuffer: 1 << 28 }).toString("utf8");
}
const RE_PHAN = /^\s*PHẦN\s+(I{1,3}|1|2|3)\b/i;
const RE_CAU = /^\s*Câu\s*(\d{1,2})\s*([.:)]|\(|$)/i;
const RE_DAN = /^\s*(Sử dụng|Dùng|Đọc)\b[^:]{0,100}?câu\s*([\d\s,và\-–đếnCâu]+)/i;
function tach(t) { // → { m: Map("I:3" → text), ctx: Map("III:1" → dẫn chung) }
  const m = new Map(), ctx = new Map(); let phan = "I", cur = null;
  for (const ln of t.split("\n")) {
    const mP = ln.match(RE_PHAN);
    if (mP) { phan = { "1": "I", "2": "II", "3": "III" }[mP[1]] || mP[1].toUpperCase(); cur = null; continue; }
    const mD = ln.match(RE_DAN);
    if (mD) {
      const so = (mD[2].match(/\d+/g) || []).map(Number); let ds2 = so;
      if (/đến|–|-/.test(mD[2]) && so.length === 2) { ds2 = []; for (let q = so[0]; q <= so[1]; q++) ds2.push(q); }
      for (const q of ds2) ctx.set(phan + ":" + q, ln.trim());
      cur = null; continue;
    }
    const mC = ln.match(RE_CAU);
    if (mC) { cur = phan + ":" + +mC[1]; if (!m.has(cur)) m.set(cur, ln.trim()); else cur = null; continue; }
    if (cur && ln.trim()) m.set(cur, m.get(cur) + "\n" + ln.trim());
  }
  return { m, ctx };
}
const gon = (s, n) => { s = s.replace(/^Câu\s*\d+\s*[.:)]?\s*/i, "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim(); return s.length > n ? s.slice(0, n) + " …" : s; };
const out = fs.createWriteStream(path.join(OUT, "cau-lg.jsonl")); const deOut = [];
let id = 0;
ds.forEach((d, i) => {
  const t = txt(path.join(DIR, d.tep)).replace(/[ \t\u00a0]+/g, " ");
  const k = t.search(/\n\s*(LỜI GIẢI|HƯỚNG DẪN GIẢI|Lời giải chi tiết|HƯỚNG DẪN CHẤM|GIẢI CHI TIẾT)/);
  const kd = t.search(/\n\s*(BẢNG ĐÁP ÁN|ĐÁP ÁN|-*\s*HẾT)/);
  const phanDe = t.slice(0, kd > 1500 ? kd : k > 1500 ? k : t.length);
  const de = tach(phanDe), lg = k > 1500 ? tach(t.slice(k)).m : new Map();
  let n = 0, coLg = 0;
  for (const [key, c] of de.m) {
    if (key.startsWith("II:")) continue;
    const l = lg.get(key); if (l) coLg++;
    const dan = de.ctx.get(key);
    out.write(JSON.stringify({ id: "W" + String(++id).padStart(4, "0"), de_so: i + 1, cau: key, loai: key.startsWith("III") ? "TLN" : "TN",
      de_bai: (dan ? "[DẪN CHUNG] " + gon(dan, 500) + " [CÂU] " : "") + gon(c, 700), loi_giai: l ? gon(l, 450) : "" }) + "\n"); n++;
  }
  deOut.push([i + 1, n, coLg, d.tep].join("\t"));
});
out.end(); fs.writeFileSync(path.join(OUT, "de-lg.tsv"), deOut.join("\n"));
console.log("de", ds.length, "cau", id);
