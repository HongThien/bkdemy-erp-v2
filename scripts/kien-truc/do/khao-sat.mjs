import pg from 'pg'; import fs from 'fs'; import path from 'path';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const q = async (t, s) => { try { const r = await c.query(s); console.log('\n## ' + t + ' (' + r.rows.length + ')'); for (const x of r.rows) console.log(Object.values(x).join(' | ')); return r.rows; } catch (e) { console.log('\n## ' + t + ' LOI: ' + e.message); return []; } };

await q('realtime publication', `select pubname, count(*) n, string_agg(tablename, ', ' order by tablename) from pg_publication_tables group by 1`);
await q('RLS: tong | auth.uid() tran | goi ham | using true | cho anon/public', `
  select count(*) tong,
    count(*) filter (where pq ~ 'auth\\.uid\\(\\)' and pq !~* 'select auth\\.uid\\(\\)') uid_tran,
    count(*) filter (where pq ~ '(fn_|_)[a-z_]+\\(') goi_ham,
    count(*) filter (where coalesce(qual,'')='true') using_true,
    count(*) filter (where 'anon'=any(roles) or 'public'=any(roles)) cho_anon_public
  from (select *, coalesce(qual,'')||' '||coalesce(with_check,'') pq from pg_policies where schemaname='public') x`);
await q('policy mo hoan toan theo lenh & role', `select cmd, roles::text, count(*) from pg_policies where schemaname='public' and coalesce(qual,'true')='true' and coalesce(with_check,'true')='true' group by 1,2 order by 3 desc limit 12`);
await q('bang KHONG bat RLS', `select count(*) n, string_agg(relname, ', ') from (select relname from pg_class where relnamespace='public'::regnamespace and relkind='r' and not relrowsecurity order by relname) x`);
await q('ham: anon goi duoc | anon+secdef | authenticated+secdef | secdef thieu search_path', `
  select count(*) filter (where has_function_privilege('anon', p.oid, 'execute')) anon_all,
    count(*) filter (where has_function_privilege('anon', p.oid, 'execute') and prosecdef) anon_secdef,
    count(*) filter (where has_function_privilege('authenticated', p.oid, 'execute') and prosecdef) auth_secdef,
    count(*) filter (where prosecdef and (proconfig is null or not exists (select 1 from unnest(proconfig) x where x like 'search_path=%'))) secdef_khong_search_path
  from pg_proc p where pronamespace='public'::regnamespace`);
await q('bang tinh san (ten co luu/cache/snap/chup/san/hien_tai)', `select c.relname, s.n_live_tup, pg_size_pretty(pg_total_relation_size(c.oid)) from pg_class c join pg_stat_user_tables s on s.relid=c.oid where c.relnamespace='public'::regnamespace and c.relkind='r' and c.relname ~ '(luu|cache|snap|chup|_san|hien_tai)' order by pg_total_relation_size(c.oid) desc limit 60`);
await q('dead tuples', `select relname, n_live_tup, n_dead_tup, last_autovacuum::date, last_autoanalyze::date from pg_stat_user_tables where schemaname='public' and n_dead_tup>2000 order by n_dead_tup desc limit 15`);
await q('bang log lon', `select relname, n_live_tup, pg_size_pretty(pg_total_relation_size(relid)) from pg_stat_user_tables where schemaname='public' and relname ~ '(log|lich_su|history)' order by pg_total_relation_size(relid) desc limit 15`);
await q('nhom bang theo tien to (>=6 bang)', `select split_part(relname,'_',1) p, count(*) n, pg_size_pretty(sum(pg_total_relation_size(oid))) from pg_class where relnamespace='public'::regnamespace and relkind='r' group by 1 having count(*)>=6 order by 2 desc`);
await q('ham trung ten (overload)', `select count(*) from (select proname from pg_proc where pronamespace='public'::regnamespace group by 1 having count(*)>1) x`);
await q('index tren cac bang bi quet nhieu', `select tablename, count(*) n_idx, string_agg(regexp_replace(indexdef,'^.* USING ',''), ' ; ') from pg_indexes where schemaname='public' and tablename in ('gami_grades','bai_lam_cau','bai_test','buoi_hoc_hs','dai_bdm_gan_cau','bai_lam') group by 1`);

// ham khong ai tham chieu
const fns = (await c.query(`select p.oid::int oid, proname, prosrc from pg_proc p where pronamespace='public'::regnamespace`)).rows;
const trig = new Set((await c.query(`select distinct tgfoid::int oid from pg_trigger where not tgisinternal`)).rows.map(r => r.oid));
const one = async s => (await c.query(s)).rows[0].s || '';
const other = await one(`select string_agg(coalesce(qual,'')||' '||coalesce(with_check,''),' ') s from pg_policies`)
  + await one(`select string_agg(pg_get_viewdef(oid),' ') s from pg_class where relnamespace='public'::regnamespace and relkind in ('v','m')`)
  + await one(`select string_agg(pg_get_expr(adbin,adrelid),' ') s from pg_attrdef`)
  + await one(`select string_agg(pg_get_constraintdef(oid),' ') s from pg_constraint where connamespace='public'::regnamespace and contype='c'`)
  + await one(`select string_agg(command,' ') s from public._audit_cron_job()`)
  + await one(`select string_agg(pg_get_indexdef(indexrelid),' ') s from pg_index where indexprs is not null or indpred is not null`);
await c.end();

const SKIP = new Set(['node_modules', 'dist', '.git', 'migrations', 'android', 'android-ta', 'public', 'design', '.claude', 'mockups']);
let code = '', srcOnly = '';
const walk = (d, src) => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; const p = path.join(d, e.name); if (e.isDirectory()) walk(p, src); else if (/\.(ts|tsx|mjs|js|cjs|sql|html|py|sh)$/.test(e.name) && fs.statSync(p).size < 3e6) { const t = fs.readFileSync(p, 'utf8') + '\n'; code += t; if (src) srcOnly += t; } } };
walk('src', true);
for (const d of ['scripts', 'api', 'supabase/functions', 'worker', 'games-site', 'toan-site', 'khtn-site', 'luyen-tinh']) if (fs.existsSync(d)) walk(d, false);
const pss = JSON.parse(fs.readFileSync(S + '/pss.json', 'utf8')).map(x => x.q).join(' ');
const tokens = s => { const m = new Map(); for (const t of s.match(/[a-z_][a-z0-9_]{2,}/g) || []) m.set(t, (m.get(t) || 0) + 1); return m; };
const tAll = tokens(fns.map(f => f.prosrc || '').join('\n')), tOther = tokens(other), tCode = tokens(code), tSrc = tokens(srcOnly), tPss = tokens(pss);
const names = [...new Set(fns.map(f => f.proname))];
const dead = []; let onlyDb = 0, inApp = 0, called = 0;
for (const n of names) {
  const mine = fns.filter(f => f.proname === n);
  const self = mine.reduce((a, f) => a + (tokens(f.prosrc || '').get(n) || 0), 0);
  const dbRef = (tAll.get(n) || 0) - self > 0 || tOther.has(n) || mine.some(f => trig.has(f.oid));
  const appRef = tCode.has(n), ps = tPss.has(n);
  if (tSrc.has(n)) inApp++; if (ps) called++;
  if (!dbRef && !appRef && !ps) dead.push(n); else if (dbRef && !appRef) onlyDb++;
}
console.log('\n## HAM: ten khac nhau', names.length, '| co trong src/', inApp, '| thay trong thong ke goi', called, '| chi DB tham chieu', onlyDb, '| KHONG ai tham chieu', dead.length);
fs.writeFileSync(S + '/ham-chet.json', JSON.stringify(dead));
console.log(dead.slice(0, 60).join(', '));
