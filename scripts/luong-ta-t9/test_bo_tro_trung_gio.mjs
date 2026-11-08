// Test GIỜ BỔ TRỢ CHỒNG NHAU TÍNH 1 LẦN (mig 202611041713). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_bo_tro_trung_gio.mjs
// BEGIN … ROLLBACK trên DB thật — DB không đổi.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const L = (ky) => q(`select ho_ten, bo_tro_gio::float g, bo_tro_tien::float t, net::float net, chi_tiet->'bo_tro' bt from _ta_luong_tinh($1) order by ho_ten`, [ky]);
const t9a = await L('2026-09-01'), t10a = await L('2026-10-01');
await c.query('begin');
try {
  const mig = fs.readdirSync('supabase/migrations').find((f) => f.startsWith('202611041713'));
  const da = (await q(`select 1 from _migrations where ten = $1`, [mig]).catch(() => [])).length;
  if (!da) await c.query(fs.readFileSync('supabase/migrations/' + mig, 'utf8'));
  console.log('   migration:', da ? '(đã có sẵn trên DB)' : mig);
  const t9b = await L('2026-09-01'), t10b = await L('2026-10-01');
  ok('tháng 9 (trước chấm công ERP) không đổi', JSON.stringify(t9a.map((r) => [r.ho_ten, r.net])) === JSON.stringify(t9b.map((r) => [r.ho_ten, r.net])));
  const doi = t10b.map((b) => ({ b, a: t10a.find((a) => a.ho_ten === b.ho_ten) })).filter((x) => x.a && Math.abs(x.a.g - x.b.g) > 1e-9);
  for (const x of doi) console.log(`   ${x.b.ho_ten}: giờ ${x.a.g} → ${x.b.g} (khai ${x.b.bt.gio_khai}, trùng ${x.b.bt.gio_trung}) · tiền bổ trợ ${x.a.t} → ${x.b.t} · net ${x.a.net} → ${x.b.net}`);
  ok('tháng 10: chỉ người có việc chồng giờ bị đổi', doi.every((x) => ['Trần Nhật Long', 'Phạm Bảo Ngân', 'Phong Ngọc Cường', 'Tạ Quang Tùng'].includes(x.b.ho_ten)), doi.length + ' người');
  ok('tháng 10: không ai tăng giờ', doi.every((x) => x.b.g < x.a.g));
  ok('giờ khai = giờ cũ (cộng thẳng)', t10b.every((b) => { const a = t10a.find((x) => x.ho_ten === b.ho_ten); return !a || Math.abs(Number(b.bt.gio_khai) - a.g) < 0.01 }));
  ok('giờ trùng = khai − tính', t10b.every((b) => Math.abs(Number(b.bt.gio_khai) - Number(b.bt.gio) - Number(b.bt.gio_trung)) < 0.011));
  const long = t10b.find((r) => r.ho_ten === 'Trần Nhật Long'), longA = t10a.find((r) => r.ho_ten === 'Trần Nhật Long');
  ok('Long tháng 10 bớt đúng 5 giờ (14/10: 5,5→1,5 · 18/10: 2→1)', long && Math.abs(longA.g - long.g - 5) < 0.01, long && `${longA.g} → ${long.g}`);
} catch (e) { fail++; console.log('✘ LỖI:', e.message); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
