// Test CHỐT KỲ LƯƠNG TA (mig 202610141527, spec-cham-cong-ta.md §10 bước 6). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_chot_ky.mjs
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
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 100)); }
};
const dongVai = async (tk) => c.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, email: tk.email, role: 'authenticated' })]);
const T9 = '2026-09-01', T10 = '2026-10-01';

await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  const adm = (await q("select tk.id, ns.email, ns.id ns from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];
  const ta = (await q("select tk.id, ns.email, ns.id ns from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.ho_ten='Phong Ngọc Cường' limit 1"))[0];

  // ── TA không chốt / không xem tình trạng ──
  await dongVai(ta);
  await phaiLoi('TA không xem được tình trạng chốt', () => q('select fn_ta_ky_trang_thai($1::date)', [T9]), 'Không có quyền');
  await phaiLoi('TA không chốt được', () => q('select fn_ta_chot_ky($1::date)', [T9]), 'Không có quyền');

  // ── Tháng trước mốc chấm công (lương tính ngoài ERP) không chốt được ──
  await dongVai(adm);
  let t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('T9 nằm trước mốc chấm công ERP ⇒ không đủ điều kiện', t.truoc_moc && !t.co_the_chot, 'mốc ' + t.moc_cham_cong);
  await phaiLoi('chốt T9 (trước mốc) bị chặn', () => q('select fn_ta_chot_ky($1::date)', [T9]), 'trước khi có chấm công');
  // Từ đây giả lập hệ thống đã chạy từ 01/09 (dời mốc trong rollback) để test luồng chốt trên một tháng đã qua hạn.
  await q("insert into ta_dot_khai_bu(tu, den, han, ghi_chu) values ('2026-09-01', '2026-09-01', '2026-09-02', 'test: dời mốc')");
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('T9: chưa chốt, đủ điều kiện chốt', !t.da_chot && t.co_the_chot, `chờ duyệt ${t.cho_duyet_ca}+${t.cho_duyet_viec}, quên checkout ${t.quen_checkout}`);
  const live = await q('select nhan_su_id, net from fn_ta_luong_ky($1::date)', [T9]);
  ok('T9 trước khi chốt: đọc tạm tính', live.length > 0 && (await q('select bool_or(da_chot) x from fn_ta_luong_ky($1::date)', [T9]))[0].x === false, live.length + ' TA');
  const lan1 = (await q("select fn_ta_chot_ky($1::date, 'Chốt thử') n", [T9]))[0].n;
  ok('chốt T9 → lần 1', lan1 === 1);
  const snap = await q('select nhan_su_id, net, da_chot, lan from fn_ta_luong_ky($1::date)', [T9]);
  const tong = (rs) => rs.reduce((s, r) => s + Number(r.net), 0);
  ok('bản chốt đủ TA và đúng tổng tạm tính lúc chốt', snap.length === live.length && tong(snap) === tong(live) && snap.every((r) => r.da_chot && r.lan === 1), `${snap.length} TA · ${tong(snap).toLocaleString('vi-VN')}đ`);
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('tình trạng: đã chốt lần 1, tổng khớp', t.da_chot && t.lan === 1 && Number(t.tong_net) === tong(live));
  await phaiLoi('chốt lại khi đang chốt bị chặn', () => q('select fn_ta_chot_ky($1::date)', [T9]), 'đã chốt');

  // ── TA xem phiếu đã chốt của mình, không xem của người khác ──
  await dongVai(ta);
  const cua = await q('select da_chot, net from fn_ta_luong_ky($1::date, $2)', [T9, ta.ns]);
  ok('TA xem phiếu tháng 9 của mình: đọc bản chốt', cua.length === 1 && cua[0].da_chot, cua[0] ? Number(cua[0].net).toLocaleString('vi-VN') + 'đ' : 'không có dòng');
  await phaiLoi('TA không xem lương người khác', () => q('select * from fn_ta_luong_ky($1::date, $2)', [T9, adm.ns]), 'Không có quyền');
  await phaiLoi('TA không xem cả bảng lương', () => q('select * from fn_ta_luong_ky($1::date)', [T9]), 'Không có quyền');

  // ── Khoá kỳ ──
  await dongVai(adm);
  await phaiLoi('kỳ đã chốt: không thêm ca có mặt', () => q("insert into ta_cham_cong(nhan_su_id, ngay, vao_at, ra_at) values ($1, '2026-09-30', '2026-09-30 17:00+07', '2026-09-30 19:00+07')", [ta.ns]), 'đã chốt lương');
  await phaiLoi('kỳ đã chốt: TA khai bù ngày trong tháng cũng bị chặn', async () => { await dongVai(ta); await q("select fn_ta_cham_cong_khai_bu('2026-09-30 17:00+07', '2026-09-30 19:00+07')"); }, '');
  await dongVai(adm);
  await phaiLoi('kỳ đã chốt: không thêm đơn giá hiệu lực lùi về tháng đó', () => q("select fn_ta_dat_don_gia('gia_trong_thi', 60000, '2026-09-01')"), 'đã chốt lương');
  const gMoi = await q("select fn_ta_dat_don_gia('gia_trong_thi', 60000, '2026-09-15') id");
  ok('đơn giá hiệu lực giữa tháng 9 (chỉ ảnh hưởng tháng 10) vẫn thêm được', !!gMoi[0].id);
  await phaiLoi('dòng bản chốt không sửa được', () => q('update ta_luong_ky_dong set net = 0'), 'bất biến');
  await phaiLoi('đầu kỳ chốt không xoá được', () => q('delete from ta_luong_ky'), 'bất biến');
  await phaiLoi('đầu kỳ chốt không sửa tổng được', () => q('update ta_luong_ky set tong_net = 0'), 'bất biến');

  // ── Mở lại kỳ ──
  await phaiLoi('mở lại không lý do bị chặn', () => q("select fn_ta_mo_lai_ky($1::date, '  ')", [T9]), 'lý do');
  await q("select fn_ta_mo_lai_ky($1::date, 'Bổ sung công trông thi 30/9')", [T9]);
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('mở lại: kỳ hết chốt, bản lần 1 vẫn còn trong lịch sử', !t.da_chot && t.lich_su.length === 1 && t.lich_su[0].ly_do_mo_lai === 'Bổ sung công trông thi 30/9');
  ok('mở lại: dòng bản chốt lần 1 vẫn còn', (await q('select count(*)::int n from ta_luong_ky_dong'))[0].n >= snap.length);
  await phaiLoi('mở lại lần nữa khi chưa chốt bị chặn', () => q("select fn_ta_mo_lai_ky($1::date, 'x')", [T9]), 'chưa chốt');
  const caMoi = (await q("insert into ta_cham_cong(nhan_su_id, ngay, vao_at, created_by) values ($1, '2026-09-30', '2026-09-30 17:00+07', $1) returning id", [ta.ns]))[0].id;
  ok('sau khi mở lại: thêm công tháng 9 được', !!caMoi);
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('còn ca chờ duyệt + quên checkout ⇒ không đủ điều kiện chốt', !t.co_the_chot && t.cho_duyet_ca === 1 && t.quen_checkout === 1);
  await phaiLoi('chốt khi còn ca chờ duyệt bị chặn', () => q('select fn_ta_chot_ky($1::date)', [T9]), 'chờ duyệt');
  await q("select fn_ta_chot_gio($1, '2026-09-30 17:00+07', '2026-09-30 19:00+07')", [caMoi]);
  await q("select fn_ta_duyet_cong(array[$1::uuid], '{}', 'da_duyet')", [caMoi]);
  const lan2 = (await q('select fn_ta_chot_ky($1::date) n', [T9]))[0].n;
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T9]))[0].t;
  ok('chốt lại → lần 2, lịch sử giữ cả 2 lần', lan2 === 2 && t.da_chot && t.lan === 2 && t.lich_su.length === 2);

  // ── Tháng 10 chưa hết hạn ──
  t = (await q('select fn_ta_ky_trang_thai($1::date) t', [T10]))[0].t;
  ok('T10: chưa tới hạn chốt (đợt khai lùi tới hết 03/11)', !t.co_the_chot, 'chốt được từ ' + t.mo_chot_tu);
  await phaiLoi('chốt T10 trước hạn bị chặn', () => q('select fn_ta_chot_ky($1::date)', [T10]), 'Chưa hết hạn');
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
