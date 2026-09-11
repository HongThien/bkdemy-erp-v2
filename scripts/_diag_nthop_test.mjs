import { nhanBietNguyenToHopSo, chuanHoaTapText } from './lib/mini-dang.mjs'

const cases = [
  ['Trong các số sau, số nào là Số nguyên tố: $2; 5; 15; 23; 26; 32; 39; 41; 47$.', '2; 5; 23; 41; 47'],
  ['Trong các số sau, số nào là Số nguyên tố: $5; 10; 22; 26; 34; 35; 42$.', '5'],
  ['Trong các số sau, số nào là Hợp số: $2; 8; 26; 41; 46$.', '8; 26; 46'],
  ['Trong các số sau, số nào là Hợp số: $0; 7; 11; 16; 17; 19; 22; 31; 37$.', '16; 22'],
  ['Trong các số sau, số nào là Hợp số: $3; 13; 19; 53; 55$.', '55'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const r = nhanBietNguyenToHopSo(nd, null)
  const got = chuanHoaTapText(r?.text)
  const exp = chuanHoaTapText(expect)
  const same = got === exp
  if (same) ok++
  console.log(same ? 'OK  ' : 'DIFF', got, 'expect', exp)
  for (const rule of ['R57', 'R58', 'R59', 'R60']) {
    const d = nhanBietNguyenToHopSo(nd, rule)
    if (!d) { console.log('  ', rule, '(không áp dụng)'); continue }
    console.log('  ', rule, d.text, '|', d.ds)
  }
}
console.log(`\n${ok}/${cases.length} khớp đáp số kho`)
