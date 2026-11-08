# ĐỀ | Đề cương ôn tập cuối học kì I Toán 11 năm 2025–2026 — Trường THPT Phan Đình Phùng
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 41 | Dãy số, cấp số cộng, cấp số nhân — Phần 1: Trắc nghiệm nhiều phương án lựa chọn | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho dãy số $(u_n)$ xác định bởi: $\begin{cases} u_1=2 \\ u_{n+1}=2^n\cdot u_n \end{cases}$ với $n\ge1$. Tìm số hạng $u_5$ của dãy số.
A. $10$.
B. $1024$.
C. $2048$.
D. $4096$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy cho bằng công thức truy hồi nên phải tính lần lượt từng số hạng từ $u_1$ cho tới $u_5$.

**Bước 1.** Thay $n=1$ vào công thức truy hồi để tìm $u_2$ từ $u_1$ đã cho, chú ý hệ số nhân phụ thuộc vào $n$.

**Bước 2.** Lặp lại với $n=2$ và $n=3$ để lần lượt thu được $u_3$ và $u_4$, mỗi lần dùng số hạng vừa tính được.

**Bước 3.** Thay $n=4$ để tìm $u_5$ rồi đối chiếu với bốn phương án.

**Phần 2. Trình bày**

$u_2=2^1\cdot u_1=2\cdot2=4$

$u_3=2^2\cdot u_2=4\cdot4=16$

$u_4=2^3\cdot u_3=8\cdot16=128$

$u_5=2^4\cdot u_4=16\cdot128=2048$

Chọn C.

### Câu 2 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho dãy số $(u_n)$ với $u_n=2n-1$. Dãy số $(u_n)$ là dãy số
A. Bị chặn trên bởi $1$.
B. Giảm.
C. Bị chặn dưới bởi $2$.
D. Tăng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét hiệu $u_{n+1}-u_n$ để biết tăng hay giảm, và so sánh số hạng đầu với các cận được nêu để xét tính bị chặn.

**Bước 1.** Lập hiệu $u_{n+1}-u_n$ của hai số hạng liên tiếp và xét dấu của hiệu này với mọi $n$ nguyên dương.

**Bước 2.** Dựa vào dấu của hiệu để xét xem phương án nói dãy giảm hay dãy tăng có phù hợp không.

**Bước 3.** Tính số hạng đầu $u_1$ rồi dùng nó để kiểm tra các phương án nói về cận trên và cận dưới của dãy.

**Phần 2. Trình bày**

$u_{n+1}-u_n=(2(n+1)-1)-(2n-1)=2>0$ với mọi $n\in\mathbb{N}^*$ nên $(u_n)$ là dãy tăng.

Dãy tăng nên không giảm, loại B.

Dãy tăng có $u_n\ge u_1=1$ và $u_n$ lớn tuỳ ý khi $n$ tăng nên không bị chặn trên, loại A.

Vì $u_1=1<2$ nên dãy không bị chặn dưới bởi $2$, loại C.

Chọn D.

### Câu 3 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho dãy số $(u_n)$ có $u_n=\sqrt{n-1}$ với $n\in\mathbb{N}^*$. Khẳng định nào sau đây là **sai**?
A. $5$ số hạng đầu của dãy là: $0;1;\sqrt2;\sqrt3;\sqrt5$.
B. Số hạng $u_{n+1}=\sqrt n$.
C. Là dãy số tăng.
D. Bị chặn dưới bởi số $0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** kiểm từng khẳng định, khẳng định nào không khớp với công thức $u_n=\sqrt{n-1}$ thì là khẳng định sai.

**Bước 1.** Tính trực tiếp năm số hạng đầu từ $n=1$ đến $n=5$ rồi so với danh sách ở phương án nói về năm số hạng đầu.

**Bước 2.** Thay $n$ bằng $n+1$ trong công thức tổng quát để kiểm tra phương án nói về $u_{n+1}$.

**Bước 3.** Dùng tính đồng biến của hàm căn và dấu của biểu thức dưới căn để kiểm tra hai phương án về tăng và bị chặn dưới.

**Phần 2. Trình bày**

Năm số hạng đầu: $u_1=0$, $u_2=1$, $u_3=\sqrt2$, $u_4=\sqrt3$, $u_5=\sqrt4=2$.

Danh sách ở A có số hạng thứ năm là $\sqrt5$, không khớp, nên A sai.

Phương án B: $u_{n+1}=\sqrt{(n+1)-1}=\sqrt n$, đúng.

Phương án C: $n-1<n$ nên $\sqrt{n-1}<\sqrt n$, tức $u_n<u_{n+1}$, dãy tăng, đúng.

Phương án D: $u_n=\sqrt{n-1}\ge0$ với mọi $n$, đúng.

Chọn A.

### Câu 4 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Trong các dãy số $(u_n)$ cho bởi số hạng tổng quát $u_n$ sau, dãy số nào là dãy số giảm?
A. $u_n=\dfrac{1}{2^n}$.
B. $u_n=\dfrac{3n-1}{n+1}$.
C. $u_n=n^2$.
D. $u_n=\sqrt{n+2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy giảm khi $u_{n+1}<u_n$ với mọi $n$, nên cần xét chiều biến thiên của từng dãy.

**Bước 1.** Với các dãy dạng lũy thừa hoặc căn, so sánh $u_{n+1}$ với $u_n$ bằng cách nhận xét sự thay đổi của $n$ trong biểu thức.

**Bước 2.** Với dãy dạng phân thức, biến đổi tách phần nguyên rồi nhận xét mẫu số tăng làm phân số còn lại thay đổi thế nào.

**Bước 3.** Chỉ giữ lại dãy mà các số hạng liên tiếp luôn nhỏ dần.

**Phần 2. Trình bày**

A: $u_{n+1}=\dfrac{1}{2^{n+1}}=\dfrac12\cdot u_n<u_n$ vì $u_n>0$, nên dãy giảm.

B: $u_n=\dfrac{3n-1}{n+1}=3-\dfrac{4}{n+1}$, $n$ tăng thì $\dfrac{4}{n+1}$ giảm nên $u_n$ tăng, loại.

C: $u_{n+1}-u_n=2n+1>0$, dãy tăng, loại.

D: $n+2$ tăng thì $\sqrt{n+2}$ tăng, dãy tăng, loại.

Chọn A.

### Câu 5 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Trong các dãy số sau đây dãy số nào bị chặn?
A. $u_n=n+\dfrac1n$.
B. $u_n=\sqrt{n^2+1}$.
C. $u_n=2^n+1$.
D. $u_n=\dfrac{n}{n+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy bị chặn khi có cả cận trên và cận dưới, nên cần xem số hạng có lớn vô hạn khi $n$ tăng hay không.

**Bước 1.** Với mỗi dãy, nhận xét xem biểu thức có chứa phần tăng không giới hạn khi $n$ tăng hay không.

**Bước 2.** Loại các dãy có số hạng lớn hơn một số cho trước tuỳ ý bằng cách so sánh với $n$ hoặc $2^n$.

**Bước 3.** Với dãy còn lại, biến đổi về dạng $1-\dfrac{1}{n+1}$ và đánh giá để tìm hai cận.

**Phần 2. Trình bày**

A: $u_n=n+\dfrac1n>n$ nên không bị chặn trên, loại.

B: $u_n=\sqrt{n^2+1}>n$ nên không bị chặn trên, loại.

C: $u_n=2^n+1>n$ nên không bị chặn trên, loại.

D: $u_n=\dfrac{n}{n+1}=1-\dfrac{1}{n+1}$ nên $0<u_n<1$ với mọi $n\in\mathbb{N}^*$, dãy bị chặn.

Chọn D.

### Câu 6 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho dãy số có các số hạng đầu là: $0;\dfrac12;\dfrac23;\dfrac34;\dfrac45;\ldots$ Số hạng tổng quát của dãy số này là
A. $u_n=\dfrac{n+1}{n}$.
B. $u_n=\dfrac{n}{n+1}$.
C. $u_n=\dfrac{n-1}{n}$.
D. $u_n=\dfrac{n^2-n}{n+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm quy luật của tử và mẫu theo số thứ tự $n$ rồi kiểm tra lại bằng các số hạng đầu.

**Bước 1.** Viết các số hạng đầu dưới dạng phân số, kể cả số $0$, để thấy tử số và mẫu số thay đổi thế nào theo thứ tự $n$.

**Bước 2.** Nêu dự đoán công thức tổng quát từ quy luật đó.

**Bước 3.** Thay $n=1,2,3$ vào các phương án còn nghi ngờ để loại phương án không cho đúng các số hạng đã nêu.

**Phần 2. Trình bày**

Viết $0=\dfrac01$, các số hạng là $\dfrac01;\dfrac12;\dfrac23;\dfrac34;\dfrac45$: số hạng thứ $n$ có tử là $n-1$, mẫu là $n$.

Vậy $u_n=\dfrac{n-1}{n}$.

Kiểm tra A: $u_1=2\ne0$, loại. B: $u_1=\dfrac12\ne0$, loại.

Kiểm tra D: $u_2=\dfrac{4-2}{3}=\dfrac23\ne\dfrac12$, loại.

Chọn C.

### Câu 7 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho dãy số $(u_n)$, biết $u_n=3^n$. Tìm số hạng $u_{2n-1}$.
A. $3^2\cdot3^n-1$.
B. $3^n\cdot3^{n-1}$.
C. $3^{2n}-1$.
D. $3^{2(n-1)}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** thay chỉ số $2n-1$ vào chỗ $n$ trong công thức $u_n=3^n$ rồi viết lại bằng quy tắc nhân lũy thừa cùng cơ số.

**Bước 1.** Thay $n$ bằng $2n-1$ trong công thức số hạng tổng quát để có biểu thức của $u_{2n-1}$.

**Bước 2.** Tách số mũ thành tổng hai số mũ để đưa về tích của hai lũy thừa cơ số $3$.

**Bước 3.** So sánh dạng tích thu được với từng phương án, chú ý phân biệt số mũ của lũy thừa với phép cộng trừ đứng ngoài lũy thừa.

**Phần 2. Trình bày**

$u_{2n-1}=3^{2n-1}$

$2n-1=n+(n-1)$ nên $3^{2n-1}=3^{n+(n-1)}=3^n\cdot3^{n-1}$

Các phương án A, C có "$-1$" ở ngoài lũy thừa nên khác $3^{2n-1}$.

Phương án D có số mũ $2n-2\ne2n-1$.

Chọn B.

### Câu 8 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Công thức nào sau đây là đúng với cấp số cộng có số hạng đầu $u_1$, công sai $d$, $n\ge2$
A. $u_n=u_1+d$.
B. $u_n=u_1+(n+1)d$.
C. $u_n=u_1-(n-1)d$.
D. $u_n=u_1+(n-1)d$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số hạng thứ $n$ của cấp số cộng bằng số hạng đầu cộng thêm công sai một số lần bằng số bước đi từ $u_1$ đến $u_n$.

**Bước 1.** Viết $u_2,u_3,u_4$ theo $u_1$ và $d$ để thấy số lần $d$ được cộng vào.

**Bước 2.** Từ quy luật đó suy ra số lần cộng $d$ để tới số hạng thứ $n$ theo $n$.

**Bước 3.** Đối chiếu công thức nhận được với bốn phương án, chú ý dấu và hệ số của $d$.

**Phần 2. Trình bày**

$u_2=u_1+d$, $u_3=u_1+2d$, $u_4=u_1+3d$.

Từ $u_1$ đến $u_n$ cần cộng $d$ tổng cộng $n-1$ lần nên $u_n=u_1+(n-1)d$.

Chọn D.

### Câu 9 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Dãy số nào sau đây là một cấp số cộng?
A. $(u_n):\begin{cases} u_1=1 \\ u_{n+1}=u_n+2,\ \forall n\ge1 \end{cases}$.
B. $(u_n):\begin{cases} u_1=3 \\ u_{n+1}=2u_n+1,\ \forall n\ge1 \end{cases}$.
C. $(u_n): 1;\ 3;\ 6;\ 10;\ 15;\ \ldots$.
D. $(u_n): -1;\ 1;\ -1;\ 1;\ -1;\ \ldots$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy là cấp số cộng khi hiệu của hai số hạng liên tiếp luôn bằng cùng một số không đổi.

**Bước 1.** Với dãy cho bằng công thức truy hồi, biến đổi $u_{n+1}-u_n$ để xem hiệu có là hằng số không.

**Bước 2.** Với dãy liệt kê số hạng, tính hiệu các cặp số hạng liên tiếp rồi so sánh các hiệu đó với nhau.

**Bước 3.** Chọn dãy mà hiệu không đổi ở mọi bước.

**Phần 2. Trình bày**

A: $u_{n+1}-u_n=2$ không đổi nên là cấp số cộng công sai $2$.

B: $u_2=7$, $u_3=15$ nên $u_2-u_1=4$, $u_3-u_2=8$, hiệu thay đổi, loại.

C: $3-1=2$, $6-3=3$, hiệu thay đổi, loại.

D: $1-(-1)=2$, $-1-1=-2$, hiệu thay đổi, loại.

Chọn A.

### Câu 10 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cấp số cộng $(u_n)$ có số hạng đầu $u_1=3$, công sai $d=5$, số hạng thứ tư là
A. $u_4=23$.
B. $u_4=18$.
C. $u_4=8$.
D. $u_4=14$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** áp dụng công thức số hạng tổng quát của cấp số cộng với chỉ số $n=4$.

**Bước 1.** Nhắc lại công thức tính $u_n$ theo $u_1$ và $d$.

**Bước 2.** Thay $n=4$ cùng các giá trị $u_1$, $d$ đã cho vào công thức.

**Bước 3.** Tính giá trị rồi chọn phương án trùng khớp.

**Phần 2. Trình bày**

$u_4=u_1+3d=3+3\cdot5=18$

Chọn B.

### Câu 11 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho dãy số $(u_n)$ là cấp số cộng với $u_1=3;u_5=19$. Tính $u_{12}$.
A. $u_{12}=51$.
B. $u_{12}=57$.
C. $u_{12}=47$.
D. $u_{12}=\dfrac{207}{5}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm công sai từ hai số hạng đã biết rồi tính số hạng thứ $12$ theo công thức tổng quát.

**Bước 1.** Viết $u_5$ qua $u_1$ và $d$ để lập phương trình ẩn $d$.

**Bước 2.** Giải phương trình đó để tìm công sai $d$.

**Bước 3.** Viết $u_{12}$ qua $u_1$ và $d$ rồi thay số để tính.

**Phần 2. Trình bày**

$u_5=u_1+4d\Leftrightarrow19=3+4d\Leftrightarrow d=4$

$u_{12}=u_1+11d=3+11\cdot4=47$

Chọn C.

### Câu 12 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Xác định số hạng đầu $u_1$ và công sai $d$ của cấp số cộng $(u_n)$ có $u_9=5u_2$ và $u_{13}=2u_6+5$.
A. $u_1=3$ và $d=4$.
B. $u_1=3$ và $d=5$.
C. $u_1=4$ và $d=5$.
D. $u_1=4$ và $d=3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết mỗi số hạng qua $u_1$ và $d$ để đưa hai điều kiện về một hệ hai phương trình hai ẩn.

**Bước 1.** Biểu diễn $u_9,u_2$ theo $u_1,d$ và thay vào điều kiện thứ nhất để được một phương trình.

**Bước 2.** Làm tương tự với $u_{13},u_6$ cho điều kiện thứ hai rồi rút gọn phương trình.

**Bước 3.** Giải hệ để tìm $u_1$ và $d$, có thể thế ngược vào các phương án để kiểm tra.

**Phần 2. Trình bày**

$u_9=5u_2\Leftrightarrow u_1+8d=5(u_1+d)\Leftrightarrow3d=4u_1$

$u_{13}=2u_6+5\Leftrightarrow u_1+12d=2(u_1+5d)+5\Leftrightarrow2d=u_1+5$

Từ phương trình thứ hai $u_1=2d-5$, thay vào phương trình đầu: $3d=4(2d-5)\Leftrightarrow5d=20\Leftrightarrow d=4$.

Khi đó $u_1=2\cdot4-5=3$.

Vậy $u_1=3$, $d=4$.

Chọn A.

### Câu 13 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Viết ba số xen giữa các số $2$ và $22$ để được cấp số cộng có $5$ số hạng.
A. $7;\ 12;\ 17$.
B. $6;\ 10;\ 14$.
C. $8;13;18$.
D. $6;12;18$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cấp số cộng có $5$ số hạng với số đầu và số cuối đã biết nên tính được công sai rồi suy ra ba số ở giữa.

**Bước 1.** Xác định $u_1$ và $u_5$ từ đề, rồi dùng công thức $u_5=u_1+4d$ để lập phương trình tìm $d$.

**Bước 2.** Giải phương trình bậc nhất vừa lập để tìm ra công sai $d$.

**Bước 3.** Cộng liên tiếp $d$ vào $u_1$ để có $u_2,u_3,u_4$ rồi so với các phương án.

**Phần 2. Trình bày**

$u_1=2$, $u_5=22$ nên $22=2+4d\Leftrightarrow d=5$.

$u_2=2+5=7$, $u_3=7+5=12$, $u_4=12+5=17$.

Cấp số cộng là $2;7;12;17;22$.

Chọn A.

### Câu 14 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Dãy số nào sau đây không phải là cấp số nhân?
A. $1;\ -1;\ 1;\ -1$.
B. $1;\ -3;\ 9;10$.
C. $1;\ 0;\ 0;0$.
D. $32;\ 16;\ 8;4$.
**Ghi chú:** theo định nghĩa SGK (mỗi số hạng từ số thứ hai bằng số hạng đứng ngay trước nhân với một số $q$ không đổi) thì dãy $1;0;0;0$ là cấp số nhân với $q=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy là cấp số nhân khi thương của hai số hạng liên tiếp (hoặc tỉ số quy về từ định nghĩa) luôn bằng cùng một số $q$.

**Bước 1.** Với mỗi dãy, tính tỉ số hoặc kiểm tra mỗi số hạng có phải bằng số trước nhân một số không đổi hay không.

**Bước 2.** Với dãy có số hạng bằng $0$, dùng định nghĩa nhân với $q$ để xét xem dãy có thoả không.

**Bước 3.** Chọn dãy mà quy luật nhân với số không đổi bị phá vỡ.

**Phần 2. Trình bày**

A: $-1=1\cdot(-1)$, $1=(-1)\cdot(-1)$, $-1=1\cdot(-1)$ nên là cấp số nhân $q=-1$.

B: $-3=1\cdot(-3)$, $9=(-3)\cdot(-3)$ nhưng $10\ne9\cdot(-3)$ nên không có cùng một $q$, B không phải cấp số nhân.

C: $0=1\cdot0$, $0=0\cdot0$, $0=0\cdot0$ nên là cấp số nhân $q=0$.

D: $16=32\cdot\dfrac12$, $8=16\cdot\dfrac12$, $4=8\cdot\dfrac12$ nên là cấp số nhân $q=\dfrac12$.

Chọn B.

### Câu 15 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Trong các dãy số $(u_n)$ sau đây, dãy số nào là cấp số nhân?
A. $u_n=3n$.
B. $u_n=2^n$.
C. $u_n=\dfrac1n$.
D. $u_n=2^n+1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cấp số nhân có tỉ số $\dfrac{u_{n+1}}{u_n}$ không phụ thuộc $n$.

**Bước 1.** Với mỗi công thức, lập thương $\dfrac{u_{n+1}}{u_n}$ và rút gọn.

**Bước 2.** Loại các dãy mà thương còn phụ thuộc vào $n$.

**Bước 3.** Chọn dãy cho thương là một hằng số.

**Phần 2. Trình bày**

A: $\dfrac{u_{n+1}}{u_n}=\dfrac{3(n+1)}{3n}=\dfrac{n+1}{n}$ phụ thuộc $n$, loại.

B: $\dfrac{u_{n+1}}{u_n}=\dfrac{2^{n+1}}{2^n}=2$ không đổi, là cấp số nhân công bội $2$.

C: $\dfrac{u_{n+1}}{u_n}=\dfrac{n}{n+1}$ phụ thuộc $n$, loại.

D: $u_1=3$, $u_2=5$, $u_3=9$ có $\dfrac53\ne\dfrac95$, loại.

Chọn B.

### Câu 16 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho cấp số nhân $(u_n)$ có số hạng đầu $u_1$ và công bội $q\ne0$. Công thức xác định số hạng tổng quát của cấp số nhân $(u_n)$ là
A. $u_n=q\cdot u_1^n\ \ \forall n\in\mathbb{N}^*$.
B. $u_n=u_1q\ \ \forall n\in\mathbb{N}^*$.
C. $u_n=q\cdot u_1^{n-1}\ \ \forall n\in\mathbb{N}^*$.
D. $u_n=u_1q^{n-1}\ \ \forall n\in\mathbb{N}^*$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi bước từ số hạng này sang số hạng sau nhân thêm công bội $q$, nên $q$ xuất hiện với số mũ bằng số bước.

**Bước 1.** Viết $u_2,u_3,u_4$ theo $u_1$ và $q$ để quan sát quy luật của số mũ của $q$.

**Bước 2.** Suy ra số mũ của $q$ trong $u_n$ theo $n$.

**Bước 3.** So sánh công thức này với bốn phương án, loại phương án đặt lũy thừa sai chỗ.

**Phần 2. Trình bày**

$u_2=u_1q$, $u_3=u_1q^2$, $u_4=u_1q^3$.

Từ $u_1$ đến $u_n$ có $n-1$ lần nhân với $q$ nên $u_n=u_1q^{n-1}$.

Chọn D.

### Câu 17 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho cấp số nhân $(u_n)$ với $u_2=6$ và $u_5=162$. Công bội của cấp số nhân đã cho bằng
A. $3$.
B. $-3$.
C. $2$.
D. $\dfrac13$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chia hai số hạng cách nhau $3$ vị trí thì $u_1$ triệt tiêu và còn lại một lũy thừa của công bội.

**Bước 1.** Viết $u_5$ và $u_2$ theo số hạng đầu $u_1$ và công bội $q$ bằng công thức tổng quát.

**Bước 2.** Lập tỉ số $\dfrac{u_5}{u_2}$ để khử $u_1$ và được phương trình theo $q$.

**Bước 3.** Giải phương trình lũy thừa bậc ba và chọn nghiệm thực.

**Phần 2. Trình bày**

$\dfrac{u_5}{u_2}=\dfrac{u_1q^4}{u_1q}=q^3$

$q^3=\dfrac{162}{6}=27$

$q=3$

Chọn A.

### Câu 18 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho cấp số nhân có $u_1=-3$, $q=\dfrac23$. Số $\dfrac{-96}{243}$ là số hạng thứ mấy của cấp số nhân này?
A. Thứ $6$.
B. Thứ $8$.
C. Thứ $5$.
D. Thứ $7$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết số hạng tổng quát rồi đặt bằng giá trị đã cho và giải để tìm chỉ số $n$.

**Bước 1.** Viết $u_n=u_1q^{n-1}$ với các giá trị đã biết.

**Bước 2.** Đặt $u_n$ bằng số cho trước, rút gọn để cô lập lũy thừa của $\dfrac23$.

**Bước 3.** Phân tích tử và mẫu thành lũy thừa của $2$ và $3$ để so sánh số mũ.

**Phần 2. Trình bày**

$u_n=-3\cdot\left(\dfrac23\right)^{n-1}=-\dfrac{96}{243}$

$\left(\dfrac23\right)^{n-1}=\dfrac{96}{729}=\dfrac{32}{243}=\left(\dfrac23\right)^5$

$n-1=5\Leftrightarrow n=6$

Chọn A.

### Câu 19 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Xác định $x$ là số thực dương để $2x-3;x;2x+3$ lập thành một cấp số nhân.
A. $x=3$.
B. $x=\sqrt3$.
C. $x=\pm\sqrt3$.
D. $x=5$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba số liên tiếp lập thành cấp số nhân thì bình phương số ở giữa bằng tích hai số hai bên.

**Bước 1.** Viết điều kiện $x^2$ bằng tích của $2x-3$ và $2x+3$.

**Bước 2.** Khai triển tích bằng hằng đẳng thức hiệu hai bình phương và đưa về phương trình theo $x^2$.

**Bước 3.** Giải phương trình và lấy nghiệm thoả điều kiện $x$ dương.

**Phần 2. Trình bày**

Ba số $2x-3;x;2x+3$ lập thành cấp số nhân khi $x^2=(2x-3)(2x+3)$.

$x^2=4x^2-9\Leftrightarrow3x^2=9\Leftrightarrow x^2=3$

Vì $x>0$ nên $x=\sqrt3$.

Chọn B.

### Câu 20 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Biết $3$ số nguyên $3,\ x,\ y$ theo thứ tự đó lập thành một cấp số nhân và $3$ số $x,\ y,\ 9$ theo thứ tự đó lập thành một cấp số cộng. Khi đó $x+y$ bằng
A. $-5$.
B. $7$.
C. $0$.
D. $11$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** lập hai phương trình, một từ tính chất cấp số nhân và một từ tính chất cấp số cộng, rồi giải hệ chú ý điều kiện nguyên.

**Bước 1.** Từ cấp số nhân $3,x,y$ viết liên hệ giữa $x^2$ và tích $3y$.

**Bước 2.** Từ cấp số cộng $x,y,9$ viết liên hệ giữa số ở giữa và trung bình cộng hai số hai bên rồi rút $x$ theo $y$.

**Bước 3.** Thế vào phương trình đầu để được phương trình bậc hai theo $y$, giải rồi loại nghiệm không thoả điều kiện số nguyên.

**Phần 2. Trình bày**

$3,x,y$ là cấp số nhân nên $x^2=3y$.

$x,y,9$ là cấp số cộng nên $2y=x+9\Leftrightarrow x=2y-9$.

$(2y-9)^2=3y\Leftrightarrow4y^2-39y+81=0$

$\Delta=39^2-4\cdot4\cdot81=1521-1296=225$ nên $y=3$ hoặc $y=\dfrac{27}{4}$.

$y=\dfrac{27}{4}$ không là số nguyên, loại.

$y=3$ thì $x=2\cdot3-9=-3$ (thoả mãn: $3;-3;3$ là cấp số nhân, $-3;3;9$ là cấp số cộng).

$x+y=-3+3=0$

Chọn C.

### Câu 21 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho cấp số nhân $(u_n)$ có $u_1=2$ và biểu thức $20u_1-10u_2+u_3$ đạt giá trị nhỏ nhất. Số hạng thứ bảy của cấp số nhân $(u_n)$ có giá trị bằng
A. $6250$.
B. $31250$.
C. $136250$.
D. $39062$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn biểu thức qua công bội $q$ để được tam thức bậc hai theo $q$, tìm $q$ làm nó nhỏ nhất rồi tính $u_7$.

**Bước 1.** Viết $u_2$ và $u_3$ theo $u_1=2$ và $q$ rồi thay vào biểu thức cần cực tiểu.

**Bước 2.** Đưa biểu thức về dạng bình phương một nhị thức cộng một hằng số để xác định giá trị $q$ làm biểu thức nhỏ nhất.

**Bước 3.** Dùng công thức số hạng tổng quát với $q$ vừa tìm để tính $u_7$.

**Phần 2. Trình bày**

$u_2=2q$, $u_3=2q^2$.

$20u_1-10u_2+u_3=40-20q+2q^2=2(q^2-10q+20)=2\big((q-5)^2-5\big)$

Biểu thức nhỏ nhất khi $q=5$ (giá trị nhỏ nhất bằng $-10$).

$u_7=u_1q^6=2\cdot5^6=2\cdot15625=31250$

Chọn B.

### Câu 22 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Một cấp số nhân với công bội bằng $-2$ có số hạng thứ ba bằng $8$ và số hạng cuối bằng $-1024$. Hỏi cấp số nhân đó có bao nhiêu số hạng?
A. $11$
B. $10$
C. $9$
D. $8$

**Phần 1. Hướng dẫn**

**Mấu chốt:** từ số hạng thứ ba và công bội tìm số hạng đầu, rồi đặt số hạng tổng quát bằng số hạng cuối để tìm số số hạng.

**Bước 1.** Dùng $u_3=u_1q^2$ để tìm số hạng đầu $u_1$.

**Bước 2.** Viết số hạng tổng quát $u_n$ rồi đặt bằng số hạng cuối.

**Bước 3.** Biểu diễn kết quả thành lũy thừa của $-2$ để so sánh số mũ và tìm $n$.

**Phần 2. Trình bày**

$u_3=u_1q^2\Leftrightarrow8=u_1\cdot4\Leftrightarrow u_1=2$

$u_n=2\cdot(-2)^{n-1}=-1024\Leftrightarrow(-2)^{n-1}=-512=(-2)^9$

$n-1=9\Leftrightarrow n=10$

Chọn B.

### Câu 23 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Viết thêm sáu số xen giữa hai số $-2$ và $256$ để được một cấp số nhân có $8$ số hạng. Nếu viết tiếp thì số hạng thứ $15$ là bao nhiêu?
A. $-32768$.
B. $16384$.
C. $-16384$.
D. $32768$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai số đã cho là số hạng đầu và số hạng thứ tám, từ đó tìm công bội rồi tính số hạng thứ $15$ theo công thức tổng quát.

**Bước 1.** Xác định $u_1$ và $u_8$ từ đề, lập phương trình $u_8=u_1q^7$.

**Bước 2.** Giải phương trình lũy thừa bậc bảy để tìm công bội $q$.

**Bước 3.** Dùng công thức $u_{15}=u_1q^{14}$ rồi thay số, chú ý dấu của $u_1$.

**Phần 2. Trình bày**

$u_1=-2$, $u_8=256$ nên $256=-2\cdot q^7\Leftrightarrow q^7=-128=(-2)^7\Leftrightarrow q=-2$.

$u_{15}=u_1q^{14}=-2\cdot(-2)^{14}=-2\cdot16384=-32768$

Chọn A.

### Câu 24 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Người ta thiết kế một cái tháp gồm $10$ tầng theo cách: Diện tích bề mặt trên của mỗi tầng bằng nửa diện tích bề mặt trên của tầng ngay bên dưới và diện tích bề mặt của tầng $1$ bằng nửa diện tích đế tháp. Biết diện tích bề mặt đế tháp là $12288\ \text{m}^2$, diện tích bề mặt trên cùng của tháp bằng
A. $6\ \text{m}^2$.
B. $12\ \text{m}^2$.
C. $24\ \text{m}^2$.
D. $3\ \text{m}^2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích các tầng liên tiếp lập thành cấp số nhân công bội $\dfrac12$, cần xác định đúng tầng nào là số hạng đầu.

**Bước 1.** Từ diện tích đế tháp suy ra diện tích tầng $1$, đây là số hạng đầu của cấp số nhân.

**Bước 2.** Xác định công bội từ quy tắc mỗi tầng bằng một nửa tầng dưới.

**Bước 3.** Tầng trên cùng là tầng thứ $10$, dùng công thức số hạng tổng quát để tính diện tích.

**Phần 2. Trình bày**

Gọi $u_n$ là diện tích bề mặt trên của tầng $n$. Diện tích tầng $1$ là $u_1=\dfrac{12288}{2}=6144$, công bội $q=\dfrac12$.

$u_{10}=u_1q^9=6144\cdot\dfrac{1}{2^9}=\dfrac{6144}{512}=12$

Vậy diện tích bề mặt trên cùng của tháp là $12\ \text{m}^2$.

Chọn B.

### Câu 25 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Cho một cấp số cộng $(u_n)$ có $u_1=1$ và tổng $100$ số hạng đầu bằng $24850$. Tính $S=\dfrac{1}{u_1u_2}+\dfrac{1}{u_2u_3}+\ldots+\dfrac{1}{u_{49}u_{50}}$.
A. $S=123$.
B. $S=\dfrac{4}{23}$.
C. $S=\dfrac{9}{246}$.
D. $S=\dfrac{49}{246}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm công sai từ tổng $100$ số hạng đầu, rồi tách mỗi phân số thành hiệu hai phân số để các số hạng triệt tiêu liên tiếp.

**Bước 1.** Dùng công thức tổng $n$ số hạng đầu của cấp số cộng với $n=100$ để lập phương trình tìm công sai.

**Bước 2.** Với công sai $d$ khác $0$, viết $\dfrac{1}{u_ku_{k+1}}$ thành $\dfrac1d\left(\dfrac{1}{u_k}-\dfrac{1}{u_{k+1}}\right)$ nhờ $u_{k+1}-u_k=d$.

**Bước 3.** Cộng các hiệu đó, các số hạng ở giữa triệt tiêu, còn đầu và cuối rồi tính $u_{50}$ để thay số.

**Phần 2. Trình bày**

$S_{100}=\dfrac{100\,(2u_1+99d)}{2}=24850\Leftrightarrow50(2+99d)=24850\Leftrightarrow2+99d=497\Leftrightarrow d=5$

Vì $u_{k+1}-u_k=5$ nên $\dfrac{1}{u_ku_{k+1}}=\dfrac15\left(\dfrac{1}{u_k}-\dfrac{1}{u_{k+1}}\right)$.

$S=\dfrac15\left(\dfrac{1}{u_1}-\dfrac{1}{u_2}+\dfrac{1}{u_2}-\dfrac{1}{u_3}+\ldots+\dfrac{1}{u_{49}}-\dfrac{1}{u_{50}}\right)=\dfrac15\left(\dfrac{1}{u_1}-\dfrac{1}{u_{50}}\right)$

$u_{50}=1+49\cdot5=246$

$S=\dfrac15\left(1-\dfrac{1}{246}\right)=\dfrac15\cdot\dfrac{245}{246}=\dfrac{49}{246}$

Chọn D.

### Câu 26 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Cho dãy số $(u_n)$ với $\begin{cases} u_1=-2 \\ u_{n+1}=-2-\dfrac{1}{u_n} \end{cases}$. Công thức số hạng tổng quát của dãy số này là
A. $u_n=-\dfrac{n-1}{n}$.
B. $u_n=\dfrac{n+1}{n}$.
C. $u_n=-\dfrac{n+1}{n}$.
D. $u_n=-\dfrac{n}{n+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính vài số hạng đầu từ công thức truy hồi để loại phương án sai, rồi kiểm công thức còn lại thoả công thức truy hồi.

**Bước 1.** Tính $u_2$ và $u_3$ từ $u_1$ bằng công thức truy hồi.

**Bước 2.** Thay $n=1,2,3$ vào các phương án để loại những phương án không cho đúng ba số hạng vừa tính.

**Bước 3.** Với phương án còn lại, thay $u_n$ vào vế phải của công thức truy hồi và biến đổi để xem có ra $u_{n+1}$ không.

**Phần 2. Trình bày**

$u_2=-2-\dfrac{1}{-2}=-\dfrac32$, $u_3=-2-\dfrac{1}{-\frac32}=-2+\dfrac23=-\dfrac43$.

A: $u_1=0\ne-2$, loại. B: $u_1=2\ne-2$, loại. D: $u_1=-\dfrac12\ne-2$, loại.

C: $u_n=-\dfrac{n+1}{n}$ cho $u_1=-2$, $u_2=-\dfrac32$, $u_3=-\dfrac43$, trùng khớp.

Kiểm tra: $-2-\dfrac{1}{u_n}=-2+\dfrac{n}{n+1}=\dfrac{-2n-2+n}{n+1}=-\dfrac{n+2}{n+1}=u_{n+1}$.

Chọn C.

### Câu 27 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Sinh nhật bạn của An vào ngày $01$ tháng năm. An muốn mua một món quà sinh nhật cho bạn nên quyết định bỏ ống heo $100$ đồng vào ngày $01$ tháng $01$ năm $2016$, sau đó cứ liên tục ngày sau hơn ngày trước $100$ đồng. Hỏi đến ngày sinh nhật của bạn, An đã tích lũy được bao nhiêu tiền? (thời gian bỏ ống heo tính từ ngày $01$ tháng $01$ năm $2016$ đến ngày $30$ tháng $4$ năm $2016$)
A. 738 100 đồng.
B. 726 000 đồng.
C. 714 000 đồng.
D. 750 300 đồng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số tiền bỏ ống mỗi ngày lập thành cấp số cộng, cần đếm đúng số ngày kể cả năm nhuận.

**Bước 1.** Đếm số ngày từ $01/01/2016$ đến $30/04/2016$, chú ý năm $2016$ là năm nhuận nên tháng $2$ có $29$ ngày.

**Bước 2.** Xác định số hạng đầu và công sai của cấp số cộng số tiền bỏ ống mỗi ngày.

**Bước 3.** Dùng công thức tổng $n$ số hạng đầu với $n$ là số ngày vừa đếm.

**Phần 2. Trình bày**

Số ngày: $31+29+31+30=121$ ngày (năm $2016$ nhuận).

Số tiền bỏ ống ngày thứ $k$ là $u_k=100k$ (đồng), cấp số cộng có $u_1=100$, $d=100$.

$S_{121}=\dfrac{121\,(100+100\cdot121)}{2}=\dfrac{121\cdot12200}{2}=738100$

Vậy An tích luỹ được $738\,100$ đồng.

Chọn A.

### Câu 28 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Sắp đến ngày sinh nhật của mẹ, Lan quyết định tiết kiệm tiền để mua quà tặng mẹ theo cách sau: ngày thứ nhất Lan bỏ ống tiết kiệm $1$ nghìn đồng, ngày thứ hai Lan bỏ ống tiết kiệm $2$ nghìn đồng, ngày thứ ba Lan bỏ ống tiết kiệm $4$ nghìn đồng,..., số tiền bỏ ống tiết kiệm của ngày thứ $n+1$ gấp đôi số tiền bỏ ống tiết kiệm của ngày thứ $n$. Số tiền Lan tiết kiệm được sau khi bỏ ống được $15$ ngày là $X$ nghìn đồng, hỏi $X$ bằng bao nhiêu?
A. 32767 nghìn đồng.
B. 31797 nghìn đồng.
C. 12060 nghìn đồng.
D. 35067 nghìn đồng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số tiền mỗi ngày lập thành cấp số nhân, và tổng cần tìm là tổng $15$ số hạng đầu của nó.

**Bước 1.** Nhận ra quy luật gấp đôi mỗi ngày nên dãy số tiền là cấp số nhân, xác định số hạng đầu và công bội.

**Bước 2.** Viết công thức tổng $n$ số hạng đầu của cấp số nhân với công bội khác $1$.

**Bước 3.** Thay $n=15$ và tính, chú ý đơn vị nghìn đồng.

**Phần 2. Trình bày**

Số tiền bỏ ống mỗi ngày lập thành cấp số nhân $u_1=1$, $q=2$.

$X=S_{15}=u_1\cdot\dfrac{q^{15}-1}{q-1}=\dfrac{2^{15}-1}{2-1}=32768-1=32767$

Vậy $X=32767$ nghìn đồng.

Chọn A.

### Câu 29 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Ông $A$ gửi $120$ triệu đồng tiền vào ngân hàng với lãi suất $6\%/$ năm. Biết rằng nếu không rút tiền ra khỏi ngân hàng thì cứ sau mỗi năm số tiền lãi sẽ được nhập vào vốn để tính lãi cho năm tiếp theo. Hỏi sau $10$ năm, tổng số tiền mà ông $A$ nhận được là bao nhiêu, giả định trong khoảng thời gian này lãi suất không thay đổi và ông $A$ không rút tiền ra? (Lấy kết quả gần đúng đến hàng phần trăm)
A. 214,90 triệu đồng.
B. 224,10 triệu đồng.
C. 234,90 triệu đồng.
D. 215,10 triệu đồng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** lãi nhập vốn hằng năm nên số tiền sau mỗi năm gấp $1+6\%$ lần năm trước, tạo thành cấp số nhân.

**Bước 1.** Xác định số tiền sau mỗi năm theo số tiền năm liền trước để thấy công bội của cấp số nhân.

**Bước 2.** Viết công thức số tiền sau $n$ năm theo vốn ban đầu và công bội.

**Bước 3.** Thay $n=10$, tính bằng máy tính rồi làm tròn đến hàng phần trăm theo yêu cầu.

**Phần 2. Trình bày**

Sau mỗi năm số tiền nhân với $1+0{,}06=1{,}06$, nên số tiền sau $n$ năm là $120\cdot(1{,}06)^n$ (triệu đồng).

Sau $10$ năm: $120\cdot(1{,}06)^{10}\approx214{,}90$ (triệu đồng).

Chọn A.

### Câu 30 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Một quả bóng cao su từ độ cao $15\ (\text{m})$ so với mặt đất, mỗi lần chạm đất quả bóng lại nảy lên một độ cao bằng hai phần năm độ cao lần rơi ngay trước đó. Biết rằng quả bóng luôn chuyển động vuông góc với mặt đất. Tổng quãng đường quả bóng đã bay (từ lúc thả bóng cho đến lúc bóng không nảy nữa) khoảng:
A. $35\ (\text{m})$.
B. $50\ (\text{m})$.
C. $30\ (\text{m})$.
D. $25\ (\text{m})$.
**Ghi chú:** câu xếp trong chương Dãy số nhưng cần tổng cấp số nhân lùi vô hạn (chương 5 Giới hạn, trong phạm vi đề cương cuối kì I).

**Phần 1. Hướng dẫn**

**Mấu chốt:** quãng đường gồm lần rơi đầu cộng mỗi lần nảy lên và rơi xuống sau đó, các độ cao nảy lập thành cấp số nhân lùi vô hạn.

**Bước 1.** Xác định độ cao nảy lên sau mỗi lần chạm đất theo độ cao rơi trước đó, từ đó thấy công bội của dãy độ cao.

**Bước 2.** Viết tổng quãng đường là lần rơi đầu tiên cộng hai lần tổng các độ cao nảy (lên rồi xuống).

**Bước 3.** Dùng công thức tổng cấp số nhân lùi vô hạn với $|q|<1$ để tính tổng các độ cao nảy.

**Phần 2. Trình bày**

Độ cao nảy lên sau lần chạm thứ $k$ là $15\cdot\left(\dfrac25\right)^k$, các độ cao này lập thành cấp số nhân lùi vô hạn với số hạng đầu $15\cdot\dfrac25=6$ và công bội $q=\dfrac25$.

Tổng các độ cao nảy: $\dfrac{6}{1-\frac25}=10$.

Mỗi độ cao nảy ứng với một lần bóng bay lên rồi rơi xuống nên quãng đường đó là $2\cdot10=20$.

Tổng quãng đường: $15+20=35$ (m).

Chọn A.

## PHẦN 42 | Dãy số, cấp số cộng, cấp số nhân — Phần 3: Trả lời ngắn | tra_loi_ngan

### Câu 1 | kho=dai | loai=tra_loi_ngan | dap_an=9
**Đề:** Cho dãy số $(a_n)$ với $a_n=\dfrac{7n+5}{kn+7}\ (k\in\mathbb{R})$. Tìm giá trị nguyên $k$ lớn nhất để dãy đã cho là dãy số tăng?

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy tăng khi $a_{n+1}-a_n>0$ với mọi $n$, nên cần tính hiệu này theo $k$ và xét điều kiện để nó dương.

**Bước 1.** Lập hiệu $a_{n+1}-a_n$, quy đồng hai phân số và rút gọn tử số, quan sát xem tử số phụ thuộc $n$ hay không.

**Bước 2.** Nhận xét dấu của mẫu số khi $k$ không âm rồi suy ra điều kiện của $k$ để hiệu luôn dương.

**Bước 3.** Chọn giá trị nguyên lớn nhất thoả điều kiện và kiểm tra lại bằng cách thử giá trị $k$ ngay sát biên.

**Phần 2. Trình bày**

$a_{n+1}-a_n=\dfrac{7n+12}{kn+k+7}-\dfrac{7n+5}{kn+7}=\dfrac{(7n+12)(kn+7)-(7n+5)(kn+k+7)}{(kn+k+7)(kn+7)}$

Tử số: $(7kn^2+12kn+49n+84)-(7kn^2+12kn+49n+5k+35)=49-5k$.

Với $k\ge0$ thì $kn+7>0$ và $kn+k+7>0$ nên mẫu số dương, do đó $a_{n+1}-a_n$ cùng dấu với $49-5k$.

Dãy tăng khi $49-5k>0\Leftrightarrow k<\dfrac{49}{5}=9{,}8$, tức $k\le9$ (với $k$ nguyên).

Thử: $k=9$ có $a_1=\dfrac{12}{16}=0{,}75<a_2=\dfrac{19}{25}=0{,}76$ và $49-45=4>0$, dãy tăng; $k=10$ có $49-50=-1<0$ và mẫu dương nên dãy giảm.

Vậy giá trị nguyên $k$ lớn nhất là $9$.

### Câu 2 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giá của một chiếc máy photocopy lúc mới mua là $50$ triệu đồng. Biết rằng giá trị của nó sau mỗi năm sử dụng chỉ còn $75\%$ giá trị trong năm liền trước đó. Tính giá trị còn lại của chiếc máy photocopy đó sau mỗi năm, trong khoảng thời gian $5$ năm kể từ khi mua.
**Ghi chú:** đề hỏi giá trị sau từng năm trong $5$ năm đáp án là một dãy năm giá trị nên không phải trả lời ngắn một số.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giá trị còn lại sau mỗi năm nhân với $0{,}75$ nên các giá trị lập thành cấp số nhân.

**Bước 1.** Xác định số hạng đầu và công bội của dãy giá trị sau mỗi năm sử dụng.

**Bước 2.** Tính lần lượt giá trị sau năm thứ nhất đến năm thứ năm bằng cách nhân liên tiếp với công bội.

**Bước 3.** Liệt kê kết quả theo từng năm kèm đơn vị triệu đồng.

**Phần 2. Trình bày**

Giá trị còn lại sau $n$ năm là $u_n=50\cdot(0{,}75)^n$ (triệu đồng).

Sau năm thứ nhất: $50\cdot0{,}75=37{,}5$.

Sau năm thứ hai: $37{,}5\cdot0{,}75=28{,}125$.

Sau năm thứ ba: $28{,}125\cdot0{,}75=21{,}09375$.

Sau năm thứ tư: $21{,}09375\cdot0{,}75=15{,}8203125$.

Sau năm thứ năm: $15{,}8203125\cdot0{,}75=11{,}865234375$.

Vậy giá trị còn lại sau mỗi năm lần lượt là $37{,}5$; $28{,}125$; $21{,}09375$; $15{,}8203125$; $11{,}865234375$ (triệu đồng).

### Câu 4 | kho=dai | loai=tra_loi_ngan | dap_an=8
**Đề:** Một người muốn mua một thanh gỗ đủ để cắt ra làm các thanh ngang của một cái thang. Biết rằng chiều dài các thanh ngang của cái thang đó (từ bậc dưới cùng) lần lượt là $45\ \text{cm},43\ \text{cm},41\ \text{cm},\ldots,31\ \text{cm}$. Xác định số bậc của chiếc thang đó.
**Hình:** de_P42C4.png
**Ghi chú:** đề cương không có Câu 3 đọc được (xem GHI CHÚ CHO NGƯỜI DUYỆT); hình chiếc thang chỉ minh hoạ, số bậc tính theo dữ kiện chiều dài.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chiều dài các thanh ngang giảm đều nên lập thành cấp số cộng, số bậc là số số hạng của cấp số cộng đó.

**Bước 1.** Xác định số hạng đầu, công sai và số hạng cuối của dãy chiều dài các thanh.

**Bước 2.** Đặt số hạng tổng quát bằng chiều dài thanh cuối và giải phương trình để tìm số số hạng.

**Bước 3.** Kết luận số bậc chính là giá trị $n$ vừa tìm.

**Phần 2. Trình bày**

Chiều dài các thanh ngang lập thành cấp số cộng $(u_n)$ có $u_1=45$, công sai $d=43-45=-2$.

Thanh trên cùng dài $31$ cm nên $u_n=31\Leftrightarrow45+(n-1)\cdot(-2)=31\Leftrightarrow n-1=7\Leftrightarrow n=8$.

Vậy chiếc thang có $8$ bậc.

### Câu 5 | kho=dai | loai=tra_loi_ngan | dap_an=405
**Đề:** Giá của một chiếc xe ô tô lúc mới mua là $680$ triệu đồng. Cứ sau mỗi năm sử dụng, giá của chiếc xe ô tô giảm $55$ triệu đồng. Tính giá còn lại của chiếc xe sau $5$ năm sử dụng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giá xe giảm một lượng không đổi mỗi năm nên các giá trị lập thành cấp số cộng với công sai âm.

**Bước 1.** Xác định giá lúc mua và độ giảm mỗi năm để biết công sai.

**Bước 2.** Chọn cách tính giá sau $5$ năm bằng số lần giảm tương ứng, tránh nhầm với chỉ số số hạng.

**Bước 3.** Tính giá còn lại và ghi kèm đơn vị triệu đồng.

**Phần 2. Trình bày**

Gọi $G_n$ là giá xe sau $n$ năm. Ta có $G_0=680$ và mỗi năm giảm $55$ nên $G_n=680-55n$ (triệu đồng).

$G_5=680-55\cdot5=680-275=405$

Vậy giá còn lại của xe sau $5$ năm là $405$ triệu đồng.

### Câu 6 | kho=dai | loai=tra_loi_ngan | dap_an=40
**Đề:** Ba góc $A,B,C\ (A<B<C)$ của tam giác tạo thành cấp số cộng, biết góc lớn nhất gấp đôi góc bé nhất. Hiệu số đo độ của góc lớn nhất với góc nhỏ nhất bằng:

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba góc theo thứ tự tăng lập thành cấp số cộng nên biểu diễn qua góc nhỏ nhất và công sai, rồi dùng tổng ba góc của tam giác.

**Bước 1.** Viết $B$ và $C$ theo $A$ và công sai $d$ của cấp số cộng.

**Bước 2.** Dùng điều kiện góc lớn nhất gấp đôi góc bé nhất để lập liên hệ giữa $A$ và $d$.

**Bước 3.** Dùng tổng ba góc bằng $180^\circ$ để tính $d$ rồi tính hiệu $C-A$.

**Phần 2. Trình bày**

$A,B,C$ là cấp số cộng nên $B=A+d$, $C=A+2d$ với $d>0$.

$C=2A\Leftrightarrow A+2d=2A\Leftrightarrow A=2d$.

$A+B+C=3A+3d=180^\circ\Leftrightarrow6d+3d=180^\circ\Leftrightarrow d=20^\circ$.

Khi đó $A=40^\circ$, $B=60^\circ$, $C=80^\circ$.

$C-A=80^\circ-40^\circ=40^\circ$

Vậy hiệu số đo là $40$ độ.

### Câu 7 | kho=dai | loai=tra_loi_ngan | dap_an=7700
**Đề:** Một cơ sở khoan giếng đưa ra định mức giá như sau: Giá của mét khoan đầu tiên là $100$ nghìn đồng và kể từ mét khoan thứ hai, giá của mỗi mét sau tăng thêm $30$ nghìn đồng so với giá của mét khoan ngay trước đó. Một người cần khoan một giếng sâu $20\ \text{m}$ để lấy nước dùng cho sinh hoạt của gia đình. Hỏi sau khi hoàn thành việc khoan giếng, gia đình đó phải thanh toán cho cơ sở khoan giếng số tiền bao nhiêu nghìn đồng?

**Phần 1. Hướng dẫn**

**Mấu chốt:** giá của từng mét khoan lập thành cấp số cộng và số tiền phải trả là tổng giá của cả $20$ mét.

**Bước 1.** Xác định giá mét đầu và độ tăng giá mỗi mét để có số hạng đầu và công sai.

**Bước 2.** Viết công thức tổng $n$ số hạng đầu của cấp số cộng.

**Bước 3.** Thay số mét khoan vào công thức và tính, ghi đơn vị nghìn đồng.

**Phần 2. Trình bày**

Giá của mét khoan thứ $k$ lập thành cấp số cộng $u_1=100$, $d=30$ (nghìn đồng).

$S_{20}=\dfrac{20\,(2\cdot100+19\cdot30)}{2}=10\cdot770=7700$

Vậy gia đình phải thanh toán $7700$ nghìn đồng.

### Câu 8 | kho=dai | loai=tra_loi_ngan | dap_an=234
**Đề:** Một bức tường trang trí có dạng hình thang, rộng $2{,}4\ \text{m}$ ở đáy và rộng $1{,}2\ \text{m}$ ở đỉnh (hình vẽ bên). Các viên gạch hình vuông có kích thước $10\ \text{cm}\cdot10\ \text{cm}$ phải được đặt sao cho mỗi hàng ở phía trên chứa ít hơn một viên so với hàng ở ngay phía dưới nó. Hỏi sẽ cần bao nhiêu viên gạch hình vuông như vậy để ốp hết bức tường đó?
**Hình:** de_P42C8.png
**Ghi chú:** hình trong đề chỉ minh hoạ (vẽ ít hàng hơn thực tế); số hàng và số viên mỗi hàng tính theo số liệu $2{,}4$ m và $1{,}2$ m.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số viên gạch ở mỗi hàng giảm đều một viên từ đáy lên đỉnh nên lập thành cấp số cộng, cần tìm số viên ở hàng đáy và hàng đỉnh để biết có bao nhiêu hàng.

**Bước 1.** Đổi chiều rộng đáy và đỉnh sang cùng đơn vị với cạnh viên gạch để biết số viên ở hàng dưới cùng và hàng trên cùng.

**Bước 2.** Xác định công sai $-1$ rồi tính số hàng bằng công thức số hạng tổng quát với số hạng cuối bằng số viên hàng đỉnh.

**Bước 3.** Dùng công thức tổng cấp số cộng để tính tổng số viên gạch.

**Phần 2. Trình bày**

Hàng đáy rộng $2{,}4$ m nên có $\dfrac{240}{10}=24$ viên. Hàng đỉnh rộng $1{,}2$ m nên có $\dfrac{120}{10}=12$ viên.

Số viên mỗi hàng từ dưới lên lập thành cấp số cộng $u_1=24$, $d=-1$, số hạng cuối $u_n=12$.

$24+(n-1)\cdot(-1)=12\Leftrightarrow n=13$ hàng.

$S_{13}=\dfrac{13\,(24+12)}{2}=13\cdot18=234$

Vậy cần $234$ viên gạch.

### Câu 9 | kho=dai | loai=tra_loi_ngan | dap_an=252
**Đề:** Bốn góc của một tứ giác tạo thành cấp số nhân và góc lớn nhất gấp $27$ lần góc nhỏ nhất. Tổng của góc lớn nhất và góc bé nhất bằng:

**Phần 1. Hướng dẫn**

**Mấu chốt:** bốn góc là cấp số nhân có số hạng cuối gấp $27$ lần số hạng đầu nên tìm được công bội, rồi dùng tổng bốn góc tứ giác.

**Bước 1.** Biểu diễn góc nhỏ nhất và góc lớn nhất qua công bội, lập phương trình từ điều kiện gấp $27$ lần.

**Bước 2.** Giải phương trình lũy thừa bậc ba để tìm công bội.

**Bước 3.** Dùng tổng bốn góc của tứ giác để tính góc nhỏ nhất rồi tính tổng góc lớn nhất và nhỏ nhất.

**Phần 2. Trình bày**

Gọi bốn góc là $u_1,u_1q,u_1q^2,u_1q^3$ với $u_1>0$.

Góc lớn nhất gấp $27$ lần góc nhỏ nhất nên $u_1q^3=27u_1\Leftrightarrow q^3=27\Leftrightarrow q=3$.

Tổng bốn góc: $u_1(1+3+9+27)=360^\circ\Leftrightarrow40u_1=360^\circ\Leftrightarrow u_1=9^\circ$.

Góc lớn nhất là $27\cdot9^\circ=243^\circ$.

Tổng góc lớn nhất và góc bé nhất: $243^\circ+9^\circ=252^\circ$.

Vậy tổng cần tìm là $252$ độ.

### Câu 10 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một công ty xây dựng mua một chiếc máy ủi với giá $3$ tỉ đồng. Cứ sau mỗi năm sử dụng, giá trị của chiếc máy ủi này lại giảm $20\%$ so với giá trị của nó trong năm liền trước đó. Tìm giá trị còn lại của chiếc máy ủi đó sau $5$ năm sử dụng.
**Ghi chú:** đáp số $0{,}98304$ tỉ đồng (hay $983{,}04$ triệu đồng) quá $4$ ký tự nên không tô được ô trả lời ngắn, để dạng tự luận.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi năm giá trị còn lại $80\%$ giá trị năm trước nên giá trị máy lập thành cấp số nhân.

**Bước 1.** Từ tỉ lệ giảm hằng năm suy ra công bội của cấp số nhân.

**Bước 2.** Viết giá trị còn lại sau $n$ năm theo giá ban đầu và công bội, chú ý giá ban đầu ứng với $n=0$.

**Bước 3.** Thay $n=5$, tính và ghi kèm đơn vị.

**Phần 2. Trình bày**

Mỗi năm giá trị còn lại $100\%-20\%=80\%$ giá trị năm trước nên sau $n$ năm giá trị là $3\cdot(0{,}8)^n$ (tỉ đồng).

Sau $5$ năm: $3\cdot(0{,}8)^5=3\cdot0{,}32768=0{,}98304$ (tỉ đồng).

Vậy giá trị còn lại là $0{,}98304$ tỉ đồng, tức $983{,}04$ triệu đồng.

## PHẦN 43 | Các số đặc trưng đo xu thế trung tâm của mẫu số liệu ghép nhóm — Phần 1: Trắc nghiệm nhiều phương án lựa chọn | trac_nghiem

### Câu 1 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Cho mẫu số liệu ghép nhóm về thời gian (phút) đi từ nhà đến nơi làm việc của các nhân viên một công ty như sau: nhóm $[15;20)$ có $6$ nhân viên; $[20;25)$ có $14$; $[25;30)$ có $25$; $[30;35)$ có $37$; $[35;40)$ có $21$; $[40;45)$ có $13$; $[45;50)$ có $9$. Có bao nhiêu nhân viên có thời gian đi từ nhà đến nơi làm việc là từ $15$ phút đến dưới $20$ phút?
A. $6$.
B. $9$.
C. $14$.
D. $13$.
**Hình:** de_P43C1.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhóm $[15;20)$ gồm các giá trị từ $15$ đến dưới $20$ nên chỉ cần đọc tần số của đúng nhóm đó trong bảng.

**Bước 1.** Xác định nhóm số liệu ứng với khoảng thời gian từ $15$ phút đến dưới $20$ phút theo quy ước nửa khoảng.

**Bước 2.** Đọc tần số (số nhân viên) ở cột của nhóm đó trong bảng.

**Bước 3.** Đối chiếu với các phương án, không nhầm với tần số của các nhóm kề bên.

**Phần 2. Trình bày**

Khoảng "từ $15$ phút đến dưới $20$ phút" là nhóm $[15;20)$.

Theo bảng, nhóm $[15;20)$ có $6$ nhân viên.

Chọn A.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phần Đúng/Sai của chương Dãy số không có trong đề cương (đề in Phần 1 rồi nhảy sang Phần 3), nên không có PHẦN đúng sai ở khúc này.
- Phần 3 Câu 3 (tỉ lệ lạm phát $3{,}5\%$, giá căn hộ $A_n=2{,}5\cdot(1{,}035)^n$): đề in thiếu câu hỏi (chỉ có dữ kiện, không có yêu cầu tính gì), nên BỎ, không nhập.
- Phần 1 Câu 14: dãy $1;0;0;0$ coi là cấp số nhân ($q=0$) theo định nghĩa SGK nên đáp án là B ($1;-3;9;10$); nếu coi CSN phải có $q\ne0$ thì C cũng không là CSN và câu có hai đáp án.
- Phần 3 Câu 2 và Câu 10 đáp số quá $4$ ký tự (nhiều giá trị / số thập phân dài) nên để tự luận.
- Phần 3 Câu 4 và Câu 8: hình trong đề chỉ minh hoạ (thang vẽ $6$ bậc, tường vẽ ít hơn $13$ hàng), đáp số tính theo số liệu bằng chữ.
- Chương "Các số đặc trưng": khúc này chỉ có Câu 1 (bắt đầu ở cuối trang $16$); các câu từ Câu 2 trở đi thuộc khúc sau.
