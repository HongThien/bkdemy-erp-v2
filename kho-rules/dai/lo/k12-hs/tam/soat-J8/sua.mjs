import { readFileSync, writeFileSync } from 'node:fs'
const p = new URL('../../ra/J8.txt', import.meta.url)
const L = readFileSync(p, 'utf8').split('\n')
const i = L.findIndex((l) => l.startsWith('- Mẫu $cx+d$ với $c'))
if (i < 0 || !L[i + 1].startsWith('epm1$')) throw new Error('không thấy dòng hỏng')
L.splice(i, 2, String.raw`- Mẫu $cx+d$ với $c\ne\pm1$ thì không chia ra hệ số nguyên được: khử $x$ ở tử bằng cách lấy $c\cdot(\text{tử})$ trừ một bội của mẫu để được hằng số $r$; khi đó "$cx+d$ là ước của $r$" chỉ là điều kiện cần.`)
const R = [
  [String.raw`(sách cũ gọi là điểm uốn) tại điểm có hoành độ $x_0=-dfrac{b}{3a}$`, String.raw`(sách cũ gọi là điểm uốn) tại điểm có hoành độ $x_0=-\dfrac{b}{3a}$`],
  [String.raw`nên điểm uốn có $x_0=1$`, String.raw`nên tâm đối xứng có $x_0=1$`],
  [String.raw`Chia tử cho mẫu để viết $y$ dưới dạng đa thức cộng $\dfrac{r}{cx+d}$.`, String.raw`Chia tử cho mẫu để viết $y$ dưới dạng đa thức cộng $\dfrac{r}{x+d}$; mẫu $cx+d$ với $c\ne\pm1$ thì khử $x$ ở tử để đưa về "$cx+d$ là ước của hằng số $r$".`],
  [String.raw`- Khi hệ số $c\ne1$ (mẫu $cx+d$), điều kiện "ước của $r$" chỉ là điều kiện cần: sau khi tìm $x$ nguyên phải thay lại kiểm tra $y$ có nguyên không.`, String.raw`- Khi mẫu $cx+d$ có $c\ne\pm1$, điều kiện "ước của $r$" chỉ là điều kiện cần: nhiều ước cho $x$ không nguyên (loại), các $x$ nguyên còn lại phải thay vào kiểm tra $y$ có nguyên không.`],
]
let s = L.join('\n')
for (const [a, b] of R) { if (!s.includes(a)) throw new Error('không thấy: ' + a.slice(0, 50)); s = s.replace(a, b) }
writeFileSync(p, s)
console.log('xong')
