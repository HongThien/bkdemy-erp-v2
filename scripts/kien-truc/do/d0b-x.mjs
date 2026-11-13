// Tap X = ham INVOKER co duong (toan invoker) cham view se bat security_invoker. Ai chay X duoi quyen HOC SINH?
import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const fns = JSON.parse(fs.readFileSync(S + '/d0b-fns.json', 'utf8'));
const by = {}; for (const f of fns) (by[f.proname] ??= []).push(f);
const names = Object.keys(by);
const has = (s, n) => new RegExp('(^|[^a-z0-9_])' + n + '([^a-z0-9_]|$)').test(s || '');
const VIEWS = ['qlht_v_so_du_xu', 'qlht_v_ton_qua', 'v_hinh_chua_giai', 'v_giaibai_nhan', 'v_giaibai_bai', 'v_giaibai_hoan_thien', 'hinh_hoc_ban_do', 'bdm_ban_do', 'bdm_cau_dang', 'bdm_cau_hoi', 'bdm_cau_form_tn', 'bdm_cau_menh_de', 'bdm_dang_ly_thuyet', 'bdm_ban_do_toan', 'bdm_ban_do_hgt', 'tl_bdm_chu_de_v', 'tl_bdm_chuyen_de_v', 'tl_bdm_o_v', 'tl_bdm_nhom_v', 'tl_bdm_dang_bai_v'];
const inv = n => by[n].some(f => !f.secdef);
const direct = n => VIEWS.filter(v => by[n].some(f => !f.secdef && has(f.src, v)));
const memo = {}; const reach = (n, dp = 0) => { if (memo[n]) return memo[n]; memo[n] = new Set(); const out = new Set(direct(n)); if (dp < 15) for (const m of names) if (m !== n && inv(m) && by[n].some(f => !f.secdef && has(f.src, m))) for (const x of reach(m, dp + 1)) out.add(x); return (memo[n] = out); };
const X = names.filter(n => inv(n) && reach(n).size);
console.log('X (ham invoker cham view dich, ke ca bac cau):', X.length);
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
// (ii) trigger
const trg = (await c.query(`select c.relname tbl, p.proname fn, t.tgname from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_proc p on p.oid=t.tgfoid where not t.tgisinternal and c.relnamespace='public'::regnamespace`)).rows;
const hsGhi = Object.fromEntries((await c.query(`select tablename, string_agg(cmd||':'||left(coalesce(qual,'')||' / '||coalesce(with_check,''),70), ' ; ') p from pg_policies where schemaname='public' and cmd in ('INSERT','UPDATE','DELETE','ALL') and roles::text ~ 'authenticated|public' and (coalesce(qual,'')||coalesce(with_check,'')) ~ '(my_hoc_sinh_id|hs_o_lop|true|_hs_)' group by 1`)).rows.map(r => [r.tablename, r.p]));
const tX = trg.filter(t => X.includes(t.fn));
console.log('\n(ii) trigger INVOKER thuoc X:', tX.length);
for (const t of tX) console.log('  - ' + t.tbl + ' . ' + t.fn + ' → ' + [...reach(t.fn)].join(',') + (hsGhi[t.tbl] ? '   !! HS GHI TRUC TIEP duoc bang nay: ' + hsGhi[t.tbl].slice(0, 120) : '   (HS khong ghi truc tiep)'));
// (iii) policy / default / check
const dung = (await c.query(`select string_agg(s, ' ') s from (select coalesce(qual,'')||' '||coalesce(with_check,'') s from pg_policies union all select pg_get_expr(adbin,adrelid) from pg_attrdef union all select pg_get_constraintdef(oid) from pg_constraint where contype='c') x`)).rows[0].s;
console.log('\n(iii) ham X dung trong policy/default/check:', X.filter(n => new RegExp('(^|[^a-z0-9_])' + n + '\\s*\\(').test(dung)).join(', ') || '—');
// (iv) view khac phu thuoc view dich
const dep = (await c.query(`select distinct c.relname v, coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') inv, d.refobjid::regclass::text dep from pg_rewrite rw join pg_class c on c.oid=rw.ev_class join pg_depend d on d.objid=rw.oid and d.classid='pg_rewrite'::regclass and d.refclassid='pg_class'::regclass where c.relnamespace='public'::regnamespace and c.relkind='v' and d.refobjid<>c.oid and d.refobjid::regclass::text = any($1)`, [VIEWS])).rows;
console.log('\n(iv) view phu thuoc view dich:'); for (const d of dep) console.log('  - ' + d.v + ' [invoker=' + d.inv + '] ← ' + d.dep);
// (v) X ma authenticated goi truc tiep duoc + co trong pss (ai goi thuc te)
const pss = (await c.query(`select s.query q, s.calls::int calls from public._audit_pss() s join pg_roles r on r.oid=s.userid where r.rolname='authenticated'`)).rows;
console.log('\n(v) ham X duoc goi TRUC TIEP qua API (pss, role authenticated):');
for (const n of X) { if (!by[n].some(f => f.auth_x)) continue; const hit = pss.filter(p => new RegExp('"public"\\."' + n + '"\\(').test(p.q)); if (hit.length) console.log('  - ' + n + ' : ' + hit.reduce((a, b) => a + b.calls, 0) + ' luot → ' + [...reach(n)].join(',')); }
console.log('\nX day du:', X.join(', '));
await c.end();
