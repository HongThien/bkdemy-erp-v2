import fs from 'fs'; import path from 'path'; import pg from 'pg';
const S = process.env.SCR;
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const fns = (await c.query(`select p.oid::int oid, p.proname, pg_get_function_identity_arguments(p.oid) args, pg_get_userbyid(p.proowner) own, p.prosecdef secdef, l.lanname lang, p.prorettype::regtype::text ret, p.provolatile vol,
  has_function_privilege('authenticated', p.oid, 'execute') auth_x, has_function_privilege('anon', p.oid, 'execute') anon_x, p.prosrc src
  from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace`)).rows;
fs.writeFileSync(S + '/d0b-fns.json', JSON.stringify(fns));
const has = (s, n) => new RegExp('(^|[^a-z0-9_])' + n + '([^a-z0-9_]|$)').test(s || '');

// ---- code: tach ngu canh HS vs nhan su
const read = (dirs) => { const out = []; const w = d => { if (!fs.existsSync(d)) return; const st = fs.statSync(d); if (st.isFile()) { if (/\.(ts|tsx|js|mjs)$/.test(d)) out.push([d.replace(/\\/g, '/'), fs.readFileSync(d, 'utf8')]); return; } for (const e of fs.readdirSync(d, { withFileTypes: true })) { if (['node_modules', 'dist'].includes(e.name)) continue; w(path.join(d, e.name)); } }; dirs.forEach(w); return out; };
const src = read(['src']);
const laHS = f => /src\/(screens\/hocsinh|AppHS|main-hs|dautu|gami\/)/.test(f) || /src\/lib\/(tuluyen|thegioi|nt_|hs|testonline|sotay|bxh|rank|thanhtuu|nhiemvu|chuoi|mayman|duoi|phieuluu|onthi|tinhnang|homThu)/.test(f);
const noi = n => { const fs_ = src.filter(([f, t]) => has(t, n)).map(([f]) => f); return { hs: fs_.filter(laHS), ns: fs_.filter(f => !laHS(f)) }; };

// ---- (1) view khong security_invoker
const views = (await c.query(`select c.oid::int oid, c.relname, pg_get_userbyid(c.relowner) own, has_table_privilege('authenticated',c.oid,'select') au_s, has_table_privilege('authenticated',c.oid,'insert') au_i, has_table_privilege('fdw_bkdemy_web',c.oid,'select') fdw,
  (select string_agg(distinct d.refobjid::regclass::text, ', ') from pg_rewrite rw join pg_depend d on d.objid=rw.oid and d.classid='pg_rewrite'::regclass and d.refclassid='pg_class'::regclass where rw.ev_class=c.oid and d.refobjid<>c.oid) deps
  from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v'
   and coalesce((select option_value from pg_options_to_table(c.reloptions) where option_name='security_invoker'),'off') not in ('on','true') order by 1`)).rows;
const polOf = async t => (await c.query(`select cmd, roles::text r, coalesce(qual,'') q from pg_policies where schemaname='public' and tablename=$1`, [t])).rows;
const relkind = Object.fromEntries((await c.query(`select relname, relkind, relrowsecurity rls, pg_get_userbyid(relowner) own from pg_class where relnamespace='public'::regnamespace`)).rows.map(r => [r.relname, r]));
console.log('## (1) VIEW chua security_invoker:', views.length);
for (const v of views) {
  const deps = (v.deps || '').split(', ').filter(Boolean);
  const moTa = [];
  for (const d of deps) { const k = relkind[d]; if (!k) { moTa.push(d + '?'); continue; } if (k.relkind === 'v') { moTa.push(d + '(view)'); continue; }
    const ps = (await polOf(d)).filter(p => /authenticated|public/.test(p.r) && ['SELECT', 'ALL'].includes(p.cmd));
    const mo = ps.some(p => p.q === 'true' || p.q === ''); const hsDoc = ps.some(p => /my_hoc_sinh_id|hs_o_lop/.test(p.q));
    moTa.push(d + (k.rls ? '' : '[!RLS]') + (mo ? '[MO]' : hsDoc ? '[hs-dk]' : '[ns]') + (k.own !== 'claude_build' ? '{' + k.own + '}' : '')); }
  const n = noi(v.relname); const inv = fns.filter(f => !f.secdef && f.auth_x && has(f.src, v.relname)).map(f => f.proname);
  console.log(`- ${v.relname} [auth sel=${v.au_s} ins=${v.au_i} fdw=${v.fdw}] bang goc: ${moTa.join(' ')}`);
  console.log(`    client HS: ${n.hs.join(', ') || '—'} | client NS: ${n.ns.length} file | ham INVOKER dung: ${inv.join(', ') || '—'}`);
}
// ---- (2) 5 policy ALL true
console.log('\n## (2) bang co policy ALL using(true) cho authenticated:');
for (const t of ['dai_cau_menh_de', 'hgt_cau_menh_de', 'toan_de_thi', 'toan_de_thi_cau', 'nhap_kho_log']) {
  const ps = await polOf(t); const n = noi(t); const inv = fns.filter(f => !f.secdef && f.auth_x && has(f.src, t)).map(f => f.proname);
  console.log(`- ${t}: policy ${ps.map(p => p.cmd + ':' + p.r + ':' + (p.q.slice(0, 40) || '∅')).join(' ; ')}`);
  console.log(`    client HS: ${n.hs.join(', ') || '—'} | client NS: ${n.ns.join(', ') || '—'} | ham INVOKER: ${inv.join(', ') || '—'}`);
}
// ---- (3) storage
const sp = await c.query(`select policyname, cmd, roles::text r, left(coalesce(qual,''),110) q, left(coalesce(with_check,''),110) wc from pg_policies where schemaname='storage' and tablename='objects' order by 1`);
console.log('\n## (3) policy storage.objects:', sp.rows.length); for (const x of sp.rows) console.log('  ' + Object.values(x).join(' | '));
const so = await c.query(`select pg_get_userbyid(relowner) own, has_table_privilege(current_user, oid, 'select') s from pg_class where oid='storage.objects'::regclass`);
console.log('  owner storage.objects:', so.rows[0].own, '| claude_build co the tao policy? (chi owner) →', so.rows[0].own === 'claude_build');
for (const q of [`select count(*) from auth.users`, `select id, public from storage.buckets`]) { try { const r = await c.query(q); console.log('  doc duoc:', q, '→', JSON.stringify(r.rows).slice(0, 200)); } catch (e) { console.log('  KHONG doc duoc:', q, '→', e.message); } }
await c.end();
