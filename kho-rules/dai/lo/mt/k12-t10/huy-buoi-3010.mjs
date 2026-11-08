// huy-buoi-3010.mjs — buổi 30/10 (gán nhầm ngày) KHÔNG xoá được: viec_phu_trach_snap là bản chụp BẤT BIẾN (Thùy 04/11, trigger chặn xoá).
// ⇒ HỦY buổi (trang_thai='huy' + ly_do_huy) — danh sách chấm MT tự loại buổi huỷ — và xoá kỳ thi mồ côi 0 điểm (đã được Thùy duyệt xoá).
//   node kho-rules/dai/lo/mt/k12-t10/huy-buoi-3010.mjs [--ghi]
import pg from 'pg'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const BUOI = ['5efed23a-b0fa-4661-90c4-4a392839d489', '4fb80582-4479-400c-b375-445e12d42f4e']
const KY = '9962829b-ff08-4cda-8730-840767a853e2'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri })
await c.connect(); await c.query('begin')
try {
  const diem = +(await c.query(`select count(*) n from diem_thi where ky_thi_id = $1`, [KY])).rows[0].n
  const gr = +(await c.query(`select count(*) n from gami_grades g join gami_session_problems p on p.id = g.problem_id where p.buoi_hoc_id = any($1)`, [BUOI])).rows[0].n
  if (diem || gr) throw new Error('có điểm — dừng')
  const k = await c.query(`delete from ky_thi where id = $1 and buoi_hoc_id = any($2)`, [KY, BUOI])
  const h = await c.query(`update buoi_hoc set trang_thai = 'huy', ly_do_huy = 'Gán nhầm ngày — đề khảo sát tháng 10 thi ngày 01/11 (Thùy 06/11)', updated_at = now() where id = any($1) and ngay = '2026-10-30' and trang_thai = 'mo'`, [BUOI])
  console.log(`ky_thi xoá ${k.rowCount} · buổi huỷ ${h.rowCount}`)
  if (k.rowCount !== 1 || h.rowCount !== 2) throw new Error('lệch số dòng — ROLLBACK')
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ COMMIT' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
