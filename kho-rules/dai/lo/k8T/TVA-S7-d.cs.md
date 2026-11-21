=== T7B.1@p155
- bai: 1 · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hiệu hai bình phương đưa về phương trình tích · phân tích ra thừa số nguyên tố · xét ước của một số
- kiem: khong
- ket_qua_sach: (33;10); (495;494)
- dap_an: $(x;y)\in\{(33;10);(495;494)\}$
- ghi_chu_nghi: Máy vét x<1000, y<=x cho đúng hai cặp (33;10), (495;494), khớp sách.
## DE
Giải phương trình nghiệm là số tự nhiên của phương trình sau: $2(x^2-y^2)=1978$.
## SACH
Ta có, từ phương trình đã cho suy ra $2(x^2-y^2)=1978\Leftrightarrow x^2-y^2=989\Leftrightarrow (x-y)(x+y)=23\cdot 43$.

Do $x,y$ là số tự nhiên nên xảy ra các trường hợp sau:

a. $\begin{cases}x-y=23\\x+y=43\end{cases}\Leftrightarrow\begin{cases}x=33\\y=10\end{cases}$

b. $\begin{cases}x-y=1\\x+y=23\cdot 43\end{cases}\Leftrightarrow\begin{cases}x=495\\y=494\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là hiệu hai bình phương còn vế phải là một số cụ thể, nên đưa về tích $(x-y)(x+y)$ bằng một hằng số rồi liệt kê các ước của hằng số đó.

**Bước 1.** Chia hai vế cho $2$ và phân tích $x^2-y^2$ thành tích hai nhân tử để được phương trình tích có vế phải là số tự nhiên cụ thể.

**Bước 2.** Phân tích số ở vế phải ra thừa số nguyên tố để biết hết các ước của nó, nhớ rằng $x+y\ge x-y\ge0$ vì $x,y$ là số tự nhiên.

**Bước 3.** Với mỗi cách viết vế phải thành tích hai ước, lập hệ hai phương trình bậc nhất rồi giải bằng cộng trừ để tìm $x,y$ và kiểm tra chúng là số tự nhiên.

**Chú ý:** Hai nhân tử $x-y$ và $x+y$ luôn cùng tính chẵn lẻ; ở bài này vế phải lẻ nên cả hai nhân tử đều lẻ, mọi cặp ước đều dùng được.

**Phần 2. Trình bày**

$2(x^2-y^2)=1978\Leftrightarrow x^2-y^2=989$

$\Leftrightarrow (x-y)(x+y)=989=23\cdot 43$

Vì $23$ và $43$ là số nguyên tố nên các ước dương của $989$ là $1;23;43;989$. Do $x,y\in\mathbb{N}$ nên $x+y\ge x-y\ge0$, chỉ có hai khả năng.

Trường hợp 1: $\begin{cases}x-y=1\\x+y=989\end{cases}\Leftrightarrow\begin{cases}x=495\\y=494\end{cases}$ (nhận).

Trường hợp 2: $\begin{cases}x-y=23\\x+y=43\end{cases}\Leftrightarrow\begin{cases}x=33\\y=10\end{cases}$ (nhận).

Vậy $(x;y)\in\{(495;494);(33;10)\}$.

=== T7B.2@p155
- bai: 2 · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Số có hai chữ số giống nhau $\overline{cc}=11c$ · chặn khoảng giá trị rồi liệt kê
- kiem: khong
- ket_qua_sach: 241978; 483978
- dap_an: $\overline{abcdef}=241978$
- ghi_chu_nghi: Sách kết luận hai số 241978 và 483978 nhưng chỉ xét hai cặp (a;c)=(2;1) và (1;2) và không đối chiếu chữ số đầu/chữ số thứ ba. Máy vét a=1..9, c=0..9 (N=a(1000(11c)^2-11c), 6 chữ số, chữ số đầu = a, chữ số thứ ba = c, 6 chữ số đôi một khác nhau) chỉ còn 241978. 483978 sai: chữ số đầu là 4 chứ không phải a=1, và hai chữ số 8 trùng nhau. Theo bản đúng.
## DE
Tìm số có sáu chữ số đôi một khác nhau $\overline{abcdef}$ sao cho $\overline{abcdef}=a(1000\overline{cc}^2-\overline{cc})$.
## SACH
Ta có $\overline{abcdef}=a(1000\overline{cc}^2-\overline{cc})\Leftrightarrow\overline{abcdef}=121000ac^2-11ac$.

Do $a,b,c,d,e,f\in\mathbb{N},1\le a\le9,0\le b,c,d,e,f\le9$, suy ra $11ac<1100$, $0<\overline{abcdef}<10^6$, nên xảy ra $a=1,c=2$ hoặc $a=2,c=1$, vì $a$ khác $c$.

* Khi $a=2,c=1$ ta có $\overline{abcdef}=121000\cdot 2-22=241978$.

* Khi $a=1,c=2$ ta có $\overline{abcdef}=121000\cdot 4-22=483978$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số $\overline{cc}$ chỉ là $11c$ nên vế phải chỉ phụ thuộc $a$ và $c$; mà số cần tìm chỉ có sáu chữ số nên $ac^2$ bị chặn rất nhỏ, chỉ còn vài cặp $(a;c)$ để thử.

**Bước 1.** Viết $\overline{cc}=11c$ để biến vế phải thành $121000ac^2-11ac$, một biểu thức chỉ chứa hai chữ số $a$ và $c$.

**Bước 2.** Dùng điều kiện số có đúng sáu chữ số để chặn $ac^2$ từ hai phía, từ đó biết $c$ chỉ nhận vài giá trị và $a$ cũng bị chặn theo $c$.

**Bước 3.** Liệt kê từng cặp $(a;c)$ còn lại, tính số tương ứng rồi loại các số mà chữ số đầu không bằng $a$ hoặc chữ số thứ ba không bằng $c$ hoặc có chữ số lặp lại.

**Chú ý:** Chữ số đầu của $\overline{abcdef}$ chính là $a$ và chữ số hàng trăm chính là $c$ nên phải đối chiếu hai điều này sau khi tính ra số; bỏ bước đối chiếu sẽ nhận nhầm đáp số.

**Phần 2. Trình bày**

Vì $\overline{cc}=11c$ nên $\overline{abcdef}=a(1000\cdot 121c^2-11c)=121000ac^2-11ac$.

Số cần tìm có sáu chữ số nên $100000\le\overline{abcdef}\le999999$. Với $c=0$ thì số bằng $0$ (loại), nên $c\ge1$.

Do $11ac\le11\cdot81=891$ nên $121000ac^2\le999999+891=1000890<9\cdot121000=1089000$ nên $ac^2\le8$.

Với $c\ge3$ thì $ac^2\ge9$ (loại). Với $c=1$ thì $a\le8$; với $c=2$ thì $4a\le8$ nên $a\le2$. Vì các chữ số khác nhau nên $a\ne c$, ta xét các cặp $(a;c)$ sau.

$c=1$: số là $121000a-11a=120989a$, ứng với $a=2;3;4;5;6;7;8$ lần lượt là $241978;362967;483956;604945;725934;846923;967912$.

Chữ số đầu phải bằng $a$ nên loại $a=5;6;7;8$ (chữ số đầu lần lượt là $6;7;8;9$). Chữ số thứ ba phải bằng $c=1$ nên loại $a=3$ (chữ số thứ ba là $2$) và $a=4$ (chữ số thứ ba là $3$). Còn $a=2$: số $241978$ có các chữ số $2;4;1;9;7;8$ đôi một khác nhau, thỏa mãn.

$c=2$, $a=1$: số là $121000\cdot 4-22=483978$, chữ số đầu là $4\ne a=1$ nên loại.

Vậy số cần tìm là $241978$.

=== T7B.3@p155
- bai: 3 · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Kẹp giữa hai bình phương liên tiếp · hằng đẳng thức bình phương một tổng
- kiem: khong
- ket_qua_sach: (0;1;0); (0;-1;0)
- dap_an: $(x;y;z)\in\{(0;1;0);(0;-1;0)\}$
- ghi_chu_nghi: Máy vét x,y,z trong [-30;30] chỉ ra đúng hai nghiệm (0;±1;0), khớp sách.
## DE
Giải phương trình nghiệm nguyên: $x^4-y^4+z^4+2x^2z^2+3x^2+4z^2+1=0$.
## SACH
Ta có $x^4-y^4+z^4+2x^2z^2+3x^2+4z^2+1=0$

$\Leftrightarrow (x^2+z^2+2)^2-(x^2+3)=y^4$ (1) hoặc

$\Leftrightarrow (x^2+z^2+1)^2+x^2+2z^2=y^4$ (2)

Nhưng ta có $x^2+2z^2\ge0$ và $x^2+3>0$ $(\forall x,z\in\mathbb{Z})$. Từ (1) và (2), ta có $(x^2+z^2+1)^2\le y^4<(x^2+z^2+2)^2\Rightarrow y^4=(x^2+z^2+1)^2$. Kết hợp với phương trình (2) ta có $x^2+2z^2=0\Rightarrow x=z=0$ nên $y=\pm1$. Vậy phương trình có nghiệm nguyên là $(x;y;z)=(0;1;0);(0;-1;0)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển $y^4$ sang một vế thì vế kia có dạng "bình phương của $x^2+z^2+k$ cộng phần dư", nên $y^4=(y^2)^2$ bị kẹp giữa hai bình phương của hai số nguyên liên tiếp và buộc phải bằng bình phương nhỏ hơn.

**Bước 1.** Chuyển $y^4$ sang vế phải và viết vế trái theo hai cách, một lần ghép với $(x^2+z^2+1)^2$ và một lần ghép với $(x^2+z^2+2)^2$, vì hạng tử bậc bốn của vế trái là $(x^2+z^2)^2$.

**Bước 2.** Dùng $x^2+2z^2\ge0$ và $x^2+3>0$ để chặn $y^4$ giữa hai bình phương liên tiếp của các số nguyên dương $x^2+z^2+1$ và $x^2+z^2+2$.

**Bước 3.** Vì $y^2$ là số nguyên nằm giữa hai số nguyên liên tiếp nên $y^2$ chỉ có thể bằng số nhỏ hơn, từ đó suy ra $x^2+2z^2=0$.

**Bước 4.** Giải ra $x,z$ rồi thay vào phương trình để tìm $y$, sau đó thử lại.

**Phần 2. Trình bày**

Phương trình đã cho tương đương với $y^4=x^4+z^4+2x^2z^2+3x^2+4z^2+1$.

Ta có $(x^2+z^2+1)^2=x^4+z^4+2x^2z^2+2x^2+2z^2+1$ nên $y^4=(x^2+z^2+1)^2+x^2+2z^2$. Do $x^2+2z^2\ge0$ nên $y^4\ge(x^2+z^2+1)^2$.

Ta có $(x^2+z^2+2)^2=x^4+z^4+2x^2z^2+4x^2+4z^2+4$ nên $y^4=(x^2+z^2+2)^2-(x^2+3)$. Do $x^2+3>0$ nên $y^4<(x^2+z^2+2)^2$.

Vậy $(x^2+z^2+1)^2\le(y^2)^2<(x^2+z^2+2)^2$, suy ra $x^2+z^2+1\le y^2<x^2+z^2+2$.

Vì $y^2$ là số nguyên nên $y^2=x^2+z^2+1$, tức $y^4=(x^2+z^2+1)^2$.

Thay vào $y^4=(x^2+z^2+1)^2+x^2+2z^2$ được $x^2+2z^2=0$, do đó $x=z=0$ và $y^2=1$, tức $y=\pm1$.

Thử lại: với $(0;\pm1;0)$ vế trái bằng $0-1+0+0+0+0+1=0$ (thỏa).

Vậy $S=\{(0;1;0);(0;-1;0)\}$.

=== T7B.4@p155
- bai: 4 · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Kẹp giữa hai số nguyên liên tiếp · làm trội $\dfrac{1}{k^2}<\dfrac{1}{k-1}-\dfrac{1}{k}$ · tổng thu gọn
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy tính chính xác bằng phân số n=2..59: n-2<S<n-1 và S không nguyên, khớp sách.
## DE
Chứng minh rằng: với mọi số tự nhiên $n\ge2$ thì $S=\dfrac{3}{4}+\dfrac{8}{9}+\dfrac{15}{16}+\dots+\dfrac{n^2-1}{n^2}$ không thể là một số nguyên.
## SACH
$S=\dfrac{2^2-1}{2^2}+\dfrac{3^2-1}{3^2}+\dfrac{4^2-1}{4^2}+\dots+\dfrac{n^2-1}{n^2}$

$S=\left(1-\dfrac{1}{2^2}\right)+\left(1-\dfrac{1}{3^2}\right)+\left(1-\dfrac{1}{4^2}\right)+\dots+\left(1-\dfrac{1}{n^2}\right)$

$S=n-1-\left(\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{n^2}\right)<n-1$. Vậy: $S<n-1$ (1)

Ta chứng minh: $S>n-2$

Thật vậy: $\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{n^2}<\dfrac{1}{1\cdot 2}+\dfrac{1}{2\cdot 3}+\dfrac{1}{3\cdot 4}+\dots+\dfrac{1}{(n-1)\cdot n}$

$<\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\left(\dfrac{1}{3}-\dfrac{1}{4}\right)+\dots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)<1-\dfrac{1}{n}$

Do đó: $S>n-1-\left(1-\dfrac{1}{n}\right)=n-2+\dfrac{1}{n}>n-2$.

Vậy: $S>n-2$ (2). Từ (1) và (2) ta suy ra: $n-2<S<n-1$ với mọi số nguyên dương $n\ge2$. Mà $n-2$ và $n-1$ là hai số nguyên dương liên tiếp nên $S$ không là số nguyên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng có dạng $\dfrac{k^2-1}{k^2}=1-\dfrac{1}{k^2}$, nên $S$ bằng một số nguyên trừ đi tổng các nghịch đảo bình phương; chỉ cần chặn tổng này trong khoảng $(0;1)$ là $S$ bị kẹp giữa hai số nguyên liên tiếp.

**Bước 1.** Tách mỗi phân số thành $1$ trừ một phân số để $S$ trở thành $n-1$ trừ tổng $T$ của các $\dfrac{1}{k^2}$.

**Bước 2.** Chặn $T>0$ ngay từ định nghĩa để có chặn trên $S<n-1$.

**Bước 3.** Làm trội từng số hạng $\dfrac{1}{k^2}$ bằng $\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac{1}{k}$ để tổng thu gọn liên tiếp, từ đó chặn $T<1$ và có chặn dưới của $S$.

**Bước 4.** Kết luận $S$ nằm giữa hai số nguyên liên tiếp nên không thể là số nguyên.

**Phần 2. Trình bày**

$S=\sum_{k=2}^{n}\dfrac{k^2-1}{k^2}=\sum_{k=2}^{n}\left(1-\dfrac{1}{k^2}\right)=(n-1)-T$ với $T=\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{n^2}$.

Vì $T>0$ nên $S<n-1$.

Với mọi $k\ge2$ ta có $\dfrac{1}{k^2}<\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac{1}{k}$, nên

$T<\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\dots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)=1-\dfrac{1}{n}<1$.

Suy ra $S=n-1-T>n-2$.

Vậy $n-2<S<n-1$ với mọi số tự nhiên $n\ge2$. Hai số $n-2$ và $n-1$ là hai số nguyên liên tiếp nên không có số nguyên nào nằm giữa chúng, tức $S$ không là số nguyên.

=== T7B.5@p155
- bai: 5 · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Định lí Pi-ta-go · hằng đẳng thức · phương trình tích nghiệm nguyên (nhân hai vế rồi thêm bớt)
- kiem: khong
- ket_qua_sach: 5,12,13; 6,8,10
- dap_an: Các cạnh $5;12;13$ hoặc $6;8;10$
- ghi_chu_nghi: Máy vét x<=y<400, z<600 cho đúng (5;12;13) và (6;8;10), khớp sách. Sách bỏ qua trường hợp hai nhân tử (x-4),(y-4) cùng âm; lời giải kho có xét và loại.
## DE
Tìm tất cả các tam giác vuông có ba cạnh là số nguyên và có diện tích bằng chu vi.
## SACH
Gọi $x,y,z$ là các cạnh của tam giác vuông $1\le x\le y<z$.

Ta có: $\begin{cases}x^2+y^2=z^2\ (*)\\xy=2(x+y+z)\ (**)\end{cases}$

Từ $(*)$ ta có: $z^2=(x+y)^2-2xy=(x+y)^2-4(x+y+z)=(x+y)^2-4(x+y)-4z$

$\Leftrightarrow z^2+4z+4=(x+y)^2-4(x+y)+4\Leftrightarrow(z+2)^2=(x+y-2)^2\Leftrightarrow x+y-2=z+2$ (vì $x+y\ge2$)

Thay $z=x+y-4$ vào $(**)$ ta được:

$(x-4)(y-4)=8\Leftrightarrow\begin{cases}x-4=1\\y-4=8\end{cases}$ hoặc $\begin{cases}x-4=2\\y-4=4\end{cases}$ (vì $y\ge x$) $\Leftrightarrow\begin{cases}x=5\\y=12\end{cases}$ hoặc $\begin{cases}x=6\\y=8\end{cases}$

Vậy độ dài các cạnh tam giác vuông cần tìm là: $5,12,13$ hoặc $6,8,10$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai điều kiện "vuông" và "diện tích bằng chu vi" cho hệ hai phương trình ba ẩn; viết $z^2=(x+y)^2-2xy$ rồi thay $2xy$ bằng $4(x+y+z)$ sẽ ra một đẳng thức bình phương và khử được $z$.

**Bước 1.** Đặt ba cạnh nguyên $x\le y<z$ với $z$ là cạnh huyền rồi lập hai phương trình: Pi-ta-go và diện tích bằng chu vi.

**Bước 2.** Biểu diễn $z^2$ qua $x+y$ và $xy$, dùng phương trình thứ hai thay $xy$ để thu được hai bình phương bằng nhau, từ đó suy ra $z$ theo $x+y$.

**Bước 3.** Thay $z$ vào phương trình diện tích để được phương trình hai ẩn, nhân tử hóa thành $(x-4)(y-4)=8$ rồi xét các cặp ước của $8$.

**Bước 4.** Tính $z$ cho mỗi cặp tìm được và thử lại điều kiện diện tích bằng chu vi.

**Phần 2. Trình bày**

Gọi ba cạnh là $x\le y<z$ ($z$ là cạnh huyền), đều là số nguyên dương. Ta có $x^2+y^2=z^2$ (1) và $\dfrac{xy}{2}=x+y+z$, tức $xy=2(x+y+z)$ (2).

Từ (1): $z^2=(x+y)^2-2xy=(x+y)^2-4(x+y+z)$ (theo (2))

$\Leftrightarrow z^2+4z+4=(x+y)^2-4(x+y)+4$

$\Leftrightarrow (z+2)^2=(x+y-2)^2$

Vì $z+2>0$ nên $x+y-2=\pm(z+2)$. Trường hợp $x+y-2=-(z+2)$ cho $x+y=-z<0$ (loại), nên $x+y-2=z+2$, tức $z=x+y-4$.

Thay vào (2): $xy=2(2x+2y-4)=4x+4y-8\Leftrightarrow xy-4x-4y+16=8\Leftrightarrow(x-4)(y-4)=8$.

Vì $x\le y$ nên $x-4\le y-4$, và tích bằng $8>0$ nên hai thừa số cùng dấu.

Cùng âm: do $x,y\ge1$ nên cả hai thừa số thuộc $\{-3;-2;-1\}$, tích chỉ có thể là $1;2;3;4;6;9$, không bằng $8$ (loại).

Cùng dương: $(x-4;y-4)\in\{(1;8);(2;4)\}$ nên $(x;y)=(5;12)$ hoặc $(6;8)$, ứng với $z=13$ và $z=10$.

Thử lại: $\dfrac{5\cdot12}{2}=30=5+12+13$; $\dfrac{6\cdot8}{2}=24=6+8+10$ (thỏa).

Vậy các tam giác cần tìm có ba cạnh $5;12;13$ hoặc $6;8;10$.

=== T7B.6@p156
- bai: 6 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Viết số dưới dạng tổng theo vị trí chữ số · xét số dư của $10^n$ khi chia cho $7$
- kiem: khong
- ket_qua_sach: 142857
- dap_an: $142857$
- ghi_chu_nghi: Máy duyệt mọi số từ 100000 đến 10^7 bắt đầu bằng chữ số 1: chỉ 142857 thỏa chuyển 1 xuống cuối thì được gấp ba. Khớp sách.
## DE
Tìm số tự nhiên nhỏ nhất bắt đầu từ chữ số $1$ sao cho nếu chuyển $1$ xuống vị trí cuối cùng thì số đã cho tăng lên ba lần.
## SACH
Gọi số cần tìm là: $A=\overline{1a_1a_2\dots a_n}$. Đặt $B=\overline{a_1a_2\dots a_n}$. Ta có: $A=\overline{1B}$.

Theo đề bài ta có: $\overline{B1}=3\cdot\overline{1B}$.

Suy ra: $10B+1=3(10^n+B)\Leftrightarrow B=\dfrac{3\cdot10^n-1}{7}$.

Bằng phép thử với $n=5$ thì $B=42857$.

Khi đó số bé nhất cần tìm là $A=142857$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số cần tìm là "chữ số $1$ rồi đến một số $B$", còn số sau khi chuyển là "$B$ rồi đến chữ số $1$"; hai số này đều viết được qua $B$ và $10^n$ nên đề bài thành một phương trình ẩn $B$.

**Bước 1.** Gọi $n$ là số chữ số đứng sau chữ số $1$ và viết số ban đầu, số mới theo $B$ và lũy thừa của $10$.

**Bước 2.** Lập phương trình "số mới gấp ba số cũ" và rút $7B$ theo $10^n$ để thấy điều kiện $3\cdot10^n-1$ phải chia hết cho $7$.

**Bước 3.** Tìm $n$ nhỏ nhất thỏa điều kiện chia hết bằng cách xét số dư của $10^n$ khi chia cho $7$, vì $n$ càng nhỏ thì số $A$ càng bé.

**Bước 4.** Tính $B$ rồi $A$ ứng với $n$ nhỏ nhất đó.

**Phần 2. Trình bày**

Gọi số cần tìm là $A=\overline{1a_1a_2\dots a_n}$ ($n\ge1$) và $B=\overline{a_1a_2\dots a_n}$. Khi đó $A=10^n+B$ và số mới là $\overline{a_1a_2\dots a_n1}=10B+1$.

Theo đề: $10B+1=3(10^n+B)\Leftrightarrow7B=3\cdot10^n-1$.

Vậy $3\cdot10^n-1$ phải chia hết cho $7$. Xét số dư của $3\cdot10^n-1$ khi chia cho $7$ (dùng $10\equiv3\pmod{7}$):

$n=1$: $29=4\cdot7+1$, dư $1$. $n=2$: $299=42\cdot7+5$, dư $5$. $n=3$: $2999=428\cdot7+3$, dư $3$. $n=4$: $29999=4285\cdot7+4$, dư $4$. $n=5$: $299999=7\cdot42857$, dư $0$.

Vậy $n=5$ là giá trị nhỏ nhất thỏa mãn, khi đó $B=\dfrac{299999}{7}=42857$ (có đủ $5$ chữ số) và $A=142857$.

Số $A$ càng bé khi $n$ càng bé nên số cần tìm là $142857$.

=== T7B.7@p156
- bai: 7 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Số chính phương có hai chữ số · xét chữ số tận cùng · liệt kê bình phương trong một khoảng
- kiem: khong
- ket_qua_sach: 1936
- dap_an: $a=1,\ b=9,\ c=3,\ d=6$ (số $1936$)
- ghi_chu_nghi: Máy vét a,b,c,d: duy nhất (1;9;3;6). Sách liệt kê 6 dạng 1b16...4b49 mà không loại hết các cặp (a;d) không hợp lệ, vẫn ra 1936; lời giải kho loại gọn hơn.
## DE
Hãy tìm các chữ số $a,b,c,d$; biết rằng $a$, $\overline{cd}$, $\overline{ad}$, $\overline{abcd}$ là các số chính phương.
## SACH
Do $a$ chính phương nên $a$ bằng $1$, $4$ hoặc $9$. Do đó $\overline{ad}$ bằng $16$ hay $49$. Suy ra $\overline{cd}$ bằng $16$, $36$ hay $49$. Từ những điều này ta có $a=1$ hoặc $a=4$.

Vậy $\overline{abcd}$ có dạng: $\overline{1b16}$, $\overline{1b36}$, $\overline{1b49}$, $\overline{4b16}$, $\overline{4b36}$, $\overline{4b49}$ trong này chỉ có $1936$ là số chính phương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chữ số $a$ là số chính phương một chữ số và $\overline{ad}$ là số chính phương hai chữ số bắt đầu bằng $a$; danh sách số chính phương hai chữ số rất ngắn nên $a$ và $d$ chỉ còn hai khả năng.

**Bước 1.** Liệt kê các số chính phương một chữ số cho $a$, rồi chọn trong các số chính phương hai chữ số những số có chữ số đầu bằng $a$ để xác định cặp $(a;d)$.

**Bước 2.** Suy ra giá trị cần có của $\overline{cd}$ từ chữ số tận cùng $d$ và danh sách số chính phương hai chữ số.

**Bước 3.** Với mỗi cặp $(a;d)$, liệt kê các số chính phương bốn chữ số bắt đầu bằng $a$ và giữ lại số có hai chữ số cuối đúng bằng $\overline{cd}$ đã tìm.

**Phần 2. Trình bày**

Số chính phương một chữ số khác $0$ là $1;4;9$ nên $a\in\{1;4;9\}$.

Các số chính phương có hai chữ số là $16;25;36;49;64;81$. Số có chữ số đầu là $a$ chỉ có $16$ (với $a=1$) và $49$ (với $a=4$); không có số nào bắt đầu bằng $9$. Vậy $(a;d)=(1;6)$ hoặc $(4;9)$.

Trường hợp $a=1,d=6$: $\overline{cd}$ tận cùng bằng $6$ và là số chính phương nên $\overline{cd}\in\{16;36\}$. Các số chính phương bốn chữ số bắt đầu bằng $1$ là $32^2;\dots;44^2$, tức $1024;1089;1156;1225;1296;1369;1444;1521;1600;1681;1764;1849;1936$. Chỉ có $1936=44^2$ tận cùng bằng $16$ hoặc $36$.

Trường hợp $a=4,d=9$: $\overline{cd}$ tận cùng bằng $9$ nên $\overline{cd}\in\{09;49\}$. Các số chính phương bốn chữ số bắt đầu bằng $4$ là $64^2;\dots;70^2$, tức $4096;4225;4356;4489;4624;4761;4900$; không số nào tận cùng bằng $09$ hoặc $49$ (loại).

Vậy $\overline{abcd}=1936$, tức $a=1,b=9,c=3,d=6$. Thử lại: $a=1=1^2$, $\overline{cd}=36=6^2$, $\overline{ad}=16=4^2$, $\overline{abcd}=1936=44^2$.

=== T7B.8@p156
- bai: 8 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên lí Đi-rích-lê · phân tích theo trường hợp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm đủ 2^15 đồ thị trên 6 đỉnh: luôn có tam giác hoặc bộ ba đôi một không nối, khớp khẳng định của đề. Mép trái ảnh mất vài chữ cái đầu dòng, tự bù theo ngữ cảnh.
## DE
Trong một hội nghị quốc tế có $6$ đại biểu ở cùng một khách sạn. Nếu bất cứ $3$ người nào gặp nhau thì trong họ có ít nhất $2$ người có thể trò chuyện với nhau được. Chứng minh rằng có ba người từng đôi nói chuyện với nhau được.
## SACH
Xét người A. Trong $5$ người còn lại phải có ba người cùng nói chuyện được hoặc cùng không nói chuyện được với A, ta gọi ba người này là B, C, D.

Giả sử cả B, C, D cùng nói chuyện được với A. Theo giả thiết, có ít nhất hai trong ba người ấy nói chuyện được với nhau, cùng với A, họ lập thành một bộ ba cần tìm.

Giả sử B, C, D cùng không nói chuyện được với A. Theo giả thiết, suy ra rằng nhóm (B, C, A) có B, C nói chuyện với nhau; nhóm (B, D, A) có B, D nói chuyện với nhau; nhóm (C, D, A) có D, C nói chuyện với nhau. Vậy lúc này (B, C, D) là bộ ba phải tìm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chọn một người làm mốc rồi chia $5$ người còn lại thành hai nhóm "nói chuyện được" và "không nói chuyện được" với người đó; $5$ người chia hai nhóm thì có nhóm đủ ba người, dấu hiệu dùng nguyên lí Đi-rích-lê.

**Bước 1.** Chọn đại biểu A làm mốc và phân loại $5$ đại biểu còn lại theo việc có nói chuyện được với A hay không, rồi dùng Đi-rích-lê để chỉ ra ba người cùng loại.

**Bước 2.** Xét trường hợp ba người đó đều nói chuyện được với A, rồi dùng giả thiết cho bộ ba gồm chính họ để tìm một cặp nói chuyện được với nhau.

**Bước 3.** Xét trường hợp ba người đó đều không nói chuyện được với A, rồi áp dụng giả thiết cho từng bộ ba có A để suy ra ba người đó đôi một nói chuyện được.

**Phần 2. Trình bày**

Chọn một đại biểu A. Mỗi người trong $5$ đại biểu còn lại hoặc nói chuyện được với A hoặc không. Vì $5=2\cdot2+1$ nên theo nguyên lí Đi-rích-lê có ít nhất $3$ người thuộc cùng một loại; gọi ba người đó là B, C, D.

Trường hợp 1: B, C, D đều nói chuyện được với A. Xét ba người B, C, D: theo giả thiết có ít nhất hai người nói chuyện được với nhau, chẳng hạn B và C. Khi đó A, B, C đôi một nói chuyện được với nhau.

Trường hợp 2: B, C, D đều không nói chuyện được với A. Xét bộ ba (A, B, C): A không nói chuyện được với B và C nên theo giả thiết B và C phải nói chuyện được với nhau. Tương tự, xét (A, B, D) thì B và D nói chuyện được, xét (A, C, D) thì C và D nói chuyện được. Vậy B, C, D đôi một nói chuyện được với nhau.

Trong cả hai trường hợp đều có ba người từng đôi nói chuyện được với nhau.

=== T7B.9@p156
- bai: 9 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Viết số theo cơ số $7$ và $11$ · điều kiện chia hết · giới hạn chữ số
- kiem: khong
- ket_qua_sach: 155
- dap_an: $n=155$ hoặc $n=310$
- ghi_chu_nghi: Sách sai ở nhánh x=6: viết y=30z-38 (đúng là y=20z-38) nên loại nhầm; với z=2 được y=2, tức n=310 (cơ số 7 là 622, cơ số 11 là 262) cũng thỏa. Máy vét n<5000 ra đúng hai số 155 và 310. Lời giải kho theo bản đúng nên đáp án có hai số.
## DE
Xác định số $n$, biết rằng, trong hệ đếm cơ số $7$ thì $n$ được viết $n=\overline{xyz}$, trong hệ đếm cơ số $11$ thì nó được viết $n=\overline{zxy}$.
## SACH
Ta phải có $0\le x,y,z\le6$. Từ giả thiết:

$49x+7y+z=121z+11x+y\Rightarrow19x=60z-3y$

Do đó $x$ chia hết cho $3$, tức là $x=3$ hoặc $x=6$.

* $x=3$ thì $y=20z-19$, suy ra $z=1;y=1$.

* $x=6$ thì $y=30z-38$ (loại).

Vậy, số phải tìm là $155$, viết trong cơ số $7$ là $311$ và trong cơ số $11$ là $131$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cùng một số $n$ được viết bằng hai cơ số khác nhau với các chữ số xoay vòng, nên khai triển theo giá trị vị trí ở mỗi cơ số rồi cho hai biểu thức bằng nhau để có phương trình ba ẩn là các chữ số bị chặn.

**Bước 1.** Khai triển $n$ theo cơ số $7$ và theo cơ số $11$, nhớ rằng chữ số cơ số $7$ chỉ từ $0$ đến $6$ và các chữ số đầu khác $0$.

**Bước 2.** Cho hai khai triển bằng nhau và rút gọn thành phương trình có hệ số nhỏ, quan sát tính chia hết cho $3$ để giới hạn $x$.

**Bước 3.** Với mỗi giá trị của $x$, biểu diễn $y$ theo $z$ rồi dùng giới hạn $y\le6$ để tìm $z$ và $y$, sau đó tính $n$.

**Phần 2. Trình bày**

Vì $x,y,z$ là chữ số cơ số $7$ nên $0\le x,y,z\le6$, và $x\ge1$, $z\ge1$ vì là chữ số đầu của $\overline{xyz}$ và $\overline{zxy}$.

$49x+7y+z=121z+11x+y\Leftrightarrow38x+6y=120z\Leftrightarrow19x+3y=60z$.

Suy ra $19x\vdots3$, mà $\gcd(19;3)=1$ nên $x\vdots3$, tức $x\in\{3;6\}$.

Với $x=3$: $57+3y=60z\Leftrightarrow y=20z-19$. Vì $0\le y\le6$ nên $z=1$ và $y=1$.

Với $x=6$: $114+3y=60z\Leftrightarrow y=20z-38$. Vì $0\le y\le6$ nên $z=2$ và $y=2$.

Với $(x;y;z)=(3;1;1)$: $n=3\cdot49+7+1=155$; kiểm tra cơ số $11$: $\overline{zxy}=\overline{131}_{11}=121+33+1=155$ (thỏa).

Với $(x;y;z)=(6;2;2)$: $n=6\cdot49+14+2=310$; kiểm tra cơ số $11$: $\overline{zxy}=\overline{262}_{11}=242+66+2=310$ (thỏa).

Vậy $n=155$ (viết $311$ trong cơ số $7$, $131$ trong cơ số $11$) hoặc $n=310$ (viết $622$ trong cơ số $7$, $262$ trong cơ số $11$).

=== T7B.10@p156
- bai: 10 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hai đa thức bằng nhau với mọi $x$ (thay giá trị riêng · đồng nhất hệ số) · phương trình tích nghiệm nguyên
- kiem: khong
- ket_qua_sach: (a;b;c)=(-10;-3;-11); (2;3;-5)
- dap_an: $(a;b;c)\in\{(-10;-3;-11);(-10;-11;-3);(2;3;-5);(2;-5;3)\}$
- ghi_chu_nghi: Máy vét a,b,c trong [-60;60]: đúng 4 bộ trên (hai bộ sách nêu và hai bộ hoán đổi b,c).
## DE
Tìm các số nguyên $a,b,c$ sao cho đa thức $(x+a)(x-4)-7$ phân tích thành thừa số được: $(x+b)(x+c)$.
## SACH
Với mọi $x$ ta có: $(x+a)(x-4)-7=(x+b)(x+c)$

Nên với $x=4$ thì $-7=(4+b)(4+c)$

Có $2$ trường hợp: $\begin{cases}4+b=1\\4+c=-7\end{cases}$ hoặc $\begin{cases}4+b=7\\4+c=-1\end{cases}$

Trường hợp thứ nhất cho $b=-3;c=-11;a=-10$.

Ta có: $(x-10)(x-4)-7=(x-3)(x-11)$

Trường hợp thứ hai cho $b=3;c=-5;a=2$

Ta có $(x+2)(x-4)-7=(x+3)(x-5)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai đa thức bằng nhau với mọi $x$ thì bằng nhau tại $x=4$, mà tại đó vế trái triệt tiêu hạng tử chứa $a$, chỉ còn $-7=(4+b)(4+c)$ là tích hai số nguyên bằng một số nhỏ nên liệt kê được.

**Bước 1.** Thay $x=4$ vào đẳng thức để làm mất $a$ và được một phương trình tích có vế phải là $-7$ với hai ẩn $b,c$.

**Bước 2.** Liệt kê các cặp ước của $-7$ để tìm mọi cặp $(b;c)$, nhớ rằng $b$ và $c$ có thể đổi chỗ cho nhau.

**Bước 3.** Đồng nhất hệ số của $x$ ở hai vế để suy ra $a$ theo $b+c$, rồi thử lại bằng cách so sánh hệ số tự do.

**Phần 2. Trình bày**

Đẳng thức $(x+a)(x-4)-7=(x+b)(x+c)$ đúng với mọi $x$. Thay $x=4$: $-7=(4+b)(4+c)$.

Vì $b,c$ nguyên và $7$ là số nguyên tố nên $(4+b;4+c)\in\{(1;-7);(-7;1);(7;-1);(-1;7)\}$, tức $(b;c)\in\{(-3;-11);(-11;-3);(3;-5);(-5;3)\}$.

Khai triển hai vế: $x^2+(a-4)x-4a-7=x^2+(b+c)x+bc$. Đồng nhất hệ số của $x$ cho $a-4=b+c\Rightarrow a=b+c+4$.

Với $b+c=-14$ thì $a=-10$. Thử hệ số tự do: $-4a-7=33=(-3)(-11)=bc$ (thỏa).

Với $b+c=-2$ thì $a=2$. Thử hệ số tự do: $-4a-7=-15=3\cdot(-5)=bc$ (thỏa).

Vậy $(a;b;c)\in\{(-10;-3;-11);(-10;-11;-3);(2;3;-5);(2;-5;3)\}$ (với mỗi giá trị của $a$, hai bộ $(b;c)$ chỉ khác nhau do hoán đổi $b$ và $c$).

=== T7B.11@p156
- bai: 11 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nhóm hạng tử đưa về tích · phương trình tích nghiệm nguyên dương · chặn bằng bất đẳng thức
- kiem: khong
- ket_qua_sach: (4;1)
- dap_an: $(x;y)=(4;1)$
- ghi_chu_nghi: Máy vét x,y trong [1;99] chỉ có (4;1), khớp sách. Lời giải kho giải bằng cách chặn $2p<q<3p$ thay cho xét parity của sách.
## DE
Tìm $x,y$ nguyên dương thỏa mãn phương trình: $3x^2+10xy+8y^2=96$.
## SACH
$3x^2+10xy+8y^2=96$

$\Leftrightarrow3x^2+4xy+6xy+8y^2=96\Leftrightarrow(3x^2+6xy)+(4xy+8y^2)=96$

$\Leftrightarrow3x(x+2y)+4y(x+2y)=96\Leftrightarrow(x+2y)(3x+4y)=96$. Do $x,y$ nguyên dương nên $x+2y$; $3x+4y$ nguyên dương và $3x+4y>x+2y\ge3$. Mà $96=2^5\cdot3$ có các ước là $1;2;3;4;6;8;12;24;32;48;96$ được biểu diễn thành tích $2$ thừa số không nhỏ hơn $3$ là: $96=3\cdot32=4\cdot24=6\cdot16=8\cdot12$

Lại có $x+2y$ và $3x+4y$ có tích là $96$ (số chẵn) có tổng $4x+6y$ là số chẵn do đó $\begin{cases}x+2y=4\\3x+4y=24\end{cases}$

Hệ phương trình này vô nghiệm.

Hoặc $\begin{cases}x+2y=6\\3x+4y=16\end{cases}\Rightarrow\begin{cases}x=4\\y=1\end{cases}$

Hoặc $\begin{cases}x+2y=8\\3x+4y=12\end{cases}$. Hệ phương trình vô nghiệm.

Vậy các số $x,y$ nguyên dương cần tìm là $(x,y)=(4,1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tam thức bậc hai theo $x,y$ có hệ số "đẹp" nên nhóm hạng tử đưa được về tích $(x+2y)(3x+4y)$ bằng $96$; hai nhân tử đều nguyên dương, và đặt chúng là $p,q$ thì $x,y$ biểu diễn được qua $p,q$.

**Bước 1.** Tách $10xy=4xy+6xy$ rồi nhóm hạng tử để đặt nhân tử chung $x+2y$, đưa phương trình về dạng tích bằng $96$.

**Bước 2.** Đặt $p=x+2y$, $q=3x+4y$ và giải ngược $x,y$ theo $p,q$ để biến điều kiện $x,y$ nguyên dương thành bất đẳng thức giữa $p$ và $q$.

**Bước 3.** Kết hợp bất đẳng thức đó với $pq=96$ để chặn $p$ trong một khoảng rất hẹp rồi tìm $p$, $q$, từ đó tính $x,y$.

**Phần 2. Trình bày**

$3x^2+10xy+8y^2=96\Leftrightarrow(3x^2+6xy)+(4xy+8y^2)=96$

$\Leftrightarrow3x(x+2y)+4y(x+2y)=96$

$\Leftrightarrow(x+2y)(3x+4y)=96$

Đặt $p=x+2y$, $q=3x+4y$ ($p,q$ nguyên dương, $pq=96$). Từ $q-3p=-2y$ và $q-2p=x$ ta có $y=\dfrac{3p-q}{2}$ và $x=q-2p$.

Vì $x>0$ và $y>0$ nên $2p<q<3p$. Nhân với $p>0$: $2p^2<pq=96<3p^2$, tức $32<p^2<48$, suy ra $p=6$ (vì $p$ nguyên dương, $5^2=25<32$ và $7^2=49>48$).

Khi đó $q=\dfrac{96}{6}=16$, suy ra $y=\dfrac{18-16}{2}=1$ và $x=16-12=4$.

Thử lại: $3\cdot16+10\cdot4+8=48+40+8=96$ (thỏa).

Vậy $(x;y)=(4;1)$.

=== T7B.12@p156
- bai: 12 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tích bốn số nguyên liên tiếp cộng $1$ là số chính phương · kẹp giữa hai bình phương liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Trong "Hướng dẫn và đáp số" của bài 12, sau lời giải còn xen một đoạn "b) Chứng minh rằng với số nguyên dương a chia cho 4 dư 2 thì P=3^n+an+3 chia hết cho 4..." mà đề bài 12 không có ý b; đó là đoạn lạc từ bài khác nên không chép vào câu này. Máy: không có x nguyên dương nào (x<100000) để x(x+1)(x+2)(x+3) là số chính phương.
## DE
Chứng minh rằng tích của $4$ số nguyên dương liên tiếp không thể là số chính phương.
## SACH
Gọi bốn số nguyên dương liên tiếp là $x;x+1;x+2;x+3$ với $x$ nguyên dương. Giả sử $x(x+1)(x+2)(x+3)=k^2\Leftrightarrow(x^2+3x)(x^2+3x+2)=k^2$

$\Leftrightarrow(x^2+3x+1)^2-1=k^2$. Trong đó $(x^2+3x+1)^2$ và $k^2$ là hai số chính phương hơn kém nhau $1$ đơn vị nên $(x^2+3x+1)^2=1$ và $k^2=0\Rightarrow x=0;x=-3$ trái với giả thiết. Vậy tích của bốn số nguyên dương liên tiếp không thể là số chính phương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tích bốn số nguyên liên tiếp ghép thành hai cặp đầu cuối $x(x+3)$ và $(x+1)(x+2)$ hơn kém nhau $2$, nên tích bằng bình phương của số giữa trừ đi $1$ và bị kẹp giữa hai bình phương liên tiếp.

**Bước 1.** Ghép số đầu với số cuối, hai số giữa với nhau để hai tích có dạng $m-1$ và $m+1$ với cùng một biểu thức $m$.

**Bước 2.** Dùng hằng đẳng thức hiệu hai bình phương để viết tích đã cho thành $m^2-1$, nhớ $m=x^2+3x+1$.

**Bước 3.** So sánh $m^2-1$ với hai bình phương liên tiếp $(m-1)^2$ và $m^2$ để thấy nó nằm giữa chúng, nên không thể là một số chính phương.

**Phần 2. Trình bày**

Gọi bốn số nguyên dương liên tiếp là $x;x+1;x+2;x+3$ ($x\ge1$) và $P$ là tích của chúng.

$P=x(x+3)\cdot(x+1)(x+2)=(x^2+3x)(x^2+3x+2)$

Đặt $m=x^2+3x+1$, khi đó $P=(m-1)(m+1)=m^2-1$ với $m\ge5$.

Vì $m\ge2$ nên $(m-1)^2=m^2-2m+1<m^2-1$, và rõ ràng $m^2-1<m^2$.

Vậy $(m-1)^2<P<m^2$ với $m-1$ và $m$ là hai số nguyên dương liên tiếp, nên $P$ không là bình phương của số nguyên nào.

Vậy tích của bốn số nguyên dương liên tiếp không thể là số chính phương.

=== T7B.13@p156
- bai: 13 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đưa về bình phương bằng nhau · số nguyên là bình phương của số hữu tỉ thì là chính phương · phương trình tích nghiệm nguyên
- kiem: khong
- ket_qua_sach: (0;0); (4;-1); (4;2); (-4;1); (-4;-2)
- dap_an: $(x;y)\in\{(0;0);(4;-1);(4;2);(-4;1);(-4;-2)\}$
- ghi_chu_nghi: Máy vét x,y trong [-300;300]: đúng 5 nghiệm trên, khớp sách. Sách chỉ ghi các bước đầu và kết quả; lời giải kho viết đủ.
## DE
Tìm các số nguyên $x;y$ thỏa mãn $x^2y^2-x^2-8y^2=2xy$.
## SACH
$x^2y^2-x^2-8y^2=2xy$ (1). Ta có $x=y=0$ là một nghiệm của phương trình. Xét $x;y\ne0$. Từ (1) $\Leftrightarrow y^2(x^2-7)=(x+y)^2$

$\Rightarrow x^2-7$ là số chính phương $\Rightarrow x^2-7=a^2\Rightarrow(x-a)(x+a)=7$

Kết quả: $(x;y)=(0;0);(4;-1);(4;2);(-4;1);(-4;-2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển các hạng tử về dạng $y^2(x^2-7)=(x+y)^2$ để thấy $x^2-7$ bằng bình phương của số hữu tỉ $\dfrac{x+y}{y}$, mà số nguyên là bình phương của số hữu tỉ thì phải là số chính phương.

**Bước 1.** Xét riêng các trường hợp một ẩn bằng $0$ vì sau này phải chia cho $y$.

**Bước 2.** Với $x,y\ne0$, nhóm hạng tử để biến phương trình thành $y^2(x^2-7)=(x+y)^2$ rồi chia cho $y^2$ để cô lập $x^2-7$.

**Bước 3.** Suy ra $x^2-7$ là số chính phương $a^2$, đưa về $(x-a)(x+a)=7$ để tìm $x$ bằng cách xét các ước của $7$.

**Bước 4.** Thay $x$ vừa tìm vào hệ thức $(x+y)^2=a^2y^2$ để giải $y$ và thử lại.

**Phần 2. Trình bày**

Nếu $y=0$ thì phương trình thành $-x^2=0$ nên $x=0$. Nếu $x=0$ thì $-8y^2=0$ nên $y=0$. Vậy $(0;0)$ là nghiệm.

Xét $x\ne0$, $y\ne0$. Phương trình tương đương với $x^2y^2-7y^2=x^2+2xy+y^2$, tức $y^2(x^2-7)=(x+y)^2$.

Suy ra $x^2-7=\left(\dfrac{x+y}{y}\right)^2$ là bình phương của một số hữu tỉ mà lại là số nguyên, nên $x^2-7=a^2$ với $a$ nguyên không âm.

$x^2-a^2=7\Leftrightarrow(\lvert x\rvert-a)(\lvert x\rvert+a)=7$. Vì $\lvert x\rvert+a\ge\lvert x\rvert-a\ge0$ và $7$ là số nguyên tố nên $\lvert x\rvert-a=1$, $\lvert x\rvert+a=7$, suy ra $\lvert x\rvert=4$, $a=3$.

Khi đó $(x+y)^2=9y^2\Leftrightarrow x+y=\pm3y\Leftrightarrow x=2y$ hoặc $x=-4y$.

Với $x=4$: $y=2$ hoặc $y=-1$. Với $x=-4$: $y=-2$ hoặc $y=1$.

Thử lại, chẳng hạn $(4;2)$: vế trái $64-16-32=16$, vế phải $2\cdot4\cdot2=16$ (thỏa); bốn nghiệm còn lại thử tương tự đều thỏa.

Vậy $S=\{(0;0);(4;-1);(4;2);(-4;1);(-4;-2)\}$.

=== T7B.14@p156
- bai: 14 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Trung bình nhân · bình phương hai vế khi cả hai vế dương · đưa về hằng đẳng thức $(r-17)^2=288$
- kiem: khong
- ket_qua_sach: 17\pm12\sqrt{2}
- dap_an: $\dfrac{x}{y}=17+12\sqrt{2}$ hoặc $\dfrac{x}{y}=17-12\sqrt{2}$
- ghi_chu_nghi: Máy thay hai giá trị r vào (r+1)^2/r được 36 (đúng như (x+y)^2=36xy), khớp sách. Lời giải kho dùng hằng đẳng thức $(r-17)^2=288$ thay cho công thức nghiệm của sách.
## DE
Cho hai số dương $x,y$. Biết tổng của chúng bằng $6$ lần trung bình nhân của chúng. Tính tỉ số $\dfrac{x}{y}$.
## SACH
Ta có $x+y=6\sqrt{xy}$. Chia cả hai vế cho $y$ ta được: $\dfrac{x}{y}+1=6\sqrt{\dfrac{x}{y}}$

Đặt $t=\sqrt{\dfrac{x}{y}}>0$; ta có phương trình: $t^2-6t+1=0$

Giải phương trình ta được hai nghiệm: $t_1=3+2\sqrt{2}$ và $t_2=3-2\sqrt{2}$

Vậy $\dfrac{x}{y}=t^2=17\pm12\sqrt{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trung bình nhân của $x,y$ là $\sqrt{xy}$ nên đề cho $x+y=6\sqrt{xy}$; bình phương hai vế (đều dương) để mất căn rồi chia cho $y^2$ thì chỉ còn một ẩn là tỉ số $\dfrac{x}{y}$.

**Bước 1.** Viết điều kiện "tổng bằng $6$ lần trung bình nhân" thành phương trình có căn rồi bình phương hai vế vì cả hai vế đều dương.

**Bước 2.** Chia hai vế cho $y^2$ và đặt $r=\dfrac{x}{y}$ để thu được phương trình bậc hai ẩn $r$ có hệ số đối xứng.

**Bước 3.** Đưa vế trái về dạng bình phương một hiệu cộng hằng số rồi giải $r$, kiểm tra $r>0$.

**Phần 2. Trình bày**

Trung bình nhân của $x,y$ là $\sqrt{xy}$, nên $x+y=6\sqrt{xy}$. Hai vế đều dương nên bình phương hai vế được:

$(x+y)^2=36xy\Leftrightarrow x^2-34xy+y^2=0$

Chia hai vế cho $y^2>0$ và đặt $r=\dfrac{x}{y}>0$: $r^2-34r+1=0$

$\Leftrightarrow(r-17)^2=288=(12\sqrt{2})^2$

$\Leftrightarrow r=17+12\sqrt{2}$ hoặc $r=17-12\sqrt{2}$

Cả hai giá trị đều dương vì $17^2=289>288=(12\sqrt{2})^2$ nên $17>12\sqrt{2}$ (nhận).

Vậy $\dfrac{x}{y}=17+12\sqrt{2}$ hoặc $\dfrac{x}{y}=17-12\sqrt{2}$.

=== T7B.15@p156
- bai: 15 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: $a^m+b^m$ chia hết cho $a+b$ khi $m$ lẻ · ghép cặp đối xứng · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm trực tiếp n=1..79: A chia hết cho B, khớp.
## DE
Cho $A=1^{2005}+2^{2005}+3^{2005}+\dots+n^{2005}$, $B=1+2+3+\dots+n$ với $n\in\mathbb{N}^*$. Chứng minh $A\vdots B$.
## SACH
$B=1+2+3+\dots+n\Rightarrow2B=n(n+1)$; $A=1^{2005}+2^{2005}+3^{2005}+\dots+n^{2005}$

$\Rightarrow2A=(1^{2005}+n^{2005})+\left[2^{2005}+(n-1)^{2005}\right]+\dots+\left[(n-1)^{2005}+2^{2005}\right]+(n^{2005}+1^{2005})$

Các biểu thức trong ngoặc đều chia hết cho $n+1$ nên: $2A\vdots(n+1)$ (1)

Lại có:

$2A=\left(1^{2005}+(n-1)^{2005}\right)+\left[2^{2005}+(n-2)^{2005}\right]+\dots+\left[(n-1)^{2005}+1^{2005}\right]+2n^{2005}$

Các biểu thức trong dấu ngoặc đều chia hết cho $n$ nên $2A\vdots n$ (2)

Vì $n$ và $n+1$ là hai số nguyên tố cùng nhau nên từ (1) và (2) suy ra $2A\vdots n(n+1)=2B$. Vậy $A\vdots B$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $B=\dfrac{n(n+1)}{2}$ nên cần chứng minh $2A$ chia hết cho cả $n$ và $n+1$; số mũ $2005$ lẻ nên $a^{2005}+b^{2005}$ chia hết cho $a+b$, và ghép các số hạng của $A$ thành cặp có tổng cơ số bằng $n+1$ hoặc bằng $n$.

**Bước 1.** Tính $2B=n(n+1)$ rồi chuyển bài toán thành chứng minh $2A$ chia hết cho tích $n(n+1)$ của hai số nguyên tố cùng nhau.

**Bước 2.** Viết $2A$ là $A$ cộng chính nó theo thứ tự ngược, ghép số hạng thứ $k$ với số hạng thứ $n+1-k$ để mỗi cặp chia hết cho $n+1$.

**Bước 3.** Viết $2A$ lần nữa nhưng ghép $k$ với $n-k$ (lẻ riêng $n^{2005}$) để mỗi cặp chia hết cho $n$.

**Bước 4.** Dùng tính nguyên tố cùng nhau của $n$ và $n+1$ để ghép hai kết quả chia hết thành chia hết cho tích.

**Phần 2. Trình bày**

Ta có $2B=n(n+1)$. Cần chứng minh $2A\vdots n(n+1)$.

Vì $2005$ là số lẻ nên với mọi số nguyên $a,b$ có $a^{2005}+b^{2005}\vdots(a+b)$.

Cộng $A$ với chính nó viết theo thứ tự ngược lại:

$2A=\sum_{k=1}^{n}\left[k^{2005}+(n+1-k)^{2005}\right]$

Mỗi số hạng $k^{2005}+(n+1-k)^{2005}$ chia hết cho $k+(n+1-k)=n+1$, nên $2A\vdots(n+1)$ (1).

Mặt khác $2A=\sum_{k=1}^{n-1}\left[k^{2005}+(n-k)^{2005}\right]+2n^{2005}$. Mỗi số hạng trong tổng chia hết cho $k+(n-k)=n$ và $2n^{2005}\vdots n$, nên $2A\vdots n$ (2).

Vì $\gcd(n;n+1)=1$ nên từ (1) và (2) suy ra $2A\vdots n(n+1)$, tức $2A\vdots2B$.

Vậy $A\vdots B$.

=== T7B.16@p156
- bai: 16 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Viết số theo chữ số · chặn hai phía bằng bất đẳng thức
- kiem: khong
- ket_qua_sach: 32768
- dap_an: $32768$
- ghi_chu_nghi: Máy duyệt mọi số có 5 chữ số: chỉ 32768 bằng lập phương của số tạo bởi hai chữ số đầu. Khớp sách.
## DE
Tìm số tự nhiên có $5$ chữ số, biết rằng số đó bằng lập phương của số tạo bởi chữ số hàng vạn và chữ số hàng nghìn của số đã cho (theo thứ tự đó).
## SACH
Gọi số cần tìm là $\overline{abcde}$, ta có: $\overline{abcde}=\overline{ab}^3$

Đặt $x=\overline{ab};y=\overline{cde}$ ($0\le y<1000$). Ta có: $1000x+y=x^3$ (1)

$\Rightarrow1000x\le x^3\Rightarrow1000\le x^2\Rightarrow32\le x$ (2). Vì $y<1000$ nên từ (1) $\Rightarrow1000x+1000>x^3\Rightarrow x(x^2-1000)<1000$

$\Rightarrow x<33$ (3). Từ (2) và (3) suy ra $x=32$. Vậy số cần tìm là $32^3=32768$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số $\overline{abcde}$ bằng $1000x+y$ với $x=\overline{ab}$ và $y=\overline{cde}$ nhỏ hơn $1000$, còn lập phương $x^3$ phải trùng số đó, nên $x^3$ bị kẹp trong khoảng $[1000x;1000x+999]$ và chặn được $x$ từ hai phía.

**Bước 1.** Đặt $x=\overline{ab}$ và $y=\overline{cde}$ rồi lập phương trình $1000x+y=x^3$ với điều kiện $0\le y\le999$.

**Bước 2.** Dùng $y\ge0$ để chặn dưới $x$ bằng cách so $x^3$ với $1000x$ rồi chia hai vế cho $x>0$.

**Bước 3.** Dùng $y\le999$ để chặn trên $x$, chú ý biểu thức $x(x^2-1000)$ tăng khi $x$ tăng nên chỉ cần thử một giá trị ngay trên cận dưới.

**Bước 4.** Kết hợp hai cận để tìm $x$ rồi tính số cần tìm.

**Phần 2. Trình bày**

Đặt $x=\overline{ab}$ ($10\le x\le99$) và $y=\overline{cde}$ ($0\le y\le999$). Số cần tìm là $1000x+y=x^3$.

Vì $y\ge0$ nên $x^3\ge1000x\Rightarrow x^2\ge1000$. Vì $31^2=961<1000\le1024=32^2$ nên $x\ge32$.

Vì $y\le999$ nên $x^3-1000x\le999\Rightarrow x(x^2-1000)<1000$.

Nếu $x\ge33$ thì $x(x^2-1000)\ge33\cdot(1089-1000)=33\cdot89=2937>1000$ (mâu thuẫn).

Vậy $x=32$, số cần tìm là $32^3=32768$.

Thử lại: $\overline{ab}=32$ và $32^3=32768$ (thỏa).

=== T7B.17@p156
- bai: 17 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tách phân thức thành hằng số cộng phân thức · khảo sát tính tăng giảm theo từng chữ số
- kiem: khong
- ket_qua_sach: 199
- dap_an: Số $199$ (tỉ số nhỏ nhất bằng $\dfrac{199}{19}$)
- ghi_chu_nghi: Máy duyệt 100..999: số có n/(tổng chữ số) nhỏ nhất là 199, khớp sách. Sách in nhầm 190 ở dòng "=10+90-9.189/(a+18)=190-..." (đúng là 100; kiểm tra a=1: 100-1701/19=199/19). Chép đúng như sách in ở ## SACH.
## DE
Tìm số có ba chữ số sao cho tỉ số giữa số đó và tổng các chữ số của nó là bé nhất.
## SACH
Gọi số có ba chữ số cần tìm là $\overline{abc}$ ($a;b;c\in\mathbb{N};0<a\le9;0\le b;c\le9$).

Ta có: $k=\dfrac{\overline{abc}}{a+b+c}=\dfrac{100a+10b+c}{a+b+c}=1+\dfrac{99a+9b}{a+b+c}$

Với $a,b$ xác định thì $k$ bé nhất khi $c$ lớn nhất $\Rightarrow c=9$

$k=1+\dfrac{99a+9b}{a+b+9}=1+\dfrac{9(a+b+9)+90a-81}{a+b+9}=1+9+\dfrac{90a-81}{a+b+9}=10+\dfrac{90a-81}{a+b+9}$

Với $a$ xác định thì $k$ bé nhất khi $b$ lớn nhất $\Rightarrow b=9$

$k=10+\dfrac{90a-81}{a+18}=10+9\cdot\dfrac{10a-9}{a+18}=10+9\cdot\dfrac{10(a+18)-189}{a+18}$

$=10+90-\dfrac{9\cdot189}{a+18}=190-\dfrac{9\cdot189}{a+18}$ bé nhất khi $a$ bé nhất $\Rightarrow a=1$

Vậy số phải tìm là $199$ và $k=\dfrac{199}{19}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tỉ số $k=\dfrac{\overline{abc}}{a+b+c}$ tách được thành $1+\dfrac{99a+9b}{a+b+c}$, nên với $a,b$ cố định thì $k$ giảm khi mẫu tăng, tức khi $c$ lớn nhất; làm lần lượt từng chữ số từ hàng đơn vị lên.

**Bước 1.** Tách $k$ thành $1$ cộng một phân thức có tử không phụ thuộc $c$ để thấy $k$ nhỏ nhất khi $c$ lớn nhất, và chốt $c$ trước.

**Bước 2.** Thay $c$ vừa chốt rồi tách tiếp phân thức còn lại thành hằng số cộng phân thức có tử dương để thấy $k$ nhỏ nhất khi $b$ lớn nhất.

**Bước 3.** Thay $b$ vừa chốt, biến đổi $k$ thành hằng số trừ một phân thức giảm theo $a$ để thấy $k$ tăng cùng với $a$, nên chọn $a$ nhỏ nhất.

**Chú ý:** Đây là cách "chốt từng ẩn một": với mọi bộ $(a;b;c)$ có $k(a;b;c)\ge k(a;b;9)\ge k(a;9;9)\ge k(1;9;9)$, nên giá trị cuối là nhỏ nhất thật sự của cả ba biến.

**Phần 2. Trình bày**

Gọi số cần tìm là $\overline{abc}$ với $1\le a\le9$, $0\le b,c\le9$ và đặt $k=\dfrac{100a+10b+c}{a+b+c}=1+\dfrac{99a+9b}{a+b+c}$.

Với $a,b$ cố định, $99a+9b>0$ còn mẫu $a+b+c$ tăng theo $c$ nên $k$ nhỏ nhất khi $c=9$. Khi đó

$k\ge1+\dfrac{99a+9b}{a+b+9}=10+\dfrac{90a-81}{a+b+9}$ (vì $99a+9b=9(a+b+9)+90a-81$).

Với $a$ cố định, $90a-81>0$ còn mẫu tăng theo $b$ nên phân thức nhỏ nhất khi $b=9$. Khi đó

$k\ge10+\dfrac{90a-81}{a+18}=10+\dfrac{9\left[10(a+18)-189\right]}{a+18}=100-\dfrac{1701}{a+18}$.

Biểu thức $100-\dfrac{1701}{a+18}$ tăng khi $a$ tăng nên nhỏ nhất khi $a=1$, bằng $100-\dfrac{1701}{19}=\dfrac{199}{19}$.

Vậy $k\ge\dfrac{199}{19}$, dấu "=" xảy ra khi $(a;b;c)=(1;9;9)$. Số cần tìm là $199$.

=== T7B.18@p156
- bai: 18 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Nhân $4$ để đưa về hiệu hai bình phương · phương trình tích nghiệm nguyên · tích hai số nguyên liên tiếp
- kiem: khong
- ket_qua_sach: n=2; n=-3
- dap_an: $n\in\{2;-3\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000]: P là số chính phương chỉ khi n=2 hoặc n=-3 (P=49), khớp sách. Sách in mũi tên "⇐" ở các dòng biến đổi (nghi là ⇔); chép như ảnh in.
## DE
Tìm $n\in\mathbb{Z}$ để $n^4+2n^3+2n^2+n+7$ là số chính phương.
## SACH
$n^4+2n^3+2n^2+n+7$ là số chính phương

$\Leftarrow4(n^4+2n^3+2n^2+n+7)=k^2\ (k\in\mathbb{Z})\Leftrightarrow4n^4+8n^3+8n^2+4n+28=k^2$

$\Leftarrow(2n^2+2n+1)^2+27=k^2\Leftrightarrow k^2-(2n^2+2n+1)^2=27$

$\Leftarrow(k+2n^2+2n+1)(k-2n^2-2n-1)=27$

Xét các trường hợp xảy ra tìm được $n=2$ hoặc $n=-3$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân đa thức với $4$ thì bốn hạng tử đầu cộng với $1$ lập thành bình phương của một tam thức bậc hai theo $n$, phần còn lại chỉ là một hằng số, nên đưa được về hiệu hai bình phương bằng một số cụ thể rồi xét ước.

**Bước 1.** Nhân đa thức với $4$ rồi nhận ra rằng nó bằng bình phương của $2n^2+2n+1$ cộng thêm một hằng số, bằng cách khai triển bình phương đó và so với các hạng tử đã có.

**Bước 2.** Đặt đa thức bằng $k^2$ với $k\ge0$ rồi chuyển về hiệu hai bình phương $(2k)^2-(2n^2+2n+1)^2=27$ và phân tích thành tích hai nhân tử.

**Bước 3.** Liệt kê các cặp ước dương của $27$, chú ý nhân tử thứ hai lớn hơn nhân tử thứ nhất vì $2n^2+2n+1>0$, rồi giải $k$ và $n$ từ mỗi cặp.

**Bước 4.** Giữ lại các cặp cho $n$ nguyên và thử lại.

**Phần 2. Trình bày**

Đặt $P=n^4+2n^3+2n^2+n+7=k^2$ với $k\ge0$ nguyên. Ta có

$4P=4n^4+8n^3+8n^2+4n+28=(2n^2+2n+1)^2+27$.

Đặt $u=2n^2+2n+1\ge1$. Khi đó $(2k)^2-u^2=27\Leftrightarrow(2k-u)(2k+u)=27$.

Vì $2k+u>0$ nên $2k-u>0$, và $2k-u<2k+u$. Các cặp $(2k-u;2k+u)$ là $(1;27)$ và $(3;9)$.

Với $(1;27)$: $2k=14,\ u=13$, tức $2n^2+2n+1=13\Leftrightarrow n^2+n-6=0\Leftrightarrow(n-2)(n+3)=0\Leftrightarrow n=2$ hoặc $n=-3$.

Với $(3;9)$: $2k=6,\ u=3$, tức $2n^2+2n+1=3\Leftrightarrow n(n+1)=1$, không có số nguyên $n$ nào (tích hai số nguyên liên tiếp là số chẵn).

Thử lại: $n=2$: $16+16+8+2+7=49=7^2$; $n=-3$: $81-54+18-3+7=49=7^2$ (thỏa).

Vậy $n\in\{2;-3\}$.

=== T7B.19@p156
- bai: 19 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Đưa về tổng các bình phương bằng $0$
- kiem: khong
- ket_qua_sach: x=y=z=t=0
- dap_an: $x=y=z=t=0$
- ghi_chu_nghi: Không cần máy: tổng bình phương bằng 0 chỉ khi từng bình phương bằng 0. Thay lại (0;0;0;0) thấy đúng.
## DE
Tìm $x;y;z;t$ thỏa mãn $x^2+y^2+z^2+t^2=x(y+z+t)$.
## SACH
$x^2+y^2+z^2+t^2=x(y+z+t)$. Nhân cả hai vế của phương trình với $4$:

$4x^2+4y^2+4z^2+4t^2=4xy+4xz+4xt$

$\Leftarrow x^2+x^2-4xy+4y^2+x^2-4xz+4z^2+x^2-4xt+4t^2=0$

$\Leftarrow x^2+(x-2y)^2+(x-2z)^2+(x-2t)^2=0$

Suy ra $x=y=z=t=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình có một vế là tổng bốn bình phương và vế kia là $x$ nhân tổng ba biến, nên chuyển hết sang một vế và ghép từng cặp $y^2$ với $-xy$ để tạo bình phương $(x-2y)^2$ rồi đưa về tổng các bình phương bằng $0$.

**Bước 1.** Nhân hai vế với $4$ để hệ số của $y^2,z^2,t^2$ thành $4$, vì $4y^2-4xy$ chỉ cần thêm $x^2$ là thành $(x-2y)^2$.

**Bước 2.** Chia $4x^2$ thành $x^2+x^2+x^2+x^2$ rồi ghép mỗi $x^2$ với một cặp biến $y$, $z$, $t$ để lập ba bình phương $(x-2y)^2$, $(x-2z)^2$, $(x-2t)^2$, còn dư một $x^2$.

**Bước 3.** Tổng các bình phương bằng $0$ nên từng bình phương bằng $0$, từ đó giải ra các biến.

**Phần 2. Trình bày**

$x^2+y^2+z^2+t^2=x(y+z+t)$

$\Leftrightarrow4x^2+4y^2+4z^2+4t^2-4xy-4xz-4xt=0$

$\Leftrightarrow x^2+(x^2-4xy+4y^2)+(x^2-4xz+4z^2)+(x^2-4xt+4t^2)=0$

$\Leftrightarrow x^2+(x-2y)^2+(x-2z)^2+(x-2t)^2=0$

Mỗi số hạng không âm nên tổng bằng $0$ khi và chỉ khi $x=0$ và $x-2y=x-2z=x-2t=0$, tức $x=y=z=t=0$.

Thử lại $(0;0;0;0)$ thỏa phương trình.

Vậy $x=y=z=t=0$.

=== T7B.20@p156
- bai: 20 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Quy đồng đưa về $(x-2)(y-2)=4$ · phương trình tích nghiệm nguyên dương
- kiem: khong
- ket_qua_sach: (3;6); (6;3); (4;4)
- dap_an: $(x;y)\in\{(3;6);(6;3);(4;4)\}$
- ghi_chu_nghi: Máy vét x,y trong [1;199]: đúng ba nghiệm trên, khớp sách. Sách có hai cách; chép cả hai ở ## SACH, lời giải kho theo Cách 2.
## DE
Tìm các số nguyên dương $x,y$ thỏa $\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{1}{2}$.
## SACH
Cách 1: Vai trò của $x$ và $y$ như nhau nên ta có thể giả sử: $x\ge y$.

Ta có: $\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{1}{2};\ x>0\Rightarrow\dfrac{1}{y}<\dfrac{1}{2}\Rightarrow y>2$

$x\ge y>0\Rightarrow\dfrac{1}{x}\le\dfrac{1}{y}\Rightarrow\dfrac{1}{2}=\dfrac{1}{x}+\dfrac{1}{y}\le\dfrac{2}{y}\Rightarrow y\le4$. Do đó: $y=3$ hay $y=4$.

Với $y=3$ thì $x=6$. Do tính đối xứng ta cũng có: $x=3$ và $y=6$.

Với $y=4$ thì $x=4$.

Cách 2: $\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{1}{2}\Leftrightarrow2(x+y)=xy\Leftrightarrow2x-xy+2y=0$

$\Leftrightarrow x(2-y)-2(2-y)=-4$

$\Leftrightarrow(2-x)(2-y)=4=1\cdot4=4\cdot1=(-1)(-4)=(-4)(-1)=2\cdot2=(-2)(-2)$.

Vì $x,y>0$ nên $2-x<2$, $2-y<2$. Do đó ta có các trường hợp:

* $2-x=1$ và $2-y=4\Leftrightarrow x=1$ và $y=-2$ (loại).

* $2-x=-1$ và $2-y=-4\Leftrightarrow x=3$ và $y=6$ (nhận).

* $2-x=-4$ và $2-y=-1\Leftrightarrow x=6$ và $y=3$ (nhận).

* $2-x=-2$ và $2-y=-2\Leftrightarrow x=4$ và $y=4$ (nhận).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phương trình có ẩn ở mẫu nhưng chỉ hai ẩn và hệ số nhỏ, nên quy đồng khử mẫu rồi thêm bớt để nhóm thành tích $(x-2)(y-2)$ bằng một hằng số, sau đó xét các ước.

**Bước 1.** Quy đồng khử mẫu với điều kiện $x,y\ne0$ để đưa phương trình về dạng đa thức không còn phân thức.

**Bước 2.** Chuyển các hạng tử có $x$ hoặc $y$ về một vế rồi cộng thêm một hằng số cho cả hai vế để vế trái phân tích được thành $(x-2)(y-2)$.

**Bước 3.** Liệt kê mọi cặp ước nguyên của vế phải, chú ý $x,y\ge1$ nên $x-2\ge-1$ và $y-2\ge-1$, để loại các cặp không thỏa.

**Chú ý:** Có thể làm theo cách khác: giả sử $x\ge y$ thì $\dfrac{1}{2}\le\dfrac{2}{y}$ nên $y\le4$, và $y>2$; chỉ còn thử $y=3$ và $y=4$.

**Phần 2. Trình bày**

Điều kiện $x,y\ne0$.

$\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{1}{2}\Leftrightarrow2(x+y)=xy$

$\Leftrightarrow xy-2x-2y+4=4$

$\Leftrightarrow(x-2)(y-2)=4$

Vì $x,y\ge1$ nên $x-2\ge-1$ và $y-2\ge-1$. Các cặp ước nguyên của $4$ có hai thừa số đều không nhỏ hơn $-1$ là $(1;4),(2;2),(4;1)$; cặp $(-1;-4)$ và $(-4;-1)$ bị loại vì có thừa số nhỏ hơn $-1$.

$x-2=1,\ y-2=4\Rightarrow(x;y)=(3;6)$

$x-2=2,\ y-2=2\Rightarrow(x;y)=(4;4)$

$x-2=4,\ y-2=1\Rightarrow(x;y)=(6;3)$

Thử lại: $\dfrac{1}{3}+\dfrac{1}{6}=\dfrac{1}{2}$ và $\dfrac{1}{4}+\dfrac{1}{4}=\dfrac{1}{2}$ (thỏa).

Vậy $(x;y)\in\{(3;6);(4;4);(6;3)\}$.

=== T7B.21@p156
- bai: 21 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tham số hóa nghiệm nguyên của hệ phương trình · tính chia hết · số dư theo $4$
- kiem: khong
- ket_qua_sach: a=-12k+3; b=8k; c=9k-2 (k\in\mathbb{Z})
- dap_an: $(a;b;c)=(12k+3;-8k;9k+2)$ với $k\in\mathbb{Z}$
- ghi_chu_nghi: Đề in "3a - 4c = 1" (dấu giữa 3a và 4c là dấu trừ ngắn, đã phóng ảnh xem lại), nhưng lời giải sách biến đổi thành 6a+8c=2, tức giải phương trình 3a+4c=1; kết quả sách a=-12k+3, b=8k, c=9k-2 chỉ đúng với 3a+4c=1. Lời giải kho giải đúng đề in 3a-4c=1; máy vét [-60;60] cho các bộ (-9;8;-7),(3;0;2),(15;-8;11)... đều dạng (12k+3;-8k;9k+2). Cần người xem lại bản gốc nếu nghi dấu bị mờ.
## DE
Tìm các số nguyên $a,b,c$ thỏa mãn cả hai phương trình $2a+3b=6$ và $3a-4c=1$.
## SACH
Để khử $a$, ta biến đổi các phương trình đã cho thành $6a+9b=18$ và $6a+8c=2$. Suy ra $9b-8c=16$. Do đó $c=\dfrac{9b-16}{8}=b-2+\dfrac{b}{8}$

$b,a,c$ là các số nguyên khi và chỉ khi $\dfrac{b}{8}$ là số nguyên.

Đặt $b=8k\ (k\in\mathbb{Z})$ thì $c=8k-2+k=9k-2$.

Thay vào $3a+4c=1$ được $3a=1-4(9k-2)=-36k+9$, do đó $a=-12k+3$. Các số nguyên $a,b,c$ phải tìm có dạng: $a=-12k+3,\ b=8k,\ c=9k-2$ với $k\in\mathbb{Z}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai phương trình bậc nhất ba ẩn nên nghiệm nguyên phụ thuộc một tham số nguyên; lần lượt dùng tính chia hết từng phương trình để thu hẹp dạng của $a$, rồi của $m$, cuối cùng ra công thức chung theo một số nguyên $k$.

**Bước 1.** Từ $2a+3b=6$ suy ra $2a\vdots3$ nên $a\vdots3$, đặt $a=3m$ để $b$ biểu diễn được qua $m$.

**Bước 2.** Thay $a=3m$ vào phương trình thứ hai và xét số dư theo $4$ để biết $m$ phải thuộc dạng nào thì $c$ nguyên.

**Bước 3.** Đặt $m$ theo tham số $k$, tính $a,b,c$ theo $k$ rồi thử lại cả hai phương trình.

**Phần 2. Trình bày**

Từ $2a+3b=6$: $2a=6-3b\vdots3$, mà $\gcd(2;3)=1$ nên $a\vdots3$. Đặt $a=3m$ ($m\in\mathbb{Z}$), khi đó $6m+3b=6\Rightarrow b=2-2m$.

Từ $3a-4c=1$: $9m-4c=1\Rightarrow4c=9m-1$. Vì $9m-1\equiv m-1\pmod{4}$ nên cần $m-1\vdots4$, tức $m=4k+1$ ($k\in\mathbb{Z}$).

Khi đó $a=3(4k+1)=12k+3$, $b=2-2(4k+1)=-8k$, $c=\dfrac{9(4k+1)-1}{4}=\dfrac{36k+8}{4}=9k+2$.

Thử lại: $2a+3b=24k+6-24k=6$ và $3a-4c=36k+9-36k-8=1$ (thỏa).

Vậy $(a;b;c)=(12k+3;-8k;9k+2)$ với $k\in\mathbb{Z}$.

=== T7B.22@p156
- bai: 22 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Đặt $n=2k$ · tích ba số nguyên liên tiếp chia hết cho $6$ · tách $k^3+5k=(k^3-k)+6k$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n chẵn trong [-200;200]: n^3+20n chia hết cho 48, khớp.
## DE
Chứng minh rằng biểu thức $A=n^3+20n$ chia hết cho $48$ với mọi số nguyên chẵn $n$.
## SACH
Vì $n$ là số nguyên chẵn, ta đặt $n=2k$, và có:

$A=n^3+20n=(2k)^3+20(2k)=8k^3+40k=8(k^3+5k)$

Ta thấy ngay $A\vdots8$ (1). Bây giờ ta sẽ chứng minh: $(k^3+5k)\vdots6$. Ta có: $k^3+5k=k^3-k+6k=(k^3-k)+6k$. Trong bài trên ta đã chứng minh $(k^3-k)\vdots6$ và rõ ràng $6k\vdots6$ nên $(k^3+5k)\vdots6$ (2)

Từ (1) và (2) suy ra: $A\vdots48$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $n$ chẵn thì $n=2k$ và $A=8(k^3+5k)$ đã chia hết cho $8$; chỉ còn phải chứng minh $k^3+5k$ chia hết cho $6$, mà $k^3+5k=(k^3-k)+6k$ chứa tích ba số nguyên liên tiếp.

**Bước 1.** Đặt $n=2k$ và đặt $8$ làm nhân tử chung để $A$ chia hết cho $8$ ngay, vì chỉ cần tính tiếp thừa số còn lại.

**Bước 2.** Tách $k^3+5k$ thành $(k^3-k)+6k$ để có tích ba số nguyên liên tiếp cộng một bội của $6$.

**Bước 3.** Chứng minh $k^3-k$ chia hết cho $6$ bằng cách phân tích thành $(k-1)k(k+1)$ rồi dùng tính chia hết cho $2$ và $3$, sau đó nhân với $8$ để được $48$.

**Phần 2. Trình bày**

Vì $n$ chẵn nên $n=2k$ ($k\in\mathbb{Z}$):

$A=(2k)^3+20\cdot2k=8k^3+40k=8(k^3+5k)=8\left[(k^3-k)+6k\right]$

Ta có $k^3-k=(k-1)k(k+1)$ là tích ba số nguyên liên tiếp nên chia hết cho $2$ và cho $3$, mà $\gcd(2;3)=1$ nên chia hết cho $6$. Lại có $6k\vdots6$, nên $k^3+5k\vdots6$.

Do đó $A=8(k^3+5k)$ chia hết cho $8\cdot6=48$.

Vậy $A\vdots48$ với mọi số nguyên chẵn $n$.

=== T7B.23@p156
- bai: 23 · y: - · trang: 156 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: $a^n-b^n$ chia hết cho $a-b$ · $a^n-b^n$ chia hết cho $a+b$ khi $n$ chẵn · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n=0,2,...,58: 20^n+16^n-3^n-1 chia hết cho 323, khớp. Sách không đánh nhãn (2) cho kết quả chia hết cho 19 nhưng lại viết "Từ (1) và (2)"; lời giải kho đánh lại.
## DE
Chứng minh rằng với $n$ là số tự nhiên chẵn thì biểu thức $A=20^n+16^n-3^n-1$ chia hết cho $323$.
## SACH
Chú ý rằng $323=17\cdot19$ và $(17,19)=1$ nên ta sẽ chứng minh: $A\vdots17$ và $A\vdots19$. Ta viết: $A=20^n+16^n-3^n-1=(20^n-3^n)+(16^n-1)$.

Ta có: $B=20^n-3^n\vdots(20-3)=17$ và $C=16^n-1\vdots(16+1)=17$ (do $n$ chẵn)

Do đó $A=B+C$ chia hết cho $17$ (1). Tương tự, ta lại viết:

$A=20^n+16^n-3^n-1=(20^n-1)+(16^n-3^n)$

Ta có: $D=20^n-1\vdots(20-1)=19$; $E=16^n-3^n\vdots(16+3)=19$ (do $n$ chẵn)

Do đó: $A=D+E$ chia hết cho $19$. Từ (1) và (2), ta suy ra $A\vdots17\cdot19$, tức $A\vdots323$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $323=17\cdot19$ với hai thừa số nguyên tố; ghép bốn số hạng thành hai nhóm sao cho mỗi nhóm có dạng $a^n-b^n$ với $a-b$ hoặc $a+b$ bằng $17$ (rồi $19$), và $n$ chẵn cho phép dùng $a+b$.

**Bước 1.** Phân tích $323$ thành tích hai số nguyên tố $17\cdot19$ nên chỉ cần chứng minh $A$ chia hết cho từng thừa số.

**Bước 2.** Ghép $(20^n-3^n)+(16^n-1)$ vì $20-3=17$ và $16+1=17$, rồi dùng $a^n-b^n$ chia hết cho $a-b$ và, khi $n$ chẵn, chia hết cho $a+b$.

**Bước 3.** Ghép lại $(20^n-1)+(16^n-3^n)$ vì $20-1=19$ và $16+3=19$ để chứng minh chia hết cho $19$, rồi kết luận nhờ hai số nguyên tố khác nhau.

**Phần 2. Trình bày**

Ta có $323=17\cdot19$ với $17$ và $19$ là hai số nguyên tố khác nhau, nên chỉ cần chứng minh $A\vdots17$ và $A\vdots19$.

Chia hết cho $17$: $A=(20^n-3^n)+(16^n-1)$.

$20^n-3^n\vdots(20-3)=17$, và vì $n$ chẵn nên $16^n-1^n\vdots(16+1)=17$. Vậy $A\vdots17$ (1).

Chia hết cho $19$: $A=(20^n-1)+(16^n-3^n)$.

$20^n-1^n\vdots(20-1)=19$, và vì $n$ chẵn nên $16^n-3^n\vdots(16+3)=19$. Vậy $A\vdots19$ (2).

Từ (1) và (2), do $\gcd(17;19)=1$ nên $A\vdots17\cdot19=323$.

Vậy $A\vdots323$ với mọi số tự nhiên chẵn $n$.

=== T7B.24a@p157
- bai: 24 · y: a · trang: 157 · tang: nang_cao
- nguon_de: Đề thi vào lớp chuyên toán miền Bắc, 1972
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hiệu hai bình phương · nhẩm nghiệm đa thức bậc ba · tách hạng tử
- kiem: bang | x^3(x^2-7)^2-36x
- ket_qua_sach: (x-3)(x-2)(x-1)x(x+1)(x+2)(x+3)
- dap_an: $A=(x-3)(x-2)(x-1)x(x+1)(x+2)(x+3)$
- ghi_chu_nghi: Máy so hai vế với x từ -20 đến 20, khớp. Sách có hai cách; chép cả hai ở ## SACH, lời giải kho theo hướng hiệu hai bình phương rồi nhẩm nghiệm.
## DE
(Đề thi vào lớp chuyên toán miền Bắc, 1972) Phân tích biểu thức ra nhân tử: $A=x^3(x^2-7)^2-36x$.
## SACH
Cách 1: $A=x^3(x^2-7^2)^2-36x$

$=x\left[x^2(x^2-7)^2-36\right]=x(x^6-14x^4+49x^2-36)$

$=x\left[(x^6-9x^4)-(5x^4-45x^2)+(4x^2-36)\right]$

$=x\left[x^4(x^2-9)-5x^2(x^2-9)+4(x^2-9)\right]=x(x^2-9)(x^4-5x^2+4)$

$=x(x^2-9)(x^2-1)(x^2-4)=x(x-3)(x+3)(x-1)(x+1)(x-2)(x+2)$.

Cách 2: Xét: $B=x^2(x^2-7)^2-36$. Dễ thấy rằng: $B=0$ với $x=\pm1,\pm2,\pm3$;

Do đó vì $B$ là đa thức bậc $6$ của $x$, ta có:

$B=(x-3)(x-2)(x-1)(x+1)(x+2)(x+3)$

$\Rightarrow A=(x-3)(x-2)(x-1)x(x+1)(x+2)(x+3)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $x$ ra ngoài thì trong ngoặc là $x^2(x^2-7)^2-36=[x(x^2-7)]^2-6^2$, một hiệu hai bình phương; hai nhân tử bậc ba thu được đều nhẩm được nghiệm nguyên nhỏ nên phân tích tiếp được hết.

**Bước 1.** Đặt $x$ làm nhân tử chung rồi viết phần trong ngoặc thành hiệu hai bình phương $[x(x^2-7)]^2-6^2$.

**Bước 2.** Áp dụng hằng đẳng thức hiệu hai bình phương để thành tích của hai đa thức bậc ba $x^3-7x-6$ và $x^3-7x+6$.

**Bước 3.** Nhẩm nghiệm trong các ước của $6$ cho từng đa thức bậc ba, tách hạng tử để đặt được nhân tử chung và phân tích đến khi toàn nhân tử bậc nhất.

**Chú ý:** Cũng có thể đi theo hướng khác: khai triển $x^2(x^2-7)^2-36$ thành đa thức bậc sáu theo $x^2$, thấy nó bằng $0$ khi $x=\pm1,\pm2,\pm3$ nên bằng tích sáu nhân tử bậc nhất tương ứng.

**Phần 2. Trình bày**

$A=x\left[x^2(x^2-7)^2-36\right]=x\left[(x^3-7x)^2-6^2\right]$

$=x(x^3-7x-6)(x^3-7x+6)$

Với $x^3-7x-6$: đa thức bằng $0$ tại $x=-1$ nên

$x^3-7x-6=x^3+x^2-x^2-x-6x-6=x^2(x+1)-x(x+1)-6(x+1)=(x+1)(x^2-x-6)=(x+1)(x+2)(x-3)$

Với $x^3-7x+6$: đa thức bằng $0$ tại $x=1$ nên

$x^3-7x+6=x^3-x^2+x^2-x-6x+6=x^2(x-1)+x(x-1)-6(x-1)=(x-1)(x^2+x-6)=(x-1)(x+3)(x-2)$

Vậy $A=(x-3)(x-2)(x-1)x(x+1)(x+2)(x+3)$.

=== T7B.24b@p157
- bai: 24 · y: b · trang: 157 · tang: nang_cao
- nguon_de: Đề thi vào lớp chuyên toán miền Bắc, 1972
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tích $7$ số nguyên liên tiếp chia hết cho $7$ · hiệu hai bình phương · nhẩm nghiệm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề sách ghi "Dựa vào kết quả câu trên"; để câu đứng một mình, đề kho bỏ cụm này và lời giải kho nêu lại phân tích nhân tử của ý a. Máy kiểm n trong [-100;100], khớp.
## DE
(Đề thi vào lớp chuyên toán miền Bắc, 1972) Chứng minh rằng biểu thức $n^3(n^2-7)^2-36n$ luôn luôn chia hết cho $7$ với mọi số nguyên $n$.
## SACH
Theo kết quả trên, ta có:

$n^3(n^2-7)^2-36n=n(n-3)(n+3)(n-1)(n+1)(n-2)(n+2)$

Ta viết lại dưới dạng: $(n-3)(n-2)(n-1)n(n+1)(n+2)(n+3)$.

Đây là tích của $7$ số nguyên liên tiếp, trong $7$ số nguyên liên tiếp bao giờ cũng có một số chia hết cho $7$, nên tích chia hết cho $7$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức này phân tích được thành tích của $7$ số nguyên liên tiếp $n-3,\dots,n+3$, mà trong $7$ số nguyên liên tiếp luôn có đúng một số chia hết cho $7$.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi dùng hiệu hai bình phương và nhẩm nghiệm để phân tích biểu thức thành tích các nhân tử bậc nhất.

**Bước 2.** Sắp xếp các nhân tử theo thứ tự tăng dần để nhận ra đó là bảy số nguyên liên tiếp.

**Bước 3.** Dùng tính chất bảy số nguyên liên tiếp có bảy số dư khác nhau khi chia cho $7$ để chỉ ra một thừa số chia hết cho $7$.

**Phần 2. Trình bày**

$n^3(n^2-7)^2-36n=n\left[(n^3-7n)^2-6^2\right]=n(n^3-7n-6)(n^3-7n+6)$

với $n^3-7n-6=(n+1)(n+2)(n-3)$ và $n^3-7n+6=(n-1)(n-2)(n+3)$ (khai triển hai vế để kiểm tra).

Suy ra $n^3(n^2-7)^2-36n=(n-3)(n-2)(n-1)n(n+1)(n+2)(n+3)$.

Đây là tích của $7$ số nguyên liên tiếp. Bảy số nguyên liên tiếp có $7$ số dư khác nhau khi chia cho $7$ nên có đúng một số có số dư $0$, tức chia hết cho $7$. Do đó tích chia hết cho $7$.

Vậy $n^3(n^2-7)^2-36n\vdots7$ với mọi số nguyên $n$.

=== T7B.25@p157
- bai: 25 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: $a^k-b^k$ chia hết cho $a-b$ · tách hạng tử để xuất hiện thừa số $41$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n=1..79, khớp. Sách dùng khai triển nhị thức Niu-tơn; lời giải kho dùng $49^{n+1}-8^{n+1}\vdots(49-8)$ gọn hơn (nhắc ở Chú ý).
## DE
Chứng minh rằng: $5\cdot7^{2(n+1)}+2^{3n}$ chia hết cho $41$ với $n$ là số nguyên dương.
## SACH
$A=5\cdot7^{2(n+1)}+2^{3n}=5\cdot49^{n+1}+8^n=5(41+8)^{n+1}+8^n$

Áp dụng công thức nhị thức Newton, ta có:

$(41+8)^{n+1}=41^{n+1}+(n+1)\cdot41^n\cdot8+\dfrac{n(n+1)}{2}41^{n-1}\cdot8^2+\dots+(n+1)41\cdot8^n+8^{n+1}$

Vậy: $A=5\left[41^{n+1}+(n+1)41^n\cdot8+\dots+(n+1)41\cdot8^n+8^{n+1}\right]+8^n$

$=5\left[41^{n+1}+(n+1)41^n\cdot8+\dots+(n+1)41\cdot8^n\right]+5\cdot8^{n+1}+8^n$

Đặt $B=5\left[41^{n+1}+(n+1)41^n\cdot8+\dots+(n+1)41\cdot8^n\right]$

Ta thấy $B\vdots41$ (vì các hạng tử trong ngoặc $[\ ]$ đều chia hết cho $41$)

Bây giờ ta cần chứng minh: $C=5\cdot8^{n+1}+8^n$ chia hết cho $41$.

Ta có: $C=5\cdot8^{n+1}+8^n=8^n(5\cdot8+1)=8^n\cdot41$. Vậy $C\vdots41$.

Tóm lại $A=B+C$ mà $B\vdots41$, $C\vdots41$. Vậy $A\vdots41$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $7^{2(n+1)}=49^{n+1}$ và $2^{3n}=8^n$; hai cơ số $49$ và $8$ hơn kém nhau đúng $41$, nên $49^{n+1}-8^{n+1}$ chia hết cho $41$ và phần còn lại ghép thành bội của $41$.

**Bước 1.** Đưa các lũy thừa về cùng dạng $49^{n+1}$ và $8^n$ để thấy hiệu hai cơ số là $41$.

**Bước 2.** Tách $A$ thành một nhóm có dạng $49^{n+1}-8^{n+1}$ nhân với $5$ cộng một nhóm chỉ chứa lũy thừa của $8$, sao cho hệ số khớp với số hạng ban đầu.

**Bước 3.** Chứng minh nhóm đầu chia hết cho $41$ bằng $a^k-b^k\vdots a-b$ và nhóm sau là $8^n\cdot41$, rồi cộng lại.

**Chú ý:** Cách khác là viết $49=41+8$ rồi khai triển nhị thức Niu-tơn của $(41+8)^{n+1}$, mọi số hạng trừ $8^{n+1}$ đều chia hết cho $41$.

**Phần 2. Trình bày**

$A=5\cdot7^{2(n+1)}+2^{3n}=5\cdot49^{n+1}+8^n$

$=5\left(49^{n+1}-8^{n+1}\right)+5\cdot8^{n+1}+8^n$

$=5\left(49^{n+1}-8^{n+1}\right)+8^n(40+1)$

$=5\left(49^{n+1}-8^{n+1}\right)+41\cdot8^n$

Vì $49^{n+1}-8^{n+1}\vdots(49-8)=41$ nên số hạng thứ nhất chia hết cho $41$; số hạng thứ hai rõ ràng chia hết cho $41$.

Vậy $A\vdots41$ với mọi số nguyên dương $n$.

=== T7B.26@p157
- bai: 26 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Đặt ẩn phụ $a=x-y$, $b=y-z$, $c=z-x$ với $a+b+c=0$ · khai triển $(a+b)^5$ · phân tích nhân tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm mọi bộ x,y,z đôi một khác nhau trong [1;14]: A chia hết cho B, khớp.
## DE
Giả sử $x,y,z$ là các số nguyên dương, đôi một khác nhau. Chứng minh rằng biểu thức $A=(x-y)^5+(y-z)^5+(z-x)^5$ chia hết cho $B=5(x-y)(y-z)(z-x)$.
## SACH
Đặt $x-y=a,\ y-z=b,\ z-x=c$

Ta nhận thấy $a+b+c=0$; $A=a^5+b^5+c^5$; $B=5abc$.

Phân tích $A$ thành nhân tử, với điều kiện $a+b+c=0$ tức là $-(a+b)=c$

$A=a^5+b^5+c^5=a^5+b^5-(a+b)^5$

$=-5ab(a+b)(a^2+ab+b^2)=5abc(a^2+ab+b^2)$ (do $a+b=-c$).

Vậy $A\vdots B$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba hiệu $x-y$, $y-z$, $z-x$ có tổng bằng $0$ nên đặt chúng là $a,b,c$ với $c=-(a+b)$; khi đó $A=a^5+b^5-(a+b)^5$ chỉ còn hai biến và khai triển được.

**Bước 1.** Đặt $a=x-y$, $b=y-z$, $c=z-x$, nhận ra $a+b+c=0$, để $A=a^5+b^5+c^5$ còn $B=5abc$.

**Bước 2.** Thay $c=-(a+b)$ rồi khai triển $(a+b)^5$ bằng nhị thức để phần $a^5+b^5$ triệt tiêu, còn lại các hạng tử chứa $ab$.

**Bước 3.** Đặt nhân tử chung $-5ab$ rồi phân tích tiếp nhân tử bậc ba thành $(a+b)(a^2+ab+b^2)$ để thấy $A=B\cdot(a^2+ab+b^2)$.

**Phần 2. Trình bày**

Đặt $a=x-y$, $b=y-z$, $c=z-x$. Khi đó $a+b+c=0$ nên $c=-(a+b)$, còn $A=a^5+b^5+c^5$ và $B=5abc$ ($a,b,c\ne0$ vì $x,y,z$ đôi một khác nhau).

$A=a^5+b^5-(a+b)^5=-(5a^4b+10a^3b^2+10a^2b^3+5ab^4)$

$=-5ab(a^3+2a^2b+2ab^2+b^3)=-5ab(a+b)(a^2+ab+b^2)$

$=5abc(a^2+ab+b^2)$ (vì $-(a+b)=c$)

$=B\cdot(a^2+ab+b^2)$

Vì $a^2+ab+b^2$ là số nguyên nên $A$ chia hết cho $B$.

=== T7B.27@p157
- bai: 27 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Nhẩm nghiệm để phân tích đa thức bậc bốn · tích các số chẵn chia hết cho lũy thừa của $2$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm k lẻ trong [-99;99]: A chia hết cho 16, và A=(k-1)(k+1)(k-3)(k+5) với mọi k. Lời "nhận xét" của sách (A chia hết cho 96) chép ở ## SACH nhưng không là đề bài; sách viết "a chia hết cho 96" (nghi chữ hoa/thường).
## DE
Chứng minh rằng biểu thức $A=k^4+2k^3-16k^2-2k+15$ chia hết cho $16$ với mọi giá trị nguyên và lẻ của $k$.
## SACH
Phân tích $A$ thành $(k-1)(k+1)(k-3)(k+5)$ khi $k$ nguyên và lẻ thì cả bốn nhân tử trên đều chẵn, do vậy đều chia hết cho $2$. Vậy cả tích phải chia hết cho $16$

Nhận xét: có thể viết: $A=(k-3)(k-1)(k+1)(k+5)$ ta thấy $k-3,k-1$ và $k+1$ là ba số chẵn liên tiếp (do $k$ lẻ) và có thể chứng minh được $a$ chia hết cho $96$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số tự do là $15$ và tổng hệ số bằng $0$ nên $k=1$ là nghiệm của đa thức, và thử tiếp $k=-1$ cũng là nghiệm; phân tích thành bốn nhân tử bậc nhất mà khi $k$ lẻ cả bốn đều chẵn thì tích có ít nhất bốn thừa số $2$.

**Bước 1.** Nhẩm nghiệm trong các ước của $15$: thấy $k=1$ và $k=-1$ đều làm $A$ bằng $0$, nên $A$ chia hết cho $(k-1)(k+1)=k^2-1$.

**Bước 2.** Tách hạng tử để đặt nhân tử chung $k^2-1$, được tích của $k^2-1$ và một tam thức bậc hai rồi phân tích tam thức đó.

**Bước 3.** Với $k$ lẻ, kiểm tra từng nhân tử bậc nhất đều chẵn rồi nhân bốn thừa số $2$ lại để được bội của $16$.

**Phần 2. Trình bày**

$A=k^4+2k^3-16k^2-2k+15=(k^4-k^2)+(2k^3-2k)-(15k^2-15)$

$=k^2(k^2-1)+2k(k^2-1)-15(k^2-1)$

$=(k^2-1)(k^2+2k-15)$

$=(k-1)(k+1)(k-3)(k+5)$

Với $k$ nguyên lẻ, bốn số $k-1,\ k+1,\ k-3,\ k+5$ đều chẵn. Đặt mỗi số bằng $2$ nhân một số nguyên thì tích $A$ chia hết cho $2^4=16$.

Vậy $A\vdots16$ với mọi số nguyên lẻ $k$.

=== T7B.28a@p157
- bai: 28 · y: a · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hiệu hai bình phương · tích hai số nguyên liên tiếp là số chẵn
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm m trong [-50;50], khớp.
## DE
Chứng minh rằng nếu $m$ là một số nguyên thì $(2m+1)^2-1$ chia hết cho $8$.
## SACH
Ta có: $(2m+1)^2-1=(2m+1+1)(2m+1-1)=4m(m+1)$

$m$ và $m+1$ là hai số nguyên liên tiếp, nên chắc chắn phải có một số là chẵn. Do vậy tích $m(m+1)$ chia hết cho $2$.

Vậy $4m(m+1)$ phải chia hết cho $8$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Một bình phương trừ $1$ là hiệu hai bình phương nên tách ngay thành tích $(2m+2)\cdot2m$, trong đó có hai số nguyên liên tiếp $m$ và $m+1$.

**Bước 1.** Dùng hằng đẳng thức hiệu hai bình phương với $(2m+1)^2-1^2$ để viết thành tích hai nhân tử chẵn.

**Bước 2.** Đặt nhân tử chung để biểu thức thành $4$ nhân tích hai số nguyên liên tiếp $m$ và $m+1$.

**Bước 3.** Dùng tính chất trong hai số nguyên liên tiếp có một số chẵn để tích đó chia hết cho $2$, rồi nhân với $4$.

**Phần 2. Trình bày**

$(2m+1)^2-1=(2m+1+1)(2m+1-1)=(2m+2)\cdot2m=4m(m+1)$

Trong hai số nguyên liên tiếp $m$ và $m+1$ có một số chẵn nên $m(m+1)\vdots2$.

Do đó $4m(m+1)\vdots4\cdot2=8$.

Vậy $(2m+1)^2-1\vdots8$ với mọi số nguyên $m$.

=== T7B.28b@p157
- bai: 28 · y: b · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Biểu diễn số chẵn liên tiếp $2n$, $2n+2$ · hằng đẳng thức
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm, khớp.
## DE
Chứng minh rằng hiệu các bình phương của hai số chẵn liên tiếp chia hết cho $4$.
## SACH
Lấy một số chẵn là $2n$ thì số chẵn liền sau nó là $2n+2$.

Hiệu: $(2n+2)^2-(2n)^2=4(2n+1)$, chia hết cho $4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai số chẵn liên tiếp luôn viết được dưới dạng $2n$ và $2n+2$ với $n$ nguyên, nên hiệu bình phương là biểu thức của $n$ để xét tính chia hết.

**Bước 1.** Gọi hai số chẵn liên tiếp là $2n$ và $2n+2$ với $n$ nguyên.

**Bước 2.** Dùng hằng đẳng thức hiệu hai bình phương hoặc khai triển để rút gọn hiệu $(2n+2)^2-(2n)^2$.

**Bước 3.** Đặt $4$ làm nhân tử chung để kết luận chia hết cho $4$.

**Phần 2. Trình bày**

Gọi hai số chẵn liên tiếp là $2n$ và $2n+2$ ($n\in\mathbb{Z}$). Ta có

$(2n+2)^2-(2n)^2=(2n+2-2n)(2n+2+2n)=2(4n+2)=4(2n+1)$

Vì $2n+1$ là số nguyên nên $4(2n+1)\vdots4$.

Vậy hiệu các bình phương của hai số chẵn liên tiếp chia hết cho $4$.

=== T7B.28c@p157
- bai: 28 · y: c · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Biểu diễn số lẻ liên tiếp $2n-1$, $2n+1$ · hằng đẳng thức hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm, khớp.
## DE
Chứng minh rằng hiệu bình phương của hai số lẻ liên tiếp chia hết cho $8$.
## SACH
Lấy một số lẻ là $2n+1$ thì số lẻ liền trước nó là $2n-1$. Ta xét hiệu:

$(2n+1)^2-(2n-1)^2=\left[(2n+1)+(2n-1)\right]\left[(2n+1)-(2n-1)\right]=8n$ chia hết cho $8$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai số lẻ liên tiếp viết được là $2n-1$ và $2n+1$, hiệu của chúng bằng $2$ nên khi dùng hiệu hai bình phương thừa số thứ hai chỉ còn là $2$.

**Bước 1.** Gọi hai số lẻ liên tiếp là $2n-1$ và $2n+1$ với $n$ nguyên.

**Bước 2.** Áp dụng hằng đẳng thức hiệu hai bình phương để tách hiệu bình phương thành tích của tổng và hiệu hai số.

**Bước 3.** Rút gọn hai nhân tử rồi nhận ra tích là một bội của $8$.

**Phần 2. Trình bày**

Gọi hai số lẻ liên tiếp là $2n-1$ và $2n+1$ ($n\in\mathbb{Z}$). Ta có

$(2n+1)^2-(2n-1)^2=\left[(2n+1)+(2n-1)\right]\left[(2n+1)-(2n-1)\right]=4n\cdot2=8n$

Vì $n$ nguyên nên $8n\vdots8$.

Vậy hiệu bình phương của hai số lẻ liên tiếp chia hết cho $8$.

=== T7B.29@p157
- bai: 29 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Biểu diễn qua tổng và tích $s=x+y$, $p=xy$ · hằng đẳng thức $x^3+y^3=(x+y)^3-3xy(x+y)$ · số nguyên có bình phương chia hết cho số nguyên tố thì chia hết cho số nguyên tố đó
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Không cần máy (chứng minh đại số thuần).
## DE
Cho hai số thực $x,y$ sao cho $x+y$, $x^2+y^2$, $x^4+y^4$ là các số nguyên. Chứng minh $x^3+y^3$ cũng là số nguyên.
## SACH
Ta có $(x+y)(x^2+y^2)=x^3+y^3+xy(x+y)$ (1)

$x^2+y^2=(x+y)^2-2xy$ (2); $x^4+y^4=(x^2+y^2)^2-2x^2y^2$ (3)

Vì $x+y$, $x^2+y^2$ là số nguyên nên từ (2) $\Rightarrow2xy$ là số nguyên.

Vì $x^2+y^2$, $x^4+y^4$ là số nguyên nên từ (3) $\Rightarrow2x^2y^2=\dfrac{1}{2}(2xy)^2$ là số nguyên $\Rightarrow(2xy)^2$ chia hết cho $2\Rightarrow2xy$ chia hết cho $2$ (do $2$ là nguyên tố) $\Rightarrow xy$ là số nguyên. Do đó từ (1) suy ra $x^3+y^3$ là số nguyên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mọi lũy thừa của $x,y$ đều biểu diễn được qua tổng $s=x+y$ và tích $p=xy$; ba giả thiết cho biết $s$ nguyên, $2p$ nguyên, $2p^2$ nguyên, từ đó suy ra $p$ nguyên rồi tính $x^3+y^3$ theo $s$ và $p$.

**Bước 1.** Đặt $s=x+y$, $p=xy$ rồi viết $x^2+y^2$ và $x^4+y^4$ theo $s,p$ để dịch các giả thiết thành điều kiện nguyên của $s$, $2p$ và $2p^2$.

**Bước 2.** Đặt $q=2p$ nguyên và dùng $2p^2=\dfrac{q^2}{2}$ nguyên để suy ra $q$ chẵn, tức $p$ nguyên.

**Bước 3.** Viết $x^3+y^3$ theo $s$ và $p$ bằng hằng đẳng thức lập phương một tổng rồi kết luận nó là số nguyên.

**Phần 2. Trình bày**

Đặt $s=x+y$, $p=xy$. Theo giả thiết $s\in\mathbb{Z}$.

$x^2+y^2=s^2-2p$ nguyên và $s^2$ nguyên nên $q=2p$ là số nguyên.

$x^4+y^4=(x^2+y^2)^2-2p^2$ nguyên và $(x^2+y^2)^2$ nguyên nên $2p^2$ là số nguyên. Mà $2p^2=\dfrac{(2p)^2}{2}=\dfrac{q^2}{2}$, nên $q^2$ chia hết cho $2$, suy ra $q$ chẵn (vì $2$ là số nguyên tố). Vậy $p=\dfrac{q}{2}$ là số nguyên.

$x^3+y^3=(x+y)^3-3xy(x+y)=s^3-3ps$ là số nguyên vì $s$ và $p$ là số nguyên.

Vậy $x^3+y^3$ là số nguyên.
