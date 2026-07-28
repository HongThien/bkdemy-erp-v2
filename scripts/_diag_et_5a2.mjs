// Chẩn đoán: ET lớp 5A2 ngày 20/07 — in ra 5 câu nhưng nhóm lớp thấy 6 câu.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

const LOP = process.argv[2] ?? '5A2'
const NGAY = process.argv[3] ?? '2026-07-20'

const { rows: docs } = await c.query(`
  select tl.id, tl.ten, tl.loai, tl.ngay::text ngay, tl.created_at, tl.updated_at, tl.file_url,
         l.ten_lop
  from tai_lieu tl join lop l on l.id = tl.lop_id
  where tl.loai = 'et' and l.ten_lop = $1 and tl.ngay = $2
  order by tl.created_at desc`, [LOP, NGAY])

console.log(`[A] Doc ET của ${LOP} ngày ${NGAY}: ${docs.length} doc`)
for (const d of docs) {
  console.log(`  id=${d.id}`)
  console.log(`     ten="${d.ten}" tạo=${d.created_at.toISOString()} sửa=${d.updated_at?.toISOString()}`)
  console.log(`     file_url=${d.file_url ?? '(chưa có link)'}`)
  const { rows: phans } = await c.query(
    `select id, thu_tu, loai_phan, tieu_de from tai_lieu_phan where tai_lieu_id=$1 order by thu_tu, id`, [d.id])
  console.log(`     phan: ${phans.length}`)
  for (const p of phans) {
    const { rows: caus } = await c.query(
      `select ma_cau, thu_tu from tai_lieu_cau where phan_id=$1 order by thu_tu`, [p.id])
    console.log(`       - phan ${p.id.slice(0,8)} loai=${p.loai_phan} tieu_de="${p.tieu_de}" → ${caus.length} câu: ${caus.map(x=>`${x.thu_tu}:${x.ma_cau}`).join(' ')}`)
  }
}

// [B] Buổi học tương ứng + số câu ET mà khâu CHẤM đang thấy
const { rows: buoi } = await c.query(`
  select b.id, b.ngay::text ngay, b.ingame_dong_at, b.mt_dong_at, b.danh_gia_xong_at
  from buoi_hoc b join lop l on l.id = b.lop_id
  where l.ten_lop = $1 and b.ngay = $2`, [LOP, NGAY])
console.log(`\n[B] buoi_hoc: ${buoi.length}`)
buoi.forEach(b => console.log(`  ${b.id} ngay=${b.ngay} et_dong=${b.ingame_dong_at ?? '-'} `))

// [C] Điểm ET đã chấm — có bao nhiêu MÃ CÂU khác nhau đã có điểm
for (const b of buoi) {
  const { rows: g } = await c.query(`
    select ma_cau, count(*) n from bt_grades where buoi_hoc_id = $1 group by ma_cau order by ma_cau`, [b.id])
    .catch(async () => ({ rows: [] }))
  if (g.length) {
    console.log(`\n[C] bt_grades của buổi ${b.id.slice(0,8)}: ${g.length} mã câu khác nhau`)
    g.forEach(r => console.log(`     ${r.ma_cau} × ${r.n} HS`))
  }
}

// [D] Lịch sử: có doc ET nào khác cùng lớp quanh ngày đó không (trùng/mồ côi)
const { rows: quanh } = await c.query(`
  select tl.id, tl.ngay::text ngay, tl.ten, tl.created_at,
         (select count(*) from tai_lieu_cau tc join tai_lieu_phan tp on tp.id=tc.phan_id where tp.tai_lieu_id=tl.id) so_cau
  from tai_lieu tl join lop l on l.id = tl.lop_id
  where tl.loai='et' and l.ten_lop=$1 and tl.ngay between $2::date - 7 and $2::date + 7
  order by tl.ngay desc, tl.created_at desc`, [LOP, NGAY])
console.log(`\n[D] ET của ${LOP} trong ±7 ngày:`)
quanh.forEach(r => console.log(`     ${r.ngay} "${r.ten}" ${r.so_cau} câu (tạo ${r.created_at.toISOString().slice(0,16)}) id=${r.id.slice(0,8)}`))

await c.end()
