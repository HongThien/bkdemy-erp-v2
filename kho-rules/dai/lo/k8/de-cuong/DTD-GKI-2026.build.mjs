// ============================================================================
// DTD-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa học kì I Toán 8 (2026–2027) — Trường THCS Đoàn Thị Điểm (Hà Nội)
// (PDF 6 trang, Thùy gửi 13/10: "I. Kiến thức trọng tâm tuần 1–7 · II. Các dạng toán và bài tập", 48 bài) → de.json (khung) + 8 tệp khung.
//
//   node kho-rules/dai/lo/k8/de-cuong/DTD-GKI-2026.build.mjs <thư mục làm việc>   (cần <LV>/goc.pdf + <LV>/img/de_bai31.png, de_bai32.png, de_bai34.png)
//
// KIẾN THỨC (đề ghi): Đại số = Đơn thức · Đa thức · Cộng trừ đa thức · Nhân đa thức · Chia đa thức cho đơn thức (CHỈ Chương I);
// Hình học = Tứ giác · Hình thang cân · Hình bình hành · Hình chữ nhật · Hình thoi và hình vuông.  ⇒ KHÔNG có hằng đẳng thức, phân tích nhân tử.
// Tách ý: chỉ ý có dữ kiện RIÊNG và độc lập; bài cho chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài. Nhãn giữ đúng nhãn đề cương.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/DTD-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const mot = (phan, kho, nhan, nd, o = {}) => [{ phan, kho, nhan, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Nhận biết đơn thức – đa thức' },
  { thu_tu: 2, ten: 'Dạng 2. Thu gọn biểu thức' },
  { thu_tu: 3, ten: 'Dạng 3. Thực hiện phép tính' },
  { thu_tu: 4, ten: 'Dạng 4. Tính giá trị của biểu thức' },
  { thu_tu: 5, ten: 'Dạng 5. Tìm x' },
  { thu_tu: 6, ten: 'Dạng 6. Toán thực tế' },
  { thu_tu: 7, ten: 'Dạng 7. Các dạng khác' },
  { thu_tu: 8, ten: 'B. Hình học' },
]

const CAU = [
  // ── Dạng 1 ──
  ...ca(1, 'dai', 1, R`Trong các biểu thức sau, biểu thức nào là đơn thức, biểu thức nào là đa thức:
a) $-2+x^2y$;  b) $-\dfrac{1}{3}x^3y^2$;  c) $\dfrac{x+y^2}{2x}$;  d) $-\dfrac{3}{4}x^5y(-7x)$.`),
  ...ca(1, 'dai', 2, R`Cho các biểu thức sau: $\dfrac{2}{3}(a^2+b^2)x^3y;\ \dfrac{-3}{4}a^3bxy;\ \dfrac{1}{7}a^3-bxy$.
a) Nếu $a,\ b$ là các hằng số còn $x,\ y$ là các biến thì trong các biểu thức trên, biểu thức nào là đơn thức.
b) Nếu $x,\ y$ là các hằng số còn $a,\ b$ là các biến thì trong các biểu thức trên, biểu thức nào là đơn thức.`),
  ...ca(1, 'dai', 3, R`Hãy sắp xếp các đơn thức sau thành từng nhóm các đơn thức đồng dạng với nhau.
$\dfrac{5}{3}x^2;\ -2x^2;\ 7yz;\ -5yz;\ -7x^2;\ \dfrac{1}{4}yz;\ \sqrt{3}x^2$.`),
  ...tach(1, 'dai', 4, R`Tìm đơn thức không đồng dạng với đơn thức còn lại trong các đơn thức sau:`, [
    ['a', R`$5x^2;\ 3ax^2;\ -2x^2;\ 0{,}5x;\ -7x^2$ với $a$ là hằng số khác 0.`],
    ['b', R`$7yz;\ -5yz;\ 6abyz;\ \dfrac{1}{4}yz;\ \sqrt{3}x^2;\ \sqrt{2}yz$ với $a,\ b$ là hằng số khác 0.`],
    ['c', R`$3x^2yz^2;\ -2x^2y^2x;\ 6x^2yz^2;\ 17\dfrac{1}{4}x^2yz^2;\ 1{,}3x^2yz^2$.`]]),
  ...ca(1, 'dai', 5, R`Trong các biểu thức sau, biểu thức nào là đa thức:
$-\dfrac{1}{3}x^2y+\dfrac{x}{y};\ 2x-y;\ 6xy^2-xy+8;\ (1+\sqrt{2})xy;\ 2\dfrac{1}{4}$.`),

  // ── Dạng 2 ──
  ...tach(2, 'dai', 6, R`Thu gọn các đơn thức sau rồi tìm hệ số, phần biến và bậc của đơn thức thu được với $a,\ b$ là các hằng số khác 0 và không đối nhau; $x,\ y,\ z$ là các biến số.`, [
    ['a', bt(R`A=\left(-\dfrac{1}{3}xy^3z\right)^2\left(-\dfrac{3}{2}x^2y\right)2yz^2`)],
    ['b', bt(R`B=(2x^2)^2(-3y^3)(-5xz)^3`)],
    ['c', bt(R`A=2axy^2(a+b)x^5y^3`)],
    ['d', bt(R`B=\dfrac{2}{3a}xy(-3axyz)(-3{,}5abx^2yz)`)]]),
  ...ca(2, 'dai', 7, R`Tại giá trị nào của $x$ thì đơn thức $A=4x^2y^3$ có giá trị là 128. Biết rằng $y=2$.`),
  ...ca(2, 'dai', 8, R`Cho đơn thức $A=2xy^2\left(\dfrac{1}{2}x^2y^2x\right)$.
a) Thu gọn đơn thức $A$.
b) Tìm bậc của đơn thức thu gọn.
c) Tính giá trị của đơn thức tại $x=1$ và $y=-1$.
d) Chứng minh rằng $A$ luôn nhận giá trị dương với mọi $x\neq 0$ và $y\neq 0$.`),
  ...tach(2, 'dai', 9, R`Thu gọn các đa thức sau:`, [
    ['a', bt(R`2x^2yz+4xy^2z-5x^2yz+xy^2z-xyz`)],
    ['b', bt(R`x^3-5xy+3x^3+xy-x^2+\dfrac{1}{2}xy-x^2`)]]),
  ...ca(2, 'dai', 10, R`Cho đa thức $M=2x^3-3x^2+1-x^3+5x^2-2$.
a) Thu gọn đa thức $M$.
b) Tìm bậc của $M$.
c) Tính giá trị của $M$ tại $x=2$.`),
  ...tach(2, 'dai', 11, R`Tìm bậc mỗi đa thức sau rồi tính giá trị của chúng tại $x=1;\ y=-2$:`, [
    ['a', bt(R`P=4x^2y-xy+y^2-x^2y-3xy+5-3x^2y`)],
    ['b', bt(R`Q=x^3+x^2y+xy^2-x^2y-xy^2-x^3`)]]),
  ...ca(2, 'dai', 12, R`Cho đa thức $A=2xy^2-5xy+12xy-mxy^2$ với $m$ là hằng số. Biết rằng đa thức $A$ có bậc là 3. Hãy tìm $m$.`),

  // ── Dạng 3 ──
  ...ca(3, 'dai', 13, R`Cho các đơn thức sau: $A=x^2y;\ B=-x^2y;\ C=2x^2y$. Tính $A-B-C$.`),
  ...ca(3, 'dai', 14, R`Tìm tổng $A+B$ và hiệu $A-B$ của hai đa thức rồi tìm bậc của chúng biết:
$A=2x^3-4x^2y+1\dfrac{1}{3}xy^2-y^4+1;\quad B=-2x^3-1\dfrac{1}{2}x^2y-y^4-3$.`),
  ...ca(3, 'dai', 15, R`Cho các đa thức $P=2x^4+xy(x^2+y^2)-2ax(x+y)+1$ ($a$ là hằng số), $Q=x^4+xy^3+3x^2-xy+3$.
a) Tính tổng $P+Q$.
b) Tính hiệu $Q-P$.`),
  ...ca(3, 'dai', 16, R`Cho hai đa thức $A=7xyz^2-5xy^2z+3x^2yz-xyz+1;\ B=7x^2yz-5xy^2z+3xyz^2-2$.
a) Tìm đa thức $C$ sao cho $A-C=B$.
b) Tìm đa thức $D$ sao cho $A+D=B$.
c) Tìm đa thức $E$ sao cho $E-A=B$.`),
  ...tach(3, 'dai', 17, R`Thực hiện các phép tính sau:`, [
    ['a', bt(R`3x^2(2x^3-x+5)`)],
    ['b', bt(R`\dfrac{-2}{3}x(-x^4y^2-2x^2-9y^2)`)],
    ['c', bt(R`\left(-2x^2y^3+\dfrac{3}{8}y^4-\dfrac{2}{5}xy\right)\cdot 10xy`)]]),
  ...tach(3, 'dai', 18, R`Thực hiện các phép tính sau:`, [
    ['a', bt(R`(6\cdot 8^4-5\cdot 8^3+8^2):8^2`)],
    ['b', bt(R`(5\cdot 9^2+3^5-2\cdot 3^3):3^2`)],
    ['c', bt(R`(7\cdot 5^5-8\cdot 5^4+125):5^3`)],
    ['d', bt(R`(3\cdot 4^2+8^2+3\cdot 16^2):2^3`)]]),
  ...tach(3, 'dai', 19, R`Xét xem đa thức $A$ có chia hết cho đơn thức $B$ hay không. Thực hiện phép tính trong trường hợp chia hết.`, [
    ['a', R`$A=4x^2y^3-6xy^2+2y^5;\ B=5y^2$.`],
    ['b', R`$A=\dfrac{12}{5}x^6y^3+5{,}1x^4y^7-\dfrac{2}{3}xy^2;\ B=3xy^2$.`],
    ['c', R`$A=2x^3y+3x^2y^2+5xy^2;\ B=y^2$.`]]),
  ...tach(3, 'dai', 20, R`Thực hiện phép tính:`, [
    ['a', bt(R`(x+3)(x^2+3x-5)`)],
    ['b', bt(R`(x^2-1)(x^2+2x)`)],
    ['c', bt(R`(2x-1)(3x+2)(3-x)`)]]),
  ...tach(3, 'dai', 21, R`Thực hiện phép tính:`, [
    ['a', bt(R`A=(8x^4y^2-2x^3y^3+4x^2y^2):2x^2y^2`)],
    ['b', bt(R`B=\left(x^3y^2-\dfrac{1}{2}x^2y^3+\dfrac{2}{3}xy^2\right):\dfrac{3}{4}xy^2`)]]),
  ...tach(3, 'dai', 22, R`Thực hiện phép tính:`, [
    ['a', bt(R`(15x^3y^5-20x^4y^4-5x^5y^2):(-5x^3y^2)`)],
    ['b', bt(R`\left[15(x-y)^5-10(x-y)^4-20(y-x)^3\right]:5(y-x)^3`)]]),

  // ── Dạng 4 ──
  ...mot(4, 'dai', 'Bài 23 (B)', R`Tính giá trị biểu thức $B=(1-2x)^3:(1-2x)^2$ tại $x=501$.`),
  ...mot(4, 'dai', 'Bài 23 (D)', R`Tính giá trị biểu thức $D=(-x-y+z)^3:(-y+z-x)^2$ tại $x=y=3;\ z=1$.`),
  ...tach(4, 'dai', 24, R`Rút gọn rồi tính giá trị các biểu thức sau:`, [
    ['a', R`$A=2x(3x^2+5)-x(3x-x^2)-x^2$ tại $x=2$.`],
    ['b', R`$C=6(x^2-x)-x^2(4x-2)+4x(x^2-2x+3)$ tại $x=-4$.`]]),
  ...tach(4, 'dai', 25, R`Tính giá trị biểu thức:`, [
    ['a', R`$M=(-2x^2y^2+4xy-6xy^3):xy$ tại $x=\dfrac{1}{2};\ y=4$.`],
    ['b', R`$N=\left(\dfrac{1}{3}x^2y^5-\dfrac{2}{3}x^5y^2\right):2x^2y^2$ tại $x=-3;\ y=3$.`]]),
  ...tach(4, 'dai', 26, R`Tính giá trị của mỗi đa thức sau:`, [
    ['a', R`$A=xy+x^2y^2+x^3y^3+x^4y^4+\dots+x^{100}y^{100}$ tại $x=-1;\ y=-1$.`],
    ['b', R`$B=xyz+x^2y^2z^2+x^3y^3z^3+x^4y^4z^4+\dots+x^{100}y^{100}z^{100}$ tại $x=-1;\ y=-1;\ z=-1$.`]]),
  ...tach(4, 'dai', 27, R`Tính giá trị của mỗi đa thức sau biết $x+y-2=0$:`, [
    ['a', bt(R`B=x^3-2x^2-xy^2+2xy+2y+2x-2`)],
    ['b', bt(R`C=x^4+2x^3y-2x^3+x^2y^2-2x^2y-x(x+y)+2x+3`)]]),

  // ── Dạng 5 ──
  ...tach(5, 'dai', 28, R`Tìm $x$, biết:`, [
    ['a', bt(R`2x(6x-1)-3x(4x-1)-3=0`)],
    ['b', bt(R`6x^2-(2x-3)(3x+2)-1=0`)],
    ['c', bt(R`(x-5)(x-4)-(x+1)(x-2)=7`)],
    ['d', bt(R`(x-5)(x-1)=(x-1)(x-2)`)]]),
  ...tach(5, 'dai', 29, R`Tìm $x$, biết:`, [
    ['a', bt(R`-5(x^2-3x+1)+x(1+5x)=x-2`)],
    ['b', bt(R`12x^2-4x(3x+5)=10x-17`)],
    ['c', bt(R`-4x(x-5)+7x(x-4)-3x^2=12`)],
    ['d', bt(R`4x^2-2x+3-4x(x+5)=7x-3`)]]),
  ...tach(5, 'dai', 30, R`Tìm $x$:`, [
    ['a', bt(R`5x(12x+7)-3x(20x-5)=-100`)],
    ['b', bt(R`(x+1)(x+2)(x+5)-x^2(x+8)=27`)],
    ['c', bt(R`(4x+3)(2x-1)-(8x+1)(x+3)+29=0`)]]),

  // ── Dạng 6 ──
  ...ca(6, 'dai', 31, R`Bác Tư có một mảnh đất có dạng như phần được tô màu xanh trong hình bên cùng với các kích thước được ghi trên đó. Hãy tìm đơn thức (thu gọn) với hai biến $x$ và $y$ biểu thị diện tích của mảnh đất đã cho bằng hai cách:
Cách 1: Tính tổng diện tích của hai hình chữ nhật $ABCD$ và $EFGC$.
Cách 2: Lấy diện tích của hình chữ nhật $HFGD$ trừ đi diện tích của hình chữ nhật $HEBA$.`, { anh: ['de_bai31.png'] }),
  ...ca(6, 'dai', 32, R`Bác Hùng muốn trồng hoa trên mảnh vườn hình chữ nhật và hình tam giác có kích thước như hình vẽ dưới đây.
a) Viết đơn thức (hai biến $x,\ y$) biểu thị diện tích trồng hoa mà bác Hùng muốn trồng.
b) Hãy tính số tiền công bác Hùng phải trả biết rằng giá tiền công trồng hoa $1\ \text{m}^2$ là 60 000 đồng và kích thước vườn là $x=4\ \text{m};\ y=2\ \text{m}$.`, { anh: ['de_bai32.png'] }),
  ...ca(6, 'dai', 33, R`Một căn phòng hình lập phương có cạnh $a$ (m).
a) Viết đơn thức biểu thị thể tích của căn phòng.
b) Hỏi không khí chứa trong phòng nặng bao nhiêu ki-lô-gam nếu căn phòng có cạnh $5{,}5\ \text{m}$, biết 1 lít không khí nặng $1{,}2$ gam?`),
  ...ca(6, 'dai', 34, R`Bác An lên kế hoạch canh tác trên mảnh đất có dạng như hình vẽ bên. Kế hoạch canh tác cụ thể của Bác An như sau: trồng rau trên ô đất hình vuông cạnh $x$ (m), trồng khoai trên ô đất hình vuông cạnh $y$ (m) và nuôi gà trên phần đất còn lại hình tam giác vuông có hai cạnh góc vuông bằng $x$ (m) và $y$ (m). Hãy viết biểu thức đại số biểu thị tổng diện tích đất bác An đã sử dụng.`, { anh: ['de_bai34.png'] }),
  ...ca(6, 'dai', 35, R`Có một vòi 1 nước chảy vào một bể chứa nước, mỗi phút vòi chảy được $x$ lít nước. Cùng lúc đó một vòi 2 khác chảy từ bể ra, mỗi phút chảy được $y$ lít nước ($y<x$).
a) Hãy biểu thị số nước có thêm trong bể sau khi mở đồng thời cả hai vòi trong $a$ phút.
b) Giả sử sau $a$ phút người ta khoá vòi 2 và tiếp tục để vòi 1 chảy thêm $b$ phút. Tính lượng nước trong bể, biết rằng lúc đầu bể chứa 5 lít nước.`),
  ...ca(6, 'dai', 36, R`Một bể nước hình lập phương có độ dài cạnh là $a$ (m). Người ta đổ đầy nước vào bể.
a) Viết biểu thức tính thể tích bể nước.
b) Sau đó người ta thả 20 viên gạch hình hộp chữ nhật có kích thước lần lượt là $b$ (dm); $c$ (dm); $d$ (dm) vào bể nước thì thấy một lượng nước tràn ra. Viết biểu thức $A$ biểu thị lượng nước còn lại trong bể.
c) Biểu thức $A$ có là đa thức không? Nếu có thì bậc của $A$ là bao nhiêu?`, { cb: [R`Đề cương in "Người ra đổ đầy nước"; đã sửa thành "Người ta đổ đầy nước".`] }),

  // ── Dạng 7 ──
  ...tach(7, 'dai', 37, R`Chứng minh rằng các biểu thức sau không phụ thuộc vào biến $x,\ y$:`, [
    ['a', bt(R`A=-5x(y^2+2x)-5(1-y^2x)+10x^2`)],
    ['b', bt(R`B=4xy(x^2-3y^2)+6x(x^2+2y^3)-2x^3(3+2y)`)]]),
  ...tach(7, 'dai', 38, R`Chứng minh rằng các biểu thức sau không phụ thuộc vào biến $x;\ y$:`, [
    ['a', bt(R`(xy+3x)(y^2-1)-xy(y-1)(y+1)-3(xy^2-x+4)`)],
    ['b', bt(R`-x^2y(a^2+b^2)+(ax^2+by)(ay+bx^2)-ab(x^4+y^4)`)]]),
  ...ca(7, 'dai', 39, R`Chứng minh rằng biểu thức sau luôn dương với mọi giá trị của biến:
$A=\dfrac{2}{3}x^2y^3:\left(-\dfrac{1}{3}xy\right)+2x(y-1)(y+1)+2(x-2)\ (x,\ y\neq 0)$.`),
  ...tach(7, 'dai', 40, R`Chứng minh rằng:`, [
    ['a', R`$A=n(n+5)-(n-3)(n+2)$ chia hết cho 6 với mọi $n\in\mathbb{Z}$.`],
    ['b', R`$B=(2n+1)(n^2-3n-1)-2n^3+1$ chia hết cho 5 với mọi $n\in\mathbb{Z}$.`],
    ['c', R`$C=\left[(n-1)(n+1)-(n-7)(n-5)\right]$ chia hết cho 12 với mọi $n\in\mathbb{Z}$.`],
    ['d', R`$E=(5a-3)(3b-5)-(3a-5)(5b-3)$ chia hết cho 16 với mọi $a,\ b\in\mathbb{R}$.`, [R`Đề cương in dấu chia hết (⋮) và "$\forall a,\ b\in\mathbb{R}$"; đã nhập thành "chia hết cho 16 với mọi $a,\ b\in\mathbb{R}$". Với số thực "chia hết" nên hiểu là $E=16\cdot k$ với $k$ là một biểu thức đa thức của $a,\ b$.`]]]),

  // ── B. HÌNH HỌC ──
  ...ca(8, 'hinh_hoc', 41, R`Cho tam giác $ABC$ vuông tại $A$, đường trung tuyến $AM$. Dựng điểm $H$ sao cho $AB$ là đường trung trực của $MH$, $E$ là giao điểm của $MH$ và $AB$. Dựng điểm $K$ sao cho $AC$ là đường trung trực của $MK$, $F$ là giao điểm của $MK$ và $AC$. Xác định dạng của tứ giác $AEMF,\ AMBH,\ AMCK$.`),
  ...ca(8, 'hinh_hoc', 42, R`Cho tam giác $ABC$ cân tại $A$. Từ một điểm $D$ trên đáy $BC$, vẽ đường thẳng vuông góc với $BC$ cắt các đường thẳng $AC,\ AB$ lần lượt tại $M$ và $N$. Gọi $H$ và $K$ lần lượt là trung điểm của $BC$ và $MN$. Chứng minh rằng tứ giác $AKDH$ là hình chữ nhật.`,
    { cb: [R`Đề cương không đặt tên điểm trên đáy $BC$ ("Từ một điểm trên đáy $BC$"); theo tứ giác $AKDH$ ở kết luận đã gọi điểm đó là $D$.`] }),
  ...ca(8, 'hinh_hoc', 43, R`Cho tam giác $ABC$, các đường trung tuyến $BD$ và $CE$ cắt nhau ở $G$. Gọi $H$ là trung điểm của $GB$, $K$ là trung điểm của $GC$.
a) Chứng minh rằng tứ giác $DEHK$ là hình bình hành.
b) Tam giác $ABC$ có điều kiện gì thì tứ giác $DEHK$ là hình chữ nhật?`),
  ...ca(8, 'hinh_hoc', 44, R`Cho $\triangle ABC$ vuông tại $A$, $M$ là một điểm thuộc cạnh $BC$. Qua $M$ vẽ các đường thẳng song song với $AB$ và $AC$, chúng cắt các cạnh $AC,\ AB$ theo thứ tự tại $E$ và $F$.
a) Tứ giác $AFME$ là hình gì? Vì sao?
b) Xác định vị trí điểm $M$ trên cạnh $BC$ để tứ giác $AFME$ là hình vuông.`),
  ...ca(8, 'hinh_hoc', 45, R`Cho tam giác $ABC$ vuông ở $A$. Gọi $E,\ G,\ F$ lần lượt là trung điểm của $AB,\ BC,\ AC$. Từ $E$ kẻ đường thẳng song song với $BF$, đường thẳng này cắt $GF$ tại $I$.
a) Tứ giác $AEGF$ là hình gì? Vì sao?
b) Chứng minh tứ giác $BEIF$ là hình bình hành.
c) Chứng minh tứ giác $AGCI$ là hình thoi.`),
  ...ca(8, 'hinh_hoc', 46, R`Cho hình chữ nhật $ABCD$ có $AB=2BC$. Gọi $I$ là trung điểm của $AB$ và $K$ là trung điểm của $DC$.
a) Chứng minh $AIKD$ và $BIKC$ là hình vuông.
b) Chứng minh $\triangle DIC$ vuông cân.
c) Gọi $S$ và $R$ lần lượt là tâm các hình vuông $AIKD,\ BIKC$. Chứng minh $ISKR$ là hình vuông.`),
  ...ca(8, 'hinh_hoc', 47, R`Cho tam giác $ABC$ vuông tại $A$ có $BC=2AB$. Tính góc $\widehat{ACB}$.`),
  ...ca(8, 'hinh_hoc', 48, R`Một thửa ruộng hình thang cân có đáy bé 26 m, đáy lớn hơn đáy bé 8 m, đáy bé lớn hơn chiều cao 6 m, cạnh bên bằng nửa tổng hai đáy. Biết trung bình cứ $100\ \text{m}^2$ thu hoạch được 70 kg thóc, đến gần vụ thu hoạch để đuổi chim chóc đến ăn lúa họ tính cứ 20 m đặt một con bù nhìn quanh ruộng. Hỏi:
a) Số con bù nhìn cần có?
b) Tổng số ki-lô-gam thóc thu hoạch được trên thửa ruộng đó?`),
]

dung({
  MA: 'DTD-GKI-2026',
  TEN: 'Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội',
  NGUON: 'Trường THCS Đoàn Thị Điểm',
  FILE: 'De-cuong-giua-ki-1-Toan-8-Doan-Thi-Diem-2026.pdf',
  PHAN, CAU, LV, HERE,
  NHOM: [[1, 12], [13, 19], [20, 25], [26, 30], [31, 36], [37, 40], [41, 43], [44, 48]],
})
