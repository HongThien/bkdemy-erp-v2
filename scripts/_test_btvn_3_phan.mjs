// Test BTVN 3 phần soạn trong giáo trình gốc (mig 202611131755, spec-muc-tieu-tuan.md §8.1): MỘT transaction rồi ROLLBACK.
// Không để lại gì trên DB: dựng 1 giáo trình thử bằng cách copy 3 buổi từ một giáo trình thật, mọi thao tác chạy trên bản thử.
// Chạy: node scripts/_test_btvn_3_phan.mjs   (thêm --da-ap nếu migration đã áp)
import pg from 'pg'
import fs from 'fs'

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l))
  .map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const MIG = 'supabase/migrations/202611131755_btvn_3_phan_trong_giao_trinh.sql'
const c = new pg.Client({ connectionString: process.env.DATABASE_URL || env.DATABASE_URL, ssl: { rejectUnauthorized: false } })
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
  await c.query("set local statement_timeout = '90s'")
  if (!process.argv.includes('--da-ap')) {
    await c.query(fs.readFileSync(MIG, 'utf8')); console.log('✔ migration áp được (trong transaction)')
    await c.query(fs.readFileSync(MIG, 'utf8')); console.log('✔ áp lần 2 không lỗi (idempotent)')
  }
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])

  // Giáo trình thật (Đại, bản đồ mới) có ≥ 3 buổi có nhóm + BTVN
  const [gt] = await q(`
    with b as (
      select t.id tl, t.khoi, t.mon, t.nhanh, t.theme, b.id buoi, b.thu_tu
        from tai_lieu t join tai_lieu_phan b on b.tai_lieu_id = t.id and b.loai_phan = 'buoi'
       where t.ban_do = 'moi' and t.loai = 'giao_trinh' and t.luu_tru_tu is null and t.nhanh is null and t.mon = 'Toán'
         and exists (select 1 from tai_lieu_phan n join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
                       join tai_lieu_cau tc on tc.phan_id = x.id where n.cha_id = b.id and n.loai_phan = 'nhom'))
    select tl, khoi, mon, nhanh, theme, (array_agg(buoi order by thu_tu))[1:3] buoi from b group by 1, 2, 3, 4, 5 having count(*) >= 3 order by count(*) desc limit 1`)
  kiem('có giáo trình thật để copy', !!gt)
  const taoTl = async (ten) => (await q(
    `insert into tai_lieu (loai, ten, khoi, mon, nhanh, theme, cau_hinh, ban_do) values ('giao_trinh', $1, $2, $3, $4, $5, '{}', 'moi') returning id`,
    [ten, gt.khoi, gt.mon, gt.nhanh, gt.theme]))[0].id
  const T = await taoTl('[THỬ] BTVN 3 phần')
  const B = []
  for (const [i, b] of gt.buoi.entries()) B.push((await q('select * from public.fn_tl_bdm_copy_buoi($1, $2, $3)', [b, T, 'Buổi thử ' + (i + 1)]))[0].buoi_moi_id)
  const cauBuoi = async (b) => (await q('select public._tl_bdm_cau_da_dung($1) a', [b]))[0].a
  const [c1, c2, c3] = [await cauBuoi(B[0]), await cauBuoi(B[1]), await cauBuoi(B[2])]
  console.log(`  bản thử K${gt.khoi}: 3 buổi · ${c1.length} / ${c2.length} / ${c3.length} câu`)

  // ── khung ──
  let tru = []
  const khung = async () => { const j = (await q('select public.fn_tl_bdm_btvn_khung($1) j', [T]))[0].j; tru = j.tru; return j.buoi }
  let kh = await khung()
  kiem('buổi 1 không có buổi trước', kh[B[0]].lui.length === 0)
  kiem('buổi 2 có 1 buổi trước (bậc 1 = buổi 1)', kh[B[1]].lui.length === 1 && kh[B[1]].lui[0].buoi === B[0] && kh[B[1]].lui[0].bac === 1)
  kiem('buổi 3 có 2 buổi trước (bậc 1 = buổi 2, bậc 2 = buổi 1)', kh[B[2]].lui.length === 2 && kh[B[2]].lui[0].buoi === B[1] && kh[B[2]].lui[1].buoi === B[0])
  kiem('ô luyện lại bày sẵn nhóm + dạng bài, chưa có câu', kh[B[2]].lui.every((l) => l.nhom.length > 0 && l.nhom.every((n) => Array.isArray(n.dang_bai) && n.caus.length === 0)))

  // ── gợi ý cả buổi 3 ──
  const [{ n: soO }] = await q('select public.fn_tl_bdm_lui_goi_y_buoi($1, $2) n', [T, B[2]])
  kh = await khung()
  const o3 = kh[B[2]].lui.flatMap((l) => l.nhom.map((n) => ({ bac: l.bac, buoi: l.buoi, ...n })))
  console.log(`  buổi 3: gợi ý ${soO} ô · bậc 1: ${o3.filter((x) => x.bac === 1).map((x) => x.caus.length).join('+')} câu · bậc 2: ${o3.filter((x) => x.bac === 2).map((x) => x.caus.length).join('+')} câu`)
  kiem('gợi ý được ít nhất 1 ô', soO > 0)
  kiem('bậc 1 ≤ 3 câu/nhóm, bậc 2 ≤ 2 câu/nhóm', o3.every((x) => x.caus.length <= (x.bac === 1 ? 3 : 2)))
  const lui3 = o3.flatMap((x) => x.caus)
  kiem('câu luyện lại không trùng nhau', new Set(lui3).size === lui3.length)
  kiem('không trùng câu buổi 3 (gốc), buổi 2, buổi 1', lui3.every((m) => !c3.includes(m) && !c2.includes(m) && !c1.includes(m)))

  // ── gợi ý buổi 2 (luyện lại buổi 1) không đụng phần buổi 3 đã lấy của buổi 1 ──
  await q('select public.fn_tl_bdm_lui_goi_y_buoi($1, $2)', [T, B[1]])
  kh = await khung()
  const lui2 = kh[B[1]].lui.flatMap((l) => l.nhom.flatMap((n) => n.caus))
  console.log('  buổi 2 luyện lại buổi 1:', lui2.length, 'câu · trùng buổi 3:', lui2.filter((m) => lui3.includes(m)).length)
  kiem('buổi 2 luyện lại buổi 1: không trùng phần buổi 3 đã lấy', lui2.length > 0 && lui2.every((m) => !lui3.includes(m)))
  kiem("khung trả 'tru' = mọi câu đang có trong giáo trình", [...c1, ...c2, ...c3, ...lui2, ...lui3].every((m) => tru.includes(m)))

  // ── chặn ──
  const o = o3.find((x) => x.caus.length > 0)
  const e1 = await loiKhi('select public.fn_tl_bdm_dat_cau_lui($1,$2,$3,$4,$5)', [T, B[2], o.buoi, o.nhom, [(o.buoi === B[1] ? c2 : c1)[0]]])
  kiem('chặn câu đã có trong bài của buổi được luyện lại', !!e1 && /chính buổi đó/.test(e1), e1)
  const e2 = await loiKhi('select public.fn_tl_bdm_dat_cau_lui($1,$2,$3,$4,$5)', [T, B[2], o.buoi, o.nhom, [c3[0]]])
  kiem('chặn câu đã dùng trong buổi này', !!e2 && /phần khác trong buổi/.test(e2), e2)
  const e3 = await loiKhi('select public.fn_tl_bdm_dat_cau_lui($1,$2,$3,$4,$5)', [T, B[0], B[2], o.nhom, ['X']])
  kiem('chặn buổi không phải buổi trước', !!e3 && /hai buổi liền trước/.test(e3), e3)
  const e4 = await loiKhi('select public.fn_tl_bdm_dat_cau_lui($1,$2,$3,$4,$5)', [T, B[2], B[1], o3.find((x) => x.buoi === B[1]).nhom, [lui2[0]]])
  kiem('chặn câu đã nằm trong phần luyện lại của buổi khác', !!e4 && /(chỗ khác trong giáo trình|chính buổi đó)/.test(e4), e4)

  // ── nội dung + bản in đọc được ──
  const nd3 = (await q('select public.fn_tl_bdm_noi_dung($1, $2) j', [T, B[2]]))[0].j.buoi[0]
  kiem('fn_tl_bdm_noi_dung: on_tap của buổi 3 = phần luyện lại (có lui_bac, lui_buoi)', nd3.on_tap.length === o3.filter((x) => x.caus.length).length && nd3.on_tap.every((x) => x.lui_bac && x.lui_buoi))
  kiem('thứ tự: bậc 1 trước bậc 2', nd3.on_tap.map((x) => x.lui_bac).join('') === [...nd3.on_tap.map((x) => x.lui_bac)].sort().join(''))

  // ── gán lớp: phiếu chép đúng 3 phần ──
  const [lop] = await q(`select id from lop where ten_lop ilike 'TEST%' and mon = $1 order by (khoi = $2) desc limit 1`, [gt.mon, gt.khoi])
  const taoDoc = async (loai, ngay, b) => (await q(
    `insert into tai_lieu (loai, ten, khoi, mon, nhanh, theme, cau_hinh, ban_do, lop_id, ngay, nguon_id, nguon_buoi, stt_lop)
     values ($1, $2, $3, $4, $5, $6, '{}', 'moi', $7, $8, $9, $10, 990) returning id`,
    [loai, `[THỬ 3 phần] ${loai} ${ngay}`, gt.khoi, gt.mon, gt.nhanh, gt.theme, lop.id, ngay, T, b]))[0].id
  const g = await taoDoc('giao_trinh_buoi', '2099-04-06', B[2])
  await q("select public.fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'Buổi thử 3')", [T, B[2], g])
  const [{ a: du }] = await q('select public._mtt_nhom_lui($1, $2) a', [lop.id, '2099-04-06'])
  kiem('mục tiêu tuần: phiếu chưa tạo ⇒ nhóm luyện lại dự kiến lấy từ giáo trình gốc', du.length > 0, JSON.stringify(du))
  const d = await taoDoc('btvn', '2099-04-06', B[2])
  const body = {
    nay: nd3.nhom.filter((n) => n.btvn?.caus.length).map((n) => ({ nhom: n.id, caus: n.btvn.caus })),
    lui: nd3.on_tap.map((x) => ({ bac: x.lui_bac, buoi: x.lui_buoi, nhom: x.id, caus: x.caus })), on_tap: [],
  }
  const e5 = await loiKhi('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [T, B[2], d, 'x', { ...body, lui: [{ bac: 1, buoi: B[1], nhom: body.lui[0].nhom, caus: [c2[0]] }] }])
  kiem('phiếu lớp: chặn câu luyện lại không nằm trong phần đã soạn', !!e5 && /phần luyện lại đã soạn/.test(e5), e5)
  await q('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [T, B[2], d, 'Buổi thử 3', body])
  const cs = await q('select tc.ma_cau, p.loai_phan, p.lui_bac from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1', [d])
  const soNay = body.nay.flatMap((n) => n.caus).length
  kiem(`phiếu lớp: ${soNay} câu buổi này + ${lui3.length} câu luyện lại, không trùng`, cs.length === soNay + lui3.length && new Set(cs.map((x) => x.ma_cau)).size === cs.length)
  const [{ a: th }] = await q('select public._mtt_nhom_lui($1, $2) a', [lop.id, '2099-04-06'])
  const [{ a: nb }] = await q('select public._mtt_nhom_buoi($1, $2, null) a', [lop.id, '2099-04-06'])
  kiem('mục tiêu tuần: phiếu đã tạo ⇒ nhóm luyện lại đọc từ phiếu; nhóm của buổi không lẫn nhóm luyện lại', th.length > 0 && nb.length > 0)

  // ── copy buổi sang giáo trình khác: không chép phần luyện lại ──
  const T2 = await taoTl('[THỬ] BTVN 3 phần — đích copy')
  const [cp] = await q('select * from public.fn_tl_bdm_copy_buoi($1, $2, null)', [B[2], T2])
  const [{ n: soLui }] = await q(`select count(*)::int n from tai_lieu_phan where tai_lieu_id = $1 and loai_phan = 'ontap_nhom'`, [T2])
  kiem('copy buổi: không chép phần luyện lại, câu gốc đủ', soLui === 0 && cp.so_cau === c3.length, `${soLui} / ${cp.so_cau} vs ${c3.length}`)

  // ── bỏ nhóm ở buổi 2 ⇒ phần luyện lại của buổi 3 thành "lẻ", không tự mất; GV bỏ được ──
  const nh2 = (await q(`select ref_ma, array(select d.ref_ma from tai_lieu_phan d where d.cha_id = n.id and d.loai_phan = 'dang_bai' order by d.thu_tu) ds
                          from tai_lieu_phan n where n.cha_id = $1 and n.loai_phan = 'nhom' order by n.thu_tu`, [B[1]]))
  const bo = o3.find((x) => x.buoi === B[1] && x.caus.length)
  if (bo && nh2.length >= 1) {
    await q('select public.fn_tl_bdm_dat_buoi($1, $2, $3)', [T, B[1], JSON.stringify(nh2.filter((n) => n.ref_ma !== bo.nhom).map((n) => ({ nhom: n.ref_ma, dang_bai: n.ds })))])
    kh = await khung()
    const le = kh[B[2]].le
    kiem("bỏ nhóm ở buổi trước ⇒ phần luyện lại hiện ở 'le' (không tự xoá)", le.length === 1 && le[0].nhom === bo.nhom && le[0].caus.length === bo.caus.length, JSON.stringify(le))
    await q('select public.fn_tl_bdm_bo_phan_lui($1)', [le[0].phan_id])
    kh = await khung()
    kiem('GV bỏ phần lẻ được', kh[B[2]].le.length === 0)
  }
  // ── bỏ hết câu của 1 ô ⇒ ô trống lại ──
  const con = kh[B[2]].lui.flatMap((l) => l.nhom.map((n) => ({ buoi: l.buoi, ...n }))).find((x) => x.caus.length)
  if (con) {
    await q('select public.fn_tl_bdm_dat_cau_lui($1,$2,$3,$4,$5)', [T, B[2], con.buoi, con.nhom, []])
    kh = await khung()
    kiem('bỏ hết câu của 1 ô ⇒ ô trống lại', kh[B[2]].lui.flatMap((l) => l.nhom).find((n) => n.nhom === con.nhom && !n.phan_id) !== undefined)
  }
} catch (e) {
  fail++; console.log('✘ LỖI:', e.message, e.where ?? '')
} finally {
  await c.query('rollback')
  await c.end()
  console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi.`)
  process.exit(fail ? 1 : 0)
}
