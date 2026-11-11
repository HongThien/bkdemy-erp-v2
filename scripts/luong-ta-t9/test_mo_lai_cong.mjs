// Test MỞ LẠI công đã duyệt + lịch sử + duyệt ca trộn khối (mig 202611111600). Chạy từ GỐC repo:
//   node scripts/luong-ta-t9/test_mo_lai_cong.mjs      — BEGIN … ROLLBACK, DB không đổi.
import pg from 'pg'; import fs from 'fs';
const url = fs.readFileSync('.env', 'utf8').match(/^DATABASE_URL=(.*)$/m)[1].replace(/^['"]|['"]$/g, '');
const c = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
let pass = 0, fail = 0, sp = 0;
const ok = (ten, dk, them = '') => { dk ? pass++ : fail++; console.log((dk ? '✔ ' : '✘ ') + ten + (them ? '  → ' + them : '')); };
const phaiLoi = async (ten, fn, chua) => { const n = 's' + (++sp); await c.query('savepoint ' + n);
  try { await fn(); await c.query('release savepoint ' + n); ok(ten, false, 'KHÔNG bị chặn'); }
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 110)); } };
const vai = async (ten) => { const tk = (await q('select tk.id from tai_khoan tk join nhan_su n on n.id=tk.nhan_su_id where n.ho_ten=$1 limit 1', [ten]))[0]; await q("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })]); };
await c.query('begin');
try {
  const da = (await q("select 1 from _migrations where ten='202611111600_ta_cong_mo_lai_lich_su_va_duyet_ca_tron_khoi.sql'")).length;
  if (!da) await c.query(fs.readFileSync('supabase/migrations/202611111600_ta_cong_mo_lai_lich_su_va_duyet_ca_tron_khoi.sql', 'utf8'));
  const tung = (await q("select id from nhan_su where ho_ten='Tạ Quang Tùng'"))[0].id;
  const ca = (await q("select id from ta_cham_cong where nhan_su_id=$1 and ngay='2026-11-01' and duyet='cho_duyet' limit 1", [tung]))[0]?.id;
  await vai('Tạ Quốc Cường');
  if (ca) {
    const ds = (await q("select fn_ta_cong_duoc_duyet('2026-11-01','2026-11-01') d"))[0].d ?? [];
    ok('Cường thấy ô chọn ca 01/11 của Tùng (ca trộn khối, việc khối 9 đã duyệt)', ds.includes(ca));
    await q("select fn_ta_duyet_cong(array[$1]::uuid[], '{}', 'da_duyet')", [ca]);
    ok('Cường duyệt được ca', (await q('select duyet from ta_cham_cong where id=$1', [ca]))[0].duyet === 'da_duyet');
    await phaiLoi('mở lại phải có lý do', () => q("select fn_ta_duyet_cong(array[$1]::uuid[], '{}', 'cho_duyet', ' ')", [ca]), 'lý do');
    await q("select fn_ta_duyet_cong(array[$1]::uuid[], '{}', 'cho_duyet', 'duyệt nhầm')", [ca]);
    const r = (await q('select duyet, ly_do_duyet from ta_cham_cong where id=$1', [ca]))[0];
    ok('mở lại ⇒ về chờ duyệt, ghi lý do', r.duyet === 'cho_duyet' && r.ly_do_duyet === 'Mở lại: duyệt nhầm', JSON.stringify(r));
    const ls = await q('select * from fn_ta_cong_lich_su($1)', [ca]);
    ok('lịch sử có Khai → Duyệt → Mở lại kèm người', ls.map((x) => x.viec).join('>').includes('Duyệt>Mở lại') && ls.at(-1).nguoi === 'Tạ Quốc Cường', ls.map((x) => `${x.viec}(${x.nguoi}${x.chi_tiet ? ': ' + x.chi_tiet : ''})`).join(' > '));
    const nd = await q("select * from fn_ta_cong_nguoi_duyet('2026-11-01','2026-11-01') where id=$1", [ca]);
    ok('người xử lý gần nhất hiện trên màn', nd[0]?.nguoi === 'Tạ Quốc Cường');
  } else console.log('   (ca 01/11 của Tùng không còn chờ — bỏ phần ca)');
  // việc khối 9 của Tùng: Cường không mở lại được
  const v9 = (await q("select v.id from ta_cong_viec v join lop l on l.id=v.lop_id where v.nhan_su_id=$1 and v.ngay='2026-11-01' and l.ten_lop='9A2'", [tung]))[0]?.id;
  if (v9) await phaiLoi('Cường không mở lại được việc khối 9', () => q("select fn_ta_duyet_cong('{}', array[$1]::uuid[], 'cho_duyet', 'x')", [v9]), 'ngoài phạm vi');
  // việc khối 7 đã duyệt: Cường mở lại được, TA sửa được rồi duyệt lại
  const v7 = (await q("select v.id from ta_cong_viec v join lop l on l.id=v.lop_id where v.nhan_su_id=$1 and v.ngay='2026-11-01' and l.ten_lop='7B1'", [tung]))[0]?.id;
  if (v7) {
    await q("select fn_ta_duyet_cong('{}', array[$1]::uuid[], 'cho_duyet', 'kiểm lại giờ')", [v7]);
    ok('Cường mở lại việc khối 7 đã duyệt', (await q('select trang_thai from ta_cong_viec where id=$1', [v7]))[0].trang_thai === 'cho_duyet');
    await q("select fn_ta_duyet_cong('{}', array[$1]::uuid[], 'da_duyet')", [v7]);
    ok('duyệt lại được', (await q('select trang_thai from ta_cong_viec where id=$1', [v7]))[0].trang_thai === 'da_duyet');
  }
  await vai('Phong Ngọc Cường');
  await phaiLoi('TA thường không xem được lịch sử', () => q('select * from fn_ta_cong_lich_su($1)', [v7 ?? ca]), 'quyền');
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
