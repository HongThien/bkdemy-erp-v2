import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const HOS = process.argv.slice(2);
const fns = (await c.query(`select p.proname, p.prosrc src, l.lanname lang, pg_get_function_result(p.oid) ret from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace`)).rows;
const R = (s, f) => new RegExp(s, f);
const TU = new Set(['where', 'on', 'join', 'left', 'inner', 'group', 'order', 'limit', 'set', 'using', 'returning', 'cross', 'union', 'for', 'right', 'full', 'natural', 'window', 'having', 'offset', 'lateral']);
let n = 0;
for (const HO of HOS) {
  const T = String.raw`(?:dai|hgt|khtn|vatly|hoahoc)_` + HO; const out = [];
  for (const f of fns) {
    const s = f.src; if (!R(String.raw`(^|[^a-z0-9_])` + T + String.raw`([^a-z0-9_]|$)`).test(s)) continue; const why = [];
    if (R(String.raw`select\s+\*\s+from\s+(public\.)?` + T + String.raw`([^a-z0-9_]|$)`, 'i').test(s)) why.push('select * from');
    for (const m of s.matchAll(R(String.raw`(?:from|join)\s+(?:public\.)?` + T + String.raw`\s+(?:as\s+)?([a-z_][a-z0-9_]*)`, 'gi'))) {
      const al = m[1]; if (TU.has(al.toLowerCase())) continue;
      if (R(String.raw`(^|[^a-z0-9_.])` + al + String.raw`\.\*`).test(s)) why.push(al + '.*');
      if (R(String.raw`(to_jsonb|row_to_json|to_json)\(\s*` + al + String.raw`\s*\)`).test(s)) why.push('to_json(' + al + ')');
    }
    if (R(String.raw`returns?\s+setof\s+` + T + '|' + T + String.raw`\[\]`, 'i').test(f.ret + ' ' + s)) why.push('kiểu dòng của bảng');
    if (why.length) out.push(f.proname + ' [' + [...new Set(why)].join('; ') + '] → trả ' + f.ret.replace(/\s+/g, ' ').slice(0, 60));
  }
  if (out.length) { n += out.length; console.log('\n# ' + HO); for (const o of out) console.log('   - ' + o); }
}
// ham dung SQL dong doc het cot cua bang cau/ban do theo ten tu registry
const dyn = fns.filter(f => /select\s+\*\s+from\s+%/i.test(f.src) || /select\s+[a-z]\.\*\s+from\s+%/i.test(f.src)).map(f => f.proname);
console.log('\nhàm SQL động "select * from %I":', dyn.length, dyn.slice(0, 25).join(', '));
console.log('tổng hàm cần xem:', n);
await c.end();
