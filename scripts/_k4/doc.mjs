const CS = ['không', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín']
function doc3(n, dau) {
  const t = Math.floor(n / 100), c = Math.floor(n / 10) % 10, d = n % 10, o = []
  if (t > 0) o.push(CS[t] + ' trăm'); else if (!dau) o.push('không trăm')
  if (c > 1) o.push(CS[c] + ' mươi'); else if (c === 1) o.push('mười'); else if (d > 0 && !(dau && t === 0)) o.push('linh')
  if (d > 0) o.push(c > 1 && d === 1 ? 'mốt' : (c >= 1 && d === 5 ? 'lăm' : (c > 1 && d === 4 ? 'tư' : CS[d])))
  return o.join(' ')
}
const LOP = ['', ' nghìn', ' triệu', ' tỷ']
export function docSo(n) {
  if (n === 0) return 'không'
  const g = []; let x = n; while (x > 0) { g.push(x % 1000); x = Math.floor(x / 1000) }
  const o = []
  for (let i = g.length - 1; i >= 0; i--) if (g[i] > 0) o.push(doc3(g[i], i === g.length - 1) + LOP[i])
  return o.join(' ')
}
export const chuanVan = (s) => s.toLowerCase().replace(/[.,]/g, '').replace(/\s+/g, ' ').trim()
