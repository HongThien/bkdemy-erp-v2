import { uclnBcnnDinhNghia, tapUcBc } from './lib/mini-dang.mjs'

console.log('=== T106040102/202 (1 giá trị) ===')
const cases1 = [
  ['Tìm UCLN bằng định nghĩa của $20$ và $30$.', '10'],
  ['Tìm UCLN bằng định nghĩa của $18; 24$ và $30$.', null],
  ['Tìm UCLN bằng phân tích thừa số nguyên tố của $24$ và $36$.', '12'],
  ['Tìm BCNN bằng định nghĩa của $4$ và $6$.', '12'],
  ['Tìm BCNN bằng cách phân tích ra thừa số nguyên tố của $6$ và $8$.', '24'],
]
for (const [nd, expect] of cases1) {
  const r = uclnBcnnDinhNghia(nd, null)
  console.log(nd, '=>', r?.value ? `${r.value.p}/${r.value.q}` : r, expect ? `(kỳ vọng ${expect})` : '')
  for (const rule of ['R62', 'R63', 'R64', 'R65']) {
    const d = uclnBcnnDinhNghia(nd, rule)
    console.log('  ', rule, d ? `${d.value.p}` : '(n/a)', d?.ds ?? '')
  }
}

console.log('\n=== T106040104 (n lớn nhất / n<C / C<n<D) ===')
const cases2 = [
  ['Tìm số tự nhiên $n$ lớn nhất sao cho $36 \\vdots n$ và $48 \\vdots n$.', '12'],
  ['Tìm số tự nhiên $n$ biết rằng $36 \\vdots n$ và $48 \\vdots n$ và $n<15$.', '1; 2; 3; 4; 6; 12'],
  ['Tìm số tự nhiên $n$ biết rằng $45 \\vdots n$ và $60 \\vdots n$ và $2<n<10$.', '3; 5'],
]
for (const [nd, expect] of cases2) {
  const r = tapUcBc(nd, null)
  console.log(nd, '=>', r?.text, `(kỳ vọng ${expect})`, r?.text === expect ? 'OK' : 'DIFF')
  for (const rule of ['R62', 'R63', 'R64', 'R66', 'R67', 'R68', 'R69']) {
    const d = tapUcBc(nd, rule)
    console.log('  ', rule, d?.text ?? '(n/a)', d?.ds ?? '')
  }
}

console.log('\n=== T106040204 (n nhỏ nhất / D<n<E) ===')
const cases3 = [
  ['Tìm số tự nhiên $n$ nhỏ nhất khác $0$ biết rằng $n:12$ và $n:15$.', '60'],
  ['Tìm số tự nhiên $n$ biết rằng $n:4$, $n:6$, $n:8$ và $40<n<100$.', '48; 72; 96'],
  ['Tìm số tự nhiên $n$ biết rằng $n:6$, $n:10$, $n:14$ và $200<n<600$.', '210; 420'],
]
for (const [nd, expect] of cases3) {
  const r = tapUcBc(nd, null)
  console.log(nd, '=>', r?.text, `(kỳ vọng ${expect})`, r?.text === expect ? 'OK' : 'DIFF')
  for (const rule of ['R62', 'R63', 'R64', 'R65', 'R66', 'R67', 'R69']) {
    const d = tapUcBc(nd, rule)
    console.log('  ', rule, d?.text ?? '(n/a)', d?.ds ?? '')
  }
}
