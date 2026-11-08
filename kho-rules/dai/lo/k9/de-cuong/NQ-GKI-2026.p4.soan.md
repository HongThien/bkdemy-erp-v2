# ĐỀ | Đề cương ôn tập giữa học kì I Toán 9 — THCS Ngô Quyền (Hà Nội)
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | Dạng 4. Toán nâng cao (Bài 1–2) | tu_luan

### Bài 1 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Kim cương là một khoáng sản quý, có rất nhiều giá trị và được sử dụng với nhiều mục đích khác nhau. Giá bán của một viên kim cương rất cao và phụ thuộc vào rất nhiều yếu tố. Giả sử rằng giá bán của viên kim cương tỉ lệ với bình phương khối lượng của nó. Khi đem một viên kim cương cắt thành ba phần và vẫn bán với giá như trên (theo đúng tỉ lệ trên) thì tổng số tiền thu được tăng lên hay giảm đi? Trong trường hợp nào, giá bán của viên kim cương ban đầu giảm nhiều nhất? Và giảm bao nhiêu lần?

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết tổng tiền trước và sau khi cắt bằng cùng một hệ số tỉ lệ, rồi so sánh $m^2$ với tổng ba bình phương nhờ khai triển $(a+b+c)^2$ và xét hiệu về tổng các bình phương.

**Bước 1.** Đặt giá tiền bằng một hệ số dương nhân bình phương khối lượng; gọi khối lượng viên ban đầu và khối lượng ba phần sau khi cắt, các khối lượng này cộng lại bằng khối lượng ban đầu.

**Bước 2.** Viết số tiền của viên ban đầu và tổng số tiền của ba phần, rồi xét hiệu hai số tiền bằng cách khai triển bình phương của tổng ba khối lượng để biết tăng hay giảm.

**Bước 3.** Muốn giảm nhiều nhất thì tổng tiền sau khi cắt phải nhỏ nhất; so sánh ba lần tổng bình phương với bình phương của tổng, biến đổi hiệu về tổng ba bình phương không âm.

**Bước 4.** Xét khi nào dấu bằng xảy ra để biết cách cắt, rồi lập tỉ số giữa số tiền ban đầu và số tiền sau khi cắt để trả lời giảm bao nhiêu lần.

**Phần 2. Trình bày**

Gọi $m$ là khối lượng viên kim cương ban đầu.

Giá bán tỉ lệ với bình phương khối lượng nên giá của viên kim cương khối lượng $t$ là $kt^2$, với $k>0$ là hệ số tỉ lệ.

Giá của viên ban đầu là $km^2$.

Cắt thành ba phần có khối lượng $a$, $b$, $c$ ($a>0$, $b>0$, $c>0$), giả sử khi cắt không hao hụt nên $a+b+c=m$.

Tổng số tiền thu được sau khi cắt là $k(a^2+b^2+c^2)$.

Xét hiệu:

$km^2-k(a^2+b^2+c^2)=k\left[(a+b+c)^2-(a^2+b^2+c^2)\right]$

$=k(2ab+2bc+2ca)$

Vì $k>0$ và $a,b,c>0$ nên hiệu này lớn hơn $0$.

Suy ra $k(a^2+b^2+c^2)<km^2$, tức là tổng số tiền thu được giảm đi.

Tổng tiền sau khi cắt nhỏ nhất khi $a^2+b^2+c^2$ nhỏ nhất.

Ta có:

$3(a^2+b^2+c^2)-(a+b+c)^2=2a^2+2b^2+2c^2-2ab-2bc-2ca$

$=(a-b)^2+(b-c)^2+(c-a)^2\ge0$

Suy ra $a^2+b^2+c^2\ge\dfrac{(a+b+c)^2}{3}=\dfrac{m^2}{3}$.

Dấu "=" xảy ra khi $a-b=0$, $b-c=0$ và $c-a=0$, tức là $a=b=c=\dfrac{m}{3}$.

Khi đó tổng số tiền sau khi cắt là $k\cdot\dfrac{m^2}{3}$.

Tỉ số giữa số tiền ban đầu và số tiền sau khi cắt là $km^2:\dfrac{km^2}{3}=3$.

Vậy tổng số tiền thu được luôn giảm đi; giá bán giảm nhiều nhất khi cắt viên kim cương thành ba phần có khối lượng bằng nhau, và khi đó giảm $3$ lần.

### Bài 2 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giải phương trình: $\dfrac{1}{x^2+9x+20}+\dfrac{1}{x^2+11x+30}+\dfrac{1}{x^2+13x+42}=\dfrac{1}{18}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba mẫu đều phân tích được thành tích hai nhân tử bậc nhất hơn kém nhau $1$ đơn vị, và các nhân tử nối tiếp nhau nên mỗi phân thức tách được thành hiệu hai phân thức, cộng lại thì triệt tiêu dây chuyền.

**Bước 1.** Phân tích từng mẫu thành tích hai nhân tử bậc nhất, quan sát quy luật nối tiếp giữa các nhân tử và tìm điều kiện xác định.

**Bước 2.** Tách mỗi phân thức thành hiệu của hai phân thức đơn giản bằng cách xét hiệu của $\dfrac{1}{x+n}$ và $\dfrac{1}{x+n+1}$ rồi kiểm tra bằng quy đồng.

**Bước 3.** Cộng ba hiệu lại: các số hạng ở giữa triệt tiêu, vế trái chỉ còn hai phân thức, quy đồng rồi nhân chéo để khử mẫu.

**Bước 4.** Đưa phương trình bậc hai nhận được về phương trình tích bằng cách tách hạng tử, giải rồi đối chiếu điều kiện xác định và kết luận.

**Phần 2. Trình bày**

Ta có:

$x^2+9x+20=(x+4)(x+5)$

$x^2+11x+30=(x+5)(x+6)$

$x^2+13x+42=(x+6)(x+7)$

Điều kiện xác định: $x\ne-4$, $x\ne-5$, $x\ne-6$ và $x\ne-7$.

Với $x$ thoả mãn điều kiện, ta có:

$\dfrac{1}{x+4}-\dfrac{1}{x+5}=\dfrac{(x+5)-(x+4)}{(x+4)(x+5)}=\dfrac{1}{(x+4)(x+5)}$

$\dfrac{1}{x+5}-\dfrac{1}{x+6}=\dfrac{(x+6)-(x+5)}{(x+5)(x+6)}=\dfrac{1}{(x+5)(x+6)}$

$\dfrac{1}{x+6}-\dfrac{1}{x+7}=\dfrac{(x+7)-(x+6)}{(x+6)(x+7)}=\dfrac{1}{(x+6)(x+7)}$

Phương trình đã cho trở thành:

$\dfrac{1}{x+4}-\dfrac{1}{x+5}+\dfrac{1}{x+5}-\dfrac{1}{x+6}+\dfrac{1}{x+6}-\dfrac{1}{x+7}=\dfrac{1}{18}$

$\dfrac{1}{x+4}-\dfrac{1}{x+7}=\dfrac{1}{18}$

$\dfrac{3}{(x+4)(x+7)}=\dfrac{1}{18}$

Suy ra $(x+4)(x+7)=54$ (nhân chéo).

$x^2+11x+28=54$

$x^2+11x-26=0$

$x^2-2x+13x-26=0$

$x(x-2)+13(x-2)=0$

$(x-2)(x+13)=0$

Suy ra $x-2=0$ hoặc $x+13=0$.

• $x-2=0$ suy ra $x=2$ (thoả mãn điều kiện xác định).

• $x+13=0$ suy ra $x=-13$ (thoả mãn điều kiện xác định).

Vậy phương trình đã cho có hai nghiệm là $x=2$ và $x=-13$.

## GHI CHÚ CHO NGƯỜI DUYỆT

Không. Bài 1: đề không nói khi cắt có hao hụt khối lượng hay không, nên giả sử không hao hụt ($a+b+c=m$) và ghi rõ trong lời giải; chứng minh bằng hoàn thành tổng bình phương, không dùng Cô-si. Bài 2: phân tích mẫu thành $(x+4)(x+5)$, $(x+5)(x+6)$, $(x+6)(x+7)$ rồi tách phân thức; phương trình bậc hai đưa về phương trình tích; hai nghiệm đều thoả điều kiện, đã thử lại bằng máy.
