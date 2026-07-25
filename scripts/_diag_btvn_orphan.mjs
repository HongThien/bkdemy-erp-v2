import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const txt = readFileSync(join(root, '.env'), 'utf8')
const url = (txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m) ?? [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()

// Docs BTVN/GT có ngay KHÔNG khớp buoi_hoc nào của lớp đó (mồ côi ngày). Chỉ xét từ 01/07 trở đi.
const { rows } = await c.query(`
  select tl.loai, l.ten_lop, tl.ngay::text, tl.ten, tl.created_at
  from tai_lieu tl join lop l on l.id = tl.lop_id
  where tl.loai in ('btvn','giao_trinh_buoi') and tl.ngay >= '2026-07-01'
    and not exists (select 1 from buoi_hoc b where b.lop_id = tl.lop_id and b.ngay = tl.ngay)
  order by l.ten_lop, tl.ngay`)
console.log(`Docs BTVN/GT mồ côi ngày (không có buoi_hoc khớp): ${rows.length}`)
for (const r of rows) console.log(` ${r.ten_lop.padEnd(6)} ${r.loai.padEnd(16)} ${r.ngay} | ${r.ten}`)

// Đối chiếu: những docs này có buoi_hoc gần đó (±35 ngày cùng thứ) không?
console.log('\n--- Với mỗi doc mồ côi, buoi_hoc cùng lớp trong ±35 ngày: ---')
for (const r of rows) {
  const { rows: near } = await c.query(`
    select b.ngay::text, b.trang_thai from buoi_hoc b join lop l on l.id=b.lop_id
    where l.ten_lop=$1 and b.ngay between ($2::date - 35) and ($2::date + 35) order by b.ngay`, [r.ten_lop, r.ngay])
  console.log(` ${r.ten_lop} ${r.loai} ${r.ngay}: buoi gần = ${near.map(n=>n.ngay+'('+n.trang_thai+')').join(', ')}`)
}
await c.end()
