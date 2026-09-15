import { parse, mathOf, ev, solve, canonOf } from './mcq-auto.mjs'

const cases = [
  ['Tìm $x$ biết: $\\left(3^x-27\\right)\\left(\\sqrt{x^2+1}-\\dfrac{5}{3}\\right)=0$.', '{-4/3,4/3,3}'],
  ['Tìm $x$ biết: $\\left(2^x-16\\right)\\left(\\sqrt{x^2+7}-4\\right)=0$.', '{-3,3,4}'],
  ['Tìm $x$ biết: $\\left(5^x-125\\right)\\left(\\sqrt{x^2+9}-5\\right)=0$.', '{-4,3,4}'],
  ['Tìm $x$ biết: $\\left(4^x-64\\right)\\left(\\sqrt{x^2+5}-3\\right)=0$.', '{-2,2,3}'],
  ['Tìm $x$ biết: $\\left(3^x-81\\right)\\left(\\sqrt{x^2+7}-4\\right)=0$.', '{-3,3,4}'],
  ['Tìm $x$ biết: $\\left(2^x-32\\right)\\left(\\sqrt{x^2+16}-5\\right)=0$.', '{-3,3,5}'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const m = mathOf(nd)
  let v
  try { v = solve(parse(m), { rule: null }) } catch (e) { console.log('THROW', e.message, m.slice(0, 60)); continue }
  const c = v ? canonOf(v) : 'FAIL'
  if (c === expect) ok++
  console.log(c === expect ? 'OK  ' : 'DIFF', c, 'expect', expect, '|', m.slice(0, 70))
}
console.log(`\n${ok}/${cases.length}`)
