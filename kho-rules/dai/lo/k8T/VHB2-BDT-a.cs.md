=== V2V.88@p37
- bai: 88 · y: - · trang: 37 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu · đặt ẩn phụ · bình phương không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200.000 giá trị x: vế trái luôn ≥ -1, bằng -1 tại x=(5±√5)/2 (khớp). Sách không nêu điểm đạt dấu "=", điểm này do tự giải.
## DE
Chứng minh rằng $(x-1)(x-2)(x-3)(x-4)\ge-1$.
## SACH
Xét hiệu

$(x-1)(x-2)(x-3)(x-4)-(-1)=(x^2-5x+4)(x^2-5x+6)+1$.

Đặt $x^2-5x+5=y$, biểu thức trên bằng $(y-1)(y+1)+1=y^2\ge0$.

Vậy $(x-1)(x-2)(x-3)(x-4)\ge-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn nhân tử $x-1,\ x-2,\ x-3,\ x-4$ đối xứng quanh $\dfrac{5}{2}$, nên ghép đầu với cuối và hai nhân tử giữa sẽ cho hai tam thức chỉ khác nhau hằng số; đặt ẩn phụ rồi xét hiệu với $-1$ là ra một bình phương.

**Bước 1.** Chuyển bài toán về xét dấu của hiệu giữa vế trái và vế phải, tức là xét biểu thức $(x-1)(x-2)(x-3)(x-4)+1$ có luôn không âm hay không.

**Bước 2.** Ghép $(x-1)(x-4)$ và $(x-2)(x-3)$ vì hai tích này cùng chứa $x^2-5x$, chỉ khác nhau số hạng tự do.

**Bước 3.** Đặt $y$ bằng số hạng trung bình của hai tam thức đó để tích trở thành hiệu hai bình phương dạng $(y-1)(y+1)$.

**Bước 4.** Cộng thêm $1$ để biểu thức thu gọn thành một bình phương, rồi kiểm tra khi nào bình phương này bằng $0$ để biết dấu "=".

**Phần 2. Trình bày**

Xét hiệu $(x-1)(x-2)(x-3)(x-4)-(-1)=(x-1)(x-4)\cdot(x-2)(x-3)+1$

$=(x^2-5x+4)(x^2-5x+6)+1$

Đặt $y=x^2-5x+5$, khi đó biểu thức trên bằng $(y-1)(y+1)+1=y^2\ge0$ với mọi $x$.

Suy ra $(x-1)(x-2)(x-3)(x-4)\ge-1$ với mọi $x$.

Dấu "=" xảy ra khi $y=0$, tức $x^2-5x+5=0\Leftrightarrow\left(x-\dfrac{5}{2}\right)^2=\dfrac{5}{4}\Leftrightarrow x=\dfrac{5\pm\sqrt{5}}{2}$.

Vậy $(x-1)(x-2)(x-3)(x-4)\ge-1$.

=== V2V.89@p37
- bai: 89 · y: - · trang: 37 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: biến đổi tương đương · (a+b)² ≥ 4ab (Cô-si hai số)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200.000 cặp (a,b) với a+b=1: vế trái ≥ 9, bằng 9 tại a=b=1/2.
## DE
Cho các số dương $a$ và $b$ thỏa mãn điều kiện $a+b=1$. Chứng minh rằng $\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$.
## SACH
Ta có

$\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$ (1)

$\Leftrightarrow\dfrac{a+1}{a}\cdot\dfrac{b+1}{b}\ge9\Leftrightarrow ab+a+b+1\ge9ab$ (vì $ab>0$)

$\Leftrightarrow a+b+1\ge8ab\Leftrightarrow2\ge8ab$ (vì $a+b=1$)

$\Leftrightarrow1\ge4ab\Leftrightarrow(a+b)^2\ge4ab$ (vì $a+b=1$)

$\Leftrightarrow(a-b)^2\ge0$. (2)

Bất đẳng thức (2) đúng, mà các phép biến đổi trên tương đương, vậy bất đẳng thức (1) được chứng minh.

Xảy ra đẳng thức khi và chỉ khi $a=b$.

Cách giải khác

$\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)=\left(1+\dfrac{a+b}{a}\right)\left(1+\dfrac{a+b}{b}\right)=\left(2+\dfrac{b}{a}\right)\left(2+\dfrac{a}{b}\right)$.

Thực hiện phép nhân và chú ý rằng $\dfrac{a}{b}+\dfrac{b}{a}\ge2$ do $a>0,\ b>0$.

Chú ý: Khi sử dụng phép biến đổi tương đương, cần lưu ý các biến đổi tương đương có điều kiện, chẳng hạn:

$a^2>b^2\Leftrightarrow a>b$ với $a,b>0$;

$m>n\Leftrightarrow a^m>a^n$ với $m,n$ nguyên dương, $a>1$.

Cần chỉ rõ các điều kiện ấy khi biến đổi tương đương.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho điều kiện $a+b=1$ và biểu thức đối xứng theo $a,b$ nên khử mẫu rồi dùng điều kiện để chỉ còn lại tích $ab$; chuỗi biến đổi tương đương sẽ kết thúc ở một bình phương không âm.

**Bước 1.** Quy đồng hai ngoặc rồi nhân hai vế với $ab>0$ để khử mẫu, chú ý nhân với số dương thì không đổi chiều bất đẳng thức.

**Bước 2.** Thay $a+b=1$ vào để rút gọn hai vế, đưa bất đẳng thức về dạng chỉ còn một hằng số so với $ab$.

**Bước 3.** Viết hằng số $1$ thành $(a+b)^2$ để hai vế cùng bậc, nhờ đó xuất hiện hằng đẳng thức bình phương một hiệu $(a-b)^2$.

**Bước 4.** Lập luận mọi bước đều là tương đương nên bất đẳng thức cuối đúng thì bất đẳng thức đầu đúng, rồi tìm điều kiện của dấu "=".

**Chú ý:** Có cách khác nhanh hơn không cần quy đồng: thay $1=a+b$ để $1+\dfrac{1}{a}=2+\dfrac{b}{a}$ và $1+\dfrac{1}{b}=2+\dfrac{a}{b}$, nhân ra rồi dùng $\dfrac{a}{b}+\dfrac{b}{a}\ge2$.

**Phần 2. Trình bày**

Vì $a,b>0$ nên $ab>0$. Ta có

$\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9\Leftrightarrow\dfrac{(a+1)(b+1)}{ab}\ge9\Leftrightarrow ab+a+b+1\ge9ab$ (nhân hai vế với $ab>0$)

$\Leftrightarrow a+b+1\ge8ab\Leftrightarrow2\ge8ab$ (vì $a+b=1$)

$\Leftrightarrow1\ge4ab\Leftrightarrow(a+b)^2\ge4ab$ (vì $a+b=1$)

$\Leftrightarrow(a-b)^2\ge0$, bất đẳng thức này đúng.

Các phép biến đổi trên đều tương đương nên bất đẳng thức đã cho đúng.

Dấu "=" xảy ra khi $a=b$, kết hợp $a+b=1$ được $a=b=\dfrac{1}{2}$.

Vậy $\left(1+\dfrac{1}{a}\right)\left(1+\dfrac{1}{b}\right)\ge9$.

=== V2V.90@p38
- bai: 90 · y: - · trang: 38 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tính chất bất đẳng thức (cộng vế, bình phương hai vế dương) · bình phương không âm
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200.000 cặp (a,b) thực với a+b>1: a⁴+b⁴>1/8 luôn đúng (giá trị nhỏ nhất tiến tới 1/8 khi a=b=1/2, không đạt).
## DE
Cho $a+b>1$. Chứng minh rằng $a^4+b^4>\dfrac{1}{8}$.
## SACH
Ta có

$a+b>1>0$. (1)

Bình phương hai vế:

$(a+b)^2>1\Rightarrow a^2+2ab+b^2>1$. (2)

Mặt khác

$(a-b)^2\ge0\Rightarrow a^2-2ab+b^2\ge0$. (3)

Cộng từng vế của (2) và (3):

$2(a^2+b^2)>1\Rightarrow a^2+b^2>\dfrac{1}{2}$. (4)

Bình phương hai vế của (4):

$a^4+2a^2b^2+b^4>\dfrac{1}{4}$. (5)

Mặt khác

$(a^2-b^2)^2\ge0\Rightarrow a^4-2a^2b^2+b^4\ge0$. (6)

Cộng từng vế của (5) và (6):

$2(a^4+b^4)>\dfrac{1}{4}\Rightarrow a^4+b^4>\dfrac{1}{8}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết cho một tổng $a+b$ còn kết luận là tổng lũy thừa bậc bốn, nên phải nâng bậc hai lần; mỗi lần bình phương sinh ra tích chéo, và tích chéo được khử bằng cách cộng với một bình phương không âm (cộng vế hai bất đẳng thức cùng chiều).

**Bước 1.** Từ $a+b>1>0$ bình phương hai vế (hai vế dương nên giữ nguyên chiều) để chuyển giả thiết thành bất đẳng thức bậc hai chứa $2ab$.

**Bước 2.** Cộng vế với bất đẳng thức $(a-b)^2\ge0$ để triệt tiêu $2ab$, thu được một chặn dưới cho $a^2+b^2$.

**Bước 3.** Chặn dưới đó dương nên bình phương tiếp được, rồi cộng với $(a^2-b^2)^2\ge0$ để triệt tiêu $2a^2b^2$.

**Bước 4.** Chia hai vế cho $2$ để về đúng vế trái $a^4+b^4$ của đề.

**Chú ý:** Chỉ được bình phương hai vế của bất đẳng thức khi cả hai vế dương; ở đây $a,b$ không cho dương nên phải nhìn vào $a+b>1$ và $a^2+b^2>\dfrac{1}{2}$ mới có quyền bình phương. Bất đẳng thức chặt nên không có dấu "=".

**Phần 2. Trình bày**

Vì $a+b>1>0$ nên bình phương hai vế: $(a+b)^2>1$, tức $a^2+2ab+b^2>1$. (1)

Mặt khác $(a-b)^2\ge0$, tức $a^2-2ab+b^2\ge0$. (2)

Cộng từng vế (1) và (2): $2(a^2+b^2)>1$, suy ra $a^2+b^2>\dfrac{1}{2}$. (3)

Hai vế của (3) đều dương, bình phương hai vế: $a^4+2a^2b^2+b^4>\dfrac{1}{4}$. (4)

Mặt khác $(a^2-b^2)^2\ge0$, tức $a^4-2a^2b^2+b^4\ge0$. (5)

Cộng từng vế (4) và (5): $2(a^4+b^4)>\dfrac{1}{4}$, suy ra $a^4+b^4>\dfrac{1}{8}$.

Vậy $a^4+b^4>\dfrac{1}{8}$.

=== V2V.91@p39
- bai: 91 · y: - · trang: 39 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x²+y² ≥ 2xy · cộng vế các bất đẳng thức cùng chiều
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Đề không nêu điều kiện của a,b,c; ngầm hiểu a,b,c khác 0 (để các phân số có nghĩa), bất đẳng thức đúng với mọi a,b,c khác 0 (máy thử 200.000 bộ cả dương lẫn âm). Sách không nêu điều kiện dấu "=": tự giải ra a=b=c.
## DE
Chứng minh bất đẳng thức: $\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{c}{b}+\dfrac{b}{a}+\dfrac{a}{c}$.
## SACH
Áp dụng bất đẳng thức $x^2+y^2\ge2xy$ (xảy ra đẳng thức khi $x=y$), ta có:

$\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}\ge2\cdot\dfrac{a}{b}\cdot\dfrac{b}{c}=2\cdot\dfrac{a}{c}$

Tương tự:

$\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge2\cdot\dfrac{b}{a}$

$\dfrac{c^2}{a^2}+\dfrac{a^2}{b^2}\ge2\cdot\dfrac{c}{b}$

Cộng từng vế ba bất đẳng thức trên:

$2\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\right)\ge2\left(\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}\right)\Rightarrow\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là ba bình phương $\left(\dfrac{a}{b}\right)^2,\left(\dfrac{b}{c}\right)^2,\left(\dfrac{c}{a}\right)^2$ còn vế phải gồm các tích của hai tỉ số liền kề (chẳng hạn $\dfrac{a}{b}\cdot\dfrac{b}{c}=\dfrac{a}{c}$), nên đây là dạng $x^2+y^2\ge2xy$ áp dụng cho từng cặp.

**Bước 1.** Đặt $x=\dfrac{a}{b},\ y=\dfrac{b}{c},\ z=\dfrac{c}{a}$ để thấy vế trái là $x^2+y^2+z^2$ và các tích đôi một $xy,\ yz,\ zx$ chính là các phân số ở vế phải.

**Bước 2.** Viết ba bất đẳng thức $x^2+y^2\ge2xy$, $y^2+z^2\ge2yz$, $z^2+x^2\ge2zx$ ứng với ba cặp, mỗi cái đúng với mọi $x,y,z$ thực.

**Bước 3.** Cộng vế ba bất đẳng thức cùng chiều rồi chia hai vế cho $2$ để về đúng bất đẳng thức đề cho.

**Bước 4.** Tìm điều kiện dấu "=" từ $x=y=z$ và ràng buộc $xyz=1$.

**Phần 2. Trình bày**

Với $a,b,c\ne0$, áp dụng $x^2+y^2\ge2xy$ (dấu "=" khi $x=y$):

$\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}\ge2\cdot\dfrac{a}{b}\cdot\dfrac{b}{c}=\dfrac{2a}{c}$

Tương tự: $\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{2b}{a}$ và $\dfrac{c^2}{a^2}+\dfrac{a^2}{b^2}\ge\dfrac{2c}{b}$

Cộng từng vế ba bất đẳng thức: $2\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\right)\ge2\left(\dfrac{a}{c}+\dfrac{b}{a}+\dfrac{c}{b}\right)$

Chia hai vế cho $2$: $\dfrac{a^2}{b^2}+\dfrac{b^2}{c^2}+\dfrac{c^2}{a^2}\ge\dfrac{c}{b}+\dfrac{b}{a}+\dfrac{a}{c}$.

Dấu "=" xảy ra khi $\dfrac{a}{b}=\dfrac{b}{c}=\dfrac{c}{a}$; tích ba tỉ số này bằng $1$ nên mỗi tỉ số bằng $1$, tức $a=b=c$.

Vậy bất đẳng thức đã cho đúng.

=== V2V.92@p39
- bai: 92 · y: - · trang: 39 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x/y+y/x ≥ 2 · hệ quả (x+y+z)(1/x+1/y+1/z) ≥ 9 · đổi biến x=b+c, y=c+a, z=a+b
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Giữ cả bài một câu vì ý b) dùng kết quả ý a). Máy thử 200.000 bộ (a,b,c) dương: cả hai bất đẳng thức đúng; dấu "=" tại a=b=c (khớp sách).
## DE
Chứng minh các bất đẳng thức với $a,b,c$ là các số dương: a) $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$; b) $\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge1,5$.
## SACH
a) Ta có

$A=(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=1+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{a}+1+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{c}{b}+1$

$=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$.

Dễ chứng minh $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ với $x,y$ dương (bài 325).

Do đó $A\ge3+2+2+2=9$. Vậy $A\ge9$.

Xảy ra đẳng thức khi và chỉ khi $a=b=c$.

b) Áp dụng bất đẳng thức ở câu a:

$(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ trong đó $x,y,z>0$

với $x=b+c,\ y=a+c,\ z=a+b$ ta được:

$2(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{a+c}+\dfrac{1}{a+b}\right)\ge9$

$\Rightarrow(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{a+c}+\dfrac{1}{a+b}\right)\ge4,5$

$\Rightarrow\dfrac{a+b+c}{b+c}+\dfrac{a+b+c}{a+c}+\dfrac{a+b+c}{a+b}\ge4,5$

$\Rightarrow\dfrac{a}{b+c}+1+\dfrac{b}{a+c}+1+1+\dfrac{c}{a+b}\ge4,5$

$\Rightarrow\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\ge1,5$.

Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ý a) là tích của tổng với tổng các nghịch đảo, khai triển ra là $3$ cộng các cặp $\dfrac{x}{y}+\dfrac{y}{x}$ nên chặn mỗi cặp bằng $2$; ý b) có mẫu $b+c,\ c+a,\ a+b$ nên đổi biến thành $x,y,z$ rồi dùng chính kết quả ý a), tử chung $a+b+c$ tách được thành $1+\dfrac{a}{b+c}$.

**Bước 1.** Khai triển $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$ và ghép các phân số nghịch đảo của nhau thành ba cặp, cộng với ba số $1$ ở các hạng tử $\dfrac{a}{a},\dfrac{b}{b},\dfrac{c}{c}$.

**Bước 2.** Chứng minh mỗi cặp $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ bằng cách quy đồng và dùng $(x-y)^2\ge0$ với $x,y>0$, rồi cộng lại để xong ý a).

**Bước 3.** Với ý b), áp dụng kết quả ý a) cho ba số dương $b+c,\ c+a,\ a+b$ có tổng bằng $2(a+b+c)$.

**Bước 4.** Chia hai vế cho $2$ rồi tách mỗi phân số $\dfrac{a+b+c}{b+c}$ thành $1+\dfrac{a}{b+c}$ để chỉ còn vế trái của đề, và chuyển ba số $1$ sang vế phải.

**Phần 2. Trình bày**

a) Với $x,y>0$: $\dfrac{x}{y}+\dfrac{y}{x}-2=\dfrac{(x-y)^2}{xy}\ge0$, tức $\dfrac{x}{y}+\dfrac{y}{x}\ge2$ (dấu "=" khi $x=y$).

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$

$\ge3+2+2+2=9$.

Dấu "=" xảy ra khi $a=b=c$.

b) Đặt $x=b+c,\ y=c+a,\ z=a+b$ thì $x,y,z>0$ và $x+y+z=2(a+b+c)$. Theo ý a):

$2(a+b+c)\left(\dfrac{1}{b+c}+\dfrac{1}{c+a}+\dfrac{1}{a+b}\right)\ge9$

$\Rightarrow\dfrac{a+b+c}{b+c}+\dfrac{a+b+c}{c+a}+\dfrac{a+b+c}{a+b}\ge\dfrac{9}{2}$

$\Rightarrow\left(1+\dfrac{a}{b+c}\right)+\left(1+\dfrac{b}{c+a}\right)+\left(1+\dfrac{c}{a+b}\right)\ge\dfrac{9}{2}$

$\Rightarrow\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\ge\dfrac{9}{2}-3=\dfrac{3}{2}$.

Dấu "=" xảy ra khi $x=y=z$, tức $a=b=c$.

Vậy cả hai bất đẳng thức đều đúng.

=== V2V.93@p40
- bai: 93 · y: - · trang: 40 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác · 1/x+1/y ≥ 4/(x+y) · hoán vị vòng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: bài * (ví dụ 93*). Máy thử 200.000 bộ ba cạnh tam giác: đúng; dấu "=" tại a=b=c.
## DE
Cho $a,b,c$ là độ dài ba cạnh của một tam giác. Chứng minh rằng: $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$.
## SACH
Xét $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}$ và chú ý rằng các mẫu đều dương, áp dụng bất đẳng thức $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y>0$, ta được:

$\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{2b}=\dfrac{2}{b}$.

Tương tự

$\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{2}{c}$,

$\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{2}{a}$.

Cộng từng vế ba bất đẳng thức trên rồi chia cho $2$, ta được điều phải chứng minh.

Xảy ra đẳng thức khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu ở vế trái là $a+b-c,\ b+c-a,\ c+a-b$, cộng hai mẫu bất kì thì được đúng $2a$, $2b$ hoặc $2c$ (các mẫu của vế phải), nên ghép từng cặp với bất đẳng thức $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$.

**Bước 1.** Dùng bất đẳng thức tam giác để thấy ba mẫu $a+b-c,\ b+c-a,\ c+a-b$ đều dương, nhờ đó mới được áp dụng bất đẳng thức giữa các nghịch đảo.

**Bước 2.** Chứng minh $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y>0$ bằng cách quy đồng, quy về $(x-y)^2\ge0$.

**Bước 3.** Áp dụng cho từng cặp mẫu, chẳng hạn $x=a+b-c$ và $y=b+c-a$ có $x+y=2b$, để mỗi cặp bị chặn dưới bởi một phân số có mẫu $a$, $b$ hoặc $c$.

**Bước 4.** Viết hai đánh giá còn lại bằng cách hoán vị vòng, cộng cả ba rồi chia hai vế cho $2$, sau đó xét dấu "=".

**Phần 2. Trình bày**

Vì $a,b,c$ là ba cạnh của một tam giác nên $a+b-c>0,\ b+c-a>0,\ c+a-b>0$.

Với $x,y>0$: $\dfrac{1}{x}+\dfrac{1}{y}-\dfrac{4}{x+y}=\dfrac{(x-y)^2}{xy(x+y)}\ge0$, tức $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ (dấu "=" khi $x=y$).

Áp dụng với $x=a+b-c,\ y=b+c-a$ (có $x+y=2b$): $\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}\ge\dfrac{4}{2b}=\dfrac{2}{b}$

Tương tự: $\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\ge\dfrac{2}{c}$ và $\dfrac{1}{c+a-b}+\dfrac{1}{a+b-c}\ge\dfrac{2}{a}$

Cộng từng vế ba bất đẳng thức: $2\left(\dfrac{1}{a+b-c}+\dfrac{1}{b+c-a}+\dfrac{1}{c+a-b}\right)\ge2\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$

Chia hai vế cho $2$ được bất đẳng thức cần chứng minh.

Dấu "=" xảy ra khi $a+b-c=b+c-a=c+a-b$, tức $a=b=c$.

Vậy bất đẳng thức đã cho đúng.

=== V2V.94@p41
- bai: 94 · y: - · trang: 41 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: (x+y)² ≥ 4xy · nhân vế các bất đẳng thức cùng chiều có hai vế không âm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách ghi dấu "=" xảy ra khi và chỉ khi x=y=z, nhưng thực tế dấu "=" còn xảy ra khi hai trong ba số bằng 0 (vd x=y=0, z>0 thì hai vế cùng bằng 0) — máy xác nhận. Điều kiện "x=y=z" chỉ là điều kiện đủ khi cả ba số dương. Máy thử 200.000 bộ (x,y,z) không âm: bất đẳng thức đúng.
## DE
Cho $x\ge0,\ y\ge0,\ z\ge0$. Chứng minh rằng: $(x+y)(y+z)(z+x)\ge8xyz$.
## SACH
Hai vế của (1) đều không âm nên để chứng minh (1), ta sẽ chứng minh rằng

$(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$.

Ta có

$(x+y)^2\ge4xy,$

$(y+z)^2\ge4yz,$

$(z+x)^2\ge4zx.$

Hai vế của ba bất đẳng thức trên đều không âm, nhân từng vế ta được:

$(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$

$\Rightarrow[(x+y)(y+z)(z+x)]^2\ge[8xyz]^2$.

Các biểu thức trong dấu ngoặc vuông đều không âm nên

$(x+y)(y+z)(z+x)\ge8xyz$.

Xảy ra đẳng thức khi và chỉ khi $x=y=z$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi thừa số $x+y$ đối chiếu với $2\sqrt{xy}$ nhưng chưa có căn bậc hai, nên làm cách bình phương: dùng $(x+y)^2\ge4xy$ cho từng thừa số rồi nhân ba bất đẳng thức cùng chiều có hai vế không âm.

**Bước 1.** Nhận xét hai vế của bất đẳng thức đề cho đều không âm, nên chứng minh được bằng cách chứng minh bình phương hai vế của nó.

**Bước 2.** Chứng minh ba bất đẳng thức $(x+y)^2\ge4xy,\ (y+z)^2\ge4yz,\ (z+x)^2\ge4zx$, mỗi cái tương đương với một bình phương $(x-y)^2\ge0$ và các bình phương tương ứng.

**Bước 3.** Nhân từng vế ba bất đẳng thức này, được phép vì cả hai vế mỗi bất đẳng thức đều không âm, để nhận bình phương của hai vế bất đẳng thức đề cho.

**Bước 4.** Lấy căn hai vế (hai vế không âm nên giữ nguyên chiều) rồi tìm các trường hợp đạt dấu "=".

**Chú ý:** Không được nhân từng vế hai bất đẳng thức cùng chiều nếu có vế âm; ở đây điều kiện $x,y,z\ge0$ bảo đảm mọi vế đều không âm.

**Phần 2. Trình bày**

Vì $x,y,z\ge0$ nên hai vế của bất đẳng thức cần chứng minh đều không âm; ta chứng minh $\left[(x+y)(y+z)(z+x)\right]^2\ge(8xyz)^2$.

Ta có $(x+y)^2-4xy=(x-y)^2\ge0$ nên $(x+y)^2\ge4xy$; tương tự $(y+z)^2\ge4yz$ và $(z+x)^2\ge4zx$.

Hai vế của ba bất đẳng thức đều không âm; nhân từng vế:

$(x+y)^2(y+z)^2(z+x)^2\ge64x^2y^2z^2$

$\Rightarrow\left[(x+y)(y+z)(z+x)\right]^2\ge(8xyz)^2$.

Hai biểu thức trong dấu ngoặc vuông đều không âm nên $(x+y)(y+z)(z+x)\ge8xyz$.

Dấu "=" xảy ra khi $x=y=z$ (ngoài ra còn khi hai trong ba số bằng $0$).

Vậy $(x+y)(y+z)(z+x)\ge8xyz$.

=== V2V.95@p42
- bai: 95 · y: - · trang: 42 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phản chứng · 2ab ≤ a²+b² · bình phương hai vế dương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy thử 200.000 cặp (a,b) thực thoả a²+b²≤2: a+b≤2, bằng 2 tại a=b=1. Sách có "Cách giải khác" (trực tiếp), đã chép vào ## SACH; ## GIAI theo cách phản chứng (cách 1 của sách).
## DE
Cho $a^2+b^2\le2$. Chứng minh rằng $a+b\le2$.
## SACH
Giả sử $a+b>2$, bình phương hai vế (hai vế đều dương), ta được:

$a^2+2ab+b^2>4$ (1)

Mặt khác ta có

$2ab\le a^2+b^2\Rightarrow a^2+b^2+2ab\le2(a^2+b^2)$

mà $2(a^2+b^2)\le4$ (giả thiết), do đó

$a^2+2ab+b^2\le4$ (2)

mâu thuẫn với (1).

Vậy phải có $a+b\le2$.

Cách giải khác. Ta có

$a^2+b^2\le2$ (1)

Mặt khác $2ab\le a^2+b^2$ nên

$2ab\le a^2+b^2\le2$ (2)

Cộng (1) với (2):

$a^2+2ab+b^2\le4\Rightarrow(a+b)^2\le4\Rightarrow-2\le a+b\le2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết cho tổng bình phương $a^2+b^2$, kết luận lại hỏi về $a+b$; cầu nối là $(a+b)^2=a^2+b^2+2ab$ với $2ab\le a^2+b^2$, và vì kết luận là bất đẳng thức "$\le$" nên dễ nhất là giả sử điều ngược lại rồi tìm mâu thuẫn.

**Bước 1.** Giả sử $a+b>2$ rồi bình phương hai vế (hai vế dương nên giữ nguyên chiều) để có bất đẳng thức dạng $(a+b)^2>4$.

**Bước 2.** Dùng $(a-b)^2\ge0$ để chặn tích chéo $2ab$ bởi $a^2+b^2$, từ đó chặn $(a+b)^2$ bởi $2(a^2+b^2)$.

**Bước 3.** Dùng giả thiết $a^2+b^2\le2$ để suy ra $(a+b)^2\le4$ và chỉ ra điều này mâu thuẫn với bước 1.

**Bước 4.** Kết luận điều giả sử sai, rồi tìm điều kiện của $a,b$ để $a+b$ đạt đúng $2$.

**Chú ý:** Cũng có thể làm trực tiếp: $(a+b)^2\le2(a^2+b^2)\le4$, suy ra $-2\le a+b\le2$.

**Phần 2. Trình bày**

Giả sử $a+b>2$. Bình phương hai vế (hai vế đều dương): $a^2+2ab+b^2>4$. (1)

Mặt khác $(a-b)^2\ge0$ nên $2ab\le a^2+b^2$, suy ra $a^2+2ab+b^2\le2(a^2+b^2)$.

Theo giả thiết $a^2+b^2\le2$ nên $2(a^2+b^2)\le4$. Do đó $a^2+2ab+b^2\le4$. (2)

(2) mâu thuẫn với (1). Vậy điều giả sử sai, tức $a+b\le2$.

Dấu "=" xảy ra khi $a=b$ và $a^2+b^2=2$ với $a+b=2$, tức $a=b=1$.

Vậy $a+b\le2$.

=== V2V.96@p42
- bai: 96 · y: - · trang: 42 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội · tách phân số (khử liên tiếp)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: bài * (ví dụ 96*). Máy tính chính xác bằng phân số với n từ 2 đến 1999: tổng luôn nhỏ hơn 1/4 và không vượt 1/4 - 1/(2n(n+1)).
## DE
Chứng minh rằng với mọi số tự nhiên $n\ge2$ ta có $\dfrac{1}{2^3}+\dfrac{1}{3^3}+\dots+\dfrac{1}{n^3}<\dfrac{1}{4}$.
## SACH
Gọi $A$ là vế trái của bất đẳng thức trên. Ta sử dụng tính chất bắc cầu của bất đẳng thức dưới dạng phương pháp làm trội: để chứng minh $A<B$, ta làm trội $A$ thành $C$ ($A<C$) rồi chứng minh rằng $C\le B$ (biểu thức $C$ đóng vai trò trung gian để so sánh $A$ và $B$).

Làm trội mỗi phân số ở $A$ bằng cách làm giảm các mẫu, ta có:

$\dfrac{1}{k^3}<\dfrac{1}{k^3-k}=\dfrac{1}{k(k^2-1)}=\dfrac{1}{(k-1)k(k+1)}$.

Do đó:

$A<\dfrac{1}{2^3-2}+\dfrac{1}{3^3-3}+\dots+\dfrac{1}{n^3-n}=\dfrac{1}{1\cdot2\cdot3}+\dfrac{1}{2\cdot3\cdot4}+\dots+\dfrac{1}{(n-1)n(n+1)}$.

Đặt $C=\dfrac{1}{1\cdot2\cdot3}+\dfrac{1}{2\cdot3\cdot4}+\dots+\dfrac{1}{(n-1)n(n+1)}$, nhận xét rằng:

$\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}=\dfrac{2}{(n-1)n(n+1)}$

nên

$C=\dfrac{1}{2}\left[\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}+\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}+\dots+\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right]$

$=\dfrac{1}{2}\left[\dfrac{1}{2}-\dfrac{1}{n(n+1)}\right]=\dfrac{1}{4}-\dfrac{1}{2n(n+1)}<\dfrac{1}{4}$.

Vậy $\dfrac{1}{2^3}+\dfrac{1}{3^3}+\dots+\dfrac{1}{n^3}<\dfrac{1}{4}$.

Chú ý: Khi làm trội một biểu thức, có trường hợp ta phải chia biểu thức thành nhiều nhóm rồi làm trội trong từng nhóm. Xét ví dụ sau:
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $\dfrac{1}{2^3}+\dots+\dfrac{1}{n^3}$ không có công thức thu gọn, nên phải làm trội: thay mỗi số hạng bằng một số lớn hơn nhưng viết được thành hiệu của hai phân số liên tiếp để cộng lại các số hạng giữa triệt tiêu, còn lại một biểu thức đơn giản nhỏ hơn $\dfrac{1}{4}$.

**Bước 1.** Làm trội mỗi số hạng bằng cách giảm mẫu: $k^3>k^3-k>0$ nên $\dfrac{1}{k^3}<\dfrac{1}{k^3-k}$, và $k^3-k$ phân tích được thành tích ba số nguyên liên tiếp.

**Bước 2.** Viết $\dfrac{1}{(k-1)k(k+1)}$ thành $\dfrac{1}{2}$ của hiệu hai phân số $\dfrac{1}{(k-1)k}$ và $\dfrac{1}{k(k+1)}$ bằng cách quy đồng hiệu đó.

**Bước 3.** Cộng các bất đẳng thức từ $k=2$ đến $k=n$ để các phân số ở giữa triệt tiêu liên tiếp, chỉ còn số hạng đầu và số hạng cuối.

**Bước 4.** Nhận xét số hạng cuối được trừ đi là số dương nên tổng còn lại nhỏ hơn số hạng đầu, từ đó so với $\dfrac{1}{4}$.

**Chú ý:** Bất đẳng thức chặt vì ngay bước làm trội đã có dấu "$<$" nên không có dấu "=" nào xảy ra.

**Phần 2. Trình bày**

Với mọi số tự nhiên $k\ge2$ ta có $0<k^3-k<k^3$ nên

$\dfrac{1}{k^3}<\dfrac{1}{k^3-k}=\dfrac{1}{(k-1)k(k+1)}=\dfrac{1}{2}\left[\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}\right]$

vì $\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}=\dfrac{(k+1)-(k-1)}{(k-1)k(k+1)}=\dfrac{2}{(k-1)k(k+1)}$.

Cho $k=2,3,\dots,n$ rồi cộng từng vế:

$\dfrac{1}{2^3}+\dfrac{1}{3^3}+\dots+\dfrac{1}{n^3}<\dfrac{1}{2}\left[\left(\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}\right)+\left(\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}\right)+\dots+\left(\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right)\right]$

$=\dfrac{1}{2}\left[\dfrac{1}{2}-\dfrac{1}{n(n+1)}\right]=\dfrac{1}{4}-\dfrac{1}{2n(n+1)}<\dfrac{1}{4}$.

Vậy $\dfrac{1}{2^3}+\dfrac{1}{3^3}+\dots+\dfrac{1}{n^3}<\dfrac{1}{4}$ với mọi số tự nhiên $n\ge2$.

=== V2V.97@p43
- bai: 97 · y: - · trang: 43 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội theo nhóm
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: bài * (ví dụ 97*). Máy tính chính xác bằng phân số với n từ 2 đến 15: tổng luôn nhỏ hơn n.
## DE
Chứng minh rằng với mọi số tự nhiên $n\ge2$, ta có $1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{2^n-1}<n$.
## SACH
Gọi vế trái của bất đẳng thức trên là $A$, ta có:

$A=1+\left(\dfrac{1}{2}+\dfrac{1}{3}\right)+\left(\dfrac{1}{2^2}+\dots+\dfrac{1}{7}\right)+\left(\dfrac{1}{2^3}+\dots+\dfrac{1}{15}\right)+\dots+\left(\dfrac{1}{2^{n-1}}+\dots+\dfrac{1}{2^n-1}\right)$.

Ở mỗi nhóm, ta làm trội bằng cách thay các phân số bởi phân số lớn nhất trong nhóm, ta được:

$A<1+\dfrac{1}{2}\cdot2+\dfrac{1}{2^2}\cdot4+\dfrac{1}{2^3}\cdot8+\dots+\dfrac{1}{2^{n-1}}\cdot2^{n-1}=1+1+\dots+1=n$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tổng các nghịch đảo $1,2,\dots,2^n-1$ không thu gọn được; số số hạng $2^n-1$ chia được thành các nhóm có $1,2,4,\dots,2^{n-1}$ số hạng, và trong mỗi nhóm số hạng lớn nhất cho phép làm trội cả nhóm bằng đúng $1$.

**Bước 1.** Chia các số hạng thành $n$ nhóm: nhóm thứ $k$ gồm các $\dfrac{1}{m}$ với $2^k\le m\le2^{k+1}-1$, và đếm được nhóm này có đúng $2^k$ số hạng.

**Bước 2.** Làm trội mỗi nhóm bằng cách thay mọi số hạng trong nhóm bởi số hạng lớn nhất của nhóm là $\dfrac{1}{2^k}$ (mẫu nhỏ nhất).

**Bước 3.** Nhân số hạng lớn nhất với số số hạng để thấy mỗi nhóm bị chặn trên bởi $1$, rồi cộng $n$ nhóm lại.

**Bước 4.** Chỉ ra ít nhất một nhóm bị làm trội thật sự (không bằng nhau) để có dấu "$<$" chặt chứ không chỉ "$\le$".

**Phần 2. Trình bày**

Gọi $A$ là vế trái. Với $k=0,1,\dots,n-1$, nhóm thứ $k$ gồm các số hạng $\dfrac{1}{m}$ với $2^k\le m\le2^{k+1}-1$, có $2^k$ số hạng; các nhóm phủ đúng các số hạng từ $\dfrac{1}{1}$ đến $\dfrac{1}{2^n-1}$ (vì $1+2+\dots+2^{n-1}=2^n-1$):

$A=1+\left(\dfrac{1}{2}+\dfrac{1}{3}\right)+\left(\dfrac{1}{2^2}+\dots+\dfrac{1}{7}\right)+\dots+\left(\dfrac{1}{2^{n-1}}+\dots+\dfrac{1}{2^n-1}\right)$

Trong nhóm thứ $k$, mỗi số hạng không vượt quá $\dfrac{1}{2^k}$ nên nhóm đó không vượt quá $\dfrac{1}{2^k}\cdot2^k=1$. Riêng nhóm thứ $1$: $\dfrac{1}{2}+\dfrac{1}{3}<\dfrac{1}{2}\cdot2=1$ (vì $\dfrac{1}{3}<\dfrac{1}{2}$); vì $n\ge2$ nên nhóm này có mặt. Do đó

$A<1+\dfrac{1}{2}\cdot2+\dfrac{1}{2^2}\cdot4+\dfrac{1}{2^3}\cdot8+\dots+\dfrac{1}{2^{n-1}}\cdot2^{n-1}=1+1+\dots+1=n$.

Vậy $1+\dfrac{1}{2}+\dfrac{1}{3}+\dots+\dfrac{1}{2^n-1}<n$ với mọi số tự nhiên $n\ge2$.
