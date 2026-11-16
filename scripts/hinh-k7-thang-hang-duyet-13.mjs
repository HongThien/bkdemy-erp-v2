// Thùy 16/11 "duyệt đi": duyệt 13 ý của 4 bài_y thẳng hàng còn chưa duyệt (HHB000914–917) để màn chọn giáo trình thấy đủ. Người duyệt = Đào Xuân Thùy.
//   node scripts/hinh-k7-thang-hang-duyet-13.mjs [--ghi]
import pg from 'pg'
import { bien } from './kho/cau-hinh.mjs'
const GHI = process.argv.includes('--ghi')
const THUY = '626427c3-d82d-468d-9f47-eb29d1981ee5'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
try {
  await c.query('begin')
  const nv = (await c.query(`select ho_ten from nhan_su where id = $1`, [THUY])).rows[0]
  if (nv?.ho_ten !== 'Đào Xuân Thùy') throw new Error('không đúng người duyệt')
  const r = await c.query(`update hinh_hoc_cau_hoi set da_duyet = true, duyet_boi = $1, duyet_at = now(), duyet_nguon = 'nguoi'
    where bai_y in ('HHB000914','HHB000915','HHB000916','HHB000917') and xoa_at is null and not da_duyet returning ma_cau`, [THUY])
  console.log('duyệt', r.rowCount, 'ý còn chưa duyệt (một số đã được duyệt bên app trước đó)'); if (r.rowCount < 1 || r.rowCount > 13) throw new Error('số ý duyệt bất thường: ' + r.rowCount)
  const p = (await c.query(`select dang_chinh, count(*)::int n from hinh_hoc_cau_hoi q where dang_chinh in ('HH00170','HH00171','HH00172') and xoa_at is null and q.kho_chuan and _kho_cau_chuan(q.da_duyet, q.kiem_may, q.created_at, q.giai_method) group by 1 order by 1`)).rows
  const t = (await c.query(`select dang_chinh, count(*)::int n from hinh_hoc_cau_hoi where dang_chinh in ('HH00170','HH00171','HH00172') and xoa_at is null group by 1 order by 1`)).rows
  console.log('picker thấy:', JSON.stringify(p), '| tổng:', JSON.stringify(t))
  await c.query(GHI ? 'commit' : 'rollback'); console.log(GHI ? '✔ ĐÃ GHI' : '↩ ROLLBACK')
} catch (e) { await c.query('rollback'); console.error('LỖI:', e.message); process.exitCode = 1 }
await c.end()
