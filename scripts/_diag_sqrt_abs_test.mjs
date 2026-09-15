import { parse, mathOf, ev, solve, canonOf } from './mcq-auto.mjs'

const cases = [
  ['Tính $\\sqrt{169}$.', '13'],
  ['Tính: $\\left(-\\dfrac{5}{2}\\right)^2\\cdot0,16-\\sqrt{\\dfrac{9}{16}}:\\dfrac{3}{4}+(-2024)^0$.', '1'],
  ['Tính: $M=\\left(\\sqrt{\\dfrac{4}{9}}+\\sqrt{\\dfrac{25}{36}}-\\sqrt{\\dfrac{1}{4}}\\right):\\sqrt{\\dfrac{16}{25}}$.', '5/4'],
  ['Tìm $x$ biết: $\\sqrt{x+25}+8=20$.', '119'],
  ['Tính: $\\left(-\\dfrac{5}{3}\\right)^2\\cdot|0,36|-\\sqrt{\\dfrac{16}{49}}:\\left|\\dfrac{8}{7}\\right|+(-2030)^0$.', '3/2'],
  ['Tính: $\\sqrt{\\dfrac{4}{25}}+\\left(-\\dfrac{2}{5}\\right)^3-\\left|-\\dfrac{1}{3}\\right|\\cdot\\dfrac{3}{5}$.', '17/125'],
  ['Tính: $\\sqrt{\\dfrac{16}{49}}+\\left(-\\dfrac{1}{2}\\right)^3-\\left|-\\dfrac{2}{7}\\right|\\cdot\\dfrac{7}{4}$.', '-3/56'],
  ['Tìm $x$ biết: $\\dfrac{13}{15}-4\\left|\\dfrac{1}{5}-5x\\right|=\\dfrac{1}{15}$.', '{0,2/25}'],
  ['Tìm $x$ biết: $|x|=\\dfrac{3}{4}$.', '{-3/4,3/4}'],
  ['Tìm $x$ biết: $15-5|1-x|=5$.', '{-1,3}'],
]

for (const [noi_dung, expect] of cases) {
  const m = mathOf(noi_dung)
  let tree, err
  try { tree = parse(m) } catch (e) { err = e.message }
  if (err) { console.log('PARSE-FAIL', noi_dung, '=>', err); continue }
  let v
  try { v = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null }) } catch (e) { console.log('EVAL-THROW', noi_dung, '=>', e.message); continue }
  const c = v ? canonOf(v) : null
  console.log(c === expect ? 'OK  ' : 'DIFF', JSON.stringify(m), '=>', c, expect ? `(expect ${expect})` : '')
}
