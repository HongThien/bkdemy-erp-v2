import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async s => (await c.query(s)).rows
for (const ten of ['9A2','9B1']) {
  const b = (await q(`select b.id, b.trang_thai, b.ingame_dong_at, b.et_dong_at from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='${ten}' and b.loai='thuong' order by b.ngay desc limit 1`))[0]
  if(!b){console.log(ten,'— không có buổi');continue}
  const ing = await q(`select count(*)::int n, min(problem_no) mn, max(problem_no) mx from gami_session_problems where buoi_hoc_id='${b.id}' and phase='ingame'`)
  const et = (await q(`select count(*)::int n from gami_session_problems where buoi_hoc_id='${b.id}' and phase='et'`))[0].n
  const gr = (await q(`select count(*)::int n, count(muc)::int with_muc from gami_grades g where g.buoi_hoc_id='${b.id}' and g.problem_id in (select id from gami_session_problems where buoi_hoc_id='${b.id}' and phase='ingame')`))[0]
  const com = (await q(`select count(*)::int n from buoi_hoc_hs where buoi_hoc_id='${b.id}' and diem_danh='co_mat'`))[0].n
  console.log(`${ten} [${b.trang_thai}] ingame_dong=${!!b.ingame_dong_at} et_dong=${!!b.et_dong_at} | ingame bài=${ing[0].n}(no ${ing[0].mn}-${ing[0].mx}) · et=${et} · co_mat=${com} · grades ingame=${gr.n}(có muc ${gr.with_muc})`)
}
await c.end()
