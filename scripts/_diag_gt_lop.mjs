// DIAG (read-only) — soi bộ giáo trình theo lớp: doc vận hành (giao_trinh_buoi/btvn) đã gán,
// tiêu đề mốc buổi hiện tại vs SỐ BUỔI CỦA LỚP mà renumberBuoiLop sẽ đặt.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const url = readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const { rows } = await c.query(`
  select l.ten_lop, t.id, t.loai, t.ngay, t.ten, t.stt_lop, p.tieu_de
  from tai_lieu t join lop l on l.id = t.lop_id
  left join tai_lieu_phan p on p.tai_lieu_id = t.id and p.loai_phan = 'buoi'
  where t.loai in ('giao_trinh_buoi','btvn') and t.ngay is not null
  order by l.ten_lop, t.ngay, t.loai`)
const byLop = new Map()
for (const r of rows) (byLop.get(r.ten_lop) ?? byLop.set(r.ten_lop, []).get(r.ten_lop)).push(r)
const top = [...byLop.entries()].sort((a, b) => b[1].length - a[1].length).slice(0, 3)
for (const [lop, rs] of top) {
  const ngays = [...new Set(rs.map((r) => r.ngay.toISOString().slice(0, 10)))].sort()
  console.log(`\n=== ${lop} — ${rs.length} doc / ${ngays.length} buổi ===`)
  for (const r of rs) {
    const d = r.ngay.toISOString().slice(0, 10)
    console.log(`  buổi-lớp ${String(ngays.indexOf(d) + 1).padStart(2)} | ${d} | ${r.loai.padEnd(16)} | stt_lop=${r.stt_lop ?? '-'} | mốc="${r.tieu_de ?? '(không có)'}" | ten="${r.ten}"`)
  }
}
await c.end()
