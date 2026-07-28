// Mổ kỹ 3 ca lệch trước khi vá: doc nào, ai chấm lúc nào, ô nào có điểm.
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

const CA = [['5A2', '2026-07-20'], ['7S2', '2026-07-13'], ['8B1', '2026-07-02']]

for (const [lop, ngay] of CA) {
  console.log(`\n${'='.repeat(70)}\n${lop} · ${ngay}\n${'='.repeat(70)}`)

  const { rows: docs } = await c.query(`
    select tl.id, tl.ten, tl.mon, tl.created_at, tl.updated_at
    from tai_lieu tl join lop l on l.id = tl.lop_id
    where tl.loai='et' and l.ten_lop=$1 and tl.ngay=$2 order by tl.created_at`, [lop, ngay])
  console.log(`DOC ET: ${docs.length}`)
  for (const d of docs) {
    const { rows: caus } = await c.query(
      `select tc.ma_cau, tc.thu_tu from tai_lieu_cau tc join tai_lieu_phan tp on tp.id=tc.phan_id
       where tp.tai_lieu_id=$1 order by tp.thu_tu, tc.thu_tu`, [d.id])
    const tbl = d.mon === 'KHTN' ? ['khtn_cau_hoi'] : ['dai_cau_hoi', 'hinh_bai']
    const map = {}
    for (const t of tbl) { try { const { rows } = await c.query(`select ma_cau, dang_chinh from ${t} where ma_cau = any($1)`, [caus.map(x=>x.ma_cau)]); rows.forEach(r=>map[r.ma_cau]=r.dang_chinh) } catch {} }
    console.log(`  doc ${d.id.slice(0,8)} tạo=${d.created_at.toISOString().slice(0,16)} sửa=${d.updated_at.toISOString().slice(0,16)} ${d.created_at.getTime()===d.updated_at.getTime()?'(chưa sửa)':'(ĐÃ SỬA)'}`)
    caus.forEach((x,i)=>console.log(`     ${i+1}. ${x.ma_cau}  dạng ${map[x.ma_cau] ?? '?'}`))
  }

  const { rows: probs } = await c.query(`
    select p.id, p.problem_no, p.ma_dang, p.opened_at,
           (select count(*) from gami_grades g where g.problem_id=p.id) n,
           (select min(g.graded_at) from gami_grades g where g.problem_id=p.id) cham_dau,
           (select max(g.graded_at) from gami_grades g where g.problem_id=p.id) cham_cuoi
    from gami_session_problems p join buoi_hoc b on b.id=p.buoi_hoc_id join lop l on l.id=b.lop_id
    where l.ten_lop=$1 and b.ngay=$2 and p.phase='et' order by p.problem_no`, [lop, ngay])
  console.log(`  LƯỚI CHẤM (seed ${probs[0]?.opened_at.toISOString().slice(0,16) ?? '-'}):`)
  probs.forEach(p=>console.log(`     ô ${p.problem_no} dạng ${p.ma_dang} · ${p.n} điểm · chấm ${p.cham_dau?.toISOString().slice(0,16) ?? '-'} → ${p.cham_cuoi?.toISOString().slice(0,16) ?? '-'} · id=${p.id}`))

  const { rows: b } = await c.query(`select b.id, b.et_dong_at from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop=$1 and b.ngay=$2 and b.loai='thuong' and b.trang_thai<>'huy'`, [lop, ngay])
  console.log(`  buoi_hoc=${b[0]?.id} · ET đã xác nhận (tính Elo): ${b[0]?.et_dong_at ? 'RỒI ' + b[0].et_dong_at.toISOString().slice(0,16) : 'chưa'}`)
}
await c.end()
