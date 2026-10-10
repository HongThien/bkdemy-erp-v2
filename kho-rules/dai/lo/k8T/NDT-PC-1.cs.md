=== C1.1c@p271
- bai: 1 · y: c · trang: 271 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010202
- cong_cu: thêm bớt hạng tử · nhân tử $x^2+x+1$
- kiem: bang | x^7+x^2+1
- ket_qua_sach: (x^2+x+1)(x^5-x^4+x^2-x+1)
- dap_an: $(x^2+x+1)(x^5-x^4+x^2-x+1)$
- ghi_chu_nghi:
## DE
Phân tích đa thức sau thành nhân tử: $x^7+x^2+1$.
## SACH
$x^7+x^2+1=(x^7+x^6+x^5)-(x^6+x^5+x^4)+(x^4+x^3+x^2)-(x^3+x^2+x)+(x^2+x+1)$
$=x^5(x^2+x+1)-x^4(x^2+x+1)+x^2(x^2+x+1)-x(x^2+x+1)+1(x^2+x+1)$
$=(x^2+x+1)(x^5-x^4+x^2-x+1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các số mũ $7,2,0$ chia cho $3$ dư $1,2,0$ — cùng dạng với $x+x^2+1$ — nên đa thức có nhân tử $x^2+x+1$ (vì $x^3-1$ chia hết cho $x^2+x+1$), ta thêm bớt các hạng tử để nhân tử đó lộ ra.

**Bước 1.** Thêm bớt $x^6,x^5,x^4,x^3,x$ sao cho đa thức tách thành năm nhóm, mỗi nhóm gồm ba hạng tử liên tiếp có dạng $x^k+x^{k-1}+x^{k-2}$.

**Bước 2.** Đặt nhân tử chung $x^k$ (kèm dấu) trong từng nhóm để mỗi nhóm trở thành tích của một luỹ thừa của $x$ với $x^2+x+1$.

**Bước 3.** Đặt $x^2+x+1$ làm nhân tử chung cho cả năm nhóm rồi thu gọn thừa số còn lại.

**Chú ý:** Có thể làm gọn hơn: $x^7+x^2+1=(x^7-x)+(x^2+x+1)=x(x^3-1)(x^3+1)+(x^2+x+1)$ rồi đặt $x^2+x+1$ ra ngoài — dấu hiệu "luỹ thừa có số mũ lệch nhau $3$" thường cho nhân tử $x^2+x+1$.

**Phần 2. Trình bày**

$x^7+x^2+1=(x^7+x^6+x^5)-(x^6+x^5+x^4)+(x^4+x^3+x^2)-(x^3+x^2+x)+(x^2+x+1)$

$=x^5(x^2+x+1)-x^4(x^2+x+1)+x^2(x^2+x+1)-x(x^2+x+1)+(x^2+x+1)$

$=(x^2+x+1)(x^5-x^4+x^2-x+1)$

=== C1.2b@p271
- bai: 2 · y: b · trang: 271 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: đưa về tổng các bình phương bằng $0$
- kiem: khong
- ket_qua_sach: x=-2; y=2; z=2
- dap_an: $(x;y;z)=(-2;2;2)$
- ghi_chu_nghi: Đề sách in vế phải kết thúc bằng "-4x - y" (chữ y), nhưng dòng đầu lời giải của chính sách viết "-4x - 4" và giải ra duy nhất (x;y;z)=(-2;2;2), thử lại đúng (vế trái = vế phải = 20). Với "-4x - y" phương trình chỉ còn một hệ thức ba ẩn, có vô số nghiệm thực, không có đáp số duy nhất. Kho ghi đề theo "-4x-4" (khớp lời giải sách). Ngoài ra dòng áp chót lời giải sách in "x - y = x + 2 = y - z = 0" (in nhầm, phải là x + y).
## DE
Tìm $x,y,z$ biết: $2(x^2+y^2)+z^2=-2xy+2yz-4x-4$.
## SACH
$2(x^2+y^2)+z^2=-2xy+2yz-4x-4$
$\Leftrightarrow2x^2+2y^2+z^2+2xy-2yz+4x+4=0$
$\Leftrightarrow(x^2+2xy+y^2)+(x^2+4x+4)+(y^2-2yz+z^2)=0$
$\Leftrightarrow(x+y)^2+(x+2)^2+(y-z)^2=0$
$\Leftrightarrow(x+y)^2=(x+2)^2=(y-z)^2=0$
$\Leftrightarrow x-y=x+2=y-z=0$
$\Leftrightarrow x=-2,y=2,z=2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Một phương trình ba ẩn chỉ giải được khi đưa về "tổng các bình phương bằng $0$"; dấu hiệu là các hạng tử bậc hai $2x^2,2y^2,z^2$ cùng các tích $2xy,-2yz$ và cặp $4x+4$ gợi ra $(x+y)^2$, $(y-z)^2$, $(x+2)^2$.

**Bước 1.** Chuyển mọi hạng tử về vế trái để vế phải bằng $0$ và sắp xếp lại các hạng tử.

**Bước 2.** Tách $2x^2=x^2+x^2$ và $2y^2=y^2+y^2$ rồi ghép các hạng tử thành ba nhóm là ba hằng đẳng thức bình phương của một tổng hoặc một hiệu.

**Bước 3.** Vì tổng ba bình phương bằng $0$ nên từng bình phương phải bằng $0$; giải ba phương trình bậc nhất thu được để tìm $x,y,z$.

**Chú ý:** Chỉ được kết luận "mỗi bình phương bằng $0$" khi vế còn lại đúng bằng $0$; nhớ kiểm tra lại bằng cách khai triển ba bình phương để chắc không sót hạng tử nào.

**Phần 2. Trình bày**

$2(x^2+y^2)+z^2=-2xy+2yz-4x-4$

$\Leftrightarrow2x^2+2y^2+z^2+2xy-2yz+4x+4=0$

$\Leftrightarrow(x^2+2xy+y^2)+(x^2+4x+4)+(y^2-2yz+z^2)=0$

$\Leftrightarrow(x+y)^2+(x+2)^2+(y-z)^2=0$

Vì ba bình phương đều không âm nên $x+y=0$, $x+2=0$, $y-z=0$, tức là $x=-2$, $y=2$, $z=2$.

Vậy $(x;y;z)=(-2;2;2)$.

=== C1.3b@p271
- bai: 3 · y: b · trang: 271 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030203
- cong_cu: Bu-nhi-a-cốp-xki · $ab\le\dfrac{a^2+b^2}{2}$
- kiem: khong
- ket_qua_sach: max M=2; min M=-2
- dap_an: $\max M=2;\ \min M=-2$
- ghi_chu_nghi:
## DE
Cho $a,b,c$ thỏa mãn $a^2+b^2+c^2=2$. Tìm giá trị lớn nhất, giá trị nhỏ nhất của biểu thức $M=a+b+c-abc$.
## SACH
Ta có $ab\le\dfrac{a^2+b^2}{2}\le\dfrac{a^2+b^2+c^2}{2}=1$. Nên $ab-1\le0$
Do đó $M^2=[(a+b)\cdot1+c(1-ab)]^2\le[(a+b)^2+c^2][1^2+(1-ab)^2]$
$=(a^2+2ab+b^2+c^2)(1+1-2ab+a^2b^2)$
$=(2ab+2)(a^2b^2-2ab+2)$
$=2a^3b^3-4a^2b^2+4ab+2a^2b^2-4ab+4$
$=2a^3b^3-2a^2b^2+4$
$=2a^2b^2(ab-1)+4\le4$ (vì $a^2b^2\ge0$, $ab-1\le0$)
Suy ra $-2\le M\le2$
- $M\le2$. Dấu "=" có thể xảy ra khi $a=b=1$, $c=0$
- $M\ge-2$. Dấu "=" có thể xảy ra khi $a=b=-1$, $c=0$

Vậy giá trị lớn nhất của biểu thức $M$ là $2$ giá trị nhỏ nhất của biểu thức $M$ là $-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $M=(a+b)\cdot1+c(1-ab)$ rồi dùng Bu-nhi-a-cốp-xki để chặn $M^2$; điều kiện $a^2+b^2+c^2=2$ làm thừa số thứ nhất rút gọn được thành $2+2ab$, và tích hai thừa số khai triển ra dạng dễ so sánh với $4$.

**Bước 1.** Từ $a^2+b^2+c^2=2$ chứng tỏ $ab\le1$, để biết trước dấu của $ab-1$ dùng ở bước sau.

**Bước 2.** Viết $M$ thành tổng của hai tích rồi áp dụng bất đẳng thức Bu-nhi-a-cốp-xki để chặn $M^2$ bằng tích của hai tổng bình phương, thay $(a+b)^2+c^2=2+2ab$.

**Bước 3.** Khai triển tích thành $2a^2b^2(ab-1)+4$, dùng $ab-1\le0$ để suy ra $M^2\le4$ và do đó $-2\le M\le2$.

**Bước 4.** Tìm bộ $(a;b;c)$ thỏa điều kiện làm $M$ đạt từng giá trị biên để khẳng định đó là giá trị lớn nhất, nhỏ nhất.

**Chú ý:** Chặn $M^2\le4$ mới cho cả hai biên cùng lúc; đừng quên chỉ ra dấu "=" xảy ra thật, nếu không mới chỉ chứng minh được cận chứ chưa phải cực trị.

**Phần 2. Trình bày**

Ta có $ab\le\dfrac{a^2+b^2}{2}\le\dfrac{a^2+b^2+c^2}{2}=1$ nên $ab-1\le0$.

Theo bất đẳng thức Bu-nhi-a-cốp-xki: $M^2=\left[(a+b)\cdot1+c(1-ab)\right]^2\le\left[(a+b)^2+c^2\right]\left[1^2+(1-ab)^2\right]$

$=(a^2+b^2+c^2+2ab)(2-2ab+a^2b^2)$

$=(2ab+2)(a^2b^2-2ab+2)$

$=2a^3b^3-2a^2b^2+4$

$=2a^2b^2(ab-1)+4\le4$ (vì $a^2b^2\ge0$ và $ab-1\le0$).

Suy ra $-2\le M\le2$.

Với $a=b=1$, $c=0$ (thỏa $a^2+b^2+c^2=2$) ta có $M=2$; với $a=b=-1$, $c=0$ ta có $M=-2$.

Vậy giá trị lớn nhất của $M$ là $2$, giá trị nhỏ nhất của $M$ là $-2$.

=== C1.6b@p271
- bai: 6 · y: b · trang: 271 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T050101
- cong_cu: nguyên lí Đi-rích-lê · đếm số đội đã gặp
- kiem: khong
- ket_qua_sach: i) chứng minh; ii) không còn đúng
- dap_an: i) Chứng minh; ii) Không còn đúng
- ghi_chu_nghi: Đề sách in "có 12 đợt tham dự" (in nhầm của "12 đội", đúng theo lời giải sách); kho ghi "12 đội". Sách đánh dấu ý bằng "i)", "ii)" (lời giải in "i.", "ii."). Hai ý nối nhau ("khẳng định trên") nên giữ thành một câu.
## DE
Trong một giải bóng đá có $12$ đội tham dự, thi đấu vòng tròn một lượt (hai đội bất kì thi đấu với nhau đúng một trận).

i) Chứng minh rằng sau $4$ vòng đấu (mỗi đội đấu đúng $4$ trận) luôn tìm được ba đội bóng đôi một chưa thi đấu với nhau.

ii) Khẳng định trên còn đúng không, nếu mỗi đội đã thi đấu đúng $5$ trận?
## SACH
i. Có $12$ đội, mỗi đội thi đấu đúng $4$ trận nên tìm được hai đội chưa thi đấu với nhau. Gọi hai đội đó là $A$ và $B$.
$A$, $B$ mỗi đội thi đấu đúng $4$ trận, do vậy trong $10$ đội còn lại có ít nhất $2$ đội chưa thi đấu với cả $A$ và $B$. Gọi một trong hai đội đó là $C$.
$A$, $B$, $C$ là ba đội bóng đôi một chưa thi đấu với nhau.
ii. Khẳng định trên không còn đúng nếu mỗi đội đã thi đấu đúng $5$ trận.
- Chẳng hạn: Chúng ta chia $12$ đội thành hai nhóm, mỗi nhóm $6$ đội, các đội trong mỗi nhóm đôi một đã thi đấu với nhau. Như vậy $12$ đội bóng này, mỗi đội đã thi đấu đúng $5$ trận.
Xét ba đội bóng tùy ý, luôn có $2$ đội bóng ở cùng một nhóm. Như vậy $3$ đội bóng bất kì, có ít nhất $2$ đội đã thi đấu với nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi đội chỉ mới gặp ít đối thủ nên chắc chắn còn đội chưa gặp; chọn hai đội chưa gặp nhau rồi đếm số đội mà một trong hai đã gặp để chứng tỏ còn đội thứ ba chưa gặp cả hai (ý i); với ý ii chỉ cần dựng một ví dụ cụ thể làm khẳng định sai.

**Bước 1.** Mỗi đội mới đấu $4$ trận trong khi có $11$ đội khác, nên tồn tại hai đội chưa đấu với nhau; gọi là $A$ và $B$.

**Bước 2.** Đếm trong $10$ đội còn lại số đội đã gặp $A$ hoặc gặp $B$; số này không vượt quá tổng số trận của hai đội, từ đó suy ra còn ít nhất hai đội chưa gặp cả $A$ lẫn $B$ và chọn một đội $C$ trong đó.

**Bước 3.** Với ý ii, dựng cách tổ chức mà mỗi đội đấu đúng $5$ trận: chia $12$ đội thành hai nhóm $6$ đội và cho các đội cùng nhóm đấu với nhau.

**Bước 4.** Dùng nguyên lí Đi-rích-lê cho ba đội bất kì và hai nhóm để thấy luôn có hai đội đã gặp nhau, tức khẳng định ở ý i không còn đúng.

**Chú ý:** Vì $A$ và $B$ chưa gặp nhau nên danh sách đối thủ của $A$ hay của $B$ không chứa đội còn lại, mọi phép đếm chỉ diễn ra trong $10$ đội kia; ý ii chỉ cần một phản ví dụ.

**Phần 2. Trình bày**

i) Mỗi đội mới thi đấu $4$ trận trong khi có $11$ đội khác, nên tồn tại hai đội chưa thi đấu với nhau; gọi hai đội đó là $A$ và $B$.

Mỗi đội $A$, $B$ đã đấu đúng $4$ trận và hai đội này chưa gặp nhau, nên trong $10$ đội còn lại có nhiều nhất $4+4=8$ đội đã gặp $A$ hoặc $B$. Do đó có ít nhất $2$ đội chưa thi đấu với cả $A$ lẫn $B$; gọi một trong hai đội đó là $C$.

Vậy $A$, $B$, $C$ là ba đội đôi một chưa thi đấu với nhau.

ii) Khẳng định không còn đúng. Thật vậy, chia $12$ đội thành hai nhóm, mỗi nhóm $6$ đội, và cho mỗi đội đấu với $5$ đội cùng nhóm; khi đó mỗi đội đã đấu đúng $5$ trận.

Với ba đội bất kì, theo nguyên lí Đi-rích-lê có hai đội thuộc cùng một nhóm, và hai đội đó đã đấu với nhau. Vậy không tồn tại ba đội đôi một chưa thi đấu với nhau.

=== C2.1a@p276
- bai: 1 · y: a · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020101
- cong_cu: cộng cùng một số vào hai vế để tử đồng nhất · đặt nhân tử chung
- kiem: nghiem | \dfrac{2-x}{2013}-1 = \dfrac{1-x}{2014}-\dfrac{x}{2015} | x
- ket_qua_sach: 2015
- dap_an: $S=\{2015\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $\dfrac{2-x}{2013}-1=\dfrac{1-x}{2014}-\dfrac{x}{2015}$.
## SACH
$\dfrac{2-x}{2013}-1=\dfrac{1-x}{2014}-\dfrac{x}{2015}\Leftrightarrow\dfrac{2-x}{2013}+1=\dfrac{1-x}{2014}+1+1+\dfrac{-x}{2015}$
$\Leftrightarrow\dfrac{2015-x}{2013}=\dfrac{2015-x}{2014}+\dfrac{2015-x}{2015}$
$\Leftrightarrow(2015-x)\left(\dfrac{1}{2013}-\dfrac{1}{2014}-\dfrac{1}{2015}\right)=0$
$\Leftrightarrow x=2015$ vì $\left(\dfrac{1}{2013}-\dfrac{1}{2014}-\dfrac{1}{2015}\right)\ne0$

Vậy tập nghiệm của phương trình là $S=\{2015\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $2013,2014,2015$ chỉ hơn kém nhau $1$ đơn vị còn tử đều là nhị thức bậc nhất; cộng thêm hằng số thích hợp vào từng phân thức làm cả ba tử cùng trở thành $2015-x$, khi đó đặt được nhân tử chung.

**Bước 1.** Cộng $2$ vào hai vế và tách $2=1+1$ ở vế phải để mỗi phân thức được cộng đúng một đơn vị, nhờ vậy tử của cả ba phân thức đều thành $2015-x$.

**Bước 2.** Chuyển các phân thức về cùng một vế rồi đặt $2015-x$ làm nhân tử chung.

**Bước 3.** Chứng tỏ thừa số còn lại khác $0$ bằng cách so sánh hai phân số có tử bằng $1$, từ đó chỉ còn một nghiệm.

**Chú ý:** Đừng quy đồng khử mẫu ngay — số quá lớn và làm mất cấu trúc; thấy tử là nhị thức cùng hệ số của $x$ thì nghĩ tới việc cộng bớt hằng số để tử trùng nhau.

**Phần 2. Trình bày**

Cộng $2$ vào hai vế (ở vế phải viết $2=1+1$):

$\dfrac{2-x}{2013}-1=\dfrac{1-x}{2014}-\dfrac{x}{2015}\Leftrightarrow\dfrac{2-x}{2013}+1=\left(\dfrac{1-x}{2014}+1\right)+\left(\dfrac{-x}{2015}+1\right)$

$\Leftrightarrow\dfrac{2015-x}{2013}=\dfrac{2015-x}{2014}+\dfrac{2015-x}{2015}$

$\Leftrightarrow(2015-x)\left(\dfrac{1}{2013}-\dfrac{1}{2014}-\dfrac{1}{2015}\right)=0$

Vì $\dfrac{1}{2013}-\dfrac{1}{2014}=\dfrac{1}{2013\cdot2014}<\dfrac{1}{2015}$ nên $\dfrac{1}{2013}-\dfrac{1}{2014}-\dfrac{1}{2015}\ne0$.

Do đó $2015-x=0$, tức $x=2015$.

Vậy $S=\{2015\}$.

=== C2.1b@p276
- bai: 1 · y: b · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020101
- cong_cu: phân tích mẫu thành nhân tử · tách phân thức thành hiệu để khử liên tiếp
- kiem: nghiem | \dfrac{1}{x^2+9x+20}+\dfrac{1}{x^2+11x+30}+\dfrac{1}{x^2+13x+42} = \dfrac{1}{18} | x
- ket_qua_sach: -13; 2
- dap_an: $S=\{-13;2\}$
- ghi_chu_nghi: Dòng "⇔ … ⇔ x^2+11x-26=0" của sách bỏ qua bước quy đồng; lời giải kho viết đủ.
## DE
Giải phương trình: $\dfrac{1}{x^2+9x+20}+\dfrac{1}{x^2+11x+30}+\dfrac{1}{x^2+13x+42}=\dfrac{1}{18}$.
## SACH
Phương trình đã cho tương đương với:
$\dfrac{1}{x^2+9x+20}+\dfrac{1}{x^2+11x+30}+\dfrac{1}{x^2+13x+42}=\dfrac{1}{18}$ (1)
ĐKXĐ: $x\ne-4$; $x\ne-5$; $x\ne-6$; $x\ne-7$.
$(1)\Leftrightarrow\dfrac{1}{x+4}-\dfrac{1}{x+5}+\dfrac{1}{x+5}-\dfrac{1}{x+6}+\dfrac{1}{x+6}-\dfrac{1}{x+7}=\dfrac{1}{18}$
$\Leftrightarrow\dfrac{1}{x+4}-\dfrac{1}{x+7}=\dfrac{1}{18}\Leftrightarrow\dots\Leftrightarrow x^2+11x-26=0$
$\Leftrightarrow(x+13)(x-2)=0$
$\Leftrightarrow x=-13$ hoặc $x=2$ (thỏa ĐKXĐ)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba tam thức ở mẫu đều phân tích được thành tích hai nhị thức liên tiếp $(x+4)(x+5)$, $(x+5)(x+6)$, $(x+6)(x+7)$, nên mỗi phân thức tách được thành hiệu hai phân thức đơn giản và tổng ba phân thức khử liên tiếp gần hết.

**Bước 1.** Phân tích ba mẫu thành nhân tử và nêu điều kiện xác định để các phân thức có nghĩa.

**Bước 2.** Tách mỗi phân thức theo $\dfrac{1}{(x+k)(x+k+1)}=\dfrac{1}{x+k}-\dfrac{1}{x+k+1}$ rồi cộng lại, các số hạng ở giữa triệt tiêu nhau.

**Bước 3.** Quy đồng phương trình còn hai phân thức để đưa về phương trình bậc hai và phân tích vế trái thành tích.

**Bước 4.** Giải từng nhân tử bằng $0$ rồi đối chiếu nghiệm với điều kiện xác định.

**Chú ý:** Không quy đồng cả ba phân thức một lượt (bậc sáu, rất cồng kềnh); khi mẫu là tích hai nhị thức hơn kém nhau $1$ đơn vị thì luôn nghĩ tới tách thành hiệu.

**Phần 2. Trình bày**

ĐKXĐ: $x\ne-4$; $x\ne-5$; $x\ne-6$; $x\ne-7$.

Vì $x^2+9x+20=(x+4)(x+5)$, $x^2+11x+30=(x+5)(x+6)$, $x^2+13x+42=(x+6)(x+7)$ nên phương trình tương đương

$\dfrac{1}{x+4}-\dfrac{1}{x+5}+\dfrac{1}{x+5}-\dfrac{1}{x+6}+\dfrac{1}{x+6}-\dfrac{1}{x+7}=\dfrac{1}{18}$

$\Leftrightarrow\dfrac{1}{x+4}-\dfrac{1}{x+7}=\dfrac{1}{18}$

$\Leftrightarrow\dfrac{3}{(x+4)(x+7)}=\dfrac{1}{18}$

$\Leftrightarrow(x+4)(x+7)=54$

$\Leftrightarrow x^2+11x-26=0$

$\Leftrightarrow(x+13)(x-2)=0$

$\Leftrightarrow x=-13$ hoặc $x=2$ (thỏa ĐKXĐ).

Vậy $S=\{-13;2\}$.

=== C2.1c@p276
- bai: 1 · y: c · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020102
- cong_cu: $a^3+b^3=(a+b)^3-3ab(a+b)$ · đặt ẩn phụ · nhân tử chung
- kiem: nghiem | (x-1)^3+(2x+3)^3 = 27x^3+8 | x
- ket_qua_sach: -\dfrac{2}{3}; -\dfrac{1}{2}; 3
- dap_an: $S=\left\{-\dfrac{2}{3};-\dfrac{1}{2};3\right\}$
- ghi_chu_nghi:
## DE
Giải phương trình: $(x-1)^3+(2x+3)^3=27x^3+8$.
## SACH
Đặt $a=x-1$; $b=2x+3\Rightarrow a+b=3x+2$
$\Rightarrow a^3+b^3=(a+b)^3-3ab(a+b)$
$=(3x+2)^3-3(x-1)(2x+3)(3x+2)$
Ta có: $27x^3+8=(3x+2)^3-18x(3x+2)$
Phương trình $\Leftrightarrow(3x+2)^3-3(x-1)(2x+3)(3x+2)=(3x+2)^3-18x(3x+2)$
$\Leftrightarrow(3x+2)(2x^2+x-3-6x)=0$
$\Leftrightarrow(3x+2)(2x^2-5x-3)=0\Leftrightarrow(3x+2)(x-3)(2x+1)=0$
$\Leftrightarrow x=-\dfrac{2}{3}$ hoặc $x=3$ hoặc $x=-\dfrac{1}{2}$.

Vậy tập nghiệm của phương trình là $S=\left\{-\dfrac{2}{3};-\dfrac{1}{2};3\right\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là tổng hai lập phương có tổng hai cơ số $(x-1)+(2x+3)=3x+2$, và vế phải $27x^3+8=(3x)^3+2^3$ cũng là tổng hai lập phương có tổng cơ số $3x+2$; viết cả hai vế theo $a^3+b^3=(a+b)^3-3ab(a+b)$ thì $(3x+2)^3$ triệt tiêu và còn nhân tử chung $3x+2$.

**Bước 1.** Đặt $a=x-1$, $b=2x+3$ rồi viết vế trái theo $(a+b)^3-3ab(a+b)$ với $a+b=3x+2$.

**Bước 2.** Viết vế phải $(3x)^3+2^3$ theo cùng hằng đẳng thức với hai cơ số $3x$ và $2$, cũng có tổng $3x+2$.

**Bước 3.** Chuyển vế để hai số hạng $(3x+2)^3$ triệt tiêu, rồi đặt $3x+2$ làm nhân tử chung.

**Bước 4.** Phân tích tam thức bậc hai còn lại thành tích và giải ba phương trình bậc nhất.

**Chú ý:** Đừng khai triển cả hai lập phương rồi thu gọn thành phương trình bậc ba tổng quát — mất công và khó nhẩm nghiệm; hãy nhìn tổng hai cơ số để nhận ra nhân tử chung.

**Phần 2. Trình bày**

Đặt $a=x-1$, $b=2x+3$ thì $a+b=3x+2$ và

$(x-1)^3+(2x+3)^3=(a+b)^3-3ab(a+b)=(3x+2)^3-3(x-1)(2x+3)(3x+2)$.

Mặt khác $27x^3+8=(3x)^3+2^3=(3x+2)^3-3\cdot3x\cdot2\cdot(3x+2)=(3x+2)^3-18x(3x+2)$.

Phương trình tương đương $(3x+2)^3-3(x-1)(2x+3)(3x+2)=(3x+2)^3-18x(3x+2)$

$\Leftrightarrow(3x+2)\left[(x-1)(2x+3)-6x\right]=0$

$\Leftrightarrow(3x+2)(2x^2-5x-3)=0$

$\Leftrightarrow(3x+2)(x-3)(2x+1)=0$

$\Leftrightarrow x=-\dfrac{2}{3}$ hoặc $x=3$ hoặc $x=-\dfrac{1}{2}$.

Vậy $S=\left\{-\dfrac{2}{3};-\dfrac{1}{2};3\right\}$.

=== C2.2a@p276
- bai: 2 · y: a · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: đưa về tổng các bình phương bằng $0$
- kiem: khong
- ket_qua_sach: 2
- dap_an: $2$
- ghi_chu_nghi: Đề không nêu $a,b\ne0$ nhưng cần để các phân thức có nghĩa (lời giải sách dùng "a và b khác 0").
## DE
Cho $a,b$ thỏa mãn $\dfrac{a}{b}+\dfrac{b}{a}=\dfrac{a^2}{b}+\dfrac{b^2}{a}=\dfrac{a^3}{b}+\dfrac{b^3}{a}$. Tính giá trị của biểu thức $M=\dfrac{a^9}{b}+\dfrac{b^9}{a}$.
## SACH
$\dfrac{a}{b}+\dfrac{b}{a}=\dfrac{a^2}{b}+\dfrac{b^2}{a}=\dfrac{a^3}{b}+\dfrac{b^3}{a}$
$\Rightarrow a^2+b^2=a^3+b^3=a^4+b^4$, $a$ và $b$ khác $0$
Ta có $a^4+b^4-2(a^3+b^3)+a^2+b^2=0$
$\Rightarrow(a^4-2a^3+a^2)+(b^4-2b^3+b^2)=0$
$\Rightarrow a^2(a-1)^2+b^2(b-1)^2=0$
$\Rightarrow a^2(a-1)^2=b^2(b-1)^2=0$
Mà $a,b$ khác $0$. Do đó $a=b=1$
Vậy $M=\dfrac{1^9}{1}+\dfrac{1^9}{1}=2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Quy đồng thì ba biểu thức đều có mẫu $ab$ và tử là $a^2+b^2$, $a^3+b^3$, $a^4+b^4$, nên ba tổng đó bằng nhau; ghép chúng thành $a^4+b^4-2(a^3+b^3)+(a^2+b^2)=0$ thì nhóm được thành hai bình phương, buộc $a=b=1$.

**Bước 1.** Quy đồng từng biểu thức trong giả thiết (mẫu chung $ab$ với $a,b\ne0$) để suy ra $a^2+b^2=a^3+b^3=a^4+b^4$.

**Bước 2.** Vì ba tổng bằng nhau nên tổ hợp $a^4+b^4-2(a^3+b^3)+a^2+b^2$ bằng $0$; nhóm các hạng tử theo $a$ và theo $b$.

**Bước 3.** Mỗi nhóm là một bình phương nên hai bình phương cùng bằng $0$; kết hợp với $a,b\ne0$ để tìm $a$ và $b$.

**Bước 4.** Thay giá trị tìm được vào biểu thức $M$.

**Chú ý:** Phải dùng $a,b\ne0$ (đã có từ mẫu số) để loại nghiệm $a=0$, $b=0$ của $a^2(a-1)^2=0$ và $b^2(b-1)^2=0$.

**Phần 2. Trình bày**

Vì $a,b\ne0$ nên nhân ba biểu thức của giả thiết với $ab$ ta được $a^2+b^2=a^3+b^3=a^4+b^4$.

Do đó $a^4+b^4-2(a^3+b^3)+(a^2+b^2)=0$ (nếu đặt giá trị chung là $t$ thì $t-2t+t=0$)

$\Leftrightarrow(a^4-2a^3+a^2)+(b^4-2b^3+b^2)=0$

$\Leftrightarrow a^2(a-1)^2+b^2(b-1)^2=0$.

Hai số hạng đều không âm nên $a^2(a-1)^2=b^2(b-1)^2=0$; mà $a,b\ne0$ nên $a=b=1$.

Vậy $M=\dfrac{1^9}{1}+\dfrac{1^9}{1}=2$.

=== C2.2b@p276
- bai: 2 · y: b · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: tách phân thức thành hiệu để khử liên tiếp
- kiem: khong
- ket_qua_sach: 504+\dfrac{504}{4033}
- dap_an: $504+\dfrac{504}{4033}=\dfrac{2033136}{4033}$
- ghi_chu_nghi: Đề sách in "Tính tổng S^2 = …" nhưng lời giải tính S ("Do đó S = …"); kho ghi đề là "$S=\dots$". Kết quả sách in "504 + 504/4033 = 504.504/4033" (chấm là kí hiệu hỗn số $504\dfrac{504}{4033}$, tức $504+\dfrac{504}{4033}$, không phải phép nhân). Mẫu số in "4031.4033" là $4031\cdot4033$ (dấu chấm = dấu nhân).
## DE
Tính tổng $S=\dfrac{1^2}{1\cdot3}+\dfrac{2^2}{3\cdot5}+\dfrac{3^2}{5\cdot7}+\dots+\dfrac{2016^2}{4031\cdot4033}$.
## SACH
Ta có $\dfrac{n^2}{(2n-1)(2n+1)}=\dfrac{4n^2-1+1}{4(2n-1)(2n+1)}$
$=\dfrac14+\dfrac{1}{4(2n+1)(2n-1)}=\dfrac14+\dfrac18\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$
Do đó $S=\left[\dfrac14+\dfrac18\left(\dfrac11-\dfrac13\right)\right]+\left[\dfrac14+\dfrac18\left(\dfrac13-\dfrac15\right)\right]+\left[\dfrac14+\dfrac18\left(\dfrac15-\dfrac17\right)\right]+\dots+\left[\dfrac14+\dfrac18\left(\dfrac{1}{4031}-\dfrac{1}{4033}\right)\right]$
$=2016\cdot\dfrac14+\dfrac18\left(\dfrac11-\dfrac{1}{4033}\right)$
$=504+\dfrac{504}{4033}=504\dfrac{504}{4033}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số hạng thứ $n$ là $\dfrac{n^2}{(2n-1)(2n+1)}$ có tử và mẫu cùng bậc hai nên tách riêng phần $\dfrac14$; phần còn lại có tử bằng $1$ và mẫu là tích hai số lẻ liên tiếp, tách được thành hiệu để các số hạng khử nhau.

**Bước 1.** Nhận ra số hạng tổng quát $\dfrac{n^2}{(2n-1)(2n+1)}$ và đếm số số hạng: số hạng cuối có $2n-1=4031$ nên $n=2016$.

**Bước 2.** Viết $n^2=\dfrac{(4n^2-1)+1}{4}$ để tách mỗi số hạng thành $\dfrac14$ cộng một phân thức có tử bằng $1$.

**Bước 3.** Tách phân thức còn lại theo $\dfrac{1}{(2n-1)(2n+1)}=\dfrac12\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$.

**Bước 4.** Cộng $2016$ số hạng: phần $\dfrac14$ lặp lại $2016$ lần, phần hiệu khử liên tiếp chỉ còn số hạng đầu và cuối.

**Chú ý:** Nhiều bài tổng có quy luật có tử cùng bậc với mẫu — luôn tách phần nguyên (hằng số) trước rồi mới tách hiệu, nếu không sẽ không khử được.

**Phần 2. Trình bày**

Số hạng thứ $n$ của tổng là $\dfrac{n^2}{(2n-1)(2n+1)}$ ($n=1,2,\dots,2016$ vì $2\cdot2016-1=4031$). Ta có

$\dfrac{n^2}{(2n-1)(2n+1)}=\dfrac{(4n^2-1)+1}{4(2n-1)(2n+1)}=\dfrac14+\dfrac{1}{4(2n-1)(2n+1)}=\dfrac14+\dfrac18\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$.

Do đó $S=2016\cdot\dfrac14+\dfrac18\left(\dfrac11-\dfrac13+\dfrac13-\dfrac15+\dots+\dfrac{1}{4031}-\dfrac{1}{4033}\right)$

$=504+\dfrac18\left(1-\dfrac{1}{4033}\right)$

$=504+\dfrac18\cdot\dfrac{4032}{4033}$

$=504+\dfrac{504}{4033}=\dfrac{2033136}{4033}$.

Vậy $S=504+\dfrac{504}{4033}$.

=== C2.3a@p276
- bai: 3 · y: a · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: xét hiệu · $\dfrac{x}{y}+\dfrac{y}{x}=2+\dfrac{(x-y)^2}{xy}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng cuối lời giải sách in "… $\ge0$" (in nhầm; từ "$=9+\dots$" phải kết luận $\ge9$). Cũng chép đúng như in ở phần SACH.
## DE
Cho $x,y,z>0$. Chứng minh rằng: $(x+y+z)\left(\dfrac1x+\dfrac1y+\dfrac1z\right)\ge9$.
## SACH
$(x+y+z)\left(\dfrac1x+\dfrac1y+\dfrac1z\right)$
$=1+\dfrac xy+\dfrac xz+\dfrac yx+1+\dfrac yz+\dfrac zx+\dfrac zy+1$
$=3+\left(\dfrac xy+\dfrac yx\right)+\left(\dfrac xz+\dfrac zx\right)+\left(\dfrac yz+\dfrac zy\right)$
$=3+\dfrac{x^2+y^2}{xy}+\dfrac{x^2+z^2}{xz}+\dfrac{y^2+z^2}{zy}$
$=3+2+\dfrac{(x-y)^2}{xy}+2+\dfrac{(x-z)^2}{xz}+2+\dfrac{(y-z)^2}{zy}$
$=9+\dfrac{(x-y)^2}{xy}+\dfrac{(x-z)^2}{xz}+\dfrac{(y-z)^2}{zy}\ge0$
Với mọi $x,y,z>0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khai triển tích sẽ có ba số $1$ và ba cặp nghịch đảo $\dfrac uv+\dfrac vu$; mỗi cặp bằng $2+\dfrac{(u-v)^2}{uv}$ nên tích bằng $9$ cộng với tổng các số không âm — đúng kiểu xét hiệu.

**Bước 1.** Nhân từng hạng tử của tổng thứ nhất với từng hạng tử của tổng thứ hai để được ba số $1$ và sáu phân thức.

**Bước 2.** Gom sáu phân thức thành ba cặp nghịch đảo nhau và quy đồng mỗi cặp.

**Bước 3.** Viết $x^2+y^2=(x-y)^2+2xy$ (tương tự cho hai cặp còn lại) để mỗi cặp bằng $2$ cộng một phân thức có tử là bình phương.

**Bước 4.** Nhận xét ba phân thức có tử bình phương, mẫu dương nên không âm, từ đó so sánh tích với $9$.

**Chú ý:** Dấu "=" xảy ra khi $x=y=z$; điều kiện $x,y,z>0$ là cần để các mẫu $xy,xz,yz$ dương, nếu bỏ thì phân thức có thể âm.

**Phần 2. Trình bày**

$(x+y+z)\left(\dfrac1x+\dfrac1y+\dfrac1z\right)=3+\left(\dfrac xy+\dfrac yx\right)+\left(\dfrac xz+\dfrac zx\right)+\left(\dfrac yz+\dfrac zy\right)$

$=3+\dfrac{x^2+y^2}{xy}+\dfrac{x^2+z^2}{xz}+\dfrac{y^2+z^2}{yz}$

$=9+\dfrac{(x-y)^2}{xy}+\dfrac{(x-z)^2}{xz}+\dfrac{(y-z)^2}{yz}$.

Vì $x,y,z>0$ nên ba phân thức cuối đều không âm, suy ra $(x+y+z)\left(\dfrac1x+\dfrac1y+\dfrac1z\right)\ge9$.

Dấu "=" xảy ra khi $x=y=z$.

=== C2.3b@p276
- bai: 3 · y: b · trang: 276 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T030102
- cong_cu: đánh giá từng số hạng bằng xét hiệu · $\dfrac1u+\dfrac1v+\dfrac1w\ge\dfrac{9}{u+v+w}$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách dùng bất đẳng thức $\dfrac{4}{u}+\dfrac{4}{v}+\dfrac{4}{w}\ge\dfrac{4\cdot9}{u+v+w}$ (chính là kết quả ý a) mà không nêu rõ, và bỏ qua việc giải thích $1-2a>0$ (bất đẳng thức tam giác) và phép cộng cuối $36-15=21$; lời giải kho viết đủ và tự chứng minh bất đẳng thức đó nên ý b) tách thành câu riêng. Dòng cuối của sách in "4.9/(-a+b+c-b+a+c-c+a+b)=36" (tổng ba mẫu bằng $a+b+c=1$).
## DE
Cho $a,b,c$ là độ dài các cạnh của một tam giác có chu vi bằng $1$. Chứng minh rằng $\dfrac{1-2a^2}{(1-2a)^2}+\dfrac{1-2b^2}{(1-2b)^2}+\dfrac{1-2c^2}{(1-2c)^2}\ge21$.
## SACH
Ta có: $\dfrac{2(3a-1)^2}{(1-2a)^2}\ge0$
$\Rightarrow\dfrac{1-2a^2}{(1-2a)^2}\ge\dfrac{-20a^2+12a-1}{(1-2a)^2}=\dfrac{10a-1}{1-2a}$
$=\dfrac{4}{1-2a}-5=\dfrac{4}{-a+b+c}-5$
$\dfrac{1-2a^2}{(1-2a)^2}\ge\dfrac{4}{-a+b+c}-5\quad(1)$
Tương tự $\dfrac{1-2b^2}{(1-2b)^2}\ge\dfrac{4}{-b+a+c}-5\quad(2)$
Và $\dfrac{1-2c^2}{(1-2c)^2}\ge\dfrac{4}{-c+a+b}-5\ (3)$
Mặt khác $\dfrac{4}{-a+b+c}+\dfrac{4}{-b+a+c}+\dfrac{4}{-c+a+b}\ge4\cdot\dfrac{9}{-a+b+c-b+a+c-c+a+b}=36\ (4)$
Từ (1), (2), (3), (4) ta có đpcm
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $(1-2a)^2$ gợi đánh giá từng số hạng bằng một biểu thức dạng $\dfrac{4}{1-2a}-5$ (hiệu hai vế bằng $\dfrac{2(3a-1)^2}{(1-2a)^2}\ge0$, đạt dấu "=" ở $a=\dfrac13$); sau khi cộng, còn lại tổng các nghịch đảo $\dfrac1u+\dfrac1v+\dfrac1w$ với $u+v+w=1$ và tổng này luôn $\ge9$.

**Bước 1.** Dùng $a+b+c=1$ để viết $1-2a=b+c-a$ và dùng bất đẳng thức tam giác để chứng tỏ ba số $u=1-2a$, $v=1-2b$, $w=1-2c$ đều dương và có tổng bằng $1$.

**Bước 2.** Xét hiệu giữa $\dfrac{1-2a^2}{(1-2a)^2}$ và $\dfrac{4}{1-2a}-5$ để chứng tỏ số hạng thứ nhất không nhỏ hơn biểu thức đó, rồi viết hai bất đẳng thức tương tự cho $b$ và $c$.

**Bước 3.** Cộng ba bất đẳng thức để đưa vế trái cần chứng minh về không nhỏ hơn $4\left(\dfrac1u+\dfrac1v+\dfrac1w\right)-15$.

**Bước 4.** Chứng minh $\dfrac1u+\dfrac1v+\dfrac1w\ge9$ bằng cách khai triển $(u+v+w)\left(\dfrac1u+\dfrac1v+\dfrac1w\right)$ và dùng $\dfrac{p}{q}+\dfrac{q}{p}\ge2$, rồi thay vào để được kết quả cần chứng minh.

**Chú ý:** Phải chỉ ra $1-2a>0$ trước khi chia hay dùng bất đẳng thức giữa các số dương; dấu "=" xảy ra khi $a=b=c=\dfrac13$ (tam giác đều).

**Phần 2. Trình bày**

Vì $a+b+c=1$ nên $1-2a=b+c-a$, và theo bất đẳng thức tam giác $b+c-a>0$. Tương tự $1-2b>0$, $1-2c>0$. Đặt $u=1-2a$, $v=1-2b$, $w=1-2c$ thì $u,v,w>0$ và $u+v+w=3-2(a+b+c)=1$.

Xét hiệu $\dfrac{1-2a^2}{(1-2a)^2}-\left(\dfrac{4}{1-2a}-5\right)=\dfrac{1-2a^2-4(1-2a)+5(1-2a)^2}{(1-2a)^2}=\dfrac{2(3a-1)^2}{(1-2a)^2}\ge0$

nên $\dfrac{1-2a^2}{(1-2a)^2}\ge\dfrac{4}{u}-5$.

Tương tự $\dfrac{1-2b^2}{(1-2b)^2}\ge\dfrac{4}{v}-5$ và $\dfrac{1-2c^2}{(1-2c)^2}\ge\dfrac{4}{w}-5$.

Cộng ba bất đẳng thức: vế trái $\ge4\left(\dfrac1u+\dfrac1v+\dfrac1w\right)-15$.

Mặt khác $(u+v+w)\left(\dfrac1u+\dfrac1v+\dfrac1w\right)=3+\left(\dfrac uv+\dfrac vu\right)+\left(\dfrac uw+\dfrac wu\right)+\left(\dfrac vw+\dfrac wv\right)\ge3+2+2+2=9$, mà $u+v+w=1$ nên $\dfrac1u+\dfrac1v+\dfrac1w\ge9$.

Suy ra vế trái $\ge4\cdot9-15=21$. Dấu "=" xảy ra khi $a=b=c=\dfrac13$.

=== C2.6a@p277
- bai: 6 · y: a · trang: 277 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T020202
- cong_cu: lãi kép · phương trình $(1+r)^2=1{,}06^2$
- kiem: khong
- ket_qua_sach: 6\%
- dap_an: $6\%$
- ghi_chu_nghi: Lời giải sách dùng kí hiệu $x\%$ cho lãi suất; kho đặt $r$ là số thập phân ($r=0{,}06$) cho gọn.
## DE
Mẹ gửi $100\,000\,000$ đồng vào ngân hàng với lãi suất kì hạn $1$ năm. Sau $2$ năm mẹ nhận số tiền cả vốn lẫn lãi là $112\,360\,000$ đồng. Hỏi lãi suất ngân hàng đó là bao nhiêu phần trăm trong một năm? Biết rằng số tiền lãi của năm đầu được gộp vào với vốn để tính lãi cho năm sau.
## SACH
Nếu gửi $a$ (đồng), lãi suất $x\%$ trong $1$ năm.
Sau $1$ năm nhận cả vốn lẫn lãi là:
$a+a\cdot x\%=a(1+x\%)$ (đồng)
Sau $2$ năm nhận cả vốn lẫn lãi là:
$a(1+x\%)+a(1+x\%)\cdot x\%=a(1+x\%)^2$ (đồng)
Theo đầu bài, ta có:
$100\,000\,000(1+x\%)^2=112\,360\,000$
$(1+x\%)^2=1{,}1236=1{,}06^2$
$x\%=6\%$ (thích hợp)

Vậy lãi suất của ngân hàng đó là $6\%$ một năm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Lãi năm đầu được gộp vào vốn nên mỗi năm số tiền được nhân với $1+r$ (lãi kép); sau hai năm số tiền là vốn nhân $(1+r)^2$, từ đó lập phương trình bậc hai theo $r$.

**Bước 1.** Gọi $r$ là lãi suất một năm viết dưới dạng số thập phân và tính số tiền cả vốn lẫn lãi sau năm thứ nhất.

**Bước 2.** Coi số tiền đó là vốn mới để tính lãi năm thứ hai, rồi lập phương trình theo số tiền $112\,360\,000$ đồng nhận được sau hai năm.

**Bước 3.** Chia hai vế cho vốn ban đầu và nhận ra vế phải là một bình phương để giải $(1+r)^2$ bằng cách khai căn, chọn nghiệm thỏa $r>0$.

**Bước 4.** Đổi $r$ sang phần trăm và trả lời.

**Chú ý:** Không tính lãi đơn $2r$ — đề nói rõ lãi năm đầu gộp vào vốn; và phương trình $(1+r)^2=1{,}06^2$ còn nghiệm $1+r=-1{,}06$ (khi đó $r<0$) phải loại.

**Phần 2. Trình bày**

Gọi lãi suất là $r$ một năm (viết dưới dạng số thập phân, $r>0$).

Sau năm thứ nhất số tiền cả vốn lẫn lãi là $100\,000\,000(1+r)$ đồng.

Sau năm thứ hai là $100\,000\,000(1+r)+100\,000\,000(1+r)\cdot r=100\,000\,000(1+r)^2$ đồng.

Theo đề: $100\,000\,000(1+r)^2=112\,360\,000$

$\Leftrightarrow(1+r)^2=1{,}1236=1{,}06^2$.

Vì $1+r>0$ nên $1+r=1{,}06$, suy ra $r=0{,}06$.

Vậy lãi suất ngân hàng là $6\%$ một năm.

=== C2.6b@p277
- bai: 6 · y: b · trang: 277 · tang: hsg
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tam giác · phản chứng
- kiem: khong
- ket_qua_sach: 4 hoặc 5
- dap_an: $4$ hoặc $5$
- ghi_chu_nghi: Phân vân có phải bài hình không: đề là đa giác lồi nhưng chỉ dùng bất đẳng thức tam giác để loại $n\ge6$, kèm hai ví dụ — nên vẫn chép; chưa chắc nhóm (để dạng chờ). Sách chỉ xét $n\ge4$ (tam giác không có đường chéo, coi như không thuộc đề) và lời giải ngắn: "$D,E$ là hai đỉnh không thuộc cạnh kề với $AB$" không nói rõ thứ tự bốn đỉnh $A,B,D,E$ trên đa giác; lời giải kho chọn cụ thể $A=A_1$, $B=A_2$, $D=A_4$, $E=A_5$.
## DE
Một đa giác lồi có mọi đường chéo bằng nhau. Đa giác này có mấy cạnh?
## SACH
Số cạnh của đa giác có thể là $4$ (chẳng hạn hình chữ nhật), là $5$ (chẳng hạn ngũ giác đều).
Nếu số cạnh của đa giác lồi lớn hơn $5$ thì không thể mọi đường chéo bằng nhau. Giả sử tồn tại đa giác lồi $n$ cạnh ($n\in\mathbb N$, $n\ge6$) có mọi đường chéo bằng nhau. Xét cạnh $AB$. Gọi $D$, $E$ là hai đỉnh không thuộc cạnh kề với $AB$. Gọi $O$ là giao điểm của $BE$ và $AD$. Ta có $AE+BD<OA+OE+OB+OD=AD+BE$. Do đó không thể xảy ra bốn đường chéo $AE$, $BD$, $AD$, $BE$ bằng nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa giác có từ $6$ cạnh trở lên đủ đỉnh để chọn bốn đỉnh $A,B,D,E$ tạo tứ giác lồi mà cả hai đường chéo $AD,BE$ lẫn hai cạnh $AE,BD$ của tứ giác đều là đường chéo của đa giác; bất đẳng thức tam giác cho thấy hai cạnh đối này có tổng nhỏ hơn tổng hai đường chéo, nên không thể bằng nhau hết.

**Bước 1.** Chỉ ra hai ví dụ: hình chữ nhật có hai đường chéo bằng nhau, ngũ giác đều có năm đường chéo bằng nhau; tam giác không có đường chéo nên không xét.

**Bước 2.** Giả sử đa giác có $n\ge6$ cạnh và mọi đường chéo bằng nhau; chọn bốn đỉnh $A,B,D,E$ theo thứ tự trên đa giác với $A,B$ kề nhau, $D$ cách $B$ một đỉnh và $E$ kề $D$, sao cho cả bốn đoạn $AE$, $BD$, $AD$, $BE$ đều không phải cạnh của đa giác.

**Bước 3.** Gọi $O$ là giao điểm hai đường chéo $AD$ và $BE$ của tứ giác lồi $ABDE$, áp dụng bất đẳng thức tam giác cho hai tam giác $OAE$ và $OBD$ rồi cộng lại để so sánh $AE+BD$ với $AD+BE$.

**Bước 4.** Nhận thấy kết quả mâu thuẫn với giả thiết các đường chéo bằng nhau, từ đó loại $n\ge6$ và kết luận.

**Chú ý:** Phải kiểm tra bốn đoạn kia đúng là đường chéo của đa giác (không phải cạnh), nếu không không được dùng giả thiết "mọi đường chéo bằng nhau" cho chúng.

**Phần 2. Trình bày**

Với $n=4$: hình chữ nhật có hai đường chéo bằng nhau. Với $n=5$: ngũ giác đều có mọi đường chéo bằng nhau. Tam giác không có đường chéo nên không xét.

Giả sử có đa giác lồi $n$ cạnh ($n\ge6$) có mọi đường chéo bằng nhau, các đỉnh theo thứ tự là $A_1,A_2,\dots,A_n$. Lấy $A=A_1$, $B=A_2$, $D=A_4$, $E=A_5$. Vì $n\ge6$ nên $A_1A_5$, $A_2A_4$, $A_1A_4$, $A_2A_5$ đều là đường chéo của đa giác, nên $AE=BD=AD=BE$.

Tứ giác $ABDE$ lồi, hai đường chéo $AD$ và $BE$ cắt nhau tại $O$ nằm giữa $A,D$ và giữa $B,E$.

Trong tam giác $OAE$: $AE<OA+OE$. Trong tam giác $OBD$: $BD<OB+OD$.

Cộng hai bất đẳng thức: $AE+BD<(OA+OD)+(OB+OE)=AD+BE$.

Điều này mâu thuẫn với $AE=BD=AD=BE$. Vậy $n\le5$, mà đa giác có đường chéo nên $n\in\{4;5\}$.

Vậy đa giác có $4$ hoặc $5$ cạnh.

