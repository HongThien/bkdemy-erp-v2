// Test CHẶN CỨNG ca trùng giờ + ca < 1 phút (mig 202611041721). Chạy từ GỐC repo: node scripts/luong-ta-t9/test_chan_ca.mjs
// BEGIN … ROLLBACK trên DB thật — DB không đổi.
import pg from 'pg'; import fs from 'fs';
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => { const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 120)); } };
const duoc = async (ten, fn) => { const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, true); } catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, false, e.message.slice(0, 120)); } };
const vai = async (ho_ten) => { const tk = (await q('select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.ho_ten=$1 limit 1', [ho_ten]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };
await c.query('begin');
try {
  const mig = fs.readdirSync('supabase/migrations').find((f) => f.startsWith('202611041721'));
  if (!(await q(`select 1 from pg_trigger where tgname='ta_cham_cong_kiem_gio'`)).length) await c.query(fs.readFileSync('supabase/migrations/' + mig, 'utf8'));
  await vai('Phong Ngọc Cường');
  const ns = (await q(`select id from nhan_su where ho_ten='Phong Ngọc Cường'`))[0].id;
  const ins = (vao, ra) => q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, khai_bu, trang_thai, created_by) values ($1, '2026-12-20', $2::timestamptz, $3::timestamptz, true, 'xong', $1) returning id`, [ns, vao, ra]);
  const id1 = (await ins('2026-12-20 14:30+07', '2026-12-20 17:30+07'))[0].id;
  ok('ca đầu tiên ghi được', !!id1);
  await phaiLoi('khai ca giống hệt ⇒ chặn', () => ins('2026-12-20 14:30+07', '2026-12-20 17:30+07'), 'đã có ca 14:30–17:30');
  await phaiLoi('khai ca chồng một phần ⇒ chặn', () => ins('2026-12-20 17:00+07', '2026-12-20 19:00+07'), 'trùng giờ');
  await duoc('ca nối tiếp (17:30–19:00) vẫn được', () => ins('2026-12-20 17:30+07', '2026-12-20 19:00+07'));
  await phaiLoi('ca 30 giây ⇒ chặn', () => ins('2026-12-20 20:00:00+07', '2026-12-20 20:00:30+07'), 'bấm nhầm');
  // checkout ngay sau checkin
  const mo = (await q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, created_by) values ($1, '2026-12-21', '2026-12-21 18:00+07', $1) returning id`, [ns]))[0].id;
  ok('checkin (chưa có giờ ra) không bị chặn', !!mo);
  await phaiLoi('checkout sau 20 giây ⇒ chặn', () => q(`update ta_cham_cong set ra_at = vao_at + interval '20 seconds' where id=$1`, [mo]), 'bấm nhầm');
  await phaiLoi('khai ca khác trong lúc ca đang mở ⇒ chặn', () => q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, khai_bu, trang_thai, created_by) values ($1,'2026-12-21','2026-12-21 18:30+07','2026-12-21 19:00+07',true,'xong',$1)`, [ns]), 'chưa checkout');
  await duoc('huỷ ca đang mở (ra = vào, từ chối) vẫn được', () => q(`update ta_cham_cong set duyet='tu_choi', ra_at = coalesce(ra_at, vao_at), trang_thai='xong' where id=$1`, [mo]));
  await duoc('ca đã huỷ không cản ca mới cùng giờ', () => q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, khai_bu, trang_thai, created_by) values ($1,'2026-12-21','2026-12-21 18:00+07','2026-12-21 19:30+07',true,'xong',$1)`, [ns]));
  // dữ liệu trùng CŨ vẫn duyệt / từ chối được
  const cu = await q(`select a.id from ta_cham_cong a join ta_cham_cong b on a.nhan_su_id=b.nhan_su_id and a.ngay=b.ngay and a.id<>b.id and a.duyet<>'tu_choi' and b.duyet<>'tu_choi'
     and tstzrange(coalesce(a.vao_chot,a.vao_at), coalesce(a.ra_chot,a.ra_at,'infinity')) && tstzrange(coalesce(b.vao_chot,b.vao_at), coalesce(b.ra_chot,b.ra_at,'infinity')) limit 1`);
  if (cu.length) await duoc('dòng trùng cũ vẫn đổi trạng thái duyệt được', () => q(`update ta_cham_cong set duyet='da_duyet' where id=$1`, [cu[0].id]));
  else console.log('   (không còn dòng trùng cũ để thử duyệt)');
  // đường khai bù thật qua RPC
  // đường khai bù thật qua RPC: ca sáng nay (trong 24 giờ) rồi khai bù chồng lên
  await q(`insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, khai_bu, trang_thai, created_by) values ($1, current_date, (current_date + time '06:00') at time zone 'Asia/Ho_Chi_Minh', (current_date + time '07:00') at time zone 'Asia/Ho_Chi_Minh', true, 'xong', $1)`, [ns]);
  await phaiLoi('fn_ta_cham_cong_khai_bu trùng ca đã có ⇒ chặn, báo rõ', () => q(`select fn_ta_cham_cong_khai_bu((current_date + time '06:30') at time zone 'Asia/Ho_Chi_Minh', (current_date + time '06:50') at time zone 'Asia/Ho_Chi_Minh', null)`), 'đã có ca');
} catch (e) { fail++; console.log('✘ LỖI:', e.message); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
