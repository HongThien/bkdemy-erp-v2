=== PA.23@p241
- bai: 23 · y: - · trang: 241 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040102
- cong_cu: số chính phương lẻ chia 8 dư 1 · xét số dư (mod 8)
- kiem: khong
- ket_qua_sach: 2018
- dap_an: $n=2018$; chẳng hạn $a_1=\dots=a_{2013}=1$, $a_{2014}=43$, $a_{2015}=11$, $a_{2016}=3$, $a_{2017}=3$, $a_{2018}=5$
- ghi_chu_nghi:
## DE
Cho $n$ số nguyên lẻ $a_1;a_2;\dots;a_n$ ($n>2015$) thỏa mãn

$a_1^2+a_2^2+\dots+a_{2013}^2=a_{2014}^2+a_{2015}^2+\dots+a_n^2$

Tìm giá trị nhỏ nhất của $n$ và chỉ ra một bộ số $(a_1;a_2;\dots;a_n)$ với $n$ tìm được.
## SACH
Bài toán phụ: Chứng minh rằng số chính phương lẻ chia cho 8 dư 1.

Giải: Ta có $(2n+1)^2=4n^2+4n+1=4n(n+1)+1$ chia cho 8 dư 1 (với $n\in\mathbb{Z}$).
Vậy số chính phương lẻ chia cho 8 dư 1.

Áp dụng bài toán phụ, ta có $a_1^2+a_2^2+\dots+a_{2013}^2$ chia cho 8 dư 5 vì có $a_1,a_2,\dots,a_{2013}$ lẻ.
Do vậy $a_{2014}^2+a_{2015}^2+\dots+a_n^2$ chia cho 8 dư 5.
Mà $a_{2014};a_{2015};\dots;a_n$ là các số lẻ.
Nên $n-2013$ chia cho 8 dư 5; $n>2015$ và $n$ nhỏ nhất. Do vậy $n-2013=5\Leftrightarrow n=2018$.
Ta có: $43^2+11^2+3^2+3^2+5^2=1^2+1^2+\dots+1^2$ (2013 số hạng).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bình phương của một số lẻ luôn chia 8 dư 1, nên tổng bình phương của $m$ số lẻ chia 8 có số dư đúng bằng số dư của $m$ — so sánh số dư của hai vế sẽ ép số các số hạng ở vế phải, tức là ép $n$.

**Bước 1.** Chứng minh bổ đề số chính phương lẻ chia 8 dư 1 bằng cách viết số lẻ dưới dạng $2k+1$ rồi khai triển bình phương.

**Bước 2.** Tính số dư của vế trái khi chia cho 8 dựa vào việc nó gồm 2013 số hạng, mỗi số hạng chia 8 dư 1.

**Bước 3.** Vế phải gồm $n-2013$ số hạng cùng tính chất, nên số dư của nó cho ta điều kiện về số dư của $n-2013$; từ đó và từ $n>2015$ tìm giá trị nhỏ nhất của $n$.

**Bước 4.** Dựng bộ số cụ thể: cho vế trái toàn số 1 rồi tìm các số lẻ cho vế phải sao cho tổng bình phương đúng bằng 2013, bằng cách thử các số lẻ lớn dần.

**Chú ý:** Đây là bài vừa tìm cận dưới vừa phải chỉ ra một bộ số đạt cận đó; nếu thiếu ví dụ cụ thể thì chưa kết luận được giá trị nhỏ nhất.

**Phần 2. Trình bày**

Bổ đề. Số chính phương lẻ chia 8 dư 1.

Thật vậy, số lẻ có dạng $2k+1$ ($k\in\mathbb{Z}$) và $(2k+1)^2=4k^2+4k+1=4k(k+1)+1$.

Vì $k(k+1)$ là tích hai số nguyên liên tiếp nên chẵn, suy ra $4k(k+1)\vdots8$. Vậy $(2k+1)^2$ chia 8 dư 1.

Vế trái có 2013 số hạng, mỗi số hạng là bình phương của một số lẻ nên chia 8 dư 1. Do đó vế trái chia 8 dư $2013-8\cdot251=5$.

Vế phải có $n-2013$ số hạng, mỗi số hạng chia 8 dư 1 nên vế phải chia 8 có cùng số dư với $n-2013$.

Hai vế bằng nhau nên $n-2013$ chia 8 dư 5, tức là $n-2013=8t+5$ ($t\in\mathbb{N}$, vì $n-2013>0$).

Suy ra $n-2013\ge5$, hay $n\ge2018$.

Với $n=2018$: chọn $a_1=a_2=\dots=a_{2013}=1$ và $a_{2014}=43$, $a_{2015}=11$, $a_{2016}=3$, $a_{2017}=3$, $a_{2018}=5$ (đều là số lẻ).

Khi đó vế phải bằng $43^2+11^2+3^2+3^2+5^2=1849+121+9+9+25=2013$, vế trái bằng $2013\cdot1^2=2013$, thỏa mãn.

Vậy giá trị nhỏ nhất của $n$ là $2018$.

=== PA.24@p241
- bai: 24 · y: - · trang: 241 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040102
- cong_cu: hiệu hai luỹ thừa cùng số mũ chia hết cho hiệu hai cơ số · phản chứng · xét số dư (mod 23)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng kết luận của sách in "$2^9+29^b$" thay vì "$2^a+29^b$" (lỗi in, không ảnh hưởng lập luận).
## DE
Chứng minh rằng $2^a+29^b$ không chia hết cho $23$ với mọi $a,b$ là các số tự nhiên.
## SACH
Giả sử $2^a+29^b\vdots23$.

Ta có $4^b(2^a+29^b)\vdots23\Rightarrow(2^{a+2b}+116^b)\vdots23$.

Mà $(116^b-1^b)\vdots(116-1)$, $(116-1)=115\vdots23$.

Do đó ta có: $2^{a+2b}+1\vdots23$ (1)

Đặt $a+2b=11n+r$ ($n\in\mathbb{N}$; $r\in\{0;1;2;\dots;10\}$).

Ta có: $2^{11n+r}+1=2^r(2^{11n}-1)+2^r+1$.

$2^{11}-1=2047\vdots23$ nên $2^{11n}-1\vdots23$.

$2^r+1\not\vdots23$ với $r\in\{0;1;2;\dots;10\}$.

Do đó $2^{a+2b}+1\not\vdots23$ (2)

(1) và (2) mâu thuẫn.

Điều giả sử $2^a+29^b\vdots23$ là sai.

Vậy $2^9+29^b$ không chia hết cho 23 với mọi $a,b$ là các số tự nhiên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân hai vế với $4^b$ để $29^b$ biến thành $116^b$, số hơn $1$ một bội của $23$; khi đó chỉ còn lại luỹ thừa của $2$, mà luỹ thừa của $2$ chia $23$ có số dư lặp lại sau mỗi 11 số mũ.

**Bước 1.** Giả sử $2^a+29^b$ chia hết cho $23$ rồi nhân với $4^b$ để thu được biểu thức dạng $2^{a+2b}+116^b$.

**Bước 2.** Dùng tính chất $116^b-1$ chia hết cho $116-1=115$, mà $115$ chia hết cho $23$, để suy ra $2^{a+2b}+1$ chia hết cho $23$.

**Bước 3.** Viết số mũ $a+2b=11n+r$ với $0\le r\le10$ và dùng $2^{11}-1=2047$ chia hết cho $23$ để chuyển bài toán sang xét $2^r+1$.

**Bước 4.** Kiểm tra từng giá trị của $r$ từ $0$ đến $10$ để thấy $2^r+1$ không chia hết cho $23$, từ đó mâu thuẫn với giả sử ban đầu.

**Chú ý:** Số $11$ được chọn vì $2^{11}\equiv1\pmod{23}$; gặp bài "$m^a+k^b$ không chia hết cho một số nguyên tố" hãy tìm chu kì của luỹ thừa modulo số đó trước.

**Phần 2. Trình bày**

Giả sử tồn tại $a,b\in\mathbb{N}$ để $2^a+29^b\vdots23$.

Khi đó $4^b(2^a+29^b)=2^{a+2b}+116^b\vdots23$.

Vì $116^b-1^b\vdots116-1=115$ và $115\vdots23$ nên $116^b-1\vdots23$.

Suy ra $2^{a+2b}+1=(2^{a+2b}+116^b)-(116^b-1)\vdots23$. (1)

Đặt $a+2b=11n+r$ với $n\in\mathbb{N}$, $r\in\{0;1;\dots;10\}$. Khi đó

$2^{a+2b}+1=2^r(2^{11n}-1)+(2^r+1)$.

Vì $2^{11n}-1\vdots2^{11}-1=2047=23\cdot89$ nên $2^r(2^{11n}-1)\vdots23$.

Với $r=0;1;\dots;10$ thì $2^r+1$ lần lượt bằng $2;3;5;9;17;33;65;129;257;513;1025$, chia $23$ lần lượt dư $2;3;5;9;17;10;19;14;4;7;13$, không số nào chia hết cho $23$.

Do đó $2^{a+2b}+1\not\vdots23$. (2)

(1) và (2) mâu thuẫn, nên điều giả sử sai.

Vậy $2^a+29^b$ không chia hết cho $23$ với mọi $a,b\in\mathbb{N}$.

=== PA.25@p242
- bai: 25 · y: - · trang: 242 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040202
- cong_cu: ước dương của một số · phân tích ra thừa số nguyên tố · tính chia hết · số chính phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng đầu lời giải ý a) trong ảnh in "287 = 1.7 + 4.1" (chép đúng như in); đúng phải là $287=7\cdot41$. Cuối ý b) sách in "$=-28=8$" (mất dấu $\ne$; đúng là $-28\ne8$). Đề ý c) in "là các số điều hòa" (nên là "là số điều hòa"). Lời giải kho soạn theo nghĩa đúng. Nhóm: phân vân giữa 040201 và 040202.
## DE
Số nguyên dương $n$ được gọi là số điều hòa nếu như tổng các bình phương của các ước dương của nó (kể cả $1$ và $n$) đúng bằng $(n+3)^2$.

a) Chứng minh rằng số $287$ là số điều hòa.

b) Chứng minh rằng số $n=p^3$ ($p$ nguyên tố) không phải số điều hòa.

c) Chứng minh rằng nếu số $n=pq$ ($p,q$ là các số nguyên tố khác nhau) là số điều hòa thì $n+2$ là số chính phương.
## SACH
a) $287=1.7+4.1$

Ta có $(287+3)^2=290^2=84100$; $1^2+7^2+41^2+287^2=84100$

Do đó $(287+3)^2=1^2+7^2+41^2+287^2$

Vậy số $287$ là số điều hòa.

b) Giả sử số $n=p^3$ là số điều hòa.

Vì $p$ là số nguyên tố nên các ước dương của $n=p^3$ là $1$, $p$, $p^2$, $p^3$

Ta có: $(p^3+3)^2=1^2+p^2+(p^2)^2+(p^3)^2$

$\Leftrightarrow p^6+6p^3+9=1+p^2+p^4+p^6$

$\Leftrightarrow p^4-6p^3+p^2=8$

$\Leftrightarrow p(p^3-6p^2+p)=8$ $(*)$

Do đó: $8\vdots p$. Nên $p=2$. Khi đó:

$p(p^3-6p^2+p)=2(2^3-6\cdot2^2+2)=-28=8$

Do vậy $(*)$ không xảy ra với mọi $p$ nguyên tố

Điều giả sử trên sai!

Vậy $n=p^3$ không phải là số điều hòa

c) $n=pq$ là số điều hòa, $p$ và $q$ là các số nguyên tố khác nhau. Do đó:

$(pq+3)^2=1^2+p^2+q^2+(pq)^2\Leftrightarrow4(pq+2)=(p-q)^2$

Ta có $(p-q)^2\vdots4$. Nên $p-q\vdots2$

Do đó $\dfrac{p-q}{2}$ là số nguyên

Vậy $n+2=pq+2=\left(\dfrac{p-q}{2}\right)^2$ là số chính phương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn dùng định nghĩa số điều hòa phải biết đúng các ước dương của $n$; với $n=287$, $n=p^3$, $n=pq$ ($p,q$ nguyên tố) các ước này liệt kê được ngay, rồi so sánh hai vế của đẳng thức.

**Bước 1.** Phân tích $287$ thành tích các thừa số nguyên tố, liệt kê bốn ước dương rồi tính tổng bình phương của chúng và so với $290^2$.

**Bước 2.** Với $n=p^3$, liệt kê các ước dương $1,p,p^2,p^3$, giả sử $n$ là số điều hòa rồi rút gọn đẳng thức về một phương trình theo $p$.

**Bước 3.** Từ phương trình đó suy ra $p$ là ước của $8$, nên $p$ chỉ có thể là một giá trị nguyên tố duy nhất; thử giá trị ấy để thấy mâu thuẫn.

**Bước 4.** Với $n=pq$, các ước dương là $1,p,q,pq$; khai triển đẳng thức điều hòa, rút gọn để được một hệ thức giữa $(p-q)^2$ và $pq+2$.

**Bước 5.** Từ hệ thức đó chứng tỏ $p-q$ chẵn rồi viết $pq+2$ dưới dạng bình phương của một số nguyên.

**Chú ý:** Ở ý b) thử $p=2$ xong là hết trường hợp vì $p$ nguyên tố chia hết $8$; nhớ chỉ rõ vế trái và vế phải của $(*)$ khác nhau.

**Phần 2. Trình bày**

a) Ta có $287=7\cdot41$ với $7$ và $41$ là các số nguyên tố, nên các ước dương của $287$ là $1;7;41;287$.

Tổng bình phương các ước: $1^2+7^2+41^2+287^2=1+49+1681+82369=84100$.

Mặt khác $(287+3)^2=290^2=84100$.

Vậy $(287+3)^2=1^2+7^2+41^2+287^2$, tức là $287$ là số điều hòa.

b) Giả sử $n=p^3$ ($p$ nguyên tố) là số điều hòa. Các ước dương của $p^3$ là $1;p;p^2;p^3$ nên

$(p^3+3)^2=1^2+p^2+(p^2)^2+(p^3)^2$

$\Leftrightarrow p^6+6p^3+9=1+p^2+p^4+p^6$

$\Leftrightarrow p^4-6p^3+p^2=8$

$\Leftrightarrow p(p^3-6p^2+p)=8$. $(*)$

Do đó $8\vdots p$, mà $p$ nguyên tố nên $p=2$.

Khi $p=2$: vế trái của $(*)$ bằng $2(2^3-6\cdot2^2+2)=2\cdot(-14)=-28\ne8$.

Vậy $(*)$ không xảy ra với mọi $p$ nguyên tố, điều giả sử là sai, tức là $n=p^3$ không phải số điều hòa.

c) Vì $p,q$ là các số nguyên tố khác nhau nên các ước dương của $n=pq$ là $1;p;q;pq$.

Do $n$ là số điều hòa nên $(pq+3)^2=1^2+p^2+q^2+(pq)^2$

$\Leftrightarrow p^2q^2+6pq+9=1+p^2+q^2+p^2q^2$

$\Leftrightarrow p^2+q^2-6pq=8$

$\Leftrightarrow(p-q)^2=4pq+8=4(pq+2)$.

Suy ra $(p-q)^2\vdots4$, nên $p-q\vdots2$, tức là $\dfrac{p-q}{2}$ là số nguyên.

Vậy $n+2=pq+2=\left(\dfrac{p-q}{2}\right)^2$ là số chính phương.

=== PA.26@p243
- bai: 26 · y: - · trang: 243 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: làm trội theo điều kiện ràng buộc · hằng đẳng thức bình phương một hiệu
- kiem: khong
- ket_qua_sach: 1
- dap_an: $1$, đạt khi $x=y=z=\dfrac{1}{\sqrt{3}}$ hoặc $x=y=z=-\dfrac{1}{\sqrt{3}}$
- ghi_chu_nghi:
## DE
Cho $x,y,z$ thỏa mãn: $x^2+y^2+z^2=1$.

Tìm giá trị lớn nhất của biểu thức:

$M=xy+yz+zx+\dfrac{1}{2}[x^2(y-z)^2+y^2(z-x)^2+z^2(x-y)^2]$
## SACH
Ta có: $x^2+y^2+z^2=1$. Do đó $x^2\le1$, $y^2\le1$; $z^2\le1$

Nên: $M=xy+yz+zx+\dfrac12[x^2(y-z)^2+y^2(z-x)^2+z^2(x-y)^2]$

$\le xy+yz+zx+\dfrac12[(y-z)^2+(z-x)^2+(x-y)^2]=x^2+y^2+z^2=1$

$M\le1$

Dấu "=" xảy ra $\Leftrightarrow x=y=z$

Vậy giá trị lớn nhất của $M$ là $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x^2+y^2+z^2=1$ cho mỗi bình phương không vượt quá $1$, nên mỗi hạng tử trong ngoặc vuông bị chặn bởi bình phương hiệu tương ứng; ba bình phương hiệu cộng với $xy+yz+zx$ lại gom được đúng $x^2+y^2+z^2$.

**Bước 1.** Từ giả thiết nhận xét $x^2,y^2,z^2\le1$, rồi dùng nó để làm trội từng hạng tử trong ngoặc vuông (nhớ các bình phương hiệu không âm).

**Bước 2.** Thay ba hạng tử bằng các cận trên vừa có để được $M$ nhỏ hơn hoặc bằng một biểu thức đối xứng đơn giản hơn.

**Bước 3.** Khai triển ba bình phương hiệu rồi cộng với $xy+yz+zx$ để cận trên chỉ còn lại $x^2+y^2+z^2$ và dùng giả thiết để tính nó.

**Bước 4.** Tìm bộ giá trị làm mọi dấu "=" xảy ra để khẳng định cận trên đó thật sự đạt được.

**Chú ý:** Muốn kết luận giá trị lớn nhất phải có bộ $(x;y;z)$ cụ thể thỏa giả thiết mà đạt dấu bằng; chỉ chứng minh $M\le$ hằng số thì mới là cận trên.

**Phần 2. Trình bày**

Từ $x^2+y^2+z^2=1$ suy ra $x^2\le1$, $y^2\le1$, $z^2\le1$.

Vì $(y-z)^2\ge0$ nên $x^2(y-z)^2\le(y-z)^2$; tương tự $y^2(z-x)^2\le(z-x)^2$ và $z^2(x-y)^2\le(x-y)^2$.

Do đó $M\le xy+yz+zx+\dfrac12[(y-z)^2+(z-x)^2+(x-y)^2]$

$=xy+yz+zx+\dfrac12(2x^2+2y^2+2z^2-2xy-2yz-2zx)$

$=x^2+y^2+z^2=1$.

Dấu "=" xảy ra khi $x=y=z$: khi đó $3x^2=1$, cả ba hiệu bằng $0$ nên các hạng tử trong ngoặc vuông đều bằng $0$ và $M=xy+yz+zx=3x^2=1$.

Vậy giá trị lớn nhất của $M$ là $1$.

=== PA.27@p243
- bai: 27 · y: - · trang: 243 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040102
- cong_cu: khai triển $(a-1)^5$ · hiệu hai luỹ thừa cùng số mũ chia hết cho hiệu hai cơ số · chữ số tận cùng (chia cho 1000)
- kiem: khong
- ket_qua_sach: 192
- dap_an: $192$
- ghi_chu_nghi: Dòng giải thích cuối trong ảnh in "$(125^k-1)^{40}-(-1)^{40}\vdots125k$" (lỗi in nhỏ, đúng là $(125k-1)$); không ảnh hưởng. Đã kiểm $2^{2013}\bmod1000=192$.
## DE
Tìm ba chữ số tận cùng của số $2^{2013}$.
## SACH
Ta có: $(a-1)^5=a^5-5a^4+10a^3-10a^2+5a-1$

Do đó, nếu $a\vdots25$ thì $(a-1)^5$ chia cho $125$ dư $-1$.

Nên $2^{50}=(2^{10})^5=1024^5=(25\cdot41-1)^5$ chia cho $125$ dư $-1$.

Ta có $2^{2013}=(2^{50})^{40}\cdot2^{13}=(125k-1)^{40}\cdot2^{13}$

$=[(125k-1)^{40}-(-1)^{40}]\cdot2^{13}+2^{13}=[(125k-1)^{40}-(-1)^{40}]\cdot2^{13}+8192$.

chia cho $1000$ dư $192$.

(vì $[(125k-1)^{40}-(-1)^{40}]\vdots[(125k-1)-(-1)]$ hay $(125^k-1)^{40}-(-1)^{40}\vdots125k$, $2^{13}\vdots8$. Nên $[(125k-1)^{40}-(-1)^{40}]\cdot2^{13}$ chia hết cho $1000$).

Vậy $2^{2013}$ có ba chữ số tận cùng $192$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba chữ số tận cùng là số dư khi chia cho $1000=8\cdot125$; vì $2^{10}=1024=1025-1$ với $1025\vdots25$, nên $2^{50}$ chia $125$ dư $-1$, từ đó $2^{2000}$ gần như "biến mất" khi chia cho $125$.

**Bước 1.** Khai triển $(a-1)^5$ để chỉ ra rằng khi $a$ chia hết cho $25$ thì $(a-1)^5$ chia $125$ dư $-1$.

**Bước 2.** Viết $2^{10}=1025-1$ rồi nâng lên luỹ thừa $5$ để biết dạng của $2^{50}$ khi chia cho $125$.

**Bước 3.** Tách $2^{2013}=(2^{50})^{40}\cdot2^{13}$ và dùng tính chất hiệu hai luỹ thừa cùng số mũ chia hết cho hiệu hai cơ số để biến $(2^{50})^{40}$ thành $1$ cộng một bội của $125$.

**Bước 4.** Chứng minh phần bội đó nhân với $2^{13}$ chia hết cho cả $8$ lẫn $125$, tức chia hết cho $1000$, rồi đọc ba chữ số tận cùng từ phần còn lại $2^{13}$.

**Chú ý:** Có thể kiểm bằng đồng dư: $2^{2013}\equiv0\pmod8$ và $2^{2013}\equiv2^{13}=8192\equiv67\pmod{125}$, trong các số có ba chữ số chỉ $192$ thỏa cả hai.

**Phần 2. Trình bày**

Với $a\vdots25$ ta có $(a-1)^5=a^5-5a^4+10a^3-10a^2+5a-1$, trong đó $a^5;5a^4;10a^3;10a^2;5a$ đều chia hết cho $125$ (vì $a^2\vdots625$ và $5a\vdots125$). Vậy $(a-1)^5$ chia $125$ dư $-1$.

Vì $2^{10}=1024=25\cdot41-1$ và $25\cdot41\vdots25$ nên $2^{50}=(2^{10})^5=(25\cdot41-1)^5$ chia $125$ dư $-1$, tức $2^{50}=125k-1$ ($k\in\mathbb{N}^*$).

Khi đó $2^{2013}=(2^{50})^{40}\cdot2^{13}=(125k-1)^{40}\cdot2^{13}$

$=[(125k-1)^{40}-1]\cdot2^{13}+2^{13}$.

Vì $(125k-1)^{40}-(-1)^{40}\vdots(125k-1)-(-1)=125k$ nên $(125k-1)^{40}-1\vdots125$; lại có $2^{13}\vdots8$.

Do đó $[(125k-1)^{40}-1]\cdot2^{13}\vdots125\cdot8=1000$.

Suy ra $2^{2013}=1000q+2^{13}=1000q+8192=1000(q+8)+192$ ($q\in\mathbb{N}$).

Vậy ba chữ số tận cùng của $2^{2013}$ là $192$.

=== PA.28@p243
- bai: 28 · y: - · trang: 243 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: đặt ẩn phụ $a=\dfrac{x}{y+z}$ · bất đẳng thức $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách in "$c+a+b+2=\dfrac1{abc}$" (sai; đúng là $\dfrac1c+\dfrac1a+\dfrac1b+2=\dfrac1{abc}$) và đặt $a=\dfrac{x}{y+z},\dots$ với $x+y+z=1$ mà không giải thích vì sao đặt được. Lời giải kho bổ sung: đặt $x=\dfrac{a}{1+a},\dots$ rồi chứng minh $x+y+z=1$.
## DE
Cho $a,b,c>0$ thỏa mãn: $ab+bc+ca+2abc=1$

Chứng minh rằng: $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\ge4(a+b+c)$
## SACH
Ta có: $ab+bc+ca+2abc=1$ và $a,b,c>0$

Do đó: $c+a+b+2=\dfrac{1}{abc}$

Đặt $a=\dfrac{x}{y+z}$, $b=\dfrac{y}{z+x}$, $c=\dfrac{z}{x+y}$ với $x,y,z>0$ và $x+y+z=1$.

Do vậy: $\dfrac{y+z}{x}+\dfrac{z+x}{y}+\dfrac{x+y}{z}\ge4\left(\dfrac{x}{y+z}+\dfrac{y}{z+x}+\dfrac{z}{x+y}\right)$

Mà $(x+y)^2\ge4xy$. Nên $\dfrac1x+\dfrac1y\ge\dfrac{4}{x+y}$

Suy ra: $\dfrac zx+\dfrac zy\ge\dfrac{4z}{x+y}$ (1)

Tương tự: $\dfrac xy+\dfrac xz\ge\dfrac{4x}{y+z}$ (2)

$\dfrac yx+\dfrac yz\ge\dfrac{4y}{x+z}$ (3)

Từ (1), (2), (3) ta có điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $ab+bc+ca+2abc=1$ viết được thành $\dfrac{1}{1+a}+\dfrac{1}{1+b}+\dfrac{1}{1+c}=2$; dạng này gợi phép đặt $a=\dfrac{x}{y+z}$ với $x+y+z=1$ để đưa bài toán về bất đẳng thức đối xứng đơn giản hơn.

**Bước 1.** Quy đồng tổng ba phân số $\dfrac{1}{1+a}$, $\dfrac{1}{1+b}$, $\dfrac{1}{1+c}$ và dùng điều kiện đề bài để chứng tỏ tổng đó bằng $2$.

**Bước 2.** Đặt $x=\dfrac{a}{1+a}$, $y=\dfrac{b}{1+b}$, $z=\dfrac{c}{1+c}$ rồi chứng minh $x+y+z=1$ và $a=\dfrac{x}{y+z}$, $b=\dfrac{y}{z+x}$, $c=\dfrac{z}{x+y}$.

**Bước 3.** Viết lại bất đẳng thức cần chứng minh theo $x,y,z$: vế trái trở thành tổng các phân số có tử là $y+z$, $z+x$, $x+y$.

**Bước 4.** Dùng bất đẳng thức $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$ (suy từ $(x+y)^2\ge4xy$) rồi nhân với $z$, viết tương tự cho hai cặp còn lại và cộng ba bất đẳng thức.

**Chú ý:** Bất đẳng thức $\dfrac1x+\dfrac1y\ge\dfrac4{x+y}$ rất hay dùng, dấu "=" khi $x=y$.

**Phần 2. Trình bày**

Ta có $\dfrac{1}{1+a}+\dfrac{1}{1+b}+\dfrac{1}{1+c}=\dfrac{3+2(a+b+c)+(ab+bc+ca)}{1+(a+b+c)+(ab+bc+ca)+abc}$.

Hiệu giữa tử và hai lần mẫu là $1-(ab+bc+ca)-2abc=0$ (theo giả thiết), nên $\dfrac{1}{1+a}+\dfrac{1}{1+b}+\dfrac{1}{1+c}=2$.

Đặt $x=\dfrac{a}{1+a}$, $y=\dfrac{b}{1+b}$, $z=\dfrac{c}{1+c}$ thì $x,y,z>0$ và

$x+y+z=3-\left(\dfrac{1}{1+a}+\dfrac{1}{1+b}+\dfrac{1}{1+c}\right)=1$.

Khi đó $y+z=1-x=\dfrac{1}{1+a}$, nên $\dfrac{x}{y+z}=\dfrac{a}{1+a}\cdot(1+a)=a$. Tương tự $b=\dfrac{y}{z+x}$, $c=\dfrac{z}{x+y}$.

Bất đẳng thức cần chứng minh trở thành

$\dfrac{y+z}{x}+\dfrac{z+x}{y}+\dfrac{x+y}{z}\ge4\left(\dfrac{x}{y+z}+\dfrac{y}{z+x}+\dfrac{z}{x+y}\right)$.

Vì $(x+y)^2\ge4xy$ nên $\dfrac1x+\dfrac1y\ge\dfrac{4}{x+y}$, suy ra $\dfrac zx+\dfrac zy\ge\dfrac{4z}{x+y}$. (1)

Tương tự $\dfrac xy+\dfrac xz\ge\dfrac{4x}{y+z}$ (2) và $\dfrac yz+\dfrac yx\ge\dfrac{4y}{z+x}$ (3).

Cộng (1), (2), (3) vế theo vế, vế trái bằng $\dfrac{y+z}{x}+\dfrac{z+x}{y}+\dfrac{x+y}{z}$, ta được bất đẳng thức trên.

Vậy $\dfrac1a+\dfrac1b+\dfrac1c\ge4(a+b+c)$. Dấu "=" xảy ra khi $x=y=z=\dfrac13$, tức $a=b=c=\dfrac12$.

=== PA.29@p244
- bai: 29 · y: - · trang: 244 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: thêm bớt để phân tích mẫu $k^4+k^2+1$ · tách thành hiệu hai phân số (khử liên tiếp)
- kiem: khong
- ket_qua_sach: \dfrac{2027091}{4054183}
- dap_an: $\dfrac{2027091}{4054183}$
- ghi_chu_nghi: Sách in số hạng cuối của đề là $\dfrac{2013}{1+2013^2+2014^4}$; lời giải của sách (số hạng tổng quát $\dfrac{k}{1+k^2+k^4}$, kết thúc ở $2013\cdot2014+1$) chỉ khớp với $2013^4$. Kho ghi $2013^4$.
## DE
Tính tổng:

$M=\dfrac{1}{1+1^2+1^4}+\dfrac{2}{1+2^2+2^4}+\dfrac{3}{1+3^2+3^4}+\dots+\dfrac{2013}{1+2013^2+2013^4}$
## SACH
Ta có: $\dfrac12\left[\dfrac{1}{k(k-1)+1}-\dfrac{1}{k(k+1)+1}\right]=\dfrac12\cdot\dfrac{k(k+1)+1-k(k-1)-1}{(k^2+1)^2-k^2}$

$=\dfrac12\cdot\dfrac{k^2+k+1-k^2+k-1}{k^4+k^2+1}=\dfrac{k}{1+k^2+k^4}$

Vậy $\dfrac{k}{1+k^2+k^4}=\dfrac12\left[\dfrac{1}{k(k-1)+1}-\dfrac{1}{k(k+1)+1}\right]$

Do vậy:

$M=\dfrac12\left[\dfrac{1}{1\cdot0+1}-\dfrac{1}{1\cdot2+1}+\dfrac{1}{2\cdot1+1}-\dfrac{1}{2\cdot3+1}+\dots+\dfrac{1}{2013\cdot2012+1}-\dfrac{1}{2013\cdot2014+1}\right]$

$=\dfrac12\left(1-\dfrac{1}{2013\cdot2014+1}\right)=\dfrac12\left(1-\dfrac{1}{4054183}\right)$

$=\dfrac12\cdot\dfrac{4054182}{4054183}=\dfrac{2027091}{4054183}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu số $1+k^2+k^4$ thêm bớt $k^2$ thành hiệu hai bình phương nên phân tích được thành tích hai nhân tử, và hai nhân tử đó hơn kém nhau $2k$ — đúng gấp đôi tử số — nên mỗi số hạng là một hiệu của hai phân số kề nhau.

**Bước 1.** Phân tích mẫu số tổng quát $1+k^2+k^4$ thành tích hai nhân tử bằng cách thêm bớt $k^2$ để xuất hiện hiệu hai bình phương.

**Bước 2.** Tính hiệu $\dfrac{1}{k(k-1)+1}-\dfrac{1}{k(k+1)+1}$ để thấy nó bằng $\dfrac{2k}{1+k^2+k^4}$, từ đó viết số hạng thứ $k$ dưới dạng một hiệu hai phân số.

**Bước 3.** Cộng các số hạng với $k$ chạy từ $1$ đến $2013$ và nhận ra mẫu thứ hai của số hạng $k$ trùng mẫu thứ nhất của số hạng $k+1$, nên các phân số triệt tiêu liên tiếp.

**Bước 4.** Tính phần còn lại gồm phân số đầu tiên và phân số cuối cùng rồi rút gọn về phân số tối giản.

**Chú ý:** Dạng $k^4+k^2+1=(k^2+k+1)(k^2-k+1)$ rất hay gặp; nhớ phép thêm bớt $k^2$ này.

**Phần 2. Trình bày**

Với mỗi số nguyên dương $k$:

$1+k^2+k^4=(k^4+2k^2+1)-k^2=(k^2+1)^2-k^2=(k^2-k+1)(k^2+k+1)$,

trong đó $k^2-k+1=k(k-1)+1$ và $k^2+k+1=k(k+1)+1$. Do đó

$\dfrac{k}{1+k^2+k^4}=\dfrac12\cdot\dfrac{(k^2+k+1)-(k^2-k+1)}{(k^2-k+1)(k^2+k+1)}=\dfrac12\left[\dfrac{1}{k(k-1)+1}-\dfrac{1}{k(k+1)+1}\right]$.

Cho $k=1;2;\dots;2013$ rồi cộng lại (số hạng cuối là $\dfrac{2013}{1+2013^2+2013^4}$):

$M=\dfrac12\left[\dfrac{1}{1\cdot0+1}-\dfrac{1}{1\cdot2+1}+\dfrac{1}{2\cdot1+1}-\dfrac{1}{2\cdot3+1}+\dots+\dfrac{1}{2013\cdot2012+1}-\dfrac{1}{2013\cdot2014+1}\right]$

$=\dfrac12\left(1-\dfrac{1}{2013\cdot2014+1}\right)$

$=\dfrac12\left(1-\dfrac{1}{4054183}\right)$

$=\dfrac12\cdot\dfrac{4054182}{4054183}=\dfrac{2027091}{4054183}$.

=== PA.30@p245
- bai: 30 · y: - · trang: 245 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: đặt ẩn phụ · phân tích thành nhân tử (tách hạng tử) · bình phương không âm
- kiem: khong
- ket_qua_sach: -3
- dap_an: $-3$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của biểu thức:

$M=\left(x+\dfrac{1}{x}\right)^3-3\left(x+\dfrac{1}{x}\right)^2+1$ với $x>0$
## SACH
Đặt $y=x+\dfrac1x$ ($y>0$)

Ta có: $M=y^3-3y^2+1=y(y^2-4y+4)+(y^2-4y+4)-3$

$=(y-2)^2(y+1)-3\ge-3$

Dấu "=" xảy ra $\Leftrightarrow y=2\Leftrightarrow x+\dfrac1x=2\Leftrightarrow x=1$ (thích hợp)

Vậy giá trị nhỏ nhất của $M$ là $-3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $M$ chỉ phụ thuộc vào $y=x+\dfrac1x$, nên đặt ẩn phụ để $M$ là một đa thức bậc ba theo $y$; rồi ghép sao cho xuất hiện nhân tử $(y-2)^2$ cộng với một hằng số, vì $y=2$ chính là giá trị mà $x+\dfrac1x$ đạt ở $x=1$.

**Bước 1.** Đặt $y=x+\dfrac1x$, chú ý $y>0$ khi $x>0$, rồi viết $M$ thành đa thức bậc ba theo $y$.

**Bước 2.** Tách $y^3-3y^2+1$ thành các nhóm có chứa bình phương $y^2-4y+4$ rồi đặt nhân tử chung để được $(y-2)^2$ nhân một nhân tử, cộng một hằng số.

**Bước 3.** Đánh giá phần chứa $(y-2)^2$ không âm vì $y>0$, từ đó suy ra cận dưới của $M$.

**Bước 4.** Giải $y=2$ để tìm $x$, kiểm tra $x>0$ để khẳng định cận dưới đó thật sự đạt được.

**Chú ý:** Phải kiểm tra giá trị $y$ tìm được ứng với một $x$ thỏa điều kiện của đề; ở đây $x+\dfrac1x=2\Leftrightarrow(x-1)^2=0$ nên $x=1>0$ thỏa.

**Phần 2. Trình bày**

Đặt $y=x+\dfrac1x$; vì $x>0$ nên $y>0$.

$M=y^3-3y^2+1$

$=y(y^2-4y+4)+(y^2-4y+4)-3$

$=(y-2)^2(y+1)-3$

Vì $(y-2)^2\ge0$ và $y+1>0$ nên $M\ge-3$.

Dấu "=" xảy ra khi $y=2$, tức $x+\dfrac1x=2\Leftrightarrow(x-1)^2=0\Leftrightarrow x=1$ (thỏa $x>0$).

Vậy giá trị nhỏ nhất của $M$ là $-3$, đạt khi $x=1$.

=== PA.31@p245
- bai: 31 · y: - · trang: 245 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: phân tích thành nhân tử · dùng điều kiện $abcd=1$ để thay $1$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "tồn tại hai số trong bốn số đó bằng $1$" — mệnh đề này sai: $a=2$, $b=\dfrac12$, $c=3$, $d=\dfrac13$ thỏa cả hai giả thiết mà không số nào bằng $1$. Lời giải của sách chứng minh $ab=1$ hoặc $bc=1$ hoặc $bd=1$, tức hai số có TÍCH bằng $1$. Kho ghi "có tích bằng $1$" — CHỜ CEO quyết.
## DE
Cho bốn số $a,b,c,d$ khác $0$ thỏa mãn $abcd=1$ và:

$a+b+c+d=\dfrac1a+\dfrac1b+\dfrac1c+\dfrac1d$

Chứng minh rằng tồn tại hai số trong bốn số đó có tích bằng $1$.
## SACH
Ta có: $abcd=1$ và $a+b+c+d=\dfrac1a+\dfrac1b+\dfrac1c+\dfrac1d$

Do đó: $a+b-\left(\dfrac1a+\dfrac1b\right)+c+d-\left(\dfrac1c+\dfrac1d\right)=0$

$\Leftrightarrow(a+b)\left(1-\dfrac{1}{ab}\right)+(c+d)\left(1-\dfrac{1}{cd}\right)=0$

$\Leftrightarrow\dfrac{(a+b)(ab-1)}{ab}+(c+d)(1-ab)=0\Leftrightarrow(ab-1)\left(\dfrac{a+b}{ab}-c-d\right)=0$

$\Leftrightarrow(ab-1)(a+b-abc-abd)=0\Leftrightarrow(ab-1)[a(1-bc)+b(1-ad)]=0$

$\Leftrightarrow(ab-1)[a(1-bc)+b(abcd-ad)]=0$

$\Leftrightarrow(ab-1)(1-bc)(a-abd)=0$

$\Leftrightarrow a(ab-1)(1-bc)(1-bd)=0$

$\Leftrightarrow ab-1=0$ hoặc $1-bc=0$ hoặc $1-bd=0$

$\Leftrightarrow ab=1$ hoặc $bc=1$ hoặc $bd=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển hết sang một vế rồi ghép $a+b-\left(\dfrac1a+\dfrac1b\right)$ và $c+d-\left(\dfrac1c+\dfrac1d\right)$; điều kiện $abcd=1$ cho $\dfrac1{cd}=ab$, nhờ đó hai nhóm cùng chứa nhân tử $ab-1$ và cả vế trái phân tích được thành tích.

**Bước 1.** Chuyển các phân số sang vế trái rồi ghép $a$ với $b$, $c$ với $d$ để đặt nhân tử chung $(a+b)$ và $(c+d)$.

**Bước 2.** Dùng $abcd=1$ đổi $\dfrac1{cd}$ thành $ab$ để hai nhóm cùng chứa nhân tử $ab-1$, rồi đặt nhân tử chung đó ra ngoài.

**Bước 3.** Quy đồng thừa số còn lại, bỏ mẫu $ab\ne0$, rồi nhóm thành $a(1-bc)+b(1-ad)$ và thay $1=abcd$ vào nhóm thứ hai để lộ nhân tử $1-bc$.

**Bước 4.** Viết vế trái thành tích $a(ab-1)(1-bc)(1-bd)$, kết luận có một thừa số bằng $0$ và chỉ ra cặp số có tích bằng $1$.

**Chú ý:** Từ $ab=1$ và $abcd=1$ suy ra $cd=1$; tương tự $bc=1$ kéo theo $ad=1$ và $bd=1$ kéo theo $ac=1$.

**Phần 2. Trình bày**

Từ giả thiết $a+b+c+d=\dfrac1a+\dfrac1b+\dfrac1c+\dfrac1d$ ta có

$a+b-\left(\dfrac1a+\dfrac1b\right)+c+d-\left(\dfrac1c+\dfrac1d\right)=0$

$\Leftrightarrow(a+b)\left(1-\dfrac{1}{ab}\right)+(c+d)\left(1-\dfrac{1}{cd}\right)=0$

$\Leftrightarrow\dfrac{(a+b)(ab-1)}{ab}+(c+d)(1-ab)=0$ (vì $abcd=1$ nên $\dfrac{1}{cd}=ab$)

$\Leftrightarrow(ab-1)\left[\dfrac{a+b}{ab}-(c+d)\right]=0$

$\Leftrightarrow(ab-1)(a+b-abc-abd)=0$ (nhân với $ab\ne0$)

$\Leftrightarrow(ab-1)[a(1-bc)+b(1-ad)]=0$

$\Leftrightarrow(ab-1)[a(1-bc)+b(abcd-ad)]=0$ (vì $abcd=1$)

$\Leftrightarrow(ab-1)[a(1-bc)-abd(1-bc)]=0$

$\Leftrightarrow a(ab-1)(1-bc)(1-bd)=0$.

Vì $a\ne0$ nên $ab=1$ hoặc $bc=1$ hoặc $bd=1$.

Vậy trong bốn số tồn tại hai số có tích bằng $1$ (nếu $ab=1$ thì $cd=1$; nếu $bc=1$ thì $ad=1$; nếu $bd=1$ thì $ac=1$).

=== PA.32@p245
- bai: 32 · y: - · trang: 245 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: đặt $abc=\dfrac pq$ (phân số tối giản) · nguyên tố cùng nhau · liệt kê ước của $8$
- kiem: khong
- ket_qua_sach: \dfrac{259}{4}
- dap_an: $\dfrac{259}{4}$, đạt khi $a=b=\dfrac12$, $c=4$
- ghi_chu_nghi: Sách in "$\dfrac pq\left(1+\dfrac pq\right)^3$" (đúng là $\dfrac pq\left(1+\dfrac qp\right)^3$) và ở dòng cuối in "$M=a+b^2=c^3$" (đúng là $M=a+b^2+c^3$); sách ghi giá trị lớn nhất là $64\dfrac34=\dfrac{259}{4}$. Lời giải kho sửa các chỗ này. Nhóm: bài số học nhưng yêu cầu cuối là tìm giá trị lớn nhất.
## DE
Cho $a,b,c$ là các số hữu tỉ dương thỏa mãn $a+\dfrac{1}{bc}$; $b+\dfrac{1}{ca}$; $c+\dfrac{1}{ab}$ là những số nguyên. Tìm giá trị lớn nhất của biểu thức:

$M=a+b^2+c^3$
## SACH
Đặt $abc=\dfrac pq$ với $p,q\in\mathbb{N}^*$ và ƯCLN$(p,q)=1$.

Ta có $\left(a+\dfrac1{bc}\right)\left(b+\dfrac1{ca}\right)\left(c+\dfrac1{ab}\right)=a\left(1+\dfrac{1}{abc}\right)b\left(1+\dfrac{1}{abc}\right)c\left(1+\dfrac{1}{abc}\right)$

$=abc\left(1+\dfrac{1}{abc}\right)^3=\dfrac pq\left(1+\dfrac pq\right)^3=\dfrac{(p+q)^3}{p^2q}$.

Ta có: $\dfrac{(p+q)^3}{p^2q}$ là số nguyên.

Do đó $(p+q)^3\vdots(p^2q)$

Vì ƯCLN$(p,q)=1$ nên ƯCLN$(p+q,q)=$ ƯCLN$(p+q,q)=1$

Suy ra $p=q=1$

Nên $a+\dfrac1{bc}=2a$, $b+\dfrac1{ca}=2b$, $c+\dfrac1{ab}=2c$

$2a,2b,2c$ là các số nguyên dương có tích bằng $8$. Do đó $(2a,2b,2c)$ là hoán vị của một trong các bộ số $(1;1;8)$; $(1;2;4)$; $(2;2;2)$ nên $(a,b,c)$ là hoán vị của một trong các bộ số $\left(\dfrac12;\dfrac12;4\right)$; $\left(\dfrac12;1;2\right)$; $(1;1;1)$

Thử các hoán vị trên ta có $M=a+b^2=c^3$ đạt giá trị lớn nhất là $64\dfrac34$ tại $a=b=\dfrac12$, $c=4$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi biểu thức $a+\dfrac1{bc}$ đều bằng $a\left(1+\dfrac1{abc}\right)$, nên tích của ba số nguyên đã cho chỉ phụ thuộc $abc$; viết $abc=\dfrac pq$ (tối giản) thì tích đó là $\dfrac{(p+q)^3}{p^2q}$ và việc nó là số nguyên ép được $p=q=1$.

**Bước 1.** Đặt $a$, $b$, $c$ ra ngoài để chỉ ra $a+\dfrac1{bc}=a\left(1+\dfrac1{abc}\right)$ và hai đẳng thức tương tự, rồi tính tích ba số nguyên đã cho theo $abc$.

**Bước 2.** Đặt $abc=\dfrac pq$ tối giản; tích ba số nguyên đó là số nguyên nên suy ra $p^2q$ là ước của $(p+q)^3$.

**Bước 3.** Dùng tính nguyên tố cùng nhau của $p+q$ với $p$ và với $q$ để suy ra $q$ và $p$ đều bằng $1$, tức $abc=1$.

**Bước 4.** Khi $abc=1$, ba số nguyên đã cho là $2a$, $2b$, $2c$ với tích bằng $8$; liệt kê các bộ ba số nguyên dương có tích $8$ rồi suy ra các giá trị có thể của $a$, $b$, $c$.

**Bước 5.** So sánh $M=a+b^2+c^3$ trên các bộ đó, chú ý số mũ cao nhất ở $c$ nên chia trường hợp theo $c=4$ và $c\le2$.

**Chú ý:** Bài này nhận ra $abc=1$ là bước quyết định; đừng quên thử lại bộ giá trị đạt cực đại để chắc nó thỏa điều kiện đề (các số $a+\dfrac1{bc}$,… đều nguyên).

**Phần 2. Trình bày**

Vì $abc$ là số hữu tỉ dương nên đặt $abc=\dfrac pq$ với $p,q\in\mathbb{N}^*$, $\gcd(p,q)=1$.

Ta có $a+\dfrac1{bc}=a\left(1+\dfrac1{abc}\right)$, $b+\dfrac1{ca}=b\left(1+\dfrac1{abc}\right)$, $c+\dfrac1{ab}=c\left(1+\dfrac1{abc}\right)$ nên

$\left(a+\dfrac1{bc}\right)\left(b+\dfrac1{ca}\right)\left(c+\dfrac1{ab}\right)=abc\left(1+\dfrac1{abc}\right)^3=\dfrac pq\left(1+\dfrac qp\right)^3=\dfrac{(p+q)^3}{p^2q}$.

Tích này là số nguyên (tích ba số nguyên) nên $(p+q)^3\vdots p^2q$, suy ra $(p+q)^3\vdots q$ và $(p+q)^3\vdots p^2$.

Vì $\gcd(p,q)=1$ nên $\gcd(p+q,q)=\gcd(p+q,p)=1$. Do $(p+q)^3$ nguyên tố cùng nhau với $q$ mà chia hết cho $q$ nên $q=1$; tương tự $p^2=1$, tức $p=1$.

Vậy $abc=1$, suy ra $\dfrac1{bc}=a$, $\dfrac1{ca}=b$, $\dfrac1{ab}=c$, do đó

$a+\dfrac1{bc}=2a$, $b+\dfrac1{ca}=2b$, $c+\dfrac1{ab}=2c$ là các số nguyên dương có tích $8abc=8$.

Các bộ ba số nguyên dương có tích $8$ (không kể thứ tự) là $(1;1;8)$, $(1;2;4)$, $(2;2;2)$. Vậy $(a;b;c)$ là hoán vị của $\left(\dfrac12;\dfrac12;4\right)$, $\left(\dfrac12;1;2\right)$ hoặc $(1;1;1)$, và mỗi số $a,b,c$ thuộc $\left\{\dfrac12;1;2;4\right\}$.

Nếu $c=4$ thì chỉ có thể $a=b=\dfrac12$ và $M=\dfrac12+\dfrac14+64=\dfrac{259}{4}$.

Nếu $c\ne4$ thì $c\le2$, nên $c^3\le8$; lại có $a\le4$, $b^2\le16$, do đó $M\le4+16+8=28<\dfrac{259}{4}$.

Với $a=b=\dfrac12$, $c=4$: $a+\dfrac1{bc}=1$, $b+\dfrac1{ca}=1$, $c+\dfrac1{ab}=8$ đều nguyên, thỏa đề.

Vậy giá trị lớn nhất của $M$ là $\dfrac{259}{4}$, đạt khi $a=b=\dfrac12$, $c=4$.

=== PA.33@p246
- bai: 33 · y: - · trang: 246 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách thành hiệu hai phân số (khử liên tiếp)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng: $\dfrac{1}{2^3}+\dfrac{1}{3^3}+\dots+\dfrac{1}{2009^3}<\dfrac14$
## SACH
Với $n>1$ ta có $(n-1)n(n+1)=n(n^2-1)<n\cdot n^2=n^3$

Suy ra: $\dfrac{1}{n^3}<\dfrac{1}{(n-1)n(n+1)}$

Vậy có: $\dfrac1{n^3}<\dfrac12\left[\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right]$

Do vậy, ta có:

$\dfrac1{2^3}+\dfrac1{3^3}+\dots+\dfrac1{2009^3}<\dfrac12\left[\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}+\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}+\dots+\dfrac{1}{2008\cdot2009}-\dfrac{1}{2009\cdot2010}\right]$

$=\dfrac12\left[\dfrac12-\dfrac{1}{2009\cdot2010}\right]<\dfrac12\cdot\dfrac12=\dfrac14$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng $\dfrac1{n^3}$ nhỏ hơn $\dfrac1{(n-1)n(n+1)}$, mà phân số này tách được thành hiệu hai phân số kề nhau nên khi cộng các số hạng sẽ triệt tiêu liên tiếp.

**Bước 1.** So sánh $n^3$ với tích ba số nguyên liên tiếp $(n-1)n(n+1)$ để làm trội $\dfrac1{n^3}$ bằng một phân số có thể khử liên tiếp.

**Bước 2.** Tách $\dfrac1{(n-1)n(n+1)}$ thành một nửa của hiệu hai phân số có mẫu $(n-1)n$ và $n(n+1)$.

**Bước 3.** Viết bất đẳng thức vừa có cho $n=2;3;\dots;2009$ rồi cộng lại để các phân số ở giữa triệt tiêu.

**Bước 4.** Bỏ phần trừ dương còn lại ở cuối để so sánh kết quả với $\dfrac14$.

**Chú ý:** Làm trội phải giữ được dạng triệt tiêu và không quá thô; chẳng hạn làm trội bằng $\dfrac{1}{(n-1)n}$ thì tổng ra gần $1$, vượt xa $\dfrac14$.

**Phần 2. Trình bày**

Với $n>1$: $(n-1)n(n+1)=n(n^2-1)<n\cdot n^2=n^3$.

Suy ra $\dfrac1{n^3}<\dfrac1{(n-1)n(n+1)}=\dfrac12\left[\dfrac1{(n-1)n}-\dfrac1{n(n+1)}\right]$.

Cho $n=2;3;\dots;2009$ rồi cộng lại:

$\dfrac1{2^3}+\dfrac1{3^3}+\dots+\dfrac1{2009^3}<\dfrac12\left[\dfrac1{1\cdot2}-\dfrac1{2\cdot3}+\dfrac1{2\cdot3}-\dfrac1{3\cdot4}+\dots+\dfrac1{2008\cdot2009}-\dfrac1{2009\cdot2010}\right]$

$=\dfrac12\left[\dfrac12-\dfrac1{2009\cdot2010}\right]$

$<\dfrac12\cdot\dfrac12=\dfrac14$.

Vậy $\dfrac1{2^3}+\dfrac1{3^3}+\dots+\dfrac1{2009^3}<\dfrac14$.
