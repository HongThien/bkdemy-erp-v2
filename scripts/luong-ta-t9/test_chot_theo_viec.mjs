// Test fn_ta_chot_gio_theo_viec (mig 202611041758). Chạy từ GỐC repo — BEGIN … ROLLBACK, DB không đổi.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const vai = async (ho_ten) => { const tk = (await q('select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.ho_ten=$1 limit 1', [ho_ten]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };
await c.query('begin');
try {
  if (!(await q(`select 1 from pg_proc where proname='fn_ta_chot_gio_theo_viec'`)).length) await c.query(fs.readFileSync('supabase/migrations/202611041758_ta_chot_gio_theo_viec.sql', 'utf8'));
  const ns = (await q(`select id from nhan_su where ho_ten='Phong Ngọc Cường'`))[0].id;
  const ca = (await q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, created_by) values ($1, '2026-12-22', '2026-12-22 18:40+07', $1) returning id`, [ns]))[0].id;
  await q(`insert into ta_cong_viec (nhan_su_id, cham_cong_id, ngay, loai_viec, gio_bat_dau, gio_ket_thuc, nguon) values ($1,$2,'2026-12-22','bo_tro_dinh_ki','18:30','19:30','tu_khai'), ($1,$2,'2026-12-22','bo_tro_dinh_ki','19:30','21:15','tu_khai')`, [ns, ca]);
  await vai('Phạm Thị Thùy Trang');
  const g = (await q(`select fn_ta_chot_gio_theo_viec($1) g`, [ca]))[0].g;
  ok('chốt theo việc: vào 18:30 (việc đầu sớm hơn checkin 18:40), ra 21:15', g.vao === '18:30' && g.ra === '21:15', JSON.stringify(g));
  const r = (await q(`select vao_at, vao_chot, ra_at, ra_chot from ta_cham_cong where id=$1`, [ca]))[0];
  ok('giờ gốc giữ nguyên (ra_at vẫn trống)', r.ra_at === null && r.vao_chot !== null);
  ok('chốt xong duyệt được ca', !!(await q(`select fn_ta_duyet_cong(array[$1::uuid], '{}', 'da_duyet') n`, [ca]))[0].n);
  await vai('Phong Ngọc Cường');
  let loi = ''; await c.query('savepoint s'); try { await q(`select fn_ta_chot_gio_theo_viec($1)`, [ca]); } catch (e) { loi = e.message; } await c.query('rollback to savepoint s');
  ok('TA không tự chốt được', loi.includes('quyền'), loi);
} catch (e) { fail++; console.log('✘ LỖI:', e.message); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
