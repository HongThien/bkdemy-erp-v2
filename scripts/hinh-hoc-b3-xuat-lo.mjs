// B3 cho Hình–Học (hinh_hoc_*): XUẤT bảng đích + lô câu chưa phân dạng của một khối (CHỈ ĐỌC DB).
//   node scripts/hinh-hoc-b3-xuat-lo.mjs <khoi> --chu-de NCD00208 [--lo 70] [--ra kho-rules/dai/lo/b3/h<khoi>] [--ma-cau-file ds.json]
// Bảng đích = các bài học (hinh_hoc_bai) của chủ đề, kèm MÔ TẢ + LÝ THUYẾT + VÍ DỤ đủ, không cắt.
// ⛔ Cổng cứng (Thùy 02/11, mọi khối): bài thiếu mô tả / lý thuyết / ví dụ ⇒ exit 2, không xuất lô.
// Câu chờ = hinh_hoc_cau_hoi còn sống, dang_chinh = bài chờ `HH<khoi>000000`.
import pg from 'pg'
import fs from 'node:fs'
import path from 'node:path'

process.loadEnvFile('.env')
const a = process.argv.slice(2)
const khoi = a[0]
const opt = (k, d) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : d }
const CHUDE = opt('--chu-de', null), LO = +opt('--lo', 70), RA = opt('--ra', `kho-rules/dai/lo/b3/h${khoi}`)
if (!khoi || !CHUDE) { console.error('Dùng: node scripts/hinh-hoc-b3-xuat-lo.mjs <khoi> --chu-de NCDxxxxx [--lo 70] [--ra dir]'); process.exit(2) }

const iMc = a.indexOf('--ma-cau-file'), MACAU = iMc >= 0 ? JSON.parse(fs.readFileSync(a[iMc + 1], 'utf8')) : null // chỉ các câu trong danh sách (khớp lại khi bản đồ có bài mới), kể cả câu đã xếp bài khác
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? process.env.DATABASE_URL }); await c.connect()
await c.query('begin read only')
const bais = (await c.query(`
  select b.ma_bai, b.ten_bai, b.thu_tu, b.mo_ta, b.vi_du, coalesce(l.noi_dung, '') ly_thuyet
    from hinh_hoc_bai b left join hinh_hoc_bai_ly_thuyet l on l.ma_bai = b.ma_bai
   where b.khoi = $1 and b.chu_de_id = $2 order by b.thu_tu, b.ma_bai`, [khoi, CHUDE])).rows
const cho = `HH${khoi}000000`
const cau = (await c.query(`
  select ma_cau, loai_cau, noi_dung, lua_chon, menh_de, dap_an, left(loi_giai, 500) loi_giai, (anh_de is not null) co_hinh
    from hinh_hoc_cau_hoi where xoa_at is null and ${MACAU ? 'ma_cau = any($1)' : 'dang_chinh = $1'} order by ma_cau`, [MACAU ?? cho])).rows
await c.query('rollback'); await c.end()

const thieu = []
for (const b of bais) {
  const t = []
  if (!b.mo_ta.trim()) t.push('mô tả'); if (!b.ly_thuyet.trim()) t.push('lý thuyết'); if (!b.vi_du.trim()) t.push('ví dụ')
  if (t.length) thieu.push(`${b.ma_bai} ${b.ten_bai}: thiếu ${t.join(', ')}`)
}
if (!bais.length) { console.error('Chủ đề chưa có bài học nào.'); process.exit(2) }
if (thieu.length) { console.error('⛔ Bảng đích thiếu tài liệu — điền rồi chạy lại:\n  ' + thieu.join('\n  ')); process.exit(2) }

fs.mkdirSync(RA, { recursive: true })
const md = ['# Bảng đích Hình–Học khối ' + khoi + ' (xếp theo thứ tự học; câu thuộc nhiều bài ⇒ bài đứng SAU thắng)', '']
for (const b of bais) md.push(`## **${b.ma_bai}** · ${b.ten_bai}`, '', '### Mô tả', b.mo_ta.trim(), '', '### Lý thuyết', b.ly_thuyet.trim(), '', '### Ví dụ', b.vi_du.trim(), '')
fs.writeFileSync(path.join(RA, 'dich.md'), md.join('\n'))
const n = Math.ceil(cau.length / LO)
for (let i = 0; i < n; i++) {
  const lo = cau.slice(i * LO, (i + 1) * LO).map((r) => ({ ma_cau: r.ma_cau, loai: r.loai_cau, de: r.noi_dung, lua_chon: r.lua_chon, menh_de: r.menh_de, dap_an: r.dap_an, loi_giai: r.loi_giai, co_hinh: r.co_hinh }))
  fs.writeFileSync(path.join(RA, `lo-${String(i + 1).padStart(2, '0')}.json`), JSON.stringify(lo, null, 1))
}
console.log(`Hình–Học K${khoi} chủ đề ${CHUDE}: ${bais.length} bài đích · ${cau.length} câu chờ · ${n} lô × ≤${LO} ⇒ ${RA}`)
