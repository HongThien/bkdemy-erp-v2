=== T7V4.1@p149
- bai: VD1 (Dạng 4) · y: - · trang: 149 · tang: nang_cao
- nguon_de: Đề thi vô địch toán Anh, 1976
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đồng dư · chia trường hợp theo số dư của n · chu kì số dư của luỹ thừa
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in sai hai chỗ ở lời giải: (1) trường hợp n=4k+1, dòng "Chú ý" in "65=135.(1-65)^{2k} chia cho 3 dư 1" (đọc là 65=13·5 và (1-65)^{2k} chia cho 13 dư 1); (2) trường hợp n=4k+3 sách kết luận "A chia hết cho 8" — sai, A lẻ, đúng phải là A chia hết cho 5 (25-8=17 và 8+17=25). Lời giải kho dùng đồng dư mod 3, 13, 5; máy kiểm n=0..399: A chia hết cho 3 / 13 / 5 theo n chẵn / n≡1 / n≡3 (mod 4) và A không nguyên tố.
## DE
(Đề thi vô địch toán Anh, 1976) Chứng minh rằng số $19\cdot 8^n+17$ là hợp số với mọi số tự nhiên $n$.
## SACH
Xét các trường hợp: $n=2k$, $n=4k+1$ và $n=4k+3$.

a. $n=2k$: $A=19\cdot 8^{2k}+17=18\cdot 8^{2k}+8^{2k}+(18-1)$. Mà $8^{2k}=64^k=(63+1)^k$, $63=3\cdot 21$ nên $8^{2k}$ chia 3 dư 1. Suy ra $A\vdots 3$.

b. $n=4k+1$: $A=19\cdot 8^{4k+1}+17=13\cdot 8^{4k+1}+6\cdot 8\cdot 64^{2k}+17=13\cdot 8^{4k+1}+39\cdot 64^{2k}+9(1-65)^{2k}+(13+4)$. Chú ý rằng: $65=13\cdot 5$, $(1-65)^{2k}$ chia cho 3 dư 1 [sic], ta có: $A\vdots 13$.

c. $n=4k+3$, ta có $A=19\cdot 8^{4k+3}+17=15\cdot 8^{4k+3}+4\cdot 8^3\cdot 64^{2k}+17=15\cdot 8^{4k+3}+4\cdot 510\cdot 64^{2k}+4\cdot 2(1-65)^{2k}+(25-8)$. Suy ra $A\vdots 8$ [sic].
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số mũ $n$ nằm ở luỹ thừa của $8$ nên số dư của $8^n$ lặp lại theo chu kì; chia $n$ thành các dạng $2k$, $4k+1$, $4k+3$ thì mỗi dạng cho một ước cố định của $A$ — dấu hiệu để dùng đồng dư.

**Bước 1.** Xét số dư của $8^n$ khi chia cho $3$: vì $8\equiv-1$ nên chỉ cần $n$ chẵn là $A$ đã có một ước cố định.

**Bước 2.** Với $n$ lẻ, chia tiếp theo số dư của $n$ cho $4$, vì $8^4=4096$ chia cho $13$ và chia cho $5$ đều dư $1$, nên luỹ thừa chỉ còn phụ thuộc số dư của $n$.

**Bước 3.** Thử từng dạng $n=4k+1$ và $n=4k+3$ để tìm số nguyên tố chia hết $A$ trong mỗi dạng.

**Bước 4.** So sánh $A$ với ước vừa tìm được, vì chia hết cho một số vẫn chưa đủ để kết luận hợp số nếu $A$ chính bằng số đó.

**Chú ý:** Sách tách luỹ thừa bằng khai triển $(63+1)^k$, $(1-65)^{2k}$; viết bằng đồng dư gọn hơn nhiều. Cũng đừng quên điều kiện $A$ lớn hơn ước tìm được.

**Phần 2. Trình bày**

Mỗi số tự nhiên $n$ chỉ thuộc một trong ba dạng: $n$ chẵn, $n=4k+1$, $n=4k+3$ ($k\in\mathbb N$). Gọi $A=19\cdot 8^n+17$.

Với $n$ chẵn: $8\equiv-1 \pmod{3}$ nên $8^n\equiv1 \pmod{3}$, suy ra $A\equiv19+17=36\equiv0 \pmod{3}$.

Với $n=4k+1$: $8^4=4096=13\cdot315+1\equiv1 \pmod{13}$ nên $8^{4k+1}\equiv8 \pmod{13}$, suy ra $A\equiv19\cdot 8+17=169=13^2\equiv0 \pmod{13}$.

Với $n=4k+3$: $8^4\equiv1 \pmod{5}$ nên $8^{4k+3}\equiv8^3=512\equiv2 \pmod{5}$, suy ra $A\equiv19\cdot 2+17=55\equiv0 \pmod{5}$.

Mặt khác $A\ge19+17=36>13$ với mọi $n$, nên $A$ có ước là $3$, $13$ hoặc $5$ nhỏ hơn $A$ và lớn hơn $1$.

Vậy $19\cdot 8^n+17$ là hợp số với mọi số tự nhiên $n$.

=== T7V4.2@p150
- bai: VD2 (Dạng 4) · y: - · trang: 150 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chia đa thức · điều kiện chia hết (dư bằng 0) · định lí Bê-du
- kiem: khong
- ket_qua_sach: -30
- dap_an: $k=-30$
- ghi_chu_nghi: Máy quét k nguyên trong [-100;100]: f(2)=0 và f(-1)=0 chỉ khi k=-30, khớp sách.
## DE
Xác định giá trị $k$ để đa thức $f(x)=x^4-9x^3+21x^2+x+k$ chia hết cho đa thức $g(x)=x^2-x-2$.
## SACH
Cách 1: Lấy $f(x)$ chia cho $g(x)$ để tìm số dư và đạt số dư bằng $0$ để tìm $k$.

Ta có: $x^4-9x^3+21x^2+x+k=(x^2-x-2)(x^2-8x+15)+k+30$

$f(x)$ chia hết cho $g(x)$ thì cần và đủ là: $r(x)=k+30=0\Rightarrow k=-30$.

Cách 2: Ta có: $x^2-x-2=(x-2)(x+1)$. Như vậy nếu $f(x)$ chia hết cho $x^2-x-2$, thì cũng chia hết cho $(x-2)(x+1)$. Áp dụng định lý Bezout và định nghĩa phép chia hết, ta thay $x=-1$ vào $f(x)$: $f(-1)=1+9+21-1+k=0\Rightarrow k=-30$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $k$ chỉ xuất hiện ở hạng tử tự do của $f(x)$ nên chỉ đi vào số dư; đa thức chia hết khi số dư bằng đa thức không, nên ép dư bằng $0$ là tìm được $k$.

**Bước 1.** Thực hiện phép chia $f(x)$ cho $g(x)$ bằng cách giảm bậc dần, thương có bậc $2$ và hạng tử $k$ được giữ nguyên đến cuối.

**Bước 2.** Viết $f(x)=g(x)\cdot h(x)+r(x)$ và kiểm lại bằng cách nhân $g(x)$ với thương để chắc phần dư không còn chứa $x$.

**Bước 3.** Cho số dư bằng $0$ rồi giải phương trình theo $k$.

**Chú ý:** Có thể dùng định lí Bê-du: $g(x)=(x-2)(x+1)$ nên $f(x)$ chia hết cho $g(x)$ khi $f(2)=0$ và $f(-1)=0$; phải kiểm cả hai nghiệm, ở đây hai điều kiện cho cùng một giá trị $k$.

**Phần 2. Trình bày**

Thực hiện phép chia, ta có:

$x^4-9x^3+21x^2+x+k=(x^2-x-2)(x^2-8x+15)+k+30$

Thật vậy, $(x^2-x-2)(x^2-8x+15)=x^4-9x^3+21x^2+x-30$.

Số dư của phép chia là $r(x)=k+30$.

$f(x)$ chia hết cho $g(x)\Leftrightarrow r(x)=0\Leftrightarrow k+30=0\Leftrightarrow k=-30$

Vậy $k=-30$.

=== T7V4.3@p150
- bai: VD3 (Dạng 4) · y: - · trang: 150 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chia đa thức · định lí Bê-du · ước của số nguyên
- kiem: khong
- ket_qua_sach: 0; 3
- dap_an: $k\in\{0;3\}$
- ghi_chu_nghi: Máy vét k từ 0 đến 1999: (k^3+2k^2+15) chia hết cho (k+3) chỉ khi k=0 hoặc k=3, khớp sách. Sách coi 0 là số tự nhiên.
## DE
Tìm tất cả các số tự nhiên $k$ để đa thức $f(k)=k^3+2k^2+15$ chia hết cho nhị thức $g(k)=k+3$.
## SACH
Cách 1: $k^3+2k^2+15=(k+3)(k^2-k+3)+6$. Để $f(k)$ chia hết cho $k+3$ thì cần và đủ là $6$ chia hết cho $k+3$. Nếu $k$ là số tự nhiên thì $k+3\ge3$ vì thế $6$ chia hết cho $k+3$ khi và chỉ khi $k=0$ hoặc $k=3$.

Cách 2: Áp dụng định lý Bezout, chia $f(k)$ cho $g(k)=k-(-3)$ ta tìm được số dư: $f(-3)=-27+18+15=6$. Số dư này phải chia hết cho $k+3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia $f(k)$ cho $k+3$ thì phần thương luôn chia hết, nên $f(k)$ chia hết cho $k+3$ khi và chỉ khi số dư (một hằng số) chia hết cho $k+3$ — bài toán đưa về tìm ước của một số.

**Bước 1.** Tìm số dư của phép chia bằng định lí Bê-du: thay $k=-3$ vào $f(k)$, vì $k+3=k-(-3)$.

**Bước 2.** Viết $f(k)=(k+3)\cdot h(k)+r$ với $r$ là số dư vừa tìm, rồi nêu điều kiện cần và đủ để $f(k)$ chia hết cho $k+3$.

**Bước 3.** Dùng điều kiện $k$ là số tự nhiên để giới hạn $k+3\ge3$, liệt kê các ước phù hợp của $r$ rồi suy ra $k$ và thử lại.

**Chú ý:** Phải loại các ước nhỏ hơn $3$ của số dư vì $k+3\ge3$; nếu đề cho $k$ nguyên thì lại phải xét thêm cả ước âm.

**Phần 2. Trình bày**

Theo định lí Bê-du, số dư khi chia $f(k)$ cho $k+3$ là $f(-3)=-27+18+15=6$.

Thực hiện phép chia: $k^3+2k^2+15=(k+3)(k^2-k+3)+6$.

Vì $(k+3)(k^2-k+3)\vdots(k+3)$ nên $f(k)\vdots(k+3)\Leftrightarrow6\vdots(k+3)$.

Với $k\in\mathbb N$ thì $k+3\ge3$, mà các ước dương của $6$ là $1;2;3;6$ nên $k+3\in\{3;6\}$, suy ra $k\in\{0;3\}$.

Thử lại: $k=0$ thì $f(0)=15\vdots3$; $k=3$ thì $f(3)=27+18+15=60\vdots6$.

Vậy $k\in\{0;3\}$.

=== T7V4.4@p150
- bai: VD4 (Dạng 4) · y: - · trang: 150 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: ghép cặp số hạng i và p−i · tính chia hết của (p−1)! cho số nguyên tố p
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Logo "ABC" của trang che một phần phân số 1/2 ở dòng đầu lời giải (trang 150); dựng lại theo dòng ngay trên và các dòng sau. Sách không nói rõ q là số nguyên; lời giải kho bổ sung. Máy kiểm tử số của 1+1/2+...+1/(p-1) (phân số tối giản) chia hết cho p với mọi nguyên tố lẻ p ≤ 97.
## DE
Chứng minh rằng với $p$ là số nguyên tố lớn hơn $2$ thì giá trị $m$ trong phân số $\dfrac{m}{n}=1+\dfrac{1}{2}+\dfrac{1}{3}+\cdots+\dfrac{1}{p-1}$ $(m\in\mathbb N;n\in\mathbb N)$ chia hết cho $p$.
## SACH
Do $p$ là số nguyên tố nên $p-1$ là số chẵn, suy ra

$\dfrac{m}{n}=1+\dfrac{1}{2}+\dfrac{1}{3}+\cdots+\dfrac{1}{p-1}=\left(\dfrac{1}{1}+\dfrac{1}{p-1}\right)+\left(\dfrac{1}{2}+\dfrac{1}{p-2}\right)+\left(\dfrac{1}{3}+\dfrac{1}{p-3}\right)+\cdots+\left(\dfrac{1}{\frac{p-1}{2}}+\dfrac{1}{\frac{p+1}{2}}\right)$

$=\dfrac{p}{1\cdot(p-1)}+\dfrac{p}{2\cdot(p-2)}+\dfrac{p}{3\cdot(p-3)}+\cdots+\dfrac{p}{\frac{p-1}{2}\cdot\frac{p+1}{2}}$

$=p\left[\dfrac{1}{1\cdot(p-1)}+\dfrac{1}{2\cdot(p-2)}+\dfrac{1}{3\cdot(p-3)}+\cdots+\dfrac{1}{\frac{p-1}{2}\cdot\frac{p+1}{2}}\right]$

Ta có $1\cdot(p-1)\cdot2\cdot(p-2)\cdots\dfrac{p-1}{2}\cdot\dfrac{p+1}{2}=(p-1)!$ suy ra $\dfrac{m}{n}$ có dạng $\dfrac{m}{n}=p\dfrac{q}{(p-1)!}\Rightarrow m(p-1)!=npq\Rightarrow m(p-1)!$ chia hết cho $p$ mà $(p-1)!$ không chia hết cho $p$, nên $m$ chia hết cho $p$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các số hạng $\dfrac{1}{i}$ và $\dfrac{1}{p-i}$ có tổng $\dfrac{p}{i(p-i)}$ chứa sẵn thừa số $p$, nên ghép cặp đối xứng để đưa $p$ ra ngoài cả tổng rồi chuyển thành bài toán chia hết.

**Bước 1.** Dùng $p$ nguyên tố lớn hơn $2$ nên $p$ lẻ, suy ra $p-1$ chẵn và các số hạng chia được thành $\dfrac{p-1}{2}$ cặp $\dfrac{1}{i},\dfrac{1}{p-i}$ không trùng nhau.

**Bước 2.** Cộng từng cặp để mỗi cặp có tử số là $p$, rồi đặt $p$ làm nhân tử chung của cả tổng.

**Bước 3.** Quy đồng các phân số còn lại về mẫu chung $(p-1)!$, vì các tích $i(p-i)$ dùng mỗi thừa số từ $1$ đến $p-1$ đúng một lần, để được $\dfrac{m}{n}=\dfrac{pq}{(p-1)!}$ với $q$ nguyên.

**Bước 4.** Nhân chéo để có $m\cdot(p-1)!=npq$ rồi dùng tính chất số nguyên tố: $p$ không chia hết $(p-1)!$ nên phải chia hết $m$.

**Chú ý:** Phải giải thích $q$ là số nguyên, và dùng đúng tính chất "số nguyên tố $p$ chia hết tích $ab$ mà không chia hết $b$ thì chia hết $a$".

**Phần 2. Trình bày**

Vì $p$ là số nguyên tố lớn hơn $2$ nên $p$ lẻ, $p-1$ chẵn. Ghép số hạng $\dfrac{1}{i}$ với $\dfrac{1}{p-i}$ ($i=1;2;\ldots;\dfrac{p-1}{2}$), được các cặp khác nhau vì $i\ne p-i$:

$\dfrac{m}{n}=\left(1+\dfrac{1}{p-1}\right)+\left(\dfrac{1}{2}+\dfrac{1}{p-2}\right)+\cdots+\left(\dfrac{1}{\frac{p-1}{2}}+\dfrac{1}{\frac{p+1}{2}}\right)$

Với mỗi cặp: $\dfrac{1}{i}+\dfrac{1}{p-i}=\dfrac{p}{i(p-i)}$, nên

$\dfrac{m}{n}=p\left[\dfrac{1}{1\cdot(p-1)}+\dfrac{1}{2\cdot(p-2)}+\cdots+\dfrac{1}{\frac{p-1}{2}\cdot\frac{p+1}{2}}\right]$

Các tích $1\cdot(p-1),\ 2\cdot(p-2),\ \ldots,\ \dfrac{p-1}{2}\cdot\dfrac{p+1}{2}$ chứa mỗi thừa số $1;2;\ldots;p-1$ đúng một lần nên tích của chúng bằng $(p-1)!$. Do đó $\dfrac{(p-1)!}{i(p-i)}$ là tích các thừa số còn lại, là số nguyên.

Đặt $q$ là tổng các số nguyên $\dfrac{(p-1)!}{i(p-i)}$ (với $i=1;2;\ldots;\dfrac{p-1}{2}$), thì $q\in\mathbb N$ và

$\dfrac{m}{n}=p\cdot\dfrac{q}{(p-1)!}\Rightarrow m\cdot(p-1)!=npq$

Vế phải chia hết cho $p$ nên $m\cdot(p-1)!\vdots p$. Mà $p$ nguyên tố và mọi thừa số của $(p-1)!$ đều nhỏ hơn $p$ nên $(p-1)!\not\vdots p$. Suy ra $m\vdots p$.

Vậy $m$ chia hết cho $p$.

=== T7V4.5@p151
- bai: VD5 (Dạng 4) · y: - · trang: 151 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: quy tắc nhân · chia trường hợp
- kiem: khong
- ket_qua_sach: 13320
- dap_an: $13320$
- ghi_chu_nghi: Máy vét toàn bộ chỉnh hợp 6 chữ số khác nhau từ {0,...,7}, a1 khác 0 và có chữ số 3: đúng 13320 số, khớp sách. Cách phần bù: 6·7·6·5·4·3 - 6·6·5·4·3·2 = 17640 - 4320 = 13320.
## DE
Với $8$ số: $0;1;2;3;4;5;6;7$. Hỏi có thể lập được bao nhiêu số tự nhiên có $6$ chữ số khác nhau, trong đó nhất thiết phải có mặt chữ số $3$.
## SACH
Ký hiệu số tự nhiên thoả đề bài là $\overline{a_1a_2a_3a_4a_5a_6}$. Các số $a_1,a_2,\ldots,a_6$ khác nhau lấy từ $8$ số đã cho, $a_1\ne0$.
- $a_1=3$, khi đó $a_2$ có $7$ cách chọn, sau đó $a_3$ có $6$ cách chọn,... Do đó trường hợp này có: $7\cdot6\cdot5\cdot4\cdot3=2520$ (số).
- $a_1\ne3$ khi đó có $6$ cách chọn $a_1$ (vì $a_1\ne0$, $a_1\ne3$), chọn số $3$ thay vào $1$ trong $5$ số $a_2,\ldots,a_6$, sau đó còn lại $4$ chữ số và lần lượt chọn $4$ số khác nhau lấy từ $8$ số đã cho và khác $a_1$, $a_2$. Do đó trường hợp này có: $6\cdot5\cdot6\cdot5\cdot4\cdot3=10800$ (số).
- Đáp số: $13320$ số.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện "nhất thiết có mặt chữ số $3$" làm bài toán phụ thuộc vào vị trí của chữ số $3$, nên chia hai trường hợp: $3$ đứng đầu hoặc $3$ không đứng đầu, rồi đếm bằng quy tắc nhân.

**Bước 1.** Đặt số cần lập là $\overline{a_1a_2a_3a_4a_5a_6}$ với các chữ số khác nhau và $a_1\ne0$ vì số có $6$ chữ số.

**Bước 2.** Trường hợp $a_1=3$: chọn lần lượt $a_2,\ldots,a_6$ từ các chữ số còn lại, số cách giảm dần mỗi lần một đơn vị.

**Bước 3.** Trường hợp $a_1\ne3$: chọn $a_1$ trước (khác $0$ và khác $3$), rồi chọn một vị trí trong năm vị trí còn lại cho chữ số $3$, rồi chọn các vị trí còn lại.

**Bước 4.** Cộng số cách của hai trường hợp, vì hai trường hợp không có số nào chung.

**Chú ý:** Có thể làm bằng phần bù: lấy tất cả số có $6$ chữ số khác nhau trừ đi số không có chữ số $3$; hai cách phải cho cùng kết quả.

**Phần 2. Trình bày**

Gọi số cần lập là $\overline{a_1a_2a_3a_4a_5a_6}$, các chữ số khác nhau lấy từ $\{0;1;\ldots;7\}$ và $a_1\ne0$.

Trường hợp 1: $a_1=3$. Các chữ số $a_2;a_3;a_4;a_5;a_6$ lần lượt có $7;6;5;4;3$ cách chọn, nên có $7\cdot6\cdot5\cdot4\cdot3=2520$ số.

Trường hợp 2: $a_1\ne3$. Chữ số $a_1$ có $6$ cách chọn (khác $0$ và khác $3$). Chữ số $3$ đứng ở một trong $5$ vị trí $a_2;\ldots;a_6$ nên có $5$ cách. Bốn vị trí còn lại lần lượt chọn từ $8-2=6$ chữ số còn lại nên có $6\cdot5\cdot4\cdot3=360$ cách. Vậy có $6\cdot5\cdot360=10800$ số.

Hai trường hợp không có số chung, nên tổng số cần tìm là $2520+10800=13320$.

Vậy có $13320$ số.

=== T7V4.6@p151
- bai: VD6 (Dạng 4) · y: - · trang: 151 · tang: nang_cao
- nguon_de: Đề thi học sinh giỏi toàn quốc 1984
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chữ số tận cùng của luỹ thừa (chu kì 4) · đồng dư mod 3 · chia trường hợp n=4k+r
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in sai nhỏ: Cách 2 phần b ghi "Trường hợp b là số lẻ" (đúng phải là n lẻ, n=2r+1); Cách 3 ghi "n=4k thì b=4" (đúng là b=6). Mép trang 152 mất vài chữ cái ở đầu một số dòng của Cách 1 ("Vì n>3", "2^{4k+1}-2"), tự bù theo ngữ cảnh. Lời giải kho theo Cách 3 của sách viết bằng đồng dư. Máy kiểm n=4..599: a>0, b>0, ab chia hết cho 6.
## DE
(Đề thi học sinh giỏi toàn quốc 1984) Cho $2^n=10a+b$. Chứng minh rằng nếu $n>3$ thì tích số $a\cdot b$ chia hết cho $6$. Ở đây $a,b,n$ là các số nguyên dương và $b<10$.
## SACH
Cách 1: – Từ các giả thiết ta suy ra $b$ chỉ có thể nhận các giá trị $2,4,6,8$.

Với $b=2$: $a=\dfrac{2^n-2}{10}$: $a$ là số nguyên nên $n$ phải có dạng $n=4k+1$. Vì $n>3$ nên $n$ chỉ có thể lấy các giá trị từ $5$ trở lên. Ta được: $a=\dfrac{2^{4k+1}-2}{10}$. Nếu $a\cdot b\vdots6$ mà $b=2$ thì $a$ phải chia hết cho $3$ và $(2^{4k+1}-2)$ phải chia hết cho $30$. Chứng minh $(2^{4k+1}-2)\vdots30$ bằng phương pháp qui nạp.

– Các trường hợp $b=4$, $b=8$ cũng tương tự.

– Trường hợp $b=6$ thì mệnh đề trên hiển nhiên đúng.

Cách 2: Hãy xét hai trường hợp:

a. Trường hợp $n$ là số chẵn, $n=2k$ ($k\ge2$): $2^n=10a+b\Leftrightarrow2^{2k}=10a+b$
* Suy ra $b$ là số chẵn.
* $(2^{2k})=(2^k)^2$ là số chính phương chẵn nên nó phải tận cùng bằng số chẵn, $b$ chỉ có thể là $4$ hoặc $6$.
– Với $b=6$: mệnh đề hiển nhiên đúng.
– Với $b=4\Rightarrow2^{2k}=10a+4\Rightarrow4^k=10a+4$. Vì $4^k=(3+1)^k=3M+1$ nên $4^k$ chia cho $3$ còn dư $1$. Vậy $(4^k-4)\vdots3$ suy ra $10a\vdots3$ hay $a\vdots3$.

b. Trường hợp $b$ [sic] là số lẻ: $n=2r+1$ ($r\ge2$) $\Rightarrow2^n=10a+b\Leftrightarrow2^{2r+1}=10a+b$. $2^{2r}$ chỉ tận cùng bằng $4$ hoặc $6$ nên $2^{2r+1}$ chỉ có thể tận cùng bằng $8$ hoặc $2$ hay $b$ chỉ nhận giá trị $2$ hoặc $8$.
– Với $b=2$ thì $2^{2r}$ chia cho $3$ dư $1$; $2^{2r+1}$ chia cho $3$ dư $2$. Vậy $(2^{2r+1}-2)\vdots3$ nên $10a\vdots3$ hay $a\vdots3$.
– Với $b=8$ cũng chứng minh tương tự.

Cách 3: Vì $n>3$, cho nên ta chỉ cần xét các trường hợp $n=4k$, $n=4k+1$, $n=4k+2$, $n=4k+3$ với $k\in\mathbb N$ và $k\ge1$.
– Với $n=4k$, ta chứng minh được $b=4$ [sic]. Vậy $a\cdot b\vdots6$
– Với $n=4k+1$, ta suy ra $b=2$ và chứng minh được $a\vdots3$
– Với $n=4k+2$, ta suy ra $b=4$ và chứng minh được $a\vdots3$
– Với $n=4k+3$, ta suy ra $b=8$ và chứng minh được $a\vdots3$

Nhận xét: trong cả ba cách chứng minh trên đây, ta đều nhằm đi đến kết luận là $b$ chỉ nhận một trong các giá trị $2,4,6,8$ và chỉ cần chứng minh rằng trong các trường hợp ấy thì $a\vdots3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $0<b<10$ nên $b$ chính là chữ số tận cùng của $2^n$, chữ số này lặp theo chu kì $4$; $b$ luôn chẵn nên $ab$ đã chia hết cho $2$ và chỉ còn phải chứng minh $a\vdots3$ khi $b$ khác $6$.

**Bước 1.** Tìm chữ số tận cùng của $2^n$ bằng cách viết $n=4k+r$ và dùng $2^4=16$ tận cùng bằng $6$, từ đó biết $b$ ứng với từng số dư $r$.

**Bước 2.** Với trường hợp $b=6$, nhận xét ngay $ab=6a$ nên không cần làm gì thêm.

**Bước 3.** Với $b\in\{2;4;8\}$, vì $b$ chẵn và không chia hết cho $3$ nên chỉ cần chứng minh $a\vdots3$ rồi ghép với tính chẵn của $b$.

**Bước 4.** Lấy số dư theo mod $3$ của hệ thức $10a=2^n-b$, dùng $2\equiv-1$ để tính $2^n$ ở từng dạng $n=4k+r$.

**Chú ý:** Điều kiện $n>3$ để $a>0$ (với $n=3$ thì $a=0$); sách làm thêm bằng quy nạp hoặc xét $n$ chẵn lẻ, cách xét $n=4k+r$ gọn nhất.

**Phần 2. Trình bày**

Vì $n>3$ nên $n=4k+r$ với $k\ge1$, $r\in\{0;1;2;3\}$. Do $2^4=16\equiv6 \pmod{10}$ và $6^k\equiv6 \pmod{10}$ nên $2^{4k}\equiv6 \pmod{10}$. Vì $0<b<10$ và $b\equiv2^n \pmod{10}$ nên:

$n=4k$ thì $b=6$; $n=4k+1$ thì $b\equiv6\cdot 2\equiv2$ nên $b=2$; $n=4k+2$ thì $b\equiv6\cdot 4\equiv4$ nên $b=4$; $n=4k+3$ thì $b\equiv6\cdot 8\equiv8$ nên $b=8$.

Trường hợp $n=4k$: $b=6$ nên $ab=6a\vdots6$.

Trường hợp còn lại: $b\in\{2;4;8\}$ là số chẵn nên $ab\vdots2$. Từ $2^n=10a+b$ có $10a=2^n-b$. Vì $2\equiv-1 \pmod{3}$ nên $2^n\equiv(-1)^n \pmod{3}$:

Với $n=4k+1$: $2^n\equiv-1\equiv2$ và $b=2$ nên $10a=2^n-b\equiv0 \pmod{3}$.

Với $n=4k+2$: $2^n\equiv1$ và $b=4\equiv1$ nên $10a\equiv0 \pmod{3}$.

Với $n=4k+3$: $2^n\equiv-1\equiv2$ và $b=8\equiv2$ nên $10a\equiv0 \pmod{3}$.

Trong cả ba dạng $10a\vdots3$ mà $\gcd(10;3)=1$ nên $a\vdots3$. Do đó $ab$ chia hết cho cả $2$ và $3$, mà $\gcd(2;3)=1$ nên $ab\vdots6$.

Vậy nếu $n>3$ thì $a\cdot b$ chia hết cho $6$.

=== T7V4.7@p152
- bai: VD7 (Dạng 4) · y: - · trang: 152 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: hệ số bất định (đồng nhất hệ số) · so sánh bậc thương và đa thức chia
- kiem: khong
- ket_qua_sach: 3x^2-x+2
- dap_an: $3x^2-x+2$
- ghi_chu_nghi: Đề in ở cuối trang 152, lời giải ở đầu trang 153. Máy kiểm (x-2)(3x^2-x+2)=3x^3-7x^2+4x-4 với x=-5..5, khớp sách.
## DE
Cho biết đa thức $3x^3-7x^2+4x-4$ chia hết cho nhị thức $x-2$. Tìm đa thức thương.
## SACH
Gọi đa thức bị chia là $f(x)$, đa thức chia là $g(x)$. Ở đây $f(x)$ là đa thức bậc ba, còn $g(x)$ là đa thức bậc nhất. Vì vậy thương phải là đa thức bậc hai, nghĩa là thương có dạng: $h(x)=ax^2+bx+c$.

Ta có: $3x^3-7x^2+4x-4=(x-2)(ax^2+bx+c)=ax^3+(b-2a)x^2+(c-2b)x-2c$.

Đồng nhất hệ số ở các hạng tử cùng bậc ở hai vế, ta được:
$\begin{cases}a=3\\b-2a=-7\\c-2b=4\\-2c=-4\end{cases}\Leftrightarrow\begin{cases}a=3\\b=-1\\c=2\end{cases}$

Đa thức phải tìm là $h(x)=3x^2-x+2$

Chú ý: Ta có thể nhận xét về hệ số cao nhất và hạng tử không đổi của $f(x)$, $g(x)$ và $h(x)$ để có ngay: $a=3$, $(-2c)=-4$, Do đó $c=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba chia hết cho nhị thức bậc nhất thì thương chắc chắn là đa thức bậc hai, nên chỉ cần đặt thương với ba hệ số chưa biết rồi đồng nhất hệ số hai vế.

**Bước 1.** Xác định dạng của thương bằng cách so sánh bậc: $3-1=2$ nên thương có dạng $ax^2+bx+c$.

**Bước 2.** Nhân $(x-2)$ với thương rồi gộp các hạng tử cùng luỹ thừa của $x$ để so sánh với đa thức đã cho.

**Bước 3.** Đồng nhất hệ số các luỹ thừa cùng bậc, giải hệ bốn phương trình, rồi viết thương.

**Chú ý:** Hệ số của $x^3$ cho ngay $a$ và hạng tử tự do cho ngay $c$, nên chỉ còn một ẩn $b$ cần tìm; luôn nhân ngược lại để kiểm tra.

**Phần 2. Trình bày**

Đa thức $3x^3-7x^2+4x-4$ bậc $3$ chia hết cho $x-2$ bậc $1$ nên thương có bậc $2$, dạng $ax^2+bx+c$. Ta có:

$3x^3-7x^2+4x-4=(x-2)(ax^2+bx+c)=ax^3+(b-2a)x^2+(c-2b)x-2c$

Đồng nhất hệ số các hạng tử cùng bậc ở hai vế:

$\begin{cases}a=3\\b-2a=-7\\c-2b=4\\-2c=-4\end{cases}\Leftrightarrow\begin{cases}a=3\\b=-1\\c=2\end{cases}$

Các hệ số này thoả cả phương trình thứ ba: $c-2b=2+2=4$.

Vậy thương là $3x^2-x+2$.

=== T7V4.8@p153
- bai: VD8 (Dạng 4) · y: - · trang: 153 · tang: nang_cao
- nguon_de: Đề thi học sinh giỏi cấp II toàn quốc, 1976
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chia đa thức, số dư bằng đa thức không · hệ số bất định
- kiem: khong
- ket_qua_sach: a=2; b=1
- dap_an: $a=2$, $b=1$
- ghi_chu_nghi: Máy quét a,b nguyên trong [-20;20] với điều kiện dư (2-a)x+(b+1-a)=0: chỉ (a,b)=(2,1), khớp sách.
## DE
(Đề thi học sinh giỏi cấp II toàn quốc, 1976) Với giá trị nào của $a$ và $b$ thì đa thức $x^3+ax^2+2x+b$ chia hết cho đa thức $x^2+x+1$?
## SACH
Cách 1: Chia $f(x)$ cho $x^2+x+1$. Ta được dư là: $(2-a)x+(b+1-a)=r(x)$. Ta có phép chia hết khi và chỉ khi $r(x)=0$, tức là $\begin{cases}2-a=0\\b+1-a=0\end{cases}\Rightarrow a=2$ và $b=1$.

Cách 2: Chú ý rằng $f(x)$ bậc $3$, còn đa thức chia là bậc $2$, nên thương phải là một nhị thức bậc nhất, có dạng $x+k$. Từ đó: $(x+k)(x^2+x+1)=x^3+ax^2+2x+b\Leftrightarrow x^3+ax^2+2x+b=x^3+(k+1)x^2+(k+1)x+k$. Hệ số của các hạng tử cùng bậc phải bằng nhau, suy ra: $a=k+1$; $2=k+1$; $b=k$. Từ đây ta có: $k=1$, $a=2$, $b=1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức chia hết khi dư bằng đa thức không; dư của phép chia cho tam thức bậc hai có bậc nhỏ hơn $2$ nên là $mx+n$, và nó bằng $0$ khi cả hai hệ số $m,n$ bằng $0$.

**Bước 1.** Chia $x^3+ax^2+2x+b$ cho $x^2+x+1$ theo cột, chỉ dừng khi bậc của dư nhỏ hơn bậc $2$ của đa thức chia.

**Bước 2.** Viết đa thức bị chia dưới dạng thương nhân đa thức chia cộng dư, để thấy dư có dạng bậc nhất theo $x$.

**Bước 3.** Cho cả hệ số của $x$ và hạng tử tự do của dư bằng $0$ rồi giải hệ hai ẩn $a$, $b$.

**Chú ý:** Cách khác là đặt thương $x+k$ rồi đồng nhất hệ số (hệ số bất định), cho cùng kết quả; không thể chỉ cho một hệ số của dư bằng $0$.

**Phần 2. Trình bày**

Thực hiện phép chia:

$x^3+ax^2+2x+b=(x+a-1)(x^2+x+1)+(2-a)x+(b+1-a)$

Thật vậy, $(x+a-1)(x^2+x+1)=x^3+ax^2+ax+a-1$.

Dư của phép chia là $r(x)=(2-a)x+(b+1-a)$.

Phép chia hết khi và chỉ khi $r(x)$ là đa thức không, tức là

$\begin{cases}2-a=0\\b+1-a=0\end{cases}\Leftrightarrow\begin{cases}a=2\\b=1\end{cases}$

Vậy $a=2$ và $b=1$.

=== T7V4.9@p153
- bai: VD9 (Dạng 4) · y: - · trang: 153 · tang: nang_cao
- nguon_de: Theo đề thi vô địch toán Hungari 1963
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét tính chia hết cho 3 và cho 9 · chia trường hợp a chia hết / không chia hết cho 3
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề in ở cuối trang 153, lời giải ở đầu trang 154. Máy kiểm a nguyên trong [-2000;2000]: P(a) khác 0; và P(a) không chia hết cho 9 khi 3|a, không chia hết cho 3 khi 3 không chia hết a (a trong [-500;500]).
## DE
(Theo đề thi vô địch toán Hungari 1963) Chứng minh rằng đa thức $P(x)=x^5-3x^4+6x^3-3x^2+9x-6$ không thể có nghiệm là số nguyên.
## SACH
Với $a\in\mathbb Z$, ta có: $P(a)=a^5-3a^4+6a^3-3a^2+9a-6$

Nếu $a$ chia hết cho $3$ thì tất cả các số hạng trong $P(a)$ đều chia hết cho $9$, trừ số hạng $6$, do đó $P(a)$ không chia hết cho $9$, nghĩa là $P(a)\ne0$.

Nếu $a$ không chia hết cho $3$ thì $a^5$ không chia hết cho $3$ trong khi tất cả các số hạng khác trong $P(a)$ đều chia hết cho $3$, do đó $P(a)$ không chia hết cho $3$, nghĩa là $P(a)\ne0$. Vậy $P(a)\ne0$ với mọi $a\in\mathbb Z$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chứng minh $P(a)\ne0$ với mọi số nguyên $a$, chỉ cần chỉ ra một số mà $P(a)$ không chia hết cho nó; các hệ số $3,6,9$ gợi dùng số $3$ và $9$, và phải chia hai trường hợp theo $a$ có chia hết cho $3$ hay không.

**Bước 1.** Giả sử $a$ nguyên bất kì rồi chia hai trường hợp: $a\vdots3$ và $a\not\vdots3$, vì mỗi trường hợp dùng một lập luận khác nhau.

**Bước 2.** Với $a\vdots3$, kiểm từng hạng tử của $P(a)$ để thấy mọi hạng tử trừ hằng số $-6$ đều chia hết cho $9$.

**Bước 3.** Với $a\not\vdots3$, kiểm từng hạng tử để thấy chỉ $a^5$ không chia hết cho $3$ còn mọi hạng tử khác đều chia hết cho $3$.

**Bước 4.** Từ mỗi trường hợp suy ra $P(a)$ không chia hết cho $9$ (hoặc cho $3$), nên khác $0$.

**Chú ý:** Số $0$ chia hết cho mọi số nguyên khác $0$, vì vậy chỉ cần thấy $P(a)$ không chia hết cho $3$ hoặc $9$ là suy ra $P(a)\ne0$.

**Phần 2. Trình bày**

Giả sử $a\in\mathbb Z$. Xét hai trường hợp.

Trường hợp 1: $a\vdots3$. Khi đó $a^5\vdots3^5$, $3a^4\vdots3^5$, $6a^3\vdots27$, $3a^2\vdots27$, $9a\vdots27$ nên cả năm số hạng đầu của $P(a)$ đều chia hết cho $9$, còn $-6\not\vdots9$. Suy ra $P(a)\not\vdots9$, do đó $P(a)\ne0$.

Trường hợp 2: $a\not\vdots3$. Vì $3$ nguyên tố nên $a^5\not\vdots3$, còn $3a^4;\ 6a^3;\ 3a^2;\ 9a;\ -6$ đều chia hết cho $3$. Suy ra $P(a)\not\vdots3$, do đó $P(a)\ne0$.

Vậy $P(a)\ne0$ với mọi $a\in\mathbb Z$, tức đa thức $P(x)$ không có nghiệm nguyên.

=== T7V4.10@p154
- bai: VD10 (Dạng 4) · y: - · trang: 154 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đồng dư mod 3 · chia trường hợp theo số dư của n
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n=0..499: n^3+2n chia hết cho 3. Sách làm hai cách (xét số dư khi chia cho 3; quy nạp); lời giải kho theo Cách 1 viết bằng đồng dư.
## DE
Chứng minh rằng $n^3+2n$ chia hết cho $3$ với mọi $n\in\mathbb N$.
## SACH
Cách 1: Ta xét hai khả năng:
a. Nếu $n\vdots3$ thì rõ ràng $(n^3+2n)\vdots3$
b. Nếu $n$ không chia hết cho $3$ thì $n$ có dạng: $n=3k+1$ hoặc $n=3k+2$ với $k\in\mathbb N$.
* Với $n=3k+1$: $(n^3+2n)=(3k+1)^3+2(3k+1)=27k^3+27k^2+9k+1+6k+2=3(9k^3+9k^2+5k+1)\vdots3$
* Với $n=3k+2$: $n^3+2n=(3k+2)^3+2(3k+2)=27k^3+54k^2+36k+8+6k+4=3(9k^3+18k^2+14k+4)\vdots3$
Mệnh đề được chứng minh

Cách 2: Chứng minh bằng quy nạp toán học:
1. $n=1\Rightarrow n^3+2n=1+2\cdot1=3$, vậy mệnh đề đúng với $n=1$.
2. Giả sử mệnh đề đúng với $k$, nghĩa là ta có: $(k^3+2k)\vdots3$. Ta chứng minh mệnh đề cũng đúng với $k+1$, nghĩa là phải chứng minh: $[(k+1)^3+2(k+1)]\vdots3$. Ta có: $(k+1)^3+2(k+1)=k^3+3k^2+3k+1+2k+2=(k^3+2k)+3(k^2+k+1),k\in\mathbb N$. Nhưng $(k^3+2k)\vdots3$ (theo giả thiết quy nạp); $3(k^2+k+1)\vdots3$. Vậy $[(k+1)^3+2(k+1)]\vdots3$. Vậy mệnh đề trên đúng với mọi $n\in\mathbb N$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chứng minh chia hết cho $3$ một biểu thức chứa $n$ thì xét số dư của $n$ khi chia cho $3$; chỉ có ba số dư $0,1,2$ nên chỉ cần thử ba trường hợp.

**Bước 1.** Chia $n$ thành ba dạng theo số dư khi chia cho $3$, vì mọi số tự nhiên đều thuộc đúng một dạng.

**Bước 2.** Với mỗi dạng, thay số dư của $n$ vào biểu thức và tính số dư của $n^3+2n$ bằng đồng dư mod $3$.

**Bước 3.** Kiểm lại cả ba dạng đều cho số dư $0$ rồi kết luận cho mọi $n\in\mathbb N$.

**Chú ý:** Cách khác: $n^3+2n=(n-1)n(n+1)+3n$ với tích ba số nguyên liên tiếp chia hết cho $3$; hoặc dùng quy nạp như sách.

**Phần 2. Trình bày**

Mọi số tự nhiên $n$ có dạng $n=3k$, $n=3k+1$ hoặc $n=3k+2$, tức $n\equiv0;1;2 \pmod{3}$.

Với $n\equiv0 \pmod{3}$: $n^3+2n\equiv0+0=0 \pmod{3}$.

Với $n\equiv1 \pmod{3}$: $n^3+2n\equiv1+2=3\equiv0 \pmod{3}$.

Với $n\equiv2 \pmod{3}$: $n^3+2n\equiv8+4=12\equiv0 \pmod{3}$.

Vậy $n^3+2n$ chia hết cho $3$ với mọi $n\in\mathbb N$.


=== T7V4.11@p154
- bai: VD11 (Dạng 4) · y: - · trang: 154 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: quy nạp toán học · a^k−1 chia hết cho a−1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề in ở cuối trang 154, lời giải kéo sang đầu trang 155. Đề không ghi miền của n; sách kiểm đầu tiên ở n=1 nên hiểu n là số nguyên dương (n=0 cũng đúng vì 16^0-0-1=0). Máy kiểm n=0..299 chia hết cho 225.
## DE
Chứng minh rằng: $16^n-15n-1\vdots225$ (với $n$ là số nguyên dương).
## SACH
1. Mệnh đề phải chứng minh đúng với $n=1$: $16^1-15\cdot1-1=0\vdots225$

2. Giả sử mệnh đề phải chứng minh là đúng với $n=k$: $16^k-15\cdot k-1\vdots225$. Ta chứng minh rằng mệnh đề cũng đúng với $n=k+1$.

Thực vậy: $16^{k+1}-15(k+1)-1=16\cdot16^k-15k-15-1=(16^k-15k-1)+15\cdot16^k-15$ vì $16\cdot16^k=(15+1)16^k=16^k+15\cdot16^k$

Theo giả thiết quy nạp thì: $16^k-15\cdot k-1\vdots225$

Còn $15\cdot16^k-15=15(16^k-1)$, Mà $16^k-1\vdots(16-1)$

Nên $15(16^k-1)\vdots15\cdot15=225$. Vì vậy: $16^{k+1}-15(k+1)-1\vdots225$ (đpcm)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức có số mũ $n$ và một phần tuyến tính $15n+1$, chuyển từ $n=k$ sang $n=k+1$ chỉ thêm một thừa số $16$, nên dùng quy nạp và tách phần thêm vào thành bội của $225$.

**Bước 1.** Kiểm tra mệnh đề với $n=1$ để làm cơ sở quy nạp.

**Bước 2.** Giả sử đúng với $n=k$, rồi viết $16^{k+1}-15(k+1)-1$ qua biểu thức $16^k-15k-1$ bằng cách tách $16\cdot16^k=16^k+15\cdot16^k$.

**Bước 3.** Đưa phần dư ra ngoài thành $15(16^k-1)$ rồi dùng hằng đẳng thức $a^k-b^k$ chia hết cho $a-b$ để thấy thừa số còn lại chia hết cho $15$.

**Chú ý:** Có thể không dùng quy nạp: $16^n-1=15(16^{n-1}+\cdots+16+1)$, rồi đặt $15$ ra ngoài và nhóm từng số hạng $16^j-1$ đều chia hết cho $15$.

**Phần 2. Trình bày**

Với $n=1$: $16^1-15\cdot1-1=0\vdots225$, mệnh đề đúng.

Giả sử mệnh đề đúng với $n=k$ ($k\ge1$), tức là $16^k-15k-1\vdots225$. Ta chứng minh mệnh đề đúng với $n=k+1$:

$16^{k+1}-15(k+1)-1=16\cdot16^k-15k-16$

$=(16^k-15k-1)+15\cdot16^k-15$

$=(16^k-15k-1)+15(16^k-1)$

Theo giả thiết quy nạp, $16^k-15k-1\vdots225$.

Vì $16^k-1\vdots(16-1)$ tức $16^k-1\vdots15$ nên $15(16^k-1)\vdots15\cdot15=225$.

Do đó $16^{k+1}-15(k+1)-1\vdots225$.

Theo nguyên lí quy nạp, $16^n-15n-1\vdots225$ với mọi số nguyên dương $n$.

=== T7V4.12a@p155
- bai: VD12 (Dạng 4) · y: a · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: kẹp giữa hai số chính phương liên tiếp
- kiem: khong
- ket_qua_sach: 2
- dap_an: $n=2$
- ghi_chu_nghi: Sách ở ý a không ghi dòng "Đáp số" riêng; kết luận n=2 lấy từ các dòng sách (n=2 thì biểu thức bằng 4; n=1 và n>2 loại). Máy vét n=1..199999: n^2-n+2 là số chính phương chỉ khi n=2.
## DE
Tìm số nguyên dương $n$ để biểu thức $n^2-n+2$ là số chính phương.
## SACH
a) Với $n=1$ thì $n^2-n+2=2$ không là số chính phương.
Với $n=2$ thì $n^2-n+2=4$ là số chính phương.
Với $n>2$ thì $n^2-n+2$ không là số chính phương vì: $(n-1)^2<n^2-(n-2)<n^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Với $n$ lớn, biểu thức $n^2-n+2$ nằm giữa hai số chính phương của hai số tự nhiên liên tiếp $n-1$ và $n$ nên không thể là số chính phương — dấu hiệu dùng phương pháp kẹp.

**Bước 1.** Thử riêng các giá trị nhỏ của $n$ vì bất đẳng thức kẹp chỉ đúng khi $n$ đủ lớn.

**Bước 2.** So sánh biểu thức với $(n-1)^2$ bằng cách xét hiệu hai số, vì $(n-1)^2=n^2-2n+1$ nhỏ hơn với mọi $n$.

**Bước 3.** So sánh biểu thức với $n^2$ bằng cách xét hiệu, để tìm điều kiện của $n$ làm biểu thức nhỏ hơn $n^2$.

**Bước 4.** Kết luận: giữa hai số chính phương của hai số nguyên liên tiếp không có số chính phương nào nên các giá trị $n$ ở bước 3 bị loại.

**Chú ý:** Phải kiểm riêng các giá trị $n$ nhỏ mà phép kẹp không áp dụng được, vì ở đó biểu thức có thể là số chính phương.

**Phần 2. Trình bày**

Với $n=1$: $n^2-n+2=2$ không là số chính phương.

Với $n=2$: $n^2-n+2=4=2^2$ là số chính phương.

Với $n>2$: $(n^2-n+2)-(n-1)^2=n+1>0$ và $n^2-(n^2-n+2)=n-2>0$, nên

$(n-1)^2<n^2-n+2<n^2$

Biểu thức nằm giữa hai số chính phương của hai số tự nhiên liên tiếp $n-1$ và $n$ nên không là số chính phương.

Vậy $n=2$.

=== T7V4.12b@p155
- bai: VD12 (Dạng 4) · y: b · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: kẹp giữa hai số chính phương liên tiếp
- kiem: khong
- ket_qua_sach: 2
- dap_an: $n=2$
- ghi_chu_nghi: Máy vét n=1..199999: n^4-n+2 là số chính phương chỉ khi n=2, khớp sách.
## DE
Tìm số nguyên dương $n$ để biểu thức $n^4-n+2$ là số chính phương.
## SACH
b) Với $n>2$ thì $(n^2-1)^2<n^4-(n-2)<(n^2)^2$ nên $n^4-n+2$ không là số chính phương. Xét $n=1$ và $n=2$. Đáp số: $n=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức $n^4-n+2$ gần bằng $(n^2)^2$, và với $n$ lớn nó lọt giữa hai số chính phương của hai số nguyên liên tiếp $n^2-1$ và $n^2$ nên không thể là số chính phương.

**Bước 1.** Nhận ra $n^4=(n^2)^2$ để chọn hai số chính phương cần kẹp là $(n^2-1)^2$ và $(n^2)^2$.

**Bước 2.** Xét hiệu của biểu thức với $(n^2-1)^2$ để chứng tỏ nó lớn hơn với mọi $n$ nguyên dương.

**Bước 3.** Xét hiệu của $(n^2)^2$ với biểu thức để tìm điều kiện của $n$ làm biểu thức nhỏ hơn $(n^2)^2$, rồi kiểm riêng các giá trị $n$ còn lại.

**Chú ý:** Các giá trị $n$ nhỏ không thoả điều kiện kẹp phải thử trực tiếp; không được bỏ sót vì chính chúng cho nghiệm.

**Phần 2. Trình bày**

Ta có $(n^4-n+2)-(n^2-1)^2=2n^2-n+1=n(2n-1)+1>0$ với mọi $n\ge1$.

Với $n>2$: $(n^2)^2-(n^4-n+2)=n-2>0$, nên

$(n^2-1)^2<n^4-n+2<(n^2)^2$

Biểu thức nằm giữa hai số chính phương của hai số tự nhiên liên tiếp $n^2-1$ và $n^2$ nên không là số chính phương.

Với $n=1$: $n^4-n+2=2$ không là số chính phương.

Với $n=2$: $n^4-n+2=16=4^2$ là số chính phương.

Vậy $n=2$.

=== T7V4.13@p155
- bai: VD13 (Dạng 4) · y: - · trang: 155 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số chính phương lẻ có dạng (2k+1)^2 · số nguyên tố chỉ có hai ước
- kiem: khong
- ket_qua_sach: 2
- dap_an: $p=2$
- ghi_chu_nghi: Máy vét số nguyên tố p<200000: 4p+1 là số chính phương chỉ khi p=2, khớp sách. Mép trang làm mất một ký hiệu ở dòng "Do p là số nguyên tố nên k=1", dựng lại theo ngữ cảnh (k=1, p=2).
## DE
Tìm số nguyên tố $p$ để $4p+1$ là số chính phương.
## SACH
$4p+1$ là số lẻ và là số chính phương nên $4p+1=(2k+1)^2=4k^2+4k+1$ ($k$ nguyên) $\Rightarrow4p=4k(k+1)\Rightarrow p=k(k+1)$

Do $p$ là số nguyên tố nên $k=1$. Khi đó $p=2$ và $4p+1=9=3^2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $4p+1$ luôn lẻ nên nếu là số chính phương thì là bình phương của một số lẻ $2k+1$; thay vào thì $p$ biến thành tích hai số nguyên liên tiếp $k(k+1)$, mà số nguyên tố chỉ có hai ước là $1$ và chính nó.

**Bước 1.** Viết $4p+1=(2k+1)^2$ với $k$ là số tự nhiên, vì $4p+1$ lẻ nên căn bậc hai của nó cũng lẻ.

**Bước 2.** Khai triển và rút gọn hai vế để $p$ bằng một tích của hai số tự nhiên liên tiếp.

**Bước 3.** Dùng định nghĩa số nguyên tố: tích của hai số tự nhiên là số nguyên tố thì một thừa số bằng $1$, từ đó tìm $k$ rồi $p$ và thử lại.

**Chú ý:** Cách khác: $4p=(m-1)(m+1)$ với $4p+1=m^2$ rồi xét ước của $4p$; nhưng cách đặt $2k+1$ ngắn hơn.

**Phần 2. Trình bày**

Vì $4p+1$ là số lẻ và là số chính phương nên $4p+1=(2k+1)^2$ với $k\in\mathbb N$.

$4p+1=4k^2+4k+1\Leftrightarrow4p=4k(k+1)\Leftrightarrow p=k(k+1)$

Vì $p>1$ nên $k\ge1$, khi đó $k$ và $k+1$ đều là số tự nhiên lớn hơn $0$. $p$ là số nguyên tố nên một trong hai thừa số bằng $1$; vì $k+1\ge2$ nên $k=1$, suy ra $p=1\cdot2=2$.

Thử lại: $p=2$ thì $4p+1=9=3^2$ là số chính phương.

Vậy $p=2$.
