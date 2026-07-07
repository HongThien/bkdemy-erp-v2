import pg from 'pg'
import { readFileSync } from 'fs'
const url = readFileSync('.env', 'utf8').split('\n').find(l => l.startsWith('DATABASE_URL=')).split('=').slice(1).join('=').trim()
const c = new pg.Client({ connectionString: url }); await c.connect()

console.log('-- buổi đuổi gần đây + nguoi_day (GV) --')
const r = await c.query(`
  select b.id, b.ngay, b.trang_thai, b.danh_gia_xong_at, b.nguoi_day, ns.ho_ten as gv_ten,
         (select count(*) from buoi_hoc_hs where buoi_hoc_id = b.id) so_hs
  from buoi_hoc b
  left join nhan_su ns on ns.id = b.nguoi_day
  where b.loai = 'bo_tro_duoi'
  order by b.created_at desc limit 15
`)
console.table(r.rows.map(x => ({ id: x.id.slice(0,8), ngay: String(x.ngay).slice(0,10), trang_thai: x.trang_thai, dg_xong: !!x.danh_gia_xong_at, gv: x.gv_ten, so_hs: x.so_hs })))
await c.end()
