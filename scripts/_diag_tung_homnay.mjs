// Read-only: liệt kê dữ liệu bổ trợ yếu của Tùng tạo HÔM NAY (trước khi xoá theo Luật xoá)
import pg from 'pg'
import { readFileSync } from 'node:fs'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i), l.slice(i + 1).replace(/^["']|["']$/g, '')] }))
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()
const HS = '30a354aa-0c70-4dbb-88c7-4a540d2dd8bb'
const q = async (s, p = []) => (await c.query(s, p)).rows
const buoi = await q(`select b.id, b.ngay, b.gio_bat_dau, b.trang_thai, b.danh_gia_xong_at, b.created_at from buoi_hoc b join buoi_hoc_hs hh on hh.buoi_hoc_id=b.id where hh.hoc_sinh_id=$1 and b.loai='bo_tro_yeu' and b.created_at >= (now() at time zone 'Asia/Ho_Chi_Minh')::date`, [HS])
console.log('buoi_hoc (tạo hôm nay):', JSON.stringify(buoi, null, 1))
const ids = buoi.map(b => b.id)
if (ids.length) {
  console.log('buoi_hoc_hs:', JSON.stringify(await q(`select id, diem_danh, bo_tro_yeu_id from buoi_hoc_hs where buoi_hoc_id = any($1)`, [ids])))
  const bt = await q(`select id, loai, so_cau from bai_test where buoi_hoc_id = any($1)`, [ids])
  console.log('bai_test trong buổi:', JSON.stringify(bt))
  if (bt.length) console.log('bai_lam:', JSON.stringify(await q(`select id, bai_test_id, trang_thai from bai_lam where bai_test_id = any($1)`, [bt.map(b => b.id)])))
  for (const t of ['buoi_hoc_nhan_xet','buoi_danh_gia','buoi_hoc_dang','gami_session_problems','gami_grades']) {
    try { const r = await q(`select count(*)::int n from ${t} where buoi_hoc_id = any($1)`, [ids]); console.log(t, r[0].n) } catch (e) { console.log(t, 'n/a') }
  }
  console.log('bo_tro_yeu_dang day_buoi_id trỏ vào:', JSON.stringify(await q(`select id, ma_dang, day_at from bo_tro_yeu_dang where day_buoi_id = any($1)`, [ids])))
}
console.log('hs_level_log hôm nay:', JSON.stringify(await q(`select id, loai, level_cu, level_chot, created_at from hs_level_log where hoc_sinh_id=$1 and created_at >= (now() at time zone 'Asia/Ho_Chi_Minh')::date`, [HS])))
console.log('bo_tro_yeu case:', JSON.stringify(await q(`select id, trang_thai, created_at from bo_tro_yeu where hoc_sinh_id=$1`, [HS])))
console.log('FK trỏ vào buoi_hoc:', JSON.stringify(await q(`select conrelid::regclass::text t from pg_constraint where contype='f' and confrelid='buoi_hoc'::regclass`)))
await c.end()
