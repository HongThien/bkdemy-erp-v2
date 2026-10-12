=== T1V.1@p6
- bai: 1 · y: - · trang: 6 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: trị số riêng · đồng nhất đa thức
- kiem: khong
- ket_qua_sach: a=2
- dap_an: $a=2$
- ghi_chu_nghi:
## DE
Xác định hệ số $a$ để đa thức $x^3-3x+a$ chia hết cho $(x-1)^2$.
## SACH
Cách 1: Thực hiện phép chia: Ta có:
$(x^3-3x+a)=(x^2-2x+1)(x+2)+(a-2)$
Muốn phép chia không còn dư, ta phải có $a-2=0\Leftrightarrow a=2$.
Vậy để đa thức $(x^3-3x+a)$ chia hết cho $(x-1)^2$ thì $a=2$.
Cách 2: Phương pháp hệ số bất định
Giả sử đa thức bậc ba $x^3-3x+a$ chia hết cho đa thức bậc hai $x^2-2x+1$, ta được thương là nhị thức bậc nhất, có số hạng bậc cao nhất là $x^3:x^2=x$, số hạng bậc thấp nhất là $a:1=a$.
Như vậy $x^3-3x+a$ đồng nhất với $(x^2-2x+1)(x+a)$, tức là $x^3-3x+a$ đồng nhất với: $x^3+(a-2)x^2+(1-2a)x+a$.
Do đó hệ số các số hạng đồng dạng phải bằng nhau, tức là:
$\begin{cases}a-2=0\\1-2a=-3\end{cases}\Leftrightarrow a=2.$
Cách 3: Phương pháp trị số riêng
Gọi thương của phép chia là $Q(x)$ ta có $x^3-3x+a=(x-1)^2Q(x)$ với mọi $x$. Với $x=1$ thì $1^3-3\cdot1+a=0Q(x)$ hay $-2+a=0\Leftrightarrow a=2$.
Vậy, với $a=2$ thì $x^3-3x+a$ chia hết cho $(x-1)^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chia $(x-1)^2$ có nghiệm $x=1$, nên nếu chia hết thì thay $x=1$ vào đẳng thức chia hết là vế phải triệt tiêu và còn lại một phương trình theo $a$; thay một giá trị chỉ cho điều kiện cần nên phải thử lại.

**Bước 1.** Viết điều kiện chia hết thành đẳng thức $x^3-3x+a=(x-1)^2Q(x)$ đúng với mọi $x$, trong đó $Q(x)$ là một đa thức nào đó.

**Bước 2.** Thay $x=1$ để vế phải bằng $0$, từ đó suy ra giá trị của $a$ mà phép chia hết buộc phải có.

**Bước 3.** Thử lại với giá trị $a$ vừa tìm bằng cách phân tích đa thức thành nhân tử và chỉ ra nhân tử $(x-1)^2$, để chắc chắn phép chia thật sự hết.

**Chú ý:** Chia đặt tính $x^3-3x+a$ cho $x^2-2x+1$ được thương $x+2$ và dư $a-2$; cho dư bằng $0$ thì không cần thử lại.

**Phần 2. Trình bày**

Giả sử $x^3-3x+a=(x-1)^2Q(x)$ với mọi $x$.

Thay $x=1$: $1-3+a=0$, suy ra $a=2$.

Thử lại: với $a=2$ ta có $x^3-3x+2=x^3-x-2x+2$

$=x(x-1)(x+1)-2(x-1)$

$=(x-1)(x^2+x-2)$

$=(x-1)^2(x+2)$ nên chia hết cho $(x-1)^2$.

Vậy $a=2$.

=== T1V.2a@p7
- bai: 2 · y: a · trang: 7 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: hệ số bất định · đồng nhất đa thức
- kiem: khong
- ket_qua_sach: a=1; b=1
- dap_an: $(a;b)=(1;1)$
- ghi_chu_nghi: Ảnh p-007: chữ "b" trong "b = a" ở Cách 1 bị mép trang che một nửa; đọc theo ngữ cảnh.
## DE
Xác định các hằng số $a$ và $b$ sao cho $x^4+ax^2+b$ chia hết cho $x^2-x+1$.
## SACH
Cách 1: Đặt tính chia ta được thương bằng $x^2+x+a$, dư $(a-1)x+(b-a)$. Muốn chia hết thì đa thức dư phải đồng nhất bằng $0$, do đó $a=1,\ b=a$. Vậy $a=b=1$.
Cách 2: Thương có dạng $x^2+cx+b$. Nhân nó với $x^2-x+1$ rồi đồng nhất với $x^4+ax^2+b$, ta được $c-1=0,\ b-c+1=a,\ c-b=0$. Suy ra $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc bốn chia hết cho đa thức bậc hai thì thương là tam thức bậc hai biết hệ số cao nhất và hệ số tự do, chỉ còn một hệ số chưa biết; nhân ra và đồng nhất hệ số với số bị chia (số bị chia thiếu các hạng tử $x^3$ và $x$) là tìm được hết.

**Bước 1.** Xác định dạng của thương: bậc $4-2=2$, hệ số bậc cao nhất là $1$ và hệ số tự do là $b$ vì số chia có hệ số tự do bằng $1$.

**Bước 2.** Nhân thương với số chia, gom các hạng tử đồng dạng rồi so sánh từng hệ số với đa thức $x^4+0x^3+ax^2+0x+b$.

**Bước 3.** Giải hệ ba phương trình thu được, bắt đầu từ phương trình đơn giản nhất, để tìm hệ số còn thiếu của thương rồi tìm $a$ và $b$.

**Chú ý:** Có thể đặt tính chia, được dư là $(a-1)x+(b-a)$, rồi cho dư đồng nhất bằng $0$; cho kết quả như nhau.

**Phần 2. Trình bày**

Vì $x^4+ax^2+b$ chia hết cho $x^2-x+1$ nên thương có bậc hai, hệ số bậc cao nhất bằng $1$ và hệ số tự do bằng $b$; đặt thương là $x^2+cx+b$. Khi đó với mọi $x$:

$x^4+ax^2+b=(x^2-x+1)(x^2+cx+b)$

$=x^4+(c-1)x^3+(b-c+1)x^2+(c-b)x+b$.

Đồng nhất hệ số: $c-1=0$; $b-c+1=a$; $c-b=0$.

Từ đó $c=1$, $b=c=1$, $a=b-c+1=1$.

Vậy $a=b=1$.

=== T1V.2b@p7
- bai: 2 · y: b · trang: 7 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: trị số riêng · phân tích số chia thành nhân tử · đồng nhất đa thức
- kiem: khong
- ket_qua_sach: a=1; b=8
- dap_an: $(a;b)=(1;8)$
- ghi_chu_nghi:
## DE
Xác định các hằng số $a$ và $b$ sao cho $ax^3+bx^2+5x-50$ chia hết cho $x^2+3x-10$.
## SACH
Cách 1: Đặt tính chia.
Cách 2: Đồng nhất $(x^2+3x-10)(ax+5)$ với đa thức bị chia, được $3a+5=b$, $15-10a=5$. Suy ra $a=1,\ b=8$.
Cách 3: Xét $ax^3+bx^2+5x-50=(x+5)(x-2)Q(x)$. Lần lượt cho $x=-5$, $x=2$, ta được:
$\begin{cases}-125a+25b=75\\8a+4b=40\end{cases}\Leftrightarrow\begin{cases}-5a+b=3\\2a+b=10\end{cases}\Leftrightarrow\begin{cases}a=1\\b=8\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chia $x^2+3x-10$ phân tích được thành $(x+5)(x-2)$ có hai nghiệm dễ thấy, nên đa thức bị chia phải triệt tiêu tại hai nghiệm đó; mỗi nghiệm cho một phương trình bậc nhất theo $a,b$.

**Bước 1.** Phân tích số chia thành nhân tử để thấy hai nghiệm $x=-5$ và $x=2$, rồi viết đa thức bị chia dưới dạng tích của số chia với một thương $Q(x)$.

**Bước 2.** Thay lần lượt hai giá trị của $x$ vào đẳng thức đó cho vế phải bằng $0$, được hệ hai phương trình bậc nhất hai ẩn $a,b$.

**Bước 3.** Giải hệ để tìm $a$ và $b$, rồi thử lại bằng cách nhân số chia với một nhị thức bậc nhất thích hợp cho ra đúng đa thức bị chia.

**Chú ý:** Hai điều kiện từ hai nghiệm chỉ là điều kiện cần, nên phải thử lại; hoặc đồng nhất hệ số với tích $(x^2+3x-10)(ax+5)$ (thương có hệ số cao nhất $a$ và hệ số tự do $-50:(-10)=5$).

**Phần 2. Trình bày**

Ta có $x^2+3x-10=(x+5)(x-2)$. Vì $ax^3+bx^2+5x-50$ chia hết cho $(x+5)(x-2)$ nên $ax^3+bx^2+5x-50=(x+5)(x-2)Q(x)$ với mọi $x$.

Thay $x=-5$: $-125a+25b-25-50=0$, tức là $-5a+b=3$.

Thay $x=2$: $8a+4b+10-50=0$, tức là $2a+b=10$.

Trừ hai phương trình theo vế: $7a=7$, suy ra $a=1$ và $b=8$.

Thử lại: $x^3+8x^2+5x-50=(x^2+3x-10)(x+5)$ nên phép chia hết.

Vậy $a=1$, $b=8$.

=== T1V.3@p7
- bai: 3 · y: - · trang: 7 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010401
- cong_cu: định lí Bê-du
- kiem: khong
- ket_qua_sach: a=-10; b=-2
- dap_an: $(a;b)=(-10;-2)$
- ghi_chu_nghi:
## DE
Tìm các hằng số $a$ và $b$ sao cho $x^3+ax+b$ chia cho $x+1$ thì dư $7$, chia cho $x-3$ thì dư $-5$.
## SACH
$x^3+ax+b=(x+1)P(x)+7$ nên với $x=-1$ thì $-1-a+b=7$, tức là:
$a-b=-8$ (1)
$x^3+ax+b=(x-3)Q(x)-5$ nên với $x=3$ thì $27+3a+b=-5$ tức là:
$3a+b=-32$ (2)
Từ (1) và (2) suy ra $a=-10$, $b=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Dư của phép chia cho nhị thức $x-c$ chính là giá trị của đa thức tại $x=c$ (định lí Bê-du), nên mỗi dữ kiện về số dư cho ngay một phương trình bậc nhất theo $a,b$.

**Bước 1.** Gọi $P(x)=x^3+ax+b$ và đổi mỗi dữ kiện thành giá trị của $P$: chia cho $x+1=x-(-1)$ dư $7$ nghĩa là $P(-1)=7$, và dữ kiện còn lại cho $P(3)$.

**Bước 2.** Tính $P(-1)$ và $P(3)$ theo $a,b$ rồi viết thành hai phương trình bậc nhất hai ẩn.

**Bước 3.** Giải hệ phương trình bằng cách trừ theo vế để tìm $a$, sau đó thay vào một phương trình để tìm $b$.

**Chú ý:** Nhớ $x+1=x-(-1)$ nên phải thay $x=-1$, không phải $x=1$.

**Phần 2. Trình bày**

Đặt $P(x)=x^3+ax+b$. Theo định lí Bê-du:

$P(-1)=7\Rightarrow-1-a+b=7\Rightarrow-a+b=8$ (1)

$P(3)=-5\Rightarrow27+3a+b=-5\Rightarrow3a+b=-32$ (2)

Lấy (2) trừ (1) theo vế: $4a=-40$, suy ra $a=-10$.

Thay vào (1): $b=8+a=-2$.

Vậy $a=-10$, $b=-2$.

=== T1V.4@p7
- bai: 4 · y: - · trang: 7 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010401
- cong_cu: định lí Bê-du
- kiem: khong
- ket_qua_sach: a=1; b=1; c=4
- dap_an: $(a;b;c)=(1;1;4)$
- ghi_chu_nghi: Ảnh p-007: "x+2" ở đề bị mép trang làm nhoè (in như "x: + 2") và "x = 1" ở lời giải bị logo che; dựng lại theo ngữ cảnh (x+2 chia hết ⇒ cho x=-2 ở lời giải; cho x=1 và x=-1 cho a+b+c=6, -a+b+c=4).
## DE
Tìm các hằng số $a,b,c$ sao cho $ax^3+bx^2+c$ chia hết cho $x+2$, chia cho $x^2-1$ thì dư $x+5$.
## SACH
Trong hằng đẳng thức $ax^3+bx^2+c=(x+2)P(x)$, cho $x=-2$, ta được $-8a+4b+c=0$ (1)
Trong hằng đẳng thức $ax^3+bx^2+c=(x+1)(x-1)Q(x)+x+5$, lần lượt cho $x=1$ và $x=-1$, được $a+b+c=6$, $-a+b+c=4$ (2)
Từ (1) & (2) suy ra $a=1,\ b=1,\ c=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai dữ kiện đều là điều kiện về giá trị của đa thức tại các nghiệm của số chia ($x=-2$; $x=1$ và $x=-1$ vì $x^2-1=(x-1)(x+1)$), nên thay các giá trị đó vào đẳng thức chia có dư là ra hệ ba phương trình bậc nhất.

**Bước 1.** Từ điều kiện chia hết cho $x+2$ suy ra đa thức triệt tiêu tại $x=-2$, được phương trình thứ nhất.

**Bước 2.** Viết điều kiện chia cho $x^2-1$ dư $x+5$ thành đẳng thức có thương $Q(x)$, rồi thay $x=1$ và $x=-1$ để thương biến mất, được hai phương trình nữa.

**Bước 3.** Trừ hai phương trình vừa có để tìm $a$ trước, rồi thay vào phương trình còn lại để tìm $b$ và $c$.

**Bước 4.** Thử lại với bộ ba giá trị tìm được để chắc chắn cả hai điều kiện đều thoả mãn.

**Chú ý:** Dư của phép chia cho đa thức bậc hai có bậc không quá $1$, nên $x+5$ là dư hợp lệ; việc thay $x=1,-1$ chỉ cho điều kiện cần nên bước thử lại không được bỏ.

**Phần 2. Trình bày**

Đặt $P(x)=ax^3+bx^2+c$.

$P(x)$ chia hết cho $x+2$ nên $P(-2)=0$, tức là $-8a+4b+c=0$ (1)

$P(x)$ chia cho $x^2-1$ dư $x+5$ nên $P(x)=(x-1)(x+1)Q(x)+x+5$ với mọi $x$.

Thay $x=1$: $a+b+c=6$ (2)

Thay $x=-1$: $-a+b+c=4$ (3)

Lấy (2) trừ (3): $2a=2$, suy ra $a=1$ và $b+c=5$, tức là $c=5-b$.

Thay vào (1): $-8+4b+5-b=0$, suy ra $b=1$ và $c=4$.

Thử lại: $x^3+x^2+4=(x+2)(x^2-x+2)$ và $x^3+x^2+4-(x+5)=x^3+x^2-x-1=(x+1)(x^2-1)$.

Vậy $a=1$, $b=1$, $c=4$.

=== T1V.5@p8
- bai: 5 · y: - · trang: 8 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010401
- cong_cu: định lí Bê-du · dư có bậc nhỏ hơn số chia
- kiem: khong
- ket_qua_sach: 5x-1
- dap_an: $5x-1$
- ghi_chu_nghi: Cách 2 của sách: dòng "[(x-1)-(x-3)]P(x)=..." in dấu ngoặc vuông bao cả 14(x-1)-4(x-3) cùng B(x)-A(x) (tức nhân thêm (x-1)(x-3)), không khớp dòng sau; chép đúng như in. Dấu suy ra đầu dòng "2P(x)=..." in giống "⇐", chép là ⇔. Cách 1 chép theo ảnh, đọc rõ.
## DE
Đa thức $P(x)$ chia cho $x-1$ được số dư bằng $4$, chia cho $x-3$ được số dư bằng $14$. Tìm số dư của phép chia $P(x)$ cho $(x-1)(x-3)$.
## SACH
Cách 1: Gọi thương của phép chia đa thức $P(x)$ cho $(x-1)$ và cho $(x-3)$, theo thứ tự là $A(x)$, $B(x)$ và dư theo thứ tự là $4$ và $14$. Như vậy:
$P(x)=(x-1)A(x)+4$ với mọi $x$ (1)
$P(x)=(x-3)B(x)+14$ với mọi $x$ (2)
Gọi thương của phép chia $P(x)$ cho đa thức bậc hai $(x-1)(x-3)$ là $C(x)$ và dư là $R(x)$. Vì bậc của $R(x)$ nhỏ hơn bậc $2$ nên $R(x)$ có dạng $ax+b$.
Ta có: $P(x)=(x-1)(x-3)C(x)+(ax+b)$ với mọi $x$. (3)
Thay $x=1$ vào (1) và (3) ta có: $P(1)=4$; $P(1)=a+b$.
Thay $x=3$ vào (2) và (3) ta có: $P(3)=14$; $P(3)=3a+b$.
Từ $\begin{cases}a+b=4\\3a+b=14\end{cases}\Rightarrow\begin{cases}a=5\\b=-1\end{cases}$
Vậy, dư của phép chia $P(x)$ cho $(x-1)(x-3)$ là $5x-1$.
Cách 2: $P(x)=(x-1)A(x)+4$ nên
$(x-3)P(x)=(x-1)(x-3)A(x)+4(x-3)$ (1)
$P(x)=(x-3)B(x)+14$ nên:
$(x-1)P(x)=(x-1)(x-3)B(x)+14(x-1)$ (2)
Lấy (2) trừ (1) vế theo vế, ta có:
$[(x-1)-(x-3)]P(x)=(x-1)(x-3)[B(x)-A(x)+14(x-1)-4(x-3)]$
$\Leftrightarrow2P(x)=(x-1)(x-3)[B(x)-A(x)]+10x-2$
Do đó: $P(x)=(x-1)(x-3)\dfrac{B(x)-A(x)}{2}+(5x-1)$ trong đó bậc của $5x-1$ nhỏ hơn bậc của $(x-1)(x-3)$.
Vậy dư của phép chia $P(x)$ cho $(x-1)(x-3)$ là $5x-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chia $(x-1)(x-3)$ bậc hai nên dư có dạng $ax+b$; hai dữ kiện về số dư khi chia cho $x-1$ và $x-3$ chính là giá trị của $P$ tại $1$ và $3$ (định lí Bê-du), đủ để tìm hai hệ số $a,b$.

**Bước 1.** Viết phép chia $P(x)$ cho $(x-1)(x-3)$ dưới dạng thương nhân số chia cộng dư, trong đó dư có bậc nhỏ hơn $2$ nên có dạng $ax+b$.

**Bước 2.** Dùng định lí Bê-du để biết $P(1)$ và $P(3)$, rồi thay $x=1$ và $x=3$ vào đẳng thức trên để phần tích với số chia triệt tiêu.

**Bước 3.** Giải hệ hai phương trình bậc nhất theo $a,b$ rồi viết dư.

**Chú ý:** Đừng viết dư là hằng số: số chia bậc hai thì dư có thể bậc nhất, và vì dư luôn là duy nhất nên kết quả không phụ thuộc cách làm.

**Phần 2. Trình bày**

Theo định lí Bê-du: $P(1)=4$ và $P(3)=14$.

Gọi $C(x)$ là thương và $ax+b$ là dư của phép chia $P(x)$ cho $(x-1)(x-3)$ (dư có bậc nhỏ hơn $2$). Khi đó $P(x)=(x-1)(x-3)C(x)+ax+b$ với mọi $x$.

Thay $x=1$: $P(1)=a+b$, nên $a+b=4$.

Thay $x=3$: $P(3)=3a+b$, nên $3a+b=14$.

Trừ hai phương trình: $2a=10$, suy ra $a=5$ và $b=-1$.

Vậy dư của phép chia $P(x)$ cho $(x-1)(x-3)$ là $5x-1$.

=== T1V.6a@p8
- bai: 6 · y: a · trang: 8 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010601
- cong_cu: chia đa thức đặt tính · hệ số bất định
- kiem: bang | (3x^4-8x^3-10x^2+8x-5):(3x^2-2x+1)
- ket_qua_sach: x^2-2x-5
- dap_an: $x^2-2x-5$
- ghi_chu_nghi: Chưa chắc nhóm: T18T010601 (thực hiện phép chia) hay T18T010402. Cách 2 của sách in "-5(-5.1)=-5" (nghi là (-5):1=-5), chép đúng như in. Bảng chia của Cách 1 chép thành các dòng, thương ghi cuối.
## DE
Chia đa thức: $(3x^4-8x^3-10x^2+8x-5):(3x^2-2x+1)$.
## SACH
Cách 1: Chia thông thường (bảng chia: số bị chia $3x^4-8x^3-10x^2+8x-5$, số chia $3x^2-2x+1$, thương $x^2-2x-5$; các dòng bên dưới):
$3x^4-2x^3+x^2$
$-6x^3-11x^2+8x-5$
$-6x^3+4x^2-2x$
$-15x^2+10x-5$
$-15x^2+10x-5$
$0$
Cách 2: Dùng phương pháp hệ số bất định:
– Ta nhận thấy rằng, hệ số của hạng tử có bậc cao nhất của đa thức bị chia và của đa thức chia là bằng nhau (bằng $3$). Vậy hệ số của hạng tử có bậc cao nhất của thương phải là $1$. Tương tự như vậy, hạng tử không đổi của thương phải là $-5\,(-5\cdot1)=-5$. Mặt khác, đa thức bị chia có bậc là $4$, đa thức chia có bậc là $2$. Vậy đa thức thương có bậc là $2$. Do vậy đa thức thương phải có dạng: $x^2+ax-5$
Ta có: $3x^4-8x^3-10x^2+8x-5=(3x^2-2x+1)(x^2+ax-5)$
Khai triển vế phải bằng phép nhân các đa thức, ta có:
$3x^4-8x^3-10x^2+8x-5$
$=3x^4+(3a-2)x^3+(-15-2a+1)x^2+(a+10)x-5$. Hệ số của các hạng tử cùng bậc ở hai vế phải bằng nhau, ta suy ra:
$\begin{cases}3a-2=-8\\-15-2a+1=-10\\a+10=8\end{cases}$
Cả ba đẳng thức đều cho $a=-2$. Vậy đa thức thương là $x^2-2x-5$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đây là phép chia đa thức một biến theo cách đặt tính: lần lượt chia hạng tử bậc cao nhất của số bị chia (rồi của từng dư) cho hạng tử bậc cao nhất của số chia để lập từng hạng tử của thương.

**Bước 1.** Chia hạng tử bậc cao nhất của số bị chia cho hạng tử bậc cao nhất của số chia để được hạng tử đầu của thương.

**Bước 2.** Nhân hạng tử đó với cả số chia rồi lấy số bị chia trừ đi tích, được dư mới có bậc thấp hơn.

**Bước 3.** Lặp lại với dư mới cho đến khi dư bằng $0$ hoặc có bậc nhỏ hơn bậc số chia, rồi viết lại dưới dạng số bị chia bằng số chia nhân thương.

**Chú ý:** Có thể dùng hệ số bất định: thương dạng $x^2+ax-5$ (hệ số cao nhất $3:3=1$, hệ số tự do $-5:1=-5$), nhân ra rồi đồng nhất hệ số; nhưng chỉ dùng được khi biết chắc phép chia hết.

**Phần 2. Trình bày**

$(3x^4-8x^3-10x^2+8x-5):(3x^2-2x+1)$

Hạng tử đầu của thương: $3x^4:3x^2=x^2$. Lấy số bị chia trừ $x^2(3x^2-2x+1)=3x^4-2x^3+x^2$, còn lại $-6x^3-11x^2+8x-5$.

Hạng tử tiếp theo: $-6x^3:3x^2=-2x$. Lấy dư trừ $-2x(3x^2-2x+1)=-6x^3+4x^2-2x$, còn lại $-15x^2+10x-5$.

Hạng tử cuối: $-15x^2:3x^2=-5$. Lấy dư trừ $-5(3x^2-2x+1)=-15x^2+10x-5$, còn lại $0$.

Vậy $3x^4-8x^3-10x^2+8x-5=(3x^2-2x+1)(x^2-2x-5)$, thương là $x^2-2x-5$, dư $0$.

=== T1V.6b@p8
- bai: 6 · y: b · trang: 8 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010601
- cong_cu: chia đa thức đặt tính · hệ số bất định
- kiem: bang | (2x^3-9x^2+19x-15):(x^2-3x+5)
- ket_qua_sach: 2x-3
- dap_an: $2x-3$
- ghi_chu_nghi: Chưa chắc nhóm: T18T010601 hay T18T010402.
## DE
Chia đa thức: $(2x^3-9x^2+19x-15):(x^2-3x+5)$.
## SACH
Cách 1: Cách thông thường (các bạn tự giải)
Cách 2: Sử dụng phương pháp đồng nhất các hệ số (phương pháp hệ số bất định). Ta thấy ngay thương phải là một nhị thức bậc nhất mà hệ số của $x$ là $2$, hạng tử không đổi là $-3$.
Đó là $2x-3$. Kiểm tra lại, ta thấy đúng là:
$(2x^3-9x^2+19x-15)\equiv(x^2-3x+5)(2x-3)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia đa thức một biến theo cách đặt tính: số bị chia bậc ba, số chia bậc hai nên thương bậc nhất; lập từng hạng tử của thương từ hạng tử bậc cao nhất của số bị chia và của từng dư.

**Bước 1.** Chia hạng tử bậc cao nhất của số bị chia cho hạng tử bậc cao nhất của số chia để được hạng tử đầu của thương.

**Bước 2.** Nhân hạng tử đó với số chia rồi lấy số bị chia trừ đi tích để được dư mới có bậc nhỏ hơn.

**Bước 3.** Lặp lại với dư mới cho đến khi dư bằng $0$, rồi kiểm tra lại bằng cách nhân thương với số chia.

**Chú ý:** Hệ số bất định cũng làm nhanh được: thương dạng $2x+c$ với hệ số tự do $-15:5=-3$, rồi nhân ra để kiểm tra đúng bằng số bị chia.

**Phần 2. Trình bày**

$(2x^3-9x^2+19x-15):(x^2-3x+5)$

Hạng tử đầu của thương: $2x^3:x^2=2x$. Lấy số bị chia trừ $2x(x^2-3x+5)=2x^3-6x^2+10x$, còn lại $-3x^2+9x-15$.

Hạng tử cuối: $-3x^2:x^2=-3$. Lấy dư trừ $-3(x^2-3x+5)=-3x^2+9x-15$, còn lại $0$.

Vậy $2x^3-9x^2+19x-15=(x^2-3x+5)(2x-3)$, thương là $2x-3$, dư $0$.

=== T1V.6c@p8
- bai: 6 · y: c · trang: 8 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010601
- cong_cu: chia đa thức đặt tính · hệ số bất định
- kiem: bang | (6x^5-3x^4y+2x^3y^2+4x^2y^3-5xy^4+2y^5):(3x^3-2xy^2+y^3)
- ket_qua_sach: 2x^2-xy+2y^2
- dap_an: $2x^2-xy+2y^2$
- ghi_chu_nghi: Chưa chắc nhóm: T18T010601 hay T18T010402. Ảnh p-010: hạng tử 6x^5 ở đầu dòng bị mép trang làm nhoè (in như "6:^5"), đọc theo đề. Bảng chia của Cách 2 chép thành các dòng, thương ghi cuối. Đoạn "Chú ý" in sau cách 2 chép vào cuối SACH (dưới nhãn Nhận xét).
## DE
Chia đa thức: $(6x^5-3x^4y+2x^3y^2+4x^2y^3-5xy^4+2y^5):(3x^3-2xy^2+y^3)$.
## SACH
Cách 1: Ta nhận thấy: Đa thức bị chia bậc $5$, đa thức chia bậc $3$. Vậy đa thức thương phải là bậc $2$.
– Hệ số của hạng tử có bậc cao nhất của $x$ trong đa thức bị chia là $6$, trong đa thức chia là $3$. Vậy hệ số của hạng tử có bậc cao nhất của $x$ trong thương là $2$.
Tương tự, hệ số của hạng tử có bậc cao nhất của $y$ trong thương là $2$. Vậy thương phải có dạng: $2x^2+axy+2y^2$. Ta có:
$(6x^5-3x^4y+2x^3y^2+4x^2y^3-5xy^4+2y^5)=(3x^3-2xy^2+y^3)(2x^2+axy+2y^2)$
Đồng nhất các hệ số của các hạng tử cùng bậc ở hai vế sau khi khai triển, ta có: $a=-1$. Vậy thương là $2x^2-xy+2y^2$.
Cách 2: Chia thông thường (bảng chia: số bị chia $6x^5-3x^4y+2x^3y^2+4x^2y^3-5xy^4+2y^5$, số chia $3x^3-2xy^2+y^3$, thương $2x^2-xy+2y^2$; các dòng bên dưới):
$6x^5-4x^3y^2+2x^2y^3$
$-3x^4y+6x^3y^2+2x^2y^3-5xy^4+2y^5$
$-3x^4y+2x^2y^3-xy^4$
$6x^3y^2-4xy^4+2y^5$
$6x^3y^2-4xy^4+2y^5$
$0$
Nhận xét:
Phương pháp hệ số bất định chỉ nên sử dụng trong phép chia khi biết chắc thương là một nhị thức bậc nhất hoặc là tam thức bậc hai mà ta đã biết một vài hệ số, chỉ cần xác định một, hai hệ số nữa; chỉ trong trường hợp này thì việc làm mới đơn giản và có lợi.
Phương pháp phân tích thành nhân tử cũng chỉ nên dùng khi việc phân tích là tương đối đơn giản.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hai biến vẫn chia đặt tính được nếu sắp xếp cả số bị chia và số chia theo luỹ thừa giảm dần của $x$; mỗi hạng tử của thương lấy từ hạng tử đầu của số bị chia (hoặc của dư) chia cho hạng tử đầu của số chia.

**Bước 1.** Chia hạng tử đầu $6x^5$ của số bị chia cho hạng tử đầu $3x^3$ của số chia để được hạng tử đầu của thương.

**Bước 2.** Nhân hạng tử đó với cả số chia rồi lấy số bị chia trừ đi tích, chú ý trừ từng hạng tử đồng dạng và giữ đúng dấu.

**Bước 3.** Lặp lại với dư mới cho đến khi dư bằng $0$, rồi viết số bị chia bằng số chia nhân thương.

**Chú ý:** Có thể dùng hệ số bất định: thương dạng $2x^2+axy+2y^2$, so hệ số của $x^4y$ để tìm $a$; nhưng chỉ làm được khi biết chắc phép chia hết.

**Phần 2. Trình bày**

$(6x^5-3x^4y+2x^3y^2+4x^2y^3-5xy^4+2y^5):(3x^3-2xy^2+y^3)$

Hạng tử đầu của thương: $6x^5:3x^3=2x^2$. Lấy số bị chia trừ $2x^2(3x^3-2xy^2+y^3)=6x^5-4x^3y^2+2x^2y^3$, còn lại $-3x^4y+6x^3y^2+2x^2y^3-5xy^4+2y^5$.

Hạng tử tiếp theo: $-3x^4y:3x^3=-xy$. Lấy dư trừ $-xy(3x^3-2xy^2+y^3)=-3x^4y+2x^2y^3-xy^4$, còn lại $6x^3y^2-4xy^4+2y^5$.

Hạng tử cuối: $6x^3y^2:3x^3=2y^2$. Lấy dư trừ $2y^2(3x^3-2xy^2+y^3)=6x^3y^2-4xy^4+2y^5$, còn lại $0$.

Vậy thương là $2x^2-xy+2y^2$, dư $0$.

=== T1V.7@p10
- bai: 7 · y: - · trang: 10 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010401
- cong_cu: phép chia có dư · bậc của dư nhỏ hơn bậc số chia
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh p-010: vài chữ ở mép trái bị nhoè (vd "Cha đa thức", "a l nghiệm"), đọc theo ngữ cảnh.
## DE
Chứng minh định lí "Số dư trong phép chia đa thức $f(x)$ cho nhị thức $(x-a)$ bằng giá trị của đa thức ấy tại $x=a$".
## SACH
Chia đa thức $f(x)$ cho nhị thức $(x-a)$, ta được thương là $Q(x)$ và dư là hằng số $r$. Ta có $f(x)=(x-a)Q(x)+r$ với mọi $x$, do đó $x=a$ thì $f(a)=r$.
Nhận xét:
Chú ý: Định lí trên được gọi là định lí Bê–du mang tên nhà toán học Pháp Bézout (1730 – 1783). Định lí Bê–du giúp ta tính số dư của phép chia đa thức $f(x)$ cho nhị thức $(x-a)$ mà không cần thực hiện phép chia đa thức.
Từ định lí Bê–du, ta thấy đa thức $f(x)$ chia hết cho $(x-a)$ khi và chỉ khi $a$ là nghiệm của đa thức.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chia $x-a$ có bậc một nên dư là một hằng số; viết phép chia dưới dạng đẳng thức đúng với mọi $x$ rồi thay $x=a$ để số hạng chứa $(x-a)$ biến mất.

**Bước 1.** Viết phép chia $f(x)$ cho $x-a$ thành $f(x)=(x-a)Q(x)+R$, trong đó dư $R$ có bậc nhỏ hơn bậc của số chia nên là một hằng số.

**Bước 2.** Nhận xét rằng đẳng thức đó đúng với mọi giá trị của $x$, nên thay được riêng $x=a$ vào cả hai vế.

**Bước 3.** Tính giá trị hai vế tại $x=a$ để rút ra mối liên hệ giữa dư và $f(a)$.

**Chú ý:** Từ định lí suy ra ngay: $f(x)$ chia hết cho $x-a$ khi và chỉ khi $f(a)=0$, tức là $a$ là nghiệm của $f(x)$.

**Phần 2. Trình bày**

Chia $f(x)$ cho $x-a$, gọi thương là $Q(x)$ và dư là $r$. Vì bậc của dư nhỏ hơn bậc của $x-a$ (bằng $1$) nên $r$ là hằng số.

Ta có $f(x)=(x-a)Q(x)+r$ với mọi $x$.

Thay $x=a$: $f(a)=(a-a)Q(a)+r=r$.

Vậy số dư trong phép chia $f(x)$ cho $x-a$ bằng $f(a)$.

=== T1V.8a@p11
- bai: 8 · y: a · trang: 11 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: định lí Bê-du
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Có thể xếp T18T010401 (dùng Bê-du); chọn 010402 vì mục tiêu là chứng minh chia hết.
## DE
Cho đa thức $f(x)=a_0x^4+a_1x^3+a_2x^2+a_3x+a_4$. Chứng minh rằng đa thức $f(x)$ chia hết cho $(x-1)$ nếu tổng các hệ số bằng $0$.
## SACH
Theo định lí Bê–du, số dư $r$ của phép chia $f(x)$ cho $(x-1)$ là:
$r=f(1)=a_0+a_1+a_2+a_3+a_4$
Nếu $a_0+a_1+a_2+a_3+a_4=0$ thì $r=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Theo định lí Bê-du, dư của phép chia cho $x-1$ bằng $f(1)$, mà $f(1)$ chính là tổng các hệ số vì mọi luỹ thừa của $1$ đều bằng $1$.

**Bước 1.** Áp dụng định lí Bê-du để biết số dư của phép chia $f(x)$ cho $x-1$ bằng giá trị của $f$ tại một số cụ thể.

**Bước 2.** Thay $x=1$ vào $f(x)$ và nhận ra giá trị thu được là tổng của các hệ số.

**Bước 3.** Dùng giả thiết tổng các hệ số bằng $0$ để kết luận số dư bằng $0$, tức là phép chia hết.

**Chú ý:** Lập luận không phụ thuộc bậc của $f(x)$, đúng với đa thức bậc bất kì.

**Phần 2. Trình bày**

Theo định lí Bê-du, số dư của phép chia $f(x)$ cho $x-1$ là

$r=f(1)=a_0+a_1+a_2+a_3+a_4$.

Theo giả thiết $a_0+a_1+a_2+a_3+a_4=0$ nên $r=0$.

Vậy $f(x)$ chia hết cho $x-1$.

=== T1V.8b@p11
- bai: 8 · y: b · trang: 11 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: định lí Bê-du
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Có thể xếp T18T010401 (dùng Bê-du); chọn 010402 vì mục tiêu là chứng minh chia hết. Đoạn "Chú ý" cuối ví dụ 8 (đúng cho đa thức bậc bất kì) của sách chép vào cuối SACH, dùng chung cho a) và b).
## DE
Cho đa thức $f(x)=a_0x^4+a_1x^3+a_2x^2+a_3x+a_4$. Chứng minh rằng đa thức $f(x)$ chia hết cho $(x+1)$ nếu tổng các hệ số của hạng tử bậc chẵn bằng tổng các hệ số của hạng tử bậc lẻ.
## SACH
Theo định lí Bê–du, số dư $r$ của phép chia $f(x)$ cho $(x+1)$ là:
$r=f(-1)=a_0-a_1+a_2-a_3+a_4$
Nếu $a_0+a_2+a_4=a_1+a_3$ thì $r=0$.
Nhận xét:
Chú ý: Chứng minh trên không chỉ đúng đối với đa thức $f(x)$ có bậc bốn mà còn đúng với đa thức $f(x)$ có bậc bất kì.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Dư của phép chia cho $x+1=x-(-1)$ bằng $f(-1)$; thay $x=-1$ thì luỹ thừa chẵn cho dấu cộng, luỹ thừa lẻ cho dấu trừ, nên $f(-1)$ là hiệu của hai tổng hệ số cần so sánh.

**Bước 1.** Áp dụng định lí Bê-du cho nhị thức $x+1=x-(-1)$ để biết số dư bằng giá trị của $f$ tại $x=-1$.

**Bước 2.** Thay $x=-1$ vào $f(x)$ và để ý dấu của từng hạng tử theo tính chẵn lẻ của số mũ.

**Bước 3.** Nhóm các hệ số của hạng tử bậc chẵn và của hạng tử bậc lẻ, rồi dùng giả thiết hai tổng bằng nhau để kết luận số dư bằng $0$.

**Chú ý:** Hạng tử tự do $a_4$ là hạng tử bậc $0$, tức bậc chẵn. Lập luận đúng với đa thức bậc bất kì.

**Phần 2. Trình bày**

Theo định lí Bê-du, số dư của phép chia $f(x)$ cho $x+1$ là

$r=f(-1)=a_0-a_1+a_2-a_3+a_4$

$=(a_0+a_2+a_4)-(a_1+a_3)$.

Theo giả thiết $a_0+a_2+a_4=a_1+a_3$ nên $r=0$.

Vậy $f(x)$ chia hết cho $x+1$.

=== T1V.9@p11
- bai: 9 · y: - · trang: 11 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040103
- cong_cu: chia đa thức · ước của một số nguyên
- kiem: khong
- ket_qua_sach: 1; 0; 3; -2
- dap_an: $n\in\{-2;0;1;3\}$
- ghi_chu_nghi: Chưa chắc nhóm: T18T040103 (tìm n để giá trị chia hết) hay T18T010402. Ảnh p-011: dòng đầu bảng chia in "2n^2-3n+3" (đọc từ ảnh), trong khi đề và các dòng sau của bảng ứng với "+3n" (2n^2+3n+3 trừ 2n^2-n còn 4n+3); nghi dấu in nhầm, chép đúng như thấy trong SACH.
## DE
Tìm các giá trị nguyên của $n$ để giá trị của biểu thức $2n^2+3n+3$ chia hết cho giá trị của biểu thức $2n-1$.
## SACH
Giải: Đặt phép chia (bảng chia: số bị chia $2n^2-3n+3$, số chia $2n-1$, thương $n+2$; các dòng bên dưới):
$2n^2-n$
$4n+3$
$4n-2$
$5$
Đa thức $2n^2+3n+3$ không chia hết cho đa thức $2n-1$, nhưng có những giá trị nguyên của $n$ để giá trị của $2n^2+3n+3$ chia hết cho giá trị của $2n-1$.
Muốn vậy $2n-1$ phải là ước của $5$, tức là $\pm1;\ \pm5$.
Với $2n-1=1\Rightarrow n=1$
Với $2n-1=-1\Rightarrow n=0$
Với $2n-1=5\Rightarrow n=3$
Với $2n-1=-5\Rightarrow n=-2$
Vậy với $n$ bằng $1;\ 0;\ 3;\ -2$ thì giá trị của biểu thức $2n^2+3n+3$ chia hết cho giá trị của biểu thức $2n-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia $2n^2+3n+3$ cho $2n-1$ được thương nguyên và một dư là hằng số; với $n$ nguyên thì tích thương nhân $2n-1$ luôn chia hết cho $2n-1$, nên chỉ cần dư (một số nguyên) chia hết cho $2n-1$, tức $2n-1$ là ước của dư.

**Bước 1.** Chia đa thức $2n^2+3n+3$ cho $2n-1$ để viết biểu thức dưới dạng tích của $2n-1$ với một nhị thức cộng một hằng số, rồi nhân lại để kiểm tra.

**Bước 2.** Lập luận với $n$ nguyên rằng giá trị tích đó chia hết cho $2n-1$, nên biểu thức chia hết cho $2n-1$ khi và chỉ khi hằng số dư cũng chia hết cho $2n-1$.

**Bước 3.** Liệt kê tất cả các ước nguyên của hằng số dư, kể cả ước âm, để tìm giá trị của $2n-1$.

**Bước 4.** Cho $2n-1$ bằng từng ước đã liệt kê để tìm $n$, rồi kiểm tra $n$ có là số nguyên hay không.

**Chú ý:** Ước của một số nguyên gồm cả số âm — quên ước âm là mất nghiệm; đa thức không chia hết cho đa thức nhưng giá trị vẫn có thể chia hết với một số $n$.

**Phần 2. Trình bày**

Ta có $2n^2+3n+3=(2n-1)(n+2)+5$ (vì $(2n-1)(n+2)=2n^2+3n-2$).

Với $n$ nguyên thì $n+2$ nguyên, nên $(2n-1)(n+2)\vdots(2n-1)$. Do đó $(2n^2+3n+3)\vdots(2n-1)\Leftrightarrow5\vdots(2n-1)$.

Vậy $2n-1\in\{-5;-1;1;5\}$.

$2n-1=-5\Rightarrow n=-2$; $2n-1=-1\Rightarrow n=0$; $2n-1=1\Rightarrow n=1$; $2n-1=5\Rightarrow n=3$.

Cả bốn giá trị đều là số nguyên. Vậy $n\in\{-2;0;1;3\}$.
