# ĐỀ | Đề cương ôn tập học kì I Toán 11 — Phan Đình Phùng (cuối kì I 2025)
nam: 2025
bo_sach: KNTT
kieu: de_cuong

## PHẦN 91 | Giới hạn, hàm số liên tục — Phần 1: Trắc nghiệm nhiều phương án lựa chọn | trac_nghiem

### Câu 7 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Kết quả của $\lim_{n\to+\infty}\dfrac{3^n-4\cdot2^{n-1}-3}{3\cdot2^n+4^n}$ bằng:
A. $+\infty$.
B. $0$.
C. $-\infty$.
D. $1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu đều là tổng các luỹ thừa có cơ số khác nhau nên chia cả tử và mẫu cho luỹ thừa có cơ số lớn nhất.

**Bước 1.** So sánh các cơ số xuất hiện ở tử và ở mẫu để chọn luỹ thừa có cơ số lớn nhất làm thừa số chung.

**Bước 2.** Đưa $2^{n-1}$ về dạng $\dfrac{1}{2}\cdot2^n$ để mọi số hạng đều là luỹ thừa của $n$ với cơ số rõ ràng.

**Bước 3.** Chia cả tử và mẫu cho luỹ thừa đã chọn, rồi dùng $\lim q^n=0$ với $|q|<1$.

**Phần 2. Trình bày**

Ta có $4\cdot2^{n-1}=2\cdot2^n$.

Chia cả tử và mẫu cho $4^n$:

$\dfrac{3^n-2\cdot2^n-3}{3\cdot2^n+4^n}=\dfrac{\left(\dfrac{3}{4}\right)^n-2\cdot\left(\dfrac{1}{2}\right)^n-\dfrac{3}{4^n}}{3\cdot\left(\dfrac{1}{2}\right)^n+1}$.

Vì $\lim\left(\dfrac{3}{4}\right)^n=0$, $\lim\left(\dfrac{1}{2}\right)^n=0$, $\lim\dfrac{3}{4^n}=0$ nên tử có giới hạn $0$, mẫu có giới hạn $1$.

Vậy giới hạn bằng $0$.

Chọn B.

### Câu 8 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Giá trị của $\lim_{n\to+\infty}\left(\sqrt{n^2-1}-\sqrt{3n^2+2}\right)$ là:
A. $+\infty$.
B. $-\infty$.
C. $0$.
D. $1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai căn cùng bậc nhưng hệ số khác nhau nên đưa $n$ ra ngoài căn thay vì nhân liên hợp.

**Bước 1.** Nhận xét mỗi căn có bậc nhất theo $n$ và hệ số của $n$ trong hai căn khác nhau.

**Bước 2.** Đưa $n$ ra ngoài mỗi căn bằng cách viết $\sqrt{n^2-1}=n\sqrt{1-\dfrac{1}{n^2}}$ và biến đổi tương tự căn còn lại.

**Bước 3.** Đặt $n$ làm thừa số chung, tính giới hạn của biểu thức trong ngoặc rồi xét dấu của nó để kết luận về $n$ nhân với hằng số.

**Phần 2. Trình bày**

Với $n>0$:

$\sqrt{n^2-1}-\sqrt{3n^2+2}=n\left(\sqrt{1-\dfrac{1}{n^2}}-\sqrt{3+\dfrac{2}{n^2}}\right)$.

Ta có $\lim\left(\sqrt{1-\dfrac{1}{n^2}}-\sqrt{3+\dfrac{2}{n^2}}\right)=1-\sqrt{3}<0$ và $\lim n=+\infty$.

Vậy giới hạn bằng $-\infty$.

Chọn B.

### Câu 9 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Giá trị của $\lim_{n\to+\infty}\left(3^n-5^n\right)$ là:
A. $-\infty$.
B. $+\infty$.
C. $2$.
D. $-2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai luỹ thừa khác cơ số nên đặt luỹ thừa có cơ số lớn hơn làm thừa số chung để xét dấu.

**Bước 1.** So sánh hai cơ số để biết luỹ thừa nào tăng nhanh hơn khi $n$ lớn.

**Bước 2.** Đặt luỹ thừa tăng nhanh hơn ra ngoài làm thừa số chung, phần còn lại là hiệu của $1$ và một dãy dạng $q^n$.

**Bước 3.** Tính giới hạn phần trong ngoặc bằng $\lim q^n=0$ với $|q|<1$, rồi kết hợp với giới hạn của thừa số đặt ngoài.

**Phần 2. Trình bày**

$3^n-5^n=5^n\left[\left(\dfrac{3}{5}\right)^n-1\right]$.

Vì $\lim\left(\dfrac{3}{5}\right)^n=0$ nên $\lim\left[\left(\dfrac{3}{5}\right)^n-1\right]=-1<0$.

Mặt khác $\lim5^n=+\infty$.

Vậy giới hạn bằng $-\infty$.

Chọn A.

### Câu 10 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho dãy số $(u_n)$ với $u_n=\dfrac{4n^2+n+2}{an^2+5}$. Tìm giá trị của tham số $a$ để dãy số đã cho có giới hạn bằng $2$.
A. $a=\dfrac{1}{4}$.
B. $a=4$.
C. $a=2$.
D. $a=\dfrac{1}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc hai theo $n$ nên giới hạn phụ thuộc tỉ số hai hệ số của $n^2$.

**Bước 1.** Chia cả tử và mẫu cho $n^2$ để thấy giới hạn của từng phần.

**Bước 2.** Điều kiện để giới hạn hữu hạn: hệ số $a$ ở mẫu phải khác $0$, vì nếu bằng $0$ thì mẫu là hằng số còn tử tăng vô hạn.

**Bước 3.** Lập phương trình ẩn $a$ bằng cách cho giới hạn tìm được bằng $2$ rồi giải.

**Phần 2. Trình bày**

Với $a\ne0$, chia cả tử và mẫu cho $n^2$:

$u_n=\dfrac{4+\dfrac{1}{n}+\dfrac{2}{n^2}}{a+\dfrac{5}{n^2}}$.

Suy ra $\lim u_n=\dfrac{4}{a}$.

Nếu $a=0$ thì $u_n=\dfrac{4n^2+n+2}{5}\to+\infty$, không thoả mãn.

Giới hạn bằng $2$ khi $\dfrac{4}{a}=2$, tức là $a=2$.

Vậy $a=2$.

Chọn C.

### Câu 11 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Biết $\lim_{n\to+\infty}\dfrac{2n^3+n^2-4}{an^3+2}=\dfrac{1}{2}$ với $a$ là tham số. Khi đó $a-a^2$ bằng
A. $-12$.
B. $-2$.
C. $0$.
D. $-6$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc ba nên giới hạn bằng tỉ số hai hệ số của $n^3$, từ đó tìm $a$.

**Bước 1.** Chia cả tử và mẫu cho $n^3$ để tìm giới hạn theo $a$.

**Bước 2.** Cho giới hạn đó bằng $\dfrac{1}{2}$ và giải phương trình để tìm $a$, chú ý $a\ne0$.

**Bước 3.** Thay giá trị $a$ vừa tìm vào biểu thức $a-a^2$ để tính.

**Phần 2. Trình bày**

Với $a\ne0$, chia cả tử và mẫu cho $n^3$:

$\dfrac{2n^3+n^2-4}{an^3+2}=\dfrac{2+\dfrac{1}{n}-\dfrac{4}{n^3}}{a+\dfrac{2}{n^3}}\to\dfrac{2}{a}$.

Theo đề $\dfrac{2}{a}=\dfrac{1}{2}$, suy ra $a=4$.

Khi đó $a-a^2=4-16=-12$.

Vậy $a-a^2=-12$.

Chọn A.

### Câu 12 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính giới hạn $L=\lim_{x\to3}\dfrac{x-3}{x+3}$.
A. $L=-\infty$.
B. $L=0$.
C. $L=+\infty$.
D. $L=1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức xác định tại điểm đang xét nên thay trực tiếp giá trị của $x$.

**Bước 1.** Kiểm tra mẫu số tại $x=3$ có khác $0$ hay không để biết hàm có liên tục tại điểm đó.

**Bước 2.** Thay $x=3$ vào tử và mẫu để tính giá trị của phân thức.

**Bước 3.** Đối chiếu giá trị tìm được với bốn phương án để chọn đáp án đúng.

**Phần 2. Trình bày**

Hàm số $\dfrac{x-3}{x+3}$ xác định tại $x=3$ (mẫu $=6\ne0$) nên liên tục tại đó.

$L=\dfrac{3-3}{3+3}=\dfrac{0}{6}=0$.

Vậy $L=0$.

Chọn B.

### Câu 13 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** $\lim_{x\to-\infty}\dfrac{4x+1}{-x+1}$ bằng
A. $2$.
B. $4$.
C. $-1$.
D. $-4$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giới hạn tại vô cực của phân thức bậc nhất chia cho bậc nhất: chia tử và mẫu cho $x$.

**Bước 1.** Nhận ra tử và mẫu cùng bậc một theo $x$ nên chia cả hai cho luỹ thừa cao nhất của $x$.

**Bước 2.** Dùng $\lim_{x\to-\infty}\dfrac{1}{x}=0$ để tính giới hạn của từng phần rồi lập tỉ số.

**Bước 3.** Đối chiếu kết quả với bốn phương án, chú ý dấu của tỉ số hai hằng số.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $x$:

$\dfrac{4x+1}{-x+1}=\dfrac{4+\dfrac{1}{x}}{-1+\dfrac{1}{x}}$.

Vì $\lim_{x\to-\infty}\dfrac{1}{x}=0$ nên giới hạn bằng $\dfrac{4}{-1}=-4$.

Vậy giới hạn bằng $-4$.

Chọn D.

### Câu 14 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** $\lim_{x\to-\infty}\dfrac{3x+2}{2x-4}$ bằng
A. $-\dfrac{1}{2}$.
B. $-\dfrac{3}{4}$.
C. $1$.
D. $\dfrac{3}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** phân thức bậc nhất trên bậc nhất, giới hạn tại vô cực bằng tỉ số các hệ số của $x$.

**Bước 1.** Chia cả tử và mẫu cho $x$ vì hai bậc bằng nhau.

**Bước 2.** Dùng $\lim\dfrac{1}{x}=0$ khi $x\to-\infty$ rồi lập tỉ số các hằng số còn lại.

**Bước 3.** Rút gọn tỉ số và đối chiếu với bốn phương án.

**Phần 2. Trình bày**

$\dfrac{3x+2}{2x-4}=\dfrac{3+\dfrac{2}{x}}{2-\dfrac{4}{x}}$.

Vì $\lim_{x\to-\infty}\dfrac{2}{x}=0$ và $\lim_{x\to-\infty}\dfrac{4}{x}=0$ nên giới hạn bằng $\dfrac{3}{2}$.

Vậy giới hạn bằng $\dfrac{3}{2}$.

Chọn D.

### Câu 15 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Trong các mệnh đề sau, mệnh đề nào sai?
A. $\lim_{x\to0^+}\dfrac{1}{x}=+\infty$.
B. $\lim_{x\to0^+}\dfrac{1}{x}=-\infty$.
C. $\lim_{x\to0^+}\dfrac{1}{x^5}=+\infty$.
D. $\lim_{x\to0^+}\dfrac{1}{\sqrt{x}}=+\infty$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi $x\to0^+$ thì $x>0$ và nhỏ dần, nên các biểu thức $\dfrac{1}{x^k}$ cùng dấu với $x^k$.

**Bước 1.** Nhớ giới hạn một bên: $x\to0^+$ nghĩa là $x$ dương tiến dần về $0$.

**Bước 2.** Xét dấu của từng biểu thức dưới mẫu (gồm $x$, $x^5$, $\sqrt{x}$) khi $x$ dương gần $0$.

**Bước 3.** Xét đủ cả bốn mệnh đề, đối chiếu dấu của mẫu với giới hạn đã cho rồi chọn mệnh đề không khớp.

**Phần 2. Trình bày**

Khi $x\to0^+$ thì $x>0$, $x^5>0$, $\sqrt{x}>0$ và cả ba đều tiến về $0$.

A. $\lim_{x\to0^+}\dfrac{1}{x}=+\infty$: đúng.

B. Vì $x>0$ nên $\dfrac{1}{x}>0$, không thể tiến tới $-\infty$: mệnh đề sai.

C. $\lim_{x\to0^+}\dfrac{1}{x^5}=+\infty$: đúng.

D. $\lim_{x\to0^+}\dfrac{1}{\sqrt{x}}=+\infty$: đúng.

Vậy mệnh đề sai là B.

Chọn B.

### Câu 16 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Giới hạn $\lim_{x\to2}\dfrac{x-2}{x^2-4}$ bằng
A. $2$.
B. $4$.
C. $\dfrac{1}{4}$.
D. $0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** thay $x=2$ cho dạng $\dfrac{0}{0}$, nên phân tích mẫu thành nhân tử để rút gọn nhân tử chung.

**Bước 1.** Thử thay $x=2$ vào tử và mẫu để nhận ra dạng vô định.

**Bước 2.** Phân tích $x^2-4$ bằng hằng đẳng thức hiệu hai bình phương rồi rút gọn nhân tử $x-2$ (vì $x\ne2$ khi tìm giới hạn).

**Bước 3.** Thay $x=2$ vào biểu thức đã rút gọn.

**Phần 2. Trình bày**

Với $x\ne2$: $\dfrac{x-2}{x^2-4}=\dfrac{x-2}{(x-2)(x+2)}=\dfrac{1}{x+2}$.

Do đó $\lim_{x\to2}\dfrac{x-2}{x^2-4}=\lim_{x\to2}\dfrac{1}{x+2}=\dfrac{1}{4}$.

Vậy giới hạn bằng $\dfrac{1}{4}$.

Chọn C.

### Câu 17 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho các giới hạn: $\lim_{x\to x_0}f(x)=2$; $\lim_{x\to x_0}g(x)=3$, hỏi $\lim_{x\to x_0}\left[3f(x)-4g(x)\right]$ bằng
A. $5$.
B. $2$.
C. $-6$.
D. $3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dùng quy tắc giới hạn của hiệu và của tích một hằng số với một hàm.

**Bước 1.** Nhớ quy tắc: giới hạn của hiệu bằng hiệu các giới hạn khi mỗi giới hạn đều hữu hạn.

**Bước 2.** Đưa hằng số $3$ và $4$ ra ngoài dấu giới hạn rồi thay hai giá trị giới hạn đã cho.

**Bước 3.** Tính biểu thức số thu được và đối chiếu với bốn phương án.

**Phần 2. Trình bày**

$\lim_{x\to x_0}\left[3f(x)-4g(x)\right]=3\lim_{x\to x_0}f(x)-4\lim_{x\to x_0}g(x)$.

$=3\cdot2-4\cdot3=6-12=-6$.

Vậy giới hạn bằng $-6$.

Chọn C.

### Câu 18 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Giới hạn $\lim_{x\to-2}\dfrac{x+1}{(x+2)^2}$ bằng
A. $-\infty$.
B. $\dfrac{3}{16}$.
C. $0$.
D. $+\infty$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu tiến về $0$ còn tử tiến về một số khác $0$ nên xét dấu của tử và của mẫu.

**Bước 1.** Thay $x=-2$ để nhận ra tử tiến về một hằng số khác $0$ còn mẫu tiến về $0$.

**Bước 2.** Xét dấu của mẫu $(x+2)^2$ khi $x$ gần $-2$ từ cả hai phía.

**Bước 3.** Xét dấu của tử gần $x=-2$ rồi dùng quy tắc giới hạn dạng $\dfrac{L}{0}$ để kết luận.

**Phần 2. Trình bày**

Khi $x\to-2$: $\lim(x+1)=-1<0$.

Mặt khác $(x+2)^2>0$ với mọi $x\ne-2$ và $\lim(x+2)^2=0$.

Do đó $\lim_{x\to-2}\dfrac{x+1}{(x+2)^2}=-\infty$.

Vậy giới hạn bằng $-\infty$.

Chọn A.

### Câu 19 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính $I=\lim_{x\to0}\dfrac{2\left(\sqrt{3x+1}-1\right)}{x}$.
A. $6$.
B. $3$.
C. $-6$.
D. $-3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dạng $\dfrac{0}{0}$ chứa căn bậc hai nên nhân với biểu thức liên hợp của tử.

**Bước 1.** Thay $x=0$ để nhận ra dạng vô định $\dfrac{0}{0}$.

**Bước 2.** Nhân cả tử và mẫu với $\sqrt{3x+1}+1$ để tử trở thành hiệu hai bình phương.

**Bước 3.** Rút gọn nhân tử $x$ rồi thay $x=0$ vào biểu thức còn lại.

**Phần 2. Trình bày**

Với $x\ne0$:

$\dfrac{2\left(\sqrt{3x+1}-1\right)}{x}=\dfrac{2\left(3x+1-1\right)}{x\left(\sqrt{3x+1}+1\right)}=\dfrac{6}{\sqrt{3x+1}+1}$.

Do đó $I=\lim_{x\to0}\dfrac{6}{\sqrt{3x+1}+1}=\dfrac{6}{2}=3$.

Vậy $I=3$.

Chọn B.

### Câu 20 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Tính $\lim_{x\to-\infty}\dfrac{2x+3}{\sqrt{2x^2-3}}$.
A. $\dfrac{1}{\sqrt{2}}$.
B. $-\dfrac{1}{\sqrt{2}}$.
C. $\sqrt{2}$.
D. $-\sqrt{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi $x\to-\infty$ thì $x<0$ nên $\sqrt{x^2}=-x$; đưa $|x|$ ra khỏi căn rồi chia tử và mẫu.

**Bước 1.** Nhận ra tử bậc một, mẫu là căn của đa thức bậc hai nên cả hai có bậc tương đương với $|x|$.

**Bước 2.** Đưa $x^2$ ra ngoài căn ở mẫu và chú ý dấu của $x$ khi $x\to-\infty$ để viết đúng $\sqrt{x^2}$.

**Bước 3.** Chia tử và mẫu cho $x$ (hoặc cho $-x$), dùng $\lim\dfrac{1}{x}=0$ để tính giới hạn.

**Phần 2. Trình bày**

Với $x<0$: $\sqrt{2x^2-3}=\sqrt{x^2\left(2-\dfrac{3}{x^2}\right)}=|x|\sqrt{2-\dfrac{3}{x^2}}=-x\sqrt{2-\dfrac{3}{x^2}}$.

Do đó $\dfrac{2x+3}{\sqrt{2x^2-3}}=\dfrac{x\left(2+\dfrac{3}{x}\right)}{-x\sqrt{2-\dfrac{3}{x^2}}}=-\dfrac{2+\dfrac{3}{x}}{\sqrt{2-\dfrac{3}{x^2}}}$.

Khi $x\to-\infty$: $\dfrac{3}{x}\to0$ và $\dfrac{3}{x^2}\to0$ nên giới hạn bằng $-\dfrac{2}{\sqrt{2}}=-\sqrt{2}$.

Vậy giới hạn bằng $-\sqrt{2}$.

Chọn D.

### Câu 21 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Tìm $\lim_{x\to2}\dfrac{\sqrt{x^2-4x+4}}{x-2}$.
A. Không tồn tại.
B. $-1$.
C. $\pm1$.
D. $1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu thức dưới căn là bình phương một nhị thức nên căn cho giá trị tuyệt đối, cần xét giới hạn hai bên.

**Bước 1.** Nhận ra $x^2-4x+4$ là hằng đẳng thức và viết căn thành giá trị tuyệt đối.

**Bước 2.** Bỏ dấu giá trị tuyệt đối theo dấu của $x-2$ khi $x\to2^+$ và khi $x\to2^-$.

**Bước 3.** So sánh hai giới hạn một bên để quyết định giới hạn tại $2$ có tồn tại hay không.

**Phần 2. Trình bày**

$\sqrt{x^2-4x+4}=\sqrt{(x-2)^2}=|x-2|$.

Khi $x\to2^+$: $x-2>0$ nên $\dfrac{|x-2|}{x-2}=1$, giới hạn phải bằng $1$.

Khi $x\to2^-$: $x-2<0$ nên $\dfrac{|x-2|}{x-2}=-1$, giới hạn trái bằng $-1$.

Hai giới hạn một bên khác nhau nên không tồn tại $\lim_{x\to2}\dfrac{\sqrt{x^2-4x+4}}{x-2}$.

Vậy giới hạn không tồn tại.

Chọn A.

### Câu 22 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Tìm giới hạn $\lim_{x\to1^+}\dfrac{4x-3}{x-1}$.
A. $+\infty$.
B. $2$.
C. $-\infty$.
D. $-2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu tiến về $0$ còn tử tiến về một số khác $0$, nên chỉ cần xét dấu của tử và mẫu khi $x\to1^+$.

**Bước 1.** Thay $x=1$ vào tử để biết tử tiến về hằng số nào.

**Bước 2.** Xét dấu của mẫu $x-1$ khi $x>1$ gần $1$.

**Bước 3.** Dùng quy tắc giới hạn dạng $\dfrac{L}{0}$ với dấu của tử và của mẫu đã xét.

**Phần 2. Trình bày**

Khi $x\to1^+$: $\lim(4x-3)=1>0$.

Mặt khác $x-1>0$ khi $x>1$ và $\lim_{x\to1^+}(x-1)=0$.

Do đó $\lim_{x\to1^+}\dfrac{4x-3}{x-1}=+\infty$.

Vậy giới hạn bằng $+\infty$.

Chọn A.

### Câu 23 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho hàm số $f(x)=\begin{cases}\dfrac{x^2+3x-4}{x-1} & \text{khi } x>1 \\ 4x+1 & \text{khi } x\le1\end{cases}$. Khẳng định nào sau đây là đúng
A. Hàm số gián đoạn tại điểm $x=1$.
B. Hàm số gián đoạn tại $x=2$.
C. Hàm số liên tục tại điểm $x=1$.
D. Hàm số liên tục $\forall x\in\mathbb{R}$.
**Ghi chú:** đề sai: cả phương án C và D đều đúng (hàm liên tục tại $x=1$ và liên tục trên cả $\mathbb{R}$). Chọn D vì là khẳng định đầy đủ nhất; nếu đáp án in là C thì cũng hợp lí.
**Chưa chắc:** hai phương án C và D cùng đúng, đáp án chính thức có thể là C hoặc D.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm cho bởi hai công thức nên chỉ cần kiểm tra tính liên tục tại điểm nối $x=1$, còn mỗi khoảng còn lại đã liên tục sẵn.

**Bước 1.** Nhận xét trên $(-\infty;1)$ và $(1;+\infty)$ hàm số cho bởi các hàm sơ cấp xác định nên liên tục.

**Bước 2.** Tính giá trị $f(1)$ và giới hạn trái tại $x=1$ từ công thức $x\le1$.

**Bước 3.** Rút gọn phân thức ở nhánh $x>1$ để tính giới hạn phải tại $x=1$.

**Bước 4.** So sánh ba đại lượng $f(1)$, giới hạn trái, giới hạn phải rồi đối chiếu từng phương án.

**Phần 2. Trình bày**

Lưu ý: đề sai, hai phương án C và D cùng đúng; ta chọn D là khẳng định đầy đủ nhất.

Với $x<1$, $f(x)=4x+1$ liên tục. Với $x>1$, $f(x)=\dfrac{x^2+3x-4}{x-1}=x+4$ liên tục.

Tại $x=1$: $f(1)=4\cdot1+1=5$.

$\lim_{x\to1^-}f(x)=\lim_{x\to1^-}(4x+1)=5$.

Với $x>1$: $\dfrac{x^2+3x-4}{x-1}=\dfrac{(x-1)(x+4)}{x-1}=x+4$, nên $\lim_{x\to1^+}f(x)=1+4=5$.

Vì $\lim_{x\to1^-}f(x)=\lim_{x\to1^+}f(x)=f(1)=5$ nên $f$ liên tục tại $x=1$.

Vậy $f$ liên tục trên $\mathbb{R}$.

Chọn D.

### Câu 24 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Tính giới hạn $T=\lim_{n\to+\infty}\left(\sqrt{16^{n+1}+4^n}-\sqrt{16^{n+1}+3^n}\right)$.
A. $T=0$.
B. $T=\dfrac{1}{4}$.
C. $T=\dfrac{1}{8}$.
D. $T=\dfrac{1}{16}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hiệu hai căn nên nhân với biểu thức liên hợp, sau đó chia tử và mẫu cho luỹ thừa trội nhất.

**Bước 1.** Nhân và chia với tổng hai căn để tử trở thành hiệu hai biểu thức dưới căn.

**Bước 2.** Rút gọn hiệu dưới căn; chú ý $16^{n+1}=16\cdot4^{2n}$ nên mỗi căn có bậc theo $4^n$.

**Bước 3.** Chia tử và mẫu cho $4^n$ rồi dùng $\lim q^n=0$ với $|q|<1$ để tính giới hạn.

**Phần 2. Trình bày**

$T=\lim\dfrac{\left(16^{n+1}+4^n\right)-\left(16^{n+1}+3^n\right)}{\sqrt{16^{n+1}+4^n}+\sqrt{16^{n+1}+3^n}}=\lim\dfrac{4^n-3^n}{\sqrt{16^{n+1}+4^n}+\sqrt{16^{n+1}+3^n}}$.

Chia tử và mẫu cho $4^n$:

$T=\lim\dfrac{1-\left(\dfrac{3}{4}\right)^n}{\sqrt{16+\dfrac{1}{4^n}}+\sqrt{16+\left(\dfrac{3}{16}\right)^n}}$.

Vì $16^{n+1}:16^n=16$ nên sau khi chia cho $4^n$ mỗi căn có dạng $\sqrt{16+\dots}$, các số hạng còn lại đều tiến về $0$.

Suy ra $T=\dfrac{1-0}{\sqrt{16}+\sqrt{16}}=\dfrac{1}{8}$.

Vậy $T=\dfrac{1}{8}$.

Chọn C.

### Câu 25 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Tìm $L=\lim_{n\to+\infty}\left(\dfrac{1}{1}+\dfrac{1}{1+2}+\dots+\dfrac{1}{1+2+\dots+n}\right)$.
A. $L=\dfrac{5}{2}$.
B. $L=+\infty$.
C. $L=2$.
D. $L=\dfrac{3}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết số hạng tổng quát dưới dạng hiệu hai phân số liên tiếp để tổng thu gọn (khử liên tiếp).

**Bước 1.** Tính tổng $1+2+\dots+k$ bằng công thức tổng cấp số cộng để viết được số hạng thứ $k$.

**Bước 2.** Tách số hạng tổng quát thành hiệu $\dfrac{1}{k}-\dfrac{1}{k+1}$ nhân với một hằng số.

**Bước 3.** Cộng các số hạng, các phần tử liên tiếp triệt tiêu, rồi tính giới hạn của tổng thu gọn.

**Phần 2. Trình bày**

Ta có $1+2+\dots+k=\dfrac{k(k+1)}{2}$ nên $\dfrac{1}{1+2+\dots+k}=\dfrac{2}{k(k+1)}=2\left(\dfrac{1}{k}-\dfrac{1}{k+1}\right)$.

Gọi $S_n=\dfrac{1}{1}+\dfrac{1}{1+2}+\dots+\dfrac{1}{1+2+\dots+n}$.

$S_n=2\left[\left(1-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\dots+\left(\dfrac{1}{n}-\dfrac{1}{n+1}\right)\right]=2\left(1-\dfrac{1}{n+1}\right)$.

Do đó $L=\lim2\left(1-\dfrac{1}{n+1}\right)=2$.

Vậy $L=2$.

Chọn C.

### Câu 26 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính $I=\lim_{n\to+\infty}\left[n\left(\sqrt{n^2+2}-\sqrt{n^2-1}\right)\right]$.
A. $I=+\infty$.
B. $I=\dfrac{3}{2}$.
C. $I=1{,}499$.
D. $I=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dạng $\infty\cdot0$ có hiệu hai căn nên nhân liên hợp để đưa về dạng $\dfrac{\infty}{\infty}$.

**Bước 1.** Nhân và chia hiệu hai căn với tổng hai căn để bỏ căn ở tử.

**Bước 2.** Rút gọn tử thành hằng số rồi nhân với $n$ để nhận ra phân thức có tử và mẫu cùng bậc.

**Bước 3.** Chia tử và mẫu cho $n$ rồi tính giới hạn bằng $\lim\dfrac{1}{n^2}=0$.

**Phần 2. Trình bày**

$n\left(\sqrt{n^2+2}-\sqrt{n^2-1}\right)=\dfrac{n\left[(n^2+2)-(n^2-1)\right]}{\sqrt{n^2+2}+\sqrt{n^2-1}}=\dfrac{3n}{\sqrt{n^2+2}+\sqrt{n^2-1}}$.

Chia tử và mẫu cho $n$:

$=\dfrac{3}{\sqrt{1+\dfrac{2}{n^2}}+\sqrt{1-\dfrac{1}{n^2}}}$.

Suy ra $I=\dfrac{3}{1+1}=\dfrac{3}{2}$.

Vậy $I=\dfrac{3}{2}$.

Chọn B.

### Câu 27 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Tính $\lim_{n\to+\infty}n\left(\sqrt{4n^2+3}-\sqrt[3]{8n^3+n}\right)$.
A. $+\infty$.
B. $1$.
C. $-\infty$.
D. $\dfrac{2}{3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tách thành hai nhóm mỗi nhóm một căn, cùng trừ đi $2n$ rồi nhân liên hợp phù hợp (căn bậc hai và căn bậc ba).

**Bước 1.** Thêm bớt $2n$ để tách biểu thức thành hai hiệu, mỗi hiệu chỉ chứa một căn.

**Bước 2.** Với nhóm căn bậc hai nhân liên hợp bằng tổng hai số hạng, với nhóm căn bậc ba dùng hằng đẳng thức $a^3-b^3$.

**Bước 3.** Chia tử và mẫu của từng nhóm cho luỹ thừa cao nhất của $n$ rồi tính giới hạn.

**Bước 4.** Cộng hai giới hạn thu được.

**Phần 2. Trình bày**

$n\left(\sqrt{4n^2+3}-\sqrt[3]{8n^3+n}\right)=n\left(\sqrt{4n^2+3}-2n\right)+n\left(2n-\sqrt[3]{8n^3+n}\right)$.

Nhóm thứ nhất: $n\left(\sqrt{4n^2+3}-2n\right)=\dfrac{3n}{\sqrt{4n^2+3}+2n}=\dfrac{3}{\sqrt{4+\dfrac{3}{n^2}}+2}\to\dfrac{3}{4}$.

Nhóm thứ hai: đặt $b=\sqrt[3]{8n^3+n}$ thì $2n-b=\dfrac{(2n)^3-b^3}{4n^2+2nb+b^2}=\dfrac{-n}{4n^2+2nb+b^2}$.

Do đó $n\left(2n-b\right)=\dfrac{-n^2}{4n^2+2nb+b^2}=\dfrac{-1}{4+2\dfrac{b}{n}+\dfrac{b^2}{n^2}}$.

Vì $\dfrac{b}{n}=\sqrt[3]{8+\dfrac{1}{n^2}}\to2$ nên nhóm thứ hai có giới hạn $\dfrac{-1}{4+4+4}=-\dfrac{1}{12}$.

Vậy giới hạn bằng $\dfrac{3}{4}-\dfrac{1}{12}=\dfrac{2}{3}$.

Chọn D.

### Câu 28 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Có bao nhiêu giá trị nguyên của tham số $a\in(0;20)$ sao cho $\lim_{n\to+\infty}\left(\sqrt{3+\dfrac{an^2-1}{3+n^2}}-\dfrac{1}{2^n}\right)$ là một số nguyên.
A. $4$.
B. $1$.
C. $2$.
D. $3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính giới hạn theo $a$ trước (căn của một biểu thức có giới hạn), rồi lập điều kiện để căn đó là số nguyên.

**Bước 1.** Tìm giới hạn của phân thức bên trong căn bằng cách chia tử và mẫu cho $n^2$.

**Bước 2.** Dùng giới hạn của căn và giới hạn của $\dfrac{1}{2^n}$ để viết giá trị giới hạn dưới dạng căn của biểu thức theo $a$.

**Bước 3.** Lập điều kiện để căn là số nguyên, tức biểu thức dưới căn là số chính phương, rồi liệt kê trên khoảng đã cho.

**Phần 2. Trình bày**

$\dfrac{an^2-1}{3+n^2}=\dfrac{a-\dfrac{1}{n^2}}{\dfrac{3}{n^2}+1}\to a$, và $\lim\dfrac{1}{2^n}=0$.

Do đó giới hạn bằng $\sqrt{3+a}$ (với $a>0$ nên $3+a>0$).

Giới hạn là số nguyên khi $3+a$ là số chính phương.

Vì $a$ nguyên, $0<a<20$ nên $4\le3+a\le22$.

Các số chính phương trong đoạn đó: $4$, $9$, $16$, ứng với $a=1$, $a=6$, $a=13$.

Vậy có $3$ giá trị của $a$.

Chọn D.

### Câu 29 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho số thực $a$ thỏa mãn $\lim_{x\to+\infty}\dfrac{a\sqrt{2x^2+3}+2017}{2x+2018}=\dfrac{1}{2}$. Khi đó giá trị của $a$ là
A. $a=\dfrac{\sqrt{2}}{2}$.
B. $a=\dfrac{-\sqrt{2}}{2}$.
C. $a=\dfrac{1}{2}$.
D. $a=-\dfrac{1}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu đều có bậc tương đương với $x$ khi $x\to+\infty$ nên chia cả tử và mẫu cho $x$ rồi cho giới hạn bằng $\dfrac{1}{2}$.

**Bước 1.** Vì $x>0$ nên đưa $x$ ra khỏi căn bằng cách viết $\sqrt{2x^2+3}=x\sqrt{2+\dfrac{3}{x^2}}$.

**Bước 2.** Chia cả tử và mẫu cho $x$ và dùng $\lim\dfrac{1}{x}=0$ để tính giới hạn theo $a$.

**Bước 3.** Cho giới hạn theo $a$ bằng $\dfrac{1}{2}$ rồi giải phương trình ẩn $a$.

**Phần 2. Trình bày**

Với $x>0$: $\sqrt{2x^2+3}=x\sqrt{2+\dfrac{3}{x^2}}$.

Chia tử và mẫu cho $x$:

$\dfrac{a\sqrt{2x^2+3}+2017}{2x+2018}=\dfrac{a\sqrt{2+\dfrac{3}{x^2}}+\dfrac{2017}{x}}{2+\dfrac{2018}{x}}\to\dfrac{a\sqrt{2}}{2}$.

Theo đề $\dfrac{a\sqrt{2}}{2}=\dfrac{1}{2}$, suy ra $a=\dfrac{1}{\sqrt{2}}=\dfrac{\sqrt{2}}{2}$.

Vậy $a=\dfrac{\sqrt{2}}{2}$.

Chọn A.

### Câu 30 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Tìm giới hạn $I=\lim_{x\to+\infty}\left(x+1-\sqrt{x^2-x+2}\right)$.
A. $I=\dfrac{1}{2}$.
B. $I=\dfrac{46}{31}$.
C. $I=\dfrac{17}{11}$.
D. $I=\dfrac{3}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dạng $\infty-\infty$ có một căn nên nhân với biểu thức liên hợp, rồi chia tử và mẫu cho $x$.

**Bước 1.** Nhân và chia với $x+1+\sqrt{x^2-x+2}$ để tử trở thành hiệu hai bình phương.

**Bước 2.** Rút gọn tử về đa thức bậc nhất, nhận ra phân thức có tử và mẫu cùng bậc theo $x$.

**Bước 3.** Chia tử và mẫu cho $x$ với $x>0$ và dùng $\lim\dfrac{1}{x}=0$ để tính giới hạn.

**Phần 2. Trình bày**

$x+1-\sqrt{x^2-x+2}=\dfrac{(x+1)^2-(x^2-x+2)}{x+1+\sqrt{x^2-x+2}}=\dfrac{3x-1}{x+1+\sqrt{x^2-x+2}}$.

Với $x>0$, chia tử và mẫu cho $x$:

$=\dfrac{3-\dfrac{1}{x}}{1+\dfrac{1}{x}+\sqrt{1-\dfrac{1}{x}+\dfrac{2}{x^2}}}$.

Suy ra $I=\dfrac{3}{1+1}=\dfrac{3}{2}$.

Vậy $I=\dfrac{3}{2}$.

Chọn D.

### Câu 31 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Giới hạn $\lim_{x\to3}\dfrac{\sqrt{x+1}-\sqrt[3]{x+5}}{x-3}$ bằng
A. $0$.
B. $\dfrac{1}{2}$.
C. $\dfrac{1}{3}$.
D. $\dfrac{1}{6}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dạng $\dfrac{0}{0}$ chứa hai căn khác bậc nên tách bằng cách trừ và cộng cùng một hằng số, rồi nhân liên hợp riêng từng căn.

**Bước 1.** Thay $x=3$ để tìm giá trị mà mỗi căn tiến tới, từ đó chọn hằng số để thêm bớt.

**Bước 2.** Tách tử thành hai hiệu, mỗi hiệu chứa một căn, rồi tách phân thức thành hai phân thức.

**Bước 3.** Với căn bậc hai nhân liên hợp, với căn bậc ba dùng hằng đẳng thức hiệu hai lập phương để triệt nhân tử $x-3$.

**Bước 4.** Tính giới hạn của từng phân thức rồi trừ hai kết quả.

**Phần 2. Trình bày**

Khi $x=3$: $\sqrt{x+1}=2$ và $\sqrt[3]{x+5}=2$, nên

$\dfrac{\sqrt{x+1}-\sqrt[3]{x+5}}{x-3}=\dfrac{\sqrt{x+1}-2}{x-3}-\dfrac{\sqrt[3]{x+5}-2}{x-3}$.

$\dfrac{\sqrt{x+1}-2}{x-3}=\dfrac{(x+1)-4}{(x-3)\left(\sqrt{x+1}+2\right)}=\dfrac{1}{\sqrt{x+1}+2}\to\dfrac{1}{4}$.

$\dfrac{\sqrt[3]{x+5}-2}{x-3}=\dfrac{(x+5)-8}{(x-3)\left(\sqrt[3]{(x+5)^2}+2\sqrt[3]{x+5}+4\right)}=\dfrac{1}{\sqrt[3]{(x+5)^2}+2\sqrt[3]{x+5}+4}\to\dfrac{1}{12}$.

Do đó giới hạn bằng $\dfrac{1}{4}-\dfrac{1}{12}=\dfrac{1}{6}$.

Vậy giới hạn bằng $\dfrac{1}{6}$.

Chọn D.

### Câu 32 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính $\lim_{x\to a^{505}}\dfrac{x^4-a^{2020}}{x-a^{505}}$.
A. $2a^{2010}$.
B. $4a^{1515}$.
C. $+\infty$.
D. $4a^{505}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhận ra $a^{2020}$ là luỹ thừa bậc bốn của $a^{505}$ nên tử là hiệu hai luỹ thừa bậc bốn và phân tích được nhân tử chung với mẫu.

**Bước 1.** Đặt $b=a^{505}$ để viết lại tử và mẫu gọn hơn, chú ý $a^{2020}=\left(a^{505}\right)^4$.

**Bước 2.** Phân tích $x^4-b^4$ bằng hằng đẳng thức hiệu hai bình phương hai lần để xuất hiện nhân tử $x-b$.

**Bước 3.** Rút gọn nhân tử chung (vì $x\ne b$) rồi thay $x=b$ và đổi $b$ ngược về $a$.

**Phần 2. Trình bày**

Đặt $b=a^{505}$, khi đó $a^{2020}=b^4$ và $x\to b$.

Với $x\ne b$: $\dfrac{x^4-b^4}{x-b}=\dfrac{(x-b)(x+b)\left(x^2+b^2\right)}{x-b}=(x+b)\left(x^2+b^2\right)$.

Suy ra giới hạn bằng $(b+b)\left(b^2+b^2\right)=4b^3$.

Mà $b^3=\left(a^{505}\right)^3=a^{1515}$ nên giới hạn bằng $4a^{1515}$.

Vậy giới hạn bằng $4a^{1515}$.

Chọn B.

### Câu 33 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Tìm tất cả các giá trị của tham số thực $m$ sao cho hàm số $f(x)=\begin{cases}2\sqrt{x}-m & \text{khi } x\ge0 \\ mx+2 & \text{khi } x<0\end{cases}$ liên tục trên $\mathbb{R}$.
A. $m=2$.
B. $m=\pm2$.
C. $m=-2$.
D. $m=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi nhánh liên tục trên khoảng của nó nên điều kiện duy nhất là liên tục tại điểm nối $x=0$.

**Bước 1.** Nêu rõ các nhánh $2\sqrt{x}-m$ và $mx+2$ liên tục trên khoảng tương ứng với mọi $m$.

**Bước 2.** Tính $f(0)$ từ nhánh $x\ge0$ và giới hạn trái tại $x=0$ từ nhánh $x<0$.

**Bước 3.** Cho giới hạn trái bằng $f(0)$ rồi giải phương trình tìm $m$.

**Phần 2. Trình bày**

Với $x>0$, $f(x)=2\sqrt{x}-m$ liên tục; với $x<0$, $f(x)=mx+2$ liên tục.

Tại $x=0$: $f(0)=2\sqrt{0}-m=-m$.

$\lim_{x\to0^+}f(x)=\lim_{x\to0^+}\left(2\sqrt{x}-m\right)=-m$.

$\lim_{x\to0^-}f(x)=\lim_{x\to0^-}(mx+2)=2$.

$f$ liên tục tại $0$ khi $-m=2$, tức là $m=-2$.

Vậy $m=-2$.

Chọn C.

### Câu 34 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tìm tất cả các giá trị của $m$ để hàm số $f(x)=\begin{cases}\dfrac{\sqrt{1-x}-\sqrt{1+x}}{x} & \text{khi } x<0 \\ m+\dfrac{1-x}{1+x} & \text{khi } x\ge0\end{cases}$ liên tục tại $x=0$.
A. $m=1$.
B. $m=-2$.
C. $m=-1$.
D. $m=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** liên tục tại $x=0$ nghĩa là giới hạn trái bằng $f(0)$; giới hạn trái cần nhân liên hợp vì có dạng $\dfrac{0}{0}$.

**Bước 1.** Tính $f(0)$ bằng nhánh $x\ge0$ và nhận ra nhánh này liên tục bên phải tại $0$.

**Bước 2.** Nhân tử và mẫu của nhánh $x<0$ với tổng hai căn để bỏ căn ở tử.

**Bước 3.** Rút gọn nhân tử $x$, tính giới hạn trái rồi lập phương trình ẩn $m$ để giới hạn trái bằng $f(0)$.

**Phần 2. Trình bày**

Tại $x=0$: $f(0)=m+\dfrac{1-0}{1+0}=m+1$ và $\lim_{x\to0^+}f(x)=m+1$.

Với $x<0$:

$\dfrac{\sqrt{1-x}-\sqrt{1+x}}{x}=\dfrac{(1-x)-(1+x)}{x\left(\sqrt{1-x}+\sqrt{1+x}\right)}=\dfrac{-2}{\sqrt{1-x}+\sqrt{1+x}}$.

Do đó $\lim_{x\to0^-}f(x)=\dfrac{-2}{1+1}=-1$.

$f$ liên tục tại $0$ khi $m+1=-1$, tức là $m=-2$.

Vậy $m=-2$.

Chọn B.

### Câu 35 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho hàm số $f(x)=\begin{cases}3x+a-1 & \text{khi } x\le0 \\ \dfrac{\sqrt{1+2x}-1}{x} & \text{khi } x>0\end{cases}$. Tìm tất cả các giá trị của $a$ để hàm số đã cho liên tục tại điểm $x=0$.
A. $a=1$.
B. $a=3$.
C. $a=2$.
D. $a=4$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** liên tục tại $x=0$ nên cần giới hạn phải bằng $f(0)$, trong đó giới hạn phải có dạng $\dfrac{0}{0}$ chứa căn.

**Bước 1.** Tính $f(0)$ và giới hạn trái từ nhánh $x\le0$, đều theo $a$.

**Bước 2.** Nhân tử và mẫu của nhánh $x>0$ với biểu thức liên hợp của tử để khử dạng vô định.

**Bước 3.** Tính giới hạn phải rồi cho nó bằng $f(0)$ để tìm $a$.

**Phần 2. Trình bày**

Tại $x=0$: $f(0)=a-1$ và $\lim_{x\to0^-}f(x)=\lim_{x\to0^-}(3x+a-1)=a-1$.

Với $x>0$: $\dfrac{\sqrt{1+2x}-1}{x}=\dfrac{2x}{x\left(\sqrt{1+2x}+1\right)}=\dfrac{2}{\sqrt{1+2x}+1}$.

Do đó $\lim_{x\to0^+}f(x)=\dfrac{2}{1+1}=1$.

$f$ liên tục tại $0$ khi $a-1=1$, tức là $a=2$.

Vậy $a=2$.

Chọn C.

### Câu 36 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho $a,b$ là hai số thực sao cho hàm số $f(x)=\begin{cases}\dfrac{x^2+ax+b}{x-1} & x\ne1 \\ 2ax-1 & x=1\end{cases}$ liên tục trên $\mathbb{R}$. Tính $a-b$.
A. $0$.
B. $-1$.
C. $-5$.
D. $7$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm liên tục trên $\mathbb{R}$ chỉ cần kiểm tra tại $x=1$; giới hạn hữu hạn của phân thức tại $1$ buộc tử phải chia hết cho $x-1$.

**Bước 1.** Nhận xét tại mọi $x\ne1$ hàm là phân thức xác định nên liên tục, chỉ còn điều kiện tại $x=1$.

**Bước 2.** Lập luận để giới hạn của phân thức tại $x=1$ hữu hạn thì tử phải triệt tiêu tại $x=1$, từ đó có một hệ thức giữa $a$ và $b$.

**Bước 3.** Phân tích tử thành $(x-1)(x+c)$, rút gọn để tính giới hạn theo $a$ và cho bằng $f(1)$.

**Bước 4.** Giải ra $a$ và $b$ rồi tính $a-b$.

**Phần 2. Trình bày**

Hàm liên tục trên $\mathbb{R}$ khi và chỉ khi $\lim_{x\to1}f(x)=f(1)=2a-1$.

Nếu $1+a+b\ne0$ thì tử tiến về số khác $0$, mẫu tiến về $0$, giới hạn không hữu hạn (không thể bằng $2a-1$). Vậy cần $1+a+b=0$, tức $b=-a-1$.

Khi đó $x^2+ax+b=x^2+ax-a-1=(x-1)(x+a+1)$.

Với $x\ne1$: $\dfrac{x^2+ax+b}{x-1}=x+a+1$, nên $\lim_{x\to1}f(x)=a+2$.

Liên tục khi $a+2=2a-1$, suy ra $a=3$ và $b=-4$.

Do đó $a-b=3-(-4)=7$.

Vậy $a-b=7$.

Chọn D.

### Câu 37 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Có bao nhiêu giá trị thực của tham số $m$ để hàm số $f(x)=\begin{cases}m^2x^2 & \text{khi } x\le2 \\ (1-m)x & \text{khi } x>2\end{cases}$ liên tục trên $\mathbb{R}$?
A. $0$.
B. $2$.
C. $3$.
D. $4$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai nhánh đều là đa thức nên liên tục trên khoảng của chúng, chỉ cần hai nhánh khớp nhau tại điểm nối $x=2$.

**Bước 1.** Nêu các nhánh $m^2x^2$ và $(1-m)x$ là đa thức nên liên tục trên khoảng tương ứng với mọi $m$.

**Bước 2.** Tính $f(2)$ cùng giới hạn trái, giới hạn phải tại $x=2$ theo $m$.

**Bước 3.** Cho giới hạn phải bằng $f(2)$ để được phương trình bậc hai ẩn $m$, giải rồi đếm nghiệm thực.

**Phần 2. Trình bày**

Với $x<2$ hoặc $x>2$, $f$ là đa thức nên liên tục.

Tại $x=2$: $f(2)=m^2\cdot2^2=4m^2$ và $\lim_{x\to2^-}f(x)=4m^2$.

$\lim_{x\to2^+}f(x)=(1-m)\cdot2=2-2m$.

$f$ liên tục tại $2$ khi $4m^2=2-2m$, tức là $2m^2+m-1=0$.

Phương trình tương đương $(2m-1)(m+1)=0$, suy ra $m=\dfrac{1}{2}$ hoặc $m=-1$.

Vậy có $2$ giá trị của $m$.

Chọn B.

### Câu 38 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho hàm số $y=f(x)=\begin{cases}\dfrac{\left|2x^2-7x+6\right|}{x-2} & \text{khi } x<2 \\ a+\dfrac{1-x}{2+x} & \text{khi } x\ge2\end{cases}$. Biết $a$ là giá trị để hàm số $f(x)$ liên tục tại $x_0=2$, tìm số nghiệm nguyên của bất phương trình $-x^2+ax+\dfrac{7}{4}>0$.
A. $1$.
B. $4$.
C. $3$.
D. $2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm $a$ từ điều kiện liên tục tại $x=2$ (cần bỏ dấu giá trị tuyệt đối ở nhánh $x<2$), rồi giải bất phương trình bậc hai theo $a$ vừa tìm.

**Bước 1.** Phân tích $2x^2-7x+6$ thành nhân tử và xét dấu của nó khi $x$ nhỏ hơn $2$ gần $2$ để bỏ dấu giá trị tuyệt đối.

**Bước 2.** Rút gọn nhánh $x<2$ để tính giới hạn trái tại $x=2$, và tính $f(2)$ theo $a$ từ nhánh $x\ge2$.

**Bước 3.** Cho giới hạn trái bằng $f(2)$ để tìm $a$.

**Bước 4.** Thay $a$ vào bất phương trình, quy đồng về bậc hai, giải rồi liệt kê các số nguyên thuộc tập nghiệm.

**Phần 2. Trình bày**

$2x^2-7x+6=(x-2)(2x-3)$.

Khi $x\to2^-$ ta có $x>\dfrac{3}{2}$ nên $2x-3>0$ và $x-2<0$, do đó $2x^2-7x+6<0$ và $\left|2x^2-7x+6\right|=-(x-2)(2x-3)$.

Suy ra với $x<2$ gần $2$: $f(x)=\dfrac{-(x-2)(2x-3)}{x-2}=-(2x-3)$, nên $\lim_{x\to2^-}f(x)=-1$.

$f(2)=a+\dfrac{1-2}{2+2}=a-\dfrac{1}{4}$ và $\lim_{x\to2^+}f(x)=a-\dfrac{1}{4}$.

Liên tục tại $2$ khi $a-\dfrac{1}{4}=-1$, suy ra $a=-\dfrac{3}{4}$.

Bất phương trình trở thành $-x^2-\dfrac{3}{4}x+\dfrac{7}{4}>0$.

Nhân hai vế với $-4$ (đổi chiều): $4x^2+3x-7<0$, tức là $(x-1)(4x+7)<0$.

Suy ra $-\dfrac{7}{4}<x<1$. Các số nguyên thoả mãn là $-1$ và $0$.

Vậy bất phương trình có $2$ nghiệm nguyên.

Chọn D.

## PHẦN 92 | Giới hạn, hàm số liên tục — Phần 3: Trả lời ngắn | tra_loi_ngan

### Câu 44 | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tính giới hạn sau $\lim_{x\to0}\dfrac{1+x+x^2+x^3}{1+x}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức xác định tại $x=0$ nên giới hạn bằng giá trị của hàm tại điểm đó.

**Bước 1.** Kiểm tra mẫu số tại $x=0$ khác $0$ để biết có thể thay trực tiếp.

**Bước 2.** Thay $x=0$ vào tử và mẫu rồi tính tỉ số.

**Bước 3.** Viết đáp số dưới dạng số nguyên để điền vào ô trả lời.

**Phần 2. Trình bày**

Hàm số xác định tại $x=0$ vì mẫu bằng $1\ne0$ nên liên tục tại đó.

$\lim_{x\to0}\dfrac{1+x+x^2+x^3}{1+x}=\dfrac{1+0+0+0}{1+0}=1$.

Vậy giới hạn bằng $1$.

### Câu 45 | kho=dai | loai=tra_loi_ngan | dap_an=-1,5
**Đề:** Tính giới hạn sau $\lim_{x\to-1}\dfrac{\sqrt{3x^2+1}-x}{x-1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm xác định và liên tục tại $x=-1$ nên thay trực tiếp, chú ý tính đúng căn và dấu.

**Bước 1.** Kiểm tra mẫu số tại $x=-1$ khác $0$ và biểu thức dưới căn dương để thay được.

**Bước 2.** Thay $x=-1$ vào tử, chú ý dấu của $-x$ khi $x$ âm, rồi chia cho mẫu.

**Bước 3.** Rút gọn phân số rồi đổi sang số thập phân để điền vào bốn ô trả lời.

**Phần 2. Trình bày**

Tại $x=-1$: mẫu $x-1=-2\ne0$ và $3x^2+1=4>0$ nên hàm liên tục tại đó.

$\lim_{x\to-1}\dfrac{\sqrt{3x^2+1}-x}{x-1}=\dfrac{\sqrt{3+1}-(-1)}{-1-1}=\dfrac{2+1}{-2}=-\dfrac{3}{2}$.

Vậy giới hạn bằng $-\dfrac{3}{2}=-1{,}5$.

### Câu 46 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn sau $\lim_{x\to-1}\dfrac{|x-1|}{x^4+x-3}$.
**Ghi chú:** đáp số $-\dfrac{2}{3}$ không viết gọn được trên 4 ô nên để tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm xác định tại $x=-1$ nên thay trực tiếp, chỉ cần tính giá trị tuyệt đối đúng.

**Bước 1.** Kiểm tra mẫu số tại $x=-1$ khác $0$ để biết có thể thay trực tiếp.

**Bước 2.** Tính $|x-1|$ tại $x=-1$ và giá trị của mẫu rồi lập tỉ số.

**Bước 3.** Rút gọn phân số thu được để viết kết quả cuối cùng.

**Phần 2. Trình bày**

Tại $x=-1$: $x^4+x-3=1-1-3=-3\ne0$ nên hàm liên tục tại $x=-1$.

$\lim_{x\to-1}\dfrac{|x-1|}{x^4+x-3}=\dfrac{|-1-1|}{(-1)^4+(-1)-3}=\dfrac{2}{-3}=-\dfrac{2}{3}$.

Vậy giới hạn bằng $-\dfrac{2}{3}$.

### Câu 47 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn sau $\lim_{x\to2}\dfrac{\sqrt{x^2-x+1}}{x-1}$.
**Ghi chú:** đáp số $\sqrt{3}$ không tô được trên 4 ô nên để tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm xác định và liên tục tại $x=2$ nên chỉ cần thay trực tiếp.

**Bước 1.** Kiểm tra biểu thức dưới căn dương và mẫu khác $0$ tại $x=2$.

**Bước 2.** Thay $x=2$ vào tử và mẫu rồi tính tỉ số.

**Bước 3.** Viết kết quả dưới dạng căn đã rút gọn.

**Phần 2. Trình bày**

Tại $x=2$: $x^2-x+1=3>0$ và mẫu $x-1=1\ne0$ nên hàm liên tục tại $x=2$.

$\lim_{x\to2}\dfrac{\sqrt{x^2-x+1}}{x-1}=\dfrac{\sqrt{4-2+1}}{2-1}=\sqrt{3}$.

Vậy giới hạn bằng $\sqrt{3}$.

### Câu 48 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn sau $\lim_{x\to1}\dfrac{\sqrt{x^2-2x+3}}{x+1}$.
**Ghi chú:** đáp số $\dfrac{\sqrt{2}}{2}$ không tô được trên 4 ô nên để tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm xác định và liên tục tại $x=1$ nên thay trực tiếp.

**Bước 1.** Kiểm tra biểu thức dưới căn dương và mẫu khác $0$ tại $x=1$.

**Bước 2.** Thay $x=1$ vào tử và mẫu rồi rút gọn kết quả.

**Bước 3.** Trục căn thức ở mẫu nếu cần để viết kết quả gọn nhất.

**Phần 2. Trình bày**

Tại $x=1$: $x^2-2x+3=2>0$ và mẫu $x+1=2\ne0$ nên hàm liên tục tại $x=1$.

$\lim_{x\to1}\dfrac{\sqrt{x^2-2x+3}}{x+1}=\dfrac{\sqrt{1-2+3}}{1+1}=\dfrac{\sqrt{2}}{2}$.

Vậy giới hạn bằng $\dfrac{\sqrt{2}}{2}$.

### Câu 49 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một cái hồ chứa $600$ l nước ngọt. Người ta bơm nước biển có nồng độ $30$ g/l vào hồ với tốc độ $15$ l/phút.
a) Tính nồng độ muối của nước hồ sau $t$ phút kể từ khi bắt đầu bơm.
b) Nồng độ muối trong hồ sẽ thế nào khi $t$ dần hướng về vô cùng.
**Ghi chú:** giả thiết muối tan và trộn đều, hồ không bị tràn hay rút nước; $t\ge0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nồng độ bằng lượng muối chia cho thể tích nước; lập cả hai đại lượng theo $t$ rồi tính giới hạn khi $t\to+\infty$.

**Bước 1.** Ý a: tính thể tích nước trong hồ sau $t$ phút gồm nước ngọt ban đầu và nước biển đã bơm vào.

**Bước 2.** Ý a: tính khối lượng muối đã đưa vào hồ từ nồng độ và lượng nước biển bơm, rồi lập tỉ số để có nồng độ theo $t$.

**Bước 3.** Ý b: chia tử và mẫu của hàm nồng độ cho $t$ rồi dùng $\lim\dfrac{1}{t}=0$ để tính giới hạn.

**Bước 4.** Ý b: nêu ý nghĩa thực tế của kết quả đối với nước trong hồ.

**Phần 2. Trình bày**

a) Sau $t$ phút lượng nước biển bơm vào là $15t$ lít nên thể tích nước trong hồ là $600+15t$ lít.

Lượng muối trong hồ là $30\cdot15t=450t$ gam.

Nồng độ muối sau $t$ phút: $C(t)=\dfrac{450t}{600+15t}=\dfrac{30t}{40+t}$ (g/l).

b) $\lim_{t\to+\infty}C(t)=\lim_{t\to+\infty}\dfrac{30}{\dfrac{40}{t}+1}=\dfrac{30}{0+1}=30$.

Vậy $C(t)=\dfrac{30t}{40+t}$ g/l; khi $t\to+\infty$ nồng độ muối trong hồ tiến dần tới $30$ g/l, bằng nồng độ nước biển được bơm vào.

### Câu 50 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Xét tính liên tục của hàm số $f(x)=\begin{cases}\dfrac{x+3}{x-1} & \text{khi } x\ne1 \\ -1 & \text{khi } x=1\end{cases}$ tại $x=-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=-1$ hàm lấy công thức của nhánh $x\ne1$, nên so sánh giá trị hàm với giới hạn của phân thức tại điểm đó.

**Bước 1.** Xác định nhánh công thức áp dụng tại $x=-1$ để tính $f(-1)$.

**Bước 2.** Tính giới hạn của hàm tại $x=-1$ bằng cách thay trực tiếp vì phân thức xác định tại đó.

**Bước 3.** So sánh giới hạn với $f(-1)$ rồi kết luận về tính liên tục.

**Phần 2. Trình bày**

Vì $-1\ne1$ nên $f(-1)=\dfrac{-1+3}{-1-1}=\dfrac{2}{-2}=-1$.

Phân thức $\dfrac{x+3}{x-1}$ xác định tại $x=-1$ nên $\lim_{x\to-1}f(x)=\lim_{x\to-1}\dfrac{x+3}{x-1}=-1$.

Vì $\lim_{x\to-1}f(x)=f(-1)=-1$ nên hàm số liên tục tại $x=-1$.

Vậy $f$ liên tục tại $x=-1$.

### Câu 51 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Xét tính liên tục của hàm số $f(x)=\begin{cases}\dfrac{\sqrt{x+3}-2}{x-1} & \text{khi } x\ne1 \\ \dfrac{1}{4} & \text{khi } x=1\end{cases}$ tại $x=1$.
**Ghi chú:** nhãn in trên đề là "Câu 351", đánh lại là Câu 51 theo thứ tự.

**Phần 1. Hướng dẫn**

**Mấu chốt:** điểm xét là điểm đổi công thức nên cần so sánh giới hạn của nhánh $x\ne1$ (dạng $\dfrac{0}{0}$) với giá trị $f(1)$.

**Bước 1.** Đọc giá trị $f(1)$ từ nhánh áp dụng khi $x=1$ trong công thức hàm số.

**Bước 2.** Nhận ra giới hạn của nhánh $x\ne1$ có dạng $\dfrac{0}{0}$ chứa căn nên nhân với biểu thức liên hợp của tử.

**Bước 3.** Rút gọn nhân tử $x-1$, tính giới hạn rồi so với $f(1)$ để kết luận.

**Phần 2. Trình bày**

Ta có $f(1)=\dfrac{1}{4}$.

Với $x\ne1$: $\dfrac{\sqrt{x+3}-2}{x-1}=\dfrac{(x+3)-4}{(x-1)\left(\sqrt{x+3}+2\right)}=\dfrac{1}{\sqrt{x+3}+2}$.

Do đó $\lim_{x\to1}f(x)=\dfrac{1}{\sqrt{4}+2}=\dfrac{1}{4}$.

Vì $\lim_{x\to1}f(x)=f(1)=\dfrac{1}{4}$ nên hàm số liên tục tại $x=1$.

Vậy $f$ liên tục tại $x=1$.

### Câu 52 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Xét tính liên tục của hàm số $f(x)=\begin{cases}\dfrac{x-5}{\sqrt{2x-1}-3} & \text{khi } x>5 \\ (x-5)^2+3 & \text{khi } x\le5\end{cases}$ tại $x=5$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=5$ hai nhánh khác công thức nên cần so sánh giới hạn trái, giới hạn phải và $f(5)$.

**Bước 1.** Tính $f(5)$ và giới hạn trái từ nhánh $x\le5$ (đa thức).

**Bước 2.** Nhận ra nhánh $x>5$ có dạng $\dfrac{0}{0}$ chứa căn ở mẫu nên nhân với biểu thức liên hợp của mẫu.

**Bước 3.** Rút gọn nhân tử $x-5$, tính giới hạn phải rồi so sánh ba đại lượng để kết luận.

**Phần 2. Trình bày**

$f(5)=(5-5)^2+3=3$ và $\lim_{x\to5^-}f(x)=\lim_{x\to5^-}\left[(x-5)^2+3\right]=3$.

Với $x>5$: $\dfrac{x-5}{\sqrt{2x-1}-3}=\dfrac{(x-5)\left(\sqrt{2x-1}+3\right)}{(2x-1)-9}=\dfrac{(x-5)\left(\sqrt{2x-1}+3\right)}{2(x-5)}=\dfrac{\sqrt{2x-1}+3}{2}$.

Do đó $\lim_{x\to5^+}f(x)=\dfrac{\sqrt{9}+3}{2}=3$.

Vì $\lim_{x\to5^-}f(x)=\lim_{x\to5^+}f(x)=f(5)=3$ nên hàm số liên tục tại $x=5$.

Vậy $f$ liên tục tại $x=5$.

### Câu 53 | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tìm $m$ để hàm số $f(x)=\begin{cases}x^2 & \text{khi } x<1 \\ 2mx-3 & \text{khi } x\ge1\end{cases}$ liên tục tại $x=1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai nhánh đều là đa thức nên hàm liên tục tại $x=1$ khi giá trị hai nhánh khớp nhau tại điểm nối.

**Bước 1.** Tính $f(1)$ và giới hạn phải từ nhánh $x\ge1$, đều theo $m$.

**Bước 2.** Tính giới hạn trái từ nhánh $x<1$.

**Bước 3.** Cho giới hạn trái bằng $f(1)$ rồi giải phương trình ẩn $m$.

**Phần 2. Trình bày**

$f(1)=2m\cdot1-3=2m-3$ và $\lim_{x\to1^+}f(x)=2m-3$.

$\lim_{x\to1^-}f(x)=\lim_{x\to1^-}x^2=1$.

$f$ liên tục tại $x=1$ khi $2m-3=1$, tức là $m=2$.

Vậy $m=2$.

### Câu 54 | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tìm $m$ để hàm số $f(x)=\begin{cases}\dfrac{x^3-x^2+2x-2}{x-1} & \text{khi } x\ne1 \\ 3x+m & \text{khi } x=1\end{cases}$ liên tục tại $x=1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giới hạn của nhánh $x\ne1$ có dạng $\dfrac{0}{0}$ nên phân tích tử thành nhân tử chứa $x-1$, rồi cho giới hạn bằng $f(1)$.

**Bước 1.** Thử $x=1$ vào tử để nhận ra dạng vô định và gợi ý nhân tử chung $x-1$.

**Bước 2.** Nhóm hạng tử của tử để đặt nhân tử chung $x-1$, rút gọn rồi tính giới hạn.

**Bước 3.** Tính $f(1)$ theo $m$, cho bằng giới hạn vừa tìm rồi giải $m$.

**Phần 2. Trình bày**

Với $x\ne1$: $x^3-x^2+2x-2=x^2(x-1)+2(x-1)=(x-1)\left(x^2+2\right)$.

Do đó $\dfrac{x^3-x^2+2x-2}{x-1}=x^2+2$ và $\lim_{x\to1}f(x)=1+2=3$.

$f(1)=3\cdot1+m=3+m$.

$f$ liên tục tại $x=1$ khi $3+m=3$, tức là $m=0$.

Vậy $m=0$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phần 2 (Đúng/Sai) của đề không có trong bản in: sau Câu 38 đề nhảy sang "Phần 3: Trả lời ngắn" và đánh số tiếp từ Câu 44 (không có Câu 39–43 trong ảnh trang 33–36).
- Câu 23 (Phần 1): đề sai, hai phương án C và D cùng đúng; chọn D (đầy đủ nhất). Cần CEO xem nếu muốn chọn C.
- Câu 24: đọc đề là $\sqrt{16^{n+1}+4^n}-\sqrt{16^{n+1}+3^n}$ (phóng to trang 34 xác nhận); kết quả $\dfrac{1}{8}$ khớp phương án C.
- Câu 28: hiểu $a$ nguyên trong $(0;20)$; $3+a$ là số chính phương cho $a=1,6,13$.
- Câu 38: dấu giá trị tuyệt đối ở nhánh $x<2$ đọc theo ảnh phóng to; $a=-\dfrac{3}{4}$, hai nghiệm nguyên $-1$ và $0$.
- Câu 51: nhãn in "Câu 351" đánh lại là Câu 51.
- Câu 46, 47, 48: đáp số không tô được trên 4 ô nên xếp tự luận; Câu 49–52 là tự luận (không có đáp số một số). Câu 44, 45, 53, 54 là trả lời ngắn.
- Không có câu dùng L'Hôpital, đạo hàm hay kiến thức ngoài phạm vi; không có hình đề hay hình giải.
