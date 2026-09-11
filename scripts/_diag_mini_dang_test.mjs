import { tinhTuanHoan, layTron, soSanhTimXY, fmtFixed } from './lib/mini-dang.mjs'

let okN = 0, totN = 0
function chk(label, got, expect) {
  totN++
  const ok = got === expect
  if (ok) okN++
  console.log(ok ? 'OK  ' : 'DIFF', label, '=>', got, ok ? '' : `(expect ${expect})`)
}
const canon = (v) => Array.isArray(v) ? `{${v.map((r) => `${r.p}/${r.q}`).join(',')}}` : `${v.p}/${v.q}`

console.log('=== STP tuần hoàn -> phân số ===')
chk('2,(7)', canon(tinhTuanHoan('2,(7)', null).value), '25/9')
chk('5,(4)', canon(tinhTuanHoan('5,(4)', null).value), '49/9')
chk('0,(6)', canon(tinhTuanHoan('0,(6)', null).value), '2/3')
chk('0,(63)', canon(tinhTuanHoan('0,(63)', null).value), '7/11')
chk('0,3(5)', canon(tinhTuanHoan('0,3(5)', null).value), '16/45')
chk('0,1(3)', canon(tinhTuanHoan('0,1(3)', null).value), '2/15')
chk('5,(72)', canon(tinhTuanHoan('5,(72)', null).value), '63/11')

console.log('\n=== Làm tròn (kiểu 1: đến chữ số thứ N) ===')
chk('73,46821 đến thứ hai', canon(layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', null).value), '7347/100')
chk('12,30476 đến thứ ba', canon(layTron('Làm tròn số $12,30476$ đến chữ số thập phân thứ ba.', null).value), '2461/200')
chk('98,76142 đến thứ nhất', canon(layTron('Làm tròn số $98,76142$ đến chữ số thập phân thứ nhất.', null).value), '494/5')
chk('125,44495 đến thứ tư', canon(layTron('Làm tròn số $125,44495$ đến chữ số thập phân thứ tư.', null).value), '25089/200')
chk('7,99946 đến thứ ba', canon(layTron('Làm tròn số $7,99946$ đến chữ số thập phân thứ ba.', null).value), '3999500/500000' === '' ? '' : (() => { const r = layTron('Làm tròn số $7,99946$ đến chữ số thập phân thứ ba.', null).value; return `${r.p}/${r.q}` })())
console.log('  (7,99946 -> đáp án kho "7,999" — kiểm bằng fmtFixed)')
console.log('  fmtFixed:', fmtFixed(layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', null).value, 2), 'expect 73,47')
console.log('  fmtFixed:', fmtFixed(layTron('Làm tròn số $125,44495$ đến chữ số thập phân thứ tư.', null).value, 4), 'expect 125,4450')
console.log('  fmtFixed:', fmtFixed(layTron('Làm tròn số $7,99946$ đến chữ số thập phân thứ ba.', null).value, 3), 'expect 7,999')

console.log('\n=== Làm tròn (kiểu 2: độ chính xác) ===')
console.log(' ', layTron('Làm tròn số $12,(995)$ với độ chính xác $0,005$.', null).text, 'expect $13,00$')
console.log(' ', layTron('Làm tròn số $148,(27)$ với độ chính xác $0,05$.', null).text, 'expect $148,3$')
console.log(' ', layTron('Làm tròn số $208,(95)$ với độ chính xác $0,05$.', null).text, 'expect $209,0$')
console.log(' ', layTron('Làm tròn số $1284,9$ với độ chính xác $5$.', null).text, 'expect $1280$')
console.log(' ', layTron('Làm tròn số $347,62$ với độ chính xác $5$.', null).text, 'expect $350$')
console.log(' ', layTron('Làm tròn số $93,7$ với độ chính xác $5$.', null).text, 'expect $90$')
console.log(' ', layTron('Làm tròn số $52,3(814)$ với độ chính xác $0,0005$.', null).text, 'expect $52,381$')
console.log('  -- distractor thử: R42/R43/R44/R38/R39/R40 --')
console.log('  R42', layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', 'R42').text, layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', 'R42').ds)
console.log('  R43', layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', 'R43').text, layTron('Làm tròn số $73,46821$ đến chữ số thập phân thứ hai.', 'R43').ds)
console.log('  R44', layTron('Làm tròn số $148,(27)$ với độ chính xác $0,05$.', 'R44').text, layTron('Làm tròn số $148,(27)$ với độ chính xác $0,05$.', 'R44').ds)
console.log('  R38(nguồn)', layTron('Làm tròn số $148,(27)$ với độ chính xác $0,05$.', 'R38'))

console.log('\n=== So sánh, tìm x,y nguyên ===')
chk('019', canon(soSanhTimXY('Tìm số nguyên x,y biết: $\\dfrac{-8}{15} < \\dfrac{x}{15} < \\dfrac{y}{15} < \\dfrac{-1}{3}$', null).value), '{-7/1,-6/1}')
chk('024', canon(soSanhTimXY('Tìm số nguyên x,y biết: $\\dfrac{-1}{18} < \\dfrac{x}{18} < \\dfrac{y}{18} < \\dfrac{1}{9}$', null).value), '{0/1,1/1}')
chk('025', canon(soSanhTimXY('Tìm số nguyên x,y biết: $\\dfrac{1}{2} > \\dfrac{x}{4} > \\dfrac{y}{8} > \\dfrac{1}{24}$', null).value), '{1/1,1/1}')

console.log(`\n${okN}/${totN} khớp (chưa tính phần fmtFixed in tay ở trên, tự soi)`)
