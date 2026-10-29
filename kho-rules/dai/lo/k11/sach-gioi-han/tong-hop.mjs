// tong-hop.mjs — gộp 30 đơn vị (đã soát) → tong-hop.json: mỗi câu + sách + trạng thái `vao`|`giu` (+ lý do giữ). Kiểm lại bằng kiem.mjs.
//   node kho-rules/dai/lo/k11/sach-gioi-han/tong-hop.mjs
// GIỮ LẠI (không nhập lượt này): câu `giang` không có dạng bài (kho trên lớp bắt buộc có dạng).
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
const D = 'kho-rules/dai/lo/k11/sach-gioi-han/'
const tep = readdirSync(D).filter((f) => /^(pnl|tt|nbv)-.+\.json$/.test(f) && !/\.(goc|truoc-latex)\.json$/.test(f)).sort()
const r = spawnSync('node', [D + 'kiem.mjs', ...tep.map((f) => D + f)], { encoding: 'utf8' })
if (r.status !== 0) { console.error('✘ kiem.mjs còn lỗi:\n' + (r.stdout + r.stderr).split('\n').filter((l) => /✘|^  /.test(l)).join('\n')); process.exit(3) }
const SACH = { pnl: 'PNL', tt: 'Từ Tâm', nbv: 'NBV' }
const out = []
for (const f of tep) {
  const don = f.replace(/\.json$/, '')
  for (const q of JSON.parse(readFileSync(D + f, 'utf8'))) {
    const { kiem, ...rest } = q
    let trang = 'vao', ly = ''
    if (q.vai === 'giang' && !q.dang_bai) { trang = 'giu'; ly = 'Câu bài giảng chưa có dạng bài — kho trên lớp bắt buộc có dạng.' }
    out.push({ ...rest, don_vi: don, sach: SACH[don.split('-')[0]], trang, ly_do_giu: ly })
  }
}
writeFileSync(D + 'tong-hop.json', JSON.stringify(out, null, 1))
const dem = (f) => out.filter(f).length
console.log(`✔ ${out.length} câu từ ${tep.length} đơn vị · giữ ${dem((q) => q.trang === 'giu')} · vào: giảng ${dem((q) => q.trang === 'vao' && q.vai === 'giang')} · luyện ${dem((q) => q.trang === 'vao' && q.vai === 'luyen')} (Đ/S ${dem((q) => q.trang === 'vao' && q.loai_cau === 'dung_sai')} · có dạng cao ${dem((q) => q.vai === 'luyen' && q.dang_bai_chac === 'cao')} · vừa ${dem((q) => q.vai === 'luyen' && q.dang_bai_chac === 'vua')} · chưa dạng ${dem((q) => q.vai === 'luyen' && !q.dang_bai && q.loai_cau !== 'dung_sai')})`)
for (const s of ['PNL', 'Từ Tâm', 'NBV']) console.log(' ', s, dem((q) => q.sach === s), 'câu')
