// clone.mjs — Thùy 14/11: (1) đưa câu "Tìm số nguyên n để n²+7 là SCP" vào dạng NDB03050; (2) clone để MỖI DẠNG của nhóm Số chính phương có 15 bài
//   (NDB02800 dãy lũy thừa không là SCP · NDB02801 biểu thức không là SCP · NDB03050 tìm số nguyên để biểu thức là SCP).
// Clone sinh bằng CODE (không DeepSeek): mọi khẳng định kiểm bằng vét cạn / BigInt; lời giải sinh theo khuôn từ tham số.
//   node kho-rules/dai/lo/k6/so-chinh-phuong/clone.mjs          → kiểm máy + dựng JSON + HTML + chạy khô
//   node kho-rules/dai/lo/k6/so-chinh-phuong/clone.mjs --ghi    → ghi thật (gốc: gán + duyệt; clone: gán 'nguoi', CHƯA duyệt)
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { spawnSync } from 'node:child_process'
import pg from 'pg'
const D = 'kho-rules/dai/lo/k6/so-chinh-phuong/'
const GHI = process.argv.includes('--ghi')
const ck = (ten, ok) => { if (!ok) { console.error('✘ KIỂM SAI:', ten); process.exit(3) } }
const isqrt = (n) => { if (n < 2n) return n; let x = 1n << BigInt((n.toString(2).length >> 1) + 1); for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y } }
const laSCP = (n) => { if (n < 0n) return false; const r = isqrt(n); return r * r === n }
const mu = (a, k) => BigInt(a) ** BigInt(k)
const tong = (a, t, d) => { let s = 0n; for (let k = t; k <= d; k++) s += mu(a, k); return s }
const set = (a) => `\\{${a.join(';')}\\}`
const BO = (x) => String.raw`Giả sử $${x}$ là số chính phương, tức là $${x}=m.m$ với $m\in\mathbb{N}$. Phân tích $m$ ra thừa số nguyên tố; mỗi luỹ thừa $p^e$ có trong $m$ thì trong $m.m$ thành $p^e.p^e=p^{e+e}$, số mũ là số chẵn. Vậy khi phân tích $${x}$ ra thừa số nguyên tố, mọi thừa số đều có số mũ chẵn.`
const P2 = (...l) => `**Phần 2. Trình bày**\n\n${l.join('\n\n')}`
const GOC = { dang02800: 'T1060000001618', dang02800b: 'T1060000001623', b4a: 'T1060000001619', b4b: 'T1060000001620', b13: 'T1060000001617', b1: 'T1060000001621', b3: 'T1060000001622' }

// ───────────────── DẠNG NDB03050 — tìm số nguyên n để biểu thức là SCP
const divPairs = (c) => { const r = []; for (let b = c; b >= 1; b--) if (c % b === 0) r.push([b, c / b]); return r } // [b,a], a.b=c, b giảm dần
const nghiem = (f, lim = 600) => { const r = []; for (let n = -lim; n <= lim; n++) { const v = f(BigInt(n)); if (laSCP(v)) r.push(n) } return r }
const kiemTap = (ten, got, f) => { const bf = nghiem(f); ck(`${ten}: ${got} vs vét cạn ${bf}`, JSON.stringify([...got].sort((x, y) => x - y)) === JSON.stringify(bf)) }
const dau = (x) => (x < 0 ? `-${-x}` : `${x}`)
// n² + c = k²   (v = tên biến, mặc định n)
function tap1(c, v = 'n') {
  const rows = [], sol = []
  for (const [b, a] of divPairs(c)) {
    if ((a + b) % 2) { rows.push(`Trường hợp $k+${v}=${b}$ và $k-${v}=${a}$: cộng hai vế được $2k=${a + b}$ là số lẻ, không có số tự nhiên $k$ nên loại.`); continue }
    const k = (a + b) / 2, n = (b - a) / 2
    rows.push(`Trường hợp $k+${v}=${b}$ và $k-${v}=${a}$: cộng hai vế được $2k=${a + b}$ nên $k=${k}$, suy ra $${v}=${b}-${k}=${dau(n)}$.`); sol.push(n)
  }
  return { rows, sol: [...new Set(sol)].sort((x, y) => x - y) }
}
const t1P2 = (c, v = 'n', bieuThuc = `${v}^2+${c}`, dau0 = '') => [
  `${dau0}Giả sử $${bieuThuc}$ là số chính phương, tức là $${v}^2+${c}=k^2$ với $k\\in\\mathbb{N}$.`,
  `Vì $k^2$ lớn hơn $${v}^2$ là $${c}$ đơn vị nên $k^2-${v}^2=${c}$.`,
  `Mà $(k-${v})(k+${v})=k.k+k.${v}-${v}.k-${v}.${v}=k^2-${v}^2$ nên $(k-${v})(k+${v})=${c}$.`,
  `Vì $${c}>0$ nên $k-${v}$ và $k+${v}$ cùng dấu. Mà $(k-${v})+(k+${v})=2k\\ge 0$ nên cả hai cùng dương.`,
  `Vậy $k+${v}$ và $k-${v}$ là hai số nguyên dương có tích bằng $${c}$. Ta có bảng (cộng hai số được $2k$, trừ hai số được $2${v}$):`,
]
const goc1 = (c, v = 'n') => {
  const { rows, sol } = tap1(c, v)
  return { sol, p2: P2(...t1P2(c, v), ...rows, `Vậy $${v}\\in${set(sol)}$.`) }
}
const P1_T = (kieu) => ({
  t1: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** đặt biểu thức bằng $k^2$ rồi đưa về một tích hai thừa số bằng một số cho trước; mọi cách viết số đó thành tích hai ước cho ta từng nghiệm.

**Bước 1.** Đặt biểu thức đã cho bằng $k^2$ với $k$ là số tự nhiên, rồi tìm hiệu $k^2-n^2$ (bằng phần hơn giữa hai số).

**Bước 2.** Viết $k^2-n^2$ thành tích $(k-n)(k+n)$ bằng tính chất phân phối của phép nhân đối với phép trừ.

**Bước 3.** Giải thích vì sao hai thừa số cùng dương (tích dương, tổng hai thừa số bằng $2k$ không âm).

**Bước 4.** Liệt kê mọi cách viết số đã cho thành tích hai số tự nhiên (kể cả đổi thứ tự), lập bảng $k+n$, $k-n$ rồi tính $k$ và $n$.

**Chú ý:** $k+n$ và $k-n$ hơn kém nhau $2n$ nên cùng chẵn hoặc cùng lẻ; trường hợp khác tính chẵn lẻ phải loại. Đổi thứ tự hai thừa số thì $n$ đổi dấu.`,
  t2: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** đặt biểu thức bằng $k^2$ rồi đưa về tích $(n-k)(n+k)$ bằng một số cho trước; xét hai trường hợp cùng dương và cùng âm.

**Bước 1.** Đặt biểu thức đã cho bằng $k^2$ với $k$ là số tự nhiên, rồi tìm hiệu $n^2-k^2$ (phần hơn giữa hai số).

**Bước 2.** Viết $n^2-k^2$ thành tích $(n-k)(n+k)$ bằng tính chất phân phối.

**Bước 3.** Vì tích dương nên hai thừa số cùng dấu; vì $k\ge 0$ nên $n+k\ge n-k$. Xét riêng trường hợp cùng dương và trường hợp cùng âm.

**Bước 4.** Liệt kê các cách viết số đã cho thành tích hai số có $n+k\ge n-k$, tính $n$ và $k$, loại trường hợp không nguyên.

**Chú ý:** hai thừa số hơn kém nhau $2k$ nên cùng chẵn hoặc cùng lẻ. Hai trường hợp cùng dương và cùng âm cho hai giá trị $n$ đối nhau.`,
  t3: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** đặt biểu thức bằng $k^2$ rồi đưa về tích $(k-2n)(k+2n)$ bằng một số cho trước; vì $2n$ phải chẵn và $4n$ phải nguyên nên cần xét thêm điều kiện chia hết.

**Bước 1.** Đặt biểu thức đã cho bằng $k^2$ với $k$ là số tự nhiên, rồi tìm hiệu $k^2-4n^2$.

**Bước 2.** Viết $k^2-4n^2$ thành $(k-2n)(k+2n)$ bằng tính chất phân phối, rồi giải thích hai thừa số cùng dương.

**Bước 3.** Liệt kê mọi cách viết số đã cho thành tích hai số tự nhiên, lập bảng $k+2n$, $k-2n$.

**Bước 4.** Từ mỗi dòng tính $k$ (cần số tự nhiên) và $n$ (cần số nguyên); loại dòng không thoả.

**Chú ý:** hiệu hai thừa số bằng $4n$ nên phải chia hết cho $4$.`,
  t4: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** đổi biến để đưa về dạng $t^2+c$ rồi làm như bài $t^2+c$ là số chính phương; cuối cùng đổi ngược về $n$.

**Bước 1.** Đặt $t$ bằng biểu thức trong ngoặc bị bình phương (là một số nguyên).

**Bước 2.** Đặt $t^2+c=k^2$ với $k$ tự nhiên, đưa về tích $(k-t)(k+t)$ bằng tính chất phân phối và giải thích hai thừa số cùng dương.

**Bước 3.** Liệt kê mọi cách viết số $c$ thành tích hai số tự nhiên, lập bảng $k+t$, $k-t$ rồi tìm $t$.

**Bước 4.** Đổi ngược từ $t$ sang $n$ và viết tập nghiệm.

**Chú ý:** $k+t$ và $k-t$ phải cùng chẵn hoặc cùng lẻ; đổi thứ tự hai thừa số thì $t$ đổi dấu.`,
}[kieu])

const S3 = [] // clone dạng 03050
// gốc của Thùy
const G0 = (() => { const g = goc1(7); kiemTap('gốc n²+7', g.sol, (n) => n * n + 7n); ck('gốc = ±3', JSON.stringify(g.sol) === '[-3,3]'); return { ma: 'GOC', dang: 'NDB03050', noi_dung: String.raw`Tìm số nguyên $n$ sao cho $n^2+7$ là số chính phương.`, loi_giai: `${P1_T('t1')}\n\n${g.p2}`, ghi: 'Câu do Thùy gửi (ảnh 14/11). Lời giải viết lại: sửa chỗ "k∈ℕ" mà bảng có k âm (loại bằng lập luận cả hai thừa số dương).' } })()
// T1 (6)
for (const c of [5, 9, 12, 15, 16, 21]) { const g = goc1(c); kiemTap(`T1 c=${c}`, g.sol, (n) => n * n + BigInt(c)); ck(`T1 c=${c} có nghiệm`, g.sol.length > 0); S3.push({ dang: 'NDB03050', noi_dung: String.raw`Tìm số nguyên $n$ sao cho $n^2+${c}$ là số chính phương.`, loi_giai: `${P1_T('t1')}\n\n${g.p2}`, kieu: 'T1' }) }
// T2 n² − c (4)
for (const c of [5, 9, 15, 21]) {
  const rows = [], sol = []
  const pos = divPairs(c).filter(([b, a]) => b >= a), neg = pos
  for (const [b, a] of pos) { if ((a + b) % 2) { rows.push(`Cả hai dương, $n+k=${b}$ và $n-k=${a}$: $2n=${a + b}$ là số lẻ nên loại.`); continue } const n = (a + b) / 2, k = (b - a) / 2; rows.push(`Cả hai dương, $n+k=${b}$ và $n-k=${a}$: cộng hai vế được $2n=${a + b}$ nên $n=${n}$, trừ hai vế được $2k=${b - a}$ nên $k=${k}$.`); sol.push(n) }
  for (const [b, a] of neg) { if ((a + b) % 2) { rows.push(`Cả hai âm, $n+k=-${a}$ và $n-k=-${b}$: $2n=-${a + b}$ là số lẻ nên loại.`); continue } const n = -(a + b) / 2, k = (b - a) / 2; rows.push(`Cả hai âm, $n+k=-${a}$ và $n-k=-${b}$: cộng hai vế được $2n=-${a + b}$ nên $n=${n}$, trừ hai vế được $2k=${b - a}$ nên $k=${k}$.`); sol.push(n) }
  const S = [...new Set(sol)].sort((x, y) => x - y); kiemTap(`T2 c=${c}`, S, (n) => n * n - BigInt(c)); ck(`T2 c=${c} có nghiệm`, S.length > 0)
  const p2 = P2(`Giả sử $n^2-${c}$ là số chính phương, tức là $n^2-${c}=k^2$ với $k\\in\\mathbb{N}$.`, `Vì $n^2$ lớn hơn $k^2$ là $${c}$ đơn vị nên $n^2-k^2=${c}$.`, `Mà $(n-k)(n+k)=n.n+n.k-k.n-k.k=n^2-k^2$ nên $(n-k)(n+k)=${c}$.`, `Vì $${c}>0$ nên $n-k$ và $n+k$ cùng dấu; vì $k\\ge 0$ nên $n+k\\ge n-k$. Ta có bảng:`, ...rows, `Vậy $n\\in${set(S)}$.`)
  S3.push({ dang: 'NDB03050', noi_dung: String.raw`Tìm số nguyên $n$ sao cho $n^2-${c}$ là số chính phương.`, loi_giai: `${P1_T('t2')}\n\n${p2}`, kieu: 'T2' })
}
// T3 4n² + c (2)
for (const c of [5, 21]) {
  const rows = [], sol = []
  for (const [b, a] of divPairs(c)) {
    if ((a + b) % 2) { rows.push(`Trường hợp $k+2n=${b}$ và $k-2n=${a}$: $2k=${a + b}$ là số lẻ nên loại.`); continue }
    if ((b - a) % 4) { rows.push(`Trường hợp $k+2n=${b}$ và $k-2n=${a}$: $4n=${b - a}$ không chia hết cho $4$ nên $n$ không nguyên, loại.`); continue }
    const k = (a + b) / 2, n = (b - a) / 4; rows.push(`Trường hợp $k+2n=${b}$ và $k-2n=${a}$: $2k=${a + b}$ nên $k=${k}$; $4n=${b - a}$ nên $n=${dau(n)}$.`); sol.push(n)
  }
  const S = [...new Set(sol)].sort((x, y) => x - y); kiemTap(`T3 c=${c}`, S, (n) => 4n * n * n + BigInt(c)); ck(`T3 c=${c} có nghiệm`, S.length > 0)
  const p2 = P2(`Giả sử $4n^2+${c}$ là số chính phương, tức là $4n^2+${c}=k^2$ với $k\\in\\mathbb{N}$.`, `Vì $k^2$ lớn hơn $4n^2$ là $${c}$ đơn vị nên $k^2-4n^2=${c}$.`, `Mà $(k-2n)(k+2n)=k.k+k.2n-2n.k-2n.2n=k^2-4n^2$ nên $(k-2n)(k+2n)=${c}$.`, `Vì $${c}>0$ nên $k-2n$ và $k+2n$ cùng dấu; mà tổng $2k\\ge 0$ nên cả hai cùng dương. Ta có bảng:`, ...rows, `Vậy $n\\in${set(S)}$.`)
  S3.push({ dang: 'NDB03050', noi_dung: String.raw`Tìm số nguyên $n$ sao cho $4n^2+${c}$ là số chính phương.`, loi_giai: `${P1_T('t3')}\n\n${p2}`, kieu: 'T3' })
}
// T4 (n+m)² + c (2)
for (const [m, c] of [[-2, 7], [3, 9]]) {
  const g = tap1(c, 't'); const S = g.sol.map((t) => t - m).sort((x, y) => x - y)
  const bt = m < 0 ? `(n-${-m})^2+${c}` : `(n+${m})^2+${c}`, tt = m < 0 ? `n-${-m}` : `n+${m}`
  kiemTap(`T4 ${bt}`, S, (n) => (n + BigInt(m)) ** 2n + BigInt(c)); ck(`T4 ${bt} có nghiệm`, S.length > 0)
  const doiNguoc = g.sol.map((t) => `Với $t=${dau(t)}$: $n=t${m < 0 ? '+' + (-m) : '-' + m}=${dau(t - m)}$.`)
  const p2 = P2(`Đặt $t=${tt}$, khi đó $t$ là số nguyên và biểu thức trở thành $t^2+${c}$.`, ...t1P2(c, 't', `t^2+${c}`, 'Giả sử '.length ? '' : ''), ...g.rows, `Vậy $t\\in${set(g.sol)}$.`, ...doiNguoc, `Vậy $n\\in${set(S)}$.`)
  S3.push({ dang: 'NDB03050', noi_dung: String.raw`Tìm số nguyên $n$ sao cho $${bt}$ là số chính phương.`, loi_giai: `${P1_T('t4')}\n\n${p2}`, kieu: 'T4' })
}
ck('NDB03050: gốc + 14 clone', S3.length === 14)

// ───────────────── DẠNG NDB02800 — dãy lũy thừa không là SCP
const S0 = []
// F1: b + b² + … + b^{4t+1} (chữ số tận cùng)
const F1 = (b, t) => {
  const Q = 1 + b + b * b + b ** 3, cuoi = b ** 4, n = 4 * t + 1
  const S = tong(b, 1, n); const ct = Number(S % 10n)
  ck(`F1 b=${b} t=${t} tận cùng ∈{2,3,7,8}`, [2, 3, 7, 8].includes(ct) && !laSCP(S))
  // nhóm
  let nhom = 0n; for (let j = 0; j < t; j++) { const g = mu(b, 4 * j + 1) * BigInt(Q); ck(`F1 nhóm ⋮10 b=${b}`, g % 10n === 0n); nhom += g }
  ck(`F1 tổng nhóm + cuối`, nhom + mu(b, n) === S)
  const lyDo = { 2: `$15.2^j$ chia hết cho $5$ (vì $15\\vdots 5$) và chia hết cho $2$ (vì $2^j\\vdots 2$ với $j\\ge 1$)`, 3: `$40.3^j$ có thừa số $40\\vdots 10$`, 7: `$400.7^j$ có thừa số $400\\vdots 10$`, 8: `$585.8^j$ chia hết cho $5$ (vì $585\\vdots 5$) và chia hết cho $2$ (vì $8^j\\vdots 2$ với $j\\ge 1$)` }[b]
  const cuoi4 = Number(BigInt(cuoi) % 10n), tc = Number(mu(b, n) % 10n)
  const nh = []; for (let j = 0; j < Math.min(t, 3); j++) nh.push(`(${Array.from({ length: 4 }, (_, i) => `${b}^{${4 * j + 1 + i}}`).join('+')})`)
  const nhRut = t > 3 ? [...nh.slice(0, 2), '\\dots', `(${Array.from({ length: 4 }, (_, i) => `${b}^{${4 * (t - 1) + 1 + i}}`).join('+')})`] : nh
  const nhQ = []; for (let j = 0; j < t; j++) nhQ.push(`${b}^{${4 * j + 1}}.(1+${b}+${b}^2+${b}^3)`)
  const nhQ2 = t > 3 ? [nhQ[0], nhQ[1], '\\dots', nhQ[t - 1]] : nhQ
  const dsQ = []; for (let j = 0; j < t; j++) dsQ.push(`${Q}.${b}^{${4 * j + 1}}`)
  const dsQ2 = t > 3 ? [dsQ[0], dsQ[1], '\\dots', dsQ[t - 1]] : dsQ
  return {
    noi_dung: String.raw`Cho $S=${b}+${b}^2+${b}^3+\dots+${b}^{${n}}$. Hỏi $S$ có là số chính phương không? Vì sao?`,
    loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** số chính phương chỉ có thể tận cùng bằng $0;1;4;5;6;9$. Ghép các số hạng thành nhóm 4 số hạng chia hết cho 10, rồi xét chữ số tận cùng của số hạng còn lại.

**Bước 1.** Đếm số số hạng của $S$ và thấy rằng bỏ số hạng cuối thì ghép 4 số hạng liền nhau được các nhóm vừa đủ.

**Bước 2.** Trong mỗi nhóm 4 số hạng, đặt luỹ thừa nhỏ nhất làm thừa số chung; phần trong ngoặc là $1+${b}+${b}^2+${b}^3$.

**Bước 3.** Chứng tỏ mỗi nhóm chia hết cho 10, rồi tìm chữ số tận cùng của số hạng cuối bằng cách nhóm các thừa số $${b}$ thành từng nhóm 4.

**Bước 4.** Suy ra chữ số tận cùng của $S$, đối chiếu với các chữ số tận cùng có thể có của số chính phương (lập bảng $c.c$ với $c=0;1;\dots;9$).

**Chú ý:** tích các số cùng tận cùng $1$ vẫn tận cùng $1$, tích các số cùng tận cùng $6$ vẫn tận cùng $6$.

${P2(
      `$S$ có ${n} số hạng. Bỏ số hạng cuối $${b}^{${n}}$ thì còn ${4 * t} số hạng, ghép 4 số hạng liền nhau thành ${t} nhóm:`,
      `$S=${nhRut.join('+')}+${b}^{${n}}$`,
      `$=${nhQ2.join('+')}+${b}^{${n}}$`,
      `Vì $1+${b}+${b}^2+${b}^3=${Q}$ nên`,
      `$S=${dsQ2.join('+')}+${b}^{${n}}$`,
      `Mỗi số dạng ${lyDo} nên chia hết cho 10, tức là có chữ số tận cùng là $0$. Do đó tổng của ${t} nhóm này có chữ số tận cùng là $0$.`,
      `Số hạng cuối: $${b}^4=${cuoi}$ có chữ số tận cùng là $${cuoi4}$, mà tích các số cùng tận cùng $${cuoi4}$ vẫn tận cùng $${cuoi4}$ nên $${b}^{${4 * t}}$ (tích của ${t} thừa số $${cuoi}$) có chữ số tận cùng là $${cuoi4}$.`,
      `Suy ra $${b}^{${n}}=${b}^{${4 * t}}.${b}$ có chữ số tận cùng là $${tc}$.`,
      `Vậy $S$ có chữ số tận cùng là $${ct}$.`,
      `Mặt khác, số tự nhiên $m=10q+c$ (với $c$ là chữ số tận cùng của $m$) có $m.m=100q^2+20qc+c.c$, nên $m.m$ có cùng chữ số tận cùng với $c.c$. Với $c=0;1;2;\\dots;9$ thì $c.c=0;1;4;9;16;25;36;49;64;81$, nên số chính phương chỉ có thể tận cùng bằng $0;1;4;5;6;9$.`,
      `Vì $S$ có chữ số tận cùng là $${ct}$ nên $S$ không là số chính phương.`)}`,
  }
}
for (const [b, t] of [[2, 3], [2, 5], [3, 2], [3, 4], [7, 2], [7, 3], [8, 2]]) S0.push({ dang: 'NDB02800', kieu: 'F1', parent: GOC.dang02800, ...F1(b, t) })
// F2: p + p² + … + p^k, ⋮p nhưng không ⋮p²
const F2 = (p, k) => {
  const M = tong(p, 1, k); ck(`F2 p=${p}: ⋮p, không ⋮p², không SCP`, M % BigInt(p) === 0n && M % BigInt(p * p) !== 0n && !laSCP(M))
  return {
    noi_dung: String.raw`Cho $M=${p}+${p}^2+${p}^3+\dots+${p}^{${k}}$. Chứng minh $M$ không là số chính phương.`,
    loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** chứng minh $M$ chia hết cho ${p} nhưng không chia hết cho ${p * p}, rồi dùng tính chất: số chính phương có mọi thừa số nguyên tố với số mũ chẵn.

**Bước 1.** Chứng tỏ mọi số hạng đều chia hết cho ${p}, nên $M$ chia hết cho ${p}.

**Bước 2.** Tách $M=${p}+(${p}^2+\dots+${p}^{${k}})$; từ $${p}^2$ trở đi mọi số hạng chia hết cho ${p * p}, còn $${p}$ không chia hết cho ${p * p}.

**Bước 3.** Suy ra $M$ có chia hết cho ${p * p} hay không.

**Bước 4.** Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn: $M$ chia hết cho ${p} thì số mũ của ${p} phải từ 2 trở lên.

**Chú ý:** tổng có đúng một số hạng không chia hết cho ${p * p}, các số hạng còn lại đều chia hết cho ${p * p}, thì cả tổng không chia hết cho ${p * p}.

${P2(
      `Mỗi số hạng $${p};\\ ${p}^2;\\ \\dots;\\ ${p}^{${k}}$ đều chia hết cho ${p} nên $M\\vdots ${p}$.`,
      `Viết $M=${p}+(${p}^2+${p}^3+\\dots+${p}^{${k}})$. Với $j\\ge 2$ ta có $${p}^j=${p * p}.${p}^{j-2}$ chia hết cho ${p * p}, nên $${p}^2+${p}^3+\\dots+${p}^{${k}}$ chia hết cho ${p * p}. Mà $${p}$ không chia hết cho ${p * p}.`,
      `Suy ra $M$ không chia hết cho ${p * p}.`,
      BO('M'),
      `Vì $M$ chia hết cho ${p} nên số mũ của thừa số nguyên tố $${p}$ trong $M$ lớn hơn hoặc bằng $1$, mà số mũ đó chẵn nên lớn hơn hoặc bằng $2$. Suy ra $M$ chia hết cho $${p}^2=${p * p}$. Mâu thuẫn với $M$ không chia hết cho ${p * p}.`,
      `Vậy $M$ không là số chính phương.`)}`,
  }
}
for (const [p, k] of [[2, 60], [3, 50], [7, 40], [11, 30], [13, 25], [17, 20]]) S0.push({ dang: 'NDB02800', kieu: 'F2', parent: GOC.dang02800b, ...F2(p, k) })
ck('NDB02800: 13 clone', S0.length === 13)

// ───────────────── DẠNG NDB02801 — biểu thức không là SCP
const S1 = []
// H1: (b−1)S + b = b^{k+1}, k chẵn, b nguyên tố
const H1 = (b, k) => {
  const S = tong(b, 1, k); ck(`H1 b=${b},k=${k}`, k % 2 === 0 && (BigInt(b - 1) * S + BigInt(b) === mu(b, k + 1)) && !laSCP(BigInt(b - 1) * S + BigInt(b)))
  const hs = b - 1, bt = hs === 1 ? `S+${b}` : `${hs}S+${b}`, lhs = hs === 1 ? 'S' : `${hs}S`
  return {
    noi_dung: String.raw`Cho $S=${b}+${b}^2+${b}^3+\dots+${b}^{${k}}$. Chứng minh rằng $${bt}$ không là số chính phương.`,
    loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** nhân $S$ với ${b} rồi lấy hiệu hai tổng để tính $${lhs}$, từ đó $${bt}$ thành một luỹ thừa của ${b}; sau đó dùng tính chất: số chính phương có mọi thừa số nguyên tố với số mũ chẵn.

**Bước 1.** Nhân hai vế của $S$ với $${b}$ để được một tổng gần giống $S$ (chỉ lệch hai đầu).

**Bước 2.** Lấy hiệu hai tổng, triệt tiêu các số hạng chung để tìm $${lhs}$ (hiệu là ${b}S−S nên bằng ${hs}S), rồi cộng thêm $${b}$.

**Bước 3.** Xem số mũ của thừa số nguyên tố $${b}$ trong $${bt}$ là số chẵn hay số lẻ.

**Bước 4.** Lập luận số chính phương thì mọi số mũ trong phân tích ra thừa số nguyên tố đều chẵn rồi kết luận.

**Chú ý:** nhớ cộng $${b}$ vào kết quả trước khi nhận xét về số mũ.

${P2(
      `Ta có $S=${b}+${b}^2+${b}^3+\\dots+${b}^{${k}}$ (1)`,
      `Suy ra $${b}S=${b}^2+${b}^3+${b}^4+\\dots+${b}^{${k + 1}}$ (2)`,
      `Lấy (2) trừ (1) ta được $${b}S-S=${b}^{${k + 1}}-${b}$`,
      hs === 1 ? `Suy ra $S=${b}^{${k + 1}}-${b}$` : `Suy ra $${hs}S=${b}^{${k + 1}}-${b}$`,
      `Suy ra $${bt}=${b}^{${k + 1}}$`,
      BO(`${b}^{${k + 1}}`),
      `Mà $${b}^{${k + 1}}$ có số mũ của thừa số nguyên tố $${b}$ là $${k + 1}$, là số lẻ. Mâu thuẫn.`,
      `Vậy $${bt}$ không là số chính phương.`)}`,
  }
}
for (const [b, k, g] of [[2, 50, GOC.b4a], [5, 30, GOC.b4b], [7, 20, GOC.b4b]]) S1.push({ dang: 'NDB02801', kieu: 'H1', parent: g, ...H1(b, k) })
// H2: tổng chữ số ≡ 2 (mod 3)
{ const s = 2024; ck('H2 s mod 3 = 2', s % 3 === 2)
  ck('H2 bình phương mod 3 ∈{0,1}', [...Array(3000).keys()].every((m) => [0, 1].includes((m * m) % 3)))
  S1.push({ dang: 'NDB02801', kieu: 'H2', parent: GOC.b13, noi_dung: String.raw`Một số tự nhiên có tổng các chữ số bằng $${s}$ thì có thể là số chính phương được không? Vì sao?`, loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** số chính phương khi chia cho 3 chỉ dư $0$ hoặc $1$; còn số tự nhiên chia cho 3 dư bằng số dư của tổng các chữ số của nó chia cho 3. So hai điều này với nhau.

**Bước 1.** Dùng dấu hiệu chia hết cho 3: một số và tổng các chữ số của nó có cùng số dư khi chia cho 3. Tìm số dư của tổng các chữ số cho 3.

**Bước 2.** Viết số tự nhiên bất kì $m$ theo số dư khi chia cho 3 ($m=3q$, $m=3q+1$, $m=3q+2$), rồi tính $m.m$ để biết số chính phương chia 3 dư bao nhiêu.

**Bước 3.** So hai số dư và kết luận.

**Chú ý:** chỉ cần số dư không khớp là đủ để khẳng định số đó không là số chính phương.

${P2(`Gọi $n$ là số tự nhiên có tổng các chữ số bằng $${s}$.`, `Ta có $${s}=3.${Math.floor(s / 3)}+${s % 3}$ nên tổng các chữ số của $n$ chia cho 3 dư ${s % 3}.`, `Do đó $n$ chia cho 3 dư ${s % 3}.`, `Giả sử $n$ là số chính phương, tức là $n=m.m$ với $m\\in\\mathbb{N}$. Xét số dư của $m$ khi chia cho 3:`, `Nếu $m=3q$ thì $m.m=9q^2=3.3q^2$ chia hết cho 3.`, `Nếu $m=3q+1$ thì $m.m=9q^2+6q+1=3.(3q^2+2q)+1$ chia cho 3 dư 1.`, `Nếu $m=3q+2$ thì $m.m=9q^2+12q+4=3.(3q^2+4q+1)+1$ chia cho 3 dư 1.`, `Vậy số chính phương chia cho 3 chỉ dư $0$ hoặc $1$, trái với $n$ chia cho 3 dư ${s % 3}.`, `Vậy một số tự nhiên có tổng các chữ số bằng $${s}$ không là số chính phương.`)}` }) }
// H4: x^{4n}+(x+1)^{4n}+(x+2)^{4n}+(x+3)^{4n}, x ⋮ 4
const H4 = (x) => {
  ck(`H4 x=${x} ⋮4`, x % 4 === 0)
  for (const n of [1, 2, 3]) { const A = mu(x, 4 * n) + mu(x + 1, 4 * n) + mu(x + 2, 4 * n) + mu(x + 3, 4 * n); ck(`H4 x=${x} n=${n}`, A % 4n === 2n && !laSCP(A)) }
  const q = x / 4
  return {
    noi_dung: String.raw`Chứng minh rằng $A=${x}^{4n}+${x + 1}^{4n}+${x + 2}^{4n}+${x + 3}^{4n}$ không phải là số chính phương với mọi số nguyên dương $n$.`,
    loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** tính số dư của $A$ khi chia cho 4: được dư $2$, tức là $A$ chia hết cho 2 nhưng không chia hết cho 4; số như vậy có thừa số nguyên tố 2 với số mũ lẻ nên không là số chính phương.

**Bước 1.** Xét $${x}^{4n}$ và $${x + 2}^{4n}$: tìm xem chúng có chia hết cho 4 không (chú ý $n\ge 1$ nên có ít nhất 4 thừa số).

**Bước 2.** Xét $${x + 1}^{4n}$: $${x + 1}$ chia 4 dư 1; chứng tỏ tích các số chia 4 dư 1 vẫn chia 4 dư 1.

**Bước 3.** Xét $${x + 3}^{4n}$: $${x + 3}$ chia 4 dư 3; nhóm các thừa số thành từng cặp $${x + 3}.${x + 3}$ rồi tính số dư của một cặp.

**Bước 4.** Cộng bốn số dư để được số dư của $A$ khi chia cho 4, rồi lập luận về số mũ của thừa số nguyên tố 2.

**Chú ý:** hai số chia 4 dư 1 nhân với nhau vẫn chia 4 dư 1, vì $(4q+1)(4r+1)=4.(4qr+q+r)+1$.

${P2(
      `Vì $${x}=4.${q}$ chia hết cho 4 nên $${x}^{4n}$ (tích của $4n$ thừa số $${x}$) chia hết cho 4.`,
      `Vì $${x + 2}$ chia hết cho 2 nên $${x + 2}^{4n}$ (tích của $4n\\ge 4$ thừa số, mỗi thừa số chia hết cho 2) chia hết cho $2.2=4$.`,
      `Vì $${x + 1}=4.${q}+1$ chia cho 4 dư 1, mà $(4q+1)(4r+1)=4.(4qr+q+r)+1$ chia cho 4 dư 1 nên tích của $4n$ thừa số $${x + 1}$ chia cho 4 dư 1. Do đó $${x + 1}^{4n}$ chia cho 4 dư 1.`,
      `Vì $${x + 3}=4.${q}+3$ nên $${x + 3}.${x + 3}=(4.${q}+3)(4.${q}+3)=4.(4.${q}^2+6.${q}+2)+1$ chia cho 4 dư 1. Mà $${x + 3}^{4n}$ là tích của $2n$ thừa số, mỗi thừa số bằng $${x + 3}.${x + 3}$, nên $${x + 3}^{4n}$ chia cho 4 dư 1.`,
      `Do đó $A$ có số dư khi chia cho 4 là $0+1+0+1=2$, tức là $A=4k+2$ với $k\\in\\mathbb{N}$.`,
      `Suy ra $A$ chia hết cho 2 nhưng $A$ không chia hết cho 4, nên số mũ của thừa số nguyên tố $2$ trong phân tích $A$ ra thừa số nguyên tố bằng $1$.`,
      BO('A'),
      `Mà số mũ của $2$ trong $A$ là $1$, là số lẻ. Mâu thuẫn.`,
      `Vậy $A$ không phải là số chính phương.`)}`,
  }
}
for (const x of [2020, 2024]) S1.push({ dang: 'NDB02801', kieu: 'H4', parent: GOC.b1, ...H4(x) })
// H5: kẹp giữa hai bình phương liên tiếp
const H5 = (a, b, s, nmin, bt, btMoi) => {
  for (let n = nmin; n <= 3000; n++) { const A = BigInt(n) * BigInt(n) + BigInt(a * n + b); ck(`H5 ${bt} n=${n}`, !laSCP(A) && BigInt(n + s) ** 2n < A && A < BigInt(n + s + 1) ** 2n) }
  const lo = s === 0 ? `n.n` : `(n+${s}).(n+${s})`, hi = `(n+${s + 1}).(n+${s + 1})`
  const loE = s === 0 ? `n^2` : `(n+${s})^2`, hiE = `(n+${s + 1})^2`, hiKt = s === 0 ? `n^2+2n+1` : `n^2+${2 * (s + 1)}n+${(s + 1) ** 2}`, loKt = s === 0 ? `n^2` : `n^2+${2 * s}n+${s * s}`
  const lin = (c1, c0) => (c1 === 0 ? `${c0}` : `${c1 === 1 ? '' : c1}n${c0 === 0 ? '' : c0 > 0 ? '+' + c0 : c0}`)
  const sosanh = `$${bt}-(${loKt})=${lin(a - 2 * s, b - s * s)}>0$`
  const hieuHi = `${hiKt}-(${bt})=${lin(2 * (s + 1) - a, (s + 1) ** 2 - b)}`
  const dk = nmin === 1 ? `$n\\ge 1$` : `$n\\ge ${nmin}$`
  return {
    noi_dung: `Chứng minh rằng với mọi số tự nhiên ${dk}, $${btMoi}$ không là số chính phương.`,
    loi_giai: String.raw`**Phần 1. Hướng dẫn**

**Mấu chốt:** chứng minh biểu thức nằm hẳn giữa hai số chính phương của hai số tự nhiên liên tiếp; giữa hai số tự nhiên liên tiếp không có số tự nhiên nào nên biểu thức không thể là số chính phương.

**Bước 1.** Tìm số chính phương $${loE}$ và $${hiE}$ của hai số tự nhiên liên tiếp mà biểu thức nằm giữa, viết $${hiE}$ ra dạng cộng.

**Bước 2.** So sánh biểu thức với $${loE}$ (cần ${dk}) và so sánh với $${hiE}$.

**Bước 3.** Giả sử biểu thức bằng $m.m$, suy ra $m$ nằm hẳn giữa $n+${s}$ và $n+${s + 1}$.

**Bước 4.** Kết luận vì không có số tự nhiên nào nằm hẳn giữa hai số tự nhiên liên tiếp.

**Chú ý:** điều kiện ${dk} là cần thiết (với $n$ nhỏ hơn có thể xảy ra bằng một số chính phương).

${P2(
      `Với ${dk} ta có $${hiE}=${hiKt}$ và $${loE}=${loKt}$.`,
      `Ta có $${hieuHi}>0$ (vì ${dk}) nên $${bt}<${hiE}$.`,
      `Ta có ${sosanh} (vì ${dk}) nên $${bt}>${loE}$.`,
      `Vậy $${loE}<${bt}<${hiE}$.`,
      `Giả sử $${bt}=m.m$ với $m\\in\\mathbb{N}$. Khi đó $${lo}<m.m<${hi}$.`,
      `Nếu $m\\le n+${s}$ thì $m.m\\le ${lo}$, vô lí; nếu $m\\ge n+${s + 1}$ thì $m.m\\ge ${hi}$, vô lí. Vậy $n+${s}<m<n+${s + 1}$.`,
      `Không có số tự nhiên $m$ nào nằm hẳn giữa hai số tự nhiên liên tiếp $n+${s}$ và $n+${s + 1}$. Mâu thuẫn.`,
      `Vậy $${bt}$ không là số chính phương.`)}`,
  }
}
for (const [a, b, s, nmin, bt] of [[1, 1, 0, 1, 'n^2+n+1'], [2, 0, 0, 1, 'n^2+2n'], [3, 0, 1, 2, 'n^2+3n'], [1, 2, 0, 2, 'n^2+n+2']]) S1.push({ dang: 'NDB02801', kieu: 'H5', parent: GOC.b3, ...H5(a, b, s, nmin, bt, bt) })
ck('NDB02801: 10 clone', S1.length === 10)

// kiểm định dạng
const TAT = [{ ...G0, kieu: 'GOC' }, ...S3, ...S0, ...S1]
for (const q of TAT) {
  const t = q.noi_dung + '\n' + q.loi_giai
  if ((t.match(/\$/g) ?? []).length % 2) { console.error('✘ số $ lẻ', q.kieu, q.noi_dung.slice(0, 50)); process.exit(3) }
  if (/\\cdot|\\times|\\left|\\right|\$\{|undefined|NaN/.test(t)) { console.error('✘ ký hiệu/giá trị lạ', q.kieu, q.noi_dung.slice(0, 50)); process.exit(3) }
  if (!/\*\*Phần 1\. Hướng dẫn\*\*[\s\S]+\*\*Phần 2\. Trình bày\*\*/.test(q.loi_giai)) { console.error('✘ thiếu 2 phần', q.kieu); process.exit(3) }
  const b = (q.loi_giai.match(/\*\*Bước \d+\./g) ?? []).length
  if (b < 3 || b > 6) { console.error('✘ số bước', q.kieu, b); process.exit(3) }
}
import { createRequire } from 'node:module'
const katex = createRequire(new URL('../../../../../package.json', import.meta.url))('katex')
for (const q of TAT) for (const m of (q.noi_dung + "\n" + q.loi_giai).matchAll(/\$([^$]+)\$/g)) { try { katex.renderToString(m[1], { throwOnError: true, strict: "ignore" }) } catch (e) { console.error("✘ KaTeX", q.kieu, m[1].slice(0, 80)); process.exit(3) } }
console.log(`✔ kiểm máy + định dạng: gốc 1 + clone ${S3.length + S0.length + S1.length} (NDB03050 ${S3.length} · NDB02800 ${S0.length} · NDB02801 ${S1.length})`)

// ───────────────── ghi file JSON + HTML
mkdirSync('.nhap-tam', { recursive: true })
const L = (q, extra = {}) => ({ khoi: '6', loai_cau: 'tu_luan', noi_dung: q.noi_dung, dap_an: null, loi_giai: q.loi_giai, dang_bai: q.dang, dang_bai_chot: true, ten_de_goc: null, nguon: 'clone', nguon_giai: 'ai', ghi_chu_nhap: `Clone máy sinh (${q.kieu}) 14/11 — đáp số và mọi khẳng định kiểm bằng vét cạn/BigInt.`, ...extra })
const goc = L(G0, { nguon: 'le', ten_de_goc: 'Thùy gửi 14/11/2026 (ảnh) — Tìm số nguyên n để n²+7 là số chính phương', ghi_chu_nhap: `Câu do Thùy gửi. ${G0.ghi}` })
const clones = [...S3, ...S0, ...S1].map((q) => L(q))
writeFileSync('.nhap-tam/scp-goc.json', JSON.stringify([goc]))
writeFileSync(D + 'clone-cau.json', JSON.stringify([{ id: 'GOC', ...goc }, ...[...S3, ...S0, ...S1].map((q, i) => ({ id: `C${i + 1}`, parent: q.parent ?? 'GOC', ...clones[i] }))], null, 1))

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const fmt = (s) => esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>')
const IMG = process.env.SCP_IMG6
const anh = IMG && existsSync(IMG) ? `<img src="data:image/png;base64,${readFileSync(IMG).toString('base64')}" style="max-width:100%;border:1px solid #ddd">` : ''
let h = `<!doctype html><html lang="vi"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Duyệt: Số chính phương — gốc + 37 clone</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>body{font:15px/1.65 system-ui,'Segoe UI',sans-serif;max-width:1000px;margin:0 auto;padding:16px;background:#fafafb;color:#1a1a2e}h1{font-size:22px}h2{margin-top:26px;border-bottom:2px solid #4c6fff;padding-bottom:4px}.q{background:#fff;border:1px solid #e1e1ec;border-left:5px solid #4c6fff;border-radius:8px;padding:8px 14px;margin:10px 0}.tag{display:inline-block;font-size:11.5px;border-radius:10px;padding:1px 9px;color:#fff;background:#2D9CDB;margin-right:4px}.box{background:#fff;border:1px solid #dde;border-radius:10px;padding:10px 14px}</style></head><body>
<h1>Số chính phương — câu của Thùy + 37 clone (mỗi dạng đủ 15 bài)</h1>
<div class="box">Gốc (ảnh Thùy) vào <b>NDB03050</b>; clone: NDB03050 ×14 · NDB02800 ×13 · NDB02801 ×10. Clone sinh bằng <b>code</b>, mọi khẳng định kiểm máy (vét cạn / BigInt). Chưa duyệt — Thùy xem rồi nói "duyệt".<br>${anh}</div>`
const nhom = [['NDB03050', 'Tìm số nguyên để biểu thức là số chính phương', [{ ...G0, kieu: 'GỐC' }, ...S3]], ['NDB02800', 'Chứng minh dãy lũy thừa không phải số chính phương (2 gốc cũ + 13 clone)', S0], ['NDB02801', 'Chứng minh biểu thức không phải số chính phương (5 gốc cũ + 10 clone)', S1]]
for (const [id, ten, ds] of nhom) { h += `<h2>${id} — ${esc(ten)}</h2>`; for (const q of ds) h += `<div class="q"><span class="tag">${esc(q.kieu)}</span><p><b>Đề:</b><br>${fmt(q.noi_dung)}</p><details><summary>Lời giải</summary><div>${fmt(q.loi_giai)}</div></details></div>` }
h += `<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"></script><script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"></script><script>renderMathInElement(document.body,{delimiters:[{left:'$',right:'$',display:false}],throwOnError:false})</script></body></html>`
writeFileSync(D + 'so-chinh-phuong-clone-duyet.html', h)
console.log('✔ so-chinh-phuong-clone-duyet.html', (h.length / 1024).toFixed(0) + ' KB')

// ───────────────── nhập kho
const nk = (f) => { const a = ['scripts/nhap_kho.mjs', 'insert', '--subject', 'dai', '--json', f]; if (!GHI) a.push('--thu'); const r = spawnSync('node', a, { encoding: 'utf8' }); try { return JSON.parse(r.stdout) } catch { return { ok: false, error: (r.stdout + r.stderr).slice(0, 700) } } }
const j1 = nk('.nhap-tam/scp-goc.json'); console.log(GHI ? '── GHI gốc ──' : '── chạy khô gốc ──', JSON.stringify(j1).slice(0, 400)); if (!j1.ok) process.exit(1)
writeFileSync('.nhap-tam/scp-clone.json', JSON.stringify(clones))
const j2 = nk('.nhap-tam/scp-clone.json'); console.log(GHI ? '── GHI clone ──' : '── chạy khô clone ──', JSON.stringify({ ...j2, ma_cau_list: j2.ma_cau_list?.length }).slice(0, 500)); if (!j2.ok) process.exit(1)
if (GHI) {
  const gocMa = j1.ma_cau_list[0], cl = j2.ma_cau_list
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL ?? (process.loadEnvFile('.env'), process.env.DATABASE_URL) }); await c.connect()
  try {
    await c.query('begin')
    // gốc: gán + duyệt (câu của Thùy)
    await c.query(`update dai_cau_hoi set da_duyet=true, duyet_nguon='ai', duyet_at=now() where ma_cau=$1`, [gocMa])
    const all = [...S3, ...S0, ...S1]
    for (let i = 0; i < cl.length; i++) {
      const par = all[i].parent ?? gocMa
      await c.query(`update dai_cau_hoi set nguon='clone', parent_ma_cau=$2, clone_method='claude_may_sinh', kiem_may='khop', kiem_may_boi='claude_code', kiem_may_at=now(), kiem_may_ghi=$3 where ma_cau=$1`, [cl[i], par, `Máy sinh theo khuôn ${all[i].kieu}; mọi khẳng định kiểm vét cạn/BigInt (clone.mjs).`])
    }
    const st = (await c.query(`select g.dang_bai_id d, count(*) n, count(*) filter(where q.da_duyet) duyet from dai_bdm_gan_cau g join dai_cau_hoi q on q.ma_cau=g.ma_cau where g.dang_bai_id in ('NDB02800','NDB02801','NDB03050') and q.xoa_at is null group by 1 order by 1`)).rows
    console.table(st)
    if (st.some((r) => Number(r.n) !== 15)) throw new Error('mỗi dạng phải đủ 15: ' + JSON.stringify(st))
    await c.query('commit'); console.log('✔ ĐÃ GHI', gocMa, cl.length, 'clone'); writeFileSync(D + 'clone-ma-cau.json', JSON.stringify({ goc: gocMa, clone: cl }))
  } catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
}
