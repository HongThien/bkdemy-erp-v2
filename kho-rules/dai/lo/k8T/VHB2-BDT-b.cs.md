=== V2V.98@p44
- bai: 98 · y: - · trang: 44 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đổi biến về điểm rơi (a = 1/3 + x) · bình phương không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b ngẫu nhiên, c=1-a-b): không có bộ nào vi phạm; dấu "=" tại a=b=c=1/3.
## DE
Cho $a+b+c=1$. Chứng minh rằng $a^2+b^2+c^2\ge\dfrac{1}{3}$.
## SACH
Đặt $a=\dfrac{1}{3}+x,\ b=\dfrac{1}{3}+y,\ c=\dfrac{1}{3}+z$. Do $a+b+c=1$ nên $x+y+z=0$. Ta có:

$a^2+b^2+c^2=\left(\dfrac{1}{3}+x\right)^2+\left(\dfrac{1}{3}+y\right)^2+\left(\dfrac{1}{3}+z\right)^2=$

$=\left(\dfrac{1}{9}+\dfrac{2}{3}x+x^2\right)+\left(\dfrac{1}{9}+\dfrac{2}{3}y+y^2\right)+\left(\dfrac{1}{9}+\dfrac{2}{3}z+z^2\right)=$

$=\dfrac{1}{3}+\dfrac{2}{3}(x+y+z)+x^2+y^2+z^2=\dfrac{1}{3}+x^2+y^2+z^2\ge\dfrac{1}{3}$.

Xảy ra đẳng thức $\Leftrightarrow x=y=z=0\Leftrightarrow a=b=c=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+b+c=1$ cho biết ba số trung bình cộng bằng $\dfrac13$ nên dấu "=" nằm ở $a=b=c=\dfrac13$; tách mỗi biến thành $\dfrac13$ cộng một độ lệch thì các độ lệch có tổng bằng $0$ và phần bậc nhất tự mất.

**Bước 1.** Đặt mỗi biến bằng $\dfrac13$ cộng một số mới để chuyển điều kiện $a+b+c=1$ thành điều kiện đơn giản hơn của ba số mới.

**Bước 2.** Khai triển ba bình phương rồi gom các hạng tử chứa số mới bậc nhất thành một nhóm có thừa số là tổng ba số mới.

**Bước 3.** Dùng điều kiện về tổng ba số mới để nhóm bậc nhất triệt tiêu, chỉ còn hằng số cộng với tổng các bình phương không âm.

**Bước 4.** Tìm khi nào các bình phương cùng bằng $0$ để kết luận điều kiện xảy ra dấu "=".

**Phần 2. Trình bày**

Đặt $a=\dfrac13+x,\ b=\dfrac13+y,\ c=\dfrac13+z$. Từ $a+b+c=1$ suy ra $x+y+z=0$.

Khi đó $a^2+b^2+c^2=\left(\dfrac13+x\right)^2+\left(\dfrac13+y\right)^2+\left(\dfrac13+z\right)^2$

$=\dfrac13+\dfrac23(x+y+z)+x^2+y^2+z^2$

$=\dfrac13+x^2+y^2+z^2\ge\dfrac13$ (vì $x+y+z=0$ và $x^2,y^2,z^2\ge0$).

Dấu "=" xảy ra khi $x=y=z=0$, tức $a=b=c=\dfrac13$.

Vậy $a^2+b^2+c^2\ge\dfrac13$.

=== V2V.99@p44
- bai: 99 · y: - · trang: 44 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác (ba thừa số dương) · b² − (c − a)² ≤ b² · nhân các bất đẳng thức cùng chiều (hai vế dương) · khai căn hai vế dương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c là ba cạnh tam giác): không bộ nào vi phạm; dấu "=" tại a=b=c. Sách Cách 1 viện dẫn một bất đẳng thức ở ví dụ trước; lời giải kho đi theo Cách 2 (tự đủ, không viện dẫn).
## DE
Chứng minh bất đẳng thức $abc\ge(b+c-a)(a+c-b)(a+b-c)$ với $a,b,c$ là độ dài ba cạnh của một tam giác.
## SACH
Giải

Cách 1. Đặt $b+c-a=x,\ a+c-b=y,\ a+b-c=z$ thì $x,y,z>0$. Theo bất đẳng thức $(x+y)(y+z)(z+x)\ge8xyz$ (ví dụ 94) ta có:

$(2a)(2b)(2c)\ge8(b+c-a)(a+c-b)(a+b-c)$

$\Rightarrow abc\ge(b+c-a)(a+c-b)(a+b-c)$.

Xảy ra đẳng thức khi và chỉ khi $a=b=c$.

Cách 2. Ta có:

$(b+c-a)(b+a-c)=b^2-(c-a)^2\le b^2$

$(c+a-b)(c+b-a)=c^2-(a-b)^2\le c^2$

$(a+b-c)(a+c-b)=a^2-(b-c)^2\le a^2$.

Nhân từng vế ba bất đẳng thức trên, ta được

$[(b+c-a)(a+c-b)(a+b-c)]^2\le[abc]^2$.

Các biểu thức trong dấu ngoặc vuông đều dương nên

$(b+c-a)(a+c-b)(a+b-c)\le abc$.

Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi tích hai thừa số như $(b+c-a)(b+a-c)$ có dạng $(b+u)(b-u)$ nên bằng $b^2-u^2\le b^2$; nhân ba bất đẳng thức như vậy thì mỗi thừa số của vế trái xuất hiện đúng hai lần, ra bình phương của tích cần chặn.

**Bước 1.** Dùng bất đẳng thức tam giác để thấy cả ba thừa số $b+c-a,\ a+c-b,\ a+b-c$ đều dương, nhờ đó được phép nhân các bất đẳng thức vế với vế.

**Bước 2.** Ghép hai thừa số có chung một cạnh để mỗi cặp thành hiệu hai bình phương, rồi bỏ phần bình phương trừ đi để chặn trên bằng bình phương của cạnh chung.

**Bước 3.** Nhân ba bất đẳng thức vừa có, quan sát vế trái thành bình phương của tích ba thừa số cần chặn.

**Bước 4.** Vì hai tích cùng dương nên khai căn được, rồi tìm điều kiện để mọi dấu "=" ở bước 2 cùng xảy ra.

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh của một tam giác nên $b+c-a>0,\ a+c-b>0,\ a+b-c>0$.

Ta có $(b+c-a)(b+a-c)=b^2-(c-a)^2\le b^2$, và vế trái dương.

Tương tự $(c+a-b)(c+b-a)=c^2-(a-b)^2\le c^2$ và $(a+b-c)(a+c-b)=a^2-(b-c)^2\le a^2$.

Nhân vế với vế ba bất đẳng thức trên (các vế đều dương): $[(b+c-a)(a+c-b)(a+b-c)]^2\le(abc)^2$.

Cả hai số $(b+c-a)(a+c-b)(a+b-c)$ và $abc$ đều dương nên $(b+c-a)(a+c-b)(a+b-c)\le abc$.

Dấu "=" xảy ra khi $c-a=a-b=b-c=0$, tức $a=b=c$.

Vậy $abc\ge(b+c-a)(a+c-b)(a+b-c)$.

=== V2V.100@p45
- bai: 100 · y: - · trang: 45 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét trường hợp theo dấu của ba thừa số · b² − (c − a)² ≤ b² · nhân các bất đẳng thức cùng chiều (vế không âm)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ a,b,c>0 bất kì: không bộ nào vi phạm; dấu "=" tại a=b=c. Bài có dấu *. Sách ở Cách 2 viết "nếu không có số nào âm thì vế phải dương" — thực ra vế phải có thể bằng 0 (vd a=b+c); lời giải kho dùng "không âm".
## DE
Chứng minh bất đẳng thức $abc\ge(b+c-a)(a+c-b)(a+b-c)$ với $a,b,c$ là các số dương.
## SACH
Giải

Cách 1. Do vai trò của $a,b,c$ như nhau, ta giả sử rằng $a\ge b\ge c$. Xét hai trường hợp:

a) $b+c\le a$. Khi đó vế trái của (1) là số dương, còn vế phải không dương. Bất đẳng thức được chứng minh.

b) $b+c>a$. Khi đó hai vế của (1) đều dương. Giải tiếp như ví dụ 99.

Cách 2. Trong ba số $b+c-a,\ a+c-b,\ a+b-c$, không có quá một số âm. Thật vậy, chẳng hạn nếu $b+c-a<0,\ a+c-b<0$ thì $2c<0$, trái với giả thiết.

Nếu có đúng một số âm thì vế phải của (1) là số âm, bất đẳng thức (1) hiển nhiên đúng.

Nếu không có số nào âm thì vế phải của (1) là số dương. Giải tiếp như ví dụ 99.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khác bài tam giác, ở đây ba thừa số $b+c-a,\ a+c-b,\ a+b-c$ có thể âm; phải xét dấu của chúng: vế phải âm thì xong ngay, còn khi cả ba không âm thì dùng cách nhân ba bất đẳng thức dạng $b^2-(c-a)^2\le b^2$.

**Bước 1.** Chứng tỏ trong ba thừa số không thể có hai số âm, bằng cách cộng từng cặp thừa số để ra $2a,\ 2b$ hoặc $2c$, các số này đều dương.

**Bước 2.** Xét trường hợp có đúng một thừa số âm: khi đó vế phải âm còn vế trái dương nên bất đẳng thức hiển nhiên đúng.

**Bước 3.** Xét trường hợp không thừa số nào âm, ghép các thừa số theo từng cặp để chặn mỗi tích bằng bình phương một biến.

**Bước 4.** Nhân ba bất đẳng thức cùng chiều (các vế không âm), khai căn hai vế không âm và tìm điều kiện dấu "=".

**Phần 2. Trình bày**

Đặt $x=b+c-a,\ y=a+c-b,\ z=a+b-c$. Ta có $x+y=2c>0,\ y+z=2a>0,\ z+x=2b>0$ nên trong ba số $x,y,z$ không có hai số âm.

Trường hợp 1: có đúng một số âm. Khi đó $xyz<0<abc$ nên bất đẳng thức đúng.

Trường hợp 2: $x,y,z\ge0$. Ta có $0\le xz=(b+c-a)(b+a-c)=b^2-(c-a)^2\le b^2$.

Tương tự $0\le xy\le c^2$ và $0\le yz\le a^2$ (vì $xy=c^2-(a-b)^2$ và $yz=a^2-(b-c)^2$).

Nhân vế với vế (các vế không âm): $(xyz)^2\le(abc)^2$. Vì $xyz\ge0$ và $abc>0$ nên $xyz\le abc$.

Dấu "=" xảy ra khi $a=b=c$ (khi đó $x=y=z=a>0$).

Vậy $abc\ge(b+c-a)(a+c-b)(a+b-c)$ với mọi $a,b,c>0$.

=== V2V.101@p45
- bai: 101 · y: - · trang: 45 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét từng khoảng giá trị của biến (x ≥ 1 và x < 1) · nhóm hạng tử đặt nhân tử chung
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị x trong [-3,3]: min khoảng 0,745 > 0, không vi phạm. Sách có Cách 1 và Cách 2; lời giải kho theo Cách 1.
## DE
Chứng minh rằng $x^8-x^7+x^2-x+1>0$.
## SACH
Giải

Gọi $A$ là vế trái của bất đẳng thức.

Cách 1. Nếu $x\ge1$ thì ta viết $A$ dưới dạng $x^7(x-1)+x(x-1)+1$. Do $x\ge1$ nên $A>0$.

Nếu $x<1$ thì ta viết $A$ dưới dạng $x^8+x^2(1-x^5)+(1-x)$. Do $x<1$ nên $1-x^5>0$, do đó $A>0$.

Cách 2.

$A=x^7(x-1)-(x-1)+x^2=(x-1)(x^7-1)+x^2$.

Nếu $x\ge1$ thì $x^7\ge1$, do đó $(x-1)(x^7-1)\ge0$, còn $x^2>0$ nên $A>0$.

Nếu $x<1$ thì $x^7<1$, do đó $(x-1)(x^7-1)>0$, còn $x^2\ge0$ nên $A>0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc tám có dấu âm ở $-x^7$ và $-x$ nên không thể xét thẳng; thấy các hạng tử $x^8-x^7$ và $x^2-x$ cùng có thừa số $x-1$ nên ta chia theo dấu của $x-1$ để mỗi nhóm có dấu rõ ràng.

**Bước 1.** Chia hai khoảng $x\ge1$ và $x<1$ vì dấu của $x-1$ khác nhau ở hai khoảng, từ đó mới kết luận được dấu của từng nhóm.

**Bước 2.** Với $x\ge1$, nhóm $x^8-x^7$ và $x^2-x$ rồi đặt thừa số chung để đa thức thành tổng các tích của hai số không âm cộng $1$.

**Bước 3.** Với $x<1$, tách $x^8$ riêng và nhóm các hạng tử còn lại sao cho xuất hiện hai hiệu $1-x^5$ và $1-x$ đều dương.

**Phần 2. Trình bày**

Gọi $A=x^8-x^7+x^2-x+1$.

Nếu $x\ge1$: $A=x^7(x-1)+x(x-1)+1$. Vì $x\ge1$ nên $x-1\ge0$, $x^7>0$, $x>0$ suy ra $A\ge1>0$.

Nếu $x<1$: $A=x^8+x^2(1-x^5)+(1-x)$. Vì $x<1$ nên $1-x>0$ và $1-x^5>0$, lại có $x^8\ge0,\ x^2\ge0$ nên $A\ge1-x>0$.

Vậy $x^8-x^7+x^2-x+1>0$ với mọi $x$.

=== V2V.102@p46
- bai: 102 · y: - · trang: 46 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đưa về tổng các bình phương bằng 0 · tổng các số không âm bằng 0 khi từng số bằng 0
- kiem: khong
- ket_qua_sach: x=y=z=0
- dap_an: $x=y=z=0$
- ghi_chu_nghi: Nghiệm thực. Máy thử khẳng định x^2+y^2+z^2-xy-xz>0 trừ gốc tọa độ (tổng bình phương xác định dương).
## DE
Giải phương trình $x^2+y^2+z^2=x(y+z)$.
## SACH
Giải: Trước hết ta chứng minh rằng

$x^2+y^2+z^2\ge xy+xz$ (1)

Bất đẳng thức (1) tương đương với:

$2x^2+2y^2+2z^2-2xy-2xz\ge0$

$\Leftrightarrow(x-y)^2+(x-z)^2+y^2+z^2\ge0$ (2)

Xảy ra đẳng thức ở (2), tức là ở (1), khi và chỉ khi $x=y=z=0$. Đó là nghiệm của phương trình.

Chú ý: Cũng có thể biến đổi phương trình đã cho thành:

$2x^2+2y^2+2z^2-2xy-2xz=0$

$\Leftrightarrow(x-y)^2+(x-z)^2+y^2+z^2=0$

$\Leftrightarrow x=y=z=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Một phương trình ba ẩn không giải được bằng cách tìm từng ẩn; nhưng nếu đưa được hiệu hai vế về tổng các bình phương thì tổng đó bằng $0$ buộc từng bình phương phải bằng $0$.

**Bước 1.** Chuyển hết về một vế và nhân hai vế với $2$ để mọi hệ số của các bình phương là số chẵn, chuẩn bị ghép thành các bình phương.

**Bước 2.** Tách $2x^2$ thành hai phần để ghép với $y^2$ và $z^2$ tạo hai bình phương của một hiệu, còn dư $y^2$ và $z^2$.

**Bước 3.** Vì tổng của bốn số không âm bằng $0$ nên từng số phải bằng $0$, từ đó suy ra giá trị của cả ba ẩn.

**Chú ý:** Nhớ thử lại nghiệm bằng cách thay $x=y=z=0$ vào phương trình ban đầu cho đẳng thức đúng.

**Phần 2. Trình bày**

$x^2+y^2+z^2=x(y+z)\Leftrightarrow 2x^2+2y^2+2z^2-2xy-2xz=0$

$\Leftrightarrow(x-y)^2+(x-z)^2+y^2+z^2=0$

Vì tổng bốn số không âm bằng $0$ nên $x-y=0,\ x-z=0,\ y=0,\ z=0$, suy ra $x=y=z=0$.

Thử lại: $x=y=z=0$ thỏa mãn phương trình.

Vậy nghiệm của phương trình là $x=y=z=0$.

=== V2B.358@p46
- bai: 358 · y: - · trang: 46 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: x² + y² ≥ 2xy · cộng các bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý a, b: không bộ nào vi phạm. Sách ghi hướng (tắt), lời giải kho viết đủ.
## DE
Chứng minh các bất đẳng thức: a) $a^2+b^2+c^2\ge ab+bc+ca$; b) $a^4+b^4+c^4+d^4\ge4abcd$.
## SACH
a) Ta có: $a^2+b^2\ge2ab,\ b^2+c^2\ge2bc,\ c^2+a^2\ge2ca$. Cộng từng vế các bất đẳng thức trên.

b) Áp dụng bất đẳng thức $x^2+y^2\ge2xy$ ta có:

$a^4+b^4\ge2a^2b^2,\quad c^4+d^4\ge2c^2d^2$.

Do đó $a^4+b^4+c^4+d^4\ge2[(ab)^2+(cd)^2]\ge2\cdot2abcd=4abcd$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai ý chỉ cần bất đẳng thức $x^2+y^2\ge2xy$ (tức $(x-y)^2\ge0$) dùng nhiều lần: ý a dùng ba cặp bình phương rồi cộng lại, ý b dùng hai lần ở bậc bốn rồi thêm một lần nữa với $x=ab,\ y=cd$.

**Bước 1.** Ở ý a, viết bất đẳng thức $x^2+y^2\ge2xy$ cho từng cặp trong ba biến rồi cộng ba bất đẳng thức cùng chiều lại để xuất hiện $2(ab+bc+ca)$ ở vế phải.

**Bước 2.** Ở ý b, nhóm các lũy thừa bậc bốn thành hai cặp $a^4+b^4$ và $c^4+d^4$, coi mỗi số hạng như bình phương của $a^2,b^2,c^2,d^2$ để áp dụng bất đẳng thức trên.

**Bước 3.** Gộp kết quả thành tổng của hai bình phương $(ab)^2+(cd)^2$ rồi áp dụng lần nữa để ra tích $abcd$.

**Phần 2. Trình bày**

a) Với mọi số thực $a,b,c$, vì $(a-b)^2\ge0$ nên $a^2+b^2\ge2ab$; tương tự $b^2+c^2\ge2bc$ và $c^2+a^2\ge2ca$.

Cộng vế với vế ba bất đẳng thức: $2(a^2+b^2+c^2)\ge2(ab+bc+ca)$, suy ra $a^2+b^2+c^2\ge ab+bc+ca$.

Dấu "=" xảy ra khi $a=b=c$.

b) Áp dụng $x^2+y^2\ge2xy$ với $x=a^2,\ y=b^2$ và với $x=c^2,\ y=d^2$: $a^4+b^4\ge2a^2b^2$ và $c^4+d^4\ge2c^2d^2$.

Cộng lại: $a^4+b^4+c^4+d^4\ge2\left[(ab)^2+(cd)^2\right]$.

Lại áp dụng $x^2+y^2\ge2xy$ với $x=ab,\ y=cd$: $(ab)^2+(cd)^2\ge2abcd$.

Suy ra $a^4+b^4+c^4+d^4\ge2\cdot2abcd=4abcd$.

Dấu "=" xảy ra khi $a^2=b^2,\ c^2=d^2,\ ab=cd$ (chẳng hạn $a=b=c=d$).

=== V2B.359@p47
- bai: 359 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: x² + y² + z² ≥ xy + yz + zx · áp dụng bất đẳng thức hai lần với biến mới
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý: không bộ nào vi phạm. Sách in lệch: ý b ghi "Giải tương tự câu c" (đúng ra là câu a); lời giải kho viết riêng cho ý b.
## DE
Chứng minh các bất đẳng thức: a) $a^4+b^4+c^4\ge abc(a+b+c)$; b) $a^8+b^8+c^8\ge a^2b^2c^2(ab+bc+ca)$.
## SACH
a) Áp dụng $x^2+y^2+z^2\ge xy+yz+zx$ (1) (câu a), ta có

$a^4+b^4+c^4\ge a^2b^2+b^2c^2+c^2a^2$.

Lại áp dụng (1), ta có:

$a^2b^2+b^2c^2+c^2a^2\ge ab^2c+bc^2a+a^2bc=abc(a+b+c)$.

b) Giải tương tự câu c.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức $x^2+y^2+z^2\ge xy+yz+zx$ đúng với mọi số thực $x,y,z$ nên dùng được cho các biểu thức bậc cao hơn nếu ta coi $x,y,z$ là các lũy thừa của $a,b,c$.

**Bước 1.** Ở ý a, chọn $x=a^2,\ y=b^2,\ z=c^2$ để vế trái bậc bốn thành tổng các bình phương và vế phải thành $a^2b^2+b^2c^2+c^2a^2$.

**Bước 2.** Áp dụng lần nữa với $x=ab,\ y=bc,\ z=ca$ để mỗi tích $xy,\ yz,\ zx$ tách ra thừa số chung $abc$ cần có.

**Bước 3.** Ở ý b, chọn $x=a^4,\ y=b^4,\ z=c^4$ rồi $x=a^2b^2,\ y=b^2c^2,\ z=c^2a^2$ để đưa vế trái về $a^2b^2c^2(a^2+b^2+c^2)$.

**Bước 4.** Chặn $a^2+b^2+c^2$ bằng $ab+bc+ca$ và nhớ nhân với số không âm $a^2b^2c^2$ nên chiều bất đẳng thức giữ nguyên.

**Phần 2. Trình bày**

Với mọi số thực $x,y,z$ ta có bất đẳng thức (1): $x^2+y^2+z^2\ge xy+yz+zx$, vì $2(x^2+y^2+z^2-xy-yz-zx)=(x-y)^2+(y-z)^2+(z-x)^2\ge0$.

a) Áp dụng (1) với $x=a^2,\ y=b^2,\ z=c^2$: $a^4+b^4+c^4\ge a^2b^2+b^2c^2+c^2a^2$.

Áp dụng (1) với $x=ab,\ y=bc,\ z=ca$: $a^2b^2+b^2c^2+c^2a^2\ge (ab)(bc)+(bc)(ca)+(ca)(ab)=abc(a+b+c)$.

Suy ra $a^4+b^4+c^4\ge abc(a+b+c)$. Dấu "=" xảy ra khi $a=b=c$.

b) Áp dụng (1) với $x=a^4,\ y=b^4,\ z=c^4$: $a^8+b^8+c^8\ge a^4b^4+b^4c^4+c^4a^4$.

Áp dụng (1) với $x=a^2b^2,\ y=b^2c^2,\ z=c^2a^2$: $a^4b^4+b^4c^4+c^4a^4\ge a^2b^4c^2+b^2c^4a^2+c^2a^4b^2=a^2b^2c^2(a^2+b^2+c^2)$.

Theo (1) với $x=a,\ y=b,\ z=c$ có $a^2+b^2+c^2\ge ab+bc+ca$; nhân hai vế với $a^2b^2c^2\ge0$: $a^2b^2c^2(a^2+b^2+c^2)\ge a^2b^2c^2(ab+bc+ca)$.

Vậy $a^8+b^8+c^8\ge a^2b^2c^2(ab+bc+ca)$. Dấu "=" xảy ra khi $a=b=c$.

=== V2B.360@p47
- bai: 360 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách bình phương (a − b/2)² + 3b²/4 · đặt ẩn phụ m = a(a+b+c), n = bc
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý a, b, c: không bộ nào vi phạm. Sách ý a có ba cách; ý b ghi "giải tương tự câu a".
## DE
Chứng minh các bất đẳng thức: a) $a^2+b^2\ge ab$; b) $x^2+xy+y^2\ge0$; c) $a(a+b)(a+c)(a+b+c)+b^2c^2\ge0$.
## SACH
a) Cách 1. $a^2+b^2-ab=\left(a-\dfrac{b}{2}\right)^2+\dfrac{3b^2}{4}\ge0$.

Cách 2. $a^2+b^2-ab\ge0\Leftrightarrow2a^2+2b^2-2ab\ge0\Leftrightarrow(a-b)^2+a^2+b^2\ge0$.

Cách 3. Ta có $a^2+b^2\ge2ab,\ a^2+b^2\ge0$. Cộng từng vế hai bất đẳng thức trên rồi chia cho 2.

b) Giải tương tự câu a.

c) $A=a(a+b)(a+c)(a+b+c)+b^2c^2=(a^2+ab+ac)(a^2+ab+ac+bc)+b^2c^2$.

Đặt $a^2+ab+ac=m,\ bc=n$ thì $A=m(m+n)+n^2=m^2+mn+n^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả ba ý đều quy về tam thức dạng $p^2-pq+q^2$ hoặc $p^2+pq+q^2$; tách ra một bình phương đầy đủ thì phần còn lại là $\dfrac34q^2$ nên cả biểu thức không âm với mọi số thực.

**Bước 1.** Ở ý a, viết $a^2-ab+b^2$ thành bình phương của một hiệu cộng $\dfrac34b^2$ bằng cách thêm bớt $\dfrac{b^2}{4}$ để nhận ra tổng không âm.

**Bước 2.** Ở ý b, làm tương tự nhưng với bình phương của một tổng vì dấu của $xy$ là dương.

**Bước 3.** Ở ý c, nhận ra $a(a+b+c)$ và $(a+b)(a+c)$ hơn kém nhau đúng $bc$ nên đặt hai ẩn phụ $m,n$ để bài toán quy về ý b.

**Phần 2. Trình bày**

a) $a^2+b^2-ab=\left(a-\dfrac b2\right)^2+\dfrac{3b^2}{4}\ge0$ với mọi số thực $a,b$. Dấu "=" xảy ra khi $a=b=0$.

b) $x^2+xy+y^2=\left(x+\dfrac y2\right)^2+\dfrac{3y^2}{4}\ge0$ với mọi số thực $x,y$. Dấu "=" xảy ra khi $x=y=0$.

c) Ta có $a(a+b+c)=a^2+ab+ac$ và $(a+b)(a+c)=a^2+ab+ac+bc$.

Đặt $m=a^2+ab+ac,\ n=bc$ thì $a(a+b)(a+c)(a+b+c)+b^2c^2=m(m+n)+n^2=m^2+mn+n^2$.

Theo ý b với $x=m,\ y=n$: $m^2+mn+n^2=\left(m+\dfrac n2\right)^2+\dfrac{3n^2}{4}\ge0$.

Vậy $a(a+b)(a+c)(a+b+c)+b^2c^2\ge0$. Dấu "=" xảy ra khi $bc=0$ và $a(a+b+c)=0$.

=== V2B.361@p47
- bai: 361 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: xét hiệu hai vế · phân tích nhân tử
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý: không bộ nào vi phạm. Sách chỉ ghi dạng biến đổi tương đương; lời giải kho viết đủ.
## DE
Chứng minh các bất đẳng thức: a) $(a^2+b^2)(a^4+b^4)\ge(a^3+b^3)^2$; b) $(a+b)(a^3+b^3)\le2(a^4+b^4)$.
## SACH
a) Biến đổi tương đương thành $a^2b^2(a-b)^2\ge0$.

b) Biến đổi tương đương thành $0\le(a-b)^2(a^2+ab+b^2)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế đều là đa thức bậc sáu hoặc bậc bốn mà hiệu của chúng phân tích được thành tích của các bình phương và tam thức không âm, nên xét hiệu hai vế là hướng gọn nhất.

**Bước 1.** Ở ý a, khai triển hai vế rồi trừ nhau để các hạng tử $a^6$ và $b^6$ triệt tiêu, chỉ còn các hạng tử chứa $a^2b^2$ ở dạng chung.

**Bước 2.** Nhóm phần còn lại thành $a^2b^2$ nhân với một bình phương hoàn chỉnh để thấy ngay dấu.

**Bước 3.** Ở ý b, lấy $2(a^4+b^4)-(a+b)(a^3+b^3)$ rồi đặt nhân tử chung $(a-b)$ hai lần để đưa về $(a-b)^2$ nhân với một tam thức không âm.

**Phần 2. Trình bày**

a) $(a^2+b^2)(a^4+b^4)-(a^3+b^3)^2=a^6+a^2b^4+a^4b^2+b^6-a^6-2a^3b^3-b^6$

$=a^2b^4+a^4b^2-2a^3b^3=a^2b^2(b^2+a^2-2ab)=a^2b^2(a-b)^2\ge0$.

Vậy $(a^2+b^2)(a^4+b^4)\ge(a^3+b^3)^2$. Dấu "=" xảy ra khi $a=b$ hoặc $ab=0$.

b) $2(a^4+b^4)-(a+b)(a^3+b^3)=2a^4+2b^4-a^4-ab^3-a^3b-b^4=a^4+b^4-a^3b-ab^3$

$=a^3(a-b)-b^3(a-b)=(a-b)(a^3-b^3)=(a-b)^2(a^2+ab+b^2)$.

Vì $a^2+ab+b^2=\left(a+\dfrac b2\right)^2+\dfrac{3b^2}{4}\ge0$ nên hiệu trên không âm.

Vậy $(a+b)(a^3+b^3)\le2(a^4+b^4)$. Dấu "=" xảy ra khi $a=b$.

=== V2B.362@p47
- bai: 362 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu hai vế · $a^3+b^3=(a+b)(a^2-ab+b^2)$ · chia hai vế cho số dương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ a,b>0 cho từng ý: không bộ nào vi phạm. Sách ý b in "-(a+b)" trong ngoặc vuông, đúng ra là "-(a+b)^2" (kết quả cuối 3(a+b)(a-b)^2 vẫn đúng); lời giải kho viết bản đúng.
## DE
Chứng minh các bất đẳng thức với $a,b>0$: a) $2(a^3+b^3)\ge(a+b)(a^2+b^2)$; b) $4(a^3+b^3)\ge(a+b)^3$.
## SACH
a) Chia hai vế cho số dương $a+b$. Biến đổi tương đương thành $(a-b)^2\ge0$.

b) Hiệu: $4(a^3+b^3)-(a+b)^3=(a+b)[4(a^2-ab+b^2)-(a+b)]$

$=3(a+b)(a-b)^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai vế đều chứa $a^3+b^3$ hoặc $(a+b)^3$ nên đều có nhân tử chung $a+b$ (dương); tách nhân tử chung đó ra thì phần còn lại là một tam thức bậc hai dễ xét.

**Bước 1.** Phân tích $a^3+b^3$ thành $(a+b)(a^2-ab+b^2)$ để cả hai vế có thừa số chung $a+b$.

**Bước 2.** Ở ý a, vì $a+b>0$ nên chia hai vế cho $a+b$ mà không đổi chiều, rồi chuyển vế để được hiệu của các bình phương.

**Bước 3.** Ở ý b, xét hiệu hai vế, đặt $a+b$ làm nhân tử chung rồi rút gọn phần trong ngoặc về $3(a-b)^2$.

**Phần 2. Trình bày**

a) Vì $a+b>0$ và $a^3+b^3=(a+b)(a^2-ab+b^2)$, bất đẳng thức tương đương với $2(a^2-ab+b^2)\ge a^2+b^2$ (chia hai vế cho $a+b>0$)

$\Leftrightarrow a^2-2ab+b^2\ge0\Leftrightarrow(a-b)^2\ge0$ (đúng).

Dấu "=" xảy ra khi $a=b$.

b) $4(a^3+b^3)-(a+b)^3=(a+b)\left[4(a^2-ab+b^2)-(a+b)^2\right]$

$=(a+b)(3a^2-6ab+3b^2)=3(a+b)(a-b)^2\ge0$ (vì $a+b>0$).

Vậy $4(a^3+b^3)\ge(a+b)^3$. Dấu "=" xảy ra khi $a=b$.

=== V2B.363@p47
- bai: 363 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu hai vế · phân tích nhân tử $a^3+b^3$
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ a,b,c>0: không bộ nào vi phạm.
## DE
Chứng minh rằng $a^3+b^3+abc\ge ab(a+b+c)$ với $a,b,c>0$.
## SACH
Hiệu: $a^3+b^3+abc-ab(a+b+c)=(a+b)(a-b)^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hạng tử $abc$ xuất hiện ở cả hai vế nên khi xét hiệu nó tự triệt tiêu, chỉ còn $a^3+b^3-ab(a+b)$ là biểu thức hai biến có thể phân tích nhân tử.

**Bước 1.** Xét hiệu của vế trái và vế phải rồi khai triển $ab(a+b+c)$ để thấy $abc$ bị triệt tiêu.

**Bước 2.** Nhóm $a^3-a^2b$ và $b^3-ab^2$ để đặt nhân tử chung, hoặc dùng hằng đẳng thức tổng hai lập phương, nhằm tách được thừa số $a+b$.

**Bước 3.** Quan sát phần còn lại thành bình phương $(a-b)^2$ rồi dùng điều kiện $a+b>0$ để kết luận dấu của tích.

**Phần 2. Trình bày**

$a^3+b^3+abc-ab(a+b+c)=a^3+b^3-a^2b-ab^2$

$=a^2(a-b)-b^2(a-b)=(a-b)(a^2-b^2)=(a+b)(a-b)^2\ge0$ (vì $a+b>0$).

Vậy $a^3+b^3+abc\ge ab(a+b+c)$. Dấu "=" xảy ra khi $a=b$.

=== V2B.364@p47
- bai: 364 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ dùng hai lần · xét hiệu hai vế
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý: không bộ nào vi phạm.
## DE
Chứng minh các bất đẳng thức: a) $8(a^4+b^4)\ge(a+b)^4$; b) $(a^2+b^2)^2\ge ab(a+b)^2$.
## SACH
a) Từ $a^4+b^4\ge2a^2b^2$, cộng $a^4+b^4$ vào hai vế được:

$a^4+b^4\ge\dfrac{1}{2}(a^2+b^2)^2$.

Tương tự $a^2+b^2\ge\dfrac{1}{2}(a+b)^2$. Từ đó suy ra $a^4+b^4\ge\dfrac{1}{8}(a+b)^4$.

b) Xét hiệu $(a^2+b^2)^2-ab(a+b)^2$ được

$a^4-a^3b+b^4-ab^3=a^3(a-b)-b^3(a-b)=(a-b)^2(a^2+ab+b^2)\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ý a có bậc bốn nên ta hạ bậc hai lần bằng cùng một bất đẳng thức $x^2+y^2\ge\dfrac{(x+y)^2}{2}$ (đúng với mọi $x,y$), còn ý b là hiệu của hai đa thức bậc bốn thuần nhất nên phân tích được thành tích.

**Bước 1.** Ở ý a, chứng minh $a^4+b^4\ge\dfrac12(a^2+b^2)^2$ bằng cách cộng $a^4+b^4$ vào hai vế của bất đẳng thức $a^4+b^4\ge2a^2b^2$.

**Bước 2.** Chứng minh tương tự $a^2+b^2\ge\dfrac12(a+b)^2$, rồi bình phương hai vế (cả hai vế đều không âm) để nối hai bất đẳng thức lại thành một chuỗi.

**Bước 3.** Ở ý b, xét hiệu hai vế, khai triển và nhóm các hạng tử để đặt $a-b$ làm nhân tử chung hai lần.

**Phần 2. Trình bày**

a) Từ $a^4+b^4\ge2a^2b^2$ (vì $(a^2-b^2)^2\ge0$), cộng $a^4+b^4$ vào hai vế: $2(a^4+b^4)\ge(a^2+b^2)^2$, tức $a^4+b^4\ge\dfrac12(a^2+b^2)^2$.

Từ $(a-b)^2\ge0$ suy ra $2(a^2+b^2)\ge(a+b)^2$, tức $a^2+b^2\ge\dfrac12(a+b)^2\ge0$. Bình phương hai vế không âm: $(a^2+b^2)^2\ge\dfrac14(a+b)^4$.

Do đó $a^4+b^4\ge\dfrac12\cdot\dfrac14(a+b)^4=\dfrac18(a+b)^4$, tức $8(a^4+b^4)\ge(a+b)^4$. Dấu "=" xảy ra khi $a=b$.

b) $(a^2+b^2)^2-ab(a+b)^2=a^4+2a^2b^2+b^4-a^3b-2a^2b^2-ab^3=a^4-a^3b+b^4-ab^3$

$=a^3(a-b)-b^3(a-b)=(a-b)(a^3-b^3)=(a-b)^2(a^2+ab+b^2)$.

Vì $a^2+ab+b^2=\left(a+\dfrac b2\right)^2+\dfrac{3b^2}{4}\ge0$ nên hiệu không âm, suy ra $(a^2+b^2)^2\ge ab(a+b)^2$. Dấu "=" xảy ra khi $a=b$.

=== V2B.365@p47
- bai: 365 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách thành tổng các bình phương · nhân hai vế với hằng số dương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý: không bộ nào vi phạm.
## DE
Chứng minh các bất đẳng thức: a) $a^2+b^2+c^2\ge a(b+c)$; b) $a^2+b^2+c^2+d^2\ge a(b+c+d)$.
## SACH
a) $a^2+b^2+c^2\ge a(b+c)\Leftrightarrow2a^2+2b^2+2c^2\ge2ab+2ac$

$\Leftrightarrow(a-b)^2+(a-c)^2+b^2+c^2\ge0$.

b) $a^2+b^2+c^2+d^2\ge ab+ac+ad$

$\Leftrightarrow4a^2+4b^2+4c^2+4d^2\ge4ab+4ac+4ad$

$\Leftrightarrow(a-2b)^2+(a-2c)^2+(a-2d)^2+a^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ở vế phải, biến $a$ nhân với tổng các biến còn lại; chia $a^2$ đều cho các tích đó rồi ghép từng cặp $a^2$ với $b^2$ (hoặc $c^2$, $d^2$) thành bình phương của một hiệu có hệ số thích hợp.

**Bước 1.** Ở ý a, chuyển về một vế và nhân đôi để mỗi tích $2ab$ và $2ac$ có một bình phương $(a-b)^2$, $(a-c)^2$ tương ứng.

**Bước 2.** Ở ý b, có ba tích $ab,\ ac,\ ad$ nên chia $a^2$ thành bốn phần; nhân hai vế với $4$ để mỗi tích $4ab$ ghép với $a^2$ và $4b^2$ thành $(a-2b)^2$.

**Bước 3.** Kiểm tra phần $a^2$ dư và kết luận tổng các bình phương không âm, đồng thời tìm điều kiện dấu "=".

**Phần 2. Trình bày**

a) $a^2+b^2+c^2-a(b+c)=\dfrac12\left[2a^2+2b^2+2c^2-2ab-2ac\right]=\dfrac12\left[(a-b)^2+(a-c)^2+b^2+c^2\right]\ge0$.

Dấu "=" xảy ra khi $b=c=0$ và $a=b=c$, tức $a=b=c=0$.

b) $a^2+b^2+c^2+d^2-a(b+c+d)=\dfrac14\left[4a^2+4b^2+4c^2+4d^2-4ab-4ac-4ad\right]$

$=\dfrac14\left[(a-2b)^2+(a-2c)^2+(a-2d)^2+a^2\right]\ge0$.

Dấu "=" xảy ra khi $a=0$ rồi $b=c=d=0$.

=== V2B.366@p47
- bai: 366 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách thành tổng hai bình phương · hai bình phương không đồng thời bằng $0$
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị x trong [-3,3]: min ý a = 2 (tại x=1), min ý b khoảng 0,0275 (tại x khoảng 0,63), đều dương. Sách in sai ở lời giải ý a: viết "x^2 - 4x + 5 > 0" ở dòng cuối, đúng ra là x^4 - 4x + 5 > 0 (chép đúng bản in).
## DE
Chứng minh rằng: a) $x^4-4x+5>0$; b) $x^4-x+\dfrac{1}{2}>0$.
## SACH
a) $x^4-4x+5=x^4-4x^2+4+4x^2-4x+1=(x^2-2)^2+(2x-1)^2\ge0$.

Không xảy ra đẳng thức. Do đó $x^2-4x+5>0$.

b) $x^4-x+\dfrac{1}{2}=x^4-x^2+\dfrac{1}{4}+x^2-x+\dfrac{1}{4}=\left(x^2-\dfrac{1}{2}\right)^2+\left(x-\dfrac{1}{2}\right)^2\ge0$.

Không xảy ra đẳng thức, do đó $x^4-x+\dfrac{1}{2}>0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc bốn thiếu hạng tử $x^3$ gợi ý tách thành bình phương của một đa thức bậc hai cộng bình phương của một đa thức bậc nhất; muốn có dấu "$>$" thì phải chứng tỏ hai bình phương không thể cùng bằng $0$.

**Bước 1.** Ở ý a, tách $-4x$ bằng cách thêm bớt $4x^2$ và các hằng số để nhận ra $(x^2-2)^2$ chứa $x^4$ và hằng số $4$, phần còn lại là $(2x-1)^2$.

**Bước 2.** Ở ý b, làm tương tự: dùng $x^2$ và các hằng số $\dfrac14$ để nhận ra $\left(x^2-\dfrac12\right)^2$ và $\left(x-\dfrac12\right)^2$.

**Bước 3.** Chứng tỏ hai bình phương trong mỗi ý không đồng thời bằng $0$ bằng cách xét hai điều kiện triệt tiêu mâu thuẫn nhau, từ đó mới có dấu "$>$".

**Phần 2. Trình bày**

a) $x^4-4x+5=(x^4-4x^2+4)+(4x^2-4x+1)=(x^2-2)^2+(2x-1)^2\ge0$.

Dấu "=" chỉ xảy ra khi $x^2=2$ và $x=\dfrac12$; hai điều kiện này mâu thuẫn (với $x=\dfrac12$ thì $x^2=\dfrac14\ne2$). Vậy không xảy ra dấu "=" và $x^4-4x+5>0$.

b) $x^4-x+\dfrac12=\left(x^4-x^2+\dfrac14\right)+\left(x^2-x+\dfrac14\right)=\left(x^2-\dfrac12\right)^2+\left(x-\dfrac12\right)^2\ge0$.

Dấu "=" chỉ xảy ra khi $x^2=\dfrac12$ và $x=\dfrac12$; mâu thuẫn vì $x=\dfrac12$ cho $x^2=\dfrac14\ne\dfrac12$. Vậy $x^4-x+\dfrac12>0$.

=== V2B.367@p47
- bai: 367 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách thành tổng các bình phương · xét hiệu hai vế
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực cho từng ý: không bộ nào vi phạm.
## DE
Chứng minh các bất đẳng thức: a) $a^2+b^2+c^2+\dfrac{3}{4}\ge a+b+c$; b) $a^4+b^4+2\ge4ab$.
## SACH
a) $\left(a^2+b^2+c^2+\dfrac{3}{4}\right)-(a+b+c)$

$=\left(a^2-a+\dfrac{1}{4}\right)+\left(b^2-b+\dfrac{1}{4}\right)+\left(c^2-c+\dfrac{1}{4}\right)$

$=\left(a-\dfrac{1}{2}\right)^2+\left(b-\dfrac{1}{2}\right)^2+\left(c-\dfrac{1}{2}\right)^2\ge0$.

b) $a^4+b^4+2-4ab=a^4+b^4-2a^2b^2+2a^2b^2-4ab+2$

$=(a^2-b^2)^2+2(ab-1)^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hằng số $\dfrac34$ chia đều thành ba phần $\dfrac14$ để mỗi biến có một tam thức $x^2-x+\dfrac14$ là bình phương đủ; còn ở ý b thì hạng tử $a^4+b^4$ gợi ra $(a^2-b^2)^2$ và phần dư $2a^2b^2-4ab+2$ lại là hai lần một bình phương.

**Bước 1.** Ở ý a, chuyển vế rồi tách $\dfrac34$ thành ba số $\dfrac14$, ghép mỗi số với một cặp $x^2-x$ để thành bình phương của $x-\dfrac12$.

**Bước 2.** Ở ý b, thêm bớt $2a^2b^2$ để tách $a^4+b^4-2a^2b^2$ thành $(a^2-b^2)^2$, phần còn lại gồm các hạng tử có $ab$.

**Bước 3.** Nhóm $2a^2b^2-4ab+2$ thành $2(ab-1)^2$ rồi nêu điều kiện dấu "=" cho từng bình phương.

**Phần 2. Trình bày**

a) $a^2+b^2+c^2+\dfrac34-(a+b+c)=\left(a^2-a+\dfrac14\right)+\left(b^2-b+\dfrac14\right)+\left(c^2-c+\dfrac14\right)$

$=\left(a-\dfrac12\right)^2+\left(b-\dfrac12\right)^2+\left(c-\dfrac12\right)^2\ge0$. Dấu "=" xảy ra khi $a=b=c=\dfrac12$.

b) $a^4+b^4+2-4ab=(a^4-2a^2b^2+b^4)+(2a^2b^2-4ab+2)=(a^2-b^2)^2+2(ab-1)^2\ge0$.

Dấu "=" xảy ra khi $a^2=b^2$ và $ab=1$, tức $a=b=1$ hoặc $a=b=-1$.

=== V2B.368@p47
- bai: 368 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách thành x(x − 2)² + x² + 1 · điều kiện x ≥ 0
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị x trong [0,6]: hiệu nhỏ nhất khoảng 1 (đạt gần x=0), không vi phạm.
## DE
Chứng minh rằng $x^3+4x+1>3x^2$ với $x\ge0$.
## SACH
$x^3+4x+1-3x^2=x(x-2)^2+x^2+1>0$ (vì $x\ge0$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bài cho điều kiện $x\ge0$ nên có thể dùng nhân tử $x$ mang dấu không âm: ba hạng tử $x^3-4x^2+4x$ ghép lại thành $x$ nhân một bình phương, phần còn dư là $x^2+1$ luôn dương.

**Bước 1.** Chuyển $3x^2$ sang vế trái để xét hiệu của hai vế, đa thức bậc ba $x^3-3x^2+4x+1$.

**Bước 2.** Tách $-3x^2$ thành $-4x^2+x^2$ để $x^3-4x^2+4x$ đặt được nhân tử chung $x$ và còn lại bình phương $(x-2)^2$.

**Bước 3.** Dùng điều kiện $x\ge0$ để kết luận tích $x(x-2)^2$ không âm, cộng với $x^2+1>0$ thì cả hiệu dương.

**Phần 2. Trình bày**

$x^3+4x+1-3x^2=(x^3-4x^2+4x)+x^2+1=x(x-2)^2+x^2+1$.

Vì $x\ge0$ nên $x(x-2)^2\ge0$; lại có $x^2+1\ge1>0$. Do đó $x^3+4x+1-3x^2>0$.

Vậy $x^3+4x+1>3x^2$ với $x\ge0$.

=== V2B.369@p47
- bai: 369 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ (ghép hai cặp nhân tử có cùng phần $x^2-7x$) · bình phương của một tổng ba số
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ cho từng ý: không bộ nào vi phạm. Ý b có dấu *.
## DE
Chứng minh các bất đẳng thức: a) $(x-1)(x-3)(x-4)(x-6)+9\ge0$; b) $a^2+4b^2+4c^2\ge4ab-4ac+8bc$.
## SACH
a) $(x-1)(x-3)(x-4)(x-6)+9=(x^2-7x+6)(x^2-7x+12)+9$.

Đặt $x^2-7x+9=a$, biểu thức trên bằng:

$(a-3)(a+3)+9=a^2\ge0$.

b) $(a^2+4b^2+4c^2)-(4ab-4ac+8bc)=$

$=(a^2-4ab+4b^2)+4c^2+(4ac-8bc)$

$=(a-2b)^2+4c^2+4c(a-2b)$

$=(a-2b+2c)^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ở ý a, bốn nhân tử bậc nhất có tổng hai số đầu cuối $1+6$ bằng tổng hai số giữa $3+4$ nên ghép $(x-1)(x-6)$ và $(x-3)(x-4)$ thì cùng chứa $x^2-7x$, đổi biến một lần là bậc hai; ở ý b, hệ số $4b^2,\ 4c^2$ là $(2b)^2,\ (2c)^2$ gợi ra bình phương của tổng ba số.

**Bước 1.** Ở ý a, nhân hai cặp nhân tử đã ghép để hai tam thức có cùng phần $x^2-7x$, rồi đặt biến mới là trung bình của hai tam thức đó.

**Bước 2.** Viết tích hai tam thức qua biến mới thành hiệu hai bình phương cộng $9$ để thấy một bình phương hoàn chỉnh.

**Bước 3.** Ở ý b, chuyển vế rồi đối chiếu với khai triển $(a-2b+2c)^2$ nhờ các tích $-4ab,\ +4ac,\ -8bc$ để đoán dấu của từng số hạng trong ngoặc.

**Chú ý:** Ý a có dấu "=" xảy ra (khi biến mới bằng $0$) nên chỉ được kết luận $\ge0$, không phải $>0$.

**Phần 2. Trình bày**

a) $(x-1)(x-6)=x^2-7x+6$ và $(x-3)(x-4)=x^2-7x+12$. Đặt $t=x^2-7x+9$ thì

$(x-1)(x-3)(x-4)(x-6)+9=(t-3)(t+3)+9=t^2-9+9=t^2\ge0$.

Dấu "=" xảy ra khi $x^2-7x+9=0$.

b) $a^2+4b^2+4c^2-(4ab-4ac+8bc)=a^2+(2b)^2+(2c)^2-2a(2b)+2a(2c)-2(2b)(2c)$

$=(a-2b+2c)^2\ge0$.

Vậy $a^2+4b^2+4c^2\ge4ab-4ac+8bc$. Dấu "=" xảy ra khi $a=2b-2c$.

=== V2B.370@p47
- bai: 370 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: (x + y)² ≥ 4xy · đổi biến x = a + c, y = b + d
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực a,b,c,d: không bộ nào vi phạm.
## DE
Chứng minh rằng $\left(\dfrac{a+b}{2}+\dfrac{c+d}{2}\right)^2\ge(a+c)(b+d)$.
## SACH
Áp dụng bất đẳng thức $(x+y)^2\ge4xy$ ta được:

$\left(\dfrac{a+b}{2}+\dfrac{c+d}{2}\right)^2=\dfrac{[(a+c)+(b+d)]^2}{4}\ge(a+c)(b+d)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải là tích của hai tổng $(a+c)$ và $(b+d)$, còn vế trái sau khi quy đồng là bình phương của tổng đúng hai tổng ấy chia cho $4$, đúng dạng $\dfrac{(x+y)^2}{4}\ge xy$.

**Bước 1.** Cộng hai phân số ở vế trái để đưa vế trái về bình phương của một biểu thức chia cho hai.

**Bước 2.** Sắp lại tử số thành tổng của hai nhóm $(a+c)$ và $(b+d)$, rồi đặt tên hai nhóm đó là hai biến mới $x,y$.

**Bước 3.** Áp dụng bất đẳng thức $(x+y)^2\ge4xy$ (tức $(x-y)^2\ge0$) và chia hai vế cho $4$ để so với vế phải.

**Phần 2. Trình bày**

Đặt $x=a+c,\ y=b+d$. Khi đó $\dfrac{a+b}{2}+\dfrac{c+d}{2}=\dfrac{a+b+c+d}{2}=\dfrac{x+y}{2}$.

Vì $(x-y)^2\ge0$ nên $(x+y)^2\ge4xy$, suy ra $\left(\dfrac{x+y}{2}\right)^2=\dfrac{(x+y)^2}{4}\ge xy$.

Vậy $\left(\dfrac{a+b}{2}+\dfrac{c+d}{2}\right)^2\ge(a+c)(b+d)$. Dấu "=" xảy ra khi $a+c=b+d$.

=== V2B.371@p47
- bai: 371 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: $4x^3+4y^3\ge(x+y)^3$ với $x,y>0$ · $(a+b+c)^3-a^3-b^3-c^3=3(a+b)(b+c)(c+a)$ · $(a+b)(b+c)(c+a)\ge8abc$ với $a,b,c\ge0$
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 bộ cho từng ý (a,b,c>0 ý a; a,b,c>=0 ý b): không bộ nào vi phạm. Sách ý a viện dẫn "bài 363b" (đúng ra là bài 362b) và ý b để "bạn đọc tự biến đổi"; lời giải kho viết đủ và tự đủ (không viện dẫn), ý b theo hướng sách nhưng qua đẳng thức tổng ba lập phương.
## DE
Chứng minh các bất đẳng thức: a) $8(a^3+b^3+c^3)\ge(a+b)^3+(b+c)^3+(c+a)^3$ với $a,b,c>0$; b) $(a+b+c)^3\ge a^3+b^3+c^3+24abc$ với $a,b,c\ge0$.
## SACH
a) Áp dụng bất đẳng thức $4x^3+4y^3\ge(x+y)^3$ với $x,y>0$ (bài 363b), ta được: $4a^3+4b^3\ge(a+b)^3,\ 4b^3+4c^3\ge(b+c)^3,\ 4c^3+4a^3\ge(c+a)^3$. Cộng từng vế ba bất đẳng thức trên.

b) $(a+b+c)^3\ge a^3+b^3+c^3+24abc$

$\Leftrightarrow(a+b)(ab+bc+ca+c^2)\ge8abc$ (bạn đọc tự biến đổi)

$\Leftrightarrow a^2b+a^2c+ac^2+ab^2+b^2c+bc^2-6abc\ge0$ (bạn đọc tự biến đổi)

$\Leftrightarrow(a^2b+bc^2-2abc)+(a^2c+b^2c-2abc)+(ac^2+ab^2-2abc)\ge0$

$\Leftrightarrow b(a-c)^2+c(a-b)^2+a(b-c)^2\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ý a là bài $4x^3+4y^3\ge(x+y)^3$ áp dụng cho từng cặp rồi cộng; ý b có vế phải chứa $a^3+b^3+c^3$ nên chuyển sang vế trái để dùng đẳng thức $(a+b+c)^3-a^3-b^3-c^3=3(a+b)(b+c)(c+a)$ đưa về bất đẳng thức tích.

**Bước 1.** Ở ý a, chứng minh trước $4x^3+4y^3\ge(x+y)^3$ với $x,y>0$ bằng cách xét hiệu và đặt nhân tử chung $x+y$.

**Bước 2.** Áp dụng bất đẳng thức đó cho ba cặp $(a,b),\ (b,c),\ (c,a)$ rồi cộng ba bất đẳng thức cùng chiều để vế trái ra đúng $8(a^3+b^3+c^3)$.

**Bước 3.** Ở ý b, dùng đẳng thức tổng ba lập phương để quy bất đẳng thức về $(a+b)(b+c)(c+a)\ge8abc$.

**Bước 4.** Xét hiệu $(a+b)(b+c)(c+a)-8abc$, khai triển rồi nhóm theo từng cặp để nhận ra tổng các tích của số không âm với bình phương.

**Phần 2. Trình bày**

a) Với $x,y>0$: $4x^3+4y^3-(x+y)^3=(x+y)\left[4(x^2-xy+y^2)-(x+y)^2\right]=3(x+y)(x-y)^2\ge0$.

Áp dụng cho $(a,b),\ (b,c),\ (c,a)$: $4a^3+4b^3\ge(a+b)^3,\ 4b^3+4c^3\ge(b+c)^3,\ 4c^3+4a^3\ge(c+a)^3$.

Cộng vế với vế: $8(a^3+b^3+c^3)\ge(a+b)^3+(b+c)^3+(c+a)^3$. Dấu "=" xảy ra khi $a=b=c$.

b) Ta có $(a+b+c)^3-a^3-b^3-c^3=3(a+b)(b+c)(c+a)$, nên bất đẳng thức tương đương với $3(a+b)(b+c)(c+a)\ge24abc$, tức $(a+b)(b+c)(c+a)\ge8abc$.

$(a+b)(b+c)(c+a)-8abc=a^2b+a^2c+ab^2+b^2c+ac^2+bc^2-6abc$

$=a(b^2-2bc+c^2)+b(c^2-2ca+a^2)+c(a^2-2ab+b^2)$

$=a(b-c)^2+b(c-a)^2+c(a-b)^2\ge0$ (vì $a,b,c\ge0$).

Vậy $(a+b+c)^3\ge a^3+b^3+c^3+24abc$. Dấu "=" xảy ra khi $a=b=c$ hoặc có hai trong ba số bằng $0$.

=== V2B.372@p47
- bai: 372 · y: - · trang: 47 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bình phương của tổng ba số · tổng các bình phương không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b ngẫu nhiên, c=-a-b): không bộ nào vi phạm; dấu "=" tại a=b=c=0.
## DE
Cho $a+b+c=0$. Chứng minh rằng $ab+bc+ca\le0$.
## SACH
$a+b+c=0\Rightarrow(a+b+c)^2=0\Rightarrow a^2+b^2+c^2+2(ab+bc+ca)=0$

$\Rightarrow ab+bc+ca\le0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức $ab+bc+ca$ xuất hiện khi khai triển bình phương của tổng $a+b+c$, mà tổng này bằng $0$ nên liên hệ trực tiếp giữa $ab+bc+ca$ và $a^2+b^2+c^2$.

**Bước 1.** Bình phương hai vế của điều kiện $a+b+c=0$ để có một đẳng thức chứa cả $a^2+b^2+c^2$ lẫn $ab+bc+ca$.

**Bước 2.** Rút $ab+bc+ca$ theo $a^2+b^2+c^2$ từ đẳng thức vừa được.

**Bước 3.** Dùng $a^2+b^2+c^2\ge0$ để xác định dấu của $ab+bc+ca$ và tìm khi nào xảy ra dấu "=".

**Phần 2. Trình bày**

Vì $a+b+c=0$ nên $(a+b+c)^2=0$, tức $a^2+b^2+c^2+2(ab+bc+ca)=0$.

Suy ra $ab+bc+ca=-\dfrac{a^2+b^2+c^2}{2}\le0$ (vì $a^2+b^2+c^2\ge0$).

Dấu "=" xảy ra khi $a=b=c=0$.

Vậy $ab+bc+ca\le0$.

=== V2B.373@p48
- bai: 373 · y: - · trang: 48 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác · đổi biến x = b + c − a, y = c + a − b, z = a + b − c · u/v + v/u ≥ 2 (u, v > 0) · làm giảm mẫu
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c ba cạnh tam giác): không bộ nào vi phạm ý a, b; ý c: cả ba hiệu "tổng hai số trừ số thứ ba" đều dương (nhỏ nhất khoảng 0,067). Dấu "=" ý b tại a=b=c (tam giác đều).
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác. Chứng minh rằng: a) $a^2+b^2+c^2<2(ab+bc+ca)$; b) $\dfrac{a}{b+c-a}+\dfrac{b}{a+c-b}+\dfrac{c}{a+b-c}\ge3$; c) $\dfrac{1}{a+b},\ \dfrac{1}{b+c},\ \dfrac{1}{c+a}$ cũng là độ dài ba cạnh của một tam giác.
## SACH
a) Nhân hai vế của $a<b+c$ với số dương $a$, ta được $a^2<ab+ac$. Tương tự $b^2<ba+bc,\ c^2<ca+cb$. Cộng từng vế các bất đẳng thức trên.

b) Đặt $b+c-a=x,\ c+a-b=y,\ a+b-c=z$ thì $2a=y+z,\ 2b=x+z,\ 2c=x+y$. Ta có:

$\dfrac{2a}{b+c-a}+\dfrac{2b}{a+c-b}+\dfrac{2c}{a+b-c}=\dfrac{y+z}{x}+\dfrac{x+z}{y}+\dfrac{x+y}{z}=$

$=\left(\dfrac{y}{x}+\dfrac{x}{y}\right)+\left(\dfrac{z}{x}+\dfrac{x}{z}\right)+\left(\dfrac{z}{y}+\dfrac{y}{z}\right)\ge6$.

Suy ra điều phải chứng minh.

c) Ta có $a+b>c,\ b+c>a,\ a+c>b$.

Xét $\dfrac{1}{a+c}+\dfrac{1}{b+c}>\dfrac{1}{a+b+c}+\dfrac{1}{b+c+a}=\dfrac{2}{a+b+c}>$

$>\dfrac{2}{a+b+a+b}=\dfrac{1}{a+b}$.

Tương tự $\dfrac{1}{a+b}+\dfrac{1}{a+c}>\dfrac{1}{b+c},\ \dfrac{1}{a+b}+\dfrac{1}{b+c}>\dfrac{1}{a+c}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mọi ý đều bắt nguồn từ bất đẳng thức tam giác $a<b+c$ (và hai bất đẳng thức tương tự): ý a nhân với từng cạnh rồi cộng, ý b đặt ba hiệu $b+c-a,\ c+a-b,\ a+b-c$ làm biến mới nên mỗi cạnh là nửa tổng hai biến, còn ý c cần chứng minh ba bất đẳng thức tam giác cho ba số mới.

**Bước 1.** Ở ý a, nhân từng bất đẳng thức $a<b+c,\ b<c+a,\ c<a+b$ với cạnh dương tương ứng rồi cộng ba bất đẳng thức cùng chiều.

**Bước 2.** Ở ý b, đặt ba hiệu dương làm ba biến mới, biểu diễn $a,b,c$ qua chúng để mỗi phân thức thành dạng $\dfrac{y+z}{2x}$ có chung một cấu trúc.

**Bước 3.** Ghép các phân thức theo cặp nghịch đảo $\dfrac yx+\dfrac xy$ rồi áp dụng bất đẳng thức $\dfrac uv+\dfrac vu\ge2$ cho các số dương.

**Bước 4.** Ở ý c, tổng hai trong ba phân số phải lớn hơn phân số còn lại; làm giảm mẫu của hai phân số đầu bằng cách thêm vào mẫu cạnh còn thiếu, rồi dùng $c<a+b$ để so sánh.

**Phần 2. Trình bày**

a) Vì $a,b,c$ là ba cạnh của một tam giác nên $a<b+c,\ b<c+a,\ c<a+b$. Nhân lần lượt với $a,b,c>0$: $a^2<ab+ac,\ b^2<bc+ba,\ c^2<ca+cb$.

Cộng vế với vế: $a^2+b^2+c^2<2(ab+bc+ca)$.

b) Đặt $x=b+c-a,\ y=c+a-b,\ z=a+b-c$. Theo bất đẳng thức tam giác $x,y,z>0$, và $2a=y+z,\ 2b=x+z,\ 2c=x+y$.

$\dfrac{a}{b+c-a}+\dfrac{b}{a+c-b}+\dfrac{c}{a+b-c}=\dfrac{y+z}{2x}+\dfrac{x+z}{2y}+\dfrac{x+y}{2z}$

$=\dfrac12\left[\left(\dfrac yx+\dfrac xy\right)+\left(\dfrac zx+\dfrac xz\right)+\left(\dfrac zy+\dfrac yz\right)\right]$.

Với $u,v>0$ có $\dfrac uv+\dfrac vu-2=\dfrac{(u-v)^2}{uv}\ge0$ nên $\dfrac uv+\dfrac vu\ge2$. Do đó biểu thức trong ngoặc vuông $\ge6$, suy ra tổng $\ge\dfrac12\cdot6=3$.

Dấu "=" xảy ra khi $x=y=z$, tức $a=b=c$.

c) Ba số $\dfrac1{a+b},\ \dfrac1{b+c},\ \dfrac1{c+a}$ đều dương. Vì $a,b>0$ nên $a+c<a+b+c$ và $b+c<a+b+c$, suy ra $\dfrac1{a+c}+\dfrac1{b+c}>\dfrac2{a+b+c}$.

Vì $c<a+b$ nên $a+b+c<2(a+b)$, do đó $\dfrac2{a+b+c}>\dfrac2{2(a+b)}=\dfrac1{a+b}$. Vậy $\dfrac1{a+c}+\dfrac1{b+c}>\dfrac1{a+b}$.

Hoàn toàn tương tự (hoán vị $a,b,c$) ta có $\dfrac1{a+b}+\dfrac1{a+c}>\dfrac1{b+c}$ và $\dfrac1{a+b}+\dfrac1{b+c}>\dfrac1{a+c}$.

Ba số dương thỏa mãn bất đẳng thức tam giác nên là độ dài ba cạnh của một tam giác.

=== V2B.374@p48
- bai: 374 · y: - · trang: 48 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: (x + 1)² ≥ 4x · nhân các bất đẳng thức cùng chiều (hai vế không âm) · khai căn hai vế không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ cho từng ý (ý a: abc=1, a,b>0; ý b: a,b>=0): không bộ nào vi phạm. Dấu "=" ý a tại a=b=c=1; ý b tại a=b=1 hoặc a=b=0.
## DE
a) Cho các số dương $a,b,c$ có tích bằng $1$. Chứng minh rằng $(a+1)(b+1)(c+1)\ge8$. b) Cho các số $a$ và $b$ không âm. Chứng minh rằng $(a+b)(ab+1)\ge4ab$.
## SACH
a) Nhân từng vế các bất đẳng thức

$(a+1)^2\ge4a,\quad(b+1)^2\ge4b,\quad(c+1)^2\ge4c$.

b) Nhân từng vế các bất đẳng thức $(a+b)^2\ge4ab,\ (ab+1)^2\ge4ab$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi thừa số dạng $x+1$ hoặc tổng hai số hạng đều có dạng $u+v$ nên bình phương của nó $\ge4uv$; nhân các bất đẳng thức như vậy thì tích bên phải thành $64abc=64$ (ý a) hoặc $16a^2b^2$ (ý b), rồi khai căn hai vế không âm.

**Bước 1.** Ở ý a, viết $(x+1)^2\ge4x$ cho ba số dương rồi nhân ba bất đẳng thức cùng chiều, các vế đều dương nên được phép nhân.

**Bước 2.** Dùng điều kiện $abc=1$ để vế phải thành một hằng số, rồi khai căn hai vế dương để quay về tích ban đầu.

**Bước 3.** Ở ý b, áp dụng bất đẳng thức $(u+v)^2\ge4uv$ cho hai cặp $(a,b)$ và $(ab,1)$, nhân lại rồi khai căn hai vế không âm.

**Phần 2. Trình bày**

a) Với $x>0$: $(x+1)^2\ge4x$ vì $(x-1)^2\ge0$. Do đó $(a+1)^2\ge4a,\ (b+1)^2\ge4b,\ (c+1)^2\ge4c$.

Nhân vế với vế (các vế đều dương): $[(a+1)(b+1)(c+1)]^2\ge64abc=64$.

Vì $(a+1)(b+1)(c+1)>0$ nên $(a+1)(b+1)(c+1)\ge8$. Dấu "=" xảy ra khi $a=b=c=1$.

b) Với $a,b\ge0$: $(a+b)^2\ge4ab$ và $(ab+1)^2\ge4ab$ (vì $(a-b)^2\ge0,\ (ab-1)^2\ge0$), cả hai vế đều không âm.

Nhân vế với vế: $\left[(a+b)(ab+1)\right]^2\ge16a^2b^2=(4ab)^2$.

Vì $(a+b)(ab+1)\ge0$ và $4ab\ge0$ nên $(a+b)(ab+1)\ge4ab$.

Dấu "=" xảy ra khi $a=b=1$ hoặc $a=b=0$.

=== V2B.375@p48
- bai: 375 · y: - · trang: 48 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x² + y² ≥ 2xy · t + 1/t ≥ 2 (t > 0) · dùng điều kiện tích bằng 1 để rút cd = 1/(ab)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ a,b,c>0, d=1/(abc): không bộ nào vi phạm; dấu "=" tại a=b=c=d=1.
## DE
Cho các số dương $a,b,c,d$ có tích bằng $1$. Chứng minh rằng $a^2+b^2+c^2+d^2+ab+cd\ge6$.
## SACH
Ta có $a^2+b^2+c^2+d^2+ab+cd\ge2ab+2cd+ab+cd=3(ab+cd)$.

Ta lại có $ab+cd=ab+\dfrac{1}{ab}\ge2$.

Suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $abcd=1$ cho $cd=\dfrac{1}{ab}$, còn vế trái có hai cặp $a^2+b^2$ và $c^2+d^2$ ghép được với $ab$ và $cd$; nên dồn mọi thứ về biến $t=ab$ rồi dùng $t+\dfrac1t\ge2$.

**Bước 1.** Ghép $a^2+b^2$ và $c^2+d^2$ rồi chặn mỗi tổng bằng hai lần tích tương ứng để vế trái chỉ còn phụ thuộc $ab$ và $cd$.

**Bước 2.** Gom các hạng tử để vế trái được chặn dưới bởi một bội của $ab+cd$.

**Bước 3.** Dùng điều kiện tích bằng $1$ để thay $cd$ bằng $\dfrac{1}{ab}$ rồi áp dụng bất đẳng thức cho tổng của một số dương và nghịch đảo của nó.

**Phần 2. Trình bày**

Vì $a^2+b^2\ge2ab$ và $c^2+d^2\ge2cd$ nên $a^2+b^2+c^2+d^2+ab+cd\ge3(ab+cd)$.

Từ $abcd=1$ suy ra $cd=\dfrac1{ab}$. Đặt $t=ab>0$ thì $ab+cd=t+\dfrac1t$ và $t+\dfrac1t-2=\dfrac{(t-1)^2}{t}\ge0$ nên $ab+cd\ge2$.

Do đó $a^2+b^2+c^2+d^2+ab+cd\ge3\cdot2=6$.

Dấu "=" xảy ra khi $a=b,\ c=d,\ ab=1$ và $abcd=1$, tức $a=b=c=d=1$.

=== V2B.376@p48
- bai: 376 · y: - · trang: 48 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: $a^3-b^3=(a-b)(a^2+ab+b^2)$ · chia hai vế cho số dương
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy giải a theo b (b>0 ngẫu nhiên, nghiệm a>b của a^3+b^3=a-b) trên 13772 bộ có nghiệm: luôn a^2+b^2+ab<1 (lớn nhất đo được khoảng 0,99999999, tiệm cận 1 khi b→0). Sách chỉ ghi hướng; lời giải kho viết đủ, kể cả bước chứng tỏ a>b.
## DE
Cho các số dương $a$ và $b$ thỏa mãn $a^3+b^3=a-b$. Chứng minh rằng $a^2+b^2+ab<1$.
## SACH
Theo đề bài: $a-b=a^3+b^3$, mà $a^3+b^3>a^3-b^3$ (do $b>0$) nên $a-b>a^3-b^3$. Chia hai vế cho $a-b$ (chú ý rằng $a-b>0$ vì $a-b=a^3+b^3>0$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức cần chứng minh là $a^2+ab+b^2<1$, đúng là thừa số còn lại của $a^3-b^3=(a-b)(a^2+ab+b^2)$; nên đặt $a^3-b^3$ cạnh $a-b$ và so sánh hai số này.

**Bước 1.** Chứng tỏ $a-b>0$ nhờ điều kiện $a-b=a^3+b^3$ với $a,b>0$, vì chỉ khi đó mới được chia hai vế cho $a-b$ mà giữ nguyên chiều.

**Bước 2.** So sánh $a-b=a^3+b^3$ với $a^3-b^3$ nhờ $b>0$ để có bất đẳng thức giữa $a-b$ và $a^3-b^3$.

**Bước 3.** Phân tích $a^3-b^3$ thành $(a-b)(a^2+ab+b^2)$ rồi chia hai vế cho $a-b>0$ để ra bất đẳng thức cần chứng minh.

**Phần 2. Trình bày**

Từ $a-b=a^3+b^3>0$ (vì $a,b>0$) suy ra $a-b>0$.

Vì $b>0$ nên $b^3>0>-b^3$, do đó $a^3+b^3>a^3-b^3$. Kết hợp với $a-b=a^3+b^3$ được $a-b>a^3-b^3=(a-b)(a^2+ab+b^2)$.

Chia hai vế cho $a-b>0$: $1>a^2+ab+b^2$.

Vậy $a^2+b^2+ab<1$.

