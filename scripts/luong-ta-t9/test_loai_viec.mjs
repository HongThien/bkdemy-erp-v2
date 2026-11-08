// Test LOẠI VIỆC & CƠ CHẾ sửa trên màn (mig 202611042237). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_loai_viec.mjs
// Mọi thứ trong BEGIN … ROLLBACK trên DB thật — DB không đổi.
import pg from 'pg'; import fs from 'fs';
import { pathToFileURL } from 'url';
const { apMigration } = await import(pathToFileURL('scripts/luong-ta-t9/_mig.mjs').href);
const env = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: env, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => {
  const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 110)); }
};
const vai = async (ho_ten) => { const tk = (await q('select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.ho_ten=$1 limit 1', [ho_ten]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };
const LUONG = `select md5(string_agg(nhan_su_id||':'||net, ',' order by nhan_su_id)) h from _ta_luong_tinh('2026-10-01')`;
const NET = (ten) => q(`select l.net from _ta_luong_tinh('2026-10-01') l join nhan_su n on n.id=l.nhan_su_id where n.ho_ten=$1`, [ten]).then((r) => Number(r[0]?.net ?? 0));
const truoc = (await q(LUONG))[0].h;
await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  ok('lương T10 không đổi sau khi áp', (await q(LUONG))[0].h === truoc);
  await vai('Đào Xuân Thùy');
  const ds = await q('select * from fn_ta_loai_viec_ds()');
  ok('danh sách 13 loại, có cơ chế + giá', ds.length === 13, ds.map((r) => `${r.ma}:${r.co_che}:${r.gia_tri ?? '-'}`).join(' '));
  ok('Họp chưa có giá', ds.find((r) => r.ma === 'hop').gia_tri === null);
  ok('trợ giảng = đặc thù', ds.find((r) => r.ma === 'tro_giang').dac_thu === true);

  // thêm loại mới
  const ma = (await q("select fn_ta_loai_viec_luu(null, 'Soạn đề mục tiêu', 'ngoai', 'gio', true, false, 'làm/rà soát đề MT', 60000, '2026-10-01') ma"))[0].ma;
  ok('thêm loại mới ⇒ mã tự cấp từ tên', ma === 'soan_de_muc_tieu', ma);
  const g = (await q("select gia_tri, don_vi from ta_don_gia where ma = 'gia_' || $1", [ma]))[0];
  ok('kèm giá 60.000 đ/giờ', Number(g?.gia_tri) === 60000 && g.don_vi === 'đ/giờ', JSON.stringify(g));
  const ma2 = (await q("select fn_ta_loai_viec_luu(null, 'Soạn đề mục tiêu', 'bo_tro', 'gio', false, false) ma"))[0].ma;
  ok('trùng tên ⇒ mã thêm hậu tố', ma2 === 'soan_de_muc_tieu_2', ma2);
  ok('thêm có ghi vết', (await q("select count(*)::int n from ta_cong_log l join ta_loai_viec v on v.id=l.row_id where l.bang='ta_loai_viec' and v.ma=$1", [ma]))[0].n >= 1);

  // giá Họp ⇒ lương người có việc Họp
  const nguoiHop = (await q("select n.ho_ten, v.gio_bat_dau, v.gio_ket_thuc, v.trang_thai from ta_cong_viec v join nhan_su n on n.id=v.nhan_su_id where v.loai_viec='hop'"))[0];
  const net0 = await NET(nguoiHop.ho_ten);
  await q("select fn_ta_loai_viec_luu('hop', 'Họp', 'ngoai', 'gio', false, false, '', 40000, '2026-10-01')");
  const net1 = await NET(nguoiHop.ho_ten);
  ok('đặt giá Họp 40k/giờ ⇒ lương tháng 10 tính theo', net1 >= net0, `${nguoiHop.ho_ten} ${nguoiHop.trang_thai} ${nguoiHop.gio_bat_dau}-${nguoiHop.gio_ket_thuc}: ${net0} → ${net1}`);

  // đổi cơ chế: ôn thi ngoài → bổ trợ → ngoài
  await q("select fn_ta_loai_viec_luu('bo_tro_on_thi', 'Bổ trợ ôn thi (phát sinh)', 'bo_tro', 'gio', false, false)");
  const lv = (await q("select nhom, tinh_vao, don_vi from ta_loai_viec where ma='bo_tro_on_thi'"))[0];
  ok('đổi ôn thi sang cơ chế Bổ trợ', lv.nhom === 'package' && lv.tinh_vao === 'bo_tro', JSON.stringify(lv));
  ok('lương T10 đổi theo cơ chế mới (tháng chưa chốt)', (await q(LUONG))[0].h !== truoc);
  await q("select fn_ta_loai_viec_luu('bo_tro_on_thi', 'Bổ trợ ôn thi (phát sinh)', 'ngoai', 'gio', false, false)");

  // chặn
  await phaiLoi('không đổi cơ chế trợ giảng', () => q("update ta_loai_viec set tinh_vao='bo_tro', nhom='package', don_vi='gio' where ma='tro_giang'"), 'đặc thù');
  await phaiLoi('không đổi cơ chế trông thi', () => q("update ta_loai_viec set tinh_vao='khac' where ma='trong_thi'"), 'đặc thù');
  await q("select fn_ta_loai_viec_luu('trong_thi', 'Trông thi', 'bo_tro', 'gio', true, false)");
  ok('RPC với loại đặc thù: giữ cơ chế', (await q("select tinh_vao from ta_loai_viec where ma='trong_thi'"))[0].tinh_vao === 'trong_thi');
  await phaiLoi('không đổi mã gốc', () => q("update ta_loai_viec set ma='hop2' where ma='hop'"), 'mã gốc');
  await phaiLoi('không xoá cứng', () => q('delete from ta_loai_viec where ma=$1', [ma2]), 'Ngừng dùng');
  await phaiLoi('không bật lại Việc khác', () => q("select fn_ta_loai_viec_dung('khac', true)"), 'Việc khác');
  await phaiLoi('giá cho loại bổ trợ bị chặn', () => q("select fn_ta_loai_viec_luu('bo_tro_bu', 'Bổ trợ bù', 'bo_tro', 'gio', true, true, '', 1000, '2026-10-01')"), 'ngoài package');
  await phaiLoi('tên trống bị chặn', () => q("select fn_ta_loai_viec_luu('hop', '  ', 'ngoai', 'gio', false, false)"), 'trống');
  await q('select fn_ta_loai_viec_dung($1, false)', [ma2]);
  ok('ngừng dùng', (await q('select active from ta_loai_viec where ma=$1', [ma2]))[0].active === false);

  // phía TA
  await vai('Phong Ngọc Cường');
  await phaiLoi('TA không sửa được loại việc', () => q("select fn_ta_loai_viec_dung('hop', false)"), 'quyền');
  await phaiLoi('TA không khai được loại đã ngừng', () => q("select fn_ta_khai_viec($1, (now() at time zone 'Asia/Ho_Chi_Minh')::date, null, null, null, '07:00', '07:30', null, 'x')", [ma2]));
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
