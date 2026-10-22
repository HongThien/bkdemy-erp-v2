// K7 — điền mô tả / lý thuyết / ví dụ cho 5 dạng bài Thùy thêm sau đợt 21/10 (22/10: "t mới cập nhật thêm").
// Luật: CHỈ điền ô đang TRỐNG (không đè chữ của Thùy). Chạy thử = ROLLBACK; thêm --ghi để ghi thật.
//   node kho-rules/dai/lo/k7/dien-lt-vd-2210.mjs [--ghi]
import pg from 'pg'
import { bien } from '../../../../scripts/kho/cau-hinh.mjs'

const R = String.raw
const VD = (...ds) => ds.join('\n\n')

const NOI_DUNG = {
  // ───────────────────────── Tìm x: (x+a)/b + (x+c)/d + … = k
  NDB01348: {
    lt: R`##PP
Bước 1. Tách số $k$ ở vế phải (hoặc thêm bớt cùng một số vào từng phân số) sao cho tử của mọi phân số đều trở thành cùng một biểu thức $x+m$.
Bước 2. Rút $x+m$ làm thừa số chung: $(x+m)\left(\dfrac1b+\dfrac1c+\dfrac1d+\dots\right)=0$.
Bước 3. Chứng tỏ thừa số còn lại (tổng các phân số) khác $0$. Suy ra $x+m=0$, tìm $x$.

##CY
Muốn đưa các tử về giống nhau thì với phân số $\dfrac{x+a}{b}$ ta cộng thêm (hoặc trừ đi) số $\dfrac{m-a}{b}$; trong đề thường chọn sao cho $\dfrac{m-a}{b}$ là số nguyên, ví dụ $1;\ 2;\ 3$.`,
    vd: VD(
      R`##VD
Ví dụ 1: Tìm $x$ biết: $\dfrac{x+1}{2009}+\dfrac{x+2}{2008}+\dfrac{x+3}{2007}=-3$.
**Hướng dẫn giải:**
$\dfrac{x+1}{2009}+\dfrac{x+2}{2008}+\dfrac{x+3}{2007}+3=0$
$\left(\dfrac{x+1}{2009}+1\right)+\left(\dfrac{x+2}{2008}+1\right)+\left(\dfrac{x+3}{2007}+1\right)=0$
$\dfrac{x+2010}{2009}+\dfrac{x+2010}{2008}+\dfrac{x+2010}{2007}=0$
$(x+2010)\left(\dfrac1{2009}+\dfrac1{2008}+\dfrac1{2007}\right)=0$
Vì $\dfrac1{2009}+\dfrac1{2008}+\dfrac1{2007}>0$ nên $x+2010=0$, suy ra $x=-2010$.
Vậy $x=-2010$.`,
      R`##VD
Ví dụ 2: Tìm $x$ biết: $\dfrac{x+121}{21}+\dfrac{x+144}{22}+\dfrac{x+169}{23}=6$.
**Hướng dẫn giải:**
Tách $6=1+2+3$:
$\left(\dfrac{x+121}{21}-1\right)+\left(\dfrac{x+144}{22}-2\right)+\left(\dfrac{x+169}{23}-3\right)=0$
$\dfrac{x+100}{21}+\dfrac{x+100}{22}+\dfrac{x+100}{23}=0$
$(x+100)\left(\dfrac1{21}+\dfrac1{22}+\dfrac1{23}\right)=0$
Vì $\dfrac1{21}+\dfrac1{22}+\dfrac1{23}>0$ nên $x+100=0$, suy ra $x=-100$.
Vậy $x=-100$.`,
      R`##VD
Ví dụ 3: Tìm $x$ biết: $\dfrac{x+29}{31}-\dfrac{x+27}{33}=\dfrac{x+17}{43}-\dfrac{x+15}{45}$.
**Hướng dẫn giải:**
Mỗi phân số được viết lại thành $\dfrac{x+60}{\text{mẫu}}-1$:
$\left(\dfrac{x+60}{31}-1\right)-\left(\dfrac{x+60}{33}-1\right)=\left(\dfrac{x+60}{43}-1\right)-\left(\dfrac{x+60}{45}-1\right)$
$(x+60)\left(\dfrac1{31}-\dfrac1{33}\right)=(x+60)\left(\dfrac1{43}-\dfrac1{45}\right)$
$(x+60)\left(\dfrac1{31}-\dfrac1{33}-\dfrac1{43}+\dfrac1{45}\right)=0$
Vì $\dfrac1{31}-\dfrac1{33}=\dfrac2{1023}$ và $\dfrac1{43}-\dfrac1{45}=\dfrac2{1935}$ khác nhau nên thừa số thứ hai khác $0$.
Do đó $x+60=0$, suy ra $x=-60$.
Vậy $x=-60$.`),
  },

  // ───────────────────────── Biểu đồ / Thống kê
  NDB01349: {
    lt: R`##ĐN
- Dữ liệu **định tính** là dữ liệu không phải số (tên, màu sắc, xếp loại,...). Dữ liệu **định lượng** là dữ liệu số (chiều cao, điểm số, số lượng,...).
- Biểu đồ hình quạt tròn biểu diễn tỉ lệ phần trăm của từng phần so với toàn bộ: cả hình tròn ứng với $100\%$.
- Biểu đồ đoạn thẳng (biểu đồ đường) biểu diễn sự thay đổi của một đại lượng theo thời gian.

##TC
- Tổng các tỉ lệ phần trăm trong biểu đồ hình quạt tròn bằng $100\%$.
- Số lượng của một phần $=$ tổng số $\times$ tỉ lệ phần trăm của phần đó.
- Góc ở tâm của một hình quạt $=$ tỉ lệ phần trăm $\times\ 360^\circ$.

##PP
Bước 1. Đọc kĩ tiêu đề, chú thích, đơn vị của biểu đồ.
Bước 2. Đọc số liệu từng phần (từng điểm) cần dùng.
Bước 3. Tính theo yêu cầu (tỉ lệ, số lượng, tổng, hiệu, so sánh) rồi kết luận.`,
    vd: VD(
      R`##VD
Ví dụ 1: Biểu đồ hình quạt tròn biểu diễn kết quả khảo sát môn thể thao yêu thích của $200$ học sinh như sau: Bóng đá $35\%$; Bơi lội $25\%$; Cầu lông $30\%$; còn lại là các môn khác. a) Môn khác chiếm bao nhiêu phần trăm? b) Có bao nhiêu học sinh thích bóng đá? c) Hình quạt biểu diễn môn Bơi lội có góc ở tâm bao nhiêu độ?
**Hướng dẫn giải:**
a) Tỉ lệ các môn khác: $100\%-35\%-25\%-30\%=10\%$.
b) Số học sinh thích bóng đá: $200\cdot35\%=70$ (học sinh).
c) Góc ở tâm của hình quạt Bơi lội: $25\%\cdot360^\circ=90^\circ$.`,
      R`##VD
Ví dụ 2: Biểu đồ đoạn thẳng cho biết doanh thu của một cửa hàng trong $5$ tháng đầu năm (đơn vị: triệu đồng): tháng 1: $20$; tháng 2: $25$; tháng 3: $30$; tháng 4: $28$; tháng 5: $35$. a) Tháng nào có doanh thu cao nhất? b) Tính tổng doanh thu $5$ tháng. c) Tháng nào có doanh thu tăng nhiều nhất so với tháng trước?
**Hướng dẫn giải:**
a) Doanh thu cao nhất ở tháng 5 ($35$ triệu đồng).
b) Tổng doanh thu: $20+25+30+28+35=138$ (triệu đồng).
c) Mức tăng so với tháng trước: tháng 2: $5$; tháng 3: $5$; tháng 4: $-2$ (giảm); tháng 5: $7$.
Vậy tháng 5 có doanh thu tăng nhiều nhất ($7$ triệu đồng).`,
      R`##VD
Ví dụ 3: Phân loại các dữ liệu sau thành dữ liệu định tính hay định lượng: a) màu sắc yêu thích của học sinh; b) chiều cao (cm) của học sinh; c) xếp loại học lực; d) số anh chị em ruột của mỗi học sinh.
**Hướng dẫn giải:**
a) Dữ liệu định tính. b) Dữ liệu định lượng. c) Dữ liệu định tính. d) Dữ liệu định lượng.`),
  },

  // ───────────────────────── Dãy hiệu tích chứa căn
  NDB01350: {
    lt: R`##TC
- Căn bậc hai số học: $\sqrt{a^2}=a$ với $a\ge0$.
- Với $k$ là số tự nhiên khác $0$: $\dfrac{k}{n(n+k)}=\dfrac1n-\dfrac1{n+k}$ ($n\ne0,\ n+k\ne0$).

##PP
Bước 1. Tính các căn bậc hai để đưa mỗi số hạng về dạng phân số có mẫu là tích hai thừa số.
Bước 2. Tách mỗi số hạng thành hiệu hai phân số bằng công thức trên.
Bước 3. Cộng lại, các số hạng triệt tiêu liên tiếp, chỉ còn số hạng đầu và số hạng cuối.`,
    vd: VD(
      R`##VD
Ví dụ 1: Tính $A=\dfrac1{\sqrt4\cdot\sqrt9}+\dfrac1{\sqrt9\cdot\sqrt{16}}+\dfrac1{\sqrt{16}\cdot\sqrt{25}}+\dots+\dfrac1{\sqrt{2401}\cdot\sqrt{2500}}$.
**Hướng dẫn giải:**
Vì $\sqrt4=2$, $\sqrt9=3$, ..., $\sqrt{2401}=49$, $\sqrt{2500}=50$ nên
$A=\dfrac1{2\cdot3}+\dfrac1{3\cdot4}+\dfrac1{4\cdot5}+\dots+\dfrac1{49\cdot50}$
$A=\left(\dfrac12-\dfrac13\right)+\left(\dfrac13-\dfrac14\right)+\dots+\left(\dfrac1{49}-\dfrac1{50}\right)$
$A=\dfrac12-\dfrac1{50}=\dfrac{24}{50}=\dfrac{12}{25}$.`,
      R`##VD
Ví dụ 2: Tính $B=\dfrac2{\sqrt9\cdot\sqrt{25}}+\dfrac2{\sqrt{25}\cdot\sqrt{49}}+\dfrac2{\sqrt{49}\cdot\sqrt{81}}+\dots+\dfrac2{\sqrt{9409}\cdot\sqrt{9801}}$.
**Hướng dẫn giải:**
Vì $\sqrt9=3$, $\sqrt{25}=5$, ..., $\sqrt{9409}=97$, $\sqrt{9801}=99$ nên
$B=\dfrac2{3\cdot5}+\dfrac2{5\cdot7}+\dfrac2{7\cdot9}+\dots+\dfrac2{97\cdot99}$
$B=\left(\dfrac13-\dfrac15\right)+\left(\dfrac15-\dfrac17\right)+\dots+\left(\dfrac1{97}-\dfrac1{99}\right)$
$B=\dfrac13-\dfrac1{99}=\dfrac{32}{99}$.`,
      R`##VD
Ví dụ 3: Tính $D=\dfrac3{\sqrt4\cdot\sqrt{25}}+\dfrac3{\sqrt{25}\cdot\sqrt{64}}+\dfrac3{\sqrt{64}\cdot\sqrt{121}}$.
**Hướng dẫn giải:**
$D=\dfrac3{2\cdot5}+\dfrac3{5\cdot8}+\dfrac3{8\cdot11}$
$D=\left(\dfrac12-\dfrac15\right)+\left(\dfrac15-\dfrac18\right)+\left(\dfrac18-\dfrac1{11}\right)$
$D=\dfrac12-\dfrac1{11}=\dfrac9{22}$.`),
  },

  // ───────────────────────── So sánh hai luỹ thừa (đưa về cùng cơ số)
  NDB01351: {
    lt: R`##TC
- Cùng cơ số $a>1$: $a^m>a^n\Leftrightarrow m>n$. Cùng cơ số $0<a<1$: $a^m>a^n\Leftrightarrow m<n$.
- Cùng số mũ $n$ dương, hai cơ số dương $a>b>0$: $a^n>b^n$.
- $a^{m\cdot k}=(a^m)^k$.

##PP
Bước 1. Phân tích các cơ số về luỹ thừa của cùng một cơ số nhỏ (ví dụ $8=2^3$, $32=2^5$), rồi đưa về hai luỹ thừa cùng cơ số và so sánh số mũ.
Bước 2. Nếu không đưa được về cùng cơ số: tìm ước chung của hai số mũ, viết hai luỹ thừa thành luỹ thừa cùng số mũ rồi so sánh hai cơ số.
Bước 3. Với cơ số âm, đưa về dạng $-a^n$ rồi đổi chiều bất đẳng thức.`,
    vd: VD(
      R`##VD
Ví dụ 1: So sánh $8^{12}$ và $32^6$.
**Hướng dẫn giải:**
$8^{12}=(2^3)^{12}=2^{36}$
$32^6=(2^5)^6=2^{30}$
Vì $2^{36}>2^{30}$ nên $8^{12}>32^6$.`,
      R`##VD
Ví dụ 2: So sánh $(-16)^{11}$ và $(-32)^9$.
**Hướng dẫn giải:**
$(-16)^{11}=-16^{11}=-(2^4)^{11}=-2^{44}$
$(-32)^9=-32^9=-(2^5)^9=-2^{45}$
Vì $2^{44}<2^{45}$ nên $-2^{44}>-2^{45}$.
Vậy $(-16)^{11}>(-32)^9$.`,
      R`##VD
Ví dụ 3: So sánh $5^{165}$ và $7^{110}$.
**Hướng dẫn giải:**
Ta có $165=3\cdot55$ và $110=2\cdot55$ nên
$5^{165}=(5^3)^{55}=125^{55}$
$7^{110}=(7^2)^{55}=49^{55}$
Vì $125>49$ nên $125^{55}>49^{55}$.
Vậy $5^{165}>7^{110}$.`),
  },

  // ───────────────────────── Toán thực tế Số thực (căn bậc hai)
  NDB01355: {
    mo_ta: 'Các bài toán thực tế có lời văn dùng căn bậc hai số học: từ diện tích hình vuông tính cạnh, chu vi; chia diện tích cho số viên gạch để tìm cạnh viên gạch,...; có thể kèm làm tròn số.',
    lt: R`##TC
- Hình vuông cạnh $a$ có diện tích $S=a^2$, suy ra $a=\sqrt S$; chu vi $P=4a$.
- Căn bậc hai số học của $S$ ($S\ge0$) là số không âm $a$ sao cho $a^2=S$.

##PP
Bước 1. Xác định đại lượng đã cho (diện tích) và đại lượng cần tìm (cạnh, chu vi,...).
Bước 2. Lập biểu thức, dùng căn bậc hai số học để tìm cạnh (nhớ đổi đơn vị cho thống nhất).
Bước 3. Tính đại lượng cần tìm, làm tròn nếu đề yêu cầu, rồi kết luận có kèm đơn vị.`,
    vd: VD(
      R`##VD
Ví dụ 1: Một bàn cờ vua hình vuông có diện tích $25\ \text{dm}^2$. Tính chu vi của bàn cờ.
**Hướng dẫn giải:**
Cạnh của bàn cờ: $\sqrt{25}=5$ (dm).
Chu vi của bàn cờ: $4\cdot5=20$ (dm).`,
      R`##VD
Ví dụ 2: Một mảnh đất hình vuông có diện tích $225\ \text{m}^2$. Người ta muốn rào xung quanh mảnh đất đó. Tính độ dài hàng rào cần dùng.
**Hướng dẫn giải:**
Cạnh của mảnh đất: $\sqrt{225}=15$ (m).
Độ dài hàng rào: $4\cdot15=60$ (m).`,
      R`##VD
Ví dụ 3: Để lát một sân có diện tích $100\ \text{m}^2$, người ta dùng vừa đủ $1600$ viên gạch hình vuông. Tính độ dài cạnh của mỗi viên gạch (theo đơn vị xăng-ti-mét).
**Hướng dẫn giải:**
Diện tích mỗi viên gạch: $100:1600=\dfrac1{16}\ (\text{m}^2)$.
Cạnh của mỗi viên gạch: $\sqrt{\dfrac1{16}}=\dfrac14\ (\text{m})=25\ (\text{cm})$.`),
  },
}

// ───── kiểm số liệu
const gan = (a, b, e = 1e-12) => Math.abs(a - b) < e
const kiem = [
  ['01348 VD1: x=−2010', gan((-2010 + 1) / 2009 + (-2010 + 2) / 2008 + (-2010 + 3) / 2007, -3)],
  ['01348 VD2: x=−100', gan((-100 + 121) / 21 + (-100 + 144) / 22 + (-100 + 169) / 23, 6)],
  ['01348 VD3: x=−60', gan((-60 + 29) / 31 - (-60 + 27) / 33, (-60 + 17) / 43 - (-60 + 15) / 45) && !gan(1 / 31 - 1 / 33, 1 / 43 - 1 / 45, 1e-6)],
  ['01349 VD1: 100−35−25−30=10; 200·35%=70; 25%·360=90', 100 - 35 - 25 - 30 === 10 && 200 * 0.35 === 70 && 0.25 * 360 === 90],
  ['01349 VD2: tổng 138; tăng 5,5,−2,7', 20 + 25 + 30 + 28 + 35 === 138 && [25 - 20, 30 - 25, 28 - 30, 35 - 28].join() === '5,5,-2,7'],
  ['01350 VD1: A=12/25', gan((() => { let s = 0; for (let n = 2; n <= 49; n++) s += 1 / (n * (n + 1)); return s })(), 12 / 25) && 49 ** 2 === 2401 && 50 ** 2 === 2500],
  ['01350 VD2: B=32/99', gan((() => { let s = 0; for (let n = 3; n <= 97; n += 2) s += 2 / (n * (n + 2)); return s })(), 32 / 99) && 97 ** 2 === 9409 && 99 ** 2 === 9801],
  ['01350 VD3: D=9/22', gan(3 / 10 + 3 / 40 + 3 / 88, 9 / 22)],
  ['01351 VD1: 8^12=2^36, 32^6=2^30', 8n ** 12n === 2n ** 36n && 32n ** 6n === 2n ** 30n && 2n ** 36n > 2n ** 30n],
  ['01351 VD2: (−16)^11=−2^44, (−32)^9=−2^45', (-16n) ** 11n === -(2n ** 44n) && (-32n) ** 9n === -(2n ** 45n) && -(2n ** 44n) > -(2n ** 45n)],
  ['01351 VD3: 5^165=125^55 > 49^55=7^110', 5n ** 165n === 125n ** 55n && 7n ** 110n === 49n ** 55n && 125n ** 55n > 49n ** 55n],
  ['01355: √25=5→20; √225=15→60; 100/1600→25cm', Math.sqrt(25) === 5 && 4 * 5 === 20 && Math.sqrt(225) === 15 && 4 * 15 === 60 && gan(Math.sqrt(100 / 1600) * 100, 25)],
]
let hong = 0
for (const [ten, ok] of kiem) if (!ok) { hong++; console.error('✗ SAI:', ten) }
if (hong) { console.error(hong, 'phép kiểm sai ⇒ DỪNG'); process.exit(1) }
console.log('✔', kiem.length, 'phép kiểm số liệu đúng')

const BAN = /(?<![\\a-zA-Z])(dfrac|frac|left|right|cdot|sqrt|ge|le|text|ldots|dots|mathbb|pm|times)\b/
for (const [id, nd] of Object.entries(NOI_DUNG)) {
  for (const [k, v] of Object.entries(nd)) {
    if (typeof v !== 'string') continue
    if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(v)) { console.error('✗ ký tự điều khiển', id, k); process.exit(1) }
    for (const m of v.matchAll(/\$([^$]+)\$/g)) if (BAN.test(m[1])) { console.error('✗ lệnh LaTeX mất \\ ở', id, k, m[1].slice(0, 60)); process.exit(1) }
    if ((v.match(/\$/g) || []).length % 2) { console.error('✗ số dấu $ lẻ', id, k); process.exit(1) }
  }
}
console.log('✔ định dạng LaTeX sạch')

const GHI = process.argv.includes('--ghi')
const c = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? bien('DATABASE_URL')?.gia_tri }); await c.connect()
await c.query('begin')
const dem = { mo_ta: 0, ly_thuyet: 0, vi_du: 0 }
for (const [id, nd] of Object.entries(NOI_DUNG)) {
  for (const [cot, key] of [['mo_ta', 'mo_ta'], ['ly_thuyet', 'lt'], ['vi_du', 'vd']]) {
    const v = nd[key]
    if (!v) continue
    const r = await c.query(`update dai_bdm_dang_bai set ${cot} = $2 where id = $1 and coalesce(length(btrim(${cot})), 0) = 0`, [id, v])
    if (r.rowCount) { dem[cot]++; console.log('  ghi', id, cot) } else console.log('  BỎ QUA (đã có chữ)', id, cot)
  }
}
console.log('tổng:', dem)
if (GHI) { await c.query('commit'); console.log('✔ ĐÃ GHI') } else { await c.query('rollback'); console.log('↩ ROLLBACK (chạy thử)') }
await c.end()
