=== PA.12@p236
- bai: 12 · y: - · trang: 236 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: hiệu hai bình phương · đánh giá hai thừa số
- kiem: khong
- ket_qua_sach: x=1963; y=2013
- dap_an: $(x;y)=(1963;2013)$
- ghi_chu_nghi: Sách in nhầm ở nhánh y>2013: viết (y-x+50) và 39776, đúng phải là (y-x-50) và 3976 (nhân hai vế với -1); không ảnh hưởng kết quả. Kết quả x=1963, y=2013 đúng. Chưa chắc nhóm: có thể là T18T040301 (đưa về tích).
## DE
Tìm các số tự nhiên $x,y$ biết rằng: $(x+2013)^2+y=(y+1963)^2+2013$.
## SACH
$(x+2013)^2+y=(y+1963)^2+2013$
$\Leftrightarrow(x+2013)^2-(y+1963)^2=2013-y$
$\Leftrightarrow(x+50-y)(x+y+3976)=2013-y$
- Xét $y<2013$. Ta có $2013-y>0$. Do đó: $x+50-y>0\Rightarrow x+50-y\ge1\Rightarrow(x+50-y)(x+y+3976)>2013-y$. Vô lí!
- Xét $y>2013$. Ta có: $(y-x+50)(x+y+39776)=y-2013$. Mà $y-2013>0$. Nên $y-x-50>0\Rightarrow y-x-50\ge1\Rightarrow(y-x+50)(x+y+3976)>y-2013$. Vô lí!

Vậy ta có $y=2013$. Do đó $x=1963$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển các hạng tử chứa $y$ sang một vế thì vế kia là hiệu hai bình phương, phân tích được thành tích hai thừa số; thừa số thứ hai luôn dương và lớn, nên so sánh được tích với vế phải để chặn $y$.

**Bước 1.** Chuyển $y$ và $2013$ sang hai vế khác nhau rồi dùng hằng đẳng thức hiệu hai bình phương cho vế chứa bình phương, đưa phương trình về dạng tích bằng $2013-y$.

**Bước 2.** Xét $y<2013$: vế phải dương nên thừa số thứ nhất là số nguyên dương, tức không nhỏ hơn $1$; khi đó tích không nhỏ hơn thừa số thứ hai và phải lớn hơn vế phải, mâu thuẫn.

**Bước 3.** Xét $y>2013$ theo cách tương tự sau khi đổi dấu hai vế, để loại trường hợp này.

**Bước 4.** Với $y=2013$ vế phải bằng $0$, thay vào tích để tìm $x$.

**Chú ý:** Nhờ $x,y$ là số tự nhiên nên $x+y+3976$ luôn dương và không nhỏ hơn $y+3976$; đây là điều kiện cho phép so sánh tích với vế phải.

**Phần 2. Trình bày**

$(x+2013)^2+y=(y+1963)^2+2013$

$\Leftrightarrow(x+2013)^2-(y+1963)^2=2013-y$

$\Leftrightarrow(x-y+50)(x+y+3976)=2013-y\quad(*)$

Trường hợp $y<2013$: vế phải của $(*)$ dương, mà $x+y+3976>0$ nên $x-y+50>0$, suy ra $x-y+50\ge1$ (vì là số nguyên).

Khi đó vế trái $\ge x+y+3976\ge y+3976>2013-y$, trái với $(*)$.

Trường hợp $y>2013$: $(*)\Leftrightarrow(y-x-50)(x+y+3976)=y-2013>0$, nên $y-x-50\ge1$.

Khi đó vế trái $\ge x+y+3976>y-2013$, trái với $(*)$.

Vậy $y=2013$. Khi đó $(*)$ thành $(x-1963)(x+5989)=0$, mà $x+5989>0$ nên $x=1963$.

Vậy $(x;y)=(1963;2013)$.

=== PA.13@p237
- bai: 13 · y: - · trang: 237 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040303
- cong_cu: chữ số tận cùng của số chính phương · số dư khi chia cho 10
- kiem: khong
- ket_qua_sach: (1;1); (3;3)
- dap_an: $(x;y)\in\{(1;1);(3;3)\}$
- ghi_chu_nghi: Dấu "+" giữa 2! và 3! trong đề in giống "|" nhưng theo lời giải là dấu cộng. Chưa chắc nhóm: T18T040303 hay T18T040302 (xét số dư cho 10).
## DE
Tìm $x,y$ nguyên dương thỏa mãn: $1!+2!+3!+\dots+x!=y^2$.
## SACH
Xét $x\ge5$. Ta có: $5!\vdots10$; $6!\vdots10$; ...; $x!\vdots10$ và $1!+2!+3!+4!=33$.
Nên $1!+2!+3!+\dots+x!$ chia cho $10$ dư $3\Rightarrow y^2$ chia cho $10$ dư $3\Rightarrow y^2$ có chữ số tận cùng là $3$. Điều này vô lí!
Vậy $x\le4$.
- $x=1$. Ta có $y^2=1$. Nên $y=1$
- $x=2$. Ta có $y^2=3$. Loại vì $y\in\mathbb N$
- $x=3$. Ta có $y^2=9$. Nên $y=3$
- $x=4$. Ta có $y^2=33$. Loại vì $y\in\mathbb N$

Vậy: $x=1;y=1$ hoặc $x=3;y=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $5!$ trở đi mọi giai thừa đều chia hết cho $10$ nên chữ số tận cùng của tổng không còn đổi, mà chữ số đó không thể là chữ số tận cùng của một số chính phương.

**Bước 1.** Nhận xét rằng $k!$ với $k\ge5$ chứa cả thừa số $2$ và thừa số $5$ nên chia hết cho $10$, do đó chỉ bốn số hạng đầu quyết định chữ số tận cùng của tổng.

**Bước 2.** Tính tổng bốn số hạng đầu để biết chữ số tận cùng của vế trái khi $x\ge5$.

**Bước 3.** Xét chữ số tận cùng của $y^2$ theo chữ số tận cùng của $y$ để thấy vế phải không thể có chữ số tận cùng đó, từ đó chặn $x\le4$.

**Bước 4.** Thử trực tiếp từng giá trị $x\in\{1;2;3;4\}$ rồi kiểm tra vế trái có phải số chính phương hay không.

**Chú ý:** Số chính phương chỉ có chữ số tận cùng là $0;1;4;5;6;9$ — nhớ bảng này để loại nhanh các phương trình dạng tổng bằng bình phương.

**Phần 2. Trình bày**

Với $x\ge5$: $5!,6!,\dots,x!$ đều chia hết cho $10$ (chứa thừa số $2$ và $5$), còn $1!+2!+3!+4!=33$.

Nên $1!+2!+\dots+x!$ chia cho $10$ dư $3$, tức $y^2$ có chữ số tận cùng là $3$.

Nhưng bình phương của một số tự nhiên có chữ số tận cùng chỉ là $0;1;4;5;6;9$ — vô lí. Vậy $x\le4$.

$x=1$: $y^2=1\Rightarrow y=1$ (thỏa mãn).

$x=2$: $y^2=1+2=3$, không là số chính phương — loại.

$x=3$: $y^2=1+2+6=9\Rightarrow y=3$ (thỏa mãn).

$x=4$: $y^2=1+2+6+24=33$, không là số chính phương — loại.

Vậy $(x;y)\in\{(1;1);(3;3)\}$.

=== PA.14@p237
- bai: 14 · y: - · trang: 237 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: đổi biến (dịch gốc) · hằng đẳng thức tổng hai lập phương
- kiem: khong
- ket_qua_sach: 6
- dap_an: $6$
- ghi_chu_nghi:
## DE
Cho $x,y$ thỏa mãn $x^3-9x^2+29x-47=0$ và $y^3-9y^2+29y-19=0$. Tính giá trị của biểu thức $M=x+y$.
## SACH
Ta có: $x^3-9x^2+29x-47=0\Rightarrow(x-3)^3+2(x-3)-14=0\quad(1)$
Và $y^3-9y^2+29y-19=0\Rightarrow(y-3)^3+2(y-3)+14=0\quad(2)$
Từ (1) và (2) ta có:
$(x-3)^3+(y-3)^3+2(x-3)+2(y-3)=0$
$\Rightarrow(x+y-6)[(x-3)^2-(x-3)(y-3)+(y-3)^2+2]=0$
$\Rightarrow x+y-6=0\Rightarrow x+y=6$
(Vì $(x-3)^2-(x-3)(y-3)+(y-3)^2+2=\left[(x-3)-\dfrac{1}{2}(y-3)\right]^2+\dfrac{3}{4}(y-3)^2+2>0$)
Vậy $x+y=6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai phương trình bậc ba chỉ khác nhau hằng số; dịch biến $x\to x-3$, $y\to y-3$ làm mất số hạng bậc hai, hai hằng số còn lại đối nhau nên cộng hai phương trình sẽ gọn thành một nhân tử chứa tổng $x+y$.

**Bước 1.** Viết $x^3-9x^2+29x-47$ theo $x-3$ bằng cách khai triển $(x-3)^3$ rồi cân đối các hạng tử, để thu được dạng $u^3+2u$ cộng một hằng số.

**Bước 2.** Làm tương tự với phương trình của $y$ để có dạng $v^3+2v$ cộng một hằng số đối với hằng số ở bước trước.

**Bước 3.** Cộng hai phương trình theo vế rồi phân tích $u^3+v^3+2(u+v)$ thành tích bằng hằng đẳng thức tổng hai lập phương.

**Bước 4.** Chứng tỏ thừa số bậc hai luôn dương để chỉ còn thừa số $u+v$ bằng $0$.

**Chú ý:** Tổng hai nghiệm của hai phương trình khác nhau thường có giá trị đẹp khi hai phương trình có thể đưa về dạng $t^3+pt=\pm q$ với cùng $p,q$.

**Phần 2. Trình bày**

Đặt $u=x-3$, $v=y-3$. Ta có $x^3-9x^2+29x-47=(x-3)^3+2(x-3)-14$ và $y^3-9y^2+29y-19=(y-3)^3+2(y-3)+14$, nên

$u^3+2u-14=0\quad(1)$

$v^3+2v+14=0\quad(2)$

Cộng $(1)$ và $(2)$ theo vế: $u^3+v^3+2(u+v)=0$

$\Rightarrow(u+v)(u^2-uv+v^2)+2(u+v)=0$

$\Rightarrow(u+v)(u^2-uv+v^2+2)=0$

Mà $u^2-uv+v^2+2=\left(u-\dfrac{v}{2}\right)^2+\dfrac{3}{4}v^2+2>0$ với mọi $u,v$.

Nên $u+v=0$, tức $x+y-6=0$.

Vậy $M=x+y=6$.

=== PA.15@p237
- bai: 15 · y: - · trang: 237 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030102
- cong_cu: làm trội · bất đẳng thức $XY\le\dfrac{(X+Y)^2}{4}$ (Cô-si cho hai số không âm)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho các số $a,b,c,d,e$ thỏa mãn: $a^2+b^2+c^2+d^2+e^2=1$. Chứng minh rằng: $a^2b^2+b^2c^2+c^2d^2+d^2e^2\le\dfrac{1}{4}$.
## SACH
Ta có: $a^2b^2+b^2c^2+c^2d^2+d^2e^2\le a^2b^2+a^2d^2+b^2c^2+c^2d^2+b^2e^2+d^2e^2$
$=a^2(b^2+d^2)+c^2(b^2+d^2)+e^2(b^2+d^2)=(a^2+c^2+e^2)(b^2+d^2)$
$\le\dfrac{1}{4}(a^2+c^2+e^2+b^2+d^2)^2=\dfrac{1}{4}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái thiếu hai hạng tử không âm $a^2d^2$ và $b^2e^2$ so với tích $(a^2+c^2+e^2)(b^2+d^2)$; bổ sung chúng để làm trội, rồi tích hai biểu thức có tổng cho trước bằng $1$ thì không vượt quá $\dfrac{1}{4}$.

**Bước 1.** Cộng thêm vào vế trái hai số không âm $a^2d^2$ và $b^2e^2$ để có một biểu thức lớn hơn hoặc bằng nó và có nhiều nhân tử chung hơn.

**Bước 2.** Nhóm các hạng tử theo $a^2,c^2,e^2$ để đặt nhân tử chung $b^2+d^2$, thu được tích của hai biểu thức không âm.

**Bước 3.** Áp dụng bất đẳng thức $XY\le\dfrac{(X+Y)^2}{4}$ cho hai thừa số, nhớ rằng nó đúng vì $(X-Y)^2\ge0$.

**Bước 4.** Thay giả thiết về tổng các bình phương để tính giá trị của cận trên.

**Chú ý:** Khi làm trội, chỉ được cộng thêm số không âm vào vế nhỏ; cộng số có thể âm sẽ làm đổi chiều bất đẳng thức.

**Phần 2. Trình bày**

Vì $a^2d^2\ge0$ và $b^2e^2\ge0$ nên

$a^2b^2+b^2c^2+c^2d^2+d^2e^2\le a^2b^2+a^2d^2+b^2c^2+c^2d^2+b^2e^2+d^2e^2$

$=a^2(b^2+d^2)+c^2(b^2+d^2)+e^2(b^2+d^2)$

$=(a^2+c^2+e^2)(b^2+d^2)$

Đặt $X=a^2+c^2+e^2$, $Y=b^2+d^2$. Vì $(X-Y)^2\ge0$ nên $XY\le\dfrac{(X+Y)^2}{4}$, do đó

$(a^2+c^2+e^2)(b^2+d^2)\le\dfrac{1}{4}(a^2+b^2+c^2+d^2+e^2)^2=\dfrac{1}{4}\cdot1^2=\dfrac{1}{4}$

Vậy $a^2b^2+b^2c^2+c^2d^2+d^2e^2\le\dfrac{1}{4}$.

=== PA.16@p238
- bai: 16 · y: - · trang: 238 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: giả sử thứ tự các ẩn (không mất tính tổng quát) · chặn ẩn nhỏ nhất bằng bất đẳng thức · đưa về phương trình tích
- kiem: khong
- ket_qua_sach: (12;2;1) và các hoán vị
- dap_an: $(x;y;z)\in\{(12;2;1);(12;1;2);(2;12;1);(2;1;12);(1;12;2);(1;2;12)\}$
- ghi_chu_nghi:
## DE
Tìm $x,y,z$ nguyên dương thỏa mãn: $xyz=x+y+z+9$.
## SACH
Vai trò $x,y,z$ như nhau. Không mất tính tổng quát giả sử $x\ge y\ge z$.
Nếu $z\ge3$ thì $xyz\ge x\cdot3\cdot3=9x=6x+3x\ge18+3x\ge18+x+y+z>9+x+y+z$
Vậy $z\le2$
- Xét $z=1$. Ta có $xy=x+y+10\Leftrightarrow xy-x-y+1=11\Leftrightarrow(x-1)(y-1)=11\Leftrightarrow x=12;y=2$
- Xét $z=2$. Ta có $2xy=x+y+11\Leftrightarrow4xy-2x-2y+1=23\Leftrightarrow(2x-1)(2y-1)=23$. Vô nghiệm

Vậy $(x=12;y=2;z=1)$ và các hoán vị
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba ẩn có vai trò như nhau và vế trái là tích còn vế phải là tổng, nên sắp thứ tự các ẩn rồi chặn được ẩn nhỏ nhất, sau đó mỗi trường hợp còn lại đưa về phương trình tích.

**Bước 1.** Giả sử $x\ge y\ge z\ge1$ (phương trình đối xứng nên không mất tổng quát), rồi lập luận phản chứng: nếu $z\ge3$ thì tích lớn hơn tổng cộng $9$.

**Bước 2.** Từ bước trên chỉ còn hai giá trị của $z$; với mỗi giá trị, thay vào để được phương trình hai ẩn $x,y$.

**Bước 3.** Biến đổi từng phương trình hai ẩn thành tích hai thừa số nguyên bằng một số cho trước (thêm hạng tử vào hai vế), rồi xét các cặp ước.

**Bước 4.** Kết luận các bộ có thứ tự $x\ge y\ge z$ rồi viết đủ các hoán vị của nó.

**Chú ý:** Khi xét ước, nhớ dùng điều kiện $x\ge y\ge z$ để loại bớt cặp; và đừng quên hoán vị cuối cùng vì đề không có thứ tự.

**Phần 2. Trình bày**

Vì vai trò $x,y,z$ như nhau nên giả sử $x\ge y\ge z\ge1$.

Nếu $z\ge3$ thì $y\ge3$, $x\ge3$ và $xyz\ge9x=6x+3x\ge18+3x\ge18+x+y+z>9+x+y+z$, mâu thuẫn.

Vậy $z\in\{1;2\}$.

$z=1$: $xy=x+y+10\Leftrightarrow xy-x-y+1=11\Leftrightarrow(x-1)(y-1)=11$.

Vì $x-1\ge y-1\ge0$ và $11$ là số nguyên tố nên $x-1=11$, $y-1=1$, tức $x=12$, $y=2$.

$z=2$: $2xy=x+y+11\Leftrightarrow4xy-2x-2y+1=23\Leftrightarrow(2x-1)(2y-1)=23$.

Vì $y\ge z=2$ nên $2x-1\ge2y-1\ge3$, tích hai số này không thể bằng số nguyên tố $23$ — vô nghiệm.

Vậy các bộ $(x;y;z)$ là các hoán vị của $(12;2;1)$:

$(x;y;z)\in\{(12;2;1);(12;1;2);(2;12;1);(2;1;12);(1;12;2);(1;2;12)\}$.

=== PA.17@p238
- bai: 17 · y: - · trang: 238 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: xét hiệu · dùng giả thiết cộng thêm số không dương · hằng đẳng thức
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $x,y>0$ thỏa mãn: $x^3+y^4\le x^2+y^3$. Chứng minh rằng: $x^2+y^3\le x+y^2$.
## SACH
Ta có $x^3+y^4\le x^2+y^3\Leftrightarrow x^3+y^4-x^2-y^3\le0$
Do đó: $(x+y^2)-(x^2+y^3)=x+y^2-x^2-y^3$
$\ge x+y^2-x^2-y^3+x^3+y^4-x^2-y^3$
$=x-2x^2+x^3+y^2-2y^3+y^4=x(1-2x+x^2)+y^2(1-2y+y^2)$
$=x(1-x)^2+y^2(1-y)^2\ge0$
Ta có: $(x+y^2)-(x^2+y^3)\ge0$
Do vậy: $x^2+y^3\le x+y^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết cho một biểu thức không dương; cộng nó vào hiệu cần xét làm hiệu không tăng, và kết quả gộp lại thành $x(1-x)^2+y^2(1-y)^2$ hiển nhiên không âm.

**Bước 1.** Lập hiệu $A=(x+y^2)-(x^2+y^3)$ của hai vế cần chứng minh, rồi chuyển giả thiết về dạng một biểu thức nhỏ hơn hoặc bằng $0$.

**Bước 2.** Cộng biểu thức không dương đó vào $A$ để đánh giá $A$ lớn hơn hoặc bằng biểu thức mới, vì cộng thêm một số không dương không làm tăng giá trị.

**Bước 3.** Gộp các hạng tử theo $x$ và theo $y$ rồi đặt nhân tử chung để thấy hai bình phương xuất hiện.

**Bước 4.** Dùng $x>0$ để kết luận mỗi nhóm không âm, từ đó suy ra $A\ge0$.

**Chú ý:** Phải cộng đúng biểu thức đã cho là không dương vào bên nhỏ hơn; nếu cộng sai chiều thì bất đẳng thức đổi hướng.

**Phần 2. Trình bày**

Từ giả thiết: $x^3+y^4-x^2-y^3\le0$.

Do đó $(x+y^2)-(x^2+y^3)\ge(x+y^2)-(x^2+y^3)+(x^3+y^4-x^2-y^3)$

$=x-2x^2+x^3+y^2-2y^3+y^4$

$=x(1-2x+x^2)+y^2(1-2y+y^2)$

$=x(1-x)^2+y^2(1-y)^2\ge0$ (vì $x>0$).

Suy ra $(x+y^2)-(x^2+y^3)\ge0$.

Vậy $x^2+y^3\le x+y^2$.

=== PA.18@p238
- bai: 18 · y: - · trang: 238 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: nhân hai vế với $x+y$ để lập hệ theo tổng và tích · hệ thức truy hồi
- kiem: khong
- ket_qua_sach: 2^{2013}+1
- dap_an: $2^{2013}+1$
- ghi_chu_nghi: Đề sách in "ax^2 = by^2 = 5" (hai dấu "="); theo lời giải của sách (dòng (ax^2+by^2)(x+y)=5(x+y)) phải là ax^2+by^2=5. Lời giải kho soạn theo phiên bản ax^2+by^2=5. Sách còn in nhầm "175xy=9(x+y)" thay cho "17+5xy=9(x+y)" và dòng "ax^5+by^5+9xy=17(x+y)" (không dùng tới). Đáp số 2^{2013}+1 đúng.
## DE
Cho $a,b,x,y$ thỏa mãn: $ax+by=3$, $ax^2+by^2=5$, $ax^3+by^3=9$ và $ax^4+by^4=17$. Tính giá trị của biểu thức: $M=ax^{2013}+by^{2013}$.
## SACH
Ta có: $(ax+by)(x+y)=3(x+y)$, $(ax^2+by^2)(x+y)=5(x+y)$, $(ax^3+by^3)(x+y)=9(x+y)$, $(ax^4+by^4)(x+y)=17(x+y)$
$\Leftrightarrow5+xy(a+b)=3(x+y)$; $9+3xy=5(x+y)$; $17+5xy=9(x+y)$; $ax^5+by^5+9xy=17(x+y)$
Ta có: $9+3xy=5(x+y)$ và $175xy=9(x+y)$ $\Leftrightarrow x+y=3$, $xy=2$
$\Leftrightarrow x=3-y$, $y(3-y)=2$ $\Leftrightarrow(y-1)(y-2)=0$, $2a+b=3$ $\Leftrightarrow x=2;y=1$ hoặc $x=1;y=2$
- $x=2;y=1$. Ta có: $2a+b=3$, $4a+b=5\Leftrightarrow a=1$, $b=1$
- $x=1;y=2$. Ta có: $a+2b=3$, $a+4b=5\Leftrightarrow a=1$, $b=1$

Vậy $M=2^{2013}+1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các tổng $ax^n+by^n$ liên tiếp nối với nhau qua $x+y$ và $xy$ (nhân một tổng với $x+y$ cho tổng kế tiếp cộng $xy$ nhân tổng trước), nên từ ba tổng suy ra được $x+y$ và $xy$, tức tìm được $x,y$.

**Bước 1.** Nhân hai vế của đẳng thức thứ hai với $x+y$ rồi tách $(ax^2+by^2)(x+y)$ thành tổng cho lũy thừa kế tiếp và một hạng tử có nhân tử $xy$.

**Bước 2.** Làm tương tự với đẳng thức thứ ba để có thêm một phương trình theo $x+y$ và $xy$, rồi giải hệ hai phương trình bậc nhất hai ẩn đó.

**Bước 3.** Từ tổng và tích biết trước, lập phương trình bậc hai nhận $x,y$ làm nghiệm để tìm hai cặp $(x;y)$.

**Bước 4.** Với mỗi cặp, thay vào hai đẳng thức đầu để tìm $a,b$ rồi tính $M$.

**Chú ý:** Kết quả $M$ như nhau cho cả hai cặp $(x;y)$ vì $a,b$ tìm được đối xứng; nhớ thử lại hai đẳng thức còn lại nếu còn thời gian.

**Phần 2. Trình bày**

Đặt $s=x+y$, $p=xy$. Nhân hai vế của $ax^2+by^2=5$ với $x+y$:

$(ax^2+by^2)(x+y)=ax^3+by^3+xy(ax+by)\Rightarrow5s=9+3p$.

Nhân hai vế của $ax^3+by^3=9$ với $x+y$:

$(ax^3+by^3)(x+y)=ax^4+by^4+xy(ax^2+by^2)\Rightarrow9s=17+5p$.

Giải hệ $\begin{cases}5s-3p=9\\9s-5p=17\end{cases}$: nhân phương trình đầu với $5$, phương trình sau với $3$ rồi trừ ta được $2s=6$, nên $s=3$, $p=2$.

Khi đó $x$ thỏa mãn $x^2-3x+2=0\Leftrightarrow(x-1)(x-2)=0$, nên $(x;y)=(2;1)$ hoặc $(x;y)=(1;2)$.

Với $(x;y)=(2;1)$: $\begin{cases}2a+b=3\\4a+b=5\end{cases}\Rightarrow a=1$, $b=1$.

Với $(x;y)=(1;2)$: $\begin{cases}a+2b=3\\a+4b=5\end{cases}\Rightarrow a=1$, $b=1$.

Cả hai trường hợp đều có $a=b=1$ và $\{x;y\}=\{1;2\}$, nên $M=1^{2013}+2^{2013}$.

Vậy $M=2^{2013}+1$.

=== PA.19@p239
- bai: 19 · y: - · trang: 239 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040302
- cong_cu: đưa về bình phương bằng biểu thức tích · bình phương không âm giới hạn $xy$
- kiem: khong
- ket_qua_sach: (0;0); (1;1); (-1;-1)
- dap_an: $(x;y)\in\{(0;0);(1;1);(-1;-1)\}$
- ghi_chu_nghi:
## DE
Tìm $x,y$ nguyên thỏa mãn: $8x^2y^2+x^2+y^2=10xy$.
## SACH
$8x^2y^2+x^2+y^2=10xy$
$x^2+y^2-2xy=8xy-8x^2y^2$
$(x-y)^2=8xy(1-xy)$
$(x-y)^2\ge0$. Nên $8xy(1-xy)\ge0\Leftrightarrow\begin{cases}xy\ge0;1-xy\ge0\\xy\le0;1-xy\le0\end{cases}\Leftrightarrow0\le xy\le1$
Nên $xy=0$ hoặc $xy=1$
- $xy=0$. Ta có $x=y=0$
- $xy=1\Leftrightarrow x=y=1$ (thích hợp) hoặc $x=y=-1$ (thích hợp)

Vậy $x=0;y=0$; $x=1;y=1$; $x=-1;y=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển $10xy$ sang vế phải thì vế trái hiện $x^2+y^2-2xy=(x-y)^2$ và vế phải chỉ còn phụ thuộc $xy$, bình phương không âm nên $xy$ bị chặn trong một đoạn rất hẹp.

**Bước 1.** Chuyển hạng tử $2xy$ từ vế phải sang vế trái và đưa $8x^2y^2$ sang phải để vế trái là $(x-y)^2$ còn vế phải là $8xy(1-xy)$.

**Bước 2.** Dùng $(x-y)^2\ge0$ để suy ra $xy(1-xy)\ge0$ rồi giải bất phương trình tích theo ẩn $xy$.

**Bước 3.** Vì $x,y$ nguyên nên $xy$ nguyên, chỉ còn hai giá trị của $xy$; xét từng giá trị.

**Bước 4.** Với mỗi giá trị của $xy$ vế phải bằng $0$ nên $x=y$, từ đó tìm $x,y$ rồi thử lại vào đề.

**Chú ý:** Bất đẳng thức $xy(1-xy)\ge0$ chỉ cho $0\le xy\le1$; $xy$ nằm ngoài khoảng này làm tích âm — dễ quên khi chỉ xét một dấu.

**Phần 2. Trình bày**

$8x^2y^2+x^2+y^2=10xy$

$\Leftrightarrow x^2+y^2-2xy=8xy-8x^2y^2$

$\Leftrightarrow(x-y)^2=8xy(1-xy)$

Vì $(x-y)^2\ge0$ nên $xy(1-xy)\ge0$, tức $xy$ và $1-xy$ cùng dấu hoặc một số bằng $0$, suy ra $0\le xy\le1$.

Vì $xy$ nguyên nên $xy=0$ hoặc $xy=1$.

Khi đó vế phải bằng $0$, nên $(x-y)^2=0$, tức $x=y$.

Nếu $xy=0$ thì $x^2=0$, suy ra $x=y=0$.

Nếu $xy=1$ thì $x^2=1$, suy ra $x=y=1$ hoặc $x=y=-1$.

Thử lại: $(0;0)$, $(1;1)$, $(-1;-1)$ đều thỏa mãn (với $(\pm1;\pm1)$: $8+1+1=10$).

Vậy $(x;y)\in\{(0;0);(1;1);(-1;-1)\}$.

=== PA.20@p239
- bai: 20 · y: - · trang: 239 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040201
- cong_cu: đặt ẩn phụ $x=5^{25}$ · thêm bớt để đưa về hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ nói hai thừa số "là các số nguyên lớn hơn 1" mà không chứng minh; lời giải kho có chứng minh thêm.
## DE
Cho $A=\dfrac{5^{125}-1}{5^{25}-1}$. Chứng minh rằng $A$ là hợp số.
## SACH
Đặt $x=5^{25}$
Ta có $A=\dfrac{5^{125}-1}{5^{25}-1}=\dfrac{(5^{25})^5-1}{5^{25}-1}=\dfrac{x^5-1}{x-1}=x^4+x^3+x^2+x+1$
$=(x^4+9x^2+1+6x^3+2x^2+6x)-(5x^3+10x^2+5x)$
$=(x^2+3x+1)^2-5x(x+1)^2=(x^2+3x+1)^2-5^{26}(x+1)^2$
$=(x^2+3x+1)^2-\left[5^{13}(x+1)\right]^2$
$=\left[(x^2+3x+1)+5^{13}(x+1)\right]\left[(x^2+3x+1)-5^{13}(x+1)\right]$
Vì $x=5^{25}$ nên $(x^2+3x+1)+5^{13}(x+1)$ và $(x^2+3x+1)-5^{13}(x+1)$ là các số nguyên lớn hơn $1$.
Vậy $A$ là một hợp số.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $x=5^{25}$ thì $A=x^4+x^3+x^2+x+1$, và vì $5x=5^{26}=(5^{13})^2$ là một số chính phương, ta viết được $A$ thành hiệu hai bình phương rồi phân tích thành tích hai thừa số.

**Bước 1.** Đặt $x=5^{25}$, viết tử số là $x^5-1$ rồi chia cho $x-1$ để đưa $A$ về đa thức bậc bốn.

**Bước 2.** Thêm bớt hạng tử để $A$ bằng $(x^2+3x+1)^2$ trừ đi một biểu thức có nhân tử $x$; đây là phép biến đổi cần nhận ra từ hệ số của $x^4+x^3+x^2+x+1$.

**Bước 3.** Viết phần bị trừ dưới dạng bình phương của $5^{13}(x+1)$ rồi dùng hằng đẳng thức hiệu hai bình phương.

**Bước 4.** Chứng tỏ cả hai thừa số là số nguyên lớn hơn $1$ để kết luận $A$ là hợp số.

**Chú ý:** Hợp số là tích của hai số nguyên đều lớn hơn $1$; phải kiểm tra thừa số nhỏ hơn, vì thừa số này có dấu trừ nên dễ nhỏ hơn hoặc bằng $1$.

**Phần 2. Trình bày**

Đặt $x=5^{25}$. Khi đó

$A=\dfrac{(5^{25})^5-1}{5^{25}-1}=\dfrac{x^5-1}{x-1}=x^4+x^3+x^2+x+1$

$=(x^4+6x^3+11x^2+6x+1)-(5x^3+10x^2+5x)$

$=(x^2+3x+1)^2-5x(x+1)^2$

$=(x^2+3x+1)^2-5^{26}(x+1)^2$ (vì $5x=5^{26}$)

$=(x^2+3x+1)^2-\left[5^{13}(x+1)\right]^2$

$=\left[x^2+3x+1+5^{13}(x+1)\right]\left[x^2+3x+1-5^{13}(x+1)\right]$.

Thừa số thứ nhất là số nguyên lớn hơn $1$ vì $x>0$.

Vì $x=5^{25}>2\cdot5^{13}$ nên $5^{13}(x+1)\le2\cdot5^{13}x<x^2$, do đó thừa số thứ hai lớn hơn $3x+1>1$ và cũng là số nguyên.

Vậy $A$ là tích của hai số nguyên lớn hơn $1$, tức $A$ là hợp số.

=== PA.21@p240
- bai: 21 · y: - · trang: 240 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: đánh giá từ các điều kiện giá trị tuyệt đối · bất đẳng thức bình phương
- kiem: khong
- ket_qua_sach: \dfrac{32}{3}
- dap_an: GTLN của $M$ là $\dfrac{32}{3}$, đạt khi $(x;y;z)\in\{(2;0;-1);(-2;0;1)\}$
- ghi_chu_nghi: Sách ghi dấu "=" xảy ra khi x=±1, y=0, z=±1 — sai: khi đó M=8/3, không phải 32/3. Dấu "=" của M=32/3 cần x^2+y^2=4 và y=0, tức x=±2, y=0; kèm điều kiện đề thì z=-1 khi x=2, z=1 khi x=-2. Giá trị lớn nhất 32/3 của sách đúng.
## DE
Cho $x,y,z$ thỏa mãn: $\lvert x+y+z\rvert\le1$, $\lvert x-y+z\rvert\le1$, $\lvert z\rvert\le1$. Tìm giá trị lớn nhất của $M=\dfrac{8}{3}x^2+y^2$.
## SACH
Ta có: $-1\le x+y+z\le1$; $-1\le x-y+z\le1$; $-1\le z\le1$
Do đó $-2\le x+y\le2$; $-2\le x-y\le2$
Nên $(x+y)^2+(x-y)^2\le8\Rightarrow x^2+y^2\le4$
Ta có $M=\dfrac{8}{3}x^2+y^2=\dfrac{8}{3}(x^2+y^2)-\dfrac{5}{3}y^2\le\dfrac{8}{3}(x^2+y^2)\le\dfrac{8}{3}\cdot4=\dfrac{32}{3}$
Dấu "=" xảy ra $\Leftrightarrow x=\pm1$, $y=0$, $z=\pm1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Trừ các đại lượng trong ba điều kiện cho nhau để đưa $x+y$ và $x-y$ vào đoạn $[-2;2]$, rồi cộng hai bình phương cho ra cận trên của $x^2+y^2$ và từ đó cận trên của $M$.

**Bước 1.** Viết $x+y=(x+y+z)-z$ và $x-y=(x-y+z)-z$ rồi dùng ba điều kiện để chặn hai tổng này giữa $-2$ và $2$.

**Bước 2.** Suy ra bình phương của hai đại lượng đó không quá $4$ và cộng chúng lại để đánh giá $x^2+y^2$.

**Bước 3.** Viết $M$ dưới dạng bội của $x^2+y^2$ trừ đi một số hạng không âm để áp dụng cận vừa có.

**Bước 4.** Tìm giá trị của $x,y,z$ làm mọi dấu bằng đồng thời xảy ra và thử lại vào ba điều kiện đề để chắc cận trên đạt được.

**Chú ý:** Cận trên chỉ là giá trị lớn nhất khi có bộ giá trị thỏa mọi điều kiện của đề mà đạt cận; luôn tìm và thử bộ giá trị đó.

**Phần 2. Trình bày**

Từ giả thiết: $-1\le x+y+z\le1$, $-1\le x-y+z\le1$, $-1\le z\le1$.

Vì $x+y=(x+y+z)-z$ và $x-y=(x-y+z)-z$ nên $-2\le x+y\le2$ và $-2\le x-y\le2$.

Suy ra $(x+y)^2\le4$, $(x-y)^2\le4$, cộng lại: $2x^2+2y^2\le8$, tức $x^2+y^2\le4$.

$M=\dfrac{8}{3}x^2+y^2=\dfrac{8}{3}(x^2+y^2)-\dfrac{5}{3}y^2\le\dfrac{8}{3}(x^2+y^2)\le\dfrac{8}{3}\cdot4=\dfrac{32}{3}$.

Dấu "=" xảy ra khi $y=0$ và $x^2=4$, tức $x=\pm2$.

Với $x=2$, $y=0$: hai điều kiện đầu thành $\lvert2+z\rvert\le1$ nên $z\le-1$, kết hợp $\lvert z\rvert\le1$ được $z=-1$. Tương tự $x=-2$, $y=0$ thì $z=1$.

Vậy giá trị lớn nhất của $M$ là $\dfrac{32}{3}$, đạt khi $(x;y;z)=(2;0;-1)$ hoặc $(-2;0;1)$.

=== PA.22a@p240
- bai: 22 · y: a · trang: 240 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040101
- cong_cu: $(a^n-b^n)\vdots(a-b)$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "16^{n-2}+…" ở dòng thứ ba (đúng là 16^{n-1}); không ảnh hưởng.
## DE
Cho $n\in\mathbb N$. Chứng minh rằng $16^n-15n-1$ chia hết cho $225$.
## SACH
Vận dụng $(a^n-b^n)\vdots(a-b)$
$16^n-15n-1=(16^n-1^n)-15n$
$=(16-1)(16^{n-1}+16^{n-2}+\dots+16+1)-15n$
$=15(16^{n-2}+\dots+16+1-n)$
$=15\left[(16^{n-1}-1^{n-1})+(16^{n-2}-1^{n-2})+\dots+(16-1)\right]\vdots225$
Vì $16^t-1^t\vdots16-1$ hay $(16^t-1^t)\vdots15$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tách $16^n-1$ để đặt được thừa số $16-1=15$, còn lại $-15n$ cũng chia hết cho $15$; sau khi đặt $15$ ra ngoài, ngoặc là tổng $n$ số hạng dạng $16^k-1$, mỗi số lại chia hết cho $15$.

**Bước 1.** Viết biểu thức thành $(16^n-1)-15n$ rồi dùng $a^n-b^n$ chia hết cho $a-b$ với $a=16$ và $b=1$ để khai triển $16^n-1$ thành tích có thừa số $15$.

**Bước 2.** Đặt $15$ làm nhân tử chung cho cả hai hạng tử, phần còn lại trong ngoặc là một tổng $n$ số hạng trừ đi $n$.

**Bước 3.** Trừ đi $1$ ở mỗi số hạng để ngoặc thành tổng các hiệu $16^k-1$, rồi chứng tỏ từng hiệu chia hết cho $15$.

**Bước 4.** Kết luận biểu thức là tích của hai số cùng chia hết cho $15$ nên chia hết cho $225$; xét riêng $n=0$ vì khai triển cần $n\ge1$.

**Chú ý:** Xét riêng $n=0$ (biểu thức bằng $0$) để không bỏ sót; $0$ chia hết cho mọi số.

**Phần 2. Trình bày**

Với $n=0$: $16^0-15\cdot0-1=0\vdots225$.

Với $n\ge1$: $16^n-15n-1=(16^n-1)-15n$

$=(16-1)(16^{n-1}+16^{n-2}+\dots+16+1)-15n$

$=15(16^{n-1}+16^{n-2}+\dots+16+1-n)$

$=15\left[(16^{n-1}-1)+(16^{n-2}-1)+\dots+(16-1)+(1-1)\right]$ (ngoặc có $n$ số hạng, mỗi số hạng trừ đi $1$).

Với mỗi $k\ge0$: $(16^k-1)\vdots(16-1)$, tức $(16^k-1)\vdots15$. Do đó tổng trong ngoặc vuông chia hết cho $15$.

Vậy $16^n-15n-1$ chia hết cho $15\cdot15=225$.

=== PA.22b@p240
- bai: 22 · y: b · trang: 240 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T040101
- cong_cu: $(a^n-b^n)\vdots(a-b)$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng cuối sách in "(4^{n-1}-1^{n-1})+(4^{n-1}-1^{n-2})+…" — lặp số mũ n-1, đúng là 4^{n-2}-1^{n-2}; không ảnh hưởng.
## DE
Cho $n\in\mathbb N$. Chứng minh rằng $4^n+15n-10$ chia hết cho $9$.
## SACH
Vận dụng $(a^n-b^n)\vdots(a-b)$
$4^n+15n-10=(4^n-1^n)-3n+18n-9$
$=(4-1)(4^{n-1}+4^{n-2}+\dots+4+1)-3n+9(2n-1)$
$=3(4^{n-1}+4^{n-2}+\dots+4+1-n)+9(2n-1)$
$=3\left[(4^{n-1}-1^{n-1})+(4^{n-2}-1^{n-2})+\dots+(4-1)\right]+9(2n-1)$ chia hết cho $9$.
Vì $(4^t-1^t)\vdots(4-1)$ hay $(4^t-1^t)\vdots3$
Do đó $3\left[(4^{n-1}-1^{n-1})+(4^{n-1}-1^{n-2})+\dots+(4-1)\right]\vdots9$; $9(2n-1)\vdots9$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $15n-10=18n-9-3n$ để tách một phần chia hết cho $9$ và một phần $(4^n-1)-3n$ có thừa số $3$ ngoài cùng, trong ngoặc là tổng các hiệu $4^k-1$ mỗi số chia hết cho $3$.

**Bước 1.** Tách $15n-10$ thành $-3n+(18n-9)$ để $-3n$ đi cùng $4^n-1$ còn $18n-9$ là bội của $9$.

**Bước 2.** Khai triển $4^n-1$ bằng $a^n-b^n$ chia hết cho $a-b$ với $a=4$ và $b=1$ rồi đặt $3$ ra ngoài cùng với $-3n$.

**Bước 3.** Trừ $1$ ở mỗi số hạng trong ngoặc để thành tổng các hiệu $4^k-1$, mỗi hiệu chia hết cho $3$.

**Bước 4.** Kết luận hai nhóm hạng tử cùng chia hết cho $9$, xét riêng trường hợp $n=0$.

**Chú ý:** Xét riêng $n=0$ vì phép khai triển tổng $n$ số hạng cần $n\ge1$; với $n=0$ biểu thức bằng $-9$ vẫn chia hết cho $9$.

**Phần 2. Trình bày**

Với $n=0$: $4^0+15\cdot0-10=-9\vdots9$.

Với $n\ge1$: $4^n+15n-10=(4^n-1)-3n+(18n-9)$

$=(4-1)(4^{n-1}+4^{n-2}+\dots+4+1)-3n+9(2n-1)$

$=3(4^{n-1}+4^{n-2}+\dots+4+1-n)+9(2n-1)$

$=3\left[(4^{n-1}-1)+(4^{n-2}-1)+\dots+(4-1)+(1-1)\right]+9(2n-1)$ (ngoặc có $n$ số hạng, mỗi số hạng trừ đi $1$).

Với mỗi $k\ge0$: $(4^k-1)\vdots(4-1)$, tức $(4^k-1)\vdots3$, nên tổng trong ngoặc vuông chia hết cho $3$; do đó $3\left[\dots\right]\vdots9$.

Mà $9(2n-1)\vdots9$.

Vậy $4^n+15n-10$ chia hết cho $9$.
