# ĐỀ | Đề cương ôn tập giữa học kì I Toán 9 — THCS & THPT Nguyễn Siêu (Hà Nội) 2026–2027
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 3 | C. Bài tập tham khảo và nâng cao (Bài 1–5) | tu_luan

### Bài 1a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức: $ab\le\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}$.
**Chưa chắc:** đề cương in $ab\le\dfrac{(a+b)^2}{2}\le\dfrac{a^2+b^2}{2}$ — đúng như in thì vế sau SAI (với $a=b=1$: $2\le1$); đã nhập dạng quen thuộc $ab\le\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}$ (số mũ $2$ đặt cho cả phân số).

**Phần 1. Hướng dẫn**

**Mấu chốt:** bất đẳng thức kép thì chứng minh từng vế, mỗi vế xét hiệu của hai biểu thức rồi biến đổi hiệu đó về bình phương của một biểu thức.

**Bước 1.** Tách bất đẳng thức kép thành hai bất đẳng thức riêng: vế thứ nhất so $ab$ với $\left(\dfrac{a+b}{2}\right)^2$, vế thứ hai so $\left(\dfrac{a+b}{2}\right)^2$ với $\dfrac{a^2+b^2}{2}$.

**Bước 2.** Với mỗi bất đẳng thức, lập hiệu "vế lớn trừ vế nhỏ", khai triển hằng đẳng thức $(a+b)^2$ rồi quy đồng mẫu số.

**Bước 3.** Thu gọn tử thức để nhận ra một hằng đẳng thức, từ đó thấy hiệu bằng một bình phương chia cho số dương nên không âm.

**Bước 4.** Kết luận từng vế, ghép lại thành bất đẳng thức kép và nêu khi nào dấu bằng xảy ra.

**Phần 2. Trình bày**

Xét hiệu của vế thứ nhất:

$\left(\dfrac{a+b}{2}\right)^2-ab=\dfrac{a^2+2ab+b^2}{4}-ab$

$=\dfrac{a^2+2ab+b^2-4ab}{4}$

$=\dfrac{a^2-2ab+b^2}{4}$

$=\dfrac{(a-b)^2}{4}$

Vì $(a-b)^2\ge0$ nên $\dfrac{(a-b)^2}{4}\ge0$, suy ra $ab\le\left(\dfrac{a+b}{2}\right)^2$ (1).

Xét hiệu của vế thứ hai:

$\dfrac{a^2+b^2}{2}-\left(\dfrac{a+b}{2}\right)^2=\dfrac{2a^2+2b^2}{4}-\dfrac{a^2+2ab+b^2}{4}$

$=\dfrac{2a^2+2b^2-a^2-2ab-b^2}{4}$

$=\dfrac{a^2-2ab+b^2}{4}$

$=\dfrac{(a-b)^2}{4}\ge0$

Suy ra $\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}$ (2).

Từ (1) và (2) ta có $ab\le\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}$. Dấu $=$ xảy ra khi $a-b=0$, tức là $a=b$.

Vậy bất đẳng thức đã cho được chứng minh.

### Bài 1b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức: $\dfrac{a^3+b^3}{2}\ge\left(\dfrac{a+b}{2}\right)^3$, với $a,\ b\ge0$.
**Chưa chắc:** đề cương in $\dfrac{a^3+b^3}{2}\ge\dfrac{(a+b)^3}{2}$ — đúng như in thì SAI (với $a=b=1$: $1\ge4$); đã nhập dạng quen thuộc $\dfrac{a^3+b^3}{2}\ge\left(\dfrac{a+b}{2}\right)^3$ (số mũ $3$ đặt cho cả phân số).

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét hiệu hai vế rồi phân tích tử thức thành nhân tử, trong đó có một thừa số là bình phương và một thừa số là $a+b$, chính thừa số này cần điều kiện $a,\ b\ge0$.

**Bước 1.** Lập hiệu vế trái trừ vế phải rồi quy đồng mẫu số về $8$ để gộp thành một phân thức duy nhất.

**Bước 2.** Khai triển $(a+b)^3$ bằng hằng đẳng thức, rút gọn các hạng tử đồng dạng ở tử thức.

**Bước 3.** Phân tích tử thức thành nhân tử bằng cách nhóm hạng tử và đặt nhân tử chung, rồi dùng hằng đẳng thức hiệu hai bình phương.

**Bước 4.** Xét dấu từng thừa số: bình phương thì không âm với mọi số thực, còn thừa số kia chỉ chắc chắn không âm nhờ điều kiện đề cho; từ đó kết luận.

**Chú ý:** nếu không có điều kiện $a,\ b\ge0$ thì thừa số $a+b$ có thể âm và hiệu có thể âm, bất đẳng thức không còn đúng.

**Phần 2. Trình bày**

Xét hiệu $H=\dfrac{a^3+b^3}{2}-\left(\dfrac{a+b}{2}\right)^3$.

$H=\dfrac{4(a^3+b^3)}{8}-\dfrac{(a+b)^3}{8}$

$=\dfrac{4a^3+4b^3-(a^3+3a^2b+3ab^2+b^3)}{8}$

$=\dfrac{3a^3+3b^3-3a^2b-3ab^2}{8}$

$=\dfrac{3(a^3-a^2b+b^3-ab^2)}{8}$

$=\dfrac{3[a^2(a-b)-b^2(a-b)]}{8}$

$=\dfrac{3(a-b)(a^2-b^2)}{8}$

$=\dfrac{3(a-b)^2(a+b)}{8}$

Ta có $(a-b)^2\ge0$ với mọi số thực $a,\ b$.

Vì $a\ge0$ và $b\ge0$ nên $a+b\ge0$.

Do đó $\dfrac{3(a-b)^2(a+b)}{8}\ge0$, tức là $H\ge0$.

Suy ra $\dfrac{a^3+b^3}{2}\ge\left(\dfrac{a+b}{2}\right)^3$. Dấu $=$ xảy ra khi $a=b$.

Vậy bất đẳng thức đã cho được chứng minh.

### Bài 1c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức: $a^4+b^4\ge a^3b+ab^3$.
**Chưa chắc:** đề cương in $a^4+b^4\ge a^2b+ab^3$ — đúng như in thì SAI (với $a=b=\dfrac{1}{2}$: $\dfrac{1}{8}\ge\dfrac{3}{16}$); đã nhập dạng quen thuộc $a^4+b^4\ge a^3b+ab^3$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chuyển mọi hạng tử sang một vế rồi phân tích thành tích của một bình phương với một tam thức $a^2+ab+b^2$, tam thức này luôn không âm nhờ hoàn thành bình phương.

**Bước 1.** Lập hiệu $a^4+b^4-a^3b-ab^3$ và nhóm các hạng tử có thể đặt nhân tử chung $a^3$ và $b^3$.

**Bước 2.** Đặt nhân tử chung $a-b$, sau đó phân tích hiệu hai lập phương để lộ thêm một thừa số $a-b$ nữa.

**Bước 3.** Viết hiệu dưới dạng bình phương nhân với tam thức, rồi biến đổi tam thức thành tổng của một bình phương và một số hạng không âm.

**Bước 4.** Kết luận hiệu là tích của hai số không âm và nêu trường hợp xảy ra dấu bằng.

**Phần 2. Trình bày**

Xét hiệu $H=a^4+b^4-a^3b-ab^3$.

$H=(a^4-a^3b)-(ab^3-b^4)$

$=a^3(a-b)-b^3(a-b)$

$=(a-b)(a^3-b^3)$

$=(a-b)(a-b)(a^2+ab+b^2)$

$=(a-b)^2(a^2+ab+b^2)$

Ta có $a^2+ab+b^2=\left(a+\dfrac{b}{2}\right)^2+\dfrac{3b^2}{4}$.

Vì $\left(a+\dfrac{b}{2}\right)^2\ge0$ và $\dfrac{3b^2}{4}\ge0$ nên $a^2+ab+b^2\ge0$.

Lại có $(a-b)^2\ge0$, nên $H=(a-b)^2(a^2+ab+b^2)\ge0$.

Suy ra $a^4+b^4\ge a^3b+ab^3$. Dấu $=$ xảy ra khi $a=b$.

Vậy bất đẳng thức đã cho được chứng minh.

### Bài 1d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức: $a^4+3\ge4a$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** viết hiệu $a^4+3-4a$ thành tổng của hai bình phương bằng cách tách số hạng tự do $3=1+2$ và ghép với $a^4$, $-4a$ cho đúng.

**Bước 1.** Chuyển $4a$ sang vế trái để cần chứng minh một biểu thức luôn không âm, rồi tìm cách ghép thành bình phương.

**Bước 2.** Nhận thấy $a^4+1$ cần thêm $-2a^2$ để thành bình phương của $a^2-1$, nên ta cộng và trừ $2a^2$ cho cân bằng.

**Bước 3.** Phần còn lại $2a^2-4a+3-1$ gom lại thành hai lần một bình phương nhờ hằng đẳng thức hiệu hai số.

**Bước 4.** Kết luận hiệu là tổng của hai biểu thức không âm và tìm giá trị $a$ làm cả hai cùng bằng $0$.

**Phần 2. Trình bày**

Xét hiệu $H=a^4+3-4a$.

$H=(a^4-2a^2+1)+(2a^2-4a+2)$

$=(a^2-1)^2+2(a^2-2a+1)$

$=(a^2-1)^2+2(a-1)^2$

Vì $(a^2-1)^2\ge0$ và $2(a-1)^2\ge0$ nên $H\ge0$.

Suy ra $a^4+3\ge4a$.

Dấu $=$ xảy ra khi $a^2-1=0$ và $a-1=0$, tức là $a=1$.

Vậy bất đẳng thức đã cho được chứng minh.

### Bài 1e | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức: $a^2+b^2+c^2\ge ab+bc+ca$.
**Chưa chắc:** đề cương in bất đẳng thức này cùng dòng với ý d), KHÔNG có nhãn ý, dạng "$a^2+b^2+c^2>(ab+bc+ca)$ với $a,\ b,\ c>0$" — với dấu "$>$" thì SAI khi $a=b=c$; đã nhập thành ý e) với dấu "$\ge$" (đúng với mọi số thực).

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhân hiệu với $2$ rồi ghép các hạng tử thành ba bình phương dạng $(x-y)^2$ để thấy hiệu là một tổng không âm.

**Bước 1.** Lập hiệu $a^2+b^2+c^2-ab-bc-ca$ rồi viết nó dưới dạng một nửa của biểu thức đã nhân đôi để tạo ra các hệ số $2ab$, $2bc$, $2ca$.

**Bước 2.** Chia sáu số hạng bậc hai thành ba nhóm, mỗi nhóm gồm hai bình phương và một tích chéo, mỗi nhóm là một hằng đẳng thức.

**Bước 3.** Kết luận hiệu bằng một nửa tổng ba bình phương nên không âm, và tìm điều kiện để cả ba bình phương cùng triệt tiêu.

**Phần 2. Trình bày**

Xét hiệu $H=a^2+b^2+c^2-ab-bc-ca$.

$H=\dfrac{1}{2}(2a^2+2b^2+2c^2-2ab-2bc-2ca)$

$=\dfrac{1}{2}[(a^2-2ab+b^2)+(b^2-2bc+c^2)+(c^2-2ca+a^2)]$

$=\dfrac{1}{2}[(a-b)^2+(b-c)^2+(c-a)^2]$

Vì $(a-b)^2\ge0$, $(b-c)^2\ge0$, $(c-a)^2\ge0$ nên $H\ge0$.

Suy ra $a^2+b^2+c^2\ge ab+bc+ca$.

Dấu $=$ xảy ra khi $a-b=0$, $b-c=0$, $c-a=0$, tức là $a=b=c$.

Vậy bất đẳng thức đã cho được chứng minh.

### Bài 2a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh: $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.
**Chưa chắc:** đề cương in lời dẫn Bài 2 là "Tính giá trị của biểu thức:" nhưng hai ý đều là bất đẳng thức kép, và không nêu điều kiện của $a,\ b,\ c,\ d$; đã nhập "Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh:".

**Phần 1. Hướng dẫn**

**Mấu chốt:** kẹp từng phân số giữa hai phân số có cùng mẫu $a+b+c$ rồi cộng ba bất đẳng thức, mỗi vế của bất đẳng thức kép ứng với một lần kẹp.

**Bước 1.** Với vế bên trái, so từng phân số với phân số cùng tử nhưng mẫu là $a+b+c$: mẫu lớn hơn thì phân số nhỏ hơn vì tử dương.

**Bước 2.** Cộng ba bất đẳng thức vừa có, vế phải thành tổng ba tử chia cho cùng một mẫu nên rút gọn được.

**Bước 3.** Với vế bên phải, chứng minh một nhận xét tổng quát bằng cách xét hiệu: thêm cùng một số dương vào tử và mẫu của một phân số nhỏ hơn $1$ thì phân số lớn lên.

**Bước 4.** Áp dụng nhận xét cho ba phân số, chọn số được thêm là phần còn thiếu để mẫu mới là $a+b+c$, rồi cộng ba bất đẳng thức để được vế phải.

**Chú ý:** mỗi lần dùng nhận xét tổng quát phải kiểm tra điều kiện "mẫu lớn hơn tử" của phân số đang xét.

**Phần 2. Trình bày**

Vì $a,\ b,\ c>0$ nên các mẫu $a+b$, $b+c$, $c+a$ và $a+b+c$ đều dương.

**Chứng minh $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}$.**

Vì $c>0$ nên $a+b<a+b+c$. Do $a>0$ nên $\dfrac{a}{a+b}>\dfrac{a}{a+b+c}$ (cùng tử dương, mẫu nhỏ hơn thì phân số lớn hơn).

Vì $a>0$ nên $b+c<a+b+c$. Do $b>0$ nên $\dfrac{b}{b+c}>\dfrac{b}{a+b+c}$.

Vì $b>0$ nên $c+a<a+b+c$. Do $c>0$ nên $\dfrac{c}{c+a}>\dfrac{c}{a+b+c}$.

Cộng ba bất đẳng thức theo từng vế, ta được:

$\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}>\dfrac{a}{a+b+c}+\dfrac{b}{a+b+c}+\dfrac{c}{a+b+c}=\dfrac{a+b+c}{a+b+c}=1$.

**Chứng minh $\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.**

Nhận xét: với $x,\ y,\ p>0$ và $p>x$ thì $\dfrac{x}{p}<\dfrac{x+y}{p+y}$.

Thật vậy, $\dfrac{x+y}{p+y}-\dfrac{x}{p}=\dfrac{(x+y)p-x(p+y)}{p(p+y)}=\dfrac{xp+yp-xp-xy}{p(p+y)}=\dfrac{y(p-x)}{p(p+y)}$.

Vì $y>0$, $p-x>0$, $p>0$, $p+y>0$ nên hiệu này dương, tức là $\dfrac{x}{p}<\dfrac{x+y}{p+y}$.

Áp dụng với $x=a$, $p=a+b$, $y=c$ (có $p>x$ vì $b>0$): $\dfrac{a}{a+b}<\dfrac{a+c}{a+b+c}$.

Áp dụng với $x=b$, $p=b+c$, $y=a$ (có $p>x$ vì $c>0$): $\dfrac{b}{b+c}<\dfrac{b+a}{a+b+c}$.

Áp dụng với $x=c$, $p=c+a$, $y=b$ (có $p>x$ vì $a>0$): $\dfrac{c}{c+a}<\dfrac{c+b}{a+b+c}$.

Cộng ba bất đẳng thức theo từng vế, ta được:

$\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<\dfrac{(a+c)+(b+a)+(c+b)}{a+b+c}=\dfrac{2(a+b+c)}{a+b+c}=2$.

Vậy $1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2$.

### Bài 2b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh: $1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2$.
**Chưa chắc:** lời dẫn và điều kiện "các số dương" do người gõ bổ sung (xem ý a).

**Phần 1. Hướng dẫn**

**Mấu chốt:** đặt $S=a+b+c+d$ rồi kẹp mỗi phân số giữa phân số có mẫu $S$ và tử cũ, và phân số có mẫu $S$ và tử cộng thêm số hạng còn thiếu.

**Bước 1.** Với vế bên trái, mỗi mẫu của đề thiếu đúng một số dương so với $S$, nên mẫu nhỏ hơn $S$ và phân số lớn hơn phân số cùng tử có mẫu $S$.

**Bước 2.** Cộng bốn bất đẳng thức ở bước 1 để tổng bốn tử chia $S$ rút gọn thành một số.

**Bước 3.** Với vế bên phải, chứng minh một nhận xét tổng quát bằng cách xét hiệu: thêm cùng một số dương vào tử và mẫu của phân số nhỏ hơn $1$ thì phân số lớn lên.

**Bước 4.** Áp dụng nhận xét cho từng phân số, số được thêm chính là số hạng bị thiếu trong mẫu, rồi cộng bốn bất đẳng thức để được vế phải.

**Chú ý:** phải kiểm tra mẫu lớn hơn tử ở mỗi lần áp dụng nhận xét, vì nhận xét chỉ đúng khi phân số nhỏ hơn $1$.

**Phần 2. Trình bày**

Đặt $S=a+b+c+d$. Vì $a,\ b,\ c,\ d>0$ nên mọi mẫu của đề và $S$ đều dương.

**Chứng minh vế bên trái.**

Vì $d>0$ nên $a+b+c<S$. Do $a>0$ nên $\dfrac{a}{a+b+c}>\dfrac{a}{S}$ (cùng tử dương, mẫu nhỏ hơn thì phân số lớn hơn).

Vì $a>0$ nên $b+c+d<S$. Do $b>0$ nên $\dfrac{b}{b+c+d}>\dfrac{b}{S}$.

Vì $b>0$ nên $c+d+a<S$. Do $c>0$ nên $\dfrac{c}{c+d+a}>\dfrac{c}{S}$.

Vì $c>0$ nên $d+a+b<S$. Do $d>0$ nên $\dfrac{d}{d+a+b}>\dfrac{d}{S}$.

Cộng bốn bất đẳng thức theo từng vế, ta được:

$\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}>\dfrac{a+b+c+d}{S}=1$.

**Chứng minh vế bên phải.**

Nhận xét: với $x,\ y,\ p>0$ và $p>x$ thì $\dfrac{x}{p}<\dfrac{x+y}{p+y}$.

Thật vậy, $\dfrac{x+y}{p+y}-\dfrac{x}{p}=\dfrac{(x+y)p-x(p+y)}{p(p+y)}=\dfrac{y(p-x)}{p(p+y)}>0$ vì $y>0$, $p-x>0$, $p>0$, $p+y>0$.

Áp dụng với $x=a$, $p=a+b+c$, $y=d$ (có $p>x$ vì $b+c>0$): $\dfrac{a}{a+b+c}<\dfrac{a+d}{S}$.

Áp dụng với $x=b$, $p=b+c+d$, $y=a$ (có $p>x$ vì $c+d>0$): $\dfrac{b}{b+c+d}<\dfrac{b+a}{S}$.

Áp dụng với $x=c$, $p=c+d+a$, $y=b$ (có $p>x$ vì $d+a>0$): $\dfrac{c}{c+d+a}<\dfrac{c+b}{S}$.

Áp dụng với $x=d$, $p=d+a+b$, $y=c$ (có $p>x$ vì $a+b>0$): $\dfrac{d}{d+a+b}<\dfrac{d+c}{S}$.

Cộng bốn bất đẳng thức theo từng vế, ta được:

$\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<\dfrac{(a+d)+(b+a)+(c+b)+(d+c)}{S}=\dfrac{2S}{S}=2$.

Vậy $1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2$.

### Bài 3 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho tam giác $ABC$ vuông tại $A$, có $AB<AC$, chu vi là $72\ \text{cm}$ và trung tuyến $AM=15\ \text{cm}$. Tính tỉ số lượng giác của các góc $B,\ C$.
**Hình giải:** giai_C3.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** trung tuyến ứng với cạnh huyền của tam giác vuông bằng nửa cạnh huyền, nên biết ngay cạnh huyền; hai cạnh góc vuông còn lại tìm từ chu vi và định lí Pythagore.

**Bước 1.** Nhận ra $AM$ là trung tuyến ứng với cạnh huyền $BC$ của tam giác vuông $ABC$, rồi dùng tính chất của lớp 8 để tính $BC$ từ $AM$.

**Bước 2.** Dùng chu vi để lập tổng $AB+AC$, dùng định lí Pythagore để lập tổng $AB^2+AC^2$; hai điều kiện đối xứng với $AB$ và $AC$.

**Bước 3.** Rút $AC$ theo $AB$ từ tổng, thế vào tổng bình phương, đưa về phương trình bậc hai ẩn $AB$ rồi phân tích thành tích hai nhân tử bằng cách tách hạng tử giữa, không dùng công thức nghiệm.

**Bước 4.** Giải phương trình tích, dùng điều kiện $AB<AC$ để chọn đúng cạnh nào là $AB$, cạnh nào là $AC$.

**Bước 5.** Viết các tỉ số lượng giác của góc $B$ theo định nghĩa (đối chia huyền, kề chia huyền, đối chia kề, kề chia đối), rồi suy ra của góc $C$ vì hai góc phụ nhau nên đổi chéo.

**Phần 2. Trình bày**

Xét $\triangle ABC$ vuông tại $A$, có $AM$ là trung tuyến ứng với cạnh huyền $BC$.

Trong tam giác vuông, trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền, nên $AM=\dfrac{BC}{2}$.

Suy ra $BC=2AM=2\cdot15=30\ \text{cm}$.

Chu vi tam giác là $72\ \text{cm}$ nên $AB+AC+BC=72$.

Suy ra $AB+AC=72-30=42$ (1).

Theo định lí Pythagore, $AB^2+AC^2=BC^2=30^2=900$ (2).

Từ (1) ta có $AC=42-AB$. Thế vào (2), ta được:

$AB^2+(42-AB)^2=900$

$AB^2+1764-84AB+AB^2=900$

$2AB^2-84AB+864=0$

$AB^2-42AB+432=0$

$AB^2-18AB-24AB+432=0$

$AB(AB-18)-24(AB-18)=0$

$(AB-18)(AB-24)=0$

Suy ra $AB-18=0$ hoặc $AB-24=0$.

• $AB-18=0$ suy ra $AB=18$, khi đó $AC=42-18=24$.

• $AB-24=0$ suy ra $AB=24$, khi đó $AC=42-24=18$.

Vì $AB<AC$ nên $AB=18\ \text{cm}$ và $AC=24\ \text{cm}$.

Xét $\triangle ABC$ vuông tại $A$, ta có:

$\sin B=\dfrac{AC}{BC}=\dfrac{24}{30}=\dfrac{4}{5}$; $\cos B=\dfrac{AB}{BC}=\dfrac{18}{30}=\dfrac{3}{5}$;

$\tan B=\dfrac{AC}{AB}=\dfrac{24}{18}=\dfrac{4}{3}$; $\cot B=\dfrac{AB}{AC}=\dfrac{18}{24}=\dfrac{3}{4}$.

Tương tự với góc $C$ (cạnh đối của $C$ là $AB$, cạnh kề của $C$ là $AC$):

$\sin C=\dfrac{AB}{BC}=\dfrac{3}{5}$; $\cos C=\dfrac{AC}{BC}=\dfrac{4}{5}$;

$\tan C=\dfrac{AB}{AC}=\dfrac{3}{4}$; $\cot C=\dfrac{AC}{AB}=\dfrac{4}{3}$.

Vậy $\sin B=\cos C=\dfrac{4}{5}$, $\cos B=\sin C=\dfrac{3}{5}$, $\tan B=\cot C=\dfrac{4}{3}$, $\cot B=\tan C=\dfrac{3}{4}$.

### Bài 4 | kho=hgt | loai=tu_luan | dap_an=—
**Đề:** Cho hình thang $ABCD$ ($\widehat{A}=\widehat{D}=90^\circ$), $AB<CD$. Hai đường chéo $AC$ và $BD$ vuông góc với nhau tại $O$.
a) Chứng minh: $AD^2=AB\cdot CD$.
b) Cho $AB=4{,}5\ \text{cm}$, $CD=8\ \text{cm}$. Tính $OA,\ OC$ và diện tích hình thang $ABCD$.
**Ghi chú:** Đề cương có hình kèm nhưng hình vẽ hai đáy là $BC$ và $AD$ (góc vuông chỉ ở $A$) — không khớp lời văn ($\widehat{A}=\widehat{D}=90^\circ$ nên hai đáy là $AB$ và $CD$) ⇒ không đưa hình đó vào đề; lời giải vẽ hình theo lời văn.
**Hình giải:** giai_C4.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai góc nhọn $\widehat{ABD}$ và $\widehat{DAC}$ cùng phụ với góc $\widehat{ADB}$ nên bằng nhau, từ đó hai tam giác vuông $ABD$ và $DAC$ đồng dạng.

**Bước 1.** Ý a: chỉ ra $AB\parallel CD$ để biết hai đáy; rồi dùng hai tam giác vuông có chung góc nhọn $\widehat{ADB}$ để chứng minh $\widehat{ABD}=\widehat{DAC}$.

**Bước 2.** Ý a: ghép hai tam giác vuông đồng dạng theo trường hợp góc – góc, viết tỉ số các cạnh tương ứng rồi nhân chéo để ra hệ thức.

**Bước 3.** Ý b: thay độ dài hai đáy vào hệ thức ở ý a để tìm đường cao, rồi dùng định lí Pythagore trong tam giác vuông $ADC$ để tìm $AC$.

**Bước 4.** Ý b: dùng $AB\parallel CD$ để lập hai tam giác $OAB$ và $OCD$ đồng dạng, suy ra tỉ số $OA:OC$, rồi chia đoạn $AC$ theo tỉ số đó nhờ tính chất dãy tỉ số bằng nhau.

**Bước 5.** Ý b: tính diện tích hình thang bằng công thức nửa tổng hai đáy nhân đường cao đã tìm được.

**Chú ý:** không dùng thẳng hệ thức về đường cao trong tam giác vuông; mọi tỉ lệ đều rút ra từ tam giác đồng dạng.

**Phần 2. Trình bày**

a) Vì $\widehat{A}=\widehat{D}=90^\circ$ nên $AB\perp AD$ và $CD\perp AD$, suy ra $AB\parallel CD$.

Vì $O$ nằm trên $AC$ và $BD$ nên $\widehat{DAC}=\widehat{DAO}$ và $\widehat{ADB}=\widehat{ADO}$.

Xét $\triangle AOD$ vuông tại $O$ (vì $AC\perp BD$), ta có $\widehat{DAC}+\widehat{ADB}=90^\circ$ (1).

Xét $\triangle ABD$ vuông tại $A$, ta có $\widehat{ABD}+\widehat{ADB}=90^\circ$ (2).

Từ (1) và (2) suy ra $\widehat{DAC}=\widehat{ABD}$.

Xét $\triangle ABD$ và $\triangle DAC$ có:

$\widehat{BAD}=\widehat{ADC}=90^\circ$;

$\widehat{ABD}=\widehat{DAC}$ (chứng minh trên).

Do đó $\triangle ABD\backsim\triangle DAC$ (g.g).

Suy ra $\dfrac{AB}{DA}=\dfrac{AD}{DC}$, tức là $AD^2=AB\cdot CD$.

Vậy $AD^2=AB\cdot CD$.

b) Theo ý a, $AD^2=AB\cdot CD=4{,}5\cdot8=36$.

Vì $AD>0$ nên $AD=6\ \text{cm}$.

Xét $\triangle ADC$ vuông tại $D$, theo định lí Pythagore:

$AC^2=AD^2+CD^2=6^2+8^2=36+64=100$

Suy ra $AC=10\ \text{cm}$.

Vì $AB\parallel CD$ nên $\widehat{OAB}=\widehat{OCD}$ và $\widehat{OBA}=\widehat{ODC}$ (so le trong).

Xét $\triangle OAB$ và $\triangle OCD$, ta có hai cặp góc bằng nhau nên $\triangle OAB\backsim\triangle OCD$ (g.g).

Suy ra $\dfrac{OA}{OC}=\dfrac{AB}{CD}=\dfrac{4{,}5}{8}=\dfrac{9}{16}$, tức là $\dfrac{OA}{9}=\dfrac{OC}{16}$.

Vì $O$ nằm giữa $A$ và $C$ nên $OA+OC=AC=10$.

Theo tính chất dãy tỉ số bằng nhau:

$\dfrac{OA}{9}=\dfrac{OC}{16}=\dfrac{OA+OC}{9+16}=\dfrac{10}{25}=\dfrac{2}{5}$

Suy ra $OA=9\cdot\dfrac{2}{5}=3{,}6\ \text{cm}$ và $OC=16\cdot\dfrac{2}{5}=6{,}4\ \text{cm}$.

Hình thang $ABCD$ có hai đáy $AB$, $CD$ và đường cao $AD$ nên:

$S_{ABCD}=\dfrac{(AB+CD)\cdot AD}{2}=\dfrac{(4{,}5+8)\cdot6}{2}=37{,}5\ \text{cm}^2$

Vậy $OA=3{,}6\ \text{cm}$, $OC=6{,}4\ \text{cm}$ và diện tích hình thang $ABCD$ là $37{,}5\ \text{cm}^2$.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Bài 1a, 1b, 1c, 1e và Bài 2a, 2b: đề cương in sai / thiếu, người gõ đã nhập dạng đúng và ghi `Chưa chắc` — giải theo bản đã nhập. Đã thử bằng máy hơn 27 000 bộ số thực (cả biên, cả số âm) cho Bài 1 và 50 000 bộ số dương cho Bài 2: các bản đã nhập đúng, các bản in sai bị bác bằng phản ví dụ. Bài 1b: máy cũng xác nhận nếu bỏ điều kiện $a,\ b\ge0$ thì có phản ví dụ (cần $a+b\ge0$).
- Bài 1 chứng minh bằng xét hiệu, không dùng Cô-si; Bài 2 dùng một nhận xét tổng quát (chứng minh bằng xét hiệu ngay trong bài) để kẹp từng phân số.
- Bài 3: $BC=30\ \text{cm}$, $AB=18\ \text{cm}$, $AC=24\ \text{cm}$ (thử bằng quét lưới và thay vào mọi dữ kiện); đề "tính tỉ số lượng giác của các góc $B,\ C$" nên viết đủ 8 tỉ số. Hình giải `giai_C3.png`.
- Bài 4: hình đề cương lệch lời văn nên không dùng; hình giải `giai_C4.png` dựng đúng toạ độ ($AD=6$, $AC\perp BD$ kiểm bằng máy). Ý b lấy $OA:OC=AB:CD$ qua tam giác đồng dạng thay cho hệ thức đường cao.
- Không có nhận xét chung nào khác.
