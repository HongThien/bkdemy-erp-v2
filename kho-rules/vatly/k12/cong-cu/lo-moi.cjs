// Dựng một LÔ mới cho trạm đọc: node lo-moi.cjs <ten_lo b2> <so_phan> <danh_sach_de.txt>
// danh_sach_de.txt: mỗi dòng "tvhl<TAB>tên file" hoặc "ms<TAB>tên file" (ms = file "Lời giải" MapStudy, giải xen dưới câu)
// Khử trùng với mọi lô trước (khoa.txt). Ra: <lo>/lo/lo-N.txt, <lo>/cau.jsonl, <lo>/de.tsv
const fs = require("fs"), path = require("path"), cp = require("child_process");
const V = __dirname, [, , LO, NP, DS] = process.argv;
const B = path.join(V, LO); fs.mkdirSync(path.join(B, "lo"), { recursive: true }); fs.mkdirSync(path.join(B, "kq"), { recursive: true });
const NHAP = "C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/.nhap-tam";
const KF = path.join(V, "khoa.txt"); const daGap = new Set(fs.existsSync(KF) ? fs.readFileSync(KF, "utf8").split("\n") : []);
const khoa = s => s.toLowerCase().normalize("NFC").replace(/\[dẫn chung\].*?\[câu\]/, "").replace(/[^a-zà-ỹđ0-9]/g, "").slice(0, 140);

function docx(p) {
  const xml = cp.execFileSync("unzip", ["-p", p, "word/document.xml"], { maxBuffer: 1 << 28 }).toString("utf8");
  return xml.replace(/<wp:posOffset>[^<]*<\/wp:posOffset>|<wp:align>[^<]*<\/wp:align>|<wp14:pct\w+>[^<]*<\/wp14:pct\w+>/g, "")
    .replace(/(Câu\s*\d{1,2}\s*[.:])/g, "\n$1").replace(/<w:tab\/>/g, " ").replace(/<\/w:p>/g, "\n").replace(/<w:br\/>/g, "\n")
    .replace(/<m:t[^>]*>([^<]*)<\/m:t>/g, "$1").replace(/<w:t[^>]*>([^<]*)<\/w:t>/g, "$1").replace(/<[^>]+>/g, "")
    .replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&apos;/g, "'");
}
const doc = p => cp.execFileSync("antiword", ["-w", "0", p], { maxBuffer: 1 << 28 }).toString("utf8");
const pdf = p => cp.execFileSync("pdftotext", ["-enc", "UTF-8", p, "-"], { maxBuffer: 1 << 28 }).toString("utf8");
const RE_PHAN = /^\s*PHẦN\s+(I{1,3}|1|2|3)\b/i, RE_CAU = /^\s*Câu\s*(\d{1,2})\s*([.:)]|\(|$)/i;
const RE_DAN = /^\s*(Sử dụng|Dùng|Đọc)\b[^:]{0,100}?câu\s*([\d\s,và\-–đếnCâu]+)/i;
function tach(t) {
  const m = new Map(), ctx = new Map(); let phan = "I", cur = null;
  for (const ln of t.split("\n")) {
    const mP = ln.match(RE_PHAN); if (mP) { phan = { "1": "I", "2": "II", "3": "III" }[mP[1]] || mP[1].toUpperCase(); cur = null; continue; }
    const mD = ln.match(RE_DAN);
    if (mD) { const so = (mD[2].match(/\d+/g) || []).map(Number); let d2 = so; if (/đến|–|-/.test(mD[2]) && so.length === 2) { d2 = []; for (let q = so[0]; q <= so[1]; q++) d2.push(q); } for (const q of d2) ctx.set(phan + ":" + q, ln.trim()); cur = null; continue; }
    const mC = ln.match(RE_CAU); if (mC) { cur = phan + ":" + +mC[1]; if (!m.has(cur)) m.set(cur, ln.trim()); else cur = null; continue; }
    if (cur && ln.trim()) m.set(cur, m.get(cur) + "\n" + ln.trim());
  }
  return { m, ctx };
}
const gon = (s, n) => { s = s.replace(/^Câu\s*\d+\s*[.:)]?\s*/i, "").replace(/\s*\n\s*/g, " ").replace(/\s{2,}/g, " ").trim(); return s.length > n ? s.slice(0, n) + " …" : s; };

const ds = fs.readFileSync(DS, "utf8").split(/\r?\n/).filter(Boolean).map(l => l.split("\t"));
const cau = [], deOut = []; let id = 0, trung = 0;
const tien = LO.toUpperCase().replace(/[^A-Z0-9]/g, "");
ds.forEach(([ng, ten], i) => {
  let de, lg;
  if (ng === "tvhl") {
    const p = path.join(NHAP, "vatly-thuvienhoclieu", ten); const t = (/\.doc$/i.test(ten) ? doc(p) : docx(p)).replace(/[ \t\u00a0]+/g, " ");
    const k = t.search(/\n\s*(LỜI GIẢI|HƯỚNG DẪN GIẢI|Lời giải chi tiết|HƯỚNG DẪN CHẤM|GIẢI CHI TIẾT|II\. GIẢI CHI TIẾT|LÝ GIẢI)/);
    const kd = t.search(/\n\s*(BẢNG ĐÁP ÁN|ĐÁP ÁN|-*\s*HẾT)/);
    de = tach(t.slice(0, kd > 1500 ? kd : k > 1500 ? k : t.length)); lg = k > 1500 ? tach(t.slice(k).replace(/GIẢI CHI TIẾT PHẦN (I{1,3})/g, "\nPHẦN $1")).m : new Map();
  } else { // ms: giải xen dưới câu
    const t = pdf(path.join(NHAP, "vatly-mapstudy-12", ten)).replace(/[ \t\u00a0]+/g, " ");
    de = tach(t); lg = new Map();
    for (const [k, v] of de.m) { const j = v.search(/\n\s*(Hướng dẫn|Lời giải|Giải)\b/); const jc = v.search(/\n\s*Chọn\s+[A-D]\b/);
      const cut = j > 0 ? j : jc > 0 ? jc : -1; if (cut > 0) { de.m.set(k, v.slice(0, cut)); lg.set(k, v.slice(cut)); } }
  }
  let n = 0, nlg = 0;
  for (const [key, c] of de.m) {
    if (key.startsWith("II:")) continue;
    const dan = de.ctx.get(key); const deBai = (dan ? "[DẪN CHUNG] " + gon(dan, 500) + " [CÂU] " : "") + gon(c, 700);
    if (deBai.length < 30) continue;
    const kh = khoa(deBai); if (daGap.has(kh)) { trung++; continue; } daGap.add(kh);
    const l = lg.get(key); if (l) nlg++;
    cau.push({ id: tien + "-" + String(++id).padStart(4, "0"), de_so: i + 1, cau: key, loai: key.startsWith("III") ? "TLN" : "TN", de_bai: deBai, loi_giai: l ? gon(l, 450) : "" }); n++;
  }
  deOut.push([i + 1, ng, n, nlg, ten].join("\t"));
});
fs.writeFileSync(path.join(B, "cau.jsonl"), cau.map(c => JSON.stringify(c)).join("\n") + "\n");
fs.writeFileSync(path.join(B, "de.tsv"), deOut.join("\n"));
const k = Math.ceil(cau.length / +NP);
for (let i = 0; i < +NP; i++) fs.writeFileSync(path.join(B, "lo", `lo-${i + 1}.txt`), cau.slice(i * k, (i + 1) * k).map(c => `### ${c.id} | ${c.loai}\nĐỀ: ${c.de_bai}${c.loi_giai ? "\nLỜI GIẢI: " + c.loi_giai : ""}`).join("\n\n") + "\n");
fs.writeFileSync(KF, [...daGap].join("\n"));
console.log(JSON.stringify({ de: ds.length, cau: cau.length, co_lg: cau.filter(c => c.loi_giai).length, trung_lo_truoc: trung }));
console.log(deOut.join("\n"));
