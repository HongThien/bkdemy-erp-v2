# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 5 | V. Dạng toán khác | tu_luan

### Bài 28 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Có hay không hai số nguyên dương khác nhau $x$ và $y$ trong khoảng $(998;1994)$ sao cho $xy+x$ và $xy+y$ là hai số chính phương khác nhau?
**Ghi chú:** Khoảng $(998;1994)$ là khoảng mở nên $x$, $y$ nhận các giá trị nguyên từ 999 đến 1993. Số chính phương gồm cả 0 nhưng ở đây hai số $xy+x$, $xy+y$ đều dương nên không ảnh hưởng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai số $xy+x$ và $xy+y$ chỉ hơn kém nhau $y-x$, một số bé (dưới 1000), nên cần đặt cạnh khoảng cách nhỏ nhất có thể có giữa hai số chính phương cùng cỡ với $x^2$.

**Bước 1.** Hai số $x$ và $y$ có vai trò như nhau (đổi chỗ thì hai biểu thức đổi chỗ), nên giả sử $x<y$ và đặt $xy+x=a^2$, $xy+y=b^2$ với $a$, $b$ là số tự nhiên.

**Bước 2.** Từ $a^2<b^2$ suy ra $b\ge a+1$; dùng hằng đẳng thức hiệu hai bình phương để viết $b^2-a^2$ thành tích rồi tìm cận dưới của hiệu này theo $a$, chú ý hiệu đó đúng bằng $y-x$.

**Bước 3.** Đánh giá cỡ của $a$: viết $xy+x=x(y+1)$ và so sánh thừa số $y+1$ với $x$ để chứng tỏ $a^2$ lớn hơn một bình phương nào đó của $x$, từ đó $a$ lớn hơn một số cụ thể.

**Bước 4.** Đánh giá cỡ của $y-x$ từ điều kiện $x$, $y$ nằm trong khoảng $(998;1994)$ rồi đặt cạnh cận dưới ở bước 2 và bước 3 để xem có thể xảy ra hay không.

**Chú ý:** chỉ cần dùng $x<y$ và hai số $x$, $y$ lớn hơn 998, không cần biết $xy+x$ và $xy+y$ khác nhau (điều này đã tự có vì $x\ne y$).

**Phần 2. Trình bày**

Vì $x$ và $y$ có vai trò như nhau nên ta có thể giả sử $x<y$. Khi đó $999\le x<y\le 1993$.

Giả sử tồn tại $x$, $y$ thoả mãn đề bài. Đặt $xy+x=a^2$ và $xy+y=b^2$ với $a$, $b\in\mathbb{N}$.

Vì $x<y$ nên $xy+x<xy+y$, suy ra $a^2<b^2$ nên $a<b$. Do $a$, $b$ là số tự nhiên nên $b\ge a+1$.

Khi đó $b^2-a^2=(b-a)(b+a)\ge b+a\ge (a+1)+a=2a+1$ (vì $b-a\ge 1$).

Mà $b^2-a^2=(xy+y)-(xy+x)=y-x$ nên $y-x\ge 2a+1$. (1)

Mặt khác $a^2=xy+x=x(y+1)$. Vì $y>x$ nên $y+1>x$, do đó $a^2=x(y+1)>x^2$, suy ra $a>x$.

Vì $x\ge 999$ nên $a\ge 1000$. Thay vào (1) ta được $y-x\ge 2 \cdot 1000+1=2001$.

Nhưng $x\ge 999$ và $y\le 1993$ nên $y-x\le 1993-999=994$, mâu thuẫn với $y-x\ge 2001$.

Vậy không có hai số nguyên dương khác nhau $x$ và $y$ trong khoảng $(998;1994)$ sao cho $xy+x$ và $xy+y$ là hai số chính phương khác nhau.

### Bài 29 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $B=1\cdot 2\cdot 3+2\cdot 3\cdot 4+\dots+k(k+1)(k+2)$ với $k$ là số tự nhiên. Chứng minh rằng $4B+1$ là số chính phương.
**Ghi chú:** Lấy $k\ge 1$ để tổng $B$ có ít nhất số hạng đầu $1\cdot 2\cdot 3$. Với $k=0$ nếu quy ước $B=0$ thì $4B+1=1=1^2$ cũng đúng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhân mỗi số hạng với 4 thì viết được nó thành hiệu của hai tích bốn số tự nhiên liên tiếp, nên khi cộng lại các số hạng ở giữa triệt tiêu theo từng cặp.

**Bước 1.** Xét số hạng tổng quát $n(n+1)(n+2)$ và nhận ra $(n+3)-(n-1)=4$, từ đó viết $4n(n+1)(n+2)$ thành hiệu của hai tích bốn thừa số liên tiếp bằng cách đặt thừa số chung.

**Bước 2.** Áp dụng đẳng thức đó lần lượt cho $n=1,2,\dots,k$ rồi cộng các đẳng thức vế với vế: số bị trừ của dòng trước giống số trừ của dòng sau nên triệt tiêu, chỉ còn đầu và cuối.

**Bước 3.** Ghép bốn thừa số còn lại thành hai nhóm sao cho hai nhóm hơn kém nhau đúng 2 đơn vị, rồi đặt một biến mới cho nhóm nhỏ để biểu thức chỉ còn một biến.

**Bước 4.** Cộng thêm 1 vào tích hai số hơn kém nhau 2 thì nhận ra một hằng đẳng thức bình phương của một tổng, từ đó thay biến mới trở lại để kết luận.

**Chú ý:** dòng đầu tiên ($n=1$) có số trừ chứa thừa số 0 nên bằng 0, không ảnh hưởng tổng.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $n\ge 1$ ta có:

$4n(n+1)(n+2)=n(n+1)(n+2)\left[(n+3)-(n-1)\right]$

$=n(n+1)(n+2)(n+3)-(n-1)n(n+1)(n+2)$

Lần lượt thay $n=1,2,3,\dots,k$:

$4 \cdot 1 \cdot 2 \cdot 3=1 \cdot 2 \cdot 3 \cdot 4-0 \cdot 1 \cdot 2 \cdot 3$

$4 \cdot 2 \cdot 3 \cdot 4=2 \cdot 3 \cdot 4 \cdot 5-1 \cdot 2 \cdot 3 \cdot 4$

$4 \cdot 3 \cdot 4 \cdot 5=3 \cdot 4 \cdot 5 \cdot 6-2 \cdot 3 \cdot 4 \cdot 5$

$\dots$

$4k(k+1)(k+2)=k(k+1)(k+2)(k+3)-(k-1)k(k+1)(k+2)$

Cộng vế với vế các đẳng thức trên, các số hạng ở giữa triệt tiêu nhau:

$4B=k(k+1)(k+2)(k+3)-0 \cdot 1 \cdot 2 \cdot 3=k(k+1)(k+2)(k+3)$

Khi đó:

$4B+1=\left[k(k+3)\right]\left[(k+1)(k+2)\right]+1$

$=(k^2+3k)(k^2+3k+2)+1$

Đặt $m=k^2+3k$ thì:

$4B+1=m(m+2)+1=m^2+2m+1=(m+1)^2=(k^2+3k+1)^2$

Vì $k$ là số tự nhiên nên $k^2+3k+1$ là số tự nhiên.

Vậy $4B+1$ là số chính phương.

### Bài 30 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho số tự nhiên $n$ thỏa mãn $\dfrac{n^2-1}{3}$ là tích của hai số tự nhiên liên tiếp. Chứng minh rằng $n$ là tổng của hai số chính phương liên tiếp.
**Ghi chú:** Số chính phương gồm cả 0, nên $n=1=0^2+1^2$ cũng thoả đề ($\dfrac{1^2-1}{3}=0=0 \cdot 1$).

**Phần 1. Hướng dẫn**

**Mấu chốt:** giả thiết đưa về $(2n-1)(2n+1)=3(2m+1)^2$; hai thừa số bên trái là hai số lẻ hơn kém nhau 2 nên nguyên tố cùng nhau, nhờ đó từng thừa số bị "ép" thành số chính phương.

**Bước 1.** Gọi hai số tự nhiên liên tiếp là $m$ và $m+1$, đổi giả thiết thành $n^2=3m^2+3m+1$, rồi nhân hai vế với 4 và trừ đi 1 để vế phải thành 3 nhân một bình phương.

**Bước 2.** Vế trái là hiệu hai bình phương nên phân tích thành tích hai số lẻ liên tiếp; kiểm tra hai số này nguyên tố cùng nhau bằng cách xét ước chung của chúng.

**Bước 3.** Vì 3 là số nguyên tố và chia hết tích, nên 3 chia hết đúng một trong hai thừa số; đặt thừa số đó bằng 3 nhân một số rồi dùng tính chất: hai số nguyên tố cùng nhau có tích là số chính phương thì mỗi số là số chính phương.

**Bước 4.** Xét trường hợp $2n+1$ chia hết cho 3: nhận ra $2n-1$ là bình phương của một số lẻ, rồi tính $n$ theo số lẻ đó và nhận ra tổng hai bình phương liên tiếp.

**Bước 5.** Xét trường hợp $2n-1$ chia hết cho 3: nhận ra $2n+1$ là số chính phương rồi dùng số dư của số chính phương khi chia cho 3 để loại trường hợp này.

**Chú ý:** tính chất "hai số nguyên tố cùng nhau có tích là số chính phương thì mỗi số là số chính phương" suy ra từ phân tích ra thừa số nguyên tố (lớp 6): mỗi thừa số nguyên tố của tích có số mũ chẵn và nằm trọn trong một trong hai số.

**Phần 2. Trình bày**

Gọi hai số tự nhiên liên tiếp là $m$ và $m+1$ ($m\in\mathbb{N}$). Theo đề bài:

$\dfrac{n^2-1}{3}=m(m+1)$, suy ra $n^2=3m^2+3m+1$ (và $n\ge 1$ vì $n^2-1\ge 0$).

Nhân hai vế với 4 rồi trừ đi 1:

$4n^2-1=12m^2+12m+3=3(4m^2+4m+1)=3(2m+1)^2$

Do đó $(2n-1)(2n+1)=3(2m+1)^2$. (1)

Giả sử $d$ là ước chung của $2n-1$ và $2n+1$. Khi đó $d$ là ước của $(2n+1)-(2n-1)=2$. Vì $2n-1$ lẻ nên $d$ lẻ, suy ra $d=1$. Vậy $2n-1$ và $2n+1$ nguyên tố cùng nhau.

Vế phải của (1) chia hết cho 3 mà 3 là số nguyên tố nên $2n-1$ chia hết cho 3 hoặc $2n+1$ chia hết cho 3.

**Trường hợp 1:** $2n+1$ chia hết cho 3.

Đặt $2n+1=3p$ ($p\in\mathbb{N}$). Từ (1) ta có $3p(2n-1)=3(2m+1)^2$ nên $(2n-1)p=(2m+1)^2$.

Mọi ước chung của $2n-1$ và $p$ đều là ước của $2n-1$ và $3p=2n+1$ nên bằng 1; do đó $2n-1$ và $p$ nguyên tố cùng nhau.

Hai số nguyên tố cùng nhau có tích $(2m+1)^2$ là số chính phương nên $2n-1$ là số chính phương. Đặt $2n-1=v^2$.

Vì $v^2$ lẻ nên $v$ lẻ, đặt $v=2a+1$ ($a\in\mathbb{N}$). Khi đó:

$2n=(2a+1)^2+1=4a^2+4a+2$

$n=2a^2+2a+1=a^2+(a+1)^2$

Vậy $n$ là tổng của hai số chính phương liên tiếp $a^2$ và $(a+1)^2$.

**Trường hợp 2:** $2n-1$ chia hết cho 3.

Đặt $2n-1=3q$ ($q\in\mathbb{N}$). Từ (1) ta có $3q(2n+1)=3(2m+1)^2$ nên $q(2n+1)=(2m+1)^2$.

Mọi ước chung của $q$ và $2n+1$ đều là ước của $3q=2n-1$ và $2n+1$ nên bằng 1; do đó $q$ và $2n+1$ nguyên tố cùng nhau, tích là số chính phương nên $2n+1$ là số chính phương. Đặt $2n+1=w^2$.

Khi đó $2n-1=w^2-2$ chia hết cho 3, nên $w^2$ chia cho 3 dư 2.

Nhưng số chính phương chia cho 3 chỉ dư 0 hoặc 1: nếu $w=3t$ thì $w^2=9t^2$ chia hết cho 3; nếu $w=3t\pm 1$ thì $w^2=9t^2\pm 6t+1$ chia cho 3 dư 1. Mâu thuẫn, nên trường hợp 2 không xảy ra.

Vậy $n$ là tổng của hai số chính phương liên tiếp.

### Bài 31 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng số $A=n^4+2n^3+2n^2+2n+1$ không phải là số chính phương với $n$ là số tự nhiên lớn hơn 1.

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn chứng minh một số không là số chính phương, ta kẹp nó **giữa hai số chính phương của hai số tự nhiên liên tiếp** — giữa hai số đó không còn số chính phương nào.

**Bước 1.** Tìm số tự nhiên "gần" nhất: hai hạng tử đầu $n^4+2n^3$ của $A$ là hai hạng tử đầu của khai triển bình phương $(n^2+n)^2$, nên thử $n^2+n$ và số kế tiếp $n^2+n+1$.

**Bước 2.** Khai triển $(n^2+n)^2$ và $(n^2+n+1)^2$ bằng hằng đẳng thức bình phương của một tổng, viết hai kết quả theo luỹ thừa giảm của $n$ để dễ so với $A$.

**Bước 3.** Lập hiệu của $A$ với bình phương nhỏ và hiệu của bình phương lớn với $A$, thu gọn từng hiệu rồi xét dấu theo điều kiện $n>1$.

**Bước 4.** Từ hai bất đẳng thức, giả sử $A$ là bình phương của một số tự nhiên $c$ rồi so sánh $c$ với hai số tự nhiên liên tiếp để đi đến mâu thuẫn.

**Phần 2. Trình bày**

Ta có:

$(n^2+n)^2=n^4+2n^3+n^2$

$(n^2+n+1)^2=(n^2+n)^2+2(n^2+n)+1=n^4+2n^3+3n^2+2n+1$

Xét hiệu:

$A-(n^2+n)^2=(n^4+2n^3+2n^2+2n+1)-(n^4+2n^3+n^2)=n^2+2n+1=(n+1)^2>0$

Do đó $A>(n^2+n)^2$.

$(n^2+n+1)^2-A=(n^4+2n^3+3n^2+2n+1)-(n^4+2n^3+2n^2+2n+1)=n^2>0$

Do đó $A<(n^2+n+1)^2$.

Vậy $(n^2+n)^2<A<(n^2+n+1)^2$.

Giả sử $A=c^2$ với $c$ là số tự nhiên. Khi đó $(n^2+n)^2<c^2<(n^2+n+1)^2$, suy ra $n^2+n<c<n^2+n+1$.

Điều này vô lí vì giữa hai số tự nhiên liên tiếp $n^2+n$ và $n^2+n+1$ không có số tự nhiên nào.

Vậy $A$ không phải là số chính phương với $n$ là số tự nhiên lớn hơn 1.

### Bài 32 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng $A=n^6-n^4+2n^3+2n^2$ không là số chính phương với $n$ là số tự nhiên lớn hơn 1.

**Phần 1. Hướng dẫn**

**Mấu chốt:** phân tích $A$ thành tích của một bình phương $\left[n(n+1)\right]^2$ với một thừa số bậc hai, rồi chỉ còn phải chứng minh thừa số bậc hai không là số chính phương bằng cách kẹp giữa hai bình phương liên tiếp.

**Bước 1.** Đặt $n^2$ làm thừa số chung, rồi nhóm các hạng tử của ngoặc còn lại: $n^4-n^2$ chứa $n^2-1$ còn $2n+2=2(n+1)$, nhờ đó xuất hiện thừa số $n+1$.

**Bước 2.** Phân tích tiếp đa thức bậc ba còn lại bằng cách viết nó thành hiệu của hai nhóm cùng chứa $n+1$ (dùng hằng đẳng thức tổng hai lập phương và hiệu hai bình phương).

**Bước 3.** Gom kết quả thành $A=u^2k$ với $u=n(n+1)$ và $k$ là đa thức bậc hai; viết $k$ dưới dạng bình phương của $n-1$ cộng một hằng số.

**Bước 4.** Nếu $A$ là số chính phương thì $k=\left(\dfrac{c}{u}\right)^2$ là bình phương của một phân số tối giản mà bằng số nguyên, nên phân số đó phải là số tự nhiên: vậy $k$ cũng là số chính phương.

**Bước 5.** Kẹp $k$ giữa $(n-1)^2$ và $n^2$ (dùng điều kiện $n>1$) để thấy $k$ không thể là số chính phương, từ đó kết luận về $A$.

**Chú ý:** điều kiện $n>1$ rất cần: với $n=1$ thì $A=4$ là số chính phương.

**Phần 2. Trình bày**

$A=n^6-n^4+2n^3+2n^2=n^2(n^4-n^2+2n+2)$

$=n^2\left[n^2(n^2-1)+2(n+1)\right]$

$=n^2\left[n^2(n-1)(n+1)+2(n+1)\right]$

$=n^2(n+1)\left[n^2(n-1)+2\right]$

$=n^2(n+1)(n^3-n^2+2)$

Phân tích $n^3-n^2+2$:

$n^3-n^2+2=(n^3+1)-(n^2-1)$

$=(n+1)(n^2-n+1)-(n-1)(n+1)$

$=(n+1)(n^2-n+1-n+1)=(n+1)(n^2-2n+2)$

Do đó $A=n^2(n+1)^2(n^2-2n+2)=\left[n(n+1)\right]^2\left[(n-1)^2+1\right]$.

Đặt $u=n(n+1)$ và $k=n^2-2n+2=(n-1)^2+1$, ta có $A=u^2k$ và $u>0$.

Giả sử $A=c^2$ với $c$ là số tự nhiên. Khi đó $u^2k=c^2$ nên $k=\left(\dfrac{c}{u}\right)^2$.

Viết $\dfrac{c}{u}=\dfrac{p}{q}$ là phân số tối giản ($p\in\mathbb{N}$, $q\in\mathbb{N}^*$). Khi đó $kq^2=p^2$.

Nếu $q>1$ thì $q$ có ước nguyên tố $r$; $r$ là ước của $p^2$ nên $r$ là ước của $p$, trái với $\dfrac{p}{q}$ tối giản. Vậy $q=1$, tức $\dfrac{c}{u}=p$ là số tự nhiên và $k=p^2$ là số chính phương.

Mặt khác $k-(n-1)^2=1>0$ và $n^2-k=n^2-(n^2-2n+2)=2n-2>0$ (vì $n>1$).

Do đó $(n-1)^2<k<n^2$, tức $(n-1)^2<p^2<n^2$, suy ra $n-1<p<n$.

Điều này vô lí vì giữa hai số tự nhiên liên tiếp $n-1$ và $n$ không có số tự nhiên nào.

Vậy $A$ không là số chính phương với $n$ là số tự nhiên lớn hơn 1.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Cả 5 bài (28–32) đều là `tu_luan` (chứng minh / có hay không), không có đáp số số học để tô 4 ô. Đề khớp ảnh `5.webp`, không phải sửa chữ nào.
- Phạm vi kiến thức dùng: ước chung, số nguyên tố, số chính phương, hằng đẳng thức (hiệu hai bình phương, bình phương của một tổng, tổng hai lập phương), phân tích nhân tử bằng nhóm hạng tử (Chương II). Không dùng đường trung bình, Thalès, Pythagore, phân thức, phương trình.
- Bài 30 dùng tính chất "hai số nguyên tố cùng nhau có tích là số chính phương thì mỗi số là số chính phương" (hệ quả của phân tích ra thừa số nguyên tố, lớp 6; không có tên trong SGK KNTT 8). Bài 32 chứng minh tối thiểu "$u^2k$ là số chính phương thì $k$ là số chính phương" qua phân số tối giản (lớp 6–7). Cả hai đều nêu ngay trong lời giải.
- Bài 29: lời giải tính tổng bằng cách viết số hạng thành hiệu rồi triệt tiêu (kiểu "dãy cộng" lớp 6–7), không dùng quy nạp hay kí hiệu tổng.
- Bài 28 là bài "có hay không" nên Phần 2 chứng minh phản chứng rằng không tồn tại; đã vét cạn bằng máy mọi cặp $999\le x,y\le 1993$ ($x\ne y$) cho kết quả 0 cặp.
