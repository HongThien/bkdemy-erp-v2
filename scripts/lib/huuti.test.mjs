// node --test scripts/lib/
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { parseHuuTi, hinhThuc } from './huuti.mjs'

const canon = (s) => { const r = parseHuuTi(s); return r.ok ? r.canon : `FAIL:${r.ly_do}` }

test('đáp số kho thật — các kiểu viết lệch nhau cùng ra 1 giá trị', () => {
  assert.equal(canon('-2'), '-2')
  assert.equal(canon('$\\dfrac{-5}{17}$'), '-5/17')
  assert.equal(canon('-$\\dfrac{17}{2}$'), '-17/2')
  assert.equal(canon('\\dfrac{7}{3}'), '7/3')
  assert.equal(canon('-\\dfrac{5}{4}'), '-5/4')
  assert.equal(canon('$\\dfrac{5}{-4}$'), '-5/4')
  assert.equal(canon('$-\\dfrac{-5}{-4}$'), '-5/4')
  assert.equal(canon('\\dfrac{707}{200}'), '707/200')
  assert.equal(canon('$6$'), '6')
  assert.equal(canon('$\\left(-\\dfrac{3}{2}\\right)$'), '-3/2')
  assert.equal(canon('(-5)/4'), '-5/4')
  assert.equal(canon('x = 39'), '39')
  assert.equal(canon('1.'), '1')
})

test('tương đương giá trị (bẫy distractor trùng key)', () => {
  assert.equal(canon('\\dfrac{4}{8}'), canon('\\dfrac{1}{2}'))
  assert.equal(canon('0,5'), canon('\\dfrac{1}{2}'))
  assert.equal(canon('0.25'), '1/4')
  assert.equal(canon('-0,4'), '-2/5')
  assert.equal(canon('\\dfrac{-5}{4}'), canon('\\dfrac{5}{-4}'))
  assert.equal(canon('\\dfrac{25}{24}'), '25/24')
  assert.equal(canon('\\frac{1,5}{3}'), '1/2')
})

test('tập nghiệm — sắp tăng, tách ; hoặc "hoặc"', () => {
  assert.equal(canon('$\\dfrac{-1}{27}; \\dfrac{-8}{27}$'), '{-8/27,-1/27}')
  assert.equal(canon('$\\dfrac{7}{6}$; $\\dfrac{1}{6}$'), '{1/6,7/6}')
  assert.equal(canon('x = 2 hoặc x = -2'), '{-2,2}')
  assert.equal(canon('1, 2'), '{1,2}')
  assert.equal(canon('0,25'), '1/4')       // dấu phẩy thập phân, KHÔNG phải tập
  assert.equal(parseHuuTi('2; 2').ok, false)
})

test('không đoán — fail có lý do', () => {
  assert.equal(parseHuuTi('a) 36000\nb) 72000').ok, false)
  assert.equal(parseHuuTi('Chứng minh $A < \\dfrac{9}{121}$').ok, false)
  assert.equal(parseHuuTi('$\\dfrac{17^{21}-1}{16\\cdot 17^{20}}$').ok, false)
  assert.equal(parseHuuTi('25%').ok, false)
  assert.equal(parseHuuTi('\\sqrt{2}').ok, false)
  assert.equal(parseHuuTi('').ok, false)
  assert.equal(parseHuuTi('1.000').ok, true)   // hiểu là 1,000 thập phân = 1 — ghi nhận, người duyệt soi
})

test('hình thức hiển thị', () => {
  assert.equal(hinhThuc('$-\\dfrac{5}{4}$'), 'phan_so')
  assert.equal(hinhThuc('$-2$'), 'nguyen')
  assert.equal(hinhThuc('0,25'), 'thap_phan')
  assert.equal(hinhThuc('$\\dfrac{1}{6}; \\dfrac{7}{6}$'), 'tap')
})

test('\\pm và {a; b} (đáp số kho T107010404)', () => {
  assert.equal(canon('$\\pm\\dfrac{5}{2}$'), '{-5/2,5/2}')
  assert.equal(canon('$\\pm 6$'), '{-6,6}')
  assert.equal(canon('{\\dfrac{11}{6}; \\dfrac{-5}{6}}'), '{-5/6,11/6}')
  assert.equal(canon('{\\dfrac{3}{2}; -1}'), '{-1,3/2}')
  assert.equal(canon('$\\dfrac{3}{2}$'), '3/2')
})
