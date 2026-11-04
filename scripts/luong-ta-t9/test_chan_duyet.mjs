// Test chặn duyệt việc trong ca bị từ chối + ngưng loại 'khac' (mig 202611041729). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_chan_duyet.mjs      — BEGIN … ROLLBACK, DB không đổi.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => { const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 130)); } };
const duoc = async (ten, fn) => { const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, true); } catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, false, e.message.slice(0, 130)); } };
const vai = async (ho_ten) => { const tk = (await q('select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.ho_ten=$1 limit 1', [ho_ten]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };
const LUONG = `select ho_ten, net::int from _ta_luong_tinh('2026-10-01') order by 1`;
const truoc = await q(LUONG);
await c.query('begin');
try {
  if (!(await q(`select 1 from pg_trigger where tgname='ta_cham_cong_kiem_tu_choi'`)).length)
    await c.query(fs.readFileSync('supabase/migrations/202611041729_ta_chan_duyet_viec_ca_tu_choi_va_bo_viec_khac.sql', 'utf8'));
  const sau = await q(LUONG);
  const doi = sau.filter((s) => truoc.find((t) => t.ho_ten === s.ho_ten)?.net !== s.net).map((s) => `${s.ho_ten} ${truoc.find((t) => t.ho_ten === s.ho_ten)?.net}→${s.net}`);
  ok('lương T10 không đổi', doi.length === 0, doi.join(' · '));
  ok('loại "Việc khác" đã ngưng', (await q(`select active from ta_loai_viec where ma='khac'`))[0].active === false);
  ok('dòng khác cũ vẫn còn', (await q(`select count(*)::int n from ta_cong_viec where loai_viec='khac'`))[0].n >= 9);
  await vai('Phạm Thị Thùy Trang');
  // 1 trong 13 dòng kẹt: Long 20/10 — việc đã duyệt trong ca từ chối
  const ket = (await q(`select v.id viec, cc.id ca from ta_cong_viec v join ta_cham_cong cc on cc.id=v.cham_cong_id join nhan_su n on n.id=v.nhan_su_id
     where n.ho_ten='Trần Nhật Long' and v.ngay='2026-10-20' and v.trang_thai='da_duyet' and cc.duyet='tu_choi' limit 1`))[0];
  await duoc('việc kẹt: từ chối việc vẫn được', () => q(`select fn_ta_duyet_cong('{}', array[$1::uuid], 'tu_choi', 'không có mặt')`, [ket.viec]));
  await phaiLoi('duyệt lại việc trong ca từ chối ⇒ chặn', () => q(`select fn_ta_duyet_cong('{}', array[$1::uuid], 'da_duyet')`, [ket.viec]), 'TỪ CHỐI');
  await duoc('chốt giờ ra + duyệt lại ca ⇒ được', async () => {
    await q(`select fn_ta_chot_gio($1, (select vao_at from ta_cham_cong where id=$1), (select vao_at from ta_cham_cong where id=$1) + interval '2 hours')`, [ket.ca]);
    await q(`select fn_ta_duyet_cong(array[$1::uuid], '{}', 'da_duyet')`, [ket.ca]); });
  await duoc('ca đã duyệt lại ⇒ duyệt việc được', () => q(`select fn_ta_duyet_cong('{}', array[$1::uuid], 'da_duyet')`, [ket.viec]));
  await phaiLoi('từ chối ca còn việc đã duyệt ⇒ chặn', () => q(`select fn_ta_duyet_cong(array[$1::uuid], '{}', 'tu_choi', 'thử')`, [ket.ca]), 'việc đã duyệt');
  await vai('Phong Ngọc Cường');
  await phaiLoi('ghi việc mới loại "Việc khác" ⇒ chặn', () => q(`insert into ta_cong_viec (nhan_su_id, ngay, loai_viec, gio_bat_dau, gio_ket_thuc, ghi_chu, nguon) select id, current_date, 'khac', '08:00', '09:00', 'thử', 'tu_khai' from nhan_su where ho_ten='Phong Ngọc Cường'`), 'không còn dùng');
  await vai('Phạm Thị Thùy Trang');
  await duoc('Trang vẫn từ chối được dòng "Việc khác" cũ', () => q(`select fn_ta_duyet_cong('{}', array['62bb9c51-8bd7-4a4c-b8bd-b7c56b3715fd'::uuid], 'tu_choi', 'thử')`));
  await duoc('đổi dòng "Việc khác" cũ sang loại có sẵn được', () => q(`update ta_cong_viec set loai_viec='trong_thi', lop_id=(select id from lop where ten_lop='9A1') where id='79997745-518b-4db3-8f09-04aff929dd1d'`));
  ok('app không còn liệt kê "Việc khác"', !(await q(`select 1 from ta_loai_viec where active and ma='khac'`)).length);
} catch (e) { fail++; console.log('✘ LỖI:', e.message); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
