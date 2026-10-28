# ĐỀ | Đề cương ôn tập học kì I Toán 10 năm 2026–2027 — THPT Yên Hòa (Hà Nội)
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 2 | Chương I Mệnh đề – Tập hợp — Trắc nghiệm đúng sai | dung_sai

### Câu 50 | kho=dai | loai=dung_sai | dap_an=DSDS
**Đề:** Cho các tập hợp $A=\{x\in\mathbb{Z}\mid(x^2-4)(2x^2-x-3)=0\}$; $B=\{-2;-1;2\}$; $C=\{x\in\mathbb{R}\mid-5\le x<2\}$. Các mệnh đề sau đúng hay sai?
a) Tập hợp $B$ có ba tập con gồm hai phần tử.
b) Tập hợp $A=\left\{-2;-1;\dfrac{3}{2};2\right\}$.
c) Hai tập hợp $A$ và $B$ bằng nhau.
d) Tập hợp $A\cap C$ có ba phần tử.

**Phần 1. Hướng dẫn**

**Mấu chốt:** liệt kê phần tử của $A$ bằng cách giải phương trình tích rồi chỉ giữ nghiệm nguyên, sau đó đếm tập con và tìm giao.

**Bước 1.** Ý b, c: giải từng nhân tử $x^2-4=0$ và $2x^2-x-3=0$, loại nghiệm không thuộc $\mathbb{Z}$ vì $A$ chỉ chứa số nguyên rồi so sánh $A$ với $B$.

**Bước 2.** Ý a: tập hợp có $n$ phần tử thì số tập con gồm hai phần tử là $C_n^2$.

**Bước 3.** Ý d: lấy các phần tử của $A$ nằm trong nửa khoảng $[-5;2)$, chú ý đầu mút $2$ bị loại.

**Phần 2. Trình bày**

$x^2-4=0\Leftrightarrow x=\pm2$.

$2x^2-x-3=0\Leftrightarrow x=-1$ hoặc $x=\dfrac{3}{2}$.

Vì $x\in\mathbb{Z}$ nên loại $x=\dfrac{3}{2}$, suy ra $A=\{-2;-1;2\}$.

Ý a) $B$ có $3$ phần tử nên số tập con gồm hai phần tử là $C_3^2=3$. Đúng.

Ý b) $\dfrac{3}{2}\notin\mathbb{Z}$ nên $A\ne\left\{-2;-1;\dfrac{3}{2};2\right\}$. Sai.

Ý c) $A=\{-2;-1;2\}=B$. Đúng.

Ý d) Vì $2\notin C$ nên $A\cap C=\{-2;-1\}$ chỉ có hai phần tử. Sai.

Vậy đáp án là Đúng, Sai, Đúng, Sai.

### Câu 51 | kho=dai | loai=dung_sai | dap_an=SSDD
**Đề:** Trong một buổi hội thảo về giáo dục có $120$ người tham dự, được chia làm ba nhóm: nhóm $A$, nhóm $B$, nhóm $C$. Biết nhóm $A$ có $50$ người, nhóm $B$ có $40$ người, nhóm $C$ có $30$ người. Biết có $10$ người tham gia cả hai nhóm $A$ và $B$, $5$ người tham gia cả hai nhóm $A$ và $C$, $8$ người tham gia cả hai nhóm $B$ và $C$, có $3$ người tham gia cả ba nhóm trên.
a) Số người chỉ tham gia nhóm $A$ và $B$ là $10$ người.
b) Số người chỉ tham gia nhóm $A$ là $25$ người.
c) Số người chỉ tham gia nhóm $C$ là $20$ người.
d) Số người không tham gia bất cứ nhóm nào là $20$ người.
**Ghi chú:** đề in "giam gia" ở ý d (lỗi chính tả), gõ lại là "tham gia". Hiểu "$10$ người tham gia cả hai nhóm $A$ và $B$" là số người thuộc $A\cap B$ (gồm cả $3$ người thuộc cả ba nhóm) — đây là cách hiểu chuẩn; nếu hiểu là "đúng hai nhóm" thì chỉ $C$ là $14$, không nhóm nào là $29$, không ý nào khớp số đề cho.

**Phần 1. Hướng dẫn**

**Mấu chốt:** biểu diễn ba tập bằng biểu đồ Ven rồi trừ dần phần giao để tìm số người chỉ thuộc một nhóm hoặc đúng hai nhóm.

**Bước 1.** Ý a: số người chỉ thuộc $A$ và $B$ (không thuộc $C$) bằng số người thuộc $A\cap B$ trừ đi những người thuộc cả ba nhóm.

**Bước 2.** Ý b, c: số người chỉ thuộc một nhóm bằng số người của nhóm đó trừ đi người thuộc đúng hai nhóm chứa nhóm đó và người thuộc cả ba nhóm.

**Bước 3.** Ý d: dùng công thức bao hàm – loại trừ cho ba tập để tìm số người thuộc ít nhất một nhóm, rồi lấy tổng số người trừ đi.

**Phần 2. Trình bày**

Số người thuộc đúng hai nhóm $A$, $B$ là $10-3=7$; đúng hai nhóm $A$, $C$ là $5-3=2$; đúng hai nhóm $B$, $C$ là $8-3=5$.

Ý a) Số người chỉ tham gia nhóm $A$ và $B$ là $7$ người, không phải $10$. Sai.

Ý b) Số người chỉ tham gia nhóm $A$ là $50-7-2-3=38$ người. Sai.

Ý c) Số người chỉ tham gia nhóm $C$ là $30-2-5-3=20$ người. Đúng.

Ý d) Số người tham gia ít nhất một nhóm là $50+40+30-10-5-8+3=100$ người.

Số người không tham gia nhóm nào là $120-100=20$ người. Đúng.

Vậy đáp án là Sai, Sai, Đúng, Đúng.

### Câu 52 | kho=dai | loai=dung_sai | dap_an=DSDS
**Đề:** Cho tập hợp $X=\{-3;-1;0;1;3\}$; $Y=\{-3;-1;0;x;y\}$. Xét tính đúng sai của các khẳng định sau:
a) $x=1$; $y=3$ thì tập hợp $X=Y$.
b) Tính chất đặc trưng của tập hợp $X$ là $X=\{x\in\mathbb{N}:2x+1\le5\}$.
c) Số tập hợp con của $X$ có $2$ phần tử là $10$.
d) Số tập con khác rỗng của tập hợp $X$ là $32$ tập hợp.

**Phần 1. Hướng dẫn**

**Mấu chốt:** so sánh phần tử của hai tập, kiểm tra tính chất đặc trưng bằng cách liệt kê, và dùng công thức đếm tập con theo số phần tử.

**Bước 1.** Ý a, b: thay giá trị của $x$, $y$ để đối chiếu phần tử của $Y$ với $X$, và liệt kê tập nghiệm của điều kiện $2x+1\le5$ với $x\in\mathbb{N}$ rồi so với $X$.

**Bước 2.** Ý c: tập $X$ có $5$ phần tử, số tập con gồm $2$ phần tử là $C_5^2$.

**Bước 3.** Ý d: tập có $n$ phần tử thì có $2^n$ tập con, trong đó có đúng một tập rỗng cần loại.

**Phần 2. Trình bày**

Ý a) Với $x=1$, $y=3$ thì $Y=\{-3;-1;0;1;3\}=X$. Đúng.

Ý b) Điều kiện $2x+1\le5\Leftrightarrow x\le2$, với $x\in\mathbb{N}$ ta được $\{0;1;2\}\ne X$. Sai.

Ý c) $X$ có $5$ phần tử nên số tập con có $2$ phần tử là $C_5^2=10$. Đúng.

Ý d) Số tập con của $X$ là $2^5=32$, trong đó có một tập rỗng nên số tập con khác rỗng là $32-1=31$. Sai.

Vậy đáp án là Đúng, Sai, Đúng, Sai.

### Câu 53 | kho=dai | loai=dung_sai | dap_an=SDSS
**Đề:** Cho ba tập hợp $A=\{x\in\mathbb{N}\mid(x+1)(x^2-5x+6)=0\}$; $B=\{x\in\mathbb{R}\mid2\le x<3\}$ và $C=\{2;3;m\}$. Xác định tính đúng sai của các mệnh đề sau
a) Tập hợp $A$ có $3$ phần tử
b) $2\in B$
c) $A\subset B$
d) Có $3$ giá trị của $m$ để $A=C$

**Phần 1. Hướng dẫn**

**Mấu chốt:** giải phương trình tích rồi giữ nghiệm tự nhiên để viết $A$, sau đó xét từng quan hệ giữa các tập.

**Bước 1.** Ý a: giải $x+1=0$ và $x^2-5x+6=0$, loại nghiệm không thuộc $\mathbb{N}$ vì $A$ chỉ chứa số tự nhiên rồi đếm phần tử.

**Bước 2.** Ý b, c: so từng phần tử với điều kiện $2\le x<3$, chú ý $B$ không chứa đầu mút bên phải.

**Bước 3.** Ý d: hai tập bằng nhau khi có cùng phần tử, nên $m$ phải là phần tử còn thiếu hoặc trùng với phần tử đã có của $C$.

**Phần 2. Trình bày**

$x+1=0\Leftrightarrow x=-1\notin\mathbb{N}$.

$x^2-5x+6=0\Leftrightarrow x=2$ hoặc $x=3$.

Vậy $A=\{2;3\}$.

Ý a) $A$ chỉ có $2$ phần tử. Sai.

Ý b) $2\ge2$ và $2<3$ nên $2\in B$. Đúng.

Ý c) $3\in A$ nhưng $3\notin B$ vì $B$ là nửa khoảng không chứa $3$ nên $A\not\subset B$. Sai.

Ý d) $A=C$ khi và chỉ khi $C=\{2;3;m\}$ có đúng hai phần tử $2$ và $3$, tức là $m=2$ hoặc $m=3$. Có $2$ giá trị của $m$, không phải $3$. Sai.

Vậy đáp án là Sai, Đúng, Sai, Sai.

### Câu 54 | kho=dai | loai=dung_sai | dap_an=DDSS
**Đề:** Cho hai tập hợp $A=(2;5)$ và $B=[2m-1;2m+3)$
a) $C_{\mathbb{R}}A=(-\infty;2]\cup[5;+\infty)$
b) Khi $m=0$ thì $A\cap B=(2;3)$.
c) $A\subset B\Leftrightarrow1\le m\le3$.
d) $A\cap B=\varnothing\Leftrightarrow\left[\begin{array}{l}m\ge6\\m\le-\dfrac{1}{2}\end{array}\right.$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** vẽ hai khoảng trên trục số, chú ý đầu mút mở hoặc đóng, rồi lập điều kiện về vị trí của hai đầu mút của $B$ so với $A$.

**Bước 1.** Ý a: phần bù của một khoảng trong $\mathbb{R}$ gồm các số nằm ngoài khoảng, đầu mút của khoảng thì thuộc phần bù.

**Bước 2.** Ý b: thay $m=0$ vào $B$ rồi lấy phần chung của hai khoảng trên trục số.

**Bước 3.** Ý c: $A\subset B$ khi đầu trái của $B$ không vượt quá đầu trái của $A$ và đầu phải của $B$ không nhỏ hơn đầu phải của $A$, chú ý $A$ mở nên được phép trùng đầu mút.

**Bước 4.** Ý d: $B$ luôn khác rỗng, nên $A\cap B=\varnothing$ khi $B$ nằm hẳn bên trái $A$ hoặc nằm hẳn bên phải $A$, xét kĩ đầu mút.

**Phần 2. Trình bày**

Ý a) $C_{\mathbb{R}}A=\mathbb{R}\setminus(2;5)=(-\infty;2]\cup[5;+\infty)$. Đúng.

Ý b) Khi $m=0$ thì $B=[-1;3)$.

$A\cap B=(2;5)\cap[-1;3)=(2;3)$. Đúng.

Ý c) $A\subset B\Leftrightarrow\begin{cases}2m-1\le2\\2m+3\ge5\end{cases}$.

$\Leftrightarrow\begin{cases}m\le\dfrac{3}{2}\\m\ge1\end{cases}$.

$\Leftrightarrow1\le m\le\dfrac{3}{2}$, khác điều kiện $1\le m\le3$ của đề. Sai.

Ý d) Vì $2m-1<2m+3$ nên $B\ne\varnothing$. Khi đó $A\cap B=\varnothing$ khi $2m+3\le2$ hoặc $2m-1\ge5$.

$\Leftrightarrow m\le-\dfrac{1}{2}$ hoặc $m\ge3$.

Điều kiện $m\ge6$ trong đề không đúng (với $m=3$ thì $B=[5;9)$ và $A\cap B=\varnothing$). Sai.

Vậy đáp án là Đúng, Đúng, Sai, Sai.

## PHẦN 3 | Chương I Mệnh đề – Tập hợp — Tự luận | tu_luan

### Câu 55 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Có bao nhiêu giá trị của $x$ để "$x\in\mathbb{N},x>0\Rightarrow x^2-9\le0$" là mệnh đề đúng?
**Ghi chú:** hiểu là đếm các giá trị $x$ thoả giả thiết "$x\in\mathbb{N},x>0$" mà kết luận $x^2-9\le0$ cũng đúng. Không đếm các giá trị làm giả thiết sai (như $x=0$): nếu đếm $x=0$ vì giả thiết sai thì $x=-1$, $x=\dfrac12$… cũng làm giả thiết sai, có vô số giá trị, câu hỏi mất nghĩa; chỉ cách hiểu này nhất quán.

**Phần 1. Hướng dẫn**

**Mấu chốt:** với $x$ thoả giả thiết, mệnh đề kéo theo đúng khi và chỉ khi kết luận đúng, nên đếm các số tự nhiên dương thoả $x^2-9\le0$.

**Bước 1.** Xác định tập giá trị của $x$ thoả giả thiết: $x$ là số tự nhiên và $x>0$, tức là $x\in\mathbb{N}^*$.

**Bước 2.** Với những $x$ đó vế trước đúng, nên mệnh đề đúng khi vế sau $x^2-9\le0$ đúng; giải bất phương trình này.

**Bước 3.** Lấy các số tự nhiên dương nằm trong tập nghiệm vừa tìm rồi đếm.

**Phần 2. Trình bày**

Với $x\in\mathbb{N}$, $x>0$ thì vế trước đúng, nên mệnh đề đúng khi và chỉ khi $x^2-9\le0$.

$x^2-9\le0\Leftrightarrow x^2\le9$.

$\Leftrightarrow-3\le x\le3$.

Kết hợp $x\in\mathbb{N}^*$ được $x\in\{1;2;3\}$.

Vậy có $3$ giá trị của $x$.

### Câu 56 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Xét mệnh đề: "$\forall x\in\mathbb{R},x^2+2-a>0$" với $a$ là một số thực cho trước. Có tất cả bao nhiêu giá trị nguyên dương của $a$ để mệnh đề đang xét là mệnh đề đúng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mệnh đề với mọi $x$ đúng khi giá trị nhỏ nhất của biểu thức vế trái vẫn lớn hơn $0$.

**Bước 1.** Nhận xét $x^2\ge0$ với mọi số thực $x$ và dấu bằng đạt được tại $x=0$ để tìm giá trị nhỏ nhất của $x^2+2-a$.

**Bước 2.** Điều kiện đúng với mọi $x$ tương đương giá trị nhỏ nhất đó dương, từ đó suy ra điều kiện của $a$.

**Bước 3.** Chọn các số nguyên dương $a$ thoả điều kiện vừa tìm được và đếm.

**Phần 2. Trình bày**

Vì $x^2\ge0$ với mọi $x\in\mathbb{R}$ nên $x^2+2-a\ge2-a$, dấu bằng xảy ra khi $x=0$.

Mệnh đề đúng $\Leftrightarrow2-a>0$.

$\Leftrightarrow a<2$.

Vì $a$ nguyên dương nên $a=1$.

Vậy có $1$ giá trị nguyên dương của $a$.

### Câu 57 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho hai tập khác rỗng $A=(m-1;4]$, $B=(-2;2m+2)$ với $m\in\mathbb{R}$. Có bao nhiêu giá trị nguyên của tham số $m$ để $A\cap B\ne\varnothing$?

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai khoảng có giao khác rỗng khi đầu mút trái lớn hơn của chúng nhỏ hơn đầu mút phải nhỏ hơn.

**Bước 1.** Dùng giả thiết hai tập khác rỗng để viết điều kiện đầu mút trái nhỏ hơn đầu mút phải của từng tập.

**Bước 2.** Viết điều kiện để giao khác rỗng: so từng đầu mút trái của một tập với đầu mút phải của tập kia.

**Bước 3.** Kết hợp các điều kiện trên trục số rồi đếm các số nguyên $m$ thoả mãn.

**Phần 2. Trình bày**

$A\ne\varnothing\Leftrightarrow m-1<4\Leftrightarrow m<5$.

$B\ne\varnothing\Leftrightarrow2m+2>-2\Leftrightarrow m>-2$.

$A\cap B\ne\varnothing\Leftrightarrow\begin{cases}m-1<2m+2\\-2<4\end{cases}$.

$\Leftrightarrow m>-3$.

Kết hợp ba điều kiện được $-2<m<5$.

Các giá trị nguyên của $m$ là $-1;0;1;2;3;4$.

Vậy có $6$ giá trị nguyên của $m$.

### Câu 58 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho các tập hợp khác rỗng $A=[m-1;2m+1)$ và $B=(-2;3)$. Có bao nhiêu giá trị nguyên của $m$ để $A\subset B$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $A\subset B$ khi hai đầu mút của $A$ đều nằm trong phạm vi của $B$, chú ý đầu mút trái của $A$ là đóng còn của $B$ là mở.

**Bước 1.** Dùng giả thiết $A$ khác rỗng để có điều kiện đầu mút trái nhỏ hơn đầu mút phải.

**Bước 2.** Đầu mút trái $m-1$ thuộc $A$ nên phải thuộc $B$, tức phải lớn hơn $-2$ (dấu bằng bị loại).

**Bước 3.** Đầu mút phải của $A$ là mở nên được phép bằng $3$, từ đó lập điều kiện thứ hai.

**Bước 4.** Giao các điều kiện rồi đếm số nguyên $m$.

**Phần 2. Trình bày**

$A\ne\varnothing\Leftrightarrow m-1<2m+1\Leftrightarrow m>-2$.

$A\subset B\Leftrightarrow\begin{cases}m-1>-2\\2m+1\le3\end{cases}$.

$\Leftrightarrow\begin{cases}m>-1\\m\le1\end{cases}$.

$\Leftrightarrow-1<m\le1$, thoả luôn điều kiện $m>-2$.

Các giá trị nguyên của $m$ là $0;1$.

Vậy có $2$ giá trị nguyên của $m$.

### Câu 59 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho các tập hợp khác rỗng $A=[m;m+3]$ và $B=(-2;4]$. Tìm $m$ để $A\cap B=\varnothing$ ?

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tập không giao nhau khi đoạn $A$ nằm hẳn bên trái hoặc nằm hẳn bên phải $B$ trên trục số.

**Bước 1.** Vẽ trục số, đặt $B=(-2;4]$ rồi xét hai vị trí của $A$ so với $B$: bên trái và bên phải.

**Bước 2.** Trường hợp $A$ bên trái: đầu mút phải của $A$ là đóng còn đầu mút trái của $B$ là mở, nên cho phép hai số này bằng nhau.

**Bước 3.** Trường hợp $A$ bên phải: đầu mút trái của $A$ là đóng và đầu mút phải của $B$ cũng đóng, nên hai số này không được bằng nhau; kết luận bằng cách hợp hai trường hợp.

**Phần 2. Trình bày**

$A\ne\varnothing$ với mọi $m$ vì $m<m+3$.

$A\cap B=\varnothing\Leftrightarrow m+3\le-2$ hoặc $m>4$.

$\Leftrightarrow m\le-5$ hoặc $m>4$.

Vậy $m\le-5$ hoặc $m>4$.

### Câu 60 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $A=\left[m-3;\dfrac{m+2}{4}\right)$, $B=(-\infty;-1)\cup[2;+\infty)$. Tính tổng các giá trị nguyên $m$ để $A\cap B=\varnothing$.
**Ghi chú:** nếu $A=\varnothing$ (khi $m\ge\dfrac{14}{3}$) thì $A\cap B=\varnothing$ với vô số $m$ nguyên, không tính được tổng; vì vậy hiểu $A$ là một khoảng thật sự (khác rỗng) — kí hiệu nửa khoảng $[a;b)$ chỉ dùng khi $a<b$, như các câu cùng dạng trong đề cương.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $A\cap B=\varnothing$ khi $A$ nằm trọn trong phần bù của $B$, tức là trong nửa khoảng $[-1;2)$.

**Bước 1.** Tìm phần bù của $B$ trong $\mathbb{R}$, chú ý đầu mút $-1$ thuộc phần bù còn $2$ thì không.

**Bước 2.** Viết điều kiện $A$ khác rỗng để đầu mút trái nhỏ hơn đầu mút phải.

**Bước 3.** Viết điều kiện để hai đầu mút của $A$ nằm trong $[-1;2)$ và giao với điều kiện khác rỗng.

**Bước 4.** Liệt kê các số nguyên $m$ thoả mãn rồi cộng lại.

**Phần 2. Trình bày**

$A\ne\varnothing\Leftrightarrow m-3<\dfrac{m+2}{4}$.

$\Leftrightarrow4m-12<m+2$.

$\Leftrightarrow m<\dfrac{14}{3}$.

Phần bù của $B$ là $[-1;2)$. $A\cap B=\varnothing\Leftrightarrow A\subset[-1;2)$.

$\Leftrightarrow\begin{cases}m-3\ge-1\\\dfrac{m+2}{4}\le2\end{cases}$.

$\Leftrightarrow\begin{cases}m\ge2\\m\le6\end{cases}$.

Kết hợp với $m<\dfrac{14}{3}$ được $2\le m<\dfrac{14}{3}$.

Các giá trị nguyên của $m$ là $2;3;4$.

Vậy tổng các giá trị nguyên của $m$ là $2+3+4=9$.

### Câu 61 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Có bao nhiêu giá trị nguyên $m$ để trong tập hợp $A=(m-1;m]\cap(3;5)$ có đúng một số tự nhiên?

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi $m$ nguyên, nửa khoảng $(m-1;m]$ chỉ chứa đúng một số nguyên là $m$, nên bài toán đưa về việc số đó có thuộc $(3;5)$ hay không.

**Bước 1.** Nhận xét độ dài nửa khoảng $(m-1;m]$ bằng $1$ và hai đầu mút nguyên, để tìm số nguyên duy nhất trong nửa khoảng đó.

**Bước 2.** Số tự nhiên trong $A$ phải thuộc cả hai tập đã giao, từ đó lập điều kiện của $m$.

**Bước 3.** Chọn các số nguyên $m$ thoả điều kiện rồi đếm.

**Phần 2. Trình bày**

Với $m\in\mathbb{Z}$, số nguyên duy nhất thuộc $(m-1;m]$ là $m$.

Do đó $A$ chứa một số nguyên khi và chỉ khi $m\in(3;5)$.

Số nguyên $m$ với $3<m<5$ là $m=4$.

Khi $m=4$, $A=(3;4]$ chứa đúng một số tự nhiên là $4$.

Vậy có $1$ giá trị nguyên của $m$.

### Câu 62 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Lớp 10A có $40$ học sinh, trong đó số học sinh tham gia đội bóng đá là $18$, số học sinh tham gia đội bóng chuyền là $15$. Biết rằng có $20$ học sinh không tham gia bất cứ môn nào. Hỏi có bao nhiêu em tham gia đồng thời cả hai môn bóng đá và bóng chuyền?

**Phần 1. Hướng dẫn**

**Mấu chốt:** đếm số học sinh tham gia ít nhất một môn rồi dùng công thức bao hàm – loại trừ cho hai tập hợp để tìm phần giao.

**Bước 1.** Đặt hai tập hợp là các học sinh tham gia bóng đá và bóng chuyền, dùng số học sinh không tham gia môn nào để tìm số học sinh thuộc hợp của hai tập.

**Bước 2.** Viết công thức $n(A\cup B)=n(A)+n(B)-n(A\cap B)$ và thay các số đã biết.

**Bước 3.** Giải phương trình để tìm số học sinh thuộc phần giao.

**Phần 2. Trình bày**

Gọi $A$ là tập học sinh tham gia bóng đá, $B$ là tập học sinh tham gia bóng chuyền.

Số học sinh tham gia ít nhất một môn là $n(A\cup B)=40-20=20$.

Ta có $n(A\cup B)=n(A)+n(B)-n(A\cap B)$.

$\Leftrightarrow20=18+15-n(A\cap B)$.

$\Leftrightarrow n(A\cap B)=33-20=13$.

Vậy có $13$ em tham gia đồng thời cả hai môn.

### Câu 63 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một lớp $10$C$14$ có $45$ học sinh chuẩn bị cho hội diễn văn nghệ chào mừng ngày nhà giáo Việt Nam $20/11$. Trong danh sách đăng kí tham gia tiết mục nhảy Flashmob và tiết mục hát, có $35$ học sinh tham gia tiết mục nhảy Flashmob, $10$ học sinh tham gia cả hai tiết mục. Hỏi có bao nhiêu học sinh trong lớp tham gia tiết mục hát? Biết rằng lớp $10$C$14$ có bạn Kiệt, Hạ, Toàn, Thiện bị khuyết tật hòa nhập nên không tham gia tiết mục nào.
**Ghi chú:** đề in "Một 10C14 có 45 học sinh" (thiếu chữ "lớp"), gõ thêm chữ "lớp".

**Phần 1. Hướng dẫn**

**Mấu chốt:** loại $4$ bạn không tham gia khỏi sĩ số để có số học sinh thuộc hợp hai tiết mục, rồi dùng công thức bao hàm – loại trừ để tìm số học sinh hát.

**Bước 1.** Tính số học sinh có tham gia ít nhất một tiết mục bằng sĩ số lớp trừ số bạn không tham gia tiết mục nào.

**Bước 2.** Viết công thức $n(F\cup H)=n(F)+n(H)-n(F\cap H)$ với $F$ là tập nhảy Flashmob, $H$ là tập hát.

**Bước 3.** Thay số đã biết và giải ra số học sinh tham gia hát.

**Phần 2. Trình bày**

Số học sinh tham gia ít nhất một tiết mục là $45-4=41$.

Gọi $F$ là tập học sinh nhảy Flashmob, $H$ là tập học sinh hát. Ta có $n(F\cup H)=n(F)+n(H)-n(F\cap H)$.

$\Leftrightarrow41=35+n(H)-10$.

$\Leftrightarrow n(H)=41-35+10=16$.

Vậy có $16$ học sinh tham gia tiết mục hát.

## GHI CHÚ CHO NGƯỜI DUYỆT

Câu 55 (trạm soát sửa: đếm $x$ thoả giả thiết $x\in\mathbb{N},x>0$ ⇒ đáp số $3$; trạm soạn từng tính cả $x=0$ ra $4$ — cách đó không nhất quán vì $x$ âm / không nguyên cũng làm giả thiết sai) và Câu 60 (giả sử $A\ne\varnothing$) có diễn giải ở Ghi chú. Câu 51 hiểu "cả hai nhóm" là phần giao (gồm cả người thuộc ba nhóm). Không có hình đề; không vẽ hình giải (câu 62, 63 giải bằng công thức, không cần Ven).
