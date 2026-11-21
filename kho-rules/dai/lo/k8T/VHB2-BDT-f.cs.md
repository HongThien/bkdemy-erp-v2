=== V2V.114@p61
- bai: 114 · y: - · trang: 61 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối) · xét khoảng
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTNN=1$ khi $2\le x\le3$
- ghi_chu_nghi: Máy vét lưới mịn cho min B = 1 tại 2 ≤ x ≤ 3, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\lvert x-2\rvert+\lvert x-3\rvert$.
## SACH
Cách 1.

a) Xét khoảng $x<2$ thì $B=2-x+3-x=5-2x$. Do $x<2$ nên $-2x>-4$, do đó $B>1$ (1)

b) Xét khoảng $2\le x\le3$ thì $B=x-2+3-x=1$ (2)

c) Xét khoảng $x>3$ thì $B=x-2+x-3=2x-5$. Do $x>3$ nên $2x>6$, do đó $B>1$ (3)

So sánh (1), (2), (3) ta được $\min B=1$ khi và chỉ khi $2\le x\le3$.

Cách 2. Do giá trị tuyệt đối của một số lớn hơn hoặc bằng số đó nên $B=\lvert x-2\rvert+\lvert x-3\rvert=\lvert x-2\rvert+\lvert3-x\rvert\ge(x-2)+(3-x)=1$.

Do đó $\min B=1\Leftrightarrow x-2\ge0$ và $3-x\ge0\Leftrightarrow2\le x\le3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Có hai giá trị tuyệt đối cùng chứa $x$; nếu lật dấu một biểu thức để hai biểu thức trong dấu giá trị tuyệt đối có tổng không còn $x$, thì bất đẳng thức $\lvert t\rvert\ge t$ cho ngay một cận dưới là hằng số.

**Bước 1.** Viết $\lvert x-3\rvert=\lvert3-x\rvert$ để hai biểu thức $x-2$ và $3-x$ có tổng bằng $1$, tức là $x$ triệt tiêu khi cộng.

**Bước 2.** Áp dụng $\lvert t\rvert\ge t$ cho từng hạng tử rồi cộng hai bất đẳng thức lại để được cận dưới của $B$ là một hằng số.

**Bước 3.** Tìm điều kiện để cả hai dấu "=" cùng xảy ra (mỗi biểu thức trong dấu giá trị tuyệt đối phải không âm) và kiểm tra điều kiện đó thoả được, để chắc cận dưới thật sự đạt tới.

**Chú ý:** Dấu "=" ở đây xảy ra trên cả một đoạn chứ không chỉ một điểm; chỉ cần nêu ra một giá trị của $x$ thuộc đoạn đó cũng đủ.

**Phần 2. Trình bày**

Vì $\lvert t\rvert\ge t$ với mọi số thực $t$ nên

$B=\lvert x-2\rvert+\lvert3-x\rvert\ge(x-2)+(3-x)=1$

Dấu "=" xảy ra khi $x-2\ge0$ và $3-x\ge0$, tức là $2\le x\le3$.

Vậy $GTNN$ của $B$ bằng $1$, đạt khi $2\le x\le3$.

=== V2V.115@p62
- bai: 115 · y: - · trang: 62 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối) · ghép cặp hạng tử ngoài cùng · |t| ≥ 0
- kiem: khong
- ket_qua_sach: 8
- dap_an: $GTNN=8$ khi $x=7$
- ghi_chu_nghi: Máy vét lưới mịn cho min A = 8 tại x = 7, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\lvert x-1\rvert+\lvert x-7\rvert+\lvert x-9\rvert$.
## SACH
Do giá trị tuyệt đối của một số lớn hơn hoặc bằng số đó nên

$\lvert x-1\rvert+\lvert x-9\rvert=\lvert x-1\rvert+\lvert9-x\rvert\ge x-1+9-x=8$ (1)

Ta lại có $\lvert x-7\rvert\ge0$ (2)

Từ (1) và (2) suy ra $A\ge8$.

Do đó $\min A=8\Leftrightarrow x-1\ge0$, $9-x\ge0$ và $x=7\Leftrightarrow x=7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba giá trị tuyệt đối với các số $1,7,9$ nằm cách đều quanh $7$: hai số ngoài cùng $1$ và $9$ ghép được thành một cặp có tổng biểu thức không chứa $x$, còn số giữa $7$ đứng riêng và chỉ cần $\lvert x-7\rvert\ge0$.

**Bước 1.** Ghép $\lvert x-1\rvert$ với $\lvert x-9\rvert=\lvert9-x\rvert$ vì hai biểu thức $x-1$ và $9-x$ có tổng $8$, không chứa $x$.

**Bước 2.** Dùng $\lvert t\rvert\ge t$ cho cặp ngoài và $\lvert x-7\rvert\ge0$ cho hạng tử giữa, rồi cộng lại để được cận dưới của $A$.

**Bước 3.** Kiểm tra hai dấu "=" có đồng thời xảy ra không: cặp ngoài cần $1\le x\le9$, hạng tử giữa cần $x=7$, và $x=7$ thoả cả hai.

**Chú ý:** Nếu ghép $\lvert x-1\rvert$ với $\lvert x-7\rvert$ thì được cận dưới $6$ nhưng dấu "=" cần $x\le7$ còn $\lvert x-9\rvert=0$ cần $x=9$, hai điều kiện loại nhau nên cách ghép đó không cho ra giá trị nhỏ nhất. Cách ghép đúng là cặp ngoài cùng.

**Phần 2. Trình bày**

Vì $\lvert t\rvert\ge t$ với mọi $t$ nên $\lvert x-1\rvert+\lvert x-9\rvert=\lvert x-1\rvert+\lvert9-x\rvert\ge(x-1)+(9-x)=8$

Mặt khác $\lvert x-7\rvert\ge0$.

Cộng hai bất đẳng thức: $A\ge8$.

Dấu "=" xảy ra khi $x-1\ge0$, $9-x\ge0$ và $x-7=0$, tức là $x=7$ (thoả $1\le7\le9$).

Vậy $GTNN$ của $A$ bằng $8$, đạt khi $x=7$.

=== V2V.116@p62
- bai: 116 · y: - · trang: 62 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki · dấu "=" theo tỉ lệ
- kiem: khong
- ket_qua_sach: 26
- dap_an: $GTLN=26$ khi $x=4,\ y=6$
- ghi_chu_nghi: Máy duyệt đường tròn x²+y²=52 cho max A = 26 tại (4;6), khớp sách.
## DE
Cho $x^2+y^2=52$. Tìm giá trị lớn nhất của $A=2x+3y$.
## SACH
Ta nhận thấy $2x+3y$ và $x^2+y^2$ là các thành phần của bất đẳng thức Bu-nhi-a-cốp-xki $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$ với $a=2$, $b=3$.

Theo bất đẳng thức trên: $(2x+3y)^2\le(2^2+3^2)\cdot52\Rightarrow(2x+3y)^2\le13\cdot13\cdot4\Rightarrow\lvert2x+3y\rvert\le26\Rightarrow2x+3y\le26$.

$\max A=26\Leftrightarrow\dfrac{x}{2}=\dfrac{y}{3}$ (1) và $2x+3y\ge0$ (2).

Thay $y=\dfrac{3x}{2}$ vào $x^2+y^2=52$, ta được $x^2+\dfrac{9x^2}{4}=52$. Giải phương trình này được: $x=\pm4$.

Với $x=4$ thì $y=6$, thoả mãn (2). Với $x=-4$ thì $y=-6$, không thoả mãn (2).

Vậy $\max A=26$ khi và chỉ khi $x=4$, $y=6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức cần tìm $2x+3y$ là tổng có hệ số, còn điều kiện cho $x^2+y^2$ không đổi; hai thứ đó đúng là hai vế của bất đẳng thức Bu-nhi-a-cốp-xki, nên dùng nó để chặn $A$ theo $52$.

**Bước 1.** Nhận ra dạng $(ax+by)^2\le(a^2+b^2)(x^2+y^2)$ và chọn $a=2$, $b=3$ để vế trái chính là $(2x+3y)^2$.

**Bước 2.** Thay $x^2+y^2=52$ để vế phải thành một số cụ thể, rồi lấy căn bậc hai hai vế để chặn giá trị tuyệt đối của $A$ và suy ra $A$ không vượt quá một hằng số.

**Bước 3.** Viết điều kiện dấu "=": $\dfrac{x}{2}=\dfrac{y}{3}$ cùng với $A\ge0$ (vì ta đã bỏ dấu giá trị tuyệt đối), rồi giải cùng điều kiện $x^2+y^2=52$.

**Bước 4.** Loại điểm làm $A$ âm, giữ điểm cho $A$ đạt giá trị lớn nhất.

**Chú ý:** Từ $A^2\le676$ chỉ suy ra $-26\le A\le26$; điểm $x=-4,\ y=-6$ cũng thoả tỉ lệ nhưng cho $A=-26$, đó là giá trị nhỏ nhất chứ không phải lớn nhất.

**Phần 2. Trình bày**

Theo bất đẳng thức Bu-nhi-a-cốp-xki: $(2x+3y)^2\le(2^2+3^2)(x^2+y^2)=13\cdot52=676$

$\Rightarrow\lvert2x+3y\rvert\le26\Rightarrow A\le26$

Dấu "=" xảy ra khi $\dfrac{x}{2}=\dfrac{y}{3}$ và $2x+3y\ge0$.

Thay $y=\dfrac{3x}{2}$ vào $x^2+y^2=52$: $\dfrac{13x^2}{4}=52\Rightarrow x^2=16\Rightarrow x=\pm4$

Với $x=4$ thì $y=6$, thoả $2x+3y=26\ge0$. Với $x=-4$ thì $y=-6$, $A=-26<0$, loại.

Vậy $GTLN$ của $A$ bằng $26$, đạt khi $x=4,\ y=6$.

=== V2V.117@p63
- bai: 117 · y: - · trang: 63 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng không đổi ⇒ tích lớn nhất (ab ≤ ((a+b)/2)²)
- kiem: khong
- ket_qua_sach: 121
- dap_an: $GTLN=121$ khi $x=5$ hoặc $x=-2$
- ghi_chu_nghi: Máy vét lưới mịn cho max A = 121 tại x = 5 và x = -2, khớp sách.
## DE
Tìm giá trị lớn nhất của biểu thức $A=(x^2-3x+1)(21+3x-x^2)$.
## SACH
Các biểu thức $x^2-3x+1$ và $21+3x-x^2$ có tổng không đổi (bằng $22$) nên tích của chúng lớn nhất khi và chỉ khi

$x^2-3x+1=21+3x-x^2\Leftrightarrow x^2-3x-10=0\Leftrightarrow(x-5)(x+2)=0\Leftrightarrow x_1=5;\ x_2=-2$.

Khi đó $A=11\cdot11=121$.

Vậy $\max A=121$ khi và chỉ khi $x=5$ hoặc $x=-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai thừa số $x^2-3x+1$ và $21+3x-x^2$ có hạng tử $x^2$ và $x$ đối nhau nên tổng của chúng là hằng số; hai số có tổng không đổi thì tích lớn nhất khi hai số bằng nhau.

**Bước 1.** Đặt hai thừa số là $a$ và $b$, cộng lại để kiểm tra $a+b$ là một hằng số không chứa $x$.

**Bước 2.** Dùng $4ab\le(a+b)^2$ (tương đương $(a-b)^2\ge0$, đúng với mọi số thực) để chặn tích $ab$ từ trên.

**Bước 3.** Giải phương trình $a=b$ để tìm các giá trị $x$ làm dấu "=" xảy ra và nhận cả hai nghiệm.

**Chú ý:** Bất đẳng thức $ab\le\dfrac{(a+b)^2}{4}$ đúng với mọi số thực $a,b$, không cần $a,b>0$; điều kiện dương chỉ cần khi dùng Cô-si cho tổng.

**Phần 2. Trình bày**

Đặt $a=x^2-3x+1$ và $b=21+3x-x^2$, khi đó $a+b=22$.

Vì $(a-b)^2\ge0$ nên $A=ab\le\dfrac{(a+b)^2}{4}=\dfrac{22^2}{4}=121$

Dấu "=" xảy ra khi $a=b$, tức là $x^2-3x+1=21+3x-x^2\Leftrightarrow x^2-3x-10=0\Leftrightarrow(x-5)(x+2)=0$

Suy ra $x=5$ hoặc $x=-2$ (khi đó $a=b=11$).

Vậy $GTLN$ của $A$ bằng $121$, đạt khi $x=5$ hoặc $x=-2$.

=== V2V.118@p64
- bai: 118 · y: - · trang: 64 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách phân thức · Cô-si hai số dương (a+b ≥ 2√(ab))
- kiem: khong
- ket_qua_sach: 6
- dap_an: $GTNN=6$ khi $x=\dfrac{1}{4}$
- ghi_chu_nghi: Máy vét lưới mịn trên x>0 cho min B = 6 tại x = 1/4, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\dfrac{16x^2+4x+1}{2x}$ với $x>0$.
## SACH
Viết $B$ dưới dạng $8x+2+\dfrac{1}{2x}$. Hai số $8x$ và $\dfrac{1}{2x}$ là hai số dương, có tích không đổi (bằng $4$) nên tổng của chúng nhỏ nhất khi và chỉ khi

$8x=\dfrac{1}{2x}\Leftrightarrow16x^2=1\Leftrightarrow x=\dfrac{1}{4}$ (chú ý rằng $x>0$).

Vậy $\min B=\dfrac{1+1+1}{\dfrac{1}{2}}=6$ khi và chỉ khi $x=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là tam thức bậc hai còn mẫu là $2x$ với $x>0$; chia từng hạng tử cho mẫu thì hai hạng tử $8x$ và $\dfrac{1}{2x}$ có tích không đổi, đúng dấu hiệu dùng bất đẳng thức Cô-si.

**Bước 1.** Chia từng hạng tử của tử cho $2x$ để tách $B$ thành $8x+2+\dfrac{1}{2x}$.

**Bước 2.** Nhận ra $8x$ và $\dfrac{1}{2x}$ là hai số dương có tích bằng $4$ (không chứa $x$), nên áp dụng Cô-si để chặn tổng của chúng từ dưới.

**Bước 3.** Giải $8x=\dfrac{1}{2x}$ với $x>0$ để tìm điểm đạt dấu "=" rồi cộng hằng số $2$ còn lại.

**Chú ý:** Cô-si chỉ dùng được cho số dương, nên phải nhắc điều kiện $x>0$ ngay chỗ áp dụng; nếu để $x<0$ thì tổng này có thể âm.

**Phần 2. Trình bày**

$B=\dfrac{16x^2+4x+1}{2x}=8x+2+\dfrac{1}{2x}$

Vì $x>0$ nên $8x>0$ và $\dfrac{1}{2x}>0$. Theo bất đẳng thức Cô-si: $8x+\dfrac{1}{2x}\ge2\sqrt{8x\cdot\dfrac{1}{2x}}=2\sqrt{4}=4$

$\Rightarrow B\ge4+2=6$

Dấu "=" xảy ra khi $8x=\dfrac{1}{2x}\Leftrightarrow16x^2=1\Leftrightarrow x=\dfrac{1}{4}$ (vì $x>0$).

Vậy $GTNN$ của $B$ bằng $6$, đạt khi $x=\dfrac{1}{4}$.

=== V2V.119@p64
- bai: 119 · y: - · trang: 64 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội (thêm ad ≥ 0) · xy ≤ ((x+y)/2)² (tổng không đổi ⇒ tích lớn nhất)
- kiem: khong
- ket_qua_sach: \dfrac{1}{4}
- dap_an: $GTLN=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2},\ c=d=0$
- ghi_chu_nghi: Cách 1 của sách giả sử a ≥ b ≥ c ≥ d, nhưng A = ab+bc+cd không đối xứng nên không thể giả sử thứ tự tuỳ ý (không "không mất tổng quát"); kết quả vẫn đúng. GIAI theo Cách 2 của sách. Máy (300.000 bộ ngẫu nhiên có tổng 1) cho max xấp xỉ 1/4, khớp.
## DE
Tìm giá trị lớn nhất của $A=ab+bc+cd$, biết rằng $a,b,c,d$ là các số không âm có tổng bằng $1$.
## SACH
Cách 1. Giả sử $a\ge b\ge c\ge d\ge0$. Ta có

$A=ab+bc+cd\le ab+ac+ad=a(b+c+d)=a(1-a)=a-a^2=-\left(a-\dfrac{1}{2}\right)^2+\dfrac{1}{4}\le\dfrac{1}{4}$.

Không cần tìm điều kiện cần và đủ để $A=\dfrac{1}{4}$, tức là không cần giải tất cả các điều kiện $bc=ac$, $cd=ad$, $a=\dfrac{1}{2}$, $b+c+d=\dfrac{1}{2}$ và $b,c,d\ge0$. Ta chỉ cần chỉ ra $A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.

Vậy $\max A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.

Cách 2. $A=ab+bc+cd\le ab+ad+bc+cd=(a+c)(b+d)$.

Áp dụng bất đẳng thức $xy\le\left(\dfrac{x+y}{2}\right)^2$ ta có:

$A=(a+c)(b+d)\le\left(\dfrac{a+c+b+d}{2}\right)^2=\dfrac{1}{4}$.

$A=\dfrac{1}{4}\Leftrightarrow a+c=\dfrac{1}{2}$, $b+d=\dfrac{1}{2}$, $ad=0$, $a,b,c,d\ge0$.

Vậy $\max A=\dfrac{1}{4}$ khi, chẳng hạn, $a=b=\dfrac{1}{2}$, $c=d=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $A=ab+bc+cd$ thiếu đúng một tích $ad$ để nhóm được thành $(a+c)(b+d)$, mà $ad\ge0$ nên thêm nó vào chỉ làm $A$ lớn lên; và hai nhân tử $a+c$, $b+d$ có tổng cố định bằng $1$, nên tích bị chặn bởi bất đẳng thức tích–tổng.

**Bước 1.** Thêm $ad$ (không âm vì $a,d\ge0$) vào vế phải để làm trội $A$ bằng $ab+ad+bc+cd$.

**Bước 2.** Phân tích tổng vừa có thành $(a+c)(b+d)$ rồi kiểm tra hai nhân tử có tổng $a+b+c+d=1$, một hằng số.

**Bước 3.** Dùng $xy\le\left(\dfrac{x+y}{2}\right)^2$ (đúng với mọi số thực $x,y$) để chặn tích từ trên bằng một hằng số.

**Bước 4.** Lấy các điều kiện dấu "=" ($ad=0$ và $a+c=b+d=\dfrac{1}{2}$), chọn một bộ giá trị cụ thể thoả mãn các điều kiện không âm và tính trực tiếp $A$ để chắc rằng giá trị chặn thật sự đạt được.

**Chú ý:** Không được giả sử thứ tự $a\ge b\ge c\ge d$ như với biểu thức đối xứng, vì $A$ không đối xứng theo bốn biến; việc đổi vai trò các biến làm $A$ đổi. Bài chỉ đòi hỏi chỉ ra một bộ giá trị đạt giá trị lớn nhất, không cần tìm hết.

**Phần 2. Trình bày**

Vì $a,d\ge0$ nên $ad\ge0$, do đó $A=ab+bc+cd\le ab+ad+bc+cd=(a+c)(b+d)$

Với mọi số thực $x,y$ ta có $xy\le\left(\dfrac{x+y}{2}\right)^2$ (vì $(x-y)^2\ge0$), nên

$(a+c)(b+d)\le\left(\dfrac{a+c+b+d}{2}\right)^2=\dfrac{1}{4}$

Suy ra $A\le\dfrac{1}{4}$.

Dấu "=" xảy ra khi $ad=0$ và $a+c=b+d=\dfrac{1}{2}$. Chẳng hạn $a=b=\dfrac{1}{2}$, $c=d=0$ (các số không âm, tổng bằng $1$) thì $A=\dfrac{1}{2}\cdot\dfrac{1}{2}+\dfrac{1}{2}\cdot0+0\cdot0=\dfrac{1}{4}$.

Vậy $GTLN$ của $A$ bằng $\dfrac{1}{4}$, đạt khi, chẳng hạn, $a=b=\dfrac{1}{2},\ c=d=0$.

=== V2V.120@p65
- bai: 120 · y: - · trang: 65 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét dấu mẫu · số nguyên dương ≥ 1 · phân chia trường hợp
- kiem: khong
- ket_qua_sach: 4
- dap_an: $GTLN=4$ khi $x=0,\ y=4$
- ghi_chu_nghi: Máy vét cạn 0 ≤ x,y < 300 (loại x+y=5) cho max A = 4 tại (0;4), khớp sách.
## DE
Tìm giá trị lớn nhất của biểu thức $A=\dfrac{y}{5-(x+y)}$ với $x,y$ là các số tự nhiên.
## SACH
Ta có $x+y\ne5$.

Xét $x+y\le4$:

– Nếu $y=0$ thì $A=0$.

– Nếu $1\le y\le3$ thì $A=\dfrac{y}{5-(x+y)}\le3$.

– Nếu $y=4$ thì $x=0$ và $A=4$.

Xét $x+y\ge6$ thì $A=\dfrac{y}{5-(x+y)}\le0$.

So sánh các giá trị trên của $A$, ta thấy $\max A=4$ khi và chỉ khi $x=0$, $y=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $x,y$ là số tự nhiên nên $x+y$ nguyên và mẫu $5-(x+y)$ là số nguyên; chia theo dấu của mẫu, khi mẫu dương thì mẫu nguyên dương nên không nhỏ hơn $1$, và đó là chỗ chặn được $A$.

**Bước 1.** Loại trường hợp $x+y=5$ vì mẫu bằng $0$ làm biểu thức không có nghĩa.

**Bước 2.** Xét $x+y\ge6$: mẫu âm còn tử $y\ge0$, nên $A\le0$ và không thể là giá trị lớn nhất.

**Bước 3.** Xét $x+y\le4$: mẫu nguyên dương nên $\ge1$, từ đó $A\le y$, rồi dùng $y\le x+y\le4$ để chặn $A$ bởi một hằng số.

**Bước 4.** Chỉ ra bộ $(x;y)$ cho $A$ bằng đúng hằng số đó để kết luận giá trị lớn nhất.

**Chú ý:** Bài số tự nhiên không dùng được bình phương không âm như bài số thực; mấu chốt là "số nguyên dương thì $\ge1$". Cũng không được quên số $0$ là số tự nhiên (trường hợp $x=0$ chính là chỗ đạt cực trị).

**Phần 2. Trình bày**

Để biểu thức có nghĩa thì $x+y\ne5$.

Nếu $x+y\ge6$ thì $5-(x+y)<0$ và $y\ge0$ nên $A\le0$.

Nếu $x+y\le4$ thì $5-(x+y)$ là số nguyên dương, suy ra $5-(x+y)\ge1$, mà $y\ge0$ nên

$A=\dfrac{y}{5-(x+y)}\le y\le x+y\le4$

Vậy trong mọi trường hợp $A\le4$.

Với $x=0$, $y=4$ thì $A=\dfrac{4}{5-4}=4$.

Vậy $GTLN$ của $A$ bằng $4$, đạt khi $x=0,\ y=4$.

=== V2V.121@p66
- bai: 121 · y: - · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: (x+y)² − (x−y)² = 4xy · cực trị của số nguyên (khoảng giá trị của x−y)
- kiem: khong
- ket_qua_sach: GTLN 1005006; GTNN 2004
- dap_an: $GTLN=1005006$ khi $x=1003,\ y=1002$ (hoặc ngược lại); $GTNN=2004$ khi $x=2004,\ y=1$ (hoặc ngược lại)
- ghi_chu_nghi: Máy vét cạn x = 1..2004: max xy = 1005006, min xy = 2004, khớp sách.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của tích $xy$, biết rằng $x$ và $y$ là các số nguyên dương thoả mãn $x+y=2005$.
## SACH
Ta có $4xy=(x+y)^2-(x-y)^2=2005^2-(x-y)^2$.

Giả sử $x>y$ (không thể xảy ra $x=y$). Ta có:

$xy$ lớn nhất $\Leftrightarrow x-y$ nhỏ nhất; $xy$ nhỏ nhất $\Leftrightarrow x-y$ lớn nhất.

Do $1\le y<x\le2004$ nên $1\le x-y\le2003$.

Ta có: $\min(x-y)=1$ khi và chỉ khi $x=1003$, $y=1002$.

$\max(x-y)=2003$ khi và chỉ khi $x=2004$, $y=1$.

Do đó: $\max(xy)=1005006$ khi và chỉ khi $x=1003$, $y=1002$.

$\min(xy)=2004$ khi và chỉ khi $x=2004$, $y=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $x+y=2005$ cố định nên tích $xy$ liên hệ với hiệu qua $4xy=(x+y)^2-(x-y)^2$; $xy$ càng lớn khi hai số càng gần nhau và càng nhỏ khi càng xa nhau, và vì $x,y$ nguyên dương nên hiệu $x-y$ chỉ chạy trong một khoảng số nguyên hữu hạn.

**Bước 1.** Viết $4xy=2005^2-(x-y)^2$ để đưa việc tìm cực trị của $xy$ về cực trị của $\lvert x-y\rvert$.

**Bước 2.** Vì $2005$ lẻ nên $x\ne y$, do đó giả sử $x>y$ (tích $xy$ đối xứng nên không mất tính tổng quát), rồi dùng $y\ge1$ và $x=2005-y\le2004$ để tìm khoảng của $x-y$.

**Bước 3.** Chỉ ra các giá trị nhỏ nhất và lớn nhất của $x-y$ đều đạt được bởi các cặp nguyên dương cụ thể, rồi suy ngược ra giá trị lớn nhất và nhỏ nhất của $xy$.

**Chú ý:** $xy$ lớn nhất khi $x-y$ nhỏ nhất và ngược lại vì $xy=\dfrac{2005^2-(x-y)^2}{4}$ giảm khi $(x-y)^2$ tăng; đừng viết ngược chiều.

**Phần 2. Trình bày**

Ta có $4xy=(x+y)^2-(x-y)^2=2005^2-(x-y)^2$.

Vì $x+y=2005$ là số lẻ nên $x\ne y$; do vai trò của $x,y$ như nhau, giả sử $x>y$. Khi đó $y\ge1$ và $x=2005-y\le2004$ nên $1\le x-y\le2003$.

Tích $xy$ lớn nhất khi $(x-y)^2$ nhỏ nhất, tức $x-y=1$: $x=1003$, $y=1002$, khi đó $xy=1003\cdot1002=1005006$.

Tích $xy$ nhỏ nhất khi $(x-y)^2$ lớn nhất, tức $x-y=2003$: $x=2004$, $y=1$, khi đó $xy=2004$.

Vậy $GTLN$ của $xy$ bằng $1005006$ (khi $x=1003,\ y=1002$ hoặc ngược lại) và $GTNN$ của $xy$ bằng $2004$ (khi $x=2004,\ y=1$ hoặc ngược lại).

=== V2V.122@p66
- bai: 122 · y: - · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chữ số tận cùng của luỹ thừa
- kiem: khong
- ket_qua_sach: 4
- dap_an: $GTNN=4$ khi, chẳng hạn, $m=2,\ n=3$
- ghi_chu_nghi: Máy vét cạn 1 ≤ m < 40, 1 ≤ n < 80 cho min A = 4 tại (m;n)=(2;3), khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\lvert11^m-5^n\rvert$ với $m,n$ là các số nguyên dương.
## SACH
Ta thấy $11^m$ tận cùng bằng $1$, còn $5^n$ tận cùng bằng $5$. Nếu $11^m>5^n$ thì $A$ tận cùng bằng $6$, nếu $11^m<5^n$ thì $A$ tận cùng bằng $4$.

Ta chỉ ra một trường hợp $A=4$: với $m=2$, $n=3$ thì $A=\lvert121-125\rvert=4$.

Như vậy $\min A=4$ khi, chẳng hạn, $m=2$, $n=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Luỹ thừa của $11$ luôn tận cùng bằng $1$ và luỹ thừa của $5$ luôn tận cùng bằng $5$, nên chữ số tận cùng của hiệu hai luỹ thừa không thể tuỳ ý, và nó loại hết các giá trị nhỏ hơn $4$.

**Bước 1.** Xác định chữ số tận cùng của $11^m$ (là $1$) và của $5^n$ (là $5$) với mọi số nguyên dương $m,n$.

**Bước 2.** Xét hai trường hợp $11^m>5^n$ và $11^m<5^n$ (không thể bằng nhau vì tận cùng khác nhau) để biết chữ số tận cùng của $A$ trong mỗi trường hợp, rồi suy ra $A$ không nhỏ hơn $4$.

**Bước 3.** Thử vài cặp $(m;n)$ nhỏ để tìm một cặp cho $A$ đúng bằng cận đó, từ đó kết luận giá trị nhỏ nhất.

**Chú ý:** Chỉ ra cận dưới thôi chưa đủ, bài này bắt buộc phải tìm được một cặp $(m;n)$ cho $A=4$; nếu không có cặp đó thì cận dưới $4$ chưa phải là giá trị nhỏ nhất.

**Phần 2. Trình bày**

Với mọi số nguyên dương $m,n$: $11^m$ tận cùng bằng $1$, $5^n$ tận cùng bằng $5$; do đó $11^m\ne5^n$.

Nếu $11^m>5^n$ thì $A=11^m-5^n$ tận cùng bằng $6$, nên $A\ge6$.

Nếu $11^m<5^n$ thì $A=5^n-11^m$ tận cùng bằng $4$, nên $A\ge4$.

Vậy $A\ge4$ với mọi $m,n$.

Với $m=2$, $n=3$: $A=\lvert121-125\rvert=4$.

Vậy $GTNN$ của $A$ bằng $4$, đạt khi, chẳng hạn, $m=2,\ n=3$.

=== V2B.418a@p66
- bai: 418 · y: a · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: -\dfrac{21}{4}
- dap_an: $GTNN=-\dfrac{21}{4}$ khi $x=\dfrac{5}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min A = -21/4 tại x = 5/2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của $A=x^2-5x+1$.
## SACH
a) $\min A=-\dfrac{21}{4}\Leftrightarrow x=\dfrac{5}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $A$ là tam thức bậc hai có hệ số của $x^2$ dương, nên có giá trị nhỏ nhất; muốn thấy nó thì phải đưa $A$ về dạng bình phương của một nhị thức cộng một hằng số.

**Bước 1.** Coi $-5x$ là hai lần tích $x\cdot\dfrac{5}{2}$ (với dấu trừ) để biết cần cộng và trừ $\left(\dfrac{5}{2}\right)^2=\dfrac{25}{4}$.

**Bước 2.** Gom $x^2-5x+\dfrac{25}{4}$ thành $\left(x-\dfrac{5}{2}\right)^2$ và cộng các hằng số còn lại.

**Bước 3.** Dùng bình phương không âm để chặn $A$ từ dưới và tìm $x$ làm bình phương bằng $0$.

**Phần 2. Trình bày**

$A=x^2-5x+1=\left(x^2-5x+\dfrac{25}{4}\right)-\dfrac{25}{4}+1$

$=\left(x-\dfrac{5}{2}\right)^2-\dfrac{21}{4}\ge-\dfrac{21}{4}$

Dấu "=" xảy ra khi $x-\dfrac{5}{2}=0$, tức $x=\dfrac{5}{2}$.

Vậy $GTNN$ của $A$ bằng $-\dfrac{21}{4}$, đạt khi $x=\dfrac{5}{2}$.

=== V2B.418b@p66
- bai: 418 · y: b · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{13}{4}
- dap_an: $GTLN=\dfrac{13}{4}$ khi $x=\dfrac{3}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: max B = 13/4 tại x = 3/2, khớp sách.
## DE
Tìm giá trị lớn nhất của $B=1-x^2+3x$.
## SACH
b) $\max B=\dfrac{13}{4}\Leftrightarrow x=\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số của $x^2$ là âm, nên $B$ có giá trị lớn nhất; phải đưa $B$ về dạng "hằng số trừ một bình phương".

**Bước 1.** Đặt dấu trừ ra ngoài nhóm các hạng tử chứa $x$ để được $-(x^2-3x)$, rồi cộng và trừ $\left(\dfrac{3}{2}\right)^2=\dfrac{9}{4}$ để hoàn thành bình phương.

**Bước 2.** Viết $B$ dưới dạng $\dfrac{13}{4}-\left(x-\dfrac{3}{2}\right)^2$ bằng cách gộp các hằng số.

**Bước 3.** Vì bình phương không âm nên $B$ không vượt quá hằng số đó, và dấu "=" xảy ra khi bình phương bằng $0$.

**Phần 2. Trình bày**

$B=1-x^2+3x=1-\left(x^2-3x+\dfrac{9}{4}\right)+\dfrac{9}{4}$

$=\dfrac{13}{4}-\left(x-\dfrac{3}{2}\right)^2\le\dfrac{13}{4}$

Dấu "=" xảy ra khi $x-\dfrac{3}{2}=0$, tức $x=\dfrac{3}{2}$.

Vậy $GTLN$ của $B$ bằng $\dfrac{13}{4}$, đạt khi $x=\dfrac{3}{2}$.

=== V2B.419a@p66
- bai: 419 · y: a · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ đối xứng (y = x+7) · luỹ thừa chẵn không âm
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=-7$
- ghi_chu_nghi: Máy vét lưới mịn: min A = 2 tại x = -7, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=(x+8)^4+(x+6)^4$.
## SACH
a) Đặt $x+7=y$, $A=2y^4+12y^2+2\ge2$.

$\min A=2\Leftrightarrow y=0\Leftrightarrow x=-7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai nhị thức $x+8$ và $x+6$ nằm cách đều $x+7$; đặt $y=x+7$ thì chúng thành $y+1$ và $y-1$, và khi khai triển luỹ thừa bốn các hạng tử bậc lẻ triệt tiêu nhau.

**Bước 1.** Đặt $y=x+7$ vì $x+7$ là trung bình cộng của $x+8$ và $x+6$.

**Bước 2.** Khai triển $(y+1)^4+(y-1)^4$: các hạng tử bậc lẻ đối nhau nên mất đi, chỉ còn hạng tử bậc bốn, bậc hai và hằng số.

**Bước 3.** Dùng $y^4\ge0$ và $y^2\ge0$ để chặn $A$ từ dưới, dấu "=" xảy ra khi $y=0$.

**Phần 2. Trình bày**

Đặt $y=x+7$, khi đó

$A=(y+1)^4+(y-1)^4=2y^4+12y^2+2\ge2$ (vì $y^4\ge0$, $y^2\ge0$)

Dấu "=" xảy ra khi $y=0$, tức $x=-7$.

Vậy $GTNN$ của $A$ bằng $2$, đạt khi $x=-7$.

=== V2B.419b@p66
- bai: 419 · y: b · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y = |...| ≥ 0 · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: -\dfrac{9}{4}
- dap_an: $GTNN=-\dfrac{9}{4}$ khi $x=1$ hoặc $x=-3$
- ghi_chu_nghi: Máy vét lưới mịn: min B = -9/4 tại x = 1 và x = -3, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=(0{,}5x^2+x)^2-3\lvert0{,}5x^2+x\rvert$.
## SACH
b) Đặt $\lvert0{,}5x^2+x\rvert=y$; $\min B=-\dfrac{9}{4}\Leftrightarrow y=\dfrac{3}{2}$; $x_1=1$; $x_2=-3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức chỉ phụ thuộc vào $\left\lvert\dfrac{x^2}{2}+x\right\rvert$ vì bình phương của một số bằng bình phương giá trị tuyệt đối của nó; đặt ẩn phụ $y$ cho giá trị tuyệt đối đó thì $B$ trở thành tam thức bậc hai theo $y$ với $y\ge0$.

**Bước 1.** Đặt ẩn phụ $y=\left\lvert\dfrac{x^2}{2}+x\right\rvert\ge0$ để biểu thức chỉ còn một biến, vì bình phương của một số bằng bình phương giá trị tuyệt đối của nó nên $B=y^2-3y$.

**Bước 2.** Đưa $y^2-3y$ về dạng $\left(y-\dfrac{3}{2}\right)^2-\dfrac{9}{4}$ để chặn $B$ từ dưới.

**Bước 3.** Kiểm tra giá trị $y=\dfrac{3}{2}$ có đạt được không bằng cách giải $\left\lvert\dfrac{x^2}{2}+x\right\rvert=\dfrac{3}{2}$ theo hai trường hợp dấu.

**Chú ý:** Điều kiện $y\ge0$ phải được kiểm; ở bài này điểm tối ưu $y=\dfrac{3}{2}$ dương nên chấp nhận được, nhưng nếu nó âm thì cận dưới không đạt.

**Phần 2. Trình bày**

Đặt $y=\left\lvert\dfrac{x^2}{2}+x\right\rvert\ge0$. Khi đó

$B=y^2-3y=\left(y-\dfrac{3}{2}\right)^2-\dfrac{9}{4}\ge-\dfrac{9}{4}$

Dấu "=" xảy ra khi $y=\dfrac{3}{2}$, tức $\dfrac{x^2}{2}+x=\dfrac{3}{2}$ hoặc $\dfrac{x^2}{2}+x=-\dfrac{3}{2}$.

Trường hợp $\dfrac{x^2}{2}+x=\dfrac{3}{2}$: $x^2+2x-3=0\Leftrightarrow(x-1)(x+3)=0$, được $x=1$ hoặc $x=-3$.

Trường hợp $\dfrac{x^2}{2}+x=-\dfrac{3}{2}$: $x^2+2x+3=(x+1)^2+2>0$, vô nghiệm.

Vậy $GTNN$ của $B$ bằng $-\dfrac{9}{4}$, đạt khi $x=1$ hoặc $x=-3$.

=== V2B.419c@p66
- bai: 419 · y: c · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: nhân hai nhân tử để xuất hiện biểu thức chung · đặt ẩn phụ y = x²−4x+3
- kiem: khong
- ket_qua_sach: -1
- dap_an: $GTNN=-1$ khi $x=2$
- ghi_chu_nghi: Máy vét lưới mịn: min C = -1 tại x = 2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $C=(x-1)(x-3)(x^2-4x+5)$.
## SACH
c) Đặt $x^2-4x+3=y$; $\min C=-1\Leftrightarrow x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhân $(x-1)(x-3)$ ra $x^2-4x+3$ thì hai nhân tử bậc hai $x^2-4x+3$ và $x^2-4x+5$ chỉ khác nhau một hằng số, nên đặt $y=x^2-4x+3$ để đưa $C$ về tam thức bậc hai theo $y$.

**Bước 1.** Nhân $(x-1)(x-3)$ để được $x^2-4x+3$ và đối chiếu với nhân tử $x^2-4x+5$ để thấy hai biểu thức sai khác $2$.

**Bước 2.** Đặt $y=x^2-4x+3$ rồi viết $C=y(y+2)$ và đưa về dạng bình phương cộng hằng số.

**Bước 3.** Kiểm tra giá trị $y=-1$ làm bình phương bằng $0$ có đạt được bởi một giá trị của $x$ hay không.

**Chú ý:** Biến $y=(x-2)^2-1$ chỉ nhận giá trị $\ge-1$, và điểm tối ưu $y=-1$ nằm đúng mép, nên phải chỉ ra $x=2$ để chắc chắn dấu "=" đạt được.

**Phần 2. Trình bày**

$C=(x-1)(x-3)(x^2-4x+5)=(x^2-4x+3)(x^2-4x+5)$

Đặt $y=x^2-4x+3$ thì $C=y(y+2)=(y+1)^2-1\ge-1$

Dấu "=" xảy ra khi $y=-1$, tức $x^2-4x+4=0\Leftrightarrow x=2$.

Vậy $GTNN$ của $C$ bằng $-1$, đạt khi $x=2$.

=== V2B.419d@p66
- bai: 419 · y: d · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: nhận ra bình phương của tam thức · bình phương của số dương
- kiem: khong
- ket_qua_sach: \dfrac{9}{16}
- dap_an: $GTNN=\dfrac{9}{16}$ khi $x=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min D = 9/16 tại x = 1/2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $D=x^4-2x^3+3x^2-2x+1$.
## SACH
d) $D=(x^2-x+1)^2$; $\min D=\dfrac{9}{16}\Leftrightarrow x=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các hệ số $1,-2,3,-2,1$ đối xứng và hạng tử đầu $x^4$, hạng tử cuối $1$ đều là bình phương, nên $D$ rất có thể là bình phương của một tam thức dạng $x^2+px+q$.

**Bước 1.** Đồng nhất $D$ với $(x^2+px+q)^2$: hệ số $x^3$ cho $p=-1$, hạng tử tự do cho $q=1$, rồi kiểm tra hệ số $x^2$ và $x$ có khớp không.

**Bước 2.** Đưa tam thức $x^2-x+1$ về dạng $\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}$ để chặn nó từ dưới bằng một số dương.

**Bước 3.** Bình phương hai vế của bất đẳng thức giữa hai số dương để chặn $D$, và tìm $x$ làm dấu "=" xảy ra.

**Chú ý:** Chỉ được bình phương hai vế của $x^2-x+1\ge\dfrac{3}{4}$ vì cả hai vế đều dương; nếu một vế âm thì bước đó sai.

**Phần 2. Trình bày**

Ta có $D=(x^2-x+1)^2$ (khai triển vế phải ra đúng $x^4-2x^3+3x^2-2x+1$).

$x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}>0$

nên $D=(x^2-x+1)^2\ge\left(\dfrac{3}{4}\right)^2=\dfrac{9}{16}$

Dấu "=" xảy ra khi $x-\dfrac{1}{2}=0$, tức $x=\dfrac{1}{2}$.

Vậy $GTNN$ của $D$ bằng $\dfrac{9}{16}$, đạt khi $x=\dfrac{1}{2}$.

=== V2B.419e@p66
- bai: 419 · y: e · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tổng các bình phương ≥ 0
- kiem: khong
- ket_qua_sach: 0
- dap_an: $GTNN=0$ khi $x=3$
- ghi_chu_nghi: Máy vét lưới mịn: min E = 0 tại x = 3, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $E=x^4-6x^3+10x^2-6x+9$.
## SACH
e) $E=(x^2-3x)^2+(x-3)^2\ge0$; $\min E=0\Leftrightarrow x=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai hạng tử đầu $x^4-6x^3$ gợi ra bình phương $(x^2-3x)^2=x^4-6x^3+9x^2$, và phần còn lại sau khi lấy $9x^2$ từ $10x^2$ là $x^2-6x+9=(x-3)^2$, nên $E$ là tổng hai bình phương.

**Bước 1.** Tách $10x^2=9x^2+x^2$ để ba hạng tử $x^4-6x^3+9x^2$ gom thành $(x^2-3x)^2$.

**Bước 2.** Nhận ra ba hạng tử còn lại $x^2-6x+9$ là $(x-3)^2$, từ đó viết $E$ thành tổng hai bình phương.

**Bước 3.** Chặn $E\ge0$ rồi kiểm tra có giá trị $x$ làm cả hai bình phương cùng bằng $0$ hay không.

**Chú ý:** Dấu "=" cần cả hai bình phương cùng triệt tiêu; $x=0$ làm $(x^2-3x)^2=0$ nhưng không làm $(x-3)^2=0$, nên chỉ có $x=3$.

**Phần 2. Trình bày**

$E=(x^4-6x^3+9x^2)+(x^2-6x+9)=(x^2-3x)^2+(x-3)^2\ge0$

Dấu "=" xảy ra khi $x^2-3x=0$ và $x-3=0$, tức $x=3$.

Vậy $GTNN$ của $E$ bằng $0$, đạt khi $x=3$.

=== V2B.419g@p66
- bai: 419 · y: g · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y = x²+x · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: -16
- dap_an: $GTNN=-16$ khi $x=1$ hoặc $x=-2$
- ghi_chu_nghi: Máy vét lưới mịn: min G = -16 tại x = -2 và x = 1, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $G=(x^2+x-6)(x^2+x+2)$.
## SACH
g) Đặt $x^2+x=y$. Ta có

$G=(y-6)(y+2)=y^2-4y-12=(y-2)^2-16$.

$\min G=-16\Leftrightarrow y=2$; $x_1=-2$; $x_2=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai nhân tử đều chứa cụm $x^2+x$ giống nhau, chỉ khác hằng số, nên đặt $y=x^2+x$ để $G$ trở thành tam thức bậc hai theo $y$.

**Bước 1.** Nhóm các nhân tử thành hai cặp có cùng phần biến rồi đặt ẩn phụ $y=x^2+x$ để đưa tích về một biến, được $G=(y-6)(y+2)$.

**Bước 2.** Khai triển rồi đưa về dạng bình phương cộng hằng số để chặn $G$ từ dưới.

**Bước 3.** Giải $x^2+x=2$ để chắc rằng giá trị $y$ làm dấu "=" xảy ra thật sự đạt được bởi $x$.

**Chú ý:** $y=x^2+x\ge-\dfrac{1}{4}$ nên không phải $y$ nào cũng đạt được; ở đây $y=2$ nằm trong miền đó nên hợp lệ.

**Phần 2. Trình bày**

Đặt $y=x^2+x$, khi đó

$G=(y-6)(y+2)=y^2-4y-12=(y-2)^2-16\ge-16$

Dấu "=" xảy ra khi $y=2$, tức $x^2+x-2=0\Leftrightarrow(x-1)(x+2)=0\Leftrightarrow x=1$ hoặc $x=-2$.

Vậy $GTNN$ của $G$ bằng $-16$, đạt khi $x=1$ hoặc $x=-2$.

=== V2B.420a@p66
- bai: 420 · y: a · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối)
- kiem: khong
- ket_qua_sach: 4
- dap_an: $GTNN=4$ khi $3\le x\le7$
- ghi_chu_nghi: Máy vét lưới mịn: min A = 4 tại 3 ≤ x ≤ 7, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\lvert x-3\rvert+\lvert x-7\rvert$.
## SACH
a) $A=\lvert x-3\rvert+\lvert7-x\rvert\ge x-3+7-x=4$.

$\min A=4\Leftrightarrow x-3\ge0$ và $7-x\ge0\Leftrightarrow3\le x\le7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Lật dấu $\lvert x-7\rvert=\lvert7-x\rvert$ thì hai biểu thức trong dấu giá trị tuyệt đối có tổng $4$ không chứa $x$, nên $\lvert t\rvert\ge t$ cho ngay cận dưới là hằng số.

**Bước 1.** Viết $\lvert x-7\rvert=\lvert7-x\rvert$ để hai biểu thức $x-3$ và $7-x$ có tổng bằng $4$.

**Bước 2.** Áp dụng $\lvert t\rvert\ge t$ cho từng hạng tử và cộng lại để chặn $A$ từ dưới.

**Bước 3.** Tìm điều kiện cả hai biểu thức không âm để dấu "=" xảy ra và kiểm tra tập $x$ đó khác rỗng.

**Phần 2. Trình bày**

$A=\lvert x-3\rvert+\lvert7-x\rvert\ge(x-3)+(7-x)=4$

Dấu "=" xảy ra khi $x-3\ge0$ và $7-x\ge0$, tức $3\le x\le7$.

Vậy $GTNN$ của $A$ bằng $4$, đạt khi $3\le x\le7$.

=== V2B.420b@p66
- bai: 420 · y: b · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối)
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $\dfrac{1}{2}\le x\le\dfrac{3}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min B = 2 tại 1/2 ≤ x ≤ 3/2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\lvert2x-3\rvert+\lvert2x-1\rvert$.
## SACH
b) $\min B=2\Leftrightarrow\dfrac{1}{2}\le x\le\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai biểu thức $3-2x$ và $2x-1$ có tổng bằng $2$, không còn $x$, nên sau khi lật dấu một giá trị tuyệt đối thì $\lvert t\rvert\ge t$ cho cận dưới là hằng số.

**Bước 1.** Viết $\lvert2x-3\rvert=\lvert3-2x\rvert$ để cặp biểu thức $3-2x$ và $2x-1$ có tổng không chứa $x$.

**Bước 2.** Áp dụng $\lvert t\rvert\ge t$ cho từng hạng tử rồi cộng để chặn $B$ từ dưới.

**Bước 3.** Giải hai điều kiện $3-2x\ge0$ và $2x-1\ge0$ để tìm đoạn các giá trị $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

$B=\lvert3-2x\rvert+\lvert2x-1\rvert\ge(3-2x)+(2x-1)=2$

Dấu "=" xảy ra khi $3-2x\ge0$ và $2x-1\ge0$, tức $\dfrac{1}{2}\le x\le\dfrac{3}{2}$.

Vậy $GTNN$ của $B$ bằng $2$, đạt khi $\dfrac{1}{2}\le x\le\dfrac{3}{2}$.

=== V2B.420c@p66
- bai: 420 · y: c · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối) · tam thức luôn dương
- kiem: khong
- ket_qua_sach: 3
- dap_an: $GTNN=3$ khi $-1\le x\le2$
- ghi_chu_nghi: Sách in đề không có chữ "C =", tự thêm C cho đủ nghĩa. Máy vét lưới mịn: min = 3 tại -1 ≤ x ≤ 2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $C=\lvert x^2-x+1\rvert+\lvert x^2-x-2\rvert$.
## SACH
c) Ta có $x^2-x+1>0$ nên

$C=x^2-x+1+\lvert2+x-x^2\rvert\ge x^2-x+1+2+x-x^2=3$.

$\min C=3\Leftrightarrow2+x-x^2\ge0\Leftrightarrow(x+1)(2-x)\ge0\Leftrightarrow-1\le x\le2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức $x^2-x+1$ luôn dương nên giá trị tuyệt đối đầu bỏ được; còn lại chỉ một giá trị tuyệt đối mà biểu thức trong nó, cộng với $x^2-x+1$, triệt tiêu hết $x$, nên $\lvert t\rvert\ge t$ cho cận dưới là hằng số.

**Bước 1.** Chứng tỏ $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ để bỏ dấu giá trị tuyệt đối của hạng tử đầu.

**Bước 2.** Viết $\lvert x^2-x-2\rvert=\lvert2+x-x^2\rvert$ rồi áp dụng $\lvert t\rvert\ge t$ để hai phần cộng lại thành một hằng số.

**Bước 3.** Giải điều kiện $2+x-x^2\ge0$ bằng cách phân tích thành $(x+1)(2-x)\ge0$ để tìm các $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

Vì $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ nên

$C=(x^2-x+1)+\lvert2+x-x^2\rvert\ge(x^2-x+1)+(2+x-x^2)=3$

Dấu "=" xảy ra khi $2+x-x^2\ge0\Leftrightarrow(x+1)(2-x)\ge0\Leftrightarrow-1\le x\le2$.

Vậy $GTNN$ của $C$ bằng $3$, đạt khi $-1\le x\le2$.

=== V2B.420d@p66
- bai: 420 · y: d · trang: 66 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: |t| ≥ t (giá trị tuyệt đối) · tam thức luôn dương
- kiem: khong
- ket_qua_sach: 9
- dap_an: $GTNN=9$ khi $-3\le x\le2$
- ghi_chu_nghi: Máy vét lưới mịn: min D = 9 tại -3 ≤ x ≤ 2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $D=\lvert x^2+x+3\rvert+\lvert x^2+x-6\rvert$.
## SACH
d) $\min D=9\Leftrightarrow-3\le x\le2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai biểu thức $x^2+x+3$ và $6-x^2-x$ có tổng bằng $9$, không chứa $x$, nên sau khi lật dấu giá trị tuyệt đối thứ hai thì $\lvert t\rvert\ge t$ cho cận dưới là hằng số.

**Bước 1.** Viết $\lvert x^2+x-6\rvert=\lvert6-x^2-x\rvert$ để hai biểu thức trong dấu giá trị tuyệt đối có tổng $9$.

**Bước 2.** Áp dụng $\lvert t\rvert\ge t$ cho cả hai hạng tử rồi cộng lại để chặn $D$ từ dưới.

**Bước 3.** Xét hai điều kiện dấu "=": hạng tử đầu luôn thoả vì $x^2+x+3>0$, còn hạng tử sau cho bất phương trình $x^2+x-6\le0$ cần giải để tìm đoạn $x$.

**Phần 2. Trình bày**

$D=\lvert x^2+x+3\rvert+\lvert6-x^2-x\rvert\ge(x^2+x+3)+(6-x^2-x)=9$

Dấu "=" xảy ra khi $x^2+x+3\ge0$ và $6-x^2-x\ge0$.

Vì $x^2+x+3=\left(x+\dfrac{1}{2}\right)^2+\dfrac{11}{4}>0$ nên điều kiện còn lại là $x^2+x-6\le0\Leftrightarrow(x+3)(x-2)\le0\Leftrightarrow-3\le x\le2$.

Vậy $GTNN$ của $D$ bằng $9$, đạt khi $-3\le x\le2$.

=== V2B.421@p67
- bai: 421 · y: - · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phép thế từ ràng buộc bậc nhất · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{1}{3}
- dap_an: $GTNN=\dfrac{1}{3}$ khi $x=y=\dfrac{1}{3}$
- ghi_chu_nghi: Máy vét lưới mịn sau khi thế: min = 1/3 tại x = y = 1/3, khớp sách.
## DE
Cho $x+2y=1$. Tìm giá trị nhỏ nhất của $x^2+2y^2$.
## SACH
Thay $x=1-2y$ vào $A=x^2+2y^2$, được $A=6y^2-4y+1$.

$\min A=\dfrac{1}{3}\Leftrightarrow y=\dfrac{1}{3}$, $x=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ràng buộc $x+2y=1$ là bậc nhất nên rút được một ẩn theo ẩn kia; thế vào biểu thức thì bài trở thành tìm giá trị nhỏ nhất của một tam thức bậc hai theo một biến.

**Bước 1.** Rút $x=1-2y$ từ điều kiện và thế vào $x^2+2y^2$ để chỉ còn biến $y$.

**Bước 2.** Khai triển, thu gọn rồi đưa tam thức bậc hai theo $y$ về dạng bình phương cộng hằng số.

**Bước 3.** Chặn từ dưới bằng bình phương không âm, rồi từ giá trị $y$ làm dấu "=" suy ra $x$ nhờ ràng buộc.

**Phần 2. Trình bày**

Từ $x+2y=1$ suy ra $x=1-2y$. Khi đó

$x^2+2y^2=(1-2y)^2+2y^2=6y^2-4y+1=6\left(y-\dfrac{1}{3}\right)^2+\dfrac{1}{3}\ge\dfrac{1}{3}$

Dấu "=" xảy ra khi $y=\dfrac{1}{3}$, khi đó $x=1-\dfrac{2}{3}=\dfrac{1}{3}$.

Vậy $GTNN$ của $x^2+2y^2$ bằng $\dfrac{1}{3}$, đạt khi $x=y=\dfrac{1}{3}$.

=== V2B.422@p67
- bai: 422 · y: - · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phép thế từ ràng buộc bậc nhất · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: 5
- dap_an: $GTNN=5$ khi $x=\dfrac{10}{7},\ y=-\dfrac{3}{7}$
- ghi_chu_nghi: Máy vét lưới mịn sau khi thế: min = 5 tại x = 10/7, y = -3/7, khớp sách.
## DE
Cho $4x-3y=7$. Tìm giá trị nhỏ nhất của $2x^2+5y^2$.
## SACH
Thay $y=\dfrac{4x-7}{3}$ vào $B=2x^2+5y^2$ được

$9B=98x^2-280x+245=2(7x-10)^2+45\ge45$.

$\min B=5\Leftrightarrow x=\dfrac{10}{7}$, $y=-\dfrac{3}{7}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ràng buộc $4x-3y=7$ là bậc nhất nên rút được $y$ theo $x$; thế vào thì biểu thức thành tam thức bậc hai theo $x$, nhưng có mẫu $9$ nên nhân lên cho hết mẫu rồi mới đưa về bình phương.

**Bước 1.** Rút $y=\dfrac{4x-7}{3}$ từ điều kiện và thế vào $2x^2+5y^2$.

**Bước 2.** Nhân biểu thức với $9$ để khử mẫu, khai triển và thu gọn thành tam thức bậc hai theo $x$.

**Bước 3.** Đưa tam thức này về dạng $2(7x-10)^2$ cộng hằng số để chặn từ dưới, rồi tính $y$ từ giá trị $x$ làm dấu "=" xảy ra.

**Chú ý:** Nhớ chia lại cho $9$ khi kết luận, vì ta đã đánh giá $9B$ chứ không phải $B$.

**Phần 2. Trình bày**

Đặt $B=2x^2+5y^2$. Từ $4x-3y=7$ suy ra $y=\dfrac{4x-7}{3}$, nên

$9B=18x^2+5(4x-7)^2=98x^2-280x+245=2(7x-10)^2+45\ge45$

Do đó $B\ge5$. Dấu "=" xảy ra khi $7x-10=0$, tức $x=\dfrac{10}{7}$, khi đó $y=\dfrac{4\cdot\dfrac{10}{7}-7}{3}=-\dfrac{3}{7}$.

Vậy $GTNN$ của $2x^2+5y^2$ bằng $5$, đạt khi $x=\dfrac{10}{7},\ y=-\dfrac{3}{7}$.

=== V2B.423@p67
- bai: 423 · y: - · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ đối xứng (a = 1/2 + t, b = 1/2 − t)
- kiem: khong
- ket_qua_sach: \dfrac{1}{8}
- dap_an: $GTNN=\dfrac{1}{8}$ khi $a=b=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min a⁴+b⁴ = 1/8 tại a = b = 1/2, khớp sách. Sách dùng bất đẳng thức a⁴+b⁴ ≥ (a+b)⁴/8 (không chứng minh); GIAI dùng ẩn phụ đối xứng để tự chứng minh được.
## DE
Cho $a+b=1$. Tìm giá trị nhỏ nhất của $a^4+b^4$.
## SACH
Ta chứng minh được $a^4+b^4\ge\dfrac{(a+b)^4}{8}=\dfrac{1}{8}$;

$\min(a^4+b^4)=\dfrac{1}{8}\Leftrightarrow a=b=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+b=1$ đối xứng quanh $\dfrac{1}{2}$, nên đặt $a=\dfrac{1}{2}+t$, $b=\dfrac{1}{2}-t$ thì khi khai triển luỹ thừa bốn các hạng tử bậc lẻ của $t$ triệt tiêu và chỉ còn các luỹ thừa chẵn không âm.

**Bước 1.** Đặt $a=\dfrac{1}{2}+t$ và $b=\dfrac{1}{2}-t$ với $t$ thực bất kì, vì cặp này luôn có tổng bằng $1$.

**Bước 2.** Khai triển $a^4+b^4$ bằng công thức nhị thức: các hạng tử chứa $t$ và $t^3$ đối nhau nên mất đi.

**Bước 3.** Dùng $t^2\ge0$ và $t^4\ge0$ để chặn từ dưới, rồi đọc dấu "=" ở $t=0$ để suy ra $a,b$.

**Phần 2. Trình bày**

Đặt $a=\dfrac{1}{2}+t$, $b=\dfrac{1}{2}-t$ (khi đó $a+b=1$). Ta có

$a^4+b^4=2\left[\left(\dfrac{1}{2}\right)^4+6\left(\dfrac{1}{2}\right)^2t^2+t^4\right]=\dfrac{1}{8}+3t^2+2t^4\ge\dfrac{1}{8}$

Dấu "=" xảy ra khi $t=0$, tức $a=b=\dfrac{1}{2}$.

Vậy $GTNN$ của $a^4+b^4$ bằng $\dfrac{1}{8}$, đạt khi $a=b=\dfrac{1}{2}$.

=== V2B.424@p67
- bai: 424 · y: - · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: (a+b)³ = a³+b³+3ab(a+b) · tổng không đổi ⇒ tích lớn nhất
- kiem: khong
- ket_qua_sach: \dfrac{1}{4}
- dap_an: $GTNN=\dfrac{1}{4}$ khi $a=b=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min a³+b³ = 1/4 tại a = b = 1/2, khớp sách.
## DE
Cho $a+b=1$. Tìm giá trị nhỏ nhất của $a^3+b^3$.
## SACH
$(a+b)^3=a^3+b^3+3ab(a+b)\Rightarrow1=(a^3+b^3)+3ab$. Do đó $a^3+b^3$ nhỏ nhất $\Leftrightarrow ab$ lớn nhất.

Ta lại có $a+b=1$ nên $ab$ lớn nhất $\Leftrightarrow a=b=\dfrac{1}{2}$. Khi đó $a^3+b^3=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khai triển $(a+b)^3$ liên hệ $a^3+b^3$ với tích $ab$ khi biết $a+b=1$, nên bài chuyển thành tìm giá trị lớn nhất của $ab$ với tổng cố định.

**Bước 1.** Viết $a^3+b^3=(a+b)^3-3ab(a+b)$ rồi thay $a+b=1$ để biểu thức chỉ còn phụ thuộc $ab$.

**Bước 2.** Chặn $ab$ từ trên bằng $ab\le\left(\dfrac{a+b}{2}\right)^2$, bất đẳng thức tương đương $(a-b)^2\ge0$ và đúng với mọi số thực.

**Bước 3.** Suy ra cận dưới của $a^3+b^3$ rồi tìm $a,b$ làm dấu "=" xảy ra, tức $a=b$ cùng với $a+b=1$.

**Chú ý:** Hệ số của $ab$ là $-3$, âm, nên $ab$ lớn thì $a^3+b^3$ nhỏ; đừng đảo chiều bất đẳng thức khi nhân với số âm.

**Phần 2. Trình bày**

$a^3+b^3=(a+b)^3-3ab(a+b)=1-3ab$

Vì $(a-b)^2\ge0$ nên $ab\le\dfrac{(a+b)^2}{4}=\dfrac{1}{4}$, do đó $a^3+b^3=1-3ab\ge1-\dfrac{3}{4}=\dfrac{1}{4}$

Dấu "=" xảy ra khi $a=b$, kết hợp $a+b=1$ được $a=b=\dfrac{1}{2}$.

Vậy $GTNN$ của $a^3+b^3$ bằng $\dfrac{1}{4}$, đạt khi $a=b=\dfrac{1}{2}$.

=== V2B.425@p67
- bai: 425 · y: - · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x²+1 ≥ 2|x| (từ (|x|−1)² ≥ 0) · giá trị tuyệt đối
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=y=1$ hoặc $x=y=-1$
- ghi_chu_nghi: Máy vét lưới mịn: min |x+y| = 2 tại x = y = ±1, khớp sách.
## DE
Cho $xy=1$. Tìm giá trị nhỏ nhất của $\lvert x+y\rvert$.
## SACH
$\lvert x+y\rvert=\left\lvert x+\dfrac{1}{x}\right\rvert=\dfrac{x^2+1}{\lvert x\rvert}\ge2$ vì $(\lvert x\rvert-1)^2\ge0$;

$\min\lvert x+y\rvert=2\Leftrightarrow\lvert x\rvert=1\Leftrightarrow x=\pm1$, khi đó $y=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $xy=1$ cho $y=\dfrac{1}{x}$, đưa $\lvert x+y\rvert$ về một biến dạng $\dfrac{x^2+1}{\lvert x\rvert}$; tử có $x^2+1$ nên bất đẳng thức $(\lvert x\rvert-1)^2\ge0$ chặn nó.

**Bước 1.** Từ $xy=1$ suy ra $x\ne0$ và $y=\dfrac{1}{x}$, rồi quy đồng để $\lvert x+y\rvert=\dfrac{x^2+1}{\lvert x\rvert}$.

**Bước 2.** Dùng $x^2=\lvert x\rvert^2$ và $(\lvert x\rvert-1)^2\ge0$ để chứng minh $x^2+1\ge2\lvert x\rvert$.

**Bước 3.** Chia hai vế cho $\lvert x\rvert>0$ để chặn $\lvert x+y\rvert$ từ dưới, rồi tìm $x,y$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

Vì $xy=1$ nên $x\ne0$ và $y=\dfrac{1}{x}$, do đó

$\lvert x+y\rvert=\left\lvert x+\dfrac{1}{x}\right\rvert=\dfrac{x^2+1}{\lvert x\rvert}$

Vì $(\lvert x\rvert-1)^2\ge0$ nên $x^2+1\ge2\lvert x\rvert$, suy ra $\lvert x+y\rvert\ge2$.

Dấu "=" xảy ra khi $\lvert x\rvert=1$, tức $x=\pm1$, khi đó $y=\dfrac{1}{x}=x$.

Vậy $GTNN$ của $\lvert x+y\rvert$ bằng $2$, đạt khi $x=y=1$ hoặc $x=y=-1$.

=== V2B.426a@p67
- bai: 426 · y: a · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng các bình phương ≥ 0 (tách hạng tử)
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=y=1$
- ghi_chu_nghi: Máy vét lưới 2 biến: min A = 2 tại (1;1), khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=2x^2+y^2-2xy-2x+3$.
## SACH
a) $A=x^2-2xy+y^2+x^2-2x+1+2=(x-y)^2+(x-1)^2+2\ge2$,

$\min A=2\Leftrightarrow x=y=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức có $-2xy$ đi cùng $x^2+y^2$ gợi ra $(x-y)^2$; phần $x^2$ còn lại cùng $-2x$ gợi ra $(x-1)^2$, nên $A$ viết được thành tổng hai bình phương cộng hằng số.

**Bước 1.** Tách $2x^2=x^2+x^2$ để một $x^2$ ghép với $-2xy+y^2$ thành $(x-y)^2$.

**Bước 2.** Ghép $x^2$ còn lại với $-2x$ và lấy $1$ từ hằng số $3$ để được $(x-1)^2$, phần dư còn lại là $2$.

**Bước 3.** Chặn $A$ từ dưới bằng hai bình phương không âm và giải hệ $x-y=0$, $x-1=0$ để tìm điểm đạt dấu "=".

**Phần 2. Trình bày**

$A=(x^2-2xy+y^2)+(x^2-2x+1)+2=(x-y)^2+(x-1)^2+2\ge2$

Dấu "=" xảy ra khi $x-y=0$ và $x-1=0$, tức $x=y=1$.

Vậy $GTNN$ của $A$ bằng $2$, đạt khi $x=y=1$.

=== V2B.426b@p67
- bai: 426 · y: b · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tổng các bình phương ≥ 0 (tách hạng tử)
- kiem: khong
- ket_qua_sach: 0
- dap_an: $GTNN=0$ khi $x=3,\ y=4$
- ghi_chu_nghi: Máy vét lưới 2 biến: min B = 0 tại (3;4), khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=x^2-2xy+2y^2+2x-10y+17$.
## SACH
b) $B=(x-y)^2+2(x-y)+1+(y-4)^2=(x-y+1)^2+(y-4)^2\ge0$.

$\min B=0\Leftrightarrow x=3$; $y=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các hạng tử có $x$ là $x^2-2xy+2x$; tách $2y^2=y^2+y^2$ thì $x^2-2xy+y^2+2x$ gợi ra $(x-y)^2+2(x-y)$, tức là $(x-y+1)^2$ sau khi bù hằng số $1$.

**Bước 1.** Tách $2y^2=y^2+y^2$ và viết $2x-2y$ để gom $x^2-2xy+y^2+2(x-y)$ thành $(x-y)^2+2(x-y)$.

**Bước 2.** Bù $+1$ để được $(x-y+1)^2$, rồi chuyển phần còn lại thành $y^2-8y+16=(y-4)^2$.

**Bước 3.** Chặn $B$ từ dưới bằng tổng hai bình phương và giải hệ $x-y+1=0$, $y-4=0$.

**Phần 2. Trình bày**

$B=(x^2-2xy+y^2)+2(x-y)+1+(y^2-8y+16)=(x-y+1)^2+(y-4)^2\ge0$

Dấu "=" xảy ra khi $y=4$ và $x-y+1=0$, tức $x=3$, $y=4$.

Vậy $GTNN$ của $B$ bằng $0$, đạt khi $x=3,\ y=4$.

=== V2B.426c@p67
- bai: 426 · y: c · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhân đôi để tách tổng các bình phương
- kiem: khong
- ket_qua_sach: -4
- dap_an: $GTNN=-4$ khi $x=y=2$
- ghi_chu_nghi: Máy vét lưới 2 biến: min C = -4 tại (2;2), khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $C=x^2-xy+y^2-2x-2y$.
## SACH
c) $C=x^2-xy+y^2-2x-2y$;

$2C=(x-y)^2+(x-2)^2+(y-2)^2-8\ge-8$.

$\min C=-4\Leftrightarrow x=y=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các hệ số của $x^2$ và $y^2$ bằng nhau còn hệ số của $xy$ là $-1$, nên nhân đôi $C$ để có $2x^2-2xy+2y^2=x^2+y^2+(x-y)^2$ và tách được tổng các bình phương.

**Bước 1.** Nhân $C$ với $2$ để các hạng tử bậc hai thành $2x^2-2xy+2y^2$.

**Bước 2.** Viết $2x^2-2xy+2y^2=(x-y)^2+x^2+y^2$ rồi ghép $x^2-4x$ và $y^2-4y$ để hoàn thành bình phương, bù hai hằng số.

**Bước 3.** Chặn $2C$ từ dưới, chia lại cho $2$, rồi giải hệ ba đẳng thức để tìm điểm đạt dấu "=".

**Chú ý:** Đừng quên chia $2$ khi kết luận: ta chặn $2C$ chứ không phải $C$.

**Phần 2. Trình bày**

$2C=2x^2-2xy+2y^2-4x-4y=(x-y)^2+(x^2-4x+4)+(y^2-4y+4)-8$

$=(x-y)^2+(x-2)^2+(y-2)^2-8\ge-8$

Do đó $C\ge-4$. Dấu "=" xảy ra khi $x-y=0$, $x-2=0$, $y-2=0$, tức $x=y=2$.

Vậy $GTNN$ của $C$ bằng $-4$, đạt khi $x=y=2$.

=== V2B.426d@p67
- bai: 426 · y: d · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hoàn thành bình phương theo từng biến
- kiem: khong
- ket_qua_sach: -3
- dap_an: $GTNN=-3$ khi $x=y=1$
- ghi_chu_nghi: Máy vét lưới 2 biến: min D = -3 tại (1;1), khớp sách. GIAI theo "cách giải sau" (hoàn thành bình phương theo x) của sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $D=x^2+xy+y^2-3x-3y$.
## SACH
d) $D=x^2+xy+y^2-3x-3y=x^2-2x+y^2-2y+xy-x-y$;

$D+3=(x-1)^2+(y-1)^2+xy-x-y+1=(x-1)^2+(y-1)^2+(x-1)(y-1)$.

Đặt $x-1=a$, $y-1=b$ thì $D+3=a^2+b^2+ab\ge0$.

$\min D=-3\Leftrightarrow a=b=0\Leftrightarrow x=y=1$.

Nhận xét: Lời giải trên tuy trình bày gọn, nhưng có phần thiếu tự nhiên khi xét biểu thức $D+3$. Cách giải sau dài hơn nhưng đường lối giải rõ ràng hơn.

$D=x^2+xy+y^2-3x-3y=x^2+(y-3)x+y^2-3y$

$=\left[x^2+(y-3)x+\dfrac{(y-3)^2}{4}\right]+y^2-3y-\dfrac{(y-3)^2}{4}$

$=\left(x+\dfrac{y-3}{2}\right)^2+\dfrac{4y^2-12y-y^2+6y-9}{4}$

$=\left(x+\dfrac{y-3}{2}\right)^2+\dfrac{3y^2-6y-9}{4}=\left(x+\dfrac{y-3}{2}\right)^2+\dfrac{3}{4}(y-1)^2-3\ge-3$.

$\min D=-3\Leftrightarrow y=1$ và $x+\dfrac{y-3}{2}=0\Leftrightarrow y=1$, $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hạng tử $xy$ có hệ số dương nên không tách thẳng thành tổng bình phương như câu trước; ta coi $D$ là tam thức bậc hai theo $x$ (hệ số $y$ là tham số) và hoàn thành bình phương theo $x$, phần còn lại là tam thức theo $y$ rồi lại hoàn thành bình phương.

**Bước 1.** Sắp $D$ theo $x$: $D=x^2+(y-3)x+(y^2-3y)$, rồi cộng và trừ $\dfrac{(y-3)^2}{4}$ để tạo bình phương $\left(x+\dfrac{y-3}{2}\right)^2$.

**Bước 2.** Gộp phần còn lại thành tam thức bậc hai theo $y$ và đưa nó về dạng bình phương cộng hằng số.

**Bước 3.** Chặn $D$ từ dưới bằng hai số hạng không âm cộng một hằng số, rồi giải hệ hai điều kiện (theo $y$ trước, theo $x$ sau).

**Chú ý:** Cách của sách đặt $x-1=a$, $y-1=b$ để $D+3=a^2+ab+b^2$ ngắn hơn, nhưng phải chứng minh $a^2+ab+b^2\ge0$ bằng $\left(a+\dfrac{b}{2}\right)^2+\dfrac{3b^2}{4}$ chứ không được nói "hiển nhiên".

**Phần 2. Trình bày**

$D=x^2+(y-3)x+y^2-3y=\left[x^2+(y-3)x+\dfrac{(y-3)^2}{4}\right]+y^2-3y-\dfrac{(y-3)^2}{4}$

$=\left(x+\dfrac{y-3}{2}\right)^2+\dfrac{3y^2-6y-9}{4}$

$=\left(x+\dfrac{y-3}{2}\right)^2+\dfrac{3}{4}(y-1)^2-3\ge-3$

Dấu "=" xảy ra khi $y-1=0$ và $x+\dfrac{y-3}{2}=0$, tức $y=1$ và $x=1$.

Vậy $GTNN$ của $D$ bằng $-3$, đạt khi $x=y=1$.

=== V2B.426e@p67
- bai: 426 · y: e · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: hoàn thành bình phương theo từng biến
- kiem: khong
- ket_qua_sach: -26
- dap_an: $GTNN=-26$ khi $x=1,\ y=2$
- ghi_chu_nghi: bài *. Máy vét lưới 2 biến: min E = -26 tại (1;2), khớp sách. Sách in một bước trung gian thiếu số mũ ở x (chép x²).
## DE
Tìm giá trị nhỏ nhất của biểu thức $E=2x^2+2xy+5y^2-8x-22y$.
## SACH
e) Giải theo nhận xét ở câu d.

$E=2x^2+2xy+5y^2-8x-22y=2(x^2+yx-4x)+5y^2-22y$

$=2\left[x^2+(y-4)x+\dfrac{(y-4)^2}{4}\right]+5y^2-22y-\dfrac{(y-4)^2}{2}$

Tiếp tục biến đổi được $E=2\left(x+\dfrac{y-4}{2}\right)^2+\dfrac{9}{2}(y-2)^2-26$.

$\min E=-26\Leftrightarrow x=1$ và $y=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cũng như câu trước, có $xy$ nên coi $E$ là tam thức bậc hai theo $x$; vì hệ số của $x^2$ là $2$ nên đặt $2$ ra ngoài khi hoàn thành bình phương, rồi phần còn lại là tam thức theo $y$.

**Bước 1.** Nhóm các hạng tử chứa $x$ thành $2\left[x^2+(y-4)x\right]$ rồi cộng và trừ $\dfrac{(y-4)^2}{4}$ trong ngoặc để có $\left(x+\dfrac{y-4}{2}\right)^2$.

**Bước 2.** Gộp các hạng tử chỉ chứa $y$ còn lại thành tam thức bậc hai theo $y$ và hoàn thành bình phương cho nó.

**Bước 3.** Chặn $E$ từ dưới bằng hai số hạng không âm cộng một hằng số, rồi giải hệ theo $y$ trước, theo $x$ sau.

**Chú ý:** Khi nhóm $2x^2+(2y-8)x$ phải đặt thừa số $2$ ra ngoài; phần bù ngoài ngoặc là $-\dfrac{(y-4)^2}{2}$ (chứ không phải $-\dfrac{(y-4)^2}{4}$), vì trong ngoặc ta cộng $\dfrac{(y-4)^2}{4}$ và ngoặc được nhân với $2$.

**Phần 2. Trình bày**

$E=2\left[x^2+(y-4)x\right]+5y^2-22y=2\left[x^2+(y-4)x+\dfrac{(y-4)^2}{4}\right]-\dfrac{(y-4)^2}{2}+5y^2-22y$

$=2\left(x+\dfrac{y-4}{2}\right)^2+\dfrac{9y^2-36y-16}{2}$

$=2\left(x+\dfrac{y-4}{2}\right)^2+\dfrac{9}{2}(y-2)^2-26\ge-26$

Dấu "=" xảy ra khi $y-2=0$ và $x+\dfrac{y-4}{2}=0$, tức $y=2$ và $x=1$.

Vậy $GTNN$ của $E$ bằng $-26$, đạt khi $x=1,\ y=2$.

=== V2B.427a@p67
- bai: 427 · y: a · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tách phần nguyên của phân thức · tam thức luôn dương · cận không đạt thì không phải GTNN
- kiem: khong
- ket_qua_sach: \dfrac{7}{2}
- dap_an: Không có GTNN ($A>3$ và $A$ gần $3$ tuỳ ý khi $\lvert x\rvert$ lớn); $GTLN=\dfrac{7}{2}$ khi $x=1$
- ghi_chu_nghi: SÁCH/ĐỀ NGHI SAI CHỮ: đề in "Tìm GTNN" cho cả bốn câu a–d, nhưng câu a có A = 3 + 2/(x²-2x+5) > 3 và không đạt 3 nên KHÔNG có GTNN; lời giải sách ghi "max A = 3½ ⇔ x = 1" (tức đề gốc là GTLN). Máy vét lưới: inf A = 3 không đạt, max A = 3,5 tại x = 1. Chép đề đúng như in; GIAI nêu cả hai kết luận. Cần người xác nhận có đổi đề thành "tìm GTLN" hay không.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\dfrac{3x^2-6x+17}{x^2-2x+5}$.
## SACH
a) $A=3+\dfrac{2}{x^2-2x+5}$. Đáp số: $\max A=3\dfrac{1}{2}\Leftrightarrow x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử và mẫu cùng là tam thức bậc hai, nên chia tử cho mẫu để tách phần nguyên; phần còn lại là một phân thức có tử hằng số và mẫu là tam thức luôn dương, mẫu đó có giá trị nhỏ nhất nên chặn được phân thức.

**Bước 1.** Tách tử số thành một bội của mẫu số cộng với một hằng số, tức $3x^2-6x+17=3(x^2-2x+5)+2$, để được $A=3+\dfrac{2}{x^2-2x+5}$.

**Bước 2.** Đưa mẫu về $(x-1)^2+4\ge4$ để biết mẫu luôn dương và chặn được phân thức $\dfrac{2}{x^2-2x+5}$ trong một khoảng.

**Bước 3.** Từ khoảng đó đọc cận trên và cận dưới của $A$, rồi kiểm tra từng cận xem có đạt được bởi giá trị nào của $x$ hay không.

**Chú ý:** Một cận chưa chắc là GTNN hay GTLN; chỉ khi cận đó đạt được tại một giá trị $x$ cụ thể mới được gọi là giá trị nhỏ nhất (hay lớn nhất). Ở bài này phải kiểm từng cận một.

**Phần 2. Trình bày**

**Chưa chắc:** Đề in "tìm giá trị nhỏ nhất" nhưng biểu thức không có giá trị nhỏ nhất (chỉ có giá trị lớn nhất, và sách trả lời giá trị lớn nhất); nghi đề in nhầm chữ, cần người xác nhận.

$A=\dfrac{3(x^2-2x+5)+2}{x^2-2x+5}=3+\dfrac{2}{x^2-2x+5}$

Vì $x^2-2x+5=(x-1)^2+4\ge4>0$ nên $0<\dfrac{2}{x^2-2x+5}\le\dfrac{2}{4}=\dfrac{1}{2}$

$\Rightarrow3<A\le\dfrac{7}{2}$

Dấu "=" bên phải xảy ra khi $(x-1)^2=0$, tức $x=1$: $A=\dfrac{7}{2}$.

Còn $A>3$ với mọi $x$, và khi $\lvert x\rvert$ rất lớn thì $\dfrac{2}{x^2-2x+5}$ gần $0$ tuỳ ý nên $A$ gần $3$ tuỳ ý mà không bằng $3$; vậy $A$ không có giá trị nhỏ nhất.

Kết luận: $A$ không có $GTNN$; $A$ có $GTLN$ bằng $\dfrac{7}{2}$, đạt khi $x=1$.

=== V2B.427b@p67
- bai: 427 · y: b · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tách phần nguyên của phân thức · tam thức luôn dương
- kiem: khong
- ket_qua_sach: \dfrac{3}{2}
- dap_an: $GTNN=\dfrac{3}{2}$ khi $x=4$
- ghi_chu_nghi: Máy vét lưới: min B = 3/2 tại x = 4, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\dfrac{2x^2-16x+41}{x^2-8x+22}$.
## SACH
b) $B=2-\dfrac{3}{(x-4)^2+6}\ge\dfrac{3}{2}$; $\min B=\dfrac{3}{2}\Leftrightarrow x=4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số cao nhất của tử bằng $2$ lần hệ số cao nhất của mẫu, nên trừ đi $2$ lần mẫu thì tử chỉ còn hằng số; $B$ được viết là một số trừ một phân thức có tử hằng số và mẫu là tam thức luôn dương.

**Bước 1.** Tách tử số thành một bội của mẫu số cộng với một hằng số, tức $2x^2-16x+41=2(x^2-8x+22)-3$, để được $B=2-\dfrac{3}{x^2-8x+22}$.

**Bước 2.** Đưa mẫu về $(x-4)^2+6$ để thấy nó luôn dương và có giá trị nhỏ nhất.

**Bước 3.** Mẫu càng nhỏ thì phân thức bị trừ càng lớn, nên $B$ càng nhỏ; từ đó chặn $B$ từ dưới và tìm $x$ làm dấu "=" xảy ra.

**Chú ý:** Có dấu trừ trước phân thức nên chiều bất đẳng thức đảo ngược: mẫu nhỏ nhất ứng với $B$ nhỏ nhất, không phải lớn nhất.

**Phần 2. Trình bày**

$B=\dfrac{2(x^2-8x+22)-3}{x^2-8x+22}=2-\dfrac{3}{(x-4)^2+6}$

Vì $(x-4)^2+6\ge6>0$ nên $\dfrac{3}{(x-4)^2+6}\le\dfrac{3}{6}=\dfrac{1}{2}$, do đó $B\ge2-\dfrac{1}{2}=\dfrac{3}{2}$

Dấu "=" xảy ra khi $(x-4)^2=0$, tức $x=4$.

Vậy $GTNN$ của $B$ bằng $\dfrac{3}{2}$, đạt khi $x=4$.

=== V2B.427c@p67
- bai: 427 · y: c · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tổng hai lập phương · hiệu hai bình phương · rút gọn phân thức · tam thức luôn dương
- kiem: khong
- ket_qua_sach: \dfrac{3}{4}
- dap_an: $GTNN=\dfrac{3}{4}$ khi $x=-\dfrac{3}{2}$
- ghi_chu_nghi: Sách ghi "min B" ở dòng đáp số câu c (nhầm chữ, phải là C). Máy vét lưới: min C = 3/4 tại x = -3/2, khớp.
## DE
Tìm giá trị nhỏ nhất của biểu thức $C=\dfrac{x^6+27}{x^4-3x^3+6x^2-9x+9}$.
## SACH
c) $C=x^2+3x+3$; $\min B=\dfrac{3}{4}\Leftrightarrow x=-\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $x^6+27=(x^2)^3+3^3$ là tổng hai lập phương nên có nhân tử $x^2+3$, mà mẫu bậc bốn cũng chia hết cho $x^2+3$; phải phân tích cả tử lẫn mẫu để rút gọn trước khi tìm cực trị.

**Bước 1.** Phân tích tử bằng hằng đẳng thức tổng hai lập phương: $x^6+27=(x^2+3)(x^4-3x^2+9)$.

**Bước 2.** Thử phân tích mẫu thành $(x^2+3)(x^2-3x+3)$ bằng cách khai triển để kiểm, và chứng tỏ cả hai nhân tử luôn dương để biểu thức xác định với mọi $x$.

**Bước 3.** Phân tích $x^4-3x^2+9=(x^2+3)^2-(3x)^2$ để có nhân tử $x^2-3x+3$ rồi rút gọn $C$ về tam thức bậc hai.

**Bước 4.** Đưa tam thức này về dạng bình phương cộng hằng số để chặn từ dưới và tìm $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

Ta có $x^4-3x^3+6x^2-9x+9=(x^2+3)(x^2-3x+3)$ (khai triển vế phải để kiểm), trong đó $x^2+3>0$ và $x^2-3x+3=\left(x-\dfrac{3}{2}\right)^2+\dfrac{3}{4}>0$ nên mẫu luôn khác $0$.

Mặt khác $x^6+27=(x^2+3)(x^4-3x^2+9)$ và $x^4-3x^2+9=(x^2+3)^2-(3x)^2=(x^2-3x+3)(x^2+3x+3)$.

Do đó $C=\dfrac{(x^2+3)(x^2-3x+3)(x^2+3x+3)}{(x^2+3)(x^2-3x+3)}=x^2+3x+3$

$=\left(x+\dfrac{3}{2}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}$

Dấu "=" xảy ra khi $x+\dfrac{3}{2}=0$, tức $x=-\dfrac{3}{2}$.

Vậy $GTNN$ của $C$ bằng $\dfrac{3}{4}$, đạt khi $x=-\dfrac{3}{2}$.

=== V2B.427d@p67
- bai: 427 · y: d · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tổng hai lập phương · rút gọn phân thức · đưa tam thức về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: 48
- dap_an: $GTNN=48$ khi $x=2$ hoặc $x=-2$
- ghi_chu_nghi: Máy vét lưới: min D = 48 tại x = ±2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $D=\dfrac{x^6+512}{x^2+8}$.
## SACH
d) $D=x^4-8x^2+64$; $\min D=48\Leftrightarrow x=\pm2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $x^6+512=(x^2)^3+8^3$ là tổng hai lập phương mà mẫu chính là $x^2+8$, nên hằng đẳng thức tổng hai lập phương cho phép rút gọn hết mẫu.

**Bước 1.** Viết $512=8^3$ và phân tích tử thành $(x^2+8)(x^4-8x^2+64)$ bằng hằng đẳng thức tổng hai lập phương.

**Bước 2.** Rút gọn với mẫu $x^2+8>0$ (luôn khác $0$) để $D$ thành một đa thức bậc bốn theo $x$.

**Bước 3.** Coi $x^2$ là một ẩn, đưa $x^4-8x^2+64$ về bình phương cộng hằng số rồi tìm $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

$x^6+512=(x^2)^3+8^3=(x^2+8)(x^4-8x^2+64)$ và $x^2+8>0$ nên

$D=x^4-8x^2+64=(x^2-4)^2+48\ge48$

Dấu "=" xảy ra khi $x^2-4=0$, tức $x=2$ hoặc $x=-2$.

Vậy $GTNN$ của $D$ bằng $48$, đạt khi $x=2$ hoặc $x=-2$.

=== V2B.428a@p67
- bai: 428 · y: a · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: chia từng hạng tử cho mẫu · đặt ẩn phụ y = 1/x
- kiem: khong
- ket_qua_sach: -3
- dap_an: $GTNN=-3$ khi $x=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới (x khác 0): min A = -3 tại x = 1/2, khớp sách.
## DE
Tìm giá trị nhỏ nhất của biểu thức $A=\dfrac{x^2-4x+1}{x^2}$.
## SACH
Giải tương tự ví dụ 107.

a) $A=1-\dfrac{4}{x}+\dfrac{1}{x^2}$. Đặt $y=\dfrac{1}{x}$; $\min A=-3\Leftrightarrow x=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là đơn thức $x^2$ nên chia từng hạng tử của tử cho $x^2$ thì mọi hạng tử đều là luỹ thừa của $\dfrac{1}{x}$; đặt $y=\dfrac{1}{x}$ để được tam thức bậc hai theo $y$.

**Bước 1.** Điều kiện $x\ne0$, rồi chia từng hạng tử cho $x^2$ để được $A=1-\dfrac{4}{x}+\dfrac{1}{x^2}$.

**Bước 2.** Đặt $y=\dfrac{1}{x}$ (với $y\ne0$) để $A$ thành tam thức bậc hai theo $y$, rồi hoàn thành bình phương.

**Bước 3.** Kiểm tra giá trị $y$ làm dấu "=" xảy ra khác $0$ và đổi lại thành $x$.

**Chú ý:** Ẩn phụ $y=\dfrac{1}{x}$ không nhận giá trị $0$; phải kiểm tra điểm tối ưu của $y$ có khác $0$ hay không.

**Phần 2. Trình bày**

Điều kiện $x\ne0$. Đặt $y=\dfrac{1}{x}$ ($y\ne0$), ta có

$A=1-\dfrac{4}{x}+\dfrac{1}{x^2}=y^2-4y+1=(y-2)^2-3\ge-3$

Dấu "=" xảy ra khi $y=2$ (thoả $y\ne0$), tức $x=\dfrac{1}{2}$.

Vậy $GTNN$ của $A$ bằng $-3$, đạt khi $x=\dfrac{1}{2}$.

=== V2B.428b@p67
- bai: 428 · y: b · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ t = 1/(2x−1) · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{3}{4}
- dap_an: Không có GTNN ($B$ không bị chặn dưới); $GTLN=\dfrac{5}{4}$ khi $x=-\dfrac{1}{2}$
- ghi_chu_nghi: SÁCH SAI: sách ghi "min B = 3/4 ⇔ x = 3/2", nhưng B(3/2) = 1/4 < 3/4. Máy vét lưới: B không bị chặn dưới (x gần 1/2 cho B rất âm), max B = 5/4 tại x = -1/2. Đáp số của sách khớp với đề (4x²-6x+3)/(2x-1)² (min 3/4 tại x = 3/2), nên nghi sách in nhầm hằng số +1 thay vì +3 trong đề. Chép đề đúng như in; GIAI theo đề in. Cần người xác nhận.
## DE
Tìm giá trị nhỏ nhất của biểu thức $B=\dfrac{4x^2-6x+1}{(2x-1)^2}$.
## SACH
Giải tương tự ví dụ 107.

b) Đặt $y=2x-1$; $\min B=\dfrac{3}{4}\Leftrightarrow x=\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là bình phương của $2x-1$; viết tử theo $2x-1$ rồi chia từng hạng tử cho mẫu thì $B$ là tam thức bậc hai theo $t=\dfrac{1}{2x-1}$, nên bài chuyển thành tìm cực trị của tam thức theo $t$.

**Bước 1.** Điều kiện $x\ne\dfrac{1}{2}$, và viết tử $4x^2-6x+1=(2x-1)^2-(2x-1)-1$ để biểu diễn qua $2x-1$.

**Bước 2.** Chia từng hạng tử cho $(2x-1)^2$ rồi đặt $t=\dfrac{1}{2x-1}$ ($t\ne0$) để $B=1-t-t^2$.

**Bước 3.** Xét tam thức $1-t-t^2$: hệ số của $t^2$ âm nên cần xem nó bị chặn về phía nào; tìm điểm đạt cận (nếu có) rồi giải ra $x$, và kiểm tra phía còn lại xem có bị chặn hay không.

**Chú ý:** Khi hệ số của $t^2$ âm, biểu thức theo $t$ có thể lớn bao nhiêu thì nhỏ vô hạn bấy nhiêu; không thể kết luận "giá trị nhỏ nhất" chỉ bằng cách hoàn thành bình phương mà phải xét chiều của bất đẳng thức.

**Phần 2. Trình bày**

**Chưa chắc:** Đề in "tìm giá trị nhỏ nhất", nhưng với đề này biểu thức không có giá trị nhỏ nhất; đáp số của sách (nhỏ nhất bằng $\dfrac{3}{4}$ tại $x=\dfrac{3}{2}$) sai với đề in và khớp với đề $\dfrac{4x^2-6x+3}{(2x-1)^2}$, nghi sách in nhầm hằng số, cần người xác nhận.

Điều kiện $x\ne\dfrac{1}{2}$. Vì $4x^2-6x+1=(2x-1)^2-(2x-1)-1$ nên

$B=1-\dfrac{1}{2x-1}-\dfrac{1}{(2x-1)^2}$

Đặt $t=\dfrac{1}{2x-1}$ ($t\ne0$), khi đó $B=1-t-t^2=\dfrac{5}{4}-\left(t+\dfrac{1}{2}\right)^2\le\dfrac{5}{4}$

Dấu "=" xảy ra khi $t=-\dfrac{1}{2}$, tức $2x-1=-2$, $x=-\dfrac{1}{2}$ (khi đó $B=\dfrac{5}{4}$).

Với $t>0$ thì $B=1-t-t^2<1-t^2$, mà $1-t^2$ nhỏ tuỳ ý khi $t$ đủ lớn; nên $B$ không bị chặn dưới và không có giá trị nhỏ nhất.

Kết luận: $B$ không có $GTNN$; $B$ có $GTLN$ bằng $\dfrac{5}{4}$, đạt khi $x=-\dfrac{1}{2}$.

=== V2B.429a@p67
- bai: 429 · y: a · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y = x+10, z = 1/y · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{1}{40}
- dap_an: $GTLN=\dfrac{1}{40}$ khi $x=10$
- ghi_chu_nghi: Máy vét lưới (x khác -10): max A = 1/40 tại x = 10, khớp sách.
## DE
Tìm giá trị lớn nhất của biểu thức $A=\dfrac{x}{(x+10)^2}$.
## SACH
Giải tương tự ví dụ 107.

a) Đặt $y=x+10$; $A=\dfrac{1}{y}-\dfrac{10}{y^2}$. Đặt $\dfrac{1}{y}=z$; $\max A=\dfrac{1}{40}\Leftrightarrow x=10$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là bình phương của $x+10$ còn tử là $x$; đặt $y=x+10$ thì tử thành $y-10$, và chia từng hạng tử cho $y^2$ thì $A$ là tam thức bậc hai theo $z=\dfrac{1}{y}$.

**Bước 1.** Điều kiện $x\ne-10$; đặt $y=x+10$ và viết tử $x=y-10$.

**Bước 2.** Chia từng hạng tử cho $y^2$ để $A=\dfrac{1}{y}-\dfrac{10}{y^2}$, rồi đặt $z=\dfrac{1}{y}$ ($z\ne0$) để được tam thức bậc hai theo $z$.

**Bước 3.** Hệ số của $z^2$ âm nên tam thức có giá trị lớn nhất; hoàn thành bình phương để chặn từ trên, rồi đổi giá trị $z$ làm dấu "=" xảy ra về $x$.

**Chú ý:** Cách khác: $(x+10)^2-40x=(x-10)^2\ge0$ nên với $x>0$ có $\dfrac{x}{(x+10)^2}\le\dfrac{1}{40}$, còn $x\le0$ thì $A\le0$.

**Phần 2. Trình bày**

Điều kiện $x\ne-10$. Đặt $y=x+10$ ($y\ne0$) và $z=\dfrac{1}{y}$ ($z\ne0$), ta có

$A=\dfrac{y-10}{y^2}=\dfrac{1}{y}-\dfrac{10}{y^2}=z-10z^2=-10\left(z-\dfrac{1}{20}\right)^2+\dfrac{1}{40}\le\dfrac{1}{40}$

Dấu "=" xảy ra khi $z=\dfrac{1}{20}$ (thoả $z\ne0$), tức $y=20$, $x=10$.

Vậy $GTLN$ của $A$ bằng $\dfrac{1}{40}$, đạt khi $x=10$.

=== V2B.429b@p67
- bai: 429 · y: b · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đặt ẩn phụ y = x+100, z = 1/y · đưa tam thức bậc hai về bình phương cộng hằng số
- kiem: khong
- ket_qua_sach: \dfrac{1}{400}
- dap_an: $GTLN=\dfrac{1}{400}$ khi $x=100$
- ghi_chu_nghi: Máy vét lưới (x khác -100): max B = 1/400 tại x = 100, khớp sách.
## DE
Tìm giá trị lớn nhất của biểu thức $B=\dfrac{x}{(x+100)^2}$.
## SACH
Giải tương tự ví dụ 107.

b) $\max B=\dfrac{1}{400}\Leftrightarrow x=100$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cùng dạng với câu trước: mẫu là bình phương của $x+100$ còn tử là $x$; đặt $y=x+100$ rồi $z=\dfrac{1}{y}$ thì $B$ là tam thức bậc hai theo $z$ có hệ số của $z^2$ âm.

**Bước 1.** Điều kiện $x\ne-100$; đặt $y=x+100$ và viết tử $x=y-100$.

**Bước 2.** Chia từng hạng tử cho $y^2$ rồi đặt $z=\dfrac{1}{y}$ để được $B=z-100z^2$.

**Bước 3.** Hoàn thành bình phương để chặn $B$ từ trên và đổi giá trị $z$ làm dấu "=" xảy ra về $x$.

**Phần 2. Trình bày**

Điều kiện $x\ne-100$. Đặt $y=x+100$ ($y\ne0$) và $z=\dfrac{1}{y}$ ($z\ne0$), ta có

$B=\dfrac{y-100}{y^2}=\dfrac{1}{y}-\dfrac{100}{y^2}=z-100z^2=-100\left(z-\dfrac{1}{200}\right)^2+\dfrac{1}{400}\le\dfrac{1}{400}$

Dấu "=" xảy ra khi $z=\dfrac{1}{200}$ (thoả $z\ne0$), tức $y=200$, $x=100$.

Vậy $GTLN$ của $B$ bằng $\dfrac{1}{400}$, đạt khi $x=100$.

=== V2B.430a@p67
- bai: 430 · y: a · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu với hằng số (tử là bình phương) · điều kiện tam thức là bình phương b² = 4ac
- kiem: khong
- ket_qua_sach: GTNN -1; GTLN 4
- dap_an: $GTNN=-1$ khi $x=6$; $GTLN=4$ khi $x=-\dfrac{3}{2}$
- ghi_chu_nghi: Máy vét lưới mịn: min A = -1 tại x = 6, max A = 4 tại x = -3/2, khớp sách.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của biểu thức $A=\dfrac{27-12x}{x^2+9}$.
## SACH
a) $A=\dfrac{27-12x}{x^2+9}=\dfrac{(x^2-12x+36)-(x^2+9)}{x^2+9}=\dfrac{(x-6)^2}{x^2+9}-1\ge-1$;

$\min A=-1\Leftrightarrow x=6$.

$A=\dfrac{27-12x}{x^2+9}=\dfrac{(4x^2+36)-(4x^2+12x+9)}{x^2+9}=4-\dfrac{(2x+3)^2}{x^2+9}\le4$

$\max A=4\Leftrightarrow x=-\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2+9$ luôn dương nên $A\ge m$ tương đương $27-12x\ge m(x^2+9)$; chọn hằng số $m$ sao cho tam thức $m(x^2+9)-(27-12x)$ chính là bình phương của một nhị thức (với $m\ne0$ điều kiện là $b^2=4ac$), khi đó hiệu $A-m$ có tử là một bình phương và không đổi dấu.

**Bước 1.** Với tam thức $mx^2+12x+9m-27$, viết điều kiện $b^2=4ac$ để nó là bình phương, rồi giải phương trình theo $m$ để được hai giá trị của $m$ (một cho cận dưới, một cho cận trên).

**Bước 2.** Với giá trị $m$ nhỏ hơn, xét hiệu $A-m$: mẫu là $x^2+9>0$ còn tử là một bình phương nên $A-m\ge0$, từ đó suy ra giá trị nhỏ nhất.

**Bước 3.** Với giá trị $m$ lớn hơn, xét hiệu $m-A$: mẫu dương còn tử là một bình phương nên $m-A\ge0$, từ đó suy ra giá trị lớn nhất.

**Bước 4.** Tìm $x$ làm tử bằng $0$ ở mỗi trường hợp để chắc rằng hai cận đều đạt được.

**Chú ý:** Mẫu $x^2+9>0$ với mọi $x$ nên không cần điều kiện xác định, và việc chia cho mẫu dương không đổi chiều bất đẳng thức.

**Phần 2. Trình bày**

Mẫu $x^2+9>0$ với mọi $x$.

$A+1=\dfrac{27-12x+x^2+9}{x^2+9}=\dfrac{(x-6)^2}{x^2+9}\ge0$ nên $A\ge-1$, dấu "=" xảy ra khi $x=6$.

$4-A=\dfrac{4x^2+36-27+12x}{x^2+9}=\dfrac{(2x+3)^2}{x^2+9}\ge0$ nên $A\le4$, dấu "=" xảy ra khi $x=-\dfrac{3}{2}$.

Vậy $GTNN$ của $A$ bằng $-1$, đạt khi $x=6$; $GTLN$ của $A$ bằng $4$, đạt khi $x=-\dfrac{3}{2}$.

=== V2B.430b@p67
- bai: 430 · y: b · trang: 67 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu với hằng số (tử là bình phương) · điều kiện tam thức là bình phương b² = 4ac
- kiem: khong
- ket_qua_sach: GTNN -1; GTLN 4
- dap_an: $GTNN=-1$ khi $x=-1$; $GTLN=4$ khi $x=\dfrac{1}{4}$
- ghi_chu_nghi: Máy vét lưới mịn: min B = -1 tại x = -1, max B = 4 tại x = 1/4, khớp sách.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của biểu thức $B=\dfrac{8x+3}{4x^2+1}$.
## SACH
b) $B=\dfrac{8x+3}{4x^2+1}=\dfrac{4x^2+8x+4-4x^2-1}{4x^2+1}=\dfrac{4(x+1)^2}{4x^2+1}-1\ge-1$;

$\min B=-1\Leftrightarrow x=-1$.

$B=\dfrac{16x^2+4-16x^2+8x-1}{4x^2+1}=\dfrac{4(4x^2+1)-(4x-1)^2}{4x^2+1}=4-\dfrac{(4x-1)^2}{4x^2+1}\le4$

$\max B=4\Leftrightarrow x=\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $4x^2+1$ luôn dương, nên so sánh $B$ với một hằng số $m$ quy về xét dấu của tam thức $m(4x^2+1)-(8x+3)$; chọn $m$ để tam thức này là bình phương của một nhị thức thì hiệu $B-m$ không đổi dấu.

**Bước 1.** Viết tam thức $4mx^2-8x+m-3$ và dùng điều kiện bình phương $b^2=4ac$ để lập phương trình theo $m$, giải ra hai giá trị $m$.

**Bước 2.** Với $m$ nhỏ, tính $B-m$ rồi gom tử thành một bình phương để có cận dưới của $B$.

**Bước 3.** Với $m$ lớn, tính $m-B$ rồi gom tử thành một bình phương để có cận trên của $B$.

**Bước 4.** Giải tử bằng $0$ ở mỗi trường hợp để tìm $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

Mẫu $4x^2+1>0$ với mọi $x$.

$B+1=\dfrac{8x+3+4x^2+1}{4x^2+1}=\dfrac{4(x+1)^2}{4x^2+1}\ge0$ nên $B\ge-1$, dấu "=" xảy ra khi $x=-1$.

$4-B=\dfrac{16x^2+4-8x-3}{4x^2+1}=\dfrac{(4x-1)^2}{4x^2+1}\ge0$ nên $B\le4$, dấu "=" xảy ra khi $x=\dfrac{1}{4}$.

Vậy $GTNN$ của $B$ bằng $-1$, đạt khi $x=-1$; $GTLN$ của $B$ bằng $4$, đạt khi $x=\dfrac{1}{4}$.

=== V2B.430c@p68
- bai: 430 · y: c · trang: 68 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: xét hiệu với hằng số (tử là bình phương) · điều kiện tam thức là bình phương b² = 4ac
- kiem: khong
- ket_qua_sach: GTNN -\dfrac{1}{2}; GTLN 1
- dap_an: $GTNN=-\dfrac{1}{2}$ khi $x=-2$; $GTLN=1$ khi $x=1$
- ghi_chu_nghi: Sách in biểu thức cho GTNN là (x-2)²/(2(x²+2)) − 1/2 nhưng đúng phải là (x+2)²/(2(x²+2)) − 1/2 (khớp điểm đạt x = -2 do chính sách ghi); sách in nhầm dấu. Máy vét lưới mịn: min C = -1/2 tại x = -2, max C = 1 tại x = 1, khớp đáp số sách.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của biểu thức $C=\dfrac{2x+1}{x^2+2}$.
## SACH
c) $C=\dfrac{(x-2)^2}{2(x^2+2)}-\dfrac{1}{2}$; $\min C=-\dfrac{1}{2}\Leftrightarrow x=-2$;

$C=1-\dfrac{(x-1)^2}{x^2+2}$; $\max C=1\Leftrightarrow x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2+2$ luôn dương, nên so $C$ với hằng số $m$ quy về tam thức $m(x^2+2)-(2x+1)$; chọn $m$ để tam thức này là bình phương của một nhị thức thì hiệu $C-m$ không đổi dấu.

**Bước 1.** Viết tam thức $mx^2-2x+2m-1$ và dùng điều kiện bình phương $b^2=4ac$ để lập phương trình theo $m$, giải ra hai giá trị $m$.

**Bước 2.** Với $m$ nhỏ, cộng thêm $-m$ vào $C$ để có $C-m$ với tử là một bình phương, từ đó chặn $C$ từ dưới.

**Bước 3.** Với $m$ lớn, lấy $m-C$ với tử là một bình phương, từ đó chặn $C$ từ trên.

**Bước 4.** Giải tử bằng $0$ ở mỗi trường hợp để tìm $x$ làm dấu "=" xảy ra.

**Chú ý:** Khi $m$ là phân số (như ở cận dưới của bài này) thì nhân hai vế với mẫu chung để tử đẹp; kiểm tra lại bằng cách thay $x$ tìm được vào $C$.

**Phần 2. Trình bày**

Mẫu $x^2+2>0$ với mọi $x$.

$C+\dfrac{1}{2}=\dfrac{2(2x+1)+x^2+2}{2(x^2+2)}=\dfrac{(x+2)^2}{2(x^2+2)}\ge0$ nên $C\ge-\dfrac{1}{2}$, dấu "=" xảy ra khi $x=-2$.

$1-C=\dfrac{x^2+2-2x-1}{x^2+2}=\dfrac{(x-1)^2}{x^2+2}\ge0$ nên $C\le1$, dấu "=" xảy ra khi $x=1$.

Vậy $GTNN$ của $C$ bằng $-\dfrac{1}{2}$, đạt khi $x=-2$; $GTLN$ của $C$ bằng $1$, đạt khi $x=1$.

=== V2B.430d@p68
- bai: 430 · y: d · trang: 68 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: xét hiệu với hằng số (tử là bình phương) · điều kiện tam thức là bình phương b² = 4ac
- kiem: khong
- ket_qua_sach: GTNN 2; GTLN 4
- dap_an: $GTNN=2$ khi $x=1$; $GTLN=4$ khi $x=-1$
- ghi_chu_nghi: Máy vét lưới mịn: min D = 2 tại x = 1, max D = 4 tại x = -1, khớp sách.
## DE
Tìm giá trị nhỏ nhất và giá trị lớn nhất của biểu thức $D=\dfrac{3x^2-2x+3}{x^2+1}$.
## SACH
d) $D=\dfrac{(x-1)^2}{x^2+1}+2$; $\min D=2\Leftrightarrow x=1$.

$D=4-\dfrac{(x+1)^2}{x^2+1}$; $\max D=4\Leftrightarrow x=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2+1$ luôn dương, nên so $D$ với hằng số $m$ quy về tam thức $(3-m)x^2-2x+(3-m)$; chọn $m$ để tam thức đó là bình phương của nhị thức thì hiệu $D-m$ không đổi dấu.

**Bước 1.** Viết hiệu $D-m=\dfrac{(3-m)x^2-2x+(3-m)}{x^2+1}$ và dùng điều kiện bình phương $b^2=4ac$ để được phương trình theo $3-m$, giải ra hai giá trị $m$.

**Bước 2.** Với $m$ nhỏ, gom tử của $D-m$ thành một bình phương để chặn $D$ từ dưới.

**Bước 3.** Với $m$ lớn, gom tử của $m-D$ thành một bình phương để chặn $D$ từ trên.

**Bước 4.** Giải tử bằng $0$ ở mỗi trường hợp để tìm $x$ làm dấu "=" xảy ra.

**Phần 2. Trình bày**

Mẫu $x^2+1>0$ với mọi $x$.

$D-2=\dfrac{3x^2-2x+3-2x^2-2}{x^2+1}=\dfrac{(x-1)^2}{x^2+1}\ge0$ nên $D\ge2$, dấu "=" xảy ra khi $x=1$.

$4-D=\dfrac{4x^2+4-3x^2+2x-3}{x^2+1}=\dfrac{(x+1)^2}{x^2+1}\ge0$ nên $D\le4$, dấu "=" xảy ra khi $x=-1$.

Vậy $GTNN$ của $D$ bằng $2$, đạt khi $x=1$; $GTLN$ của $D$ bằng $4$, đạt khi $x=-1$.

=== V2B.431a@p68
- bai: 431 · y: a · trang: 68 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: xét hiệu với hằng số · hằng đẳng thức (x−y)²
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTNN=\dfrac{1}{2}$ khi $x=y\ne0$
- ghi_chu_nghi: Máy vét lưới 2 biến (loại x+y=0): min A = 1/2 tại x = y, khớp sách.
## DE
Tìm giá trị nhỏ nhất của $A=\dfrac{x^2+y^2}{x^2+2xy+y^2}$.
## SACH
431. a) $\min A=\dfrac{1}{2}\Leftrightarrow x=y$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là $(x+y)^2$ nên biểu thức xác định khi $x+y\ne0$ và luôn dương; tử $x^2+y^2$ cùng bậc với mẫu, gợi so $A$ với một hằng số bằng cách xét hiệu để tử thành $(x-y)^2$.

**Bước 1.** Ghi điều kiện $x+y\ne0$, viết mẫu là $(x+y)^2>0$.

**Bước 2.** Thử $x=y$ (khi đó $\dfrac{x^2+y^2}{(x+y)^2}$ thành một số cố định) để đoán hằng số cần so với $A$, rồi tính hiệu của $A$ với hằng số đó để tử gom thành $(x-y)^2$.

**Bước 3.** Chặn $A$ từ dưới bằng bình phương không âm và tìm điều kiện $x=y$ cùng với $x+y\ne0$ để chắc dấu "=" đạt được.

**Chú ý:** Dấu "=" xảy ra khi $x=y$ nhưng phải có thêm $x\ne0$ (nếu không thì $x+y=0$ và biểu thức không xác định).

**Phần 2. Trình bày**

Điều kiện $x+y\ne0$, khi đó $(x+y)^2>0$.

$A-\dfrac{1}{2}=\dfrac{2x^2+2y^2-(x+y)^2}{2(x+y)^2}=\dfrac{(x-y)^2}{2(x+y)^2}\ge0$ nên $A\ge\dfrac{1}{2}$

Dấu "=" xảy ra khi $x=y$ (với $x=y\ne0$ thì $x+y\ne0$).

Vậy $GTNN$ của $A$ bằng $\dfrac{1}{2}$, đạt khi $x=y\ne0$.

=== V2B.431b@p68
- bai: 431 · y: b · trang: 68 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: x⁴+1 ≥ 2x² (Cô-si hay (x²−1)² ≥ 0) · xét hiệu với hằng số
- kiem: khong
- ket_qua_sach: \dfrac{1}{2}
- dap_an: $GTLN=\dfrac{1}{2}$ khi $x=1$ hoặc $x=-1$
- ghi_chu_nghi: Máy vét lưới mịn: max B = 1/2 tại x = ±1, khớp sách.
## DE
Tìm giá trị lớn nhất của $B=\dfrac{x^2}{x^4+1}$.
## SACH
b) Với $x=0$ thì $B=\dfrac{x^2}{x^4+1}=0$.

Với $x\ne0$ thì $x^4+1\ge2x^2>0$ nên $\dfrac{x^2}{x^4+1}\le\dfrac{x^2}{2x^2}=\dfrac{1}{2}$.

Vậy $\max B=\dfrac{1}{2}\Leftrightarrow x=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^4+1$ và tử $x^2$ liên hệ với nhau qua $x^4+1\ge2x^2$, tức $(x^2-1)^2\ge0$; chia tử và mẫu cho $x^2$ (với $x\ne0$) cho thấy $B=\dfrac{1}{x^2+\dfrac{1}{x^2}}$, mẫu có giá trị nhỏ nhất, nên hằng số cần so là một số cụ thể.

**Bước 1.** Nhận ra $x^4+1$ luôn dương và $x^4+1-2x^2=(x^2-1)^2\ge0$ để có đánh giá mẫu từ dưới theo $x^2$.

**Bước 2.** Từ $x^4+1\ge2x^2$ suy ra hằng số cần so với $B$, rồi tính hiệu của hằng số đó với $B$ ở mẫu chung để tử gom thành $(x^2-1)^2$, nhờ đó không cần tách trường hợp $x=0$.

**Bước 3.** Chặn $B$ từ trên bằng bình phương không âm và tìm $x$ làm tử bằng $0$ để chắc dấu "=" đạt được.

**Phần 2. Trình bày**

Mẫu $x^4+1>0$ với mọi $x$.

$\dfrac{1}{2}-B=\dfrac{x^4+1-2x^2}{2(x^4+1)}=\dfrac{(x^2-1)^2}{2(x^4+1)}\ge0$ nên $B\le\dfrac{1}{2}$

Dấu "=" xảy ra khi $x^2-1=0$, tức $x=1$ hoặc $x=-1$.

Vậy $GTLN$ của $B$ bằng $\dfrac{1}{2}$, đạt khi $x=1$ hoặc $x=-1$.

=== V2B.431c@p68
- bai: 431 · y: c · trang: 68 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: khai triển tích · Cô-si t + 1/t ≥ 2 (t > 0)
- kiem: khong
- ket_qua_sach: 4
- dap_an: $GTNN=4$ khi $xy=1$ hoặc $xy=-1$ (chẳng hạn $x=y=1$)
- ghi_chu_nghi: Máy vét lưới 2 biến (x,y khác 0): min C = 4, đạt khi xy = ±1, khớp sách.
## DE
Tìm giá trị nhỏ nhất của $C=\left(x^2+\dfrac{1}{y^2}\right)\left(y^2+\dfrac{1}{x^2}\right)$.
## SACH
c) $C=2+\left(x^2y^2+\dfrac{1}{x^2y^2}\right)$. Tìm được $\min C=4\Leftrightarrow xy=\pm1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khai triển tích hai nhị thức thì hai tích chéo $x^2\cdot\dfrac{1}{x^2}$ và $\dfrac{1}{y^2}\cdot y^2$ đều bằng $1$, còn lại $x^2y^2+\dfrac{1}{x^2y^2}$ là tổng của một số dương và số nghịch đảo của nó, đúng dạng dùng bất đẳng thức Cô-si.

**Bước 1.** Ghi điều kiện $x\ne0$, $y\ne0$ rồi khai triển tích bốn số hạng.

**Bước 2.** Đặt $t=x^2y^2>0$ để biểu thức thành $2+t+\dfrac{1}{t}$, rồi áp dụng Cô-si cho hai số dương $t$ và $\dfrac{1}{t}$ có tích bằng $1$.

**Bước 3.** Giải $t=\dfrac{1}{t}$ để tìm $xy$ làm dấu "=" xảy ra, và chỉ ra một cặp $(x;y)$ cụ thể.

**Phần 2. Trình bày**

Điều kiện $x\ne0$, $y\ne0$.

$C=x^2y^2+x^2\cdot\dfrac{1}{x^2}+\dfrac{1}{y^2}\cdot y^2+\dfrac{1}{y^2}\cdot\dfrac{1}{x^2}=2+x^2y^2+\dfrac{1}{x^2y^2}$

Đặt $t=x^2y^2>0$. Theo bất đẳng thức Cô-si: $t+\dfrac{1}{t}\ge2\sqrt{t\cdot\dfrac{1}{t}}=2$, nên $C\ge4$.

Dấu "=" xảy ra khi $t=\dfrac{1}{t}$, tức $t=1$, $x^2y^2=1$, $xy=1$ hoặc $xy=-1$ (chẳng hạn $x=y=1$ cho $C=2\cdot2=4$).

Vậy $GTNN$ của $C$ bằng $4$, đạt khi $xy=1$ hoặc $xy=-1$.

