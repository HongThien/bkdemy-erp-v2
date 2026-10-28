// tong-hop.mjs — gộp b1…b5 + ot (đã soát) → tong-hop.json (mỗi câu + trạng thái `vao`|`giu` + lý do giữ), kiểm lại KaTeX/ký tự cấm/kiem.
//   node kho-rules/dai/lo/k6/so-nguyen-sach/tong-hop.mjs
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const D = 'kho-rules/dai/lo/k6/so-nguyen-sach/'
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const FILES = [['b1', 'Bài 1. Tập hợp các số nguyên'], ['b2', 'Bài 2. Phép cộng và phép trừ số nguyên'], ['b3', 'Bài 3. Quy tắc dấu ngoặc'], ['b4', 'Bài 4. Phép nhân số nguyên'], ['b5', 'Bài 5. Phép chia hết. Ước và bội của một số nguyên'], ['ot', 'Ôn tập chương III']]
// GIỮ LẠI (chờ Thùy quyết, KHÔNG nhập lượt này): đề/đáp số sách mâu thuẫn hoặc ngoài phạm vi
const GIU = {
  'B4-18-b': 'Đề ghi x<y nhưng đáp số sách ứng với x>y — file gõ nhầm hay sách nhầm?',
  'B4-3A': 'Bảng: cột 4 đề gõ x=−4 (⇒ y=−25), sách đáp x=4, y=25 — cần đối chiếu bản gốc.',
  'ÔT-13B-b': 'Sách in dãy −1+3−5+7−…+25−26 không theo quy luật; trạm soạn ĐOÁN sửa thành …−53+55 cho khớp đáp số 28.',
  'ÔT-27': 'Sách in 2^2010 và (1+4), dãy là luỹ thừa của 3 — trạm soạn sửa đề thành 3^2010, (1+3); bản đồ chưa có dạng (chia hết của tổng luỹ thừa).',
  'ÔT-Đ1-B2a': 'Sách dùng giá trị tuyệt đối |−2| (ngoài phạm vi khối 6) — trạm soát đổi thành −7.(−2).',
  'ÔT-Đ2-B2a': 'Sách dùng giá trị tuyệt đối |−10| (ngoài phạm vi khối 6) — trạm soát đổi thành +(−10).',
  'ÔT-Đ2-B4': 'Đề in 2n²−5n+19 nhưng lời giải sách theo +15 — chọn đề nào?',
}
const out = [], loi = []
for (const [f, ten] of FILES) {
  for (const q of JSON.parse(readFileSync(D + f + '.json', 'utf8'))) {
    const s = [q.noi_dung, q.loi_giai, ...(q.lua_chon ?? [])].join('\n')
    if ((s.match(/\$/g) || []).length % 2) loi.push(`${q.id}: số $ lẻ`)
    for (const m of s.matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${q.id}: KaTeX «${m[1].slice(0, 30)}»`) } if (/\cdot|\times|\left|\right|\|/.test(m[1])) loi.push(`${q.id}: ký tự cấm «${m[1].slice(0, 30)}»`) }
    for (const e of q.kiem ?? []) { let r; try { r = (0, eval)(e) } catch (x) { r = 'lỗi ' + x.message } if (r !== true) loi.push(`${q.id}: kiem ✘ ${String(e).slice(0, 60)} → ${r}`) }
    if (!/Phần 1/.test(q.loi_giai ?? '') || !/Phần 2/.test(q.loi_giai ?? '')) loi.push(`${q.id}: thiếu 2 phần`)
    let trang = 'vao', ly = ''
    if (GIU[q.id]) { trang = 'giu'; ly = GIU[q.id] }
    else if (q.vai === 'giang' && !q.dang_bai) { trang = 'giu'; ly = 'Câu bài giảng chưa có dạng bài — kho trên lớp bắt buộc có dạng (bản đồ chưa có dạng này).' }
    out.push({ ...q, tep: f, sach: ten, trang, ly_do_giu: ly })
  }
}
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
writeFileSync(D + 'tong-hop.json', JSON.stringify(out, null, 1))
const dem = (f) => out.filter(f).length
console.log(`✔ ${out.length} câu · giữ ${dem((q) => q.trang === 'giu')} · vào: giang ${dem((q) => q.trang === 'vao' && q.vai === 'giang')} (dạng cao/vừa ${dem((q) => q.trang === 'vao' && q.vai === 'giang' && q.dang_bai_chac === 'cao')}/${dem((q) => q.trang === 'vao' && q.vai === 'giang' && q.dang_bai_chac !== 'cao')}) · luyen ${dem((q) => q.trang === 'vao' && q.vai === 'luyen')} (dạng null ${dem((q) => q.trang === 'vao' && q.vai === 'luyen' && !q.dang_bai)})`)
console.log('giữ:', out.filter((q) => q.trang === 'giu').map((q) => q.id).join(' '))
