# ĐỀ | Đề cương ôn tập giữa học kì I Toán 6 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai (Toán cô Hương – CLB Toán học Pi)
nam: 2026
bo_sach: KNTT

## PHẦN 5 | V. Chủ đề chuyên | tu_luan

### Bài 16 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** a) Viết các số 7; 8; 9; 10 thành tổng của hai số nguyên tố cùng nhau lớn hơn 1.
b) Chứng minh rằng mọi số tự nhiên $n$ lớn hơn 6 đều biểu diễn được dưới dạng tổng của hai số nguyên tố cùng nhau lớn hơn 1.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai số nguyên tố cùng nhau là hai số có ƯCLN bằng 1; số 2 với một số lẻ, hay hai số lẻ hơn kém nhau 2 hoặc 4, thì luôn có ƯCLN bằng 1.

**Bước 1.** Ý a: thử tách từng số 7; 8; 9; 10 thành tổng của hai số nhỏ (ưu tiên các số nguyên tố 2, 3, 5, 7) rồi kiểm tra ƯCLN của hai số có bằng 1 hay không.

**Bước 2.** Ý b: chia hai trường hợp theo tính chẵn lẻ của $n$; nếu $n$ lẻ thì tách $n$ thành 2 cộng với số lẻ còn lại, vì ước của 2 chỉ có 1 và 2 mà số lẻ không chia hết cho 2.

**Bước 3.** Nếu $n$ chẵn thì đặt $n=2m$ rồi tách thành hai số đối xứng quanh $m$: chọn hai số lẻ hơn kém nhau 2 khi $m$ chẵn, hơn kém nhau 4 khi $m$ lẻ.

**Bước 4.** Chứng minh hai số vừa tách là nguyên tố cùng nhau: một ước chung của hai số thì chia hết hiệu của chúng, mà hiệu chỉ là 2 hoặc 4 còn hai số đều lẻ nên ước chung chỉ có thể là 1.

**Bước 5.** Dùng điều kiện $n>6$ để chỉ ra mỗi số hạng tách được đều lớn hơn 1, đúng yêu cầu của đề.

**Chú ý:** ý a có nhiều cách viết đúng (ví dụ 9 còn bằng 4+5), chỉ cần chỉ ra một cách và kiểm ƯCLN bằng 1.

**Phần 2. Trình bày**

a) $7=2+5$ vì $\text{ƯCLN}(2,5)=1$

$8=3+5$ vì $\text{ƯCLN}(3,5)=1$

$9=2+7$ vì $\text{ƯCLN}(2,7)=1$

$10=3+7$ vì $\text{ƯCLN}(3,7)=1$

Các số hạng ở mỗi tổng đều lớn hơn 1 và là hai số nguyên tố khác nhau nên nguyên tố cùng nhau.

b) Trường hợp 1: $n$ là số lẻ.

Ta viết $n=2+(n-2)$. Vì $n>6$ nên $n-2>1$.

Ước chung của 2 và $n-2$ là ước của 2, tức là 1 hoặc 2. Mà $n-2$ là số lẻ nên không chia hết cho 2. Do đó ước chung chỉ là 1, nghĩa là $\text{ƯCLN}(2,n-2)=1$.

Trường hợp 2: $n$ là số chẵn. Đặt $n=2m$. Vì $n>6$ nên $n\ge 8$, suy ra $m\ge 4$.

Trường hợp 2.1: $m$ chẵn. Ta viết $n=(m-1)+(m+1)$. Vì $m\ge 4$ nên $m-1\ge 3>1$.

Gọi $d$ là một ước chung của $m-1$ và $m+1$. Khi đó $(m+1)\vdots d$ và $(m-1)\vdots d$ nên hiệu $(m+1)-(m-1)=2$ chia hết cho $d$.

Vì $m$ chẵn nên $m-1$ lẻ, không chia hết cho 2, suy ra $d\neq 2$. Mà $d$ là ước của 2 nên $d=1$. Vậy $m-1$ và $m+1$ nguyên tố cùng nhau.

Trường hợp 2.2: $m$ lẻ. Ta viết $n=(m-2)+(m+2)$. Vì $m$ lẻ và $m\ge 4$ nên $m\ge 5$, suy ra $m-2\ge 3>1$.

Gọi $d$ là một ước chung của $m-2$ và $m+2$. Khi đó hiệu $(m+2)-(m-2)=4$ chia hết cho $d$, nên $d\in\{1;2;4\}$.

Vì $m$ lẻ nên $m-2$ lẻ, không chia hết cho 2 và cũng không chia hết cho 4, suy ra $d=1$. Vậy $m-2$ và $m+2$ nguyên tố cùng nhau.

Vậy mọi số tự nhiên $n>6$ đều viết được thành tổng của hai số nguyên tố cùng nhau lớn hơn 1.

### Bài 17 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho số tự nhiên $n$ có 39 ước. Chứng minh rằng:
a) $n$ là bình phương của một số tự nhiên $a$.
b) Tích các ước của $n$ bằng $a^3$.
**Chưa chắc:** đề in số mũ $a^3$ ở ý b nhưng với $n$ có 39 ước thì tích các ước bằng $a^{39}$ (ví dụ $n=2^{12}.3^2$ có $13.3=39$ ước, $a=2^6.3$, tích các ước là $a^{39}$ chứ không phải $a^3$). Số mũ $a^3$ chỉ đúng khi $n$ có 3 ước; nhiều khả năng đề gốc là $a^{39}$ (số mũ mất chữ số 9 khi in). Lời giải chứng minh tích các ước bằng $a^{39}$. (Trạm soát: phóng to ảnh xác nhận đề in đúng $a^3$; máy kiểm 5 số nhỏ nhất có 39 ước là 36864, 102400, 200704, 495616, 692224 — tích các ước đều bằng $a^{39}$, không số nào bằng $a^3$. Đề nghị sửa đề thành $a^{39}$.)

**Phần 1. Hướng dẫn**

**Mấu chốt:** các ước của $n$ đi thành từng cặp $d$ và $n:d$ có tích bằng $n$; số ước là số lẻ nên phải có một ước đứng riêng, chính là số $a$ cần tìm.

**Bước 1.** Ghép mỗi ước $d$ của $n$ với ước $n:d$ để được một cặp có tích đúng bằng $n$.

**Bước 2.** Ý a: số ước là 39 (số lẻ) nên không thể chia hết các ước thành những cặp hai số khác nhau, vậy phải có một ước ghép với chính nó, tức ước đó nhân với chính nó ra $n$.

**Bước 3.** Ý b: ước ghép với chính nó là $a$, các ước còn lại chia thành từng cặp; số cặp bằng số ước còn lại chia cho 2.

**Bước 4.** Mỗi cặp có tích bằng $n=a^2$; nhân tất cả các cặp rồi nhân thêm ước $a$ đứng riêng, gom thành một luỹ thừa của $a$ bằng quy tắc nhân hai luỹ thừa cùng cơ số.

**Chú ý:** số mũ của kết quả ý b chính là số ước của $n$, hãy đối chiếu với số mũ in trong đề.

**Phần 2. Trình bày**

a) Với mỗi ước $d$ của $n$, số $n:d$ cũng là ước của $n$ và $d.(n:d)=n$. Ta ghép ước $d$ với ước $n:d$ thành một cặp.

Nếu không có ước nào thoả $d=n:d$ thì mỗi ước đều ghép với một ước khác nó, các ước chia hết thành từng cặp nên số ước là số chẵn. Điều này trái với đề bài ($n$ có 39 ước, là số lẻ).

Do đó có một ước $a$ sao cho $a=n:a$. Suy ra $n=a.a=a^2$.

Vậy $n$ là bình phương của số tự nhiên $a$.

b) Nếu một ước $d$ ghép với chính nó thì $d.d=n=a.a$. Nếu $d<a$ thì $d.d<a.a$, nếu $d>a$ thì $d.d>a.a$, nên $d=a$. Vì vậy chỉ có ước $a$ ghép với chính nó, còn $39-1=38$ ước khác chia thành từng cặp.

Số cặp là $38:2=19$ (cặp).

Tích hai ước trong mỗi cặp bằng $n=a^2$.

Tích tất cả các ước của $n$ là:

$a.\left(a^2.a^2.\dots.a^2\right)$ (có 19 thừa số $a^2$)

$=a^{1+2+2+\dots+2}$ (có 19 số 2)

$=a^{1+38}$

$=a^{39}$

Vậy tích các ước của $n$ bằng $a^{39}$.

### Bài 18 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho số tự nhiên $M$ gồm 100 chữ số 1, số tự nhiên $N$ gồm 50 chữ số 2. Chứng minh rằng $M-N$ là một số chính phương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $M$ gồm hai khối 50 chữ số 1 giống hệt nhau, $N$ gấp đôi một khối đó; gọi khối đó là $K$ rồi đặt thừa số chung để $M-N$ hiện ra dạng tích hai số bằng nhau.

**Bước 1.** Đặt $K$ là số gồm 50 chữ số 1; nhận ra $N$ gồm 50 chữ số 2 nên $N$ gấp đôi $K$.

**Bước 2.** Viết $M$ theo $K$: khối 50 chữ số 1 đứng đầu bằng $K$ nhân với một luỹ thừa của 10 (dịch sang trái 50 chữ số), cộng với khối 50 chữ số 1 đứng cuối.

**Bước 3.** Tính $M-N$ theo $K$, rồi đặt $K$ làm thừa số chung bằng tính chất phân phối của phép nhân đối với phép trừ.

**Bước 4.** Nhận ra thừa số còn lại là $10^{50}-1$, một số gồm toàn chữ số 9, và so sánh với 9 lần $K$.

**Bước 5.** Thay vào rồi viết số 9 thành $3.3$ để biểu thức trở thành tích của hai số bằng nhau, tức bình phương của một số tự nhiên.

**Chú ý:** số 9 nhân với số gồm toàn chữ số 1 cho số gồm toàn chữ số 9 cùng số chữ số vì không có nhớ.

**Phần 2. Trình bày**

Đặt $K=11\dots1$ (50 chữ số 1).

Khi đó $N=22\dots2$ (50 chữ số 2) $=2K$.

Số $M$ gồm 100 chữ số 1: 50 chữ số 1 đứng đầu và 50 chữ số 1 đứng cuối. Khối đứng đầu bằng $K.10^{50}$, khối đứng cuối bằng $K$ nên $M=K.10^{50}+K$.

$M-N=K.10^{50}+K-2K$

$=K.10^{50}-K$

$=K.(10^{50}-1)$

Vì $10^{50}-1=99\dots9$ (50 chữ số 9) $=9K$ nên

$M-N=K.9K=9K^2$

$=3.3.K.K$

$=(3K).(3K)$

$=(3K)^2$

Mà $3K=33\dots3$ (50 chữ số 3) là một số tự nhiên.

Vậy $M-N=(33\dots3)^2$ (50 chữ số 3) là một số chính phương.

### Bài 19 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $A=10^{2012}+10^{2011}+10^{2010}+10^{2009}+8$.
a) Chứng minh rằng $A$ chia hết cho 24.
b) Chứng minh rằng $A$ không phải là số chính phương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $24=8.3$ với 8 và 3 nguyên tố cùng nhau nên chứng minh $A$ chia hết cho 8 và cho 3 riêng rẽ; còn số chính phương thì không bao giờ tận cùng bằng chữ số tận cùng của $A$.

**Bước 1.** Ý a: phân tích $24=8.3$, thấy ƯCLN(8, 3) bằng 1 nên đủ chứng minh $A$ chia hết cho 8 và chia hết cho 3.

**Bước 2.** Chia hết cho 8: mọi luỹ thừa của 10 từ $10^3$ trở lên đều chứa thừa số $1000$, mà 1000 chia hết cho 8, còn số hạng 8 cũng chia hết cho 8 nên tổng chia hết cho 8.

**Bước 3.** Chia hết cho 3: viết $A$ ra dạng số cụ thể (bốn chữ số 1 đứng đầu, nhiều chữ số 0, tận cùng là 8) rồi dùng dấu hiệu chia hết cho 3 qua tổng các chữ số.

**Bước 4.** Kết luận ý a bằng cách dùng ƯCLN bằng 1: số chia hết cho cả 8 và 3 thì chia hết cho tích $8.3$.

**Bước 5.** Ý b: tìm chữ số tận cùng của $A$ từ cách viết $A$ ở bước 3.

**Bước 6.** Lập bảng chữ số tận cùng của bình phương các số tự nhiên rồi đối chiếu với chữ số tận cùng của $A$.

**Chú ý:** ở ý b, $A$ chia hết cho 3 không giúp kết luận gì về số chính phương; dùng chữ số tận cùng mới nhanh.

**Phần 2. Trình bày**

a) Ta có $24=8.3$ và $\text{ƯCLN}(8,3)=1$. Ta chứng minh $A\vdots 8$ và $A\vdots 3$.

Chia hết cho 8: với $k\ge 3$ thì $10^k=1000.10^{k-3}$, mà $1000=8.125$ nên $10^k\vdots 8$.

Do đó $10^{2012}$, $10^{2011}$, $10^{2010}$, $10^{2009}$ đều chia hết cho 8. Mà $8\vdots 8$ nên $A\vdots 8$.

Chia hết cho 3: $A$ là số có 2013 chữ số, gồm bốn chữ số 1 đứng đầu, 2008 chữ số 0 ở giữa và chữ số tận cùng là 8.

Tổng các chữ số của $A$ là $1+1+1+1+8=12$.

Vì $12\vdots 3$ nên $A\vdots 3$.

Mà $A\vdots 8$, $A\vdots 3$ và $\text{ƯCLN}(8,3)=1$ nên $A\vdots 8.3$, tức là $A\vdots 24$.

b) Các số $10^{2012}$, $10^{2011}$, $10^{2010}$, $10^{2009}$ đều có chữ số tận cùng là 0 nên $A$ có chữ số tận cùng là 8.

Số tự nhiên $m$ có chữ số tận cùng là $c$ thì $m=10q+c$, nên $m^2=m.(10q+c)=10qm+c.(10q+c)=10qm+10qc+c^2=10.(qm+qc)+c^2$.

Vì $10.(qm+qc)$ có chữ số tận cùng là 0 nên chữ số tận cùng của $m^2$ giống chữ số tận cùng của $c^2$.

Xét $c=0;1;2;\dots;9$ ta có $c^2=0;1;4;9;16;25;36;49;64;81$, tận cùng lần lượt là $0;1;4;9;6;5;6;9;4;1$.

Vậy số chính phương chỉ có chữ số tận cùng là $0;1;4;5;6;9$, không bao giờ tận cùng bằng 8.

Do đó $A$ không phải là số chính phương.

### Bài 20 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm ba số nguyên tố $a,\ b,\ c$ khác nhau sao cho $abc<ab+bc+ca$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba số khác nhau nên xếp được $a<b<c$; thay các tích ở vế phải bằng tích lớn hơn để "kẹp" lần lượt $a$, rồi $b$, rồi $c$ vào những khoảng rất nhỏ.

**Bước 1.** Vì vai trò của $a$, $b$, $c$ như nhau và ba số khác nhau, ta sắp xếp thứ tự $a<b<c$ để so sánh được các tích.

**Bước 2.** So sánh từng số hạng của vế phải với tích $bc$: cả $ab$ và $ca$ đều nhỏ hơn $bc$, nên vế phải nhỏ hơn ba lần $bc$; từ đó kẹp được $a$ rồi chọn số nguyên tố.

**Bước 3.** Với $a$ đã biết, bớt $bc$ ở cả hai vế để bất đẳng thức chỉ còn $b$ và $c$; thay $2b$ bằng số lớn hơn là $2c$ để kẹp $b$.

**Bước 4.** Biết $b$ thì thay vào, bớt hai vế cho gọn để kẹp $c$, rồi chọn số nguyên tố thoả điều kiện lớn hơn $b$.

**Bước 5.** Thử lại bộ ba tìm được vào điều kiện của đề.

**Chú ý:** đề gọi $a,b,c$ ở vai trò như nhau, nên đáp số là một bộ ba số, thứ tự các số không quan trọng.

**Phần 2. Trình bày**

Vì vai trò của $a$, $b$, $c$ như nhau và ba số khác nhau nên giả sử $a<b<c$.

Vì $a<c$ nên $ab<cb$, tức $ab<bc$. Vì $a<b$ nên $ca<cb$, tức $ca<bc$.

Do đó $ab+bc+ca<bc+bc+bc=3bc$.

Mà $abc<ab+bc+ca$ nên $abc<3bc$, suy ra $a<3$.

Vì $a$ là số nguyên tố nên $a=2$.

Thay $a=2$ vào đề ta có $2bc<2b+bc+2c$, tức $bc+bc<bc+(2b+2c)$, suy ra $bc<2b+2c$.

Vì $b<c$ nên $2b<2c$, do đó $2b+2c<2c+2c=4c$.

Suy ra $bc<4c$ nên $b<4$.

Vì $b$ là số nguyên tố và $b>a=2$ nên $b=3$.

Thay $b=3$ vào $bc<2b+2c$ ta có $3c<2.3+2c=6+2c$, tức $c+2c<6+2c$, suy ra $c<6$.

Vì $c$ là số nguyên tố và $c>b=3$ nên $c=5$.

Thử lại: $abc=2.3.5=30$ và $ab+bc+ca=2.3+3.5+5.2=6+15+10=31$. Vì $30<31$ nên thoả mãn đề.

Vậy ba số nguyên tố cần tìm là $2;\ 3;\ 5$ (thứ tự bất kì).
