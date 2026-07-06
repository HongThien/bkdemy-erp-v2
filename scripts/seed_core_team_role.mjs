// Seed role "Core team" — quản các số liệu tầng trên ở nhóm nav "Core team" + "Dashboard".
// Không map theo team tổ chức nào (Core team KHÔNG phải 1 trong 6 team biên chế gv/ta/ops/
// hoc_thuat/media/marketing) → tạo role rồi Thùy tự gán ghế ở tab "Gán role cho vị trí".
// Idempotent (chạy lại an toàn, upsert theo tên role).
import { readFileSync } from 'fs'
import pg from 'pg'
const url = readFileSync('.env','utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g,'')
const c = new pg.Client({ connectionString: url }); await c.connect()

const TEN = 'Core team'
// Khớp adminLeaves (src/mock/fixtures.ts) nhóm 'Core team' + 'Dashboard' — full quyền sửa (chi_xem=false).
const FNS = [
  'hocphi','ns','orgchart','phancong','tkb','phanquyen','baoloi','db_tuyendung','giaoviec', // Core team
  'db_tongquan','db_taichinh','db_chatluong',                                              // Dashboard
]

try {
  await c.query('begin')
  let r = await c.query(`select id from vai_tro where ten=$1`, [TEN])
  const roleId = r.rows.length
    ? r.rows[0].id
    : (await c.query(`insert into vai_tro(ten,mo_ta) values($1,$2) returning id`,
        [TEN, 'Team chính quản số liệu tầng trên — nhóm nav Core team + Dashboard'])).rows[0].id
  await c.query(`delete from vai_tro_chuc_nang where vai_tro_id=$1`, [roleId])
  for (const f of FNS) await c.query(`insert into vai_tro_chuc_nang(vai_tro_id,chuc_nang,chi_xem) values($1,$2,false)`, [roleId, f])
  await c.query('commit')
  console.log(`Role "${TEN}" (${FNS.length} màn, full sửa). Gán cho vị trí ở tab "Gán role cho vị trí" (Phân quyền).`)
} catch(e){ await c.query('rollback'); console.error('FAIL', e.message); process.exitCode=1 }
finally { await c.end() }
