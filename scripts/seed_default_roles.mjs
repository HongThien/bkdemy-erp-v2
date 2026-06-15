// Seed BẢN NHÁP role mặc định: 1 role/team + gán cho mọi ghế. Idempotent (chạy lại an toàn).
// Role→màn là CHÍNH SÁCH — đây chỉ là draft để Thùy chỉnh trong màn Phân quyền.
import { readFileSync } from 'fs'
import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()

const PLAN = {
  'Giáo viên': { ten: 'GV thường',     fns: ['buoihoc','hs','lop','tkb','bdkt','lamtailieu','db_chatluong','db_tongquan'] },
  'Trợ giảng': { ten: 'Trợ giảng',     fns: ['buoihoc','hs','lop','tkb'] },
  'Vận hành':  { ten: 'Vận hành (Ops)',fns: ['buoihoc','phancong','tkb','hs','lop','giaoviec','db_tongquan','db_chatluong'] },
  'Học thuật': { ten: 'Học thuật',     fns: ['bdkt','lamtailieu','tl','hs','lop','db_chatluong'] },
  'Media':     { ten: 'Media',         fns: ['tl','lamtailieu','db_tongquan'] },
  'Marketing': { ten: 'Marketing',     fns: ['tl','db_tongquan'] },
}
try {
  await c.query('begin')
  for (const [teamTen, { ten, fns }] of Object.entries(PLAN)) {
    const tm = await c.query(`select id from team where ten=$1`, [teamTen])
    if (!tm.rows.length) { console.log('⚠ bỏ qua team không thấy:', teamTen); continue }
    const teamId = tm.rows[0].id
    // role (upsert theo tên)
    let r = await c.query(`select id from vai_tro where ten=$1`, [ten])
    const roleId = r.rows.length ? r.rows[0].id : (await c.query(`insert into vai_tro(ten,mo_ta) values($1,$2) returning id`, [ten, 'Bản nháp seed theo team ' + teamTen])).rows[0].id
    // chức năng (replace sạch)
    await c.query(`delete from vai_tro_chuc_nang where vai_tro_id=$1`, [roleId])
    for (const f of fns) await c.query(`insert into vai_tro_chuc_nang(vai_tro_id,chuc_nang) values($1,$2) on conflict do nothing`, [roleId, f])
    // gán cho mọi ghế của team
    const up = await c.query(`update vi_tri set vai_tro_id=$1 where team_id=$2 returning id`, [roleId, teamId])
    console.log(`${teamTen}: role "${ten}" (${fns.length} màn) → gán ${up.rowCount} ghế`)
  }
  await c.query('commit')
  // tổng kết: ghế nào vẫn chưa có role
  const orphan = await c.query(`select count(*) n from vi_tri where vai_tro_id is null`)
  console.log('Ghế chưa có role:', orphan.rows[0].n)
} catch(e){ await c.query('rollback'); console.error('FAIL', e.message); process.exitCode=1 }
finally { await c.end() }
