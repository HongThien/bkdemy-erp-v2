// xem-hinh.mjs — liệt kê câu Hình của các đề CKI đã ghi (chỉ đọc). Dùng: node xem-hinh.mjs [--json]
import pg from 'pg'
import { readFileSync, existsSync } from 'node:fs'
import { homedir } from 'node:os'
import { join } from 'node:path'
import { bien } from '../../../../../scripts/kho/cau-hinh.mjs'
const ids = []
for (let i = 1; i <= 22; i++) {
  const ma = 'CKI-' + String(i).padStart(2, '0'), f = join(homedir(), 'bk-kho-lam-viec/de-thi/K9-cki', ma, 'da-ghi.txt')
  if (existsSync(f)) ids.push([ma, readFileSync(f, 'utf8').match(/[0-9a-f-]{36}/)[0]])
}
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RO ?? bien('DATABASE_URL').gia_tri, ssl: { rejectUnauthorized: false } })
await c.connect()
const out = []
for (const [ma, id] of ids) {
  const { rows } = await c.query(
    `select h.ma_cau, h.dang_chinh, h.created_at::date as ngay, h.noi_dung, h.loi_giai
       from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id join hinh_hoc_cau_hoi h on h.ma_cau = tc.ma_cau
      where p.tai_lieu_id = $1 and h.xoa_at is null order by tc.thu_tu`, [id])
  for (const r of rows) out.push({ de: ma, ...r })
}
if (process.argv.includes('--json')) console.log(JSON.stringify(out))
else for (const r of out) console.log(`\n### ${r.de} ${r.ma_cau} ${r.dang_chinh} ${r.ngay.toISOString?.().slice(0, 10) ?? r.ngay}\n${r.noi_dung.replace(/\n/g, ' ').slice(0, 380)}`)
console.error('n =', out.length)
await c.end()
