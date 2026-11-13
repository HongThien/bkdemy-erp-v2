// Test BTVN xếp chồng 3 buổi (mig 202611131635, spec-muc-tieu-tuan.md §8.1): áp migration + kiểm hàm trong MỘT transaction rồi ROLLBACK.
// Không để lại gì trên DB, không xoá gì: dựng 4 buổi năm 2099 cho lớp TEST từ một giáo trình gốc thật.
// Chạy: node scripts/_test_btvn_xep_chong.mjs   (thêm --da-ap nếu migration đã áp, khỏi áp lại)
import pg from 'pg'
import fs from 'fs'

const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split('\n').filter((l) => /^[A-Z_]+=/.test(l))
  .map((l) => [l.split('=')[0], l.slice(l.indexOf('=') + 1).trim().replace(/^"|"$/g, '')]))
const MIG = 'supabase/migrations/202611131635_btvn_xep_chong_3_buoi.sql'
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
  await c.query("set local statement_timeout = '60s'")

  // Số cũ của mục tiêu tuần (trước khi vá) để so
  // em mẫu: lớp có phiếu BTVN bản đồ mới (không Hình) kèm ôn tập trong 21 ngày gần đây — ca mà luật mới đổi kết quả
  const [hsMau] = await q(`select hl.hoc_sinh_id hs, l.mon, (date_trunc('week', t.ngay::timestamp))::date tuan
      from tai_lieu t join lop l on l.id = t.lop_id join hoc_sinh_lop hl on hl.lop_id = l.id and hl.trang_thai = 'dang_hoc'
     where t.loai = 'btvn' and t.ban_do = 'moi' and coalesce(t.nhanh, '') <> 'hinh' and t.ngay between current_date - 21 and current_date - 3
       and exists (select 1 from tai_lieu_phan p where p.tai_lieu_id = t.id and p.loai_phan = 'ontap_nhom')
     order by t.ngay desc limit 1`)
  let cu = null
  if (hsMau) { const t0 = Date.now(); cu = (await q('select public._mtt_tinh($1,$2,$3) j', [hsMau.hs, hsMau.mon, hsMau.tuan]))[0].j; console.log(`  (mục tiêu tuần cũ: ${Date.now() - t0} ms)`) }

  if (!process.argv.includes('--da-ap')) {
    await c.query(fs.readFileSync(MIG, 'utf8'))
    console.log('✔ migration áp được (trong transaction)')
    await c.query(fs.readFileSync(MIG, 'utf8'))
    console.log('✔ áp lần 2 không lỗi (idempotent)')
  }

  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])
  kiem('JWT giả lập là thành viên', (await q('select la_thanh_vien() tv'))[0].tv)

  // Giáo trình gốc bản đồ mới (không Hình) có ≥ 4 buổi liền có BTVN ≥ 8 câu
  const [gt] = await q(`
    with b as (
      select t.id tl, t.khoi, t.mon, t.nhanh, t.theme, b.id buoi, b.thu_tu, b.tieu_de,
             (select count(*) from tai_lieu_phan n join tai_lieu_phan x on x.cha_id = n.id and x.loai_phan = 'btvn_nhom'
                join tai_lieu_cau tc on tc.phan_id = x.id where n.cha_id = b.id and n.loai_phan = 'nhom') so
        from tai_lieu t join tai_lieu_phan b on b.tai_lieu_id = t.id and b.loai_phan = 'buoi'
       where t.ban_do = 'moi' and t.loai = 'giao_trinh' and t.lop_id is null and coalesce(t.nhanh, '') <> 'hinh')
    select tl, khoi, mon, nhanh, theme, (array_agg(buoi order by thu_tu))[1:4] buoi, (array_agg(so order by thu_tu))[1:4] so
      from b where so >= 8 group by 1, 2, 3, 4, 5 having count(*) >= 4 order by count(*) desc limit 1`)
  kiem('có giáo trình gốc để thử', !!gt)
  console.log('  giáo trình', gt.tl, 'K' + gt.khoi, gt.mon, '· câu BTVN 4 buổi:', gt.so.join(' / '))

  // ── hàm chia ──
  for (const [i, b] of gt.buoi.entries()) {
    const ch = await q('select * from public._tl_bdm_btvn_chia($1, array[5,3,2])', [b])
    const dem = [1, 2, 3].map((p) => ch.filter((x) => x.phan === p).length)
    kiem(`buổi ${i + 1}: chia đủ ${gt.so[i]} câu, không trùng (${dem.join('–')})`, ch.length === Number(gt.so[i]) && new Set(ch.map((x) => x.ma_cau)).size === ch.length)
    kiem(`buổi ${i + 1}: phần 1 ≈ nửa, phần 2 ≥ phần 3 > 0`, Math.abs(dem[0] - ch.length / 2) <= ch.length * 0.2 + 1 && dem[1] >= dem[2] && dem[2] > 0, dem.join("–"))
    const nh = [...new Set(ch.map((x) => x.thu_nhom))]
    kiem(`buổi ${i + 1}: nhóm nào cũng có câu ở phần 1`, nh.every((n) => ch.some((x) => x.thu_nhom === n && x.phan === 1)))
    const tron = await q('select count(*) filter (where phan = 1)::int p1, count(*)::int t from public._tl_bdm_btvn_chia($1, array[10,0,0])', [b])
    kiem(`buổi ${i + 1}: tỉ lệ 10–0–0 = giao trọn`, tron[0].p1 === tron[0].t)
  }

  // ── lớp TEST: dựng 4 buổi năm 2099 ──
  const [lop] = await q(`select id, ten_lop from lop where ten_lop ilike 'TEST%' and mon = $1 order by (khoi = $2) desc limit 1`, [gt.mon, gt.khoi])
  kiem('có lớp TEST', !!lop); console.log('  lớp', lop?.ten_lop)
  const NGAY = ['2099-03-02', '2099-03-05', '2099-03-09', '2099-03-12']
  const taoDoc = async (loai, i) => (await q(
    `insert into tai_lieu (loai, ten, khoi, mon, nhanh, theme, cau_hinh, ban_do, lop_id, ngay, nguon_id, nguon_buoi, stt_lop)
     values ($1, $2, $3, $4, $5, $6, '{}', 'moi', $7, $8, $9, $10, $11) returning id`,
    [loai, `[THỬ xếp chồng] ${loai} ${NGAY[i]}`, gt.khoi, gt.mon, gt.nhanh, gt.theme, lop.id, NGAY[i], gt.tl, gt.buoi[i], 900 + i]))[0].id
  const cauCua = async (doc) => q(
    `select tc.ma_cau, p.loai_phan, p.lui_bac, p.lui_buoi from tai_lieu_phan p join tai_lieu_cau tc on tc.phan_id = p.id where p.tai_lieu_id = $1`, [doc])
  const phieu = []
  for (let i = 0; i < 4; i++) {
    const g = await taoDoc('giao_trinh_buoi', i)
    await q("select public.fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', $4)", [gt.tl, gt.buoi[i], g, 'Buổi thử ' + (i + 1)])
    const [{ j: dx }] = await q('select public.fn_tl_bdm_btvn_xep_chong($1, $2, $3, $4) j', [gt.tl, gt.buoi[i], lop.id, NGAY[i]])
    const soNay = dx.nay.reduce((s, n) => s + n.caus.length, 0)
    const soLui = dx.lui.map((l) => l.nhom.reduce((s, n) => s + n.caus.length, 0))
    console.log(`  phiếu ${i + 1}: buổi này ${soNay}/${gt.so[i]} · luyện lại ${dx.lui.map((l, k) => `bậc ${l.bac}: ${soLui[k]}`).join(', ') || '—'}`)
    kiem(`phiếu ${i + 1}: số buổi luyện lại ≤ ${Math.min(i, 2)}${i >= 1 ? ', có bậc 1' : ''}`, dx.lui.length <= Math.min(i, 2) && (i < 1 || dx.lui.some((l) => l.bac === 1)), JSON.stringify(dx.lui.map((l) => l.bac)))
    kiem(`phiếu ${i + 1}: bậc nào lấy đúng buổi nấy`, dx.lui.every((l) => l.buoi === gt.buoi[i - l.bac]))
    if (i >= 2 && dx.lui.length < 2) {   // thiếu bậc 2 chỉ hợp lệ khi câu phần 3 của buổi đó đã được giao ở phiếu khác (giáo trình dùng lại câu)
      const con = await q(`select ch.ma_cau from public._tl_bdm_btvn_chia($1, array[5,3,2]) ch where ch.phan >= 2`, [gt.buoi[i - 2]])
      const da = new Set(phieu.flatMap((p) => p.cs.map((x) => x.ma_cau)))
      const b4 = new Set((await q(`select tc.ma_cau from tai_lieu_phan n join tai_lieu_phan x on x.cha_id = n.id join tai_lieu_cau tc on tc.phan_id = x.id where n.cha_id = $1`, [gt.buoi[i]])).map((x) => x.ma_cau))
      kiem(`phiếu ${i + 1}: không có bậc 2 vì câu còn lại đã giao / đã nằm trong buổi này`, con.every((x) => da.has(x.ma_cau) || b4.has(x.ma_cau)), JSON.stringify(con))
    }
    const d = await taoDoc('btvn', i)
    const body = {
      ti_le: dx.ti_le, nay: dx.nay.map((n) => ({ nhom: n.nhom, caus: n.caus })),
      lui: dx.lui.flatMap((l) => l.nhom.map((n) => ({ bac: l.bac, buoi: l.buoi, nhom: n.nhom, caus: n.caus }))), on_tap: [],
    }
    if (i === 3) {   // các ca phải bị chặn
      const e1 = await loiKhi('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [gt.tl, gt.buoi[i], d, 'x', { ...body, nay: [{ nhom: body.nay[0].nhom, caus: ['KHONG_CO_CAU_NAY'] }] }])
      kiem('chặn câu lạ ở phần buổi này', !!e1 && /không thuộc BTVN/.test(e1), e1)
      const e2 = await loiKhi('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [gt.tl, gt.buoi[i], d, 'x', { ...body, lui: [{ bac: 1, buoi: gt.buoi[i - 1], nhom: body.nay[0].nhom, caus: body.nay[0].caus.slice(0, 1) }] }])
      kiem('chặn câu luyện lại không thuộc buổi gốc', !!e2 && /không thuộc BTVN của buổi gốc/.test(e2), e2)
      const e3 = await loiKhi('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [gt.tl, gt.buoi[i], d, 'x', { ...body, on_tap: [{ nhom: body.nay[0].nhom, caus: body.nay[0].caus.slice(0, 1) }] }])
      kiem('chặn ôn tập trùng câu', !!e3 && /trùng/.test(e3), e3)
    }
    await q('select public.fn_tl_bdm_trich_btvn($1,$2,$3,$4,$5)', [gt.tl, gt.buoi[i], d, 'Buổi thử ' + (i + 1), body])
    const cs = await cauCua(d)
    kiem(`phiếu ${i + 1}: ghi đủ ${soNay + soLui.reduce((s, n) => s + n, 0)} câu, không trùng`, cs.length === soNay + soLui.reduce((s, n) => s + n, 0) && new Set(cs.map((x) => x.ma_cau)).size === cs.length)
    kiem(`phiếu ${i + 1}: phần luyện lại mang lui_bac + lui_buoi`, cs.filter((x) => x.loai_phan === 'ontap_nhom').every((x) => x.lui_bac && x.lui_buoi))
    phieu.push({ doc: d, cs })
  }
  // Sau 3 phiếu, mọi câu BTVN của buổi 1 và buổi 2 đã được giao đúng 1 lần
  for (const i of [0, 1]) {
    const goc = (await q('select ma_cau from public._tl_bdm_btvn_chia($1, array[5,3,2])', [gt.buoi[i]])).map((x) => x.ma_cau)
    const giao = phieu.flatMap((p) => p.cs.map((x) => x.ma_cau)).filter((m) => goc.includes(m))
    const sau = new Set((await q(`select tc.ma_cau from tai_lieu_phan n join tai_lieu_phan x on x.cha_id = n.id join tai_lieu_cau tc on tc.phan_id = x.id where n.cha_id = any($1::uuid[])`, [gt.buoi.slice(i + 1)])).map((x) => x.ma_cau))
    kiem(`buổi ${i + 1}: ${goc.length} câu gốc đều đã giao qua 3 phiếu (trừ câu giáo trình dùng lại ở buổi sau)`, goc.every((m) => giao.includes(m) || sau.has(m)), `${new Set(giao).size}/${goc.length}`)
  }
  // Tạo lại phiếu 4 (cùng lớp + ngày): đề xuất giống hệt lần đầu
  const [{ j: lai }] = await q('select public.fn_tl_bdm_btvn_xep_chong($1, $2, $3, $4) j', [gt.tl, gt.buoi[3], lop.id, NGAY[3]])
  kiem('tạo lại phiếu: đề xuất không đổi', lai.lui.flatMap((l) => l.nhom.flatMap((n) => n.caus)).length === phieu[3].cs.filter((x) => x.lui_bac).length)
  // Nội dung in
  const [{ j: nd }] = await q('select public.fn_tl_bdm_noi_dung($1) j', [phieu[3].doc])
  kiem('nội dung phiếu: on_tap có lui_bac', (nd.buoi[0].on_tap ?? []).length > 0 && nd.buoi[0].on_tap.every((o) => o.lui_bac === 1 || o.lui_bac === 2))
  kiem('nội dung phiếu: nhóm của buổi này có câu BTVN', nd.buoi[0].nhom.some((n) => n.btvn?.caus.length))

  // ── mục tiêu tuần ──
  const [{ a: nb }] = await q('select public._mtt_nhom_buoi($1, $2, null) a', [lop.id, NGAY[3]])
  const [{ a: nl }] = await q('select public._mtt_nhom_lui($1, $2) a', [lop.id, NGAY[3]])
  console.log('  nhóm của buổi 4:', nb.length, '· nhóm luyện lại:', nl.length)
  kiem('mục tiêu tuần: buổi 4 có nhóm dạy + nhóm luyện lại', nb.length > 0 && nl.length > 0)
  if (hsMau) {
    const t0 = Date.now()
    const moi = (await q('select public._mtt_tinh($1,$2,$3) j', [hsMau.hs, hsMau.mon, hsMau.tuan]))[0].j
    console.log(`  (mục tiêu tuần mới: ${Date.now() - t0} ms)`)
    const ma = (j) => (j?.nhom ?? []).map((n) => n.ma).sort()
    const them = ma(moi).filter((m) => !ma(cu).includes(m)), bot = ma(cu).filter((m) => !ma(moi).includes(m))
    console.log(`  tờ mẫu: ${ma(cu).length} nhóm → ${ma(moi).length} nhóm (thêm ${them.length}, bớt ${bot.length}) · tiến độ ${cu?.tien_do} → ${moi?.tien_do}`)
    kiem('mục tiêu tuần: _mtt_tinh chạy được sau khi vá', !!moi && Array.isArray(moi.nhom))
  }
} catch (e) {
  fail++; console.log('✘ LỖI:', e.message, e.where ?? '')
} finally {
  await c.query('rollback')
  await c.end()
  console.log(`\n${ok} đạt · ${fail} hỏng — đã ROLLBACK, DB không đổi.`)
  process.exit(fail ? 1 : 0)
}
