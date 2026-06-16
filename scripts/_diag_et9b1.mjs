import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async s => (await c.query(s)).rows
const b = (await q(`select b.id, b.ngay, b.trang_thai, b.lop_id, l.ten_lop from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop='9B1' and b.loai='thuong' order by b.ngay desc limit 1`))[0]
if(!b){console.log('Không thấy buổi 9B1');await c.end();process.exit(0)}
console.log(`Buổi 9B1 ${b.ngay.toISOString?.()??b.ngay} [${b.trang_thai}] id=${b.id}`)
const prob = await q(`select id, problem_no, ma_dang from gami_session_problems where buoi_hoc_id='${b.id}' and phase='et' order by problem_no`)
console.log(`ET problems (đã seed vào buổi): ${prob.length}`)
const gr = await q(`select count(*)::int n from gami_grades g where g.problem_id in (select id from gami_session_problems where buoi_hoc_id='${b.id}' and phase='et')`)
console.log(`Điểm chấm trên các problem ET đó: ${gr[0].n}`)
const et = await q(`select id, ten, ngay from tai_lieu where loai='et' and lop_id='${b.lop_id}' and ngay=(select ngay from buoi_hoc where id='${b.id}')`)
console.log(`ET doc khớp (lớp+ngày): ${et.length}` + (et.length?` → ${et.map(e=>e.ten).join(' | ')}`:''))
if(et.length){ const caus=await q(`select count(*)::int n from tai_lieu_cau tc join tai_lieu_phan tp on tp.id=tc.phan_id where tp.tai_lieu_id='${et[0].id}'`); console.log(`Số câu trong ET doc: ${caus[0].n}`) }
await c.end()
