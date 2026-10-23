// de-xuat.mjs — dựng trang ĐỀ XUẤT bản đồ 4 tầng (Chủ đề › Chuyên đề › Nhóm bài › Dạng bài) cho chương 5 SGK Toán 11 KNTT "Giới hạn. Hàm số liên tục".
//   node kho-rules/dai/lo/k11/gioi-han/de-xuat.mjs   → kho-rules/dai/k11-ban-do-gioi-han-de-xuat.html + .md
// Đây là ĐỀ XUẤT để CEO sửa/duyệt (README kho: bản đồ là việc của CEO) — không ghi DB.
import { writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
const katex = createRequire('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/package.json')('katex')

import { CD, DE_THAT } from './du-lieu.mjs'

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const toan = (s) => esc(s).replace(/\$([^$]+)\$/g, (_, t) => { try { return katex.renderToString(t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'), { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${t}</code>` } })

let nNhom = 0, nDang = 0, nDe = 0
for (const c of CD) for (const n of c.nhom) { nNhom++; for (const d of n.dang) { nDang++; if (d[3]) nDe += d[3].length } }

let html = `<title>Đề xuất bản đồ K11 — Giới hạn, hàm số liên tục</title>
<style>
:root{--nen:#f5f6f8;--the:#fff;--chu:#1f2937;--mo:#6b7280;--vien:#e3e6ea;--cd:#4c6fff;--nhom:#0f9d8a;--dang:#b23a72;--ghi:#fff7e6;--ghi-v:#e9b44c}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--cd:#8ea2ff;--nhom:#4fd1c0;--dang:#f08ac0;--ghi:#2a2418;--ghi-v:#b8892e;color-scheme:dark}}
:root[data-theme="dark"]{--nen:#111827;--the:#1b2330;--chu:#eef0f3;--mo:#9ca3af;--vien:#334155;--cd:#8ea2ff;--nhom:#4fd1c0;--dang:#f08ac0;--ghi:#2a2418;--ghi-v:#b8892e;color-scheme:dark}
*{box-sizing:border-box}body{margin:0;background:var(--nen);color:var(--chu);font:15px/1.6 system-ui,"Segoe UI",sans-serif}
main{max-width:980px;margin:0 auto;padding-block:20px 60px;padding-inline:16px}
h1{font-size:22px;margin:6px 0;text-wrap:balance}h2{font-size:18px;margin:28px 0 8px;padding-bottom:4px;border-bottom:2px solid var(--vien)}
p{margin:0 0 8px}.dan{color:var(--mo);max-width:75ch}
.cantim{background:var(--ghi);border:1px solid var(--ghi-v);border-radius:10px;padding:10px 16px;margin:12px 0}.cantim ol{margin:6px 0 0;padding-left:20px}.cantim li{margin:4px 0}
.cd{background:var(--the);border:1px solid var(--vien);border-left:5px solid var(--cd);border-radius:10px;padding:10px 14px;margin:14px 0}
.cd>h3{font-size:17px;margin:0 0 2px;color:var(--cd)}.sgk{color:var(--mo);font-size:13px}
.nhom{border-left:4px solid var(--nhom);margin:10px 0 0 6px;padding:2px 0 2px 12px}.nhom>h4{font-size:15px;margin:6px 0 2px;color:var(--nhom)}.nguon{color:var(--mo);font-size:12.5px;margin-bottom:4px}
.dang{margin:4px 0 6px 6px;padding:6px 10px;background:var(--nen);border-radius:8px;border-left:3px solid var(--dang)}.dang b{color:var(--dang)}.mt{color:var(--chu);font-size:14px}.src{color:var(--mo);font-size:12.5px}
.de{display:inline-block;background:var(--nhom);color:#fff;border-radius:6px;padding:0 7px;font-size:12px;margin-left:4px;font-family:ui-monospace,Consolas,monospace}
table{width:100%;border-collapse:collapse;background:var(--the);border:1px solid var(--vien);border-radius:8px;overflow:hidden}th,td{text-align:left;padding:6px 10px;border-bottom:1px solid var(--vien);vertical-align:top;font-size:14px}th{color:var(--mo);font-weight:600;font-size:13px}
math{font-size:1.05em}
</style>
<main>
<h1>Đề xuất bản đồ 4 tầng cho chương 5 — Giới hạn. Hàm số liên tục (Toán 11)</h1>
<p class="dan">Soạn 19/10 từ: sách giáo khoa Toán 11 tập 1 (Kết nối tri thức), <strong>Bài 15, 16, 17</strong> đọc đủ lý thuyết, ví dụ và bài tập (tr.104–123); phân dạng của <strong>Từ Tâm</strong> (Chương 3) và <strong>PNL 2026</strong> (Chương 5); kiểm 107 đề giữa kì K11 đã up. Đây là <strong>đề xuất để chị sửa</strong>, chưa ghi vào hệ thống.</p>
<div class="cantim"><strong>Chị cần xem trước</strong><ol>
<li><strong>Chưa có đề cuối kì K11 nào của Noctorium trong ERP.</strong> 107 đề K11 đều là <em>giữa</em> kì I (0 đề cuối kì; cuối kì mới có ở khối 6, 7, 9). Trong 2.072 câu của 107 đề chỉ có <strong>7 câu</strong> thật sự về giới hạn / hàm số liên tục (bảng cuối trang). Nên bản đồ này dựa chủ yếu vào sách giáo khoa và hai bộ phân dạng, chưa được kiểm bằng đề cuối kì. Chị up đề cuối kì lên (hoặc chỉ mình thư mục) thì mình kiểm lại và bổ sung dạng.</li>
<li><strong>Tên chủ đề.</strong> Chị gọi là "Giới hạn hàm số", nhưng chương 5 có 3 bài: giới hạn dãy số, giới hạn hàm số, hàm số liên tục. Mình đề xuất <strong>một chủ đề "Giới hạn. Hàm số liên tục" gồm 3 chuyên đề</strong> theo thứ tự sách. Nếu chị muốn chủ đề chỉ riêng "Giới hạn hàm số" thì chuyên đề 2 đứng một mình, hai chuyên đề còn lại thành chủ đề khác.</li>
<li><strong>Tổng của cấp số nhân lùi vô hạn</strong> sách xếp ở Bài 15 (giới hạn dãy số). Mình để ở chuyên đề 1; chị có thể chuyển sang chuyên đề Cấp số nhân của chủ đề Dãy số.</li>
<li><strong>Dạng ngoài sách</strong> (đánh dấu "ngoài SGK" hoặc "nâng cao"): $0\\cdot\\infty$, tìm tham số cho giới hạn $\\dfrac00$, chứng minh phương trình có $k$ nghiệm, phương trình chứa tham số luôn có nghiệm, tìm số hạng đầu / công bội khi biết tổng. Chị giữ hay bỏ.</li>
<li><strong>Tiệm cận</strong> không có trong chương trình Toán 11 nên không đưa vào (đề thi K12 mới có).</li>
<li><strong>Bản đồ cũ K11 không có chương này</strong> (chỉ có lượng giác và dãy số), nên không có lý thuyết cũ để chép; 7 câu thật đang nằm ở dạng chờ.</li>
<li><strong>Tài liệu NBV 11-18…21</strong> còn là file .rar, máy chưa mở được (cần phần mềm giải nén); mình chưa đọc phần phân dạng của NBV.</li>
<li>Dạng cần <strong>hình</strong> (đồ thị hàm nhiều khúc / có điểm gián đoạn, đồ thị phân thức): máy vẽ hình hiện có chỉ vẽ đồ thị lượng giác và đường tròn lượng giác; nếu cần các hình này phải mở rộng máy vẽ.</li>
</ol></div>
<p class="dan"><strong>Con số:</strong> 1 chủ đề · ${CD.length} chuyên đề · ${nNhom} nhóm bài · ${nDang} dạng bài. Cỡ tương đương chủ đề Lượng giác hiện có (20 nhóm · 69 dạng) và Dãy số (10 nhóm · 31 dạng). Mỗi dạng có mô tả nhận biết ngắn để chị sửa; nguồn ghi sau mỗi dạng (VD, LT, HĐ là ví dụ, luyện tập, hoạt động trong sách; 5.x là bài tập cuối bài; D1, D2 là dạng của Từ Tâm / PNL).</p>
<h2>Chủ đề: Giới hạn. Hàm số liên tục</h2>`
let md = `# Đề xuất bản đồ 4 tầng — Chương 5 Toán 11 "Giới hạn. Hàm số liên tục" (19/10)\n\nNguồn: SGK Toán 11 tập 1 KNTT Bài 15–17 · Từ Tâm Chương 3 · PNL 2026 Chương 5 · 107 đề giữa kì K11 (chưa có đề cuối kì). Xem bản HTML: \`kho-rules/dai/k11-ban-do-gioi-han-de-xuat.html\`.\n\n**1 chủ đề · ${CD.length} chuyên đề · ${nNhom} nhóm bài · ${nDang} dạng bài.**\n`
let i = 0
for (const c of CD) {
  i++
  html += `<section class="cd"><h3>Chuyên đề ${i}. ${toan(c.ten)}</h3><div class="sgk">SGK ${esc(c.sgk)}</div>`
  md += `\n## Chuyên đề ${i}. ${c.ten} (SGK ${c.sgk})\n`
  let j = 0
  for (const n of c.nhom) {
    j++
    html += `<div class="nhom"><h4>Nhóm ${i}.${j}. ${toan(n.ten)}</h4><div class="nguon">Nguồn: ${esc(n.nguon)}</div>`
    md += `\n### Nhóm ${i}.${j}. ${n.ten}\n*Nguồn: ${n.nguon}*\n`
    let k = 0
    for (const d of n.dang) {
      k++
      const de = d[3] ? d[3].map((m) => `<span class="de">${m}</span>`).join('') : ''
      html += `<div class="dang"><b>${i}.${j}.${k}</b> ${toan(d[0])}${de}<div class="mt">${toan(d[1])}</div><div class="src">${esc(d[2])}</div></div>`
      md += `- **${i}.${j}.${k}** ${d[0]} — ${d[1]} _(${d[2]})_${d[3] ? ' · câu thật: ' + d[3].join(', ') : ''}\n`
    }
    html += '</div>'
  }
  html += '</section>'
}
html += `<h2>7 câu giới hạn thật trong 107 đề giữa kì K11 (đang ở dạng chờ)</h2><table><thead><tr><th>Mã câu</th><th>Đề</th><th>Nội dung</th><th>Rơi vào</th></tr></thead><tbody>${DE_THAT.map((r) => `<tr><td><code>${r[0]}</code></td><td>${esc(r[1])}</td><td>${toan(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table>
<p class="dan" style="margin-top:10px">7 câu rơi vào 6 trong 17 nhóm; chưa câu nào ở nhóm một bên, tổng cấp số nhân lùi vô hạn, căn thức, thực tế. Các câu khác có chữ "giới hạn" / "liên tục" trong đề là nghĩa thường (huyết áp, tích luỹ tiền) hoặc là cấp số cộng, không thuộc chương này.</p>
</main>`
md += `\n## 7 câu giới hạn thật trong 107 đề giữa kì K11\n${DE_THAT.map((r) => `- ${r[0]} — ${r[3]}`).join('\n')}\n`
html = html.replace(/\$([^$<>]+)\$/g, (_, t) => { try { return katex.renderToString(t, { output: 'mathml', throwOnError: true, strict: 'ignore' }) } catch { return `<code>${t}</code>` } })
writeFileSync('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/k11-ban-do-gioi-han-de-xuat.html', html)
writeFileSync('C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/kho-rules/dai/k11-ban-do-gioi-han-de-xuat.md', md)
console.log(`${CD.length} chuyên đề · ${nNhom} nhóm · ${nDang} dạng · ${nDe} câu thật gắn`)
