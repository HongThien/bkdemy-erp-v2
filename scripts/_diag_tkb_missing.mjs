// Chẩn đoán: TKB không hiển thị hết lớp. So dữ liệu THẬT vs logic render của TKBScreen.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

const ROOMS = ['P101', 'P102', 'P201', 'P202', 'P301', 'P302']
const THU_COLS = [2, 3, 4, 5, 6, 7, 8]
const BANDS = [[0, 600], [600, 720], [720, 840], [840, 960], [960, 1080], [1080, 1170], [1170, 1440]]
const toMin = (t) => Number(t.slice(0, 2)) * 60 + Number(t.slice(3, 5))

const { rows } = await c.query(`
  select t.id, t.thu, t.gio_bat_dau::text gio_bat_dau, t.gio_ket_thuc::text gio_ket_thuc,
         t.phong, t.hieu_luc_tu::text hieu_luc_tu, t.hieu_luc_den::text hieu_luc_den,
         l.ten_lop, l.mon, l.trang_thai
  from thoi_khoa_bieu t join lop l on l.id = t.lop_id
  order by t.thu, t.gio_bat_dau`)

const live = rows.filter((r) => r.hieu_luc_den === null)
console.log(`TỔNG slot trong DB: ${rows.length} · còn hiệu lực (hieu_luc_den null): ${live.length} · đã đóng: ${rows.length - live.length}`)

// 1. thu ngoài 2..8
const badThu = live.filter((r) => !THU_COLS.includes(r.thu))
console.log(`\n[1] thu ngoài 2..8 (không có cột → MẤT): ${badThu.length}`)
badThu.forEach((r) => console.log(`    thu=${r.thu} ${r.ten_lop} ${r.gio_bat_dau}`))

// 2. phòng lạ (không thuộc 6 phòng cố định)
const badPhong = live.filter((r) => !ROOMS.includes(r.phong ?? ''))
console.log(`\n[2] phòng NULL / ngoài danh sách 6 phòng: ${badPhong.length}`)
const byPhong = {}
badPhong.forEach((r) => { byPhong[r.phong ?? 'NULL'] = (byPhong[r.phong ?? 'NULL'] ?? 0) + 1 })
console.log('   ', JSON.stringify(byPhong))

// 3. Mô phỏng render: mỗi (band × thu) chỉ vẽ được 6 ô phòng, find() lấy slot ĐẦU TIÊN
const shown = new Set()
for (const [lo, hi] of BANDS) {
  for (const thu of THU_COLS) {
    const cell = live.filter((s) => s.thu === thu && toMin(s.gio_bat_dau) >= lo && toMin(s.gio_bat_dau) < hi)
    for (const phong of ROOMS) {
      const s = cell.find((x) => (x.phong ?? '') === phong && !shown.has(x.id))
        ?? (phong === ROOMS[5] ? cell.find((x) => !ROOMS.includes(x.phong ?? '')) : undefined)
      // Lưu ý: code thật KHÔNG có !shown.has → mô phỏng đúng find() gốc:
      const sReal = cell.find((x) => (x.phong ?? '') === phong)
        ?? (phong === ROOMS[5] ? cell.find((x) => !ROOMS.includes(x.phong ?? '')) : undefined)
      if (sReal) shown.add(sReal.id)
    }
  }
}
const missing = live.filter((r) => !shown.has(r.id))
console.log(`\n[3] Slot KHÔNG được vẽ trên lưới (mô phỏng logic hiện tại): ${missing.length}/${live.length}`)
for (const r of missing) console.log(`    thu${r.thu} ${r.gio_bat_dau.slice(0,5)}-${r.gio_ket_thuc.slice(0,5)} ${String(r.phong).padEnd(6)} ${r.ten_lop} (${r.mon})`)

// 4. Va chạm: cùng band × thu × phòng > 1 slot
console.log(`\n[4] Va chạm (cùng khung × thứ × phòng có >1 ca):`)
for (const [lo, hi] of BANDS) {
  for (const thu of THU_COLS) {
    const cell = live.filter((s) => s.thu === thu && toMin(s.gio_bat_dau) >= lo && toMin(s.gio_bat_dau) < hi)
    const g = {}
    cell.forEach((s) => { const k = s.phong ?? 'NULL'; (g[k] ??= []).push(s) })
    for (const [k, v] of Object.entries(g)) if (v.length > 1)
      console.log(`    thu${thu} khung ${Math.floor(lo/60)}h-${Math.floor(hi/60)}h ${k}: ${v.map((s) => `${s.ten_lop}@${s.gio_bat_dau.slice(0,5)}`).join(' | ')}`)
  }
}

// 5. Lớp đang học mà KHÔNG có slot nào
const { rows: lopKoTkb } = await c.query(`
  select l.ten_lop, l.mon, l.trang_thai from lop l
  where not exists (select 1 from thoi_khoa_bieu t where t.lop_id = l.id and t.hieu_luc_den is null)
  order by l.trang_thai, l.ten_lop`)
console.log(`\n[5] Lớp KHÔNG có slot TKB còn hiệu lực: ${lopKoTkb.length}`)
lopKoTkb.forEach((r) => console.log(`    ${r.ten_lop} (${r.mon}) trang_thai=${r.trang_thai}`))

await c.end()
