// ============================================================================
// wmf-mtef.mjs — đọc công thức MathType đã bị Word lưu thành ẢNH WMF (không còn OLE) ra LaTeX, KHÔNG OCR, KHÔNG gọi AI.
//
//   node scripts/kho/mathtype-thu/wmf-mtef.mjs "<file.docx>" <goc.txt> --ra <goc-tex.txt>
//
// Vì sao: sách 5T (Tài liệu tham khảo Toán 5) có 0 công thức OLE, 1.031 ảnh WMF ⇒ doc-docx.mjs chỉ ra [[img:imageN.wmf]].
// Nhưng MathType ghi kèm dữ liệu MTEF vào WMF (bản ghi META_ESCAPE/MFCOMMENT, chữ ký "AppsMFCC" + "Design Science, Inc.")
// để mở lại sửa được ⇒ bóc MTEF đó, đưa qua đúng bộ chuyển MTEF → LaTeX của doc-docx (mtef.mjs). Có thể bị chia nhiều bản ghi.
//
// goc.txt = bản doc-docx.mjs đã ghi. Mỗi [[img:X.wmf]] đổi được ⇒ thay bằng $latex$; không đổi được ⇒ GIỮ NGUYÊN token
// và liệt kê lý do (không đoán). Ảnh không phải MathType (hình vẽ thật) ⇒ giữ token. Báo cáo: <ra>.bao-cao.json.
// ============================================================================
import JSZip from 'jszip'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { convertEquation } from './mtef.mjs'

const require = createRequire(import.meta.url)
const katex = require('katex')

const KY = Buffer.from('AppsMFCC', 'latin1')
const DSI = Buffer.from('Design Science, Inc.\0', 'latin1')

/** Gom MTEF từ các bản ghi AppsMFCC của WMF. Trả Buffer MTEF hoặc null nếu WMF không phải của MathType. */
export function mtefTuWmf(buf) {
  const manh = []
  let tong = null
  let i = buf.indexOf(KY)
  while (i >= 0) {
    // sau chữ ký: u16 phiên bản · u32 tổng độ dài MTEF · u32 độ dài mảnh này · "Design Science, Inc.\0" · mảnh MTEF
    // (hai độ dài KHÔNG tính chuỗi Design Science — đo trên sách 5T: escape 329 byte = 8 + 10 + 21 + 290)
    const tongMoi = buf.readUInt32LE(i + 10), dai = buf.readUInt32LE(i + 14)
    if (tong === null) tong = tongMoi
    const dau = i + 18
    if (!buf.subarray(dau, dau + DSI.length).equals(DSI)) throw new Error('không có chữ ký Design Science')
    manh.push(buf.subarray(dau + DSI.length, dau + DSI.length + dai))
    i = buf.indexOf(KY, dau + DSI.length + dai)
  }
  if (!manh.length) return null
  const du = Buffer.concat(manh)
  if (du.length !== tong) throw new Error(`MTEF thiếu mảnh: ${du.length}/${tong} byte`)
  return du
}

/** MTEF trần → LaTeX qua convertEquation (cần giả header OLE 28 byte như stream "Equation Native"). */
export function texTuWmf(buf) {
  const mtef = mtefTuWmf(buf)
  if (!mtef) return { ok: false, reason: 'không phải WMF của MathType' }
  const hdr = Buffer.alloc(28)
  hdr.writeUInt16LE(28, 0); hdr.writeUInt32LE(0x00020000, 2); hdr.writeUInt32LE(mtef.length, 8)
  return convertEquation(Buffer.concat([hdr, mtef]))
}

const laCli = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())
if (laCli) {
  const args = process.argv.slice(2)
  const [docx, goc] = args.filter((a) => !a.startsWith('--'))
  const ra = args[args.indexOf('--ra') + 1]
  if (!docx || !goc || args.indexOf('--ra') < 0) { console.error('Dùng: node scripts/kho/mathtype-thu/wmf-mtef.mjs "<file.docx>" <goc.txt> --ra <goc-tex.txt>'); process.exit(2) }
  const zip = await JSZip.loadAsync(readFileSync(docx))
  const ketQua = {}
  const dem = { wmf: 0, doi_duoc: 0, rong: 0, khong_phai_mathtype: 0, hong: 0, katex_hong: 0 }
  const hong = []
  for (const n of Object.keys(zip.files).filter((n) => /^word\/media\/.*\.wmf$/i.test(n))) {
    dem.wmf++
    const ten = n.split('/').pop()
    let r
    try { r = texTuWmf(await zip.file(n).async('nodebuffer')) } catch (e) { r = { ok: false, reason: e.message } }
    if (!r.ok) {
      if (r.reason === 'không phải WMF của MathType') dem.khong_phai_mathtype++
      else { dem.hong++; hong.push({ anh: ten, ly_do: r.reason }) }
      continue
    }
    if (r.empty) { dem.rong++; ketQua[ten] = ''; continue }
    const cb = console.warn; console.warn = () => {}
    try { katex.renderToString(r.latex, { throwOnError: true }) } catch (e) { dem.katex_hong++; hong.push({ anh: ten, ly_do: 'KaTeX: ' + String(e.message).slice(0, 100), latex: r.latex }); continue } finally { console.warn = cb }
    dem.doi_duoc++
    ketQua[ten] = r.latex
  }
  let thay = 0, conToken = 0
  const vb = readFileSync(goc, 'utf8').replace(/\[\[img:([^\]]+\.wmf)\]\]/gi, (m, ten) => {
    if (ten in ketQua) { thay++; return ketQua[ten] === '' ? '' : `$${ketQua[ten]}$` }
    conToken++; return m
  })
  writeFileSync(ra, vb)
  const bc = { docx, ...dem, thay_trong_van_ban: thay, token_wmf_con_lai: conToken, hong }
  writeFileSync(ra.replace(/\.txt$/, '') + '.bao-cao.json', JSON.stringify(bc, null, 2))
  console.log(JSON.stringify({ ...bc, hong: hong.length }, null, 2))
}
