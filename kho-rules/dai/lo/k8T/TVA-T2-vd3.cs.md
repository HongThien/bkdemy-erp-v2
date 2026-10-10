=== T2V6.1@p28
- bai: 1 · y: - · trang: 28 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T020102
- cong_cu: nhẩm nghiệm · tách hạng tử · đưa phương trình về dạng tích
- kiem: nghiem | 2x^3+7x^2+7x+2 = 0 | x
- ket_qua_sach: -1; -2; -\dfrac{1}{2}
- dap_an: $S=\{-1;-2;-\dfrac{1}{2}\}$
- ghi_chu_nghi: sách không đánh số ví dụ này (Dạng 6 chỉ in nhãn "Ví dụ" không kèm số); đánh số 1. Sách chỉ ghi kết quả phân tích, không có các bước biến đổi.
## DE
Giải phương trình: $2x^3+7x^2+7x+2=0$.
## SACH
Biến đổi phương trình thành: $(x+1)(x+2)(2x+1)=0$.
Phương trình có ba nghiệm: $x_1=-1$; $x_2=-2$; $x_3=-\dfrac{1}{2}$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế trái là đa thức bậc ba, muốn giải phải đưa về tích các nhân tử bậc nhất; tổng các hệ số của lũy thừa bậc chẵn ($2+7$) bằng tổng các hệ số của lũy thừa bậc lẻ ($7+2$) gợi ra ngay nghiệm $x=-1$.

**Bước 1.** Thay $x=-1$ vào vế trái để thấy nó bằng $0$, từ đó biết đa thức có nhân tử $x+1$.

**Bước 2.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chứa $x+1$, rồi đặt $x+1$ làm nhân tử chung.

**Bước 3.** Phân tích tiếp tam thức bậc hai còn lại bằng cách tách hạng tử bậc nhất để đưa phương trình về dạng tích.

**Bước 4.** Cho từng nhân tử bằng $0$ rồi giải ba phương trình bậc nhất để lấy các nghiệm.

**Chú ý:** Phải phân tích đến khi các nhân tử đều là nhị thức bậc nhất thì mới đọc được hết nghiệm, không được dừng ở tích của một nhị thức với tam thức bậc hai.

**Phần 2. Trình bày**

$2x^3+7x^2+7x+2=0$

$\Leftrightarrow 2x^3+2x^2+5x^2+5x+2x+2=0$

$\Leftrightarrow 2x^2(x+1)+5x(x+1)+2(x+1)=0$

$\Leftrightarrow (x+1)(2x^2+5x+2)=0$

$\Leftrightarrow (x+1)(2x^2+4x+x+2)=0$

$\Leftrightarrow (x+1)(x+2)(2x+1)=0$

$\Leftrightarrow x+1=0$ hoặc $x+2=0$ hoặc $2x+1=0$.

Vậy $S=\{-1;-2;-\dfrac{1}{2}\}$.

=== T2V7.1@p28
- bai: 1 · y: - · trang: 28 · tang: nang_cao
- nguon_de: Đề thi vào chuyên toán miền Bắc, 1979
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: thêm bớt hạng tử · hằng đẳng thức hiệu hai bình phương · bất đẳng thức tam giác
- kiem: khong
- ket_qua_sach: A=(a+b+c)(a+b-c)(c-a+b)(c+a-b)
- dap_an: $A=(a+b+c)(a+b-c)(c-a+b)(c+a-b)$
- ghi_chu_nghi: sách không đánh số ví dụ đầu của Dạng 7 (in nhãn "Ví dụ:"); đánh số 1 theo thứ tự (ví dụ kế tiếp in "Ví dụ 2"). Đề in ở cuối p-028, lời giải sang p-029. Ảnh p-028: chữ đầu dòng "Chứng minh rằng nếu…" bị logo che một phần, đọc theo ngữ cảnh. Nhóm: vừa phân tích nhân tử đa thức nhiều biến (T18T010204) vừa chứng minh bất đẳng thức ba cạnh tam giác; chọn T18T030101 theo luật bất đẳng thức chứng minh bằng phân tích nhân tử.
## DE
(Đề thi vào chuyên toán miền Bắc, 1979) Phân tích thành thừa số: $A=2a^2b^2+2b^2c^2+2a^2c^2-a^4-b^4-c^4$.

Chứng minh rằng nếu $a,b,c$ là ba cạnh của tam giác thì $A>0$.
## SACH
Thêm bớt các hạng tử thích hợp và nhóm các hạng tử:
$A=4a^2b^2-(a^4+2a^2b^2+b^4)+(2b^2c^2+2a^2c^2)-c^4$
$=(2ab)^2-[(a^2+b^2)^2-2c^2(a^2+b^2)+c^4]=(2ab)^2-[(a^2+b^2)-c^2]^2$
$=(2ab+a^2+b^2-c^2)(2ab-a^2-b^2+c^2)$
$=(a+b+c)(a+b-c)(c-a+b)(c+a-b)$
Nếu $a,b,c$ là các cạnh của tam giác thì $a>0$, $b>0$, $c>0$ và các nhân tử của biểu thức đều dương (theo các bất đẳng thức về các cạnh trong tam giác) nên $A>0$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức chỉ có số mũ chẵn và ba hạng tử $-a^4$, $-b^4$, $-c^4$ gợi ra bình phương của tam thức $a^2+b^2-c^2$ mang dấu trừ; bù thêm $4a^2b^2$ thì được hiệu hai bình phương.

**Bước 1.** Tách $2a^2b^2$ thành $4a^2b^2-2a^2b^2$ rồi gom các hạng tử còn lại thành một bình phương của tam thức $a^2+b^2-c^2$, để biểu thức có dạng $(2ab)^2-(a^2+b^2-c^2)^2$.

**Bước 2.** Áp dụng hằng đẳng thức hiệu hai bình phương, rồi nhận ra mỗi thừa số mới lại là hiệu của hai bình phương nên phân tích tiếp được.

**Bước 3.** Với $a,b,c$ là ba cạnh của một tam giác, dùng bất đẳng thức tam giác để chứng tỏ cả bốn nhân tử đều dương, từ đó suy ra dấu của $A$.

**Chú ý:** Nhân tử $a+b-c$, $c-a+b$, $c+a-b$ dương chính là ba bất đẳng thức tam giác; thiếu điều kiện "ba cạnh của tam giác" thì không kết luận được dấu của $A$.

**Phần 2. Trình bày**

$A=2a^2b^2+2b^2c^2+2a^2c^2-a^4-b^4-c^4$

$=4a^2b^2-(a^4+b^4+c^4+2a^2b^2-2a^2c^2-2b^2c^2)$

$=(2ab)^2-(a^2+b^2-c^2)^2$

$=(2ab+a^2+b^2-c^2)(2ab-a^2-b^2+c^2)$

$=[(a+b)^2-c^2][c^2-(a-b)^2]$

$=(a+b+c)(a+b-c)(c-a+b)(c+a-b)$.

Nếu $a,b,c$ là ba cạnh của một tam giác thì $a+b+c>0$ và theo bất đẳng thức tam giác $a+b-c>0$, $c-a+b>0$, $c+a-b>0$.

Vậy $A>0$ (tích của bốn số dương).

=== T2V7.2@p29
- bai: 2 · y: - · trang: 29 · tang: nang_cao
- nguon_de: Đề thi vô địch toán Úc, 1971
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: xét hiệu · giả sử thứ tự các biến · nhóm hạng tử
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi:
## DE
(Đề thi vô địch toán Úc, 1971) Chứng minh rằng với mọi số dương $a,b,c$ ta có: $a^2(b+c-a)+b^2(a+c-b)+c^2(a+b-c)\leq 3abc$.
## SACH
Vì vai trò của $a,b,c$ là như nhau, nên có thể giả thiết: $a\geq b\geq c>0$.
Có thể thấy rằng phải chứng minh: $B\geq 0$, với
$B=3abc+a^3+b^3+c^3-a^2b-b^2a-a^2c-b^2c-c^2a-c^2b$
$=a^2(a-b)+b^2(b-a)+c(2ab-a^2-b^2)+c(c^2-bc-ac+ab)$
$=(a-b)(a^2-b^2)-c(a-b)^2+c(c-a)(c-b)$
$=(a-b)^2(a+b-c)+c(b-c)(a-c)$
Vậy $B=(a-b)^2(a+b-c)+c(b-c)(a-c)$
Do giả thiết $a\geq b\geq c$, $c>0$, từ đó suy ra điều phải chứng minh.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Bất đẳng thức đối xứng theo ba biến, nên xét hiệu $3abc$ trừ vế trái rồi sắp thứ tự $a\geq b\geq c$; khi đó hiệu viết được thành tổng các tích của những nhân tử không âm.

**Bước 1.** Chuyển vế để xét hiệu $B$ giữa $3abc$ và vế trái, khai triển các tích thành đa thức rồi chỉ cần chứng minh $B\geq 0$.

**Bước 2.** Vì biểu thức không đổi khi hoán đổi các biến nên giả sử $a\geq b\geq c>0$ mà không mất tổng quát.

**Bước 3.** Nhóm các hạng tử của $B$ theo từng cặp để lần lượt xuất hiện các nhân tử $a-b$, $b-c$, $a-c$, đưa $B$ về dạng tổng hai tích.

**Bước 4.** Xét dấu từng nhân tử dưới giả thiết thứ tự rồi kết luận $B\geq 0$.

**Chú ý:** Muốn dùng giả thiết $a\geq b\geq c$ thì phải nói rõ vì sao được giả sử như vậy (vai trò ba biến như nhau); dấu bằng xảy ra khi $a=b=c$.

**Phần 2. Trình bày**

Vì vai trò của $a,b,c$ như nhau nên không mất tổng quát, giả sử $a\geq b\geq c>0$.

Xét $B=3abc-[a^2(b+c-a)+b^2(a+c-b)+c^2(a+b-c)]$

$=3abc+a^3+b^3+c^3-a^2b-ab^2-a^2c-b^2c-ac^2-bc^2$

$=a^2(a-b)+b^2(b-a)+c(2ab-a^2-b^2)+c(c^2-ac-bc+ab)$

$=(a-b)(a^2-b^2)-c(a-b)^2+c(c-a)(c-b)$

$=(a-b)^2(a+b-c)+c(a-c)(b-c)$.

Do $a\geq b\geq c>0$ nên $(a-b)^2\geq 0$, $a+b-c>0$, $c>0$, $a-c\geq 0$, $b-c\geq 0$; suy ra $B\geq 0$.

Vậy $a^2(b+c-a)+b^2(a+c-b)+c^2(a+b-c)\leq 3abc$, dấu bằng xảy ra khi $a=b=c$.

=== T2V7.3@p29
- bai: 3 · y: - · trang: 29 · tang: nang_cao
- nguon_de: Đề thi vào lớp chuyên toán miền Bắc, 1975
- muc_loi_giai_sach: du
- nhom: T18T040101
- cong_cu: định lí Bê-du · nhẩm nghiệm · tách hạng tử · tích hai số nguyên liên tiếp
- kiem: khong
- ket_qua_sach: A=(a-1)(a-2)(a^2-3a+16)
- dap_an: $A=(a-1)(a-2)(a^2-3a+16)$
- ghi_chu_nghi: Giữ cả bài thành một câu vì ý b) dùng kết quả ý a). Ảnh p-029: dòng kết quả ý a) in "…-54a+3a=(a-1)(a-2)(a^2-3a+16)", thiếu chữ số 2 (đúng phải là +32, đề ghi +32 và khai triển ra +32); logo che chữ "và" trong "n-2 và n-1". Nhóm: ý a) là phân tích bậc bốn (T18T010203), ý b) là chứng minh chia hết cho 2; chọn T18T040101 theo mục tiêu của bài.
## DE
(Đề thi vào lớp chuyên toán miền Bắc, 1975) a) Phân tích ra thừa số: $A=a^4-6a^3+27a^2-54a+32$.

b) Từ kết quả câu trên suy ra rằng biểu thức $n^4-6n^3+27n^2-54n+32$ luôn luôn là số chẵn với mọi số nguyên $n$.
## SACH
a) Ta có: $a=1\Rightarrow A=0\Rightarrow A\vdots(a-1)$
$a=2\Rightarrow A=0\Rightarrow A\vdots(a-2)$. Vậy $A\vdots(a-1)(a-2)$
Thực hiện phép chia $A$ cho $(a-1)(a-2)$ ta có kết quả:
$A=a^4-6a^3+27a^2-54a+3a=(a-1)(a-2)(a^2-3a+16)$
Chú ý: Có thể phân tích theo phương pháp nhóm số hạng và sử dụng các hằng đẳng thức.
b) Theo kết quả phần a), ta có:
$n^4-6n^3+27n^2-54n+32=(n-2)(n-1)(n^2-3n+16)$
$n-2$ và $n-1$ là hai số nguyên liên tiếp, chắc chắn phải có một số chia hết cho $2$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc bốn không có nhân tử chung và không là hằng đẳng thức, nhưng có nghiệm nguyên nhỏ nên nhẩm nghiệm để biết trước nhân tử; ý b) chẵn lẻ nhờ tích có hai số nguyên liên tiếp.

**Bước 1.** Thay $a=1$ và $a=2$ vào $A$ để thấy cả hai đều là nghiệm, nên $A$ chia hết cho $a-1$ và $a-2$ (hệ quả định lí Bê-du), do đó chia hết cho tích $a^2-3a+2$.

**Bước 2.** Tách các hạng tử của $A$ thành ba nhóm, mỗi nhóm là bội của $a^2-3a+2$, rồi đặt nhân tử chung để tìm nhân tử còn lại.

**Bước 3.** Thay $a$ bằng số nguyên $n$ vào kết quả ý a), chỉ ra hai nhân tử đầu là hai số nguyên liên tiếp nên tích của chúng chia hết cho $2$.

**Bước 4.** Nhân tử thứ ba là số nguyên, nên cả tích vẫn chia hết cho $2$.

**Chú ý:** Thừa số $a^2-3a+16=\left(a-\dfrac{3}{2}\right)^2+\dfrac{55}{4}>0$ không còn phân tích tiếp được; ý a) cũng làm được bằng cách nhóm số hạng và dùng hằng đẳng thức.

**Phần 2. Trình bày**

a) Với $a=1$: $A=1-6+27-54+32=0$; với $a=2$: $A=16-48+108-108+32=0$.

Do đó $A$ chia hết cho $a-1$ và $a-2$, suy ra $A$ chia hết cho $(a-1)(a-2)=a^2-3a+2$.

$A=a^4-3a^3+2a^2-3a^3+9a^2-6a+16a^2-48a+32$

$=a^2(a^2-3a+2)-3a(a^2-3a+2)+16(a^2-3a+2)$

$=(a^2-3a+2)(a^2-3a+16)$

$=(a-1)(a-2)(a^2-3a+16)$.

b) Theo ý a) với $a=n$:

$n^4-6n^3+27n^2-54n+32=(n-2)(n-1)(n^2-3n+16)$.

Vì $n-2$ và $n-1$ là hai số nguyên liên tiếp nên có một số chia hết cho $2$; mà $n^2-3n+16$ là số nguyên nên tích trên chia hết cho $2$.

Vậy biểu thức luôn luôn là số chẵn với mọi số nguyên $n$.

=== T2V7.4@p30
- bai: 4 · y: - · trang: 30 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: thế biến từ điều kiện · bình phương hai vế
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh p-030: số mũ đầu tiên trong đề "(a'+b²+c²)²" in mờ, đọc là $a^2$ theo ngữ cảnh và theo lời giải.
## DE
Cho biết $a+b+c=0$, chứng minh rằng: $(a^2+b^2+c^2)^2=2(a^4+b^4+c^4)$.
## SACH
$a+b+c=0\Rightarrow a=-(b+c)\Rightarrow a^2-b^2-c^2=2bc$
$\Rightarrow a^4+b^4+c^4=2(a^2b^2+a^2c^2+b^2c^2)$
Cộng $a^4+b^4+c^4$ vào hai vế của đẳng thức cuối này ta được đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Điều kiện $a+b+c=0$ cho phép rút một biến theo hai biến còn lại; bình phương lên thì $a^2-b^2-c^2$ chỉ còn $2bc$, và bình phương tiếp sẽ ra hệ thức giữa các hạng tử bậc bốn.

**Bước 1.** Rút $a=-(b+c)$ rồi bình phương hai vế để được một hệ thức bậc hai gọn giữa $a^2$, $b^2$, $c^2$ và $bc$.

**Bước 2.** Bình phương hai vế của hệ thức đó để xuất hiện $a^4+b^4+c^4$ cùng các tích $a^2b^2$, $a^2c^2$, $b^2c^2$.

**Bước 3.** Rút gọn để biểu diễn $a^4+b^4+c^4$ qua các tích $a^2b^2$, $a^2c^2$, $b^2c^2$, rồi cộng thêm $a^4+b^4+c^4$ vào hai vế để so với đề.

**Chú ý:** Vế trái của đề khai triển ra $a^4+b^4+c^4+2(a^2b^2+a^2c^2+b^2c^2)$, nên biểu thức cần cộng vào hai vế chính là $a^4+b^4+c^4$.

**Phần 2. Trình bày**

Từ $a+b+c=0$ ta có $a=-(b+c)$, suy ra $a^2=b^2+2bc+c^2$, tức là $a^2-b^2-c^2=2bc$.

Bình phương hai vế: $a^4+b^4+c^4-2a^2b^2-2a^2c^2+2b^2c^2=4b^2c^2$

$\Rightarrow a^4+b^4+c^4=2(a^2b^2+a^2c^2+b^2c^2)$.

Cộng $a^4+b^4+c^4$ vào hai vế:

$2(a^4+b^4+c^4)=a^4+b^4+c^4+2(a^2b^2+a^2c^2+b^2c^2)=(a^2+b^2+c^2)^2$.

Vậy $(a^2+b^2+c^2)^2=2(a^4+b^4+c^4)$.

=== T2V7.5@p30
- bai: 5 · y: - · trang: 30 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: hằng đẳng thức $a^3+b^3+c^3-3abc$ · tích bằng $0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh; đảo lại: không nhất thiết — từ (2) chỉ suy ra $a+b+c=0$ hoặc $a=b=c$
- ghi_chu_nghi: Giữ thành một câu: ý "đảo lại" dựa vào hằng đẳng thức đã dùng ở chiều thuận. Lời giải sách mở đầu bằng "Trong bài trên, ta đã chứng minh rằng…" (viện dẫn bài trước); lời giải kho tự nêu hằng đẳng thức. Kết luận của ý đảo: không nhất thiết có (1), chỉ suy ra (1) hoặc $a=b=c$.
## DE
Chứng minh rằng nếu $a+b+c=0$ (1) thì $a^3+b^3+c^3=3abc$ (2).

Đảo lại, nếu có (2) thì có (1) không?
## SACH
Trong bài trên, ta đã chứng minh rằng:
$a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-ac-bc)$
Do đó, nếu có (1) thì $a^3+b^3+c^3-3abc=0$, tức (2). Đảo lại, khi có (2) thì ta có: $a+b+c=0$ (1) hoặc $a^2+b^2+c^2-ab-ac-bc=0$ (3). Từ (3) ta có $a=b=c$ (4). Vậy nếu có (2) thì suy ra $a+b+c=0$ hoặc $a=b=c$, nghĩa là: $(2)\Rightarrow(1)$ hoặc $(2)\Rightarrow(4)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hằng đẳng thức $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ biến cả hai chiều của bài toán thành việc xét một tích bằng $0$.

**Bước 1.** Nêu hằng đẳng thức mở rộng nói trên làm công cụ chung cho cả hai chiều.

**Bước 2.** Chiều thuận: thay điều kiện $a+b+c=0$ vào thì vế phải của hằng đẳng thức bằng $0$, từ đó suy ra (2).

**Bước 3.** Chiều đảo: từ (2) suy ra tích bằng $0$, nên một trong hai nhân tử bằng $0$; xét nhân tử thứ hai bằng $0$ bằng cách nhân đôi rồi gom thành tổng các bình phương.

**Bước 4.** Kết luận chỉ suy ra được $a+b+c=0$ hoặc $a=b=c$, và nêu một ví dụ cụ thể cho thấy (2) không kéo theo (1).

**Chú ý:** Hằng đẳng thức trên kiểm tra được bằng cách khai triển vế phải; bài đảo trả lời là "không nhất thiết", vì $a=b=c\neq 0$ vẫn thỏa (2).

**Phần 2. Trình bày**

Ta có hằng đẳng thức: $a^3+b^3+c^3-3abc=(a+b+c)(a^2+b^2+c^2-ab-bc-ca)$ (*).

Nếu $a+b+c=0$ thì vế phải của (*) bằng $0$, nên $a^3+b^3+c^3-3abc=0$, tức là $a^3+b^3+c^3=3abc$.

Đảo lại, nếu $a^3+b^3+c^3=3abc$ thì theo (*): $(a+b+c)(a^2+b^2+c^2-ab-bc-ca)=0$, do đó $a+b+c=0$ hoặc $a^2+b^2+c^2-ab-bc-ca=0$.

Với $a^2+b^2+c^2-ab-bc-ca=0$, nhân hai vế với $2$ ta được $(a-b)^2+(b-c)^2+(c-a)^2=0$, suy ra $a-b=b-c=c-a=0$, tức là $a=b=c$.

Vậy nếu có (2) thì $a+b+c=0$ hoặc $a=b=c$; không phải lúc nào cũng có (1), chẳng hạn $a=b=c=1$ thì $a^3+b^3+c^3=3=3abc$ nhưng $a+b+c=3\neq 0$.

=== T2V7.6a@p30
- bai: 6 · y: a · trang: 30 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: bình phương một tổng ba số · tổng các bình phương bằng $0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Nhóm: đưa về tổng các bình phương bằng $0$ (T18T010102); cũng có thể xếp T18T010302 (từ điều kiện suy ra hệ thức giữa các chữ).
## DE
Chứng minh rằng từ đẳng thức: $(x-y)^2+(y-z)^2+(z-x)^2=(x+y-2z)^2+(y+z-2x)^2+(z+x-2y)^2$ ta suy ra $x=y=z$.
## SACH
Áp dụng hằng đẳng thức về bình phương đa thức, ta đưa vế phải về: $3[(x-y)^2+(y-z)^2+(z-x)^2]$. Từ đây suy ra: $(x-y)^2+(y-z)^2+(z-x)^2=0$. Điều này xảy ra khi và chỉ khi: $x-y=y-z=z-x=0$ tức $x=y=z$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Vế phải khai triển ra đúng $3$ lần vế trái nên đẳng thức chỉ còn tổng các bình phương bằng $0$, mà tổng bình phương chỉ bằng $0$ khi từng bình phương bằng $0$.

**Bước 1.** Khai triển ba bình phương ở vế phải rồi cộng theo từng loại hạng tử ($x^2$, $y^2$, $z^2$, $xy$, $yz$, $zx$) để đưa về một biểu thức gọn.

**Bước 2.** Nhận ra biểu thức đó gấp $3$ lần vế trái, rồi đặt vế trái là $S$ để đẳng thức trở thành một phương trình đơn giản theo $S$.

**Bước 3.** Suy ra $S=0$, mỗi bình phương không âm nên cả ba bình phương phải bằng $0$, từ đó có $x=y=z$.

**Chú ý:** Có thể gọn hơn bằng cách đặt $p=x-y$, $q=y-z$, $r=z-x$ với $p+q+r=0$; nhưng khai triển trực tiếp như trên là cách ít phải nhớ nhất.

**Phần 2. Trình bày**

Cộng ba bình phương ở vế phải: hệ số của $x^2$ là $1+4+1=6$, hệ số của $xy$ là $2-4-4=-6$, và tương tự với $y^2$, $z^2$, $yz$, $zx$. Do đó

$(x+y-2z)^2+(y+z-2x)^2+(z+x-2y)^2=6(x^2+y^2+z^2-xy-yz-zx)$

$=3[(x-y)^2+(y-z)^2+(z-x)^2]$.

Đặt $S=(x-y)^2+(y-z)^2+(z-x)^2$ thì đẳng thức đã cho trở thành $S=3S$, suy ra $S=0$.

Vì $(x-y)^2\geq 0$, $(y-z)^2\geq 0$, $(z-x)^2\geq 0$ nên $x-y=y-z=z-x=0$.

Vậy $x=y=z$.

=== T2V7.6b@p30
- bai: 6 · y: b · trang: 30 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010102
- cong_cu: tổng các bình phương bằng $0$
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Nhóm: đưa về tổng các bình phương bằng $0$ (T18T010102); cũng có thể xếp T18T010302. Ảnh p-030: logo che một phần chữ "Điều này xảy ra…" ở dòng cuối ý b), đọc theo ngữ cảnh.
## DE
Chứng minh rằng nếu $a^2+b^2+c^2=ab+bc+ac$ thì $a=b=c$.
## SACH
Theo giả thiết: $a^2+b^2+c^2=ab+bc+ac$
Ta có: $a^2+b^2+c^2-ab-ac-bc=0$
Suy ra: $(a^2-2ab+b^2)+(b^2-2bc+c^2)+(a^2-2ac+c^2)=0$
$(a-b)^2+(b-c)^2+(a-c)^2=0$.
Điều này xảy ra khi và chỉ khi $a-b=b-c=a-c=0$, tức là $a=b=c$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Chuyển vế rồi nhân đôi thì vế trái là tổng của ba bình phương $(a-b)^2$, $(b-c)^2$, $(c-a)^2$, mà tổng này bằng $0$ chỉ khi cả ba bằng $0$.

**Bước 1.** Chuyển tất cả hạng tử sang một vế và nhân hai vế với $2$ để mọi hệ số của các tích $ab$, $bc$, $ca$ thành $-2$.

**Bước 2.** Tách $2a^2$, $2b^2$, $2c^2$ mỗi cái thành hai phần để gom thành ba hằng đẳng thức bình phương của một hiệu.

**Bước 3.** Dùng tính chất bình phương không âm để kết luận từng hiệu bằng $0$, từ đó có $a=b=c$.

**Chú ý:** Không được suy $a-b=0$ chỉ từ một đẳng thức tổng; phải nói rõ tổng ba số không âm bằng $0$ thì từng số bằng $0$.

**Phần 2. Trình bày**

$a^2+b^2+c^2=ab+bc+ca$

$\Rightarrow 2a^2+2b^2+2c^2-2ab-2bc-2ca=0$

$\Rightarrow (a^2-2ab+b^2)+(b^2-2bc+c^2)+(c^2-2ca+a^2)=0$

$\Rightarrow (a-b)^2+(b-c)^2+(c-a)^2=0$.

Vì mỗi bình phương đều không âm nên $a-b=b-c=c-a=0$.

Vậy $a=b=c$.

=== T2V7.7a@p31
- bai: 7 · y: a · trang: 31 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010301
- cong_cu: nhóm hạng tử · đặt nhân tử chung · thay giá trị từ điều kiện
- kiem: khong
- ket_qua_sach: P=abc
- dap_an: $P=abc$
- ghi_chu_nghi: Đề sách không ghi "theo $a,b,c$"; đáp số của sách là $P=abc$ (ở dòng cuối lời giải sách in "=abc").
## DE
$x,y,z$ liên hệ với nhau bởi các đẳng thức: $x^2-y=a$; $y^2-z=b$; $z^2-x=c$. Tính giá trị của biểu thức: $P=x^3(z-y^2)+y^3(x-z^2)+z^3(y-x^2)+xyz(xyz-1)$.
## SACH
Phân tích $P$ thành nhân tử:
$P=x^3(z-y^2)+y^3(x-z^2)+z^3(y-x^2)+x^2y^2z^2-xyz$.
$=y^2z^2(x^2-y)-z^3(x^2-y)-xy^2(x^2-y)+xz(x^2-y)$
$=(x^2-y)(y^2z^2-z^3-xy^2+xz)=(x^2-y)[y^2(z^2-x)-z(z^2-x)]$
$=(x^2-y)(z^2-x)(y^2-z)=abc$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Ba đại lượng $x^2-y$, $y^2-z$, $z^2-x$ chính là $a$, $b$, $c$, nên phải phân tích $P$ thành tích của đúng ba nhân tử đó thì mới tính được giá trị theo $a,b,c$.

**Bước 1.** Khai triển $xyz(xyz-1)=x^2y^2z^2-xyz$ để $P$ thành tổng tám hạng tử, rồi tìm cách ghép chúng để mỗi nhóm đều chia hết cho $x^2-y$.

**Bước 2.** Ghép các hạng tử thành bốn nhóm, mỗi nhóm là bội của $x^2-y$, rồi đặt $x^2-y$ làm nhân tử chung.

**Bước 3.** Nhóm các hạng tử còn lại trong ngoặc theo nhân tử $z^2-x$ để xuất hiện nhân tử thứ hai và thứ ba.

**Bước 4.** Thay $x^2-y=a$, $y^2-z=b$, $z^2-x=c$ vào tích đã phân tích để được giá trị của $P$.

**Chú ý:** Trong ngoặc cuối, $y^2z^2-xy^2=y^2(z^2-x)$ và $-z^3+xz=-z(z^2-x)$; dễ nhầm dấu khi đặt nhân tử chung ở nhóm sau.

**Phần 2. Trình bày**

$P=x^3z-x^3y^2+y^3x-y^3z^2+z^3y-z^3x^2+x^2y^2z^2-xyz$

$=y^2z^2(x^2-y)-z^3(x^2-y)-xy^2(x^2-y)+xz(x^2-y)$

$=(x^2-y)(y^2z^2-z^3-xy^2+xz)$

$=(x^2-y)[y^2(z^2-x)-z(z^2-x)]$

$=(x^2-y)(z^2-x)(y^2-z)$

$=a\cdot c\cdot b=abc$.

Vậy $P=abc$.

=== T2V7.7b@p31
- bai: 7 · y: b · trang: 31 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: tat
- nhom: T18T010302
- cong_cu: thế biến · hằng đẳng thức đáng nhớ
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh p-031: ở đề, chữ "$2c$" trong "$a^3-3ab+2c=0$" mép trang che nửa chữ $c$, đọc theo lời giải ($2(x^3+y^3)$).
## DE
Cho $x+y=a$, $x^2+y^2=b$, $x^3+y^3=c$. Chứng minh rằng $a^3-3ab+2c=0$.
## SACH
Ta có: $A=a^3-3ab+2c=(x+y)^3-3(x+y)(x^2+y^2)+2(x^3+y^3)$
Áp dụng các hằng đẳng thức đáng nhớ, đặt nhân tử chung và rút gọn ta đưa biểu thức về dạng: $A=(x+y)\cdot 0=0$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Cả ba đại lượng $a,b,c$ đều cho theo $x,y$, nên thay vào là mọi thứ chỉ còn hai biến và chỉ việc chứng tỏ biểu thức triệt tiêu.

**Bước 1.** Thay $a=x+y$, $b=x^2+y^2$, $c=x^3+y^3$ vào vế trái cần chứng minh để được một biểu thức chỉ chứa $x$ và $y$.

**Bước 2.** Phân tích $x^3+y^3$ theo hằng đẳng thức tổng hai lập phương để mọi hạng tử đều có nhân tử chung $x+y$, rồi đặt nhân tử chung đó.

**Bước 3.** Khai triển các bình phương trong ngoặc và cộng các hạng tử đồng dạng để thấy ngoặc bằng $0$.

**Chú ý:** Cũng có thể khai triển $(x+y)^3$ rồi gom đồng dạng, kết quả như nhau; nhưng đặt nhân tử chung $x+y$ ít bước hơn.

**Phần 2. Trình bày**

$a^3-3ab+2c=(x+y)^3-3(x+y)(x^2+y^2)+2(x^3+y^3)$

$=(x+y)^3-3(x+y)(x^2+y^2)+2(x+y)(x^2-xy+y^2)$

$=(x+y)[(x+y)^2-3(x^2+y^2)+2(x^2-xy+y^2)]$

$=(x+y)(x^2+2xy+y^2-3x^2-3y^2+2x^2-2xy+2y^2)$

$=(x+y)\cdot 0=0$.

Vậy $a^3-3ab+2c=0$.

=== T2V7.8@p31
- bai: 8 · y: - · trang: 31 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: quy đồng · phân tích nhân tử đa thức nhiều biến
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Lời giải sách ngầm giả sử $a,b,c$ và $a+b+c$ khác $0$ (để các phân số có nghĩa); lời giải kho nêu rõ điều kiện này.
## DE
Chứng minh rằng nếu $a,b,c$ là ba số thỏa mãn hệ thức: $\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=\dfrac{1}{a+b+c}$ thì hai trong ba số đó phải là hai số đối nhau.
## SACH
$\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=\dfrac{1}{a+b+c}\Rightarrow\dfrac{bc+ca+ab}{abc}=\dfrac{1}{a+b+c}$
$\Rightarrow(bc+ca+ab)(a+b+c)=abc\Rightarrow(bc+ca+ab)(a+b+c)-abc=0$
$\Rightarrow(a+b)(b+c)(c+a)=0$
$\Rightarrow a+b=0\ (a=-b)$ hoặc $b+c=0\ (b=-c)$ hoặc $c+a=0\ (c=-a)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Quy đồng và khử mẫu thì điều kiện trở thành $(ab+bc+ca)(a+b+c)-abc=0$, và vế trái phân tích được thành tích ba tổng hai số; tích bằng $0$ cho ra ngay hai số đối nhau.

**Bước 1.** Nêu điều kiện các mẫu khác $0$ rồi quy đồng vế trái, sau đó nhân chéo để bỏ mẫu.

**Bước 2.** Khai triển $(ab+bc+ca)(a+b+c)$ và chuyển $abc$ sang vế trái, được đa thức gồm sáu hạng tử dạng $a^2b$ cộng với $2abc$.

**Bước 3.** Nhận ra đa thức đó chính là khai triển của $(a+b)(b+c)(c+a)$ và viết thành tích.

**Bước 4.** Cho từng nhân tử của tích bằng $0$ để kết luận có hai số đối nhau.

**Chú ý:** Phải ghi điều kiện $a,b,c,a+b+c$ đều khác $0$ ở đầu bài, vì nếu thiếu thì các phân số trong đề không có nghĩa.

**Phần 2. Trình bày**

Vì các mẫu khác $0$ nên:

$\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}=\dfrac{1}{a+b+c}$

$\Rightarrow\dfrac{bc+ca+ab}{abc}=\dfrac{1}{a+b+c}$

$\Rightarrow(ab+bc+ca)(a+b+c)=abc$

$\Rightarrow a^2b+ab^2+b^2c+bc^2+c^2a+ca^2+3abc-abc=0$

$\Rightarrow a^2b+ab^2+b^2c+bc^2+c^2a+ca^2+2abc=0$

$\Rightarrow(a+b)(b+c)(c+a)=0$.

Suy ra $a+b=0$ hoặc $b+c=0$ hoặc $c+a=0$.

Vậy trong ba số $a,b,c$ có hai số đối nhau.

=== T2V7.9a@p31
- bai: 9 · y: a · trang: 31 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: phép chia đa thức · đồng nhất đa thức (dư bằng $0$)
- kiem: khong
- ket_qua_sach: a=-54; b=216; c=-243
- dap_an: $(a;b;c)=(-54;216;-243)$
- ghi_chu_nghi:
## DE
Xác định các giá trị của $a,b$ và $c$ để đa thức $P(x)=x^4+ax^2+bx+c$ chia hết cho $(x-3)^3$.
## SACH
Chia $P(x)$ cho $(x-3)^3$ ta được thương là $x+9$ và dư là
$R(x)=(a+54)x^2+(b-216)x+243+c$.
$P(x)\vdots(x-3)^3\Rightarrow R(x)\equiv 0$. Cho ta:
$a+54=0\Rightarrow a=-54$; $b-216=0\Rightarrow b=216$; $c+243=0\Rightarrow c=-243$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số chia $(x-3)^3$ bậc ba, số bị chia bậc bốn nên thương là nhị thức bậc nhất có hệ số cao nhất bằng $1$; muốn chia hết thì đa thức dư (bậc không quá hai) phải đồng nhất bằng $0$.

**Bước 1.** Khai triển $(x-3)^3$, rồi xác định thương dạng $x+k$ sao cho hệ số của $x^3$ trong tích triệt tiêu, vì $P(x)$ không có hạng tử $x^3$.

**Bước 2.** Nhân số chia với thương vừa tìm, rồi trừ đi từ $P(x)$ để lập đa thức dư theo $a,b,c$.

**Bước 3.** Cho cả ba hệ số của đa thức dư bằng $0$ và giải từng phương trình bậc nhất để tìm $a,b,c$.

**Chú ý:** Đa thức dư có bậc nhỏ hơn bậc số chia ($3$), nên chỉ có tối đa ba hệ số $x^2$, $x$ và hệ số tự do cần bằng $0$.

**Phần 2. Trình bày**

Ta có $(x-3)^3=x^3-9x^2+27x-27$. Khi chia $P(x)$ cho $(x-3)^3$, thương có bậc $1$ và hệ số cao nhất bằng $1$ nên là $x+k$, còn dư $R(x)$ có bậc không quá $2$:

$P(x)=(x-3)^3(x+k)+R(x)$

$(x-3)^3(x+k)=x^4+(k-9)x^3+(27-9k)x^2+(27k-27)x-27k$.

Vì $P(x)$ không có hạng tử $x^3$ và $R(x)$ có bậc không quá $2$ nên $k-9=0$, suy ra $k=9$ và $(x-3)^3(x+9)=x^4-54x^2+216x-243$.

Do đó $R(x)=P(x)-(x-3)^3(x+9)=(a+54)x^2+(b-216)x+(c+243)$.

$P(x)$ chia hết cho $(x-3)^3$ khi và chỉ khi $R(x)\equiv 0$, tức là $a+54=0$, $b-216=0$, $c+243=0$.

Vậy $a=-54$, $b=216$, $c=-243$.

=== T2V7.9b@p31
- bai: 9 · y: b · trang: 31 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: phép chia đa thức · đồng nhất đa thức (dư bằng $0$)
- kiem: khong
- ket_qua_sach: a=-7, b=-1; a=-12, b=-2
- dap_an: $(a;b)\in\{(-7;-1);(-12;-2)\}$
- ghi_chu_nghi: Ảnh p-032 (ý b là đầu trang): dòng điều kiện (2) đọc là "-a+6b²+b+2=0" (thiếu chữ $b$ sau $a$), trong khi đa thức dư ngay dòng trên ghi $-ab+6b^2+b+2$ và phép thế sau đó ($b^2+3b+2=0$) chỉ đúng với $-ab$; chép đúng như đọc được, lời giải kho dùng $-ab$. Chữ "Chia" đầu ý b bị mép che, đọc theo ngữ cảnh.
## DE
Xác định các giá trị $a,b$ sao cho đa thức $Q(x)=6x^4-7x^3+ax^2+3x+2$ chia hết cho đa thức $M(x)=x^2-x+b$.
## SACH
Chia $Q(x)$ cho $M(x)$ ta được:
Thương $6x^2-x+(a-6b-1)$; Dư $(a-5b+2)x+(-ab+6b^2+b+2)$
Từ điều kiện $Q(x)\vdots M(x)$ suy ra: $a-5b+2=0$ (1)
$-a+6b^2+b+2=0$ (2). Tính $a$ từ (1) theo $b$, thay vào (2)
$b^2+3b+2=0\Rightarrow(b+1)(b+2)=0$ cho ta $b=-1\Rightarrow a=-7$
$b=-2\Rightarrow a=-12$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Số bị chia bậc bốn, số chia bậc hai nên đặt tính chia được thương bậc hai và dư bậc nhất; chia hết khi cả hai hệ số của dư bằng $0$, cho ra hệ hai phương trình theo $a,b$.

**Bước 1.** Thực hiện phép chia $Q(x)$ cho $M(x)$ từng bước, mỗi bước lấy hạng tử bậc cao nhất của phần còn lại chia cho $x^2$ để tìm hạng tử của thương.

**Bước 2.** Viết đa thức dư dưới dạng $mx+n$ với $m,n$ là biểu thức của $a,b$, rồi cho cả hai hệ số bằng $0$ để lập hệ phương trình.

**Bước 3.** Rút $a$ từ phương trình bậc nhất, thế vào phương trình còn lại để được phương trình bậc hai theo $b$ rồi phân tích thành tích để giải.

**Bước 4.** Từ mỗi giá trị của $b$ tính ngược lại $a$ và kết luận hai cặp $(a;b)$.

**Chú ý:** Hai cặp nghiệm đều thỏa vì đa thức dư đồng nhất bằng $0$ khi cả hai hệ số bằng $0$, không cần thử lại.

**Phần 2. Trình bày**

Chia $Q(x)$ cho $M(x)=x^2-x+b$:

$Q(x)-6x^2M(x)=-x^3+(a-6b)x^2+3x+2$

$-x^3+(a-6b)x^2+3x+2+xM(x)=(a-6b-1)x^2+(b+3)x+2$

$(a-6b-1)x^2+(b+3)x+2-(a-6b-1)M(x)=(a-5b+2)x+(-ab+6b^2+b+2)$.

Vậy thương là $6x^2-x+(a-6b-1)$ và dư là $(a-5b+2)x+(-ab+6b^2+b+2)$.

$Q(x)$ chia hết cho $M(x)$ khi và chỉ khi dư bằng $0$ với mọi $x$, tức là:

$a-5b+2=0$ (1) và $-ab+6b^2+b+2=0$ (2).

Từ (1): $a=5b-2$. Thay vào (2): $-(5b-2)b+6b^2+b+2=0$, tức là $b^2+3b+2=0$

$\Leftrightarrow(b+1)(b+2)=0$.

Với $b=-1$ thì $a=5\cdot(-1)-2=-7$; với $b=-2$ thì $a=5\cdot(-2)-2=-12$.

Vậy $(a;b)=(-7;-1)$ hoặc $(a;b)=(-12;-2)$.

=== T2V7.10@p32
- bai: 10 · y: - · trang: 32 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010402
- cong_cu: đồng nhất hệ số · xét trường hợp
- kiem: khong
- ket_qua_sach: b=c=0, a tùy ý; a=-1, b=-1, c=1
- dap_an: $(a;b;c)=(a;0;0)$ với $a$ tùy ý, hoặc $(a;b;c)=(-1;-1;1)$
- ghi_chu_nghi: Ảnh p-032: nhãn "Ví dụ 0:" mất chữ số 1 ở mép (đánh số 10 theo thứ tự). Dấu giữa $x^3$ và $ax^2$ trong đề in mờ (nhìn như dấu chấm); dựng lại là dấu trừ theo phương trình (1) $a+b+c=a$ của lời giải sách. Chữ "Hãy" đầu lời giải bị mép che. Sách viết "Với $b=0$ ta trở về trường hợp 1" — thực ra trong nhánh $ab=1$ thì $b\neq 0$; lời giải kho loại $b=0$ bằng $ab=1$. Nhóm: tìm hệ số bằng đồng nhất đa thức, chọn T18T010402; bản đồ không có nhóm riêng (có thể để T18T000000).
## DE
Hãy xác định các số $a,b,c$ để có đẳng thức: $x^3-ax^2+bx-c=(x-a)(x-b)(x-c)$.
## SACH
Hãy khai triển vế phải và đồng nhất hệ số của các hạng tử cùng bậc.
$a+b+c=a$ (1); $ab+bc+ac=b$ (2); $abc=c$ (3)
$(1)\Rightarrow b+c=0\Leftrightarrow b=-c$; $(3)\Leftrightarrow c(ab-1)=0\Leftrightarrow c=0$ hoặc $ab=1$
TH1: Với $c=0$, ta có $b=0$ và $a$ có thể lấy tùy ý.
TH2: Với $ab=1$, thay vào (2) đồng thời thay $c=-b$ ta có:
$ab-b^2-ab=b\Leftrightarrow b(b+1)=0\Leftrightarrow b=-1$ hoặc $b=0$
a. Với $b=0$ ta trở về trường hợp 1.
b. Với $b=-1$ ta có $c=1$ và $a=-1$.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Hai đa thức bằng nhau với mọi $x$ khi và chỉ khi các hệ số cùng bậc bằng nhau, nên khai triển vế phải thành $x^3-(a+b+c)x^2+\dots$ rồi lập hệ ba phương trình theo $a,b,c$.

**Bước 1.** Khai triển $(x-a)(x-b)(x-c)$ theo các hệ số $a+b+c$, $ab+bc+ca$ và $abc$.

**Bước 2.** Đồng nhất ba hệ số của $x^2$, $x$ và hệ số tự do với vế trái để có ba phương trình.

**Bước 3.** Dùng phương trình đơn giản nhất để biểu diễn $b$ theo $c$, rồi phân tích phương trình còn lại thành tích để chia hai trường hợp.

**Bước 4.** Giải từng trường hợp, chú ý loại các giá trị mâu thuẫn với điều kiện của trường hợp đó.

**Chú ý:** Ở trường hợp $c=0$ thì $a$ không bị ràng buộc, nên đáp số có vô số bộ nghiệm dạng $(a;0;0)$ chứ không chỉ là một bộ.

**Phần 2. Trình bày**

$(x-a)(x-b)(x-c)=x^3-(a+b+c)x^2+(ab+bc+ca)x-abc$.

Đồng nhất hệ số với $x^3-ax^2+bx-c$:

$a+b+c=a$ (1); $ab+bc+ca=b$ (2); $abc=c$ (3).

Từ (1): $b+c=0$, suy ra $b=-c$. Từ (3): $c(ab-1)=0$, suy ra $c=0$ hoặc $ab=1$.

Trường hợp 1: $c=0$. Khi đó $b=-c=0$ và (2) thành $0=0$ nên $a$ lấy tùy ý.

Trường hợp 2: $ab=1$ (nên $b\neq 0$). Thay $c=-b$ vào (2): $ab-b^2-ab=b$, tức là $-b^2=b$, hay $b(b+1)=0$.

Vì $b\neq 0$ nên $b=-1$, suy ra $c=1$ và $a=\dfrac{1}{b}=-1$.

Vậy $b=c=0$ với $a$ tùy ý, hoặc $(a;b;c)=(-1;-1;1)$.

=== T2V7.11@p32
- bai: 11 · y: - · trang: 32 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010302
- cong_cu: hằng đẳng thức $a^3+b^3$ · thế biến vào hằng đẳng thức
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Ảnh p-032: nhãn "Ví dụ 1:" thực ra là Ví dụ 11 (mất chữ số 1 ở mép; kế tiếp là "Ví dụ 12"); chữ "Với" ngay trước (2) bị mép che nửa. Bài là một chuỗi suy diễn (1)⇒(2)⇒(3)⇒(4) nên giữ một câu. Nhóm: chuỗi hằng đẳng thức, hai bước sau có điều kiện; chọn T18T010302, có thể xếp T18T010101.
## DE
Ta biết rằng: (1) $a^3+b^3=(a+b)^3-3ab(a+b)$.

Chứng minh rằng (1) $\Rightarrow$ (2) $\Rightarrow$ (3) $\Rightarrow$ (4), với:

(2) $a^3+b^3+c^3=(a+b+c)^3-3(a+b)(b+c)(c+a)$;

(3) Nếu $a+b+c=0$ thì $a^3+b^3+c^3=3abc$;

(4) Nếu $a+b+c+d=0$ thì $a^3+b^3+c^3+d^3=3(ab-cd)(c+d)$.
## SACH
Chứng minh $(1)\Rightarrow(2)$:
Ta có trong (1) thay $b$ bởi $b+c$:
$a^3+(b+c)^3=(a+b+c)^3-3a(b+c)(a+b+c)$
Thay $(b+c)^3$ theo (1):
$a^3+b^3+c^3=(a+b+c)^3-3(b+c)[bc+a(a+b+c)]$, trong đó $bc+a(a+b+c)=(a+b)(c+a)$.
Chứng minh $(2)\Rightarrow(3)$: Thay $a+b+c=0$, $a+b=-c$, $b+c=-a$, $c+a=-b$ vào vế phải của (2), ta có (3)
Chứng minh $(3)\Rightarrow(4)$: Thay $c$ bởi $c+d$ vào (3)
$a^3+b^3+(c+d)^3=3ab(c+d)$
$a^3+b^3+c^3+d^3=3ab(c+d)-3cd(c+d)=3(ab-cd)(c+d)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Mỗi hệ thức sau suy ra từ hệ thức trước bằng một phép thế biến vào chính hằng đẳng thức (1): thay $b$ bởi $b+c$, thay điều kiện tổng bằng $0$, rồi gộp $c$ và $d$ thành một số $c+d$.

**Bước 1.** Chứng minh (1)$\Rightarrow$(2): thay $b$ bởi $b+c$ trong (1), rồi áp dụng lại (1) cho cặp $b,c$ để thay $(b+c)^3$ và đưa về $a^3+b^3+c^3$.

**Bước 2.** Đặt nhân tử chung $b+c$ và phân tích biểu thức trong ngoặc vuông thành tích hai nhị thức để ra dạng của (2).

**Bước 3.** Chứng minh (2)$\Rightarrow$(3): dùng điều kiện $a+b+c=0$ để thay từng tổng hai số bằng số đối của số còn lại ở vế phải của (2).

**Bước 4.** Chứng minh (3)$\Rightarrow$(4): coi $c+d$ là một số rồi áp dụng (3) cho ba số $a$, $b$, $c+d$ có tổng bằng $0$, sau đó khai triển $(c+d)^3$ bằng (1).

**Chú ý:** Chứng minh (3)$\Rightarrow$(4) cần $a+b+(c+d)=0$, đây là chỗ dùng điều kiện $a+b+c+d=0$.

**Phần 2. Trình bày**

(1)$\Rightarrow$(2): Thay $b$ bởi $b+c$ trong (1):

$a^3+(b+c)^3=(a+b+c)^3-3a(b+c)(a+b+c)$.

Áp dụng (1) cho $b,c$: $(b+c)^3=b^3+c^3+3bc(b+c)$, thay vào:

$a^3+b^3+c^3+3bc(b+c)=(a+b+c)^3-3a(b+c)(a+b+c)$

$\Rightarrow a^3+b^3+c^3=(a+b+c)^3-3(b+c)[bc+a(a+b+c)]$

$=(a+b+c)^3-3(b+c)(a^2+ab+ac+bc)$

$=(a+b+c)^3-3(b+c)(a+b)(a+c)$.

Đó là (2).

(2)$\Rightarrow$(3): Nếu $a+b+c=0$ thì $a+b=-c$, $b+c=-a$, $c+a=-b$. Thay vào vế phải của (2):

$a^3+b^3+c^3=0^3-3(-c)(-a)(-b)=3abc$.

(3)$\Rightarrow$(4): Nếu $a+b+c+d=0$ thì ba số $a$, $b$, $c+d$ có tổng bằng $0$. Áp dụng (3):

$a^3+b^3+(c+d)^3=3ab(c+d)$.

Theo (1): $(c+d)^3=c^3+d^3+3cd(c+d)$, nên

$a^3+b^3+c^3+d^3=3ab(c+d)-3cd(c+d)=3(ab-cd)(c+d)$.

Vậy (1)$\Rightarrow$(2)$\Rightarrow$(3)$\Rightarrow$(4).

=== T2V7.12@p33
- bai: 12 · y: - · trang: 33 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T030101
- cong_cu: phân tích nhân tử đa thức hoán vị vòng quanh · hằng đẳng thức
- kiem: khong
- ket_qua_sach:
- dap_an: Chứng minh
- ghi_chu_nghi: Sách kết luận "nên $S\neq 0$" từ ba nhân tử $a-b$, $b-c$, $a-c$ khác $0$ nhưng không nói vì sao thừa số $(a+b)^2+(b+c)^2+(c+a)^2$ khác $0$ (hổng); lời giải kho bổ sung (nếu bằng $0$ thì $a+b=b+c=c+a=0$, suy ra $a=c$, trái giả thiết phân biệt). Nhóm: chứng minh $\neq 0$ bằng phân tích nhân tử hoán vị vòng (cũng có thể xếp T18T010204); chọn T18T030101.
## DE
Cho $a,b,c$ là ba số phân biệt; chứng minh rằng: $a^4(b-c)+b^4(c-a)+c^4(a-b)\neq 0$.
## SACH
$S=a^4(b-c)+b^4(c-a)+c^4(a-b)=a^4b-a^4c+b^4c-b^4a+c^4(a-b)$
$=(a-b)[a^3(b-c)+a^2b(b-c)+ab^2(b-c)-c(b^3-c^3)]$
$=(a-b)(b-c)[a^3-c^3+b(a^2-c^2)+b^2(a-c)]$
$=-(a-b)(b-c)(c-a)(a^2+b^2+c^2+ab+bc+ca)$
$=\dfrac{1}{2}(a-b)(b-c)(a-c)[(a+b)^2+(b+c)^2+(c+a)^2]$
Do $a,b,c$ là ba số phân biệt: $a\neq b$, $b\neq c$, $c\neq a$, nên $S\neq 0$, đpcm.
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Biểu thức triệt tiêu khi hai biến bằng nhau (chẳng hạn $a=b$), nên chắc chắn chứa các nhân tử $a-b$, $b-c$, $c-a$; phân tích ra tích rồi chỉ cần chứng tỏ mọi nhân tử đều khác $0$.

**Bước 1.** Viết $c-a=-(a-b)-(b-c)$ rồi nhóm các hạng tử để mọi số hạng đều chứa $a-b$ hoặc $b-c$, từ đó đặt hai nhân tử này ra ngoài.

**Bước 2.** Dùng hiệu hai lũy thừa bậc bốn và bậc ba để phân tích thừa số còn lại, được thêm nhân tử $a-c$ và một biểu thức đối xứng bậc hai.

**Bước 3.** Viết biểu thức đối xứng bậc hai đó thành nửa tổng các bình phương để xét được dấu.

**Bước 4.** Dùng giả thiết ba số phân biệt để chứng tỏ cả bốn nhân tử đều khác $0$, từ đó kết luận tích khác $0$.

**Chú ý:** "$a,b,c$ phân biệt" chỉ cho ba nhân tử $a-b$, $b-c$, $a-c$ khác $0$; nhân tử cuối khác $0$ phải chứng minh riêng.

**Phần 2. Trình bày**

Đặt $S=a^4(b-c)+b^4(c-a)+c^4(a-b)$. Vì $c-a=-(a-b)-(b-c)$ nên

$S=a^4(b-c)-b^4(a-b)-b^4(b-c)+c^4(a-b)$

$=(b-c)(a^4-b^4)-(a-b)(b^4-c^4)$

$=(a-b)(b-c)(a+b)(a^2+b^2)-(a-b)(b-c)(b+c)(b^2+c^2)$

$=(a-b)(b-c)[(a+b)(a^2+b^2)-(b+c)(b^2+c^2)]$

$=(a-b)(b-c)[a^3+a^2b+ab^2-b^2c-bc^2-c^3]$

$=(a-b)(b-c)[(a^3-c^3)+b(a^2-c^2)+b^2(a-c)]$

$=(a-b)(b-c)(a-c)(a^2+ac+c^2+ab+bc+b^2)$

$=\dfrac{1}{2}(a-b)(b-c)(a-c)[(a+b)^2+(b+c)^2+(c+a)^2]$.

Vì $a,b,c$ phân biệt nên $a-b\neq 0$, $b-c\neq 0$, $a-c\neq 0$.

Nếu $(a+b)^2+(b+c)^2+(c+a)^2=0$ thì $a+b=b+c=c+a=0$, suy ra $a=c$, trái với giả thiết; do đó $(a+b)^2+(b+c)^2+(c+a)^2>0$.

Vậy $S\neq 0$.

=== T2V8.1@p33
- bai: 1 · y: - · trang: 33 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: định lí Bê-du · hệ quả định lí Bê-du · nhẩm nghiệm · phép chia đa thức
- kiem: bang | x^3-x^2-14x+24
- ket_qua_sach: (x-2)(x-3)(x+4)
- dap_an: $(x-2)(x-3)(x+4)$
- ghi_chu_nghi: Sách viết "Bezout" (không viết "Bê-du"); lời giải kho dùng "định lí Bê-du".
## DE
Phân tích thành nhân tử đa thức sau: $f(x)=x^3-x^2-14x+24$.
## SACH
Ta thử vận dụng định lý Bezout
Bước 1: Thử $x=2$ ta thấy:
$f(2)=2^3-2^2-28+24=0$. Vậy $2$ là một nghiệm của $f(x)$. Theo hệ quả của định lý Bezout thì $f(x)$ chia hết cho $x-2$.
$f(x)=(x-2)p(x)$.
Bước 2: Thực hiện phép chia $f(x)$ cho $x-2$.
Đặt tính chia: $(x^3-x^2-14x+24):(x-2)$ được thương $x^2+x-12$. Các bước: $x^3-2x^2$, dư $x^2-14x+24$; $x^2-2x$, dư $-12x+24$; $-12x+24$, dư $0$.
Vậy $f(x)=(x-2)(x^2+x-12)$
Bước 3: $p(x)=x^2+x-12$ có $p(3)=0$ tức là $x=3$ là nghiệm của $p(x)$.
Vậy $p(x)$ chia hết cho $x-3$.
Đặt tính chia: $(x^2+x-12):(x-3)$ được thương $x+4$. Các bước: $x^2-3x$, dư $4x-12$; $4x-12$, dư $0$.
$p(x)=(x-3)(x+4)$. Vậy $f(x)=(x-2)(x-3)(x+4)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba hệ số nguyên, hệ số cao nhất bằng $1$ thì nghiệm nguyên (nếu có) là ước của hệ số tự do $24$; tìm được một nghiệm $k$ là có ngay nhân tử $x-k$ (hệ quả của định lí Bê-du), rồi hạ bậc để phân tích tiếp.

**Bước 1.** Thử lần lượt các ước nhỏ của $24$ vào $f(x)$ cho đến khi gặp giá trị làm $f$ bằng $0$, từ đó biết trước một nhân tử bậc nhất.

**Bước 2.** Tách các hạng tử của $f(x)$ thành từng cặp cùng chứa nhân tử vừa tìm rồi đặt nhân tử chung (hoặc đặt tính chia), được thương là tam thức bậc hai.

**Bước 3.** Phân tích tiếp tam thức bậc hai đó bằng cách tách hạng tử bậc nhất thành hai nhị thức, hoặc nhẩm tiếp một nghiệm của nó.

**Chú ý:** Tìm nghiệm trong các ước của hệ số tự do chỉ đúng khi đa thức có hệ số nguyên và hệ số cao nhất bằng $1$; ngoài ra phải dừng khi mọi nhân tử đều không phân tích tiếp được.

**Phần 2. Trình bày**

Ta có $f(2)=2^3-2^2-14\cdot 2+24=0$ nên $f(x)$ chia hết cho $x-2$ (hệ quả định lí Bê-du).

$f(x)=x^3-2x^2+x^2-2x-12x+24$

$=x^2(x-2)+x(x-2)-12(x-2)$

$=(x-2)(x^2+x-12)$

$=(x-2)(x^2-3x+4x-12)$

$=(x-2)(x-3)(x+4)$.

=== T2V8.2@p34
- bai: 2 · y: - · trang: 34 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: định lí Bê-du · nhẩm nghiệm · ước của hệ số tự do
- kiem: bang | x^3+4x^2+4x+3
- ket_qua_sach: (x+3)(x^2+x+1)
- dap_an: $(x+3)(x^2+x+1)$
- ghi_chu_nghi: Ảnh p-034: nhãn "Ví dụ ::" mất chữ số ở mép; đánh số 2 theo thứ tự (ví dụ trước là Ví dụ 1, ví dụ sau là Ví dụ 3). Mép trái mất chữ ở một số dòng lời giải ("Vậy", "thế", "$x^3$"), đọc theo ngữ cảnh. Sách viết "Vậy $x^3+4x^2+4x+3=(x+3)(x^2+x+1)$".
## DE
Phân tích thành nhân tử: $f(x)=x^3+4x^2+4x+3$.
## SACH
Hạng tử độc lập có các ước số $\pm1,\pm3$. Ta chỉ thử trong bốn số $\pm1,\pm3$ mà thôi: $f(+1)=12$, $f(-1)=2$, $f(3)=78$, $f(-3)=0$.
Vậy $f(x)$ chia hết cho $x+3$. Chia $f(x)$ cho $x+3$.
$(x^3+4x^2+4x+3):(x+3)=x^2+x+1$
Vậy: $x^3+4x^2+4x+3=(x+3)(x^2+x+1)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức hệ số nguyên có hệ số cao nhất bằng $1$ và hệ số tự do $3$ nên nghiệm nguyên chỉ có thể là $\pm1$ hoặc $\pm3$; chỉ cần thử bốn số này.

**Bước 1.** Liệt kê các ước của hệ số tự do $3$ rồi thay lần lượt vào $f(x)$ để tìm giá trị làm $f$ bằng $0$.

**Bước 2.** Từ nghiệm tìm được suy ra một nhân tử bậc nhất theo hệ quả định lí Bê-du.

**Bước 3.** Tách các hạng tử của $f(x)$ thành từng nhóm chứa nhân tử đó rồi đặt nhân tử chung để ra thương bậc hai.

**Bước 4.** Kiểm tra thương bậc hai có nghiệm hay không, nếu không có nghiệm thì dừng ở đây.

**Chú ý:** Thương $x^2+x+1=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ với mọi $x$, nên không phân tích tiếp được.

**Phần 2. Trình bày**

Các ước của $3$ là $\pm1$, $\pm3$. Ta có $f(1)=12$, $f(-1)=2$, $f(3)=78$, $f(-3)=-27+36-12+3=0$.

Vậy $f(x)$ chia hết cho $x+3$.

$f(x)=x^3+3x^2+x^2+3x+x+3$

$=x^2(x+3)+x(x+3)+(x+3)$

$=(x+3)(x^2+x+1)$.

Vì $x^2+x+1=\left(x+\dfrac{1}{2}\right)^2+\dfrac{3}{4}>0$ nên không phân tích tiếp được.

=== T2V8.3a@p34
- bai: 3 · y: a · trang: 34 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: định lí Bê-du · nhẩm nghiệm · tách hạng tử
- kiem: bang | x^3-7x-6
- ket_qua_sach: (x+1)(x+2)(x-3)
- dap_an: $(x+1)(x+2)(x-3)$
- ghi_chu_nghi: Ảnh p-034: nhãn "Ví dụ ::" mất chữ số; đánh số 3 theo thứ tự. Chữ $x$ đầu biểu thức "$:^3-7x-6$" mất ở mép (dựng lại là $x^3-7x-6$ theo lời giải). Lời giải Cách 1 in dòng cuối "$=(x+1)(x+2)(x+3)$"; đọc là $x+3$ nhưng theo phép tách $x(x+2)-3(x+2)$ và theo Cách 2 phải là $(x-3)$ (người soát mở ảnh kiểm). Cách 2 viết "$-1$ là một ước của $f(x)$" (đúng ra là nghiệm). Lời giải kho đi theo Cách 2 (Bê-du).
## DE
Phân tích thành nhân tử: $x^3-7x-6$.
## SACH
Cách 1:
$x^3-7x-6=x^3-x-6x-6=x^3-x-6(x+1)$
$=x(x^2-1)-6(x+1)=(x+1)[x(x-1)-6]$
$=(x+1)[x^2-x-6]=(x+1)[(x^2+2x-3x-6)]$
$=(x+1)[x(x+2)-3(x+2)]=(x+1)(x+2)(x+3)$
Cách 2: Áp dụng định lý Bezout:
Đặt $f(x)=x^3-7x-6$, ta thấy $f(-1)=0$ nên $-1$ là một ước của $f(x)$.
Vậy $f(x)$ chia hết cho $(x+1)$. Ta có: $f(x)=(x+1)(x^2-x-6)$
Ta thấy $x=-2$ là nghiệm của $x^2-x-6$ ta suy ra được:
$x^2-x-6=(x+2)(x-3)$. Kết quả: $f(x)=(x+1)(x+2)(x-3)$
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba không có nhân tử chung, không là hằng đẳng thức, nhưng hệ số tự do $-6$ có ít ước nên nhẩm được nghiệm; nghiệm là có nhân tử bậc nhất.

**Bước 1.** Thử các ước của $-6$ vào đa thức: thay $x=-1$ được $-1+7-6=0$, nên đa thức có nhân tử $x+1$.

**Bước 2.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chứa $x+1$, rồi đặt $x+1$ làm nhân tử chung.

**Bước 3.** Phân tích tiếp tam thức bậc hai còn lại bằng cách tách hạng tử bậc nhất.

**Chú ý:** Chưa được dừng khi còn tam thức bậc hai có nghiệm nguyên; phải phân tích đến khi không tách được nữa.

**Phần 2. Trình bày**

Đặt $f(x)=x^3-7x-6$. Ta có $f(-1)=-1+7-6=0$ nên $f(x)$ chia hết cho $x+1$ (hệ quả định lí Bê-du).

$x^3-7x-6=x^3+x^2-x^2-x-6x-6$

$=x^2(x+1)-x(x+1)-6(x+1)$

$=(x+1)(x^2-x-6)$

$=(x+1)(x^2+2x-3x-6)$

$=(x+1)(x+2)(x-3)$.

=== T2V8.3b@p34
- bai: 3 · y: b · trang: 34 · tang: nang_cao
- nguon_de:
- muc_loi_giai_sach: du
- nhom: T18T010203
- cong_cu: định lí Bê-du · nhẩm nghiệm · tách hạng tử
- kiem: bang | x^3-19x-30
- ket_qua_sach: (x+2)(x+3)(x-5)
- dap_an: $(x+2)(x+3)(x-5)$
- ghi_chu_nghi: THIẾU TRANG: Cách 2 của ý này bị cắt ở cuối p-034 (dòng cuối chỉ còn "Cách 2: Áp dụng định lý Bezout:"), phần còn lại nằm ở trang sách 32 mà bản scan không có; Cách 1 đã đủ lời giải nên vẫn chép, ## SACH chỉ có Cách 1 (và ghi rõ chỗ cắt). Mép p-034: dòng "$=(x+3)(x^2-3x-10)=\dots$" mất ký tự "(x" đầu dòng ở mép trái và logo che một phần dòng ngay dưới, dựng lại theo phép tách $x(x^2-9)-10(x+3)$. Nhãn ví dụ mất chữ số (đánh số 3).
## DE
Phân tích thành nhân tử: $x^3-19x-30$.
## SACH
Cách 1:
$x^3-19x-30=(x^3-9x)-(10x+30)=x(x^2-9)-10(x+3)$
$=(x+3)(x^2-3x-10)=(x+2)(x+3)(x-5)$.
Cách 2: Áp dụng định lý Bezout: [lời giải tiếp tục ở trang sách 32, không có trong bản scan]
## GIAI
**Phần 1. Hướng dẫn**

**Mấu chốt:** Đa thức bậc ba thiếu hạng tử $x^2$ và hệ số tự do $-30$ có nhiều ước; nhẩm nghiệm trong các ước đó để biết trước một nhân tử bậc nhất rồi tách hạng tử.

**Bước 1.** Thử các ước của $-30$ vào đa thức: thay $x=-2$ được $-8+38-30=0$, nên đa thức có nhân tử $x+2$.

**Bước 2.** Tách các hạng tử thành từng cặp sao cho cặp nào cũng chứa $x+2$, rồi đặt $x+2$ làm nhân tử chung.

**Bước 3.** Phân tích tiếp tam thức bậc hai còn lại bằng cách tách hạng tử bậc nhất.

**Chú ý:** Cũng có thể nhóm $(x^3-9x)-(10x+30)$ để đặt ngay nhân tử chung $x+3$ rồi phân tích tam thức còn lại; cho cùng kết quả.

**Phần 2. Trình bày**

Đặt $f(x)=x^3-19x-30$. Ta có $f(-2)=-8+38-30=0$ nên $f(x)$ chia hết cho $x+2$ (hệ quả định lí Bê-du).

$x^3-19x-30=x^3+2x^2-2x^2-4x-15x-30$

$=x^2(x+2)-2x(x+2)-15(x+2)$

$=(x+2)(x^2-2x-15)$

$=(x+2)(x^2+3x-5x-15)$

$=(x+2)(x+3)(x-5)$.
