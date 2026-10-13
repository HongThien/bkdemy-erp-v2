# ĐỀ | Đề cương ôn tập giữa học kì 1 Toán 7 — THCS Tây Mỗ
kieu: de_cuong
bo_sach: KNTT

## PHẦN 7 | Bài tập nâng cao (Bài 1–9) | tu_luan

### Bài 1 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** So sánh $A$ và $B$, biết: $A=\dfrac{1}{1011}.\left(1+\dfrac{1}{3}+\dfrac{1}{5}+\dots+\dfrac{1}{2019}\right)$ và $B=\dfrac{1}{1010}.\left(\dfrac{1}{2}+\dfrac{1}{4}+\dfrac{1}{6}+\dots+\dfrac{1}{2020}\right)$
**Chưa chắc:** lời giải dùng hai kĩ thuật nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chỉ có so sánh phân số thông thường): ghép hai tổng lẻ và chẵn thành tổng $1+\dfrac{1}{2}+\dots+\dfrac{1}{2020}$ để tính hiệu $X-Y$, rồi làm trội / làm giảm từng số hạng để ép bất đẳng thức; đây là dạng bồi dưỡng học sinh giỏi. Đáp số $A>B$ đã kiểm bằng phân số chính xác. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tổng trong ngoặc cùng có 1010 số hạng, và hiệu của chúng đổi được thành một tổng liên tiếp đủ lớn để so sánh $1010.X$ với $1011.Y$.

**Bước 1.** Đặt $X$ và $Y$ cho hai tổng trong ngoặc, rồi đếm số số hạng của từng tổng; ta thấy cả hai đều có 1010 số hạng.

**Bước 2.** Ghép $X$ với $Y$ được tổng $1+\dfrac{1}{2}+\dots+\dfrac{1}{2020}$, và để ý rằng $2.Y$ chính là tổng đó nhưng chỉ chạy đến $\dfrac{1}{1010}$.

**Bước 3.** Tính $X-Y=(X+Y)-2.Y$ để được tổng 1010 số hạng liên tiếp từ $\dfrac{1}{1011}$ đến $\dfrac{1}{2020}$, rồi đánh giá tổng này từ dưới bằng số hạng nhỏ nhất.

**Bước 4.** Đánh giá $Y$ từ trên bằng số hạng lớn nhất $\dfrac{1}{2}$, sau đó kết hợp hai đánh giá để so sánh $1010.X$ với $1011.Y$.

**Bước 5.** Chia cả hai vế cho $1010.1011$ để trở về so sánh $A$ với $B$.

**Chú ý:** không được kết luận ngay "$X>Y$ nên $A>B$", vì hai phân số đứng trước ngoặc khác nhau ($\dfrac{1}{1011}<\dfrac{1}{1010}$).

**Phần 2. Trình bày**

Đặt $X=1+\dfrac{1}{3}+\dfrac{1}{5}+\dots+\dfrac{1}{2019}$ và $Y=\dfrac{1}{2}+\dfrac{1}{4}+\dfrac{1}{6}+\dots+\dfrac{1}{2020}$.

Khi đó $A=\dfrac{1}{1011}.X$ và $B=\dfrac{1}{1010}.Y$.

Tổng $X$ có $(2019-1):2+1=1010$ số hạng, tổng $Y$ có $(2020-2):2+1=1010$ số hạng.

$X+Y=1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{2020}$

$2.Y=2.\left(\dfrac{1}{2}+\dfrac{1}{4}+\dots+\dfrac{1}{2020}\right)=1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{1010}$

Suy ra $X-Y=(X+Y)-2.Y=\left(1+\dfrac{1}{2}+\dots+\dfrac{1}{2020}\right)-\left(1+\dfrac{1}{2}+\dots+\dfrac{1}{1010}\right)=\dfrac{1}{1011}+\dfrac{1}{1012}+\dots+\dfrac{1}{2020}$

Tổng này có 1010 số hạng, mỗi số hạng đều lớn hơn hoặc bằng $\dfrac{1}{2020}$ nên $X-Y\ge1010.\dfrac{1}{2020}=\dfrac{1}{2}$.

Do đó $X\ge Y+\dfrac{1}{2}$.

Tổng $Y$ có 1010 số hạng, mỗi số hạng đều nhỏ hơn hoặc bằng $\dfrac{1}{2}$ và có số hạng nhỏ hơn $\dfrac{1}{2}$ nên $Y<1010.\dfrac{1}{2}=505$.

Từ đó $1010.X\ge1010.Y+1010.\dfrac{1}{2}=1010.Y+505>1010.Y+Y=1011.Y$.

Suy ra $1010.X>1011.Y$. Chia hai vế cho $1010.1011$ ta được $\dfrac{X}{1011}>\dfrac{Y}{1010}$.

Vậy $A>B$.

### Bài 2 | kho=dai | loai=tra_loi_ngan | dap_an=2023
**Đề:** Cho $C=1-\dfrac{1}{2}+\dfrac{1}{3}-\dfrac{1}{4}+\dots+\dfrac{1}{2021}-\dfrac{1}{2022}$ và $D=\dfrac{1}{1012}+\dfrac{1}{1013}+\dfrac{1}{1014}+\dots+\dfrac{1}{2022}$. Tính $(C-D)^{2022}+2023$.
**Ghi chú:** đề gốc in $D$ có dấu "−" thừa ngay trước dấu "+" của số hạng $\dfrac{1}{1014}$ (in ra "$\dfrac{1}{1013}-+\dfrac{1}{1014}$", đã phóng 500 dpi); đã sửa tối thiểu thành "+" (tổng liên tiếp từ $\dfrac{1}{1012}$ đến $\dfrac{1}{2022}$).
**Chưa chắc:** kĩ thuật viết tổng đan dấu thành hiệu hai tổng dương rồi ghép lại nằm ngoài lý thuyết lớp 7 trên bản đồ K7. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đổi tổng đan dấu $C$ thành hiệu của hai tổng dương để thấy $C$ bằng đúng tổng liên tiếp $D$, khi đó $C-D=0$.

**Bước 1.** Quan sát $C$: các số hạng mang dấu "−" là $\dfrac{1}{2};\dfrac{1}{4};\dots;\dfrac{1}{2022}$, còn các số hạng mang dấu "+" là $1;\dfrac{1}{3};\dots;\dfrac{1}{2021}$.

**Bước 2.** Viết $C$ thành tổng của mọi số hạng dương $1+\dfrac{1}{2}+\dots+\dfrac{1}{2022}$ rồi trừ đi hai lần tổng các số hạng đang mang dấu "−".

**Bước 3.** Nhận ra hai lần tổng các số hạng mang dấu "−" chính là $1+\dfrac{1}{2}+\dots+\dfrac{1}{1011}$, rồi trừ để chỉ còn các số hạng từ $\dfrac{1}{1012}$ đến $\dfrac{1}{2022}$.

**Bước 4.** So sánh kết quả với $D$ để tính $C-D$, rồi thay vào biểu thức cần tính.

**Chú ý:** $0$ mũ một số tự nhiên khác $0$ bằng $0$.

**Phần 2. Trình bày**

$C=1-\dfrac{1}{2}+\dfrac{1}{3}-\dfrac{1}{4}+\dots+\dfrac{1}{2021}-\dfrac{1}{2022}$

$=\left(1+\dfrac{1}{2}+\dfrac{1}{3}+\dfrac{1}{4}+\dots+\dfrac{1}{2022}\right)-2.\left(\dfrac{1}{2}+\dfrac{1}{4}+\dots+\dfrac{1}{2022}\right)$

$=\left(1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{2022}\right)-\left(1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{1011}\right)$

$=\dfrac{1}{1012}+\dfrac{1}{1013}+\dots+\dfrac{1}{2022}$

Do đó $C=D$, suy ra $C-D=0$.

$(C-D)^{2022}+2023=0^{2022}+2023=0+2023=2023$

Vậy giá trị của biểu thức bằng $2023$.

### Bài 3 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng tổng: $S=\dfrac{1}{2^2}-\dfrac{1}{2^4}+\dfrac{1}{2^6}-\dots+\dfrac{1}{2^{4n-2}}-\dfrac{1}{2^{4n}}+\dots+\dfrac{1}{2^{2018}}-\dfrac{1}{2^{2020}}<0,2$
**Chưa chắc:** kĩ thuật "nhân tổng với 4 rồi cộng với tổng ban đầu để các số hạng đối nhau triệt tiêu" (tổng dãy luỹ thừa cùng cơ số có dấu đan xen) nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chỉ có các phép tính với luỹ thừa, chưa có tổng dãy luỹ thừa). Đề đọc chắc: số mũ chạy $2;4;6;\dots;2020$ (khớp $4n-2=2018$ và $4n=2020$ với $n=505$). CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi số hạng bằng số hạng đứng trước nhân với $\dfrac{-1}{4}$, nên nhân $S$ với 4 rồi cộng với $S$ thì hầu hết các số hạng triệt tiêu.

**Bước 1.** Nhận ra quy luật của $S$: mẫu mỗi số hạng gấp 4 lần mẫu số hạng trước và dấu đan xen, số hạng cuối là $-\dfrac{1}{2^{2020}}$.

**Bước 2.** Nhân hai vế với 4: các số hạng của $4.S$ lệch đi một vị trí so với $S$ và có số hạng đầu bằng 1.

**Bước 3.** Cộng $4.S$ với $S$ vế theo vế để từng cặp số hạng đối nhau triệt tiêu, chỉ còn số 1 và số hạng cuối của $S$.

**Bước 4.** Từ $5.S$ nhỏ hơn 1 suy ra $S$ nhỏ hơn $\dfrac{1}{5}$, rồi đổi $\dfrac{1}{5}$ ra số thập phân để so với $0,2$.

**Chú ý:** số hạng cuối của $S$ mang dấu "−" nên $5.S=1-\dfrac{1}{2^{2020}}$ nhỏ hơn 1, chứ không bằng 1.

**Phần 2. Trình bày**

$S=\dfrac{1}{2^2}-\dfrac{1}{2^4}+\dfrac{1}{2^6}-\dots+\dfrac{1}{2^{2018}}-\dfrac{1}{2^{2020}}$

$4.S=1-\dfrac{1}{2^2}+\dfrac{1}{2^4}-\dots+\dfrac{1}{2^{2016}}-\dfrac{1}{2^{2018}}$

Cộng vế theo vế hai đẳng thức trên, các số hạng đối nhau triệt tiêu:

$4.S+S=1-\dfrac{1}{2^{2020}}$

$5.S=1-\dfrac{1}{2^{2020}}$

Vì $\dfrac{1}{2^{2020}}>0$ nên $5.S<1$, suy ra $S<\dfrac{1}{5}=0,2$.

Vậy $S<0,2$.

### Bài 4 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số nguyên $x$, $y$ biết: $\dfrac{5}{x}+\dfrac{y}{4}=\dfrac{1}{8}$
**Chưa chắc:** kĩ thuật "đưa về tích hai số nguyên bằng một hằng số rồi xét các ước, chú ý một thừa số luôn lẻ" (phương trình nghiệm nguyên hai ẩn) là dạng nâng cao, nằm ngoài lý thuyết trên bản đồ K7 (bản đồ chỉ có tìm một ẩn $x$); xét ước của số nguyên là kiến thức lớp 6. Đề không ghi $x\ne0$ nhưng mẫu $x$ buộc $x\ne0$. Đáp số 4 cặp đã thử lại bằng phân số chính xác. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa về tích $x.(1-2y)$ bằng một số nguyên cụ thể rồi xét các ước, chú ý $1-2y$ luôn là số lẻ.

**Bước 1.** Nêu điều kiện mẫu khác 0, rồi chuyển $\dfrac{y}{4}$ sang vế phải để cô lập $\dfrac{5}{x}$.

**Bước 2.** Quy đồng vế phải về mẫu 8 để viết $\dfrac{5}{x}$ bằng một phân số mà tử chỉ chứa $y$.

**Bước 3.** Nhân chéo hai phân số bằng nhau để được tích $x.(1-2y)$ bằng một số nguyên cụ thể.

**Bước 4.** Vì $1-2y$ là số lẻ nên chỉ xét các ước lẻ của số đó, với mỗi ước lần lượt tìm $y$ rồi tìm $x$.

**Chú ý:** $x$ và $y$ là số nguyên nên phải xét cả các ước âm $-1$ và $-5$, đừng bỏ sót.

**Phần 2. Trình bày**

Điều kiện: $x\ne0$.

$\dfrac{5}{x}+\dfrac{y}{4}=\dfrac{1}{8}$

$\dfrac{5}{x}=\dfrac{1}{8}-\dfrac{y}{4}$

$\dfrac{5}{x}=\dfrac{1}{8}-\dfrac{2y}{8}$

$\dfrac{5}{x}=\dfrac{1-2y}{8}$

$x.(1-2y)=5.8$

$x.(1-2y)=40$

Vì $x$, $y$ là số nguyên nên $1-2y$ là ước nguyên của $40$. Do $2y$ là số chẵn nên $1-2y$ là số lẻ, suy ra $1-2y\in\{-5;-1;1;5\}$.

Trường hợp $1-2y=1$ thì $y=0$ và $x=40:1=40$.

Trường hợp $1-2y=-1$ thì $y=1$ và $x=40:(-1)=-40$.

Trường hợp $1-2y=5$ thì $y=-2$ và $x=40:5=8$.

Trường hợp $1-2y=-5$ thì $y=3$ và $x=40:(-5)=-8$.

Thử lại: $\dfrac{5}{40}+\dfrac{0}{4}=\dfrac{1}{8}$; $\dfrac{5}{-40}+\dfrac{1}{4}=\dfrac{-1}{8}+\dfrac{2}{8}=\dfrac{1}{8}$; $\dfrac{5}{8}+\dfrac{-2}{4}=\dfrac{5}{8}-\dfrac{4}{8}=\dfrac{1}{8}$; $\dfrac{5}{-8}+\dfrac{3}{4}=\dfrac{-5}{8}+\dfrac{6}{8}=\dfrac{1}{8}$.

Vậy $(x;y)\in\left\{(40;0);(-40;1);(8;-2);(-8;3)\right\}$.

### Bài 5 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $P=\dfrac{3}{4}+\dfrac{8}{9}+\dfrac{15}{16}+\dots+\dfrac{9999}{10000}$. Chứng minh rằng $P>98$.
**Chưa chắc:** kĩ thuật làm trội $\dfrac{1}{n^2}<\dfrac{1}{(n-1).n}=\dfrac{1}{n-1}-\dfrac{1}{n}$ rồi triệt tiêu liên tiếp nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chỉ có cộng trừ phân số thông thường); đây là dạng bồi dưỡng học sinh giỏi. Quy luật số hạng đọc chắc: tử $=n^2-1$, mẫu $=n^2$ với $n=2;3;\dots;100$ (99 số hạng). CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi số hạng có dạng $1-\dfrac{1}{n^2}$, nên $P$ bằng 99 trừ đi một tổng mà ta chứng minh được nhỏ hơn 1.

**Bước 1.** Nhận ra các tử $3;8;15;\dots;9999$ đều bằng mẫu trừ 1, tức mỗi số hạng có dạng $\dfrac{n^2-1}{n^2}$ với mẫu là bình phương của $n$.

**Bước 2.** Tách mỗi số hạng thành $1-\dfrac{1}{n^2}$ và đếm số số hạng ($n$ từ 2 đến 100) để viết $P$ thành 99 trừ một tổng.

**Bước 3.** Làm trội từng số hạng $\dfrac{1}{n^2}$ của tổng đó thành $\dfrac{1}{(n-1).n}$, vì mẫu nhỏ hơn thì phân số lớn hơn.

**Bước 4.** Tách $\dfrac{1}{(n-1).n}$ thành hiệu hai phân số để cả dãy triệt tiêu, thấy tổng nhỏ hơn 1 rồi suy ra $P$ lớn hơn 98.

**Chú ý:** $n$ chạy từ 2 đến 100 nên có 99 số hạng chứ không phải 100.

**Phần 2. Trình bày**

Ta có $3=2^2-1$; $8=3^2-1$; $15=4^2-1$; $\dots$; $9999=100^2-1$ nên

$P=\dfrac{2^2-1}{2^2}+\dfrac{3^2-1}{3^2}+\dfrac{4^2-1}{4^2}+\dots+\dfrac{100^2-1}{100^2}$

$=\left(1-\dfrac{1}{2^2}\right)+\left(1-\dfrac{1}{3^2}\right)+\left(1-\dfrac{1}{4^2}\right)+\dots+\left(1-\dfrac{1}{100^2}\right)$

Tổng có $100-2+1=99$ số hạng nên

$P=99-\left(\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{100^2}\right)$

Đặt $Q=\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dots+\dfrac{1}{100^2}$.

Với mọi số tự nhiên $n\ge2$ ta có $n^2>(n-1).n$ nên $\dfrac{1}{n^2}<\dfrac{1}{(n-1).n}$.

Lại có $\dfrac{1}{n-1}-\dfrac{1}{n}=\dfrac{n-(n-1)}{(n-1).n}=\dfrac{1}{(n-1).n}$.

Do đó $Q<\dfrac{1}{1.2}+\dfrac{1}{2.3}+\dots+\dfrac{1}{99.100}$

$=\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\dots+\left(\dfrac{1}{99}-\dfrac{1}{100}\right)$

$=1-\dfrac{1}{100}<1$

Suy ra $P=99-Q>99-1=98$.

Vậy $P>98$.

### Bài 6 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng $B=\dfrac{3}{1^2.2^2}+\dfrac{5}{2^2.3^2}+\dfrac{7}{3^2.4^2}+\dots+\dfrac{2n+1}{n^2.(n+1)^2}<1$.
**Chưa chắc:** kĩ thuật tách $\dfrac{2k+1}{k^2.(k+1)^2}=\dfrac{1}{k^2}-\dfrac{1}{(k+1)^2}$ nhờ $(k+1)^2-k^2=2k+1$ rồi triệt tiêu nằm ngoài lý thuyết lớp 7 trên bản đồ K7. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử $2k+1$ chính là hiệu $(k+1)^2-k^2$, nên mỗi số hạng tách được thành hiệu hai phân số liên tiếp và cả tổng triệt tiêu.

**Bước 1.** Quan sát số hạng tổng quát $\dfrac{2k+1}{k^2.(k+1)^2}$ và nhận ra tử bằng hiệu hai bình phương của hai thừa số ở mẫu.

**Bước 2.** Viết tử thành $(k+1)^2-k^2$ rồi tách phân số thành hiệu hai phân số có mẫu lần lượt là $k^2$ và $(k+1)^2$.

**Bước 3.** Cộng các số hạng từ $k=1$ đến $k=n$: số trừ của số hạng này đối với số cộng của số hạng kế tiếp nên triệt tiêu từng cặp.

**Bước 4.** Chỉ còn số hạng đầu và số trừ cuối; vì số trừ cuối là một phân số dương nên hiệu nhỏ hơn số hạng đầu, tức nhỏ hơn 1.

**Chú ý:** khai triển $(k+1)^2=(k+1).(k+1)$ bằng tính chất phân phối của phép nhân đối với phép cộng, đừng nhầm $(k+1)^2$ với $k^2+1$.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $k\ge1$ ta có $(k+1)^2=(k+1).(k+1)=k.(k+1)+1.(k+1)=k^2+k+k+1=k^2+2k+1$ nên $(k+1)^2-k^2=2k+1$.

Do đó $\dfrac{2k+1}{k^2.(k+1)^2}=\dfrac{(k+1)^2-k^2}{k^2.(k+1)^2}=\dfrac{(k+1)^2}{k^2.(k+1)^2}-\dfrac{k^2}{k^2.(k+1)^2}=\dfrac{1}{k^2}-\dfrac{1}{(k+1)^2}$.

Áp dụng cho $k=1;2;3;\dots;n$:

$B=\left(\dfrac{1}{1^2}-\dfrac{1}{2^2}\right)+\left(\dfrac{1}{2^2}-\dfrac{1}{3^2}\right)+\left(\dfrac{1}{3^2}-\dfrac{1}{4^2}\right)+\dots+\left(\dfrac{1}{n^2}-\dfrac{1}{(n+1)^2}\right)$

$=1-\dfrac{1}{(n+1)^2}$

Vì $\dfrac{1}{(n+1)^2}>0$ nên $B=1-\dfrac{1}{(n+1)^2}<1$.

Vậy $B<1$.

### Bài 7 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho ba số $a,b,c$ thỏa mãn $0\le a\le b+1\le c+2$ và $a+b+c=1$. Tìm giá trị nhỏ nhất của $c$.
**Ghi chú:** đề gốc in "giá tị nhỏ nhất" (thiếu chữ "r"); đã sửa thành "giá trị nhỏ nhất".
**Chưa chắc:** kĩ thuật "cộng các bất đẳng thức cùng chiều rồi chỉ ra dấu bằng xảy ra để kết luận giá trị nhỏ nhất" nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chỉ có so sánh số, chưa có bất đẳng thức / cực trị). Đề không nói $a,b,c$ thuộc tập nào; lời giải hiểu là số hữu tỉ (số thực) bất kì. Đáp số $-\dfrac{2}{3}$ đã kiểm bằng dò lưới. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $a$ và $b$ đều bị chặn trên bởi biểu thức theo $c$, nên cộng lại với $c$ và dùng $a+b+c=1$ để tìm giới hạn dưới của $c$.

**Bước 1.** Tách chuỗi $a\le b+1\le c+2$ thành các bất đẳng thức đơn để biết $a$ và $b$ bị chặn trên bởi biểu thức theo $c$ như thế nào.

**Bước 2.** Cộng các bất đẳng thức cùng chiều (kể cả $c\le c$) để $a+b+c$ nhỏ hơn hoặc bằng một biểu thức chỉ chứa $c$.

**Bước 3.** Thay $a+b+c=1$ vào bất đẳng thức đó để suy ra giới hạn dưới của $c$.

**Bước 4.** Chọn $a$, $b$ để mọi dấu "=" cùng xảy ra rồi thử lại ba điều kiện của đề, xem giá trị đó có đạt được không.

**Chú ý:** tìm giá trị nhỏ nhất thì phải chỉ ra giá trị đó xảy ra; chỉ chứng minh được $c$ lớn hơn hoặc bằng một số là chưa đủ.

**Phần 2. Trình bày**

Từ $a\le b+1\le c+2$ ta có $a\le c+2$ và $b+1\le c+2$, tức $b\le c+1$.

Cộng vế theo vế ba bất đẳng thức $a\le c+2$, $b\le c+1$, $c\le c$:

$a+b+c\le(c+2)+(c+1)+c$

$a+b+c\le3c+3$

Mà $a+b+c=1$ nên $1\le3c+3$.

$3c\ge1-3$

$3c\ge-2$

$c\ge-\dfrac{2}{3}$

Dấu "=" xảy ra khi $a=c+2$ và $b=c+1$. Khi đó $a+b+c=(c+2)+(c+1)+c=3c+3=1$ nên $c=-\dfrac{2}{3}$, $a=\dfrac{4}{3}$, $b=\dfrac{1}{3}$.

Thử lại: $0\le a=\dfrac{4}{3}$; $b+1=\dfrac{1}{3}+1=\dfrac{4}{3}$; $c+2=-\dfrac{2}{3}+2=\dfrac{4}{3}$ nên $0\le\dfrac{4}{3}\le\dfrac{4}{3}\le\dfrac{4}{3}$; $a+b+c=\dfrac{4}{3}+\dfrac{1}{3}-\dfrac{2}{3}=1$.

Vậy giá trị nhỏ nhất của $c$ là $-\dfrac{2}{3}$, đạt khi $a=\dfrac{4}{3}$, $b=\dfrac{1}{3}$, $c=-\dfrac{2}{3}$.

### Bài 8 | kho=dai | loai=tra_loi_ngan | dap_an=14
**Đề:** Cho $M=\dfrac{42-x}{x-15}$. Tìm số nguyên $x$ để $M$ đạt giá trị nhỏ nhất.
**Chưa chắc:** kĩ thuật tách $M=\dfrac{27}{x-15}-1$ rồi đánh giá theo dấu của mẫu để tìm giá trị nhỏ nhất nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chưa có cực trị). CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tách tử thành "một số trừ đi mẫu" để $M$ bằng một phân số có tử là hằng số, trừ đi một số, rồi xét dấu của mẫu.

**Bước 1.** Nêu điều kiện của $x$ để mẫu $x-15$ khác 0.

**Bước 2.** Viết $42-x=27-(x-15)$ để tử chứa mẫu, rồi tách $M$ thành một phân số có tử là 27 trừ đi một số.

**Bước 3.** Xét dấu của mẫu $x-15$: mẫu dương thì phân số dương, mẫu âm thì phân số âm.

**Bước 4.** Trong trường hợp mẫu âm, tìm số nguyên âm làm phân số nhỏ nhất, từ đó tìm $x$ và giá trị nhỏ nhất của $M$.

**Chú ý:** với tử dương và mẫu là số nguyên âm, mẫu có giá trị tuyệt đối càng nhỏ thì phân số càng nhỏ.

**Phần 2. Trình bày**

Điều kiện: $x\ne15$.

$M=\dfrac{42-x}{x-15}=\dfrac{27-(x-15)}{x-15}=\dfrac{27}{x-15}-1$

Nếu $x-15>0$ thì $\dfrac{27}{x-15}>0$ nên $M>-1$.

Nếu $x-15<0$ thì $x-15$ là số nguyên âm, suy ra $x-15\le-1$, tức $\left|x-15\right|\ge1$.

Khi đó $\left|\dfrac{27}{x-15}\right|\le27$ và $\dfrac{27}{x-15}<0$ nên $\dfrac{27}{x-15}\ge-27$.

Suy ra $M\ge-27-1=-28$.

Dấu "=" xảy ra khi $x-15=-1$, tức $x=14$.

Thử lại: với $x=14$ thì $M=\dfrac{42-14}{14-15}=\dfrac{28}{-1}=-28$.

Vì $-28<-1$ nên $M$ nhỏ nhất bằng $-28$ khi $x=14$.

Vậy $x=14$.

### Bài 9 | kho=dai | loai=tra_loi_ngan | dap_an=50
**Đề:** Tính giá trị biểu thức: $B=\dfrac{1+\dfrac{1}{3}+\dfrac{1}{5}+\dots+\dfrac{1}{95}+\dfrac{1}{97}+\dfrac{1}{99}}{\dfrac{1}{1.99}+\dfrac{1}{3.97}+\dfrac{1}{5.95}+\dots+\dfrac{1}{95.5}+\dfrac{1}{97.3}+\dfrac{1}{99.1}}$
**Ghi chú:** ở mẫu số, dấu chấm trong $1.99$, $3.97$, $\dots$, $99.1$ là dấu nhân (tích hai số lẻ có tổng bằng 100), không phải số thập phân.
**Chưa chắc:** kĩ thuật tách $\dfrac{1}{k.(100-k)}=\dfrac{1}{100}.\left(\dfrac{1}{k}+\dfrac{1}{100-k}\right)$ rồi ghép các số hạng đối xứng nằm ngoài lý thuyết lớp 7 trên bản đồ K7 (bản đồ chỉ có cộng trừ nhân chia phân số thông thường). Đáp số $50$ đã kiểm bằng phân số chính xác. CEO quyết giữ hay loại.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai thừa số ở mỗi số hạng của mẫu luôn có tổng bằng 100, nên mỗi số hạng tách được thành $\dfrac{1}{100}$ nhân tổng hai phân số, và mẫu quy về đúng tổng ở tử.

**Bước 1.** Nhận ra ở mẫu số, hai thừa số của mỗi tích đều là số lẻ và có tổng bằng 100 ($1+99$, $3+97$, $5+95$, $\dots$).

**Bước 2.** Kiểm tra bằng quy đồng rằng $\dfrac{1}{k}+\dfrac{1}{100-k}$ bằng $\dfrac{100}{k.(100-k)}$, từ đó viết từng số hạng ở mẫu thành $\dfrac{1}{100}$ nhân tổng hai phân số.

**Bước 3.** Cộng cả mẫu: mỗi phân số $\dfrac{1}{k}$ với $k$ lẻ từ 1 đến 99 xuất hiện đúng hai lần, nên mẫu bằng $\dfrac{2}{100}$ nhân tổng ở tử.

**Bước 4.** Đặt tổng ở tử là $T$ rồi chia tử cho mẫu để $T$ rút gọn.

**Chú ý:** $T$ là tổng các phân số dương nên $T\ne0$, rút gọn $T$ được.

**Phần 2. Trình bày**

Với $k$ lẻ ($1\le k\le99$) ta có $k+(100-k)=100$ nên

$\dfrac{1}{k}+\dfrac{1}{100-k}=\dfrac{100-k}{k.(100-k)}+\dfrac{k}{k.(100-k)}=\dfrac{100}{k.(100-k)}$

Suy ra $\dfrac{1}{k.(100-k)}=\dfrac{1}{100}.\left(\dfrac{1}{k}+\dfrac{1}{100-k}\right)$.

Đặt $T=1+\dfrac{1}{3}+\dfrac{1}{5}+\dots+\dfrac{1}{99}$.

Mẫu số $=\dfrac{1}{100}.\left[\left(1+\dfrac{1}{99}\right)+\left(\dfrac{1}{3}+\dfrac{1}{97}\right)+\left(\dfrac{1}{5}+\dfrac{1}{95}\right)+\dots+\left(\dfrac{1}{97}+\dfrac{1}{3}\right)+\left(\dfrac{1}{99}+1\right)\right]$

Mỗi phân số $\dfrac{1}{k}$ ($k=1;3;5;\dots;99$) xuất hiện đúng hai lần trong ngoặc vuông nên

Mẫu số $=\dfrac{1}{100}.2.T=\dfrac{T}{50}$

$B=T:\dfrac{T}{50}=T.\dfrac{50}{T}=50$

Vậy $B=50$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phạm vi: phần "BÀI TẬP NÂNG CAO" Bài 1–9 (Bài 1 ở cuối trang 9, Bài 2–9 ở nửa trên trang 10 của scan). Phần "MÔN KHTN" ở nửa dưới trang 10 đã bỏ theo yêu cầu. Câu bỏ: không có.
- Bộ sách: đề cương không ghi, đoán KNTT theo nội dung (số hữu tỉ, dãy phân số). Cả 9 bài là bài nâng cao (dạng bồi dưỡng học sinh giỏi): đều dùng kĩ thuật triệt tiêu / làm trội / đánh giá bất đẳng thức nằm ngoài lý thuyết trên bản đồ K7; mỗi bài đã có dòng `Chưa chắc` nêu kĩ thuật để CEO quyết giữ hay loại.
- Bài 2: đề in lỗi ở $D$ (dấu "−" thừa trước dấu "+" của $\dfrac{1}{1014}$, đã phóng 500 dpi); đã sửa thành "+", khi đó $C=D$ và đáp số $2023$.
- Bài 6: đề không nói rõ $n$; hiểu $n$ là số tự nhiên khác 0 bất kì. Bài 9: dấu chấm ở mẫu số là dấu nhân.
- Bài 7: đề in "giá tị" đã sửa thành "giá trị".
- Mọi đáp số đã thử lại bằng `node` (phân số chính xác bằng BigInt): Bài 1 $A>B$ (kèm $X-Y=\dfrac{1}{1011}+\dots+\dfrac{1}{2020}>\dfrac{1}{2}$ và $Y<505$); Bài 2 $C=D$; Bài 3 $5S=1-\dfrac{1}{2^{2020}}$; Bài 4 đúng 4 cặp trong $[-500;500]^2$; Bài 5 $P\approx98,365$; Bài 6 kiểm $n=1,2,3,10,50$; Bài 7 dò lưới được $c=-\dfrac{2}{3}$; Bài 8 dò $x\in[-2000;2000]$ được $x=14$, $M=-28$; Bài 9 $B=50$.
- Loại câu: Bài 2 ($2023$), Bài 8 ($14$) và Bài 9 ($50$) là `tra_loi_ngan` (đáp số một số vừa 4 ô); Bài 1, 3, 4, 5, 6, 7 là `tu_luan` (chứng minh / so sánh / nhiều cặp nghiệm / phân số $-\dfrac{2}{3}$).
