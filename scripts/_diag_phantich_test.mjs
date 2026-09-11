import { phanTichNguyenTo, evalFactorText, chuanHoaFactorText } from './lib/mini-dang.mjs'

const cases = [
  ['Phân tích $242$ ra thừa số nguyên tố.', '2\\cdot 11^2'],
  ['Phân tích $132$ ra thừa số nguyên tố.', '2^2\\cdot 3\\cdot 11'],
  ['Phân tích $208$ ra thừa số nguyên tố.', '2^4\\cdot 13'],
  ['Phân tích $12$ ra thừa số nguyên tố.', '2^2\\cdot 3'],
  ['Phân tích $256$ ra thừa số nguyên tố.', '2^8'],
  ['Phân tích $210$ ra thừa số nguyên tố.', '2\\cdot 3\\cdot 5\\cdot 7'],
]
let ok = 0
for (const [nd, expect] of cases) {
  const r = phanTichNguyenTo(nd, null)
  const got = chuanHoaFactorText(r?.text)
  const exp = chuanHoaFactorText(`$${expect}$`)
  const same = got === exp
  if (same) ok++
  console.log(same ? 'OK  ' : 'DIFF', got, 'expect', exp)
  const n = evalFactorText(exp)
  console.log('  giá trị đúng =', n?.toString())
  for (const rule of ['R53', 'R54', 'R55', 'R56']) {
    const d = phanTichNguyenTo(nd, rule)
    if (!d) { console.log('  ', rule, '(không áp dụng)'); continue }
    const v = evalFactorText(d.text)
    console.log('  ', rule, d.text, '| giá trị=', v?.toString(), v === n ? '(CÙNG giá trị — cố ý)' : '(khác giá trị)', '|', d.ds)
  }
}
console.log(`\n${ok}/${cases.length} khớp đáp số kho`)
