// ============================================================================
// kiem_lai_anh.mjs — KIỂM LẠI câu Tiếng Anh ĐÃ CÓ trong kho (không nhập mới): áp kết quả một lượt bên A + bên B
// mới lên đúng các dòng cũ, theo CÙNG luật "chắc chắn" của cổng nhập (luat_chac_chan.mjs).
//
//   node scripts/anh/kiem_lai_anh.mjs <thu_muc_nhap_goc> <thu_muc_kiem_lai> [--ghi]
//     <thu_muc_nhap_goc>  chứa L9U<n>/L9U<n>.cau.json + .ngu_lieu.json (trạm đọc hiện tại)
//     <thu_muc_kiem_lai>  chứa vao_A_khong_dap_an.json · ra_A.json · ra_B.json · ref_ma_cau.json (ref → ma_cau)
//
// Dùng khi trạm đọc sửa nội dung SAU khi câu đã vào kho (02/10: bài đọc bị mất tiêu đề/đoạn mở đầu) ⇒ kết quả kiểm cũ
// không còn áp. Câu qua luật ⇒ lên kho; không qua ⇒ chờ duyệt (kể cả câu đang "chắc chắn" — bị HẠ).
// Chỉ đụng dòng MÁY còn quản (chắc chắn do AI, hoặc chờ duyệt do máy ghi) và nội dung DB = nội dung bên A vừa kiểm.
// Không bao giờ xoá: A+B cùng thấy ngoài phạm vi ⇒ về chờ duyệt để GV quyết.
// Không có --ghi: chạy trong transaction rồi ROLLBACK.
// ============================================================================
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join } from 'node:path'
import { env, vanTayDaThay, taoQuyetDinh, ghiChuChac } from './luat_chac_chan.mjs'

const argv = process.argv.slice(2)
const [dirNhap, dirKL] = argv.filter((a) => !a.startsWith('--'))
const GHI = argv.includes('--ghi')
if (!dirNhap || !dirKL) {
  console.error('Dùng: node scripts/anh/kiem_lai_anh.mjs <thu_muc_nhap_goc> <thu_muc_kiem_lai> [--ghi]')
  process.exit(2)
}
const doc = (p) => JSON.parse(readFileSync(p, 'utf8'))
const vaoA = doc(join(dirKL, 'vao_A_khong_dap_an.json'))
const raA = Object.fromEntries(doc(join(dirKL, 'ra_A.json')).map((x) => [x.ref, x]))
const raB = Object.fromEntries(doc(join(dirKL, 'ra_B.json')).map((x) => [x.ref, x]))
// bên C (tuỳ chọn): gán nhãn thứ ba phân xử khi A và B lệch điểm kiến thức (đa số 2/3)
const raC = existsSync(join(dirKL, 'ra_C.json')) ? Object.fromEntries(doc(join(dirKL, 'ra_C.json')).map((x) => [x.ref, x])) : {}
const refMa = doc(join(dirKL, 'ref_ma_cau.json'))
const daThayA = Object.fromEntries(vaoA.map((x) => [x.ref, vanTayDaThay(x)]))

// câu + ngữ liệu hiện tại của trạm đọc (ref có tiền tố unit nên gộp được nhiều unit vào 1 map)
const cau = {}, nguLieu = {}
for (const unit of new Set(vaoA.map((x) => x.ref.split('-')[0]))) {
  for (const c of doc(join(dirNhap, unit, `${unit}.cau.json`))) cau[c.ref] = c
  for (const n of doc(join(dirNhap, unit, `${unit}.ngu_lieu.json`))) nguLieu[n.ref] = n
}
const quyetDinh = taoQuyetDinh({ raA, raB, raC, daThayA, nguLieu, ngoaiPhamViChoDuyet: true })

const chuan = (s) => (s ?? '').replace(/\s+/g, ' ').trim()
const E = env()
const c0 = new pg.Client({ connectionString: E.DATABASE_URL, statement_timeout: 60000 })
await c0.connect()
const MA = Object.fromEntries((await c0.query(`select ma_dang, ma_hien_thi from anh_ban_do where ma_hien_thi is not null`)).rows
  .map((r) => [r.ma_hien_thi, r.ma_dang]))
const db = Object.fromEntries((await c0.query(
  `select c.ma_cau, c.noi_dung, c.lua_chon, c.dap_an, c.da_duyet, c.duyet_nguon, c.kiem_may, c.kiem_may_boi, c.dang_chinh,
          n.noi_dung doan
     from anh_cau_hoi c left join anh_ngu_lieu n on n.ma_ngu_lieu = c.ngu_lieu
    where c.ma_cau = any($1) and c.xoa_at is null`, [Object.values(refMa)])).rows.map((r) => [r.ma_cau, r]))

const bienBan = [], dem = { len: 0, giu_chac: 0, giu_cho: 0, ha: 0, bo_qua: 0 }
await c0.query('begin')
try {
  for (const { ref } of vaoA) {
    const c = cau[ref], ma = refMa[ref], d = db[ma]
    const boQua = (lyDo) => { dem.bo_qua++; bienBan.push({ ref, ma_cau: ma, ket: 'bo_qua', ly_do: [lyDo] }) }
    if (!c || !d) { boQua('không thấy câu ở trạm đọc hoặc DB'); continue }
    // ① nội dung DB phải đúng là nội dung trạm đọc hiện tại (= cái bên A vừa kiểm, luật vân tay lo phần còn lại)
    if (chuan(d.noi_dung) !== chuan(c.noi_dung) || JSON.stringify(d.lua_chon.map(chuan)) !== JSON.stringify(c.lua_chon.map(chuan))
        || (d.dap_an ?? null) !== (c.dap_an ?? null)
        || chuan(d.doan) !== chuan(c.ngu_lieu ? nguLieu[c.ngu_lieu]?.noi_dung : '')) { boQua('nội dung DB khác trạm đọc — không đụng'); continue }
    // ② chỉ dòng MÁY còn quản — người đã duyệt/đụng thì để nguyên
    const mayQuan = (d.da_duyet && d.duyet_nguon === 'ai') || (!d.da_duyet && d.kiem_may === 'nghi' && d.kiem_may_boi === 'claude_code')
    if (!mayQuan) { boQua('người đã duyệt/đụng — không đụng'); continue }

    const q = quyetDinh(c)
    const chac = q.loai === 'chac'
    const dang = q.kp ? MA[q.kp] : 'E09000000'
    if (!dang) throw new Error(`Không thấy mã DB cho điểm ${q.kp} (${ref})`)
    const ghiChu = 'Kiểm lại 02/10 (trạm đọc đã bù phần bài bị mất): ' + (chac ? ghiChuChac(raA[ref], q.kp, q.ghiChu) : q.lyDo.join(' · '))
    await c0.query(
      `update anh_cau_hoi set dang_chinh = $2, da_duyet = $3, duyet_nguon = $4, kiem_may = $5, kiem_may_at = now(),
              kiem_may_boi = 'claude_code', kiem_may_ghi = $6, dang_ai_de_xuat = $7
        where ma_cau = $1`,
      [ma, dang, chac, chac ? 'ai' : null, chac ? 'khop' : 'nghi', ghiChu.slice(0, 1000), q.deXuat ? (MA[q.deXuat] ?? null) : null])
    const ket = chac ? (d.da_duyet ? 'giu_chac' : 'len') : (d.da_duyet ? 'ha' : 'giu_cho')
    dem[ket]++
    bienBan.push({ ref, ma_cau: ma, ket, kp: q.kp, de_xuat: q.deXuat, ly_do: q.lyDo, dang_cu: d.dang_chinh, dang_moi: dang })
  }
  await c0.query(GHI ? 'commit' : 'rollback')
} catch (e) {
  await c0.query('rollback'); console.error('❌ ' + e.message + ' — ĐÃ ROLLBACK, DB không đổi.'); process.exit(1)
} finally { await c0.end() }

writeFileSync(join(dirKL, GHI ? 'bien_ban_kiem_lai.json' : 'bien_ban_kiem_lai_thu.json'), JSON.stringify({ dem, bienBan }, null, 1))
const lyDoDem = {}
for (const b of bienBan) for (const l of b.ly_do ?? []) { const k = l.split(':')[0].replace(/\(.*$/, '').trim(); lyDoDem[k] = (lyDoDem[k] ?? 0) + 1 }
console.log(`${GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (đã rollback)'} — kiểm lại ${vaoA.length} câu`)
console.log(`  lên kho: ${dem.len} · giữ chắc chắn: ${dem.giu_chac} · HẠ về chờ duyệt: ${dem.ha} · vẫn chờ duyệt: ${dem.giu_cho} · bỏ qua: ${dem.bo_qua}`)
console.log('  lý do chờ:', lyDoDem)
