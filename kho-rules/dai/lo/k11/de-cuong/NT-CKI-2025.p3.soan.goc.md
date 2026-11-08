# ĐỀ | Ôn tập học kì I Toán 11 năm 2025–2026 — Trường THPT Nguyễn Trãi, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 31 | Phần 1: Bài tập trắc nghiệm — V. Giới hạn, hàm số liên tục | trac_nghiem

### Câu 7 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính giới hạn $\lim\limits_{n\to+\infty}\dfrac{3+7+11+\dots+(4n+7)}{3n^2+4}$.
A. $0$.
B. $\dfrac{2}{3}$.
C. $\dfrac{1}{3}$.
D. $\dfrac{4}{3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử số là tổng của một cấp số cộng, ta đưa nó về một đa thức theo $n$ rồi so bậc với mẫu.

**Bước 1.** Nhận ra các số hạng $3;7;11;\dots;4n+7$ lập thành cấp số cộng và xác định công sai, số hạng đầu, số hạng cuối.

**Bước 2.** Tìm số số hạng của tổng bằng cách giải phương trình số hạng tổng quát bằng $4n+7$.

**Bước 3.** Áp dụng công thức tổng của cấp số cộng để viết tử số thành tích hai nhị thức bậc nhất theo $n$.

**Bước 4.** Chia cả tử và mẫu cho lũy thừa cao nhất của $n$ rồi dùng $\lim\dfrac{1}{n}=0$ để tìm giới hạn.

**Phần 2. Trình bày**

Các số $3;7;11;\dots;4n+7$ lập thành cấp số cộng có $u_1=3$, công sai $d=4$, số hạng cuối $4n+7$.

Số hạng thứ $k$ là $3+4(k-1)=4k-1$. Cho $4k-1=4n+7$ suy ra $k=n+2$, nên tổng có $n+2$ số hạng.

$3+7+11+\dots+(4n+7)=\dfrac{(n+2)(3+4n+7)}{2}=(n+2)(2n+5)=2n^2+9n+10$.

$\lim\dfrac{2n^2+9n+10}{3n^2+4}=\lim\dfrac{2+\dfrac{9}{n}+\dfrac{10}{n^2}}{3+\dfrac{4}{n^2}}=\dfrac{2}{3}$.

Chọn B.

### Câu 8 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Giới hạn $\lim\limits_{x\to0}\dfrac{1}{|x|}$ bằng
A. $-\infty$.
B. $+\infty$.
C. $0$.
D. Một giá trị khác.

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi mẫu số tiến về $0$ và luôn dương thì phân số có tử số dương tiến ra vô cực theo quy tắc giới hạn vô cực.

**Bước 1.** Xét giới hạn của mẫu số $|x|$ khi $x$ tiến về $0$.

**Bước 2.** Xét dấu của mẫu số với mọi $x\neq0$ gần $0$.

**Bước 3.** Áp dụng quy tắc giới hạn của thương khi tử số là hằng số dương và mẫu số dương tiến về $0$, rồi đối chiếu bốn phương án.

**Phần 2. Trình bày**

Ta có $\lim\limits_{x\to0}|x|=0$.

Với mọi $x\neq0$ thì $|x|>0$.

Do đó $\lim\limits_{x\to0}\dfrac{1}{|x|}=+\infty$.

Chọn B.

### Câu 9 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Giá trị của giới hạn $\lim\limits_{x\to2}\left(3x^2+7x+11\right)$ là
A. $37$.
B. $38$.
C. $39$.
D. $40$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm đa thức liên tục tại mọi điểm nên giới hạn tại $x=2$ chính là giá trị của hàm tại điểm đó.

**Bước 1.** Nhận biết biểu thức dưới dấu giới hạn là hàm đa thức nên có thể thay trực tiếp $x=2$.

**Bước 2.** Thay $x=2$ vào từng hạng tử rồi cộng các kết quả lại.

**Bước 3.** So kết quả với bốn phương án để chọn.

**Phần 2. Trình bày**

Hàm số $f(x)=3x^2+7x+11$ là hàm đa thức nên liên tục trên $\mathbb{R}$.

$\lim\limits_{x\to2}\left(3x^2+7x+11\right)=3\cdot2^2+7\cdot2+11=12+14+11=37$.

Chọn A.

### Câu 10 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Tính $\lim\limits_{x\to1}\dfrac{x^2-5x+4}{x-1}$ bằng
A. $-3$.
B. $4$.
C. $+\infty$.
D. $-\infty$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** thay $x=1$ cho dạng $\dfrac{0}{0}$ nên phải phân tích tử thành nhân tử để rút gọn $x-1$.

**Bước 1.** Thay $x=1$ vào tử và mẫu để nhận ra dạng vô định.

**Bước 2.** Phân tích tam thức bậc hai ở tử số thành tích hai nhân tử bậc nhất, trong đó có nhân tử trùng với mẫu.

**Bước 3.** Rút gọn nhân tử chung rồi thay $x=1$ vào biểu thức còn lại.

**Phần 2. Trình bày**

Khi $x\to1$, tử và mẫu cùng tiến về $0$ nên ta phân tích tử số.

$x^2-5x+4=(x-1)(x-4)$.

Với $x\neq1$ thì $\dfrac{x^2-5x+4}{x-1}=x-4$.

$\lim\limits_{x\to1}\dfrac{x^2-5x+4}{x-1}=\lim\limits_{x\to1}(x-4)=-3$.

Chọn A.

### Câu 11 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Tính $\lim\limits_{x\to+\infty}\dfrac{3x-1}{x+2}$.
A. $+\infty$.
B. $0$.
C. $-\infty$.
D. $3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giới hạn của phân thức khi $x\to+\infty$ được tìm bằng cách chia tử và mẫu cho lũy thừa cao nhất của $x$.

**Bước 1.** Xác định bậc của tử và của mẫu để biết lũy thừa cao nhất cần chia.

**Bước 2.** Chia cả tử và mẫu cho $x$ rồi viết lại biểu thức.

**Bước 3.** Dùng $\lim\dfrac{1}{x}=0$ khi $x\to+\infty$ để tính giới hạn của tử và của mẫu.

**Phần 2. Trình bày**

$\dfrac{3x-1}{x+2}=\dfrac{3-\dfrac{1}{x}}{1+\dfrac{2}{x}}$ với $x\neq0$.

Khi $x\to+\infty$ thì $\dfrac{1}{x}\to0$ và $\dfrac{2}{x}\to0$.

$\lim\limits_{x\to+\infty}\dfrac{3x-1}{x+2}=\dfrac{3-0}{1+0}=3$.

Chọn D.

### Câu 12 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Tính giới hạn $I=\lim\limits_{x\to1}\dfrac{x^2+2x-3}{x^3-1}$.
A. $\dfrac{4}{3}$.
B. $\dfrac{3}{4}$.
C. $\dfrac{5}{3}$.
D. $\dfrac{5}{4}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cả tử và mẫu cùng triệt tiêu tại $x=1$ nên cùng chứa nhân tử $x-1$ cần rút gọn.

**Bước 1.** Kiểm tra bằng cách thay $x=1$ để nhận ra dạng vô định $\dfrac{0}{0}$.

**Bước 2.** Phân tích tử số bằng cách tìm hai nghiệm của tam thức bậc hai.

**Bước 3.** Phân tích mẫu số bằng hằng đẳng thức hiệu hai lập phương.

**Bước 4.** Rút gọn $x-1$ ở tử và mẫu rồi thay $x=1$ vào phân thức còn lại.

**Phần 2. Trình bày**

Khi $x\to1$ thì tử và mẫu cùng tiến về $0$.

$x^2+2x-3=(x-1)(x+3)$.

$x^3-1=(x-1)(x^2+x+1)$.

Với $x\neq1$ thì $\dfrac{x^2+2x-3}{x^3-1}=\dfrac{x+3}{x^2+x+1}$.

$I=\lim\limits_{x\to1}\dfrac{x+3}{x^2+x+1}=\dfrac{1+3}{1+1+1}=\dfrac{4}{3}$.

Chọn A.

### Câu 13 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Biết $\lim\limits_{x\to+\infty}\dfrac{ax+5}{2x-1}=3$. Chọn khẳng định đúng.
A. $a\in(2;4)$.
B. $a\in(3;5)$.
C. $a\in(4;6)$.
D. $a\in(5;7)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính giới hạn của phân thức theo tham số $a$ rồi cho bằng giá trị đề cho để tìm $a$.

**Bước 1.** Chia tử và mẫu cho $x$ để tính giới hạn khi $x\to+\infty$ theo $a$.

**Bước 2.** Cho giới hạn vừa tìm bằng $3$ và giải phương trình bậc nhất ẩn $a$.

**Bước 3.** Kiểm tra giá trị $a$ thuộc khoảng nào, chú ý các khoảng ở đề là khoảng mở.

**Phần 2. Trình bày**

$\dfrac{ax+5}{2x-1}=\dfrac{a+\dfrac{5}{x}}{2-\dfrac{1}{x}}$ với $x\neq0$.

$\lim\limits_{x\to+\infty}\dfrac{ax+5}{2x-1}=\dfrac{a}{2}$.

Theo đề, $\dfrac{a}{2}=3$ nên $a=6$.

Ta có $6\in(5;7)$ và $6\notin(4;6)$ vì khoảng $(4;6)$ không chứa đầu mút $6$.

Chọn D.

### Câu 14 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Tính giới hạn $\lim\limits_{x\to-\infty}\dfrac{\sqrt{4x^2+1}}{2x-1}$.
A. $\dfrac{1}{2}$.
B. $1$.
C. $-\dfrac{1}{2}$.
D. $-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi $x\to-\infty$ thì $x<0$ nên $\sqrt{x^2}=-x$, đây là chỗ dễ sai dấu khi đưa $x$ ra khỏi căn.

**Bước 1.** Đưa $x^2$ ra ngoài dấu căn ở tử và ghi rõ dấu của $\sqrt{x^2}$ theo điều kiện $x<0$.

**Bước 2.** Chia cả tử và mẫu cho $x$ rồi rút gọn để chỉ còn các số hạng dạng $\dfrac{c}{x}$ và $\dfrac{c}{x^2}$.

**Bước 3.** Cho $x\to-\infty$ và dùng giới hạn của các số hạng đó để suy ra giới hạn cần tìm.

**Phần 2. Trình bày**

Với $x<0$ thì $\sqrt{4x^2+1}=\sqrt{x^2\left(4+\dfrac{1}{x^2}\right)}=|x|\sqrt{4+\dfrac{1}{x^2}}=-x\sqrt{4+\dfrac{1}{x^2}}$.

$\dfrac{\sqrt{4x^2+1}}{2x-1}=\dfrac{-x\sqrt{4+\dfrac{1}{x^2}}}{x\left(2-\dfrac{1}{x}\right)}=\dfrac{-\sqrt{4+\dfrac{1}{x^2}}}{2-\dfrac{1}{x}}$.

Khi $x\to-\infty$ thì $\dfrac{1}{x^2}\to0$ và $\dfrac{1}{x}\to0$.

$\lim\limits_{x\to-\infty}\dfrac{\sqrt{4x^2+1}}{2x-1}=\dfrac{-\sqrt{4}}{2}=-1$.

Chọn D.

### Câu 15 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Biết $\lim\limits_{x\to1}\dfrac{x^2-ax+2}{2x^2-3x+1}=-1$, ở đó $a$ là một số thực. Khẳng định nào sau đây là đúng?
A. $2{,}5<a<3{,}5$.
B. $1{,}5<a<2{,}5$.
C. $0{,}5<a<1{,}5$.
D. $3{,}5<a<4{,}5$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu số bằng $0$ tại $x=1$ mà giới hạn hữu hạn nên tử số cũng phải bằng $0$ tại $x=1$.

**Bước 1.** Phân tích mẫu số $2x^2-3x+1$ thành nhân tử để thấy nhân tử $x-1$.

**Bước 2.** Lập luận điều kiện cần: nếu tử số khác $0$ tại $x=1$ thì giới hạn là vô cực, từ đó suy ra phương trình theo $a$.

**Bước 3.** Giải phương trình để tìm $a$, sau đó phân tích tử thành nhân tử và rút gọn.

**Bước 4.** Tính lại giới hạn với giá trị $a$ vừa tìm để kiểm tra có đúng bằng giá trị đề cho rồi đối chiếu các khoảng.

**Phần 2. Trình bày**

Ta có $2x^2-3x+1=(x-1)(2x-1)$, mẫu số bằng $0$ khi $x=1$.

Nếu $1-a+2\neq0$ thì khi $x\to1$ tử số tiến về hằng số khác $0$ còn mẫu số tiến về $0$, giới hạn là vô cực, trái với giả thiết.

Do đó $1-a+2=0$, tức là $a=3$.

Với $a=3$: $x^2-3x+2=(x-1)(x-2)$.

Với $x\neq1$ thì $\dfrac{x^2-3x+2}{2x^2-3x+1}=\dfrac{x-2}{2x-1}$.

$\lim\limits_{x\to1}\dfrac{x-2}{2x-1}=\dfrac{1-2}{2-1}=-1$, đúng với giả thiết.

Vì $2{,}5<3<3{,}5$ nên $a$ thuộc khoảng ở phương án A.

Chọn A.

### Câu 16 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Trong các hàm số sau, hàm số nào liên tục trên $(-\infty;+\infty)$?
A. $f(x)=\tan x+5$.
B. $f(x)=\dfrac{x^2+3}{5-x}$.
C. $f(x)=\sqrt{x-6}$.
D. $f(x)=x^3-3x^2+1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục trên toàn $\mathbb{R}$ phải xác định tại mọi số thực, nên ta tìm tập xác định của từng phương án.

**Bước 1.** Với phương án có $\tan x$, tìm các giá trị của $x$ mà hàm số không xác định.

**Bước 2.** Với phương án phân thức, tìm giá trị làm mẫu số bằng $0$.

**Bước 3.** Với phương án căn thức, tìm điều kiện của biểu thức dưới căn.

**Bước 4.** Với phương án còn lại, dùng tính chất hàm đa thức để kết luận rồi chọn.

**Phần 2. Trình bày**

Phương án A: $\tan x$ không xác định tại $x=\dfrac{\pi}{2}+k\pi$ nên $f$ không liên tục trên $\mathbb{R}$.

Phương án B: $f$ không xác định tại $x=5$ nên không liên tục trên $\mathbb{R}$.

Phương án C: $f$ chỉ xác định khi $x\ge6$ nên không liên tục trên $\mathbb{R}$.

Phương án D: $f(x)=x^3-3x^2+1$ là hàm đa thức nên liên tục trên $\mathbb{R}$.

Chọn D.

### Câu 17 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Với giá trị nào của $m$ thì hàm số $f(x)=\begin{cases}\dfrac{x^2-4}{x-2} & \text{khi } x\neq2\\ m & \text{khi } x=2\end{cases}$ liên tục tại $x_0=2$?
A. $m=4$.
B. $m=3$.
C. $m=5$.
D. $m=6$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục tại $x_0$ khi giới hạn của hàm tại $x_0$ bằng giá trị $f(x_0)$.

**Bước 1.** Viết điều kiện liên tục tại $x_0=2$ dưới dạng đẳng thức giữa giới hạn và $f(2)$.

**Bước 2.** Tính giới hạn ở nhánh $x\neq2$ bằng cách phân tích tử số thành nhân tử và rút gọn.

**Bước 3.** Cho giới hạn bằng $f(2)=m$ để tìm $m$ rồi đối chiếu phương án.

**Phần 2. Trình bày**

Ta có $f(2)=m$.

Với $x\neq2$ thì $\dfrac{x^2-4}{x-2}=\dfrac{(x-2)(x+2)}{x-2}=x+2$.

$\lim\limits_{x\to2}f(x)=\lim\limits_{x\to2}(x+2)=4$.

Hàm số liên tục tại $x_0=2$ khi và chỉ khi $\lim\limits_{x\to2}f(x)=f(2)$, tức là $m=4$.

Chọn A.

### Câu 18 | kho=dai | loai=dung_sai | dap_an=SDDD
**Đề:** Cho dãy số $u_n=\dfrac{2n^2-3}{n+1}$. Các mệnh đề sau đúng hay sai?
a) Dãy số trên có giới hạn hữu hạn khi $n$ tiến đến $+\infty$.
b) Dãy số trên có giới hạn là $+\infty$ khi $n$ tiến đến $+\infty$.
c) Giới hạn $\lim\limits_{n\to+\infty}u_n\cdot\dfrac{1}{n}=2$.
d) Giới hạn $\lim\limits_{n\to+\infty}u_n\cdot\dfrac{-3}{n^2}=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** so sánh bậc của tử và mẫu để biết $u_n$ có giới hạn hữu hạn hay tiến ra vô cực, rồi nhân với các thừa số đã cho để xét ý c và d.

**Bước 1.** Ý a và ý b: chia tử và mẫu của $u_n$ cho $n$ để xem tử số, mẫu số tiến về đâu.

**Bước 2.** Ý c: viết $u_n\cdot\dfrac{1}{n}$ thành một phân thức theo $n$ rồi chia cho lũy thừa cao nhất.

**Bước 3.** Ý d: viết $u_n\cdot\dfrac{-3}{n^2}$ thành một phân thức theo $n$ rồi so bậc tử với bậc mẫu.

**Phần 2. Trình bày**

$u_n=\dfrac{2n^2-3}{n+1}=\dfrac{2n-\dfrac{3}{n}}{1+\dfrac{1}{n}}$.

Khi $n\to+\infty$: tử số $2n-\dfrac{3}{n}\to+\infty$, mẫu số $1+\dfrac{1}{n}\to1>0$ nên $\lim u_n=+\infty$.

Ý a) Sai, vì $\lim u_n=+\infty$ không phải giới hạn hữu hạn.

Ý b) Đúng, vì $\lim u_n=+\infty$.

Ý c) $u_n\cdot\dfrac{1}{n}=\dfrac{2n^2-3}{n^2+n}=\dfrac{2-\dfrac{3}{n^2}}{1+\dfrac{1}{n}}\to2$. Mệnh đề Đúng.

Ý d) $u_n\cdot\dfrac{-3}{n^2}=\dfrac{-3\left(2n^2-3\right)}{n^2(n+1)}=\dfrac{-6n^2+9}{n^3+n^2}=\dfrac{-\dfrac{6}{n}+\dfrac{9}{n^3}}{1+\dfrac{1}{n}}\to0$. Mệnh đề Đúng.

Vậy a) Sai, b) Đúng, c) Đúng, d) Đúng.

### Câu 19 | kho=dai | loai=dung_sai | dap_an=DSDS
**Đề:** Cho hàm số $f(x)=\dfrac{2x+1}{-5x+7}$. Các mệnh đề sau đúng hay sai?
a) Hàm số trên có giới hạn hữu hạn tại $x=1$.
b) Hàm số trên có giới hạn vô cực tại $x=-10$.
c) Hàm số trên có giới hạn bằng $\dfrac{-2}{5}$ khi $x$ tiến đến $+\infty$.
d) Hàm số trên liên tục trên $\mathbb{R}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức liên tục tại mọi điểm thuộc tập xác định, nên giới hạn tại điểm thuộc tập xác định là giá trị hữu hạn của hàm tại điểm đó.

**Bước 1.** Tìm tập xác định của hàm số bằng cách loại giá trị làm mẫu số bằng $0$.

**Bước 2.** Ý a và ý b: kiểm tra hai điểm $x=1$, $x=-10$ có thuộc tập xác định hay không rồi suy ra dạng giới hạn.

**Bước 3.** Ý c: chia tử và mẫu cho $x$ rồi cho $x\to+\infty$.

**Bước 4.** Ý d: so sánh tập xác định với $\mathbb{R}$ để xét tính liên tục trên $\mathbb{R}$.

**Phần 2. Trình bày**

Hàm số xác định khi $-5x+7\neq0$, tức là $x\neq\dfrac{7}{5}$. Tập xác định là $\mathbb{R}\setminus\left\{\dfrac{7}{5}\right\}$.

Ý a) $x=1$ thuộc tập xác định nên $\lim\limits_{x\to1}f(x)=f(1)=\dfrac{3}{2}$ là số hữu hạn. Mệnh đề Đúng.

Ý b) $x=-10$ thuộc tập xác định nên $\lim\limits_{x\to-10}f(x)=f(-10)=\dfrac{-19}{57}=-\dfrac{1}{3}$ là số hữu hạn, không phải giới hạn vô cực. Mệnh đề Sai.

Ý c) $f(x)=\dfrac{2+\dfrac{1}{x}}{-5+\dfrac{7}{x}}$ nên $\lim\limits_{x\to+\infty}f(x)=\dfrac{2}{-5}=\dfrac{-2}{5}$. Mệnh đề Đúng.

Ý d) Hàm số không xác định tại $x=\dfrac{7}{5}$ nên không liên tục trên $\mathbb{R}$. Mệnh đề Sai.

Vậy a) Đúng, b) Sai, c) Đúng, d) Sai.

### Câu 20 | kho=dai | loai=dung_sai | dap_an=DDDS
**Đề:** Cho hàm số $f(x)=\begin{cases}\dfrac{x-1}{\sqrt{3x-2}-x} & \text{khi } x>1\\ m-x & \text{khi } x\le1\end{cases}$ với $m$ là tham số và hàm số $g(x)=x^3-1$. Các mệnh đề sau đúng hay sai?
a) Hàm số $f(x)$ liên tục tại $x=-2$.
b) Hàm số $f(x)$ gián đoạn tại $x=2$.
c) Hàm số $f(x)+g(x)$ liên tục tại $x=-3$.
d) Hàm số $f(x)$ liên tục tại $x=1$ khi $m=1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét từng điểm theo nhánh công thức chứa nó, riêng điểm nối $x=1$ phải so sánh giới hạn hai phía với giá trị hàm.

**Bước 1.** Ý a và ý c: xác định điểm $x=-2$, $x=-3$ thuộc nhánh nào và dùng tính liên tục của hàm đa thức.

**Bước 2.** Ý b: thay $x=2$ vào mẫu số của nhánh $x>1$ để xem hàm có xác định hay không.

**Bước 3.** Ý d: tính giới hạn trái bằng nhánh $m-x$ và giá trị $f(1)$ với $m=1$.

**Bước 4.** Ý d: tính giới hạn phải bằng cách nhân lượng liên hợp của mẫu rồi rút gọn nhân tử $x-1$, sau đó so sánh các giá trị.

**Phần 2. Trình bày**

Ý a) Với $x\le1$ thì $f(x)=m-x$ là hàm đa thức, $x=-2$ thuộc nhánh này nên $f$ liên tục tại $x=-2$. Mệnh đề Đúng.

Ý b) Với $x=2>1$, mẫu số $\sqrt{3\cdot2-2}-2=0$ nên $f$ không xác định tại $x=2$, do đó $f$ gián đoạn tại $x=2$. Mệnh đề Đúng.

Ý c) $f$ liên tục tại $x=-3$ (nhánh $m-x$) và $g(x)=x^3-1$ là hàm đa thức nên liên tục tại $x=-3$. Tổng $f+g$ liên tục tại $x=-3$. Mệnh đề Đúng.

Ý d) Với $m=1$: $f(1)=1-1=0$ và $\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^-}(1-x)=0$.

Với $x>1$: $\dfrac{x-1}{\sqrt{3x-2}-x}=\dfrac{(x-1)\left(\sqrt{3x-2}+x\right)}{(3x-2)-x^2}=\dfrac{(x-1)\left(\sqrt{3x-2}+x\right)}{-(x-1)(x-2)}=\dfrac{\sqrt{3x-2}+x}{2-x}$.

$\lim\limits_{x\to1^+}f(x)=\dfrac{1+1}{2-1}=2$.

Vì $\lim\limits_{x\to1^+}f(x)=2\neq0=\lim\limits_{x\to1^-}f(x)$ nên không tồn tại $\lim\limits_{x\to1}f(x)$, $f$ không liên tục tại $x=1$. Mệnh đề Sai.

Vậy a) Đúng, b) Đúng, c) Đúng, d) Sai.

### Câu 21 | kho=dai | loai=dung_sai | dap_an=DSSD
**Đề:** Cho hàm số $f(x)=\begin{cases}\dfrac{\sqrt{x+3}-x-1}{x^2-5x+4} & \text{khi } x>1\\ x+m & \text{khi } x\le1\end{cases}$ với $m$ là tham số và hàm số $g(x)=2x^2-5x-7$. Các mệnh đề sau đúng hay sai?
a) Hàm số $f(x)$ liên tục trên khoảng $(0;1)$.
b) Hàm số $f(x)$ liên tục trên khoảng $(1;+\infty)$.
c) Hàm số $\dfrac{f(x)}{g(x)}$ liên tục trên khoảng $(-\infty;1)$.
d) Với $m=-\dfrac{3}{4}$ thì hàm số $f(x)$ liên tục trên tập xác định.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục trên khoảng khi nó xác định và liên tục tại mọi điểm của khoảng, nên phải tìm điểm làm mẫu số bằng $0$ nằm trong khoảng đó.

**Bước 1.** Ý a: xác định khoảng $(0;1)$ thuộc nhánh nào và dùng tính liên tục của hàm đa thức.

**Bước 2.** Ý b: phân tích mẫu $x^2-5x+4$ thành nhân tử để tìm điểm trong $(1;+\infty)$ mà hàm không xác định.

**Bước 3.** Ý c: tìm nghiệm của $g(x)$ và xét nghiệm đó có nằm trong khoảng $(-\infty;1)$ hay không.

**Bước 4.** Ý d: tìm tập xác định của $f$, tính giới hạn phải tại $x=1$ bằng lượng liên hợp rồi so với $f(1)$ khi $m=-\dfrac{3}{4}$.

**Phần 2. Trình bày**

Ý a) Với $x\in(0;1)$ thì $f(x)=x+m$ là hàm đa thức nên liên tục trên $(0;1)$. Mệnh đề Đúng.

Ý b) $x^2-5x+4=(x-1)(x-4)$ bằng $0$ tại $x=4$ và $4\in(1;+\infty)$, nên $f$ không xác định tại $x=4$, do đó không liên tục trên $(1;+\infty)$. Mệnh đề Sai.

Ý c) $g(x)=2x^2-5x-7=(x+1)(2x-7)$ có nghiệm $x=-1\in(-\infty;1)$, nên $\dfrac{f(x)}{g(x)}$ không xác định tại $x=-1$, không liên tục trên $(-\infty;1)$. Mệnh đề Sai.

Ý d) Tập xác định của $f$ là $\mathbb{R}\setminus\{4\}$. Với $x<1$ và với $x>1,\ x\neq4$ hàm số liên tục. Ta xét tại $x=1$.

Với $m=-\dfrac{3}{4}$: $f(1)=1+m=\dfrac{1}{4}$ và $\lim\limits_{x\to1^-}f(x)=\dfrac{1}{4}$.

Với $x>1,\ x\neq4$: $\sqrt{x+3}-(x+1)=\dfrac{(x+3)-(x+1)^2}{\sqrt{x+3}+x+1}=\dfrac{-(x-1)(x+2)}{\sqrt{x+3}+x+1}$.

Suy ra $f(x)=\dfrac{-(x-1)(x+2)}{(x-1)(x-4)\left(\sqrt{x+3}+x+1\right)}=\dfrac{-(x+2)}{(x-4)\left(\sqrt{x+3}+x+1\right)}$.

$\lim\limits_{x\to1^+}f(x)=\dfrac{-3}{(-3)(2+2)}=\dfrac{1}{4}$.

Giới hạn hai phía cùng bằng $f(1)=\dfrac{1}{4}$ nên $f$ liên tục tại $x=1$, do đó liên tục trên tập xác định. Mệnh đề Đúng.

Vậy a) Đúng, b) Sai, c) Sai, d) Đúng.

## PHẦN 32 | Phần 2: Bài tập tự luận | tu_luan

### Câu 1a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giải phương trình lượng giác $\cos\left(x-15^\circ\right)=\dfrac{\sqrt2}{2}$.
**Ghi chú:** đề in $15^0$ là $15^\circ$; nghiệm viết bằng radian theo quy ước, đổi $15^\circ=\dfrac{\pi}{12}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa vế phải về giá trị lượng giác của một góc đặc biệt rồi dùng công thức nghiệm của $\cos u=\cos\alpha$.

**Bước 1.** Nhận ra $\dfrac{\sqrt2}{2}$ là $\cos$ của một góc đặc biệt và viết lại vế phải dưới dạng $\cos\alpha$.

**Bước 2.** Đổi góc $15^\circ$ sang radian để nghiệm cuối cùng cùng đơn vị.

**Bước 3.** Áp dụng công thức nghiệm $u=\pm\alpha+k2\pi$ cho hai họ nghiệm.

**Bước 4.** Giải ra $x$ ở từng họ và rút gọn các phân số.

**Phần 2. Trình bày**

Ta có $15^\circ=\dfrac{\pi}{12}$ và $\dfrac{\sqrt2}{2}=\cos\dfrac{\pi}{4}$.

Phương trình trở thành $\cos\left(x-\dfrac{\pi}{12}\right)=\cos\dfrac{\pi}{4}$.

$\Leftrightarrow x-\dfrac{\pi}{12}=\dfrac{\pi}{4}+k2\pi$ hoặc $x-\dfrac{\pi}{12}=-\dfrac{\pi}{4}+k2\pi$, $k\in\mathbb{Z}$.

$\Leftrightarrow x=\dfrac{\pi}{12}+\dfrac{\pi}{4}+k2\pi=\dfrac{\pi}{3}+k2\pi$ hoặc $x=\dfrac{\pi}{12}-\dfrac{\pi}{4}+k2\pi=-\dfrac{\pi}{6}+k2\pi$.

Vậy nghiệm của phương trình là $x=\dfrac{\pi}{3}+k2\pi$ và $x=-\dfrac{\pi}{6}+k2\pi$, $k\in\mathbb{Z}$ (tương ứng $x=60^\circ+k360^\circ$ và $x=-30^\circ+k360^\circ$).

### Câu 1b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giải phương trình lượng giác $\tan\left(3x+\dfrac{\pi}{6}\right)=-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết vế phải dưới dạng $\tan\alpha$ rồi áp dụng công thức nghiệm $\tan u=\tan\alpha$.

**Bước 1.** Tìm góc $\alpha$ đặc biệt có $\tan\alpha=-1$ và viết lại phương trình dưới dạng $\tan u=\tan\alpha$.

**Bước 2.** Xét điều kiện xác định của $\tan$ và nhận xét nó tự thỏa mãn khi $\tan u=-1$.

**Bước 3.** Áp dụng công thức nghiệm $u=\alpha+k\pi$ với $u=3x+\dfrac{\pi}{6}$.

**Bước 4.** Chuyển vế và chia cho $3$ để rút $x$.

**Phần 2. Trình bày**

Ta có $-1=\tan\left(-\dfrac{\pi}{4}\right)$. Điều kiện xác định $\cos\left(3x+\dfrac{\pi}{6}\right)\neq0$ luôn thỏa vì $\tan\left(3x+\dfrac{\pi}{6}\right)=-1$ có nghĩa.

$\tan\left(3x+\dfrac{\pi}{6}\right)=\tan\left(-\dfrac{\pi}{4}\right)$.

$\Leftrightarrow 3x+\dfrac{\pi}{6}=-\dfrac{\pi}{4}+k\pi$, $k\in\mathbb{Z}$.

$\Leftrightarrow 3x=-\dfrac{\pi}{4}-\dfrac{\pi}{6}+k\pi=-\dfrac{5\pi}{12}+k\pi$.

$\Leftrightarrow x=-\dfrac{5\pi}{36}+\dfrac{k\pi}{3}$.

Vậy nghiệm của phương trình là $x=-\dfrac{5\pi}{36}+\dfrac{k\pi}{3}$, $k\in\mathbb{Z}$.

### Câu 1c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giải phương trình lượng giác $\tan\left(3x-\dfrac{\pi}{4}\right)=\tan\left(x+\dfrac{\pi}{6}\right)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai vế cùng là $\tan$ nên áp dụng $\tan u=\tan v\Leftrightarrow u=v+k\pi$ và kiểm tra điều kiện xác định của cả hai vế.

**Bước 1.** Viết điều kiện xác định để cả hai vế đều có nghĩa.

**Bước 2.** Áp dụng công thức nghiệm cho $\tan u=\tan v$ và giải phương trình bậc nhất theo $x$.

**Bước 3.** Kiểm tra họ nghiệm có làm $\cos\left(x+\dfrac{\pi}{6}\right)=0$ hay không bằng cách giải phương trình theo $k$ nguyên.

**Bước 4.** Dùng quan hệ giữa hai góc để suy ra điều kiện còn lại tự thỏa rồi kết luận.

**Phần 2. Trình bày**

Điều kiện: $\cos\left(3x-\dfrac{\pi}{4}\right)\neq0$ và $\cos\left(x+\dfrac{\pi}{6}\right)\neq0$.

$\tan\left(3x-\dfrac{\pi}{4}\right)=\tan\left(x+\dfrac{\pi}{6}\right)$

$\Leftrightarrow 3x-\dfrac{\pi}{4}=x+\dfrac{\pi}{6}+k\pi$, $k\in\mathbb{Z}$.

$\Leftrightarrow 2x=\dfrac{5\pi}{12}+k\pi$.

$\Leftrightarrow x=\dfrac{5\pi}{24}+\dfrac{k\pi}{2}$.

Kiểm tra điều kiện: khi đó $x+\dfrac{\pi}{6}=\dfrac{3\pi}{8}+\dfrac{k\pi}{2}$.

$\cos\left(\dfrac{3\pi}{8}+\dfrac{k\pi}{2}\right)=0\Leftrightarrow\dfrac{3\pi}{8}+\dfrac{k\pi}{2}=\dfrac{\pi}{2}+l\pi\Leftrightarrow k=\dfrac{1}{4}+2l$, không có $k$ nguyên.

Vậy $\cos\left(x+\dfrac{\pi}{6}\right)\neq0$ với mọi $k$. Mặt khác $3x-\dfrac{\pi}{4}=x+\dfrac{\pi}{6}+k\pi$ nên $\cos\left(3x-\dfrac{\pi}{4}\right)=\pm\cos\left(x+\dfrac{\pi}{6}\right)\neq0$.

Vậy nghiệm của phương trình là $x=\dfrac{5\pi}{24}+\dfrac{k\pi}{2}$, $k\in\mathbb{Z}$.

### Câu 1d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giải phương trình lượng giác $\sin3x+\sin\left(\dfrac{\pi}{4}-\dfrac{x}{2}\right)=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chuyển một hạng tử sang vế phải và dùng $-\sin u=\sin(-u)$ để đưa về dạng $\sin u=\sin v$.

**Bước 1.** Chuyển hạng tử thứ hai sang vế phải và đổi dấu bằng cách đưa dấu trừ vào trong góc.

**Bước 2.** Áp dụng công thức nghiệm của $\sin u=\sin v$ thành hai họ nghiệm.

**Bước 3.** Với từng họ, gom các hạng tử chứa $x$ về một vế và giải phương trình bậc nhất.

**Bước 4.** Rút gọn các phân số và viết đủ điều kiện $k\in\mathbb{Z}$ cho mỗi họ nghiệm.

**Phần 2. Trình bày**

$\sin3x+\sin\left(\dfrac{\pi}{4}-\dfrac{x}{2}\right)=0$

$\Leftrightarrow\sin3x=-\sin\left(\dfrac{\pi}{4}-\dfrac{x}{2}\right)=\sin\left(\dfrac{x}{2}-\dfrac{\pi}{4}\right)$.

$\Leftrightarrow 3x=\dfrac{x}{2}-\dfrac{\pi}{4}+k2\pi$ hoặc $3x=\pi-\left(\dfrac{x}{2}-\dfrac{\pi}{4}\right)+k2\pi$, $k\in\mathbb{Z}$.

Họ thứ nhất: $\dfrac{5x}{2}=-\dfrac{\pi}{4}+k2\pi\Leftrightarrow x=-\dfrac{\pi}{10}+\dfrac{k4\pi}{5}$.

Họ thứ hai: $3x=\dfrac{5\pi}{4}-\dfrac{x}{2}+k2\pi\Leftrightarrow\dfrac{7x}{2}=\dfrac{5\pi}{4}+k2\pi\Leftrightarrow x=\dfrac{5\pi}{14}+\dfrac{k4\pi}{7}$.

Vậy nghiệm của phương trình là $x=-\dfrac{\pi}{10}+\dfrac{k4\pi}{5}$ và $x=\dfrac{5\pi}{14}+\dfrac{k4\pi}{7}$, $k\in\mathbb{Z}$.

### Câu 2a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số hạng đầu và công sai của cấp số cộng biết $\begin{cases}u_1+u_5-u_3=10\\ u_1+u_6=17\end{cases}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn mọi số hạng qua $u_1$ và $d$ để đưa hệ về hai phương trình bậc nhất hai ẩn.

**Bước 1.** Viết $u_3$, $u_5$, $u_6$ theo $u_1$ và $d$ bằng công thức số hạng tổng quát của cấp số cộng.

**Bước 2.** Thu gọn từng phương trình của hệ bằng cách rút gọn các hạng tử chứa $u_1$.

**Bước 3.** Giải hệ hai phương trình bậc nhất hai ẩn $u_1$, $d$ bằng phép thế.

**Bước 4.** Thử lại nghiệm vào hai phương trình ban đầu của hệ.

**Phần 2. Trình bày**

Ta có $u_3=u_1+2d$, $u_5=u_1+4d$, $u_6=u_1+5d$.

Phương trình thứ nhất: $u_1+(u_1+4d)-(u_1+2d)=10$ hay $u_1+2d=10$.

Phương trình thứ hai: $u_1+(u_1+5d)=17$ hay $2u_1+5d=17$.

Từ $u_1=10-2d$, thay vào: $2(10-2d)+5d=17$ nên $20+d=17$, suy ra $d=-3$.

Khi đó $u_1=10-2\cdot(-3)=16$.

Thử lại: $u_3=10$, $u_5=4$, $u_6=1$; $16+4-10=10$ và $16+1=17$ đúng.

Vậy $u_1=16$, $d=-3$.

### Câu 2b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số hạng đầu và công sai của cấp số cộng biết $\begin{cases}u_2+u_5-u_3=10\\ u_4+u_6=26\end{cases}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa mọi số hạng về $u_1$ và $d$ rồi thu gọn thành hệ hai phương trình bậc nhất.

**Bước 1.** Viết các số hạng $u_2$, $u_3$, $u_4$, $u_5$, $u_6$ theo $u_1$ và $d$.

**Bước 2.** Thu gọn phương trình thứ nhất, chú ý các hạng tử $u_1$ cộng trừ nhau.

**Bước 3.** Thu gọn phương trình thứ hai rồi chia hai vế cho $2$ để hệ gọn hơn.

**Bước 4.** Trừ hai phương trình để tìm $d$, sau đó suy ra $u_1$.

**Phần 2. Trình bày**

Ta có $u_2=u_1+d$, $u_3=u_1+2d$, $u_4=u_1+3d$, $u_5=u_1+4d$, $u_6=u_1+5d$.

Phương trình thứ nhất: $(u_1+d)+(u_1+4d)-(u_1+2d)=10$ hay $u_1+3d=10$.

Phương trình thứ hai: $(u_1+3d)+(u_1+5d)=26$ hay $2u_1+8d=26$, tức là $u_1+4d=13$.

Trừ hai phương trình: $(u_1+4d)-(u_1+3d)=13-10$ nên $d=3$.

Khi đó $u_1=10-3\cdot3=1$.

Thử lại: $u_2=4$, $u_3=7$, $u_4=10$, $u_5=13$, $u_6=16$; $4+13-7=10$ và $10+16=26$ đúng.

Vậy $u_1=1$, $d=3$.

### Câu 3a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số hạng đầu và công bội của cấp số nhân biết $\begin{cases}u_3+u_5=90\\ u_2-u_6=240\end{cases}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết các số hạng qua $u_1$ và $q$, rồi chia hai phương trình cho nhau để khử $u_1$ và chỉ còn ẩn $q$.

**Bước 1.** Viết $u_2$, $u_3$, $u_5$, $u_6$ theo $u_1$ và $q$ rồi đặt nhân tử chung ở mỗi vế trái.

**Bước 2.** Nhận xét $u_1$, $q$ khác $0$ rồi chia phương trình thứ hai cho phương trình thứ nhất.

**Bước 3.** Rút gọn nhân tử $1+q^2$ để nhận một phương trình bậc hai theo $q$ rồi giải.

**Bước 4.** Với mỗi giá trị $q$, thay lại vào phương trình thứ nhất để tìm $u_1$.

**Phần 2. Trình bày**

Ta có $u_3+u_5=u_1q^2\left(1+q^2\right)=90$ (1) và $u_2-u_6=u_1q\left(1-q^4\right)=240$ (2).

Từ (1) suy ra $u_1\neq0$, $q\neq0$. Chia (2) cho (1):

$\dfrac{q\left(1-q^2\right)\left(1+q^2\right)}{q^2\left(1+q^2\right)}=\dfrac{240}{90}$ hay $\dfrac{1-q^2}{q}=\dfrac{8}{3}$.

$\Leftrightarrow 3q^2+8q-3=0\Leftrightarrow q=\dfrac{1}{3}$ hoặc $q=-3$.

Với $q=\dfrac{1}{3}$: (1) cho $u_1\cdot\dfrac{1}{9}\cdot\dfrac{10}{9}=90$ nên $u_1=729$.

Với $q=-3$: (1) cho $u_1\cdot9\cdot10=90$ nên $u_1=1$.

Thử lại với (2): $729\cdot\dfrac{1}{3}\cdot\left(1-\dfrac{1}{81}\right)=240$ và $1\cdot(-3)\cdot(1-81)=240$ đúng.

Vậy $u_1=729$, $q=\dfrac{1}{3}$ hoặc $u_1=1$, $q=-3$.

### Câu 3b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số hạng đầu và công bội của cấp số nhân biết $\begin{cases}u_1+u_2+u_3=14\\ u_1\cdot u_2\cdot u_3=64\end{cases}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** trong cấp số nhân, tích ba số hạng liên tiếp bằng lập phương của số hạng giữa nên ta tìm được $u_2$ trước.

**Bước 1.** Dùng tính chất $u_1\cdot u_3=u_2^2$ để rút ra giá trị của $u_2$ từ phương trình tích.

**Bước 2.** Biểu diễn $u_1$ và $u_3$ qua $u_2$ và công bội $q$.

**Bước 3.** Thay vào phương trình tổng để được phương trình bậc hai theo $q$ rồi giải.

**Bước 4.** Với mỗi $q$, tính $u_1$ và kiểm tra lại cả hai phương trình của hệ.

**Phần 2. Trình bày**

Vì $u_1u_3=u_2^2$ nên $u_1u_2u_3=u_2^3=64$, suy ra $u_2=4$.

Khi đó $u_1=\dfrac{4}{q}$ và $u_3=4q$ (với $q\neq0$).

Phương trình tổng: $\dfrac{4}{q}+4+4q=14$ hay $\dfrac{4}{q}+4q=10$.

$\Leftrightarrow 4q^2-10q+4=0\Leftrightarrow 2q^2-5q+2=0\Leftrightarrow q=2$ hoặc $q=\dfrac{1}{2}$.

Với $q=2$: $u_1=2$. Các số hạng $2;4;8$ có tổng $14$ và tích $64$.

Với $q=\dfrac{1}{2}$: $u_1=8$. Các số hạng $8;4;2$ có tổng $14$ và tích $64$.

Vậy $u_1=2$, $q=2$ hoặc $u_1=8$, $q=\dfrac{1}{2}$.

### Câu 4 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một câu lạc bộ thể dục thể thao đã ghi lại số giờ các thành viên của mình sử dụng cơ sở vật chất của câu lạc bộ để tập luyện trong một tháng. Họ tổ chức dữ liệu thu được vào bảng sau (thời gian theo giờ, tần số là số người): nhóm $[1;5)$ có $10$ người; nhóm $[5;9)$ có $14$ người; nhóm $[9;13)$ có $31$ người; nhóm $[13;17)$ có $2$ người; nhóm $[17;21)$ có $5$ người; nhóm $[21;25)$ có $23$ người. Hãy tính (làm tròn kết quả đến hàng phần mười):
a) Tìm giá trị đại diện của các nhóm, tìm cỡ mẫu.
b) Tìm giá trị trung bình, trung vị của mẫu số liệu.
**Hình:** de_P32C4.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** với mẫu số liệu ghép nhóm, mỗi nhóm được thay bằng giá trị đại diện là trung điểm của nhóm rồi áp dụng công thức trung bình và trung vị của SGK.

**Bước 1.** Ý a: lấy trung điểm của từng nhóm làm giá trị đại diện và cộng các tần số để có cỡ mẫu.

**Bước 2.** Ý b: tính trung bình bằng tổng các tích giá trị đại diện với tần số, chia cho cỡ mẫu.

**Bước 3.** Ý b: lập tần số tích lũy rồi tìm nhóm đầu tiên có tần số tích lũy vượt quá một nửa cỡ mẫu.

**Bước 4.** Ý b: thay các đại lượng $u_m$, $n_m$, $C$, $h$ vào công thức trung vị rồi làm tròn đến hàng phần mười.

**Phần 2. Trình bày**

Ý a) Giá trị đại diện của các nhóm lần lượt là $3;\ 7;\ 11;\ 15;\ 19;\ 23$.

Cỡ mẫu $n=10+14+31+2+5+23=85$.

Ý b) Giá trị trung bình: $\bar x=\dfrac{3\cdot10+7\cdot14+11\cdot31+15\cdot2+19\cdot5+23\cdot23}{85}=\dfrac{1123}{85}\approx13{,}2$ (giờ).

Trung vị: $\dfrac{n}{2}=42{,}5$. Các tần số tích lũy lần lượt là $10;\ 24;\ 55;\ 57;\ 62;\ 85$.

Nhóm $[9;13)$ là nhóm đầu tiên có tần số tích lũy lớn hơn $42{,}5$ nên chứa trung vị: $u_m=9$, $n_m=31$, $C=10+14=24$, $h=4$.

$M_e=9+\dfrac{42{,}5-24}{31}\cdot4=9+\dfrac{74}{31}\approx11{,}4$ (giờ).

Vậy giá trị đại diện là $3;7;11;15;19;23$, cỡ mẫu là $85$, giá trị trung bình khoảng $13{,}2$ giờ và trung vị khoảng $11{,}4$ giờ.

### Câu 5 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$. Gọi $M,N$ lần lượt là trung điểm của $AB$ và $BC$; $G_1,G_2$ tương ứng là trọng tâm các tam giác $SAB,SBC$.
a) Chứng minh $AC\parallel(SMN)$.
b) Chứng minh $G_1G_2\parallel(SAC)$.
c) Tìm giao tuyến của hai mặt phẳng $(ABC)$ và $(BG_1G_2)$.
**Hình giải:** giai_P32C5.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đường trung bình và tỉ lệ $\dfrac23$ của trọng tâm cho các đường song song, từ đó dùng điều kiện đường thẳng song song mặt phẳng và định lí giao tuyến của hai mặt phẳng chứa hai đường song song.

**Bước 1.** Ý a: tìm trong tam giác $ABC$ một đường song song với $AC$, sau đó nêu đường đó nằm trong $(SMN)$.

**Bước 2.** Ý a: giải thích vì sao $AC$ không nằm trong $(SMN)$ để đủ điều kiện đường thẳng song song mặt phẳng.

**Bước 3.** Ý b: dùng tính chất trọng tâm trên hai trung tuyến $SM$, $SN$ để suy ra $G_1G_2$ song song với $MN$ rồi với $AC$.

**Bước 4.** Ý b: chứng minh $G_1G_2$ không nằm trong $(SAC)$ rồi kết luận song song với mặt phẳng.

**Bước 5.** Ý c: chỉ ra một điểm chung của hai mặt phẳng, rồi dùng hai đường song song nằm trong hai mặt phẳng để xác định phương của giao tuyến.

**Phần 2. Trình bày**

Ý a) Vì $M,N$ là trung điểm của $AB,BC$ nên $MN$ là đường trung bình của tam giác $ABC$, suy ra $MN\parallel AC$.

Có $MN\subset(SMN)$.

Mặt khác $(SMN)\cap(ABC)=MN$ và $AC\neq MN$ nên $AC\not\subset(SMN)$.

Vậy $AC\parallel(SMN)$.

Ý b) $G_1$ là trọng tâm tam giác $SAB$ và $M$ là trung điểm $AB$ nên $G_1\in SM$ và $\dfrac{SG_1}{SM}=\dfrac{2}{3}$.

Tương tự $G_2\in SN$ và $\dfrac{SG_2}{SN}=\dfrac{2}{3}$.

Trong tam giác $SMN$ có $\dfrac{SG_1}{SM}=\dfrac{SG_2}{SN}$ nên $G_1G_2\parallel MN$.

Mà $MN\parallel AC$ nên $G_1G_2\parallel AC$, trong đó $AC\subset(SAC)$.

$M\notin(SAC)$ (vì $(SAC)\cap(ABC)=AC$ và $M\notin AC$) nên đường thẳng $SM$ chỉ cắt $(SAC)$ tại $S$. Do $G_1\in SM$ và $G_1\neq S$ nên $G_1\notin(SAC)$, suy ra $G_1G_2\not\subset(SAC)$.

Vậy $G_1G_2\parallel(SAC)$.

Ý c) $B$ là điểm chung của $(ABC)$ và $(BG_1G_2)$.

Có $AC\subset(ABC)$, $G_1G_2\subset(BG_1G_2)$ và $AC\parallel G_1G_2$. Hai mặt phẳng phân biệt vì $G_1\notin(ABC)$.

Theo định lí về giao tuyến của hai mặt phẳng chứa hai đường thẳng song song, giao tuyến là đường thẳng $d$ đi qua $B$ và song song với $AC$.

Vậy giao tuyến của $(ABC)$ và $(BG_1G_2)$ là đường thẳng $d$ qua $B$, $d\parallel AC$.

### Câu 6 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình thang với đáy lớn $AB$. Gọi $M,N$ theo thứ tự là trọng tâm của các tam giác $SCD$ và $SAB$.
a) Tìm giao tuyến của các cặp mặt phẳng: $(ABM)$ và $(SCD)$; $(SMN)$ và $(ABC)$.
b) Chứng minh $MN\parallel(ABC)$.
c) Gọi $d$ là giao tuyến của $(SCD)$ và $(ABM)$ còn $I,J$ lần lượt là các giao điểm của $d$ với $SD,SC$. Chứng minh $IN\parallel(ABC)$.
d) Tìm các giao điểm $P,Q$ của $MC$ với $(SAB)$, $AN$ với $(SCD)$. Chứng minh $S,P,Q$ thẳng hàng.
**Hình giải:** giai_P32C6.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đáy hình thang có $AB\parallel CD$ cho giao tuyến song song, trọng tâm cho tỉ lệ $\dfrac23$ trên trung tuyến, còn ý cuối dùng ba điểm cùng thuộc giao tuyến của hai mặt phẳng.

**Bước 1.** Ý a: nêu điểm chung $M$ và hai đường song song $AB$, $CD$ nằm trong hai mặt phẳng để suy ra giao tuyến thứ nhất.

**Bước 2.** Ý a: gọi $E,F$ là trung điểm $CD$, $AB$, chứng minh $(SMN)$ trùng $(SEF)$ rồi tìm giao tuyến với $(ABC)$.

**Bước 3.** Ý b: dùng tỉ lệ trọng tâm trên $SE$, $SF$ để chứng minh $MN\parallel EF$, rồi suy ra song song với mặt phẳng đáy.

**Bước 4.** Ý c: từ $d\parallel CD$ tính tỉ số $\dfrac{SI}{SD}$, so với tỉ số $\dfrac{SN}{SF}$ trong mặt phẳng $(SDF)$ để được $IN\parallel DF$.

**Bước 5.** Ý d: chỉ ra $P$, $Q$ cùng thuộc $(SAB)$ và $(SCD)$, rồi dùng giao tuyến của hai mặt phẳng là một đường thẳng chứa cả $S$.

**Phần 2. Trình bày**

Gọi $E,F$ lần lượt là trung điểm của $CD,AB$. Vì $M,N$ là trọng tâm các tam giác $SCD,SAB$ nên $M\in SE$, $N\in SF$ và $\dfrac{SM}{SE}=\dfrac{SN}{SF}=\dfrac{2}{3}$.

Ý a) Giao tuyến của $(ABM)$ và $(SCD)$: hai mặt phẳng có điểm chung $M$, lại có $AB\subset(ABM)$, $CD\subset(SCD)$ và $AB\parallel CD$ (đáy hình thang). Do đó giao tuyến là đường thẳng $d$ đi qua $M$ và song song với $AB$, $CD$.

Giao tuyến của $(SMN)$ và $(ABC)$: $S,M,N$ cùng thuộc $(SEF)$ và không thẳng hàng nên $(SMN)=(SEF)$. Hai mặt phẳng $(SEF)$ và $(ABC)$ có hai điểm chung $E,F$ nên giao tuyến là đường thẳng $EF$.

Ý b) Trong tam giác $SEF$ có $\dfrac{SM}{SE}=\dfrac{SN}{SF}$ nên $MN\parallel EF$. Mà $EF\subset(ABC)$.

Có $M\notin(ABC)$ (vì $SE\cap(ABC)=E$ và $M\neq E$) nên $MN\not\subset(ABC)$.

Vậy $MN\parallel(ABC)$.

Ý c) Trong mặt phẳng $(SCD)$: $d$ đi qua $M$, $d\parallel CD$ và $I=d\cap SD$. Áp dụng định lí Thalès trong tam giác $SED$ (đường $IM$ song song $DE$): $\dfrac{SI}{SD}=\dfrac{SM}{SE}=\dfrac{2}{3}$.

Trong mặt phẳng $(SDF)$ có $\dfrac{SI}{SD}=\dfrac{2}{3}=\dfrac{SN}{SF}$ nên $IN\parallel DF$. Mà $DF\subset(ABC)$.

Có $I\notin(ABC)$ (vì $SD\cap(ABC)=D$ và $I\neq D$) nên $IN\not\subset(ABC)$.

Vậy $IN\parallel(ABC)$.

Ý d) $P=MC\cap(SAB)$ nên $P\in(SAB)$. Vì $M,C\in(SCD)$ nên $MC\subset(SCD)$, suy ra $P\in(SCD)$.

$Q=AN\cap(SCD)$ nên $Q\in(SCD)$. Vì $A,N\in(SAB)$ nên $AN\subset(SAB)$, suy ra $Q\in(SAB)$.

Vậy $P,Q$ và $S$ đều là điểm chung của hai mặt phẳng phân biệt $(SAB)$ và $(SCD)$, nên chúng cùng nằm trên giao tuyến của hai mặt phẳng này. Do đó $S,P,Q$ thẳng hàng.

### Câu 7 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hai hình vuông $ABCD$ và $ABEF$ ở trong hai mặt phẳng phân biệt. Trên các đường chéo $AC$ và $BF$ lần lượt lấy các điểm $M,N$ sao cho $AM=BN$. Các đường thẳng song song với $AB$ vẽ từ $M,N$ lần lượt cắt $AD$ và $AF$ tại $M'$ và $N'$. Chứng minh:
a) $(ADF)\parallel(BCE)$.
b) $(DEF)\parallel(MM'N'N)$.
**Hình giải:** giai_P32C7.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng song song khi mặt phẳng này chứa hai đường thẳng cắt nhau, lần lượt song song với hai đường thẳng của mặt phẳng kia.

**Bước 1.** Ý a: chỉ ra từng cặp cạnh song song của hai hình vuông để có $AD\parallel BC$ và $AF\parallel BE$.

**Bước 2.** Ý a: chứng minh $AD$, $AF$ đều song song với $(BCE)$ rồi kết luận hai mặt phẳng song song.

**Bước 3.** Ý b: dùng $AM=BN$ và độ dài hai đường chéo bằng nhau để lập các tỉ số bằng nhau, từ đó thu được $M'N'\parallel DF$.

**Bước 4.** Ý b: chỉ ra $MM'\parallel EF$ nhờ cùng song song với $AB$, rồi tìm hai đường cắt nhau trong $(MM'N'N)$ song song với hai đường của $(DEF)$.

**Phần 2. Trình bày**

Ý a) Vì $ABCD$ là hình vuông nên $AD\parallel BC$. Vì $ABEF$ là hình vuông nên $AF\parallel BE$.

Có $BC\subset(BCE)$ và $AD\not\subset(BCE)$ (nếu $A\in(BCE)$ thì $(BCE)=(ABC)$ chứa $E$, hai hình vuông cùng nằm trong một mặt phẳng, trái giả thiết). Do đó $AD\parallel(BCE)$.

Tương tự $AF\parallel(BCE)$.

Hai đường thẳng $AD$ và $AF$ cắt nhau tại $A$ và cùng nằm trong $(ADF)$ nên $(ADF)\parallel(BCE)$.

Ý b) Hai hình vuông cùng cạnh $AB$ nên đường chéo $AC=BF$. Từ $AM=BN$ suy ra $\dfrac{AM}{AC}=\dfrac{BN}{BF}$.

Trong hình vuông $ABCD$ có $MM'\parallel AB\parallel CD$ nên $\dfrac{AM'}{AD}=\dfrac{AM}{AC}$.

Trong hình vuông $ABEF$ có $NN'\parallel AB\parallel EF$ nên $\dfrac{AN'}{AF}=\dfrac{BN}{BF}$.

Do đó $\dfrac{AM'}{AD}=\dfrac{AN'}{AF}$, suy ra $M'N'\parallel DF$ (đảo định lí Thalès trong tam giác $ADF$).

Lại có $MM'\parallel AB$ và $AB\parallel EF$ nên $MM'\parallel EF$.

Hai đường thẳng $MM'$ và $M'N'$ cắt nhau tại $M'$ và cùng nằm trong $(MM'N'N)$, tương ứng song song với hai đường thẳng cắt nhau $EF$ và $DF$ của $(DEF)$. Vậy $(DEF)\parallel(MM'N'N)$.

### Câu 8 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình hộp $ABCD{.}A'B'C'D'$.
a) Chứng minh $(BDA')\parallel(B'D'C)$.
b) Chứng minh đường chéo $AC'$ đi qua trọng tâm $G_1,G_2$ của các tam giác $BDA',B'D'C$ đồng thời chia đường chéo $AC'$ thành ba phần bằng nhau.
**Hình giải:** giai_P32C8.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** các mặt bên của hình hộp là hình bình hành nên cho từng cặp cạnh song song, còn ý b dùng đường chéo $AC'$ của hình bình hành $AA'C'C$ cắt các trung tuyến tại trọng tâm.

**Bước 1.** Ý a: tìm hai cặp cạnh song song trong các hình bình hành $BB'D'D$ và $A'B'CD$.

**Bước 2.** Ý a: dùng hai đường cắt nhau của $(BDA')$ song song với hai đường cắt nhau của $(B'D'C)$ để kết luận.

**Bước 3.** Ý b: lập hình bình hành $AA'C'C$, gọi $O$ là trung điểm $AC$ và tìm giao điểm của $A'O$ với $AC'$.

**Bước 4.** Ý b: so sánh hai tam giác đồng dạng trong hình bình hành để thu được tỉ số trên $A'O$, từ đó nhận ra giao điểm là trọng tâm $G_1$ và tính $AG_1$ theo $AC'$.

**Bước 5.** Ý b: làm tương tự với trung tuyến $CO'$ của tam giác $B'D'C$ để có $G_2$ và $C'G_2$, rồi suy ra ba đoạn bằng nhau.

**Phần 2. Trình bày**

Ý a) $BB'D'D$ là hình bình hành nên $BD\parallel B'D'$. $A'B'CD$ là hình bình hành (vì $A'B'\parallel CD$ và $A'B'=CD$) nên $A'D\parallel B'C$.

Có $B'D'\subset(B'D'C)$ và $BD\not\subset(B'D'C)$ nên $BD\parallel(B'D'C)$. Tương tự $A'D\parallel(B'D'C)$.

Hai đường thẳng $BD$ và $A'D$ cắt nhau tại $D$ và cùng nằm trong $(BDA')$.

Vậy $(BDA')\parallel(B'D'C)$.

Ý b) $AA'C'C$ là hình bình hành (vì $AA'\parallel CC'$ và $AA'=CC'$) nên $AC\parallel A'C'$ và $AC=A'C'$.

Gọi $O=AC\cap BD$ thì $O$ là trung điểm của $BD$, nên $A'O$ là trung tuyến của tam giác $BDA'$. Trong mặt phẳng $(AA'C'C)$ gọi $G_1=A'O\cap AC'$.

Vì $AO\parallel A'C'$ nên hai tam giác $G_1AO$ và $G_1C'A'$ đồng dạng với tỉ số $\dfrac{AO}{C'A'}=\dfrac{1}{2}$. Suy ra $\dfrac{G_1O}{G_1A'}=\dfrac{G_1A}{G_1C'}=\dfrac{1}{2}$.

Do đó $A'G_1=\dfrac{2}{3}A'O$ nên $G_1$ là trọng tâm tam giác $BDA'$, và $AG_1=\dfrac{1}{3}AC'$.

Gọi $O'$ là trung điểm của $A'C'$ thì $O'$ cũng là trung điểm của $B'D'$, nên $CO'$ là trung tuyến của tam giác $B'D'C$. Trong $(AA'C'C)$ gọi $G_2=CO'\cap AC'$.

Vì $C'O'\parallel AC$ nên hai tam giác $G_2C'O'$ và $G_2AC$ đồng dạng với tỉ số $\dfrac{C'O'}{AC}=\dfrac{1}{2}$. Suy ra $\dfrac{G_2O'}{G_2C}=\dfrac{G_2C'}{G_2A}=\dfrac{1}{2}$.

Do đó $CG_2=\dfrac{2}{3}CO'$ nên $G_2$ là trọng tâm tam giác $B'D'C$, và $C'G_2=\dfrac{1}{3}AC'$.

Như vậy $G_1,G_2$ đều thuộc $AC'$ với $AG_1=\dfrac{1}{3}AC'$ và $C'G_2=\dfrac{1}{3}AC'$, suy ra $G_1G_2=AC'-AG_1-C'G_2=\dfrac{1}{3}AC'$.

Vậy $AC'$ đi qua $G_1,G_2$ và $AG_1=G_1G_2=G_2C'$.

### Câu 9 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho hình bình hành $ABCD$. Qua $A$, $B$, $C$, $D$ lần lượt vẽ các nửa đường thẳng $Ax$, $By$, $Cz$, $Dt$ ở cùng phía so với mặt phẳng $(ABCD)$, song song với nhau và không nằm trong $(ABCD)$. Một mặt phẳng $(P)$ cắt $Ax$, $By$, $Cz$, $Dt$ tương ứng tại $A'$, $B'$, $C'$, $D'$ sao cho $AA'=3$, $BB'=5$, $CC'=4$. Tính $DD'$.
**Ghi chú:** tính $DD'$ theo cùng đơn vị độ dài với các số liệu đề cho.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tâm $O$ của hình bình hành là trung điểm của cả hai đường chéo nên đường nối trung điểm hai đáy của mỗi hình thang cho cùng một đoạn thẳng, từ đó có một hệ thức giữa bốn đoạn thẳng.

**Bước 1.** Gọi $O$ là tâm hình bình hành và xét hai hình thang $AA'C'C$, $BB'D'D$ có các cạnh bên song song.

**Bước 2.** Kẻ qua $O$ đường thẳng song song với $Ax$ rồi tính đoạn $OO_1$ bằng đường trung bình của hình thang thứ nhất.

**Bước 3.** Làm tương tự với hình thang thứ hai để có đoạn $OO_2$ theo $BB'$ và $DD'$.

**Bước 4.** Chứng minh $O_1$ trùng $O_2$ nhờ đường thẳng qua $O$ chỉ cắt $(P)$ tại một điểm, rồi suy ra $DD'$.

**Phần 2. Trình bày**

Gọi $O=AC\cap BD$, $O$ là trung điểm của $AC$ và $BD$.

Vì $AA'\parallel CC'$ nên $AA'C'C$ là hình thang có hai cạnh bên $AA'$, $CC'$ song song. Đường thẳng $\Delta$ qua $O$ song song với $Ax$ nằm trong mặt phẳng $(AA'C'C)$ và cắt $A'C'$ tại $O_1$.

$\Delta$ đi qua trung điểm $O$ của $AC$ và song song hai đáy $AA'$, $CC'$ nên $O_1$ là trung điểm $A'C'$ và $OO_1$ là đường trung bình: $OO_1=\dfrac{AA'+CC'}{2}$.

Tương tự, vì $Ax\parallel By$ nên $\Delta$ cũng song song với $By$ và nằm trong $(BB'D'D)$. Đường $\Delta$ cắt $B'D'$ tại $O_2$ là trung điểm $B'D'$ và $OO_2=\dfrac{BB'+DD'}{2}$.

$O_1\in A'C'\subset(P)$ và $O_2\in B'D'\subset(P)$ đều thuộc $\Delta$. Đường thẳng $\Delta$ không nằm trong $(P)$ (vì $\Delta\parallel Ax$ và $Ax$ cắt $(P)$ tại $A'$) nên chỉ có một giao điểm với $(P)$, suy ra $O_1=O_2$.

Do đó $\dfrac{AA'+CC'}{2}=\dfrac{BB'+DD'}{2}$ hay $AA'+CC'=BB'+DD'$.

$DD'=AA'+CC'-BB'=3+4-5=2$.

Vậy $DD'=2$.

### Câu 10 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Cho tứ giác $ABCD$ có $AC$ và $BD$ giao nhau tại $O$ và một điểm $S$ không thuộc mặt phẳng $(ABCD)$. Trên đoạn $SC$ lấy một điểm $M$ không trùng với $S$ và $C$. Xác định giao điểm của đường thẳng $SD$ với mặt phẳng $(ABM)$.
**Hình giải:** giai_P32C10.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn tìm giao điểm của $SD$ với $(ABM)$ ta tìm một đường thẳng nằm trong $(ABM)$ và cùng mặt phẳng với $SD$, rồi lấy giao điểm của hai đường đó.

**Bước 1.** Chọn mặt phẳng phụ chứa $SD$ và xác định giao tuyến của nó với $(ABM)$, bắt đầu từ điểm chung $B$.

**Bước 2.** Tìm điểm chung thứ hai bằng cách lấy giao của $AM$ với $SO$ trong mặt phẳng chứa cả hai đường này.

**Bước 3.** Nối điểm chung thứ hai với $B$ để có giao tuyến trong mặt phẳng phụ, rồi lấy giao với $SD$.

**Bước 4.** Chứng minh điểm đó thuộc cả $SD$ lẫn $(ABM)$ để kết luận.

**Phần 2. Trình bày**

Chọn mặt phẳng phụ $(SBD)$ chứa $SD$. Vì $O\in BD$ nên $O\in(SBD)$, do đó $SO\subset(SBD)$.

Trong mặt phẳng $(SAC)$ (chứa $SO$ và $AM$ vì $O\in AC$, $M\in SC$), gọi $I=AM\cap SO$.

Có $I\in AM\subset(ABM)$ và $I\in SO\subset(SBD)$. Lại có $B\in(ABM)$ và $B\in(SBD)$.

Do đó $(ABM)\cap(SBD)=BI$.

Trong mặt phẳng $(SBD)$, gọi $K=BI\cap SD$.

$K\in SD$ và $K\in BI\subset(ABM)$ nên $K\in(ABM)$.

Vậy giao điểm của $SD$ với $(ABM)$ là điểm $K=BI\cap SD$, với $I=AM\cap SO$.

### Câu 11 | kho=hinh_hoc | loai=tu_luan | dap_an=—
**Đề:** Một kệ để đồ (như hình vẽ) có hai mặt chứa đồ $(ABCD)$ và $(EFGH)$ song song nhau. Người thợ muốn lắp thêm tầng giữa $(IJKL)$ song song với hai mặt $(ABCD)$ và $(EFGH)$. Người thợ đo chiều dài đoạn $AE=10\,dm$, $CG=12\,dm$ và xác định vị trí điểm $I$ trên đoạn $AE$ sao cho $EI=4{,}2\,dm$. Tính độ dài đoạn $KC$ (đơn vị tính $dm$ và làm tròn kết quả đến hàng phần trăm).
**Hình:** de_P32C11.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba mặt phẳng song song chắn trên hai cát tuyến những đoạn thẳng tương ứng tỉ lệ nên ta lập tỉ số theo định lí Thalès trong không gian.

**Bước 1.** Xác định hai cát tuyến $AE$ và $CG$ cùng bị ba mặt phẳng song song cắt, ghi rõ các giao điểm.

**Bước 2.** Lập tỉ số các đoạn tương ứng theo định lí Thalès cho ba mặt phẳng song song.

**Bước 3.** Tính đoạn $GK$ từ tỉ số đã lập rồi suy ra $KC$ bằng hiệu của $CG$ và $GK$.

**Bước 4.** Làm tròn kết quả đến hàng phần trăm và ghi đơn vị.

**Phần 2. Trình bày**

Ba mặt phẳng $(EFGH)$, $(IJKL)$, $(ABCD)$ song song nhau, cắt hai đường thẳng $AE$ và $CG$ lần lượt tại $E,I,A$ và $G,K,C$.

Theo định lí Thalès trong không gian: $\dfrac{EI}{EA}=\dfrac{GK}{GC}$.

Suy ra $GK=GC\cdot\dfrac{EI}{EA}=12\cdot\dfrac{4{,}2}{10}=5{,}04$.

$KC=CG-GK=12-5{,}04=6{,}96$ ($dm$).

Vậy $KC=6{,}96\ dm$.

### Câu 12a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của dãy số $\lim\limits_{n\to+\infty}\dfrac{-4n^2+n+2}{2n^2+n+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc hai nên chia cả hai cho $n^2$ rồi dùng $\lim\dfrac{1}{n^k}=0$.

**Bước 1.** Xác định lũy thừa cao nhất của $n$ ở cả tử và mẫu để biết số chia.

**Bước 2.** Chia cả tử và mẫu cho $n^2$ rồi viết lại phân thức.

**Bước 3.** Áp dụng quy tắc giới hạn của thương cùng giới hạn $\lim\dfrac{1}{n^k}=0$ để tính.

**Phần 2. Trình bày**

$\dfrac{-4n^2+n+2}{2n^2+n+1}=\dfrac{-4+\dfrac{1}{n}+\dfrac{2}{n^2}}{2+\dfrac{1}{n}+\dfrac{1}{n^2}}$.

Khi $n\to+\infty$ thì $\dfrac{1}{n}\to0$, $\dfrac{1}{n^2}\to0$.

$\lim\dfrac{-4n^2+n+2}{2n^2+n+1}=\dfrac{-4}{2}=-2$.

Vậy giới hạn bằng $-2$.

### Câu 12b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của dãy số $\lim\limits_{n\to+\infty}\dfrac{\sqrt{n^4+2n+2}}{n^2+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** căn ở tử có bậc $2$ theo $n$, bằng bậc của mẫu, nên đưa $n^2$ ra khỏi căn rồi chia.

**Bước 1.** Đưa $n^4$ ra khỏi dấu căn ở tử số để viết căn thành $n^2$ nhân một căn còn lại.

**Bước 2.** Chia cả tử và mẫu cho $n^2$ để mỗi số hạng còn lại có dạng $\dfrac{c}{n^k}$.

**Bước 3.** Tính giới hạn từng phần bằng $\lim\dfrac{1}{n^k}=0$ và quy tắc giới hạn của căn thức.

**Phần 2. Trình bày**

$\sqrt{n^4+2n+2}=n^2\sqrt{1+\dfrac{2}{n^3}+\dfrac{2}{n^4}}$ với $n>0$.

$\dfrac{\sqrt{n^4+2n+2}}{n^2+1}=\dfrac{\sqrt{1+\dfrac{2}{n^3}+\dfrac{2}{n^4}}}{1+\dfrac{1}{n^2}}$.

Khi $n\to+\infty$ thì $\dfrac{2}{n^3}\to0$, $\dfrac{2}{n^4}\to0$, $\dfrac{1}{n^2}\to0$.

$\lim\dfrac{\sqrt{n^4+2n+2}}{n^2+1}=\dfrac{\sqrt1}{1}=1$.

Vậy giới hạn bằng $1$.

### Câu 12c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của dãy số $\lim\limits_{n\to+\infty}\dfrac{3^{n+1}-4^n}{4^{n-1}+3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** các biểu thức chứa lũy thừa với cơ số khác nhau được chia cho lũy thừa có cơ số lớn nhất để dùng $\lim q^n=0$ khi $|q|<1$.

**Bước 1.** Viết lại $3^{n+1}$ và $4^{n-1}$ theo $3^n$ và $4^n$ để tách hệ số.

**Bước 2.** Chia cả tử và mẫu cho $4^n$ rồi đưa về các lũy thừa dạng $\left(\dfrac{3}{4}\right)^n$ và $\left(\dfrac{1}{4}\right)^n$.

**Bước 3.** Áp dụng $\lim q^n=0$ với $|q|<1$ rồi tính giới hạn của thương.

**Phần 2. Trình bày**

$3^{n+1}=3\cdot3^n$ và $4^{n-1}=\dfrac{4^n}{4}$.

$\dfrac{3^{n+1}-4^n}{4^{n-1}+3}=\dfrac{3\cdot3^n-4^n}{\dfrac{4^n}{4}+3}=\dfrac{3\cdot\left(\dfrac{3}{4}\right)^n-1}{\dfrac{1}{4}+3\cdot\left(\dfrac{1}{4}\right)^n}$ (chia tử và mẫu cho $4^n$).

Vì $\left|\dfrac{3}{4}\right|<1$ và $\left|\dfrac{1}{4}\right|<1$ nên $\left(\dfrac{3}{4}\right)^n\to0$ và $\left(\dfrac{1}{4}\right)^n\to0$.

$\lim\dfrac{3^{n+1}-4^n}{4^{n-1}+3}=\dfrac{0-1}{\dfrac{1}{4}+0}=-4$.

Vậy giới hạn bằng $-4$.

### Câu 12d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của dãy số $\lim\limits_{n\to+\infty}\dfrac{n^3+1}{n^2-2n+3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bậc của tử lớn hơn bậc của mẫu nên giới hạn là vô cực, ta cần ra được dấu của nó.

**Bước 1.** So sánh bậc của tử số và mẫu số để dự đoán dạng giới hạn.

**Bước 2.** Chia cả tử và mẫu cho $n^2$ để mẫu số có giới hạn hữu hạn khác $0$.

**Bước 3.** Xét giới hạn của tử số mới và dấu của mẫu số mới rồi áp dụng quy tắc giới hạn vô cực.

**Phần 2. Trình bày**

$\dfrac{n^3+1}{n^2-2n+3}=\dfrac{n+\dfrac{1}{n^2}}{1-\dfrac{2}{n}+\dfrac{3}{n^2}}$.

Khi $n\to+\infty$: tử số $n+\dfrac{1}{n^2}\to+\infty$, mẫu số $1-\dfrac{2}{n}+\dfrac{3}{n^2}\to1>0$.

Do đó $\lim\dfrac{n^3+1}{n^2-2n+3}=+\infty$.

Vậy giới hạn bằng $+\infty$.

### Câu 12e | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của dãy số $\lim\limits_{n\to+\infty}\dfrac{1+2+2^2+\dots+2^n}{1+3+3^2+\dots+3^n}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu đều là tổng của cấp số nhân, ta rút gọn bằng công thức tổng rồi so sánh các lũy thừa $2^n$ và $3^n$.

**Bước 1.** Nhận ra tử số là tổng $n+1$ số hạng đầu của cấp số nhân có công bội $2$ và áp dụng công thức tổng.

**Bước 2.** Làm tương tự với mẫu số là tổng của cấp số nhân có công bội $3$.

**Bước 3.** Chia cả tử và mẫu cho $3^{n+1}$ rồi dùng $\lim q^n=0$ với $|q|<1$.

**Phần 2. Trình bày**

$1+2+2^2+\dots+2^n=\dfrac{2^{n+1}-1}{2-1}=2^{n+1}-1$.

$1+3+3^2+\dots+3^n=\dfrac{3^{n+1}-1}{3-1}=\dfrac{3^{n+1}-1}{2}$.

$\dfrac{1+2+\dots+2^n}{1+3+\dots+3^n}=\dfrac{2\left(2^{n+1}-1\right)}{3^{n+1}-1}=\dfrac{2\left[2\cdot\left(\dfrac{2}{3}\right)^n-\dfrac{1}{3^{n+1}}\right]}{1-\dfrac{1}{3^{n+1}}}$ (chia tử và mẫu cho $3^{n+1}$).

Vì $\left(\dfrac{2}{3}\right)^n\to0$ và $\dfrac{1}{3^{n+1}}\to0$ nên giới hạn bằng $\dfrac{2\cdot(0-0)}{1-0}=0$.

Vậy giới hạn bằng $0$.

### Câu 13a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to0}\dfrac{1+x+x^2+x^3}{1+x}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nếu mẫu số khác $0$ tại điểm đang xét thì giới hạn của thương bằng thương các giá trị, không cần biến đổi.

**Bước 1.** Thay $x=0$ vào mẫu số để kiểm tra mẫu số có khác $0$ hay không.

**Bước 2.** Thay $x=0$ vào tử số vì hàm đa thức liên tục.

**Bước 3.** Áp dụng quy tắc giới hạn của thương để kết luận.

**Phần 2. Trình bày**

Khi $x\to0$: $\lim\left(1+x+x^2+x^3\right)=1$ và $\lim(1+x)=1\neq0$.

$\lim\limits_{x\to0}\dfrac{1+x+x^2+x^3}{1+x}=\dfrac{1}{1}=1$.

Vậy giới hạn bằng $1$.

### Câu 13b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to-1}\dfrac{\sqrt{3x^2+1}-x}{x-1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu số $x-1$ khác $0$ tại $x=-1$ và hàm căn liên tục tại điểm đó nên ta tính bằng cách thay trực tiếp.

**Bước 1.** Kiểm tra mẫu số tại $x=-1$ để biết có phải khử dạng vô định hay không.

**Bước 2.** Tính giới hạn của tử số bằng tính liên tục của hàm căn thức và hàm đa thức.

**Bước 3.** Lấy thương hai giới hạn theo quy tắc giới hạn của thương.

**Phần 2. Trình bày**

Khi $x\to-1$: $\lim\left(\sqrt{3x^2+1}-x\right)=\sqrt{3\cdot1+1}-(-1)=2+1=3$.

$\lim(x-1)=-2\neq0$.

$\lim\limits_{x\to-1}\dfrac{\sqrt{3x^2+1}-x}{x-1}=\dfrac{3}{-2}=-\dfrac{3}{2}$.

Vậy giới hạn bằng $-\dfrac{3}{2}$.

### Câu 13c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to1}\dfrac{\sqrt{x+8}-3}{x-2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu số khác $0$ tại $x=1$ nên không có dạng vô định, chỉ cần thay giá trị vào biểu thức.

**Bước 1.** Thay $x=1$ vào mẫu số để xác nhận mẫu số khác $0$.

**Bước 2.** Tính giới hạn của tử số bằng tính liên tục của hàm căn thức.

**Bước 3.** Áp dụng quy tắc giới hạn của thương rồi viết kết luận.

**Phần 2. Trình bày**

Khi $x\to1$: $\lim\left(\sqrt{x+8}-3\right)=\sqrt9-3=0$ và $\lim(x-2)=-1\neq0$.

$\lim\limits_{x\to1}\dfrac{\sqrt{x+8}-3}{x-2}=\dfrac{0}{-1}=0$.

Vậy giới hạn bằng $0$.

### Câu 13d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to+\infty}\dfrac{x^2+1}{2x^2-x+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc hai nên chia cả hai cho $x^2$ rồi dùng $\lim\dfrac{1}{x^k}=0$.

**Bước 1.** So sánh bậc của tử và mẫu để chọn lũy thừa cao nhất cần chia.

**Bước 2.** Chia cả tử và mẫu cho $x^2$ để mỗi số hạng còn lại có dạng $\dfrac{c}{x^k}$.

**Bước 3.** Cho $x\to+\infty$, dùng $\lim\dfrac{1}{x^k}=0$ và quy tắc giới hạn của thương.

**Phần 2. Trình bày**

$\dfrac{x^2+1}{2x^2-x+1}=\dfrac{1+\dfrac{1}{x^2}}{2-\dfrac{1}{x}+\dfrac{1}{x^2}}$.

Khi $x\to+\infty$ thì $\dfrac{1}{x}\to0$ và $\dfrac{1}{x^2}\to0$.

$\lim\limits_{x\to+\infty}\dfrac{x^2+1}{2x^2-x+1}=\dfrac{1}{2}$.

Vậy giới hạn bằng $\dfrac{1}{2}$.

### Câu 13e | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to-\infty}\dfrac{2x^2-x+1}{x-2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bậc tử lớn hơn bậc mẫu nên giới hạn là vô cực, dấu của nó phụ thuộc vào việc $x\to-\infty$.

**Bước 1.** Chia cả tử và mẫu cho $x$ để mẫu số có giới hạn hữu hạn khác $0$.

**Bước 2.** Xét giới hạn của tử số mới khi $x\to-\infty$, chú ý dấu của $2x$.

**Bước 3.** Áp dụng quy tắc giới hạn vô cực của thương với mẫu số dương để kết luận.

**Phần 2. Trình bày**

$\dfrac{2x^2-x+1}{x-2}=\dfrac{2x-1+\dfrac{1}{x}}{1-\dfrac{2}{x}}$ với $x\neq0$.

Khi $x\to-\infty$: tử số $2x-1+\dfrac{1}{x}\to-\infty$, mẫu số $1-\dfrac{2}{x}\to1>0$.

Do đó $\lim\limits_{x\to-\infty}\dfrac{2x^2-x+1}{x-2}=-\infty$.

Vậy giới hạn bằng $-\infty$.

### Câu 13f | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn của hàm số $\lim\limits_{x\to+\infty}\dfrac{x\sqrt{x}+1}{x^2+x+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bậc của tử là $\dfrac{3}{2}$, nhỏ hơn bậc $2$ của mẫu, nên chia cả tử và mẫu cho $x^2$ để mọi số hạng ở tử tiến về $0$.

**Bước 1.** Viết $x\sqrt{x}$ dưới dạng lũy thừa của $x$ để so sánh bậc với mẫu số.

**Bước 2.** Chia cả tử và mẫu cho $x^2$, chú ý $\dfrac{x\sqrt{x}}{x^2}=\dfrac{1}{\sqrt{x}}$.

**Bước 3.** Dùng $\lim\dfrac{1}{\sqrt{x}}=0$ và $\lim\dfrac{1}{x^k}=0$ khi $x\to+\infty$ để tính.

**Phần 2. Trình bày**

$\dfrac{x\sqrt{x}+1}{x^2+x+1}=\dfrac{\dfrac{1}{\sqrt{x}}+\dfrac{1}{x^2}}{1+\dfrac{1}{x}+\dfrac{1}{x^2}}$ với $x>0$.

Khi $x\to+\infty$ thì $\dfrac{1}{\sqrt{x}}\to0$, $\dfrac{1}{x}\to0$, $\dfrac{1}{x^2}\to0$.

$\lim\limits_{x\to+\infty}\dfrac{x\sqrt{x}+1}{x^2+x+1}=\dfrac{0+0}{1+0+0}=0$.

Vậy giới hạn bằng $0$.

### Câu 14 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một máy kéo nông nghiệp với bánh xe sau có đường kính là $184\,cm$, bánh xe trước có đường kính là $92\,cm$, xe chuyển động với vận tốc không đổi trên một đoạn đường thẳng. Biết rằng vận tốc của bánh xe sau trong chuyển động này là $80$ vòng/phút.
a) Tính quãng đường đi được của máy kéo trong $10$ phút.
b) Tính vận tốc của máy kéo (theo đơn vị km/giờ).
c) Tính vận tốc của bánh xe trước (theo đơn vị vòng/phút).
**Hình:** de_P32C14.png
**Ghi chú:** hình chỉ minh họa chiếc máy kéo; kết quả làm tròn theo yêu cầu thực tế (đề không nêu quy tắc làm tròn).

**Phần 1. Hướng dẫn**

**Mấu chốt:** bánh xe lăn không trượt nên mỗi vòng quay xe đi được đúng một chu vi của bánh, và hai bánh có cùng vận tốc dài.

**Bước 1.** Ý a: tính chu vi bánh sau từ đường kính, đổi sang mét rồi nhân với số vòng bánh quay được trong $10$ phút.

**Bước 2.** Ý b: tính quãng đường xe đi trong một phút rồi quy đổi sang km/giờ bằng cách nhân với số phút trong một giờ và chia cho $1000$.

**Bước 3.** Ý c: lập đẳng thức quãng đường mỗi phút của hai bánh bằng nhau để suy ra số vòng của bánh trước.

**Phần 2. Trình bày**

Chu vi bánh sau là $\pi\cdot1{,}84$ mét (đường kính $184\,cm=1{,}84\,m$). Mỗi vòng quay xe đi được một đoạn bằng chu vi.

Ý a) Trong $10$ phút bánh sau quay $80\cdot10=800$ vòng.

Quãng đường là $800\cdot1{,}84\pi=1472\pi\approx4624{,}4$ (m).

Ý b) Trong $1$ phút xe đi được $80\cdot1{,}84\pi=147{,}2\pi$ (m).

Trong $1$ giờ xe đi được $147{,}2\pi\cdot60=8832\pi$ (m) $=8{,}832\pi$ (km).

Vận tốc của máy kéo là $8{,}832\pi\approx27{,}7$ (km/giờ).

Ý c) Chu vi bánh trước là $\pi\cdot0{,}92$ mét. Gọi $v$ là số vòng/phút của bánh trước. Quãng đường mỗi phút của hai bánh bằng nhau nên $v\cdot0{,}92\pi=147{,}2\pi$.

Suy ra $v=\dfrac{147{,}2}{0{,}92}=160$ (vòng/phút).

Vậy quãng đường trong $10$ phút khoảng $4624{,}4$ m, vận tốc máy kéo khoảng $27{,}7$ km/giờ và bánh trước quay $160$ vòng/phút.

### Câu 15 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Trạm vũ trụ Quốc tế ISS (tên Tiếng Anh: International Space Station) nằm trong quỹ đạo tròn cách bề mặt Trái Đất khoảng $400\,km$. Nếu trạm mặt đất theo dõi được trạm vũ trụ ISS khi nó nằm trong góc $45^\circ$ ở tâm của quỹ đạo tròn này phía trên ăng-ten theo dõi, thì trạm vũ trụ ISS đã di chuyển được bao nhiêu kilômét trong khi nó đang được trạm mặt đất theo dõi? Giả sử rằng bán kính của Trái Đất là $6400\,km$.
**Hình:** de_P32C15.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** quãng đường ISS di chuyển là độ dài cung tròn của quỹ đạo ứng với góc ở tâm cho trước, tính bằng công thức $\ell=R\alpha$ với $\alpha$ đo bằng radian.

**Bước 1.** Xác định bán kính quỹ đạo bằng cách cộng bán kính Trái Đất với độ cao của ISS.

**Bước 2.** Đổi góc $45^\circ$ ở tâm sang radian.

**Bước 3.** Áp dụng công thức độ dài cung tròn rồi tính gần đúng và ghi đơn vị.

**Phần 2. Trình bày**

Bán kính quỹ đạo của ISS là $R=6400+400=6800$ (km).

Góc ở tâm $\alpha=45^\circ=\dfrac{\pi}{4}$ (rad).

Độ dài cung: $\ell=R\alpha=6800\cdot\dfrac{\pi}{4}=1700\pi\approx5340{,}7$ (km).

Vậy ISS đã di chuyển được khoảng $5341$ km.

### Câu 16 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một thiết bị trễ kĩ thuật số lặp lại tín hiệu đầu vào bằng cách lặp lại tín hiệu đó trong một khoảng thời gian cố định sau khi nhận được tín hiệu. Nếu một thiết bị như vậy nhận được nốt thuần $f_1(t)=5\sin t$ và phát lại được nốt thuần $f_2(t)=5\cos t$ thì âm kết hợp là $f(t)=f_1(t)+f_2(t)$, trong đó $t$ là biến thời gian. Chứng tỏ rằng âm kết hợp viết được dưới dạng $f(t)=k\sin(t+\varphi)$, tức là âm kết hợp là một sóng âm hình sin. Hãy xác định biên độ âm $k$ và pha ban đầu $\varphi\ (-\pi\le\varphi\le\pi)$ của sóng âm.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tổng $a\sin t+b\cos t$ được đưa về dạng $k\sin(t+\varphi)$ bằng cách đặt $\sqrt{a^2+b^2}$ làm nhân tử chung rồi nhận ra công thức cộng của $\sin$.

**Bước 1.** Viết $f(t)=f_1(t)+f_2(t)$ và đặt nhân tử chung sao cho các hệ số của $\sin t$, $\cos t$ là sin, cos của cùng một góc đặc biệt.

**Bước 2.** Nhận ra biểu thức trong ngoặc là vế phải của công thức $\sin(a+b)$ với $b$ là góc đã tìm.

**Bước 3.** Đối chiếu với dạng $k\sin(t+\varphi)$ để đọc $k$, $\varphi$ và kiểm tra $\varphi$ thuộc đoạn $[-\pi;\pi]$.

**Phần 2. Trình bày**

$f(t)=5\sin t+5\cos t=5\sqrt2\left(\dfrac{\sqrt2}{2}\sin t+\dfrac{\sqrt2}{2}\cos t\right)$.

Vì $\dfrac{\sqrt2}{2}=\cos\dfrac{\pi}{4}=\sin\dfrac{\pi}{4}$ nên

$f(t)=5\sqrt2\left(\sin t\cos\dfrac{\pi}{4}+\cos t\sin\dfrac{\pi}{4}\right)=5\sqrt2\sin\left(t+\dfrac{\pi}{4}\right)$.

Vậy $f(t)=k\sin(t+\varphi)$ với $k=5\sqrt2$ và $\varphi=\dfrac{\pi}{4}\in[-\pi;\pi]$, nên âm kết hợp là một sóng âm hình sin có biên độ $5\sqrt2$ và pha ban đầu $\dfrac{\pi}{4}$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Tên PHẦN: PHẦN 31 là "Phần 1: Bài tập trắc nghiệm — V. Giới hạn, hàm số liên tục" (Câu 7–21; khúc 2 giữ Câu 1–6 của cùng chương, cần khớp tên PHẦN khi ghép). PHẦN 32 là "Phần 2: Bài tập tự luận".
- Phần 1 Câu 18–21 là Đ/S (đề không in phương án A–D); đáp án SDDD, DSDS, DDDS, DSSD.
- Câu 20b: $f$ không xác định tại $x=2$ (mẫu của nhánh $x>1$ bằng $0$) nên coi là gián đoạn tại $x=2$ ("Đúng"). Câu 21d chọn "liên tục trên tập xác định" với tập xác định $\mathbb{R}\setminus\{4\}$.
- Phần 2 Câu 1, 2, 3, 12, 13 tách ý độc lập thành Câu 1a…, 2a…, 3a…, 12a…12e, 13a…13f. Câu 3a có hai nghiệm; Câu 3b có hai nghiệm.
- Câu 1a: đề in độ ($15^0$), lời giải đổi sang radian theo luật K11 và nêu thêm đáp số theo độ.
- Câu 14: kết quả làm tròn tự chọn (đề không nêu quy tắc); Câu 15: lấy bán kính quỹ đạo $6400+400$ km và dùng công thức độ dài cung.
- Câu 14 dùng ảnh minh họa máy kéo (không mang dữ kiện số); Câu 15 ảnh minh họa quỹ đạo.
- Hình giải vẽ bằng code cho Câu 5, 6, 7, 8, 10; Câu 9 không có hình giải (chỉ lập luận trong hình thang). Hình đề cắt cho Câu 4 (bảng), 11, 14, 15.
