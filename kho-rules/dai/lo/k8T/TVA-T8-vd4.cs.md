=== T8D2C3.2@p197
- bai: 2 · y: - · trang: 197 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · đặt ẩn phụ · tách tử thành tổng của bội mẫu và một bình phương
- kiem: khong
- ket_qua_sach: min A = 2 khi x = 2
- dap_an: GTNN $A=2$, đạt khi $x=2$
- ghi_chu_nghi: nhãn "Ví dụ 2" ở đầu trang 197 (ví dụ 1 của Cách 3 do trạm trước làm, đề ở trang 196). Sách giải hai cách; lời giải kho đi Cách 2, Cách 1 nhắc trong Chú ý.
## DE
Tìm giá trị nhỏ nhất của $A=\dfrac{3x^2-8x+6}{x^2-2x+1}$.
## SACH
Cách 1. Đặt $x-1=y$ thì $x=y+1$. Ta có:
$A=\dfrac{3(y+1)^2-8(y+1)+6}{y^2}=\dfrac{3y^2-2y+1}{y^2}=3-\dfrac{2}{y}+\dfrac{1}{y^2}$,
Lại đặt $\dfrac{1}{y}=z$ thì: $A=3-2z+z^2=(z-1)^2+2\ge2$.
$\min A=2\Leftrightarrow z=1\Leftrightarrow y=1\Leftrightarrow x-1=1\Leftrightarrow x=2$.
Cách 2. Viết $A$ dưới dạng tổng của $2$ với một biểu thức không âm:
$A=\dfrac{(2x^2-4x+2)+(x^2-4x+4)}{x^2-2x+1}=2+\dfrac{(x-2)^2}{(x-1)^2}\ge2$.
$\min A=2$ khi và chỉ khi $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu thức là $(x-1)^2$ nên nếu tách tử thành một bội của mẫu cộng với một bình phương thì $A$ bằng một hằng số cộng với một biểu thức không âm.

**Bước 1.** Nhận ra mẫu là $(x-1)^2$ rồi nêu điều kiện xác định $x\neq1$ để $A$ có nghĩa.

**Bước 2.** Lấy tử trừ đi một bội thích hợp của mẫu sao cho phần còn lại là một bình phương, vì khi đó phép chia cho mẫu cho ra một phân thức không âm.

**Bước 3.** Viết $A$ thành hằng số cộng phân thức bình phương chia bình phương rồi suy ra cận dưới của $A$ với mọi $x\neq1$.

**Bước 4.** Giải điều kiện dấu bằng và kiểm tra giá trị tìm được thỏa $x\neq1$ để chứng tỏ cận dưới đó đạt được.

**Chú ý:** Có thể đặt $y=x-1$ rồi $z=\dfrac{1}{y}$ để đưa $A$ về tam thức bậc hai $(z-1)^2+2$; nhưng phải nhớ $y\neq0$ nên $z\neq0$, và dấu bằng ứng với $z=1$ hợp lệ.

**Phần 2. Trình bày**

Điều kiện: $x\neq1$. Với mọi $x\neq1$:

$A=\dfrac{3x^2-8x+6}{(x-1)^2}=\dfrac{2(x-1)^2+(x-2)^2}{(x-1)^2}$

$=2+\dfrac{(x-2)^2}{(x-1)^2}$

Vì $\dfrac{(x-2)^2}{(x-1)^2}\ge0$ nên $A\ge2$ với mọi $x\neq1$.

Dấu bằng xảy ra khi $(x-2)^2=0$, tức $x=2$; giá trị này thỏa $x\neq1$ nên tồn tại $x$ để $A=2$ (thật vậy $A(2)=\dfrac{12-16+6}{1}=2$).

Vậy GTNN của $A$ bằng $2$, đạt khi $x=2$.

=== T8D2C3.3@p197
- bai: 3 · y: - · trang: 197 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · đặt ẩn phụ nghịch đảo · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: P nhỏ nhất = \dfrac{3}{4} khi x = 1
- dap_an: GTNN $P=\dfrac{3}{4}$, đạt khi $x=1$
- ghi_chu_nghi: Cách 2 của sách có hai chỗ lệch. (1) Lập luận "xét tích $x\cdot\dfrac{1}{x}=1$ không đổi, vậy $x+\dfrac{1}{x}$ đạt giá trị nhỏ nhất khi $\dfrac{1}{x}=x$" chỉ đúng khi $x>0$; với $x<0$ thì $x+\dfrac{1}{x}\le-2$ và không có giá trị nhỏ nhất, đề không cho $x>0$. (2) Dòng cuối in "Khi ấy $P-1=\dfrac{1}{4}$ hay $P=\dfrac{3}{4}$": vế đúng phải là $P-1=-\dfrac{1}{4}$. Cách 1 của sách đúng. Lời giải kho đi theo Cách 1.
## DE
Tìm giá trị của $x$ để biểu thức $P=\dfrac{x^2+x+1}{x^2+2x+1}$ $(x\neq-1)$ đạt giá trị nhỏ nhất.
## SACH
Cách 1: $\dfrac{x^2+x+1}{x^2+2x+1}=1-\dfrac{x}{(x+1)^2}$
$=1-\dfrac{1}{x+1}+\dfrac{1}{(x+1)^2}=\left[\dfrac{1}{4}-\dfrac{1}{x+1}+\dfrac{1}{(x+1)^2}\right]+\dfrac{3}{4}$
$=\left(\dfrac{1}{2}-\dfrac{1}{x+1}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}$. $P$ đạt giá trị nhỏ nhất là $\dfrac{3}{4}$ khi $x=1$.
Cách 2: Ta xét biểu thức:
$P-1=\dfrac{x^2+x+1}{x^2+2x+1}-1=\dfrac{-x}{x^2+2x+1}=\dfrac{-1}{x+\dfrac{1}{x}+2}$
$P-1$ đạt giá trị nhỏ nhất khi $x+\dfrac{1}{x}+2$ đạt giá trị nhỏ nhất, hay $x+\dfrac{1}{x}$ đạt giá trị nhỏ nhất. Xét tích $x\cdot\dfrac{1}{x}=1$ không đổi. Vậy $x+\dfrac{1}{x}$ đạt giá trị nhỏ nhất khi $\dfrac{1}{x}=x$ cho ta $x=\pm1$. (loại giá trị $x=-1$). Tóm lại $P-1$ có giá trị nhỏ nhất là $-\dfrac{1}{4}$ khi $x=1$. Khi ấy $P-1=\dfrac{1}{4}$ hay $P=\dfrac{3}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là $(x+1)^2$ nên đặt nghịch đảo $\dfrac{1}{x+1}$ làm biến mới thì $P$ trở thành tam thức bậc hai của biến đó, và hoàn thành bình phương cho ra cực trị.

**Bước 1.** Viết tử $x^2+x+1$ thành mẫu trừ đi $x$, rồi tách $x=(x+1)-1$ để $P$ chỉ còn các phân thức có mẫu là lũy thừa của $x+1$.

**Bước 2.** Gom các hạng tử chứa $\dfrac{1}{x+1}$ thành một bình phương hoàn chỉnh cộng với một hằng số, tức là đưa $P$ về dạng $g^2+C$.

**Bước 3.** Từ $g^2\ge0$ suy ra cận dưới của $P$ với mọi $x\neq-1$.

**Bước 4.** Giải điều kiện $g=0$ và kiểm tra giá trị tìm được khác $-1$ để chứng tỏ cận dưới đạt được.

**Chú ý:** Cách đặt $x+\dfrac{1}{x}$ rồi dùng "tích không đổi thì tổng nhỏ nhất" chỉ hợp lệ khi $x>0$; ở bài này $x$ có thể âm nên cần tránh cách đó. Cũng có thể xét hiệu $P-\dfrac{3}{4}=\dfrac{(x-1)^2}{4(x+1)^2}\ge0$.

**Phần 2. Trình bày**

Điều kiện: $x\neq-1$. Với mọi $x\neq-1$:

$P=\dfrac{(x^2+2x+1)-x}{(x+1)^2}=1-\dfrac{x}{(x+1)^2}=1-\dfrac{(x+1)-1}{(x+1)^2}$

$=1-\dfrac{1}{x+1}+\dfrac{1}{(x+1)^2}$

$=\left(\dfrac{1}{x+1}-\dfrac{1}{2}\right)^2+\dfrac{3}{4}$

Vì bình phương không âm nên $P\ge\dfrac{3}{4}$ với mọi $x\neq-1$.

Dấu bằng xảy ra khi $\dfrac{1}{x+1}=\dfrac{1}{2}\Leftrightarrow x+1=2\Leftrightarrow x=1$; giá trị này thỏa $x\neq-1$ nên $P=\dfrac{3}{4}$ đạt được (thật vậy $P(1)=\dfrac{3}{4}$).

Vậy $P$ đạt giá trị nhỏ nhất bằng $\dfrac{3}{4}$ khi $x=1$.

=== T8D2C3.4@p198
- bai: 4 · y: - · trang: 198 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · tách tử thành bội mẫu và bình phương
- kiem: khong
- ket_qua_sach: min A = -1 khi x = 2; A = 4 (lớn nhất) khi x = -\dfrac{1}{2}
- dap_an: GTNN $A=-1$, đạt khi $x=2$; GTLN $A=4$, đạt khi $x=-\dfrac{1}{2}$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất, giá trị nhỏ nhất của: $A=\dfrac{3-4x}{x^2+1}$.
## SACH
Để tìm giá trị nhỏ nhất ta viết $A$ dưới dạng:
$A=\dfrac{x^2-4x+4-x^2-1}{x^2+1}=\dfrac{(x-2)^2}{x^2+1}-1\ge-1$. Vậy $\min A=-1$ khi và chỉ khi $x=2$. Để tìm giá trị lớn nhất, viết $A$ dưới dạng:
$A=\dfrac{4x^2+4-4x^2-4x-1}{x^2+1}=4-\dfrac{(2x+1)^2}{x^2+1}\le4$.
Mà $A=4$ khi và chỉ khi $x=-\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2+1$ luôn dương, nên nếu viết $A$ thành "hằng số cộng hoặc trừ một bình phương chia cho $x^2+1$" thì đánh giá được cả hai phía bằng cách xét dấu của phần bình phương.

**Bước 1.** Nêu $x^2+1>0$ với mọi $x$ để $A$ xác định trên toàn bộ số thực, rồi chia bài làm hai nửa là tìm giá trị nhỏ nhất và tìm giá trị lớn nhất.

**Bước 2.** Với giá trị nhỏ nhất, tách tử $3-4x$ thành một bình phương chứa hạng tử $-4x$ trừ đi một bội của mẫu, để $A$ bằng một phân thức không âm trừ một hằng số.

**Bước 3.** Với giá trị lớn nhất, tách tử thành một bội của mẫu trừ đi một bình phương chứa hạng tử $4x$ (bội chọn để hạng tử $x^2$ triệt tiêu), để $A$ bằng một hằng số trừ một phân thức không âm.

**Bước 4.** Với mỗi nửa, giải điều kiện dấu bằng và tính lại $A$ tại giá trị tìm được để khẳng định cực trị đạt được.

**Phần 2. Trình bày**

Vì $x^2+1>0$ với mọi $x$ nên $A$ xác định với mọi $x$.

Tìm GTNN:

$A=\dfrac{(x-2)^2-(x^2+1)}{x^2+1}=\dfrac{(x-2)^2}{x^2+1}-1$

Vì $\dfrac{(x-2)^2}{x^2+1}\ge0$ nên $A\ge-1$ với mọi $x$. Dấu bằng xảy ra khi $x-2=0$, tức $x=2$ (thật vậy $A(2)=\dfrac{3-8}{5}=-1$). Vậy GTNN của $A$ bằng $-1$, đạt khi $x=2$.

Tìm GTLN:

$A=\dfrac{4(x^2+1)-(2x+1)^2}{x^2+1}=4-\dfrac{(2x+1)^2}{x^2+1}$

Vì $\dfrac{(2x+1)^2}{x^2+1}\ge0$ nên $A\le4$ với mọi $x$. Dấu bằng xảy ra khi $2x+1=0$, tức $x=-\dfrac{1}{2}$ (thật vậy $A\left(-\dfrac{1}{2}\right)=\dfrac{5}{\dfrac{5}{4}}=4$). Vậy GTLN của $A$ bằng $4$, đạt khi $x=-\dfrac{1}{2}$.

=== T8D2C3.5@p198
- bai: 5 · y: - · trang: 198 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương (A lớn nhất ⇔ 1/A nhỏ nhất khi A>0) · bất đẳng thức $2x^2\le x^4+1$
- kiem: khong
- ket_qua_sach: max A = 1 khi x = 0; min A = \dfrac{1}{2} khi x = \pm1
- dap_an: GTLN $A=1$, đạt khi $x=0$; GTNN $A=\dfrac{1}{2}$, đạt khi $x=\pm1$
- ghi_chu_nghi: sách in "$\max A=2$ khi và chỉ khi $x^2=1$" ở dòng "Suy ra $\dfrac{1}{A}\le1+1=2$": đúng phải là $\max\dfrac{1}{A}=2$ (rồi mới suy ra $\min A=\dfrac{1}{2}$). Phần Chú ý 2 Cách 1 của sách chỉ có đúng một dòng "Đặt $\dfrac{1}{x^2+1}=y$", không có lời giải tiếp. Mép trang mất vài chữ ở các dòng "$\dfrac{1}{A}$" nhưng đọc được theo ngữ cảnh.
## DE
Tìm giá trị lớn nhất, giá trị nhỏ nhất của $A=\dfrac{x^4+1}{(x^2+1)^2}$.
## SACH
Chú ý rằng $A>0$ nên $A$ lớn nhất $\Leftrightarrow\dfrac{1}{A}$ nhỏ nhất
$A$ nhỏ nhất $\Leftrightarrow\dfrac{1}{A}$ lớn nhất. Ta có:
$\dfrac{1}{A}=\dfrac{(x^2+1)^2}{x^4+1}=\dfrac{x^4+2x^2+1}{x^4+1}=1+\dfrac{2x^2}{x^4+1}$.
Tìm giá trị lớn nhất của $A$: Ta có $2x^2\ge0$, $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\ge0$. Suy ra $\dfrac{1}{A}\ge1+0=1$; $\min\dfrac{1}{A}=1$ khi và chỉ khi $x=0$. Do đó $\max A=1$ khi và chỉ khi $x=0$.
Tìm giá trị nhỏ nhất của $A$: Ta có $2x^2\le x^4+1$ (dễ chứng minh, dấu "=" xảy ra khi và chỉ khi $x^2=1$) mà $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\le1$. Suy ra $\dfrac{1}{A}\le1+1=2$; $\max A=2$ khi và chỉ khi $x^2=1$. Do đó $\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\pm1$.
Chú ý:
1. Cách khác tìm giá trị lớn nhất của $A$:
$A=\dfrac{(x^2+1)^2-2x^2}{(x^2+1)^2}=1-\dfrac{2x^2}{(x^2+1)^2}\le1$. $\max A=1$ khi và chỉ khi $x=0$.
2. Cách khác tìm giá trị nhỏ nhất của $A$:
Cách 1. Đặt $\dfrac{1}{x^2+1}=y$.
Cách 2. $A=\dfrac{2x^4+2}{2(x^2+1)^2}=\dfrac{(x^2+1)^2+(x^2-1)^2}{2(x^2+1)^2}=\dfrac{1}{2}+\dfrac{(x^2-1)^2}{2(x^2+1)^2}\ge\dfrac{1}{2}$.
$\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $A$ luôn dương nên $A$ lớn nhất khi nghịch đảo $\dfrac{1}{A}$ nhỏ nhất và $A$ nhỏ nhất khi $\dfrac{1}{A}$ lớn nhất; hơn nữa $\dfrac{1}{A}$ tách được thành $1$ cộng một phân thức rất dễ đánh giá.

**Bước 1.** Chỉ ra tử và mẫu của $A$ đều dương với mọi $x$ để được $A>0$ và chuyển bài toán sang biểu thức nghịch đảo $\dfrac{1}{A}$.

**Bước 2.** Khai triển $(x^2+1)^2$ rồi tách $\dfrac{1}{A}$ thành $1$ cộng với phân thức có tử $2x^2$ và mẫu $x^4+1$.

**Bước 3.** Dùng $2x^2\ge0$ để chặn dưới $\dfrac{1}{A}$, từ đó suy ra cận trên của $A$ và tìm $x$ để cận đó đạt được.

**Bước 4.** Dùng bất đẳng thức $2x^2\le x^4+1$ để chặn trên $\dfrac{1}{A}$, từ đó suy ra cận dưới của $A$ và tìm $x$ để dấu bằng xảy ra.

**Chú ý:** Quan hệ "$A$ lớn nhất khi $\dfrac{1}{A}$ nhỏ nhất" chỉ dùng được khi $A$ không đổi dấu (ở đây $A>0$). Cũng có thể viết $A=1-\dfrac{2x^2}{(x^2+1)^2}$ để thấy ngay $A\le1$, hoặc $A=\dfrac{1}{2}+\dfrac{(x^2-1)^2}{2(x^2+1)^2}$ để thấy ngay $A\ge\dfrac{1}{2}$.

**Phần 2. Trình bày**

Vì $x^4+1>0$ và $(x^2+1)^2>0$ nên $A$ xác định với mọi $x$ và $A>0$.

$\dfrac{1}{A}=\dfrac{(x^2+1)^2}{x^4+1}=\dfrac{x^4+2x^2+1}{x^4+1}=1+\dfrac{2x^2}{x^4+1}$

Tìm GTLN của $A$: vì $2x^2\ge0$ và $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\ge0$, suy ra $\dfrac{1}{A}\ge1$, mà $A>0$ nên $A\le1$. Dấu bằng xảy ra khi $2x^2=0$, tức $x=0$ (thật vậy $A(0)=1$). Vậy GTLN của $A$ bằng $1$, đạt khi $x=0$.

Tìm GTNN của $A$: vì $x^4+1-2x^2=(x^2-1)^2\ge0$ nên $2x^2\le x^4+1$, và do $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\le1$. Suy ra $\dfrac{1}{A}\le2$, mà $A>0$ nên $A\ge\dfrac{1}{2}$. Dấu bằng xảy ra khi $(x^2-1)^2=0$, tức $x=\pm1$ (thật vậy $A(\pm1)=\dfrac{2}{4}=\dfrac{1}{2}$). Vậy GTNN của $A$ bằng $\dfrac{1}{2}$, đạt khi $x=\pm1$.

=== T8D2C3.6@p199
- bai: 6 · y: - · trang: 199 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · hoàn thành bình phương với hệ số 2006
- kiem: khong
- ket_qua_sach: B nhỏ nhất = \dfrac{2005}{2006} khi x = 2006
- dap_an: GTNN $B=\dfrac{2005}{2006}$, đạt khi $x=2006$
- ghi_chu_nghi: ba dòng biến đổi giữa của sách in sai (đã phóng to ảnh kiểm tra): (1) $\dfrac{2006x^2-2\cdot2006x+2006^2}{2006x}$ — mẫu phải là $2006x^2$; (2) $\dfrac{(x-2006)^2+2006x^2}{x^2}$ — phải là $\dfrac{(x-2006)^2+2005x^2}{2006x^2}$; (3) $\dfrac{(x-2006)^2+2005}{2006x^2}+\dfrac{2005}{2006}$ — phải là $\dfrac{(x-2006)^2}{2006x^2}+\dfrac{2005}{2006}$. Dòng kết luận của sách đúng. Chép đúng như in; lời giải kho viết lại đúng.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\dfrac{x^2-2x+2006}{x^2}$ (với $x\neq0$).
## SACH
$B=\dfrac{x^2-2x+2006}{x^2}$ $(x\neq0)$
Ta có: $B=\dfrac{x^2-2x+2006}{x^2}\Leftrightarrow B=\dfrac{2006x^2-2\cdot2006x+2006^2}{2006x}$
$\Leftrightarrow B=\dfrac{(x-2006)^2+2006x^2}{x^2}\Leftrightarrow B=\dfrac{(x-2006)^2+2005}{2006x^2}+\dfrac{2005}{2006}$
Vì $(x-2006)^2\ge0$ với mọi $x$; $x^2>0$ với mọi $x$ khác $0$
$\Rightarrow\dfrac{(x-2006)^2}{2006x^2}\ge0\Rightarrow B\ge\dfrac{2005}{2006}\Rightarrow B$ nhỏ nhất $=\dfrac{2005}{2006}$ khi $x=2006$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $x^2-2x+2006$ có hệ số tự do $2006$ rất lớn, nên nhân tử với $2006$ sẽ làm xuất hiện bình phương $(x-2006)^2$ cùng một bội của $x^2$, và khi chia cho mẫu thì còn lại một hằng số cộng một phân thức không âm.

**Bước 1.** Nêu điều kiện $x\neq0$ rồi nhân cả tử và mẫu của $B$ với $2006$ để tử thành $2006x^2-2\cdot2006x+2006^2$.

**Bước 2.** Tách tử thành bình phương $(x-2006)^2$ cộng với một bội của $x^2$, nhờ so hệ số của $x$ để kiểm tra phép tách.

**Bước 3.** Chia từng hạng tử cho mẫu để được hằng số cộng với phân thức có tử là bình phương và mẫu là $2006x^2$ dương.

**Bước 4.** Đánh giá phân thức không âm đó để có cận dưới của $B$, rồi giải điều kiện dấu bằng và kiểm tra $x\neq0$.

**Chú ý:** Có thể đặt $t=\dfrac{1}{x}$ để $B=2006t^2-2t+1$, là tam thức bậc hai ẩn $t$, rồi tìm cực trị bằng cách hoàn thành bình phương.

**Phần 2. Trình bày**

Với $x\neq0$:

$B=\dfrac{x^2-2x+2006}{x^2}=\dfrac{2006x^2-2\cdot2006x+2006^2}{2006x^2}$

$=\dfrac{(x-2006)^2+2005x^2}{2006x^2}$

$=\dfrac{(x-2006)^2}{2006x^2}+\dfrac{2005}{2006}$

Vì $(x-2006)^2\ge0$ và $2006x^2>0$ với mọi $x\neq0$ nên $B\ge\dfrac{2005}{2006}$.

Dấu bằng xảy ra khi $(x-2006)^2=0$, tức $x=2006$; giá trị này khác $0$ nên $B=\dfrac{2005}{2006}$ đạt được (thật vậy $B(2006)=\dfrac{2006^2-2\cdot2006+2006}{2006^2}=\dfrac{2006\cdot2005}{2006^2}=\dfrac{2005}{2006}$).

Vậy GTNN của $B$ bằng $\dfrac{2005}{2006}$, đạt khi $x=2006$.

=== T8D2C3.7a@p199
- bai: 7 · y: a · trang: 199 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · hoàn thành bình phương (tam thức bậc hai)
- kiem: khong
- ket_qua_sach: hàm số đạt giá trị nhỏ nhất bằng -\dfrac{7}{8} khi x = \dfrac{1}{4}
- dap_an: GTLN $y=-\dfrac{7}{8}$, đạt khi $x=\dfrac{1}{4}$
- ghi_chu_nghi: đề hỏi giá trị LỚN nhất nhưng dòng kết luận của sách in "Hàm số đạt giá trị nhỏ nhất bằng $-\dfrac{7}{8}$ khi …" (in nhầm "nhỏ nhất" thay cho "lớn nhất"; các dòng trên đã chứng minh $y\le-\dfrac{7}{8}$). Chép đúng như in; lời giải kho kết luận đúng là giá trị lớn nhất.
## DE
Tìm giá trị lớn nhất của hàm số $y=-2x^2+x-1$.
## SACH
a. $y=-2x^2+x-1=-2\left(x^2-\dfrac{1}{2}x\right)-1=-2\left[x^2-2\cdot\dfrac{1}{4}x+\left(\dfrac{1}{4}\right)^2-\left(\dfrac{1}{4}\right)^2\right]-1$
$=-2\left(x-\dfrac{1}{4}\right)^2-\dfrac{7}{8}\le-\dfrac{7}{8},\ \forall x$.
Hàm số đạt giá trị nhỏ nhất bằng $-\dfrac{7}{8}$ khi $x-\dfrac{1}{4}=0\Leftrightarrow x=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hệ số của $x^2$ âm thì có giá trị lớn nhất, và hoàn thành bình phương đưa được nó về dạng một hằng số trừ một bình phương.

**Bước 1.** Đặt $-2$ làm nhân tử chung của hai hạng tử chứa $x$ để hệ số của $x^2$ trong ngoặc bằng $1$.

**Bước 2.** Thêm bớt bình phương của nửa hệ số của $x$ trong ngoặc để nhận ra bình phương của một hiệu.

**Bước 3.** Thu gọn hằng số rồi dùng bình phương không âm để chặn trên $y$, sau đó tìm $x$ làm dấu bằng xảy ra.

**Phần 2. Trình bày**

$y=-2x^2+x-1=-2\left(x^2-\dfrac{1}{2}x\right)-1$

$=-2\left[\left(x-\dfrac{1}{4}\right)^2-\dfrac{1}{16}\right]-1$

$=-2\left(x-\dfrac{1}{4}\right)^2-\dfrac{7}{8}$

Vì $\left(x-\dfrac{1}{4}\right)^2\ge0$ với mọi $x$ nên $y\le-\dfrac{7}{8}$ với mọi $x$.

Dấu bằng xảy ra khi $x-\dfrac{1}{4}=0$, tức $x=\dfrac{1}{4}$ (thật vậy $y\left(\dfrac{1}{4}\right)=-\dfrac{1}{8}+\dfrac{1}{4}-1=-\dfrac{7}{8}$).

Vậy GTLN của $y$ bằng $-\dfrac{7}{8}$, đạt khi $x=\dfrac{1}{4}$.

=== T8D2C3.7b@p199
- bai: 7 · y: b · trang: 199 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · phân tích mẫu thành nhân tử · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: hàm số đạt giá trị lớn nhất bằng \dfrac{1}{3} khi x = 1
- dap_an: GTLN $y=\dfrac{1}{3}$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của hàm số $y=\dfrac{x+1}{x^3-x^2+2x+4}$.
## SACH
b. $y=\dfrac{x+1}{x^3-x^2+2x+4}=\dfrac{x+1}{(x^2-2x+4)(x+1)}=\dfrac{1}{x^2-2x+4}$
$=\dfrac{1}{(x-1)^2+3}\le\dfrac{1}{3},\ \forall x\neq-1$.
Hàm số đạt giá trị lớn nhất bằng $\dfrac{1}{3}$ khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $x+1$ gợi ý mẫu bậc ba có nhân tử $x+1$; rút gọn nhân tử này thì $y$ chỉ còn là nghịch đảo của một tam thức bậc hai luôn dương, nên cực đại của $y$ ứng với cực tiểu của tam thức.

**Bước 1.** Nhẩm thấy $x=-1$ làm mẫu bằng $0$, từ đó phân tích mẫu thành tích của $x+1$ với một tam thức bậc hai và nêu điều kiện xác định.

**Bước 2.** Rút gọn nhân tử $x+1$ (khác $0$ trong miền xác định) để $y$ trở thành nghịch đảo của tam thức bậc hai.

**Bước 3.** Hoàn thành bình phương ở tam thức để chặn dưới nó bởi một hằng số dương, rồi suy ra cận trên của $y$.

**Bước 4.** Giải điều kiện dấu bằng và kiểm tra giá trị tìm được khác giá trị bị loại $-1$ để chứng tỏ cận trên đạt được.

**Chú ý:** Rút gọn xong vẫn phải nhớ điều kiện $x\neq-1$ của hàm số ban đầu; ở đây giá trị làm cực trị xảy ra không trùng với giá trị bị loại nên kết luận không bị ảnh hưởng.

**Phần 2. Trình bày**

$x^3-x^2+2x+4=x^3+x^2-2x^2-2x+4x+4=(x+1)(x^2-2x+4)$, trong đó $x^2-2x+4=(x-1)^2+3>0$ với mọi $x$. Nên hàm số xác định khi $x\neq-1$.

Với $x\neq-1$:

$y=\dfrac{x+1}{(x+1)(x^2-2x+4)}=\dfrac{1}{x^2-2x+4}=\dfrac{1}{(x-1)^2+3}$

Vì $(x-1)^2+3\ge3>0$ nên $y\le\dfrac{1}{3}$ với mọi $x\neq-1$.

Dấu bằng xảy ra khi $(x-1)^2=0$, tức $x=1$; giá trị này khác $-1$ nên đạt được (thật vậy $y(1)=\dfrac{2}{1-1+2+4}=\dfrac{1}{3}$).

Vậy GTLN của $y$ bằng $\dfrac{1}{3}$, đạt khi $x=1$.

=== T8D2C3.8a@p200
- bai: 8 · y: a · trang: 200 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · hoàn thành bình phương (tam thức bậc hai)
- kiem: khong
- ket_qua_sach: min y = -2 khi x = -2
- dap_an: GTNN $y=-2$, đạt khi $x=-2$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của hàm số $y=\dfrac{x^2}{4}+x-1$.
## SACH
a. $y=\dfrac{x^2}{4}+x-1=\dfrac{1}{4}(x^2+4x)-1=\dfrac{1}{4}(x^2+4x+4-4)-1$
$=\dfrac{1}{4}(x+2)^2-2\ge-2,\ \forall x$.
Hàm số có giá trị nhỏ nhất $\min y=-2$ khi $x=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hệ số của $x^2$ dương thì có giá trị nhỏ nhất, và hoàn thành bình phương đưa được nó về dạng một bình phương cộng một hằng số.

**Bước 1.** Đặt $\dfrac{1}{4}$ làm nhân tử chung của hai hạng tử chứa $x$ để hệ số của $x^2$ trong ngoặc bằng $1$.

**Bước 2.** Thêm bớt bình phương của nửa hệ số của $x$ trong ngoặc để nhận ra bình phương của một tổng.

**Bước 3.** Thu gọn hằng số, dùng bình phương không âm để chặn dưới $y$ rồi tìm $x$ làm dấu bằng xảy ra.

**Phần 2. Trình bày**

$y=\dfrac{x^2}{4}+x-1=\dfrac{1}{4}(x^2+4x)-1$

$=\dfrac{1}{4}(x^2+4x+4-4)-1$

$=\dfrac{1}{4}(x+2)^2-2$

Vì $(x+2)^2\ge0$ với mọi $x$ nên $y\ge-2$ với mọi $x$.

Dấu bằng xảy ra khi $x+2=0$, tức $x=-2$ (thật vậy $y(-2)=1-2-1=-2$).

Vậy GTNN của $y$ bằng $-2$, đạt khi $x=-2$.

=== T8D2C3.8b@p200
- bai: 8 · y: b · trang: 200 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương (hàm lớn nhất ⇔ phần trừ lớn nhất) · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: min y = \dfrac{1}{2} khi x = -1
- dap_an: GTNN $y=\dfrac{1}{2}$, đạt khi $x=-1$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của hàm số $y=\dfrac{x^2+2x+2}{x^2+2x+3}$.
## SACH
b. $y=\dfrac{x^2+2x+2}{x^2+2x+3}=\dfrac{(x^2+2x+3)-1}{x^2+2x+3}=1-\dfrac{1}{x^2+2x+3}=1-\dfrac{1}{(x+1)^2+2}$
Hàm số có giá trị nhỏ nhất khi $\dfrac{1}{(x+1)^2+2}$ có giá trị lớn nhất, tức là khi $(x+1)^2+2$ nhỏ nhất. Điều này xảy ra khi $x=-1$.
Vậy hàm số đã cho có giá trị nhỏ nhất $\min y=1-\dfrac{1}{2}=\dfrac{1}{2}$ khi $x=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử kém mẫu đúng một đơn vị nên $y$ bằng $1$ trừ nghịch đảo của mẫu; muốn $y$ nhỏ nhất thì nghịch đảo phải lớn nhất, tức mẫu dương phải nhỏ nhất.

**Bước 1.** Hoàn thành bình phương ở mẫu để thấy mẫu luôn dương nên $y$ xác định với mọi $x$.

**Bước 2.** Viết tử thành mẫu trừ đi $1$ rồi tách $y$ thành $1$ trừ một phân thức có tử bằng $1$.

**Bước 3.** Chặn trên phân thức bị trừ bằng cách chặn dưới mẫu của nó, từ đó suy ra cận dưới của $y$.

**Bước 4.** Tìm $x$ làm mẫu nhỏ nhất rồi tính $y$ tại đó để khẳng định cực trị đạt được.

**Phần 2. Trình bày**

Vì $x^2+2x+3=(x+1)^2+2\ge2>0$ nên $y$ xác định với mọi $x$.

$y=\dfrac{(x^2+2x+3)-1}{x^2+2x+3}=1-\dfrac{1}{(x+1)^2+2}$

Vì $(x+1)^2+2\ge2>0$ nên $\dfrac{1}{(x+1)^2+2}\le\dfrac{1}{2}$, do đó $y\ge1-\dfrac{1}{2}=\dfrac{1}{2}$ với mọi $x$.

Dấu bằng xảy ra khi $(x+1)^2=0$, tức $x=-1$ (thật vậy $y(-1)=\dfrac{1-2+2}{1-2+3}=\dfrac{1}{2}$).

Vậy GTNN của $y$ bằng $\dfrac{1}{2}$, đạt khi $x=-1$.

=== T8D2C3.9@p200
- bai: 9 · y: - · trang: 200 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương (hàm nhỏ nhất ⇔ phần trừ lớn nhất) · tách tử theo mẫu · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: min y = -\dfrac{2}{7} khi x = -1
- dap_an: GTNN $y=-\dfrac{2}{7}$, đạt khi $x=-1$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của hàm số: $y=\dfrac{x^2+2x-1}{2x^2+4x+9}$.
## SACH
$y=\dfrac{x^2+2x-1}{2x^2+4x+9}=\dfrac{\dfrac{1}{2}(2x^2+4x+9)-\dfrac{11}{2}}{2x^2+4x+9}=\dfrac{1}{2}-\dfrac{11}{4x^2+8x+18}$
$=\dfrac{1}{2}-\dfrac{11}{4(x+1)^2+14}$. Hàm số có giá trị nhỏ nhất khi $\dfrac{11}{4(x+1)^2+14}$ có giá trị lớn nhất, hay khi $4(x+1)^2+14$ có giá trị nhỏ nhất, đạt được khi $x=-1$. Vậy: $\min y=\dfrac{1}{2}-\dfrac{11}{14}=-\dfrac{2}{7}$ đạt được khi $x=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử và mẫu cùng chứa nhóm $x^2+2x$, nên tử viết được thành một nửa mẫu trừ một hằng số; khi đó $y$ bằng hằng số trừ một phân thức có tử không đổi, và cực tiểu của $y$ ứng với cực đại của phân thức đó.

**Bước 1.** Hoàn thành bình phương ở mẫu để thấy mẫu luôn dương nên $y$ xác định với mọi $x$.

**Bước 2.** Viết tử thành một nửa mẫu trừ đi một hằng số rồi tách $y$ thành hằng số trừ một phân thức có tử bằng hằng số.

**Bước 3.** Chặn dưới mẫu của phân thức bị trừ bằng một số dương để có cận trên của phân thức đó, rồi suy ra cận dưới của $y$.

**Bước 4.** Giải điều kiện dấu bằng và tính $y$ tại giá trị tìm được để khẳng định cực trị đạt được.

**Phần 2. Trình bày**

Vì $2x^2+4x+9=2(x+1)^2+7\ge7>0$ nên $y$ xác định với mọi $x$.

$y=\dfrac{\dfrac{1}{2}(2x^2+4x+9)-\dfrac{11}{2}}{2x^2+4x+9}=\dfrac{1}{2}-\dfrac{11}{2(2x^2+4x+9)}$

$=\dfrac{1}{2}-\dfrac{11}{4(x+1)^2+14}$

Vì $4(x+1)^2+14\ge14>0$ nên $\dfrac{11}{4(x+1)^2+14}\le\dfrac{11}{14}$, do đó $y\ge\dfrac{1}{2}-\dfrac{11}{14}=-\dfrac{2}{7}$ với mọi $x$.

Dấu bằng xảy ra khi $(x+1)^2=0$, tức $x=-1$ (thật vậy $y(-1)=\dfrac{1-2-1}{2-4+9}=-\dfrac{2}{7}$).

Vậy GTNN của $y$ bằng $-\dfrac{2}{7}$, đạt khi $x=-1$.

=== T8D2C3.10@p200
- bai: 10 · y: - · trang: 200 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương (P lớn nhất ⇔ 1/P nhỏ nhất) · tích không đổi thì tổng nhỏ nhất
- kiem: khong
- ket_qua_sach: max P = \dfrac{1}{2} khi x = \pm1
- dap_an: GTLN $P=\dfrac{1}{2}$, đạt khi $x=\pm1$
- ghi_chu_nghi: sách viết $P=\dfrac{1}{\dfrac{1}{x^2}+x^2}$ mà không loại $x=0$ (khi $x=0$ biểu thức này không xác định, còn $P=0$); lời giải kho xét riêng $x=0$.
## DE
Tìm giá trị lớn nhất của $P=\dfrac{x^2}{1+x^4}$.
## SACH
Viết $P$ dưới dạng $\dfrac{1}{\dfrac{1}{x^2}+x^2}$. $P$ đạt giá trị lớn nhất khi $\dfrac{1}{x^2}+x^2$ đạt giá trị nhỏ nhất. Tích $\dfrac{1}{x^2}\cdot x^2=1$ (không đổi). Vậy tổng $\dfrac{1}{x^2}+x^2$ nhỏ nhất khi $\dfrac{1}{x^2}=x^2\Rightarrow x^4=1\Rightarrow x=\pm1$. Lúc đó $P=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia cả tử và mẫu cho $x^2$ thì $P$ trở thành nghịch đảo của tổng $x^2+\dfrac{1}{x^2}$ hai số dương có tích không đổi, nên $P$ lớn nhất khi tổng này nhỏ nhất.

**Bước 1.** Xét riêng $x=0$ vì phép chia cho $x^2$ chỉ làm được khi $x\neq0$, rồi chia cả tử và mẫu cho $x^2$ với $x\neq0$.

**Bước 2.** Chứng minh tổng $x^2+\dfrac{1}{x^2}$ không nhỏ hơn một hằng số bằng cách xét hiệu của nó với hằng số đó.

**Bước 3.** Suy ra cận trên của $P$, rồi so sánh với giá trị của $P$ tại $x=0$.

**Bước 4.** Giải điều kiện dấu bằng và tính $P$ tại giá trị tìm được để khẳng định cực trị đạt được.

**Phần 2. Trình bày**

Mẫu $1+x^4>0$ nên $P$ xác định với mọi $x$.

Nếu $x=0$ thì $P=0$.

Nếu $x\neq0$ thì $P=\dfrac{x^2}{1+x^4}=\dfrac{1}{\dfrac{1}{x^2}+x^2}>0$. Ta có

$x^2+\dfrac{1}{x^2}-2=\dfrac{(x^2-1)^2}{x^2}\ge0$

nên $x^2+\dfrac{1}{x^2}\ge2$, suy ra $P\le\dfrac{1}{2}$.

Dấu bằng xảy ra khi $(x^2-1)^2=0$, tức $x=\pm1$ (thật vậy $P(\pm1)=\dfrac{1}{2}$). Vì $\dfrac{1}{2}>0$ nên cũng lớn hơn giá trị $P(0)=0$.

Vậy GTLN của $P$ bằng $\dfrac{1}{2}$, đạt khi $x=\pm1$.

=== T8D2C3.11@p201
- bai: 11 · y: - · trang: 201 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · tách tử thành bội mẫu cộng/trừ một bình phương
- kiem: khong
- ket_qua_sach: min P = \dfrac{2}{3} khi x = -1; max P = 2 khi x = 1
- dap_an: GTNN $P=\dfrac{2}{3}$, đạt khi $x=-1$; GTLN $P=2$, đạt khi $x=1$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất và giá trị nhỏ nhất của biểu thức $P=\dfrac{x^2+1}{x^2-x+1}$.
## SACH
Ta có $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0,\forall x$, $P=\dfrac{x^2+1}{x^2-x+1}=\dfrac{3(x^2+1)}{3(x^2-x+1)}$
$=\dfrac{2(x^2-x+1)+x^2+2x+1}{3(x^2-x+1)}=\dfrac{2}{3}+\dfrac{(x+1)^2}{3(x^2-x+1)}\ge\dfrac{2}{3}$.
Dấu bằng xảy ra khi và chỉ khi $x=-1$. Vậy giá trị nhỏ nhất của biểu thức $P=\dfrac{2}{3}$, khi $x=-1$. Mặt khác ta có :
$P=\dfrac{x^2+1}{x^2-x+1}=\dfrac{2x^2-2x+2-x^2+2x-1}{x^2-x+1}=\dfrac{2(x^2-x+1)-(x-1)^2}{x^2-x+1}$
$=2-\dfrac{(x-1)^2}{x^2-x+1}\le2$. Dấu bằng xảy ra khi và chỉ khi $x=1$. Vậy giá trị lớn nhất của $P$ là $2$ khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2-x+1$ luôn dương, nên với mỗi phía (nhỏ nhất, lớn nhất) chỉ cần tách tử thành một bội của mẫu cộng hoặc trừ một bình phương rồi đánh giá dấu của phần bình phương chia cho mẫu.

**Bước 1.** Hoàn thành bình phương ở mẫu để chứng tỏ mẫu luôn dương, nên $P$ xác định với mọi $x$ và dấu của phân thức chỉ phụ thuộc tử.

**Bước 2.** Với giá trị nhỏ nhất, nhân cả tử và mẫu với $3$ rồi tách tử thành một bội của mẫu cộng thêm một bình phương, để $P$ bằng hằng số cộng một phân thức không âm.

**Bước 3.** Với giá trị lớn nhất, tách tử thành một bội của mẫu trừ đi một bình phương, để $P$ bằng hằng số trừ một phân thức không âm.

**Bước 4.** Với mỗi phía, giải điều kiện dấu bằng và tính $P$ tại giá trị tìm được để khẳng định cực trị đạt được.

**Phần 2. Trình bày**

Vì $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ với mọi $x$ nên $P$ xác định với mọi $x$.

Tìm GTNN:

$P=\dfrac{3(x^2+1)}{3(x^2-x+1)}=\dfrac{2(x^2-x+1)+(x+1)^2}{3(x^2-x+1)}=\dfrac{2}{3}+\dfrac{(x+1)^2}{3(x^2-x+1)}$

Vì $(x+1)^2\ge0$ và $3(x^2-x+1)>0$ nên $P\ge\dfrac{2}{3}$ với mọi $x$. Dấu bằng xảy ra khi $x+1=0$, tức $x=-1$ (thật vậy $P(-1)=\dfrac{2}{3}$). Vậy GTNN của $P$ bằng $\dfrac{2}{3}$, đạt khi $x=-1$.

Tìm GTLN:

$P=\dfrac{2(x^2-x+1)-(x-1)^2}{x^2-x+1}=2-\dfrac{(x-1)^2}{x^2-x+1}$

Vì $(x-1)^2\ge0$ và $x^2-x+1>0$ nên $P\le2$ với mọi $x$. Dấu bằng xảy ra khi $x-1=0$, tức $x=1$ (thật vậy $P(1)=\dfrac{2}{1}=2$). Vậy GTLN của $P$ bằng $2$, đạt khi $x=1$.

=== T8D2C3.12@p201
- bai: 12 · y: - · trang: 201 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030202
- cong_cu: Cách 3: thay điều kiện để biểu thức đạt cực trị bởi điều kiện tương đương · đặt ẩn phụ $x+\dfrac{1}{x}$ · hằng đẳng thức hiệu hai bình phương · bất đẳng thức $x+\dfrac{1}{x}\ge2$ với $x>0$
- kiem: khong
- ket_qua_sach: P_min = 6 khi x = 1
- dap_an: GTNN $P=6$, đạt khi $x=1$
- ghi_chu_nghi: lời giải sách nhảy bước: viết thẳng "$P=\left(x+\dfrac{1}{x}\right)^3-\left(x^3+\dfrac{1}{x^3}\right)=3\left(x+\dfrac{1}{x}\right)$" mà không nêu cách rút gọn tử thức (cần $x^6+\dfrac{1}{x^6}=\left(x^3+\dfrac{1}{x^3}\right)^2-2$) và bước $\left(x+\dfrac{1}{x}\right)^3-\left(x^3+\dfrac{1}{x^3}\right)=3\left(x+\dfrac{1}{x}\right)$. Lời giải kho viết đủ các bước.
## DE
Cho $x>0$, hãy tìm giá trị nhỏ nhất của biểu thức:
$P=\dfrac{\left(x+\dfrac{1}{x}\right)^6-\left(x^6+\dfrac{1}{x^6}\right)-2}{\left(x+\dfrac{1}{x}\right)^3+x^3+\dfrac{1}{x^3}}$
## SACH
Ta có: $P=\dfrac{\left(x+\dfrac{1}{x}\right)^6-\left(x^6+\dfrac{1}{x^6}\right)-2}{\left(x+\dfrac{1}{x}\right)^3+x^3+\dfrac{1}{x^3}}=\left(x+\dfrac{1}{x}\right)^3-\left(x^3+\dfrac{1}{x^3}\right)$
$=3\left(x+\dfrac{1}{x}\right)\ge6$ $(x>0)$. Vậy $P_{\min}=6$ đạt được khi $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả tử và mẫu đều biểu diễn được qua $u=x+\dfrac{1}{x}$ và $a=x^3+\dfrac{1}{x^3}$ (vì $x^6+\dfrac{1}{x^6}=a^2-2$), nên tử là hiệu hai bình phương $u^6-a^2$ có nhân tử chung với mẫu $u^3+a$.

**Bước 1.** Đặt $u=x+\dfrac{1}{x}$ và $a=x^3+\dfrac{1}{x^3}$, biểu diễn $x^6+\dfrac{1}{x^6}$ qua $a$ để viết lại cả tử và mẫu của $P$.

**Bước 2.** Phân tích tử thành tích $(u^3-a)(u^3+a)$ bằng hiệu hai bình phương và chứng tỏ mẫu $u^3+a$ khác $0$ để rút gọn.

**Bước 3.** Khai triển $u^3$ để tính $u^3-a$ theo $u$, từ đó $P$ chỉ còn phụ thuộc vào $u$.

**Bước 4.** Chặn dưới $u$ bằng cách xét hiệu $x+\dfrac{1}{x}-2$ với $x>0$, rồi giải điều kiện dấu bằng và tính $P$ tại giá trị tìm được.

**Chú ý:** Bất đẳng thức $x+\dfrac{1}{x}\ge2$ chỉ đúng với $x>0$ (hai số dương có tích bằng $1$); với $x<0$ thì $x+\dfrac{1}{x}\le-2$.

**Phần 2. Trình bày**

Vì $x>0$ nên $u=x+\dfrac{1}{x}>0$ và $a=x^3+\dfrac{1}{x^3}>0$. Ta có $x^6+\dfrac{1}{x^6}=a^2-2$.

Tử thức: $u^6-(a^2-2)-2=u^6-a^2=(u^3-a)(u^3+a)$.

Mẫu thức: $u^3+a>0$ nên $P$ xác định và

$P=\dfrac{(u^3-a)(u^3+a)}{u^3+a}=u^3-a$

Mà $u^3=\left(x+\dfrac{1}{x}\right)^3=x^3+3x+\dfrac{3}{x}+\dfrac{1}{x^3}=a+3u$ nên $P=3u=3\left(x+\dfrac{1}{x}\right)$.

Với $x>0$: $x+\dfrac{1}{x}-2=\dfrac{(x-1)^2}{x}\ge0$, nên $x+\dfrac{1}{x}\ge2$ và $P\ge6$.

Dấu bằng xảy ra khi $(x-1)^2=0$, tức $x=1$ (thỏa $x>0$); thật vậy $P(1)=\dfrac{2^6-2-2}{2^3+1+1}=\dfrac{60}{10}=6$.

Vậy GTNN của $P$ bằng $6$, đạt khi $x=1$.

=== T8D2C4.1@p202
- bai: 1 · y: - · trang: 202 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 4: xét từng khoảng giá trị của biến (giá trị tuyệt đối) · đặt ẩn phụ $y=\lvert3x-1\rvert$ · hoàn thành bình phương
- kiem: khong
- ket_qua_sach: min A = 1 khi x_1 = 1; x_2 = -\dfrac{1}{3}
- dap_an: GTNN $A=1$, đạt khi $x=1$ hoặc $x=-\dfrac{1}{3}$
- ghi_chu_nghi: nhãn "Ví dụ 1" của Cách 4 nằm ngay đầu trang 202 (tiêu đề Cách 4 ở cuối trang 201 nên đề bắt đầu ở trang 202).
## DE
Tìm giá trị nhỏ nhất của $A=(3x-1)^2-4\lvert3x-1\rvert+5$.
## SACH
Đặt $\lvert3x-1\rvert=y$ thì
$A=\lvert3x-1\rvert^2-4\lvert3x-1\rvert+5=y^2-4y+5=(y-2)^2+1\ge1$.
$\min A=1\Leftrightarrow y=2\Leftrightarrow\lvert3x-1\rvert=2\Leftrightarrow x_1=1;x_2=-\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bình phương của $3x-1$ bằng bình phương của $\lvert3x-1\rvert$, nên đặt $y=\lvert3x-1\rvert$ thì $A$ là một tam thức bậc hai của $y$ với điều kiện $y\ge0$.

**Bước 1.** Nhận ra $(3x-1)^2=\lvert3x-1\rvert^2$ rồi đặt $y=\lvert3x-1\rvert$ và ghi nhớ $y\ge0$.

**Bước 2.** Hoàn thành bình phương theo $y$ để đưa $A$ về dạng một bình phương cộng một hằng số, rồi chặn dưới $A$.

**Bước 3.** Giải điều kiện dấu bằng theo $y$, kiểm tra giá trị đó thỏa $y\ge0$, rồi trở lại biến $x$ bằng cách giải phương trình chứa giá trị tuyệt đối.

**Phần 2. Trình bày**

Đặt $y=\lvert3x-1\rvert\ge0$, khi đó $(3x-1)^2=y^2$ và

$A=y^2-4y+5=(y-2)^2+1$

Vì $(y-2)^2\ge0$ nên $A\ge1$ với mọi $x$.

Dấu bằng xảy ra khi $y=2$ (thỏa $y\ge0$), tức $\lvert3x-1\rvert=2$, suy ra $3x-1=2$ hoặc $3x-1=-2$, nên $x=1$ hoặc $x=-\dfrac{1}{3}$. Vậy tồn tại $x$ để $A=1$.

Vậy GTNN của $A$ bằng $1$, đạt khi $x=1$ hoặc $x=-\dfrac{1}{3}$.

=== T8D2C4.2@p202
- bai: 2 · y: - · trang: 202 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 4: xét từng khoảng giá trị của biến (giá trị tuyệt đối) · $\lvert a\rvert\ge a$
- kiem: khong
- ket_qua_sach: min B = 1 khi 2 \le x \le 3
- dap_an: GTNN $B=1$, đạt khi $2\le x\le3$
- ghi_chu_nghi: sách giải hai cách; lời giải kho đi Cách 1 (xét khoảng), Cách 2 nhắc trong Chú ý.
## DE
Tìm giá trị nhỏ nhất của $B=\lvert x-2\rvert+\lvert x-3\rvert$.
## SACH
Cách 1. a. Xét khoảng $x<2$ thì $B=2-x+3-x=5-2x$.
Do $x<2$ nên $-2x>-4$, do đó $B>1$ (1)
b. Xét khoảng $2\le x\le3$ thì $B=x-2+3-x=1$ (2)
c. Xét khoảng $x>3$ thì $B=x-2+x-3=2x-5$.
Do $x>3$ nên $2x>6$, do đó $B>1$ (3)
So sánh (1), (2), (3) ta được $\min B=1$ khi và chỉ khi $2\le x\le3$.
Cách 2. Do giá trị tuyệt đối của một số lớn hơn hoặc bằng số đó nên
$B=\lvert x-2\rvert+\lvert x-3\rvert=\lvert x-2\rvert+\lvert3-x\rvert\ge(x-2)+(3-x)=1$
Do đó $\min B=1\Leftrightarrow\begin{cases}x-2\ge0\\3-x\ge0\end{cases}\Leftrightarrow2\le x\le3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai biểu thức trong dấu giá trị tuyệt đối đổi dấu tại $x=2$ và $x=3$, nên chia trục số thành ba khoảng rồi bỏ dấu giá trị tuyệt đối theo từng khoảng.

**Bước 1.** Tìm các điểm làm mỗi biểu thức trong dấu giá trị tuyệt đối bằng $0$ rồi chia trục số thành ba khoảng phủ kín mọi giá trị của $x$.

**Bước 2.** Trên từng khoảng, xác định dấu của $x-2$ và $x-3$ để bỏ dấu giá trị tuyệt đối và viết $B$ thành một biểu thức bậc nhất (hoặc hằng số).

**Bước 3.** Đánh giá $B$ trên mỗi khoảng bằng cách dùng điều kiện của khoảng đó, rồi so sánh ba kết quả để lấy giá trị nhỏ nhất.

**Bước 4.** Chỉ ra các giá trị của $x$ mà tại đó $B$ nhận giá trị nhỏ nhất để chứng tỏ giá trị này đạt được.

**Chú ý:** Có thể dùng $\lvert a\rvert\ge a$ để viết $B=\lvert x-2\rvert+\lvert3-x\rvert\ge(x-2)+(3-x)=1$, dấu bằng khi $x-2\ge0$ và $3-x\ge0$.

**Phần 2. Trình bày**

Xét ba khoảng phủ kín tập số thực:

Khoảng $x<2$: $B=(2-x)+(3-x)=5-2x$. Vì $x<2$ nên $-2x>-4$, suy ra $B>1$.

Khoảng $2\le x\le3$: $B=(x-2)+(3-x)=1$.

Khoảng $x>3$: $B=(x-2)+(x-3)=2x-5$. Vì $x>3$ nên $2x>6$, suy ra $B>1$.

Như vậy $B\ge1$ với mọi $x$, và $B=1$ đúng khi $2\le x\le3$ (ví dụ $x=2$ cho $B=0+1=1$), nên giá trị $1$ đạt được.

Vậy GTNN của $B$ bằng $1$, đạt khi $2\le x\le3$.

=== T8D2C4.3@p202
- bai: 3 · y: - · trang: 202 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 4: xét từng khoảng giá trị của biến (giá trị tuyệt đối) · $\lvert a\rvert\ge a$ và $\lvert a\rvert\ge0$ · ghép các số hạng ở hai đầu
- kiem: khong
- ket_qua_sach: min A = 8 khi x = 7
- dap_an: GTNN $A=8$, đạt khi $x=7$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của $A=\lvert x-1\rvert+\lvert x-7\rvert+\lvert x-9\rvert$.
## SACH
Do giá trị tuyệt đối của một số lớn hơn hoặc bằng số đó nên
$\lvert x-1\rvert+\lvert x-9\rvert=\lvert x-1\rvert+\lvert9-x\rvert\ge x-1+9-x=8$ (1)
Ta lại có $\lvert x-7\rvert\ge0$ (2). Từ (1) và (2) suy ra $A\ge8$.
Do đó $\min A=8\Leftrightarrow\begin{cases}x-1\ge0\\9-x\ge0\\x=7\end{cases}\Leftrightarrow x=7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép hai giá trị tuyệt đối ở hai đầu, $\lvert x-1\rvert$ và $\lvert x-9\rvert$, vì tổng hai biểu thức bên trong (sau khi đổi dấu một biểu thức) không còn chứa $x$; giá trị tuyệt đối còn lại tự chặn dưới bởi $0$.

**Bước 1.** Viết $\lvert x-9\rvert=\lvert9-x\rvert$ rồi dùng $\lvert a\rvert\ge a$ cho hai số hạng ở hai đầu để thu được một hằng số, vì các $x$ triệt tiêu khi cộng lại.

**Bước 2.** Dùng $\lvert x-7\rvert\ge0$ cho số hạng ở giữa rồi cộng hai đánh giá để chặn dưới $A$.

**Bước 3.** Tìm $x$ thỏa đồng thời mọi điều kiện dấu bằng của hai đánh giá, rồi kiểm tra giá trị đó thật sự cho $A$ bằng cận dưới.

**Phần 2. Trình bày**

Với mọi $x$, vì $\lvert a\rvert\ge a$ nên

$\lvert x-1\rvert+\lvert x-9\rvert=\lvert x-1\rvert+\lvert9-x\rvert\ge(x-1)+(9-x)=8$ (1)

Mặt khác $\lvert x-7\rvert\ge0$ (2). Cộng (1) và (2) được $A\ge8$ với mọi $x$.

Dấu bằng xảy ra khi đồng thời $x-1\ge0$, $9-x\ge0$ (dấu bằng của (1)) và $x-7=0$ (dấu bằng của (2)), tức $x=7$. Giá trị này thỏa cả ba điều kiện (thật vậy $A(7)=6+0+2=8$).

Vậy GTNN của $A$ bằng $8$, đạt khi $x=7$.

=== T8D2C4.4@p202
- bai: 4 · y: - · trang: 202 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 4: xét từng khoảng giá trị của biến (giá trị tuyệt đối) · $\lvert a\rvert\ge0$
- kiem: khong
- ket_qua_sach: min y = -4 khi x = -3
- dap_an: GTNN $y=-4$, đạt khi $x=-3$
- ghi_chu_nghi:
## DE
Tìm giá trị nhỏ nhất của hàm số $y=\dfrac{1}{2}\lvert x+3\rvert-4$.
## SACH
Vì $\lvert x+3\rvert\ge0$ với mọi giá trị của $x$ nên $y=\dfrac{1}{2}\lvert x+3\rvert-4\ge-4$ với mọi giá trị của $x$. Hàm số có giá trị nhỏ nhất: $\min y=-4$ đạt được khi $x=-3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giá trị tuyệt đối luôn không âm nên hàm số bằng một số không âm trừ đi $4$, và giá trị nhỏ nhất xảy ra khi phần giá trị tuyệt đối triệt tiêu.

**Bước 1.** Nhắc lại $\lvert x+3\rvert\ge0$ với mọi $x$ và nhân với hệ số dương $\dfrac{1}{2}$ để giữ chiều bất đẳng thức.

**Bước 2.** Trừ $4$ ở cả hai vế để chặn dưới hàm số $y$ với mọi $x$.

**Bước 3.** Giải điều kiện làm giá trị tuyệt đối bằng $0$ để chỉ ra giá trị của $x$ đạt cận dưới.

**Phần 2. Trình bày**

Với mọi $x$ ta có $\lvert x+3\rvert\ge0$ nên $\dfrac{1}{2}\lvert x+3\rvert\ge0$, suy ra

$y=\dfrac{1}{2}\lvert x+3\rvert-4\ge-4$

Dấu bằng xảy ra khi $\lvert x+3\rvert=0$, tức $x=-3$ (thật vậy $y(-3)=0-4=-4$).

Vậy GTNN của $y$ bằng $-4$, đạt khi $x=-3$.

=== T8D2C5.1@p203
- bai: 1 · y: - · trang: 203 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Cách 5: sử dụng các bất đẳng thức đã biết · bất đẳng thức Bu-nhi-a-cốp-xki · xét hiệu hai vế
- kiem: khong
- ket_qua_sach: min M = \dfrac{100}{17} khi x = \dfrac{5}{17}; y = \dfrac{20}{17}
- dap_an: Chứng minh $(ab+cd)^2\le(a^2+c^2)(b^2+d^2)$; GTNN $M=\dfrac{100}{17}$, đạt khi $x=\dfrac{5}{17}$, $y=\dfrac{20}{17}$
- ghi_chu_nghi: dòng đầu phần Áp dụng của sách in "$5^2=(x+4y)^2=(x+4y)\le(x^2+y^2)(1+16)$": số hạng thứ ba thiếu bình phương (đúng phải là $(x+4y)^2\le\ldots$); kết luận của sách đúng. Ví dụ gồm phần chứng minh và phần Áp dụng dùng đúng bất đẳng thức vừa chứng minh nên giữ một câu; người soát có thể tách đôi nếu cần (phần Áp dụng vẫn tự đủ nghĩa khi coi Bu-nhi-a-cốp-xki là công cụ của sách).
## DE
Chứng minh: $(ab+cd)^2\le(a^2+c^2)(b^2+d^2)$ (bất đẳng thức Bu-nhi-a-cốp-xki).

Áp dụng: Cho $x+4y=5$. Tìm giá trị nhỏ nhất của biểu thức $M=4x^2+4y^2$.
## SACH
Ta có: $(ab+cd)^2\le(a^2+c^2)(b^2+d^2)$
$\Leftrightarrow a^2b^2+2abcd+c^2d^2\le a^2b^2+a^2d^2+c^2b^2+c^2d^2$
$\Leftrightarrow0\le a^2d^2-2abcd+c^2b^2\Leftrightarrow0\le(ad-bc)^2$ (đpcm)
Dấu "=" xảy ra khi $ad=bc$. Áp dụng hằng đẳng thức trên ta có:
$5^2=(x+4y)^2=(x+4y)\le(x^2+y^2)(1+16)\Rightarrow x^2+y^2\ge\dfrac{25}{17}$
$\Rightarrow4x^2+4y^2\ge\dfrac{4\cdot25}{17}\Rightarrow4x^2+4y^2\ge\dfrac{100}{17}$
Dấu "=" xảy ra khi $x=\dfrac{5}{17},y=\dfrac{20}{17}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức Bu-nhi-a-cốp-xki chứng minh được bằng cách xét hiệu hai vế; còn điều kiện $x+4y=5$ chính là $x\cdot1+y\cdot4$, nên áp dụng nó với bộ số $(a;b;c;d)=(x;1;y;4)$ thì chặn dưới được $x^2+y^2$ và từ đó $M$.

**Bước 1.** Chứng minh bất đẳng thức bằng cách tính hiệu $(a^2+c^2)(b^2+d^2)-(ab+cd)^2$ và nhận ra đó là một bình phương.

**Bước 2.** Viết $(x+4y)^2$ dưới dạng $(x\cdot1+y\cdot4)^2$ rồi áp dụng bất đẳng thức vừa chứng minh để chặn dưới $x^2+y^2$ khi $x+4y=5$.

**Bước 3.** Nhân bất đẳng thức vừa có với $4$ để chặn dưới $M=4x^2+4y^2$.

**Bước 4.** Từ điều kiện dấu bằng $ad=bc$ kết hợp với $x+4y=5$ để tìm $x$, $y$, rồi tính $M$ tại đó để khẳng định giá trị nhỏ nhất đạt được.

**Chú ý:** Bất đẳng thức Bu-nhi-a-cốp-xki đúng với mọi số thực $a,b,c,d$ (không cần dương); khi áp dụng phải ghép đúng cặp số để tổng $x\cdot1+y\cdot4$ trùng với điều kiện của đề.

**Phần 2. Trình bày**

Chứng minh bất đẳng thức: với mọi số thực $a,b,c,d$ ta có

$(a^2+c^2)(b^2+d^2)-(ab+cd)^2=a^2b^2+a^2d^2+c^2b^2+c^2d^2-a^2b^2-2abcd-c^2d^2$

$=a^2d^2-2abcd+b^2c^2=(ad-bc)^2\ge0$

Do đó $(ab+cd)^2\le(a^2+c^2)(b^2+d^2)$ (đpcm); dấu bằng xảy ra khi $ad=bc$.

Áp dụng: lấy $a=x$, $b=1$, $c=y$, $d=4$ thì

$(x\cdot1+y\cdot4)^2\le(x^2+y^2)(1^2+4^2)$, tức $(x+4y)^2\le17(x^2+y^2)$.

Với $x+4y=5$ ta có $25\le17(x^2+y^2)$, nên $x^2+y^2\ge\dfrac{25}{17}$, suy ra $M=4(x^2+y^2)\ge\dfrac{100}{17}$ với mọi $x,y$ thỏa $x+4y=5$.

Dấu bằng xảy ra khi $ad=bc$, tức $4x=y$. Thế vào $x+4y=5$ được $17x=5$, nên $x=\dfrac{5}{17}$, $y=\dfrac{20}{17}$. Kiểm tra: $x+4y=\dfrac{5+80}{17}=5$ và $M=4\cdot\dfrac{25+400}{289}=\dfrac{100}{17}$, nên giá trị $\dfrac{100}{17}$ đạt được.

Vậy GTNN của $M$ bằng $\dfrac{100}{17}$, đạt khi $x=\dfrac{5}{17}$, $y=\dfrac{20}{17}$.

=== T8D2C5.2@p203
- bai: 2 · y: - · trang: 203 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Cách 5: sử dụng các bất đẳng thức đã biết · bất đẳng thức Bu-nhi-a-cốp-xki $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$
- kiem: khong
- ket_qua_sach: max A = 26 khi x = 4; y = 6
- dap_an: GTLN $A=26$, đạt khi $x=4$, $y=6$
- ghi_chu_nghi: sách viện dẫn "(2)" ở "thỏa mãn (2)" để chỉ điều kiện $2x+3y\ge0$ của hệ ngay trên (hệ không đánh nhãn).
## DE
Cho $x^2+y^2=52$. Tìm giá trị lớn nhất của $A=2x+3y$.
## SACH
Ta nhận thấy $2x+3y$ và $x^2+y^2$ là các thành phần của bất đẳng thức Bu-nhi-a-cốp-xki $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$ với $a=2$, $b=3$.
Theo bất đẳng thức trên:
$(2x+3y)^2\le(2^2+3^2)\cdot52\Rightarrow(2x+3y)^2\le13\cdot13\cdot4$
$\Rightarrow\lvert2x+3y\rvert\le26\Rightarrow2x+3y\le26$. Vậy $\max A=26\Leftrightarrow\begin{cases}\dfrac{x}{2}=\dfrac{y}{3}\\2x+3y\ge0\end{cases}$
Thay $y=\dfrac{3x}{2}$ vào $x^2+y^2=52$, ta được $x^2+\dfrac{9x^2}{4}=52$. Giải phương trình này được: $x=\pm4$. Với $x=4$ thì $y=6$, thỏa mãn (2). Với $x=-4$ thì $y=-6$, không thỏa mãn (2).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức cần tìm $2x+3y$ và điều kiện $x^2+y^2=52$ đúng là hai thành phần của bất đẳng thức Bu-nhi-a-cốp-xki với bộ hệ số $(2;3)$, nên ghép chúng vào bất đẳng thức đó để chặn $2x+3y$.

**Bước 1.** Viết bất đẳng thức Bu-nhi-a-cốp-xki $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$ với $a=2$, $b=3$ rồi thay $x^2+y^2=52$ để chặn $(2x+3y)^2$.

**Bước 2.** Lấy căn bậc hai hai vế qua giá trị tuyệt đối để suy ra cận trên của $2x+3y$ và lưu ý chỉ cần dấu "$\le$" phía số dương.

**Bước 3.** Viết điều kiện dấu bằng của Bu-nhi-a-cốp-xki cùng điều kiện $2x+3y\ge0$, rồi giải cùng $x^2+y^2=52$ để tìm các giá trị $x$, $y$ đạt cận trên.

**Chú ý:** Dấu bằng của $\lvert2x+3y\rvert\le26$ xảy ra ở cả hai trường hợp $2x+3y=26$ và $2x+3y=-26$; chỉ trường hợp dương mới ứng với giá trị lớn nhất, nên phải loại nghiệm làm $2x+3y$ âm.

**Phần 2. Trình bày**

Theo bất đẳng thức Bu-nhi-a-cốp-xki $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$ với $a=2$, $b=3$:

$(2x+3y)^2\le(2^2+3^2)(x^2+y^2)=13\cdot52=676=26^2$

Suy ra $\lvert2x+3y\rvert\le26$, nên $A=2x+3y\le26$ với mọi $x,y$ thỏa $x^2+y^2=52$.

Dấu bằng của Bu-nhi-a-cốp-xki xảy ra khi $2y=3x$; để $A=26$ (không phải $-26$) còn cần $2x+3y\ge0$. Thế $y=\dfrac{3x}{2}$ vào $x^2+y^2=52$:

$x^2+\dfrac{9x^2}{4}=52\Leftrightarrow\dfrac{13x^2}{4}=52\Leftrightarrow x^2=16\Leftrightarrow x=\pm4$

Với $x=4$ thì $y=6$: $x^2+y^2=52$ và $A=8+18=26$, thỏa mãn. Với $x=-4$ thì $y=-6$: $A=-26$, không thỏa mãn.

Vậy GTLN của $A$ bằng $26$, đạt khi $x=4$, $y=6$.

=== T8D2C6.1@p204
- bai: 1 · y: - · trang: 204 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030201
- cong_cu: Cách 6: hai số có tổng không đổi thì tích lớn nhất khi hai số bằng nhau · bất đẳng thức $(a+b)^2\ge4ab$
- kiem: khong
- ket_qua_sach: max A = 121 khi x = 5 hoặc x = -2
- dap_an: GTLN $A=121$, đạt khi $x=5$ hoặc $x=-2$
- ghi_chu_nghi:
## DE
Tìm giá trị lớn nhất của $A=(x^2-3x+1)(21+3x-x^2)$.
## SACH
Các biểu thức $x^2-3x+1$ và $21+3x-x^2$ có tổng không đổi (bằng $22$) nên tích của chúng lớn nhất khi và chỉ khi
$x^2-3x+1=21+3x-x^2\Leftrightarrow x^2-3x-10=0$
$\Leftrightarrow(x-5)(x+2)=0\Leftrightarrow x_1=5;x_2=-2$. Khi đó $A=11\cdot11=121$.
Vậy $\max A=121$ khi và chỉ khi $x=5$ hoặc $x=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai thừa số $x^2-3x+1$ và $21+3x-x^2$ có tổng không chứa $x$, nên tích của chúng bị chặn trên theo bất đẳng thức $(a+b)^2\ge4ab$ và đạt cực đại khi hai thừa số bằng nhau.

**Bước 1.** Đặt hai thừa số là $a$ và $b$ rồi kiểm tra $a+b$ là một hằng số không phụ thuộc $x$.

**Bước 2.** Dùng $(a+b)^2\ge4ab$ (đúng với mọi số thực) để chặn trên tích $ab$ bằng một hằng số.

**Bước 3.** Giải điều kiện $a=b$ để tìm các giá trị của $x$, rồi tính $A$ tại các giá trị đó để khẳng định cận trên đạt được.

**Chú ý:** Bất đẳng thức $(a+b)^2\ge4ab$ tương đương $(a-b)^2\ge0$ nên đúng với mọi số thực $a,b$, không cần $a,b$ dương; phương pháp "tổng không đổi" chỉ cho giá trị lớn nhất của tích, không cho giá trị nhỏ nhất.

**Phần 2. Trình bày**

Đặt $a=x^2-3x+1$ và $b=21+3x-x^2$. Khi đó $a+b=22$ với mọi $x$ và $A=ab$.

Vì $(a+b)^2-4ab=(a-b)^2\ge0$ nên $A=ab\le\dfrac{(a+b)^2}{4}=\dfrac{22^2}{4}=121$ với mọi $x$.

Dấu bằng xảy ra khi $a=b$:

$x^2-3x+1=21+3x-x^2\Leftrightarrow2x^2-6x-20=0\Leftrightarrow x^2-3x-10=0\Leftrightarrow(x-5)(x+2)=0$

nên $x=5$ hoặc $x=-2$. Với hai giá trị này $a=b=11$ nên $A=11\cdot11=121$, tức giá trị $121$ đạt được.

Vậy GTLN của $A$ bằng $121$, đạt khi $x=5$ hoặc $x=-2$.

=== T8D2C6.2@p204
- bai: 2 · y: - · trang: 204 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 6: hai số dương có tích không đổi thì tổng nhỏ nhất khi hai số bằng nhau · bất đẳng thức $(a+b)^2\ge4ab$
- kiem: khong
- ket_qua_sach: min B = 6 khi x = \dfrac{1}{4}
- dap_an: GTNN $B=6$, đạt khi $x=\dfrac{1}{4}$
- ghi_chu_nghi: nhãn số của ví dụ bị mép trang làm mờ ("Ví dụ :"); đánh số 2 theo thứ tự (sau Ví dụ 1, trước Ví dụ 3).
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\dfrac{16x^2+4x+1}{2x}$ với $x>0$.
## SACH
Viết $B$ dưới dạng $8x+2+\dfrac{1}{2x}$. Hai số $8x$ và $\dfrac{1}{2x}$ là hai số dương, có tích không đổi (bằng $4$) nên tổng của chúng nhỏ nhất khi và chỉ khi
$8x=\dfrac{1}{2x}\Leftrightarrow16x^2=1\Leftrightarrow x=\dfrac{1}{4}$ (chú ý rằng $x>0$).
Vậy $\min B=\dfrac{1+1+1}{\dfrac{1}{2}}=6$ khi và chỉ khi $x=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia từng hạng tử của tử cho $2x$ thì $B$ thành tổng một hằng số với hai số dương $8x$ và $\dfrac{1}{2x}$ có tích không đổi, nên tổng hai số đó nhỏ nhất khi chúng bằng nhau.

**Bước 1.** Chia từng hạng tử của tử cho mẫu $2x$ để tách $B$ thành một hằng số cộng với hai hạng tử chứa $x$.

**Bước 2.** Kiểm tra hai hạng tử đó dương (do $x>0$) và tích của chúng là một hằng số không phụ thuộc $x$.

**Bước 3.** Dùng $(u+v)^2\ge4uv$ để chặn dưới tổng hai hạng tử rồi cộng thêm hằng số để chặn dưới $B$.

**Bước 4.** Giải điều kiện hai hạng tử bằng nhau với ràng buộc $x>0$ để tìm $x$ đạt cận dưới.

**Phần 2. Trình bày**

Với $x>0$:

$B=\dfrac{16x^2+4x+1}{2x}=8x+2+\dfrac{1}{2x}$

Hai số $8x$ và $\dfrac{1}{2x}$ dương và có tích $8x\cdot\dfrac{1}{2x}=4$. Từ $(u+v)^2\ge4uv$ với $u=8x$, $v=\dfrac{1}{2x}$ được $\left(8x+\dfrac{1}{2x}\right)^2\ge16$, mà $8x+\dfrac{1}{2x}>0$ nên $8x+\dfrac{1}{2x}\ge4$. Do đó $B\ge6$ với mọi $x>0$.

Dấu bằng xảy ra khi $8x=\dfrac{1}{2x}\Leftrightarrow16x^2=1\Leftrightarrow x=\dfrac{1}{4}$ (vì $x>0$); thật vậy $B\left(\dfrac{1}{4}\right)=\dfrac{1+1+1}{\dfrac{1}{2}}=6$.

Vậy GTNN của $B$ bằng $6$, đạt khi $x=\dfrac{1}{4}$.

=== T8D2C6.3@p204
- bai: 3 · y: - · trang: 204 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Cách 6: hai số có tổng không đổi thì tích lớn nhất khi hai số bằng nhau · bất đẳng thức $xy\le\left(\dfrac{x+y}{2}\right)^2$ · đánh giá bỏ bớt số hạng không âm
- kiem: khong
- ket_qua_sach: max A = \dfrac{1}{4} khi, chẳng hạn, a = b = \dfrac{1}{2}, c = d = 0
- dap_an: GTLN $A=\dfrac{1}{4}$, đạt khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$
- ghi_chu_nghi: Cách 1 của sách mở đầu bằng "Giả sử $a\ge b\ge c\ge d\ge0$" nhưng $A=ab+bc+cd$ không đối xứng theo cả bốn biến (chỉ bất biến khi đổi đồng thời $a\leftrightarrow d$, $b\leftrightarrow c$) nên không được giả sử thứ tự bất kì; thực ra chỉ cần $a$ là số lớn nhất mới có $bc\le ac$, $cd\le ad$, và sách không chứng minh giả thiết đó là không mất tổng quát. Kết luận $\max A=\dfrac{1}{4}$ vẫn đúng. Lời giải kho đi Cách 2 (đúng). Nhãn số ví dụ bị mép trang làm mờ ("Ví dụ :"); đánh số 3 theo thứ tự (sau Ví dụ 2, trước Ví dụ 4). Dòng cuối trang 204 và đầu trang 205 bị logo che vài chữ ("đủ để $A=\dfrac{1}{4}$"), đọc theo ngữ cảnh.
## DE
Tìm giá trị lớn nhất của $A=ab+bc+cd$, biết rằng $a,b,c,d$ là các số không âm có tổng bằng $1$.
## SACH
Cách 1. Giả sử $a\ge b\ge c\ge d\ge0$. Ta có
$A=ab+bc+cd\le ab+ac+ad=a(b+c+d)$
$=a(1-a)=a-a^2=-\left(a-\dfrac{1}{2}\right)^2+\dfrac{1}{4}\le\dfrac{1}{4}$. (Không cần tìm điều kiện cần và đủ để $A=\dfrac{1}{4}$, tức là không cần giải tất cả các điều kiện $bc=ac$, $cd=ad$, $a=\dfrac{1}{2}$, $b+c+d=\dfrac{1}{2}$ và $b,c,d\ge0$. Ta chỉ cần chỉ ra $A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$. Vậy $\max A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.)
Cách 2. $A=ab+bc+cd\le ab+ad+bc+cd=(a+c)(b+d)$
Áp dụng bất đẳng thức $xy\le\left(\dfrac{x+y}{2}\right)^2$ ta có:
$A=(a+c)(b+d)\le\left(\dfrac{a+c+b+d}{2}\right)^2=\dfrac{1}{4}\Rightarrow A=\dfrac{1}{4}\Leftrightarrow\begin{cases}a+c=\dfrac{1}{2}\\b+d=\dfrac{1}{2}\\ad=0\\a,b,c,d\ge0\end{cases}$
Vậy $\max A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các số hạng của $A$ đều là tích của hai biến liền kề; thêm số hạng $ad\ge0$ thì $A$ bị chặn trên bởi $(a+c)(b+d)$, tích của hai số có tổng không đổi bằng $a+b+c+d$.

**Bước 1.** Dùng $a,d\ge0$ để thêm số hạng $ad$ vào $A$ (chỉ làm $A$ tăng hoặc giữ nguyên) rồi nhóm bốn số hạng thành tích của hai nhị thức.

**Bước 2.** Nhận ra hai nhị thức có tổng bằng giả thiết $a+b+c+d=1$ và dùng $xy\le\left(\dfrac{x+y}{2}\right)^2$ để chặn trên tích đó.

**Bước 3.** Lập các điều kiện để mọi dấu bằng xảy ra, rồi chọn một bộ số thỏa đề để tính $A$ và khẳng định cận trên đạt được.

**Chú ý:** Không được giả sử $a\ge b\ge c\ge d$: biểu thức $ab+bc+cd$ không đối xứng theo cả bốn biến nên thứ tự các biến không thể sắp tùy ý. Với bài này cũng chỉ cần chỉ ra một bộ số đạt cực trị, không cần tìm hết.

**Phần 2. Trình bày**

Vì $a,d\ge0$ nên $ad\ge0$, do đó

$A=ab+bc+cd\le ab+ad+bc+cd=(a+c)(b+d)$

Hai số $a+c$ và $b+d$ có tổng $a+b+c+d=1$. Từ $xy\le\left(\dfrac{x+y}{2}\right)^2$ (tương đương $(x-y)^2\ge0$) ta có

$(a+c)(b+d)\le\left(\dfrac{a+c+b+d}{2}\right)^2=\dfrac{1}{4}$

Vậy $A\le\dfrac{1}{4}$ với mọi số không âm $a,b,c,d$ có tổng bằng $1$.

Dấu bằng xảy ra khi $ad=0$ và $a+c=b+d=\dfrac{1}{2}$. Chẳng hạn $a=b=\dfrac{1}{2}$, $c=d=0$ thỏa mọi điều kiện của đề (các số không âm, tổng bằng $1$) và $A=\dfrac{1}{4}+0+0=\dfrac{1}{4}$, nên giá trị $\dfrac{1}{4}$ đạt được.

Vậy GTLN của $A$ bằng $\dfrac{1}{4}$, đạt khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.

=== T8D2C6.4@p205
- bai: 4 · y: - · trang: 205 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: Cách 6 (xét từng trường hợp theo giá trị của $x+y$) · đánh giá phân thức với số tự nhiên
- kiem: khong
- ket_qua_sach: max A = 4 khi x = 0, y = 4
- dap_an: GTLN $A=4$, đạt khi $x=0$, $y=4$
- ghi_chu_nghi: ví dụ này không dùng hai mệnh đề của Cách 6 (tổng/tích không đổi) mà xét trường hợp theo $x+y$; vẫn giữ trong Cách 6 theo vị trí của sách. Sách coi $0$ là số tự nhiên (dùng $x=0$), lời giải kho theo đúng quy ước đó.
## DE
Tìm giá trị lớn nhất của biểu thức $A=\dfrac{y}{5-(x+y)}$ với $x,y$ là các số tự nhiên.
## SACH
Ta có $x+y\neq5$. Xét $x+y\le4$:
– Nếu $y=0$ thì $A=0$.
– Nếu $1\le y\le3$ thì $A=\dfrac{y}{5-(x+y)}\le3$.
– Nếu $y=4$ thì $x=0$ và $A=4$.
Xét $x+y\ge6$ thì $A=\dfrac{y}{5-(x+y)}\le0$. So sánh các giá trị trên của $A$, ta thấy $\max A=4$ khi và chỉ khi $x=0$, $y=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $5-(x+y)$ đổi dấu quanh giá trị $x+y=5$, và vì $x,y$ là số tự nhiên nên khi $x+y\le4$ chỉ còn vài giá trị của $y$ để xét; do đó chia trường hợp theo $x+y$ và so sánh kết quả.

**Bước 1.** Nêu điều kiện $x+y\neq5$ rồi chia hai trường hợp phủ kín các số tự nhiên là $x+y\le4$ và $x+y\ge6$.

**Bước 2.** Với $x+y\le4$, nhận xét mẫu là số nguyên dương không nhỏ hơn $1$, rồi xét lần lượt các giá trị $y=0$, $1\le y\le3$ và $y=4$.

**Bước 3.** Với $x+y\ge6$, nhận xét mẫu âm còn tử không âm để chặn $A$ bởi một số không dương.

**Bước 4.** So sánh các kết quả của mọi trường hợp để chọn giá trị lớn nhất và chỉ ra cặp $(x;y)$ đạt được.

**Phần 2. Trình bày**

Biểu thức xác định khi $x+y\neq5$. Vì $x,y$ là số tự nhiên nên chỉ có hai trường hợp: $x+y\le4$ hoặc $x+y\ge6$.

Trường hợp $x+y\le4$: khi đó $5-(x+y)\ge1>0$ và $0\le y\le x+y\le4$.

- Nếu $y=0$ thì $A=0$.

- Nếu $1\le y\le3$ thì $A=\dfrac{y}{5-(x+y)}\le y\le3$ (vì mẫu $\ge1$).

- Nếu $y=4$ thì $x=0$ và $A=\dfrac{4}{5-4}=4$.

Trường hợp $x+y\ge6$: mẫu $5-(x+y)<0$ còn $y\ge0$ nên $A\le0$.

So sánh các trường hợp, mọi giá trị của $A$ đều không vượt quá $4$, và $A=4$ khi $x=0$, $y=4$ (thỏa $x+y=4\neq5$).

Vậy GTLN của $A$ bằng $4$, đạt khi $x=0$, $y=4$.

=== T8D2C6.5@p205
- bai: 5 · y: - · trang: 205 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Cách 6: hai số có tổng không đổi thì tích lớn nhất khi hai số gần bằng nhau · hằng đẳng thức $(x+y)^2-(x-y)^2=4xy$ · số nguyên dương
- kiem: khong
- ket_qua_sach: max (xy) = 1005006 khi x = 1003, y = 1002; min (xy) = 2004 khi x = 2004, y = 1
- dap_an: GTNN $xy=2004$, đạt khi $x=2004$, $y=1$ (hoặc đổi chỗ); GTLN $xy=1005006$, đạt khi $x=1003$, $y=1002$ (hoặc đổi chỗ)
- ghi_chu_nghi: dòng "min $(x-y)=1$ khi và chỉ khi $x=1003$, $1002$" in thiếu chữ "$y=$" (đọc là $x=1003$, $y=1002$). Sách giả sử $x>y$ rồi kết luận một thứ tự; vì $xy$ đối xứng nên cặp đổi chỗ cũng đạt cực trị, lời giải kho nêu thêm điều này.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của tích $xy$, biết rằng $x$ và $y$ là các số nguyên dương thỏa mãn $x+y=2005$.
## SACH
Ta có: $4xy=(x+y)^2-(x-y)^2=2005^2-(x-y)^2$
Giả sử $x>y$ (không thể xảy ra $x=y$). Ta có:
$xy$ lớn nhất $\Leftrightarrow x-y$ nhỏ nhất; $xy$ nhỏ nhất $\Leftrightarrow x-y$ lớn nhất.
Do $1\le y<x\le2004$ nên $1\le x-y\le2003$.
Ta có: $\min(x-y)=1$ khi và chỉ khi $x=1003$, $1002$.
$\max(x-y)=2003$ khi và chỉ khi $x=2004$, $y=1$.
Do đó: $\max(xy)=1005006$ khi và chỉ khi $x=1003$, $y=1002$.
$\min(xy)=2004$ khi và chỉ khi $x=2004$, $y=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $x+y$ không đổi nên $4xy=2005^2-(x-y)^2$; vậy $xy$ lớn nhất khi $\lvert x-y\rvert$ nhỏ nhất và $xy$ nhỏ nhất khi $\lvert x-y\rvert$ lớn nhất, và vì $x,y$ nguyên dương nên phải tìm miền giá trị của $x-y$.

**Bước 1.** Dùng $(x+y)^2-(x-y)^2=4xy$ để biểu diễn $4xy$ theo $x-y$, rồi nhận ra $x\neq y$ vì tổng $2005$ là số lẻ.

**Bước 2.** Vì $xy$ đối xứng nên giả sử $x>y\ge1$, từ đó suy ra $x-y$ là số nguyên nằm trong một đoạn xác định.

**Bước 3.** Suy ra cận trên và cận dưới của $xy$ từ hai đầu mút của $x-y$.

**Bước 4.** Giải hệ gồm $x+y=2005$ và giá trị $x-y$ ở đầu mút để tìm cặp số nguyên dương đạt cực trị rồi tính $xy$.

**Phần 2. Trình bày**

Ta có $4xy=(x+y)^2-(x-y)^2=2005^2-(x-y)^2$.

Vì $2005$ lẻ nên $x\neq y$. Do $xy$ đối xứng theo $x,y$, ta giả sử $x>y\ge1$. Khi đó $y\ge1$ nên $x=2005-y\le2004$ và $x-y=2005-2y\le2003$; mặt khác $x-y\ge1$. Vậy $1\le x-y\le2003$.

Do đó $1\le(x-y)^2\le2003^2$.

Giá trị lớn nhất: $4xy\le2005^2-1=2004\cdot2006$, nên $xy\le1002\cdot1003=1005006$. Dấu bằng xảy ra khi $x-y=1$; cùng $x+y=2005$ cho $x=1003$, $y=1002$ (nguyên dương), nên giá trị này đạt được.

Giá trị nhỏ nhất: $4xy\ge2005^2-2003^2=2\cdot4008=8016$, nên $xy\ge2004$. Dấu bằng xảy ra khi $x-y=2003$; cùng $x+y=2005$ cho $x=2004$, $y=1$ (nguyên dương), nên giá trị này đạt được.

Vậy GTNN của $xy$ bằng $2004$, đạt khi $x=2004$, $y=1$ (hoặc $x=1$, $y=2004$); GTLN của $xy$ bằng $1005006$, đạt khi $x=1003$, $y=1002$ (hoặc $x=1002$, $y=1003$).

=== T8D2C6.6@p206
- bai: 6 · y: - · trang: 206 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030202
- cong_cu: chữ số tận cùng của lũy thừa · đánh giá số tự nhiên theo chữ số tận cùng
- kiem: khong
- ket_qua_sach: min A = 4 khi, chẳng hạn, m = 2, n = 3
- dap_an: GTNN $A=4$, đạt khi, chẳng hạn, $m=2$, $n=3$
- ghi_chu_nghi: phân vân nhóm: T18T030202 (biểu thức chứa dấu giá trị tuyệt đối) hay T18T030203 / chia hết–chữ số tận cùng (T18T040102); chọn T18T030202 theo mục tiêu "tìm giá trị nhỏ nhất". Đoạn in nghiêng cuối ví dụ không có nhãn "Nhận xét" nhưng là nhận xét chung cho cả Cách 6, chép vào cuối ## SACH.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\lvert11^m-5^n\rvert$ với $m,n$ là các số nguyên dương.
## SACH
Giải: Ta thấy $11^m$ tận cùng bằng $1$, còn $5^n$ tận cùng bằng $5$. Nếu $11^m>5^n$ thì $A$ tận cùng bằng $6$, nếu $11^m<5^n$ thì tận cùng bằng $4$.
Ta chỉ ra một trường hợp $A=4$: với $m=2$, $n=3$ thì $A=\lvert121-125\rvert=4$.
Như vậy $\min A=4$ khi, chẳng hạn, $m=2$, $n=3$.
Nhận xét: Trong các ví dụ trên, ta chỉ ra tất cả các giá trị của biến để xảy ra đẳng thức. Tuy nhiên, yêu cầu của bài toán tìm GTNN, GTLN không đòi hỏi như vậy, chỉ cần chứng tỏ rằng tồn tại giá trị của biến để xảy ra đẳng thức.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mọi lũy thừa của $11$ đều tận cùng bằng $1$ còn mọi lũy thừa bậc nguyên dương của $5$ đều tận cùng bằng $5$, nên hiệu của chúng chỉ có thể tận cùng bằng $4$ hoặc $6$; một số tự nhiên dương như vậy không nhỏ hơn $4$.

**Bước 1.** Chỉ ra chữ số tận cùng của $11^m$ và của $5^n$ với mọi $m,n$ nguyên dương, rồi suy ra hai số này không bao giờ bằng nhau.

**Bước 2.** Xét hai trường hợp $11^m>5^n$ và $11^m<5^n$ để tìm chữ số tận cùng của hiệu trong từng trường hợp.

**Bước 3.** Kết luận $A$ là số tự nhiên có chữ số tận cùng $4$ hoặc $6$ nên $A$ không thể nhỏ hơn $4$.

**Bước 4.** Thử các lũy thừa nhỏ để tìm một cặp $(m;n)$ làm $A$ đúng bằng cận dưới vừa tìm.

**Chú ý:** Để kết luận giá trị nhỏ nhất, chỉ cần chỉ ra MỘT cặp $(m;n)$ đạt cận dưới, không cần tìm hết các cặp.

**Phần 2. Trình bày**

Với mọi số nguyên dương $m,n$: $11^m$ có chữ số tận cùng là $1$ và $5^n$ có chữ số tận cùng là $5$. Vì hai chữ số tận cùng khác nhau nên $11^m\neq5^n$, suy ra $A>0$.

Nếu $11^m>5^n$ thì $A=11^m-5^n$ có chữ số tận cùng là $6$ (số tận cùng $1$ trừ số tận cùng $5$, mượn một ở hàng chục: $11-5=6$).

Nếu $11^m<5^n$ thì $A=5^n-11^m$ có chữ số tận cùng là $4$ ($5-1=4$).

Vậy $A$ là số tự nhiên có chữ số tận cùng là $4$ hoặc $6$ nên $A\ge4$ với mọi $m,n$ nguyên dương.

Với $m=2$, $n=3$: $A=\lvert121-125\rvert=4$, nên giá trị $4$ đạt được.

Vậy GTNN của $A$ bằng $4$, đạt khi, chẳng hạn, $m=2$, $n=3$.

