import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim()]));
const c = new pg.Client({connectionString:env.DATABASE_URL, ssl:{rejectUnauthorized:false}}); await c.connect();
await c.query('set default_transaction_read_only=on');
const fns = (await c.query(`select p.proname, p.prosrc src from pg_proc p where p.pronamespace='public'::regnamespace and p.prosrc ~* 'execute' and p.prosrc ~ '%[0-9]*[$]?[Is]'`)).rows;
let n = 0;
for (const k of ['xoa_at', 'gop_vao', 'muc_cau', 'nguon_loai', 'kho']) for (const f of fns) {
  const s = f.src.replace(/--[^\n]*/g, ' ');
  const ms = [...s.matchAll(new RegExp('[^\n]{0,150}(?:^|[^a-z0-9_.$%])' + k + '(?![a-z0-9_])(?!\s*=>)[^\n]{0,60}', 'g'))].map(m => m[0].replace(/\s+/g, ' ')).filter(x => /join|,\s*%|from\s+%\S+\s+\w+\s*,/i.test(x) || true);
  if (!ms.length) continue; n++; console.log(`- ${f.proname}: trần "${k}" ×${ms.length}`); for (const m of ms.slice(0, 2)) console.log('     ' + m.slice(0, 230));
}
console.log('tổng (hàm SQL động có dùng trần tên cột):', n);
await c.end();
