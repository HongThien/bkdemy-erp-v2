// LÊN LỚP năm học 2026–27 (chạy 1 LẦN sau import V1 — data V1 là năm 2025–26).
// HS khối ≤11: khoi+1. Khối 12: tot_nghiep + rời lớp. Lớp: tên số-đầu+1 & khoi+1; lớp 12 đóng + ngừng TKB.
import { readFileSync } from 'node:fs'
import pg from 'pg'

const dbUrl = readFileSync(new URL('../.env', import.meta.url), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: dbUrl })
await c.connect()
await c.query('begin')
try {
  // guard chạy-lại: nếu đã có lớp khối 13 hoặc không còn lớp khối 12 đang học + đã có HS tốt nghiệp → coi như đã chạy
  const done = await c.query(`select 1 from hoc_sinh where trang_thai='tot_nghiep' limit 1`)
  if (done.rows.length) throw new Error('Có vẻ ĐÃ lên lớp rồi (tồn tại HS tot_nghiep) — không chạy lại.')

  // 1) HS khối 12 → tốt nghiệp + rời mọi lớp
  const tn = await c.query(`update hoc_sinh set trang_thai='tot_nghiep' where khoi=12 returning id`)
  await c.query(`update hoc_sinh_lop set trang_thai='da_roi' where hoc_sinh_id = any($1)`, [tn.rows.map((r) => r.id)])

  // 2) HS còn lại +1 khối
  const up = await c.query(`update hoc_sinh set khoi = khoi + 1 where khoi is not null and khoi < 12 and trang_thai <> 'tot_nghiep' returning id`)

  // 3) Lớp khối 12 → đóng + ngừng TKB
  const l12 = await c.query(`update lop set trang_thai='dong' where khoi=12 returning id, ten_lop`)
  await c.query(`update hoc_sinh_lop set trang_thai='da_roi' where lop_id = any($1)`, [l12.rows.map((r) => r.id)])
  await c.query(`update thoi_khoa_bieu set hieu_luc_den = current_date where lop_id = any($1) and hieu_luc_den is null`, [l12.rows.map((r) => r.id)])

  // 4) Lớp còn lại: khoi+1, tên "8A1"→"9A1", "BỔ TRỢ K6"→"BỔ TRỢ K7"
  const lops = await c.query(`select id, ten_lop, khoi from lop where khoi is not null and khoi < 12`)
  for (const l of lops.rows) {
    let ten = l.ten_lop
    if (/^\d+/.test(ten)) ten = ten.replace(/^\d+/, (d) => String(Number(d) + 1))
    else if (/K\d+/.test(ten)) ten = ten.replace(/K(\d+)/, (_, d) => `K${Number(d) + 1}`)
    await c.query(`update lop set ten_lop=$2, khoi=$3 where id=$1`, [l.id, ten, l.khoi + 1])
  }

  await c.query('commit')
  console.log(`Tốt nghiệp: ${tn.rowCount} HS · Lên khối: ${up.rowCount} HS · Đóng lớp 12: ${l12.rows.map((r) => r.ten_lop).join(', ')} · Đổi tên/khối: ${lops.rowCount} lớp`)
} catch (e) {
  await c.query('rollback')
  console.error('ROLLBACK —', e.message)
  process.exitCode = 1
} finally { await c.end() }
