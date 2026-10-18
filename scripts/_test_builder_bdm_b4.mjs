// Test bước 4 builder bản đồ mới (gán lớp + ôn tập): áp mig 202610180021 + kiểm trong MỘT transaction rồi ROLLBACK.
// Chạy: node scripts/_test_builder_bdm_b4.mjs
import pg from 'pg'
import fs from 'fs'

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l))
  .map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const MIG = 'supabase/migrations/202610180021_builder_ban_do_moi_gan_lop.sql'
const c = new pg.Client({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
await c.connect()

let ok = 0, fail = 0
const kiem = (ten, dk, chiTiet = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { fail++; console.log('  ✘', ten, chiTiet) } }
const q = async (sql, args) => (await c.query(sql, args)).rows
const loiKhi = async (sql, args) => {
  await c.query('savepoint s')
  try { await c.query(sql, args); await c.query('release savepoint s'); return null }
  catch (e) { await c.query('rollback to savepoint s'); return e.message }
}

try {
  await c.query('begin')
  await c.query(fs.readFileSync(MIG, 'utf8'))
  console.log('✔ migration áp được (trong transaction)')
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])

  // Giáo trình gốc K7: buổi 1 = nhóm A + B, buổi 2 = nhóm C + A (A trùng ⇒ không là ứng viên ôn tập của buổi 2)
  const [{ cay }] = await q(`select fn_tl_bdm_cay_chon('7') cay`)
  const nhoms = cay.chu_de.flatMap((cd) => cd.chuyen_de.flatMap((ch) => ch.nhom)).filter((n) => n.dang_bai.some((d) => d.so_cau >= 6))
  const [A, B, C] = nhoms
  const chon = (n) => ({ nhom: n.id, dang_bai: n.dang_bai.map((d) => d.id) })
  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh', '[TEST] b4', '7', 'Toán', 'moi') returning id`)
  const [b1] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tl.id])
  const [b2] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 1, 'buoi', 'Buổi 2') returning id`, [tl.id])
  await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb)`, [tl.id, b1.id, JSON.stringify([chon(A), chon(B)])])
  const [{ nd2 }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd2`, [tl.id, b2.id, JSON.stringify([chon(C), chon(A)])])

  // ── Ứng viên ôn tập buổi 2 = B (A đã có lại ở buổi 2) ──
  const [{ uv }] = await q(`select fn_tl_bdm_on_tap_ung_vien($1, $2) uv`, [tl.id, b2.id])
  kiem(`ứng viên ôn tập buổi 2 = [B] (${uv.map((x) => x.ten).join(', ')})`, uv.length === 1 && uv[0].nhom === B.id && uv[0].buoi === 'Buổi 1')
  const [{ uv1 }] = await q(`select fn_tl_bdm_on_tap_ung_vien($1, $2) uv1`, [tl.id, b1.id])
  kiem('buổi đầu không có ứng viên', uv1.length === 0)

  // ── Gán buổi 2 cho lớp: GT ──
  const [lop] = await q(`select id from lop limit 1`)
  const taoDoc = async (loai, ngay = '2099-01-01') => (await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay, nguon_id, nguon_buoi)
      values ($1, '[TEST] doc', '7', 'Toán', 'moi', $2, $5, $3, $4) returning id`, [loai, lop.id, tl.id, b2.id, ngay]))[0]
  const gt = await taoDoc('giao_trinh_buoi')
  await q(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'Buổi 7')`, [tl.id, b2.id, gt.id])
  const [{ ndg }] = await q(`select fn_tl_bdm_noi_dung($1) ndg`, [gt.id])
  const bg = ndg.buoi[0]
  kiem('GT lớp: tiêu đề = số buổi của lớp', ndg.buoi.length === 1 && bg.tieu_de === 'Buổi 7')
  const goc = nd2.buoi[0]
  kiem('GT lớp: nhóm + dạng bài + câu luyện y hệt buổi gốc', JSON.stringify(bg.nhom.map((n) => [n.id, n.dang_bai.map((d) => [d.id, d.caus])]))
    === JSON.stringify(goc.nhom.map((n) => [n.id, n.dang_bai.map((d) => [d.id, d.caus])])))
  kiem('GT lớp: KHÔNG có BTVN', bg.nhom.every((n) => !n.btvn))
  const [{ n: cuGt }] = await q(`select count(*)::int n from tai_lieu_phan where tai_lieu_id = $1 and cha_id is null and loai_phan <> 'buoi'`, [gt.id])
  kiem('GT lớp: mọi phần (trừ mốc buổi) có cha', cuGt === 0)

  // ── BTVN + ôn tập ──
  const bt = await taoDoc('btvn')
  const daCo = goc.nhom.flatMap((n) => n.btvn?.caus ?? [])
  const [{ goiy }] = await q(`select fn_tl_bdm_goi_y($1, null, '{"_tong":2}'::jsonb, $2) goiy`, [B.id, daCo])
  await q(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'btvn', 'Buổi 7', $4::jsonb)`, [tl.id, b2.id, bt.id, JSON.stringify([{ nhom: B.id, caus: goiy }])])
  const [{ ndb }] = await q(`select fn_tl_bdm_noi_dung($1) ndb`, [bt.id])
  const bb = ndb.buoi[0]
  kiem('BTVN lớp: BTVN từng nhóm y hệt gốc', JSON.stringify(bb.nhom.map((n) => [n.id, n.btvn?.caus])) === JSON.stringify(goc.nhom.map((n) => [n.id, n.btvn?.caus])))
  kiem('BTVN lớp: không có câu luyện', bb.nhom.every((n) => n.dang_bai.length === 0 && !n.chua_phan))
  kiem(`BTVN lớp: khối ôn tập nhóm B, ${goiy.length} câu`, bb.on_tap.length === 1 && bb.on_tap[0].id === B.id && bb.on_tap[0].caus.join() === goiy.join() && goiy.length === 2)
  const tatCa = [...bb.nhom.flatMap((n) => n.btvn?.caus ?? []), ...bb.on_tap.flatMap((o) => o.caus)]
  kiem('phiếu BTVN không trùng câu', new Set(tatCa).size === tatCa.length)
  // Bên dùng chung đọc phiếu như cũ (getBTVNCaus = btvn + btvn_nhom + ontap + ontap_nhom theo thứ tự)
  const [{ n: soCauPhieu }] = await q(`select count(*)::int n from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1`, [bt.id])
  kiem('đếm câu phiếu = BTVN + ôn tập', soCauPhieu === tatCa.length)

  // ── Chặn sai ──
  let e = await loiKhi(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'x')`, [tl.id, b2.id, gt.id])
  kiem('chép vào tài liệu đã có nội dung bị chặn', e && e.includes('đã có nội dung'), e)
  const bt2 = await taoDoc('btvn', '2099-01-02')
  e = await loiKhi(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'x')`, [tl.id, b2.id, bt2.id])
  kiem('loại không khớp (gt vào doc btvn) bị chặn', e && e.includes('không khớp'), e)
  e = await loiKhi(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'btvn', 'x', $4::jsonb)`, [tl.id, b2.id, bt2.id, JSON.stringify([{ nhom: B.id, caus: [daCo[0]] }])])
  kiem('câu ôn tập trùng câu BTVN bị chặn', e && e.includes('trùng'), e)
  e = await loiKhi(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'x')`, [tl.id, b1.id, gt.id])
  kiem('buổi nguồn khác nguon_buoi của doc bị chặn', e && e.includes('không khớp'), e)
  await q("select set_config('request.jwt.claims', '{}', true)")
  e = await loiKhi(`select fn_tl_bdm_on_tap_ung_vien($1, $2)`, [tl.id, b2.id])
  kiem('không phải thành viên ⇒ từ chối', e && e.includes('Chỉ nhân sự'), e)

  const quyen = await q(`select p.proname, has_function_privilege('anon', p.oid, 'execute') anon, has_function_privilege('authenticated', p.oid, 'execute') auth
                           from pg_proc p where p.proname in ('fn_tl_bdm_on_tap_ung_vien', 'fn_tl_bdm_trich_buoi', 'fn_tl_bdm_noi_dung')`)
  kiem('anon không gọi được 3 hàm, authenticated gọi được', quyen.length === 3 && quyen.every((r) => !r.anon && r.auth), JSON.stringify(quyen))
} catch (err) {
  fail++
  console.log('✘ LỖI:', err.message, err.where ?? '')
} finally {
  await c.query('rollback')
  await c.end()
  console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi`)
  process.exit(fail ? 1 : 0)
}
