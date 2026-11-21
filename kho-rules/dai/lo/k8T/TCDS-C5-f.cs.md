=== C5B.11@p176
- bai: 11 · y: - · trang: 176 · tang: nang_cao
- nguon_de: Đề thi chọn HSG tỉnh Phú Yên 2015 – 2016
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki dạng Engel · (a+b+c)² ≥ 3(ab+bc+ca) · dự đoán điểm rơi
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTLN=1$ khi $a=b=c=\dfrac{1}{3}$
- ghi_chu_nghi: Máy vét lưới mịn trên a+b+c=1 cho max P = 1 tại a=b=c=1/3, khớp sách.
## DE
(Đề thi chọn HSG tỉnh Phú Yên 2015 – 2016) Cho ba số thực dương $a,b,c$ thỏa mãn $a+b+c=1$. Tìm giá trị lớn nhất của biểu thức: $P=\dfrac{a}{9a^3+3b^2+c}+\dfrac{b}{9b^3+3c^2+a}+\dfrac{c}{9c^3+3a^2+b}$.
## SACH
Vậy $P_{\max}=1\Leftrightarrow a=b=c=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần chặn mỗi phân thức từ trên, tức chặn mẫu $9a^3+3b^2+c$ từ dưới; mẫu là tổng ba số hạng nên dùng bất đẳng thức Bu-nhi-a-cốp-xki dạng Engel, chọn các mẫu số sao cho dấu "=" xảy ra khi $a=b=c=\dfrac{1}{3}$ (điểm rơi theo đối xứng).

**Bước 1.** Viết mẫu thành tổng ba phân thức dạng $\dfrac{p^2}{m}$: $9a^3=\dfrac{(3a)^2}{1/a}$, $3b^2=\dfrac{(3b)^2}{3}$, $c=\dfrac{(3c)^2}{9c}$, chọn sao cho tử cộng lại thành $3(a+b+c)=3$ — một số không đổi nhờ điều kiện đề bài.

**Bước 2.** Áp dụng Bu-nhi-a-cốp-xki dạng Engel để được $9a^3+3b^2+c\ge\dfrac{9}{\dfrac{1}{a}+3+9c}$, rồi nhân hai vế với $a>0$ để chặn $\dfrac{a}{9a^3+3b^2+c}$ bằng một đa thức đơn giản.

**Bước 3.** Viết hai đánh giá còn lại bằng cách hoán vị vòng $a\to b\to c\to a$, rồi cộng ba đánh giá lại để chỉ còn $ab+bc+ca$.

**Bước 4.** Dùng $(a+b+c)^2\ge3(ab+bc+ca)$ để chặn $ab+bc+ca$ và kiểm tra dấu "=" tại $a=b=c=\dfrac{1}{3}$ cho cả hai bất đẳng thức đã dùng.

**Chú ý:** Bất đẳng thức Engel $\dfrac{p_1^2}{m_1}+\dfrac{p_2^2}{m_2}+\dfrac{p_3^2}{m_3}\ge\dfrac{(p_1+p_2+p_3)^2}{m_1+m_2+m_3}$ chỉ dùng được khi mọi $m_i>0$; chọn $m_i$ sai thì không có dấu "=" tại điểm rơi.

**Phần 2. Trình bày**

Vì $a,b,c>0$, áp dụng bất đẳng thức Bu-nhi-a-cốp-xki dạng Engel (các mẫu $\dfrac{1}{a},\,3,\,9c$ đều dương):

$9a^3+3b^2+c=\dfrac{(3a)^2}{\dfrac{1}{a}}+\dfrac{(3b)^2}{3}+\dfrac{(3c)^2}{9c}\ge\dfrac{(3a+3b+3c)^2}{\dfrac{1}{a}+3+9c}=\dfrac{9}{\dfrac{1}{a}+3+9c}$

Suy ra $\dfrac{a}{9a^3+3b^2+c}\le\dfrac{a\left(\dfrac{1}{a}+3+9c\right)}{9}=\dfrac{1+3a+9ac}{9}$

Tương tự: $\dfrac{b}{9b^3+3c^2+a}\le\dfrac{1+3b+9ab}{9}$ và $\dfrac{c}{9c^3+3a^2+b}\le\dfrac{1+3c+9bc}{9}$

Cộng ba bất đẳng thức: $P\le\dfrac{3+3(a+b+c)+9(ab+bc+ca)}{9}=\dfrac{6+9(ab+bc+ca)}{9}$

Vì $(a+b+c)^2\ge3(ab+bc+ca)$ nên $ab+bc+ca\le\dfrac{1}{3}$. Do đó $P\le\dfrac{6+3}{9}=1$.

Dấu "=" xảy ra khi $a=b=c=\dfrac{1}{3}$ (khi đó $3a^2=b=\dfrac{1}{3}$, các bất đẳng thức Engel đều thành đẳng thức, và $P=3\cdot\dfrac{1/3}{1}=1$).

Vậy $GTLN$ của $P$ bằng $1$, đạt khi $a=b=c=\dfrac{1}{3}$.

=== C5B.12@p176
- bai: 12 · y: - · trang: 176 · tang: nang_cao
- nguon_de: Đề thi chọn HSG Gia Lai 2015 – 2016
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Cô-si hai số (dạng 2xy ≤ kx²+y²/k) · (c+d)² ≥ 4cd · dự đoán điểm rơi
- kiem: khong
- ket_qua_sach: 8
- dap_an: $GTLN=8$ khi $a=\dfrac{1}{2},\ b=1,\ c=d=2$ (hoặc $a=-\dfrac{1}{2},\ b=-1,\ c=d=2$)
- ghi_chu_nghi: Máy vét lưới (góc × c) cho max P = 8 tại a=1/2, b=1, c=d=2, khớp sách. Sách chỉ ghi giá trị, không ghi điểm đạt; điểm đạt do tự giải.
## DE
(Đề thi chọn HSG Gia Lai 2015 – 2016) Cho các số thực $a,b,c,d$ thỏa mãn $4a^2+b^2=2$ và $c+d=4$. Tìm giá trị lớn nhất của biểu thức $P=2ac+bd+cd$.
## SACH
Vậy giá trị lớn nhất của $P$ bằng $8$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho hai ràng buộc rời nhau ($4a^2+b^2=2$ và $c+d=4$) còn $P$ có các tích chéo $ac,\ bd$; muốn dùng ràng buộc thứ nhất phải tách $ac,\ bd$ thành bình phương của $a,b$ cộng bình phương của $c,d$ bằng Cô-si có hệ số, rồi để ràng buộc $c+d=4$ lo phần còn lại.

**Bước 1.** Dự đoán điểm rơi: $P$ đối xứng giữa cặp $(2a,b)$ và cặp $(c,d)$ nên thử $c=d=2$ và $2a=b$, từ đó $2a=b=1$ và $\dfrac{c}{2}=2a$, $\dfrac{d}{2}=b$ — đây là dữ kiện để chọn hệ số của Cô-si.

**Bước 2.** Chặn $2ac$ bằng $4a^2+\dfrac{c^2}{4}$ và $bd$ bằng $b^2+\dfrac{d^2}{4}$ nhờ bình phương $\left(2a-\dfrac{c}{2}\right)^2\ge0$ và $\left(b-\dfrac{d}{2}\right)^2\ge0$, rồi cộng lại để dùng $4a^2+b^2=2$.

**Bước 3.** Gộp $\dfrac{c^2+d^2}{4}+cd$ thành $\dfrac{(c+d)^2}{4}+\dfrac{cd}{2}$ để dùng được $c+d=4$.

**Bước 4.** Chặn $cd$ bằng $\dfrac{(c+d)^2}{4}$ rồi kết luận và đối chiếu các điều kiện dấu "=".

**Phần 2. Trình bày**

Ta có $\left(2a-\dfrac{c}{2}\right)^2\ge0\Rightarrow 2ac\le4a^2+\dfrac{c^2}{4}$ và $\left(b-\dfrac{d}{2}\right)^2\ge0\Rightarrow bd\le b^2+\dfrac{d^2}{4}$.

Cộng hai bất đẳng thức và dùng $4a^2+b^2=2$: $2ac+bd\le2+\dfrac{c^2+d^2}{4}$

Do đó $P\le2+\dfrac{c^2+d^2}{4}+cd=2+\dfrac{(c+d)^2}{4}+\dfrac{cd}{2}=2+4+\dfrac{cd}{2}$ (vì $c+d=4$)

Mà $cd\le\dfrac{(c+d)^2}{4}=4$ nên $P\le6+2=8$.

Dấu "=" xảy ra khi $2a=\dfrac{c}{2},\ b=\dfrac{d}{2},\ c=d$ cùng với $c+d=4$, tức $c=d=2$, $a=\dfrac{1}{2}$, $b=1$ (thỏa $4a^2+b^2=1+1=2$). Khi đó $P=2\cdot\dfrac{1}{2}\cdot2+1\cdot2+2\cdot2=8$.

Vậy $GTLN$ của $P$ bằng $8$.

=== C5B.13@p176
- bai: 13 · y: - · trang: 176 · tang: nang_cao
- nguon_de: Đề thi chọn HSG tỉnh Hoà Bình 2015 – 2016
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đặt x=p³ (căn bậc ba) · p³+q³ ≥ pq(p+q) · xyz=1 ⇒ pqr=1
- kiem: khong
- ket_qua_sach: 2017
- dap_an: $GTLN=2017$ khi $x=y=z=1$
- ghi_chu_nghi: Máy vét lưới log (x,y; z=1/(xy)) cho max P = 2017 tại x=y=z=1, khớp sách.
## DE
(Đề thi chọn HSG tỉnh Hoà Bình 2015 – 2016) Cho $x>0$, $y>0$, $z>0$ và $xyz=1$. Tìm giá trị lớn nhất: $P=\dfrac{2017}{x+y+1}+\dfrac{2017}{y+z+1}+\dfrac{2017}{z+x+1}$.
## SACH
Vậy giá trị lớn nhất của $P$ bằng $2017$ khi $x=y=z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $xyz=1$ cho phép đưa $x,y,z$ về lập phương của ba số dương có tích bằng $1$; khi đó $x+y=p^3+q^3$ chặn được bằng $pq(p+q)$, và số $1$ ở mẫu đổi thành $pqr$ để mẫu có nhân tử chung $p+q+r$.

**Bước 1.** Đặt $x=p^3,\ y=q^3,\ z=r^3$ với $p,q,r>0$, khi đó $xyz=1$ cho $pqr=1$ (điểm rơi đối xứng là $p=q=r=1$).

**Bước 2.** Chứng minh $p^3+q^3\ge pq(p+q)$ bằng cách biến đổi tương đương về $(p+q)(p-q)^2\ge0$.

**Bước 3.** Thay vào mẫu: $x+y+1\ge pq(p+q)+pqr=pq(p+q+r)$, rồi dùng $\dfrac{1}{pq}=r$ để mỗi phân thức có tử bằng một chữ và mẫu chung $p+q+r$.

**Bước 4.** Cộng ba phân thức để tử cộng thành đúng mẫu, từ đó $P$ bị chặn trên bởi một hằng số.

**Phần 2. Trình bày**

Đặt $x=p^3,\ y=q^3,\ z=r^3$ với $p,q,r>0$. Từ $xyz=1$ suy ra $pqr=1$.

Ta có $p^3+q^3-pq(p+q)=(p+q)(p-q)^2\ge0$ nên $p^3+q^3\ge pq(p+q)$.

Do đó $x+y+1\ge pq(p+q)+pqr=pq(p+q+r)$

$\Rightarrow\dfrac{1}{x+y+1}\le\dfrac{1}{pq(p+q+r)}=\dfrac{r}{p+q+r}$ (vì $pqr=1$)

Tương tự: $\dfrac{1}{y+z+1}\le\dfrac{p}{p+q+r}$ và $\dfrac{1}{z+x+1}\le\dfrac{q}{p+q+r}$

Cộng ba bất đẳng thức: $\dfrac{1}{x+y+1}+\dfrac{1}{y+z+1}+\dfrac{1}{z+x+1}\le\dfrac{p+q+r}{p+q+r}=1$

Suy ra $P\le2017$.

Dấu "=" xảy ra khi $p=q=r$, mà $pqr=1$ nên $p=q=r=1$, tức $x=y=z=1$ (khi đó $P=3\cdot\dfrac{2017}{3}=2017$).

Vậy $GTLN$ của $P$ bằng $2017$ khi $x=y=z=1$.

=== C5B.14@p176
- bai: 14 · y: - · trang: 176 · tang: nang_cao
- nguon_de: Đề thi chuyên Lào Cai 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đánh giá tiếp tuyến theo 1/(a+1) · biến đổi tương đương 8a³-8a²+2a=2a(2a-1)²
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTNN=1$ khi $a=b=c=\dfrac{1}{2}$
- ghi_chu_nghi: Đề hỏi giá trị NHỎ nhất nhưng dòng đáp số của sách ghi "giá trị lớn nhất của P bằng 1" — nhầm chữ (máy vét lưới: min P = 1 tại a=b=c=1/2; sup P xấp xỉ 2 không đạt). Giá trị 1 và điểm đạt khớp sách.
## DE
(Đề thi chuyên Lào Cai 2016 – 2017) Cho $a,b,c$ là các số dương thỏa mãn: $\dfrac{1}{a+1}+\dfrac{1}{b+1}+\dfrac{1}{c+1}=2$. Tìm giá trị nhỏ nhất của $P=\dfrac{1}{8a^2+1}+\dfrac{1}{8b^2+1}+\dfrac{1}{8c^2+1}$.
## SACH
Vậy giá trị lớn nhất của $P$ bằng $1$ khi và chỉ khi $a=b=c=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện chỉ chứa $\dfrac{1}{a+1}$ còn $P$ chứa $\dfrac{1}{8a^2+1}$ nên cần một đánh giá "từng biến" dạng $\dfrac{1}{8a^2+1}\ge\dfrac{k}{a+1}+m$ để cộng lại được; hệ số $k,m$ tìm từ điểm rơi $a=b=c=\dfrac{1}{2}$ (đối xứng, và thỏa điều kiện vì $3\cdot\dfrac{2}{3}=2$).

**Bước 1.** Tại $a=\dfrac{1}{2}$ ta có $\dfrac{1}{8a^2+1}=\dfrac{1}{3}$ và $\dfrac{1}{a+1}=\dfrac{2}{3}$; so độ dốc hai hàm tại điểm này để tìm hệ số, ra dự đoán $\dfrac{1}{8a^2+1}\ge\dfrac{2}{a+1}-1$.

**Bước 2.** Chứng minh dự đoán bằng cách quy đồng và đưa hiệu hai vế về một biểu thức không âm với mọi $a>0$.

**Bước 3.** Viết đánh giá cho cả ba biến, cộng lại rồi thay điều kiện $\sum\dfrac{1}{a+1}=2$ để ra hằng số.

**Chú ý:** Đánh giá này đúng cho mọi $a>0$ (kể cả $a>1$ khi vế phải âm), nên không phải chia trường hợp.

**Phần 2. Trình bày**

Với $a>0$:

$\dfrac{1}{8a^2+1}-\dfrac{1-a}{1+a}=\dfrac{(1+a)-(1-a)(8a^2+1)}{(8a^2+1)(1+a)}=\dfrac{8a^3-8a^2+2a}{(8a^2+1)(1+a)}=\dfrac{2a(2a-1)^2}{(8a^2+1)(1+a)}\ge0$

Do đó $\dfrac{1}{8a^2+1}\ge\dfrac{1-a}{1+a}=\dfrac{2}{a+1}-1$. Tương tự $\dfrac{1}{8b^2+1}\ge\dfrac{2}{b+1}-1$ và $\dfrac{1}{8c^2+1}\ge\dfrac{2}{c+1}-1$.

Cộng ba bất đẳng thức: $P\ge2\left(\dfrac{1}{a+1}+\dfrac{1}{b+1}+\dfrac{1}{c+1}\right)-3=2\cdot2-3=1$.

Dấu "=" xảy ra khi $2a(2a-1)^2=0$ và hai điều kiện tương tự, tức $a=b=c=\dfrac{1}{2}$ (các số dương); khi đó $\sum\dfrac{1}{a+1}=3\cdot\dfrac{2}{3}=2$ thỏa điều kiện và $P=3\cdot\dfrac{1}{3}=1$.

Vậy $GTNN$ của $P$ bằng $1$ khi $a=b=c=\dfrac{1}{2}$.

=== C5B.15@p176
- bai: 15 · y: - · trang: 176 · tang: nang_cao
- nguon_de: Đề thi chuyên Ninh Thuận 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: (a+b+c)²=a²+b²+c²+2(ab+bc+ca) · đưa về bình phương
- kiem: khong
- ket_qua_sach: 2002
- dap_an: $GTNN=2002$ khi $a=b=c=1$
- ghi_chu_nghi: Sách in "P = P = …" (lặp chữ P, lỗi in). Máy vét lưới cho min = 2002 tại a=b=c=1, khớp sách.
## DE
(Đề thi chuyên Ninh Thuận 2016 – 2017) Cho ba số thực $a,b,c$ thỏa mãn điều kiện $ab+bc+ca=3$. Tìm giá trị nhỏ nhất của biểu thức: $P=a^2+b^2+c^2-6(a+b+c)+2017$.
## SACH
Vậy Min P = $2002$ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho $ab+bc+ca$ còn $P$ chứa $a^2+b^2+c^2$ và $a+b+c$, đúng ba đại lượng mà bình phương $(a+b+c)^2$ nối lại với nhau, nên đặt $s=a+b+c$ để $P$ thành tam thức bậc hai theo một biến $s$.

**Bước 1.** Dùng $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$ và $ab+bc+ca=3$ để biểu diễn $a^2+b^2+c^2$ qua $s$.

**Bước 2.** Thay vào $P$ để $P$ chỉ còn biến $s$, rồi đưa về dạng bình phương một nhị thức cộng một hằng số.

**Bước 3.** Kết luận cực trị từ bình phương không âm, rồi chỉ ra bộ số thỏa $ab+bc+ca=3$ mà $s$ nhận đúng giá trị làm bình phương bằng $0$.

**Chú ý:** Không cần điều kiện $s^2\ge9$; chỉ cần chỉ ra một bộ $(a,b,c)$ thật sự đạt giá trị $s$ cần thiết.

**Phần 2. Trình bày**

Đặt $s=a+b+c$. Vì $(a+b+c)^2=a^2+b^2+c^2+2(ab+bc+ca)$ nên $a^2+b^2+c^2=s^2-6$.

$P=s^2-6-6s+2017=s^2-6s+2011=(s-3)^2+2002\ge2002$

Dấu "=" xảy ra khi $s=3$. Bộ $a=b=c=1$ thỏa $ab+bc+ca=3$ và có $s=3$ nên giá trị $2002$ đạt được.

Vậy $GTNN$ của $P$ bằng $2002$ khi $a=b=c=1$.

=== C5B.16@p177
- bai: 16 · y: - · trang: 177 · tang: nang_cao
- nguon_de: Đề thi chuyên Bình Phước 2013 – 2014
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: 4(a³+b³) ≥ (a+b)³ · (a+b)² ≥ 4ab · điều kiện a+b ≥ 1
- kiem: khong
- ket_qua_sach: \dfrac{15}{16}
- dap_an: $GTNN=\dfrac{15}{16}$ khi $a=b=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới a,b>0 với a+b≥1 cho min F = 15/16 tại a=b=1/2, khớp sách.
## DE
(Đề thi chuyên Bình Phước 2013 – 2014) Cho $a,b$ là hai số dương thỏa mãn $a+b\ge1$. Tìm giá trị nhỏ nhất của biểu thức: $F=(a^3+b^3)^2+(a^2+b^2)+\dfrac{3}{2}ab$.
## SACH
Vậy giá trị nhỏ nhất của $F$ là bằng $\dfrac{15}{16}$, đạt được khi $a=b=\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mọi hạng tử của $F$ đều tăng theo $a,b$ còn điều kiện là $a+b\ge1$, nên cần chặn từng nhóm hạng tử từ dưới bằng một biểu thức của riêng $a+b$ (hoặc của $a+b$ và $ab$) rồi dùng $a+b\ge1$; điểm rơi nghiêng về $a=b$ và $a+b=1$.

**Bước 1.** Chặn $a^3+b^3$ từ dưới bằng $\dfrac{(a+b)^3}{4}$ nhờ biến đổi tương đương, rồi dùng $a+b\ge1$ để thành hằng số.

**Bước 2.** Viết $a^2+b^2+\dfrac{3}{2}ab=(a+b)^2-\dfrac{ab}{2}$, để các hạng tử chỉ còn $(a+b)^2$ và $ab$.

**Bước 3.** Chặn $ab$ từ trên bằng $\dfrac{(a+b)^2}{4}$ để cả nhóm này bị chặn dưới bởi một bội của $(a+b)^2$, rồi dùng $a+b\ge1$.

**Bước 4.** Cộng hai cận dưới và kiểm tra các bất đẳng thức đều có dấu "=" tại $a=b=\dfrac{1}{2}$.

**Phần 2. Trình bày**

Ta có $4(a^3+b^3)-(a+b)^3=3(a+b)(a-b)^2\ge0$ nên $a^3+b^3\ge\dfrac{(a+b)^3}{4}\ge\dfrac{1}{4}$ (vì $a+b\ge1$). Suy ra $(a^3+b^3)^2\ge\dfrac{1}{16}$.

Mặt khác $a^2+b^2+\dfrac{3}{2}ab=(a+b)^2-\dfrac{ab}{2}\ge(a+b)^2-\dfrac{(a+b)^2}{8}=\dfrac{7}{8}(a+b)^2\ge\dfrac{7}{8}$ (dùng $ab\le\dfrac{(a+b)^2}{4}$ và $a+b\ge1$).

Cộng lại: $F\ge\dfrac{1}{16}+\dfrac{7}{8}=\dfrac{15}{16}$.

Dấu "=" xảy ra khi $a=b$ và $a+b=1$, tức $a=b=\dfrac{1}{2}$. Khi đó $F=\dfrac{1}{16}+\dfrac{1}{2}+\dfrac{3}{8}=\dfrac{15}{16}$.

Vậy $GTNN$ của $F$ bằng $\dfrac{15}{16}$ khi $a=b=\dfrac{1}{2}$.

=== C5B.17@p177
- bai: 17 · y: - · trang: 177 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đặt ẩn phụ u=x-1, v=y-1, w=1-z · (u+v)² ≥ 4uv · phân tích (x-1)(y-1)(z-1)
- kiem: khong
- ket_qua_sach: 4
- dap_an: $GTLN=4$ khi $(x;y;z)\in\{(2;2;0),(2;0;2),(0;2;2)\}$
- ghi_chu_nghi: Máy vét lưới (x,y; z=(4-x-y)/(1+xy)) cho max P = 4 tại một hoán vị của (2;2;0), khớp sách.
## DE
Giả sử $x,y,z$ là các số thực không âm thỏa mãn $x+y+z+xyz=4$. Tìm giá trị lớn nhất của biểu thức $P=xy+yz+zx$.
## SACH
Vậy $\max P=4$ khi và chỉ khi $(x;y;z)=(2;2;0),(2;0;2),(0;2;2)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ràng buộc $x+y+z+xyz=4$ và biểu thức $xy+yz+zx$ chính là các hệ số của khai triển $(x-1)(y-1)(z-1)=xyz-(xy+yz+zx)+(x+y+z)-1$; thế ràng buộc vào thì $P$ chỉ còn phụ thuộc tích $(x-1)(y-1)(z-1)$, và bài toán đổi thành chặn dưới tích này.

**Bước 1.** Khai triển $(x-1)(y-1)(z-1)$ rồi dùng $x+y+z+xyz=4$ để rút ra $P=3-(x-1)(y-1)(z-1)$, như vậy cần chứng minh tích ba hiệu này không nhỏ hơn một hằng số.

**Bước 2.** Xét dấu tích: nếu không âm thì $P\le3$; nếu âm thì số nhân tử âm là $1$ hoặc $3$, trong đó trường hợp cả ba nhân tử âm (cả ba số nhỏ hơn $1$) bị loại vì khi đó $x+y+z+xyz<4$.

**Bước 3.** Còn lại trường hợp đúng một nhân tử âm, chẳng hạn $z<1$ còn $x>1,\ y>1$; đặt $u=x-1,\ v=y-1,\ w=1-z$ rồi chặn $uv$ bằng $\dfrac{(u+v)^2}{4}$ nhờ điều kiện $x+y\le4$ suy ra từ $z\ge0$.

**Bước 4.** Chỉ ra bộ số thỏa ràng buộc làm mọi dấu "=" xảy ra, từ đó biết giá trị lớn nhất đạt thật.

**Chú ý:** Không được quên trường hợp tích bằng $0$ hay trường hợp cả ba số nhỏ hơn $1$; điều kiện $z\ge0$ chính là thứ cho $w\le1$ và $x+y\le4$.

**Phần 2. Trình bày**

Ta có $(x-1)(y-1)(z-1)=xyz-(xy+yz+zx)+(x+y+z)-1=(xyz+x+y+z)-P-1=3-P$ (vì $x+y+z+xyz=4$).

Vậy $P=3-T$ với $T=(x-1)(y-1)(z-1)$. Ta cần chứng minh $T\ge-1$.

Nếu $T\ge0$ thì $P\le3<4$.

Nếu $T<0$: số nhân tử âm là lẻ. Nếu cả ba nhân tử âm thì $x,y,z<1$ nên $x+y+z<3$, $xyz<1$, mâu thuẫn với $x+y+z+xyz=4$. Vậy đúng một nhân tử âm; không mất tổng quát giả sử $z<1,\ x>1,\ y>1$ (ba nhân tử đều khác $0$ vì $T<0$).

Đặt $u=x-1>0,\ v=y-1>0,\ w=1-z\in(0;1]$ (vì $z\ge0$). Từ $x+y+z(1+xy)=4$ và $z\ge0$ suy ra $x+y\le4$, tức $u+v\le2$. Do đó $uv\le\dfrac{(u+v)^2}{4}\le1$.

Suy ra $T=-uvw\ge-1$ (vì $0<uv\le1$ và $0<w\le1$).

Vậy trong mọi trường hợp $T\ge-1$, tức $P=3-T\le4$.

Dấu "=" xảy ra khi $uv=1$ và $w=1$, tức $z=0$, $u=v=1$, $x=y=2$. Kiểm tra: $2+2+0+0=4$ và $P=2\cdot2+0+0=4$. Theo vai trò bình đẳng của $x,y,z$, giá trị $4$ cũng đạt tại $(2;0;2)$ và $(0;2;2)$.

Vậy $GTLN$ của $P$ bằng $4$, đạt khi $(x;y;z)=(2;2;0),(2;0;2),(0;2;2)$.

=== C5B.18@p177
- bai: 18 · y: - · trang: 177 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: hằng đẳng thức tổng–tích hai phân thức · uv+vw+wu=1 · (u+v+w)² ≥ 3(uv+vw+wu)
- kiem: khong
- ket_qua_sach: 2017\sqrt{3}
- dap_an: $GTNN=2017\sqrt{3}$ khi $\dfrac{a-b}{a+b}=\dfrac{c-d}{c+d}=\dfrac{ad+bc}{ac-bd}=\pm\dfrac{1}{\sqrt{3}}$ (chẳng hạn $a=c=1$, $b=d=2-\sqrt{3}$)
- ghi_chu_nghi: Đề ngầm hiểu các mẫu a+b, c+d, ac-bd khác 0. Máy: điểm a=c=1, b=d=2-√3 cho P = 2017√3 ≈ 3493,5464788664; tìm ngẫu nhiên 2·10⁶ bộ số không cho giá trị nhỏ hơn (min thấy 3493,5469). Khớp sách. Sách chỉ ghi giá trị, không ghi điểm đạt.
## DE
Cho bốn số $a,b,c,d$ là các số thực bất kỳ. Tìm giá trị nhỏ nhất: $P=2017\left|\dfrac{a-b}{a+b}+\dfrac{c-d}{c+d}+\dfrac{ad+bc}{ac-bd}\right|$.
## SACH
Vậy giá trị nhỏ nhất của $P$ là $2017\sqrt{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba phân thức trong dấu giá trị tuyệt đối có dạng của công thức cộng tang: nếu $u=\dfrac{a-b}{a+b}$, $v=\dfrac{c-d}{c+d}$ thì $\dfrac{u+v}{1-uv}$ rút gọn ra đúng nghịch đảo của phân thức thứ ba; từ đó ba số $u,v,w$ thỏa một hệ thức đối xứng $uv+vw+wu=$ hằng số, và bất đẳng thức $(u+v+w)^2\ge3(uv+vw+wu)$ cho ngay cận dưới.

**Bước 1.** Đặt $u=\dfrac{a-b}{a+b}$, $v=\dfrac{c-d}{c+d}$, $w=\dfrac{ad+bc}{ac-bd}$ và tính riêng $u+v$ và $1-uv$ bằng cách quy đồng mẫu $(a+b)(c+d)$.

**Bước 2.** Nhân $w$ với $u+v$ để thấy tích này bằng $1-uv$, từ đó suy ra hệ thức cho $uv+vw+wu$.

**Bước 3.** Dùng $(u+v+w)^2\ge3(uv+vw+wu)$ để chặn $|u+v+w|$ từ dưới.

**Bước 4.** Tìm một bộ $(a,b,c,d)$ cụ thể (chọn $a=c$, $b=d$ để $u=v$) sao cho $u=v=w$, chứng tỏ cận dưới đạt được.

**Chú ý:** Phải chỉ ra bộ số thật làm $u=v=w$; nếu chỉ dừng ở bất đẳng thức thì chưa kết luận được là giá trị nhỏ nhất.

**Phần 2. Trình bày**

Với $a+b,\ c+d,\ ac-bd$ khác $0$, đặt $u=\dfrac{a-b}{a+b},\ v=\dfrac{c-d}{c+d},\ w=\dfrac{ad+bc}{ac-bd}$.

Ta có $u+v=\dfrac{(a-b)(c+d)+(c-d)(a+b)}{(a+b)(c+d)}=\dfrac{2(ac-bd)}{(a+b)(c+d)}$

và $1-uv=\dfrac{(a+b)(c+d)-(a-b)(c-d)}{(a+b)(c+d)}=\dfrac{2(ad+bc)}{(a+b)(c+d)}$

Do đó $w(u+v)=\dfrac{ad+bc}{ac-bd}\cdot\dfrac{2(ac-bd)}{(a+b)(c+d)}=\dfrac{2(ad+bc)}{(a+b)(c+d)}=1-uv$, tức $uv+vw+wu=1$.

Mà $(u+v+w)^2-3(uv+vw+wu)=\dfrac{1}{2}\left[(u-v)^2+(v-w)^2+(w-u)^2\right]\ge0$ nên $(u+v+w)^2\ge3$, suy ra $|u+v+w|\ge\sqrt{3}$ và $P\ge2017\sqrt{3}$.

Dấu "=" xảy ra khi $u=v=w=\pm\dfrac{1}{\sqrt{3}}$. Chọn $a=c=1$, $b=d=2-\sqrt{3}$: $u=v=\dfrac{\sqrt{3}-1}{3-\sqrt{3}}=\dfrac{1}{\sqrt{3}}$ và $w=\dfrac{2(2-\sqrt{3})}{1-(2-\sqrt{3})^2}=\dfrac{2(2-\sqrt{3})}{2\sqrt{3}(2-\sqrt{3})}=\dfrac{1}{\sqrt{3}}$ (các mẫu đều khác $0$). Khi đó $P=2017\sqrt{3}$.

Vậy $GTNN$ của $P$ bằng $2017\sqrt{3}$.

=== C5B.19@p177
- bai: 19 · y: - · trang: 177 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đưa về tỉ số a=x/z, b=y/z · Cô-si hai số (u+1/u) · (a+b)² ≥ 4ab · điều kiện x+y ≤ z
- kiem: khong
- ket_qua_sach: \dfrac{27}{4034}
- dap_an: $GTNN=\dfrac{27}{4034}$ khi $x=y=\dfrac{z}{2}$
- ghi_chu_nghi: Máy vét lưới (x,y,z>0, z≥x+y) cho min P = 27/4034 ≈ 0,0066931 tại x=y=z/2, khớp sách.
## DE
Cho ba số thực dương $x,y,z$ thỏa mãn $x+y\le z$. Tìm giá trị nhỏ nhất: $P=\dfrac{1}{2017}(x^2+y^2+z^2)\left(\dfrac{1}{x^2}+\dfrac{1}{y^2}+\dfrac{1}{z^2}\right)$.
## SACH
Vậy giá trị nhỏ nhất $P$ là: $\dfrac{27}{4034}$ khi $x=y=\dfrac{z}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức thuần nhất bậc $0$ nên chia mọi thứ cho $z$ để có hai tỉ số $a=\dfrac{x}{z},\ b=\dfrac{y}{z}$ thỏa $a+b\le1$; điều kiện biên $a+b=1$ cùng đối xứng $a=b$ gợi điểm rơi $a=b=\dfrac{1}{2}$.

**Bước 1.** Đặt $a=\dfrac{x}{z},\ b=\dfrac{y}{z}$ để đưa tích hai ngoặc về $(a^2+b^2+1)\left(\dfrac{1}{a^2}+\dfrac{1}{b^2}+1\right)$ với $a,b>0,\ a+b\le1$.

**Bước 2.** Khai triển tích thành $3$ cộng nhóm $\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}$ cộng nhóm $a^2+b^2+\dfrac{1}{a^2}+\dfrac{1}{b^2}$, rồi chặn nhóm thứ nhất bằng Cô-si hai số.

**Bước 3.** Chặn nhóm thứ hai nhờ $a^2+b^2\ge\dfrac{s^2}{2}$ và $\dfrac{1}{a^2}+\dfrac{1}{b^2}\ge\dfrac{8}{s^2}$ với $s=a+b$, rồi khảo sát hàm một biến $\dfrac{s^2}{2}+\dfrac{8}{s^2}$ trên $(0;1]$ bằng biến đổi tương đương.

**Bước 4.** Cộng các cận dưới, chia cho $2017$ và đối chiếu dấu "=" tại $a=b=\dfrac{1}{2}$.

**Phần 2. Trình bày**

Đặt $a=\dfrac{x}{z},\ b=\dfrac{y}{z}$ ($a,b>0$, $s=a+b\le1$). Khi đó

$P=\dfrac{1}{2017}(a^2+b^2+1)\left(\dfrac{1}{a^2}+\dfrac{1}{b^2}+1\right)=\dfrac{1}{2017}\left[3+\left(\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\right)+\left(a^2+b^2+\dfrac{1}{a^2}+\dfrac{1}{b^2}\right)\right]$

Theo Cô-si hai số, $\dfrac{a^2}{b^2}+\dfrac{b^2}{a^2}\ge2$.

Lại có $a^2+b^2\ge\dfrac{s^2}{2}$ và $\dfrac{1}{a^2}+\dfrac{1}{b^2}\ge\dfrac{2}{ab}\ge\dfrac{8}{s^2}$ (vì $ab\le\dfrac{s^2}{4}$). Do đó $a^2+b^2+\dfrac{1}{a^2}+\dfrac{1}{b^2}\ge\dfrac{s^2}{2}+\dfrac{8}{s^2}$.

Mà $\dfrac{s^2}{2}+\dfrac{8}{s^2}-\dfrac{17}{2}=\dfrac{s^4-17s^2+16}{2s^2}=\dfrac{(s^2-1)(s^2-16)}{2s^2}\ge0$ vì $0<s^2\le1$. Vậy nhóm này $\ge\dfrac{17}{2}$.

Cộng lại: $P\ge\dfrac{1}{2017}\left(3+2+\dfrac{17}{2}\right)=\dfrac{1}{2017}\cdot\dfrac{27}{2}=\dfrac{27}{4034}$.

Dấu "=" xảy ra khi $a=b$ và $s=1$, tức $a=b=\dfrac{1}{2}$, hay $x=y=\dfrac{z}{2}$. Khi đó $(a^2+b^2+1)\left(\dfrac{1}{a^2}+\dfrac{1}{b^2}+1\right)=\dfrac{3}{2}\cdot9=\dfrac{27}{2}$.

Vậy $GTNN$ của $P$ bằng $\dfrac{27}{4034}$ khi $x=y=\dfrac{z}{2}$.

=== C5B.20@p177
- bai: 20 · y: - · trang: 177 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: x,y,z ∈ [0;1] ⇒ xyz ≤ xy, yz, zx · đánh giá hạng tử cùng chiều
- kiem: khong
- ket_qua_sach: \dfrac{2}{7}
- dap_an: $GTNN=0$ khi $(x;y;z)\in\{(1;0;0),(0;1;0),(0;0;1)\}$
- ghi_chu_nghi: SÁCH SAI HOẶC ĐỀ IN NHẦM. Đề in "Tìm GTNN" nhưng đáp số sách (2/7 tại x=y=z=1/3) là GIÁ TRỊ LỚN NHẤT: máy vét lưới trên x+y+z=1 cho min P = 0 tại (1;0;0) và hoán vị (vd (1/2;1/2;0) cho P=1/4<2/7), còn max P = 2/7 tại x=y=z=1/3. Đề gốc nhiều khả năng hỏi GTLN. Lời giải soạn theo ĐÚNG đề in (GTNN = 0). Đã kiểm lại dấu trừ trước 9xyz/7 trên ảnh.
## DE
Cho $x,y,z\ge0$; $x+y+z=1$. Tìm GTNN của $P=xy+yz+zx-\dfrac{9xyz}{7}$.
## SACH
Vậy giá trị nhỏ nhất $P$ là: $\dfrac{2}{7}$ khi $x=y=z=\dfrac{1}{3}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $x+y+z=1$ và $x,y,z\ge0$ suy ra mỗi số thuộc $[0;1]$, nên $xyz$ bị chặn bởi từng tích hai số $xy,\ yz,\ zx$; hạng tử trừ $\dfrac{9xyz}{7}$ do đó chỉ "ăn" được một phần của $xy+yz+zx$, đủ để chặn $P$ từ dưới.

**Bước 1.** Nhận ra mỗi biến không vượt quá $1$, từ đó viết $xyz\le xy$, $xyz\le yz$, $xyz\le zx$ rồi cộng lại để bị chặn $xyz$ bằng một phần ba tổng ba tích hai số.

**Bước 2.** Thay vào $P$ để chặn $P$ từ dưới bằng một bội dương của $xy+yz+zx$, và nhận xét tổng này luôn không âm.

**Bước 3.** Tìm bộ số thỏa ràng buộc làm cả hai bất đẳng thức thành đẳng thức: cần mọi tích hai số bằng $0$.

**Chú ý:** Thử nhanh một giá trị biên như $(1;0;0)$ hoặc $\left(\dfrac{1}{2};\dfrac{1}{2};0\right)$ cho thấy $P$ có thể nhỏ hơn giá trị tại tâm $x=y=z=\dfrac{1}{3}$; do đó $\dfrac{2}{7}$ không là GTNN mà là GTLN.

**Phần 2. Trình bày**

Vì $x,y,z\ge0$ và $x+y+z=1$ nên $0\le x,y,z\le1$. Do đó $xyz\le xy$, $xyz\le yz$, $xyz\le zx$; cộng lại: $3xyz\le xy+yz+zx$.

Suy ra $P=xy+yz+zx-\dfrac{9xyz}{7}\ge xy+yz+zx-\dfrac{3}{7}(xy+yz+zx)=\dfrac{4}{7}(xy+yz+zx)\ge0$.

Dấu "=" xảy ra khi $xy+yz+zx=0$, tức có ít nhất hai trong ba số bằng $0$; kết hợp $x+y+z=1$ ta được một số bằng $1$, hai số còn lại bằng $0$. Khi đó $P=0$.

Vậy $GTNN$ của $P$ bằng $0$, đạt khi $(x;y;z)=(1;0;0),(0;1;0),(0;0;1)$.

=== C5B.21@p177
- bai: 21 · y: - · trang: 177 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: abc=1 ⇒ ab²c=b · Cô-si hai số (b+2)(2b+1) ≤ 9(b+1)²/4 · Bu-nhi-a-cốp-xki (Σu² ≥ (Σu)²/3) · đặt a=x/y, b=y/z, c=z/x · bất đẳng thức Nesbit
- kiem: khong
- ket_qua_sach: \dfrac{1}{3}
- dap_an: $GTNN=\dfrac{1}{3}$ khi $a=b=c=1$
- ghi_chu_nghi: Máy vét lưới (a,b; c=1/(ab)) cho min P = 1/3 tại a=b=c=1, khớp sách. Sách chỉ ghi đáp số; lời giải tự soạn theo Cô-si + Nesbit.
## DE
Cho ba số thực dương $a,b,c$ thỏa mãn $abc=1$. Tìm giá trị nhỏ nhất của: $P=\dfrac{a^2b^2}{(ab^2c+2)(2ab^2c+1)}+\dfrac{b^2c^2}{(abc^2+2)(2abc^2+1)}+\dfrac{c^2a^2}{(a^2bc+2)(2a^2bc+1)}$
## SACH
Vậy giá trị nhỏ nhất $P$ là: $\dfrac{1}{3}$ khi $a=b=c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $abc=1$ thì $ab^2c=b$, $abc^2=c$, $a^2bc=a$, nên mỗi mẫu chỉ còn một chữ; mẫu dạng $(b+2)(2b+1)$ có tổng hai nhân tử $3(b+1)$ không đổi theo cách viết nên dùng Cô-si hai số, điểm rơi $b+2=2b+1\Leftrightarrow b=1$ trùng với điểm rơi đối xứng $a=b=c=1$.

**Bước 1.** Dùng $abc=1$ để thay $ab^2c=b$ (và hai biểu thức tương tự) và thay $a^2b^2=\dfrac{1}{c^2}$, nhờ đó mỗi số hạng của $P$ có dạng $\dfrac{1}{c^2(b+2)(2b+1)}$.

**Bước 2.** Chặn tích $(b+2)(2b+1)$ từ trên bằng Cô-si hai số để mỗi số hạng được chặn dưới bằng bình phương của một phân thức $\dfrac{2}{3}\cdot\dfrac{1}{c(b+1)}$.

**Bước 3.** Dùng $\sum u^2\ge\dfrac{(\sum u)^2}{3}$ cho ba phân thức $u=\dfrac{1}{c(b+1)}$ và các hoán vị vòng, rồi đặt $a=\dfrac{x}{y},\ b=\dfrac{y}{z},\ c=\dfrac{z}{x}$ để tổng $\sum u$ thành $\sum\dfrac{x}{y+z}$.

**Bước 4.** Dùng bất đẳng thức Nesbit $\sum\dfrac{x}{y+z}\ge\dfrac{3}{2}$ để có cận dưới hằng số và đối chiếu dấu "=".

**Chú ý:** Phép đặt $a=\dfrac{x}{y},\ b=\dfrac{y}{z},\ c=\dfrac{z}{x}$ hợp lệ vì $abc=1$ (lấy $x=a,\ y=1,\ z=\dfrac{1}{b}$).

**Phần 2. Trình bày**

Vì $abc=1$ nên $ab^2c=b$, $abc^2=c$, $a^2bc=a$ và $ab=\dfrac{1}{c},\ bc=\dfrac{1}{a},\ ca=\dfrac{1}{b}$. Do đó

$P=\dfrac{1}{c^2(b+2)(2b+1)}+\dfrac{1}{a^2(c+2)(2c+1)}+\dfrac{1}{b^2(a+2)(2a+1)}$

Theo Cô-si hai số, $(b+2)(2b+1)\le\left(\dfrac{3b+3}{2}\right)^2=\dfrac{9(b+1)^2}{4}$ nên $\dfrac{1}{c^2(b+2)(2b+1)}\ge\dfrac{4}{9}\cdot\dfrac{1}{c^2(b+1)^2}=\dfrac{4}{9}u_1^2$ với $u_1=\dfrac{1}{c(b+1)}=\dfrac{1}{bc+c}$.

Tương tự $\dfrac{1}{a^2(c+2)(2c+1)}\ge\dfrac{4}{9}u_2^2$ với $u_2=\dfrac{1}{ca+a}$ và $\dfrac{1}{b^2(a+2)(2a+1)}\ge\dfrac{4}{9}u_3^2$ với $u_3=\dfrac{1}{ab+b}$.

Suy ra $P\ge\dfrac{4}{9}(u_1^2+u_2^2+u_3^2)\ge\dfrac{4}{9}\cdot\dfrac{(u_1+u_2+u_3)^2}{3}$.

Đặt $a=\dfrac{x}{y},\ b=\dfrac{y}{z},\ c=\dfrac{z}{x}$ ($x,y,z>0$). Khi đó $bc+c=\dfrac{y+z}{x}$, $ca+a=\dfrac{z+x}{y}$, $ab+b=\dfrac{x+y}{z}$ nên

$u_1+u_2+u_3=\dfrac{x}{y+z}+\dfrac{y}{z+x}+\dfrac{z}{x+y}\ge\dfrac{3}{2}$ (bất đẳng thức Nesbit: theo dạng Engel, tổng $\ge\dfrac{(x+y+z)^2}{2(xy+yz+zx)}\ge\dfrac{3}{2}$ vì $(x+y+z)^2\ge3(xy+yz+zx)$).

Do đó $P\ge\dfrac{4}{9}\cdot\dfrac{(3/2)^2}{3}=\dfrac{1}{3}$.

Dấu "=" xảy ra khi $b=1,\ c=1,\ a=1$ (dấu "=" của Cô-si) — khi đó cả hai bất đẳng thức sau cũng thành đẳng thức, và $P=3\cdot\dfrac{1}{3\cdot3}=\dfrac{1}{3}$.

Vậy $GTNN$ của $P$ bằng $\dfrac{1}{3}$ khi $a=b=c=1$.

=== C5B.22@p178
- bai: 22 · y: - · trang: 178 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki (hai dạng) · Cô-si hai số x ≤ (x²+1)/2 · dự đoán điểm rơi
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTNN=1$ khi $x=1,\ y=2,\ z=1$
- ghi_chu_nghi: Máy vét lưới (x,y,z ≥0, x²+y²+z² ≤ 3y) cho min P = 1 tại (1;2;1), khớp sách.
## DE
Cho các số thực không âm $x,y,z$ thỏa mãn $x^2+y^2+z^2\le3y$. Tìm giá trị nhỏ nhất của $P=\dfrac{1}{(x+1)^2}+\dfrac{4}{(y+2)^2}+\dfrac{8}{(z+3)^2}$.
## SACH
Vậy giá trị nhỏ nhất của $P$ bằng $1$, đạt khi $x=1,y=2,z=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $P$ có dạng tổng bình phương các nghịch đảo $\dfrac{1}{x+1},\ \dfrac{2}{y+2},\ \dfrac{2}{z+3}$ còn ràng buộc là một bất đẳng thức bậc hai $x^2+y^2+z^2\le3y$; nên ta dùng Bu-nhi-a-cốp-xki để đưa $P$ về bình phương của một tổng $\sum\dfrac{k}{\cdot}$, rồi lại dùng Bu-nhi-a-cốp-xki dạng Engel để biến tổng nghịch đảo thành nghịch đảo của một tổng tuyến tính, tổng này được chặn nhờ ràng buộc.

**Bước 1.** Dự đoán điểm rơi $x=1,\ y=2,\ z=1$: đây là điểm làm cả hai vế của ràng buộc cùng bằng $6$, và ở đó ba nghịch đảo $\dfrac{1}{x+1},\ \dfrac{2}{y+2},\ \dfrac{2}{z+3}$ cùng bằng $\dfrac{1}{2}$; đó là cơ sở để chọn các hệ số của hai lần Bu-nhi-a-cốp-xki.

**Bước 2.** Đặt ba nghịch đảo $\alpha=\dfrac{1}{x+1},\ \beta=\dfrac{2}{y+2},\ \gamma=\dfrac{2}{z+3}$ để $P=\alpha^2+\beta^2+2\gamma^2$, rồi dùng Bu-nhi-a-cốp-xki $(\alpha^2+\beta^2+2\gamma^2)(1+1+2)\ge(\alpha+\beta+2\gamma)^2$ để đưa $P$ về bình phương của một tổng.

**Bước 3.** Chặn tổng $S=\dfrac{1}{x+1}+\dfrac{2}{y+2}+\dfrac{4}{z+3}$ từ dưới bằng dạng Engel, được $\dfrac{16}{x+\dfrac{y}{2}+z+5}$.

**Bước 4.** Chặn $x+\dfrac{y}{2}+z$ từ trên nhờ $x\le\dfrac{x^2+1}{2},\ z\le\dfrac{z^2+1}{2}$ và ràng buộc $x^2+z^2\le3y-y^2$, rồi kết luận và kiểm tra các dấu "=".

**Chú ý:** Ở bước dùng Engel phải chia mẫu cho hệ số để các tử là $1,1,2$; chọn tử khác đi thì không có dấu "=" tại $(1;2;1)$.

**Phần 2. Trình bày**

Đặt $\alpha=\dfrac{1}{x+1},\ \beta=\dfrac{2}{y+2},\ \gamma=\dfrac{2}{z+3}$ (đều dương). Khi đó $P=\alpha^2+\beta^2+2\gamma^2$.

Theo Bu-nhi-a-cốp-xki: $(\alpha^2+\beta^2+2\gamma^2)(1+1+2)\ge(\alpha+\beta+2\gamma)^2$, suy ra $P\ge\dfrac{S^2}{4}$ với $S=\dfrac{1}{x+1}+\dfrac{2}{y+2}+\dfrac{4}{z+3}$.

Viết $S=\dfrac{1^2}{x+1}+\dfrac{1^2}{\dfrac{y+2}{2}}+\dfrac{2^2}{z+3}$. Theo Bu-nhi-a-cốp-xki dạng Engel: $S\ge\dfrac{(1+1+2)^2}{(x+1)+\dfrac{y+2}{2}+(z+3)}=\dfrac{16}{x+\dfrac{y}{2}+z+5}$.

Mặt khác $x\le\dfrac{x^2+1}{2}$ và $z\le\dfrac{z^2+1}{2}$ nên $x+z\le\dfrac{x^2+z^2+2}{2}\le\dfrac{3y-y^2+2}{2}$ (vì $x^2+z^2\le3y-y^2$). Do đó

$x+\dfrac{y}{2}+z\le\dfrac{3y-y^2+2}{2}+\dfrac{y}{2}=\dfrac{6-(y-2)^2}{2}\le3$

Suy ra $S\ge\dfrac{16}{3+5}=2$ và $P\ge\dfrac{2^2}{4}=1$.

Dấu "=" xảy ra khi $x=z=1,\ y=2$: thỏa ràng buộc ($1+4+1=6=3\cdot2$), các bất đẳng thức Cô-si có $x=z=1$, $y=2$, và hai lần Bu-nhi-a-cốp-xki đều có $\alpha=\beta=\gamma=\dfrac{1}{2}$. Khi đó $P=\dfrac{1}{4}+\dfrac{1}{4}+\dfrac{1}{2}=1$.

Vậy $GTNN$ của $P$ bằng $1$ khi $x=1,\ y=2,\ z=1$.

=== C5B.23@p178
- bai: 23 · y: - · trang: 178 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: cộng hai phương trình để khử · số nguyên không âm (xét t chẵn) · y²+z²=20
- kiem: khong
- ket_qua_sach: 123037
- dap_an: $GTNN=123037$ khi $(x;y;z;t)=(5;2;4;0)$
- ghi_chu_nghi: Máy vét nghiệm nguyên 0≤x,y,z,t<30 của hệ: duy nhất (5;2;4;0), M = 2017·61 = 123037, khớp sách.
## DE
Cho biểu thức: $M=2017(x^2+y^2+2z^2+t^2)$, với $x;y;z;t$ là các số nguyên không âm. Tìm giá trị nhỏ nhất của $M$ và các giá trị tương ứng của $x;y;z$ và $t$, biết rằng: $\begin{cases}x^2-y^2+t^2=21\\x^2+3y^2+4z^2=101\end{cases}$
## SACH
Vậy Min M $=123037$ tại $x=5;y=2;z=4;t=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai phương trình của hệ cộng lại cho đúng $2(x^2+y^2+2z^2)+t^2$, tức gần như biểu thức trong ngoặc của $M$; nhờ đó $M$ biểu diễn được qua một mình $t$ và bài toán thành tìm $t$ nhỏ nhất làm hệ có nghiệm nguyên không âm.

**Bước 1.** Cộng hai phương trình của hệ để được $2x^2+2y^2+4z^2+t^2=122$, rồi rút $x^2+y^2+2z^2$ theo $t$ và thay vào $M$.

**Bước 2.** Từ biểu thức của $M$ theo $t$ suy ra $M$ nhỏ nhất khi $t$ nhỏ nhất, nên thử $t=0$ (số nguyên không âm nhỏ nhất).

**Bước 3.** Với $t=0$ giải hệ còn lại: thế $x^2=21+y^2$ vào phương trình thứ hai để thu $y^2+z^2=20$ và tìm nghiệm nguyên không âm.

**Bước 4.** Kiểm tra từng nghiệm nguyên của $y^2+z^2=20$ xem có cho $x^2=21+y^2$ là số chính phương không, rồi kết luận.

**Phần 2. Trình bày**

Cộng hai phương trình của hệ: $2x^2+2y^2+4z^2+t^2=122$, suy ra $x^2+y^2+2z^2=61-\dfrac{t^2}{2}$.

Do đó $M=2017\left(61-\dfrac{t^2}{2}+t^2\right)=2017\left(61+\dfrac{t^2}{2}\right)\ge2017\cdot61=123037$, dấu "=" khi $t=0$.

Với $t=0$, hệ trở thành $\begin{cases}x^2=21+y^2\\x^2+3y^2+4z^2=101\end{cases}$. Thế vào phương trình thứ hai: $4y^2+4z^2=80$, tức $y^2+z^2=20$.

Các số nguyên không âm có tổng bình phương bằng $20$ là $(y;z)=(2;4)$ và $(4;2)$.

Với $y=2$: $x^2=25$, $x=5$ (nhận). Với $y=4$: $x^2=37$ không là số chính phương (loại).

Vậy $(x;y;z;t)=(5;2;4;0)$ thỏa hệ và cho $M=2017(25+4+32+0)=123037$.

Vậy $GTNN$ của $M$ bằng $123037$, đạt khi $x=5;\ y=2;\ z=4;\ t=0$.

=== C5B.24@p178
- bai: 24 · y: - · trang: 178 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: thế y theo x · tách bình phương (hoàn thiện bình phương)
- kiem: khong
- ket_qua_sach: \dfrac{252125}{59}
- dap_an: $GTLN=\dfrac{252125}{59}$ khi $x=\dfrac{80}{59},\ y=\dfrac{95}{59}$
- ghi_chu_nghi: Máy vét x trên [-5;5] bước 10⁻⁴ cho max B ≈ 4273,3051 = 252125/59, khớp sách.
## DE
Tìm giá trị lớn nhất của biểu thức $B=2017(3xy-x^2-y^2)$. Biết $x,y$ là nghiệm của phương trình $5x+2y=10$.
## SACH
Vậy Max B $=\dfrac{252125}{59}$ khi $x=\dfrac{80}{59}$ và $y=\dfrac{10-5x}{2}=\dfrac{95}{59}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ràng buộc $5x+2y=10$ là bậc nhất nên rút được $y$ theo $x$; thế vào thì $B$ thành tam thức bậc hai theo $x$ với hệ số cao nhất âm, nên tách thành "hằng số trừ bình phương" là ra giá trị lớn nhất.

**Bước 1.** Rút $y=\dfrac{10-5x}{2}$ từ phương trình và thay vào $3xy-x^2-y^2$.

**Bước 2.** Quy đồng và rút gọn để được một tam thức bậc hai theo $x$ dạng $\dfrac{-59x^2+160x-100}{4}$.

**Bước 3.** Tách tam thức thành hằng số trừ một bình phương có hệ số dương rồi đọc giá trị lớn nhất và giá trị $x$ làm bình phương bằng $0$.

**Bước 4.** Tính $y$ từ $x$ tìm được để nêu điểm đạt.

**Phần 2. Trình bày**

Từ $5x+2y=10$ suy ra $y=\dfrac{10-5x}{2}$. Khi đó

$3xy-x^2-y^2=\dfrac{3x(10-5x)}{2}-x^2-\dfrac{(10-5x)^2}{4}=\dfrac{60x-30x^2-4x^2-100+100x-25x^2}{4}=\dfrac{-59x^2+160x-100}{4}$

$=\dfrac{125}{59}-\dfrac{59}{4}\left(x-\dfrac{80}{59}\right)^2\le\dfrac{125}{59}$

Do đó $B\le2017\cdot\dfrac{125}{59}=\dfrac{252125}{59}$.

Dấu "=" xảy ra khi $x=\dfrac{80}{59}$, khi đó $y=\dfrac{10-5\cdot\dfrac{80}{59}}{2}=\dfrac{95}{59}$.

Vậy $GTLN$ của $B$ bằng $\dfrac{252125}{59}$ khi $x=\dfrac{80}{59},\ y=\dfrac{95}{59}$.

=== C5B.25@p178
- bai: 25 · y: - · trang: 178 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: nhóm thành (x+y)²+y² · đặt s=x+y · tích (s+3)(s-1)=-y² ≤ 0
- kiem: khong
- ket_qua_sach: -6051; 2017
- dap_an: $GTNN=-6051$ khi $x=-3,\ y=0$; $GTLN=2017$ khi $x=1,\ y=0$
- ghi_chu_nghi: Máy vét lưới (x,y) trên đường cong cho Q ∈ [-6051; 2017], khớp sách.
## DE
Cho $x,y$ liên hệ với biểu thức $P=x^2+2y^2+2xy+2x+2y-3=0$. Tìm giá trị lớn nhất, nhỏ nhất của biểu thức: $Q=2017(x+y)$.
## SACH
Vậy: GTNN$(Q)=-6051\Leftrightarrow y=0$ và $x=-3$

GTLN$(Q)=2017\Leftrightarrow y=0$ và $x=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $Q$ chỉ phụ thuộc $s=x+y$, và trong điều kiện $x^2+2y^2+2xy+2x+2y-3=0$ các hạng tử $x^2+2xy+y^2$ gộp được thành $(x+y)^2$, nên điều kiện viết lại thành một hệ thức giữa $s$ và $y^2$, từ đó suy ra khoảng giá trị của $s$.

**Bước 1.** Tách $2y^2=y^2+y^2$ để nhóm $x^2+2xy+y^2=(x+y)^2$ và viết điều kiện theo $s=x+y$ và $y$.

**Bước 2.** Đưa vế trái về dạng $(s+3)(s-1)+y^2=0$ rồi dùng $y^2\ge0$ để giới hạn $s$ trong một đoạn.

**Bước 3.** Suy ra giá trị nhỏ nhất, lớn nhất của $Q$ từ hai đầu mút của đoạn và kiểm tra các đầu mút có đạt được (tức có $y$ thực tương ứng).

**Phần 2. Trình bày**

Đặt $s=x+y$. Điều kiện $x^2+2y^2+2xy+2x+2y-3=0$ viết lại thành $(x+y)^2+y^2+2(x+y)-3=0$, tức

$s^2+2s-3=-y^2$, hay $(s+3)(s-1)=-y^2\le0$.

Suy ra $-3\le s\le1$, do đó $-6051\le Q=2017s\le2017$.

$Q=-6051$ khi $s=-3$: khi đó $y^2=0$, $y=0$, $x=-3$ (thỏa điều kiện). $Q=2017$ khi $s=1$: khi đó $y=0$, $x=1$ (thỏa điều kiện).

Vậy $GTNN(Q)=-6051$ khi $x=-3,\ y=0$ và $GTLN(Q)=2017$ khi $x=1,\ y=0$.

=== C5B.26@p178
- bai: 26 · y: - · trang: 178 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Vũng Tàu 2017 – 2018
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: tính trực tiếp tại a=b=c=t (phản ví dụ về cận trên)
- kiem: khong
- ket_qua_sach: \dfrac{1}{4}
- dap_an: Đề in không có giá trị lớn nhất ($P$ không bị chặn trên)
- ghi_chu_nghi: ĐỀ IN NGHI LỖI — nên loại khỏi kho hoặc chờ CEO/người có đề gốc. Đề in: P = (a²b+b²c+c²a)/(a²+b²+c²) − 1/(3(a²+b²+c²)) (đã phóng ảnh đọc lại, chép đúng). Với a=b=c=t thì P = t − 1/(9t²) → +∞ khi t → +∞, nên không có GTLN; đáp số sách (Max = 1/4 tại a=b=c=1/2, điều kiện a+b+c=3/2) mâu thuẫn với đề: tại a=b=c=1/2 đề in cho P = 1/18, không phải 1/4. Máy: nếu số hạng thứ hai là (a²+b²+c²)/3 (hoặc (a+b+c)²/9) thì lưới cho max P = 1/4 tại a=b=c=1/2 đúng như sách ⇒ nhiều khả năng sách gõ nhầm "\dfrac{1}{3}(a²+b²+c²)" thành "\dfrac{1}{3(a²+b²+c²)}". Chưa có đề gốc để xác nhận nên không đoán đề.
## DE
(Chuyên vòng 1 Vũng Tàu 2017 – 2018) Cho $a,b,c$ là các số thực dương. Tìm giá trị lớn nhất $P=\dfrac{a^2b+b^2c+c^2a}{a^2+b^2+c^2}-\dfrac{1}{3(a^2+b^2+c^2)}$.
## SACH
Hướng dẫn giải: $\mathrm{Max}(P)=\dfrac{1}{4}\Leftrightarrow\begin{cases}a=b;\ b=c;\ c=a\\a+b+c=\dfrac{3}{2}\\a=b=c=\dfrac{1}{2}\end{cases}\Leftrightarrow a=b=c=\dfrac{1}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều đáng nghi là $P$ không thuần nhất (hạng tử thứ nhất bậc $1$, hạng tử thứ hai bậc $-2$) mà $a,b,c$ lại không bị ràng buộc gì thêm; nên trước khi tìm điểm rơi phải thử xem $P$ có bị chặn trên không bằng cách cho cả ba biến cùng tăng.

**Bước 1.** Tính $P$ tại $a=b=c=t$ để rút gọn thành biểu thức một biến $t$.

**Bước 2.** Đánh giá biểu thức đó với $t\ge1$ để thấy nó lớn tùy ý khi $t$ tăng.

**Bước 3.** Kết luận $P$ không bị chặn trên, nên đề in không có giá trị lớn nhất.

**Phần 2. Trình bày**

**Chưa chắc:** Đề in có vẻ bị lỗi (đáp số sách $\dfrac{1}{4}$ không khớp với đề in); lời giải dưới đây trả lời đúng cho đề in như đã chép.

Lấy $a=b=c=t>0$: $a^2b+b^2c+c^2a=3t^3$ và $a^2+b^2+c^2=3t^2$ nên

$P=\dfrac{3t^3}{3t^2}-\dfrac{1}{9t^2}=t-\dfrac{1}{9t^2}$

Với $t\ge1$ ta có $\dfrac{1}{9t^2}\le\dfrac{1}{9}$ nên $P\ge t-\dfrac{1}{9}$. Với mọi số $M$, chọn $t=\max\{1;\,M+1\}$ thì $P\ge M+\dfrac{8}{9}>M$.

Vậy $P$ nhận giá trị lớn tùy ý, đề in không có giá trị lớn nhất.

=== C5B.27@p179
- bai: 27 · y: - · trang: 179 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Kiên Giang 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Cô-si hai số (x/(y+t) + (y+t)/(4x) ≥ 1) · u+1/u ≥ 2 · tách hệ số theo điểm rơi
- kiem: khong
- ket_qua_sach: \dfrac{15}{2}
- dap_an: $GTNN=\dfrac{15}{2}$ khi $x=y=t$
- ghi_chu_nghi: Đề in không ghi điều kiện của x,y,t; lời giải ngầm hiểu x,y,t>0 (nếu cho âm thì D không có cận dưới). Máy vét lưới (x,y,t>0, tỉ lệ đo log) cho min D = 15/2 khi x=y=t, khớp sách.
## DE
(Chuyên vòng 1 Kiên Giang 2016 – 2017) Tìm GTNN của: $D=\dfrac{x}{y+t}+\dfrac{y+t}{x}+\dfrac{y}{t+x}+\dfrac{t+x}{y}+\dfrac{t}{x+y}+\dfrac{x+y}{t}$
## SACH
Vậy $D_{\min}=\dfrac{15}{2}\Leftrightarrow x=y=t$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi cặp $\dfrac{x}{y+t}+\dfrac{y+t}{x}$ có dạng $u+\dfrac{1}{u}$ nhưng $u=\dfrac{x}{y+t}$ chỉ bằng $1$ khi $x=y+t$, không phải khi $x=y=t$ (lúc đó $u=\dfrac{1}{2}$); nên phải tách hệ số $\dfrac{1}{4}$ sao cho Cô-si có dấu "=" ngay tại $x=y=t$, phần còn lại để cho một tổng tỉ số cổ điển.

**Bước 1.** Điểm rơi đối xứng $x=y=t$ cho $\dfrac{x}{y+t}=\dfrac{1}{2}$, nên tách $\dfrac{y+t}{x}=\dfrac{y+t}{4x}+\dfrac{3(y+t)}{4x}$ để Cô-si $\dfrac{x}{y+t}+\dfrac{y+t}{4x}\ge1$ có dấu "=" khi $2x=y+t$.

**Bước 2.** Làm tương tự với hai cặp còn lại rồi cộng để được $D\ge3+\dfrac{3}{4}\left(\dfrac{y+t}{x}+\dfrac{t+x}{y}+\dfrac{x+y}{t}\right)$.

**Bước 3.** Tách tổng trong ngoặc thành ba cặp nghịch đảo $\dfrac{p}{q}+\dfrac{q}{p}$ và chặn mỗi cặp bằng $2$.

**Bước 4.** Cộng các cận dưới rồi đối chiếu các điều kiện dấu "=" để thấy chúng đều đạt tại $x=y=t$.

**Phần 2. Trình bày**

Giả sử $x,y,t>0$. Theo Cô-si hai số: $\dfrac{x}{y+t}+\dfrac{y+t}{4x}\ge2\sqrt{\dfrac{1}{4}}=1$. Tương tự $\dfrac{y}{t+x}+\dfrac{t+x}{4y}\ge1$ và $\dfrac{t}{x+y}+\dfrac{x+y}{4t}\ge1$.

Do đó $D\ge3+\dfrac{3}{4}\left(\dfrac{y+t}{x}+\dfrac{t+x}{y}+\dfrac{x+y}{t}\right)$.

Mà $\dfrac{y+t}{x}+\dfrac{t+x}{y}+\dfrac{x+y}{t}=\left(\dfrac{x}{y}+\dfrac{y}{x}\right)+\left(\dfrac{x}{t}+\dfrac{t}{x}\right)+\left(\dfrac{y}{t}+\dfrac{t}{y}\right)\ge6$ (Cô-si hai số cho từng cặp).

Suy ra $D\ge3+\dfrac{3}{4}\cdot6=\dfrac{15}{2}$.

Dấu "=" xảy ra khi $2x=y+t,\ 2y=t+x,\ 2t=x+y$ và $x=y=t$, tức $x=y=t$. Khi đó mỗi cặp bằng $\dfrac{1}{2}+2=\dfrac{5}{2}$ nên $D=3\cdot\dfrac{5}{2}=\dfrac{15}{2}$.

Vậy $GTNN$ của $D$ bằng $\dfrac{15}{2}$ khi $x=y=t$.

=== C5B.28@p179
- bai: 28 · y: - · trang: 179 · tang: nang_cao
- nguon_de: Chuyên vòng 1 Hậu Giang 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: đặt ẩn phụ u=x/y+y/x · Cô-si hai số u ≥ 2 · biến đổi tương đương
- kiem: khong
- ket_qua_sach: 2
- dap_an: $GTNN=2$ khi $x=y$
- ghi_chu_nghi: Máy vét lưới tỉ số x/y trên (e^-6;e^6) cho min G = 2 tại x=y, khớp sách.
## DE
(Chuyên vòng 1 Hậu Giang 2016 – 2017) Cho $x,y>0$. Tìm giá trị nhỏ nhất của: $G=\dfrac{x^4}{y^4}+\dfrac{y^4}{x^4}-\dfrac{x^2}{y^2}-\dfrac{y^2}{x^2}+\dfrac{x}{y}+\dfrac{y}{x}$.
## SACH
Vậy Min$G=2\Leftrightarrow x=y>0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mọi hạng tử của $G$ là lũy thừa của $\dfrac{x}{y}$ và $\dfrac{y}{x}$ theo dạng "số hạng và nghịch đảo của nó", nên đặt $u=\dfrac{x}{y}+\dfrac{y}{x}$ thì $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}=u^2-2$ và $\dfrac{x^4}{y^4}+\dfrac{y^4}{x^4}=(u^2-2)^2-2$, và $G$ thành đa thức một biến $u$.

**Bước 1.** Đặt $u=\dfrac{x}{y}+\dfrac{y}{x}$ và dùng Cô-si hai số để biết $u\ge2$; đây là miền giá trị cần xét.

**Bước 2.** Biểu diễn $G$ theo $u$ bằng hai lần bình phương rồi rút gọn thành đa thức bậc bốn.

**Bước 3.** Tính $G$ tại $u=2$ rồi phân tích hiệu $G-G(2)$ thành tích có nhân tử $(u-2)$, sau đó xét dấu nhân tử còn lại với $u\ge2$.

**Phần 2. Trình bày**

Đặt $u=\dfrac{x}{y}+\dfrac{y}{x}$. Vì $x,y>0$ nên theo Cô-si hai số $u\ge2$.

Ta có $\dfrac{x^2}{y^2}+\dfrac{y^2}{x^2}=u^2-2$ và $\dfrac{x^4}{y^4}+\dfrac{y^4}{x^4}=(u^2-2)^2-2$. Do đó

$G=(u^2-2)^2-2-(u^2-2)+u=u^4-5u^2+u+4$

$G-2=u^4-5u^2+u+2=(u-2)(u^3+2u^2-u-1)$

Với $u\ge2$: $u-2\ge0$ và $u^3+2u^2-u-1=u(u^2-1)+(2u^2-1)>0$. Vậy $G-2\ge0$.

Dấu "=" xảy ra khi $u=2$, tức $\dfrac{x}{y}=\dfrac{y}{x}$, $x=y$. Khi đó $G=1+1-1-1+1+1=2$.

Vậy $GTNN$ của $G$ bằng $2$ khi $x=y$.

=== C5B.29@p179
- bai: 29 · y: - · trang: 179 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki dạng Engel 1/p+1/q+1/q ≥ 9/(p+2q) · (a+b+c)² = a²+b²+c²+2(ab+bc+ca) · (a+b+c)² ≥ 3(ab+bc+ca)
- kiem: khong
- ket_qua_sach: 673
- dap_an: $GTNN=673$ khi $a=b=c=1$
- ghi_chu_nghi: Máy vét lưới (a,b,c>0, a+b+c≤3, bước 1/30) cho min = 673 tại a=b=c=1, khớp sách.
## DE
Cho ba số thực dương $a,b,c$ thỏa mãn $a+b+c\le3$. Tìm giá trị nhỏ nhất của: $\dfrac{1}{a^2+b^2+c^2}+\dfrac{2018}{ab+bc+ac}$
## SACH
Vậy giá trị nhỏ nhất của $\dfrac{1}{a^2+b^2+c^2}+\dfrac{2018}{ab+bc+ac}$ là $673$ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai mẫu $p=a^2+b^2+c^2$ và $q=ab+bc+ca$ nối với $a+b+c$ qua $p+2q=(a+b+c)^2\le9$; nên tách $2018$ thành $2+2016$ để một phần là $\dfrac{1}{p}+\dfrac{1}{q}+\dfrac{1}{q}$ (dùng được Engel với tổng mẫu $p+2q$), phần còn lại $\dfrac{2016}{q}$ chặn nhờ $q\le3$.

**Bước 1.** Viết $\dfrac{1}{p}+\dfrac{2018}{q}=\left(\dfrac{1}{p}+\dfrac{1}{q}+\dfrac{1}{q}\right)+\dfrac{2016}{q}$ vì điểm rơi $a=b=c=1$ cho $p=q=3$ nên ba mẫu $p,q,q$ cùng giá trị và Engel có dấu "=" tại điểm đó.

**Bước 2.** Áp dụng Bu-nhi-a-cốp-xki dạng Engel cho nhóm đầu để được $\dfrac{9}{p+2q}=\dfrac{9}{(a+b+c)^2}$ rồi dùng $a+b+c\le3$.

**Bước 3.** Chặn $q$ từ trên bằng $\dfrac{(a+b+c)^2}{3}\le3$ để chặn $\dfrac{2016}{q}$ từ dưới.

**Bước 4.** Cộng hai cận dưới và kiểm tra dấu "=" tại $a=b=c=1$.

**Phần 2. Trình bày**

Đặt $p=a^2+b^2+c^2$, $q=ab+bc+ca$. Khi đó $p+2q=(a+b+c)^2\le9$ và $q\le\dfrac{(a+b+c)^2}{3}\le3$.

Theo Bu-nhi-a-cốp-xki dạng Engel: $\dfrac{1}{p}+\dfrac{1}{q}+\dfrac{1}{q}\ge\dfrac{(1+1+1)^2}{p+2q}=\dfrac{9}{p+2q}\ge\dfrac{9}{9}=1$.

Vì $q\le3$ nên $\dfrac{2016}{q}\ge672$.

Do đó $\dfrac{1}{p}+\dfrac{2018}{q}=\left(\dfrac{1}{p}+\dfrac{1}{q}+\dfrac{1}{q}\right)+\dfrac{2016}{q}\ge1+672=673$.

Dấu "=" xảy ra khi $a=b=c$ và $a+b+c=3$, tức $a=b=c=1$ (khi đó $p=q=3$ và giá trị là $\dfrac{1}{3}+\dfrac{2018}{3}=673$).

Vậy $GTNN$ bằng $673$ khi $a=b=c=1$.

=== C5B.30@p179
- bai: 30 · y: - · trang: 179 · tang: nang_cao
- nguon_de: Chuyên Toán Nam Định 2017 – 2018
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: a+bc=(a+b)(a+c) khi a+b+c=1 · (a+b)² ≥ 4ab · 1/(1-t) ≥ 1+t
- kiem: khong
- ket_qua_sach: 8
- dap_an: $GTNN=8$ khi $c=0,\ a=b=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới tam giác a+b+c=1 (loại a,b,c=1) cho min P = 8 tại (1/2;1/2;0), khớp sách.
## DE
(Chuyên Toán Nam Định 2017 – 2018) Xét các số thực $a,b,c$ không âm, khác $1$ và thỏa mãn $a+b+c=1$. Tìm giá trị nhỏ nhất của biểu thức $P=\dfrac{1}{a+bc}+\dfrac{1}{b+ac}+(a+b)(4+2017c)$.
## SACH
Vậy giá trị nhỏ nhất của $P$ là $8$. Dấu bằng xảy ra khi và chỉ khi $c=0,\ a=b=\dfrac{1}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $a+b+c=1$ ta có $a+bc=a(a+b+c)+bc=(a+b)(a+c)$ và tương tự $b+ac=(a+b)(b+c)$, nên hai phân thức đầu có chung nhân tử $a+b$ và mẫu quy về các tích của $a+b$, $b+c$, $c+a$; sau đó mọi thứ chỉ còn hai đại lượng $a+b=1-c$ và $ab$.

**Bước 1.** Biến đổi $a+bc=(a+b)(a+c)$ và $b+ac=(a+b)(b+c)$, rồi cộng hai phân thức để tử là $a+b+2c=1+c$ và mẫu chứa $(a+c)(b+c)=ab+c$.

**Bước 2.** Chặn $ab$ từ trên bằng $\dfrac{(a+b)^2}{4}$ để chặn mẫu, và thay $a+b=1-c$ để mọi thứ chỉ còn biến $c$.

**Bước 3.** Chặn $\dfrac{4}{1-c^2}$ từ dưới bằng $4(1+c^2)$ rồi gộp với $(1-c)(4+2017c)$ để ra một biểu thức không âm của $c$.

**Bước 4.** Kết luận và kiểm tra dấu "=" tại $c=0,\ a=b=\dfrac{1}{2}$.

**Chú ý:** Điều kiện "khác $1$" bảo đảm $a+b>0$ (nếu $a+b=0$ thì $c=1$), nhờ đó các mẫu đều khác $0$.

**Phần 2. Trình bày**

Vì $a,b,c\ge0$, khác $1$ và $a+b+c=1$ nên $a+b=1-c>0$, $a+c>0$, $b+c>0$.

Do $a+b+c=1$: $a+bc=a(a+b+c)+bc=(a+b)(a+c)$ và $b+ac=(a+b)(b+c)$. Do đó

$\dfrac{1}{a+bc}+\dfrac{1}{b+ac}=\dfrac{(b+c)+(a+c)}{(a+b)(a+c)(b+c)}=\dfrac{1+c}{(a+b)(ab+c)}$ (vì $(a+c)(b+c)=ab+c(a+b+c)=ab+c$)

Mà $ab\le\dfrac{(a+b)^2}{4}=\dfrac{(1-c)^2}{4}$ nên $ab+c\le\dfrac{(1-c)^2}{4}+c=\dfrac{(1+c)^2}{4}$.

Suy ra $\dfrac{1}{a+bc}+\dfrac{1}{b+ac}\ge\dfrac{4(1+c)}{(1-c)(1+c)^2}=\dfrac{4}{1-c^2}$.

Vì $0\le c<1$ nên $\dfrac{1}{1-c^2}\ge1+c^2$ (do $1\ge1-c^4$). Vậy

$P\ge4(1+c^2)+(1-c)(4+2017c)=4+4c^2+4+2013c-2017c^2=8+2013c(1-c)\ge8$.

Dấu "=" xảy ra khi $a=b$ và $c=0$, tức $c=0,\ a=b=\dfrac{1}{2}$ (các số này không bằng $1$). Khi đó $P=2+2+4=8$.

Vậy $GTNN$ của $P$ bằng $8$ khi $c=0,\ a=b=\dfrac{1}{2}$.

=== C5B.31@p180
- bai: 31 · y: - · trang: 180 · tang: nang_cao
- nguon_de: Toán học & tuổi trẻ số 385b
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: (a+b+c)²=a²+b²+c²+2(ab+bc+ca) · Bu-nhi-a-cốp-xki dạng Engel 3²/p+2²/(2q) ≥ 25/(p+2q)
- kiem: khong
- ket_qua_sach: 33
- dap_an: $GTNN=25$ khi $ab+bc+ca=\dfrac{1}{5}$ (chẳng hạn $a=b=\dfrac{5-\sqrt{10}}{15},\ c=\dfrac{5+2\sqrt{10}}{15}$)
- ghi_chu_nghi: SÁCH SAI. Sách ghi min P = 33 khi a=b=c=1/3, nhưng 33 chỉ là giá trị tại a=b=c=1/3 (khi đó ab+bc+ca=1/3), không phải giá trị nhỏ nhất: đặt q=ab+bc+ca thì P=9/(1-2q)+2/q, nhỏ nhất bằng 25 tại q=1/5 (đạt được, ví dụ a=b=(5-√10)/15≈0,1225, c≈0,7550). Máy vét lưới a+b+c=1 cho min P = 25,0000005; P tại a=b=c=1/3 bằng 33. Lời giải soạn theo bản đúng (25).
## DE
(Toán học & tuổi trẻ số 385b) Xét các số thực $a,b,c$ dương thỏa mãn $a+b+c=1$. Tìm giá trị nhỏ nhất của biểu thức $P=\dfrac{9}{1-2(ab+bc+ca)}+\dfrac{2}{ab+bc+ca}$
## SACH
Vậy giá trị nhỏ nhất của $P$ là $33$. Dấu bằng xảy ra khi và chỉ khi $a=b=c=\dfrac{1}{3}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $a+b+c=1$ nên $a^2+b^2+c^2=1-2(ab+bc+ca)$, tức mẫu thứ nhất chính là $p=a^2+b^2+c^2$; đặt $q=ab+bc+ca$ thì $p+2q=1$ và $P=\dfrac{9}{p}+\dfrac{2}{q}$ chỉ còn hai biến cùng một hệ thức tuyến tính, đúng dạng dùng Bu-nhi-a-cốp-xki dạng Engel.

**Bước 1.** Viết $1-2(ab+bc+ca)=a^2+b^2+c^2=p$ nhờ $(a+b+c)^2=1$ và đặt $q=ab+bc+ca$, khi đó $p+2q=1$.

**Bước 2.** Viết $P=\dfrac{3^2}{p}+\dfrac{2^2}{2q}$ để chọn tử $3$ và $2$ sao cho tỉ lệ tử trên mẫu bằng nhau tại điểm cực trị (dự đoán $\dfrac{3}{p}=\dfrac{2}{2q}$ tức $p=3q$, không phải $p=q$ như ở điểm đối xứng).

**Bước 3.** Áp dụng Engel để chặn $P$ từ dưới bằng $\dfrac{(3+2)^2}{p+2q}$ rồi dùng $p+2q=1$.

**Bước 4.** Giải $p=3q,\ p+2q=1$ để có $q$ rồi chỉ ra bộ $(a,b,c)$ dương, tổng bằng $1$, có $ab+bc+ca=q$ để chứng tỏ giá trị đạt được.

**Chú ý:** Giá trị của $P$ tại điểm đối xứng $a=b=c=\dfrac{1}{3}$ chưa chắc là cực trị; ở đây điểm đối xứng cho $33$, còn cực trị thật là một giá trị nhỏ hơn đạt ở điểm bất đối xứng.

**Phần 2. Trình bày**

Vì $a+b+c=1$ nên $a^2+b^2+c^2=1-2(ab+bc+ca)$. Đặt $p=a^2+b^2+c^2>0$, $q=ab+bc+ca>0$; khi đó $p+2q=1$ và

$P=\dfrac{9}{p}+\dfrac{2}{q}=\dfrac{3^2}{p}+\dfrac{2^2}{2q}\ge\dfrac{(3+2)^2}{p+2q}=25$ (Bu-nhi-a-cốp-xki dạng Engel với các mẫu $p,2q>0$)

Dấu "=" xảy ra khi $\dfrac{3}{p}=\dfrac{2}{2q}$, tức $p=3q$; kết hợp $p+2q=1$ ta được $q=\dfrac{1}{5},\ p=\dfrac{3}{5}$.

Giá trị này đạt được: với $a=b=\dfrac{5-\sqrt{10}}{15}$, $c=\dfrac{5+2\sqrt{10}}{15}$ (đều dương) ta có $a+b+c=1$ và $ab+bc+ca=a(a+2c)=\dfrac{(5-\sqrt{10})(15+3\sqrt{10})}{225}=\dfrac{3(25-10)}{225}=\dfrac{1}{5}$. Khi đó $P=\dfrac{9}{3/5}+\dfrac{2}{1/5}=15+10=25$.

Vậy $GTNN$ của $P$ bằng $25$, đạt khi $ab+bc+ca=\dfrac{1}{5}$ (chẳng hạn $a=b=\dfrac{5-\sqrt{10}}{15},\ c=\dfrac{5+2\sqrt{10}}{15}$).

=== C5B.32@p180
- bai: 32 · y: - · trang: 180 · tang: nang_cao
- nguon_de: Tuyển sinh 10 Hải Dương 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: a⁵+b⁵ ≥ a²b²(a+b) (biến đổi tương đương) · abc=1 ⇒ 1/(ab)=c
- kiem: khong
- ket_qua_sach: 1
- dap_an: $GTLN=1$ khi $a=b=c=1$
- ghi_chu_nghi: Máy vét lưới (a,b; c=1/(ab)) cho max P = 1 tại a=b=c=1, khớp sách.
## DE
(Tuyển sinh 10 Hải Dương 2016 – 2017) Cho $a,b,c$ là ba số thực dương thoả mãn: $abc=1$. Tìm giá trị lớn nhất của biểu thức: $P=\dfrac{ab}{a^5+b^5+ab}+\dfrac{bc}{b^5+c^5+bc}+\dfrac{ca}{c^5+a^5+ca}$.
## SACH
Vậy giá trị lớn nhất của $P$ bằng $1$ khi $a=b=c=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu có $a^5+b^5$ bậc cao còn tử là $ab$ nên cần chặn $a^5+b^5$ từ dưới bằng một biểu thức dễ xử lý; dạng quen thuộc $a^5+b^5\ge a^2b^2(a+b)$ làm mẫu có nhân tử $ab$ chung với tử, và điều kiện $abc=1$ biến $\dfrac{1}{ab}$ thành $c$.

**Bước 1.** Chứng minh $a^5+b^5\ge a^2b^2(a+b)$ bằng cách biến đổi tương đương về tích $(a^3-b^3)(a^2-b^2)\ge0$.

**Bước 2.** Thay vào mẫu và đặt nhân tử $ab$ làm nhân tử chung để chặn $\dfrac{ab}{a^5+b^5+ab}$ bằng $\dfrac{1}{ab(a+b)+1}$.

**Bước 3.** Dùng $abc=1$ để biến $ab(a+b)+1$ thành $\dfrac{a+b+c}{c}$, khi đó mỗi phân thức bị chặn trên bởi một phân thức có cùng mẫu $a+b+c$.

**Bước 4.** Cộng ba bất đẳng thức để được cận trên hằng số, rồi kiểm tra dấu "=".

**Phần 2. Trình bày**

Ta có $a^5+b^5-a^2b^2(a+b)=a^5+b^5-a^3b^2-a^2b^3=(a^3-b^3)(a^2-b^2)\ge0$ (hai nhân tử cùng dấu vì $a,b>0$). Do đó $a^5+b^5\ge a^2b^2(a+b)$.

Suy ra $a^5+b^5+ab\ge ab\left[ab(a+b)+1\right]$, nên $\dfrac{ab}{a^5+b^5+ab}\le\dfrac{1}{ab(a+b)+1}$.

Vì $abc=1$ nên $ab=\dfrac{1}{c}$ và $ab(a+b)+1=\dfrac{a+b}{c}+1=\dfrac{a+b+c}{c}$. Vậy $\dfrac{ab}{a^5+b^5+ab}\le\dfrac{c}{a+b+c}$.

Tương tự $\dfrac{bc}{b^5+c^5+bc}\le\dfrac{a}{a+b+c}$ và $\dfrac{ca}{c^5+a^5+ca}\le\dfrac{b}{a+b+c}$.

Cộng ba bất đẳng thức: $P\le\dfrac{a+b+c}{a+b+c}=1$.

Dấu "=" xảy ra khi $a=b=c$ và $abc=1$, tức $a=b=c=1$. Khi đó $P=3\cdot\dfrac{1}{3}=1$.

Vậy $GTLN$ của $P$ bằng $1$ khi $a=b=c=1$.

=== C5B.33@p180
- bai: 33 · y: - · trang: 180 · tang: nang_cao
- nguon_de: Tuyển sinh 10 Bình Dương 2016 – 2017
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: x/(x+1)=1-1/(x+1) · Bu-nhi-a-cốp-xki dạng Engel (hoặc Cô-si ba số) Σ1/(x+1) ≥ 9/(Σ(x+1))
- kiem: khong
- ket_qua_sach: \dfrac{3}{4}
- dap_an: $GTLN=\dfrac{3}{4}$ khi $x=y=z=\dfrac{1}{3}$
- ghi_chu_nghi: Máy vét lưới trên x+y+z=1 cho max P = 3/4 tại x=y=z=1/3, khớp sách.
## DE
(Tuyển sinh 10 Bình Dương 2016 – 2017) Giả sử $x,y,z$ là những số dương thay đổi thỏa mãn điều kiện $x+y+z=1$. Hãy tìm giá trị lớn nhất của biểu thức $P=\dfrac{x}{x+1}+\dfrac{y}{y+1}+\dfrac{z}{z+1}$.
## SACH
Vậy $P$ đạt giá trị lớn nhất là $P=\dfrac{3}{4}$ tại $x=y=z=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi phân thức $\dfrac{x}{x+1}$ có tử kém mẫu đúng $1$ nên $\dfrac{x}{x+1}=1-\dfrac{1}{x+1}$; tìm giá trị lớn nhất của $P$ thành tìm giá trị nhỏ nhất của tổng các nghịch đảo $\sum\dfrac{1}{x+1}$ có tổng các mẫu $\sum(x+1)=4$ không đổi, đúng dạng của bất đẳng thức giữa tổng nghịch đảo và nghịch đảo tổng.

**Bước 1.** Viết $P=3-\left(\dfrac{1}{x+1}+\dfrac{1}{y+1}+\dfrac{1}{z+1}\right)$ để chuyển bài toán về chặn dưới tổng nghịch đảo.

**Bước 2.** Áp dụng $\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{w}\ge\dfrac{9}{u+v+w}$ với $u=x+1,\ v=y+1,\ w=z+1$ dương và $u+v+w=4$.

**Bước 3.** Thay vào để chặn $P$ từ trên và đối chiếu dấu "=" tại $x=y=z=\dfrac{1}{3}$.

**Phần 2. Trình bày**

$P=\left(1-\dfrac{1}{x+1}\right)+\left(1-\dfrac{1}{y+1}\right)+\left(1-\dfrac{1}{z+1}\right)=3-\left(\dfrac{1}{x+1}+\dfrac{1}{y+1}+\dfrac{1}{z+1}\right)$

Theo bất đẳng thức $\dfrac{1}{u}+\dfrac{1}{v}+\dfrac{1}{w}\ge\dfrac{9}{u+v+w}$ với $u,v,w>0$ (Bu-nhi-a-cốp-xki dạng Engel): $\dfrac{1}{x+1}+\dfrac{1}{y+1}+\dfrac{1}{z+1}\ge\dfrac{9}{x+y+z+3}=\dfrac{9}{4}$.

Do đó $P\le3-\dfrac{9}{4}=\dfrac{3}{4}$.

Dấu "=" xảy ra khi $x+1=y+1=z+1$, tức $x=y=z=\dfrac{1}{3}$ (thỏa $x+y+z=1$).

Vậy $GTLN$ của $P$ bằng $\dfrac{3}{4}$ khi $x=y=z=\dfrac{1}{3}$.

=== C5B.34@p180
- bai: 34 · y: - · trang: 180 · tang: nang_cao
- nguon_de: Tuyển sinh 10 Chuyên Quảng Ngãi 2015 – 2016
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: tách a³/(a²+b²) = a - ab²/(a²+b²) · Cô-si hai số a²+b² ≥ 2ab
- kiem: khong
- ket_qua_sach: \dfrac{3}{2}
- dap_an: $GTNN=\dfrac{3}{2}$ khi $a=b=c=1$
- ghi_chu_nghi: Máy vét lưới trên a+b+c=3 cho min P = 3/2 tại a=b=c=1, khớp sách.
## DE
(Tuyển sinh 10 Chuyên Quảng Ngãi 2015 – 2016) Cho $a,b,c$ là các số thực dương thỏa mãn điều kiện: $a+b+c=3$. Tìm giá trị nhỏ nhất của biểu thức: $P=\dfrac{a^3}{a^2+b^2}+\dfrac{b^3}{b^2+c^2}+\dfrac{c^3}{c^2+a^2}$.
## SACH
Vậy giá trị nhỏ nhất của $P$ là $\dfrac{3}{2}$ khi $a=b=c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử $a^3$ chia mẫu $a^2+b^2$ được "phần nguyên" là $a$, nên tách $\dfrac{a^3}{a^2+b^2}=a-\dfrac{ab^2}{a^2+b^2}$; phần trừ có mẫu $a^2+b^2\ge2ab$ làm triệt tiêu $a$ ở tử, cho một cận gọn là một bội của $b$.

**Bước 1.** Thực hiện phép tách $\dfrac{a^3}{a^2+b^2}=a-\dfrac{ab^2}{a^2+b^2}$ cho cả ba số hạng.

**Bước 2.** Dùng Cô-si hai số $a^2+b^2\ge2ab$ để chặn $\dfrac{ab^2}{a^2+b^2}$ từ trên bằng $\dfrac{b}{2}$, suy ra $\dfrac{a^3}{a^2+b^2}\ge a-\dfrac{b}{2}$.

**Bước 3.** Cộng ba bất đẳng thức để $P$ bị chặn dưới bởi một bội của $a+b+c$, rồi thay $a+b+c=3$.

**Phần 2. Trình bày**

Ta có $\dfrac{a^3}{a^2+b^2}=a-\dfrac{ab^2}{a^2+b^2}$. Theo Cô-si hai số, $a^2+b^2\ge2ab$ nên $\dfrac{ab^2}{a^2+b^2}\le\dfrac{ab^2}{2ab}=\dfrac{b}{2}$. Suy ra $\dfrac{a^3}{a^2+b^2}\ge a-\dfrac{b}{2}$.

Tương tự $\dfrac{b^3}{b^2+c^2}\ge b-\dfrac{c}{2}$ và $\dfrac{c^3}{c^2+a^2}\ge c-\dfrac{a}{2}$.

Cộng ba bất đẳng thức: $P\ge(a+b+c)-\dfrac{a+b+c}{2}=\dfrac{a+b+c}{2}=\dfrac{3}{2}$.

Dấu "=" xảy ra khi $a=b=c$ và $a+b+c=3$, tức $a=b=c=1$. Khi đó $P=3\cdot\dfrac{1}{2}=\dfrac{3}{2}$.

Vậy $GTNN$ của $P$ bằng $\dfrac{3}{2}$ khi $a=b=c=1$.

=== C5B.35@p180
- bai: 35 · y: - · trang: 180 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki dạng Engel 1/p+1/q ≥ 4/(p+q) · (x+y)² ≥ 4xy · tách 2/(xy) = 1/(2xy)+3/(2xy)
- kiem: khong
- ket_qua_sach: 10
- dap_an: $GTNN=10$ khi $x=y=\dfrac{1}{2}$
- ghi_chu_nghi: Máy vét lưới (x,y>0, x+y≤1) cho min M = 10 tại x=y=1/2, khớp sách.
## DE
Cho hai số dương $x,y$ thoả mãn $x+y\le1$. Tìm giá trị nhỏ nhất của biểu thức: $M=\dfrac{1}{x^2+y^2}+\dfrac{2}{xy}$.
## SACH
Vậy giá trị nhỏ nhất của $M$ là $10$ khi $x=y=\dfrac{1}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai mẫu $x^2+y^2$ và $2xy$ cộng lại thành $(x+y)^2$, bị chặn trên bởi điều kiện $x+y\le1$; nên tách $\dfrac{2}{xy}=\dfrac{1}{2xy}+\dfrac{3}{2xy}$ để nhóm $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}$ dùng được bất đẳng thức $\dfrac{1}{p}+\dfrac{1}{q}\ge\dfrac{4}{p+q}$, phần $\dfrac{3}{2xy}$ còn lại chặn nhờ $xy\le\dfrac{1}{4}$.

**Bước 1.** Viết $M=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\dfrac{3}{2xy}$ với điểm rơi $x=y=\dfrac{1}{2}$ cho $x^2+y^2=2xy$ nên hai mẫu cùng giá trị.

**Bước 2.** Dùng $\dfrac{1}{p}+\dfrac{1}{q}\ge\dfrac{4}{p+q}$ cho nhóm đầu để được $\dfrac{4}{(x+y)^2}$ rồi dùng $x+y\le1$.

**Bước 3.** Chặn tích $xy\le\dfrac{(x+y)^2}{4}\le\dfrac{1}{4}$ từ trên để suy ra cận dưới của phần còn lại $\dfrac{3}{2xy}$.

**Bước 4.** Cộng hai cận dưới và kiểm tra dấu "=" tại $x=y=\dfrac{1}{2}$.

**Phần 2. Trình bày**

Theo bất đẳng thức $\dfrac{1}{p}+\dfrac{1}{q}\ge\dfrac{4}{p+q}$ ($p,q>0$): $\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\ge\dfrac{4}{x^2+y^2+2xy}=\dfrac{4}{(x+y)^2}\ge4$ (vì $0<x+y\le1$).

Mặt khác $xy\le\dfrac{(x+y)^2}{4}\le\dfrac{1}{4}$ nên $\dfrac{3}{2xy}\ge6$.

Do đó $M=\left(\dfrac{1}{x^2+y^2}+\dfrac{1}{2xy}\right)+\dfrac{3}{2xy}\ge4+6=10$.

Dấu "=" xảy ra khi $x^2+y^2=2xy$ và $x+y=1$, tức $x=y=\dfrac{1}{2}$. Khi đó $M=\dfrac{1}{1/2}+\dfrac{2}{1/4}=2+8=10$.

Vậy $GTNN$ của $M$ bằng $10$ khi $x=y=\dfrac{1}{2}$.
