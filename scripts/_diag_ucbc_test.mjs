import { ucBcCoBan } from './lib/mini-dang.mjs'

const cases = [
  ['Tìm $\\text{UC}(18;24)$.', '1; 2; 3; 6'],
  ['Tìm $\\text{UC}(20;30)$.', '1; 2; 5; 10'],
  ['Tìm $BC(4;6)$.', '0; 12; 24; ....'],
  ['Tìm $BC(6;9)$.', '0; 18; 36; ....'],
  ['Tìm $BC(7;8)$.', '0; 56; 112; ....'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const r = ucBcCoBan(nd, null)
  const same = r?.text === expect
  if (same) ok++
  console.log(same ? 'OK  ' : 'DIFF', nd, '=>', r?.text, `(kỳ vọng ${expect})`)
  const rules = nd.includes('UC') ? ['R73', 'R74', 'R75', 'R76'] : ['R77', 'R78', 'R79', 'R80']
  for (const rule of rules) {
    const d = ucBcCoBan(nd, rule)
    console.log('  ', rule, d?.text ?? '(n/a)', d?.ds ?? '')
  }
}
console.log(`\n${ok}/${cases.length} khớp đáp số kho`)
