=== T8D1C2.15@p183
- bai: 15 · y: - · trang: 183 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · hằng đẳng thức a³+b³ · cộng từng vế các bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c>0$. Chứng minh rằng: $\dfrac{a^3+b^3}{2ab}+\dfrac{b^3+c^3}{2bc}+\dfrac{c^3+a^3}{2ca}\ge a+b+c$.
## SACH
Ta có: $a>0;b>0$: $(a+b)(a-b)^2\ge0\Leftrightarrow(a+b)\left[(a^2-ab+b^2)-ab\right]\ge0$
$\Leftrightarrow(a+b)(a^2-ab+b^2)-ab(a+b)\ge0\Leftrightarrow a^3+b^3-ab(a+b)\ge0$
$\Leftrightarrow a^3+b^3\ge ab(a+b)\Leftrightarrow\dfrac{a^3+b^3}{2ab}\ge\dfrac{a+b}{2}$. Tương tự ta có:
$\dfrac{b^3+c^3}{2bc}\ge\dfrac{b+c}{2}$; $\dfrac{c^3+a^3}{2ca}\ge\dfrac{c+a}{2}$. Cộng từng vế ba bất đẳng thức trên ta có:
$\dfrac{a^3+b^3}{2ab}+\dfrac{b^3+c^3}{2bc}+\dfrac{c^3+a^3}{2ca}\ge\dfrac{a+b}{2}+\dfrac{b+c}{2}+\dfrac{c+a}{2}$
$\Leftrightarrow\dfrac{a^3+b^3}{2ab}+\dfrac{b^3+c^3}{2bc}+\dfrac{c^3+a^3}{2ca}\ge a+b+c$
Vậy bất đẳng thức đã được chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi phân thức ở vế trái có dạng $\dfrac{x^3+y^3}{2xy}$ với $x,y>0$; chỉ cần chứng minh mỗi phân thức không nhỏ hơn trung bình cộng của hai biến rồi cộng ba bất đẳng thức cùng chiều.

**Bước 1.** Chọn một cặp biến dương, chẳng hạn $a,b$, và quy bất đẳng thức $\dfrac{a^3+b^3}{2ab}\ge\dfrac{a+b}{2}$ về bất đẳng thức không còn mẫu bằng cách nhân hai vế với số dương $2ab$.

**Bước 2.** Chuyển vế, phân tích $a^3+b^3$ theo hằng đẳng thức rồi đặt $a+b$ làm nhân tử chung để thấy vế trái là tích của một số dương với một bình phương.

**Bước 3.** Viết hai bất đẳng thức tương tự cho cặp $(b,c)$ và cặp $(c,a)$, vì ba cặp biến có vai trò hoán vị vòng quanh.

**Bước 4.** Cộng từng vế ba bất đẳng thức cùng chiều rồi rút gọn tổng ở vế phải để được điều phải chứng minh.

**Chú ý:** Chỉ được cộng từng vế các bất đẳng thức cùng chiều; khi nhân hai vế với $2ab$ phải ghi rõ $2ab>0$ để chiều bất đẳng thức không đổi.

**Phần 2. Trình bày**

Với $a,b>0$ ta có:

$\dfrac{a^3+b^3}{2ab}\ge\dfrac{a+b}{2}$

$\Leftrightarrow a^3+b^3\ge ab(a+b)$ (nhân hai vế với $2ab>0$)

$\Leftrightarrow(a+b)(a^2-ab+b^2)-ab(a+b)\ge0$

$\Leftrightarrow(a+b)(a-b)^2\ge0$.

Bất đẳng thức cuối đúng vì $a+b>0$ và $(a-b)^2\ge0$, nên $\dfrac{a^3+b^3}{2ab}\ge\dfrac{a+b}{2}$ $(1)$, dấu bằng xảy ra khi $a=b$.

Tương tự, với $b,c>0$ và $c,a>0$:

$\dfrac{b^3+c^3}{2bc}\ge\dfrac{b+c}{2}$ $(2)$ ; $\dfrac{c^3+a^3}{2ca}\ge\dfrac{c+a}{2}$ $(3)$.

Cộng từng vế $(1),(2),(3)$:

$\dfrac{a^3+b^3}{2ab}+\dfrac{b^3+c^3}{2bc}+\dfrac{c^3+a^3}{2ca}\ge\dfrac{a+b}{2}+\dfrac{b+c}{2}+\dfrac{c+a}{2}=a+b+c$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $a=b=c$.

=== T8D1C2.16@p183
- bai: 16 · y: - · trang: 183 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · làm trội · tách phân số $\dfrac{1}{n(n+1)}=\dfrac1n-\dfrac1{n+1}$ · tổng thu gọn
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: số hạng tổng quát $\dfrac{1}{n^2+(n+1)^2}$ không nêu trong đề (đề chỉ ghi 5, 13, …, 2002²+2003²); số hạng cuối ứng với $n=2002$, kho giải theo đó.
## DE
Chứng minh rằng: $\dfrac{1}{5}+\dfrac{1}{13}+\dots+\dfrac{1}{2002^2+2003^2}<\dfrac{1}{2}$.
## SACH
$\dfrac{1}{5}+\dfrac{1}{13}+\dots+\dfrac{1}{2002^2+2003^2}<\dfrac{1}{2}$
Ta có: $\dfrac{1}{n^2+(n+1)^2}=\dfrac{1}{2n^2+2n+1}<\dfrac{1}{2n(n+1)}=\dfrac{1}{2}\left(\dfrac{1}{n}-\dfrac{1}{n+1}\right)$
Với $n=1$: $\dfrac{1}{2^2+1^2}=\dfrac{1}{5}<\dfrac{1}{2}\left(1-\dfrac{1}{2}\right)$. Với $n=2$: $\dfrac{1}{3^2+2^2}=\dfrac{1}{13}<\dfrac{1}{2}\left(\dfrac{1}{2}-\dfrac{1}{3}\right)$
Do đó $\dfrac{1}{5}+\dfrac{1}{13}+\dots+\dfrac{1}{2002^2+2003^2}<\dfrac{1}{2}\left(1-\dfrac{1}{2003}\right)<\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các mẫu $5=1^2+2^2$, $13=2^2+3^2$, … cho thấy số hạng tổng quát là $\dfrac{1}{n^2+(n+1)^2}$; làm trội mẫu để mỗi số hạng nhỏ hơn một hiệu hai phân số liền nhau, rồi cộng lại thì các số hạng giữa triệt tiêu.

**Bước 1.** Nhận ra quy luật của các mẫu để viết số hạng tổng quát $\dfrac{1}{n^2+(n+1)^2}$ và xác định tổng đi từ $n=1$ đến $n=2002$.

**Bước 2.** Khai triển mẫu rồi giảm mẫu đi $1$ đơn vị để được một phân thức lớn hơn nhưng có mẫu là tích hai số nguyên liên tiếp.

**Bước 3.** Tách phân thức vừa có thành hiệu của hai phân số có mẫu $n$ và $n+1$, viết bất đẳng thức đó cho từng $n=1,2,\dots,2002$.

**Bước 4.** Cộng từng vế các bất đẳng thức, chú ý các số hạng ở giữa triệt tiêu nhau, rồi so sánh kết quả với $\dfrac12$.

**Chú ý:** Làm trội phải đúng chiều: giảm mẫu thì phân số tăng lên nên mới viết được dấu $<$; nếu thay đổi mẫu theo chiều ngược lại thì không kết luận được gì về tổng.

**Phần 2. Trình bày**

Với mọi số nguyên dương $n$ ta có $n^2+(n+1)^2=2n^2+2n+1>2n(n+1)>0$, nên

$\dfrac{1}{n^2+(n+1)^2}<\dfrac{1}{2n(n+1)}=\dfrac{1}{2}\left(\dfrac{1}{n}-\dfrac{1}{n+1}\right)$.

Các số hạng của tổng ứng với $n=1,2,\dots,2002$ (vì $\dfrac15=\dfrac{1}{1^2+2^2}$, $\dfrac{1}{13}=\dfrac{1}{2^2+3^2}$, số hạng cuối là $\dfrac{1}{2002^2+2003^2}$). Cộng từng vế $2002$ bất đẳng thức:

$\dfrac{1}{5}+\dfrac{1}{13}+\dots+\dfrac{1}{2002^2+2003^2}<\dfrac{1}{2}\left[\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\dots+\left(\dfrac{1}{2002}-\dfrac{1}{2003}\right)\right]$

$=\dfrac{1}{2}\left(1-\dfrac{1}{2003}\right)<\dfrac{1}{2}$.

Vậy $\dfrac{1}{5}+\dfrac{1}{13}+\dots+\dfrac{1}{2002^2+2003^2}<\dfrac{1}{2}$. Bất đẳng thức là chặt (mọi bước đều có dấu $<$) nên không xảy ra dấu bằng.

=== T8D1C2.17@p184
- bai: 17 · y: - · trang: 184 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · quy đồng, đưa về tích hai nhân tử không âm · hoàn thành bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: lời giải sách dừng ở dòng cuối (tích ≥ 0) không kết luận và không nêu điều kiện dấu bằng; kho viết đủ. Cùng bất đẳng thức với Cách 4 Ví dụ 5 (đề trùng, khác cách giải).
## DE
Chứng minh rằng với mọi $x,y\neq0$, ta có: $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+4\ge3\left(\dfrac{x}{y}+\dfrac{y}{x}\right)$.
## SACH
Biến đổi tương đương: $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+4\ge3\left(\dfrac{x}{y}+\dfrac{y}{x}\right)$
$\Leftrightarrow(x^2+y^2)^2-(x^2+y^2)xy+2x^2y^2-2xy(x^2+y^2)\ge0$
$\Leftrightarrow(x^2+y^2-xy)(x^2+y^2-2xy)\ge0\Leftrightarrow\left[\left(x-\dfrac{y}{2}\right)^2+\dfrac{3y^2}{4}\right](x-y)^2\ge0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức chứa $\dfrac{x^2}{y^2}$ và $\dfrac{x}{y}$ nên nhân hai vế với $x^2y^2>0$ để khử mẫu, rồi thu về một tích hai nhân tử mà nhân tử nào cũng không âm.

**Bước 1.** Nhân cả hai vế với $x^2y^2>0$ để mất mẫu, ghi rõ vì sao chiều bất đẳng thức không đổi.

**Bước 2.** Viết $x^4+y^4$ qua $(x^2+y^2)^2$ và đặt $x^2+y^2$ làm biến chung để vế trái trở thành một tam thức theo $x^2+y^2$ và $xy$.

**Bước 3.** Phân tích vế trái thành tích hai nhân tử bậc hai, trong đó một nhân tử là $(x-y)^2$.

**Bước 4.** Chứng tỏ nhân tử còn lại luôn dương bằng cách hoàn thành bình phương, rồi tìm điều kiện để dấu bằng xảy ra.

**Chú ý:** Nhân tử $x^2+y^2-xy$ dương vì $y\neq0$, không phải chỉ không âm; vì vậy dấu bằng chỉ đến từ nhân tử $(x-y)^2$.

**Phần 2. Trình bày**

Với $x,y\neq0$ ta có $x^2y^2>0$.

$\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+4\ge3\left(\dfrac{x}{y}+\dfrac{y}{x}\right)$

$\Leftrightarrow x^4+y^4+4x^2y^2\ge3xy(x^2+y^2)$ (nhân hai vế với $x^2y^2>0$)

$\Leftrightarrow(x^2+y^2)^2+2x^2y^2-3xy(x^2+y^2)\ge0$ (vì $x^4+y^4=(x^2+y^2)^2-2x^2y^2$)

$\Leftrightarrow(x^2+y^2-xy)(x^2+y^2-2xy)\ge0$

$\Leftrightarrow\left[\left(x-\dfrac{y}{2}\right)^2+\dfrac{3y^2}{4}\right](x-y)^2\ge0$.

Bất đẳng thức cuối đúng vì $\left(x-\dfrac{y}{2}\right)^2+\dfrac{3y^2}{4}>0$ (do $y\neq0$) và $(x-y)^2\ge0$. Vậy bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $(x-y)^2=0$, tức $x=y$.

=== T8D1C2.18@p184
- bai: 18 · y: - · trang: 184 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · hằng đẳng thức a³+b³ · đặt nhân tử chung
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $a^3+b^3\ge a^2b+ab^2$ với $a>0$, $b>0$.
## SACH
$a^3+b^3\ge a^2b+ab^2\Leftrightarrow a^3+b^3-a^2b-ab^2\ge0$
$\Leftrightarrow(a+b)(a^2-ab+b^2)-ab(a+b)\ge0$
$\Leftrightarrow(a+b)(a^2-ab+b^2-ab)\ge0$
$\Leftrightarrow(a+b)(a-b)^2\ge0$ (Bất đẳng thức này luôn đúng)
Vậy $a^3+b^3\ge a^2b+ab^2$ là bất đẳng thức đúng.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển mọi hạng tử sang một vế, nhận ra $a^3+b^3$ phân tích được bằng hằng đẳng thức và $a^2b+ab^2=ab(a+b)$, từ đó xuất hiện nhân tử chung $a+b$.

**Bước 1.** Chuyển vế để so sánh hiệu $a^3+b^3-a^2b-ab^2$ với $0$.

**Bước 2.** Phân tích $a^3+b^3$ thành $(a+b)(a^2-ab+b^2)$ và viết $a^2b+ab^2$ thành $ab(a+b)$ để đặt được nhân tử chung $a+b$.

**Bước 3.** Gộp phần còn lại trong ngoặc thành một bình phương, rồi dùng điều kiện $a,b>0$ để kết luận dấu của tích.

**Chú ý:** Điều kiện $a,b>0$ được dùng ở đúng một chỗ là $a+b>0$; với $a,b$ khác dấu thì bất đẳng thức có thể sai.

**Phần 2. Trình bày**

$a^3+b^3\ge a^2b+ab^2$

$\Leftrightarrow a^3+b^3-a^2b-ab^2\ge0$

$\Leftrightarrow(a+b)(a^2-ab+b^2)-ab(a+b)\ge0$

$\Leftrightarrow(a+b)(a^2-2ab+b^2)\ge0$

$\Leftrightarrow(a+b)(a-b)^2\ge0$.

Bất đẳng thức cuối đúng vì $a+b>0$ và $(a-b)^2\ge0$. Vậy $a^3+b^3\ge a^2b+ab^2$ với $a,b>0$.

Dấu bằng xảy ra khi $a=b$.

=== T8D1C2.19@p184
- bai: 19 · y: - · trang: 184 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · tách $\dfrac{a}{b+c}-\dfrac12$ · nhóm theo hiệu $a-b$, $b-c$, $c-a$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách giả thiết a ≥ b ≥ c rồi kết thúc bằng "hiển nhiên theo giả thiết ban đầu"; kho bỏ giả thiết này (mỗi số hạng cuối đã là bình phương chia mẫu dương) và viết đủ bước. Dòng 3 của sách thiếu ½ (đã nhân hai vế với 2, kho ghi rõ).
## DE
Chứng minh rằng $a,b,c$ là các số dương bất kì, ta có: $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{3}{2}$.
## SACH
Có thể giả thiết $a\ge b\ge c$. Khi đó: $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{3}{2}$
$\Leftrightarrow\dfrac{a}{b+c}-\dfrac12+\dfrac{b}{c+a}-\dfrac12+\dfrac{c}{a+b}-\dfrac12\ge0$
$\Leftrightarrow\dfrac{a-b+a-c}{b+c}+\dfrac{b-c+b-a}{c+a}+\dfrac{c-a+c-b}{a+b}\ge0$
$\Leftrightarrow(a-b)\left(\dfrac{1}{b+c}-\dfrac{1}{c+a}\right)+(b-c)\left(\dfrac{1}{c+a}-\dfrac{1}{a+b}\right)+(c-a)\left(\dfrac{1}{a+b}-\dfrac{1}{b+c}\right)\ge0$
Bất đẳng thức sau cùng hiển nhiên theo giả thiết ban đầu.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trừ $\dfrac12$ ở mỗi phân số để mọi tử có dạng hiệu hai biến, rồi nhóm các tử theo $a-b$, $b-c$, $c-a$ để mỗi nhóm có dạng một hiệu nhân với hiệu của hai phân số.

**Bước 1.** Chuyển $\dfrac32$ sang vế trái dưới dạng ba số $\dfrac12$, mỗi số trừ vào một phân số, rồi quy đồng từng cặp để tử của mỗi phân số là một tổng hai hiệu.

**Bước 2.** Nhóm các hiệu giống nhau lại với nhau, được ba nhóm dạng $(a-b)\left(\dfrac{1}{b+c}-\dfrac{1}{c+a}\right)$.

**Bước 3.** Quy đồng hiệu trong mỗi ngoặc để thấy mỗi nhóm bằng một bình phương chia cho tích hai số dương.

**Bước 4.** Kết luận tổng ba số không âm là không âm rồi nêu khi nào dấu bằng xảy ra.

**Chú ý:** Có thể giả sử $a\ge b\ge c$ để thấy ngay dấu của từng tích, nhưng nếu đưa mỗi nhóm về dạng bình phương thì không cần giả sử gì thêm.

**Phần 2. Trình bày**

Với $a,b,c>0$:

$\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{3}{2}$

$\Leftrightarrow\left(\dfrac{a}{b+c}-\dfrac12\right)+\left(\dfrac{b}{c+a}-\dfrac12\right)+\left(\dfrac{c}{a+b}-\dfrac12\right)\ge0$

$\Leftrightarrow\dfrac{(a-b)+(a-c)}{b+c}+\dfrac{(b-c)+(b-a)}{c+a}+\dfrac{(c-a)+(c-b)}{a+b}\ge0$ (nhân hai vế với $2>0$)

$\Leftrightarrow(a-b)\left(\dfrac{1}{b+c}-\dfrac{1}{c+a}\right)+(b-c)\left(\dfrac{1}{c+a}-\dfrac{1}{a+b}\right)+(c-a)\left(\dfrac{1}{a+b}-\dfrac{1}{b+c}\right)\ge0$ (nhóm theo $a-b$, $b-c$, $c-a$)

$\Leftrightarrow\dfrac{(a-b)^2}{(b+c)(c+a)}+\dfrac{(b-c)^2}{(c+a)(a+b)}+\dfrac{(c-a)^2}{(a+b)(b+c)}\ge0$

vì $\dfrac{1}{b+c}-\dfrac{1}{c+a}=\dfrac{a-b}{(b+c)(c+a)}$, $\dfrac{1}{c+a}-\dfrac{1}{a+b}=\dfrac{b-c}{(c+a)(a+b)}$, $\dfrac{1}{a+b}-\dfrac{1}{b+c}=\dfrac{c-a}{(a+b)(b+c)}$.

Bất đẳng thức cuối đúng vì mỗi số hạng có tử là một bình phương, mẫu dương. Vậy bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $a=b=c$.

=== T8D1C2.20@p184
- bai: 20 · y: - · trang: 184 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · bất đẳng thức tam giác · đổi $p-a=\dfrac{b+c-a}{2}$ · quy đồng từng cặp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: dòng 3 của sách in tử $2(a-b)^2$ và mẫu $(b+c-a)(a+c-b)$ (không có thừa số $c$), tương tự hai số hạng còn lại; kiểm với $a=2$, $b=1$, $c=2$ thì vế trái của dòng 2 bằng $\dfrac13$ nhưng tổng ở dòng 3 bằng $\dfrac43$, nên dòng 3 in sai (đúng là $\dfrac{(a-b)^2}{c(b+c-a)(a+c-b)}+\dots$). Kết luận ≥ 0 vẫn đúng. Kho giải lại đúng, không dùng dòng 3 của sách.
## DE
Chứng minh rằng ta có: $\dfrac{1}{p-a}+\dfrac{1}{p-b}+\dfrac{1}{p-c}\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$ với $a,b,c$ là ba cạnh và $p$ là nửa chu vi của một tam giác.
## SACH
Ta có: $\dfrac{1}{p-a}+\dfrac{1}{p-b}+\dfrac{1}{p-c}\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$
$\Leftrightarrow\dfrac{1}{b+c-a}-\dfrac{1}{a}+\dfrac{1}{a+c-b}-\dfrac{1}{b}+\dfrac{1}{a+b-c}-\dfrac{1}{c}\ge0$
$\Leftrightarrow\dfrac{2(a-b)^2}{(b+c-a)(a+c-b)}+\dfrac{2(b-c)^2}{(a+c-b)(a+b-c)}+\dfrac{2(c-a)^2}{(a+b-c)(b+c-a)}\ge0$
Bất đẳng thức cuối cùng hiển nhiên đúng do các bất đẳng thức của ba cạnh trong một tam giác.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $p=\dfrac{a+b+c}{2}$ thì $p-a=\dfrac{b+c-a}{2}$ nên bất đẳng thức đưa được về các phân thức có mẫu $b+c-a$, $a+c-b$, $a+b-c$ đều dương; hai mẫu bất kì trong ba mẫu đó có tổng bằng hai lần một cạnh nên có thể ghép mỗi cặp với một phân số $\dfrac{2}{c}$, $\dfrac{2}{a}$ hoặc $\dfrac{2}{b}$.

**Bước 1.** Đặt $x=b+c-a$, $y=a+c-b$, $z=a+b-c$, chứng tỏ cả ba số dương nhờ bất đẳng thức tam giác và rút ra $x+y=2c$, $y+z=2a$, $z+x=2b$.

**Bước 2.** Viết lại $p-a,\ p-b,\ p-c$ qua $x,y,z$ và rút gọn bất đẳng thức đã cho về dạng $\dfrac1x+\dfrac1y+\dfrac1z\ge\dfrac1a+\dfrac1b+\dfrac1c$.

**Bước 3.** Với mỗi cặp, chẳng hạn $x,y$, quy đồng hiệu $\dfrac1x+\dfrac1y-\dfrac2c$ rồi dùng $xy=c^2-(a-b)^2$ để đưa tử về một bình phương.

**Bước 4.** Làm tương tự cho hai cặp còn lại rồi cộng ba đẳng thức để suy ra kết luận.

**Chú ý:** Phải dùng đúng điều kiện ba cạnh của tam giác để $x,y,z>0$; thiếu điều kiện đó thì mẫu có thể âm hoặc bằng $0$ và các phép biến đổi mất nghĩa.

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh của một tam giác nên $x=b+c-a>0$, $y=a+c-b>0$, $z=a+b-c>0$, và $x+y=2c$, $y+z=2a$, $z+x=2b$. Do $p=\dfrac{a+b+c}{2}$ nên $p-a=\dfrac{x}{2}$, $p-b=\dfrac{y}{2}$, $p-c=\dfrac{z}{2}$.

$\dfrac{1}{p-a}+\dfrac{1}{p-b}+\dfrac{1}{p-c}\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$

$\Leftrightarrow\dfrac{2}{x}+\dfrac{2}{y}+\dfrac{2}{z}\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$

$\Leftrightarrow\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$ $(*)$.

Ta có $x=c+(b-a)$, $y=c-(b-a)$ nên $xy=c^2-(a-b)^2$. Do đó

$\dfrac{1}{x}+\dfrac{1}{y}-\dfrac{2}{c}=\dfrac{x+y}{xy}-\dfrac{2}{c}=\dfrac{2c}{xy}-\dfrac{2}{c}=\dfrac{2\left(c^2-xy\right)}{c\,xy}=\dfrac{2(a-b)^2}{c\,xy}$.

Hoàn toàn tương tự (với $y=a-(b-c)$, $z=a+(b-c)$ và $z=b+(a-c)$, $x=b-(a-c)$):

$\dfrac{1}{y}+\dfrac{1}{z}-\dfrac{2}{a}=\dfrac{2(b-c)^2}{a\,yz}$ ; $\dfrac{1}{z}+\dfrac{1}{x}-\dfrac{2}{b}=\dfrac{2(c-a)^2}{b\,zx}$.

Cộng ba đẳng thức:

$2\left[\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}-\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\right]=\dfrac{2(a-b)^2}{c\,xy}+\dfrac{2(b-c)^2}{a\,yz}+\dfrac{2(c-a)^2}{b\,zx}\ge0$

vì mỗi số hạng có tử là bình phương và mẫu dương. Suy ra $(*)$ đúng, tức bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $a=b=c$ (tam giác đều).

=== T8D1C2.21@p185
- bai: 21 · y: - · trang: 185 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · bất đẳng thức $a^3+b^3\ge ab(a+b)$ · cộng từng vế các bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách chỉ viết "Dễ dàng chứng minh với a, b > 0" cho bất đẳng thức $a^3+b^3\ge ab(a+b)$; kho chứng minh đủ.
## DE
Cho $a,b,c>0$. Chứng minh rằng $\dfrac{a^3}{b}+\dfrac{b^3}{c}+\dfrac{c^3}{a}\ge ab+bc+ca$.
## SACH
Dễ dàng chứng minh với $a,b>0$:
$a^3+b^3\ge ab(a+b)\Leftrightarrow\dfrac{a^3}{b}+b^2\ge a(a+b)$ $(1)$
Hoàn toàn tương tự: $\dfrac{b^3}{c}+c^2\ge b(b+c)$ $(2)$ ; $\dfrac{c^3}{a}+a^2\ge c(c+a)$ $(3)$
Cộng $(1),(2),(3)$ ta được điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia bất đẳng thức quen thuộc $a^3+b^3\ge ab(a+b)$ cho $b>0$ thì xuất hiện đúng số hạng $\dfrac{a^3}{b}$; viết ba bất đẳng thức hoán vị vòng quanh rồi cộng lại thì $a^2+b^2+c^2$ ở hai vế triệt tiêu.

**Bước 1.** Chứng minh bất đẳng thức phụ $a^3+b^3\ge ab(a+b)$ với $a,b>0$ bằng cách chuyển vế và phân tích thành tích có nhân tử $(a-b)^2$.

**Bước 2.** Chia hai vế bất đẳng thức phụ cho $b>0$ để được một bất đẳng thức chứa $\dfrac{a^3}{b}$.

**Bước 3.** Viết hai bất đẳng thức tương tự bằng cách hoán vị vòng $a\to b\to c\to a$ rồi cộng từng vế ba bất đẳng thức.

**Bước 4.** Rút gọn các hạng tử $a^2,b^2,c^2$ giống nhau ở hai vế để còn lại bất đẳng thức cần chứng minh.

**Chú ý:** Chia hai vế cho $b$ chỉ giữ nguyên chiều bất đẳng thức khi $b>0$, nên điều kiện $a,b,c>0$ của đề được dùng ở bước này.

**Phần 2. Trình bày**

Với $a,b>0$:

$a^3+b^3\ge ab(a+b)$

$\Leftrightarrow(a+b)(a^2-ab+b^2)-ab(a+b)\ge0$

$\Leftrightarrow(a+b)(a-b)^2\ge0$ (đúng vì $a+b>0$).

Chia hai vế của $a^3+b^3\ge ab(a+b)$ cho $b>0$: $\dfrac{a^3}{b}+b^2\ge a(a+b)$ $(1)$ (dấu bằng khi $a=b$).

Hoàn toàn tương tự: $\dfrac{b^3}{c}+c^2\ge b(b+c)$ $(2)$ ; $\dfrac{c^3}{a}+a^2\ge c(c+a)$ $(3)$.

Cộng từng vế $(1),(2),(3)$:

$\dfrac{a^3}{b}+\dfrac{b^3}{c}+\dfrac{c^3}{a}+(a^2+b^2+c^2)\ge(a^2+b^2+c^2)+(ab+bc+ca)$

$\Rightarrow\dfrac{a^3}{b}+\dfrac{b^3}{c}+\dfrac{c^3}{a}\ge ab+bc+ca$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $a=b$, $b=c$, $c=a$, tức $a=b=c$.

=== T8D1C2.22a@p185
- bai: 22 · y: a · trang: 185 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: ví dụ 22 có ba ý a, b, c; ý b dùng kết quả ý a, nhưng ở kho tách thành ba câu và lời giải câu b tự chứng minh lại bất đẳng thức của ý a.
## DE
Chứng minh bất đẳng thức: $a^2+b^2+c^2\ge ab+bc+ca$ với mọi $a,b,c$.
## SACH
$a^2+b^2+c^2\ge ab+bc+ca$
$\Leftrightarrow a^2+b^2+c^2-ab-bc-ca\ge0$
$\Leftrightarrow2a^2+2b^2+2c^2-2ab-2bc-2ca\ge0$
$\Leftrightarrow(a^2+b^2-2ab)+(b^2+c^2-2bc)+(c^2+a^2-2ca)\ge0$
$\Leftrightarrow(a-b)^2+(b-c)^2+(c-a)^2\ge0$. Bất đẳng thức này đúng.
Do đó: $a^2+b^2+c^2\ge ab+bc+ca$ là bất đẳng thức đúng.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển mọi hạng tử sang một vế rồi nhân đôi để các hạng tử $a^2,b^2,c^2$ ghép được thành ba bình phương $(a-b)^2$, $(b-c)^2$, $(c-a)^2$.

**Bước 1.** Chuyển vế để so sánh hiệu $a^2+b^2+c^2-ab-bc-ca$ với $0$.

**Bước 2.** Nhân hai vế với số dương $2$ để các hệ số của $ab$, $bc$, $ca$ trở thành $-2$, đúng dạng hạng tử giữa của một bình phương.

**Bước 3.** Tách mỗi hạng tử $2a^2$, $2b^2$, $2c^2$ thành tổng hai bình phương rồi ghép với các hạng tử $-2ab$, $-2bc$, $-2ca$ để được ba bình phương của các hiệu.

**Chú ý:** Bất đẳng thức đúng với mọi số thực $a,b,c$, không cần điều kiện dương; đây là bất đẳng thức hay được dùng làm bước phụ.

**Phần 2. Trình bày**

$a^2+b^2+c^2\ge ab+bc+ca$

$\Leftrightarrow a^2+b^2+c^2-ab-bc-ca\ge0$

$\Leftrightarrow2a^2+2b^2+2c^2-2ab-2bc-2ca\ge0$ (nhân hai vế với $2>0$)

$\Leftrightarrow(a^2-2ab+b^2)+(b^2-2bc+c^2)+(c^2-2ca+a^2)\ge0$

$\Leftrightarrow(a-b)^2+(b-c)^2+(c-a)^2\ge0$.

Bất đẳng thức cuối đúng vì tổng ba bình phương không âm. Vậy bất đẳng thức đã cho đúng với mọi $a,b,c$.

Dấu bằng xảy ra khi $a-b=b-c=c-a=0$, tức $a=b=c$.

=== T8D1C2.22b@p185
- bai: 22 · y: b · trang: 185 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · áp dụng $u^2+v^2+w^2\ge uv+vw+wu$ ba lần · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: lời giải sách mở đầu "Áp dụng câu a) ta có" trỏ sang ý a của cùng ví dụ; trong ## SACH đã thay bằng nêu rõ bất đẳng thức của ý a, lời giải kho tự chứng minh lại bất đẳng thức đó.
## DE
Chứng minh bất đẳng thức: $\dfrac{a^8+b^8+c^8}{a^3b^3c^3}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$ ($a>0,b>0,c>0$).
## SACH
Áp dụng bất đẳng thức $a^2+b^2+c^2\ge ab+bc+ca$ ta có:
$a^8+b^8+c^8\ge a^4b^4+b^4c^4+c^4a^4=(a^2b^2)^2+(b^2c^2)^2+(c^2a^2)^2$
$\ge(a^2b^2)(b^2c^2)+(b^2c^2)(c^2a^2)+(a^2b^2)(c^2a^2)=a^2b^2c^2(a^2+b^2+c^2)$
$\ge a^2b^2c^2(ab+bc+ca)$
Do đó: $\dfrac{a^8+b^8+c^8}{a^3b^3c^3}\ge\dfrac{a^2b^2c^2(ab+bc+ca)}{a^3b^3c^3}\Leftrightarrow\dfrac{a^8+b^8+c^8}{a^3b^3c^3}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức quen thuộc $u^2+v^2+w^2\ge uv+vw+wu$ dùng liên tiếp ba lần (với $a^4,b^4,c^4$, rồi $a^2b^2,b^2c^2,c^2a^2$, rồi $a,b,c$) đưa tử $a^8+b^8+c^8$ xuống $a^2b^2c^2(ab+bc+ca)$, đúng là tử của vế phải sau khi quy đồng.

**Bước 1.** Chứng minh bất đẳng thức phụ $u^2+v^2+w^2\ge uv+vw+wu$ với mọi số thực $u,v,w$ bằng cách ghép thành ba bình phương.

**Bước 2.** Áp dụng bất đẳng thức phụ với bộ ba $a^4,b^4,c^4$ để hạ bậc từ $a^8+b^8+c^8$ xuống $a^4b^4+b^4c^4+c^4a^4$.

**Bước 3.** Áp dụng lần nữa với bộ ba $a^2b^2,b^2c^2,c^2a^2$ rồi với bộ ba $a,b,c$ để thu được $a^2b^2c^2(ab+bc+ca)$.

**Bước 4.** Chia cả hai vế cho số dương $a^3b^3c^3$ rồi rút gọn vế phải để được điều phải chứng minh.

**Chú ý:** Chia cho $a^3b^3c^3$ cần $a,b,c>0$ để chiều bất đẳng thức giữ nguyên; điều kiện này cũng là điều kiện để các phân số $\dfrac1a$, $\dfrac1b$, $\dfrac1c$ có nghĩa.

**Phần 2. Trình bày**

Với mọi số thực $u,v,w$ ta có $u^2+v^2+w^2\ge uv+vw+wu$ $(*)$, vì

$2(u^2+v^2+w^2-uv-vw-wu)=(u-v)^2+(v-w)^2+(w-u)^2\ge0$, dấu bằng khi $u=v=w$.

Áp dụng $(*)$ với $(u,v,w)=(a^4,b^4,c^4)$:

$a^8+b^8+c^8\ge a^4b^4+b^4c^4+c^4a^4$ $(1)$.

Áp dụng $(*)$ với $(u,v,w)=(a^2b^2,b^2c^2,c^2a^2)$:

$a^4b^4+b^4c^4+c^4a^4\ge a^2b^4c^2+a^2b^2c^4+a^4b^2c^2=a^2b^2c^2(a^2+b^2+c^2)$ $(2)$.

Áp dụng $(*)$ với $(u,v,w)=(a,b,c)$ rồi nhân hai vế với $a^2b^2c^2>0$:

$a^2b^2c^2(a^2+b^2+c^2)\ge a^2b^2c^2(ab+bc+ca)$ $(3)$.

Từ $(1),(2),(3)$: $a^8+b^8+c^8\ge a^2b^2c^2(ab+bc+ca)$.

Chia hai vế cho $a^3b^3c^3>0$:

$\dfrac{a^8+b^8+c^8}{a^3b^3c^3}\ge\dfrac{ab+bc+ca}{abc}=\dfrac{1}{c}+\dfrac{1}{a}+\dfrac{1}{b}$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $(1),(2),(3)$ đồng thời xảy ra dấu bằng, tức $a^4=b^4=c^4$; vì $a,b,c>0$ nên $a=b=c$.

=== T8D1C2.22c@p185
- bai: 22 · y: c · trang: 185 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · tách $a^2$ thành bốn phần $\dfrac{a^2}{4}$ · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: mép trang mất chữ $a$ ở vài dòng (ví dụ "ı²+b²+…"), dựng lại theo ngữ cảnh.
## DE
Chứng minh bất đẳng thức: $a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$ với mọi $a,b,c,d,e$.
## SACH
$a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$
$\Leftrightarrow a^2+b^2+c^2+d^2+e^2-a(b+c+d+e)\ge0$
$\Leftrightarrow a^2+b^2+c^2+d^2+e^2-ab-ac-ad-ae\ge0$
$\Leftrightarrow\left(\dfrac{a^2}{4}+b^2-ab\right)+\left(\dfrac{a^2}{4}+c^2-ac\right)+\left(\dfrac{a^2}{4}+d^2-ad\right)+\left(\dfrac{a^2}{4}+e^2-ae\right)\ge0$
$\Leftrightarrow\left(\dfrac{a}{2}-b\right)^2+\left(\dfrac{a}{2}-c\right)^2+\left(\dfrac{a}{2}-d\right)^2+\left(\dfrac{a}{2}-e\right)^2\ge0$ Bất đẳng thức này đúng.
Do đó: $a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$ là bất đẳng thức đúng.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có bốn hạng tử $-ab$, $-ac$, $-ad$, $-ae$ nên tách $a^2$ thành bốn phần bằng nhau $\dfrac{a^2}{4}$, mỗi phần ghép với một bình phương $b^2$, $c^2$, $d^2$, $e^2$ và một hạng tử âm để tạo thành một bình phương.

**Bước 1.** Chuyển vế và khai triển $a(b+c+d+e)$ để so sánh hiệu hai vế với $0$.

**Bước 2.** Viết $a^2=4\cdot\dfrac{a^2}{4}$ rồi chia bốn phần $\dfrac{a^2}{4}$ cho bốn nhóm, mỗi nhóm gồm một biến $b,c,d,e$ với hạng tử $-a\cdot$biến đó.

**Bước 3.** Nhận ra mỗi nhóm dạng $\dfrac{a^2}{4}+x^2-ax$ là bình phương của một hiệu rồi kết luận dấu của tổng.

**Chú ý:** Đề không yêu cầu các biến dương nên phải dựa vào bình phương luôn không âm với mọi số thực, không được dùng bất đẳng thức chỉ đúng cho số dương.

**Phần 2. Trình bày**

$a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$

$\Leftrightarrow a^2+b^2+c^2+d^2+e^2-ab-ac-ad-ae\ge0$

$\Leftrightarrow\left(\dfrac{a^2}{4}+b^2-ab\right)+\left(\dfrac{a^2}{4}+c^2-ac\right)+\left(\dfrac{a^2}{4}+d^2-ad\right)+\left(\dfrac{a^2}{4}+e^2-ae\right)\ge0$

$\Leftrightarrow\left(\dfrac{a}{2}-b\right)^2+\left(\dfrac{a}{2}-c\right)^2+\left(\dfrac{a}{2}-d\right)^2+\left(\dfrac{a}{2}-e\right)^2\ge0$.

Bất đẳng thức cuối đúng vì tổng bốn bình phương không âm. Vậy bất đẳng thức đã cho đúng với mọi $a,b,c,d,e$.

Dấu bằng xảy ra khi $b=c=d=e=\dfrac{a}{2}$.

=== T8D1C2.23@p186
- bai: 23 · y: - · trang: 186 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · làm trội (thêm bớt mẫu) · cộng từng vế các bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: nhãn số ví dụ ("Ví dụ 23") bị mờ ở mép, đọc theo thứ tự (sau Ví dụ 22, trước Ví dụ 24).
## DE
Cho các số dương $a,b,c$, chứng minh rằng: $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.
## SACH
Ta có: $\dfrac{a}{a+b+c}<\dfrac{a}{b+a}<\dfrac{a+c}{a+b+c}$ $(1)$
$\dfrac{b}{a+b+c}<\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$ $(2)$ ; $\dfrac{c}{a+b+c}<\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$ $(3)$
Cộng từng vế $(1),(2),(3)$: $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức hai chiều gợi dùng phương pháp làm trội: kẹp từng phân số giữa hai phân số có mẫu chung $a+b+c$, rồi cộng ba bất đẳng thức kép.

**Bước 1.** Với phân số $\dfrac{a}{a+b}$, thêm $c$ vào mẫu để được cận dưới $\dfrac{a}{a+b+c}$ và chứng minh cận trên $\dfrac{a+c}{a+b+c}$ bằng cách quy đồng.

**Bước 2.** Viết hai bất đẳng thức kép tương tự cho hai phân số còn lại bằng cách hoán vị vòng quanh $a\to b\to c\to a$.

**Bước 3.** Cộng từng vế ba bất đẳng thức kép rồi tính tổng các cận ở hai đầu để có cận $1$ và cận $2$.

**Chú ý:** Khi cộng các bất đẳng thức chặt cùng chiều, dấu $<$ được giữ nguyên nên cả hai bất đẳng thức của đề đều là chặt; không xảy ra dấu bằng.

**Phần 2. Trình bày**

Với $a,b,c>0$: vì $a+b+c>a+b>0$ nên $\dfrac{a}{a+b+c}<\dfrac{a}{a+b}$.

Mặt khác $\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}\Leftrightarrow a(a+b+c)<(a+c)(a+b)\Leftrightarrow a^2+ab+ac<a^2+ab+ac+bc\Leftrightarrow bc>0$ (đúng).

Do đó $\dfrac{a}{a+b+c}<\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$ $(1)$.

Hoàn toàn tương tự (hoán vị vòng $a\to b\to c\to a$):

$\dfrac{b}{a+b+c}<\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$ $(2)$ ; $\dfrac{c}{a+b+c}<\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$ $(3)$.

Cộng từng vế $(1),(2),(3)$:

$\dfrac{a+b+c}{a+b+c}<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<\dfrac{(a+c)+(b+a)+(c+b)}{a+b+c}$

tức $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.

Các bất đẳng thức đều chặt nên không xảy ra dấu bằng.

=== T8D1C2.24@p186
- bai: 24 · y: - · trang: 186 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 2 — dùng các phép biến đổi tương đương · chuyển vế, quy đồng từng cặp · nhóm hạng tử đưa về tích
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: nhãn số ví dụ ("Ví dụ 24") bị mờ ở mép, đọc theo thứ tự.
## DE
Chứng minh rằng với $a\ge b\ge1$: $\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}\ge\dfrac{2}{1+ab}$ $(*)$.
## SACH
$(*)\Leftrightarrow\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}-\dfrac{1}{1+ab}-\dfrac{1}{1+ab}\ge0$
$\Leftrightarrow\dfrac{ab-a^2}{(1+a^2)(1+ab)}+\dfrac{ab-b^2}{(1+b^2)(1+ab)}\ge0$
$\Leftrightarrow\dfrac{a(b-a)}{(1+a^2)(1+ab)}+\dfrac{b(a-b)}{(1+b^2)(1+ab)}\ge0\Leftrightarrow\dfrac{b-a}{1+ab}\left(\dfrac{a}{1+a^2}-\dfrac{b}{1+b^2}\right)\ge0$
$\Leftrightarrow\dfrac{b-a}{1+ab}\left(\dfrac{a+ab^2-b-ba^2}{(1+a^2)(1+b^2)}\right)\ge0\Leftrightarrow\dfrac{(b-a)^2(ab-1)}{(1+ab)(1+a^2)(1+b^2)}\ge0$.
Vì $a\ge b\ge1\Rightarrow ab\ge1\Leftrightarrow ab-1\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển vế rồi tách $\dfrac{2}{1+ab}$ thành hai phân số bằng nhau để ghép từng phân số của vế trái với một phân số đó; mỗi hiệu quy đồng ra tử chứa nhân tử chung $b-a$ hoặc $a-b$.

**Bước 1.** Chuyển $\dfrac{2}{1+ab}$ sang vế trái và tách thành hai phân số $\dfrac{1}{1+ab}$, rồi ghép $\dfrac{1}{1+a^2}$ và $\dfrac{1}{1+b^2}$ mỗi phân số với một phân số $\dfrac{1}{1+ab}$.

**Bước 2.** Quy đồng từng hiệu để tử là $ab-a^2=a(b-a)$ và $ab-b^2=b(a-b)$, sau đó đặt nhân tử chung $\dfrac{b-a}{1+ab}$.

**Bước 3.** Quy đồng hiệu còn lại trong ngoặc, nhóm tử thành tích để xuất hiện $(b-a)^2(ab-1)$.

**Bước 4.** Dùng điều kiện $a\ge b\ge1$ để xét dấu từng thừa số của phân thức cuối rồi kết luận.

**Chú ý:** Điều kiện $a\ge b\ge1$ chỉ cần dùng ở thừa số $ab-1\ge0$; mọi mẫu đều dương vì $a,b>0$.

**Phần 2. Trình bày**

Với $a\ge b\ge1$ thì $1+a^2$, $1+b^2$, $1+ab$ đều dương.

$\dfrac{1}{1+a^2}+\dfrac{1}{1+b^2}\ge\dfrac{2}{1+ab}$

$\Leftrightarrow\left(\dfrac{1}{1+a^2}-\dfrac{1}{1+ab}\right)+\left(\dfrac{1}{1+b^2}-\dfrac{1}{1+ab}\right)\ge0$

$\Leftrightarrow\dfrac{ab-a^2}{(1+a^2)(1+ab)}+\dfrac{ab-b^2}{(1+b^2)(1+ab)}\ge0$

$\Leftrightarrow\dfrac{a(b-a)}{(1+a^2)(1+ab)}+\dfrac{b(a-b)}{(1+b^2)(1+ab)}\ge0$

$\Leftrightarrow\dfrac{b-a}{1+ab}\left(\dfrac{a}{1+a^2}-\dfrac{b}{1+b^2}\right)\ge0$

$\Leftrightarrow\dfrac{b-a}{1+ab}\cdot\dfrac{a(1+b^2)-b(1+a^2)}{(1+a^2)(1+b^2)}\ge0$

$\Leftrightarrow\dfrac{(b-a)(a-b)(1-ab)}{(1+ab)(1+a^2)(1+b^2)}\ge0$ (vì $a(1+b^2)-b(1+a^2)=(a-b)-ab(a-b)=(a-b)(1-ab)$)

$\Leftrightarrow\dfrac{(b-a)^2(ab-1)}{(1+ab)(1+a^2)(1+b^2)}\ge0$.

Vì $a\ge b\ge1$ nên $ab\ge1$, tức $ab-1\ge0$; còn $(b-a)^2\ge0$ và các thừa số ở mẫu đều dương. Bất đẳng thức cuối đúng, nên bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $(b-a)^2(ab-1)=0$, tức $a=b$ hoặc $ab=1$; với $a\ge b\ge1$, trường hợp $ab=1$ buộc $a=b=1$. Vậy dấu bằng xảy ra khi $a=b$.

=== T8D1C3.1@p186
- bai: 1 · y: - · trang: 186 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 3 — phương pháp phản chứng · bất đẳng thức $2ab\le a^2+b^2$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: nhãn số ví dụ bị logo che; Cách 3 chỉ có một ví dụ nên đánh số 1. Đề không nói $a,b$ là số thực, ngầm hiểu là số thực. Sách giải hai cách (phản chứng và "Cách giải khác" trực tiếp); kho đi cách phản chứng, nêu cách còn lại trong Chú ý.
## DE
Cho $a^2+b^2\le2$. Chứng minh rằng $a+b\le2$.
## SACH
Giả sử $a+b>2$, bình phương hai vế (hai vế đều dương), ta được:
$a^2+2ab+b^2>4$ $(1)$. Mặt khác ta có:
$2ab\le a^2+b^2\Rightarrow a^2+b^2+2ab\le2(a^2+b^2)$. Mà $2(a^2+b^2)\le4$ (giả thiết), do đó $a^2+2ab+b^2\le4$ $(2)$. Mâu thuẫn với $(1)$. Vậy phải có $a+b\le2$.
Cách giải khác. Ta có: $a^2+b^2\le2$ $(1)$.
Mặt khác $2ab\le a^2+b^2$ nên $2ab\le a^2+b^2\le2$ $(2)$.
Cộng $(1)$ và $(2)$: $a^2+2ab+b^2\le4\Rightarrow(a+b)^2\le4\Rightarrow-2\le a+b\le2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Kết luận có dạng "$\le$" gợi giả sử điều ngược lại ($a+b>2$), bình phương để xuất hiện $a^2+2ab+b^2$ rồi so với giả thiết $a^2+b^2\le2$ thông qua $2ab\le a^2+b^2$.

**Bước 1.** Giả sử điều phải chứng minh sai, tức $a+b>2$, rồi bình phương hai vế và nêu rõ vì sao được phép bình phương.

**Bước 2.** Dùng bất đẳng thức $2ab\le a^2+b^2$ và giả thiết $a^2+b^2\le2$ để chặn trên biểu thức $a^2+2ab+b^2$.

**Bước 3.** So sánh hai bất đẳng thức vừa có về cùng đại lượng $a^2+2ab+b^2$, chỉ ra mâu thuẫn rồi kết luận phải có $a+b\le2$.

**Chú ý:** Có cách trực tiếp không cần phản chứng: cộng $a^2+b^2\le2$ với $2ab\le a^2+b^2\le2$ được $(a+b)^2\le4$, suy ra $-2\le a+b\le2$.

**Phần 2. Trình bày**

Giả sử $a+b>2$. Khi đó $a+b>0$, bình phương hai vế (hai vế đều dương) được

$(a+b)^2>4$, tức $a^2+2ab+b^2>4$ $(1)$.

Mặt khác $(a-b)^2\ge0$ nên $2ab\le a^2+b^2$, suy ra

$a^2+2ab+b^2\le2(a^2+b^2)$.

Theo giả thiết $a^2+b^2\le2$ nên $2(a^2+b^2)\le4$, do đó

$a^2+2ab+b^2\le4$ $(2)$.

$(2)$ mâu thuẫn với $(1)$. Vậy giả sử sai, tức $a+b\le2$.

Dấu bằng $a+b=2$ xảy ra khi $a=b$ và $a+b=2$, tức $a=b=1$ (khi đó $a^2+b^2=2$).

=== T8D1C4.1@p187
- bai: 1 · y: - · trang: 187 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 4 — phương pháp đổi biến phụ · đặt $a=\dfrac13+x$ để tách phần chính
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề ngầm hiểu $a,b,c$ là số thực.
## DE
Cho $a+b+c=1$. Chứng minh rằng: $a^2+b^2+c^2\ge\dfrac13$.
## SACH
Đặt $a=\dfrac13+x$, $b=\dfrac13+y$, $c=\dfrac13+z$. Do $a+b+c=1$ nên $x+y+z=0$.
Ta có: $a^2+b^2+c^2=\left(\dfrac13+x\right)^2+\left(\dfrac13+y\right)^2+\left(\dfrac13+z\right)^2$
$=\left(\dfrac19+\dfrac23x+x^2\right)+\left(\dfrac19+\dfrac23y+y^2\right)+\left(\dfrac19+\dfrac23z+z^2\right)$
$=\dfrac13+\dfrac23(x+y+z)+x^2+y^2+z^2=\dfrac13+x^2+y^2+z^2\ge\dfrac13$.
Xảy ra đẳng thức $\Leftrightarrow x=y=z=0\Leftrightarrow a=b=c=\dfrac13$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a+b+c=1$ thì ba số $a,b,c$ có trung bình cộng $\dfrac13$; đặt mỗi số bằng $\dfrac13$ cộng với một độ lệch thì ba độ lệch có tổng bằng $0$ và các số hạng bậc nhất triệt tiêu.

**Bước 1.** Đặt $a=\dfrac13+x$, $b=\dfrac13+y$, $c=\dfrac13+z$ rồi dùng điều kiện $a+b+c=1$ để tìm quan hệ giữa $x,y,z$.

**Bước 2.** Khai triển $a^2+b^2+c^2$ theo $x,y,z$ rồi nhóm các hạng tử bậc nhất lại.

**Bước 3.** Dùng quan hệ giữa $x,y,z$ để triệt tiêu hạng tử bậc nhất, còn lại một hằng số cộng với tổng các bình phương.

**Chú ý:** Cách đặt $a=\dfrac13+x$ (lấy trung bình cộng làm gốc) áp dụng được cho mọi bài có tổng cố định; dấu bằng luôn xảy ra khi mọi độ lệch bằng $0$.

**Phần 2. Trình bày**

Đặt $a=\dfrac13+x$, $b=\dfrac13+y$, $c=\dfrac13+z$. Từ $a+b+c=1$ suy ra $1+x+y+z=1$, tức $x+y+z=0$.

$a^2+b^2+c^2=\left(\dfrac13+x\right)^2+\left(\dfrac13+y\right)^2+\left(\dfrac13+z\right)^2$

$=\dfrac13+\dfrac23(x+y+z)+x^2+y^2+z^2$

$=\dfrac13+x^2+y^2+z^2$ (vì $x+y+z=0$)

$\ge\dfrac13$ (vì $x^2+y^2+z^2\ge0$).

Vậy $a^2+b^2+c^2\ge\dfrac13$. Dấu bằng xảy ra khi $x=y=z=0$, tức $a=b=c=\dfrac13$.

=== T8D1C4.2@p187
- bai: 2 · y: - · trang: 187 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 4 — phương pháp đổi biến phụ · bất đẳng thức tam giác · bất đẳng thức Cô-si $x+y\ge2\sqrt{xy}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách viện dẫn $(x+y)(y+z)(z+x)\ge8xyz$ mà không chứng minh; kho chứng minh bằng Cô-si hai số dương. Sách giải hai cách (Cách 1 đổi biến, Cách 2 nhân ba bất đẳng thức); kho đi Cách 1 (đúng tên mục), nêu Cách 2 trong Chú ý.
## DE
Chứng minh bất đẳng thức: $abc\ge(b+c-a)(a+c-b)(a+b-c)$ với $a,b,c$ là độ dài ba cạnh của một tam giác.
## SACH
Cách 1. Đặt $b+c-a=x$, $a+c-b=y$, $a+b-c=z$ thì $x,y,z>0$. Theo bất đẳng thức $(x+y)(y+z)(z+x)\ge8xyz$, ta có:
$2a\cdot2b\cdot2c\ge8(b+c-a)(a+c-b)(a+b-c)$
$\Rightarrow abc\ge(b+c-a)(a+c-b)(a+b-c)$
Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
Cách 2. Ta có: $(b+c-a)(b+a-c)=b^2-(c-a)^2\le b^2$
$(c+a-b)(c+b-a)=c^2-(a-b)^2\le c^2$
$(a+b-c)(a+c-b)=a^2-(b-c)^2\le a^2$.
Nhân từng vế ba bất đẳng thức trên, ta được:
$\left[(b+c-a)(a+c-b)(a+b-c)\right]^2\le[abc]^2$. Các biểu thức trong dấu ngoặc vuông đều dương nên $(b+c-a)(a+c-b)(a+b-c)\le abc$.
Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba thừa số bên phải có tổng từng đôi bằng $2c$, $2a$, $2b$; đặt chúng làm ba biến phụ dương $x,y,z$ thì bất đẳng thức quy về $(x+y)(y+z)(z+x)\ge8xyz$.

**Bước 1.** Đặt $x=b+c-a$, $y=a+c-b$, $z=a+b-c$ rồi dùng bất đẳng thức tam giác để chứng tỏ $x,y,z>0$.

**Bước 2.** Tính $x+y$, $y+z$, $z+x$ theo $a,b,c$ để thấy mỗi tổng bằng hai lần một cạnh.

**Bước 3.** Chứng minh $(x+y)(y+z)(z+x)\ge8xyz$ bằng bất đẳng thức Cô-si cho từng cặp số dương rồi nhân ba bất đẳng thức cùng chiều.

**Bước 4.** Thay $x+y$, $y+z$, $z+x$ bằng $2c$, $2a$, $2b$ và rút gọn hệ số $8$ ở hai vế để được điều phải chứng minh.

**Chú ý:** Có cách khác không cần Cô-si: mỗi tích hai thừa số của vế phải bằng $b^2-(c-a)^2$ (và hai biểu thức tương tự) nên không vượt quá $b^2$, rồi nhân ba bất đẳng thức giữa các số dương.

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh của một tam giác nên $x=b+c-a>0$, $y=a+c-b>0$, $z=a+b-c>0$, và $x+y=2c$, $y+z=2a$, $z+x=2b$.

Với $x,y,z>0$, theo bất đẳng thức Cô-si cho hai số dương (dấu bằng khi hai số bằng nhau):

$x+y\ge2\sqrt{xy}$, $y+z\ge2\sqrt{yz}$, $z+x\ge2\sqrt{zx}$.

Nhân từng vế ba bất đẳng thức (các vế đều dương):

$(x+y)(y+z)(z+x)\ge8\sqrt{x^2y^2z^2}=8xyz$.

Thay $x+y=2c$, $y+z=2a$, $z+x=2b$:

$2c\cdot2a\cdot2b\ge8xyz$

$\Rightarrow8abc\ge8(b+c-a)(a+c-b)(a+b-c)$

$\Rightarrow abc\ge(b+c-a)(a+c-b)(a+b-c)$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $x=y=z$, tức $a=b=c$ (tam giác đều).

=== T8D1C4.3@p188
- bai: 3 · y: - · trang: 188 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 4 — phương pháp đổi biến phụ (đặt $x=\sqrt[3]{a}$,…) · hằng đẳng thức $x^3+y^3+z^3-3xyz$ · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: phân vân nhóm: T18T030101 (hằng đẳng thức) hoặc T18T030102 (bất đẳng thức Cô-si ba số $a+b+c\ge3\sqrt[3]{abc}$); chọn 030101 theo luật "bất đẳng thức chứng minh bằng hằng đẳng thức". Căn bậc ba $\sqrt[3]{a}$ ngoài chương trình lớp 8 nhưng sách dùng.
## DE
Chứng minh rằng: $x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ với mọi số thực $x,y,z$. Suy ra với $a,b,c$ là các số dương ta luôn có: $a+b+c\ge3\sqrt[3]{abc}$.
## SACH
Khai triển vế phải: $(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ được vế trái.
Ta có: $x^2+y^2+z^2-xy-yz-zx=\dfrac12\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$.
Đặt: $x=\sqrt[3]{a}$, $y=\sqrt[3]{b}$, $z=\sqrt[3]{c}$; $x+y+z>0$ vì $a,b,c$ dương.
Từ đó $x^3+y^3+z^3-3xyz\ge0$ hay: $a+b+c\ge3\sqrt[3]{abc}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu $x^3+y^3+z^3-3xyz$ phân tích thành tích của $x+y+z$ với một biểu thức bằng nửa tổng ba bình phương, nên không âm khi $x+y+z\ge0$; đặt $x,y,z$ là căn bậc ba của $a,b,c$ thì được bất đẳng thức cần suy ra.

**Bước 1.** Khai triển $(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ để kiểm tra bằng $x^3+y^3+z^3-3xyz$ với mọi số thực.

**Bước 2.** Viết nhân tử thứ hai thành nửa tổng ba bình phương để chứng tỏ nó luôn không âm.

**Bước 3.** Đặt $x=\sqrt[3]{a}$, $y=\sqrt[3]{b}$, $z=\sqrt[3]{c}$ để $x^3=a$, $y^3=b$, $z^3=c$ rồi dùng $x+y+z>0$ suy ra dấu của hiệu.

**Bước 4.** Thay $x^3,y^3,z^3$ và tích $xyz=\sqrt[3]{abc}$ vào để được bất đẳng thức cần suy ra, rồi tìm điều kiện xảy ra dấu bằng.

**Chú ý:** Bất đẳng thức $a+b+c\ge3\sqrt[3]{abc}$ chỉ đúng với $a,b,c$ không âm; tích $x+y+z>0$ chính là chỗ dùng điều kiện dương.

**Phần 2. Trình bày**

Khai triển vế phải: nhân lần lượt $x$, $y$, $z$ với $x^2+y^2+z^2-xy-yz-zx$ rồi cộng lại, các hạng tử $x^2y$, $x^2z$, $y^2x$, $y^2z$, $z^2x$, $z^2y$ triệt tiêu từng cặp, còn

$(x+y+z)(x^2+y^2+z^2-xy-yz-zx)=x^3+y^3+z^3-3xyz$ với mọi số thực $x,y,z$.

Ta có $x^2+y^2+z^2-xy-yz-zx=\dfrac12\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$.

Với $a,b,c>0$, đặt $x=\sqrt[3]{a}$, $y=\sqrt[3]{b}$, $z=\sqrt[3]{c}$ thì $x,y,z>0$ nên $x+y+z>0$.

Do đó tích $(x+y+z)(x^2+y^2+z^2-xy-yz-zx)\ge0$, tức $x^3+y^3+z^3-3xyz\ge0$.

Mà $x^3=a$, $y^3=b$, $z^3=c$, $xyz=\sqrt[3]{a}\sqrt[3]{b}\sqrt[3]{c}=\sqrt[3]{abc}$, nên

$a+b+c-3\sqrt[3]{abc}\ge0$, tức $a+b+c\ge3\sqrt[3]{abc}$.

Dấu bằng xảy ra khi nhân tử thứ hai bằng $0$, tức $x=y=z$, hay $a=b=c$.

=== T8D1C4.4@p188
- bai: 4 · y: - · trang: 188 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 4 — phương pháp đổi biến phụ · hằng đẳng thức hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề in "Cho a, b, c > 0. Chứng minh rằng: (a−1)(a−3)(a−4)(a−6)+10 > 0; ∀a" — bất đẳng thức chỉ có biến $a$ và nói "với mọi $a$", điều kiện "$b,c>0$" thừa; chép đúng như in, lời giải kho chứng minh đúng với mọi số thực $a$ (hơn yêu cầu $a>0$).
## DE
Cho $a,b,c>0$. Chứng minh rằng: $(a-1)(a-3)(a-4)(a-6)+10>0$; $\forall a$.
## SACH
Ta có: $(a-1)(a-3)(a-4)(a-6)+10=\left[(a-1)(a-6)\right]\left[(a-3)(a-4)\right]+10$
$=(a^2-7a+6)(a^2-7a+12)+10$ ; Đặt $t=a^2-7a+9$
$=(t-3)(t+3)+10=(t^2-9)+10=t^2+1>0$; $\forall t$. Bất đẳng thức đã được chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các số hạng tự do $1,6$ và $3,4$ cùng có tổng $7$, nên ghép $(a-1)$ với $(a-6)$ và $(a-3)$ với $(a-4)$ thì được hai tam thức bậc hai chỉ khác nhau hằng số; khi đó đặt biến phụ cho phần chung.

**Bước 1.** Ghép $(a-1)$ với $(a-6)$ và $(a-3)$ với $(a-4)$ vì mỗi cặp có cùng tổng hai số hạng tự do, rồi nhân từng cặp để được hai tam thức bậc hai.

**Bước 2.** Nhận ra hai tam thức có cùng phần $a^2-7a$ và chọn biến phụ $t$ nằm đúng giữa hai tam thức đó.

**Bước 3.** Viết tích hai tam thức thành tích $(t-3)(t+3)$ rồi rút gọn để được một biểu thức dương với mọi $t$.

**Chú ý:** Chọn biến phụ $t=a^2-7a+9$ (đặt ở giữa hai hằng số $6$ và $12$) cho tích $(t-3)(t+3)$ gọn nhất; chọn $t=a^2-7a$ cũng giải được nhưng phải thêm một bước hoàn thành bình phương.

**Phần 2. Trình bày**

Với mọi số thực $a$:

$(a-1)(a-3)(a-4)(a-6)+10=\left[(a-1)(a-6)\right]\left[(a-3)(a-4)\right]+10$

$=(a^2-7a+6)(a^2-7a+12)+10$.

Đặt $t=a^2-7a+9$, khi đó $a^2-7a+6=t-3$ và $a^2-7a+12=t+3$ nên

$(a-1)(a-3)(a-4)(a-6)+10=(t-3)(t+3)+10=t^2-9+10=t^2+1$.

Vì $t^2\ge0$ nên $t^2+1>0$ với mọi $t$.

Vậy $(a-1)(a-3)(a-4)(a-6)+10>0$ với mọi $a$ (kể cả khi $a>0$ như đề). Bất đẳng thức là chặt nên không xảy ra dấu bằng.

=== T8D1C4.5@p188
- bai: 5 · y: - · trang: 188 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Cách 4 — phương pháp đổi biến phụ · bất đẳng thức Cô-si $\left|\dfrac xy\right|+\left|\dfrac yx\right|\ge2$ · xét dấu tích hai nhân tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: cùng bất đẳng thức với Cách 2 Ví dụ 17 (đề trùng, khác cách giải). Lời giải sách nhắc "Bất đẳng thức (1)" nhưng đề không gắn nhãn (1) (là bất đẳng thức cần chứng minh); lời giải sách trải sang trang 189.
## DE
Cho $x,y$ là hai số thực khác $0$. Chứng minh: $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+4\ge3\left(\dfrac{x}{y}+\dfrac{y}{x}\right)$.
## SACH
Đặt $t=\dfrac{x}{y}+\dfrac{y}{x}\Rightarrow|t|=\left|\dfrac{x}{y}+\dfrac{y}{x}\right|=\left|\dfrac{x}{y}\right|+\left|\dfrac{y}{x}\right|$ mà $\left|\dfrac{x}{y}\right|+\left|\dfrac{y}{x}\right|\ge2$ (do bất đẳng thức Côsi) $\Rightarrow|t|\ge2\Rightarrow t\le-2$ hay $t\ge2$. Khi đó: $t^2=\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+2$
Bất đẳng thức $(1)\Leftrightarrow t^2+2\ge3t\Leftrightarrow t^2-3t+2\ge0\Leftrightarrow(t-1)(t-2)\ge0$ $(2)$
$(2)$ là hiển nhiên đúng do $t\le-2$ hay $t\ge2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải chứa $\dfrac xy+\dfrac yx$ và vế trái chứa $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}$ chính là $\left(\dfrac xy+\dfrac yx\right)^2-2$, nên đặt $t=\dfrac xy+\dfrac yx$ thì bất đẳng thức chỉ còn một biến $t$ và chỉ cần biết $t$ nằm ở đâu.

**Bước 1.** Đặt $t=\dfrac xy+\dfrac yx$ rồi dùng bất đẳng thức Cô-si cho hai số dương $\left|\dfrac xy\right|$ và $\left|\dfrac yx\right|$ để chặn dưới $|t|$.

**Bước 2.** Suy ra miền giá trị của $t$ từ điều kiện $|t|\ge2$ rồi biểu diễn $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}$ qua $t^2$.

**Bước 3.** Viết bất đẳng thức cần chứng minh theo $t$, đưa về $t^2-3t+2\ge0$ và phân tích thành tích hai nhân tử.

**Bước 4.** Xét dấu hai nhân tử trong từng trường hợp của $t$ để kết luận rồi tìm khi nào dấu bằng xảy ra.

**Chú ý:** Hai số $\dfrac xy$ và $\dfrac yx$ luôn cùng dấu vì tích bằng $1$, nên $|t|$ bằng tổng hai giá trị tuyệt đối; đây là chỗ cho phép dùng bất đẳng thức Cô-si.

**Phần 2. Trình bày**

Đặt $t=\dfrac xy+\dfrac yx$. Vì $\dfrac xy\cdot\dfrac yx=1>0$ nên hai số $\dfrac xy$ và $\dfrac yx$ cùng dấu, do đó

$|t|=\left|\dfrac xy\right|+\left|\dfrac yx\right|\ge2\sqrt{\left|\dfrac xy\right|\cdot\left|\dfrac yx\right|}=2$

(bất đẳng thức Cô-si cho hai số dương $\left|\dfrac xy\right|$, $\left|\dfrac yx\right|$, dấu bằng khi hai số bằng nhau). Suy ra $t\le-2$ hoặc $t\ge2$.

Ta có $t^2=\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+2$ nên

$\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}+4\ge3\left(\dfrac xy+\dfrac yx\right)$

$\Leftrightarrow t^2+2\ge3t$

$\Leftrightarrow t^2-3t+2\ge0$

$\Leftrightarrow(t-1)(t-2)\ge0$.

Nếu $t\ge2$ thì $t-1>0$ và $t-2\ge0$; nếu $t\le-2$ thì $t-1<0$ và $t-2<0$; cả hai trường hợp tích $(t-1)(t-2)\ge0$. Bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $(t-1)(t-2)=0$; vì $|t|\ge2$ nên $t=2$, tức $\left|\dfrac xy\right|=\left|\dfrac yx\right|=1$ và $\dfrac xy>0$, hay $x=y$.

=== T8D1C5.1@p189
- bai: 1 · y: - · trang: 189 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · nhân hai vế với 4 rồi ghép bình phương · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh với mọi số thực $x,y,z,t$ ta luôn có bất đẳng thức sau: $x^2+y^2+z^2+t^2\ge x(y+z+t)$. Đẳng thức xảy ra khi nào?
## SACH
Ta có: $x^2+y^2+z^2+t^2\ge x(y+z+t)$ $(1)$
$\Leftrightarrow4x^2+4y^2+4z^2+4t^2\ge4x(y+z+t)$
$\Leftrightarrow(x^2-4xy+4y^2)+(x^2-4xz+4z^2)+(x^2-4xt+4t^2)+x^2\ge0$
$\Leftrightarrow(x-2y)^2+(x-2z)^2+(x-2t)^2+x^2\ge0$ $(2)$. Ta có $(2)$ luôn luôn đúng với mọi $x,y,z,t$. Vậy $(1)$ được chứng minh. Đẳng thức xảy ra $\Leftrightarrow x-2y=x-2z=x-2t=x=0\Leftrightarrow x=y=z=t=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải có ba tích $xy$, $xz$, $xt$; nhân hai vế với $4$ rồi tách $4x^2$ thành bốn phần $x^2$ thì ba phần đầu ghép với $4y^2$, $4z^2$, $4t^2$ và $-4xy$, $-4xz$, $-4xt$ tạo ra ba bình phương $(x-2y)^2$, $(x-2z)^2$, $(x-2t)^2$, còn dư một phần $x^2$.

**Bước 1.** Nhân hai vế với $4>0$ để hệ số của mỗi tích $xy$, $xz$, $xt$ là $-4$, đúng dạng hạng tử giữa của $(x-2y)^2$, $(x-2z)^2$, $(x-2t)^2$.

**Bước 2.** Tách $4x^2$ thành $x^2+x^2+x^2+x^2$ rồi ghép ba phần đầu với $4y^2$, $4z^2$, $4t^2$ và các hạng tử $-4xy$, $-4xz$, $-4xt$.

**Bước 3.** Kết luận vế trái là tổng bốn bình phương rồi tìm điều kiện để cả bốn bình phương cùng bằng $0$.

**Chú ý:** Đẳng thức xảy ra khi mỗi bình phương đều bằng $0$; từ $x=0$ và $x-2y=0$ mới suy được $y=0$, nên cả bốn biến đều bằng $0$.

**Phần 2. Trình bày**

$x^2+y^2+z^2+t^2\ge x(y+z+t)$

$\Leftrightarrow4x^2+4y^2+4z^2+4t^2\ge4x(y+z+t)$ (nhân hai vế với $4>0$)

$\Leftrightarrow(x^2-4xy+4y^2)+(x^2-4xz+4z^2)+(x^2-4xt+4t^2)+x^2\ge0$

$\Leftrightarrow(x-2y)^2+(x-2z)^2+(x-2t)^2+x^2\ge0$.

Bất đẳng thức cuối đúng với mọi $x,y,z,t$ (tổng bốn bình phương không âm), nên bất đẳng thức đã cho đúng.

Đẳng thức xảy ra khi $x-2y=x-2z=x-2t=x=0$, tức $x=y=z=t=0$.

=== T8D1C5.2@p189
- bai: 2 · y: - · trang: 189 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · $x^2+y^2\ge2xy$ · tách $3(a^2+b^2+c^2)$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề không nêu $a,b,c$ là số thực, ngầm hiểu số thực.
## DE
Chứng minh rằng: $\dfrac{a^2+b^2+c^2}{3}\ge\left(\dfrac{a+b+c}{3}\right)^2$.
## SACH
Ta có: $3(a^2+b^2+c^2)=a^2+b^2+c^2+2(a^2+b^2+c^2)$
$\ge a^2+b^2+c^2+2(ab+bc+ca)=(a+b+c)^2$
$\Rightarrow\dfrac{a^2+b^2+c^2}{3}\ge\left(\dfrac{a+b+c}{3}\right)^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Sau khi nhân hai vế với $9$, vế phải là $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$; tách $3(a^2+b^2+c^2)$ thành $(a^2+b^2+c^2)+2(a^2+b^2+c^2)$ rồi thay phần thứ hai bằng $2(ab+bc+ca)$ (không lớn hơn) nhờ bất đẳng thức $x^2+y^2\ge2xy$.

**Bước 1.** Nhân hai vế với $9$ để đưa bất đẳng thức về dạng $3(a^2+b^2+c^2)\ge(a+b+c)^2$, không còn mẫu.

**Bước 2.** Tách $3(a^2+b^2+c^2)$ thành hai nhóm rồi dùng bất đẳng thức quen thuộc $x^2+y^2\ge2xy$ cho từng cặp biến để chặn dưới nhóm thứ hai.

**Bước 3.** Gộp lại để nhận ra bình phương $(a+b+c)^2$ ở vế phải rồi chia hai vế cho $9$.

**Chú ý:** Bất đẳng thức $x^2+y^2\ge2xy$ đúng với mọi số thực $x,y$ (không cần điều kiện dương), dấu bằng khi $x=y$.

**Phần 2. Trình bày**

Với mọi số thực $x,y$ ta có $x^2+y^2\ge2xy$ (vì $(x-y)^2\ge0$), dấu bằng khi $x=y$. Áp dụng cho từng cặp:

$a^2+b^2\ge2ab$, $b^2+c^2\ge2bc$, $c^2+a^2\ge2ca$.

Cộng từng vế: $2(a^2+b^2+c^2)\ge2(ab+bc+ca)$.

Do đó

$3(a^2+b^2+c^2)=(a^2+b^2+c^2)+2(a^2+b^2+c^2)\ge(a^2+b^2+c^2)+2(ab+bc+ca)=(a+b+c)^2$.

Chia hai vế cho $9>0$:

$\dfrac{a^2+b^2+c^2}{3}\ge\dfrac{(a+b+c)^2}{9}=\left(\dfrac{a+b+c}{3}\right)^2$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $a=b=c$.

=== T8D1C5.3@p189
- bai: 3 · y: - · trang: 189 · tang: nang_cao
- nguon_de: Đề TS lớp 10 chuyên Lê Hồng Phong – TPHCM 2003-2004
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · bất đẳng thức Cô-si cho hai số dương · $\dfrac1a+\dfrac1b\ge\dfrac4{a+b}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Đề TS lớp 10 chuyên Lê Hồng Phong – TPHCM 2003-2004) Cho $x>0$; $y>0$; $x+y\le1$. Chứng minh $\dfrac{1}{x^2+xy}+\dfrac{1}{y^2+xy}\ge4$.
## SACH
Áp dụng bất đẳng thức Cô si cho hai số dương $a,b$ ta có $\dfrac{a+b}{2}\ge\sqrt{ab}$
$\dfrac1a+\dfrac1b\ge2\sqrt{\dfrac1a\cdot\dfrac1b}\Rightarrow(a+b)\left(\dfrac1a+\dfrac1b\right)\ge2\sqrt{ab}\cdot2\sqrt{\dfrac1a\cdot\dfrac1b}$, suy ra
$(a+b)\left(\dfrac1a+\dfrac1b\right)\ge4\Rightarrow\dfrac1a+\dfrac1b\ge\dfrac{4}{a+b}$. Áp dụng vào bài toán ta có
$\dfrac{1}{x^2+xy}+\dfrac{1}{y^2+xy}\ge\dfrac{4}{x^2+xy+y^2+xy}=\dfrac{4}{(x+y)^2}\ge4$ (Do $x+y\le1$)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai mẫu $x^2+xy$ và $y^2+xy$ có tổng là $(x+y)^2$, nên bất đẳng thức $\dfrac1u+\dfrac1v\ge\dfrac{4}{u+v}$ (hệ quả của Cô-si) đưa vế trái xuống $\dfrac{4}{(x+y)^2}$, mà điều kiện $x+y\le1$ cho ngay cận $4$.

**Bước 1.** Chứng minh $\dfrac1u+\dfrac1v\ge\dfrac{4}{u+v}$ với $u,v>0$ bằng cách nhân $u+v\ge2\sqrt{uv}$ với $\dfrac1u+\dfrac1v\ge2\sqrt{\dfrac1{uv}}$.

**Bước 2.** Chọn $u=x^2+xy$, $v=y^2+xy$ rồi kiểm tra $u,v>0$ và tính tổng $u+v$ theo $x+y$.

**Bước 3.** Dùng điều kiện $0<x+y\le1$ để chặn $\dfrac{4}{(x+y)^2}$ từ dưới bằng $4$, rồi tìm điều kiện dấu bằng.

**Chú ý:** Cô-si chỉ dùng được cho các số dương; ở đây $x,y>0$ nên $x^2+xy$ và $y^2+xy$ đều dương. Dấu bằng cần cả hai điều kiện: $u=v$ và $x+y=1$.

**Phần 2. Trình bày**

Với $u,v>0$, theo bất đẳng thức Cô-si cho hai số dương (dấu bằng khi hai số bằng nhau):

$u+v\ge2\sqrt{uv}$ và $\dfrac1u+\dfrac1v\ge2\sqrt{\dfrac{1}{uv}}$.

Nhân từng vế (các vế đều dương): $(u+v)\left(\dfrac1u+\dfrac1v\right)\ge4$, suy ra $\dfrac1u+\dfrac1v\ge\dfrac{4}{u+v}$ (dấu bằng khi $u=v$).

Vì $x,y>0$ nên $u=x^2+xy>0$ và $v=y^2+xy>0$, và $u+v=x^2+2xy+y^2=(x+y)^2$. Do đó

$\dfrac{1}{x^2+xy}+\dfrac{1}{y^2+xy}\ge\dfrac{4}{(x+y)^2}$.

Vì $0<x+y\le1$ nên $(x+y)^2\le1$, suy ra $\dfrac{4}{(x+y)^2}\ge4$.

Vậy $\dfrac{1}{x^2+xy}+\dfrac{1}{y^2+xy}\ge4$.

Dấu bằng xảy ra khi $u=v$ và $x+y=1$, tức $x^2=y^2$ (suy ra $x=y$ vì $x,y>0$) và $x+y=1$, hay $x=y=\dfrac12$.

=== T8D1C5.4@p190
- bai: 4 · y: - · trang: 190 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · chuyển vế, quy đồng · nhân hai bất đẳng thức cùng chiều giữa các số dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: dòng đầu lời giải sách in "(b − c)" thay cho "(b + c)" của đề (các dòng sau dùng $(b+c)^2$), có thể do scan hỏng dấu "+"; mép trang mất chữ $b$ ở "bd(ab−cd)" và dấu "(" ở "(b+c)²ad…", dựng lại theo biến đổi. Chép ## SACH đúng như nhìn thấy.
## DE
Cho $0<a<b<c<d$. Chứng minh $(b+c)\left(\dfrac1b+\dfrac1c\right)<\dfrac{(a+d)^2}{ad}$.
## SACH
$(b-c)\left(\dfrac1b+\dfrac1c\right)<\dfrac{(a+d)^2}{ad}\Leftrightarrow\dfrac{(b+c)^2}{bc}-\dfrac{(a+d)^2}{ad}<0$
$\Leftrightarrow\dfrac{(b+c)^2ad-(a+d)^2bc}{abcd}<0\Leftrightarrow(b+c)^2ad-(a+d)^2bc<0$
(vì $a,b,c,d$ dương)$\Leftrightarrow b^2ad+c^2ad-a^2bc-d^2bc<0$
$\Leftrightarrow bd(ab-cd)+ac(cd-ab)<0\Leftrightarrow(ab-cd)(bd-ac)<0$
Mà $0<a<d$ và $0<b<c$, nên $ab<cd\Leftrightarrow ab-cd<0$
$d>c>0$ và $b>a>0$, nên $bd>ac\Leftrightarrow bd-ac>0$
Suy ra $(ab-cd)(bd-ac)<0$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái $(b+c)\left(\dfrac1b+\dfrac1c\right)=\dfrac{(b+c)^2}{bc}$ nên bất đẳng thức là so sánh hai phân thức cùng dạng; chuyển vế, quy đồng, khử mẫu dương rồi nhóm hạng tử để xuất hiện tích hai nhân tử mà dấu của từng nhân tử đọc được từ $0<a<b<c<d$.

**Bước 1.** Viết vế trái thành $\dfrac{(b+c)^2}{bc}$, chuyển vế phải sang trái và quy đồng mẫu $abcd$.

**Bước 2.** Nhân hai vế với $abcd>0$ để bỏ mẫu rồi khai triển, chú ý hai hạng tử $2abcd$ triệt tiêu nhau.

**Bước 3.** Nhóm bốn hạng tử còn lại theo cặp $b^2ad$ với $-d^2bc$ và $c^2ad$ với $-a^2bc$ để đặt nhân tử chung và đưa về tích $(ab-cd)(bd-ac)$.

**Bước 4.** Dùng các bất đẳng thức $0<a<b<c<d$ để xét dấu từng nhân tử rồi kết luận dấu của tích.

**Chú ý:** Chỉ nhân hai bất đẳng thức cùng chiều khi các vế đều dương; ở đây $a,b,c,d>0$ nên được phép suy ra $ab<cd$ và $ac<bd$.

**Phần 2. Trình bày**

Với $0<a<b<c<d$ thì $abcd>0$.

$(b+c)\left(\dfrac1b+\dfrac1c\right)<\dfrac{(a+d)^2}{ad}$

$\Leftrightarrow\dfrac{(b+c)^2}{bc}-\dfrac{(a+d)^2}{ad}<0$

$\Leftrightarrow\dfrac{(b+c)^2ad-(a+d)^2bc}{abcd}<0$

$\Leftrightarrow(b+c)^2ad-(a+d)^2bc<0$ (nhân hai vế với $abcd>0$)

$\Leftrightarrow b^2ad+c^2ad-a^2bc-d^2bc<0$ (hai hạng tử $2abcd$ triệt tiêu)

$\Leftrightarrow bd(ab-cd)+ac(cd-ab)<0$

$\Leftrightarrow(ab-cd)(bd-ac)<0$.

Vì $0<a<d$ và $0<b<c$ nên $ab<cd$, tức $ab-cd<0$.

Vì $0<a<b$ và $0<c<d$ nên $ac<bd$, tức $bd-ac>0$.

Tích của một số âm và một số dương là số âm, nên $(ab-cd)(bd-ac)<0$. Bất đẳng thức cuối đúng, nên bất đẳng thức đã cho đúng.

Bất đẳng thức là chặt nên không xảy ra dấu bằng.

=== T8D1C5.5a@p190
- bai: 5 · y: a · trang: 190 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ · tổng bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: nhãn số ví dụ ("Ví dụ 5") bị mờ, đọc theo thứ tự trong Cách 5. Dòng đầu của Cách 1 in "$x^2-y^2=\dfrac{x^2+y^2+x^2+y^2}{2}$" (dấu "−" ở vế trái; đúng phải là $x^2+y^2$, có thể do scan hỏng dấu "+"); chép đúng như nhìn thấy. Ví dụ 5 có hai ý a, b; ý b dùng kết quả ý a, nhưng ở kho tách thành hai câu và lời giải câu b tự chứng minh lại bất đẳng thức của ý a. Sách giải ý a hai cách (Cách 1, Cách 2) — kho chép cả hai.
## DE
Chứng minh rằng: $x^2+y^2\ge\dfrac{(x+y)^2}{2}$.
## SACH
Cách 1: $x^2-y^2=\dfrac{x^2+y^2+x^2+y^2}{2}=\dfrac{(x^2+y^2+2xy)+(x^2+y^2-2xy)}{2}$
$=\dfrac{(x+y)^2+(x-y)^2}{2}\ge\dfrac{(x+y)^2}{2}$ vì $(x-y)^2\ge0$
Cách 2: $x^2+y^2\ge\dfrac{(x+y)^2}{2}\Leftrightarrow2(x^2+y^2)\ge(x+y)^2$
$\Rightarrow2x^2+2y^2\ge x^2+2xy+y^2\Leftrightarrow x^2+y^2-2xy\ge0$
$\Leftrightarrow(x-y)^2\ge0$ (bất đẳng thức đúng). Do đó $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ là đẳng thức đúng đúng.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân hai vế với $2$ để khử mẫu rồi chuyển vế thì chỉ còn $x^2+y^2-2xy$, chính là một bình phương không âm.

**Bước 1.** Nhân hai vế với số dương $2$ để bất đẳng thức không còn mẫu.

**Bước 2.** Khai triển $(x+y)^2$ ở vế phải rồi chuyển hết các hạng tử sang vế trái và thu gọn.

**Bước 3.** Nhận ra biểu thức còn lại là bình phương của một hiệu rồi kết luận và tìm điều kiện dấu bằng.

**Chú ý:** Bất đẳng thức này đúng với mọi số thực $x,y$ và hay được dùng làm bước phụ (nó là trường hợp riêng của bất đẳng thức Bu-nhi-a-cốp-xki).

**Phần 2. Trình bày**

$x^2+y^2\ge\dfrac{(x+y)^2}{2}$

$\Leftrightarrow2(x^2+y^2)\ge(x+y)^2$ (nhân hai vế với $2>0$)

$\Leftrightarrow2x^2+2y^2\ge x^2+2xy+y^2$

$\Leftrightarrow x^2+y^2-2xy\ge0$

$\Leftrightarrow(x-y)^2\ge0$.

Bất đẳng thức cuối đúng với mọi số thực $x,y$, nên $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ đúng.

Dấu bằng xảy ra khi $x=y$.

=== T8D1C5.5b@p190
- bai: 5 · y: b · trang: 190 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: Cách 5 — sử dụng các bất đẳng thức quen thuộc · áp dụng $u^2+v^2\ge\dfrac{(u+v)^2}{2}$ hai lần · bình phương hai vế không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: lời giải sách mở đầu "Áp dụng câu a)" và dòng "Theo a) ta có" trỏ sang ý a của cùng ví dụ; trong ## SACH đã thay bằng nêu rõ bất đẳng thức của ý a, lời giải kho tự chứng minh lại bất đẳng thức đó. Lời giải sách trải sang trang 191; dòng "Từ (1) và (2)" bỏ phép chia đôi ($\dfrac12\cdot\dfrac{(x+y)^4}{4}$), kho viết đủ.
## DE
Chứng minh rằng: $x^4+y^4\ge\dfrac{(x+y)^4}{8}$.
## SACH
Áp dụng bất đẳng thức $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ ta có: $x^4+y^4=(x^2)^2+(y^2)^2\ge\dfrac{(x^2+y^2)^2}{2}$ $(1)$
Theo bất đẳng thức đó ta có: $x^2+y^2\ge\dfrac{(x+y)^2}{2}\Rightarrow(x^2+y^2)^2\ge\left[\dfrac{(x+y)^2}{2}\right]^2$ (bình phương hai vế không âm). Vậy $(x^2+y^2)^2\ge\dfrac{(x+y)^4}{4}$ $(2)$
Từ $(1)$ và $(2)$ có: $x^4+y^4\ge\dfrac{(x+y)^4}{8}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức $u^2+v^2\ge\dfrac{(u+v)^2}{2}$ dùng hai lần: lần đầu với $u=x^2$, $v=y^2$ để chuyển từ bậc bốn xuống $(x^2+y^2)^2$, lần sau với $u=x$, $v=y$ rồi bình phương để chuyển xuống $(x+y)^4$.

**Bước 1.** Chứng minh bất đẳng thức phụ $u^2+v^2\ge\dfrac{(u+v)^2}{2}$ với mọi số thực $u,v$ bằng cách khử mẫu và đưa về một bình phương.

**Bước 2.** Áp dụng bất đẳng thức phụ với $u=x^2$, $v=y^2$ để chặn dưới $x^4+y^4$ bằng một biểu thức theo $x^2+y^2$.

**Bước 3.** Áp dụng lại với $u=x$, $v=y$ rồi bình phương hai vế không âm để chặn dưới $(x^2+y^2)^2$ bằng một biểu thức theo $x+y$.

**Bước 4.** Ghép hai bất đẳng thức bằng bắc cầu rồi xét điều kiện dấu bằng ở từng bước.

**Chú ý:** Bình phương hai vế của một bất đẳng thức chỉ được giữ nguyên chiều khi cả hai vế không âm; ở đây $x^2+y^2\ge\dfrac{(x+y)^2}{2}\ge0$ nên được phép.

**Phần 2. Trình bày**

Với mọi số thực $u,v$: $u^2+v^2\ge\dfrac{(u+v)^2}{2}\Leftrightarrow2u^2+2v^2\ge u^2+2uv+v^2\Leftrightarrow(u-v)^2\ge0$ (đúng), dấu bằng khi $u=v$ $(*)$.

Áp dụng $(*)$ với $u=x^2$, $v=y^2$:

$x^4+y^4=(x^2)^2+(y^2)^2\ge\dfrac{(x^2+y^2)^2}{2}$ $(1)$.

Áp dụng $(*)$ với $u=x$, $v=y$: $x^2+y^2\ge\dfrac{(x+y)^2}{2}\ge0$. Bình phương hai vế (đều không âm):

$(x^2+y^2)^2\ge\dfrac{(x+y)^4}{4}$ $(2)$.

Từ $(1)$ và $(2)$:

$x^4+y^4\ge\dfrac{(x^2+y^2)^2}{2}\ge\dfrac12\cdot\dfrac{(x+y)^4}{4}=\dfrac{(x+y)^4}{8}$.

Vậy bất đẳng thức đã cho đúng. Dấu bằng xảy ra khi $x^2=y^2$ ở $(1)$ và $x=y$ ở $(2)$, tức $x=y$.
