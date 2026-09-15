import { uocBoiCoBan } from './lib/mini-dang.mjs'

const cases = [
  ['Tìm năm bội của $2$.', '0; 2; 4; 6; 8'],
  ['Tìm tất cả các ước của $6$.', '1; 2; 3; 6'],
  ['Tìm các số tự nhiên $x$ sao cho: $30 \\vdots x$.', '1; 2; 3; 5; 6; 10; 15; 30'],
  ['Tìm các số tự nhiên $a$ sao cho: $a \\in \\text{Ư}(18)$ và $a>4$.', '6; 9; 18'],
  ['Tìm các số tự nhiên $x$ sao cho: $x \\in U(48)$ và $x \\ge 15$.', '16; 24; 48'],
  ['Tìm các số tự nhiên $x$ sao cho: $x \\in B(13)$ và $23 \\le x \\le 58$.', '26; 39; 52'],
  ['Tìm các số tự nhiên $x$ sao cho: $x \\in B(27)$ và $x < 100$.', '0; 27; 54; 81'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const r = uocBoiCoBan(nd, null)
  const same = r?.text === expect
  if (same) ok++
  console.log(same ? 'OK  ' : 'DIFF', nd, '=>', r?.text, `(kỳ vọng ${expect})`)
  for (const rule of ['R73', 'R74', 'R75', 'R76']) {
    const d = uocBoiCoBan(nd, rule)
    console.log('  ', rule, d?.text ?? '(n/a)', d?.ds ?? '')
  }
}
console.log(`\n${ok}/${cases.length} khớp đáp số kho`)
