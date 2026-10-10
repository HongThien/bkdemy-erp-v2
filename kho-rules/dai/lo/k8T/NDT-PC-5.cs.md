=== C9.1a@p313
- bai: 1 · y: a · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020102
- cong_cu: ghép cặp nhân tử · đặt ẩn phụ · hằng đẳng thức hiệu hai bình phương
- kiem: nghiem | (x+1)(x+2)(x+3)(x+4) = 24 | x
- ket_qua_sach: 0; -5
- dap_an: $S=\{0;-5\}$
- ghi_chu_nghi: Dòng "x^2+5x+5 hay x^2+5x+5=-5" trong sách in thiếu "=5" ở vế đầu (đúng là x^2+5x+5=5); không ảnh hưởng kết quả.
## DE
Tìm $x$ biết: $(x+1)(x+2)(x+3)(x+4)=24$.
## SACH
$(x+1)(x+2)(x+3)(x+4)=24$
$\Leftrightarrow(x+1)(x+4)(x+2)(x+3)=24$
$\Leftrightarrow(x^2+5x+4)(x^2+5x+6)=24$
$\Leftrightarrow[(x^2+5x+5)-1][(x^2+5x+5)+1]=24$
$\Leftrightarrow(x^2+5x+5)^2-1=24\Leftrightarrow(x^2+5x+5)^2=25$
$\Leftrightarrow x^2+5x+5$ hay $x^2+5x+5=-5$
$\Leftrightarrow x^2+5x=0$ hay $x^2+5x+10=0$
$\Leftrightarrow x(x+5)=0$ hay $\left(x+\dfrac{5}{2}\right)^2+\dfrac{15}{4}=0$ (vô lí)
$\Leftrightarrow x=0$ hay $x=-5$
Vậy $x=0$ hay $x=-5$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn nhân tử bậc nhất có tổng hai số hạng tự do của các cặp $1+4$ và $2+3$ bằng nhau, nên ghép cặp sẽ cho hai nhân tử cùng chứa $x^2+5x$ và đặt ẩn phụ là xong.

**Bước 1.** Ghép $(x+1)$ với $(x+4)$ và $(x+2)$ với $(x+3)$ rồi nhân từng cặp, để hai tích đều có dạng $x^2+5x$ cộng một hằng số.

**Bước 2.** Đặt ẩn phụ là số hạng nằm chính giữa hai hằng số $4$ và $6$, khi đó hai nhân tử có dạng $t-1$ và $t+1$ nên tích là hiệu hai bình phương.

**Bước 3.** Giải $t^2=25$ để tìm hai giá trị của $t$, rồi quay lại biến $x$ ở từng trường hợp.

**Bước 4.** Với phương trình bậc hai không phân tích được, chứng tỏ vế trái luôn dương bằng cách đưa về bình phương cộng một số dương để kết luận vô nghiệm.

**Chú ý:** Phương trình bậc bốn dạng tích của bốn nhân tử bậc nhất thì luôn thử ghép cặp sao cho tổng các số hạng tự do của hai cặp bằng nhau; đừng nhân hết ra bậc bốn.

**Phần 2. Trình bày**

$(x+1)(x+2)(x+3)(x+4)=24$

$\Leftrightarrow(x+1)(x+4)(x+2)(x+3)=24$

$\Leftrightarrow(x^2+5x+4)(x^2+5x+6)=24$

Đặt $t=x^2+5x+5$, phương trình trở thành $(t-1)(t+1)=24\Leftrightarrow t^2=25\Leftrightarrow t=5$ hoặc $t=-5$.

Với $t=5$: $x^2+5x=0\Leftrightarrow x(x+5)=0\Leftrightarrow x=0$ hoặc $x=-5$.

Với $t=-5$: $x^2+5x+10=0$, mà $x^2+5x+10=\left(x+\dfrac{5}{2}\right)^2+\dfrac{15}{4}>0$ nên phương trình vô nghiệm.

Vậy $S=\{0;-5\}$.

=== C9.1b@p313
- bai: 1 · y: b · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020103
- cong_cu: tổng hai số không âm bằng 0 · xét trường hợp theo tham số
- kiem: khong
- ket_qua_sach: a=0: x=-1; x=1; a\ne0: x=1
- dap_an: Nếu $a=0$ thì $S=\{-1;1\}$; nếu $a\ne0$ thì $S=\{1\}$
- ghi_chu_nghi: Đề không nói rõ $a$ là gì; theo lời giải sách thì $a$ là số cho trước (tham số) và phải xét $a=0$, $a\ne0$. Chưa chắc nhóm: có thể là T18T020104 (chứa dấu giá trị tuyệt đối).
## DE
Tìm $x$ biết: $\lvert x^2-1\rvert+\lvert a(x-1)\rvert=0$.
## SACH
Xét $a=0$, phương trình trở thành:
$\lvert x^2-1\rvert=0\Leftrightarrow x^2-1=0\Leftrightarrow x=\pm1$
Xét $a\ne0$. Ta có $\lvert x^2-1\rvert+\lvert a(x-1)\rvert=0$
$\Leftrightarrow\begin{cases}x^2-1=0\\a(x-1)=0\end{cases}\Leftrightarrow\begin{cases}x=\pm1\\x=1\end{cases}\Leftrightarrow x=1$
Nếu $a\ne0$ thì $x=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi giá trị tuyệt đối đều không âm, nên tổng của hai giá trị tuyệt đối bằng $0$ chỉ khi cả hai cùng bằng $0$; còn thừa số $a$ quyết định điều kiện thứ hai có ràng buộc $x$ hay không.

**Bước 1.** Nhận xét hai số hạng ở vế trái đều không âm để suy ra phương trình tương đương với việc cả hai số hạng đồng thời bằng $0$.

**Bước 2.** Giải riêng điều kiện thứ nhất $x^2-1=0$ để có các giá trị của $x$ cần kiểm tra ở điều kiện còn lại.

**Bước 3.** Chia hai trường hợp $a=0$ và $a\ne0$, vì khi $a=0$ điều kiện thứ hai đúng với mọi $x$ còn khi $a\ne0$ thì nó loại bớt giá trị của $x$.

**Chú ý:** Khi đề có tham số, luôn tự hỏi tham số nhận giá trị nào thì một thừa số hoặc một hệ số bị triệt tiêu, rồi xét riêng trường hợp đó.

**Phần 2. Trình bày**

Vì $\lvert x^2-1\rvert\ge0$ và $\lvert a(x-1)\rvert\ge0$ nên phương trình đã cho tương đương với $x^2-1=0$ và $a(x-1)=0$ đồng thời.

Từ $x^2-1=0$ suy ra $x=1$ hoặc $x=-1$.

Nếu $a=0$: $a(x-1)=0$ đúng với mọi $x$, nên nghiệm là $x=1$ và $x=-1$.

Nếu $a\ne0$: $a(x-1)=0\Leftrightarrow x=1$. Với $x=-1$ thì $a(x-1)=-2a\ne0$ nên bị loại; chỉ còn $x=1$.

Vậy nếu $a=0$ thì $S=\{-1;1\}$; nếu $a\ne0$ thì $S=\{1\}$.

=== C9.2a@p313
- bai: 2 · y: a · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010401
- cong_cu: ghép cặp nhân tử · đặt ẩn phụ · thay giá trị tại nghiệm của đa thức chia
- kiem: khong
- ket_qua_sach: 2002
- dap_an: Dư: $2002$
- ghi_chu_nghi: Sách in sai ở Cách 2: dòng cuối của phép chia đặt tính cho dư 2002 nhưng dòng kết luận ghi 1987; hàng đầu phép chia in số hạng tự do 2132 (trong khi khai triển ngay trên in 2122 và các dòng trừ dùng 2122). Kết quả đúng là 2002 (khớp Cách 1, 3, 4). Dòng "Đặt f(x) = (x+1)(x+3)(x+5)(x+7) = 2017" ở Cách 1 in dấu "=" (đúng là "+"). Câu "Bậc của đa thức thương là 2 nên đa thức dư có dạng ax+b" ở Cách 3 nên là "bậc của đa thức chia là 2".
## DE
Tìm số dư trong phép chia của biểu thức $(x+1)(x+3)(x+5)(x+7)+2017$ cho $x^2+8x+12$.
## SACH
Cách 1: Đặt $f(x)=(x+1)(x+3)(x+5)(x+7)=2017$
Ta có: $f(x)=(x+1)(x+7)(x+3)(x+5)+2017$
$=(x^2+8x+7)(x^2+8x+15)+2017$
$=(x^2+8x+7)[(x^2+8x+12)+3]+2017$
$=(x^2+8x+7)(x^2+8x+12)+3(x^2+8x+7)+2017$
$=(x^2+8x+7)(x^2+8x+12)+3(x^2+8x+12)+2017-15$
$=(x^2+8x+12)(x^2+8x+10)+2002$
Vậy số dư trong phép chia $f(x)$ cho $x^2+8x+12$ là $2002$
Cách 2:
$f(x)=(x^2+4x+3)(x^2+12x+35)+2017$
$=x^4+4x^3+3x^2+12x^3+48x^2+36x+35x^2+140x+105+2017$
$=x^4+16x^3+86x^2+176x+2122$
Thực hiện phép chia (đặt tính): $x^4+16x^3+86x^2+176x+2132$ chia cho $x^2+8x+12$, thương là $x^2+8x+10$:
$x^4+16x^3+86x^2+176x+2132$ trừ $x^4+8x^3+12x^2$ còn $8x^3+74x^2+176x$
$8x^3+74x^2+176x$ trừ $8x^3+64x^2+96x$ còn $10x^2+80x+2122$
$10x^2+80x+2122$ trừ $10x^2+80x+120$ còn $2002$
Vậy số dư trong phép chia $f(x)$ cho $x^2+8x+12$ là $1987$
Cách 3:
Bậc của đa thức thương là $2$ nên đa thức dư có dạng $ax+b$. Gọi đa thức thương là $Q(x)$, ta có:
$(x+1)(x+3)(x+5)(x+7)+2017=(x^2+8x+12)Q(x)+ax+b$
Chọn $x=-2$, ta có: $-1\cdot1\cdot3\cdot5+2017=-2a+b$
$\Leftrightarrow-2a+b=2002$
Cho $x=-6$, ta có: $-5(-3)(-1)\cdot1+2017=-6a+b$
$\Leftrightarrow-6a+b=2002$
Ta có $(-2a+b)-(-6a+b)=0\Leftrightarrow4a=0\Leftrightarrow a=0$
Do đó $b=2002$
Đa thức dư là $2002$
Cách 4:
$f(x)=(x+1)(x+7)(x+3)(x+5)+2017$
$=(x^2+8x+7)(x^2+8x+15)+2017$
$=[(x^2+8x+12)-5][(x^2+8x+12)+3]+2017$
$=(x^2+8x+12)^2-2(x^2+8x+12)-15+2017$
$=(x^2+8x+12)^2-2(x^2+8x+12)+2002$
Vậy số dư trong phép chia $f(x)$ cho $x^2+8x+12$ là $2002$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép các nhân tử thành hai cặp cùng chứa $x^2+8x$ thì đa thức chia $x^2+8x+12$ xuất hiện như một khối, nên viết được biểu thức dưới dạng "khối nhân một biểu thức khác, cộng một hằng số".

**Bước 1.** Ghép $(x+1)(x+7)$ và $(x+3)(x+5)$ vì tổng hai số hạng tự do trong mỗi cặp đều bằng $8$, nhờ đó hai tích cùng có dạng $x^2+8x$ cộng một hằng số.

**Bước 2.** Đặt $u=x^2+8x+12$ (chính là đa thức chia) rồi biểu diễn hai thừa số qua $u$ để đưa tích về một tam thức bậc hai theo $u$.

**Bước 3.** Khai triển, cộng $2017$ và đặt $u$ ra ngoài để tách phần chia hết cho $u$ khỏi một hằng số.

**Bước 4.** Kết luận hằng số còn lại là số dư vì nó có bậc nhỏ hơn bậc của đa thức chia.

**Chú ý:** Đa thức chia $x^2+8x+12=(x+2)(x+6)$ nên cũng có thể giả sử dư là $ax+b$ rồi thay $x=-2$ và $x=-6$; cả hai lần đều cho $-2a+b=-6a+b=2002$, suy ra $a=0$ và $b=2002$.

**Phần 2. Trình bày**

Đặt $f(x)=(x+1)(x+3)(x+5)(x+7)+2017$ và $u=x^2+8x+12$.

$f(x)=(x+1)(x+7)(x+3)(x+5)+2017$

$=(x^2+8x+7)(x^2+8x+15)+2017$

$=(u-5)(u+3)+2017$

$=u^2-2u-15+2017$

$=u(u-2)+2002$

$=(x^2+8x+12)(x^2+8x+10)+2002$

Vì $2002$ là đa thức bậc $0$, nhỏ hơn bậc $2$ của đa thức chia $x^2+8x+12$, nên số dư trong phép chia là $2002$.

=== C9.2b@p313
- bai: 2 · y: b · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040201
- cong_cu: ước chung lớn nhất · hai số nguyên tố cùng nhau · phân tích thành tích
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho các số nguyên dương $a,b,c,d$ thỏa mãn $ab=cd$. Chứng minh rằng $(a^{2016}+b^{2016})^2+(c^{2016}-d^{2016})^2$ là hợp số.
## SACH
Giả sử ƯCLN$(a,c)=m$ ($m\in\mathbb N^*$). Đặt $a=mx$, $c=my$ (với $x,y\in\mathbb N^*$ và ƯCLN$(x,y)=1$)
Từ $ab=cd$. Ta có $mxb=myd\Leftrightarrow xb=yd$
Suy ra $xb\vdots y$. Mà ƯCLN$(x,y)=1$.
Nên $b\vdots y$ đặt $b=ny$ ($n\in\mathbb N^*$)
Ta có $d=nx$
Mặt khác $a^{2016}b^{2016}=c^{2016}d^{2016}$ (vì $ab=cd$)
Do đó $(a^{2016}+b^{2016})^2+(c^{2016}-d^{2016})^2$
$=a^{4032}+b^{4032}+c^{4032}+d^{4032}$
$=m^{4032}x^{4032}+n^{4032}y^{4032}+m^{4032}y^{4032}+n^{4032}x^{4032}$
$=(x^{4032}+y^{4032})(m^{4032}+n^{4032})$ là hợp số (vì $x^{4032}+y^{4032}>1$, $m^{4032}+n^{4032}>1$)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khai triển hai bình phương thì hai tích chéo triệt tiêu nhờ $ab=cd$, còn lại tổng bốn luỹ thừa bậc $4032$; tách $a,c$ theo ước chung lớn nhất để tổng đó phân tích được thành tích hai thừa số lớn hơn $1$.

**Bước 1.** Khai triển hai bình phương rồi dùng $(ab)^{2016}=(cd)^{2016}$ để hai số hạng chứa tích chéo triệt tiêu nhau, còn lại $a^{4032}+b^{4032}+c^{4032}+d^{4032}$.

**Bước 2.** Gọi $m$ là ước chung lớn nhất của $a$ và $c$, viết $a=mx$, $c=my$ với $x,y$ nguyên tố cùng nhau, rồi biến đổi $ab=cd$ thành $xb=yd$.

**Bước 3.** Dùng tính chất nguyên tố cùng nhau để suy ra $y$ là ước của $b$, từ đó biểu diễn $b$ và $d$ theo $n,x,y$.

**Bước 4.** Thay vào tổng bốn luỹ thừa, nhóm theo $m^{4032}$ và $n^{4032}$ để được tích hai tổng, mỗi tổng lớn hơn $1$ nên tích là hợp số.

**Chú ý:** Muốn kết luận hợp số phải chỉ ra tích của hai số nguyên đều lớn hơn $1$; chỉ phân tích được thành tích thôi chưa đủ nếu một thừa số có thể bằng $1$.

**Phần 2. Trình bày**

Vì $ab=cd$ nên $(ab)^{2016}=(cd)^{2016}$, tức $a^{2016}b^{2016}=c^{2016}d^{2016}$.

Do đó $(a^{2016}+b^{2016})^2+(c^{2016}-d^{2016})^2=a^{4032}+b^{4032}+c^{4032}+d^{4032}+2a^{2016}b^{2016}-2c^{2016}d^{2016}$

$=a^{4032}+b^{4032}+c^{4032}+d^{4032}\quad(*)$

Gọi $m$ là ước chung lớn nhất của $a$ và $c$. Đặt $a=mx$, $c=my$ với $x,y\in\mathbb N^*$ và $x,y$ nguyên tố cùng nhau.

Từ $ab=cd$ ta có $mxb=myd\Rightarrow xb=yd$. Suy ra $xb\vdots y$, mà $x,y$ nguyên tố cùng nhau nên $b\vdots y$.

Đặt $b=ny$ với $n\in\mathbb N^*$. Thay vào $xb=yd$ được $xny=yd$, suy ra $d=nx$.

Thay $a=mx$, $b=ny$, $c=my$, $d=nx$ vào $(*)$:

$m^{4032}x^{4032}+n^{4032}y^{4032}+m^{4032}y^{4032}+n^{4032}x^{4032}$

$=(x^{4032}+y^{4032})(m^{4032}+n^{4032})$

Vì $x,y,m,n$ là các số nguyên dương nên $x^{4032}+y^{4032}\ge2>1$ và $m^{4032}+n^{4032}\ge2>1$.

Vậy biểu thức đã cho là tích của hai số nguyên lớn hơn $1$, nên là hợp số.

=== C9.3a@p313
- bai: 3 · y: a · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: xét hiệu · tách hạng tử thành các bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng đầu lời giải sách in "...-ab-ac-ad=ae" (đúng là "-ab-ac-ad-ae"); các dòng sau đúng.
## DE
Chứng minh rằng $a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$.
## SACH
Ta có $a^2+b^2+c^2+d^2+e^2-a(b+c+d+e)$
$=a^2+b^2+c^2+d^2+e^2-ab-ac-ad=ae$
$=\left(\dfrac{a^2}{4}+b^2-ab\right)+\left(\dfrac{a^2}{4}+c^2-ac\right)+\left(\dfrac{a^2}{4}+d^2-ad\right)+\left(\dfrac{a^2}{4}+e^2-ae\right)$
$=\left(\dfrac{a}{2}-b\right)^2+\left(\dfrac{a}{2}-c\right)^2+\left(\dfrac{a}{2}-d\right)^2+\left(\dfrac{a}{2}-e\right)^2\ge0$
Vậy $a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải có bốn tích $ab,ac,ad,ae$, nên tách $a^2$ thành bốn phần bằng nhau $\dfrac{a^2}{4}$ để mỗi phần ghép với một bình phương $b^2,c^2,d^2,e^2$ thành bình phương của một hiệu.

**Bước 1.** Xét hiệu giữa vế trái và vế phải rồi khai triển $a(b+c+d+e)$ để mọi hạng tử đều lộ ra.

**Bước 2.** Tách $a^2=4\cdot\dfrac{a^2}{4}$ và chia mỗi phần $\dfrac{a^2}{4}$ cho một trong bốn tích $-ab,-ac,-ad,-ae$ cùng với bình phương tương ứng.

**Bước 3.** Nhận ra từng nhóm ba hạng tử là bình phương của $\dfrac{a}{2}-b$, $\dfrac{a}{2}-c$, $\dfrac{a}{2}-d$, $\dfrac{a}{2}-e$ rồi kết luận hiệu không âm.

**Chú ý:** Dấu "=" xảy ra khi $b=c=d=e=\dfrac{a}{2}$.

**Phần 2. Trình bày**

$a^2+b^2+c^2+d^2+e^2-a(b+c+d+e)$

$=\left(\dfrac{a^2}{4}-ab+b^2\right)+\left(\dfrac{a^2}{4}-ac+c^2\right)+\left(\dfrac{a^2}{4}-ad+d^2\right)+\left(\dfrac{a^2}{4}-ae+e^2\right)$

$=\left(\dfrac{a}{2}-b\right)^2+\left(\dfrac{a}{2}-c\right)^2+\left(\dfrac{a}{2}-d\right)^2+\left(\dfrac{a}{2}-e\right)^2\ge0$

Vậy $a^2+b^2+c^2+d^2+e^2\ge a(b+c+d+e)$.

=== C9.3b@p313
- bai: 3 · y: b · trang: 313 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: sắp thứ tự các biến · xét tích hai thừa số cùng dấu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: cùng kiểu với ON.19 (đã xếp T18T030103) nên xếp như vậy; có thể là T18T030101.
## DE
Cho $a,b,c$ thỏa mãn $1\le a\le2$, $1\le b\le2$, $1\le c\le2$. Chứng minh rằng $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\le10$.
## SACH
Vai trò $a,b,c$ như nhau. Không mất tính tổng quát, giả sử $1\le a\le b\le c\le2$
Ta có $\dfrac{a}{b}\le1$, $\dfrac{b}{c}\le1$, $\dfrac{b}{a}\ge1$, $\dfrac{c}{b}\ge1$
Do đó $\left(1-\dfrac{a}{b}\right)\left(1-\dfrac{b}{c}\right)+\left(1-\dfrac{b}{a}\right)\left(1-\dfrac{c}{b}\right)\ge0$
$\Rightarrow\dfrac{a}{b}+\dfrac{b}{a}+\dfrac{b}{c}+\dfrac{c}{b}\le2+\dfrac{a}{c}+\dfrac{c}{a}$ (1)
Mặt khác, từ $1\le a\le c\le2$
$\Rightarrow\dfrac{a}{c}<2$, $\dfrac{a}{c}\ge\dfrac{1}{2}\Rightarrow\left(2-\dfrac{a}{c}\right)\left(\dfrac{1}{2}-\dfrac{a}{c}\right)\le0$
$\Rightarrow1+\dfrac{a^2}{c^2}-\dfrac{5}{2}\cdot\dfrac{a}{c}\le0\Rightarrow\dfrac{a}{c}+\dfrac{c}{a}\le\dfrac{5}{2}$ (2)
Từ (1) và (2) ta có $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$
$=3+\dfrac{a}{b}+\dfrac{b}{a}+\dfrac{b}{c}+\dfrac{c}{b}+\dfrac{a}{c}+\dfrac{c}{a}\le3+2+\dfrac{a}{c}+\dfrac{c}{a}+\dfrac{a}{c}+\dfrac{c}{a}$
$\le3+2+\dfrac{5}{2}+\dfrac{5}{2}=10$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức đối xứng nên sắp thứ tự các biến; khi đó các phân số $\dfrac{a}{b},\dfrac{b}{c}$ không vượt quá $1$ còn $\dfrac{b}{a},\dfrac{c}{b}$ không nhỏ hơn $1$, cho phép dùng tích hai thừa số cùng dấu để chặn các tổng nghịch đảo.

**Bước 1.** Giả sử $1\le a\le b\le c\le2$ (được phép vì biểu thức đối xứng) rồi so sánh từng phân số $\dfrac{a}{b},\dfrac{b}{c},\dfrac{b}{a},\dfrac{c}{b}$ với $1$.

**Bước 2.** Nhân hai thừa số cùng dấu để có $\left(1-\dfrac{a}{b}\right)\left(1-\dfrac{b}{c}\right)\ge0$ và $\left(1-\dfrac{b}{a}\right)\left(1-\dfrac{c}{b}\right)\ge0$, rồi cộng hai bất đẳng thức để chặn tổng bốn phân số.

**Bước 3.** Dùng $\dfrac{1}{2}\le\dfrac{a}{c}\le1$ để có tích $\left(2-\dfrac{a}{c}\right)\left(\dfrac{1}{2}-\dfrac{a}{c}\right)\le0$ và chặn tổng $\dfrac{a}{c}+\dfrac{c}{a}$.

**Bước 4.** Khai triển vế trái thành $3$ cộng ba cặp nghịch đảo rồi thay hai đánh giá vừa có để được số $10$.

**Chú ý:** Dấu "=" xảy ra, chẳng hạn, khi $a=b=1$, $c=2$.

**Phần 2. Trình bày**

Biểu thức đối xứng theo $a,b,c$ nên giả sử $1\le a\le b\le c\le2$. Khi đó $\dfrac{a}{b}\le1$, $\dfrac{b}{c}\le1$, $\dfrac{b}{a}\ge1$, $\dfrac{c}{b}\ge1$, nên

$\left(1-\dfrac{a}{b}\right)\left(1-\dfrac{b}{c}\right)\ge0$ và $\left(1-\dfrac{b}{a}\right)\left(1-\dfrac{c}{b}\right)\ge0$.

Cộng hai bất đẳng thức, khai triển ta được $2-\dfrac{a}{b}-\dfrac{b}{c}+\dfrac{a}{c}-\dfrac{b}{a}-\dfrac{c}{b}+\dfrac{c}{a}\ge0$, tức

$\dfrac{a}{b}+\dfrac{b}{a}+\dfrac{b}{c}+\dfrac{c}{b}\le2+\dfrac{a}{c}+\dfrac{c}{a}\quad(1)$

Từ $1\le a\le c\le2$ suy ra $\dfrac{1}{2}\le\dfrac{a}{c}\le1<2$, nên $\left(2-\dfrac{a}{c}\right)\left(\dfrac{1}{2}-\dfrac{a}{c}\right)\le0$, tức $1-\dfrac{5}{2}\cdot\dfrac{a}{c}+\dfrac{a^2}{c^2}\le0$.

Chia hai vế cho $\dfrac{a}{c}>0$ được $\dfrac{c}{a}-\dfrac{5}{2}+\dfrac{a}{c}\le0$, tức

$\dfrac{a}{c}+\dfrac{c}{a}\le\dfrac{5}{2}\quad(2)$

Từ $(1)$ và $(2)$:

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)$

$\le3+2+2\left(\dfrac{a}{c}+\dfrac{c}{a}\right)\le3+2+2\cdot\dfrac{5}{2}=10$.

Vậy $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\le10$.

=== C9.6a@p314
- bai: 6 · y: a · trang: 314 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050101
- cong_cu: nhặt dần từng cặp quen nhau · xét trường hợp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: bài suy luận về quan hệ quen biết, có thể là T18T000000. "Quen" được hiểu là quan hệ hai chiều.
## DE
Có $10$ bạn đi dạo phố bằng $5$ xe máy. Biết rằng trong $10$ bạn này cứ nhóm $3$ người nào cũng có $1$ người quen với $2$ người kia. Chứng tỏ rằng có thể xếp $10$ bạn đó đi dạo phố bằng $5$ xe máy, mỗi xe $2$ người quen nhau (biết rằng cả $10$ bạn đều biết lái xe máy).
## SACH
Lấy $3$ bạn bất kỳ xếp $2$ bạn quen nhau đi cùng $1$ xe, lại lấy $3$ bạn bất kỳ trong $8$ bạn còn lại xếp $2$ bạn quen nhau đi xe thứ hai, tiếp tục lấy $3$ người bất kỳ trong $6$ bạn còn lại xếp $2$ bạn quen nhau đi xe thứ ba, còn lại bốn bạn giả sử là $A,B,C,D$.
Nếu có $2$ bạn không quen nhau giả sử là $A$ và $B$ thì $C$ quen cả $A$ lẫn $B$ (xét $A,B,C$) và $D$ quen cả $A$ lẫn $B$ (xét $D,A,B$) xếp $A$ đi với $C$, $B$ đi với $D$ (hoặc $A$ đi với $D$, $B$ đi với $C$) trên $2$ xe còn lại.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trong ba người bất kì luôn có người quen hai người còn lại, nên luôn chọn được một cặp quen nhau; cứ nhặt dần từng cặp cho đến khi còn đúng bốn người, rồi xử lí riêng nhóm bốn người cuối.

**Bước 1.** Từ giả thiết suy ra trong ba người bất kì có ít nhất một cặp quen nhau, để biết lúc nào cũng xếp được thêm một xe.

**Bước 2.** Lấy ba người bất kì trong $10$ người, trong $8$ người còn lại rồi trong $6$ người còn lại, mỗi lần chọn một cặp quen nhau cho một xe, đến khi còn bốn người.

**Bước 3.** Xét bốn người còn lại: nếu họ đôi một quen nhau thì ghép tuỳ ý, ngược lại tìm một cặp không quen nhau.

**Bước 4.** Áp dụng giả thiết cho hai nhóm ba người chứa cặp không quen đó để chứng tỏ hai người còn lại quen cả hai người ấy, rồi ghép chéo.

**Chú ý:** Khi hai người không quen nhau thì người "quen hai người kia" trong nhóm ba chứa họ buộc phải là người thứ ba; nhớ lập luận bằng cách loại hai người này.

**Phần 2. Trình bày**

Trong ba người bất kì có một người quen hai người còn lại, nên trong ba người bất kì có ít nhất một cặp quen nhau.

Lấy ba bạn bất kì trong $10$ bạn, chọn hai bạn quen nhau cho đi xe thứ nhất. Lấy ba bạn bất kì trong $8$ bạn còn lại, chọn hai bạn quen nhau cho đi xe thứ hai. Lấy ba bạn bất kì trong $6$ bạn còn lại, chọn hai bạn quen nhau cho đi xe thứ ba. Còn lại bốn bạn $A,B,C,D$.

Nếu bốn bạn $A,B,C,D$ đôi một quen nhau thì ghép tuỳ ý thành hai cặp cho hai xe còn lại.

Nếu có hai bạn không quen nhau, giả sử là $A$ và $B$: xét nhóm $A,B,C$, có một bạn quen hai bạn kia; bạn đó không thể là $A$ hay $B$ (vì $A,B$ không quen nhau) nên là $C$. Vậy $C$ quen cả $A$ và $B$.

Tương tự, xét nhóm $A,B,D$ được $D$ quen cả $A$ và $B$.

Xếp $A$ đi với $C$ và $B$ đi với $D$ trên hai xe còn lại.

Vậy có thể xếp $10$ bạn đi bằng $5$ xe máy, mỗi xe hai người quen nhau.

=== C9.6b@p314
- bai: 6 · y: b · trang: 314 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050102
- cong_cu: nguyên tắc Đi-rích-lê · đường trung bình hình thang · tổng các góc quanh một điểm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách có hình vuông ABCD, E,F là trung điểm hai cạnh bên và các điểm I,K,G,H nhưng đề không có hình; lời giải kho tự đặt tên điểm. Sách bỏ qua việc chứng minh đường thẳng chia hình vuông thành hai tứ giác phải cắt hai cạnh đối và việc EI:IF bằng tỉ số diện tích; lời giải kho đã bổ sung. Chưa chắc nhóm: T18T050102 (hình học tổ hợp, Đi-rích-lê).
## DE
Cho một hình vuông và $17$ đường thẳng mỗi đường thẳng đều chia hình vuông thành hai tứ giác có tỉ số diện tích bằng $2:3$. Chứng minh rằng trong $17$ đường thẳng đó, có ít nhất $5$ đường thẳng cùng đi qua một điểm và xét các góc không có điểm trong chung của $5$ đường thẳng này, tồn tại hai góc lớn hơn hoặc bằng $36^\circ$.
## SACH
Gọi $d$ là đường thẳng chia hình vuông $ABCD$ thành hai tứ giác có tỉ số diện tích bằng $2:3$. Đường thẳng $d$ không thể cắt hai cạnh kề nhau của hình vuông vì khi đó không tạo thành hai tứ giác. Giả sử $d$ cắt hai cạnh $AB$ và $CD$ tại $M$ và $N$, khi đó nó cắt đường trung bình $EF$ tại $I$. [Hình: hình vuông $ABCD$ ($A,B$ ở trên, $D,C$ ở dưới), $E,F$ là trung điểm hai cạnh bên $AD,BC$; hai đường trung bình vẽ nét đứt; $I,K$ nằm trên $EF$, $G,H$ nằm trên đường trung bình còn lại.]
Giả sử $S_{AMND}=\dfrac{2}{3}S_{BMNC}$ thì $EI=\dfrac{2}{3}IF$
Như vậy mỗi đường thẳng đã cho chia đường trung bình của hình vuông theo tỉ số $2:3$. Có bốn điểm chia đường trung bình của hình vuông $ABCD$ theo tỉ số $2:3$ (là các điểm $I,K,G,H$ trên hình vẽ)
Có $17$ đường thẳng, mỗi đường thẳng đi qua một trong bốn điểm. Phép chia $17$ cho $4$ có thương là $4$ và còn dư nên tồn tại một điểm có ít nhất $(4+1)$ đường thẳng đi qua.
$5$ đường thẳng này cắt nhau tại một điểm, có $10$ góc không có điểm trong chung, tổng của chúng bằng $360^\circ$. Nếu mỗi góc đều nhỏ hơn $36^\circ$ thì tổng của chúng nhỏ hơn $360^\circ$. Vô lí.
Như vậy phải tồn tại một góc lớn hơn hoặc bằng $36^\circ$. Mặt khác mỗi góc này đều có một góc đối đỉnh với nó. Mà hai góc đối đỉnh thì bằng nhau
Vậy tồn tại hai góc lớn hơn hoặc bằng $36^\circ$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đường thẳng chia hình vuông thành hai tứ giác diện tích $2:3$ buộc phải đi qua một trong bốn điểm cố định (hai điểm trên mỗi đường trung bình), nên $17$ đường thẳng rơi vào $4$ điểm là dấu hiệu dùng nguyên tắc Đi-rích-lê.

**Bước 1.** Chỉ ra đường thẳng chia hình vuông thành hai tứ giác thì phải cắt hai cạnh đối diện tại điểm trong của các cạnh, vì các vị trí khác cho tam giác hoặc ngũ giác.

**Bước 2.** Dùng đường trung bình của hình thang để suy ra tỉ số hai diện tích bằng tỉ số hai đoạn mà đường thẳng chia đường trung bình của hình vuông, từ đó xác định bốn điểm cố định.

**Bước 3.** Áp dụng nguyên tắc Đi-rích-lê cho $17$ đường thẳng và $4$ điểm để có một điểm có ít nhất $5$ đường thẳng đi qua.

**Bước 4.** Dùng tổng các góc quanh một điểm bằng $360^\circ$ cho $10$ góc tạo bởi $5$ đường thẳng, rồi dùng tính chất hai góc đối đỉnh để được hai góc.

**Chú ý:** Đừng quên loại các vị trí đường thẳng không cho hai tứ giác (qua đỉnh, cắt hai cạnh kề) trước khi nói "đường thẳng đi qua điểm cố định".

**Phần 2. Trình bày**

Gọi hình vuông là $ABCD$; $E,F$ lần lượt là trung điểm của $AD,BC$; $P,Q$ lần lượt là trung điểm của $AB,CD$. Khi đó $EF\parallel AB$ và $PQ\parallel AD$ là hai đường trung bình của hình vuông.

Gọi $d$ là một trong $17$ đường thẳng. Nếu $d$ qua một đỉnh hoặc cắt hai cạnh kề thì $d$ chia hình vuông thành tam giác và tứ giác hoặc tam giác và ngũ giác, hoặc thành hai tam giác, không thoả mãn. Vậy $d$ cắt hai cạnh đối diện tại các điểm trong của hai cạnh đó.

Giả sử $d$ cắt $AB,CD$ tại $M,N$ (trường hợp $d$ cắt $AD,BC$ làm tương tự với đường trung bình $PQ$). Vì $AB\parallel CD$ nên $AMND$ và $BMNC$ là hai hình thang.

$EF$ song song và cách đều $AB,CD$ nên $EF$ cắt $MN$ tại trung điểm $I$ của $MN$. Do $E,I$ là trung điểm hai cạnh bên của hình thang $AMND$ nên $EI=\dfrac{AM+DN}{2}$; tương tự $IF=\dfrac{BM+CN}{2}$.

Suy ra $S_{AMND}=\dfrac{AM+DN}{2}\cdot AD=EI\cdot AD$ và $S_{BMNC}=IF\cdot AD$, nên $S_{AMND}:S_{BMNC}=EI:IF$.

Vì tỉ số hai diện tích là $2:3$ (theo một thứ tự nào đó) nên $EI:IF=2:3$ hoặc $EI:IF=3:2$, tức $I$ là một trong hai điểm chia đoạn $EF$ theo tỉ số $2:3$. Tương tự, nếu $d$ cắt $AD,BC$ thì $d$ đi qua một trong hai điểm chia $PQ$ theo tỉ số $2:3$.

Vậy mỗi đường thẳng trong $17$ đường đều đi qua một trong $4$ điểm cố định. Vì $17=4\cdot4+1$ nên theo nguyên tắc Đi-rích-lê tồn tại một điểm $O$ có ít nhất $5$ đường thẳng đi qua.

Năm đường thẳng đó cắt nhau tại $O$ và chia mặt phẳng thành $10$ góc không có điểm trong chung, tổng các góc bằng $360^\circ$. Nếu cả $10$ góc đều nhỏ hơn $36^\circ$ thì tổng nhỏ hơn $10\cdot36^\circ=360^\circ$, vô lí. Vậy có một góc lớn hơn hoặc bằng $36^\circ$.

Góc đó có một góc đối đỉnh (cũng là một trong $10$ góc) và hai góc đối đỉnh thì bằng nhau, nên có ít nhất hai góc lớn hơn hoặc bằng $36^\circ$.

=== C10.1a@p320
- bai: 1 · y: a · trang: 320 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020102
- cong_cu: nhóm hạng tử đưa về phương trình tích
- kiem: nghiem | -x^3+2x^2+x-2 = 0 | x
- ket_qua_sach: 2; 1; -1
- dap_an: $S=\{2;1;-1\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $-x^3+2x^2+x-2=0$.
## SACH
$-x^3+2x^2+x-2=0\Leftrightarrow-x^2(x-2)+(x-2)=0$
$\Leftrightarrow(x-2)(1-x^2)=0\Leftrightarrow\begin{cases}x-2=0\\1-x^2=0\end{cases}\Leftrightarrow\begin{cases}x=2\\x^2=1\end{cases}\Leftrightarrow\begin{cases}x=2\\x=\pm1\end{cases}$
Vậy tập nghiệm của phương trình là $S=\{2;1;-1\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình bậc ba không có nhân tử chung nhưng hai hạng tử đầu và hai hạng tử cuối cùng chứa nhân tử $x-2$, nên nhóm hạng tử để đưa về phương trình tích.

**Bước 1.** Nhóm hai hạng tử đầu và hai hạng tử cuối, đặt $-x^2$ ở nhóm đầu để cả hai nhóm cùng xuất hiện nhân tử $x-2$.

**Bước 2.** Đặt nhân tử chung $x-2$ ra ngoài để vế trái thành tích của một nhị thức và một nhị thức bậc hai chưa phân tích hết.

**Bước 3.** Phân tích tiếp thừa số $1-x^2$ bằng hằng đẳng thức hiệu hai bình phương rồi cho từng nhân tử bằng $0$.

**Chú ý:** Đừng chia hai vế cho $x-2$ khi chưa xét $x=2$; luôn chuyển về dạng tích bằng $0$ để không mất nghiệm.

**Phần 2. Trình bày**

$-x^3+2x^2+x-2=0$

$\Leftrightarrow-x^2(x-2)+(x-2)=0$

$\Leftrightarrow(x-2)(1-x^2)=0$

$\Leftrightarrow(x-2)(1-x)(1+x)=0$

$\Leftrightarrow x=2$ hoặc $x=1$ hoặc $x=-1$.

Vậy $S=\{2;1;-1\}$.

=== C10.1b@p320
- bai: 1 · y: b · trang: 320 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020101
- cong_cu: quy đồng khử mẫu · điều kiện xác định
- kiem: nghiem | \dfrac{x}{x-1}-\dfrac{2(x+3)}{x+1} = \dfrac{2}{x^2-1} | x
- ket_qua_sach: -4
- dap_an: $S=\{-4\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $\dfrac{x}{x-1}-\dfrac{2(x+3)}{x+1}=\dfrac{2}{x^2-1}$.
## SACH
ĐKXĐ: $x\ne1$, $x\ne-1$
Với ĐKXĐ trên phương trình trở thành
$x(x+1)-2(x+3)(x-1)=2$
$\Leftrightarrow x^2+x-2x^2+2x-6x+6=2\Leftrightarrow-x^2-3x+4=0$
$\Leftrightarrow-x^2+x-4x+4=0\Leftrightarrow(x+4)(1-x)=0$
$\Leftrightarrow\begin{cases}x+4=0\\1-x=0\end{cases}\Leftrightarrow x=-4$ (nhận) hoặc $x=1$ (loại)
Vậy tập nghiệm của phương trình là $S=\{-4\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu thức $x^2-1=(x-1)(x+1)$ chính là mẫu chung của hai phân số ở vế trái, nên quy đồng được ngay rồi khử mẫu, nhưng phải đặt điều kiện xác định trước và đối chiếu nghiệm sau.

**Bước 1.** Tìm điều kiện để các mẫu khác $0$ và nhận ra $x^2-1=(x-1)(x+1)$ để chọn mẫu chung.

**Bước 2.** Quy đồng rồi nhân hai vế với mẫu chung để khử mẫu, được một phương trình đa thức.

**Bước 3.** Khai triển, thu gọn thành phương trình bậc hai và phân tích vế trái thành tích hai nhị thức.

**Bước 4.** Đối chiếu từng nghiệm tìm được với điều kiện xác định để loại nghiệm làm mẫu bằng $0$.

**Chú ý:** Sau khi khử mẫu, nghiệm làm mẫu bằng $0$ là nghiệm ngoại lai và bắt buộc phải loại.

**Phần 2. Trình bày**

Điều kiện xác định: $x\ne1$ và $x\ne-1$.

$\dfrac{x}{x-1}-\dfrac{2(x+3)}{x+1}=\dfrac{2}{(x-1)(x+1)}$

$\Rightarrow x(x+1)-2(x+3)(x-1)=2$

$\Leftrightarrow x^2+x-2x^2-4x+6=2$

$\Leftrightarrow-x^2-3x+4=0$

$\Leftrightarrow x^2+3x-4=0$

$\Leftrightarrow(x+4)(x-1)=0$

$\Leftrightarrow x=-4$ hoặc $x=1$.

Đối chiếu điều kiện xác định: $x=1$ bị loại, $x=-4$ thỏa mãn.

Vậy $S=\{-4\}$.

=== C10.1c@p320
- bai: 1 · y: c · trang: 320 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020104
- cong_cu: phá dấu giá trị tuyệt đối theo từng khoảng
- kiem: nghiem | 2\lvert x+1\rvert-3x = 5 | x
- ket_qua_sach: -\dfrac{7}{5}
- dap_an: $S=\left\{-\dfrac{7}{5}\right\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $2\lvert x+1\rvert-3x=5$.
## SACH
$2\lvert x+1\rvert-3x=5$ $(*)$
Nếu $x\ge-1$ thì $(*)\Leftrightarrow2(x+1)-3x=5$
$\Leftrightarrow2x+2-3x=5\Leftrightarrow-x+2=5\Leftrightarrow x=-3$ (loại)
Nếu $x<-1$ thì $(*)\Leftrightarrow-2(x+1)-3x=5$
$\Leftrightarrow-2x-2-3x=5\Leftrightarrow-5x-2=5\Leftrightarrow x=-\dfrac{7}{5}$ (nhận)
Vậy tập nghiệm của phương trình là $S=\left\{-\dfrac{7}{5}\right\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức trong giá trị tuyệt đối là $x+1$, nên chia hai trường hợp theo dấu của $x+1$ để bỏ dấu giá trị tuyệt đối, rồi nhớ đối chiếu nghiệm với điều kiện của từng trường hợp.

**Bước 1.** Xác định mốc đổi dấu của biểu thức trong dấu giá trị tuyệt đối để chia thành hai khoảng của $x$.

**Bước 2.** Ở khoảng $x\ge-1$, bỏ dấu giá trị tuyệt đối giữ nguyên biểu thức rồi giải phương trình bậc nhất thu được.

**Bước 3.** Ở khoảng $x<-1$, bỏ dấu giá trị tuyệt đối bằng cách đổi dấu biểu thức rồi giải phương trình bậc nhất thu được.

**Bước 4.** So sánh từng nghiệm với điều kiện của khoảng tương ứng để giữ hay loại.

**Chú ý:** Nghiệm tìm được trong một trường hợp chỉ nhận khi nó thỏa điều kiện của chính trường hợp đó.

**Phần 2. Trình bày**

Nếu $x\ge-1$ thì $\lvert x+1\rvert=x+1$, phương trình trở thành $2(x+1)-3x=5$.

$\Leftrightarrow-x+2=5\Leftrightarrow x=-3$, không thỏa $x\ge-1$ nên loại.

Nếu $x<-1$ thì $\lvert x+1\rvert=-(x+1)$, phương trình trở thành $-2(x+1)-3x=5$.

$\Leftrightarrow-5x-2=5\Leftrightarrow x=-\dfrac{7}{5}$, thỏa $x<-1$ nên nhận.

Vậy $S=\left\{-\dfrac{7}{5}\right\}$.

=== C10.2a@p320
- bai: 2 · y: a · trang: 320 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: tách thành hằng số cộng bình phương · nhân tử và mẫu với một số
- kiem: khong
- ket_qua_sach: \dfrac{2015}{2016} khi x=2016
- dap_an: Giá trị nhỏ nhất là $\dfrac{2015}{2016}$, đạt khi $x=2016$
- ghi_chu_nghi: Dòng đầu của lời giải sách (nhân tử và mẫu với 2016) ảnh in số hạng tự do là 2016 (có thể mất số mũ 2); chép là 2016^2 theo dòng kế tiếp.
## DE
Tìm giá trị nhỏ nhất của $M=\dfrac{x^2-2x+2016}{x^2}$ với $x\ne0$.
## SACH
$M=\dfrac{x^2-2x+2016}{x^2}=\dfrac{2016x^2-2\cdot x\cdot2016+2016^2}{2016x^2}$
$=\dfrac{2015x^2+(x^2-2\cdot x\cdot2016+2016^2)}{2016x^2}$
$=\dfrac{2015}{2016}+\dfrac{(x-2016)^2}{2016x^2}\ge\dfrac{2015}{2016}$
Dấu "=" xảy ra $\Leftrightarrow x-2016=0\Leftrightarrow x=2016$
Vậy giá trị nhỏ nhất của $M$ là $\dfrac{2015}{2016}\Leftrightarrow x=2016$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn tìm giá trị nhỏ nhất của phân thức có tử là tam thức bậc hai, tách tử thành "bình phương của một hiệu cộng một phần của $x^2$" để $M$ thành hằng số cộng một biểu thức không âm.

**Bước 1.** Nhân cả tử và mẫu với $2016$ để hạng tử bậc nhất trở thành $-2\cdot2016x$ và hệ số tự do thành $2016^2$, khớp với khai triển của $(x-2016)^2$.

**Bước 2.** Tách $2016x^2=2015x^2+x^2$ để ghép $x^2$ với hai hạng tử còn lại thành bình phương của hiệu $x-2016$.

**Bước 3.** Chia tử cho mẫu để $M$ bằng một hằng số cộng một phân thức có tử là bình phương, mẫu dương, rồi đánh giá phân thức đó không âm.

**Bước 4.** Tìm giá trị của $x$ làm dấu "=" xảy ra và kiểm tra giá trị đó thỏa $x\ne0$.

**Chú ý:** Có thể đặt $t=\dfrac{1}{x}$ để đưa về tam thức bậc hai $M=2016t^2-2t+1$ rồi tìm giá trị nhỏ nhất.

**Phần 2. Trình bày**

$M=\dfrac{x^2-2x+2016}{x^2}=\dfrac{2016x^2-2\cdot2016x+2016^2}{2016x^2}$

$=\dfrac{2015x^2+(x^2-2\cdot2016x+2016^2)}{2016x^2}$

$=\dfrac{2015}{2016}+\dfrac{(x-2016)^2}{2016x^2}$

Vì $\dfrac{(x-2016)^2}{2016x^2}\ge0$ với mọi $x\ne0$ nên $M\ge\dfrac{2015}{2016}$.

Dấu "=" xảy ra khi $x-2016=0$, tức $x=2016$ (thỏa $x\ne0$).

Vậy giá trị nhỏ nhất của $M$ là $\dfrac{2015}{2016}$, đạt khi $x=2016$.

=== C10.2b@p320
- bai: 2 · y: b · trang: 320 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: bình phương một tổng · biểu thức đối xứng
- kiem: khong
- ket_qua_sach: 2032128
- dap_an: $2032128$
- ghi_chu_nghi: Dòng khai triển (ab+bc+ca)^2 trong sách in lẫn chữ ("2(abbc+2abbc+2caab)"), đúng phải là 2(ab·bc+bc·ca+ca·ab)=2abc(a+b+c); các dòng sau đúng, kết quả đúng.
## DE
Cho ba số $a,b,c$ thỏa mãn $a+b+c=0$ và $a^2+b^2+c^2=2016$. Tính $A=a^4+b^4+c^4$.
## SACH
Ta có $a+b+c=0\Rightarrow(a+b+c)^2=0$
$\Rightarrow a^2+b^2+c^2+2(ab+bc+ca)=0$
Mà $a^2+b^2+c^2=2016$
Do đó $2016+2(ab+bc+ca)=0$
$\Rightarrow ab+bc+ca=-2016:2=-1008\Rightarrow(ab+bc+ca)^2=(-1008)^2$
$\Rightarrow a^2b^2+b^2c^2+c^2a^2+2(abbc+2abbc+2caab)=1008^2$
$\Rightarrow a^2b^2+b^2c^2+c^2a^2+2abc(a+b+c)=1008^2$
$\Rightarrow a^2b^2+b^2c^2+c^2a^2=1008^2$ (vì $a+b+c=0$)
Mặt khác $(a^2+b^2+c^2)^2=2016^2$
$\Rightarrow a^4+b^4+c^4+2(a^2b^2+b^2c^2+c^2a^2)=2016^2$
Do đó $a^4+b^4+c^4+2\cdot1008^2=2016^2$
Vậy $a^4+b^4+c^4=2016^2-2\cdot1008^2=2032128$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $a+b+c=0$ tính được $ab+bc+ca$, rồi bình phương hai lần liên tiếp để từ tổng bình phương đi đến tổng luỹ thừa bậc bốn mà không cần tìm riêng $a,b,c$.

**Bước 1.** Bình phương hai vế của $a+b+c=0$ rồi thay $a^2+b^2+c^2=2016$ để tính được $ab+bc+ca$.

**Bước 2.** Bình phương $ab+bc+ca$ để liên hệ với $a^2b^2+b^2c^2+c^2a^2$; phần dư ra là $2abc(a+b+c)$ nên bằng $0$.

**Bước 3.** Bình phương $a^2+b^2+c^2$ để xuất hiện $a^4+b^4+c^4$ cộng hai lần tổng $a^2b^2+b^2c^2+c^2a^2$ vừa tính.

**Bước 4.** Rút $a^4+b^4+c^4$ rồi tính giá trị số, tận dụng $2016=2\cdot1008$ cho gọn.

**Chú ý:** Với $a+b+c=0$, nhớ rằng $(ab+bc+ca)^2=a^2b^2+b^2c^2+c^2a^2$ vì số hạng $2abc(a+b+c)$ bị triệt tiêu.

**Phần 2. Trình bày**

Từ $a+b+c=0$ suy ra $(a+b+c)^2=0$, tức $a^2+b^2+c^2+2(ab+bc+ca)=0$.

Thay $a^2+b^2+c^2=2016$ được $ab+bc+ca=-1008$.

Ta có $(ab+bc+ca)^2=a^2b^2+b^2c^2+c^2a^2+2abc(a+b+c)$. Vì $a+b+c=0$ nên

$a^2b^2+b^2c^2+c^2a^2=(-1008)^2=1008^2$.

Mặt khác $(a^2+b^2+c^2)^2=a^4+b^4+c^4+2(a^2b^2+b^2c^2+c^2a^2)$, nên

$a^4+b^4+c^4=2016^2-2\cdot1008^2=4\cdot1008^2-2\cdot1008^2=2\cdot1008^2=2032128$.

Vậy $A=2032128$.

=== C10.6a@p321
- bai: 6 · y: a · trang: 321 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: tách hệ số đưa về bình phương · đánh giá chặn · xét tính chẵn lẻ
- kiem: khong
- ket_qua_sach: (4;3); (-3;-4); (3;4); (-4;-3)
- dap_an: $(x;y)\in\{(4;3);(-3;-4);(3;4);(-4;-3)\}$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T040301 (đưa về phương trình tích).
## DE
Tìm các cặp số nguyên $(x;y)$ thỏa mãn phương trình $2015(x^2+y^2)-2014(2xy+1)=25$.
## SACH
$2015(x^2+y^2)-2014(2xy+1)=25$
$\Leftrightarrow x^2+y^2+2014(x^2+y^2)-2014\cdot2xy-2014=25$
$\Leftrightarrow x^2+y^2+2014(x^2+y^2-2xy)=25+2014$
$\Leftrightarrow x^2+y^2+2014(x-y)^2=2039$ $(*)$
Vì $x,y\in\mathbb Z$. Do đó $\lvert x-y\rvert$ là số tự nhiên
Nếu $\lvert x-y\rvert\ge2$ thì $(x-y)^2\ge4\Rightarrow2014(x-y)^2\ge8056$
Do đó $x^2+y^2+2014(x-y)^2>2039$
Nên $(*)$ không xảy ra. Nên $\lvert x-y\rvert\le1$
Vậy có $\lvert x-y\rvert\in\{0;1\}$
* Xét $\lvert x-y\rvert=0$. Ta có $x-y=0\Leftrightarrow x=y$
$x=y$, từ $(*)$ có $2x^2=2039$ (vô lí! Vì $2x^2\vdots2$, $2039\not\vdots2$)
* Xét $\lvert x-y\rvert=1\Leftrightarrow\begin{cases}x-y=1\\x-y=-1\end{cases}\Leftrightarrow\begin{cases}y=x-1\\y=x+1\end{cases}$
$\lvert x-y\rvert=1$, từ $(*)$ có $x^2+y^2+2014=2039\Leftrightarrow x^2+y^2=25$
- Xét $y=x-1$. Ta có $x^2+(x-1)^2=25\Leftrightarrow2x^2-2x+1=25$
$\Leftrightarrow x^2-x-12=0\Leftrightarrow x^2-4x+3x-12=0$
$\Leftrightarrow(x-4)(x+3)=0\Leftrightarrow\begin{cases}x=4\\x=-3\end{cases}$
Với $x=4$ thì $y=4-1=3$. Với $x=-3$ thì $y=-3-1=-4$
- Xét $y=x+1$. Ta có $x^2+(x+1)^2=25\Leftrightarrow2x^2+2x+1=25$
$\Leftrightarrow x^2+x-12=0\Leftrightarrow x^2-3x+4x-12=0$
$\Leftrightarrow(x-3)(x+4)=0\Leftrightarrow\begin{cases}x=3\\x=-4\end{cases}$
Với $x=3$ thì $y=3+1=4$. Với $x=-4$ thì $y=-4+1=-3$
Vậy các cặp số nguyên $(x;y)$ cần tìm là $(4;3)$; $(-3;-4)$; $(3;4)$; $(-4;-3)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tách $2015=1+2014$ để gom $2014(x^2-2xy+y^2)=2014(x-y)^2$; hệ số $2014$ rất lớn nên $(x-y)^2$ chỉ nhận được các giá trị rất nhỏ, từ đó chặn được $\lvert x-y\rvert$ và giải từng trường hợp.

**Bước 1.** Tách hệ số $2015$ thành $1+2014$ và gộp phần có hệ số $2014$ thành $2014(x-y)^2$, đưa phương trình về dạng $x^2+y^2+2014(x-y)^2=2039$.

**Bước 2.** Chặn $\lvert x-y\rvert$: nếu $\lvert x-y\rvert\ge2$ thì vế trái vượt quá $2039$, nên $\lvert x-y\rvert$ chỉ có thể bằng $0$ hoặc $1$.

**Bước 3.** Xét $x=y$ và dùng tính chẵn lẻ để chứng tỏ trường hợp này không có nghiệm nguyên.

**Bước 4.** Xét $x-y=\pm1$, thay vào được $x^2+y^2=25$ rồi giải phương trình bậc hai ở mỗi trường hợp để lấy các cặp nguyên.

**Chú ý:** Khi một hệ số rất lớn đi cùng một bình phương của số nguyên, hãy nghĩ ngay đến việc chặn bình phương đó bằng $0$ hoặc $1$.

**Phần 2. Trình bày**

$2015(x^2+y^2)-2014(2xy+1)=25$

$\Leftrightarrow x^2+y^2+2014(x^2+y^2)-2014\cdot2xy-2014=25$

$\Leftrightarrow x^2+y^2+2014(x-y)^2=2039\quad(*)$

Vì $x,y\in\mathbb Z$ nên $\lvert x-y\rvert$ là số tự nhiên. Nếu $\lvert x-y\rvert\ge2$ thì $2014(x-y)^2\ge2014\cdot4=8056>2039$, mâu thuẫn với $(*)$. Vậy $\lvert x-y\rvert\in\{0;1\}$.

Trường hợp $x=y$: $(*)$ thành $2x^2=2039$, vô nghiệm nguyên vì vế trái chẵn, vế phải lẻ.

Trường hợp $\lvert x-y\rvert=1$: $(*)$ thành $x^2+y^2+2014=2039$, tức $x^2+y^2=25$.

Với $y=x-1$: $x^2+(x-1)^2=25\Leftrightarrow x^2-x-12=0\Leftrightarrow(x-4)(x+3)=0$, được $x=4$ (khi đó $y=3$) hoặc $x=-3$ (khi đó $y=-4$).

Với $y=x+1$: $x^2+(x+1)^2=25\Leftrightarrow x^2+x-12=0\Leftrightarrow(x-3)(x+4)=0$, được $x=3$ (khi đó $y=4$) hoặc $x=-4$ (khi đó $y=-3$).

Vậy $(x;y)\in\{(4;3);(-3;-4);(3;4);(-4;-3)\}$.

=== C10.6b@p321
- bai: 6 · y: b · trang: 321 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: sắp thứ tự các số · làm trội · đánh giá tổng bằng dãy số liên tiếp
- kiem: khong
- ket_qua_sach: ii) (5;6;7;8;9); (5;7;8;9;10)
- dap_an: i. Chứng minh; ii. $(5;6;7;8;9)$ và $(5;7;8;9;10)$
- ghi_chu_nghi: Ý ii của sách chỉ chặn được a_1=5, a_2∈{6;7} rồi nêu hai bộ mà không kiểm tra điều kiện "tổng ba số bất kì lớn hơn tổng hai số còn lại" để loại các bộ khác; lời giải kho đã bổ sung phần này. Chưa chắc nhóm: có thể là T18T000000.
## DE
Cho $5$ số tự nhiên phân biệt sao cho tổng của ba số bất kì trong chúng lớn hơn tổng của hai số còn lại.

i. Chứng minh rằng tất cả $5$ số đã cho đều không nhỏ hơn $5$.

ii. Tìm tất cả các bộ gồm $5$ số thỏa mãn đề bài mà tổng của chúng nhỏ hơn $40$.
## SACH
i. Gọi $5$ số tự nhiên phân biệt là $a_1,a_2,a_3,a_4,a_5$ trong đó $a_5>a_4>a_3>a_2>a_1$ $(*)$
Từ $(*)$ ta có $a_5-a_3\ge2$ và $a_4-a_2\ge2$
Theo đầu bài, ta có $a_1+a_2+a_3>a_4+a_5$
Nên $a_1>a_5-a_3+a_4-a_2\ge2+2=4\Rightarrow a_1\ge5$
Vậy có $a_5>a_4>a_3>a_2>a_1\ge5$
Như vậy tất cả $5$ số đã cho đều không nhỏ hơn $5$.
ii. Ta có $a_5>a_4>a_3>a_2>a_1\ge5$
và $a_1+a_2+a_3+a_4+a_5<40$
Mà $a_1+a_2+a_3+a_4+a_5\ge a_1+a_1+1+a_1+2+a_1+3+a_1+4=5a_1+10$. Nên $5a_1+10<40\Rightarrow a_1<6$, $5\le a_1<6$, $a_1\in\mathbb N\Rightarrow a_1=5$.
Nên $a_2+a_3+a_4+a_5<35$
Mặt khác $a_2+a_3+a_4+a_5\ge a_2+a_2+1+a_2+2+a_2+3=4a_2+6$
Nên $4a_2+6<35\Rightarrow a_2<\dfrac{29}{4}$. Ta có $a_2\le7$
Vì $6\le a_2\le7$, $a_2\in\mathbb N\Rightarrow a_2=6$ hoặc $a_2=7$
Như vậy có hai bộ gồm $5$ số $(a_1;a_2;a_3;a_4;a_5)$ thỏa mãn đầu bài toán là $(5;6;7;8;9)$, $(5;7;8;9;10)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Sắp xếp $5$ số theo thứ tự tăng thì điều kiện "tổng ba số bất kì lớn hơn tổng hai số còn lại" chỉ cần kiểm cho ba số nhỏ nhất và hai số lớn nhất, và vì các số phân biệt nên hiệu của hai số cách nhau một vị trí tối thiểu là $2$.

**Bước 1.** Gọi các số là $a_1<a_2<a_3<a_4<a_5$ rồi suy ra $a_5-a_3\ge2$ và $a_4-a_2\ge2$ vì chúng là các số tự nhiên phân biệt.

**Bước 2.** Dùng điều kiện cho nhóm ba số nhỏ nhất $a_1+a_2+a_3>a_4+a_5$ để đánh giá $a_1$ lớn hơn tổng hai hiệu trên, từ đó có $a_1\ge5$.

**Bước 3.** Ở ý ii, đánh giá tổng năm số từ dưới bằng dãy số liên tiếp bắt đầu từ $a_1$ để chặn $a_1$, rồi làm tương tự cho $a_2$.

**Bước 4.** Với từng giá trị của $a_2$, dùng điều kiện $a_1+a_2+a_3>a_4+a_5$ để chặn $a_3$, sau đó chặn $a_4+a_5$ và kiểm tra lại bộ số tìm được.

**Chú ý:** Điều kiện của đề với mọi nhóm ba số tương đương với điều kiện cho ba số nhỏ nhất, vì tổng ba số bất kì không nhỏ hơn $a_1+a_2+a_3$ và tổng hai số còn lại không lớn hơn $a_4+a_5$.

**Phần 2. Trình bày**

Gọi $5$ số là $a_1<a_2<a_3<a_4<a_5$. Tổng ba số bất kì không nhỏ hơn $a_1+a_2+a_3$, tổng hai số còn lại không lớn hơn $a_4+a_5$, nên điều kiện của đề tương đương với $a_1+a_2+a_3>a_4+a_5\quad(1)$.

i. Vì các số tự nhiên phân biệt nên $a_5-a_3\ge2$ và $a_4-a_2\ge2$. Từ $(1)$:

$a_1>(a_5-a_3)+(a_4-a_2)\ge2+2=4$, suy ra $a_1\ge5$.

Vậy $a_5>a_4>a_3>a_2>a_1\ge5$, tức cả $5$ số đều không nhỏ hơn $5$.

ii. Ta có $a_2\ge a_1+1$, $a_3\ge a_1+2$, $a_4\ge a_1+3$, $a_5\ge a_1+4$ nên tổng $\ge5a_1+10$. Từ tổng nhỏ hơn $40$ suy ra $5a_1+10<40$, tức $a_1<6$. Kết hợp $a_1\ge5$ được $a_1=5$.

Khi đó $a_2+a_3+a_4+a_5<35$ và $a_3\ge a_2+1$, $a_4\ge a_2+2$, $a_5\ge a_2+3$ nên $4a_2+6<35$, tức $a_2<\dfrac{29}{4}$, suy ra $a_2\le7$. Mà $a_2\ge6$ nên $a_2=6$ hoặc $a_2=7$.

Trường hợp $a_2=6$: từ $(1)$ có $11+a_3>a_4+a_5\ge(a_3+1)+(a_3+2)=2a_3+3$, suy ra $a_3<8$. Mà $a_3\ge7$ nên $a_3=7$. Khi đó $a_4+a_5<18$ và $a_4\ge8$, $a_5\ge9$ nên $a_4+a_5=17$, tức $a_4=8$, $a_5=9$. Bộ $(5;6;7;8;9)$ có tổng $35<40$ và $5+6+7=18>8+9=17$, thỏa mãn.

Trường hợp $a_2=7$: từ $(1)$ có $12+a_3>a_4+a_5\ge2a_3+3$, suy ra $a_3<9$. Mà $a_3\ge8$ nên $a_3=8$. Khi đó $a_4+a_5<20$ và $a_4\ge9$, $a_5\ge10$ nên $a_4+a_5=19$, tức $a_4=9$, $a_5=10$. Bộ $(5;7;8;9;10)$ có tổng $39<40$ và $5+7+8=20>9+10=19$, thỏa mãn.

Vậy có hai bộ số thỏa mãn là $(5;6;7;8;9)$ và $(5;7;8;9;10)$.
