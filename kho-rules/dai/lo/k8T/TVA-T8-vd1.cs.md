=== T8D1C1.1@p177
- bai: 1 · y: - · trang: 177 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 1: Dùng định nghĩa · xét hiệu · đặt ẩn phụ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng: $(x-1)(x-2)(x-3)(x-4)\ge-1$.
## SACH
Xét hiệu:
$(x-1)(x-2)(x-3)(x-4)-(-1)=(x^2-5x+4)(x^2-5x+6)+1$.
Đặt $x^2-5x+5=y$. Biểu thức trên bằng $(y-1)(y+1)+1=y^2\ge0$.
Vậy $(x-1)(x-2)(x-3)(x-4)\ge-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chứng minh $A\ge B$ thì xét hiệu $A-B$ rồi biến đổi hiệu thành một bình phương; ở đây ghép nhân tử đầu với cuối và hai nhân tử giữa thì cả hai tam thức cùng chứa $x^2-5x$, nên đặt ẩn phụ được.

**Bước 1.** Lập hiệu của vế trái và vế phải, vì chỉ cần chứng minh hiệu này không âm với mọi $x$.

**Bước 2.** Nhân hai nhân tử đầu–cuối với nhau và hai nhân tử giữa với nhau để thu được hai tam thức có cùng phần $x^2-5x$.

**Bước 3.** Đặt ẩn phụ là số hạng nằm giữa hai tam thức đó, khi ấy tích trở thành hiệu hai bình phương và hiệu cần xét gọn thành một bình phương.

**Bước 4.** Kết luận hiệu không âm, rồi tìm giá trị của $x$ làm xảy ra dấu bằng.

**Chú ý:** Chọn ẩn phụ $y=x^2-5x+5$ (ở chính giữa $x^2-5x+4$ và $x^2-5x+6$) để tích có dạng $(y-1)(y+1)$; chọn ẩn phụ lệch đi thì không gọn được như vậy.

**Phần 2. Trình bày**

$(x-1)(x-2)(x-3)(x-4)-(-1)=\left[(x-1)(x-4)\right]\left[(x-2)(x-3)\right]+1$

$=(x^2-5x+4)(x^2-5x+6)+1$

Đặt $y=x^2-5x+5$. Khi đó hiệu bằng $(y-1)(y+1)+1=y^2-1+1=y^2\ge0$ với mọi $x$.

Vậy $(x-1)(x-2)(x-3)(x-4)\ge-1$ với mọi $x$.

Dấu bằng xảy ra khi $y=0$, tức $x^2-5x+5=0\Leftrightarrow\left(x-\dfrac{5}{2}\right)^2=\dfrac{5}{4}\Leftrightarrow x=\dfrac{5\pm\sqrt{5}}{2}$.

=== T8D1C2.1@p178
- bai: 1 · y: - · trang: 178 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · nhân hai vế với số dương · thay điều kiện $a+b=1$ · bất đẳng thức $(a-b)^2\ge0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách in nhãn "Ví dụ 2" cho CẢ HAI ví dụ đầu của Cách 2 (cùng trang 178); kho coi ví dụ in trước (bài này) là ví dụ 1, ví dụ in sau ($a^4+b^4>\dfrac{1}{8}$) là ví dụ 2. Dòng "Cách giải khác" của sách in thừa số đầu là $1-\dfrac{1}{a}$ (dấu trừ) và đọc được mẫu của cả hai phân thức ở bước giữa là $b$ (đáng ra $1+\dfrac{1}{a}$ và $\dfrac{a+b}{a}$) — chép đúng như đọc được, ảnh không rõ chỗ mẫu; lời giải kho không dùng dòng này.
## DE
Cho các số dương $a$ và $b$ thỏa mãn điều kiện $a+b=1$. Chứng minh rằng $\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$.
## SACH
Ta có: $\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$ $(1)$.
$\Leftrightarrow\dfrac{a+1}{a}\cdot\dfrac{b+1}{b}\ge9\Leftrightarrow ab+a+b+1\ge9ab$ (vì $ab>0$)
$\Leftrightarrow a+b+1\ge8ab\Leftrightarrow2\ge8ab$ (vì $a+b=1$)
$\Leftrightarrow1\ge4ab\Leftrightarrow(a+b)^2\ge4ab$ (vì $a+b=1$) $\Leftrightarrow(a-b)^2\ge0$. $(2)$
Bất đẳng thức $(2)$ đúng, mà các phép biến đổi trên tương đương, vậy bất đẳng thức $(1)$ được chứng minh. Xảy ra đẳng thức khi và chỉ khi $a=b$.
Cách giải khác:
$\left(1-\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)=\left(1+\dfrac{a+b}{b}\right)\left(1+\dfrac{a+b}{b}\right)=\left(2+\dfrac{b}{a}\right)\left(2+\dfrac{a}{b}\right)$.
Thực hiện phép nhân và chú ý rằng $\dfrac{a}{b}+\dfrac{b}{a}\ge2$ do $a>0$, $b>0$.
Chú ý: Khi sử dụng phép biến đổi tương đương, cần lưu ý các biến đổi tương đương có điều kiện, chẳng hạn: $a^2>b^2\Leftrightarrow a>b$ với $a,b>0$; $m>n\Leftrightarrow a^m>a^n$ với $m,n$ nguyên dương, $a>1$. Cần chỉ rõ các điều kiện ấy khi biến đổi tương đương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế dương và có điều kiện $a+b=1$, nên quy đồng, nhân hai vế với $ab>0$ để khử mẫu rồi thay $a+b=1$ để đưa bất đẳng thức về dạng $(a-b)^2\ge0$ hiển nhiên đúng.

**Bước 1.** Quy đồng từng thừa số ở vế trái rồi nhân hai vế với $ab>0$ để khử mẫu mà không đổi chiều bất đẳng thức.

**Bước 2.** Thay $a+b=1$ vào bất đẳng thức vừa khử mẫu để một vế chỉ còn chứa tích $ab$.

**Bước 3.** Viết số $1$ thành $(a+b)^2$ để có dạng $(a+b)^2\ge4ab$, rồi chuyển vế để được bình phương của một hiệu không âm.

**Bước 4.** Kết luận bất đẳng thức cuối đúng và tìm điều kiện làm xảy ra dấu bằng.

**Chú ý:** Chỉ được nhân hai vế với $ab$ khi biết chắc $ab>0$ (đề cho $a,b$ dương). Cách khác: thay $1=a+b$ để được $\left(2+\dfrac{b}{a}\right)\left(2+\dfrac{a}{b}\right)=5+2\left(\dfrac{a}{b}+\dfrac{b}{a}\right)$ rồi dùng $\dfrac{a}{b}+\dfrac{b}{a}\ge2$.

**Phần 2. Trình bày**

Vì $a,b>0$ nên $ab>0$.

$\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9\Leftrightarrow\dfrac{a+1}{a}\cdot\dfrac{b+1}{b}\ge9\Leftrightarrow ab+a+b+1\ge9ab$ (nhân hai vế với $ab>0$)

$\Leftrightarrow a+b+1\ge8ab\Leftrightarrow2\ge8ab$ (vì $a+b=1$)

$\Leftrightarrow1\ge4ab\Leftrightarrow(a+b)^2\ge4ab$ (vì $a+b=1$)

$\Leftrightarrow(a-b)^2\ge0$ (luôn đúng).

Mọi phép biến đổi trên đều là tương đương và bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $a=b$, kết hợp với $a+b=1$ được $a=b=\dfrac{1}{2}$.

=== T8D1C2.2@p178
- bai: 2 · y: - · trang: 178 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · bình phương hai vế dương · cộng từng vế
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách in nhãn "Ví dụ 2" cho ví dụ này (lần in thứ hai trên trang 178, sau ví dụ $\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$ cũng nhãn "Ví dụ 2"); kho đánh số 2.
## DE
Cho $a+b>1$. Chứng minh rằng $a^4+b^4>\dfrac{1}{8}$.
## SACH
Ta có: $a+b>1>0$ $(1)$
Bình phương hai vế: $(a+b)^2>1\Rightarrow a^2+2ab+b^2>1$. $(2)$
Mặt khác: $(a-b)^2\ge0\Rightarrow a^2-2ab+b^2\ge0$. $(3)$
Cộng từng vế của $(2)$ và $(3)$: $2(a^2+b^2)>1\Rightarrow a^2+b^2>\dfrac{1}{2}$ $(4)$
Bình phương hai vế của $(4)$: $a^4+2a^2b^2+b^4>\dfrac{1}{4}$ $(5)$
Mặt khác $(a^2-b^2)^2\ge0\Rightarrow a^4-2a^2b^2+b^4\ge0$ $(6)$
Cộng từng vế $(5)$ và $(6)$: $2(a^4+b^4)>\dfrac{1}{4}\Rightarrow a^4+b^4>\dfrac{1}{8}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết $a+b>1$ cho phép bình phương hai vế dương; mỗi lần bình phương lại cộng với một bình phương không âm $(a-b)^2$ hoặc $(a^2-b^2)^2$ để khử số hạng chứa tích, hạ dần từ $a+b$ xuống $a^2+b^2$ rồi $a^4+b^4$.

**Bước 1.** Bình phương hai vế của $a+b>1$ (cả hai vế dương) để được bất đẳng thức về $a^2+2ab+b^2$.

**Bước 2.** Cộng từng vế với bất đẳng thức đúng $(a-b)^2\ge0$ để triệt tiêu số hạng $2ab$ và có cận dưới của $a^2+b^2$.

**Bước 3.** Bình phương hai vế của bất đẳng thức vừa có (hai vế dương) rồi cộng với $(a^2-b^2)^2\ge0$ để triệt tiêu số hạng $2a^2b^2$.

**Bước 4.** Chia hai vế cho $2$ để có cận dưới của $a^4+b^4$ đúng như đề yêu cầu.

**Chú ý:** Chỉ được bình phương hai vế của một bất đẳng thức khi cả hai vế dương; ở đây $a+b>1>0$ và $a^2+b^2>\dfrac{1}{2}>0$ nên mỗi lần bình phương đều hợp lệ.

**Phần 2. Trình bày**

Vì $a+b>1>0$ nên bình phương hai vế: $(a+b)^2>1\Rightarrow a^2+2ab+b^2>1$ $(1)$

Mặt khác $(a-b)^2\ge0\Rightarrow a^2-2ab+b^2\ge0$ $(2)$

Cộng từng vế $(1)$ và $(2)$: $2(a^2+b^2)>1\Rightarrow a^2+b^2>\dfrac{1}{2}$ $(3)$

Vì $a^2+b^2>\dfrac{1}{2}>0$ nên bình phương hai vế của $(3)$: $a^4+2a^2b^2+b^4>\dfrac{1}{4}$ $(4)$

Mặt khác $(a^2-b^2)^2\ge0\Rightarrow a^4-2a^2b^2+b^4\ge0$ $(5)$

Cộng từng vế $(4)$ và $(5)$: $2(a^4+b^4)>\dfrac{1}{4}\Rightarrow a^4+b^4>\dfrac{1}{8}$.

Đây là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8D1C2.3@p179
- bai: 3 · y: - · trang: 179 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · bất đẳng thức $x^2+y^2\ge2xy$ (Cô-si cho hai số) · cộng từng vế
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{c}{b}+\dfrac{b}{a}+\dfrac{a}{c}$.
## SACH
Áp dụng bất đẳng thức $x^2+y^2\ge2xy$ (xảy ra đẳng thức khi $x=y$), ta có:
$\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}\ge2\cdot\dfrac{a}{b}\cdot\dfrac{b}{c}=2\cdot\dfrac{a}{c}$. Tương tự: $\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge2\cdot\dfrac{b}{a}$; $\dfrac{c^2}{a^2}+\dfrac{a^2}{b^2}\ge2\cdot\dfrac{c}{b}$
Cộng từng vế ba bất đẳng thức trên:
$2\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\right)\ge2\left(\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}\right)\Rightarrow\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái gồm ba bình phương $\left(\dfrac{a}{b}\right)^2$, $\left(\dfrac{b}{c}\right)^2$, $\left(\dfrac{c}{a}\right)^2$ mà tích hai tỉ số bất kì trong ba tỉ số ấy chính là một hạng tử của vế phải, nên ghép từng cặp bình phương và dùng $x^2+y^2\ge2xy$.

**Bước 1.** Nhận ra vế trái là tổng ba bình phương của $\dfrac{a}{b}$, $\dfrac{b}{c}$, $\dfrac{c}{a}$ và kiểm tra tích hai tỉ số liên tiếp cho ra các hạng tử $\dfrac{a}{c}$, $\dfrac{b}{a}$, $\dfrac{c}{b}$ của vế phải.

**Bước 2.** Áp dụng $x^2+y^2\ge2xy$ cho từng cặp hai bình phương để được ba bất đẳng thức cùng chiều.

**Bước 3.** Cộng từng vế ba bất đẳng thức đó rồi chia hai vế cho $2$ để thu được vế phải của đề.

**Bước 4.** Xét điều kiện để cả ba dấu bằng cùng xảy ra.

**Chú ý:** Bất đẳng thức $x^2+y^2\ge2xy$ đúng với mọi số thực $x,y$ (vì $(x-y)^2\ge0$), nên ở bài này chỉ cần $a,b,c\neq0$ để các phân thức có nghĩa.

**Phần 2. Trình bày**

Vì các phân thức có nghĩa nên $a,b,c\neq0$. Áp dụng $x^2+y^2\ge2xy$ (đúng với mọi số thực $x,y$, dấu bằng khi $x=y$):

$\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}\ge2\cdot\dfrac{a}{b}\cdot\dfrac{b}{c}=2\cdot\dfrac{a}{c}$

$\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge2\cdot\dfrac{b}{c}\cdot\dfrac{c}{a}=2\cdot\dfrac{b}{a}$

$\dfrac{c^2}{a^2}+\dfrac{a^2}{b^2}\ge2\cdot\dfrac{c}{a}\cdot\dfrac{a}{b}=2\cdot\dfrac{c}{b}$

Cộng từng vế ba bất đẳng thức trên:

$2\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\right)\ge2\left(\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}\right)$

Chia hai vế cho $2$: $\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{c}{b}+\dfrac{b}{a}+\dfrac{a}{c}$, đó là bất đẳng thức cần chứng minh.

Dấu bằng xảy ra khi $\dfrac{a}{b}=\dfrac{b}{c}=\dfrac{c}{a}=t$. Khi đó $t^3=\dfrac{a}{b}\cdot\dfrac{b}{c}\cdot\dfrac{c}{a}=1$ nên $t=1$, tức $a=b=c$.

=== T8D1C2.4@p179
- bai: 4 · y: - · trang: 179 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · bất đẳng thức $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ (Cô-si cho hai số) · đặt ẩn phụ $x=b+c$, $y=c+a$, $z=a+b$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: ví dụ có hai ý a, b nhưng ý b dùng thẳng kết quả ý a (sách: "Áp dụng bất đẳng thức ở câu a") nên giữ cả ví dụ thành MỘT câu (lưu ý 6). Đề in "$\ge1,5$" (dấu phẩy thập phân) chép là $1{,}5$.
## DE
Chứng minh các bất đẳng thức với $a,b,c$ là các số dương:

a) $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$;

b) $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge1{,}5$.
## SACH
a. Ta có: $A=(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=1+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{a}+1+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{c}{b}+1$
$=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$.
Ta có $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ với $x,y$ dương.
Do đó $A\ge3+2+2+2=9$.
Vậy $A\ge9$. Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
b. Áp dụng bất đẳng thức ở câu a: $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ trong đó $x,y,z>0$. Với $x=b+c$, $y=a+c$, $z=a+b$ ta được:
$2(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{a+c}+\dfrac{1}{a+b}\right)\ge9$
$\Rightarrow(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{a+c}+\dfrac{1}{a+b}\right)\ge4{,}5$
$\Rightarrow\dfrac{a+b+c}{b+c}+\dfrac{a+b+c}{a+c}+\dfrac{a+b+c}{a+b}\ge4{,}5$
$\Rightarrow\dfrac{a}{b+c}+1+\dfrac{b}{a+c}+1+\dfrac{c}{a+b}+1\ge4{,}5\Rightarrow\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\ge1{,}5$. Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ở câu a) nhân phân phối để xuất hiện các cặp $\dfrac{x}{y}+\dfrac{y}{x}\ge2$; ở câu b) đặt $x=b+c$, $y=c+a$, $z=a+b$ (đều dương, tổng bằng $2(a+b+c)$) để dùng ngay bất đẳng thức của câu a) rồi tách $\dfrac{a+b+c}{b+c}=\dfrac{a}{b+c}+1$.

**Bước 1.** Khai triển tích ở câu a) rồi nhóm các số hạng thành ba cặp nghịch đảo của nhau cùng với một hằng số.

**Bước 2.** Dùng $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ với $x,y>0$ cho cả ba cặp rồi cộng lại để hoàn thành câu a).

**Bước 3.** Ở câu b), áp dụng bất đẳng thức của câu a) cho ba số dương $b+c$, $c+a$, $a+b$ mà tổng của chúng là $2(a+b+c)$.

**Bước 4.** Chia hai vế cho $2$ rồi nhân $a+b+c$ vào từng phân thức để tách mỗi phân thức thành một phân thức cộng thêm $1$.

**Bước 5.** Chuyển ba số $1$ sang vế phải để đưa về bất đẳng thức cần chứng minh và tìm dấu bằng.

**Chú ý:** $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ chỉ dùng khi $x,y$ cùng dấu (ở đây đều dương), vì $\dfrac{x}{y}+\dfrac{y}{x}-2=\dfrac{(x-y)^2}{xy}\ge0$.

**Phần 2. Trình bày**

a) Với $a,b,c>0$:

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=1+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{a}+1+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{c}{b}+1$

$=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$

Với $x,y>0$: $\dfrac{x}{y}+\dfrac{y}{x}=\dfrac{x^2+y^2}{xy}\ge\dfrac{2xy}{xy}=2$, dấu bằng khi $x=y$. Áp dụng cho ba cặp trên:

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge3+2+2+2=9$.

Dấu bằng xảy ra khi $a=b$, $a=c$, $b=c$, tức là $a=b=c$.

b) Với $a,b,c>0$ thì $x=b+c$, $y=c+a$, $z=a+b$ đều dương, theo câu a):

$(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$, tức $2(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{c+a}+\dfrac{1}{a+b}\right)\ge9$

$\Rightarrow\dfrac{a+b+c}{b+c}+\dfrac{a+b+c}{c+a}+\dfrac{a+b+c}{a+b}\ge\dfrac{9}{2}$

$\Rightarrow\left(\dfrac{a}{b+c}+1\right)+\left(\dfrac{b}{c+a}+1\right)+\left(\dfrac{c}{a+b}+1\right)\ge\dfrac{9}{2}$

$\Rightarrow\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{9}{2}-3=\dfrac{3}{2}=1{,}5$.

Dấu bằng xảy ra khi $b+c=c+a=a+b$, tức $a=b=c$.

=== T8D1C2.5@p180
- bai: 5 · y: - · trang: 180 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · bất đẳng thức $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác. Chứng minh rằng: $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$.
## SACH
Xét $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}$ và chú ý rằng các mẫu đều dương, áp dụng bất đẳng thức $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y>0$, ta được: $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{2b}=\dfrac{2}{b}$.
tương tự $\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{2}{c}$, $\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{2}{a}$. Cộng từng vế ba bất đẳng thức trên rồi chia cho $2$, ta được điều phải chứng minh.
Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a,b,c$ là ba cạnh tam giác thì ba mẫu $a+b-c$, $b+c-a$, $c+a-b$ đều dương và tổng của hai mẫu bất kì là $2a$, $2b$ hoặc $2c$, nên dùng $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ cho từng cặp mẫu.

**Bước 1.** Dùng bất đẳng thức tam giác để chứng tỏ ba mẫu $a+b-c$, $b+c-a$, $c+a-b$ đều dương.

**Bước 2.** Áp dụng $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ cho từng cặp hai trong ba mẫu và tính tổng hai mẫu của mỗi cặp.

**Bước 3.** Cộng từng vế ba bất đẳng thức rồi chia hai vế cho $2$ để có vế phải của đề.

**Bước 4.** Xét khi nào cả ba dấu bằng cùng xảy ra.

**Chú ý:** $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y>0$ là hệ quả của $(x+y)^2\ge4xy$ (chia hai vế cho $xy(x+y)>0$); dấu bằng khi $x=y$.

**Phần 2. Trình bày**

Vì $a,b,c$ là độ dài ba cạnh của một tam giác nên $a+b-c>0$, $b+c-a>0$, $c+a-b>0$.

Với $x,y>0$: $\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{x+y}{xy}\ge\dfrac{4}{x+y}\Leftrightarrow(x+y)^2\ge4xy\Leftrightarrow(x-y)^2\ge0$ (đúng), dấu bằng khi $x=y$. Áp dụng:

$\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{(a+b-c)+(b+c-a)}=\dfrac{4}{2b}=\dfrac{2}{b}$

$\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{4}{2c}=\dfrac{2}{c}$

$\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{4}{2a}=\dfrac{2}{a}$

Cộng từng vế ba bất đẳng thức trên:

$2\left(\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\right)\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$

Chia hai vế cho $2$ được bất đẳng thức cần chứng minh.

Dấu bằng xảy ra khi $a+b-c=b+c-a=c+a-b$, tức $a=b=c$ (tam giác đều).

=== T8D1C2.6@p180
- bai: 6 · y: - · trang: 180 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · bất đẳng thức $(x+y)^2\ge4xy$ (Cô-si cho hai số) · nhân từng vế các bất đẳng thức không âm · so sánh hai số không âm qua bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách kết luận "xảy ra đẳng thức khi và chỉ khi $x=y=z$" nhưng còn thiếu trường hợp có hai trong ba số bằng $0$ (vd $x=y=0$, $z$ tùy ý thì hai vế cùng bằng $0$); lời giải kho ghi đủ cả hai trường hợp.
## DE
Cho $x\ge0$, $y\ge0$, $z\ge0$. Chứng minh rằng: $(x+y)(y+z)(z+x)\ge8xyz$.
## SACH
Hai vế của bất đẳng thức đều không âm nên để chứng minh, ta sẽ chứng minh rằng: $(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$.
Ta có $(x+y)^2\ge4xy$, $(y+z)^2\ge4yz$, $(z+x)^2\ge4zx$.
Hai vế của ba bất đẳng thức trên đều không âm, nhân từng vế ta được:
$(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$.
$\Rightarrow\left[(x+y)(y+z)(z+x)\right]^2\ge\left[8xyz\right]^2$. Các biểu thức trong dấu ngoặc vuông đều không âm nên $(x+y)(y+z)(z+x)\ge8xyz$.
Xảy ra đẳng thức khi và chỉ khi $x=y=z$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tích ba tổng, vế phải là $8xyz$; từ $(x+y)^2\ge4xy$ cho từng cặp rồi nhân ba bất đẳng thức cùng chiều có các vế không âm, sau đó đưa về so sánh hai số không âm.

**Bước 1.** Nhận xét cả hai vế đều không âm nên chỉ cần chứng minh bất đẳng thức giữa các bình phương của chúng.

**Bước 2.** Viết $(x+y)^2\ge4xy$ cho cả ba cặp và kiểm tra các vế của từng bất đẳng thức đều không âm.

**Bước 3.** Nhân từng vế ba bất đẳng thức đó để được bất đẳng thức giữa hai bình phương.

**Bước 4.** Từ bình phương của hai số không âm so sánh được, suy ra bất đẳng thức ban đầu rồi xét trường hợp xảy ra dấu bằng.

**Chú ý:** Chỉ được nhân từng vế các bất đẳng thức cùng chiều khi các vế đều không âm; đó là lí do đề cho $x,y,z\ge0$.

**Phần 2. Trình bày**

Vì $x,y,z\ge0$ nên $(x+y)(y+z)(z+x)\ge0$ và $8xyz\ge0$.

Ta có $(x+y)^2\ge4xy\ (\Leftrightarrow(x-y)^2\ge0)$, tương tự $(y+z)^2\ge4yz$, $(z+x)^2\ge4zx$; hai vế mỗi bất đẳng thức đều không âm.

Nhân từng vế ba bất đẳng thức: $(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$

$\Rightarrow\left[(x+y)(y+z)(z+x)\right]^2\ge(8xyz)^2$

Hai biểu thức $(x+y)(y+z)(z+x)$ và $8xyz$ đều không âm nên $(x+y)(y+z)(z+x)\ge8xyz$.

Dấu bằng xảy ra khi $x=y=z$ (khi đó cả ba bất đẳng thức $(x+y)^2\ge4xy$,… đều thành đẳng thức), và cũng xảy ra khi có hai trong ba số bằng $0$ (vd $x=y=0$ thì hai vế cùng bằng $0$). Các trường hợp còn lại bất đẳng thức chặt.

=== T8D1C2.7a@p180
- bai: 7 · y: a · trang: 180 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · đưa về bình phương cộng một số dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: ví dụ có ba ý a, b, c độc lập; mỗi ý một câu, lời dẫn của đề được ghép vào từng ý.
## DE
Chứng minh rằng với mọi giá trị của biến $x$, đa thức sau đây nhận giá trị dương: $x^2-6x+10$.
## SACH
Gợi ý: Hãy viết các đa thức trên dưới dạng tổng của một số dương với một bình phương của một biểu thức $x$.
a. Ta có: $x^2-6x+10=x^2-2\cdot3x+3^2+1=(x-3)^2+1$
Với mọi $x$ thì: $(x-3)^2\ge0$; do đó $x^2-6x+10\ge1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc hai có hệ số của $x^2$ bằng $1$ nên viết được thành bình phương của một nhị thức cộng với một hằng số dương, từ đó thấy ngay đa thức luôn dương.

**Bước 1.** Nhận ra $-6x$ là hai lần tích của $x$ với $-3$, nên bình phương cần dùng là $(x-3)^2$.

**Bước 2.** Tách hằng số $10$ thành tổng của $9$ và một số dương để ghép được $x^2-6x+9$.

**Bước 3.** Dùng tính chất bình phương không âm để chặn đa thức từ dưới bởi một số dương.

**Chú ý:** Muốn chứng minh một đa thức bậc hai luôn dương thì đưa về dạng (bình phương) $+$ (số dương); hằng số còn lại phải dương.

**Phần 2. Trình bày**

$x^2-6x+10=(x^2-6x+9)+1=(x-3)^2+1$

Với mọi $x$ ta có $(x-3)^2\ge0$, nên $x^2-6x+10\ge1>0$.

Vậy đa thức nhận giá trị dương với mọi $x$. Dấu bằng trong $x^2-6x+10\ge1$ xảy ra khi $x=3$.

=== T8D1C2.7b@p180
- bai: 7 · y: b · trang: 180 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · đưa về bình phương cộng một số dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: cùng ví dụ số 7 với ý a.
## DE
Chứng minh rằng với mọi giá trị của biến $x$, đa thức sau đây nhận giá trị dương: $x^2+x+1$.
## SACH
Gợi ý: Hãy viết các đa thức trên dưới dạng tổng của một số dương với một bình phương của một biểu thức $x$.
b. $x^2+x+1=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số của $x$ là $1=2\cdot\dfrac{1}{2}$ nên bình phương cần dùng là $\left(x+\dfrac{1}{2}\right)^2$, phần còn lại của hằng số là một số dương.

**Bước 1.** Nhận ra số hạng $x$ là hai lần tích của $x$ với $\dfrac{1}{2}$, nên chọn bình phương $\left(x+\dfrac{1}{2}\right)^2$.

**Bước 2.** Tách hằng số $1$ thành $\dfrac{1}{4}$ cộng với phần dư dương để ghép được bình phương đó.

**Bước 3.** Dùng tính chất bình phương không âm để chặn đa thức từ dưới bởi một số dương.

**Chú ý:** Hệ số $\dfrac{1}{2}$ là một nửa hệ số của $x$; quên bình phương số này sẽ ghép sai hằng số.

**Phần 2. Trình bày**

$x^2+x+1=\left(x^2+x+\dfrac{1}{4}\right)+\dfrac{3}{4}=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}$

Với mọi $x$ ta có $\left(x+\dfrac{1}{2}\right)^2\ge0$, nên $x^2+x+1\ge\dfrac{3}{4}>0$.

Vậy đa thức nhận giá trị dương với mọi $x$. Dấu bằng trong $x^2+x+1\ge\dfrac{3}{4}$ xảy ra khi $x=-\dfrac{1}{2}$.

=== T8D1C2.7c@p180
- bai: 7 · y: c · trang: 180 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · hiệu hai bình phương · đưa về bình phương cộng một số dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: cùng ví dụ số 7 với ý a. Dòng cuối lời giải sách bị logo "ABC" che gần hết chữ đầu ("$=(x-4)^2-1+4$"), đọc theo biến đổi.
## DE
Chứng minh rằng với mọi giá trị của biến $x$, đa thức sau đây nhận giá trị dương: $(x-3)(x-5)+4$.
## SACH
Gợi ý: Hãy viết các đa thức trên dưới dạng tổng của một số dương với một bình phương của một biểu thức $x$.
c. $(x-3)(x-5)+4=(x-4+1)(x-4-1)+4$
$=(x-4)^2-1+4=(x-4)^2+3\ge3$ với mọi $x$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai nhân tử $x-3$ và $x-5$ lần lượt lớn hơn và nhỏ hơn $x-4$ đúng $1$ đơn vị, nên tích của chúng là hiệu hai bình phương có một bình phương là $(x-4)^2$.

**Bước 1.** Nhận ra $x-3$ và $x-5$ cách đều $x-4$ để viết tích dưới dạng $(x-4+1)(x-4-1)$.

**Bước 2.** Dùng hằng đẳng thức hiệu hai bình phương rồi cộng với $4$ để thu gọn thành bình phương cộng một hằng số.

**Bước 3.** Dùng tính chất bình phương không âm để chặn đa thức từ dưới bởi một số dương.

**Chú ý:** Đưa cả hai nhân tử về cùng một số hạng chung ($x-4$) là mẹo để thấy ngay hiệu hai bình phương; cũng có thể khai triển ra $x^2-8x+19$ rồi ghép $(x-4)^2$.

**Phần 2. Trình bày**

$(x-3)(x-5)+4=(x-4+1)(x-4-1)+4$

$=(x-4)^2-1+4=(x-4)^2+3$

Với mọi $x$ ta có $(x-4)^2\ge0$, nên $(x-3)(x-5)+4\ge3>0$.

Vậy đa thức nhận giá trị dương với mọi $x$. Dấu bằng trong bất đẳng thức $\ge3$ xảy ra khi $x=4$.

=== T8D1C2.8@p181
- bai: 8 · y: - · trang: 181 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · xét hiệu · hằng đẳng thức bình phương một hiệu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi $x\ge0$, $y\ge0$: $\left(\dfrac{x+y}{2}\right)^2\ge xy$.
## SACH
$\left(\dfrac{x+y}{2}\right)^2\ge xy\Leftrightarrow\left(\dfrac{x+y}{2}\right)^2-xy\ge0\Leftrightarrow\dfrac{(x-y)^2}{4}\ge0$
Bất đẳng thức cuối cùng là đúng, do đó bất đẳng thức đã cho là đúng.
$(x-y)^2=0$ khi và chỉ khi $x=y$. Do đó trong bất đẳng thức: $\left(\dfrac{x+y}{2}\right)^2\ge xy$, ta có dấu $=$ khi và chỉ khi $x=y$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển $xy$ sang vế trái rồi quy đồng thì hiệu hai vế chính là $\dfrac{(x-y)^2}{4}$, một số không âm.

**Bước 1.** Chuyển $xy$ sang vế trái để chứng minh hiệu hai vế không âm.

**Bước 2.** Khai triển bình phương rồi quy đồng với mẫu $4$ để gom hiệu thành một phân thức.

**Bước 3.** Nhận ra tử là bình phương của một hiệu nên hiệu không âm, rồi tìm điều kiện của dấu bằng.

**Chú ý:** Bất đẳng thức này đúng với mọi số thực $x,y$ (điều kiện $x,y\ge0$ của đề không cần đến); đây cũng là dạng khác của bất đẳng thức $(x+y)^2\ge4xy$.

**Phần 2. Trình bày**

$\left(\dfrac{x+y}{2}\right)^2\ge xy\Leftrightarrow\left(\dfrac{x+y}{2}\right)^2-xy\ge0\Leftrightarrow\dfrac{x^2+2xy+y^2-4xy}{4}\ge0\Leftrightarrow\dfrac{(x-y)^2}{4}\ge0$.

Bất đẳng thức cuối đúng và các phép biến đổi đều tương đương nên bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $(x-y)^2=0$, tức $x=y$.

=== T8D1C2.9@p181
- bai: 9 · y: - · trang: 181 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · nhân hai vế với số dương · tính chất bắc cầu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: phân vân nhóm: bài chỉ dùng trực tiếp tính chất nhân hai vế và bắc cầu (theo luật lô 5 có thể là T18T020403); chọn T18T030101 vì đứng trong chuyên đề bất đẳng thức nâng cao.
## DE
Cho $a>b>0$, $c>d>0$. Chứng minh rằng $ac>bd$.
## SACH
$a>b$ và $c>0\Rightarrow ac>bc$ $(1)$
$c>d$ và $b>0\Rightarrow bc>bd$ $(2)$. Từ $(1)$ và $(2)$ theo tính chất bắc cầu của "$>$" suy ra: $ac>bd$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chỉ cần nhân hai vế của mỗi bất đẳng thức với một số dương thích hợp rồi bắc cầu qua số trung gian $bc$.

**Bước 1.** Nhân hai vế của $a>b$ với số dương $c$ để so sánh $ac$ với $bc$.

**Bước 2.** Nhân hai vế của $c>d$ với số dương $b$ để so sánh $bc$ với $bd$.

**Bước 3.** Dùng tính chất bắc cầu cho hai bất đẳng thức cùng chiều vừa có để so sánh $ac$ với $bd$.

**Chú ý:** Phải kiểm tra số nhân là dương trước khi nhân hai vế (ở đây $c>d>0$ và $b>0$); nhân với số âm thì đổi chiều.

**Phần 2. Trình bày**

Vì $a>b$ và $c>0$ nên $ac>bc$ $(1)$.

Vì $c>d$ và $b>0$ nên $bc>bd$ $(2)$.

Từ $(1)$ và $(2)$, theo tính chất bắc cầu, $ac>bd$.

Đây là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8D1C2.10@p181
- bai: 10 · y: - · trang: 181 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030103
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · làm trội · tách phân số $\dfrac{1}{k(k-1)}=\dfrac{1}{k-1}-\dfrac{1}{k}$ · triệt tiêu liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: lời giải sách dừng ở "Cộng vế theo vế, suy ra điều phải chứng minh"; lời giải kho viết đủ bước cộng và triệt tiêu.
## DE
Chứng minh rằng: $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}<1$ với $n\in\mathbb N$, $n>1$.
## SACH
Ta xét một hạng tử:
$\dfrac{1}{k^2}=\dfrac{1}{k\cdot k}<\dfrac{1}{k(k-1)}$ vì $k>k-1$. Mà $\dfrac{1}{k(k-1)}=\dfrac{1}{k-1}-\dfrac{1}{k}$
Do đó $\dfrac{1}{k^2}<\dfrac{1}{k-1}-\dfrac{1}{k}$. Thay vào ta có:
$\dfrac{1}{2^2}<\dfrac{1}{2-1}-\dfrac{1}{2};\ \dfrac{1}{3^2}<\dfrac{1}{3-1}-\dfrac{1}{3};\dots\dfrac{1}{n^2}<\dfrac{1}{n-1}-\dfrac{1}{n}$
Cộng vế theo vế, suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi hạng tử $\dfrac{1}{k^2}$ được "làm trội" lên $\dfrac{1}{k(k-1)}=\dfrac{1}{k-1}-\dfrac{1}{k}$; khi cộng lại, các số hạng ở giữa triệt tiêu từng cặp và chỉ còn đầu với cuối.

**Bước 1.** So sánh $\dfrac{1}{k^2}$ với $\dfrac{1}{k(k-1)}$ bằng cách so hai mẫu dương, với $k$ nguyên và $k\ge2$.

**Bước 2.** Tách $\dfrac{1}{k(k-1)}$ thành hiệu hai phân số liên tiếp để mỗi hạng tử bị chặn trên bởi một hiệu.

**Bước 3.** Viết bất đẳng thức đó lần lượt cho $k=2,3,\dots,n$ rồi cộng từng vế để các số hạng trung gian triệt tiêu.

**Bước 4.** Đánh giá phần còn lại sau khi triệt tiêu là một số nhỏ hơn $1$.

**Chú ý:** Phải chọn đúng phân số trội sao cho tách được thành hiệu hai phân số liên tiếp; nếu làm trội lệch đi thì tổng không triệt tiêu được.

**Phần 2. Trình bày**

Với mỗi số nguyên $k\ge2$ ta có $k^2>k(k-1)>0$, nên

$\dfrac{1}{k^2}<\dfrac{1}{k(k-1)}=\dfrac{1}{k-1}-\dfrac{1}{k}$.

Lần lượt cho $k=2,3,\dots,n$:

$\dfrac{1}{2^2}<\dfrac{1}{1}-\dfrac{1}{2};\ \dfrac{1}{3^2}<\dfrac{1}{2}-\dfrac{1}{3};\ \dots;\ \dfrac{1}{n^2}<\dfrac{1}{n-1}-\dfrac{1}{n}$.

Cộng từng vế $n-1$ bất đẳng thức trên:

$\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}<\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\dots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)=1-\dfrac{1}{n}<1$.

Đây là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8D1C2.11@p181
- bai: 11 · y: - · trang: 181 · tang: nang_cao
- nguon_de: Thi vô địch toán lớp 9, Liên Xô 1990
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · tách thành tổng hai bình phương · thêm bớt hạng tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Thi vô địch toán lớp 9, Liên Xô 1990) Chứng minh rằng với mọi số $t$ ta đều có: $t^4-t+\dfrac{1}{2}>0$.
## SACH
$t^4-t+\dfrac{1}{2}=\left(t^4+\dfrac{1}{4}-t^2\right)+\left(t^2+\dfrac{1}{4}-t\right)=\left(t^2-\dfrac{1}{2}\right)^2+\left(t-\dfrac{1}{2}\right)^2$
Biểu thức này luôn dương vì $t^2-\dfrac{1}{2}$ và $t-\dfrac{1}{2}$ không đồng thời bằng $0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc bốn $t^4-t+\dfrac{1}{2}$ tách được thành tổng hai bình phương $\left(t^2-\dfrac{1}{2}\right)^2+\left(t-\dfrac{1}{2}\right)^2$; tổng này chỉ bằng $0$ khi cả hai bình phương cùng bằng $0$, điều không thể xảy ra.

**Bước 1.** Tách số hạng $\dfrac{1}{2}$ thành $\dfrac{1}{4}+\dfrac{1}{4}$ để chuẩn bị ghép thành hai bình phương.

**Bước 2.** Thêm và bớt $t^2$ để mỗi nhóm hạng tử trở thành bình phương của một nhị thức.

**Bước 3.** Kết luận tổng hai bình phương không âm, rồi chỉ ra hai bình phương không thể cùng bằng $0$ nên tổng dương.

**Chú ý:** Tổng hai bình phương $\ge0$ chỉ cho bất đẳng thức không chặt; muốn kết luận $>0$ phải chứng tỏ hai biểu thức trong bình phương không đồng thời bằng $0$.

**Phần 2. Trình bày**

$t^4-t+\dfrac{1}{2}=\left(t^4-t^2+\dfrac{1}{4}\right)+\left(t^2-t+\dfrac{1}{4}\right)=\left(t^2-\dfrac{1}{2}\right)^2+\left(t-\dfrac{1}{2}\right)^2\ge0$.

Dấu bằng chỉ có thể xảy ra khi $t^2-\dfrac{1}{2}=0$ và $t-\dfrac{1}{2}=0$. Nhưng $t=\dfrac{1}{2}$ cho $t^2=\dfrac{1}{4}\neq\dfrac{1}{2}$, nên hai bình phương không thể cùng bằng $0$.

Vậy $t^4-t+\dfrac{1}{2}>0$ với mọi $t$; bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8D1C2.12a@p182
- bai: 12 · y: a · trang: 182 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · đặt ẩn phụ $a=b-k$, $d=c+k$ · biến đổi thành tổng các bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: ví dụ có hai ý a, b độc lập (ý b không dùng ý a); mỗi ý một câu, giả thiết chung của đề ghép vào từng ý. Ý a không phải bất đẳng thức (chứng minh một số là tổng ba số chính phương) nên không có dòng dấu bằng.
## DE
Cho $a,b,c,d$ là các số nguyên thỏa $a\le b\le c\le d$ và $a+d=b+c$. Chứng minh rằng $a^2+b^2+c^2+d^2$ là tổng của ba số chính phương.
## SACH
Cho $a,b,c,d$ là các số nguyên thoả $a\le b\le c\le d$ và $a+d=b+c$.
a) Vì $a\le b\le c\le d$ nên ta có thể đặt $a=b-k$ và $d=c+h$ $(h,k\in\mathbb N)$
Khi đó do $a+d=b+c\Leftrightarrow b+c+h-k=b+c\Leftrightarrow h=k$.
Vậy $a=b-k$ và $d=c+k$.
Do đó: $a^2+b^2+c^2+d^2=(b-k)^2+b^2+c^2+(c+k)^2$
$=2b^2+2c^2+2k^2-2bk+2ck$
$=b^2+2bc+c^2+b^2+c^2+k^2-2bc-2bk+2ck+k^2$
$=(b+c)^2+(b-c-k)^2+k^2$ là tổng của ba số chính phương
(do $b+c$, $b-c-k$ và $k$ là số nguyên)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+d=b+c$ cho $b-a=d-c$, nên đặt $k$ là hiệu chung đó và biểu diễn tất cả theo $b,c,k$; sau khi khai triển, tổng bình phương tách được thành $(b+c)^2+(b-c-k)^2+k^2$.

**Bước 1.** Đặt $a=b-k$ và $d=c+h$ với $h,k$ là số tự nhiên (nhờ $a\le b$ và $c\le d$), rồi dùng $a+d=b+c$ để chứng tỏ $h=k$.

**Bước 2.** Thay $a=b-k$ và $d=c+k$ vào $a^2+b^2+c^2+d^2$ rồi khai triển và thu gọn.

**Bước 3.** Viết kết quả thu gọn thành tổng ba bình phương của ba biểu thức nguyên bằng cách ghép hạng tử hợp lí.

**Chú ý:** Để kết luận là tổng ba số chính phương thì ba cơ số phải là số nguyên; ở đây $b+c$, $b-c-k$, $k$ đều nguyên vì $b,c,k$ nguyên.

**Phần 2. Trình bày**

Vì $a\le b\le c\le d$ nên có thể đặt $a=b-k$ và $d=c+h$ với $h,k\in\mathbb N$ (số nguyên không âm).

Từ $a+d=b+c$: $(b-k)+(c+h)=b+c\Leftrightarrow h=k$. Vậy $a=b-k$ và $d=c+k$.

$a^2+b^2+c^2+d^2=(b-k)^2+b^2+c^2+(c+k)^2=2b^2+2c^2+2k^2-2bk+2ck$

Mặt khác $(b+c)^2+(b-c-k)^2+k^2=b^2+2bc+c^2+b^2+c^2+k^2-2bc-2bk+2ck+k^2=2b^2+2c^2+2k^2-2bk+2ck$

Do đó $a^2+b^2+c^2+d^2=(b+c)^2+(b-c-k)^2+k^2$.

Vì $b+c$, $b-c-k$, $k$ là các số nguyên nên $a^2+b^2+c^2+d^2$ là tổng của ba số chính phương.

=== T8D1C2.12b@p182
- bai: 12 · y: b · trang: 182 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · đặt ẩn phụ $a=b-k$, $d=c+k$ · xét dấu từng số hạng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: cùng ví dụ số 12 với ý a; sách ở ý b dùng lại cách đặt $a=b-k$, $d=c+k$ của ý a, lời giải kho nêu lại cách đặt để câu tự đủ.
## DE
Cho $a,b,c,d$ là các số nguyên thỏa $a\le b\le c\le d$ và $a+d=b+c$. Chứng minh rằng $bc\ge ad$.
## SACH
Cho $a,b,c,d$ là các số nguyên thoả $a\le b\le c\le d$ và $a+d=b+c$.
b) Ta có $ad=(b-k)(c+k)=bc+bk-ck-k^2=bc+k(b-c)-k^2\le bc$ (vì $k\in\mathbb N$ và $b\le c$). Vậy $ad\le bc$ (điều phải chứng minh).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+d=b+c$ cho $b-a=d-c=k\ge0$, nên $ad=(b-k)(c+k)=bc+k(b-c)-k^2$ và hai số hạng sau $bc$ đều không dương.

**Bước 1.** Đặt $k=b-a$ rồi chứng tỏ $d-c$ cũng bằng $k$ và $k\ge0$ nhờ $a\le b$ và $a+d=b+c$.

**Bước 2.** Khai triển $ad=(b-k)(c+k)$ rồi nhóm lại để xuất hiện tích $bc$.

**Bước 3.** Xét dấu hai số hạng còn lại nhờ $k\ge0$ và $b\le c$ để so sánh $ad$ với $bc$.

**Chú ý:** Số hạng $k(b-c)$ không dương là nhờ $k\ge0$ và $b-c\le0$; phải nêu rõ cả hai điều kiện này.

**Phần 2. Trình bày**

Đặt $k=b-a$ và $h=d-c$. Vì $a\le b$ và $c\le d$ nên $h,k$ là các số nguyên không âm. Từ $a+d=b+c$ suy ra $b-a=d-c$, tức $h=k$. Vậy $a=b-k$ và $d=c+k$ với $k\ge0$.

$ad=(b-k)(c+k)=bc+bk-ck-k^2=bc+k(b-c)-k^2$

Vì $k\ge0$ và $b\le c$ nên $k(b-c)\le0$; lại có $-k^2\le0$. Do đó $ad\le bc$, tức $bc\ge ad$.

Dấu bằng xảy ra khi $k(b-c)=0$ và $k^2=0$, tức $k=0$, nghĩa là $a=b$ và $c=d$.

=== T8D1C2.13@p182
- bai: 13 · y: - · trang: 182 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · hằng đẳng thức tổng hai lập phương · bất đẳng thức $(a-b)^2(a+b)\ge0$ · lập phương giữ nguyên thứ tự
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b$ là hai số thực thỏa $a^3+b^3=2$. Chứng minh rằng $0<a+b\le2$.
## SACH
Cho $a,b$ là hai số thực sao cho $a^3+b^3=2$. Chứng minh $0<a+b\le2$.
Ta có: $a^3+b^3>0\Rightarrow a^3>-b^3\Rightarrow a>-b\Rightarrow a+b>0$ $(1)$
$(a-b)^2(a+b)\ge0\Rightarrow(a^2-b^2)(a-b)\ge0\Rightarrow a^3+b^3-ab(a+b)\ge0$
$\Rightarrow a^3+b^3\ge ab(a+b)\Rightarrow3(a^3+b^3)\ge3ab(a+b)$
$\Rightarrow4(a^3+b^3)\ge(a+b)^3\Rightarrow8\ge(a+b)^3\Rightarrow a+b\le2$ $(2)$
Từ $(1)$ và $(2)\Rightarrow0<a+b\le2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chứng minh riêng hai phần của kết luận: $a+b>0$ từ $a^3+b^3>0$; còn $a+b\le2$ từ $(a-b)^2(a+b)\ge0$ cho $4(a^3+b^3)\ge(a+b)^3$, rồi thay $a^3+b^3=2$.

**Bước 1.** Chứng minh $a+b>0$ bằng phản chứng: nếu $a+b\le0$ thì lập phương của hai số $a$ và $-b$ so sánh được và dẫn đến $a^3+b^3\le0$.

**Bước 2.** Dùng $a+b>0$ để nhân vào $(a-b)^2\ge0$ rồi khai triển thành $a^3+b^3\ge ab(a+b)$.

**Bước 3.** Nhân hai vế với $3$ rồi cộng $a^3+b^3$ vào hai vế để dựng được $(a+b)^3$ ở vế phải.

**Bước 4.** Thay $a^3+b^3=2$ để so sánh $(a+b)^3$ với $8$ rồi suy ra $a+b\le2$.

**Chú ý:** Hai số có lập phương so sánh theo cùng chiều với chính hai số đó ($u\le v\Leftrightarrow u^3\le v^3$), nên từ $(a+b)^3\le8$ suy ra được $a+b\le2$; nhưng với bình phương thì không có tính chất này.

**Phần 2. Trình bày**

Phần 1: $a+b>0$. Giả sử $a+b\le0$ thì $a\le-b$, nên $a^3\le(-b)^3=-b^3$, suy ra $a^3+b^3\le0$, trái với $a^3+b^3=2$. Vậy $a+b>0$ $(1)$.

Phần 2: $a+b\le2$. Vì $a+b>0$ và $(a-b)^2\ge0$ nên $(a-b)^2(a+b)\ge0$.

$\Leftrightarrow(a^2-b^2)(a-b)\ge0\Leftrightarrow a^3+b^3-ab(a+b)\ge0\Leftrightarrow a^3+b^3\ge ab(a+b)$

$\Rightarrow3(a^3+b^3)\ge3ab(a+b)$

$\Rightarrow4(a^3+b^3)\ge a^3+3ab(a+b)+b^3=(a+b)^3$

Do $a^3+b^3=2$ nên $8\ge(a+b)^3$. Nếu $a+b>2$ thì $(a+b)^3>8$, vô lí; vậy $a+b\le2$ $(2)$.

Từ $(1)$ và $(2)$ suy ra $0<a+b\le2$.

Dấu bằng $a+b=2$ xảy ra khi $(a-b)^2(a+b)=0$, tức $a=b$ (vì $a+b>0$); kết hợp $a^3+b^3=2$ được $a=b=1$.

=== T8D1C2.14@p182
- bai: 14 · y: - · trang: 182 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 2: Dùng các phép biến đổi tương đương · giá trị tuyệt đối · hai số cùng dấu · bình phương hai vế không âm · đặt ẩn phụ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: lời giải của sách tràn sang trang PDF 183 (hết ở "Chú ý" về 8 trường hợp). Dòng "Lúc này" của sách in $\lvert y+x-z\rvert$ cho số thứ hai (đáng ra $\lvert y+z-x\rvert=\lvert b\rvert$) — chép như đọc được, không chắc ảnh in đúng chữ nào. Sách kết luận dấu bằng bằng lời "a,b,c,a+b+c chia làm 2 cặp cùng dấu"; lời giải kho nêu điều kiện chính xác theo lập luận.
## DE
Chứng minh với mọi số thực $x,y,z$ luôn có: $\lvert x+y-z\rvert+\lvert y+z-x\rvert+\lvert z+x-y\rvert+\lvert x+y+z\rvert\ge2\left(\lvert x\rvert+\lvert y\rvert+\lvert z\rvert\right)$ $(*)$.
## SACH
Đặt: $a=x+y-z$, $b=y+z-x$, $c=z+x-y$. Trong ba số $a,b,c$ bao giờ cũng có ít nhất hai số cùng dấu, chẳng hạn: $a\cdot b\ge0$.
Lúc này: $\lvert x+y-z\rvert+\lvert y+x-z\rvert=\lvert a\rvert+\lvert b\rvert=\lvert a+b\rvert=2\lvert y\rvert$
Ta có: $x+y+z=a+b+c$; $2x=a+c$; $2z=b+c$. Do đó để chứng minh $(*)$ đúng, chỉ cần chứng tỏ: $\lvert c\rvert+\lvert a+b+c\rvert\ge\lvert a+c\rvert+\lvert b+c\rvert$ $(**)$ đúng với $a\cdot b\ge0$. Ta có:
$(**)\Leftrightarrow\lvert c\rvert\cdot\lvert a+b+c\rvert+ab\ge\lvert a+c\rvert\cdot\lvert b+c\rvert$
$\Leftrightarrow\lvert ca+cb+c^2\rvert+ab\ge\lvert(ca+cb+c^2)+ab\rvert$ $(***)$
Đặt: $ca+cb+c^2=A$; $ab=B$, ta có $B=\lvert B\rvert$ (do $a\cdot b\ge0$) ta có: $(***)$
$\Leftrightarrow\lvert A\rvert+\lvert B\rvert\ge\lvert A+B\rvert\Leftrightarrow\lvert A\rvert\lvert B\rvert\ge AB\Leftrightarrow\lvert AB\rvert\ge AB$.
Dấu đẳng thức xảy ra trong trường hợp các số: $a,b,c,a+b+c$ chia làm 2 cặp cùng dấu. Ví dụ: $ab\ge0$ và $c(a+b+c)\ge0$.
Chú ý: Có thể chia ra các trường hợp tùy theo dấu của $a,b,c$ (có 8 trường hợp) để chứng minh $(*)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $a,b,c$ là ba biểu thức nằm trong dấu giá trị tuyệt đối; ba số này luôn có hai số cùng dấu nên rút gọn được hai giá trị tuyệt đối, phần còn lại quy về bất đẳng thức đúng $\lvert AB\rvert\ge AB$.

**Bước 1.** Đặt ẩn phụ $a,b,c$ rồi biểu diễn $x+y+z$, $2x$, $2y$, $2z$ theo $a,b,c$ để thấy các giá trị tuyệt đối ở hai vế liên hệ với nhau.

**Bước 2.** Nhận xét trong ba số $a,b,c$ có hai số cùng dấu, giả sử $ab\ge0$, để viết được $\lvert a\rvert+\lvert b\rvert=\lvert a+b\rvert$.

**Bước 3.** Rút gọn hai vế về một bất đẳng thức chỉ chứa $c$, $a+b+c$, $a+c$, $b+c$ rồi bình phương hai vế không âm.

**Bước 4.** Đặt thêm ẩn phụ $A$ và $B$ để đưa về $\lvert AB\rvert\ge AB$, rồi tìm điều kiện của dấu bằng.

**Chú ý:** $\lvert u\rvert+\lvert v\rvert=\lvert u+v\rvert$ chỉ đúng khi $uv\ge0$, nên phải chọn được cặp cùng dấu trước khi gộp giá trị tuyệt đối; cũng có thể chia $8$ trường hợp theo dấu của $a,b,c$.

**Phần 2. Trình bày**

Đặt $a=x+y-z$, $b=y+z-x$, $c=z+x-y$. Khi đó $a+b=2y$, $b+c=2z$, $c+a=2x$ và $a+b+c=x+y+z$.

Trong ba số $a,b,c$ có hai số cùng dấu (cùng không âm hoặc cùng âm); vai trò của $x,y,z$ như nhau nên có thể giả sử $ab\ge0$.

Vì $ab\ge0$ nên $(\lvert a\rvert+\lvert b\rvert)^2=a^2+b^2+2ab=(a+b)^2$, suy ra $\lvert a\rvert+\lvert b\rvert=\lvert a+b\rvert=2\lvert y\rvert$.

Vế trái của $(*)$ bằng $2\lvert y\rvert+\lvert c\rvert+\lvert a+b+c\rvert$; vế phải bằng $\lvert a+c\rvert+2\lvert y\rvert+\lvert b+c\rvert$ (vì $2\lvert x\rvert=\lvert a+c\rvert$, $2\lvert z\rvert=\lvert b+c\rvert$). Do đó

$(*)\Leftrightarrow\lvert c\rvert+\lvert a+b+c\rvert\ge\lvert a+c\rvert+\lvert b+c\rvert$ $(**)$

Hai vế của $(**)$ đều không âm nên bình phương hai vế:

$(**)\Leftrightarrow c^2+(a+b+c)^2+2\lvert c\rvert\lvert a+b+c\rvert\ge(a+c)^2+(b+c)^2+2\lvert a+c\rvert\lvert b+c\rvert$

Vì $c^2+(a+b+c)^2-(a+c)^2-(b+c)^2=2ab$ nên

$(**)\Leftrightarrow ab+\lvert c(a+b+c)\rvert\ge\lvert(a+c)(b+c)\rvert$ $(***)$

Đặt $A=c(a+b+c)=ca+cb+c^2$ và $B=ab$. Khi đó $(a+c)(b+c)=A+B$ và $B\ge0$ nên $B=\lvert B\rvert$. Do đó

$(***)\Leftrightarrow\lvert A\rvert+\lvert B\rvert\ge\lvert A+B\rvert$

$\Leftrightarrow A^2+B^2+2\lvert A\rvert\lvert B\rvert\ge A^2+B^2+2AB$ (hai vế không âm, bình phương)

$\Leftrightarrow\lvert AB\rvert\ge AB$ (luôn đúng).

Bất đẳng thức cuối đúng và mọi phép biến đổi đều tương đương nên bất đẳng thức $(*)$ đúng.

Dấu bằng xảy ra khi $\lvert AB\rvert=AB$, tức $AB\ge0$. Với cách chọn $ab\ge0$ ở trên, điều đó xảy ra khi $ab=0$ hoặc $c(a+b+c)\ge0$.
