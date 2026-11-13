import fs from 'fs'; import pg from 'pg';
const S = process.env.SCR;
const fns = JSON.parse(fs.readFileSync(S + '/d0-fns.json', 'utf8'));
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const q = async (t, s) => { try { const r = await c.query(s); console.log('\n## ' + t + ' (' + r.rows.length + ')'); for (const x of r.rows) console.log(Object.values(x).join(' | ')); return r.rows; } catch (e) { console.log('\n## ' + t + ' LOI: ' + e.message); return []; } };
await q('trigger tren bang NGOAI schema public goi ham public', `select n.nspname||'.'||c.relname tbl, t.tgname, p.proname, p.prosecdef, pg_get_userbyid(p.proowner) own from pg_trigger t join pg_class c on c.oid=t.tgrelid join pg_namespace n on n.oid=c.relnamespace join pg_proc p on p.oid=t.tgfoid where not t.tgisinternal and n.nspname<>'public' and p.pronamespace='public'::regnamespace`);
await q('event trigger', `select evtname, evtevent, evtfoid::regproc::text from pg_event_trigger`);
await q('ham public co grant tuong minh cho role he thong', `select r.rolname, string_agg(p.proname, ', ') from pg_proc p, pg_roles r where p.pronamespace='public'::regnamespace and r.rolname in ('supabase_auth_admin','supabase_storage_admin','authenticator','pgbouncer','dashboard_user','supabase_realtime_admin','supabase_functions_admin') and p.proacl::text ~ ('(^|[{,])'||r.rolname||'=') group by 1`);
await q('policy NGOAI public goi ham public nao', `select schemaname||'.'||tablename t, policyname, roles::text, left(coalesce(qual,'')||' / '||coalesce(with_check,''),200) from pg_policies where schemaname<>'public' and (coalesce(qual,'')||coalesce(with_check,'')) ~ '(la_thanh_vien|my_hoc_sinh_id|co_quyen|fn_|public\\.)'`);
await q('web_lead_writer co quyen bang nao', `select table_name, string_agg(privilege_type, ',') from information_schema.role_table_grants where grantee='web_lead_writer' group by 1`);
const dungRow = await c.query(`
  select string_agg(s, ' ') s from (
    select coalesce(qual,'')||' '||coalesce(with_check,'') s from pg_policies
    union all select pg_get_expr(adbin,adrelid) from pg_attrdef
    union all select pg_get_constraintdef(oid) from pg_constraint where contype='c'
    union all select pg_get_viewdef(oid) from pg_class where relkind in ('v','m') and relnamespace='public'::regnamespace
    union all select pg_get_indexdef(indexrelid) from pg_index where indexprs is not null or indpred is not null) x`);
await c.end();
const dung = dungRow.rows[0].s;
const has = (s, n) => new RegExp('(^|[^a-z0-9_])' + n + '\\s*\\(').test(s || '');
const names = [...new Set(fns.map(f => f.proname))];
const by = n => fns.filter(f => f.proname === n);
const explAnon = n => by(n).some(f => /(^|[{,])anon=/.test(f.acl));
// tap GIU: grant tuong minh cho anon + dung trong policy/default/check/view/index
const giu = new Set(names.filter(n => explAnon(n) || has(dung, n)));
const goc = new Set(giu);
// dong bao: ham INVOKER trong tap giu goi ham nao thi giu luon
let doi = true; const them = new Set();
while (doi) { doi = false; for (const n of [...giu]) for (const f of by(n)) { if (f.secdef) continue; for (const m of names) if (!giu.has(m) && m !== n && has(f.src, m)) { giu.add(m); them.add(m); doi = true; } } }
console.log('\n## tap GIU goc:', goc.size, '| them do dong bao (ham invoker goi):', them.size);
console.log('them:', [...them].map(n => n + (by(n).some(f => f.anon_x) ? '' : '[anon von KHONG goi duoc]') + (by(n)[0].secdef ? '' : '(INV)')).join(', '));
console.log('\ngiu goc la INVOKER:', [...goc].filter(n => by(n).some(f => !f.secdef)).join(', '));
const thu = fns.filter(f => f.own === 'claude_build' && f.anon_x && f.ret !== 'trigger' && !giu.has(f.proname));
console.log('\n## SE THU quyen anon:', thu.length, 'ham (', new Set(thu.map(f => f.proname)).size, 'ten ) | secdef:', thu.filter(f => f.secdef).length, '| kind:', [...new Set(thu.map(f => f.kind))].join(','));
console.log('con lai anon goi duoc sau khi thu (claude_build, khong trigger):', fns.filter(f => f.own === 'claude_build' && f.anon_x && f.ret !== 'trigger' && giu.has(f.proname)).length);
fs.writeFileSync(S + '/d0-giu-them.json', JSON.stringify([...them]));
fs.writeFileSync(S + '/d0-thu.json', JSON.stringify(thu.map(f => f.proname + '(' + f.args + ')')));
