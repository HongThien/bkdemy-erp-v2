// Sinh bộ mảnh giấy cố định cho BK Escape → games-site/escape/slips.js
// Chạy 1 lần: node scripts/gen-escape-slips.mjs
// ⚠ Giấy đã in + dán thì KHÔNG chạy lại (mã/chữ trên giấy sẽ lệch với iPad). Muốn đổi bộ giấy = in lại toàn bộ.
//
// Cấu trúc (Thùy chốt 26/09, thay bộ 80 mảnh vì quá dễ đoán): 15 HỌ, mỗi họ = 1 mảnh GỐC + ở MỖI vị trí 3 mảnh
// khác gốc đúng 1 chữ số ⇒ 13 mảnh/họ, ~195 mảnh. iPad CHỈ chọn mảnh gốc làm đích.
// ⇒ sai 1 câu (biết 3/4 số) còn ~4 mảnh khớp (~25% đoán trúng); sai 2 câu ~9 mảnh (~14%).
import { writeFileSync } from 'node:fs'

const SEED = 20260926, HUBS = 15, PER = 3
let s = SEED
const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
const LETTERS = 'ABCDEFGHKLMNPRSTUVXY'.split('') // 20 chữ: bỏ I O Q W J Z (dễ nhầm / không có trong tiếng Việt)
const same = (a, b) => [...a].filter((c, i) => c === b[i]).length

const used = new Set(), slips = [], hubs = []
for (let h = 0; h < HUBS; h++) {
  let fam
  for (let tries = 0; tries < 5000 && !fam; tries++) {
    const base = Array.from({ length: 4 }, () => String(Math.floor(rnd() * 10))).join('')
    if ([...base].filter(c => c === '0').length > 1) continue       // chữ số 0 ít câu hỏi ⇒ gốc tối đa 1 số 0
    if (hubs.some(o => same(o, base) >= 2)) continue                  // 2 gốc khác nhau ≥3 chỗ ⇒ họ không chồng lên nhau
    const codes = [base]
    for (let p = 0; p < 4; p++) for (const d of shuffle([...'0123456789'].filter(d => d !== base[p])).slice(0, PER)) codes.push(base.slice(0, p) + d + base.slice(p + 1))
    if (codes.some(c => used.has(c))) continue
    fam = codes; hubs.push(base)
  }
  if (!fam) throw new Error('không sinh được họ ' + (h + 1))
  const letters = shuffle([...LETTERS])
  fam.forEach((code, i) => { used.add(code); slips.push({ code, letter: letters[i], fam: h + 1, ...(i === 0 ? { hub: 1 } : {}) }) })
}
shuffle(slips)
const out = `// AUTO-GEN bởi scripts/gen-escape-slips.mjs (seed ${SEED}) — KHÔNG sửa tay.
// Bộ giấy đã in & dán trong phòng: mã ↔ chữ phải khớp 100% với giấy thật. hub:1 = mảnh gốc (chỉ mảnh này được chọn làm đích).
window.ESC_SLIPS_ID='G${slips.length}-${SEED % 10000}'; // mã bộ giấy: in trên từng trang + hiện ở màn quản trò ⇒ lệch phiên bản là thấy ngay
window.ESC_SLIPS=${JSON.stringify(slips)};
`
writeFileSync('games-site/escape/slips.js', out)
console.log(slips.length, 'mảnh ·', HUBS, 'họ · gốc:', hubs.join(' '))
