// Kiểm mig "⏭ Để sau" TRONG ROLLBACK (không ghi gì): node scripts/kho/test_de_sau.mjs
import pg from 'pg'
import fs from 'node:fs'
const env = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env }); await c.connect()
let ok = 0, sai = 0
const kt = (dk, ten) => { if (dk) { ok++; console.log('  ✔', ten) } else { sai++; console.log('  ✘', ten) } }
await c.query('begin')
try {
  if (!(await c.query(`select to_regclass('kho_de_sau') t`)).rows[0].t) {
    const f = fs.readdirSync('supabase/migrations').find((x) => x.includes('_kho_de_sau.sql'))
    await c.query(fs.readFileSync('supabase/migrations/' + f, 'utf8'))
  }
  const tk = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id = t.nhan_su_id where n.la_admin_he_thong order by t.created_at limit 1`)).rows[0]
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  const a1 = (await c.query(`select fn_kho_de_sau_ghi('cau','toan','TEST_DS_1','thử') at`)).rows[0].at
  await c.query(`select pg_sleep(0.01)`)
  // now() cố định trong 1 transaction ⇒ chèn tay mốc sau để kiểm "lần gần nhất"
  await c.query(`insert into kho_de_sau (doi_tuong, mon, ma, at) values ('cau','toan','TEST_DS_1', now() + interval '1 minute')`)
  await c.query(`select fn_kho_de_sau_ghi('cau','toan','TEST_DS_2')`)
  const ds = (await c.query(`select * from fn_kho_de_sau_ds('cau','toan') where ma like 'TEST_DS_%' order by ma`)).rows
  kt(ds.length === 2, `đọc lại 2 mã đã để sau (${ds.length})`)
  kt(ds[0] && new Date(ds[0].at) > new Date(a1), 'mỗi mã lấy lần bấm GẦN NHẤT')
  kt(+(await c.query(`select count(*) from fn_kho_de_sau_ds('form_tn','toan') where ma like 'TEST_DS_%'`)).rows[0].count === 0, 'lọc theo loại đối tượng')
  // script chạy bằng role chủ bảng (bỏ qua revoke) ⇒ kiểm QUYỀN của authenticated thay vì thử update
  const q = (await c.query(`select has_table_privilege('authenticated','kho_de_sau','UPDATE') u, has_table_privilege('authenticated','kho_de_sau','DELETE') d, has_table_privilege('authenticated','kho_de_sau','INSERT') i`)).rows[0]
  kt(!q.u && !q.d && q.i, 'append-only: authenticated chỉ INSERT, không UPDATE/DELETE')
  kt(!(await c.query(`select has_function_privilege('anon','fn_kho_de_sau_ghi(text,text,text,text)','execute') a`)).rows[0].a, 'anon không gọi được')
} catch (e) { sai++; console.log('LỖI:', e.message) }
await c.query('rollback'); await c.end()
console.log(`${ok} ✔ · ${sai} ✘ (ROLLBACK, không ghi gì)`)
process.exitCode = sai ? 1 : 0
