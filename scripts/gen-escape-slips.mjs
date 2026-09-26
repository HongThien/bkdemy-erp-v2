// Sinh bộ mảnh giấy cố định cho BK Escape → games-site/escape/slips.js
// Chạy 1 lần: node scripts/gen-escape-slips.mjs
// ⚠ Giấy đã in + dán thì KHÔNG chạy lại (mã/chữ trên giấy sẽ lệch với iPad). Muốn đổi bộ giấy = in lại toàn bộ.
import { writeFileSync } from 'node:fs'

const SEED = 20260926, FAMILIES = 20, PER = 4
let s = SEED
const rnd = () => { s |= 0; s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296 }
const pick = a => a[Math.floor(rnd() * a.length)]
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1));[a[i], a[j]] = [a[j], a[i]] } return a }
const LETTERS = 'ABCDEFGHKLMNPRSTUVXY'.split('') // bỏ I O Q W J Z: dễ nhầm / không có trong tiếng Việt

const used = new Set(), slips = []
// 2 mã trùng ≥3/4 chữ số mà khác họ ⇒ đoán sai vô lý → tránh
const near = (a, b) => [...a].filter((c, i) => c === b[i]).length >= 3
for (let f = 0; f < FAMILIES; f++) {
  let fam
  for (let tries = 0; tries < 999; tries++) {
    const base = Array.from({ length: 4 }, () => String(Math.floor(rnd() * 10))).join('')
    const pos = shuffle([0, 1, 2, 3]).slice(0, PER - 1)
    const codes = [base, ...pos.map(p => { let d; do d = String(Math.floor(rnd() * 10)); while (d === base[p]); return base.slice(0, p) + d + base.slice(p + 1) })]
    if (codes.some(c => used.has(c))) continue
    if (codes.some(c => slips.some(o => near(c, o.code)))) continue
    fam = codes; break
  }
  const letters = shuffle([...LETTERS]).slice(0, PER)
  fam.forEach((code, i) => { used.add(code); slips.push({ code, letter: letters[i], fam: f + 1 }) })
}
shuffle(slips)
const out = `// AUTO-GEN bởi scripts/gen-escape-slips.mjs (seed ${SEED}) — KHÔNG sửa tay.
// Đây là bộ giấy đã in & dán trong phòng: mã ↔ chữ phải khớp 100% với giấy thật.
window.ESC_SLIPS=${JSON.stringify(slips)};
`
writeFileSync('games-site/escape/slips.js', out)
console.log(slips.length, 'mảnh ·', FAMILIES, 'họ')
