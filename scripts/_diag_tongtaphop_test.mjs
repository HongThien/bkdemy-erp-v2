import { tongTapHopNhoHon } from './lib/mini-dang.mjs'

const cases = [
  ['Cho tập hợp $A = \\{x \\in N|x < 3\\}$. Tổng các phần tử của $A$ bằng:', '3'],
  ['Cho tập hợp $A = \\{x \\in N|x < 5\\}$. Tổng các phần tử của $A$ bằng:', '10'],
  ['Cho tập hợp $A = \\{x \\in N|x < 4\\}$. Tổng các phần tử của $A$ bằng:', '6'],
  ['Cho tập hợp $A = \\{x \\in N|x < 6\\}$. Tổng các phần tử của $A$ bằng:', '15'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const r = tongTapHopNhoHon(nd, null)
  const got = r?.value ? r.value.p.toString() : null
  const same = got === expect
  if (same) ok++
  console.log(same ? 'OK  ' : 'DIFF', nd, '=>', got, `(kỳ vọng ${expect})`)
  for (const rule of ['R81', 'R82', 'R83', 'R84']) {
    const d = tongTapHopNhoHon(nd, rule)
    console.log('  ', rule, d?.value ? d.value.p.toString() : '(n/a)', d?.ds ?? '')
  }
}
console.log(`\n${ok}/${cases.length} khớp đáp số kho`)
