// Chạy thử builder bản đồ mới trên TOÀN bản đồ K6–K11 + K12 NH-TP (20/10, trước khi cho GV dùng thật).
// Mỗi NHÓM: đặt cả nhóm vào 1 buổi (fn_tl_bdm_dat_buoi) → kiểm câu luyện từng dạng bài · BTVN · không trùng câu · nội dung in
// (fn_tl_bdm_noi_dung) · gán lớp (fn_tl_bdm_trich_buoi) cho 1 nhóm/khối. Một transaction, ROLLBACK ở cuối — không để lại gì.
// Chạy: node scripts/_test_builder_bdm_toan_ban_do.mjs [--khoi 7]
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (sql, a) => (await c.query(sql, a)).rows
const ia = process.argv.indexOf('--khoi')
const KHOI = ia > 0 ? [process.argv[ia + 1]] : ['6', '7', '8', '9', '10', '11', '12']
const CHI_K12 = 'NCD00095'
const loi = [], canh = [], cham = []
let soNhom = 0, soDang = 0
try {
  await q('begin')
  // --mig <file>: nạp migration chưa áp NGAY TRONG transaction để thử trước khi áp thật
  const im = process.argv.indexOf('--mig'); if (im > 0) await q(fs.readFileSync(process.argv[im + 1], 'utf8'))
  const [ad] = await q("select tk.id from tai_khoan tk join nhan_su ns on ns.id = tk.nhan_su_id where lower(ns.email) = 'admin@gmail.com' limit 1")
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: ad.id, role: 'authenticated', email: 'admin@gmail.com' })])
  const [lop] = await q(`select id from lop limit 1`)
  for (const k of KHOI) {
    let t0 = Date.now()
    const [{ cay }] = await q(`select fn_tl_bdm_cay_chon($1) cay`, [k])
    const msCay = Date.now() - t0
    if (msCay > 3000) cham.push(`K${k} cây chọn ${msCay}ms`)
    const [tl] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do) values ('giao_trinh', '[TEST] toàn bản đồ', $1, 'Toán', 'moi') returning id`, [k])
    let thu = 0, daGan = false
    for (const cd of cay.chu_de) {
      if (k === '12' && cd.id !== CHI_K12) continue
      for (const ch of cd.chuyen_de) for (const n of ch.nhom) {
        soNhom++; soDang += n.dang_bai.length
        const ten = `K${k} · ${cd.ten} › ${n.ten}`
        const [b] = await q(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, tieu_de) values ($1, $2, 'buoi', $3) returning id`, [tl.id, thu++, `B${thu}`])
        await q('savepoint s')
        try {
          t0 = Date.now()
          const [{ nd }] = await q(`select fn_tl_bdm_dat_buoi($1, $2, $3::jsonb) nd`, [tl.id, b.id, JSON.stringify([{ nhom: n.id, dang_bai: n.dang_bai.map((d) => d.id) }])])
          const ms = Date.now() - t0
          if (ms > 4000) cham.push(`${ten}: đặt buổi ${ms}ms`)
          const nn = nd.buoi[0]?.nhom[0]
          if (!nn) { loi.push(`${ten}: đặt buổi không trả nhóm`); await q('release savepoint s'); continue }
          for (const d of nn.dang_bai) {
            const goc = n.dang_bai.find((x) => x.id === d.id)
            const can = Math.min(2, goc.so_cau)
            if (d.caus.length < can) loi.push(`${ten} › ${d.ten}: kho có ${goc.so_cau} câu mà luyện ra ${d.caus.length}`)
          }
          const coCau = n.dang_bai.reduce((s, d) => s + d.so_cau, 0) + n.so_cau_chua_phan
          const soLuyen = nn.dang_bai.reduce((s, d) => s + d.caus.length, 0) + (nn.chua_phan?.caus.length ?? 0)
          if (coCau > 0 && !(nn.btvn?.caus.length)) {
            if (soLuyen >= coCau) canh.push(`${ten}: kho mỏng — ${coCau} câu đã dùng hết cho luyện, BTVN trống`)
            else loi.push(`${ten}: nhóm có ${coCau} câu mà BTVN trống`)
          }
          if (coCau > 0 && soLuyen === 0) loi.push(`${ten}: nhóm có ${coCau} câu mà phần luyện trống`)
          if (coCau === 0) canh.push(`${ten}: nhóm 0 câu — buổi chỉ in được lý thuyết`)
          const tatCa = [...nn.dang_bai.flatMap((d) => d.caus), ...(nn.btvn?.caus ?? []), ...(nn.chua_phan?.caus ?? [])]
          if (new Set(tatCa).size !== tatCa.length) loi.push(`${ten}: trùng câu trong buổi`)
          // gán lớp 1 nhóm đầu tiên có câu của mỗi khối
          if (!daGan && coCau > 0) {
            daGan = true
            const [gt] = await q(`insert into tai_lieu (loai, ten, khoi, mon, ban_do, lop_id, ngay, nguon_id, nguon_buoi) values ('giao_trinh_buoi', '[TEST]', $1, 'Toán', 'moi', $2, $5::date, $3, $4) returning id`, [k, lop.id, tl.id, b.id, `2099-01-${String(+k).padStart(2, '0')}`])   // mỗi khối 1 ngày (uq lớp × ngày)
            await q(`select fn_tl_bdm_trich_buoi($1, $2, $3, 'gt', 'Buổi 1')`, [tl.id, b.id, gt.id])
            const [{ ndg }] = await q(`select fn_tl_bdm_noi_dung($1) ndg`, [gt.id])
            const luyenGoc = nn.dang_bai.flatMap((d) => d.caus).join(), luyenLop = (ndg.buoi[0]?.nhom[0]?.dang_bai ?? []).flatMap((d) => d.caus).join()
            if (luyenGoc !== luyenLop) loi.push(`K${k}: gán lớp lệch câu luyện so với buổi gốc`)
          }
          await q('release savepoint s')
        } catch (e) { await q('rollback to savepoint s'); loi.push(`${ten}: LỖI ${e.message}`) }
      }
    }
    t0 = Date.now()
    const [{ nd }] = await q(`select fn_tl_bdm_noi_dung($1) nd`, [tl.id])
    const msNd = Date.now() - t0
    if (msNd > 5000) cham.push(`K${k} nội dung in cả giáo trình (${nd.buoi.length} buổi) ${msNd}ms`)
    const thieuLt = nd.buoi.flatMap((b) => b.nhom).filter((n) => !n.ly_thuyet?.trim() && !n.ly_thuyet_file_url).length
    console.log(`K${k}: cây ${msCay}ms · ${nd.buoi.length} nhóm thử · nội dung in ${msNd}ms · ${thieuLt} nhóm in ra không có lý thuyết nhóm`)
  }
} catch (e) { loi.push('LỖI CHUNG: ' + e.message) }
finally { await q('rollback'); await c.end() }
console.log(`\n${soNhom} nhóm · ${soDang} dạng bài đã thử — ROLLBACK, DB không đổi`)
console.log(`\n✘ LỖI (${loi.length}):`); loi.forEach((x) => console.log('  ' + x))
console.log(`\n⏱ CHẬM (${cham.length}):`); cham.forEach((x) => console.log('  ' + x))
console.log(`\n⚠ CẢNH BÁO (${canh.length}):`); canh.slice(0, 40).forEach((x) => console.log('  ' + x)); if (canh.length > 40) console.log(`  … +${canh.length - 40}`)
process.exitCode = loi.length ? 1 : 0
