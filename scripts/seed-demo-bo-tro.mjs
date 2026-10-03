// DEMO training bổ trợ (Thùy 03/10): 2 ca yếu · 2 ca bù · 2 ca đuổi cho HS TEST, TA đứng ca = Đào Xuân Thùy.
// 2 ca trực 14:00–16:00 hôm nay (Toán, khối trống = mọi khối), mỗi ca 3 em = 1 yếu + 1 bù + 1 đuổi (đv 1+4+4 ≤ 12).
// Đi ĐÚNG đường app: fn_ca_bo_tro_tao + fn_ca_bo_tro_xep, chạy dưới JWT của Thùy. Mọi dòng tự tạo gắn nhãn DEMO.
// Chạy: node scripts/seed-demo-bo-tro.mjs [--dry]   (--dry = rollback cuối, chỉ in kết quả)
import pg from 'pg'; process.loadEnvFile('.env');
const DRY = process.argv.includes('--dry');
const NHAN = 'DEMO training bổ trợ 03/10';
const THUY_NS = '626427c3-d82d-468d-9f47-eb29d1981ee5', THUY_TK = '1a531947-5174-449b-9191-615ef6adb4a1';
const HS = {
  t03: 'ad34a582-2ab8-4641-9959-9176eb59c015|3a9ab80e-99f7-4533-8958-88e61df22d55', // lớp|hs
  t04: '93b71483-0a47-4e5b-8b0d-c7aa68815959|bc490676-90da-46bd-b093-9ccc89633f45',
  t05: '3721bf45-6c2f-4572-a2f3-7e4dfecc0845|7acf9876-f462-4c09-9c13-703859fa5cfe',
  t06: '8030bf93-cddc-4f7e-aa4d-95200e193ebc|da5b90d1-837f-45fa-b9b1-3eb757739456',
  t07: '8030bf93-cddc-4f7e-aa4d-95200e193ebc|3a20d0ce-4647-43f4-a7e5-d001b3597fb7',
  t08: 'f71c0563-365e-4201-a6f2-b0a1636497f7|de1e5b8f-4028-4ce8-ae98-aedb37fd65d0',
}
const lop = (k) => HS[k].split('|')[0], hs = (k) => HS[k].split('|')[1];
// dạng đều có ≥40 câu trắc nghiệm kho chuẩn (đo 03/10)
const YEU = { t04: ['T107010201', 'T107020302', 'T107010403'], t05: ['T108030101', 'T108020101', 'T108010303'] };
const DUOI = { t03: ['T106020201', 'T106020202', 'T106030302'], t08: ['T110010202', 'T110010201', 'T110010102'] };

const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
try {
  await c.query('begin');
  await q(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: THUY_TK, email: 'daothuybk@gmail.com', role: 'authenticated' })]);
  const [{ hom_nay }] = await q(`select public._btyeu_today()::text as hom_nay`);
  if ((await q(`select 1 from bo_tro_yeu where ly_do = $1 union all select 1 from bo_tro_duoi where ly_do = $1`, [NHAN])).length)
    throw new Error('Đã có dữ liệu DEMO — không tạo lần 2.');

  // ── BÙ: 1 buổi thường đã qua (TEST · Toán 9, 01/10) mà Test 06 + Test 07 vắng ⇒ 2 lần nghỉ cần bù
  const [{ id: buoiNghi }] = await q(`insert into buoi_hoc (loai, lop_id, ngay, thu, gio_bat_dau, gio_ket_thuc, trang_thai, mo_ta, created_by,
      ingame_dong_at, et_dong_at, danh_gia_xong_at, btvn_dong_at)
    values ('thuong', $1, '2026-10-01', public._thu_cua_ngay('2026-10-01'), '18:00', '19:30', 'hoan_tat', $2, $3, now(), now(), now(), now()) returning id`,
    [lop('t06'), NHAN, THUY_TK]);
  const nghi = {}
  for (const k of ['t06', 't07'])
    nghi[k] = (await q(`insert into buoi_hoc_hs (buoi_hoc_id, hoc_sinh_id, diem_danh) values ($1, $2, 'vang') returning id`, [buoiNghi, hs(k)]))[0].id;

  // ── YẾU: mở cờ L1 (như bước Duyệt) + case dang_xu + 3 dạng (như bước Nội dung)
  const caseYeu = {}
  for (const k of ['t04', 't05']) {
    await q(`insert into hs_level (hoc_sinh_id, mon, loai, level) values ($1, 'Toán', 'kien_thuc', 1)
             on conflict (hoc_sinh_id, mon, loai) do update set level = 1, updated_at = now()`, [hs(k)]);
    await q(`insert into hs_level_log (hoc_sinh_id, mon, loai, level_cu, level_chot, ly_do_nguoi, actor) values ($1, 'Toán', 'kien_thuc', null, 1, $2, $3)`, [hs(k), NHAN, THUY_TK]);
    const [{ id }] = await q(`insert into bo_tro_yeu (hoc_sinh_id, lop_id, mon, nguon, ly_do, muc, uu_tien, actor) values ($1, $2, 'Toán', 'thu_cong', $3, 1, 2, $4) returning id`,
      [hs(k), lop(k), NHAN, THUY_TK]);
    caseYeu[k] = id;
    for (const d of YEU[k]) await q(`insert into bo_tro_yeu_dang (bo_tro_yeu_id, ma_dang, nguon) values ($1, $2, 'tay')`, [id, d]);
  }

  // ── ĐUỔI: đợt đuổi đã duyệt dạng, dự kiến 3 buổi
  const dotDuoi = {}
  for (const k of ['t03', 't08']) {
    const [{ id }] = await q(`insert into bo_tro_duoi (hoc_sinh_id, lop_id, nguon, ly_do, trang_thai, actor, so_buoi_du_kien, dang_duyet_at, dang_duyet_boi)
      values ($1, $2, 'thu_cong', $3, 'can_duoi', $4, 3, now(), $5) returning id`, [hs(k), lop(k), NHAN, THUY_TK, THUY_NS]);
    dotDuoi[k] = id;
    for (const d of DUOI[k]) await q(`insert into bo_tro_duoi_dang (bo_tro_duoi_id, ma_dang) values ($1, $2)`, [id, d]);
  }

  // ── 2 ca trực 14:00–16:00 hôm nay, Thùy đứng ca; mỗi ca 1 yếu + 1 bù + 1 đuổi
  const out = []
  for (const [yeu, bu, duoi] of [['t04', 't06', 't03'], ['t05', 't07', 't08']]) {
    const [{ ca }] = await q(`select public.fn_ca_bo_tro_tao($1::date, '14:00', '16:00', 'Toán', '', null, 1, $2, null) as ca`, [hom_nay, THUY_NS]);
    for (const [loai, k, ref] of [['yeu', yeu, caseYeu[yeu]], ['bu', bu, nghi[bu]], ['duoi', duoi, dotDuoi[duoi]]]) {
      const [{ r }] = await q(`select public.fn_ca_bo_tro_xep($1, $2, $3, $4) as r`, [ca, loai, hs(k), ref]);
      out.push({ ca: ca.slice(0, 8), loai, hs: k, ...r });
    }
  }
  console.table(out);

  // ── tự kiểm: app TA của Thùy + app HS có hiện đúng các ca không
  const [{ tk }] = await q(`select public.fn_bo_tro_tu_kiem($1::date, $1::date) as tk`, [hom_nay]);
  const mine = (tk.ca ?? tk).filter?.((x) => out.some((o) => o.buoi_hoc_id === x.buoi_id)) ?? tk;
  console.log('Tự kiểm:', JSON.stringify(mine, null, 1));

  await c.query(DRY ? 'rollback' : 'commit');
  console.log(DRY ? '— DRY: đã rollback —' : '✔ ĐÃ GHI');
} catch (e) { await c.query('rollback'); console.error('✗', e.message); process.exitCode = 1 }
await c.end();
