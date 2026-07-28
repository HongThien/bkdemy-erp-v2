// Kiểm tra deadline BTVN (= 2h trước ca học tiếp theo) có luôn < buổi THẬT tiếp theo (buoi_hoc chưa huỷ)
// không — đối chiếu logic caTiepTheo (TKB template) với dữ liệu buoi_hoc thật (có thể có buổi bị huỷ ad-hoc).
import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

const DAY = 86400000
function ymdToUTC(ngay) { const [y, m, d] = ngay.split('-').map(Number); return Date.UTC(y, m - 1, d) }
function utcToYmd(t) { const d = new Date(t); return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}` }
function congNgay(ngay, n) { return utcToYmd(ymdToUTC(ngay) + n * DAY) }
function thuOf(ngay) { const d = new Date(ngay + 'T00:00:00').getDay(); return d === 0 ? 8 : d + 1 }
function vnInstant(ngay, gio) { const [y, m, d] = ngay.split('-').map(Number); const [hh, mm] = gio.split(':').map(Number); return Date.UTC(y, m - 1, d, hh, mm) - 7 * 3600000 }

// Lấy các buổi 'thuong' gần đây có btvn_dong_at NULL (task BTVN đang mở) để test — đại diện case thật.
const { rows: buois } = await c.query(`
  select b.id, b.lop_id, l.ten_lop, b.ngay::text ngay, b.trang_thai
  from buoi_hoc b join lop l on l.id = b.lop_id
  where b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay >= current_date - interval '45 days'
  order by b.ngay desc limit 400`)

const lopIds = [...new Set(buois.map(b => b.lop_id))]
const { rows: tkbRows } = await c.query(`
  select t.lop_id, t.thu, t.gio_bat_dau::text gio_bat_dau, t.hieu_luc_tu::text hieu_luc_tu, t.hieu_luc_den::text hieu_luc_den, l.ngay_khai_giang::text ngay_khai_giang
  from thoi_khoa_bieu t join lop l on l.id = t.lop_id
  where t.lop_id = any($1::uuid[])`, [lopIds])
const tkbByLop = new Map()
for (const s of tkbRows) { if (!tkbByLop.has(s.lop_id)) tkbByLop.set(s.lop_id, []); tkbByLop.get(s.lop_id).push(s) }

const { rows: huyRows } = await c.query(`select lop_id, ngay::text ngay from buoi_hoc where loai='thuong' and trang_thai='huy' and lop_id = any($1::uuid[])`, [lopIds])
const huyKeys = new Set(huyRows.map(r => `${r.lop_id}|${r.ngay}`))

function caTiepTheo(lopId, after) {
  for (let i = 1; i <= 21; i++) {
    const day = congNgay(after, i); const thu = thuOf(day)
    if (huyKeys.has(`${lopId}|${day}`)) continue
    const slot = (tkbByLop.get(lopId) ?? []).find(s => s.thu === thu && s.hieu_luc_tu <= day && (!s.hieu_luc_den || s.hieu_luc_den >= day) && (!s.ngay_khai_giang || s.ngay_khai_giang <= day))
    if (slot) return { day, gio: slot.gio_bat_dau.slice(0, 5) }
  }
  return null
}

// Buổi THẬT tiếp theo (chưa huỷ) trong buoi_hoc, để so sánh với "next theo TKB template".
const { rows: allBuoiThuong } = await c.query(`
  select lop_id, ngay::text ngay from buoi_hoc where loai='thuong' and trang_thai<>'huy' order by ngay`)
const realNextByLop = new Map()
for (const b of allBuoiThuong) { if (!realNextByLop.has(b.lop_id)) realNextByLop.set(b.lop_id, []); realNextByLop.get(b.lop_id).push(b.ngay) }

let nMismatch = 0, nChecked = 0
for (const b of buois) {
  const ca = caTiepTheo(b.lop_id, b.ngay)
  if (!ca) continue
  nChecked++
  const deadline = vnInstant(ca.day, ca.gio) - 2 * 3600000
  const realDates = (realNextByLop.get(b.lop_id) ?? []).filter(d => d > b.ngay).sort()
  const realNext = realDates[0]
  if (realNext && realNext !== ca.day) {
    nMismatch++
    console.log(`MISMATCH ${b.ten_lop} | buổi ${b.ngay} | TKB-next=${ca.day} ${ca.gio} (deadline ${new Date(deadline).toISOString()}) | buoi_hoc-next-THẬT=${realNext}`)
  }
}
console.log(`\nĐã kiểm ${nChecked} buổi, ${nMismatch} lệch (TKB-next != buoi_hoc thật gần nhất chưa huỷ).`)
await c.end()
