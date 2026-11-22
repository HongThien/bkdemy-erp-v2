// xuong-dong.mjs — áp luật trình bày "hết câu là xuống dòng, xuống dòng liên tục, không viết full dòng" (Thùy 22/11, spec-giai-bai.md §A18)
// cho các tệp chữ lý thuyết / ví dụ (lt-*.md, vd-*.md). Chỉ đổi chỗ XUỐNG DÒNG (không đụng chữ, không đụng công thức).
//   node kho-rules/hinh/lo/k8T-thales/lt/xuong-dong.mjs <tệp.md> [...]  — ghi đè tại chỗ; tự kiểm "bỏ hết khoảng trắng thì y hệt trước"; chạy lại nhiều lần vẫn ra cùng kết quả.
// Luật: (0) gộp lại dòng đã ngắt dở (ngoặc chưa đóng · dòng kết bằng phẩy mà dòng sau mở bằng công thức) · (1) hết câu (dấu chấm ngoài công thức, sau đó là chữ hoa / công thức) ⇒ xuống dòng ·
//       (2) câu hiển thị > 66 ký tự ⇒ ngắt TRƯỚC "nên / Mà / Do đó / Suy ra / tức / thì / Vậy" · (3) vẫn dài ⇒ ngắt sau dấu phẩy gần giữa (ngoài ngoặc, vế sau mở bằng chữ).
// Ghi chú kỹ thuật: tool soạn tệp nuốt dấu gạch chéo ngược ⇒ biểu thức chính quy dựng bằng R() với ký hiệu § thay cho gạch chéo ngược.
import { readFileSync, writeFileSync } from 'node:fs'
const BS = String.fromCharCode(92)
const R = (src, flags = '') => new RegExp(src.split('§').join(BS), flags)
const GIOI_HAN = 66
let MATH = []
const giauMath = (t) => t.replace(R('[$][^$]*[$]', 'g'), (m) => { MATH.push(m); return String.fromCharCode(1) + (MATH.length - 1) + String.fromCharCode(1) })
const hoiMath = (t) => t.replace(R('§u0001(§d+)§u0001', 'g'), (_, i) => MATH[+i])
const hienThi = (s) => s.replace(R('§u0001(§d+)§u0001', 'g'), (_, i) => MATH[+i].slice(1, -1).replace(R('§§[a-zA-Z]+', 'g'), 'x').replace(R('[{}]', 'g'), '')).length
const NOI = R('§s+(?=(?:nên|Mà|mà|Do đó|do đó|Suy ra|suy ra|tức|thì|Vậy|vậy)§s)')
const THE = R('^(##|§{§{)')
const tachCau = (t) => t.split(R('(?<=[.])§s+(?=[A-ZĐÀ-Ỹ]|§u0001)'))
function ngatPhay(c) {
  const vt = []; let sau = 0
  for (let i = 0; i < c.length; i++) {
    if (c[i] === '(') sau++; else if (c[i] === ')') sau--
    else if (sau === 0 && c[i] === ',' && c[i + 1] === ' ' && R('[a-zà-ỹ]').test(c[i + 2] ?? '')) vt.push(i)
  }
  let tot = null
  for (const i of vt) {
    const a = c.slice(0, i + 1), b = c.slice(i + 2)
    if (hienThi(a) < 14 || hienThi(b) < 14) continue
    if (tot === null || Math.abs(hienThi(a) - hienThi(b)) < Math.abs(hienThi(c.slice(0, tot + 1)) - hienThi(c.slice(tot + 2)))) tot = i
  }
  if (tot === null) return [c]
  return [c.slice(0, tot + 1), c.slice(tot + 2)].flatMap(ngatDai)
}
function ngatDai(c) {
  if (hienThi(c) <= GIOI_HAN) return [c]
  const toks = c.split(NOI)
  if (toks.length < 2) return ngatPhay(c)
  const dong = []; let cur = toks[0]
  for (let i = 1; i < toks.length; i++) { if (hienThi(cur) >= 14) { dong.push(cur); cur = toks[i] } else cur += ' ' + toks[i] }
  dong.push(cur)
  return dong.flatMap((d) => (d === c ? ngatPhay(d) : ngatDai(d)))
}
function xuLyDong(line) {
  if (R('^§s*$').test(line) || THE.test(line) || R('^Bài giải:').test(line)) return [line]
  const m = line.match(R('^(§s*-§s+)(.*)$'))
  const dau = m ? m[1] : '', than = m ? m[2] : line
  const dongs = tachCau(giauMath(than)).flatMap(ngatDai).map(hoiMath)
  return dongs.map((d, i) => (i === 0 ? dau + d : (m ? '  ' : '') + d))
}
function gopLai(text) {
  const gop = []
  for (const l of text.split('\n')) {
    const truoc = gop[gop.length - 1]
    if (truoc !== undefined && !THE.test(truoc) && !THE.test(l) && truoc.trim() !== '' && l.trim() !== '') {
      const h = giauMath(truoc)
      const moNgoac = (h.match(R('§(', 'g')) || []).length > (h.match(R('§)', 'g')) || []).length
      const phayCongThuc = truoc.endsWith(',') && l.startsWith('$')
      if (moNgoac || phayCongThuc) { gop[gop.length - 1] = truoc + ' ' + l; continue }
    }
    gop.push(l)
  }
  return gop.join('\n')
}
for (const f of process.argv.slice(2)) {
  MATH = []
  const goc = readFileSync(f, 'utf8').split(BS + 'r').join('')
  const moi = gopLai(goc).split('\n').flatMap(xuLyDong).join('\n')
  const bo = (s) => s.replace(R('§s+', 'g'), '')
  if (bo(goc) !== bo(moi)) { console.error(`✗ ${f}: chữ bị đổi — KHÔNG ghi`); process.exitCode = 1; continue }
  writeFileSync(f, moi)
  const dai = moi.split('\n').filter((l) => !THE.test(l) && hienThi(giauMath(l)) > 70)
  console.log(`✔ ${f}: ${goc.split('\n').length} → ${moi.split('\n').length} dòng · còn ${dai.length} dòng hiển thị > 70 ký tự`)
}
