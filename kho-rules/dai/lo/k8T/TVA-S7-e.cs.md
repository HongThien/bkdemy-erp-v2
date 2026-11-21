=== T7B.30@p157
- bai: 30 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét số dư · số chính phương chia 3 dư 0 hoặc 1 · số chính phương lẻ chia 8 dư 1 · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Một tấm bìa dạng tam giác vuông có độ dài ba cạnh là các số nguyên. Chứng minh rằng có thể cắt tấm bìa thành sáu phần có diện tích bằng nhau và diện tích mỗi phần là số nguyên.
## SACH
Gọi $a,b,c$ là độ dài 3 cạnh tam giác vuông $ABC$, $c$ là cạnh huyền. Ta có $a^2+b^2=c^2$; $a,b,c\in\mathbb{N}^*$, diện tích tam giác $ABC$ là $S=\dfrac{ab}{2}$.

Trước hết ta chứng minh $ab$ chia hết cho $12$.

+ Chứng minh $ab\vdots3$: Nếu cả $a$ và $b$ đồng thời không chia hết cho $3$ thì $a^2+b^2$ chia $3$ dư $2$. Suy ra số chính phương $c^2$ chia $3$ dư $2$, vô lý.

+ Chứng minh $ab\vdots4$: Nếu $a,b$ chẵn thì $ab\vdots4$. Nếu trong hai số $a,b$ có số lẻ, chẳng hạn $a$ lẻ. Lúc đó $c$ lẻ. Vì nếu $c$ chẵn thì $c^2\vdots4$, trong lúc $a^2+b^2$ không thể chia hết cho $4$. Đặt $a=2k+1$, $c=2h+1$, $k,h\in\mathbb{N}$. Ta có: $b^2=(2h+1)^2-(2k+1)^2=4(h-k)(h+k+1)=4(h-k)(h-k+1)+8k(h-k)\vdots8$. Suy ra $b\vdots4$.

Nếu ta chia cạnh $AB$ (chẳng hạn) thành $6$ phần bằng nhau, nối các điểm chia với $C$ thì tam giác $ABC$ được chia thành $6$ tam giác, mỗi tam giác này có diện tích bằng $\dfrac{ab}{12}$ là một số nguyên.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia một cạnh thành $6$ phần bằng nhau rồi nối với đỉnh đối diện thì được $6$ tam giác cùng chiều cao, cùng đáy nên diện tích bằng nhau và bằng $\dfrac{S}{6}$; do đó cần chứng minh diện tích $\dfrac{ab}{2}$ chia hết cho $6$, tức $ab$ chia hết cho $12$.

**Bước 1.** Nêu cách cắt: lấy một cạnh, chia thành sáu đoạn bằng nhau rồi nối các điểm chia với đỉnh đối diện, từ đó đưa bài toán về việc chứng minh $12$ là ước của tích hai cạnh góc vuông.

**Bước 2.** Chứng minh $ab$ chia hết cho $3$ bằng cách xét số dư của bình phương khi chia cho $3$ và dùng định lí Pi-ta-go $a^2+b^2=c^2$.

**Bước 3.** Chứng minh $ab$ chia hết cho $4$: xét trường hợp cả hai cạnh góc vuông chẵn, rồi trường hợp có một cạnh lẻ, khi đó dùng tính chất bình phương số lẻ chia $8$ dư $1$ để suy ra cạnh còn lại chia hết cho $4$.

**Bước 4.** Vì $3$ và $4$ nguyên tố cùng nhau nên $ab$ chia hết cho $12$, rồi tính diện tích mỗi phần để kết luận là số nguyên.

**Chú ý:** Phải xét đủ hai trường hợp "cả hai cạnh góc vuông chẵn" và "có một cạnh lẻ"; trường hợp hai cạnh góc vuông cùng lẻ bị loại vì khi đó $c^2$ chia $4$ dư $2$.

**Phần 2. Trình bày**

Gọi $a,b$ là hai cạnh góc vuông, $c$ là cạnh huyền ($a,b,c\in\mathbb{N}^*$), khi đó $a^2+b^2=c^2$ và diện tích tam giác là $S=\dfrac{ab}{2}$.

Trước hết ta chứng minh $ab\vdots12$.

Chứng minh $ab\vdots3$: số chính phương chia $3$ dư $0$ hoặc $1$. Nếu $a\not\vdots3$ và $b\not\vdots3$ thì $a^2+b^2$ chia $3$ dư $2$, nên $c^2$ chia $3$ dư $2$, vô lí. Vậy $a\vdots3$ hoặc $b\vdots3$, suy ra $ab\vdots3$.

Chứng minh $ab\vdots4$: nếu $a$ và $b$ cùng chẵn thì $ab\vdots4$.

Nếu một trong hai số lẻ, chẳng hạn $a$ lẻ. Nếu $c$ chẵn thì $c^2\vdots4$ còn $a^2+b^2$ chia $4$ dư $1$ hoặc $2$, vô lí; vậy $c$ lẻ.

Khi đó $b^2=c^2-a^2$ là hiệu hai số lẻ nên $b$ chẵn. Mặt khác $a=2k+1$, $c=2h+1$ nên $b^2=(2h+1)^2-(2k+1)^2=4(h-k)(h+k+1)$, mà $h-k$ và $h+k+1$ khác tính chẵn lẻ nên tích $(h-k)(h+k+1)$ chẵn, suy ra $b^2\vdots8$.

Đặt $b=2t$ thì $4t^2\vdots8$, nên $t^2$ chẵn, $t$ chẵn, tức $b\vdots4$. Suy ra $ab\vdots4$.

Vì $\gcd(3,4)=1$ nên $ab\vdots12$, do đó $\dfrac{ab}{12}$ là số nguyên.

Chia cạnh $AB$ thành $6$ đoạn bằng nhau rồi nối các điểm chia với $C$, ta được $6$ tam giác có cùng đường cao hạ từ $C$ và các đáy bằng nhau, nên diện tích bằng nhau, mỗi tam giác có diện tích $\dfrac{S}{6}=\dfrac{ab}{12}$ là số nguyên.

Vậy có thể cắt tấm bìa thành sáu phần có diện tích bằng nhau và mỗi phần có diện tích là số nguyên.

=== T7B.31a@p157
- bai: 31 · y: a · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tích các số nguyên liên tiếp · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi số nguyên $n$, ta có $n^3+3n^2+2n$ chia hết cho $6$.
## SACH
Biến đổi: $n^3+3n^2+2n=n(n+1)(n+2)$ đó là tích $3$ số nguyên liên tiếp.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba không có hạng tử tự do và có ba nghiệm nguyên liên tiếp $0,-1,-2$, nên phân tích được thành tích ba số nguyên liên tiếp, loại tích luôn chia hết cho $2$ và $3$.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi phân tích tam thức bậc hai còn lại bằng cách tách hạng tử.

**Bước 2.** Nhận ra tích thu được là tích của ba số nguyên liên tiếp nên có một số chẵn và một số chia hết cho $3$.

**Bước 3.** Vì $2$ và $3$ nguyên tố cùng nhau nên tích chia hết cho $2\cdot3=6$.

**Phần 2. Trình bày**

$n^3+3n^2+2n=n(n^2+3n+2)=n(n+1)(n+2)$.

Đây là tích của ba số nguyên liên tiếp nên có ít nhất một thừa số chẵn, suy ra tích chia hết cho $2$; và có một thừa số chia hết cho $3$, suy ra tích chia hết cho $3$.

Vì $\gcd(2,3)=1$ nên $n(n+1)(n+2)\vdots6$.

Vậy $n^3+3n^2+2n$ chia hết cho $6$ với mọi số nguyên $n$.

=== T7B.31b@p157
- bai: 31 · y: b · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: hiệu hai bình phương · tích các số nguyên liên tiếp · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi số nguyên $n$, ta có $(n^2+n-1)^2-1$ chia hết cho $24$.
## SACH
Biến đổi: $(n-1)n(n+1)(n+2)$ đó là tích $4$ số nguyên liên tiếp.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức có dạng $A^2-1$ nên dùng hằng đẳng thức hiệu hai bình phương để tách thành hai nhân tử, rồi mỗi nhân tử lại phân tích tiếp ra tích bốn số nguyên liên tiếp.

**Bước 1.** Áp dụng hằng đẳng thức hiệu hai bình phương với $A=n^2+n-1$ để được tích $(n^2+n-2)(n^2+n)$.

**Bước 2.** Phân tích $n^2+n-2$ và $n^2+n$ thành nhân tử để nhận ra bốn số nguyên liên tiếp.

**Bước 3.** Chia $24=8\cdot3$ rồi chứng minh tích bốn số liên tiếp chia hết cho $3$ và cho $8$ (trong bốn số có hai số chẵn, một số trong đó chia hết cho $4$).

**Phần 2. Trình bày**

$(n^2+n-1)^2-1=(n^2+n-2)(n^2+n)$

$=(n-1)(n+2)\cdot n(n+1)=(n-1)n(n+1)(n+2)$.

Đây là tích của bốn số nguyên liên tiếp. Trong bốn số đó có một số chia hết cho $3$ nên tích chia hết cho $3$.

Cũng trong bốn số liên tiếp có hai số chẵn liên tiếp, trong đó có một số chia hết cho $4$ và số kia chia hết cho $2$, nên tích chia hết cho $8$.

Vì $\gcd(3,8)=1$ nên tích chia hết cho $3\cdot8=24$.

Vậy $(n^2+n-1)^2-1$ chia hết cho $24$ với mọi số nguyên $n$.

=== T7B.32a@p157
- bai: 32 · y: a · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: đặt n=2k · tích các số nguyên liên tiếp · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng $n^3+6n^2+8n$ chia hết cho $48$ với mọi số chẵn $n$.
## SACH
Biến đổi: $n(n+2)(n+4)$ rồi thay $n=2k$, được $8k(k+1)(k+2)$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức phân tích được thành $n(n+2)(n+4)$ gồm ba số chẵn liên tiếp khi $n$ chẵn, nên đặt $n=2k$ để rút ra thừa số $8$ và còn lại tích ba số nguyên liên tiếp chia hết cho $6$.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi phân tích tam thức $n^2+6n+8$ thành tích hai nhị thức.

**Bước 2.** Vì $n$ chẵn nên thay $n=2k$ với $k$ nguyên để mỗi thừa số đều rút được thừa số $2$.

**Bước 3.** Nhận ra $k(k+1)(k+2)$ là tích ba số nguyên liên tiếp nên chia hết cho $6$, rồi kết luận chia hết cho $8\cdot6=48$.

**Phần 2. Trình bày**

$n^3+6n^2+8n=n(n^2+6n+8)=n(n+2)(n+4)$.

Vì $n$ chẵn, đặt $n=2k$ ($k\in\mathbb{Z}$), ta có $n(n+2)(n+4)=2k\cdot(2k+2)\cdot(2k+4)=8k(k+1)(k+2)$.

$k(k+1)(k+2)$ là tích ba số nguyên liên tiếp nên chia hết cho $2$ và cho $3$, mà $\gcd(2,3)=1$ nên chia hết cho $6$.

Suy ra $8k(k+1)(k+2)\vdots8\cdot6=48$.

Vậy $n^3+6n^2+8n$ chia hết cho $48$ với mọi số chẵn $n$.

=== T7B.32b@p157
- bai: 32 · y: b · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử · đặt n=2k+1 · tích các số nguyên liên tiếp · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ gợi ý "phân tích rồi thay n=2k+1". Máy kiểm n lẻ trong [-501;501] đều chia hết 384.
## DE
Chứng minh rằng $n^4-10n^2+9$ chia hết cho $384$ với mọi số lẻ $n$.
## SACH
Phân tích $n^4-10n^2+9$ thành nhân tử rồi thay $n=2k+1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức trùng phương $n^4-10n^2+9$ có hai nghiệm $n^2=1$ và $n^2=9$ nên phân tích được thành bốn nhân tử bậc nhất; khi $n$ lẻ thì cả bốn nhân tử đều chẵn, và $384=2^7\cdot3=16\cdot24$.

**Bước 1.** Phân tích $n^4-10n^2+9$ thành $(n^2-1)(n^2-9)$ rồi tiếp tục thành tích bốn nhân tử bậc nhất.

**Bước 2.** Thay $n=2k+1$ để mỗi nhân tử đều rút ra thừa số $2$, được hệ số $16$ đứng ngoài.

**Bước 3.** Nhận ra phần còn lại là tích bốn số nguyên liên tiếp nên chia hết cho $24$, từ đó suy ra chia hết cho $16\cdot24=384$.

**Phần 2. Trình bày**

$n^4-10n^2+9=(n^2-1)(n^2-9)=(n-1)(n+1)(n-3)(n+3)$.

Vì $n$ lẻ, đặt $n=2k+1$ ($k\in\mathbb{Z}$): $(n-3)(n-1)(n+1)(n+3)=(2k-2)\cdot2k\cdot(2k+2)\cdot(2k+4)=16(k-1)k(k+1)(k+2)$.

$(k-1)k(k+1)(k+2)$ là tích bốn số nguyên liên tiếp nên chia hết cho $24$ (chia hết cho $3$ và cho $8$ như đã biết).

Suy ra biểu thức chia hết cho $16\cdot24=384$.

Vậy $n^4-10n^2+9$ chia hết cho $384$ với mọi số lẻ $n$.

=== T7B.33a@p157
- bai: 33 · y: a · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số chính phương lẻ chia 8 dư 1 · xét số dư · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Cho $a$ là số nguyên tố lớn hơn $3$. Chứng minh $a^2-1$ chia hết cho $24$.
## SACH
Ta có $a^2$ là số chính phương lẻ nên chia cho $8$ dư $1$, $a^2$ là số chính phương không chia hết cho $3$ nên chia cho $3$ dư $1$. Suy ra $a^2-1$ chia hết cho $8$, chia hết cho $3$, do đó chia hết cho $24$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $24=8\cdot3$ với $8$ và $3$ nguyên tố cùng nhau, nên chỉ cần chứng minh $a^2-1$ chia hết cho $8$ và cho $3$; điều kiện "nguyên tố lớn hơn $3$" cho biết $a$ lẻ và không chia hết cho $3$.

**Bước 1.** Từ $a$ nguyên tố lớn hơn $3$ suy ra $a$ là số lẻ và $a$ không chia hết cho $3$.

**Bước 2.** Viết $a=2m+1$ và phân tích $a^2-1$ thành tích để chỉ ra chia hết cho $8$ (một trong hai số $m$, $m+1$ là số chẵn).

**Bước 3.** Xét $a=3k\pm1$ để chỉ ra $a^2-1$ chia hết cho $3$, rồi kết luận chia hết cho $24$.

**Phần 2. Trình bày**

Vì $a$ là số nguyên tố lớn hơn $3$ nên $a$ lẻ và $a\not\vdots3$.

Chia hết cho $8$: đặt $a=2m+1$ ($m\in\mathbb{N}$) thì $a^2-1=4m(m+1)$. Vì $m(m+1)$ là tích hai số nguyên liên tiếp nên chẵn, suy ra $a^2-1\vdots8$.

Chia hết cho $3$: vì $a\not\vdots3$ nên $a=3k\pm1$, khi đó $a^2-1=(a-1)(a+1)$ chứa một thừa số là bội của $3$, suy ra $a^2-1\vdots3$.

Vì $\gcd(8,3)=1$ nên $a^2-1\vdots24$.

=== T7B.33b@p157
- bai: 33 · y: b · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: số chính phương lẻ chia 8 dư 1 · xét số dư · hiệu hai bình phương
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ ghi "Áp dụng kết quả câu a)"; đề b đứng được một mình nên chứng minh lại bổ đề a^2-1 chia hết cho 24 ngay trong lời giải.
## DE
Chứng minh rằng nếu $a$ và $b$ là các số nguyên tố lớn hơn $3$ thì $a^2-b^2$ chia hết cho $24$.
## SACH
Áp dụng kết quả của câu a).
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bình phương của mọi số nguyên tố lớn hơn $3$ đều chia $24$ dư $1$, nên hiệu hai bình phương như vậy chia hết cho $24$.

**Bước 1.** Chứng minh với số nguyên tố $p>3$ thì $p^2-1$ chia hết cho $8$ nhờ $p$ lẻ và cho $3$ nhờ $p$ không chia hết cho $3$.

**Bước 2.** Suy ra $p^2$ chia $24$ dư $1$ cho cả hai số $a$ và $b$.

**Bước 3.** Viết $a^2-b^2$ thành hiệu $(a^2-1)-(b^2-1)$ rồi kết luận chia hết cho $24$.

**Phần 2. Trình bày**

Với $p$ là số nguyên tố lớn hơn $3$: $p$ lẻ nên $p=2m+1$ và $p^2-1=4m(m+1)\vdots8$; $p\not\vdots3$ nên $p=3k\pm1$ và $p^2-1=(p-1)(p+1)\vdots3$. Vì $\gcd(8,3)=1$ nên $p^2-1\vdots24$.

Áp dụng cho $a$ và $b$: $a^2-1\vdots24$ và $b^2-1\vdots24$.

$a^2-b^2=(a^2-1)-(b^2-1)$ là hiệu của hai số chia hết cho $24$ nên chia hết cho $24$.

Vậy $a^2-b^2\vdots24$.

=== T7B.33c@p157
- bai: 33 · y: c · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phân tích nhân tử · xét số dư · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach: a lẻ, không chia hết cho 3, không chia hết cho 5
- dap_an: $a$ lẻ, $a\not\vdots3$, $a\not\vdots5$
- ghi_chu_nghi: Máy duyệt a từ 0 đến 2999 cho tập a thỏa 240 | a^4-1 trùng đúng tập a lẻ, không chia hết cho 3 và 5.
## DE
Tìm điều kiện của số tự nhiên $a$ để $a^4-1$ chia hết cho $240$.
## SACH
$240=2^4\cdot3\cdot5$; $A=a^4-1=(a^2-1)(a^2+1)=(a-1)(a+1)(a^2+1)$.

Nếu $a$ lẻ thì $(a-1)(a+1)$ là tích của hai số chẵn liên tiếp nên chia hết cho $8$, còn $a^2+1$ chia hết cho $2$, do đó $A$ chia hết cho $16$. Còn nếu $a$ chẵn thì $A$ không chia hết cho $2$.

Nếu $a=3k\pm1$ ($k\in\mathbb{N}$) thì $a^2-1$ chia hết cho $3$, do đó $A$ chia hết cho $3$. Còn nếu $a=3k$ ($k\in\mathbb{N}$) thì $A$ chia cho $3$ dư $2$.

Nếu $a=5k\pm1$ ($k\in\mathbb{N}$) thì $a^2-1$ chia hết cho $5$, nếu $a=5k\pm2$ ($k\in\mathbb{N}$) thì $a^2+1$ chia hết cho $5$, do đó $A$ chia hết cho $5$. Còn nếu $a=5k$ ($k\in\mathbb{N}$) thì $A$ chia cho $5$ dư $4$. Vậy điều kiện để $a^4-1$ chia hết cho $240$ là $a$ lẻ, không chia hết cho $3$, không chia hết cho $5$.

Chú ý: Từ kết quả trên, ta có bài toán: Nếu $a$ là số nguyên tố lớn hơn $5$ thì $a^4-1$ chia hết cho $240$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phân tích $a^4-1=(a-1)(a+1)(a^2+1)$ và tách $240=16\cdot3\cdot5$ thành ba thừa số nguyên tố cùng nhau từng đôi; với mỗi thừa số, xét xem $a$ phải thỏa điều kiện gì (cả điều kiện cần lẫn điều kiện đủ).

**Bước 1.** Phân tích $a^4-1$ thành tích ba nhân tử và phân tích $240$ thành tích các lũy thừa của số nguyên tố.

**Bước 2.** Tìm điều kiện để $a^4-1$ chia hết cho $16$: xét $a$ chẵn rồi $a$ lẻ.

**Bước 3.** Tìm điều kiện để chia hết cho $3$ bằng cách xét số dư của $a$ khi chia cho $3$, sau đó làm tương tự với $5$.

**Bước 4.** Gộp các điều kiện (cả chiều thuận lẫn chiều đảo) vì $16$, $3$, $5$ đôi một nguyên tố cùng nhau.

**Chú ý:** Phải chứng minh cả hai chiều: điều kiện đủ để chia hết, và với các số còn lại thì $a^4-1$ không chia hết (chỉ ra số dư), nếu không mới chỉ là điều kiện đủ.

**Phần 2. Trình bày**

$240=16\cdot3\cdot5$ và $a^4-1=(a-1)(a+1)(a^2+1)$.

Xét chia hết cho $16$: nếu $a$ chẵn thì $a^4-1$ lẻ, không chia hết cho $2$. Nếu $a$ lẻ thì $(a-1)(a+1)$ là tích hai số chẵn liên tiếp nên chia hết cho $8$, còn $a^2+1$ chẵn, suy ra $a^4-1\vdots16$. Vậy $a^4-1\vdots16\Leftrightarrow a$ lẻ.

Xét chia hết cho $3$: nếu $a=3k\pm1$ thì $a^2-1\vdots3$ nên $a^4-1\vdots3$; nếu $a=3k$ thì $a^4-1=81k^4-1$ chia $3$ dư $2$. Vậy $a^4-1\vdots3\Leftrightarrow a\not\vdots3$.

Xét chia hết cho $5$: nếu $a=5k\pm1$ thì $a^2-1\vdots5$; nếu $a=5k\pm2$ thì $a^2+1=25k^2\pm20k+5\vdots5$; nếu $a=5k$ thì $a^4-1$ chia $5$ dư $4$. Vậy $a^4-1\vdots5\Leftrightarrow a\not\vdots5$.

Vì $16$, $3$, $5$ đôi một nguyên tố cùng nhau nên $a^4-1\vdots240$ khi và chỉ khi $a$ lẻ, $a\not\vdots3$ và $a\not\vdots5$.

Vậy điều kiện là $a$ lẻ, không chia hết cho $3$ và không chia hết cho $5$.

=== T7B.34@p157
- bai: 34 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số chính phương chia 3 dư 0 hoặc 1 · số chính phương lẻ chia 8 dư 1 · xét số dư · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy duyệt n < 200000 cho các n thỏa n+1 và 2n+1 cùng chính phương: 0; 24; 840; 28560, đều chia hết cho 24.
## DE
Chứng minh rằng nếu $n+1$ và $2n+1$ ($n\in\mathbb{N}$) đều là số chính phương thì $n$ chia hết cho $24$.
## SACH
Chứng minh $n$ chia hết cho $3$: Nếu $n=3k+1$ thì $n+1=3k+2$, không là số chính phương, loại. Nếu $n=3k+2$ thì $2n+1=3(2k+1)+2$, không là số chính phương, loại. Vậy $n$ chia hết cho $3$.

Chứng minh $n$ chia hết cho $8$: Ta có $2n+1$ là số chính phương lẻ nên chia cho $8$ dư $1$ (1), do đó $2n$ chia hết cho $8$, $n$ chia hết cho $4$, $n+1$ là số chính phương lẻ nên chia cho $8$ dư $1$, do đó $n$ chia hết cho $8$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $24=8\cdot3$ với hai thừa số nguyên tố cùng nhau, và đề cho hai số chính phương nên dùng hai tính chất: bình phương chia $3$ dư $0$ hoặc $1$, bình phương lẻ chia $8$ dư $1$.

**Bước 1.** Chứng minh $n$ chia hết cho $3$ bằng cách xét ba số dư của $n$ khi chia cho $3$ và loại các số dư làm cho $n+1$ hoặc $2n+1$ không thể là số chính phương.

**Bước 2.** Vì $2n+1$ là số chính phương lẻ nên chia $8$ dư $1$, từ đó suy ra $n$ chia hết cho $4$.

**Bước 3.** Khi $n$ chẵn thì $n+1$ là số chính phương lẻ, lại dùng tính chất chia $8$ dư $1$ để suy ra $n$ chia hết cho $8$, rồi kết luận chia hết cho $24$.

**Phần 2. Trình bày**

Số chính phương chia $3$ dư $0$ hoặc $1$.

Nếu $n=3k+1$ thì $n+1=3k+2$ chia $3$ dư $2$, không là số chính phương, loại. Nếu $n=3k+2$ thì $2n+1=6k+5=3(2k+1)+2$ chia $3$ dư $2$, không là số chính phương, loại. Vậy $n=3k$, tức $n\vdots3$.

$2n+1$ là số chính phương lẻ nên chia $8$ dư $1$, suy ra $2n\vdots8$, tức $n\vdots4$.

Khi đó $n$ chẵn nên $n+1$ là số chính phương lẻ, chia $8$ dư $1$, suy ra $n\vdots8$.

Vì $\gcd(3,8)=1$ nên $n\vdots24$.

=== T7B.35@p157
- bai: 35 · y: - · trang: 157 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: số chính phương chia 5 dư 0, 1 hoặc 4 · số chính phương lẻ chia 8 dư 1 · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh mờ ở dòng đầu lời giải sách (nét in giống "2m-1"), dựng lại thành 2n+1 theo đề. Máy duyệt n < 500000: 0; 40; 3960; 388080, đều chia hết cho 40.
## DE
Chứng minh rằng nếu $2n+1$ và $3n+1$ ($n\in\mathbb{N}$) đều là số chính phương thì $n$ chia hết cho $40$.
## SACH
$2n+1$ là số chính phương lẻ nên chia cho $8$ dư $1\Rightarrow n$ chẵn $\Rightarrow3n+1$ là số chính phương lẻ, số này chia cho $8$ dư $1$ nên $3n$ chia hết cho $8$, do đó $n$ chia hết cho $8$ (1).

Cách 1: $3n+1$ tận cùng $1,5,9\Rightarrow3n$ tận cùng $0,4,8\Rightarrow n$ tận cùng $0,8,6$. Loại trường hợp $n$ tận cùng bằng $8$ (vì $2n+1$ tận cùng bằng $7$, không là số chính phương), loại trường hợp $n$ tận cùng bằng $6$ (vì khi đó $2n+1$ tận cùng bằng $3$, không là số chính phương). Vậy $n$ tận cùng bằng $0$. (2) Từ (1) và (2) suy ra $n$ chia hết cho $40$.

Cách 2: $2n+1$, $3n+1$ là các số chính phương lẻ nên tận cùng bằng $1,5,9$ do đó chia cho $5$ dư $1,0,4$. Tổng của chúng là $5n+2$ nên mỗi số $2n+1$, $3n+1$ đều chia cho $5$ dư $1$, do đó $2n$ và $3n$ đều chia hết cho $5$, vậy $n$ chia hết cho $5$. (3) Từ (1) và (3) suy ra $n$ chia hết cho $40$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $40=8\cdot5$ với hai thừa số nguyên tố cùng nhau; chia hết cho $8$ nhờ tính chất bình phương lẻ chia $8$ dư $1$, chia hết cho $5$ nhờ xét số dư của bình phương khi chia cho $5$.

**Bước 1.** Chứng minh $n$ chẵn từ việc $2n+1$ là số chính phương lẻ chia $8$ dư $1$, rồi suy ra $3n+1$ cũng là số chính phương lẻ.

**Bước 2.** Dùng tính chất chia $8$ dư $1$ cho $3n+1$ để chứng minh $n$ chia hết cho $8$.

**Bước 3.** Liệt kê các số dư có thể có của một số chính phương khi chia cho $5$, rồi xét tổng $(2n+1)+(3n+1)=5n+2$ để suy ra số dư của từng số.

**Bước 4.** Từ số dư của $2n+1$ suy ra $n$ chia hết cho $5$, rồi gộp hai điều kiện vì $\gcd(8,5)=1$.

**Chú ý:** Có thể thay bước chia hết cho $5$ bằng xét chữ số tận cùng: $n$ chỉ có thể tận cùng $0$, $6$, $8$, rồi loại $6$ và $8$ vì khi đó $2n+1$ tận cùng $3$ hoặc $7$, không là số chính phương.

**Phần 2. Trình bày**

Đặt $2n+1=u^2$ và $3n+1=v^2$ với $u,v\in\mathbb{N}$.

$2n+1$ lẻ nên $u$ lẻ, $u^2\equiv1\pmod{8}$, suy ra $2n\vdots8$, nên $n\vdots4$, do đó $n$ chẵn. Khi đó $3n+1$ lẻ, $v^2\equiv1\pmod{8}$, suy ra $3n\vdots8$, và vì $\gcd(3,8)=1$ nên $n\vdots8$. (1)

Số chính phương chia $5$ dư $0$, $1$ hoặc $4$.

Ta có $u^2+v^2=5n+2\equiv2\pmod{5}$. Các cặp số dư thuộc $\{0;1;4\}$ có tổng chia $5$ dư $2$ chỉ có $(1;1)$ (vì $0+0=0$, $0+1=1$, $0+4=4$, $1+4=5\equiv0$, $4+4=8\equiv3$).

Vậy $u^2\equiv1\pmod{5}$ tức $2n\equiv0\pmod{5}$, suy ra $n\vdots5$. (2)

Từ (1) và (2), vì $\gcd(8,5)=1$ nên $n\vdots40$.

=== T7B.36a@p158
- bai: 36 · y: a · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phân tích nhân tử · số nguyên tố chỉ có ước 1 và chính nó
- kiem: khong
- ket_qua_sach: 2
- dap_an: $n=2$ (giá trị biểu thức bằng $13$)
- ghi_chu_nghi: Máy duyệt n từ 0 đến 1999: chỉ n=2 làm 12n^2-5n-25 là số nguyên tố, khớp sách.
## DE
Tìm số tự nhiên $n$ để giá trị của biểu thức $12n^2-5n-25$ là số nguyên tố.
## SACH
Phân tích thành nhân tử: $12n^2-5n-25=12n^2+15n-20n-25=3n(4n+5)-5(4n+5)=(4n+5)(3n-5)$.

Do $12n^2-5n-25$ là số nguyên tố và $4n+5>0$ nên $3n-5>0$. Ta lại có $3n-5<4n+5$ (vì $n\ge0$) nên để $12n^2-5n-25$ là số nguyên tố thì thừa số nhỏ phải bằng $1$. Giải điều kiện $3n-5=1$, được $n=2$.

Khi đó, $12n^2-5n-25=13\cdot1=13$ là số nguyên tố.

Vậy với $n=2$ thì giá trị biểu thức $12n^2-5n-25$ là số nguyên tố $13$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số nguyên tố chỉ phân tích được thành tích $1\cdot p$; vì vậy phân tích tam thức thành hai nhân tử rồi bắt một nhân tử bằng $1$ (nhân tử nhỏ hơn).

**Bước 1.** Tách hạng tử giữa để phân tích $12n^2-5n-25$ thành tích hai nhị thức bậc nhất.

**Bước 2.** Vì tích là số nguyên tố dương và một nhân tử dương nên nhân tử còn lại cũng dương, rồi so sánh hai nhân tử để biết nhân tử nào nhỏ hơn.

**Bước 3.** Cho nhân tử nhỏ hơn bằng $1$, giải tìm $n$, rồi thử lại xem giá trị có đúng là số nguyên tố không.

**Chú ý:** Bước thử lại là bắt buộc: mới biết điều kiện cần, còn phải kiểm tra giá trị tìm được thực sự là số nguyên tố.

**Phần 2. Trình bày**

$12n^2-5n-25=12n^2+15n-20n-25=3n(4n+5)-5(4n+5)=(4n+5)(3n-5)$.

Với $n\in\mathbb{N}$ thì $4n+5>0$. Để tích là số nguyên tố (dương) thì $3n-5>0$ và $3n-5<4n+5$ (vì $n\ge0$).

Số nguyên tố chỉ có ước dương là $1$ và chính nó nên nhân tử nhỏ hơn phải bằng $1$: $3n-5=1$, suy ra $n=2$.

Thử lại: $n=2$ thì $12\cdot4-10-25=13=13\cdot1$ là số nguyên tố (nhận).

Vậy $n=2$.

=== T7B.36b@p158
- bai: 36 · y: b · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử · số nguyên tố chỉ có ước 1 và chính nó
- kiem: khong
- ket_qua_sach: 0
- dap_an: $n=0$ (giá trị biểu thức bằng $3$)
- ghi_chu_nghi: Máy duyệt n từ 0 đến 1999: chỉ n=0 làm 8n^2+10n+3 là số nguyên tố, khớp sách.
## DE
Tìm số tự nhiên $n$ để giá trị của biểu thức $8n^2+10n+3$ là số nguyên tố.
## SACH
Biến đổi: $8n^2+10n+3=(2n+1)(4n+3)$

Đáp số: $n=0$, khi đó $8n^2+10n+3=3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức bậc hai này phân tích được thành tích hai nhị thức có hệ số nguyên; khi đó biểu thức là số nguyên tố chỉ nếu một trong hai nhân tử bằng $1$.

**Bước 1.** Phân tích $8n^2+10n+3$ bằng cách tách hạng tử $10n$ thành tổng hai hạng tử sao cho nhóm được nhân tử chung.

**Bước 2.** Xét hai nhân tử với $n\in\mathbb{N}$: so sánh để biết nhân tử nào có thể bằng $1$.

**Bước 3.** Giải từng khả năng, rồi kiểm tra giá trị biểu thức tại $n$ tìm được.

**Phần 2. Trình bày**

$8n^2+10n+3=8n^2+4n+6n+3=4n(2n+1)+3(2n+1)=(2n+1)(4n+3)$.

Với $n\in\mathbb{N}$ ta có $4n+3\ge3>1$, do đó để tích là số nguyên tố thì $2n+1=1$, tức $n=0$.

Thử lại: $n=0$ thì giá trị biểu thức bằng $3$ là số nguyên tố (nhận).

Nếu $n\ge1$ thì $2n+1\ge3$ và $4n+3\ge7$, tích hai số lớn hơn $1$ là hợp số (loại).

Vậy $n=0$.

=== T7B.36c@p158
- bai: 36 · y: c · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét tính chẵn lẻ để tách chia hết cho 4 · phân tích thành tích hai thừa số lớn hơn 1 là hợp số
- kiem: khong
- ket_qua_sach: 4
- dap_an: $n=4$ (giá trị bằng $7$)
- ghi_chu_nghi: Máy duyệt n từ 0 đến 4999: chỉ n=4 làm (n^2+3n)/4 là số nguyên tố, khớp sách.
## DE
Tìm số tự nhiên $n$ để giá trị của biểu thức $\dfrac{n^2+3n}{4}$ là số nguyên tố.
## SACH
$A=\dfrac{n^2+3n}{4}$. Do $A$ là số tự nhiên nên $n(n+3)\vdots4$. Hai số $n$ và $n+3$ không thể cùng chẵn. Vậy hoặc $n$, hoặc $n+3$ chia hết cho $4$.

Nếu $n=0$ thì $A=0$, không là số nguyên tố.

Nếu $n=4$ thì $A=7$, là số nguyên tố.

Nếu $n=4k$ ($k\in\mathbb{Z},k>1$) thì $A=k(4k+3)$ là tích của hai thừa số lớn hơn $1$ nên $A$ là hợp số.

Nếu $n+3=4$ thì $A=1$, không là số nguyên tố.

Nếu $n+3=4k$ ($k\in\mathbb{Z},k>1$) thì $A=k(4k-3)$ là tích của hai thừa số lớn hơn $1$, nên $A$ là hợp số.

Vậy $n=4$ khi đó $A=7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn $\dfrac{n(n+3)}{4}$ là số nguyên tố thì trước hết nó phải là số tự nhiên; hai thừa số $n$ và $n+3$ khác tính chẵn lẻ nên số chẵn trong hai số đó phải chia hết cho $4$, và ta biểu diễn $A$ thành tích để xét khi nào là hợp số.

**Bước 1.** Chỉ ra $n(n+3)$ phải chia hết cho $4$, mà $n$ và $n+3$ khác tính chẵn lẻ nên một trong hai số chia hết cho $4$.

**Bước 2.** Xét trường hợp $n=4k$: viết $A$ thành tích hai thừa số theo $k$ rồi xét các giá trị nhỏ của $k$.

**Bước 3.** Xét trường hợp $n+3=4k$ tương tự, nhớ điều kiện $n\ge0$ để biết $k$ nhỏ nhất.

**Bước 4.** Với mọi $k$ đủ lớn thì $A$ là tích hai số lớn hơn $1$ nên là hợp số; chỉ còn lại các giá trị nhỏ của $k$ cần thử trực tiếp.

**Phần 2. Trình bày**

$A=\dfrac{n(n+3)}{4}$ là số nguyên tố nên là số tự nhiên, suy ra $n(n+3)\vdots4$. Vì $n$ và $n+3$ khác tính chẵn lẻ nên số lẻ trong hai số nguyên tố cùng nhau với $4$, do đó số chẵn chia hết cho $4$: $n=4k$ hoặc $n+3=4k$.

Trường hợp $n=4k$ ($k\in\mathbb{N}$): $A=k(4k+3)$.

$k=0$: $A=0$ (loại). $k=1$: $A=7$ là số nguyên tố (nhận). $k\ge2$: $k>1$ và $4k+3>1$ nên $A$ là hợp số (loại).

Trường hợp $n+3=4k$ ($k\in\mathbb{N}$, $k\ge1$ vì $n\ge0$): $n=4k-3$ và $A=\dfrac{(4k-3)\cdot4k}{4}=k(4k-3)$.

$k=1$: $A=1$ (loại). $k\ge2$: $k>1$ và $4k-3\ge5>1$ nên $A$ là hợp số (loại).

Vậy $n=4$.

=== T7B.37a@p158
- bai: 37 · y: a · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử · xét số dư · tính chất chia hết của tích với số nguyên tố
- kiem: khong
- ket_qua_sach: n=11k+3 hoặc n=11k-5
- dap_an: $n=11k+3$ hoặc $n=11k+6$ ($k\in\mathbb{Z}$)
- ghi_chu_nghi: Sách viết "BS 11-5"; máy xác nhận tập nghiệm n thuộc [-30;30) là n ≡ 3 hoặc 6 (mod 11) (-5 ≡ 6 mod 11).
## DE
Tìm số nguyên $n$ sao cho $n^2+2n-4$ chia hết cho $11$.
## SACH
$n^2+2n-4=(n-3)(n+5)+11$ chia hết cho $11$. Vậy $n=\mathrm{BS}\ 11+3$ hoặc $n=\mathrm{BS}\ 11-5$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần $n^2+2n-4\vdots11$ với $11$ nguyên tố, nên tách thành "một tích hai nhị thức cộng một bội của $11$" để $11$ phải là ước của tích đó, rồi dùng tính chất số nguyên tố.

**Bước 1.** Viết $n^2+2n-4$ dưới dạng $(n+a)(n+b)+11$ bằng cách chọn $a,b$ có $a+b=2$ và $ab=-15$.

**Bước 2.** Suy ra tích $(n-3)(n+5)$ phải chia hết cho $11$.

**Bước 3.** Vì $11$ là số nguyên tố nên một trong hai thừa số chia hết cho $11$; tách hai trường hợp rồi viết $n$ theo số nguyên $k$.

**Phần 2. Trình bày**

$n^2+2n-4=(n^2+2n-15)+11=(n-3)(n+5)+11$.

Vì $11\vdots11$ nên $n^2+2n-4\vdots11\Leftrightarrow(n-3)(n+5)\vdots11$.

$11$ là số nguyên tố nên $n-3\vdots11$ hoặc $n+5\vdots11$.

Nếu $n-3\vdots11$ thì $n=11k+3$ ($k\in\mathbb{Z}$). Nếu $n+5\vdots11$ thì $n=11k-5$ hay $n=11k'+6$ ($k'=k-1$).

Vậy $n=11k+3$ hoặc $n=11k+6$ với $k\in\mathbb{Z}$.

=== T7B.37b@p158
- bai: 37 · y: b · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: dap_so
- nhom: T18T000000
- cong_cu: chia đa thức · số nguyên là ước của một số (kể cả ước âm)
- kiem: khong
- ket_qua_sach: 1; 0; 3; -2
- dap_an: $n\in\{1;0;3;-2\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000]: n ∈ {-2;0;1;3}, khớp sách.
## DE
Tìm số nguyên $n$ sao cho $2n^3+n^2+7n+1$ chia hết cho $2n-1$.
## SACH
Đáp số: $1,0,3,-2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia đa thức $2n^3+n^2+7n+1$ cho $2n-1$ để tách ra một phần luôn chia hết và một số dư là hằng số; khi đó $2n-1$ phải là ước của số dư.

**Bước 1.** Thực hiện phép chia đa thức theo từng hạng tử, mỗi lần nhân thương mới với $2n-1$ rồi trừ đi, đến khi dư là hằng số.

**Bước 2.** Từ biểu thức chia hết suy ra $2n-1$ là ước của số dư, nên liệt kê mọi ước nguyên của số dư, nhớ lấy cả ước âm.

**Bước 3.** Với mỗi ước, tính $n$ rồi chỉ giữ lại các giá trị $n$ nguyên, sau đó thử lại.

**Phần 2. Trình bày**

$2n^3+n^2+7n+1=(2n-1)(n^2+n+4)+5$.

Vì $(2n-1)(n^2+n+4)\vdots(2n-1)$ nên $2n^3+n^2+7n+1\vdots2n-1\Leftrightarrow5\vdots2n-1$, tức $2n-1\in\{-5;-1;1;5\}$.

$2n-1=-5\Rightarrow n=-2$; $2n-1=-1\Rightarrow n=0$; $2n-1=1\Rightarrow n=1$; $2n-1=5\Rightarrow n=3$ (đều nguyên).

Thử lại: $n=-2$: $-16+4-14+1=-25$ chia hết cho $-5$; $n=0$: $1$ chia hết cho $-1$; $n=1$: $11$ chia hết cho $1$; $n=3$: $54+9+21+1=85$ chia hết cho $5$ (nhận cả bốn).

Vậy $n\in\{1;0;3;-2\}$.

=== T7B.37c@p158
- bai: 37 · y: c · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: tách số hạng để lộ nhân tử chung · số nguyên là ước của một số (kể cả ước âm)
- kiem: khong
- ket_qua_sach: 3; 1; 4; 0; 5; 8; -1; -4
- dap_an: $n\in\{3;1;4;0;5;8;-1;-4\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000], n khác 2: n ∈ {-4;-1;0;1;3;4;5;8}, khớp sách.
## DE
Tìm số nguyên $n$ sao cho $n^3-2$ chia hết cho $n-2$.
## SACH
$n^3-8+6$ chia hết cho $n-2$ nên $6$ chia hết cho $n-2$.

Đáp số: $3;1;4;0;5;8;-1;-4$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hạng tử $n^3$ đi với $n-2$ gợi ngay $n^3-8=(n-2)(n^2+2n+4)$, nên viết $n^3-2=(n^3-8)+6$ để chỉ còn phải xét $n-2$ có là ước của hằng số $6$ hay không.

**Bước 1.** Tách $-2=-8+6$ để nhóm $n^3-8$, rồi phân tích nó bằng hằng đẳng thức hiệu hai lập phương.

**Bước 2.** Suy ra $n-2$ phải là ước của số dư $6$, rồi liệt kê đủ mọi ước nguyên của $6$ (cả dương lẫn âm).

**Bước 3.** Từ mỗi ước tính $n$, đối chiếu kết quả với điều kiện đề rồi thử lại.

**Phần 2. Trình bày**

$n^3-2=(n^3-8)+6=(n-2)(n^2+2n+4)+6$.

Vì $(n-2)(n^2+2n+4)\vdots n-2$ nên $n^3-2\vdots n-2\Leftrightarrow6\vdots n-2$.

$n-2\in\{\pm1;\pm2;\pm3;\pm6\}$, suy ra $n\in\{3;1;4;0;5;-1;8;-4\}$.

Thử lại: các giá trị đều cho $n-2\ne0$ là ước của $6$, nên $n^3-2$ chia hết cho $n-2$ (nhận cả tám giá trị).

Vậy $n\in\{3;1;4;0;5;8;-1;-4\}$.

=== T7B.37d@p158
- bai: 37 · y: d · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: chia đa thức · ước dương của một số khi biểu thức luôn dương
- kiem: khong
- ket_qua_sach: 1; 0; -2; -1
- dap_an: $n\in\{1;0;-2;-1\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000]: n ∈ {-2;-1;0;1}, khớp sách.
## DE
Tìm số nguyên $n$ sao cho $n^3-3n^2-3n-1$ chia hết cho $n^2+n+1$.
## SACH
Phải có $n^2+n+1$ là ước của $3$. Chú ý rằng $n^2+n+1>0$ nên chỉ xét $n^2+n+1=3$ hoặc $n^2+n+1=1$.

Đáp số: $1;0;-2;-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chia đa thức bậc ba cho tam thức bậc hai để được số dư là hằng số; khi đó $n^2+n+1$ phải là ước của số dư, và vì $n^2+n+1$ luôn dương nên chỉ cần xét ước dương.

**Bước 1.** Chia $n^3-3n^2-3n-1$ cho $n^2+n+1$ để tìm thương và số dư.

**Bước 2.** Suy ra $n^2+n+1$ là ước của số dư và chứng tỏ $n^2+n+1>0$ bằng cách đưa về dạng bình phương cộng một số dương.

**Bước 3.** Giải từng phương trình $n^2+n+1=d$ với $d$ là ước dương của số dư, chỉ giữ nghiệm nguyên.

**Phần 2. Trình bày**

$n^3-3n^2-3n-1=(n^2+n+1)(n-4)+3$.

Do đó $n^3-3n^2-3n-1\vdots n^2+n+1\Leftrightarrow3\vdots n^2+n+1$.

Vì $n^2+n+1=\left(n+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ nên $n^2+n+1\in\{1;3\}$.

$n^2+n+1=1\Leftrightarrow n(n+1)=0\Leftrightarrow n=0$ hoặc $n=-1$.

$n^2+n+1=3\Leftrightarrow n^2+n-2=0\Leftrightarrow(n-1)(n+2)=0\Leftrightarrow n=1$ hoặc $n=-2$.

Cả bốn giá trị đều nguyên và thỏa mãn.

Vậy $n\in\{1;0;-2;-1\}$.

=== T7B.37e@p158
- bai: 37 · y: e · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử · loại giá trị làm mẫu bằng 0 · ước của 2
- kiem: khong
- ket_qua_sach: 0; -2; -3
- dap_an: $n\in\{0;-2;-3\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000], loại n = ±1 (chia cho 0): n ∈ {-3;-2;0}, khớp sách.
## DE
Tìm số nguyên $n$ sao cho $n^4-2n^3+2n^2-2n+1$ chia hết cho $n^4-1$.
## SACH
$A=n^4-2n^3+2n^2-2n+1=(n-1)^2(n^2+1)$

$B=n^4-1=(n^2+1)(n+1)(n-1)$

Do $n\ne\pm1$ nên $n-1$ chia hết cho $n+1\Rightarrow2$ chia hết cho $n+1$.

Đáp số: $0;-2;-3$ (chú ý $n=1$ loại)
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả số bị chia và số chia đều phân tích được thành tích chứa $n-1$ và $n^2+1$; sau khi giản ước các nhân tử chung chỉ còn điều kiện $n-1$ chia hết cho $n+1$.

**Bước 1.** Phân tích số bị chia bằng cách nhóm hạng tử để thấy xuất hiện $(n-1)^2(n^2+1)$.

**Bước 2.** Phân tích số chia $n^4-1$ bằng hằng đẳng thức, rồi chú ý số chia phải khác $0$ nên loại $n=\pm1$.

**Bước 3.** Với $n\ne\pm1$ giản ước các nhân tử chung khác $0$, đưa về $n-1\vdots n+1$ rồi suy ra $n+1$ là ước của một hằng số.

**Bước 4.** Liệt kê các ước (cả âm), tính $n$ rồi loại các giá trị làm số chia bằng $0$ và thử lại.

**Phần 2. Trình bày**

$A=n^4-2n^3+2n^2-2n+1=(n-1)^2(n^2+1)$ và $B=n^4-1=(n-1)(n+1)(n^2+1)$.

Để $A\vdots B$ thì $B\ne0$, nên $n\ne\pm1$. Khi đó $n-1\ne0$, $n^2+1\ne0$, nên $\dfrac{A}{B}=\dfrac{n-1}{n+1}$ phải là số nguyên, tức $(n-1)\vdots(n+1)$.

Mà $n-1=(n+1)-2$ nên $(n-1)\vdots(n+1)\Leftrightarrow2\vdots(n+1)$, suy ra $n+1\in\{-2;-1;1;2\}$, tức $n\in\{-3;-2;0;1\}$.

Loại $n=1$ vì $B=0$.

Thử lại: $n=0$: $A=1$, $B=-1$; $n=-2$: $A=45$, $B=15$; $n=-3$: $A=160$, $B=80$, đều chia hết (nhận).

Vậy $n\in\{0;-2;-3\}$.

=== T7B.37f@p158
- bai: 37 · y: f · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: chia đa thức · hiệu hai bình phương · thử lại sau khi lấy điều kiện cần
- kiem: khong
- ket_qua_sach: 0; 2; -8
- dap_an: $n\in\{0;2;-8\}$
- ghi_chu_nghi: Máy vét n trong [-3000;3000]: n ∈ {-8;0;2}, khớp sách.
## DE
Tìm số nguyên $n$ sao cho $n^3-n^2+2n+7$ chia hết cho $n^2+1$.
## SACH
Chia $n^3-n^2+2n+7$ cho $n^2+1$, được $n-1$, dư $n+8$.

$n+8\vdots n^2+1\Rightarrow(n+8)(n-8)=n^2-64\vdots n^2+1\Rightarrow n^2+1-65\vdots n^2+1\Rightarrow65\vdots n^2+1$.

Lần lượt cho $n^2+1$ bằng $1;5;13;65$ được $n$ bằng $0;\pm2;\pm8$. Thử lại các giá trị $n=2$; $n=0$; $n=-8$ thỏa mãn.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số dư của phép chia không còn là hằng số (có dạng $n+8$), nên phải dùng bất đẳng thức hoặc thêm bớt để hạ số dư thành hằng số: nhân $n+8$ với $n-8$ để xuất hiện $n^2-64$, trong đó có $n^2+1$.

**Bước 1.** Chia đa thức $n^3-n^2+2n+7$ cho $n^2+1$ để biết số dư dạng bậc nhất.

**Bước 2.** Từ $n^2+1$ chia hết cho số dư $n+8$ suy ra $n^2+1$ là ước của $(n+8)(n-8)$, rồi biến đổi để $n^2+1$ là ước của một hằng số.

**Bước 3.** Liệt kê các ước dương của hằng số đó có dạng $n^2+1$ rồi tìm các số nguyên $n$ tương ứng.

**Bước 4.** Vì các biến đổi ở bước 2 chỉ cho điều kiện cần nên phải thử lại từng giá trị với điều kiện ban đầu "số dư $n+8$ chia hết cho $n^2+1$".

**Chú ý:** Không được dừng ngay khi tìm ra các giá trị $n$ từ ước của hằng số: đó chỉ là điều kiện cần, và có giá trị trong số đó bị loại khi thử lại.

**Phần 2. Trình bày**

$n^3-n^2+2n+7=(n^2+1)(n-1)+(n+8)$.

Vậy $n^3-n^2+2n+7\vdots n^2+1\Leftrightarrow(n+8)\vdots(n^2+1)$.

Khi đó $(n+8)(n-8)=n^2-64\vdots n^2+1$, tức $(n^2+1)-65\vdots n^2+1$, suy ra $65\vdots n^2+1$.

$n^2+1>0$ nên $n^2+1\in\{1;5;13;65\}$, tức $n^2\in\{0;4;12;64\}$. $n^2=12$ không có nghiệm nguyên; còn lại $n\in\{0;2;-2;8;-8\}$.

Thử lại $(n+8)\vdots(n^2+1)$: $n=0$: $8\vdots1$ (nhận). $n=2$: $10\vdots5$ (nhận). $n=-2$: $6\vdots5$ sai (loại). $n=8$: $16\vdots65$ sai (loại). $n=-8$: $0\vdots65$ đúng (nhận).

Vậy $n\in\{0;2;-8\}$.

=== T7B.38a@p158
- bai: 38 · y: a · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tích các số nguyên liên tiếp · phân tích nhân tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng với mọi số nguyên $n$, $n^3-n$ chia hết cho $3$.
## SACH
$n^3-n=n(n^2-1)=(n-1)n(n+1)$. Trong $3$ số nguyên liên tiếp, có một bội số của $3$. Vậy $n^3-n$ chia hết cho $3$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** $n^3-n$ phân tích được thành tích ba số nguyên liên tiếp, mà trong ba số nguyên liên tiếp luôn có đúng một số chia hết cho $3$.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi phân tích $n^2-1$ bằng hằng đẳng thức hiệu hai bình phương.

**Bước 2.** Nhận ra ba nhân tử thu được là ba số nguyên liên tiếp.

**Bước 3.** Giải thích vì sao ba số liên tiếp có một số chia hết cho $3$ để kết luận.

**Phần 2. Trình bày**

$n^3-n=n(n^2-1)=(n-1)n(n+1)$.

Đây là tích của ba số nguyên liên tiếp. Chia ba số đó cho $3$ thì được ba số dư khác nhau, nên có một số dư bằng $0$, tức có một thừa số chia hết cho $3$.

Vậy $n^3-n\vdots3$ với mọi số nguyên $n$.

=== T7B.38b@p158
- bai: 38 · y: b · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: phân tích nhân tử · xét số dư · tính chất số nguyên tố chia hết một tích
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách có hai cách; lời giải kho chọn Cách 2 (xét số dư), Cách 1 nhắc ở Chú ý.
## DE
Chứng minh rằng với mọi số nguyên $n$, $n^5-n$ chia hết cho $5$.
## SACH
Cách 1: Phân tích thành một tổng trong đó một số hạng là tích $5$ số nguyên liên tiếp, số hạng kia chia hết cho $5$.

$n^5-n=n(n^2-1)(n^2+1)=n(n^2-1)(n^2-4+5)$

$=n(n^2-1)(n+2)(n-2)+5n(n^2-1)$

$=(n-2)(n-1)n(n+1)(n+2)+5n(n^2-1)$

Số hạng đầu là tích $5$ số nguyên liên tiếp nên chia hết cho $5$. Số hạng sau cũng chia hết cho $5$. Do đó $n^5-n$ chia hết cho $5$.

Cũng có thể diễn đạt dưới hình thức xét hiệu giữa $n^5-n$ và tích $5$ số nguyên liên tiếp.

$(n^5-n)-(n-2)(n-1)n(n+1)(n+2)=(n^5-n)-(n^5-5n^3+4n)=5n^3-5n$.

Cách 2: Xét số dư của $n$ trong phép chia cho $5$.

$A=n^5-n=n(n^4-1)=n(n^2+1)(n^2-1)$

Nếu $n=5k$ ($k$ nguyên) thì $n$ chia hết cho $5$.

Nếu $n=5k\pm1$ thì $n^2-1$ chia hết cho $5$.

Nếu $n=5k\pm2$ thì $n^2+1$ chia hết cho $5$.

Trường hợp nào cũng có thể có một thừa số của $A$ chia hết cho $5$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Phân tích $n^5-n=n(n^2-1)(n^2+1)$ rồi chia theo số dư của $n$ khi chia cho $5$: với mỗi số dư, đúng một nhân tử trong ba nhân tử đó chia hết cho $5$.

**Bước 1.** Đặt $n$ làm nhân tử chung, rồi phân tích $n^4-1$ bằng hằng đẳng thức hiệu hai bình phương hai lần.

**Bước 2.** Chia $n$ theo năm dạng $5k$, $5k\pm1$, $5k\pm2$ vì mỗi số nguyên thuộc đúng một dạng.

**Bước 3.** Với mỗi dạng, chỉ ra nhân tử nào của tích chia hết cho $5$ rồi kết luận.

**Chú ý:** Còn một cách nữa là viết $n^5-n=(n-2)(n-1)n(n+1)(n+2)+5n(n^2-1)$, số hạng đầu là tích năm số nguyên liên tiếp nên chia hết cho $5$.

**Phần 2. Trình bày**

$n^5-n=n(n^4-1)=n(n^2-1)(n^2+1)$.

Nếu $n=5k$ thì $n\vdots5$.

Nếu $n=5k\pm1$ thì $n^2-1=25k^2\pm10k=5k(5k\pm2)\vdots5$.

Nếu $n=5k\pm2$ thì $n^2+1=25k^2\pm20k+5\vdots5$.

Trong cả ba trường hợp, tích có một thừa số chia hết cho $5$ nên $n^5-n\vdots5$.

Vậy $n^5-n$ chia hết cho $5$ với mọi số nguyên $n$.

=== T7B.38c@p158
- bai: 38 · y: c · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu với tích các số nguyên liên tiếp · tích bảy số nguyên liên tiếp chia hết cho 7
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách có hai cách; lời giải kho chọn Cách 1 (xét hiệu). Sách in "Các bài 50a, b, c" ở phần Chú ý nhưng đó là ý a, b, c của bài này (số bài lệch). Máy kiểm n^7-n chia hết cho 7 với n trong [-3000;3000].
## DE
Chứng minh rằng với mọi số nguyên $n$, $n^7-n$ chia hết cho $7$.
## SACH
Cách 1: Xét hiệu

$(n^7-n)-(n-3)(n-2)(n-1)n(n+1)(n+2)(n+3)=7n(2n^4-7n^2+5)$.

Cách 2: Phân tích $n^7-n$ thành $n(n^3+1)(n^3-1)$ rồi xét các trường hợp $n=7k$; $n=7k\pm1$; $n=7k\pm2$; $n=7k\pm3$.

Chú ý: $n^9-n$ không chia hết cho $9$ với mọi số nguyên $n$ (ví dụ $2^9-2=510$ không chia hết cho $9$). Các bài $50$a, b, c là trường hợp đặc biệt của định lý Fec-ma: Nếu $p$ là số nguyên tố thì $n^p-n$ chia hết cho $p$ với mọi số nguyên $n$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tích bảy số nguyên liên tiếp luôn chia hết cho $7$ và có bậc $7$, nên trừ nó khỏi $n^7-n$ để hạ bậc, phần còn lại có thừa số $7$ rõ ràng.

**Bước 1.** Khai triển tích $(n-3)(n-2)(n-1)n(n+1)(n+2)(n+3)$ bằng cách nhóm các cặp thừa số đối xứng thành hiệu hai bình phương.

**Bước 2.** Lấy $n^7-n$ trừ đi tích đó và rút gọn để thấy hiệu có thừa số $7$.

**Bước 3.** Giải thích tích bảy số liên tiếp chia hết cho $7$ vì có một số là bội của $7$, rồi cộng hai kết quả lại.

**Chú ý:** Cách khác là xét $n$ theo bảy số dư $7k$, $7k\pm1$, $7k\pm2$, $7k\pm3$ trong khi phân tích $n^7-n=n(n^3-1)(n^3+1)$.

**Phần 2. Trình bày**

$(n-3)(n-2)(n-1)n(n+1)(n+2)(n+3)=n(n^2-1)(n^2-4)(n^2-9)=n^7-14n^5+49n^3-36n$.

Do đó $(n^7-n)-(n-3)(n-2)\cdots(n+3)=14n^5-49n^3+35n=7n(2n^4-7n^2+5)\vdots7$.

Tích bảy số nguyên liên tiếp $(n-3)\cdots(n+3)$ có một thừa số chia hết cho $7$ nên chia hết cho $7$.

Vậy $n^7-n=7n(2n^4-7n^2+5)+(n-3)(n-2)\cdots(n+3)$ là tổng của hai số chia hết cho $7$, nên chia hết cho $7$ với mọi số nguyên $n$.

=== T7B.39@p158
- bai: 39 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tách hạng tử để dùng n^3-n chia hết cho 6 · tích hai số nguyên liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng $2n^3+3n^2+n$ chia hết cho $6$ với mọi số nguyên $n$.
## SACH
$2n^3+3n^2+n=2n^3-2n+3n^2+3n=2(n^3-n)+3n(n+1)$

Mỗi số hạng đều chia hết cho $6$ nên tổng chia hết cho $6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần tách $2n^3+3n^2+n$ thành tổng hai nhóm có thừa số chia hết cho $6$ rõ ràng: $n^3-n$ là tích ba số liên tiếp (chia hết cho $6$), còn $n(n+1)$ là tích hai số liên tiếp (chia hết cho $2$).

**Bước 1.** Thêm bớt $2n$ để tách $2n^3+3n^2+n$ thành $2(n^3-n)+3n(n+1)$.

**Bước 2.** Chứng minh $n^3-n=(n-1)n(n+1)$ chia hết cho $6$, nên $2(n^3-n)$ cũng chia hết cho $6$.

**Bước 3.** Chứng minh $n(n+1)$ chia hết cho $2$, nên $3n(n+1)$ chia hết cho $6$, rồi cộng lại.

**Phần 2. Trình bày**

$2n^3+3n^2+n=2n^3-2n+3n^2+3n=2(n^3-n)+3n(n+1)$.

$n^3-n=(n-1)n(n+1)$ là tích ba số nguyên liên tiếp nên chia hết cho $6$, suy ra $2(n^3-n)\vdots6$.

$n(n+1)$ là tích hai số nguyên liên tiếp nên chẵn, suy ra $3n(n+1)\vdots6$.

Vậy $2n^3+3n^2+n$ chia hết cho $6$ với mọi số nguyên $n$.

=== T7B.40@p158
- bai: 40 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: thêm bớt ab để dùng a^3-a chia hết cho 6
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng $a^3b-ab^3$ chia hết cho $6$ với mọi $a,b$ nguyên.
## SACH
$a^3b-ab^3=a^3b-ab-ab^3+ab=b(a^3-a)-a(b^3-b)$

Các số $a^3-a$; $b^3-b$ đều chia hết cho $6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức hai biến có dạng $a^3b-ab^3$; thêm bớt $ab$ để tách thành $b(a^3-a)$ và $a(b^3-b)$, mỗi nhóm chứa thừa số $x^3-x$ là tích ba số liên tiếp.

**Bước 1.** Thêm và bớt $ab$ rồi nhóm hạng tử để đặt $b$ chung ở một nhóm và $a$ chung ở nhóm còn lại.

**Bước 2.** Chứng minh $x^3-x$ chia hết cho $6$ với mọi số nguyên $x$ vì là tích ba số nguyên liên tiếp.

**Bước 3.** Áp dụng cho $x=a$ và $x=b$ rồi kết luận hiệu hai số chia hết cho $6$ thì chia hết cho $6$.

**Phần 2. Trình bày**

$a^3b-ab^3=(a^3b-ab)-(ab^3-ab)=b(a^3-a)-a(b^3-b)$.

Với mọi số nguyên $x$, $x^3-x=(x-1)x(x+1)$ là tích ba số nguyên liên tiếp nên chia hết cho $2$ và cho $3$, mà $\gcd(2,3)=1$ nên chia hết cho $6$.

Suy ra $a^3-a\vdots6$ và $b^3-b\vdots6$, do đó $b(a^3-a)\vdots6$ và $a(b^3-b)\vdots6$.

Vậy hiệu của chúng, tức $a^3b-ab^3$, chia hết cho $6$.

=== T7B.41@p158
- bai: 41 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: xét hiệu với a+b · x^3-x chia hết cho 6
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng tổng các lập phương của hai số nguyên chia hết cho $6$ khi và chỉ khi tổng hai số nguyên đó chia hết cho $6$.
## SACH
Gọi các số nguyên đó là $a$ và $b$. Xét hiệu:

$(a^3+b^3)-(a+b)=(a^3-a)+(b^3-b)$. Vế phải của đẳng thức trên chia hết cho $6$ nên $(a^3+b^3)-(a+b)$ chia hết cho $6$.

Do đó, nếu $a+b$ chia hết cho $6$ thì $a^3+b^3$ chia hết cho $6$, nếu $a^3+b^3$ chia hết cho $6$ thì $a+b$ chia hết cho $6$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đề có hai chiều "khi và chỉ khi" và hai biểu thức $a^3+b^3$, $a+b$ cùng bậc lệch nhau; xét hiệu $(a^3+b^3)-(a+b)$ để tách thành $(a^3-a)+(b^3-b)$, luôn chia hết cho $6$, nên hai biểu thức có cùng số dư khi chia cho $6$.

**Bước 1.** Lập hiệu $(a^3+b^3)-(a+b)$ rồi nhóm để xuất hiện $a^3-a$ và $b^3-b$.

**Bước 2.** Chứng minh $x^3-x$ chia hết cho $6$ với mọi số nguyên $x$, từ đó kết luận hiệu trên chia hết cho $6$.

**Bước 3.** Suy ra hai chiều: nếu $a+b\vdots6$ thì $a^3+b^3\vdots6$ và ngược lại.

**Phần 2. Trình bày**

Với mọi số nguyên $x$, $x^3-x=(x-1)x(x+1)\vdots6$ (tích ba số nguyên liên tiếp chia hết cho $2$ và cho $3$).

Gọi hai số nguyên là $a$ và $b$. Ta có $(a^3+b^3)-(a+b)=(a^3-a)+(b^3-b)\vdots6$.

Chiều thuận: nếu $a+b\vdots6$ thì $a^3+b^3=[(a^3+b^3)-(a+b)]+(a+b)\vdots6$.

Chiều đảo: nếu $a^3+b^3\vdots6$ thì $a+b=(a^3+b^3)-[(a^3+b^3)-(a+b)]\vdots6$.

Vậy $a^3+b^3\vdots6$ khi và chỉ khi $a+b\vdots6$.

=== T7B.42@p158
- bai: 42 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: n^3-n chia hết cho 6 · đặt ba số liên tiếp là n-1, n, n+1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách có ba cách; lời giải kho theo Cách 1, Cách 2 và 3 nhắc ở Chú ý.
## DE
Chứng minh rằng tổng các lập phương ba số nguyên liên tiếp thì chia hết cho $9$.
## SACH
Cách 1: Gọi $3$ số nguyên liên tiếp là $n-1$; $n$; $n+1$. Ta có:

$(n-1)^3+n^3+(n+1)^3=3n^3+6n=3n^3-3n+6n+3n=3(n^3-n)+9n$

Tổng trên chia hết cho $9$.

Cách 2: Cũng biến đổi như trên được $3n^3+6n=3n(n^2+2)$ rồi xét các trường hợp $n=3k$; $n=3k\pm1$.

Cách 3: Trong $3$ số nguyên liên tiếp, có một số chia hết cho $3$, một số chia hết cho $3$ dư $1$, một số chia hết cho $3$ dư $2$. Do đó tổng các lập phương của chúng có dạng $(3a)^3+(3b+1)^3+(3c+2)^3$. Khai triển, ta thấy tổng trên chia hết cho $9$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chọn ba số nguyên liên tiếp là $n-1$, $n$, $n+1$ (đối xứng quanh $n$) để các hạng tử bậc chẵn của $n$ triệt tiêu khi khai triển, còn lại $3n^3+6n$; rồi tách để dùng được $n^3-n$ chia hết cho $3$.

**Bước 1.** Đặt ba số liên tiếp là $n-1$, $n$, $n+1$ rồi khai triển tổng các lập phương.

**Bước 2.** Rút gọn để được dạng $3n^3+6n$ và tách thêm bớt $3n$ để tạo ra $3(n^3-n)$.

**Bước 3.** Dùng $n^3-n$ là tích ba số liên tiếp nên chia hết cho $3$, rồi suy ra tổng chia hết cho $9$.

**Chú ý:** Hai cách khác: viết $3n(n^2+2)$ rồi xét $n=3k$ và $n=3k\pm1$; hoặc lấy ba số liên tiếp có dạng $3a$, $3b+1$, $3c+2$ rồi khai triển.

**Phần 2. Trình bày**

Gọi ba số nguyên liên tiếp là $n-1$, $n$, $n+1$ ($n\in\mathbb{Z}$). Ta có:

$(n-1)^3+n^3+(n+1)^3=(n^3-3n^2+3n-1)+n^3+(n^3+3n^2+3n+1)=3n^3+6n$

$=3(n^3-n)+9n$.

$n^3-n=(n-1)n(n+1)$ là tích ba số nguyên liên tiếp nên chia hết cho $3$, suy ra $3(n^3-n)\vdots9$; và $9n\vdots9$.

Vậy tổng các lập phương của ba số nguyên liên tiếp chia hết cho $9$.

=== T7B.43@p158
- bai: 43 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: tích năm số nguyên liên tiếp chia hết cho 120 · phân tích nhân tử · hai số nguyên tố cùng nhau cùng chia hết
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng $n^5-5n^3+4n$ chia hết cho $120$ với mọi số nguyên $n$.
## SACH
$n^5-5n^3+4n=n(n^4-5n^2+4)$

$=n(n^2-1)(n^2-4)=n(n+1)(n-1)(n+2)(n-2)$. Đây là tích của $5$ số nguyên liên tiếp. Trong $5$ số nguyên liên tiếp, có ít nhất $2$ bội số của $2$ (trong đó có một bội số của $4$), một bội số của $3$, một bội số của $5$. Do đó tích $5$ số nguyên liên tiếp chia hết cho $8$, cho $3$, cho $5$. Các số $8$, $3$ và $5$ nguyên tố cùng nhau đôi một nên tích $5$ số nguyên liên tiếp chia hết cho $8\cdot3\cdot5=120$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Tam thức trùng phương trong ngoặc có nghiệm $n^2=1$ và $n^2=4$ nên phân tích được, và kết quả là tích năm số nguyên liên tiếp; còn $120=8\cdot3\cdot5$ gồm ba thừa số đôi một nguyên tố cùng nhau.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi phân tích $n^4-5n^2+4$ thành hai hiệu hai bình phương để nhận ra năm số nguyên liên tiếp.

**Bước 2.** Chứng minh tích năm số liên tiếp chia hết cho $3$ và cho $5$ vì có một bội của mỗi số.

**Bước 3.** Chứng minh chia hết cho $8$ nhờ có hai số chẵn trong đó một số là bội của $4$, rồi kết luận chia hết cho $8\cdot3\cdot5$.

**Phần 2. Trình bày**

$n^5-5n^3+4n=n(n^4-5n^2+4)=n(n^2-1)(n^2-4)=(n-2)(n-1)n(n+1)(n+2)$.

Đây là tích của năm số nguyên liên tiếp. Trong năm số đó có một bội của $5$ và một bội của $3$, nên tích chia hết cho $5$ và cho $3$.

Có ít nhất hai số chẵn, trong hai số chẵn liên tiếp có một số chia hết cho $4$, số kia chia hết cho $2$, nên tích chia hết cho $8$.

Vì $8$, $3$, $5$ đôi một nguyên tố cùng nhau nên tích chia hết cho $8\cdot3\cdot5=120$.

Vậy $n^5-5n^3+4n\vdots120$ với mọi số nguyên $n$.

=== T7B.44@p158
- bai: 44 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhóm hạng tử · đặt n=2k+1 · tích ba số nguyên liên tiếp
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
Chứng minh rằng $n^3-3n^2-n+3$ chia hết cho $48$ với mọi số lẻ $n$.
## SACH
$n^3-3n^2-n+3=n^2(n-3)-(n-3)=(n-3)(n-1)(n+1)$.

Thay $n=2k+1$ ($k$ nguyên) ta được $(2k-2)\cdot2k\cdot(2k+2)$ hay $8(k-1)k(k+1)$.

Tích $3$ số nguyên liên tiếp chia hết cho $6$ nên tích trên chia hết cho $48$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba có bốn hạng tử, nhóm hai hạng tử đầu và hai hạng tử cuối cho nhân tử chung $n-3$; khi $n$ lẻ ba nhân tử đều chẵn, rút được hệ số $8$ và còn tích ba số liên tiếp, và $48=8\cdot6$.

**Bước 1.** Nhóm $n^3-3n^2$ với $-n+3$ rồi đặt nhân tử chung $n-3$, sau đó phân tích tiếp $n^2-1$.

**Bước 2.** Thay $n=2k+1$ để mỗi nhân tử đều rút ra được thừa số $2$.

**Bước 3.** Nhận ra phần còn lại là tích ba số nguyên liên tiếp nên chia hết cho $6$, từ đó kết luận chia hết cho $8\cdot6$.

**Phần 2. Trình bày**

$n^3-3n^2-n+3=n^2(n-3)-(n-3)=(n-3)(n^2-1)=(n-3)(n-1)(n+1)$.

Vì $n$ lẻ, đặt $n=2k+1$ ($k\in\mathbb{Z}$): $(n-3)(n-1)(n+1)=(2k-2)\cdot2k\cdot(2k+2)=8(k-1)k(k+1)$.

$(k-1)k(k+1)$ là tích ba số nguyên liên tiếp nên chia hết cho $6$.

Suy ra biểu thức chia hết cho $8\cdot6=48$.

Vậy $n^3-3n^2-n+3\vdots48$ với mọi số lẻ $n$.

=== T7B.45@p158
- bai: 45 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử · đặt n=2k · tích bốn số nguyên liên tiếp chia hết cho 24
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n chẵn trong [-500;500) đều chia hết cho 384.
## DE
Chứng minh $n^4+4n^3-4n^2-16n$ chia hết cho $384$ với mọi số chẵn $n$.
## SACH
Phân tích thành $n(n+4)(n-2)(n+2)$ rồi thay $n=2k$ được $16k(k+2)(k-1)(k+1)$. Chú ý tích $4$ số nguyên liên tiếp chia hết cho $24$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nhóm hạng tử đưa đa thức về $n(n+4)(n-2)(n+2)$; khi $n$ chẵn cả bốn nhân tử đều chẵn, rút ra $16$ và còn tích bốn số nguyên liên tiếp chia hết cho $24$, và $16\cdot24=384$.

**Bước 1.** Đặt $n$ làm nhân tử chung rồi nhóm các hạng tử còn lại để phân tích tiếp đến khi được bốn nhân tử bậc nhất.

**Bước 2.** Vì $n$ chẵn nên thay $n=2k$ để mỗi nhân tử rút ra thừa số $2$, được thừa số $16$ đứng ngoài.

**Bước 3.** Nhận ra phần còn lại là tích bốn số nguyên liên tiếp nên chia hết cho $24$, rồi kết luận.

**Phần 2. Trình bày**

$n^4+4n^3-4n^2-16n=n(n^3+4n^2-4n-16)=n[n^2(n+4)-4(n+4)]=n(n+4)(n^2-4)=n(n+4)(n-2)(n+2)$.

Vì $n$ chẵn, đặt $n=2k$ ($k\in\mathbb{Z}$): $(n-2)n(n+2)(n+4)=2(k-1)\cdot2k\cdot2(k+1)\cdot2(k+2)=16(k-1)k(k+1)(k+2)$.

$(k-1)k(k+1)(k+2)$ là tích bốn số nguyên liên tiếp nên chia hết cho $24$.

Suy ra biểu thức chia hết cho $16\cdot24=384$.

Vậy $n^4+4n^3-4n^2-16n\vdots384$ với mọi số chẵn $n$.

=== T7B.46@p158
- bai: 46 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: viết thành (n+a)(n+b)+c với a-b=7 · tính chất 7 là số nguyên tố
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n trong [-500;500) đều cho n^2+11n+39 không chia hết cho 49.
## DE
Chứng minh rằng với mọi số nguyên $n$, số $n^2+11n+39$ không chia hết cho $49$.
## SACH
Viết biểu thức dưới dạng

$n^2+11n+39=n^2+11n+18+21=(n+9)(n+2)+21=A$.

Ta thấy $n+9$ và $n+2$ có hiệu bằng $7$ nên chúng hoặc cùng chia hết cho $7$, hoặc cùng không chia hết cho $7$. Nếu $n+9$ và $n+2$ cùng chia hết cho $7$ thì $(n+9)(n+2)$ chia hết cho $49$, nhưng $21$ không chia hết cho $49$ nên $A$ không chia hết cho $49$.

Nếu $n+9$ và $n+2$ cùng không chia hết cho $7$ ($7$ là số nguyên tố) thì $(n+9)(n+2)$ không chia hết cho $7$, nên cũng không chia hết cho $49$.

Vậy, với mọi số nguyên $n$ thì $n^2+11n+39$ không chia hết cho $49$.

Chú ý: Trong biến đổi trên, ta đưa biểu thức $n^2+11n+39$ về dạng $(n+a)(n+b)+c$, trong đó $(n+a)-(n+b)=7$, $a+b=11$. Như vậy chỉ cần chọn $a$ và $b$ sao cho $a-b=7$ và $a+b=11$. Do đó chọn $a=9$; $b=2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn xét chia hết cho $49=7^2$ thì đưa tam thức về dạng $(n+a)(n+b)+c$ với $a-b=7$: hai thừa số khi đó cùng chia hết cho $7$ hoặc cùng không, và phần $c$ chia hết cho $7$ nhưng không chia hết cho $49$.

**Bước 1.** Tìm $a$, $b$ từ hai điều kiện $a+b=11$ và $a-b=7$, rồi viết $n^2+11n+39=(n+a)(n+b)+c$.

**Bước 2.** Chỉ ra hai thừa số $n+a$ và $n+b$ cùng chia hết cho $7$ hoặc cùng không chia hết cho $7$ vì hiệu của chúng bằng $7$.

**Bước 3.** Xét hai trường hợp: nếu cùng chia hết cho $7$ thì tích chia hết cho $49$ còn $c$ thì không; nếu cùng không chia hết thì tích không chia hết cho $7$ nên cả biểu thức không chia hết cho $7$, càng không chia hết cho $49$.

**Phần 2. Trình bày**

$n^2+11n+39=(n^2+11n+18)+21=(n+9)(n+2)+21$.

Vì $(n+9)-(n+2)=7$ nên $n+9$ và $n+2$ cùng chia hết cho $7$ hoặc cùng không chia hết cho $7$.

Nếu cùng chia hết cho $7$: $(n+9)(n+2)\vdots49$, còn $21\not\vdots49$, nên $n^2+11n+39\not\vdots49$.

Nếu cùng không chia hết cho $7$: vì $7$ là số nguyên tố nên $(n+9)(n+2)\not\vdots7$, mà $21\vdots7$, nên $n^2+11n+39\not\vdots7$, do đó không chia hết cho $49$.

Vậy $n^2+11n+39$ không chia hết cho $49$ với mọi số nguyên $n$.

=== T7B.47@p158
- bai: 47 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: xét số dư khi chia cho 3 · đặt n=3k+1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải in trong sách không khớp đề (đó là chuỗi tích phân số 1·2·3…(n-1) chia 2·3·4…n, hình như lẫn từ bài khác), không dùng được; kho tự giải theo xét số dư mod 3 và 9. Máy kiểm n trong [-500;500) đều cho n^2+n+1 không chia hết cho 9.
## DE
Chứng minh rằng với mọi số nguyên $n$, $n^2+n+1$ không chia hết cho $9$.
## SACH
Viết $n^2+n+1$ thành $=\dfrac{1\cdot2\cdot3\cdots(n-1)}{2\cdot3\cdot4\cdots(n-1)n}\cdot\dfrac{3\cdot4\cdot5\cdots n(n+1)}{2\cdot3\cdot4\cdots n}$ rồi lý luận như trên ta có đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Nếu $n^2+n+1\vdots9$ thì $n^2+n+1\vdots3$; xét số dư của $n$ khi chia cho $3$ thấy chỉ một dạng $n=3k+1$ làm tam thức chia hết cho $3$, rồi thay vào để xem số dư khi chia cho $9$.

**Bước 1.** Xét ba dạng $n=3k$, $n=3k+1$, $n=3k+2$ để tìm dạng nào làm $n^2+n+1$ chia hết cho $3$.

**Bước 2.** Với dạng duy nhất đó, thay $n$ vào và khai triển để biểu diễn $n^2+n+1$ theo $k$.

**Bước 3.** Chỉ ra biểu thức có số dư khác $0$ khi chia cho $9$, rồi kết luận mọi dạng đều không chia hết cho $9$.

**Phần 2. Trình bày**

Nếu $n=3k$ thì $n^2+n+1=9k^2+3k+1$ chia $3$ dư $1$, không chia hết cho $3$.

Nếu $n=3k+2$ thì $n^2+n+1=9k^2+12k+4+3k+2+1=9k^2+15k+7$ chia $3$ dư $1$, không chia hết cho $3$.

Nếu $n=3k+1$ thì $n^2+n+1=9k^2+6k+1+3k+1+1=9k^2+9k+3=9k(k+1)+3$ chia $9$ dư $3$, không chia hết cho $9$.

Vậy trong mọi trường hợp $n^2+n+1$ không chia hết cho $9$.

=== T7B.48@p158
- bai: 48 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: nhóm cặp thừa số cho cùng một biểu thức · hằng đẳng thức bình phương một tổng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Mép trang mất một số kí hiệu ở dòng biến đổi thứ hai của sách (chữ "n" đầu dòng và dấu mũ), dựng lại theo dòng kết quả. Máy kiểm n từ 0 đến 499: n(n+1)(n+2)(n+3)+1 luôn là số chính phương.
## DE
Chứng minh rằng lấy tích bốn số nguyên liên tiếp cộng với $1$, ta được một số chính phương (số chính phương là bình phương của một số nguyên).
## SACH
Gọi $4$ số nguyên liên tiếp là $n$, $n+1$, $n+2$, $n+3$, ta có:

$n(n+1)(n+2)(n+3)+1=(n^2+3n)(n^2+3n+2)+1$

$=(n^2+3n)^2+2(n^2+3n)+1=(n^2+3n+1)^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ghép hai thừa số đầu và cuối, hai thừa số giữa thành hai cặp có cùng một phần $n^2+3n$; đặt biểu thức đó làm ẩn mới thì tích là dạng $t(t+2)$ và cộng thêm $1$ ra hằng đẳng thức bình phương một tổng.

**Bước 1.** Ghép thừa số đầu với thừa số cuối, thừa số thứ hai với thừa số thứ ba để thấy hai cặp có chung $n^2+3n$.

**Bước 2.** Đặt $t=n^2+3n$ để tích có dạng $t(t+2)$, rồi cộng thêm $1$.

**Bước 3.** Nhận ra $t^2+2t+1$ là bình phương của một số nguyên rồi thay $t$ trở lại.

**Phần 2. Trình bày**

Gọi bốn số nguyên liên tiếp là $n$, $n+1$, $n+2$, $n+3$ ($n\in\mathbb{Z}$).

$n(n+1)(n+2)(n+3)+1=[n(n+3)][(n+1)(n+2)]+1=(n^2+3n)(n^2+3n+2)+1$.

Đặt $t=n^2+3n$: $t(t+2)+1=t^2+2t+1=(t+1)^2=(n^2+3n+1)^2$.

Vì $n^2+3n+1$ là số nguyên nên tích bốn số nguyên liên tiếp cộng $1$ là một số chính phương.

=== T7B.49a@p158
- bai: 49 · y: a · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: thêm bớt hạng tử để về hiệu hai bình phương · hợp số là tích hai thừa số lớn hơn 1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dòng đầu lời giải sách có chen một đẳng thức phân số 1/(n-1)-1/n=1/((n-1)n) không ăn nhập với câu (lỗi in), chép đúng như in. Máy kiểm n từ 2 đến 1999: n^4+4 luôn là hợp số.
## DE
Chứng minh rằng với mọi số tự nhiên $n>1$, số $n^4+4$ là hợp số.
## SACH
Để chứng minh $n^4+4$ là hợp số, ta chứng tỏ $\dfrac{1}{n-1}-\dfrac{1}{n}=\dfrac{1}{(n-1)n}$ phân tích được ra tích hai thừa số lớn hơn $1$ (với $n>1$). Thêm bớt $4n^2$ vào biểu thức rồi phân tích ra thừa số được $(n^2+2n+2)[(n-1)^2+1]$.

Với $n>1$, cả hai thừa số đều lớn hơn $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Muốn chứng minh một số là hợp số thì phải phân tích nó thành tích hai thừa số đều lớn hơn $1$; $n^4+4$ thiếu hạng tử $4n^2$ để thành bình phương nên thêm bớt $4n^2$ rồi dùng hiệu hai bình phương.

**Bước 1.** Thêm và bớt $4n^2$ để nhóm $n^4+4n^2+4$ thành bình phương của một biểu thức.

**Bước 2.** Áp dụng hằng đẳng thức hiệu hai bình phương để phân tích thành tích hai thừa số.

**Bước 3.** Chứng minh với $n>1$ thì cả hai thừa số đều lớn hơn $1$, từ đó kết luận hợp số.

**Phần 2. Trình bày**

$n^4+4=n^4+4n^2+4-4n^2=(n^2+2)^2-(2n)^2=(n^2+2n+2)(n^2-2n+2)$

$=(n^2+2n+2)[(n-1)^2+1]$.

Với $n>1$: $n^2+2n+2>1$ và $(n-1)^2+1\ge1+1=2>1$ (vì $n-1\ge1$).

Vậy $n^4+4$ là tích của hai số tự nhiên lớn hơn $1$ nên là hợp số.

=== T7B.49b@p158
- bai: 49 · y: b · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: thêm bớt hạng tử để về hiệu hai bình phương · hợp số là tích hai thừa số lớn hơn 1
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách không xét riêng k=0 (khi đó n^4=n·n^3 vẫn là hợp số); lời giải kho xét thêm k=0. Máy kiểm n từ 2 đến 59, k từ 0 đến 59: n^4+4k^4 luôn là hợp số.
## DE
Chứng minh rằng với mọi số tự nhiên $n>1$, số $n^4+4k^4$ là hợp số ($k$ tự nhiên).
## SACH
$n^4+4k^4=(n^2+2nk+2k^2)(n^2-2nk+2k^2)$ rồi chứng minh mỗi thừa số đều lớn hơn $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cùng dạng với $n^4+4$ nhưng có thêm tham số $k$: thêm bớt $4n^2k^2$ để được hiệu hai bình phương, rồi kiểm tra mỗi thừa số lớn hơn $1$, chú ý trường hợp $k=0$.

**Bước 1.** Thêm và bớt $4n^2k^2$ để $n^4+4n^2k^2+4k^4$ thành bình phương rồi phân tích thành hai thừa số.

**Bước 2.** Viết thừa số thứ hai dưới dạng tổng hai bình phương để biết khi nào nó bằng $1$.

**Bước 3.** Xét riêng trường hợp $k=0$, rồi trường hợp $k\ge1$ để chứng minh hai thừa số đều lớn hơn $1$.

**Phần 2. Trình bày**

Nếu $k=0$ thì $n^4=n\cdot n^3$ với $n>1$ và $n^3>1$ nên là hợp số.

Nếu $k\ge1$: $n^4+4k^4=(n^4+4n^2k^2+4k^4)-4n^2k^2=(n^2+2k^2)^2-(2nk)^2$

$=(n^2+2nk+2k^2)(n^2-2nk+2k^2)$.

Thừa số thứ nhất $n^2+2nk+2k^2>1$ vì $n^2\ge4$.

Thừa số thứ hai $n^2-2nk+2k^2=(n-k)^2+k^2\ge k^2\ge1$, và bằng $1$ chỉ khi $k=1$ và $n=k=1$, trái với $n>1$. Vậy nó lớn hơn $1$.

Vậy $n^4+4k^4$ là tích hai số tự nhiên lớn hơn $1$ nên là hợp số.

=== T7B.50@p158
- bai: 50 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: phân tích nhân tử để chứng minh chia hết · số hạng tử chung (1+ab)
- kiem: khong
- ket_qua_sach: a) 2^{32}+1; b) 2^{32}+1 chia hết cho 641 nên không là số nguyên tố
- dap_an: a) $2^{32}+1$; b) không là số nguyên tố (chia hết cho $641$)
- ghi_chu_nghi: Giữ nguyên cả bài vì ý b dựa vào ý a. Máy kiểm: (1+ab-b^4)a^4+1 = 2^32+1 khi a=2^7, b=5; 2^32+1 = 641·6700417.
## DE
a) Tính giá trị biểu thức $(1+ab-b^4)a^4+1$ với $a=2^7$; $b=5$.

b) Số $2^{32}+1$ có là số nguyên tố không?
## SACH
a) $2^{32}+1$.

b) Dựa vào câu a), rồi chứng minh $(1+ab-b^4)a^4+1$ chia hết cho $1+ab$. Do đó $2^{32}+1$ chia hết cho $1+2^7\cdot5=641$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai ý cùng một biểu thức: tính giá trị ở ý a ra đúng số $2^{32}+1$ của ý b; sau đó chứng minh biểu thức tổng quát chia hết cho $1+ab$ rồi thay $a=2^7$, $b=5$ để chỉ ra một ước của $2^{32}+1$.

**Bước 1.** Thay $a=2^7$, $b=5$ vào biểu thức: tính $ab$, $b^4$ rồi $a^4$ và nhận ra giá trị bằng lũy thừa của $2$ cộng $1$.

**Bước 2.** Khai triển $(1+ab-b^4)a^4+1$ rồi nhóm hạng tử để phân tích thành nhân tử có chứa $1+ab$.

**Bước 3.** Suy ra biểu thức chia hết cho $1+ab$ rồi thay giá trị cụ thể để tìm một ước của $2^{32}+1$ khác $1$ và khác chính nó.

**Chú ý:** Muốn kết luận $2^{32}+1$ không là số nguyên tố phải chỉ ra ước lớn hơn $1$ và nhỏ hơn số đó, nên cần so sánh $641$ với $2^{32}+1$.

**Phần 2. Trình bày**

a) Với $a=2^7$, $b=5$: $ab=2^7\cdot5=640$, $b^4=625$, $a^4=2^{28}$.

$(1+ab-b^4)a^4+1=(1+640-625)\cdot2^{28}+1=16\cdot2^{28}+1=2^4\cdot2^{28}+1=2^{32}+1$.

b) Với $a,b$ bất kì: $(1+ab-b^4)a^4+1=a^4+a^5b-a^4b^4+1=a^4(1+ab)+(1-a^4b^4)$.

$1-a^4b^4=(1-a^2b^2)(1+a^2b^2)=(1-ab)(1+ab)(1+a^2b^2)$.

Suy ra $(1+ab-b^4)a^4+1=(1+ab)[a^4+(1-ab)(1+a^2b^2)]$ chia hết cho $1+ab$.

Với $a=2^7$, $b=5$ thì $1+ab=641$, theo ý a biểu thức bằng $2^{32}+1$, nên $2^{32}+1\vdots641$.

Vì $1<641<2^{32}+1$ nên $2^{32}+1$ có ước lớn hơn $1$ và khác chính nó, do đó không là số nguyên tố.

Vậy $2^{32}+1$ không là số nguyên tố.

=== T7B.51@p158
- bai: 51 · y: - · trang: 158 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ cho dãy chữ số 1 · 9k+1=10^n
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Máy kiểm n từ 1 đến 11: số 11…122…2 = (3k)(3k+1) với k=11…1.
## DE
Chứng minh rằng số $\underbrace{11\ldots1}_{n}\underbrace{22\ldots2}_{n}$ gồm $n$ chữ số $1$ và $n$ chữ số $2$ là tích hai số nguyên liên tiếp với mọi số tự nhiên $n$.
## SACH
Đặt $\underbrace{11\ldots1}_{n}=k$ thì $9k+1=\underbrace{99\ldots9}_{n}+1=10^n$.

Ta có $A=\underbrace{11\ldots1}_{n}\underbrace{22\ldots2}_{n}=\underbrace{11\ldots1}_{n}\cdot10^n+2\cdot\underbrace{11\ldots1}_{n}=k\cdot10^n+2k$

$=k(10^n+2)=k(9k+1+2)=3k(3k+1)$.

Vậy $A$ là tích $2$ số nguyên liên tiếp $\underbrace{33\ldots3}_{n}$ và $\underbrace{33\ldots3}_{n-1}4$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số gồm toàn chữ số $1$ gắn với $\dfrac{10^n-1}{9}$; đặt $k=11\ldots1$ ($n$ chữ số) thì $9k+1=10^n$, nhờ đó viết cả số theo $k$ và $10^n$ rồi đưa về tích $3k(3k+1)$.

**Bước 1.** Đặt $k$ là số gồm $n$ chữ số $1$ và chứng tỏ $9k+1=10^n$.

**Bước 2.** Viết số đã cho thành $k\cdot10^n+2k$ vì khối chữ số $2$ bằng $2k$ và khối chữ số $1$ bị đẩy lên $n$ vị trí.

**Bước 3.** Thay $10^n=9k+1$ để rút gọn và phân tích thành tích $3k$ và $3k+1$, rồi nhận ra đây là hai số nguyên liên tiếp.

**Phần 2. Trình bày**

Đặt $k=\underbrace{11\ldots1}_{n}$. Khi đó $9k=\underbrace{99\ldots9}_{n}=10^n-1$, nên $10^n=9k+1$.

Số đã cho là $A=\underbrace{11\ldots1}_{n}\cdot10^n+\underbrace{22\ldots2}_{n}=k\cdot10^n+2k=k(10^n+2)=k(9k+3)=3k(3k+1)$.

Vì $k\in\mathbb{N}^*$ nên $3k$ và $3k+1$ là hai số nguyên liên tiếp (ở đó $3k=\underbrace{33\ldots3}_{n}$ và $3k+1=\underbrace{33\ldots3}_{n-1}4$).

Vậy $A$ là tích hai số nguyên liên tiếp.

=== T7B.52@p159
- bai: 52 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: đặt ẩn phụ cho dãy chữ số 1 · 9k+1=10^n
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Dưới dấu móc cuối của sách in "m", dựng lại là n theo ngữ cảnh. Máy kiểm n từ 1 đến 11: 11…1 (2n chữ số) − 22…2 (n chữ số) = (33…3)^2.
## DE
Chứng minh rằng số $\underbrace{11\ldots1}_{2n}-\underbrace{22\ldots2}_{n}$ gồm $2n$ chữ số $1$ và $n$ chữ số $2$ là một số chính phương với mọi số tự nhiên $n$.
## SACH
Cũng đặt $\underbrace{11\ldots1}_{n}=k$, ta có

$k\cdot10^n+k-2k=k\cdot10^n-k=k(10^n-1)=k\cdot9k=(3k)^2=(\underbrace{33\ldots3}_{n})^2$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số gồm $2n$ chữ số $1$ là "khối $n$ chữ số $1$" ghép với "khối $n$ chữ số $1$"; đặt $k$ là số gồm $n$ chữ số $1$ thì $9k+1=10^n$ nên mọi khối đều biểu diễn được theo $k$ và $10^n$, rồi hiệu cần tìm đưa về $9k^2$.

**Bước 1.** Đặt $k$ là số gồm $n$ chữ số $1$ và chứng tỏ $10^n=9k+1$.

**Bước 2.** Viết số gồm $2n$ chữ số $1$ thành $k\cdot10^n+k$ và số gồm $n$ chữ số $2$ thành $2k$.

**Bước 3.** Lấy hiệu, thay $10^n=9k+1$ để rút gọn thành bình phương của $3k$ rồi nhận dạng $3k$.

**Phần 2. Trình bày**

Đặt $k=\underbrace{11\ldots1}_{n}$, khi đó $9k=10^n-1$, tức $10^n=9k+1$.

$\underbrace{11\ldots1}_{2n}=k\cdot10^n+k$ và $\underbrace{22\ldots2}_{n}=2k$.

Hiệu cần xét là $k\cdot10^n+k-2k=k\cdot10^n-k=k(10^n-1)=k\cdot9k=(3k)^2$.

Vì $3k=\underbrace{33\ldots3}_{n}$ là số nguyên nên hiệu là số chính phương.

Vậy $\underbrace{11\ldots1}_{2n}-\underbrace{22\ldots2}_{n}=(\underbrace{33\ldots3}_{n})^2$ là số chính phương với mọi $n\in\mathbb{N}^*$.

=== T7B.53@p159
- bai: 53 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · số dư khi chia cho 2003 · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach: Tồn tại
- dap_an: Tồn tại
- ghi_chu_nghi: Máy tìm được một ví dụ cụ thể: 2672002 = 2003·1334 tận cùng là 2002. Thỏ = 2004 số, lồng = 2003 số dư khi chia cho 2003.
## DE
Có tồn tại hay không một số tự nhiên tận cùng là $2002$ và chia hết cho $2003$?
## SACH
Đáp số: Tồn tại.

Xét $2004$ số có dạng $2002$, $20022002$, $\ldots$, $20022002\ldots2002$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cần một số chia hết cho $2003$, mà số dư chỉ có $2003$ giá trị; có $2004$ số cho trước thì hai số trùng số dư (nguyên lí Đi-rích-lê). Chọn các số có dạng "ghép nhiều lần chữ số $2002$" để hiệu của hai số vẫn tận cùng là $2002$.

**Bước 1.** Lập dãy $2004$ số $a_1,a_2,\ldots,a_{2004}$, trong đó $a_i$ là số tạo thành bằng cách viết liền $i$ lần khối $2002$; đây là $2004$ "thỏ".

**Bước 2.** Số dư khi chia cho $2003$ chỉ nhận $2003$ giá trị $0,1,\ldots,2002$; đó là $2003$ "lồng". Suy ra có hai số $a_i$, $a_j$ ($i<j$) cùng số dư.

**Bước 3.** Viết hiệu $a_j-a_i$ thành tích của một số cùng dạng "ghép $j-i$ lần khối $2002$" với lũy thừa của $10$, rồi dùng tính nguyên tố cùng nhau giữa $2003$ và $10$ để bỏ lũy thừa của $10$.

**Chú ý:** Nếu chỉ nói "hiệu chia hết cho $2003$" thì chưa đủ: phải chứng minh phần còn lại sau khi bỏ lũy thừa của $10$ vẫn tận cùng là $2002$.

**Phần 2. Trình bày**

Với $i=1,2,\ldots,2004$, gọi $a_i$ là số tạo thành bằng cách viết liền $i$ lần khối $2002$: $a_1=2002$, $a_2=20022002$, $\ldots$.

Có $2004$ số $a_i$ (thỏ). Khi chia cho $2003$ có $2003$ số dư khả dĩ là $0,1,\ldots,2002$ (lồng). Vì $2004>2003$ nên theo nguyên lí Đi-rích-lê có hai số $a_i$, $a_j$ với $1\le i<j\le2004$ cùng số dư, suy ra $a_j-a_i\vdots2003$.

Số $a_j$ gồm khối $(j-i)$ lần $2002$ rồi tới $i$ lần $2002$, nên $a_j=a_{j-i}\cdot10^{4i}+a_i$, do đó $a_j-a_i=a_{j-i}\cdot10^{4i}$.

Vì $2003$ không chia hết cho $2$ và cho $5$ nên $\gcd(2003,10^{4i})=1$. Từ $a_{j-i}\cdot10^{4i}\vdots2003$ suy ra $a_{j-i}\vdots2003$.

Số $a_{j-i}$ tận cùng là $2002$ (mỗi $a_m$ đều kết thúc bởi khối $2002$) và chia hết cho $2003$.

Vậy tồn tại một số tự nhiên tận cùng là $2002$ và chia hết cho $2003$.

=== T7B.54@p159
- bai: 54 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · số dư khi chia cho 10^4 · loại số dư 0
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách lấy 10^4 số vào 10^4 số dư mà không loại số dư 0; lời giải kho bổ sung bước loại dư 0 (vì 2001^m lẻ) để còn 9999 lồng. Thỏ = 10^4 lũy thừa 2001^1…2001^(10^4), lồng = 9999 số dư khác 0. Máy tìm ra 2001^1 và 2001^6 cùng dư 2001 khi chia cho 10^4.
## DE
Chứng minh rằng có hai lũy thừa của $2001$ có bốn chữ số tận cùng bằng nhau.
## SACH
Ta cần chứng minh tồn tại hai lũy thừa của $2001$ mà hiệu chia hết cho $10^4$. Xét $10^4$ số: $2001^1$, $2001^2$, $\ldots$, $2001^{10^4}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Hai số có bốn chữ số tận cùng bằng nhau" tức là hai số cùng số dư khi chia cho $10^4$; số dư có ít giá trị hơn số lũy thừa nên dùng nguyên lí Đi-rích-lê, nhưng phải loại số dư $0$ vì lũy thừa của $2001$ không chia hết cho $10$.

**Bước 1.** Chuyển yêu cầu về dạng "hai lũy thừa cùng số dư khi chia cho $10^4$" và lập $10^4$ lũy thừa liên tiếp của $2001$; đó là các "thỏ".

**Bước 2.** Chứng minh mọi lũy thừa của $2001$ không chia hết cho $10^4$ vì chúng là số lẻ, nên số dư chỉ nằm trong $9999$ giá trị $1,2,\ldots,9999$; đó là các "lồng".

**Bước 3.** Áp dụng nguyên lí Đi-rích-lê để có hai lũy thừa cùng số dư, rồi kết luận bốn chữ số tận cùng bằng nhau.

**Phần 2. Trình bày**

Xét $10^4$ số $2001^1,2001^2,\ldots,2001^{10^4}$ (thỏ). Các số này đều lẻ nên không chia hết cho $10^4$, do đó số dư khi chia cho $10^4$ của mỗi số nằm trong tập $\{1;2;\ldots;9999\}$ gồm $9999$ giá trị (lồng).

Vì $10^4>9999$ nên theo nguyên lí Đi-rích-lê có hai số $2001^p$ và $2001^q$ ($p\ne q$) cùng số dư khi chia cho $10^4$, suy ra $2001^p-2001^q\vdots10^4$.

Hai số $2001^p$ và $2001^q$ đều có ít nhất bốn chữ số (vì $2001^m\ge2001$) và hiệu chia hết cho $10^4$ nên bốn chữ số tận cùng của chúng bằng nhau.

Vậy có hai lũy thừa của $2001$ có bốn chữ số tận cùng bằng nhau.

=== T7B.55@p159
- bai: 55 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · số dư khi chia cho 10^4 · hai số nguyên tố cùng nhau
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ ghi hướng; bổ sung bước loại dư 0 như bài trước. Thỏ = 10^4 lũy thừa 3^1…3^(10^4), lồng = 9999 số dư khác 0. Máy tìm được số mũ nhỏ nhất n=500 thỏa 3^n ≡ 1 (mod 10^4).
## DE
Chứng minh rằng tồn tại một lũy thừa của $3$ mà bốn chữ số tận cùng của nó là $0001$.
## SACH
Ta cần chứng minh tồn tại $n\in\mathbb{N}^*$ sao cho $3^n-1\vdots10^4$.

Xét $10^4$ số $3^1,3^2,\ldots,3^{10^4}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Bốn chữ số tận cùng là $0001$" tương đương $3^n-1\vdots10^4$; tạo ra hiệu của hai lũy thừa cùng số dư bằng nguyên lí Đi-rích-lê, rồi dùng $3$ nguyên tố cùng nhau với $10$ để đưa về $3^n-1$.

**Bước 1.** Đổi yêu cầu thành tồn tại số mũ $n\ge1$ sao cho $3^n-1$ chia hết cho $10^4$ và lập $10^4$ lũy thừa liên tiếp của $3$ làm các "thỏ".

**Bước 2.** Chứng tỏ các số dư khi chia cho $10^4$ đều khác $0$ vì lũy thừa của $3$ lẻ, nên chỉ có $9999$ "lồng".

**Bước 3.** Lấy hai lũy thừa cùng số dư rồi đặt $3^q$ làm nhân tử chung của hiệu, bỏ $3^q$ nhờ nguyên tố cùng nhau với $10^4$.

**Phần 2. Trình bày**

Xét $10^4$ số $3^1,3^2,\ldots,3^{10^4}$ (thỏ). Các số này lẻ nên không chia hết cho $10^4$, số dư khi chia cho $10^4$ thuộc $\{1;2;\ldots;9999\}$ gồm $9999$ giá trị (lồng).

Vì $10^4>9999$ nên có hai số $3^p$ và $3^q$ với $p>q\ge1$ cùng số dư, suy ra $3^p-3^q=3^q(3^{p-q}-1)\vdots10^4$.

Vì $\gcd(3^q,10^4)=1$ nên $3^{p-q}-1\vdots10^4$.

Đặt $n=p-q\ge1$, ta có $3^n-1\vdots10^4$ và $3^n-1>0$ nên $3^n$ có tận cùng là $0001$ (bốn chữ số tận cùng của $3^n-1$ là $0000$).

Vậy tồn tại một lũy thừa của $3$ có bốn chữ số tận cùng là $0001$.

=== T7B.56@p159
- bai: 56 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · các tổng liên tiếp S_k · hiệu hai tổng
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách chỉ ghi cách lập 2001 tổng S_1..S_2001, không nêu lồng; lời giải kho tự hoàn chỉnh (xét riêng trường hợp có tổng chia hết cho 2001 để còn 2000 lồng). Hiểu "số" là số nguyên.
## DE
Cho $2001$ số tùy ý. Chứng minh rằng có thể chọn được một số hoặc một số số nào đó mà tổng của chúng chia hết cho $2001$.
## SACH
Gọi $2001$ số đã cho là $a_1,a_2,\ldots,a_{2001}$. Xét $2001$ tổng sau:

$S_1=a_1$; $S_2=a_1+a_2$ $\ldots$.

$S_{2001}=a_1+a_2+\ldots+a_{2001}$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Tổng của một số số chia hết cho $2001$" gợi ngay số dư khi chia cho $2001$; lập các tổng dồn $S_1,S_2,\ldots,S_{2001}$ để hiệu hai tổng bất kì là tổng của một đoạn liên tiếp các số đã cho.

**Bước 1.** Lập $2001$ tổng dồn $S_k=a_1+a_2+\ldots+a_k$ với $k=1,\ldots,2001$; đây là $2001$ "thỏ".

**Bước 2.** Xét trước trường hợp có một tổng $S_k$ đã chia hết cho $2001$ thì xong; nếu không thì mọi số dư đều khác $0$ nên chỉ có $2000$ "lồng".

**Bước 3.** Áp dụng nguyên lí Đi-rích-lê để có hai tổng cùng số dư, rồi lấy hiệu để thu được tổng cần tìm.

**Phần 2. Trình bày**

Đặt $S_k=a_1+a_2+\ldots+a_k$ với $k=1,2,\ldots,2001$.

Trường hợp 1: có $S_k\vdots2001$. Khi đó các số $a_1,\ldots,a_k$ có tổng chia hết cho $2001$.

Trường hợp 2: mọi $S_k$ đều không chia hết cho $2001$. Khi đó số dư của $2001$ tổng $S_k$ khi chia cho $2001$ thuộc $\{1;2;\ldots;2000\}$ gồm $2000$ giá trị (lồng), còn có $2001$ tổng (thỏ). Theo nguyên lí Đi-rích-lê có hai tổng $S_i$ và $S_j$ ($1\le i<j\le2001$) cùng số dư.

Khi đó $S_j-S_i=a_{i+1}+a_{i+2}+\ldots+a_j\vdots2001$, tức tổng của các số $a_{i+1},\ldots,a_j$ chia hết cho $2001$.

Vậy trong cả hai trường hợp luôn chọn được một số hoặc một số số mà tổng chia hết cho $2001$.

=== T7B.57@p159
- bai: 57 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · số dư khi chia cho 7 · 1001 = 7·11·13
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Thỏ = 8 số đã cho, lồng = 7 số dư khi chia cho 7.
## DE
Chứng minh rằng trong tám số tự nhiên, mỗi số có ba chữ số, bao giờ cũng có thể chọn được hai số mà khi viết liền nhau ta thu được một số có sáu chữ số và chia hết cho $7$.
## SACH
Trong $8$ số đã cho tồn tại hai số $A$ và $B$ sao cho $A\equiv B\pmod{7}$ đó.

Khi đó, số $C=\overline{AB}=1000A+B=1001A+(B-A)$ chia hết cho $7$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Viết liền hai số ba chữ số $A$ và $B$ được $1000A+B$; có $8$ số mà chỉ có $7$ số dư khi chia cho $7$ nên hai số cùng số dư (nguyên lí Đi-rích-lê), và $1001$ chia hết cho $7$ làm cho tổng chia hết.

**Bước 1.** Coi $8$ số đã cho là $8$ "thỏ" và $7$ số dư khi chia cho $7$ là $7$ "lồng" để chọn được hai số $A$, $B$ cùng số dư.

**Bước 2.** Biểu diễn số viết liền $\overline{AB}$ bằng $1000A+B$ và nêu rõ nó có sáu chữ số.

**Bước 3.** Tách $\overline{AB}=1001A+(B-A)$ rồi dùng $1001\vdots7$ và $B-A\vdots7$ để kết luận.

**Phần 2. Trình bày**

Khi chia cho $7$, số dư thuộc $\{0;1;\ldots;6\}$ gồm $7$ giá trị (lồng). Có $8$ số đã cho (thỏ), nên theo nguyên lí Đi-rích-lê có hai số $A$ và $B$ cùng số dư khi chia cho $7$, tức $A\equiv B\pmod{7}$, suy ra $B-A\vdots7$.

Vì $A$, $B$ đều có ba chữ số nên khi viết $B$ liền sau $A$ ta được số $C=\overline{AB}$ có sáu chữ số và $C=1000A+B$.

$C=1001A+(B-A)$, mà $1001=7\cdot143\vdots7$ và $B-A\vdots7$.

Vậy $C\vdots7$.

=== T7B.58@p159
- bai: 58 · y: - · trang: 159 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T000000
- cong_cu: Đi-rích-lê (nguyên lí chuồng thỏ) · ước nguyên tố nhỏ nhất của một số · ước chung lớn nhất
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách in "từ 1 đến 100 có 26 số nguyên tố", nhưng máy đếm được 25 số nguyên tố nhỏ hơn 100; sách cũng không xét trường hợp số 1 (không có ước nguyên tố). Lời giải kho dùng 25 lồng và xử lí riêng số 1. Hiểu "số nguyên" là số nguyên dương.
## DE
Chứng minh rằng trong $27$ số nguyên khác nhau tùy ý nhỏ hơn $100$ có thể chọn được hai số có ước số chung lớn nhất khác $1$.
## SACH
Từ $1$ đến $100$ có tất cả $26$ số nguyên tố. Khi phân tích $27$ số đã cho ra thừa số nguyên tố có ít nhất hai số cùng chứa một thừa số nguyên tố nào đó. Hai số này có ước chung lớn nhất khác $1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** "Ước chung lớn nhất khác $1$" nghĩa là hai số có chung một ước nguyên tố; mỗi số lớn hơn $1$ có một ước nguyên tố nhỏ nhất, mà các số nguyên tố nhỏ hơn $100$ chỉ có $25$ số, ít hơn số các số đã cho nên hai số trùng ước nguyên tố nhỏ nhất.

**Bước 1.** Liệt kê và đếm các số nguyên tố nhỏ hơn $100$ để biết số "lồng" (mỗi số nguyên tố là một lồng).

**Bước 2.** Xếp mỗi số lớn hơn $1$ trong các số đã cho vào "lồng" là ước nguyên tố nhỏ nhất của nó; số $1$ không có ước nguyên tố nên phải xét riêng.

**Bước 3.** Đếm số "thỏ" sau khi đã loại số $1$ (nếu có), so với số lồng để dùng nguyên lí Đi-rích-lê, rồi kết luận hai số trong cùng một lồng có ước chung lớn hơn $1$.

**Chú ý:** Đừng quên trường hợp số $1$ nằm trong $27$ số: khi đó còn lại $26$ số, vẫn nhiều hơn số lồng nên kết luận không đổi.

**Phần 2. Trình bày**

Hiểu $27$ số đã cho là các số nguyên dương khác nhau, nhỏ hơn $100$.

Các số nguyên tố nhỏ hơn $100$ là $2,3,5,7,11,13,17,19,23,29,31,37,41,43,47,53,59,61,67,71,73,79,83,89,97$, gồm $25$ số (lồng).

Trong $27$ số đã cho có nhiều nhất một số bằng $1$, nên có ít nhất $26$ số lớn hơn $1$ (thỏ).

Mỗi số lớn hơn $1$ có ước nguyên tố nhỏ nhất, là một trong $25$ số nguyên tố trên. Vì $26>25$ nên theo nguyên lí Đi-rích-lê có hai số $x\ne y$ cùng có ước nguyên tố nhỏ nhất là $p$.

Khi đó $p$ là ước chung của $x$ và $y$, nên $\gcd(x,y)\ge p\ge2$, tức $\gcd(x,y)\ne1$.

Vậy trong $27$ số đã cho luôn chọn được hai số có ước chung lớn nhất khác $1$.

