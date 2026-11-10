// Test LƯƠNG TA THEO LỚP (mig 202611102253). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_luong_lop.mjs
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
const H = (ky) => `select md5(string_agg(nhan_su_id||':'||net||':'||package_lop||':'||bo_tro_tien, ',' order by nhan_su_id)) h, sum(net) tong from _ta_luong_tinh('${ky}')`;
const t9 = (await q(H('2026-09-01')))[0], t10 = (await q(H('2026-10-01')))[0], t11 = (await q(H('2026-11-01')))[0];
await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  const n = (await q('select count(*)::int n from ta_luong_lop'))[0].n;
  ok('khởi tạo mức cho các lớp', n >= 52, n + ' lớp');
  ok('lương T9 không đổi (vẫn bậc theo sĩ số)', (await q(H('2026-09-01')))[0].h === t9.h);
  const t10b = (await q(H('2026-10-01')))[0];
  ok('lương T10 không đổi khi áp (mức = bậc T10)', t10b.h === t10.h, `${t10.tong} → ${t10b.tong}`);
  const t11b = (await q(H('2026-11-01')))[0];
  console.log('   (T11 tạm tính: ' + t11.tong + ' → ' + t11b.tong + ' — khác nếu sĩ số T11 đổi bậc; giờ cố định theo mức T10)');

  await vai('Đào Xuân Thùy');
  const ds = await q("select * from fn_ta_luong_lop_ds('2026-10-01')");
  const l9a1 = ds.find((r) => r.ten_lop === '9A1');
  ok('danh sách có mức + sĩ số + bậc tham khảo', !!l9a1 && Number(l9a1.muc) === 1400000 && Number(l9a1.bac_si_so) === 1400000, JSON.stringify({ muc: l9a1?.muc, si: l9a1?.si_tb }));

  // đổi mức 9A1 tháng 10 ⇒ lương TA 9A1 đổi
  const ta = (await q(`select n.ho_ten, l.net from _ta_luong_tinh('2026-10-01') l join nhan_su n on n.id=l.nhan_su_id where l.chi_tiet->'lop' @> '[{"lop":"9A1","la_chu":true}]' limit 1`))[0];
  await q("select fn_ta_luong_lop_dat($1, 2000000, '2026-10-15', 'thử')", [l9a1.lop_id]);
  ok('đặt cùng tháng ⇒ sửa dòng cũ, không thêm', (await q("select count(*)::int n from ta_luong_lop where lop_id=$1 and xoa_at is null", [l9a1.lop_id]))[0].n === 1);
  const sau = (await q(`select l.net from _ta_luong_tinh('2026-10-01') l join nhan_su n on n.id=l.nhan_su_id where n.ho_ten=$1`, [ta.ho_ten]))[0];
  ok('mức 9A1 1,4tr → 2tr ⇒ lương T10 của TA 9A1 tăng', Number(sau.net) > Number(ta.net), `${ta.ho_ten}: ${ta.net} → ${sau.net}`);
  ok('sửa có ghi vết', (await q("select count(*)::int n from ta_cong_log where bang='ta_luong_lop' and row_id=$1 and hanh_dong='UPDATE'", [l9a1.muc_id]))[0].n === 1);

  // mức mới từ tháng 11 không ảnh hưởng T10
  await q("select fn_ta_luong_lop_dat($1, 1600000, '2026-11-01')", [l9a1.lop_id]);
  ok('mức từ T11 không đổi T10', (await q(`select l.net from _ta_luong_tinh('2026-10-01') l join nhan_su n on n.id=l.nhan_su_id where n.ho_ten=$1`, [ta.ho_ten]))[0].net === sau.net);
  ok('T11 xem thấy mức mới', Number((await q("select muc from fn_ta_luong_lop_ds('2026-11-01') where ten_lop='9A1'"))[0].muc) === 1600000);

  // xoá mềm mức T10 ⇒ lớp thiếu mức ⇒ 0đ + cờ
  await q("select fn_ta_luong_lop_xoa($1, 'thử xoá')", [l9a1.muc_id]);
  const ct = (await q(`select l.chi_tiet->'lop' ds from _ta_luong_tinh('2026-10-01') l join nhan_su n on n.id=l.nhan_su_id where n.ho_ten=$1`, [ta.ho_ten]))[0].ds;
  const d9 = ct.find((x) => x.lop === '9A1');
  ok('lớp chưa có mức ⇒ 0đ + cờ thieu_muc', d9.thieu_muc === true && Number(d9.tien) === 0, JSON.stringify(d9));
  await phaiLoi('xoá phải có lý do', () => q("select fn_ta_luong_lop_xoa($1, ' ')", [l9a1.muc_id]), 'lý do');
  await phaiLoi('không xoá cứng', () => q('delete from ta_luong_lop where lop_id=$1', [l9a1.lop_id]), 'xoá cứng');
  await phaiLoi('mức âm bị chặn', () => q("select fn_ta_luong_lop_dat($1, -1, '2026-12-01')", [l9a1.lop_id]), '≥ 0');

  // chốt T10 ⇒ khoá + chụp
  await q("select fn_ta_luong_lop_dat($1, 1400000, '2026-10-01', 'đặt lại')", [l9a1.lop_id]);
  await q("savepoint chot"); try { await q("insert into ta_luong_ky (ky, lan, so_ta, tong_net, thong_so) values ('2026-10-01', 1, 0, 0, _ta_thong_so_ky('2026-10-01'))"); } catch (e) { await q("rollback to savepoint chot"); console.log("   (chèn kỳ thử lỗi: " + e.message.slice(0, 90) + ")"); }
  const ky = (await q("select thong_so from ta_luong_ky where ky='2026-10-01'"))[0];
  if (ky) {
    ok('bản chốt chụp mức lương lớp', (ky.thong_so.luong_lop ?? []).length >= 52);
    await phaiLoi('tháng đã chốt ⇒ không sửa mức T10', () => q("select fn_ta_luong_lop_dat($1, 900000, '2026-10-01')", [l9a1.lop_id]), 'đã chốt');
    await q("select fn_ta_luong_lop_dat($1, 900000, '2026-12-01')", [l9a1.lop_id]);
    ok('vẫn đặt được mức từ tháng sau', true);
  }

  await vai('Phong Ngọc Cường');
  await phaiLoi('TA không đặt được mức', () => q("select fn_ta_luong_lop_dat($1, 5000000, '2026-12-01')", [l9a1.lop_id]), 'quyền');
  await phaiLoi('TA không xem được bảng', () => q("select * from fn_ta_luong_lop_ds('2026-10-01')"), 'quyền');
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
