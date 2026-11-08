// Thử mig 202611041757 trong BEGIN … ROLLBACK: lương T10 trước/sau + khai bù mở/khoá. DB không đổi.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
const L = `select ho_ten, net::int net, package_lop::int lop, bo_tro_tien::int bt from _ta_luong_tinh('2026-10-01') order by 1`;
const truoc = await q(L);
await c.query('begin');
try {
  const ns = (await q(`select id from nhan_su where ho_ten='Phong Ngọc Cường'`))[0].id;
  const thu = async () => (await q(`select public._ta_duoc_khai_bu('2026-10-12') a, public._ta_duoc_khai_bu('2026-11-02') b`))[0];
  console.log('trước mở: khai bù 12/10?', await thu());
  await c.query(fs.readFileSync('supabase/migrations/202611041757_ta_mo_khai_bu_toi_6h_05_11_va_chot_6_ca_quen_checkout.sql', 'utf8'));
  console.log('sau mở  : khai bù 12/10 / 02/11?', await thu());
  console.log('6h05 sáng 5/11 (giả lập):', (await q(`select exists (select 1 from ta_dot_khai_bu d where '2026-10-12' between d.tu and d.den and timestamptz '2026-11-05 06:05+07' <= d.han) x`))[0].x);
  const sau = await q(L);
  for (const s of sau) { const t = truoc.find((x) => x.ho_ten === s.ho_ten); if (!t || t.net !== s.net) console.log(`  ${s.ho_ten}: net ${t?.net ?? 0} → ${s.net}  (lớp ${t?.lop ?? 0}→${s.lop}, bổ trợ ${t?.bt ?? 0}→${s.bt})`); }
} catch (e) { console.log('✘', e.message); }
await c.query('rollback'); await c.end();
