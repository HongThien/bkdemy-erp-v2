// Test LUẬT THỜI GIAN (Thùy 14/10): "TA được phân công vào lớp ngày 12/10 thì dữ liệu phải từ ngày đó, không đẻ
// ra dữ liệu phía trước" + đợt khai lùi tháng 10. Chạy từ GỐC repo: node scripts/luong-ta-t9/test_ngay_phan_cong.mjs
// Kịch bản dựng trong BEGIN … ROLLBACK: lớp L có buổi trước & sau 12/10; TA cũ Y bị rút ngày 12/10, TA mới X được phân
// ngày 12/10 (ghi đúng ngày vào phan_cong_lop_log như khi bấm thật trên ERP). Mọi hàm gọi đúng vai (jwt) như app.
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
  catch (e) { await c.query('rollback to savepoint ' + n); ok(ten, !chua || e.message.includes(chua), e.message.slice(0, 90)); }
};
const dongVai = async (tk) => c.query("select set_config('request.jwt.claims',$1,true)", [JSON.stringify({ sub: tk.id, email: tk.email, role: 'authenticated' })]);
const NGAY_PC = '2026-10-12';

await c.query('begin');
try {
  console.log('   migration chạy trong test:', (await apMigration(c)).join(', ') || '(đã có sẵn trên DB)');
  const adm = (await q("select tk.id, ns.email, ns.id ns, ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id where ns.la_admin_he_thong limit 1"))[0];

  // ── Dữ liệu THẬT: Vân Anh được phân 7S3 ngày 12/10 ──
  const va = (await q(`select l.id lop, ns.id ns from phan_cong_lop pc join lop l on l.id=pc.lop_id join nhan_su ns on ns.id=pc.nhan_su_id
                        where l.ten_lop='7S3' and ns.ho_ten='Trần Thị Vân Anh' and pc.vai_tro='tg'`))[0];
  if (va) {
    const truoc = await q('select * from _ta_tg_tai($1::date, $2)', ['2026-10-11', va.lop]);
    const sau = await q('select * from _ta_tg_tai($1::date, $2)', ['2026-10-12', va.lop]);
    ok('dữ liệu thật: 11/10 Vân Anh CHƯA phụ trách 7S3', !truoc.some(r => r.nhan_su_id === va.ns));
    ok('dữ liệu thật: 12/10 Vân Anh phụ trách 7S3', sau.some(r => r.nhan_su_id === va.ns));
  }

  // ── Dựng kịch bản: lớp L có buổi thường đã diễn ra cả TRƯỚC (01–11/10) và TỪ 12/10 ──
  const L = (await q(`select l.id, l.ten_lop, pc.nhan_su_id y,
        (select min(b.ngay)::text from buoi_hoc b where b.lop_id=l.id and b.loai='thuong' and b.trang_thai<>'huy' and b.ngay between '2026-10-01' and '2026-10-11') d1,
        (select min(b.ngay)::text from buoi_hoc b where b.lop_id=l.id and b.loai='thuong' and b.trang_thai<>'huy' and b.ngay between '2026-10-12' and '2026-10-13') d2
      from lop l join phan_cong_lop pc on pc.lop_id=l.id and pc.vai_tro='tg'
     where (pc.created_at at time zone 'Asia/Ho_Chi_Minh')::date < '2026-10-01'
       and (select count(*) from phan_cong_lop p2 where p2.lop_id=l.id and p2.vai_tro='tg') = 1
     order by l.ten_lop`)).find(r => r.d1 && r.d2);
  if (!L) throw new Error('không tìm được lớp có buổi trước và sau 12/10');
  const Y = (await q("select tk.id, ns.email, ns.id ns, ns.ho_ten from nhan_su ns left join tai_khoan tk on tk.nhan_su_id=ns.id where ns.id=$1 limit 1", [L.y]))[0];
  const X = (await q(`select tk.id, ns.email, ns.id ns, ns.ho_ten from tai_khoan tk join nhan_su ns on ns.id=tk.nhan_su_id
                       where not ns.la_admin_he_thong and not exists (select 1 from phan_cong_lop_log g where g.nhan_su_id=ns.id and g.vai_tro='tg')
                       order by ns.ho_ten limit 1`))[0];
  console.log(`   lớp ${L.ten_lop}: buổi trước ${L.d1}, buổi sau ${L.d2} · TA cũ ${Y.ho_ten} (rút ${NGAY_PC}) · TA mới ${X.ho_ten} (phân ${NGAY_PC})`);
  // bàn giao như bấm trên ERP ngày 12/10: xoá phân công Y, thêm X (trigger ghi log), rồi đặt mốc giờ log = 12/10
  await q("delete from phan_cong_lop where lop_id=$1 and nhan_su_id=$2 and vai_tro='tg'", [L.id, Y.ns]);
  await q("insert into phan_cong_lop(nhan_su_id, lop_id, vai_tro, la_chinh) values ($1,$2,'tg',true)", [X.ns, L.id]);
  await q(`update phan_cong_lop_log set ts = ($3::date + time '09:00')::timestamp at time zone 'Asia/Ho_Chi_Minh'
            where lop_id=$1 and nhan_su_id = any($2::uuid[]) and ts > now() - interval '1 minute'`, [L.id, [X.ns, Y.ns], NGAY_PC]);

  // ── 1. Phân công tại ngày ──
  const tai = async (d) => (await q('select nhan_su_id from _ta_tg_tai($1::date, $2)', [d, L.id])).map(r => r.nhan_su_id);
  ok(`phụ trách ${L.d1} = TA cũ, không có TA mới`, (await tai(L.d1)).join() === Y.ns);
  ok('phụ trách 11/10 = TA cũ (ngày cuối trước khi rút)', (await tai('2026-10-11')).join() === Y.ns);
  ok('phụ trách 12/10 = TA mới (từ đúng ngày phân công)', (await tai(NGAY_PC)).join() === X.ns);

  // ── 2. App TA của X: gợi ý việc ──
  await dongVai(X);
  const goiY = async (d) => (await q("select * from fn_ta_hom_nay(($1::date + time '18:00')::timestamp at time zone 'Asia/Ho_Chi_Minh')", [d])).filter(r => r.lop_id === L.id);
  ok(`gợi ý ngày ${L.d1}: KHÔNG có lớp ${L.ten_lop} (chưa phân công)`, (await goiY(L.d1)).length === 0);
  ok(`gợi ý ngày ${L.d2}: có buổi lớp ${L.ten_lop}`, (await goiY(L.d2)).length > 0);

  // ── 3. Khai lùi tháng 10 ──
  await phaiLoi(`chưa checkin ngày ${L.d1} thì không ghi công được`, () => q("select fn_ta_khai_viec('tro_giang',$1::date,$2)", [L.d1, L.id]), 'Chưa checkin');
  const ca1 = (await q("select fn_ta_cham_cong_khai_bu(($1::date + time '17:00')::timestamp at time zone 'Asia/Ho_Chi_Minh', ($1::date + time '21:30')::timestamp at time zone 'Asia/Ho_Chi_Minh') id", [L.d1]))[0].id;
  ok(`khai lùi checkin/checkout ngày ${L.d1} (đợt tháng 10, quá 24 giờ vẫn được)`, !!ca1);
  await phaiLoi(`ngày ${L.d1} trợ giảng KHÔNG chọn lớp ⇒ bắt chọn (không tự gán lớp phân công sau)`, () => q("select fn_ta_khai_viec('tro_giang',$1::date)", [L.d1]), 'chưa được phân công');
  const v1 = (await q("select fn_ta_khai_viec('tro_giang',$1::date,$2) id", [L.d1, L.id]))[0].id;
  const r1 = (await q('select buoi_hoc_id, nguon, gio_bat_dau, khai_bu from ta_cong_viec where id=$1', [v1]))[0];
  ok(`ngày ${L.d1} chọn lớp ${L.ten_lop} ⇒ ghi được, tự gắn buổi + giờ của buổi`, !!r1.buoi_hoc_id && r1.nguon === 'he_thong' && !!r1.gio_bat_dau && r1.khai_bu, `${r1.nguon} · ${r1.gio_bat_dau} · khai bù ${r1.khai_bu}`);
  await phaiLoi('ghi công trùng buổi bị chặn bằng lời dễ hiểu', () => q("select fn_ta_khai_viec('tro_giang',$1::date,$2)", [L.d1, L.id]), 'đã ghi công rồi');
  await q("select fn_ta_cham_cong_khai_bu(($1::date + time '17:00')::timestamp at time zone 'Asia/Ho_Chi_Minh', ($1::date + time '21:30')::timestamp at time zone 'Asia/Ho_Chi_Minh')", [L.d2]);
  const v2 = (await q("select fn_ta_khai_viec('tro_giang',$1::date) id", [L.d2]))[0].id;
  ok(`ngày ${L.d2} trợ giảng không chọn lớp ⇒ lớp chính TẠI NGÀY ĐÓ = ${L.ten_lop}`, (await q('select lop_id from ta_cong_viec where id=$1', [v2]))[0].lop_id === L.id);

  // ── 4. Màn duyệt: làm hộ ai theo NGÀY ──
  await dongVai(adm);
  const dc = await q('select * from fn_ta_doi_chieu($1::date, $2::date)', [L.d1, L.d2]);
  const d1 = dc.find(r => r.id === v1), d2 = dc.find(r => r.id === v2);
  ok(`việc ${L.d1}: "làm hộ" = TA cũ (${Y.ho_ten})`, d1?.lam_ho === Y.ho_ten, d1?.lam_ho ?? '(trống)');
  ok(`việc ${L.d2}: lớp của mình, không có "làm hộ"`, d2 && d2.lam_ho == null);
  ok('hai việc đều "đã khớp" buổi trên lịch', d1?.khop === true && d2?.khop === true);

  // ── 5. Thiếu công: người phụ trách theo NGÀY ──
  const th = await q("select ngay::text, nguoi_phu_trach from fn_ta_buoi_thieu_cong('2026-10-01'::date, '2026-10-13'::date) where lop_id=$1", [L.id]);
  ok(`buổi ${L.d1}, ${L.d2} đã ghi công ⇒ không còn trong "thiếu công"`, !th.some(r => r.ngay === L.d1 || r.ngay === L.d2));
  const sai = th.filter(r => (r.ngay < NGAY_PC ? Y.ho_ten : X.ho_ten) !== r.nguoi_phu_trach);
  ok(`các buổi còn thiếu của ${L.ten_lop}: trước 12/10 giao TA cũ, từ 12/10 giao TA mới`, sai.length === 0,
     `${th.length} buổi${sai.length ? ' · SAI: ' + sai.map(r => r.ngay + '→' + r.nguoi_phu_trach).join(', ') : ''}`);

  // ── 6. Lương ──
  await q("select fn_ta_duyet_cong(array(select id from ta_cham_cong where nhan_su_id=$1), array[$2::uuid,$3::uuid], 'da_duyet')", [X.ns, v1, v2]);
  const lop = async (ky, ns) => ((await q('select chi_tiet from _ta_luong_tinh($1::date, $2)', [ky, ns]))[0]?.chi_tiet.lop ?? []).find(x => x.lop === L.ten_lop);
  ok('lương T9 của TA mới: KHÔNG có lớp (phân công sau kỳ)', !(await lop('2026-09-01', X.ns)));
  const x10 = await lop('2026-10-01', X.ns);
  const soBuoi = (await q("select count(*)::int n from buoi_hoc where lop_id=$1 and loai='thuong' and trang_thai<>'huy' and ngay between '2026-10-01' and '2026-10-31'", [L.id]))[0].n;
  ok(`lương T10 của TA mới: lớp chủ, TG 2/${soBuoi} (mẫu số = cả tháng — Thùy chọn 4/8)`, x10?.la_chu === true && x10.tg_lam === 2 && x10.so_buoi === soBuoi, JSON.stringify(x10 && { chu: x10.la_chu, tg: x10.tg_lam, so: x10.so_buoi }));
  const y10 = await lop('2026-10-01', Y.ns);
  ok('lương T10 của TA cũ (rút 12/10): vẫn là lớp chủ của kỳ này', y10?.la_chu === true);
  ok('lương T11 của TA cũ: không còn lớp', !(await lop('2026-11-01', Y.ns)));
} catch (e) { fail++; console.log('✘ LỖI NGOÀI DỰ KIẾN:', e.message, e.where ? '\n   ' + e.where.split('\n')[0] : ''); }
await c.query('rollback'); await c.end();
console.log(`\n${pass} đạt · ${fail} hỏng  (đã ROLLBACK — DB không đổi)`);
