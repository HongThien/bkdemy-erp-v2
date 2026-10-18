=== T8B.20@p207
- bai: 20 · y: - · trang: 207 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: đặt ẩn phụ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $(x-1)(x-3)(x-4)(x-6)+9\ge0$.
## SACH
$(x-1)(x-3)(x-4)(x-6)+9=(x^2-7x+6)(x^2-7x+12)+9=A$.
Đặt $x^2-7x+9=y$ thì $A=(y-3)(y+3)+9=(y^2-9)+9=y^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn nhân tử $x-1$, $x-3$, $x-4$, $x-6$ ghép theo cặp (đầu với cuối, hai giữa với nhau) thì hai tích cùng chứa $x^2-7x$ ⇒ đặt ẩn phụ để đưa về một biểu thức theo một biến.

**Bước 1.** Ghép $x-1$ với $x-6$ và $x-3$ với $x-4$, rồi nhân từng cặp để hai tích cùng có phần $x^2-7x$.

**Bước 2.** Đặt ẩn phụ $y$ nằm chính giữa hai tích sao cho chúng có dạng $y-3$ và $y+3$.

**Bước 3.** Dùng hằng đẳng thức hiệu hai bình phương rồi cộng với $9$ để vế trái gọn thành một bình phương, từ đó kết luận về dấu.

**Bước 4.** Tìm giá trị của $x$ làm bình phương đó bằng $0$ để biết khi nào dấu bằng xảy ra.

**Phần 2. Trình bày**

$(x-1)(x-6)=x^2-7x+6$ và $(x-3)(x-4)=x^2-7x+12$.

Đặt $y=x^2-7x+9$, khi đó $x^2-7x+6=y-3$ và $x^2-7x+12=y+3$.

Vế trái $=(y-3)(y+3)+9=y^2-9+9=y^2$.

Vì $y^2\ge0$ với mọi $x$ nên $(x-1)(x-3)(x-4)(x-6)+9\ge0$ với mọi $x$.

Dấu bằng xảy ra khi $y=0$, tức $x^2-7x+9=0\Leftrightarrow\left(x-\dfrac{7}{2}\right)^2=\dfrac{13}{4}\Leftrightarrow x=\dfrac{7\pm\sqrt{13}}{2}$.

=== T8B.21@p207
- bai: 21 · y: - · trang: 207 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: đặt ẩn phụ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $4a(a+b)(a+1)(a+b+1)+b^2\ge0$.
## SACH
Ta có: $4a(a+b)(a+1)(a+b+1)+b^2=4\left[a(a+b+1)\right]\left[(a+b)(a+1)\right]+b^2=4(a^2+ab+a)(a^2+ab+a+b)+b^2$.
Đặt $a^2+ab+a=m$ rồi biến đổi biểu thức thành bình phương một đa thức.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép $a$ với $a+b+1$ và $a+b$ với $a+1$ thì hai tích đó chỉ hơn kém nhau đúng $b$ ⇒ đặt ẩn phụ cho tích thứ nhất, biểu thức trở thành tam thức bậc hai theo ẩn phụ.

**Bước 1.** Ghép $a$ với $a+b+1$ và $a+b$ với $a+1$ rồi nhân từng cặp để thấy hai tích chỉ khác nhau một hạng tử.

**Bước 2.** Đặt $m$ bằng tích thứ nhất và biểu diễn tích thứ hai theo $m$ và $b$.

**Bước 3.** Thay vào biểu thức, khai triển và nhận ra ba hạng tử tạo thành bình phương của một nhị thức theo $m$ và $b$.

**Bước 4.** Trả lại ẩn $m$ bằng $a,b$ và kết luận về dấu của biểu thức.

**Phần 2. Trình bày**

$4a(a+b)(a+1)(a+b+1)+b^2=4\left[a(a+b+1)\right]\left[(a+b)(a+1)\right]+b^2$

$=4(a^2+ab+a)(a^2+ab+a+b)+b^2$

Đặt $m=a^2+ab+a$, biểu thức trở thành $4m(m+b)+b^2=4m^2+4mb+b^2=(2m+b)^2$

$=(2a^2+2ab+2a+b)^2\ge0$ với mọi $a,b$.

Vậy $4a(a+b)(a+1)(a+b+1)+b^2\ge0$.

Dấu bằng xảy ra khi $2a^2+2ab+2a+b=0$, chẳng hạn khi $a=b=0$.

=== T8B.22@p207
- bai: 22 · y: - · trang: 207 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: hằng đẳng thức hiệu hai bình phương · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $4a^2b^2>(a^2+b^2-c^2)^2$ với $a,b,c$ là ba cạnh của một tam giác.
## SACH
$a,b,c$ là $3$ cạnh một tam giác gợi cho ta các bất đẳng thức $a+b>c$; $c+a>b$; $c+b>a$. Xét hiệu $4a^2b^2-(a^2+b^2-c^2)^2$, phân tích ra thừa số và sử dụng các bất đẳng thức trên, ta có đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu hai vế là hiệu hai bình phương nên phân tích được thành tích; mỗi nhân tử lại là một tổng hoặc hiệu các cạnh mà bất đẳng thức tam giác cho biết dấu.

**Bước 1.** Xét hiệu hai vế, viết nó dưới dạng $(2ab)^2-(a^2+b^2-c^2)^2$ rồi phân tích thành tích hai nhân tử.

**Bước 2.** Gom các hạng tử trong từng nhân tử thành $(a\pm b)^2$ để lại dùng được hiệu hai bình phương, phân tích tiếp đến khi chỉ còn các nhân tử bậc nhất.

**Bước 3.** Dùng bất đẳng thức giữa các cạnh của tam giác để xét dấu từng nhân tử, rồi kết luận về dấu của hiệu.

**Phần 2. Trình bày**

Xét hiệu $H=4a^2b^2-(a^2+b^2-c^2)^2=(2ab)^2-(a^2+b^2-c^2)^2$

$=(2ab-a^2-b^2+c^2)(2ab+a^2+b^2-c^2)$

$=\left[c^2-(a-b)^2\right]\left[(a+b)^2-c^2\right]$

$=(c-a+b)(c+a-b)(a+b-c)(a+b+c)$.

Vì $a,b,c$ là ba cạnh của một tam giác nên $b+c-a>0$, $c+a-b>0$, $a+b-c>0$ và $a+b+c>0$. Tích bốn số dương là số dương nên $H>0$.

Vậy $4a^2b^2>(a^2+b^2-c^2)^2$.

Bất đẳng thức đã cho là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8B.23@p207
- bai: 23 · y: - · trang: 207 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu: phân tích nhân tử · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: đề in $c(a+b)^2$ (không phải $c(a-b)^2$ như hoán vị vòng quanh); đã chép đúng như in và kiểm: với dạng in này hiệu hai vế $=(a+b-c)(b+c-a)(c+a-b)>0$ nên đề đúng (còn với $c(a-b)^2$ thì bất đẳng thức sai khi $a=b=c$). Người soát mở ảnh p-207 xác nhận dấu cộng.
## DE
Chứng minh bất đẳng thức: $a(b-c)^2+b(c-a)^2+c(a+b)^2>a^3+b^3+c^3$ với $a,b,c$ là ba cạnh của một tam giác.
## SACH
Xét hiệu $a(b-c)^2+b(c-a)^2+c(a+b)^2-(a^3+b^3+c^3)=\left[a(b-c)^2-a^3\right]+\left[b(c-a)^2-b^3\right]+\left[c(a+b)^2-c^3\right]$
Rồi phân tích ra thừa số.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi hạng tử ở vế trái trừ đi lập phương tương ứng có dạng (cạnh) nhân (hiệu hai bình phương), phân tích được thành tích; sau khi đặt nhân tử chung, phần còn lại cũng phân tích được và toàn bộ hiệu là tích các biểu thức mà bất đẳng thức tam giác cho dương.

**Bước 1.** Xét hiệu vế trái trừ vế phải rồi ghép từng cặp $a(b-c)^2-a^3$, $b(c-a)^2-b^3$, $c(a+b)^2-c^3$ để mỗi cặp đặt được cạnh làm nhân tử chung.

**Bước 2.** Phân tích mỗi ngoặc vuông bằng hiệu hai bình phương, rồi đặt $p=a+b-c$, $q=b+c-a$, $r=c+a-b$ cho gọn và chú ý cả ba số đều dương.

**Bước 3.** Đặt nhân tử chung $p$ ra ngoài, thu gọn biểu thức trong ngoặc rồi phân tích tiếp bằng hiệu hai bình phương.

**Bước 4.** Kết luận dấu của hiệu từ dấu của ba nhân tử $p,q,r$.

**Phần 2. Trình bày**

Đặt $p=a+b-c$, $q=b+c-a$, $r=c+a-b$. Vì $a,b,c$ là ba cạnh của một tam giác nên $p>0$, $q>0$, $r>0$.

Xét $H=a(b-c)^2+b(c-a)^2+c(a+b)^2-(a^3+b^3+c^3)$

$=a\left[(b-c)^2-a^2\right]+b\left[(c-a)^2-b^2\right]+c\left[(a+b)^2-c^2\right]$

$=a(b-c-a)(b-c+a)+b(c-a-b)(c-a+b)+c(a+b-c)(a+b+c)$

$=-a\cdot r\cdot p-b\cdot p\cdot q+c\cdot p(a+b+c)$

$=p\left[c(a+b+c)-a(c+a-b)-b(b+c-a)\right]$

$=p\left(ac+bc+c^2-ac-a^2+ab-b^2-bc+ab\right)$

$=p\left(c^2-a^2-b^2+2ab\right)=p\left[c^2-(a-b)^2\right]=p(c-a+b)(c+a-b)=pqr$.

Vì $p,q,r>0$ nên $H=pqr>0$.

Vậy $a(b-c)^2+b(c-a)^2+c(a+b)^2>a^3+b^3+c^3$.

Bất đẳng thức đã cho là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8B.24@p207
- bai: 24 · y: - · trang: 207 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: xét dấu của tích
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: gộp hai ý a), b) thành một câu vì lời giải ý b) dùng kết quả ý a); phần đề ý b) in ở đầu trang PDF 208, lời giải ý b) tràn sang đầu trang PDF 214 (chỗ "(trái với giả thiết $abc=1$)" bị logo che 1–2 chữ, dựng lại theo ngữ cảnh).
## DE
Cho ba số dương $a,b,c$ có tích bằng $1$ và $a+b+c>\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$.

a) Chứng minh: $(a-1)(b-1)(c-1)>0$.

b) Chứng minh trong ba số $a,b,c$ có một số lớn hơn $1$, hai số nhỏ hơn $1$.
## SACH
a) Từ $a+b+c>\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$ với $a,b,c>0$, ta có $abc(a+b+c)>bc+ac+ab$.
Do $abc=1$ nên $a+b+c>bc+ac+ab$ (1)
Xét $(a-1)(b-1)(c-1)=abc-ab-bc-ac+a+b+c-1=(a+b+c)-(ab+bc+ac)>0$ do (1)
b) Tích $(a-1)(b-1)(c-1)$ dương nên số thừa số âm chẵn, tức là trong các số $(a-1)$; $(b-1)$; $(c-1)$ có một số dương hoặc ba số dương.
Trường hợp $(a-1)$; $(b-1)$; $(c-1)$ đều dương thì $a>1$; $b>1$; $c>1$ nên $abc>1$ (trái với giả thiết $abc=1$).
Vậy trong các số $(a-1)$; $(b-1)$; $(c-1)$ chỉ có một số dương, còn hai số âm, tức là trong ba số $a,b,c$ có một số lớn hơn $1$, hai số nhỏ hơn $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $abc=1$ biến các nghịch đảo thành tích hai biến ($\dfrac{1}{a}=bc$, …), nên giả thiết thành $a+b+c>ab+bc+ca$ — đúng là hiệu xuất hiện khi khai triển $(a-1)(b-1)(c-1)$.

**Bước 1.** Dùng $abc=1$ để thay mỗi phân số ở vế phải của giả thiết bằng tích của hai biến còn lại.

**Bước 2.** Khai triển $(a-1)(b-1)(c-1)$, thay $abc=1$ rồi so sánh với bất đẳng thức vừa nhận được ở giả thiết để xét dấu.

**Bước 3.** Ở ý b), xét dấu của tích ba thừa số dương để suy ra số thừa số âm phải là số chẵn.

**Bước 4.** Loại trường hợp không có thừa số âm bằng điều kiện $abc=1$, rồi dịch kết quả trở lại thành so sánh $a,b,c$ với $1$.

**Chú ý:** Tích ba thừa số dương chỉ có hai khả năng là không có thừa số âm hoặc có hai thừa số âm; trường hợp thứ nhất phải được loại bằng giả thiết, không được bỏ sót.

**Phần 2. Trình bày**

a) Vì $abc=1$ nên $\dfrac{1}{a}=bc$, $\dfrac{1}{b}=ca$, $\dfrac{1}{c}=ab$. Giả thiết trở thành $a+b+c>ab+bc+ca$ (1).

Khai triển $(a-1)(b-1)(c-1)=abc-(ab+bc+ca)+(a+b+c)-1$

$=(a+b+c)-(ab+bc+ca)$ (vì $abc=1$).

Theo (1), $(a+b+c)-(ab+bc+ca)>0$. Vậy $(a-1)(b-1)(c-1)>0$.

b) Theo ý a), tích $(a-1)(b-1)(c-1)>0$ nên cả ba thừa số đều khác $0$ và số thừa số âm là số chẵn, tức là có $0$ hoặc $2$ thừa số âm.

Nếu không có thừa số âm thì $a>1$, $b>1$, $c>1$, suy ra $abc>1$, trái với giả thiết $abc=1$. Trường hợp này loại.

Vậy có đúng hai thừa số âm và một thừa số dương, tức là một trong ba số $a,b,c$ lớn hơn $1$, hai số còn lại nhỏ hơn $1$.

Các bất đẳng thức trong bài đều chặt nên không xảy ra dấu bằng.

=== T8B.25@p208
- bai: 25 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu:
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $\dfrac{a}{b}+\dfrac{b}{a}\ge2$ với $ab>0$.
## SACH
Xét hiệu $\left(\dfrac{a}{b}+\dfrac{b}{a}\right)-2=\dfrac{a^2+b^2-2ab}{ab}=\dfrac{(a-b)^2}{ab}\ge0$ vì $ab>0$.
Dấu "=" xảy ra khi và chỉ khi $a=b$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Quy đồng hiệu "vế trái trừ $2$" thì tử số là hằng đẳng thức bình phương của một hiệu còn mẫu số là $ab>0$, nên dấu của hiệu hiện ra ngay.

**Bước 1.** Chuyển $2$ sang vế trái và quy đồng để chỉ còn một phân thức với mẫu $ab$.

**Bước 2.** Nhận ra tử số là khai triển của bình phương một hiệu và viết nó gọn lại.

**Bước 3.** Dùng điều kiện $ab>0$ để xét dấu phân thức, rồi chỉ ra khi nào dấu bằng xảy ra.

**Chú ý:** Điều kiện $ab>0$ (hai số cùng dấu) là bắt buộc; nếu $a,b$ trái dấu thì tổng $\dfrac{a}{b}+\dfrac{b}{a}$ nhỏ hơn hoặc bằng $-2$.

**Phần 2. Trình bày**

Vì $ab>0$ nên $a,b$ đều khác $0$ và cùng dấu.

$\dfrac{a}{b}+\dfrac{b}{a}\ge2$

$\Leftrightarrow\dfrac{a^2+b^2}{ab}\ge2$

$\Leftrightarrow a^2+b^2\ge2ab$ (nhân hai vế với $ab>0$)

$\Leftrightarrow(a-b)^2\ge0$.

Bất đẳng thức cuối đúng nên bất đẳng thức đã cho đúng.

Dấu bằng xảy ra khi $a=b$.

=== T8B.26@p208
- bai: 26 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: bất đẳng thức Cô-si
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: dòng khai triển của sách in "$3-\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\dots$", dấu trừ sau số $3$ là in sai (khai triển cho $3+$ tổng ba cặp); lời giải kho soạn theo dấu cộng. Lời giải sách còn viện dẫn "theo bài trên" (bất đẳng thức bài 25).
## DE
Chứng minh bất đẳng thức: $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$ với $a,b,c>0$.
## SACH
Xét $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=1+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{a}+1+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{c}{b}+1$
$=3-\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$
Theo bài trên, do $a,b,c>0$ nên $\dfrac{a}{b}+\dfrac{b}{a}\ge2$; $\dfrac{a}{c}+\dfrac{c}{a}\ge2$; $\dfrac{b}{c}+\dfrac{c}{b}\ge2$.
Do đó $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$. Dấu "=" xảy ra khi và chỉ khi đồng thời có $a=b$; $b=c$; $c=a$ hay $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân hai ngoặc ra thì được $3$ cộng ba cặp nghịch đảo dạng $\dfrac{x}{y}+\dfrac{y}{x}$ với $x,y>0$, mà mỗi cặp như vậy luôn không nhỏ hơn $2$.

**Bước 1.** Nhân từng hạng tử của tổng thứ nhất với từng hạng tử của tổng thứ hai rồi gom các số $1$ lại với nhau.

**Bước 2.** Nhóm các phân số còn lại thành ba cặp, mỗi cặp gồm hai phân số nghịch đảo của nhau.

**Bước 3.** Chứng minh bất đẳng thức $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ cho hai số dương rồi áp dụng cho cả ba cặp.

**Bước 4.** Cộng kết quả lại để đánh giá vế trái và tìm điều kiện làm cả ba cặp cùng đạt dấu bằng.

**Phần 2. Trình bày**

Với $x,y>0$: $\dfrac{x}{y}+\dfrac{y}{x}\ge2\Leftrightarrow x^2+y^2\ge2xy$ (nhân hai vế với $xy>0$) $\Leftrightarrow(x-y)^2\ge0$, đúng; dấu bằng xảy ra khi $x=y$. (1)

Khai triển: $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$.

Vì $a,b,c>0$, áp dụng (1) cho các cặp $(a,b)$, $(a,c)$, $(b,c)$ thì mỗi ngoặc đều $\ge2$.

Suy ra $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge3+2+2+2=9$.

Dấu bằng xảy ra khi cả ba ngoặc cùng bằng $2$, tức $a=b$, $a=c$, $b=c$, hay $a=b=c$.

=== T8B.27@p208
- bai: 27 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu:
- kiem: khong
- ket_qua_sach: 0
- dap_an: GTNN = $0$, đạt khi $x=1$ và $y=-2$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của: $x^2-2x+y^2+4y+5$.
## SACH
$x^2-2x+y^2+4y+5=(x-1)^2+(y+2)^2\ge0$
Dấu "=" xảy ra khi và chỉ khi $\begin{cases}x-1=0\\y+2=0\end{cases}\Leftrightarrow\begin{cases}x=1\\y=-2\end{cases}$
Giá trị nhỏ nhất của biểu thức bằng $0$ khi và chỉ khi $\begin{cases}x=1\\y=-2\end{cases}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức là tam thức bậc hai theo từng biến riêng rẽ, nên nhóm theo từng biến và hoàn thành bình phương để đưa về tổng hai bình phương cộng một hằng số.

**Bước 1.** Tách hằng số $5$ thành tổng hai số để nhóm được $x^2-2x$ và $y^2+4y$ thành bình phương đầy đủ.

**Bước 2.** Viết mỗi nhóm thành bình phương của một nhị thức và đọc ra dạng của cả biểu thức.

**Bước 3.** Dùng tính chất bình phương không âm để chặn dưới biểu thức với mọi $x,y$.

**Bước 4.** Tìm giá trị của $x,y$ làm cả hai bình phương cùng bằng $0$ để chắc chắn cận dưới đó đạt được.

**Chú ý:** Tìm giá trị nhỏ nhất phải chứng minh đủ hai điều: biểu thức luôn không nhỏ hơn cận đó, và có giá trị của biến để biểu thức bằng đúng cận đó.

**Phần 2. Trình bày**

Đặt $A=x^2-2x+y^2+4y+5$.

$A=(x^2-2x+1)+(y^2+4y+4)$

$=(x-1)^2+(y+2)^2$.

(1) Với mọi $x,y$ ta có $(x-1)^2\ge0$ và $(y+2)^2\ge0$ nên $A\ge0$.

(2) Với $x=1$, $y=-2$ thì $A=0+0=0$, nên dấu bằng đạt được.

Vậy GTNN của $A$ bằng $0$, đạt khi $x=1$ và $y=-2$.

=== T8B.28@p208
- bai: 28 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030101
- cong_cu:
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh bất đẳng thức: $\dfrac{x-y}{x+y}<\dfrac{x^2-y^2}{x^2+y^2}$ với $x>y>0$.
## SACH
Nhân hai vế của $\dfrac{x-y}{x+y}$ với $x+y\ne0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải có $x^2-y^2=(x-y)(x+y)$ nên hai vế cùng chứa nhân tử $x-y>0$; chia hai vế cho nó rồi khử mẫu thì chỉ còn so sánh hai biểu thức đơn giản.

**Bước 1.** Phân tích $x^2-y^2$ ở vế phải thành tích để thấy nhân tử chung $x-y$ của cả hai vế.

**Bước 2.** Chia hai vế cho $x-y>0$ để bớt nhân tử, giữ nguyên chiều bất đẳng thức.

**Bước 3.** Nhân hai vế với tích các mẫu dương để khử mẫu, đưa về so sánh $x^2+y^2$ với một bình phương.

**Bước 4.** Khai triển bình phương, rút gọn rồi dùng điều kiện $x,y>0$ để kết luận.

**Phần 2. Trình bày**

Vì $x>y>0$ nên $x-y>0$, $x+y>0$, $x^2+y^2>0$.

$\dfrac{x-y}{x+y}<\dfrac{x^2-y^2}{x^2+y^2}$

$\Leftrightarrow\dfrac{x-y}{x+y}<\dfrac{(x-y)(x+y)}{x^2+y^2}$

$\Leftrightarrow\dfrac{1}{x+y}<\dfrac{x+y}{x^2+y^2}$ (chia hai vế cho $x-y>0$)

$\Leftrightarrow x^2+y^2<(x+y)^2$ (nhân hai vế với $(x+y)(x^2+y^2)>0$)

$\Leftrightarrow x^2+y^2<x^2+2xy+y^2\Leftrightarrow0<2xy$.

Bất đẳng thức cuối đúng vì $x,y>0$ nên bất đẳng thức đã cho đúng.

Bất đẳng thức đã cho là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8B.29@p208
- bai: 29 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách phân số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách có 2 cách; lời giải kho trình bày cách 1 (làm trội bằng $\dfrac{1}{k(k-1)}$), tự chứng minh phép rút gọn thay vì viện dẫn "bài trên".
## DE
Chứng minh bất đẳng thức: $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{n^2}<1$ với mọi số tự nhiên $n\ge2$.
## SACH
Cách 1: Đặt $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{n^2}=A$.
Để chứng minh $A<1$, ta sẽ xét một biểu thức trung gian, gọi là $B$, sao cho $A<B<1$ và biểu thức $B$ có thể rút gọn dễ dàng.
Ta thấy $\dfrac{1}{2^2}<\dfrac{1}{1\cdot2}$; $\dfrac{1}{3^2}<\dfrac{1}{2\cdot3}$; $\dfrac{1}{4^2}<\dfrac{1}{3\cdot4}$; …; $\dfrac{1}{n^2}<\dfrac{1}{(n-1)n}$
Do đó $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{n^2}<\dfrac{1}{1\cdot2}+\dfrac{1}{2\cdot3}+\dfrac{1}{3\cdot4}+\dots+\dfrac{1}{(n-1)n}$
Theo bài trên, vế phải của bất đẳng thức trên bằng $\dfrac{n-1}{n}<1$. Từ đó suy ra điều phải chứng minh.
Cách 2: Chọn biểu thức trung gian là $B=\dfrac{1}{2^2-1}+\dfrac{1}{3^2-1}+\dfrac{1}{4^2-1}+\dots+\dfrac{1}{n^2-1}$ thì $A<B$
Còn $B=\dfrac{1}{1\cdot3}+\dfrac{1}{2\cdot4}+\dfrac{1}{3\cdot5}+\dots+\dfrac{1}{(n-1)(n+1)}$
$=\dfrac{1}{2}\left(1-\dfrac{1}{3}+\dfrac{1}{2}-\dfrac{1}{4}+\dfrac{1}{3}-\dfrac{1}{5}+\dots+\dfrac{1}{n-1}-\dfrac{1}{n+1}\right)$
$=\dfrac{1}{2}\left(1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{n-1}-\dfrac{1}{3}-\dfrac{1}{4}-\dfrac{1}{5}-\dots-\dfrac{1}{n+1}\right)$
$=\dfrac{1}{2}\left(1+\dfrac{1}{2}-\dfrac{1}{n}-\dfrac{1}{n+1}\right)<\dfrac{1}{2}\cdot\dfrac{3}{2}=\dfrac{3}{4}$. Vậy $A<B<\dfrac{3}{4}<1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng có $n-1$ số hạng $\dfrac{1}{k^2}$ không tính trực tiếp được nên phải làm trội: thay mỗi số hạng bằng một số lớn hơn có dạng $\dfrac{1}{k(k-1)}$, tách được thành hiệu hai phân số để các số hạng giữa triệt tiêu.

**Bước 1.** So sánh $\dfrac{1}{k^2}$ với $\dfrac{1}{k(k-1)}$ bằng cách so sánh hai mẫu dương với $k\ge2$.

**Bước 2.** Tách $\dfrac{1}{k(k-1)}$ thành hiệu của hai phân số có mẫu $k-1$ và $k$.

**Bước 3.** Viết các bất đẳng thức tương ứng với $k=2,3,\dots,n$ rồi cộng từng vế để các số hạng ở giữa triệt tiêu.

**Bước 4.** So sánh kết quả còn lại với $1$ và nêu rõ kết luận đúng với mọi $n\ge2$.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $k\ge2$ ta có $k^2>k(k-1)>0$ nên

$\dfrac{1}{k^2}<\dfrac{1}{k(k-1)}=\dfrac{1}{k-1}-\dfrac{1}{k}$.

Lần lượt cho $k=2,3,\dots,n$:

$\dfrac{1}{2^2}<\dfrac{1}{1}-\dfrac{1}{2}$; $\dfrac{1}{3^2}<\dfrac{1}{2}-\dfrac{1}{3}$; …; $\dfrac{1}{n^2}<\dfrac{1}{n-1}-\dfrac{1}{n}$.

Cộng từng vế $n-1$ bất đẳng thức trên:

$\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}<\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\dots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)=1-\dfrac{1}{n}$.

Vì $\dfrac{1}{n}>0$ nên $1-\dfrac{1}{n}<1$.

Vậy $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}<1$ với mọi số tự nhiên $n\ge2$.

Bất đẳng thức đã cho là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8B.30@p208
- bai: 30 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách phân số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: sách có 2 cách (cách 2 viện dẫn kết quả bài trước); lời giải kho trình bày cách 1 (làm trội bằng $\dfrac{1}{(2k)^2-1}$) để câu tự đủ.
## DE
Chứng minh bất đẳng thức: $\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dfrac{1}{6^2}+\dots+\dfrac{1}{(2n)^2}<\dfrac{1}{2}$ với mọi số tự nhiên $n\ge2$.
## SACH
Nếu chọn biểu thức trung gian là $B=\dfrac{1}{1\cdot2}+\dfrac{1}{3\cdot4}+\dfrac{1}{5\cdot6}+\dots+\dfrac{1}{(2n-1)2n}$ thì rút gọn biểu thức trung gian rất khó.
Cách 1: Chọn biểu thức trung gian là: $B=\dfrac{1}{2^2-1}+\dfrac{1}{4^2-1}+\dfrac{1}{6^2-1}+\dots+\dfrac{1}{(2n)^2-1}$
Đặt $A=\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dfrac{1}{6^2}+\dots+\dfrac{1}{(2n)^2}$. Dễ thấy $A<B$
Còn $B=\dfrac{1}{1\cdot3}+\dfrac{1}{3\cdot5}+\dfrac{1}{5\cdot7}+\dots+\dfrac{1}{(2n-1)(2n+1)}=\dfrac{n}{2n+1}$.
Vậy $A<\dfrac{n}{2n+1}<\dfrac{n}{2n}<\dfrac{1}{2}$.
Cách 2:
$A=\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dfrac{1}{6^2}+\dots+\dfrac{1}{(2n)^2}=\dfrac{1}{2^2}+\dfrac{1}{2^2\cdot2^2}+\dfrac{1}{2^2\cdot3^2}+\dots+\dfrac{1}{2^2\cdot n^2}$
$=\dfrac{1}{2^2}\left(1+\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}\right)=\dfrac{1}{4}\left(1+\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}\right)$
Theo bài trên thì $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}<1$, do đó $A<\dfrac{1}{4}(1+1)=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số hạng $\dfrac{1}{(2k)^2}$ nhỏ hơn $\dfrac{1}{(2k)^2-1}=\dfrac{1}{(2k-1)(2k+1)}$, là nghịch đảo tích hai số lẻ liên tiếp nên tách được thành hiệu hai phân số và cộng lại thì triệt tiêu từng cặp.

**Bước 1.** So sánh $\dfrac{1}{(2k)^2}$ với $\dfrac{1}{(2k)^2-1}$ bằng cách so sánh hai mẫu dương.

**Bước 2.** Phân tích mẫu $(2k)^2-1$ thành tích hai số lẻ liên tiếp rồi tách phân số thành hiệu hai phân số.

**Bước 3.** Viết bất đẳng thức cho $k=1,2,\dots,n$ rồi cộng từng vế để các số hạng ở giữa triệt tiêu.

**Bước 4.** So sánh kết quả còn lại với $\dfrac{1}{2}$ bằng cách xét hiệu.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $k\ge1$ ta có $(2k)^2>(2k)^2-1=(2k-1)(2k+1)>0$ nên

$\dfrac{1}{(2k)^2}<\dfrac{1}{(2k-1)(2k+1)}=\dfrac{1}{2}\left(\dfrac{1}{2k-1}-\dfrac{1}{2k+1}\right)$.

Lần lượt cho $k=1,2,\dots,n$ rồi cộng từng vế:

$\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{(2n)^2}<\dfrac{1}{2}\left(1-\dfrac{1}{3}+\dfrac{1}{3}-\dfrac{1}{5}+\dots+\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$

$=\dfrac{1}{2}\left(1-\dfrac{1}{2n+1}\right)=\dfrac{n}{2n+1}$.

Mặt khác $\dfrac{1}{2}-\dfrac{n}{2n+1}=\dfrac{2n+1-2n}{2(2n+1)}=\dfrac{1}{2(2n+1)}>0$ nên $\dfrac{n}{2n+1}<\dfrac{1}{2}$.

Vậy $\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{(2n)^2}<\dfrac{1}{2}$ với mọi số tự nhiên $n\ge2$.

Bất đẳng thức đã cho là bất đẳng thức chặt nên không xảy ra dấu bằng.

=== T8B.31@p208
- bai: 31 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: \dfrac{3}{4}
- dap_an: GTLN = $\dfrac{3}{4}$, đạt khi $x=\dfrac{1}{2}$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của: $\dfrac{3}{4x^2-4x+5}$.
## SACH
Viết mẫu số của phân thức dưới dạng $4x^2-4x+5=4x^2-4x+1+4=(2x-1)^2+4$
Bình phương một số thì không âm nên $(2x-1)^2\ge0$ (Dấu "=" xảy ra khi và chỉ khi $2x-1=0\Leftrightarrow x=\dfrac{1}{2}$)
Cộng $4$ vào hai vế, ta được $(2x-1)^2+4\ge4$.
Theo quy tắc so sánh hai phân số cùng tử số mà tử số và mẫu số đều dương, ta có: $\dfrac{3}{(2x-1)^2+4}\le\dfrac{3}{4}$. Phân thức đã cho có giá trị lớn nhất bằng $\dfrac{3}{4}$ khi và chỉ khi $x=\dfrac{1}{2}$.
Chú ý: không nên máy móc áp dụng quy tắc so sánh phân số cho phân thức đại số để nói rằng phân thức đã cho có tử số không đổi nên có giá trị lớn nhất khi mẫu số nhỏ nhất. Lập luận như trên có thể dẫn đến sai lầm. Ví dụ áp dụng lập luận phân thức có giá trị lớn nhất khi $x^2-3$ nhỏ nhất, tức là khi $x=0$, suy ra giá trị lớn nhất của $\dfrac{1}{x^2-3}$ bằng $-\dfrac{1}{3}$ (1)
Dễ thấy $-\dfrac{1}{3}$ không phải là giá trị lớn nhất của $\dfrac{1}{x^2-3}$. Chẳng hạn với $x=2$ thì giá trị của $\dfrac{1}{x^2-3}$ bằng $1$, lớn hơn $-\dfrac{1}{3}$.
Như vậy, từ $-3<1$ không thể suy ra $-\dfrac{1}{3}>\dfrac{1}{1}$. Từ $a<b$ chỉ suy ra được $\dfrac{1}{a}>\dfrac{1}{b}$ khi $a$ và $b$ là hai số cùng dấu.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử số là hằng số dương nên phân thức lớn nhất khi mẫu số dương nhỏ nhất; mẫu là tam thức bậc hai nên đưa về bình phương cộng một hằng số để biết cận dưới của mẫu.

**Bước 1.** Hoàn thành bình phương ở mẫu số để viết mẫu thành bình phương của một nhị thức cộng một hằng số.

**Bước 2.** Từ dạng đó chỉ ra mẫu số luôn dương và có cận dưới, nên phân thức xác định với mọi $x$.

**Bước 3.** Lấy nghịch đảo hai vế dương của bất đẳng thức về mẫu rồi nhân với tử số để chặn trên phân thức.

**Bước 4.** Chỉ ra giá trị của $x$ làm dấu bằng xảy ra để chắc chắn cận trên đó đạt được.

**Chú ý:** Chỉ được kết luận "mẫu nhỏ nhất thì phân thức lớn nhất" khi mẫu luôn dương; nếu mẫu có thể đổi dấu thì lập luận này sai.

**Phần 2. Trình bày**

$4x^2-4x+5=(2x-1)^2+4\ge4>0$ với mọi $x$, nên phân thức xác định với mọi $x$.

(1) Vì mẫu $\ge4>0$ nên $\dfrac{1}{4x^2-4x+5}\le\dfrac{1}{4}$, suy ra $\dfrac{3}{4x^2-4x+5}\le\dfrac{3}{4}$ với mọi $x$.

(2) Với $x=\dfrac{1}{2}$ thì $4x^2-4x+5=1-2+5=4$ nên phân thức bằng $\dfrac{3}{4}$, tức dấu bằng đạt được.

Vậy GTLN của phân thức bằng $\dfrac{3}{4}$, đạt khi $x=\dfrac{1}{2}$.

=== T8B.32@p208
- bai: 32 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: -\dfrac{1}{3}
- dap_an: GTNN = $-\dfrac{1}{3}$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của: $\dfrac{1}{2x-x^2-4}$.
## SACH
Viết biểu thức đã cho dưới dạng: $\dfrac{1}{2x-x^2-4}=-\dfrac{1}{x^2-2x+4}=-\dfrac{1}{(x-1)^2+3}$
Do $(x-1)^2\ge0$ nên $(x-1)^2+3\ge3$. Dựa vào quy tắc so sánh hai phân số cùng tử số mà tử số và mẫu số đều dương (hoặc nghịch đảo và đổi chiều bất đẳng thức có hai vế cùng dấu), ta có: $\dfrac{1}{(x-1)^2+3}\le\dfrac{1}{3}$.
Nhân hai vế của bất đẳng thức với $-1$ và đổi chiều: $-\dfrac{1}{(x-1)^2+3}\ge-\dfrac{1}{3}$.
Vậy biểu thức đã cho có giá trị nhỏ nhất bằng $-\dfrac{1}{3}$ khi và chỉ khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $2x-x^2-4$ luôn âm nên đổi dấu để đưa về một phân thức có mẫu dương; khi nhân hai vế với $-1$ phải đổi chiều bất đẳng thức.

**Bước 1.** Đặt dấu trừ ra ngoài mẫu rồi hoàn thành bình phương để thấy mẫu luôn khác $0$.

**Bước 2.** Chặn dưới mẫu dương mới bằng một hằng số, rồi lấy nghịch đảo hai vế dương để chặn trên phân thức.

**Bước 3.** Nhân hai vế với $-1$, nhớ đổi chiều, để chặn dưới biểu thức ban đầu.

**Bước 4.** Chỉ ra giá trị của $x$ làm dấu bằng xảy ra để chắc chắn cận dưới đó đạt được.

**Phần 2. Trình bày**

$2x-x^2-4=-(x^2-2x+4)=-\left[(x-1)^2+3\right]\le-3<0$ với mọi $x$, nên biểu thức xác định với mọi $x$ và

$\dfrac{1}{2x-x^2-4}=-\dfrac{1}{(x-1)^2+3}$.

(1) Vì $(x-1)^2+3\ge3>0$ nên $\dfrac{1}{(x-1)^2+3}\le\dfrac{1}{3}$. Nhân hai vế với $-1$ (đổi chiều): $-\dfrac{1}{(x-1)^2+3}\ge-\dfrac{1}{3}$ với mọi $x$.

(2) Với $x=1$: $\dfrac{1}{2-1-4}=-\dfrac{1}{3}$, tức dấu bằng đạt được.

Vậy GTNN của biểu thức bằng $-\dfrac{1}{3}$, đạt khi $x=1$.

=== T8B.33@p208
- bai: 33 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: \dfrac{7}{2}
- dap_an: GTLN = $\dfrac{7}{2}$, đạt khi $x=-1$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của: $\dfrac{3x^2+6x+10}{x^2+2x+3}$.
## SACH
Viết biểu thức đã cho thành:
$\dfrac{3x^2+6x+10}{x^2+2x+3}=\dfrac{3(x^2+2x+3)+1}{x^2+2x+3}=3+\dfrac{1}{x^2+2x+3}=3+\dfrac{1}{(x+1)^2+2}$
Giá trị lớn nhất của biểu thức bằng $\dfrac{7}{2}$ khi và chỉ khi $x=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử số bằng ba lần mẫu số cộng thêm một hằng số, nên tách phần nguyên ra thì còn lại phân thức có tử là hằng số và mẫu là tam thức bậc hai.

**Bước 1.** Viết tử số thành bội của mẫu số cộng với một số dư rồi tách phân thức thành phần nguyên cộng một phân thức.

**Bước 2.** Hoàn thành bình phương ở mẫu của phân thức còn lại để thấy mẫu luôn dương và có cận dưới.

**Bước 3.** Lấy nghịch đảo hai vế dương để chặn trên phân thức đó, rồi cộng thêm phần nguyên.

**Bước 4.** Chỉ ra giá trị của $x$ làm dấu bằng xảy ra để chắc chắn cận trên đạt được.

**Phần 2. Trình bày**

$x^2+2x+3=(x+1)^2+2\ge2>0$ với mọi $x$, nên biểu thức xác định với mọi $x$.

$\dfrac{3x^2+6x+10}{x^2+2x+3}=\dfrac{3(x^2+2x+3)+1}{x^2+2x+3}=3+\dfrac{1}{(x+1)^2+2}$.

(1) Vì $(x+1)^2+2\ge2>0$ nên $\dfrac{1}{(x+1)^2+2}\le\dfrac{1}{2}$, suy ra biểu thức $\le3+\dfrac{1}{2}=\dfrac{7}{2}$ với mọi $x$.

(2) Với $x=-1$: $\dfrac{3-6+10}{1-2+3}=\dfrac{7}{2}$, tức dấu bằng đạt được.

Vậy GTLN của biểu thức bằng $\dfrac{7}{2}$, đạt khi $x=-1$.

=== T8B.34@p208
- bai: 34 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: 3
- dap_an: GTNN = $3$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của: $\dfrac{4x^2-2x+1}{x^2}$.
## SACH
Viết biểu thức đã cho dưới dạng:
$P=\dfrac{4x^2-2x+1}{x^2}=\dfrac{3x^2+x^2-2x+1}{x^2}=3+\left(\dfrac{x-1}{x}\right)^2\ge3$
Giá trị nhỏ nhất của $P$ bằng $3$ khi và chỉ khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tách $4x^2$ thành $3x^2+x^2$ thì phần còn lại $x^2-2x+1$ là bình phương, chia cho $x^2$ được bình phương của một phân thức cộng với số nguyên.

**Bước 1.** Tách hạng tử $4x^2$ ở tử thành hai phần sao cho ba hạng tử còn lại tạo thành bình phương của một hiệu.

**Bước 2.** Chia từng phần cho $x^2$ để biểu thức thành một số cộng với bình phương của một phân thức.

**Bước 3.** Dùng tính chất bình phương không âm để chặn dưới biểu thức với mọi $x\ne0$.

**Bước 4.** Tìm $x\ne0$ làm bình phương bằng $0$ để chắc chắn cận dưới đạt được.

**Chú ý:** Biểu thức chỉ xác định khi $x\ne0$, nên giá trị của $x$ tìm được ở bước cuối phải khác $0$.

**Phần 2. Trình bày**

Biểu thức xác định khi $x\ne0$.

$P=\dfrac{4x^2-2x+1}{x^2}=\dfrac{3x^2+(x^2-2x+1)}{x^2}$

$=3+\dfrac{(x-1)^2}{x^2}=3+\left(\dfrac{x-1}{x}\right)^2$.

(1) Với mọi $x\ne0$ ta có $\left(\dfrac{x-1}{x}\right)^2\ge0$ nên $P\ge3$.

(2) Với $x=1$ (khác $0$) thì $P=\dfrac{4-2+1}{1}=3$, tức dấu bằng đạt được.

Vậy GTNN của biểu thức bằng $3$, đạt khi $x=1$.

=== T8B.35@p208
- bai: 35 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: 1
- dap_an: GTLN = $1$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của: $\dfrac{2x+1}{x^2+2}$.
## SACH
$Q=\dfrac{2x+1}{x^2+2}=\dfrac{x^2+2-x^2+2x-1}{x^2+2}=1-\dfrac{(x-1)^2}{x^2+2}\le1$
Giá trị lớn nhất của $Q$ bằng $1$ khi và chỉ khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $2x+1$ bằng mẫu $x^2+2$ trừ đi một bình phương $(x-1)^2$, nên tách thành $1$ trừ một phân thức không âm.

**Bước 1.** Viết tử số thành mẫu số trừ đi một biểu thức, và nhận ra biểu thức đó là một bình phương.

**Bước 2.** Tách phân thức thành $1$ trừ một phân thức có tử là bình phương và mẫu dương.

**Bước 3.** Dùng dấu của phân thức đó để chặn trên biểu thức với mọi $x$.

**Bước 4.** Tìm $x$ làm phân thức bị trừ bằng $0$ để chắc chắn cận trên đạt được.

**Phần 2. Trình bày**

Mẫu $x^2+2\ge2>0$ nên biểu thức xác định với mọi $x$.

$Q=\dfrac{2x+1}{x^2+2}=\dfrac{(x^2+2)-(x^2-2x+1)}{x^2+2}=1-\dfrac{(x-1)^2}{x^2+2}$.

(1) Vì $(x-1)^2\ge0$ và $x^2+2>0$ nên $\dfrac{(x-1)^2}{x^2+2}\ge0$, suy ra $Q\le1$ với mọi $x$.

(2) Với $x=1$ thì $Q=\dfrac{3}{3}=1$, tức dấu bằng đạt được.

Vậy GTLN của $Q$ bằng $1$, đạt khi $x=1$.

=== T8B.36@p208
- bai: 36 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu:
- kiem: khong
- ket_qua_sach: -1; 4
- dap_an: GTNN = $-1$, đạt khi $x=-2$; GTLN = $4$, đạt khi $x=\dfrac{1}{2}$
- ghi_chu_nghi: sách chỉ chứng minh hai bất đẳng thức $\ge-1$ và $\le4$, không nêu giá trị $x$ để dấu bằng xảy ra; dòng ket_qua_sach ghi hai cận theo thứ tự GTNN; GTLN.
## DE
Tìm giá trị nhỏ nhất và lớn nhất của: $\dfrac{4x+3}{x^2+1}$.
## SACH
Để tìm giá trị nhỏ nhất, ta viết $\dfrac{4x+3}{x^2+1}$ dưới dạng:
$\dfrac{4x+3}{x^2+1}=\dfrac{x^2+4x+4-x^2-1}{x^2+1}=\dfrac{(x+2)^2}{x^2+1}-1\ge-1$
Để tìm giá trị lớn nhất, ta viết $\dfrac{4x+3}{x^2+1}$ dưới dạng:
$\dfrac{4x+3}{x^2+1}=\dfrac{4x^2+4-4x^2+4x-1}{x^2+1}=\dfrac{4(x^2+1)-(4x^2-4x+1)}{x^2+1}=4-\dfrac{(2x-1)^2}{x^2+1}\le4$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chặn dưới thì viết tử như bình phương trừ mẫu, muốn chặn trên thì viết tử như bội của mẫu trừ một bình phương; mỗi lần chọn đúng bình phương làm tử biến thành hiệu dạng "số cộng/trừ một phân thức không âm".

**Bước 1.** Với GTNN, viết $4x+3$ dưới dạng bình phương một nhị thức trừ đi mẫu số $x^2+1$.

**Bước 2.** Tách phân thức để thấy biểu thức bằng một phân thức không âm trừ đi một hằng số, từ đó chặn dưới.

**Bước 3.** Với GTLN, viết $4x+3$ dưới dạng bốn lần mẫu số trừ đi một bình phương rồi chặn trên biểu thức.

**Bước 4.** Với mỗi cận, tìm giá trị của $x$ làm bình phương tương ứng bằng $0$ rồi tính lại biểu thức để chắc chắn cận đạt được.

**Phần 2. Trình bày**

Mẫu $x^2+1\ge1>0$ nên biểu thức xác định với mọi $x$. Gọi biểu thức là $B$.

GTNN: $B=\dfrac{(x+2)^2-(x^2+1)}{x^2+1}=\dfrac{(x+2)^2}{x^2+1}-1$.

(1) Vì $\dfrac{(x+2)^2}{x^2+1}\ge0$ nên $B\ge-1$ với mọi $x$.

(2) Với $x=-2$: $B=\dfrac{-8+3}{4+1}=-1$, tức dấu bằng đạt được. Vậy GTNN của $B$ bằng $-1$, đạt khi $x=-2$.

GTLN: $B=\dfrac{4(x^2+1)-(4x^2-4x+1)}{x^2+1}=4-\dfrac{(2x-1)^2}{x^2+1}$.

(1) Vì $\dfrac{(2x-1)^2}{x^2+1}\ge0$ nên $B\le4$ với mọi $x$.

(2) Với $x=\dfrac{1}{2}$: $B=\dfrac{2+3}{\dfrac{1}{4}+1}=\dfrac{5}{\dfrac{5}{4}}=4$, tức dấu bằng đạt được. Vậy GTLN của $B$ bằng $4$, đạt khi $x=\dfrac{1}{2}$.

=== T8B.37@p208
- bai: 37 · y: - · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030202
- cong_cu: phân tích nhân tử
- kiem: khong
- ket_qua_sach: 0
- dap_an: GTNN = $0$, đạt khi $x=-2$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của: $\dfrac{x^4+2x^3+8x+16}{x^4-2x^3+8x^2-8x+16}$.
## SACH
Rút gọn biểu thức đã cho thành $\dfrac{(x+2)^2}{x^2+4}$.
Giá trị nhỏ nhất của biểu thức bằng $0$ khi và chỉ khi $x=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử và mẫu đều là đa thức bậc bốn có nhân tử chung $x^2-2x+4$ (tử có nhân tử $x+2$ nhìn thấy khi nhóm $x^4+2x^3$ với $8x+16$), nên phân tích cả hai rồi rút gọn để còn một phân thức đơn giản.

**Bước 1.** Nhóm hai hạng tử đầu và hai hạng tử cuối của tử số để đặt nhân tử chung rồi phân tích tiếp bằng hằng đẳng thức tổng hai lập phương.

**Bước 2.** Nhóm các hạng tử của mẫu số thành hai nhóm sao cho mỗi nhóm chứa nhân tử $x^2-2x+4$ rồi đặt nhân tử chung.

**Bước 3.** Chứng tỏ nhân tử chung luôn dương để mẫu khác $0$ và rút gọn được cho nó.

**Bước 4.** Chặn dưới phân thức đã rút gọn rồi chỉ ra $x$ làm dấu bằng xảy ra.

**Phần 2. Trình bày**

Tử: $x^4+2x^3+8x+16=x^3(x+2)+8(x+2)=(x+2)(x^3+8)=(x+2)^2(x^2-2x+4)$.

Mẫu: $x^4-2x^3+8x^2-8x+16=(x^4-2x^3+4x^2)+(4x^2-8x+16)=(x^2+4)(x^2-2x+4)$.

Vì $x^2-2x+4=(x-1)^2+3>0$ và $x^2+4>0$ nên mẫu luôn dương, biểu thức xác định với mọi $x$ và

$\dfrac{x^4+2x^3+8x+16}{x^4-2x^3+8x^2-8x+16}=\dfrac{(x+2)^2(x^2-2x+4)}{(x^2+4)(x^2-2x+4)}=\dfrac{(x+2)^2}{x^2+4}$.

(1) Vì $(x+2)^2\ge0$ và $x^2+4>0$ nên $\dfrac{(x+2)^2}{x^2+4}\ge0$ với mọi $x$.

(2) Với $x=-2$ thì $\dfrac{(x+2)^2}{x^2+4}=\dfrac{0}{8}=0$, tức dấu bằng đạt được.

Vậy GTNN của biểu thức bằng $0$, đạt khi $x=-2$.

=== T8B.38a@p208
- bai: 38 · y: a · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: bình phương hai vế
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng nếu hai số dương có tích không đổi thì tổng của chúng nhỏ nhất khi và chỉ khi hai số ấy bằng nhau.
## SACH
Cho $a,b>0$ có $ab=k$ ($k$ là hằng số). Ta sẽ chứng minh $a+b$ nhỏ nhất khi và chỉ khi $a=b$.
Ta có $(a+b)^2=a^2+2ab+b^2=(a-b)^2+4ab=(a-b)^2+4k\ge4k$;
$(a-b)^2$ đạt giá trị nhỏ nhất khi và chỉ khi $a=b$.
Vì $a+b>0$ nên $(a+b)^2$ nhỏ nhất khi và chỉ khi $(a+b)$ nhỏ nhất. Do đó $(a+b)$ nhỏ nhất khi và chỉ khi $a=b$. Vậy hai số dương có tích không đổi thì tổng của chúng nhỏ nhất khi và chỉ khi hai số ấy bằng nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với tích $ab=k$ cố định, bình phương của tổng bằng bình phương của hiệu cộng $4k$, mà $4k$ không đổi nên tổng nhỏ nhất khi hiệu bằng $0$.

**Bước 1.** Gọi hai số dương là $a,b$ với $ab=k$ không đổi và xét bình phương của tổng $a+b$.

**Bước 2.** Viết $(a+b)^2$ thành bình phương của hiệu cộng một số hạng chỉ phụ thuộc $k$.

**Bước 3.** Chặn dưới tổng với mọi cặp số có tích $k$ rồi chỉ ra cặp số làm cận dưới đạt được.

**Bước 4.** Chứng minh tổng chạm cận dưới khi và chỉ khi hai số bằng nhau, đủ cả hai chiều.

**Phần 2. Trình bày**

Gọi hai số dương là $a,b$ với $ab=k$ ($k>0$ không đổi) và đặt $S=a+b>0$.

$S^2=(a+b)^2=a^2+2ab+b^2=(a-b)^2+4ab=(a-b)^2+4k$.

(1) Vì $(a-b)^2\ge0$ nên $S^2\ge4k$, mà $S>0$ nên $S\ge2\sqrt{k}$ với mọi cặp $a,b$ dương có tích $k$.

(2) Với $a=b=\sqrt{k}$ (tích bằng $k$) thì $S=2\sqrt{k}$, nên tổng nhỏ nhất đúng bằng $2\sqrt{k}$.

Dấu bằng: vì $S>0$ nên $S=2\sqrt{k}\Leftrightarrow S^2=4k\Leftrightarrow(a-b)^2=0\Leftrightarrow a=b$.

Vậy tổng $a+b$ nhỏ nhất khi và chỉ khi $a=b$, tức là hai số dương có tích không đổi thì tổng của chúng nhỏ nhất khi và chỉ khi hai số ấy bằng nhau.

=== T8B.38b@p208
- bai: 38 · y: b · trang: 208 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: hai số dương có tích không đổi thì tổng nhỏ nhất khi bằng nhau
- kiem: khong
- ket_qua_sach: 8
- dap_an: GTNN = $8$, đạt khi $x=\dfrac{1}{2}$
- ghi_chu_nghi: sách giải bằng kết quả ý a); lời giải kho tự chứng minh phép chặn dưới (cùng cách bình phương tổng) để câu đứng một mình.
## DE
Tìm giá trị nhỏ nhất của: $8x+\dfrac{2}{x}$ với $x>0$.
## SACH
Với $x>0$ thì $8x$ và $\dfrac{2}{x}$ là hai số dương. Tích của chúng bằng $8x\cdot\dfrac{2}{x}=16$ (không đổi). Do đó tổng của chúng nhỏ nhất khi và chỉ khi $8x=\dfrac{2}{x}\Leftrightarrow x^2=\dfrac{1}{4}\Leftrightarrow x=\dfrac{1}{2}$ (do $x>0$).
Khi đó giá trị nhỏ nhất của $8x+\dfrac{2}{x}$ bằng $8\cdot\dfrac{1}{2}+\dfrac{2}{\dfrac{1}{2}}=8$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai số hạng $8x$ và $\dfrac{2}{x}$ đều dương và tích của chúng là hằng số, nên tổng nhỏ nhất khi hai số hạng bằng nhau.

**Bước 1.** Nhận ra $8x$ và $\dfrac{2}{x}$ là hai số dương có tích không phụ thuộc $x$.

**Bước 2.** Viết bình phương của tổng thành bình phương của hiệu cộng bốn lần tích để chặn dưới tổng.

**Bước 3.** Lấy căn dương hai vế để có cận dưới của chính tổng, rồi tìm $x$ làm hai số hạng bằng nhau.

**Bước 4.** Thay giá trị $x$ đó vào biểu thức để chắc chắn cận dưới đạt được.

**Chú ý:** Điều kiện $x>0$ là bắt buộc để hai số hạng đều dương; nếu $x<0$ thì biểu thức nhận giá trị âm và cách làm này không còn đúng.

**Phần 2. Trình bày**

Với $x>0$: $8x>0$, $\dfrac{2}{x}>0$ và $8x\cdot\dfrac{2}{x}=16$. Đặt $S=8x+\dfrac{2}{x}>0$.

$S^2=\left(8x+\dfrac{2}{x}\right)^2=\left(8x-\dfrac{2}{x}\right)^2+4\cdot8x\cdot\dfrac{2}{x}=\left(8x-\dfrac{2}{x}\right)^2+64$.

(1) Vì $\left(8x-\dfrac{2}{x}\right)^2\ge0$ nên $S^2\ge64$, mà $S>0$ nên $S\ge8$ với mọi $x>0$.

(2) Dấu bằng xảy ra khi $8x=\dfrac{2}{x}\Leftrightarrow x^2=\dfrac{1}{4}\Leftrightarrow x=\dfrac{1}{2}$ (do $x>0$). Với $x=\dfrac{1}{2}$: $S=4+4=8$.

Vậy GTNN của $8x+\dfrac{2}{x}$ bằng $8$, đạt khi $x=\dfrac{1}{2}$.
