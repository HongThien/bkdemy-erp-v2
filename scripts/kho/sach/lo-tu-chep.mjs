// ============================================================================
// lo-tu-chep.mjs — dựng LÔ CÂU từ bản CHÉP + SOẠN của sách SCAN (tệp .cs.md — khuôn ở kho-rules/dai/lo/k8T-brief-chep-soan.md §5).
//
//   node scripts/kho/sach/lo-tu-chep.mjs <a.cs.md> [<b.cs.md> …] --khoi 8T --lo 1 --ten <tên lô, vd NDT-D1-ptnt>
//        [--kiem kho-rules/dai/lo/k8T-kiem.mjs] [--sua <sua.json>] [--mu <kiem-ngoai.json>] [--thu-muc kho-rules/dai/lo/k8T]
//
// Sách scan không có lớp chữ ⇒ không có `tach-bai.mjs`: trạm chép (model đọc ảnh) ghi đề + lời giải sách + lời giải kho vào .cs.md.
// Script này: (1) tách .cs.md → <tên>.bai.json (đề, kết quả sách, dòng `kiem`) + <tên>.de.json (mã + đề, KHÔNG có nhóm — cho lượt
// gán nhóm MÙ của model khác) · (2) xét các cổng · (3) ra <tên>.json = lô cùng khuôn lo-tu-soan.mjs để ghi bằng ghi-lo.mjs.
//
// CỔNG (một lỗi ⇒ không ra lô):
//   khuôn 2 phần + Phần 1 dạng card 3–6 bước (kiem-p1-card.mjs) · mọi công thức render được bằng KaTeX · số `$` chẵn
//   dấu nhân: không `\times`, không dấu chấm giữa hai số / sau ngoặc (k8T.md §3) · mã nhóm đúng dạng · mã câu không trùng
//   KIỂM CHÉP: kết quả của SÁCH (chép riêng) phải khớp ĐỀ đã chép khi máy thay số — lệch ⇒ một trong hai mẩu chép sai ⇒ mở ảnh trang
//   KIỂM ĐÁP SỐ: đáp án của lời giải kho phải khớp đề (cùng bộ máy) — lệch ⇒ lời giải sai
// --sua = bản sửa của người soát { "<mã>": { noi_dung?, dap_an?, loi_giai?, nhom?, kiem?, ket_qua_sach?, bo?: "lý do" } } — vết sửa nằm riêng.
// --mu  = { model, lan_chay, cau: { "<mã>": { dang, ly_do? } } } — nhóm do model KHÁC gán mù; lệch với nhóm của trạm soạn ⇒ câu vào DẠNG CHỜ.
// Câu sách không có lời giải nào (muc_loi_giai_sach: khong) ⇒ không nhập (CEO 10/10: chỉ nhập bài có lời giải).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import katex from 'katex'
import { chuanSoan } from './lo-tu-soan.mjs'
import { kiemP1 } from './kiem-p1-card.mjs'
import { maDangCho } from '../../_kho_insert.mjs'

const a = process.argv.slice(2)
const CO_GIA_TRI = ['--khoi', '--lo', '--ten', '--kiem', '--sua', '--mu', '--thu-muc']
const lay = (k, md = null) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : md }
const tep = a.filter((x, i) => !x.startsWith('--') && !CO_GIA_TRI.includes(a[i - 1]))
const KHOI = lay('--khoi'), LO = Number(lay('--lo')), TEN = lay('--ten'), DIR = lay('--thu-muc', 'kho-rules/dai/lo/k8T')
if (!tep.length || !KHOI || !LO || !TEN) { console.error('Dùng: node scripts/kho/sach/lo-tu-chep.mjs <a.cs.md> … --khoi 8T --lo 1 --ten <tên lô> [--sua x.json] [--mu x.json]'); process.exit(2) }
const { soVoiDe, docKiem } = await import(pathToFileURL(resolve(lay('--kiem', 'kho-rules/dai/lo/k8T-kiem.mjs'))).href)
const sua = lay('--sua') ? JSON.parse(readFileSync(lay('--sua'), 'utf8')) : {}
const mu = lay('--mu') ? JSON.parse(readFileSync(lay('--mu'), 'utf8')) : null
const CHO = maDangCho('dai', KHOI)

// ── tách .cs.md ──────────────────────────────────────────────────────────────
function tach(txt, tenTep) {
  const kq = []
  const khoi = txt.replace(/\r\n/g, '\n').split(/^=== /m).slice(1)
  for (const k of khoi) {
    const xuong = k.indexOf('\n'), ma = k.slice(0, xuong).trim(), than = k.slice(xuong + 1)
    const iDe = than.indexOf('\n## DE'), iSach = than.indexOf('\n## SACH'), iGiai = than.indexOf('\n## GIAI')
    const dau = iDe >= 0 ? than.slice(0, iDe) : than
    const meta = {}
    for (const dong of ('\n' + dau).split('\n- ').slice(1)) {
      // dòng đầu gộp nhiều khoá bằng " · "; các dòng sau một khoá (giá trị có thể chứa " · ")
      const phan = /^bai:/.test(dong) ? dong.split(' · ') : [dong]
      for (const p of phan) { const i = p.indexOf(':'); if (i > 0) meta[p.slice(0, i).trim()] = p.slice(i + 1).trim() }
    }
    const lat = (tu, den) => (tu < 0 ? '' : than.slice(than.indexOf('\n', tu + 1) + 1, den < 0 ? undefined : den).trim())
    kq.push({ ma, tep: tenTep, meta, de: lat(iDe, iSach), sach: lat(iSach, iGiai), giai: lat(iGiai, -1) })
  }
  return kq
}
const tho = tep.flatMap((t) => tach(readFileSync(t, 'utf8'), t.replace(/\\/g, '/').split('/').pop()))

// ── dựng bài + câu, xét cổng ────────────────────────────────────────────────
const loi = [], bo = [], canhBao = [], bai = [], cau = [], daSua = [], suaMay = []
/** số thập phân trong công thức: "199,5" ⇒ "199{,}5" (KaTeX không chèn khoảng trắng sau dấu phẩy) — danh sách số trong kho ngăn bằng ";" nên không lẫn */
// chỉ đổi khi số đứng riêng: "…, 2,3,5,7" (liệt kê nhiều số bằng dấu phẩy) thì để nguyên
const chuanThapPhan = (s) => String(s).replace(/\$[^$]*\$/g, (ct) => (/\d,\d+,\d/.test(ct) ? ct : ct.replace(/(\d),(\d)/g, '$1{,}$2')))
const demMa = {}
const trong = (s) => !s || s === '-' || s === '—'
for (const t of tho) {
  demMa[t.ma] = (demMa[t.ma] || 0) + 1
  const s = sua[t.ma] ?? {}
  if (sua[t.ma]) daSua.push(t.ma)
  const m = t.meta
  const b = {
    ma: t.ma, bai: m.bai ?? null, y: trong(m.y) ? null : m.y, trang_pdf: Number(m.trang) || null, tang: m.tang ?? null,
    nguon_de: trong(m.nguon_de) ? null : m.nguon_de, muc_loi_giai_sach: m.muc_loi_giai_sach ?? null,
    kiem: s.kiem ?? (trong(m.kiem) ? 'khong' : m.kiem), ket_qua_sach: s.ket_qua_sach ?? (trong(m.ket_qua_sach) ? null : m.ket_qua_sach),
    noi_dung: chuanThapPhan((s.noi_dung ?? t.de).trim()), noi_dung_chep: t.de.trim(), loi_giai_sach: t.sach, khong_doc_duoc: trong(m.khong_doc_duoc) ? null : m.khong_doc_duoc,
    ghi_chu_nghi: trong(m.ghi_chu_nghi) ? null : m.ghi_chu_nghi, tep: t.tep,
  }
  bai.push(b)
  if (s.bo) { bo.push(`${t.ma}: ${s.bo}`); continue }
  if (b.muc_loi_giai_sach === 'khong') { bo.push(`${t.ma}: sách không có lời giải / đáp số`); continue }
  if (b.khong_doc_duoc) { loi.push(`${t.ma}: trạm chép báo KHÔNG ĐỌC CHẮC — ${b.khong_doc_duoc} ⇒ mở ảnh trang ${b.trang_pdf}, sửa bằng --sua`); continue }
  if (!b.noi_dung) { loi.push(`${t.ma}: thiếu đề (## DE)`); continue }
  if (!/@p\d+$/.test(t.ma)) loi.push(`${t.ma}: mã thiếu trang PDF (@pNN)`)

  let lg = s.loi_giai ?? t.giai
  const cs = chuanSoan(lg); lg = cs.loi_giai; if (cs.doi.length) suaMay.push(`${t.ma} (${cs.doi.join('; ')})`)
  lg = chuanThapPhan(lg.replace(/\n{3,}/g, '\n\n').trim())
  if (!/^\*\*Phần 1\. Hướng dẫn\*\*\n\n[\s\S]+\n\n\*\*Phần 2\. Trình bày\*\*\n\n[\s\S]+$/.test(lg)) { loi.push(`${t.ma}: lời giải không đúng khuôn 2 phần`); continue }
  const p1 = lg.slice(0, lg.indexOf('**Phần 2. Trình bày**')).trim()
  for (const l of kiemP1(p1)) loi.push(`${t.ma}: Phần 1 — ${l}`)

  const dapAn = chuanThapPhan(String(s.dap_an ?? m.dap_an ?? '').trim())
  if (!dapAn) { loi.push(`${t.ma}: thiếu đáp án`); continue }
  let nhom = s.nhom ?? m.nhom ?? ''
  if (!/^T1\w{2}0\d0\d0\d$|000000$/.test(nhom)) { loi.push(`${t.ma}: mã nhóm "${nhom}" sai dạng`); continue }
  const nhomSoan = nhom
  const nMu = mu?.cau?.[t.ma]?.dang
  if (mu && !/000000$/.test(nhom)) {
    if (!nMu) { loi.push(`${t.ma}: bản gán mù không có câu này`); continue }
    if (nMu !== nhom) { canhBao.push(`${t.ma}: trạm soạn xếp ${nhom}, model khác gán mù ra ${nMu} ⇒ vào dạng chờ`); nhom = CHO }
  }

  // kiểm chép + kiểm đáp số (cùng bộ máy thay số, hai nguồn khác nhau)
  const kiem = docKiem(b.kiem)
  // --sua { sach_in_sai: "<người soát đã mở ảnh, sách in sai chỗ nào>" } ⇒ không so với kết quả sách nữa (vẫn kiểm đáp số kho với đề)
  const chep = s.sach_in_sai ? { ket_qua: 'khong_kiem_duoc', ghi_chu: `SÁCH IN SAI (người soát đã mở ảnh): ${s.sach_in_sai}` }
    : b.ket_qua_sach ? soVoiDe(kiem, b.ket_qua_sach, 'kết quả của sách') : { ket_qua: 'khong_kiem_duoc', ghi_chu: 'sách không ghi kết quả' }
  if (chep.ket_qua === 'khong_dat') { loi.push(`${t.ma}: KIỂM CHÉP — ${chep.ghi_chu} ⇒ đề hoặc kết quả sách chép sai (hoặc sách in sai): mở ảnh trang ${b.trang_pdf}`); continue }
  const ds = soVoiDe(kiem, dapAn)
  if (ds.ket_qua === 'khong_dat') { loi.push(`${t.ma}: KIỂM ĐÁP SỐ — ${ds.ghi_chu}`); continue }

  const laSo = /^\$-?\d+(\{,\}\d+)?\$$/.test(dapAn) && dapAn.replace(/[^0-9]/g, '').length <= 4
  cau.push({
    ma_nguon: t.ma, lo: LO, khoi: KHOI, dang_chinh: nhom, nhom_soan: nhomSoan, loai_cau: laSo ? 'tra_loi_ngan' : 'tu_luan',
    noi_dung: b.noi_dung, noi_dung_sach: b.noi_dung, dap_an: dapAn, loi_giai: lg, so_do: null, anh_sach: [],
    cong_cu: trong(m.cong_cu) ? [] : m.cong_cu.split(' · ').map((x) => x.trim()).filter(Boolean),
    kiem_doc: chep.ket_qua === 'dat'
      ? { ket_qua: 'dat', ghi_chu: `nguồn là ẢNH scan (trang PDF ${b.trang_pdf}): kết quả của sách — chép riêng — khớp đề đã chép khi máy thay số` }
      : { ket_qua: 'khong_kiem_duoc', ghi_chu: `nguồn là ẢNH scan (trang PDF ${b.trang_pdf}): máy không đối chiếu được đề với kết quả sách (${chep.ghi_chu.slice(0, 70)}) — người soát đối chiếu ảnh` },
    _kiem_dap_so: ds.ket_qua,
  })
}
for (const [k, n] of Object.entries(demMa)) if (n > 1) loi.push(`mã "${k}" xuất hiện ${n} lần`)
for (const k of Object.keys(sua)) if (!tho.some((t) => t.ma === k)) loi.push(`bản sửa có mã "${k}" không nằm trong bản chép`)

const BS = String.fromCharCode(92)
for (const c of cau) for (const k of ['noi_dung', 'loi_giai', 'dap_an']) {
  const s = String(c[k] ?? '')
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${c.ma_nguon}: ${k} có số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch { loi.push(`${c.ma_nguon}: ${k} công thức KaTeX lỗi — ${m[1].slice(0, 60)}`) }
    if (m[1].includes(BS + 'times')) loi.push(`${c.ma_nguon}: ${k} dùng ${BS}times (khối 8T: ${BS}cdot giữa hai số, còn lại viết liền)`)
    if (/[0-9)}]\.[0-9(a-zA-Z]/.test(m[1])) loi.push(`${c.ma_nguon}: ${k} có dấu chấm làm dấu nhân — ${m[1].slice(0, 50)}`)
  }
}

// ── ghi ra ───────────────────────────────────────────────────────────────────
writeFileSync(join(DIR, `${TEN}.bai.json`), JSON.stringify(bai, null, 1) + '\n')
writeFileSync(join(DIR, `${TEN}.de.json`), JSON.stringify(bai.filter((b) => b.muc_loi_giai_sach !== 'khong').map((b) => ({ ma: b.ma, noi_dung: b.noi_dung })), null, 1) + '\n')
const dem = (f) => cau.reduce((o, c) => { const k = f(c); o[k] = (o[k] || 0) + 1; return o }, {})
console.log(`${tho.length} khối trong ${tep.length} tệp · bỏ ${bo.length}${bo.length ? ' (' + bo.join(' | ') + ')' : ''}`)
console.log(`  → ${join(DIR, TEN + '.bai.json')} (${bai.length} bài) · ${TEN}.de.json (đề cho lượt gán nhóm mù)`)
if (canhBao.length) { console.log(`  ⚠ ${canhBao.length} cảnh báo:`); for (const x of canhBao) console.log('    ', x) }
if (loi.length) { console.error(`✘ ${loi.length} lỗi — KHÔNG ra lô:`); for (const l of loi) console.error('   ', l); process.exit(1) }
writeFileSync(join(DIR, `${TEN}.json`), JSON.stringify(cau, null, 1) + '\n')
console.log(`✔ ${cau.length} câu → ${join(DIR, TEN + '.json')} · máy chuẩn hoá định dạng ${suaMay.length} · người soát sửa ${daSua.length}`)
console.log('  theo nhóm:', JSON.stringify(dem((c) => c.dang_chinh)))
console.log('  kiểm chép:', JSON.stringify(dem((c) => c.kiem_doc.ket_qua)), '· kiểm đáp số:', JSON.stringify(dem((c) => c._kiem_dap_so)))
