=== T2B.1@p35
- bai: 1 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: hiệu hai bình phương · hoán vị vòng · tổng các bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010302 (từ điều kiện suy ra hệ thức giữa các chữ), chọn 010102 vì lời giải đưa về tổng các bình phương bằng $0$.
## DE
Chứng minh rằng từ đẳng thức $(y-z)^2+(z-x)^2+(x-y)^2=(y+z-2x)^2+(z+x-2y)^2+(x+y-2z)^2$ $(1)$ ta suy ra $x=y=z$.
## SACH
$(1)\Leftrightarrow[(y+z-2x)^2-(y-z)^2]+[(z+x-2y)^2-(z-x)^2]+[(x+y-2z)^2-(x-y)^2]=0$ $(2)$.

Hạng tử thứ nhất: $(y+z-2x)^2-(y-z)^2=4(y-x)(z-x)$.

Ta nhận thấy nếu hoán vị vòng $y\to z\to x\to y$ thì từ hạng tử thứ nhất ta có hạng tử thứ hai, và từ hạng tử thứ hai, ta có hạng tử thứ ba.

Do đó: $(z+x-2y)^2-(z-x)^2=4(z-y)(x-y)$

$(x+y-2z)^2-(x-y)^2=4(x-z)(y-z)$. Bởi vậy:

$(2)\Leftrightarrow4(y-x)(z-x)+4(z-y)(x-y)+4(x-z)(y-z)=0$

$\Leftrightarrow2x^2+2y^2+2z^2-2xy-2yz-2xz=0$

$\Leftrightarrow(x-y)^2+(x-z)^2+(y-z)^2=0\Rightarrow x-y=x-z=y-z=0\Rightarrow x=y=z$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển vế rồi ghép từng cặp thành hiệu hai bình phương thì mỗi cặp phân tích được thành tích; ba cặp hoán vị vòng với nhau nên khi cộng lại ra một tổng các bình phương bằng $0$.

**Bước 1.** Chuyển vế và ghép mỗi bình phương ở vế phải với bình phương cùng biến ở vế trái thành từng hiệu hai bình phương.

**Bước 2.** Phân tích hiệu hai bình phương thứ nhất thành tích, rồi suy ra hai hiệu còn lại bằng cách hoán vị vòng $x\to y\to z\to x$.

**Bước 3.** Cộng ba tích lại, khai triển và rút gọn để đưa đẳng thức về dạng tổng ba bình phương của các hiệu $x-y$, $y-z$, $z-x$.

**Bước 4.** Dùng tính chất một tổng các bình phương bằng $0$ thì từng số hạng đều bằng $0$ để kết luận.

**Chú ý:** Chỉ kết luận $x=y=z$ được khi đã đưa về tổng các bình phương; không được tự suy từ một tích bằng $0$.

**Phần 2. Trình bày**

Chuyển vế, ta có $(1)\Leftrightarrow[(y+z-2x)^2-(y-z)^2]+[(z+x-2y)^2-(z-x)^2]+[(x+y-2z)^2-(x-y)^2]=0$.

$(y+z-2x)^2-(y-z)^2=(2z-2x)(2y-2x)=4(z-x)(y-x)$

$(z+x-2y)^2-(z-x)^2=(2x-2y)(2z-2y)=4(x-y)(z-y)$

$(x+y-2z)^2-(x-y)^2=(2y-2z)(2x-2z)=4(y-z)(x-z)$

Do đó đẳng thức $(1)$ tương đương $4[(y-x)(z-x)+(z-y)(x-y)+(x-z)(y-z)]=0$

$\Leftrightarrow4(x^2+y^2+z^2-xy-yz-zx)=0$

$\Leftrightarrow(x-y)^2+(y-z)^2+(z-x)^2=0$

Vì mỗi bình phương không âm nên $x-y=y-z=z-x=0$.

Vậy $x=y=z$.

=== T2B.2@p35
- bai: 2 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010101
- cong_cu: hiệu hai bình phương · hoán vị vòng
- kiem: bang | (a+b+c-2b)(a+b+c-2c)+(a+b+c-2c)(a+b+c-2a)+(a+b+c-2a)(a+b+c-2b)
- ket_qua_sach: -a^2-b^2-c^2+2ab+2bc+2ca
- dap_an: $-a^2-b^2-c^2+2ab+2bc+2ca$
- ghi_chu_nghi:
## DE
Tính tổng: $(S-2b)(S-2c)+(S-2c)(S-2a)+(S-2a)(S-2b)$ trong đó $S=a+b+c$.
## SACH
$(S-2b)(S-2c)=(a-b+c)(a+b-c)=a^2-(b-c)^2=a^2-b^2-c^2+2bc$ $(1)$.

Hoán vị vòng $b\to c\to a\to b$, ta được:

$(S-2c)(S-2a)=b^2-c^2-a^2+2ca$ $(2)$

$(S-2a)(S-2b)=c^2-a^2-b^2+2ab$ $(3)$.

Từ $(1)$, $(2)$, $(3)$ ta suy ra kết quả: $-a^2-b^2-c^2+2ab+2bc+2ca$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thay $S=a+b+c$ thì mỗi nhân tử $S-2b$ chỉ còn ba hạng tử, và mỗi tích có dạng $(A+B)(A-B)$ nên tính nhanh bằng hằng đẳng thức hiệu hai bình phương; hai tích kia suy ra bằng hoán vị vòng.

**Bước 1.** Thay $S=a+b+c$ để viết $S-2b$ và $S-2c$ thành các tổng đại số của $a$, $b$, $c$.

**Bước 2.** Nhận ra tích thứ nhất có dạng $(A+B)(A-B)$ với $A=a$ rồi khai triển bằng hằng đẳng thức hiệu hai bình phương.

**Bước 3.** Hoán vị vòng $b\to c\to a\to b$ để viết ngay hai tích còn lại, không phải tính lại từ đầu.

**Bước 4.** Cộng ba kết quả và gộp các hạng tử đồng dạng.

**Phần 2. Trình bày**

$S-2b=a-b+c$ và $S-2c=a+b-c$ nên

$(S-2b)(S-2c)=(a-b+c)(a+b-c)=a^2-(b-c)^2=a^2-b^2-c^2+2bc$

Hoán vị vòng $b\to c\to a\to b$:

$(S-2c)(S-2a)=b^2-c^2-a^2+2ca$

$(S-2a)(S-2b)=c^2-a^2-b^2+2ab$

Cộng ba đẳng thức:

$(S-2b)(S-2c)+(S-2c)(S-2a)+(S-2a)(S-2b)=-a^2-b^2-c^2+2ab+2bc+2ca$.

=== T2B.3@p35
- bai: 3 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010201
- cong_cu:
- kiem: bang | (xy+1)^2-(x+y)^2
- ket_qua_sach: (x+1)(y+1)(x-1)(y-1)
- dap_an: $(x+1)(y+1)(x-1)(y-1)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $(xy+1)^2-(x+y)^2$.
## SACH
$(xy+1)^2-(x+y)^2=(xy+1+x+y)(xy+1-x-y)=(x+1)(y+1)(x-1)(y-1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức là hiệu của hai bình phương $(xy+1)^2$ và $(x+y)^2$ nên dùng hằng đẳng thức hiệu hai bình phương, sau đó nhóm hạng tử trong từng nhân tử.

**Bước 1.** Nhận ra hiệu hai bình phương $A^2-B^2$ với $A=xy+1$ và $B=x+y$ rồi viết thành tích $(A-B)(A+B)$.

**Bước 2.** Nhóm các hạng tử của nhân tử thứ nhất theo $x$ và theo $y$ để đặt được nhân tử chung.

**Bước 3.** Làm tương tự với nhân tử thứ hai để đa thức thành tích của bốn nhị thức.

**Phần 2. Trình bày**

$(xy+1)^2-(x+y)^2$

$=(xy+1+x+y)(xy+1-x-y)$

$=[x(y+1)+(y+1)][x(y-1)-(y-1)]$

$=(x+1)(y+1)(x-1)(y-1)$

=== T2B.4@p35
- bai: 4 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010201
- cong_cu:
- kiem: bang | (a+b+c)^2+(a+b-c)^2-4c^2
- ket_qua_sach: 2(a+b+c)(a+b-c)
- dap_an: $2(a+b+c)(a+b-c)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $(a+b+c)^2+(a+b-c)^2-4c^2$.
## SACH
Cách 1: $(a+b+c)^2+(a+b-c)^2-4c^2$

$=(a+b)^2+2c(a+b)+c^2+(a+b)^2-2c(a+b)+c^2-4c^2$

$=2(a+b)^2-2c^2=2(a+b+c)(a+b-c)$

Cách 2: $(a+b+c)^2+(a+b-c)^2-4c^2$

$=(a+b+c)^2+(a+b-c+2c)(a+b-c-2c)$

$=(a+b+c)^2+(a+b+c)(a+b-3c)$

$=(a+b+c)(a+b+c+a+b-3c)=2(a+b+c)(a+b-c)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai bình phương $(a+b\pm c)^2$ khai triển theo $a+b$ và $c$ thì các hạng tử $\pm2c(a+b)$ triệt tiêu nhau, phần còn lại là hiệu hai bình phương.

**Bước 1.** Khai triển hai bình phương đầu theo hai đại lượng $a+b$ và $c$ bằng hằng đẳng thức bình phương của tổng và của hiệu.

**Bước 2.** Gộp các hạng tử đồng dạng, trong đó hai hạng tử chứa $c(a+b)$ đối nhau nên bị triệt tiêu.

**Bước 3.** Đặt nhân tử chung $2$ rồi dùng hằng đẳng thức hiệu hai bình phương cho biểu thức trong ngoặc.

**Chú ý:** Có thể tách $4c^2=2c^2+2c^2$ hoặc coi $4c^2=(2c)^2$ rồi phân tích hiệu hai bình phương cho $(a+b-c)^2-(2c)^2$, kết quả như nhau.

**Phần 2. Trình bày**

$(a+b+c)^2+(a+b-c)^2-4c^2$

$=(a+b)^2+2c(a+b)+c^2+(a+b)^2-2c(a+b)+c^2-4c^2$

$=2(a+b)^2-2c^2$

$=2[(a+b)^2-c^2]$

$=2(a+b+c)(a+b-c)$

=== T2B.5@p35
- bai: 5 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010204
- cong_cu: hoán vị vòng · nhóm hạng tử
- kiem: bang | a(b^2-c^2)-b(a^2-c^2)+c(a^2-b^2)
- ket_qua_sach: (b-c)(a-b)(c-a)
- dap_an: $(b-c)(a-b)(c-a)$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010201 (chỉ dùng nhóm hạng tử), chọn 010204 vì đa thức nhiều biến hoán vị vòng.
## DE
Phân tích đa thức thành nhân tử: $a(b^2-c^2)-b(a^2-c^2)+c(a^2-b^2)$.
## SACH
Cách 1: Khai triển hai số hạng cuối:

$a(b^2-c^2)-b(a^2-c^2)+c(a^2-b^2)$

$=a(b^2-c^2)-a^2b+bc^2+a^2c-b^2c=a(b^2-c^2)-a^2(b-c)-bc(b-c)$

$=(b-c)(ab+ac-a^2-bc)=(b-c)[c(a-b)-a(a-b)]$

$=(b-c)(a-b)(c-a)$

Cách 2: Nhận xét $(a^2-c^2)$ có thể tách thành $(b^2-c^2)+(a^2-b^2)$ nên:

$a(b^2-c^2)-b(a^2-c^2)+c(a^2-b^2)$

$=a(b^2-c^2)-b[(b^2-c^2)+(a^2-b^2)]+c(a^2-b^2)$

$=(b^2-c^2)(a-b)-(a^2-b^2)(b-c)=(b-c)(a-b)[(b+c)-(a+b)]$

$=(b-c)(a-b)(c-a)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hoán vị vòng $a\to b\to c\to a$ bị triệt tiêu khi hai biến bằng nhau, nên có các nhân tử dạng $(b-c)$; tách $a^2-c^2$ theo hai hiệu còn lại để mọi hạng tử cùng chứa $(b-c)$ hoặc $(a-b)$.

**Bước 1.** Viết $a^2-c^2=(b^2-c^2)+(a^2-b^2)$ để chỉ còn hai hiệu bình phương $b^2-c^2$ và $a^2-b^2$ trong biểu thức.

**Bước 2.** Nhóm các hạng tử chứa $b^2-c^2$ và các hạng tử chứa $a^2-b^2$ rồi đặt nhân tử chung ở mỗi nhóm.

**Bước 3.** Phân tích $b^2-c^2$ và $a^2-b^2$ bằng hằng đẳng thức để lộ nhân tử chung $(b-c)(a-b)$.

**Bước 4.** Đặt nhân tử chung $(b-c)(a-b)$ ra ngoài và rút gọn biểu thức trong ngoặc vuông.

**Phần 2. Trình bày**

$a(b^2-c^2)-b(a^2-c^2)+c(a^2-b^2)$

$=a(b^2-c^2)-b[(b^2-c^2)+(a^2-b^2)]+c(a^2-b^2)$

$=(a-b)(b^2-c^2)-(b-c)(a^2-b^2)$

$=(a-b)(b-c)(b+c)-(b-c)(a-b)(a+b)$

$=(a-b)(b-c)[(b+c)-(a+b)]$

$=(a-b)(b-c)(c-a)$

=== T2B.6@p35
- bai: 6 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010204
- cong_cu: hoán vị vòng · nhóm hạng tử
- kiem: bang | ab(a-b)+bc(b-c)+ac(c-a)
- ket_qua_sach: (a-b)(a-c)(b-c)
- dap_an: $(a-b)(a-c)(b-c)$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010201, chọn 010204 vì đa thức nhiều biến hoán vị vòng.
## DE
Phân tích đa thức thành nhân tử: $ab(a-b)+bc(b-c)+ac(c-a)$.
## SACH
Viết $(b-c)$ dưới dạng $-[(a-b)+(c-a)]$.

Đáp số: $ab(a-b)+bc(b-c)+ac(c-a)=(a-b)(a-c)(b-c)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hiệu $b-c$ bằng $-[(a-b)+(c-a)]$, nên thay vào thì mọi hạng tử chỉ còn chứa $(a-b)$ hoặc $(c-a)$ và nhóm đặt nhân tử chung được.

**Bước 1.** Viết $b-c$ thành tổng của hai hiệu còn lại để các hạng tử cùng chứa $a-b$ hoặc $c-a$.

**Bước 2.** Nhóm các hạng tử chứa $a-b$ với nhau và chứa $c-a$ với nhau rồi đặt nhân tử chung của từng nhóm.

**Bước 3.** Đặt tiếp nhân tử chung $(a-b)$ ra ngoài, rồi đặt $(a-c)$ trong ngoặc vuông để được tích ba nhị thức.

**Phần 2. Trình bày**

$ab(a-b)+bc(b-c)+ac(c-a)$

$=ab(a-b)-bc[(a-b)+(c-a)]+ac(c-a)$

$=b(a-b)(a-c)+c(c-a)(a-b)$

$=(a-b)[b(a-c)-c(a-c)]$

$=(a-b)(a-c)(b-c)$

=== T2B.7@p35
- bai: 7 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010204
- cong_cu: nhóm hạng tử
- kiem: bang | ab(a+b)+bc(b+c)+ac(a+c)+2abc
- ket_qua_sach: (a+b)(b+c)(c+a)
- dap_an: $(a+b)(b+c)(c+a)$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010201 (chỉ nhóm hạng tử), chọn 010204 vì đa thức nhiều biến đối xứng.
## DE
Phân tích đa thức thành nhân tử: $ab(a+b)+bc(b+c)+ac(a+c)+2abc$.
## SACH
$ab(a+b)+bc(b+c)+ac(a+c)+2abc$

$=ab(a+b)+b^2c+bc^2+a^2c+ac^2+2abc$

$=ab(a+b)+c^2(a+b)+c(a^2+b^2+2ab)$

$=(a+b)(ab+c^2+ca+cb)=(a+b)(b+c)(c+a)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Sau khi khai triển, các hạng tử chia được thành nhóm chứa $ab$, nhóm chứa $c^2$ và nhóm chứa $c$ với $a^2+b^2+2ab=(a+b)^2$, nên cả ba nhóm đều có nhân tử $a+b$.

**Bước 1.** Khai triển các tích $bc(b+c)$ và $ac(a+c)$ để thấy rõ từng hạng tử theo lũy thừa của $c$.

**Bước 2.** Nhóm các hạng tử theo lũy thừa của $c$ và nhận ra tổng $a^2+b^2+2ab$ là bình phương của một tổng.

**Bước 3.** Đặt nhân tử chung $a+b$ ra ngoài rồi nhóm các hạng tử trong ngoặc để phân tích tiếp.

**Phần 2. Trình bày**

$ab(a+b)+bc(b+c)+ac(a+c)+2abc$

$=ab(a+b)+b^2c+bc^2+a^2c+ac^2+2abc$

$=ab(a+b)+c^2(a+b)+c(a^2+b^2+2ab)$

$=ab(a+b)+c^2(a+b)+c(a+b)^2$

$=(a+b)(ab+c^2+ca+cb)$

$=(a+b)[a(b+c)+c(b+c)]$

$=(a+b)(b+c)(c+a)$

=== T2B.8@p35
- bai: 8 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010204
- cong_cu: hoán vị vòng · hiệu hai lập phương
- kiem: bang | a(b^3-c^3)+b(c^3-a^3)+c(a^3-b^3)
- ket_qua_sach: (a-b)(b-c)(c-a)(a+b+c)
- dap_an: $(a-b)(b-c)(c-a)(a+b+c)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $a(b^3-c^3)+b(c^3-a^3)+c(a^3-b^3)$.
## SACH
Chú ý: $c^3-a^3=-[(b^3-c^3)+(a^3-b^3)]$.

Đáp số:

$a(b^3-c^3)+b(c^3-a^3)+c(a^3-b^3)=(a-b)(b-c)(c-a)(a+b+c)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hoán vị vòng và $c^3-a^3=-[(b^3-c^3)+(a^3-b^3)]$, nên đưa về hai hiệu lập phương $b^3-c^3$ và $a^3-b^3$ rồi đặt nhân tử chung theo từng hiệu.

**Bước 1.** Thay $c^3-a^3$ bằng tổng đối của hai hiệu $b^3-c^3$ và $a^3-b^3$ để chỉ còn hai hiệu lập phương trong biểu thức.

**Bước 2.** Nhóm các hạng tử chứa cùng một hiệu lập phương rồi đặt nhân tử chung, được hiệu của hai tích.

**Bước 3.** Phân tích $b^3-c^3$ và $a^3-b^3$ bằng hằng đẳng thức hiệu hai lập phương để lộ nhân tử chung $(a-b)(b-c)$.

**Bước 4.** Đặt $(a-b)(b-c)$ ra ngoài rồi phân tích tiếp biểu thức còn lại bằng cách nhóm hạng tử.

**Phần 2. Trình bày**

$a(b^3-c^3)+b(c^3-a^3)+c(a^3-b^3)$

$=a(b^3-c^3)-b[(b^3-c^3)+(a^3-b^3)]+c(a^3-b^3)$

$=(a-b)(b^3-c^3)-(b-c)(a^3-b^3)$

$=(a-b)(b-c)(b^2+bc+c^2)-(b-c)(a-b)(a^2+ab+b^2)$

$=(a-b)(b-c)(bc+c^2-a^2-ab)$

$=(a-b)(b-c)[(c-a)(c+a)+b(c-a)]$

$=(a-b)(b-c)(c-a)(a+b+c)$

=== T2B.9@p35
- bai: 9 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010204
- cong_cu: hoán vị vòng · hiệu hai lập phương
- kiem: bang | a^3(b^2-c^2)+b^3(c^2-a^2)+c^3(a^2-b^2)
- ket_qua_sach: (a-b)(b-c)(a-c)(ab+bc+ca)
- dap_an: $(a-b)(b-c)(a-c)(ab+bc+ca)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $a^3(b^2-c^2)+b^3(c^2-a^2)+c^3(a^2-b^2)$.
## SACH
Đáp số:

$a^3(b^2-c^2)+b^3(c^2-a^2)+c^3(a^2-b^2)=(a-b)(b-c)(a-c)(ab+bc+ca)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hoán vị vòng giống bài trước, chỉ đổi vai trò mũ; tách $c^2-a^2=-[(b^2-c^2)+(a^2-b^2)]$ để chỉ còn hai hiệu bình phương rồi đặt nhân tử chung theo từng hiệu.

**Bước 1.** Thay $c^2-a^2$ bằng tổng đối của hai hiệu $b^2-c^2$ và $a^2-b^2$ để nhóm được các hạng tử.

**Bước 2.** Đặt nhân tử chung theo từng hiệu để được hiệu của hai tích, mỗi tích gồm một hiệu lập phương và một hiệu bình phương.

**Bước 3.** Phân tích từng hiệu lập phương và hiệu bình phương rồi đặt nhân tử chung $(a-b)(b-c)$ ra ngoài.

**Bước 4.** Khai triển hai tích trong ngoặc vuông, rút gọn rồi phân tích tiếp phần còn lại bằng cách nhóm hạng tử.

**Phần 2. Trình bày**

$a^3(b^2-c^2)+b^3(c^2-a^2)+c^3(a^2-b^2)$

$=a^3(b^2-c^2)-b^3[(b^2-c^2)+(a^2-b^2)]+c^3(a^2-b^2)$

$=(a^3-b^3)(b^2-c^2)-(b^3-c^3)(a^2-b^2)$

$=(a-b)(a^2+ab+b^2)(b-c)(b+c)-(b-c)(b^2+bc+c^2)(a-b)(a+b)$

$=(a-b)(b-c)[(a^2+ab+b^2)(b+c)-(b^2+bc+c^2)(a+b)]$

$=(a-b)(b-c)(a^2b+a^2c-ac^2-bc^2)$

$=(a-b)(b-c)[b(a^2-c^2)+ac(a-c)]$

$=(a-b)(b-c)(a-c)[b(a+c)+ac]$

$=(a-b)(b-c)(a-c)(ab+bc+ca)$

=== T2B.10@p35
- bai: 10 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010204
- cong_cu: hằng đẳng thức tổng hai lập phương · hằng đẳng thức mở rộng
- kiem: bang | a^3+b^3+c^3-3abc
- ket_qua_sach: (a+b+c)(a^2+b^2+c^2-ab-bc-ca)
- dap_an: $(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $a^3+b^3+c^3-3abc$.
## SACH
Viết $a^3+b^3$ dưới dạng $(a+b)^3-3a^2b-3ab^2$. Do đó:

$a^3+b^3+c^3-3abc=(a+b)^3+c^3-3a^2b-3ab^2-3abc$

$=(a+b+c)[(a+b)^2-c(a+b)+c^2]-3ab(a+b+c)$

$=(a+b+c)[a^2+b^2+c^2-ab-bc-ca]$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $a^3+b^3=(a+b)^3-3ab(a+b)$ để gom được tổng hai lập phương $(a+b)^3+c^3$, rồi tách phần còn lại để cả hai nhóm cùng chứa nhân tử $a+b+c$.

**Bước 1.** Dùng $a^3+b^3=(a+b)^3-3ab(a+b)$ để đưa đa thức về dạng $(a+b)^3+c^3$ cộng với phần chứa $ab$.

**Bước 2.** Phân tích tổng hai lập phương $(a+b)^3+c^3$ bằng hằng đẳng thức, trong đó có nhân tử $a+b+c$.

**Bước 3.** Nhóm các hạng tử còn lại thành $-3ab(a+b+c)$ để nhân tử chung $a+b+c$ xuất hiện ở cả hai nhóm.

**Bước 4.** Đặt $a+b+c$ ra ngoài rồi khai triển và thu gọn biểu thức trong ngoặc.

**Chú ý:** Đây là hằng đẳng thức mở rộng: $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$, nên bài toán gặp lại dưới nhiều dạng.

**Phần 2. Trình bày**

$a^3+b^3+c^3-3abc$

$=(a+b)^3-3ab(a+b)+c^3-3abc$

$=[(a+b)^3+c^3]-3ab(a+b+c)$

$=(a+b+c)[(a+b)^2-c(a+b)+c^2]-3ab(a+b+c)$

$=(a+b+c)(a^2+2ab+b^2-ac-bc+c^2-3ab)$

$=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$

=== T2B.11@p35
- bai: 11 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010204
- cong_cu: hằng đẳng thức lập phương của tổng
- kiem: bang | (a+b+c)^3-a^3-b^3-c^3
- ket_qua_sach: 3(a+b)(b+c)(a+c)
- dap_an: $3(a+b)(b+c)(c+a)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $(a+b+c)^3-a^3-b^3-c^3$.
## SACH
Áp dụng hằng đẳng thức $(x+y)^3=x^3+y^3+3xy(x+y)$, ta có:

$(a+b+c)^3-a^3-b^3-c^3$

$=(a+b)^3+c^3+3c(a+b)(a+b+c)-a^3-b^3-c^3$

$=a^3+b^3+3ab(a+b)+c^3+3c(a+b)(a+b+c)-a^3-b^3-c^3$

$=3(a+b)(ab+ac+bc+c^2)=3(a+b)(b+c)(a+c)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Coi $(a+b+c)^3$ là lập phương của tổng hai số $a+b$ và $c$, khai triển bằng $(x+y)^3=x^3+y^3+3xy(x+y)$, rồi khai triển tiếp $(a+b)^3$ theo cùng hằng đẳng thức để các lập phương triệt tiêu.

**Bước 1.** Khai triển $(a+b+c)^3$ bằng hằng đẳng thức lập phương của tổng với hai số $a+b$ và $c$.

**Bước 2.** Khai triển $(a+b)^3$ theo cùng hằng đẳng thức để các hạng tử $a^3$, $b^3$, $c^3$ đối nhau và triệt tiêu.

**Bước 3.** Đặt nhân tử chung $3(a+b)$ cho hai hạng tử còn lại rồi nhóm hạng tử trong ngoặc để phân tích tiếp.

**Phần 2. Trình bày**

$(a+b+c)^3-a^3-b^3-c^3$

$=(a+b)^3+c^3+3c(a+b)(a+b+c)-a^3-b^3-c^3$

$=a^3+b^3+3ab(a+b)+c^3+3c(a+b)(a+b+c)-a^3-b^3-c^3$

$=3ab(a+b)+3c(a+b)(a+b+c)$

$=3(a+b)(ab+ac+bc+c^2)$

$=3(a+b)[a(b+c)+c(b+c)]$

$=3(a+b)(b+c)(c+a)$

=== T2B.12@p35
- bai: 12 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: tách hạng tử
- kiem: bang | x^2-2x-35
- ket_qua_sach: (x+5)(x-7)
- dap_an: $(x+5)(x-7)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^2-2x-35$.
## SACH
Ba số hạng của đa thức không có thừa số chung cũng không lập thành bình phương một nhị thức. Do đó ta nghĩ đến việc tách một số hạng thành hai để tạo thành đa thức có 4 số hạng. Có nhiều cách tách số hạng trong đó hai cách sau là thông dụng nhất:

Cách 1: Tách số hạng cuối để cùng với 2 số hạng đầu tạo thành bình phương một nhị thức, rồi đưa về dạng hiệu hai bình phương:

$x^2-2x-35=x^2-2x+1-36=(x-1)^2-6^2=(x-1+6)(x-1-6)=(x+5)(x-7)$

Cách 2: Tách số hạng giữa thành hai số hạng rồi dùng phương pháp nhóm các số hạng và đặt thừa số chung làm xuất hiện thừa số chung mới:

$x^2-2x-35=x^2+5x-7x-35=x(x+5)-7(x+5)=(x+5)(x-7)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai không có nhân tử chung và không là hằng đẳng thức, nên tách hạng tử bậc nhất thành hai hạng tử có tích bằng tích của hệ số bậc hai và hệ số tự do rồi nhóm.

**Bước 1.** Tính tích của hệ số bậc hai và hệ số tự do rồi tìm hai số nguyên có tích đó và có tổng bằng hệ số của $x$.

**Bước 2.** Tách hạng tử bậc nhất thành hai hạng tử theo hai số vừa tìm.

**Bước 3.** Nhóm hai cặp hạng tử và đặt nhân tử chung ở từng cặp để xuất hiện một nhân tử chung mới.

**Chú ý:** Cũng có thể thêm bớt $1$ để đưa về hiệu hai bình phương $(x-1)^2-6^2$; hai cách cho cùng kết quả.

**Phần 2. Trình bày**

$x^2-2x-35$

$=x^2+5x-7x-35$

$=x(x+5)-7(x+5)$

$=(x+5)(x-7)$

=== T2B.13@p35
- bai: 13 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: tách hạng tử
- kiem: bang | 9x^2+6x-8
- ket_qua_sach: (3x-2)(3x+4)
- dap_an: $(3x-2)(3x+4)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $9x^2+6x-8$.
## SACH
Cách 1: $9x^2+6x-8=(3x)^2+2\cdot 3x+1-9=(3x+1)^2-3^2$

$=(3x+1-3)(3x+1+3)=(3x-2)(3x+4)$

Cách 2: $9x^2+6x-8=9x^2-6x+12x-8$

$=3x(3x-2)+4(3x-2)=(3x-2)(3x+4)$

Chú ý: Cách tách số hạng giữa thành hai số hạng chính là dựa vào hằng đẳng thức: $mpx^2+(mq+np)x+nq=(mx+n)(px+q)$

Như vậy trong tam thức $ax^2+bx+c$, hệ số $b$ được tách thành $b_1+b_2$ sao cho $b_1b_2=ac$. Trong thực hành, ta làm như sau:

1. Tìm tích $ac$.

2. Phân tích $ac$ ra tích 2 thừa số (nguyên) bằng mọi cách.

3. Chọn 2 thừa số mà tổng bằng $b$.

Ví dụ trong đa thức $9x^2+6x-8$ thì $a=9$; $b=6$; $c=-8$.

Bước 1: Tích $ac=9\cdot(-8)=-72$.

Bước 2: Phân tích $-72$ ra tích 2 thừa số (nguyên) trong đó thừa số dương có giá trị tuyệt đối lớn (để tổng bằng 6) được: $(-1)\cdot72=(-2)\cdot36=(-3)\cdot24=(-4)\cdot18=(-6)\cdot12=(-8)\cdot9$

Bước 3: Chọn hai thừa số mà tổng bằng 6. Đó là $-6$ và $12$.

Nên làm theo cách 2 trong trường hợp tam thức $ax^2+bx+c$ có $b$ là số lẻ hoặc $a$ không là bình phương của một số nguyên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai $ax^2+bx+c$ có thể phân tích khi tách $bx$ thành hai hạng tử mà hệ số có tích bằng $ac$; ở đây $a=9$ là bình phương nên cũng có thể đưa về hiệu hai bình phương.

**Bước 1.** Tính tích $ac$ của hệ số bậc hai và hệ số tự do, rồi tìm hai số nguyên có tích bằng $ac$ và có tổng bằng hệ số của $x$.

**Bước 2.** Tách hạng tử bậc nhất $6x$ thành hai hạng tử theo hai số vừa tìm.

**Bước 3.** Nhóm hai cặp hạng tử, đặt nhân tử chung ở từng cặp để lộ nhân tử chung mới rồi đặt ra ngoài.

**Chú ý:** Vì $a=9=3^2$ nên cũng làm được bằng cách viết $9x^2+6x+1-9=(3x+1)^2-3^2$.

**Phần 2. Trình bày**

$9x^2+6x-8$

$=9x^2-6x+12x-8$

$=3x(3x-2)+4(3x-2)$

$=(3x-2)(3x+4)$

=== T2B.14@p35
- bai: 14 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: tách hạng tử
- kiem: bang | 4x^2-3x-1
- ket_qua_sach: (x-1)(4x+1)
- dap_an: $(x-1)(4x+1)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $4x^2-3x-1$.
## SACH
$4x^2-3x-1=4x^2-4x+x-1=4x(x-1)+(x-1)=(x-1)(4x+1)$

Chú ý: Cũng có thể nhận xét đa thức có tổng các hệ số bằng $4-3-1=0$ nên chứa thừa số $(x-1)$. Do đó tách số hạng làm xuất hiện thừa số chung $(x-1)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng các hệ số $4-3-1$ bằng $0$ nên $x=1$ là nghiệm, tức đa thức chứa nhân tử $x-1$; chỉ cần tách hạng tử để nhân tử đó xuất hiện.

**Bước 1.** Cộng các hệ số của đa thức để nhận ra đa thức có nghiệm $x=1$, nghĩa là có nhân tử $x-1$.

**Bước 2.** Tách hạng tử bậc nhất $-3x$ thành hai hạng tử sao cho mỗi cặp hạng tử đều chia hết cho $x-1$.

**Bước 3.** Đặt nhân tử chung $x-1$ ra ngoài để được tích của hai nhị thức.

**Phần 2. Trình bày**

$4x^2-3x-1$

$=4x^2-4x+x-1$

$=4x(x-1)+(x-1)$

$=(x-1)(4x+1)$

=== T2B.15@p35
- bai: 15 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010203
- cong_cu: đổi biến · tách hạng tử
- kiem: bang | 6x^4-11x^2+3
- ket_qua_sach: (3x^2-1)(2x^2-3)
- dap_an: $(3x^2-1)(2x^2-3)$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010202 (tách hạng tử), chọn 010203 vì đa thức bậc bốn, quy về tam thức bậc hai bằng cách đặt $t=x^2$.
## DE
Phân tích đa thức thành nhân tử: $6x^4-11x^2+3$.
## SACH
Đáp số: $(3x^2-1)(2x^2-3)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức chỉ chứa $x^4$ và $x^2$ nên đặt $t=x^2$ đưa về tam thức bậc hai theo $t$, rồi tách hạng tử như với tam thức bậc hai.

**Bước 1.** Đặt $t=x^2$ để đa thức trở thành tam thức bậc hai theo $t$ với các hệ số $6$, $-11$, $3$.

**Bước 2.** Tìm hai số có tích bằng $6\cdot3=18$ và tổng bằng $-11$ rồi tách hạng tử bậc nhất theo $t$.

**Bước 3.** Nhóm hai cặp hạng tử và đặt nhân tử chung, rồi thay $t=x^2$ trở lại để được hai nhân tử theo $x$.

**Chú ý:** Cuối bài nên kiểm tra mỗi nhân tử $3x^2-1$ và $2x^2-3$ không còn phân tích tiếp được trong tập số hữu tỉ.

**Phần 2. Trình bày**

$6x^4-11x^2+3$

$=6x^4-9x^2-2x^2+3$

$=3x^2(2x^2-3)-(2x^2-3)$

$=(3x^2-1)(2x^2-3)$

=== T2B.16@p35
- bai: 16 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010202
- cong_cu: tách hạng tử
- kiem: bang | x^2-7xy+12y^2
- ket_qua_sach: (x-3y)(x-4y)
- dap_an: $(x-3y)(x-4y)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^2-7xy+12y^2$.
## SACH
Đáp số: $(x-3y)(x-4y)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đây là tam thức bậc hai đồng bậc theo $x$ và $y$, nên làm như với tam thức một biến: tách hạng tử $-7xy$ thành hai hạng tử mà hệ số có tích bằng tích hai hệ số còn lại.

**Bước 1.** Tính tích $1\cdot12$ của hệ số của $x^2$ và $y^2$ rồi tìm hai số có tích đó và có tổng bằng $-7$.

**Bước 2.** Tách hạng tử $-7xy$ thành hai hạng tử theo hai số vừa tìm.

**Bước 3.** Nhóm hai cặp hạng tử rồi đặt nhân tử chung để được tích hai nhị thức.

**Phần 2. Trình bày**

$x^2-7xy+12y^2$

$=x^2-3xy-4xy+12y^2$

$=x(x-3y)-4y(x-3y)$

$=(x-3y)(x-4y)$

=== T2B.17@p35
- bai: 17 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: đổi biến
- kiem: bang | x^2-2xy+y^2+3x-3y-10
- ket_qua_sach: (x-y+5)(x-y-2)
- dap_an: $(x-y+5)(x-y-2)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^2-2xy+y^2+3x-3y-10$.
## SACH
Viết đa thức thành $(x-y)^2+3(x-y)-10$. Đặt $x-y=u$, phân tích $u^2+3u-10$ ra $(u+5)(u-2)$.

Đáp số: $(x-y+5)(x-y-2)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba hạng tử đầu lập thành $(x-y)^2$ và $3x-3y=3(x-y)$, nên đa thức chỉ phụ thuộc vào $x-y$; đặt $u=x-y$ để đưa về tam thức bậc hai theo $u$.

**Bước 1.** Nhóm $x^2-2xy+y^2$ thành bình phương của một hiệu và nhóm $3x-3y$ thành tích có nhân tử $x-y$.

**Bước 2.** Đặt $u=x-y$ để đa thức trở thành tam thức bậc hai một biến $u$.

**Bước 3.** Phân tích tam thức theo $u$ bằng cách tách hạng tử bậc nhất rồi nhóm.

**Bước 4.** Thay $u=x-y$ trở lại để được tích hai nhân tử theo $x$ và $y$.

**Phần 2. Trình bày**

$x^2-2xy+y^2+3x-3y-10$

$=(x-y)^2+3(x-y)-10$

Đặt $u=x-y$: $u^2+3u-10=u^2+5u-2u-10=u(u+5)-2(u+5)=(u+5)(u-2)$

Thay $u=x-y$:

$=(x-y+5)(x-y-2)$

=== T2B.18@p35
- bai: 18 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: nhẩm nghiệm · tách hạng tử
- kiem: bang | 2x^3-12x^2+17x-2
- ket_qua_sach: (x-2)(2x^2-8x+1)
- dap_an: $(x-2)(2x^2-8x+1)$
- ghi_chu_nghi: Phần Chú ý của sách bị mất 1–2 chữ cái đầu dòng (dựng lại "Khi", "Với", "Vì", "Trước hết"); biểu thức $a(X^2-k)$ in mờ (chép là $a(X^2-k)$ với $X=x+\dfrac{b}{2a}$ hiểu theo ngữ cảnh).
## DE
Phân tích đa thức thành nhân tử: $2x^3-12x^2+17x-2$.
## SACH
$2x^3-12x^2+17x-2=2x^3-4x^2-8x^2+16x+x-2$

$=2x^2(x-2)-8x(x-2)+(x-2)=(x-2)(2x^2-8x+1)$

Chú ý. Tam thức $(2x^2-8x+1)$ không phân tích ra thừa số được nữa.

Khi phân tích theo cách 1, sau khi đưa tam thức $ax^2+bx+c$ về dạng $a(X^2-k)$, nếu $k$ có dạng $m^2$ (với $m$ hữu tỉ) thì tam thức phân tích tiếp được ra thừa số, nếu không có dạng trên thì không phân tích được (trong phạm vi số hữu tỉ). Khi phân tích theo cách 2, sau khi tính tích $ac$ và phân tích $ac$ ra tích hai thừa số (nguyên) bằng mọi cách, nếu không có 2 thừa số nào mà tổng bằng $b$ thì không phân tích tiếp được.

Với tam thức trên, ta có:

$2x^2-8x+1=2\left(x^2-4x+4-\dfrac{7}{2}\right)=2\left[(x-2)^2-\dfrac{7}{2}\right]$

Vì $\dfrac{7}{2}$ không là bình phương của số hữu tỉ nào nên không phân tích được tam thức ra thừa số. Còn nếu tính tích $ac$, ta được 2. Phân tích thành tích 2 thừa số cùng âm, ta có: $(-1)(-2)$. Không có 2 thừa số nào có tổng bằng $-8$. Như vậy, không phân tích tiếp tam thức trên ra thừa số được. Làm thế nào để tách các số hạng của đa thức $(2x^3-12x^2+17x-2)$ như trên?

Trước hết, ta kiểm tra xem đa thức có chứa thừa số $x-a$ không, tức là tìm số dư khi chia đa thức cho $x-a$. Theo bài 13, số dư đó bằng số trị của đa thức khi $x=a$. Như vậy nếu thay $x$ bằng $a$ mà số trị đa thức bằng 0 thì khi phân tích ra thừa số đã có một thừa số là $x-a$. Do đó ta sẽ tách các số hạng của đa thức làm xuất hiện thừa số chung $x-a$. Giá trị $x=a$ đó còn gọi là nghiệm của đa thức (nghiệm của đa thức $P(x)$ là giá trị của $x$ làm cho số trị đa thức bằng 0).

Trong một đa thức với hệ số nguyên, nghiệm nguyên (nếu có) phải là ước số của số hạng tự do. Do đó chỉ cần xét $a$ là ước số của số hạng tự do. Ví dụ đối với $(2x^3-12x^2+17x-2)$, số hạng tự do là $-2$, các ước của nó là $\pm1$; $\pm2$. Với $x=2$ thì số trị đa thức bằng 0, do đó ta tách các số hạng của đa thức đó xuất hiện thừa số chung $x-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba có hệ số nguyên không có nhân tử chung, không là hằng đẳng thức; nghiệm nguyên nếu có phải là ước của hệ số tự do $-2$, nên nhẩm nghiệm để biết trước một nhân tử rồi tách hạng tử cho nhân tử đó xuất hiện.

**Bước 1.** Thử các ước của hệ số tự do $-2$, thay $x=2$ vào thì đa thức bằng $0$, vậy đa thức có nhân tử $x-2$.

**Bước 2.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chia hết cho $x-2$.

**Bước 3.** Đặt nhân tử chung $x-2$ ra ngoài rồi kiểm tra xem tam thức bậc hai còn lại có phân tích tiếp được không.

**Chú ý:** Tam thức $2x^2-8x+1$ không phân tích tiếp được trong tập số hữu tỉ, nên kết quả dừng ở tích hai nhân tử.

**Phần 2. Trình bày**

$2x^3-12x^2+17x-2$

$=2x^3-4x^2-8x^2+16x+x-2$

$=2x^2(x-2)-8x(x-2)+(x-2)$

$=(x-2)(2x^2-8x+1)$

Vì $2x^2-8x+1=2\left[(x-2)^2-\dfrac{7}{2}\right]$ và $\dfrac{7}{2}$ không là bình phương của một số hữu tỉ nên tam thức này không phân tích tiếp được.

=== T2B.19@p35
- bai: 19 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: nhẩm nghiệm
- kiem: bang | x^3-3x+2
- ket_qua_sach: (x-1)^2(x+2)
- dap_an: $(x-1)^2(x+2)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^3-3x+2$.
## SACH
Cách 1: Vì tổng các hệ số bằng 0 nên đa thức chứa thừa số $x-1$. Do đó:

$x^3-3x+2=x^3-1-3x+3$

$=(x-1)(x^2+x+1)-3(x-1)=(x-1)(x^2+x-2)$.

Tiếp tục phân tích $(x^2+x-2)=(x-1)(x+2)$.

Kết quả: $x^3-3x+2=(x-1)^2(x+2)$.

Cách 2: Nhận xét với $x=-2$ thì số trị đa thức bằng 0 nên đa thức chứa thừa số $x+2$. Do đó:

$x^3-3x+2=x^3+8-3x-6=(x+2)(x^2-2x+4)-3(x+2)$

$=(x+2)(x^2-2x+1)=(x+2)(x-1)^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng các hệ số $1-3+2$ bằng $0$ nên $x=1$ là nghiệm, đa thức chứa nhân tử $x-1$; thêm bớt hằng số để xuất hiện $x^3-1$ và đặt nhân tử chung.

**Bước 1.** Cộng các hệ số để nhận ra $x=1$ là nghiệm, suy ra đa thức có nhân tử $x-1$.

**Bước 2.** Tách $2=-1+3$ để nhóm thành $x^3-1$ và $-3x+3$, mỗi nhóm đều chứa nhân tử $x-1$.

**Bước 3.** Đặt nhân tử chung $x-1$ ra ngoài rồi phân tích tiếp tam thức bậc hai còn lại thành tích hai nhị thức.

**Chú ý:** Đa thức còn có nghiệm $x=-2$, nên cũng có thể tách theo nhân tử $x+2$; hai cách cho cùng một kết quả.

**Phần 2. Trình bày**

$x^3-3x+2$

$=x^3-1-3x+3$

$=(x-1)(x^2+x+1)-3(x-1)$

$=(x-1)(x^2+x-2)$

$=(x-1)^2(x+2)$ (vì $x^2+x-2=(x-1)(x+2)$)

=== T2B.20@p35
- bai: 20 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: nhẩm nghiệm
- kiem: bang | x^3+3x^2+6x+4
- ket_qua_sach: (x+1)(x^2+2x+4)
- dap_an: $(x+1)(x^2+2x+4)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^3+3x^2+6x+4$.
## SACH
Cách 1: Vì tổng các hệ số của lũy thừa bậc lẻ đối với $x$ bằng tổng các hệ số của lũy thừa bậc chẵn đối với $x$ ($1+6=3+4$). Do đó:

$x^3+3x^2+6x+4=x^3+1+3x^2+6x+3$

$=(x+1)(x^2-x+1)+3(x^2+2x+1)=(x+1)(x^2-x+1)+3(x+1)^2$

$=(x+1)(x^2-x+1+3x+3)=(x+1)(x^2+2x+4)$.

Cách 2: $x^3+3x^2+6x+4=x^3-8+3x^2+6x+12$

$=(x-2)(x^2+2x+4)+3(x^2+2x+4)=(x^2+2x+4)(x+1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng các hệ số của lũy thừa bậc lẻ bằng tổng các hệ số của lũy thừa bậc chẵn nên $x=-1$ là nghiệm, đa thức chứa nhân tử $x+1$; tách hằng số để xuất hiện $x^3+1$ và $3(x+1)^2$.

**Bước 1.** So sánh tổng hệ số bậc lẻ $1+6$ với tổng hệ số bậc chẵn $3+4$ để nhận ra $x=-1$ là nghiệm.

**Bước 2.** Tách hệ số tự do $4=1+3$ để nhóm thành $x^3+1$ và $3x^2+6x+3$, mỗi nhóm đều chứa nhân tử $x+1$.

**Bước 3.** Phân tích $x^3+1$ bằng hằng đẳng thức tổng hai lập phương và $3x^2+6x+3$ bằng bình phương của một tổng.

**Bước 4.** Đặt nhân tử chung $x+1$ ra ngoài rồi rút gọn biểu thức trong ngoặc.

**Phần 2. Trình bày**

$x^3+3x^2+6x+4$

$=x^3+1+3x^2+6x+3$

$=(x+1)(x^2-x+1)+3(x+1)^2$

$=(x+1)(x^2-x+1+3x+3)$

$=(x+1)(x^2+2x+4)$

=== T2B.21@p35
- bai: 21 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010203
- cong_cu: đổi biến · hằng đẳng thức lập phương của tổng
- kiem: bang | x^3+9x^2+26x+24
- ket_qua_sach: (x+3)(x+4)(x+2)
- dap_an: $(x+2)(x+3)(x+4)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $x^3+9x^2+26x+24$.
## SACH
Biến đổi đa thức $x^3+9x^2+26x+24=x^3+9x^2+27x+27-x-3$ hay $(x+3)^3-(x+3)$.

Đáp số: $x^3+9x^2+26x+24=(x+3)(x+4)(x+2)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba hạng tử đầu $x^3+9x^2+27x$ gợi lập phương của $x+3$; tách $26x=27x-x$ và $24=27-3$ thì đa thức thành $(x+3)^3-(x+3)$, chỉ phụ thuộc vào $x+3$.

**Bước 1.** Nhận ra các hệ số $9$ và $27$ giống khai triển $(x+3)^3$ nên tách $26x$ và $24$ để ghép đủ bốn hạng tử của lập phương.

**Bước 2.** Viết đa thức dưới dạng $(x+3)^3-(x+3)$, tức là hiệu của một lũy thừa và chính cơ số của nó.

**Bước 3.** Đặt nhân tử chung $x+3$ rồi phân tích biểu thức còn lại bằng hằng đẳng thức hiệu hai bình phương.

**Phần 2. Trình bày**

$x^3+9x^2+26x+24=x^3+9x^2+27x+27-x-3$

$=(x+3)^3-(x+3)$

$=(x+3)[(x+3)^2-1]$

$=(x+3)(x+2)(x+4)$

=== T2B.22@p35
- bai: 22 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: nhẩm nghiệm hữu tỉ · tách hạng tử
- kiem: bang | 2x^3-5x^2+8x-3
- ket_qua_sach: (2x-1)(x^2-2x+3)
- dap_an: $(2x-1)(x^2-2x+3)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $2x^3-5x^2+8x-3$.
## SACH
$2x^3-5x^2+8x-3=2x^3-x^2-4x^2+2x+6x-3$

$=x^2(2x-1)-2x(2x-1)+3(2x-1)=(2x-1)(x^2-2x+3)$

Chú ý: Các số $\pm1$; $\pm3$ không phải là nghiệm của đa thức. Như vậy đa thức không có nghiệm nguyên. Nhưng đa thức có thể có nghiệm hữu tỉ. Ta chứng minh được trong một đa thức với hệ số nguyên, nghiệm hữu tỉ (nếu có) phải có dạng $\dfrac{p}{q}$ trong đó $p$ là ước số của số hạng tự do, $q$ là ước dương của hệ số số hạng bậc cao nhất. Như vậy, nghiệm hữu tỉ (nếu có) của đa thức trên là $\pm1$; $\pm\dfrac{1}{2}$; $\pm3$; $\pm\dfrac{3}{2}$. Sau khi kiểm tra, ta thấy $x=\dfrac{1}{2}$ là một nghiệm. Như vậy đa thức chứa thừa số $\left(x-\dfrac{1}{2}\right)$ hay $(2x-1)$. Do đó ta tìm cách tách các số hạng của đa thức để xuất hiện thừa số chung $(2x-1)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba hệ số nguyên không có nghiệm nguyên, nên tìm nghiệm hữu tỉ $\dfrac{p}{q}$ với $p$ là ước của $-3$ và $q$ là ước dương của $2$; có nghiệm thì biết trước một nhân tử để tách hạng tử.

**Bước 1.** Thử các số $\pm1$, $\pm3$ thấy không là nghiệm, rồi thử tiếp các số hữu tỉ $\pm\dfrac{1}{2}$, $\pm\dfrac{3}{2}$.

**Bước 2.** Tìm được nghiệm $x=\dfrac{1}{2}$, suy ra đa thức có nhân tử $2x-1$.

**Bước 3.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chia hết cho $2x-1$.

**Bước 4.** Đặt nhân tử chung $2x-1$ ra ngoài để được tích của nhị thức và một tam thức bậc hai.

**Chú ý:** Tam thức còn lại $x^2-2x+3=(x-1)^2+2>0$ không có nghiệm nên không phân tích tiếp được.

**Phần 2. Trình bày**

$2x^3-5x^2+8x-3$

$=2x^3-x^2-4x^2+2x+6x-3$

$=x^2(2x-1)-2x(2x-1)+3(2x-1)$

$=(2x-1)(x^2-2x+3)$

=== T2B.23@p35
- bai: 23 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010203
- cong_cu: nhẩm nghiệm hữu tỉ · tách hạng tử
- kiem: bang | 3x^3-14x^2+4x+3
- ket_qua_sach: (3x+1)(x^2-5x+3)
- dap_an: $(3x+1)(x^2-5x+3)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $3x^3-14x^2+4x+3$.
## SACH
Chú ý $x=-\dfrac{1}{3}$ là một nghiệm của đa thức nên đa thức chứa thừa số $\left(x+\dfrac{1}{3}\right)$ hay $(3x+1)$.

Đáp số: $3x^3-14x^2+4x+3=(3x+1)(x^2-5x+3)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hệ số nguyên bậc ba không có nghiệm nguyên nên tìm nghiệm hữu tỉ $\dfrac{p}{q}$ với $p$ là ước của $3$ và $q$ là ước dương của $3$; có nghiệm thì biết trước một nhân tử để tách hạng tử.

**Bước 1.** Liệt kê các nghiệm hữu tỉ có thể có $\pm1$, $\pm3$, $\pm\dfrac{1}{3}$ rồi thử, thấy $x=-\dfrac{1}{3}$ làm đa thức bằng $0$.

**Bước 2.** Suy ra đa thức có nhân tử $3x+1$, rồi tách các hạng tử thành từng cặp cùng chia hết cho $3x+1$.

**Bước 3.** Đặt nhân tử chung $3x+1$ ra ngoài và kiểm tra tam thức bậc hai còn lại.

**Phần 2. Trình bày**

$3x^3-14x^2+4x+3$

$=3x^3+x^2-15x^2-5x+9x+3$

$=x^2(3x+1)-5x(3x+1)+3(3x+1)$

$=(3x+1)(x^2-5x+3)$

=== T2B.24@p35
- bai: 24 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử
- kiem: bang | a^5+a+1
- ket_qua_sach: (a^2+a+1)(a^3-a^2+1)
- dap_an: $(a^2+a+1)(a^3-a^2+1)$
- ghi_chu_nghi: Dấu "+" trước số 1 ở đề in mờ giống dấu "÷"; chép là $a^5+a+1$ theo lời giải của sách.
## DE
Phân tích đa thức thành nhân tử: $a^5+a+1$.
## SACH
Cách 1: Để "nối" từ $a^5$ đến $a$, ta thêm bớt các số hạng $a^4$, $a^3$, $a^2$. Như vậy:

$a^5+a+1=a^5+a^4-a^4+a^3-a^3+a^2-a^2+a+1$

$=a^5+a^4+a^3-a^4-a^3-a^2+a^2+a+1$

$=a^3(a^2+a+1)-a^2(a^2+a+1)+(a^2+a+1)$

$=(a^2+a+1)(a^3-a^2+1)$

Cách 2: Thêm bớt $a^2$ để làm xuất hiện thừa số chung $(a^2+a+1)$. Ta có:

$a^5+a+1=a^5-a^2+a^2+a+1=a^2(a^3-1)+(a^2+a+1)$

$=a^2(a-1)(a^2+a+1)+(a^2+a+1)=(a^2+a+1)(a^3-a^2+1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức chỉ có ba hạng tử cách xa nhau về số mũ nên không nhóm được; thêm và bớt $a^2$ để tạo $a^5-a^2=a^2(a^3-1)$ và $a^2+a+1$, hai nhóm cùng chứa nhân tử $a^2+a+1$.

**Bước 1.** Nhận thấy $a^5+a+1$ không có nhân tử chung và không nhóm được nên nghĩ đến thêm bớt một hạng tử.

**Bước 2.** Thêm và bớt $a^2$ để tách đa thức thành hai nhóm $a^5-a^2$ và $a^2+a+1$.

**Bước 3.** Phân tích $a^3-1$ bằng hằng đẳng thức hiệu hai lập phương để lộ nhân tử $a^2+a+1$ ở nhóm thứ nhất.

**Bước 4.** Đặt nhân tử chung $a^2+a+1$ ra ngoài.

**Chú ý:** Các đa thức dạng $a^{3k+2}+a+1$ (như $a^5+a+1$, $a^8+a+1$) đều phân tích được có nhân tử $a^2+a+1$ theo cách thêm bớt này.

**Phần 2. Trình bày**

$a^5+a+1$

$=a^5-a^2+a^2+a+1$

$=a^2(a^3-1)+(a^2+a+1)$

$=a^2(a-1)(a^2+a+1)+(a^2+a+1)$

$=(a^2+a+1)[a^2(a-1)+1]$

$=(a^2+a+1)(a^3-a^2+1)$

=== T2B.25@p35
- bai: 25 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử
- kiem: bang | a^7+a^2+1
- ket_qua_sach: (a^2+a+1)(a^5-a^4+a^2-a+1)
- dap_an: $(a^2+a+1)(a^5-a^4+a^2-a+1)$
- ghi_chu_nghi:
## DE
Phân tích đa thức thành nhân tử: $a^7+a^2+1$.
## SACH
Thêm bớt $a$. Đáp số: $(a^2+a+1)(a^5-a^4+a^2-a+1)$

Chú ý: Các đa thức dạng $a^{3k+2}+a+1$ (như $a^5+a+1$, $a^8+a+1$, …) và $a^{3k+1}+a^{3m+2}+1$ (như $a^7+a^2+1$, $a^7+a^5+1$, …) đều phân tích được ra thừa số.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Thêm và bớt $a$ để tạo nhóm $a^7-a=a(a^6-1)$ chứa nhân tử $a^2+a+1$ và nhóm $a^2+a+1$ còn lại; hai nhóm cùng có nhân tử chung này.

**Bước 1.** Thêm và bớt $a$ để tách đa thức thành hai nhóm $a^7-a$ và $a^2+a+1$.

**Bước 2.** Phân tích $a^7-a=a(a^6-1)$ bằng hằng đẳng thức hiệu hai bình phương rồi hiệu hai lập phương để lộ nhân tử $a^2+a+1$.

**Bước 3.** Đặt nhân tử chung $a^2+a+1$ ra ngoài và khai triển biểu thức trong ngoặc vuông để thu gọn.

**Chú ý:** Đa thức dạng $a^{3k+1}+a^{3m+2}+1$ đều phân tích được bằng cách thêm bớt tương tự.

**Phần 2. Trình bày**

$a^7+a^2+1$

$=a^7-a+a^2+a+1$

$=a(a^6-1)+(a^2+a+1)$

$=a(a^3-1)(a^3+1)+(a^2+a+1)$

$=a(a-1)(a^2+a+1)(a^3+1)+(a^2+a+1)$

$=(a^2+a+1)[a(a-1)(a^3+1)+1]$

$=(a^2+a+1)(a^5-a^4+a^2-a+1)$

=== T2B.26@p35
- bai: 26 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử · hằng đẳng thức
- kiem: bang | (1+x^2)^2-4x(1-x^2)
- ket_qua_sach: (x^2+2x-1)^2
- dap_an: $(x^2+2x-1)^2$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010201 (dùng hằng đẳng thức), chọn 010202 vì lời giải thêm bớt $4x^2$ để đưa về bình phương.
## DE
Phân tích đa thức thành nhân tử: $(1+x^2)^2-4x(1-x^2)$.
## SACH
$(1+x^2)^2-4x(1-x^2)=(1-x^2)^2+4x^2-4x(1-x^2)$

$=[(1-x^2)-2x]^2=(x^2+2x-1)^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $(1+x^2)^2=(1-x^2)^2+4x^2$ nên ba hạng tử $(1-x^2)^2$, $4x^2=(2x)^2$ và $-4x(1-x^2)$ lập thành khai triển bình phương của một hiệu hai biểu thức $1-x^2$ và $2x$.

**Bước 1.** Chứng tỏ $(1+x^2)^2-(1-x^2)^2=4x^2$ để viết lại hạng tử đầu thành tổng của $(1-x^2)^2$ và $4x^2$.

**Bước 2.** Nhận ra $-4x(1-x^2)$ là hạng tử gấp đôi tích của $1-x^2$ và $2x$ với dấu trừ.

**Bước 3.** Viết ba hạng tử thành bình phương của một hiệu rồi rút gọn biểu thức trong ngoặc vuông.

**Phần 2. Trình bày**

$(1+x^2)^2-4x(1-x^2)$

$=(1-x^2)^2+4x^2-4x(1-x^2)$

$=(1-x^2)^2-2\cdot2x(1-x^2)+(2x)^2$

$=[(1-x^2)-2x]^2$

$=(x^2+2x-1)^2$

=== T2B.27@p35
- bai: 27 · y: - · trang: 35 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: tách hạng tử · bình phương của tổng
- kiem: bang | x^4+6x^3+11x^2+6x+1
- ket_qua_sach: (x^2+3x+1)^2
- dap_an: $(x^2+3x+1)^2$
- ghi_chu_nghi: Chưa chắc nhóm: có thể là T18T010203 (đa thức bậc bốn, hệ số bất định), chọn 010202 vì lời giải tách $11x^2=2x^2+9x^2$ để lập bình phương.
## DE
Phân tích đa thức thành nhân tử: $x^4+6x^3+11x^2+6x+1$.
## SACH
$x^4+6x^3+11x^2+6x+1=x^4+2x^2(3x+1)+(9x^2+6x+1)$

$=x^4+2x^2(3x+1)+(3x+1)^2=(x^2+3x+1)^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hạng tử đầu $x^4=(x^2)^2$ và ba hạng tử cuối gợi $(3x+1)^2=9x^2+6x+1$; tách $11x^2=2x^2+9x^2$ thì $6x^3+2x^2=2x^2(3x+1)$ chính là hai lần tích của $x^2$ và $3x+1$.

**Bước 1.** Nhận thấy $x^4$ là bình phương của $x^2$ và $9x^2+6x+1$ là bình phương của $3x+1$ nên đa thức có thể là bình phương của một tổng.

**Bước 2.** Tách $11x^2=2x^2+9x^2$ để ghép $6x^3+2x^2$ thành $2x^2(3x+1)$ và $9x^2+6x+1$ thành $(3x+1)^2$.

**Bước 3.** Viết đa thức dưới dạng $A^2+2AB+B^2$ với $A=x^2$ và $B=3x+1$ rồi thu về bình phương của một tổng.

**Chú ý:** Có thể kiểm tra bằng cách khai triển lại $(x^2+3x+1)^2$ để chắc kết quả.

**Phần 2. Trình bày**

$x^4+6x^3+11x^2+6x+1$

$=x^4+(6x^3+2x^2)+(9x^2+6x+1)$

$=x^4+2x^2(3x+1)+(3x+1)^2$

$=(x^2+3x+1)^2$
