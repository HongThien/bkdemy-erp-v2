// Ghi mô tả + lý thuyết + ví dụ cho 30 dạng K10 Hàm số (chủ đề NCD00234) từ ra/cd1..4.json — Thùy 04/11
// Chạy: node kho-rules/dai/lo/k10-hs/ghi-lt-vd.mjs [--ghi]   (không --ghi = thử ROLLBACK)
// Khớp theo (tên nhóm, tên dạng) trong chủ đề; thiếu/lệch ⇒ ROLLBACK cả lượt.
import pg from 'pg'
import fs from 'node:fs'
process.loadEnvFile('.env')
const GHI = process.argv.includes('--ghi')
const dir = new URL('./ra/', import.meta.url)
const rows = [1, 2, 3, 4].flatMap((i) => JSON.parse(fs.readFileSync(new URL(`cd${i}.json`, dir), 'utf8')))

const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
await c.query('begin')
try {
  const cd = (await c.query(`select id from dai_bdm_chu_de where khoi='10' and ten='Hàm số, đồ thị và ứng dụng'`)).rows
  if (cd.length !== 1) throw new Error('chủ đề không duy nhất: ' + cd.length)
  const dangs = (await c.query(
    `select d.id, d.ten, n.ten nhom, n.id nhom_id from dai_bdm_dang_bai d join dai_bdm_nhom n on n.id=d.nhom_id where n.chu_de_id=$1`, [cd[0].id])).rows
  const chua = new Set(dangs.map((d) => d.id))
  for (const r of rows) {
    if (!r.mo_ta || !r.ly_thuyet || !r.vi_du) throw new Error('thiếu trường: ' + r.dang)
    const m = dangs.filter((d) => d.ten === r.dang && d.nhom === r.nhom)
    if (m.length !== 1) throw new Error(`không khớp 1 dạng: ${r.nhom} / ${r.dang} (${m.length})`)
    if (!chua.delete(m[0].id)) throw new Error('trùng dạng: ' + r.dang)
    await c.query(`update dai_bdm_dang_bai set mo_ta=$2, ly_thuyet=$3, vi_du=$4, updated_at=now() where id=$1`, [m[0].id, r.mo_ta, r.ly_thuyet, r.vi_du])
  }
  if (chua.size) throw new Error('dạng chưa có nội dung: ' + [...chua].join(','))
  console.log(`${rows.length} dạng cập nhật`)
  if (GHI) { await c.query('commit'); console.log('ĐÃ GHI') } else { await c.query('rollback'); console.log('Thử xong — ROLLBACK') }
} catch (e) { await c.query('rollback'); console.error('LỖI, ROLLBACK:', e.message); process.exitCode = 1 }
await c.end()
