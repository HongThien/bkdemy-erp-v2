# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — tuyển tập đề cương (Trọng tâm ôn tập + Bài tập minh hoạ, tr. 30–34; không ghi tên trường)
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 5 | Dạng 5. Một số bài tập nâng cao | tu_luan

### Bài 26 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm số tự nhiên $\overline{abc}$ có ba chữ số khác nhau, sao cho $3a+5b=8c$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa điều kiện $3a+5b=8c$ về dạng $3(a-c)=5(c-b)$ rồi dùng tính chất chia hết để thu hẹp hiệu $a-c$ chỉ còn vài giá trị.

**Bước 1.** Nhận ra mỗi chữ số $a$, $b$, $c$ chỉ chạy từ 0 đến 9 nên có thể thử, nhưng thử cả 900 số rất dài; thay vào đó nhóm các hạng tử cùng hệ số để thấy quan hệ giữa các hiệu.

**Bước 2.** Tách $8c=3c+5c$ rồi chuyển vế để đặt $3$ làm thừa số chung ở một vế và $5$ làm thừa số chung ở vế kia.

**Bước 3.** Vì một vế có thừa số 5 nên cả hai vế chia hết cho 5; do 3 và 5 nguyên tố cùng nhau, suy ra $a-c$ chia hết cho 5, mà $a$, $c$ là chữ số nên $a-c$ chỉ nhận được vài giá trị.

**Bước 4.** Với mỗi giá trị của $a-c$ còn lại, tính $c-b$ rồi tìm $b$, $c$, $a$ và kiểm tra điều kiện của chữ số ($a\ne0$, các chữ số từ 0 đến 9 và khác nhau).

**Chú ý:** $a$ là chữ số hàng trăm nên $a\ne0$, còn $b$, $c$ có thể bằng $0$; và đề bắt buộc ba chữ số khác nhau nên phải loại trường hợp $a=c$.

Thử lại: thay từng số tìm được vào $3a+5b=8c$ và kiểm tra ba chữ số khác nhau.

**Phần 2. Trình bày**

Từ $3a+5b=8c$ ta có $3a-3c=5c-5b$, tức là:

$3(a-c)=5(c-b)$

Vì $5(c-b)$ chia hết cho 5 nên $3(a-c)$ chia hết cho 5. Mà 3 và 5 nguyên tố cùng nhau nên $a-c$ chia hết cho 5.

Vì $a$, $c$ là các chữ số nên $-9\le a-c\le 9$. Do đó $a-c\in\{-5;\ 0;\ 5\}$.

Vì $a$ và $c$ khác nhau nên $a-c\ne0$.

Trường hợp 1: $a-c=5$.

Khi đó $3 \cdot 5=5(c-b)$ nên $c-b=3$.

Suy ra $c=b+3$ và $a=c+5=b+8$.

Vì $a\le9$ nên $b\le1$.

Nếu $b=0$ thì $c=3$, $a=8$, ta được số $803$.

Nếu $b=1$ thì $c=4$, $a=9$, ta được số $914$.

Trường hợp 2: $a-c=-5$.

Khi đó $3 \cdot (-5)=5(c-b)$ nên $c-b=-3$.

Suy ra $b=c+3$ và $a=c-5$.

Vì $a\ge1$ nên $c\ge6$; vì $b\le9$ nên $c\le6$. Do đó $c=6$, $b=9$, $a=1$, ta được số $196$.

Thử lại:

$803$: $3 \cdot 8+5 \cdot 0=24=8 \cdot 3$.

$914$: $3 \cdot 9+5 \cdot 1=32=8 \cdot 4$.

$196$: $3 \cdot 1+5 \cdot 9=48=8 \cdot 6$.

Cả ba số đều có ba chữ số khác nhau.

Vậy các số cần tìm là $803$; $914$; $196$.

### Bài 27 | kho=dai | loai=tra_loi_ngan | dap_an=30
**Đề:** Cho đa thức $P(x)=x^3+ax^2+bx+c$, trong đó $a,\ b,\ c$ là hằng số. Biết $P(2)=0$ và $P(3)=0$. Tính $P(5)-P(0)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba hằng số $a$, $b$, $c$ mà chỉ có hai điều kiện nên không tìm riêng từng số được, nhưng $P(5)-P(0)$ làm mất $c$ và chỉ còn phụ thuộc vào tổ hợp $5a+b$ — tổ hợp đó suy ra được từ hai điều kiện.

**Bước 1.** Tính giá trị đa thức tại $x=2$ và $x=3$, rồi dùng $P(2)=0$, $P(3)=0$ để có hai đẳng thức chứa $a$, $b$, $c$.

**Bước 2.** Quan sát thấy cả hai đẳng thức đều chứa $c$ với hệ số 1, nên lấy đẳng thức này trừ đẳng thức kia vế theo vế để $c$ biến mất, còn lại quan hệ giữa $a$ và $b$.

**Bước 3.** Tính riêng $P(5)$ và $P(0)$ rồi lấy hiệu: hạng tử $c$ ở hai giá trị triệt tiêu nhau, kết quả chỉ còn $a$ và $b$.

**Bước 4.** Đặt thừa số chung ở hai hạng tử chứa $a$, $b$ để xuất hiện đúng tổ hợp $5a+b$ ở bước 2, rồi thay giá trị đã biết vào.

**Chú ý:** hai điều kiện không đủ để tìm riêng từng hằng số $a$, $b$, $c$, và cũng không cần tìm; $P(0)=c$ vì mọi hạng tử chứa $x$ đều bằng 0 khi $x=0$.

**Phần 2. Trình bày**

Ta có:

$P(2)=8+4a+2b+c$

$P(3)=27+9a+3b+c$

Vì $P(2)=0$ nên $8+4a+2b+c=0$.

Vì $P(3)=0$ nên $27+9a+3b+c=0$.

Lấy đẳng thức thứ hai trừ đẳng thức thứ nhất, vế theo vế:

$(27+9a+3b+c)-(8+4a+2b+c)=0$

$27+9a+3b+c-8-4a-2b-c=0$

$19+5a+b=0$

Suy ra $5a+b=-19$.

Lại có:

$P(5)=125+25a+5b+c$

$P(0)=c$

Do đó:

$P(5)-P(0)=125+25a+5b+c-c$

$=125+25a+5b$

$=125+5(5a+b)$

$=125+5 \cdot (-19)$

$=125-95$

$=30$

Vậy $P(5)-P(0)=30$.

### Bài 28 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a+b+c=2p$. Chứng minh đẳng thức $2bc+b^2+c^2-a^2=4p(p-a)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vế phải chứa $p$ còn vế trái chỉ có $a$, $b$, $c$; thay $2p=a+b+c$ vào vế phải để biến nó thành tích hai đa thức của $a$, $b$, $c$, rồi nhân ra và so với vế trái.

**Bước 1.** Chọn vế phải $4p(p-a)$ để biến đổi, vì nó chứa $p$ và ta có sẵn cách thay $p$ bằng $a$, $b$, $c$ từ giả thiết $a+b+c=2p$.

**Bước 2.** Muốn xuất hiện $2p$ ở mỗi thừa số, tách $4p=2p \cdot 2$ rồi dùng tính chất phân phối đưa số 2 vào ngoặc $(p-a)$, được thừa số thứ hai là $2p-2a$.

**Bước 3.** Thay $2p=a+b+c$ vào cả hai thừa số, khi đó vế phải là tích của hai đa thức, mỗi đa thức chỉ chứa $a$, $b$, $c$.

**Bước 4.** Nhân đa thức với đa thức bằng cách nhân từng hạng tử của thừa số này với từng hạng tử của thừa số kia, rồi nhóm các hạng tử đồng dạng và đối chiếu với vế trái.

**Chú ý:** chỉ cần nhân từng hạng tử rồi thu gọn; nhớ đổi dấu khi nhân với hạng tử $-a$, và các cặp $ab$, $-ab$ (hay $ac$, $-ac$) triệt tiêu nhau.

**Phần 2. Trình bày**

Vì $a+b+c=2p$ nên ta biến đổi vế phải:

Vế phải $=4p(p-a)$

$=2p \cdot 2(p-a)$

$=2p(2p-2a)$

$=(a+b+c)(a+b+c-2a)$

$=(a+b+c)(b+c-a)$

$=a(b+c-a)+b(b+c-a)+c(b+c-a)$

$=ab+ac-a^2+b^2+bc-ab+bc+c^2-ac$

$=-a^2+b^2+c^2+(ab-ab)+(ac-ac)+(bc+bc)$

$=2bc+b^2+c^2-a^2$

$=$ Vế trái.

Vậy $2bc+b^2+c^2-a^2=4p(p-a)$.

### Bài 29 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a+b+c=0$. Chứng minh rằng $M=N=P$, với $M=a(a+b)(a+c);\ N=b(b+c)(b+a);\ P=c(c+a)(c+b)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** từ $a+b+c=0$, tổng của hai số bất kì bằng số đối của số còn lại; thay vào các ngoặc thì cả ba biểu thức $M$, $N$, $P$ rút về cùng một tích.

**Bước 1.** Từ giả thiết $a+b+c=0$, chuyển vế để viết từng tổng hai số ($a+b$, $b+c$, $a+c$) theo số còn lại.

**Bước 2.** Thay vào $M$: hai ngoặc trở thành $-c$ và $-b$; tích $(-c)(-b)$ có hai dấu trừ nên bằng $bc$, do đó $M$ chỉ còn tích ba chữ cái.

**Bước 3.** Làm tương tự cho $N$ và $P$, chú ý các ngoặc viết theo thứ tự khác nhau, như $(b+a)$ chính là $(a+b)$ và $(c+b)$ chính là $(b+c)$.

**Bước 4.** So sánh ba kết quả: nếu cả ba cùng bằng một biểu thức thì $M=N=P$ theo tính chất bắc cầu của đẳng thức.

**Chú ý:** chỉ cần chứng minh mỗi biểu thức bằng cùng một tích; không cần nhân hết các ngoặc ra.

**Phần 2. Trình bày**

Vì $a+b+c=0$ nên:

$a+b=-c$

$b+c=-a$

$a+c=-b$

Ta có:

$M=a(a+b)(a+c)=a \cdot (-c) \cdot (-b)=abc$

$N=b(b+c)(b+a)=b \cdot (-a) \cdot (-c)=abc$

$P=c(c+a)(c+b)=c \cdot (-b) \cdot (-a)=abc$

Do đó $M=N=P\ (=abc)$.

Vậy $M=N=P$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Không có câu đề sai / chưa chắc. Ảnh t-5 (tr. 34) đối chiếu đề trong khung với Bài 26–29: khớp từng chữ, số, dấu.
- Bài 26: vét cạn cả 900 số, đúng ba số $803$, $914$, $196$ (máy kiểm); lập luận trình bày dùng $3(a-c)=5(c-b)$ + tính chất chia hết lớp 6 (3 và 5 nguyên tố cùng nhau), không cần kiến thức ngoài phạm vi. Đáp số ba số nên để tự luận.
- Bài 27: đổi loại sang `tra_loi_ngan`, `dap_an=30` (một số nguyên ≤ 4 kí tự, đúng dạng đề hỏi). Máy kiểm 401 bộ $(a,b,c)$ thoả $P(2)=P(3)=0$ (họ một tham số: $b=-19-5a$, $c=30+6a$) cho cùng $P(5)-P(0)=30$. Lời giải chỉ thay giá trị đa thức tại điểm và trừ vế theo vế, không gọi Bézout / Vi-ét.
- Bài 28, 29: đồng nhất thức kiểm BigInt trên 200 bộ số mỗi bài (Bài 28 chọn $a+b+c$ chẵn để $p$ nguyên) và kiểm từng dòng trung gian. Lời giải nhân đa thức trực tiếp (Bài 28) và thay $a+b=-c,\dots$ (Bài 29), không dùng hằng đẳng thức đặt tên hay phân tích nhân tử.
- Script kiểm: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\DTK8-GKI-2026\tam\kiem_p7.mjs`. Không có hình giải (cả bốn bài là Đại).
