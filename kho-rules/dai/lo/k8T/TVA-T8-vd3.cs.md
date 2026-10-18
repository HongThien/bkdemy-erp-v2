=== T8D1C6.1@p191
- bai: 1 · y: - · trang: 191 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030103
- cong_cu: Dạng 1 Chứng minh bất đẳng thức – Cách 6: sắp thứ tự các biến khi các biến có vai trò như nhau · hằng đẳng thức hiệu hai bình phương · nhân từng vế các bất đẳng thức cùng chiều có hai vế dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề sách viết "Chứng minh bất đẳng thức được nêu ở trên: abc≥(b+c−a)(a+c−b)(a+b−c) (1). Trong đó điều kiện a, b, c là độ dài ba cạnh của một tam giác được thay bởi a, b, c là các số dương"; đề kho viết lại tự đủ nghĩa (đúng biểu thức và điều kiện sách in). Lời giải sách: Cách 1 TH b chỉ ghi "Giải tiếp như ví dụ 99" (sách không có ví dụ 99; ý là ví dụ ở Cách 2 chứng minh cùng bất đẳng thức này, điều kiện tam giác); Cách 2 dừng ở "Bạn đọc giải tiếp"; Cách 2 viết "vế phải của (1) là số dương" khi không có số nào âm — đúng ra chỉ không âm (một thừa số có thể bằng 0). Lời giải kho soạn đủ theo Cách 1, nhắc Cách 2 ở mục Chú ý.
## DE
Chứng minh bất đẳng thức $abc\ge(b+c-a)(a+c-b)(a+b-c)$ với $a$, $b$, $c$ là các số dương.
## SACH
Cách 1. Do vai trò của $a$, $b$, $c$ như nhau, ta giả sử rằng $a\ge b\ge c$. Xét hai trường hợp:
a. $b+c\le a$. Khi đó vế trái của (1) là số dương, còn vế phải không dương. Bất đẳng thức được chứng minh.
b. $b+c>a$. Khi đó hai vế của (1) đều dương. Giải tiếp như ví dụ 99.
Cách 2. Trong ba số $b+c-a$, $a+c-b$, $a+b-c$, không có quá một số âm. Thật vậy, chẳng hạn nếu $b+c-a<0$, $a+c-b<0$ thì $2c<0$, trái với giả thiết. Nếu có đúng một số âm thì vế phải của (1) là số âm, bất đẳng thức (1) hiển nhiên đúng. Nếu không có số nào âm thì vế phải của (1) là số dương. Bạn đọc giải tiếp.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế đối xứng theo $a$, $b$, $c$ nên được phép sắp thứ tự $a\ge b\ge c$; khi đó chỉ cần xét dấu của thừa số $b+c-a$, và khi cả ba thừa số bên phải dương thì ghép từng $a^2$, $b^2$, $c^2$ với một cặp thừa số bằng hiệu hai bình phương.

**Bước 1.** Nhận xét vế phải không đổi khi hoán vị ba biến, rồi giả sử $a\ge b\ge c>0$ mà không mất tổng quát.

**Bước 2.** Xét trường hợp $b+c\le a$: chỉ ra vế phải không dương còn vế trái dương nên bất đẳng thức hiển nhiên đúng.

**Bước 3.** Xét trường hợp $b+c>a$: chứng tỏ cả ba thừa số bên phải đều dương, rồi so sánh $a^2$ với tích hai thừa số chứa $a$ bằng cách viết tích đó thành hiệu hai bình phương.

**Bước 4.** Làm tương tự cho $b^2$ và $c^2$, sau đó nhân ba bất đẳng thức có hai vế dương để có bình phương hai vế cần so sánh.

**Bước 5.** Từ bình phương hai số dương suy ra chính hai số đó, và xét xem dấu bằng xảy ra khi nào.

**Chú ý:** Không cần sắp thứ tự cũng làm được: trong ba thừa số $b+c-a$, $a+c-b$, $a+b-c$ không thể có hai số âm (cộng hai số bất kì được $2$ lần một biến dương); nếu có một số âm thì vế phải âm, còn nếu không có số âm thì làm như trường hợp $b+c>a$ (nhân các bất đẳng thức có hai vế không âm vẫn đúng).

**Phần 2. Trình bày**

Hai vế của bất đẳng thức đối xứng theo $a$, $b$, $c$ nên ta giả sử $a\ge b\ge c>0$.

Trường hợp 1: $b+c\le a$. Khi đó $b+c-a\le0$. Vì $a\ge b$ nên $a+c-b\ge c>0$; vì $b\ge c$ nên $a+b-c\ge a>0$. Do đó $(b+c-a)(a+c-b)(a+b-c)\le0<abc$, bất đẳng thức đúng.

Trường hợp 2: $b+c>a$. Khi đó $b+c-a>0$, và theo trên $a+c-b>0$, $a+b-c>0$. Ta có

$a^2-(a+c-b)(a+b-c)=a^2-\left[a^2-(b-c)^2\right]=(b-c)^2\ge0\Rightarrow a^2\ge(a+c-b)(a+b-c)$

$b^2-(a+b-c)(b+c-a)=b^2-\left[b^2-(a-c)^2\right]=(a-c)^2\ge0\Rightarrow b^2\ge(a+b-c)(b+c-a)$

$c^2-(b+c-a)(a+c-b)=c^2-\left[c^2-(a-b)^2\right]=(a-b)^2\ge0\Rightarrow c^2\ge(b+c-a)(a+c-b)$

Cả sáu vế đều dương, nhân từng vế ba bất đẳng thức trên:

$a^2b^2c^2\ge\left[(b+c-a)(a+c-b)(a+b-c)\right]^2$

Vì $abc>0$ và $(b+c-a)(a+c-b)(a+b-c)>0$ nên $abc\ge(b+c-a)(a+c-b)(a+b-c)$ (nếu $abc$ nhỏ hơn thì bình phương của nó cũng nhỏ hơn, trái với bất đẳng thức trên).

Vậy trong cả hai trường hợp bất đẳng thức đã cho đúng.

Dấu bằng không xảy ra ở trường hợp 1; ở trường hợp 2 dấu bằng xảy ra khi và chỉ khi $(b-c)^2=(a-c)^2=(a-b)^2=0$. Dấu bằng xảy ra khi $a=b=c$.

=== T8D1C7.1@p191
- bai: 1 · y: - · trang: 191 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: Dạng 1 Chứng minh bất đẳng thức – Cách 7: xét từng khoảng giá trị của biến · nhóm hạng tử đặt nhân tử chung
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng: $x^8-x^7+x^2-x+1>0$.
## SACH
Gọi $A$ là vế trái của bất đẳng thức.
Cách 1. Nếu $x\ge1$ thì ta viết $A$ dưới dạng $x^7(x-1)+x(x-1)+1$.
Do $x\ge1$ nên $A>0$.
Nếu $x<1$ thì ta viết $A$ dưới dạng $x^8+x^2(1-x^5)+(1-x)$. Do $x<1$ nên $1-x^5>0$, do đó $A>0$.
Cách 2. $A=x^7(x-1)-(x-1)+x^2=(x-1)(x^7-1)+x^2$.
Nếu $x\ge1$ thì $x^7\ge1$, do đó $(x-1)(x^7-1)\ge0$, còn $x^2>0$ nên $A>0$.
Nếu $x<1$ thì $x^7<1$, do đó $(x-1)(x^7-1)>0$, còn $x^2\ge0$ nên $A>0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái có hạng tử mang dấu trừ nên không xét dấu một lần được; dấu của $x-1$ đổi ở $x=1$, nên chia hai khoảng để ở mỗi khoảng nhóm được các hạng tử cùng dấu.

**Bước 1.** Gọi $A$ là vế trái rồi chia hai khoảng $x\ge1$ và $x<1$, vì ở hai khoảng này dấu của $x-1$ khác nhau.

**Bước 2.** Với $x\ge1$, nhóm $x^8-x^7$ và $x^2-x$ để đặt thừa số $x-1$, được hai tích đều không âm cộng với $1$.

**Bước 3.** Với $x<1$, tách $A$ thành tổng của ba biểu thức: lũy thừa chẵn, một tích chứa $1-x^5$ và chính $1-x$; mỗi biểu thức đều không âm.

**Bước 4.** Chỉ ra ở mỗi khoảng còn một số hạng dương, từ đó kết luận $A>0$ với mọi $x$.

**Chú ý:** Có thể viết gọn $A=(x-1)(x^7-1)+x^2$: dù $x\ge1$ hay $x<1$ thì hai thừa số $x-1$ và $x^7-1$ luôn cùng dấu (cùng không âm hoặc cùng âm) nên tích không âm, còn $x^2\ge0$; hai số hạng không cùng bằng $0$ nên tổng dương.

**Phần 2. Trình bày**

Gọi $A=x^8-x^7+x^2-x+1$.

Trường hợp $x\ge1$: $A=x^7(x-1)+x(x-1)+1$.

Vì $x\ge1$ nên $x^7>0$, $x>0$, $x-1\ge0$, suy ra $x^7(x-1)\ge0$ và $x(x-1)\ge0$. Do đó $A\ge1>0$.

Trường hợp $x<1$: $A=x^8+x^2(1-x^5)+(1-x)$.

Vì $x<1$ nên $1-x>0$ và $x^5<1$, tức $1-x^5>0$. Mặt khác $x^8\ge0$ và $x^2\ge0$ nên $x^8\ge0$, $x^2(1-x^5)\ge0$. Do đó $A\ge1-x>0$.

Vậy với mọi $x$ ta có $A>0$, tức $x^8-x^7+x^2-x+1>0$.

Bất đẳng thức là bất đẳng thức ngặt nên dấu bằng không xảy ra.

=== T8D2C1.1a@p192
- bai: 1 · y: a · trang: 192 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=g(x)²+C hoặc C−g(x)² · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: -7
- dap_an: GTNN $=-7$, đạt khi $x=2$
- ghi_chu_nghi: nhãn "Cách 1" và "Ví dụ 1" của Dạng 2 bị mép trang làm mờ; đánh số Cách 1, Ví dụ 1 (ví dụ sau là "Ví dụ 2"). Ví dụ có ba ý a, b, c độc lập nên mỗi ý một câu.
## DE
Tìm giá trị nhỏ nhất của $A=2x^2-8x+1$.
## SACH
a. $A=2x^2-8x+1=2(x^2-4x+4)-7=2(x-2)^2-7\ge-7$.
$\min A=-7$ khi và chỉ khi $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hệ số của $x^2$ dương thì chỉ có giá trị nhỏ nhất; đưa nó về dạng "bình phương của một nhị thức nhân hệ số dương, cộng hằng số" thì thấy ngay cận dưới.

**Bước 1.** Đặt hệ số $2$ ra ngoài hai hạng tử chứa $x$ để trong ngoặc hệ số của $x^2$ bằng $1$.

**Bước 2.** Thêm bớt một hằng số thích hợp để trong ngoặc xuất hiện bình phương của một nhị thức.

**Bước 3.** Dùng tính chất bình phương luôn không âm để chặn dưới giá trị của biểu thức với mọi $x$.

**Bước 4.** Tìm giá trị cụ thể của $x$ làm bình phương bằng $0$ để chứng tỏ cận dưới đó thật sự đạt được.

**Chú ý:** Chỉ chứng minh được $A\ge-7$ thì chưa kết luận GTNN; còn phải chỉ ra giá trị $x$ để dấu bằng xảy ra.

**Phần 2. Trình bày**

$A=2x^2-8x+1=2(x^2-4x+4)-7=2(x-2)^2-7$.

Vì $(x-2)^2\ge0$ với mọi $x$ nên $A\ge-7$ với mọi $x$. (1)

Dấu bằng xảy ra khi $x-2=0$, tức $x=2$; khi đó $A=2\cdot0-7=-7$. (2)

Từ (1) và (2): GTNN của $A$ bằng $-7$, đạt khi $x=2$.

=== T8D2C1.1b@p192
- bai: 1 · y: b · trang: 192 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=C−g(x)² · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: \dfrac{9}{5}
- dap_an: GTLN $=\dfrac{9}{5}$, đạt khi $x=-\dfrac{2}{5}$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của $B=-5x^2-4x+1$.
## SACH
b. $B=-5x^2-4x+1=-5\left(x^2+\dfrac{4}{5}x+\dfrac{4}{25}\right)+\dfrac{9}{5}=-5\left(x+\dfrac{2}{5}\right)^2+\dfrac{9}{5}\le\dfrac{9}{5}$
$\max B=\dfrac{9}{5}$ khi và chỉ khi $x=-\dfrac{2}{5}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số của $x^2$ âm nên biểu thức chỉ có giá trị lớn nhất; đưa về dạng "hằng số trừ một bình phương nhân số dương" thì thấy cận trên.

**Bước 1.** Đặt $-5$ ra ngoài hai hạng tử chứa $x$ để trong ngoặc hệ số của $x^2$ bằng $1$.

**Bước 2.** Thêm bớt hằng số thích hợp để trong ngoặc có bình phương của một nhị thức, rồi gộp các hằng số lại.

**Bước 3.** Dùng bình phương không âm và hệ số $-5$ âm để chặn trên biểu thức với mọi $x$.

**Bước 4.** Tìm giá trị của $x$ làm bình phương bằng $0$ để kiểm tra cận trên đạt được.

**Chú ý:** Khi đặt hệ số âm ra ngoài thì mọi dấu trong ngoặc phải đổi theo, kiểm tra lại bằng cách nhân ngược ra.

**Phần 2. Trình bày**

$B=-5x^2-4x+1=-5\left(x^2+\dfrac{4}{5}x+\dfrac{4}{25}\right)+\dfrac{4}{5}+1=-5\left(x+\dfrac{2}{5}\right)^2+\dfrac{9}{5}$.

Vì $\left(x+\dfrac{2}{5}\right)^2\ge0$ với mọi $x$ nên $-5\left(x+\dfrac{2}{5}\right)^2\le0$, suy ra $B\le\dfrac{9}{5}$ với mọi $x$. (1)

Dấu bằng xảy ra khi $x+\dfrac{2}{5}=0$, tức $x=-\dfrac{2}{5}$; khi đó $B=\dfrac{9}{5}$. (2)

Từ (1) và (2): GTLN của $B$ bằng $\dfrac{9}{5}$, đạt khi $x=-\dfrac{2}{5}$.

=== T8D2C1.1c@p192
- bai: 1 · y: c · trang: 192 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=g(x)²+C hoặc C−g(x)² · hoàn thành bình phương (tam thức tổng quát)
- kiem: khong
- ket_qua_sach: c-\dfrac{b^2}{4a}
- dap_an: GTNN $=c-\dfrac{b^2}{4a}$ (khi $a>0$), đạt khi $x=-\dfrac{b}{2a}$; GTLN $=c-\dfrac{b^2}{4a}$ (khi $a<0$), đạt khi $x=-\dfrac{b}{2a}$
- ghi_chu_nghi: ý c có hai yêu cầu theo dấu của $a$, cùng một phép biến đổi nên giữ thành một câu, mỗi yêu cầu một đoạn. Mép trang mất chữ đầu ở "P = ax²+bx+c" và "Tìm"; dựng theo lời giải.
## DE
Cho tam thức bậc hai $P=ax^2+bx+c$.

Tìm giá trị nhỏ nhất của $P$ nếu $a>0$.

Tìm giá trị lớn nhất của $P$ nếu $a<0$.
## SACH
c. $P=ax^2+bx+c=a\left(x^2+\dfrac{b}{a}x\right)+c=a\left(x+\dfrac{b}{2a}\right)^2+c-\dfrac{b^2}{4a}$.
Đặt $c-\dfrac{b^2}{4a}=k$. Do $\left(x+\dfrac{b}{2a}\right)^2\ge0$ nên:
– Nếu $a>0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\ge0$, do đó $P\ge k$:
$\min P=k$ khi và chỉ khi $x=-\dfrac{b}{2a}$;
– Nếu $a<0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\le0$, do đó $P\le k$;
$\max P=k$ khi và chỉ khi $x=-\dfrac{b}{2a}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hoàn thành bình phương cho tam thức tổng quát để được $a\left(x+\dfrac{b}{2a}\right)^2+k$; dấu của $a$ quyết định biểu thức có cận dưới hay cận trên.

**Bước 1.** Đặt $a$ ra ngoài hai hạng tử chứa $x$ rồi thêm bớt hằng số để xuất hiện bình phương của $x+\dfrac{b}{2a}$.

**Bước 2.** Gộp phần hằng số còn lại thành một số $k$ không chứa $x$.

**Bước 3.** Với $a>0$, dùng bình phương không âm để chặn dưới $P$ bởi $k$ với mọi $x$.

**Bước 4.** Với $a<0$, cũng dùng bình phương không âm nhưng nhân với $a$ âm nên chặn trên $P$ bởi $k$.

**Bước 5.** Chỉ ra giá trị $x$ làm bình phương bằng $0$ để dấu bằng thật sự xảy ra ở cả hai trường hợp.

**Chú ý:** Phép biến đổi cần $a\ne0$; kiểm tra lại bằng khai triển: $a\left(x+\dfrac{b}{2a}\right)^2=ax^2+bx+\dfrac{b^2}{4a}$.

**Phần 2. Trình bày**

$P=ax^2+bx+c=a\left(x^2+\dfrac{b}{a}x\right)+c=a\left(x+\dfrac{b}{2a}\right)^2+c-\dfrac{b^2}{4a}$.

Đặt $k=c-\dfrac{b^2}{4a}$, ta có $P=a\left(x+\dfrac{b}{2a}\right)^2+k$ và $\left(x+\dfrac{b}{2a}\right)^2\ge0$ với mọi $x$.

Nếu $a>0$: $a\left(x+\dfrac{b}{2a}\right)^2\ge0$ nên $P\ge k$ với mọi $x$. (1)

Dấu bằng xảy ra khi $x+\dfrac{b}{2a}=0$, tức $x=-\dfrac{b}{2a}$; khi đó $P=k$. (2)

Từ (1) và (2): GTNN của $P$ bằng $k=c-\dfrac{b^2}{4a}$, đạt khi $x=-\dfrac{b}{2a}$.

Nếu $a<0$: $a\left(x+\dfrac{b}{2a}\right)^2\le0$ nên $P\le k$ với mọi $x$. (3)

Dấu bằng xảy ra khi $x=-\dfrac{b}{2a}$; khi đó $P=k$. (4)

Từ (3) và (4): GTLN của $P$ bằng $k=c-\dfrac{b^2}{4a}$, đạt khi $x=-\dfrac{b}{2a}$.

=== T8D2C1.2a@p192
- bai: 2 · y: a · trang: 192 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=g(x)²+C · nhóm hai nhân tử thành tam thức cùng phần biến, đặt ẩn phụ
- kiem: khong
- ket_qua_sach: -36
- dap_an: GTNN $=-36$, đạt khi $x=0$ hoặc $x=-5$
- ghi_chu_nghi: mép trang mất chữ $x$ ở "(x−1)" trong đề (in thành dấu chấm), dựng lại theo lời giải của sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $(x-1)(x+2)(x+3)(x+6)$.
## SACH
a. $(x-1)(x+2)(x+3)(x+6)=(x-1)(x+6)(x+2)(x+3)$
$=(x^2+5x-6)(x^2+5x+6)=(x^2+5x)^2-36$.
Đa thức đạt giá trị nhỏ nhất là $-36$ khi $x^2+5x=0$ tức là $x=0$ hoặc $x=-5$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn nhân tử bậc nhất có tổng hai số hạng tự do bằng nhau theo cặp ($-1$ với $6$, $2$ với $3$) nên ghép thành hai tam thức chỉ khác nhau hằng số, rồi đặt ẩn phụ là phần chung.

**Bước 1.** Ghép $(x-1)(x+6)$ và $(x+2)(x+3)$ để mỗi tích đều có hạng tử $x^2+5x$ giống nhau.

**Bước 2.** Đặt $t=x^2+5x$ để biểu thức thành tích của hai biểu thức chỉ khác nhau dấu của một hằng số.

**Bước 3.** Dùng hằng đẳng thức hiệu hai bình phương để đưa biểu thức về dạng $t^2$ trừ một hằng số, rồi chặn dưới bằng $t^2\ge0$.

**Bước 4.** Giải $t=0$ để tìm giá trị của $x$ làm dấu bằng xảy ra.

**Chú ý:** Đặt $t=x^2+5x$ thì $t$ không bị tùy ý hoàn toàn, nên phải kiểm tra $t=0$ có đạt được không (ở đây có nghiệm $x=0$, $x=-5$).

**Phần 2. Trình bày**

Gọi $A=(x-1)(x+2)(x+3)(x+6)$. Ta có

$A=(x-1)(x+6)(x+2)(x+3)=(x^2+5x-6)(x^2+5x+6)$.

Đặt $t=x^2+5x$, khi đó $A=(t-6)(t+6)=t^2-36$.

Vì $t^2\ge0$ nên $A\ge-36$ với mọi $x$. (1)

Dấu bằng xảy ra khi $t=0$, tức $x^2+5x=0\Leftrightarrow x(x+5)=0\Leftrightarrow x=0$ hoặc $x=-5$. Thử $x=0$: $A=(-1)\cdot2\cdot3\cdot6=-36$. (2)

Từ (1) và (2): GTNN của $A$ bằng $-36$, đạt khi $x=0$ hoặc $x=-5$.

=== T8D2C1.2b@p192
- bai: 2 · y: b · trang: 192 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=g(x)²+C · tổng hai bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: -14
- dap_an: GTNN $=-14$, đạt khi $x=2$, $y=4$
- ghi_chu_nghi: mép trang làm mờ hạng tử "−4x" ở đề; dựng lại theo lời giải của sách ($(x-2)^2$).
## DE
Tìm giá trị nhỏ nhất của biểu thức $x^2-4x+y^2-8y+6$.
## SACH
b. $x^2-4x+y^2-8y+6=(x-2)^2+(y-4)^2-14$. Đa thức đạt giá trị nhỏ nhất là $-14$ khi $x-2=0$ và $y-4=0$, tức $x=2$ và $y=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức hai biến mà các hạng tử bậc hai không chéo nhau nên tách riêng theo từng biến và hoàn thành bình phương cho $x$ và cho $y$.

**Bước 1.** Nhóm các hạng tử theo từng biến: $x^2-4x$ và $y^2-8y$.

**Bước 2.** Thêm bớt hằng số để mỗi nhóm thành bình phương của một nhị thức và gộp phần hằng số còn lại.

**Bước 3.** Dùng hai bình phương không âm để chặn dưới giá trị của biểu thức với mọi $x$, $y$.

**Bước 4.** Cho cả hai nhị thức bằng $0$ để tìm cặp $(x;y)$ làm dấu bằng xảy ra.

**Phần 2. Trình bày**

Gọi $A=x^2-4x+y^2-8y+6$. Ta có

$A=(x^2-4x+4)+(y^2-8y+16)-14=(x-2)^2+(y-4)^2-14$.

Vì $(x-2)^2\ge0$ và $(y-4)^2\ge0$ với mọi $x$, $y$ nên $A\ge-14$. (1)

Dấu bằng xảy ra khi $x-2=0$ và $y-4=0$, tức $x=2$, $y=4$; khi đó $A=-14$. (2)

Từ (1) và (2): GTNN của $A$ bằng $-14$, đạt khi $x=2$ và $y=4$.

=== T8D2C1.3a@p193
- bai: 3 · y: a · trang: 193 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020302
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1 (ví dụ về tam thức bậc hai) · phân tích tam thức bậc hai thành nhân tử bằng cách tách hạng tử · xét dấu tích
- kiem: khong
- ket_qua_sach: 3(x-3)(x-6); x\le3; x\ge6
- dap_an: $P(x)=3(x-3)(x-6)$; $P(x)\ge0$ khi $x\le3$ hoặc $x\ge6$
- ghi_chu_nghi: ý a của ví dụ này không phải bài cực trị mà là phân tích nhân tử rồi giải bất phương trình tích; phân vân nhóm T18T020302 / T18T010202, chọn theo mục tiêu cuối của đề (tìm $x$ để $P(x)\ge0$). Đề có hai yêu cầu nên giữ thành một câu, mỗi yêu cầu một đoạn.
## DE
Phân tích đa thức $P(x)$ thành nhân tử: $P(x)=3x^2-27x+54$.

Với giá trị nào của $x$ thì $P(x)$ nhận giá trị không âm?
## SACH
a. $P(x)=3x^2-27x+54=3(x^2-9x+18)=3(x^2-3x-6x+18)$
$=3\left[(x^2-3x)-(6x-18)\right]=3\left[x(x-3)-6(x-3)\right]$. Suy ra:
$P(x)=3(x-3)(x-6)$
$P(x)\ge0\Leftrightarrow(x-3)(x-6)\ge0\Leftrightarrow$ (hoặc $x-3\ge0$ và $x-6\ge0$; hoặc $x-3\le0$ và $x-6\le0$) $\Leftrightarrow$ ($x\ge6$ hoặc $x\le3$)
Vậy $P(x)\ge0\Leftrightarrow x\le3$ hoặc $x\ge6$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hai nghiệm nguyên nhìn ra được nên tách hạng tử để phân tích thành tích; tích không âm khi hai thừa số cùng dấu (hoặc có một thừa số bằng $0$).

**Bước 1.** Đặt nhân tử chung $3$ ra ngoài rồi tìm hai số có tích $18$ và tổng $-9$ để tách hạng tử $-9x$.

**Bước 2.** Nhóm các hạng tử theo cặp và đặt nhân tử chung $x-3$ để được tích của hai nhị thức.

**Bước 3.** Chuyển điều kiện $P(x)\ge0$ về điều kiện $(x-3)(x-6)\ge0$ vì hệ số $3$ dương.

**Bước 4.** Xét hai trường hợp hai thừa số cùng không âm hoặc cùng không dương rồi hợp các tập nghiệm.

**Chú ý:** Tích $\ge0$ gồm cả trường hợp một thừa số bằng $0$, nên dùng dấu $\ge$ và $\le$ ở hai khoảng, không dùng dấu $>$.

**Phần 2. Trình bày**

$P(x)=3x^2-27x+54=3(x^2-9x+18)=3(x^2-3x-6x+18)$

$=3\left[x(x-3)-6(x-3)\right]=3(x-3)(x-6)$.

Vì $3>0$ nên $P(x)\ge0\Leftrightarrow(x-3)(x-6)\ge0$.

Tích của hai số không âm khi hai số cùng không âm hoặc cùng không dương:

Trường hợp $x-3\ge0$ và $x-6\ge0$: khi đó $x\ge6$.

Trường hợp $x-3\le0$ và $x-6\le0$: khi đó $x\le3$.

Vậy $P(x)=3(x-3)(x-6)$ và $P(x)\ge0$ khi $x\le3$ hoặc $x\ge6$.

=== T8D2C1.3b@p193
- bai: 3 · y: b · trang: 193 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f=g²+C · tổng các bình phương cộng hằng số (hai biến)
- kiem: khong
- ket_qua_sach: 2; m=-3; p=1
- dap_an: GTNN $=2$, đạt khi $m=-3$, $p=1$
- ghi_chu_nghi:
## DE
Tìm $m$ và $p$ sao cho biểu thức $A=m^2-4mp+5p^2+10m-22p+28$ đạt giá trị nhỏ nhất. Tính giá trị ấy.
## SACH
b. Ta biến đổi $A$ về dạng: $A=m^2-4mp+5p^2+10m-22p+28$
$=m^2-4mp+4p^2+10m-20p+p^2-2p+1+27$
$=(m-2p)^2+10(m-2p)+(p-1)^2+25+2$
$=(m-2p)^2+10(m-2p)+5^2+(p-1)^2+2$
$A=(m-2p+5)^2+(p-1)^2+2\ge2$
$A$ đạt giá trị nhỏ nhất bằng $2$ khi $\begin{cases}p-1=0\\m-2p+5=0\end{cases}\Leftrightarrow p=1$ và $m=-3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có hạng tử $-4mp$ nên gom $m^2-4mp+4p^2$ thành $(m-2p)^2$; phần còn lại theo $m-2p$ và $p$ lại là các bình phương nên đưa được về tổng hai bình phương cộng hằng số.

**Bước 1.** Tách $5p^2=4p^2+p^2$ để $m^2-4mp+4p^2$ trở thành bình phương của $m-2p$.

**Bước 2.** Gom các hạng tử $10m-20p$ thành $10(m-2p)$ rồi thêm bớt $25$ để có bình phương $(m-2p+5)^2$.

**Bước 3.** Hoàn thành bình phương của $p-1$ từ $p^2-2p$ và gộp các hằng số còn lại.

**Bước 4.** Dùng hai bình phương không âm để chặn dưới, rồi giải hệ hai phương trình bằng $0$ để tìm $m$ và $p$.

**Chú ý:** Nhớ kiểm tra lại bằng khai triển để chắc hằng số cuối cùng đúng; cặp $(m;p)$ phải thử lại làm dấu bằng xảy ra.

**Phần 2. Trình bày**

$A=m^2-4mp+5p^2+10m-22p+28$

$=(m^2-4mp+4p^2)+(10m-20p)+(p^2-2p+1)+27$

$=(m-2p)^2+10(m-2p)+25+(p-1)^2+2$

$=(m-2p+5)^2+(p-1)^2+2$.

Vì $(m-2p+5)^2\ge0$ và $(p-1)^2\ge0$ với mọi $m$, $p$ nên $A\ge2$. (1)

Dấu bằng xảy ra khi $p-1=0$ và $m-2p+5=0$, tức $p=1$ và $m=-3$; khi đó $A=9+12+5-30-22+28=2$. (2)

Từ (1) và (2): GTNN của $A$ bằng $2$, đạt khi $m=-3$ và $p=1$.

=== T8D2C1.4@p193
- bai: 4 · y: - · trang: 193 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f(x)=g(x)²+C · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: \dfrac{39}{8}
- dap_an: GTNN $=\dfrac{39}{8}$, đạt khi $x=\dfrac{1}{4}$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của hàm số: $y=2x^2-x+5$.
## SACH
$y=2x^2-x+5=2\left(x^2-\dfrac{x}{2}+\dfrac{1}{16}-\dfrac{1}{16}\right)+5=2\left(x-\dfrac{1}{4}\right)^2+\dfrac{39}{8}\ge\dfrac{39}{8}$
với mọi giá trị của $x$. Hàm số có giá trị nhỏ nhất: $\min y=\dfrac{39}{8}\Leftrightarrow x=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hàm số là tam thức bậc hai có hệ số cao nhất dương nên hoàn thành bình phương để thấy cận dưới.

**Bước 1.** Đặt $2$ ra ngoài hai hạng tử chứa $x$ để hệ số của $x^2$ trong ngoặc bằng $1$.

**Bước 2.** Tách hệ số $-\dfrac{1}{2}$ của $x$ thành $2\cdot\left(-\dfrac{1}{4}\right)$ để chọn đúng hạng tử cần thêm bớt.

**Bước 3.** Viết thành bình phương của $x-\dfrac{1}{4}$ cộng một hằng số rồi gộp các hằng số.

**Bước 4.** Chặn dưới bằng bình phương không âm và tìm $x$ làm dấu bằng xảy ra.

**Phần 2. Trình bày**

$y=2x^2-x+5=2\left(x^2-\dfrac{1}{2}x+\dfrac{1}{16}\right)-\dfrac{1}{8}+5=2\left(x-\dfrac{1}{4}\right)^2+\dfrac{39}{8}$.

Vì $\left(x-\dfrac{1}{4}\right)^2\ge0$ với mọi $x$ nên $y\ge\dfrac{39}{8}$ với mọi $x$. (1)

Dấu bằng xảy ra khi $x-\dfrac{1}{4}=0$, tức $x=\dfrac{1}{4}$; khi đó $y=\dfrac{39}{8}$. (2)

Từ (1) và (2): GTNN của $y$ bằng $\dfrac{39}{8}$, đạt khi $x=\dfrac{1}{4}$.

=== T8D2C1.5@p193
- bai: 5 · y: - · trang: 193 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f=g²+C · hoàn thành bình phương · bất đẳng thức giá trị tuyệt đối |u| ≤ k
- kiem: khong
- ket_qua_sach: -4; -1
- dap_an: GTNN $=-4$ (đạt khi $x=-5$, $y=0$); GTLN $=-1$ (đạt khi $x=-2$, $y=0$)
- ghi_chu_nghi: sách tìm được $-4\le P\le-1$ rồi kết luận ngay, không chỉ ra cặp $(x;y)$ để dấu bằng xảy ra; lời giải kho bổ sung cả hai cặp $(-5;0)$ và $(-2;0)$ (đã thử lại vào giả thiết).
## DE
Cho $x$, $y$ là hai số thực thỏa mãn $(x+y)^2+7(x+y)+y^2+10=0$. Tìm giá trị lớn nhất và giá trị nhỏ nhất của biểu thức $P=x+y+1$.
## SACH
Từ giả thiết ta suy ra $(x+y)^2+7(x+y)+y^2+10=0$
$\Leftrightarrow(x+y)^2+2\cdot\dfrac{7}{2}(x+y)+\left(\dfrac{7}{2}\right)^2-\left(\dfrac{7}{2}\right)^2+10=-y^2\le0$
$\Leftrightarrow\left(x+y+\dfrac{7}{2}\right)^2-\dfrac{9}{4}\le0\Leftrightarrow\left(x+y+\dfrac{7}{2}\right)^2\le\dfrac{9}{4}\Leftrightarrow\left\lvert x+y+\dfrac{7}{2}\right\rvert\le\dfrac{3}{2}$
$\Leftrightarrow-\dfrac{3}{2}\le x+y+\dfrac{7}{2}\le\dfrac{3}{2}\Leftrightarrow-4\le x+y+1\le-1$.
Vậy giá trị nhỏ nhất của $P$ là $-4$, giá trị lớn nhất của $P$ là $-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trong giả thiết, phần chứa $x+y$ là tam thức bậc hai theo $t=x+y$, còn $y^2\ge0$ đứng riêng; chuyển $y^2$ sang vế phải để thu được một bất đẳng thức chỉ chứa $t$, từ đó chặn được $P=t+1$ hai phía.

**Bước 1.** Đặt $t=x+y$ và viết giả thiết thành $t^2+7t+10=-y^2$, rồi dùng $-y^2\le0$ để có $t^2+7t+10\le0$.

**Bước 2.** Hoàn thành bình phương vế trái để được $\left(t+\dfrac{7}{2}\right)^2\le\dfrac{9}{4}$ rồi lấy giá trị tuyệt đối hai vế.

**Bước 3.** Từ bất đẳng thức giá trị tuyệt đối suy ra khoảng chặn của $t$, rồi đổi sang khoảng chặn của $P=t+1$.

**Bước 4.** Với mỗi đầu mút của khoảng, tìm cặp $(x;y)$ thỏa mãn giả thiết để chứng tỏ giá trị đó thật sự đạt được.

**Chú ý:** Chỉ có khoảng chặn thì chưa kết luận được GTLN, GTNN; phải chỉ ra cặp $(x;y)$ thỏa mãn giả thiết cho từng giá trị.

**Phần 2. Trình bày**

Đặt $t=x+y$. Giả thiết trở thành $t^2+7t+y^2+10=0$, tức $t^2+7t+10=-y^2\le0$.

$t^2+7t+10\le0\Leftrightarrow\left(t+\dfrac{7}{2}\right)^2-\dfrac{9}{4}\le0\Leftrightarrow\left(t+\dfrac{7}{2}\right)^2\le\dfrac{9}{4}\Leftrightarrow\left\lvert t+\dfrac{7}{2}\right\rvert\le\dfrac{3}{2}$

$\Leftrightarrow-\dfrac{3}{2}\le t+\dfrac{7}{2}\le\dfrac{3}{2}\Leftrightarrow-5\le t\le-2\Leftrightarrow-4\le t+1\le-1$.

Do đó $-4\le P\le-1$ với mọi $x$, $y$ thỏa mãn giả thiết. (1)

Dấu bằng: $P=-4$ khi $t=-5$ và $y=0$, tức $x=-5$, $y=0$; thử vào giả thiết: $(-5)^2+7\cdot(-5)+0+10=25-35+10=0$ (đúng).

$P=-1$ khi $t=-2$ và $y=0$, tức $x=-2$, $y=0$; thử vào giả thiết: $(-2)^2+7\cdot(-2)+0+10=4-14+10=0$ (đúng). (2)

Từ (1) và (2): GTNN của $P$ bằng $-4$ khi $x=-5$, $y=0$; GTLN của $P$ bằng $-1$ khi $x=-2$, $y=0$.

=== T8D2C1.6@p194
- bai: 6 · y: - · trang: 194 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1 (ví dụ có điều kiện) · đổi biến a = 1 + x · khai triển lập phương · so sánh lập phương
- kiem: khong
- ket_qua_sach: 2
- dap_an: GTLN $=2$, đạt khi $a=b=1$
- ghi_chu_nghi: đề không nói $a$, $b$ là số thực (hiểu ngầm là số thực). Sách viết "$b^3\le(1-x)^3\Leftrightarrow b\le1-x$" không giải thích vì sao; lời giải kho bổ sung lí do (hiệu hai lập phương).
## DE
Cho $a^3+b^3=2$. Tìm giá trị lớn nhất của biểu thức $A=a+b$.
## SACH
Đặt $a=1+x$ (1)
Ta có: $b^3=2-(1+x)^3=1-3x-3x^2-x^3\le1-3x+3x^2-x^3=(1-x)^3$
Vậy: $b^3\le(1-x)^3\Leftrightarrow b\le1-x$ (2). Từ (1) và (2) suy ra: $a+b\le2$
Dấu "=" xảy ra khi $x=0$ hay $a=b=1$
Vậy: $A$ đạt giá trị lớn nhất bằng $2$ khi $a=b=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $a=1+x$ để thấy $a+b$ lệch khỏi $2$ bao nhiêu đo bằng $x$; khi đó $b^3=2-(1+x)^3$ có thể so sánh với $(1-x)^3$ nhờ $-3x^2\le3x^2$.

**Bước 1.** Đặt $a=1+x$ rồi khai triển $b^3=2-(1+x)^3$ để biểu diễn $b^3$ theo $x$.

**Bước 2.** Thay hạng tử $-3x^2$ bằng $3x^2$ (lớn hơn vì $6x^2\ge0$) để $b^3$ bị chặn trên bởi lập phương của $1-x$.

**Bước 3.** Từ $b^3\le(1-x)^3$ suy ra $b\le1-x$ bằng cách xét hiệu hai lập phương và chứng tỏ thừa số thứ hai không âm.

**Bước 4.** Cộng $a=1+x$ với $b\le1-x$ để có cận trên của $A$, rồi tìm giá trị $a$, $b$ làm dấu bằng xảy ra.

**Chú ý:** Ở bước đổi chiều từ lập phương sang bậc nhất nhớ rằng hàm $u\mapsto u^3$ đồng biến trên mọi số thực, không cần điều kiện dương.

**Phần 2. Trình bày**

Đặt $a=1+x$. Khi đó

$b^3=2-(1+x)^3=1-3x-3x^2-x^3$.

Vì $-3x^2\le3x^2$ (do $6x^2\ge0$) nên $b^3\le1-3x+3x^2-x^3=(1-x)^3$.

Ta chứng minh $b\le1-x$. Giả sử $b>1-x$; đặt $u=b$, $v=1-x$ thì $u>v$ và $u^3-v^3=(u-v)\left(u^2+uv+v^2\right)=(u-v)\left[\left(u+\dfrac{v}{2}\right)^2+\dfrac{3v^2}{4}\right]$. Vì $u\ne v$ nên không thể cùng $u=v=0$, do đó thừa số trong ngoặc vuông dương, suy ra $u^3>v^3$, trái với $b^3\le(1-x)^3$. Vậy $b\le1-x$.

Cộng với $a=1+x$ được $A=a+b\le(1+x)+(1-x)=2$ với mọi $a$, $b$ thỏa $a^3+b^3=2$. (1)

Dấu bằng xảy ra khi $x=0$, tức $a=1$; khi đó $b^3=2-1=1$ nên $b=1$. Cặp $a=b=1$ thỏa $a^3+b^3=2$ và $A=2$. (2)

Từ (1) và (2): GTLN của $A$ bằng $2$, đạt khi $a=b=1$.

=== T8D2C1.7@p194
- bai: 7 · y: - · trang: 194 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 1: biến đổi f=g²+C · tam thức hai biến, hoàn thành bình phương hai lần
- kiem: khong
- ket_qua_sach: 2007
- dap_an: GTNN $=2007$, đạt khi $x=2$, $y=1$
- ghi_chu_nghi:
## DE
Cho biểu thức $M=x^2-5x+y^2+xy-4y+2014$. Với giá trị nào của $x$, $y$ thì $M$ đạt giá trị nhỏ nhất? Tìm giá trị nhỏ nhất đó.
## SACH
Ta có $M=(x^2-4x+4)+(y^2-2y+1)+(xy-x-2y+2)+2007$
$M=(x-2)^2+(x-2)(y-1)+(y-1)^2+2007$
$\Rightarrow M=\left[(x-2)+\dfrac{1}{2}(y-1)\right]^2+\dfrac{3}{4}(y-1)^2+2007$
Do $(y-1)^2\ge0$ và $\left[(x-2)+\dfrac{1}{2}(y-1)\right]^2\ge0$, $\forall x,y$
$\Rightarrow M\ge2007\Rightarrow M_{\min}=2007\Leftrightarrow x=2$; $y=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có hạng tử chéo $xy$ nên đặt $u=x-2$, $v=y-1$ để đưa về dạng $u^2+uv+v^2$, rồi viết thành tổng hai bình phương nhờ hoàn thành bình phương theo $u$.

**Bước 1.** Gom các hạng tử để biểu thức thành $(x-2)^2+(x-2)(y-1)+(y-1)^2$ cộng một hằng số.

**Bước 2.** Viết $(x-2)^2+(x-2)(y-1)$ thành bình phương của $(x-2)+\dfrac{1}{2}(y-1)$ trừ đi $\dfrac{1}{4}(y-1)^2$.

**Bước 3.** Gộp $(y-1)^2$ với $-\dfrac{1}{4}(y-1)^2$ để được tổng của hai số không âm cộng hằng số.

**Bước 4.** Cho cả hai số không âm bằng $0$ để tìm cặp $(x;y)$ làm dấu bằng xảy ra.

**Chú ý:** Khi tách hằng số $2014$ phải kiểm tra lại khai triển: ba nhóm đầu cộng lại cho đúng hằng số $4+1+2=7$, do đó phần còn lại là $2007$.

**Phần 2. Trình bày**

$M=(x^2-4x+4)+(y^2-2y+1)+(xy-x-2y+2)+2007$

$=(x-2)^2+(x-2)(y-1)+(y-1)^2+2007$

$=\left[(x-2)+\dfrac{1}{2}(y-1)\right]^2+\dfrac{3}{4}(y-1)^2+2007$.

Vì $\left[(x-2)+\dfrac{1}{2}(y-1)\right]^2\ge0$ và $(y-1)^2\ge0$ với mọi $x$, $y$ nên $M\ge2007$. (1)

Dấu bằng xảy ra khi $y-1=0$ và $x-2+\dfrac{1}{2}(y-1)=0$, tức $y=1$ và $x=2$; khi đó $M=4-10+1+2-4+2014=2007$. (2)

Từ (1) và (2): GTNN của $M$ bằng $2007$, đạt khi $x=2$ và $y=1$.

=== T8D2C2.1@p194
- bai: 1 · y: - · trang: 194 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: đổi biến · dùng điều kiện x + y = 1 rút gọn biểu thức · đưa về tam thức bậc hai
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: GTNN $=\dfrac{1}{2}$, đạt khi $x=y=\dfrac{1}{2}$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của $A=x^3+y^3+xy$ biết rằng $x+y=1$.
## SACH
Sử dụng điều kiện đã cho để rút gọn biểu thức $A$:
$A=(x+y)(x^2-xy+y^2)+xy=x^2-xy+y^2+xy=x^2+y^2$.
Đến đây có nhiều cách giải:
Cách 1. Biểu thị $y$ theo $x$ rồi đưa về tam thức bậc hai đối với $x$: Thay $y=1-x$ vào biểu thức $A$:
$A=x^2+(1-x)^2=2(x^2-x)+1=2\left(x-\dfrac{1}{2}\right)^2+\dfrac{1}{2}\ge\dfrac{1}{2}$.
$\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\dfrac{1}{2}$, $y=\dfrac{1}{2}$.
Cách 2: Sử dụng điều kiện đã cho làm xuất hiện một biểu thức mới có chứa $A$
Ta có: $x+y=1\Rightarrow x^2+2xy+y^2=1$ (1).
Mặt khác $(x-y)^2\ge0\Rightarrow x^2-2xy+y^2\ge0$ (2).
Cộng (1) với (2): $2(x^2+y^2)\ge1\Rightarrow x^2+y^2\ge\dfrac{1}{2}$.
Vậy $\min A=\dfrac{1}{2}$ khi và chỉ khi $x=y=\dfrac{1}{2}$.
Cách 3. Sử dụng điều kiện đã cho để đưa vào một biến mới:
Đặt $x=\dfrac{1}{2}+a$ thì $y=\dfrac{1}{2}-a$. Biểu thị $x^2+y^2$ theo $a$, ta được:
$x^2+y^2=\left(\dfrac{1}{2}+a\right)^2+\left(\dfrac{1}{2}-a\right)^2=\dfrac{1}{2}+2a^2\ge\dfrac{1}{2}$.
Vậy $\min A=\dfrac{1}{2}\Leftrightarrow a=0\Leftrightarrow x=y=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có điều kiện $x+y=1$ nên đừng khai triển ngay $x^3+y^3$ mà dùng hằng đẳng thức tổng hai lập phương để triệt tiêu $xy$, đưa biểu thức về $x^2+y^2$.

**Bước 1.** Viết $x^3+y^3=(x+y)(x^2-xy+y^2)$ và thay $x+y=1$ để rút gọn $A$.

**Bước 2.** Dùng điều kiện $x+y=1$ để biểu thị $y$ theo $x$, đưa $A$ về tam thức bậc hai một biến.

**Bước 3.** Hoàn thành bình phương cho tam thức đó để chặn dưới $A$ với mọi $x$.

**Bước 4.** Tìm $x$ làm bình phương bằng $0$ rồi kiểm tra cặp $(x;y)$ thỏa $x+y=1$ để chứng tỏ dấu bằng đạt được.

**Chú ý:** Có thể làm không cần thế $y$: từ $(x+y)^2=1$ và $(x-y)^2\ge0$ suy ra $2(x^2+y^2)\ge1$; hoặc đặt $x=\dfrac{1}{2}+a$, $y=\dfrac{1}{2}-a$.

**Phần 2. Trình bày**

Vì $x+y=1$ nên

$A=(x+y)(x^2-xy+y^2)+xy=x^2-xy+y^2+xy=x^2+y^2$.

Thay $y=1-x$: $A=x^2+(1-x)^2=2x^2-2x+1=2\left(x-\dfrac{1}{2}\right)^2+\dfrac{1}{2}$.

Vì $\left(x-\dfrac{1}{2}\right)^2\ge0$ nên $A\ge\dfrac{1}{2}$ với mọi $x$ (và $y=1-x$). (1)

Dấu bằng xảy ra khi $x=\dfrac{1}{2}$, khi đó $y=\dfrac{1}{2}$ thỏa $x+y=1$ và $A=\dfrac{1}{8}+\dfrac{1}{8}+\dfrac{1}{4}=\dfrac{1}{2}$. (2)

Từ (1) và (2): GTNN của $A$ bằng $\dfrac{1}{2}$, đạt khi $x=y=\dfrac{1}{2}$.

=== T8D2C2.2@p195
- bai: 2 · y: - · trang: 195 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: đổi biến · đặt y = x − 2 để triệt tiêu hạng tử bậc nhất
- kiem: khong
- ket_qua_sach: 2
- dap_an: GTNN $=2$, đạt khi $x=2$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của biểu thức: $A=(x-1)^2+(x-3)^2$.
## SACH
Ta có: $A=x^2-2x+1+x^2-6x+9=2(x^2-4x+5)$
$=2(x-2)^2+2\ge2$; $A=2\Leftrightarrow x-2=0\Leftrightarrow x=2$.
Vậy $\min A=2$ khi và chỉ khi $x=2$.
Chẳng hạn, ở ví dụ trên ta có thể đặt $x-2=y$, khi đó
$A=(y+1)^2+(y-1)^2=y^2+2y+1+y^2-2y+1=2y^2+2\ge2$.
$\min A=2\Leftrightarrow y=0\Leftrightarrow x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng hai bình phương của hai nhị thức có cùng hệ số $x$ nên đặt $y$ là trung điểm của hai số $1$ và $3$ để hai hạng tử bậc nhất triệt tiêu nhau.

**Bước 1.** Nhận ra hai nhị thức $x-1$ và $x-3$ đối xứng quanh $x-2$, nên đổi biến $y=x-2$.

**Bước 2.** Viết $A$ theo $y$ và khai triển để các hạng tử bậc nhất triệt tiêu nhau.

**Bước 3.** Dùng $y^2\ge0$ để chặn dưới $A$ rồi tìm giá trị của $y$, từ đó suy ra $x$, làm dấu bằng xảy ra.

**Chú ý:** Cũng có thể khai triển trực tiếp thành $2x^2-8x+10$ rồi hoàn thành bình phương; hai cách cho cùng kết quả.

**Phần 2. Trình bày**

Đặt $y=x-2$, khi đó $x-1=y+1$ và $x-3=y-1$ nên

$A=(y+1)^2+(y-1)^2=y^2+2y+1+y^2-2y+1=2y^2+2$.

Vì $y^2\ge0$ nên $A\ge2$ với mọi $x$. (1)

Dấu bằng xảy ra khi $y=0$, tức $x=2$; khi đó $A=1^2+(-1)^2=2$. (2)

Từ (1) và (2): GTNN của $A$ bằng $2$, đạt khi $x=2$.

=== T8D2C2.3@p195
- bai: 3 · y: - · trang: 195 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: đổi biến · ghép cặp nhân tử, đặt ẩn phụ t = x² − 7x + 6
- kiem: khong
- ket_qua_sach: -36
- dap_an: GTNN $=-36$, đạt khi $x=1$ hoặc $x=6$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của $A=x(x-3)(x-4)(x-7)$.
## SACH
$A=(x^2-7x)(x^2-7x+12)$.
Đặt $x^2-7x+6=y$ thì $A=(y-6)(y+6)=y^2-36\ge-36$.
$\min A=-36\Leftrightarrow x^2-7x+6=0\Leftrightarrow x_1=1$; $x_2=6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn nhân tử $x$, $x-3$, $x-4$, $x-7$ có $0+7=3+4$, nên ghép $x(x-7)$ và $(x-3)(x-4)$ cho hai tam thức cùng phần $x^2-7x$ chỉ khác hằng số.

**Bước 1.** Ghép các nhân tử thành hai cặp có tổng hai số hạng tự do bằng nhau để cùng chứa $x^2-7x$.

**Bước 2.** Đặt $t=x^2-7x+6$ làm biểu thức nằm giữa hai tam thức, để mỗi tam thức thành $t$ cộng hoặc trừ $6$.

**Bước 3.** Dùng hiệu hai bình phương đưa $A$ về $t^2$ trừ một hằng số rồi chặn dưới bằng $t^2\ge0$.

**Bước 4.** Giải $t=0$ để xem có giá trị $x$ thật sự làm dấu bằng xảy ra không.

**Chú ý:** Phải kiểm tra phương trình $x^2-7x+6=0$ có nghiệm thực, vì nếu vô nghiệm thì $A=-36$ không đạt được.

**Phần 2. Trình bày**

$A=x(x-7)\cdot(x-3)(x-4)=(x^2-7x)(x^2-7x+12)$.

Đặt $t=x^2-7x+6$, khi đó $A=(t-6)(t+6)=t^2-36$.

Vì $t^2\ge0$ nên $A\ge-36$ với mọi $x$. (1)

Dấu bằng xảy ra khi $t=0$, tức $x^2-7x+6=0\Leftrightarrow(x-1)(x-6)=0\Leftrightarrow x=1$ hoặc $x=6$. Thử $x=1$: $A=1\cdot(-2)\cdot(-3)\cdot(-6)=-36$. (2)

Từ (1) và (2): GTNN của $A$ bằng $-36$, đạt khi $x=1$ hoặc $x=6$.

=== T8D2C2.4a@p195
- bai: 4 · y: a · trang: 195 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: đổi biến / dùng điều kiện x + y + z = 3 · bình phương một tổng · A ≥ B
- kiem: khong
- ket_qua_sach: 3
- dap_an: GTNN $=3$, đạt khi $x=y=z=1$
- ghi_chu_nghi: Ví dụ 4 có ba ý a, b, c dùng chung hai hệ thức $A+2B=9$ và $A\ge B$ (sách bỏ chứng minh, ghi "Dễ dàng chứng minh được"). Mỗi ý có thể làm độc lập nên tách thành ba câu; mỗi câu tự chứng minh lại hai hệ thức đó. Đề các ý b, c trong sách dùng $A$, $B$ đã nêu ở ý a; đề kho định nghĩa lại $A$, $B$ cho tự đủ nghĩa.
## DE
Cho $x+y+z=3$. Tìm giá trị nhỏ nhất của $A=x^2+y^2+z^2$.
## SACH
Bình phương hai vế của đẳng thức $x+y+z=3$, ta được:
$x^2+y^2+z^2+2(xy+yz+zx)=9$ (1). Tức là $A+2B=9$.
Dễ dàng chứng minh được: $A\ge B$ (2)
Xảy ra đẳng thức khi và chỉ khi $x=y=z$.
a. Từ (1) và (2) suy ra $3A\ge A+2B=9$, nên $A\ge3$.
Do đó $\min A=3$ khi và chỉ khi $x=y=z=1$.
Chú ý: có thể giải câu a bằng cách đổi biến: đặt $x=1+a$, $y=1+b$, $z=1+c$ rồi xét $x^2+y^2+z^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y+z=3$ cho tổng, còn $A$ là tổng bình phương; bình phương điều kiện sẽ liên hệ $A$ với $B=xy+yz+zx$, và $A\ge B$ nối hai đại lượng để chặn $A$.

**Bước 1.** Bình phương hai vế của $x+y+z=3$ để có hệ thức giữa $A$ và $B=xy+yz+zx$.

**Bước 2.** Chứng minh $A\ge B$ bằng cách viết $A-B$ thành nửa tổng ba bình phương.

**Bước 3.** Kết hợp hai điều trên để chặn dưới $A$, ví dụ viết $3A=A+2A$ rồi thay $2A\ge2B$.

**Bước 4.** Xét khi nào dấu bằng của $A\ge B$ xảy ra, kết hợp với điều kiện $x+y+z=3$ để tìm $x$, $y$, $z$.

**Chú ý:** Có thể đặt $x=1+a$, $y=1+b$, $z=1+c$ với $a+b+c=0$ rồi khai triển; cách làm trên ngắn hơn nhờ không cần chọn biến mới.

**Phần 2. Trình bày**

Đặt $B=xy+yz+zx$. Bình phương hai vế của $x+y+z=3$:

$x^2+y^2+z^2+2(xy+yz+zx)=9$, tức $A+2B=9$. (1)

Mặt khác $A-B=\dfrac{1}{2}\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$ nên $A\ge B$. (2)

Từ (1) và (2): $3A=A+2A\ge A+2B=9$, suy ra $A\ge3$ với mọi $x$, $y$, $z$ thỏa $x+y+z=3$. (3)

Dấu bằng ở (2) xảy ra khi $x=y=z$; kết hợp $x+y+z=3$ được $x=y=z=1$, khi đó $A=1+1+1=3$. (4)

Từ (3) và (4): GTNN của $A$ bằng $3$, đạt khi $x=y=z=1$.

=== T8D2C2.4b@p195
- bai: 4 · y: b · trang: 195 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: dùng điều kiện x + y + z = 3 · bình phương một tổng · A ≥ B
- kiem: khong
- ket_qua_sach: 3
- dap_an: GTLN $=3$, đạt khi $x=y=z=1$
- ghi_chu_nghi: xem ý a cùng ví dụ: tách ba câu, định nghĩa lại $A$, $B$ trong đề, tự chứng minh $A+2B=9$ và $A\ge B$.
## DE
Cho $x+y+z=3$. Tìm giá trị lớn nhất của $B=xy+yz+zx$.
## SACH
Bình phương hai vế của đẳng thức $x+y+z=3$, ta được:
$x^2+y^2+z^2+2(xy+yz+zx)=9$ (1). Tức là $A+2B=9$.
Dễ dàng chứng minh được: $A\ge B$ (2)
Xảy ra đẳng thức khi và chỉ khi $x=y=z$.
b. Từ (1) và (2) suy ra $3B\le A+2B=9$, nên $B\le3$. Do đó $\max B=3$ khi và chỉ khi $x=y=z=1$.
Chú ý: Có thể giải câu b dựa vào câu a: vì $A+2B=9$ nên $B$ lớn nhất $\Leftrightarrow A$ nhỏ nhất.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bình phương điều kiện $x+y+z=3$ cho hệ thức $A+2B=9$ với $A=x^2+y^2+z^2$; vì $A\ge B$ nên $9=A+2B\ge3B$, chặn trên được $B$.

**Bước 1.** Bình phương hai vế của $x+y+z=3$ để liên hệ $B$ với tổng bình phương $A$.

**Bước 2.** Chứng minh $A\ge B$ bằng cách viết $A-B$ thành nửa tổng ba bình phương.

**Bước 3.** Thay $A\ge B$ vào hệ thức $A+2B=9$ để suy ra cận trên của $B$.

**Bước 4.** Tìm giá trị của $x$, $y$, $z$ làm dấu bằng xảy ra rồi thử lại điều kiện $x+y+z=3$.

**Chú ý:** Cũng có thể dựa vào ý tìm GTNN của $A$: vì $A+2B=9$ nên $B$ lớn nhất khi $A$ nhỏ nhất.

**Phần 2. Trình bày**

Đặt $A=x^2+y^2+z^2$. Bình phương hai vế của $x+y+z=3$:

$A+2B=9$. (1)

Mặt khác $A-B=\dfrac{1}{2}\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$ nên $A\ge B$. (2)

Từ (1) và (2): $9=A+2B\ge B+2B=3B$, suy ra $B\le3$ với mọi $x$, $y$, $z$ thỏa $x+y+z=3$. (3)

Dấu bằng ở (2) xảy ra khi $x=y=z$; kết hợp $x+y+z=3$ được $x=y=z=1$, khi đó $B=1+1+1=3$. (4)

Từ (3) và (4): GTLN của $B$ bằng $3$, đạt khi $x=y=z=1$.

=== T8D2C2.4c@p195
- bai: 4 · y: c · trang: 195 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030203
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 2: dùng điều kiện x + y + z = 3 · bình phương một tổng · A ≥ B
- kiem: khong
- ket_qua_sach: 6
- dap_an: GTNN $=6$, đạt khi $x=y=z=1$
- ghi_chu_nghi: sách giải ý c bằng kết quả ý b ($B\le3$, "câu b"); lời giải kho tự chứng minh $B\le3$ nên vẫn tách thành câu riêng. Đề các ý trong sách dùng $A$, $B$ đã nêu ở ý a; đề kho định nghĩa lại $A$, $B$ cho tự đủ nghĩa.
## DE
Cho $x+y+z=3$. Tìm giá trị nhỏ nhất của $A+B$, trong đó $A=x^2+y^2+z^2$ và $B=xy+yz+zx$.
## SACH
Bình phương hai vế của đẳng thức $x+y+z=3$, ta được:
$x^2+y^2+z^2+2(xy+yz+zx)=9$ (1). Tức là $A+2B=9$.
Dễ dàng chứng minh được: $A\ge B$ (2)
Xảy ra đẳng thức khi và chỉ khi $x=y=z$.
c. Ta có $A+2B=9$ mà $B\le3$ (câu b) nên $A+B\ge6$.
Do đó $\min(A+B)=6$ khi và chỉ khi $x=y=z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $A+2B=9$ suy ra $A+B=9-B$; chỉ cần chặn trên $B$ là chặn được dưới $A+B$.

**Bước 1.** Bình phương hai vế của $x+y+z=3$ để có hệ thức $A+2B=9$ giữa hai biểu thức $A$ và $B$.

**Bước 2.** Viết $A+B$ thành $9$ trừ $B$ nhờ hệ thức vừa có, để bài toán chỉ còn phụ thuộc vào $B$.

**Bước 3.** Chứng minh $B\le3$ bằng cách dùng $A\ge B$ (viết $A-B$ thành nửa tổng ba bình phương).

**Bước 4.** Suy ra cận dưới của $A+B$ và tìm $x$, $y$, $z$ làm dấu bằng xảy ra.

**Chú ý:** $A+B$ nhỏ nhất ứng với $B$ lớn nhất, nên dấu bằng ở đây trùng với dấu bằng khi tìm GTLN của $B$.

**Phần 2. Trình bày**

Bình phương hai vế của $x+y+z=3$: $A+2B=9$, suy ra $A+B=9-B$. (1)

Mặt khác $A-B=\dfrac{1}{2}\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$ nên $A\ge B$. Từ $9=A+2B\ge3B$ suy ra $B\le3$. (2)

Từ (1) và (2): $A+B=9-B\ge9-3=6$ với mọi $x$, $y$, $z$ thỏa $x+y+z=3$. (3)

Dấu bằng xảy ra khi $B=3$, tức $x=y=z$; kết hợp $x+y+z=3$ được $x=y=z=1$, khi đó $A+B=3+3=6$. (4)

Từ (3) và (4): GTNN của $A+B$ bằng $6$, đạt khi $x=y=z=1$.

=== T8D2C3.1@p196
- bai: 1 · y: - · trang: 196 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Dạng 2 Tìm giá trị lớn nhất, giá trị nhỏ nhất – Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương (nghịch đảo hai số cùng dấu) · hoàn thành bình phương ở mẫu
- kiem: khong
- ket_qua_sach: -\dfrac{1}{2}
- dap_an: GTNN $=-\dfrac{1}{2}$, đạt khi $x=\dfrac{1}{3}$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của $A=\dfrac{2}{6x-5-9x^2}$.
## SACH
$A=\dfrac{-2}{9x^2-6x+5}=\dfrac{-2}{(3x-1)^2+4}$.
Ta thấy $(3x-1)^2\ge0$ nên $(3x-1)^2+4\ge4$. Do đó $\dfrac{1}{(3x-1)^2+4}\le\dfrac{1}{4}$ (theo tính chất $a\ge b$ thì $\dfrac{1}{a}\le\dfrac{1}{b}$ với $a$ và $b$ cùng dấu) $\Rightarrow\dfrac{-2}{(3x-1)^2+4}\ge\dfrac{-2}{4}\Rightarrow A\ge-\dfrac{1}{2}$. Vậy $\min A=-\dfrac{1}{2}\Leftrightarrow3x-1=0\Leftrightarrow x=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là hằng số, nên giá trị phân thức phụ thuộc hoàn toàn vào mẫu; mẫu $6x-5-9x^2$ là tam thức bậc hai có hệ số $x^2$ âm, đổi dấu cả phân thức thì mẫu thành bình phương cộng một hằng số dương.

**Bước 1.** Đổi dấu tử và mẫu để mẫu thành $9x^2-6x+5$, rồi hoàn thành bình phương để thấy mẫu luôn dương.

**Bước 2.** Chặn mẫu dưới bằng một hằng số dương nhờ bình phương không âm.

**Bước 3.** Lấy nghịch đảo hai số dương (đổi chiều bất đẳng thức) rồi nhân với số âm $-2$ (đổi chiều lần nữa) để chặn dưới $A$.

**Bước 4.** Tìm giá trị $x$ làm mẫu nhỏ nhất rồi tính lại $A$ để kiểm tra dấu bằng xảy ra.

**Chú ý:** Nhân hoặc lấy nghịch đảo hai vế phải kiểm tra dấu để đổi chiều bất đẳng thức đúng; ở đây mẫu luôn dương nên không có giá trị nào của $x$ bị loại.

**Phần 2. Trình bày**

$6x-5-9x^2=-\left(9x^2-6x+5\right)=-\left[(3x-1)^2+4\right]$.

Vì $(3x-1)^2+4\ge4>0$ nên mẫu khác $0$ với mọi $x$, và

$A=\dfrac{-2}{(3x-1)^2+4}$.

Vì $(3x-1)^2+4\ge4>0$ nên $\dfrac{1}{(3x-1)^2+4}\le\dfrac{1}{4}$ (nghịch đảo của hai số dương đổi chiều bất đẳng thức).

Nhân hai vế với $-2<0$ (đổi chiều): $\dfrac{-2}{(3x-1)^2+4}\ge\dfrac{-2}{4}$, tức $A\ge-\dfrac{1}{2}$ với mọi $x$. (1)

Dấu bằng xảy ra khi $(3x-1)^2=0$, tức $x=\dfrac{1}{3}$; khi đó $A=\dfrac{2}{2-5-1}=\dfrac{2}{-4}=-\dfrac{1}{2}$. (2)

Từ (1) và (2): GTNN của $A$ bằng $-\dfrac{1}{2}$, đạt khi $x=\dfrac{1}{3}$.
