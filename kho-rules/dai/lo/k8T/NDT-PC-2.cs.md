=== C3.1@p282
- bai: 1 · y: - · trang: 282 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040101
- cong_cu: phân tích nhân tử · tích năm số nguyên liên tiếp chia hết cho 5
- kiem: khong
- ket_qua_sach: 5x(x+1)(x-1)
- dap_an: a) $5x(x+1)(x-1)$; b) Chứng minh
- ghi_chu_nghi:
## DE
Cho đa thức $P(x)=x^5-x$; $Q(x)=(x^2-4)(x^2-1)x$.

a) Hãy phân tích đa thức $P(x)-Q(x)$ thành tích các nhân tử.

b) Chứng tỏ rằng nếu $x$ là số nguyên thì $P(x)$ luôn chia hết cho $5$.
## SACH
a) $P(x)-Q(x)=x^5-x-(x^2-4)(x^2-1)x$
$=x^5-x-(x^4-5x^2+4)x=x^5-x-x^5+5x^3-4x$
$=5x^3-5x=5x(x^2-1)=5x(x+1)(x-1)$
b) Ta có $P(x)-Q(x)=5x(x+1)(x-1)\vdots5$ với $x\in\mathbb{Z}$
Mà $Q(x)=(x^2-4)(x^2-1)x=(x+2)(x-2)(x+1)(x-1)x$ là tích của năm số nguyên liên tiếp
Ta có $Q(x)\vdots5$
Do vậy $P(x)=5x(x+1)(x-1)+Q(x)$ chia hết cho $5$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu $P-Q$ có hệ số chung $5$ nên chia hết cho $5$; còn $Q$ là tích đúng năm số nguyên liên tiếp nên cũng chia hết cho $5$, và $P$ chính là tổng của hai đa thức đó.

**Bước 1.** Khai triển $Q(x)$ rồi trừ khỏi $P(x)$: các hạng tử bậc năm khử nhau, chỉ còn đa thức bậc ba có hệ số chung.

**Bước 2.** Đặt nhân tử chung rồi dùng hằng đẳng thức hiệu hai bình phương để phân tích đến cùng thành tích các nhân tử bậc nhất.

**Bước 3.** Viết $P(x)$ thành tổng của hiệu $P(x)-Q(x)$ và $Q(x)$, rồi xét từng số hạng có chia hết cho $5$ hay không.

**Bước 4.** Phân tích $Q(x)$ thành tích của $x$ với bốn nhân tử bậc nhất để nhận ra năm số nguyên liên tiếp, rồi dùng tính chất về số dư khi chia cho $5$ của năm số liên tiếp.

**Chú ý:** Chỉ cần một thừa số trong tích chia hết cho $5$ là cả tích chia hết cho $5$; năm số nguyên liên tiếp cho năm số dư khác nhau khi chia cho $5$ nên luôn có một số dư $0$.

**Phần 2. Trình bày**

a) $P(x)-Q(x)=x^5-x-(x^4-5x^2+4)x$

$=x^5-x-x^5+5x^3-4x$

$=5x^3-5x$

$=5x(x^2-1)$

$=5x(x-1)(x+1)$

b) Với $x\in\mathbb{Z}$, ta có $P(x)-Q(x)=5x(x-1)(x+1)\vdots5$.

Mặt khác $Q(x)=(x^2-4)(x^2-1)x=(x-2)(x-1)x(x+1)(x+2)$ là tích của năm số nguyên liên tiếp. Năm số nguyên liên tiếp cho năm số dư khác nhau khi chia cho $5$, trong đó có số dư $0$, nên có một thừa số chia hết cho $5$, suy ra $Q(x)\vdots5$.

Do đó $P(x)=[P(x)-Q(x)]+Q(x)\vdots5$ với mọi $x\in\mathbb{Z}$.

=== C3.2a@p282
- bai: 2 · y: a · trang: 282 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: hiệu hai bình phương · xét dấu tích hai thừa số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng đầu lời giải của sách in "$-4x_2^2$" (chép đúng như in); đúng phải là $-4x_1^2$ (dòng sau của sách đã dùng $-3x_1^2$). Không ảnh hưởng lập luận.
## DE
Cho $x_1,x_2\in[0;1]$. Chứng minh rằng: $(1+x_1)^2\ge4x_1^2$.
## SACH
Ta có $(1+x_1)^2-4x_1^2=1+2x_1+x_1^2-4x_2^2$
$=1+2x_1-3x_1^2=1-x_1+3x_1-3x_1^2=1-x_1+3x_1(1-x_1)$
$=(1-x_1)(1+3x_1)$
Ta có $x_1\in[0,1]$ nên $0\le x_1\le1$
$\Rightarrow1-x_1\ge0$ và $1+3x_1>0\Rightarrow(1-x_1)(1+3x_1)\ge0$
Như vậy $(1+x_1)^2-4x_1^2\ge0$
Do đó $(1+x_1)^2\ge4x_1^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai vế đều là bình phương nên xét hiệu và dùng hằng đẳng thức hiệu hai bình phương; hiệu thành tích hai nhân tử, và điều kiện $x_1\in[0;1]$ cho biết dấu của cả hai.

**Bước 1.** Chuyển $4x_1^2$ sang vế trái để xét hiệu của hai bình phương $(1+x_1)^2$ và $(2x_1)^2$.

**Bước 2.** Phân tích hiệu đó bằng hằng đẳng thức thành tích của hai nhân tử bậc nhất theo $x_1$.

**Bước 3.** Từ $0\le x_1\le1$ suy ra dấu của từng nhân tử, rồi kết luận dấu của tích.

**Chú ý:** Điều kiện $x_1\ge0$ là cần thiết: với $x_1=-1$ thì $(1+x_1)^2=0<4x_1^2$. Dấu "=" xảy ra khi $x_1=1$.

**Phần 2. Trình bày**

$(1+x_1)^2-4x_1^2=(1+x_1-2x_1)(1+x_1+2x_1)$

$=(1-x_1)(1+3x_1)$

Vì $0\le x_1\le1$ nên $1-x_1\ge0$ và $1+3x_1>0$, do đó $(1-x_1)(1+3x_1)\ge0$.

Vậy $(1+x_1)^2\ge4x_1^2$.

=== C3.2b@p282
- bai: 2 · y: b · trang: 282 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: đánh giá bình phương không vượt quá chính số đó trên đoạn $[0;1]$ · hằng đẳng thức bình phương của một hiệu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T030103 (làm trội $x^2\le x$ rồi đưa về bình phương).
## DE
Cho $x_1,x_2\in[0;1]$. Chứng minh rằng: $(1+x_1+x_2)^2\ge4(x_1^2+x_2^2)$.
## SACH
Ta có $x_1,x_2\in[0,1]\Rightarrow x_1^2\le x_1$, $x_2^2\le x_2$
Do đó $(1+x_1+x_2)^2-4(x_1^2+x_2^2)\ge(1+x_1+x_2)^2-4(x_1+x_2)$
$=1+x_1^2+x_2^2+2x_1+2x_2+2x_1x_2-4x_1-4x_2$
$=1+(x_1+x_2)^2-2(x_1+x_2)=(1-x_1-x_2)^2\ge0$
Vậy $(1+x_1+x_2)^2\ge4(x_1^2+x_2^2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với số $t\in[0;1]$ thì $t^2\le t$, nên có thể thay các bình phương ở vế phải bằng chính các số đó để chỉ còn tổng $x_1+x_2$; khi ấy hiệu hai vế là một bình phương.

**Bước 1.** Dùng điều kiện $0\le x_i\le1$ để chứng tỏ $x_i^2\le x_i$, từ đó chặn vế phải $4(x_1^2+x_2^2)$ bởi một biểu thức chỉ chứa tổng $x_1+x_2$.

**Bước 2.** Đặt $s=x_1+x_2$ và quy bài toán về so sánh $(1+s)^2$ với $4s$ bằng cách xét hiệu của chúng.

**Bước 3.** Khai triển hiệu đó rồi nhận ra bình phương của một biểu thức để kết luận hiệu không âm.

**Chú ý:** Dấu "=" xảy ra khi cả hai bất đẳng thức dùng đều đạt dấu bằng, tức mỗi số $x_i$ bằng $0$ hoặc $1$ và $x_1+x_2=1$, chẳng hạn $(x_1;x_2)=(0;1)$.

**Phần 2. Trình bày**

Vì $0\le x_1\le1$ nên $x_1^2\le x_1$; tương tự $x_2^2\le x_2$. Suy ra $4(x_1^2+x_2^2)\le4(x_1+x_2)$.

Do đó $(1+x_1+x_2)^2-4(x_1^2+x_2^2)\ge(1+x_1+x_2)^2-4(x_1+x_2)$

$=1+2(x_1+x_2)+(x_1+x_2)^2-4(x_1+x_2)$

$=1-2(x_1+x_2)+(x_1+x_2)^2$

$=(1-x_1-x_2)^2\ge0$.

Vậy $(1+x_1+x_2)^2\ge4(x_1^2+x_2^2)$.

=== C3.6a@p282
- bai: 6 · y: a · trang: 282 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040102
- cong_cu: hiệu hai luỹ thừa cùng số mũ chia hết cho hiệu hai cơ số · xét số dư (mod 23)
- kiem: khong
- ket_qua_sach: 1
- dap_an: Số dư là $1$; Chứng minh
- ghi_chu_nghi: Ý thứ hai trùng với PA.24 nhưng đề ở đây có thêm ý "tìm số dư khi chia $2^{11n}$ cho $23$" nên vẫn chép. Dòng 6 lời giải sách in "$2^{n+2b}$" (OCR/in nhầm, đúng là $2^{a+2b}$). Chỗ "Theo kết quả trên thì $2^r+1\not\vdots23$" sách không kiểm từng $r$; lời giải kho đã kiểm đủ $r=0;1;\dots;10$.
## DE
Cho $n\in\mathbb{N}$. Tìm số dư khi chia $2^{11n}$ cho $23$. Chứng minh rằng $2^a+29^b$ không chia hết cho $23$, với mọi $a,b\in\mathbb{N}$.
## SACH
Ta có: $2^{11n}=2048^n-1^n+1$ chia $23$ dư $1$
Vì $(2048^n-1^n)\vdots(2048-1)$ mà $2048-1=2047=89\cdot23\vdots23$
Đặt $M=2^a+29^b$. Ta có: $4^b\cdot M=2^{a+2b}+116^b$
$=(2^{a+2b}+1)+(116^b-1)$
Mà $116^b-1\vdots116-1$, $116-1=115=5\cdot23\vdots23$ (1)
Mặt khác: $a+2b=11n+r$ ($n\in\mathbb{N}$, $r=\overline{0;10}$)
Ta có: $2^{a+2b}+1=2^r(2^{11n}-1)+2^r+1$
Theo kết quả trên thì $2^r+1\not\vdots23$ với $r=\overline{0;10}$
Do đó $(2^{a+2b}+1)\not\vdots23$ (2)
Từ (1) và (2) cho $4^b\cdot M\not\vdots23$
Vậy $M=2^a+29^b\not\vdots23$ (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $2^{11}=2048$ hơn $1$ một bội của $23$ nên luỹ thừa của $2$ có số dư khi chia cho $23$ lặp lại sau mỗi $11$ số mũ; còn $29^b$ nhân với $4^b$ thành $116^b$, cũng hơn $1$ một bội của $23$.

**Bước 1.** Viết $2^{11n}=2048^n$ rồi dùng tính chất $A^n-1$ chia hết cho $A-1$ với $A=2048$ để tìm số dư khi chia cho $23$.

**Bước 2.** Nhân $2^a+29^b$ với $4^b$ (số nguyên tố cùng nhau với $23$) để $29^b$ trở thành $116^b$, rồi tách tổng thành $(2^{a+2b}+1)$ cộng $(116^b-1)$.

**Bước 3.** Chỉ ra $116^b-1$ chia hết cho $23$ nhờ $116-1=115=5\cdot23$, nên bài toán quy về xét tính chia hết của $2^{a+2b}+1$ cho $23$.

**Bước 4.** Viết $a+2b=11n+r$ với $0\le r\le10$, dùng kết quả của ý đầu để chuyển sang $2^r+1$ rồi kiểm tra từng giá trị của $r$.

**Chú ý:** Phải có $4^b$ nguyên tố cùng nhau với $23$ thì mới suy ra được $2^a+29^b$ không chia hết cho $23$ từ việc $4^b(2^a+29^b)$ không chia hết cho $23$; gặp dạng "$m^a+k^b$ không chia hết cho một số nguyên tố" hãy tìm chu kì của luỹ thừa theo modulo đó trước.

**Phần 2. Trình bày**

Ta có $2^{11n}=2048^n=(2048^n-1)+1$. Vì $2048^n-1\vdots2048-1=2047=23\cdot89$ nên $2^{11n}$ chia cho $23$ dư $1$.

Đặt $M=2^a+29^b$. Ta có $4^bM=2^{a+2b}+116^b=(2^{a+2b}+1)+(116^b-1)$.

Vì $116^b-1\vdots116-1=115=5\cdot23$ nên $116^b-1\vdots23$. (1)

Đặt $a+2b=11n+r$ với $n\in\mathbb{N}$, $r\in\{0;1;\dots;10\}$. Khi đó $2^{a+2b}+1=2^r(2^{11n}-1)+(2^r+1)$.

Vì $2^{11n}-1\vdots23$ (theo trên) nên $2^r(2^{11n}-1)\vdots23$.

Với $r=0;1;\dots;10$ thì $2^r+1$ lần lượt bằng $2;3;5;9;17;33;65;129;257;513;1025$, chia cho $23$ lần lượt dư $2;3;5;9;17;10;19;14;4;7;13$, không số nào chia hết cho $23$. Do đó $2^{a+2b}+1\not\vdots23$. (2)

Từ (1) và (2) suy ra $4^bM\not\vdots23$. Nếu $M\vdots23$ thì $4^bM\vdots23$, vô lí; vậy $M\not\vdots23$.

Vậy số dư khi chia $2^{11n}$ cho $23$ là $1$, và $2^a+29^b$ không chia hết cho $23$ với mọi $a,b\in\mathbb{N}$.

=== C3.6b@p282
- bai: 6 · y: b · trang: 282 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020201
- cong_cu: lập phương trình · tổng dãy số cách đều · phương trình bậc hai (phân tích nhân tử)
- kiem: khong
- ket_qua_sach: 950
- dap_an: $950$
- ghi_chu_nghi: Sách in "Số lần đi ít hơn số lần dừng là 1" (đúng phải là số lần dừng ít hơn số lần đi $1$, như các dòng sau của sách). Sách in "$2x^2+2x+x^2-x=110$" (mất chữ số $2$; đúng là $1102$, như dòng kế tiếp). Đề không nói rõ rô bốt có dừng sau lần đi cuối đến $B$ hay không; sách hiểu là không (số lần dừng $=x-1$).
## DE
Một rô bốt chuyển động từ $A$ đến $B$ theo cách sau: đi được $5$m dừng lại $1$ giây, rồi đi tiếp $10$m dừng lại $2$ giây, rồi đi tiếp $15$m dừng lại $3$ giây... Cứ như vậy đi từ $A$ đến $B$ kể cả dừng hết tất cả $551$ giây. Tính khoảng cách từ $A$ đến $B$. Biết rằng, khi đi rô bốt chuyển động với vận tốc là $2{,}5$m/giây.
## SACH
Số lần đi ít hơn số lần dừng là $1$
Gọi số lần đi là $x$ (lần) (Điều kiện: $x\in\mathbb{N}^*$), số lần dừng là $x-1$ (lần)
Thời gian đi là: $\dfrac{5}{2{,}5}+\dfrac{10}{2{,}5}+\dfrac{15}{2{,}5}+\dots+\dfrac{5x}{2{,}5}=2+4+6+\dots+2x$
$=(2+2x)\cdot x:2=x(x+1)$ (giây)
Theo đầu bài, ta có phương trình:
$x(x+1)+\dfrac{x(x-1)}{2}=551\Leftrightarrow2x^2+2x+x^2-x=110$
$\Leftrightarrow3x^2+x-1102=0\Leftrightarrow(x-19)(3x+58)=0$
$\Leftrightarrow x-19=0$ hoặc $3x+58=0\Leftrightarrow x=19$ (chọn) hoặc $x=-\dfrac{58}{3}$ (loại)
Thời gian đi là: $19(19+1)=380$ (giây)
Vậy khoảng cách từ $A$ đến $B$ là: $2{,}5\cdot380=950$ (m)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả thời gian đi lẫn thời gian dừng đều là tổng của một dãy số cách đều theo số lần đi $x$, nên cộng lại bằng $551$ giây thì được một phương trình bậc hai; quãng đường là vận tốc nhân thời gian đi.

**Bước 1.** Gọi $x$ là số lần rô bốt đi; vì lần đi cuối là đến $B$ và không còn dừng nữa nên số lần dừng là $x-1$.

**Bước 2.** Đoạn đi thứ $k$ dài $5k$ mét nên đi mất $2k$ giây; cộng các thời gian đó cho $k$ từ $1$ đến $x$ để được tổng thời gian đi.

**Bước 3.** Lần dừng thứ $k$ kéo dài $k$ giây nên tổng thời gian dừng là tổng các số từ $1$ đến $x-1$; cộng với thời gian đi và cho bằng $551$ để lập phương trình.

**Bước 4.** Giải phương trình bậc hai bằng cách phân tích thành nhân tử, loại nghiệm không phải số tự nhiên dương, rồi tính quãng đường bằng vận tốc nhân thời gian đi.

**Chú ý:** Số lần dừng luôn ít hơn số lần đi $1$ vì đến $B$ là kết thúc, không có lần dừng sau đó; tính nhầm hai số này bằng nhau sẽ ra phương trình khác.

**Phần 2. Trình bày**

Gọi $x$ ($x\in\mathbb{N}^*$) là số lần đi; số lần dừng là $x-1$.

Đoạn đi thứ $k$ dài $5k$ m nên đi mất $\dfrac{5k}{2{,}5}=2k$ giây. Tổng thời gian đi là $2+4+\dots+2x=\dfrac{(2+2x)x}{2}=x(x+1)$ (giây).

Lần dừng thứ $k$ kéo dài $k$ giây nên tổng thời gian dừng là $1+2+\dots+(x-1)=\dfrac{x(x-1)}{2}$ (giây).

Theo đề: $x(x+1)+\dfrac{x(x-1)}{2}=551$

$\Leftrightarrow2x^2+2x+x^2-x=1102$

$\Leftrightarrow3x^2+x-1102=0$

$\Leftrightarrow(x-19)(3x+58)=0$

Do đó $x=19$ (nhận) hoặc $x=-\dfrac{58}{3}$ (loại).

Thời gian đi là $19\cdot20=380$ (giây).

Vậy khoảng cách từ $A$ đến $B$ là $2{,}5\cdot380=950$ (m).

=== C4.1a@p286
- bai: 1 · y: a · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010501
- cong_cu: ghép phân thức cùng mẫu · hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề không nêu điều kiện mẫu khác $0$ (ngầm hiểu $a+b$, $b+c$, $c+a$ khác $0$). Chưa chắc nhóm: T18T010501 hay T18T010502.
## DE
Chứng minh rằng $\dfrac{a^2}{a+b}+\dfrac{b^2}{b+c}+\dfrac{c^2}{c+a}=\dfrac{b^2}{a+b}+\dfrac{c^2}{b+c}+\dfrac{a^2}{c+a}$.
## SACH
Ta có $\left(\dfrac{a^2}{a+b}+\dfrac{b^2}{b+c}+\dfrac{c^2}{c+a}\right)-\left(\dfrac{b^2}{a+b}+\dfrac{c^2}{b+c}+\dfrac{a^2}{c+a}\right)$
$=\dfrac{a^2}{a+b}-\dfrac{b^2}{a+b}+\dfrac{b^2}{b+c}-\dfrac{c^2}{b+c}+\dfrac{c^2}{c+a}-\dfrac{a^2}{c+a}$
$=\dfrac{a^2-b^2}{a+b}+\dfrac{b^2-c^2}{b+c}+\dfrac{c^2-a^2}{c+a}$
$=a-b+b-c+c-a=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế dùng cùng các tử $a^2,b^2,c^2$ nhưng đổi chỗ trên các mẫu, nên xét hiệu hai vế rồi ghép các phân thức cùng mẫu: mỗi cặp có tử là hiệu hai bình phương và rút gọn được với mẫu.

**Bước 1.** Lập hiệu của vế trái và vế phải rồi ghép các phân thức có cùng mẫu thành từng cặp.

**Bước 2.** Phân tích tử của mỗi cặp bằng hằng đẳng thức hiệu hai bình phương để rút gọn cho mẫu tương ứng.

**Bước 3.** Cộng ba kết quả rút gọn và xem các số hạng có triệt tiêu nhau hay không để kết luận.

**Chú ý:** Chỉ được rút gọn khi mẫu khác $0$, nên bài ngầm yêu cầu $a+b$, $b+c$, $c+a$ đều khác $0$.

**Phần 2. Trình bày**

Xét hiệu của vế trái và vế phải:

$\left(\dfrac{a^2}{a+b}+\dfrac{b^2}{b+c}+\dfrac{c^2}{c+a}\right)-\left(\dfrac{b^2}{a+b}+\dfrac{c^2}{b+c}+\dfrac{a^2}{c+a}\right)$

$=\dfrac{a^2-b^2}{a+b}+\dfrac{b^2-c^2}{b+c}+\dfrac{c^2-a^2}{c+a}$

$=\dfrac{(a-b)(a+b)}{a+b}+\dfrac{(b-c)(b+c)}{b+c}+\dfrac{(c-a)(c+a)}{c+a}$

$=(a-b)+(b-c)+(c-a)=0$.

Vậy hai vế bằng nhau.

=== C4.1b@p286
- bai: 1 · y: b · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: hoán vị vòng · quy đồng mẫu thức
- kiem: khong
- ket_qua_sach: 0
- dap_an: $0$
- ghi_chu_nghi: Đề và sách đều không nêu $a,b,c$ đôi một khác nhau (cần để các mẫu $b-c$, $c-a$, $a-b$ có nghĩa). Dòng cuối sách kết thúc ở "$=0$" mà không viết "$M=0$".
## DE
Cho $a,b,c$ thỏa mãn $\dfrac{a}{b-c}+\dfrac{b}{c-a}+\dfrac{c}{a-b}=0$.

Tính giá trị biểu thức $M=\dfrac{a}{(b-c)^2}+\dfrac{b}{(c-a)^2}+\dfrac{c}{(a-b)^2}$.
## SACH
Từ $\dfrac{a}{b-c}+\dfrac{b}{c-a}+\dfrac{c}{a-b}=0\Rightarrow\dfrac{a}{b-c}=\dfrac{-b}{c-a}+\dfrac{-c}{a-b}$
Do đó $\dfrac{a}{(b-c)^2}=\dfrac{-b}{(c-a)(b-c)}+\dfrac{-c}{(a-b)(b-c)}$
$=\dfrac{-b(a-b)-c(c-a)}{(a-b)(b-c)(c-a)}=\dfrac{-ab+b^2-c^2+ca}{(a-b)(b-c)(c-a)}$
Tương tự $\dfrac{b}{(c-a)^2}=\dfrac{-bc+c^2-a^2+ab}{(a-b)(b-c)(c-a)}$
Và $\dfrac{c}{(a-b)^2}=\dfrac{-ca+a^2-b^2+bc}{(a-b)(b-c)(c-a)}$
Do đó $\dfrac{a}{(b-c)^2}+\dfrac{b}{(c-a)^2}+\dfrac{c}{(a-b)^2}$
$=\dfrac{-ab+b^2-c^2+ca-bc+c^2-a^2+ab-ca+a^2-b^2+bc}{(a-b)(b-c)(c-a)}=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện cho tổng ba phân thức bằng $0$, còn $M$ gồm đúng ba phân thức ấy chia thêm cho mẫu của chính nó; nên chuyển hai phân thức sang một vế rồi chia hai vế cho mẫu thích hợp sẽ cho từng số hạng của $M$ theo các phân thức còn lại.

**Bước 1.** Chuyển hai phân thức sang vế phải rồi chia hai vế cho $b-c$ để vế trái xuất hiện đúng số hạng thứ nhất của $M$.

**Bước 2.** Quy đồng vế phải về mẫu chung $(a-b)(b-c)(c-a)$ và rút gọn tử thành một đa thức theo $a,b,c$.

**Bước 3.** Hoán vị vòng quanh $a\to b\to c\to a$ để viết ngay hai số hạng còn lại của $M$ với cùng mẫu chung.

**Bước 4.** Cộng ba kết quả cùng mẫu và xét xem các hạng tử ở tử có triệt tiêu nhau từng đôi hay không để tìm giá trị của $M$.

**Chú ý:** Bài ngầm yêu cầu $a,b,c$ đôi một khác nhau để các mẫu có nghĩa; mẫu chung $(a-b)(b-c)(c-a)$ giữ nguyên dấu khi hoán vị vòng nên cộng tử được thẳng.

**Phần 2. Trình bày**

Từ điều kiện suy ra $\dfrac{a}{b-c}=-\dfrac{b}{c-a}-\dfrac{c}{a-b}$.

Chia hai vế cho $b-c$: $\dfrac{a}{(b-c)^2}=-\dfrac{b}{(c-a)(b-c)}-\dfrac{c}{(a-b)(b-c)}$

$=\dfrac{-b(a-b)-c(c-a)}{(a-b)(b-c)(c-a)}$

$=\dfrac{-ab+b^2-c^2+ca}{(a-b)(b-c)(c-a)}$.

Hoán vị vòng $a\to b\to c\to a$: $\dfrac{b}{(c-a)^2}=\dfrac{-bc+c^2-a^2+ab}{(a-b)(b-c)(c-a)}$ và $\dfrac{c}{(a-b)^2}=\dfrac{-ca+a^2-b^2+bc}{(a-b)(b-c)(c-a)}$.

Cộng ba đẳng thức: $M=\dfrac{(-ab+b^2-c^2+ca)+(-bc+c^2-a^2+ab)+(-ca+a^2-b^2+bc)}{(a-b)(b-c)(c-a)}$

$=\dfrac{0}{(a-b)(b-c)(c-a)}=0$.

Vậy $M=0$.

=== C4.2a@p286
- bai: 2 · y: a · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội từng số hạng · hiệu hai bình phương · triệt tiêu theo hoán vị vòng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ở các dòng "Vậy / Tương tự / Và" sách in vế phải là $\dfrac{a^4-b^4}{2}$, $\dfrac{b^4-c^4}{2}$, $\dfrac{c^4-a^4}{2}$; sau khi nhân thêm $(a^4+b^4)$ đúng phải là $\dfrac{a^8-b^8}{2}$, $\dfrac{b^8-c^8}{2}$, $\dfrac{c^8-a^8}{2}$ (chép đúng như in; tổng vẫn triệt tiêu nên kết luận đúng). Đề không nêu điều kiện của $a,b,c$ (hiểu là số thực bất kì). Chưa chắc nhóm: T18T030103 hay T18T030101.
## DE
Chứng minh rằng: $a(a+b)(a^2+b^2)(a^4+b^4)+b(b+c)(b^2+c^2)(b^4+c^4)+c(c+a)(c^2+a^2)(c^4+a^4)\ge0$
## SACH
Ta có $a(a+b)=a^2+ab=\dfrac{2a^2+2ab}{2}$
$=\dfrac{(a^2-b^2)+(a^2+b^2+2ab)}{2}=\dfrac{a^2-b^2+(a+b)^2}{2}\ge\dfrac{a^2-b^2}{2}$
Do đó $a(a+b)(a^2+b^2)\ge\dfrac{a^2-b^2}{2}(a^2+b^2)=\dfrac{a^4-b^4}{2}$
Vậy $a(a+b)(a^2+b^2)(a^4+b^4)\ge\dfrac{a^4-b^4}{2}$
Tương tự $b(b+c)(b^2+c^2)(b^4+c^4)\ge\dfrac{b^4-c^4}{2}$
Và $c(c+a)(c^2+a^2)(c^4+a^4)\ge\dfrac{c^4-a^4}{2}$
Vậy $a(a+b)(a^2+b^2)(a^4+b^4)+b(b+c)(b^2+c^2)(b^4+c^4)+c(c+a)(c^2+a^2)(c^4+a^4)\ge0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng có dạng $a(a+b)$ nhân với $(a^2+b^2)(a^4+b^4)$; chặn $a(a+b)$ bởi $\dfrac{a^2-b^2}{2}$ thì số hạng được chặn dưới bởi một hiệu hai luỹ thừa, và cộng ba số hạng vòng quanh các hiệu đó triệt tiêu nhau.

**Bước 1.** Chứng minh $a(a+b)\ge\dfrac{a^2-b^2}{2}$ bằng cách xét hiệu hai vế và nhận ra một bình phương.

**Bước 2.** Nhân hai vế với $(a^2+b^2)(a^4+b^4)$, vốn không âm nên bất đẳng thức giữ nguyên chiều, rồi dùng hiệu hai bình phương liên tiếp để gộp thành một hiệu hai luỹ thừa bậc tám.

**Bước 3.** Viết hai bất đẳng thức tương tự cho hai số hạng còn lại bằng cách hoán vị vòng $a\to b\to c\to a$.

**Bước 4.** Cộng ba bất đẳng thức theo vế để các hiệu ở vế phải triệt tiêu nhau và rút ra kết luận.

**Chú ý:** Đề không cho dấu của $a,b,c$ nên chỉ được nhân bất đẳng thức với biểu thức chắc chắn không âm với mọi $a,b$, ở đây là $(a^2+b^2)(a^4+b^4)$.

**Phần 2. Trình bày**

Ta có $a(a+b)-\dfrac{a^2-b^2}{2}=\dfrac{2a^2+2ab-a^2+b^2}{2}=\dfrac{(a+b)^2}{2}\ge0$, nên $a(a+b)\ge\dfrac{a^2-b^2}{2}$.

Nhân hai vế với $(a^2+b^2)(a^4+b^4)\ge0$:

$a(a+b)(a^2+b^2)(a^4+b^4)\ge\dfrac{(a^2-b^2)(a^2+b^2)(a^4+b^4)}{2}=\dfrac{a^8-b^8}{2}$.

Tương tự $b(b+c)(b^2+c^2)(b^4+c^4)\ge\dfrac{b^8-c^8}{2}$ và $c(c+a)(c^2+a^2)(c^4+a^4)\ge\dfrac{c^8-a^8}{2}$.

Cộng ba bất đẳng thức theo vế, vế trái của đề

$\ge\dfrac{a^8-b^8+b^8-c^8+c^8-a^8}{2}=0$.

Vậy bất đẳng thức được chứng minh.

=== C4.2b@p286
- bai: 2 · y: b · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: thêm hạng tử không âm · gộp thành tích hai tổng · bất đẳng thức Cô-si cho hai số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c,d,e\ge0$ thỏa mãn $a+b+c+d+e=1$.

Chứng minh rằng $ab+bc+cd+de\le\dfrac{1}{4}$.
## SACH
Ta có $ab+bc+cd+de\le ab+bc+be+ad+cd+de$
$=(a+c+e)(b+d)\le\left(\dfrac{a+c+e+b+d}{2}\right)^2=\dfrac{1}{4}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thêm vào vế trái hai tích không âm $ad$ và $be$ thì sáu tích gộp được thành $(a+c+e)(b+d)$; hai thừa số này có tổng bằng $1$ nên tích của chúng không vượt quá bình phương của nửa tổng.

**Bước 1.** Nhận xét các tích $ad$ và $be$ không âm nên thêm chúng vào vế trái chỉ làm vế trái lớn lên hoặc giữ nguyên.

**Bước 2.** Nhóm sáu tích sau khi thêm thành tích của hai tổng $(a+c+e)$ và $(b+d)$ bằng cách đặt nhân tử chung.

**Bước 3.** Áp dụng bất đẳng thức $xy\le\left(\dfrac{x+y}{2}\right)^2$ cho hai thừa số không âm, rồi dùng điều kiện tổng bằng $1$.

**Chú ý:** Dấu "=" xảy ra khi $ad=be=0$ và $a+c+e=b+d=\dfrac{1}{2}$, chẳng hạn $a=e=0$, $b=d=\dfrac{1}{4}$, $c=\dfrac{1}{2}$.

**Phần 2. Trình bày**

Vì $a,b,c,d,e\ge0$ nên $ad\ge0$ và $be\ge0$. Do đó

$ab+bc+cd+de\le ab+bc+cd+de+ad+be$

$=(a+c+e)(b+d)$

$\le\left(\dfrac{(a+c+e)+(b+d)}{2}\right)^2$ (vì $xy\le\left(\dfrac{x+y}{2}\right)^2$ với mọi $x,y$)

$=\left(\dfrac{a+b+c+d+e}{2}\right)^2=\dfrac{1}{4}$.

Vậy $ab+bc+cd+de\le\dfrac{1}{4}$.

=== C4.3a@p286
- bai: 3 · y: a · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: kẹp giữa hai lập phương của hai số nguyên liên tiếp · đưa về bình phương cộng số dương
- kiem: khong
- ket_qua_sach: (0;1); (-1;0)
- dap_an: $(x;y)\in\{(0;1);(-1;0)\}$
- ghi_chu_nghi:
## DE
Giải phương trình nghiệm nguyên $x^3+x^2+x+1=y^3$.
## SACH
- Nếu $x=0$ thì $y^3=1\Leftrightarrow y=1$
- Nếu $x=-1$ thì $y^3=0\Leftrightarrow y=0$
- Nếu $x$ khác $0$; $-1$ thì $x(x+1)>0$

Ta có $x^3+x^2+x+1=x^3+\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>x^3$
Và $x^3+x^2+x+1<x^3+x^2+x+1+2x(x+1)=(x+1)^3$
Do đó $x^3<y^3<(x+1)^3$
$\Leftrightarrow x<y<x+1$
Điều này vô lí!
Vậy nghiệm nguyên $(x;y)$ của phương trình là $(0;1)$; $(-1;0)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái nằm chặt giữa hai lập phương $x^3$ và $(x+1)^3$ của hai số nguyên liên tiếp (khi $x\ne0$ và $x\ne-1$), nên $y^3$ không thể là lập phương của một số nguyên.

**Bước 1.** Xét riêng hai giá trị $x=0$ và $x=-1$ vì với hai giá trị này phép kẹp bên dưới không còn chặt.

**Bước 2.** Với các $x$ còn lại, chứng minh vế trái lớn hơn $x^3$ bằng cách đưa $x^2+x+1$ về dạng bình phương cộng một số dương.

**Bước 3.** Chứng minh vế trái nhỏ hơn $(x+1)^3$ bằng cách tính hiệu $(x+1)^3-(x^3+x^2+x+1)$ và xét dấu.

**Bước 4.** Từ $x^3<y^3<(x+1)^3$ suy ra $x<y<x+1$, rồi lí luận về số nguyên nằm giữa hai số nguyên liên tiếp để kết luận nghiệm.

**Chú ý:** Chỉ suy ra được $x<y<x+1$ từ $x^3<y^3<(x+1)^3$ vì hàm lập phương luôn tăng; đừng quên xét riêng các giá trị $x$ làm hiệu bằng $0$.

**Phần 2. Trình bày**

Với $x=0$: $y^3=1$ nên $y=1$.

Với $x=-1$: $y^3=-1+1-1+1=0$ nên $y=0$.

Với $x\ne0$ và $x\ne-1$: $x$ nguyên nên $x\ge1$ hoặc $x\le-2$, suy ra $x(x+1)>0$.

Ta có $x^3+x^2+x+1-x^3=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$, nên $y^3>x^3$.

Ta có $(x+1)^3-(x^3+x^2+x+1)=2x^2+2x=2x(x+1)>0$, nên $y^3<(x+1)^3$.

Do đó $x^3<y^3<(x+1)^3$, suy ra $x<y<x+1$. Điều này vô lí vì không có số nguyên nào nằm giữa hai số nguyên liên tiếp.

Vậy $(x;y)\in\{(0;1);(-1;0)\}$.

=== C4.3b@p286
- bai: 3 · y: b · trang: 286 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: nhóm hạng tử · hằng đẳng thức tổng hai lập phương · đưa về tổng ba bình phương
- kiem: khong
- ket_qua_sach: (1;2); (2;1); (2;2)
- dap_an: $(x;y)\in\{(1;2);(2;1);(2;2)\}$
- ghi_chu_nghi: Chưa chắc nhóm: T18T040302 hay T18T010102 (đưa về tổng các bình phương).
## DE
Giải phương trình nghiệm nguyên dương: $x^4+x^3y+xy^3+y^4=(x+y)^3$.
## SACH
$x^4+x^3y+xy^3+y^4=(x+y)^3$
$\Leftrightarrow x^3(x+y)+y^3(x+y)=(x+y)^3$
$\Leftrightarrow(x+y)^2(x^2-xy+y^2)=(x+y)^3$
Vì $x,y\in\mathbb{N}^*$. Do đó $x^2-xy+y^2=x+y$
$\Leftrightarrow2x^2-2xy+2y^2=2x+2y$
$\Leftrightarrow x^2-2xy+y^2+x^2-2x+1+y^2-2y+1=2$
$\Leftrightarrow(x-y)^2+(x-1)^2+(y-1)^2=2$
Mà $(x-1)^2\le(x-y)^2+(x-1)^2+(y-1)^2$
Do đó $(x-1)^2\le2$. Ta có $(x-1)^2=0$ hoặc $(x-1)^2=1$
$\Leftrightarrow x=1$ (nhận) hoặc $x=2$ (nhận) hoặc $x=0$ (loại)
- $x=1$ ta có $1-y+y^2=1+y\Leftrightarrow y(y-2)=0\Leftrightarrow y=0$ (loại) hoặc $y=2$ (nhận)
- $x=2$ ta có $4-2y+y^2=2+y\Leftrightarrow y^2-3y+2=0\Leftrightarrow(y-1)(y-2)=0\Leftrightarrow y=1$ hoặc $y=2$

Vậy nghiệm nguyên dương $(x;y)$ của phương trình là $(1;2)$; $(2;1)$; $(2;2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái nhóm được thành $(x+y)(x^3+y^3)$ nên phương trình chia được cho $(x+y)^2$ khác $0$; phương trình bậc hai hai ẩn còn lại đưa được về tổng ba bình phương bằng một số nhỏ, nên mỗi bình phương chỉ nhận vài giá trị.

**Bước 1.** Nhóm các hạng tử ở vế trái thành hai nhóm có nhân tử chung $x+y$, rồi dùng hằng đẳng thức tổng hai lập phương để phân tích.

**Bước 2.** Chia hai vế cho $(x+y)^2$, khác $0$ vì $x,y$ nguyên dương, để được phương trình bậc hai $x^2-xy+y^2=x+y$.

**Bước 3.** Nhân hai vế với $2$ rồi chuyển vế để tách thành tổng của ba bình phương bằng một số nhỏ.

**Bước 4.** Chặn $(x-1)^2$ bằng tổng ba bình phương để có ít giá trị của $x$, rồi với mỗi $x$ giải phương trình bậc hai theo $y$ và loại nghiệm không nguyên dương.

**Chú ý:** Nhớ loại các giá trị $x=0$, $y=0$ vì đề yêu cầu nghiệm nguyên dương; có thể thử lại $(2;2)$: $16+16+16+16=64=4^3$.

**Phần 2. Trình bày**

$x^4+x^3y+xy^3+y^4=(x+y)^3$

$\Leftrightarrow x^3(x+y)+y^3(x+y)=(x+y)^3$

$\Leftrightarrow(x+y)(x^3+y^3)=(x+y)^3$

$\Leftrightarrow(x+y)^2(x^2-xy+y^2)=(x+y)^3$

Vì $x,y$ nguyên dương nên $(x+y)^2>0$; chia hai vế cho $(x+y)^2$ được $x^2-xy+y^2=x+y$

$\Leftrightarrow2x^2-2xy+2y^2-2x-2y=0$

$\Leftrightarrow(x-y)^2+(x-1)^2+(y-1)^2=2$.

Vì $(x-y)^2\ge0$ và $(y-1)^2\ge0$ nên $(x-1)^2\le2$. Mà $x$ nguyên dương nên $(x-1)^2\in\{0;1\}$, tức $x=1$ hoặc $x=2$ (loại $x=0$).

Với $x=1$: $1-y+y^2=1+y\Leftrightarrow y(y-2)=0$, mà $y>0$ nên $y=2$.

Với $x=2$: $4-2y+y^2=2+y\Leftrightarrow y^2-3y+2=0\Leftrightarrow(y-1)(y-2)=0$, nên $y=1$ hoặc $y=2$.

Vậy $(x;y)\in\{(1;2);(2;1);(2;2)\}$.

=== C4.6b@p287
- bai: 6 · y: b · trang: 287 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050102
- cong_cu: tô màu theo số dư khi chia cho 3 · nguyên lí chẵn lẻ trên vòng 11 đỉnh · đối xứng qua đường trung trực
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề có đa giác đều nhưng là bài tô màu – Đi-rích-lê trong hình học tổ hợp, lời đề tự đủ, không cần hình. Chưa chắc nhóm: T18T050102 hay T18T050101. Trong đề sách có dấu ";." thừa sau số $361$ (chép lại thành dấu ";" bình thường).
## DE
Tại mỗi đỉnh của đa giác đều $11$ cạnh ta ghi một số bất kì trong các số $31;32;61;62;91;92;331;361;332;362;961$ (mỗi số dùng đúng $1$ lần).

Chứng minh rằng tồn tại ba đỉnh của đa giác là ba đỉnh của một tam giác cân và tổng các số ghi trên các đỉnh là số chia hết cho $3$.
## SACH
Các số ghi tại đỉnh của đa giác chia cho $3$ dư $1$ hoặc chia cho $3$ dư $2$. Do vậy, ta tô màu các đỉnh đa giác bằng hai màu đỏ, xanh. Tô đỏ nếu tại đỉnh đó ghi số chia cho $3$ dư $1$, tô xanh nếu tại đỉnh đó ghi số chia cho $3$ dư $2$. Bài toán giải xong nếu chứng minh được tồn tại ba đỉnh của đa giác là ba đỉnh của một tam giác cân, ba đỉnh này được tô cùng màu.
Thật vậy: Vì đa giác đều có số đỉnh lẻ ($11$) nên tồn tại hai đỉnh kề nhau được tô cùng một màu, gọi hai đỉnh đó là $A$ và $B$.
Đa giác này còn có đỉnh $C$ nằm trên đường trung trực của $AB$.
Nếu $C$ cùng màu với $A$ và $B$ thì tam giác $ABC$ là tam giác cân có ba đỉnh tô cùng màu
Nếu $C$ khác màu với $A$ và $B$, ta xét đỉnh $D$ kề với đỉnh $A$ ($D$ khác $B$), đỉnh $E$ kề với đỉnh $B$ ($E$ khác $A$). Trường hợp này $D,E$ khác màu với $A$ và $B$ thì tam giác $CDE$ là tam giác cân, có ba đỉnh tô cùng màu, nếu có ít nhất một trong hai đỉnh $D$ và $E$ cùng màu với $A$ và $B$, chẳng hạn $D$ thì tam giác $DAB$ cân, ba đỉnh tô cùng màu.
Như vậy tồn tại ba đỉnh của đa giác là ba đỉnh của một tam giác cân, ba đỉnh này được tô cùng màu
Vậy ta có điều phải chứng minh
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba số cùng số dư khi chia cho $3$ có tổng chia hết cho $3$, nên tô hai màu theo số dư rồi tìm ba đỉnh cùng màu tạo thành tam giác cân; $11$ đỉnh là số lẻ buộc có hai đỉnh kề nhau cùng màu, và từ đó dựng được tam giác cân nhờ tính đối xứng của đa giác đều.

**Bước 1.** Tính số dư khi chia cho $3$ của mười một số đã cho để thấy mỗi số dư $1$ hoặc $2$, rồi tô đỏ hoặc xanh các đỉnh theo số dư và quy bài toán về tìm ba đỉnh cùng màu tạo thành tam giác cân.

**Bước 2.** Chứng minh tồn tại hai đỉnh kề nhau cùng màu bằng phản chứng: nếu hai đỉnh kề nào cũng khác màu thì màu phải xen kẽ dọc theo vòng $11$ đỉnh, điều này mâu thuẫn vì $11$ là số lẻ.

**Bước 3.** Gọi hai đỉnh kề cùng màu là $A,B$ và $C$ là đỉnh nằm trên đường trung trực của $AB$, rồi xét trường hợp $C$ cùng màu với $A$ và $B$.

**Bước 4.** Nếu $C$ khác màu thì xét hai đỉnh $D,E$ kề với $A,B$ về hai phía ngoài, và chia hai khả năng: có một đỉnh trong $D,E$ cùng màu với $A$, hoặc cả hai cùng màu với $C$.

**Chú ý:** Dùng đúng hai điều: tổng ba số cùng số dư $r$ chia $3$ dư $3r$ nên chia hết cho $3$; và đa giác đều có số đỉnh lẻ thì đường trung trực của một cạnh đi qua đúng một đỉnh. Hai số dư khác nhau trong cùng một tam giác sẽ làm tổng không chia hết cho $3$ nên không được trộn màu.

**Phần 2. Trình bày**

Số dư khi chia cho $3$ của các số đã cho lần lượt là: $31\to1$; $32\to2$; $61\to1$; $62\to2$; $91\to1$; $92\to2$; $331\to1$; $361\to1$; $332\to2$; $362\to2$; $961\to1$. Vậy mỗi số chia cho $3$ dư $1$ hoặc dư $2$.

Tô đỏ các đỉnh ghi số chia $3$ dư $1$ và tô xanh các đỉnh ghi số chia $3$ dư $2$. Tổng của ba số cùng số dư $r$ chia $3$ dư $3r$ nên chia hết cho $3$. Vậy chỉ cần chứng minh tồn tại ba đỉnh cùng màu là ba đỉnh của một tam giác cân.

Nếu không có hai đỉnh kề nhau nào cùng màu thì các đỉnh phải tô xen kẽ đỏ, xanh dọc theo vòng, mà vòng có $11$ đỉnh (số lẻ) nên đỉnh đầu và đỉnh cuối, vốn kề nhau, sẽ cùng màu: mâu thuẫn. Vậy tồn tại hai đỉnh kề nhau cùng màu; gọi chúng là $A$ và $B$.

Vì $11$ lẻ nên đường trung trực của cạnh $AB$ đi qua một đỉnh $C$ của đa giác, và $CA=CB$.

Trường hợp 1: $C$ cùng màu với $A$ và $B$. Khi đó tam giác $ABC$ cân tại $C$ và ba đỉnh cùng màu.

Trường hợp 2: $C$ khác màu với $A$ và $B$. Gọi $D$ là đỉnh kề $A$ ($D\ne B$) và $E$ là đỉnh kề $B$ ($E\ne A$).

Nếu $D$ cùng màu với $A$ và $B$ thì tam giác $DAB$ có $AD=AB$ (hai cạnh của đa giác đều) nên cân tại $A$ và ba đỉnh cùng màu. Nếu $E$ cùng màu với $A$ và $B$ thì tam giác $EAB$ cân tại $B$ ($BE=BA$) và ba đỉnh cùng màu.

Nếu cả $D$ và $E$ đều khác màu với $A$ và $B$ thì $D,E$ cùng màu với $C$. Vì $D,E$ đối xứng nhau qua đường trung trực của $AB$, đường này đi qua $C$ nên $CD=CE$. Vậy tam giác $CDE$ cân tại $C$ và ba đỉnh cùng màu.

Trong mọi trường hợp, tồn tại ba đỉnh cùng màu là ba đỉnh của một tam giác cân; tổng ba số ghi ở các đỉnh đó chia hết cho $3$.
