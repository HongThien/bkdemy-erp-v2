// ============================================================================
// ap-soat-clc6.mjs — ÁP kết quả ĐỌC SOÁT (clc6-brief-soat.md) lên các bản soạn đã gom của bộ CLC lớp 6.
//
//   node scripts/kho/de-thi/ap-soat-clc6.mjs --soat <thư mục soát> --ra kho-rules/dai/lo/clc6 [--ghi]
//
// Mỗi đề (hoặc mỗi phần .p1/.p2/.p3): <soát>/<K>.json = biên bản · <soát>/<K>.sua.json = các câu người soát viết lại.
// Câu sửa chỉ được nhận khi: mã có trong bản soạn · `dap_an` KHÔNG đổi · qua lại cổng khuôn (Phần 1 card, số $, "Chọn X.", sơ đồ).
// Không qua ⇒ giữ bản soạn cũ, in ra để Opus xử. Không --ghi thì chỉ báo cáo.
// Ghi: <ra>/<K>.soan.json (đã thay câu sửa) · <ra>/soat/<K>.json (biên bản, gộp các phần) · <ra>/soat-tong.json.
// Không gọi AI, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync, existsSync, readdirSync, mkdirSync } from 'node:fs'
import { join } from 'node:path'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'

const args = process.argv.slice(2)
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const SOAT = lay('--soat'), RA = lay('--ra'), GHI = args.includes('--ghi')
if (!SOAT || !RA) { console.error('Dùng: node scripts/kho/de-thi/ap-soat-clc6.mjs --soat <dir> --ra <dir> [--ghi]'); process.exit(2) }
const doc = (f) => JSON.parse(readFileSync(f, 'utf8'))

/** Cổng khuôn của một câu đã soạn (cùng luật với gom-soan-clc6.mjs). */
function kiemKhuon(s, tracNghiem) {
  const lg = s.loi_giai ?? '', l = []
  const i1 = lg.indexOf('**Phần 1. Hướng dẫn**'), i2 = lg.indexOf('**Phần 2. Trình bày**')
  if (i1 !== 0 || i2 < 0) l.push('thiếu / sai tiêu đề Phần 1 – Phần 2')
  else { const e = kiemP1(lg.slice(0, i2).trim()); if (e.length) l.push('Phần 1: ' + e.join('; ')) }
  if ((lg.match(/(?<!\\)\$/g) ?? []).length % 2) l.push('số $ lẻ')
  if (/[\f\t\v\b]/.test(lg + (s.dap_an ?? ''))) l.push('ký tự điều khiển (gạch ngược LaTeX hỏng)')
  if (tracNghiem && s.dap_an && !new RegExp(`Chọn ${s.dap_an}\\.\\s*$`).test(lg.trim())) l.push(`dòng cuối không phải "Chọn ${s.dap_an}."`)
  const nSoDo = (lg.match(/Ta có sơ đồ/g) ?? []).length, mt = s.so_do_mo_ta == null ? 0 : Array.isArray(s.so_do_mo_ta) ? s.so_do_mo_ta.length : 1
  if (nSoDo !== mt) l.push(`"Ta có sơ đồ" ${nSoDo} lần mà so_do_mo_ta có ${mt}`)
  return l
}

const dsSoan = readdirSync(RA).filter((f) => f.endsWith('.soan.json')).map((f) => f.replace('.soan.json', ''))
const tong = { de: 0, chua_soat: [], cau_sua: 0, tu_choi: [], van_de: { sai: 0, nen_sua: 0, hoi: 0 }, chua_dat: [] }, tatCa = []
if (GHI) mkdirSync(join(RA, 'soat'), { recursive: true })
for (const K of dsSoan) {
  // biên bản: một tệp hoặc các phần
  const phan = existsSync(join(SOAT, `${K}.json`)) ? [K] : [1, 2, 3, 4].map((i) => `${K}.p${i}`).filter((p) => existsSync(join(SOAT, `${p}.json`)))
  if (!phan.length) { tong.chua_soat.push(K); continue }
  tong.de++
  const soan = doc(join(RA, `${K}.soan.json`)), vanDe = [], sua = []
  let ketLuan = 'ĐẠT'
  for (const p of phan) {
    const bb = doc(join(SOAT, `${p}.json`))
    if (bb.ket_luan !== 'ĐẠT') { ketLuan = 'CHƯA ĐẠT'; tong.chua_dat.push(p) }
    vanDe.push(...(bb.van_de ?? []))
    if (existsSync(join(SOAT, `${p}.sua.json`))) sua.push(...doc(join(SOAT, `${p}.sua.json`)))
    else console.log(`⚠ ${p}: có biên bản mà thiếu tệp .sua.json`)
  }
  for (const v of vanDe) { tong.van_de[v.muc] = (tong.van_de[v.muc] ?? 0) + 1; tatCa.push({ de: K, ...v }) }
  let nSua = 0
  for (const m of sua) {
    const i = soan.findIndex((x) => x.ma_nguon === m.ma_nguon)
    const loi = []
    if (i < 0) loi.push('mã không có trong bản soạn')
    else {
      if ((m.dap_an ?? '') !== (soan[i].dap_an ?? '')) loi.push(`đổi dap_an «${soan[i].dap_an}» → «${m.dap_an}»`)
      loi.push(...kiemKhuon(m, /^[A-E]$/.test(soan[i].dap_an ?? '')))
    }
    if (loi.length) { tong.tu_choi.push(`${m.ma_nguon}: ${loi.join(' · ')}`); continue }
    if (JSON.stringify(m) === JSON.stringify(soan[i])) continue
    soan[i] = m; nSua++
  }
  // câu biên bản ghi da_sua mà không có bản sửa
  for (const v of vanDe) if (v.da_sua && !sua.some((m) => m.ma_nguon === v.ma_nguon)) tong.tu_choi.push(`${v.ma_nguon}: biên bản ghi đã sửa nhưng không có trong .sua.json`)
  tong.cau_sua += nSua
  if (GHI) {
    writeFileSync(join(RA, `${K}.soan.json`), JSON.stringify(soan, null, 1))
    writeFileSync(join(RA, 'soat', `${K}.json`), JSON.stringify({ ma_de: K, so_cau: soan.length, ket_luan: ketLuan, cau_sua: nSua, van_de: vanDe }, null, 1))
  }
}
if (GHI) writeFileSync(join(RA, 'soat-tong.json'), JSON.stringify(tatCa, null, 1))
console.log(`${tong.de}/${dsSoan.length} đề đã soát · vấn đề ${JSON.stringify(tong.van_de)} · ${tong.cau_sua} câu thay bản sửa${GHI ? ' (ĐÃ GHI)' : ' (chạy thử)'}`)
if (tong.chua_soat.length) console.log(`chưa soát (${tong.chua_soat.length}): ${tong.chua_soat.join(', ')}`)
if (tong.chua_dat.length) console.log(`CHƯA ĐẠT: ${tong.chua_dat.join(', ')}`)
if (tong.tu_choi.length) { console.log(`\n── bản sửa KHÔNG nhận (${tong.tu_choi.length}):`); for (const t of tong.tu_choi) console.log('  ✖', t) }
const canXem = tatCa.filter((v) => v.muc === 'hoi' || (v.muc === 'sai' && !v.da_sua))
if (canXem.length) { console.log(`\n── cần Opus xem (${canXem.length}):`); for (const v of canXem) console.log(`  [${v.muc}] ${v.ma_nguon} (${v.loai}): ${String(v.mo_ta).replace(/\s+/g, ' ').slice(0, 400)}`) }
