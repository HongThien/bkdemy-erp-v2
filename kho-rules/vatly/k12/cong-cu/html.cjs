// Dựng HTML đề xuất bản đồ Vật lý 12: node html.cjs <cay.md> <out.html> b1 b2 b3 ...
const fs = require("fs"), path = require("path");
const V = __dirname, [, , CAY, OUT, ...LOS] = process.argv;
const CFG = JSON.parse(fs.readFileSync(path.join(V, "html-cfg.json"), "utf8"));
const DANG_MOI = CFG.dang_moi || {}, CAU_HOI = CFG.cau_hoi || [];
const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ── cây
const cay = []; let cd, cdd, nh;
for (const l of fs.readFileSync(path.join(V, CAY), "utf8").split(/\r?\n/)) {
  let m;
  if ((m = l.match(/^## (NHIET|KHI|TU|HN) — (.*)/))) { cd = { ma: m[1], ten: m[2], cdd: [] }; cay.push(cd); }
  else if ((m = l.match(/^### ([A-Z]\d+) (.*)/)) && cd) { cdd = { ma: m[1], ten: m[2], nhom: [] }; cd.cdd.push(cdd); }
  else if ((m = l.match(/^#### ([A-Z]\d+\.\d+) (.*)/)) && cdd) { nh = { ma: m[1], ten: m[2], dang: [] }; cdd.nhom.push(nh); }
  else if ((m = l.match(/^- ([A-Z]\d+\.\d+\.\d+) (.*?) — (.*)/)) && nh) nh.dang.push({ ma: m[1], ten: m[2].replace(/\s*\[[^\]]*\]/g, ""), co: (m[2].match(/\[([^\]]*)\]/g) || []).join(" "), mo_ta: m[3] });
  else if (/^## Ngoài/.test(l)) cd = null;
}
const dangMa = new Set(cay.flatMap(c => c.cdd.flatMap(x => x.nhom.flatMap(n => n.dang.map(d => d.ma)))));

// ── quy đổi lô 1 (thực đơn cũ) → mã cây; LT/TÍNH ước bằng chữ trong đề
const MAP = { "N1.1": "N1.1.1", "N1.2": "N1.2.1", "N1.3": "N1.2.2", "N2.1": "N2.1.1", "N2.2": ["N2.2.1", "N2.2.2"], "N2.3": "N2.2.3", "N3.1": "N3.1.1", "N3.3": "N3.1.2", "N3.2": "N3.2.1",
  "N4.1": "N4.1.1", "N4.2": "N4.2.1", "N4.3": "N4.2.2", "N4.4": "N4.2.3", "N4.5": "N4.3.1", "N4.6": "N4.3.2", "N4.7": "N4.4.1",
  "K1.1": "K1.1.1", "K1.2": "K3.1.3", "K2.1": ["K2.1.1", "K2.1.2"], "K2.2": ["K2.1.1", "K2.1.3"], "K2.3": ["K2.1.1", "K2.1.4"], "K2.4": "K2.1.5", "K2.5": "K3.2.1", "K3.1": "K3.1.1", "K3.2": "K3.1.2", "K3.3": "K3.2.2",
  "K4.1": ["K4.1.1", "K4.1.2"], "K4.2": ["K4.2.1", "K4.2.2"],
  "T1.1": "T1.1.1", "T1.2": "T1.1.2", "T2.1": "T2.1.1", "T2.2": ["T2.1.2", "T2.1.3"], "T2.3": "T2.1.4", "T2.4": "T2.2.2", "T2.5": "T2.2.1", "T3.1": ["T3.1.1", "T3.1.2"], "T3.2": "T3.2.1", "T3.3": "T3.2.2", "T3.4": "T3.2.3", "T3.5": "T3.3.1",
  "T4.1": "T4.1.1", "T4.2": "T4.2.1", "T4.3": "T4.2.1", "T4.4": ["T4.3.1", "T4.3.2"], "T5.1": "T5.1.1", "T5.2": "T5.1.2",
  "H1.1": ["H1.1.1", "H1.1.2"], "H1.2": "H1.1.2", "H2.1": "H2.1.1", "H2.2": "H2.1.1", "H2.3": "H2.1.2", "H3.1": "H3.1.1", "H4.2": "H3.1.1", "H3.2": "H3.1.2", "H3.3": ["H3.2.1", "H3.2.2"],
  "H4.1": "H4.1.1", "H4.3": "H4.2.1", "H4.4": "H4.2.2", "H4.5": "H4.2.3", "H4.6": "H4.3.1" };
const NEW_MAP = [[/plasma/i, "N1.1.1"], [/cơ năng hao hụt/i, "N2.2.2"], [/động cơ nhiệt/i, "N2.2.3"], [/thông số trạng thái/i, "K1.1.1"], [/hai dây dẫn thẳng song song/i, "T1.1.1"],
  [/thanh trượt.*tụ/i, "T3.2.3"], [/rutherford/i, "H1.1.1"], [/phóng xạ/i, "H4.1.1"], [/dòng (điện )?thẳng dài/i, "T1.1.3"], [/thí nghiệm.*(định luật )?chất khí/i, "K2.1.6"],
  [/dẫn nhiệt/i, "N3.1.1"], [/chuông điện/i, "T2.2.1"], [/lực hạt nhân/i, "H1.1.1"], [/khinh khí cầu/i, "K3.2.1"],
  [/đơn vị khối lượng nguyên tử/i, "H2.1.1"], [/dây chuyền/i, "H3.2.2"], [/đếm hạt/i, "H4.2.1"], [/pittông/i, "K3.2.1"], [/cực đại từ đồ thị/i, "K2.1.5"],
  [/cal/i, "N4.2.1"], [/tủ lạnh/i, "N2.2.3"], [/wien/i, "__O"]];
const laTinh = (t, loai) => loai === "TLN" || /bao nhiêu|tính|giá trị|gần (nhất|đúng)|xấp xỉ|A\.\s*[\d,.]+\s*[a-zA-Zμ°%]/i.test(t.replace(/\[DẪN CHUNG\][^[]*\[CÂU\]/, ""));

// ── gom tất cả lô
const thong = {}; dangMa.forEach(m => thong[m] = { n: 0, de: new Set(), muc: [0, 0, 0, 0, 0], tln: 0, uoc: 0, mau: [], theoLo: {} });
const ngoai = [], newCon = [], loTk = [];
for (const LO of LOS) {
  const B = path.join(V, LO);
  const cau = new Map(fs.readFileSync(fs.existsSync(path.join(B, "cau.jsonl")) ? path.join(B, "cau.jsonl") : path.join(V, "out", "cau-lg.jsonl"), "utf8").trim().split("\n").map(l => { const o = JSON.parse(l); return [o.id, o]; }));
  const deTen = fs.existsSync(path.join(B, "de.tsv")) ? fs.readFileSync(path.join(B, "de.tsv"), "utf8").trim().split("\n").map(l => l.split("\t").pop()) : [];
  let nCau = 0, nNew = 0, nO = 0; const newKieu = new Set();
  for (const f of fs.readdirSync(path.join(B, "kq")).filter(f => f.endsWith(".tsv"))) for (const l of fs.readFileSync(path.join(B, "kq", f), "utf8").split(/\r?\n/)) {
    if (!l.trim()) continue; const c = l.split("\t"); const q = cau.get(c[0]); if (!q) continue; nCau++;
    const r = { id: c[0], chuong: c[1], dang: c[2], mo_ta: c[3] || "", muc: +c[4] || 0, gc: c[6] || "" };
    let ma = null, uoc = false;
    if (r.chuong === "O" || r.chuong === "HONG") { nO++; ngoai.push({ lo: LO, mo_ta: r.mo_ta, de: q.de_bai }); continue; }
    if (r.dang === "NEW" || r.dang === "?") {
      nNew++; newKieu.add(r.chuong + ": " + r.mo_ta);
      const hit = NEW_MAP.find(([re]) => re.test(r.mo_ta));
      if (hit && hit[1] === "__O") { ngoai.push({ lo: LO, mo_ta: r.mo_ta, de: q.de_bai }); continue; }
      if (hit) { ma = hit[1]; uoc = true; } else { newCon.push({ lo: LO, ...r, de: q.de_bai }); continue; }
    } else if (dangMa.has(r.dang)) ma = r.dang;
    else if (MAP[r.dang]) { const t = MAP[r.dang]; if (Array.isArray(t)) { ma = laTinh(q.de_bai, q.loai) ? t[1] : t[0]; uoc = true; } else ma = t; }
    if (!ma || !thong[ma]) { newCon.push({ lo: LO, ...r, de: q.de_bai }); continue; }
    const x = thong[ma]; x.n++; x.de.add(LO + ":" + q.de_so); x.muc[r.muc]++; if (q.loai === "TLN") x.tln++; if (uoc) x.uoc++; x.theoLo[LO] = (x.theoLo[LO] || 0) + 1;
    if (!uoc && x.mau.length < 3 && q.de_bai.length > 40) x.mau.push({ de: q.de_bai.replace(/\s*\[CÂU\]\s*/, " → "), muc: r.muc, loai: q.loai });
  }
  loTk.push({ lo: LO, de: deTen.length || 50, cau: nCau, nNew, nO, kieu: [...newKieu] });
}
// mẫu dự phòng cho dạng chỉ có câu ước lượng
const tongDe = loTk.reduce((a, l) => a + l.de, 0), tongCau = Object.values(thong).reduce((a, x) => a + x.n, 0);
const mucTxt = m => ["", "NB", "TH", "VD", "VDC"][m] || "";
const thanh = (n, max) => `<span class="bar"><i style="width:${Math.max(2, Math.round(100 * n / max))}%"></i></span>`;
const maxN = Math.max(...Object.values(thong).map(x => x.n));
let soNhom = 0, soDang = 0, soCdd = 0;
let body = "";
for (const c of cay) {
  const nCD = c.cdd.flatMap(x => x.nhom.flatMap(n => n.dang)).reduce((a, d) => a + thong[d.ma].n, 0);
  body += `<section class="cd"><h2><span class="ma">${c.ma}</span>${esc(c.ten)} <small>${nCD} câu · ${(100 * nCD / tongCau).toFixed(0)}% đề</small></h2>`;
  for (const x of c.cdd) { soCdd++;
    body += `<div class="cdd"><h3><span class="ma">${x.ma}</span>${esc(x.ten)}</h3>`;
    for (const n of x.nhom) { soNhom++;
      const nN = n.dang.reduce((a, d) => a + thong[d.ma].n, 0);
      body += `<div class="nhom"><h4><span class="ma">${n.ma}</span>${esc(n.ten)} <small>${nN} câu</small></h4><table><tr><th>Dạng bài</th><th class="r">Câu</th><th class="r">Số đề có</th><th>NB/TH/VD/VDC</th></tr>`;
      for (const d of n.dang) { soDang++;
        const t = thong[d.ma]; const pDe = (100 * t.de.size / tongDe).toFixed(0);
        body += `<tr><td><div class="dten"><span class="ma">${d.ma}</span>${esc(d.ten)} ${d.co ? `<span class="co">${esc(d.co.replace(/[\[\]]/g, ""))}</span>` : ""}${t.n < 8 ? `<span class="co it">ít câu</span>` : ""}</div><div class="mota">${esc(d.mo_ta)}</div>
          ${t.mau.length ? `<details><summary>Câu mẫu (${t.mau.length})</summary>${t.mau.map(m => `<p class="mau"><b>${m.loai} · ${mucTxt(m.muc)}</b> ${esc(m.de.slice(0, 360))}</p>`).join("")}</details>` : ""}</td>
          <td class="r">${thanh(t.n, maxN)} ${t.n}${t.uoc ? `<sup title="${t.uoc} câu lô 1 quy đổi ước lượng">~</sup>` : ""}</td><td class="r">${t.de.size} <small>(${pDe}%)</small></td><td>${t.muc.slice(1).join(" / ")}</td></tr>`;
      }
      body += `</table></div>`;
    }
    body += `</div>`;
  }
  body += `</section>`;
}
const ngoaiNhom = {}; ngoai.forEach(o => { const k = o.mo_ta.replace(/^Lý \d+(\/\d+)?:\s*/, "").toLowerCase(); ngoaiNhom[k] = (ngoaiNhom[k] || 0) + 1; });

const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Bản đồ Vật lý 12</title>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#6b6b70;--line:#e3e3e0;--acc:#2f5bd3;--acc2:#e8eefc;--warn:#b35c00;--warn2:#fff2e0;--ok:#1f7a4d}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--card:#1d1d20;--ink:#ececee;--mute:#9a9aa2;--line:#2f2f34;--acc:#8fb0ff;--acc2:#22293d;--warn:#ffb466;--warn2:#3a2a14;--ok:#6fd4a0}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1060px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:24px;margin:0 0 4px}.sub{color:var(--mute);margin:0 0 20px}
.kpi{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:10px;margin:16px 0 24px}
.kpi div{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px}.kpi b{display:block;font-size:22px}.kpi span{color:var(--mute);font-size:13px}
section.cd{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:0 0 18px}
h2{font-size:20px;margin:0 0 10px}h3{font-size:16px;margin:16px 0 6px;color:var(--acc)}h4{font-size:15px;margin:10px 0 6px}
small{color:var(--mute);font-weight:400}
.ma{font:12px ui-monospace,Consolas,monospace;color:var(--mute);margin-right:6px}
.cdd{border-left:3px solid var(--acc2);padding-left:12px;margin:8px 0}
.nhom{margin:6px 0 12px}
table{width:100%;border-collapse:collapse;font-size:14px}th{font-weight:600;text-align:left;color:var(--mute);font-size:12px;border-bottom:1px solid var(--line);padding:4px 6px}
td{border-bottom:1px solid var(--line);padding:6px;vertical-align:top}.r{text-align:right;white-space:nowrap}
.dten{font-weight:600}.mota{color:var(--mute);font-size:13px}
.co{display:inline-block;font-size:11px;font-weight:600;padding:1px 6px;border-radius:999px;background:var(--acc2);color:var(--acc);margin-left:4px}.co.it{background:var(--warn2);color:var(--warn)}
.bar{display:inline-block;width:60px;height:6px;background:var(--line);border-radius:3px;vertical-align:middle;margin-right:6px}.bar i{display:block;height:100%;background:var(--acc);border-radius:3px}
details{margin-top:4px}summary{cursor:pointer;color:var(--acc);font-size:12px}.mau{font-size:13px;margin:4px 0;padding:6px 8px;background:var(--bg);border-radius:6px}
.box{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:0 0 18px}
.q{border-left:3px solid var(--warn);padding:4px 0 4px 12px;margin:10px 0}.q b{color:var(--warn)}
ul{margin:6px 0;padding-left:20px}
@media (max-width:640px){td:nth-child(4),th:nth-child(4){display:none}.bar{display:none}}
</style></head><body><main>
<h1>Bản đồ kiến thức Vật lý 12 — đề xuất</h1>
<p class="sub">Dựng từ ĐỀ THI THẬT 2025–2027 (đề chính thức Bộ GD 2025–2026, minh hoạ 2025, thi thử / khảo sát của sở và trường). Chưa ghi DB — chờ duyệt.</p>
<div class="kpi"><div><b>4</b><span>chủ đề (chương)</span></div><div><b>${soCdd}</b><span>chuyên đề</span></div><div><b>${soNhom}</b><span>nhóm bài</span></div><div><b>${soDang}</b><span>dạng bài</span></div><div><b>${tongDe}</b><span>đề đã đọc</span></div><div><b>${tongCau}</b><span>câu xếp được vào cây</span></div></div>

<div class="box"><h2>Đường cong bão hoà — vì sao dừng ở đây</h2>
<p>Mỗi lô đọc thêm đề mới, đếm số câu <b>không khớp</b> dạng nào có sẵn (NEW). Dừng khi thêm đề mà gần như không ra dạng mới.</p>
<table><tr><th>Lô</th><th class="r">Đề</th><th class="r">Câu mới</th><th class="r">Câu NEW</th><th class="r">Ngoài 4 chương</th><th>Dạng mới thật sự phải thêm</th></tr>
${loTk.map((l, i) => `<tr><td>${i + 1}</td><td class="r">${l.de}</td><td class="r">${l.cau}</td><td class="r">${l.nNew} <small>(${(100 * l.nNew / l.cau).toFixed(1)}%)</small></td><td class="r">${l.nO}</td><td>${i === 0 ? "lô dựng cây v1" : esc((DANG_MOI[l.lo] || []).join(" · ") || "0")}</td></tr>`).join("")}
</table></div>

<div class="box"><h2>Cách đọc</h2><ul>
<li><b>Chủ đề</b> = chương SGK (CT 2018). <b>Chuyên đề</b> = mảng kiến thức. <b>Nhóm bài</b> = một định luật / khái niệm — đơn vị đo mastery. <b>Dạng bài</b> = một <i>cách giải</i> lặp lại qua nhiều đề.</li>
<li>Trong nhiều nhóm, đề Lý hỏi 2 kiểu khác hẳn: <b>Nhận biết</b> (chọn phát biểu / công thức / đơn vị, không tính) và <b>Tính</b> (thay số, vận dụng) ⇒ tách 2 dạng.</li>
<li>Câu <b>Đúng–Sai</b> không vào dạng (giống Toán: kho Đ/S cấp chủ đề) — không tính ở đây.</li>
<li>Cột "Số đề có" = số đề có ít nhất 1 câu thuộc dạng (trên ${tongDe} đề). Dấu <b>~</b> = một phần số câu của lô 1 được quy đổi ước lượng (lô 1 gắn theo thực đơn cũ). Câu mẫu chỉ lấy từ câu gắn trực tiếp.</li></ul></div>

${body}

<div class="box"><h2>Câu ngoài 4 chương (${ngoai.length} câu ≈ ${(100 * ngoai.length / (tongCau + ngoai.length)).toFixed(1)}%) — KHÔNG đưa vào bản đồ</h2>
<ul>${Object.entries(ngoaiNhom).sort((a, b) => b[1] - a[1]).map(([k, n]) => `<li>${esc(k)} — ${n}</li>`).join("")}</ul></div>
${newCon.length ? `<div class="box"><h2>Câu NEW chưa xếp (${newCon.length})</h2><ul>${newCon.map(o => `<li><b>${esc(o.chuong)}</b> ${esc(o.mo_ta)} <small>${esc(o.gc)}</small></li>`).join("")}</ul></div>` : ""}

<div class="box"><h2>Cần chị quyết</h2>${CAU_HOI.map((q, i) => `<div class="q"><b>Q${i + 1}. ${esc(q[0])}</b><br>${esc(q[1])}<br><i>Đề xuất: ${esc(q[2])}</i></div>`).join("")}</div>
</main></body></html>`;
fs.writeFileSync(OUT, html);
console.log(JSON.stringify({ soCdd, soNhom, soDang, tongDe, tongCau, ngoai: ngoai.length, newCon: newCon.length, it: Object.entries(thong).filter(([, x]) => x.n < 8).map(([m, x]) => m + ":" + x.n) }));
