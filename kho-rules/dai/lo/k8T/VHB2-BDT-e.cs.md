=== V2V.103@p53
- bai: 103 · y: - · trang: 53 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đưa về bình phương cộng hằng số · hai điều kiện của GTNN
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=2$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: A không nhỏ hơn 2, A(2)=2; khớp sách. Sách (phần lý thuyết ngay trên) dùng bài này làm mẫu cho hai điều kiện của GTNN.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=(x-1)^2+(x-3)^2$.
## SACH
Ta có $A=x^2-2x+1+x^2-6x+9=2(x^2-4x+5)=2(x-2)^2+2\ge2$.

$A=2\Leftrightarrow x-2=0\Leftrightarrow x=2$.

Vậy $\min A=2$ khi và chỉ khi $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai bình phương cùng một biến cộng lại thành một tam thức bậc hai có hệ số cao nhất dương, nên đưa được về dạng (số)·(bình phương) cộng hằng số; chỉ cần "A lớn hơn hoặc bằng 0" là chưa đủ vì không có $x$ nào làm $A=0$.

**Bước 1.** Khai triển hai bình phương rồi cộng lại để được một tam thức bậc hai theo $x$.

**Bước 2.** Đặt hệ số của $x^2$ làm nhân tử chung và tách hạng tử bậc nhất để lập được một bình phương dạng $(x-m)^2$ cộng với một hằng số.

**Bước 3.** Từ $(x-m)^2\ge0$ suy ra bất đẳng thức $A\ge$ hằng số đúng với mọi $x$, rồi chỉ ra giá trị $x$ làm dấu "=" xảy ra để đủ hai điều kiện của giá trị nhỏ nhất.

**Chú ý:** Có thể đổi biến $y=x-2$ (trung điểm của $1$ và $3$) thì $A=(y+1)^2+(y-1)^2=2y^2+2$, hạng tử bậc nhất tự triệt tiêu.

**Phần 2. Trình bày**

$A=(x-1)^2+(x-3)^2=x^2-2x+1+x^2-6x+9$

$=2x^2-8x+10$

$=2(x-2)^2+2$

Vì $(x-2)^2\ge0$ với mọi $x$ nên $A\ge2$ với mọi $x$.

Dấu "=" xảy ra khi $x-2=0$, tức $x=2$; khi đó $A=1+1=2$.

Vậy $GTNN$ của $A$ bằng $2$, đạt khi $x=2$.

=== V2V.104a@p54
- bai: 104 · y: a · trang: 54 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tam thức bậc hai: đưa về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: -7
- dap_an: $GTNN=-7$ khi $x=2$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: A không nhỏ hơn -7, A(2)=-7; khớp sách.
## DE
Tìm GTNN của $A=2x^2-8x+1$.
## SACH
$A=2x^2-8x+1=2(x^2-4x+4)-7=2(x-2)^2-7\ge-7$.

$\min A=-7$ khi và chỉ khi $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai có hệ số của $x^2$ dương thì có giá trị nhỏ nhất; ta đưa nó về dạng $2(x-m)^2+k$ để đọc ra giá trị nhỏ nhất.

**Bước 1.** Đặt hệ số $2$ làm nhân tử chung của hai hạng tử chứa $x$ để dạng $x^2-4x$ lộ ra.

**Bước 2.** Thêm và bớt hằng số thích hợp để $x^2-4x$ trở thành bình phương một hiệu, hằng số còn lại gộp riêng ra ngoài.

**Bước 3.** Dùng bình phương không âm để chặn $A$ từ dưới, rồi chỉ ra $x$ làm dấu "=" xảy ra.

**Chú ý:** Khi thêm vào trong ngoặc một số thì phải bớt ra ngoài số đó nhân với hệ số đứng trước ngoặc, tránh sai hằng số.

**Phần 2. Trình bày**

$A=2x^2-8x+1=2(x^2-4x+4)-8+1$

$=2(x-2)^2-7$

Vì $(x-2)^2\ge0$ với mọi $x$ nên $A\ge-7$ với mọi $x$.

Dấu "=" xảy ra khi $x-2=0$, tức $x=2$; khi đó $A=2\cdot4-16+1=-7$.

Vậy $GTNN$ của $A$ bằng $-7$, đạt khi $x=2$.

=== V2V.104b@p54
- bai: 104 · y: b · trang: 54 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tam thức bậc hai: đưa về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{9}{5}
- dap_an: $GTLN=\dfrac{9}{5}$ khi $x=-\dfrac{2}{5}$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: B không vượt quá 9/5, B(-2/5)=9/5 (tính bằng phân số); khớp sách.
## DE
Tìm GTLN của $B=-5x^2-4x+1$.
## SACH
$B=-5x^2-4x+1=-5\left(x^2+\dfrac{4}{5}x+\dfrac{4}{25}\right)+\dfrac{9}{5}=-5\left(x+\dfrac{2}{5}\right)^2+\dfrac{9}{5}\le\dfrac{9}{5}$.

$\max B=\dfrac{9}{5}$ khi và chỉ khi $x=-\dfrac{2}{5}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số của $x^2$ âm nên $B$ có giá trị lớn nhất chứ không có giá trị nhỏ nhất; đưa $B$ về dạng $-5(x+m)^2+k$ thì $-5(x+m)^2\le0$ chặn $B$ từ trên.

**Bước 1.** Đặt $-5$ làm nhân tử chung của hai hạng tử chứa $x$ để dạng $x^2+\dfrac{4}{5}x$ lộ ra.

**Bước 2.** Thêm bình phương của nửa hệ số bậc nhất để lập $\left(x+\dfrac{2}{5}\right)^2$, đồng thời bù lại hằng số ở ngoài ngoặc.

**Bước 3.** Chặn $B$ từ trên nhờ $-5\left(x+\dfrac{2}{5}\right)^2\le0$ và chỉ ra $x$ làm dấu "=" xảy ra.

**Chú ý:** Bài có hệ số âm: bình phương nhân với số âm cho một số không dương, nên cực trị là GTLN; đừng viết nhầm là GTNN.

**Phần 2. Trình bày**

$B=-5x^2-4x+1=-5\left(x^2+\dfrac{4}{5}x+\dfrac{4}{25}\right)+\dfrac{4}{5}+1$

$=-5\left(x+\dfrac{2}{5}\right)^2+\dfrac{9}{5}$

Vì $\left(x+\dfrac{2}{5}\right)^2\ge0$ nên $-5\left(x+\dfrac{2}{5}\right)^2\le0$, suy ra $B\le\dfrac{9}{5}$ với mọi $x$.

Dấu "=" xảy ra khi $x+\dfrac{2}{5}=0$, tức $x=-\dfrac{2}{5}$.

Vậy $GTLN$ của $B$ bằng $\dfrac{9}{5}$, đạt khi $x=-\dfrac{2}{5}$.

=== V2V.104c@p54
- bai: 104 · y: c · trang: 54 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tam thức bậc hai tổng quát: đưa về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: c-\dfrac{b^2}{4a}
- dap_an: Nếu $a>0$: $GTNN=c-\dfrac{b^2}{4a}$ khi $x=-\dfrac{b}{2a}$; nếu $a<0$: $GTLN=c-\dfrac{b^2}{4a}$ khi $x=-\dfrac{b}{2a}$
- ghi_chu_nghi: Máy kiểm 100.000 bộ (a,b,c,x) ngẫu nhiên cả a>0 lẫn a<0: bất đẳng thức đúng, khớp sách.
## DE
Cho tam thức bậc hai $P=ax^2+bx+c$ (với $a\ne0$). Tìm GTNN của $P$ nếu $a>0$. Tìm GTLN của $P$ nếu $a<0$.
## SACH
$P=ax^2+bx+c=a\left(x^2+\dfrac{b}{a}x\right)+c=a\left(x+\dfrac{b}{2a}\right)^2+c-\dfrac{b^2}{4a}$.

Đặt $c-\dfrac{b^2}{4a}=k$. Do $\left(x+\dfrac{b}{2a}\right)^2\ge0$ nên:

- Nếu $a>0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\ge0$, do đó $P\ge k$; $\min P=k$ khi và chỉ khi $x=-\dfrac{b}{2a}$;

- Nếu $a<0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\le0$, do đó $P\le k$; $\max P=k$ khi và chỉ khi $x=-\dfrac{b}{2a}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cách làm ở hai câu số cụ thể (đặt hệ số $a$ ra ngoài rồi lập bình phương) chạy với chữ $a,b,c$; dấu của $a$ quyết định bình phương nhân $a$ không âm (có GTNN) hay không dương (có GTLN).

**Bước 1.** Đặt $a$ làm nhân tử chung của $ax^2+bx$ rồi thêm bớt $\dfrac{b^2}{4a^2}$ để lập bình phương $\left(x+\dfrac{b}{2a}\right)^2$, phần hằng số còn lại gom thành một số $k$ không phụ thuộc $x$.

**Bước 2.** Với $a>0$, dùng $a\left(x+\dfrac{b}{2a}\right)^2\ge0$ để chặn $P$ từ dưới bởi $k$ và tìm $x$ làm dấu "=" xảy ra.

**Bước 3.** Với $a<0$, dùng $a\left(x+\dfrac{b}{2a}\right)^2\le0$ để chặn $P$ từ trên bởi $k$, cùng giá trị $x$ làm dấu "=" xảy ra.

**Chú ý:** Kết quả này (đỉnh có hoành độ $-\dfrac{b}{2a}$) dùng nhanh cho mọi tam thức bậc hai, nhưng khi thi vẫn nên viết đủ bước đưa về bình phương như hai câu trên.

**Phần 2. Trình bày**

$P=ax^2+bx+c=a\left(x^2+\dfrac{b}{a}x+\dfrac{b^2}{4a^2}\right)+c-\dfrac{b^2}{4a}$

$=a\left(x+\dfrac{b}{2a}\right)^2+k$ với $k=c-\dfrac{b^2}{4a}$.

Vì $\left(x+\dfrac{b}{2a}\right)^2\ge0$ với mọi $x$ nên:

Nếu $a>0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\ge0$, suy ra $P\ge k$ với mọi $x$. Dấu "=" xảy ra khi $x+\dfrac{b}{2a}=0$, tức $x=-\dfrac{b}{2a}$. Vậy $GTNN$ của $P$ bằng $k=c-\dfrac{b^2}{4a}$, đạt khi $x=-\dfrac{b}{2a}$.

Nếu $a<0$ thì $a\left(x+\dfrac{b}{2a}\right)^2\le0$, suy ra $P\le k$ với mọi $x$. Dấu "=" xảy ra khi $x=-\dfrac{b}{2a}$. Vậy $GTLN$ của $P$ bằng $k=c-\dfrac{b^2}{4a}$, đạt khi $x=-\dfrac{b}{2a}$.

=== V2V.105@p55
- bai: 105 · y: - · trang: 55 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: ghép cặp nhân tử · đặt ẩn phụ y=x²-7x+6
- kiem: khong
- ket_qua_sach: -36
- dap_an: $GTNN=-36$ khi $x=1$ hoặc $x=6$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: A không nhỏ hơn -36, A(1)=A(6)=-36; khớp sách. Sách in thiếu bước ghép cặp (x(x-7) và (x-3)(x-4)); đã nêu đủ trong GIAI.
## DE
Tìm GTNN của $A=x(x-3)(x-4)(x-7)$.
## SACH
$A=(x^2-7x)(x^2-7x+12)$.

Đặt $x^2-7x+6=y$ thì $A=(y-6)(y+6)=y^2-36\ge-36$.

$\min A=-36\Leftrightarrow y=0\Leftrightarrow x^2-7x+6=0\Leftrightarrow x_1=1;\ x_2=6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng các số trong hai cặp $0+7$ và $3+4$ bằng nhau nên ghép $x$ với $x-7$ và $x-3$ với $x-4$ thì hai tích cùng chứa $x^2-7x$; đặt ẩn phụ là số "ở giữa" hai nhân tử đó thì biểu thức thành hiệu hai bình phương.

**Bước 1.** Ghép các nhân tử thành hai cặp có tổng hằng số bằng nhau, nhân từng cặp để được hai tam thức cùng chứa $x^2-7x$.

**Bước 2.** Đặt $y$ bằng trung bình cộng của hai tam thức đó thì chúng thành $y-6$ và $y+6$, biểu thức trở thành $y^2-36$.

**Bước 3.** Dùng $y^2\ge0$ để chặn từ dưới, rồi giải $y=0$ để tìm các giá trị $x$ làm dấu "=" xảy ra (phải kiểm $y=0$ có $x$ thật tương ứng).

**Chú ý:** Bài này có hai giá trị $x$ cùng đạt cực trị; đáp án phải nêu đủ cả hai.

**Phần 2. Trình bày**

$A=x(x-3)(x-4)(x-7)=[x(x-7)][(x-3)(x-4)]=(x^2-7x)(x^2-7x+12)$

Đặt $y=x^2-7x+6$ thì $A=(y-6)(y+6)=y^2-36$

Vì $y^2\ge0$ nên $A\ge-36$ với mọi $x$.

Dấu "=" xảy ra khi $y=0$, tức $x^2-7x+6=0$, hay $(x-1)(x-6)=0$, vậy $x=1$ hoặc $x=6$. Kiểm tra: $A(1)=1\cdot(-2)\cdot(-3)\cdot(-6)=-36$ và $A(6)=6\cdot3\cdot2\cdot(-1)=-36$.

Vậy $GTNN$ của $A$ bằng $-36$, đạt khi $x=1$ hoặc $x=6$.

=== V2V.106@p55
- bai: 106 · y: - · trang: 55 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phân thức tử hằng, mẫu tam thức bậc hai · đổi chiều bất đẳng thức khi nghịch đảo (hai vế cùng dấu)
- kiem: khong
- ket_qua_sach: -\dfrac{1}{2}
- dap_an: $GTNN=-\dfrac{1}{2}$ khi $x=\dfrac{1}{3}$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: A không nhỏ hơn -1/2, A(1/3)=-1/2 (phân số); khớp sách.
## DE
Tìm GTNN của $A=\dfrac{2}{6x-5-9x^2}$.
## SACH
$A=\dfrac{-2}{9x^2-6x+5}=\dfrac{-2}{(3x-1)^2+4}$.

Ta thấy $(3x-1)^2\ge0$ nên $(3x-1)^2+4\ge4$. Do đó $\dfrac{1}{(3x-1)^2+4}\le\dfrac{1}{4}$ (theo tính chất $a\ge b$ thì $\dfrac{1}{a}\le\dfrac{1}{b}$ với $a$ và $b$ cùng dấu) $\Rightarrow\dfrac{-2}{(3x-1)^2+4}\ge\dfrac{-2}{4}\Rightarrow A\ge-\dfrac{1}{2}$.

$\min A=-\dfrac{1}{2}\Leftrightarrow3x-1=0\Leftrightarrow x=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là hằng số, mẫu là tam thức bậc hai nên cực trị của $A$ do mẫu quyết định; đưa mẫu về dạng bình phương cộng hằng số để biết mẫu bị chặn bởi bao nhiêu, rồi lật bất đẳng thức qua nghịch đảo.

**Bước 1.** Đổi dấu cả tử và mẫu để hệ số của $x^2$ ở mẫu dương, rồi viết mẫu thành bình phương cộng hằng số; mẫu luôn dương nên $A$ xác định với mọi $x$.

**Bước 2.** Từ bình phương không âm suy ra mẫu lớn hơn hoặc bằng một số dương, rồi lấy nghịch đảo (hai vế cùng dương nên đổi chiều bất đẳng thức).

**Bước 3.** Nhân với $-2$ (đổi chiều lần nữa) để chặn $A$ từ dưới và chỉ ra $x$ làm dấu "=" xảy ra.

**Chú ý:** Có hai lần đổi chiều bất đẳng thức (nghịch đảo, rồi nhân số âm); đếm đủ hai lần mới ra đúng chiều.

**Phần 2. Trình bày**

$A=\dfrac{2}{6x-5-9x^2}=\dfrac{-2}{9x^2-6x+5}=\dfrac{-2}{(3x-1)^2+4}$

Vì $(3x-1)^2\ge0$ nên $(3x-1)^2+4\ge4>0$ (mẫu khác $0$ với mọi $x$).

Do hai vế cùng dương nên $\dfrac{1}{(3x-1)^2+4}\le\dfrac{1}{4}$

Nhân hai vế với $-2<0$: $A=\dfrac{-2}{(3x-1)^2+4}\ge-\dfrac{2}{4}=-\dfrac{1}{2}$

Dấu "=" xảy ra khi $3x-1=0$, tức $x=\dfrac{1}{3}$.

Vậy $GTNN$ của $A$ bằng $-\dfrac{1}{2}$, đạt khi $x=\dfrac{1}{3}$.

=== V2V.107@p56
- bai: 107 · y: - · trang: 56 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách phân thức thành hằng số cộng bình phương chia bình phương · đồng nhất hệ số · (cách của sách) đặt ẩn phụ y=x-1, z=1/y
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=2$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên (x khác 1): A không nhỏ hơn 2, A(2)=2; khớp sách. GIAI theo Cách 2 của sách; Cách 1 nhắc ở Chú ý.
## DE
Tìm GTNN của $A=\dfrac{3x^2-8x+6}{x^2-2x+1}$.
## SACH
Cách 1. Đặt $x-1=y$ thì $x=y+1$. Ta có:

$A=\dfrac{3(y+1)^2-8(y+1)+6}{y^2}=\dfrac{3y^2-2y+1}{y^2}=3-\dfrac{2}{y}+\dfrac{1}{y^2}$.

Lại đặt $\dfrac{1}{y}=z$ thì $A=3-2z+z^2=(z-1)^2+2\ge2$.

$\min A=2\Leftrightarrow z=1\Leftrightarrow y=1\Leftrightarrow\dfrac{1}{x-1}=1\Leftrightarrow x=2$.

Cách 2. Viết $A$ dưới dạng tổng của $2$ với một biểu thức không âm:

$A=\dfrac{(2x^2-4x+2)+(x^2-4x+4)}{x^2-2x+1}=2+\dfrac{(x-2)^2}{(x-1)^2}\ge2$.

$\min A=2$ khi và chỉ khi $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là bình phương $(x-1)^2$ và tử cùng bậc hai nên viết được $A$ thành "một hằng số cộng một bình phương chia cho $(x-1)^2$", phần sau không âm cho ta chặn dưới.

**Bước 1.** Tìm các số $k$ và $m$ sao cho tử bằng $k(x-1)^2+(x-m)^2$ bằng cách so sánh hệ số của $x^2$, của $x$ rồi kiểm tra hệ số tự do.

**Bước 2.** Tách phân thức thành hằng số $k$ cộng với $\dfrac{(x-m)^2}{(x-1)^2}$ (nhớ điều kiện $x\ne1$ để phân thức có nghĩa).

**Bước 3.** Chặn dưới bằng $\dfrac{(x-m)^2}{(x-1)^2}\ge0$, rồi chỉ ra $x$ thỏa điều kiện xác định để dấu "=" xảy ra.

**Chú ý:** Cách khác: đặt $y=x-1$ rồi $z=\dfrac{1}{y}$, khi đó $A=z^2-2z+3=(z-1)^2+2$; đừng quên đổi ngược về $x$ ở cuối.

**Phần 2. Trình bày**

Điều kiện: $x\ne1$ (khi đó mẫu $(x-1)^2>0$).

$A=\dfrac{3x^2-8x+6}{x^2-2x+1}=\dfrac{(2x^2-4x+2)+(x^2-4x+4)}{(x-1)^2}$

$=2+\dfrac{(x-2)^2}{(x-1)^2}$

Vì $(x-2)^2\ge0$ và $(x-1)^2>0$ nên $\dfrac{(x-2)^2}{(x-1)^2}\ge0$, suy ra $A\ge2$ với mọi $x\ne1$.

Dấu "=" xảy ra khi $x-2=0$, tức $x=2$ (thỏa $x\ne1$); khi đó $A=\dfrac{12-16+6}{1}=2$.

Vậy $GTNN$ của $A$ bằng $2$, đạt khi $x=2$.

=== V2V.108@p56
- bai: 108 · y: - · trang: 56 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách tử để A+k, k-A có tử là bình phương · phân thức dạng khác (tử bậc nhất, mẫu x²+1)
- kiem: khong
- ket_qua_sach: -1; 4
- dap_an: $GTNN=-1$ khi $x=2$; $GTLN=4$ khi $x=-\dfrac{1}{2}$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: -1 ≤ A ≤ 4, A(2)=-1, A(-1/2)=4 (phân số); khớp sách.
## DE
Tìm GTNN và GTLN của $A=\dfrac{3-4x}{x^2+1}$.
## SACH
Để tìm GTNN, viết $A$ dưới dạng:

$A=\dfrac{x^2-4x+4-x^2-1}{x^2+1}=\dfrac{(x-2)^2}{x^2+1}-1\ge-1$

$\min A=-1$ khi và chỉ khi $x=2$.

Để tìm GTLN, viết $A$ dưới dạng:

$A=\dfrac{4x^2+4-4x^2-4x-1}{x^2+1}=4-\dfrac{(2x+1)^2}{x^2+1}\le4$.

$\max A=4$ khi và chỉ khi $x=-\dfrac{1}{2}$.

Chú ý: Lời giải trên tuy gọn, song cách viết biểu thức $A$ dưới các dạng trên có phần thiếu tự nhiên. Trong trường hợp phân thức có mẫu là đa thức bậc hai và tử có bậc không quá hai như ở ví dụ 108, ta có một phương pháp xác định được giá trị nhỏ nhất và giá trị lớn nhất của biểu thức (nếu có). Đó là phương pháp tìm miền giá trị của hàm số. Phương pháp này được trình bày trong cuốn Nâng cao và phát triển Toán 9 tập hai.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2+1$ luôn dương, nên $A\ge m$ tương đương tử của $A-m$ không âm; ta tìm hằng số $m$ sao cho tử của $A-m$ (hoặc của $m-A$) là bình phương của một nhị thức, khi đó dấu "=" xảy ra ở nghiệm của nhị thức ấy.

**Bước 1.** Với GTNN, xét $A+k$ có tử $3-4x+k(x^2+1)$ là tam thức bậc hai; muốn nó là bình phương một nhị thức thì bình phương hệ số của $x$ phải bằng $4$ lần tích hệ số đầu và hệ số cuối, điều kiện này cho phương trình để tìm $k$.

**Bước 2.** Viết $A+k$ thành bình phương chia cho $x^2+1$ để được $A\ge-k$, rồi tìm $x$ làm bình phương bằng $0$.

**Bước 3.** Với GTLN, xét $k-A$ với giá trị $k$ còn lại của phương trình trên, viết nó thành bình phương chia $x^2+1$ để được $A\le k$ và tìm $x$ làm dấu "=" xảy ra.

**Chú ý:** Hai chặn (dưới và trên) làm riêng, mỗi chặn có giá trị $x$ đạt dấu "=" riêng; sách còn nêu cách "tìm miền giá trị" (học ở lớp 9), không dùng ở đây.

**Phần 2. Trình bày**

Vì $x^2+1>0$ với mọi $x$ nên $A$ xác định với mọi $x$.

Tìm GTNN: $A+1=\dfrac{3-4x+x^2+1}{x^2+1}=\dfrac{(x-2)^2}{x^2+1}\ge0$, suy ra $A\ge-1$ với mọi $x$. Dấu "=" xảy ra khi $x-2=0$, tức $x=2$.

Tìm GTLN: $4-A=\dfrac{4x^2+4-3+4x}{x^2+1}=\dfrac{(2x+1)^2}{x^2+1}\ge0$, suy ra $A\le4$ với mọi $x$. Dấu "=" xảy ra khi $2x+1=0$, tức $x=-\dfrac{1}{2}$.

Vậy $GTNN$ của $A$ bằng $-1$, đạt khi $x=2$; $GTLN$ của $A$ bằng $4$, đạt khi $x=-\dfrac{1}{2}$.

=== V2V.109@p57
- bai: 109 · y: - · trang: 57 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x³+y³=(x+y)(x²-xy+y²) · thế y=1-x về tam thức bậc hai · (cách khác của sách) (x-y)²≥0 và đổi biến x=1/2+a
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTNN=\dfrac{1}{2}$ khi $x=y=\dfrac{1}{2}$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên với y=1-x: A không nhỏ hơn 1/2, A(1/2,1/2)=1/2 (phân số); khớp sách. GIAI theo Cách 1; Cách 2, 3 nhắc ở Chú ý.
## DE
Tìm GTNN của $A=x^3+y^3+xy$ biết rằng $x+y=1$.
## SACH
Sử dụng điều kiện đã cho để rút gọn biểu thức $A$:

$A=(x+y)(x^2-xy+y^2)+xy=x^2-xy+y^2+xy=x^2+y^2$.

Đến đây có nhiều cách giải:

Cách 1. Biểu thị $y$ theo $x$ rồi đưa về tam thức bậc hai đối với $x$:

Thay $y=1-x$ vào biểu thức $A$:

$A=x^2+(1-x)^2=2(x^2-x)+1=2\left(x-\dfrac{1}{2}\right)^2+\dfrac{1}{2}\ge\dfrac{1}{2}$.

$\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\dfrac{1}{2},\ y=\dfrac{1}{2}$.

Cách 2. Sử dụng điều kiện đã cho làm xuất hiện một biểu thức mới có chứa $A$:

$x+y=1\Rightarrow x^2+2xy+y^2=1$ (1)

Mặt khác $(x-y)^2\ge0\Rightarrow x^2-2xy+y^2\ge0$ (2)

Cộng (1) với (2): $2(x^2+y^2)\ge1\Rightarrow x^2+y^2\ge\dfrac{1}{2}$.

$\min A=\dfrac{1}{2}$ khi và chỉ khi $x=y=\dfrac{1}{2}$.

Cách 3. Sử dụng điều kiện đã cho để đưa vào một biến mới:

Đặt $x=\dfrac{1}{2}+a$ thì $y=\dfrac{1}{2}-a$. Biểu thị $x^2+y^2$ theo $a$, ta được:

$x^2+y^2=\left(\dfrac{1}{2}+a\right)^2+\left(\dfrac{1}{2}-a\right)^2=\dfrac{1}{2}+2a^2\ge\dfrac{1}{2}$.

$\min A=\dfrac{1}{2}\Leftrightarrow a=0\Leftrightarrow x=y=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y=1$ xuất hiện đúng trong hằng đẳng thức $x^3+y^3=(x+y)(x^2-xy+y^2)$ nên dùng nó để rút gọn $A$ về $x^2+y^2$, rồi dùng điều kiện lần nữa để còn một biến.

**Bước 1.** Phân tích $x^3+y^3$ thành $(x+y)(x^2-xy+y^2)$ và thay $x+y=1$ để hạng tử $-xy$ triệt tiêu với $+xy$, $A$ rút thành $x^2+y^2$.

**Bước 2.** Thế $y=1-x$ vào để $A$ chỉ còn biến $x$ và là một tam thức bậc hai.

**Bước 3.** Đưa tam thức về bình phương cộng hằng số, chặn dưới bằng bình phương không âm, rồi tìm $x$ và $y$ làm dấu "=" xảy ra.

**Chú ý:** Cách khác: cộng $(x+y)^2=1$ với $(x-y)^2\ge0$ được $2(x^2+y^2)\ge1$; hoặc đặt $x=\dfrac{1}{2}+a$, $y=\dfrac{1}{2}-a$ để $x^2+y^2=\dfrac{1}{2}+2a^2$.

**Phần 2. Trình bày**

$A=x^3+y^3+xy=(x+y)(x^2-xy+y^2)+xy$

$=x^2-xy+y^2+xy=x^2+y^2$ (vì $x+y=1$)

Thay $y=1-x$: $A=x^2+(1-x)^2=2x^2-2x+1$

$=2\left(x-\dfrac{1}{2}\right)^2+\dfrac{1}{2}$

Vì $\left(x-\dfrac{1}{2}\right)^2\ge0$ nên $A\ge\dfrac{1}{2}$ với mọi $x$ (và $y=1-x$).

Dấu "=" xảy ra khi $x=\dfrac{1}{2}$, khi đó $y=1-\dfrac{1}{2}=\dfrac{1}{2}$.

Vậy $GTNN$ của $A$ bằng $\dfrac{1}{2}$, đạt khi $x=y=\dfrac{1}{2}$.

=== V2V.110@p58
- bai: 110 · y: - · trang: 58 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bình phương điều kiện A+2B=9 · A≥B từ (x-y)²+(y-z)²+(z-x)²≥0 · GTNN/GTLN có điều kiện
- kiem: khong
- ket_qua_sach: 3; 3; 6
- dap_an: a) $GTNN=3$; b) $GTLN=3$; c) $GTNN=6$; cả ba câu đạt khi $x=y=z=1$
- ghi_chu_nghi: Máy kiểm 100.000 bộ (x,y,z) ngẫu nhiên có x+y+z=3: A ≥ 3, B ≤ 3, A+B ≥ 6; khớp sách. Giữ cả bài một câu vì câu b dùng (1),(2) của câu a và câu c dùng câu b.
## DE
Cho $x+y+z=3$.

a) Tìm GTNN của $A=x^2+y^2+z^2$.

b) Tìm GTLN của $B=xy+yz+zx$.

c) Tìm GTNN của $A+B$.
## SACH
Bình phương hai vế của đẳng thức $x+y+z=3$, ta được:

$x^2+y^2+z^2+2(xy+yz+zx)=9$ (1)

tức là $A+2B=9$.

Dễ dàng chứng minh được: $A\ge B$ (2) xảy ra đẳng thức khi và chỉ khi $x=y=z$.

a) Từ (1) và (2) suy ra $3A\ge A+2B=9$, nên $A\ge3$. Do đó $\min A=3$ khi và chỉ khi $x=y=z=1$.

Chú ý: Có thể giải câu a bằng cách đổi biến: đặt $x=1+a$, $y=1+b$, $z=1+c$ rồi xét $x^2+y^2+z^2$.

b) Từ (1) và (2) suy ra $3B\le A+2B=9$, nên $B\le3$. Do đó $\max B=3$ khi và chỉ khi $x=y=z=1$.

Chú ý: Có thể giải câu b dựa vào câu a: vì $A+2B=9$ nên $B$ lớn nhất $\Leftrightarrow$ $A$ nhỏ nhất.

c) Ta có $A+2B=9$ mà $B\le3$ (câu b) nên $A+B\ge6$. Do đó $\min(A+B)=6$ khi và chỉ khi $x=y=z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y+z=3$ chỉ chứa tổng, còn $A$ và $B$ là các biểu thức bậc hai, nên bình phương điều kiện để nối $A$ với $B$ bằng đẳng thức $A+2B=9$; thêm một bất đẳng thức giữa $A$ và $B$ thì tìm được cả ba cực trị.

**Bước 1.** Bình phương hai vế của $x+y+z=3$ để có $A+2B=9$, đây là liên hệ cố định giữa $A$ và $B$.

**Bước 2.** Chứng minh $A\ge B$ bằng cách viết $A-B$ thành một nửa tổng ba bình phương $(x-y)^2$, $(y-z)^2$, $(z-x)^2$, dấu "=" xảy ra khi ba số bằng nhau.

**Bước 3.** Câu a: thay $B\le A$ vào $A+2B=9$ để chặn $A$ từ dưới, rồi chỉ ra bộ số cho dấu "=".

**Bước 4.** Câu b: thay $A\ge B$ vào $A+2B=9$ theo chiều ngược lại để chặn $B$ từ trên, dấu "=" cùng điều kiện $x=y=z$.

**Bước 5.** Câu c: dùng $A+2B=9$ để viết $A+B$ chỉ theo $B$, rồi dùng chặn của câu b.

**Chú ý:** Cả ba câu đạt cực trị tại cùng một điểm $x=y=z$; phải kiểm điểm đó thỏa điều kiện $x+y+z=3$ (ra $x=y=z=1$).

**Phần 2. Trình bày**

Bình phương hai vế $x+y+z=3$: $x^2+y^2+z^2+2(xy+yz+zx)=9$, tức $A+2B=9$ (1).

Mặt khác $A-B=x^2+y^2+z^2-xy-yz-zx=\dfrac{1}{2}\left[(x-y)^2+(y-z)^2+(z-x)^2\right]\ge0$ nên $A\ge B$ (2), dấu "=" xảy ra khi $x=y=z$.

a) Từ (1), (2): $9=A+2B\le A+2A=3A$, suy ra $A\ge3$. Dấu "=" xảy ra khi $x=y=z$ và $x+y+z=3$, tức $x=y=z=1$. Vậy $GTNN$ của $A$ bằng $3$, đạt khi $x=y=z=1$.

b) Từ (1), (2): $9=A+2B\ge B+2B=3B$, suy ra $B\le3$. Dấu "=" xảy ra khi $x=y=z=1$ (khi đó $B=3$). Vậy $GTLN$ của $B$ bằng $3$, đạt khi $x=y=z=1$.

c) Từ (1): $A=9-2B$, nên $A+B=9-B$. Vì $B\le3$ nên $A+B\ge9-3=6$. Dấu "=" xảy ra khi $B=3$, tức $x=y=z=1$. Vậy $GTNN$ của $A+B$ bằng $6$, đạt khi $x=y=z=1$.

=== V2V.111a@p58
- bai: 111 · y: a · trang: 58 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét dấu một tích (bảng xét dấu) · đưa bất đẳng thức bậc hai về tích (A+1)(A-2)≤0
- kiem: khong
- ket_qua_sach: -1; 2
- dap_an: $GTNN=-1$ khi $A=-1$; $GTLN=2$ khi $A=2$
- ghi_chu_nghi: Máy kiểm 100.000 số thực ngẫu nhiên: mọi A thỏa A(A-1) ≤ 2 đều nằm trong [-1; 2], và A=-1, A=2 thỏa điều kiện; khớp sách.
## DE
Tìm GTNN và GTLN của biểu thức $A$, biết rằng $A(A-1)\le2$.
## SACH
Ta dùng phương pháp xét dấu một tích để tìm GTNN, GTLN của $A$:

Biến đổi: $A(A-1)\le2\Leftrightarrow A^2-A-2\le0\Leftrightarrow(A+1)(A-2)\le0$.

Lập bảng xét dấu (các mốc $-1$ và $2$):

| $A$ | | $-1$ | | $2$ | |
|---|---|---|---|---|---|
| $A+1$ | $-$ | $0$ | $+$ | | $+$ |
| $A-2$ | $-$ | | $-$ | $0$ | $+$ |
| $(A+1)(A-2)$ | $+$ | $0$ | $-$ | $0$ | $+$ |

Do đó $-1\le A\le2$; $\min A=-1$; $\max A=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện chỉ nói về chính $A$ (không có biến nào khác) nên chỉ cần giải bất phương trình bậc hai ẩn $A$; đưa về tích hai nhân tử rồi xét dấu để biết $A$ nằm trong khoảng nào.

**Bước 1.** Chuyển vế để vế phải bằng $0$ và phân tích tam thức bậc hai theo $A$ thành tích hai nhân tử bậc nhất.

**Bước 2.** Xét dấu tích hai nhân tử: tích không dương thì hai nhân tử trái dấu hoặc có một nhân tử bằng $0$; vì $A+1$ luôn lớn hơn $A-2$ nên chỉ có thể $A+1\ge0$ và $A-2\le0$.

**Bước 3.** Từ khoảng của $A$ suy ra GTNN và GTLN, rồi kiểm tra hai đầu mút thật sự thỏa điều kiện đề cho.

**Chú ý:** Đầu mút $A=-1$, $A=2$ làm tích bằng $0$, thỏa dấu "$\le$" nên đạt được; nếu điều kiện là "$<$" thì không có GTNN, GTLN.

**Phần 2. Trình bày**

$A(A-1)\le2\Leftrightarrow A^2-A-2\le0\Leftrightarrow(A+1)(A-2)\le0$

Vì $A+1>A-2$ nên tích không dương chỉ xảy ra khi $A+1\ge0$ và $A-2\le0$, tức $-1\le A\le2$.

Với $A=-1$: $(-1)(-2)=2\le2$ (thỏa điều kiện). Với $A=2$: $2\cdot1=2\le2$ (thỏa điều kiện).

Vậy $GTNN$ của $A$ bằng $-1$ (khi $A=-1$) và $GTLN$ của $A$ bằng $2$ (khi $A=2$).

=== V2V.111b@p59
- bai: 111 · y: b · trang: 59 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: (x+y+z)² ≤ 3(x²+y²+z²) · xét dấu một tích · đặt s=x+y+z, q=x²+y²+z²
- kiem: khong
- ket_qua_sach: -1; 2
- dap_an: $GTNN=-1$ khi $x=y=z=1$; $GTLN=2$ khi $x=y=z=0$
- ghi_chu_nghi: bài *. Máy kiểm trên 74.000 bộ (x,y,z) số thực thỏa điều kiện đề (giải theo x với y,z ngẫu nhiên): A nằm trong [-1; 2]; điểm (1,1,1) cho A=-1 và (0,0,0) cho A=2 thỏa điều kiện; khớp sách. Đề giả định x,y,z là số thực (cần để dùng bình phương không âm). Sách đánh số (1),(2) hai lần cho hai việc khác nhau; chép đúng như in.
## DE
Tìm GTNN và GTLN của biểu thức $A=2-x-y-z$, biết rằng $(2-x-y-z)^2=4-x^2-y^2-z^2$.
## SACH
Từ giả thiết ta có:

$x+y+z=2-A$ (1)

$x^2+y^2+z^2=4-A^2$ (2)

Ta đưa ra một bất đẳng thức trong đó chứa $x+y+z$ và $x^2+y^2+z^2$. Ta có:

$(x+y+z)^2=x^2+y^2+z^2+2(xy+yz+zx)$ (1)

Mặt khác, dễ dàng chứng minh được: $xy+yz+zx\le x^2+y^2+z^2$ (2)

Từ (1) và (2) suy ra $(x+y+z)^2\le3(x^2+y^2+z^2)$; xảy ra đẳng thức khi và chỉ khi $x=y=z$.

Do đó $(2-A)^2\le3(4-A^2)$. Biến đổi bất đẳng thức này ta được $A^2-A-2\le0$. Giải tiếp như câu a ta được:

$\min A=-1\Leftrightarrow\begin{cases}x+y+z=3\\x=y=z\end{cases}\Leftrightarrow x=y=z=1$.

$\max A=2\Leftrightarrow\begin{cases}x+y+z=0\\x=y=z\end{cases}\Leftrightarrow x=y=z=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết viết lại thành $x+y+z=2-A$ và $x^2+y^2+z^2=4-A^2$, tức hai đại lượng tổng và tổng bình phương đều theo $A$; bất đẳng thức quen thuộc nối hai đại lượng này sẽ cho một bất đẳng thức chỉ chứa $A$.

**Bước 1.** Đặt $s=x+y+z$ và $q=x^2+y^2+z^2$ rồi dùng giả thiết để biểu thị $s=2-A$ và $q=4-A^2$.

**Bước 2.** Chứng minh $s^2\le3q$ bằng cách xét $3q-s^2$, nó bằng tổng ba bình phương $(x-y)^2+(y-z)^2+(z-x)^2$ không âm, dấu "=" khi $x=y=z$.

**Bước 3.** Thay $s,q$ theo $A$ vào $s^2\le3q$ để được bất đẳng thức bậc hai chỉ chứa $A$, rồi rút gọn về dạng tích để xét dấu như câu a.

**Bước 4.** Kết luận khoảng của $A$ rồi tìm bộ $(x,y,z)$ làm mỗi đầu mút xảy ra (cần $x=y=z$ và thỏa giả thiết) để chứng tỏ đạt được thật.

**Chú ý:** Chỉ có bất đẳng thức về khoảng của $A$ là chưa đủ; phải chỉ ra một bộ $(x,y,z)$ cụ thể thỏa giả thiết cho mỗi đầu mút.

**Phần 2. Trình bày**

Giả sử $x,y,z$ là các số thực thỏa giả thiết. Đặt $s=x+y+z=2-A$ và $q=x^2+y^2+z^2=4-A^2$ (theo giả thiết).

Ta có $3q-s^2=3(x^2+y^2+z^2)-(x+y+z)^2=(x-y)^2+(y-z)^2+(z-x)^2\ge0$, nên $s^2\le3q$, dấu "=" xảy ra khi $x=y=z$.

Do đó $(2-A)^2\le3(4-A^2)$

$\Leftrightarrow4-4A+A^2\le12-3A^2$

$\Leftrightarrow4A^2-4A-8\le0$

$\Leftrightarrow A^2-A-2\le0$

$\Leftrightarrow(A+1)(A-2)\le0$

Vì $A+1>A-2$ nên $A+1\ge0$ và $A-2\le0$, tức $-1\le A\le2$.

Với $x=y=z=1$: $2-x-y-z=-1$ và $(2-3)^2=1=4-3$ (thỏa giả thiết), nên $A=-1$ đạt được.

Với $x=y=z=0$: $A=2$ và $2^2=4=4-0$ (thỏa giả thiết), nên $A=2$ đạt được.

Vậy $GTNN$ của $A$ bằng $-1$, đạt khi $x=y=z=1$; $GTLN$ của $A$ bằng $2$, đạt khi $x=y=z=0$.

=== V2V.112@p60
- bai: 112 · y: - · trang: 60 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách A = 1 − 2x²/(x²+1)² và A = 1/2 + (x²−1)²/(2(x²+1)²) · (cách của sách) nghịch đảo 1/A
- kiem: khong
- ket_qua_sach: 1; \dfrac{1}{2}
- dap_an: $GTLN=1$ khi $x=0$; $GTNN=\dfrac{1}{2}$ khi $x=1$ hoặc $x=-1$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: 1/2 ≤ A ≤ 1, A(0)=1, A(±1)=1/2; khớp sách. Ở Chú ý 2 Cách 2 ảnh in tử là (x²+1)+(x²−1)² có vẻ thiếu số mũ 2 ở số hạng đầu (đúng phải là (x²+1)²+(x²−1)²); SACH chép như ảnh in, GIAI dùng dạng đúng. GIAI theo hai cách khác của sách (Chú ý 1 cho GTLN, Chú ý 2 cách 2 cho GTNN); cách nghịch đảo chính của sách nhắc ở Chú ý.
## DE
Tìm GTLN và GTNN của $A=\dfrac{x^4+1}{(x^2+1)^2}$.
## SACH
Chú ý rằng $A>0$ nên $A$ lớn nhất $\Leftrightarrow\dfrac{1}{A}$ nhỏ nhất; $A$ nhỏ nhất $\Leftrightarrow\dfrac{1}{A}$ lớn nhất. Ta có:

$\dfrac{1}{A}=\dfrac{(x^2+1)^2}{x^4+1}=\dfrac{x^4+2x^2+1}{x^4+1}=1+\dfrac{2x^2}{x^4+1}$.

Tìm GTLN của $A$: Ta có $2x^2\ge0$, $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\ge0$. Suy ra $\dfrac{1}{A}\ge1+0=1$.

$\min\dfrac{1}{A}=1$ khi và chỉ khi $x=0$. Do đó $\max A=1$ khi và chỉ khi $x=0$.

Tìm GTNN của $A$: Ta có $2x^2\le x^4+1$ (dễ chứng minh, dấu "=" xảy ra khi và chỉ khi $x^2=1$) mà $x^4+1>0$ nên $\dfrac{2x^2}{x^4+1}\le1$. Suy ra $\dfrac{1}{A}\le1+1=2$; $\max\dfrac{1}{A}=2$ khi và chỉ khi $x^2=1$. Do đó $\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\pm1$.

Chú ý:

1. Cách khác tìm GTLN của $A$:

$A=\dfrac{(x^2+1)^2-2x^2}{(x^2+1)^2}=1-\dfrac{2x^2}{(x^2+1)^2}\le1$.

$\max A=1$ khi và chỉ khi $x=0$.

2. Cách khác tìm GTNN của $A$:

Cách 1. Đặt $\dfrac{1}{x^2+1}=y$ như ví dụ 107.

Cách 2. $A=\dfrac{2x^4+2}{2(x^2+1)^2}=\dfrac{(x^2+1)+(x^2-1)^2}{2(x^2+1)^2}=\dfrac{1}{2}+\dfrac{(x^2-1)^2}{2(x^2+1)^2}\ge\dfrac{1}{2}$.

$\min A=\dfrac{1}{2}$ khi và chỉ khi $x=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $x^4+1$ và mẫu $(x^2+1)^2=x^4+2x^2+1$ chỉ khác nhau $2x^2$; nên $A$ viết được thành "hằng số cộng hoặc trừ một phân thức có tử không âm, mẫu dương", và hằng số ấy chính là cực trị cần tìm.

**Bước 1.** Để tìm GTLN, tách tử thành mẫu trừ đi $2x^2$ để được $A=1-\dfrac{2x^2}{(x^2+1)^2}$, rồi dùng $\dfrac{2x^2}{(x^2+1)^2}\ge0$ để chặn $A$ từ trên.

**Bước 2.** Để tìm GTNN, tách tử thành một nửa mẫu cộng một nửa bình phương $(x^2-1)^2$ (kiểm bằng cách khai triển) để được $A=\dfrac{1}{2}+\dfrac{(x^2-1)^2}{2(x^2+1)^2}$.

**Bước 3.** Chặn từng phía bằng phân thức không âm và chỉ ra $x$ làm dấu "=" xảy ra ở mỗi phía (mỗi cực trị đạt ở điểm khác nhau).

**Chú ý:** Sách còn làm theo cách nghịch đảo: $A>0$ nên $A$ lớn nhất khi $\dfrac{1}{A}=1+\dfrac{2x^2}{x^4+1}$ nhỏ nhất, và $A$ nhỏ nhất khi $\dfrac{1}{A}$ lớn nhất (dùng $2x^2\le x^4+1$).

**Phần 2. Trình bày**

Vì $(x^2+1)^2>0$ với mọi $x$ nên $A$ xác định với mọi $x$.

Tìm GTLN: $A=\dfrac{(x^2+1)^2-2x^2}{(x^2+1)^2}=1-\dfrac{2x^2}{(x^2+1)^2}$

Vì $2x^2\ge0$ và $(x^2+1)^2>0$ nên $\dfrac{2x^2}{(x^2+1)^2}\ge0$, suy ra $A\le1$ với mọi $x$. Dấu "=" xảy ra khi $x=0$ (khi đó $A=1$).

Tìm GTNN: $A=\dfrac{(x^2+1)^2+(x^2-1)^2}{2(x^2+1)^2}=\dfrac{1}{2}+\dfrac{(x^2-1)^2}{2(x^2+1)^2}$

Vì $(x^2-1)^2\ge0$ và $2(x^2+1)^2>0$ nên $A\ge\dfrac{1}{2}$ với mọi $x$. Dấu "=" xảy ra khi $x^2=1$, tức $x=1$ hoặc $x=-1$ (khi đó $A=\dfrac{2}{4}=\dfrac{1}{2}$).

Vậy $GTLN$ của $A$ bằng $1$, đạt khi $x=0$; $GTNN$ của $A$ bằng $\dfrac{1}{2}$, đạt khi $x=1$ hoặc $x=-1$.

=== V2V.113@p61
- bai: 113 · y: - · trang: 61 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y=|3x-1| (y≥0) · |t|²=t² · đưa về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTNN=1$ khi $x=1$ hoặc $x=-\dfrac{1}{3}$
- ghi_chu_nghi: Máy kiểm 100.000 giá trị ngẫu nhiên: A không nhỏ hơn 1, A(1)=A(-1/3)=1 (phân số); khớp sách.
## DE
Tìm GTNN của $A=(3x-1)^2-4\lvert3x-1\rvert+5$.
## SACH
Đặt $\lvert3x-1\rvert=y$ thì

$A=\lvert3x-1\rvert^2-4\lvert3x-1\rvert+5=y^2-4y+5=(y-2)^2+1\ge1$.

$\min A=1\Leftrightarrow y=2\Leftrightarrow\lvert3x-1\rvert=2\Leftrightarrow x_1=1;\ x_2=-\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức chứa cả $(3x-1)^2$ và $\lvert3x-1\rvert$, mà bình phương của một số bằng bình phương giá trị tuyệt đối của nó; nên đặt $y=\lvert3x-1\rvert$ thì $A$ thành tam thức bậc hai theo $y$.

**Bước 1.** Đổi $(3x-1)^2$ thành $\lvert3x-1\rvert^2$ rồi đặt $y=\lvert3x-1\rvert$ (nhớ $y\ge0$) để $A$ chỉ còn một biến $y$.

**Bước 2.** Đưa tam thức theo $y$ về bình phương cộng hằng số để chặn $A$ từ dưới.

**Bước 3.** Giải $y=$ giá trị làm bình phương bằng $0$ ngược về $x$: phải xét cả hai dấu bên trong giá trị tuyệt đối nên có hai giá trị $x$.

**Chú ý:** Giá trị $y$ tìm được phải thỏa $y\ge0$ (ở đây thỏa); nếu ra $y<0$ thì dấu "=" không xảy ra và cực trị phải tìm ở biên $y=0$.

**Phần 2. Trình bày**

Đặt $y=\lvert3x-1\rvert\ge0$, khi đó $(3x-1)^2=y^2$.

$A=y^2-4y+5=(y-2)^2+1$

Vì $(y-2)^2\ge0$ nên $A\ge1$ với mọi $x$.

Dấu "=" xảy ra khi $y=2$ (thỏa $y\ge0$), tức $\lvert3x-1\rvert=2$, suy ra $3x-1=2$ hoặc $3x-1=-2$, vậy $x=1$ hoặc $x=-\dfrac{1}{3}$.

Vậy $GTNN$ của $A$ bằng $1$, đạt khi $x=1$ hoặc $x=-\dfrac{1}{3}$.
