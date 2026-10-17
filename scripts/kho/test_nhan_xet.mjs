// Kiểm migration "nhận xét lúc duyệt" TRONG ROLLBACK (không ghi gì): node scripts/kho/test_nhan_xet.mjs
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
let ok = 0, sai = 0
const kt = (dk, ten) => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten) } }
await c.query('begin')
try {
  const mig = fs.readdirSync('supabase/migrations').filter((f) => f.includes('kho_nhan_xet_can_sua'))[0]
  const daCo = (await c.query(`select to_regclass('kho_nhan_xet') t`)).rows[0].t
  if (!daCo) await c.query(fs.readFileSync('supabase/migrations/' + mig, 'utf8'))
  // một tài khoản nhân sự thật (đóng vai người duyệt)
  const tk = (await c.query(`select t.id, t.nhan_su_id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  const cau = (await c.query(`select ma_cau from dai_cau_hoi where xoa_at is null and da_duyet = false limit 1`)).rows[0].ma_cau
  const r1 = (await c.query(`select fn_kho_nhan_xet_ghi('cau','toan',$1,'loi_giai','Bước 2 sai dấu; sửa lại -3 thành +3','test') j`, [cau])).rows[0].j
  kt(r1.trang_thai === 'cho_sua' && r1.ds.length === 1, `ghi nhận xét ⇒ cho_sua (${cau})`)
  kt(r1.ds[0].nguoi_ten !== '', 'nhận xét có tên người ghi')
  const r2 = (await c.query(`select fn_kho_nhan_xet_ghi('cau','toan',$1,'dap_an','Đáp án đúng là 7','test') j`, [cau])).rows[0].j
  kt(r2.ds.length === 2, '2 nhận xét cùng câu gom 1 đối tượng')
  await c.query(`insert into kho_nhan_xet_xu_ly (nhan_xet_id, ket_qua, ghi_chu, boi, nguoi) values ($1,'da_sua','Đã sửa bước 2','claude',null)`, [r2.ds[0].id])
  let t = (await c.query(`select * from fn_kho_nhan_xet_trang_thai('cau','toan') where ma=$1`, [cau])).rows[0]
  kt(t.trang_thai === 'cho_sua', 'xử lý 1/2 nhận xét ⇒ vẫn cho_sua')
  await c.query(`insert into kho_nhan_xet_xu_ly (nhan_xet_id, ket_qua, ghi_chu, boi, nguoi) values ($1,'da_sua','Đổi đáp án 5 → 7','claude',null)`, [r2.ds[1].id])
  t = (await c.query(`select * from fn_kho_nhan_xet_trang_thai('cau','toan') where ma=$1`, [cau])).rows[0]
  kt(t.trang_thai === 'da_sua', 'xử lý đủ ⇒ da_sua')
  const d = (await c.query(`select fn_kho_nhan_xet_dem() j`)).rows[0].j
  kt(d.da_sua >= 1, `đếm: ${JSON.stringify(d)}`)
  let loi = null
  try { await c.query('savepoint s'); await c.query(`select fn_kho_nhan_xet_ghi('cau','toan',$1,'loi_giai','   ','test')`, [cau]) } catch (e) { loi = e.message; await c.query('rollback to savepoint s') }
  kt(loi, 'nhận xét rỗng bị chặn')
  loi = null
  try { await c.query('savepoint s2'); await c.query(`select fn_kho_nhan_xet_ghi('cau','toan',$1,'linh_tinh','x','test')`, [cau]) } catch (e) { loi = e.message; await c.query('rollback to savepoint s2') }
  kt(loi, 'khâu lạ bị chặn (CHECK)')
  const acl = (await c.query(`select has_function_privilege('anon','fn_kho_nhan_xet_ghi(text,text,text,text,text,text)','execute') a,
                                     has_table_privilege('authenticated','kho_nhan_xet','update') u`)).rows[0]
  kt(!acl.a && !acl.u, 'anon không gọi được · authenticated không UPDATE được')
} catch (e) { sai++; console.log('LỖI:', e.message) }
await c.query('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK, không ghi gì)`)
process.exitCode = sai ? 1 : 0
