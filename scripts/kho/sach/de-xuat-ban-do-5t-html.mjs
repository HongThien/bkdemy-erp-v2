// de-xuat-ban-do-5t-html.mjs — trang HTML ĐỀ XUẤT bản đồ kiến thức 5T cho Thùy xem (KHÔNG ghi DB; "đề xuất trước, ghi sau").
//   node scripts/kho/sach/de-xuat-ban-do-5t-html.mjs reports/5T-de-xuat-ban-do-kien-thuc.html
// Nguồn: bản đồ 5T đang có (DB 08/11) · Toán 5 TLTK (31 CĐ) · 250+ Bài toán chọn lọc lớp 5 (ME, 14 CĐ — đọc phần ĐỀ tr.7–100) ·
//        bộ CLC (58 đề / 805 câu; 16 chuyên đề Word 738 bài) · khuôn 4T. Mã: ✅ = đã có trong bản đồ, 🆕 = đề xuất thêm, ✏️ = đề xuất chuyển/đổi.
import { writeFileSync } from 'node:fs'
const ra = process.argv[2]
if (!ra) { console.error('Dùng: node scripts/kho/sach/de-xuat-ban-do-5t-html.mjs <ra.html>'); process.exit(2) }
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ── tần suất chủ đề trong 803 câu CLC (ước bằng từ khoá, chỉ để xếp ưu tiên) ──
const TAN_SUAT = [
  ['Tính toán, so sánh (STN – phân số – STP)', 106], ['Diện tích (tam giác, thang, chữ nhật…)', 104], ['Hình tròn / hình khối', 92],
  ['Tỉ số phần trăm / lãi lỗ', 79], ['Chuyển động', 61], ['Dãy số / quy luật', 56], ['Chia hết / chữ số tận cùng', 49],
  ['Cấu tạo số / lập số', 38], ['Tính tuổi', 29], ['Tỉ số / tổng–hiệu–tỉ', 29], ['Công việc / vòi nước', 20], ['Khác / tổng hợp (chưa phân loại được)', 140],
]

import { CD } from './de-xuat-ban-do-5t-du-lieu.mjs'

const TT = { co: ['✅ đã có', 'b-co'], moi: ['🆕 thêm', 'b-moi'], doi: ['✏️ chuyển / đổi', 'b-doi'] }
const badge = (t) => `<span class="b ${TT[t][1]}">${TT[t][0]}</span>`
const uuC = ['', '⭐⭐⭐ cao', '⭐⭐ vừa', '⭐ thấp']
let nCD = 0, nNhom = 0, nDang = 0, nMoiNhom = 0, nCoNhom = 0, nDangMoi = 0
const html = CD.map((c) => {
  nCD++
  const hang = c.cdn.map((ch) => {
    const rows = ch.nhom.map((n, i) => {
      nNhom++; nDang += n.dang.length; if (n.tt === 'moi') nMoiNhom++; if (n.tt === 'co') nCoNhom++
      return `<tr><td class="cdn">${i === 0 ? `<b>${esc(ch.ten)}</b><br>${badge(ch.tt)}${ch.ma ? ` <small>${ch.ma}</small>` : ''}${ch.ghi ? `<div class="gc">${esc(ch.ghi)}</div>` : ''}` : ''}</td>
        <td class="nh"><b>${esc(n.ten)}</b><br>${badge(n.tt)}${n.ma ? ` <small>${n.ma}</small>` : ''}${n.cau != null ? `<br><small>${n.cau} câu hiện có</small>` : ''}</td>
        <td><ul>${n.dang.map((d) => `<li>${esc(d)}</li>`).join('')}</ul></td>
        <td class="ng">${esc(n.nguon)}<br><span class="uu u${n.uu}">${uuC[n.uu]}</span></td></tr>`
    }).join('')
    return rows
  }).join('')
  return `<section id="cd${c.id}"><h2><span class="id">${c.id}</span> ${esc(c.ten)}</h2><p class="ghi">${esc(c.ghi)}</p>${c.cdn.length ? `<table><thead><tr><th>Chuyên đề</th><th>Nhóm</th><th>Dạng bài đề xuất</th><th>Nguồn · ưu tiên</th></tr></thead><tbody>${hang}</tbody></table>` : ''}</section>`
}).join('')

const tong = TAN_SUAT.reduce((s, x) => s + x[1], 0)
const bars = TAN_SUAT.map(([t, n]) => `<div class="bar"><span class="bt">${esc(t)}</span><span class="bb"><i style="width:${(n / 140) * 100}%"></i></span><span class="bn">${n} <small>(${Math.round((n / tong) * 100)}%)</small></span></div>`).join('')

writeFileSync(ra, `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>5T — Đề xuất bản đồ kiến thức</title>
<style>:root{--bg:#fff;--fg:#1b1f23;--mut:#667;--line:#dde3ea;--card:#fafbfc;--acc:#2f6fdb}
@media(prefers-color-scheme:dark){:root{--bg:#14181d;--fg:#e6e9ee;--mut:#9aa6b2;--line:#2b3541;--card:#1a2027}}
body{font:15px/1.55 system-ui,sans-serif;max-width:1180px;margin:0 auto;padding:16px;color:var(--fg);background:var(--bg)}
h1{font-size:22px;margin:.2em 0}h2{font-size:18px;margin:34px 0 4px;padding:8px 12px;background:var(--card);border-left:5px solid var(--acc);border-radius:4px}.id{display:inline-block;background:var(--acc);color:#fff;border-radius:50%;width:26px;height:26px;text-align:center;line-height:26px;font-size:14px;margin-right:6px}
.ghi{color:var(--mut);margin:4px 0 10px}table{border-collapse:collapse;width:100%;font-size:13.5px}th{background:var(--card);text-align:left;padding:6px 8px;border:1px solid var(--line)}td{padding:6px 8px;border:1px solid var(--line);vertical-align:top}
td.cdn{width:17%;background:var(--card)}td.nh{width:20%}td.ng{width:25%;color:var(--mut);font-size:12.5px}ul{margin:0;padding-left:17px}li{margin:1px 0}.gc{font-size:12px;color:var(--mut);margin-top:4px}
.b{display:inline-block;font-size:11px;padding:0 6px;border-radius:9px;border:1px solid}.b-co{color:#0b7a3b;border-color:#0b7a3b}.b-moi{color:#b25e00;border-color:#b25e00}.b-doi{color:#6a3fc9;border-color:#6a3fc9}
.uu{font-size:11px;font-weight:600}.u1{color:#c0392b}.u2{color:#b25e00}.u3{color:var(--mut)}small{color:var(--mut)}
.box{background:var(--card);border:1px solid var(--line);border-radius:6px;padding:10px 14px;margin:12px 0}.bar{display:flex;align-items:center;gap:8px;margin:3px 0;font-size:13px}.bt{width:330px}.bb{flex:1;background:var(--line);border-radius:3px;height:12px}.bb i{display:block;height:100%;background:var(--acc);border-radius:3px}.bn{width:80px;text-align:right}
.src td,.src th{font-size:13px}@media(max-width:760px){.bt{width:150px}td.ng{display:none}}</style></head><body>
<h1>5T — Đề xuất bản đồ kiến thức</h1>
<p><small>Bản NHÁP để Thùy xem · chưa ghi vào DB · 08–13/11/2026 · mã: ✅ đã có trong bản đồ · 🆕 đề xuất thêm · ✏️ đề xuất chuyển</small></p>
<div class="box"><b>Tóm tắt:</b> ${nCD - 1} chủ đề + 1 chủ đề để sau · ${nNhom} nhóm (${nCoNhom} nhóm ✅ đã có, ${nMoiNhom} nhóm 🆕) · ${nDang} dạng bài đề xuất. Bản đồ 5T hiện chỉ có <b>1 chủ đề · 4 chuyên đề · 12 nhóm · 40 dạng</b> (toàn bộ nằm dưới chủ đề "Bài toán tỉ số"). Phần ✅ giữ nguyên mã và tên — câu đã gán không bị đụng.
<br><b>Ba chỗ hổng lớn so với đề CLC:</b> ① <b>Số học</b> (cấu tạo số, dãy số, chia hết–chẵn lẻ–tận cùng, lập số đếm) — không có chỗ nào, mà đề CLC ~18%; sách TLTK chỉ có rải rác nên kho 5T đang gần như trống · ② <b>Chuyển động</b> — không có · ③ <b>Hình học</b> (~24% đề CLC) — không có.</div>

<h2 style="margin-top:22px">Nguồn đã dùng và phủ được gì</h2>
<table class="src"><thead><tr><th>Nguồn</th><th>Đã đọc</th><th>Phủ</th><th>Hổng</th></tr></thead><tbody>
<tr><td><b>Toán 5 TLTK</b></td><td>31 chuyên đề · 836 câu đã giải (dạng chờ)</td><td>Phân số, tỉ số, tỉ lệ, công việc, số thập phân, %, hình học, chuyển động, giả thiết tạm, khử</td><td>Cấu tạo số · dãy số · chẵn lẻ/chữ số tận cùng · lập số/đếm · so sánh/tính toán CLC</td></tr>
<tr><td><b>250+ Bài toán chọn lọc lớp 5</b> (ME, Trần Nhật Minh)</td><td>14 chuyên đề, phần ĐỀ tr.7–100 (đáp án tr.101–272 chưa đọc). Sách chỉ in đề; "dạng" tôi rút từ đề (mục sách tự nêu tên thì dùng nguyên)</td><td><b>Lấp hổng số học</b> (CĐ1, 2, 3, 6) + nâng cao tỉ lệ nhiều giai đoạn, dãy phân số, hình tròn/khối</td><td>Chưa giải câu nào; có chỗ dùng ẩn a, b, x, n! vượt tiểu học; CĐ14 mức Olympic</td></tr>
<tr><td><b>Bộ CLC lớp 6</b></td><td>58 đề · 805 câu đã soạn + kiểm độc lập (chưa ghi DB) · 16 chuyên đề gom từ đề (738 bài — chỉ dùng đo tần suất, Thùy 10/10: không nhập)</td><td>Cho biết <b>đề thật ra gì, nhiều ít ra sao</b> (xếp ưu tiên bên dưới)</td><td>Chưa ghi kho · chưa chốt khối 5T hay 5 · 6 nhãn sơ đồ chờ sửa</td></tr>
<tr><td><b>Bản đồ 5T + khuôn 4T</b></td><td>DB 08/11</td><td>Khuôn 4T: Số tự nhiên · Hình học · Logic · Cấu tạo số · Lời văn · Phân số — 5T đề xuất đi tiếp khuôn này</td><td>—</td></tr></tbody></table>

<h2 style="margin-top:22px">Đề CLC ra gì nhiều nhất <small>(ước theo từ khoá trên 803 câu — thô, chỉ để xếp ưu tiên)</small></h2>
<div class="box">${bars}</div>

${html}

<h2>Cần Thùy quyết (mặc định tôi đề xuất)</h2>
<div class="box"><ol>
<li><b>Chủ đề:</b> giữ "Bài toán tỉ số" (NCD00215) chứa luôn Phần trăm và Logic như hiện tại, và tách 5 chủ đề mới A, B, D, E, F — <i>mặc định: đúng như bảng trên</i>. Nếu Thùy muốn Phần trăm thành chủ đề riêng thì chuyển nguyên chuyên đề NCH00638 (mã bất biến).</li>
<li><b>✏️ Chuyển 2 nhóm</b> "Các phép tính toán cơ bản về phân số" + "Bài toán về số thập phân" sang chủ đề B — <i>mặc định: chuyển</i>; chuyên đề cũ NCH00546 còn rỗng thì để Thùy xoá.</li>
<li><b>Thứ tự làm</b> (theo tần suất CLC × độ trống): <b>E Hình học → D Chuyển động → A Số học (chia hết, dãy số trước) → B So sánh/tính toán → phần 🆕 của C</b> — <i>mặc định như vậy</i>.</li>
<li><b>Nguồn câu cho phần trống:</b> A lấy từ sách ME (chưa giải) + 805 câu CLC; D, E lấy từ TLTK (đã giải) + CLC — <i>mặc định: giải ME phần số học trước, rồi gán CLC theo bản đồ</i>. Câu hỏi khối 5T hay 5 cho 58 đề CLC (chưa chốt từ 10/10) — <i>mặc định: 5T</i>.</li>
<li>Lý thuyết / ví dụ của dạng mới: đang để trống — <i>mặc định: tôi điền nháp từ TLTK + ME vào HTML cho Thùy duyệt, KHÔNG ghi DB cho tới khi Thùy nói "ghi"</i>.</li></ol></div>
</body></html>`)
console.log('→', ra, { chu_de: nCD, nhom: nNhom, dang: nDang, nhom_co: nCoNhom, nhom_moi: nMoiNhom })
