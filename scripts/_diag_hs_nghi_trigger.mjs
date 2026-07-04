// THROWAWAY — verify trigger 0071 chạy LIVE (không chỉ backfill). Seed 1 HS test tạm 12A1, set nghi, xem tự rời.
import pg from 'pg'
import { readFileSync } from 'fs'
const envf = (f) => Object.fromEntries(readFileSync(f, 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: envf('.env').DATABASE_URL }); await c.connect()

const lop = (await c.query("select id from lop where ten_lop='12A1' limit 1")).rows[0]
const hs = (await c.query("insert into hoc_sinh(ma_hs, ho_ten, trang_thai) values('ZZTEST99','Test Trigger','dang_hoc') returning id")).rows[0]
await c.query("insert into hoc_sinh_lop(hoc_sinh_id, lop_id, trang_thai, ngay_vao) values($1,$2,'dang_hoc', current_date)", [hs.id, lop.id])
console.log('seeded HS ZZTEST99, dang_hoc 12A1')

await c.query("update hoc_sinh set trang_thai='nghi' where id=$1", [hs.id])
const after = (await c.query("select trang_thai, ngay_roi from hoc_sinh_lop where hoc_sinh_id=$1", [hs.id])).rows[0]
console.log(after.trang_thai === 'da_roi' ? '✓ trigger tự rời lớp: ' + JSON.stringify(after) : '✗ FAIL: ' + JSON.stringify(after))

const log = (await c.query("select hanh_dong from hoc_sinh_lop_log where hoc_sinh_id=$1 order by ts desc limit 1", [hs.id])).rows[0]
console.log(log?.hanh_dong === 'roi_lop' ? '✓ log ghi hanh_dong=roi_lop' : '✗ FAIL log: ' + JSON.stringify(log))

// dọn
await c.query('delete from hoc_sinh_lop_log where hoc_sinh_id=$1', [hs.id])
await c.query('delete from hoc_sinh_lop where hoc_sinh_id=$1', [hs.id])
await c.query('delete from hoc_sinh where id=$1', [hs.id])
console.log('đã dọn seed ZZTEST99')
await c.end()
