// Bay: bang co them cot `kho` (va ma_cu / nhanh…) ⇒ ham nao co BIEN/THAM SO cung ten, hoac dung ten do khong kem bi danh, se mo ho (plpgsql bao loi; sql doi nghia).
import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const HOS = process.argv.slice(2);
const COT = ['kho', 'ma_cu', 'nhanh', 'nguon_loai', 'muc_cau', 'xoa_at', 'gop_vao'];
const fns = (await c.query(`select p.proname, p.prosrc src, l.lanname lang, coalesce(p.proargnames, '{}') args from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace`)).rows;
const views = (await c.query(`select c.relname, pg_get_viewdef(c.oid) def from pg_class c where c.relnamespace='public'::regnamespace and c.relkind='v'`)).rows;
const T = '(?:dai|hgt|khtn|vatly|hoahoc)_(?:' + HOS.join('|') + ')';
const reT = new RegExp('(^|[^a-z0-9_])' + T + '([^a-z0-9_]|$)');
let n = 0;
for (const f of fns) {
  if (!reT.test(f.src)) continue;
  const s = f.src.replace(/--[^\n]*/g, ' ').replace(/'(?:[^']|'')*'/g, "''");   // bo chu thich + chuoi
  const why = [];
  for (const k of COT) {
    if (f.args.includes(k)) why.push('tham số tên ' + k);
    if (new RegExp('(^|[\\s;,(])' + k + '\\s+(text|uuid|int|integer|bigint|boolean|jsonb|record|smallint|timestamptz|date|numeric)[\\s;:=\\[]', 'i').test(s.split(/\bbegin\b/i)[0])) why.push('biến khai báo tên ' + k);
    // dung tran (khong co "x." dung truoc, khong phai ten tham so cua ham khac dang "k =>")
    const tran = [...s.matchAll(new RegExp('(^|[^a-z0-9_.])' + k + '(?![a-z0-9_])(?!\\s*=>)', 'gi'))].length;
    if (tran && k === 'kho') why.push('dùng trần "' + k + '" ×' + tran);
  }
  if (why.length) { n++; console.log('- ' + f.proname + ' (' + f.lang + '): ' + [...new Set(why)].join('; ')); }
}
console.log('\nhàm có nguy cơ trùng tên với cột mới:', n, '(trong số hàm có nhắc các họ: ' + fns.filter(f => reT.test(f.src)).length + ')');
await c.end();
