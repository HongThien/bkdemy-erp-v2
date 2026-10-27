# ĐỀ | Nội dung ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Thanh Xuân, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 5 | Phần nâng cao | tu_luan

### Khác Bài 1a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng không tồn tại các số thực $x,\ y,\ z$ thỏa mãn: $5x^2+10y^2-6xy-4x-2y+3=0$.
**Ghi chú:** Lệnh chung của Bài 1 ghi $x,\ y,\ z$ nhưng biểu thức ý a chỉ có $x,\ y$ (không có $z$); $z$ không xuất hiện nên không ảnh hưởng — chứng minh theo $x,\ y$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** muốn chứng minh một biểu thức không bao giờ bằng $0$, hãy viết nó thành **tổng các bình phương cộng một số dương**: bình phương của số thực không bao giờ âm, nên cả tổng luôn dương.

**Bước 1.** Nhìn hạng tử chứa tích $xy$: hệ số $-6$ chỉ có thể đến từ khai triển một bình phương dạng $(x-ky)^2$ với $2k=6$, nên tách riêng bình phương đó ra trước.

**Bước 2.** Phần còn lại sau khi tách chỉ còn $x$ và $y$ đứng riêng lẻ; gom mỗi biến vào một bình phương: các hạng tử của $x$ ghép được thành bình phương một hiệu có hệ số của $x$ là $2$, các hạng tử của $y$ ghép được thành bình phương của một hiệu.

**Bước 3.** Cộng lại các số hạng tự do đã dùng để hoàn thành bình phương và so với hằng số $3$ của đề, xem phần dư còn lại là số dương hay không.

**Bước 4.** Kết luận: mỗi bình phương luôn lớn hơn hoặc bằng $0$ với MỌI số thực $x,\ y$, cộng với phần dư dương nên vế trái luôn lớn hơn $0$, không thể bằng $0$.

**Chú ý:** phải có phần dư **dương** thật sự; nếu phần dư bằng $0$ thì dấu "=" vẫn có thể xảy ra và phép chứng minh không thành công.

**Phần 2. Trình bày**

Ta có:

$5x^2+10y^2-6xy-4x-2y+3$

$=(x^2-6xy+9y^2)+(4x^2-4x+1)+(y^2-2y+1)+1$

$=(x-3y)^2+(2x-1)^2+(y-1)^2+1$

Với mọi số thực $x,\ y$ ta có $(x-3y)^2\ge 0$; $(2x-1)^2\ge 0$; $(y-1)^2\ge 0$.

Suy ra $5x^2+10y^2-6xy-4x-2y+3\ge 1>0$ với mọi số thực $x,\ y$.

Vậy không tồn tại các số thực $x,\ y$ (và $z$ bất kì) thỏa mãn $5x^2+10y^2-6xy-4x-2y+3=0$.

### Khác Bài 1b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Chứng minh rằng không tồn tại các số thực $x,\ y,\ z$ thỏa mãn: $x^2+4y^2+z^2-2x-6z+8y+15=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba biến $x,\ y,\ z$ không có tích chéo nên chỉ cần **hoàn thành bình phương riêng cho từng biến**, rồi xem số hạng tự do còn dư là dương hay âm.

**Bước 1.** Gom các hạng tử cùng biến: nhóm của $x$, nhóm của $y$ và nhóm của $z$, mỗi nhóm cần thêm một số để thành bình phương của một tổng hoặc một hiệu.

**Bước 2.** Với $x$: hạng tử $x^2-2x$ cần cộng $1$; với $z$: $z^2-6z$ cần cộng một số bằng bình phương của nửa hệ số; với $y$: $4y^2+8y$ viết thành $(2y+a)^2$ thì cần cộng $a^2$ với $a$ thích hợp.

**Bước 3.** Cộng các số vừa thêm vào, rồi so với số hạng tự do $15$ của đề để tìm phần dư còn lại.

**Bước 4.** Phần dư dương và ba bình phương đều không âm với MỌI số thực $x,\ y,\ z$ nên vế trái luôn lớn hơn $0$ — không thể bằng $0$.

**Phần 2. Trình bày**

Ta có:

$x^2+4y^2+z^2-2x-6z+8y+15$

$=(x^2-2x+1)+(4y^2+8y+4)+(z^2-6z+9)+1$

$=(x-1)^2+(2y+2)^2+(z-3)^2+1$

Với mọi số thực $x,\ y,\ z$ ta có $(x-1)^2\ge 0$; $(2y+2)^2\ge 0$; $(z-3)^2\ge 0$.

Suy ra $x^2+4y^2+z^2-2x-6z+8y+15\ge 1>0$ với mọi số thực $x,\ y,\ z$.

Vậy không tồn tại các số thực $x,\ y,\ z$ thỏa mãn $x^2+4y^2+z^2-2x-6z+8y+15=0$.

### Khác Bài 2a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x,\ y$ thỏa mãn $x^2+8y^2+9=4y(x+3)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chuyển mọi hạng tử sang một vế để vế kia bằng $0$, rồi viết vế còn lại thành **tổng hai bình phương**; tổng hai số không âm chỉ bằng $0$ khi **cả hai** cùng bằng $0$.

**Bước 1.** Nhân $4y$ vào ngoặc rồi chuyển hết sang vế trái để được một biểu thức bằng $0$ có đủ các hạng tử $x^2$, $y^2$, $xy$, $y$ và số tự do.

**Bước 2.** Hạng tử chứa tích $xy$ chỉ đến từ khai triển $(x-2y)^2$, nên tách bình phương này ra trước; phần còn lại chỉ chứa $y$.

**Bước 3.** Nhận ra phần còn lại là một bình phương dạng $(2y-a)^2$ bằng cách đối chiếu hệ số của $y^2$, của $y$ và số tự do.

**Bước 4.** Vì tổng hai bình phương bằng $0$ nên từng bình phương bằng $0$; giải bình phương chỉ chứa $y$ trước để tìm $y$, rồi thay vào bình phương còn lại để tìm $x$.

**Chú ý:** mỗi bước đều đúng với mọi số thực $x,\ y$; cuối bài nên thay cặp giá trị tìm được vào hai vế của đề để chắc chắn dấu "=" thật sự xảy ra.

**Phần 2. Trình bày**

$x^2+8y^2+9=4y(x+3)$

$x^2+8y^2+9=4xy+12y$

$x^2+8y^2+9-4xy-12y=0$

$(x^2-4xy+4y^2)+(4y^2-12y+9)=0$

$(x-2y)^2+(2y-3)^2=0$

Vì $(x-2y)^2\ge 0$ và $(2y-3)^2\ge 0$ với mọi $x,\ y$ nên tổng bằng $0$ khi và chỉ khi:

$(x-2y)^2=0$ và $(2y-3)^2=0$

$2y-3=0\Rightarrow y=\dfrac{3}{2}$

$x-2y=0\Rightarrow x=2y=3$

Thử lại: với $x=3$; $y=\dfrac{3}{2}$ thì vế trái $=3^2+8\cdot\left(\dfrac{3}{2}\right)^2+9=36$ và vế phải $=4\cdot\dfrac{3}{2}\cdot(3+3)=36$.

Vậy $x=3$; $y=\dfrac{3}{2}$.

### Khác Bài 2b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x,\ y$ thỏa mãn $9x^2-8xy+8y^2-28x+28=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hệ số của $y^2$ là $8$ không phải số chính phương, nhưng có thể đặt thừa số chung $2$ để được một bình phương theo $y$; phần còn lại chỉ chứa $x$ và cũng là bội của một bình phương.

**Bước 1.** Xét hai hạng tử $8y^2-8xy$: đặt thừa số chung $2$ để được $4y^2-4xy$, rồi bổ sung $x^2$ để thành bình phương $(2y-x)^2$; vì đã nhân với $2$ nên phải lấy $2x^2$ từ hạng tử $9x^2$.

**Bước 2.** Phần còn lại sau khi lấy $2x^2$ chỉ chứa $x$; đặt thừa số chung để thấy nó là một số dương nhân với bình phương của một hiệu.

**Bước 3.** Viết vế trái thành tổng của hai số hạng, mỗi số hạng là một số dương nhân với một bình phương, nên mỗi số hạng không âm.

**Bước 4.** Tổng hai số không âm bằng $0$ nên cả hai bằng $0$: tìm $x$ từ bình phương chỉ chứa $x$, rồi thay vào để tìm $y$.

**Chú ý:** hệ số $2$ và $7$ đều dương nên $2(2y-x)^2\ge 0$ và $7(x-2)^2\ge 0$ — nếu hệ số âm thì không kết luận được như vậy.

**Phần 2. Trình bày**

$9x^2-8xy+8y^2-28x+28=0$

$(8y^2-8xy+2x^2)+(7x^2-28x+28)=0$

$2(4y^2-4xy+x^2)+7(x^2-4x+4)=0$

$2(2y-x)^2+7(x-2)^2=0$

Vì $2(2y-x)^2\ge 0$ và $7(x-2)^2\ge 0$ với mọi $x,\ y$ nên tổng bằng $0$ khi và chỉ khi:

$(2y-x)^2=0$ và $(x-2)^2=0$

$x-2=0\Rightarrow x=2$

$2y-x=0\Rightarrow 2y=2\Rightarrow y=1$

Thử lại: với $x=2$; $y=1$ thì $9\cdot 4-8\cdot 2\cdot 1+8\cdot 1-28\cdot 2+28=36-16+8-56+28=0$.

Vậy $x=2$; $y=1$.

### Khác Bài 2c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x,\ y$ thỏa mãn $x^2+2y^2+5z^2+1=2(xy+2yz+z)$.
**Ghi chú:** Đề sai/thiếu lệnh: lệnh chung ghi "Tìm $x,\ y$" nhưng ý c có thêm biến $z$ — giải bình thường, tìm cả $x,\ y,\ z$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** có ba biến và hai tích chéo $xy$, $yz$ nên **hoàn thành bình phương lần lượt theo từng biến**: tách bình phương chứa $x$, rồi bình phương chứa $y$, cuối cùng còn bình phương chỉ chứa $z$; tổng ba bình phương bằng $0$ thì từng bình phương bằng $0$.

**Bước 1.** Nhân $2$ vào ngoặc và chuyển hết sang vế trái để vế phải bằng $0$.

**Bước 2.** Hạng tử $-2xy$ chỉ đến từ khai triển $(x-y)^2$; tách bình phương này ra, số hạng $y^2$ lấy từ $2y^2$ nên còn lại một phần của $y^2$.

**Bước 3.** Hạng tử $-4yz$ chỉ đến từ khai triển $(y-2z)^2$; tách tiếp bình phương này, phần $z^2$ lấy từ $5z^2$ nên còn lại một phần của $z^2$.

**Bước 4.** Phần còn lại chỉ chứa $z$ và số tự do; nhận ra đó là bình phương của một hiệu rồi cho ba bình phương cùng bằng $0$, giải từ $z$ ngược lên $y$ rồi $x$.

**Chú ý:** đề chỉ ghi "Tìm $x,\ y$" nhưng có biến $z$ nên ta tìm cả ba biến; nên thay lại bộ ba giá trị vào đề để kiểm.

**Phần 2. Trình bày**

Lưu ý: đề ghi "Tìm $x,\ y$" nhưng biểu thức có thêm biến $z$ nên ta tìm cả $x,\ y,\ z$.

$x^2+2y^2+5z^2+1=2(xy+2yz+z)$

$x^2+2y^2+5z^2+1=2xy+4yz+2z$

$x^2+2y^2+5z^2+1-2xy-4yz-2z=0$

$(x^2-2xy+y^2)+(y^2-4yz+4z^2)+(z^2-2z+1)=0$

$(x-y)^2+(y-2z)^2+(z-1)^2=0$

Vì $(x-y)^2\ge 0$; $(y-2z)^2\ge 0$; $(z-1)^2\ge 0$ với mọi $x,\ y,\ z$ nên tổng bằng $0$ khi và chỉ khi:

$(x-y)^2=0$; $(y-2z)^2=0$; $(z-1)^2=0$

$z-1=0\Rightarrow z=1$

$y-2z=0\Rightarrow y=2z=2$

$x-y=0\Rightarrow x=y=2$

Thử lại: vế trái $=2^2+2\cdot 2^2+5\cdot 1^2+1=18$; vế phải $=2(2\cdot 2+2\cdot 2\cdot 1+1)=18$.

Vậy $x=2$; $y=2$; $z=1$.

### Khác Bài 3 | kho=dai | loai=tra_loi_ngan | dap_an=8
**Đề:** Tìm min của: $A=x^2+5y^2+5z^2-4xy-4yz-4z+12$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết $A$ thành **tổng các bình phương cộng một hằng số**; vì bình phương không âm nên $A$ không nhỏ hơn hằng số đó, và hằng số chính là giá trị nhỏ nhất **nếu** tồn tại $x,\ y,\ z$ làm cả ba bình phương cùng bằng $0$.

**Bước 1.** Hạng tử $-4xy$ chỉ đến từ khai triển $(x-2y)^2$; tách bình phương này ra trước, phần $y^2$ lấy từ $5y^2$ nên chỉ còn một phần của $y^2$.

**Bước 2.** Hạng tử $-4yz$ chỉ đến từ khai triển $(y-2z)^2$; tách tiếp, phần $z^2$ lấy từ $5z^2$ nên chỉ còn một phần của $z^2$.

**Bước 3.** Phần còn lại chỉ chứa $z$ và số tự do; hoàn thành bình phương cho $z$ rồi tính hằng số còn dư.

**Bước 4.** Từ $A\ge$ hằng số, tìm điều kiện để cả ba bình phương bằng $0$ và **kiểm tra có bộ $x,\ y,\ z$ thoả**: giải từ $z$ ngược lên $y$ rồi $x$. Có bộ nghiệm thì mới kết luận hằng số là giá trị nhỏ nhất.

**Chú ý:** chỉ chứng minh $A\ge$ hằng số thì chưa đủ để nói đó là giá trị nhỏ nhất — còn phải chỉ ra dấu "=" thật sự xảy ra.

**Phần 2. Trình bày**

$A=x^2+5y^2+5z^2-4xy-4yz-4z+12$

$A=(x^2-4xy+4y^2)+(y^2-4yz+4z^2)+(z^2-4z+4)+8$

$A=(x-2y)^2+(y-2z)^2+(z-2)^2+8$

Với mọi $x,\ y,\ z$ ta có $(x-2y)^2\ge 0$; $(y-2z)^2\ge 0$; $(z-2)^2\ge 0$ nên $A\ge 8$.

Dấu "=" xảy ra khi và chỉ khi:

$z-2=0\Rightarrow z=2$

$y-2z=0\Rightarrow y=4$

$x-2y=0\Rightarrow x=8$

Bộ $x=8$; $y=4$; $z=2$ thoả mãn nên dấu "=" xảy ra.

Vậy giá trị nhỏ nhất của $A$ là $8$, đạt được khi $x=8$; $y=4$; $z=2$.

### Khác Bài 4 | kho=dai | loai=tra_loi_ngan | dap_an=-27
**Đề:** Tìm GTNN của: $A=5x^2+y^2+2xy-12x-18$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biến $y$ chỉ xuất hiện ở $y^2$ và $2xy$ nên gộp chúng với một phần $x^2$ thành bình phương của một tổng; phần còn lại chỉ chứa $x$ rồi hoàn thành bình phương tiếp.

**Bước 1.** Nhận ra $y^2+2xy$ là hai hạng tử đầu của $(x+y)^2$; tách $(x+y)^2$ ra, lấy $x^2$ từ $5x^2$ nên chỉ còn một phần của $x^2$.

**Bước 2.** Phần còn lại chỉ chứa $x$: hoàn thành bình phương dạng $(2x-a)^2$ bằng cách đối chiếu hệ số của $x^2$ và của $x$.

**Bước 3.** Gom các số tự do đã thêm vào với hằng số $-18$ của đề để được hằng số cuối cùng của biểu thức.

**Bước 4.** Suy ra $A$ không nhỏ hơn hằng số đó; giải hai điều kiện "bình phương bằng $0$" để chỉ ra có $x,\ y$ làm dấu "=" xảy ra, nhờ đó hằng số mới là GTNN.

**Chú ý:** hằng số cuối cùng là số **âm**, đừng nhầm GTNN thành $0$ chỉ vì có các bình phương.

**Phần 2. Trình bày**

$A=5x^2+y^2+2xy-12x-18$

$A=(x^2+2xy+y^2)+(4x^2-12x+9)-27$

$A=(x+y)^2+(2x-3)^2-27$

Với mọi $x,\ y$ ta có $(x+y)^2\ge 0$ và $(2x-3)^2\ge 0$ nên $A\ge -27$.

Dấu "=" xảy ra khi và chỉ khi:

$2x-3=0\Rightarrow x=\dfrac{3}{2}$

$x+y=0\Rightarrow y=-x=-\dfrac{3}{2}$

Cặp $x=\dfrac{3}{2}$; $y=-\dfrac{3}{2}$ tồn tại nên dấu "=" xảy ra.

Vậy giá trị nhỏ nhất của $A$ là $-27$, đạt được khi $x=\dfrac{3}{2}$; $y=-\dfrac{3}{2}$.

### Khác Bài 5 | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm GTNN của: $A=x^2-2xy+2y^2-4y+5$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dùng $x^2-2xy$ làm hai hạng tử đầu của một bình phương chứa cả $x$ và $y$, phần còn lại chỉ chứa $y$ rồi hoàn thành bình phương tiếp; hằng số còn dư là GTNN.

**Bước 1.** Nhận ra $x^2-2xy$ là hai hạng tử đầu của $(x-y)^2$; tách $(x-y)^2$ ra, lấy $y^2$ từ $2y^2$ nên chỉ còn một phần của $y^2$.

**Bước 2.** Phần còn lại chỉ chứa $y$ và số tự do; hoàn thành bình phương cho $y$ bằng cách thêm bình phương của nửa hệ số $-4$.

**Bước 3.** Tính hằng số còn dư sau khi trừ đi các số đã thêm vào, rồi viết $A$ thành tổng hai bình phương cộng hằng số đó.

**Bước 4.** Suy ra $A$ không nhỏ hơn hằng số; giải hai điều kiện "bình phương bằng $0$" bắt đầu từ biến $y$ để chắc chắn tồn tại $x,\ y$ làm dấu "=" xảy ra.

**Chú ý:** phải kiểm tra điều kiện dấu "=" có nghiệm; nếu hai điều kiện mâu thuẫn nhau thì hằng số chưa phải GTNN.

**Phần 2. Trình bày**

$A=x^2-2xy+2y^2-4y+5$

$A=(x^2-2xy+y^2)+(y^2-4y+4)+1$

$A=(x-y)^2+(y-2)^2+1$

Với mọi $x,\ y$ ta có $(x-y)^2\ge 0$ và $(y-2)^2\ge 0$ nên $A\ge 1$.

Dấu "=" xảy ra khi và chỉ khi:

$y-2=0\Rightarrow y=2$

$x-y=0\Rightarrow x=y=2$

Cặp $x=2$; $y=2$ tồn tại nên dấu "=" xảy ra.

Vậy giá trị nhỏ nhất của $A$ là $1$, đạt được khi $x=2$; $y=2$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Phần nâng cao 8 bài, toàn bộ giải bằng hoàn thành bình phương dạng $(a\pm b)^2$ và tính chất "bình phương của số thực không âm" (lớp 7); không dùng công thức nghiệm, Δ, bất đẳng thức Cauchy hay hằng đẳng thức nào ngoài $(a\pm b)^2$. Kiểm bằng script `tam\kiem_p5.mjs` (đồng nhất thức bằng phân số BigInt trên lưới 5×5×5 + vét lưới bước 1/2 cho nghiệm và giá trị nhỏ nhất): mọi đồng nhất thức đúng; Bài 2a–2c, 3, 4, 5 có đúng một điểm làm dấu "=" xảy ra trên lưới.
- **Khác Bài 1a:** lệnh chung của Bài 1 ghi $x,\ y,\ z$ nhưng biểu thức ý a chỉ có $x,\ y$ — chứng minh theo $x,\ y$, kết luận có nói "$z$ bất kì". Vế trái $\ge 1$, không bằng $0$.
- **Khác Bài 2c:** đề sai/thiếu lệnh ("Tìm $x,\ y$" nhưng có biến $z$) — đã ghi ở Ghi chú và dòng "Lưu ý" đầu Phần 2; đáp số $x=2$; $y=2$; $z=1$.
- **Khác Bài 3, 4, 5** cho `loai=tra_loi_ngan` vì đề hỏi giá trị nhỏ nhất là MỘT số nguyên ($8$; $-27$; $1$); ô trả lời ngắn có dấu `-` đầu cho $-27$. Phần 2 vẫn nêu đủ điểm đạt GTNN và kiểm tồn tại.
- Không có câu nào cần `Chưa chắc`; ảnh đề ($t$-4.png) đọc rõ, đối chiếu khớp khung.
