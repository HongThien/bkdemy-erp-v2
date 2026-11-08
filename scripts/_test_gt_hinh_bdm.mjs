// Test GIÁO TRÌNH HÌNH bản đồ mới (mig 202610271757): áp mig + kiểm trong MỘT transaction rồi ROLLBACK.
//   node scripts/_test_gt_hinh_bdm.mjs [khoi=7] [--da-ap]   (--da-ap: không áp lại file mig, kiểm trên DB đã áp)
import pg from 'pg'
import fs from 'fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const MIG = 'supabase/migrations/202610271757_giao_trinh_hinh_bdm.sql'
const KHOI = process.argv.find((a) => /^\d+T?$/.test(a)) ?? '7'
const c = new pg.Client({ connectionString: url }); await c.connect()
let ok = 0, fail = 0
const kiem = (ten, dk, chiTiet = '') => { if (dk) { ok++; console.log('  ✔', ten) } else { fail++; console.log('  ✘', ten, chiTiet) } }
const q = async (sql, args) => (await c.query(sql, args)).rows
const loiKhi = async (sql, args) => { await c.query('savepoint s'); try { await c.query(sql, args); await c.query('release savepoint s'); return null } catch (e) { await c.query('rollback to savepoint s'); return e.message } }
try {
  await c.query('begin')
  if (!process.argv.includes('--da-ap')) { await c.query(fs.readFileSync(MIG, 'utf8')); console.log('✔ migration áp được (trong transaction)') }
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])

  const [{ cay }] = await q(`select fn_tl_hh_cay_chon($1) cay`, [KHOI])
  const bais = cay.filter((b) => b.so_cau >= 9)
  kiem(`bộ chọn bài học K${KHOI}: ${cay.length} bài, ${bais.length} bài đủ ≥9 câu`, bais.length >= 2)
  const [A, B] = bais
  const [mh] = await q(`select m.id from hinh_mo_hinh m where m.phan = 'luyen' and m.khoi = $1 and exists (select 1 from hinh_bai b where b.mo_hinh_id = m.id and b.bo_qua_at is null and b.loai_cau = 'tu_luan') limit 1`, [KHOI])

  const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do) values ('giao_trinh', '[TEST] GT Hình', $1, 'Toán', 'hinh', 'moi') returning id`, [KHOI])
  const [b1] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, 0, 'buoi', 'Buổi 1') returning id`, [tl.id])
  let [{ nd }] = await q(`select fn_tl_hh_dat_bai($1, $2, $3) nd`, [tl.id, b1.id, [A.ma_bai, B.ma_bai]])
  let hoc = nd.buoi[0].hoc
  kiem('đặt 2 bài học: đúng thứ tự, mỗi bài 4 câu luyện + 4 câu BTVN', hoc.length === 2 && hoc[0].ma_bai === A.ma_bai && hoc.every((h) => h.caus.length === 4 && h.btvn?.caus.length === 4),
    JSON.stringify(hoc.map((h) => [h.ma_bai, h.caus.length, h.btvn?.caus.length])))
  const tatCa = hoc.flatMap((h) => [...h.caus, ...h.btvn.caus].map((x) => x.ma_cau))
  kiem('không câu nào lặp trong buổi', new Set(tatCa).size === tatCa.length)
  const sai = await q(`select x from unnest($1::text[]) x join hinh_hoc_cau_hoi q on q.ma_cau = x where not (q.dang_chinh = any ($2))`, [tatCa, [A.ma_bai, B.ma_bai]])
  kiem('câu gợi ý đúng bài học của nó', sai.length === 0)

  if (mh) await q(`select fn_tl_hl_dat_mo_hinh($1, $2, $3)`, [tl.id, b1.id, [mh.id]])
  ;[{ nd }] = await q(`select fn_tl_hh_dat_bai($1, $2, $3) nd`, [tl.id, b1.id, [B.ma_bai, A.ma_bai]])
  hoc = nd.buoi[0].hoc
  kiem('đổi thứ tự bài: giữ nguyên câu đã chọn', hoc[0].ma_bai === B.ma_bai && JSON.stringify(hoc.flatMap((h) => [...h.caus, ...h.btvn.caus].map((x) => x.ma_cau)).sort()) === JSON.stringify([...tatCa].sort()))
  if (mh) kiem('mô hình Luyện vẫn còn sau khi đặt bài học', nd.buoi[0].mo_hinh.length === 1 && nd.buoi[0].mo_hinh[0].bai.length > 0)
  const thuTu = await q(`select loai_phan from tai_lieu_phan where tai_lieu_id = $1 order by thu_tu`, [tl.id])
  const chuoi = thuTu.map((r) => r.loai_phan).join(',')
  kiem(`thứ tự phần: buổi → Học → Luyện → BTVN (${chuoi})`, /^buoi,(dang,)+(hl_mo_hinh,)*(btvn,?)+$/.test(chuoi))

  // gợi ý lại + đặt câu
  const pA = hoc.find((h) => h.ma_bai === A.ma_bai)
  const [{ g }] = await q(`select fn_tl_hh_goi_y($1, 3) g`, [pA.phan_id])
  kiem('gợi ý lại 3 câu không trùng câu khác trong buổi', g.length === 3 && g.every((m) => !hoc.filter((h) => h !== pA).flatMap((h) => [...h.caus, ...h.btvn.caus].map((x) => x.ma_cau)).includes(m)) && g.every((m) => !pA.btvn.caus.some((x) => x.ma_cau === m)))
  await q(`select fn_tl_hh_dat_cau($1, $2)`, [pA.phan_id, g])
  let e = await loiKhi(`select fn_tl_hh_dat_cau($1, $2)`, [pA.phan_id, [pA.btvn.caus[0].ma_cau]])
  kiem('đặt câu đã có ở BTVN cùng buổi bị chặn', e && e.includes('đã dùng'), e)
  const [lac] = await q(`select ma_cau from hinh_hoc_cau_hoi where dang_chinh = $1 and xoa_at is null limit 1`, [B.ma_bai])
  e = await loiKhi(`select fn_tl_hh_dat_cau($1, $2)`, [pA.phan_id, [lac.ma_cau]])
  kiem('đặt câu của bài học khác bị chặn', e && e.includes('không thuộc bài học'), e)

  // GÁN LỚP
  const [lop] = await q(`select id from lop limit 1`)
  const taoDoc = async (loai) => (await q(`insert into tai_lieu (loai, ten, khoi, mon, nhanh, ban_do, lop_id, ngay, nguon_id, nguon_buoi)
      values ($1, '[TEST] doc', $2, 'Toán', 'hinh', 'moi', $3, '2099-01-01', $4, $5) returning id`, [loai, KHOI, lop.id, tl.id, b1.id]))[0]
  const gt = await taoDoc('giao_trinh_buoi')
  await q(`select fn_tl_hinh_trich_buoi($1, $2, $3, 'gt', 'Buổi 5')`, [tl.id, b1.id, gt.id])
  const [{ ng }] = await q(`select fn_tl_hl_noi_dung($1) ng`, [gt.id])
  const [{ goc }] = await q(`select fn_tl_hl_noi_dung($1, $2) goc`, [tl.id, b1.id])
  const g0 = goc.buoi[0], l0 = ng.buoi[0]
  kiem('GT lớp: tiêu đề = số buổi của lớp', l0.tieu_de === 'Buổi 5')
  kiem('GT lớp: bài học + câu luyện y hệt gốc, KHÔNG có BTVN', JSON.stringify(l0.hoc.map((h) => [h.ma_bai, h.caus.map((x) => x.ma_cau)])) === JSON.stringify(g0.hoc.map((h) => [h.ma_bai, h.caus.map((x) => x.ma_cau)])) && l0.hoc.every((h) => !h.btvn))
  kiem('GT lớp: mô hình + bài y hệt gốc', JSON.stringify(l0.mo_hinh.map((m) => [m.id, m.bai.map((b) => b.ma_bai)])) === JSON.stringify(g0.mo_hinh.map((m) => [m.id, m.bai.map((b) => b.ma_bai)])))
  const bt = await taoDoc('btvn')
  await q(`select fn_tl_hinh_trich_buoi($1, $2, $3, 'btvn', 'Buổi 5')`, [tl.id, b1.id, bt.id])
  const phBt = await q(`select p.loai_phan, p.ref_ma, array_agg(tc.ma_cau order by tc.thu_tu) caus from tai_lieu_phan p left join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1 group by p.id order by p.thu_tu`, [bt.id])
  kiem('BTVN lớp: buổi + 1 phần btvn mỗi bài học (khuôn cũ), câu y hệt gốc',
    phBt[0].loai_phan === 'buoi' && JSON.stringify(phBt.slice(1).map((r) => [r.loai_phan, r.ref_ma, r.caus])) === JSON.stringify(g0.hoc.map((h) => ['btvn', h.ma_bai, h.btvn.caus.map((x) => x.ma_cau)])))
  // Bên đọc chung (giáo trình Hình·Học cũ): 'dang' của tài liệu lớp có cha = buổi, ref_ma = mã bài học
  const [{ n: mo }] = await q(`select count(*)::int n from tai_lieu_phan where tai_lieu_id in ($1, $2) and loai_phan <> 'buoi' and cha_id is null`, [gt.id, bt.id])
  kiem('tài liệu lớp: mọi phần (trừ mốc buổi) có cha', mo === 0)
  e = await loiKhi(`select fn_tl_hinh_trich_buoi($1, $2, $3, 'gt', 'x')`, [tl.id, b1.id, gt.id])
  kiem('chép vào tài liệu đã có nội dung bị chặn', e && e.includes('đã có nội dung'), e)

  // bỏ 1 bài học ⇒ mất cả phần luyện + BTVN của bài đó
  ;[{ nd }] = await q(`select fn_tl_hh_dat_bai($1, $2, $3) nd`, [tl.id, b1.id, [A.ma_bai]])
  const [{ n: conB }] = await q(`select count(*)::int n from tai_lieu_phan where tai_lieu_id = $1 and ref_ma = $2`, [tl.id, B.ma_bai])
  kiem('bỏ bài học ⇒ gỡ cả phần luyện + BTVN của bài đó', nd.buoi[0].hoc.length === 1 && conB === 0)
  // chuyên đề Hình cũ vẫn đọc như trước (khoá cũ còn)
  kiem('nội dung vẫn có mo_hinh / khac như cũ', 'mo_hinh' in nd.buoi[0] && 'khac' in nd.buoi[0])

  await q("select set_config('request.jwt.claims', '{}', true)")
  e = await loiKhi(`select fn_tl_hh_dat_bai($1, $2, $3)`, [tl.id, b1.id, [A.ma_bai]])
  kiem('không phải thành viên ⇒ từ chối', e && e.includes('Chỉ nhân sự'), e)
  const quyen = await q(`select p.proname, has_function_privilege('anon', p.oid, 'execute') anon from pg_proc p where p.proname ~ '^(fn_|_)tl_hh_|^fn_tl_hinh_trich_buoi$'`)
  kiem(`anon không gọi được ${quyen.length} hàm mới`, quyen.length >= 9 && quyen.every((r) => !r.anon), JSON.stringify(quyen.filter((r) => r.anon)))
} catch (err) { fail++; console.log('✘ LỖI:', err.message, err.where ?? '') }
finally { await c.query('rollback'); await c.end(); console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi`); process.exit(fail ? 1 : 0) }
