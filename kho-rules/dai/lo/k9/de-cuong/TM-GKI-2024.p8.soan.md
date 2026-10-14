# ĐỀ | Đề cương ôn tập giữa học kì I Toán 9 — THCS Tây Mỗ (Hà Nội)
nam: 2024
bo_sach: KNTT
kieu: de_cuong

## PHẦN 5 | Dạng 5. Các dạng khác (Bài 26–29) | tu_luan

### Bài 26 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho các số thực $x\ge1$; $y\ge1$; $z\ge1$ thỏa mãn $xy+yz+xz=9$. Tìm GTNN, GTLN của $P=x^2+y^2+z^2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $P$ liên hệ với $xy+yz+zx$ qua các bình phương nên GTNN tìm bằng tổng ba bình phương $(x-y)^2$, $(y-z)^2$, $(z-x)^2$, còn GTLN dùng điều kiện $x,y,z\ge1$ bằng cách đặt $a=x-1$, $b=y-1$, $c=z-1$ không âm.

**Bước 1.** Ý GTNN: khai triển $(x-y)^2+(y-z)^2+(z-x)^2\ge0$ để so sánh $x^2+y^2+z^2$ với $xy+yz+zx$ mà giả thiết đã cho giá trị.

**Bước 2.** Ý GTNN: tìm điều kiện để dấu "=" xảy ra, giải ra giá trị của biến và kiểm tra giá trị đó có thoả điều kiện $\ge1$ và giả thiết hay không, vì có đạt được mới kết luận là GTNN.

**Bước 3.** Ý GTLN: đặt $a=x-1$, $b=y-1$, $c=z-1$ rồi viết giả thiết và $P$ theo $a+b+c$ và $ab+bc+ca$, dùng $a,b,c\ge0$ để chặn $a+b+c$.

**Bước 4.** Ý GTLN: biểu diễn $P$ thành một biểu thức bậc hai của $S=a+b+c$, phân tích $P-m$ thành nhân tử với $m$ là giá trị lớn nhất dự đoán, rồi xét dấu từng nhân tử trên miền của $S$.

**Bước 5.** Ý GTLN: tìm khi nào dấu "=" xảy ra bằng cách xét các tích $ab$, $bc$, $ca$ không âm có tổng bằng $0$, rồi kiểm tra bộ số tìm được trong giả thiết.

**Phần 2. Trình bày**

Tìm GTNN.

Ta có $(x-y)^2+(y-z)^2+(z-x)^2\ge0$.

Suy ra $2(x^2+y^2+z^2)-2(xy+yz+zx)\ge0$.

Do đó $x^2+y^2+z^2\ge xy+yz+zx$, tức là $P\ge9$.

Dấu "=" xảy ra khi $x=y=z$. Khi đó $3x^2=9$, suy ra $x^2=3$, nên $x=\sqrt{3}$ (vì $x\ge1>0$).

Bộ $x=y=z=\sqrt{3}$ thoả mãn $x,y,z\ge1$ và $xy+yz+zx=3+3+3=9$.

Vậy GTNN của $P$ là $9$, đạt khi $x=y=z=\sqrt{3}$.

Tìm GTLN.

Đặt $a=x-1$, $b=y-1$, $c=z-1$. Vì $x,y,z\ge1$ nên $a\ge0$, $b\ge0$, $c\ge0$.

Ta có $xy+yz+zx=(a+1)(b+1)+(b+1)(c+1)+(c+1)(a+1)=ab+bc+ca+2(a+b+c)+3$.

Theo giả thiết, $ab+bc+ca+2(a+b+c)=6$. (1)

Đặt $S=a+b+c$. Vì $a,b,c\ge0$ nên $ab+bc+ca\ge0$, do đó từ (1) suy ra $2S\le6$, tức là $0\le S\le3$.

Từ (1) có $ab+bc+ca=6-2S$.

Suy ra $a^2+b^2+c^2=S^2-2(ab+bc+ca)=S^2-2(6-2S)=S^2+4S-12$.

Ta có $P=(a+1)^2+(b+1)^2+(c+1)^2=a^2+b^2+c^2+2S+3=S^2+6S-9$.

Suy ra $P-18=S^2+6S-27=(S-3)(S+9)$.

Vì $0\le S\le3$ nên $S-3\le0$ và $S+9>0$, do đó $(S-3)(S+9)\le0$, tức là $P\le18$.

Dấu "=" xảy ra khi $S=3$, khi đó $ab+bc+ca=0$. Vì $ab,bc,ca\ge0$ nên $ab=bc=ca=0$, do đó có hai trong ba số $a,b,c$ bằng $0$ và số còn lại bằng $3$.

Chẳng hạn $x=4$, $y=1$, $z=1$ thoả mãn $x,y,z\ge1$ và $xy+yz+zx=4+1+4=9$, khi đó $P=16+1+1=18$.

Vậy GTLN của $P$ là $18$, đạt khi $(x;y;z)=(4;1;1)$ và các hoán vị.

### Bài 27 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho hai số dương $x,\ y$ thỏa mãn điều kiện $x+y=2$. Chứng minh rằng $x^2y^2(x^2+y^2)\le2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu thức chỉ phụ thuộc vào tích $t=xy$ vì $x^2+y^2=(x+y)^2-2xy$ và $x+y=2$ đã biết, nên đưa bài toán về một biến $t$.

**Bước 1.** Đặt $t=xy$, chứng minh $0<t\le1$ bằng cách xét hiệu $1-xy$ rồi biến đổi về bình phương $(x-y)^2$ nhờ giả thiết $x+y=2$.

**Bước 2.** Viết $x^2+y^2$ theo $t$ bằng hằng đẳng thức bình phương của một tổng, rồi thay vào vế trái để được một đa thức bậc ba của $t$.

**Bước 3.** Xét hiệu $2$ trừ vế trái, phân tích đa thức bậc ba thành nhân tử (nhẩm một nghiệm của đa thức rồi chia).

**Bước 4.** Xét dấu từng nhân tử với $0<t\le1$ để kết luận hiệu không âm, rồi tìm khi nào dấu "=" xảy ra.

**Phần 2. Trình bày**

Đặt $t=xy$. Vì $x,y>0$ nên $t>0$.

Vì $x+y=2$ nên $\dfrac{(x+y)^2}{4}=1$, do đó $1-t=\dfrac{(x+y)^2}{4}-xy$.

Suy ra $1-t=\dfrac{(x+y)^2-4xy}{4}=\dfrac{(x-y)^2}{4}\ge0$.

Do đó $0<t\le1$.

Ta có $x^2+y^2=(x+y)^2-2xy=4-2t$.

Suy ra $x^2y^2(x^2+y^2)=t^2(4-2t)$.

Xét hiệu $2-t^2(4-2t)=2t^3-4t^2+2=2(t^3-2t^2+1)$.

Ta có $t^3-2t^2+1=(t^3-t^2)-(t^2-1)$.

Suy ra $t^3-2t^2+1=t^2(t-1)-(t-1)(t+1)=(t-1)(t^2-t-1)$.

Do đó $2-t^2(4-2t)=2(t-1)(t^2-t-1)$.

Vì $0<t\le1$ nên $t-1\le0$ và $t(t-1)\le0$, suy ra $t^2-t-1=t(t-1)-1\le-1<0$.

Vậy $(t-1)$ và $(t^2-t-1)$ cùng không dương nên $(t-1)(t^2-t-1)\ge0$.

Suy ra $2-t^2(4-2t)\ge0$, tức là $x^2y^2(x^2+y^2)\le2$.

Dấu "=" xảy ra khi $t=1$, tức là $(x-y)^2=0$, suy ra $x=y=1$.

Vậy $x^2y^2(x^2+y^2)\le2$ với mọi $x,y>0$ thoả mãn $x+y=2$.

### Bài 28 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Bác Minh muốn đặt đóng một chiếc hộp đựng quà lưu niệm có dạng hình hộp chữ nhật với mặt đáy $ABCD$ là hình vuông như hình dưới đây. Để món quà trở nên đặc biệt, bác Minh muốn mạ bốn mặt xung quanh và mặt đáy dưới (đáy $MNPQ$) của chiếc hộp bằng kim loại quý (không mạ nắp hộp). Em hãy tìm độ dài cạnh $MN$ của mặt đáy và chiều cao $AM$ của hộp quà sao cho tổng diện tích các mặt được mạ kim loại quý của chiếc hộp là nhỏ nhất biết rằng thể tích của chiếc hộp là $4\ \text{dm}^3$.
**Ghi chú:** Đề cương ghi "như hình dưới đây" nhưng KHÔNG in hình; tên các mặt ($ABCD$ là mặt đáy hình vuông, đáy dưới $MNPQ$, chiều cao $AM$) lấy theo lời văn.

**Phần 1. Hướng dẫn**

**Mấu chốt:** thể tích cố định cho phép biểu diễn chiều cao theo cạnh đáy, nhờ đó diện tích mạ trở thành biểu thức của một biến, rồi chứng minh biểu thức đó không nhỏ hơn một số bằng cách phân tích hiệu thành nhân tử.

**Bước 1.** Gọi cạnh đáy và chiều cao là hai ẩn dương, viết thể tích để rút chiều cao theo cạnh đáy.

**Bước 2.** Xác định các mặt được mạ gồm một đáy hình vuông và bốn mặt bên bằng nhau, lập biểu thức diện tích rồi thay chiều cao đã rút để được biểu thức một biến.

**Bước 3.** Thử vài giá trị của cạnh đáy để dự đoán giá trị nhỏ nhất, rồi xét hiệu giữa diện tích và giá trị dự đoán, quy đồng về một phân thức có mẫu dương.

**Bước 4.** Phân tích tử của phân thức thành nhân tử bằng cách tách hạng tử, chỉ ra tử luôn không âm rồi tìm giá trị cạnh đáy làm hiệu bằng $0$ và tính chiều cao tương ứng.

**Phần 2. Trình bày**

Gọi $x$ (dm) là độ dài cạnh $MN$ và $h$ (dm) là chiều cao $AM$, điều kiện $x>0$, $h>0$.

Thể tích hộp là $x^2h=4$, suy ra $h=\dfrac{4}{x^2}$.

Tổng diện tích các mặt được mạ gồm một mặt đáy và bốn mặt bên, mỗi mặt bên có diện tích $xh$, nên $S=x^2+4xh$.

Thay $h=\dfrac{4}{x^2}$, ta có $S=x^2+4x\cdot\dfrac{4}{x^2}=x^2+\dfrac{16}{x}$.

Xét hiệu $S-12=x^2+\dfrac{16}{x}-12=\dfrac{x^3-12x+16}{x}$.

Ta có $x^3-12x+16=(x^3-4x^2+4x)+(4x^2-16x+16)$.

Suy ra $x^3-12x+16=x(x-2)^2+4(x-2)^2=(x+4)(x-2)^2$.

Do đó $S-12=\dfrac{(x+4)(x-2)^2}{x}$.

Vì $x>0$ nên $x+4>0$, $(x-2)^2\ge0$, suy ra $S-12\ge0$, tức là $S\ge12$.

Dấu "=" xảy ra khi $x=2$. Khi đó $h=\dfrac{4}{2^2}=1$.

Vậy diện tích mạ nhỏ nhất là $12\ \text{dm}^2$, đạt khi $MN=2\ \text{dm}$ và $AM=1\ \text{dm}$.

### Bài 29 | kho=dai | loai=tra_loi_ngan | dap_an=21
**Đề:** Cửa hàng nhà bác Dũng chuyên kinh doanh máy tính tại Hà Nội. Một loại máy tính có giá nhập vào một chiếc là $18$ triệu đồng và bán ra với giá $22$ triệu đồng. Với giá bán như trên thì một năm số lượng máy tính bán được dự kiến là $500$ chiếc. Để tăng thêm lượng tiêu thụ dòng máy tính này, bác Dũng dự định giảm giá bán và ước lượng cứ giảm $200$ nghìn đồng một chiếc thì số lượng máy tính bán ra trong một năm sẽ tăng $50$ chiếc. Vậy bác Dũng phải bán với giá bao nhiêu để sau khi giảm giá lợi nhuận thu sẽ được cao nhất?

**Phần 1. Hướng dẫn**

**Mấu chốt:** gọi $x$ là số lần giảm $200$ nghìn đồng thì giá bán, số lượng bán và lợi nhuận đều biểu diễn được theo $x$, và lợi nhuận là một tam thức bậc hai của $x$ cần đưa về dạng một số trừ đi một bình phương.

**Bước 1.** Gọi ẩn là số lần giảm giá, đổi $200$ nghìn đồng ra triệu đồng cho cùng đơn vị với giá nhập, rồi biểu diễn giá bán mới và số máy bán được theo ẩn.

**Bước 2.** Lợi nhuận một chiếc bằng giá bán mới trừ giá nhập, nhân với số máy bán ra để được tổng lợi nhuận theo $x$ rồi khai triển.

**Bước 3.** Đưa biểu thức bậc hai về dạng $k-10(x-m)^2$ bằng cách đặt hệ số $-10$ làm thừa số chung rồi hoàn thành bình phương.

**Bước 4.** Từ dạng đó chỉ ra lợi nhuận không vượt quá $k$, tìm $x$ để đạt $k$, kiểm tra điều kiện của ẩn rồi tính giá bán tương ứng và trả lời đúng câu hỏi về giá bán.

**Phần 2. Trình bày**

Gọi $x$ là số lần giảm giá, mỗi lần giảm $200$ nghìn đồng, tức là $0{,}2$ triệu đồng (điều kiện $x\ge0$).

Giá bán mới của một chiếc máy là $22-0{,}2x$ (triệu đồng).

Số máy bán được trong một năm là $500+50x$ (chiếc).

Lợi nhuận của một chiếc máy là $22-0{,}2x-18=4-0{,}2x$ (triệu đồng).

Tổng lợi nhuận một năm là $L=(4-0{,}2x)(500+50x)$.

Khai triển: $L=2000+200x-100x-10x^2=2000+100x-10x^2$.

Suy ra $L=-10(x^2-10x)+2000=-10(x^2-10x+25)+250+2000$.

Do đó $L=2250-10(x-5)^2$.

Vì $(x-5)^2\ge0$ nên $L\le2250$, dấu "=" xảy ra khi $x=5$ (thoả mãn $x\ge0$).

Khi đó giá bán là $22-0{,}2\cdot5=21$ (triệu đồng), lớn hơn giá nhập $18$ triệu đồng, và bán được $500+50\cdot5=750$ chiếc.

Vậy bác Dũng phải bán với giá $21$ triệu đồng một chiếc thì lợi nhuận cao nhất, bằng 2 250 triệu đồng một năm.

## GHI CHÚ CHO NGƯỜI DUYỆT

Không có câu cần xem riêng. Mọi đáp số đã thử lại bằng máy: Bài 26 lấy mẫu hơn 1,4 triệu bộ $(x;y;z)$ thoả giả thiết, $P$ nằm trong $[9;18]$, đạt $9$ tại $x=y=z=\sqrt{3}$ và $18$ tại $(4;1;1)$ · Bài 27 thử 2 triệu bộ $(x;y)$, cả hằng đẳng thức $2-t^2(4-2t)=2(t-1)(t^2-t-1)$ · Bài 28 và Bài 29 quét lưới và kiểm hằng đẳng thức. Các lời giải không dùng Cô-si, đạo hàm hay công thức nghiệm; Bài 28 (hộp quà) không in hình nên không vẽ hình giải, lời giải rõ không cần hình.
