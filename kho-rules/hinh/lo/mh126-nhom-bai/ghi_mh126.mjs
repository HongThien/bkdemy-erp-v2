// GHI kế hoạch gom MH.126 thành nhóm bài (docs/de-xuat-nhom-bai-mh126.html, Thùy "ghi và push đi" 09/11).
// 1 transaction. Mặc định CHẠY THỬ (rollback); `--ghi` mới commit. Kiểm trước khi commit: mã mọi nốt không đổi,
// 0 cờ sai nhánh, ghép thử 3 cửa ra đúng giả thiết. Chạy từ gốc repo: node kho-rules/hinh/lo/mh126-nhom-bai/ghi_mh126.mjs [--ghi]
import pg from 'pg'; import fs from 'fs'; import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const K = require('./ke_hoach_mh126.cjs')
const MOI = JSON.parse(fs.readFileSync(new URL('./mh126_moi.json', import.meta.url), 'utf8')).moi
const GHI = process.argv.includes('--ghi')
const env = Object.fromEntries(fs.readFileSync('.env','utf8').split(/\r?\n/).filter(l=>l.includes('=')&&!l.startsWith('#')).map(l=>[l.slice(0,l.indexOf('=')).trim(), l.slice(l.indexOf('=')+1).trim().replace(/^"|"$/g,'')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (sql, a) => (await c.query(sql, a)).rows
const q1 = async (sql, a) => (await q(sql, a))[0]
const log = []; const chet = (m) => { throw new Error(m) }
try {
  await c.query('begin')
  const mh = async (ma) => (await q1(`select id from hinh_mo_hinh where ma = $1`, [ma]))?.id ?? chet('không thấy ' + ma)
  const g = await mh('MH.126'), m166 = await mh('MH.166'), m168 = await mh('MH.168'), m061 = await mh('MH.061')
  const nhanhTen = async (ten) => (await q1(`select m.id from hinh_mo_hinh m where m.ten = $1 and fn_hl_goc_mo_hinh(m.id) = $2 and not m.la_mo_hinh`, [ten, g]))?.id ?? chet('không thấy nhánh ' + ten)
  const bt = async (ma) => (await q1(`select * from hinh_baitoan where ma = $1`, [ma])) ?? chet('không thấy nốt ' + ma)
  const doiCay = async (ma, dich) => {   // dời nốt sang cây khác (fn_hl_chuyen_bai chỉ cho cùng cây) — mã giữ nguyên (trigger ép)
    const b = await bt(ma)
    await c.query(`update hinh_baitoan set mo_hinh_id = $2, thu_tu = coalesce((select max(thu_tu) from hinh_baitoan where mo_hinh_id = $2), 0) + 1, updated_at = now() where id = $1`, [b.id, dich])
    await c.query(`select _hl_dong_thu_tu($1)`, [b.mo_hinh_id])
    await c.query(`update hinh_mo_hinh set updated_at = now() where id in ($1, $2)`, [b.mo_hinh_id, dich])
  }
  const maTruoc = await q(`select id, ma from hinh_baitoan where fn_hl_goc_mo_hinh(mo_hinh_id) in ($1, $2)`, [g, m061])

  // 1. dời nhánh / nốt (không xoá gì)
  const F = await nhanhTen(K.nhanhDoi[0].ten), Q = await nhanhTen(K.nhanhDoi[1].ten)
  await c.query(`select fn_hl_doi_cha_gia_thiet($1, $2, false)`, [m166, g])          // MH.166 thôi làm nhánh chính (sắp thành thành viên)
  await c.query(`select fn_hl_doi_cha_gia_thiet($1, $2, true)`, [F, g])
  await c.query(`select fn_hl_doi_cha_gia_thiet($1, $2, false)`, [Q, g])
  for (const ma of K.diTiepGoc) await c.query(`select fn_hl_chuyen_bai($1, $2)`, [(await bt(ma)).id, g])
  for (const ma of K.veMH061) await doiCay(ma, m061)
  log.push('1 ✓ dời nhánh F, Q lên gốc · B5, B6 lên gốc · B1, B2 về MH.061')

  // 2. nhóm bài + đầu ra
  await c.query(`select fn_hl_nhom_bai_bat($1, $2)`, [g, K.suKien])
  await c.query(`update hinh_mo_hinh set gia_thiet = $2, updated_at = now() where id = $1`, [g, K.dauRa])
  const sk = (await q(`select id from hinh_nhom_bai_su_kien where nhom_id = $1 order by thu_tu`, [g])).map((r) => r.id)
  const ids = (xs) => xs.map((i) => sk[i])
  log.push('2 ✓ gốc → nhóm bài, 3 sự kiện, giả thiết = đầu ra')

  // 3–4. thành viên
  const [t1, t2, t3] = K.tv
  await c.query(`select fn_hl_thanh_vien_chuyen($1, $2, $3, $4)`, [m166, t1.gt, ids(t1.cho), ids(t1.hoi)])
  await c.query(`select fn_hl_thanh_vien_chuyen($1, $2, $3, $4)`, [m168, t2.gt, ids(t2.cho), ids(t2.hoi)])
  const tv3 = (await q1(`select fn_hl_thanh_vien_them($1, $2, $3, $4, $5) r`, [g, t3.ten, t3.gt, ids(t3.cho), ids(t3.hoi)])).r.nhanh_moi ?? chet('không tạo được thành viên 3')
  for (const ma of t3.not) await doiCay(ma, tv3)
  const nh = K.nhanhMoi[0]
  const H = (await q1(`select fn_hl_them_gia_thiet($1, $2, $3, false) r`, [g, nh.ten, nh.gtThem])).r.nhanh_moi ?? chet('không tạo được nhánh H')
  for (const ma of nh.not) await doiCay(ma, H)
  log.push('3–4 ✓ 3 thành viên + nhánh H')

  // 5. sửa chữ + tiền đề (fn_hl_sua_bai: phát biểu · giả thiết riêng · lời giải · ảnh giữ nguyên · tiền đề)
  const sua = [...new Set([...Object.keys(MOI), ...Object.keys(K.tienDe)])]
  for (const ma of sua) {
    const b = await bt(ma)
    const lg = (await q1(`select loi_giai from hinh_cach_giai where baitoan_id = $1 order by la_mac_dinh desc, thu_tu limit 1`, [b.id]))?.loi_giai ?? null
    const td = ma in K.tienDe
      ? await Promise.all(K.tienDe[ma].map(async (x) => (await bt(x)).id))
      : (await q(`select td.tien_de_id from hinh_cach_tien_de td join hinh_cach_giai cg on cg.id = td.cach_id where cg.baitoan_id = $1 and cg.id = (select id from hinh_cach_giai where baitoan_id = $1 order by la_mac_dinh desc, thu_tu limit 1)`, [b.id])).map((r) => r.tien_de_id)
    const n = MOI[ma]
    await c.query(`select fn_hl_sua_bai($1, $2, $3, $4, $5, $6)`, [b.id, n ? n.phat_bieu : b.phat_bieu, n ? n.gia_thiet_rieng : b.gia_thiet_rieng, n ? n.loi_giai : lg, b.anh_chuan, td])
  }
  // nốt vào thành viên 3 / nhánh H: giả thiết đã nằm ở nút ⇒ nốt không còn "thay giả thiết"
  await c.query(`update hinh_baitoan set gt_thay_the = false, updated_at = now() where ma = any($1) and gt_thay_the`, [[...t3.not, ...nh.not]])
  log.push(`5 ✓ sửa ${sua.length} nốt`)

  // 6. KIỂM
  const maSau = new Map((await q(`select id, ma from hinh_baitoan where id = any($1)`, [maTruoc.map((r) => r.id)])).map((r) => [r.id, r.ma]))
  const lechMa = maTruoc.filter((r) => maSau.get(r.id) !== r.ma)
  if (lechMa.length || maSau.size !== maTruoc.length) chet('mã nốt đổi / mất: ' + JSON.stringify(lechMa))
  const sai = await q(`select * from fn_hl_sai_nhanh($1)`, [g])
  if (sai.length) chet('còn cờ sai nhánh: ' + JSON.stringify(sai))
  const dem = await q(`select m.ten, m.vai, (select count(*)::int from hinh_baitoan b where b.mo_hinh_id = m.id) n
      from hinh_mo_hinh m where fn_hl_goc_mo_hinh(m.id) = $1 order by m.la_mo_hinh desc, m.vai, m.ten`, [g])
  log.push('6 ✓ mã giữ nguyên ' + maTruoc.length + ' nốt · 0 cờ sai nhánh')
  log.push('   cây: ' + dem.map((r) => `${r.ten} [${r.vai}] ${r.n}`).join(' | '))
  log.push('   MH.061 còn ' + (await q1(`select count(*)::int n from hinh_baitoan b where fn_hl_goc_mo_hinh(b.mo_hinh_id) = $1`, [m061])).n + ' nốt')
  const ghep = async (ten, mas) => {
    const j = (await q1(`select fn_hl_ghep_y($1::uuid[]) j`, [await Promise.all(mas.map(async (m) => (await bt(m)).id))])).j
    const maOf = new Map(await Promise.all(mas.map(async (m) => [(await bt(m)).id, m])))
    log.push(`   ghép «${ten}»: thứ tự ${j.thu_tu.map((x) => maOf.get(x)).join(' → ')} · cảnh báo ${j.canh_bao.length ? j.canh_bao.join(' | ') : 'không'}`)
    for (const id of j.thu_tu) log.push(`     ${maOf.get(id)}: ${JSON.stringify(j.phan[id])}`)
    return j
  }
  const a = await ghep('thành viên 1 + F', ['BT.07.126.07', 'BT.07.126.03', 'BT.07.126.04'])
  const b2 = await ghep('thành viên 2 + Q + M', ['BT.07.126.08', 'BT.07.126.09', 'BT.07.126.10'])
  const c3 = await ghep('thành viên 3 + H', ['BT.07.061.17', 'BT.07.061.18', 'BT.07.061.19', 'BT.07.061.20'])
  const s2 = await ghep('2 thành viên (phải cảnh báo)', ['BT.07.126.03', 'BT.07.126.08'])
  for (const j of [a, b2, c3]) if (j.canh_bao.length) chet('ghép hợp lệ mà có cảnh báo')
  if (!s2.canh_bao.length) chet('2 thành viên mà không cảnh báo')
  if (GHI) { await c.query('commit'); log.push('✅ ĐÃ GHI') } else { await c.query('rollback'); log.push('(chạy thử — đã rollback; thêm --ghi để ghi)') }
} catch (e) { await c.query('rollback'); log.push('✗ DỪNG, không ghi gì: ' + e.message) }
finally { await c.end() }
console.log(log.join('\n'))
