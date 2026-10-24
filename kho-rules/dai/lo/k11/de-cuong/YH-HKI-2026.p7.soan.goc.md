# ĐỀ | Đề cương ôn tập học kì I Toán 11 năm 2026–2027 — Trường THPT Yên Hòa, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 3 | Chương 2 — A. Trắc nghiệm khách quan | trac_nghiem

### Câu 28 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Một đồng hồ đánh giờ, khi kim giờ chỉ số $n$ (từ 1 đến 12) thì đồng hồ đánh đúng $n$ tiếng. Hỏi trong một ngày (24 giờ) đồng hồ đánh được bao nhiêu tiếng?
A. 156.
B. 152.
C. 148.
D. 160.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số tiếng chuông trong mỗi vòng 12 giờ là tổng của một cấp số cộng có công sai bằng 1.

**Bước 1.** Xác định số tiếng đánh ở các giờ 1, 2, ..., 12 lập thành dãy số nào và nhận ra đó là một cấp số cộng.

**Bước 2.** Dùng công thức tổng của $n$ số hạng đầu của cấp số cộng để tính số tiếng đánh trong 12 giờ.

**Bước 3.** Một ngày có 24 giờ gồm hai vòng 12 giờ như nhau nên nhân kết quả với 2 rồi đối chiếu phương án.

**Phần 2. Trình bày**

Số tiếng đánh ở các giờ 1, 2, ..., 12 lập thành cấp số cộng $(u_n)$ có $u_1=1$, $d=1$, $n=12$.

Số tiếng đánh trong 12 giờ là $S_{12}=\dfrac{12\cdot(1+12)}{2}=78$.

Một ngày có hai vòng 12 giờ nên số tiếng đánh là $2\cdot78=156$.

Vậy trong một ngày đồng hồ đánh 156 tiếng.

Chọn A.

### Câu 29 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Sinh nhật lần thứ 17 của An vào ngày 01 tháng 5 năm 2018. Bạn An muốn mua một chiếc máy ảnh giá 3 850 000 đồng để làm quà sinh nhật cho chính mình nên An quyết định bỏ ống heo 1000 đồng vào ngày 01 tháng 02 năm 2018. Trong các ngày tiếp theo, ngày sau bỏ ống nhiều hơn ngày trước 1000 đồng. Hỏi đến ngày sinh nhật của mình, An có bao nhiêu tiền (tính đến ngày 30 tháng 4 năm 2018)?
A. 4 095 000 đồng.
B. 89 000 đồng.
C. 4 005 000 đồng.
D. 3 960 000 đồng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số tiền bỏ ống mỗi ngày tạo thành cấp số cộng, nên chỉ cần đếm đúng số ngày rồi tính tổng.

**Bước 1.** Đếm số ngày từ 01/02/2018 đến hết 30/04/2018, chú ý tháng 2 năm 2018 có 28 ngày.

**Bước 2.** Nhận ra số tiền bỏ ống mỗi ngày lập thành cấp số cộng với số hạng đầu và công sai cùng bằng 1000 đồng.

**Bước 3.** Dùng công thức tổng $n$ số hạng đầu của cấp số cộng với $n$ là số ngày vừa đếm để tính tổng tiền.

**Phần 2. Trình bày**

Từ 01/02 đến 30/04 năm 2018 có số ngày là $28+31+30=89$ (ngày).

Số tiền bỏ ống mỗi ngày lập thành cấp số cộng $(u_n)$ có $u_1=1000$, $d=1000$, $n=89$.

Suy ra $u_{89}=1000+88\cdot1000=89000$.

Tổng số tiền là $S_{89}=\dfrac{89\cdot(1000+89000)}{2}=4005000$ (đồng).

Vậy đến ngày 30/04/2018 An có 4 005 000 đồng.

Chọn C.

### Câu 30 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Người ta trồng 3003 cây theo dạng một hình tam giác như sau: hàng thứ nhất trồng 1 cây, hàng thứ hai trồng 2 cây, hàng thứ ba trồng 3 cây, ..., cứ tiếp tục trồng như thế cho đến khi hết số cây. Số hàng cây được trồng là
A. 77.
B. 79.
C. 76.
D. 78.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tổng số cây của $n$ hàng đầu là tổng của cấp số cộng $1+2+\dots+n$ và phải bằng số cây đã cho.

**Bước 1.** Nhận ra số cây ở các hàng lập thành cấp số cộng có số hạng đầu 1 và công sai 1.

**Bước 2.** Viết tổng số cây của $n$ hàng theo công thức tổng cấp số cộng rồi cho bằng 3003 để lập phương trình ẩn $n$.

**Bước 3.** Giải phương trình bậc hai bằng cách phân tích thành nhân tử và chọn nghiệm nguyên dương.

**Phần 2. Trình bày**

Số cây ở các hàng lập thành cấp số cộng có $u_1=1$, $d=1$.

Tổng số cây của $n$ hàng đầu là $S_n=\dfrac{n(n+1)}{2}$.

Cho $S_n=3003$, ta có $n(n+1)=6006$.

$n^2+n-6006=0$

$(n-77)(n+78)=0$

Vì $n$ là số nguyên dương nên $n=77$.

Vậy số hàng cây là 77.

Chọn A.

### Câu 31 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Trong sân vận động có tất cả 30 dãy ghế, dãy đầu tiên có 15 ghế, các dãy liền sau nhiều hơn dãy trước 4 ghế, hỏi sân vận động đó có tất cả bao nhiêu ghế?
A. 2250.
B. 1740.
C. 4380.
D. 2190.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số ghế của các dãy lập thành cấp số cộng, tổng số ghế là tổng 30 số hạng đầu.

**Bước 1.** Xác định số hạng đầu, công sai và số số hạng của cấp số cộng biểu diễn số ghế các dãy.

**Bước 2.** Chọn công thức tổng $n$ số hạng đầu của cấp số cộng theo $u_1$ và $d$ vì chưa biết số ghế dãy cuối.

**Bước 3.** Thay số, tính tổng rồi đối chiếu với các phương án.

**Phần 2. Trình bày**

Số ghế các dãy lập thành cấp số cộng $(u_n)$ có $u_1=15$, $d=4$, $n=30$.

Tổng số ghế là $S_{30}=\dfrac{30\cdot[2\cdot15+29\cdot4]}{2}$.

$S_{30}=15\cdot146=2190$.

Vậy sân vận động có tất cả 2190 ghế.

Chọn D.

### Câu 32 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Trong các dãy số sau, dãy số nào là một cấp số nhân?
A. $128;\ -64;\ 32;\ -16;\ 8;\ \dots$
B. $\sqrt{2};\ 2;\ 4;\ 4\sqrt{2};\ \dots$
C. $5;\ 6;\ 7;\ 8;\ \dots$
D. $15;\ 5;\ 1;\ \dfrac{1}{5};\ \dots$

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy là cấp số nhân khi thương của hai số hạng liên tiếp bất kì luôn bằng cùng một số.

**Bước 1.** Với từng phương án, tính thương của số hạng đứng sau chia số hạng đứng trước.

**Bước 2.** So sánh các thương trong cùng một dãy, chú ý dãy có dấu đan xen thì thương âm.

**Bước 3.** Phương án nào có các thương bằng nhau thì là cấp số nhân, các phương án còn lại bị loại vì có thương khác nhau.

**Phần 2. Trình bày**

Phương án A: $\dfrac{-64}{128}=-\dfrac{1}{2}$, $\dfrac{32}{-64}=-\dfrac{1}{2}$, $\dfrac{-16}{32}=-\dfrac{1}{2}$, $\dfrac{8}{-16}=-\dfrac{1}{2}$ nên là cấp số nhân với $q=-\dfrac{1}{2}$.

Phương án B: $\dfrac{2}{\sqrt{2}}=\sqrt{2}$ nhưng $\dfrac{4}{2}=2$ nên không phải cấp số nhân.

Phương án C: $\dfrac{6}{5}\ne\dfrac{7}{6}$ nên không phải cấp số nhân.

Phương án D: $\dfrac{5}{15}=\dfrac{1}{3}$ nhưng $\dfrac{1}{5}$ (số 1 chia cho 5) $\ne\dfrac{1}{3}$ nên không phải cấp số nhân.

Chọn A.

### Câu 33 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Trong các dãy số sau, dãy số nào **không phải** là một cấp số nhân?
A. $2;\ 4;\ 8;\ 16;\ \dots$
B. $1;\ -1;\ 1;\ -1;\ \dots$
C. $1^2;\ 2^2;\ 3^2;\ 4^2;\ \dots$
D. $a;\ a^3;\ a^5;\ a^7;\ \dots\ (a\ne0)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn chỉ ra dãy không phải cấp số nhân chỉ cần tìm hai thương liên tiếp khác nhau.

**Bước 1.** Viết rõ các số hạng của từng dãy (tính luỹ thừa nếu có) rồi lập thương hai số hạng liên tiếp.

**Bước 2.** Với dãy chứa chữ $a$, rút gọn thương theo quy tắc nhân luỹ thừa cùng cơ số.

**Bước 3.** Chọn dãy có các thương không bằng nhau, đây là dãy không phải cấp số nhân.

**Phần 2. Trình bày**

Phương án A: các thương $\dfrac{4}{2}=\dfrac{8}{4}=\dfrac{16}{8}=2$ nên là cấp số nhân.

Phương án B: các thương $\dfrac{-1}{1}=\dfrac{1}{-1}=-1$ nên là cấp số nhân.

Phương án C: dãy là $1;\ 4;\ 9;\ 16;\ \dots$ có $\dfrac{4}{1}=4$ và $\dfrac{9}{4}\ne4$ nên không phải cấp số nhân.

Phương án D: $\dfrac{a^3}{a}=\dfrac{a^5}{a^3}=\dfrac{a^7}{a^5}=a^2$ nên là cấp số nhân.

Chọn C.

### Câu 34 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho cấp số nhân $(u_n)$ với $u_1=-2$ và $q=-5$. Viết bốn số hạng đầu tiên của cấp số nhân.
A. $-2;\ 10;\ 50;\ -250$.
B. $-2;\ 10;\ -50;\ 250$.
C. $-2;\ -10;\ -50;\ -250$.
D. $-2;\ 10;\ 50;\ 250$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi số hạng của cấp số nhân bằng số hạng đứng trước nhân với công bội.

**Bước 1.** Dùng hệ thức $u_{n+1}=u_n\cdot q$ để suy ra số hạng kế tiếp từ số hạng đã biết.

**Bước 2.** Lần lượt nhân với $q=-5$ ba lần, chú ý quy tắc dấu của tích hai số âm.

**Bước 3.** Viết đủ bốn số hạng rồi đối chiếu với các phương án.

**Phần 2. Trình bày**

$u_1=-2$

$u_2=u_1\cdot q=(-2)\cdot(-5)=10$

$u_3=u_2\cdot q=10\cdot(-5)=-50$

$u_4=u_3\cdot q=(-50)\cdot(-5)=250$

Vậy bốn số hạng đầu là $-2;\ 10;\ -50;\ 250$.

Chọn B.

### Câu 35 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Trong các dãy số $(u_n)$ cho bởi số hạng tổng quát $u_n$ sau, dãy số nào là một cấp số nhân?
A. $u_n=\dfrac{1}{3^{n-2}}$.
B. $u_n=\dfrac{1}{3^n}-1$.
C. $u_n=n+\dfrac{1}{3}$.
D. $u_n=n^2-\dfrac{1}{3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy là cấp số nhân khi thương $\dfrac{u_{n+1}}{u_n}$ là hằng số không phụ thuộc $n$.

**Bước 1.** Với phương án có luỹ thừa, tính tổng quát thương $\dfrac{u_{n+1}}{u_n}$ rồi rút gọn xem có còn chứa $n$ không.

**Bước 2.** Với các phương án còn lại, tính ba số hạng đầu và so sánh hai thương liên tiếp để loại.

**Bước 3.** Chọn phương án có thương không đổi và kết luận.

**Phần 2. Trình bày**

Phương án A: $\dfrac{u_{n+1}}{u_n}=\dfrac{3^{n-2}}{3^{n-1}}=\dfrac{1}{3}$ (không đổi) nên là cấp số nhân.

Phương án B: $u_1=-\dfrac{2}{3}$, $u_2=-\dfrac{8}{9}$, $u_3=-\dfrac{26}{27}$ có $\dfrac{u_2}{u_1}=\dfrac{4}{3}$, $\dfrac{u_3}{u_2}=\dfrac{13}{12}$ nên không phải.

Phương án C: dãy này là cấp số cộng công sai 1 (có $u_1=\dfrac{4}{3}$, $u_2=\dfrac{7}{3}$, $u_3=\dfrac{10}{3}$) và $\dfrac{u_2}{u_1}=\dfrac{7}{4}\ne\dfrac{u_3}{u_2}=\dfrac{10}{7}$ nên không phải.

Phương án D: $u_1=\dfrac{2}{3}$, $u_2=\dfrac{11}{3}$, $u_3=\dfrac{26}{3}$ có $\dfrac{u_2}{u_1}=\dfrac{11}{2}\ne\dfrac{u_3}{u_2}=\dfrac{26}{11}$ nên không phải.

Chọn A.

### Câu 36 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Trong các dãy số $(u_n)$ cho bởi số hạng tổng quát $u_n$ sau, dãy số nào là một cấp số nhân?
A. $u_n=7-3n$.
B. $u_n=7-3^n$.
C. $u_n=\dfrac{7}{3n}$.
D. $u_n=7\cdot3^n$.
**Ghi chú:** đề in "7.3^n" (dấu chấm là dấu nhân), gõ lại là $7\cdot3^n$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dãy là cấp số nhân khi thương $\dfrac{u_{n+1}}{u_n}$ không phụ thuộc $n$.

**Bước 1.** Nhận dạng nhanh: phương án $7-3n$ là biểu thức bậc nhất của $n$ nên là cấp số cộng, cần kiểm tra thương để loại.

**Bước 2.** Với phương án chứa $3^n$ nhân với hằng số, lập thương $\dfrac{u_{n+1}}{u_n}$ và rút gọn.

**Bước 3.** Với các phương án còn lại, tính ba số hạng đầu và so hai thương liên tiếp để loại, rồi kết luận.

**Phần 2. Trình bày**

Phương án A: $u_1=4$, $u_2=1$, $u_3=-2$ có $\dfrac{u_2}{u_1}=\dfrac{1}{4}\ne\dfrac{u_3}{u_2}=-2$ nên không phải.

Phương án B: $u_1=4$, $u_2=-2$, $u_3=-20$ có $\dfrac{u_2}{u_1}=-\dfrac{1}{2}\ne\dfrac{u_3}{u_2}=10$ nên không phải.

Phương án C: $u_1=\dfrac{7}{3}$, $u_2=\dfrac{7}{6}$, $u_3=\dfrac{7}{9}$ có $\dfrac{u_2}{u_1}=\dfrac{1}{2}\ne\dfrac{u_3}{u_2}=\dfrac{2}{3}$ nên không phải.

Phương án D: $\dfrac{u_{n+1}}{u_n}=\dfrac{7\cdot3^{n+1}}{7\cdot3^n}=3$ (không đổi) nên là cấp số nhân.

Chọn D.

### Câu 37 | kho=dai | loai=trac_nghiem | dap_an=D
**Đề:** Trong các phát biểu sau, phát biểu nào là **sai**?
A. Dãy số có tất cả các số hạng bằng nhau là một cấp số nhân.
B. Dãy số có tất cả các số hạng bằng nhau là một cấp số cộng.
C. Một cấp số cộng có công sai dương là một dãy số tăng.
D. Một cấp số cộng có công sai dương là một dãy số dương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn bác bỏ một phát biểu chỉ cần một ví dụ cụ thể thoả giả thiết nhưng không thoả kết luận.

**Bước 1.** Xét phát biểu về dãy hằng: kiểm tra định nghĩa cấp số nhân và cấp số cộng với công bội, công sai thích hợp.

**Bước 2.** Xét phát biểu về công sai dương bằng cách so sánh $u_{n+1}-u_n$ với 0 để biết dãy tăng hay giảm.

**Bước 3.** Với phát biểu về dãy dương, thử một cấp số cộng công sai dương có số hạng đầu âm để kiểm tra tính đúng sai.

**Phần 2. Trình bày**

Phát biểu A: dãy hằng $u_n=c$ thoả $u_{n+1}=u_n\cdot1$ nên là cấp số nhân với công bội $q=1$. Phát biểu đúng.

Phát biểu B: dãy hằng thoả $u_{n+1}=u_n+0$ nên là cấp số cộng với công sai $d=0$. Phát biểu đúng.

Phát biểu C: $u_{n+1}-u_n=d>0$ nên $u_{n+1}>u_n$, dãy tăng. Phát biểu đúng.

Phát biểu D: cấp số cộng $-5;\ -3;\ -1;\ 1;\ \dots$ có $d=2>0$ nhưng các số hạng đầu âm nên không phải dãy dương. Phát biểu sai.

Chọn D.

### Câu 38 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Xác định $x$ dương để $2x-3;\ x;\ 2x+3$ lập thành cấp số nhân.
A. $x=3$.
B. $x=\sqrt{3}$.
C. $x=\pm\sqrt{3}$.
D. Không có giá trị nào của $x$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba số lập thành cấp số nhân thì bình phương số ở giữa bằng tích hai số hai bên.

**Bước 1.** Áp dụng tính chất của ba số liên tiếp của cấp số nhân để lập phương trình ẩn $x$.

**Bước 2.** Khai triển tích bằng hằng đẳng thức hiệu hai bình phương rồi giải phương trình theo $x^2$.

**Bước 3.** Đối chiếu với điều kiện $x$ dương của đề và kiểm tra ba số khác 0 để kết luận.

**Phần 2. Trình bày**

Ba số $2x-3;\ x;\ 2x+3$ lập thành cấp số nhân nên $x^2=(2x-3)(2x+3)$.

$x^2=4x^2-9$

$3x^2=9$

$x^2=3$

Vì $x>0$ nên $x=\sqrt{3}$.

Thử lại: ba số là $2\sqrt{3}-3;\ \sqrt{3};\ 2\sqrt{3}+3$ đều khác 0 và $(\sqrt{3})^2=3=(2\sqrt{3})^2-9$.

Vậy $x=\sqrt{3}$.

Chọn B.

### Câu 39 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Với giá trị $x$ nào dưới đây thì các số $-4;\ x;\ -9$ theo thứ tự đó lập thành một cấp số nhân?
A. $x=36$.
B. $x=-\dfrac{13}{2}$.
C. $x=6$.
D. $x=-36$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số hạng giữa của ba số lập thành cấp số nhân có bình phương bằng tích hai số hai bên.

**Bước 1.** Viết điều kiện để ba số theo thứ tự đã cho lập thành cấp số nhân dưới dạng một phương trình ẩn $x$.

**Bước 2.** Giải phương trình $x^2=$ một hằng số để tìm các giá trị có thể của $x$.

**Bước 3.** Đối chiếu các giá trị tìm được với bốn phương án, thử lại bằng cách tính công bội.

**Phần 2. Trình bày**

Ba số $-4;\ x;\ -9$ lập thành cấp số nhân nên $x^2=(-4)\cdot(-9)=36$.

Suy ra $x=6$ hoặc $x=-6$.

Trong các phương án chỉ có $x=6$.

Thử lại: dãy $-4;\ 6;\ -9$ có $\dfrac{6}{-4}=-\dfrac{3}{2}$ và $\dfrac{-9}{6}=-\dfrac{3}{2}$ nên là cấp số nhân.

Vậy $x=6$.

Chọn C.

### Câu 40 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Tìm $b>0$ để các số $\dfrac{1}{\sqrt{2}};\ \sqrt{b};\ \sqrt{2}$ theo thứ tự đó lập thành một cấp số nhân.
A. $b=-1$.
B. $b=1$.
C. $b=2$.
D. $b=-2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** áp dụng tính chất số hạng giữa: bình phương số ở giữa bằng tích hai số hai bên.

**Bước 1.** Viết hệ thức giữa ba số liên tiếp của cấp số nhân với số ở giữa là $\sqrt{b}$.

**Bước 2.** Tính tích hai số hai bên rồi bình phương $\sqrt{b}$ bằng cách dùng $(\sqrt{b})^2=b$ khi $b>0$.

**Bước 3.** Đối chiếu điều kiện $b>0$ và các phương án để chọn.

**Phần 2. Trình bày**

Ba số lập thành cấp số nhân nên $(\sqrt{b})^2=\dfrac{1}{\sqrt{2}}\cdot\sqrt{2}$.

$b=1$

Giá trị $b=1$ thoả $b>0$.

Thử lại: dãy $\dfrac{1}{\sqrt{2}};\ 1;\ \sqrt{2}$ có công bội $\sqrt{2}$.

Vậy $b=1$.

Chọn B.

### Câu 41 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Cho cấp số nhân $(a_n)$ có $a_1=3$ và $a_2=-6$. Tìm số hạng thứ năm của cấp số nhân đã cho.
A. $a_5=-24$.
B. $a_5=48$.
C. $a_5=-48$.
D. $a_5=24$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm công bội từ hai số hạng đầu rồi áp dụng công thức số hạng tổng quát.

**Bước 1.** Tính công bội $q$ bằng thương của số hạng thứ hai chia số hạng thứ nhất.

**Bước 2.** Dùng công thức số hạng tổng quát $a_n=a_1\cdot q^{n-1}$ với $n=5$ để tính số hạng cần tìm.

**Bước 3.** Tính luỹ thừa bậc chẵn của số âm cẩn thận về dấu rồi đối chiếu phương án.

**Phần 2. Trình bày**

Công bội $q=\dfrac{a_2}{a_1}=\dfrac{-6}{3}=-2$.

$a_5=a_1\cdot q^4=3\cdot(-2)^4=3\cdot16=48$.

Vậy $a_5=48$.

Chọn B.

### Câu 42 | kho=dai | loai=trac_nghiem | dap_an=C
**Đề:** Một khu rừng có trữ lượng gỗ là $4\cdot10^5$ mét khối. Biết tốc độ sinh trưởng của các cây ở khu rừng đó là 4% mỗi năm. Hỏi sau 5 năm, khu rừng đó sẽ có bao nhiêu mét khối gỗ
A. $4\cdot10^5\cdot(0{,}05)^5$.
B. $4\cdot10^5\cdot(1{,}4)^5$.
C. $4\cdot10^5\cdot(1{,}04)^5$.
D. $4\cdot(10{,}4)^5$.
**Ghi chú:** đề in "4.10^5" (dấu chấm là dấu nhân), gõ lại là $4\cdot10^5$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi năm trữ lượng gỗ được nhân với cùng một hệ số nên các năm lập thành cấp số nhân.

**Bước 1.** Xác định hệ số nhân mỗi năm: trữ lượng năm sau bằng năm trước cộng thêm 4% của năm trước.

**Bước 2.** Gọi $u_0$ là trữ lượng ban đầu, lập công thức truy hồi và nhận ra cấp số nhân với công bội vừa tìm.

**Bước 3.** Suy ra công thức trữ lượng sau 5 năm rồi đối chiếu phương án.

**Phần 2. Trình bày**

Gọi $V_n$ là trữ lượng gỗ sau $n$ năm, $V_0=4\cdot10^5$.

Sau mỗi năm trữ lượng tăng 4% nên $V_{n+1}=V_n+0{,}04V_n=1{,}04V_n$.

Suy ra $(V_n)$ là cấp số nhân với công bội $q=1{,}04$.

Sau 5 năm: $V_5=V_0\cdot(1{,}04)^5=4\cdot10^5\cdot(1{,}04)^5$ (mét khối).

Vậy sau 5 năm khu rừng có $4\cdot10^5\cdot(1{,}04)^5$ mét khối gỗ.

Chọn C.

### Câu 43 | kho=dai | loai=trac_nghiem | dap_an=A
**Đề:** Bài toán "Lãi kép": Một người gửi số tiền 100 triệu đồng vào một ngân hàng với lãi suất 7%/năm. Biết rằng nếu không rút tiền ra khỏi ngân hàng thì cứ sau mỗi năm số tiền lãi được nhập vào vốn ban đầu (người ta gọi đó là lãi kép). Giả sử trong khoảng thời gian gửi người gửi không rút tiền ra và lãi suất không thay đổi, hỏi sau 10 năm thì tổng số tiền cả vốn lẫn lãi mà người gửi nhận được gần với số tiền nào trong các số tiền dưới đây?
A. 196 715 000 đồng.
B. 196 716 000 đồng.
C. 183 845 000 đồng.
D. 183 846 000 đồng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** với lãi kép, số tiền cuối mỗi năm bằng số tiền cuối năm trước nhân với $1+$ lãi suất, tạo thành cấp số nhân.

**Bước 1.** Lập công thức truy hồi cho số tiền sau mỗi năm từ lãi suất 7% mỗi năm.

**Bước 2.** Nhận ra cấp số nhân với số hạng đầu là vốn gửi và công bội là hệ số tăng mỗi năm.

**Bước 3.** Viết công thức số tiền sau 10 năm, dùng máy tính bỏ túi tính luỹ thừa rồi chọn phương án gần nhất.

**Phần 2. Trình bày**

Gọi $T_n$ (triệu đồng) là số tiền sau $n$ năm, $T_0=100$.

$T_{n+1}=T_n+0{,}07T_n=1{,}07T_n$ nên $(T_n)$ là cấp số nhân với công bội $q=1{,}07$.

Sau 10 năm: $T_{10}=100\cdot(1{,}07)^{10}$.

Bấm máy tính ta được $T_{10}\approx196{,}715135$ (triệu đồng), tức khoảng 196 715 135 đồng.

Số này gần nhất với 196 715 000 đồng.

Vậy sau 10 năm người đó nhận được gần 196 715 000 đồng.

Chọn A.

### Câu 44 | kho=dai | loai=trac_nghiem | dap_an=B
**Đề:** Một người gửi ngân hàng 150 triệu đồng theo thể thức lãi kép, lãi suất $0{,}58\%$ một tháng (kể từ tháng thứ 2, tiền lãi được tính theo phần trăm của tổng tiền lãi tháng trước đó và tiền gốc của tháng trước đó). Sau ít nhất bao nhiêu tháng, người đó có 180 triệu đồng?
A. 34 tháng.
B. 32 tháng.
C. 31 tháng.
D. 30 tháng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** số tiền sau mỗi tháng lập thành cấp số nhân công bội $1+0{,}0058$ nên cần tìm số tháng nhỏ nhất để số hạng đạt ngưỡng cho trước.

**Bước 1.** Lập công thức số tiền sau $n$ tháng theo vốn gửi và hệ số tăng mỗi tháng.

**Bước 2.** Đặt bất phương trình để số tiền không nhỏ hơn 180 triệu và rút gọn thành so sánh một luỹ thừa với một số.

**Bước 3.** Dùng máy tính bỏ túi thử các giá trị $n$ ở gần phương án, nhớ rằng dãy tăng nên chỉ cần tìm $n$ nhỏ nhất thoả.

**Phần 2. Trình bày**

Số tiền sau $n$ tháng là $A_n=150\cdot(1{,}0058)^n$ (triệu đồng).

Cần $A_n\ge180$, tức $(1{,}0058)^n\ge1{,}2$.

Vì $1{,}0058>1$ nên dãy $A_n$ tăng.

Bấm máy: $(1{,}0058)^{31}\approx1{,}1964<1{,}2$ nên $A_{31}\approx179{,}45<180$.

Bấm máy: $(1{,}0058)^{32}\approx1{,}2033\ge1{,}2$ nên $A_{32}\approx180{,}49\ge180$.

Vậy sau ít nhất 32 tháng người đó có 180 triệu đồng.

Chọn B.

### Câu 45 | kho=dai | loai=dung_sai | dap_an=DSSS
**Đề:** Cho dãy số có số hạng tổng quát $u_n=n^2-2025n+4050$. Xét tính đúng, sai của các mệnh đề sau:
a) Số hạng thứ 2025 của dãy số là 4050.
b) Dãy số này là dãy số tăng.
c) Dãy số này là dãy số giảm.
d) Dãy số này bị chặn.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tính một vài số hạng cụ thể để kiểm tra tăng, giảm; xét sự lớn lên của $n^2$ để kiểm tra tính bị chặn.

**Bước 1.** Ý a: thay $n=2025$ vào công thức số hạng tổng quát để tính số hạng thứ 2025.

**Bước 2.** Ý b và c: tính vài số hạng đầu và so sánh để tìm một cặp chứng minh dãy không tăng, và một cặp chứng minh dãy không giảm.

**Bước 3.** Ý d: viết $u_n=n(n-2025)+4050$ rồi so sánh với $n$ khi $n$ lớn để xem có bị chặn trên hay không.

**Phần 2. Trình bày**

Ý a) $u_{2025}=2025^2-2025\cdot2025+4050=4050$. Mệnh đề đúng.

Ý b) $u_1=2026$, $u_2=4$ nên $u_1>u_2$, dãy không tăng. Mệnh đề sai.

Ý c) $u_{2025}=4050$, $u_{2026}=2026^2-2025\cdot2026+4050=2026+4050=6076$ nên $u_{2025}<u_{2026}$, dãy không giảm. Mệnh đề sai.

Ý d) Với $n\ge2026$ có $n-2025\ge1$ nên $u_n=n(n-2025)+4050>n$.

Vậy $u_n$ lớn tuỳ ý khi $n$ tăng, dãy không bị chặn trên nên không bị chặn. Mệnh đề sai.

### Câu 46 | kho=dai | loai=dung_sai | dap_an=DSSD
**Đề:** Cho dãy số $(u_n)$, biết $u_n=\dfrac{n+1}{3n}$. Xét tính đúng sai của các mệnh đề sau.
a) Năm số hạng đầu tiên của dãy số là $u_1=\dfrac{2}{3};\ u_2=\dfrac{1}{2};\ u_3=\dfrac{4}{9};\ u_4=\dfrac{5}{12};\ u_5=\dfrac{2}{5}$.
b) $\dfrac{33}{101}$ là một số hạng của dãy số $(u_n)$.
c) Dãy số $(u_n)$ là một cấp số cộng.
d) Cho dãy số $(v_n)$ xác định bởi $v_1=\dfrac{1}{3}$ và $v_{n+1}=u_n\cdot v_n$. Tính tổng: $S=v_1+\dfrac{v_2}{2}+\dfrac{v_3}{3}+\dots+\dfrac{v_{10}}{10}=\dfrac{29524}{59049}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** thay $n$ để tính số hạng, giải phương trình ẩn $n$ để kiểm tra một số có là số hạng, và tìm công thức của $v_n$ rồi tính tổng cấp số nhân.

**Bước 1.** Ý a: thay lần lượt $n=1,2,3,4,5$ vào công thức rồi rút gọn từng phân số.

**Bước 2.** Ý b: cho $u_n$ bằng phân số đã cho, giải ra $n$ và kiểm tra $n$ có là số nguyên dương hay không.

**Bước 3.** Ý c: so sánh hiệu $u_2-u_1$ với $u_3-u_2$ để kiểm tra có phải cấp số cộng không.

**Bước 4.** Ý d: từ hệ thức truy hồi chứng minh bằng quy nạp công thức $v_n$, suy ra $\dfrac{v_k}{k}$ rồi dùng công thức tổng cấp số nhân.

**Phần 2. Trình bày**

Ý a) $u_1=\dfrac{2}{3}$, $u_2=\dfrac{3}{6}=\dfrac{1}{2}$, $u_3=\dfrac{4}{9}$, $u_4=\dfrac{5}{12}$, $u_5=\dfrac{6}{15}=\dfrac{2}{5}$. Mệnh đề đúng.

Ý b) $\dfrac{n+1}{3n}=\dfrac{33}{101}$ nên $101(n+1)=99n$, suy ra $2n=-101$, $n=-\dfrac{101}{2}$ không phải số nguyên dương. Mệnh đề sai.

Ý c) $u_2-u_1=\dfrac{1}{2}-\dfrac{2}{3}=-\dfrac{1}{6}$ và $u_3-u_2=\dfrac{4}{9}-\dfrac{1}{2}=-\dfrac{1}{18}$ khác nhau nên không phải cấp số cộng. Mệnh đề sai.

Ý d) Ta chứng minh $v_n=\dfrac{n}{3^n}$ bằng quy nạp.

Với $n=1$: $v_1=\dfrac{1}{3}$ đúng.

Giả sử $v_n=\dfrac{n}{3^n}$, khi đó $v_{n+1}=u_n\cdot v_n=\dfrac{n+1}{3n}\cdot\dfrac{n}{3^n}=\dfrac{n+1}{3^{n+1}}$, đúng với $n+1$.

Suy ra $\dfrac{v_k}{k}=\dfrac{1}{3^k}$ nên $S=\dfrac{1}{3}+\dfrac{1}{3^2}+\dots+\dfrac{1}{3^{10}}$.

Đây là tổng của cấp số nhân có $u_1=\dfrac{1}{3}$, $q=\dfrac{1}{3}$, 10 số hạng nên $S=\dfrac{1}{3}\cdot\dfrac{1-\left(\frac{1}{3}\right)^{10}}{1-\frac{1}{3}}=\dfrac{1}{2}\cdot\dfrac{3^{10}-1}{3^{10}}$.

Vì $3^{10}=59049$ nên $S=\dfrac{59048}{2\cdot59049}=\dfrac{29524}{59049}$. Mệnh đề đúng.

### Câu 47 | kho=dai | loai=dung_sai | dap_an=SSDS
**Đề:** Cho các dãy số $(u_n)$: $\begin{cases} u_1=1 \\ u_{n+1}=2u_n \end{cases}$ ; $(v_n)$: $v_n=-2n-21$.
a) $(u_n)$ là dãy số bị chặn trên.
b) $(v_n)$ là dãy số cấp số nhân với công bội là $-2$.
c) $-121$ là số hạng thứ 50 của dãy số $(v_n)$.
d) Ta có $T=\dfrac{1}{u_1-u_6}+\dfrac{1}{u_2-u_7}+\dfrac{1}{u_3-u_8}+\dots+\dfrac{1}{u_{20}-u_{25}}=\dfrac{1-2^{20}}{15\cdot2^{19}}$.
**Ghi chú:** ý d đề in mẫu số $15\cdot2^{19}$, giá trị tính đúng có mẫu $31\cdot2^{19}$ (nghi đề in sai), nên ý d được xét theo số liệu in là Sai.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhận dạng loại dãy từ công thức, tìm số hạng tổng quát của $(u_n)$, rồi dùng tổng cấp số nhân để tính $T$.

**Bước 1.** Ý a: tìm công thức số hạng tổng quát của $(u_n)$ từ hệ thức truy hồi rồi xét dãy có bị chặn trên hay không.

**Bước 2.** Ý b: tính hiệu và thương của các số hạng liên tiếp của $(v_n)$ để xác định đó là loại cấp số nào.

**Bước 3.** Ý c: giải phương trình $v_n=-121$ ẩn $n$ rồi kiểm tra $n$ có nguyên dương không.

**Bước 4.** Ý d: tính $u_k-u_{k+5}$ theo $k$, nhận ra tổng cấp số nhân và so sánh với biểu thức đề cho.

**Phần 2. Trình bày**

Ý a) Dãy $(u_n)$ là cấp số nhân có $u_1=1$, $q=2$ nên $u_n=2^{n-1}$. Ta có $2^{n-1}\ge n$ với mọi $n\ge1$, nên $u_n$ lớn tuỳ ý khi $n$ tăng, dãy không bị chặn trên. Mệnh đề sai.

Ý b) $v_{n+1}-v_n=-2$ không đổi nên $(v_n)$ là cấp số cộng công sai $-2$. Thương $\dfrac{v_2}{v_1}=\dfrac{25}{23}\ne\dfrac{v_3}{v_2}=\dfrac{27}{25}$ nên không phải cấp số nhân. Mệnh đề sai.

Ý c) $v_n=-121$ khi $-2n-21=-121$, suy ra $n=50$ là số nguyên dương. Mệnh đề đúng.

Ý d) $u_k-u_{k+5}=2^{k-1}-2^{k+4}=2^{k-1}(1-32)=-31\cdot2^{k-1}$.

Suy ra $T=-\dfrac{1}{31}\left(1+\dfrac{1}{2}+\dfrac{1}{2^2}+\dots+\dfrac{1}{2^{19}}\right)$.

Tổng trong ngoặc là tổng 20 số hạng của cấp số nhân có số hạng đầu 1, công bội $\dfrac{1}{2}$, bằng $\dfrac{1-\left(\frac{1}{2}\right)^{20}}{1-\frac{1}{2}}=2\cdot\dfrac{2^{20}-1}{2^{20}}$.

Do đó $T=-\dfrac{2}{31}\cdot\dfrac{2^{20}-1}{2^{20}}=\dfrac{1-2^{20}}{31\cdot2^{19}}$, khác giá trị $\dfrac{1-2^{20}}{15\cdot2^{19}}$ đề cho. Mệnh đề sai.

### Câu 48 | kho=dai | loai=dung_sai | dap_an=DDSS
**Đề:** Cho cấp số nhân $(u_n)$ có công bội nguyên và các số hạng thoả mãn $\begin{cases} u_4-u_2=54 \\ u_5-u_3=108 \end{cases}$.
a) Số hạng đầu của cấp số nhân bằng 9.
b) Tổng của 9 số hạng đầu tiên bằng 4599.
c) Số 576 là số hạng thứ 6 của cấp số nhân.
d) Gọi dãy số $(v_n)$: $v_n=u_{3n}$, với $n\in\mathbb{N}^*$. Khi đó tổng $v_1+v_2+v_3+\dots+v_{10}=12\left(4^{10}-1\right)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn các số hạng theo $u_1$ và $q$, chia hai phương trình của hệ để tìm $q$ rồi tìm $u_1$.

**Bước 1.** Viết $u_4-u_2$ và $u_5-u_3$ theo $u_1$ và $q$, đặt nhân tử chung để thấy quan hệ giữa hai vế.

**Bước 2.** Chia hai phương trình cho nhau để tìm công bội $q$, rồi thay vào một phương trình để tìm $u_1$.

**Bước 3.** Ý a, b, c: dùng giá trị $u_1$, $q$ để kiểm tra số hạng đầu, tổng 9 số hạng đầu và vị trí của số 576.

**Bước 4.** Ý d: viết $v_n=u_{3n}$, nhận ra $(v_n)$ cũng là cấp số nhân, tính $v_1$ và công bội mới rồi tính tổng 10 số hạng.

**Phần 2. Trình bày**

Ta có $u_4-u_2=u_1q(q^2-1)=54$ (1) và $u_5-u_3=u_1q^2(q^2-1)=108$ (2).

Chia (2) cho (1) (hai vế đều khác 0) ta được $q=2$ (thoả $q$ nguyên).

Thay vào (1): $u_1\cdot2\cdot3=54$, suy ra $u_1=9$.

Ý a) $u_1=9$. Mệnh đề đúng.

Ý b) $S_9=9\cdot\dfrac{2^9-1}{2-1}=9\cdot511=4599$. Mệnh đề đúng.

Ý c) $u_n=9\cdot2^{n-1}$. Khi $9\cdot2^{n-1}=576$ thì $2^{n-1}=64=2^6$ nên $n=7$. Do đó 576 là số hạng thứ 7, không phải thứ 6. Mệnh đề sai.

Ý d) $v_n=u_{3n}=9\cdot2^{3n-1}$ nên $v_1=u_3=36$ và $\dfrac{v_{n+1}}{v_n}=2^3=8$.

Suy ra $v_1+v_2+\dots+v_{10}=36\cdot\dfrac{8^{10}-1}{8-1}=\dfrac{36\cdot(8^{10}-1)}{7}$, bằng 5 522 100 804, còn $12\left(4^{10}-1\right)=12\,582\,900$. Hai giá trị khác nhau. Mệnh đề sai.

### Câu 49 | kho=dai | loai=dung_sai | dap_an=DDSD
**Đề:** Do nhu cầu đi lại của gia đình, anh Bình quyết định thực hiện tích góp tiền để mua một chiếc ôtô HONDA CRV trị giá 1,259 tỉ đồng.
Đợt thứ nhất: anh Bình đã tích góp theo nguyên tắc tháng sau tích góp nhiều hơn tháng ngay trước đó số tiền là 2 triệu đồng và cứ như thế đến tháng thứ 10 anh phải góp 21 triệu đồng. Đến hết đợt thứ nhất anh Bình có tất cả 624 triệu đồng.
Đợt thứ hai kế tiếp: do muốn rút ngắn thời gian mua xe thì số tiền còn lại anh tiếp tục tích góp với tháng đầu là 5 triệu đồng và mỗi tháng tiếp theo số tiền gấp đôi tháng kề trước nó. Xét tính đúng sai của các khẳng định sau:
a) Đợt thứ nhất anh Bình tích lũy tiền theo dãy số với cấp số cộng có công sai là $d=2$ triệu và $u_1=3$ triệu.
b) Đợt thứ hai anh Bình tích lũy tiền theo dãy số với cấp số nhân có công bội là $q=2$ triệu và $u_1=5$ triệu.
c) Anh Bình tích lũy tiền hết đợt thứ nhất trong 25 tháng.
d) Để đủ tiền mua ôtô thì anh Bình thì anh Bình tích góp ít nhất 31 tháng.
**Ghi chú:** ở ý b đề in "q=2 triệu" (công bội không có đơn vị); hiểu là công bội $q=2$ và $u_1=5$ triệu nên xét Đúng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đợt một là cấp số cộng, đợt hai là cấp số nhân; dùng tổng đã cho để tìm số tháng.

**Bước 1.** Ý a: từ $u_{10}=21$ và công sai đã cho tìm số hạng đầu của cấp số cộng đợt thứ nhất.

**Bước 2.** Ý c: lập tổng $n$ số hạng đầu của cấp số cộng bằng 624 triệu rồi giải phương trình bậc hai ẩn $n$.

**Bước 3.** Ý b: xác định công bội và số hạng đầu của đợt thứ hai từ mô tả "gấp đôi tháng trước" và "tháng đầu 5 triệu".

**Bước 4.** Ý d: tính số tiền còn thiếu sau đợt một, dùng tổng cấp số nhân để tìm số tháng của đợt hai, rồi cộng hai đợt.

**Phần 2. Trình bày**

Ý a) Đợt một là cấp số cộng có $d=2$ và $u_{10}=21$ nên $u_1=21-9\cdot2=3$ (triệu). Mệnh đề đúng.

Ý b) Mỗi tháng gấp đôi tháng trước và tháng đầu 5 triệu nên đợt hai là cấp số nhân có $q=2$ (công bội là một số, không có đơn vị) và $u_1=5$ triệu. Mệnh đề đúng.

Ý c) Gọi $n$ là số tháng của đợt một: $S_n=\dfrac{n[2\cdot3+(n-1)\cdot2]}{2}=n(n+2)=624$.

$n^2+2n-624=0$

$(n-24)(n+26)=0$

Vì $n>0$ nên $n=24$, không phải 25. Mệnh đề sai.

Ý d) Số tiền còn thiếu sau đợt một là $1259-624=635$ (triệu đồng).

Gọi $m$ là số tháng đợt hai: $5\cdot\dfrac{2^m-1}{2-1}\ge635$, suy ra $2^m\ge128=2^7$ nên $m\ge7$.

Số tháng ít nhất là $24+7=31$. Mệnh đề đúng.

### Câu 50 | kho=dai | loai=tra_loi_ngan | dap_an=6
**Đề:** Người ta thiết kế một cái tháp gồm 11 tầng. Diện tích bề mặt của mỗi tầng bằng nửa diện tích của bề mặt của tầng ngay bên dưới và diện tích bề mặt của tầng một bằng nửa diện tích đế tháp. Biết diện tích bề mặt đế tháp là $12288\,\text{m}^2$. Diện tích bề mặt của tầng trên cùng là:

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích các tầng lập thành cấp số nhân có công bội bằng một nửa, tầng một là số hạng đầu.

**Bước 1.** Tính diện tích tầng một từ diện tích đế tháp theo đề bài.

**Bước 2.** Xác định công bội của cấp số nhân diện tích các tầng từ quan hệ mỗi tầng so với tầng ngay dưới.

**Bước 3.** Tầng trên cùng là số hạng thứ 11 nên dùng công thức số hạng tổng quát để tính diện tích.

**Phần 2. Trình bày**

Diện tích tầng một là $u_1=\dfrac{12288}{2}=6144$ ($\text{m}^2$).

Diện tích các tầng lập thành cấp số nhân có công bội $q=\dfrac{1}{2}$.

Tầng trên cùng là tầng thứ 11: $u_{11}=u_1\cdot q^{10}=6144\cdot\dfrac{1}{1024}=6$.

Vậy diện tích bề mặt tầng trên cùng là $6\,\text{m}^2$.

### Câu 51 | kho=dai | loai=tra_loi_ngan | dap_an=2,5
**Đề:** Cho cấp số nhân $(u_n)$ với $u_3=5$ và công bội $q=2$. Giá trị của $u_2$ bằng bao nhiêu?

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai số hạng liên tiếp của cấp số nhân liên hệ với nhau qua công bội.

**Bước 1.** Viết hệ thức giữa $u_3$ và $u_2$ theo công bội $q$.

**Bước 2.** Rút $u_2$ từ hệ thức đó bằng cách chia cho công bội.

**Bước 3.** Thay số và viết kết quả dạng số thập phân.

**Phần 2. Trình bày**

Ta có $u_3=u_2\cdot q$ nên $u_2=\dfrac{u_3}{q}=\dfrac{5}{2}=2{,}5$.

Vậy $u_2=2{,}5$.

### Câu 52 | kho=dai | loai=tra_loi_ngan | dap_an=12
**Đề:** Cho bốn số $a,\ b,\ c,\ d$ theo thứ tự lập thành cấp số cộng có công sai dương. Biết rằng tổng của bốn số hạng bằng 13 và tổng của ba số đầu bằng $\dfrac{15}{2}$. Tính tổng ba số cuối.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết bốn số theo số hạng đầu và công sai rồi lập hệ hai phương trình ẩn số hạng đầu và công sai.

**Bước 1.** Biểu diễn $b,\ c,\ d$ qua $a$ và công sai $r$ rồi viết hai tổng đã cho theo $a$ và $r$.

**Bước 2.** Giải hệ phương trình bậc nhất hai ẩn vừa lập để tìm $a$ và $r$, kiểm tra điều kiện công sai dương.

**Bước 3.** Tổng ba số cuối bằng tổng bốn số trừ số hạng đầu nên dùng giá trị $a$ vừa tìm để tính.

**Phần 2. Trình bày**

Gọi công sai là $r>0$ thì $b=a+r$, $c=a+2r$, $d=a+3r$.

Tổng bốn số: $4a+6r=13$ (1).

Tổng ba số đầu: $3a+3r=\dfrac{15}{2}$ nên $a+r=\dfrac{5}{2}$ (2).

Từ (2) có $a=\dfrac{5}{2}-r$, thay vào (1): $10-4r+6r=13$.

$2r=3$ nên $r=\dfrac{3}{2}>0$ (thoả), suy ra $a=1$.

Ba số cuối có tổng $b+c+d=13-a=12$.

Vậy tổng ba số cuối bằng 12.

### Câu 53 | kho=dai | loai=tra_loi_ngan | dap_an=20
**Đề:** Một kiến trúc sư thiết kế một hội trường với 15 ghế ngồi ở hàng thứ nhất, 18 ghế ngồi ở hàng thứ hai, 21 ghế ngồi ở hàng thứ ba và cứ như vậy (số ghế hàng sau nhiều hơn 3 ghế so với số ghế hàng liền trước nó). Nếu muốn hội trường có sức chứa ít nhất 870 ghế ngồi thì kiến trúc sư phải thiết kế số hàng ghế ngồi tối thiểu là bao nhiêu?

**Phần 1. Hướng dẫn**

**Mấu chốt:** số ghế các hàng lập thành cấp số cộng, tổng số ghế của $n$ hàng phải không nhỏ hơn 870.

**Bước 1.** Xác định số hạng đầu và công sai của cấp số cộng số ghế các hàng.

**Bước 2.** Viết tổng số ghế của $n$ hàng theo công thức tổng cấp số cộng và lập bất phương trình bậc hai ẩn $n$.

**Bước 3.** Phân tích vế trái thành nhân tử rồi giải bất phương trình tích với điều kiện $n$ nguyên dương để chọn $n$ nhỏ nhất.

**Phần 2. Trình bày**

Số ghế các hàng lập thành cấp số cộng có $u_1=15$, $d=3$.

Tổng số ghế của $n$ hàng là $S_n=\dfrac{n[2\cdot15+(n-1)\cdot3]}{2}=\dfrac{n(3n+27)}{2}$.

Cần $S_n\ge870$ nên $3n^2+27n\ge1740$.

$n^2+9n-580\ge0$

$(n-20)(n+29)\ge0$

Vì $n>0$ nên $n+29>0$, suy ra $n\ge20$.

Vậy số hàng ghế tối thiểu là 20.

## GHI CHÚ CHO NGƯỜI DUYỆT
- Khúc 7 gồm Câu 28–53 (trang 21–23, đuôi Câu 53 đọc ở trang 24). Không có hình đề.
- Câu 47d: đề in mẫu $15\cdot2^{19}$ nhưng tính đúng là $31\cdot2^{19}$ (nghi đề in sai) nên ý d xét Sai theo số in.
- Câu 49b: đề in "công bội q=2 triệu" (thừa đơn vị), xét Đúng như đã ghi chú. Câu 49c: đề nói 25 tháng, tính ra 24 tháng.
- Câu 44: dùng máy tính bỏ túi thử luỹ thừa $(1{,}0058)^n$ (không dùng logarit, vì chưa học); kết quả n = 32.
- Câu 36, 42: đề in dấu chấm làm dấu nhân (7.3^n, 4.10^5), gõ lại bằng \cdot.
- Câu 29: tính đủ 89 ngày (tháng 2/2018 có 28 ngày).
