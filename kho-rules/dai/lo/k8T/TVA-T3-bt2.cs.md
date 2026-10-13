=== T3B.24@p64
- bai: 24 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: tách thừa số bằng hiệu hai bình phương · giản ước liên tiếp
- kiem: khong
- ket_qua_sach: \dfrac{n+1}{2n}
- dap_an: $\dfrac{n+1}{2n}$
- ghi_chu_nghi:
## DE
Rút gọn biểu thức với $n$ là số tự nhiên lớn hơn hoặc bằng $2$: $\dfrac{2^2-1}{2^2}\cdot\dfrac{3^2-1}{3^2}\cdot\dfrac{4^2-1}{4^2}\cdots\dfrac{n^2-1}{n^2}$.
## SACH
$\dfrac{2^2-1}{2^2}\cdot\dfrac{3^2-1}{3^2}\cdot\dfrac{4^2-1}{4^2}\cdots\dfrac{n^2-1}{n^2}=\dfrac{1\cdot3}{2^2}\cdot\dfrac{2\cdot4}{3^2}\cdot\dfrac{3\cdot5}{4^2}\cdots\dfrac{(n-1)(n+1)}{n^2}$
$=\dfrac{1\cdot2\cdot3\cdots(n-1)}{2\cdot3\cdot4\cdots(n-1)n}\cdot\dfrac{3\cdot4\cdot5\cdots n(n+1)}{2\cdot3\cdot4\cdots n}=\dfrac{1}{n}\cdot\dfrac{n+1}{2}=\dfrac{n+1}{2n}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi thừa số $\dfrac{k^2-1}{k^2}$ có tử là hiệu hai bình phương nên tách được thành tích $\dfrac{k-1}{k}\cdot\dfrac{k+1}{k}$, và cả tích chia thành hai dãy phân số liên tiếp giản ước được gần hết.

**Bước 1.** Phân tích tử của từng thừa số bằng hiệu hai bình phương để viết mỗi thừa số thành tích hai phân số có mẫu là $k$.

**Bước 2.** Gom các phân số dạng $\dfrac{k-1}{k}$ thành một tích và các phân số dạng $\dfrac{k+1}{k}$ thành một tích khác, với $k$ chạy từ $2$ đến $n$.

**Bước 3.** Giản ước liên tiếp trong từng tích (tử của phân số này khử mẫu của phân số kề bên) rồi nhân hai kết quả còn lại.

**Phần 2. Trình bày**

$\dfrac{2^2-1}{2^2}\cdot\dfrac{3^2-1}{3^2}\cdots\dfrac{n^2-1}{n^2}=\dfrac{1\cdot3}{2\cdot2}\cdot\dfrac{2\cdot4}{3\cdot3}\cdot\dfrac{3\cdot5}{4\cdot4}\cdots\dfrac{(n-1)(n+1)}{n\cdot n}$

$=\left(\dfrac{1}{2}\cdot\dfrac{2}{3}\cdot\dfrac{3}{4}\cdots\dfrac{n-1}{n}\right)\cdot\left(\dfrac{3}{2}\cdot\dfrac{4}{3}\cdot\dfrac{5}{4}\cdots\dfrac{n+1}{n}\right)$

$=\dfrac{1}{n}\cdot\dfrac{n+1}{2}$

$=\dfrac{n+1}{2n}$

=== T3B.25@p64
- bai: 25 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010502
- cong_cu: quy đồng trong ngoặc · giản ước liên tiếp
- kiem: khong
- ket_qua_sach: \dfrac{2(n+1)}{n+2}
- dap_an: $\dfrac{2(n+1)}{n+2}$
- ghi_chu_nghi:
## DE
Rút gọn biểu thức với $n$ là số tự nhiên: $\left(1+\dfrac{1}{3}\right)\left(1+\dfrac{1}{8}\right)\left(1+\dfrac{1}{15}\right)\cdots\left(1+\dfrac{1}{n^2+2n}\right)$.
## SACH
Xét $1+\dfrac{1}{n^2+2n}=\dfrac{n^2+2n+1}{n^2+2n}=\dfrac{(n+1)^2}{n(n+2)}$.
Đáp số $\left(1+\dfrac{1}{3}\right)\left(1+\dfrac{1}{8}\right)\left(1+\dfrac{1}{15}\right)\cdots\left(1+\dfrac{1}{n^2+2n}\right)=\dfrac{2(n+1)}{n+2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi thừa số có dạng $1+\dfrac{1}{k^2+2k}=\dfrac{(k+1)^2}{k(k+2)}$, tức là tích của hai phân số $\dfrac{k+1}{k}$ và $\dfrac{k+1}{k+2}$, nên cả tích giản ước được liên tiếp.

**Bước 1.** Quy đồng trong từng ngoặc và nhận ra tử $k^2+2k+1$ là bình phương $(k+1)^2$, còn mẫu $k^2+2k$ phân tích được thành $k(k+2)$.

**Bước 2.** Viết mỗi thừa số thành tích hai phân số rồi gom thành hai tích riêng, với $k$ chạy từ $1$ đến $n$.

**Bước 3.** Giản ước liên tiếp trong từng tích để chỉ còn phân số đầu và phân số cuối, rồi nhân hai kết quả.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $k\ge1$: $1+\dfrac{1}{k^2+2k}=\dfrac{k^2+2k+1}{k^2+2k}=\dfrac{(k+1)^2}{k(k+2)}=\dfrac{k+1}{k}\cdot\dfrac{k+1}{k+2}$.

Do đó biểu thức cần rút gọn bằng $\left(\dfrac{2}{1}\cdot\dfrac{3}{2}\cdot\dfrac{4}{3}\cdots\dfrac{n+1}{n}\right)\cdot\left(\dfrac{2}{3}\cdot\dfrac{3}{4}\cdot\dfrac{4}{5}\cdots\dfrac{n+1}{n+2}\right)$

$=(n+1)\cdot\dfrac{2}{n+2}$

$=\dfrac{2(n+1)}{n+2}$

=== T3B.26@p64
- bai: 26 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010502
- cong_cu: quy đồng trong ngoặc · giản ước liên tiếp
- kiem: khong
- ket_qua_sach: \dfrac{3(n+1)}{n+3}
- dap_an: $\dfrac{3(n+1)}{n+3}$
- ghi_chu_nghi:
## DE
Rút gọn biểu thức với $n$ là số tự nhiên: $\left(1+\dfrac{2}{4}\right)\left(1+\dfrac{2}{10}\right)\left(1+\dfrac{2}{18}\right)\cdots\left(1+\dfrac{2}{n^2+3n}\right)$.
## SACH
Xét $1+\dfrac{2}{n^2+3n}=\dfrac{n^2+3n+2}{n^2+3n}=\dfrac{(n+1)(n+2)}{n(n+3)}$.
Đáp số: $\left(1+\dfrac{2}{4}\right)\left(1+\dfrac{2}{10}\right)\left(1+\dfrac{2}{18}\right)\cdots\left(1+\dfrac{2}{n^2+3n}\right)=\dfrac{3(n+1)}{n+3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi thừa số có dạng $1+\dfrac{2}{k^2+3k}=\dfrac{(k+1)(k+2)}{k(k+3)}$, tức là tích của hai phân số $\dfrac{k+1}{k}$ và $\dfrac{k+2}{k+3}$, nên cả tích giản ước được liên tiếp.

**Bước 1.** Quy đồng trong từng ngoặc rồi phân tích tử $k^2+3k+2$ thành $(k+1)(k+2)$ và mẫu $k^2+3k$ thành $k(k+3)$.

**Bước 2.** Viết mỗi thừa số thành tích hai phân số rồi gom thành hai tích riêng, với $k$ chạy từ $1$ đến $n$.

**Bước 3.** Giản ước liên tiếp trong từng tích để chỉ còn phân số đầu và phân số cuối, rồi nhân hai kết quả.

**Phần 2. Trình bày**

Với mỗi số tự nhiên $k\ge1$: $1+\dfrac{2}{k^2+3k}=\dfrac{k^2+3k+2}{k^2+3k}=\dfrac{(k+1)(k+2)}{k(k+3)}=\dfrac{k+1}{k}\cdot\dfrac{k+2}{k+3}$.

Do đó biểu thức cần rút gọn bằng $\left(\dfrac{2}{1}\cdot\dfrac{3}{2}\cdot\dfrac{4}{3}\cdots\dfrac{n+1}{n}\right)\cdot\left(\dfrac{3}{4}\cdot\dfrac{4}{5}\cdot\dfrac{5}{6}\cdots\dfrac{n+2}{n+3}\right)$

$=(n+1)\cdot\dfrac{3}{n+3}$

$=\dfrac{3(n+1)}{n+3}$

=== T3B.27@p64
- bai: 27 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: tách phân số thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh hằng đẳng thức sau với $n$ là số tự nhiên, $n\ge2$: $\dfrac{1}{1\cdot2}+\dfrac{1}{2\cdot3}+\dfrac{1}{3\cdot4}+\cdots+\dfrac{1}{(n-1)n}=\dfrac{n-1}{n}$.
## SACH
Không thể quy đồng mẫu số các phân số ở vế trái. Cần tách mỗi phân số thành hiệu $2$ phân số. Nhận xét: $\dfrac{1}{n-1}-\dfrac{1}{n}=\dfrac{1}{(n-1)n}$.
Do đó: $\dfrac{1}{1\cdot2}+\dfrac{1}{2\cdot3}+\dfrac{1}{3\cdot4}+\cdots+\dfrac{1}{(n-1)n}$
$=\dfrac{1}{1}-\dfrac{1}{2}+\dfrac{1}{2}-\dfrac{1}{3}+\dfrac{1}{3}-\dfrac{1}{4}+\cdots+\dfrac{1}{n-1}-\dfrac{1}{n}=1-\dfrac{1}{n}=\dfrac{n-1}{n}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi số hạng $\dfrac{1}{(k-1)k}$ bằng hiệu $\dfrac{1}{k-1}-\dfrac{1}{k}$ nên khi cộng theo vế các số hạng liên tiếp, các phân số ở giữa triệt tiêu từng cặp.

**Bước 1.** Quy đồng hiệu $\dfrac{1}{k-1}-\dfrac{1}{k}$ để kiểm tra nó bằng đúng số hạng tổng quát $\dfrac{1}{(k-1)k}$.

**Bước 2.** Viết từng số hạng của vế trái thành hiệu hai phân số, với $k$ chạy từ $2$ đến $n$.

**Bước 3.** Cộng theo vế để các số đối nhau triệt tiêu, chỉ còn lại số hạng đầu và số hạng cuối rồi so với vế phải.

**Phần 2. Trình bày**

Với mọi số tự nhiên $k\ge2$: $\dfrac{1}{k-1}-\dfrac{1}{k}=\dfrac{k-(k-1)}{(k-1)k}=\dfrac{1}{(k-1)k}$.

Do đó vế trái bằng $\left(\dfrac{1}{1}-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\left(\dfrac{1}{3}-\dfrac{1}{4}\right)+\cdots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)$

$=1-\dfrac{1}{n}$

$=\dfrac{n-1}{n}$

Vậy đẳng thức được chứng minh.

=== T3B.28@p64
- bai: 28 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010502
- cong_cu: tách phân số thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh hằng đẳng thức sau với $n$ là số tự nhiên: $\dfrac{1}{1\cdot3}+\dfrac{1}{3\cdot5}+\dfrac{1}{5\cdot7}+\cdots+\dfrac{1}{(2n-1)(2n+1)}=\dfrac{n}{2n+1}$.
## SACH
Nhận xét $\dfrac{1}{2n-1}-\dfrac{1}{2n+1}=\dfrac{2}{(2n-1)(2n+1)}$.
Đặt $\dfrac{1}{1\cdot3}+\dfrac{1}{3\cdot5}+\dfrac{1}{5\cdot7}+\cdots+\dfrac{1}{(2n-1)(2n+1)}=\dfrac{n}{2n+1}=S$
Trước hết, tính $2S$ được $\dfrac{2n}{2n+1}$. Từ đó suy ra $S=\dfrac{n}{2n+1}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai thừa số ở mẫu hơn kém nhau $2$ đơn vị nên $\dfrac{2}{(2k-1)(2k+1)}=\dfrac{1}{2k-1}-\dfrac{1}{2k+1}$; nhân vế trái với $2$ thì các số hạng trung gian triệt tiêu từng cặp.

**Bước 1.** Quy đồng hiệu $\dfrac{1}{2k-1}-\dfrac{1}{2k+1}$ để kiểm tra nó bằng $\dfrac{2}{(2k-1)(2k+1)}$ với mọi $k$.

**Bước 2.** Gọi $S$ là vế trái và nhân $S$ với $2$ để mỗi số hạng của $2S$ trở thành một hiệu hai phân số.

**Bước 3.** Cộng theo vế để các số hạng trung gian triệt tiêu, rồi chia hai vế cho $2$ và so với vế phải.

**Phần 2. Trình bày**

Với mọi số tự nhiên $k\ge1$: $\dfrac{1}{2k-1}-\dfrac{1}{2k+1}=\dfrac{(2k+1)-(2k-1)}{(2k-1)(2k+1)}=\dfrac{2}{(2k-1)(2k+1)}$.

Gọi $S$ là vế trái, ta có $2S=\dfrac{2}{1\cdot3}+\dfrac{2}{3\cdot5}+\dfrac{2}{5\cdot7}+\cdots+\dfrac{2}{(2n-1)(2n+1)}$

$=\left(1-\dfrac{1}{3}\right)+\left(\dfrac{1}{3}-\dfrac{1}{5}\right)+\left(\dfrac{1}{5}-\dfrac{1}{7}\right)+\cdots+\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$

$=1-\dfrac{1}{2n+1}$

$=\dfrac{2n}{2n+1}$

Suy ra $S=\dfrac{n}{2n+1}$. Vậy đẳng thức được chứng minh.

=== T3B.29@p64
- bai: 29 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010502
- cong_cu: tách phân số thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh hằng đẳng thức sau với $n$ là số tự nhiên, $n\ge2$: $\dfrac{1}{1\cdot2\cdot3}+\dfrac{1}{2\cdot3\cdot4}+\dfrac{1}{3\cdot4\cdot5}+\cdots+\dfrac{1}{(n-1)n(n+1)}=\dfrac{(n-1)(n+2)}{4n(n+1)}$.
## SACH
Cần tách mỗi phân số ở vế trái thành hiệu $2$ phân số để xuất hiện trong biểu thức những số hạng đối nhau. Nhưng đó là hiệu $2$ phân số nào?
Hãy xét các hiệu: $\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}$; $\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}$; $\ldots$
Tổng quát $\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}$.
Gọi vế trái của đẳng thức cần chứng minh là $S$.
Do $\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}=\dfrac{2}{(n-1)n(n+1)}$ nên
$2S=\dfrac{2}{1\cdot2\cdot3}+\dfrac{2}{2\cdot3\cdot4}+\dfrac{2}{3\cdot4\cdot5}+\cdots+\dfrac{2}{(n-1)n(n+1)}$
$=\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}+\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}+\dfrac{1}{3\cdot4}-\dfrac{1}{4\cdot5}+\cdots+\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}$
$=\dfrac{1}{2}-\dfrac{1}{n(n+1)}=\dfrac{n^2+n-2}{2n(n+1)}=\dfrac{(n-1)(n+2)}{2n(n+1)}$.
Vậy: $S=\dfrac{(n-1)(n+2)}{4n(n+1)}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là tích ba số nguyên liên tiếp nên hiệu $\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}$ cho đúng $\dfrac{2}{(k-1)k(k+1)}$, tức gấp đôi số hạng tổng quát; nhờ đó $2S$ là tổng các hiệu triệt tiêu liên tiếp.

**Bước 1.** Quy đồng hiệu $\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}$ để kiểm tra nó bằng $\dfrac{2}{(k-1)k(k+1)}$.

**Bước 2.** Gọi $S$ là vế trái và nhân $S$ với $2$ để mỗi số hạng của $2S$ trở thành một hiệu hai phân số có mẫu là tích hai số liên tiếp.

**Bước 3.** Cộng theo vế để các số hạng trung gian triệt tiêu, chỉ còn số hạng đầu trừ số hạng cuối.

**Bước 4.** Quy đồng phần còn lại, phân tích tử thành nhân tử rồi chia cho $2$ để so với vế phải.

**Phần 2. Trình bày**

Với mọi số tự nhiên $k\ge2$: $\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}=\dfrac{(k+1)-(k-1)}{(k-1)k(k+1)}=\dfrac{2}{(k-1)k(k+1)}$.

Gọi $S$ là vế trái, ta có $2S=\dfrac{2}{1\cdot2\cdot3}+\dfrac{2}{2\cdot3\cdot4}+\cdots+\dfrac{2}{(n-1)n(n+1)}$

$=\left(\dfrac{1}{1\cdot2}-\dfrac{1}{2\cdot3}\right)+\left(\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}\right)+\cdots+\left(\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right)$

$=\dfrac{1}{2}-\dfrac{1}{n(n+1)}$

$=\dfrac{n^2+n-2}{2n(n+1)}$

$=\dfrac{(n-1)(n+2)}{2n(n+1)}$

Suy ra $S=\dfrac{(n-1)(n+2)}{4n(n+1)}$. Vậy đẳng thức được chứng minh.

=== T3B.30@p64
- bai: 30 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010502
- cong_cu: phân tích mẫu thành tích · tách phân thức thành hiệu · khử liên tiếp
- kiem: bang | \dfrac{1}{a^2+a}+\dfrac{1}{a^2+3a+2}+\dfrac{1}{a^2+5a+6}+\dfrac{1}{a^2+7a+12}+\dfrac{1}{a^2+9a+20}
- ket_qua_sach: \dfrac{5}{a(a+5)}
- dap_an: $\dfrac{5}{a(a+5)}$
- ghi_chu_nghi: mẫu của phân thức thứ nhất in "a² - a" (dấu giữa nhỏ, mờ, sát mép trái trang, trông như gạch nối; các dấu cộng khác trong dòng rõ nét); lời giải sách phân tích mẫu này thành a(a+1) và đáp số 5/(a(a+5)) chỉ đúng với a²+a, nên dựng lại thành a²+a theo lời giải. Nếu thật sự in a²−a thì tổng không rút gọn gọn được: bằng (5a²+2a+5)/(a(a−1)(a+1)(a+5)). Người soát mở ảnh p64 xác nhận dấu.
## DE
Rút gọn biểu thức: $\dfrac{1}{a^2+a}+\dfrac{1}{a^2+3a+2}+\dfrac{1}{a^2+5a+6}+\dfrac{1}{a^2+7a+12}+\dfrac{1}{a^2+9a+20}$.
## SACH
Phân tích các mẫu số ra thừa số lần lượt được $a(a+1)$; $(a+1)(a+2)$; $(a+2)(a+3)$; $(a+3)(a+4)$; $(a+4)(a+5)$. Tách mỗi phân thức thành hiệu hai phân thức.
Đáp số: $\dfrac{1}{a}-\dfrac{1}{a+5}=\dfrac{5}{a(a+5)}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi mẫu phân tích được thành tích hai nhân tử hơn kém nhau $1$ đơn vị, nên mỗi số hạng có dạng $\dfrac{1}{m(m+1)}=\dfrac{1}{m}-\dfrac{1}{m+1}$ và tổng triệt tiêu liên tiếp.

**Bước 1.** Phân tích từng mẫu thành tích hai nhân tử bậc nhất để thấy các nhân tử nối tiếp nhau theo từng bậc.

**Bước 2.** Viết mỗi phân thức thành hiệu hai phân thức theo $\dfrac{1}{m(m+1)}=\dfrac{1}{m}-\dfrac{1}{m+1}$ với $m$ lần lượt là $a$, $a+1$, $a+2$, $a+3$, $a+4$.

**Bước 3.** Cộng năm hiệu để các số hạng trung gian triệt tiêu, rồi quy đồng hai phân thức còn lại để rút gọn.

**Chú ý:** Biểu thức chỉ xác định khi $a$ khác $0$, $-1$, $-2$, $-3$, $-4$, $-5$.

**Phần 2. Trình bày**

$\dfrac{1}{a^2+a}+\dfrac{1}{a^2+3a+2}+\dfrac{1}{a^2+5a+6}+\dfrac{1}{a^2+7a+12}+\dfrac{1}{a^2+9a+20}$

$=\dfrac{1}{a(a+1)}+\dfrac{1}{(a+1)(a+2)}+\dfrac{1}{(a+2)(a+3)}+\dfrac{1}{(a+3)(a+4)}+\dfrac{1}{(a+4)(a+5)}$

$=\left(\dfrac{1}{a}-\dfrac{1}{a+1}\right)+\left(\dfrac{1}{a+1}-\dfrac{1}{a+2}\right)+\left(\dfrac{1}{a+2}-\dfrac{1}{a+3}\right)+\left(\dfrac{1}{a+3}-\dfrac{1}{a+4}\right)+\left(\dfrac{1}{a+4}-\dfrac{1}{a+5}\right)$

$=\dfrac{1}{a}-\dfrac{1}{a+5}$

$=\dfrac{5}{a(a+5)}$

=== T3B.31@p64
- bai: 31 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010501
- cong_cu: tách phần nguyên · ước của hằng số
- kiem: khong
- ket_qua_sach: 1; 3; 7
- dap_an: $S=\{1;3;7\}$
- ghi_chu_nghi: đề in "có số trị là số nguyên", đọc là "có giá trị là số nguyên".
## DE
Tìm số tự nhiên $n$ để phân thức $\dfrac{n^4-2n^3+5}{n-2}$ có giá trị là số nguyên.
## SACH
Biến đổi: $\dfrac{n^4-2n^3+5}{n-2}=\dfrac{n^3(n-2)+5}{n-2}=n^3+\dfrac{5}{n-2}$
Muốn biểu thức có giá trị nguyên thì $n-2$ phải là ước số của $5$.
Đáp số: $1$; $3$; $7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tách $n^4-2n^3=n^3(n-2)$ để phân thức thành một đa thức cộng với $\dfrac{5}{n-2}$, khi đó giá trị là số nguyên chỉ khi $n-2$ là ước của $5$.

**Bước 1.** Tách tử thành $n^3(n-2)+5$ để phần nguyên $n^3$ tách khỏi phân số còn lại.

**Bước 2.** Lập luận rằng $n^3$ là số nguyên nên phân thức nguyên khi và chỉ khi phân số còn lại nguyên, tức là $n-2$ là ước của $5$.

**Bước 3.** Liệt kê các ước của $5$ rồi tìm $n$ tương ứng và loại các giá trị không phải số tự nhiên.

**Chú ý:** Ước của $5$ gồm cả ước âm, nhưng giá trị $n$ tìm được phải là số tự nhiên nên có một trường hợp bị loại.

**Phần 2. Trình bày**

$\dfrac{n^4-2n^3+5}{n-2}=\dfrac{n^3(n-2)+5}{n-2}=n^3+\dfrac{5}{n-2}$ (với $n\ne2$).

Vì $n$ là số tự nhiên nên $n^3$ nguyên, do đó phân thức nguyên khi và chỉ khi $\dfrac{5}{n-2}$ nguyên, tức là $n-2$ là ước của $5$.

$n-2=-5\Rightarrow n=-3$ (loại vì không phải số tự nhiên)

$n-2=-1\Rightarrow n=1$

$n-2=1\Rightarrow n=3$

$n-2=5\Rightarrow n=7$

Vậy $S=\{1;3;7\}$.

=== T3B.32@p64
- bai: 32 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010301
- cong_cu: khai triển hằng đẳng thức · bình phương điều kiện
- kiem: khong
- ket_qua_sach: \dfrac{1}{3}
- dap_an: $\dfrac{1}{3}$
- ghi_chu_nghi:
## DE
Rút gọn $\dfrac{x^2+y^2+z^2}{(y-z)^2+(z-x)^2+(x-y)^2}$, biết rằng $x+y+z=0$.
## SACH
Đáp số: $\dfrac{1}{3}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu khai triển thành $2(x^2+y^2+z^2)-2(xy+yz+zx)$, còn bình phương giả thiết $x+y+z=0$ cho $xy+yz+zx$ theo $x^2+y^2+z^2$, nên mẫu là bội của tử.

**Bước 1.** Khai triển ba bình phương ở mẫu và gom lại thành $2(x^2+y^2+z^2)-2(xy+yz+zx)$.

**Bước 2.** Bình phương hai vế của giả thiết $x+y+z=0$ để biểu diễn $xy+yz+zx$ theo $x^2+y^2+z^2$.

**Bước 3.** Thay vào mẫu để mẫu thành một bội của $x^2+y^2+z^2$ rồi giản ước với tử.

**Chú ý:** Phân thức chỉ có nghĩa khi $x^2+y^2+z^2\ne0$, tức là $x$, $y$, $z$ không đồng thời bằng $0$.

**Phần 2. Trình bày**

Từ $x+y+z=0$ suy ra $(x+y+z)^2=0$, tức là $x^2+y^2+z^2+2(xy+yz+zx)=0$, do đó $xy+yz+zx=-\dfrac{x^2+y^2+z^2}{2}$.

Mẫu số: $(y-z)^2+(z-x)^2+(x-y)^2=2(x^2+y^2+z^2)-2(xy+yz+zx)$

$=2(x^2+y^2+z^2)+(x^2+y^2+z^2)$

$=3(x^2+y^2+z^2)$

Vậy $\dfrac{x^2+y^2+z^2}{(y-z)^2+(z-x)^2+(x-y)^2}=\dfrac{x^2+y^2+z^2}{3(x^2+y^2+z^2)}=\dfrac{1}{3}$.

=== T3B.33@p64
- bai: 33 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: phân tích thành nhân tử · suy ra mối liên hệ giữa các chữ
- kiem: khong
- ket_qua_sach: \dfrac{1}{3}
- dap_an: $\dfrac{1}{3}$
- ghi_chu_nghi: dòng đầu của lời giải sách in "x² − xy − 2y² = 0 ⇔ x² + xy − 2xy + 2y² = 0": dấu của 2y² ở vế sau phải là "−" (x² + xy − 2xy − 2y²), như dòng kế tiếp x(x+y) − 2y(x+y) = 0 đòi hỏi. Đã chép đúng như in ở phần SACH; GIAI viết đúng dấu.
## DE
Tính giá trị của biểu thức $A=\dfrac{x-y}{x+y}$, biết $x^2-2y^2=xy$ ($y\ne0$; $x+y\ne0$).
## SACH
$x^2-xy-2y^2=0\Leftrightarrow x^2+xy-2xy+2y^2=0$
$\Leftrightarrow x(x+y)-2y(x+y)=0\Leftrightarrow(x+y)(x-2y)=0$
Do $x+y\ne0$ nên $x=2y$. Do đó: $A=\dfrac{2y-y}{2y+y}=\dfrac{y}{3y}=\dfrac{1}{3}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $x^2-xy-2y^2=0$ phân tích được thành $(x+y)(x-2y)=0$, mà $x+y\ne0$ nên suy ra $x$ theo $y$ rồi thay vào $A$.

**Bước 1.** Chuyển $xy$ sang vế trái để vế phải bằng $0$ và vế trái là tam thức $x^2-xy-2y^2$.

**Bước 2.** Tách hạng tử $-xy$ thành $xy-2xy$ rồi nhóm hạng tử để phân tích vế trái thành tích hai nhân tử bậc nhất.

**Bước 3.** Dùng điều kiện $x+y\ne0$ để loại một nhân tử, từ đó suy ra $x$ theo $y$.

**Bước 4.** Thay $x$ vào $A$ rồi giản ước cho $y$ khác $0$.

**Phần 2. Trình bày**

$x^2-2y^2=xy\Leftrightarrow x^2-xy-2y^2=0$

$\Leftrightarrow x^2+xy-2xy-2y^2=0$

$\Leftrightarrow x(x+y)-2y(x+y)=0$

$\Leftrightarrow(x+y)(x-2y)=0$

Vì $x+y\ne0$ nên $x-2y=0$, tức là $x=2y$.

Khi đó $A=\dfrac{2y-y}{2y+y}=\dfrac{y}{3y}=\dfrac{1}{3}$ (do $y\ne0$).

=== T3B.34@p64
- bai: 34 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: bình phương biểu thức · xét dấu
- kiem: khong
- ket_qua_sach: -\dfrac{1}{2}
- dap_an: $-\dfrac{1}{2}$
- ghi_chu_nghi: Đề sách in điều kiện "2y · 3x < 0"; kho ghi 2y < 3x < 0 theo hướng dẫn của sách (đã ghi sach_in_sai).
## DE
Tính giá trị của phân thức $A=\dfrac{3x-2y}{3x+2y}$, biết rằng $9x^2+4y^2=20xy$ và $2y<3x<0$.
## SACH
$A^2=\dfrac{9x^2+4y^2-12xy}{9x^2+4y^2+12xy}=\dfrac{20xy-12xy}{20xy+12xy}=\dfrac{8xy}{32xy}=\dfrac{1}{4}$
Do $2y<3x<0\Rightarrow3x-2y>0$, $3x+2y<0\Rightarrow A<0$. Vậy $A=-\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bình phương $A$ thì tử và mẫu chỉ còn $9x^2+4y^2$ và $12xy$, mà giả thiết cho $9x^2+4y^2=20xy$, nên tính được $A^2$; còn dấu của $A$ lấy từ điều kiện về dấu của $3x$ và $2y$.

**Bước 1.** Bình phương $A$ rồi khai triển hằng đẳng thức để tử và mẫu cùng chứa $9x^2+4y^2$ và $12xy$.

**Bước 2.** Thay $9x^2+4y^2=20xy$ vào tử và mẫu rồi giản ước cho $xy$ để tính $A^2$.

**Bước 3.** Dùng điều kiện về dấu để xác định dấu của tử và mẫu, từ đó chọn đúng một trong hai giá trị có thể có của $A$.

**Chú ý:** Từ $A^2$ luôn suy ra hai giá trị đối nhau của $A$, nên bắt buộc phải xét dấu để loại một giá trị.

**Phần 2. Trình bày**

Vì $2y<3x<0$ nên $x<0$, $y<0$, do đó $xy\ne0$.

$A^2=\dfrac{(3x-2y)^2}{(3x+2y)^2}=\dfrac{9x^2+4y^2-12xy}{9x^2+4y^2+12xy}$

$=\dfrac{20xy-12xy}{20xy+12xy}$

$=\dfrac{8xy}{32xy}$

$=\dfrac{1}{4}$

Vì $2y<3x<0$ nên $3x-2y>0$ và $3x+2y<0$, do đó $A<0$.

Vậy $A=-\dfrac{1}{2}$.

=== T3B.35@p64
- bai: 35 · y: - · trang: 64 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010301
- cong_cu: giải hệ theo tham số z
- kiem: khong
- ket_qua_sach: -\dfrac{8}{13}
- dap_an: $-\dfrac{8}{13}$
- ghi_chu_nghi: logo ABC che chữ "Tính giá" ở đầu dòng cuối của đề; dựng lại "Tính giá trị của biểu thức" theo ngữ cảnh (đọc được phần còn lại).
## DE
Cho $3x-y=3z$ và $2x+y=7z$. Tính giá trị của biểu thức $M=\dfrac{x^2-2xy}{x^2+y^2}$ ($x\ne0$; $y\ne0$).
## SACH
Tính $x$ và $y$ theo $z$, được $x=2z$, $y=3z$. Thay các giá trị của $x$ và $y$ vào biểu thức $M$ và rút gọn được $M=-\dfrac{8}{13}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai điều kiện là hệ hai phương trình bậc nhất đối với $x$ và $y$ có $z$ làm tham số, nên giải ra $x$, $y$ theo $z$ rồi thay vào $M$.

**Bước 1.** Cộng hai đẳng thức theo vế để khử $y$ và tìm $x$ theo $z$.

**Bước 2.** Thay $x$ vừa tìm vào một trong hai đẳng thức để tìm $y$ theo $z$.

**Bước 3.** Thay $x$, $y$ vào $M$, đặt $z^2$ làm nhân tử chung ở tử và mẫu rồi giản ước.

**Chú ý:** Vì $x\ne0$ nên $z\ne0$, nhờ vậy mới giản ước được $z^2$.

**Phần 2. Trình bày**

Cộng hai đẳng thức theo vế: $5x=10z$, suy ra $x=2z$.

Thay vào $3x-y=3z$: $6z-y=3z$, suy ra $y=3z$.

Vì $x\ne0$ nên $z\ne0$. Khi đó $M=\dfrac{(2z)^2-2\cdot2z\cdot3z}{(2z)^2+(3z)^2}$

$=\dfrac{4z^2-12z^2}{4z^2+9z^2}$

$=\dfrac{-8z^2}{13z^2}$

$=-\dfrac{8}{13}$

=== T3B.36a@p65
- bai: 36 · y: a · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: tách phần nguyên · ước của hằng số
- kiem: khong
- ket_qua_sach: -1; 0; 1; 2
- dap_an: $S=\{-1;0;1;2\}$
- ghi_chu_nghi:
## DE
Tìm số nguyên $x$ để phân thức sau có giá trị là số nguyên: $\dfrac{3}{2x-1}$.
## SACH
$x\in\{-1;0;1;2\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là hằng số $3$ nên phân thức có giá trị nguyên khi và chỉ khi mẫu $2x-1$ là ước nguyên của $3$.

**Bước 1.** Nhận xét rằng với $x$ nguyên thì $2x-1$ là số nguyên khác $0$, nên phân số nguyên khi và chỉ khi $2x-1$ là ước của $3$.

**Bước 2.** Liệt kê tất cả các ước nguyên của $3$, gồm cả ước dương và ước âm.

**Bước 3.** Giải từng phương trình $2x-1=d$ với $d$ là một ước để tìm $x$.

**Phần 2. Trình bày**

Phân thức $\dfrac{3}{2x-1}$ có giá trị nguyên khi và chỉ khi $2x-1$ là ước của $3$, tức là $2x-1\in\{-3;-1;1;3\}$.

$2x-1=-3\Rightarrow x=-1$

$2x-1=-1\Rightarrow x=0$

$2x-1=1\Rightarrow x=1$

$2x-1=3\Rightarrow x=2$

Vậy $S=\{-1;0;1;2\}$.

=== T3B.36b@p65
- bai: 36 · y: b · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: ước của hằng số · mẫu luôn dương
- kiem: khong
- ket_qua_sach: -2; 0; 2
- dap_an: $S=\{-2;0;2\}$
- ghi_chu_nghi:
## DE
Tìm số nguyên $x$ để phân thức sau có giá trị là số nguyên: $\dfrac{5}{x^2+1}$.
## SACH
$x\in\{-2;0;2\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tử là hằng số $5$ và mẫu $x^2+1\ge1$ luôn dương, nên mẫu phải là ước dương của $5$.

**Bước 1.** Nhận xét $x^2+1\ge1$ với mọi $x$ nên mẫu chỉ có thể là một ước dương của $5$.

**Bước 2.** Liệt kê các ước dương của $5$ rồi lập phương trình $x^2+1=d$ cho từng ước $d$.

**Bước 3.** Giải từng phương trình để tìm các số nguyên $x$ tương ứng.

**Phần 2. Trình bày**

Phân thức $\dfrac{5}{x^2+1}$ có giá trị nguyên khi và chỉ khi $x^2+1$ là ước của $5$; vì $x^2+1\ge1>0$ nên $x^2+1\in\{1;5\}$.

$x^2+1=1\Rightarrow x=0$

$x^2+1=5\Rightarrow x^2=4\Rightarrow x=2$ hoặc $x=-2$

Vậy $S=\{-2;0;2\}$.

=== T3B.36c@p65
- bai: 36 · y: c · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: ước của hằng số · mẫu luôn dương
- kiem: khong
- ket_qua_sach: -2; 0; 1; 3
- dap_an: $S=\{-2;0;1;3\}$
- ghi_chu_nghi:
## DE
Tìm số nguyên $x$ để phân thức sau có giá trị là số nguyên: $\dfrac{7}{x^2-x+1}$.
## SACH
$x\in\{-2;0;1;3\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}$ luôn dương, nên với $x$ nguyên mẫu phải là ước dương của $7$.

**Bước 1.** Viết mẫu thành bình phương của một hiệu cộng một số dương để chỉ ra mẫu luôn dương.

**Bước 2.** Lập phương trình $x^2-x+1=d$ cho từng ước dương $d$ của $7$.

**Bước 3.** Giải từng phương trình bằng cách phân tích thành nhân tử rồi lấy các nghiệm nguyên.

**Phần 2. Trình bày**

Có $x^2-x+1=\left(x-\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$, nên phân thức có giá trị nguyên khi và chỉ khi $x^2-x+1$ là ước dương của $7$, tức là $x^2-x+1\in\{1;7\}$.

$x^2-x+1=1\Rightarrow x(x-1)=0\Rightarrow x=0$ hoặc $x=1$

$x^2-x+1=7\Rightarrow x^2-x-6=0\Rightarrow(x+2)(x-3)=0\Rightarrow x=-2$ hoặc $x=3$

Vậy $S=\{-2;0;1;3\}$.

=== T3B.36d@p65
- bai: 36 · y: d · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: chia đa thức · tách phần nguyên · ước của hằng số
- kiem: khong
- ket_qua_sach: -13; -9; -7; -3
- dap_an: $S=\{-13;-9;-7;-3\}$
- ghi_chu_nghi:
## DE
Tìm số nguyên $x$ để phân thức sau có giá trị là số nguyên: $\dfrac{x^2-59}{x+8}$.
## SACH
Đáp số: $x\in\{-13;-9;-7;-3\}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $x^2-59=(x^2-64)+5$ để tách được thừa số $x+8$ của mẫu, khi đó phân thức bằng một đa thức cộng với $\dfrac{5}{x+8}$.

**Bước 1.** Viết tử $x^2-59$ thành $(x^2-64)+5$ để nhóm được hiệu hai bình phương chia hết cho mẫu.

**Bước 2.** Tách phân thức thành một đa thức cộng với phân số có tử là hằng số.

**Bước 3.** Cho mẫu $x+8$ là ước của hằng số đó rồi giải từng trường hợp để tìm $x$.

**Phần 2. Trình bày**

$\dfrac{x^2-59}{x+8}=\dfrac{(x^2-64)+5}{x+8}=\dfrac{(x+8)(x-8)+5}{x+8}=x-8+\dfrac{5}{x+8}$

Với $x$ nguyên thì $x-8$ nguyên, nên phân thức nguyên khi và chỉ khi $\dfrac{5}{x+8}$ nguyên, tức là $x+8\in\{-5;-1;1;5\}$.

$x+8=-5\Rightarrow x=-13$

$x+8=-1\Rightarrow x=-9$

$x+8=1\Rightarrow x=-7$

$x+8=5\Rightarrow x=-3$

Vậy $S=\{-13;-9;-7;-3\}$.

=== T3B.36e@p65
- bai: 36 · y: e · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010501
- cong_cu: tính chia hết · nhân thêm thừa số để tách hằng số · thử lại
- kiem: khong
- ket_qua_sach: -2
- dap_an: $S=\{-2\}$
- ghi_chu_nghi:
## DE
Tìm số nguyên $x$ để phân thức sau có giá trị là số nguyên: $\dfrac{x+2}{x^2+4}$.
## SACH
$(x+2)\vdots(x^2+4)\Rightarrow(x+2)(x-2)\vdots(x^2+4)\Rightarrow(x^2+4-8)\vdots(x^2+4)$
$\Rightarrow8\vdots(x^2+4)$
Xét $x^2+4$ bằng $4$, bằng $8$ rồi thử lại, ta được $x=-2$ thỏa mãn bài toán.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phân thức nguyên nghĩa là $x^2+4$ là ước của $x+2$; nhân $x+2$ với $x-2$ để tử thành $x^2-4=(x^2+4)-8$, từ đó $x^2+4$ phải là ước của $8$.

**Bước 1.** Từ điều kiện $x^2+4$ là ước của $x+2$ suy ra $x^2+4$ cũng là ước của tích $(x+2)(x-2)$.

**Bước 2.** Tách $(x+2)(x-2)=x^2-4$ thành $(x^2+4)-8$ để thấy $x^2+4$ phải là ước của $8$, rồi chọn các ước thỏa $x^2+4\ge4$.

**Bước 3.** Giải từng trường hợp để có các giá trị $x$ ứng viên, rồi thử lại vào phân thức ban đầu vì đây mới chỉ là điều kiện cần.

**Chú ý:** Nhân thêm $x-2$ chỉ cho điều kiện cần, nên phải thử lại từng giá trị; ở đây giá trị $x=-2$ làm tử bằng $0$ và $0$ cũng là số nguyên.

**Phần 2. Trình bày**

Để $\dfrac{x+2}{x^2+4}$ nguyên thì $(x+2)\vdots(x^2+4)$, suy ra $(x+2)(x-2)\vdots(x^2+4)$, tức là $(x^2+4-8)\vdots(x^2+4)$, do đó $8\vdots(x^2+4)$.

Vì $x^2+4\ge4$ nên $x^2+4\in\{4;8\}$.

$x^2+4=4\Rightarrow x=0$: phân thức bằng $\dfrac{2}{4}$, không nguyên.

$x^2+4=8\Rightarrow x=2$ hoặc $x=-2$: với $x=2$ phân thức bằng $\dfrac{4}{8}$, không nguyên; với $x=-2$ phân thức bằng $\dfrac{0}{8}=0$, là số nguyên.

Vậy $S=\{-2\}$.

=== T3B.37@p65
- bai: 37 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010501
- cong_cu: đặt giá trị nguyên làm ẩn · bình phương của số hữu tỉ
- kiem: khong
- ket_qua_sach: 0; 1; -1; 2; -2; 3; -3; \dfrac{1}{2}; -\dfrac{1}{2}; \dfrac{1}{3}; -\dfrac{1}{3}
- dap_an: $S=\{0;1;-1;2;-2;3;-3;\dfrac{1}{2};-\dfrac{1}{2};\dfrac{1}{3};-\dfrac{1}{3}\}$
- ghi_chu_nghi: sách chỉ lập bảng, không viết dòng kết luận; ket_qua_sach lấy từ hàng cuối của bảng (các ô để trống được bỏ).
## DE
Tìm số hữu tỉ $x$ để phân thức $\dfrac{10}{x^2+1}$ có giá trị nguyên.
## SACH
Đặt $\dfrac{10}{x^2+1}=k\in\mathbb{Z}$, ta có $kx^2+k=10$ nên $x^2=\dfrac{10-k}{k}$.
Ta phải có $\dfrac{10-k}{k}\ge0$ nên $0<k\le10$. Ta có bảng sau (mỗi dòng: giá trị của $k$, của $x^2=\dfrac{10-k}{k}$ và của $x\in\mathbb{Q}$):
$k=1$: $x^2=9$; $x=\pm3$.
$k=2$: $x^2=4$; $x=\pm2$.
$k=3$: $x^2=\dfrac{7}{3}$; ô $x\in\mathbb{Q}$ để trống.
$k=4$: $x^2=\dfrac{3}{2}$; ô $x\in\mathbb{Q}$ để trống.
$k=5$: $x^2=1$; $x=\pm1$.
$k=6$: $x^2=\dfrac{2}{3}$; ô $x\in\mathbb{Q}$ để trống.
$k=7$: $x^2=\dfrac{3}{7}$; ô $x\in\mathbb{Q}$ để trống.
$k=8$: $x^2=\dfrac{1}{4}$; $x=\pm\dfrac{1}{2}$.
$k=9$: $x^2=\dfrac{1}{9}$; $x=\pm\dfrac{1}{3}$.
$k=10$: $x^2=0$; $x=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt giá trị nguyên của phân thức là $k$ rồi tính $x^2$ theo $k$; vì $x^2\ge0$ nên $k$ chỉ nhận hữu hạn giá trị, và với mỗi $k$ phải kiểm tra $x^2$ có là bình phương của một số hữu tỉ hay không.

**Bước 1.** Đặt $\dfrac{10}{x^2+1}=k$ với $k$ nguyên rồi rút $x^2$ theo $k$.

**Bước 2.** Dùng $x^2\ge0$ và phân thức luôn dương để giới hạn $k$ trong các số nguyên từ $1$ đến $10$.

**Bước 3.** Với từng giá trị của $k$, kiểm tra phân số $\dfrac{10-k}{k}$ có là bình phương của một số hữu tỉ hay không rồi tìm $x$.

**Bước 4.** Tập hợp mọi giá trị $x$ tìm được ở các trường hợp thỏa mãn.

**Chú ý:** Một phân số tối giản là bình phương của số hữu tỉ khi và chỉ khi cả tử và mẫu đều là số chính phương, nên các giá trị $\dfrac{7}{3}$, $\dfrac{3}{2}$, $\dfrac{2}{3}$, $\dfrac{3}{7}$ đều bị loại.

**Phần 2. Trình bày**

Đặt $\dfrac{10}{x^2+1}=k$ với $k$ nguyên. Vì $\dfrac{10}{x^2+1}>0$ nên $k\ge1$.

Từ $k(x^2+1)=10$ suy ra $x^2=\dfrac{10-k}{k}$.

Vì $x^2\ge0$ nên $10-k\ge0$, do đó $1\le k\le10$.

$k=1$: $x^2=9\Rightarrow x=\pm3$

$k=2$: $x^2=4\Rightarrow x=\pm2$

$k=3$: $x^2=\dfrac{7}{3}$, không là bình phương của số hữu tỉ (loại)

$k=4$: $x^2=\dfrac{3}{2}$, không là bình phương của số hữu tỉ (loại)

$k=5$: $x^2=1\Rightarrow x=\pm1$

$k=6$: $x^2=\dfrac{2}{3}$, không là bình phương của số hữu tỉ (loại)

$k=7$: $x^2=\dfrac{3}{7}$, không là bình phương của số hữu tỉ (loại)

$k=8$: $x^2=\dfrac{1}{4}\Rightarrow x=\pm\dfrac{1}{2}$

$k=9$: $x^2=\dfrac{1}{9}\Rightarrow x=\pm\dfrac{1}{3}$

$k=10$: $x^2=0\Rightarrow x=0$

Vậy $S=\{0;1;-1;2;-2;3;-3;\dfrac{1}{2};-\dfrac{1}{2};\dfrac{1}{3};-\dfrac{1}{3}\}$.

=== T3B.38@p65
- bai: 38 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: bình phương điều kiện $a+b=-c$
- kiem: khong
- ket_qua_sach: -\dfrac{3}{2}
- dap_an: $-\dfrac{3}{2}$
- ghi_chu_nghi:
## DE
Cho $a+b+c=0$ và $a$, $b$, $c$ đều khác $0$. Rút gọn biểu thức: $A=\dfrac{ab}{a^2+b^2-c^2}+\dfrac{bc}{b^2+c^2-a^2}+\dfrac{ca}{c^2+a^2-b^2}$.
## SACH
Từ $a+b+c=0$ suy ra $a+b=-c$.
Bình phương hai vế, ta được $a^2+b^2+2ab=c^2$ nên $a^2+b^2-c^2=-2ab$.
Tương tự, $b^2+c^2-a^2=-2bc$ và $c^2+a^2-b^2=-2ac$.
Do đó: $A=\dfrac{ab}{-2ab}+\dfrac{bc}{-2bc}+\dfrac{ca}{-2ca}=-\dfrac{1}{2}-\dfrac{1}{2}-\dfrac{1}{2}=-\dfrac{3}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $a+b+c=0$ suy ra $a+b=-c$, bình phương cho $a^2+b^2-c^2=-2ab$, nên mỗi mẫu bằng $-2$ lần tích ở tử và mỗi phân thức rút gọn thành một hằng số.

**Bước 1.** Chuyển $c$ sang vế phải rồi bình phương hai vế để lập quan hệ giữa $a^2+b^2-c^2$ và $ab$.

**Bước 2.** Hoán vị vòng quanh các chữ để có hai quan hệ tương tự cho hai mẫu còn lại.

**Bước 3.** Thay vào $A$, giản ước tử với mẫu ở từng phân thức (dùng $a$, $b$, $c$ khác $0$) rồi cộng ba kết quả.

**Phần 2. Trình bày**

Từ $a+b+c=0$ suy ra $a+b=-c$; bình phương hai vế: $a^2+2ab+b^2=c^2$, do đó $a^2+b^2-c^2=-2ab$.

Tương tự, $b^2+c^2-a^2=-2bc$ và $c^2+a^2-b^2=-2ca$.

Vì $a$, $b$, $c$ khác $0$ nên các mẫu trên đều khác $0$, và $A=\dfrac{ab}{-2ab}+\dfrac{bc}{-2bc}+\dfrac{ca}{-2ca}$

$=-\dfrac{1}{2}-\dfrac{1}{2}-\dfrac{1}{2}$

$=-\dfrac{3}{2}$

=== T3B.39@p65
- bai: 39 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010501
- cong_cu: quy đồng · phân tích đa thức hoán vị vòng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: nhóm khác khả dĩ là T18T010204 (phân tích đa thức hoán vị vòng a³(b−c)+b³(c−a)+c³(a−b)); chọn 010501 vì đề yêu cầu rút gọn một biểu thức phân thức cho trước.
## DE
Cho $a$, $b$, $c$ là các số nguyên khác nhau đôi một. Chứng minh rằng biểu thức sau có giá trị là một số nguyên: $P=\dfrac{a^3}{(a-b)(a-c)}+\dfrac{b^3}{(b-a)(b-c)}+\dfrac{c^3}{(c-a)(c-b)}$.
## SACH
$P=\dfrac{a^3(b-c)+b^3(c-a)+c^3(a-b)}{(a-b)(b-c)(a-c)}$
Phân tích tử thành nhân tử được $(a-b)(b-c)(a-c)(a+b+c)$.
Vậy $P=a+b+c$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Quy đồng ba phân thức về mẫu chung $(a-b)(b-c)(a-c)$ rồi phân tích tử (đa thức hoán vị vòng) thành tích có chứa chính mẫu chung đó, khi ấy $P$ rút gọn thành một biểu thức nguyên của $a$, $b$, $c$.

**Bước 1.** Đổi dấu các thừa số ở mẫu để ba mẫu cùng là ước của $(a-b)(b-c)(a-c)$, rồi quy đồng.

**Bước 2.** Phân tích tử bằng cách thay $c-a=-(a-b)-(b-c)$ rồi nhóm các hạng tử theo $(a-b)$ và $(b-c)$.

**Bước 3.** Giản ước nhân tử chung giữa tử và mẫu để được $P$ là một đa thức của $a$, $b$, $c$, rồi kết luận $P$ nguyên.

**Phần 2. Trình bày**

Vì $b-a=-(a-b)$ và $(c-a)(c-b)=(a-c)(b-c)$, quy đồng với mẫu chung $(a-b)(b-c)(a-c)$:

$P=\dfrac{a^3(b-c)+b^3(c-a)+c^3(a-b)}{(a-b)(b-c)(a-c)}$

Phân tích tử, thay $c-a=-(a-b)-(b-c)$:

$a^3(b-c)+b^3(c-a)+c^3(a-b)=a^3(b-c)-b^3(a-b)-b^3(b-c)+c^3(a-b)$

$=(b-c)(a^3-b^3)+(a-b)(c^3-b^3)$

$=(a-b)(b-c)(a^2+ab+b^2)-(a-b)(b-c)(b^2+bc+c^2)$

$=(a-b)(b-c)(a^2+ab-bc-c^2)$

$=(a-b)(b-c)(a-c)(a+b+c)$

Do đó $P=\dfrac{(a-b)(b-c)(a-c)(a+b+c)}{(a-b)(b-c)(a-c)}=a+b+c$.

Vì $a$, $b$, $c$ là các số nguyên nên $P=a+b+c$ là số nguyên.

=== T3B.40@p65
- bai: 40 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010301
- cong_cu: biểu diễn điều kiện để giản ước
- kiem: khong
- ket_qua_sach: 4
- dap_an: $4$
- ghi_chu_nghi:
## DE
Cho $3y-x=6$. Tính giá trị của biểu thức: $A=\dfrac{x}{y-2}+\dfrac{2x-3y}{x-6}$.
## SACH
$A=\dfrac{3y-6}{y-2}+\dfrac{2x-(x+6)}{x-6}=3+1=4$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Từ $3y-x=6$ suy ra $x=3y-6=3(y-2)$ và $3y=x+6$, nên tử của mỗi phân số đều là bội của mẫu và mỗi phân số rút gọn thành một số.

**Bước 1.** Biểu diễn $x$ theo $y$ từ điều kiện để thấy $x=3(y-2)$, nhờ đó phân số thứ nhất giản ước được.

**Bước 2.** Biểu diễn $3y$ theo $x$ từ điều kiện rồi thay vào tử của phân số thứ hai.

**Bước 3.** Giản ước từng phân số rồi cộng hai kết quả.

**Phần 2. Trình bày**

Từ $3y-x=6$ ta có $x=3y-6=3(y-2)$ và $3y=x+6$.

$A=\dfrac{3(y-2)}{y-2}+\dfrac{2x-(x+6)}{x-6}$

$=3+\dfrac{x-6}{x-6}$

$=3+1$

$=4$

=== T3B.41@p65
- bai: 41 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: tổng các số không âm bằng 0
- kiem: khong
- ket_qua_sach: x=y=z=0
- dap_an: $x=y=z=0$
- ghi_chu_nghi:
## DE
Tìm $x$, $y$, $z$ biết rằng: $\dfrac{x^2}{2}+\dfrac{y^2}{3}+\dfrac{z^2}{4}=\dfrac{x^2+y^2+z^2}{5}$.
## SACH
Từ $\dfrac{x^2}{2}+\dfrac{y^2}{3}+\dfrac{z^2}{4}=\dfrac{x^2+y^2+z^2}{5}$ suy ra $\left(\dfrac{x^2}{2}-\dfrac{x^2}{5}\right)+\left(\dfrac{y^2}{3}-\dfrac{y^2}{5}\right)+\left(\dfrac{z^2}{4}-\dfrac{z^2}{5}\right)=0$
Nên $\dfrac{3}{10}x^2+\dfrac{2}{15}y^2+\dfrac{1}{20}z^2=0$. Do đó $x=y=z=0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển hết sang một vế thì được tổng ba số hạng, mỗi số hạng là một hệ số dương nhân với một bình phương, mà tổng các số không âm bằng $0$ chỉ khi từng số bằng $0$.

**Bước 1.** Chuyển vế phải sang vế trái rồi nhóm các số hạng cùng chứa $x^2$, $y^2$, $z^2$ để quy đồng từng nhóm.

**Bước 2.** Chỉ ra hệ số của $x^2$, $y^2$, $z^2$ đều dương nên vế trái là tổng các số không âm.

**Bước 3.** Dùng tính chất tổng các số không âm bằng $0$ khi và chỉ khi từng số bằng $0$ để kết luận.

**Phần 2. Trình bày**

$\dfrac{x^2}{2}+\dfrac{y^2}{3}+\dfrac{z^2}{4}=\dfrac{x^2+y^2+z^2}{5}$

$\Leftrightarrow\left(\dfrac{1}{2}-\dfrac{1}{5}\right)x^2+\left(\dfrac{1}{3}-\dfrac{1}{5}\right)y^2+\left(\dfrac{1}{4}-\dfrac{1}{5}\right)z^2=0$

$\Leftrightarrow\dfrac{3}{10}x^2+\dfrac{2}{15}y^2+\dfrac{1}{20}z^2=0$

Mỗi số hạng ở vế trái đều không âm, mà tổng bằng $0$ nên $x^2=y^2=z^2=0$.

Vậy $x=y=z=0$.

=== T3B.42@p65
- bai: 42 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: tách số hạng thành tổng hai bình phương
- kiem: khong
- ket_qua_sach: x=1; y=1; x=1; y=-1; x=-1; y=1; x=-1; y=-1
- dap_an: $(x;y)\in\{(1;1);(1;-1);(-1;1);(-1;-1)\}$
- ghi_chu_nghi: ket_qua_sach là bốn cặp (x;y) liệt kê theo bảng của sách: (1;1), (1;−1), (−1;1), (−1;−1).
## DE
Tìm $x$, $y$ biết rằng: $x^2+y^2+\dfrac{1}{x^2}+\dfrac{1}{y^2}=4$.
## SACH
$\left(x^2+\dfrac{1}{x^2}\right)+\left(y^2+\dfrac{1}{y^2}\right)=4\Rightarrow\left(x^2+\dfrac{1}{x^2}-2\right)+\left(y^2+\dfrac{1}{y^2}-2\right)=0$
$\Rightarrow\left(x-\dfrac{1}{x}\right)^2+\left(y-\dfrac{1}{y}\right)^2=0\Rightarrow\begin{cases}x=\dfrac{1}{x}\\ y=\dfrac{1}{y}\end{cases}\Rightarrow\begin{cases}x^2=1\\ y^2=1\end{cases}$
Có bốn đáp số (bảng, mỗi cột là một đáp số):
$x$: $1$, $1$, $-1$, $-1$
$y$: $1$, $-1$, $1$, $-1$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết $4=2+2$ rồi nhóm thành $\left(x-\dfrac{1}{x}\right)^2+\left(y-\dfrac{1}{y}\right)^2=0$, tức là tổng hai bình phương bằng $0$.

**Bước 1.** Tách số $4$ ở vế phải thành $2+2$ và nhóm $x^2+\dfrac{1}{x^2}-2$ cùng $y^2+\dfrac{1}{y^2}-2$.

**Bước 2.** Nhận ra mỗi nhóm là bình phương của một hiệu để đưa phương trình về tổng hai bình phương bằng $0$.

**Bước 3.** Cho từng bình phương bằng $0$, giải $x=\dfrac{1}{x}$ và $y=\dfrac{1}{y}$ rồi ghép các cặp $(x;y)$.

**Chú ý:** Hai giá trị của $x$ ghép tự do với hai giá trị của $y$ nên có đủ $4$ cặp nghiệm.

**Phần 2. Trình bày**

Điều kiện $x\ne0$, $y\ne0$.

$x^2+y^2+\dfrac{1}{x^2}+\dfrac{1}{y^2}=4$

$\Leftrightarrow\left(x^2-2+\dfrac{1}{x^2}\right)+\left(y^2-2+\dfrac{1}{y^2}\right)=0$

$\Leftrightarrow\left(x-\dfrac{1}{x}\right)^2+\left(y-\dfrac{1}{y}\right)^2=0$

Tổng hai bình phương bằng $0$ nên $x-\dfrac{1}{x}=0$ và $y-\dfrac{1}{y}=0$, tức là $x^2=1$ và $y^2=1$.

Suy ra $x=1$ hoặc $x=-1$, và $y=1$ hoặc $y=-1$.

Vậy $(x;y)\in\{(1;1);(1;-1);(-1;1);(-1;-1)\}$.

=== T3B.43a@p65
- bai: 43 · y: a · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010501
- cong_cu: chia đa thức · tách phần nguyên · ước của hằng số
- kiem: khong
- ket_qua_sach: -2; 2; 4; 8
- dap_an: $S=\{-2;2;4;8\}$
- ghi_chu_nghi:
## DE
Tìm các giá trị nguyên của $x$ để phân thức sau có giá trị là số nguyên: $A=\dfrac{2x^3-6x^2+x-8}{x-3}$.
## SACH
$A=2x^2+1-\dfrac{5}{x-3}$; $x\in\{-2;2;4;8\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia tử cho mẫu được thương nguyên cộng với số dư là hằng số, nên phân thức nguyên khi và chỉ khi mẫu $x-3$ là ước của số dư đó.

**Bước 1.** Nhóm hạng tử để tách thừa số $x-3$ của mẫu, vì $2x^3-6x^2=2x^2(x-3)$.

**Bước 2.** Viết phần còn lại $x-8$ thành $(x-3)-5$ để phân thức thành một đa thức cộng với phân số có tử là hằng số.

**Bước 3.** Cho $x-3$ là ước của hằng số đó rồi giải từng trường hợp để tìm $x$.

**Phần 2. Trình bày**

$A=\dfrac{2x^2(x-3)+(x-8)}{x-3}=2x^2+\dfrac{(x-3)-5}{x-3}=2x^2+1-\dfrac{5}{x-3}$

Với $x$ nguyên thì $2x^2+1$ nguyên, nên $A$ nguyên khi và chỉ khi $\dfrac{5}{x-3}$ nguyên, tức là $x-3\in\{-5;-1;1;5\}$.

$x-3=-5\Rightarrow x=-2$

$x-3=-1\Rightarrow x=2$

$x-3=1\Rightarrow x=4$

$x-3=5\Rightarrow x=8$

Vậy $S=\{-2;2;4;8\}$.

=== T3B.43b@p65
- bai: 43 · y: b · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: chia đa thức · ước là bình phương
- kiem: khong
- ket_qua_sach: 0; 2
- dap_an: $S=\{0;2\}$
- ghi_chu_nghi:
## DE
Tìm các giá trị nguyên của $x$ để phân thức sau có giá trị là số nguyên: $B=\dfrac{x^4-2x^3-3x^2+8x-1}{x^2-2x+1}$.
## SACH
$x\in\{0;2\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mẫu là $(x-1)^2$ và phép chia tử cho mẫu cho thương $x^2-4$ dư $3$, nên $B=x^2-4+\dfrac{3}{(x-1)^2}$ và cần $(x-1)^2$ là ước của $3$.

**Bước 1.** Nhận ra mẫu $x^2-2x+1=(x-1)^2$ rồi thực hiện phép chia tử cho mẫu để tìm thương và số dư.

**Bước 2.** Viết $B$ thành một đa thức cộng với phân số có tử là hằng số và mẫu là $(x-1)^2$.

**Bước 3.** Cho $(x-1)^2$ là ước của hằng số đó, loại giá trị không phải bình phương của một số nguyên rồi giải để tìm $x$.

**Phần 2. Trình bày**

$x^4-2x^3-3x^2+8x-1=(x^2-4)(x^2-2x+1)+3$, nên $B=\dfrac{(x^2-4)(x-1)^2+3}{(x-1)^2}=x^2-4+\dfrac{3}{(x-1)^2}$.

Với $x$ nguyên thì $x^2-4$ nguyên, nên $B$ nguyên khi và chỉ khi $\dfrac{3}{(x-1)^2}$ nguyên, tức là $(x-1)^2$ là ước dương của $3$, nghĩa là $(x-1)^2\in\{1;3\}$.

Vì $(x-1)^2$ là bình phương của một số nguyên nên loại giá trị $3$, chỉ còn $(x-1)^2=1$.

$(x-1)^2=1\Rightarrow x-1=1$ hoặc $x-1=-1\Rightarrow x=2$ hoặc $x=0$

Vậy $S=\{0;2\}$.

=== T3B.43c@p65
- bai: 43 · y: c · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T010501
- cong_cu: chia đa thức · tách phần nguyên · ước của hằng số
- kiem: khong
- ket_qua_sach: 0
- dap_an: $S=\{0\}$
- ghi_chu_nghi:
## DE
Tìm các giá trị nguyên của $x$ để phân thức sau có giá trị là số nguyên: $C=\dfrac{x^4+3x^3+2x^2+6x-2}{x^2+2}$.
## SACH
$x\in\{0\}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhóm hạng tử của tử để tách thừa số $x^2+2$ của mẫu thì được $C=x^2+3x-\dfrac{2}{x^2+2}$, và vì $x^2+2\ge2$ nên chỉ còn một ước của $2$ phù hợp.

**Bước 1.** Nhóm các hạng tử của tử thành $x^2(x^2+2)+3x(x^2+2)$ để tách thừa số $x^2+2$ của mẫu.

**Bước 2.** Viết $C$ thành một đa thức cộng với phân số có tử là hằng số và mẫu là $x^2+2$.

**Bước 3.** Dùng $x^2+2\ge2$ để chọn ước phù hợp của hằng số đó rồi giải tìm $x$.

**Phần 2. Trình bày**

$C=\dfrac{x^2(x^2+2)+3x(x^2+2)-2}{x^2+2}=x^2+3x-\dfrac{2}{x^2+2}$

Với $x$ nguyên thì $x^2+3x$ nguyên, nên $C$ nguyên khi và chỉ khi $\dfrac{2}{x^2+2}$ nguyên, tức là $x^2+2$ là ước dương của $2$.

Vì $x^2+2\ge2$ nên $x^2+2=2$, suy ra $x=0$.

Vậy $S=\{0\}$.

=== T3B.44a@p65
- bai: 44 · y: a · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: chuỗi bất đẳng thức của sách (dòng "< 1/4 (1 + 1/(1·2) + ... + 1/((n−1)n))") chỉ có nghĩa khi n≥2; sách không xét n=1 (khi đó vế trái = 1/4 < 1/2). GIAI đã xét riêng n=1.
## DE
Chứng minh rằng với mọi số tự nhiên $n\ge1$: $\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dfrac{1}{6^2}+\cdots+\dfrac{1}{(2n)^2}<\dfrac{1}{2}$.
## SACH
$A=\dfrac{1}{2^2}+\dfrac{1}{4^2}+\dfrac{1}{6^2}+\cdots+\dfrac{1}{(2n)^2}=\dfrac{1}{4}\left(\dfrac{1}{1^2}+\dfrac{1}{2^2}+\dfrac{1}{3^2}+\cdots+\dfrac{1}{n^2}\right)$
$<\dfrac{1}{4}\left(1+\dfrac{1}{1\cdot2}+\dfrac{1}{2\cdot3}+\cdots+\dfrac{1}{(n-1)n}\right)=\dfrac{1}{4}\left(1+\dfrac{1}{1}-\dfrac{1}{n}\right)<\dfrac{1}{2}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đặt $\dfrac{1}{4}$ làm nhân tử chung để còn tổng các nghịch đảo bình phương, rồi làm trội mỗi số hạng $\dfrac{1}{k^2}$ (với $k\ge2$) bằng $\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac{1}{k}$ để tổng triệt tiêu liên tiếp.

**Bước 1.** Đặt $\dfrac{1}{4}$ ra ngoài vì $\dfrac{1}{(2k)^2}=\dfrac{1}{4}\cdot\dfrac{1}{k^2}$, còn lại tổng $\dfrac{1}{1^2}+\dfrac{1}{2^2}+\cdots+\dfrac{1}{n^2}$.

**Bước 2.** Giữ nguyên số hạng đầu $1$ và làm trội mỗi số hạng $\dfrac{1}{k^2}$ với $k\ge2$ bằng $\dfrac{1}{(k-1)k}$, vì mẫu $k^2$ lớn hơn mẫu $(k-1)k$.

**Bước 3.** Tách $\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac{1}{k}$ rồi cộng theo vế để các số hạng trung gian triệt tiêu.

**Bước 4.** Nhân kết quả với $\dfrac{1}{4}$ rồi so sánh với $\dfrac{1}{2}$, và xét riêng trường hợp $n=1$ vì chuỗi làm trội cần $n\ge2$.

**Phần 2. Trình bày**

Với $n=1$: vế trái bằng $\dfrac{1}{4}<\dfrac{1}{2}$.

Với $n\ge2$, gọi vế trái là $A$: $A=\dfrac{1}{4}\left(\dfrac{1}{1^2}+\dfrac{1}{2^2}+\dfrac{1}{3^2}+\cdots+\dfrac{1}{n^2}\right)$.

Với mọi $k\ge2$: $\dfrac{1}{k^2}<\dfrac{1}{(k-1)k}=\dfrac{1}{k-1}-\dfrac{1}{k}$. Do đó

$A<\dfrac{1}{4}\left[1+\left(\dfrac{1}{1}-\dfrac{1}{2}\right)+\left(\dfrac{1}{2}-\dfrac{1}{3}\right)+\cdots+\left(\dfrac{1}{n-1}-\dfrac{1}{n}\right)\right]$

$=\dfrac{1}{4}\left(1+1-\dfrac{1}{n}\right)$

$=\dfrac{1}{4}\left(2-\dfrac{1}{n}\right)$

$<\dfrac{1}{4}\cdot2=\dfrac{1}{2}$

Vậy bất đẳng thức đúng với mọi số tự nhiên $n\ge1$.

=== T3B.44b@p65
- bai: 44 · y: b · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi số tự nhiên $n\ge1$: $\dfrac{1}{3^2}+\dfrac{1}{5^2}+\dfrac{1}{7^2}+\cdots+\dfrac{1}{(2n+1)^2}<\dfrac{1}{4}$.
## SACH
$B=\dfrac{1}{3^2}+\dfrac{1}{5^2}+\cdots+\dfrac{1}{(2n+1)^2}<\dfrac{1}{3^2-1}+\dfrac{1}{5^2-1}+\cdots+\dfrac{1}{(2n+1)^2-1}$
$=\dfrac{1}{2\cdot4}+\dfrac{1}{4\cdot6}+\cdots+\dfrac{1}{2n(2n+2)}$
$=\dfrac{1}{2}\left(\dfrac{1}{2}-\dfrac{1}{4}+\dfrac{1}{4}-\dfrac{1}{6}+\cdots+\dfrac{1}{2n}-\dfrac{1}{2n+2}\right)=\dfrac{1}{2}\left(\dfrac{1}{2}-\dfrac{1}{2n+2}\right)<\dfrac{1}{4}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Làm trội mỗi số hạng $\dfrac{1}{(2k+1)^2}$ bằng $\dfrac{1}{(2k+1)^2-1}=\dfrac{1}{2k(2k+2)}$ (bớt $1$ ở mẫu) rồi tách thành $\dfrac{1}{2}$ nhân hiệu hai phân số để tổng triệt tiêu liên tiếp.

**Bước 1.** Làm trội mỗi số hạng bằng cách bớt $1$ ở mẫu, vì mẫu nhỏ hơn thì phân số lớn hơn.

**Bước 2.** Phân tích $(2k+1)^2-1=2k(2k+2)$ rồi tách $\dfrac{1}{2k(2k+2)}$ thành $\dfrac{1}{2}$ nhân hiệu hai phân số.

**Bước 3.** Cộng theo vế với $k$ chạy từ $1$ đến $n$ để các số hạng trung gian triệt tiêu rồi so sánh phần còn lại với $\dfrac{1}{4}$.

**Phần 2. Trình bày**

Với mọi $k\ge1$: $\dfrac{1}{(2k+1)^2}<\dfrac{1}{(2k+1)^2-1}=\dfrac{1}{2k(2k+2)}=\dfrac{1}{2}\left(\dfrac{1}{2k}-\dfrac{1}{2k+2}\right)$.

Gọi vế trái là $B$. Cho $k=1,2,\ldots,n$ rồi cộng lại:

$B<\dfrac{1}{2}\left[\left(\dfrac{1}{2}-\dfrac{1}{4}\right)+\left(\dfrac{1}{4}-\dfrac{1}{6}\right)+\cdots+\left(\dfrac{1}{2n}-\dfrac{1}{2n+2}\right)\right]$

$=\dfrac{1}{2}\left(\dfrac{1}{2}-\dfrac{1}{2n+2}\right)$

$<\dfrac{1}{2}\cdot\dfrac{1}{2}=\dfrac{1}{4}$

Vậy bất đẳng thức được chứng minh.

=== T3B.45@p65
- bai: 45 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi số tự nhiên $n\ge2$: $A=\dfrac{1}{2^2}+\dfrac{1}{3^2}+\dfrac{1}{4^2}+\cdots+\dfrac{1}{n^2}<\dfrac{2}{3}$.
## SACH
Nhận xét: $\dfrac{1}{n^2}<\dfrac{4}{4n^2-1}=2\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)$
Do đó: $A<2\left(\dfrac{1}{3}-\dfrac{1}{5}+\dfrac{1}{5}-\dfrac{1}{7}+\cdots+\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)=2\left(\dfrac{1}{3}-\dfrac{1}{2n+1}\right)<\dfrac{2}{3}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Làm trội $\dfrac{1}{k^2}=\dfrac{4}{4k^2}<\dfrac{4}{4k^2-1}$ rồi tách $\dfrac{4}{(2k-1)(2k+1)}=2\left(\dfrac{1}{2k-1}-\dfrac{1}{2k+1}\right)$ để tổng triệt tiêu liên tiếp.

**Bước 1.** Viết $\dfrac{1}{k^2}=\dfrac{4}{4k^2}$ rồi bớt $1$ ở mẫu để làm trội thành $\dfrac{4}{4k^2-1}$.

**Bước 2.** Phân tích mẫu $4k^2-1=(2k-1)(2k+1)$ và tách phân thức thành hiệu hai phân số có mẫu hơn kém $2$ đơn vị.

**Bước 3.** Cộng theo vế với $k$ chạy từ $2$ đến $n$ để các số hạng trung gian triệt tiêu rồi so sánh phần còn lại với $\dfrac{2}{3}$.

**Phần 2. Trình bày**

Với mọi $k\ge2$: $\dfrac{1}{k^2}<\dfrac{4}{4k^2-1}=\dfrac{4}{(2k-1)(2k+1)}=2\left(\dfrac{1}{2k-1}-\dfrac{1}{2k+1}\right)$.

Cho $k=2,3,\ldots,n$ rồi cộng lại:

$A<2\left[\left(\dfrac{1}{3}-\dfrac{1}{5}\right)+\left(\dfrac{1}{5}-\dfrac{1}{7}\right)+\cdots+\left(\dfrac{1}{2n-1}-\dfrac{1}{2n+1}\right)\right]$

$=2\left(\dfrac{1}{3}-\dfrac{1}{2n+1}\right)$

$<\dfrac{2}{3}$

Vậy bất đẳng thức được chứng minh.

=== T3B.46@p65
- bai: 46 · y: - · trang: 65 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030103
- cong_cu: làm trội · tách thành hiệu · khử liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với số tự nhiên $n\ge3$: $B=\dfrac{1}{3^3}+\dfrac{1}{4^3}+\dfrac{1}{5^3}+\cdots+\dfrac{1}{n^3}<\dfrac{1}{12}$.
## SACH
Ta thấy: $\dfrac{1}{n^3}<\dfrac{1}{n^3-n}=\dfrac{1}{(n-1)n(n+1)}=\dfrac{1}{2}\cdot\dfrac{(n+1)-(n-1)}{(n-1)n(n+1)}$
$=\dfrac{1}{2}\left[\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right]$.
Do đó:
$B<\dfrac{1}{2}\left[\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}+\dfrac{1}{3\cdot4}-\dfrac{1}{4\cdot5}+\cdots+\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right]<\dfrac{1}{2}\cdot\dfrac{1}{6}=\dfrac{1}{12}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Làm trội $\dfrac{1}{k^3}<\dfrac{1}{k^3-k}=\dfrac{1}{(k-1)k(k+1)}$ (bớt $k$ ở mẫu) rồi tách thành $\dfrac{1}{2}$ nhân hiệu hai phân số có mẫu là tích hai số liên tiếp để tổng triệt tiêu.

**Bước 1.** Làm trội mỗi số hạng bằng cách bớt $k$ ở mẫu, vì với $k\ge3$ mẫu $k^3-k$ vẫn dương và nhỏ hơn $k^3$.

**Bước 2.** Phân tích $k^3-k=(k-1)k(k+1)$ rồi tách $\dfrac{1}{(k-1)k(k+1)}$ thành $\dfrac{1}{2}$ nhân hiệu hai phân số có mẫu là tích hai số liên tiếp.

**Bước 3.** Cộng theo vế với $k$ chạy từ $3$ đến $n$ để các số hạng trung gian triệt tiêu rồi so sánh phần còn lại với $\dfrac{1}{12}$.

**Phần 2. Trình bày**

Với mọi $k\ge3$: $\dfrac{1}{k^3}<\dfrac{1}{k^3-k}=\dfrac{1}{(k-1)k(k+1)}=\dfrac{1}{2}\cdot\dfrac{(k+1)-(k-1)}{(k-1)k(k+1)}=\dfrac{1}{2}\left[\dfrac{1}{(k-1)k}-\dfrac{1}{k(k+1)}\right]$.

Cho $k=3,4,\ldots,n$ rồi cộng lại:

$B<\dfrac{1}{2}\left[\left(\dfrac{1}{2\cdot3}-\dfrac{1}{3\cdot4}\right)+\left(\dfrac{1}{3\cdot4}-\dfrac{1}{4\cdot5}\right)+\cdots+\left(\dfrac{1}{(n-1)n}-\dfrac{1}{n(n+1)}\right)\right]$

$=\dfrac{1}{2}\left[\dfrac{1}{2\cdot3}-\dfrac{1}{n(n+1)}\right]$

$<\dfrac{1}{2}\cdot\dfrac{1}{6}=\dfrac{1}{12}$

Vậy bất đẳng thức được chứng minh.
