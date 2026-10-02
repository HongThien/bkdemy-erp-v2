// ============================================================================
// cong_ghi_anh.mjs — CỔNG GHI kho Tiếng Anh: (trạm đọc + bên A + bên B) → quyết định từng câu → ghi DB.
//
//   node scripts/anh/cong_ghi_anh.mjs <thu_muc_nhap_unit> <thu_muc_kiem_unit> --de-goc "<tên tài liệu gốc>" [--ghi]
//   … --de-thi [--khoi 9] [--nam 2026] [--thoi-gian 60] [--nguon-de "<trường/sở/sách>"] [--file <file gốc để lấy sha256>]
//
// CHẾ ĐỘ ĐỀ THI (--de-thi, Thùy 02/10 "đề thi phải lưu lại đề để làm onl giống luồng của Toán"): ngoài ghi câu vào kho như
// thường, dựng luôn ĐỀ = tai_lieu(loai='de_thi', mon='Tiếng Anh') + tai_lieu_phan + tai_lieu_cau — đúng khuôn đề Toán
// (scripts/kho/de-thi/ghi.mjs) để duyệt/giao/mở thi bằng fn_de_thi_*. Khác lô thường ở 2 chỗ, vì đề phải ĐỦ câu như giấy:
//   · câu TRÙNG câu đã có ⇒ không ghi bản sao, đề TRỎ về câu cũ (lô thường: bỏ câu).
//   · A+B cùng thấy ngoài phạm vi ⇒ vẫn ghi, CHỜ DUYỆT (lô thường: bỏ câu).
// Lý do chờ của từng câu chép vào cau_hinh.deThi.canhBaoCau — người duyệt đề đọc ngay trên màn Kho đề thi.
//   … --de-thi --bo-sung-tu <bien_ban_ghi.json của lần nhập trước>: DỰNG ĐỀ cho lô ĐÃ nhập (đề web 02/10 nhập trước khi có
//   chế độ đề thi). Câu đã ghi ⇒ dùng lại mã câu trong biên bản; câu lần trước bỏ (trùng / ngoài phạm vi) ⇒ xử như trên.
//   Biên bản lần này ghi ra bien_ban_de.json — KHÔNG đè biên bản nhập cũ.
//
// Không có --ghi: CHẠY THỬ — tính quyết định, in báo cáo, ghi biên bản, chạy mọi INSERT trong 1 transaction rồi
// ROLLBACK (ảnh không upload). Có --ghi: upload ảnh biển báo + COMMIT.
//
// Luật "CHẮC CHẮN" (spec-anh-kho.md §2.1) nằm ở luat_chac_chan.mjs — MỘT nguồn cho cả nhập lô và kiểm lại.
// Lô đã có câu cùng ten_de_goc ⇒ TỪ CHỐI (không nhập 2 lần).
// ============================================================================
import pg from 'pg'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, extname, basename } from 'node:path'
import { randomUUID, createHash } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'
import { env, vanTayDaThay, taoQuyetDinh, ghiChuChac, AI_MODEL } from './luat_chac_chan.mjs'

const argv = process.argv.slice(2)
const CO_GIA_TRI = new Set(['--de-goc', '--khoi', '--nam', '--thoi-gian', '--nguon-de', '--file', '--bo-sung-tu', '--cap'])
const [dirNhap, dirKiem] = argv.filter((a, i) => !a.startsWith('--') && !CO_GIA_TRI.has(argv[i - 1]))
const iDe = argv.indexOf('--de-goc')
const deGoc = iDe >= 0 ? argv[iDe + 1] : null
const GHI = argv.includes('--ghi')
// A+B cùng thấy "ngoài phạm vi" mà điểm đó lại là chính điểm GV dạy trong unit (vd Unit 11: suggest + S + V nguyên mẫu,
// bỏ "should") ⇒ không tự loại: đưa về CHỜ DUYỆT để GV quyết (02/10). Mặc định vẫn loại như luật §2.1.
const BO_SUNG = argv.includes('--bo-sung-tu') ? argv[argv.indexOf('--bo-sung-tu') + 1] : null
const DE_THI = argv.includes('--de-thi') || !!BO_SUNG
const NPV_CHO = argv.includes('--ngoai-pham-vi-cho-duyet') || DE_THI
const thamSo = (k, mac) => { const i = argv.indexOf(k); return i >= 0 ? argv[i + 1] : mac }
const DE = { khoi: thamSo('--khoi', '9'), nam: thamSo('--nam', null), thoiGian: Number(thamSo('--thoi-gian', '60')),
  nguonDe: thamSo('--nguon-de', ''), file: thamSo('--file', null), cap: thamSo('--cap', 'vao_10') }
if (!dirNhap || !dirKiem || !deGoc) {
  console.error('Dùng: node scripts/anh/cong_ghi_anh.mjs <thu_muc_nhap_unit> <thu_muc_kiem_unit> --de-goc "<tên tài liệu>" [--ngoai-pham-vi-cho-duyet] [--ghi]')
  process.exit(2)
}
const doc = (p) => JSON.parse(readFileSync(p, 'utf8'))
const unit = dirNhap.replace(/[\\/]+$/, '').split(/[\\/]/).pop()
const cau = doc(join(dirNhap, `${unit}.cau.json`))
const nguLieu = Object.fromEntries(doc(join(dirNhap, `${unit}.ngu_lieu.json`)).map((n) => [n.ref, n]))
const raA = Object.fromEntries(doc(join(dirKiem, 'ra_A.json')).map((x) => [x.ref, x]))
const raB = Object.fromEntries(doc(join(dirKiem, 'ra_B.json')).map((x) => [x.ref, x]))
// bên C (tuỳ chọn): gán nhãn thứ ba phân xử khi A và B lệch điểm kiến thức (đa số 2/3)
const raC = existsSync(join(dirKiem, 'ra_C.json')) ? Object.fromEntries(doc(join(dirKiem, 'ra_C.json')).map((x) => [x.ref, x])) : {}
// Bên A đã thấy ĐÚNG nội dung nào — trạm đọc sửa sau khi kiểm thì kết quả kiểm không còn áp (luật ở luat_chac_chan.mjs)
const daThayA = Object.fromEntries(doc(join(dirKiem, 'vao_A_khong_dap_an.json')).map((x) => [x.ref, vanTayDaThay(x)]))
// Khoá trùng: cùng dạng đề + đề + phương án + đoạn văn (đã chuẩn hoá khoảng trắng/hoa thường)
const chuan = (s) => (s ?? '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim().toLowerCase()
const khoaTrung = (dang, noiDung, luaChon, doan) => [dang, chuan(noiDung), (luaChon ?? []).map(chuan).join('|'), chuan(doan)].join('§')

const E = env()

const quyetDinh = taoQuyetDinh({ raA, raB, raC, daThayA, nguLieu, ngoaiPhamViChoDuyet: NPV_CHO })

const c0 = new pg.Client({ connectionString: E.DATABASE_URL, statement_timeout: 60000 })
await c0.connect()
const kpRows = (await c0.query(`select ma_dang, ma_hien_thi from anh_ban_do where ma_hien_thi is not null`)).rows
const MA = Object.fromEntries(kpRows.map((r) => [r.ma_hien_thi, r.ma_dang]))
const daCo = (await c0.query(`select count(*)::int n from anh_cau_hoi where ten_de_goc = $1`, [deGoc])).rows[0].n
if (daCo && !BO_SUNG) { console.error(`❌ Lô "${deGoc}" đã có ${daCo} câu trong kho — không nhập lần 2.`); process.exit(1) }
// Bổ sung đề cho lô đã nhập: mã câu đã ghi lần trước (phải còn sống trong kho, đúng lô)
const daGhi = {}
if (BO_SUNG) {
  const bbCu = JSON.parse(readFileSync(BO_SUNG, 'utf8'))
  if (bbCu.deGoc !== deGoc) { console.error(`❌ Biên bản cũ là lô "${bbCu.deGoc}", khác --de-goc "${deGoc}".`); process.exit(1) }
  for (const b of bbCu.bienBan) if (b.ma_cau) daGhi[b.ref] = b.ma_cau
  const song = (await c0.query(`select ma_cau from anh_cau_hoi where ma_cau = any($1) and xoa_at is null and ten_de_goc = $2`, [Object.values(daGhi), deGoc])).rows
  if (song.length !== Object.keys(daGhi).length) { console.error(`❌ Biên bản cũ có ${Object.keys(daGhi).length} mã câu, kho chỉ còn ${song.length} câu sống của lô.`); process.exit(1) }
}

// Câu đã có trong kho Anh (mọi lô) — bỏ câu trùng y hệt, kể cả trùng trong chính lô này (vd U2-C020 ≡ C015)
const daCoKhoa = new Map((await c0.query(
  `select c.ma_cau, c.dang_de, c.noi_dung, c.lua_chon, coalesce(n.noi_dung, '') doan
     from anh_cau_hoi c left join anh_ngu_lieu n on n.ma_ngu_lieu = c.ngu_lieu where c.xoa_at is null`)).rows
  .map((r) => [khoaTrung(r.dang_de, r.noi_dung, r.lua_chon, r.doan), r.ma_cau]))
const ketQua = cau.map((c) => {
  if (daGhi[c.ref]) return { c, q: { loai: 'da_co', ma: daGhi[c.ref] } }
  const k = khoaTrung(c.dang_de, c.noi_dung, c.lua_chon, c.ngu_lieu ? nguLieu[c.ngu_lieu]?.noi_dung : '')
  if (daCoKhoa.has(k)) {
    const cu = daCoKhoa.get(k)   // mã câu cũ, hoặc { ref } nếu trùng câu TRƯỚC trong chính lô này
    if (DE_THI) return { c, q: { loai: 'trung', maCu: typeof cu === 'string' ? cu : null, refCu: typeof cu === 'string' ? null : cu.ref, lyDo: ['trùng câu đã có — đề trỏ về câu cũ'] } }
    return { c, q: { loai: 'bo', lyDo: ['trùng câu đã có (trong kho hoặc trong lô)'] } }
  }
  daCoKhoa.set(k, { ref: c.ref })
  return { c, q: quyetDinh(c) }
})
const dem = { chac: 0, cho: 0, bo: 0, trung: 0, da_co: 0 }
for (const { q } of ketQua) dem[q.loai]++

// ── upload ảnh biển báo (chỉ khi --ghi) ──
const urlAnh = {}
async function upAnh(nl) {
  if (!nl.anh_file) return null
  if (!GHI) return `(chạy thử) ${nl.anh_file}`
  if (urlAnh[nl.ref]) return urlAnh[nl.ref]
  const sb = createClient(E.VITE_SUPABASE_URL, E.SUPABASE_SERVICE_ROLE, { auth: { persistSession: false, autoRefreshToken: false } })
  const ext = extname(nl.anh_file).toLowerCase()
  const ct = { '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.gif': 'image/gif', '.webp': 'image/webp' }[ext] ?? 'application/octet-stream'
  const path = `nhap_kho_anh/${new Date().toISOString().slice(0, 7)}/${randomUUID()}${ext}`
  const { error } = await sb.storage.from('kho-anh').upload(path, readFileSync(join(dirNhap, nl.anh_file)), { contentType: ct, upsert: false })
  if (error) throw new Error('upload ảnh lỗi: ' + error.message)
  return (urlAnh[nl.ref] = sb.storage.from('kho-anh').getPublicUrl(path).data.publicUrl)
}

// ── ĐỀ THI: phần = 1 lệnh của đề (cột `ex` của trạm đọc); cặp "sắp xếp câu + câu kết đoạn" tách thành phần riêng ──
const TEN_DANG = { phat_am: 'Phát âm', trong_am: 'Trọng âm', hoan_thanh_cau: 'Hoàn thành câu', dien_thong_bao: 'Điền thông báo',
  sap_xep_doan: 'Sắp xếp câu thành đoạn', cau_chu_de: 'Câu chủ đề', dien_doan_van: 'Điền đoạn văn', cau_gan_nghia: 'Câu gần nghĩa',
  viet_cau_goi_y: 'Viết câu từ gợi ý', bien_bao: 'Biển báo / thông báo', doc_hieu: 'Đọc hiểu', dien_cau_doan: 'Điền câu vào đoạn',
  dong_trai_nghia: 'Đồng / trái nghĩa', ket_hop_cau: 'Nối câu' }
const soCua = (ref) => Number(ref.match(/C(\d+)B?$/)[1])
function chiaPhan() {
  const capSx = new Set(cau.filter((c) => c.ngu_lieu && nguLieu[c.ngu_lieu]?.loai === 'doan_van' && cau.some((x) => x.ngu_lieu === c.ngu_lieu && x.dang_de === 'sap_xep_doan'))
    .map((c) => c.ref))
  const phan = []
  for (const c of cau) {
    if (!maCuaRef[c.ref]) continue
    const khoa = c.ex + (c.dang_de === 'sap_xep_doan' || capSx.has(c.ref) ? '·sx' : '')
    if (!phan.length || phan[phan.length - 1].khoa !== khoa) phan.push({ khoa, cau: [] })
    phan[phan.length - 1].cau.push(c)
  }
  return phan.map((p, i) => {
    const a = soCua(p.cau[0].ref), b = soCua(p.cau[p.cau.length - 1].ref)
    return { thu_tu: i + 1, ten: `${a === b ? `Câu ${a}` : `Câu ${a}–${b}`} · ${TEN_DANG[p.khoa.endsWith('·sx') ? 'sap_xep_doan' : p.cau[0].dang_de] ?? p.cau[0].dang_de}`, cau: p.cau }
  })
}
async function dungDe(c) {
  const sha = createHash('sha256').update(DE.file && existsSync(DE.file) ? readFileSync(DE.file) : readFileSync(join(dirNhap, `${unit}.cau.json`))).digest('hex')
  const da = (await c.query(`select id, ten from tai_lieu where loai = 'de_thi' and cau_hinh -> 'deThi' ->> 'sha256' = $1`, [sha])).rows
  if (da.length) throw new Error(`Đề này đã có trên ERP: "${da[0].ten}" (tai_lieu ${da[0].id}) — không dựng lần hai.`)
  const phan = chiaPhan()
  const canhBaoCau = {}
  for (const b of bienBan) if (b.ma_cau && b.quyet !== 'chac' && b.ly_do?.length) canhBaoCau[b.ma_cau] = [...(canhBaoCau[b.ma_cau] ?? []), ...b.ly_do]
  const so = cau.map((x) => soCua(x.ref)), thieu = []
  for (let k = 1; k <= Math.max(...so); k++) if (!so.includes(k)) thieu.push(k)
  const cauHinh = { deThi: { nguon: DE.nguonDe, cap: DE.cap, nam: DE.nam ? Number(DE.nam) : null, thoiGianPhut: DE.thoiGian, thangDiem: 10,
    sha256: sha, file: DE.file ? basename(DE.file) : `${unit}.cau.json`, pdfGocUrl: null, phan: phan.map(({ thu_tu, ten }) => ({ thu_tu, ten })),
    ...(thieu.length ? { cauThieu: thieu } : {}), ...(Object.keys(canhBaoCau).length ? { canhBaoCau } : {}) } }
  const tl = (await c.query(`insert into tai_lieu (loai, ten, khoi, mon, cau_hinh) values ('de_thi', $1, $2, 'Tiếng Anh', $3::jsonb) returning id`,
    [deGoc, DE.khoi, JSON.stringify(cauHinh)])).rows[0]
  for (let pi = 0; pi < phan.length; pi++) {
    const ph = (await c.query(`insert into tai_lieu_phan (tai_lieu_id, thu_tu, loai_phan, ref_ma, tieu_de, noi_dung) values ($1, $2, 'custom', null, $3, null) returning id`,
      [tl.id, pi, phan[pi].ten])).rows[0]
    let tt = 0
    for (const x of phan[pi].cau) await c.query(`insert into tai_lieu_cau (phan_id, ma_cau, thu_tu) values ($1, $2, $3)`, [ph.id, maCuaRef[x.ref], tt++])
  }
  // đọc lại qua đúng hàm ERP dùng — đề phải đủ câu, không câu nào "đã xoá" (kho tra sai bảng)
  const doc = (await c.query(`select count(*)::int n, count(*) filter (where xoa)::int xoa, sum(diem)::numeric diem from fn_de_thi_cau($1)`, [tl.id])).rows[0]
  const th = (await c.query(`select * from fn_de_thi_thieu($1)`, [tl.id])).rows
  if (doc.n !== Object.keys(maCuaRef).length || doc.xoa) throw new Error(`Đề đọc lại lệch: ${doc.n} câu (ghi ${Object.keys(maCuaRef).length}), ${doc.xoa} câu "đã xoá"`)
  console.log(`  ĐỀ: tai_lieu ${tl.id} · ${phan.length} phần · ${doc.n} câu · ${doc.diem} điểm` + (thieu.length ? ` · ⚠ đề THIẾU câu ${thieu.join(', ')} (gốc rơi câu, hoặc câu biển báo chưa có ảnh)` : ''))
  console.log('  fn_de_thi_thieu:', JSON.stringify(th).slice(0, 300))
  return tl.id
}

const bienBan = []
const maCuaRef = {}   // ref → ma_cau (câu mới ghi hoặc câu cũ được trỏ)
let deId = null
await c0.query('begin')
try {
  const maNL = {}
  for (const { c, q } of ketQua) {
    if (q.loai === 'bo') { bienBan.push({ ref: c.ref, quyet: 'bo', ly_do: q.lyDo }); continue }
    if (q.loai === 'da_co') { maCuaRef[c.ref] = q.ma; bienBan.push({ ref: c.ref, ma_cau: q.ma, quyet: 'da_co' }); continue }
    if (q.loai === 'trung') {
      const ma = q.maCu ?? maCuaRef[q.refCu]
      if (!ma) throw new Error(`${c.ref}: trùng câu ${q.refCu} trong lô nhưng câu đó không được ghi`)
      maCuaRef[c.ref] = ma
      bienBan.push({ ref: c.ref, ma_cau: ma, quyet: 'trung', ly_do: q.lyDo }); continue
    }
    let ngu = null
    if (c.ngu_lieu) {
      if (!maNL[c.ngu_lieu]) {
        const n = nguLieu[c.ngu_lieu]
        const r = await c0.query(
          `insert into anh_ngu_lieu (loai, tieu_de, noi_dung, anh, nguon, ten_de_goc) values ($1,$2,$3,$4,'le',$5) returning ma_ngu_lieu`,
          [n.loai, n.tieu_de ?? null, n.noi_dung ?? '', await upAnh(n), deGoc])
        maNL[c.ngu_lieu] = r.rows[0].ma_ngu_lieu
      }
      ngu = maNL[c.ngu_lieu]
    }
    const chac = q.loai === 'chac'
    // Điểm kiến thức đã thống nhất (kể cả khi câu vướng lý do khác) ⇒ câu nằm ĐÚNG điểm, GV duyệt ngay dưới điểm đó (lọc 'nghi').
    // Chỉ khi 2 bên không thống nhất điểm mới về điểm chờ E09000000 (lọc 'chua_dang') kèm đề xuất.
    const dang = q.kp ? MA[q.kp] : 'E09000000'
    if (!dang) throw new Error(`Không thấy mã DB cho điểm ${q.kp} (${c.ref})`)
    const ghiChu = chac ? ghiChuChac(raA[c.ref], q.kp, q.ghiChu) : q.lyDo.join(' · ')
    const r = await c0.query(
      `insert into anh_cau_hoi (dang_chinh, loai_cau, noi_dung, lua_chon, dap_an, nguon, nguon_giai, ten_de_goc,
         ngu_lieu, thu_tu_trong_ngu_lieu, dang_de, unit_sgk, da_duyet, duyet_nguon,
         kiem_may, kiem_may_at, kiem_may_boi, kiem_may_ghi, dang_ai_de_xuat, ai_model, loi_giai)
       values ($1,'trac_nghiem',$2,$3::jsonb,$4,$16,'nguoi',$5,$6,$7,$8,$9,$10,$11,$12,now(),'claude_code',$13,$14,$15,$17)
       returning ma_cau`,
      [dang, c.noi_dung, JSON.stringify(c.lua_chon), c.dap_an, deGoc, ngu, ngu ? c.thu_tu_trong_ngu_lieu : null,
       c.dang_de, c.unit_sgk, chac, chac ? 'ai' : null, chac ? 'khop' : 'nghi', ghiChu.slice(0, 1000),
       q.deXuat ? (MA[q.deXuat] ?? null) : null, AI_MODEL, DE_THI ? 'de_thi' : 'le', c.loi_giai ?? null])   // lời giải của nguồn (bản GV) — trạm đọc đã lọc lời giải không khớp đáp án
    maCuaRef[c.ref] = r.rows[0].ma_cau
    bienBan.push({ ref: c.ref, ma_cau: r.rows[0].ma_cau, quyet: q.loai, kp: q.kp, de_xuat: q.deXuat, ly_do: q.lyDo })
  }
  if (DE_THI) deId = await dungDe(c0)
  if (GHI) await c0.query('commit'); else await c0.query('rollback')
} catch (e) {
  await c0.query('rollback'); console.error('❌ ' + e.message + ' — ĐÃ ROLLBACK, DB không đổi.'); process.exit(1)
} finally { await c0.end() }

writeFileSync(join(dirKiem, BO_SUNG ? (GHI ? 'bien_ban_de.json' : 'bien_ban_de_thu.json') : (GHI ? 'bien_ban_ghi.json' : 'bien_ban_thu.json')),
  JSON.stringify({ deGoc, dem, bienBan, deId }, null, 1))
const lyDoDem = {}
for (const b of bienBan) for (const l of b.ly_do ?? []) { const k = l.split(':')[0].replace(/\(.*$/, '').trim(); lyDoDem[k] = (lyDoDem[k] ?? 0) + 1 }
console.log(`${GHI ? 'ĐÃ GHI' : 'CHẠY THỬ (đã rollback)'} — ${deGoc}`)
console.log(`  chắc chắn → kho: ${dem.chac} · chờ duyệt: ${dem.cho} · không nhập (ngoài phạm vi / trùng): ${dem.bo}`
  + (DE_THI ? ` · trùng câu cũ (đề trỏ về): ${dem.trung}` : '') + (BO_SUNG ? ` · đã ghi lần trước: ${dem.da_co}` : '') + ` · tổng ${cau.length}`)
console.log('  lý do chờ/bỏ:', lyDoDem)
