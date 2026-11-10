// Dựng reports/so-mastery-theo-lan.html từ reports/_so-mastery-theo-lan.json (chạy _so_mastery_theo_lan.mjs trước).
import fs from 'fs'
const R = JSON.parse(fs.readFileSync('reports/_so-mastery-theo-lan.json', 'utf8'))
const MUC = ['dat', 'can_luyen', 'yeu'], TEN = { dat: 'Đạt', can_luyen: 'Cần luyện', yeu: 'Yếu' }
const n = (v) => Number(v ?? 0).toLocaleString('vi-VN')
const r0 = (v) => Math.round(Number(v))
const esc = (s) => String(s ?? '').replace(/[&<>"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[ch])
const TK = { et: 'ET', mt: 'MT', btvn: 'BTVN', bt: 'Bổ trợ', tu_luyen: 'Tự luyện' }

const xtab = (rows) => {
  const g = (a, b) => rows.find((x) => x.cu === a && x.moi === b)?.n ?? 0
  const tongC = (a) => MUC.reduce((s, b) => s + g(a, b), 0)
  return `<table class="x"><tr><th>Cũ ↓ · Mới →</th>${MUC.map((b) => `<th>${TEN[b]}</th>`).join('')}<th>Tổng cũ</th></tr>
  ${MUC.map((a) => `<tr><th>${TEN[a]}</th>${MUC.map((b) => `<td class="${a === b ? 'giu' : (a === 'yeu' && b === 'dat') || (a === 'dat' && b === 'yeu') ? 'manh' : 'doi'}">${n(g(a, b))}</td>`).join('')}<td>${n(tongC(a))}</td></tr>`).join('')}
  </table>`
}
const nhomTab = (rows) => {
  const g = (m, y) => rows.find((x) => x.moi === m && x.co_yeu === y)?.n ?? 0
  return `<table class="x"><tr><th>Nhóm (mới) ↓</th><th>Có ≥1 dạng yếu (cũ)</th><th>Không dạng nào yếu (cũ)</th></tr>
  ${MUC.map((m) => `<tr><th>${TEN[m]}</th><td class="${m === 'yeu' ? 'giu' : m === 'dat' ? 'manh' : 'doi'}">${n(g(m, true))}</td><td class="${m === 'yeu' ? 'manh' : 'giu'}">${n(g(m, false))}</td></tr>`).join('')}
  </table>`
}
const kb = (k, ten, mo) => {
  const o = R.kb[k], s = o.span, d = o.dem
  return `<section><h2>${ten}</h2><p class="mo">${mo}</p>
  <div class="cards">
    <div class="card"><b>${n(d.o_dang)}</b><span>ô HS × dạng</span></div>
    <div class="card"><b>${n(d.o_nhom)}</b><span>ô HS × nhóm</span></div>
    <div class="card"><b>${n(d.dang_yeu_cu)} → ${n(d.dang_yeu_moi)}</b><span>ô dạng yếu: cũ → mới</span></div>
    <div class="card"><b>${n(d.nhom_yeu_moi)}</b><span>ô nhóm yếu (mới) · cũ có ${n(d.nhom_co_dang_yeu_cu)} nhóm chứa ≥1 dạng yếu</span></div>
  </div>
  <h3>Cấp DẠNG: mức cũ (theo câu) × mức mới (theo lần)</h3>${xtab(o.dang_x)}
  <h3>Cấp NHÓM (chính): nhóm mới × nhóm có dạng yếu theo cách cũ</h3>${nhomTab(o.nhom_x)}
  <h3>Độ nhanh — cửa sổ đang phủ bao nhiêu ngày (trung vị, ô đủ 5)</h3>
  <table class="x"><tr><th></th><th>Cũ · dạng · 5 câu</th><th>Mới · dạng · 5 lần</th><th>Mới · nhóm · 5 lần</th></tr>
  <tr><th>Số ngày cửa sổ phủ</th><td>${r0(s.cu)}</td><td>${r0(s.moi_d)}</td><td>${r0(s.moi_n)}</td></tr>
  <tr><th>Trung vị số câu / số lần mỗi ô</th><td>${r0(s.n_cu)} câu</td><td>${r0(s.n_moi_d)} lần</td><td>${r0(s.n_moi_n)} lần</td></tr>
  <tr><th>5 lần nhóm ≈ bao nhiêu câu</th><td></td><td></td><td>${Number(s.cau_cs_n).toFixed(1)} câu</td></tr></table>
  <h3>Theo khối</h3>
  <table class="x"><tr><th>Khối</th><th>HS có dạng yếu (cũ)</th><th>Ô dạng yếu (cũ)</th><th>HS có nhóm yếu (mới)</th><th>Ô nhóm yếu (mới)</th></tr>
  ${o.khoi.filter((x) => x.dang_yeu_cu || x.nhom_yeu_moi).sort((a, b) => a.khoi.localeCompare(b.khoi, 'vi', { numeric: true })).map((x) => `<tr><th>${x.khoi}</th><td>${x.hs_co_dang_yeu_cu}</td><td>${x.dang_yeu_cu}</td><td>${x.hs_co_nhom_yeu_moi}</td><td>${x.nhom_yeu_moi}</td></tr>`).join('')}
  </table></section>`
}
const lanCells = (lan) => (lan ?? []).map((l) => `<span class="lan ${l.dung / l.tong >= 0.8 ? 'd' : l.dung / l.tong >= 0.5 ? 'c' : 'y'}">${l.t.slice(8, 10)}/${l.t.slice(5, 7)} ${TK[l.src] ?? l.src} ${l.dung}/${l.tong}</span>`).join('')
const mauTab = (rows) => `<table class="x mau"><tr><th>HS</th><th>Dạng</th><th>Cũ</th><th>Mới</th><th>Các lần gần nhất (mới → cũ)</th></tr>
  ${rows.map((x) => `<tr><td>${esc(x.ho_ten)}<br><small>${esc(x.ten_lop)}</small></td><td>${esc(x.ten_dang)}<br><small>${esc(x.dang)}</small></td><td>${x.p_cu}%<br><small>${x.n_cu} câu</small></td><td>${x.p_moi}%<br><small>${x.n_lan} lần</small></td><td>${lanCells(x.lan)}</td></tr>`).join('')}</table>`
const b = R.botro
const nguon = R.tong.lan_theo_nguon
const html = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Mastery theo lần</title>
<style>
:root{--bg:#f7f7f5;--fg:#1d2433;--mo:#5b6475;--the:#fff;--vien:#e3e5ea;--giu:#eef6ef;--doi:#fff7e6;--manh:#fde8e8;--nhan:#3554d1}
@media (prefers-color-scheme:dark){:root{--bg:#15181e;--fg:#e6e8ec;--mo:#9aa3b2;--the:#1e222a;--vien:#2e3440;--giu:#1d3324;--doi:#3a301a;--manh:#401f22;--nhan:#8ea2ff}}
body{margin:0;background:var(--bg);color:var(--fg);font:14px/1.55 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1080px;margin:0 auto;padding:24px 16px 64px}
h1{font-size:24px;margin:0 0 4px}h2{font-size:18px;margin:32px 0 4px;border-top:1px solid var(--vien);padding-top:20px}h3{font-size:14px;margin:18px 0 6px}
.mo,small{color:var(--mo)}section{overflow-x:auto}
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:10px;margin:12px 0}
.card{background:var(--the);border:1px solid var(--vien);border-radius:10px;padding:12px}.card b{display:block;font-size:20px;font-variant-numeric:tabular-nums}.card span{color:var(--mo);font-size:12.5px}
table.x{border-collapse:collapse;background:var(--the);font-variant-numeric:tabular-nums;margin:4px 0}
.x th,.x td{border:1px solid var(--vien);padding:5px 10px;text-align:right}.x th{text-align:left;font-weight:600}
td.giu{background:var(--giu)}td.doi{background:var(--doi)}td.manh{background:var(--manh);font-weight:700}
.mau td{text-align:left;vertical-align:top}.lan{display:inline-block;margin:1px 3px 1px 0;padding:0 6px;border-radius:4px;font-size:12px;white-space:nowrap}
.lan.d{background:var(--giu)}.lan.c{background:var(--doi)}.lan.y{background:var(--manh)}
.ket{background:var(--the);border:1px solid var(--vien);border-left:4px solid var(--nhan);border-radius:8px;padding:12px 16px}
.ket li{margin:4px 0}
</style></head><body><main>
<h1>Mastery: theo câu (cũ) so với theo lần (mới)</h1>
<p class="mo">Dữ liệu thật ${new Date().toLocaleDateString('vi-VN')} · ${n(R.so_hs)} HS đang học lớp Toán · ${n(R.tong.n)} lượt đo đã quy dạng · chỉ đọc DB, chưa ghi gì.
Bản cũ trong phép so chép lại <code>_mastery_cells_core</code> — đối chiếu ${n(R.kiem.khop)}/${n(R.kiem.tong)} ô khớp tuyệt đối hàm thật.</p>

<div class="ket"><b>Tóm tắt</b><ul>
<li><b>Bổ trợ yếu</b> (2 cửa sổ gần nhất): cũ <b>${n(b.muc_cu)} dạng yếu / ${b.hs_cu} HS</b> → mới <b>${n(b.muc_moi)} nhóm yếu / ${b.hs_moi} HS</b>; ${b.hs_ca_hai} HS có mặt ở cả hai. Số em giảm nhẹ, số mục cần luyện giảm mạnh (gom dạng vào nhóm + không còn bị tự luyện kéo).</li>
<li><b>Cấp dạng</b> đổi ít: phần lớn lần đo của một dạng chỉ có 1–3 câu, nên “5 câu” và “5 lần” gần trùng nhau. Chỗ đổi thật nằm ở các buổi dồn nhiều câu cùng dạng.</li>
<li><b>Chậm hơn một chút:</b> cửa sổ nhóm 5 lần phủ ${r0(R.kb.b.span.moi_n)} ngày so với ${r0(R.kb.b.span.cu)} ngày của 5 câu (kịch bản bổ trợ); kịch bản ET+MT: ${r0(R.kb.a.span.moi_n)} so với ${r0(R.kb.a.span.cu)} ngày.</li>
<li><b>Đã áp 2 luật Thùy chốt 10/11:</b> cách mới <b>bỏ tự luyện</b> (trừ HS cấp 1) và <b>không trọng số nguồn</b> — mọi lần ngang nhau, như Đánh giá cuối cấp. Cách cũ giữ nguyên để so.</li>
</ul></div>

<h2>Bổ trợ yếu: dạng yếu (cũ) → nhóm yếu (mới)</h2>
<p class="mo">Cùng nguồn bổ trợ đang dùng (mọi nguồn, <code>include_btvn = true</code>), điều kiện “có đo từ mốc 2 cửa sổ” = từ ${R.moc.slice(0, 10)}. Hiện có ${b.case_dang_xu} case Toán đang xử.</p>
<table class="x"><tr><th></th><th>Cũ (dạng)</th><th>Mới (nhóm)</th></tr>
<tr><th>Mục yếu cần luyện</th><td>${n(b.muc_cu)}</td><td>${n(b.muc_moi)}</td></tr>
<tr><th>HS có ≥1 mục yếu</th><td>${b.hs_cu}</td><td>${b.hs_moi}</td></tr>
<tr><th>HS có ở cả hai</th><td colspan="2" style="text-align:center">${b.hs_ca_hai}</td></tr></table>

${kb('b', 'Kịch bản B — mọi nguồn (đúng nguồn bổ trợ đang dùng)', 'ET · MT · BTVN · bổ trợ · tự luyện. Màu: xanh = giữ mức, vàng = lệch 1 bậc, đỏ = lệch hẳn (yếu ↔ đạt).')}
${kb('a', 'Kịch bản A — chỉ ET + MT (mặc định của mastery)', 'Màn xem / app HS dùng mặc định này (HS cấp 1 thêm tự luyện).')}

<h2>Mẫu: dạng cũ YẾU → mới ĐẠT</h2>
<p class="mo">Thường là buổi có nhiều câu cùng dạng cùng ngày: cách cũ lấy 5 câu “gần nhất” nhưng mọi câu cùng ngày buổi ⇒ chọn 5 câu nào là ngẫu nhiên theo thứ tự sắp; cách mới tính trọn từng bài.</p>
${mauTab(R.mau_yeu_dat)}
<h2>Mẫu: dạng cũ ĐẠT → mới YẾU</h2>
<p class="mo">Ở kịch bản bổ trợ, phần lớn là ô cách cũ “đạt” nhờ tự luyện gần đây; cách mới bỏ tự luyện nên lấy lại các bài ET / BTVN / bổ trợ trước đó. Danh sách lần bên phải chỉ hiện các lần được tính theo cách mới.</p>
${mauTab(R.mau_dat_yeu)}
<h2>Mẫu: nhóm lệch với dạng</h2>
<p class="mo">Nhóm mới yếu mà không dạng nào yếu (mỗi dạng ít lần, gộp lại mới thấy) — hoặc nhóm đạt mà vẫn có dạng yếu (dạng phụ sẽ chỉ ra để luyện).</p>
<table class="x mau"><tr><th>HS</th><th>Nhóm</th><th>Nhóm mới</th><th>Các dạng trong nhóm (cũ)</th></tr>
${R.mau_nhom.map((x) => `<tr><td>${esc(x.ho_ten)}<br><small>${esc(x.ten_lop)}</small></td><td>${esc(x.ten_nhom)}</td><td>${x.p_moi}% · ${TEN[x.muc]}<br><small>${x.n_lan} lần</small></td><td><small>${esc(x.ds)}</small></td></tr>`).join('')}</table>

<h2>Luật đã chốt và phần còn ngoài phạm vi</h2>
<table class="x"><tr><th>Nguồn</th><th>Số lần</th><th>Số câu</th><th>Câu / lần</th></tr>
${nguon.map((x) => `<tr><th>${TK[x.src] ?? x.src}</th><td>${n(x.lan)}</td><td>${n(x.cau)}</td><td>${(x.cau / x.lan).toFixed(1)}</td></tr>`).join('')}</table>
<ol>
<li><b>Tự luyện:</b> ${n(nguon.find((x) => x.src === 'tu_luyen')?.lan)} lần — nhiều nhất trong mọi nguồn — vì mỗi phiên tự luyện là một lần. Ở kịch bản bổ trợ, vài phiên tự luyện ngắn trong một buổi tối đẩy hết ET/BTVN ra khỏi cửa sổ 5 lần. Đánh giá cuối cấp không tính tự luyện. <b>Đã chốt:</b> bỏ tự luyện (trừ cấp 1).</li>
<li><b>Lần 1 câu:</b> đúng luật L4 cuối cấp (lần 1 câu vẫn tính), nhưng kèm trọng số nguồn cũ thì MT 1 câu sai nặng gấp 3 một BTVN 10 câu. <b>Đã chốt:</b> bỏ trọng số nguồn — mọi lần ngang nhau.</li>
<li><b>KHTN:</b> ${n(R.tong.khong_nhom)} lượt đo (mã K07/K08/K09, ${R.tong.dang_khong_nhom} dạng) là KHTN theo bản đồ cũ, chưa có nhóm — so sánh này chỉ cho Toán; KHTN cần nối nhóm riêng (<code>khtn_bdm_nhom</code>).</li>
<li><b>Hình–Luyện</b> (bài mô hình) đo ở đường riêng <code>fn_mastery_cells_hinh</code>, chưa nằm trong phép so này.</li>
</ol>
</main></body></html>`
fs.writeFileSync('reports/so-mastery-theo-lan.html', html)
console.log('reports/so-mastery-theo-lan.html', html.length)
