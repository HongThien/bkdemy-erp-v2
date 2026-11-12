// Gộp ebook/*.json ⇒ gop.json + kiểm định dạng + HTML duyệt.  node ebook-gop.cjs <out.html>
const fs = require("fs"), path = require("path");
const V = __dirname, E = path.join(V, "ebook");
const nut = fs.readFileSync(path.join(V, "nut-nhiet-khi.md"), "utf8");
const nhomTen = {}, dangTen = {}, dangCuaNhom = {}; let nhomHt = null; const thuTu = [];
for (const l of nut.split("\n")) {
  let m;
  if ((m = l.match(/^## NHÓM (LNB\d+) — (.*?)  \(mô tả/))) { nhomHt = m[1]; nhomTen[m[1]] = m[2]; dangCuaNhom[m[1]] = []; thuTu.push(m[1]); }
  else if ((m = l.match(/^- DẠNG (LDB\d+) — (.*?) — (.*?)  \(ví dụ/))) { dangTen[m[1]] = { ten: m[2], mo_ta: m[3], nhom: nhomHt }; dangCuaNhom[nhomHt].push(m[1]); }
}
const G = { nhom: {}, dang: {}, khong_khop: [], ghi_chu: [] };
for (const f of fs.readdirSync(E).filter(f => /^[A-Z]\.json$/.test(f)).sort()) {
  let j; try { j = JSON.parse(fs.readFileSync(path.join(E, f), "utf8")); } catch (e) { G.ghi_chu.push(f + ": JSON lỗi " + e.message); continue; }
  const t = j.tram || f[0];
  for (const n of j.nhom || []) { const x = G.nhom[n.id] = G.nhom[n.id] || { mo_ta: [], lt: [], sgk: [] };
    if (n.mo_ta) x.mo_ta.push({ t, v: n.mo_ta }); if (n.ly_thuyet && n.ly_thuyet.trim()) x.lt.push({ t, v: n.ly_thuyet.trim(), trang: n.trang });
    if (n.ly_thuyet_sgk && n.ly_thuyet_sgk.trim()) x.sgk.push({ t, v: n.ly_thuyet_sgk.trim() }); }
  for (const d of j.dang || []) { if (!d.vi_du || !d.vi_du.trim()) continue; const x = G.dang[d.id] = G.dang[d.id] || { vd: [] };
    for (const one of d.vi_du.trim().split(/\n(?=##VD)/)) x.vd.push({ t, v: one.trim(), trang: d.trang }); }
  for (const k of j.khong_khop || []) G.khong_khop.push({ t, ...k });
  if (j.ghi_chu) G.ghi_chu.push(t + ": " + j.ghi_chu);
}
// ── CHỐT (Claude soát 12/11)
// 1) LNB00037: trạm F chép lại ĐL I + quy ước dấu (trùng trạm B) ⇒ chỉ giữ khối "quá trình biến đổi đặc biệt" của F
const n37 = G.nhom.LNB00037;
if (n37) n37.lt = n37.lt.map(l => l.t !== "F" ? l : { ...l, v: l.v.split(/\n\s*\n/).filter(d => /^##TC Các quá trình biến đổi đặc biệt/.test(d.trim())).join("\n\n") }).filter(l => l.v.trim());
// 2) tối đa 3 ví dụ / dạng, ưu tiên ví dụ không cần hình
const canHinh = s => /như hình|hình vẽ|hình bên|hình H\d/i.test(s.split("Bài giải:")[0]);
for (const x of Object.values(G.dang)) if (x.vd.length > 3) x.vd = [...x.vd.filter(v => !canHinh(v.v)), ...x.vd.filter(v => canHinh(v.v))].slice(0, 3);
// 3) ghi chú cho người duyệt
const GHI_CHU_KHOI = [
  [/Định luật II|Động cơ nhiệt|Máy lạnh/, "ngoài SGK 2018 — sách bổ sung (đề 90 bộ chỉ có 2 câu động cơ nhiệt/tủ lạnh). Giữ hay bỏ?"],
];
const SUA_IN = ["Trạm B: sách in 'khi r > r₀ thì hợp lực đẩy' — chép theo ý đúng r < r₀ (lý thuyết lực phân tử, LNB00036/LNB00034).",
  "Trạm E: ví dụ phương trình trạng thái — sách in 1,6.10⁶ ở bước thay số, sửa 1,6.10⁵ cho khớp đề; đã kiểm: (1/1,6)·(320/300)·3 = 2 lít.",
  "Trạm F: ví dụ khí đa quá trình — sách in '450 °C' nhưng phép tính ra 450 K; ghi 450 K."];
G.sua_in = SUA_IN; G.ghi_chu_khoi = GHI_CHU_KHOI.map(([r, t]) => [r.source, t]);
// kiểm định dạng
const loi = [];
const kiemLT = (id, s, nguon) => { for (const doan of s.split(/\n\s*\n/)) { const d = doan.trim(); if (!d) continue;
  if (!/^##(ĐN|ĐL|TC|CY|PP|NX)\b/.test(d)) loi.push(`${id} ${nguon}: đoạn thiếu thẻ: «${d.slice(0, 60)}»`);
  if (/##VD|Bài giải|Ví dụ \d/.test(d)) loi.push(`${id} ${nguon}: lý thuyết chứa ví dụ`); } };
const kiemVD = (id, s) => { if (!/^##VD/.test(s)) loi.push(`${id}: ví dụ không mở bằng ##VD`); if (!/\n\s*\nBài giải:/.test(s)) loi.push(`${id}: ví dụ thiếu "Bài giải:" (sau dòng trống)`);
  const de = s.split(/\n\s*\nBài giải:/)[0]; if (/\n\s*\n/.test(de)) loi.push(`${id}: đề ví dụ có dòng trống`); };
for (const [id, x] of Object.entries(G.nhom)) { if (!nhomTen[id]) loi.push("mã nhóm lạ " + id); x.lt.forEach(l => kiemLT(id, l.v, "ebook " + l.t)); x.sgk.forEach(l => kiemLT(id, l.v, "sgk " + l.t)); }
for (const [id, x] of Object.entries(G.dang)) { if (!dangTen[id]) loi.push("mã dạng lạ " + id); x.vd.forEach(v => kiemVD(id, v.v)); }
fs.writeFileSync(path.join(V, "ebook", "gop.json"), JSON.stringify(G, null, 1));

const esc = s => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const khoi = s => esc(s).replace(/^##(ĐN|ĐL|TC|CY|PP|NX|VD)([^\n]*)/gm, (m, k, t) => { const gc = GHI_CHU_KHOI.find(([r]) => r.test(t));
  return `<span class="the the-${k}">${k}</span><b>${t}</b>${gc ? ` <span class="co-hoi">⚠ ${esc(gc[1])}</span>` : ""}`; });
let body = "", nNhomLT = 0, nNhomSgk = 0, nDangVD = 0, nVD = 0;
for (const nid of thuTu) {
  const x = G.nhom[nid] || { mo_ta: [], lt: [], sgk: [] };
  if (x.lt.length) nNhomLT++; if (x.sgk.length) nNhomSgk++;
  const mo = x.mo_ta.sort((a, b) => b.v.length - a.v.length)[0];
  body += `<section><h2><span class="ma">${nid}</span>${esc(nhomTen[nid])}</h2>
  <div class="o"><div class="nhan">Mô tả nhóm</div>${mo ? `<p>${esc(mo.v)}</p>` : `<p class="trong">— trống —</p>`}</div>
  <div class="o"><div class="nhan">Lý thuyết <span class="src eb">chép ebook</span></div>${x.lt.length ? x.lt.map(l => `<div class="nd"><div class="tr">trạm ${l.t} · trang PDF ${(l.trang || []).join(", ")}</div><div class="pre">${khoi(l.v)}</div></div>`).join("") : `<p class="trong">— sách không có —</p>`}</div>
  ${x.sgk.length ? `<div class="o sgk"><div class="nhan">Lý thuyết bổ sung <span class="src sg">viết theo SGK KNTT — cần chị soát</span></div>${x.sgk.map(l => `<div class="nd"><div class="tr">trạm ${l.t}</div><div class="pre">${khoi(l.v)}</div></div>`).join("")}</div>` : ""}`;
  for (const did of dangCuaNhom[nid]) { const d = G.dang[did]; if (d && d.vd.length) { nDangVD++; nVD += d.vd.length; }
    body += `<div class="dang"><h3><span class="ma">${did}</span>${esc(dangTen[did].ten)} ${d ? `<span class="dem">${d.vd.length} ví dụ</span>` : `<span class="dem trongd">chưa có ví dụ</span>`}</h3>
    ${d ? d.vd.map(v => `<div class="nd vd"><div class="tr">trạm ${v.t} · trang PDF ${(v.trang || []).join(", ")}</div><div class="pre">${khoi(v.v)}</div></div>`).join("") : ""}</div>`;
  }
  body += `</section>`;
}
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Lý thuyết Vật lý 12</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script>
<script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js" onload="renderMathInElement(document.body,{delimiters:[{left:'$$',right:'$$',display:true},{left:'$',right:'$',display:false}],throwOnError:false})"></script>
<style>
:root{--bg:#f7f7f5;--card:#fff;--ink:#1d1d1f;--mute:#6b6b70;--line:#e3e3e0;--acc:#2f5bd3;--eb:#1f7a4d;--sg:#b35c00}
@media (prefers-color-scheme:dark){:root{--bg:#141416;--card:#1d1d20;--ink:#ececee;--mute:#9a9aa2;--line:#2f2f34;--acc:#8fb0ff;--eb:#6fd4a0;--sg:#ffb466}}
body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.6 system-ui,"Segoe UI",sans-serif}main{max-width:980px;margin:0 auto;padding:24px 16px 80px}
h1{font-size:23px;margin:0 0 4px}.sub{color:var(--mute)}section{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:16px;margin:16px 0}
h2{font-size:18px;margin:0 0 10px}h3{font-size:15px;margin:14px 0 6px}.ma{font:12px Consolas,monospace;color:var(--mute);margin-right:6px}
.o{border-left:3px solid var(--line);padding:2px 0 2px 12px;margin:8px 0}.o.sgk{border-color:var(--sg)}.nhan{font-size:12px;font-weight:700;color:var(--mute);text-transform:uppercase;letter-spacing:.03em}
.src{font-size:11px;padding:1px 6px;border-radius:999px;margin-left:6px;text-transform:none}.eb{color:var(--eb);border:1px solid var(--eb)}.sg{color:var(--sg);border:1px solid var(--sg)}
.pre{white-space:pre-wrap;margin:4px 0}.tr{font-size:11px;color:var(--mute)}.trong{color:var(--mute);font-style:italic}
.the{display:inline-block;font:700 11px Consolas,monospace;padding:0 5px;border-radius:4px;margin-right:6px;background:#e8eefc;color:#2f5bd3}.the-VD{background:#fbe6f0;color:#b23a72}.the-CY{background:#fff0e0;color:#b35c00}
.co-hoi{font-size:12px;color:var(--sg);font-weight:600}
.dang{border-top:1px dashed var(--line);margin-top:10px}.dem{font-size:11px;color:var(--eb);margin-left:6px}.trongd{color:var(--sg)}
.nd.vd{background:var(--bg);border-radius:8px;padding:8px 10px;margin:6px 0}.kq{background:var(--card);border:1px solid var(--line);border-radius:12px;padding:12px 16px}
</style></head><body><main>
<h1>Lý thuyết · mô tả · ví dụ — Vật lý 12 (Vật lí nhiệt + Khí lí tưởng)</h1>
<p class="sub">Nguồn: ebook "Nắm trọn kiến thức Vật lí 12 – Tập 1" (Đỗ Ngọc Hà). Ví dụ chép nguyên sách (đề + lời giải). Đoạn viết theo SGK Kết nối tri thức đánh dấu cam. ĐỀ XUẤT — chưa ghi DB.</p>
<div class="kq">Nhóm có lý thuyết từ ebook: <b>${nNhomLT}/${thuTu.length}</b> · nhóm có phần SGK: <b>${nNhomSgk}</b> · dạng có ví dụ: <b>${nDangVD}/${Object.keys(dangTen).length}</b> (${nVD} ví dụ) · lỗi định dạng: <b>${loi.length}</b></div>
<section><h2>Chỗ trạm chép đã sửa lỗi in của sách (chị soát)</h2><ul>${SUA_IN.map(s => `<li>${esc(s)}</li>`).join("")}</ul></section>
${body}
${G.khong_khop.length ? `<section><h2>Nội dung sách chưa xếp được</h2><ul>${G.khong_khop.map(k => `<li>trạm ${k.t} · tr.${k.trang}: ${esc(k.noi_dung || "").slice(0, 200)} <i>${esc(k.goi_y || "")}</i></li>`).join("")}</ul></section>` : ""}
</main></body></html>`;
fs.writeFileSync(process.argv[2], html);
console.log(JSON.stringify({ nhom_lt: nNhomLT, nhom_sgk: nNhomSgk, dang_vd: nDangVD, vd: nVD, loi: loi.length, khong_khop: G.khong_khop.length }));
loi.slice(0, 40).forEach(l => console.log(" ✖", l));
