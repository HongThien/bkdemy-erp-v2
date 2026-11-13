import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const NH = ['dai', 'hgt', 'khtn', 'vatly', 'hoahoc'];
for (const HO of process.argv.slice(2)) {
  const co = []; for (const n of NH) if ((await c.query(`select to_regclass($1) r`, ['public.' + n + '_' + HO])).rows[0].r) co.push(n);
  const cols = {}; const all = new Map();
  for (const n of co) { cols[n] = (await c.query(`select a.attname ten, format_type(a.atttypid,a.atttypmod) kieu, a.attnotnull nn, a.attidentity idn, a.attgenerated gen, pg_get_expr(d.adbin,d.adrelid) df from pg_attribute a left join pg_attrdef d on d.adrelid=a.attrelid and d.adnum=a.attnum where a.attrelid=$1::regclass and a.attnum>0 and not a.attisdropped`, ['public.' + n + '_' + HO])).rows; for (const x of cols[n]) all.set(x.ten, 1); }
  console.log(`\n# ${HO} (${co.join(', ')})`);
  for (const ten of all.keys()) {
    const v = co.map(n => cols[n].find(x => x.ten === ten));
    const ky = v.map(x => x ? `${x.kieu}|${x.nn}|${x.idn}|${x.gen}` : '∅');
    if (new Set(ky).size === 1 && !v[0]?.idn) continue;
    const parts = [];
    for (let i = 0; i < co.length; i++) { const x = v[i]; if (!x) { parts.push(co[i] + ': KHÔNG CÓ'); continue; }
      const st = (await c.query(`select count(*)::int n, count(*) filter (where ${JSON.stringify(ten)} is null)::int rong from public.${co[i]}_${HO}`)).rows[0];
      parts.push(`${co[i]}: ${x.kieu}${x.nn ? ' NN' : ''}${x.idn ? ' IDENTITY' : ''}${x.df ? ' def=' + x.df.slice(0, 30) : ''} (${st.rong}/${st.n} rỗng)`); }
    console.log('  - ' + ten + ' → ' + parts.join(' | '));
  }
}
await c.end();
