=== T10V.1@p220
- bai: 1 · y: - · trang: 220 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040303
- cong_cu: đưa về tổng hai bình phương · đánh giá miền giá trị của ẩn · số chính phương
- kiem: khong
- ket_qua_sach: (10;0); (-10;0); (17;3); (1;3); (-17;-3); (-1;-3); (6;4); (18;4); (-18;-4); (-6;-4); (15;5); (-15;-5)
- dap_an: $(x;y)\in\{(10;0);(-10;0);(17;3);(1;3);(-17;-3);(-1;-3);(6;4);(18;4);(-18;-4);(-6;-4);(15;5);(-15;-5)\}$
- ghi_chu_nghi: đề và lời giải bắt đầu ở cuối p-220; phần liệt kê nghiệm nằm ở đầu p-221 (mã câu dùng @p220). Sách chỉ ghi "25 − y² là số chính phương" mà không nêu lí do và không tính x ở từng giá trị của y; lời giải kho bổ sung (đặt x − 3y = 2k) và tính đủ 12 nghiệm, khớp danh sách sách.
## DE
Giải phương trình sau trên tập số nguyên: $x^2-6xy+13y^2=100$.
## SACH
Viết phương trình đã cho dưới dạng: $(x-3y)^2=4(25-y^2)$ (1)
Từ (1) ta suy ra $y^2\le25$ và $25-y^2$ là số chính phương. Do đó:
$y^2\in\{0;9;16;25\}$ hay $y\in\{0;\pm3;\pm4;\pm5\}$
Từ đó ta có các nghiệm:
$(10;0)$; $(-10;0)$; $(17;3)$; $(1;3)$; $(-17;-3)$
$(-1;-3)$; $(6;4)$; $(18;4)$; $(-18;-4)$; $(-6;-4)$; $(15;5)$; $(-15;-5)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái tách được thành một bình phương cộng với $4y^2$, nên phương trình bị chặn mạnh: $y$ chỉ nhận hữu hạn giá trị, rồi mỗi giá trị cho một bình phương cụ thể để tìm $x$.

**Bước 1.** Tách $13y^2=9y^2+4y^2$ để gom $x^2-6xy+9y^2$ thành bình phương của một hiệu, đưa phương trình về dạng $(x-3y)^2$ bằng $4$ lần một biểu thức theo $y$.

**Bước 2.** Vì vế trái là bình phương nên không âm; suy ra miền giá trị của $y$, đồng thời vế trái chia hết cho $4$ nên $x-3y$ là số chẵn, đặt $x-3y=2k$ để đưa về tổng hai bình phương bằng một số cho trước.

**Bước 3.** Liệt kê các số chính phương không vượt quá giá trị đó và chọn những cặp $(y^2;k^2)$ có tổng đúng bằng giá trị này.

**Bước 4.** Với từng $y$ vừa chọn, tìm $k$ (cả hai dấu) rồi tính $x=3y+2k$ để ghi đủ các cặp nghiệm.

**Chú ý:** Cả $y$ lẫn $k$ đều có thể âm; đếm lại đủ số nghiệm, đừng bỏ sót các cặp đối nhau hoặc các giá trị của $x$ ứng với dấu $\pm$ của $k$.

**Phần 2. Trình bày**

$x^2-6xy+13y^2=100\Leftrightarrow(x^2-6xy+9y^2)+4y^2=100\Leftrightarrow(x-3y)^2=4(25-y^2)$.

Vế trái là bình phương nên $25-y^2\ge0$, tức $y^2\le25$.

Vì $(x-3y)^2$ chia hết cho $4$ nên $x-3y$ chẵn; đặt $x-3y=2k$ ($k\in\mathbb{Z}$), phương trình trở thành $y^2+k^2=25$.

Các số chính phương không vượt quá $25$ là $0;1;4;9;16;25$, trong đó cặp có tổng $25$ chỉ là $\{0;25\}$ và $\{9;16\}$. Do đó $(y^2;k^2)\in\{(0;25);(9;16);(16;9);(25;0)\}$.

$y=0$, $k=\pm5$: $x=\pm10$, được $(10;0)$, $(-10;0)$.

$y=3$, $k=\pm4$: $x=9\pm8\in\{17;1\}$, được $(17;3)$, $(1;3)$.

$y=-3$, $k=\pm4$: $x=-9\pm8\in\{-1;-17\}$, được $(-1;-3)$, $(-17;-3)$.

$y=4$, $k=\pm3$: $x=12\pm6\in\{18;6\}$, được $(18;4)$, $(6;4)$.

$y=-4$, $k=\pm3$: $x=-12\pm6\in\{-6;-18\}$, được $(-6;-4)$, $(-18;-4)$.

$y=5$, $k=0$: $x=15$, được $(15;5)$; $y=-5$, $k=0$: $x=-15$, được $(-15;-5)$.

Vậy $(x;y)\in\{(10;0);(-10;0);(17;3);(1;3);(-17;-3);(-1;-3);(6;4);(18;4);(-18;-4);(-6;-4);(15;5);(-15;-5)\}$.

=== T10V.2@p221
- bai: 2 · y: - · trang: 221 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: khử mẫu · bất đẳng thức Cô-si cho ba số không âm
- kiem: khong
- ket_qua_sach: (1;1;1); (1;-1;-1); (-1;-1;1); (-1;1;-1)
- dap_an: $(x;y;z)\in\{(1;1;1);(1;-1;-1);(-1;1;-1);(-1;-1;1)\}$
- ghi_chu_nghi: mép/ảnh mờ ở đoạn "Điều kiện: x, y, z ≠ 0" (dấu ≠ mờ) và hạng tử "x²y²" trong phương trình sau khử mẫu; dựng lại theo phương trình đề (nhân hai vế với xyz). Sách bỏ qua bước từ xyz = 1 suy ra |x| = |y| = |z| = 1 và không thử lại; lời giải kho bổ sung.
## DE
Tìm nghiệm nguyên của phương trình: $\dfrac{yz}{x}+\dfrac{xz}{y}+\dfrac{xy}{z}=3$.
## SACH
Điều kiện: $x,y,z\neq0$. Từ phương trình đã cho ta có:
$y^2z^2+z^2x^2+x^2y^2=3xyz$. Suy ra $xyz>0$. Áp dụng bất đẳng thức Cô-si, ta có: $y^2z^2+z^2x^2+x^2y^2\ge3\sqrt[3]{x^4y^4z^4}$
Từ đó ta có $3xyz\ge3\sqrt[3]{x^4y^4z^4}$ hay $xyz\le1$. Do $xyz>0$ nên $xyz=1$.
Từ đó ta có các nghiệm
$(1;1;1)$; $(1;-1;-1)$; $(-1;-1;1)$; $(-1;1;-1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Sau khi khử mẫu, vế trái là tổng ba số dương có tích các bình phương liên hệ với $xyz$, nên bất đẳng thức Cô-si cho ba số chặn được $xyz$ từ trên; kết hợp với tính nguyên dương của $xyz$ chỉ còn một giá trị.

**Bước 1.** Đặt điều kiện các ẩn khác $0$ rồi nhân hai vế với $xyz$ để mất mẫu, được tổng ba bình phương ở vế trái.

**Bước 2.** Nhận xét vế trái luôn dương để suy ra dấu của tích $xyz$.

**Bước 3.** Áp dụng bất đẳng thức Cô-si cho ba số không âm ở vế trái rồi so sánh với vế phải để chặn $xyz$ từ trên.

**Bước 4.** Dùng điều kiện $xyz$ là số nguyên dương để chốt giá trị $xyz$, từ đó liệt kê các bộ nguyên có tích đó rồi thử lại.

**Chú ý:** Cô-si chỉ cho điều kiện cần nên phải thử lại các bộ tìm được; cần để ý dấu của các ẩn vì chúng có thể âm miễn là tích dương.

**Phần 2. Trình bày**

Điều kiện: $x,y,z\neq0$. Nhân hai vế với $xyz$:

$y^2z^2+z^2x^2+x^2y^2=3xyz$.

Vế trái dương nên $xyz>0$.

Áp dụng bất đẳng thức Cô-si cho ba số dương $y^2z^2$, $z^2x^2$, $x^2y^2$:

$y^2z^2+z^2x^2+x^2y^2\ge3\sqrt[3]{x^4y^4z^4}=3xyz\sqrt[3]{xyz}$.

Do đó $3xyz\ge3xyz\sqrt[3]{xyz}$, chia hai vế cho $3xyz>0$ được $\sqrt[3]{xyz}\le1$, tức $xyz\le1$.

Mà $xyz$ là số nguyên dương nên $xyz=1$, suy ra $|x|=|y|=|z|=1$ và số ẩn bằng $-1$ là chẵn. Ta được $(1;1;1)$, $(1;-1;-1)$, $(-1;1;-1)$, $(-1;-1;1)$.

Thử lại: với $x,y,z\in\{\pm1\}$ và $xyz=1$ ta có $\dfrac{yz}{x}=xyz=1$, tương tự hai phân thức còn lại cũng bằng $1$, tổng bằng $3$.

Vậy $(x;y;z)\in\{(1;1;1);(1;-1;-1);(-1;1;-1);(-1;-1;1)\}$.

=== T10V.3@p221
- bai: 3 · y: - · trang: 221 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040303
- cong_cu: nhân bốn hai vế · kẹp giữa hai bình phương của hai số nguyên cách nhau 2 đơn vị · xét hiệu
- kiem: khong
- ket_qua_sach: (0;1); (0;-1); (-1;1); (-1;-1); (3;11); (3;-11)
- dap_an: $(x;y)\in\{(0;1);(0;-1);(-1;1);(-1;-1);(3;11);(3;-11)\}$
- ghi_chu_nghi: ảnh mờ ở số mũ "x³" (đọc là x³ theo phương trình khai triển 1 + x + x² + x³ + x⁴). Phân vân nhóm: T18T040302 (kẹp, đánh giá) hoặc T18T040303 (tính chất số chính phương); chọn T18T040303 vì kẹp giữa hai bình phương. Sách ghi "(2x²+x)² < 4y² < (2x²+x+2)²" rồi suy ngay 4y² = (2x²+x+1)²; lời giải kho nêu rõ thêm 2x²+x ≥ 0 và |2y| nằm giữa hai số nguyên cách nhau 2.
## DE
Tìm nghiệm nguyên của phương trình: $y^2=1+x+x^2+x^3+x^4$.
## SACH
Với $x=0$ thì $y=\pm1$. Xét $x\neq0$. Từ phương trình đã cho ra có:
$4y^2=(2x^2+x)^2+3x^2+4x+4>(2x^2+x)^2$
Hơn nữa: $4y^2=(2x^2+x+2)^2-5x^2<(2x^2+x+2)^2$
Suy ra: $(2x^2+x)^2<4y^2<(2x^2+x+2)^2$. Do đó ta có:
$4y^2=(2x^2+x+1)^2$ hay $4(1+x+x^2+x^3+x^4)=(2x^2+x+1)^2$
Giải phương trình này, ta được $x=-1$ hoặc $x=3$.
Từ đó ta được các nghiệm của phương trình là:
$(0;1)$; $(0;-1)$; $(-1;1)$; $(-1;-1)$; $(3;11)$; $(3;-11)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân $4$ hai vế thì vế phải là đa thức bậc bốn nằm sát một bình phương $(2x^2+x+1)^2$; hai bình phương $(2x^2+x)^2$ và $(2x^2+x+2)^2$ kẹp $4y^2$ lại, mà giữa chúng chỉ còn một bình phương nguyên.

**Bước 1.** Xét riêng $x=0$ rồi với $x\neq0$ nhân $4$ hai vế để so sánh $4y^2$ với bình phương của đa thức bậc hai cùng bậc.

**Bước 2.** Xét hiệu $4y^2-(2x^2+x)^2$ và chỉ ra nó luôn dương bằng cách đưa tam thức bậc hai về bình phương cộng một hằng số dương.

**Bước 3.** Xét hiệu $(2x^2+x+2)^2-4y^2$ và chỉ ra nó dương khi $x\neq0$.

**Bước 4.** Vì $|2y|$ là số nguyên bị kẹp giữa hai số nguyên cách nhau $2$ đơn vị nên nó chỉ nhận một giá trị, rồi thay vào để giải phương trình theo $x$.

**Chú ý:** Muốn bỏ dấu giá trị tuyệt đối khi kẹp phải chứng minh $2x^2+x\ge0$ với mọi $x$ nguyên; ca $x=0$ phải xét riêng vì khi đó hiệu ở bước 3 bằng $0$ chứ không dương.

**Phần 2. Trình bày**

Nếu $x=0$ thì $y^2=1$, suy ra $y=\pm1$.

Nếu $x\neq0$: $4y^2=4x^4+4x^3+4x^2+4x+4$.

$4y^2-(2x^2+x)^2=3x^2+4x+4=3\left(x+\dfrac{2}{3}\right)^2+\dfrac{8}{3}>0$.

$(2x^2+x+2)^2-4y^2=(4x^4+4x^3+9x^2+4x+4)-(4x^4+4x^3+4x^2+4x+4)=5x^2>0$.

Suy ra $(2x^2+x)^2<(2y)^2<(2x^2+x+2)^2$.

Với $x$ nguyên khác $0$, $2x^2+x=x(2x+1)>0$ (hai thừa số cùng dấu), nên $2x^2+x<|2y|<2x^2+x+2$, do đó $|2y|=2x^2+x+1$.

Vậy $4y^2=(2x^2+x+1)^2$, tức $4x^4+4x^3+4x^2+4x+4=4x^4+4x^3+5x^2+2x+1$.

$\Leftrightarrow x^2-2x-3=0\Leftrightarrow(x+1)(x-3)=0\Leftrightarrow x=-1$ hoặc $x=3$.

Với $x=-1$: $y^2=1-1+1-1+1=1$, $y=\pm1$. Với $x=3$: $y^2=1+3+9+27+81=121$, $y=\pm11$.

Vậy $(x;y)\in\{(0;1);(0;-1);(-1;1);(-1;-1);(3;11);(3;-11)\}$.

=== T10V.4@p221
- bai: 4 · y: - · trang: 221 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: kẹp giữa hai lập phương của hai số nguyên cách nhau 2 đơn vị · xét hiệu
- kiem: khong
- ket_qua_sach: (0;1); (-1;0)
- dap_an: $(x;y)\in\{(0;1);(-1;0)\}$
- ghi_chu_nghi: sách ghi "x³ < y³ < (x+2)³" không chứng minh; lời giải kho chứng minh bằng hai hiệu luôn dương.
## DE
Giải phương trình sau trong tập các số nguyên: $1+x+x^2+x^3=y^3$ (1)
## SACH
Từ phương trình đã cho ta có: $x^3<y^3<(x+2)^3$
Suy ra $y^3=(x+1)^3$ hay $1+x+x^2+x^3=(x+1)^3$
Từ đó ta có $x=0$ hay $x=-1$. Thay vào (1), ta được các nghiệm của phương trình (1) là $(0;1)$; $(-1;0)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là đa thức bậc ba có hạng tử đầu $x^3$ nên $y^3$ nằm sát $x^3$; chỉ cần kẹp $y^3$ giữa hai lập phương liên tiếp cách nhau hai đơn vị là xác định được $y$ theo $x$.

**Bước 1.** Tính hiệu $y^3-x^3$ và chỉ ra nó dương bằng cách đưa tam thức bậc hai về bình phương cộng một hằng số dương.

**Bước 2.** Tính hiệu $(x+2)^3-y^3$ bằng cách khai triển $(x+2)^3$ rồi chỉ ra hiệu này cũng luôn dương.

**Bước 3.** Vì hàm lập phương tăng nên suy ra $y$ nằm giữa $x$ và $x+2$, rồi dùng tính nguyên để xác định $y$ theo $x$.

**Bước 4.** Thay biểu thức của $y$ vào phương trình và giải phương trình theo $x$.

**Chú ý:** So sánh hai lập phương tương đương so sánh hai cơ số, kể cả khi cơ số âm; đừng quên tính $y$ sau khi tìm được $x$.

**Phần 2. Trình bày**

$y^3-x^3=x^2+x+1=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$.

$(x+2)^3-y^3=(x^3+6x^2+12x+8)-(x^3+x^2+x+1)=5x^2+11x+7=5\left(x+\dfrac{11}{10}\right)^2+\dfrac{19}{20}>0$.

Vậy $x^3<y^3<(x+2)^3$, suy ra $x<y<x+2$. Vì $x,y$ nguyên nên $y=x+1$.

Thay vào phương trình: $1+x+x^2+x^3=(x+1)^3=x^3+3x^2+3x+1$.

$\Leftrightarrow2x^2+2x=0\Leftrightarrow x(x+1)=0\Leftrightarrow x=0$ hoặc $x=-1$.

Với $x=0$ thì $y=1$; với $x=-1$ thì $y=0$.

Vậy $(x;y)\in\{(0;1);(-1;0)\}$.

=== T10V.5@p221
- bai: 5 · y: - · trang: 221 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T040302
- cong_cu: giả sử thứ tự các ẩn (không mất tính tổng quát) · chặn ẩn nhỏ nhất bằng bất đẳng thức · đưa về phương trình tích
- kiem: khong
- ket_qua_sach: (35;3;1;1); (9;5;1;1) và các hoán vị
- dap_an: $(x;y;z;t)$ là một hoán vị của $(35;3;1;1)$ hoặc của $(9;5;1;1)$
- ghi_chu_nghi: lời giải sách rút gọn: chỉ làm trường hợp t = 1, z = 1 và kết thúc bằng "Giải tương tự cho các trường hợp còn lại và trường hợp t = 2". Lời giải kho tự soạn đủ các trường hợp (t = 1 với z = 1, 2, 3; t = 2 với (y;z) = (2;2), (3;2)); các trường hợp ngoài z = 1, t = 1 đều vô nghiệm, kết quả khớp đáp số sách. Lời giải trải sang đầu p-222 (đề ở p-221). Sách viết "(2x − 5)(2y − 5) = 65" và "Dễ thấy… nghiệm là (35, 3); (9, 5)" không lập luận loại các cặp ước âm; lời giải kho bổ sung.
## DE
Tìm nghiệm nguyên dương của phương trình sau: $5(x+y+z+t)+10=2xyzt$.
## SACH
Vì vai trò của $x,y,z,t$ như nhau nên ta có giả thiết: $x\ge y\ge z\ge t>0$
Khi đó: $2xyzt=5(x+y+z+t)+10\le20x+10$
$\Rightarrow yzt\le15\Rightarrow t^3\le15\Rightarrow t\le2$
Với $t=1$ ta có $2xyz=5(x+y+z)+15\le15x+15$
$\Rightarrow2yz\le30\Rightarrow2z^2\le30\Rightarrow z\le3$
Nếu $z=1$ thì $2xy=5(x+y)+20$ hay $4xy=10(x+y)+40$ hay
$(2x-5)(2y-5)=65$
Dễ thấy rằng phương trình này có nghiệm là: $(35;3)$; $(9;5)$
Giải tương tự cho các trường hợp còn lại và trường hợp $t=2$. Cuối cùng ta tìm được nghiệm nguyên dương của phương trình đã cho là:
$(x;y;z;t)=(35;3;1;1)$; $(9;5;1;1)$ và các hoán vị của bộ số này.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn ẩn có vai trò như nhau nên sắp thứ tự được; khi đó vế trái bị chặn theo ẩn lớn nhất, suy ra tích ba ẩn nhỏ nhất bị chặn, và các ẩn nhỏ chỉ nhận ít giá trị để thử.

**Bước 1.** Giả sử $x\ge y\ge z\ge t\ge1$ rồi thay mọi ẩn ở vế trái bằng ẩn lớn nhất để chặn $yzt$ từ trên, qua đó chặn được $t$.

**Bước 2.** Xét từng giá trị của $t$; với mỗi $t$ lại chặn $yz$ rồi chặn $z$ theo cùng cách.

**Bước 3.** Với từng cặp $(t;z)$, đưa phương trình còn hai ẩn $x,y$ về dạng tích hai thừa số bằng một hằng số bằng cách nhân rồi cộng thêm số thích hợp.

**Bước 4.** Liệt kê ước của hằng số, loại các ước không thỏa điều kiện thứ tự $x\ge y\ge z$ và tính nguyên, được các bộ đã sắp xếp.

**Bước 5.** Hoán vị các bộ tìm được để có mọi nghiệm của bài toán.

**Chú ý:** Sau khi giả sử thứ tự, các bộ tìm được chỉ là bộ sắp xếp; đừng quên kết luận cả các hoán vị của chúng.

**Phần 2. Trình bày**

Vì vai trò của $x,y,z,t$ như nhau nên giả sử $x\ge y\ge z\ge t\ge1$.

$2xyzt=5(x+y+z+t)+10\le20x+10\le30x$ nên $2yzt\le30$, tức $yzt\le15$.

Do đó $t^3\le yzt\le15$, suy ra $t\le2$.

**Trường hợp $t=1$:** $2xyz=5(x+y+z)+15\le15x+15\le30x$, nên $yz\le15$, suy ra $z^2\le yz\le15$, tức $z\le3$.

Với $z=1$: $2xy=5(x+y)+20\Leftrightarrow4xy-10x-10y=40\Leftrightarrow(2x-5)(2y-5)=65$.

Vì $x\ge y\ge1$ nên $2x-5\ge2y-5\ge-3$; nếu hai thừa số cùng âm thì chúng thuộc $\{-3;-2;-1\}$ nên tích không quá $9$, loại. Vậy cả hai dương: $(2x-5;2y-5)\in\{(65;1);(13;5)\}$, cho $(x;y)=(35;3)$ hoặc $(9;5)$.

Với $z=2$: $4xy=5(x+y)+25\Leftrightarrow(4x-5)(4y-5)=125$. Vì $y\ge2$ nên $4y-5\ge3$, và $(4y-5)^2\le125$ nên $4y-5\le11$; ước của $125$ trong khoảng $[3;11]$ chỉ có $5$, cho $y=\dfrac{5}{2}$ không nguyên. Loại.

Với $z=3$: $6xy=5(x+y)+30\Leftrightarrow(6x-5)(6y-5)=205$. Vì $y\ge3$ nên $6y-5\ge13$, và $(6y-5)^2\le205$ nên $6y-5\le14$; các ước của $205=5\cdot41$ là $1;5;41;205$, không có ước nào trong $[13;14]$. Loại.

**Trường hợp $t=2$:** $4xyz=5(x+y+z)+20\le15x+20\le25x$ (vì $x\ge2$), nên $4yz\le25$, tức $yz\le6$. Với $y\ge z\ge2$ chỉ có $(y;z)=(2;2)$ hoặc $(3;2)$.

Với $(y;z)=(2;2)$: $16x=5(x+4)+20\Leftrightarrow11x=40$, không có $x$ nguyên.

Với $(y;z)=(3;2)$: $24x=5(x+5)+20\Leftrightarrow19x=45$, không có $x$ nguyên.

Vậy các nghiệm sắp xếp là $(x;y;z;t)=(35;3;1;1)$ và $(9;5;1;1)$. Nghiệm của phương trình là mọi hoán vị của $(35;3;1;1)$ hoặc của $(9;5;1;1)$.

=== T10V.6@p222
- bai: 6 · y: - · trang: 222 · tang: nang_cao
- nguon_de: Thi vào lớp 10 chuyên ĐHKHTN- ĐHQGHN năm 2002
- muc_loi_giai_sach: du
- nhom: T18T040301
- cong_cu: đưa về phương trình tích · ước nguyên của một số
- kiem: khong
- ket_qua_sach: (1;4); (4;1); (-3;-6); (-6;-3); (0;9); (9;0); (-2;-11); (-11;-2)
- dap_an: $(x;y)\in\{(0;9);(9;0);(1;4);(4;1);(-2;-11);(-11;-2);(-3;-6);(-6;-3)\}$
- ghi_chu_nghi: mép trang mất nét ở nghiệm đầu "(1;4)" (đọc "(1,4)" theo (x+1)(y+1)=10 với x+1=2); tính lại đủ 8 cặp, khớp danh sách sách.
## DE
(Thi vào lớp 10 chuyên ĐHKHTN - ĐHQGHN năm 2002) Tìm nghiệm nguyên của phương trình: $x+xy+y=9$.
## SACH
Phương trình đã cho có thể đưa về dạng: $(x+1)(y+1)=10$ (1)
Từ (1) ta suy ra $(x+1)$ là ước của $10$ hay $x+1\in\{\pm1;\pm2;\pm5;\pm10\}$
Từ đó ta tìm được các nghiệm của phương trình là:
$(1;4)$; $(4;1)$; $(-3;-6)$; $(-6;-3)$; $(0;9)$; $(9;0)$; $(-2;-11)$; $(-11;-2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình có hạng tử $xy$ và hai hạng tử bậc nhất $x$, $y$, nên cộng thêm một hằng số vào hai vế thì vế trái phân tích được thành tích hai nhị thức, còn vế phải là một số nguyên cho trước.

**Bước 1.** Cộng thêm $1$ vào hai vế để nhóm các hạng tử của vế trái thành tích của hai nhị thức bậc nhất.

**Bước 2.** Vì $x,y$ nguyên nên mỗi nhị thức là một ước nguyên (kể cả ước âm) của vế phải; liệt kê tất cả các ước đó.

**Bước 3.** Với mỗi ước chọn cho một nhị thức, suy ra nhị thức kia rồi tính lần lượt $x$ và $y$ để ghi đủ các cặp nghiệm.

**Chú ý:** Phải lấy cả ước âm của vế phải; phương trình đối xứng theo $x,y$ nên nghiệm đi theo từng cặp hoán đổi.

**Phần 2. Trình bày**

$x+xy+y=9\Leftrightarrow(x+xy)+(y+1)=10\Leftrightarrow(x+1)(y+1)=10$.

Vì $x,y$ nguyên nên $x+1$ là ước của $10$: $x+1\in\{\pm1;\pm2;\pm5;\pm10\}$ và $y+1=\dfrac{10}{x+1}$.

$x+1=1$ thì $y+1=10$, được $(x;y)=(0;9)$.

$x+1=-1$ thì $y+1=-10$, được $(x;y)=(-2;-11)$.

$x+1=2$ thì $y+1=5$, được $(x;y)=(1;4)$.

$x+1=-2$ thì $y+1=-5$, được $(x;y)=(-3;-6)$.

$x+1=5$ thì $y+1=2$, được $(x;y)=(4;1)$.

$x+1=-5$ thì $y+1=-2$, được $(x;y)=(-6;-3)$.

$x+1=10$ thì $y+1=1$, được $(x;y)=(9;0)$.

$x+1=-10$ thì $y+1=-1$, được $(x;y)=(-11;-2)$.

Vậy $(x;y)\in\{(0;9);(9;0);(1;4);(4;1);(-2;-11);(-11;-2);(-3;-6);(-6;-3)\}$.

=== T10V.7@p222
- bai: 7 · y: - · trang: 222 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040301
- cong_cu: đặt ẩn phụ · nhân bốn hai vế để đưa về hiệu hai bình phương · phương trình tích · ước của 49
- kiem: khong
- ket_qua_sach: (1;12); (-9;12); (1;-12); (-9;-12); (0;0); (-8;0); (-1;0); (-7;0); (-4;12); (-4;-12)
- dap_an: $(x;y)\in\{(1;12);(-9;12);(1;-12);(-9;-12);(0;0);(-8;0);(-1;0);(-7;0);(-4;12);(-4;-12)\}$
- ghi_chu_nghi: lời giải sách có 6 trường hợp trải từ p-222 sang p-223 (đề ở p-222); chép đủ. Ở trường hợp 6 sách chỉ nêu "y = 0 và z = −7" mà không tính x; lời giải kho giải x² + 8x = −7 ra x = −1 hoặc −7, khớp danh sách nghiệm sách. Lời giải kho trình bày 6 trường hợp qua cặp thừa số (A;B) thay cho hệ phương trình của sách (kết quả y, z như sách).
## DE
Tìm nghiệm nguyên của phương trình sau: $y^2=x(x+1)(x+7)(x+8)$.
## SACH
Phương trình đã cho tương đương với: $y^2=(x^2+8x)(x^2+8x+7)$
Đặt $z=x^2+8x$ ta có $y^2=z^2+7z$ hay $4y^2=(2z+7)^2-49$ hay
$(2z-2y+7)(2z+2y+7)=49$. Chỉ có thể xảy ra các trường hợp sau:
Trường hợp 1: $\begin{cases}2z-2y+7=1\\2z+2y+7=49\end{cases}\Leftrightarrow\begin{cases}y=12\\z=9\end{cases}$
Trường hợp 2: $\begin{cases}2z-2y+7=49\\2z+2y+7=1\end{cases}\Leftrightarrow\begin{cases}y=-12\\z=9\end{cases}$
Trong cả hai trường hợp trên ta có: $z=9\Leftrightarrow x^2+8x=9\Leftrightarrow\left[\begin{array}{l}x=1\\x=-9\end{array}\right.$
Trường hợp 3: $\begin{cases}2z-2y+7=-1\\2z+2y+7=-49\end{cases}\Leftrightarrow\begin{cases}y=-12\\z=-16\end{cases}$
Trường hợp 4: $\begin{cases}2z-2y+7=-49\\2z+2y+7=-1\end{cases}\Leftrightarrow\begin{cases}y=12\\z=-16\end{cases}$
Trong cả hai trường hợp trên ta có: $z=-16\Leftrightarrow x^2+8x=-16\Leftrightarrow(x+4)^2=0\Leftrightarrow x=-4$
Trường hợp 5: $2z-2y+7=2z+2y+7=7\Leftrightarrow y=z=0$
Khi đó ta có $x^2+8x=0\Leftrightarrow\left[\begin{array}{l}x=0\\x=-8\end{array}\right.$
Trường hợp 6: $2z-2y+7=2z+2y+7=-7\Leftrightarrow y=0$ và $z=-7$
Vậy, phương trình đã cho có các nghiệm nguyên $(x;y)$ sau:
$(1;12)$; $(-9;12)$; $(1;-12)$; $(-9;-12)$; $(0;0)$; $(-8;0)$
$(-1;0)$; $(-7;0)$; $(-4;12)$; $(-4;-12)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép các thừa số đối xứng $x(x+8)$ và $(x+1)(x+7)$ thì cùng chứa $x^2+8x$; đặt ẩn phụ thì vế phải thành $z^2+7z$, nhân $4$ lên là một bình phương trừ $49$, tức hiệu hai bình phương bằng $49$.

**Bước 1.** Ghép các thừa số của vế phải theo cặp có tổng hai số hạng bằng nhau để cùng xuất hiện một biểu thức bậc hai của $x$.

**Bước 2.** Đặt biểu thức đó làm ẩn phụ rồi nhân $4$ hai vế để đưa phương trình về dạng một bình phương trừ một hằng số.

**Bước 3.** Chuyển về dạng hiệu hai bình phương và phân tích thành tích hai thừa số nguyên bằng $49$, rồi liệt kê mọi cặp ước (cả âm).

**Bước 4.** Với mỗi cặp thừa số, lập hệ gồm tổng và hiệu của chúng để tìm $y$ và ẩn phụ.

**Bước 5.** Với mỗi giá trị của ẩn phụ, giải phương trình bậc hai theo $x$ để tìm các giá trị nguyên của $x$ rồi ghép với $y$.

**Chú ý:** Số $49$ có sáu cặp ước có thứ tự (kể cả âm), không phải ba; đừng quên giải ngược về $x$ và ghép đủ $y$ ở từng trường hợp.

**Phần 2. Trình bày**

$y^2=x(x+1)(x+7)(x+8)=(x^2+8x)(x^2+8x+7)$.

Đặt $z=x^2+8x$ ($z$ nguyên) thì $y^2=z^2+7z$, nên $4y^2=4z^2+28z=(2z+7)^2-49$, tức

$(2z+7)^2-(2y)^2=49\Leftrightarrow(2z-2y+7)(2z+2y+7)=49$.

Đặt $A=2z-2y+7$, $B=2z+2y+7$ thì $AB=49$, $y=\dfrac{B-A}{4}$, $z=\dfrac{A+B-14}{4}$.

$(A;B)=(1;49)$: $y=12$, $z=9$.

$(A;B)=(49;1)$: $y=-12$, $z=9$.

$(A;B)=(-1;-49)$: $y=-12$, $z=-16$.

$(A;B)=(-49;-1)$: $y=12$, $z=-16$.

$(A;B)=(7;7)$: $y=0$, $z=0$.

$(A;B)=(-7;-7)$: $y=0$, $z=-7$.

Với $z=9$: $x^2+8x-9=0\Leftrightarrow(x-1)(x+9)=0\Leftrightarrow x=1$ hoặc $x=-9$; ghép $y=\pm12$ được $(1;12)$, $(1;-12)$, $(-9;12)$, $(-9;-12)$.

Với $z=-16$: $x^2+8x+16=0\Leftrightarrow(x+4)^2=0\Leftrightarrow x=-4$; ghép $y=\pm12$ được $(-4;12)$, $(-4;-12)$.

Với $z=0$: $x(x+8)=0\Leftrightarrow x=0$ hoặc $x=-8$, ghép $y=0$ được $(0;0)$, $(-8;0)$.

Với $z=-7$: $x^2+8x+7=0\Leftrightarrow(x+1)(x+7)=0\Leftrightarrow x=-1$ hoặc $x=-7$, ghép $y=0$ được $(-1;0)$, $(-7;0)$.

Vậy $(x;y)\in\{(1;12);(-9;12);(1;-12);(-9;-12);(0;0);(-8;0);(-1;0);(-7;0);(-4;12);(-4;-12)\}$.

=== T10V.8@p223
- bai: 8 · y: - · trang: 223 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040301
- cong_cu: đồng dư modulo 7 · số dư của lập phương và của luỹ thừa của 2 · hằng đẳng thức hiệu hai lập phương · ước của 3367
- kiem: khong
- ket_qua_sach: (9;12)
- dap_an: $(x;n)=(9;12)$
- ghi_chu_nghi: sách ghi "2ᵐ − x ∈ {1;7;13}" kèm lí do (2ᵐ − x)³ < 3367 mà không nói rõ 3367 = 7·13·37 và các ước ≤ 15; lời giải kho nêu rõ. Dấu nhân trong "2 x 561", "2 x 15", "2⁴ x 3²" chép thành dấu nhân.
## DE
Xác định tất cả các cặp số nguyên dương $(x;n)$ thỏa mãn phương trình sau: $x^3+3367=2^n$.
## SACH
Để sử dụng được hằng đẳng thức $a^3-b^3=(a-b)(a^2+ab+b^2)$ ta chứng minh $n$ chia hết cho $3$. Từ phương trình đã cho ta suy ra $x^3\equiv2^n\pmod{7}$. Nếu $n$ không chia hết cho $3$ thì $2^n$ chia cho $7$ chỉ có thể có số dư là $2$ hoặc $4$, trong đó $x^3$ khi chia cho $7$ chỉ có thể cho số dư là $0$, $1$ hoặc $6$ nên không thể có đồng dư thức $x^3\equiv2^n\pmod{7}$.
Vậy $n=3m$ với $m$ là một số nguyên dương nào đó. Thay vào phương trình đã cho ta được: $x^3+3367=(2^m)^3$
$(2^m-x)\left((2^m-x)^2+3x\cdot2^m\right)=3367$ (1)
Từ (1) ta suy ra $2^m-x$ là ước của $3367$.
Hơn nữa, $(2^m-x)^3<2^{3m}-x^3=3367$ nên $2^m-x\in\{1;7;13\}$
Xét $2^m-x=1$, thay vào (1) ta suy ra $2^m(2^m-1)=2\cdot561$, vô nghiệm.
Xét $2^m-x=13$, thay vào (1) ta được $2^m(2^m-13)=2\cdot15$, vô nghiệm.
Xét $2^m-x=7$, thay vào (1) ta được $2^m(2^m-7)=2^4\cdot3^2$.
Từ đó ta có $m=4$, $n=3m=12$ và $x=9$.
Vậy $(x;n)=(9;12)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn dùng hiệu hai lập phương thì phải biến $2^n$ thành một lập phương, tức chứng minh $n$ chia hết cho $3$; việc này làm được bằng đồng dư modulo $7$ vì $3367$ chia hết cho $7$ và lập phương chỉ cho vài số dư rất ít.

**Bước 1.** Lấy phương trình theo modulo $7$ rồi so sánh tập số dư của lập phương với tập số dư của $2^n$ để chứng minh $n$ chia hết cho $3$.

**Bước 2.** Đặt $n=3m$ để đưa về hiệu hai lập phương $(2^m)^3-x^3$ rồi phân tích thành tích của $2^m-x$ với một thừa số còn lại.

**Bước 3.** Phân tích $3367$ ra thừa số nguyên tố, rồi chặn $2^m-x$ vừa là ước dương vừa có lập phương nhỏ hơn $3367$ để chỉ còn vài giá trị.

**Bước 4.** Với mỗi ước còn lại, thay vào để tính tích $x\cdot2^m$, rồi so sánh số mũ của $2$ ở hai vế (thừa số còn lại là số lẻ) để loại hoặc tìm $m$.

**Chú ý:** Đồng dư modulo $7$ chỉ chứng minh được $3\mid n$, chưa cho nghiệm; bước chặn $2^m-x$ cần cả điều kiện ước của $3367$ lẫn điều kiện lập phương nhỏ hơn $3367$.

**Phần 2. Trình bày**

$3367=7\cdot481=7\cdot13\cdot37$ chia hết cho $7$ nên $x^3\equiv2^n\pmod{7}$.

Số dư của lập phương khi chia cho $7$ chỉ là $0;1;6$. Vì $2^3=8\equiv1\pmod{7}$ nên nếu $3\nmid n$ thì $2^n\equiv2$ hoặc $4\pmod{7}$, mâu thuẫn. Vậy $n=3m$ với $m$ nguyên dương.

Phương trình thành $(2^m)^3-x^3=3367$, tức

$(2^m-x)\left[(2^m-x)^2+3x\cdot2^m\right]=3367$. (1)

Đặt $d=2^m-x$ thì $d$ là ước dương của $3367$ và $d^3<d\left(d^2+3x\cdot2^m\right)=3367$, nên $d\le15$. Các ước của $3367$ không quá $15$ là $1;7;13$.

$d=1$: (1) cho $1+3x\cdot2^m=3367$, nên $x\cdot2^m=1122$; mà $x=2^m-1$ nên $2^m(2^m-1)=2\cdot561$. Vì $2^m-1$ lẻ nên $2^m=2$, $m=1$, khi đó vế trái bằng $2\ne1122$. Vô nghiệm.

$d=13$: (1) cho $169+3x\cdot2^m=3367\div13=259$, nên $x\cdot2^m=30$; mà $x=2^m-13$ nên $2^m(2^m-13)=2\cdot15$. Vì $2^m-13$ lẻ nên $2^m=2$, $m=1$, khi đó vế trái bằng $-22\ne30$. Vô nghiệm.

$d=7$: (1) cho $49+3x\cdot2^m=481$, nên $x\cdot2^m=144$; mà $x=2^m-7$ nên $2^m(2^m-7)=2^4\cdot3^2$. Vì $2^m-7$ lẻ nên $2^m=2^4$, $m=4$, khi đó $2^m-7=9$ đúng, $x=16-7=9$ và $n=3m=12$.

Thử lại: $9^3+3367=729+3367=4096=2^{12}$.

Vậy $(x;n)=(9;12)$.

=== T10V.9@p224
- bai: 9 · y: - · trang: 224 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040303
- cong_cu: đồng dư modulo 4 · số dư của số chính phương · tính chia hết cho 3 (xuống thang)
- kiem: khong
- ket_qua_sach: \varnothing
- dap_an: $S=\varnothing$
- ghi_chu_nghi: sách giải hai cách, chép đủ cả hai vào ## SACH; lời giải kho đi Cách 2 (modulo 4), Cách 1 nhắc trong Chú ý. Mép/ảnh mờ nhẹ ở "do đó" (đọc "do đó x và y đều chia hết cho 3") và chỉ số mũ "y²" trong (1); đọc theo ngữ cảnh.
## DE
Tìm nghiệm nguyên của phương trình sau: $19x^2+28y^2=729$.
## SACH
Cách 1: Viết phương trình đã cho dưới dạng:
$(18x^2+27y^2)+(x^2+y^2)=729$ (1)
Từ (1) suy ra $x^2+y^2$ chia hết cho $3$, do đó $x$ và $y$ đều chia hết cho $3$. Đặt $x=3u$; $y=3v$ ($u,v\in\mathbb{Z}$)
Thay vào phương trình đã cho ta được: $19u^2+28v^2=81$ (2)
Từ (2), lập luận tương tự như trên ta suy ra $u=3s$, $v=3t$ ($s,t\in\mathbb{Z}$)
Thay vào (2) ta có $19s^2+28t^2=9$ (3). Từ (3) suy ra $s,t$ không đồng thời bằng $0$, do đó: $19s^2+28t^2\ge19>9$
Vậy (3) vô nghiệm và do đó phương trình đã cho cũng vô nghiệm
Cách 2: Giả sử phương trình có nghiệm.
Từ phương trình đã cho ta suy ra $x^2\equiv-1\pmod{4}$, điều này không xảy ra với mọi số nguyên $x$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số $28$ chia hết cho $4$ còn $729$ chia $4$ dư $1$, nên khi xét modulo $4$ số hạng chứa $y$ biến mất và chỉ còn một điều kiện cho $x^2$; mà số chính phương chỉ có vài số dư khi chia cho $4$.

**Bước 1.** Xét từng số hạng của phương trình theo modulo $4$ để biết số hạng nào triệt tiêu và hai vế còn lại bằng bao nhiêu.

**Bước 2.** Thu gọn đồng dư thức về dạng chỉ chứa $x^2$ để có điều kiện về số dư của $x^2$ khi chia cho $4$.

**Bước 3.** Liệt kê các số dư có thể có của số chính phương khi chia cho $4$ rồi đối chiếu để kết luận phương trình có nghiệm nguyên hay không.

**Chú ý:** Có thể giải bằng cách khác: viết $19x^2+28y^2=(18x^2+27y^2)+(x^2+y^2)$ để suy ra $x,y$ cùng chia hết cho $3$, đặt $x=3u$, $y=3v$ rồi lặp lại lập luận; hạ xuống $19s^2+28t^2=9$ thì mâu thuẫn vì $s,t$ không đồng thời bằng $0$ nên vế trái $\ge19$.

**Phần 2. Trình bày**

Giả sử phương trình có nghiệm nguyên $(x;y)$.

Vì $28y^2$ chia hết cho $4$ nên $19x^2+28y^2\equiv19x^2\equiv3x^2\pmod{4}$, còn $729=4\cdot182+1\equiv1\pmod{4}$.

Do đó $3x^2\equiv1\pmod{4}$; nhân hai vế với $3$ được $x^2\equiv3\pmod{4}$.

Số chính phương chia $4$ chỉ dư $0$ (khi $x$ chẵn) hoặc $1$ (khi $x$ lẻ), không bao giờ dư $3$. Mâu thuẫn.

Vậy phương trình không có nghiệm nguyên: $S=\varnothing$.

=== T10V.10@p224
- bai: 10 · y: - · trang: 224 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040303
- cong_cu: đặt ẩn phụ · tổng hai bình phương · chẵn lẻ và số dư modulo 4 · xuống thang · lập phương của số nguyên
- kiem: khong
- ket_qua_sach: (2;-8); (2;24); (-2;-24); (-2;8)
- dap_an: $(x;y)\in\{(2;-8);(2;24);(-2;-24);(-2;8)\}$
- ghi_chu_nghi: logo "ABC" che nhẹ đầu dòng đáp số cuối trang ("(2;-8)"); đã kiểm lại bằng cách thay vào phương trình (x = 2, y = −8: 128 + 64 + 128 = 320). Sách viết "u là lập phương của một số nguyên nên u₃ cũng là lập phương" không giải thích; lời giải kho nêu rõ (u = 8u₃ = x³ nên x chẵn, x = 2k, u₃ = k³). Sách không có nhận xét hay phần tiếp sau ví dụ 10 trong phạm vi được giao.
## DE
Tìm nghiệm nguyên của phương trình sau: $2x^6+y^2-2x^3y=320$.
## SACH
Viết phương trình đã cho dưới dạng: $(x^3)^2+(x^3-y)^2=320$
Đặt $u=x^3$, $v=x^3-y$ ta có phương trình: $u^2+v^2=320$ (1)
Từ (1) suy ra $u,v$ cùng tính chẵn lẻ. Nếu $u,v$ cùng lẻ thì $u^2+v^2\equiv2\pmod{4}$, do đó đẳng thức (1) không xảy ra.
Vậy $u,v$ cùng chẵn. Đặt $u=2u_1$, $v=2v_1$ ($u_1,v_1\in\mathbb{Z}$).
$u_1^2+v_1^2=80$ (2)
Từ (2) lại lập luận như trên ta suy ra $u_1,v_1$ cùng chẵn.
Đặt $u_1=2u_2$, $v_1=2v_2$ ($u_2,v_2\in\mathbb{Z}$). Thay vào (2) ta được phương trình: $u_2^2+v_2^2=20$ (3). Từ (3) lại lập luận như trên ta suy ra $u_2,v_2$ cùng chẵn. Đặt $u_2=2u_3$, $v_2=2v_3$ ($u_3,v_3\in\mathbb{Z}$).
Thay vào (3) ta có phương trình: $u_3^2+v_3^2=5$ (4)
Từ (4) với lưu ý rằng $u$ là lập phương của một số nguyên nên $u_3$ cũng là lập phương của một số nguyên, ta được các cặp $(u_3;v_3)$ là:
$(1;2)$; $(-1;2)$; $(1;-2)$; $(-1;-2)$
Từ đó ta có các nghiệm $(x;y)$ của phương trình đã cho là:
$(2;-8)$; $(2;24)$; $(-2;-24)$; $(-2;8)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái viết được thành tổng hai bình phương $(x^3)^2+(x^3-y)^2$; đặt ẩn phụ rồi dùng chẵn lẻ (modulo $4$) để chia dần cho $4$ cho tới khi còn một tổng hai bình phương nhỏ, dễ liệt kê.

**Bước 1.** Gom vế trái thành tổng của $(x^3)^2$ và một bình phương nữa rồi đặt hai ẩn phụ để được tổng hai bình phương bằng một hằng số.

**Bước 2.** Chứng minh hai ẩn phụ cùng chẵn bằng cách xét số dư modulo $4$ của tổng hai bình phương cùng lẻ, rồi đặt mỗi ẩn bằng hai lần ẩn mới.

**Bước 3.** Lặp lại lập luận chẵn lẻ cho tới khi hằng số không còn chia hết cho $4$, được tổng hai bình phương nhỏ.

**Bước 4.** Liệt kê các cặp ẩn cuối có tổng bình phương đúng bằng hằng số này, rồi dùng điều kiện $x^3$ là lập phương của số nguyên để loại cặp không thỏa.

**Bước 5.** Quay ngược các phép đặt ẩn để tính $x$ và $y$ cho từng cặp còn lại.

**Chú ý:** Mỗi lần xuống thang đều phải nêu lí do hằng số chia hết cho $4$ (ở đây $320$, $80$, $20$); tới $5$ thì dừng vì $5$ không chia hết cho $4$.

**Phần 2. Trình bày**

$2x^6+y^2-2x^3y=320\Leftrightarrow(x^3)^2+(x^3-y)^2=320$.

Đặt $u=x^3$, $v=x^3-y$ ($u,v\in\mathbb{Z}$): $u^2+v^2=320$.

Vế trái chẵn nên $u,v$ cùng tính chẵn lẻ. Nếu cùng lẻ thì $u^2+v^2\equiv2\pmod{4}$, mà $320\equiv0\pmod{4}$, mâu thuẫn. Vậy $u,v$ cùng chẵn, đặt $u=2u_1$, $v=2v_1$: $u_1^2+v_1^2=80$.

Vì $80\equiv0\pmod{4}$ nên lập luận tương tự $u_1,v_1$ cùng chẵn, đặt $u_1=2u_2$, $v_1=2v_2$: $u_2^2+v_2^2=20$.

Vì $20\equiv0\pmod{4}$ nên $u_2,v_2$ cùng chẵn, đặt $u_2=2u_3$, $v_2=2v_3$: $u_3^2+v_3^2=5$.

Các số chính phương không vượt quá $5$ là $0;1;4$, nên $\{u_3^2;v_3^2\}=\{1;4\}$, tức $(u_3;v_3)$ là $(\pm1;\pm2)$ hoặc $(\pm2;\pm1)$.

Ta có $u=8u_3=x^3$ nên $x$ chẵn; đặt $x=2k$ thì $u_3=k^3$ là lập phương của một số nguyên. Trong các giá trị $\pm1;\pm2$ chỉ $\pm1$ là lập phương, nên $u_3=\pm1$ và $v_3=\pm2$.

$u_3=1$: $x=2$; $u_3=-1$: $x=-2$. Và $y=x^3-v=8u_3-8v_3=8(u_3-v_3)$.

$(u_3;v_3)=(1;2)$: $x=2$, $y=-8$.

$(u_3;v_3)=(1;-2)$: $x=2$, $y=24$.

$(u_3;v_3)=(-1;2)$: $x=-2$, $y=-24$.

$(u_3;v_3)=(-1;-2)$: $x=-2$, $y=8$.

Vậy $(x;y)\in\{(2;-8);(2;24);(-2;-24);(-2;8)\}$.
