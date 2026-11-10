// Dựng reports/do-man-cham-mastery.html từ reports/_do-man-cham-mastery.json (chạy _do_man_cham_mastery.mjs trước).
import fs from 'fs'
const R = JSON.parse(fs.readFileSync('reports/_do-man-cham-mastery.json', 'utf8'))
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])
const TRAN = 8000
// trước khi có bảng lưu sẵn (nếu có file) — để so trước/sau
const TRUOC = fs.existsSync('reports/_do-man-cham-mastery-truoc.json') ? JSON.parse(fs.readFileSync('reports/_do-man-cham-mastery-truoc.json', 'utf8')) : null
const truocCua = (man) => TRUOC?.ketQua.find((x) => x.man === man)?.lan?.[1]
const rows = [...R.ketQua].sort((a, b) => Math.max(...(b.lan.length ? b.lan : [0])) - Math.max(...(a.lan.length ? a.lan : [0])))
const muc = (ms) => ms >= TRAN ? 'vuot' : ms >= 3000 ? 'cham' : ms >= 1000 ? 'vua' : 'nhanh'
const TEN = { vuot: 'vượt trần 8 s', cham: 'chậm', vua: 'chấp nhận', nhanh: 'nhanh' }
const maxDoi = Math.max(...R.doi.map((x) => x.hs_doi))
const tbDoi = Math.round(R.doi.reduce((s, x) => s + x.hs_doi, 0) / R.doi.length)
const tong = R.doi[0]?.tong ?? 0
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Đo màn chậm</title>
<style>
:root{--bg:#f7f7f5;--fg:#1d2433;--mo:#5b6475;--the:#fff;--vien:#e3e5ea;--vuot:#fde8e8;--cham:#fff1e0;--vua:#fff9e0;--nhanh:#eef6ef;--nhan:#3554d1;--cot:#9aa9e8}
@media (prefers-color-scheme:dark){:root{--bg:#15181e;--fg:#e6e8ec;--mo:#9aa3b2;--the:#1e222a;--vien:#2e3440;--vuot:#401f22;--cham:#3d2a18;--vua:#3a3519;--nhanh:#1d3324;--nhan:#8ea2ff;--cot:#4f5fa8}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:980px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:32px 0 6px;border-top:1px solid var(--vien);padding-top:20px}
.mo,small{color:var(--mo)}.wrap{overflow-x:auto}
table{border-collapse:collapse;background:var(--the);font-variant-numeric:tabular-nums;width:100%}
th,td{border:1px solid var(--vien);padding:6px 10px;text-align:left;vertical-align:top}td.so{text-align:right;white-space:nowrap}
tr.vuot td.m{background:var(--vuot);font-weight:700}tr.cham td.m{background:var(--cham)}tr.vua td.m{background:var(--vua)}tr.nhanh td.m{background:var(--nhanh)}
.ket{background:var(--the);border:1px solid var(--vien);border-left:4px solid var(--nhan);border-radius:8px;padding:12px 16px}.ket li{margin:4px 0}
.bar{display:flex;align-items:flex-end;gap:4px;height:120px;margin-top:8px}.bar div{flex:1;background:var(--cot);border-radius:3px 3px 0 0;position:relative}
.bar span{position:absolute;bottom:-18px;left:0;right:0;text-align:center;font-size:10px;color:var(--mo)}
</style></head><body><main>
<h1>Màn nào chậm vì tính mastery</h1>
<p class="mo">Đo trên DB thật ${new Date(R.luc).toLocaleString('vi-VN')} · lớp mẫu ${esc(R.lop.ten)} (${R.lop.so_hs} HS) · mỗi hàm chạy 2 lần (lần đầu / lần lặp, cùng kết nối) · trần app = 8 s/lệnh · chỉ đọc, mọi phép đo rollback.</p>
<div class="ket"><b>Tóm tắt</b><ul>
${TRUOC ? '<li><b>Sau khi áp bảng mastery lưu sẵn (10/11 16:52, chụp 362 em, đối chiếu 20 em 0 lệch):</b> mastery 1 em / cả lớp còn ~0,04 s; Bổ trợ nhẹ 8,2 → 0,3 s; dạng yếu 1 em 0,25 → 0,07 s; Bản đồ phiêu lưu lần đầu 7,3 → 1,9 s. Dashboard kết quả bổ trợ tuần KHÔNG đổi (tính tại mốc quá khứ — cần chụp theo ngày, việc riêng). Cột “Trước” = lần lặp của lần đo trước.</li>' : ''}
<li><b>Bổ trợ nhẹ — danh sách lớp</b> vượt trần 8 s (gọi dạng yếu 2 lần cho mỗi em; luật nhóm áp 16:05 làm mỗi lượt chậm thêm). Đã có bản sửa tính cả lớp một lượt: lớp 12A1 1,9 s → 0,25 s, kết quả khớp 100% — <b>chờ áp</b>.</li>
<li><b>Dashboard kết quả bổ trợ tuần</b> 7–10 s — sát/vượt trần. <b>Bản đồ phiêu lưu</b> (app HS) lần đầu 7,3 s.</li>
<li>Mỗi ngày trung bình <b>${tbDoi}/${tong} HS (${Math.round(tbDoi / tong * 100)}%)</b> có lần đo mới (nhiều nhất ${maxDoi}) ⇒ hơn một nửa số em không đổi mastery trong ngày: bảng lưu sẵn + đánh dấu bẩn sẽ đọc thẳng được cho phần lớn em.</li>
<li>Các màn đọc mastery 1 em / 1 lớp hiện ở mức 0,1–1,5 s — lưu sẵn sẽ đưa về vài chục ms nhưng không phải chỗ đau nhất.</li>
</ul></div>
<h2>Thời gian từng màn (sắp chậm nhất trước)</h2>
<div class="wrap"><table><tr><th>Màn</th><th>Hàm</th>${TRUOC ? '<th>Trước bảng lưu sẵn</th>' : ''}<th>Lần đầu</th><th>Lần lặp</th><th>Mức</th></tr>
${rows.map((r) => { const m = r.lan.length ? Math.max(...r.lan) : 0; const k = r.loi ? 'vuot' : muc(m)
  return `<tr class="${k}"><td>${esc(r.man)}</td><td><small>${esc(r.mo_ta)}</small></td>${TRUOC ? `<td class="so">${truocCua(r.man) != null ? (truocCua(r.man) / 1000).toFixed(2) + ' s' : ''}</td>` : ''}<td class="so">${r.lan[0] != null ? (r.lan[0] / 1000).toFixed(2) + ' s' : ''}</td><td class="so">${r.lan[1] != null ? (r.lan[1] / 1000).toFixed(2) + ' s' : ''}</td><td class="m">${r.loi ? 'LỖI: ' + esc(r.loi) : TEN[k]}</td></tr>` }).join('')}
</table></div>
<h2>Bao nhiêu HS có lần đo mới mỗi ngày</h2>
<p class="mo">Lần đo mới = chấm buổi · bài làm app · phiếu bổ trợ. Em không có lần đo mới thì mastery không đổi (trừ khi câu bị đổi dạng / sửa bản đồ).</p>
<div class="bar">${R.doi.map((x) => `<div style="height:${Math.round(x.hs_doi / tong * 100)}%" title="${x.d}: ${x.hs_doi}/${x.tong}"><span>${x.d.slice(8)}/${x.d.slice(5, 7)}</span></div>`).join('')}</div>
<p style="margin-top:28px" class="mo">Cột = % HS đang học có lần đo mới trong ngày (trên ${tong} em).</p>
<h2>Đề xuất bước 2 (chưa làm)</h2>
<ol>
<li>Bảng mastery lưu sẵn (dạng + nhóm, theo lần) + cờ “bẩn” theo em; trigger trên bảng chấm/bài làm/phiếu bổ trợ/gán dạng câu chỉ đánh dấu bẩn.</li>
<li>Đọc: em bẩn tính lại ngay (≈0,3 s/em), em sạch đọc bảng. Đêm dựng lại toàn bộ + đối chiếu ngẫu nhiên.</li>
<li>Ưu tiên nối trước: Dashboard kết quả bổ trợ tuần, Bản đồ phiêu lưu, Bổ trợ nhẹ, Chốt tuần, QLCL.</li>
</ol>
</main></body></html>`
fs.writeFileSync('reports/do-man-cham-mastery.html', html)
console.log('reports/do-man-cham-mastery.html')
