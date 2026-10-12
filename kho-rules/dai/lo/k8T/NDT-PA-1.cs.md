=== PA.1@p232
- bai: 1 · y: - · trang: 232 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: phân tích nhân tử · nhóm hạng tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c$ khác nhau thỏa mãn: $a^2(b+c)=b^2(c+a)$. Chứng minh rằng: $b^2(c+a)=c^2(a+b)$.
## SACH
Ta có: $a^2(b+c)=b^2(c+a)$
$\Rightarrow a^2b+a^2c-b^2c-ab^2=0$
$\Rightarrow(a-b)(ab+bc+ca)=0$
$\Rightarrow ab+bc+ca=0$ (vì $a\ne b$)
Do đó $(b-c)(ab+bc+ca)=0$
$\Rightarrow b^2(c+a)=c^2(a+b)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển điều kiện về một vế rồi phân tích thành nhân tử sẽ ra tích $(a-b)(ab+bc+ca)=0$; vì $a\ne b$ nên nhân tử $ab+bc+ca$ bằng $0$, và đúng nhân tử này lại xuất hiện khi phân tích hiệu hai vế của điều cần chứng minh.

**Bước 1.** Chuyển mọi hạng tử của điều kiện sang một vế, nhóm theo cặp có nhân tử chung để phân tích thành tích.

**Bước 2.** Dùng giả thiết $a\ne b$ để bỏ nhân tử $a-b$ và rút ra hệ thức giữa $ab$, $bc$, $ca$.

**Bước 3.** Xét hiệu $b^2(c+a)-c^2(a+b)$, phân tích thành nhân tử theo cùng cách rồi thay hệ thức vừa có để kết luận.

**Chú ý:** Điều kiện "ba số khác nhau" chính là thứ cho phép bỏ nhân tử $a-b$; thiếu nó thì không rút được hệ thức $ab+bc+ca=0$.

**Phần 2. Trình bày**

$a^2(b+c)=b^2(c+a)$

$\Leftrightarrow a^2b+a^2c-b^2c-ab^2=0$

$\Leftrightarrow ab(a-b)+c(a-b)(a+b)=0$

$\Leftrightarrow(a-b)(ab+bc+ca)=0$.

Vì $a\ne b$ nên $ab+bc+ca=0$. (*)

Mặt khác $b^2(c+a)-c^2(a+b)=bc(b-c)+a(b-c)(b+c)$

$=(b-c)(ab+bc+ca)$

$=0$ (theo (*)).

Vậy $b^2(c+a)=c^2(a+b)$.

=== PA.2a@p232
- bai: 2 · y: a · trang: 232 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử · hiệu hai bình phương
- kiem: bang | (x^2-3x+2)^2-4x+2
- ket_qua_sach: (x^2-4x+2)(x^2-2x+3)
- dap_an: $(x^2-4x+2)(x^2-2x+3)$
- ghi_chu_nghi:
## DE
Phân tích đa thức sau thành nhân tử: $(x^2-3x+2)^2-4x+2$.
## SACH
$(x^2-3x+2)^2-4x+2=(x^2-3x+2)^2-x^2+x^2-4x+2$
$=(x^2-3x+2+x)(x^2-3x+2-x)+(x^2-4x+2)$
$=(x^2-4x+2)(x^2-2x+2+1)$
$=(x^2-4x+2)(x^2-2x+3)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức có dạng "bình phương của một tam thức cộng với một nhị thức"; thêm bớt $x^2$ để tách ra một hiệu hai bình phương, đồng thời phần còn lại $x^2-4x+2$ sẽ trùng với một nhân tử của hiệu đó.

**Bước 1.** Thêm và bớt $x^2$ sao cho $(x^2-3x+2)^2$ ghép với $-x^2$ thành hiệu hai bình phương, còn $x^2$ ghép với $-4x+2$ thành một tam thức.

**Bước 2.** Phân tích hiệu hai bình phương thành tích hai nhân tử rồi thu gọn từng nhân tử.

**Bước 3.** Nhận ra một nhân tử vừa có trùng với tam thức còn lại, đặt nó làm nhân tử chung và thu gọn nhân tử kia.

**Chú ý:** Có thể thử lại kết quả bằng cách thay $x=0$ vào hai vế; thêm bớt đúng số hạng thì tam thức còn lại luôn trùng một nhân tử.

**Phần 2. Trình bày**

$(x^2-3x+2)^2-4x+2$

$=(x^2-3x+2)^2-x^2+(x^2-4x+2)$

$=(x^2-3x+2+x)(x^2-3x+2-x)+(x^2-4x+2)$

$=(x^2-2x+2)(x^2-4x+2)+(x^2-4x+2)$

$=(x^2-4x+2)(x^2-2x+3)$

=== PA.2b@p232
- bai: 2 · y: b · trang: 232 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử · hiệu hai bình phương · nhóm hạng tử
- kiem: bang | (x^2-5x+8)^2-6x+8
- ket_qua_sach: (x-2)(x-4)(x^2-4x+9)
- dap_an: $(x-2)(x-4)(x^2-4x+9)$
- ghi_chu_nghi: Dòng 2 của sách in $(x^2-5x+8-x)$, đúng phải là $(x^2-5x+8+x)=(x^2-4x+8)$ (dòng 3 của sách đã dùng $x^2-4x+8$); lỗi in, không ảnh hưởng kết quả.
## DE
Phân tích đa thức sau thành nhân tử: $(x^2-5x+8)^2-6x+8$.
## SACH
$(x^2-5x+8)^2-6x+8=(x^2-5x+8)^2-x^2+x^2-6x+8$
$=(x^2-6x+8)(x^2-5x+8-x)+(x^2-6x+8)$
$=(x^2-6x+8)(x^2-4x+8+1)$
$=(x^2-2x-4x+8)(x^2-4x+9)$
$=[x(x-2)-4(x-2)](x^2-4x+9)$
$=(x-2)(x-4)(x^2-4x+9)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cũng như bài trên, thêm bớt $x^2$ để tách hiệu hai bình phương; phần còn lại $x^2-6x+8$ trùng với một nhân tử nên đặt được nhân tử chung, và nhân tử đó còn tách tiếp được.

**Bước 1.** Thêm và bớt $x^2$ để $(x^2-5x+8)^2$ ghép với $-x^2$ thành hiệu hai bình phương, còn $x^2-6x+8$ là phần còn lại.

**Bước 2.** Phân tích hiệu hai bình phương thành tích rồi nhận ra một nhân tử giống hệt phần còn lại, đặt nhân tử chung.

**Bước 3.** Phân tích tiếp tam thức $x^2-6x+8$ bằng cách tách hạng tử bậc nhất để thu được tích hai nhị thức.

**Chú ý:** Phải dừng đúng lúc: $x^2-6x+8$ còn tách được nhưng $x^2-4x+9=(x-2)^2+5>0$ thì không phân tích tiếp được.

**Phần 2. Trình bày**

$(x^2-5x+8)^2-6x+8$

$=(x^2-5x+8)^2-x^2+(x^2-6x+8)$

$=(x^2-5x+8-x)(x^2-5x+8+x)+(x^2-6x+8)$

$=(x^2-6x+8)(x^2-4x+8)+(x^2-6x+8)$

$=(x^2-6x+8)(x^2-4x+9)$

$=(x^2-2x-4x+8)(x^2-4x+9)$

$=[x(x-2)-4(x-2)](x^2-4x+9)$

$=(x-2)(x-4)(x^2-4x+9)$

=== PA.3@p232
- bai: 3 · y: - · trang: 232 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: tính chẵn lẻ
- kiem: khong
- ket_qua_sach:
- dap_an: Không tồn tại số nguyên $x$ thỏa mãn
- ghi_chu_nghi: Dòng đầu lời giải của sách in "$x-3$, $x-3$, $x-1$, $x$"; đúng phải là $x-3$, $x-2$, $x-1$, $x$ (bốn số nguyên liên tiếp). Lỗi in, không ảnh hưởng kết quả.
## DE
Tồn tại hay không số nguyên $x$ thỏa mãn: $(x-3)^3+(x-2)^2+\lvert x-1\rvert+x=2013$.
## SACH
$x-3$, $x-3$, $x-1$, $x$ là bốn số nguyên liên tiếp nên trong bốn số này có hai số lẻ và hai số chẵn.
Do đó $(x-3)^3$, $(x-2)^2$, $\lvert x-1\rvert$, $\lvert x\rvert$ có hai số lẻ và hai số chẵn.
Nên tổng của bốn số này là một số chẵn.
Mà $2013$ là số lẻ.
Vậy không tồn tại số nguyên $x$ thỏa mãn: $(x-3)^3+(x-2)^2+\lvert x-1\rvert+x=2013$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng ở vế trái cùng tính chẵn lẻ với một trong bốn số nguyên liên tiếp $x-3$, $x-2$, $x-1$, $x$ (luỹ thừa và giá trị tuyệt đối không đổi tính chẵn lẻ), nên chỉ cần xét tính chẵn lẻ của cả vế trái rồi so với vế phải $2013$ là số lẻ.

**Bước 1.** Nhận ra các biểu thức $x-3$, $x-2$, $x-1$, $x$ nằm trong các số hạng và là bốn số nguyên liên tiếp, nên có đúng hai số chẵn và hai số lẻ.

**Bước 2.** Chỉ ra mỗi số hạng của vế trái cùng tính chẵn lẻ với số nguyên tương ứng, vì lập phương, bình phương và giá trị tuyệt đối không làm đổi tính chẵn lẻ.

**Bước 3.** Cộng bốn số hạng để biết vế trái là số chẵn rồi đối chiếu với vế phải để kết luận về sự tồn tại của $x$.

**Chú ý:** Với số nguyên $t$ bất kì, các số $t$, $t^k$ ($k\ge1$) và $\lvert t\rvert$ luôn cùng tính chẵn lẻ; đây là cách đưa phương trình có hình thức lạ về bài toán chẵn lẻ.

**Phần 2. Trình bày**

Với $x$ nguyên, $x-3$, $x-2$, $x-1$, $x$ là bốn số nguyên liên tiếp nên có hai số lẻ và hai số chẵn.

Lập phương, bình phương và giá trị tuyệt đối không làm đổi tính chẵn lẻ, nên $(x-3)^3$, $(x-2)^2$, $\lvert x-1\rvert$, $x$ cũng có hai số lẻ và hai số chẵn.

Do đó $(x-3)^3+(x-2)^2+\lvert x-1\rvert+x$ là số chẵn.

Mà $2013$ là số lẻ.

Vậy không tồn tại số nguyên $x$ thỏa mãn đẳng thức đã cho.

=== PA.4@p233
- bai: 4 · y: - · trang: 233 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: hằng đẳng thức mở rộng · hệ số bất định
- kiem: khong
- ket_qua_sach: -3
- dap_an: a) Chứng minh; b) $m=-3$
- ghi_chu_nghi: Đề ý b) sách in $x^3+y^3+mxyz$ (thiếu $z^3$); lời giải của sách dùng $x^3+y^3+z^3+mxyz$. Kho ghi đề có $z^3$.
## DE
a) Chứng tỏ rằng đa thức $x^3+y^3+z^3-3xyz$ chia hết cho đa thức $x+y+z$.

b) Xác định số $m$ để đa thức $x^3+y^3+z^3+mxyz$ chia hết cho đa thức $x+y+z$.
## SACH
a) $x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$
b) Gọi thương của phép chia đa thức $x^3+y^3+z^3+mxyz$ cho $x+y+z$ là $Q$
Ta có $x^3+y^3+z^3+mxyz=(x+y+z)\cdot Q$
Cho $x=1$, $y=1$, $z=-2$. Ta có $1+1+1(-8)-2m=0$
$\Leftrightarrow2m=-6\Leftrightarrow m=-3$
Vậy $m=-3$, ta có $x^3+y^3+z^3-3xyz$ chia hết cho $x+y+z$, thương là: $x^2+y^2+z^2-xy-yz-zx$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ý a) là hằng đẳng thức mở rộng $x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$, kiểm bằng khai triển; ý b) dùng thẳng điều kiện chia hết: mọi bộ số làm $x+y+z=0$ phải làm đa thức bị chia bằng $0$, nên chọn một bộ cụ thể để tìm $m$.

**Bước 1.** Ý a): khai triển tích $(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ bằng cách tách thành hai tích nhỏ, rồi đối chiếu với đa thức đã cho.

**Bước 2.** Ý b): viết điều kiện chia hết thành $x^3+y^3+z^3+mxyz=(x+y+z)Q$ để thấy khi $x+y+z=0$ thì vế trái phải bằng $0$.

**Bước 3.** Chọn một bộ giá trị cụ thể của $x,y,z$ có tổng bằng $0$ rồi thay vào để tìm $m$.

**Bước 4.** Thử lại giá trị $m$ vừa tìm bằng hằng đẳng thức ở ý a), vì cách thay số mới chỉ cho điều kiện cần.

**Chú ý:** Thay giá trị cụ thể chỉ cho điều kiện cần của $m$; luôn phải kiểm tra điều kiện đủ bằng một phép phân tích thật.

**Phần 2. Trình bày**

a) $(x+y+z)(x^2+y^2+z^2-xy-yz-zx)=(x+y+z)(x^2+y^2+z^2)-(x+y+z)(xy+yz+zx)$

$=(x^3+y^3+z^3+x^2y+x^2z+y^2x+y^2z+z^2x+z^2y)-(x^2y+x^2z+y^2x+y^2z+z^2x+z^2y+3xyz)$

$=x^3+y^3+z^3-3xyz$.

Vậy $x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ chia hết cho $x+y+z$.

b) Giả sử $x^3+y^3+z^3+mxyz$ chia hết cho $x+y+z$, tức là $x^3+y^3+z^3+mxyz=(x+y+z)Q$ với $Q$ là đa thức.

Thay $x=1$, $y=1$, $z=-2$ (khi đó $x+y+z=0$) ta được $1^3+1^3+(-2)^3+m\cdot1\cdot1\cdot(-2)=0$

$\Leftrightarrow-6-2m=0$

$\Leftrightarrow m=-3$.

Thử lại: với $m=-3$, theo ý a) $x^3+y^3+z^3-3xyz=(x+y+z)(x^2+y^2+z^2-xy-yz-zx)$ chia hết cho $x+y+z$.

Vậy $m=-3$ (thương là $x^2+y^2+z^2-xy-yz-zx$).

=== PA.5@p233
- bai: 5 · y: - · trang: 233 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: không mất tính tổng quát · so sánh với số nhỏ nhất · tổng các bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Gọi $m$ là số nhỏ nhất trong ba số $(x-y)^2$, $(y-z)^2$, $(z-x)^2$. Chứng minh rằng: $m\le\dfrac{x^2+y^2+z^2}{2}$.
## SACH
Vai trò $x,y,z$ như nhau. Không mất tính tổng quát ta giả sử $x\ge y\ge z$.
$m$ là số nhỏ nhất trong ba số $(x-y)^2$; $(y-z)^2$, $(z-x)^2\Rightarrow\sqrt m$ là số nhỏ nhất trong ba số.
$\lvert x-y\rvert$, $\lvert y-z\rvert$, $\lvert z-x\rvert$
Ta có $\lvert z-x\rvert=x-z=(x-z)+(y-z)$
$=\lvert x-y\rvert+\lvert y-z\rvert\ge2\sqrt m$
Nên $(x-z)^2\ge4m$
Mà $(y-z)^2\ge m$, $(x-y)^2\ge m$
$3(x^2+y^2+z^2)\ge(x-y)^2+(y-z)^2+(z-x)^2\ge6m$
Mà $(x-y)^2+(y-z)^2+(z-x)^2$
$\le(x-y)^2+(y-z)^2+(z-x)^2+(x+y+z)^2=3(x^2+y^2+z^2)$
Vậy $m\le\dfrac{x^2+y^2+z^2}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi trong ba bình phương đều không nhỏ hơn $m$; sau khi sắp thứ tự $x\ge y\ge z$, hiệu $x-z$ là tổng của hai hiệu kia nên $(x-z)^2\ge4m$, do đó tổng ba bình phương không nhỏ hơn $6m$, rồi chặn tổng đó từ trên bằng $3(x^2+y^2+z^2)$.

**Bước 1.** Vì ba số và vế phải đều đối xứng theo $x,y,z$, giả sử $x\ge y\ge z$ để mọi hiệu có dấu xác định.

**Bước 2.** Từ $m$ là số nhỏ nhất suy ra $x-y\ge\sqrt m$ và $y-z\ge\sqrt m$, cộng hai bất đẳng thức để chặn $x-z$ từ dưới.

**Bước 3.** Cộng ba bình phương với nhau, dùng $(x-z)^2\ge4m$ và hai bình phương kia mỗi cái $\ge m$ để chặn tổng từ dưới bằng $6m$.

**Bước 4.** Chặn tổng ba bình phương từ trên bằng cách cộng thêm $(x+y+z)^2\ge0$ rồi khai triển, sau đó ghép hai chiều để chia cho $6$.

**Chú ý:** Dấu "=" xảy ra khi $x-y=y-z$ và $x+y+z=0$, chẳng hạn $(x;y;z)=(1;0;-1)$ (khi đó $m=1$).

**Phần 2. Trình bày**

Vì vai trò của $x,y,z$ như nhau nên không mất tính tổng quát, giả sử $x\ge y\ge z$.

Do $m$ là số nhỏ nhất trong ba số $(x-y)^2$, $(y-z)^2$, $(z-x)^2$ nên $x-y=\lvert x-y\rvert\ge\sqrt m$ và $y-z=\lvert y-z\rvert\ge\sqrt m$.

Suy ra $x-z=(x-y)+(y-z)\ge2\sqrt m$, nên $(x-z)^2\ge4m$.

Do đó $(x-y)^2+(y-z)^2+(z-x)^2\ge m+m+4m=6m$. (1)

Mặt khác $(x-y)^2+(y-z)^2+(z-x)^2\le(x-y)^2+(y-z)^2+(z-x)^2+(x+y+z)^2=3(x^2+y^2+z^2)$. (2)

(vì $(x-y)^2+(y-z)^2+(z-x)^2=2(x^2+y^2+z^2)-2(xy+yz+zx)$ và $(x+y+z)^2=x^2+y^2+z^2+2(xy+yz+zx)$).

Từ (1) và (2) ta có $6m\le3(x^2+y^2+z^2)$.

Vậy $m\le\dfrac{x^2+y^2+z^2}{2}$. Dấu "=" xảy ra, chẳng hạn, khi $(x;y;z)=(1;0;-1)$.

=== PA.6@p234
- bai: 6 · y: - · trang: 234 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: xét số dư khi chia cho 9 · đồng dư
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng tỏ rằng không tồn tại các số nguyên $a,b,c$ để có $a^3+b^3+c^3=2012$.
## SACH
$a^3$ chia cho $9$ dư $0$ hoặc $1$ hoặc $8$
Thật vậy, đặt $a=3k+r$ ($k\in\mathbb{Z}$, $r\in\{0;1;2\}$)
$a^3=(3k+r)^3=27k^3+27k^2r+9kr^2+r^3$
$r\in\{0;1;2\}$ nên $r^3\in\{0;1;8\}$
Vậy $a^3$ chia cho $9$ dư $0$ hoặc $1$ hoặc $8$
Tương tự $b^3$; $c^3$ chia cho $9$ dư $0$ hoặc $1$ hoặc $8$
Do vậy $a^3+b^3+c^3$ chia cho $9$ có số dư là: $0;1;2;3;6;7;8$
Số $2012$ chia cho $9$ dư $5$.
Vậy không tồn tại các số nguyên $a,b,c$ để có $a^3+b^3+c^3=2012$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Lập phương của một số nguyên chia cho $9$ chỉ có thể dư $0$, $1$ hoặc $8$ (tức $0$ hoặc $\pm1$ theo đồng dư), nên tổng ba lập phương chỉ nhận số ít số dư khi chia cho $9$, và số dư của $2012$ không nằm trong số ấy.

**Bước 1.** Viết số nguyên $a$ dưới dạng $3k+r$ với $r\in\{0;1;2\}$ rồi khai triển $a^3$ để tìm các số dư có thể của một lập phương khi chia cho $9$.

**Bước 2.** Lập các tổng ba số dư (mỗi số lấy trong tập vừa tìm) để biết $a^3+b^3+c^3$ chia cho $9$ có thể dư những số nào.

**Bước 3.** Tính số dư của $2012$ khi chia cho $9$ rồi đối chiếu với tập các số dư có thể để suy ra mâu thuẫn.

**Chú ý:** Chia cho $9$ là phép thử chuẩn cho tổng ba lập phương; chỉ cần nhớ lập phương luôn đồng dư $0$ hoặc $\pm1$ theo modulo $9$.

**Phần 2. Trình bày**

Đặt $a=3k+r$ ($k\in\mathbb{Z}$, $r\in\{0;1;2\}$). Khi đó $a^3=27k^3+27k^2r+9kr^2+r^3\equiv r^3\pmod{9}$.

Vì $r^3\in\{0;1;8\}$ nên $a^3\equiv0$, $1$ hoặc $-1\pmod{9}$. Tương tự với $b^3$ và $c^3$.

Do đó $a^3+b^3+c^3\equiv s\pmod{9}$, với $s$ là tổng của ba số thuộc $\{-1;0;1\}$, nên $-3\le s\le3$.

Suy ra $a^3+b^3+c^3$ chia cho $9$ chỉ có thể dư $0;1;2;3;6;7;8$.

Mặt khác $2012=9\cdot223+5$ nên $2012$ chia cho $9$ dư $5$.

Vậy không tồn tại các số nguyên $a,b,c$ để $a^3+b^3+c^3=2012$.

=== PA.7@p234
- bai: 7 · y: - · trang: 234 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040103
- cong_cu: chia hết bắc cầu · ba số nguyên liên tiếp · đồng dư
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng (1) của sách in mũ không rõ (đọc được "2014^201"), theo mạch là $2014^{2015}$; không ảnh hưởng kết quả.
## DE
Chứng minh rằng không tồn tại số nguyên $x$ thỏa mãn: $2014^{2015}+1$ chia hết cho $x^3+5x$.
## SACH
Giả sử tồn tại số nguyên $x$ để: $2014^{2015}+1$ chia hết cho $x^3+5x$
Ta có: $x^3+5x=x^3-x+6x=x(x^2-1)+6x=x(x+1)(x-1)+6x$
Vì $x-1$; $x$; $x+1$ là ba số nguyên liên tiếp nên có một số chia hết cho $3$.
Nên $x(x+1)(x-1)\vdots3$ mà $6x\vdots3$
Do đó $x^3+5x\vdots3$. Suy ra $(2014^{201}+1)\vdots3$ (1)
Mặt khác $2014^{2015}+1=(2013+1)^{2015}+1$ chia cho $3$ dư $2$ (vì $2013\vdots3$)
Nên $(2014^{2015}+1)\not\vdots3$ (2)
(1) và (2) mâu thuẫn. Điều giả sử trên sai.
Vậy không tồn tại số nguyên $x$ thỏa mãn $2014^{2015}+1$ chia hết cho $x^3+5x$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức $x^3+5x$ luôn chia hết cho $3$ (vì $x^3+5x=(x-1)x(x+1)+6x$), nên nếu $2014^{2015}+1$ chia hết cho nó thì cũng chia hết cho $3$; nhưng số đó chia cho $3$ dư $2$.

**Bước 1.** Tách $5x=-x+6x$ để $x^3+5x$ thành tích ba số nguyên liên tiếp cộng với một bội của $6$.

**Bước 2.** Chỉ ra $x^3+5x$ chia hết cho $3$ với mọi số nguyên $x$, vì trong ba số nguyên liên tiếp luôn có một số chia hết cho $3$.

**Bước 3.** Giả sử tồn tại $x$ thỏa đề rồi dùng tính bắc cầu của chia hết để suy ra $2014^{2015}+1$ chia hết cho $3$.

**Bước 4.** Tính số dư của $2014^{2015}+1$ khi chia cho $3$ bằng đồng dư và đối chiếu để có mâu thuẫn.

**Chú ý:** Chia hết có tính bắc cầu: nếu $A\vdots B$ và $B\vdots3$ thì $A\vdots3$; đây là cách tìm "ước chung cố định" để chứng minh không tồn tại.

**Phần 2. Trình bày**

$x^3+5x=x^3-x+6x$

$=(x-1)x(x+1)+6x$.

Vì $x-1$, $x$, $x+1$ là ba số nguyên liên tiếp nên $(x-1)x(x+1)\vdots3$, mà $6x\vdots3$. Do đó $x^3+5x\vdots3$ với mọi số nguyên $x$.

Giả sử tồn tại số nguyên $x$ để $2014^{2015}+1\vdots(x^3+5x)$. Vì $x^3+5x\vdots3$ nên $2014^{2015}+1\vdots3$. (1)

Mặt khác $2014=3\cdot671+1\equiv1\pmod{3}$ nên $2014^{2015}+1\equiv1^{2015}+1=2\pmod{3}$, tức $2014^{2015}+1\not\vdots3$. (2)

(1) và (2) mâu thuẫn, nên giả sử sai.

Vậy không tồn tại số nguyên $x$ để $2014^{2015}+1$ chia hết cho $x^3+5x$.

=== PA.8@p234
- bai: 8 · y: - · trang: 234 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040202
- cong_cu: biến đổi về bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Không tồn tại số tự nhiên $n$ nào
- ghi_chu_nghi: Lời giải của sách có lỗi in dấu "=" thay cho "+" ở các chỗ "$2n=9$", "$n^2+6n=9$"; đúng phải là "$2n+9$", "$n^2+6n+9$". Không ảnh hưởng kết quả.
## DE
Tìm các số tự nhiên $n$ sao cho dãy số $n+9$; $2n+9$; $3n+9$; $4n+9$; $\dots$ không chứa số chính phương nào.
## SACH
Trong dãy số luôn tồn tại một số có dạng:
$(n+6)n+9=n^2+6n=9=(n+3)^2$ là số chính phương.
Vậy không tồn tại số tự nhiên $n$ nào để cho dãy số $n+9$; $2n=9$; $3n+9$; $4n+9$; $\dots$ không chứa số chính phương nào!
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số hạng thứ $k$ của dãy là $kn+9$ với mọi $k$ nguyên dương; vì $9=3^2$, chỉ cần chọn $k$ phụ thuộc $n$ sao cho $kn+9$ là bình phương một tổng, để thấy dãy luôn chứa số chính phương với mọi $n$.

**Bước 1.** Viết số hạng tổng quát $kn+9$ và nhận ra $9=3^2$, nên $kn+9$ là bình phương $(n+3)^2$ khi $kn=n^2+6n$.

**Bước 2.** Tìm $k$ từ điều kiện đó rồi kiểm tra $k$ là số nguyên dương, để chắc số hạng ấy thật sự nằm trong dãy.

**Bước 3.** Kết luận mọi số tự nhiên $n$ đều làm dãy chứa số chính phương, nên không có $n$ nào thỏa đề.

**Chú ý:** Đề hỏi "tìm $n$ để dãy không chứa số chính phương" thường có đáp số "không tồn tại"; hướng làm là chỉ ra một số hạng chính phương cho mọi $n$.

**Phần 2. Trình bày**

Số hạng thứ $k$ của dãy là $kn+9$ ($k=1;2;3;\dots$).

Lấy $k=n+6$ (là số nguyên dương vì $n$ là số tự nhiên), số hạng thứ $n+6$ của dãy là

$(n+6)n+9=n^2+6n+9=(n+3)^2$,

là số chính phương.

Vậy với mọi số tự nhiên $n$, dãy luôn chứa một số chính phương; do đó không tồn tại số tự nhiên $n$ nào để dãy không chứa số chính phương nào.

=== PA.9@p235
- bai: 9 · y: - · trang: 235 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040301
- cong_cu: phân tích nhân tử · xét số dư khi chia cho 3
- kiem: khong
- ket_qua_sach:
- dap_an: Không có bộ ba số nguyên $(a;b;c)$ nào thỏa mãn
- ghi_chu_nghi: Dòng "(a-b)(b-c)(a^2+ab = b^2-b^2-bc-c^2)" của sách in "=" thay cho "+" (đúng: $a^2+ab+b^2-b^2-bc-c^2$). Không ảnh hưởng kết quả.
## DE
Tìm tất cả các bộ ba số nguyên $a,b,c$ thỏa mãn: $a^3(b-c)+b^3(c-a)+c^3(a-b)=2014^{2015}$.
## SACH
$a^3(b-c)+b^3(c-a)+c^3(a-b)=2014^{2015}$
$a^3(b-c)+b^3(c-b+b-a)+c^3(a-b)=2014^{2015}$
$a^3(b-c)+b^3(c-b)+b^3(b-a)+c^3(a-b)=2014^{2015}$
$(b-c)(a^3-b^3)-(a-b)(b^3-c^3)=2014^{2015}$
$(a-b)(b-c)(a^2+ab=b^2-b^2-bc-c^2)=2014^{2015}$
$(a-b)(b-c)[(a^2-c^2)+(ab-bc)]=2014^{2015}$
$(a-b)(b-c)[(a+c)(a-c)+b(a-c)]=2014^{2015}$
$(a-b)(b-c)(a-c)(a+b+c)=2014^{2015}$ $(*)$
- Nếu $a,b,c$ có hai số chia cho $3$ có cùng số dư thì: $a-b\vdots3$ hoặc $b-c\vdots3$ hoặc $c-a\vdots3$
- Nếu $a,b,c$ chia cho $3$ có số dư khác nhau thì $a+b+c\vdots3$ (vì $0+1+2=3$)
Do vậy $(a-b)(b-c)(a-c)(a+b+c)$ chia hết cho $3$, với mọi $a,b,c\in\mathbb{Z}$
Mà $2014\not\vdots3$ nên $2014^{2015}\not\vdots3$
Như vậy $(*)$ không thể xảy ra
Vậy không có $a,b,c$ là các số nguyên để: $a^3(b-c)+b^3(c-a)+c^3(a-b)=2014^{2015}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là biểu thức hoán vị vòng, phân tích được thành tích $(a-b)(b-c)(a-c)(a+b+c)$; tích này luôn chia hết cho $3$ (xét số dư của $a,b,c$ khi chia cho $3$), trong khi $2014^{2015}$ không chia hết cho $3$.

**Bước 1.** Tách $c-a=(c-b)+(b-a)$ rồi nhóm các hạng tử để xuất hiện các hiệu $a^3-b^3$ và $b^3-c^3$.

**Bước 2.** Đặt nhân tử chung $(a-b)(b-c)$ và phân tích phần còn lại bằng hiệu hai bình phương để được tích bốn nhân tử.

**Bước 3.** Xét số dư của $a,b,c$ khi chia cho $3$: hoặc có hai số cùng số dư, hoặc ba số dư đôi một khác nhau, rồi chỉ ra tích luôn chia hết cho $3$.

**Bước 4.** So với vế phải $2014^{2015}$ không chia hết cho $3$ để kết luận phương trình không có nghiệm nguyên.

**Chú ý:** Nên nhớ hằng đẳng thức $a^3(b-c)+b^3(c-a)+c^3(a-b)=(a-b)(b-c)(a-c)(a+b+c)$ khi gặp biểu thức hoán vị vòng bậc bốn.

**Phần 2. Trình bày**

$a^3(b-c)+b^3(c-a)+c^3(a-b)=a^3(b-c)+b^3[(c-b)+(b-a)]+c^3(a-b)$

$=(b-c)(a^3-b^3)-(a-b)(b^3-c^3)$

$=(a-b)(b-c)(a^2+ab+b^2)-(a-b)(b-c)(b^2+bc+c^2)$

$=(a-b)(b-c)(a^2+ab-bc-c^2)$

$=(a-b)(b-c)[(a-c)(a+c)+b(a-c)]$

$=(a-b)(b-c)(a-c)(a+b+c)$.

Phương trình đã cho trở thành $(a-b)(b-c)(a-c)(a+b+c)=2014^{2015}$. (*)

Xét số dư của $a,b,c$ khi chia cho $3$:

- Nếu có hai số cùng số dư thì hiệu của chúng chia hết cho $3$, nên vế trái của (*) chia hết cho $3$.

- Nếu ba số có số dư đôi một khác nhau thì số dư là $0;1;2$, nên $a+b+c\equiv0+1+2=3\equiv0\pmod{3}$, vế trái của (*) cũng chia hết cho $3$.

Vậy vế trái của (*) luôn chia hết cho $3$ với mọi $a,b,c$ nguyên.

Mà $2014\not\vdots3$ nên $2014^{2015}\not\vdots3$. Suy ra (*) không thể xảy ra.

Vậy không có bộ ba số nguyên $a,b,c$ nào thỏa mãn đề bài.

=== PA.10@p235
- bai: 10 · y: - · trang: 235 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: đặt ẩn phụ · Cô-si cho hai số
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh; dấu "=" xảy ra khi $(a;b;c)$ là một hoán vị của $(1;0;0)$ hoặc của $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$
- ghi_chu_nghi: Sách kết luận dấu "=" xảy ra khi và chỉ khi $abc=0$ và $x=\dfrac{1}{4}$, tức chỉ ở các hoán vị của $\left(0;\dfrac{1}{2};\dfrac{1}{2}\right)$; sách bỏ sót trường hợp $x=0$ (ở bước cuối nhân với $x\ge0$ nên dấu "=" cũng đúng khi $x=0$). Kiểm: $a=1$, $b=c=0$ cho cả hai vế bằng $0$, nên dấu "=" cũng xảy ra tại các hoán vị của $(1;0;0)$. Lời giải kho nêu đủ cả hai trường hợp.
## DE
Cho $a,b,c\ge0$ thỏa mãn $a+b+c=1$. Chứng minh rằng: $8(a^2+b^2+c^2)(a^2b^2+b^2c^2+c^2a^2+abc)\le ab+bc+ca$. Dấu "=" xảy ra khi nào?
## SACH
Đặt $x=ab+bc+ca$ ($x\ge0$)
Ta có: $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=1-2x$
Và $a^2b^2+b^2c^2+c^2a^2+abc\le a^2b^2+b^2c^2+c^2a^2+2abc(a+b+c)$
$=(ab+bc+ca)^2=x^2$
Do đó: $8(a^2+b^2+c^2)(a^2b^2+b^2c^2+c^2a^2+abc)$
$\le8(1-2x)x^2=4(1-2x)2x\cdot x$
$\le(1-2x+2x)^2\cdot x=x=ab+bc+ca$
Vậy $8(a^2+b^2+c^2)(a^2b^2+b^2c^2+c^2a^2+abc)\le ab+bc+ca$
Dấu "=" xảy ra $\Leftrightarrow abc=0$ và $1-2x=2x$ $\Leftrightarrow abc=0$ và $x=\dfrac{1}{4}$ $\Leftrightarrow$ ($a=0$, $b=c=\dfrac{1}{2}$) hoặc ($b=0$, $c=a=\dfrac{1}{2}$) hoặc ($c=0$, $a=b=\dfrac{1}{2}$)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a+b+c=1$ mọi thứ biểu diễn được qua $x=ab+bc+ca$: $a^2+b^2+c^2=1-2x$, còn thừa số thứ hai bị chặn bởi $x^2$; khi đó bất đẳng thức chỉ còn một biến và được chứng minh bằng $4pq\le(p+q)^2$.

**Bước 1.** Đặt $x=ab+bc+ca\ge0$ và dùng $a+b+c=1$ để biểu diễn $a^2+b^2+c^2$ theo $x$.

**Bước 2.** Chặn thừa số $a^2b^2+b^2c^2+c^2a^2+abc$ từ trên bằng cách thay $abc$ bởi $2abc(a+b+c)$, lớn hơn vì $abc\ge0$ và $a+b+c=1$, để thu được một bình phương theo $x$.

**Bước 3.** Thay hai kết quả vào vế trái; vì nhân với số không âm nên chiều bất đẳng thức giữ nguyên, ta đưa về bất đẳng thức chỉ chứa $x$.

**Bước 4.** Áp dụng $4pq\le(p+q)^2$ cho hai số $1-2x$ và $2x$ có tổng bằng $1$, rồi nhân với $x\ge0$ để hoàn tất chứng minh.

**Bước 5.** Xét điều kiện dấu "=" ở từng bước chặn để tìm mọi bộ $(a;b;c)$.

**Chú ý:** Khi tìm dấu "=" đừng quên trường hợp $x=0$, vì ở bước cuối ta nhân với $x$ nên dấu "=" cũng đúng khi $x=0$.

**Phần 2. Trình bày**

Đặt $x=ab+bc+ca\ge0$. Khi đó $a^2+b^2+c^2=(a+b+c)^2-2(ab+bc+ca)=1-2x$.

Vì $abc\ge0$ và $a+b+c=1$ nên $abc\le2abc=2abc(a+b+c)$, do đó

$a^2b^2+b^2c^2+c^2a^2+abc\le a^2b^2+b^2c^2+c^2a^2+2abc(a+b+c)=(ab+bc+ca)^2=x^2$. (1)

Nhân hai vế của (1) với $8(a^2+b^2+c^2)=8(1-2x)\ge0$:

$8(a^2+b^2+c^2)(a^2b^2+b^2c^2+c^2a^2+abc)\le8(1-2x)x^2=4(1-2x)\cdot2x\cdot x$. (2)

Với $p=1-2x$ và $q=2x$ ta có $4pq\le(p+q)^2$, tức $4(1-2x)\cdot2x\le(1-2x+2x)^2=1$. Nhân với $x\ge0$:

$4(1-2x)\cdot2x\cdot x\le x$. (3)

Từ (2) và (3): $8(a^2+b^2+c^2)(a^2b^2+b^2c^2+c^2a^2+abc)\le x=ab+bc+ca$.

Dấu "=" xảy ra khi đồng thời dấu "=" ở (1) (sau khi nhân) và ở (3).

Ở (2): dấu "=" xảy ra khi $8(1-2x)[x^2-(a^2b^2+b^2c^2+c^2a^2+abc)]=8(a^2+b^2+c^2)\cdot abc=0$; vì $a+b+c=1$ nên $a^2+b^2+c^2>0$, suy ra $abc=0$.

Ở (3): dấu "=" xảy ra khi $x[1-8x(1-2x)]=x(1-4x)^2=0$, tức $x=0$ hoặc $x=\dfrac{1}{4}$.

Nếu $x=0$ thì $ab=bc=ca=0$, nên trong $a,b,c$ có hai số bằng $0$; kết hợp $a+b+c=1$ được $(a;b;c)$ là hoán vị của $(1;0;0)$.

Nếu $x=\dfrac{1}{4}$ và $abc=0$, chẳng hạn $c=0$: $a+b=1$, $ab=\dfrac{1}{4}$ nên $(a-b)^2=(a+b)^2-4ab=0$, suy ra $a=b=\dfrac{1}{2}$; vậy $(a;b;c)$ là hoán vị của $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$.

Vậy dấu "=" xảy ra khi $(a;b;c)$ là một hoán vị của $(1;0;0)$ hoặc của $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$.

=== PA.11@p236
- bai: 11 · y: - · trang: 236 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: nguyên lí Đi-rích-lê · không mất tính tổng quát
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh; dấu "=" xảy ra khi $a=b=c=1$
- ghi_chu_nghi:
## DE
Cho $a,b,c\ge0$. Chứng minh rằng: $a^2+b^2+c^2+2abc+1\ge2(ab+bc+ca)$.
## SACH
Trong ba số $a,b,c$ luôn tồn tại hai số đồng thời không nhỏ hơn $1$ hoặc đồng thời không lớn hơn $1$. Vai trò $a,b,c$ như nhau, không mất tính tổng quát, giả sử hai số đó là $a,b$.
Ta có: $(a-1)(b-1)\ge0$. Do đó $c(a-1)(b-1)\ge0$
$\Rightarrow abc-bc-ca+c\ge0\Rightarrow abc\ge bc+ca-c$
Do vậy: $a^2+b^2+c^2+2abc+1\ge a^2+b^2+c^2+2abc+2ca-2c+1$
$=(a^2-2ab+b^2)+(c^2-2c+1)+(2ab+2bc+2ca)$
$=(a-b)^2+(c-1)^2+2(ab+bc+ca)\ge2(ab+bc+ca)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trong ba số không âm $a,b,c$ luôn có hai số cùng nằm một phía của số $1$ (nguyên lí Đi-rích-lê); khi đó tích hai hiệu với $1$ không âm, cho phép chặn $abc$ từ dưới bằng $bc+ca-c$ và đưa vế trái về các bình phương.

**Bước 1.** Dùng nguyên lí Đi-rích-lê để chọn hai trong ba số cùng $\ge1$ hoặc cùng $<1$; vì đề đối xứng nên giả sử đó là $a$ và $b$.

**Bước 2.** Từ tích hai hiệu với $1$ không âm, nhân thêm với $c\ge0$ để chặn $abc$ từ dưới bằng một biểu thức bậc hai.

**Bước 3.** Thay vào vế trái rồi gom các hạng tử thành tổng của các bình phương cộng với $2(ab+bc+ca)$.

**Bước 4.** Kết luận vì các bình phương không âm, rồi xét dấu "=" ở từng chỗ chặn.

**Chú ý:** Chính hằng số $1$ trong đề gợi việc so sánh từng số với $1$; hai số cùng phía của $1$ thì $(a-1)(b-1)\ge0$.

**Phần 2. Trình bày**

Mỗi số trong $a,b,c$ hoặc $\ge1$ hoặc $<1$; vì có ba số mà chỉ hai loại nên có hai số cùng loại, tức cùng $\ge1$ hoặc cùng $<1$. Vì vai trò của $a,b,c$ như nhau nên không mất tính tổng quát, giả sử đó là $a$ và $b$.

Khi đó $(a-1)(b-1)\ge0$, nhân với $c\ge0$:

$c(a-1)(b-1)\ge0$

$\Rightarrow abc-bc-ca+c\ge0$

$\Rightarrow abc\ge bc+ca-c$.

Do đó $a^2+b^2+c^2+2abc+1\ge a^2+b^2+c^2+2bc+2ca-2c+1$

$=(a^2-2ab+b^2)+(c^2-2c+1)+2(ab+bc+ca)$

$=(a-b)^2+(c-1)^2+2(ab+bc+ca)$

$\ge2(ab+bc+ca)$.

Vậy $a^2+b^2+c^2+2abc+1\ge2(ab+bc+ca)$. Dấu "=" xảy ra khi $a=b$, $c=1$ và $abc=bc+ca-c$, tức $c(a-1)(b-1)=0$ với $c=1$ nên $a=b=1$; vậy $a=b=c=1$.
