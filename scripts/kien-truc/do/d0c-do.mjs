import fs from 'fs'; import pg from 'pg';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const r = await c.query(`select p.proname, pg_get_function_identity_arguments(p.oid) args, l.lanname lang, p.prosecdef secdef, pg_get_userbyid(p.proowner) own, p.prosrc src,
   (select count(*) from pg_policies po where (coalesce(po.qual,'')||coalesce(po.with_check,'')) ~ ('(^|[^a-z0-9_])'||p.proname||'\\(')) so_policy
 from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace and (p.prosrc ~ 'jwt_email' or p.proname in ('current_nhan_su_id','my_hoc_sinh_id','la_thanh_vien')) order by 1`);
for (const x of r.rows) { console.log(`\n### ${x.proname}(${x.args}) lang=${x.lang} secdef=${x.secdef} owner=${x.own} policy=${x.so_policy}`); console.log(x.src.trim().slice(0, 900)); }
// tai khoan dev trong .env.local co phu thuoc nhanh email / nhan su nghi khong (chi in trang thai, khong in email)
let dev = ''; try { dev = (fs.readFileSync('.env.local', 'utf8').match(/^\s*VITE_DEV_ACCOUNTS\s*=\s*(.+)$/m) || [])[1] || ''; } catch { }
const emails = dev.split(',').map(s => (s.split('|')[1] || '').trim().toLowerCase()).filter(Boolean);
const k = await c.query(`select e.ord, n.trang_thai, exists(select 1 from tai_khoan t where t.nhan_su_id = n.id) co_tk, (n.id is not null) la_ns from unnest($1::text[]) with ordinality e(email, ord) left join nhan_su n on lower(n.email) = e.email order by 1`, [emails]);
console.log('\n### tai khoan dev (.env.local) — thu tu | trang thai | co dong tai_khoan | la nhan su:'); for (const x of k.rows) console.log('  #' + x.ord, x.trang_thai, x.co_tk, x.la_ns);
const s = await c.query(`select count(*) filter (where n.trang_thai='dang_lam')::int dang_lam, count(*) filter (where n.trang_thai<>'dang_lam')::int nghi, count(distinct n.trang_thai)::int so_trang_thai, string_agg(distinct n.trang_thai, ',') ds from tai_khoan t join nhan_su n on n.id=t.nhan_su_id`);
console.log('\n### tai_khoan noi nhan su:', JSON.stringify(s.rows[0]));
await c.end();
