import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const dup = (await c.query(`select buoi_hoc_id, phase, problem_no, count(*) n from gami_session_problems group by 1,2,3 having count(*)>1 order by n desc`)).rows
console.log('Nhóm (buoi,phase,problem_no) bị TRÙNG:', dup.length, '| tổng dòng dư:', dup.reduce((s,r)=>s+(r.n-1),0))
const withGrades = (await c.query(`select count(distinct p.id) n from gami_session_problems p join gami_grades g on g.problem_id=p.id where (p.buoi_hoc_id,p.phase,p.problem_no) in (select buoi_hoc_id,phase,problem_no from gami_session_problems group by 1,2,3 having count(*)>1)`)).rows[0].n
console.log('Dòng trùng CÓ điểm chấm:', withGrades)
await c.end()
