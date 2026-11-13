// Chay thu d0b.sql trong 1 transaction roi ROLLBACK.
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
c.on('notice', n => { if (!/does not exist, skipping/.test(n.message)) console.log('NOTICE:', n.message); });
const ROLES = ['anon', 'authenticated', 'service_role', 'claude_ro', 'fdw_bkdemy_web', 'ph_nop', 'web_lead_writer', 'postgres'];
const dem = async () => Object.fromEntries((await c.query(`select r.rolname, count(*) filter (where has_function_privilege(r.oid, p.oid, 'execute'))::int n from pg_roles r cross join pg_proc p where p.pronamespace='public'::regnamespace and r.rolname = any($1) group by 1`, [ROLES])).rows.map(x => [x.rolname, x.n]));
const thu = async (ten, sql, params) => { await c.query('savepoint s'); try { const r = await c.query(sql, params); console.log('  ' + ten + ' → OK:', JSON.stringify(r.rows[0]).slice(0, 120)); } catch (e) { console.log('  ' + ten + ' → LỖI [' + e.code + ']:', e.message.slice(0, 120)); } await c.query('rollback to savepoint s'); };
const claims = (role, sub) => c.query(`select set_config('request.jwt.claims', $1, true)`, [role ? JSON.stringify({ role, sub }) : '']);
const t0 = Date.now();
try {
  await c.query('begin');
  const truoc = await dem();
  const ns = (await c.query(`select t.id from tai_khoan t join nhan_su n on n.id=t.nhan_su_id where n.trang_thai='dang_lam' limit 1`)).rows[0].id;
  const hs = (await c.query(`select t.id from tai_khoan t where t.hoc_sinh_id is not null limit 1`)).rows[0].id;
  // so dong view truoc (quyen owner) de so sau: dinh nghia view khong doi
  const VS = ['bdm_cau_hoi', 'bdm_ban_do', 'tl_bdm_dang_bai_v', 'qlht_v_so_du_xu'];
  const cnt = async () => Object.fromEntries(await Promise.all(VS.map(async v => [v, (await c.query(`select count(*)::int n from public.${v}`)).rows[0].n])));
  const vTruoc = await cnt();
  await c.query(fs.readFileSync(S + '/d0b.sql', 'utf8'));
  console.log('ap xong trong', Date.now() - t0, 'ms');
  const sau = await dem();
  console.log('\nSO HAM MOI ROLE GOI DUOC (truoc → sau):'); for (const r of ROLES) console.log('  ' + r.padEnd(16), truoc[r], '→', sau[r], truoc[r] === sau[r] ? '' : '(lech ' + (sau[r] - truoc[r]) + ')');
  const vSau = await cnt(); console.log('\nSO DONG VIEW (owner doc) truoc → sau:', VS.map(v => v + ' ' + vTruoc[v] + '→' + vSau[v]).join(' | '));
  const vi = await c.query(`select count(*) filter (where coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') in ('on','true'))::int bat, count(*)::int tong from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v'`);
  console.log('view security_invoker:', vi.rows[0].bat, '/', vi.rows[0].tong, '(con lai la view danh cho app phu huynh qua FDW)');
  const p = await c.query(`select tablename, policyname, cmd, left(qual,60) q from pg_policies where schemaname='public' and tablename in ('dai_cau_menh_de','hgt_cau_menh_de','toan_de_thi','toan_de_thi_cau','nhap_kho_log') and roles::text ~ 'authenticated' order by 1`);
  console.log('\nPOLICY 5 bang:'); for (const x of p.rows) console.log('  ' + Object.values(x).join(' | '));
  console.log('\nCONG — HOC SINH:'); await claims('authenticated', hs);
  await thu('fn_ts_dk_form', `select public.fn_ts_dk_form(7, 0) is not null x`);
  await thu('fn_viec_chup_phu_trach', `select public.fn_viec_chup_phu_trach(null) x`);
  await thu('fn_khoi_cua_toi (ham secdef goi _khoi_quan_ly)', `select count(*)::int n from public.fn_khoi_cua_toi()`);
  console.log('CONG — NHAN SU:'); await claims('authenticated', ns);
  await thu('fn_ts_dk_form', `select public.fn_ts_dk_form(7, 0) is not null x`);
  await thu('fn_viec_chup_phu_trach', `select public.fn_viec_chup_phu_trach(null) x`);
  await thu('fn_khoi_cua_toi', `select count(*)::int n from public.fn_khoi_cua_toi()`);
  await thu('fn_pham_vi_cua_toi', `select count(*)::int n from public.fn_pham_vi_cua_toi()`);
  console.log('CONG — tac vu nen / service role:'); await claims(null);
  await thu('fn_viec_chup_phu_trach (cron)', `select public.fn_viec_chup_phu_trach(null) x`);
  await claims('service_role', null);
  await thu('fn_ts_dk_form (edge function dang-ky-test)', `select public.fn_ts_dk_form(7, 0) is not null x`);
} catch (e) { console.log('\n!!! LOI:', e.code, e.message, e.where ? '\n' + String(e.where).slice(0, 300) : ''); }
finally { await c.query('rollback'); const k = await c.query(`select count(*)::int n from pg_policies where schemaname='public' and policyname like '%_authenticated_all'`); console.log('\nDA ROLLBACK (' + (Date.now() - t0) + ' ms). policy *_authenticated_all van con:', k.rows[0].n); await c.end(); }
