// Test luồng CHẤM CÔNG theo thiết kế 13/10 (spec-cham-cong-ta.md). Chạy từ GỐC repo:
//   cat scripts/luong-ta-t9/test_chamcong.mjs | node --input-type=module
// Mọi thứ trong BEGIN … ROLLBACK — DB không đổi.
import pg from 'pg'; import fs from 'fs';
const sql = fs.readFileSync('supabase/migrations/202610122210_ta_cham_cong_va_luong.sql', 'utf8');
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } });
await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => {
  const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 80)); }
};
const dongVai = async (tk) => c.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, email: tk.email, role: 'authenticated' })]);
const tkCua = async (ten) => (await q("select tk.id, ns.email, ns.id ns from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.ho_ten=$1 limit 1", [ten]))[0];

await c.query('begin');
try {
  await c.query(sql); ok('migration chạy được', true);
  const ta = await tkCua('Phong Ngọc Cường'), ta2 = await tkCua('Nguyễn Thị Mỹ Hằng');
  const adm = (await q("select tk.id, ns.email, ns.id ns from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];
  const lop = Object.fromEntries((await q("select ten_lop, id from lop where ten_lop in ('6S2','6S1')")).map(r => [r.ten_lop, r.id]));
  const homNay = (await q("select (now() at time zone 'Asia/Ho_Chi_Minh')::date::text d"))[0].d;

  // ── TA: vào ca, khai việc, ra ca ──
  await dongVai(ta);
  await phaiLoi('chưa vào ca thì không khai được việc', () => q("select fn_ta_khai_viec('tro_giang',$1::date)", [homNay]), 'Chưa chấm công');
  const ca = (await q("select fn_ta_cham_cong_vao('Cơ sở 1') id"))[0].id;
  ok('vào ca', !!ca);
  ok('vào ca lần 2 trả đúng ca cũ (không đẻ ca trùng)', (await q("select fn_ta_cham_cong_vao() id"))[0].id === ca);
  const v1 = (await q("select fn_ta_khai_viec('tro_giang',$1::date,null,null,null,'18:00','19:30') id", [homNay]))[0].id;
  const r1 = (await q("select l.ten_lop, cv.nguon, cv.trang_thai, cv.khai_bu from ta_cong_viec cv join lop l on l.id=cv.lop_id where cv.id=$1", [v1]))[0];
  ok('trợ giảng không chọn lớp → lớp chính', r1.ten_lop === '6S2', `${r1.ten_lop} · ${r1.nguon} · ${r1.trang_thai}`);
  const v2 = (await q("select fn_ta_khai_viec('tro_giang',$1::date,$2,null,null,'19:30','21:00') id", [homNay, lop['6S1']]))[0].id;
  const v3 = (await q("select fn_ta_khai_viec('trong_thi',$1::date,$2,null,null,'14:00','16:00') id", [homNay, lop['6S1']]))[0].id;
  const v4 = (await q("select fn_ta_khai_viec('hop',$1::date,null,null,null,'16:00','17:00',null,'Họp TA đầu tháng') id", [homNay]))[0].id;
  await phaiLoi('việc "khác" không ghi chú bị chặn', () => q("select fn_ta_khai_viec('khac',$1::date,null,null,null,'10:00','11:00')", [homNay]), 'ghi chú');
  await phaiLoi('bổ trợ không chọn lớp bị chặn', () => q("select fn_ta_khai_viec('bo_tro_bu',$1::date,null,null,null,'10:00','11:00')", [homNay]), 'cần chọn lớp');
  await phaiLoi('không khai trước cho ngày mai', () => q("select fn_ta_khai_viec('tro_giang',($1::date + 1))", [homNay]), 'chưa tới');
  await phaiLoi('khai việc cách đây 3 ngày bị chặn (quá 24 giờ)', () => q("select fn_ta_khai_viec('tro_giang',($1::date - 3))", [homNay]), '24 giờ');
  await q('select fn_ta_bo_viec($1)', [v4]);
  ok('TA tự bỏ việc còn chờ duyệt (giữ vết)', (await q('select trang_thai from ta_cong_viec where id=$1', [v4]))[0].trang_thai === 'tu_choi');
  await phaiLoi('TA không tự duyệt được', () => q("select fn_ta_duyet_cong(array[$1::uuid], array[$2::uuid], 'da_duyet')", [ca, v1]), 'Không có quyền');
  await phaiLoi('TA không xem được màn đối chiếu', () => q('select * from fn_ta_doi_chieu($1::date)', [homNay]), 'Không có quyền');
  await q('select fn_ta_cham_cong_ra()'); ok('ra ca', true);

  // ── khai bù ──
  const caBu = (await q("select fn_ta_cham_cong_khai_bu(now() - interval '20 hours', now() - interval '17 hours') id"))[0].id;
  ok('khai bù ca trong 24 giờ', (await q('select khai_bu, duyet from ta_cham_cong where id=$1', [caBu]))[0].khai_bu === true);
  await phaiLoi('khai bù ca quá 24 giờ bị chặn', () => q("select fn_ta_cham_cong_khai_bu(now() - interval '50 hours', now() - interval '47 hours')"), '24 giờ');

  // ── TA khác quên ra từ hôm qua ──
  await dongVai(adm);
  await c.query("insert into ta_cham_cong(nhan_su_id, ngay, vao_at, created_by) values ($1, ($2::date - 1), now() - interval '26 hours', $1)", [ta2.ns, homNay]);

  // ── Quản lý: đối chiếu + duyệt lô ──
  const dc = await q('select * from fn_ta_doi_chieu(($1::date - 1), $1::date)', [homNay]);
  const dong = (id) => dc.find(r => r.id === id);
  console.log('   đối chiếu:', dc.length, 'dòng =', dc.filter(r => r.loai_dong === 'ca').length, 'ca +', dc.filter(r => r.loai_dong === 'viec').length, 'việc');
  for (const r of dc) console.log('     ', r.loai_dong.padEnd(4), (r.ho_ten || '').padEnd(20), (r.ten_loai || '(ca có mặt)').padEnd(24), (r.ten_lop || '').padEnd(4),
    r.khop === null ? '·' : r.khop ? 'ĐÃ KHỚP' : '(trống)', (r.co || []).join(','), r.lam_ho ? '| hộ: ' + r.lam_ho : '', '|', r.duyet);
  ok('việc dạy hộ 6S1 tự suy ra "làm hộ ai"', !!dong(v2)?.lam_ho, dong(v2)?.lam_ho);
  ok('việc ở lớp mình không có nhãn làm hộ', dong(v1)?.lam_ho == null);
  ok('trông thi chưa có bằng chứng → để trống', dong(v3)?.khop === false);
  ok('ca quên ra hôm qua có cờ quen_ra', dc.some(r => r.loai_dong === 'ca' && r.nhan_su_id === ta2.ns && r.co.includes('quen_ra')));
  ok('ca khai bù có cờ khai_bu', dong(caBu)?.co.includes('khai_bu'));
  const caQuen = dc.find(r => r.loai_dong === 'ca' && r.nhan_su_id === ta2.ns).id;
  await phaiLoi('duyệt ca chưa có giờ ra bị chặn', () => q("select fn_ta_duyet_cong(array[$1::uuid], '{}', 'da_duyet')", [caQuen]), 'chưa có giờ ra');
  await q("select fn_ta_chot_gio($1, now() - interval '26 hours', now() - interval '23 hours')", [caQuen]);
  const goc = (await q('select vao_at, ra_at, vao_chot, ra_chot from ta_cham_cong where id=$1', [caQuen]))[0];
  ok('chốt giờ: giờ gốc giữ nguyên, giờ chốt lưu riêng', goc.ra_at === null && goc.ra_chot !== null);
  await phaiLoi('từ chối không lý do bị chặn', () => q("select fn_ta_duyet_cong('{}', array[$1::uuid], 'tu_choi')", [v3]), 'lý do');
  const n = (await q("select fn_ta_duyet_cong($1::uuid[], $2::uuid[], 'da_duyet') n", [[ca, caBu, caQuen], [v1, v2]]))[0].n;
  ok('duyệt cả lô (3 ca + 2 việc)', n === 5, 'đổi ' + n + ' dòng');
  await q("select fn_ta_duyet_cong('{}', array[$1::uuid], 'tu_choi', 'Không có lịch thi hôm đó')", [v3]);

  // ── buổi thiếu công ──
  const thieu = await q("select * from fn_ta_buoi_thieu_cong('2026-09-22'::date, '2026-09-24'::date)");
  ok('có danh sách buổi / ca không ai chấm công', thieu.length > 0, `${thieu.filter(r => r.loai === 'buoi').length} buổi + ${thieu.filter(r => r.loai === 'ca').length} ca trong 22–24/9`);

  // ── nhập hộ ──
  const caHo = (await q("select fn_ta_cham_cong_nhap_ho($1, now() - interval '5 days', now() - interval '5 days' + interval '3 hours', 'TA báo quên, đã xác minh với GV') id", [ta2.ns]))[0].id;
  const vHo = (await q("select fn_ta_nhap_ho_viec($1, 'tro_giang', ($2::date - 5), $3, null, null, '18:00', '19:30', null, 'TA báo quên, đã xác minh với GV') id", [ta2.ns, homNay, lop['6S1']]))[0].id;
  const h = (await q('select cc.nguon cn, cc.duyet, cv.nguon vn, cv.trang_thai from ta_cham_cong cc, ta_cong_viec cv where cc.id=$1 and cv.id=$2', [caHo, vHo]))[0];
  ok('quản lý nhập hộ ca + việc quá hạn (đã duyệt, có nguồn nhap_ho)', h.cn === 'nhap_ho' && h.vn === 'nhap_ho' && h.trang_thai === 'da_duyet');
  await phaiLoi('nhập hộ không lý do bị chặn', () => q("select fn_ta_nhap_ho_viec($1, 'tro_giang', $2::date, $3, null, null, '18:00', '19:30', null, '')", [ta2.ns, homNay, lop['6S1']]), 'lý do');

  // ── lương chỉ tính việc đã duyệt thuộc ca đã duyệt ──
  const ky = homNay.slice(0, 8) + '01';
  const l1 = (await q('select * from fn_ta_luong_thang($1::date, $2)', [ky, ta.ns]))[0];
  const tg6s1 = l1.chi_tiet.lop.find(x => x.lop === '6S1');
  ok('lương: buổi dạy hộ 6S1 đã duyệt được tính, đi theo lớp 6S1', tg6s1 && tg6s1.tg_lam === 1 && tg6s1.la_chu === false, JSON.stringify(tg6s1 && { tg: tg6s1.tg_lam, chu: tg6s1.la_chu }));
  ok('lương: trông thi bị từ chối không được tính', l1.chi_tiet.ngoai_package.length === 0);
  await q("select fn_ta_duyet_cong(array[$1::uuid], '{}', 'tu_choi', 'thử: ca bị từ chối')", [ca]);
  const l2 = (await q('select * from fn_ta_luong_thang($1::date, $2)', [ky, ta.ns]))[0];
  ok('lương: ca có mặt bị từ chối ⇒ việc trong ca không được tính', !l2.chi_tiet.lop.some(x => x.tg_lam > 0), 'TG còn ' + l2.chi_tiet.lop.reduce((s, x) => s + x.tg_lam, 0));
  ok('nhật ký có vết mọi thay đổi', (await q('select count(*)::int n from ta_cong_log'))[0].n > 10);
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
