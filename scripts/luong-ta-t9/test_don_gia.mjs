// Test SỬA / XOÁ ĐƠN GIÁ + CHỤP THÔNG SỐ khi chốt (mig 202611041646). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_don_gia.mjs
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
const truoc = (await q(LUONG))[0].h;
await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  ok('lương T10 không đổi sau khi áp (chưa sửa giá nào)', (await q(LUONG))[0].h === truoc);
  await vai('Đào Xuân Thùy');
  const ds = await q('select * from fn_ta_don_gia_ds()');
  ok('bảng đơn giá có id + cờ khoá', ds.length > 0 && ds[0].id, ds.length + ' dòng');
  const g = ds.find((r) => r.ma === 'gia_cham_thi');
  await q('select fn_ta_sua_don_gia($1, 60000, null, null, $2)', [g.id, 'sửa thử']);
  ok('sửa giá chấm thi 50k → 60k', Number((await q('select gia_tri from ta_don_gia where id=$1', [g.id]))[0].gia_tri) === 60000);
  ok('sửa có ghi vết cũ/mới', (await q("select count(*)::int n from ta_cong_log where bang='ta_don_gia' and row_id=$1 and hanh_dong='UPDATE'", [g.id]))[0].n === 1);
  await phaiLoi('không đổi mã của dòng', () => q("update ta_don_gia set ma='gia_khac' where id=$1", [g.id]), 'mã');
  await phaiLoi('xoá phải có lý do', () => q("select fn_ta_xoa_don_gia($1, '  ')", [g.id]), 'lý do');
  await q("select fn_ta_xoa_don_gia($1, 'thử xoá')", [g.id]);
  ok('xoá mềm: dòng ẩn khỏi bảng đơn giá', !(await q('select * from fn_ta_don_gia_ds()')).some((r) => r.id === g.id));
  ok('xoá mềm: dòng vẫn còn trong DB', (await q('select count(*)::int n from ta_don_gia where id=$1 and xoa_at is not null', [g.id]))[0].n === 1);
  await phaiLoi('xoá cứng bị chặn', () => q('delete from ta_don_gia where id=$1', [g.id]), 'xoá cứng');
  await phaiLoi('dòng đã xoá không sửa được', () => q('select fn_ta_sua_don_gia($1, 1, null)', [g.id]), 'đã xoá');
  // Giả lập tháng 10 ĐÃ CHỐT ⇒ dòng hiệu lực ≤ 01/10 bị khoá
  await q("insert into ta_luong_ky (ky, lan, so_ta, tong_net, thong_so) values ('2026-10-01', 1, 0, 0, public._ta_thong_so_ky('2026-10-01'))");
  const bac = (await q("select id from ta_don_gia where ma='bac_luong' and si_tu=9 and xoa_at is null"))[0].id;
  await phaiLoi('kỳ đã chốt: không sửa giá đang dùng cho tháng đó', () => q('select fn_ta_sua_don_gia($1, 1300000, null)', [bac]), 'đã chốt');
  await phaiLoi('kỳ đã chốt: không xoá giá đang dùng cho tháng đó', () => q("select fn_ta_xoa_don_gia($1, 'x')", [bac]), 'đã chốt');
  const ts = (await q("select fn_ta_ky_thong_so('2026-10-01') t"))[0].t;
  ok('bản chốt chụp đủ thông số (đơn giá + loại việc)', ts.don_gia.length >= 10 && ts.loai_viec.length >= 10 && ts.don_gia.some((d) => d.ma === 'bac_luong' && d.si_tu === 9 && Number(d.gia_tri) === 1200000), `${ts.don_gia.length} đơn giá · ${ts.loai_viec.length} loại việc`);
  await phaiLoi('thông số của bản chốt không sửa được', () => q("update ta_luong_ky set thong_so='{}' where ky='2026-10-01'"), 'bất biến');
  // Thêm giá mới hiệu lực SAU tháng đã chốt vẫn được; tháng đã chốt giữ thông số cũ
  const moi = (await q("select fn_ta_dat_don_gia('bac_luong', 1300000, '2026-11-01', null, 9, 12, 'tăng thử') id"))[0].id;
  ok('thêm giá mới hiệu lực từ tháng sau vẫn được', !!moi);
  ok('bản chốt tháng 10 vẫn giữ 1.200.000 cho bậc 9–12', (await q("select fn_ta_ky_thong_so('2026-10-01') t"))[0].t.don_gia.find((d) => d.ma === 'bac_luong' && d.si_tu === 9).gia_tri == 1200000);
  await q('select fn_ta_sua_don_gia($1, 1350000, null)', [moi]);
  ok('giá hiệu lực tháng chưa chốt sửa được', Number((await q('select gia_tri from ta_don_gia where id=$1', [moi]))[0].gia_tri) === 1350000);
  await vai('Phong Ngọc Cường');
  await phaiLoi('TA không sửa được đơn giá', () => q('select fn_ta_sua_don_gia($1, 1, null)', [moi]), 'quyền');
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
