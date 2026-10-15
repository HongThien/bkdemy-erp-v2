// Test TA TỰ SỬA công (mig 202610151938): sửa giờ ca khai bù · huỷ ca (kèm việc) · sửa việc. Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_sua_cong.mjs
// Mọi thứ trong BEGIN … ROLLBACK trên DB thật — DB không đổi. Gọi hàm đúng vai (jwt) như app.
import pg from 'pg'; import fs from 'fs';
import { pathToFileURL } from 'url';
const { apMigration } = await import(pathToFileURL('scripts/luong-ta-t9/_mig.mjs').href);
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } });
await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => {
  const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 110)); }
};
const vai = async (ns) => { const tk = (await q('select id from tai_khoan where nhan_su_id = $1 limit 1', [ns]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };

await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  const ta = (await q("select id from nhan_su where ho_ten = 'Phong Ngọc Cường'"))[0].id;
  const khac = (await q("select id from nhan_su where ho_ten = 'Tạ Quang Tùng'"))[0].id;
  const homQua = (await q("select ((now() at time zone 'Asia/Ho_Chi_Minh')::date - 1)::text d"))[0].d;
  const ts = (gio) => `${homQua} ${gio}+07`;
  const lop = (await q("select id from lop where ten_lop = '6S2'"))[0].id;
  await vai(ta);
  // dọn ca hôm qua của TA trong rollback để kịch bản sạch
  await q("update ta_cham_cong set duyet = 'tu_choi', ra_at = coalesce(ra_at, vao_at) where nhan_su_id = $1 and ngay = $2::date", [ta, homQua]);
  const ca = (await q('select fn_ta_cham_cong_khai_bu($1::timestamptz, $2::timestamptz) id', [ts('17:00'), ts('19:00')]))[0].id;
  const viec = (await q("select fn_ta_khai_viec('bo_tro_on_thi', $1::date, $2, null, null, '17:00', '18:00', null, 'nhầm') id", [homQua, lop]))[0].id;

  // ── Sửa ca khai bù ──
  await q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [ca, ts('17:30'), ts('20:00')]);
  const c1 = (await q("select to_char(vao_at at time zone 'Asia/Ho_Chi_Minh','HH24:MI') v, to_char(ra_at at time zone 'Asia/Ho_Chi_Minh','HH24:MI') r from ta_cham_cong where id = $1", [ca]))[0];
  ok('sửa giờ ca khai bù', c1.v === '17:30' && c1.r === '20:00', `${c1.v}–${c1.r}`);
  ok('sửa ca có ghi vết (log cũ/mới)', (await q("select count(*)::int n from ta_cong_log where row_id = $1 and hanh_dong = 'UPDATE'", [ca]))[0].n >= 1);
  await phaiLoi('sửa ca sang ngày khác bị chặn', () => q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [ca, `${homQua} 17:00+07`, 'now()']), 'trong ngày');
  await phaiLoi('checkout trước checkin bị chặn', () => q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [ca, ts('20:00'), ts('19:00')]), 'sau giờ checkin');

  // ── Sửa việc ──
  await q("select fn_ta_sua_viec($1, 'bo_tro_chua_bai', $2, '17:30', '19:00', 'Nguyễn A', 'chữa bài')", [viec, lop]);
  const v1 = (await q('select loai_viec, to_char(gio_bat_dau, \'HH24:MI\') b, hoc_sinh, ghi_chu from ta_cong_viec where id = $1', [viec]))[0];
  ok('sửa việc: đổi loại + giờ + học sinh + ghi chú', v1.loai_viec === 'bo_tro_chua_bai' && v1.b === '17:30' && v1.hoc_sinh === 'Nguyễn A' && v1.ghi_chu === 'chữa bài', JSON.stringify(v1));
  await phaiLoi('việc cần lớp mà bỏ trống lớp bị chặn', () => q("select fn_ta_sua_viec($1, 'bo_tro_on_thi', null, '17:30', '19:00')", [viec]), 'cần chọn lớp');
  await q("select fn_ta_sua_viec($1, 'tro_giang', $2)", [viec, lop]);
  const v2 = (await q('select loai_viec, buoi_hoc_id from ta_cong_viec where id = $1', [viec]))[0];
  ok('đổi sang trợ giảng ⇒ tự gắn buổi lớp hôm đó (nếu có)', v2.loai_viec === 'tro_giang', v2.buoi_hoc_id ? 'đã gắn buổi' : 'lớp không có buổi hôm qua');

  // ── Người khác không sửa được ──
  await vai(khac);
  await phaiLoi('TA khác không sửa được ca của mình', () => q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [ca, ts('17:00'), ts('18:00')]), 'Không thấy');
  await phaiLoi('TA khác không sửa được việc', () => q("select fn_ta_sua_viec($1, 'khac', null, null, null, null, 'x')", [viec]), 'Không thấy');
  await phaiLoi('TA khác không huỷ được ca', () => q('select fn_ta_huy_ca($1)', [ca]), 'Không thấy');
  await vai(ta);

  // ── Đã duyệt thì không tự sửa ──
  await q("update ta_cong_viec set trang_thai = 'da_duyet' where id = $1", [viec]);
  await phaiLoi('việc đã duyệt thì không tự sửa', () => q("select fn_ta_sua_viec($1, 'khac', null, null, null, null, 'x')", [viec]), 'đã được duyệt');
  await q("update ta_cong_viec set trang_thai = 'cho_duyet' where id = $1", [viec]);

  // ── Huỷ ca kèm việc ──
  const nHuy = (await q("select fn_ta_huy_ca($1, 'khai nhầm ngày') n", [ca]))[0].n;
  const sau = (await q("select (select duyet from ta_cham_cong where id = $1) ca, (select trang_thai from ta_cong_viec where id = $2) viec, (select ly_do_duyet from ta_cong_viec where id = $2) ld", [ca, viec]))[0];
  ok('huỷ ca ⇒ ca + việc gắn ca thành từ chối, ghi lý do', nHuy === 1 && sau.ca === 'tu_choi' && sau.viec === 'tu_choi' && sau.ld.includes('khai nhầm ngày'), JSON.stringify(sau));
  ok('dòng không bị xoá (chỉ đổi trạng thái)', (await q('select count(*)::int n from ta_cham_cong where id = $1', [ca]))[0].n === 1);
  await phaiLoi('ca đã huỷ không sửa được nữa', () => q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [ca, ts('17:00'), ts('18:00')]), 'đã được duyệt');
  const caMoi = (await q('select fn_ta_cham_cong_khai_bu($1::timestamptz, $2::timestamptz) id', [ts('18:00'), ts('20:00')]))[0].id;
  ok('huỷ xong khai bù lại được ngày đó', !!caMoi && caMoi !== ca);

  // ── Ca checkin bằng app: không sửa giờ ──
  const caApp = (await q("insert into ta_cham_cong (nhan_su_id, ngay, vao_at, ra_at, trang_thai, created_by) values ($1, $2::date, $3::timestamptz, $4::timestamptz, 'xong', $1) returning id", [ta, homQua, ts('07:00'), ts('08:00')]))[0].id;
  await phaiLoi('ca checkin bằng app không sửa giờ được', () => q('select fn_ta_sua_ca($1, $2::timestamptz, $3::timestamptz)', [caApp, ts('06:00'), ts('08:00')]), 'giờ máy ghi');
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
