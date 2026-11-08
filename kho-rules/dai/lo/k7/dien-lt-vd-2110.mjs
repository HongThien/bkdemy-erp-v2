// K7 — điền mô tả / lý thuyết / ví dụ cho các dạng bài Thùy vừa thêm (21/10, "M full mô tả lý thuyết ví dụ").
// Luật: CHỈ điền ô đang TRỐNG (không đè chữ của Thùy). Chạy thử = ROLLBACK; thêm --ghi để ghi thật.
//   node kho-rules/dai/lo/k7/dien-lt-vd-2110.mjs [--ghi]
import pg from 'pg'
import { bien } from '../../../../scripts/kho/cau-hinh.mjs'

const R = String.raw
const VD = (...ds) => ds.join('\n\n')

const NOI_DUNG = {
  // ───────────────────────── Số thực: Nhận biết Số thực, GTTĐ
  NDB01036: {
    lt: R`##ĐN
Tập hợp số thực $\mathbb{R}$ gồm các số hữu tỉ và các số vô tỉ. Số hữu tỉ viết được dưới dạng số thập phân hữu hạn hoặc vô hạn tuần hoàn; số vô tỉ là số thập phân vô hạn không tuần hoàn.

##TC
- Quan hệ giữa các tập hợp số: $\mathbb{N}\subset\mathbb{Z}\subset\mathbb{Q}\subset\mathbb{R}$; số vô tỉ thuộc $\mathbb{R}$ nhưng không thuộc $\mathbb{Q}$.
- Giá trị tuyệt đối: $|a|=a$ nếu $a\ge 0$; $|a|=-a$ nếu $a<0$.
- Do đó $|a|\ge 0$; $|a|=|-a|$; $|a|=0\Leftrightarrow a=0$.
- Trên trục số, $|a|$ là khoảng cách từ điểm $a$ đến gốc $O$.`,
    vd: VD(
      R`##VD
Ví dụ 1: Điền kí hiệu $\in,\notin$ vào chỗ trống: a) $-5\ \ldots\ \mathbb{N}$; b) $\sqrt{2}\ \ldots\ \mathbb{Q}$; c) $\sqrt{16}\ \ldots\ \mathbb{Z}$; d) $0{,}(3)\ \ldots\ \mathbb{R}$.
**Hướng dẫn giải:**
a) $-5\notin\mathbb{N}$ (vì $-5$ là số âm).
b) $\sqrt{2}\notin\mathbb{Q}$ (vì $\sqrt{2}$ là số vô tỉ).
c) $\sqrt{16}=4\in\mathbb{Z}$.
d) $0{,}(3)\in\mathbb{R}$ (mọi số thập phân đều là số thực).`,
      R`##VD
Ví dụ 2: Trong các số $-3;\ \dfrac{2}{5};\ \sqrt{3};\ 0;\ \pi;\ 1{,}25$, số nào là số vô tỉ, số nào là số hữu tỉ?
**Hướng dẫn giải:**
Các số vô tỉ: $\sqrt{3};\ \pi$.
Các số hữu tỉ: $-3;\ \dfrac{2}{5};\ 0;\ 1{,}25$.`,
      R`##VD
Ví dụ 3: Tính $|-7|$; $|3{,}5|$; $|0|$; $|2-\sqrt{5}|$.
**Hướng dẫn giải:**
$|-7|=7$; $|3{,}5|=3{,}5$; $|0|=0$.
Vì $\sqrt{5}>2$ nên $2-\sqrt{5}<0$, suy ra $|2-\sqrt{5}|=\sqrt{5}-2$.`),
  },

  // ───────────────────────── Luỹ thừa SHT: Tính chất (chỉ thiếu VD)
  NDB01234: {
    vd: VD(
      R`##VD
Ví dụ 1: Viết các biểu thức sau dưới dạng một luỹ thừa: a) $\left(-\dfrac12\right)^3\cdot\left(-\dfrac12\right)^4$; b) $\left(\dfrac35\right)^8:\left(\dfrac35\right)^5$; c) $\left[\left(\dfrac23\right)^2\right]^3$.
**Hướng dẫn giải:**
a) $\left(-\dfrac12\right)^3\cdot\left(-\dfrac12\right)^4=\left(-\dfrac12\right)^{3+4}=\left(-\dfrac12\right)^7$.
b) $\left(\dfrac35\right)^8:\left(\dfrac35\right)^5=\left(\dfrac35\right)^{8-5}=\left(\dfrac35\right)^3$.
c) $\left[\left(\dfrac23\right)^2\right]^3=\left(\dfrac23\right)^{2\cdot3}=\left(\dfrac23\right)^6$.`,
      R`##VD
Ví dụ 2: Khẳng định nào sau đây đúng?
A. $\left(\dfrac34\right)^0=0$.
B. $\left(-\dfrac12\right)^2=-\dfrac14$.
C. $\left(-\dfrac23\right)^3=-\dfrac{8}{27}$.
D. $\left(\dfrac12\right)^1=1$.
**Hướng dẫn giải:**
A sai vì $\left(\dfrac34\right)^0=1$. B sai vì $\left(-\dfrac12\right)^2=\dfrac14$. D sai vì $\left(\dfrac12\right)^1=\dfrac12$.
C đúng vì $\left(-\dfrac23\right)^3=\dfrac{(-2)^3}{3^3}=-\dfrac{8}{27}$.
Đáp án: C.`,
      R`##VD
Ví dụ 3: Tính nhanh $\left(-\dfrac37\right)^5\cdot\left(-\dfrac73\right)^5$.
**Hướng dẫn giải:**
$\left(-\dfrac37\right)^5\cdot\left(-\dfrac73\right)^5=\left[\left(-\dfrac37\right)\cdot\left(-\dfrac73\right)\right]^5=1^5=1$.`),
  },

  // ───────────────────────── Tìm x: x ở số mũ
  NDB01235: {
    lt: R`##TC
- Với $a\ne 0,\ a\ne \pm1$: nếu $a^m=a^n$ thì $m=n$.
- $a^m\cdot a^n=a^{m+n}$; $a^m:a^n=a^{m-n}$; $(a^m)^n=a^{m\cdot n}$.

##PP
Bước 1. Đưa hai vế về luỹ thừa có cùng cơ số (đặt luỹ thừa chung ra ngoài nếu vế có tổng hoặc hiệu).
Bước 2. Cho hai số mũ bằng nhau rồi giải tìm $x$.
Bước 3. Kết luận.`,
    vd: VD(
      R`##VD
Ví dụ 1: Tìm $x$ biết: $2^x=32$.
**Hướng dẫn giải:**
$2^x=32$
$2^x=2^5$
$x=5$.
Vậy $x=5$.`,
      R`##VD
Ví dụ 2: Tìm $x$ biết: $\left(\dfrac34\right)^{x+1}=\dfrac{27}{64}$.
**Hướng dẫn giải:**
$\left(\dfrac34\right)^{x+1}=\dfrac{27}{64}$
$\left(\dfrac34\right)^{x+1}=\left(\dfrac34\right)^3$
$x+1=3$
$x=2$.
Vậy $x=2$.`,
      R`##VD
Ví dụ 3: Tìm $x$ biết: $3^{x+2}-3^x=72$.
**Hướng dẫn giải:**
$3^{x+2}-3^x=72$
$3^x\cdot 3^2-3^x=72$
$3^x\cdot(9-1)=72$
$3^x\cdot 8=72$
$3^x=9=3^2$
$x=2$.
Vậy $x=2$.`),
  },

  // ───────────────────────── Tìm x chứa luỹ thừa số
  NDB01336: {
    lt: R`##PP
Bước 1. Tính các luỹ thừa của số hữu tỉ không chứa $x$.
Bước 2. Đưa về bài tìm $x$ cơ bản (cộng, trừ, nhân, chia với $x$; chuyển vế nếu cần).
Bước 3. Giải rồi kết luận.

##CY
Chú ý dấu: $(-a)^n$ dương khi $n$ chẵn, âm khi $n$ lẻ; $-a^n$ khác $(-a)^n$.`,
    vd: VD(
      R`##VD
Ví dụ 1: Tìm $x$ biết: $x+\left(\dfrac12\right)^2=\dfrac34$.
**Hướng dẫn giải:**
$x+\dfrac14=\dfrac34$
$x=\dfrac34-\dfrac14$
$x=\dfrac12$.
Vậy $x=\dfrac12$.`,
      R`##VD
Ví dụ 2: Tìm $x$ biết: $2x-\left(-\dfrac13\right)^3=\dfrac{7}{27}$.
**Hướng dẫn giải:**
$2x-\left(-\dfrac{1}{27}\right)=\dfrac{7}{27}$
$2x+\dfrac{1}{27}=\dfrac{7}{27}$
$2x=\dfrac{6}{27}=\dfrac29$
$x=\dfrac19$.
Vậy $x=\dfrac19$.`,
      R`##VD
Ví dụ 3: Tìm $x$ biết: $\left(\dfrac23\right)^2:x-\dfrac13=\dfrac19$.
**Hướng dẫn giải:**
$\dfrac49:x-\dfrac13=\dfrac19$
$\dfrac49:x=\dfrac19+\dfrac13=\dfrac49$
$x=\dfrac49:\dfrac49=1$.
Vậy $x=1$.`),
  },

  // ───────────────────────── Tìm x chứa căn của số (đã có LT, thiếu VD)
  NDB01337: {
    vd: VD(
      R`##VD
Ví dụ 1: Tìm $x$ biết: $x+\sqrt{16}=9$.
**Hướng dẫn giải:**
$x+4=9$
$x=9-4=5$.
Vậy $x=5$.`,
      R`##VD
Ví dụ 2: Tìm $x$ biết: $3x-\sqrt{\dfrac94}=\dfrac32$.
**Hướng dẫn giải:**
$3x-\dfrac32=\dfrac32$
$3x=\dfrac32+\dfrac32=3$
$x=1$.
Vậy $x=1$.`,
      R`##VD
Ví dụ 3: Tìm $x$ biết: $\dfrac12x+\sqrt{0{,}25}=\sqrt{49}-3$.
**Hướng dẫn giải:**
$\dfrac12x+0{,}5=7-3$
$\dfrac12x=4-0{,}5=3{,}5$
$x=3{,}5:\dfrac12=7$.
Vậy $x=7$.`),
  },

  // ───────────────────────── SHT: nâng cao khác
  NDB01339: {
    lt: R`##PP
Các bài nâng cao của số hữu tỉ (thường là câu cuối đề) hay dùng những kĩ thuật sau:
- Đặt thừa số chung (luỹ thừa cùng cơ số) để chứng minh một biểu thức chia hết cho một số.
- Đưa về dạng tích $A\cdot B=k$ ($k$ nguyên) rồi xét các ước của $k$ để tìm số nguyên $x,\ y$.
- Từ điều kiện của đề suy ra giá trị cần tìm (ví dụ $b^2=1\Rightarrow b=\pm1$).

##CY
Luôn thử lại nghiệm vừa tìm và kiểm tra điều kiện của đề (số nguyên, mẫu khác $0$, $n\in\mathbb{N}^*$, ...).`,
    vd: VD(
      R`##VD
Ví dụ 1: Chứng minh rằng với mọi $n\in\mathbb{N}^*$ thì $3^{n+2}-2^{n+2}+3^n-2^n$ chia hết cho $10$.
**Hướng dẫn giải:**
$3^{n+2}-2^{n+2}+3^n-2^n=3^n(3^2+1)-2^n(2^2+1)=10\cdot3^n-5\cdot2^n$.
Vì $n\ge1$ nên $5\cdot2^n=5\cdot2\cdot2^{n-1}=10\cdot2^{n-1}$.
Do đó biểu thức bằng $10\cdot3^n-10\cdot2^{n-1}=10\cdot(3^n-2^{n-1})$ chia hết cho $10$.`,
      R`##VD
Ví dụ 2: Tìm các số nguyên $x,\ y$ biết $\dfrac{x}{6}-\dfrac1y=\dfrac12$.
**Hướng dẫn giải:**
$\dfrac{x}{6}-\dfrac12=\dfrac1y$
$\dfrac{x-3}{6}=\dfrac1y$
$y\cdot(x-3)=6$ ($y\ne0$).
Do $x,\ y$ nguyên nên $x-3$ và $y$ là các ước của $6$ có tích bằng $6$:
$(x-3;\ y)\in\{(1;6);\ (2;3);\ (3;2);\ (6;1);\ (-1;-6);\ (-2;-3);\ (-3;-2);\ (-6;-1)\}$.
Suy ra $(x;\ y)\in\{(4;6);\ (5;3);\ (6;2);\ (9;1);\ (2;-6);\ (1;-3);\ (0;-2);\ (-3;-1)\}$.`,
      R`##VD
Ví dụ 3: Tìm hai số hữu tỉ $a,\ b$ ($b\ne0$) biết $a+b=a\cdot b=a:b$.
**Hướng dẫn giải:**
Từ $a\cdot b=a:b$ suy ra $a\cdot b^2=a$, tức $a(b^2-1)=0$.
Nếu $a=0$ thì $a+b=b$ và $a\cdot b=0$ nên $b=0$ (trái với $b\ne0$). Vậy $a\ne0$, suy ra $b^2=1$, $b=\pm1$.
Nếu $b=1$: $a+1=a$ (vô lí).
Nếu $b=-1$: $a-1=-a$, suy ra $a=\dfrac12$.
Thử lại: $a+b=-\dfrac12$; $a\cdot b=-\dfrac12$; $a:b=-\dfrac12$.
Vậy $a=\dfrac12,\ b=-1$.`),
  },

  // ───────────────────────── Số thực: nâng cao khác
  NDB01340: {
    lt: R`##PP
Các bài nâng cao có số thập phân vô hạn tuần hoàn, căn bậc hai, giá trị tuyệt đối thường dùng:
- $0{,}(a)=\dfrac{a}{9}$; $0{,}(ab)=\dfrac{\overline{ab}}{99}$; $0{,}(abc)=\dfrac{\overline{abc}}{999}$.
- $\sqrt{a^2}=|a|$ với mọi số thực $a$.
- Bỏ dấu giá trị tuyệt đối bằng cách xét dấu của biểu thức bên trong.

##CY
Khi so sánh với một số vô tỉ, đưa về so sánh hai số không âm bằng cách so sánh bình phương của chúng.`,
    vd: VD(
      R`##VD
Ví dụ 1: Chứng tỏ rằng $0{,}(9)=1$.
**Hướng dẫn giải:**
$0{,}(9)=9\cdot0{,}(1)=9\cdot\dfrac19=1$.
Vậy $0{,}(9)=1$.`,
      R`##VD
Ví dụ 2: Tính $\sqrt{(1-\sqrt2)^2}+\sqrt{(\sqrt2-3)^2}$.
**Hướng dẫn giải:**
$\sqrt{(1-\sqrt2)^2}+\sqrt{(\sqrt2-3)^2}=|1-\sqrt2|+|\sqrt2-3|$.
Vì $\sqrt2>1$ nên $|1-\sqrt2|=\sqrt2-1$; vì $\sqrt2<3$ nên $|\sqrt2-3|=3-\sqrt2$.
Do đó biểu thức bằng $(\sqrt2-1)+(3-\sqrt2)=2$.`,
      R`##VD
Ví dụ 3: Viết tổng $A=0{,}(12)+0{,}(21)$ dưới dạng phân số tối giản.
**Hướng dẫn giải:**
$A=\dfrac{12}{99}+\dfrac{21}{99}=\dfrac{33}{99}=\dfrac13$.`),
  },

  // ───────────────────────── Dãy bình phương liên tiếp
  NDB01341: {
    mo_ta: null,
    lt: R`##TC
- Với số tự nhiên $k\ge2$: $\dfrac1{k^2}<\dfrac1{(k-1)k}=\dfrac1{k-1}-\dfrac1k$.
- Với số tự nhiên $k\ge1$: $\dfrac1{k^2}>\dfrac1{k(k+1)}=\dfrac1k-\dfrac1{k+1}$.

##PP
Bước 1. Làm trội (hoặc làm giảm) từng số hạng $\dfrac1{k^2}$ thành hiệu của hai phân số.
Bước 2. Cộng lại: các số hạng triệt tiêu liên tiếp, chỉ còn số hạng đầu và số hạng cuối.
Bước 3. So sánh kết quả với số cần chứng minh.`,
    vd: VD(
      R`##VD
Ví dụ 1: Chứng minh rằng $A=\dfrac1{2^2}+\dfrac1{3^2}+\dfrac1{4^2}+\dots+\dfrac1{50^2}<1$.
**Hướng dẫn giải:**
$A<\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\dfrac1{3\cdot4}+\dots+\dfrac1{49\cdot50}$
$A<\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\dots+\left(\dfrac1{49}-\dfrac1{50}\right)=1-\dfrac1{50}<1$.
Vậy $A<1$.`,
      R`##VD
Ví dụ 2: Chứng minh rằng $B=\dfrac1{5^2}+\dfrac1{6^2}+\dfrac1{7^2}+\dots+\dfrac1{100^2}<\dfrac14$.
**Hướng dẫn giải:**
$B<\dfrac1{4\cdot5}+\dfrac1{5\cdot6}+\dots+\dfrac1{99\cdot100}$
$B<\left(\dfrac14-\dfrac15\right)+\left(\dfrac15-\dfrac16\right)+\dots+\left(\dfrac1{99}-\dfrac1{100}\right)=\dfrac14-\dfrac1{100}<\dfrac14$.
Vậy $B<\dfrac14$.`,
      R`##VD
Ví dụ 3: Cho $C=\dfrac1{2^2}+\dfrac1{3^2}+\dots+\dfrac1{n^2}$ ($n\in\mathbb{N},\ n\ge2$). Chứng minh rằng $\dfrac12-\dfrac1{n+1}<C<1-\dfrac1n$.
**Hướng dẫn giải:**
Vì $\dfrac1{k^2}<\dfrac1{(k-1)k}$ nên $C<\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\dots+\dfrac1{(n-1)n}=1-\dfrac1n$.
Vì $\dfrac1{k^2}>\dfrac1{k(k+1)}$ nên $C>\dfrac1{2\cdot3}+\dfrac1{3\cdot4}+\dots+\dfrac1{n(n+1)}=\dfrac12-\dfrac1{n+1}$.
Vậy $\dfrac12-\dfrac1{n+1}<C<1-\dfrac1n$.`),
  },

  // ───────────────────────── Dãy bình phương cách số
  NDB01342: {
    mo_ta: 'Mẫu là các bình phương của những số cách đều nhau (thường cách 2): 3², 5², 7²,... hoặc 4², 6², 8²,...; thường yêu cầu chứng minh biểu thức bé hơn một hằng số.',
    lt: R`##TC
- Với số tự nhiên $k\ge1$: $\dfrac1{(2k+1)^2}<\dfrac1{2k(2k+2)}=\dfrac14\left(\dfrac1k-\dfrac1{k+1}\right)$.
- Với số tự nhiên $k\ge2$: $\dfrac1{(2k)^2}=\dfrac14\cdot\dfrac1{k^2}<\dfrac14\cdot\dfrac1{(k-1)k}=\dfrac14\left(\dfrac1{k-1}-\dfrac1k\right)$.

##PP
Bước 1. Làm trội từng số hạng: thay bình phương ở mẫu bằng tích hai số liền kề nhau cách đúng một khoảng bằng khoảng cách giữa các cơ số.
Bước 2. Đặt thừa số chung (như $\dfrac14$), các số hạng còn lại triệt tiêu liên tiếp.
Bước 3. So sánh kết quả với số cần chứng minh.`,
    vd: VD(
      R`##VD
Ví dụ 1: Chứng minh rằng $A=\dfrac1{3^2}+\dfrac1{5^2}+\dfrac1{7^2}+\dots+\dfrac1{2025^2}<\dfrac14$.
**Hướng dẫn giải:**
$A<\dfrac1{2\cdot4}+\dfrac1{4\cdot6}+\dfrac1{6\cdot8}+\dots+\dfrac1{2024\cdot2026}$
$A<\dfrac14\left(\dfrac11-\dfrac12+\dfrac12-\dfrac13+\dots+\dfrac1{1012}-\dfrac1{1013}\right)=\dfrac14\left(1-\dfrac1{1013}\right)<\dfrac14$.
Vậy $A<\dfrac14$.`,
      R`##VD
Ví dụ 2: Chứng minh rằng $B=\dfrac1{4^2}+\dfrac1{6^2}+\dfrac1{8^2}+\dots+\dfrac1{(2n)^2}<\dfrac14$ ($n\in\mathbb{N},\ n\ge2$).
**Hướng dẫn giải:**
$B=\dfrac14\left(\dfrac1{2^2}+\dfrac1{3^2}+\dots+\dfrac1{n^2}\right)$
$B<\dfrac14\left(\dfrac1{1\cdot2}+\dfrac1{2\cdot3}+\dots+\dfrac1{(n-1)n}\right)=\dfrac14\left(1-\dfrac1n\right)<\dfrac14$.
Vậy $B<\dfrac14$.`,
      R`##VD
Ví dụ 3: Chứng minh rằng $C=\dfrac2{3^2}+\dfrac2{5^2}+\dfrac2{7^2}+\dots+\dfrac2{2025^2}<\dfrac{506}{1013}$.
**Hướng dẫn giải:**
$C<\dfrac2{2\cdot4}+\dfrac2{4\cdot6}+\dots+\dfrac2{2024\cdot2026}=\dfrac12\left(\dfrac11-\dfrac12+\dfrac12-\dfrac13+\dots+\dfrac1{1012}-\dfrac1{1013}\right)$
$C<\dfrac12\left(1-\dfrac1{1013}\right)=\dfrac12\cdot\dfrac{1012}{1013}=\dfrac{506}{1013}$.
Vậy $C<\dfrac{506}{1013}$.`),
  },

  // ───────────────────────── Dãy lập phương
  NDB01343: {
    mo_ta: 'Mẫu là các lập phương của những số tự nhiên liên tiếp: 2³, 3³, 4³,...; thường yêu cầu chứng minh biểu thức bé hơn một hằng số.',
    lt: R`##TC
Với số tự nhiên $k\ge2$:
$$\dfrac1{k^3}<\dfrac1{(k-1)k(k+1)}=\dfrac12\left[\dfrac1{(k-1)k}-\dfrac1{k(k+1)}\right].$$

##PP
Bước 1. Làm trội từng số hạng $\dfrac1{k^3}$ bằng $\dfrac1{(k-1)k(k+1)}$ rồi tách thành hiệu hai phân số.
Bước 2. Cộng lại, các số hạng triệt tiêu liên tiếp, chỉ còn số hạng đầu và số hạng cuối.
Bước 3. So sánh kết quả với số cần chứng minh.`,
    vd: VD(
      R`##VD
Ví dụ 1: Chứng minh rằng $A=\dfrac1{2^3}+\dfrac1{3^3}+\dfrac1{4^3}+\dots+\dfrac1{100^3}<\dfrac14$.
**Hướng dẫn giải:**
$A<\dfrac1{1\cdot2\cdot3}+\dfrac1{2\cdot3\cdot4}+\dots+\dfrac1{99\cdot100\cdot101}$
$A<\dfrac12\left[\dfrac1{1\cdot2}-\dfrac1{2\cdot3}+\dfrac1{2\cdot3}-\dfrac1{3\cdot4}+\dots+\dfrac1{99\cdot100}-\dfrac1{100\cdot101}\right]$
$A<\dfrac12\left(\dfrac12-\dfrac1{10100}\right)<\dfrac14$.
Vậy $A<\dfrac14$.`,
      R`##VD
Ví dụ 2: Chứng minh rằng $B=\dfrac1{3^3}+\dfrac1{4^3}+\dots+\dfrac1{n^3}<\dfrac1{12}$ ($n\in\mathbb{N},\ n\ge3$).
**Hướng dẫn giải:**
$B<\dfrac1{2\cdot3\cdot4}+\dfrac1{3\cdot4\cdot5}+\dots+\dfrac1{(n-1)n(n+1)}$
$B<\dfrac12\left[\dfrac1{2\cdot3}-\dfrac1{n(n+1)}\right]<\dfrac12\cdot\dfrac16=\dfrac1{12}$.
Vậy $B<\dfrac1{12}$.`,
      R`##VD
Ví dụ 3: Chứng minh rằng $C=1+\dfrac1{2^3}+\dfrac1{3^3}+\dots+\dfrac1{2025^3}<\dfrac54$.
**Hướng dẫn giải:**
Theo kết quả của Ví dụ 1, tương tự ta có $\dfrac1{2^3}+\dfrac1{3^3}+\dots+\dfrac1{2025^3}<\dfrac12\cdot\dfrac12=\dfrac14$.
Suy ra $C<1+\dfrac14=\dfrac54$.`),
  },

  // ───────────────────────── Tìm x để phân thức đạt giá trị nguyên
  NDB01344: {
    mo_ta: 'Tìm x (hoặc n) nguyên để phân thức A = (ax+b)/(cx+d) nhận giá trị nguyên (hoặc nguyên dương, nguyên âm, nguyên lớn nhất,...). Phương pháp: tách phần nguyên của phân thức rồi dùng ước của số còn lại.',
    lt: R`##TC
- Với $a,\ b$ là số nguyên, $b\ne0$: $\dfrac ab$ là số nguyên khi và chỉ khi $b$ là ước của $a$.
- Ước của một số nguyên gồm cả ước dương và ước âm. Ví dụ: $\text{Ư}(6)=\{\pm1;\ \pm2;\ \pm3;\ \pm6\}$.

##PP
Bước 1. Tách $A=\dfrac{ax+b}{cx+d}=k+\dfrac{m}{cx+d}$ với $k,\ m$ là số nguyên (nếu hệ số của $x$ ở tử chưa chia hết cho hệ số ở mẫu thì nhân $A$ với hệ số thích hợp để hai hệ số bằng nhau).
Bước 2. $A$ nguyên khi và chỉ khi $cx+d$ là ước của $m$.
Bước 3. Lập bảng các giá trị của $cx+d$ để tìm $x$; kiểm tra $x$ nguyên, mẫu khác $0$ và các điều kiện thêm của đề (nguyên dương, nguyên âm,...).
Bước 4. Kết luận.`,
    vd: VD(
      R`##VD
Ví dụ 1: Tìm số nguyên $x$ để $A=\dfrac{x-5}{x}$ có giá trị nguyên.
**Hướng dẫn giải:**
Điều kiện: $x\ne0$.
$A=\dfrac{x-5}{x}=1-\dfrac5x$.
$A$ nguyên khi $\dfrac5x$ nguyên, tức $x\in\text{Ư}(5)=\{-5;\ -1;\ 1;\ 5\}$.
Các giá trị này đều thoả mãn điều kiện. Vậy $x\in\{-5;\ -1;\ 1;\ 5\}$.`,
      R`##VD
Ví dụ 2: Tìm số nguyên $x$ để $C=\dfrac{2x-7}{x+1}$ có giá trị nguyên.
**Hướng dẫn giải:**
Điều kiện: $x\ne-1$.
$C=\dfrac{2(x+1)-9}{x+1}=2-\dfrac9{x+1}$.
$C$ nguyên khi $x+1\in\text{Ư}(9)=\{-9;\ -3;\ -1;\ 1;\ 3;\ 9\}$.
Với $x+1=-9;\ -3;\ -1;\ 1;\ 3;\ 9$ thì $x=-10;\ -4;\ -2;\ 0;\ 2;\ 8$.
Vậy $x\in\{-10;\ -4;\ -2;\ 0;\ 2;\ 8\}$.`,
      R`##VD
Ví dụ 3: Tìm số nguyên $n$ để $\dfrac{n+3}{n-2}$ là số nguyên âm.
**Hướng dẫn giải:**
Điều kiện: $n\ne2$.
$\dfrac{n+3}{n-2}=1+\dfrac5{n-2}$ nguyên khi $n-2\in\{-5;\ -1;\ 1;\ 5\}$, tức $n\in\{-3;\ 1;\ 3;\ 7\}$.
Với $n=-3$: giá trị bằng $0$ (loại). Với $n=1$: giá trị bằng $-4$ (nhận). Với $n=3$: giá trị bằng $6$ (loại). Với $n=7$: giá trị bằng $2$ (loại).
Vậy $n=1$.`),
  },

  // ───────────────────────── Dãy tổng của tích các số liên tiếp
  NDB01345: {
    lt: R`##TC
- $k(k+1)=\dfrac13\left[k(k+1)(k+2)-(k-1)k(k+1)\right]$.
- $k(k+1)(k+2)=\dfrac14\left[k(k+1)(k+2)(k+3)-(k-1)k(k+1)(k+2)\right]$.
- $1\cdot2+2\cdot3+\dots+n(n+1)=\dfrac{n(n+1)(n+2)}3$.
- $1\cdot2\cdot3+2\cdot3\cdot4+\dots+n(n+1)(n+2)=\dfrac{n(n+1)(n+2)(n+3)}4$.

##PP
Bước 1. Nhân cả tổng với $3$ (tích hai số liên tiếp) hoặc với $4$ (tích ba số liên tiếp).
Bước 2. Viết thừa số $3$ (hoặc $4$) thành hiệu hai thừa số để mỗi số hạng tách thành hiệu hai tích liên tiếp.
Bước 3. Các số hạng triệt tiêu liên tiếp, chỉ còn số hạng cuối (và số hạng đầu nếu có).`,
    vd: VD(
      R`##VD
Ví dụ 1: Tính $A=1\cdot2+2\cdot3+3\cdot4+\dots+99\cdot100$.
**Hướng dẫn giải:**
$3A=1\cdot2\cdot3+2\cdot3\cdot(4-1)+3\cdot4\cdot(5-2)+\dots+99\cdot100\cdot(101-98)$
$3A=1\cdot2\cdot3+(2\cdot3\cdot4-1\cdot2\cdot3)+(3\cdot4\cdot5-2\cdot3\cdot4)+\dots+(99\cdot100\cdot101-98\cdot99\cdot100)$
$3A=99\cdot100\cdot101$
$A=\dfrac{99\cdot100\cdot101}3=333\,300$.`,
      R`##VD
Ví dụ 2: Tính $B=1\cdot2\cdot3+2\cdot3\cdot4+3\cdot4\cdot5+\dots+98\cdot99\cdot100$.
**Hướng dẫn giải:**
$4B=1\cdot2\cdot3\cdot4+2\cdot3\cdot4\cdot(5-1)+\dots+98\cdot99\cdot100\cdot(101-97)$
$4B=98\cdot99\cdot100\cdot101$ (các số hạng triệt tiêu liên tiếp)
$B=\dfrac{98\cdot99\cdot100\cdot101}4=24\,497\,550$.`,
      R`##VD
Ví dụ 3: Tính $D=2\cdot3+3\cdot4+4\cdot5+\dots+49\cdot50$.
**Hướng dẫn giải:**
Đặt $S=1\cdot2+2\cdot3+3\cdot4+\dots+49\cdot50=\dfrac{49\cdot50\cdot51}3=41\,650$ (như Ví dụ 1).
Suy ra $D=S-1\cdot2=41\,650-2=41\,648$.`),
  },

  // ───────────────────────── So sánh: tử và mẫu cùng số mũ
  NDB01346: {
    lt: R`##TC
Với $a>1$ và $p,\ q$ là các số nguyên: $\dfrac{a^n+p}{a^n+q}=1+\dfrac{p-q}{a^n+q}$.
Hai phân số cùng tử dương: phân số nào có mẫu lớn hơn thì bé hơn.

##PP
Bước 1. Tách mỗi biểu thức thành $1$ cộng (hoặc trừ) một phân số "phần dư".
Bước 2. So sánh các phần dư (cùng tử, so sánh mẫu).
Bước 3. Suy ra chiều so sánh của hai biểu thức ban đầu, chú ý dấu cộng hay trừ trước phần dư.`,
    vd: VD(
      R`##VD
Ví dụ 1: So sánh $A=\dfrac{2^{10}+1}{2^{10}-1}$ và $B=\dfrac{2^{12}+1}{2^{12}-1}$.
**Hướng dẫn giải:**
$A=1+\dfrac2{2^{10}-1}$; $B=1+\dfrac2{2^{12}-1}$.
Vì $2^{10}-1<2^{12}-1$ nên $\dfrac2{2^{10}-1}>\dfrac2{2^{12}-1}$.
Vậy $A>B$.`,
      R`##VD
Ví dụ 2: So sánh $A=\dfrac{3^{50}+1}{3^{50}+3}$ và $B=\dfrac{3^{51}+1}{3^{51}+3}$.
**Hướng dẫn giải:**
$A=1-\dfrac2{3^{50}+3}$; $B=1-\dfrac2{3^{51}+3}$.
Vì $3^{50}+3<3^{51}+3$ nên $\dfrac2{3^{50}+3}>\dfrac2{3^{51}+3}$.
Suy ra $1-\dfrac2{3^{50}+3}<1-\dfrac2{3^{51}+3}$, tức $A<B$.`),
  },

  // ───────────────────────── So sánh: tử và mẫu khác số mũ
  NDB01347: {
    mo_ta: 'So sánh hai biểu thức phân thức luỹ thừa mà số mũ của tử và mẫu khác nhau, ví dụ (10^2024+1)/(10^2025+1) và (10^2025+1)/(10^2026+1). Thường nhân tử và mẫu với cơ số để đưa về 1 cộng một phân số rồi so sánh phần dư.',
    lt: R`##TC
Với $a>1$: $a\cdot\dfrac{a^n+1}{a^{n+1}+1}=\dfrac{a^{n+1}+a}{a^{n+1}+1}=1+\dfrac{a-1}{a^{n+1}+1}$.
Hai phân số cùng tử dương: phân số nào có mẫu lớn hơn thì bé hơn.

##PP
Bước 1. Nhân mỗi biểu thức với cơ số $a$ để tử và mẫu có cùng số mũ cao nhất.
Bước 2. Viết thành $1+\dfrac{a-1}{\text{mẫu}}$ rồi so sánh các phần dư (cùng tử, so sánh mẫu).
Bước 3. Vì cả hai biểu thức cùng nhân với $a>0$ nên chiều so sánh của chúng giữ nguyên.`,
    vd: VD(
      R`##VD
Ví dụ 1: So sánh $A=\dfrac{10^{2024}+1}{10^{2025}+1}$ và $B=\dfrac{10^{2025}+1}{10^{2026}+1}$.
**Hướng dẫn giải:**
$10A=\dfrac{10^{2025}+10}{10^{2025}+1}=1+\dfrac9{10^{2025}+1}$.
$10B=\dfrac{10^{2026}+10}{10^{2026}+1}=1+\dfrac9{10^{2026}+1}$.
Vì $10^{2025}+1<10^{2026}+1$ nên $\dfrac9{10^{2025}+1}>\dfrac9{10^{2026}+1}$, suy ra $10A>10B$.
Vậy $A>B$.`,
      R`##VD
Ví dụ 2: So sánh $A=\dfrac{2022^{2022}+1}{2022^{2023}+1}$ và $B=\dfrac{2022^{2021}+1}{2022^{2022}+1}$.
**Hướng dẫn giải:**
Đặt $a=2022$.
$aA=\dfrac{a^{2023}+a}{a^{2023}+1}=1+\dfrac{a-1}{a^{2023}+1}$.
$aB=\dfrac{a^{2022}+a}{a^{2022}+1}=1+\dfrac{a-1}{a^{2022}+1}$.
Vì $a^{2023}+1>a^{2022}+1$ nên $\dfrac{a-1}{a^{2023}+1}<\dfrac{a-1}{a^{2022}+1}$, suy ra $aA<aB$.
Vậy $A<B$.`),
  },
}

// ───── kiểm số liệu các ví dụ bằng số học chính xác
const kiem = [
  ['A=1.2+…+99.100', 99n * 100n * 101n / 3n === 333300n],
  ['B=1.2.3+…+98.99.100', 98n * 99n * 100n * 101n / 4n === 24497550n && (98n * 99n * 100n * 101n) % 4n === 0n],
  ['D=2.3+…+49.50', 49n * 50n * 51n / 3n - 2n === 41648n && 49n * 50n * 51n / 3n === 41650n],
  ['tính tay Σk(k+1) k=1..99', (() => { let s = 0n; for (let k = 1n; k <= 99n; k++) s += k * (k + 1n); return s === 333300n })()],
  ['tính tay Σk(k+1)(k+2) k=1..98', (() => { let s = 0n; for (let k = 1n; k <= 98n; k++) s += k * (k + 1n) * (k + 2n); return s === 24497550n })()],
  ['506/1013 = ½(1−1/1013)', 506n * 2n * 1013n === 1012n * 1013n],
  ['x−3 · y = 6 (8 cặp)', [[4, 6], [5, 3], [6, 2], [9, 1], [2, -6], [1, -3], [0, -2], [-3, -1]].every(([x, y]) => (x - 3) * y === 6 && x / 6 - 1 / y - 0.5 < 1e-12 && Math.abs(x / 6 - 1 / y - 0.5) < 1e-12)],
  ['C=(2x−7)/(x+1) nguyên', [-10, -4, -2, 0, 2, 8].every((x) => Number.isInteger((2 * x - 7) / (x + 1))) && [-3, 1, 3, 7].map((n) => (n + 3) / (n - 2)).join() === '0,-4,6,2'],
  ['3^{x+2}−3^x=72 tại x=2', 3 ** 4 - 3 ** 2 === 72],
  ['2x−(−1/3)^3=7/27 tại x=1/9', Math.abs(2 / 9 + 1 / 27 - 7 / 27) < 1e-12],
  ['(2/3)^2:x−1/3=1/9 tại x=1', Math.abs(4 / 9 - 1 / 3 - 1 / 9) < 1e-12],
  ['a=1/2,b=−1', 0.5 + -1 === 0.5 * -1 && 0.5 * -1 === 0.5 / -1],
  ['0,(12)+0,(21)=1/3', 12n + 21n === 33n && 33n * 3n === 99n],
  ['|1−√2|+|√2−3|=2', Math.abs(Math.abs(1 - Math.SQRT2) + Math.abs(Math.SQRT2 - 3) - 2) < 1e-12],
]
let hong = 0
for (const [ten, ok] of kiem) { if (!ok) { hong++; console.error('✗ SAI:', ten) } }
if (hong) { console.error(hong, 'phép kiểm sai ⇒ DỪNG'); process.exit(1) }
console.log('✔', kiem.length, 'phép kiểm số liệu đúng')

// ───── kiểm định dạng chữ: không ký tự điều khiển, không lệnh LaTeX mất dấu \ (bài học 20/10)
const BAN = /(?<![\\a-zA-Z])(dfrac|frac|left|right|cdot|sqrt|ge|le|text|underbrace|ldots|dots|mathbb|overline|pm)\b/
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
let dem = { mo_ta: 0, ly_thuyet: 0, vi_du: 0 }
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
