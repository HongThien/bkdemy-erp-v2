// Ham nao nhac bang T va dung TRAN ten cot moi them vao T (khong co "bi_danh." dung truoc) ⇒ co the mo ho khi ghep voi bang khac cung co cot do.
import pg from 'pg'; import fs from 'fs';
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await c.connect();
await c.query('set default_transaction_read_only=on');
const CAP = [   // [bang, cot moi them]
  ['dai_bdm_nhom', 'ma_cu'], ['dai_bdm_dang_bai', 'ma_cu'], ['dai_bdm_chu_de', 'ma_cu'], ['dai_bdm_chuyen_de', 'ma_cu'],
  ['khtn_bdm_chu_de', 'nhanh'], ['vatly_bdm_chu_de', 'nhanh'], ['hoahoc_bdm_chu_de', 'nhanh'],
  ['hgt_ban_do', 'xoa_at'], ['khtn_ban_do', 'xoa_at'], ['vatly_ban_do', 'xoa_at'], ['hoahoc_ban_do', 'xoa_at'],
  ['hgt_ban_do', 'gop_vao'], ['khtn_ban_do', 'gop_vao'], ['vatly_ban_do', 'gop_vao'], ['hoahoc_ban_do', 'gop_vao'],
  ['dai_cau_hoi', 'muc_cau'], ['hgt_cau_hoi', 'muc_cau'], ['hgt_cau_hoi', 'nguon_loai'], ['khtn_cau_hoi', 'nguon_loai'], ['vatly_cau_hoi', 'nguon_loai'], ['hoahoc_cau_hoi', 'nguon_loai'],
];
const fns = (await c.query(`select p.proname, p.prosrc src, l.lanname lang from pg_proc p join pg_language l on l.oid=p.prolang where p.pronamespace='public'::regnamespace`)).rows;
const sach = s => s.replace(/--[^\n]*/g, ' ').replace(/'(?:[^']|'')*'/g, "''");
let n = 0; const da = new Set();
for (const [t, k] of CAP) {
  const reT = new RegExp('(^|[^a-z0-9_])' + t + '([^a-z0-9_]|$)');
  for (const f of fns) {
    if (!reT.test(f.src)) continue; const s = sach(f.src);
    const ms = [...s.matchAll(new RegExp('.{0,60}(?:^|[^a-z0-9_.])' + k + '(?![a-z0-9_])(?!\\s*=>).{0,50}', 'g'))].map(m => m[0].replace(/\s+/g, ' '))
      .filter(x => !new RegExp('(as|,|\\()\\s*' + k + '\\s*(,|\\)|$)').test(x) || true);
    if (!ms.length) continue; const key = f.proname + '|' + k; if (da.has(key)) continue; da.add(key); n++;
    console.log(`- ${f.proname} [${f.lang}] nhắc ${t}, dùng trần "${k}" ×${ms.length}:`); for (const m of ms.slice(0, 3)) console.log('     ' + m);
  }
}
console.log('\ntổng:', n);
await c.end();
