// Chay thu d0a.sql trong 1 transaction roi ROLLBACK. Khong de lai thay doi nao.
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
c.on('notice', n => console.log('NOTICE:', n.message));
const ROLES = ['anon', 'authenticated', 'service_role', 'claude_ro', 'fdw_bkdemy_web', 'ph_nop', 'web_lead_writer', 'postgres'];
const dem = async () => Object.fromEntries((await c.query(`select r.rolname, count(*) filter (where has_function_privilege(r.oid, p.oid, 'execute'))::int n from pg_roles r cross join pg_proc p where p.pronamespace='public'::regnamespace and r.rolname = any($1) group by 1`, [ROLES])).rows.map(x => [x.rolname, x.n]));
const thu = async (ten, sql, params) => { await c.query('savepoint s'); try { const r = await c.query(sql, params); console.log('  ' + ten + ' → OK:', JSON.stringify(r.rows[0]).slice(0, 110)); } catch (e) { console.log('  ' + ten + ' → LỖI [' + e.code + ']:', e.message.slice(0, 110)); } await c.query('rollback to savepoint s'); };
const t0 = Date.now();
try {
  await c.query('begin');
  const truoc = await dem();
  const ns = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai='dang_lam' limit 1`)).rows[0].id;
  const hs = (await c.query(`select t.id, t.hoc_sinh_id from tai_khoan t where t.hoc_sinh_id is not null limit 1`)).rows[0];
  await c.query(fs.readFileSync(S + '/d0a.sql', 'utf8'));
  console.log('ap xong trong', Date.now() - t0, 'ms');
  const sau = await dem();
  console.log('\nSO HAM MOI ROLE GOI DUOC (truoc → sau):'); for (const r of ROLES) console.log('  ' + r.padEnd(16), truoc[r], '→', sau[r], truoc[r] === sau[r] ? '' : '(lech ' + (sau[r] - truoc[r]) + ')');
  const con = await c.query(`select p.proname, pg_get_userbyid(p.proowner) own, p.prorettype::regtype::text ret from pg_proc p where p.pronamespace='public'::regnamespace and has_function_privilege('anon', p.oid, 'execute') order by 1`);
  const khongTrg = con.rows.filter(x => x.ret !== 'trigger');
  console.log('\nANON CON GOI DUOC:', con.rows.length, '(trigger:', con.rows.length - khongTrg.length + ', khac:', khongTrg.length + ')');
  console.log(khongTrg.map(x => x.proname + (x.own === 'claude_build' ? '' : '[' + x.own + ']')).join(', '));
  const bang = await c.query(`select c.relname, c.relrowsecurity rls, has_table_privilege('anon',c.oid,'select') a, has_table_privilege('authenticated',c.oid,'select') au, (select count(*) from pg_policies p where p.tablename=c.relname and p.schemaname='public')::int pol from pg_class c where c.relnamespace='public'::regnamespace and c.relname in ('_migrations','_tt_mapping','bao_cao_ph','bao_cao_ph_preset','bo_tro_duoi','hinh_linkgen_jobs','kho_cau_log','phan_cong_ca') order by 1`);
  console.log('\n8 BANG (rls | anon select | authenticated select | so policy):'); for (const x of bang.rows) console.log('  ' + x.relname.padEnd(20), x.rls, x.a, x.au, x.pol);
  const v = await c.query(`select count(*)::int n from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v' and has_table_privilege('anon',c.oid,'select')`);
  console.log('view anon con doc duoc:', v.rows[0].n);
  // cong: gia lap nguoi goi bang jwt claims (ham security definer nen chay bang quyen owner, cong doc claims)
  const claims = (role, sub) => c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ role, sub })]);
  console.log('\nCONG — nguoi goi la HOC SINH:'); await claims('authenticated', hs.id);
  await thu('fn_dai_gop_cau_dang(null,null)', `select public.fn_dai_gop_cau_dang(null, null) x`);
  await thu('fn_dai_chuyen_dang', `select public.fn_dai_chuyen_dang('KHONG_CO', 'KHONG_CO') x`);
  await thu('fn_dai_chuyen_chuyen_de', `select public.fn_dai_chuyen_chuyen_de('KHONG_CO', 'KHONG_CO') x`);
  await thu('fn_ca_test_phan_cong_lai', `select public.fn_ca_test_phan_cong_lai(gen_random_uuid(), null) x`);
  await thu('fn_btyeu_ca_sap_toi', `select public.fn_btyeu_ca_sap_toi(null, null) is null as tra_null`);
  await thu('fn_lich_truc_cua_hs', `select public.fn_lich_truc_cua_hs($1, 'Toán', null) is null as tra_null`, [hs.hoc_sinh_id]);
  console.log('CONG — nguoi goi la NHAN SU:'); await claims('authenticated', ns);
  await thu('fn_dai_gop_cau_dang(null,null)', `select public.fn_dai_gop_cau_dang(null, null) x`);
  await thu('fn_dai_chuyen_dang', `select public.fn_dai_chuyen_dang('KHONG_CO', 'KHONG_CO') x`);
  await thu('fn_ca_test_phan_cong_lai', `select public.fn_ca_test_phan_cong_lai(gen_random_uuid(), null) x`);
  await thu('fn_btyeu_ca_sap_toi', `select public.fn_btyeu_ca_sap_toi(null, null) is null as tra_null`);
  await thu('fn_lich_truc_cua_hs', `select public.fn_lich_truc_cua_hs($1, 'Toán', null) is null as tra_null`, [hs.hoc_sinh_id]);
  console.log('CONG — tac vu nen (khong co claims):'); await c.query(`select set_config('request.jwt.claims', '', true)`);
  await thu('fn_btyeu_ca_sap_toi', `select public.fn_btyeu_ca_sap_toi(null, null) is null as tra_null`);
  await thu('fn_dai_gop_cau_dang(null,null)', `select public.fn_dai_gop_cau_dang(null, null) x`);
  // mac dinh moi
  await c.query(`create function public._d0_thu_ham() returns int language sql as 'select 1'`);
  await c.query(`create table public._d0_thu_bang (id int)`);
  const d = await c.query(`select has_function_privilege('anon','public._d0_thu_ham()','execute') f_anon, has_function_privilege('authenticated','public._d0_thu_ham()','execute') f_auth, has_function_privilege('service_role','public._d0_thu_ham()','execute') f_svc, has_table_privilege('anon','public._d0_thu_bang','select') t_anon, has_table_privilege('authenticated','public._d0_thu_bang','select') t_auth`);
  console.log('\nMAC DINH cho doi tuong MOI:', JSON.stringify(d.rows[0]));
} catch (e) { console.log('\n!!! LOI:', e.code, e.message, e.where ? '\n' + String(e.where).slice(0, 300) : ''); }
finally { await c.query('rollback'); console.log('\nDA ROLLBACK. tong', Date.now() - t0, 'ms'); const k = await c.query(`select count(*)::int n from pg_class where relnamespace='public'::regnamespace and relkind='r' and not relrowsecurity`); console.log('kiem sau rollback — bang chua RLS (phai van la 8):', k.rows[0].n); await c.end(); }
