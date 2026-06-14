// Import thời khóa biểu V1 (timetable + ca_hoc) → V2 thoi_khoa_bieu. IDEMPOTENT.
// V1: timetable(lop, thu, ca_id, ma_phong, lane, active) + ca_hoc(gio_bat_dau/ket_thuc).
// V2: thoi_khoa_bieu(lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu).
import { readFileSync } from 'node:fs'
import pg from 'pg'

const envV1 = readFileSync(new URL('../../bkdemy-erp/.env.local', import.meta.url), 'utf8')
const V1_URL = envV1.match(/VITE_SUPABASE_URL=(.+)/)[1].trim()
const V1_KEY = envV1.match(/VITE_SUPABASE_ANON_KEY=(.+)/)[1].trim()
const H = { apikey: V1_KEY, Authorization: `Bearer ${V1_KEY}` }
const v1 = async (p) => { const r = await fetch(`${V1_URL}/rest/v1/${p}`, { headers: H }); if (!r.ok) throw new Error(await r.text()); return r.json() }

const dbUrl = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: dbUrl })
await c.connect()

const cas = await v1('ca_hoc?select=id,gio_bat_dau,gio_ket_thuc&limit=500')
const caMap = new Map(cas.map((x) => [x.id, x]))
const tt = await v1('timetable?active=eq.true&select=lop,thu,ca_id,ma_phong&limit=1000')
const lops = (await c.query('select id, ten_lop from lop')).rows
const lopId = new Map(lops.map((l) => [l.ten_lop, l.id]))

let them = 0, bo = []
for (const r of tt) {
  const ca = caMap.get(r.ca_id)
  const lid = lopId.get(r.lop)
  if (!ca || !lid) { bo.push(`${r.lop} T${r.thu}`); continue }
  const ex = await c.query(
    `select id from thoi_khoa_bieu where lop_id=$1 and thu=$2 and gio_bat_dau=$3 and hieu_luc_den is null`,
    [lid, r.thu, ca.gio_bat_dau])
  if (ex.rows[0]) continue
  await c.query(
    `insert into thoi_khoa_bieu (lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu) values ($1,$2,$3,$4,$5, current_date)`,
    [lid, r.thu, ca.gio_bat_dau, ca.gio_ket_thuc, r.ma_phong || null])
  them++
}
console.log(`Thêm ${them}/${tt.length} slot. Bỏ (thiếu ca/lớp): ${bo.join(', ') || 'không'}`)
await c.end()
