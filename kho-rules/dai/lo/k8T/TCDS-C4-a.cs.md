=== C4V.1@p114
- bai: VD1 · y: - · trang: 114 · tang: nang_cao
- nguon_de: Tạp chí toán học & tuổi trẻ số 378
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: giả sử thứ tự các biến (biểu thức đối xứng) · làm trội · hằng đẳng thức tổng hai lập phương · bình phương không âm (tương đương Cô-si hai số)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách bỏ qua bước $a^3+b^3+c^3\le a^3+(b+c)^3$ khi suy ra $M\ge N$, và bỏ sót điểm đạt dấu "=" tại $(1;0;0)$ cùng các hoán vị. Bản GIAI bổ sung cả hai.
## DE
(Tạp chí toán học & tuổi trẻ số 378) Cho ba số thực không âm $a,b,c$ thỏa mãn điều kiện $a+b+c=1$. Chứng minh rằng: $ab+bc+ca\ge 12(a^3+b^3+c^3)(a^2b^2+b^2c^2+c^2a^2)$.
## SACH
Giải:

Không mất tính tính tổng quát, ta giả sử $a\ge b\ge c$

Đặt $M=ab+bc+ca-12(a^3+b^3+c^3)(a^2b^2+b^2c^2+c^2a^2)$

$N=a(b+c)-12\left[a^3+(b+c)^3\right]\left[a^2(b+c)^2\right]$

Ta có: $ab+ac+bc\ge a(b+c)$ hay $a^2b^2+b^2c^2+c^2a^2\le a^2(b+c)^2\Rightarrow M\ge N$

Tiếp theo ta sẽ chứng minh $N\ge 0$

$\Leftrightarrow a(b+c)-12\left[a^3+(b+c)^3\right]\left[a^2(b+c)^2\right]\ge 0$

$\Leftrightarrow a(b+c)\left[1-12a(b+c)\left[a^3+(b+c)^3\right]\right]\ge 0$

$\Leftrightarrow 1-12a(b+c)\left[a^3+(b+c)^3\right]\ge 0$

$\Leftrightarrow 1-12a(b+c)\left[(a+b+c)^3-3a(b+c)(a+b+c)\right]\ge 0$

$\Leftrightarrow 1-12a(b+c)(1-3a(b+c))\ge 0$ (*)

Đặt $x=a$, $y=b+c$ ta có $x+y=1\Rightarrow xy\le\dfrac{1}{4}$.

Mặt khác theo bất đẳng thức AM – GM: $12xy(1-3xy)\le\dfrac{1}{4}12xy(4-12xy)\le\dfrac{1}{4}\left(\dfrac{12xy+4-12xy}{2}\right)^2=1$

Suy ra bất đẳng thức (*) luôn đúng suy $N\ge 0$.

Vậy $M\ge 0\Leftrightarrow ab+bc+ca\ge 12(a^3+b^3+c^3)(a^2b^2+b^2c^2+c^2a^2)$

Đẳng thức xảy ra với bộ $\left(\dfrac{3+\sqrt{3}}{6};\dfrac{3-\sqrt{3}}{6};0\right)$ và các hoán vị của chúng.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Dấu "=" không nằm ở $a=b=c$ mà ở chỗ một biến bằng $0$ ⇒ phải sắp thứ tự $a\ge b\ge c$ rồi dồn $b,c$ thành một biến $b+c$, để bài toán chỉ còn hai biến $x=a$, $y=b+c$ có tổng bằng $1$.

**Bước 1.** Vì hai vế đối xứng với $a,b,c$ nên giả sử $a\ge b\ge c\ge0$; sắp thứ tự như vậy cho phép làm trội các hạng tử có chứa $c$.

**Bước 2.** Chặn vế trái từ dưới và vế phải từ trên bằng cách gộp $c$ vào $b$: $ab+bc+ca\ge a(b+c)$, $a^2b^2+b^2c^2+c^2a^2\le a^2(b+c)^2$ và $a^3+b^3+c^3\le a^3+(b+c)^3$, nên chỉ cần chứng minh bất đẳng thức hai biến.

**Bước 3.** Đặt $x=a$, $y=b+c$ thì $x+y=1$; dùng hằng đẳng thức $x^3+y^3=(x+y)^3-3xy(x+y)$ để mọi thứ chỉ còn phụ thuộc tích $xy$.

**Bước 4.** Đưa hiệu hai vế về dạng $xy$ nhân với một ngoặc, rồi nhận ra ngoặc đó là một bình phương hoàn chỉnh nên không âm; điều kiện dấu "=" tìm từ chỗ các bước làm trội đều phải xảy ra đẳng thức.

**Chú ý:** Thử $a=b=c=\dfrac{1}{3}$ cho vế trái $\dfrac{1}{3}$ còn vế phải $\dfrac{12}{243}$, tức là không đạt dấu "=" ở điểm đối xứng. Bình phương ở Bước 4 chính là Cô-si hai số $12xy$ và $4-12xy$ (cả hai dương) với dấu "=" khi $12xy=4-12xy$.

**Phần 2. Trình bày**

Vì hai vế đối xứng với $a,b,c$ nên giả sử $a\ge b\ge c\ge0$; do $a+b+c=1$ nên $a>0$.

Ta có $ab+bc+ca\ge ab+ca=a(b+c)$ (1)

Vì $bc\le a^2$ nên $b^2c^2\le a^2bc$, do đó $a^2b^2+b^2c^2+c^2a^2\le a^2b^2+a^2bc+c^2a^2\le a^2(b+c)^2$ (2)

Vì $(b+c)^3=b^3+c^3+3bc(b+c)\ge b^3+c^3$ nên $a^3+b^3+c^3\le a^3+(b+c)^3$ (3)

Các thừa số đều không âm, từ (1), (2), (3) ta được $ab+bc+ca-12(a^3+b^3+c^3)(a^2b^2+b^2c^2+c^2a^2)\ge a(b+c)-12\left[a^3+(b+c)^3\right]a^2(b+c)^2$ (4)

Đặt $x=a$, $y=b+c$ thì $x,y>0$, $x+y=1$ và $x^3+y^3=(x+y)^3-3xy(x+y)=1-3xy$

Vế phải của (4) bằng $xy-12(1-3xy)x^2y^2=xy\left(1-12xy+36x^2y^2\right)=xy(1-6xy)^2\ge0$

Vậy $ab+bc+ca\ge 12(a^3+b^3+c^3)(a^2b^2+b^2c^2+c^2a^2)$.

Dấu "=" xảy ra khi (1) là đẳng thức, tức $bc=0$, mà $c\le b$ nên $c=0$ (khi đó (2), (3) cũng là đẳng thức), và $xy(1-6xy)^2=0$ với $x=a$, $y=b$. Nếu $ab=0$ thì $(a;b;c)=(1;0;0)$. Nếu $ab=\dfrac{1}{6}$ cùng $a+b=1$ thì $a,b$ là nghiệm của $t^2-t+\dfrac{1}{6}=0$, tức $(a;b;c)=\left(\dfrac{3+\sqrt{3}}{6};\dfrac{3-\sqrt{3}}{6};0\right)$. Dấu "=" xảy ra tại các bộ này và các hoán vị của chúng.

=== C4V.2@p115
- bai: VD2 · y: - · trang: 115 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số · ghép cặp có tích bằng 1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in nhầm "$a^2+b^2+c^2\ge\dots$" (thiếu $d^2$) và "$x+\dfrac{1}{x}\ge\dfrac{1}{2}$" (phải là $\ge2$ với $x>0$). Không ảnh hưởng đáp số.
## DE
Cho $a,b,c,d>0$ và $abcd=1$. Chứng minh rằng: $a^2+b^2+c^2+d^2+a(b+c)+b(c+d)+d(c+a)\ge10$.
## SACH
Giải:

Ta có $a^2+b^2\ge2ab$; $c^2+d^2\ge2cd$

Do $abcd=1$ nên $cd=\dfrac{1}{ab}$ (dùng $x+\dfrac{1}{x}\ge\dfrac{1}{2}$).

Ta có $a^2+b^2+c^2\ge2(ab+cd)=2\left(ab+\dfrac{1}{ab}\right)\ge4$ (1)

Mặt khác: $a(b+c)+b(c+d)+d(c+a)=(ab+cd)+(ac+bd)+(bc+ad)$

$=\left(ab+\dfrac{1}{ab}\right)+\left(ac+\dfrac{1}{ac}\right)+\left(bc+\dfrac{1}{bc}\right)\ge2+2+2$

$\Rightarrow a^2+b^2+c^2+d^2+a(b+c)+b(c+d)+d(c+a)\ge10$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $abcd=1$ gợi ghép các biến thành những cặp có tích bằng $1$, như $ab$ với $cd$, rồi dùng Cô-si hai số $u+v\ge2\sqrt{uv}=2$ cho mỗi cặp.

**Bước 1.** Gom bình phương thành từng cặp, $a^2+b^2\ge2ab$ và $c^2+d^2\ge2cd$, để tổng bốn bình phương được chặn dưới bằng $2(ab+cd)$, một tổng của hai số có tích $abcd=1$.

**Bước 2.** Khai triển ba tích còn lại thành sáu hạng tử đôi một rồi ghép thành ba cặp $(ab;cd)$, $(ac;bd)$, $(bc;ad)$, mỗi cặp đều có tích bằng $abcd=1$.

**Bước 3.** Áp dụng Cô-si hai số cho từng cặp (đều gồm hai số dương) để mỗi cặp có tổng không nhỏ hơn $2$; rồi cộng với kết quả bước 1 để được cận cần tìm.

**Chú ý:** Dấu "=" cần mọi cặp bằng nhau: $a=b$, $c=d$, $ab=cd$, $ac=bd$, $bc=ad$; hệ này buộc bốn biến bằng nhau, kết hợp $abcd=1$ cho $a=b=c=d=1$, đúng điều kiện đề.

**Phần 2. Trình bày**

Vì $a,b,c,d>0$ nên theo Cô-si hai số, $a^2+b^2\ge2ab$ và $c^2+d^2\ge2cd$.

Suy ra $a^2+b^2+c^2+d^2\ge2(ab+cd)$

Mà $ab\cdot cd=abcd=1$ nên theo Cô-si $ab+cd\ge2\sqrt{ab\cdot cd}=2$, do đó $a^2+b^2+c^2+d^2\ge4$ (1)

Ta có $a(b+c)+b(c+d)+d(c+a)=(ab+cd)+(ac+bd)+(bc+ad)$

Ba cặp $(ab;cd)$, $(ac;bd)$, $(bc;ad)$ đều có tích bằng $1$ nên theo Cô-si mỗi tổng $ab+cd$, $ac+bd$, $bc+ad$ đều $\ge2$

Do đó $a(b+c)+b(c+d)+d(c+a)\ge6$ (2)

Cộng (1) và (2): $a^2+b^2+c^2+d^2+a(b+c)+b(c+d)+d(c+a)\ge10$.

Dấu "=" xảy ra khi $a=b=c=d$, kết hợp $abcd=1$ được $a=b=c=d=1$. Vậy bất đẳng thức được chứng minh.

=== C4V.3@p115
- bai: VD3 · y: - · trang: 115 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số (cặp nghịch đảo x/y+y/x≥2) · ghép cặp nghịch đảo
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng khai triển của sách in hai lần $\dfrac{c}{a}$; hạng tử thứ tám phải là $\dfrac{c}{b}$. Các nhóm cặp phía sau vẫn đúng.
## DE
Cho $a,b,c$ là các số dương. Chứng minh rằng $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$.
## SACH
Giải:

$1+\dfrac{a}{b}+\dfrac{a}{c}+\dfrac{b}{a}+1+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{c}{a}+1\ge9\Leftrightarrow3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)\ge9.$

Áp dụng BĐT phụ $\dfrac{x}{y}+\dfrac{y}{x}\ge2$, với $x,y>0$. Ta có BĐT cuối cùng luôn đúng.

Vậy $(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge9$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khi nhân hai tổng, ba hạng tử cùng chữ cho ba số $1$, sáu hạng tử còn lại tự ghép thành ba cặp nghịch đảo $\dfrac{x}{y}+\dfrac{y}{x}$, và mỗi cặp bị chặn dưới bởi $2$ nhờ Cô-si hai số.

**Bước 1.** Nhân từng hạng tử của $a+b+c$ với từng hạng tử của $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}$ để được ba số $1$ và sáu phân số có dạng "một biến chia một biến khác".

**Bước 2.** Ghép sáu phân số thành ba cặp nghịch đảo của nhau: $\dfrac{a}{b}$ với $\dfrac{b}{a}$, $\dfrac{a}{c}$ với $\dfrac{c}{a}$, $\dfrac{b}{c}$ với $\dfrac{c}{b}$.

**Bước 3.** Vì các biến dương, áp dụng Cô-si hai số cho mỗi cặp để tổng mỗi cặp không nhỏ hơn $2$, rồi cộng ba bất đẳng thức với số $3$ ở đầu.

**Chú ý:** Đây là bất đẳng thức hay dùng; tổng quát với $n$ số dương thì $(a_1+\dots+a_n)\left(\dfrac{1}{a_1}+\dots+\dfrac{1}{a_n}\right)\ge n^2$. Có thể dùng thẳng như một "hệ quả Cô-si" ở các bài sau, nhưng phải nêu điều kiện các biến dương.

**Phần 2. Trình bày**

Vì $a,b,c>0$ nên

$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{a}{c}+\dfrac{c}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)$

Theo Cô-si hai số với $x,y>0$: $\dfrac{x}{y}+\dfrac{y}{x}\ge2\sqrt{\dfrac{x}{y}\cdot\dfrac{y}{x}}=2$, nên mỗi ngoặc ở trên đều $\ge2$

$\Rightarrow(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge3+2+2+2=9$

Dấu "=" xảy ra khi $a=b=c$. Vậy bất đẳng thức được chứng minh.

=== C4V.4@p116
- bai: VD4 · y: - · trang: 116 · tang: nang_cao
- nguon_de: Toán tuổi thơ số 154
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: giả sử biến lớn nhất · làm trội · hệ quả của Cô-si (x+y)^2≥4xy
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán tuổi thơ số 154) Cho $a,b,c$ là các số thực không âm có tổng bằng $1$. Chứng minh rằng: $a(b-c)^2+b(c-a)^2+c(a-b)^2\le\dfrac{1}{4}$.
## SACH
Giải:

Đặt $a=\max\{a;b;c\}$. Khi đó ta có:

$a(b-c)^2+b(c-a)^2+c(a-b)^2\le a(b+c)^2+ba^2+ca^2=a(b+c)$.

Sử dụng BĐT $xy\le\dfrac{(x+y)^2}{4}$ ta có $a(b+c)\le\dfrac{(a+b+c)^2}{4}=\dfrac{1}{4}$.

Do đó: $a(b-c)^2+b(c-a)^2+c(a-b)^2\le\dfrac{1}{4}$.

Dấu bằng xảy ra khi và chỉ khi $(a,b,c)=\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$ và các hoán vị của nó.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức đối xứng và dấu "=" ở $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$ ⇒ lấy $a$ là biến lớn nhất để các hiệu $a-b$, $a-c$ bị chặn bởi $a$, rồi gộp mọi hạng tử về một tích hai nhân tử $a(b+c)$ có tổng cố định bằng $1$.

**Bước 1.** Vì biểu thức không đổi khi hoán vị các biến nên giả sử $a$ lớn nhất, nhờ đó $0\le a-b\le a$ và $0\le a-c\le a$ nên có thể làm trội hai hạng tử $b(c-a)^2$ và $c(a-b)^2$.

**Bước 2.** Làm trội hạng tử đầu bằng $(b-c)^2\le(b+c)^2$ (đúng vì $b,c\ge0$), rồi đặt thừa số chung để dùng $a+b+c=1$ gọn tổng về $a(b+c)$.

**Bước 3.** Áp dụng hệ quả $(x+y)^2\ge4xy$ của Cô-si với $x=a$ và $y=b+c$ để chặn $a(b+c)$ bởi bình phương của tổng $a+b+c$.

**Chú ý:** Muốn có dấu "=" thì các bất đẳng thức làm trội phải đồng thời là đẳng thức, nên ngoài $a=b+c$ còn cần $bc=0$; từ đó mới ra bộ $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$.

**Phần 2. Trình bày**

Biểu thức đối xứng với $a,b,c$ nên giả sử $a=\max\{a;b;c\}$, tức $a\ge b\ge0$ và $a\ge c\ge0$.

Khi đó $0\le a-c\le a$ nên $(c-a)^2\le a^2$; tương tự $(a-b)^2\le a^2$. Mặt khác $(b+c)^2-(b-c)^2=4bc\ge0$ nên $(b-c)^2\le(b+c)^2$.

$\Rightarrow a(b-c)^2+b(c-a)^2+c(a-b)^2\le a(b+c)^2+ba^2+ca^2$

$=a(b+c)^2+a^2(b+c)=a(b+c)(b+c+a)=a(b+c)$

Theo hệ quả Cô-si $(x+y)^2\ge4xy$ (với $x=a\ge0$, $y=b+c\ge0$): $a(b+c)\le\dfrac{(a+b+c)^2}{4}=\dfrac{1}{4}$

Vậy $a(b-c)^2+b(c-a)^2+c(a-b)^2\le\dfrac{1}{4}$.

Dấu "=" xảy ra khi $a=b+c$ và $bc=0$, kết hợp $a+b+c=1$ được $a=\dfrac{1}{2}$ và $\{b;c\}=\left\{\dfrac{1}{2};0\right\}$. Vậy dấu "=" xảy ra tại $(a;b;c)=\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$ và các hoán vị của nó.

=== C4V.5@p116
- bai: VD5 · y: - · trang: 116 · tang: nang_cao
- nguon_de: Toán tuổi thơ số 147 + 148
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả của Cô-si (x+y)^2≥4xy · Cô-si hai số x^2+y^2≥2xy · đặt s=x^2+y^2, p=xy
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách viết "$34\cdot2xy+4xy$" ở mẫu mà không giải thích; bản GIAI chứng minh $35s^2+4p^2\ge72ps$ bằng phân tích $(35s-2p)(s-2p)\ge0$.
## DE
(Toán tuổi thơ số 147 + 148) Cho $x,y$ là các số thực dương sao cho $x+y\le xy$. Chứng minh rằng: $M=\dfrac{1}{5x^2+7y^2}+\dfrac{1}{5y^2+7x^2}\le\dfrac{1}{24}$.
## SACH
Giải:

Từ giả thiết ta có: $x+y\le xy\le\dfrac{(x+y)^2}{4}\Rightarrow4\le x+y\le xy$.

Ta có: $M=\dfrac{1}{5x^2+7y^2}+\dfrac{1}{5y^2+7x^2}=\dfrac{12(y^2+x^2)}{35(y^2+x^2)^2+4x^2y^2}$.

Sử dụng bất đẳng thức $a^2+b^2\ge2ab$. Ta có:

$M=\dfrac{1}{5x^2+7y^2}+\dfrac{1}{5y^2+7x^2}=\dfrac{12(y^2+x^2)}{35(y^2+x^2)^2+4x^2y^2}\le\dfrac{12}{34\cdot2xy+4xy}=\dfrac{1}{6xy}\le\dfrac{1}{24}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x+y\le xy$ kết hợp $xy\le\dfrac{(x+y)^2}{4}$ cho cận dưới $xy\ge4$; còn hai mẫu nhân với nhau cho một biểu thức đối xứng theo $s=x^2+y^2$ và $p=xy$ nên có thể so sánh với $\dfrac{1}{6p}$.

**Bước 1.** Từ $x+y\le xy\le\dfrac{(x+y)^2}{4}$ và $x+y>0$ suy ra $x+y\ge4$, rồi $xy\ge x+y\ge4$; đây là cận dưới của $p=xy$ cần dùng ở cuối bài.

**Bước 2.** Quy đồng hai phân thức: tổng hai tử là $12(x^2+y^2)$ còn tích hai mẫu khai triển được thành $35s^2+4p^2$ với $s=x^2+y^2$, $p=xy$.

**Bước 3.** Chứng minh mẫu lớn hơn $72ps$ bằng cách viết hiệu thành tích hai nhân tử không âm, nhờ $s\ge2p$ (Cô-si hai số), để suy ra $M\le\dfrac{1}{6p}$.

**Bước 4.** Dùng $p\ge4$ ở bước 1 để so sánh $\dfrac{1}{6p}$ với $\dfrac{1}{24}$ và tìm dấu "=" từ chỗ $s=2p$ và $p=4$.

**Phần 2. Trình bày**

Vì $x,y>0$ nên theo hệ quả Cô-si $(x+y)^2\ge4xy$ ta có $x+y\le xy\le\dfrac{(x+y)^2}{4}$

Chia hai vế cho $x+y>0$ được $x+y\ge4$, suy ra $xy\ge x+y\ge4$ (1)

Đặt $s=x^2+y^2$, $p=xy$. Theo Cô-si hai số, $s\ge2p>0$ (2)

Ta có $(5x^2+7y^2)(5y^2+7x^2)=35(x^4+y^4)+74x^2y^2=35s^2+4p^2$ và $(5x^2+7y^2)+(5y^2+7x^2)=12s$

$\Rightarrow M=\dfrac{12s}{35s^2+4p^2}$

Mặt khác $35s^2+4p^2-72ps=(35s-2p)(s-2p)\ge0$ do (2), nên $35s^2+4p^2\ge72ps$

$\Rightarrow M\le\dfrac{12s}{72ps}=\dfrac{1}{6p}\le\dfrac{1}{24}$ (do $p\ge4$ theo (1))

Vậy $M\le\dfrac{1}{24}$.

Dấu "=" xảy ra khi $s=2p$ và $p=4$, tức $x=y$ và $xy=4$, nên $x=y=2$ (thỏa $x+y=4=xy$).

=== C4B.1@p117
- bai: 1 · y: - · trang: 117 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số (cặp nghịch đảo) · hệ quả 1/x+1/y≥4/(x+y) · cộng hai đánh giá
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a,b,c$ là các số thực dương. Chứng minh rằng: $\dfrac{(a+b)^2}{ab}+\dfrac{(b+c)^2}{bc}+\dfrac{(c+a)^2}{ca}\ge9+2\left(\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\right)$.
## SACH
Hướng dẫn giải:

$A=\dfrac{(a+b)^2}{ab}+\dfrac{(b+c)^2}{bc}+\dfrac{(c+a)^2}{ca}=\dfrac{a}{b}+\dfrac{b}{a}+\dfrac{c}{b}+\dfrac{b}{c}+\dfrac{c}{a}+\dfrac{a}{c}+6$

Sử dụng bất đẳng thức $\dfrac{a}{b}+\dfrac{b}{a}\ge2$; $\dfrac{c}{b}+\dfrac{b}{c}\ge2$; $\dfrac{a}{c}+\dfrac{c}{a}\ge2$ $\forall a,b,c>0$

nên $A=\dfrac{(a+b)^2}{ab}+\dfrac{(b+c)^2}{bc}+\dfrac{(c+a)^2}{ca}\ge12$ (1)

Áp dụng bất đẳng thức: $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ với $x,y$ dương. Ta có:

$\dfrac{a}{b}+\dfrac{a}{c}=a\left(\dfrac{1}{b}+\dfrac{1}{c}\right)\ge\dfrac{4a}{b+c}$; $\dfrac{b}{a}+\dfrac{b}{c}=b\left(\dfrac{1}{a}+\dfrac{1}{c}\right)\ge\dfrac{4b}{a+c}$; $\dfrac{c}{a}+\dfrac{c}{b}=c\left(\dfrac{1}{a}+\dfrac{1}{b}\right)\ge\dfrac{4c}{b+a}$.

Suy ra: $A\ge4\left(\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\right)+6$ (2)

Từ (1) và (2) suy ra $2A\ge18+4\left(\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\right)$

nên $\dfrac{(a+b)^2}{ab}+\dfrac{(b+c)^2}{bc}+\dfrac{(c+a)^2}{ca}\ge9+2\left(\dfrac{a}{b+c}+\dfrac{b}{a+c}+\dfrac{c}{a+b}\right)$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái khai triển thành sáu phân số dạng $\dfrac{x}{y}$ cộng với $6$, và có thể chặn dưới theo hai cách: bằng $12$ (ghép cặp nghịch đảo) hoặc bằng $4\left(\dfrac{a}{b+c}+\dots\right)+6$ (vì vế phải có dạng $\dfrac{a}{b+c}$); cộng hai đánh giá thì ra đúng hệ số $9$ và $2$.

**Bước 1.** Khai triển $\dfrac{(a+b)^2}{ab}=\dfrac{a}{b}+\dfrac{b}{a}+2$ để vế trái thành tổng sáu phân số cộng với $6$.

**Bước 2.** Ghép sáu phân số thành ba cặp nghịch đảo rồi dùng Cô-si hai số cho mỗi cặp để chặn vế trái từ dưới bằng một hằng số.

**Bước 3.** Ghép lại theo cách khác, $\dfrac{a}{b}+\dfrac{a}{c}=a\left(\dfrac{1}{b}+\dfrac{1}{c}\right)$, và dùng $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ để xuất hiện các phân số $\dfrac{a}{b+c}$ có mặt ở vế phải.

**Bước 4.** Cộng hai đánh giá của bước 2 và bước 3 theo vế rồi chia đôi để hạng tử tự do thành $9$ và hệ số của tổng ba phân số thành $2$.

**Phần 2. Trình bày**

Đặt $A=\dfrac{(a+b)^2}{ab}+\dfrac{(b+c)^2}{bc}+\dfrac{(c+a)^2}{ca}$. Vì $a,b,c>0$ nên

$A=\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)+\left(\dfrac{c}{a}+\dfrac{a}{c}\right)+6$

Theo Cô-si hai số, mỗi ngoặc đều $\ge2$, nên $A\ge12$ (1)

Với $x,y>0$ ta có $\dfrac{1}{x}+\dfrac{1}{y}\ge\dfrac{4}{x+y}$ (hệ quả của $(x+y)^2\ge4xy$). Do đó

$\dfrac{a}{b}+\dfrac{a}{c}=a\left(\dfrac{1}{b}+\dfrac{1}{c}\right)\ge\dfrac{4a}{b+c}$, $\dfrac{b}{c}+\dfrac{b}{a}\ge\dfrac{4b}{c+a}$, $\dfrac{c}{a}+\dfrac{c}{b}\ge\dfrac{4c}{a+b}$

Cộng ba bất đẳng thức: $A\ge4\left(\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\right)+6$ (2)

Cộng (1) và (2): $2A\ge18+4\left(\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\right)$

Chia hai vế cho $2$: $A\ge9+2\left(\dfrac{a}{b+c}+\dfrac{b}{c+a}+\dfrac{c}{a+b}\right)$ (đpcm).

Dấu "=" xảy ra khi và chỉ khi các cặp ở (1) và (2) đồng thời là đẳng thức, tức $a=b=c$.

=== C4B.2@p117
- bai: 2 · y: - · trang: 117 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ 397
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bất đẳng thức tứ giác (mỗi cạnh nhỏ hơn tổng ba cạnh còn lại) · đặt ẩn phụ · Cô-si hai số (cặp nghịch đảo)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán học & tuổi trẻ 397) Cho $a,b,c,d$ là cạnh của một tứ giác lồi. Chứng minh rằng: $P=\dfrac{2017a}{b+c+d-a}+\dfrac{2017b}{c+d+a-b}+\dfrac{2017c}{b+a+d-c}+\dfrac{2017d}{a+b+c-d}\ge4034$.
## SACH
Hướng dẫn giải:

Đặt:

$x=b+c+d-a$; $y=c+d+a-b$; $z=b+a+d-c$; $t=a+b+c-d$.

Nên suy ra $a=\dfrac{y+z+t-x}{4}$; $b=\dfrac{x+z+t-y}{4}$; $c=\dfrac{y+x+t-z}{4}$; $d=\dfrac{y+z+x-t}{4}$;

Vì $a,b,c,d$ là cạnh của một tứ giác lồi nên $x,y,z,t$ dương.

$P=\dfrac{2017}{4}\left[\left(\dfrac{x}{y}+\dfrac{y}{x}\right)+\left(\dfrac{x}{z}+\dfrac{z}{x}\right)+\left(\dfrac{x}{t}+\dfrac{t}{x}\right)+\left(\dfrac{z}{y}+\dfrac{y}{z}\right)+\left(\dfrac{t}{y}+\dfrac{y}{t}\right)+\left(\dfrac{t}{z}+\dfrac{z}{t}\right)-4\right]$

Ta có: $P\ge\dfrac{2017}{4}(12-4)=4034$. Dấu bằng xảy ra khi và chỉ khi $a=b=c=d$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi mẫu có dạng "tổng ba cạnh trừ cạnh thứ tư" nên đặt mỗi mẫu thành một biến mới; khi đó tử $a$ biểu diễn được theo bốn biến mới và mỗi phân thức tách thành các tỉ số $\dfrac{y}{x}$, ghép được thành các cặp nghịch đảo để dùng Cô-si.

**Bước 1.** Đặt $x,y,z,t$ lần lượt là bốn mẫu số; vì tứ giác lồi nên mỗi cạnh nhỏ hơn tổng ba cạnh còn lại, do đó cả bốn biến mới đều dương.

**Bước 2.** Cộng ba biến mới rồi trừ biến còn lại để biểu diễn $a=\dfrac{y+z+t-x}{4}$, và làm tương tự cho $b,c,d$.

**Bước 3.** Thay vào $P$, tách mỗi phân thức thành $\dfrac{y+z+t}{x}-1$ rồi gom thành sáu cặp nghịch đảo $\dfrac{x}{y}+\dfrac{y}{x}$ cùng số hạng $-4$.

**Bước 4.** Áp dụng Cô-si hai số cho sáu cặp (các biến mới dương) để mỗi cặp không nhỏ hơn $2$, rồi tính cận dưới của $P$.

**Phần 2. Trình bày**

Đặt $x=b+c+d-a$, $y=c+d+a-b$, $z=d+a+b-c$, $t=a+b+c-d$. Vì $a,b,c,d$ là độ dài các cạnh của tứ giác lồi nên mỗi cạnh nhỏ hơn tổng ba cạnh còn lại, do đó $x,y,z,t>0$.

Cộng ba biến rồi trừ biến còn lại ta được $y+z+t-x=4a$, $x+z+t-y=4b$, $x+y+t-z=4c$, $x+y+z-t=4d$

$\Rightarrow P=\dfrac{2017}{4}\left[\dfrac{y+z+t-x}{x}+\dfrac{x+z+t-y}{y}+\dfrac{x+y+t-z}{z}+\dfrac{x+y+z-t}{t}\right]$

$=\dfrac{2017}{4}\left[\left(\dfrac{x}{y}+\dfrac{y}{x}\right)+\left(\dfrac{x}{z}+\dfrac{z}{x}\right)+\left(\dfrac{x}{t}+\dfrac{t}{x}\right)+\left(\dfrac{y}{z}+\dfrac{z}{y}\right)+\left(\dfrac{y}{t}+\dfrac{t}{y}\right)+\left(\dfrac{z}{t}+\dfrac{t}{z}\right)-4\right]$

Theo Cô-si hai số, mỗi ngoặc đều $\ge2$ (vì $x,y,z,t>0$), nên $P\ge\dfrac{2017}{4}(6\cdot2-4)=4034$.

Dấu "=" xảy ra khi $x=y=z=t$, tức $a=b=c=d$. Vậy $P\ge4034$.

=== C4B.3@p118
- bai: 3 · y: - · trang: 118 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ số 396
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ quả Cô-si (a+b+c)(1/a+1/b+1/c)≥9
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "$x+y=z\ge\dfrac{9}{2017}$" (phải là $x+y+z$) và chứng minh được cận mạnh hơn $\dfrac{9}{2017}$; đề chỉ đòi $\dfrac{3}{2017}$ nên dấu "=" của đề không bao giờ xảy ra, còn dấu "=" sách nêu ($x=y=z=\dfrac{3}{2017}$) là của cận $\dfrac{9}{2017}$. Điều kiện $ax^3=by^3=cz^3$ không được dùng. Phần "Bài toán tổng quát" của sách chỉ nêu đề, không giải; chép trong SACH, không thành câu riêng.
## DE
(Toán học & tuổi trẻ số 396) Cho $a,b,c,x,y,z$ là các số dương thỏa mãn $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2017$ và $ax^3=by^3=cz^3$. Chứng minh rằng: $x+y+z\ge\dfrac{3}{2017}$.
## SACH
Hướng dẫn giải:

Với $x,y,z$ dương thì $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9\Rightarrow\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge\dfrac{9}{x+y+z}$.

Ta có: $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2017$ nên $x+y=z\ge\dfrac{9}{2017}$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c$ và $x=y=z=\dfrac{3}{2017}$.

Bài toán tổng quát cho học sinh phát triển tư duy:

Cho $a_1,a_2,\dots a_k,x_1,x_2,\dots x_k$ là các số dương thỏa mãn: $\dfrac{1}{x_1}+\dfrac{1}{x_2}+\dots+\dfrac{1}{x_k}=n$ (với $m,n\in\mathbb{N}^*$), $a_1x_1^m=a_2x_2^m=\dots=a_nx_k^m$.

Chứng minh rằng: $x_1+x_2+\dots+x_k\ge\dfrac{k^2}{n}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết cho tổng các nghịch đảo $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2017$ còn đề cần chặn dưới tổng $x+y+z$ ⇒ nhân hai tổng này sẽ ra tích $(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$ của ba số dương; điều kiện $ax^3=by^3=cz^3$ không cần đến.

**Bước 1.** Nhận ra tích của tổng ba số dương với tổng ba nghịch đảo của chúng không nhỏ hơn $9$, theo Cô-si hai số cho từng cặp nghịch đảo.

**Bước 2.** Thay $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2017$ vào bất đẳng thức đó rồi chia hai vế cho số dương $2017$ để chặn dưới $x+y+z$.

**Bước 3.** So sánh cận thu được với $\dfrac{3}{2017}$ để kết luận, vì cận đó lớn hơn cận mà đề yêu cầu.

**Phần 2. Trình bày**

Vì $x,y,z>0$ nên theo hệ quả Cô-si (khai triển rồi dùng $\dfrac{u}{v}+\dfrac{v}{u}\ge2$ với $u,v>0$):

$(x+y+z)\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge9$

Mà $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=2017$ nên $2017(x+y+z)\ge9$, suy ra $x+y+z\ge\dfrac{9}{2017}$

Vì $\dfrac{9}{2017}>\dfrac{3}{2017}$ nên $x+y+z\ge\dfrac{3}{2017}$.

Vậy bất đẳng thức được chứng minh. (Cận $\dfrac{9}{2017}$ đạt khi $x=y=z=\dfrac{3}{2017}$.)

=== C4B.4@p118
- bai: 4 · y: - · trang: 118 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ số 399
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: giả sử biến nhỏ nhất (hoán vị vòng) · làm trội · so sánh mẫu
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách đúng; chỗ "giả sử $a\ge c$, $b\ge c$" hợp lệ vì hai vế bất biến khi hoán vị vòng quanh nên luôn đưa được biến nhỏ nhất về vị trí $c$.
## DE
(Toán học & tuổi trẻ số 399) Cho $a,b,c$ là các số dương. Chứng minh rằng: $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\ge\dfrac{a+2017}{b+2017}+\dfrac{b+2017}{c+2017}+\dfrac{c+2017}{a+2017}$.
## SACH
Hướng dẫn giải:

Do vai trò bình đẳng của $a,b,c$ khi hoán vị vòng quanh nên ta giả sử $a\ge c$, $b\ge c$.

Ta có: $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}-3=\left(\dfrac{a}{b}+\dfrac{b}{a}-2\right)+\left(\dfrac{b}{c}+\dfrac{c}{a}-\dfrac{b}{a}-1\right)=\dfrac{(a-b)^2}{ab}+\dfrac{(a-c)(b-c)}{ac}$ (1)

Xét $d$ là một số thực bất kỳ. Tương tự như trên ta có:

$\dfrac{a+d}{b+d}+\dfrac{b+d}{c+d}+\dfrac{c+d}{a+d}-3=\dfrac{(a-b)^2}{(a+d)(b+d)}+\dfrac{(a-c)(b-c)}{(a+d)(c+d)}$ (2)

Vì $a,b,c>0$; $a\ge c$, $d\ge c$ và với $d\ge0$ nên:

$\dfrac{(a-b)^2}{ab}+\dfrac{(a-c)(b-c)}{ac}\ge\dfrac{(a-b)^2}{(a+d)(b+d)}+\dfrac{(a-c)(b-c)}{(a+d)(c+d)}$ (3)

Từ (1); (2) và (3) suy ra $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\ge\dfrac{a+d}{b+d}+\dfrac{b+d}{c+d}+\dfrac{c+d}{a+d}$.

Bài toán đã cho ứng với $d=2017$. Dấu bằng xảy ra khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai vế có cùng dạng $\dfrac{u}{v}+\dfrac{v}{w}+\dfrac{w}{u}$, với $(u,v,w)=(a,b,c)$ và $(a+d,b+d,c+d)$ khi $d=2017$; nên tìm đồng nhất thức đưa mỗi vế trừ $3$ về tổng hai phân thức có tử không âm, rồi so sánh các mẫu.

**Bước 1.** Hai vế đều giữ nguyên khi hoán vị vòng $a\to b\to c\to a$, nên giả sử $c$ nhỏ nhất; khi đó $a-c\ge0$ và $b-c\ge0$.

**Bước 2.** Chứng minh đồng nhất thức $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}-3=\dfrac{(a-b)^2}{ab}+\dfrac{(a-c)(b-c)}{ac}$ bằng cách ghép $\dfrac{a}{b}+\dfrac{b}{a}-2$ với phần còn lại.

**Bước 3.** Thay $a,b,c$ bởi $a+d,b+d,c+d$ (cũng dương, các hiệu giữ nguyên) để vế phải trừ $3$ có cùng dạng, chỉ khác ở mẫu số.

**Bước 4.** So sánh mẫu: $ab<(a+d)(b+d)$ và $ac<(a+d)(c+d)$, mà tử không âm nên mỗi phân thức của vế trái lớn hơn phân thức tương ứng của vế phải; rồi cộng lại.

**Phần 2. Trình bày**

Đặt $d=2017>0$. Hai vế bất biến khi hoán vị vòng $a\to b\to c\to a$ nên giả sử $c=\min\{a;b;c\}$, tức $a-c\ge0$, $b-c\ge0$.

Với $u,v,w>0$ ta có $\dfrac{u}{v}+\dfrac{v}{w}+\dfrac{w}{u}-3=\left(\dfrac{u}{v}+\dfrac{v}{u}-2\right)+\left(\dfrac{v}{w}+\dfrac{w}{u}-\dfrac{v}{u}-1\right)=\dfrac{(u-v)^2}{uv}+\dfrac{(u-w)(v-w)}{uw}$

vì $\dfrac{v}{w}-\dfrac{v}{u}=\dfrac{v(u-w)}{uw}$ và $\dfrac{w}{u}-1=-\dfrac{w(u-w)}{uw}$.

Áp dụng với $(u;v;w)=(a;b;c)$: $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}-3=\dfrac{(a-b)^2}{ab}+\dfrac{(a-c)(b-c)}{ac}$ (1)

Áp dụng với $(u;v;w)=(a+d;b+d;c+d)$ (đều dương, các hiệu không đổi):

$\dfrac{a+d}{b+d}+\dfrac{b+d}{c+d}+\dfrac{c+d}{a+d}-3=\dfrac{(a-b)^2}{(a+d)(b+d)}+\dfrac{(a-c)(b-c)}{(a+d)(c+d)}$ (2)

Vì $0<ab<(a+d)(b+d)$ và $0<ac<(a+d)(c+d)$, còn $(a-b)^2\ge0$ và $(a-c)(b-c)\ge0$, nên

$\dfrac{(a-b)^2}{ab}+\dfrac{(a-c)(b-c)}{ac}\ge\dfrac{(a-b)^2}{(a+d)(b+d)}+\dfrac{(a-c)(b-c)}{(a+d)(c+d)}$ (3)

Từ (1), (2), (3): $\dfrac{a}{b}+\dfrac{b}{c}+\dfrac{c}{a}\ge\dfrac{a+d}{b+d}+\dfrac{b+d}{c+d}+\dfrac{c+d}{a+d}$, với $d=2017$ chính là điều phải chứng minh.

Dấu "=" xảy ra khi $(a-b)^2=0$ và $(a-c)(b-c)=0$, tức $a=b$ và ($a=c$ hoặc $b=c$), suy ra $a=b=c$.

=== C4B.5@p119
- bai: 5 · y: - · trang: 119 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 86
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: thay 2=a+b+c để phân tích mẫu · Cô-si hai số (a^2+b^2≥2ab) · Cô-si ba số (xyz≤((x+y+z)/3)^3)
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán học tuổi thơ số 86) Cho $a,b,c$ là các số thực dương có tổng bằng $2$. Chứng minh rằng: $P=\dfrac{a}{ab+2c}+\dfrac{b}{bc+2a}+\dfrac{c}{ca+2b}\ge\dfrac{9}{8}$.
## SACH
Hướng dẫn giải:

Ta có: $ab+2c=(b+c)(c+a)$; $bc+2a=(b+a)(c+a)$; $ca+2b=(b+a)(c+b)$.

Lúc đó: $P=\dfrac{a}{ab+2c}+\dfrac{b}{bc+2a}+\dfrac{c}{ca+2b}=\dfrac{a(a+b)+b(c+b)+c(a+c)}{(a+b)(c+b)(a+c)}$.

Áp dụng BĐT $a^2+c^2\ge2ac$; $a^2+b^2\ge2ab$; $b^2+c^2\ge2bc$ với $a,b,c$ dương.

Cộng vế 3 BĐT trên ta có $a^2+b^2+c^2\ge ab+bc+ca$.

Do đó:

$a(a+b)+b(c+b)+c(a+c)=\dfrac{1}{3}(a^2+b^2+c^2)+\dfrac{2}{3}(a^2+b^2+c^2)+ab+bc+ca$

$\ge\dfrac{1}{3}(ab+bc+ca)+\dfrac{2}{3}(a^2+b^2+c^2)+ab+bc+ca=\dfrac{2}{3}(a+b+c)^2=\dfrac{8}{3}$.

Mặt khác áp dụng BĐT $abc\le\left(\dfrac{a+b+c}{3}\right)^3$ ta có:

$(a+b)(c+b)(a+c)\le\left(\dfrac{2a+2b+2c}{3}\right)^3=\dfrac{64}{27}$.

Lúc đó suy ra được: $P=\dfrac{a}{ab+2c}+\dfrac{b}{bc+2a}+\dfrac{c}{ca+2b}\ge\dfrac{9}{8}$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c=\dfrac{2}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+b+c=2$ cho phép viết $2c=c(a+b+c)$ nên mỗi mẫu như $ab+2c$ phân tích được thành tích hai nhân tử dạng $(b+c)(c+a)$; ba mẫu cùng chứa các nhân tử $a+b$, $b+c$, $c+a$ nên quy đồng được dễ dàng.

**Bước 1.** Thay $2=a+b+c$ vào các mẫu để phân tích $ab+2c=(b+c)(c+a)$, $bc+2a=(a+b)(a+c)$, $ca+2b=(a+b)(b+c)$.

**Bước 2.** Quy đồng ba phân thức về mẫu chung $(a+b)(b+c)(c+a)$ được tử là $a(a+b)+b(b+c)+c(c+a)$.

**Bước 3.** Chặn dưới tử bằng cách viết nó thành $(a+b+c)^2-(ab+bc+ca)$ rồi dùng $ab+bc+ca\le\dfrac{(a+b+c)^2}{3}$ (suy ra từ $a^2+b^2+c^2\ge ab+bc+ca$).

**Bước 4.** Chặn trên mẫu bằng Cô-si ba số cho ba số dương $a+b$, $b+c$, $c+a$ có tổng bằng $4$, rồi chia cận dưới của tử cho cận trên của mẫu.

**Phần 2. Trình bày**

Vì $a+b+c=2$ nên $ab+2c=ab+c(a+b+c)=(b+c)(c+a)$; tương tự $bc+2a=(a+b)(a+c)$ và $ca+2b=(a+b)(b+c)$.

$P=\dfrac{a}{(b+c)(c+a)}+\dfrac{b}{(a+b)(c+a)}+\dfrac{c}{(a+b)(b+c)}=\dfrac{a(a+b)+b(b+c)+c(c+a)}{(a+b)(b+c)(c+a)}$

Tử số $=a^2+b^2+c^2+ab+bc+ca=(a+b+c)^2-(ab+bc+ca)$

Từ $a^2+b^2+c^2\ge ab+bc+ca$ (cộng ba bất đẳng thức Cô-si hai số $a^2+b^2\ge2ab$, ...) suy ra $(a+b+c)^2\ge3(ab+bc+ca)$, tức $ab+bc+ca\le\dfrac{4}{3}$

$\Rightarrow$ Tử số $\ge4-\dfrac{4}{3}=\dfrac{8}{3}$

Theo Cô-si ba số cho ba số dương $a+b$, $b+c$, $c+a$: $(a+b)(b+c)(c+a)\le\left(\dfrac{2(a+b+c)}{3}\right)^3=\left(\dfrac{4}{3}\right)^3=\dfrac{64}{27}$

Do đó $P\ge\dfrac{8}{3}:\dfrac{64}{27}=\dfrac{9}{8}$.

Dấu "=" xảy ra khi $a=b=c$, kết hợp $a+b+c=2$ được $a=b=c=\dfrac{2}{3}$. Vậy bất đẳng thức được chứng minh.

=== C4B.6@p120
- bai: 6 · y: - · trang: 120 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 44
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si ba số (uvw≤((u+v+w)/3)^3) · đưa điều kiện về tổng, tích · hoàn thành bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán học tuổi thơ số 44) Cho $x,y,z$ là các số thực thuộc khoảng $(0;1)$ thỏa mãn $xyz=(1-x)(1-y)(1-z)$. Chứng minh rằng $x^2+y^2+z^2\ge\dfrac{3}{4}$.
## SACH
Hướng dẫn giải:

Từ giả thiết ta có:

$xyz=(1-x)(1-y)(1-z)\Rightarrow2xyz=1-(x+y+z)+(xy+yz+zx)$ (1).

Từ giả thiết ta cũng có: $xyz=(1-x)(1-y)(1-z)\Rightarrow1=\left(\dfrac{1}{x}-1\right)\left(\dfrac{1}{y}-1\right)\left(\dfrac{1}{z}-1\right)$.

Áp dụng bất đẳng thức: $abc\le\left(\dfrac{a+b+c}{3}\right)^3$.

Ta có: $1=\left(\dfrac{1}{x}-1\right)\left(\dfrac{1}{y}-1\right)\left(\dfrac{1}{z}-1\right)\le\left(\dfrac{\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}-3}{3}\right)^3\Rightarrow3\le\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}-3$

$\Rightarrow6\le\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\Rightarrow6xyz\le xy+yz+zx$ (2). Từ (1) và (2) suy ra:

$3-3(x+y+z)+3(xy+yz+zx)=6xyz\le xy+yz+zx$

$\Rightarrow0\ge3-3(x+y+z)+2(xy+yz+zx)$

Cộng hai vế của BĐT trên cho $(x^2+y^2+z^2)$ ta được:

$x^2+y^2+z^2\ge(x+y+z)^2-3(x+y+z)+3=\left(x+y+z-\dfrac{3}{2}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}$.

Dấu bằng xảy ra khi và chỉ khi $x=y=z=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $xyz=(1-x)(1-y)(1-z)$ cho hai thông tin: khai triển ra quan hệ giữa $x+y+z$ và $xy+yz+zx$, và chia cho $xyz$ ra $\prod\left(\dfrac{1}{x}-1\right)=1$ gồm ba thừa số dương để dùng Cô-si ba số; kết hợp lại rồi cộng $x^2+y^2+z^2$ để tạo bình phương.

**Bước 1.** Khai triển $(1-x)(1-y)(1-z)$ để biến điều kiện thành $2xyz=1-(x+y+z)+(xy+yz+zx)$.

**Bước 2.** Chia điều kiện cho $xyz$ được tích ba số dương $\dfrac{1}{x}-1$, $\dfrac{1}{y}-1$, $\dfrac{1}{z}-1$ bằng $1$, rồi dùng Cô-si ba số để chặn dưới $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}$ bằng một hằng số, tức $xy+yz+zx\ge6xyz$.

**Bước 3.** Thế $6xyz$ từ bước 1 vào bất đẳng thức bước 2 để có một bất đẳng thức chỉ chứa $x+y+z$ và $xy+yz+zx$.

**Bước 4.** Cộng thêm $x^2+y^2+z^2$ vào hai vế để vế phải thành $(x+y+z)^2-3(x+y+z)+3$ rồi hoàn thành bình phương.

**Phần 2. Trình bày**

Từ giả thiết, khai triển: $2xyz=1-(x+y+z)+(xy+yz+zx)$ (1)

Vì $x,y,z\in(0;1)$ nên $u=\dfrac{1}{x}-1$, $v=\dfrac{1}{y}-1$, $w=\dfrac{1}{z}-1$ đều dương, và chia giả thiết cho $xyz$ được $uvw=1$.

Theo Cô-si ba số, $uvw\le\left(\dfrac{u+v+w}{3}\right)^3$, nên $\left(\dfrac{u+v+w}{3}\right)^3\ge1$, tức $u+v+w\ge3$

$\Rightarrow\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$, nhân hai vế với $xyz>0$: $xy+yz+zx\ge6xyz$ (2)

Từ (1): $6xyz=3-3(x+y+z)+3(xy+yz+zx)$. Thay vào (2):

$3-3(x+y+z)+3(xy+yz+zx)\le xy+yz+zx$

$\Rightarrow3-3(x+y+z)+2(xy+yz+zx)\le0$

Cộng $x^2+y^2+z^2$ vào hai vế:

$x^2+y^2+z^2\ge(x+y+z)^2-3(x+y+z)+3=\left(x+y+z-\dfrac{3}{2}\right)^2+\dfrac{3}{4}\ge\dfrac{3}{4}$

Dấu "=" xảy ra khi $u=v=w=1$ và $x+y+z=\dfrac{3}{2}$, tức $x=y=z=\dfrac{1}{2}$ (thỏa giả thiết vì $\dfrac{1}{8}=\dfrac{1}{8}$). Vậy $x^2+y^2+z^2\ge\dfrac{3}{4}$.

=== C4B.7@p120
- bai: 7 · y: - · trang: 120 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 23
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách phân thức a/(1+b^2)=a-ab^2/(1+b^2) · Cô-si hai số (1+b^2≥2b) · a^2+b^2+c^2≥ab+bc+ca
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in nhầm: dòng đầu viết $\dfrac{a}{1+a^2}$ ở số hạng thứ ba (phải là $\dfrac{c}{1+a^2}$) và "$c^2+1^1$" (phải là $c^2+1^2$). Không ảnh hưởng đáp số.
## DE
(Toán học tuổi thơ số 23) Cho $a,b,c$ là $3$ số dương thỏa mãn tổng bằng $3$. Chứng minh rằng: $\dfrac{a}{1+b^2}+\dfrac{b}{1+c^2}+\dfrac{c}{1+a^2}\ge\dfrac{3}{2}$.
## SACH
Hướng dẫn giải:

$(1)\Leftrightarrow a+b+c-\left(\dfrac{a}{1+b^2}+\dfrac{b}{1+c^2}+\dfrac{a}{1+a^2}\right)\le3-\dfrac{3}{2}\Leftrightarrow\dfrac{ab^2}{1+b^2}+\dfrac{bc^2}{1+c^2}+\dfrac{ca^2}{1+a^2}\le\dfrac{3}{2}$ (2)

Sử dụng bất đẳng thức $x^2+y^2\ge2xy$ với $x,y$ dương.

Ta có: $b^2+1^2=b^2+1^2\ge2b$; $a^2+1^2=a^2+1^2\ge2a$; $c^2+1^1=c^2+1^2\ge2c$

Nên:

$\Leftrightarrow\dfrac{ab^2}{1+b^2}+\dfrac{bc^2}{1+c^2}+\dfrac{ca^2}{1+a^2}\le\dfrac{ab^2}{2b}+\dfrac{bc^2}{2c}+\dfrac{ca^2}{2a}=\dfrac{1}{2}(ab+bc+ca)$ (3)

Ta có: $b^2+a^2\ge2ab$; $a^2+c^2\ge2ac$; $c^2+b^2\ge2bc$

Nên:

$a^2+b^2+c^2\ge ab+bc+ca\Rightarrow(a+b+c)^2\ge3(ab+bc+ca)\Rightarrow ab+bc+ca\le3$ (4)

Từ (3) và (4) ta có: $\dfrac{ab^2}{1+b^2}+\dfrac{bc^2}{1+c^2}+\dfrac{ca^2}{1+a^2}\le\dfrac{3}{2}$

nên suy ra $\dfrac{a}{1+b^2}+\dfrac{b}{1+c^2}+\dfrac{c}{1+a^2}\ge\dfrac{3}{2}$

Dấu bằng xảy ra khi và chỉ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $1+b^2$ không có chỗ để dùng Cô-si trực tiếp trên phân thức cần chặn dưới; tách $\dfrac{a}{1+b^2}=a-\dfrac{ab^2}{1+b^2}$ đổi bài toán thành chặn trên phân thức bị trừ, và khi đó $1+b^2\ge2b$ làm mẫu nhỏ đi đúng chiều.

**Bước 1.** Tách mỗi số hạng thành $a-\dfrac{ab^2}{1+b^2}$ để cần chứng minh tổng ba phân thức $\dfrac{ab^2}{1+b^2}$ không quá một hằng số.

**Bước 2.** Dùng Cô-si hai số $1+b^2\ge2b$ (với $b>0$) để thay mẫu bằng $2b$, mỗi phân thức không vượt quá $\dfrac{ab}{2}$.

**Bước 3.** Cộng ba đánh giá được tổng $\dfrac{ab+bc+ca}{2}$, rồi chặn $ab+bc+ca$ bằng $\dfrac{(a+b+c)^2}{3}$ nhờ $a^2+b^2+c^2\ge ab+bc+ca$.

**Bước 4.** Kết hợp $a+b+c=3$ để tính cận dưới của vế trái và kiểm tra các dấu "=" cùng xảy ra tại $a=b=c=1$.

**Phần 2. Trình bày**

Vì $a,b,c>0$ nên $\dfrac{a}{1+b^2}=a-\dfrac{ab^2}{1+b^2}$, và theo Cô-si hai số $1+b^2\ge2b>0$ nên $\dfrac{ab^2}{1+b^2}\le\dfrac{ab^2}{2b}=\dfrac{ab}{2}$

$\Rightarrow\dfrac{a}{1+b^2}\ge a-\dfrac{ab}{2}$; tương tự $\dfrac{b}{1+c^2}\ge b-\dfrac{bc}{2}$ và $\dfrac{c}{1+a^2}\ge c-\dfrac{ca}{2}$

Cộng ba bất đẳng thức: $\dfrac{a}{1+b^2}+\dfrac{b}{1+c^2}+\dfrac{c}{1+a^2}\ge(a+b+c)-\dfrac{ab+bc+ca}{2}=3-\dfrac{ab+bc+ca}{2}$ (1)

Cộng ba bất đẳng thức Cô-si $a^2+b^2\ge2ab$, $b^2+c^2\ge2bc$, $c^2+a^2\ge2ca$ ta được $a^2+b^2+c^2\ge ab+bc+ca$, suy ra $(a+b+c)^2\ge3(ab+bc+ca)$, tức $ab+bc+ca\le3$ (2)

Từ (1) và (2): $\dfrac{a}{1+b^2}+\dfrac{b}{1+c^2}+\dfrac{c}{1+a^2}\ge3-\dfrac{3}{2}=\dfrac{3}{2}$.

Dấu "=" xảy ra khi $b=c=a=1$ (thỏa $a+b+c=3$). Vậy bất đẳng thức được chứng minh.

=== C4B.8@p121
- bai: 8 · y: - · trang: 121 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 140
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si ba số · tách 1/x theo điểm rơi (dự đoán dấu "=") · Cô-si hai số x+1/(4x)≥1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề in "$P=x+y+x+\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}$"; sửa thành $x+y+z$ theo lời giải của sách. Lời giải sách in "$\dfrac{1}{x-1}>0$" (đúng phải là $\dfrac{1}{x}-1>0$) và "$P=x+y+x+\dots$"; bản GIAI theo bản đúng.
## DE
(Toán học tuổi thơ số 140) Cho $x,y,z$ là $3$ số thực thuộc khoảng $(0;1)$ và thỏa mãn $xyz=(1-x)(1-y)(1-z)$. Chứng minh rằng: $P=x+y+z+\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge\dfrac{15}{2}$.
## SACH
Hướng dẫn giải:

Từ giả thiết ta có:

$xyz=(1-x)(1-y)(1-z)\Rightarrow\left(\dfrac{1}{x}-1\right)\left(\dfrac{1}{y}-1\right)\left(\dfrac{1}{z}-1\right)=1$.

Mà $x,y,z$ là $3$ số thực thuộc khoảng $(0;1)\Rightarrow\dfrac{1}{x-1}>0$; $\dfrac{1}{y-1}>0$; $\dfrac{1}{z-1}>0$.

Áp dụng BĐT $abc\le\left(\dfrac{a+b+c}{3}\right)^3$ với $a,b,c$ dương ta có:

$1=\left(\dfrac{1}{x}-1\right)\left(\dfrac{1}{y}-1\right)\left(\dfrac{1}{z}-1\right)\le\left(\dfrac{\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}-3}{3}\right)^3\Rightarrow\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$ (*)

Lúc đó:

$P=x+y+x+\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}=\left(x+\dfrac{1}{4x}\right)+\left(y+\dfrac{1}{4y}\right)+\left(z+\dfrac{1}{4z}\right)+\dfrac{3}{4}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)\ge\dfrac{15}{2}$.

Vì $x+\dfrac{1}{4x}\ge1$; $y+\dfrac{1}{4y}\ge1$; $z+\dfrac{1}{4z}\ge1$; $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$.

Dấu bằng xảy ra khi và chỉ khi $x=y=z=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện giống bài trước nên cho $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$ nhờ Cô-si ba số; trong $P$ có cả $x$ lẫn $\dfrac{1}{x}$ ⇒ tách $\dfrac{1}{x}=\dfrac{1}{4x}+\dfrac{3}{4x}$ để ghép $x+\dfrac{1}{4x}$, hệ số $\dfrac{1}{4}$ chọn sao cho dấu "=" của Cô-si hai số rơi đúng vào $x=\dfrac{1}{2}$.

**Bước 1.** Chia điều kiện cho $xyz$ thành $\left(\dfrac{1}{x}-1\right)\left(\dfrac{1}{y}-1\right)\left(\dfrac{1}{z}-1\right)=1$ với ba thừa số dương, rồi dùng Cô-si ba số để chặn dưới tổng các nghịch đảo.

**Bước 2.** Dự đoán dấu "=" tại $x=y=z=\dfrac{1}{2}$ (nghiệm đối xứng của điều kiện), từ đó tách $\dfrac{1}{x}=\dfrac{1}{4x}+\dfrac{3}{4x}$ để cặp $x$ và $\dfrac{1}{4x}$ có tích bằng hằng số và bằng nhau tại $x=\dfrac{1}{2}$.

**Bước 3.** Dùng Cô-si hai số cho ba cặp $x+\dfrac{1}{4x}$ và dùng cận $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$ cho phần còn lại, rồi cộng.

**Phần 2. Trình bày**

Vì $x,y,z\in(0;1)$ nên $u=\dfrac{1}{x}-1$, $v=\dfrac{1}{y}-1$, $w=\dfrac{1}{z}-1$ đều dương, và chia giả thiết cho $xyz$ được $uvw=1$.

Theo Cô-si ba số, $1=uvw\le\left(\dfrac{u+v+w}{3}\right)^3$, nên $u+v+w\ge3$, tức $\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\ge6$ (1)

Ta có $P=\left(x+\dfrac{1}{4x}\right)+\left(y+\dfrac{1}{4y}\right)+\left(z+\dfrac{1}{4z}\right)+\dfrac{3}{4}\left(\dfrac{1}{x}+\dfrac{1}{y}+\dfrac{1}{z}\right)$

Theo Cô-si hai số (với $x>0$): $x+\dfrac{1}{4x}\ge2\sqrt{x\cdot\dfrac{1}{4x}}=1$; tương tự cho $y,z$

Kết hợp (1): $P\ge3\cdot1+\dfrac{3}{4}\cdot6=\dfrac{15}{2}$.

Dấu "=" xảy ra khi $x=\dfrac{1}{4x}$, $y=\dfrac{1}{4y}$, $z=\dfrac{1}{4z}$ và $u=v=w$, tức $x=y=z=\dfrac{1}{2}$ (thỏa giả thiết vì $\dfrac{1}{8}=\dfrac{1}{8}$). Vậy $P\ge\dfrac{15}{2}$.

=== C4B.9@p122
- bai: 9 · y: - · trang: 122 · tang: nang_cao
- nguon_de: Toán học tuổi thơ 142
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số t+1/(4t)≥1 · thay 1=a+b+c để xuất hiện cặp nghịch đảo
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán học tuổi thơ 142) Cho $a,b,c$ là $3$ số thực dương và có tổng bằng $1$. Chứng minh rằng: $\dfrac{ab}{a^2+b^2}+\dfrac{bc}{c^2+b^2}+\dfrac{ac}{a^2+c^2}+\dfrac{1}{4}\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge\dfrac{15}{4}$.
## SACH
Hướng dẫn giải:

Vì $a+b+c=1$ nên:

$\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=3+\left(\dfrac{a^2+b^2}{ab}\right)+\left(\dfrac{b^2+c^2}{bc}\right)+\left(\dfrac{c^2+a^2}{ac}\right)$.

Bất đẳng thức cần chứng minh tương đương với:

$\left(\dfrac{ab}{a^2+b^2}+\dfrac{a^2+b^2}{4ab}\right)+\left(\dfrac{bc}{c^2+b^2}+\dfrac{c^2+b^2}{4bc}\right)+\left(\dfrac{ac}{a^2+c^2}+\dfrac{a^2+c^2}{4ac}\right)\ge3$ (1)

Ta có: $\dfrac{ab}{a^2+b^2}+\dfrac{a^2+b^2}{4ab}\ge1$; $\dfrac{bc}{c^2+b^2}+\dfrac{c^2+b^2}{4bc}\ge1$; $\dfrac{ac}{a^2+c^2}+\dfrac{a^2+c^2}{4ac}\ge1$ nên:

$\left(\dfrac{ab}{a^2+b^2}+\dfrac{a^2+b^2}{4ab}\right)+\left(\dfrac{bc}{c^2+b^2}+\dfrac{c^2+b^2}{4bc}\right)+\left(\dfrac{ac}{a^2+c^2}+\dfrac{a^2+c^2}{4ac}\right)\ge3$.

Vậy $\dfrac{ab}{a^2+b^2}+\dfrac{bc}{c^2+b^2}+\dfrac{ac}{a^2+c^2}+\dfrac{1}{4}\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)\ge\dfrac{15}{4}$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $\dfrac{1}{4}\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)$ đi cùng điều kiện $a+b+c=1$ cho phép viết $\dfrac{1}{a}=\dfrac{a+b+c}{a}$ để xuất hiện các cặp $\dfrac{a^2+b^2}{ab}$; khi đó mỗi $\dfrac{ab}{a^2+b^2}$ đi với $\dfrac{a^2+b^2}{4ab}$ có tích bằng $\dfrac{1}{4}$, đúng mẫu của Cô-si hai số.

**Bước 1.** Thay $1=a+b+c$ ở tử của $\dfrac{1}{a}$, $\dfrac{1}{b}$, $\dfrac{1}{c}$ rồi nhóm lại để tổng ba nghịch đảo bằng $3$ cộng ba tổng dạng $\dfrac{a}{b}+\dfrac{b}{a}$.

**Bước 2.** Nhân $\dfrac{1}{4}$ vào rồi chuyển $\dfrac{3}{4}$ sang vế phải để bất đẳng thức trở thành tổng của ba cặp $\dfrac{ab}{a^2+b^2}+\dfrac{a^2+b^2}{4ab}$ không nhỏ hơn $3$.

**Bước 3.** Với mỗi cặp, đặt $t$ là số hạng thứ nhất (dương) rồi dùng Cô-si hai số $t+\dfrac{1}{4t}\ge1$, sau đó cộng ba bất đẳng thức.

**Phần 2. Trình bày**

Vì $a+b+c=1$ và $a,b,c>0$ nên

$\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=\dfrac{a+b+c}{a}+\dfrac{a+b+c}{b}+\dfrac{a+b+c}{c}=3+\left(\dfrac{a}{b}+\dfrac{b}{a}\right)+\left(\dfrac{b}{c}+\dfrac{c}{b}\right)+\left(\dfrac{c}{a}+\dfrac{a}{c}\right)$

$=3+\dfrac{a^2+b^2}{ab}+\dfrac{b^2+c^2}{bc}+\dfrac{c^2+a^2}{ca}$

Do đó vế trái $=\dfrac{3}{4}+\left(\dfrac{ab}{a^2+b^2}+\dfrac{a^2+b^2}{4ab}\right)+\left(\dfrac{bc}{b^2+c^2}+\dfrac{b^2+c^2}{4bc}\right)+\left(\dfrac{ca}{c^2+a^2}+\dfrac{c^2+a^2}{4ca}\right)$

Với $t>0$, theo Cô-si hai số: $t+\dfrac{1}{4t}\ge2\sqrt{t\cdot\dfrac{1}{4t}}=1$. Áp dụng với $t=\dfrac{ab}{a^2+b^2}$ (khi đó $\dfrac{1}{4t}=\dfrac{a^2+b^2}{4ab}$), mỗi ngoặc ở trên đều $\ge1$

$\Rightarrow$ Vế trái $\ge\dfrac{3}{4}+3=\dfrac{15}{4}$.

Dấu "=" xảy ra khi mỗi $t=\dfrac{1}{2}$, tức $a=b$, $b=c$, $c=a$; kết hợp $a+b+c=1$ được $a=b=c=\dfrac{1}{3}$. Vậy bất đẳng thức được chứng minh.

=== C4B.10@p122
- bai: 10 · y: - · trang: 122 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 132
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhân với ab+bc+ca để tách c+ab/(a+b) · hệ quả của Cô-si (x+y)^2≥4xy dạng xy/(x+y)≤(x+y)/4
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Toán học tuổi thơ số 132) Cho $a,b,c$ là $3$ số thực dương thỏa mãn $a+b+c=\dfrac{2}{a+b}+\dfrac{2}{b+c}+\dfrac{2}{c+a}$. Chứng minh rằng: $672(ab+bc+ca)\le2016$.
## SACH
Hướng dẫn giải:

Ta có: $\dfrac{a+b+c}{2}=\dfrac{1}{a+b}+\dfrac{1}{b+c}+\dfrac{1}{c+a}$

$\Rightarrow\left(\dfrac{a+b+c}{2}\right)(ab+bc+ca)=a+b+c+\dfrac{ab}{a+b}+\dfrac{bc}{c+b}+\dfrac{ac}{a+c}$

Áp dụng BĐT $(x+y)^2\ge4xy\Rightarrow\dfrac{xy}{x+y}\le\dfrac{x+y}{4}$ với $x,y$ dương. Ta có:

$a+b+c+\dfrac{ab}{a+b}+\dfrac{bc}{c+b}+\dfrac{ac}{a+c}\le a+b+c+\dfrac{a+b}{4}+\dfrac{b+c}{4}+\dfrac{a+c}{4}=\dfrac{3}{2}(a+b+c)$.

Nên $(ab+bc+ca)\le3\Rightarrow672(ab+bc+ca)\le2016$.

Dấu bằng xảy ra khi và chỉ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện chứa các phân thức $\dfrac{2}{a+b}$ ⇒ nhân với $ab+bc+ca$ thì mỗi số hạng thành $\dfrac{ab+bc+ca}{a+b}=c+\dfrac{ab}{a+b}$, và $\dfrac{ab}{a+b}$ chặn trên được nhờ hệ quả Cô-si $\dfrac{xy}{x+y}\le\dfrac{x+y}{4}$; đề chỉ cần $ab+bc+ca\le3$ vì $672\cdot3=2016$.

**Bước 1.** Chia hai vế điều kiện cho $2$ rồi nhân với $ab+bc+ca$ để vế phải là tổng ba phân thức có tử $ab+bc+ca$.

**Bước 2.** Tách mỗi phân thức $\dfrac{ab+bc+ca}{a+b}=\dfrac{ab}{a+b}+c$ để vế phải thành $a+b+c$ cộng với ba phân thức dạng $\dfrac{xy}{x+y}$.

**Bước 3.** Dùng $(x+y)^2\ge4xy$ để chặn mỗi $\dfrac{xy}{x+y}$ bằng $\dfrac{x+y}{4}$, nên vế phải không vượt quá một bội của $a+b+c$.

**Bước 4.** Chia hai vế cho số dương $\dfrac{a+b+c}{2}$ để có cận trên của $ab+bc+ca$, rồi nhân $672$.

**Phần 2. Trình bày**

Từ giả thiết: $\dfrac{a+b+c}{2}=\dfrac{1}{a+b}+\dfrac{1}{b+c}+\dfrac{1}{c+a}$. Nhân hai vế với $ab+bc+ca$ và để ý $ab+bc+ca=ab+c(a+b)$ (tương tự cho hai tổng còn lại):

$\dfrac{a+b+c}{2}(ab+bc+ca)=\left(c+\dfrac{ab}{a+b}\right)+\left(a+\dfrac{bc}{b+c}\right)+\left(b+\dfrac{ca}{c+a}\right)=a+b+c+\dfrac{ab}{a+b}+\dfrac{bc}{b+c}+\dfrac{ca}{c+a}$

Với $x,y>0$, hệ quả Cô-si $(x+y)^2\ge4xy$ cho $\dfrac{xy}{x+y}\le\dfrac{x+y}{4}$. Do đó

$\dfrac{a+b+c}{2}(ab+bc+ca)\le a+b+c+\dfrac{a+b}{4}+\dfrac{b+c}{4}+\dfrac{c+a}{4}=\dfrac{3}{2}(a+b+c)$

Chia hai vế cho $\dfrac{a+b+c}{2}>0$: $ab+bc+ca\le3$

$\Rightarrow672(ab+bc+ca)\le672\cdot3=2016$.

Dấu "=" xảy ra khi $a+b=b+c=c+a$ tức $a=b=c$, thay vào giả thiết $3a=\dfrac{3}{a}$ được $a=1$. Vậy $672(ab+bc+ca)\le2016$, dấu "=" khi $a=b=c=1$.

