=== T6V4.1@p130
- bai: 1 · y: - · trang: 130 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bảng xét dấu · quy đồng rồi so sánh với 0
- kiem: khong
- ket_qua_sach: \dfrac{1}{3}\le x<1
- dap_an: $\dfrac{1}{3}\le x<1$
- ghi_chu_nghi: Bảng xét dấu của sách ghi dòng tích $(1-3x)(x-1)$ ở khoảng $x>1$ là "+", đúng phải là "−" (chép đúng như in); kết luận của sách vẫn đúng. Máy thử lưới x trong [-12;12] bước 1/60: bất phương trình đúng đúng khi 1/3 ≤ x < 1, khớp sách.
## DE
Giải bất phương trình: $\dfrac{1-5x}{x-1}\ge1$.
## SACH
Điều kiện xác định: $x\ne1$.

$\dfrac{1-5x}{x-1}\ge1\Leftrightarrow\dfrac{1-5x}{x-1}-1\ge0\Leftrightarrow\dfrac{1-5x-x+1}{x-1}\ge0\Leftrightarrow\dfrac{2-6x}{x-1}\ge0\Leftrightarrow\dfrac{1-3x}{x-1}\ge0$.

Lập bảng xét dấu:

| x | | $\dfrac{1}{3}$ | | 1 | |
|---|---|---|---|---|---|
| $1-3x$ | + | 0 | − | | − |
| $x-1$ | − | | − | 0 | + |
| $(1-3x)(x-1)$ | − | | + | | + |

Nghiệm của bất phương trình là $\dfrac{1}{3}\le x<1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải là số $1$ còn mẫu $x-1$ có thể mang dấu âm hoặc dương, nên không được nhân chéo; phải chuyển $1$ sang vế trái, quy đồng để đưa về một phân thức so với $0$ rồi xét dấu tử và mẫu.

**Bước 1.** Tìm điều kiện xác định, tức là giá trị làm mẫu bằng $0$ phải bị loại ngay từ đầu khỏi tập nghiệm.

**Bước 2.** Chuyển $1$ sang vế trái, quy đồng và rút gọn tử để được một phân thức mà tử và mẫu đều là nhị thức bậc nhất.

**Bước 3.** Tìm nghiệm của tử và của mẫu, chia trục số thành các khoảng rồi xét dấu từng nhị thức trên mỗi khoảng để suy ra dấu của phân thức.

**Bước 4.** Chọn các khoảng làm phân thức không âm, chú ý nghiệm của tử thì lấy (vì dấu bằng) còn nghiệm của mẫu thì loại.

**Chú ý:** Nhân hai vế với $x-1$ khi chưa biết dấu của nó là lỗi hay gặp: với $x-1<0$ phải đổi chiều bất đẳng thức, bỏ sót là sai nghiệm.

**Phần 2. Trình bày**

ĐKXĐ: $x\ne1$.

$\dfrac{1-5x}{x-1}\ge1\Leftrightarrow\dfrac{1-5x}{x-1}-1\ge0$

$\Leftrightarrow\dfrac{1-5x-(x-1)}{x-1}\ge0$

$\Leftrightarrow\dfrac{2-6x}{x-1}\ge0\Leftrightarrow\dfrac{1-3x}{x-1}\ge0$

Nghiệm của tử: $1-3x=0\Leftrightarrow x=\dfrac{1}{3}$; nghiệm của mẫu: $x=1$. Xét dấu phân thức:

Với $x<\dfrac{1}{3}$: $1-3x>0$ và $x-1<0$ nên phân thức âm (không thỏa).

Với $x=\dfrac{1}{3}$: phân thức bằng $0$ (thỏa).

Với $\dfrac{1}{3}<x<1$: $1-3x<0$ và $x-1<0$ nên phân thức dương (thỏa).

Với $x>1$: $1-3x<0$ và $x-1>0$ nên phân thức âm (không thỏa).

Vậy nghiệm của bất phương trình là $\dfrac{1}{3}\le x<1$.

=== T6V4.2@p130
- bai: 2 · y: - · trang: 130 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bảng xét dấu nhiều nhị thức
- kiem: khong
- ket_qua_sach: -5<x<\dfrac{3}{4}; x>7
- dap_an: $-5<x<\dfrac{3}{4}$ hoặc $x>7$
- ghi_chu_nghi: Máy thử lưới x trong [-12;12] bước 1/60 (bỏ x làm mẫu bằng 0): tập nghiệm đúng là (-5;3/4) và (7;+∞), khớp sách.
## DE
Giải bất phương trình: $\dfrac{x+5}{(x-7)(3-4x)}<0$.
## SACH
$x+5$ có nghiệm $x=-5$; $x-7$ có nghiệm $x=7$; $3-4x$ có nghiệm $x=\dfrac{3}{4}$.

Ta có bảng xét dấu:

| x | | −5 | | $\dfrac{3}{4}$ | | 7 | |
|---|---|---|---|---|---|---|---|
| $x+5$ | − | 0 | + | | + | | + |
| $x-7$ | − | | − | | − | 0 | + |
| $3-4x$ | + | | + | 0 | − | | − |
| Thương | + | 0 | − | ‖ | + | ‖ | − |

Kết quả: $-5<x<\dfrac{3}{4}$ hoặc $x>7$.

(Hình biểu diễn trên trục số với các điểm $-5$; $\dfrac{3}{4}$; $7$.)

Chú ý: Dấu ‖ chỉ rằng tại các giá trị $\dfrac{3}{4}$; $7$ thì thương không xác định.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là thương của các nhị thức bậc nhất và so với $0$, nên dấu của nó chỉ phụ thuộc dấu từng nhị thức; chỉ cần lập bảng xét dấu qua ba nghiệm của tử và mẫu.

**Bước 1.** Tìm nghiệm của từng nhị thức ở tử và ở mẫu, các nghiệm của mẫu cũng chính là giá trị bị loại khỏi tập nghiệm.

**Bước 2.** Sắp ba nghiệm theo thứ tự tăng trên trục số để chia thành bốn khoảng rồi xét dấu từng nhị thức trên mỗi khoảng.

**Bước 3.** Nhân dấu các nhị thức để biết dấu của thương trên mỗi khoảng, rồi chọn những khoảng mang dấu âm.

**Chú ý:** Bất phương trình là "$<0$" (chặt) nên nghiệm của tử $x=-5$ cũng bị loại; các khoảng lấy dạng khoảng mở.

**Phần 2. Trình bày**

ĐKXĐ: $x\ne7$ và $x\ne\dfrac{3}{4}$.

$x+5=0\Leftrightarrow x=-5$; $x-7=0\Leftrightarrow x=7$; $3-4x=0\Leftrightarrow x=\dfrac{3}{4}$ và $-5<\dfrac{3}{4}<7$.

Với $x<-5$: $x+5<0$, $x-7<0$, $3-4x>0$ nên mẫu $(x-7)(3-4x)<0$, thương dương (không thỏa).

Với $-5<x<\dfrac{3}{4}$: $x+5>0$, $x-7<0$, $3-4x>0$ nên mẫu âm, thương âm (thỏa).

Với $\dfrac{3}{4}<x<7$: $x+5>0$, $x-7<0$, $3-4x<0$ nên mẫu dương, thương dương (không thỏa).

Với $x>7$: $x+5>0$, $x-7>0$, $3-4x<0$ nên mẫu âm, thương âm (thỏa).

Tại $x=-5$ thương bằng $0$ nên không thỏa $<0$.

Vậy nghiệm của bất phương trình là $-5<x<\dfrac{3}{4}$ hoặc $x>7$.

=== T6V4.3@p131
- bai: 3 · y: - · trang: 131 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bảng xét dấu · chuyển vế quy đồng
- kiem: khong
- ket_qua_sach: x<-\dfrac{3}{2}; 0<x<\dfrac{3}{5}
- dap_an: $x<-\dfrac{3}{2}$ hoặc $0<x<\dfrac{3}{5}$
- ghi_chu_nghi: Máy thử lưới x trong [-12;12] bước 1/60: khớp sách.
## DE
Giải bất phương trình: $\dfrac{1}{3-5x}>\dfrac{1}{2x+3}$.
## SACH
$(1)\Leftrightarrow\dfrac{1}{3-5x}-\dfrac{1}{2x+3}>0$. Quy đồng mẫu thức, ta có:

$\dfrac{(2x+3)-(3-5x)}{(3-5x)(2x+3)}>0\Leftrightarrow\dfrac{7x}{(3-5x)(2x+3)}>0$

Lập bảng:

| x | | $-\dfrac{3}{2}$ | | 0 | | $\dfrac{3}{5}$ | |
|---|---|---|---|---|---|---|---|
| $7x$ | − | | − | 0 | + | | + |
| $3-5x$ | + | | + | | + | 0 | − |
| $2x+3$ | − | 0 | + | 0 | + | | + |
| Thương | + | ‖ | − | 0 | + | ‖ | − |

Kết quả: $x<-\dfrac{3}{2}$ hoặc $0<x<\dfrac{3}{5}$.

(Hình biểu diễn trên trục số với các điểm $-\dfrac{3}{2}$; $0$; $\dfrac{3}{5}$.)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai vế đều là phân thức mà mẫu có thể trái dấu nhau, nên không nhân chéo; chuyển vế, quy đồng sẽ làm tử rút gọn thành một đơn thức $7x$, chỉ còn xét dấu ba nhị thức.

**Bước 1.** Tìm điều kiện xác định của hai phân thức để biết các giá trị phải loại ra khỏi tập nghiệm.

**Bước 2.** Chuyển vế phải sang trái và quy đồng, trừ hai tử để được tử gọn là $7x$, bất phương trình so với $0$.

**Bước 3.** Lấy nghiệm của ba nhị thức $7x$, $3-5x$, $2x+3$ chia trục số thành bốn khoảng rồi xét dấu thương trên từng khoảng.

**Bước 4.** Chọn các khoảng thương dương, không lấy các nghiệm vì đây là bất phương trình chặt.

**Phần 2. Trình bày**

ĐKXĐ: $x\ne\dfrac{3}{5}$ và $x\ne-\dfrac{3}{2}$.

$\dfrac{1}{3-5x}>\dfrac{1}{2x+3}\Leftrightarrow\dfrac{1}{3-5x}-\dfrac{1}{2x+3}>0$

$\Leftrightarrow\dfrac{(2x+3)-(3-5x)}{(3-5x)(2x+3)}>0\Leftrightarrow\dfrac{7x}{(3-5x)(2x+3)}>0$

Nghiệm của các nhị thức: $7x=0\Leftrightarrow x=0$; $3-5x=0\Leftrightarrow x=\dfrac{3}{5}$; $2x+3=0\Leftrightarrow x=-\dfrac{3}{2}$, và $-\dfrac{3}{2}<0<\dfrac{3}{5}$.

Với $x<-\dfrac{3}{2}$: $7x<0$, $3-5x>0$, $2x+3<0$ nên mẫu âm, thương dương (thỏa).

Với $-\dfrac{3}{2}<x<0$: $7x<0$, mẫu dương nên thương âm (không thỏa).

Với $0<x<\dfrac{3}{5}$: $7x>0$, mẫu dương nên thương dương (thỏa).

Với $x>\dfrac{3}{5}$: $7x>0$, $3-5x<0$, $2x+3>0$ nên mẫu âm, thương âm (không thỏa).

Vậy nghiệm của bất phương trình là $x<-\dfrac{3}{2}$ hoặc $0<x<\dfrac{3}{5}$.

=== T6V5.1@p131
- bai: 1 · y: - · trang: 131 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hằng đẳng thức bình phương · bất phương trình chứa giá trị tuyệt đối dạng |A|<k
- kiem: khong
- ket_qua_sach: -2<x<4
- dap_an: $-2<x<4$
- ghi_chu_nghi: Nhãn "Ví dụ 1" bị logo che một phần; dựng theo thứ tự. Máy thử lưới: khớp sách.
## DE
Giải bất phương trình: $x^2-2x+1<9$.
## SACH
Cách 1. $x^2-2x+1<9\Leftrightarrow(x-1)^2<9\Leftrightarrow\lvert x-1\rvert<3\Leftrightarrow-3<x-1<3\Leftrightarrow-2<x<4$.

Cách 2. Biến đổi thành bất phương trình dạng tích:

$x^2-2x-8<0\Leftrightarrow(x+2)(x-4)<0$.

Lập bảng xét dấu các nhị thức $x+2$ và $x-4$:

| x | | −2 | | 4 | |
|---|---|---|---|---|---|
| $x+2$ | − | 0 | + | | + |
| $x-4$ | − | | − | 0 | + |
| $(x+2)(x-4)$ | + | 0 | − | 0 | + |

Nghiệm của bất phương trình là $-2<x<4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái $x^2-2x+1$ là bình phương của $x-1$ và vế phải $9=3^2$ cũng là bình phương của một số, nên so sánh hai bình phương bằng cách chuyển sang giá trị tuyệt đối.

**Bước 1.** Nhận ra vế trái là hằng đẳng thức rồi viết gọn thành $(x-1)^2$ để bất phương trình có dạng bình phương nhỏ hơn bình phương.

**Bước 2.** Khai căn hai vế (hai vế không âm) bằng cách dùng $A^2<k^2\Leftrightarrow\lvert A\rvert<k$ với $k>0$.

**Bước 3.** Tách giá trị tuyệt đối thành hai bất đẳng thức cùng lúc rồi cộng $1$ vào để tìm $x$.

**Chú ý:** Có thể chuyển $9$ sang trái được $(x+2)(x-4)<0$ rồi lập bảng xét dấu hai nhị thức; hai cách cho cùng một tập nghiệm.

**Phần 2. Trình bày**

$x^2-2x+1<9\Leftrightarrow(x-1)^2<9$

$\Leftrightarrow\lvert x-1\rvert<3$

$\Leftrightarrow-3<x-1<3$

$\Leftrightarrow-2<x<4$

Vậy nghiệm của bất phương trình là $-2<x<4$.

=== T6V5.2@p132
- bai: 2 · y: - · trang: 132 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bảng xét dấu tích nhiều nhị thức
- kiem: khong
- ket_qua_sach: -\dfrac{1}{2}<x<1; x>\dfrac{3}{2}
- dap_an: $-\dfrac{1}{2}<x<1$ hoặc $x>\dfrac{3}{2}$
- ghi_chu_nghi: Nhãn "Ví dụ 2" và chữ "Ta lập" bị mép/logo che, tự bù. Máy thử lưới: khớp sách.
## DE
Giải bất phương trình: $(2x+1)(3-2x)(1-x)>0$.
## SACH
Ta lập bảng xét dấu: $2x+1$ có nghiệm $x=-\dfrac{1}{2}$; $3-2x$ có nghiệm $x=\dfrac{3}{2}$; $1-x$ có nghiệm $x=1$.

| x | | $-\dfrac{1}{2}$ | | 1 | | $\dfrac{3}{2}$ | |
|---|---|---|---|---|---|---|---|
| $2x+1$ | − | 0 | + | | + | | + |
| $3-2x$ | + | | + | | + | 0 | − |
| $1-x$ | + | | + | 0 | − | | − |
| Tích số | − | 0 | + | 0 | − | 0 | + |

Vậy tập hợp nghiệm của bất phương trình là hai khoảng: $-\dfrac{1}{2}<x<1$; $x>\dfrac{3}{2}$.

Biểu diễn trên trục số: (hình các điểm $-\dfrac{1}{2}$; $1$; $\dfrac{3}{2}$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái đã là tích của ba nhị thức bậc nhất và so với $0$, nên chỉ cần dấu của từng nhị thức; lập bảng xét dấu qua ba nghiệm là xong.

**Bước 1.** Tìm nghiệm của từng nhị thức rồi sắp ba nghiệm theo thứ tự tăng để chia trục số thành bốn khoảng.

**Bước 2.** Xét dấu từng thừa số trên mỗi khoảng (hệ số của $x$ âm thì dấu đổi ngược lại) rồi nhân dấu để được dấu của tích.

**Bước 3.** Chọn các khoảng tích dương và loại các nghiệm vì bất phương trình là chặt.

**Phần 2. Trình bày**

$2x+1=0\Leftrightarrow x=-\dfrac{1}{2}$; $3-2x=0\Leftrightarrow x=\dfrac{3}{2}$; $1-x=0\Leftrightarrow x=1$ và $-\dfrac{1}{2}<1<\dfrac{3}{2}$.

Với $x<-\dfrac{1}{2}$: $2x+1<0$, $3-2x>0$, $1-x>0$ nên tích âm (không thỏa).

Với $-\dfrac{1}{2}<x<1$: cả ba thừa số dương nên tích dương (thỏa).

Với $1<x<\dfrac{3}{2}$: $2x+1>0$, $3-2x>0$, $1-x<0$ nên tích âm (không thỏa).

Với $x>\dfrac{3}{2}$: $2x+1>0$, $3-2x<0$, $1-x<0$ nên tích dương (thỏa).

Vậy nghiệm của bất phương trình là $-\dfrac{1}{2}<x<1$ hoặc $x>\dfrac{3}{2}$.

=== T6V5.3@p132
- bai: 3 · y: - · trang: 132 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phân tích nhân tử · bảng xét dấu
- kiem: khong
- ket_qua_sach: 2<x<3
- dap_an: $2<x<3$
- ghi_chu_nghi: Nhãn "Ví dụ 3", chữ "Ta có" và cột đầu bảng bị mép trang che, tự bù. Máy thử lưới: khớp sách.
## DE
Giải bất phương trình: $x^2-5x+6<0$.
## SACH
$x^2-5x+6=(x-2)(x-3)$. Vậy $(1)\Leftrightarrow(x-2)(x-3)<0$.

Ta có bảng:

| x | | 2 | | 3 | |
|---|---|---|---|---|---|
| $x-2$ | − | 0 | + | | + |
| $x-3$ | − | | − | 0 | + |
| Tích | + | 0 | − | 0 | + |

Kết quả: nghiệm của (1) là $2<x<3$.

(Hình biểu diễn trên trục số với các điểm $2$; $3$.)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tam thức bậc hai có thể phân tích thành tích hai nhị thức bậc nhất, nên bất phương trình trở thành "tích nhỏ hơn $0$" và giải bằng bảng xét dấu.

**Bước 1.** Phân tích $x^2-5x+6$ thành nhân tử bằng cách tách $-5x=-2x-3x$ để nhóm hạng tử.

**Bước 2.** Tìm nghiệm của hai nhị thức rồi chia trục số thành ba khoảng và xét dấu từng thừa số.

**Bước 3.** Chọn khoảng mà hai thừa số trái dấu, tức tích âm, không lấy hai nghiệm.

**Phần 2. Trình bày**

$x^2-5x+6=x^2-2x-3x+6=(x-2)(x-3)$

Bất phương trình $\Leftrightarrow(x-2)(x-3)<0$.

Với $x<2$: $x-2<0$ và $x-3<0$ nên tích dương (không thỏa).

Với $2<x<3$: $x-2>0$ và $x-3<0$ nên tích âm (thỏa).

Với $x>3$: cả hai thừa số dương nên tích dương (không thỏa).

Tại $x=2$ và $x=3$ tích bằng $0$ nên không thỏa $<0$.

Vậy nghiệm của bất phương trình là $2<x<3$.

=== T6V6.1@p133
- bai: 1 · y: - · trang: 133 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng các bình phương bằng 0 · hằng đẳng thức bình phương
- kiem: khong
- ket_qua_sach: x=y=z=0
- dap_an: $S=\{(0;0;0)\}$, tức $x=y=z=0$
- ghi_chu_nghi: Đề trong sách nằm ở "Dạng 6 — bất phương trình dạng khác" nhưng ví dụ yêu cầu GIẢI PHƯƠNG TRÌNH ba ẩn. Máy vét số nguyên |x|,|y|,|z|≤6 chỉ có (0;0;0).
## DE
Giải phương trình: $x^2+y^2+z^2=x(y+z)$.
## SACH
Trước hết chứng minh rằng: $x^2+y^2+z^2\ge xy+xz$ (1)

Bất đẳng thức (1) tương đương với:

$2x^2+2y^2+2z^2-2xy-2xz\ge0\Leftrightarrow(x-y)^2+(x-z)^2+y^2+z^2\ge0$ (2)

Xảy ra đẳng thức (2), tức là ở (1), khi và chỉ khi $x=y=z=0$. Đó là nghiệm của phương trình.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Một phương trình ba ẩn không giải bằng cách rút ẩn; dấu hiệu là có các bình phương $x^2,y^2,z^2$, nên đưa vế về tổng các bình phương rồi dùng "tổng các số không âm bằng $0$ thì từng số bằng $0$".

**Bước 1.** Chuyển hết sang một vế và nhân hai lên để các hạng tử $2xy$, $2xz$ xuất hiện, sẵn sàng ghép thành hằng đẳng thức.

**Bước 2.** Ghép các hạng tử thành các bình phương $(x-y)^2$, $(x-z)^2$ và các bình phương còn lại $y^2$, $z^2$.

**Bước 3.** Vì mỗi bình phương không âm nên tổng bằng $0$ chỉ khi từng bình phương bằng $0$, từ đó suy ra các ẩn.

**Chú ý:** Cách làm của sách là chứng minh $x^2+y^2+z^2\ge xy+xz$ rồi chỉ ra khi nào dấu "=" xảy ra; bản chất là một.

**Phần 2. Trình bày**

$x^2+y^2+z^2=x(y+z)\Leftrightarrow2x^2+2y^2+2z^2-2xy-2xz=0$

$\Leftrightarrow(x-y)^2+(x-z)^2+y^2+z^2=0$

Vì $(x-y)^2\ge0$, $(x-z)^2\ge0$, $y^2\ge0$, $z^2\ge0$ nên đẳng thức xảy ra khi và chỉ khi

$\begin{cases}x-y=0\\x-z=0\\y=0\\z=0\end{cases}\Leftrightarrow x=y=z=0$

Vậy phương trình có nghiệm duy nhất $(x;y;z)=(0;0;0)$.

=== T6V6.2@p133
- bai: 2 · y: - · trang: 133 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phần nguyên: [a]=n ⇔ n≤a<n+1 (n nguyên) · bất phương trình kép
- kiem: khong
- ket_qua_sach: -2
- dap_an: $x=-2$
- ghi_chu_nghi: Máy quét số nguyên n trong [-200;200] cho [(3n-5)/7]=n chỉ có n=-2, khớp sách.
## DE
Kí hiệu $[a]$ (phần nguyên của $a$) là số nguyên lớn nhất không vượt quá $a$. Tìm $x$ biết rằng: $\left[\dfrac{3x-5}{7}\right]=x$.
## SACH
Theo đề bài, $x$ là số nguyên lớn nhất không vượt quá $\dfrac{3x-5}{7}$.

Do đó $\left[\dfrac{3x-5}{7}\right]=x\Leftrightarrow\begin{cases}0\le\dfrac{3x-5}{7}-x<1&(1)\\x\in\mathbb Z&(2)\end{cases}$

Giải bất phương trình (1):

$0\le\dfrac{-4x-5}{7}<1\Leftrightarrow0\le-4x-5<7\Leftrightarrow5\le-4x<12\Leftrightarrow-\dfrac{5}{4}\ge x>-3$.

Theo (2), $x\in\mathbb Z$ do đó $x=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phần nguyên luôn là một số nguyên, nên vế phải $x$ phải là số nguyên; đồng thời $[a]=n$ nghĩa là $0\le a-n<1$, biến phương trình thành một bất phương trình kép.

**Bước 1.** Nhận xét vế trái là số nguyên nên $x$ nguyên, rồi viết định nghĩa phần nguyên với $n=x$ thành $0\le\dfrac{3x-5}{7}-x<1$.

**Bước 2.** Quy đồng, nhân cả ba vế với $7$ (số dương nên giữ chiều) và chia cho hệ số âm của $x$ (đảo chiều) để tìm khoảng chứa $x$.

**Bước 3.** Chọn trong khoảng đó các số nguyên rồi thử lại bằng định nghĩa phần nguyên.

**Chú ý:** Khi chia cả bất đẳng thức cho số âm thì phải đổi chiều, rất dễ nhầm ở bước này.

**Phần 2. Trình bày**

Vì $\left[\dfrac{3x-5}{7}\right]$ là số nguyên nên $x\in\mathbb Z$.

Theo định nghĩa phần nguyên: $\left[\dfrac{3x-5}{7}\right]=x\Leftrightarrow0\le\dfrac{3x-5}{7}-x<1$

$\Leftrightarrow0\le\dfrac{-4x-5}{7}<1$

$\Leftrightarrow0\le-4x-5<7$

$\Leftrightarrow5\le-4x<12$

$\Leftrightarrow-3<x\le-\dfrac{5}{4}$

Mà $x\in\mathbb Z$ nên $x=-2$.

Thử lại: $\dfrac{3\cdot(-2)-5}{7}=-\dfrac{11}{7}$ và $-2\le-\dfrac{11}{7}<-1$ nên $\left[-\dfrac{11}{7}\right]=-2$ (đúng).

Vậy $x=-2$.

=== T6V6.3@p133
- bai: 3 · y: - · trang: 133 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: quy đồng và rút gọn phân thức · xét dấu phân thức
- kiem: khong
- ket_qua_sach: A=\dfrac{2}{1-2x}; x<\dfrac{1}{2}, x\ne-1
- dap_an: $A=\dfrac{2}{1-2x}$ (với $x\ne\pm1$, $x\ne\dfrac{1}{2}$); $A>0\Leftrightarrow x<\dfrac{1}{2}$ và $x\ne-1$
- ghi_chu_nghi: Sách in đáp số câu b là "$x\ne-1<\dfrac{1}{2}$" (viết gộp, hiểu là $x<\dfrac{1}{2}$ và $x\ne-1$). Máy thử lưới x trong [-12;12] bước 1/60: A=2/(1-2x) đúng, A>0 đúng khi x<1/2 và x≠-1.
## DE
Cho biểu thức $A=\left(\dfrac{1}{1-x}+\dfrac{2}{x+1}-\dfrac{5-x}{1-x^2}\right):\dfrac{1-2x}{x^2-1}$. a) Rút gọn biểu thức $A$. b) Tìm $x$ để $A>0$.
## SACH
a. $A=\dfrac{2}{1-2x}$ với $x\ne\pm1$; $x\ne\dfrac{1}{2}$.

b. $A>0$ khi $x\ne-1<\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba phân thức trong ngoặc có mẫu $1-x$, $x+1$, $1-x^2=(1-x)(1+x)$ nên mẫu chung là $1-x^2$; sau khi rút gọn thì $A$ chỉ còn một phân thức nên xét dấu rất gọn.

**Bước 1.** Tìm điều kiện xác định gồm các mẫu khác $0$ và cả biểu thức chia khác $0$.

**Bước 2.** Quy đồng ba phân thức trong ngoặc với mẫu chung $1-x^2$ rồi cộng trừ các tử.

**Bước 3.** Đổi phép chia thành phép nhân với phân thức nghịch đảo, chú ý $x^2-1=-(1-x^2)$ để rút gọn.

**Bước 4.** Ở câu b, một phân thức dương khi tử và mẫu cùng dấu; tử là $2>0$ nên chỉ cần mẫu $1-2x>0$, rồi đối chiếu điều kiện xác định.

**Phần 2. Trình bày**

a) ĐKXĐ: $x\ne1$, $x\ne-1$, $x\ne\dfrac{1}{2}$.

$A=\left[\dfrac{1+x}{(1-x)(1+x)}+\dfrac{2(1-x)}{(1-x)(1+x)}-\dfrac{5-x}{(1-x)(1+x)}\right]:\dfrac{1-2x}{x^2-1}$

$=\dfrac{1+x+2-2x-5+x}{1-x^2}\cdot\dfrac{x^2-1}{1-2x}$

$=\dfrac{-2}{1-x^2}\cdot\dfrac{-(1-x^2)}{1-2x}$

$=\dfrac{2}{1-2x}$

b) $A>0\Leftrightarrow\dfrac{2}{1-2x}>0\Leftrightarrow1-2x>0\Leftrightarrow x<\dfrac{1}{2}$

Đối chiếu ĐKXĐ ($x=1$ và $x=\dfrac{1}{2}$ không nằm trong khoảng này; còn phải loại $x=-1$):

Vậy $A>0$ khi $x<\dfrac{1}{2}$ và $x\ne-1$.

=== T6V6.4@p133
- bai: 4 · y: - · trang: 133 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: quy đồng và rút gọn phân thức · xét dấu phân thức
- kiem: khong
- ket_qua_sach: B=-\dfrac{x+3}{x}; x>0, x\ne3
- dap_an: $B=-\dfrac{x+3}{x}$ (với $x\ne0$, $x\ne\pm3$); $B<-1\Leftrightarrow x>0$ và $x\ne3$
- ghi_chu_nghi: Máy thử lưới x trong [-12;12] bước 1/60: B=-(x+3)/x đúng, B<-1 đúng khi x>0 và x≠3, khớp sách.
## DE
Cho biểu thức $B=\left(\dfrac{1}{3}+\dfrac{3}{x^2-3x}\right):\left(\dfrac{x^2}{27-3x^2}+\dfrac{1}{x+3}\right)$. a) Rút gọn biểu thức $B$. b) Tìm $x$ để $B<-1$.
## SACH
a. $B=-\dfrac{x+3}{x}$ với $x\ne0$, $x\ne\pm3$.

b. $B<-1\Leftrightarrow\begin{cases}-\dfrac{x+3}{x}<-1\\x\ne0;\ x\ne\pm3\end{cases}\Leftrightarrow\begin{cases}-\dfrac{3}{x}<0\\x\ne\pm3\end{cases}\Leftrightarrow\begin{cases}x>0\\x\ne3\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi ngoặc là tổng hai phân thức có mẫu phân tích được ($x^2-3x=x(x-3)$, $27-3x^2=3(3-x)(3+x)$), nên phải phân tích mẫu thành nhân tử trước khi quy đồng; hai ngoặc sẽ cùng có tử $x^2-3x+9$ và triệt tiêu nhau.

**Bước 1.** Phân tích các mẫu thành nhân tử để tìm điều kiện xác định và mẫu chung của từng ngoặc.

**Bước 2.** Quy đồng và cộng hai phân thức trong mỗi ngoặc để được hai phân thức gọn, có cùng tử $x^2-3x+9$.

**Bước 3.** Chuyển phép chia thành phép nhân với phân thức nghịch đảo rồi rút gọn nhân tử chung.

**Bước 4.** Ở câu b, chuyển $-1$ sang trái, quy đồng để tử còn một hằng số, từ đó chỉ cần xét dấu của $x$, rồi đối chiếu điều kiện xác định.

**Chú ý:** Phải kiểm tra phân thức chia khác $0$: tử $x^2-3x+9=\left(x-\dfrac{3}{2}\right)^2+\dfrac{27}{4}>0$ nên không bao giờ bằng $0$.

**Phần 2. Trình bày**

a) ĐKXĐ: $x^2-3x\ne0$, $27-3x^2\ne0$, $x+3\ne0$, tức $x\ne0$, $x\ne3$, $x\ne-3$.

$\dfrac{1}{3}+\dfrac{3}{x^2-3x}=\dfrac{x(x-3)+9}{3x(x-3)}=\dfrac{x^2-3x+9}{3x(x-3)}$

$\dfrac{x^2}{27-3x^2}+\dfrac{1}{x+3}=\dfrac{x^2}{3(3-x)(3+x)}+\dfrac{3(3-x)}{3(3-x)(3+x)}=\dfrac{x^2-3x+9}{3(3-x)(3+x)}$

Vì $x^2-3x+9=\left(x-\dfrac{3}{2}\right)^2+\dfrac{27}{4}>0$ nên phân thức chia khác $0$ với mọi $x$ thuộc ĐKXĐ.

$B=\dfrac{x^2-3x+9}{3x(x-3)}\cdot\dfrac{3(3-x)(3+x)}{x^2-3x+9}$

$=\dfrac{(3-x)(3+x)}{x(x-3)}=-\dfrac{x+3}{x}$

b) $B<-1\Leftrightarrow-\dfrac{x+3}{x}+1<0\Leftrightarrow\dfrac{-x-3+x}{x}<0\Leftrightarrow-\dfrac{3}{x}<0\Leftrightarrow x>0$

Đối chiếu ĐKXĐ (loại $x=3$):

Vậy $B<-1$ khi $x>0$ và $x\ne3$.

=== T6V6.5@p134
- bai: 5 · y: - · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: giải phương trình chứa ẩn ở mẫu có tham số · chia trường hợp theo hệ số của x
- kiem: khong
- ket_qua_sach: m<1, m\ne-1
- dap_an: $m<1$ và $m\ne-1$
- ghi_chu_nghi: Chữ số ở tử phân thức của đề bị mờ ("n+1", mẫu "ι−1"): dựng lại là $\dfrac{m+1}{x-1}$ theo lời giải (đưa về $(1-m)x=2$ khớp). Máy thử m=k/4 trong [-6;6]: nghiệm dương đúng khi m<1, m≠-1.
## DE
Tìm giá trị của $m$ để nghiệm của phương trình sau là số dương: $\dfrac{m+1}{x-1}=1-m$.
## SACH
Điều kiện xác định: $x\ne1$. Đưa phương trình về dạng $(1-m)x=2$.

Nếu $m=1$, phương trình vô nghiệm.

Nếu $m\ne1$ thì $x=\dfrac{2}{1-m}$. Giải điều kiện $1+m\ne0$ được $m\ne-1$.

Nghiệm của phương trình là $x=\dfrac{2}{1-m}$ với $m\ne\pm1$.

Phương trình có nghiệm là số dương $\Leftrightarrow\begin{cases}m<1\\m\ne-1\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình có tham số $m$ và ẩn ở mẫu nên phải giải theo hai việc: khử mẫu rồi chia trường hợp theo hệ số của $x$, sau đó loại nghiệm làm mẫu bằng $0$; cuối cùng mới đặt điều kiện nghiệm dương.

**Bước 1.** Nêu điều kiện xác định $x\ne1$ rồi nhân chéo để đưa phương trình về dạng bậc nhất theo $x$.

**Bước 2.** Chia trường hợp theo hệ số của $x$: hệ số bằng $0$ thì xét có nghiệm hay vô nghiệm, hệ số khác $0$ thì rút $x$.

**Bước 3.** Với nghiệm tìm được, tìm giá trị $m$ làm nghiệm trùng giá trị bị loại $x=1$ rồi bỏ giá trị đó.

**Bước 4.** Đặt điều kiện nghiệm dương rồi kết hợp với điều kiện đã có để ra đáp số cho $m$.

**Phần 2. Trình bày**

ĐKXĐ: $x\ne1$.

$\dfrac{m+1}{x-1}=1-m\Leftrightarrow m+1=(1-m)(x-1)\Leftrightarrow(1-m)x=2$

Nếu $m=1$: phương trình thành $0x=2$, vô nghiệm.

Nếu $m\ne1$: $x=\dfrac{2}{1-m}$.

Nghiệm này phải thỏa $x\ne1$: $\dfrac{2}{1-m}\ne1\Leftrightarrow1-m\ne2\Leftrightarrow m\ne-1$ (với $m=-1$ thì $x=1$, bị loại, phương trình vô nghiệm).

Vậy phương trình có nghiệm $x=\dfrac{2}{1-m}$ khi $m\ne\pm1$.

Nghiệm dương: $\dfrac{2}{1-m}>0\Leftrightarrow1-m>0\Leftrightarrow m<1$.

Kết hợp $m\ne-1$: $m<1$ và $m\ne-1$.

=== T6B.1@p134
- bai: 1 · y: - · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: nhân hai vế với số dương · giải bất phương trình có tham số
- kiem: khong
- ket_qua_sach: x>-1
- dap_an: $x>-1$
- ghi_chu_nghi: Máy thử với a=5 và a=3/2 trên lưới x: bất phương trình đúng đúng khi x>-1.
## DE
Giải bất phương trình: $\dfrac{ax+1}{a-1}>\dfrac{ax-1}{a+1}$ với $a>1$.
## SACH
Nhân hai vế của bất phương trình với $(a-1)(a+1)>0$.

Đáp số: $x>-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a>1$ thì cả hai mẫu $a-1$ và $a+1$ đều dương, nên có thể nhân hai vế với tích hai mẫu mà không đổi chiều bất đẳng thức.

**Bước 1.** Kiểm tra dấu hai mẫu từ điều kiện $a>1$ để chắc rằng nhân với $(a-1)(a+1)$ là phép biến đổi tương đương.

**Bước 2.** Nhân hai vế rồi khai triển hai tích, chú ý các hạng tử $a^2x$ ở hai vế sẽ triệt tiêu nhau.

**Bước 3.** Rút gọn để được bất phương trình bậc nhất theo $x$ rồi chia cho hệ số dương $2a$.

**Phần 2. Trình bày**

Vì $a>1$ nên $a-1>0$ và $a+1>0$, suy ra $(a-1)(a+1)>0$. Nhân hai vế với số dương này:

$\dfrac{ax+1}{a-1}>\dfrac{ax-1}{a+1}\Leftrightarrow(ax+1)(a+1)>(ax-1)(a-1)$

$\Leftrightarrow a^2x+ax+a+1>a^2x-ax-a+1$

$\Leftrightarrow2ax+2a>0$

$\Leftrightarrow x+1>0$ (chia hai vế cho $2a>0$)

$\Leftrightarrow x>-1$

Vậy nghiệm của bất phương trình là $x>-1$.

=== T6B.2a@p134
- bai: 2 · y: a · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: phá giá trị tuyệt đối bằng cách chia khoảng
- kiem: khong
- ket_qua_sach: \dfrac{9}{4}; \dfrac{9}{2}
- dap_an: $S=\left\{\dfrac{9}{4};\dfrac{9}{2}\right\}$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: nghiệm đúng là 9/4 và 9/2, khớp sách.
## DE
Giải phương trình: $\lvert x\rvert-2\lvert x-2\rvert+3\lvert x-3\rvert=4$.
## SACH
$\dfrac{9}{4}$ và $\dfrac{9}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình có ba giá trị tuyệt đối đổi dấu tại $0$, $2$, $3$; muốn bỏ dấu tuyệt đối phải chia trục số thành các khoảng theo ba mốc này.

**Bước 1.** Xác định các mốc $0$, $2$, $3$ rồi chia thành bốn khoảng $x<0$, $0\le x<2$, $2\le x<3$, $x\ge3$.

**Bước 2.** Trên mỗi khoảng, bỏ dấu giá trị tuyệt đối theo dấu của biểu thức bên trong rồi giải phương trình bậc nhất nhận được.

**Bước 3.** Đối chiếu từng nghiệm với khoảng đang xét: nghiệm nằm ngoài khoảng thì loại, rồi hợp các nghiệm nhận.

**Phần 2. Trình bày**

Các biểu thức trong dấu giá trị tuyệt đối đổi dấu tại $x=0$, $x=2$, $x=3$.

Với $x<0$: $-x-2(2-x)+3(3-x)=4\Leftrightarrow-2x+5=4\Leftrightarrow x=\dfrac{1}{2}$ (loại, vì không thuộc khoảng $x<0$).

Với $0\le x<2$: $x-2(2-x)+3(3-x)=4\Leftrightarrow5=4$ (vô lý, không có nghiệm).

Với $2\le x<3$: $x-2(x-2)+3(3-x)=4\Leftrightarrow-4x+13=4\Leftrightarrow x=\dfrac{9}{4}$ (nhận).

Với $x\ge3$: $x-2(x-2)+3(x-3)=4\Leftrightarrow2x-5=4\Leftrightarrow x=\dfrac{9}{2}$ (nhận).

Vậy $S=\left\{\dfrac{9}{4};\dfrac{9}{2}\right\}$.

=== T6B.2b@p134
- bai: 2 · y: b · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: phá giá trị tuyệt đối bằng cách chia khoảng
- kiem: khong
- ket_qua_sach: -2
- dap_an: $S=\{-2\}$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: chỉ có x=-2, khớp sách.
## DE
Giải phương trình: $\lvert x\rvert-2\lvert x+1\rvert+3\lvert x+2\rvert=0$.
## SACH
b. $-2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba giá trị tuyệt đối đổi dấu tại $-2$, $-1$, $0$; muốn bỏ chúng phải chia trục số theo ba mốc đó và giải từng khoảng.

**Bước 1.** Sắp các mốc $-2<-1<0$ rồi chia thành bốn khoảng và ghi dấu của $x$, $x+1$, $x+2$ trên mỗi khoảng.

**Bước 2.** Bỏ dấu tuyệt đối theo dấu đã ghi rồi giải phương trình bậc nhất trong từng khoảng.

**Bước 3.** Chỉ nhận nghiệm thuộc đúng khoảng đang xét và gộp lại thành tập nghiệm.

**Phần 2. Trình bày**

Các biểu thức trong dấu giá trị tuyệt đối đổi dấu tại $x=-2$, $x=-1$, $x=0$.

Với $x<-2$: $-x+2(x+1)-3(x+2)=0\Leftrightarrow-2x-4=0\Leftrightarrow x=-2$ (loại, vì không thuộc khoảng $x<-2$).

Với $-2\le x<-1$: $-x+2(x+1)+3(x+2)=0\Leftrightarrow4x+8=0\Leftrightarrow x=-2$ (nhận).

Với $-1\le x<0$: $-x-2(x+1)+3(x+2)=0\Leftrightarrow4=0$ (vô lý, không có nghiệm).

Với $x\ge0$: $x-2(x+1)+3(x+2)=0\Leftrightarrow2x+4=0\Leftrightarrow x=-2$ (loại, vì không thuộc khoảng $x\ge0$).

Vậy $S=\{-2\}$.

=== T6B.2c@p134
- bai: 2 · y: c · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: phá giá trị tuyệt đối bằng cách chia khoảng · phương trình nghiệm đúng với mọi x trong một khoảng
- kiem: khong
- ket_qua_sach: x=4; 0\le x\le1
- dap_an: $0\le x\le1$ hoặc $x=4$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: tập nghiệm đúng là [0;1] và {4}, khớp sách.
## DE
Giải phương trình: $\lvert x\rvert-2\lvert x-1\rvert+3\lvert x-2\rvert=4$.
## SACH
c. $x=4$; $0\le x\le1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các mốc đổi dấu là $0$, $1$, $2$ nên chia bốn khoảng; chú ý ở một khoảng phương trình có thể rút gọn thành đẳng thức đúng, khi đó cả khoảng là nghiệm.

**Bước 1.** Chia trục số thành bốn khoảng theo các mốc $0$, $1$, $2$ rồi xét dấu từng biểu thức trong dấu tuyệt đối.

**Bước 2.** Bỏ dấu tuyệt đối và rút gọn phương trình trên mỗi khoảng, phân biệt ba kết quả: ra một nghiệm, vô lý, hoặc đẳng thức luôn đúng.

**Bước 3.** Đối chiếu nghiệm với khoảng đang xét rồi hợp các kết quả nhận được.

**Chú ý:** Khi một khoảng cho đẳng thức đúng thì nghiệm là cả khoảng đó, không phải một giá trị.

**Phần 2. Trình bày**

Các biểu thức trong dấu giá trị tuyệt đối đổi dấu tại $x=0$, $x=1$, $x=2$.

Với $x<0$: $-x-2(1-x)+3(2-x)=4\Leftrightarrow-2x+4=4\Leftrightarrow x=0$ (loại, vì không thuộc khoảng $x<0$).

Với $0\le x<1$: $x-2(1-x)+3(2-x)=4\Leftrightarrow4=4$ (luôn đúng, nên mọi $x$ thuộc $0\le x<1$ đều là nghiệm).

Với $1\le x<2$: $x-2(x-1)+3(2-x)=4\Leftrightarrow-4x+8=4\Leftrightarrow x=1$ (nhận).

Với $x\ge2$: $x-2(x-1)+3(x-2)=4\Leftrightarrow2x-4=4\Leftrightarrow x=4$ (nhận).

Vậy nghiệm của phương trình là $0\le x\le1$ hoặc $x=4$.

=== T6B.2d@p134
- bai: 2 · y: d · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: vế trái không âm nên vế phải không âm
- kiem: khong
- ket_qua_sach: 6
- dap_an: $S=\{6\}$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: chỉ có x=6, khớp sách.
## DE
Giải phương trình: $\lvert x+1\rvert+\lvert x+2\rvert+\lvert x+3\rvert=4x$.
## SACH
d. Không nên máy móc xét các khoảng giá trị của $x$. Chú ý rằng vế trái của phương trình không âm nên vế phải không âm, do đó $x\ge0$. Phương trình trở thành $x+1+x+2+x+3=4x$. Từ đó $x=6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tổng ba giá trị tuyệt đối nên không âm, kéo theo vế phải $4x\ge0$; khi $x\ge0$ cả ba biểu thức trong dấu tuyệt đối đều dương nên bỏ dấu ngay mà không cần chia khoảng.

**Bước 1.** Nhận xét vế trái luôn không âm để suy ra điều kiện cho $x$ từ vế phải.

**Bước 2.** Với điều kiện đó, chứng tỏ $x+1$, $x+2$, $x+3$ đều dương rồi bỏ dấu giá trị tuyệt đối.

**Bước 3.** Giải phương trình bậc nhất còn lại và đối chiếu nghiệm với điều kiện đã tìm.

**Phần 2. Trình bày**

Vế trái $\lvert x+1\rvert+\lvert x+2\rvert+\lvert x+3\rvert\ge0$ nên $4x\ge0$, tức $x\ge0$.

Khi $x\ge0$ thì $x+1>0$, $x+2>0$, $x+3>0$ nên phương trình trở thành

$x+1+x+2+x+3=4x\Leftrightarrow3x+6=4x\Leftrightarrow x=6$

Nghiệm $x=6$ thỏa $x\ge0$ (nhận).

Vậy $S=\{6\}$.

=== T6B.3a@p134
- bai: 3 · y: a · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: biểu thức luôn dương nên bỏ giá trị tuyệt đối · chia khoảng
- kiem: khong
- ket_qua_sach: 1
- dap_an: $S=\{1\}$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: chỉ có x=1, khớp sách.
## DE
Giải phương trình: $x\lvert x+3\rvert-\lvert x^2+x+1\rvert=1$.
## SACH
3. a. Chú ý rằng $x^2+x+1>0$. Đáp số $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức $x^2+x+1$ luôn dương (đưa về bình phương cộng một số dương) nên giá trị tuyệt đối thứ hai bỏ được ngay; chỉ còn giá trị tuyệt đối $\lvert x+3\rvert$ cần chia hai trường hợp.

**Bước 1.** Chứng tỏ $x^2+x+1>0$ bằng cách viết thành bình phương một tổng cộng một số dương để bỏ dấu giá trị tuyệt đối thứ hai.

**Bước 2.** Chuyển phương trình về dạng $x\lvert x+3\rvert=x^2+x+2$ rồi chia hai trường hợp $x\ge-3$ và $x<-3$ theo dấu của $x+3$.

**Bước 3.** Giải từng trường hợp, đối chiếu với điều kiện của trường hợp đó rồi kết luận.

**Phần 2. Trình bày**

Ta có $x^2+x+1=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ nên $\lvert x^2+x+1\rvert=x^2+x+1$.

Phương trình $\Leftrightarrow x\lvert x+3\rvert=x^2+x+2$.

Với $x\ge-3$: $x(x+3)=x^2+x+2\Leftrightarrow2x=2\Leftrightarrow x=1$ (nhận).

Với $x<-3$: $-x(x+3)=x^2+x+2\Leftrightarrow2x^2+4x+2=0\Leftrightarrow2(x+1)^2=0\Leftrightarrow x=-1$ (loại, vì không thuộc khoảng $x<-3$).

Vậy $S=\{1\}$.

=== T6B.3b@p134
- bai: 3 · y: b · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y=|x| · phân tích nhân tử đa thức bậc ba
- kiem: khong
- ket_qua_sach: x=\pm1
- dap_an: $S=\{-1;1\}$
- ghi_chu_nghi: Máy quét hữu tỉ trên [-12;12] bước 1/60: chỉ có x=±1, khớp sách.
## DE
Giải phương trình: $\lvert x\rvert^3-3\lvert x\rvert+2=0$.
## SACH
b. Đặt $y=\lvert x\rvert>0$. Đáp số $x=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình chỉ chứa $x$ qua $\lvert x\rvert$, nên đặt $y=\lvert x\rvert$ để được phương trình bậc ba theo $y$, nhớ điều kiện $y\ge0$.

**Bước 1.** Đặt $y=\lvert x\rvert$ với $y\ge0$ để phương trình trở thành $y^3-3y+2=0$.

**Bước 2.** Nhẩm nghiệm $y=1$ rồi phân tích $y^3-3y+2$ thành nhân tử bằng cách nhóm hạng tử.

**Bước 3.** Loại nghiệm âm của $y$, rồi quay về $x$ qua $\lvert x\rvert=y$.

**Phần 2. Trình bày**

Đặt $y=\lvert x\rvert$, $y\ge0$. Phương trình trở thành $y^3-3y+2=0$.

$y^3-3y+2=(y^3-y)-(2y-2)=(y-1)(y^2+y-2)=(y-1)^2(y+2)$

$(y-1)^2(y+2)=0\Leftrightarrow y=1$ hoặc $y=-2$.

$y=-2$ bị loại vì $y\ge0$; $y=1$ nhận.

$\lvert x\rvert=1\Leftrightarrow x=\pm1$.

Vậy $S=\{-1;1\}$.

=== T6B.4a@p134
- bai: 4 · y: a · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử rút gọn phân thức · xét dấu phân thức
- kiem: khong
- ket_qua_sach: A=\dfrac{1}{x+2}; x>-2, x\ne2
- dap_an: $A=\dfrac{1}{x+2}$ (với $x\ne\pm2$); $A>0\Leftrightarrow x>-2$ và $x\ne2$
- ghi_chu_nghi: Sách ghi điều kiện của A chỉ "x≠2" (thiếu x≠-2, do mẫu $(x-2)^2(x+2)$); lời giải kho ghi đủ. Máy thử lưới: A=1/(x+2) đúng, A>0 đúng khi x>-2, x≠2.
## DE
Rút gọn biểu thức rồi tìm giá trị của biến để biểu thức có giá trị dương: $A=\dfrac{x^2-4x+4}{x^3-2x^2-4x+8}$.
## SACH
4. a) $A=\dfrac{1}{x+2}$ với $x\ne2$

$A>0\Leftrightarrow\dfrac{1}{x+2}>0$ và $x\ne2\Leftrightarrow x>-2$ và $x\ne2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là bình phương $(x-2)^2$ và mẫu bậc ba có thể nhóm hạng tử để xuất hiện nhân tử $x-2$, nên phân tích cả hai thành nhân tử rồi rút gọn; phân thức còn lại dương khi mẫu dương.

**Bước 1.** Phân tích mẫu bằng cách nhóm hạng tử để tìm điều kiện xác định, tử là hằng đẳng thức bình phương.

**Bước 2.** Rút gọn nhân tử chung $(x-2)^2$ để được phân thức gọn có tử là hằng số.

**Bước 3.** Cho phân thức rút gọn lớn hơn $0$ (tử dương nên mẫu dương) rồi đối chiếu điều kiện xác định để bỏ các giá trị bị loại.

**Phần 2. Trình bày**

$x^3-2x^2-4x+8=x^2(x-2)-4(x-2)=(x-2)(x^2-4)=(x-2)^2(x+2)$

ĐKXĐ: $(x-2)^2(x+2)\ne0$, tức $x\ne2$ và $x\ne-2$.

$A=\dfrac{(x-2)^2}{(x-2)^2(x+2)}=\dfrac{1}{x+2}$

$A>0\Leftrightarrow\dfrac{1}{x+2}>0\Leftrightarrow x+2>0\Leftrightarrow x>-2$

Kết hợp ĐKXĐ: $x>-2$ và $x\ne2$.

Vậy $A=\dfrac{1}{x+2}$ và $A>0$ khi $x>-2$, $x\ne2$.

=== T6B.4b@p134
- bai: 4 · y: b · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử rút gọn phân thức · hằng đẳng thức hiệu và tổng hai lập phương · xét dấu phân thức
- kiem: khong
- ket_qua_sach: B=-\dfrac{1}{x+2}; x>-2, x\ne2
- dap_an: $B=-\dfrac{1}{x+2}$ (với $x\ne\pm2$); $B<0\Leftrightarrow x>-2$ và $x\ne2$
- ghi_chu_nghi: Sách ghi điều kiện của B chỉ "x≠2" (thiếu x≠-2); lời giải kho ghi đủ. Máy thử lưới: B=-1/(x+2) đúng, B<0 đúng khi x>-2, x≠2. Dấu nhân giữa hai phân thức in là dấu chấm, chép thành \cdot.
## DE
Rút gọn biểu thức rồi tìm giá trị của biến để biểu thức có giá trị âm: $B=\left(\dfrac{x}{x+2}-\dfrac{x^3-8}{x^3+8}\cdot\dfrac{x^2-2x+4}{x^2-4}\right):\dfrac{4}{x+2}$.
## SACH
b) $B=-\dfrac{1}{x+2}$ với $x\ne2$. $B<0\Leftrightarrow x>-2$; $x\ne2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có $x^3-8$, $x^3+8$ và $x^2-4$ nên dùng hằng đẳng thức hiệu, tổng hai lập phương và hiệu hai bình phương để phân tích mọi mẫu và tử, từ đó tích hai phân thức rút gọn mạnh.

**Bước 1.** Phân tích các đa thức thành nhân tử và tìm điều kiện xác định (chú ý $x^2-2x+4$ luôn dương).

**Bước 2.** Nhân hai phân thức rồi rút gọn nhân tử chung, sau đó trừ phân thức $\dfrac{x}{x+2}$ bằng cách quy đồng với mẫu $(x+2)^2$.

**Bước 3.** Đổi phép chia thành nhân với nghịch đảo để rút gọn ra $B$.

**Bước 4.** Cho $B<0$, tử là hằng số âm nên mẫu $x+2$ phải dương; rồi đối chiếu điều kiện xác định.

**Phần 2. Trình bày**

$x^3-8=(x-2)(x^2+2x+4)$, $x^3+8=(x+2)(x^2-2x+4)$, $x^2-4=(x-2)(x+2)$, và $x^2-2x+4=(x-1)^2+3>0$.

ĐKXĐ: $x\ne-2$ và $x\ne2$.

$\dfrac{x^3-8}{x^3+8}\cdot\dfrac{x^2-2x+4}{x^2-4}=\dfrac{(x-2)(x^2+2x+4)}{(x+2)(x^2-2x+4)}\cdot\dfrac{x^2-2x+4}{(x-2)(x+2)}=\dfrac{x^2+2x+4}{(x+2)^2}$

$\dfrac{x}{x+2}-\dfrac{x^2+2x+4}{(x+2)^2}=\dfrac{x(x+2)-(x^2+2x+4)}{(x+2)^2}=\dfrac{-4}{(x+2)^2}$

$B=\dfrac{-4}{(x+2)^2}\cdot\dfrac{x+2}{4}=-\dfrac{1}{x+2}$

$B<0\Leftrightarrow\dfrac{1}{x+2}>0\Leftrightarrow x+2>0\Leftrightarrow x>-2$

Kết hợp ĐKXĐ: $x>-2$ và $x\ne2$.

Vậy $B=-\dfrac{1}{x+2}$ và $B<0$ khi $x>-2$, $x\ne2$.

=== T6B.5@p134
- bai: 5 · y: - · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: giải và biện luận bất phương trình bậc nhất theo hệ số của x
- kiem: khong
- ket_qua_sach: a>b: x>\dfrac{a+b}{a-b}; a<b: x<\dfrac{a+b}{a-b}; a=b: 0x>2b
- dap_an: $a>b$: $x>\dfrac{a+b}{a-b}$; $a<b$: $x<\dfrac{a+b}{a-b}$; $a=b$: nghiệm đúng với mọi $x$ nếu $b<0$, vô nghiệm nếu $b\ge0$
- ghi_chu_nghi: Máy thử lưới x với nhiều cặp (a;b), kể cả a=b: khớp.
## DE
Giải bất phương trình (với $a$, $b$ là các số cho trước): $ax-b>bx+a$.
## SACH
5. Nếu $a>b$ thì $x>\dfrac{a+b}{a-b}$.

Nếu $a<b$ thì $x<\dfrac{a+b}{a-b}$.

Nếu $a=b$ thì $0x>2b$, nghiệm đúng với mọi $x$ nếu $b<0$, vô nghiệm nếu $b\ge0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất phương trình có tham số $a$, $b$ nên sau khi gom $x$ về một vế được $(a-b)x>a+b$; kết quả phụ thuộc dấu của hệ số $a-b$ nên phải chia ba trường hợp.

**Bước 1.** Chuyển các hạng tử chứa $x$ sang một vế, các hạng tử còn lại sang vế kia rồi đặt $x$ làm nhân tử chung.

**Bước 2.** Chia trường hợp theo dấu của $a-b$: dương thì chia giữ chiều, âm thì chia và đổi chiều.

**Bước 3.** Với $a=b$ thì hệ số của $x$ bằng $0$; xét bất đẳng thức số $0>2b$ có đúng hay không để kết luận nghiệm.

**Chú ý:** Chia cho số âm thì đổi chiều bất đẳng thức; trường hợp hệ số bằng $0$ không được chia.

**Phần 2. Trình bày**

$ax-b>bx+a\Leftrightarrow ax-bx>a+b\Leftrightarrow(a-b)x>a+b$

Nếu $a>b$ thì $a-b>0$: $x>\dfrac{a+b}{a-b}$.

Nếu $a<b$ thì $a-b<0$: $x<\dfrac{a+b}{a-b}$ (đổi chiều).

Nếu $a=b$ thì bất phương trình thành $0x>2b$: nghiệm đúng với mọi $x$ khi $2b<0$, tức $b<0$; vô nghiệm khi $b\ge0$.

Vậy: $a>b$ thì $x>\dfrac{a+b}{a-b}$; $a<b$ thì $x<\dfrac{a+b}{a-b}$; $a=b$ thì nghiệm đúng với mọi $x$ nếu $b<0$, vô nghiệm nếu $b\ge0$.

=== T6B.6a@p134
- bai: 6 · y: a · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: giải hệ hai bất phương trình bậc nhất
- kiem: khong
- ket_qua_sach: 3<x<4
- dap_an: $x>4$
- ghi_chu_nghi: SÁCH NGHI SAI. Đề in cho x>3 (từ $2x+1>x+4$) và x>4 (từ $x+3<3x-5$), giao là x>4; sách đáp 3<x<4. Máy thử lưới x trong [-12;12] bước 1/60: với đề in chỉ đúng khi x>4, mọi x trong (3;4) đều sai. Số 1 ở vế trái bất phương trình đầu bị logo che một phần, đọc là "+1" (khớp x>3 của sách); nếu là "−1" thì giao là x>5.
## DE
Tìm các giá trị của $x$ thỏa mãn cả hai bất phương trình: $2x+1>x+4$ và $x+3<3x-5$.
## SACH
6. a) $3<x<4$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Thỏa mãn cả hai bất phương trình" nghĩa là lấy giao hai tập nghiệm, nên giải riêng từng bất phương trình rồi tìm phần chung trên trục số.

**Bước 1.** Giải bất phương trình thứ nhất bằng cách chuyển các hạng tử chứa $x$ sang một vế.

**Bước 2.** Giải bất phương trình thứ hai theo cùng cách, chú ý đổi vế để hệ số của $x$ dương cho dễ đọc.

**Bước 3.** Lấy phần chung của hai tập nghiệm trên trục số, tức điều kiện đồng thời thỏa cả hai.

**Phần 2. Trình bày**

**Chưa chắc:** Đáp số sách (3<x<4) lệch với đề in; lời giải theo đề như đọc được (dấu của số 1 ở bất phương trình đầu bị logo che, đọc là +1), cho x>4.

$2x+1>x+4\Leftrightarrow x>3$.

$x+3<3x-5\Leftrightarrow8<2x\Leftrightarrow x>4$.

Cả hai cùng đúng khi $x>3$ và $x>4$, tức $x>4$.

Vậy các giá trị cần tìm là $x>4$.

=== T6B.6b@p134
- bai: 6 · y: b · trang: 134 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: giải hệ hai bất phương trình bậc nhất
- kiem: khong
- ket_qua_sach: x>5
- dap_an: $x>5$
- ghi_chu_nghi: Số 1 ở vế trái bất phương trình đầu bị logo che một phần, đọc là "−1" ($3x-1>x+3$); với "+1" đáp số vẫn x>5. Máy thử lưới: x>5, khớp sách.
## DE
Tìm các giá trị của $x$ thỏa mãn cả hai bất phương trình: $3x-1>x+3$ và $4x+1<6x-9$.
## SACH
b) $x>5$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Thỏa mãn cả hai bất phương trình" nghĩa là lấy giao hai tập nghiệm, nên giải riêng từng bất phương trình rồi tìm phần chung.

**Bước 1.** Giải bất phương trình thứ nhất bằng cách chuyển các hạng tử chứa $x$ sang vế trái và số hạng tự do sang vế phải.

**Bước 2.** Giải bất phương trình thứ hai theo cách tương tự rồi chia hai vế cho hệ số dương của $x$.

**Bước 3.** Lấy phần chung của hai tập nghiệm: điều kiện lớn hơn trong hai điều kiện là điều kiện cuối cùng.

**Phần 2. Trình bày**

$3x-1>x+3\Leftrightarrow2x>4\Leftrightarrow x>2$.

$4x+1<6x-9\Leftrightarrow10<2x\Leftrightarrow x>5$.

Cả hai cùng đúng khi $x>2$ và $x>5$, tức $x>5$.

Vậy các giá trị cần tìm là $x>5$.

=== T6B.7a@p135
- bai: 7 · y: a · trang: 135 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phần nguyên: [a]=n ⇔ 0≤a-n<1 (n nguyên) · bất phương trình kép
- kiem: khong
- ket_qua_sach: 0
- dap_an: $x=0$
- ghi_chu_nghi: Máy quét hữu tỉ mẫu số 2520 trong [-3;3]: chỉ có x=0, khớp sách.
## DE
Kí hiệu $[a]$ là số nguyên lớn nhất không vượt quá $a$ (như vậy nếu $[a]=n$ thì $n$ là số nguyên và $0\le a-n<1$). Giải phương trình: $\left[\dfrac{3x+7}{12}\right]=x$.
## SACH
7. a) Giải bất phương trình $0\le\dfrac{3x+7}{12}-x<1$ với $x$ là số nguyên, ta được $-\dfrac{5}{9}<x\le\dfrac{7}{9}$; và $x\in\mathbb Z$, do đó $x=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phần nguyên là số nguyên nên $x$ nguyên; đồng thời $[a]=n$ nghĩa là $0\le a-n<1$, biến phương trình thành bất phương trình kép chứa $x$.

**Bước 1.** Nhận xét $x$ phải nguyên rồi viết điều kiện $0\le\dfrac{3x+7}{12}-x<1$ theo định nghĩa phần nguyên.

**Bước 2.** Quy đồng, nhân cả ba vế với $12$ rồi chia cho hệ số âm của $x$ (đổi chiều) để tìm khoảng chứa $x$.

**Bước 3.** Chọn số nguyên trong khoảng đó rồi thử lại bằng định nghĩa.

**Phần 2. Trình bày**

Vì $\left[\dfrac{3x+7}{12}\right]$ là số nguyên nên $x\in\mathbb Z$.

$\left[\dfrac{3x+7}{12}\right]=x\Leftrightarrow0\le\dfrac{3x+7}{12}-x<1$

$\Leftrightarrow0\le\dfrac{7-9x}{12}<1$

$\Leftrightarrow0\le7-9x<12$

$\Leftrightarrow-5<9x\le7$

$\Leftrightarrow-\dfrac{5}{9}<x\le\dfrac{7}{9}$

Mà $x\in\mathbb Z$ nên $x=0$.

Thử lại: $\left[\dfrac{7}{12}\right]=0$ (đúng).

Vậy $x=0$.

=== T6B.7b@p135
- bai: 7 · y: b · trang: 135 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: phần nguyên: [a]=n ⇔ 0≤a-n<1 (n nguyên) · bất phương trình kép
- kiem: khong
- ket_qua_sach: -1
- dap_an: $x=-1$
- ghi_chu_nghi: Máy quét hữu tỉ mẫu số 2520 trong [-3;3]: chỉ có x=-1, khớp sách.
## DE
Kí hiệu $[a]$ là số nguyên lớn nhất không vượt quá $a$ (như vậy nếu $[a]=n$ thì $n$ là số nguyên và $0\le a-n<1$). Giải phương trình: $\left[\dfrac{4x-1}{9}\right]=x$.
## SACH
b) $x=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phần nguyên là số nguyên nên $x$ nguyên; viết $[a]=n$ thành $0\le a-n<1$ để có bất phương trình kép chứa $x$.

**Bước 1.** Nhận xét $x$ phải nguyên rồi viết điều kiện $0\le\dfrac{4x-1}{9}-x<1$ theo định nghĩa phần nguyên.

**Bước 2.** Quy đồng, nhân cả ba vế với $9$ rồi chia cho hệ số âm của $x$ (đổi chiều) để tìm khoảng chứa $x$.

**Bước 3.** Chọn số nguyên trong khoảng đó rồi thử lại bằng định nghĩa.

**Phần 2. Trình bày**

Vì $\left[\dfrac{4x-1}{9}\right]$ là số nguyên nên $x\in\mathbb Z$.

$\left[\dfrac{4x-1}{9}\right]=x\Leftrightarrow0\le\dfrac{4x-1}{9}-x<1$

$\Leftrightarrow0\le\dfrac{-5x-1}{9}<1$

$\Leftrightarrow0\le-5x-1<9$

$\Leftrightarrow1\le-5x<10$

$\Leftrightarrow-2<x\le-\dfrac{1}{5}$

Mà $x\in\mathbb Z$ nên $x=-1$.

Thử lại: $\dfrac{4\cdot(-1)-1}{9}=-\dfrac{5}{9}$ và $-1\le-\dfrac{5}{9}<0$ nên $\left[-\dfrac{5}{9}\right]=-1$ (đúng).

Vậy $x=-1$.

=== T6B.7c@p135
- bai: 7 · y: c · trang: 135 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phần nguyên: [a]=n ⇔ 0≤a-n<1 (n nguyên) · bất phương trình kép
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $x=\dfrac{1}{2}$
- ghi_chu_nghi: Máy quét hữu tỉ mẫu số 2520 trong [-3;3]: chỉ có x=1/2, khớp sách.
## DE
Kí hiệu $[a]$ là số nguyên lớn nhất không vượt quá $a$ (như vậy nếu $[a]=n$ thì $n$ là số nguyên và $0\le a-n<1$). Giải phương trình: $\left[\dfrac{3x+1}{5}\right]=2x-1$.
## SACH
c) Giải bất phương trình: $0\le\dfrac{3x+1}{5}-(2x-1)<1$ (1) với $2x-1\in\mathbb Z$ (2)

Nghiệm của (1) là $\dfrac{1}{7}<x\le\dfrac{6}{7}$. Từ đó $-\dfrac{5}{7}<2x-1\le\dfrac{5}{7}$.

Do (2) nên $2x-1=0$. Vậy $x=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải $2x-1$ phải là số nguyên (vì bằng một phần nguyên), nên áp dụng $[a]=n$ với $n=2x-1$ rồi giải bất phương trình kép để thu hẹp $2x-1$ vào một khoảng nhỏ chỉ chứa một số nguyên.

**Bước 1.** Nhận xét $2x-1$ nguyên rồi viết điều kiện $0\le\dfrac{3x+1}{5}-(2x-1)<1$ theo định nghĩa phần nguyên.

**Bước 2.** Quy đồng, nhân cả ba vế với $5$ và chia cho hệ số âm của $x$ (đổi chiều) để tìm khoảng chứa $x$.

**Bước 3.** Từ khoảng của $x$ suy ra khoảng chứa $2x-1$, chọn số nguyên trong khoảng đó rồi tìm $x$ và thử lại.

**Phần 2. Trình bày**

Vì vế trái là số nguyên nên $2x-1\in\mathbb Z$.

$\left[\dfrac{3x+1}{5}\right]=2x-1\Leftrightarrow0\le\dfrac{3x+1}{5}-(2x-1)<1$

$\Leftrightarrow0\le\dfrac{6-7x}{5}<1$

$\Leftrightarrow0\le6-7x<5$

$\Leftrightarrow\dfrac{1}{7}<x\le\dfrac{6}{7}$

Suy ra $\dfrac{2}{7}<2x\le\dfrac{12}{7}$, tức $-\dfrac{5}{7}<2x-1\le\dfrac{5}{7}$.

Vì $2x-1$ là số nguyên nên $2x-1=0$, suy ra $x=\dfrac{1}{2}$.

Thử lại: với $x=\dfrac{1}{2}$ thì $3x+1=\dfrac{5}{2}$ nên $\dfrac{3x+1}{5}=\dfrac{1}{2}$ và $0\le\dfrac{1}{2}<1$, vế trái bằng $0$; vế phải $2x-1=0$ (đúng).

Vậy $x=\dfrac{1}{2}$.

