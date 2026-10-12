# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 5 | V. Dạng toán khác | tu_luan

### Bài 23 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm tất cả các số nguyên dương $n>2008$ thỏa mãn $2^{2008}+2^{2012}+2^{2013}+2^{2014}+2^n$ là số chính phương.
**Chưa chắc:** lời giải CHƯA đầy đủ — chỗ hở là bước loại các $m$ lẻ chia hết cho 3 và $m>9$ (tức $n=2008+m$ với $m=15,21,27,\dots$). Đã chứng minh được: bài đưa về $113+2^m=s^2$; $m$ chẵn vô nghiệm; $m$ phải lẻ và chia hết cho 3; $m=3$ và $m=9$ thoả mãn (ứng với $n=2011$, $n=2017$). Kiểm bằng máy (BigInt, `tam/kiem_p11.mjs`) mọi $m\le30000$ (tức $n\le32008$) chỉ có $m=3$ và $m=9$. Còn việc chứng minh KHÔNG có $m$ nào lớn hơn thì không có cách sơ cấp trong phạm vi lớp 8 mà tôi biết: $s^2-2^m=113$ là dạng phương trình kiểu Ramanujan–Nagell ($x^2+D=2^m$), mọi phép thử số dư (mod 3, 4, 5, 7, 9, 13, 17…) đều để lại lớp $m\equiv3$ và $m\equiv9$, nên không bao giờ loại được $m=3+$ bội của chu kì. Nghi đề in lỗi hoặc sai hằng số: dạng kinh điển $2^{2008}+2^{2011}+2^n$ (hằng số 9 thay cho 113) thì chứng minh trọn vẹn được bằng $(s-3)(s+3)=2^m$ và cho $m=4$, $n=2012$ (đã kiểm bằng máy).

**Phần 1. Hướng dẫn**

**Mấu chốt:** đặt $2^{2008}$ — một số chính phương — làm thừa số chung để đưa bài về tìm số mũ $m$ sao cho $113+2^m$ là số chính phương.

**Bước 1.** Vì $n>2008$ nên đặt $n=2008+m$ với $m$ nguyên dương, rồi rút $2^{2008}$ làm thừa số chung của cả năm hạng tử và tính tổng các số còn lại trong ngoặc.

**Bước 2.** Vì $2^{2008}=(2^{1004})^2$ là một số chính phương nên tổng đã cho là số chính phương khi và chỉ khi số trong ngoặc cũng là số chính phương.

**Bước 3.** Xét $m$ chẵn: viết $113+2^m=s^2$ thành hiệu hai bình phương bằng 113; vì 113 là số nguyên tố nên hiệu đó chỉ phân tích được thành tích hai thừa số theo đúng một cách.

**Bước 4.** Xét $m$ lẻ: thử lần lượt các giá trị nhỏ của $m$ để tìm những $m$ làm $113+2^m$ là số chính phương, rồi xét số dư khi chia cho 7 để xem $m$ còn có thể nhận những giá trị nào.

**Chú ý:** phép xét số dư chỉ thu hẹp được các giá trị của $m$ chứ không loại hết được, vì số mũ $m=3$ và $m=9$ cũng thoả mãn; bài này không có cách chứng minh sơ cấp trọn vẹn trong phạm vi lớp 8 nên phần cuối chưa chứng minh được (xem ghi chú).

**Phần 2. Trình bày**

Vì $n>2008$ nên đặt $n=2008+m$ với $m$ là số nguyên dương.

$2^{2008}+2^{2012}+2^{2013}+2^{2014}+2^n=2^{2008}(1+2^4+2^5+2^6+2^m)$

$=2^{2008}(1+16+32+64+2^m)$

$=2^{2008}(113+2^m)$

Ta có $2^{2008}=(2^{1004})^2$. Nếu $2^{2008}(113+2^m)=s^2$ thì $s^2$ chia hết cho $2^{2008}$ nên $s$ chia hết cho $2^{1004}$, do đó $113+2^m=(s:2^{1004})^2$ là số chính phương. Ngược lại, nếu $113+2^m$ là số chính phương thì tích $2^{2008}(113+2^m)$ cũng là số chính phương.

Vậy bài toán trở thành: tìm số nguyên dương $m$ để $113+2^m=s^2$ với $s$ là số nguyên dương.

Trường hợp 1: $m$ chẵn. Đặt $m=2k$ với $k$ nguyên dương. Khi đó:

$s^2-(2^k)^2=113$

$(s-2^k)(s+2^k)=113$

Vì 113 là số nguyên tố và $0<s-2^k<s+2^k$ nên $s-2^k=1$ và $s+2^k=113$.

Trừ hai đẳng thức này theo vế được $2 \cdot 2^k=112$, tức $2^k=56$.

Nhưng $56=2^3 \cdot 7$ không phải là luỹ thừa của 2. Vậy không có $m$ chẵn nào thoả mãn.

Trường hợp 2: $m$ lẻ. Thử các giá trị nhỏ của $m$:

$m=1$: $113+2=115$, mà $10^2<115<11^2$ nên 115 không là số chính phương.

$m=3$: $113+2^3=121=11^2$, thoả mãn; khi đó $n=2008+3=2011$.

$m=5$: $113+2^5=145$, mà $12^2<145<13^2$ nên loại.

$m=7$: $113+2^7=241$, mà $15^2<241<16^2$ nên loại.

$m=9$: $113+2^9=625=25^2$, thoả mãn; khi đó $n=2008+9=2017$.

$m=11$: $113+2^{11}=2161$, mà $46^2<2161<47^2$ nên loại.

Thu hẹp các giá trị còn lại: số chính phương khi chia cho 7 chỉ dư 0, 1, 2 hoặc 4. Vì $113=7 \cdot 16+1$ nên $113+2^m$ chia 7 dư như $1+2^m$.

Luỹ thừa $2^m$ chia 7 dư 2, 4, 1 lần lượt khi $m$ chia 3 dư 1, 2, 0.

Nếu $m$ chia 3 dư 1 thì $1+2^m$ chia 7 dư 3; nếu $m$ chia 3 dư 2 thì $1+2^m$ chia 7 dư 5. Hai số dư 3 và 5 không là số dư của số chính phương nên $m$ phải chia hết cho 3.

Vậy $m$ lẻ và chia hết cho 3, tức $m \in \{3;\ 9;\ 15;\ 21;\ \dots\}$.

Các giá trị đã tìm được là $n=2011$ và $n=2017$. Việc loại các số mũ $m=15,\ 21,\ 27,\dots$ chưa chứng minh được bằng kiến thức đã học (xem ghi chú ở cuối).

### Bài 24 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm tất cả các số nguyên $n$ sao cho $A=n^4+2n^3+2n^2+n+7$ là số chính phương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba hạng tử đầu của $A$ có thể ghép với một phần của $2n^2$ thành bình phương $(n^2+n)^2$, nên $A$ chỉ lớn hơn một bình phương một lượng nhỏ và có thể kẹp giữa hai bình phương liên tiếp.

**Bước 1.** Tách $2n^2=n^2+n^2$ để nhóm $n^4+2n^3+n^2$ thành bình phương của $n^2+n$ (hằng đẳng thức bình phương của một tổng), rồi đặt $t=n^2+n$ để viết $A$ theo $t$.

**Bước 2.** Nhận xét $t=n(n+1)$ là tích của hai số nguyên liên tiếp nên $t\ge0$; so sánh $A$ với $t^2$ và với $(t+1)^2$ để thấy khi $t$ đủ lớn thì $A$ nằm giữa hai bình phương liên tiếp.

**Bước 3.** Vì giữa hai số chính phương liên tiếp không có số chính phương nào, ta loại được mọi giá trị $t$ lớn hơn một mốc nhỏ; mốc đó tìm bằng cách giải điều kiện $A<(t+1)^2$.

**Bước 4.** Với các $t$ còn lại, suy ra khoảng giá trị của $n$ rồi tính trực tiếp $A$ cho từng số nguyên $n$ trong khoảng đó và kiểm tra.

**Chú ý:** $t=n^2+n$ nhận cùng một giá trị với hai số nguyên $n$ và $-n-1$ nên khi liệt kê phải xét cả $n$ âm.

**Phần 2. Trình bày**

$A=n^4+2n^3+n^2+n^2+n+7$

$=(n^2+n)^2+(n^2+n)+7$

Đặt $t=n^2+n=n(n+1)$. Vì $n$ và $n+1$ là hai số nguyên liên tiếp nên chúng cùng không âm (khi $n\ge0$) hoặc cùng không dương (khi $n\le-1$), do đó $t\ge0$ và $A=t^2+t+7$.

Với $t\ge7$ thì $t+7<2t+1$, nên:

$t^2<t^2+t+7<t^2+2t+1=(t+1)^2$

Vậy $A$ nằm giữa hai số chính phương liên tiếp $t^2$ và $(t+1)^2$ nên $A$ không là số chính phương.

Với $t\le6$ tức $n(n+1)\le6$: nếu $n\ge3$ thì $n(n+1)\ge12$; nếu $n\le-4$ thì $n(n+1)\ge(-4)(-3)=12$. Do đó $-3\le n\le2$.

Tính $A$ với từng giá trị $n\in\{-3;\ -2;\ -1;\ 0;\ 1;\ 2\}$ (dùng $t=n^2+n$, $A=t^2+t+7$):

$n=-3$ hoặc $n=2$: $t=6$, $A=36+6+7=49=7^2$ (số chính phương).

$n=-2$ hoặc $n=1$: $t=2$, $A=4+2+7=13$, không là số chính phương.

$n=-1$ hoặc $n=0$: $t=0$, $A=7$, không là số chính phương.

Vậy $n=-3$ hoặc $n=2$.

### Bài 25 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm tất cả các số nguyên $k$ sao cho $B=k^4-8k^3+23k^2-26k+10$ là số chính phương.
**Ghi chú:** số chính phương gồm cả số $0$ ($0=0^2$); với $k=1$ thì $B=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai hạng tử đầu $k^4-8k^3$ gợi bình phương của $k^2-4k+\dots$, nên viết $B$ thành "bình phương cộng một phần nhỏ" rồi kẹp giữa hai bình phương liên tiếp.

**Bước 1.** Chọn đa thức $u=k^2-4k+3$ vì hệ số $-8k^3$ ứng với $2 \cdot k^2 \cdot(-4k)$ và số hạng tự do $3$ làm hệ số của $k^2$ gần với $23$; khai triển $u^2$ rồi lấy $B-u^2$.

**Bước 2.** Hiệu $B-u^2$ vừa tính là một bình phương nên $B\ge u^2$, dấu bằng chỉ xảy ra ở một giá trị của $k$; từ đó viết $B$ dưới dạng $u^2+(\dots)^2$.

**Bước 3.** So $B$ với $(u+1)^2=u^2+2u+1$: lập hiệu $(u+1)^2-B$ và biến đổi thành một biểu thức theo $k$ để biết khi nào nó dương.

**Bước 4.** Với các $k$ làm hiệu đó dương và $u\ge0$, $B$ nằm giữa hai bình phương liên tiếp nên bị loại; những giá trị $k$ còn lại là số ít, tính trực tiếp $B$ rồi kiểm tra.

**Chú ý:** $u=(k-1)(k-3)$ có thể bằng $-1$ (khi $k=2$), lúc đó không dùng được phép kẹp giữa $u^2$ và $(u+1)^2$ với $u\ge0$ nên phải tính riêng.

**Phần 2. Trình bày**

Ta có $(k^2-4k+3)^2=k^4-8k^3+22k^2-24k+9$.

Do đó $B-(k^2-4k+3)^2=k^2-2k+1=(k-1)^2$.

Đặt $u=k^2-4k+3=(k-1)(k-3)$, ta được $B=u^2+(k-1)^2$.

Xét hiệu:

$(u+1)^2-B=2u+1-(k-1)^2$

$=2k^2-8k+6+1-k^2+2k-1$

$=k^2-6k+6=(k-3)^2-3$

Nếu $k\le1$ hoặc $k\ge5$ thì $|k-3|\ge2$ nên $(k-3)^2-3\ge4-3=1>0$, suy ra $B<(u+1)^2$.

Với $k\le1$ thì $k-1\le0$ và $k-3<0$ nên $u=(k-1)(k-3)\ge0$; với $k\ge5$ thì $k-1>0$ và $k-3>0$ nên $u>0$.

Nếu $k\ne1$ thì $(k-1)^2>0$ nên $B>u^2$.

Vậy với $k\le0$ hoặc $k\ge5$ ta có $u\ge0$ và $u^2<B<(u+1)^2$, tức $B$ nằm giữa hai số chính phương liên tiếp nên không là số chính phương.

Còn lại $k\in\{1;\ 2;\ 3;\ 4\}$:

$k=1$: $B=1-8+23-26+10=0=0^2$ (số chính phương).

$k=2$: $B=16-64+92-52+10=2$, không là số chính phương.

$k=3$: $B=81-216+207-78+10=4=2^2$ (số chính phương).

$k=4$: $B=256-512+368-104+10=18$, không là số chính phương.

Vậy $k=1$ hoặc $k=3$.

### Bài 26 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm tất cả các số nguyên dương $x,\ y$ sao cho $2^x+5^y+2$ là số chính phương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét số dư khi chia cho 4: số chính phương chỉ dư 0 hoặc 1, còn $5^y$ luôn dư 1, nên số mũ $x$ bị ràng buộc rất chặt.

**Bước 1.** Nhắc lại số chính phương chia 4 chỉ dư 0 hoặc 1, và luỹ thừa của 5 luôn chia 4 dư 1 vì $5$ chia 4 dư 1.

**Bước 2.** Với $x\ge2$ thì $2^x$ chia hết cho 4; cộng ba số dư $0$, $1$, $2$ rồi đối chiếu với các số dư có thể có của số chính phương để loại cả trường hợp này.

**Bước 3.** Còn trường hợp $x=1$: biểu thức thành $5^y+4$; đặt bằng $s^2$ và chuyển thành hiệu hai bình phương để được tích hai thừa số bằng $5^y$.

**Bước 4.** Vì 5 là số nguyên tố nên mỗi thừa số là một luỹ thừa của 5; hai thừa số hơn kém nhau 4 mà 4 không chia hết cho 5, từ đó xác định được hai thừa số.

**Phần 2. Trình bày**

Số chính phương chia 4 dư 0 hoặc 1: nếu $s=2q$ thì $s^2=4q^2$ chia 4 dư 0; nếu $s=2q+1$ thì $s^2=4q^2+4q+1$ chia 4 dư 1.

Vì $5$ chia 4 dư 1 nên $5^y$ chia 4 dư 1 với mọi $y$ nguyên dương.

Trường hợp 1: $x\ge2$. Khi đó $2^x$ chia hết cho 4, nên $2^x+5^y+2$ chia 4 dư $0+1+2=3$. Số dư 3 không phải số dư của số chính phương, nên không có $x\ge2$ thoả mãn.

Trường hợp 2: $x=1$. Khi đó $2^x+5^y+2=5^y+4$. Đặt $5^y+4=s^2$ với $s$ là số nguyên dương, ta có:

$s^2-4=5^y$

$(s-2)(s+2)=5^y$

Vì $5^y\ge5$ nên $s\ge3$, do đó $s-2$ và $s+2$ là hai ước nguyên dương của $5^y$. Vì 5 là số nguyên tố nên $s-2=5^a$ và $s+2=5^b$ với $0\le a<b$.

Trừ hai đẳng thức theo vế: $5^b-5^a=4$.

Nếu $a\ge1$ thì $5^a$ và $5^b$ cùng chia hết cho 5, nên $4=5^b-5^a$ chia hết cho 5, vô lí.

Vậy $a=0$, tức $s-2=1$ và $s=3$. Khi đó $s+2=5$ và $5^y=1 \cdot 5=5$ nên $y=1$.

Thử lại: $2^1+5^1+2=9=3^2$.

Vậy $x=1$ và $y=1$.

### Bài 27 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tồn tại hay không các số nguyên $a,\ b,\ c$ sao cho: $ab^2c+2,\ bc^2a+2$ và $ca^2b+2$ là các số chính phương?

**Phần 1. Hướng dẫn**

**Mấu chốt:** cả ba biểu thức đều có dạng $abc \cdot t+2$ với $t$ là một trong $a,\ b,\ c$; số chính phương chia 4 chỉ dư 0 hoặc 1, nên xét số dư khi chia cho 4 để tìm mâu thuẫn.

**Bước 1.** Nhóm $ab^2c=abc \cdot b$, $bc^2a=abc \cdot c$, $ca^2b=abc \cdot a$ rồi đặt $p=abc$, để ba biểu thức thành $pb+2$, $pc+2$, $pa+2$.

**Bước 2.** Xét $p$ chẵn: một số chính phương chẵn thì chia hết cho 4, từ đó suy ra tích $p \cdot t$ chia 4 dư 2, rồi xem $t$ chẵn hay lẻ.

**Bước 3.** Xét $p$ lẻ: khi đó $a,\ b,\ c$ đều lẻ nên $pt+2$ là số lẻ; số chính phương lẻ chia 4 dư 1, ta tìm số dư của các tích $ab,\ bc,\ ca$.

**Bước 4.** Nhân ba số dư thu được với nhau rồi so với số dư của $(abc)^2$ khi chia cho 4 để chỉ ra mâu thuẫn ở cả hai trường hợp.

**Chú ý:** trường hợp một trong ba số bằng 0 cũng nằm trong "$p$ chẵn" (khi đó cả ba biểu thức đều bằng 2, không là số chính phương).

**Phần 2. Trình bày**

Ta có $ab^2c=abc \cdot b$, $bc^2a=abc \cdot c$, $ca^2b=abc \cdot a$.

Đặt $p=abc$. Giả sử tồn tại $a,\ b,\ c$ sao cho $pa+2$, $pb+2$, $pc+2$ đều là các số chính phương.

Số chính phương chia 4 dư 0 hoặc 1 (số chẵn có bình phương chia hết cho 4, số lẻ có bình phương chia 4 dư 1).

Trường hợp 1: $p$ chẵn. Khi đó với mỗi $t\in\{a,\ b,\ c\}$, số $pt+2$ là số chẵn và là số chính phương nên chia hết cho 4. Suy ra $pt=(pt+2)-2$ chia 4 dư 2, tức $pt$ không chia hết cho 4.

Vì $p$ chẵn nên nếu $t$ chẵn thì $pt$ chia hết cho 4. Do đó $t$ lẻ với mọi $t\in\{a,\ b,\ c\}$, tức $a,\ b,\ c$ đều lẻ nên $p=abc$ lẻ, mâu thuẫn với $p$ chẵn.

Trường hợp 2: $p$ lẻ. Khi đó $a,\ b,\ c$ đều lẻ, nên $pa+2$ là số lẻ và là số chính phương, do đó chia 4 dư 1. Suy ra $pa$ chia 4 dư 3. Tương tự $pb$ và $pc$ cùng chia 4 dư 3.

Mặt khác, vì $a$ lẻ nên $a^2$ chia 4 dư 1, do đó $pa=a^2 \cdot bc$ chia 4 có cùng số dư với $bc$. Tương tự $pb$ có cùng số dư với $ca$ và $pc$ có cùng số dư với $ab$. Vậy $bc,\ ca,\ ab$ đều chia 4 dư 3.

Khi đó $(ab)(bc)(ca)=(abc)^2$ chia 4 có cùng số dư với $3 \cdot 3 \cdot 3=27$, tức dư 3.

Nhưng $abc$ lẻ nên $(abc)^2$ chia 4 dư 1, mâu thuẫn.

Cả hai trường hợp đều mâu thuẫn, nên giả sử sai.

Vậy không tồn tại các số nguyên $a,\ b,\ c$ thoả mãn đề bài.

## GHI CHÚ CHO NGƯỜI DUYỆT

- **Bài 23 là bài DUY NHẤT chưa có lời giải trọn vẹn** (đã gắn `**Chưa chắc:**`). Đề đọc rõ từ ảnh (phóng to: $2^{2008}$, $2^{2012}$, $2^{2013}$, $2^{2014}$, $2^n$, $n>2008$), đề gõ sẵn khớp ảnh. Bài quy về $s^2-2^m=113$ với $m=n-2008$; phần đã chứng minh: $m$ chẵn vô nghiệm, $m$ lẻ và chia hết cho 3, $m=3$ ($n=2011$) và $m=9$ ($n=2017$) thoả; vét cạn BigInt tới $m\le30000$ chỉ còn hai giá trị đó, nhưng chứng minh "không còn $m$ nào khác" không có cách sơ cấp lớp 8 mà tôi biết (tôi không bịa). Tôi không thấy cách nào để một học sinh lớp 8 tự làm trọn bài này; nghi đề cương chép sai hằng số (113 do $1+2^4+2^5+2^6$). Cần CEO quyết: giữ bài như hiện tại (lời giải nói rõ phần chưa chứng minh), hay thay bằng đề kinh điển $2^{2008}+2^{2011}+2^n$ ($n=2012$), hay bỏ.
- Bài 24 ($n=-3$, $n=2$), Bài 25 ($k=1$, $k=3$), Bài 26 ($x=y=1$), Bài 27 (không tồn tại): đều đã chứng minh đầy đủ và vét cạn bằng máy (Bài 24, 25: mọi $|n|,|k|\le20000$; Bài 26: $x\le400$, $y\le200$; Bài 27: $|a|,|b|,|c|\le60$). Không có câu nào đề in mờ hay in lỗi.
- Bài 25: ghi rõ số chính phương gồm cả $0$, nên $k=1$ ($B=0$) được tính là nghiệm; nếu ngầm hiểu số chính phương phải dương thì chỉ còn $k=3$.
- Kiến thức: Bài 24, 25 dùng hằng đẳng thức bình phương và "giữa hai số chính phương liên tiếp không có số chính phương nào" (lớp 6–7); Bài 26, 27 dùng số dư khi chia cho 4 và phân tích thành nhân tử (hiệu hai bình phương, Chương II); không dùng đường trung bình, Thalès, Pythagore, phương trình bậc nhất.
- Bài 23–27 đều là `tu_luan` (đáp số hai giá trị, cặp số hoặc kết luận "không tồn tại"), không có bài trả lời ngắn.
