=== T7V2.1@p143
- bai: VD1 · y: - · trang: 143 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho 20 · tổng cộng dồn
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Sách giải hai cách (Cách 1: xét 11 tuần, 154 số $S(k)$ và $S(k)+20$; Cách 2: xét 21 ngày, số dư khi chia 20). Lời giải kho theo Cách 2. Máy kiểm số học của Cách 2: 21 số, 20 số dư, 0 < S(m) − S(n) ≤ 35 nên bội của 20 duy nhất là 20.
## DE
Một bà già chiều con, ngày nào cũng cho con ít nhất một chiếc kẹo. Để hạn chế, tuần bà cho không quá $12$ chiếc kẹo. Chứng minh rằng trong một số ngày liên tiếp nào đó bà mẹ đã cho con tổng số $20$ chiếc kẹo.
## SACH
Cách 1: Xét $11$ tuần liên tiếp. Gọi $S(n)$ là tổng số kẹo mà bà mẹ đã cho con tính đến ngày thứ $n$ $(1\le n\le77)$. Xét $154$ số sau: $S(1),S(2),\ldots,S(77);\ S(1)+20,S(2)+20,\ldots,S(77)+20$. Vì mỗi ngày bà mẹ cho con ít nhất $1$ chiếc kẹo nên $S(k)\ge1,\ \forall k=1,2,\ldots,77$ và mỗi tuần bà mẹ cho con không quá $12$ chiếc kẹo nên $S(k)\le11\cdot12=132,\ \forall k=1,2,\ldots,77$. Dễ thấy $S(k)\ne S(m),\ \forall k\ne m$. Mặt khác, có $154$ số chỉ nhận giá trị không quá $152$ giá trị nên tồn tại hai số bằng nhau. Vậy tồn tại $k,m$ sao cho $S(k)=S(m)+20$ hay $S(k)-S(m)=20$. Vậy kể từ ngày thứ $m+1$ đến ngày thứ $k$ bà mẹ đã cho con đúng $20$ chiếc kẹo.
Cách 2: Xét $21$ ngày liên tiếp kể từ ngày nào đó. Gọi $S(n)$ là tổng số kẹo mà bà mẹ đã cho con tính đến ngày thứ $n$ $(1\le n\le21)$. Ta có: $S(m)\ne S(n),\ \forall m\ne n\ (1\le m,n\le21)$ và $1\le S(n)\le3\cdot12=36$. Vì có $21$ tổng nên $\exists\, m>n\ (1\le m,n\le21)$ sao cho: $S(m)\equiv S(n)\pmod{20}\Rightarrow S(m)-S(n)\vdots20\Rightarrow S(m)-S(n)=20$ (vì $0<S(m)-S(n)<36$). Như vậy, kể từ ngày thứ $n+1$ đến ngày thứ $m$, bà mẹ đã cho con đúng $20$ chiếc kẹo.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cần một đoạn ngày liên tiếp có tổng đúng $20$: tổng của đoạn liên tiếp là hiệu của hai tổng cộng dồn, và hiệu chia hết cho $20$ khi hai tổng cùng số dư khi chia $20$ — đó là dấu hiệu gọi Dirichlet.

**Bước 1.** Xét $21$ ngày liên tiếp (tức $3$ tuần) kể từ một ngày bất kì và đặt $S(n)$ là tổng số kẹo cho đến ngày thứ $n$, để mọi tổng của một đoạn ngày liên tiếp đều viết được dưới dạng hiệu hai số $S$.

**Bước 2.** Dùng giả thiết "mỗi ngày ít nhất một chiếc" và "mỗi tuần không quá $12$ chiếc" để chặn $S(n)$ giữa hai số cụ thể, từ đó chặn được cả hiệu hai số $S$.

**Bước 3.** Chọn "thỏ" là các số $S(n)$ và "lồng" là các số dư khi chia cho $20$, rồi đếm xem số thỏ có vượt số lồng hay không.

**Bước 4.** Từ hai số cùng số dư suy ra hiệu chia hết cho $20$, rồi dùng cận của hiệu để chọn ra đúng một bội của $20$ thỏa mãn.

**Chú ý:** Có thể xét $11$ tuần với $154$ số $S(k)$ và $S(k)+20$ (cách của sách) nhưng lập luận dài hơn; cách xét số dư khi chia $20$ chỉ cần $21$ ngày.

**Phần 2. Trình bày**

Xét $21$ ngày liên tiếp kể từ một ngày bất kì. Với $1\le n\le21$, gọi $S(n)$ là tổng số kẹo bà đã cho con từ ngày thứ nhất đến ngày thứ $n$.

Mỗi ngày bà cho ít nhất $1$ chiếc nên $1\le S(1)<S(2)<\ldots<S(21)$.

$21$ ngày là $3$ tuần, mỗi tuần không quá $12$ chiếc nên $S(21)\le3\cdot12=36$.

Thỏ: $21$ số $S(1),S(2),\ldots,S(21)$. Lồng: $20$ số dư $0,1,\ldots,19$ khi chia cho $20$.

Vì $21>20$ nên theo nguyên tắc Dirichlet có hai số $S(m),S(n)$ với $m>n$ cùng số dư khi chia cho $20$, tức $S(m)-S(n)\vdots20$.

Mặt khác $0<S(m)-S(n)\le S(21)-S(1)\le36-1=35<40$ nên bội của $20$ trong khoảng này chỉ có thể là $20$, suy ra $S(m)-S(n)=20$.

Vậy từ ngày thứ $n+1$ đến ngày thứ $m$, bà mẹ đã cho con đúng $20$ chiếc kẹo.

=== T7V2.2@p144
- bai: VD2 · y: - · trang: 144 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · chia hình thành các hình nhỏ bằng nhau
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Sách không nói rõ điểm nằm trên cạnh chung của hai tam giác nhỏ; lời giải kho xếp điểm đó vào một tam giác chứa nó.
## DE
Trong một tam giác đều cạnh bằng $1$ (kể cả trên các cạnh), ta đặt $17$ điểm. Chứng minh rằng tồn tại hai điểm mà khoảng cách giữa chúng nhỏ hơn hoặc bằng $\dfrac{1}{4}$.
## SACH
Chia tam giác đã cho thành $16$ tam giác đều nhỏ, cạnh có độ dài bằng $\dfrac{1}{4}$. Theo nguyên tắc Dirichlet thì tồn tại ít nhất hai điểm nằm trong cùng một hình tam giác nhỏ. Hai điểm này có khoảng cách bé hơn hoặc bằng $\dfrac{1}{4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề cho nhiều điểm (17) và đòi "có hai điểm gần nhau" ở một mức khoảng cách cho trước — dấu hiệu chia hình thành các phần nhỏ có đường kính không vượt mức đó rồi dùng Dirichlet.

**Bước 1.** Tìm cách chia tam giác đều cạnh $1$ thành các tam giác đều nhỏ có cạnh đúng bằng mức khoảng cách cần chứng minh, và đếm xem có bao nhiêu tam giác nhỏ.

**Bước 2.** Xác định "thỏ" và "lồng", rồi so sánh số thỏ với số lồng để suy ra một tam giác nhỏ chứa ít nhất hai điểm.

**Bước 3.** Giải thích vì sao hai điểm bất kì trong cùng một tam giác đều nhỏ (kể cả trên cạnh) thì khoảng cách không vượt quá cạnh của nó.

**Phần 2. Trình bày**

Chia mỗi cạnh của tam giác đã cho thành $4$ phần bằng nhau, nối các điểm chia bằng các đoạn song song với các cạnh, ta được $16$ tam giác đều nhỏ có cạnh bằng $\dfrac{1}{4}$ (mỗi tam giác tính cả các cạnh của nó).

Thỏ: $17$ điểm đã cho. Lồng: $16$ tam giác đều nhỏ (điểm nằm trên cạnh chung của hai tam giác thì xếp vào một trong hai tam giác đó).

Vì $17>16$ nên theo nguyên tắc Dirichlet có ít nhất một tam giác nhỏ chứa ít nhất hai điểm.

Hai điểm bất kì trong một tam giác đều cạnh $\dfrac{1}{4}$ (kể cả trên cạnh) có khoảng cách không vượt quá cạnh của tam giác, tức không vượt quá $\dfrac{1}{4}$.

Vậy tồn tại hai điểm mà khoảng cách giữa chúng nhỏ hơn hoặc bằng $\dfrac{1}{4}$.

=== T7V2.3@p144
- bai: VD3 · y: - · trang: 144 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng)
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh trang in số ví dụ bị nhòe ("Ví dụ ?"); suy ra là VD3 vì liền sau VD2 và trước VD4.
## DE
Trong một cuộc giao lưu, mỗi người đều bắt tay với ít nhất một người khác. Chứng minh rằng có ít nhất hai người có cùng số lần bắt tay.
## SACH
Giả sử trong cuộc giao lưu đó có $n$ người. Vì số lần bắt tay của mỗi người nằm trong khoảng từ $1$ đến $n-1$ nên có ít nhất hai người có số lần bắt tay bằng nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần chỉ ra hai người cùng một giá trị "số lần bắt tay" — các người là đối tượng đem xếp, còn các giá trị có thể của số lần bắt tay là chỗ để xếp, đúng khuôn Dirichlet.

**Bước 1.** Gọi $n$ là số người trong cuộc giao lưu và xác định mỗi người có thể bắt tay với tối đa bao nhiêu người khác.

**Bước 2.** Dùng điều kiện "ít nhất một người khác" để tìm giá trị nhỏ nhất của số lần bắt tay, rồi đếm xem có bao nhiêu giá trị có thể xảy ra.

**Bước 3.** Chọn thỏ là các người, lồng là các giá trị có thể của số lần bắt tay, và so sánh hai số lượng đó.

**Phần 2. Trình bày**

Gọi $n$ là số người trong cuộc giao lưu ($n\ge2$ vì ai cũng bắt tay với một người khác).

Mỗi người bắt tay với ít nhất $1$ người và nhiều nhất $n-1$ người (không bắt tay với chính mình) nên số lần bắt tay của mỗi người là một số thuộc $\{1;2;\ldots;n-1\}$.

Thỏ: $n$ người. Lồng: $n-1$ giá trị $1,2,\ldots,n-1$ của số lần bắt tay.

Vì $n>n-1$ nên theo nguyên tắc Dirichlet có ít nhất hai người cùng một lồng, tức có cùng số lần bắt tay.

=== T7V2.4@p144
- bai: VD4 · y: - · trang: 144 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho 2003 · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Sách viết $A-B=\underbrace{66\ldots6}_{n-k}\cdot10^6$ nhưng đúng phải là $10^k$ (dòng sau sách dùng $(2003,10^k)=1$). Lời giải kho dùng $10^k$. Máy: số 66…6 gồm 1001 chữ số 6 chia hết cho 2003.
## DE
Chứng minh rằng tồn tại một số tự nhiên gồm toàn chữ số $6$ và chia hết cho $2003$.
## SACH
Xét $2004$ số có dạng: $6,66,666,\ldots,666\ldots6$. Theo nguyên tắc Dirichlet thì tồn tại hai số có cùng số dư khi chia cho $2003$. Giả sử hai số đó là: $A=\underbrace{66\ldots6}_{n}$ và $B=\underbrace{66\ldots6}_{k}$ với $k<n$. Khi đó, $A-B=\underbrace{66\ldots6}_{n-k}\cdot10^{6}$ chia hết cho $2003$. Vì $(2003,10^{k})=1$ nên $C=\underbrace{66\ldots6}_{n-k}$ chia hết cho $2003$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề đòi một số "chia hết cho $2003$" mà ta không có công thức tìm trực tiếp — dấu hiệu xét một dãy đủ dài các số có dạng cho trước rồi dùng số dư khi chia $2003$ để ép ra hai số trùng dư.

**Bước 1.** Lập dãy $2004$ số $6,66,666,\ldots$ (số thứ $t$ gồm $t$ chữ số $6$) để số lượng vượt số các số dư có thể có khi chia $2003$.

**Bước 2.** Chọn thỏ và lồng rồi suy ra hai số trong dãy cùng số dư, nên hiệu của chúng chia hết cho $2003$.

**Bước 3.** Viết hiệu đó thành tích của một số gồm toàn chữ số $6$ với một luỹ thừa của $10$.

**Bước 4.** Dùng tính nguyên tố cùng nhau giữa $2003$ và luỹ thừa của $10$ để loại luỹ thừa ấy khỏi phép chia hết.

**Phần 2. Trình bày**

Xét $2004$ số: $a_1=6,\ a_2=66,\ \ldots,\ a_{2004}=\underbrace{66\ldots6}_{2004}$ (số $a_t$ gồm $t$ chữ số $6$).

Thỏ: $2004$ số trên. Lồng: $2003$ số dư $0,1,\ldots,2002$ khi chia cho $2003$.

Theo nguyên tắc Dirichlet có hai số cùng số dư khi chia cho $2003$; gọi chúng là $A=a_n$ và $B=a_k$ với $k<n$. Khi đó $A-B\vdots2003$.

Ta có $A-B=\underbrace{66\ldots6}_{n-k}\underbrace{00\ldots0}_{k}=\underbrace{66\ldots6}_{n-k}\cdot10^{k}$.

Vì $2003$ lẻ và không chia hết cho $5$ nên $2003$ nguyên tố cùng nhau với $10^k=2^k\cdot5^k$.

Do $\underbrace{66\ldots6}_{n-k}\cdot10^{k}\vdots2003$ và $(2003,10^k)=1$ nên $C=\underbrace{66\ldots6}_{n-k}\vdots2003$.

Vậy tồn tại số tự nhiên gồm toàn chữ số $6$ chia hết cho $2003$.

=== T7V2.5@p145
- bai: VD5 · y: - · trang: 145 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho 100 · ghép số dư theo cặp tổng bằng 100
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Sách giải hai cách; Cách 2 của sách chỉ nêu các cặp (1,99),…,(49,51),(50,50) và giả sử ít nhất 51 số không chia hết cho 100. Lời giải kho theo hướng Cách 2 nhưng gộp luôn lớp số dư 0 để xét thẳng 52 số (51 lồng).
## DE
Chứng minh rằng trong $52$ số nguyên dương bất kì ta luôn tìm được hai số sao cho tổng hoặc hiệu của hai số đó chia hết cho $100$.
## SACH
Cách 1: Nếu có hai số có cùng số dư khi chia hết cho $100$ thì bài toán được giải. Giả sử không có hai số nào cùng số dư khi chia cho $100$. Khi đó, có ít nhất $51$ số khi chia cho $100$ có số dư khác $50$ là $a_1,a_2,\ldots,a_{51}$. Đặt $b_i=-a_i\ (1\le i\le51)$. Xét $102$ số: $a_i$ và $b_i$. Theo nguyên tắc Dirichlet thì tồn tại $i\ne j$ sao cho $a_i\equiv b_j\pmod{100}$. Suy ra $a_i+a_j$ chia hết cho $100$.
Cách 2: Cũng như ở cách 1, nếu có hai số cùng chia hết cho $100$ thì ta có điều phải chứng minh. Giả sử có ít nhất $51$ số không chia hết cho $100$. Xét các cặp: $(1,99),(2,98),\ldots,(49,51),(50,50)$. Suy ra có hai số mà số dư của chúng khi chia cho $100$ cùng rơi vào một cặp và ta có điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Tổng hoặc hiệu chia hết cho $100$" nghĩa là hai số có số dư bằng nhau hoặc có số dư cộng lại bằng $100$ — dấu hiệu gộp các số dư $r$ và $100-r$ vào cùng một lồng.

**Bước 1.** Liệt kê các số dư có thể có khi chia một số cho $100$, rồi nhóm chúng thành những lớp sao cho hai số cùng lớp luôn có tổng hoặc hiệu chia hết cho $100$.

**Bước 2.** Đếm số lớp, chú ý hai số dư $0$ và $50$ tự ghép với chính nó nên mỗi số dư đó tạo thành một lớp riêng.

**Bước 3.** Chọn thỏ là $52$ số đã cho, lồng là các lớp vừa lập, rồi kiểm tra từng khả năng hai số cùng lớp để kết luận.

**Chú ý:** Bài này chỉ cần có một cặp; không đòi mọi cặp đều thỏa nên không cần xét các số còn lại.

**Phần 2. Trình bày**

Xét các số dư khi chia cho $100$ là $0,1,\ldots,99$. Chia chúng vào $51$ lớp: $\{0\}$, $\{50\}$ và $\{r;100-r\}$ với $r=1,2,\ldots,49$.

Thỏ: $52$ số nguyên dương đã cho. Lồng: $51$ lớp trên (mỗi số được xếp vào lớp chứa số dư của nó khi chia cho $100$).

Vì $52>51$ nên theo nguyên tắc Dirichlet có hai số $a,b$ thuộc cùng một lớp.

Nếu $a,b$ cùng số dư (lớp $\{0\}$, lớp $\{50\}$, hoặc hai số cùng dư $r$ trong lớp $\{r;100-r\}$) thì $a-b\vdots100$.

Nếu $a,b$ có số dư lần lượt là $r$ và $100-r$ thì $a+b$ có số dư $r+(100-r)=100\equiv0$, tức $a+b\vdots100$.

Vậy trong $52$ số đã cho luôn có hai số mà tổng hoặc hiệu của chúng chia hết cho $100$.

=== T7V2.6@p145
- bai: VD6 · y: - · trang: 145 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho m
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Giữ cả bài (hai ý chứng minh, ý a là trường hợp riêng m = 10 của ý b theo chú ý của sách).
## DE
Chứng minh rằng:
a) Trong $11$ số nguyên bất kì thế nào cũng có hai số có cùng chữ số tận cùng giống nhau.
b) Trong $m+1$ số nguyên bất kì thế nào cũng có hai số có hiệu chia hết cho $m$.
## SACH
a. Một số nguyên chỉ có thể tận cùng bằng $1$ trong $10$ chữ số: $0,1,2,\ldots,9$. Lấy $11$ số nguyên, theo nguyên tắc Dirichlet, phải có hai số có cùng chữ số tận cùng giống nhau.
b. Chia một số cho $m$ thì ta có số dư là một trong $m$ số: $0,1,2,\ldots,m-1$. Do đó theo nguyên tắc Dirichlet chia $m+1$ số cho $m$ thì phải có ít nhất hai số cho cùng số dư. Hiệu của hai số này chia hết cho $m$ (đpcm).
Chú ý rằng: câu a) là trường hợp đặc biệt của câu b) khi cho $m=10$ (chữ số tận cùng của mỗi số biểu diễn số dư khi chia số đó cho $10$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai ý đều hỏi "hai số cùng một đặc điểm" khi có nhiều số hơn số đặc điểm có thể có: ý a đặc điểm là chữ số tận cùng, ý b là số dư khi chia cho $m$ — dấu hiệu dùng Dirichlet trực tiếp.

**Bước 1.** Ở ý a, đếm xem chữ số tận cùng của một số nguyên có thể nhận bao nhiêu giá trị, rồi so sánh với $11$ số đã cho.

**Bước 2.** Ở ý b, đếm các số dư có thể có khi chia một số nguyên cho $m$, rồi so với $m+1$ số đã cho.

**Bước 3.** Từ hai số cùng số dư khi chia cho $m$, suy ra hiệu của chúng chia hết cho $m$ bằng cách viết mỗi số dưới dạng $mq+r$.

**Phần 2. Trình bày**

a) Chữ số tận cùng của một số nguyên (xét giá trị tuyệt đối của nó) là một trong $10$ chữ số $0,1,2,\ldots,9$.

Thỏ: $11$ số nguyên đã cho. Lồng: $10$ chữ số tận cùng. Vì $11>10$ nên theo nguyên tắc Dirichlet có hai số cùng chữ số tận cùng.

b) Số dư khi chia một số nguyên cho $m$ là một trong $m$ số $0,1,2,\ldots,m-1$.

Thỏ: $m+1$ số nguyên đã cho. Lồng: $m$ số dư $0,1,\ldots,m-1$. Vì $m+1>m$ nên theo nguyên tắc Dirichlet có hai số $a,b$ cùng số dư $r$ khi chia cho $m$.

Viết $a=mq_1+r$, $b=mq_2+r$ thì $a-b=m(q_1-q_2)\vdots m$.

Vậy trong $m+1$ số nguyên bất kì luôn có hai số có hiệu chia hết cho $m$.

=== T7V2.7@p145
- bai: VD7 · y: - · trang: 145 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · tổng cộng dồn · số dư khi chia cho m · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach: Chứng minh; Có
- dap_an: Chứng minh; Có
- ghi_chu_nghi: Sách ở ý b lập 1990 số 1991…1991 và lấy hiệu, nhưng hiệu đó có số chữ số 0 ở cuối là 4i (thay đổi), không phải đúng sáu chữ số 0 như đề in. Lời giải kho chứng minh đúng dạng đề in (1991…1991 rồi sáu chữ số 0) bằng cách xét số dư khi chia 199. Máy: số 1991 viết 99 lần nhân 10^6 chia hết cho 1990; trong 200 số N_1..N_200 có hai số cùng dư mod 199 (N_99 và N_198, cùng dư 0).
## DE
a) Chứng minh rằng trong $m$ số nguyên bất kì, bao giờ cũng có một số chia hết cho $m$ hoặc ít nhất hai số có tổng chia hết cho $m$.
b) Có hay không có một số có dạng $19911991\ldots1991000000$ chia hết cho $1990$?
## SACH
a. Gọi $m$ số nguyên đã cho là $a_1,a_2,\ldots,a_m$. Ta lập $m$ tổng: $S_1=a_1;S_2=a_1+a_2;S_3=a_1+a_2+a_3;\ldots S_m=a_1+a_2+a_3+\ldots+a_m$. Có tất cả hai trường hợp:
– Một trong các tổng trên chia hết cho $m$. Đó là điều phải chứng minh.
– Không có một tổng nào trong các tổng trên chia hết cho $m$; như vậy số dư khi chia mỗi tổng trên cho $m$ là một số từ $1$ đến $m-1$ (có tất cả $m-1$ số dư). Ta có $m$ tổng, do đó theo nguyên tắc Dirichlet, phải có hai tổng có cùng số dư $(\ne0)$ khi chia cho $m$. Hiệu của hai tổng này (là tổng của một số các số đã cho) chia hết cho $m$ (đpcm).
b. Ta lập $1990$ số có dạng: $1991$; $1991\ 1991$; $1991\ 1991\ 1991$; …; $1991\ 1991\ \ldots\ 1991$ (bốn chữ số $1,9,9,1$ được lặp lại $1990$ lần). Chia các số trên đây cho $1990$, ta có $1989$ số dư khác $0$. Theo nguyên tắc Dirichlet, phải có ít nhất hai số cho cùng một số dư, hiệu hai số này (là một số có dạng $1991\ 1991\ \ldots\ 0000$) chia hết cho $1990$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả hai ý đều đòi một "tổng liên tiếp" hoặc một số dạng lặp chia hết cho một số cho trước — dấu hiệu lập dãy tổng cộng dồn rồi xét số dư để hiệu của hai tổng cộng dồn chính là tổng liên tiếp cần tìm.

**Bước 1.** Ở ý a, lập $m$ tổng cộng dồn $S_1,\ldots,S_m$ và chia hai trường hợp: có một tổng chia hết cho $m$, hoặc không có tổng nào chia hết.

**Bước 2.** Trong trường hợp không có tổng nào chia hết, đếm số dư khả dĩ (chỉ còn $m-1$ giá trị khác $0$) rồi so với $m$ tổng để chỉ ra hai tổng cùng dư.

**Bước 3.** Ở ý b, nhận xét $1990=10\cdot199$ nên chỉ cần tìm số $1991\ldots1991$ chia hết cho $199$ (sáu chữ số $0$ ở cuối đã lo phần $10$), rồi lập dãy các số $1991,19911991,\ldots$ để xét số dư khi chia $199$.

**Bước 4.** Từ hai số cùng dư mod $199$, lấy hiệu, tách luỹ thừa của $10$ ra và dùng tính nguyên tố cùng nhau để suy ra số $1991\ldots1991$ chia hết cho $199$.

**Chú ý:** Hiệu $S_j-S_i$ ở ý a có thể chỉ gồm một số hạng; khi đó chính số hạng ấy chia hết cho $m$, nên vẫn thuộc kết luận "một số chia hết cho $m$".

**Phần 2. Trình bày**

a) Gọi $m$ số đã cho là $a_1,a_2,\ldots,a_m$. Lập $m$ tổng $S_1=a_1$, $S_2=a_1+a_2$, …, $S_m=a_1+a_2+\ldots+a_m$.

Trường hợp 1: có một tổng $S_k\vdots m$. Nếu $k=1$ thì $a_1\vdots m$; nếu $k\ge2$ thì $S_k$ là tổng của $k\ge2$ số đã cho chia hết cho $m$. Bài toán được chứng minh.

Trường hợp 2: không có tổng nào chia hết cho $m$. Khi đó số dư khi chia mỗi $S_k$ cho $m$ thuộc $\{1;2;\ldots;m-1\}$.

Thỏ: $m$ tổng $S_1,\ldots,S_m$. Lồng: $m-1$ số dư $1,2,\ldots,m-1$. Vì $m>m-1$ nên theo nguyên tắc Dirichlet có hai tổng $S_i,S_j$ $(i<j)$ cùng số dư, suy ra $S_j-S_i=a_{i+1}+\ldots+a_j\vdots m$.

Đó là tổng của một hoặc nhiều số đã cho chia hết cho $m$: một số (nếu $j=i+1$) chia hết cho $m$, hoặc ít nhất hai số có tổng chia hết cho $m$.

b) Vì $1990=10\cdot199$ và $(10;199)=1$ nên số $M\cdot10^6$ chia hết cho $1990$ khi $M\vdots199$.

Với $t=1,2,\ldots,200$, gọi $N_t$ là số gồm $t$ nhóm $1991$ viết liền nhau.

Thỏ: $200$ số $N_1,\ldots,N_{200}$. Lồng: $199$ số dư $0,1,\ldots,198$ khi chia cho $199$. Vì $200>199$ nên có $N_i,N_j$ $(i<j)$ cùng số dư khi chia cho $199$, tức $N_j-N_i\vdots199$.

Ta có $N_j-N_i=M\cdot10^{4i}$ với $M$ là số gồm $j-i$ nhóm $1991$ viết liền nhau.

Vì $199$ là số nguyên tố khác $2$ và $5$ nên $(199;10^{4i})=1$, suy ra $M\vdots199$.

Khi đó $M\cdot10^6$ (là số $1991\,1991\ldots1991\,000000$) chia hết cho $10$ và cho $199$, mà $(10;199)=1$ nên chia hết cho $1990$.

Vậy có một số có dạng $19911991\ldots1991000000$ chia hết cho $1990$.

=== T7V2.8@p146
- bai: VD8 · y: - · trang: 146 · tang: nang_cao
- nguon_de: Đề thi học sinh giỏi toán cấp II toàn quốc, 1983
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho 10^5 · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: 1983^k − 1 chia hết cho 10^5 với k = 2500 nhỏ nhất, nằm trong 1..10^5.
## DE
(Đề thi học sinh giỏi toán cấp II toàn quốc, 1983) Chứng minh rằng trong các số tự nhiên thế nào cũng có số $k$ sao cho $1983^k-1$ chia hết cho $10^5$.
## SACH
Cho $k$ lần lượt lấy $10^5+1$ giá trị liên tiếp, từ $1$ trở đi, ta được $10^5+1$ giá trị khác nhau của $1983^k-1$. Chia $10^5+1$ số này cho $10^5$, ta chỉ có nhiều nhất là $10^5$ số dư; vì vậy theo nguyên tắc Dirichlet, phải có ít nhất hai số cho cùng số dư khi chia cho $10^5$. Giả sử số đó là $1983^m-1$ và $1983^n-1$ $(m>n)$. Thế thì hiệu của hai số này phải chia hết cho $10^5$: $(1983^m-1)-(1983^n-1)$ chia hết cho $10^5$. Mà $(1983^m-1)-(1983^n-1)=1983^m-1983^n=1983^n(1983^{m-n}-1)$. Nhưng có $10^5$ và $1983^n$ nguyên tố cùng nhau, do đó phải có $1983^{m-n}-1$ chia hết cho $10^5$. Như vậy là có số $k'=m-n$ sao cho $1983^{k'}-1$ chia hết cho $10^5$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn một hiệu dạng $1983^{k}-1$ chia hết cho $10^5$ thì xét các luỹ thừa $1983^1,1983^2,\ldots$ nhiều hơn $10^5$ số, lấy hai số cùng dư rồi chia nhỏ hiệu — dấu hiệu Dirichlet dạng "dãy luỹ thừa".

**Bước 1.** Lập dãy $10^5+1$ luỹ thừa $1983^1,1983^2,\ldots,1983^{10^5+1}$ để số lượng vượt số các số dư có thể có khi chia cho $10^5$.

**Bước 2.** Chọn thỏ và lồng, suy ra hai luỹ thừa $1983^m,1983^n$ cùng số dư khi chia $10^5$, nên hiệu của chúng chia hết cho $10^5$.

**Bước 3.** Đặt $1983^n$ làm nhân tử chung của hiệu để xuất hiện biểu thức $1983^{m-n}-1$ cần chứng minh.

**Bước 4.** Chứng tỏ $1983^n$ nguyên tố cùng nhau với $10^5$ để bỏ nó khỏi phép chia hết, từ đó đọc ra số mũ $k=m-n$.

**Phần 2. Trình bày**

Xét $10^5+1$ số $1983^1,1983^2,\ldots,1983^{10^5+1}$ (ứng với $k=1,2,\ldots,10^5+1$).

Thỏ: $10^5+1$ số trên. Lồng: $10^5$ số dư $0,1,\ldots,10^5-1$ khi chia cho $10^5$.

Theo nguyên tắc Dirichlet có hai số $1983^m$ và $1983^n$ $(m>n\ge1)$ cùng số dư khi chia cho $10^5$, nên $1983^m-1983^n\vdots10^5$.

Ta có $1983^m-1983^n=1983^n(1983^{m-n}-1)$.

Số $1983$ lẻ và không chia hết cho $5$ nên $1983^n$ không có ước nguyên tố $2$ hoặc $5$, do đó $(1983^n;10^5)=1$.

Vì $1983^n(1983^{m-n}-1)\vdots10^5$ và $(1983^n;10^5)=1$ nên $1983^{m-n}-1\vdots10^5$.

Vậy tồn tại số tự nhiên $k=m-n\ge1$ để $1983^k-1$ chia hết cho $10^5$.

=== T7V3.1@p146
- bai: VD1 · y: - · trang: 146 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nguyên tắc Dirichlet (thỏ – lồng) · số dư khi chia cho 2003 · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach: Chứng minh
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải của sách nằm ở đầu trang 147 (đề ở cuối trang 146). Máy: số gồm 1001 nhóm 2004 chia hết cho 2003.
## DE
Chứng minh rằng tồn tại một bội số của $2003$ có dạng $\underbrace{20042004\ldots2004}_{k}$ (nhóm $2004$ viết $k$ lần liền nhau).
## SACH
Xét $2004$ số: $a_1=2004$; $a_2=20042004\ldots$; $a_{2004}=20042004\ldots2004$ (nhóm $2004$ có mặt $2004$ lần). Theo nguyên lí Dirichlet, tồn tại hai số có cùng số dư khi thực hiện phép chia cho $2003$. Gọi hai số đó là $a_m$ và $a_n$ $(1\le n<m\le2004)$ thì $a_m-a_n\vdots2003$. Ta có: $a_m-a_n=2004\ldots20040000\ldots0000=\underbrace{2004\ldots2004}_{m-n}\cdot10^{4n}$. Do $10^{4n}$ và $2003$ nguyên tố cùng nhau nên $\underbrace{2004\ldots2004}_{m-n}$ chia hết cho $2003$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần một số dạng lặp chia hết cho $2003$ mà ta không tính trực tiếp được — dấu hiệu lập dãy các số có dạng lặp rồi xét số dư khi chia $2003$ để ép hai số trùng dư, hiệu của chúng lại có dạng lặp.

**Bước 1.** Lập dãy $2004$ số $a_1,a_2,\ldots,a_{2004}$ với $a_t$ gồm nhóm $2004$ viết $t$ lần, để số các số vượt số số dư khi chia cho $2003$.

**Bước 2.** Chọn thỏ và lồng rồi kết luận có hai số trong dãy cùng số dư, nên hiệu của chúng chia hết cho $2003$.

**Bước 3.** Viết hiệu $a_m-a_n$ thành tích của số dạng $2004\ldots2004$ (có $m-n$ nhóm) với một luỹ thừa của $10$.

**Bước 4.** Nhận ra $2003$ nguyên tố cùng nhau với luỹ thừa của $10$ để suy ra thừa số dạng lặp chia hết cho $2003$.

**Phần 2. Trình bày**

Xét $2004$ số $a_1=2004$, $a_2=20042004$, …, $a_{2004}=20042004\ldots2004$ (số $a_t$ gồm nhóm $2004$ viết $t$ lần).

Thỏ: $2004$ số $a_1,\ldots,a_{2004}$. Lồng: $2003$ số dư $0,1,\ldots,2002$ khi chia cho $2003$.

Theo nguyên tắc Dirichlet có hai số $a_m,a_n$ $(1\le n<m\le2004)$ cùng số dư khi chia cho $2003$, tức $a_m-a_n\vdots2003$.

Ta có $a_m-a_n=\underbrace{2004\ldots2004}_{m-n}\underbrace{00\ldots0}_{4n}=\underbrace{2004\ldots2004}_{m-n}\cdot10^{4n}$.

Vì $2003$ lẻ và không chia hết cho $5$ nên $(2003;10^{4n})=1$.

Do $\underbrace{2004\ldots2004}_{m-n}\cdot10^{4n}\vdots2003$ và $(2003;10^{4n})=1$ nên $\underbrace{2004\ldots2004}_{m-n}\vdots2003$.

Vậy tồn tại bội số của $2003$ có dạng $\underbrace{20042004\ldots2004}_{k}$ với $k=m-n$.

=== T7V3.2a@p147
- bai: VD2 · y: a · trang: 147 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bội số (BS) · lũy thừa sát một bội số · số dư khi chia cho 9
- kiem: khong
- ket_qua_sach: 7
- dap_an: $7$
- ghi_chu_nghi: Máy: pow(2,100,9)=7, khớp sách.
## DE
Tìm số dư khi chia $2^{100}$ cho $9$.
## SACH
Luỹ thừa của $2$ sát với một bội số của $9$ là $2^3=8=9-1$. Ta có $2^{100}=2(2^3)^{33}=2(9-1)^{33}=2(\mathrm{BS}\ 9-1)=\mathrm{BS}\ 9-2=\mathrm{BS}\ 9+7$. Số dư khi chia $2^{100}$ cho $9$ là $7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số mũ lớn thì không tính trực tiếp được — tìm một luỹ thừa của $2$ sát một bội của $9$ (hơn hoặc kém $1$) rồi ghép $2^{100}$ từ luỹ thừa đó, vì luỹ thừa của $(9-1)$ chỉ có số dư $\pm1$.

**Bước 1.** Thử vài luỹ thừa nhỏ của $2$ để tìm luỹ thừa kém một bội của $9$ đúng $1$ đơn vị.

**Bước 2.** Tách $2^{100}$ thành tích của một thừa số nhỏ với luỹ thừa vừa tìm, sao cho số mũ ngoài là số nguyên.

**Bước 3.** Khai triển luỹ thừa của $(9-1)$ theo dạng "bội của $9$ cộng số dư" rồi nhân với thừa số còn lại để đọc số dư.

**Phần 2. Trình bày**

$2^3=8=9-1$, nên $2^{100}=2\cdot2^{99}=2(2^3)^{33}=2(9-1)^{33}$.

Vì $(9-1)^{33}=\mathrm{BS}\ 9-1$ (số mũ $33$ lẻ) nên $2^{100}=2(\mathrm{BS}\ 9-1)=\mathrm{BS}\ 9-2=\mathrm{BS}\ 9+7$.

Vậy số dư khi chia $2^{100}$ cho $9$ là $7$.

=== T7V3.2b@p147
- bai: VD2 · y: b · trang: 147 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bội số (BS) · lũy thừa sát một bội số · số dư khi chia cho 25
- kiem: khong
- ket_qua_sach: 1
- dap_an: $1$
- ghi_chu_nghi: Máy: pow(2,100,25)=1, khớp sách.
## DE
Tìm số dư khi chia $2^{100}$ cho $25$.
## SACH
Luỹ thừa của $2$ sát với một bội số của $25$ là $2^{10}=1024=\mathrm{BS}\ 25-1$. Ta có $2^{100}=(2^{10})^{10}=(\mathrm{BS}\ 25-1)^{10}=\mathrm{BS}\ 25+1$. Số dư khi chia $2^{100}$ cho $25$ là $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số mũ $100$ chia hết cho $10$ và $2^{10}=1024$ chỉ hơn một bội của $25$ đúng $1$ đơn vị, nên viết $2^{100}$ thành luỹ thừa của $2^{10}$ để dùng nhị thức $(\mathrm{BS}\ 25-1)^{10}$.

**Bước 1.** Tìm luỹ thừa của $2$ có dạng "bội của $25$ cộng hoặc trừ $1$" bằng cách tính $2^{10}$ rồi so với bội gần nhất của $25$.

**Bước 2.** Viết $2^{100}$ thành luỹ thừa bậc $10$ của luỹ thừa vừa tìm.

**Bước 3.** Khai triển và để ý số mũ $10$ chẵn để xác định dấu của số dư.

**Phần 2. Trình bày**

$2^{10}=1024=1025-1=\mathrm{BS}\ 25-1$.

$2^{100}=(2^{10})^{10}=(\mathrm{BS}\ 25-1)^{10}=\mathrm{BS}\ 25+1$ (số mũ $10$ chẵn).

Vậy số dư khi chia $2^{100}$ cho $25$ là $1$.

=== T7V3.2c@p147
- bai: VD2 · y: c · trang: 147 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: công thức nhị thức Niu-tơn · bội số (BS) · số dư khi chia cho 125
- kiem: khong
- ket_qua_sach: 1
- dap_an: $1$
- ghi_chu_nghi: Sách in sai ở dòng kết luận của ý c: "Số dư khi chia $2^{100}$ cho 25 là 1" (đề và lập luận ngay trên là chia cho 125, $2^{100}=\mathrm{BS}\ 125+1$). Máy: pow(2,100,125)=1, khớp. Lời giải kho theo bản đúng (chia cho 125). Sách có Chú ý tổng quát ngay sau ý c, chép ở SACH.
## DE
Tìm số dư khi chia $2^{100}$ cho $125$.
## SACH
Dùng công thức Niu-tơn: $2^{100}=(5-1)^{50}=5^{50}-50\cdot5^{49}+\ldots+\dfrac{50\cdot49}{2}\cdot5^2-50\cdot5+1$. Không kể phần hệ số của khai triển Niu-tơn thì $48$ số hạng đầu đã chứa luỹ thừa của $5$ với số mũ lớn hơn hoặc bằng $3$ nên chia hết cho $125$. Hai số hạng tiếp theo cũng chia hết cho $125$, số hạng cuối cùng là $1$. Vậy $2^{100}=\mathrm{BS}\ 125+1$. Số dư khi chia $2^{100}$ cho $25$ là $1$.
Chú ý: Tổng quát hơn, ta chứng minh được rằng nếu một số tự nhiên không chia hết cho $5$ thì chia $n^{100}$ cho $125$ ta được số dư là $1$. Thật vậy, $n$ có dạng $5k\pm1$ hoặc $5k\pm2$. Ta có: $(5k\pm1)^{100}=(5k)^{100}\pm\ldots+\dfrac{100\cdot99}{2}(5k)^2\pm100\cdot5k+1=\mathrm{BS}\ 125+1$; $(5k\pm2)^{100}=(5k)^{100}\pm\ldots+\dfrac{100\cdot99}{2}(5k)^2\cdot2^{98}\pm100\cdot5k\cdot2^{99}+2^{100}=\mathrm{BS}\ 125+2^{100}$. Ta lại có: $2^{100}=\mathrm{BS}\ 125+1$. Do đó $(5k\pm2)^{100}=\mathrm{BS}\ 125+1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $125=5^3$ và $2^{100}=4^{50}=(5-1)^{50}$ — số mũ $50$ lớn nên dùng khai triển nhị thức Niu-tơn của $(5-1)^{50}$, trong đó hầu hết các số hạng chứa $5$ với số mũ từ $3$ trở lên nên chia hết cho $125$.

**Bước 1.** Viết $2^{100}$ thành $(5-1)^{50}$ rồi khai triển theo công thức nhị thức Niu-tơn.

**Bước 2.** Chỉ ra những số hạng nào chắc chắn chia hết cho $125$ nhờ luỹ thừa của $5$ đứng trong chúng, và đếm xem còn lại những số hạng nào.

**Bước 3.** Tính riêng các số hạng còn lại rồi cộng để đọc số dư khi chia cho $125$.

**Chú ý:** Kết quả này tổng quát cho mọi số $n$ không chia hết cho $5$: $n^{100}$ chia $125$ luôn dư $1$.

**Phần 2. Trình bày**

$2^{100}=(5-1)^{50}=\displaystyle\sum_{i=0}^{50}\binom{50}{i}5^{50-i}(-1)^i$.

Với $i=0,1,\ldots,47$ thì $5^{50-i}$ có số mũ không nhỏ hơn $3$ nên các số hạng này chia hết cho $125$.

Ba số hạng cuối ($i=48,49,50$) là $\dfrac{50\cdot49}{2}\cdot5^2-50\cdot5+1=1225\cdot25-250+1$.

Ta có $1225\cdot25=30625=125\cdot245$ và $250=125\cdot2$ nên hai số hạng đầu trong ba số này chia hết cho $125$.

Vậy $2^{100}=\mathrm{BS}\ 125+1$, tức số dư khi chia $2^{100}$ cho $125$ là $1$.

=== T7V3.3@p148
- bai: VD3 · y: - · trang: 148 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số dư khi chia cho 1000 = 8·125 · nhị thức Niu-tơn · dấu hiệu chia hết cho 8
- kiem: khong
- ket_qua_sach: 376
- dap_an: $376$
- ghi_chu_nghi: Máy: pow(2,100,1000)=376 và 376 là số duy nhất trong {126,376,626,876} chia hết cho 8. Số ví dụ trên ảnh trang bị nhòe ("Ví dụ ?"), suy ra VD3 theo thứ tự.
## DE
Tìm ba chữ số tận cùng của $2^{100}$ khi viết trong hệ thập phân.
## SACH
Tìm ba chữ số tận cùng của $2^{100}$ là tìm số dư khi chia $2^{100}$ cho $1000$. Trước hết tìm số dư khi chia $2^{100}$ cho $125$. Theo ví dụ 2 ta có $2^{100}=\mathrm{BS}\ 125+1$, mà $2^{100}$ là số chẵn, nên ba chữ số tận cùng của nó chỉ có thể là $126$, $376$, $626$ hoặc $876$. Hiển nhiên $2^{100}$ chia hết cho $8$ nên ba chữ số tận cùng của nó phải chia hết cho $8$. Trong bốn số trên chỉ có $376$ chia hết cho $8$. Vậy ba chữ số tận cùng của $2^{100}$ là $376$.
Chú ý: Bạn đọc tự chứng minh rằng nếu $n$ là số chẵn không chia hết cho $5$ thì ba chữ số tận cùng của $n^{100}$ là $376$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba chữ số tận cùng chính là số dư khi chia cho $1000=8\cdot125$ với $8$ và $125$ nguyên tố cùng nhau, nên tìm số dư theo $125$ (dùng Niu-tơn) và điều kiện chia hết cho $8$ rồi ghép lại.

**Bước 1.** Đổi yêu cầu thành "tìm số dư khi chia cho $1000$" và phân tích $1000=8\cdot125$.

**Bước 2.** Tìm số dư khi chia $2^{100}$ cho $125$ bằng khai triển $(5-1)^{50}$, rồi liệt kê các số có ba chữ số cùng số dư đó.

**Bước 3.** Dùng tính chẵn và tính chia hết cho $8$ của $2^{100}$ để loại dần các khả năng trong danh sách.

**Chú ý:** Ba chữ số tận cùng chia hết cho $8$ thì cả số chia hết cho $8$ vì $1000$ chia hết cho $8$.

**Phần 2. Trình bày**

Gọi $x$ $(0\le x\le999)$ là số dư khi chia $2^{100}$ cho $1000$; $x$ chính là ba chữ số tận cùng của $2^{100}$.

Ta có $2^{100}=(5-1)^{50}=\mathrm{BS}\ 125+1$ (số hạng $i\le47$ chứa $5^3$; ba số hạng cuối là $1225\cdot25-250+1=\mathrm{BS}\ 125+1$).

Vì $1000=8\cdot125$ nên $x\equiv1\pmod{125}$, tức $x\in\{1;126;251;376;501;626;751;876\}$.

$2^{100}$ chẵn mà $1000$ chẵn nên $x$ chẵn: $x\in\{126;376;626;876\}$.

$2^{100}\vdots8$ và $1000\vdots8$ nên $x\vdots8$. Trong bốn số trên: $126=8\cdot15+6$, $626=8\cdot78+2$, $876=8\cdot109+4$ đều không chia hết cho $8$, còn $376=8\cdot47$.

Vậy ba chữ số tận cùng của $2^{100}$ là $376$.

=== T7V3.4@p148
- bai: VD4 · y: - · trang: 148 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số dư khi chia cho 10000 = 16·625 · hằng đẳng thức a^n − 1 chia hết cho a − 1 · bội số (BS)
- kiem: khong
- ket_qua_sach: 5625
- dap_an: $5625$
- ghi_chu_nghi: Sách giải hai cách; lời giải kho theo Cách 2 (chia cho 10000). Máy: pow(5,1994,10000)=5625, khớp sách. Số ví dụ trên ảnh bị nhòe, suy ra VD4 theo thứ tự.
## DE
Tìm bốn chữ số tận cùng của $5^{1994}$ khi viết trong hệ thập phân.
## SACH
Cách 1: $5^4=625$. Ta thấy số tận cùng bằng $0625$ nâng lên luỹ thừa nguyên dương bất kì vẫn tận cùng bằng $0625$ (chỉ kiểm tra: $\ldots0626\times\ldots0625=\ldots0625$). Do đó: $5^{1994}=5^{4k+2}=25(5^4)^k=25(0625)^k=25(\ldots0625)=\ldots5625$.
Cách 2: Tìm số dư khi chia $5^{1994}$ cho $10000=2^4\cdot5^4$. Nhận xét: $5^{4k}-1$ chia hết cho $5^4-1=(5^2-1)(5^2+1)$ nên chia hết cho $16$. Ta có: $5^{1994}=5^6(5^{1988}-1)+5^6$. Do $5^6$ chia hết cho $5^4$, còn $5^{1988}-1$ chia hết cho $16$ (theo nhận xét trên) nên $5^6(5^{1988}-1)$ chia hết cho $10000$. Tính $5^6$, ta được $15625$. Vậy bốn chữ số tận cùng của $5^{1994}$ là $5625$.
Chú ý: Nếu $5^{1994}=5^2(5^{1992}-1)+5^2$ thì ta có $5^{1992}-1$ chia hết cho $16$, nhưng $5^2$ không chia hết cho $5^4$. Như vậy trong bài toán này, ta cần viết $5^{1994}$ dưới dạng $5^n(5^{1994-n}-1)+5^n$ sao cho $n\ge4$ và $1994-n$ chia hết cho $4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bốn chữ số tận cùng là số dư khi chia cho $10000=16\cdot625$, mà $5^{1994}$ đã chứa nhiều thừa số $5$, nên chỉ phải xử lí phần thừa số $16$: viết $5^{1994}=5^n(5^{1994-n}-1)+5^n$ với $n\ge4$ và $1994-n$ chia hết cho $4$.

**Bước 1.** Đổi yêu cầu thành tìm số dư khi chia cho $10000$ và tách $10000=2^4\cdot5^4=16\cdot625$.

**Bước 2.** Chọn số mũ $n$ vừa không nhỏ hơn $4$ vừa làm $1994-n$ chia hết cho $4$, rồi tách $5^{1994}$ thành $5^n(5^{1994-n}-1)+5^n$.

**Bước 3.** Chứng minh $5^{1994-n}-1$ chia hết cho $16$ nhờ tính chia hết của $a^k-1$ cho $a-1$ với $a=5^4$.

**Bước 4.** Tính số $5^n$ còn lại để đọc bốn chữ số tận cùng.

**Chú ý:** Chọn $n=2$ không được vì khi đó $5^2$ không chia hết cho $5^4$.

**Phần 2. Trình bày**

Bốn chữ số tận cùng của $5^{1994}$ là số dư khi chia cho $10000=16\cdot625=2^4\cdot5^4$.

Ta có $5^{1994}=5^6\cdot5^{1988}=5^6(5^{1988}-1)+5^6$.

$5^{1988}=(5^4)^{497}$ nên $5^{1988}-1$ chia hết cho $5^4-1=624=16\cdot39$, suy ra $5^{1988}-1\vdots16$.

$5^6\vdots5^4=625$ và $(5^{1988}-1)\vdots16$ nên $5^6(5^{1988}-1)\vdots625\cdot16=10000$.

Do đó $5^{1994}$ và $5^6=15625$ có cùng số dư khi chia cho $10000$, bằng $5625$.

Vậy bốn chữ số tận cùng của $5^{1994}$ là $5625$.

=== T7V3.5@p148
- bai: VD5 · y: - · trang: 148 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: công thức nhị thức Niu-tơn · bội số (BS) · số dư khi chia cho 1000
- kiem: khong
- ket_qua_sach: 001
- dap_an: $001$
- ghi_chu_nghi: Sách viết gọn "BS 1000 + … BS 500 − 500 + 1 = BS 1000 + 1" — dòng "BS 500 − 500" chưa chặt vì BS 500 chưa chắc ≡ 500 (mod 1000). Lời giải kho tính đúng: số hạng 50·49/2·10² = 122500 ≡ 500 (mod 1000), nên 122500 − 500 chia hết cho 1000. Máy: pow(3,100,1000)=1, khớp sách (chữ số tận cùng 001). Phần "Chú ý" tổng quát của sách chép đủ ở SACH.
## DE
Tìm ba chữ số tận cùng của $3^{100}$.
## SACH
$3^{100}=(10-1)^{50}=10^{50}-\ldots+\dfrac{50\cdot49}{2}\cdot10^2-50\cdot10+1=\mathrm{BS}\ 1000+\ldots\mathrm{BS}\ 500-500+1=\mathrm{BS}\ 1000+1$. Vậy $3^{100}$ có tận cùng là $001$.
Chú ý: Tổng quát, ta chứng minh được rằng nếu $n$ là số lẻ không chia hết cho $5$ thì ba chữ số tận cùng của $n^{100}$ là $001$. Trước hết, ta thấy một số $n$ không chia hết cho $5$ thì chia cho $125$ có số dư bằng $1$. Điều này đã được chứng minh ở chú ý của ví dụ 2. Ở đây, do có thêm điều kiện $n$ là số lẻ nên còn có thể chứng minh bằng cách sau: $n$ tận cùng bằng $1,3,7,9\Rightarrow n^4$ tận cùng bằng $1$. $\Rightarrow n^{100}=(n^4)^{25}=(10k+1)^{25}=\mathrm{BS}\ 1000+\dfrac{25\cdot24}{2}(10k)^2+25\cdot10k+1=\mathrm{BS}\ 125+1$ (1). Ta có $n^{100}=(n^{50})^2$ là số chính phương lẻ (vì $n$ lẻ) nên chia cho $8$ dư $1$ (2). Từ (1) và (2) suy ra $n^{100}-1$ chia hết cho $1000$, tức là tận cùng bằng $001$. Từ kết quả này, ta còn suy ra: Nếu $n$ là số lẻ không chia hết cho $5$ thì $n^{101}$ và $n$ có ba chữ số tận cùng như nhau.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $3^{100}=9^{50}=(10-1)^{50}$ và $1000=10^3$ — số mũ lớn nên khai triển nhị thức Niu-tơn của $(10-1)^{50}$, trong đó các số hạng chứa $10^3$ trở lên không ảnh hưởng đến ba chữ số tận cùng.

**Bước 1.** Viết $3^{100}$ thành $(10-1)^{50}$ để phép chia cho $1000$ liên hệ trực tiếp với luỹ thừa của $10$.

**Bước 2.** Khai triển và loại các số hạng chứa $10^3$ trở lên, vì chúng chia hết cho $1000$.

**Bước 3.** Tính chính xác ba số hạng cuối rồi cộng lại để lấy số dư khi chia cho $1000$.

**Chú ý:** Phải tính đủ giá trị số hạng ở giữa ($122500$ chứ không chỉ ghi "bội của $500$") thì mới biết chính xác phần dư.

**Phần 2. Trình bày**

$3^{100}=9^{50}=(10-1)^{50}=\displaystyle\sum_{i=0}^{50}\binom{50}{i}10^{50-i}(-1)^i$.

Các số hạng ứng với $i=0,1,\ldots,47$ chứa $10^{3}$ trở lên nên chia hết cho $1000$.

Ba số hạng cuối là $\dfrac{50\cdot49}{2}\cdot10^2-50\cdot10+1=122500-500+1=122000+1$.

Vì $122000=1000\cdot122$ nên $3^{100}=\mathrm{BS}\ 1000+1$.

Vậy ba chữ số tận cùng của $3^{100}$ là $001$.

=== T7V3.6@p149
- bai: VD6 · y: - · trang: 149 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bội số (BS) · số dư khi chia cho 4 · xét tính chẵn lẻ
- kiem: khong
- ket_qua_sach: 2
- dap_an: $2$
- ghi_chu_nghi: Sách giải hai cách; lời giải kho theo Cách 1 (số dư khi chia 4), nhắc Cách 2 ở Chú ý. Máy: duyệt 2197 ước a của 455^12 (a·b = 455^12), mọi trường hợp đều có (a+b) mod 4 = 2.
## DE
Cho $ab=455^{12}$. Tìm số dư trong phép chia $a+b$ cho $4$.
## SACH
Cách 1: Ta thấy $455^{12}=(\mathrm{BS}\ 4-1)^{12}=\mathrm{BS}\ 4+1$. Do đó, $a$ và $b$ chia cho $4$ cùng dư $1$ hoặc cùng dư $3$. Trong cả $2$ trường hợp trên, $a+b$ chia cho $4$ dư $2$.
Cách 2: Xét biểu thức $ab+a+b+1=a(b+1)+(b+1)=(b+1)(a+1)$. Do $a$ và $b$ lẻ nên $(b+1)(a+1)$ chia hết cho $4$, tức là: $(ab+1)+(a+b)$ chia hết cho $4$ (1). Ta thấy: $ab=455^{12}=(\mathrm{BS}\ 4-1)^{12}=\mathrm{BS}\ 4+1\Rightarrow ab+1=\mathrm{BS}\ 4+2$ (2). Từ (1) và (2) suy ra $a+b=\mathrm{BS}\ 4+2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tích $ab$ chia $4$ dư $1$ và $a,b$ lẻ nên mỗi số chỉ có thể dư $1$ hoặc $3$ khi chia $4$ — chỉ còn bốn cặp số dư để kiểm tra, ghép lại với điều kiện tích dư $1$ sẽ ra số dư của tổng.

**Bước 1.** Tính số dư của $ab=455^{12}$ khi chia $4$ bằng cách viết $455$ dưới dạng bội của $4$ trừ đi $1$.

**Bước 2.** Từ tích lẻ suy ra $a$ và $b$ đều lẻ, nên số dư của mỗi số khi chia $4$ chỉ là $1$ hoặc $3$.

**Bước 3.** Xét lần lượt giá trị số dư của $a$ để dùng điều kiện tích dư $1$ tìm số dư của $b$, rồi cộng hai số dư.

**Chú ý:** Có thể xét $(a+1)(b+1)=ab+a+b+1$: hai thừa số chẵn nên tích chia hết cho $4$, suy ra $a+b\equiv-(ab+1)\equiv-2\equiv2\pmod4$.

**Phần 2. Trình bày**

$455=4\cdot114-1$ nên $455^{12}=(\mathrm{BS}\ 4-1)^{12}=\mathrm{BS}\ 4+1$ (số mũ $12$ chẵn). Vậy $ab\equiv1\pmod4$.

Vì $ab$ lẻ nên $a$ và $b$ đều lẻ, do đó mỗi số chia cho $4$ dư $1$ hoặc $3$.

Nếu $a\equiv1\pmod4$ thì $ab\equiv b\equiv1$, suy ra $b\equiv1$ và $a+b\equiv2\pmod4$.

Nếu $a\equiv3\pmod4$ thì $ab\equiv3b\equiv1$; $b$ dư $1$ cho $3b\equiv3$, còn $b$ dư $3$ cho $3b\equiv9\equiv1$, nên $b\equiv3$ và $a+b\equiv6\equiv2\pmod4$.

Vậy $a+b$ chia cho $4$ dư $2$.

=== T7V3.7a@p149
- bai: VD7 · y: a · trang: 149 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: công thức nhị thức Niu-tơn · bội số (BS) · số dư khi chia cho 100
- kiem: khong
- ket_qua_sach: 67
- dap_an: $67$
- ghi_chu_nghi: Máy: pow(3,999,100)=67, khớp sách. Sách viết "499.10 − 1" rồi "BS 100 + 4989"; đúng là hai số hạng cuối của (10−1)^499 là +499·10 và −1, tức +4990 − 1 = 4989.
## DE
Tìm hai chữ số tận cùng của $3^{999}$.
## SACH
$3^{999}=3\cdot3^{998}=3(10-1)^{499}=3(10^{499}-\ldots+499\cdot10-1)=3(\mathrm{BS}\ 100+4989)=\ldots67$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $3^{998}=9^{499}=(10-1)^{499}$ và hai chữ số tận cùng chỉ phụ thuộc số dư khi chia cho $100=10^2$, nên khai triển nhị thức Niu-tơn và giữ lại hai số hạng cuối không chứa $10^2$.

**Bước 1.** Tách $3^{999}$ thành tích $3\cdot9^{499}$ rồi viết $9^{499}=(10-1)^{499}$.

**Bước 2.** Khai triển $(10-1)^{499}$ bằng công thức Niu-tơn và nhận ra các số hạng chứa $10^2$ trở lên chia hết cho $100$.

**Bước 3.** Tính hai số hạng cuối với đúng dấu của chúng, rồi nhân với thừa số $3$ để đọc hai chữ số tận cùng.

**Phần 2. Trình bày**

$3^{999}=3\cdot3^{998}=3\cdot9^{499}=3(10-1)^{499}$.

Khai triển Niu-tơn: các số hạng chứa $10^{2}$ trở lên chia hết cho $100$; hai số hạng cuối là $499\cdot10\cdot(-1)^{498}+(-1)^{499}=4990-1=4989$.

Vậy $(10-1)^{499}=\mathrm{BS}\ 100+4989=\mathrm{BS}\ 100+89$.

$3^{999}=3(\mathrm{BS}\ 100+89)=\mathrm{BS}\ 100+267=\mathrm{BS}\ 100+67$.

Vậy hai chữ số tận cùng của $3^{999}$ là $67$.

=== T7V3.7b@p149
- bai: VD7 · y: b · trang: 149 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: bội số (BS) · số dư khi chia cho 4 và 8 · luỹ thừa tận cùng …01
- kiem: khong
- ket_qua_sach: 43
- dap_an: $43$
- ghi_chu_nghi: Máy: pow(7,7**7,100)=43, khớp sách (7^7=823543 chia 4 dư 3).
## DE
Tìm hai chữ số tận cùng của $7^{7^7}$.
## SACH
Xét số mũ $7^7=(8-1)^7=\mathrm{BS}\ 8-1=4k+3$. Ta có: $7^{7^7}=7^{4k+3}=7^3\cdot(7^4)^k=343\cdot(\ldots01)^k=(\ldots43)(\ldots01)=\ldots43$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $7^4=2401$ tận cùng $01$ nên luỹ thừa bội của $4$ của $7$ không đổi hai chữ số tận cùng — chỉ cần biết số mũ $7^7$ chia $4$ dư mấy rồi quy về $7$ mũ nhỏ.

**Bước 1.** Tính $7^4$ để nhận ra nó tận cùng bằng $01$, từ đó mọi luỹ thừa $(7^4)^k$ cũng tận cùng bằng $01$.

**Bước 2.** Tìm số dư của số mũ $7^7$ khi chia cho $4$ bằng cách viết $7^7=(8-1)^7$.

**Bước 3.** Viết $7^{7^7}=7^3\cdot(7^4)^k$ rồi nhân $343$ với số tận cùng $01$ để đọc hai chữ số tận cùng.

**Phần 2. Trình bày**

$7^4=2401=\mathrm{BS}\ 100+1$ nên $(7^4)^k=\mathrm{BS}\ 100+1$ với mọi số tự nhiên $k$.

Số mũ $7^7=(8-1)^7=\mathrm{BS}\ 8-1=4k+3$ $(k\in\mathbb{N})$.

Do đó $7^{7^7}=7^{4k+3}=7^3\cdot(7^4)^k=343(\mathrm{BS}\ 100+1)=\mathrm{BS}\ 100+343=\mathrm{BS}\ 100+43$.

Vậy hai chữ số tận cùng của $7^{7^7}$ là $43$.

