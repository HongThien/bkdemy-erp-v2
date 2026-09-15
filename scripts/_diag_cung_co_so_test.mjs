import { parse, mathOf, ev, canonOf } from './mcq-auto.mjs'

const cases = [
  ['Tính: $\\left|-\\dfrac{3}{4}\\right|-\\left(\\dfrac{1}{5}\\right)^{2024}:\\left(\\dfrac{1}{5}\\right)^{2023}$.', '11/20'],
  ['Tính: $\\left|-\\dfrac{5}{6}\\right|-\\left(\\dfrac{1}{3}\\right)^{101}:\\left(\\dfrac{1}{3}\\right)^{100}$.', '1/2'],
  ['Tính: $\\left|-\\dfrac{2}{5}\\right|-\\left(\\dfrac{1}{10}\\right)^{2027}:\\left(\\dfrac{1}{10}\\right)^{2026}$.', '3/10'],
  ['Tính: $\\left|-\\dfrac{9}{10}\\right|-\\left(\\dfrac{1}{2}\\right)^{1001}:\\left(\\dfrac{1}{2}\\right)^{1000}$.', '2/5'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const m = mathOf(nd)
  let v
  try { v = ev(parse(m), { rule: null }) } catch (e) { console.log('THROW', e.message, m.slice(0, 60)); continue }
  const c = v ? canonOf(v) : 'FAIL'
  if (c === expect) ok++
  console.log(c === expect ? 'OK  ' : 'DIFF', c, 'expect', expect, '|', m.slice(0, 60))
}
console.log(`\n${ok}/${cases.length}`)
