# ĐỀ | Đề cương ôn tập học kì I Toán 11 năm 2026–2027 — Trường THPT Yên Hòa, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 7 | Chương 5 — A. Trắc nghiệm khách quan | trac_nghiem

### Câu 32 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho hàm số $f(x)=\begin{cases} \dfrac{\sqrt{x+4}-2}{x} & \text{khi } x>0 \\ mx+m+\dfrac{1}{4} & \text{khi } x\le 0 \end{cases}$, $m$ là tham số. Tìm giá trị của $m$ để hàm số có giới hạn tại $x=0$.
A. $m=\dfrac{1}{2}$.
B. $m=1$.
C. $m=0$.
D. $m=-\dfrac{1}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số có giới hạn tại $x=0$ khi và chỉ khi giới hạn bên phải và giới hạn bên trái tại $0$ tồn tại và bằng nhau.

**Bước 1.** Tính giới hạn bên phải khi $x\to0^+$ bằng cách nhân cả tử và mẫu với biểu thức liên hợp của tử để khử dạng vô định $\dfrac{0}{0}$.

**Bước 2.** Tính giới hạn bên trái khi $x\to0^-$: ở nhánh này hàm là đa thức bậc nhất theo $x$ nên thay thẳng $x=0$, kết quả chứa tham số $m$.

**Bước 3.** Cho hai giới hạn một phía bằng nhau để lập phương trình ẩn $m$, giải ra $m$ rồi đối chiếu với các phương án.

**Phần 2. Trình bày**

Giới hạn bên phải:

$\lim\limits_{x\to0^+}f(x)=\lim\limits_{x\to0^+}\dfrac{\sqrt{x+4}-2}{x}$

$=\lim\limits_{x\to0^+}\dfrac{(x+4)-4}{x(\sqrt{x+4}+2)}$

$=\lim\limits_{x\to0^+}\dfrac{1}{\sqrt{x+4}+2}=\dfrac{1}{4}$

Giới hạn bên trái:

$\lim\limits_{x\to0^-}f(x)=\lim\limits_{x\to0^-}\left(mx+m+\dfrac{1}{4}\right)=m+\dfrac{1}{4}$

Hàm số có giới hạn tại $x=0$ khi và chỉ khi:

$m+\dfrac{1}{4}=\dfrac{1}{4}$

$m=0$

Vậy $m=0$.

Chọn C.

### Câu 33 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tính giới hạn $\lim\limits_{x\to-\infty}\left(2x^3-x^2+1\right)$
A. $+\infty$.
B. $-\infty$.
C. $2$.
D. $0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giới hạn của đa thức khi $x\to-\infty$ do hạng tử có bậc cao nhất quyết định, nên đặt luỹ thừa bậc cao nhất ra ngoài.

**Bước 1.** Nhận ra đây là giới hạn vô cực của đa thức, cần đặt luỹ thừa bậc cao nhất $x^3$ ra làm thừa số chung.

**Bước 2.** Tìm giới hạn của thừa số còn lại trong ngoặc, dùng $\lim\dfrac{1}{x^k}=0$ khi $x\to-\infty$.

**Bước 3.** Xét dấu của $x^3$ khi $x\to-\infty$ rồi dùng quy tắc nhân giới hạn vô cực với một số dương để kết luận.

**Phần 2. Trình bày**

$\lim\limits_{x\to-\infty}\left(2x^3-x^2+1\right)=\lim\limits_{x\to-\infty}x^3\left(2-\dfrac{1}{x}+\dfrac{1}{x^3}\right)$

Ta có $\lim\limits_{x\to-\infty}x^3=-\infty$ và $\lim\limits_{x\to-\infty}\left(2-\dfrac{1}{x}+\dfrac{1}{x^3}\right)=2>0$.

Vậy $\lim\limits_{x\to-\infty}\left(2x^3-x^2+1\right)=-\infty$.

Chọn B.

### Câu 34 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho hàm số $y=f(x)$ liên tục trên $(a;b)$. Điều kiện cần và đủ để hàm số liên tục trên $[a;b]$ là
A. $\lim\limits_{x\to a^+}f(x)=f(a)$ và $\lim\limits_{x\to b^+}f(x)=f(b)$.
B. $\lim\limits_{x\to a^-}f(x)=f(a)$ và $\lim\limits_{x\to b^-}f(x)=f(b)$.
C. $\lim\limits_{x\to a^+}f(x)=f(a)$ và $\lim\limits_{x\to b^-}f(x)=f(b)$.
D. $\lim\limits_{x\to a^-}f(x)=f(a)$ và $\lim\limits_{x\to b^+}f(x)=f(b)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục trên đoạn $[a;b]$ khi liên tục trên khoảng $(a;b)$ và liên tục một phía tại hai đầu mút, phía nằm trong đoạn.

**Bước 1.** Nhớ định nghĩa: hàm liên tục trên $[a;b]$ nếu liên tục trên $(a;b)$ và có điều kiện riêng ở hai đầu mút $a$, $b$.

**Bước 2.** Tại đầu mút $a$, xác định các giá trị $x$ thuộc đoạn $[a;b]$ nằm về phía nào của $a$ để biết cần dùng giới hạn bên phải hay bên trái.

**Bước 3.** Làm tương tự tại đầu mút $b$ rồi chọn phương án có cặp giới hạn một phía đúng ở cả hai đầu.

**Phần 2. Trình bày**

Hàm số $y=f(x)$ liên tục trên đoạn $[a;b]$ khi nó liên tục trên khoảng $(a;b)$ và liên tục phải tại $a$, liên tục trái tại $b$.

Tại $a$ các giá trị $x$ của đoạn $[a;b]$ đều lớn hơn $a$, nên điều kiện là $\lim\limits_{x\to a^+}f(x)=f(a)$.

Tại $b$ các giá trị $x$ của đoạn $[a;b]$ đều nhỏ hơn $b$, nên điều kiện là $\lim\limits_{x\to b^-}f(x)=f(b)$.

Chọn C.

### Câu 35 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho hàm số $f(x)$ xác định trên $[a;b]$. Tìm mệnh đề đúng.
A. Nếu hàm số $f(x)$ liên tục trên $[a;b]$ và $f(a)f(b)>0$ thì phương trình $f(x)=0$ không có nghiệm trong khoảng $(a;b)$.
B. Nếu $f(a)f(b)<0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm trong khoảng $(a;b)$.
C. Nếu hàm số $f(x)$ liên tục, tăng trên $[a;b]$ và $f(a)f(b)>0$ thì phương trình $f(x)=0$ không có nghiệm trong khoảng $(a;b)$.
D. Nếu phương trình $f(x)=0$ có nghiệm trong khoảng $(a;b)$ thì hàm số $f(x)$ phải liên tục trên $(a;b)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét từng mệnh đề với định lí giá trị trung gian (cần liên tục trên đoạn) và tìm phản ví dụ cho mệnh đề sai.

**Bước 1.** Với mệnh đề có điều kiện $f(a)f(b)>0$ nhưng chỉ có liên tục, thử một hàm bậc hai có hai nghiệm nằm giữa $a$ và $b$ để kiểm tra.

**Bước 2.** Với mệnh đề thiếu giả thiết liên tục, nhớ rằng định lí nghiệm chỉ áp dụng cho hàm liên tục, rồi nghĩ tới hàm có điểm gián đoạn.

**Bước 3.** Với mệnh đề có thêm giả thiết tăng, suy luận giá trị $f(x)$ nằm giữa $f(a)$ và $f(b)$ khi $x\in[a;b]$ và xét dấu của chúng.

**Bước 4.** Với mệnh đề cuối, tìm hàm có nghiệm nhưng không liên tục để xem điều kiện "phải liên tục" có bắt buộc không, rồi tổng hợp các nhận xét.

**Phần 2. Trình bày**

Phương án A sai. Xét $f(x)=x^2-1$ liên tục trên $[-2;2]$, có $f(-2)f(2)=3\cdot3=9>0$ nhưng phương trình $f(x)=0$ có hai nghiệm $x=\pm1$ thuộc $(-2;2)$.

Phương án B sai vì thiếu giả thiết $f$ liên tục. Ví dụ $f(x)=\begin{cases} -1 & \text{khi } x<0 \\ 1 & \text{khi } x\ge0 \end{cases}$ trên $[-1;1]$ có $f(-1)f(1)=-1<0$ nhưng phương trình $f(x)=0$ vô nghiệm.

Phương án C đúng. Vì $f$ tăng trên $[a;b]$ nên với mọi $x\in(a;b)$ ta có $f(a)<f(x)<f(b)$. Do $f(a)f(b)>0$ nên $f(a)$ và $f(b)$ cùng dấu: nếu cùng dương thì $f(x)>f(a)>0$, nếu cùng âm thì $f(x)<f(b)<0$. Vậy $f(x)\ne0$ với mọi $x\in(a;b)$.

Phương án D sai. Hàm $f(x)=\begin{cases} x-1 & \text{khi } x\ne\dfrac{3}{2} \\ 5 & \text{khi } x=\dfrac{3}{2} \end{cases}$ trên $[0;2]$ có nghiệm $x=1\in(0;2)$ nhưng gián đoạn tại $x=\dfrac{3}{2}$.

Vậy chỉ có phương án C đúng.

Chọn C.

### Câu 36 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho hàm số $y=f(x)$ liên tục trên đoạn $[a;b]$. Mệnh đề nào dưới đây đúng?
A. Nếu $f(a)\cdot f(b)>0$ thì phương trình $f(x)=0$ không có nghiệm nằm trong $(a;b)$.
B. Nếu $f(a)\cdot f(b)<0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm nằm trong $(a;b)$.
C. Nếu $f(a)\cdot f(b)>0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm nằm trong $(a;b)$.
D. Nếu phương trình $f(x)=0$ có ít nhất một nghiệm nằm trong $(a;b)$ thì $f(a)\cdot f(b)<0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** áp dụng đúng chiều của định lí giá trị trung gian: hàm liên tục trên $[a;b]$ và trái dấu ở hai đầu thì có nghiệm ở giữa, chiều ngược lại không đúng.

**Bước 1.** Nhắc lại định lí về nghiệm của hàm liên tục: giả thiết là $f$ liên tục trên $[a;b]$ và dấu của $f(a)f(b)$, kết luận là sự tồn tại nghiệm.

**Bước 2.** Với các mệnh đề dùng điều kiện $f(a)f(b)>0$, thử hàm bậc hai có hai nghiệm trong $(a;b)$ để xem kết luận có luôn đúng không.

**Bước 3.** Với mệnh đề đảo (có nghiệm thì tích âm), dùng cùng phản ví dụ bậc hai để kiểm tra rồi tổng hợp.

**Phần 2. Trình bày**

Xét hàm $f(x)=x^2-1$ liên tục trên $[-2;2]$: $f(-2)\cdot f(2)=9>0$, phương trình $f(x)=0$ có hai nghiệm $x=\pm1$ trong $(-2;2)$.

Do đó mệnh đề ở A và mệnh đề ở D đều sai vì không đúng với hàm này.

Mệnh đề ở C sai vì $f(x)=x^2+1$ liên tục trên $[-1;1]$, có $f(-1)\cdot f(1)=4>0$ nhưng phương trình $f(x)=0$ vô nghiệm.

Mệnh đề ở B chính là định lí về nghiệm của hàm số liên tục: $f$ liên tục trên $[a;b]$ và $f(a)\cdot f(b)<0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm trong $(a;b)$.

Vậy mệnh đề đúng là B.

Chọn B.

### Câu 37 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho đồ thị của hàm số $y=f(x)$ như hình vẽ sau. Chọn mệnh đề đúng.
A. Hàm số $y=f(x)$ có đạo hàm tại điểm $x=0$ nhưng không liên tục tại điểm $x=0$.
B. Hàm số $y=f(x)$ liên tục tại điểm $x=0$ nhưng không có đạo hàm tại điểm $x=0$.
C. Hàm số $y=f(x)$ liên tục và có đạo hàm tại điểm $x=0$.
D. Hàm số $y=f(x)$ liên tục và không có đạo hàm tại điểm $x=0$.
**Hình:** de_P7C37.png
**Ghi chú:** đề sai (hai phương án B và D cùng nói "liên tục và không có đạo hàm" nên cùng đúng); chọn B theo cách đề đặt. Đề hỏi cả khái niệm đạo hàm (học ở học kì II); lời giải chỉ xét liên tục bằng giới hạn một phía và nhận xét điểm gấp khúc của đồ thị, không tính đạo hàm.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục tại $x=0$ khi đồ thị liền nét tại điểm đó, còn tồn tại đạo hàm đòi hỏi đồ thị "trơn", không bị gấp khúc.

**Bước 1.** Đọc đồ thị quanh $x=0$: xác định giá trị $f(0)$ và giới hạn của $f(x)$ khi $x$ tiến tới $0$ từ bên trái và từ bên phải.

**Bước 2.** So sánh hai giới hạn một phía với $f(0)$ để kết luận hàm có liên tục tại $x=0$ hay không.

**Bước 3.** Quan sát hình dạng đồ thị tại $x=0$: hai nhánh gặp nhau có tạo thành điểm gấp khúc, hay nối trơn với nhau.

**Bước 4.** Kết hợp hai kết luận về tính liên tục và tính trơn của đồ thị để chọn phương án khớp.

**Phần 2. Trình bày**

Lưu ý: đề sai vì phương án B và D có cùng nội dung; ta chọn phương án B.

Từ đồ thị, nhánh bên trái ($x\le0$) là parabola $y=x^2$ đi qua gốc toạ độ, nhánh bên phải ($x>0$) là tia $y=x$ xuất phát từ gốc toạ độ.

$\lim\limits_{x\to0^-}f(x)=0$, $\lim\limits_{x\to0^+}f(x)=0$ và $f(0)=0$.

Do đó $\lim\limits_{x\to0}f(x)=f(0)$, hàm số liên tục tại $x=0$.

Tại gốc toạ độ, nhánh parabola tiếp xúc với trục hoành còn nhánh bên phải là tia nghiêng $45^\circ$, hai nhánh tạo thành điểm gấp khúc nên đồ thị không có tiếp tuyến duy nhất tại $x=0$.

Vậy hàm số liên tục tại $x=0$ nhưng không có đạo hàm tại $x=0$.

Chọn B.

### Câu 38 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Hình nào trong các hình dưới đây là đồ thị của hàm số không liên tục tại $x=1$?
A. Đồ thị hình A.
B. Đồ thị hình B.
C. Đồ thị hình C.
D. Đồ thị hình D.
**Hình:** de_P7C38.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục tại $x=1$ khi đồ thị là một nét liền không đứt đoạn khi đi qua hoành độ $x=1$.

**Bước 1.** Nhớ rằng hàm liên tục tại một điểm thì đồ thị "liền nét" tại hoành độ đó, tức hai nhánh trái và phải gặp nhau ở cùng một điểm.

**Bước 2.** Với mỗi hình, nhìn vị trí đường nét đứt tại $x=1$ và xem hai nhánh trái, phải có nối liền ở cùng độ cao không.

**Bước 3.** Chọn hình mà đồ thị bị đứt, tức hai nhánh dừng ở hai độ cao khác nhau tại $x=1$.

**Phần 2. Trình bày**

Hình A: hai nhánh gặp nhau tại điểm $(1;1)$, đồ thị liền nét nên hàm liên tục tại $x=1$.

Hình B: đồ thị là một parabola trơn, đi qua điểm $(1;1)$, liền nét nên hàm liên tục tại $x=1$.

Hình C: đồ thị là một đường thẳng đi qua điểm $(1;1)$, liền nét nên hàm liên tục tại $x=1$.

Hình D: nhánh bên trái kết thúc tại điểm $(1;1)$, nhánh bên phải bắt đầu tại điểm thấp hơn trục hoành ở hoành độ $x=1$, đồ thị bị đứt (có bước nhảy) nên hàm gián đoạn tại $x=1$.

Vậy hình D là đồ thị của hàm số không liên tục tại $x=1$.

Chọn D.

### Câu 39 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho các mệnh đề:
1. Nếu hàm số $y=f(x)$ liên tục trên $(a;b)$ và $f(a)\cdot f(b)<0$ thì tồn tại $x_0\in(a;b)$ sao cho $f(x_0)=0$.
2. Nếu hàm số $y=f(x)$ liên tục trên $[a;b]$ và $f(a)\cdot f(b)<0$ thì phương trình $f(x)=0$ có nghiệm.
3. Nếu hàm số $y=f(x)$ liên tục, đơn điệu trên $[a;b]$ và $f(a)\cdot f(b)<0$ thì phương trình $f(x)=0$ có nghiệm duy nhất.
A. Có đúng hai mệnh đề sai.
B. Cả ba mệnh đề đều đúng.
C. Cả ba mệnh đề đều sai.
D. Có đúng một mệnh đề sai.

**Phần 1. Hướng dẫn**

**Mấu chốt:** định lí nghiệm của hàm liên tục đòi hỏi hàm liên tục trên cả đoạn $[a;b]$, kể cả hai đầu mút, rồi xét thêm đơn điệu cho tính duy nhất.

**Bước 1.** Xét mệnh đề 1: so sánh khoảng liên tục $(a;b)$ nêu trong giả thiết với khoảng cần có của định lí nghiệm, rồi tìm phản ví dụ.

**Bước 2.** Xét mệnh đề 2: đối chiếu từng giả thiết với định lí giá trị trung gian xem có khớp đủ hay không.

**Bước 3.** Xét mệnh đề 3: ngoài sự tồn tại nghiệm, dùng tính đơn điệu để lập luận hai nghiệm khác nhau không thể cùng tồn tại.

**Bước 4.** Đếm số mệnh đề sai trong ba mệnh đề rồi chọn phương án phù hợp.

**Phần 2. Trình bày**

Mệnh đề 1 sai. Hàm liên tục chỉ trên $(a;b)$ thì chưa đủ. Ví dụ $f(x)=\dfrac{1}{x}$ liên tục trên $(0;1)$, đặt $f(0)=-1$, $f(1)=1$ thì $f(0)\cdot f(1)<0$ nhưng $f(x)=0$ vô nghiệm trên $(0;1)$ (vì $\dfrac{1}{x}>0$ với mọi $x\in(0;1)$).

Mệnh đề 2 đúng. Đây là định lí giá trị trung gian: $f$ liên tục trên $[a;b]$ và $f(a)\cdot f(b)<0$ thì phương trình $f(x)=0$ có ít nhất một nghiệm trong $(a;b)$.

Mệnh đề 3 đúng. Theo mệnh đề 2, phương trình có nghiệm. Nếu có hai nghiệm $x_1<x_2$ thì $f(x_1)=f(x_2)=0$, điều này mâu thuẫn với $f$ đơn điệu (đồng biến hoặc nghịch biến thì $f(x_1)\ne f(x_2)$). Vậy nghiệm duy nhất.

Như vậy có đúng một mệnh đề sai là mệnh đề 1.

Chọn D.

### Câu 40 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho hàm số $y=\begin{cases} \dfrac{1-x^3}{1-x} & \text{khi } x<1 \\ 1 & \text{khi } x\ge1 \end{cases}$. Hãy chọn kết luận đúng
A. $y$ liên tục phải tại $x=1$.
B. $y$ liên tục tại $x=1$.
C. $y$ liên tục trái tại $x=1$.
D. $y$ liên tục trên $\mathbb{R}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn biết liên tục phải, liên tục trái hay liên tục tại $x=1$ thì so sánh $f(1)$ với từng giới hạn một phía tại $x=1$.

**Bước 1.** Rút gọn biểu thức ở nhánh $x<1$ bằng cách phân tích tử thành tích có thừa số $1-x$ rồi giản ước.

**Bước 2.** Tính giới hạn bên trái khi $x\to1^-$ từ biểu thức đã rút gọn, và giới hạn bên phải khi $x\to1^+$ từ nhánh còn lại.

**Bước 3.** So sánh mỗi giới hạn một phía với giá trị $f(1)$ để biết liên tục phải, liên tục trái hay liên tục tại điểm.

**Bước 4.** Đối chiếu kết luận với bốn phương án.

**Phần 2. Trình bày**

Với $x<1$: $f(x)=\dfrac{1-x^3}{1-x}=\dfrac{(1-x)(1+x+x^2)}{1-x}=1+x+x^2$.

$f(1)=1$

$\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^-}(1+x+x^2)=3\ne f(1)$

$\lim\limits_{x\to1^+}f(x)=\lim\limits_{x\to1^+}1=1=f(1)$

Do đó hàm số liên tục phải tại $x=1$ nhưng không liên tục trái tại $x=1$, nên không liên tục tại $x=1$ và cũng không liên tục trên $\mathbb{R}$.

Vậy kết luận đúng là hàm số liên tục phải tại $x=1$.

Chọn A.

### Câu 41 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho hàm số $y=\begin{cases} \dfrac{x^2-7x+12}{x-3} & \text{khi } x\ne3 \\ -1 & \text{khi } x=3 \end{cases}$. Mệnh đề nào sau đây đúng?
A. Hàm số liên tục nhưng không có đạo hàm tại $x_0=3$.
B. Hàm số gián đoạn và không có đạo hàm tại $x_0=3$.
C. Hàm số có đạo hàm nhưng không liên tục tại $x_0=3$.
D. Hàm số liên tục và có đạo hàm tại $x_0=3$.
**Ghi chú:** đề hỏi cả khái niệm đạo hàm (học ở học kì II); lời giải rút gọn thành hàm bậc nhất $y=x-4$ trên $\mathbb{R}$ rồi kết luận, không tính đạo hàm bằng định nghĩa.

**Phần 1. Hướng dẫn**

**Mấu chốt:** rút gọn biểu thức ở nhánh $x\ne3$ để xem hàm có thực sự trùng một hàm đa thức quen thuộc trên cả $\mathbb{R}$ hay không.

**Bước 1.** Phân tích tử số $x^2-7x+12$ thành nhân tử có chứa $x-3$ rồi giản ước với mẫu số khi $x\ne3$.

**Bước 2.** Tính giới hạn của hàm khi $x\to3$ từ biểu thức đã rút gọn và so sánh với giá trị $f(3)$ đề cho để xét liên tục.

**Bước 3.** Nếu giá trị đề cho tại $x=3$ khớp với biểu thức rút gọn thì hàm trùng với một hàm đa thức trên toàn $\mathbb{R}$, từ đó suy ra tính có đạo hàm.

**Phần 2. Trình bày**

Với $x\ne3$: $y=\dfrac{x^2-7x+12}{x-3}=\dfrac{(x-3)(x-4)}{x-3}=x-4$.

$\lim\limits_{x\to3}y=\lim\limits_{x\to3}(x-4)=-1$

$y(3)=-1$

Do $\lim\limits_{x\to3}y=y(3)$ nên hàm số liên tục tại $x_0=3$.

Hơn nữa $y(3)=-1=3-4$ nên hàm số trùng với hàm bậc nhất $y=x-4$ trên toàn $\mathbb{R}$, mà hàm bậc nhất có đạo hàm tại mọi điểm nên hàm số có đạo hàm tại $x_0=3$.

Vậy hàm số liên tục và có đạo hàm tại $x_0=3$.

Chọn D.

### Câu 42 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho hàm số $f(x)=\begin{cases} \dfrac{x-2}{\sqrt{x+2}-2} & \text{khi } x\ne2 \\ 4 & \text{khi } x=2 \end{cases}$. Chọn mệnh đề đúng?
A. Hàm số liên tục tại $x=2$.
B. Hàm số gián đoạn tại $x=2$.
C. $f(4)=2$.
D. $\lim\limits_{x\to2}f(x)=2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính $\lim\limits_{x\to2}f(x)$ bằng cách nhân với biểu thức liên hợp của mẫu rồi so sánh với $f(2)$, đồng thời tính riêng $f(4)$ để loại mệnh đề về $f(4)$.

**Bước 1.** Nhân cả tử và mẫu với biểu thức liên hợp của mẫu số để khử dạng vô định $\dfrac{0}{0}$ khi $x\to2$.

**Bước 2.** Rút gọn thừa số $x-2$ ở tử và mẫu, tính giới hạn của biểu thức còn lại khi $x\to2$.

**Bước 3.** So sánh giới hạn với $f(2)$ để xét liên tục tại $x=2$, và tính $f(4)$ bằng nhánh $x\ne2$ để kiểm tra mệnh đề về $f(4)$.

**Phần 2. Trình bày**

Với $x\ne2$, $x\ge-2$:

$f(x)=\dfrac{(x-2)\left(\sqrt{x+2}+2\right)}{\left(\sqrt{x+2}-2\right)\left(\sqrt{x+2}+2\right)}$

$=\dfrac{(x-2)\left(\sqrt{x+2}+2\right)}{(x+2)-4}$

$=\sqrt{x+2}+2$

$\lim\limits_{x\to2}f(x)=\sqrt{4}+2=4=f(2)$

Do đó hàm số liên tục tại $x=2$, nên phương án A đúng, phương án B sai và phương án D sai (giới hạn bằng $4$, không phải $2$).

$f(4)=\sqrt{6}+2\ne2$ nên phương án C sai.

Vậy mệnh đề đúng là: hàm số liên tục tại $x=2$.

Chọn A.

### Câu 43 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho hàm số $f(x)=\dfrac{2x-1}{x^3-x}$. Kết luận nào sau đây đúng?
A. Hàm số liên tục tại $x=-1$.
B. Hàm số liên tục tại $x=0$.
C. Hàm số liên tục tại $x=1$.
D. Hàm số liên tục tại $x=\dfrac{1}{2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức liên tục tại mọi điểm thuộc tập xác định, nên chỉ cần tìm tập xác định rồi xét xem điểm nào thuộc tập đó.

**Bước 1.** Tìm điều kiện để mẫu số khác $0$ bằng cách phân tích mẫu thành nhân tử rồi tìm các giá trị làm mẫu bằng $0$.

**Bước 2.** Viết tập xác định của hàm số dưới dạng $\mathbb{R}$ bỏ đi các giá trị vừa tìm.

**Bước 3.** Kiểm tra từng điểm ở bốn phương án có thuộc tập xác định hay không, điểm nào thuộc thì hàm liên tục tại đó.

**Phần 2. Trình bày**

Hàm số xác định khi $x^3-x\ne0$.

$x(x-1)(x+1)\ne0$

$x\ne0$, $x\ne1$ và $x\ne-1$.

Tập xác định là $\mathbb{R}\setminus\{-1;0;1\}$.

Các điểm $x=-1$, $x=0$, $x=1$ không thuộc tập xác định nên hàm số không liên tục (gián đoạn) tại các điểm đó.

Điểm $x=\dfrac{1}{2}$ thuộc tập xác định và hàm phân thức liên tục tại mọi điểm thuộc tập xác định.

Vậy hàm số liên tục tại $x=\dfrac{1}{2}$.

Chọn D.

### Câu 44 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Hàm số nào sau đây liên tục tại $x=1$:
A. $f(x)=\dfrac{x^2+x+1}{x-1}$.
B. $f(x)=\dfrac{x^2-x-2}{x^2-1}$.
C. $f(x)=\dfrac{x^2+x+1}{x}$.
D. $f(x)=\dfrac{x+1}{x-1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức liên tục tại $x=1$ khi giá trị $x=1$ thuộc tập xác định, tức mẫu số khác $0$ tại đó.

**Bước 1.** Thay $x=1$ vào mẫu số của từng hàm để biết mẫu có bằng $0$ hay không.

**Bước 2.** Loại các hàm có mẫu bằng $0$ tại $x=1$ vì chúng không xác định, do đó không liên tục tại điểm này.

**Bước 3.** Với hàm còn lại, xác nhận $x=1$ thuộc tập xác định và nhớ hàm phân thức liên tục trên tập xác định để kết luận.

**Phần 2. Trình bày**

Ở hàm A, mẫu $x-1$ bằng $0$ tại $x=1$ nên hàm không xác định tại $x=1$.

Ở hàm B, mẫu $x^2-1$ bằng $0$ tại $x=1$ nên hàm không xác định tại $x=1$.

Ở hàm D, mẫu $x-1$ bằng $0$ tại $x=1$ nên hàm không xác định tại $x=1$.

Ở hàm C, mẫu $x=1\ne0$ nên $x=1$ thuộc tập xác định $\mathbb{R}\setminus\{0\}$, hàm phân thức liên tục tại $x=1$.

Vậy hàm số liên tục tại $x=1$ là hàm ở phương án C.

Chọn C.

### Câu 45 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Hàm số nào dưới đây gián đoạn tại điểm $x_0=-1$.
A. $y=(x+1)\left(x^2+2\right)$.
B. $y=\dfrac{2x-1}{x+1}$.
C. $y=\dfrac{x}{x-1}$.
D. $y=\dfrac{x+1}{x^2+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm đa thức liên tục trên $\mathbb{R}$, hàm phân thức liên tục tại điểm thuộc tập xác định, nên gián đoạn tại $x_0=-1$ chỉ xảy ra khi mẫu số bằng $0$ tại đó.

**Bước 1.** Nhận dạng từng hàm: hàm nào là đa thức, hàm nào là phân thức.

**Bước 2.** Với các hàm phân thức, thay $x=-1$ vào mẫu số để xem mẫu có bằng $0$ không.

**Bước 3.** Chọn hàm không xác định tại $x=-1$ làm hàm gián đoạn, đồng thời xác nhận các hàm còn lại liên tục.

**Phần 2. Trình bày**

Hàm A là đa thức nên liên tục trên $\mathbb{R}$, liên tục tại $x_0=-1$.

Hàm C có mẫu $x-1=-2\ne0$ tại $x=-1$ nên liên tục tại $x_0=-1$.

Hàm D có mẫu $x^2+1\ge1>0$ với mọi $x$ nên liên tục trên $\mathbb{R}$, liên tục tại $x_0=-1$.

Hàm B có mẫu $x+1=0$ tại $x=-1$ nên không xác định tại $x_0=-1$, do đó gián đoạn tại điểm này.

Vậy hàm số gián đoạn tại $x_0=-1$ là hàm ở phương án B.

Chọn B.

### Câu 46 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Hàm số nào sau đây gián đoạn tại $x=2$?
A. $y=\dfrac{3x-4}{x-2}$.
B. $y=\sin x$.
C. $y=x^4-2x^2+1$
D. $y=\tan x$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** các hàm đa thức và hàm sin, cos liên tục trên $\mathbb{R}$, còn hàm phân thức và hàm tang chỉ liên tục tại các điểm thuộc tập xác định.

**Bước 1.** Phân loại bốn hàm thành đa thức, hàm sin, phân thức và hàm tang để biết hàm nào luôn liên tục.

**Bước 2.** Với hàm phân thức, thay $x=2$ vào mẫu số để kiểm tra mẫu có bằng $0$ không.

**Bước 3.** Với hàm $\tan x$, kiểm tra $\cos2\ne0$ để biết $x=2$ có thuộc tập xác định hay không, rồi kết luận hàm gián đoạn duy nhất.

**Phần 2. Trình bày**

Hàm $y=\sin x$ liên tục trên $\mathbb{R}$ nên liên tục tại $x=2$.

Hàm $y=x^4-2x^2+1$ là đa thức nên liên tục trên $\mathbb{R}$, liên tục tại $x=2$.

Hàm $y=\tan x$ xác định khi $\cos x\ne0$, tức $x\ne\dfrac{\pi}{2}+k\pi$ với $k\in\mathbb{Z}$. Vì $2\ne\dfrac{\pi}{2}+k\pi$ với mọi $k\in\mathbb{Z}$ (do $\dfrac{\pi}{2}\approx1{,}57$ và $\dfrac{\pi}{2}+\pi\approx4{,}71$), nên hàm liên tục tại $x=2$.

Hàm $y=\dfrac{3x-4}{x-2}$ có mẫu bằng $0$ tại $x=2$ nên không xác định tại $x=2$, do đó gián đoạn tại điểm này.

Vậy hàm số gián đoạn tại $x=2$ là hàm ở phương án A.

Chọn A.

### Câu 47 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Hàm số $y=\dfrac{x}{x+1}$ gián đoạn tại điểm $x_0$ bằng?
A. $x_0=2018$.
B. $x_0=1$.
C. $x_0=0$.
D. $x_0=-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức gián đoạn tại điểm làm mẫu số bằng $0$, vì tại đó hàm không xác định.

**Bước 1.** Tìm tập xác định của hàm bằng cách giải điều kiện mẫu số khác $0$.

**Bước 2.** Tìm giá trị của $x$ không thuộc tập xác định, đó là điểm hàm số không xác định.

**Bước 3.** Đối chiếu với các phương án và nhớ hàm phân thức liên tục tại mọi điểm thuộc tập xác định để chắc chắn các điểm còn lại không gián đoạn.

**Phần 2. Trình bày**

Hàm số xác định khi $x+1\ne0$, tức $x\ne-1$.

Tập xác định là $\mathbb{R}\setminus\{-1\}$ và hàm phân thức liên tục tại mọi điểm thuộc tập xác định.

Tại $x_0=-1$ hàm số không xác định nên gián đoạn.

Vậy hàm số gián đoạn tại $x_0=-1$.

Chọn D.

### Câu 48 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho hàm số $y=\dfrac{x-3}{x^2-1}$. Mệnh đề nào sau đây đúng?
A. Hàm số không liên tục tại các điểm $x=\pm1$.
B. Hàm số liên tục tại mọi $x\in\mathbb{R}$.
C. Hàm số liên tục tại các điểm $x=-1$.
D. Hàm số liên tục tại các điểm $x=1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức liên tục tại mọi điểm của tập xác định, còn tại điểm không thuộc tập xác định thì hàm không liên tục.

**Bước 1.** Tìm tập xác định của hàm số bằng điều kiện mẫu số khác $0$ và giải phương trình mẫu bằng $0$ để tìm các điểm bị loại.

**Bước 2.** Nêu tính liên tục của hàm trên tập xác định, rồi xét tính liên tục tại các điểm bị loại.

**Bước 3.** Đối chiếu từng phương án với kết luận vừa có, nhất là các phương án nói về $x=1$ và $x=-1$.

**Phần 2. Trình bày**

Hàm số xác định khi $x^2-1\ne0$, tức $x\ne1$ và $x\ne-1$.

Tập xác định là $\mathbb{R}\setminus\{-1;1\}$.

Hàm phân thức liên tục tại mọi điểm thuộc tập xác định.

Các điểm $x=1$ và $x=-1$ không thuộc tập xác định nên hàm số không liên tục tại các điểm này, và do đó cũng không liên tục tại mọi $x\in\mathbb{R}$.

Vậy hàm số không liên tục tại các điểm $x=\pm1$.

Chọn A.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Câu 37 và Câu 41 hỏi về đạo hàm (kiến thức học kì II, ngoài phạm vi chương trình đề cương); lời giải chỉ dùng liên tục + nhận xét hình/hàm bậc nhất, không tính đạo hàm. Ở Câu 37, phương án B và D về nội dung gần như trùng nhau (cùng "liên tục và không có đạo hàm"); đáp án đề chọn B theo cách đề đặt.
- Câu 48: ảnh trang 36 cắt dòng đề, các phương án A–D lấy ở đầu trang 37.
- Câu 38 có hình đề: một ảnh duy nhất gồm bốn đồ thị A–D.
