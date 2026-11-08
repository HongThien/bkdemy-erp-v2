// Test GIÁO TRÌNH Hình giải tích theo bản đồ mới (Thùy 27/10 "giáo trình mới chỉ có Đại, còn Giải tích và Hình"):
// tạo giáo trình nhanh hinh_gt → đặt buổi bằng nhóm HGT → gán lớp (GT + BTVN) → đọc lại tài liệu lớp. MỘT transaction rồi ROLLBACK.
//   node scripts/_test_gt_hgt_bdm.mjs [khoi=10]
import pg from 'pg'
import fs from 'fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const KHOI = process.argv[2] ?? '10'
let ok = 0, fail = 0
const kiem = (ten, dk, chiTiet = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { fail++; console.log('  ✘', ten, chiTiet) } }
const q = async (sql, args) => (await c.query(sql, args)).rows
try {
  await c.query('begin')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])
  const [{ cay }] = await q(`select fn_tl_bdm_cay_chon($1, 'hgt') cay`, [KHOI])
  const nhoms = cay.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom)).filter((n) => n.dang_bai.some((d) => d.so_cau >= 4))
  kiem(`cây chọn HGT K${KHOI} có nhóm đủ câu (${nhoms.length})`, nhoms.length >= 2)
  const [A, B] = nhoms
  const chon = (n) => ({ nhom: n.id, dang_bai: n.dang_bai.filter((d) => d.so_cau > 0).map((d) => d.id) })
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('giao_trinh', '[TEST] GT HGT', $1, 'Toán', 'hinh_gt', 'moi') returning id`, [KHOI])
  const [b1] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tl.id])
  const [{ nd }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd`, [tl.id, b1.id, JSON.stringify([chon(A), chon(B)])])
  const goc = nd.buoi[0]
  const cauLuyen = goc.nhom.flatMap((n) => n.dang_bai.flatMap((d) => d.caus))
  const cauBtvn = goc.nhom.flatMap((n) => n.btvn?.caus ?? [])
  kiem(`đặt buổi: 2 nhóm, ${cauLuyen.length} câu luyện, ${cauBtvn.length} câu BTVN`, goc.nhom.length === 2 && cauLuyen.length > 0 && cauBtvn.length > 0)
  const ngoai = await q(`select x from unnest($1::text[]) x where not exists (select 1 from hgt_cau_hoi h where h.ma_cau = x)`, [[...cauLuyen, ...cauBtvn]])
  kiem('mọi câu gợi ý là câu kho HGT (hgt_cau_hoi) — tài liệu lớp nhánh hinh_gt đọc được', ngoai.length === 0, ngoai.map((r) => r.x).join(','))

  const [lop] = await q(`select id from lop limit 1`)
  const taoDoc = async (loai) => (await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do, lop_id, ngay, nguon_id, nguon_buoi)
      values ($1, '[TEST] doc', $2, 'Toán', 'hinh_gt', 'moi', $3, '2099-01-01', $4, $5) returning id`, [loai, KHOI, lop.id, tl.id, b1.id]))[0]
  const gt = await taoDoc('giao_trinh_buoi')
  await q(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'Buổi 3')`, [tl.id, b1.id, gt.id])
  const [{ ndg }] = await q(`select fn_tl_bdm_noi_dung($1) ndg`, [gt.id])
  kiem('GT lớp: nhóm + dạng bài + câu luyện y hệt gốc', JSON.stringify(ndg.buoi[0].nhom.map((n) => n.dang_bai.map((d) => d.caus)))
    === JSON.stringify(goc.nhom.map((n) => n.dang_bai.map((d) => d.caus))))
  const bt = await taoDoc('btvn')
  await q(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'btvn', 'Buổi 3', '[]'::jsonb)`, [tl.id, b1.id, bt.id])
  const [{ ndb }] = await q(`select fn_tl_bdm_noi_dung($1) ndb`, [bt.id])
  kiem('BTVN lớp: BTVN từng nhóm y hệt gốc', JSON.stringify(ndb.buoi[0].nhom.map((n) => n.btvn?.caus)) === JSON.stringify(goc.nhom.map((n) => n.btvn?.caus)))
  const [{ uv }] = await q(`select fn_tl_bdm_on_tap_ung_vien($1, $2) uv`, [tl.id, b1.id])
  kiem('ứng viên ôn tập buổi đầu = rỗng (hàm chạy với HGT)', Array.isArray(uv) && uv.length === 0)
} catch (err) { fail++; console.log('✘ LỖI:', err.message, err.where ?? '') }
finally { await c.query('rollback'); await c.end(); console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi`); process.exit(fail ? 1 : 0) }
