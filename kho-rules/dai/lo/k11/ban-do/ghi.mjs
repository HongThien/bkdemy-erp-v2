// ghi.mjs — ghi lý thuyết + ví dụ đã soạn / soát vào bản đồ mới khối 11 (dai_bdm_dang_bai).
//   node kho-rules/dai/lo/k11/ban-do/ghi.mjs <tệp ra.txt…>            # chạy thử: ghi trong transaction rồi ROLLBACK
//   node kho-rules/dai/lo/k11/ban-do/ghi.mjs <tệp ra.txt…> --ghi      # ghi thật
// RÀO: chỉ ghi vào ô đang TRỐNG (ly_thuyet = '' / vi_du = '') — không bao giờ đè nội dung CEO đã có; tệp nào còn lỗi khuôn thì không ghi gì.
// Mỗi dạng một câu UPDATE riêng (trigger dai_bdm_log tự lưu lịch sử từng dòng). Cùng cách đã làm cho bản đồ mới khối 8 (14/10).
import { readFileSync } from 'node:fs'
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
import { docTep, kiemKhoi } from './kiem.mjs'

const args = process.argv.slice(2)
const GHI = args.includes('--ghi')
const teps = args.filter((a) => !a.startsWith('--'))
const url = process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri
if (!teps.length || !url) { console.error('Dùng: node …/ghi.mjs <tệp ra.txt…> [--ghi]  (cần DATABASE_URL)'); process.exit(2) }

const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()
let ma = 0
try {
  const khoi = teps.flatMap((t) => docTep(readFileSync(t, 'utf8')).map((k) => ({ ...k, tep: t })))
  const { rows: hien } = await c.query(`select d.id, d.ten, d.mo_ta, d.ly_thuyet, d.vi_du from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id = d.nhom_id join dai_bdm_chu_de cd on cd.id = n.chu_de_id where cd.khoi = '11' and d.id = any($1)`, [khoi.map((k) => k.id)])
  const loi = []
  for (const k of khoi) {
    const h = hien.find((x) => x.id === k.id)
    if (!h) { loi.push(`${k.id}: không phải dạng của bản đồ mới khối 11`); continue }
    for (const l of kiemKhoi(k, { canLt: !h.ly_thuyet.trim() })) loi.push(`${k.id}: ${l}`)
  }
  if (loi.length) { console.error('❌ còn lỗi khuôn — không ghi gì:\n  ' + loi.join('\n  ')); process.exit(3) }
  await c.query('begin')
  let nLt = 0, nVd = 0, bo = []
  for (const k of khoi) {
    if (k.lt) { const r = await c.query(`update dai_bdm_dang_bai set ly_thuyet = $2, updated_at = now() where id = $1 and ly_thuyet = ''`, [k.id, k.lt]); if (r.rowCount) nLt++; else bo.push(`${k.id} lý thuyết (ô không còn trống)`) }
    if (k.vd) { const r = await c.query(`update dai_bdm_dang_bai set vi_du = $2, updated_at = now() where id = $1 and vi_du = ''`, [k.id, k.vd]); if (r.rowCount) nVd++; else bo.push(`${k.id} ví dụ (ô không còn trống)`) }
  }
  console.log(`${GHI ? 'GHI THẬT' : 'CHẠY THỬ (sẽ ROLLBACK)'} — ${khoi.length} dạng · ghi lý thuyết ${nLt} · ghi ví dụ ${nVd}${bo.length ? ' · BỎ QUA ' + bo.length + ': ' + bo.join('; ') : ''}`)
  await c.query(GHI ? 'commit' : 'rollback')
  console.log(GHI ? '✔ Đã ghi.' : 'Đã ROLLBACK — DB không đổi. Thêm --ghi để ghi thật.')
} catch (e) { ma = 1; try { await c.query('rollback') } catch {} ; console.error('✘ LỖI — đã rollback:', e.message) } finally { await c.end() }
process.exit(ma)
