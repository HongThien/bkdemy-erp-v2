// So: số câu trong DOC ET (tai_lieu_cau) vs số PROBLEM chấm (gami_session_problems phase='et').
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await c.connect()

const { rows } = await c.query(`
  with doc as (
    select tl.lop_id, tl.ngay, tl.id doc_id, tl.updated_at, tl.created_at,
           (select count(*) from tai_lieu_cau tc join tai_lieu_phan tp on tp.id = tc.phan_id
             where tp.tai_lieu_id = tl.id) so_cau_doc
    from tai_lieu tl where tl.loai = 'et' and tl.lop_id is not null and tl.ngay is not null
  )
  select l.ten_lop, d.ngay::text ngay, d.so_cau_doc, d.created_at, d.updated_at,
         b.id buoi_id,
         (select count(*) from gami_session_problems p where p.buoi_hoc_id = b.id and p.phase='et') so_problem,
         (select count(*) from gami_grades g join gami_session_problems p on p.id = g.problem_id
           where p.buoi_hoc_id = b.id and p.phase='et') so_o_da_cham
  from doc d
  join lop l on l.id = d.lop_id
  join buoi_hoc b on b.lop_id = d.lop_id and b.ngay = d.ngay and b.loai='thuong' and b.trang_thai <> 'huy'
  order by d.ngay desc`)

const lech = rows.filter(r => Number(r.so_problem) > 0 && Number(r.so_problem) !== Number(r.so_cau_doc))
console.log(`Tổng buổi có doc ET: ${rows.length} · LỆCH (doc ≠ lưới chấm): ${lech.length}\n`)
console.log('lớp    ngày        câu-trong-đề  ô-chấm  đã-chấm  sửa-đề-sau-khi-tạo?')
for (const r of lech) {
  const daSua = r.updated_at > r.created_at ? `CÓ (${r.updated_at.toISOString().slice(5,16).replace('T',' ')})` : 'không'
  console.log(`${r.ten_lop.padEnd(6)} ${r.ngay}  ${String(r.so_cau_doc).padStart(6)}       ${String(r.so_problem).padStart(4)}   ${String(r.so_o_da_cham).padStart(6)}   ${daSua}`)
}

console.log('\n— Chi tiết 5A2 20/07 —')
const { rows: p } = await c.query(`
  select p.problem_no, p.ma_dang, p.id,
         (select count(*) from gami_grades g where g.problem_id = p.id) n_cham
  from gami_session_problems p
  join buoi_hoc b on b.id = p.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.ten_lop='5A2' and b.ngay='2026-07-20' and p.phase='et' order by p.problem_no`)
p.forEach(r => console.log(`  câu ${r.problem_no} · dạng ${r.ma_dang} · đã chấm ${r.n_cham} HS`))

await c.end()
