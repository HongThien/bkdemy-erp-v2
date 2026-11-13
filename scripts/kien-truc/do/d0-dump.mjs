import pg from 'pg'; import fs from 'fs'; import path from 'path';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const fns = (await c.query(`
  select p.oid::int oid, p.proname, pg_get_function_identity_arguments(p.oid) args, pg_get_userbyid(p.proowner) own,
         p.prosecdef secdef, l.lanname lang, p.prokind kind, p.prorettype::regtype::text ret,
         has_function_privilege('anon', p.oid, 'execute') anon_x,
         has_function_privilege('authenticated', p.oid, 'execute') auth_x,
         coalesce(p.proacl::text,'') acl, p.prosrc src
  from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace`)).rows;
const one = async s => (await c.query(s)).rows[0].s || '';
const dung = await one(`select string_agg(coalesce(qual,'')||' '||coalesce(with_check,''),' ') s from pg_policies`)
  + ' ' + await one(`select string_agg(pg_get_expr(adbin,adrelid),' ') s from pg_attrdef`)
  + ' ' + await one(`select string_agg(pg_get_constraintdef(oid),' ') s from pg_constraint where contype='c'`)
  + ' ' + await one(`select string_agg(pg_get_viewdef(oid),' ') s from pg_class where relkind in ('v','m') and relnamespace='public'::regnamespace`)
  + ' ' + await one(`select string_agg(pg_get_indexdef(indexrelid),' ') s from pg_index where indexprs is not null or indpred is not null`);
const trigFn = new Set((await c.query(`select distinct tgfoid::int o from pg_trigger where not tgisinternal`)).rows.map(r => r.o));
await c.end();
fs.writeFileSync(S + '/d0-fns.json', JSON.stringify(fns));

// code chay trong ngu canh CHUA dang nhap (hoac co the chua dang nhap)
const SKIP = new Set(['node_modules', 'dist', '.git', 'android', 'android-ta', 'design', '.claude', 'mockups', 'migrations']);
const read = (dirs, exts = /\.(ts|tsx|mjs|js|cjs|html|py)$/) => { let s = ''; const w = d => { if (!fs.existsSync(d)) return; const st = fs.statSync(d); if (st.isFile()) { if (exts.test(d) && st.size < 3e6) s += fs.readFileSync(d, 'utf8') + '\n'; return; } for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (SKIP.has(e.name)) continue; w(path.join(d, e.name)); } }; dirs.forEach(w); return s; };
const nhom = {
  site_ngoai: read(['games-site', 'toan-site', 'khtn-site', 'luyen-tinh', 'lang-bk-spike', 'public']),
  dautu: read(['src/dautu']),
  sukien: read(['src/screens/sukien', 'src/lib/sukien.ts', 'src/AppSuKien.tsx', 'src/main-sukien.tsx']),
  auth: read(['src/auth', 'src/main.tsx', 'src/main-hs.tsx', 'src/AppHS.tsx', 'src/App.tsx']),
  api: read(['api']),
  edge: read(['supabase/functions']),
  worker: read(['worker']),
  scripts: read(['scripts']),
};
const toks = s => new Set(s.match(/[a-z_][a-z0-9_]{2,}/g) || []);
const T = Object.fromEntries(Object.entries(nhom).map(([k, v]) => [k, toks(v)]));
const tDung = toks(dung);
const byName = {}; for (const f of fns) (byName[f.proname] ??= []).push(f);
const names = Object.keys(byName);
const anonNames = names.filter(n => byName[n].some(f => f.anon_x));
const expl = n => byName[n].some(f => /(^|[{,])anon=/.test(f.acl));
const rows = anonNames.map(n => ({ n, own: [...new Set(byName[n].map(f => f.own))].join('/'), secdef: byName[n].some(f => f.secdef), expl: expl(n), trig: byName[n].some(f => trigFn.has(f.oid) || f.ret === 'trigger'), dung: tDung.has(n), o: Object.keys(T).filter(k => T[k].has(n)) }));
const cnt = f => rows.filter(f).length;
console.log('ten ham anon goi duoc:', rows.length, '| grant tuong minh:', cnt(r => r.expl), '| dung trong policy/default/check/view/index:', cnt(r => r.dung), '| la trigger:', cnt(r => r.trig));
for (const k of Object.keys(T)) console.log(' xuat hien trong', k + ':', cnt(r => r.o.includes(k)), '(khong grant tuong minh:', cnt(r => r.o.includes(k) && !r.expl) + ')');
console.log('\n== GRANT TUONG MINH cho anon (' + cnt(r => r.expl) + '):\n' + rows.filter(r => r.expl).map(r => r.n + '[' + r.own + ']').join(', '));
for (const k of ['site_ngoai', 'dautu', 'sukien', 'auth', 'api', 'edge', 'worker'])
  console.log('\n== trong ' + k + ' ma KHONG grant tuong minh:\n' + rows.filter(r => r.o.includes(k) && !r.expl).map(r => r.n + (r.secdef ? '' : '(inv)')).join(', '));
console.log('\n== owner khong phai claude_build ma anon goi duoc:\n' + rows.filter(r => r.own !== 'claude_build').map(r => r.n + '[' + r.own + ']').join(', '));
fs.writeFileSync(S + '/d0-anon.json', JSON.stringify(rows));
