=== C4V2.1@p144
- bai: VD1 · y: - · trang: 144 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki cho hai bộ ba số (1;1;1) và (a;b;c)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách không nêu điều kiện của a, b, c (bất đẳng thức đúng với mọi số thực). Vế phải sách in là $ab+bc+ac$, giữ nguyên.
## DE
Chứng minh rằng: $a^2+b^2+c^2\ge ab+bc+ac$.
## SACH
Dùng bất đẳng thức Bunhiacopski.

Xét cặp số $(1;1;1)$ và $(a;b;c)$ ta có

$(1^2+1^2+1^2)(a^2+b^2+c^2)\ge(1\cdot a+1\cdot b+1\cdot c)^2$

$\Rightarrow3(a^2+b^2+c^2)\ge a^2+b^2+c^2+2(ab+bc+ac)$

$\Rightarrow a^2+b^2+c^2\ge ab+bc+ac$ (đpcm)

Dấu bằng xảy ra khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải $ab+bc+ca$ chính là phần tích đôi sinh ra khi khai triển $(a+b+c)^2$, mà $(a+b+c)^2=(1\cdot a+1\cdot b+1\cdot c)^2$ là vế phải của Bu-nhi-a-cốp-xki cho hai bộ số $(1;1;1)$ và $(a;b;c)$.

**Bước 1.** Viết bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ ba số $(1;1;1)$ và $(a;b;c)$; bộ toàn số 1 được chọn vì nó làm vế phải thành bình phương của tổng $a+b+c$ và vế trái có thừa số $3$.

**Bước 2.** Khai triển $(a+b+c)^2$ để xuất hiện cả $a^2+b^2+c^2$ lẫn các tích đôi, rồi chuyển các hạng tử giống nhau về một vế.

**Bước 3.** Chia hai vế cho 2 để về đúng bất đẳng thức cần chứng minh, rồi đọc điều kiện dấu "=" từ điều kiện hai bộ số tỉ lệ.

**Chú ý:** Bất đẳng thức đúng với mọi số thực $a,b,c$, không cần dương; cách xét hiệu $\dfrac12\left[(a-b)^2+(b-c)^2+(c-a)^2\right]\ge0$ cũng cho kết quả ngay.

**Phần 2. Trình bày**

Áp dụng bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ số $(1;1;1)$ và $(a;b;c)$:

$(1^2+1^2+1^2)(a^2+b^2+c^2)\ge(1\cdot a+1\cdot b+1\cdot c)^2$

$\Rightarrow3(a^2+b^2+c^2)\ge a^2+b^2+c^2+2(ab+bc+ca)$

$\Rightarrow2(a^2+b^2+c^2)\ge2(ab+bc+ca)$

$\Rightarrow a^2+b^2+c^2\ge ab+bc+ca$.

Dấu "=" xảy ra khi hai bộ số tỉ lệ: $\dfrac a1=\dfrac b1=\dfrac c1$, tức $a=b=c$.

Vậy $a^2+b^2+c^2\ge ab+bc+ca$.

=== C4V2.2@p144
- bai: VD2 · y: - · trang: 144 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki cho hai bộ ba số (1;1;1) và (a;b;c)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho $a,b,c$ là các số thực và $a+b+c=1$. Chứng minh rằng $a^2+b^2+c^2\ge\dfrac13$.
## SACH
Áp dụng BĐT BunhiaCôpski cho 3 số $(1;1;1)$ và $(a;b;c)$.

Ta có $(1\cdot a+1\cdot b+1\cdot c)^2\le(1+1+1)(a^2+b^2+c^2)$

$\Leftrightarrow(a+b+c)^2\le3(a^2+b^2+c^2)\Leftrightarrow a^2+b^2+c^2\ge\dfrac13$ (vì $a+b+c=1$) (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho tổng $a+b+c$ cố định còn cần chặn dưới tổng bình phương, mà $(a+b+c)^2=(1\cdot a+1\cdot b+1\cdot c)^2$ nằm đúng ở vế nhỏ của Bu-nhi-a-cốp-xki cho $(1;1;1)$ và $(a;b;c)$.

**Bước 1.** Viết bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ ba số $(1;1;1)$ và $(a;b;c)$ để nối tổng bình phương với bình phương của tổng.

**Bước 2.** Thay điều kiện $a+b+c=1$ vào vế chứa bình phương của tổng để được một cận dưới là hằng số.

**Bước 3.** Chia hai vế cho $3>0$ rồi tìm dấu "=" từ điều kiện hai bộ số tỉ lệ, kiểm tra nó thỏa $a+b+c=1$.

**Chú ý:** Không cần $a,b,c$ dương; điều kiện dấu "=" $a=b=c$ phải được đối chiếu với giả thiết $a+b+c=1$ để biết dấu "=" có đạt thật hay không.

**Phần 2. Trình bày**

Áp dụng bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ số $(1;1;1)$ và $(a;b;c)$:

$(1^2+1^2+1^2)(a^2+b^2+c^2)\ge(1\cdot a+1\cdot b+1\cdot c)^2=(a+b+c)^2$

Mà $a+b+c=1$ nên $3(a^2+b^2+c^2)\ge1$

$\Rightarrow a^2+b^2+c^2\ge\dfrac13$.

Dấu "=" xảy ra khi $\dfrac a1=\dfrac b1=\dfrac c1$, tức $a=b=c$; kết hợp $a+b+c=1$ được $a=b=c=\dfrac13$.

Vậy $a^2+b^2+c^2\ge\dfrac13$.

=== C4V2.3@p144
- bai: VD3 · y: - · trang: 144 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ hoàn thành bình phương · bất đẳng thức 2ab ≤ ka²+b²/k (k>0, từ (ka−b)²≥0, Cô-si hai số) · làm trội hệ số theo điểm biên
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách ghi lời giải dưới nhãn "Hướng dẫn giải" nhưng đã đủ các bước; bước đánh giá $2ab\le\dfrac{\sqrt{41}}{3}a^2+\dfrac{3}{\sqrt{41}}b^2$ sách không giải thích hệ số, đã bổ sung.
## DE
Cho $x$ và $y$ là các số thực thỏa mãn: $\begin{cases}x^2+y^2+2xy+x+y\le2\\x^2+2y^2+2xy+x-2y\le10\end{cases}$. Chứng minh rằng $\dfrac{-1-\sqrt{41}}{2}\le x+2y$.
## SACH
Ta có: $\begin{cases}x^2+y^2+2xy+x+y\le2\\x^2+2y^2+2xy+x-2y\le10\end{cases}\Leftrightarrow\begin{cases}\left(x+y+\dfrac12\right)^2\le\dfrac94\\\left(x+y+\dfrac12\right)^2+\left(y-\dfrac32\right)^2\le\dfrac{25}{2}\end{cases}$

Đặt: $a=x+y+\dfrac12$; $b=y-\dfrac32$.

Khi đó $a$ và $b$ thỏa mãn: $\begin{cases}a^2\le\dfrac94\\a^2+b^2\le\dfrac{25}{2}\end{cases}$ và $P=x+2y=a+b+1$.

Ta có: $(a+b)^2=a^2+b^2+2ab\le a^2+b^2+\dfrac{\sqrt{41}}{3}a^2+\dfrac{3}{\sqrt{41}}b^2$

$=a^2+b^2+\dfrac{32}{3\sqrt{41}}a^2+\dfrac{3}{\sqrt{41}}(a^2+b^2)\le\dfrac{25}{2}+\dfrac{3}{\sqrt{41}}\cdot\dfrac{25}{2}+\dfrac{32}{3\sqrt{41}}\cdot\dfrac94=\left(\dfrac{3+\sqrt{41}}{2}\right)^2$.

Vậy $a+b\ge\dfrac{-3-\sqrt{41}}{2}\Rightarrow P\ge\dfrac{-1-\sqrt{41}}{2}$.

Xảy ra khi: $\begin{cases}a=\dfrac{-3}{2}\\b=-\dfrac{\sqrt{41}}{2}\end{cases}\Leftrightarrow\begin{cases}x=\dfrac{\sqrt{41}-7}{2}\\y=\dfrac{3-\sqrt{41}}{2}\end{cases}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái hai điều kiện đều chứa $(x+y)^2+(x+y)$ nên hoàn thành bình phương được thành "$a^2\le\dfrac94$ và $a^2+b^2\le\dfrac{25}{2}$" với ẩn phụ $a,b$, còn $x+2y=a+b+1$; muốn chặn dưới $a+b$ ta dùng $2ab\le ka^2+\dfrac{b^2}{k}$ với $k$ chọn sao cho dấu "=" rơi đúng góc vùng, nơi cả hai điều kiện cùng chạm biên.

**Bước 1.** Hoàn thành bình phương từng vế trái: $x^2+y^2+2xy+x+y=\left(x+y+\dfrac12\right)^2-\dfrac14$ và $x^2+2y^2+2xy+x-2y=\left(x+y+\dfrac12\right)^2+\left(y-\dfrac32\right)^2-\dfrac52$, rồi đặt $a=x+y+\dfrac12$, $b=y-\dfrac32$ để hai điều kiện thành $a^2\le\dfrac94$ và $a^2+b^2\le\dfrac{25}{2}$.

**Bước 2.** Biểu thị $x+2y=(x+y)+y$ theo $a,b$ để thấy bài toán là chặn dưới $a+b$, tức chặn dưới tổng bên trong một hình tròn bị cắt bởi dải $|a|\le\dfrac32$.

**Bước 3.** Dự đoán điểm đạt cực biên ở góc vùng, nơi $a^2=\dfrac94$ và $a^2+b^2=\dfrac{25}{2}$ cùng xảy ra (với $a<0,b<0$), từ đó $b=ka$ với $k=\dfrac{\sqrt{41}}{3}$, đây là hệ số cần cho bất đẳng thức $2ab\le ka^2+\dfrac{b^2}{k}$ có dấu "=" đúng tại điểm đó.

**Bước 4.** Chặn $(a+b)^2$ bằng $\left(1+\dfrac1k\right)(a^2+b^2)+\left(k-\dfrac1k\right)a^2$, rồi dùng hai điều kiện (cả hai hệ số đều dương) để đưa về một số cụ thể và nhận ra đó là một bình phương.

**Bước 5.** Từ $(a+b)^2$ bị chặn trên suy ra cận dưới của $a+b$, đổi lại $x+2y=a+b+1$ và chỉ ra điểm $(x;y)$ làm dấu "=" xảy ra.

**Chú ý:** Nếu chọn $k$ tùy ý (chẳng hạn $k=1$) thì cận thu được vẫn đúng nhưng yếu hơn, không ra đúng giá trị đề yêu cầu; hệ số $k$ phải khớp với điểm dấu "=".

**Phần 2. Trình bày**

Đặt $a=x+y+\dfrac12$ và $b=y-\dfrac32$.

Điều kiện thứ nhất: $(x+y)^2+(x+y)\le2\Leftrightarrow\left(x+y+\dfrac12\right)^2\le\dfrac94$, tức $a^2\le\dfrac94$ (1)

Điều kiện thứ hai: $x^2+2y^2+2xy+x-2y=(x+y)^2+(x+y)+y^2-3y=\left(a^2-\dfrac14\right)+\left(b^2-\dfrac94\right)=a^2+b^2-\dfrac52$

nên $a^2+b^2-\dfrac52\le10$, tức $a^2+b^2\le\dfrac{25}{2}$ (2)

Lại có $x+2y=(x+y)+y=\left(a-\dfrac12\right)+\left(b+\dfrac32\right)=a+b+1$.

Đặt $k=\dfrac{\sqrt{41}}{3}>0$. Vì $(ka-b)^2\ge0$ nên $2kab\le k^2a^2+b^2$, chia cho $k>0$: $2ab\le ka^2+\dfrac{b^2}{k}$ (dấu "=" khi $b=ka$).

Do đó $(a+b)^2=a^2+b^2+2ab\le a^2+b^2+ka^2+\dfrac{b^2}{k}=\left(1+\dfrac1k\right)(a^2+b^2)+\left(k-\dfrac1k\right)a^2$

Ở đây $1+\dfrac1k=1+\dfrac{3}{\sqrt{41}}>0$ và $k-\dfrac1k=\dfrac{32}{3\sqrt{41}}>0$, nên theo (1) và (2):

$(a+b)^2\le\left(1+\dfrac{3}{\sqrt{41}}\right)\cdot\dfrac{25}{2}+\dfrac{32}{3\sqrt{41}}\cdot\dfrac94=\dfrac{25}{2}+\dfrac{123}{2\sqrt{41}}$

Vì $123=3\cdot41$ nên $\dfrac{123}{2\sqrt{41}}=\dfrac{3\sqrt{41}}{2}$, suy ra $(a+b)^2\le\dfrac{25+3\sqrt{41}}{2}=\left(\dfrac{3+\sqrt{41}}{2}\right)^2$.

Do đó $a+b\ge-\dfrac{3+\sqrt{41}}{2}$, suy ra $x+2y=a+b+1\ge\dfrac{-1-\sqrt{41}}{2}$.

Dấu "=" xảy ra khi $b=ka$ cùng với $a=-\dfrac32$ và $a^2+b^2=\dfrac{25}{2}$, tức $a=-\dfrac32$, $b=-\dfrac{\sqrt{41}}{2}$, ứng với $x=\dfrac{\sqrt{41}-7}{2}$, $y=\dfrac{3-\sqrt{41}}{2}$ (thỏa cả hai điều kiện ở biên).

Vậy $\dfrac{-1-\sqrt{41}}{2}\le x+2y$.

=== C4V2.4@p145
- bai: VD4 · y: - · trang: 145 · tang: nang_cao
- nguon_de: Tạp chí Toán học & Tuổi trẻ số 434
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tích hai thừa số cùng dấu (b−a)(4−a)≤0 · Bu-nhi-a-cốp-xki cho (4;3) và (a;b) · chặn từng biến tại biên miền · đánh giá hàm t+m/t trên đoạn (không dùng Cô-si vì dấu "=" ngoài miền)
- kiem: khong
- ket_qua_sach: \dfrac{49}{150}
- dap_an: $GTNN=\dfrac{49}{150}$ khi $a=4$, $b=3$, $x=2$, $y=3$
- ghi_chu_nghi: Sách in (1) là $a^2\le4a+ab-ab$; đúng phải là $a^2\le4a+ab-4b$ (khai triển $(b-a)(4-a)\le0$), các bước sau (cộng (1)+(2) ra $4a+3b$) dùng bản đúng. Kết luận cuối sách viết chữ thường $p$ thay cho $P$.
## DE
(Tạp chí Toán học & Tuổi trẻ số 434) Cho các số thực $a,b,x,y$ thỏa mãn $\begin{cases}0<b\le a\le4\\a+b\le7\\2\le x\le3\le y\end{cases}$. Tìm giá trị nhỏ nhất của biểu thức $P=\dfrac{2x+y+\dfrac1x+\dfrac2y}{a^2+b^2}$.
## SACH
Ta có: $(b-a)(4-a)\le0\Leftrightarrow a^2\le4a+ab-ab$ (1)

Và $(7-a-b)b\ge0\Leftrightarrow b^2\le7b-ab$ (2).

Lấy (1) + (2) ta được: $a^2+b^2\le4a+3b$

$\Rightarrow(a^2+b^2)^2\le(4a+3b)^2\le(4^2+3^2)(a^2+b^2)$

$\Leftrightarrow a^2+b^2\le25$ (3)

Mặt khác ta lại có: $(x-2)\left(2-\dfrac{1}{2x}\right)\ge0\Leftrightarrow2x+\dfrac1x\ge4+\dfrac12$ (4)

và $(y-3)\left(1-\dfrac{2}{3y}\right)\ge0\Leftrightarrow y+\dfrac2y\ge3+\dfrac23$ (5)

Lấy (4) + (5) ta được $2x+y+\dfrac1x+\dfrac2y\ge4+3+\dfrac12+\dfrac23=\dfrac{49}{6}$ (6)

Từ (3) và (6) suy ra $p\ge\dfrac{\dfrac{49}{6}}{25}=\dfrac{49}{150}$ khi $a=4$, $b=3$, $y=3$, $x=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử của $P$ chỉ chứa $x,y$ còn mẫu chỉ chứa $a,b$ nên phải chặn riêng: tử từ dưới, mẫu từ trên; hai miền đều bị chặn ở biên ($x\ge2$, $y\ge3$, $a\le4$, $a+b\le7$) nên dấu "=" dự đoán rơi ngay tại góc biên $a=4,b=3,x=2,y=3$, không phải tại điểm "cân bằng" của Cô-si.

**Bước 1.** Chặn trên mẫu bằng cách dùng hai tích cùng dấu mà mỗi thừa số là khoảng cách tới một cạnh của miền: $(b-a)(4-a)\le0$ và $(7-a-b)b\ge0$, khai triển và cộng lại để hai hạng tử $ab$ triệt tiêu, được $a^2+b^2\le4a+3b$.

**Bước 2.** Đưa vế phải $4a+3b$ về $a^2+b^2$ bằng Bu-nhi-a-cốp-xki cho hai bộ $(4;3)$ và $(a;b)$ (hệ số 4 và 3 lấy từ góc $a=4,b=3$), rồi chia hai vế cho $a^2+b^2>0$ để có cận trên của mẫu.

**Bước 3.** Chặn dưới $2x+\dfrac1x$ bằng một tích có thừa số $x-2\ge0$ (vì $x\ge2$ thì $2x$ thắng $\dfrac1x$, hàm nhỏ nhất ở biên $x=2$), làm tương tự cho $y+\dfrac2y$ với thừa số $y-3\ge0$ rồi cộng hai kết quả.

**Bước 4.** Chia cận dưới của tử cho cận trên của mẫu (cả hai dương) để có cận dưới của $P$, rồi kiểm tra tồn tại bộ giá trị thỏa mọi điều kiện của đề mà làm mọi dấu "=" xảy ra cùng lúc.

**Chú ý:** Không dùng Cô-si cho $2x+\dfrac1x$ hay $y+\dfrac2y$ vì dấu "=" của Cô-si ở $x=\dfrac{1}{\sqrt2}<2$ và $y=\sqrt2<3$, nằm ngoài miền của đề; muốn khẳng định là giá trị nhỏ nhất phải chỉ ra đủ hai điều: bất đẳng thức đúng với mọi giá trị và có giá trị cụ thể đạt dấu "=".

**Phần 2. Trình bày**

Vì $0<b\le a\le4$ nên $b-a\le0$, $4-a\ge0$ và $(b-a)(4-a)\le0$, khai triển: $a^2\le4a+ab-4b$ (1)

Vì $a+b\le7$, $b>0$ nên $(7-a-b)b\ge0$, khai triển: $b^2\le7b-ab$ (2)

Cộng (1) và (2): $a^2+b^2\le4a+3b$

Hai vế đều dương nên $(a^2+b^2)^2\le(4a+3b)^2$

Theo bất đẳng thức Bu-nhi-a-cốp-xki cho $(4;3)$ và $(a;b)$: $(4a+3b)^2\le(4^2+3^2)(a^2+b^2)=25(a^2+b^2)$

Suy ra $(a^2+b^2)^2\le25(a^2+b^2)$, mà $a^2+b^2>0$ nên $a^2+b^2\le25$ (3)

Vì $x\ge2$ nên $x-2\ge0$; lại có $2-\dfrac{1}{2x}\ge2-\dfrac14>0$. Do đó $(x-2)\left(2-\dfrac{1}{2x}\right)=2x+\dfrac1x-\dfrac92\ge0$, tức $2x+\dfrac1x\ge\dfrac92$ (4)

Vì $y\ge3$ nên $y-3\ge0$; lại có $1-\dfrac{2}{3y}\ge1-\dfrac29>0$. Do đó $(y-3)\left(1-\dfrac{2}{3y}\right)=y+\dfrac2y-\dfrac{11}{3}\ge0$, tức $y+\dfrac2y\ge\dfrac{11}{3}$ (5)

Cộng (4) và (5): $2x+y+\dfrac1x+\dfrac2y\ge\dfrac92+\dfrac{11}{3}=\dfrac{49}{6}>0$ (6)

Từ (3) và (6), vì $0<a^2+b^2\le25$: $P\ge\dfrac{\dfrac{49}{6}}{25}=\dfrac{49}{150}$

Dấu "=" xảy ra khi $a=4$, $b=3$, $x=2$, $y=3$ (thỏa $0<b\le a\le4$, $a+b=7\le7$, $2\le x\le3\le y$; khi đó $a^2+b^2=25$ và tử bằng $4+3+\dfrac12+\dfrac23=\dfrac{49}{6}$).

Vậy $GTNN=\dfrac{49}{150}$, đạt khi $a=4$, $b=3$, $x=2$, $y=3$.

=== C4V2.5@p146
- bai: VD5 · y: - · trang: 146 · tang: nang_cao
- nguon_de: Tạp chí Toán học & Tuổi trẻ số 476
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ hoàn thành bình phương · Bu-nhi-a-cốp-xki cho (1;2) và (a;b)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Tạp chí Toán học & Tuổi trẻ số 476) Chứng minh rằng: $\dfrac{3-\sqrt{10}}{2}\le F=x+2y\le\dfrac{3+\sqrt{10}}{2}$ trong đó $x,y$ là hai số thực thỏa mãn: $x^2+y^2=x+y$.
## SACH
$x^2+y^2=x+y\Leftrightarrow\left(x-\dfrac12\right)^2+\left(y-\dfrac12\right)^2=\dfrac12$.

Tiếp tục đặt ẩn phụ $a=x-\dfrac12$, $b=y-\dfrac12$.

Khi đó ta sẽ chuyển về tìm giá trị nhỏ nhất, lớn nhất của $F=a+2b+\dfrac32$.

Ta có $a^2+b^2=\dfrac12$. Áp dụng bất đẳng thức Bunhiacôpsky ta có:

$(a+2b)^2=(1\cdot a+2\cdot b)^2\le(1+4)(a^2+b^2)=\dfrac52$

Nên suy ra $\dfrac{3-\sqrt{10}}{2}\le F\le\dfrac{3+\sqrt{10}}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x^2+y^2=x+y$ là một đường tròn (hoàn thành bình phương) và $x+2y$ là tổng $1\cdot a+2\cdot b$ cộng một hằng số, nên một bất đẳng thức Bu-nhi-a-cốp-xki cho $(1;2)$ và $(a;b)$ chặn được $F$ cả hai phía.

**Bước 1.** Chuyển điều kiện về $\left(x-\dfrac12\right)^2+\left(y-\dfrac12\right)^2=\dfrac12$ bằng cách đưa $x,y$ sang vế trái rồi cộng $\dfrac14+\dfrac14$, và đặt $a=x-\dfrac12$, $b=y-\dfrac12$.

**Bước 2.** Biểu thị $F=x+2y$ theo $a,b$ để thấy phần biến đổi chỉ là $a+2b$, còn lại là hằng số $\dfrac32$.

**Bước 3.** Áp dụng Bu-nhi-a-cốp-xki cho hai bộ $(1;2)$ và $(a;b)$ để chặn bình phương $(a+2b)^2$ bởi $5(a^2+b^2)$, thay $a^2+b^2=\dfrac12$.

**Bước 4.** Bỏ bình phương thành hai bất đẳng thức một chiều cho $a+2b$, cộng $\dfrac32$ rồi đối chiếu với hai cận của đề.

**Chú ý:** Đề cho bất đẳng thức hai phía; nên hai phía đều xuất phát từ cùng một bất đẳng thức $|a+2b|\le\sqrt{\dfrac52}$, và mỗi phía có dấu "=" riêng (khi $b=2a$).

**Phần 2. Trình bày**

$x^2+y^2=x+y\Leftrightarrow\left(x-\dfrac12\right)^2+\left(y-\dfrac12\right)^2=\dfrac12$.

Đặt $a=x-\dfrac12$, $b=y-\dfrac12$, thì $a^2+b^2=\dfrac12$ và $F=x+2y=a+2b+\dfrac32$.

Áp dụng bất đẳng thức Bu-nhi-a-cốp-xki cho $(1;2)$ và $(a;b)$:

$(a+2b)^2=(1\cdot a+2\cdot b)^2\le(1^2+2^2)(a^2+b^2)=5\cdot\dfrac12=\dfrac52$

$\Rightarrow\lvert a+2b\rvert\le\sqrt{\dfrac52}=\dfrac{\sqrt{10}}{2}$

$\Rightarrow-\dfrac{\sqrt{10}}{2}\le a+2b\le\dfrac{\sqrt{10}}{2}$

$\Rightarrow\dfrac{3-\sqrt{10}}{2}\le a+2b+\dfrac32\le\dfrac{3+\sqrt{10}}{2}$.

Dấu "=" xảy ra khi $\dfrac a1=\dfrac b2$, tức $b=2a$; kết hợp $a^2+b^2=\dfrac12$ được $a^2=\dfrac1{10}$, hai giá trị $a=\pm\dfrac{1}{\sqrt{10}}$ ứng với hai đầu của bất đẳng thức.

Vậy $\dfrac{3-\sqrt{10}}{2}\le F\le\dfrac{3+\sqrt{10}}{2}$.

=== C4B2.1@p146
- bai: 1 · y: - · trang: 146 · tang: nang_cao
- nguon_de: Toán học tuổi thơ số 137 + 138
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ x=1/(2a+1) · Bu-nhi-a-cốp-xki dạng phân thức (x²/p+y²/q+z²/r)(p+q+r)≥(x+y+z)² · x²+y²+z²≥(x+y+z)²/3
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in nhầm biến thứ ba là "$a=\dfrac{1-z}{2z}$" (đúng phải là $c=\dfrac{1-z}{2z}$), giữ nguyên ở SACH. Sách không giải thích điều kiện $s<3$ cần cho mẫu $\dfrac9s-2>0$, đã bổ sung.
## DE
(Toán học tuổi thơ số 137 + 138) Cho $a,b,c$ là các số thực dương thỏa mãn $\dfrac{1}{2a+1}+\dfrac{1}{2b+1}+\dfrac{1}{2c+1}\ge1$. Chứng minh rằng: $\dfrac{1}{6a+1}+\dfrac{1}{6b+1}+\dfrac{1}{6c+1}\ge\dfrac37$.
## SACH
Đặt $x=\dfrac{1}{2a+1}$; $y=\dfrac{1}{2b+1}$; $z=\dfrac{1}{2c+1}\Rightarrow a=\dfrac{1-x}{2x}$; $b=\dfrac{1-y}{2y}$; $a=\dfrac{1-z}{2z}$;

Ta thấy theo cách đặt thì $0<x,y,z<1$; $x+y+z\ge1$.

Bất đẳng thức cần chứng minh trở thành: $\dfrac{x}{3-2x}+\dfrac{y}{3-2y}+\dfrac{z}{3-2z}\ge\dfrac37$.

Áp dụng BĐT BunhiaCôpski ta có:

$\dfrac{x}{3-2x}+\dfrac{y}{3-2y}+\dfrac{z}{3-2z}=\dfrac{x^2}{3x-2x^2}+\dfrac{y^2}{3y-2y^2}+\dfrac{z^2}{3z-2z^2}\ge\dfrac{(x+y+z)^2}{3(x+y+z)-2(x^2+y^2+z^2)}$

$\ge\dfrac{(x+y+z)^2}{3(x+y+z)-\dfrac23(x+y+z)^2}=\dfrac{3}{\dfrac{9}{x+y+z}-2}\ge\dfrac37$

Dấu "=" xảy ra $\Leftrightarrow a=b=c=1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết và kết luận đều gồm các phân số dạng $\dfrac{1}{2t+1}$ và $\dfrac{1}{6t+1}$ nên đặt $x=\dfrac1{2a+1}$ để $\dfrac1{6a+1}$ thành $\dfrac{x}{3-2x}=\dfrac{x^2}{3x-2x^2}$, có tử là bình phương, đúng dạng gộp ba phân số của Bu-nhi-a-cốp-xki; dấu "=" xảy ra khi $x=y=z$ và $x+y+z=1$.

**Bước 1.** Đặt $x,y,z$ theo từng biến, rút $a=\dfrac{1-x}{2x}$ để tính $6a+1=\dfrac{3-2x}{x}$, và ghi nhận $0<x,y,z<1$, $x+y+z\ge1$ để đổi cả đề sang bài toán ba biến $x,y,z$.

**Bước 2.** Viết $\dfrac{x}{3-2x}=\dfrac{x^2}{3x-2x^2}$ rồi gộp ba phân số bằng Bu-nhi-a-cốp-xki dạng phân thức (các mẫu $3x-2x^2$ đều dương vì $0<x<1$).

**Bước 3.** Chặn mẫu chung từ trên bằng $x^2+y^2+z^2\ge\dfrac{(x+y+z)^2}{3}$ để bất đẳng thức chỉ còn phụ thuộc $s=x+y+z$.

**Bước 4.** Dùng $1\le s<3$ để chặn $\dfrac9s-2$ từ trên bằng $7$ và suy ra cận dưới $\dfrac37$, rồi đối chiếu dấu "=" với giả thiết.

**Chú ý:** Phải chỉ ra mẫu $3x-2x^2$ và $\dfrac{9}{s}-2$ đều dương thì mới được thay mẫu bằng số lớn hơn (làm phân số nhỏ đi); điều kiện $s<3$ lấy từ $x,y,z<1$.

**Phần 2. Trình bày**

Đặt $x=\dfrac{1}{2a+1}$, $y=\dfrac{1}{2b+1}$, $z=\dfrac{1}{2c+1}$. Vì $a,b,c>0$ nên $0<x,y,z<1$; theo giả thiết $s=x+y+z\ge1$; và $s<3$.

Từ $x=\dfrac{1}{2a+1}$ suy ra $a=\dfrac{1-x}{2x}$, do đó $6a+1=\dfrac{3(1-x)}{x}+1=\dfrac{3-2x}{x}$, tức $\dfrac1{6a+1}=\dfrac{x}{3-2x}$. Tương tự cho $b,c$.

Cần chứng minh $A=\dfrac{x}{3-2x}+\dfrac{y}{3-2y}+\dfrac{z}{3-2z}\ge\dfrac37$.

Vì $0<x<1$ nên $3x-2x^2=x(3-2x)>0$ (tương tự cho $y,z$). Theo bất đẳng thức Bu-nhi-a-cốp-xki: $\left(\dfrac{x^2}{p}+\dfrac{y^2}{q}+\dfrac{z^2}{r}\right)(p+q+r)\ge(x+y+z)^2$ với $p=3x-2x^2$, $q=3y-2y^2$, $r=3z-2z^2$ (dấu "=" khi $\dfrac{x}{p}=\dfrac{y}{q}=\dfrac{z}{r}$, tức $x=y=z$). Ta có

$A=\dfrac{x^2}{3x-2x^2}+\dfrac{y^2}{3y-2y^2}+\dfrac{z^2}{3z-2z^2}\ge\dfrac{(x+y+z)^2}{3(x+y+z)-2(x^2+y^2+z^2)}$

Theo Bu-nhi-a-cốp-xki cho $(1;1;1)$ và $(x;y;z)$: $x^2+y^2+z^2\ge\dfrac{s^2}{3}$, nên $0<3s-2(x^2+y^2+z^2)\le3s-\dfrac23s^2$. Do đó

$A\ge\dfrac{s^2}{3s-\dfrac23s^2}=\dfrac{3s}{9-2s}=\dfrac{3}{\dfrac9s-2}$

Vì $1\le s<3$ nên $\dfrac9s>3$ và $\dfrac9s\le9$, suy ra $0<\dfrac9s-2\le7$, do đó $A\ge\dfrac{3}{7}$.

Dấu "=" xảy ra khi $x=y=z$ và $s=1$, tức $x=y=z=\dfrac13$, ứng với $a=b=c=1$ (thỏa giả thiết).

Vậy $\dfrac{1}{6a+1}+\dfrac{1}{6b+1}+\dfrac{1}{6c+1}\ge\dfrac37$.

=== C4B2.2@p147
- bai: 2 · y: - · trang: 147 · tang: nang_cao
- nguon_de: Chuyên Vĩnh Phúc 2011 – 2012
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhóm hạng tử thành tổng hai tích · Bu-nhi-a-cốp-xki cho hai bộ hai số (ab−1;a+b) và (c+d;cd−1) · (ab−1)²+(a+b)²=(a²+1)(b²+1)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Chuyên Vĩnh Phúc 2011 – 2012) Cho $a,b,c,d$ là các số thực thỏa mãn điều kiện: $abc+bcd+cda+dab=a+b+c+d+\sqrt{2017}$. Chứng minh rằng: $(a^2+1)(b^2+1)(c^2+1)(d^2+1)\ge2017$.
## SACH
Ta có: $2017=(abc+bcd+cda+dab-a-b-c-d)^2$

$=\left((ab-1)(c+d)+(cd-1)(a+b)\right)^2\le\left[(ab-1)^2+(a+b)^2\right]\left[(cd-1)^2+(c+d)^2\right]$.

$=(a^2b^2+a^2+b^2+1)(c^2d^2+c^2+d^2+1)=(a^2+1)(b^2+1)(c^2+1)(d^2+1)$

Suy ra $(a^2+1)(b^2+1)(c^2+1)(d^2+1)\ge2017$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Giả thiết cho $E=abc+bcd+cda+dab-a-b-c-d=\sqrt{2017}$, nên $E^2=2017$, còn vế cần chặn là tích bốn thừa số $a^2+1$ mà $(a^2+1)(b^2+1)=(ab-1)^2+(a+b)^2$ là một tổng hai bình phương; vậy nhóm $E$ thành dạng "tích vô hướng" của hai bộ hai số rồi dùng Bu-nhi-a-cốp-xki.

**Bước 1.** Chuyển vế để có $E=abc+bcd+cda+dab-a-b-c-d$ rồi bình phương, từ giả thiết được $E=\sqrt{2017}$ và $E^2=2017$.

**Bước 2.** Nhóm $E$ theo cặp $(a,b)$ và $(c,d)$: $E=ab(c+d)+cd(a+b)-(a+b)-(c+d)=(ab-1)(c+d)+(cd-1)(a+b)$, để $E$ thành tổng hai tích.

**Bước 3.** Ghép hai bộ số $(ab-1;a+b)$ và $(c+d;cd-1)$ sao cho tích vô hướng của chúng đúng bằng $E$, rồi áp dụng Bu-nhi-a-cốp-xki.

**Bước 4.** Khai triển $(ab-1)^2+(a+b)^2$ và $(cd-1)^2+(c+d)^2$ để nhận ra mỗi tổng là một tích hai thừa số dạng bình phương cộng một.

**Chú ý:** Cách ghép cặp quyết định thành bại: nếu ghép $(ab-1;c+d)$ với $(cd-1;a+b)$ thì tổng bình phương không phân tích được thành tích. Bất đẳng thức đúng với mọi số thực, không cần dương.

**Phần 2. Trình bày**

Từ giả thiết: $abc+bcd+cda+dab-a-b-c-d=\sqrt{2017}$, nên $2017=(abc+bcd+cda+dab-a-b-c-d)^2$.

Mà $abc+bcd+cda+dab-a-b-c-d=ab(c+d)+cd(a+b)-(a+b)-(c+d)=(ab-1)(c+d)+(a+b)(cd-1)$

Do đó $2017=\left[(ab-1)(c+d)+(a+b)(cd-1)\right]^2$

Áp dụng bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ số $(ab-1;a+b)$ và $(c+d;cd-1)$:

$2017\le\left[(ab-1)^2+(a+b)^2\right]\left[(c+d)^2+(cd-1)^2\right]$ (dấu "=" khi hai bộ số tỉ lệ)

Ta có $(ab-1)^2+(a+b)^2=a^2b^2-2ab+1+a^2+2ab+b^2=a^2b^2+a^2+b^2+1=(a^2+1)(b^2+1)$

và tương tự $(cd-1)^2+(c+d)^2=(c^2+1)(d^2+1)$

Suy ra $2017\le(a^2+1)(b^2+1)(c^2+1)(d^2+1)$.

Vậy $(a^2+1)(b^2+1)(c^2+1)(d^2+1)\ge2017$.

=== C4B2.3@p147
- bai: 3 · y: - · trang: 147 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki cho (a²/√(b+c);…) và (a√(b+c);…) · xét hiệu a³+b³−a²b−ab²=(a+b)(a−b)²
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho các số dương $a,b,c$ thỏa mãn $a^3+b^3+c^3=2$. Chứng minh rằng: $\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}\ge1$.
## SACH
Đặt $P=\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}$.

Áp dụng BĐT Bunhiacopsky ta được:

$\left(\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}\right)\left[a^2(b+c)+b^2(c+a)+c^2(a+b)\right]\ge(a^3+b^3+c^3)^2$

Do đó:

$P\ge\dfrac{(a^3+b^3+c^3)^2}{a^2(b+c)+b^2(c+a)+c^2(a+b)}=\dfrac{2(a^3+b^3+c^3)}{a^2(b+c)+b^2(c+a)+c^2(a+b)}$

Chứng minh $2(a^3+b^3+c^3)\ge a^2(b+c)+b^2(c+a)+c^2(a+b)$

$\Leftrightarrow(a-b)^2(a+b)+(b-c)^2(b+c)+(c-a)^2(c+a)\ge0$ luôn đúng.

Vậy $P=\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}\ge1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi phân số có tử $a^4=(a^2)^2$ là bình phương, nên ghép nó với $a^2(b+c)$ để tích từng cặp căn là $a^3$; Bu-nhi-a-cốp-xki khi đó cho ra đúng $(a^3+b^3+c^3)^2$, tức xuất hiện giả thiết $a^3+b^3+c^3=2$.

**Bước 1.** Chọn hai bộ ba số $\left(\dfrac{a^2}{\sqrt{b+c}};\dfrac{b^2}{\sqrt{c+a}};\dfrac{c^2}{\sqrt{a+b}}\right)$ và $\left(a\sqrt{b+c};b\sqrt{c+a};c\sqrt{a+b}\right)$, sao cho tích hai số tương ứng bằng $a^3,b^3,c^3$ và mẫu $b+c$ bị triệt tiêu.

**Bước 2.** Áp dụng Bu-nhi-a-cốp-xki để chặn dưới $P$ bởi $\dfrac{(a^3+b^3+c^3)^2}{a^2(b+c)+b^2(c+a)+c^2(a+b)}$ rồi thay giả thiết $a^3+b^3+c^3=2$ vào một nhân tử của tử số.

**Bước 3.** Quy việc chứng minh $P\ge1$ về bất đẳng thức $2(a^3+b^3+c^3)\ge a^2(b+c)+b^2(c+a)+c^2(a+b)$ (cùng bậc 3, không còn mẫu).

**Bước 4.** Chứng minh bất đẳng thức đó bằng cách ghép từng cặp $a^3+b^3-a^2b-ab^2=(a+b)(a-b)^2\ge0$ rồi cộng vòng quanh, và tìm dấu "=" khi ba số bằng nhau.

**Chú ý:** Đừng ghép $a^4$ với $b+c$ trực tiếp bằng $(1+1+1)$; phải chọn bộ thứ hai là $a\sqrt{b+c}$ để tích ra $a^3$ khớp với giả thiết bậc ba.

**Phần 2. Trình bày**

Đặt $P=\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}$ và $Q=a^2(b+c)+b^2(c+a)+c^2(a+b)>0$.

Áp dụng bất đẳng thức Bu-nhi-a-cốp-xki cho hai bộ ba số $\left(\dfrac{a^2}{\sqrt{b+c}};\dfrac{b^2}{\sqrt{c+a}};\dfrac{c^2}{\sqrt{a+b}}\right)$ và $\left(a\sqrt{b+c};b\sqrt{c+a};c\sqrt{a+b}\right)$:

$P\cdot Q\ge(a^3+b^3+c^3)^2=2(a^3+b^3+c^3)$ (dấu "=" khi $\dfrac{a}{b+c}=\dfrac{b}{c+a}=\dfrac{c}{a+b}$)

Suy ra $P\ge\dfrac{2(a^3+b^3+c^3)}{Q}$.

Mà $2(a^3+b^3+c^3)-Q=(a^3+b^3-a^2b-ab^2)+(b^3+c^3-b^2c-bc^2)+(c^3+a^3-c^2a-ca^2)$

$=(a+b)(a-b)^2+(b+c)(b-c)^2+(c+a)(c-a)^2\ge0$

nên $2(a^3+b^3+c^3)\ge Q$, do đó $P\ge1$.

Dấu "=" xảy ra khi $a=b=c$ (khi đó $\dfrac{a}{b+c}$ bằng nhau và cả ba hiệu trên bằng $0$), với $3a^3=2$.

Vậy $\dfrac{a^4}{b+c}+\dfrac{b^4}{c+a}+\dfrac{c^4}{a+b}\ge1$.

=== C4B2.4@p148
- bai: 4 · y: - · trang: 148 · tang: nang_cao
- nguon_de: Toán học & Tuổi trẻ số 396
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Bu-nhi-a-cốp-xki cho (1;1) và (b;c) · làm trội mẫu · cộng thêm 3 để đồng nhất tử · hệ quả Cô-si ba số (m+n+p)(1/m+1/n+1/p)≥9
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
(Toán học & Tuổi trẻ số 396) Cho $a,b,c$ là các số thực khác $0$. Chứng minh rằng $T=\dfrac{a^2}{a^2+(b+c)^2}+\dfrac{b^2}{b^2+(a+c)^2}+\dfrac{c^2}{c^2+(b+a)^2}\ge\dfrac35$.
## SACH
Áp dụng BĐT BunhiaCôpski cho 2 số $(1;1)$ và $(b;c)$ ta có: $(b+c)^2\le2(b^2+c^2)$.

Áp dụng BĐT BunhiaCôpski cho 2 số $(1;1)$ và $(a;c)$ ta có: $(a+c)^2\le2(a^2+c^2)$.

Áp dụng BĐT BunhiaCôpski cho 2 số $(1;1)$ và $(a;b)$ ta có: $(a+b)^2\le2(a^2+b^2)$.

Ta có: $T\ge\dfrac{a^2}{a^2+2(b^2+c^2)}+\dfrac{b^2}{b^2+2(a^2+c^2)}+\dfrac{c^2}{c^2+2(a^2+b^2)}$.

Hay $T+3\ge\left(\dfrac{a^2}{a^2+2(b^2+c^2)}+1\right)+\left(\dfrac{b^2}{b^2+2(a^2+c^2)}+1\right)+\left(\dfrac{c^2}{c^2+2(a^2+b^2)}+1\right)$.

Nên $T+3\ge\dfrac25\cdot5(a^2+b^2+c^2)\left(\dfrac{1}{a^2+2(b^2+c^2)}+\dfrac{1}{b^2+2(a^2+c^2)}+\dfrac{1}{c^2+2(a^2+b^2)}\right)$

Tiếp tục ta áp dụng BĐT $(m+n+p)\left(\dfrac1m+\dfrac1n+\dfrac1p\right)\ge9$ với $m,n,p$ là các số dương.

Ta suy ra: $T+3\ge\dfrac25\cdot9\Rightarrow T\ge\dfrac35$. Dấu bằng xảy ra khi và chỉ khi $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $a^2+(b+c)^2$ chứa bình phương của một tổng, làm trội bằng Bu-nhi-a-cốp-xki $(b+c)^2\le2(b^2+c^2)$ để mẫu chỉ còn bình phương từng biến; rồi cộng thêm $3=1+1+1$ để mỗi phân số có tử chung $2(a^2+b^2+c^2)$, khi đó tổng nghịch đảo ba mẫu bị chặn bởi hệ quả Cô-si ba số.

**Bước 1.** Chặn $(b+c)^2\le2(b^2+c^2)$ (và hai bất đẳng thức hoán vị) bằng Bu-nhi-a-cốp-xki cho $(1;1)$ và $(b;c)$, thay vào mẫu để làm giảm từng phân số, được $T$ lớn hơn hoặc bằng tổng ba phân số có mẫu chỉ chứa $a^2,b^2,c^2$.

**Bước 2.** Cộng $3=1+1+1$ vào hai vế, mỗi số 1 gộp với một phân số, và nhận ra rằng tử mỗi phân số mới đều là $2(a^2+b^2+c^2)$ vì mẫu bằng $a^2+2(b^2+c^2)$ cộng với $a^2$.

**Bước 3.** Đặt ba mẫu là $m,n,p$ (dương), tính $m+n+p=5(a^2+b^2+c^2)$ rồi dùng hệ quả Cô-si ba số $(m+n+p)\left(\dfrac1m+\dfrac1n+\dfrac1p\right)\ge9$ để chặn dưới tổng nghịch đảo.

**Bước 4.** Thay vào đánh giá ở bước 2 để $T+3$ được chặn dưới bởi một hằng số, trừ $3$ ra $T$, rồi kiểm tra dấu "=" khi $a=b=c$.

**Chú ý:** Điều kiện $a,b,c\ne0$ đảm bảo mọi mẫu dương; mỗi lần làm trội mẫu, phân số tăng lên nên chiều bất đẳng thức giữ nguyên là $T\ge\cdots$.

**Phần 2. Trình bày**

Vì $a,b,c\ne0$ nên các mẫu dưới đây đều dương.

Theo bất đẳng thức Bu-nhi-a-cốp-xki cho $(1;1)$ và $(b;c)$: $(b+c)^2\le2(b^2+c^2)$ (dấu "=" khi $b=c$); tương tự $(c+a)^2\le2(c^2+a^2)$, $(a+b)^2\le2(a^2+b^2)$.

Mẫu lớn lên làm phân số nhỏ đi, nên

$T\ge\dfrac{a^2}{a^2+2(b^2+c^2)}+\dfrac{b^2}{b^2+2(c^2+a^2)}+\dfrac{c^2}{c^2+2(a^2+b^2)}$

Đặt $S=a^2+b^2+c^2$, $m=a^2+2(b^2+c^2)$, $n=b^2+2(c^2+a^2)$, $p=c^2+2(a^2+b^2)$. Khi đó $m,n,p>0$, $m+n+p=5S$ và $a^2+m=b^2+n=c^2+p=2S$.

Cộng $3$ vào hai vế:

$T+3\ge\dfrac{a^2+m}{m}+\dfrac{b^2+n}{n}+\dfrac{c^2+p}{p}=2S\left(\dfrac1m+\dfrac1n+\dfrac1p\right)$

Theo hệ quả của bất đẳng thức Cô-si cho ba số dương $m,n,p$: $(m+n+p)\left(\dfrac1m+\dfrac1n+\dfrac1p\right)\ge9$ (dấu "=" khi $m=n=p$), nên $\dfrac1m+\dfrac1n+\dfrac1p\ge\dfrac{9}{5S}$.

Suy ra $T+3\ge2S\cdot\dfrac{9}{5S}=\dfrac{18}{5}$, do đó $T\ge\dfrac{18}{5}-3=\dfrac35$.

Dấu "=" xảy ra khi $b=c$, $c=a$, $a=b$ và $m=n=p$, tức $a=b=c$.

Vậy $\dfrac{a^2}{a^2+(b+c)^2}+\dfrac{b^2}{b^2+(a+c)^2}+\dfrac{c^2}{c^2+(b+a)^2}\ge\dfrac35$.

=== C4V4.1@p149
- bai: VD1 · y: - · trang: 149 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm giảm: thay mỗi mẫu bằng mẫu chung lớn hơn a+b+c+d
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho các số dương $a,b,c,d$. Chứng minh rằng: $\dfrac{a}{b+c+d}+\dfrac{b}{c+d+a}+\dfrac{c}{d+a+b}+\dfrac{d}{a+b+c}>1$.
## SACH
Vì $a,b,c,d$ là các số dương nên: $b+c+d<a+b+c+d$;

$c+d+a<a+b+c+d$; $d+a+b<a+b+c+d$; $a+b+c<a+b+c+d$

Ta có: $\dfrac{a}{b+c+d}>\dfrac{a}{a+b+c+d}$; $\dfrac{b}{c+d+a}>\dfrac{b}{a+b+c+d}$; $\dfrac{c}{d+a+b}>\dfrac{c}{a+b+c+d}$; $\dfrac{d}{a+b+c}>\dfrac{d}{a+b+c+d}$. Cộng các vế tương ứng của các bất đẳng thức trên ta có:

$\dfrac{a}{b+c+d}+\dfrac{b}{c+d+a}+\dfrac{c}{d+a+b}+\dfrac{d}{a+b+c}>\dfrac{a}{a+b+c+d}+\dfrac{b}{a+b+c+d}+\dfrac{c}{a+b+c+d}+\dfrac{d}{a+b+c+d}=\dfrac{a+b+c+d}{a+b+c+d}=1$

Vậy $\dfrac{a}{b+c+d}+\dfrac{b}{c+d+a}+\dfrac{c}{d+a+b}+\dfrac{d}{a+b+c}>1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi mẫu là tổng của ba trong bốn số nên nhỏ hơn $S=a+b+c+d$; thay mẫu bằng $S$ (lớn hơn) làm mỗi phân số nhỏ đi, và bốn tử $a,b,c,d$ cộng lại đúng bằng $S$, nên tổng mới bằng $1$ đúng bằng cận cần chứng minh.

**Bước 1.** Đặt $S=a+b+c+d$ và nhận xét mỗi mẫu như $b+c+d$ kém $S$ đúng một số dương (ở đây là $a$), nên mẫu nào cũng nhỏ hơn $S$.

**Bước 2.** Với tử dương, mẫu lớn hơn thì phân số nhỏ hơn: so sánh từng phân số của đề với phân số cùng tử mà mẫu là $S$ để được bốn bất đẳng thức cùng chiều.

**Bước 3.** Cộng bốn bất đẳng thức; vế phải gồm các phân số cùng mẫu $S$ nên cộng tử thành $a+b+c+d$ và tổng bằng $1$.

**Chú ý:** Bất đẳng thức ngặt vì $a,b,c,d>0$ làm mọi mẫu nhỏ hơn $S$ thật sự; nếu làm ngược lại (thay mẫu bằng số nhỏ hơn) thì chiều bất đẳng thức đổi.

**Phần 2. Trình bày**

Vì $a,b,c,d>0$ nên $b+c+d<S$, $c+d+a<S$, $d+a+b<S$, $a+b+c<S$ với $S=a+b+c+d$.

Do đó $\dfrac{a}{b+c+d}>\dfrac{a}{S}$, $\dfrac{b}{c+d+a}>\dfrac{b}{S}$, $\dfrac{c}{d+a+b}>\dfrac{c}{S}$, $\dfrac{d}{a+b+c}>\dfrac{d}{S}$.

Cộng bốn bất đẳng thức: $\dfrac{a}{b+c+d}+\dfrac{b}{c+d+a}+\dfrac{c}{d+a+b}+\dfrac{d}{a+b+c}>\dfrac{a+b+c+d}{S}=1$.

Vậy $\dfrac{a}{b+c+d}+\dfrac{b}{c+d+a}+\dfrac{c}{d+a+b}+\dfrac{d}{a+b+c}>1$.

=== C4V4.2@p149
- bai: VD2 · y: - · trang: 149 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội: thay mỗi mẫu bằng mẫu chung nhỏ hơn a+b
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho các số dương $a,b$. Chứng minh: $\dfrac{a}{2a+b}+\dfrac{b}{2b+a}<1$.
## SACH
Do $a,b$ là các số dương $\Rightarrow2a+b>a+b$ và $2b+a>a+b$

$\Rightarrow\dfrac{a}{2a+b}<\dfrac{a}{a+b}$; $\dfrac{b}{2b+a}<\dfrac{b}{a+b}$. Cộng các vế tương ứng của các bất đẳng thức trên ta có: $\dfrac{a}{2a+b}+\dfrac{b}{2b+a}<\dfrac{a}{a+b}+\dfrac{b}{a+b}=\dfrac{a+b}{a+b}=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai mẫu $2a+b$ và $2b+a$ cùng lớn hơn $a+b$; thay cả hai bằng mẫu chung $a+b$ (nhỏ hơn) làm mỗi phân số lớn lên, và hai tử $a,b$ cộng thành đúng $a+b$ nên tổng mới bằng $1$.

**Bước 1.** So sánh từng mẫu với $a+b$: $2a+b$ hơn $a+b$ đúng $a>0$, còn $2b+a$ hơn $a+b$ đúng $b>0$.

**Bước 2.** Với tử dương, mẫu nhỏ đi thì phân số lớn lên, nên mỗi phân số của đề nhỏ hơn phân số cùng tử mà mẫu là $a+b$.

**Bước 3.** Cộng hai bất đẳng thức, gộp hai phân số cùng mẫu $a+b$ để được tổng bằng $1$.

**Chú ý:** Chiều đánh giá cần là "nhỏ hơn", nên phải làm TRỘI từng phân số (thay mẫu bằng số nhỏ hơn), không phải làm giảm như ở bài tổng lớn hơn $1$.

**Phần 2. Trình bày**

Vì $a,b>0$ nên $2a+b>a+b>0$ và $2b+a>a+b>0$.

Do đó $\dfrac{a}{2a+b}<\dfrac{a}{a+b}$ và $\dfrac{b}{2b+a}<\dfrac{b}{a+b}$.

Cộng hai bất đẳng thức: $\dfrac{a}{2a+b}+\dfrac{b}{2b+a}<\dfrac{a+b}{a+b}=1$.

Vậy $\dfrac{a}{2a+b}+\dfrac{b}{2b+a}<1$.

=== C4V4.3@p150
- bai: VD3 · y: - · trang: 150 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội, làm giảm kẹp giữa hai phân số cùng mẫu a+b+c+d · tính chất: nếu m/n<1 thì m/n<(m+t)/(n+t) (n,t>0)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho $a,b,c,d>0$. Chứng minh rằng: $1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2$.
## SACH
Theo tính chất của tỉ lệ thức ta có $\dfrac{a}{a+b+c}<1\Rightarrow\dfrac{a}{a+b+c}<\dfrac{a+d}{a+b+c+d}$ (1)

Mặt khác: $\dfrac{a}{a+b+c}>\dfrac{a}{a+b+c+d}$ (2)

Từ (1) và (2) ta có $\dfrac{a}{a+b+c+d}<\dfrac{a}{a+b+c}<\dfrac{a+d}{a+b+c+d}$ (3)

Tương tự ta có: $\dfrac{b}{a+b+c+d}<\dfrac{b}{b+c+d}<\dfrac{b+a}{a+b+c+d}$ (4)

$\dfrac{c}{a+b+c+d}<\dfrac{c}{c+d+a}<\dfrac{b+c}{a+b+c+d}$ (5)

$\dfrac{d}{a+b+c+d}<\dfrac{d}{d+a+b}<\dfrac{d+c}{a+b+c+d}$ (6)

Cộng vế với vế của (3); (4); (5); (6) ta có:

$1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2$ (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi phân số có mẫu thiếu đúng một biến so với $S=a+b+c+d$ nên bị kẹp giữa phân số cùng tử mà mẫu là $S$ (làm giảm, cho cận $1$) và phân số có tử tăng thêm biến còn thiếu cùng mẫu $S$ (làm trội, cho cận $2$ vì mỗi biến xuất hiện hai lần ở các tử).

**Bước 1.** Làm giảm: mẫu $a+b+c$ nhỏ hơn $S$ nên $\dfrac{a}{a+b+c}>\dfrac{a}{S}$; viết tương tự cho ba phân số còn lại rồi cộng để được vế trái $>1$.

**Bước 2.** Làm trội: phân số $\dfrac{a}{a+b+c}<1$, nên cộng thêm biến còn thiếu $d>0$ vào cả tử và mẫu thì phân số tăng: $\dfrac{a}{a+b+c}<\dfrac{a+d}{S}$.

**Bước 3.** Viết bất đẳng thức làm trội cho cả bốn phân số, mỗi phân số thêm đúng biến thiếu trong mẫu của nó, để các mẫu mới đều là $S$.

**Bước 4.** Cộng bốn bất đẳng thức làm trội: tử ở vế phải là $(a+d)+(b+a)+(c+b)+(d+c)=2S$, nên tổng nhỏ hơn $2$.

**Chú ý:** Chỉ được cộng thêm $t>0$ vào cả tử và mẫu để làm tăng phân số khi phân số đó nhỏ hơn $1$; nếu phân số lớn hơn $1$ thì phân số giảm đi.

**Phần 2. Trình bày**

Đặt $S=a+b+c+d$.

Vế trái: vì $a,b,c,d>0$ nên $a+b+c<S$, $b+c+d<S$, $c+d+a<S$, $d+a+b<S$. Do đó $\dfrac{a}{a+b+c}>\dfrac{a}{S}$, $\dfrac{b}{b+c+d}>\dfrac{b}{S}$, $\dfrac{c}{c+d+a}>\dfrac{c}{S}$, $\dfrac{d}{d+a+b}>\dfrac{d}{S}$ (2)

Cộng bốn bất đẳng thức ở (2): tổng đã cho $>\dfrac{a+b+c+d}{S}=1$.

Vế phải: vì $\dfrac{a}{a+b+c}<1$ và $d>0$ nên $\dfrac{a}{a+b+c}<\dfrac{a+d}{a+b+c+d}$ (thật vậy, hiệu $\dfrac{a}{a+b+c}-\dfrac{a+d}{S}=\dfrac{-d(b+c)}{(a+b+c)S}<0$).

Tương tự: $\dfrac{b}{b+c+d}<\dfrac{b+a}{S}$, $\dfrac{c}{c+d+a}<\dfrac{c+b}{S}$, $\dfrac{d}{d+a+b}<\dfrac{d+c}{S}$ (vì mỗi phân số đều nhỏ hơn $1$).

Cộng bốn bất đẳng thức: tổng đã cho $<\dfrac{(a+d)+(b+a)+(c+b)+(d+c)}{S}=\dfrac{2S}{S}=2$.

Vậy $1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2$.

=== C4V4.4@p150
- bai: VD4 · y: - · trang: 150 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tính chất phân số trung gian: m/n<p/q (n,q>0) thì m/n<(m+p)/(n+q)<p/q · quy đồng, nhân chéo
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho: $\dfrac ab<\dfrac cd$ và $b,d>0$. Chứng minh rằng: $\dfrac ab<\dfrac{ab+cd}{b^2+d^2}<\dfrac cd$.
## SACH
Từ $\dfrac ab<\dfrac cd\Rightarrow\dfrac{ab}{b^2}<\dfrac{cd}{d^2}\Rightarrow\dfrac{ab}{b^2}<\dfrac{ab+cd}{b^2+d^2}<\dfrac{cd}{d^2}=\dfrac cd$

$\Rightarrow\dfrac ab<\dfrac{ab+cd}{b^2+d^2}<\dfrac cd$ (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $\dfrac{ab+cd}{b^2+d^2}$ có tử và mẫu bằng tổng tử và tổng mẫu của hai phân số $\dfrac{ab}{b^2}=\dfrac ab$ và $\dfrac{cd}{d^2}=\dfrac cd$, nên là "phân số trung gian" của chúng: nó nằm giữa hai phân số ấy theo tính chất $\dfrac mn<\dfrac pq\Rightarrow\dfrac mn<\dfrac{m+p}{n+q}<\dfrac pq$.

**Bước 1.** Nhận ra $\dfrac ab=\dfrac{ab}{b^2}$ và $\dfrac cd=\dfrac{cd}{d^2}$ (nhân cả tử và mẫu với $b$, $d$ khác $0$), để biểu thức giữa là phân số có tử và mẫu là tổng của tử và mẫu hai phân số này.

**Bước 2.** Phát biểu và chứng minh tính chất phân số trung gian bằng nhân chéo khi $n,q>0$: từ $mq<np$ suy ra hai bất đẳng thức cần có.

**Bước 3.** Áp dụng tính chất với $m=ab$, $n=b^2$, $p=cd$, $q=d^2$; các mẫu $b^2,d^2$ dương nên đúng điều kiện.

**Chú ý:** Tính chất không cần $m,p$ dương, chỉ cần các mẫu dương; đề không cho $a,c>0$ nên không được tự giả định điều đó.

**Phần 2. Trình bày**

Trước hết, với $n,q>0$ và $\dfrac mn<\dfrac pq$ thì $mq<np$ và

$m(n+q)=mn+mq<mn+np=n(m+p)$, suy ra $\dfrac mn<\dfrac{m+p}{n+q}$;

$p(n+q)=pn+pq>mq+pq=q(m+p)$, suy ra $\dfrac{m+p}{n+q}<\dfrac pq$.

Vậy $\dfrac mn<\dfrac{m+p}{n+q}<\dfrac pq$ (*).

Vì $b,d>0$ nên $\dfrac ab=\dfrac{ab}{b^2}$ và $\dfrac cd=\dfrac{cd}{d^2}$, và từ $\dfrac ab<\dfrac cd$ ta có $\dfrac{ab}{b^2}<\dfrac{cd}{d^2}$.

Áp dụng (*) với $m=ab$, $n=b^2>0$, $p=cd$, $q=d^2>0$:

$\dfrac{ab}{b^2}<\dfrac{ab+cd}{b^2+d^2}<\dfrac{cd}{d^2}$

tức là $\dfrac ab<\dfrac{ab+cd}{b^2+d^2}<\dfrac cd$.

=== C4V4.5@p151
- bai: VD5 · y: - · trang: 151 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Cô-si hai số u²+v²≥2uv (dấu "=" khi u=v) · làm trội · tách hiệu 1/(k(k+1))=1/k−1/(k+1) · khử liên tiếp
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Chứng minh rằng: $\dfrac15+\dfrac1{13}+\dots+\dfrac{1}{2016^2+2017^2}<\dfrac12$.
## SACH
Nhận xét: $\dfrac15=\dfrac{1}{1^2+2^2}$; $\dfrac1{13}=\dfrac{1}{2^2+3^2}$ ...

Do đó số hạng tổng quát có dạng: $\dfrac{1}{k^2+(k+1)^2}$.

Áp dụng bất đẳng thức cô-si cho hai số không âm ta có: $k^2+(k+1)^2>2k(k+1)$

$\Rightarrow\dfrac{1}{k^2+(k+1)^2}<\dfrac{1}{2k(k+1)}=\dfrac12\left(\dfrac1k-\dfrac1{k+1}\right)$.

Áp dụng kết quả trên cho $k=1,2,3,\dots,2016$ ta có

$\dfrac15+\dfrac1{13}+\dots+\dfrac{1}{2016^2+2017^2}<\dfrac12\left(1-\dfrac12+\dfrac12-\dfrac13+\dots+\dfrac1{2015}-\dfrac1{2016}+\dfrac1{2016}-\dfrac1{2017}\right)<\dfrac12$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các mẫu $5=1^2+2^2$, $13=2^2+3^2$, ..., $2016^2+2017^2$ cho thấy số hạng tổng quát là $\dfrac{1}{k^2+(k+1)^2}$; mẫu này lớn hơn $2k(k+1)$ nên số hạng được làm trội thành $\dfrac12\left(\dfrac1k-\dfrac1{k+1}\right)$ và tổng khử liên tiếp.

**Bước 1.** Viết các mẫu đầu thành tổng hai bình phương liên tiếp để đoán số hạng tổng quát $\dfrac{1}{k^2+(k+1)^2}$ và xác định $k$ chạy từ $1$ đến $2016$ (số hạng cuối là $k=2016$).

**Bước 2.** Làm trội mẫu: $k^2+(k+1)^2\ge2k(k+1)$ theo Cô-si cho hai số $k^2$ và $(k+1)^2$ (không bằng nhau nên bất đẳng thức ngặt), suy ra số hạng nhỏ hơn $\dfrac{1}{2k(k+1)}$.

**Bước 3.** Tách $\dfrac{1}{2k(k+1)}=\dfrac12\left(\dfrac1k-\dfrac1{k+1}\right)$ để khi cộng theo $k$ thì các hạng tử liên tiếp triệt tiêu, chỉ còn đầu và cuối.

**Bước 4.** Cộng các bất đẳng thức, rút gọn tổng khử liên tiếp và so sánh kết quả với $\dfrac12$.

**Chú ý:** Phải đúng $k$ chạy tới $2016$ (vì số hạng cuối là $2016^2+2017^2$), nếu nhầm thành $2017$ thì cận cuối khác.

**Phần 2. Trình bày**

Ta có $\dfrac15=\dfrac1{1^2+2^2}$, $\dfrac1{13}=\dfrac{1}{2^2+3^2}$, ..., nên tổng cần xét là $A=\sum_{k=1}^{2016}\dfrac{1}{k^2+(k+1)^2}$.

Theo bất đẳng thức Cô-si cho hai số dương $k^2$ và $(k+1)^2$: $k^2+(k+1)^2\ge2k(k+1)$, dấu "=" khi $k=k+1$, vô lý nên $k^2+(k+1)^2>2k(k+1)$.

Suy ra $\dfrac{1}{k^2+(k+1)^2}<\dfrac{1}{2k(k+1)}=\dfrac12\left(\dfrac1k-\dfrac1{k+1}\right)$.

Cho $k=1,2,\dots,2016$ rồi cộng lại:

$A<\dfrac12\left(1-\dfrac12+\dfrac12-\dfrac13+\dots+\dfrac1{2016}-\dfrac1{2017}\right)=\dfrac12\left(1-\dfrac1{2017}\right)<\dfrac12$.

Vậy $\dfrac15+\dfrac1{13}+\dots+\dfrac{1}{2016^2+2017^2}<\dfrac12$.

=== C4B4.1@p151
- bai: 1 · y: - · trang: 151 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tính chất phân số trung gian m/n≤p/q thì m/n≤(m+p)/(n+q)≤p/q · làm trội b/d≤b (d≥1) · xét hai trường hợp theo b · giả sử không mất tổng quát (đối xứng hoán đổi (a,c) với (b,d))
- kiem: khong
- ket_qua_sach: 999+\dfrac{1}{999}
- dap_an: $GTLN=999+\dfrac{1}{999}$ khi $a=d=1$, $b=c=999$ hoặc $a=d=999$, $b=c=1$
- ghi_chu_nghi: Sách in "Nếu $b=998$ thì $a=1$" ở ý b); đúng phải là $b=999$ (vì $a+b=1000$) — biểu thức ngay sau đó ($\dfrac1c+\dfrac{999}{d}$) cũng dùng $b=999$. Lời giải ở GIAI theo bản đúng. Sách chỉ nêu cặp nghiệm $a=d=1$, $b=c=999$, bỏ cặp đối xứng.
## DE
Cho $a;b;c;d$ là các số nguyên dương thỏa mãn: $a+b=c+d=1000$. Tìm giá trị lớn nhất của $\dfrac ac+\dfrac bd$.
## SACH
Không mất tính tổng quát ta giả sử: $\dfrac ac\le\dfrac bd\Rightarrow\dfrac ac\le\dfrac{a+b}{c+d}\le\dfrac bd$;

$\dfrac ac\le1$ vì $a+b=c+d$.

a) Nếu: $b\le998$ thì $\dfrac bd\le998\Rightarrow\dfrac ac+\dfrac bd\le999$

b) Nếu: $b=998$ thì $a=1\Rightarrow\dfrac ac+\dfrac bd=\dfrac1c+\dfrac{999}{d}$

Đạt giá trị lớn nhất khi $d=1$; $c=999$

Vậy: giá trị lớn nhất của $\dfrac ac+\dfrac bd=999+\dfrac1{999}$ khi $a=d=1$; $c=b=999$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai phân số có tổng tử bằng tổng mẫu ($a+b=c+d=1000$) nên phân số nhỏ hơn bị chặn bởi phân số trung gian $\dfrac{a+b}{c+d}=1$; vì thế tổng lớn nhất khi phân số còn lại lớn nhất, tức tử $b$ lớn và mẫu $d$ nhỏ.

**Bước 1.** Nhận ra biểu thức và hai điều kiện đều không đổi khi hoán đổi cặp $(a,c)$ với $(b,d)$, nên được phép giả sử $\dfrac ac\le\dfrac bd$.

**Bước 2.** Dùng tính chất phân số trung gian để chặn $\dfrac ac\le\dfrac{a+b}{c+d}=1$, rồi chặn phân số kia bằng $\dfrac bd\le b$ vì $d\ge1$ và $b\le999$ vì $a\ge1$.

**Bước 3.** Chia hai trường hợp theo $b$: trường hợp $b\le998$ cho một cận chung, còn $b=999$ (kéo theo $a=1$) phải tính riêng vì cận của trường hợp đầu không còn đúng.

**Bước 4.** Trong trường hợp $b=999$, so sánh hai khả năng $d=1$ và $d\ge2$ để tìm giá trị lớn nhất, rồi chỉ ra bộ $(a,b,c,d)$ làm tổng đạt giá trị đó.

**Chú ý:** Cận $999$ ở trường hợp $b\le998$ nhỏ hơn giá trị thật của trường hợp $b=999$ chỉ một chút, nên không được bỏ sót trường hợp $b=999$; và phải kiểm tra bộ số đạt giá trị lớn nhất thỏa mọi điều kiện nguyên dương.

**Phần 2. Trình bày**

Đổi chỗ cặp $(a,c)$ cho cặp $(b,d)$ thì biểu thức và điều kiện $a+b=c+d=1000$ không đổi, nên có thể giả sử $\dfrac ac\le\dfrac bd$.

Vì $c,d>0$: từ $ad\le bc$ suy ra $a(c+d)=ac+ad\le ac+bc=c(a+b)$, tức $\dfrac ac\le\dfrac{a+b}{c+d}=\dfrac{1000}{1000}=1$ (1)

Vì $a\ge1$ nên $b=1000-a\le999$; vì $d\ge1$ nên $\dfrac bd\le b$.

Trường hợp 1: $b\le998$. Khi đó $\dfrac bd\le998$, kết hợp (1): $\dfrac ac+\dfrac bd\le1+998=999$.

Trường hợp 2: $b=999$, khi đó $a=1$ và $\dfrac ac+\dfrac bd=\dfrac1c+\dfrac{999}{d}$ với $c+d=1000$, $c,d\ge1$.

Nếu $d\ge2$ thì $\dfrac1c\le1$ và $\dfrac{999}{d}\le\dfrac{999}{2}$, nên tổng $\le1+\dfrac{999}{2}<999$.

Nếu $d=1$ thì $c=999$ và tổng bằng $\dfrac1{999}+999$.

Tổng hợp hai trường hợp: $\dfrac ac+\dfrac bd\le999+\dfrac1{999}$ với mọi bộ số thỏa đề (có giả sử ở đầu), và dấu "=" đạt khi $a=d=1$, $b=c=999$ (thỏa $a+b=c+d=1000$, các số nguyên dương, $\dfrac ac=\dfrac1{999}\le\dfrac bd=999$). Nếu không giả sử, bộ đối xứng $a=d=999$, $b=c=1$ cho cùng giá trị.

Vậy $GTLN=999+\dfrac{1}{999}$, đạt khi $a=d=1$, $b=c=999$ (hoặc $a=d=999$, $b=c=1$).

=== C4B4.2@p151
- bai: 2 · y: - · trang: 151 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: làm giảm từng số hạng 1/(n+k)≥1/(2n) · ghép số hạng đối xứng 1/j+1/(3n+1−j) · làm trội tích mẫu j(3n+1−j)≥2n(n+1)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ chứng minh vế trái ($>\dfrac12$); vế phải ($<\dfrac34$) sách không có. GIAI tự giải vế phải bằng cách ghép số hạng đối xứng.
## DE
Với mọi số tự nhiên $n>1$ chứng minh rằng: $\dfrac12<\dfrac{1}{n+1}+\dfrac{1}{n+2}+\dots+\dfrac{1}{n+n}<\dfrac34$.
## SACH
Ta có $\dfrac{1}{n+k}>\dfrac{1}{n+n}=\dfrac{1}{2n}$ với $k=1,2,3,\dots,n-1$.

Do đó: $\dfrac{1}{n+1}+\dfrac{1}{n+2}+\dots+\dfrac{1}{2n}>\dfrac{1}{2n}+\dots+\dfrac{1}{2n}=\dfrac{n}{2n}=\dfrac12$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tổng $S$ có $n$ số hạng giảm dần từ $\dfrac1{n+1}$ đến $\dfrac1{2n}$, nên vế trái được làm giảm bằng số hạng nhỏ nhất $\dfrac1{2n}$ cho cả $n$ số hạng; vế phải cần ghép số hạng đầu với số hạng cuối (tổng hai mẫu luôn bằng $3n+1$) rồi làm trội tích hai mẫu.

**Bước 1.** Vế trái: nhận xét mỗi mẫu $n+k\le2n$ nên mỗi số hạng $\ge\dfrac1{2n}$, và vì $n>1$ nên số hạng đầu $\dfrac1{n+1}>\dfrac1{2n}$ thật sự, do đó tổng $>n\cdot\dfrac1{2n}$.

**Bước 2.** Vế phải: gộp số hạng $\dfrac1j$ với số hạng $\dfrac1{3n+1-j}$ (khi $j$ chạy từ $n+1$ đến $2n$ thì $3n+1-j$ cũng chạy đúng các giá trị đó), để $2S$ thành tổng của $n$ cặp có tổng mẫu không đổi $3n+1$.

**Bước 3.** Chứng minh tích $j(3n+1-j)\ge2n(n+1)$ bằng cách đưa hiệu về dạng $-(j-n-1)(j-2n)$, không âm vì $j$ nằm giữa $n+1$ và $2n$, để làm trội mỗi cặp bằng một hằng số.

**Bước 4.** Cộng $n$ cặp, rút ra $S\le\dfrac{3n+1}{4(n+1)}$ rồi so sánh với $\dfrac34$.

**Chú ý:** Cách ghép trên không phụ thuộc $n$ chẵn hay lẻ; nếu chỉ làm trội mọi số hạng bằng $\dfrac1{n+1}$ thì được $S\le\dfrac{n}{n+1}<1$, cận này quá lớn nên chưa đủ.

**Phần 2. Trình bày**

Đặt $S=\dfrac{1}{n+1}+\dfrac{1}{n+2}+\dots+\dfrac{1}{2n}$.

Vế trái: với $k=1,2,\dots,n$ ta có $n+k\le2n$ nên $\dfrac{1}{n+k}\ge\dfrac{1}{2n}$; riêng $k=1$ có $n+1<2n$ (vì $n>1$) nên $\dfrac{1}{n+1}>\dfrac{1}{2n}$. Cộng $n$ bất đẳng thức: $S>n\cdot\dfrac{1}{2n}=\dfrac12$.

Vế phải: với mỗi $j\in\{n+1,\dots,2n\}$ ta có $j(3n+1-j)-2n(n+1)=-(j-n-1)(j-2n)\ge0$ vì $j-n-1\ge0$ và $j-2n\le0$. Do đó

$\dfrac1j+\dfrac1{3n+1-j}=\dfrac{3n+1}{j(3n+1-j)}\le\dfrac{3n+1}{2n(n+1)}$

Khi $j$ chạy từ $n+1$ đến $2n$ thì $3n+1-j$ cũng chạy qua đúng các số từ $2n$ về $n+1$, nên

$2S=\sum_{j=n+1}^{2n}\left(\dfrac1j+\dfrac1{3n+1-j}\right)\le n\cdot\dfrac{3n+1}{2n(n+1)}=\dfrac{3n+1}{2(n+1)}$

Suy ra $S\le\dfrac{3n+1}{4(n+1)}<\dfrac{3n+3}{4(n+1)}=\dfrac34$.

Vậy $\dfrac12<\dfrac{1}{n+1}+\dfrac{1}{n+2}+\dots+\dfrac{1}{n+n}<\dfrac34$.

=== C4B4.3@p152
- bai: 3 · y: - · trang: 152 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu · làm trội: x/y<(x+z)/(y+z) khi 0<x<y, z>0
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: 
## DE
Cho $a,b,c>0$. Chứng minh rằng: $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.
## SACH
Trước hết chứng minh nếu $x,y,z>0$ và $x<y$ thì $\dfrac xy<\dfrac{x+z}{y+z}$

Xét hiệu: $\dfrac xy-\dfrac{x+z}{y+z}=\dfrac{x(y+z)-y(x+z)}{y(y+z)}=\dfrac{xy+xz-xy-yz}{y(y+z)}=\dfrac{z(x-y)}{y(y+z)}<0$

(Vì $x<y\Rightarrow x-y<0$). Vậy: $\dfrac xy<\dfrac{x+z}{y+z}$.

Sử dụng kết quả này ta có:

$\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$ ; $\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$ ; $\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$

Cộng các vế của bất đẳng thức trên ta có:

$\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<\dfrac{a+c}{a+b+c}+\dfrac{b+a}{a+b+c}+\dfrac{c+b}{a+b+c}=\dfrac{2(a+b+c)}{a+b+c}=2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba mẫu $a+b$, $b+c$, $c+a$ khác nhau nên không cộng được ngay; mỗi phân số nhỏ hơn $1$ nên khi cộng thêm biến thứ ba vào cả tử và mẫu thì phân số tăng và mẫu thành $a+b+c$ chung, còn ba tử mới cộng lại bằng $2(a+b+c)$.

**Bước 1.** Chứng minh bổ đề: nếu $0<x<y$ và $z>0$ thì $\dfrac xy<\dfrac{x+z}{y+z}$, bằng cách xét hiệu hai phân số và quy đồng.

**Bước 2.** Áp dụng bổ đề cho từng phân số với $z$ là biến còn thiếu trong mẫu ($c$ cho $\dfrac{a}{a+b}$, $a$ cho $\dfrac{b}{b+c}$, $b$ cho $\dfrac{c}{c+a}$), để cả ba mẫu mới đều bằng $a+b+c$.

**Bước 3.** Cộng ba bất đẳng thức, gộp tử ở vế phải thành $2(a+b+c)$ và rút gọn về $2$.

**Chú ý:** Bổ đề chỉ đúng khi phân số nhỏ hơn $1$ (tức $x<y$); nếu $x>y$ thì chiều bất đẳng thức đảo lại.

**Phần 2. Trình bày**

Bổ đề: nếu $x,y,z>0$ và $x<y$ thì $\dfrac xy<\dfrac{x+z}{y+z}$.

Thật vậy: $\dfrac xy-\dfrac{x+z}{y+z}=\dfrac{x(y+z)-y(x+z)}{y(y+z)}=\dfrac{z(x-y)}{y(y+z)}<0$ vì $z>0$, $x-y<0$, $y(y+z)>0$.

Vì $a<a+b$, $b<b+c$, $c<c+a$ nên áp dụng bổ đề:

$\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$, $\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$, $\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$

Cộng ba bất đẳng thức: $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<\dfrac{(a+c)+(b+a)+(c+b)}{a+b+c}=\dfrac{2(a+b+c)}{a+b+c}=2$.

Vậy $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.

=== C4B4.4@p152
- bai: 4 · y: - · trang: 152 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm giảm mẫu: a³+b³≥ab(a+b) (xét hiệu (a+b)(a−b)²≥0) · đưa về mẫu chung abc(a+b+c)
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách bỏ bước chứng minh $a^3+b^3\ge ab(a+b)$; đã bổ sung ở GIAI.
## DE
Cho ba số dương $a,b,c$. Chứng minh rằng: $\dfrac{1}{a^3+b^3+abc}+\dfrac{1}{b^3+c^3+abc}+\dfrac{1}{c^3+a^3+abc}\le\dfrac{1}{abc}$.
## SACH
$\dfrac{1}{a^3+b^3+abc}\le\dfrac{1}{ab(a+b+c)}=\dfrac{c}{abc(a+b+c)}$

Tương tự ta có: $\dfrac{1}{b^3+c^3+abc}\le\dfrac{1}{bc(a+b+c)}=\dfrac{a}{abc(a+b+c)}$;

$\dfrac{1}{c^3+a^3+abc}\le\dfrac{1}{ac(a+b+c)}=\dfrac{b}{abc(a+b+c)}$

Cộng các vế của bất đẳng thức trên ta có:

$\dfrac{1}{a^3+b^3+abc}+\dfrac{1}{b^3+c^3+abc}+\dfrac{1}{c^3+a^3+abc}\le\dfrac{c}{abc(a+b+c)}+\dfrac{a}{abc(a+b+c)}+\dfrac{b}{abc(a+b+c)}=\dfrac{a+b+c}{abc(a+b+c)}=\dfrac{1}{abc}$.

Dấu bằng xảy ra khi $a=b=c$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $a^3+b^3+abc$ có tổng lập phương $a^3+b^3\ge ab(a+b)$; làm giảm mẫu thành $ab(a+b+c)$ rút được $ab$ và xuất hiện nhân tử chung $a+b+c$, đúng với vế phải $\dfrac1{abc}$ khi viết $\dfrac{1}{ab(a+b+c)}=\dfrac{c}{abc(a+b+c)}$.

**Bước 1.** Chứng minh $a^3+b^3\ge ab(a+b)$ bằng cách chuyển vế và phân tích hiệu thành $(a+b)(a-b)^2\ge0$, rồi cộng $abc$ vào hai vế để được $a^3+b^3+abc\ge ab(a+b+c)$.

**Bước 2.** Nghịch đảo hai vế dương: mẫu nhỏ đi thì phân số lớn lên, nên $\dfrac{1}{a^3+b^3+abc}\le\dfrac{1}{ab(a+b+c)}$; rồi viết lại với mẫu chung $abc(a+b+c)$.

**Bước 3.** Làm tương tự cho hai phân số còn lại bằng cách hoán vị vòng quanh $a\to b\to c\to a$ rồi cộng ba bất đẳng thức.

**Bước 4.** Gộp tử $c+a+b$ ở vế phải, rút gọn thừa số $a+b+c$ để được $\dfrac1{abc}$, và tìm dấu "=" khi cả ba bất đẳng thức cùng đạt dấu.

**Chú ý:** Vì $a,b,c>0$ nên mẫu hai bên đều dương và nghịch đảo đổi chiều bất đẳng thức; dấu "=" của bước 1 xảy ra khi $a=b$, nên toàn bài cần $a=b=c$.

**Phần 2. Trình bày**

Vì $a,b>0$ nên $a^3+b^3-ab(a+b)=(a+b)(a-b)^2\ge0$, suy ra $a^3+b^3\ge ab(a+b)$ (dấu "=" khi $a=b$).

Do đó $a^3+b^3+abc\ge ab(a+b+c)>0$, suy ra $\dfrac{1}{a^3+b^3+abc}\le\dfrac{1}{ab(a+b+c)}=\dfrac{c}{abc(a+b+c)}$

Tương tự: $\dfrac{1}{b^3+c^3+abc}\le\dfrac{1}{bc(a+b+c)}=\dfrac{a}{abc(a+b+c)}$ và $\dfrac{1}{c^3+a^3+abc}\le\dfrac{1}{ca(a+b+c)}=\dfrac{b}{abc(a+b+c)}$

Cộng ba bất đẳng thức:

$\dfrac{1}{a^3+b^3+abc}+\dfrac{1}{b^3+c^3+abc}+\dfrac{1}{c^3+a^3+abc}\le\dfrac{a+b+c}{abc(a+b+c)}=\dfrac{1}{abc}$

Dấu "=" xảy ra khi $a=b=c$.

Vậy $\dfrac{1}{a^3+b^3+abc}+\dfrac{1}{b^3+c^3+abc}+\dfrac{1}{c^3+a^3+abc}\le\dfrac{1}{abc}$.

=== C4B4.5@p153
- bai: 5 · y: - · trang: 153 · tang: nang_cao
- nguon_de: 
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: làm trội, làm giảm 1/k² kẹp giữa 1/(k(k+1)) và 1/((k−1)k) · tách hiệu và khử liên tiếp · so sánh phân số bằng nhân chéo
- kiem: khong
- ket_qua_sach: 
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in sai: ở dòng làm trội, số hạng áp dụng thứ hai từ cuối viết "$\dfrac1{2009^2}<\dfrac1{2008}-\dfrac1{2009}$" (phải là $\dfrac1{2016^2}<\dfrac1{2015}-\dfrac1{2016}$); ở dòng làm giảm, số hạng cuối viết "$\dfrac1{2017^2}>\dfrac1{2018}-\dfrac1{2017}$" (phải là $\dfrac1{2017}-\dfrac1{2018}$); dòng so sánh cuối "$\dfrac{1008}{2018}>\dfrac{1002}{2010}=\dfrac{167}{335}\Rightarrow\dfrac{1004}{2010}>\dfrac{1002}{2010}=\ldots$" lộn xộn, không chặt. GIAI theo bản đúng, so sánh bằng nhân chéo.
## DE
Chứng minh rằng: $\dfrac{167}{335}<\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{2016^2}+\dfrac{1}{2017^2}<\dfrac{2016}{2017}$.
## SACH
Số hạng tổng quát: $\dfrac{1}{k^2}$ với $2\le k\le2017$.

Ta có: $\dfrac{1}{k^2}<\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac1k$.

Áp dụng bất đẳng thức vào bài ta có $k=2,3,4,\dots,2017$ ta có:

$\dfrac{1}{2^2}<\dfrac11-\dfrac12$; $\dfrac{1}{3^2}<\dfrac12-\dfrac13$; $\dots$; $\dfrac{1}{2017^2}<\dfrac{1}{2016}-\dfrac{1}{2017}$; $\dfrac{1}{2009^2}<\dfrac{1}{2008}-\dfrac{1}{2009}$

Cộng các vế của bất đẳng thức trên ta có:

$\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{2016^2}+\dfrac{1}{2017^2}<\dfrac{2016}{2017}$.

Mặt khác $\dfrac{1}{k^2}>\dfrac{1}{k(k+1)}=\dfrac1k-\dfrac1{k+1}$.

Áp dụng bất đẳng thức vào bài với $k=2,3,4,\dots,2017$ ta có:

$\dfrac{1}{2^2}>\dfrac12-\dfrac13$; $\dfrac{1}{3^2}>\dfrac13-\dfrac14$; $\dfrac{1}{4^2}>\dfrac14-\dfrac15$; $\dots\dots$; $\dfrac{1}{2017^2}>\dfrac{1}{2018}-\dfrac{1}{2017}$

$\Rightarrow\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{2016^2}+\dfrac{1}{2017^2}>\dfrac12-\dfrac{1}{2018}=\dfrac{1008}{2018}$.

Mà $\dfrac{1008}{2018}>\dfrac{1002}{2010}=\dfrac{167}{335}\Rightarrow\dfrac{1004}{2010}>\dfrac{1002}{2010}=\dfrac{6\cdot167}{6\cdot335}=\dfrac{167}{335}$.

Từ đó suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số hạng $\dfrac1{k^2}$ không tách thành hiệu được, nhưng kẹp được giữa hai phân số dạng hiệu liên tiếp: $\dfrac1{k(k+1)}<\dfrac1{k^2}<\dfrac1{(k-1)k}$, tức $\dfrac1k-\dfrac1{k+1}<\dfrac1{k^2}<\dfrac1{k-1}-\dfrac1k$; cộng theo $k$ thì tổng khử liên tiếp ở cả hai phía.

**Bước 1.** Xác định số hạng tổng quát $\dfrac1{k^2}$ với $k=2,3,\dots,2017$ để biết các hạng tử đầu và cuối còn lại sau khi khử.

**Bước 2.** Cận trên: làm trội bằng $k^2>(k-1)k$ để $\dfrac1{k^2}<\dfrac1{k-1}-\dfrac1k$, cộng $k=2,\dots,2017$ thì chỉ còn $1$ và $-\dfrac1{2017}$.

**Bước 3.** Cận dưới: làm giảm bằng $k^2<k(k+1)$ để $\dfrac1{k^2}>\dfrac1k-\dfrac1{k+1}$, cộng $k=2,\dots,2017$ thì chỉ còn $\dfrac12$ và $-\dfrac1{2018}$.

**Bước 4.** So sánh cận dưới $\dfrac12-\dfrac1{2018}$ với $\dfrac{167}{335}$ bằng cách rút gọn phân số rồi nhân chéo hai tích số tự nhiên.

**Chú ý:** Cận dưới cần dùng $k(k+1)$ chứ không dùng $(k-1)k$; hai cận trên và dưới cho hai tổng khử khác nhau, đừng lẫn đầu và cuối của hai dãy.

**Phần 2. Trình bày**

Với $k\ge2$: $(k-1)k<k^2<k(k+1)$ nên

$\dfrac1{k(k+1)}<\dfrac1{k^2}<\dfrac1{(k-1)k}$, tức $\dfrac1k-\dfrac1{k+1}<\dfrac1{k^2}<\dfrac1{k-1}-\dfrac1k$.

Cận trên: cho $k=2,3,\dots,2017$ rồi cộng vế với vế:

$\dfrac1{2^2}+\dfrac1{3^2}+\dots+\dfrac1{2017^2}<\left(1-\dfrac12\right)+\left(\dfrac12-\dfrac13\right)+\dots+\left(\dfrac1{2016}-\dfrac1{2017}\right)=1-\dfrac1{2017}=\dfrac{2016}{2017}$

Cận dưới: cho $k=2,3,\dots,2017$ rồi cộng vế với vế:

$\dfrac1{2^2}+\dfrac1{3^2}+\dots+\dfrac1{2017^2}>\left(\dfrac12-\dfrac13\right)+\left(\dfrac13-\dfrac14\right)+\dots+\left(\dfrac1{2017}-\dfrac1{2018}\right)=\dfrac12-\dfrac1{2018}=\dfrac{1008}{2018}=\dfrac{504}{1009}$

Lại có $\dfrac{504}{1009}>\dfrac{167}{335}$ vì $504\cdot335=168840>167\cdot1009=168503$.

Vậy $\dfrac{167}{335}<\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\dots+\dfrac{1}{2016^2}+\dfrac{1}{2017^2}<\dfrac{2016}{2017}$.

