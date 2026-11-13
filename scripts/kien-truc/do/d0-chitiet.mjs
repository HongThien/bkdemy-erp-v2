import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const fns = JSON.parse(fs.readFileSync(S + '/d0-fns.json', 'utf8'));
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const T8 = ['_migrations', '_tt_mapping', 'bao_cao_ph', 'bao_cao_ph_preset', 'bo_tro_duoi', 'hinh_linkgen_jobs', 'kho_cau_log', 'phan_cong_ca'];
const has = (s, n) => new RegExp('(^|[^a-z0-9_])' + n + '([^a-z0-9_]|$)').test(s || '');
let r = await c.query(`select tablename, policyname, cmd, roles::text, qual from pg_policies where schemaname='public' and tablename = any($1)`, [T8]);
console.log('## policy san co tren 8 bang:', r.rows.length); for (const x of r.rows) console.log(Object.values(x).join(' | '));
r = await c.query(`select c.relname, t.tgname, p.proname, p.prosecdef from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_proc p on p.oid=t.tgfoid where not t.tgisinternal and c.relname = any($1)`, [T8]);
console.log('\n## trigger TREN 8 bang:'); for (const x of r.rows) console.log(Object.values(x).join(' | '));
r = await c.query(`select relname, relreplident, (select count(*) from pg_publication_tables pt where pt.tablename=c.relname) pub from pg_class c where relnamespace='public'::regnamespace and relname = any($1)`, [T8]);
console.log('\n## realtime:', r.rows.map(x => x.relname + ':' + x.pub).join(' '));
console.log('\n## ham dung 8 bang (ten | secdef | authenticated goi duoc | la trigger):');
for (const t of T8) { const u = fns.filter(f => has(f.src, t)); console.log('- ' + t + ': ' + (u.map(f => f.proname + (f.secdef ? '' : '(INV)') + (f.auth_x ? '' : '[-auth]') + (f.ret === 'trigger' ? '{trg}' : '')).join(', ') || '(khong ham nao)')); }
const G = ['fn_dai_chuyen_dang', 'fn_dai_chuyen_chuyen_de', 'fn_dai_gop_cau_dang', 'fn_btyeu_ca_sap_toi', 'fn_lich_truc_cua_hs', 'fn_btyeu_retest_ghi', '_btyeu_bu_retest', '_kho_snapshot_cau', 'fn_ca_test_phan_cong_lai'];
console.log('\n## ham can cong:');
for (const n of G) for (const f of fns.filter(f => f.proname === n)) {
  const callers = fns.filter(g => g.proname !== n && has(g.src, n));
  console.log(`- ${n}(${f.args}) lang=${f.lang} secdef=${f.secdef} ret=${f.ret} | goi boi: ${callers.map(g => g.proname + (g.secdef ? '' : '(INV)')).join(', ') || '—'}`);
  console.log('    dau than: ' + f.src.replace(/\s+/g, ' ').slice(0, 260));
}
console.log('\n## ham co tham so p_secret:'); console.log(fns.filter(f => /(^|,\s*)p_secret\s/.test(f.args)).map(f => f.proname + (f.anon_x ? '' : '[anon KHONG goi duoc]') + (/(^|[{,])anon=/.test(f.acl) ? '' : '[khong grant tuong minh]')).join(', '));
console.log('\n## dautu 2 ham:'); for (const n of ['fn_dtv_ho_so_hs', 'fn_dtv_so_nho_luu']) for (const f of fns.filter(f => f.proname === n)) console.log(n, 'anon_x=' + f.anon_x, 'secdef=' + f.secdef, 'acl=' + f.acl.slice(0, 120));
r = await c.query(`select grantee, count(*) from information_schema.role_table_grants where table_schema='public' and grantee in ('web_lead_writer','ph_nop','fdw_bkdemy_web') group by 1`);
console.log('\n## quyen bang cua role ngoai:', r.rows.map(x => x.grantee + '=' + x.count).join(' '));
r = await c.query(`select p.proname, r.rolname from pg_proc p, pg_roles r where p.pronamespace='public'::regnamespace and r.rolname in ('web_lead_writer','ph_nop','fdw_bkdemy_web','claude_ro') and p.proacl::text ~ ('(^|[{,])'||r.rolname||'=')`);
console.log('## ham grant tuong minh cho role ngoai:', r.rows.map(x => x.rolname + ':' + x.proname).join(' '));
await c.end();
