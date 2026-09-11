import { parse, mathOf, ev, solve, canonOf } from './mcq-auto.mjs'

const cases = [
  ['Tìm $x$, biết: $(9\\sqrt{x}-4)(x^2+4)=0$.', '16/81'],
  ['Tìm $x$, biết: $(4\\sqrt{x}-3)(x^2+9)=0$.', '9/16'],
  ['Tìm $x$, biết: $(5\\sqrt{x}-2)(x^2+1)=0$.', '4/25'],
  ['Tìm $x$, biết: $(7\\sqrt{x}-5)(x^2+16)=0$.', '25/49'],
  ['Tìm $x$, biết: $(6\\sqrt{x}-1)(x^2+25)=0$.', '1/36'],
  ['Tìm $x$, biết: $(8\\sqrt{x}-7)(x^2+36)=0$.', '49/64'],
  ['Tìm $x$ biết: $(2\\sqrt{x}-1)(4x^2-9)=0$ với $x \\ge 0$.', '{1/4,3/2}'],
  ['Tìm $x$ biết: $(3\\sqrt{x}-2)(x^2-16)=0$ với  $x\\ge0$.', '{4,4/9}'],
  ['Tìm $x$ biết: $(4\\sqrt{x}-3)(9x^2-25)=0$ với $x\\ge0$.', '{5/3,9/16}'],
  ['Tìm $x$ biết: $(5\\sqrt{x}-1)(x^2-9)=0$ với $x\\ge0$.', '{1/25,3}'],
  ['Tìm $x$ biết: $(2\\sqrt{x}-3)(25x^2-16)=0$ với $x\\ge0$.', '{4/5,9/4}'],
  ['Tìm $x$ biết: $(6\\sqrt{x}-5)(4x^2-49)=0$ với $x\\ge0$.', '{25/36,7/2}'],
]

let okN = 0
for (const [noi_dung, expect] of cases) {
  const m = mathOf(noi_dung)
  let tree, err
  try { tree = parse(m) } catch (e) { err = e.message }
  if (err) { console.log('PARSE-FAIL', noi_dung, '=>', err); continue }
  let v
  try { v = tree.t === 'eq' ? solve(tree, { rule: null }) : ev(tree, { rule: null }) } catch (e) { console.log('EVAL-THROW', noi_dung, '=>', e.message); continue }
  const c = v ? canonOf(v) : null
  const ok = c === expect
  if (ok) okN++
  console.log(ok ? 'OK  ' : 'DIFF', JSON.stringify(m), '=>', c, `(expect ${expect})`)
}
console.log(`\n${okN}/${cases.length} khớp đáp số kho`)
