// ghi-dang-moi-2210.mjs — đợt 4 (Thùy sửa bản đồ 22/10): điền LÝ THUYẾT + VÍ DỤ cho 4 dạng mới (NDB01362, 01363, 01368, 01369) + MÔ TẢ + LÝ THUYẾT nhóm mới NNB01656.
//   node kho-rules/dai/lo/k6/ban-do-moi/ghi-dang-moi-2210.mjs [--ghi]   (mặc định chạy thử, ROLLBACK)
// Chỉ ghi ô RỖNG (điều kiện trong CÙNG câu UPDATE). Dấu nhân chấm. Quy ước "tích bằng 0" theo kho: xét từng thừa số = 0, loại giá trị không là số tự nhiên (T…708, T…710, T…1026).
import pg from 'pg'
import { createRequire } from 'node:module'
process.loadEnvFile('.env')
const R = String.raw

const MO_TA_NHOM = {
  NNB01656: 'Chứng minh một biểu thức chứa biến, hoặc một tổng có quy luật, chia hết cho một số tự nhiên bằng tính chất chia hết của tổng, hiệu, tích',
}

const NHOM_LT = {
  NNB01656: R`##TC
Nếu $a$ và $b$ cùng chia hết cho $m$ thì $a+b$ và $a-b$ (với $a\ge b$) cũng chia hết cho $m$.
Nếu một thừa số của tích chia hết cho $m$ thì cả tích chia hết cho $m$: $a\vdots m$ ⇒ $a.b\vdots m$.
Trong hai số tự nhiên liên tiếp luôn có đúng một số chẵn, nên tích $n.(n+1)$ chia hết cho $2$ với mọi số tự nhiên $n$.
$a^{n+1}=a^n.a$ và $a^{n+2}=a^n.a^2$ (nhân hai lũy thừa cùng cơ số): dùng để đặt $a^n$ làm thừa số chung.

##PP
Biến đổi biểu thức đã cho thành một tích (hoặc tổng) mà mỗi thừa số / số hạng hiển nhiên chia hết cho số cần chứng minh.
Các cách thường dùng: đặt thừa số chung; nhóm các số hạng; xét hai trường hợp (chẵn / lẻ, các số dư khác nhau); với tổng có quy luật, nhân thêm để các số hạng liên tiếp triệt tiêu rồi tính ra giá trị.
Kết luận bằng tính chất chia hết: "mỗi số hạng chia hết cho $m$ nên tổng chia hết cho $m$", hoặc "tích có thừa số chia hết cho $m$".

##CY
Phải nêu rõ biểu thức luôn đúng với MỌI số tự nhiên $n$ (hoặc mọi $n$ thoả điều kiện đề cho), không thử vài giá trị rồi kết luận.
Khi xét trường hợp, các trường hợp phải bao phủ hết mọi khả năng (ví dụ $n$ chẵn hoặc $n$ lẻ).`,
}

const LT = {
  NDB01362: R`##PP
Nhận ra vế trái là một tích của các thừa số và vế phải bằng $0$.
Một tích bằng $0$ khi ít nhất một thừa số bằng $0$: cho lần lượt từng thừa số bằng $0$ và tìm $x$ (tìm số bị trừ, số hạng chưa biết).
Kiểm tra từng giá trị tìm được có là số tự nhiên không; loại giá trị không là số tự nhiên. Kết luận $x\in\{\dots\}$.

##CY
Với $x$ là số tự nhiên, thừa số dạng $x+3$ luôn lớn hơn hoặc bằng $3$ nên không bằng $0$: trường hợp đó không xảy ra.
Thừa số dạng $2x-1$ bằng $0$ cho $2x=1$, không có số tự nhiên $x$ nào thoả: loại.
Mỗi thừa số cho một trường hợp độc lập, lấy hết các giá trị thoả mãn.`,

  NDB01363: R`##PP
Nhận ra vế trái là tích của hai thừa số, trong đó có thừa số chứa lũy thừa của $x$, vế phải bằng $0$.
Cho từng thừa số bằng $0$. Với thừa số có $x^n$: tìm $x^n$ trước (số bị trừ bằng hiệu cộng số trừ), rồi viết số vừa tìm thành lũy thừa cùng số mũ $n$ để so sánh cơ số ($x^2=81=9^2$ ⇒ $x=9$).
Với thừa số có lũy thừa của một số (như $5^2$): tính lũy thừa trước rồi tìm $x$.
Tổng hợp các giá trị thoả mãn, kết luận $x\in\{\dots\}$.

##CY
Số mũ chẵn: với $x$ là số tự nhiên, $x^2=81$ chỉ cho $x=9$ (không xét số âm).
Nếu số vế phải không viết được thành lũy thừa cùng số mũ với vế trái (ví dụ $x^2=50$) thì không có số tự nhiên $x$ thoả mãn.
Mỗi thừa số cho một trường hợp độc lập.`,

  NDB01368: R`##PP
Biến đổi biểu thức đã cho thành một tích có một thừa số chia hết cho số cần chứng minh (đặt thừa số chung, tách lũy thừa $a^{n+1}=a^n.a$).
Nếu biểu thức không tách được ngay, xét các trường hợp có thể xảy ra của $n$ (chẵn / lẻ, các số dư khi chia cho số cần chứng minh) và chứng tỏ trường hợp nào cũng chia hết.
Kết luận bằng tính chất chia hết: tích có một thừa số chia hết cho $m$ thì chia hết cho $m$.

##CY
Phải chứng minh cho MỌI số tự nhiên $n$, không thử vài giá trị.
Trường hợp xét phải bao phủ hết mọi khả năng, và mỗi trường hợp phải có kết luận riêng.`,

  NDB01369: R`##PP
Quan sát quy luật của các số hạng: các số hạng có chung một thừa số, hoặc các thừa số tăng dần đều nhau.
Trường hợp có thừa số chung: đặt thừa số chung ra ngoài, tích có một thừa số chia hết cho số cần chứng minh.
Trường hợp các tích liên tiếp (dạng $1.2+2.3+3.4+\dots$): nhân cả tổng với một số thích hợp để mỗi số hạng viết được dưới dạng hiệu hai tích, các tích ở giữa triệt tiêu; tính ra giá trị của tổng rồi kiểm tra chia hết.
Kết luận bằng tính chất chia hết.

##CY
Khi nhân cả tổng với $3$ để triệt tiêu, nhớ chia lại cho $3$ để ra giá trị của tổng ban đầu.
Số số hạng và số hạng cuối phải đếm đúng khi áp dụng quy luật.`,
}

const VD = {
  NDB01362: R`##VD
Tìm số tự nhiên $x$, biết: $(x-6).(x-5)=0$.
**Hướng dẫn giải:**
Vì tích bằng $0$ nên $x-6=0$ hoặc $x-5=0$.

Trường hợp $x-6=0$: $x=0+6=6$.

Trường hợp $x-5=0$: $x=0+5=5$.

Cả hai giá trị đều là số tự nhiên nên đều nhận.

Vậy $x\in\{5;6\}$.

##VD
Tìm số tự nhiên $x$, biết: $(x+7).(2x-8)=0$.
**Hướng dẫn giải:**
Vì tích bằng $0$ nên $x+7=0$ hoặc $2x-8=0$.

Trường hợp $x+7=0$: với $x$ là số tự nhiên thì $x+7\ge 7$, khác $0$, trường hợp này không xảy ra.

Trường hợp $2x-8=0$:

$2x=0+8$

$2x=8$

$x=8:2$

$x=4$

Thử lại: $(4+7).(2.4-8)=11.0=0$ (đúng).

Vậy $x=4$.`,

  NDB01363: R`##VD
Tìm số tự nhiên $x$, biết: $(x^2-81).(x-5^2)=0$.
**Hướng dẫn giải:**
Vì tích bằng $0$ nên $x^2-81=0$ hoặc $x-5^2=0$.

Trường hợp $x^2-81=0$:

$x^2=0+81$

$x^2=81$

$x^2=9^2$

$x=9$

Trường hợp $x-5^2=0$:

$x-25=0$

$x=0+25$

$x=25$

Vậy $x\in\{9;25\}$.

##VD
Tìm số tự nhiên $x$, biết: $(x^3-8).(2x-10)=0$.
**Hướng dẫn giải:**
Vì tích bằng $0$ nên $x^3-8=0$ hoặc $2x-10=0$.

Trường hợp $x^3-8=0$:

$x^3=0+8$

$x^3=8$

$x^3=2^3$

$x=2$

Trường hợp $2x-10=0$:

$2x=0+10$

$2x=10$

$x=10:2$

$x=5$

Vậy $x\in\{2;5\}$.`,

  NDB01368: R`##VD
Chứng minh rằng với mọi số tự nhiên $n$, tích $n.(n+1)$ chia hết cho $2$.
**Hướng dẫn giải:**
Xét hai trường hợp của $n$.

Trường hợp $n$ chẵn: $n\vdots 2$ nên $n.(n+1)\vdots 2$.

Trường hợp $n$ lẻ: $n+1$ là số chẵn, $(n+1)\vdots 2$ nên $n.(n+1)\vdots 2$.

Hai trường hợp bao phủ mọi số tự nhiên $n$.

Vậy $n.(n+1)\vdots 2$ với mọi số tự nhiên $n$.

##VD
Chứng minh rằng với mọi số tự nhiên $n$, biểu thức $A=5^n+5^{n+1}+5^{n+2}$ chia hết cho $31$.
**Hướng dẫn giải:**
Ta có $5^{n+1}=5^n.5$ và $5^{n+2}=5^n.5^2=5^n.25$.

$A=5^n+5^n.5+5^n.25$

$A=5^n.(1+5+25)$

$A=5^n.31$

Tích $5^n.31$ có thừa số $31\vdots 31$ nên $A\vdots 31$.

Vậy $A\vdots 31$ với mọi số tự nhiên $n$.`,

  NDB01369: R`##VD
Chứng minh rằng tổng $A=3.4+3.5+3.6+\dots+3.20$ chia hết cho $3$.
**Hướng dẫn giải:**
Mỗi số hạng của $A$ có thừa số chung $3$. Đặt $3$ ra ngoài:

$A=3.(4+5+6+\dots+20)$

Tích này có thừa số $3\vdots 3$ nên $A\vdots 3$.

Vậy $A\vdots 3$.

##VD
Tính $B=1.2+2.3+3.4+\dots+19.20$ rồi chứng minh $B$ chia hết cho $10$.
**Hướng dẫn giải:**
Nhân cả hai vế với $3$. Với mỗi số hạng $k.(k+1)$ ta có $3.k.(k+1)=k.(k+1).(k+2)-(k-1).k.(k+1)$.

$3B=1.2.3+(2.3.4-1.2.3)+(3.4.5-2.3.4)+\dots+(19.20.21-18.19.20)$

Các tích ở giữa triệt tiêu, còn lại:

$3B=19.20.21=7980$

$B=7980:3=2660$

Số $2660$ có chữ số tận cùng là $0$ nên $B\vdots 10$.

Vậy $B=2660$ và $B\vdots 10$.`,
}

// ───────── KIỂM ─────────
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const loi = []
const soat = (grp, s) => {
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${grp}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${grp}: KaTeX «${m[1].slice(0, 40)}» ${e.message.slice(0, 60)}`) }
    if (/\\cdot|\\times/.test(m[1])) loi.push(`${grp}: cấm \\cdot/\\times`)
  }
}
for (const [k, v] of Object.entries(NHOM_LT)) soat('nhóm ' + k, v)
for (const [k, v] of Object.entries(LT)) soat('LT ' + k, v)
for (const [k, v] of Object.entries(VD)) soat('VD ' + k, v)
const chk = (c, t) => { if (!c) loi.push(t) }
const nghiem = (f, g = 200) => { const r = []; for (let x = 0; x <= g; x++) if (f(x)) r.push(x); return r.join(',') }
chk(nghiem((x) => (x - 6) * (x - 5) === 0) === '5,6', '(x-6)(x-5)=0')
chk(nghiem((x) => (x + 7) * (2 * x - 8) === 0) === '4', '(x+7)(2x-8)=0')
chk(nghiem((x) => (x * x - 81) * (x - 25) === 0) === '9,25', '(x^2-81)(x-5^2)=0')
chk(nghiem((x) => (x ** 3 - 8) * (2 * x - 10) === 0) === '2,5', '(x^3-8)(2x-10)=0')
chk(Array.from({ length: 300 }, (_, n) => n * (n + 1) % 2 === 0).every(Boolean), 'n(n+1)⋮2')
{ let ok = true; for (let n = 0n; n < 40n; n++) { const A = 5n ** n + 5n ** (n + 1n) + 5n ** (n + 2n); if (A % 31n !== 0n || A !== 5n ** n * 31n) ok = false } chk(ok, '5^n+5^(n+1)+5^(n+2)⋮31') }
{ let A = 0; for (let k = 4; k <= 20; k++) A += 3 * k; chk(A % 3 === 0 && A === 3 * (4 + 5 + 6 + 7 + 8 + 9 + 10 + 11 + 12 + 13 + 14 + 15 + 16 + 17 + 18 + 19 + 20), '3.4+…+3.20')
  let B = 0; for (let k = 1; k <= 19; k++) B += k * (k + 1)
  chk(B === 2660 && 3 * B === 19 * 20 * 21 && 19 * 20 * 21 === 7980 && B % 10 === 0, '1.2+…+19.20=2660')
  for (let k = 1; k <= 30; k++) chk(3 * k * (k + 1) === k * (k + 1) * (k + 2) - (k - 1) * k * (k + 1), 'tách 3k(k+1)') }
if (loi.length) { console.error('✘\n  ' + loi.join('\n  ')); process.exit(3) }
console.log('✔ KaTeX + số liệu đạt')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL })
await c.connect()
try {
  await c.query('begin')
  const kq = (r) => (r.rowCount === 1 ? 'điền được' : 'BỎ QUA (đã có chữ / không tồn tại)')
  for (const [id, mt] of Object.entries(MO_TA_NHOM)) console.log(`mô tả nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set mo_ta = $2, updated_at = now() where id = $1 and coalesce(btrim(mo_ta), '') = ''`, [id, mt]))}`)
  for (const id of Object.keys(LT)) console.log(`LT+VD dạng ${id}: ${kq(await c.query(`update dai_bdm_dang_bai set ly_thuyet = $2, vi_du = $3, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = '' and coalesce(btrim(vi_du), '') = ''`, [id, LT[id], VD[id]]))}`)
  for (const id of Object.keys(NHOM_LT)) console.log(`LT nhóm ${id}: ${kq(await c.query(`update dai_bdm_nhom set ly_thuyet = $2, updated_at = now() where id = $1 and coalesce(btrim(ly_thuyet), '') = ''`, [id, NHOM_LT[id]]))}`)
  if (GHI) { await c.query('commit'); console.log('✔ đã ghi') } else { await c.query('rollback'); console.log('ROLLBACK — thêm --ghi để ghi thật') }
} catch (e) { try { await c.query('rollback') } catch {} console.error('✘', e.message); process.exitCode = 1 } finally { await c.end() }
