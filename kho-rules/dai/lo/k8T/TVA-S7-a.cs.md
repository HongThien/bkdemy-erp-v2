=== T7V1.1@p137
- bai: VD1 · y: - · trang: 137 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Xét số dư khi chia cho 5 · tích có một thừa số chia hết cho 5
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in nhầm hai nhân tử: ở trường hợp r=±1 sách ghi n²+1 chia hết cho 5 (đúng phải là n²+4, vì 25k²±10k+1+4 chia hết cho 5), ở trường hợp r=±2 sách ghi n²+4 (đúng phải là n²+1). Máy: n(n²+1)(n²+4) chia hết cho 5 với mọi n trong [-500;500]. ## GIAI theo bản đúng.
## DE
Chứng minh rằng với mọi $n\in\mathbb{Z}$: $A(n)=n(n^2+1)(n^2+4)\vdots5$.
## SACH
Xét mọi trường hợp khi chia $n\in\mathbb{Z}$ cho $5$, ta có số dư là $r=0,\pm1,\pm2$.

a. $r=0\Rightarrow n\vdots5$

b. $r=\pm1\Rightarrow n=5k\pm1\Rightarrow n^2=25k^2\pm10k+1\Rightarrow n^2+1\vdots5$

c. $r=\pm2\Rightarrow n=5k\pm2\Rightarrow n^2=25k^2\pm20k+4\Rightarrow n^2+4\vdots5$

$A(n)$ là tích của ba thừa số, trong mọi trường hợp đều có một thừa số chia hết cho $5$. Vậy $A(n)\vdots5$, với mọi $n\in\mathbb{Z}$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tích gồm ba thừa số mà phải chứng minh chia hết cho số nguyên tố $5$, nên chỉ cần chỉ ra rằng với mọi $n$ luôn có ít nhất một thừa số chia hết cho $5$ — việc đó làm được bằng cách xét số dư của $n$ khi chia cho $5$.

**Bước 1.** Chia mọi số nguyên $n$ thành năm trường hợp theo số dư $0,\pm1,\pm2$ khi chia cho $5$; dùng số dư âm để chỉ cần tính hai kiểu bình phương.

**Bước 2.** Ở trường hợp $n$ chia hết cho $5$ thì thừa số $n$ đã đủ, không cần xét hai nhân tử còn lại.

**Bước 3.** Với số dư $\pm1$, tính $n^2$ rồi thử xem nhân tử nào trong hai nhân tử $n^2+1$, $n^2+4$ cộng thêm vào cho ra bội của $5$.

**Bước 4.** Làm tương tự với số dư $\pm2$ rồi kết luận mọi trường hợp đều có một thừa số chia hết cho $5$.

**Chú ý:** Đừng chép nhầm nhân tử: $n\equiv\pm1$ thì $n^2\equiv1$ nên nhân tử chia hết cho $5$ là $n^2+4$; $n\equiv\pm2$ thì $n^2\equiv4$ nên nhân tử đó là $n^2+1$.

**Phần 2. Trình bày**

Mọi số nguyên $n$ đều có dạng $n=5k$, $n=5k\pm1$ hoặc $n=5k\pm2$ với $k\in\mathbb{Z}$.

Nếu $n=5k$ thì $n\vdots5$.

Nếu $n=5k\pm1$ thì $n^2+4=25k^2\pm10k+5=5(5k^2\pm2k+1)\vdots5$.

Nếu $n=5k\pm2$ thì $n^2+1=25k^2\pm20k+5=5(5k^2\pm4k+1)\vdots5$.

Vậy trong mọi trường hợp $A(n)$ có một thừa số chia hết cho $5$, nên $A(n)\vdots5$ với mọi $n\in\mathbb{Z}$.

=== T7V1.2@p138
- bai: VD2 · y: - · trang: 138 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Chia theo số dư · phản chứng · trong k số liên tiếp có một bội của k
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách ở phần c ghi "giả sử m > q" (đáng lẽ m > p). Máy: kiểm hết k từ 1 đến 11, n từ -50 đến 49, trong k số liên tiếp có đúng một số chia hết cho k.
## DE
Chứng minh rằng: a) Trong hai số nguyên liên tiếp, có một và chỉ một số chia hết cho $2$. b) Trong ba số nguyên liên tiếp, có một và chỉ một số chia hết cho $3$. c) Trong $k$ số nguyên liên tiếp, có một và chỉ một số chia hết cho $k$.
## SACH
a. Hai số nguyên liên tiếp là $n$ và $n+1$. Nếu $n$ chia hết cho $2$ thì $n+1$ không chia hết cho $2$. Nếu $n$ không chia hết cho $2$ thì $n+1$ chia hết cho $2$.

b. Ba số nguyên liên tiếp là $n,\ n+1,\ n+2$. Nếu $n\vdots3$ thì $n+1$ và $n+2$ không chia hết cho $3$. Nếu $n$ không chia hết cho $3$, thì chia $n$ cho $3$, ta có số dư là $1$ hoặc $2$:

$n=3q+1\Rightarrow n+2=(3q+3)\vdots3$. Lúc đó $n+1$ không chia hết cho $3$.

$n=3q+2\Rightarrow n+1=(3q+3)\vdots3$. Lúc đó $n+2$ không chia hết cho $3$.

Như vậy: trong dãy ba số nguyên liên tiếp, bao giờ cũng có một và chỉ một số chia hết cho $3$ (đpcm).

c. $k$ số nguyên liên tiếp có dạng: $n,\ n+1,\ n+2,\ \dots,\ n+k-1$ (1). Ta chứng minh hai phần:

1. Trong dãy (1), bao giờ cũng có một số chia hết cho $k$. Thật vậy, số $n$ có thể viết: $n=kq+r$ với $0\le r<k$ ($r$ là số dư khi chia $n$ cho $k$). Nếu $r=0$ thì $n$ chia hết cho $k$. Nếu $r\ne0$, ta xét số: $n'=n+(k-r)$. Vì $0<r<k$, nên $0<k-r\le k-1$. Do đó $n'$ là một số thuộc dãy (1). $n'=n+(k-r)=(kq+r)+k-r=k(q+1)\vdots k$. Nghĩa là nếu $r\ne0$ thì $n'=n+(k-r)$ chia hết cho $k$.

2. Trong dãy (1) chỉ có một số chia hết cho $k$. Ta chứng minh điều này bằng phản chứng. Giả sử trong dãy (1) có hai số $m$ và $p$ cùng chia hết cho $k$, và giả sử $m>q$. Thế thì hiệu của $m-p$ cũng chia hết cho $k$. Trong dãy (1), hiệu giữa số lớn nhất và số nhỏ nhất: $0<m-p\le k-1$. Và số $m-p$ này không thể chia hết cho $k$. Mâu thuẫn đó ($m-p$ chia hết cho $k$, đồng thời lại không chia hết cho $k$) chứng tỏ trong dãy (1) có nhiều nhất là một số chia hết cho $k$. Từ hai phần a) và b) ta kết luận được: Trong $k$ số nguyên liên tiếp, có một và chỉ một số chia hết cho $k$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả ba câu đều nói "có một và chỉ một", nên mỗi câu phải chứng minh hai việc: tồn tại một bội của số đã cho trong dãy, và không thể có hai bội cùng nằm trong dãy.

**Bước 1.** Với các số nhỏ ($2$ và $3$), viết các số liên tiếp là $n,n+1,\dots$ rồi xét số dư của $n$ để thấy ngay số nào chia hết.

**Bước 2.** Với $k$ tổng quát, viết $n=kq+r$ rồi cộng thêm $k-r$ để đưa $n$ về bội kế tiếp của $k$, và kiểm tra bội đó vẫn nằm trong dãy.

**Bước 3.** Chứng minh tính duy nhất bằng phản chứng: hai bội của $k$ có hiệu cũng chia hết cho $k$, trong khi hiệu hai số của dãy lại nhỏ hơn $k$.

**Chú ý:** Hai câu a, b chỉ là trường hợp riêng $k=2$ và $k=3$ của câu c; câu c còn cho biết hai số của dãy hiệu nhỏ hơn $k$ thì không thể cùng chia hết cho $k$.

**Phần 2. Trình bày**

a) Hai số nguyên liên tiếp là $n$ và $n+1$.

Nếu $n\vdots2$ thì $n+1$ không chia hết cho $2$; nếu $n\not\vdots2$ thì $n+1\vdots2$. Vậy luôn có một và chỉ một số chia hết cho $2$.

b) Ba số nguyên liên tiếp là $n$, $n+1$, $n+2$.

Nếu $n\vdots3$ thì $n+1$, $n+2$ không chia hết cho $3$.

Nếu $n=3q+1$ thì $n+2=3(q+1)\vdots3$, còn $n$ và $n+1=3q+2$ không chia hết cho $3$.

Nếu $n=3q+2$ thì $n+1=3(q+1)\vdots3$, còn $n$ và $n+2=3q+4$ không chia hết cho $3$.

Vậy luôn có một và chỉ một số chia hết cho $3$.

c) Xét $k$ số nguyên liên tiếp $n,\ n+1,\ \dots,\ n+k-1$ (1).

Có một số chia hết cho $k$: viết $n=kq+r$ với $0\le r<k$. Nếu $r=0$ thì $n\vdots k$. Nếu $r\ne0$ thì $0<k-r\le k-1$ nên $n'=n+(k-r)$ thuộc dãy (1), và $n'=kq+r+k-r=k(q+1)\vdots k$.

Chỉ có một số chia hết cho $k$: giả sử có hai số $m>p$ của dãy (1) cùng chia hết cho $k$. Khi đó $(m-p)\vdots k$. Nhưng $0<m-p\le k-1<k$ nên $m-p$ không chia hết cho $k$, mâu thuẫn.

Vậy trong $k$ số nguyên liên tiếp có một và chỉ một số chia hết cho $k$.

=== T7V1.3@p138
- bai: VD3 · y: - · trang: 138 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tích hai số nguyên tố cùng nhau cùng chia hết · trong n số liên tiếp có một bội của n
- kiem: khong
- ket_qua_sach: 24
- dap_an: a) Chứng minh; b) $24$
- ghi_chu_nghi: Sách chỉ nêu A(n) chia hết cho 24 mà không nói 24 là số lớn nhất; ## GIAI bổ sung (1·2·3·4=24 nên không thể chia hết cho số lớn hơn 24 với mọi 4 số liên tiếp). Máy: tích 4 số liên tiếp chia hết cho 24 với mọi n trong [-500;500].
## DE
Chứng minh rằng: a) Tích của ba số nguyên liên tiếp chia hết cho $6$. b) Tích của $4$ số nguyên liên tiếp chia hết cho bao nhiêu?
## SACH
a. Gọi ba số nguyên liên tiếp là $n$, $n+1$ và $n+2$. Tích của chúng là: $A(n)=n(n+1)(n+2)$. Ta có $6=2\cdot3$ ($2$ và $3$ là số nguyên tố).

Trong hai số nguyên liên tiếp $n$ và $n+1$, bao giờ cũng có một số chẵn, do đó $A(n)\vdots2$. Trong ba số nguyên liên tiếp $n$, $n+1$ và $n+2$ bao giờ cũng có một số chia hết cho $3$, nên tích của chúng luôn chia hết cho $3$: $A(n)\vdots3$.

$A(n)\vdots2$ và $A(n)\vdots3$, mà $(2,3)=1$ nên $A(n)\vdots2\cdot3=6$ (đpcm).

Chú ý rằng: ba số nguyên liên tiếp có thể là $n-1$, $n$ và $n+1$, như vậy ta có: $(n-1)n(n+1)=n(n^2-1)=n^3-n$ chia hết cho $6$.

b. $A(n)=n(n+1)(n+2)(n+3)$.

Trước hết, ta thấy rằng trong bốn số nguyên liên tiếp: $n$, $n+1$, $n+2$, $n+3$, bao giờ cũng có một số chia hết cho $2$ và một số khác chia hết cho $4$. Thật vậy: Nếu $n=2k$ thì $n+2=2k+2=2(k+1)$. Do đó: Khi $k$ chẵn thì $n\vdots4$ còn $n+2\vdots2$. Khi $k$ lẻ thì $n+2\vdots4$ còn $n\vdots2$. Tương tự như vậy, nếu xét $n+1=2k$ thì trong hai số $n+1$ và $n+3$ có một số chia hết cho $4$, số kia chia hết cho $2$. Do đó $A(n)=n(n+1)(n+2)(n+3)\vdots2\cdot4=8$.

Theo a) thì $n(n+1)(n+2)\vdots3$. Mà $(3,8)=1$ nên $A(n)\vdots3\cdot8=24$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chứng minh một tích chia hết cho hợp số $6$ hay $24$, tách hợp số thành các thừa số nguyên tố cùng nhau ($2\cdot3$ hoặc $3\cdot8$), chứng minh chia hết cho từng thừa số rồi ghép lại.

**Bước 1.** Với tích ba số liên tiếp, chỉ ra tích chia hết cho $2$ (vì có số chẵn) và chia hết cho $3$ (vì có một bội của $3$), rồi ghép hai kết quả vì $2$ và $3$ nguyên tố cùng nhau.

**Bước 2.** Với tích bốn số liên tiếp, nhận ra rằng hai số chẵn trong đó là hai số chẵn liên tiếp, viết chúng dạng $2m$ và $2m+2$ để tích của chúng chia hết cho $8$.

**Bước 3.** Lấy kết quả câu a để có tích ba số liên tiếp đầu chia hết cho $3$, rồi ghép với $8$ vì $\gcd(3,8)=1$ để được $24$.

**Bước 4.** Thử bốn số liên tiếp nhỏ nhất $1,2,3,4$ để biết $24$ là số lớn nhất có tính chất đó với mọi bộ bốn số liên tiếp.

**Chú ý:** Chỉ được ghép "chia hết cho cả $a$ lẫn $b$ thì chia hết cho $ab$" khi $a$, $b$ nguyên tố cùng nhau; ví dụ chia hết cho $2$ và $4$ chưa suy ra chia hết cho $8$.

**Phần 2. Trình bày**

a) Ba số nguyên liên tiếp là $n$, $n+1$, $n+2$; đặt $A=n(n+1)(n+2)$.

Trong hai số liên tiếp $n$, $n+1$ có một số chẵn nên $A\vdots2$.

Trong ba số liên tiếp có một số chia hết cho $3$ nên $A\vdots3$.

Vì $\gcd(2,3)=1$ nên $A\vdots2\cdot3=6$.

b) Bốn số nguyên liên tiếp $n$, $n+1$, $n+2$, $n+3$ có đúng hai số chẵn, và đó là hai số chẵn liên tiếp $2m$ và $2m+2$.

Tích hai số chẵn đó là $2m(2m+2)=4m(m+1)\vdots8$ vì $m(m+1)\vdots2$.

Trong bốn số có ba số liên tiếp nên tích của chúng chia hết cho $3$ (theo a), do đó $B=n(n+1)(n+2)(n+3)\vdots3$.

Vì $B\vdots8$, $B\vdots3$ và $\gcd(3,8)=1$ nên $B\vdots24$.

Mặt khác với $n=1$ thì $B=1\cdot2\cdot3\cdot4=24$ nên không có số nào lớn hơn $24$ mà mọi tích bốn số liên tiếp đều chia hết.

Vậy tích của $4$ số nguyên liên tiếp chia hết cho $24$.

=== T7V1.4@p139
- bai: VD4 · y: - · trang: 139 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Biểu diễn số chẵn dạng 2n · tích hai số liên tiếp chia hết cho 2
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: 2n(2n+2) chia hết cho 8 với mọi n trong [-500;500].
## DE
Chứng minh rằng tích của hai số chẵn liên tiếp chia hết cho $8$.
## SACH
Gọi số chẵn thứ nhất là $2n$, số chẵn tiếp theo là $2n+2$. Tích của chúng là $A(n)=2n(2n+2)$. Ta có: $8=4\cdot2$. Do đó ta viết: $A(n)=4n(n+1)$. $A(n)$ là tích của hai thừa số: một thừa số là $4$, chia hết cho $4$ và một thừa số là $n(n+1)$ chia hết cho $2$. Vì vậy $A(n)=4n(n+1)\vdots4\cdot2=8$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai số chẵn liên tiếp luôn viết được dạng $2n$ và $2n+2$, nên tích có sẵn thừa số $4$ sau khi đặt nhân tử chung, chỉ còn thiếu một thừa số $2$.

**Bước 1.** Gọi số chẵn thứ nhất là $2n$ để số chẵn liền sau là $2n+2$ với $n$ nguyên.

**Bước 2.** Đặt nhân tử chung $2$ ở mỗi thừa số để tích viết thành $4$ nhân với $n(n+1)$.

**Bước 3.** Nhận ra $n(n+1)$ là tích hai số nguyên liên tiếp, luôn có một số chẵn, nên chia hết cho $2$; ghép với $4$ ra $8$.

**Phần 2. Trình bày**

Gọi hai số chẵn liên tiếp là $2n$ và $2n+2$ với $n\in\mathbb{Z}$.

Tích của chúng là $A=2n(2n+2)=4n(n+1)$.

Trong hai số liên tiếp $n$ và $n+1$ có một số chẵn nên $n(n+1)\vdots2$.

Do đó $A=4\cdot n(n+1)\vdots4\cdot2=8$.

Vậy tích của hai số chẵn liên tiếp chia hết cho $8$.

=== T7V1.5@p139
- bai: VD5 · y: - · trang: 139 · tang: nang_cao
- nguon_de: Đề thi học sinh giỏi cấp II toàn quốc, 1970
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tách hạng tử thành tích ba số liên tiếp · tích ba số liên tiếp chia hết cho 6
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: n³-13n chia hết cho 6 với mọi n trong [-500;500]. Năm in đọc là 1970 (ảnh hơi mờ). Sách in điều kiện trong ngoặc sau "số nguyên n bất kì" bị nhoè (đọc giống "n > -1"); kho BỎ điều kiện đó khỏi đề vì lời giải đúng với mọi số nguyên n (đã mở ảnh trang 139 xác nhận chỗ nhoè).
## DE
(Đề thi học sinh giỏi cấp II toàn quốc, 1970) Chứng minh rằng lập phương của một số nguyên $n$ bất kì trừ đi $13$ lần số nguyên đó thì luôn chia hết cho $6$.
## SACH
Ta phải chứng minh: $A(n)=n^3-13n\vdots6$.

Chú ý rằng: $13n=12n+n$, mà $12n\vdots6$, ta biến đổi $A(n)$ thành: $A(n)=(n^3-n)-12n$.

Ta có: $n^3-n=n(n^2-1)=(n-1)n(n+1)$. Đây là tích của ba số nguyên liên tiếp, tích này luôn chia hết cho $6$. $A(n)$ là hiệu của hai hạng tử: $n^3-n$ và $12n$, mỗi hạng tử chia hết cho $6$, nên $A(n)\vdots6$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hệ số $13=12+1$ và $12$ chia hết cho $6$, nên tách $-13n=-n-12n$ để lộ ra $n^3-n$ — đó là tích của ba số nguyên liên tiếp.

**Bước 1.** Viết $n^3-13n=(n^3-n)-12n$ vì $12n$ đã chia hết cho $6$ nên chỉ cần để ý phần $n^3-n$.

**Bước 2.** Phân tích $n^3-n$ thành nhân tử để thấy nó là tích của ba số nguyên liên tiếp $(n-1)$, $n$, $n+1$.

**Bước 3.** Dùng tính chất tích ba số nguyên liên tiếp chia hết cho $6$ (có số chẵn và có bội của $3$), rồi cộng hai kết quả chia hết cho $6$ lại.

**Phần 2. Trình bày**

$A=n^3-13n=(n^3-n)-12n$

$=(n-1)n(n+1)-12n$

Trong ba số nguyên liên tiếp $n-1$, $n$, $n+1$ có một số chẵn và một bội của $3$; vì $\gcd(2,3)=1$ nên $(n-1)n(n+1)\vdots6$.

Lại có $12n\vdots6$.

Vậy $A$ là hiệu của hai số cùng chia hết cho $6$ nên $A\vdots6$ với mọi số nguyên $n$.

=== T7V1.6@p140
- bai: VD6 · y: - · trang: 140 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Tách hạng tử để lộ tích ba số liên tiếp · tổng các số chia hết cho 9
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: n³+(n+1)³+(n+2)³ chia hết cho 9 với mọi n trong [-500;500].
## DE
Chứng minh rằng tổng lập phương của ba số nguyên liên tiếp chia hết cho $9$.
## SACH
Ba số nguyên liên tiếp là $n,\ n+1,\ n+2$, ta phải chứng minh: $A=n^3+(n+1)^3+(n+2)^3$ chia hết cho $9$.

Ta có: $A=n^3+(n+1)^3+(n+2)^3=3n^3+9n^2+15n+9=3n^3-3n+18n+9n^2+9=3n(n-1)(n+1)+18n+9+9n^2$.

$n,\ n-1,\ n+1$ là ba số nguyên liên tiếp, trong đó một số chia hết cho $3$. Vậy: $B=3n(n-1)(n+1)\vdots9$; $C=18n+9n^2+9\vdots9$. $A=B+C$ mà $B\vdots9$, $C\vdots9$ nên $A\vdots9$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Khai triển ra $3n^3+9n^2+15n+9$, hệ số các hạng tử bậc thấp gần như chia hết cho $9$; chỉ cần tách phần $3n^3+15n$ để lộ $3n(n-1)(n+1)$, tức $3$ nhân với tích ba số liên tiếp.

**Bước 1.** Khai triển hai lập phương rồi cộng lại để có đa thức $3n^3+9n^2+15n+9$ theo $n$.

**Bước 2.** Tách $15n=-3n+18n$ để gom $3n^3-3n$ thành $3n(n-1)(n+1)$, phần còn lại $9n^2+18n+9$ đã chia hết cho $9$ rõ ràng.

**Bước 3.** Nhận ra tích $n(n-1)(n+1)$ chia hết cho $3$, nhân với $3$ được bội của $9$, rồi cộng hai phần chia hết cho $9$.

**Phần 2. Trình bày**

$A=n^3+(n+1)^3+(n+2)^3=3n^3+9n^2+15n+9$

$=(3n^3-3n)+18n+9n^2+9$

$=3n(n-1)(n+1)+9(n^2+2n+1)$

Trong ba số nguyên liên tiếp $n-1$, $n$, $n+1$ có một số chia hết cho $3$, nên $n(n-1)(n+1)\vdots3$ và $3n(n-1)(n+1)\vdots9$.

Lại có $9(n^2+2n+1)\vdots9$.

Vậy $A\vdots9$.

=== T7V1.7@p140
- bai: VD7 · y: - · trang: 140 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Đặt n=2k+1 · một hạng tử không chia hết, các hạng tử còn lại chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: n²+4n+5 không chia hết cho 8 với mọi n lẻ trong [-501;501].
## DE
Chứng minh rằng: $n^2+4n+5$ không chia hết cho $8$ với mọi số $n$ lẻ.
## SACH
Đặt $n=2k+1$, ta có: $n^2+4n+5=(2k+1)^2+4(2k+1)+5=(4k^2+4k+1)+(8k+4)+5=(4k^2+4k)+(8k+8)+2=4k(k+1)+8(k+1)+2$. Đây là tổng của ba hạng tử, hạng tử đầu $4k(k+1)$ chia hết cho $8$, hạng tử thứ hai $8(k+1)$ cũng chia hết cho $8$, riêng hạng tử thứ ba là $2$ không chia hết cho $8$. Vậy tổng đã cho không chia hết cho $8$.

Chú ý: Để chứng minh một tổng không chia hết cho $m$, ta chứng minh một hạng tử nào đó không chia hết cho $m$, còn tất cả các hạng tử khác đều chia hết cho $m$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề nói "không chia hết", nên phải tách biểu thức thành các hạng tử sao cho mọi hạng tử đều chia hết cho $8$ trừ đúng một hạng tử có số dư khác $0$.

**Bước 1.** Vì $n$ lẻ nên đặt $n=2k+1$ với $k$ nguyên rồi thay vào biểu thức.

**Bước 2.** Khai triển và gom lại để xuất hiện $4k(k+1)$ và $8(k+1)$, còn lại một hằng số.

**Bước 3.** Chứng minh $4k(k+1)\vdots8$ nhờ $k(k+1)$ là tích hai số liên tiếp nên chẵn, rồi dùng tính chất: tổng của các số chia hết cho $8$ cộng với một số không chia hết cho $8$ thì không chia hết cho $8$.

**Chú ý:** Cách này chỉ áp dụng được khi các hạng tử còn lại đều chia hết cho $m$; nếu có hai hạng tử cùng không chia hết thì chưa kết luận được.

**Phần 2. Trình bày**

Vì $n$ lẻ nên $n=2k+1$ với $k\in\mathbb{Z}$.

$n^2+4n+5=(2k+1)^2+4(2k+1)+5$

$=4k^2+4k+1+8k+4+5$

$=4k(k+1)+8(k+1)+2$

Vì $k(k+1)$ là tích hai số nguyên liên tiếp nên $k(k+1)\vdots2$, do đó $4k(k+1)\vdots8$.

Lại có $8(k+1)\vdots8$, còn $2\not\vdots8$.

Vậy $n^2+4n+5\not\vdots8$ với mọi số $n$ lẻ.

=== T7V1.8@p140
- bai: VD8 · y: - · trang: 140 · tang: nang_cao
- nguon_de: Đề thi HSG lớp 9 tỉnh Phú Thọ năm 2003-2004
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Số nguyên tố lớn hơn 3 · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách ghi "k > 1", "h > 1" (do p lớn hơn 3 nên thực ra k ≥ 2, h ≥ 1) và bỏ bước ghép 8 với 3 vì nguyên tố cùng nhau; ## GIAI đã bổ sung. Máy: (p-1)(p+1) chia hết cho 24 với mọi số nguyên tố p trong (3;5000).
## DE
(Đề thi HSG lớp 9 tỉnh Phú Thọ năm 2003-2004) Chứng minh rằng nếu $p$ là số nguyên tố lớn hơn $3$ thì $(p-1)(p+1)$ chia hết cho $24$.
## SACH
Vì $p$ là số nguyên tố lớn hơn $3$ nên $p$ là số lẻ, không chia hết cho $3$. Do đó $p=2k+1$ ($k\in\mathbb{Z},\ k>1$) suy ra $A=(p-1)(p+1)=2k(2k+2)=4k(k+1)$ suy ra $A$ chia hết cho $8$.

$p=3h\pm1$ ($h\in\mathbb{Z},\ h>1$) suy ra $A$ chia hết cho $3$.

Vậy $A=(p-1)(p+1)$ chia hết cho $24$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $24=8\cdot3$ với $8$ và $3$ nguyên tố cùng nhau, chỉ cần chứng minh $(p-1)(p+1)$ chia hết cho $8$ và cho $3$ — hai điều đó suy ra từ việc $p$ nguyên tố lớn hơn $3$ nên lẻ và không chia hết cho $3$.

**Bước 1.** Do $p$ lẻ nên viết $p=2k+1$, khi đó $p-1$ và $p+1$ là hai số chẵn liên tiếp, tích dạng $4k(k+1)$ chia hết cho $8$.

**Bước 2.** Do $p$ không chia hết cho $3$ nên $p$ chia $3$ dư $1$ hoặc $2$, tức $p=3h\pm1$, khi đó một trong $p-1$, $p+1$ chia hết cho $3$.

**Bước 3.** Ghép hai kết quả bằng điều kiện $\gcd(8,3)=1$ để có chia hết cho $24$.

**Phần 2. Trình bày**

Vì $p$ là số nguyên tố lớn hơn $3$ nên $p$ lẻ và $p\not\vdots3$.

$p$ lẻ nên $p=2k+1$ $(k\in\mathbb{Z})$, suy ra

$(p-1)(p+1)=2k(2k+2)=4k(k+1)$

Vì $k(k+1)\vdots2$ nên $(p-1)(p+1)\vdots8$.

$p\not\vdots3$ nên $p=3h+1$ hoặc $p=3h+2$ $(h\in\mathbb{Z})$: nếu $p=3h+1$ thì $p-1=3h\vdots3$; nếu $p=3h+2$ thì $p+1=3(h+1)\vdots3$. Do đó $(p-1)(p+1)\vdots3$.

Vì $\gcd(8,3)=1$ nên $(p-1)(p+1)\vdots8\cdot3=24$.

=== T7V1.9@p141
- bai: VD9 · y: - · trang: 141 · tang: nang_cao
- nguon_de: Đề thi vô địch New York, 1975
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hằng đẳng thức aᵐ-1=(a-1)(aᵐ⁻¹+…+1) · nhóm hạng tử để lộ nhân tử n-1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề in n^n - n² + n - 1 (mũ n ở số hạng đầu in nhỏ; đã kiểm số: n=3 cho 20 chia hết cho 4, n=4 cho 243 chia hết cho 9). Máy: chia hết cho (n-1)² với mọi n từ 2 đến 79.
## DE
(Đề thi vô địch New York, 1975) Chứng minh rằng số $n^n-n^2+n-1$ chia hết cho $(n-1)^2$, với mọi số nguyên $n>1$.
## SACH
Với $n=2$ thì $n^n-n^2+n-1=1$ chia hết cho $(n-1)^2=(2-1)^2=1$.

Với $n>2$, ta có: $A=n^n-n^2+n-1=(n^{n-2}-1)n^2+(n-1)=(n-1)(n^{n-3}+\dots+1)n^2+(n-1)=(n-1)(n^{n-1}+\dots+n^2+1)$.

Xét tổng $B=n^{n-1}+\dots+n^2+1$; $B$ có $n-1$ số hạng, ta có thể viết: $B=(n^{n-1}-1)+(n^{n-2}-1)+\dots+(n^2-1)+(1-1)+(n-1)$.

Mỗi hiệu trong dấu ngoặc đều chia hết cho $(n-1)$ do đó $B$ chia hết cho $n-1$. Vì vậy: $A=(n-1)B$ chia hết cho $(n-1)^2$, đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Để có $(n-1)^2$ phải rút được một nhân tử $n-1$ ra khỏi $A$, rồi chứng minh phần còn lại $B$ cũng chia hết cho $n-1$; dấu hiệu là $n^n-n^2=n^2(n^{n-2}-1)$ chứa hiệu $a^m-1$.

**Bước 1.** Tách riêng trường hợp $n=2$ rồi với $n>2$ viết $A=n^2(n^{n-2}-1)+(n-1)$ để dùng hằng đẳng thức $a^m-1=(a-1)(a^{m-1}+\dots+1)$.

**Bước 2.** Đặt $n-1$ làm nhân tử chung của toàn biểu thức để $A=(n-1)B$ với $B$ là tổng $n-1$ luỹ thừa liên tiếp của $n$.

**Bước 3.** Chứng minh $B\vdots(n-1)$ bằng cách trừ $1$ từ mỗi số hạng, mỗi hiệu $n^j-1$ chia hết cho $n-1$, rồi bù lại $n-1$ đơn vị vừa trừ.

**Chú ý:** Có đúng $n-1$ số hạng trong $B$ nên số đơn vị cộng bù chính là $n-1$ — đây mới là chỗ khiến $B$ chia hết cho $n-1$.

**Phần 2. Trình bày**

Với $n=2$: $n^n-n^2+n-1=1\vdots(2-1)^2=1$.

Với $n>2$: $A=n^n-n^2+n-1=n^2(n^{n-2}-1)+(n-1)$

$=n^2(n-1)(n^{n-3}+n^{n-4}+\dots+n+1)+(n-1)$

$=(n-1)(n^{n-1}+n^{n-2}+\dots+n^2+1)=(n-1)B$ với $B=n^{n-1}+n^{n-2}+\dots+n^2+1$

$B$ có $n-1$ số hạng nên $B=(n^{n-1}-1)+(n^{n-2}-1)+\dots+(n^2-1)+(1-1)+(n-1)$

Mỗi hiệu $n^j-1$ chia hết cho $n-1$ và số cộng thêm cuối cùng là $n-1$, nên $B\vdots(n-1)$.

Vậy $A=(n-1)B\vdots(n-1)^2$.

=== T7V1.10@p141
- bai: VD10 · y: - · trang: 141 · tang: nang_cao
- nguon_de: Đề thi học sinh giỏi cấp II miền Bắc, 1971
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Phân tích thành nhân tử · tích bốn số nguyên dương liên tiếp chia hết cho 24
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: n⁴-4n³-4n²+16n chia hết cho 384 với mọi n chẵn từ 6 đến 398.
## DE
(Đề thi học sinh giỏi cấp II miền Bắc, 1971) Chứng minh rằng các số có dạng: $n^4-4n^3-4n^2+16n$ với $n$ chẵn và lớn hơn $4$ thì chia hết cho $384$.
## SACH
Ta phân tích biểu thức đã cho ra nhân tử: $A=n^4-4n^3-4n^2+16n=(n^4-4n^3)-(4n^2-16n)=n^3(n-4)-4n(n-4)=n(n-4)(n^2-4)=n(n-2)(n+2)(n-4)$.

Vì $n$ chẵn và lớn hơn $4$ nên ta đặt $n=2k+2$ ($k>1$) và biểu diễn theo $k$, ta có: $A=(2k+2)(2k)(2k+4)(2k-2)=16k(k-1)(k+1)(k+2)=16(k-1)(k)(k+1)(k+2)$. Ta nhận thấy $(k-1)(k)(k+1)(k+2)$ là tích của bốn số nguyên dương liên tiếp, tích này chia hết cho $2\cdot3\cdot4=24$.

Vậy tích $A$ đã cho chia hết cho: $16\cdot2\cdot3\cdot4=384$ (đpcm).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc bốn không có nhân tử rõ ràng nhưng nhóm hạng tử đưa về tích bốn nhân tử $n-4$, $n-2$, $n$, $n+2$ cách đều nhau; với $n$ chẵn mỗi nhân tử đều chẵn nên rút được thừa số $2^4=16$ và còn lại bốn số liên tiếp.

**Bước 1.** Nhóm hai cặp hạng tử $(n^4-4n^3)$ và $-(4n^2-16n)$ để đặt được nhân tử chung $n-4$, rồi phân tích tiếp $n^2-4$.

**Bước 2.** Vì $n$ chẵn và $n>4$ nên đặt $n=2k+2$ với $k\ge2$, khi đó bốn nhân tử trở thành các số chẵn liên tiếp.

**Bước 3.** Rút $2$ ra khỏi từng nhân tử để thấy tích bằng $16$ nhân với tích bốn số nguyên dương liên tiếp.

**Bước 4.** Dùng tính chất tích bốn số nguyên liên tiếp chia hết cho $24$ và nhân với $16$ để ra $384=16\cdot24$.

**Phần 2. Trình bày**

$A=n^4-4n^3-4n^2+16n=n^3(n-4)-4n(n-4)$

$=n(n-4)(n^2-4)=(n-4)(n-2)n(n+2)$

Vì $n$ chẵn, $n>4$ nên $n=2k+2$ với $k\in\mathbb{Z}$, $k\ge2$.

$A=(2k-2)(2k)(2k+2)(2k+4)=16(k-1)k(k+1)(k+2)$

Tích $(k-1)k(k+1)(k+2)$ của bốn số nguyên dương liên tiếp có hai số chẵn liên tiếp (tích chia hết cho $8$) và một bội của $3$, nên chia hết cho $24$.

Vậy $A\vdots16\cdot24=384$.

=== T7V1.11@p141
- bai: VD11 · y: - · trang: 141 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hằng đẳng thức aⁿ-bⁿ chia hết cho a-b
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy: 2^(4n)-1 chia hết cho 15 với n từ 0 đến 49.
## DE
Chứng minh: $2^{4n}-1$ chia hết cho $15$.
## SACH
$2^{4n}-1=(2^4)^n-1^n=(2^4-1)\left[(2^4)^{n-1}+\dots+1\right]=15\cdot M$. Vậy $2^{4n}-1\vdots15$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số mũ $4n$ cho phép viết $2^{4n}=(2^4)^n=16^n$, và $16-1=15$ đúng là số cần chia hết, nên dùng ngay tính chất $a^n-b^n$ chia hết cho $a-b$.

**Bước 1.** Viết $2^{4n}-1$ thành $16^n-1^n$ để nhận ra dạng hiệu hai luỹ thừa cùng số mũ.

**Bước 2.** Phân tích hiệu hai luỹ thừa thành tích $(16-1)$ nhân với một tổng nguyên.

**Bước 3.** Đọc ra thừa số $16-1=15$ để kết luận chia hết, không cần tính tổng còn lại.

**Phần 2. Trình bày**

$2^{4n}-1=16^n-1^n$

$=(16-1)(16^{n-1}+16^{n-2}+\dots+16+1)$

$=15\cdot M$ với $M=16^{n-1}+16^{n-2}+\dots+16+1$ là số nguyên.

Vậy $2^{4n}-1\vdots15$.

=== T7V1.12@p142
- bai: VD12 · y: - · trang: 142 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Nhóm bốn số hạng liên tiếp · đặt nhân tử chung
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Đề sách in "A = 7¹+7²+7³+7⁴+…+7⁴k (trong đó k là số tự nhiên chia hết cho 400)" nhưng không nói rõ cần chứng minh gì; lời giải sách (kết luận A chia hết cho 400, không dùng điều kiện k chia hết cho 400) cho thấy đề đúng là chứng minh A chia hết cho 400 với k tự nhiên (k ≥ 1), số hạng cuối là 7^(4k). Vì vậy ## DE viết theo nghĩa đó. Máy: A chia hết cho 400 với mọi k từ 1 đến 59.
## DE
Chứng minh rằng tổng $A=7^1+7^2+7^3+7^4+\dots+7^{4k}$ (trong đó $k$ là số tự nhiên khác $0$) chia hết cho $400$.
## SACH
Hãy nhóm các hạng tử của tổng đã cho theo cách:

$A=(7+7^2+7^3+7^4)+(7^5+7^6+7^7+7^8)+\dots+(7^{4k-3}+7^{4k-2}+7^{4k-1}+7^{4k})$

$=(7+7^2+7^3+7^4)+7^4(7+7^2+7^3+7^4)+\dots+7^{4k-4}(7+7^2+7^3+7^4)$

$=(7+7^2+7^3+7^4)(1+7^4+7^8+\dots+7^{4k-4})$

$=7(1+7+49+343)(1+7^4+7^8+\dots+7^{4k-4})=7\cdot400\cdot M$

Vậy $A\vdots400$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Các số hạng $7,7^2,\dots,7^{4k}$ xếp thành $k$ nhóm bốn số liên tiếp, và mỗi nhóm bằng nhóm đầu nhân với một luỹ thừa của $7^4$; nhóm đầu $7+7^2+7^3+7^4=2800=7\cdot400$ chính là chứa thừa số $400$.

**Bước 1.** Chia tổng thành $k$ nhóm, mỗi nhóm gồm bốn số hạng liên tiếp, vì số hạng cuối là $7^{4k}$ nên chia hết thành các nhóm tròn bốn.

**Bước 2.** Đặt nhóm đầu $7+7^2+7^3+7^4$ làm nhân tử chung, mỗi nhóm sau bằng nhóm đầu nhân $7^{4j}$.

**Bước 3.** Tính nhóm đầu bằng cách đặt $7$ ra ngoài: $7(1+7+49+343)=7\cdot400$ để lộ thừa số $400$.

**Phần 2. Trình bày**

$A=(7+7^2+7^3+7^4)+(7^5+7^6+7^7+7^8)+\dots+(7^{4k-3}+7^{4k-2}+7^{4k-1}+7^{4k})$

$=(7+7^2+7^3+7^4)+7^4(7+7^2+7^3+7^4)+\dots+7^{4k-4}(7+7^2+7^3+7^4)$

$=(7+7^2+7^3+7^4)(1+7^4+7^8+\dots+7^{4k-4})$

$=7(1+7+49+343)(1+7^4+\dots+7^{4k-4})$

$=7\cdot400\cdot(1+7^4+\dots+7^{4k-4})$

Vì thừa số thứ hai là số nguyên nên $A\vdots400$.

=== T7V1.13@p142
- bai: VD13 · y: - · trang: 142 · tang: nang_cao
- nguon_de: Đề thi vào chuyên toán Hà Nội 1976 – vòng 1
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Hằng đẳng thức (a-1)(aⁿ⁻¹+…+1)=aⁿ-1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy tính chính xác bằng số lớn: A = 25·4^1976, nên chia hết cho 4^1976 (dư 0).
## DE
(Đề thi vào chuyên toán Hà Nội 1976 – vòng 1) Chứng minh biểu thức: $A=75(4^{1975}+4^{1974}+\dots+4^2+5)+25$ chia hết cho $4^{1976}$.
## SACH
$A=25\cdot3(4^{1975}+4^{1974}+\dots+4^2+4+1)+25=25\cdot(4-1)(4^{1975}+4^{1974}+\dots+4^2+4+1)+25$

Áp dụng hằng đẳng thức, ta có: $A=25(4^{1976}-1)+25=25\cdot4^{1976}$

Vậy $A\vdots4^{1976}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số hạng cuối trong ngoặc là $5=4+1$ nên cả ngoặc là tổng $1+4+4^2+\dots+4^{1975}$ của một cấp số nhân; nhân với $3=4-1$ sẽ rút gọn gọn thành $4^{1976}-1$.

**Bước 1.** Viết $5=4+1$ và $75=25\cdot3$ để ngoặc có đủ các luỹ thừa liên tiếp của $4$ từ $4^0$ đến $4^{1975}$.

**Bước 2.** Thay $3=4-1$ rồi dùng hằng đẳng thức $(a-1)(a^{m}+\dots+a+1)=a^{m+1}-1$ để rút gọn tích về một luỹ thừa.

**Bước 3.** Cộng với số $25$ ở cuối để các hạng tử $-25$ và $+25$ triệt tiêu, còn lại $25$ nhân với một luỹ thừa của $4$.

**Phần 2. Trình bày**

$A=75(4^{1975}+4^{1974}+\dots+4^2+4+1)+25$

$=25\cdot(4-1)(4^{1975}+4^{1974}+\dots+4^2+4+1)+25$

$=25(4^{1976}-1)+25$

$=25\cdot4^{1976}$

Vậy $A\vdots4^{1976}$.

=== T7V1.14@p142
- bai: VD14 · y: - · trang: 142 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Chia đa thức rồi quy về ước của số dư · phép thử trong bảng
- kiem: khong
- ket_qua_sach: -1; 2
- dap_an: $n\in\{-1;2\}$
- ghi_chu_nghi: Máy: quét n nguyên trong [-3000;3000] (B khác 0) cho đúng hai giá trị n=-1 và n=2, khớp sách.
## DE
Tìm số nguyên $n$ để giá trị của biểu thức $A$ chia hết cho giá trị của biểu thức $B$: $A=n^3+2n^2-3n+2$, $B=n^2-n$.
## SACH
Đặt phép chia: $(n^3+2n^2-3n+2):(n^2-n)$

$n^3+2n^2-3n+2=(n^2-n)(n+3)+2$

Muốn chia hết, ta phải có $2$ chia hết cho $n(n-1)$, do đó $2$ chia hết cho $n$. Ta có bảng ($n=1;-1;2;-2$ ứng với $n-1=0;-2;1;-3$ và $n(n-1)=0;2;2;6$; ở cột $n=1$ và $n=-2$ ghi "loại").

Đáp số: $n=-1$, $n=2$.

Chú ý: a) Không thể nói đa thức $A$ chia hết cho đa thức $B$. Ở đây chỉ tồn tại những giá trị nguyên của $n$ để giá trị của biểu thức $A$ chia hết cho giá trị của biểu thức $B$.

b) Có thể thay việc đặt phép chia bằng cách biến đổi: $n^3+2n^2-3n+2=n(n^2-n)+3(n^2-n)+2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phân tích $A$ theo $B$ (chia đa thức) để $A=B\cdot(n+3)+2$; khi đó $A$ chia hết cho $B$ chỉ khi số dư $2$ chia hết cho $B$, và $B=n(n-1)$ nên $n$ phải là ước của $2$.

**Bước 1.** Biến đổi $A=n(n^2-n)+3(n^2-n)+2=(n^2-n)(n+3)+2$ để tách riêng phần chia hết cho $B$ và số dư $2$.

**Bước 2.** Đặt điều kiện $B\ne0$ rồi suy ra $A\vdots B$ khi và chỉ khi $2\vdots B$; từ đó $2\vdots n$ nên $n$ chỉ có thể là $\pm1,\pm2$.

**Bước 3.** Thử từng giá trị còn lại, bỏ những giá trị làm $B=0$ hoặc làm $B$ không là ước của $2$.

**Chú ý:** Phải loại $n=0$ và $n=1$ trước vì lúc đó $B=0$ không thể làm số chia.

**Phần 2. Trình bày**

$A=n^3+2n^2-3n+2=n(n^2-n)+3(n^2-n)+2=(n^2-n)(n+3)+2$

Điều kiện $B\ne0$, tức $n\ne0$ và $n\ne1$.

Vì $(n^2-n)(n+3)\vdots B$ nên $A\vdots B\Leftrightarrow2\vdots B=n(n-1)$. Suy ra $2\vdots n$ nên $n\in\{-2;-1;1;2\}$.

$n=1$: $B=0$, loại.

$n=-1$: $B=2$, $A=6\vdots2$, nhận.

$n=2$: $B=2$, $A=12\vdots2$, nhận.

$n=-2$: $B=6$, $A=8\not\vdots6$, loại.

Vậy $n\in\{-1;2\}$.

=== T7V1.15@p143
- bai: VD15 · y: - · trang: 143 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Phân tích thành nhân tử · so sánh độ lớn để loại khả năng chia hết · thử lại
- kiem: khong
- ket_qua_sach: 0; 1
- dap_an: $n=1$
- ghi_chu_nghi: Sách kết luận n=0 và n=1, nhưng đề yêu cầu n nguyên dương nên n=0 phải loại; kết quả đúng chỉ có n=1. Máy: quét n từ 1 đến 2999 chỉ có n=1 thoả; n=0 cũng thoả phép chia nhưng không phải số nguyên dương. Mạch lập luận ở phần "n>1" của sách vòng vo (xét n²-n+1=±1); ## GIAI chặn trực tiếp 0<n-1<n²-n+1.
## DE
Tìm số nguyên dương $n$ để $n^5+1$ chia hết cho $n^3+1$.
## SACH
Biến đổi: $n^5+1\vdots n^3+1\Leftrightarrow n^2(n^3+1)-(n^2-1)\vdots n^3+1\Leftrightarrow(n+1)(n-1)\vdots(n+1)(n^2-n+1)\Leftrightarrow n-1\vdots n^2-n+1$ (vì $n+1\ne0$).

Nếu $n=1$ thì ta được $0$ chia hết cho $1$.

Nếu $n>1$ thì $n-1<n(n-1)+1=n^2-n+1$, do đó $n-1$ không thể chia hết cho $n^2-n+1$. Có hai trường hợp:

a. $n^2-n+1=1\Leftrightarrow n(n-1)=0\Leftrightarrow n=0;\ n=1$. Các giá trị này thỏa mãn đề bài.

b. $n^2-n+1=-1\Leftrightarrow n^2-n+2=0$. Vô nghiệm.

Vậy $n=0$, $n=1$ là hai số phải tìm.

Chú ý: Từ $n-1\vdots n^2-n+1$ suy ra $n(n-1)\vdots n^2-n+1$ là phép kéo theo chứ không là phép biến đổi tương đương. Do đó sau khi tìm được $n=0$, $n=1$ thì phải thử lại.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả $n^5+1$ và $n^3+1$ đều có nhân tử chung $n+1$ nên chia bớt đi được, đưa bài toán về chia hết giữa hai biểu thức bậc thấp $n-1$ và $n^2-n+1$; khi đó so sánh độ lớn sẽ loại gần hết trường hợp.

**Bước 1.** Viết $n^5+1=n^2(n^3+1)-(n^2-1)$ để thấy $n^5+1\vdots n^3+1$ khi và chỉ khi $n^2-1\vdots n^3+1$.

**Bước 2.** Phân tích $n^2-1$ và $n^3+1$ thành nhân tử rồi giản ước nhân tử $n+1\ne0$ để còn $n-1\vdots n^2-n+1$.

**Bước 3.** Xét $n=1$ riêng vì lúc đó vế bị chia bằng $0$, còn với $n>1$ so sánh $n-1$ với $n^2-n+1$ để thấy số bị chia dương và nhỏ hơn số chia.

**Bước 4.** Đối chiếu kết quả với điều kiện $n$ nguyên dương và thử lại giá trị tìm được.

**Chú ý:** Giá trị $n=0$ làm $n-1\vdots n^2-n+1$ nhưng không phải số nguyên dương nên bị loại theo đề.

**Phần 2. Trình bày**

$n^5+1=n^2(n^3+1)-(n^2-1)$ nên $n^5+1\vdots n^3+1\Leftrightarrow n^2-1\vdots n^3+1$

$\Leftrightarrow(n+1)(n-1)\vdots(n+1)(n^2-n+1)\Leftrightarrow n-1\vdots n^2-n+1$ (vì $n+1\ne0$)

Với $n=1$: $0\vdots1$, thoả mãn.

Với $n>1$: $0<n-1<n^2-n+1$ (vì $n^2-2n+2=(n-1)^2+1>0$) nên $n-1$ không chia hết cho $n^2-n+1$, loại.

Thử lại $n=1$: $n^5+1=2$, $n^3+1=2$, $2\vdots2$ đúng.

Vậy $n=1$.

=== T7V1.16@p143
- bai: VD16 · y: - · trang: 143 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Chia trường hợp theo số dư của n khi chia cho 3 · aᵐ-1 chia hết cho a-1
- kiem: khong
- ket_qua_sach: n=3k (k\in\mathbb{N})
- dap_an: $n=3k$ với $k\in\mathbb{N}$
- ghi_chu_nghi: Máy: với n từ 0 đến 199, 2^n-1 chia hết cho 7 đúng khi n chia hết cho 3 (kể cả n=0, vì 2^0-1=0). "BS 7+1" trong sách nghĩa là "bội của 7 cộng 1".
## DE
Tìm số tự nhiên $n$ sao cho $2^n-1$ chia hết cho $7$.
## SACH
Nếu $n=3k$ ($k\in\mathbb{N}$) thì $2^n-1=2^{3k}-1=8^k-1$ chia hết cho $7$.

Nếu $n=3k+1$ ($k\in\mathbb{N}$) thì $2^n-1=2^{3k+1}-1=2(2^{3k}-1)+1=\mathrm{BS}\ 7+1$

Nếu $n=3k+2$ ($k\in\mathbb{N}$) thì $2^n-1=2^{3k+2}-1=4(2^{3k}-1)+3=\mathrm{BS}\ 7+3$

Vậy $2^n-1$ chia hết cho $7\Leftrightarrow n=3k$ ($k\in\mathbb{N}$).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vì $2^3=8\equiv1\pmod 7$, nên số dư của $2^n$ khi chia cho $7$ lặp lại sau mỗi $3$ bước; do đó chia $n$ thành ba dạng $3k$, $3k+1$, $3k+2$.

**Bước 1.** Với $n=3k$, viết $2^{3k}=8^k$ rồi dùng tính chất $a^k-1$ chia hết cho $a-1$ với $a=8$.

**Bước 2.** Với $n=3k+1$, tách $2^{3k+1}-1=2(2^{3k}-1)+1$ để thấy phần trong ngoặc chia hết cho $7$ còn dư lại $1$.

**Bước 3.** Với $n=3k+2$, tách $2^{3k+2}-1=4(2^{3k}-1)+3$ để thấy số dư là $3$, rồi kết luận chỉ dạng $3k$ thoả mãn.

**Phần 2. Trình bày**

Mọi số tự nhiên $n$ có dạng $n=3k$, $n=3k+1$ hoặc $n=3k+2$ với $k\in\mathbb{N}$.

Với $n=3k$: $2^n-1=8^k-1^k\vdots8-1=7$.

Với $n=3k+1$: $2^n-1=2(2^{3k}-1)+1$; vì $2^{3k}-1\vdots7$ nên $2^n-1$ chia $7$ dư $1$, không chia hết.

Với $n=3k+2$: $2^n-1=4(2^{3k}-1)+3$; vì $2^{3k}-1\vdots7$ nên $2^n-1$ chia $7$ dư $3$, không chia hết.

Vậy $2^n-1\vdots7$ khi và chỉ khi $n=3k$ với $k\in\mathbb{N}$.
