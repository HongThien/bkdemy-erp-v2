// tao-soan.mjs — dựng TCLT.soan.md: 3 bài mẫu (Bài toán 1 a/b/c, lũy thừa CHỒNG) + 10 bài clone, dạng T106020802 "Tìm chữ số tận cùng của lũy thừa".
//   node kho-rules/dai/lo/k6/tan-cung-luy-thua/tao-soan.mjs
// Số liệu trong lời giải (x^4, x^r, dư của số mũ…) đều TÍNH bằng BigInt khi dựng, không gõ tay. Cổng: dung-de-tu-soan.mjs; kiểm máy độc lập: nhap-kho.mjs.
// Phương pháp lớp 6: chữ số tận cùng của x^n lặp theo chu kì 4 của số mũ ⇒ xét số dư của số mũ cho 4; x^4 có chữ số tận cùng 0/1/5/6 và
// số tận cùng 0/1/5/6 nâng lên lũy thừa bất kì vẫn giữ chữ số tận cùng. Số dư của số mũ (lũy thừa chồng) tìm bằng tích các số dư, KHÔNG đồng dư.
import { writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const R = String.raw
const modPow = (b, e, m) => { let r = 1n; b %= m; while (e > 0n) { if (e & 1n) r = (r * b) % m; b = (b * b) % m; e >>= 1n } return r }

// [nhãn, x, y, z] lũy thừa chồng x^(y^z) · [nhãn, x, n] lũy thừa thường x^n
const MAU = [
  ['Bài toán 1a', 7, 9, 9], ['Bài toán 1b', 14, 14, 14], ['Bài toán 1c', 4, 5, 67],
]
const CLONE = [
  ['Clone 1', 3, 7, 7], ['Clone 2', 2, 9, 9], ['Clone 3', 13, 6, 6], ['Clone 4', 8, 5, 13], ['Clone 5', 17, 11, 11],
  ['Clone 6', 12, 10, 10], ['Clone 7', 14, 7, 9], ['Clone 8', 19, 7, 20], ['Clone 9', 18, 3, 12], ['Clone 10', 2, 2022],
]

function dựng([nhan, x, y, z]) {
  const thap = z !== undefined          // lũy thừa chồng?
  const n = thap ? null : y
  const E = thap ? `${y}^{${z}}` : `${n}`
  const so = thap ? `${x}^{${y}^{${z}}}` : `${x}^{${n}}`
  const r = Number(thap ? modPow(BigInt(y), BigInt(z), 4n) : BigInt(n) % 4n)
  const t = Number(BigInt(x) ** 4n % 10n), u = Number(BigInt(x) ** BigInt(r) % 10n)
  const d = Number(thap ? modPow(BigInt(x), BigInt(y) ** BigInt(z), 10n) : modPow(BigInt(x), BigInt(n), 10n))
  if (![0, 1, 5, 6].includes(t)) throw new Error(`${nhan}: x^4 tận cùng ${t} — ngoài {0,1,5,6}`)
  const x4 = BigInt(x) ** 4n, xr = BigInt(x) ** BigInt(r)
  const xs = r === 1 ? `${x}` : `${x}^${r}`   // x^1 viết là x
  const p2 = []   // Phần 2
  let kieu = ''
  if (!thap) {
    kieu = 'thuong'
    p2.push(R`Ta có $${n}=4.${Math.floor(n / 4)}+${r}$.`)
    p2.push(r === 0 ? R`Suy ra $${so}=${x}^{4k}$ với $k=${n / 4}$.` : R`Suy ra $${so}=${x}^{4k+${r}}=${x}^{4k}.${xs}$ với $k=${Math.floor(n / 4)}$.`)
  } else if (y % 4 === 1) {
    kieu = 'dư1'
    p2.push(R`Vì $${y}$ chia 4 dư 1 nên mỗi thừa số $${y}$ của $${y}^{${z}}$ chia 4 dư 1, mà tích các số chia 4 dư 1 thì chia 4 dư 1 (vì $(4a+1).(4b+1)=4.(4ab+a+b)+1$).`)
    p2.push(R`Suy ra $${y}^{${z}}=4k+1$ ($k\in\mathbb{N}^*$).`)
  } else if (y % 2 === 0) {
    kieu = 'chẵn'
    p2.push(R`Ta có $${y}^{${z}}=${y}^2.${y}^{${z - 2}}$ và $${y}^2=${y * y}=4.${(y * y) / 4}$ chia hết cho 4.`)
    p2.push(R`Suy ra $${y}^{${z}}=4k$ ($k\in\mathbb{N}^*$).`)
  } else {   // y chia 4 dư 3
    kieu = 'dư3'
    const Y = y * y
    p2.push(R`Ta có $${y}^2=${Y}=4.${(Y - 1) / 4}+1$ chia 4 dư 1.`)
    if (z % 2 === 0) {
      p2.push(R`Vì số mũ $${z}$ là số chẵn nên $${y}^{${z}}=${y}^2.${y}^2.\dots.${y}^2$ (${z / 2} thừa số $${y}^2$) chia 4 dư 1 (tích các số chia 4 dư 1).`)
      p2.push(R`Suy ra $${y}^{${z}}=4k+1$ ($k\in\mathbb{N}^*$).`)
    } else {
      p2.push(R`Vì số mũ $${z}$ là số lẻ nên $${y}^{${z}}=(${y}^2.${y}^2.\dots.${y}^2).${y}$ (${(z - 1) / 2} thừa số $${y}^2$ rồi nhân với $${y}$); phần trong ngoặc chia 4 dư 1, còn $${y}$ chia 4 dư 3 nên tích chia 4 dư 3 (vì $(4a+1).(4b+3)=4.(4ab+3a+b)+3$).`)
      p2.push(R`Suy ra $${y}^{${z}}=4k+3$ ($k\in\mathbb{N}^*$).`)
    }
  }
  if (thap) p2.push(r === 0 ? R`Do đó $${so}=${x}^{4k}$.` : R`Do đó $${so}=${x}^{4k+${r}}=${x}^{4k}.${xs}$.`)
  p2.push(R`Ta có $${x}^4=${x4}$ có chữ số tận cùng là ${t} nên $${x}^{4k}=${x4}^k$ cũng có chữ số tận cùng là ${t} (tích các số cùng có chữ số tận cùng là ${t} thì vẫn có chữ số tận cùng là ${t}).`)
  if (r > 0) {
    p2.push(r === 1 ? R`Số $${x}$ có chữ số tận cùng là ${u}.` : R`Ta có $${xs}=${xr}$ có chữ số tận cùng là ${u}.`)
    p2.push(R`Ta có $${t}.${u}=${t * u}$ nên $${x}^{4k}.${xs}$ có chữ số tận cùng là ${d}.`)
  }
  if (t * u % 10 !== d && r > 0) throw new Error(`${nhan}: số học lệch`)
  if (r === 0 && t !== d) throw new Error(`${nhan}: số học lệch (r=0)`)
  p2.push(R`Vậy $${so}$ có chữ số tận cùng là ${d}.`)

  // Phần 1
  const b1 = { 'thuong': R`Chia số mũ ${n} cho 4 để tìm số dư, tức là viết số mũ dưới dạng $4q+r$.`,
    'dư1': R`Xét số mũ $${y}^{${z}}$: cơ số ${y} chia 4 dư 1, nên mọi thừa số của tích đều có cùng số dư và ta tìm số dư của cả lũy thừa bằng cách nhân các số dư.`,
    'chẵn': R`Xét số mũ $${y}^{${z}}$: cơ số ${y} là số chẵn, nên kiểm tra xem lũy thừa này có chia hết cho 4 không bằng cách tách ra thừa số $${y}^2$.`,
    'dư3': R`Xét số mũ $${y}^{${z}}$: cơ số ${y} chia 4 dư 3, nên xét $${y}^2$ chia 4 dư mấy rồi ghép lại theo số mũ ${z} chẵn hay lẻ.` }[kieu]
  const p1 = [
    R`**Mấu chốt:** chữ số tận cùng của $${x}^{m}$ lặp lại theo chu kì 4 của số mũ, nên **tìm số dư của số mũ khi chia cho 4** rồi dùng chữ số tận cùng của $${x}^4$.`,
    R`**Bước 1.** ${b1}`,
    R`**Bước 2.** Viết số mũ dưới dạng $4k$ hoặc $4k+r$ rồi tách lũy thừa của $${x}$ thành tích của $${x}^{4k}$ với phần còn lại.`,
    R`**Bước 3.** Tính $${x}^4$ để biết chữ số tận cùng của nó, rồi dùng tính chất: số có chữ số tận cùng là 0, 1, 5 hoặc 6 nâng lên lũy thừa nào cũng giữ nguyên chữ số tận cùng.`,
  ]
  if (r > 0) p1.push(R`**Bước 4.** Nhân chữ số tận cùng của $${x}^{4k}$ với chữ số tận cùng của phần lũy thừa còn lại, chữ số tận cùng của tích là chữ số cần tìm.`)
  p1.push(thap ? R`**Chú ý:** số mũ ở đây cũng là một lũy thừa, nên phải tìm số dư của nó khi chia cho 4 chứ không chia cho 10.` : R`**Chú ý:** chữ số tận cùng của một tích chỉ phụ thuộc chữ số tận cùng của từng thừa số.`)
  return { nhan, de: R`Tìm chữ số tận cùng của số $${so}$.`, d, p1, p2, thap, r, x, y, z, n }
}

const mau = MAU.map(dựng), clone = CLONE.map(dựng)
const GHI_CHU = {
  'Bài toán 1a': R`Nguồn in lũy thừa chồng $7^{9^9}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$7^{99}$"); đã khôi phục theo lời giải mẫu của nguồn ($9^9-1$ chia hết cho 4).`,
  'Bài toán 1b': R`Nguồn in lũy thừa chồng $14^{14^{14}}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$14^{1414}$"); đã khôi phục theo lời giải mẫu của nguồn ($14^{14}=4k$).`,
  'Bài toán 1c': R`Nguồn in lũy thừa chồng $4^{5^{67}}$ (ảnh sao chép mất cấp số mũ nhỏ, hiện "$4^{567}$"); đã khôi phục theo lời giải mẫu của nguồn ($5^{67}-1$ chia hết cho 4).`,
}
let md = `# ĐỀ | Chữ số tận cùng của lũy thừa — 3 bài mẫu + 10 bài clone (khối 6 nâng cao)\nnam: 2026\nbo_sach: KNTT\n\n## PHẦN 1 | Chữ số tận cùng của lũy thừa | tra_loi_ngan\n`
for (const c of [...mau, ...clone]) {
  md += `\n### ${c.nhan} | kho=dai | loai=tra_loi_ngan | dap_an=${c.d}\n**Đề:** ${c.de}\n`
  if (GHI_CHU[c.nhan]) md += `**Ghi chú:** ${GHI_CHU[c.nhan]}\n`
  md += `\n**Phần 1. Hướng dẫn**\n\n${c.p1.join('\n\n')}\n\n**Phần 2. Trình bày**\n\n${c.p2.join('\n\n')}\n`
}
md += `\n## GHI CHÚ CHO NGƯỜI DUYỆT\n\n- 3 bài mẫu = Bài toán 1 a/b/c của nguồn Thùy gửi 13/10 (lũy thừa chồng). 10 bài clone: đổi cơ số / số mũ, phủ đủ 4 trường hợp số dư của số mũ khi chia cho 4 (0 · 1 · 2 · 3), cơ số tận cùng 2, 3, 4, 7, 8, 9.\n- Phương pháp lớp 6 (không đồng dư): số dư của số mũ tìm bằng tích các số dư ($(4a+1)(4b+1)$ vẫn dư 1…), chữ số tận cùng của $x^4$ ∈ {0, 1, 5, 6} rồi nâng lên lũy thừa $k$.\n- Đáp số là MỘT chữ số ⇒ trả lời ngắn.\n`
const out = join(dirname(fileURLToPath(import.meta.url)), 'TCLT.soan.md')
writeFileSync(out, md)
console.log(`✔ ${out} — ${mau.length} mẫu + ${clone.length} clone`)
for (const c of [...mau, ...clone]) console.log(`  ${c.nhan.padEnd(12)} ${c.de.replace(/^Tìm chữ số tận cùng của số /, '').padEnd(22)} dư ${c.r} → ${c.d}`)
