# ĐỀ | Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Đoàn Thị Điểm, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 4 | Dạng 4. Tính giá trị của biểu thức | tu_luan

### Bài 26a | kho=dai | loai=tra_loi_ngan | dap_an=100
**Đề:** Tính giá trị của mỗi đa thức sau: $A=xy+x^2y^2+x^3y^3+x^4y^4+\dots+x^{100}y^{100}$ tại $x=-1;\ y=-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mọi hạng tử đều có dạng $x^ky^k$, viết thành $(xy)^k$ thì chỉ cần tính tích $xy$ một lần, không phải tính một trăm luỹ thừa riêng rẽ.

**Bước 1.** Nhận ra các hạng tử $xy;\ x^2y^2;\ x^3y^3;\ \dots$ có số mũ của $x$ và của $y$ bằng nhau, nên viết được thành $(xy)^k$ (luỹ thừa của một tích).

**Bước 2.** Thay $x=-1;\ y=-1$ để tính giá trị của tích $xy$ đúng một lần.

**Bước 3.** Từ giá trị của $xy$, tính $(xy)^k$ với mọi $k$ rồi nhận xét xem các hạng tử của đa thức có bằng nhau hay không.

**Bước 4.** Đếm số hạng tử của đa thức (số mũ $k$ chạy từ $1$ đến $100$) rồi cộng các giá trị bằng nhau lại.

**Chú ý:** số mũ chạy từ $1$ chứ không phải từ $0$; đếm cả hai đầu mút khi tính số hạng tử.

**Phần 2. Trình bày**

$A=xy+x^2y^2+x^3y^3+x^4y^4+\dots+x^{100}y^{100}$

Mỗi hạng tử có dạng $x^ky^k=(xy)^k$ với $k=1;\ 2;\ 3;\ \dots;\ 100$.

Với $x=-1;\ y=-1$ thì $xy=(-1)\cdot(-1)=1$.

Do đó $x^ky^k=(xy)^k=1^k=1$ với mọi $k$.

Đa thức $A$ có 100 hạng tử (ứng với $k=1;\ 2;\ \dots;\ 100$), mỗi hạng tử đều bằng 1.

$A=1+1+1+\dots+1$ (100 số hạng)

$A=100$

Vậy $A=100$ tại $x=-1;\ y=-1$.

### Bài 26b | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tính giá trị của mỗi đa thức sau: $B=xyz+x^2y^2z^2+x^3y^3z^3+x^4y^4z^4+\dots+x^{100}y^{100}z^{100}$ tại $x=-1;\ y=-1;\ z=-1$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết mỗi hạng tử thành $(xyz)^k$; vì tích $xyz$ là số âm nên các hạng tử đổi dấu xen kẽ, và ta cộng chúng theo từng cặp liền nhau.

**Bước 1.** Nhận ra các hạng tử $xyz;\ x^2y^2z^2;\ \dots$ có số mũ của ba biến bằng nhau, nên viết được thành $(xyz)^k$ (luỹ thừa của một tích).

**Bước 2.** Thay $x=y=z=-1$ để tính tích $xyz$; nhớ tích của ba số âm mang dấu gì.

**Bước 3.** Xét dấu từng hạng tử $(xyz)^k$ theo $k$ lẻ hay chẵn: luỹ thừa bậc lẻ của số âm là số âm, luỹ thừa bậc chẵn là số dương.

**Bước 4.** Ghép hai hạng tử liên tiếp thành một cặp (số mũ lẻ với số mũ chẵn kề sau nó), tính tổng mỗi cặp rồi cộng tất cả các cặp.

**Chú ý:** tích của ba số âm là số âm, không phải số dương; số hạng tử chẵn nên ghép cặp được hết, không thừa hạng tử nào.

**Phần 2. Trình bày**

$B=xyz+x^2y^2z^2+x^3y^3z^3+x^4y^4z^4+\dots+x^{100}y^{100}z^{100}$

Mỗi hạng tử có dạng $x^ky^kz^k=(xyz)^k$ với $k=1;\ 2;\ 3;\ \dots;\ 100$.

Với $x=y=z=-1$ thì $xyz=(-1)\cdot(-1)\cdot(-1)=-1$.

Do đó $x^ky^kz^k=(xyz)^k=(-1)^k$.

$B=(-1)^1+(-1)^2+(-1)^3+(-1)^4+\dots+(-1)^{99}+(-1)^{100}$

$B=(-1)+1+(-1)+1+\dots+(-1)+1$

Đa thức có 100 hạng tử nên chia được thành 50 cặp liên tiếp, mỗi cặp có tổng $(-1)+1=0$.

$B=[(-1)+1]+[(-1)+1]+\dots+[(-1)+1]$ (50 cặp)

$B=0+0+\dots+0$

$B=0$

Vậy $B=0$ tại $x=-1;\ y=-1;\ z=-1$.

### Bài 27a | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tính giá trị của mỗi đa thức sau biết $x+y-2=0$: $B=x^3-2x^2-xy^2+2xy+2y+2x-2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đề không cho riêng $x$ và $y$ mà chỉ cho $x+y-2=0$; vì vậy phải ghép các hạng tử của $B$ để lộ ra các nhóm $x-2$, $y-2$ hoặc $x+y$, rồi thay bằng giá trị suy ra từ giả thiết.

**Bước 1.** Chuyển vế để đổi giả thiết thành các đẳng thức dùng được: tổng $x+y$, hiệu $x-2$ và hiệu $y-2$ viết theo $y$ và $x$.

**Bước 2.** Ghép $x^3-2x^2$ và $-xy^2+2xy$; mỗi cặp có một thừa số chung, đặt ra ngoài (tính chất phân phối viết ngược) để lộ nhóm $x-2$ và nhóm $y-2$.

**Bước 3.** Ghép hai hạng tử $2x+2y$ và đặt thừa số $2$ ra ngoài để lộ nhóm $x+y$.

**Bước 4.** Thay mỗi nhóm bằng giá trị đã suy ra ở bước 1; hai hạng tử chứa $x^2y$ trái dấu nhau nên triệt tiêu, rồi tính nốt phần còn lại.

**Chú ý:** dấu trừ đứng trước $xy^2$ phải được giữ khi đặt ngoặc: $-xy^2+2xy=-(xy^2-2xy)$.

Thử lại: với $x=1;\ y=1$ (thoả $x+y-2=0$) thì $B=1-2-1+2+2+2-2=2$.

**Phần 2. Trình bày**

Vì $x+y-2=0$ nên $x+y=2$, suy ra $x-2=-y$ và $y-2=-x$.

$B=x^3-2x^2-xy^2+2xy+2y+2x-2$

$B=(x^3-2x^2)-(xy^2-2xy)+(2x+2y)-2$

$B=x^2(x-2)-xy(y-2)+2(x+y)-2$

Thay $x-2=-y$; $y-2=-x$; $x+y=2$ vào $B$ ta được:

$B=x^2(-y)-xy(-x)+2\cdot 2-2$

$B=-x^2y+x^2y+4-2$

$B=2$

Vậy $B=2$ khi $x+y-2=0$.

### Bài 27b | kho=dai | loai=tra_loi_ngan | dap_an=3
**Đề:** Tính giá trị của mỗi đa thức sau biết $x+y-2=0$: $C=x^4+2x^3y-2x^3+x^2y^2-2x^2y-x(x+y)+2x+3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giả thiết cho biết $x+y-2=0$; nếu gom các hạng tử của $C$ thành những nhóm mà mỗi nhóm đều có thừa số $x+y-2$ thì cả nhóm bằng $0$, chỉ còn lại số hạng tự do.

**Bước 1.** Nhân $-x$ với $(x+y)$ để bỏ ngoặc, khi đó mọi hạng tử của $C$ đều là đơn thức và dễ ghép nhóm.

**Bước 2.** Tách $2x^3y$ thành $x^3y+x^3y$, rồi ghép thành ba nhóm: $x^4+x^3y-2x^3$, $x^3y+x^2y^2-2x^2y$ và $-x^2-xy+2x$.

**Bước 3.** Đặt từng đơn thức ra ngoài ở mỗi nhóm (tính chất phân phối viết ngược) để cả ba nhóm cùng lộ ra thừa số $x+y-2$, rồi đặt tiếp thừa số này ra ngoài.

**Bước 4.** Thay $x+y-2=0$: một tích có thừa số bằng $0$ thì bằng $0$, nên chỉ còn lại số hạng tự do.

**Chú ý:** dấu trừ đứng trước $x(x+y)$ nên nhóm thứ ba phải là $-x(x+y-2)$, đừng viết thành dấu cộng.

Thử lại: với $x=1;\ y=1$ thì $C=1+2-2+1-2-2+2+3=3$.

**Phần 2. Trình bày**

$C=x^4+2x^3y-2x^3+x^2y^2-2x^2y-x(x+y)+2x+3$

$C=x^4+2x^3y-2x^3+x^2y^2-2x^2y-x^2-xy+2x+3$

$C=(x^4+x^3y-2x^3)+(x^3y+x^2y^2-2x^2y)+(-x^2-xy+2x)+3$

$C=x^3(x+y-2)+x^2y(x+y-2)-x(x+y-2)+3$

$C=(x+y-2)(x^3+x^2y-x)+3$

Vì $x+y-2=0$ nên:

$C=0\cdot(x^3+x^2y-x)+3$

$C=3$

Vậy $C=3$ khi $x+y-2=0$.

## PHẦN 5 | Dạng 5. Tìm x | tu_luan

### Bài 28a | kho=dai | loai=tra_loi_ngan | dap_an=3
**Đề:** Tìm $x$, biết: $2x(6x-1)-3x(4x-1)-3=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** sau khi nhân để bỏ ngoặc, hai hạng tử bậc hai là hai số đối nhau nên triệt tiêu; vế trái chỉ còn một hạng tử chứa $x$ và một số.

**Bước 1.** Nhân $2x$ với từng hạng tử của $(6x-1)$ và nhân $3x$ với từng hạng tử của $(4x-1)$ để bỏ hai dấu ngoặc.

**Bước 2.** Giữ dấu trừ đứng trước $3x$ khi nhân: $-3x$ nhân với hạng tử $-1$ trong ngoặc cho kết quả dương.

**Bước 3.** Nhóm các hạng tử đồng dạng ở vế trái; hai hạng tử bậc hai triệt tiêu nhau.

**Bước 4.** Chuyển số hạng tự do sang vế phải (đổi dấu) để tìm $x$.

**Phần 2. Trình bày**

$2x(6x-1)-3x(4x-1)-3=0$

$12x^2-2x-12x^2+3x-3=0$

$(12x^2-12x^2)+(-2x+3x)-3=0$

$x-3=0$

$x=3$

Vậy $x=3$.

### Bài 28b | kho=dai | loai=tra_loi_ngan | dap_an=-1
**Đề:** Tìm $x$, biết: $6x^2-(2x-3)(3x+2)-1=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tích $(2x-3)(3x+2)$ có hạng tử bậc hai đúng bằng $6x^2$ và đang bị trừ đi, nên hai hạng tử bậc hai triệt tiêu và bài trở thành tìm $x$ bậc nhất.

**Bước 1.** Nhân đa thức với đa thức: nhân từng hạng tử của $(2x-3)$ với từng hạng tử của $(3x+2)$ rồi thu gọn các hạng tử đồng dạng.

**Bước 2.** Đặt tích vừa tính trong ngoặc, có dấu trừ đứng trước; bỏ ngoặc thì phải đổi dấu mọi hạng tử trong ngoặc.

**Bước 3.** Thu gọn vế trái: hạng tử bậc hai triệt tiêu, còn lại một hạng tử chứa $x$ và các số.

**Bước 4.** Chuyển số sang vế phải rồi chia cho hệ số của $x$.

**Chú ý:** hạng tử cuối của tích là $-6$; khi đổi dấu cả ngoặc nó thành $+6$, đừng quên.

**Phần 2. Trình bày**

$6x^2-(2x-3)(3x+2)-1=0$

$6x^2-(6x^2+4x-9x-6)-1=0$

$6x^2-(6x^2-5x-6)-1=0$

$6x^2-6x^2+5x+6-1=0$

$5x+5=0$

$5x=-5$

$x=(-5):5$

$x=-1$

Vậy $x=-1$.

### Bài 28c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $(x-5)(x-4)-(x+1)(x-2)=7$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đề là hiệu của hai tích hai ngoặc; khai triển từng tích rồi trừ, hai hạng tử $x^2$ giống nhau triệt tiêu nên chỉ còn bậc nhất.

**Bước 1.** Nhân đa thức với đa thức ở từng tích: nhân từng hạng tử của ngoặc này với từng hạng tử của ngoặc kia rồi gom hạng tử đồng dạng.

**Bước 2.** Viết mỗi tích kết quả trong ngoặc; vì có dấu trừ đứng trước tích thứ hai, khi bỏ ngoặc phải đổi dấu mọi hạng tử của nó.

**Bước 3.** Thu gọn vế trái: hai hạng tử $x^2$ triệt tiêu, còn một hạng tử chứa $x$ cùng một số.

**Bước 4.** Chuyển số hạng tự do sang vế phải rồi chia hai vế cho hệ số của $x$ (hai số cùng dấu âm nên thương dương).

**Chú ý:** kết quả là phân số chứ không phải số nguyên, điều đó bình thường.

Thử lại: với $x=\dfrac{15}{8}$ thì $\left(-\dfrac{25}{8}\right)\cdot\left(-\dfrac{17}{8}\right)-\dfrac{23}{8}\cdot\left(-\dfrac{1}{8}\right)=\dfrac{425}{64}+\dfrac{23}{64}=7$.

**Phần 2. Trình bày**

$(x-5)(x-4)-(x+1)(x-2)=7$

$(x^2-4x-5x+20)-(x^2-2x+x-2)=7$

$(x^2-9x+20)-(x^2-x-2)=7$

$x^2-9x+20-x^2+x+2=7$

$-8x+22=7$

$-8x=7-22$

$-8x=-15$

$x=(-15):(-8)$

$x=\dfrac{15}{8}$

Vậy $x=\dfrac{15}{8}$.

### Bài 28d | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm $x$, biết: $(x-5)(x-1)=(x-1)(x-2)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai vế đều có thừa số $x-1$ nhưng ta không chia hai vế cho $x-1$ (chưa biết nó khác $0$); thay vào đó khai triển cả hai vế rồi chuyển vế, hạng tử $x^2$ hai bên triệt tiêu.

**Bước 1.** Nhân đa thức với đa thức ở từng vế: nhân từng hạng tử của ngoặc này với từng hạng tử của ngoặc kia, rồi thu gọn.

**Bước 2.** Chuyển các hạng tử chứa $x$ về một vế và các số về vế còn lại; hai hạng tử $x^2$ ở hai vế triệt tiêu nhau.

**Bước 3.** Chia hai vế cho hệ số của $x$ để tìm $x$.

**Chú ý:** nếu chia hai vế cho $x-1$ mà không xét trường hợp thừa số đó bằng $0$ thì có thể bỏ sót giá trị cần tìm; khai triển như trên thì không sót.

**Phần 2. Trình bày**

$(x-5)(x-1)=(x-1)(x-2)$

$x^2-x-5x+5=x^2-2x-x+2$

$x^2-6x+5=x^2-3x+2$

$x^2-6x-x^2+3x=2-5$

$-3x=-3$

$x=(-3):(-3)$

$x=1$

Vậy $x=1$.

### Bài 29a | kho=dai | loai=tra_loi_ngan | dap_an=0,2
**Đề:** Tìm $x$, biết: $-5(x^2-3x+1)+x(1+5x)=x-2$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai hạng tử bậc hai $-5x^2$ và $5x^2$ là hai số đối nhau nên triệt tiêu; còn lại các hạng tử chứa $x$ ở cả hai vế để chuyển vế.

**Bước 1.** Nhân $-5$ với từng hạng tử trong ngoặc thứ nhất và $x$ với từng hạng tử trong ngoặc thứ hai để bỏ ngoặc.

**Bước 2.** Thu gọn vế trái: hai hạng tử bậc hai triệt tiêu, các hạng tử chứa $x$ gộp lại thành một hạng tử.

**Bước 3.** Chuyển các hạng tử chứa $x$ sang một vế và các số sang vế còn lại, nhớ đổi dấu khi chuyển.

**Bước 4.** Chia hai vế cho hệ số của $x$ rồi viết kết quả dưới dạng số thập phân.

**Chú ý:** $-5$ nhân với $-3x$ cho $+15x$ (hai số âm nhân nhau được số dương).

**Phần 2. Trình bày**

$-5(x^2-3x+1)+x(1+5x)=x-2$

$-5x^2+15x-5+x+5x^2=x-2$

$(-5x^2+5x^2)+(15x+x)-5=x-2$

$16x-5=x-2$

$16x-x=-2+5$

$15x=3$

$x=3:15$

$x=\dfrac{1}{5}$

$x=0{,}2$

Vậy $x=0{,}2$.

### Bài 29b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $12x^2-4x(3x+5)=10x-17$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tích $4x(3x+5)$ có hạng tử bậc hai đúng bằng $12x^2$ và đang bị trừ đi, nên hai hạng tử bậc hai triệt tiêu; hạng tử chứa $x$ còn lại ở cả hai vế.

**Bước 1.** Nhân $4x$ với từng hạng tử của $(3x+5)$ để bỏ ngoặc, giữ dấu trừ đứng trước tích.

**Bước 2.** Thu gọn vế trái: hai hạng tử bậc hai là hai số đối nhau nên triệt tiêu.

**Bước 3.** Chuyển hạng tử chứa $x$ ở vế phải sang vế trái và số tự do sang vế phải, nhớ đổi dấu khi chuyển.

**Bước 4.** Chia hai vế cho hệ số của $x$; hai vế cùng âm nên thương là phân số dương.

**Chú ý:** hệ số của $x$ sau khi gộp là số âm, đừng quên dấu khi chia.

Thử lại: với $x=\dfrac{17}{30}$ thì $-20x=-\dfrac{34}{3}$ và $10x-17=\dfrac{17}{3}-17=-\dfrac{34}{3}$, hai vế bằng nhau.

**Phần 2. Trình bày**

$12x^2-4x(3x+5)=10x-17$

$12x^2-12x^2-20x=10x-17$

$-20x=10x-17$

$-20x-10x=-17$

$-30x=-17$

$x=(-17):(-30)$

$x=\dfrac{17}{30}$

Vậy $x=\dfrac{17}{30}$.

### Bài 29c | kho=dai | loai=tra_loi_ngan | dap_an=-1,5
**Đề:** Tìm $x$, biết: $-4x(x-5)+7x(x-4)-3x^2=12$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** ba hạng tử bậc hai sau khi nhân có tổng bằng $0$ nên triệt tiêu hết; vế trái còn lại một hạng tử chứa $x$ mà thôi.

**Bước 1.** Nhân $-4x$ với từng hạng tử của $(x-5)$ và $7x$ với từng hạng tử của $(x-4)$, chú ý dấu của hệ số $-4x$.

**Bước 2.** Gom các hạng tử bậc hai lại: tổng ba hệ số của chúng, kể cả $-3x^2$ có sẵn, cho biết chúng triệt tiêu hay không.

**Bước 3.** Gom các hạng tử chứa $x$ thành một hạng tử rồi chia hai vế cho hệ số của nó.

**Chú ý:** $-4x$ nhân với $-5$ cho $+20x$; $7x$ nhân với $-4$ cho $-28x$; đừng nhầm dấu.

**Phần 2. Trình bày**

$-4x(x-5)+7x(x-4)-3x^2=12$

$-4x^2+20x+7x^2-28x-3x^2=12$

$(-4x^2+7x^2-3x^2)+(20x-28x)=12$

$-8x=12$

$x=12:(-8)$

$x=-\dfrac{3}{2}$

$x=-1{,}5$

Vậy $x=-1{,}5$.

### Bài 29d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tìm $x$, biết: $4x^2-2x+3-4x(x+5)=7x-3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** $4x^2$ có sẵn bị trừ đi $4x\cdot x=4x^2$ nên hai hạng tử bậc hai triệt tiêu; hạng tử chứa $x$ còn lại nằm ở cả hai vế.

**Bước 1.** Nhân $4x$ với từng hạng tử của $(x+5)$ để bỏ ngoặc, giữ dấu trừ đứng trước tích.

**Bước 2.** Thu gọn vế trái: hạng tử bậc hai triệt tiêu, hai hạng tử chứa $x$ gộp lại thành một.

**Bước 3.** Chuyển các hạng tử chứa $x$ sang một vế và các số sang vế còn lại, nhớ đổi dấu khi chuyển.

**Bước 4.** Chia hai vế cho hệ số của $x$ để tìm $x$.

**Chú ý:** số $+3$ ở vế trái khi chuyển sang vế phải đổi thành $-3$ và cộng với $-3$ có sẵn, không triệt tiêu với nó.

Thử lại: với $x=\dfrac{6}{29}$ thì $-22x+3=-\dfrac{132}{29}+\dfrac{87}{29}=-\dfrac{45}{29}$ và $7x-3=\dfrac{42}{29}-\dfrac{87}{29}=-\dfrac{45}{29}$, hai vế bằng nhau.

**Phần 2. Trình bày**

$4x^2-2x+3-4x(x+5)=7x-3$

$4x^2-2x+3-4x^2-20x=7x-3$

$(4x^2-4x^2)+(-2x-20x)+3=7x-3$

$-22x+3=7x-3$

$-22x-7x=-3-3$

$-29x=-6$

$x=(-6):(-29)$

$x=\dfrac{6}{29}$

Vậy $x=\dfrac{6}{29}$.

### Bài 30a | kho=dai | loai=tra_loi_ngan | dap_an=-2
**Đề:** Tìm $x$: $5x(12x+7)-3x(20x-5)=-100$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** sau khi nhân, hai hạng tử bậc hai có cùng hệ số nhưng trái dấu nên triệt tiêu; hai hạng tử chứa $x$ cùng dấu cộng lại thành một.

**Bước 1.** Nhân $5x$ với từng hạng tử của $(12x+7)$ và $3x$ với từng hạng tử của $(20x-5)$ để bỏ hai ngoặc.

**Bước 2.** Chú ý dấu trừ trước $3x(20x-5)$: nhân xong, hạng tử $-3x\cdot(-5)$ trở thành số dương.

**Bước 3.** Nhóm các hạng tử đồng dạng ở vế trái rồi chia hai vế cho hệ số của $x$.

**Chú ý:** vế phải là số âm, hệ số của $x$ là số dương nên $x$ là số âm.

**Phần 2. Trình bày**

$5x(12x+7)-3x(20x-5)=-100$

$60x^2+35x-60x^2+15x=-100$

$(60x^2-60x^2)+(35x+15x)=-100$

$50x=-100$

$x=(-100):50$

$x=-2$

Vậy $x=-2$.

### Bài 30b | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm $x$: $(x+1)(x+2)(x+5)-x^2(x+8)=27$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tích ba nhị thức phải nhân dần từng bước; hạng tử bậc ba và hạng tử bậc hai của nó triệt tiêu với tích $x^2(x+8)$ đang bị trừ, chỉ còn bậc nhất.

**Bước 1.** Nhân hai ngoặc đầu $(x+1)(x+2)$ trước, thu gọn thành một đa thức ba hạng tử.

**Bước 2.** Nhân đa thức vừa được với $(x+5)$, rồi nhân $x^2$ với $(x+8)$ để bỏ nốt ngoặc ở tích thứ hai.

**Bước 3.** Bỏ ngoặc có dấu trừ phía trước (đổi dấu mọi hạng tử), gom các hạng tử đồng dạng: bậc ba và bậc hai đều triệt tiêu.

**Bước 4.** Chuyển số hạng tự do sang vế phải rồi chia hai vế cho hệ số của $x$.

**Chú ý:** khi nhân $(x^2+3x+2)$ với $(x+5)$ phải nhân đủ sáu tích, không bỏ sót hạng tử nào.

**Phần 2. Trình bày**

$(x+1)(x+2)(x+5)-x^2(x+8)=27$

Ta có $(x+1)(x+2)=x^2+2x+x+2=x^2+3x+2$.

$(x^2+3x+2)(x+5)-x^2(x+8)=27$

$x^3+5x^2+3x^2+15x+2x+10-x^3-8x^2=27$

$(x^3-x^3)+(5x^2+3x^2-8x^2)+(15x+2x)+10=27$

$17x+10=27$

$17x=27-10$

$17x=17$

$x=17:17$

$x=1$

Vậy $x=1$.

### Bài 30c | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tìm $x$: $(4x+3)(2x-1)-(8x+1)(x+3)+29=0$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai tích đều có hạng tử bậc hai bằng $8x^2$, một cái cộng một cái bị trừ nên triệt tiêu; bài đưa về bậc nhất.

**Bước 1.** Nhân đa thức với đa thức ở từng tích: nhân từng hạng tử của ngoặc này với từng hạng tử của ngoặc kia rồi thu gọn.

**Bước 2.** Đặt mỗi tích kết quả trong ngoặc; bỏ ngoặc của tích thứ hai thì đổi dấu mọi hạng tử vì có dấu trừ đứng trước.

**Bước 3.** Gom các hạng tử đồng dạng: hai hạng tử bậc hai triệt tiêu, các số tự do cộng với $29$.

**Bước 4.** Chuyển số sang vế phải rồi chia hai vế cho hệ số của $x$.

**Chú ý:** các số tự do $-3$, $-3$ và $+29$ phải cộng cả ba, không bỏ sót số $-3$ do đổi dấu.

**Phần 2. Trình bày**

$(4x+3)(2x-1)-(8x+1)(x+3)+29=0$

$(8x^2-4x+6x-3)-(8x^2+24x+x+3)+29=0$

$(8x^2+2x-3)-(8x^2+25x+3)+29=0$

$8x^2+2x-3-8x^2-25x-3+29=0$

$(8x^2-8x^2)+(2x-25x)+(-3-3+29)=0$

$-23x+23=0$

$-23x=-23$

$x=(-23):(-23)$

$x=1$

Vậy $x=1$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Không có câu nào cần CEO quyết thêm; đề đọc rõ (đã phóng to ảnh trang 3 và 4 đối chiếu từng số mũ, dấu). Bài 26: dấu "…" nghĩa là số mũ chạy liên tục từ 1 đến 100 (100 hạng tử).
- Phạm vi: chỉ Chương I. Bài 27 dùng "đặt thừa số chung" theo tính chất phân phối (không dùng hằng đẳng thức, không phân tích nhân tử). Bài 28d khai triển rồi chuyển vế (không chia hai vế cho $x-1$, không dùng "tích bằng 0").
- Phân loại: 26a, 26b, 27a, 27b, 28a, 28b, 28d, 29a (0,2), 29c (-1,5), 30a, 30b, 30c là trả lời ngắn (số nguyên / thập phân vừa 4 ô); 28c ($\dfrac{15}{8}$ = 1,875 quá 4 ô), 29b ($\dfrac{17}{30}$), 29d ($\dfrac{6}{29}$) là tự luận.
- Mọi đáp số đã thử lại bằng máy (số hữu tỉ chính xác): Bài 26 cộng đủ 100 hạng tử; Bài 27 kiểm đồng nhất thức nhóm hạng tử tại nhiều bộ số rồi thay $y=2-x$; Bài 28–30 kiểm vế trái trừ vế phải là đa thức bậc nhất, thay ngược giá trị $x$ tìm được ra 0.
