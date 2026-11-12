// Đếm tần suất dạng của một lô: node dem.cjs <thu_muc_lo (b1)> [thuc-don.md]
const fs = require("fs"), path = require("path");
const B = process.argv[2], V = path.dirname(B);
const cau = new Map(fs.readFileSync(fs.existsSync(path.join(B, "cau.jsonl")) ? path.join(B, "cau.jsonl") : path.join(V, "out", "cau-lg.jsonl"), "utf8").trim().split("\n").map(l => { const o = JSON.parse(l); return [o.id, o]; }));
const ten = {}; for (const l of fs.readFileSync(process.argv[3] || path.join(V, "thuc-don.md"), "utf8").split("\n")) { const m = l.match(/^- ([A-Z]\d+\.\d+(?:\.\d+)?) (.*)/); if (m) ten[m[1]] = m[2]; }
const rows = []; const loi = [];
for (const f of fs.readdirSync(path.join(B, "kq")).filter(f => f.endsWith(".tsv")).sort()) {
  for (const l of fs.readFileSync(path.join(B, "kq", f), "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue; const c = l.split("\t");
    if (c.length < 6 || !cau.has(c[0])) { loi.push(f + ": " + l.slice(0, 80)); continue; }
    rows.push({ id: c[0], chuong: c[1], dang: c[2], mo_ta: c[3] || "", muc: c[4], chac: c[5], gc: c[6] || "", de: cau.get(c[0]).de_so, loai: cau.get(c[0]).loai });
  }
}
const g = {};
for (const r of rows) {
  const k = r.dang === "NEW" || r.dang === "?" || r.chuong === "O" ? r.chuong + "|NEW|" + r.mo_ta.toLowerCase() : r.chuong + "|" + r.dang;
  const x = g[k] = g[k] || { k, chuong: r.chuong, dang: r.dang, mo_ta: r.mo_ta, n: 0, de: new Set(), muc: [0, 0, 0, 0, 0], tln: 0, khong_chac: 0, mau: [] };
  x.n++; x.de.add(r.de); x.muc[+r.muc || 0]++; if (r.loai === "TLN") x.tln++; if (r.chac === "0") x.khong_chac++; if (x.mau.length < 3) x.mau.push(r.id);
}
const ch = {}; rows.forEach(r => ch[r.chuong] = (ch[r.chuong] || 0) + 1);
const ds = Object.values(g).sort((a, b) => a.k.localeCompare(b.k));
let out = `# Tần suất lô ${path.basename(B)} — ${rows.length} câu, ${new Set(rows.map(r => r.de)).size} đề\n\nChương: ${JSON.stringify(ch)} · lỗi dòng: ${loi.length}\n\n| chương | dạng | tên / mô tả | câu | đề | TLN | mức 1-4 | không chắc | mẫu |\n|---|---|---|---|---|---|---|---|---|\n`;
for (const x of ds) out += `| ${x.chuong} | ${x.dang} | ${x.dang === "NEW" || x.chuong === "O" || x.dang === "?" ? x.mo_ta : (ten[x.dang] || "?")} | ${x.n} | ${x.de.size} | ${x.tln} | ${x.muc.slice(1).join("/")} | ${x.khong_chac} | ${x.mau.join(" ")} |\n`;
const thieu = Object.keys(ten).filter(m => !ds.some(x => x.dang === m));
out += `\nDạng thực đơn KHÔNG có câu nào: ${thieu.join(", ") || "—"}\n`;
if (loi.length) out += "\nDòng lỗi:\n" + loi.slice(0, 20).join("\n") + "\n";
fs.writeFileSync(path.join(B, "tan-suat.md"), out);
fs.writeFileSync(path.join(B, "gan.json"), JSON.stringify(rows));
console.log(`cau ${rows.length} | nhom ${ds.length} | NEW ${rows.filter(r => r.dang === "NEW").length} | ? ${rows.filter(r => r.dang === "?").length} | O ${ch.O || 0} | loi ${loi.length} | thuc don trong ${thieu.length}`);
