import { parse, mathOf, solve, canonOf } from './mcq-auto.mjs'

const cases = [
  ['Tìm x biết: $2^{x-1} = 2^3 \\cdot 4$.', '6'],
  ['Tìm x biết: $2^{x+1} = 2^4 \\cdot 8$.', '6'],
  ['Tìm x biết $20 + 5^{x+3} = 170 - 5^2$', '0'],
  ['Tìm x biết : $10-2^{x+2} = 1.(3^1-1)$', '1'],
  ['Tìm x biết $30 + 3^{x+1} = 300 - 3^3$', '4'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const m = mathOf(nd, { chamLaNhan: true })
  let v
  try { v = solve(parse(m), { rule: null }) } catch (e) { console.log('THROW', e.message, m.slice(0, 60)); continue }
  const c = v ? canonOf(v) : 'FAIL'
  if (c === expect) ok++
  console.log(c === expect ? 'OK  ' : 'DIFF', c, 'expect', expect, '|', m.slice(0, 70))
}
console.log(`\n${ok}/${cases.length}`)
