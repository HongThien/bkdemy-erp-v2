// Kiểm QUYỀN tĩnh cho màn Cây nhánh: role `authenticated` có EXECUTE mọi hàm `fn_hl_*`/`_hl_*` + hàm trigger gọi tới,
// và RLS của hinh_mo_hinh / hinh_baitoan cho authenticated đọc + ghi. (Chỉ đọc catalog.)
// Vì sao: test C1/C2 chạy bằng role SỞ HỮU nên không thấy "permission denied for function _hl_duong_mo_hinh"
// (lộ ra khi mở app 14/10). Role claude_build không `set role authenticated` được ⇒ kiểm bằng has_function_privilege.
// Chạy: node scripts/_test_hl_cay_nhanh_rls.mjs
import { readFileSync } from 'node:fs'
import pg from 'pg'
const txt = readFileSync(new URL('../.env', import.meta.url), 'utf8')
const pick = k => (txt.match(new RegExp(`^\\s*${k}\\s*=\\s*(.+?)\\s*$`, 'm')) || [])[1]?.replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: pick('DATABASE_URL_RO') || pick('DATABASE_URL'), ssl: { rejectUnauthorized: false } })
await c.connect(); await c.query('BEGIN READ ONLY')
const fn = await c.query(`
  select p.proname, pg_get_function_identity_arguments(p.oid) args,
         has_function_privilege('authenticated', p.oid, 'execute') auth,
         has_function_privilege('anon', p.oid, 'execute') anon, p.prosecdef
  from pg_proc p join pg_namespace n on n.oid = p.pronamespace and n.nspname = 'public'
  where (p.proname ~ '^(fn_hl_|_hl_)') and p.prorettype <> 'trigger'::regtype   -- hàm trigger không gọi trực tiếp được ⇒ bỏ qua
  order by 1`)
const pol = await c.query(`
  select tablename, policyname, cmd, roles::text from pg_policies
  where schemaname='public' and tablename in ('hinh_mo_hinh','hinh_baitoan','hinh_cach_giai','hinh_cach_tien_de','hinh_mo_hinh_cha') order by 1,2`)
await c.query('ROLLBACK'); await c.end()
let bad = 0
console.log('— EXECUTE —')
for (const r of fn.rows) {
  const loi = !r.auth || r.anon
  if (loi) bad++
  console.log(`  ${loi ? '✘' : '✔'} ${r.proname}(${r.args})  authenticated=${r.auth} anon=${r.anon}${r.prosecdef ? ' DEFINER' : ''}`)
}
console.log('— RLS —')
for (const r of pol.rows) console.log(`  ${r.tablename} · ${r.policyname} · ${r.cmd} · ${r.roles}`)
console.log(`\n${bad ? '❌' : '✅'} ${fn.rowCount} hàm · ${bad} sai quyền`)
process.exit(bad ? 1 : 0)
