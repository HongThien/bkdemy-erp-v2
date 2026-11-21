=== V2B.377@p48
- bai: 377 · y: - · trang: 48 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: xét từng khoảng giá trị của biến · $x^5-1=(x-1)(x^4+x^3+x^2+x+1)$ · so sánh luỹ thừa lẻ với $1$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị x ngẫu nhiên trong [-3;3]: cả hai biểu thức đều dương (giá trị nhỏ nhất thử được của A xấp xỉ 0,67 và của C xấp xỉ 0,51). Câu b) sách chỉ ghi "giải tương tự ví dụ 101", lời giải kho tự viết đủ.
## DE
Chứng minh các bất đẳng thức sau bằng cách xét từng khoảng giá trị của biến: a) $A=x^4+x^3+x^2+x+1>0$; b) $C=x^8-x^7+x^4-x+1>0$.
## SACH
a) Cách 1. $A(x-1)=x^5-1$. Ta biết rằng nếu $x>1$ thì $x^5>1$, nếu $x<1$ thì $x^5<1$. Do đó: Nếu $x>1$ thì $\dfrac{x^5-1}{x-1}>0\Rightarrow A>0$. Nếu $x<1$ thì $\dfrac{x^5-1}{x-1}>0\Rightarrow A>0$. Nếu $x=1$ thì hiển nhiên $A>0$.

Cách 2. $A=x^4+x^3+x^2+x+1=x^3(x+1)+(x+1)+x^2=(x+1)(x^3+1)+x^2=(x+1)^2(x^2-x+1)+x^2\ge0$. Dấu bằng không xảy ra.

b) Giải tương tự ví dụ 101. Xét $x\ge1$ và $x<1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề yêu cầu xét từng khoảng giá trị của biến, tức là mỗi khoảng của $x$ có một cách đánh giá dấu riêng, nhờ đó mỗi hạng tử hoặc mỗi cặp hạng tử có dấu rõ ràng.

**Bước 1.** Với câu a), nhân $A$ với $x-1$ để thu gọn thành $x^5-1$, vì tích này có dấu dễ xét hơn $A$ bậc bốn.

**Bước 2.** Chia ba trường hợp $x>1$, $x<1$, $x=1$; ở mỗi trường hợp so sánh $x^5$ với $1$ để suy ra dấu của $x^5-1$ rồi dấu của $A$.

**Bước 3.** Với câu b), chia hai khoảng $x\ge1$ và $x<1$, vì dấu của các hiệu $x-1$, $x^3-1$ đổi theo $x$ so với $1$.

**Bước 4.** Ở mỗi khoảng, nhóm các hạng tử thành những tích mà dấu của từng thừa số đã biết, rồi cộng thêm số hạng $1$ hoặc $1-x$ để chỉ ra tổng dương.

**Phần 2. Trình bày**

a) Ta có $A(x-1)=x^5-1$.

Nếu $x>1$ thì $x^5>1$ nên $x^5-1>0$ và $x-1>0$, suy ra $A=\dfrac{x^5-1}{x-1}>0$.

Nếu $x<1$ thì $x^5<1$ nên $x^5-1<0$ và $x-1<0$, suy ra $A=\dfrac{x^5-1}{x-1}>0$.

Nếu $x=1$ thì $A=5>0$.

Vậy $A>0$ với mọi $x$.

b) Với $x\ge1$: $C=x^7(x-1)+x(x^3-1)+1$. Vì $x\ge1$ nên $x^7(x-1)\ge0$ và $x(x^3-1)\ge0$, do đó $C\ge1>0$.

Với $x<1$: $C=x^8+x^4(1-x^3)+(1-x)$. Vì $x<1$ nên $1-x>0$ và $1-x^3>0$; lại có $x^8\ge0$, $x^4\ge0$. Do đó $C\ge1-x>0$.

Vậy $C>0$ với mọi $x$.

=== V2B.378@p48
- bai: 378 · y: - · trang: 48 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c) ngẫu nhiên thoả ba giả thiết: luôn cả ba số dương, khớp khẳng định.
## DE
Giải bằng phương pháp phản chứng: Chứng minh rằng nếu $a+b+c>0$, $abc>0$, $ab+bc+ca>0$ thì $a>0$, $b>0$, $c>0$.
## SACH
Giả sử $a\le0$: Nếu $a=0$ thì trái với $abc>0$. Nếu $a<0$: Do $a+b+c>0$ nên $b+c>0$. Do $abc>0$ nên $bc<0$. Suy ra $a(b+c)+bc<0$, mâu thuẫn với $ab+bc+ca>0$. Vậy $a>0$. Tương tự, $b>0$, $c>0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Kết luận "cả ba số đều dương" là phủ định của "có một số không dương", mà ba giả thiết đều đối xứng theo $a,b,c$ nên chỉ cần xét một số, chẳng hạn $a\le0$, rồi tìm mâu thuẫn.

**Bước 1.** Giả sử $a\le0$ và tách thành hai trường hợp $a=0$ và $a<0$, vì mỗi trường hợp mâu thuẫn với một giả thiết khác nhau.

**Bước 2.** Trường hợp $a=0$ cho $abc=0$, trái với giả thiết $abc>0$ nên bị loại ngay.

**Bước 3.** Trường hợp $a<0$: từ $a+b+c>0$ rút ra $b+c>0$, từ $abc>0$ rút ra $bc<0$, rồi thay hai điều này vào tổng $ab+bc+ca=a(b+c)+bc$.

**Bước 4.** Nêu mâu thuẫn với giả thiết thứ ba, kết luận $a>0$, rồi suy ra $b>0$, $c>0$ do vai trò của ba số như nhau.

**Phần 2. Trình bày**

Giả sử một trong ba số không dương; do tính đối xứng, giả sử $a\le0$.

Nếu $a=0$ thì $abc=0$, trái với $abc>0$.

Nếu $a<0$: từ $a+b+c>0$ suy ra $b+c>-a>0$; từ $abc>0$ và $a<0$ suy ra $bc<0$.

Khi đó $ab+bc+ca=a(b+c)+bc$, trong đó $a(b+c)<0$ (vì $a<0$, $b+c>0$) và $bc<0$, nên $ab+bc+ca<0$, trái với giả thiết $ab+bc+ca>0$.

Vậy $a>0$. Vì ba giả thiết đối xứng với $a,b,c$ nên làm tương tự ta được $b>0$, $c>0$.

=== V2B.379@p48
- bai: 379 · y: - · trang: 48 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · đặt ẩn phụ $a=3+x$, $b=3+y$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 cặp (a,b) ngẫu nhiên (a,b>=3, a^2+b^2>=25): luôn a+b>=7, khớp.
## DE
Giải bằng phương pháp phản chứng: Chứng minh rằng nếu $a\ge3$, $b\ge3$, $a^2+b^2\ge25$ thì $a+b\ge7$.
## SACH
Đặt $a=3+x$, $b=3+y$ thì $x\ge0$, $y\ge0$. Ta có $a+b=6+(x+y)$. Ta sẽ chứng minh $x+y\ge1$. Giả sử $0\le x+y<1$ thì $x^2+2xy+y^2<1$ nên $x^2+y^2<1$ (do $2xy\ge0$). Khi đó $a^2+b^2=(3+x)^2+(3+y)^2=18+6(x+y)+(x^2+y^2)<18+6+1=25$, trái với giả thiết $a^2+b^2\ge25$. Vậy $x+y\ge1$, suy ra $a+b\ge7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a\ge3$, $b\ge3$ gợi đặt $a=3+x$, $b=3+y$ với $x,y\ge0$ để cái cần chứng minh $a+b\ge7$ thành $x+y\ge1$, và để $a^2+b^2$ khai triển được theo $x+y$ và $x^2+y^2$.

**Bước 1.** Đặt $a=3+x$, $b=3+y$ với $x\ge0$, $y\ge0$, rồi quy kết luận về chứng minh $x+y\ge1$.

**Bước 2.** Giả sử ngược lại $0\le x+y<1$, vì phản chứng cho ta thêm một bất đẳng thức để dùng.

**Bước 3.** Từ $x+y<1$ và $x,y\ge0$ suy ra $x^2+y^2<1$, bằng cách bình phương rồi bỏ hạng tử $2xy$ không âm.

**Bước 4.** Khai triển $a^2+b^2$ theo $x+y$ và $x^2+y^2$ để đánh giá nó nhỏ hơn $25$, mâu thuẫn với giả thiết.

**Phần 2. Trình bày**

Đặt $a=3+x$, $b=3+y$ với $x\ge0$, $y\ge0$. Khi đó $a+b=6+(x+y)$, cần chứng minh $x+y\ge1$.

Giả sử $0\le x+y<1$. Bình phương hai vế (hai vế không âm): $x^2+2xy+y^2<1$, mà $2xy\ge0$ nên $x^2+y^2<1$.

Khi đó $a^2+b^2=(3+x)^2+(3+y)^2=18+6(x+y)+(x^2+y^2)<18+6\cdot1+1=25$, trái với giả thiết $a^2+b^2\ge25$.

Vậy $x+y\ge1$, suy ra $a+b=6+(x+y)\ge7$.

=== V2B.380@p48
- bai: 380 · y: - · trang: 48 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · $(a+b+c)^2\ge3(ab+bc+ca)$ · $a^2+b^2+c^2>ab+bc+ca$ khi $a,b,c$ đôi một khác nhau
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c) thực ngẫu nhiên (đôi một khác nhau xác suất 1): min(9ab,9bc,9ca) < (a+b+c)^2 luôn đúng, khớp.
## DE
Giải bằng phương pháp phản chứng: Cho ba số $a,b,c$ khác nhau đôi một. Chứng minh rằng tồn tại một trong các số $9ab$, $9bc$, $9ca$ nhỏ hơn $(a+b+c)^2$.
## SACH
Giả sử $9ab\ge(a+b+c)^2$, $9bc\ge(a+b+c)^2$, $9ca\ge(a+b+c)^2$. Cộng từng vế các bất đẳng thức trên rồi chia cho $3$ được: $3(ab+bc+ca)\ge(a+b+c)^2\Rightarrow ab+bc+ca\ge a^2+b^2+c^2$ (1). Mặt khác dễ dàng chứng minh được $a^2+b^2+c^2>ab+bc+ca$ với $a,b,c$ khác nhau đôi một, mâu thuẫn với (1).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Kết luận "tồn tại một số nhỏ hơn" có phủ định là "cả ba số đều lớn hơn hoặc bằng", và ba số này cộng lại ra đúng $ab+bc+ca$ nên phản chứng cho một bất đẳng thức tổng quen thuộc.

**Bước 1.** Giả sử cả ba số $9ab$, $9bc$, $9ca$ đều không nhỏ hơn $(a+b+c)^2$, rồi cộng ba bất đẳng thức này lại.

**Bước 2.** Chia hai vế cho $3$ và khai triển $(a+b+c)^2$ để đưa về một bất đẳng thức giữa $ab+bc+ca$ và $a^2+b^2+c^2$.

**Bước 3.** Chứng minh $a^2+b^2+c^2>ab+bc+ca$ khi ba số đôi một khác nhau, bằng tổng ba bình phương $(a-b)^2$, $(b-c)^2$, $(c-a)^2$, rồi nêu mâu thuẫn.

**Phần 2. Trình bày**

Giả sử $9ab\ge(a+b+c)^2$, $9bc\ge(a+b+c)^2$, $9ca\ge(a+b+c)^2$.

Cộng ba bất đẳng thức rồi chia cho $3$: $3(ab+bc+ca)\ge(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$.

Suy ra $ab+bc+ca\ge a^2+b^2+c^2$ (1).

Mặt khác $a^2+b^2+c^2-(ab+bc+ca)=\dfrac{1}{2}\left[(a-b)^2+(b-c)^2+(c-a)^2\right]>0$ vì $a,b,c$ đôi một khác nhau, tức $a^2+b^2+c^2>ab+bc+ca$, mâu thuẫn với (1).

Vậy tồn tại một trong các số $9ab$, $9bc$, $9ca$ nhỏ hơn $(a+b+c)^2$.

=== V2B.381@p48
- bai: 381 · y: - · trang: 48 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phản chứng · Cô-si $x+\dfrac{1}{x}\ge2$ với $x>0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c) dương: không bộ nào thoả cả ba bất đẳng thức, khớp. Sách chỉ nêu "tổng < 6, hãy chứng minh vô lí"; lời giải kho viết đủ bằng Cô-si.
## DE
Giải bằng phương pháp phản chứng: Chứng minh rằng không có ba số dương $a,b,c$ nào thoả mãn cả ba bất đẳng thức: $a+\dfrac{1}{b}<2$; $b+\dfrac{1}{c}<2$; $c+\dfrac{1}{a}<2$.
## SACH
Giả sử tồn tại các số dương $a,b,c$ mà $a+\dfrac{1}{b}<2$, $b+\dfrac{1}{c}<2$, $c+\dfrac{1}{a}<2$ thì $a+\dfrac{1}{b}+b+\dfrac{1}{c}+c+\dfrac{1}{a}<6$. Hãy chứng minh điều này vô lí.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cộng ba bất đẳng thức giả sử được vế phải $6$, còn vế trái xếp lại thành ba cặp $x+\dfrac{1}{x}$ mỗi cặp luôn không nhỏ hơn $2$ với $x>0$ (Cô-si) nên tổng không nhỏ hơn $6$.

**Bước 1.** Giả sử tồn tại ba số dương thoả cả ba bất đẳng thức, rồi cộng từng vế để được tổng vế trái nhỏ hơn $6$.

**Bước 2.** Sắp xếp lại vế trái thành $\left(a+\dfrac{1}{a}\right)+\left(b+\dfrac{1}{b}\right)+\left(c+\dfrac{1}{c}\right)$, vì chỉ khi ghép số với nghịch đảo của chính nó mới dùng được Cô-si.

**Bước 3.** Áp dụng $x+\dfrac{1}{x}\ge2$ cho từng cặp rồi cộng lại để chỉ ra tổng ít nhất bằng $6$, mâu thuẫn.

**Phần 2. Trình bày**

Giả sử tồn tại các số dương $a,b,c$ thoả mãn cả ba bất đẳng thức. Cộng từng vế:

$a+\dfrac{1}{b}+b+\dfrac{1}{c}+c+\dfrac{1}{a}<6$, tức là $\left(a+\dfrac{1}{a}\right)+\left(b+\dfrac{1}{b}\right)+\left(c+\dfrac{1}{c}\right)<6$ (1).

Với $x>0$, theo bất đẳng thức Cô-si $x+\dfrac{1}{x}\ge2\sqrt{x\cdot\dfrac{1}{x}}=2$ (dấu "=" khi $x=1$). Áp dụng cho $x=a,\ b,\ c$ (đều dương): vế trái của (1) không nhỏ hơn $2+2+2=6$, mâu thuẫn với (1).

Vậy không có ba số dương nào thoả mãn cả ba bất đẳng thức.

=== V2B.382@p49
- bai: 382 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phản chứng · bình phương hai vế với giá trị tuyệt đối · hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c) thực ngẫu nhiên: không bộ nào thoả cả ba bất đẳng thức, khớp. Sách chỉ gợi nhân ba bất đẳng thức; lời giải kho viết rõ dấu của tích.
## DE
Giải bằng phương pháp phản chứng: Chứng minh rằng không có các số $a,b,c$ nào thoả mãn cả ba bất đẳng thức: $\lvert b-c\rvert>\lvert a\rvert$, $\lvert c-a\rvert>\lvert b\rvert$, $\lvert a-b\rvert>\lvert c\rvert$.
## SACH
Giả sử $\lvert b-c\rvert>\lvert a\rvert$, $\lvert c-a\rvert>\lvert b\rvert$, $\lvert a-b\rvert>\lvert c\rvert$ thì $(b-c)^2>a^2$, $(c-a)^2>b^2$, $(a-b)^2>c^2$. Do đó: $(b-c+a)(b-c-a)>0$, $(c-a+b)(c-a-b)>0$, $(a-b+c)(a-b-c)>0$. Nhân từng vế ba đẳng thức trên sẽ dẫn đến điều vô lí.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế mỗi bất đẳng thức đều không âm nên bình phương được, và hiệu hai bình phương cho tích hai thừa số; ba tích đó dùng chung ba nhân tử nên khi nhân lại chỉ còn một bình phương mang dấu trừ.

**Bước 1.** Giả sử có ba số thoả mãn cả ba bất đẳng thức, rồi bình phương từng bất đẳng thức để bỏ dấu giá trị tuyệt đối.

**Bước 2.** Chuyển vế và phân tích hiệu hai bình phương thành tích, rồi đặt $X=a+b-c$, $Y=a+c-b$, $Z=b+c-a$ để viết ba tích theo $X,Y,Z$.

**Bước 3.** Nhân ba tích với nhau để được một biểu thức mang dấu âm theo $X,Y,Z$, trái với việc ba tích đều dương.

**Phần 2. Trình bày**

Giả sử tồn tại $a,b,c$ thoả mãn cả ba bất đẳng thức. Vì hai vế đều không âm nên bình phương được: $(b-c)^2>a^2$, $(c-a)^2>b^2$, $(a-b)^2>c^2$.

Do đó $(b-c+a)(b-c-a)>0$, $(c-a+b)(c-a-b)>0$, $(a-b+c)(a-b-c)>0$.

Đặt $X=a+b-c$, $Y=a+c-b$, $Z=b+c-a$. Khi đó ba bất đẳng thức trên là $-XY>0$, $-XZ>0$, $-YZ>0$.

Nhân từng vế ba bất đẳng thức (các vế đều dương): $(-XY)(-XZ)(-YZ)>0$, tức $-(XYZ)^2>0$, vô lí vì $(XYZ)^2\ge0$.

Vậy không có các số $a,b,c$ nào thoả mãn cả ba bất đẳng thức.

=== V2B.383@p49
- bai: 383 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · nhân các bất đẳng thức cùng chiều (vế dương) · $4t(1-t)\le1$ ⇔ $(2t-1)^2\ge0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ (a,b,c) trong (0;1): không bộ nào thoả cả ba, khớp. Sách bỏ qua chi tiết: từ $4a(1-b)>1$ với $a>0$ mới suy ra $1-b>0$.
## DE
Giải bằng phương pháp phản chứng: Chứng minh rằng không có các số dương $a,b,c$ nào thoả mãn cả ba bất đẳng thức: $4a(1-b)>1$, $4b(1-c)>1$, $4c(1-a)>1$.
## SACH
Giả sử $4a(1-b)>1$, $4b(1-c)>1$, $4c(1-a)>1$ thì nhân từng vế ta được $64abc(1-a)(1-b)(1-c)>1$ (1). Mặt khác, ta lại có $4a(1-a)=4a-4a^2\le1$ (2) (vì $1+4a^2-4a=(2a-1)^2\ge0$). Tương tự $4b(1-b)\le1$ (3), $4c(1-c)\le1$ (4). Từ giả thiết phản chứng và từ $a,b,c$ dương suy ra $1-a$, $1-b$, $1-c$ cũng dương. Do đó ta nhân từng vế các bất đẳng thức (2), (3), (4) và được $64abc(1-a)(1-b)(1-c)\le1$, mâu thuẫn với (1).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tích ba vế trái cho $64abc(1-a)(1-b)(1-c)$, đúng là tích của ba biểu thức $4a(1-a)$, $4b(1-b)$, $4c(1-c)$ mà mỗi biểu thức không vượt quá $1$ (dấu "=" ở $t=\dfrac{1}{2}$).

**Bước 1.** Giả sử cả ba bất đẳng thức xảy ra; mỗi vế trái dương và lớn hơn $1$ nên suy ra $1-a$, $1-b$, $1-c$ đều dương, để có quyền nhân vế.

**Bước 2.** Nhân từng vế ba bất đẳng thức để được $64abc(1-a)(1-b)(1-c)>1$.

**Bước 3.** Chứng minh $4t(1-t)\le1$ với mọi $t$ bằng $(2t-1)^2\ge0$, rồi áp dụng cho $t=a,b,c$ và nhân ba bất đẳng thức (đều có vế không âm).

**Bước 4.** So sánh hai kết quả để chỉ ra mâu thuẫn.

**Phần 2. Trình bày**

Giả sử $4a(1-b)>1$, $4b(1-c)>1$, $4c(1-a)>1$. Vì $a,b,c>0$ nên $1-b>0$, $1-c>0$, $1-a>0$. Nhân từng vế ba bất đẳng thức (các vế đều dương):

$64abc(1-a)(1-b)(1-c)>1$ (1)

Với mọi số $t$: $1-4t(1-t)=4t^2-4t+1=(2t-1)^2\ge0$ nên $4t(1-t)\le1$. Do $a,b,c$ và $1-a$, $1-b$, $1-c$ đều dương nên $0<4a(1-a)\le1$, $0<4b(1-b)\le1$, $0<4c(1-c)\le1$.

Nhân từng vế ba bất đẳng thức này: $64abc(1-a)(1-b)(1-c)\le1$, mâu thuẫn với (1).

Vậy không có các số dương $a,b,c$ nào thoả mãn cả ba bất đẳng thức.

=== V2B.384@p49
- bai: 384 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · $(a+b)^3=a^3+b^3+3ab(a+b)$ · $a^3+b^3=(a+b)(a^2-ab+b^2)$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị a thực, b là căn bậc ba của 2-a^3: luôn a+b<=2, khớp. Lời giải kho theo cách 2 của sách (không cần giả thiết dấu của a, b).
## DE
Giải bằng phương pháp phản chứng: Cho $a^3+b^3=2$. Chứng minh rằng $a+b\le2$.
## SACH
Cách 1. Giả sử $a+b>2$. Đặt $a=x+y$, $b=x-y$, ta có $a+b=2x>2\Rightarrow x>1$ (1). Ta có $a^3+b^3=(x+y)^3+(x-y)^3=2x^3+6xy^2$. Do (1) nên $2x^3>2$; $6xy^2\ge0$. Vậy $a^3+b^3>2$, trái với giả thiết.

Cách 2. Giả sử $a+b>2$. Ta có: $(a+b)^3>8\Rightarrow a^3+b^3+3ab(a+b)>8\Rightarrow2+3ab(a+b)>8\Rightarrow ab(a+b)>2\Rightarrow ab(a+b)>a^3+b^3$ (vì $a^3+b^3=2$) $\Rightarrow ab>a^2-ab+b^2$ (chia hai vế cho số dương $a+b$) $\Rightarrow0>(a-b)^2$, vô lí.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả sử $a+b>2$ thì lập phương hai vế được vì cả hai vế dương, và $(a+b)^3$ chứa đúng $a^3+b^3$ mà đề đã cho bằng $2$, nên chỉ còn lại $ab(a+b)$ cần đánh giá.

**Bước 1.** Giả sử $a+b>2$, suy ra $a+b>0$ nên lập phương hai vế được mà không đổi chiều bất đẳng thức.

**Bước 2.** Khai triển $(a+b)^3=a^3+b^3+3ab(a+b)$ và thay $a^3+b^3=2$ để rút ra $ab(a+b)>2$.

**Bước 3.** Viết lại vế phải $2=a^3+b^3=(a+b)(a^2-ab+b^2)$ rồi chia hai vế cho $a+b>0$ để được $ab>a^2-ab+b^2$.

**Bước 4.** Chuyển vế để được $(a-b)^2<0$, vô lí.

**Phần 2. Trình bày**

Giả sử $a+b>2$. Khi đó $a+b>0$ và $(a+b)^3>8$, tức $a^3+b^3+3ab(a+b)>8$.

Vì $a^3+b^3=2$ nên $3ab(a+b)>6$, suy ra $ab(a+b)>2=a^3+b^3=(a+b)(a^2-ab+b^2)$.

Chia hai vế cho $a+b>0$: $ab>a^2-ab+b^2$, suy ra $(a-b)^2<0$, vô lí.

Vậy $a+b\le2$.

=== V2B.385@p49
- bai: 385 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến · bất đẳng thức tam giác $a<b+c$ · tích không âm $c(a-c)(b-c)\ge0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: SÁCH IN SAI câu b): đề in dấu ">" nhưng khi a=b=c thì hai vế bằng nhau (a=b=c=1: 6=6), nên đúng phải là "≥"; lời giải sách cũng chỉ ra (a-b)^2(a+b-c)≥0. Máy thử 200000 tam giác ngẫu nhiên: a) luôn <2 (khớp); b) luôn >=0 và dấu bằng chỉ tại a=b=c. Lời giải kho chứng minh dạng "≥" (dấu "=" khi a=b=c). Sách câu b) chỉ ghi gợi ý, lời giải kho viết đủ.
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác. Chứng minh rằng: a) $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}<2$; b) $a^3+b^3+c^3+3abc>ab(a+b)+bc(b+c)+ac(a+c)$.
## SACH
a) Giả sử $a\ge b\ge c>0$ thì $a+b\ge a+c\ge b+c$. Ta có $\dfrac{c}{a+b}\le\dfrac{c}{b+c}$, $\dfrac{b}{c+a}\le\dfrac{b}{b+c}$, $\dfrac{a}{b+c}=\dfrac{a}{b+c}$. Cộng từng vế: $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\le\dfrac{a}{b+c}+1<1+1=2$.

Chú ý: Ta cũng chứng minh được: Nếu $a,b,c>0$ thì $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{3}{2}$ (xem ví dụ 92b).

b) Sắp xếp: $a\ge b\ge c>0\Rightarrow c(a-c)(b-c)\ge0\Rightarrow c^3+abc\ge ac^2+bc^2$. Ta cần phải chứng minh $a^3+b^3+2abc\ge ab(a+b)+b^2c+a^2c$. Bất đẳng thức này tương đương với $(a-b)^2(a+b-c)\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai biểu thức đối xứng theo $a,b,c$ nên sắp thứ tự $a\ge b\ge c>0$ được; thứ tự này cho thêm các bất đẳng thức giữa các mẫu và dấu của $(a-c)(b-c)$ mà bài không sắp thì không có.

**Bước 1.** Câu a): sắp $a\ge b\ge c>0$ rồi so sánh các mẫu $a+b\ge b+c$ và $c+a\ge b+c$ để làm trội $\dfrac{c}{a+b}$ và $\dfrac{b}{c+a}$ về cùng mẫu $b+c$.

**Bước 2.** Cộng lại để tử còn $b+c$ trên mẫu $b+c$ (bằng $1$), rồi dùng bất đẳng thức tam giác $a<b+c$ để chặn $\dfrac{a}{b+c}<1$.

**Bước 3.** Câu b): sắp $a\ge b\ge c>0$, rồi dùng $c(a-c)(b-c)\ge0$ để làm giảm bớt các hạng tử chứa $c$ ở vế cần chứng minh.

**Bước 4.** Phần còn lại không chứa lập phương của $c$ nên phân tích được thành $(a-b)^2(a+b-c)$, mà $a+b-c>0$ do bất đẳng thức tam giác.

**Chú ý:** Ở câu b) dấu "=" xảy ra khi $a=b=c$, nên bất đẳng thức chỉ đúng với dấu $\ge$ (đề in dấu $>$ là chưa chính xác); chứng minh dưới đây cho dạng $\ge$.

**Phần 2. Trình bày**

a) Vì biểu thức đối xứng nên giả sử $a\ge b\ge c>0$. Khi đó $a+b\ge b+c$ và $c+a\ge b+c$, suy ra
$\dfrac{c}{a+b}\le\dfrac{c}{b+c}$ và $\dfrac{b}{c+a}\le\dfrac{b}{b+c}$.

Cộng từng vế: $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\le\dfrac{a}{b+c}+\dfrac{b+c}{b+c}=\dfrac{a}{b+c}+1$.

Vì $a,b,c$ là ba cạnh tam giác nên $a<b+c$, tức $\dfrac{a}{b+c}<1$. Vậy tổng đã cho nhỏ hơn $1+1=2$.

b) Vì biểu thức đối xứng nên giả sử $a\ge b\ge c>0$. Khi đó $c(a-c)(b-c)\ge0$, tức $c^3+abc\ge ac^2+bc^2$.

Do đó
$a^3+b^3+c^3+3abc-ab(a+b)-bc(b+c)-ac(a+c)\ge a^3+b^3+2abc-a^2b-ab^2-b^2c-a^2c$.

Mà $a^3+b^3+2abc-a^2b-ab^2-b^2c-a^2c=(a-b)^2(a+b-c)$ (khai triển hai vế đều ra $a^3-a^2b-ab^2+b^3-a^2c-b^2c+2abc$).

Vì $a+b>c$ nên $(a-b)^2(a+b-c)\ge0$. Vậy $a^3+b^3+c^3+3abc\ge ab(a+b)+bc(b+c)+ac(a+c)$, dấu "=" xảy ra khi $a=b=c$.

=== V2B.386@p49
- bai: 386 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến (xét dấu của hai hiệu cùng chiều) · cộng ba bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ số thực ngẫu nhiên cho cả a) và b): đúng, khớp (đề không nêu điều kiện dấu nên đúng với mọi số thực). Sách tắt câu a) (chỉ ghi hiệu và dấu hai thừa số).
## DE
Chứng minh bất đẳng thức: a) $2(a^8+b^8)\ge(a^3+b^3)(a^5+b^5)$; b) $3(a^8+b^8+c^8)\ge(a^3+b^3+c^3)(a^5+b^5+c^5)$.
## SACH
a) Hiệu: $2(a^8+b^8)-(a^3+b^3)(a^5+b^5)$ bằng $(a^3-b^3)(a^5-b^5)$. Giả sử $a\ge b$ thì $a^3-b^3\ge0$ và $a^5-b^5\ge0$.

b) Theo câu a ta có: $2(a^8+b^8)\ge(a^3+b^3)(a^5+b^5)$; $2(b^8+c^8)\ge(b^3+c^3)(b^5+c^5)$; $2(c^8+a^8)\ge(c^3+a^3)(c^5+a^5)$. Cộng từng vế ba bất đẳng thức trên, ta được: $4(a^8+b^8+c^8)\ge(a^8+b^8+c^8)+a^3(a^5+b^5+c^5)+b^3(a^5+b^5+c^5)+c^3(a^5+b^5+c^5)\Rightarrow3(a^8+b^8+c^8)\ge(a^3+b^3+c^3)(a^5+b^5+c^5)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu hai vế của câu a) phân tích được thành $(a^3-b^3)(a^5-b^5)$ và hai thừa số này luôn cùng dấu với $a-b$ vì luỹ thừa lẻ giữ nguyên thứ tự; câu b) là cộng câu a) cho từng cặp trong ba biến.

**Bước 1.** Câu a): khai triển vế phải rồi lấy hiệu, ghép các hạng tử để nhận ra tích $(a^3-b^3)(a^5-b^5)$.

**Bước 2.** Sắp thứ tự $a\ge b$ (nếu $a<b$ thì đổi vai trò) để thấy cả hai thừa số cùng không âm, nên tích không âm.

**Bước 3.** Câu b): viết bất đẳng thức câu a) cho ba cặp $(a,b)$, $(b,c)$, $(c,a)$ rồi cộng từng vế ba bất đẳng thức.

**Bước 4.** Khai triển ba tích ở vế phải để thấy tổng của chúng là $(a^8+b^8+c^8)+(a^3+b^3+c^3)(a^5+b^5+c^5)$, rồi chuyển vế để được điều cần chứng minh.

**Phần 2. Trình bày**

a) Ta có $2(a^8+b^8)-(a^3+b^3)(a^5+b^5)=a^8+b^8-a^3b^5-a^5b^3=a^3(a^5-b^5)-b^3(a^5-b^5)=(a^3-b^3)(a^5-b^5)$.

Nếu $a\ge b$ thì $a^3\ge b^3$ và $a^5\ge b^5$ (luỹ thừa bậc lẻ giữ nguyên thứ tự) nên cả hai thừa số không âm. Nếu $a<b$ thì cả hai thừa số âm. Trong cả hai trường hợp tích không âm, tức $2(a^8+b^8)\ge(a^3+b^3)(a^5+b^5)$.

b) Áp dụng câu a) cho ba cặp:
$2(a^8+b^8)\ge(a^3+b^3)(a^5+b^5)$
$2(b^8+c^8)\ge(b^3+c^3)(b^5+c^5)$
$2(c^8+a^8)\ge(c^3+a^3)(c^5+a^5)$

Cộng từng vế, vế trái là $4(a^8+b^8+c^8)$. Đặt $T=a^3b^5+a^5b^3+b^3c^5+b^5c^3+c^3a^5+c^5a^3$ thì vế phải là $2(a^8+b^8+c^8)+T$. Mặt khác $(a^3+b^3+c^3)(a^5+b^5+c^5)=(a^8+b^8+c^8)+T$, nên vế phải $=(a^8+b^8+c^8)+(a^3+b^3+c^3)(a^5+b^5+c^5)$.

Vậy $4(a^8+b^8+c^8)\ge(a^8+b^8+c^8)+(a^3+b^3+c^3)(a^5+b^5+c^5)$, suy ra $3(a^8+b^8+c^8)\ge(a^3+b^3+c^3)(a^5+b^5+c^5)$.

=== V2B.387@p49
- bai: 387 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến · thay hằng số $2=a+b$ để đồng bậc
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 giá trị a thực với b=2-a: luôn a^8+b^8>=a^7+b^7, khớp. Sách dừng ở "giả sử a≥b thì hai thừa số không âm"; lời giải kho viết đủ.
## DE
Cho $a+b=2$. Chứng minh rằng $a^8+b^8\ge a^7+b^7$.
## SACH
Chú ý rằng $a+b=2$, ta xét hiệu $2(a^8+b^8)-2(a^7+b^7)=2(a^8+b^8)-(a+b)(a^7+b^7)$. Biến đổi hiệu này thành $(a-b)(a^7-b^7)$. Giả sử $a\ge b$ thì $a-b\ge0$ và $a^7-b^7\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế khác bậc ($8$ và $7$) nên dùng $a+b=2$ để viết $2(a^7+b^7)=(a+b)(a^7+b^7)$, đưa hiệu về cùng bậc $8$ rồi phân tích được thành tích hai hiệu cùng dấu.

**Bước 1.** Lập hiệu $2(a^8+b^8)-2(a^7+b^7)$ và thay số $2$ ở số hạng sau bằng $a+b$, vì như vậy hai số hạng cùng bậc.

**Bước 2.** Khai triển $(a+b)(a^7+b^7)$ rồi rút gọn để hiệu thành $a^8+b^8-ab^7-a^7b$.

**Bước 3.** Nhóm các hạng tử thành $(a-b)(a^7-b^7)$ và nhận xét hai thừa số luôn cùng dấu vì luỹ thừa bậc $7$ giữ nguyên thứ tự.

**Phần 2. Trình bày**

Vì $a+b=2$ nên $2(a^8+b^8)-2(a^7+b^7)=2(a^8+b^8)-(a+b)(a^7+b^7)=a^8+b^8-ab^7-a^7b=(a-b)(a^7-b^7)$.

Nếu $a\ge b$ thì $a-b\ge0$ và $a^7-b^7\ge0$; nếu $a<b$ thì $a-b<0$ và $a^7-b^7<0$. Trong cả hai trường hợp $(a-b)(a^7-b^7)\ge0$.

Suy ra $2(a^8+b^8)\ge2(a^7+b^7)$, tức $a^8+b^8\ge a^7+b^7$ (dấu "=" khi $a=b=1$).

=== V2B.388@p49
- bai: 388 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến · xét hiệu · dấu của tích hai thừa số cùng chiều · bất đẳng thức Schur
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 bộ dương: a) và b) đúng, khớp. Ảnh sách in lặp câu b) hai lần (lỗi bản in), chép một lần. Câu a) là bất đẳng thức Schur bậc 1; câu b) chỉ cần vòng hoán vị nên giả sử c nhỏ nhất.
## DE
Chứng minh bất đẳng thức sau với $a,b,c\ge0$: a) $a(a-b)(a-c)+b(b-c)(b-a)+c(c-a)(c-b)\ge0$; b) $a^6+b^6+c^6\ge a^5b+b^5c+c^5a$.
## SACH
a) Sắp xếp: $a\ge b\ge c\ge0$. $a(a-b)(a-c)+b(b-c)(b-a)+c(c-a)(c-b)=a(a-b)[(a-b)+(b-c)]-b(a-b)(b-c)+c(a-c)(b-c)=a(a-b)^2+a(a-b)(b-c)-b(a-b)(b-c)+c(a-c)(b-c)=a(a-b)^2+(b-c)(a-b)^2+c(a-c)(b-c)\ge0$.

b) Không mất tính tổng quát, giả sử $c$ là số nhỏ nhất trong ba số $a,b,c$. Xét hiệu: $a^6+b^6+c^6-a^5b-b^5c-c^5a=a^5(a-b)+b^5(b-c)+c^5(c-a)=a^5(a-b)-b^5[(a-b)+(c-a)]+c^5(c-a)=(a-b)(a^5-b^5)+(c-a)(c^5-b^5)$. Do $c\le a$, $c\le b$ nên $c-a<0$, $c^5-b^5\le0$, do đó $(c-a)(c^5-b^5)\ge0$. Còn $(a-b)(a^5-b^5)$ cũng không âm (thật vậy nếu $a-b\ge0$ thì $a^5-b^5\ge0$, nếu $a-b<0$ thì $a^5-b^5<0$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai biểu thức có tính đối xứng (câu a hoàn toàn, câu b theo vòng hoán vị) nên sắp thứ tự các biến để các hiệu như $a-b$, $a-c$, $b-c$ có dấu xác định, rồi tách biểu thức thành các số hạng mỗi số hạng là tích của các thừa số không âm.

**Bước 1.** Câu a): sắp $a\ge b\ge c\ge0$, tách $a-c=(a-b)+(b-c)$ ở số hạng đầu để xuất hiện các tích có chung thừa số $a-b$ và $b-c$.

**Bước 2.** Gom các số hạng chứa $(a-b)(b-c)$ thành $(b-c)(a-b)^2$ và để lại số hạng $c(a-c)(b-c)$, rồi kiểm tra từng số hạng đều không âm.

**Bước 3.** Câu b): vì biểu thức giữ nguyên khi hoán vị vòng $a\to b\to c\to a$ nên giả sử $c$ nhỏ nhất, rồi lập hiệu hai vế và tách $b^5(b-c)=-b^5[(a-b)+(c-a)]$.

**Bước 4.** Ghép lại thành $(a-b)(a^5-b^5)+(c-a)(c^5-b^5)$ và xét dấu từng tích bằng tính đơn điệu của luỹ thừa bậc $5$.

**Phần 2. Trình bày**

a) Vì biểu thức đối xứng nên giả sử $a\ge b\ge c\ge0$. Gọi $S$ là vế trái, khi đó:

$S=a(a-b)[(a-b)+(b-c)]-b(a-b)(b-c)+c(a-c)(b-c)$

$=a(a-b)^2+a(a-b)(b-c)-b(a-b)(b-c)+c(a-c)(b-c)$

$=a(a-b)^2+(b-c)(a-b)^2+c(a-c)(b-c)$

Vì $a\ge b\ge c\ge0$ nên $a(a-b)^2\ge0$, $(b-c)(a-b)^2\ge0$, $c(a-c)(b-c)\ge0$. Vậy $S\ge0$.

b) Biểu thức không đổi khi hoán vị vòng $a\to b\to c\to a$ nên ta giả sử $c$ là số nhỏ nhất trong ba số. Xét hiệu:

$a^6+b^6+c^6-a^5b-b^5c-c^5a=a^5(a-b)+b^5(b-c)+c^5(c-a)$

$=a^5(a-b)-b^5[(a-b)+(c-a)]+c^5(c-a)$

$=(a-b)(a^5-b^5)+(c-a)(c^5-b^5)$

Vì luỹ thừa bậc $5$ giữ nguyên thứ tự nên $a-b$ và $a^5-b^5$ cùng dấu, do đó $(a-b)(a^5-b^5)\ge0$. Vì $c\le a$ và $c\le b$ nên $c-a\le0$ và $c^5-b^5\le0$, do đó $(c-a)(c^5-b^5)\ge0$.

Vậy hiệu không âm, tức $a^6+b^6+c^6\ge a^5b+b^5c+c^5a$.

=== V2B.389@p49
- bai: 389 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến · $(a-b)^2+(b-c)^2+(c-a)^2=3(a^2+b^2+c^2)-(a+b+c)^2$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 bộ số thực: min của ba bình phương luôn <= (a^2+b^2+c^2)/2, khớp.
## DE
Chứng minh rằng tồn tại một trong các số $(a-b)^2$, $(b-c)^2$, $(c-a)^2$ không lớn hơn $\dfrac{a^2+b^2+c^2}{2}$.
## SACH
Gọi $m$ là số nhỏ nhất trong các hiệu $a-b$, $b-c$, $a-c$. Giả sử $a\ge b\ge c$ thì $m\ge0$. Ta có: $a-b\ge m\ge0\Rightarrow(a-b)^2\ge m^2$; $b-c\ge m\ge0\Rightarrow(b-c)^2\ge m^2$; $a-c\ge2m\ge0\Rightarrow(a-c)^2\ge4m^2$. Cộng từng vế: $(a-b)^2+(b-c)^2+(a-c)^2\ge6m^2\Rightarrow3(a^2+b^2+c^2)-(a+b+c)^2\ge6m^2\Rightarrow3(a^2+b^2+c^2)\ge6m^2\Rightarrow\dfrac{a^2+b^2+c^2}{2}\ge m^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Sắp $a\ge b\ge c$ thì khoảng cách lớn nhất $a-c$ bằng tổng hai khoảng cách kia, nên nếu gọi $m$ là khoảng cách nhỏ nhất thì tổng ba bình phương khoảng cách ít nhất là $6m^2$, và tổng ba bình phương này lại bị chặn bởi $3(a^2+b^2+c^2)$.

**Bước 1.** Sắp $a\ge b\ge c$ (đề đối xứng) và đặt $m$ là số nhỏ hơn trong hai hiệu $a-b$, $b-c$; khi đó $m\ge0$ và $a-c=(a-b)+(b-c)\ge2m$.

**Bước 2.** Bình phương ba bất đẳng thức $a-b\ge m$, $b-c\ge m$, $a-c\ge2m$ (các vế đều không âm) rồi cộng lại để được tổng ba bình phương không nhỏ hơn $6m^2$.

**Bước 3.** Biểu diễn tổng ba bình phương theo $3(a^2+b^2+c^2)-(a+b+c)^2$ và bỏ số hạng $(a+b+c)^2\ge0$ để chặn trên bởi $3(a^2+b^2+c^2)$.

**Bước 4.** Suy ra $m^2\le\dfrac{a^2+b^2+c^2}{2}$, mà $m^2$ chính là số nhỏ nhất trong ba bình phương đã cho.

**Phần 2. Trình bày**

Vì đề đối xứng nên giả sử $a\ge b\ge c$. Đặt $m=\min(a-b,\,b-c)\ge0$. Khi đó $a-b\ge m$, $b-c\ge m$, $a-c=(a-b)+(b-c)\ge2m$, nên $m^2=\min\{(a-b)^2,(b-c)^2,(c-a)^2\}$.

Bình phương (các vế đều không âm): $(a-b)^2\ge m^2$, $(b-c)^2\ge m^2$, $(a-c)^2\ge4m^2$. Cộng từng vế:

$(a-b)^2+(b-c)^2+(a-c)^2\ge6m^2$

Mà $(a-b)^2+(b-c)^2+(a-c)^2=2(a^2+b^2+c^2)-2(ab+bc+ca)=3(a^2+b^2+c^2)-(a+b+c)^2\le3(a^2+b^2+c^2)$.

Do đó $3(a^2+b^2+c^2)\ge6m^2$, suy ra $m^2\le\dfrac{a^2+b^2+c^2}{2}$.

Vậy số nhỏ nhất trong ba số $(a-b)^2$, $(b-c)^2$, $(c-a)^2$ không lớn hơn $\dfrac{a^2+b^2+c^2}{2}$.

=== V2B.390@p49
- bai: 390 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác · tích $(1-a)(1-b)(1-c)>0$ · khai triển $(a+b+c)^2$
- kiem: khong
- ket_qua_sach: a<1; b<1; c<1
- dap_an: a) $a<1,\ b<1,\ c<1$; b) Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 tam giác chu vi 2: a) mỗi cạnh <1, b) a^2+b^2+c^2+2abc<2, khớp.
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác có chu vi bằng $2$. a) So sánh $a,b,c$ với $1$; b) Chứng minh rằng $a^2+b^2+c^2+2abc<2$.
## SACH
a) Giả sử $a\ge b\ge c$. Ta có $a<b+c\Rightarrow2a<a+b+c=2\Rightarrow a<1\Rightarrow b<1$, $c<1$.

b) Từ câu a suy ra $(1-a)(1-b)(1-c)>0$. Rút gọn ta được $ab+bc+ca>1+abc$ (1). Ta lại có $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)\Rightarrow4=a^2+b^2+c^2+2(ab+bc+ca)$ (2). Từ (1) và (2) suy ra $4>a^2+b^2+c^2+2(1+abc)\Rightarrow4>a^2+b^2+c^2+2+2abc\Rightarrow a^2+b^2+c^2+2abc<2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chu vi bằng $2$ nên bất đẳng thức tam giác $a<b+c$ trở thành $2a<2$, tức mỗi cạnh nhỏ hơn $1$; ba hiệu $1-a$, $1-b$, $1-c$ dương nên tích của chúng dương, và khai triển tích đó sinh ra đúng các tổng $ab+bc+ca$ và $abc$ có mặt ở câu b).

**Bước 1.** Câu a): dùng bất đẳng thức tam giác $a<b+c$ rồi cộng $a$ vào hai vế để so sánh $2a$ với chu vi $2$, làm tương tự cho $b$ và $c$.

**Bước 2.** Câu b): từ ba hiệu $1-a$, $1-b$, $1-c$ dương, nhân lại rồi khai triển và thay $a+b+c=2$ để được $ab+bc+ca>1+abc$.

**Bước 3.** Bình phương chu vi $a+b+c=2$ để biểu diễn $a^2+b^2+c^2$ qua $ab+bc+ca$.

**Bước 4.** Thế đánh giá $ab+bc+ca>1+abc$ vào hệ thức vừa có để đi đến bất đẳng thức cần chứng minh.

**Phần 2. Trình bày**

a) Vì $a,b,c$ là ba cạnh của tam giác nên $a<b+c$, suy ra $2a<a+b+c=2$, tức $a<1$. Tương tự $b<1$, $c<1$. Vậy cả ba cạnh đều nhỏ hơn $1$.

b) Từ câu a): $1-a>0$, $1-b>0$, $1-c>0$ nên $(1-a)(1-b)(1-c)>0$.

Khai triển: $1-(a+b+c)+(ab+bc+ca)-abc>0$. Thay $a+b+c=2$: $ab+bc+ca>1+abc$ (1).

Mặt khác $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$ nên $4=a^2+b^2+c^2+2(ab+bc+ca)$ (2).

Từ (1) và (2): $4>a^2+b^2+c^2+2(1+abc)$, tức $a^2+b^2+c^2+2abc<2$.

=== V2B.391@p49
- bai: 391 · y: - · trang: 49 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: giá trị tuyệt đối $\lvert u+v\rvert\le\lvert u\rvert+\lvert v\rvert$ · tách phân thức $\dfrac{x+y}{xy}=\dfrac{1}{x}+\dfrac{1}{y}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 cặp (x,y) với |x|,|y|>=2: (x+y)/(xy) <= 1 luôn đúng, khớp. Câu b) sách chỉ ghi "suy ra từ câu a".
## DE
Cho $\lvert x\rvert\ge2$, $\lvert y\rvert\ge2$. Chứng minh rằng: a) $\dfrac{x+y}{xy}\le1$; b) Phương trình $\dfrac{xy}{x+y}=\dfrac{2003}{2004}$ vô nghiệm.
## SACH
a) $\dfrac{x+y}{xy}\le\left\lvert\dfrac{x+y}{xy}\right\rvert=\left\lvert\dfrac{1}{x}+\dfrac{1}{y}\right\rvert\le\dfrac{1}{\lvert x\rvert}+\dfrac{1}{\lvert y\rvert}\le\dfrac{1}{2}+\dfrac{1}{2}=1$ (vì $\lvert x\rvert\ge2$, $\lvert y\rvert\ge2$).

b) Suy ra từ câu a.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phân thức $\dfrac{x+y}{xy}$ tách được thành $\dfrac{1}{x}+\dfrac{1}{y}$, mà điều kiện $\lvert x\rvert\ge2$, $\lvert y\rvert\ge2$ chặn được $\lvert\dfrac{1}{x}\rvert$ và $\lvert\dfrac{1}{y}\rvert$ bởi $\dfrac{1}{2}$ nên tổng bị chặn bởi $1$; câu b) là hệ quả vì nghịch đảo của $\dfrac{2003}{2004}$ lớn hơn $1$.

**Bước 1.** Câu a): tách $\dfrac{x+y}{xy}=\dfrac{1}{x}+\dfrac{1}{y}$ để mỗi số hạng chỉ chứa một biến, rồi bao bằng giá trị tuyệt đối vì số hạng có thể âm.

**Bước 2.** Dùng bất đẳng thức $\lvert u+v\rvert\le\lvert u\rvert+\lvert v\rvert$ rồi chặn từng $\dfrac{1}{\lvert x\rvert}$, $\dfrac{1}{\lvert y\rvert}$ bởi $\dfrac{1}{2}$ nhờ $\lvert x\rvert,\lvert y\rvert\ge2$.

**Bước 3.** Câu b): giả sử phương trình có nghiệm rồi lấy nghịch đảo hai vế để được $\dfrac{x+y}{xy}=\dfrac{2004}{2003}$, và so với kết quả câu a).

**Phần 2. Trình bày**

a) Vì $\lvert x\rvert\ge2$, $\lvert y\rvert\ge2$ nên $x,y\ne0$ và $\dfrac{1}{\lvert x\rvert}\le\dfrac{1}{2}$, $\dfrac{1}{\lvert y\rvert}\le\dfrac{1}{2}$. Ta có:

$\dfrac{x+y}{xy}=\dfrac{1}{x}+\dfrac{1}{y}\le\left\lvert\dfrac{1}{x}+\dfrac{1}{y}\right\rvert\le\dfrac{1}{\lvert x\rvert}+\dfrac{1}{\lvert y\rvert}\le\dfrac{1}{2}+\dfrac{1}{2}=1$.

b) Giả sử $x,y$ thoả mãn $\dfrac{xy}{x+y}=\dfrac{2003}{2004}$ (khi đó $x+y\ne0$ và $xy\ne0$). Lấy nghịch đảo hai vế: $\dfrac{x+y}{xy}=\dfrac{2004}{2003}>1$, mâu thuẫn với câu a).

Vậy phương trình vô nghiệm (với $\lvert x\rvert\ge2$, $\lvert y\rvert\ge2$).

=== V2B.392@p50
- bai: 392 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: $(b+c)^2\ge4bc$ · $2(b^2+c^2)\ge(b+c)^2$ · đưa về một biến
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử: với a quét đều và b,c giải từ hệ, mọi nghiệm thực đều có các số nằm trong khoảng đã nêu (a) [0;4], b) [0;4/3]), khớp. Sách câu b) chỉ ghi "giải tương tự câu a"; lời giải kho viết đủ.
## DE
a) Cho $a+b+c=6$ và $ab+bc+ca=9$. Chứng minh rằng $0\le a\le4$, $0\le b\le4$ và $0\le c\le4$. b) Cho $a+b+c=2$ và $a^2+b^2+c^2=2$. Chứng minh rằng $0\le a\le\dfrac{4}{3}$, $0\le b\le\dfrac{4}{3}$ và $0\le c\le\dfrac{4}{3}$.
## SACH
a) Ta có $b+c=6-a$, $bc=9-a(b+c)=9-a(6-a)=9-6a+a^2$. Áp dụng bất đẳng thức $(b+c)^2\ge4bc$, ta được $(6-a)^2\ge4(9-6a+a^2)\Rightarrow3a^2-12a\le0\Rightarrow a(a-4)\le0\Rightarrow0\le a\le4$. Tương tự $0\le b\le4$, $0\le c\le4$.

b) Giải tương tự câu a). Có thể áp dụng bất đẳng thức $(b+c)^2\ge4bc$ hoặc áp dụng bất đẳng thức $2(b^2+c^2)\ge(b+c)^2$, ta được $3a^2-4a\le0$, từ đó suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chặn riêng $a$ thì giữ $a$ lại và biểu diễn tổng $b+c$ cùng tích $bc$ (hoặc tổng bình phương $b^2+c^2$) qua $a$, rồi dùng $(b+c)^2\ge4bc$ (hoặc $2(b^2+c^2)\ge(b+c)^2$) để có một bất đẳng thức bậc hai chỉ chứa $a$.

**Bước 1.** Câu a): từ hai giả thiết rút $b+c=6-a$ và $bc=9-a(b+c)=9-6a+a^2$ để mọi thứ chỉ phụ thuộc $a$.

**Bước 2.** Áp dụng $(b+c)^2\ge4bc$ (đúng với mọi số thực, dấu "=" khi $b=c$) để được bất đẳng thức bậc hai theo $a$, rồi giải bằng cách đưa về tích $a(a-4)\le0$.

**Bước 3.** Câu b): từ giả thiết rút $b+c=2-a$ và $b^2+c^2=2-a^2$, rồi dùng $2(b^2+c^2)\ge(b+c)^2$ để có bất đẳng thức bậc hai theo $a$.

**Bước 4.** Vì các giả thiết đối xứng theo ba biến nên kết quả cho $a$ cũng đúng cho $b$ và $c$ bằng cách đổi vai trò.

**Phần 2. Trình bày**

a) Từ $a+b+c=6$ ta có $b+c=6-a$. Từ $ab+bc+ca=9$ ta có $bc=9-a(b+c)=9-a(6-a)=a^2-6a+9$.

Vì $(b+c)^2\ge4bc$ nên $(6-a)^2\ge4(a^2-6a+9)$, tức $36-12a+a^2\ge4a^2-24a+36$, suy ra $3a^2-12a\le0$, tức $a(a-4)\le0$. Vậy $0\le a\le4$.

Các giả thiết đối xứng theo $a,b,c$ nên tương tự $0\le b\le4$, $0\le c\le4$.

b) Từ $a+b+c=2$ ta có $b+c=2-a$; từ $a^2+b^2+c^2=2$ ta có $b^2+c^2=2-a^2$.

Vì $2(b^2+c^2)\ge(b+c)^2$ nên $2(2-a^2)\ge(2-a)^2$, tức $4-2a^2\ge4-4a+a^2$, suy ra $3a^2-4a\le0$, tức $a(3a-4)\le0$. Vậy $0\le a\le\dfrac{4}{3}$.

Tương tự $0\le b\le\dfrac{4}{3}$, $0\le c\le\dfrac{4}{3}$.

=== V2B.393@p50
- bai: 393 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác $\lvert a-c\rvert<b$ · giá trị tuyệt đối của một tích · quy đồng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 tam giác ngẫu nhiên: |tổng - tổng| < 1 luôn đúng, khớp. Sách dùng "bạn đọc tự kiểm tra" cho đồng nhất thức; lời giải kho khai triển đủ.
## DE
Chứng minh rằng nếu $a,b,c$ là độ dài ba cạnh của một tam giác thì $\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert<1$.
## SACH
$\left\lvert\left(\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\right)-\left(\dfrac{a}{c}+\dfrac{c}{b}+\dfrac{b}{a}\right)\right\rvert<1\Leftrightarrow\left\lvert\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}\right\rvert<1\Leftrightarrow\left\lvert\dfrac{(a-c)ac+(b-a)ab+(c-b)bc}{abc}\right\rvert<1$ (1). Mặt khác $a,b,c$ là ba cạnh của một tam giác nên $\dfrac{\lvert a-c\rvert}{b}<1$, $\dfrac{\lvert b-a\rvert}{c}<1$, $\dfrac{\lvert c-b\rvert}{a}<1$ suy ra $\dfrac{\lvert(a-c)(b-a)(c-b)\rvert}{abc}<1$ (2). Biểu thức trong dấu giá trị tuyệt đối của (2) và (1) đối nhau (bạn đọc tự kiểm tra), do đó từ (2) suy ra (1).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu hai tổng nhóm lại thành $\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}$, và sau khi quy đồng tử số là $-(a-c)(b-a)(c-b)$ nên giá trị tuyệt đối là tích của ba phân số $\dfrac{\lvert a-c\rvert}{b}$, $\dfrac{\lvert b-a\rvert}{c}$, $\dfrac{\lvert c-b\rvert}{a}$, mà mỗi phân số nhỏ hơn $1$ do bất đẳng thức tam giác.

**Bước 1.** Nhóm các số hạng cùng mẫu để hiệu hai tổng thành $\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}$.

**Bước 2.** Quy đồng về mẫu $abc$ rồi khai triển tử số để nhận ra nó bằng $-(a-c)(b-a)(c-b)$.

**Bước 3.** Dùng bất đẳng thức tam giác $\lvert a-c\rvert<b$, $\lvert b-a\rvert<c$, $\lvert c-b\rvert<a$ để mỗi tỉ số $\dfrac{\lvert a-c\rvert}{b}$ và hai tỉ số còn lại nhỏ hơn $1$.

**Bước 4.** Nhân ba tỉ số đều dương và nhỏ hơn $1$ lại để chặn giá trị tuyệt đối của hiệu đã cho nhỏ hơn $1$.

**Phần 2. Trình bày**

Gọi $E$ là biểu thức trong dấu giá trị tuyệt đối. Nhóm các hạng tử cùng mẫu:

$E=\dfrac{a-c}{b}+\dfrac{b-a}{c}+\dfrac{c-b}{a}=\dfrac{(a-c)ac+(b-a)ab+(c-b)bc}{abc}$

Khai triển tử số: $(a-c)ac+(b-a)ab+(c-b)bc=a^2c-ac^2+ab^2-a^2b+bc^2-b^2c$.

Khai triển $(a-c)(b-a)(c-b)=-ab^2-a^2c+a^2b-bc^2+b^2c+ac^2$, đối của tử số ở trên. Vậy $E=-\dfrac{(a-c)(b-a)(c-b)}{abc}$.

Do đó $\lvert E\rvert=\dfrac{\lvert a-c\rvert}{b}\cdot\dfrac{\lvert b-a\rvert}{c}\cdot\dfrac{\lvert c-b\rvert}{a}$.

Vì $a,b,c$ là ba cạnh của tam giác nên $\lvert a-c\rvert<b$, $\lvert b-a\rvert<c$, $\lvert c-b\rvert<a$, tức ba phân số trên đều không âm và nhỏ hơn $1$. Nhân ba bất đẳng thức (các vế không âm) được $\lvert E\rvert<1$.

=== V2B.394@p50
- bai: 394 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số $x+y\ge2\sqrt{xy}$ với $x,y>0$ · $(x+y)^2\ge4xy$ ⇒ $\dfrac{xy}{x+y}\le\dfrac{x+y}{4}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ dương: a) và b) đúng, khớp.
## DE
Chứng minh rằng với $a,b,c>0$ thì: a) $\dfrac{bc}{a}+\dfrac{ac}{b}+\dfrac{ab}{c}\ge a+b+c$; b) $\dfrac{ab}{a+b}+\dfrac{bc}{b+c}+\dfrac{ca}{c+a}\le\dfrac{a+b+c}{2}$.
## SACH
a) $\dfrac{bc}{a}+\dfrac{ac}{b}=c\left(\dfrac{b}{a}+\dfrac{a}{b}\right)\ge2c$ (do $a,b,c>0$). Tương tự: $\dfrac{ac}{b}+\dfrac{ab}{c}\ge2a$, $\dfrac{ab}{c}+\dfrac{bc}{a}\ge2b$. Cộng từng vế ba bất đẳng thức trên.

b) Áp dụng bất đẳng thức $\dfrac{x+y}{xy}\ge\dfrac{4}{x+y}$ với $x,y>0$ (ví dụ 77b), ta có: $\dfrac{ab}{a+b}\le\dfrac{a+b}{4}$, $\dfrac{bc}{b+c}\le\dfrac{b+c}{4}$, $\dfrac{ca}{c+a}\le\dfrac{c+a}{4}$. Cộng từng vế ba bất đẳng thức trên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ở câu a), mỗi tổng hai phân số cùng chứa một biến ở tử đặt được nhân tử chung $c(\dfrac{b}{a}+\dfrac{a}{b})$, rồi $\dfrac{b}{a}+\dfrac{a}{b}\ge2$ (Cô-si); ở câu b), mỗi phân thức $\dfrac{ab}{a+b}$ được chặn trên bằng $\dfrac{a+b}{4}$, và cộng ba chặn lại cho đúng $\dfrac{a+b+c}{2}$.

**Bước 1.** Câu a): ghép từng cặp hai số hạng và đặt nhân tử chung để xuất hiện tổng $\dfrac{b}{a}+\dfrac{a}{b}$ của hai số dương nghịch đảo nhau.

**Bước 2.** Áp dụng Cô-si $\dfrac{b}{a}+\dfrac{a}{b}\ge2$ cho từng cặp, rồi cộng ba bất đẳng thức để được hai lần vế trái lớn hơn hoặc bằng hai lần $a+b+c$.

**Bước 3.** Câu b): với mỗi cặp biến dùng $(a+b)^2\ge4ab$ để suy ra $\dfrac{ab}{a+b}\le\dfrac{a+b}{4}$, nhờ chia hai vế cho $4(a+b)>0$.

**Bước 4.** Cộng ba bất đẳng thức theo hoán vị vòng quanh để tử số cộng thành $2(a+b+c)$ trên mẫu $4$.

**Phần 2. Trình bày**

a) Với $a,b,c>0$, theo Cô-si $\dfrac{b}{a}+\dfrac{a}{b}\ge2$ (dấu "=" khi $a=b$), nên:

$\dfrac{bc}{a}+\dfrac{ac}{b}=c\left(\dfrac{b}{a}+\dfrac{a}{b}\right)\ge2c$

Tương tự $\dfrac{ac}{b}+\dfrac{ab}{c}\ge2a$ và $\dfrac{ab}{c}+\dfrac{bc}{a}\ge2b$.

Cộng từng vế: $2\left(\dfrac{bc}{a}+\dfrac{ac}{b}+\dfrac{ab}{c}\right)\ge2(a+b+c)$, suy ra $\dfrac{bc}{a}+\dfrac{ac}{b}+\dfrac{ab}{c}\ge a+b+c$ (dấu "=" khi $a=b=c$).

b) Với $a,b>0$: $(a+b)^2\ge4ab$ (dấu "=" khi $a=b$), chia hai vế cho $4(a+b)>0$ được $\dfrac{ab}{a+b}\le\dfrac{a+b}{4}$.

Tương tự $\dfrac{bc}{b+c}\le\dfrac{b+c}{4}$ và $\dfrac{ca}{c+a}\le\dfrac{c+a}{4}$.

Cộng từng vế: $\dfrac{ab}{a+b}+\dfrac{bc}{b+c}+\dfrac{ca}{c+a}\le\dfrac{2(a+b+c)}{4}=\dfrac{a+b+c}{2}$ (dấu "=" khi $a=b=c$).

=== V2B.395@p50
- bai: 395 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội, làm giảm (thêm bớt ở mẫu của phân số dương)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200000 bộ dương: tổng luôn nằm trong (1;2), khớp.
## DE
Chứng minh rằng với $a,b,c>0$ thì $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.
## SACH
Do $a,b,c$ dương nên: $\dfrac{a}{a+b+c}<\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$; $\dfrac{b}{b+c+a}<\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$; $\dfrac{c}{c+a+b}<\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$. Cộng từng vế: $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba phân số có ba mẫu khác nhau, không cộng được ngay, nên làm giảm và làm trội từng phân số về cùng mẫu $a+b+c$: thêm $c$ vào mẫu thì phân số giảm, thêm $c$ vào cả tử và mẫu thì phân số (nhỏ hơn $1$) tăng; khi đó tổng các tử ở hai đầu là $a+b+c$ và $2(a+b+c)$.

**Bước 1.** Làm giảm $\dfrac{a}{a+b}$ bằng cách thêm $c>0$ vào mẫu, để mẫu của cả ba phân số đều thành $a+b+c$.

**Bước 2.** Làm trội $\dfrac{a}{a+b}$ bằng cách thêm $c$ vào cả tử lẫn mẫu, vì phân số có tử nhỏ hơn mẫu thì thêm cùng một số dương vào tử và mẫu làm nó tăng.

**Bước 3.** Viết hai đánh giá cho ba phân số theo hoán vị vòng $a\to b\to c\to a$ rồi cộng từng vế để chặn tổng giữa $1$ và $2$.

**Phần 2. Trình bày**

Vì $a,b,c>0$ nên:

$\dfrac{a}{a+b+c}<\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$ (phân số $\dfrac{a}{a+b}<1$ nên thêm $c$ vào cả tử và mẫu làm tăng giá trị)

$\dfrac{b}{a+b+c}<\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$

$\dfrac{c}{a+b+c}<\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$

Cộng từng vế ba hàng: $\dfrac{a+b+c}{a+b+c}<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<\dfrac{2(a+b+c)}{a+b+c}$, tức $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.

=== V2B.396@p50
- bai: 396 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số · $x+\dfrac{1}{x}\ge2$ với $x>0$ · tách $\dfrac{a^2}{b}=\left(\dfrac{a^2}{b}+b\right)-b$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 bộ dương: a), b), c) đều đúng, khớp. Dấu "=" của cả ba câu xảy ra khi a=b=c.
## DE
Chứng minh rằng với $a,b,c>0$ thì: a) $\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\ge\dfrac{a}{b}+\dfrac{b}{a}$; b) $\dfrac{a^2}{b}+\dfrac{b^2}{c}+\dfrac{c^2}{a}\ge a+b+c$; c) $\dfrac{a^2}{b+c}+\dfrac{b^2}{c+a}+\dfrac{c^2}{a+b}\ge\dfrac{a+b+c}{2}$.
## SACH
a) $A=\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\right)-\left(\dfrac{a}{b}+\dfrac{b}{a}\right)=\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\right)-2\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)$. Do $a,b>0$ nên $A\ge\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\right)-2\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+2=\left(\dfrac{a}{b}-1\right)^2+\left(\dfrac{b}{a}-1\right)^2\ge0$.

b) Xét $\dfrac{a^2}{b}+b=\dfrac{a^2+b^2}{b}\ge\dfrac{2ab}{b}=2a$ (do $a,b>0$). Tương tự $\dfrac{b^2}{c}+c\ge2b$, $\dfrac{c^2}{a}+a\ge2c$. Cộng từng vế ba bất đẳng thức trên.

c) Xét $\dfrac{a^2}{b+c}+\dfrac{b+c}{4}=\dfrac{(2a)^2+(b+c)^2}{4(b+c)}\ge\dfrac{4a(b+c)}{4(b+c)}=a$ (do $b,c>0$). Tương tự $\dfrac{b^2}{c+a}+\dfrac{c+a}{4}\ge b$, $\dfrac{c^2}{a+b}+\dfrac{a+b}{4}\ge c$. Cộng từng vế ba bất đẳng thức trên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi câu có một số hạng $\dfrac{x^2}{y}$ có thể "bù" thêm một lượng tuyến tính để dùng Cô-si $\dfrac{x^2}{y}+ky\ge2\sqrt{k}\,x$ và triệt tiêu mẫu; hệ số $k$ chọn theo điểm rơi $a=b=c$ (câu b: $k=1$, câu c: $k=\dfrac{1}{4}$).

**Bước 1.** Câu a): đặt $t=\dfrac{a}{b}>0$ rồi viết bất đẳng thức thành $t^2+\dfrac{1}{t^2}\ge t+\dfrac{1}{t}$, và tách $t+\dfrac{1}{t}=2(t+\dfrac{1}{t})-(t+\dfrac{1}{t})$ để dùng $t+\dfrac{1}{t}\ge2$.

**Bước 2.** Gom được tổng hai bình phương $\left(t-1\right)^2+\left(\dfrac{1}{t}-1\right)^2$ không âm, từ đó kết luận câu a).

**Bước 3.** Câu b): cộng thêm $b$ vào số hạng $\dfrac{a^2}{b}$ để tử thành $a^2+b^2\ge2ab$ và mẫu $b$ được triệt tiêu, rồi hoán vị vòng quanh và cộng ba bất đẳng thức.

**Bước 4.** Câu c): cộng thêm $\dfrac{b+c}{4}$ vào $\dfrac{a^2}{b+c}$ để dùng $(2a)^2+(b+c)^2\ge4a(b+c)$ và triệt tiêu mẫu $b+c$, rồi hoán vị vòng quanh và cộng.

**Chú ý:** Chọn nhầm hệ số bù (chẳng hạn cộng $b+c$ thay vì $\dfrac{b+c}{4}$) thì dấu "=" không xảy ra ở $a=b=c$ và bất đẳng thức không còn khớp với vế phải.

**Phần 2. Trình bày**

a) Đặt $t=\dfrac{a}{b}>0$, bất đẳng thức cần chứng minh là $t^2+\dfrac{1}{t^2}\ge t+\dfrac{1}{t}$. Gọi $A$ là hiệu hai vế. Vì $t>0$ nên $t+\dfrac{1}{t}\ge2$ (Cô-si, dấu "=" khi $t=1$), do đó:

$A=\left(t^2+\dfrac{1}{t^2}\right)-2\left(t+\dfrac{1}{t}\right)+\left(t+\dfrac{1}{t}\right)\ge\left(t^2+\dfrac{1}{t^2}\right)-2\left(t+\dfrac{1}{t}\right)+2$

$=(t-1)^2+\left(\dfrac{1}{t}-1\right)^2\ge0$.

Vậy $\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\ge\dfrac{a}{b}+\dfrac{b}{a}$.

b) Với $a,b>0$: $\dfrac{a^2}{b}+b=\dfrac{a^2+b^2}{b}\ge\dfrac{2ab}{b}=2a$ (vì $a^2+b^2\ge2ab$).

Tương tự $\dfrac{b^2}{c}+c\ge2b$, $\dfrac{c^2}{a}+a\ge2c$. Cộng từng vế:

$\dfrac{a^2}{b}+\dfrac{b^2}{c}+\dfrac{c^2}{a}+(a+b+c)\ge2(a+b+c)$, suy ra $\dfrac{a^2}{b}+\dfrac{b^2}{c}+\dfrac{c^2}{a}\ge a+b+c$ (dấu "=" khi $a=b=c$).

c) Với $b,c>0$: $\dfrac{a^2}{b+c}+\dfrac{b+c}{4}=\dfrac{(2a)^2+(b+c)^2}{4(b+c)}\ge\dfrac{4a(b+c)}{4(b+c)}=a$ (vì $(2a)^2+(b+c)^2\ge2\cdot2a(b+c)$).

Tương tự $\dfrac{b^2}{c+a}+\dfrac{c+a}{4}\ge b$, $\dfrac{c^2}{a+b}+\dfrac{a+b}{4}\ge c$. Cộng từng vế:

$\dfrac{a^2}{b+c}+\dfrac{b^2}{c+a}+\dfrac{c^2}{a+b}+\dfrac{2(a+b+c)}{4}\ge a+b+c$, suy ra $\dfrac{a^2}{b+c}+\dfrac{b^2}{c+a}+\dfrac{c^2}{a+b}\ge\dfrac{a+b+c}{2}$ (dấu "=" khi $a=b=c$).

=== V2B.397@p50
- bai: 397 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: sắp thứ tự các biến · xét hiệu · so sánh các phân số có tử bằng $1$ (hàm giảm theo biến)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy thử 200000 bộ dương: bất đẳng thức đúng, khớp; kiểm cả đồng nhất thức tách hiệu thành ba nhóm theo (a-b), (a-c), (b-c).
## DE
Chứng minh rằng với $a,b,c>0$ thì $\dfrac{a^2}{b^2+c^2}+\dfrac{b^2}{c^2+a^2}+\dfrac{c^2}{a^2+b^2}\ge\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}$.
## SACH
Xét: $\dfrac{a^2}{b^2+c^2}-\dfrac{a}{b+c}=\dfrac{a(ab+ac-b^2-c^2)}{(b^2+c^2)(b+c)}=\dfrac{ab(a-b)+ac(a-c)}{(b^2+c^2)(b+c)}$ (1). Tương tự $\dfrac{b^2}{c^2+a^2}-\dfrac{b}{c+a}=\dfrac{bc(b-c)+ba(b-a)}{(c^2+a^2)(c+a)}$ (2); $\dfrac{c^2}{a^2+b^2}-\dfrac{c}{a+b}=\dfrac{ca(c-a)+cb(c-b)}{(a^2+b^2)(a+b)}$ (3). Cộng từng vế (1), (2), (3) ta được: $\left(\dfrac{a^2}{b^2+c^2}+\dfrac{b^2}{c^2+a^2}+\dfrac{c^2}{a^2+b^2}\right)-\left(\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\right)=ab(a-b)\left[\dfrac{1}{(b^2+c^2)(b+c)}-\dfrac{1}{(a^2+c^2)(a+c)}\right]+ac(a-c)\left[\dfrac{1}{(b^2+c^2)(b+c)}-\dfrac{1}{(a^2+b^2)(a+b)}\right]+bc(b-c)\left[\dfrac{1}{(a^2+c^2)(a+c)}-\dfrac{1}{(a^2+b^2)(a+b)}\right]$. Giả sử $a\ge b\ge c>0$ thì các dấu ngoặc tròn và ngoặc vuông của biểu thức trên đều không âm. Suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu của từng cặp $\dfrac{a^2}{b^2+c^2}-\dfrac{a}{b+c}$ có tử số là tổng của các tích dạng $ab(a-b)$, nên gom các số hạng theo từng hiệu $a-b$, $a-c$, $b-c$ và sắp thứ tự $a\ge b\ge c$ để mọi thừa số đều không âm.

**Bước 1.** Lập hiệu $\dfrac{a^2}{b^2+c^2}-\dfrac{a}{b+c}$, quy đồng rồi tách tử $a(ab+ac-b^2-c^2)$ thành $ab(a-b)+ac(a-c)$ để chuyển thành các tích có hiệu hai biến.

**Bước 2.** Viết hai hiệu còn lại theo hoán vị vòng quanh và cộng cả ba để hiệu cần xét thành tổng các số hạng chứa $a-b$, $a-c$, $b-c$.

**Bước 3.** Đặt $F(x,y)=\dfrac{1}{(x^2+y^2)(x+y)}$ rồi gom các số hạng cùng hiệu để mỗi nhóm có dạng tích của một hiệu hai biến với hiệu hai giá trị của $F$.

**Bước 4.** Sắp $a\ge b\ge c>0$ rồi dùng việc $F$ giảm khi một biến tăng để chỉ ra mọi thừa số của ba nhóm đều không âm.

**Chú ý:** Biểu thức đối xứng theo ba biến nên được sắp thứ tự mà không mất tính tổng quát; dấu "=" xảy ra khi $a=b=c$.

**Phần 2. Trình bày**

Đặt $F(x,y)=\dfrac{1}{(x^2+y^2)(x+y)}$ với $x,y>0$. Biểu thức đối xứng nên giả sử $a\ge b\ge c>0$.

Ta có $\dfrac{a^2}{b^2+c^2}-\dfrac{a}{b+c}=\dfrac{a(ab+ac-b^2-c^2)}{(b^2+c^2)(b+c)}=\dfrac{ab(a-b)+ac(a-c)}{(b^2+c^2)(b+c)}=\left[ab(a-b)+ac(a-c)\right]F(b,c)$.

Tương tự $\dfrac{b^2}{c^2+a^2}-\dfrac{b}{c+a}=\left[bc(b-c)+ba(b-a)\right]F(c,a)$ và $\dfrac{c^2}{a^2+b^2}-\dfrac{c}{a+b}=\left[ca(c-a)+cb(c-b)\right]F(a,b)$.

Cộng ba đẳng thức, gọi $D$ là hiệu hai vế của bất đẳng thức cần chứng minh, gom theo $a-b$, $a-c$, $b-c$:

$D=ab(a-b)\left[F(b,c)-F(c,a)\right]+ac(a-c)\left[F(b,c)-F(a,b)\right]+bc(b-c)\left[F(c,a)-F(a,b)\right]$

$F$ giảm khi mỗi biến tăng. Vì $a\ge b\ge c>0$ nên $(c^2+a^2)(c+a)\ge(b^2+c^2)(b+c)$, tức $F(c,a)\le F(b,c)$; $(a^2+b^2)(a+b)\ge(b^2+c^2)(b+c)$, tức $F(a,b)\le F(b,c)$; $(a^2+b^2)(a+b)\ge(c^2+a^2)(c+a)$ (vì $b\ge c$), tức $F(a,b)\le F(c,a)$.

Do đó ba hiệu trong ngoặc vuông đều không âm, và $a-b\ge0$, $a-c\ge0$, $b-c\ge0$. Vậy $D\ge0$, tức bất đẳng thức đúng (dấu "=" khi $a=b=c$).

=== V2B.398@p50
- bai: 398 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội (thay $225$ bằng $200$) · so sánh hai luỹ thừa cùng số mũ · luỹ thừa của $10$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: SÁCH IN SAI SỐ MŨ: đề in $\left(\dfrac{2}{225}\right)^{100}$ nhưng lời giải sách tính với số mũ 1000. Máy: $\log_{10}\left(\dfrac{2}{225}\right)^{100}\approx-205{,}1$ nên với mũ 100 chỉ có 205 chữ số 0 đầu tiên, KHÔNG phải 2000 (đề in sai); với mũ 1000 thì $\approx-2051{,}2$, tức 2051 chữ số 0 đầu, đúng. Đề chép đúng như sách in (mũ 100); lời giải kho theo bản đúng (mũ 1000). Người nhận lô cần quyết định sửa đề thành mũ 1000.
## DE
Chứng minh rằng khi viết dưới dạng số thập phân vô hạn, số $\left(\dfrac{2}{225}\right)^{100}$ có $2000$ chữ số thập phân đầu tiên sau dấu phẩy bằng $0$.
## SACH
Ta có: $\left(\dfrac{2}{225}\right)^{1000}<\left(\dfrac{2}{200}\right)^{1000}=\left(\dfrac{1}{10^2}\right)^{1000}=\dfrac{1}{10^{2000}}=0,\underbrace{00\ldots0}_{1999}1$. Suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn có $2000$ chữ số $0$ liền sau dấu phẩy thì số đó phải nhỏ hơn $10^{-2000}$; vì $2$ chia $200$ cho đúng $\dfrac{1}{100}$ nên làm trội mẫu $225$ thành $200$ để được một luỹ thừa của $10$.

**Bước 1.** Làm trội phân số: vì $225>200$ nên $\dfrac{2}{225}<\dfrac{2}{200}=\dfrac{1}{10^2}$, và số $\dfrac{1}{10^2}$ là luỹ thừa của $10$ nên dễ biết số chữ số $0$.

**Bước 2.** Nâng hai vế (dương) lên luỹ thừa bằng số mũ $1000$ để đánh giá số cần xét bé hơn $\dfrac{1}{10^{2000}}$.

**Bước 3.** Viết $\dfrac{1}{10^{2000}}$ dưới dạng thập phân $0,\underbrace{00\ldots0}_{1999}1$ rồi suy ra một số dương nhỏ hơn nó có ít nhất $2000$ chữ số $0$ đầu tiên sau dấu phẩy.

**Chú ý:** Đề in số mũ $100$, nhưng với mũ $100$ số này bằng khoảng $10^{-205}$ và chỉ có $205$ chữ số $0$ liền sau dấu phẩy; yêu cầu $2000$ chữ số $0$ chỉ đúng với số mũ $1000$, nên lời giải dưới đây làm với số mũ $1000$.

**Phần 2. Trình bày**

(Với số mũ $1000$.) Vì $225>200$ nên $0<\dfrac{2}{225}<\dfrac{2}{200}=\dfrac{1}{10^2}$.

Nâng hai vế lên luỹ thừa $1000$: $\left(\dfrac{2}{225}\right)^{1000}<\left(\dfrac{1}{10^2}\right)^{1000}=\dfrac{1}{10^{2000}}=0,\underbrace{00\ldots0}_{1999}1$.

Số dương nhỏ hơn $\dfrac{1}{10^{2000}}$ thì $2000$ chữ số thập phân đầu tiên đều bằng $0$ (chữ số khác $0$ đầu tiên chỉ có thể xuất hiện từ vị trí thứ $2001$ trở đi).

Vậy số $\left(\dfrac{2}{225}\right)^{1000}$ có $2000$ chữ số thập phân đầu tiên sau dấu phẩy bằng $0$.

=== V2B.399@p50
- bai: 399 · y: - · trang: 50 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: cộng các hệ thức truy hồi (làm trội, làm giảm) · bình phương $a_{n+1}^2=a_n^2+2+\dfrac{1}{a_n^2}$ · dãy tăng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Bài *. Máy tính dãy: a_51 ≈ 11,217 và a_101 ≈ 15,037; tổng 1/a_k^2 (k=1..100) ≈ 1,11 < 3,01, khớp sách.
## DE
Cho $101$ số $a_1,a_2,\ldots,a_{101}$ trong đó $a_1=5$, $a_2=a_1+\dfrac{1}{a_1}$, $\ldots$, $a_{n+1}=a_n+\dfrac{1}{a_n}$ với mọi $n\ge1$. Chứng minh rằng: a) $a_{51}>11$; b) $15<a_{101}<15,1$.
## SACH
a) Theo giả thiết, $a_{n+1}^2=a_n^2+\dfrac{1}{a_n^2}+2$. Do đó: $a_1^2=25$; $a_2^2=a_1^2+\dfrac{1}{a_1^2}+2$; $\ldots$; $a_{51}^2=a_{50}^2+\dfrac{1}{a_{50}^2}+2$. Cộng từng vế: $a_{51}^2=\left(\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{50}^2}\right)+125>11^2\Rightarrow a_{51}>11$.

b) Tương tự như câu a: $a_{101}^2=\left(\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{100}^2}\right)+225>15^2\Rightarrow a_{101}>15$. Để chứng minh $a_{101}<15,1$, chú ý rằng $15,1^2=228,01$ ta cần chứng minh: $\dfrac{1}{a_1^2}+\dfrac{1}{a_2^2}+\ldots+\dfrac{1}{a_{100}^2}<3,01$. Ta có: $\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{100}^2}=\left(\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{50}^2}\right)+\left(\dfrac{1}{a_{51}^2}+\ldots+\dfrac{1}{a_{100}^2}\right)<50\cdot\dfrac{1}{a_1^2}+50\cdot\dfrac{1}{a_{51}^2}<50\cdot\dfrac{1}{25}+50\cdot\dfrac{1}{11^2}<2+\dfrac{1}{2}<3,01$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Công thức truy hồi $a_{n+1}=a_n+\dfrac{1}{a_n}$ bình phương lên được $a_{n+1}^2=a_n^2+2+\dfrac{1}{a_n^2}$ — mỗi bước tăng bình phương thêm $2$ cộng một số dương bé, nên cộng các hệ thức lại thì hầu hết các số hạng bình phương triệt tiêu và $a_n^2$ gần bằng $25+2(n-1)$.

**Bước 1.** Bình phương hệ thức truy hồi để có $a_{n+1}^2-a_n^2=2+\dfrac{1}{a_n^2}$, rồi cộng các hệ thức từ $n=1$ đến $n=50$ để tổng hiệu triệt tiêu còn $a_{51}^2-a_1^2$.

**Bước 2.** Lập luận $\dfrac{1}{a_k^2}>0$ nên $a_{51}^2>25+2\cdot50=125>11^2$, suy ra câu a); tương tự với $n$ từ $1$ đến $100$ được $a_{101}^2>225=15^2$.

**Bước 3.** Để chặn trên, chứng minh dãy tăng (mỗi số hạng dương cộng thêm một số dương) rồi dùng $a_k\ge a_1=5$ cho $k\le50$ và $a_k\ge a_{51}>11$ cho $k\ge51$ để làm trội các số hạng $\dfrac{1}{a_k^2}$.

**Bước 4.** Chặn tổng $\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{100}^2}$ nhỏ hơn $3,01$ rồi suy ra $a_{101}^2<225+3,01=15,1^2$.

**Phần 2. Trình bày**

Vì $a_1=5>0$ và $a_{n+1}=a_n+\dfrac{1}{a_n}$ nên mọi $a_n>0$ và dãy tăng: $a_1<a_2<\ldots<a_{101}$. Bình phương hệ thức truy hồi: $a_{n+1}^2=a_n^2+2+\dfrac{1}{a_n^2}$ (1).

a) Cộng (1) với $n=1,2,\ldots,50$: $a_{51}^2=a_1^2+2\cdot50+\left(\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{50}^2}\right)=125+\left(\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{50}^2}\right)>125>121=11^2$. Vậy $a_{51}>11$.

b) Cộng (1) với $n=1,2,\ldots,100$: $a_{101}^2=225+S$ với $S=\dfrac{1}{a_1^2}+\ldots+\dfrac{1}{a_{100}^2}>0$. Do đó $a_{101}^2>225$, tức $a_{101}>15$.

Vì dãy tăng nên với $k\le50$: $a_k\ge a_1=5$, nên $\dfrac{1}{a_k^2}\le\dfrac{1}{25}$; với $k\ge51$: $a_k\ge a_{51}>11$, nên $\dfrac{1}{a_k^2}<\dfrac{1}{121}$. Suy ra

$S<50\cdot\dfrac{1}{25}+50\cdot\dfrac{1}{121}=2+\dfrac{50}{121}<2+\dfrac{1}{2}<3,01$.

Vậy $a_{101}^2<225+3,01=228,01=15,1^2$, tức $a_{101}<15,1$. Kết hợp: $15<a_{101}<15,1$.

=== V2B.400@p51
- bai: 400 · y: - · trang: 51 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · bất đẳng thức tam giác (điều kiện ba đoạn không lập thành tam giác) · sắp thứ tự các số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử dãy ngắn nhất không tạo tam giác: 10, 10, 20, 30, 50, 80; số thứ sáu tối thiểu 80 > 75, khớp.
## DE
Cho sáu đoạn thẳng có độ dài trong khoảng từ $10$ cm đến $75$ cm. Chứng minh rằng bao giờ cũng chọn được ba đoạn thẳng làm thành ba cạnh của một tam giác.
## SACH
Gọi độ dài các đoạn thẳng đã cho là $a_1,a_2,\ldots,a_6$. Giả sử $10\le a_1\le a_2\le\ldots\le a_6\le75$. Nếu bất kì ba đoạn thẳng nào cũng không thể lập thành một tam giác thì: $a_3\ge a_1+a_2\ge10+10=20$; $a_4\ge a_2+a_3\ge10+20=30$; $a_5\ge a_3+a_4\ge20+30=50$; $a_6\ge a_4+a_5\ge30+50=80$, vô lí.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba đoạn thẳng lập được tam giác khi đoạn lớn nhất nhỏ hơn tổng hai đoạn còn lại, nên nếu không bộ ba nào lập được thì các độ dài (sắp tăng dần) tăng nhanh như dãy Phi-bô-na-xi, và sáu số thì đã vượt quá $75$.

**Bước 1.** Sắp các độ dài $10\le a_1\le a_2\le\ldots\le a_6\le75$ rồi giả sử không có ba đoạn nào lập thành tam giác, tức với mọi $i<j<k$ có $a_k\ge a_i+a_j$.

**Bước 2.** Áp dụng điều đó lần lượt cho các bộ ba $(a_1,a_2,a_3)$, $(a_2,a_3,a_4)$, $(a_3,a_4,a_5)$, $(a_4,a_5,a_6)$ để có các cận dưới $20$, $30$, $50$, $80$.

**Bước 3.** So $a_6\ge80$ với giả thiết $a_6\le75$ để nêu mâu thuẫn.

**Phần 2. Trình bày**

Gọi độ dài sáu đoạn thẳng là $a_1,a_2,\ldots,a_6$ và sắp theo thứ tự $10\le a_1\le a_2\le\ldots\le a_6\le75$.

Giả sử không có ba đoạn nào trong sáu đoạn lập được thành một tam giác. Ba đoạn $x\le y\le z$ lập được tam giác khi và chỉ khi $x+y>z$, nên với mọi $i<j<k$ ta có $a_k\ge a_i+a_j$. Khi đó:

$a_3\ge a_1+a_2\ge10+10=20$

$a_4\ge a_2+a_3\ge10+20=30$

$a_5\ge a_3+a_4\ge20+30=50$

$a_6\ge a_4+a_5\ge30+50=80$

Điều này mâu thuẫn với $a_6\le75$. Vậy bao giờ cũng chọn được ba đoạn thẳng làm thành ba cạnh của một tam giác.

=== V2B.401@p51
- bai: 401 · y: - · trang: 51 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bài toán chuyển động xuôi dòng, ngược dòng · so sánh hai phân thức cùng tử · $a^2-b^2>a^2-c^2$ khi $0<b<c<a$
- kiem: khong
- ket_qua_sach: Cả hai đều sai (thời gian hôm sau lâu hơn)
- dap_an: Cả hai đều sai: thời gian hôm sau lâu hơn hôm trước
- ghi_chu_nghi: Máy thử 100000 bộ (a,b,c) với 0<b<c<a: luôn x<y. Điều kiện a>c (thuyền ngược dòng được cả hôm sau) sách dùng ngầm, lời giải kho nêu rõ.
## DE
Đố vui: Ai nói đúng? Một đơn vị công an hằng ngày dùng thuyền máy đi xuôi khúc sông từ A đến B rồi quay trở lại A. Hôm ấy, dòng nước chảy nhanh hơn hôm trước. Chiến sĩ Tâm vui vẻ nói: "Hôm nay nước chảy nhanh, thuyền xuôi nhanh hơn nên ta sẽ về sớm hơn." Chiến sĩ Hoà không tán thành: "Đi nhanh được bao nhiêu thì lại về chậm bấy nhiêu! Như vậy thuyền vẫn đi với thời gian như hôm trước." Ai đúng? Ai sai? Biết rằng vận tốc riêng của thuyền máy không đổi trong cả hai ngày.
## SACH
Gọi khoảng cách AB là $s$ (km), vận tốc riêng của thuyền máy là $a$ (km/h), vận tốc dòng nước ngày hôm trước là $b$ (km/h), vận tốc dòng nước ngày hôm sau là $c$ (km/h) trong đó $s>0$, $a>0$, $0<b<c$. Ngày hôm trước, vận tốc thuyền lúc xuôi là $a+b$ (km/h) lúc ngược là $a-b$ (km/h), thời gian đi khứ hồi (đi từ A đến B rồi trở về A) là: $x=\dfrac{s}{a+b}+\dfrac{s}{a-b}=\dfrac{2as}{a^2-b^2}$ (giờ). Tương tự, thời gian đi khứ hồi trong ngày hôm sau là: $y=\dfrac{s}{a+c}+\dfrac{s}{a-c}=\dfrac{2as}{a^2-c^2}$ (giờ). Do $0<b<c$ nên $a^2-b^2>a^2-c^2\Rightarrow\dfrac{2as}{a^2-b^2}<\dfrac{2as}{a^2-c^2}\Rightarrow x<y$. Như vậy cả Tâm lẫn Hoà đều sai: thời gian thuyền đi hôm sau lâu hơn hôm trước.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn biết ai đúng phải lập thời gian khứ hồi theo vận tốc riêng $a$ và vận tốc dòng nước rồi so sánh hai thời gian; cảm giác "nhanh bao nhiêu thì chậm bấy nhiêu" chỉ đúng với vận tốc, còn thời gian tỉ lệ nghịch với vận tốc nên không bù trừ đều như vậy.

**Bước 1.** Đặt khoảng cách $AB=s$, vận tốc riêng $a$, vận tốc dòng nước hôm trước là $b$ và hôm sau là $c$ với $0<b<c<a$, vì thuyền phải ngược dòng được cả hai ngày.

**Bước 2.** Lập thời gian đi xuôi cộng đi ngược của từng ngày rồi quy đồng để được một phân thức có tử $2as$ cho cả hai ngày.

**Bước 3.** So sánh hai phân thức cùng tử dương bằng cách so sánh các mẫu $a^2-b^2$ và $a^2-c^2$, dùng $0<b<c$.

**Bước 4.** Từ kết quả so sánh kết luận lời nói của Tâm và của Hoà đều sai.

**Phần 2. Trình bày**

Gọi $s$ (km) là khoảng cách $AB$, $a$ (km/h) là vận tốc riêng của thuyền, $b$ và $c$ (km/h) lần lượt là vận tốc dòng nước hôm trước và hôm sau, với $0<b<c<a$ (thuyền phải ngược dòng được).

Hôm trước, thời gian đi khứ hồi: $x=\dfrac{s}{a+b}+\dfrac{s}{a-b}=\dfrac{2as}{a^2-b^2}$ (giờ).

Hôm sau: $y=\dfrac{s}{a+c}+\dfrac{s}{a-c}=\dfrac{2as}{a^2-c^2}$ (giờ).

Vì $0<b<c<a$ nên $b^2<c^2$, suy ra $a^2-b^2>a^2-c^2>0$, do đó $\dfrac{2as}{a^2-b^2}<\dfrac{2as}{a^2-c^2}$, tức $x<y$.

Vậy hôm sau thuyền đi lâu hơn hôm trước: Tâm nói "về sớm hơn" là sai, Hoà nói "thời gian như hôm trước" cũng sai.
