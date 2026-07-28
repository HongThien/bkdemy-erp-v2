// DIAG (read-only) — mô phỏng timBuoiTheoLop('9A1'): buổi THẬT + buổi ẢO sắp tới của lớp khớp tên.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const q = process.argv[2] ?? '9A1'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const lops = (await c.query(`select id, ten_lop, mon, khoi, ngay_khai_giang, trang_thai from lop where ten_lop ilike $1 limit 50`, [`%${q}%`])).rows
console.log(`Lớp khớp "${q}":`, lops.map((l) => `${l.ten_lop}(${l.mon}, ${l.trang_thai})`).join(' · ') || '(không có)')
if (!lops.length) { await c.end(); process.exit(0) }
const ids = lops.map((l) => l.id)
const bh = (await c.query(`select id, lop_id, ngay, thu, loai, trang_thai, gio_bat_dau from buoi_hoc where lop_id = any($1) order by ngay desc limit 500`, [ids])).rows
console.log(`Buổi THẬT: ${bh.length}`)
const ten = new Map(lops.map((l) => [l.id, l.ten_lop]))
for (const b of bh.slice(0, 8)) console.log(`   ${ten.get(b.lop_id)} | ${String(b.ngay).slice(0, 15)} | ${b.loai} | ${b.trang_thai}`)
const tkb = (await c.query(`select lop_id, thu, gio_bat_dau, hieu_luc_tu, hieu_luc_den from thoi_khoa_bieu where lop_id = any($1)`, [ids])).rows
console.log(`Slot TKB: ${tkb.length} —`, tkb.map((s) => `${ten.get(s.lop_id)}:T${s.thu}`).join(' '))
await c.end()
