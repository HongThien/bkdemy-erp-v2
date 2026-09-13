import { bacDonThuc, heSoDonThuc, demDonThucTrongDanhSach, demDongDang } from './lib/mini-dang.mjs'

console.log('=== Bậc đơn thức (T108010102) ===')
const b1 = [
  ['Bậc của đơn thức $A(x) = x^2.y.z$ là bao nhiêu:', '4'],
  ['Bậc của đơn thức $B(x) = x^3.y^2.z$ là bao nhiêu:', '6'],
  ['Bậc của đơn thức $A(x) = x^5.(3y^1z^2)^3$ là bao nhiêu:', '14'],
  ['Bậc của đơn thức $A(x) = x^3.(3y^1z^2)^2$ là bao nhiêu:', '9'],
]
for (const [nd, expect] of b1) {
  const r = bacDonThuc(nd, null)
  console.log(r?.value?.p?.toString() === expect ? 'OK  ' : 'DIFF', nd, '=>', r?.value?.p?.toString(), `(kỳ vọng ${expect})`)
  for (const rule of ['R89', 'R90', 'R91', 'R131']) { const d = bacDonThuc(nd, rule); console.log('  ', rule, d?.value?.p?.toString() ?? '(n/a)', d?.ds ?? '') }
}

console.log('\n=== Hệ số đơn thức (T108010103) ===')
const b2 = [
  ['Hệ số của đơn thức $A(x) = -x^2.y$ là bao nhiêu:', '-1'],
  ['Hệ số của đơn thức $P(x) = -\\dfrac{1}{2}x^3.y^2$ là bao nhiêu:', '-1/2'],
  ['Hệ số của đơn thức $A(x) = -x^2.(3yz^2)^3$ là bao nhiêu:', '-27'],
  ['Hệ số của đơn thức $A(m) = -m^2.(2n^2p)^2$ là bao nhiêu:', '-4'],
]
for (const [nd, expect] of b2) {
  const r = heSoDonThuc(nd, null)
  const got = r?.value ? `${r.value.p}/${r.value.q}` : null
  console.log(got, `(kỳ vọng ${expect})`, nd)
  for (const rule of ['R92', 'R93', 'R94', 'R132']) { const d = heSoDonThuc(nd, rule); console.log('  ', rule, d?.value ? `${d.value.p}/${d.value.q}` : '(n/a)', d?.ds ?? '') }
}

console.log('\n=== Đếm đơn thức (T108010101) ===')
const nd3 = 'Trong các biểu thức dưới đây có bao nhiêu đơn thức:\n$-2x^4y$, $\\dfrac{1}{5}xy^2$, $-x-5$, $x.\\dfrac{3}{-7}y^6$, $2x^2-3y$, $5$'
const r3 = demDonThucTrongDanhSach(nd3, null)
console.log(r3?.value?.p?.toString(), '(kỳ vọng 4)')
for (const rule of ['R95', 'R96', 'R97', 'R133']) { const d = demDonThucTrongDanhSach(nd3, rule); console.log('  ', rule, d?.value?.p?.toString() ?? '(n/a)', d?.ds ?? '') }

console.log('\n=== Đồng dạng (T108010104) ===')
const nd4 = 'Cho đơn thức $A = 3x^2y$. Trong các đơn thức sau: $5x^2y$; $-2xy^2$; $\\dfrac{1}{2}x^2y$; $x^2y$; $7x^3y$, có bao nhiêu đơn thức đồng dạng với đơn thức $A$?'
const r4 = demDongDang(nd4, null)
console.log(r4?.value?.p?.toString(), '(kỳ vọng 3)')
for (const rule of ['R98', 'R99', 'R130', 'R134']) { const d = demDongDang(nd4, rule); console.log('  ', rule, d?.value?.p?.toString() ?? '(n/a)', d?.ds ?? '') }
