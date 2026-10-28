# ĐỀ | Nội dung ôn tập học kì I Toán 11 năm 2025–2026 — Trường THPT Trần Phú – Hoàn Kiếm, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 21 | Chương Giới hạn – Hàm số liên tục — Phần III. Trả lời ngắn & Tự luận | tu_luan

### Câu 1a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim\dfrac{2n+1}{3n+2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc theo $n$ nên chia cả hai cho lũy thừa cao nhất của $n$ rồi dùng $\lim\dfrac1n=0$.

**Bước 1.** Xác định lũy thừa cao nhất của $n$ có mặt ở cả tử và mẫu để chọn số đem chia.

**Bước 2.** Chia cả tử và mẫu cho lũy thừa đó để các số hạng còn lại đều có dạng $\dfrac{c}{n}$.

**Bước 3.** Áp dụng $\lim\dfrac{c}{n}=0$ và quy tắc giới hạn của thương rồi kết luận.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n$, ta được:

$\lim\dfrac{2n+1}{3n+2}=\lim\dfrac{2+\dfrac{1}{n}}{3+\dfrac{2}{n}}$

Vì $\lim\dfrac1n=0$ nên:

$\lim\dfrac{2+\dfrac{1}{n}}{3+\dfrac{2}{n}}=\dfrac{2+0}{3+0}=\dfrac23$

Vậy $\lim\dfrac{2n+1}{3n+2}=\dfrac23$.

### Câu 1b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim\dfrac{n^2-3n+5}{3n^2+4}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu đều bậc hai theo $n$ nên chia cả hai cho $n^2$ để mọi phần còn lại tiến về $0$.

**Bước 1.** Nhận ra bậc cao nhất của tử và của mẫu bằng nhau, từ đó chọn $n^2$ làm số đem chia.

**Bước 2.** Chia từng số hạng của tử và mẫu cho $n^2$ để đưa về các biểu thức dạng $\dfrac{c}{n}$, $\dfrac{c}{n^2}$.

**Bước 3.** Dùng $\lim\dfrac{1}{n^k}=0$ với $k>0$ và quy tắc thương để tìm giới hạn.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n^2$, ta được:

$\lim\dfrac{n^2-3n+5}{3n^2+4}=\lim\dfrac{1-\dfrac{3}{n}+\dfrac{5}{n^2}}{3+\dfrac{4}{n^2}}$

Vì $\lim\dfrac1n=0$ và $\lim\dfrac1{n^2}=0$ nên:

$\lim\dfrac{1-\dfrac{3}{n}+\dfrac{5}{n^2}}{3+\dfrac{4}{n^2}}=\dfrac{1-0+0}{3+0}=\dfrac13$

Vậy $\lim\dfrac{n^2-3n+5}{3n^2+4}=\dfrac13$.

### Câu 1c | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tính giới hạn $\lim\dfrac{n^3+n^2-n+1}{2n^4+n^2+2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bậc của mẫu cao hơn bậc của tử nên chia cả tử và mẫu cho $n^4$, lũy thừa cao nhất của mẫu.

**Bước 1.** So sánh bậc cao nhất của tử với bậc cao nhất của mẫu để chọn lũy thừa $n$ đem chia.

**Bước 2.** Chia từng số hạng của tử và mẫu cho $n^4$ để mọi số hạng chứa $n$ đều viết được dạng $\dfrac{c}{n^k}$.

**Bước 3.** Cho $n\to+\infty$ với $\lim\dfrac{1}{n^k}=0$ rồi tính thương các giới hạn của tử và mẫu.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n^4$, ta được:

$\lim\dfrac{n^3+n^2-n+1}{2n^4+n^2+2}=\lim\dfrac{\dfrac1n+\dfrac1{n^2}-\dfrac1{n^3}+\dfrac1{n^4}}{2+\dfrac1{n^2}+\dfrac2{n^4}}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên tử có giới hạn $0$ và mẫu có giới hạn $2$.

Do đó giới hạn của thương là $\dfrac{0}{2}=0$.

Vậy $\lim\dfrac{n^3+n^2-n+1}{2n^4+n^2+2}=0$.

### Câu 1d | kho=dai | loai=tra_loi_ngan | dap_an=0,5
**Đề:** Tính giới hạn $\lim\dfrac{(2n^3+1)(3n^2-n+8)}{(4n-3)(3n^4+n+2)}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** nhìn bậc của từng nhân tử để thấy tử và mẫu đều có bậc cao nhất là $n^5$ rồi chia cả hai cho $n^5$.

**Bước 1.** Tính bậc của tử bằng tổng bậc hai nhân tử, tương tự với mẫu, để biết lũy thừa cần chia.

**Bước 2.** Chia mỗi nhân tử cho lũy thừa của $n$ tương ứng với bậc của nó, sao cho tổng các lũy thừa chia bằng $n^5$.

**Bước 3.** Cho $n\to+\infty$ ở từng nhân tử rồi nhân các giới hạn lại với nhau và lập thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n^5$, tức chia nhân tử bậc ba cho $n^3$, nhân tử bậc hai cho $n^2$, nhân tử bậc một cho $n$, nhân tử bậc bốn cho $n^4$:

$\lim\dfrac{(2n^3+1)(3n^2-n+8)}{(4n-3)(3n^4+n+2)}=\lim\dfrac{(2+\dfrac{1}{n^3})(3-\dfrac1n+\dfrac8{n^2})}{(4-\dfrac3n)(3+\dfrac1{n^3}+\dfrac2{n^4})}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên:

$\lim\dfrac{(2+\dfrac{1}{n^3})(3-\dfrac1n+\dfrac8{n^2})}{(4-\dfrac3n)(3+\dfrac1{n^3}+\dfrac2{n^4})}=\dfrac{2\cdot3}{4\cdot3}=\dfrac12$

Vậy $\lim\dfrac{(2n^3+1)(3n^2-n+8)}{(4n-3)(3n^4+n+2)}=\dfrac12=0{,}5$.

### Câu 2a | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tính giới hạn $\lim\dfrac{3n^2+\sqrt{n^4+3n-2}}{2n^2-n+3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** căn $\sqrt{n^4+\dots}$ có bậc hai theo $n$ nên chia cả tử và mẫu cho $n^2$ và đưa $n^2$ vào trong căn.

**Bước 1.** Xác định bậc của từng số hạng, chú ý $\sqrt{n^4+3n-2}$ có bậc bằng $2$, để chọn lũy thừa đem chia.

**Bước 2.** Chia cả tử và mẫu cho $n^2$, riêng số hạng chứa căn viết $\dfrac{\sqrt{n^4+3n-2}}{n^2}=\sqrt{\dfrac{n^4+3n-2}{n^4}}$.

**Bước 3.** Dùng $\lim\dfrac1{n^k}=0$ và quy tắc giới hạn của căn, của thương để kết luận.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n^2$, ta được:

$\lim\dfrac{3n^2+\sqrt{n^4+3n-2}}{2n^2-n+3}=\lim\dfrac{3+\sqrt{1+\dfrac{3}{n^3}-\dfrac{2}{n^4}}}{2-\dfrac1n+\dfrac3{n^2}}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên:

$\lim\dfrac{3+\sqrt{1+\dfrac{3}{n^3}-\dfrac{2}{n^4}}}{2-\dfrac1n+\dfrac3{n^2}}=\dfrac{3+\sqrt{1}}{2}=2$

Vậy $\lim\dfrac{3n^2+\sqrt{n^4+3n-2}}{2n^2-n+3}=2$.

### Câu 2b | kho=dai | loai=tra_loi_ngan | dap_an=1
**Đề:** Tính giới hạn $\lim\dfrac{\sqrt[3]{8n^3-5n+8}-n}{n+12}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** căn bậc ba của đa thức bậc ba có bậc bằng $1$ theo $n$, nên chia cả tử và mẫu cho $n$ và đưa $n$ vào trong căn bậc ba.

**Bước 1.** Xác định bậc cao nhất của tử và mẫu, chú ý $\sqrt[3]{8n^3-5n+8}$ cùng bậc với $n$.

**Bước 2.** Chia cả tử và mẫu cho $n$, viết $\dfrac{\sqrt[3]{8n^3-5n+8}}{n}=\sqrt[3]{\dfrac{8n^3-5n+8}{n^3}}$.

**Bước 3.** Cho $n\to+\infty$ ở từng số hạng nhờ $\lim\dfrac1{n^k}=0$ rồi tính thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n$, ta được:

$\lim\dfrac{\sqrt[3]{8n^3-5n+8}-n}{n+12}=\lim\dfrac{\sqrt[3]{8-\dfrac{5}{n^2}+\dfrac{8}{n^3}}-1}{1+\dfrac{12}{n}}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên:

$\lim\dfrac{\sqrt[3]{8-\dfrac{5}{n^2}+\dfrac{8}{n^3}}-1}{1+\dfrac{12}{n}}=\dfrac{\sqrt[3]{8}-1}{1}=\dfrac{2-1}{1}=1$

Vậy $\lim\dfrac{\sqrt[3]{8n^3-5n+8}-n}{n+12}=1$.

### Câu 2c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim\dfrac{\sqrt{6n^2+n+1}}{2n+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** căn của đa thức bậc hai có bậc bằng $1$ nên chia cả tử và mẫu cho $n$ và đưa $n$ vào trong căn.

**Bước 1.** So sánh bậc của tử, tính qua căn bậc hai, với bậc của mẫu để chọn lũy thừa đem chia.

**Bước 2.** Chia cả tử và mẫu cho $n$, viết $\dfrac{\sqrt{6n^2+n+1}}{n}=\sqrt{\dfrac{6n^2+n+1}{n^2}}$ vì $n>0$.

**Bước 3.** Dùng $\lim\dfrac1{n^k}=0$ để tính giới hạn của căn và của mẫu rồi lập thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n$ (với $n>0$), ta được:

$\lim\dfrac{\sqrt{6n^2+n+1}}{2n+1}=\lim\dfrac{\sqrt{6+\dfrac1n+\dfrac1{n^2}}}{2+\dfrac1n}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên:

$\lim\dfrac{\sqrt{6+\dfrac1n+\dfrac1{n^2}}}{2+\dfrac1n}=\dfrac{\sqrt6}{2}$

Vậy $\lim\dfrac{\sqrt{6n^2+n+1}}{2n+1}=\dfrac{\sqrt6}{2}$.

### Câu 2d | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tính giới hạn $\lim\dfrac{\sqrt{2n^2-n}}{1-3n^2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử có bậc $1$ còn mẫu có bậc $2$ nên chia cả tử và mẫu cho $n^2$, lũy thừa cao nhất của mẫu.

**Bước 1.** Xác định bậc của tử, tính qua căn, và bậc của mẫu để biết nên chia cho lũy thừa nào của $n$.

**Bước 2.** Chia cả tử và mẫu cho $n^2$, đưa $n^2$ vào trong căn dưới dạng $\sqrt{\dfrac{2n^2-n}{n^4}}$.

**Bước 3.** Dùng $\lim\dfrac1{n^k}=0$ để tìm giới hạn của tử và của mẫu, rồi lập thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $n^2$, ta được:

$\lim\dfrac{\sqrt{2n^2-n}}{1-3n^2}=\lim\dfrac{\sqrt{\dfrac{2}{n^2}-\dfrac1{n^3}}}{\dfrac1{n^2}-3}$

Vì $\lim\dfrac1{n^k}=0$ với mọi $k>0$ nên tử có giới hạn $0$ và mẫu có giới hạn $-3$.

Do đó giới hạn của thương là $\dfrac{0}{-3}=0$.

Vậy $\lim\dfrac{\sqrt{2n^2-n}}{1-3n^2}=0$.

### Câu 3a | kho=dai | loai=tra_loi_ngan | dap_an=0,2
**Đề:** Tính giới hạn $\lim\dfrac{9\cdot2^n+3^n}{2^n+5\cdot3^n}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** trong tử và mẫu, cơ số lớn nhất là $3$ nên chia cả hai cho $3^n$ để xuất hiện $(\dfrac23)^n$.

**Bước 1.** Tìm cơ số lớn nhất xuất hiện ở tử và mẫu để chọn lũy thừa đem chia.

**Bước 2.** Chia cả tử và mẫu cho $3^n$ và viết các số hạng dạng $(\dfrac23)^n$.

**Bước 3.** Dùng $\lim q^n=0$ khi $|q|<1$ để tính giới hạn của tử, của mẫu rồi lập thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $3^n$, ta được:

$\lim\dfrac{9\cdot2^n+3^n}{2^n+5\cdot3^n}=\lim\dfrac{9(\dfrac23)^n+1}{(\dfrac23)^n+5}$

Vì $\lim(\dfrac23)^n=0$ nên:

$\lim\dfrac{9(\dfrac23)^n+1}{(\dfrac23)^n+5}=\dfrac{9\cdot0+1}{0+5}=\dfrac15$

Vậy $\lim\dfrac{9\cdot2^n+3^n}{2^n+5\cdot3^n}=\dfrac15=0{,}2$.

### Câu 3b | kho=dai | loai=tra_loi_ngan | dap_an=-0,5
**Đề:** Tính giới hạn $\lim\dfrac{3^{n+2}-4^{n+1}+1}{2\cdot4^{n+1}+2^{n-1}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cơ số lớn nhất ở tử và mẫu là $4$, nên tách các lũy thừa theo $4^n$ rồi chia cả tử và mẫu cho $4^n$.

**Bước 1.** Viết lại các lũy thừa $3^{n+2}$, $4^{n+1}$, $2^{n-1}$ bằng tích của một hằng số và lũy thừa $a^n$.

**Bước 2.** Chia cả tử và mẫu cho $4^n$ để có các hạng tử dạng $(\dfrac34)^n$, $(\dfrac14)^n$, $(\dfrac12)^n$.

**Bước 3.** Dùng $\lim q^n=0$ khi $|q|<1$ để tính giới hạn của tử, của mẫu rồi lập thương.

**Phần 2. Trình bày**

Ta có $3^{n+2}=9\cdot3^n$, $4^{n+1}=4\cdot4^n$, $2^{n-1}=\dfrac12\cdot2^n$.

Chia cả tử và mẫu cho $4^n$, ta được:

$\lim\dfrac{3^{n+2}-4^{n+1}+1}{2\cdot4^{n+1}+2^{n-1}}=\lim\dfrac{9(\dfrac34)^n-4+(\dfrac14)^n}{8+\dfrac12(\dfrac12)^n}$

Vì $\lim(\dfrac34)^n=\lim(\dfrac14)^n=\lim(\dfrac12)^n=0$ nên:

$\lim\dfrac{9(\dfrac34)^n-4+(\dfrac14)^n}{8+\dfrac12(\dfrac12)^n}=\dfrac{-4}{8}=-\dfrac12$

Vậy $\lim\dfrac{3^{n+2}-4^{n+1}+1}{2\cdot4^{n+1}+2^{n-1}}=-\dfrac12=-0{,}5$.

### Câu 3c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim\dfrac{4\cdot3^{2n}+7^{n-1}}{2\cdot9^{n+1}+7^n}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đổi $3^{2n}=9^n$ để các cơ số ở tử và mẫu chỉ còn $9$ và $7$, rồi chia cả hai cho $9^n$.

**Bước 1.** Viết $3^{2n}$ thành lũy thừa cơ số $9$ và tách $7^{n-1}$, $9^{n+1}$ thành hằng số nhân với lũy thừa theo $n$.

**Bước 2.** Chia cả tử và mẫu cho $9^n$ để xuất hiện các số hạng dạng $(\dfrac79)^n$.

**Bước 3.** Dùng $\lim q^n=0$ khi $|q|<1$ để tính giới hạn của tử, của mẫu rồi lập thương và rút gọn.

**Phần 2. Trình bày**

Ta có $3^{2n}=9^n$, $7^{n-1}=\dfrac17\cdot7^n$, $9^{n+1}=9\cdot9^n$.

Chia cả tử và mẫu cho $9^n$, ta được:

$\lim\dfrac{4\cdot3^{2n}+7^{n-1}}{2\cdot9^{n+1}+7^n}=\lim\dfrac{4+\dfrac17(\dfrac79)^n}{18+(\dfrac79)^n}$

Vì $\lim(\dfrac79)^n=0$ nên:

$\lim\dfrac{4+\dfrac17(\dfrac79)^n}{18+(\dfrac79)^n}=\dfrac{4}{18}=\dfrac29$

Vậy $\lim\dfrac{4\cdot3^{2n}+7^{n-1}}{2\cdot9^{n+1}+7^n}=\dfrac29$.

### Câu 3d | kho=dai | loai=tra_loi_ngan | dap_an=0,1
**Đề:** Tính giới hạn $\lim\dfrac{1+2+3+\dots+n}{5n^2+2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử là tổng $n$ số hạng đầu của một cấp số cộng nên đổi thành công thức theo $n$ trước khi tính giới hạn.

**Bước 1.** Nhận ra các số $1,2,3,\dots,n$ lập thành cấp số cộng và nhớ công thức tổng $S_n$ của $n$ số hạng đầu.

**Bước 2.** Thay tổng ở tử bằng biểu thức bậc hai theo $n$ để đưa về giới hạn của thương hai đa thức.

**Bước 3.** Chia cả tử và mẫu cho $n^2$ rồi dùng $\lim\dfrac1{n^k}=0$ để kết luận.

**Phần 2. Trình bày**

Ta có $1+2+3+\dots+n=\dfrac{n(n+1)}{2}$.

Do đó:

$\lim\dfrac{1+2+3+\dots+n}{5n^2+2}=\lim\dfrac{n(n+1)}{2(5n^2+2)}=\lim\dfrac{n^2+n}{10n^2+4}$

Chia cả tử và mẫu cho $n^2$:

$\lim\dfrac{n^2+n}{10n^2+4}=\lim\dfrac{1+\dfrac1n}{10+\dfrac{4}{n^2}}=\dfrac{1}{10}$

Vậy $\lim\dfrac{1+2+3+\dots+n}{5n^2+2}=\dfrac1{10}=0{,}1$.

### Câu 4a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to2^+}\dfrac{1}{x-2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử không đổi còn mẫu tiến về $0$, nên xét dấu của mẫu khi $x$ tiến tới $2$ từ bên phải để chọn $+\infty$ hay $-\infty$.

**Bước 1.** Nhận ra tử là hằng số khác $0$ còn mẫu có giới hạn bằng $0$, nên đây là giới hạn vô cực.

**Bước 2.** Xét dấu của $x-2$ khi $x>2$ để biết mẫu tiến về $0$ từ phía dương hay âm.

**Bước 3.** Áp dụng quy tắc dấu của thương khi mẫu tiến về $0$ để kết luận.

**Phần 2. Trình bày**

Ta có $\lim_{x\to2^+}1=1>0$ và $\lim_{x\to2^+}(x-2)=0$.

Với $x\to2^+$ thì $x>2$ nên $x-2>0$.

Do đó $\lim_{x\to2^+}\dfrac{1}{x-2}=+\infty$.

Vậy $\lim_{x\to2^+}\dfrac{1}{x-2}=+\infty$.

### Câu 4b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to-3^-}\dfrac{5}{x+3}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử là hằng số dương còn mẫu tiến về $0$, nên dấu của mẫu khi $x$ tiến tới $-3$ từ bên trái quyết định dấu của vô cực.

**Bước 1.** Nhận ra giới hạn của tử khác $0$ và giới hạn của mẫu bằng $0$ nên kết quả là vô cực.

**Bước 2.** Xét dấu của $x+3$ với $x<-3$ để biết mẫu tiến về $0$ từ phía nào.

**Bước 3.** Dùng quy tắc dấu của thương để chọn dấu của vô cực.

**Phần 2. Trình bày**

Ta có $\lim_{x\to-3^-}5=5>0$ và $\lim_{x\to-3^-}(x+3)=0$.

Với $x\to-3^-$ thì $x<-3$ nên $x+3<0$.

Do đó $\lim_{x\to-3^-}\dfrac{5}{x+3}=-\infty$.

Vậy $\lim_{x\to-3^-}\dfrac{5}{x+3}=-\infty$.

### Câu 4c | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to5^+}\dfrac{9}{5-x}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử là hằng số dương, mẫu $5-x$ tiến về $0$, nên cần xét dấu của $5-x$ khi $x$ tiến tới $5$ từ bên phải.

**Bước 1.** Kiểm tra giới hạn của tử khác $0$ và giới hạn của mẫu bằng $0$ để biết kết quả là vô cực.

**Bước 2.** Xét dấu của $5-x$ khi $x>5$ để biết mẫu tiến về $0$ từ phía nào.

**Bước 3.** Áp dụng quy tắc dấu của thương để kết luận.

**Phần 2. Trình bày**

Ta có $\lim_{x\to5^+}9=9>0$ và $\lim_{x\to5^+}(5-x)=0$.

Với $x\to5^+$ thì $x>5$ nên $5-x<0$.

Do đó $\lim_{x\to5^+}\dfrac{9}{5-x}=-\infty$.

Vậy $\lim_{x\to5^+}\dfrac{9}{5-x}=-\infty$.

### Câu 5a | kho=dai | loai=tra_loi_ngan | dap_an=-2
**Đề:** Tính giới hạn $\lim_{x\to1}\dfrac{x+1}{x-2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm phân thức xác định tại $x=1$ và mẫu khác $0$ ở đó nên chỉ cần thay trực tiếp $x=1$.

**Bước 1.** Kiểm tra mẫu $x-2$ có khác $0$ tại điểm $x=1$ hay không để biết có dạng vô định không.

**Bước 2.** Dùng quy tắc giới hạn của thương hai hàm số có giới hạn hữu hạn và mẫu khác $0$.

**Bước 3.** Thay $x=1$ vào tử và mẫu để tính giá trị.

**Phần 2. Trình bày**

Ta có $\lim_{x\to1}(x+1)=2$ và $\lim_{x\to1}(x-2)=-1\neq0$.

Do đó $\lim_{x\to1}\dfrac{x+1}{x-2}=\dfrac{2}{-1}=-2$.

Vậy $\lim_{x\to1}\dfrac{x+1}{x-2}=-2$.

### Câu 5b | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tính giới hạn $\lim_{x\to1}\dfrac{x^2-1}{x-1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=1$ cả tử và mẫu cùng bằng $0$ nên phân tích tử thành nhân tử để khử nhân tử $x-1$.

**Bước 1.** Kiểm tra bằng cách thay $x=1$ để nhận ra dạng vô định $\dfrac00$.

**Bước 2.** Phân tích tử bằng hằng đẳng thức hiệu hai bình phương để xuất hiện nhân tử chung với mẫu.

**Bước 3.** Rút gọn nhân tử chung rồi thay $x=1$ vào biểu thức còn lại.

**Phần 2. Trình bày**

Với $x\neq1$ ta có:

$\dfrac{x^2-1}{x-1}=\dfrac{(x-1)(x+1)}{x-1}=x+1$

Do đó:

$\lim_{x\to1}\dfrac{x^2-1}{x-1}=\lim_{x\to1}(x+1)=2$

Vậy $\lim_{x\to1}\dfrac{x^2-1}{x-1}=2$.

### Câu 5c | kho=dai | loai=tra_loi_ngan | dap_an=1,75
**Đề:** Tính giới hạn $\lim_{x\to2}\dfrac{3x^2-5x-2}{x^2-4}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=2$ cả tử và mẫu cùng triệt tiêu nên phân tích cả hai thành nhân tử và khử nhân tử $x-2$.

**Bước 1.** Thay $x=2$ để nhận ra dạng vô định $\dfrac00$.

**Bước 2.** Phân tích tử bằng cách dùng nghiệm $x=2$ và phân tích mẫu bằng hiệu hai bình phương.

**Bước 3.** Rút gọn nhân tử $x-2$ rồi thay $x=2$ vào phân thức còn lại.

**Phần 2. Trình bày**

Ta có $3x^2-5x-2=(x-2)(3x+1)$ và $x^2-4=(x-2)(x+2)$.

Với $x\neq2$ thì:

$\dfrac{3x^2-5x-2}{x^2-4}=\dfrac{3x+1}{x+2}$

Do đó:

$\lim_{x\to2}\dfrac{3x^2-5x-2}{x^2-4}=\lim_{x\to2}\dfrac{3x+1}{x+2}=\dfrac{7}{4}$

Vậy $\lim_{x\to2}\dfrac{3x^2-5x-2}{x^2-4}=\dfrac74=1{,}75$.

### Câu 5d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to-2}\dfrac{2x^2-6x-20}{x^3-3x+2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=-2$ cả tử và mẫu cùng triệt tiêu nên phân tích cả hai thành nhân tử chứa $x+2$ rồi rút gọn.

**Bước 1.** Thay $x=-2$ để nhận ra dạng vô định $\dfrac00$.

**Bước 2.** Phân tích tử bằng tam thức bậc hai và phân tích mẫu bằng cách chia đa thức cho $x+2$.

**Bước 3.** Rút gọn nhân tử $x+2$ rồi thay $x=-2$ vào phân thức còn lại để tính.

**Phần 2. Trình bày**

Ta có $2x^2-6x-20=2(x-5)(x+2)$ và $x^3-3x+2=(x+2)(x-1)^2$.

Với $x\neq-2$ thì:

$\dfrac{2x^2-6x-20}{x^3-3x+2}=\dfrac{2(x-5)}{(x-1)^2}$

Do đó:

$\lim_{x\to-2}\dfrac{2x^2-6x-20}{x^3-3x+2}=\lim_{x\to-2}\dfrac{2(x-5)}{(x-1)^2}=\dfrac{2\cdot(-7)}{9}=-\dfrac{14}{9}$

Vậy $\lim_{x\to-2}\dfrac{2x^2-6x-20}{x^3-3x+2}=-\dfrac{14}{9}$.

### Câu 5e | kho=dai | loai=tra_loi_ngan | dap_an=0,5
**Đề:** Tính giới hạn $\lim_{x\to0}\dfrac{\sqrt{x+1}-1}{x}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử chứa căn và cả tử, mẫu cùng bằng $0$ tại $x=0$ nên nhân tử và mẫu với biểu thức liên hợp của tử.

**Bước 1.** Thay $x=0$ để nhận ra dạng vô định $\dfrac00$ và thấy căn nằm ở tử.

**Bước 2.** Nhân cả tử và mẫu với lượng liên hợp của tử để tử trở thành $x$.

**Bước 3.** Rút gọn $x$ rồi thay $x=0$ vào biểu thức còn lại.

**Phần 2. Trình bày**

Với $x\neq0$, nhân cả tử và mẫu với $\sqrt{x+1}+1$, ta được:

$\dfrac{\sqrt{x+1}-1}{x}=\dfrac{(x+1)-1}{x(\sqrt{x+1}+1)}=\dfrac{1}{\sqrt{x+1}+1}$

Do đó:

$\lim_{x\to0}\dfrac{\sqrt{x+1}-1}{x}=\lim_{x\to0}\dfrac{1}{\sqrt{x+1}+1}=\dfrac12$

Vậy $\lim_{x\to0}\dfrac{\sqrt{x+1}-1}{x}=\dfrac12=0{,}5$.

### Câu 5f | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to1}\dfrac{\sqrt{3x+2}-\sqrt{2x+3}}{x-1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử là hiệu hai căn bậc hai và dạng vô định $\dfrac00$ tại $x=1$ nên nhân với lượng liên hợp của tử.

**Bước 1.** Thay $x=1$ để kiểm tra dạng vô định $\dfrac00$ và nhận ra tử là hiệu hai căn.

**Bước 2.** Nhân cả tử và mẫu với tổng hai căn để tử trở thành hiệu hai biểu thức dưới căn.

**Bước 3.** Rút gọn nhân tử $x-1$ rồi thay $x=1$ vào biểu thức còn lại.

**Phần 2. Trình bày**

Với $x\neq1$, nhân cả tử và mẫu với $\sqrt{3x+2}+\sqrt{2x+3}$, ta được:

$\dfrac{\sqrt{3x+2}-\sqrt{2x+3}}{x-1}=\dfrac{(3x+2)-(2x+3)}{(x-1)(\sqrt{3x+2}+\sqrt{2x+3})}$

$=\dfrac{x-1}{(x-1)(\sqrt{3x+2}+\sqrt{2x+3})}=\dfrac{1}{\sqrt{3x+2}+\sqrt{2x+3}}$

Do đó:

$\lim_{x\to1}\dfrac{\sqrt{3x+2}-\sqrt{2x+3}}{x-1}=\dfrac{1}{\sqrt5+\sqrt5}=\dfrac{1}{2\sqrt5}=\dfrac{\sqrt5}{10}$

Vậy $\lim_{x\to1}\dfrac{\sqrt{3x+2}-\sqrt{2x+3}}{x-1}=\dfrac{\sqrt5}{10}$.

### Câu 5g | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Tính giới hạn $\lim_{x\to-1}\dfrac{\sqrt{x+2}-\sqrt{2x+3}}{2-\sqrt{x+5}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cả tử và mẫu đều là hiệu hai căn và cùng bằng $0$ tại $x=-1$ nên nhân liên hợp cho từng phần để cùng xuất hiện nhân tử $x+1$.

**Bước 1.** Thay $x=-1$ để nhận ra dạng vô định $\dfrac00$ ở cả tử và mẫu.

**Bước 2.** Nhân và chia tử với lượng liên hợp của tử, nhân và chia mẫu với lượng liên hợp của mẫu.

**Bước 3.** Đưa hiệu hai biểu thức dưới căn về $-(x+1)$ ở cả hai phần, rồi rút gọn nhân tử chung $x+1$.

**Bước 4.** Thay $x=-1$ vào phân thức còn lại để tính giới hạn.

**Phần 2. Trình bày**

Với $x\neq-1$ ta có:

$\sqrt{x+2}-\sqrt{2x+3}=\dfrac{(x+2)-(2x+3)}{\sqrt{x+2}+\sqrt{2x+3}}=\dfrac{-(x+1)}{\sqrt{x+2}+\sqrt{2x+3}}$

$2-\sqrt{x+5}=\dfrac{4-(x+5)}{2+\sqrt{x+5}}=\dfrac{-(x+1)}{2+\sqrt{x+5}}$

Do đó:

$\dfrac{\sqrt{x+2}-\sqrt{2x+3}}{2-\sqrt{x+5}}=\dfrac{2+\sqrt{x+5}}{\sqrt{x+2}+\sqrt{2x+3}}$

Suy ra:

$\lim_{x\to-1}\dfrac{\sqrt{x+2}-\sqrt{2x+3}}{2-\sqrt{x+5}}=\dfrac{2+\sqrt4}{\sqrt1+\sqrt1}=\dfrac{4}{2}=2$

Vậy $\lim_{x\to-1}\dfrac{\sqrt{x+2}-\sqrt{2x+3}}{2-\sqrt{x+5}}=2$.

### Câu 5h | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to-1}\dfrac{\sqrt{2x+3}-\sqrt[3]{x+2}}{x+1}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử là hiệu của căn bậc hai và căn bậc ba nên trừ rồi cộng thêm $1$ để tách thành hai giới hạn, mỗi giới hạn dùng một lượng liên hợp riêng.

**Bước 1.** Thay $x=-1$ để nhận ra dạng vô định $\dfrac00$ và thấy cả hai căn đều có giá trị $1$ tại điểm đó.

**Bước 2.** Tách tử thành $(\sqrt{2x+3}-1)-(\sqrt[3]{x+2}-1)$ để mỗi phần có dạng vô định riêng.

**Bước 3.** Với căn bậc hai, nhân liên hợp bằng tổng; với căn bậc ba, dùng hằng đẳng thức $A^3-1=(A-1)(A^2+A+1)$ để khử $x+1$.

**Bước 4.** Tính giới hạn từng phần rồi trừ hai kết quả.

**Phần 2. Trình bày**

Ta viết:

$\dfrac{\sqrt{2x+3}-\sqrt[3]{x+2}}{x+1}=\dfrac{\sqrt{2x+3}-1}{x+1}-\dfrac{\sqrt[3]{x+2}-1}{x+1}$

Với $x\neq-1$:

$\dfrac{\sqrt{2x+3}-1}{x+1}=\dfrac{(2x+3)-1}{(x+1)(\sqrt{2x+3}+1)}=\dfrac{2}{\sqrt{2x+3}+1}$

Do đó $\lim_{x\to-1}\dfrac{\sqrt{2x+3}-1}{x+1}=\dfrac{2}{1+1}=1$.

Đặt $A=\sqrt[3]{x+2}$ thì $A^3-1=x+1$, nên với $x\neq-1$:

$\dfrac{\sqrt[3]{x+2}-1}{x+1}=\dfrac{A-1}{A^3-1}=\dfrac{1}{A^2+A+1}$

Khi $x\to-1$ thì $A\to1$ nên $\lim_{x\to-1}\dfrac{\sqrt[3]{x+2}-1}{x+1}=\dfrac{1}{1+1+1}=\dfrac13$.

Vậy $\lim_{x\to-1}\dfrac{\sqrt{2x+3}-\sqrt[3]{x+2}}{x+1}=1-\dfrac13=\dfrac23$.

### Câu 6 | kho=dai | loai=tra_loi_ngan | dap_an=2
**Đề:** Cho hình vuông $(C_1)$ có cạnh bằng $a$. Người ta chia mỗi cạnh của hình vuông thành bốn phần bằng nhau và nối các điểm chia một cách thích hợp để có hình vuông $(C_2)$ (như hình vẽ). Từ hình vuông $(C_2)$ lại tiếp tục làm như trên ta nhận được dãy các hình vuông $C_1,C_2,C_3,\dots,C_n$. Gọi $S_i$ là diện tích của hình vuông $C_i$ $(i\in\{1,2,3,\dots\})$. Đặt $T=S_1+S_2+S_3+\dots+S_n+\dots$. Biết $T=\dfrac{32}{3}$, tìm $a$.
**Hình:** de_P21C6.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích các hình vuông lập thành cấp số nhân lùi vô hạn nên $T$ là tổng của cấp số nhân đó và tìm $a$ từ phương trình theo $a$.

**Bước 1.** Tính cạnh của hình vuông $C_2$ theo $a$ bằng định lí Pythagore trong tam giác vuông tạo bởi hai đoạn chia trên một cạnh của $C_1$.

**Bước 2.** Lập tỉ số $\dfrac{S_2}{S_1}$ và chỉ ra tỉ số này không đổi qua mọi bước, để kết luận $(S_n)$ là cấp số nhân.

**Bước 3.** Dùng công thức tổng của cấp số nhân lùi vô hạn $\dfrac{u_1}{1-q}$ để biểu diễn $T$ theo $a$.

**Bước 4.** Giải phương trình $T=\dfrac{32}{3}$ rồi chọn $a$ dương vì $a$ là độ dài cạnh.

**Phần 2. Trình bày**

Gọi $a_n$ là cạnh của hình vuông $C_n$ thì $a_1=a$.

Mỗi cạnh của $C_1$ chia thành các đoạn $\dfrac a4$ và $\dfrac{3a}{4}$, cạnh của $C_2$ là cạnh huyền của tam giác vuông có hai cạnh góc vuông $\dfrac a4$ và $\dfrac{3a}4$.

$a_2^2=(\dfrac a4)^2+(\dfrac{3a}4)^2=\dfrac{10a^2}{16}=\dfrac58a^2$

Do đó $S_2=\dfrac58S_1$. Tương tự $S_{n+1}=\dfrac58S_n$ với mọi $n\ge1$.

Vậy $(S_n)$ là cấp số nhân với $S_1=a^2$, công bội $q=\dfrac58$, $|q|<1$.

$T=\dfrac{S_1}{1-q}=\dfrac{a^2}{1-\dfrac58}=\dfrac{8a^2}{3}$

Theo đề $T=\dfrac{32}{3}$ nên:

$\dfrac{8a^2}{3}=\dfrac{32}{3}$

$a^2=4$

Vì $a>0$ nên $a=2$.

Vậy $a=2$.

### Câu 7 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho $y=f(x)=\begin{cases} \dfrac{\sqrt x-1}{x-1}+b & \text{khi } x>1 \\ ax+3 & \text{khi } x\le1 \end{cases}$. Biết $\lim_{x\to1}f(x)=2025$. Tính giá trị biểu thức $T=2a+b$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** giới hạn của $f$ tại $1$ tồn tại khi giới hạn bên trái và giới hạn bên phải cùng tồn tại và bằng nhau, nên lập hai phương trình theo $a$ và $b$.

**Bước 1.** Tính giới hạn bên trái tại $x=1$ bằng cách dùng nhánh $ax+3$.

**Bước 2.** Tính giới hạn bên phải tại $x=1$ bằng cách nhân liên hợp phân thức chứa căn rồi cộng $b$.

**Bước 3.** Cho cả hai giới hạn một bên bằng $2025$ để tìm $a$ và $b$.

**Bước 4.** Thay vào biểu thức $T=2a+b$ để tính.

**Phần 2. Trình bày**

Giới hạn bên trái: $\lim_{x\to1^-}f(x)=\lim_{x\to1^-}(ax+3)=a+3$.

Giới hạn bên phải: với $x>1$,

$\dfrac{\sqrt x-1}{x-1}=\dfrac{(\sqrt x-1)(\sqrt x+1)}{(x-1)(\sqrt x+1)}=\dfrac{1}{\sqrt x+1}$

nên $\lim_{x\to1^+}f(x)=\lim_{x\to1^+}(\dfrac{1}{\sqrt x+1}+b)=\dfrac12+b$.

Vì $\lim_{x\to1}f(x)=2025$ nên cả hai giới hạn một bên đều bằng $2025$:

$a+3=2025$ suy ra $a=2022$.

$\dfrac12+b=2025$ suy ra $b=2024{,}5$.

$T=2a+b=2\cdot2022+2024{,}5=6068{,}5$

Vậy $T=6068{,}5$.

### Câu 8a | kho=dai | loai=tra_loi_ngan | dap_an=8
**Đề:** Cho số thực $a$ thỏa mãn $\lim_{x\to1}\dfrac{x^2-3x+a}{x+1}=3$. Tìm $a$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu $x+1$ khác $0$ tại $x=1$ nên giới hạn bằng giá trị của phân thức tại $x=1$, từ đó lập phương trình theo $a$.

**Bước 1.** Kiểm tra mẫu tại $x=1$ để biết không có dạng vô định và có thể thay trực tiếp.

**Bước 2.** Tính giá trị của phân thức tại $x=1$ theo $a$ bằng quy tắc giới hạn của thương.

**Bước 3.** Cho giá trị đó bằng $3$ và giải phương trình bậc nhất ẩn $a$.

**Phần 2. Trình bày**

Vì $\lim_{x\to1}(x+1)=2\neq0$ nên:

$\lim_{x\to1}\dfrac{x^2-3x+a}{x+1}=\dfrac{1-3+a}{2}=\dfrac{a-2}{2}$

Theo đề, $\dfrac{a-2}{2}=3$.

$a-2=6$

$a=8$

Vậy $a=8$.

### Câu 8b | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho hai số thực $b$, $c$ thỏa mãn $\lim_{x\to2}\dfrac{x^2+bx+c}{x-2}=7$. Tìm $b$, $c$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** mẫu tiến về $0$ mà giới hạn hữu hạn nên tử cũng phải triệt tiêu tại $x=2$, từ đó có một phương trình liên hệ $b$ và $c$.

**Bước 1.** Giải thích vì sao tử phải bằng $0$ khi $x=2$ để giới hạn của thương là số hữu hạn.

**Bước 2.** Rút $c$ theo $b$ rồi phân tích tử thành nhân tử có chứa $x-2$.

**Bước 3.** Rút gọn nhân tử $x-2$, tính giới hạn theo $b$ rồi cho bằng $7$ để tìm $b$ và suy ra $c$.

**Phần 2. Trình bày**

Vì $\lim_{x\to2}(x-2)=0$ và giới hạn của thương hữu hạn nên $\lim_{x\to2}(x^2+bx+c)=0$, tức:

$4+2b+c=0$

Suy ra $c=-4-2b$.

Khi đó $x^2+bx+c=x^2+bx-4-2b=(x-2)(x+2+b)$.

Với $x\neq2$ thì $\dfrac{x^2+bx+c}{x-2}=x+2+b$ nên:

$\lim_{x\to2}\dfrac{x^2+bx+c}{x-2}=\lim_{x\to2}(x+2+b)=4+b$

Theo đề $4+b=7$ nên $b=3$, suy ra $c=-4-2\cdot3=-10$.

Vậy $b=3$, $c=-10$.

### Câu 9a | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to+\infty}\dfrac{4x+1}{3x-2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc nhất nên chia cả hai cho $x$ rồi dùng $\lim_{x\to+\infty}\dfrac1x=0$.

**Bước 1.** Xác định bậc cao nhất của tử và mẫu để chọn lũy thừa của $x$ đem chia.

**Bước 2.** Chia cả tử và mẫu cho $x$ để các số hạng còn lại có dạng $\dfrac cx$.

**Bước 3.** Dùng $\lim_{x\to+\infty}\dfrac1x=0$ và quy tắc thương để tính.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $x$, ta được:

$\lim_{x\to+\infty}\dfrac{4x+1}{3x-2}=\lim_{x\to+\infty}\dfrac{4+\dfrac1x}{3-\dfrac2x}=\dfrac43$

Vậy $\lim_{x\to+\infty}\dfrac{4x+1}{3x-2}=\dfrac43$.

### Câu 9b | kho=dai | loai=tra_loi_ngan | dap_an=-2
**Đề:** Tính giới hạn $\lim_{x\to-\infty}\dfrac{2x^2+1}{3+2x-x^2}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu cùng bậc hai nên chia cả hai cho $x^2$ và chú ý hệ số cao nhất của mẫu là số âm.

**Bước 1.** So sánh bậc cao nhất của tử và mẫu để chọn $x^2$ làm số đem chia.

**Bước 2.** Chia cả tử và mẫu cho $x^2$ để các số hạng còn lại đều có dạng $\dfrac c{x^k}$.

**Bước 3.** Dùng $\lim_{x\to-\infty}\dfrac1{x^k}=0$ rồi lập thương, chú ý dấu của hệ số của $x^2$ ở mẫu.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $x^2$, ta được:

$\lim_{x\to-\infty}\dfrac{2x^2+1}{3+2x-x^2}=\lim_{x\to-\infty}\dfrac{2+\dfrac1{x^2}}{\dfrac3{x^2}+\dfrac2x-1}=\dfrac{2}{-1}=-2$

Vậy $\lim_{x\to-\infty}\dfrac{2x^2+1}{3+2x-x^2}=-2$.

### Câu 9c | kho=dai | loai=tra_loi_ngan | dap_an=0
**Đề:** Tính giới hạn $\lim_{x\to+\infty}\dfrac{4x^2-1}{x^3+x-4}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** bậc của mẫu cao hơn bậc của tử nên chia cả tử và mẫu cho $x^3$, lũy thừa cao nhất của mẫu.

**Bước 1.** So sánh bậc cao nhất của tử với bậc cao nhất của mẫu để chọn lũy thừa đem chia.

**Bước 2.** Chia cả tử và mẫu cho $x^3$ để mọi số hạng chứa $x$ đều có dạng $\dfrac{c}{x^k}$.

**Bước 3.** Dùng $\lim_{x\to+\infty}\dfrac1{x^k}=0$ để tính giới hạn của tử, của mẫu rồi lập thương.

**Phần 2. Trình bày**

Chia cả tử và mẫu cho $x^3$, ta được:

$\lim_{x\to+\infty}\dfrac{4x^2-1}{x^3+x-4}=\lim_{x\to+\infty}\dfrac{\dfrac4x-\dfrac1{x^3}}{1+\dfrac1{x^2}-\dfrac4{x^3}}$

Tử có giới hạn $0$ và mẫu có giới hạn $1$, nên giới hạn của thương là $\dfrac01=0$.

Vậy $\lim_{x\to+\infty}\dfrac{4x^2-1}{x^3+x-4}=0$.

### Câu 9d | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to+\infty}\dfrac{\sqrt{3x^2+2}}{5x+\sqrt{x^2+1}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** các căn đều có bậc $1$ theo $x$ nên chia cả tử và mẫu cho $x$ và đưa $x$ vào trong căn với điều kiện $x>0$.

**Bước 1.** Xác định bậc của tử và mẫu, tính cả bậc của các căn, để chọn lũy thừa đem chia.

**Bước 2.** Chia cả tử và mẫu cho $x$, dùng $\dfrac{\sqrt{A}}{x}=\sqrt{\dfrac{A}{x^2}}$ vì $x>0$ khi $x\to+\infty$.

**Bước 3.** Dùng $\lim_{x\to+\infty}\dfrac1{x^2}=0$ và quy tắc căn, quy tắc thương để kết luận.

**Phần 2. Trình bày**

Với $x>0$, chia cả tử và mẫu cho $x$, ta được:

$\dfrac{\sqrt{3x^2+2}}{5x+\sqrt{x^2+1}}=\dfrac{\sqrt{3+\dfrac2{x^2}}}{5+\sqrt{1+\dfrac1{x^2}}}$

Vì $\lim_{x\to+\infty}\dfrac1{x^2}=0$ nên:

$\lim_{x\to+\infty}\dfrac{\sqrt{3+\dfrac2{x^2}}}{5+\sqrt{1+\dfrac1{x^2}}}=\dfrac{\sqrt3}{5+1}=\dfrac{\sqrt3}{6}$

Vậy $\lim_{x\to+\infty}\dfrac{\sqrt{3x^2+2}}{5x+\sqrt{x^2+1}}=\dfrac{\sqrt3}{6}$.

### Câu 9e | kho=dai | loai=tra_loi_ngan | dap_an=-3
**Đề:** Tính giới hạn $\lim_{x\to-\infty}\dfrac{3x-1}{\sqrt{1+4x+x^2}}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** khi $x\to-\infty$ thì $x<0$ nên $\sqrt{x^2}=-x$, và dấu trừ này làm đổi dấu kết quả so với trường hợp $x\to+\infty$.

**Bước 1.** Xác định bậc của tử và của căn ở mẫu để chọn lũy thừa $x$ đem chia.

**Bước 2.** Đưa $x^2$ ra ngoài căn ở mẫu và nhớ $\sqrt{x^2}=|x|=-x$ vì $x<0$.

**Bước 3.** Chia cả tử và mẫu cho $x$ để chỉ còn các số hạng dạng $\dfrac cx$ và hằng số.

**Bước 4.** Dùng $\lim_{x\to-\infty}\dfrac1x=0$ rồi lập thương, chú ý dấu.

**Phần 2. Trình bày**

Với $x<0$ ta có:

$\sqrt{1+4x+x^2}=\sqrt{x^2(1+\dfrac4x+\dfrac1{x^2})}=|x|\sqrt{1+\dfrac4x+\dfrac1{x^2}}=-x\sqrt{1+\dfrac4x+\dfrac1{x^2}}$

Chia cả tử và mẫu cho $x$:

$\dfrac{3x-1}{\sqrt{1+4x+x^2}}=\dfrac{3-\dfrac1x}{-\sqrt{1+\dfrac4x+\dfrac1{x^2}}}$

Vì $\lim_{x\to-\infty}\dfrac1x=0$ nên:

$\lim_{x\to-\infty}\dfrac{3x-1}{\sqrt{1+4x+x^2}}=\dfrac{3}{-\sqrt1}=-3$

Vậy $\lim_{x\to-\infty}\dfrac{3x-1}{\sqrt{1+4x+x^2}}=-3$.

### Câu 9f | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính giới hạn $\lim_{x\to+\infty}\dfrac{(4x^2-1)(2+3x-x^5)}{(x^3+x-4)(3x^4-x^2-1)}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tử và mẫu đều là tích hai đa thức nên bậc của mỗi bên bằng tổng bậc hai nhân tử, rồi chia cả hai cho lũy thừa cao nhất đó.

**Bước 1.** Tính bậc của tử và bậc của mẫu bằng cách cộng bậc hai nhân tử, để chọn lũy thừa đem chia.

**Bước 2.** Chia từng nhân tử cho lũy thừa của $x$ tương ứng với bậc của nó.

**Bước 3.** Dùng $\lim_{x\to+\infty}\dfrac1{x^k}=0$ ở từng nhân tử rồi nhân các giới hạn và lập thương, chú ý dấu của hệ số $x^5$.

**Phần 2. Trình bày**

Tử và mẫu đều có bậc $7$. Chia từng nhân tử cho lũy thừa của $x$ cùng bậc với nó, ta được:

$\lim_{x\to+\infty}\dfrac{(4x^2-1)(2+3x-x^5)}{(x^3+x-4)(3x^4-x^2-1)}=\lim_{x\to+\infty}\dfrac{(4-\dfrac1{x^2})(\dfrac2{x^5}+\dfrac3{x^4}-1)}{(1+\dfrac1{x^2}-\dfrac4{x^3})(3-\dfrac1{x^2}-\dfrac1{x^4})}$

Vì $\lim_{x\to+\infty}\dfrac1{x^k}=0$ với mọi $k>0$ nên:

$\lim_{x\to+\infty}\dfrac{(4-\dfrac1{x^2})(\dfrac2{x^5}+\dfrac3{x^4}-1)}{(1+\dfrac1{x^2}-\dfrac4{x^3})(3-\dfrac1{x^2}-\dfrac1{x^4})}=\dfrac{4\cdot(-1)}{1\cdot3}=-\dfrac43$

Vậy giới hạn đã cho bằng $-\dfrac43$.

### Câu 10 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Cho hàm số $y=f(x)=\begin{cases} 4x+5 & \text{khi } x\neq-2 \\ a & \text{khi } x=-2 \end{cases}$
a) Tìm $a$ để hàm số liên tục tại $x=-2$.
b) Tìm $a$ để hàm số liên tục trên tập xác định của nó.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hàm số liên tục tại $x=-2$ khi giới hạn của $f$ tại $-2$ bằng giá trị $f(-2)$, còn ở các điểm khác thì $f$ trùng với một đa thức.

**Bước 1.** Ý a: tính $f(-2)$ và giới hạn của $f(x)$ khi $x\to-2$ (dùng nhánh $x\neq-2$).

**Bước 2.** Ý a: áp dụng định nghĩa liên tục tại một điểm, cho hai giá trị trên bằng nhau để tìm $a$.

**Bước 3.** Ý b: xét tính liên tục tại các điểm $x\neq-2$ bằng tính chất của hàm đa thức.

**Bước 4.** Ý b: kết hợp với điều kiện liên tục tại $x=-2$ ở ý a để kết luận.

**Phần 2. Trình bày**

a) Tập xác định của hàm số là $\mathbb{R}$ và $f(-2)=a$.

$\lim_{x\to-2}f(x)=\lim_{x\to-2}(4x+5)=-3$

Hàm số liên tục tại $x=-2$ khi và chỉ khi $\lim_{x\to-2}f(x)=f(-2)$, tức $a=-3$.

Vậy $a=-3$.

b) Với $x\neq-2$ thì $f(x)=4x+5$ là hàm đa thức nên liên tục trên các khoảng $(-\infty;-2)$ và $(-2;+\infty)$.

Do đó $f$ liên tục trên $\mathbb{R}$ khi và chỉ khi $f$ liên tục tại $x=-2$, tức $a=-3$.

Vậy $a=-3$.

### Câu 11 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Tính $\lim_{x\to2}\dfrac{\sqrt[3]{x+3}-\sqrt[3]{2x+1}}{x^2-4}$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** tại $x=2$ cả tử và mẫu cùng bằng $0$ và tử là hiệu hai căn bậc ba nên dùng hằng đẳng thức $A^3-B^3=(A-B)(A^2+AB+B^2)$ để nhân liên hợp.

**Bước 1.** Thay $x=2$ để nhận ra dạng vô định $\dfrac00$ và đặt tên cho hai căn bậc ba trong tử.

**Bước 2.** Nhân cả tử và mẫu với $A^2+AB+B^2$ để tử trở thành hiệu hai biểu thức trong căn.

**Bước 3.** Phân tích mẫu $x^2-4$ thành nhân tử rồi rút gọn nhân tử $x-2$ với tử.

**Bước 4.** Tính giới hạn biểu thức còn lại và trục căn thức ở mẫu nếu cần.

**Phần 2. Trình bày**

Đặt $A=\sqrt[3]{x+3}$, $B=\sqrt[3]{2x+1}$ thì $A^3-B^3=(x+3)-(2x+1)=2-x$.

Với $x\neq2$, nhân cả tử và mẫu với $A^2+AB+B^2$, ta được:

$\dfrac{A-B}{x^2-4}=\dfrac{A^3-B^3}{(x-2)(x+2)(A^2+AB+B^2)}=\dfrac{-(x-2)}{(x-2)(x+2)(A^2+AB+B^2)}$

$=\dfrac{-1}{(x+2)(A^2+AB+B^2)}$

Khi $x\to2$ thì $A\to\sqrt[3]5$, $B\to\sqrt[3]5$ nên $A^2+AB+B^2\to3\sqrt[3]{25}$.

Do đó:

$\lim_{x\to2}\dfrac{\sqrt[3]{x+3}-\sqrt[3]{2x+1}}{x^2-4}=\dfrac{-1}{4\cdot3\sqrt[3]{25}}=-\dfrac{1}{12\sqrt[3]{25}}=-\dfrac{\sqrt[3]5}{60}$

Vậy giới hạn đã cho bằng $-\dfrac{\sqrt[3]5}{60}$.

## PHẦN 22 | Chương IV: Đường thẳng và mặt phẳng trong không gian. Quan hệ song song — Phần I. Câu trắc nghiệm nhiều phương án lựa chọn | trac_nghiem

### Câu 1 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho hình chóp $S{.}ABCD$ đáy $ABCD$ là hình bình hành tâm $O$, giao tuyến của mặt $(SAC)$ và $(SBD)$ là
A. $SC$
B. $SA$
C. $SB$
D. $SO$

**Phần 1. Hướng dẫn**

**Mấu chốt:** giao tuyến của hai mặt phẳng phân biệt là đường thẳng đi qua hai điểm chung của chúng, nên cần tìm đủ hai điểm chung.

**Bước 1.** Chỉ ra điểm chung dễ thấy nhất của hai mặt phẳng là đỉnh của hình chóp.

**Bước 2.** Tìm điểm chung thứ hai bằng cách xét giao của hai đường chéo của đáy, xem điểm đó thuộc đường nào trong hai mặt phẳng.

**Bước 3.** Nối hai điểm chung vừa tìm được để có giao tuyến rồi so với các phương án.

**Phần 2. Trình bày**

Ta có $S\in(SAC)$ và $S\in(SBD)$.

$O=AC\cap BD$ mà $AC\subset(SAC)$ nên $O\in(SAC)$.

$BD\subset(SBD)$ nên $O\in(SBD)$.

Vậy $(SAC)\cap(SBD)=SO$.

Chọn D.

### Câu 2 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Cho tứ diện $ABCD$, gọi $M$, $N$ lần lượt là trung điểm của $CD$ và $AD$, $G$ là trọng tâm tam giác $ACD$. $BG$ là giao tuyến của hai mặt phẳng nào?
A. $(ABM)$ và $(BCN)$
B. $(ABM)$ và $(BDM)$
C. $(BCN)$ và $(ABC)$
D. $(BMN)$ và $(ABD)$

**Phần 1. Hướng dẫn**

**Mấu chốt:** đường thẳng $BG$ là giao tuyến của hai mặt phẳng khi $B$ và $G$ là hai điểm chung của chúng, nên kiểm tra từng cặp mặt phẳng có chứa cả $B$ và $G$ hay không.

**Bước 1.** Xác định $G$ nằm trên những đường trung tuyến nào của tam giác $ACD$.

**Bước 2.** Từ đó suy ra $G$ thuộc những mặt phẳng nào trong các mặt phẳng đề cho, mỗi trung tuyến đi qua $G$ cho một mặt phẳng chứa nó và điểm $B$.

**Bước 3.** Kiểm tra từng phương án xem hai mặt phẳng có cùng chứa $G$ hay không, loại các cặp có giao tuyến là đường khác.

**Phần 2. Trình bày**

$G$ là trọng tâm tam giác $ACD$ với $M$, $N$ lần lượt là trung điểm của $CD$, $AD$ nên $G=AM\cap CN$.

Vì $B$ chung và $G\in AM\subset(ABM)$, $G\in CN\subset(BCN)$ nên $B,G\in(ABM)\cap(BCN)$.

Do đó $(ABM)\cap(BCN)=BG$.

Các phương án còn lại: $(ABM)\cap(BDM)=BM$, $(BCN)\cap(ABC)=BC$, $(BMN)\cap(ABD)=BN$.

Chọn A.

### Câu 3 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho tứ diện $ABCD$. $M$, $N$ là hai điểm lần lượt thuộc hai cạnh $AB$, $AC$ sao cho $MN$ cắt $BC$ tại $I$. Khẳng định nào sau đây là đúng
A. Đường thẳng $MN$ cắt đường thẳng $CD$
B. Đường thẳng $DN$ cắt đường thẳng $AB$
C. Đường thẳng $AI$ cắt đường thẳng $CD$
D. $(DMN)\cap(DBC)=DI$

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai đường thẳng cắt nhau phải đồng phẳng, còn hai đường thẳng nằm trên hai mặt phẳng chỉ giao nhau tại một điểm của giao tuyến thì thường chéo nhau, nên xét từng phương án theo hai tiêu chí đó.

**Bước 1.** Với các phương án nói về hai đường thẳng cắt nhau, xét xem hai đường thẳng đó có cùng nằm trong một mặt phẳng của tứ diện hay không.

**Bước 2.** Với phương án về giao tuyến, tìm hai điểm chung của hai mặt phẳng, trong đó một điểm là đỉnh $D$.

**Bước 3.** Dùng điều kiện $MN$ cắt $BC$ tại $I$ để chứng minh $I$ là điểm chung còn lại.

**Bước 4.** Xét đủ bốn phương án rồi mới kết luận.

**Phần 2. Trình bày**

A sai: $MN\subset(ABC)$, còn $CD$ cắt $(ABC)$ tại $C$ mà $C\notin MN$ nên $MN$ và $CD$ không cắt nhau.

B sai: $DN\subset(ACD)$, còn $AB$ cắt $(ACD)$ tại $A$ mà $A\notin DN$ nên $DN$ và $AB$ chéo nhau.

C sai: $AI\subset(ABC)$, còn $CD$ cắt $(ABC)$ tại $C$ mà $C\notin AI$ nên $AI$ và $CD$ chéo nhau.

D đúng: $D$ là điểm chung của $(DMN)$ và $(DBC)$.

$I\in MN\subset(DMN)$ và $I\in BC\subset(DBC)$ nên $I$ cũng là điểm chung.

Do đó $(DMN)\cap(DBC)=DI$.

Chọn D.

### Câu 4 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho hình chóp $S{.}ABCD$. Gọi $M$ là điểm trên cạnh $AB$ ($M$ khác $A$, $B$), $N$ là điểm trên cạnh $SC$ ($N$ khác $S$, $C$). Giao điểm của $MN$ và $(SBD)$ là
A. Giao điểm của đường thẳng $MN$ với $SB$
B. Giao điểm của đường thẳng $MN$ với $SD$
C. Giao điểm của đường thẳng $MN$ với $BD$
D. Giao điểm của đường thẳng $MN$ với đường thẳng $SI$, trong đó $I$ là giao điểm của $BD$ và $CM$

**Phần 1. Hướng dẫn**

**Mấu chốt:** để tìm giao điểm của đường thẳng $MN$ với mặt phẳng $(SBD)$, chứa $MN$ trong một mặt phẳng phụ rồi tìm giao tuyến của mặt phẳng phụ đó với $(SBD)$.

**Bước 1.** Chọn mặt phẳng phụ chứa $MN$ sao cho dễ xác định giao tuyến, dựa vào việc $M$, $N$ nằm trên hai đường nào của hình chóp.

**Bước 2.** Tìm hai điểm chung của mặt phẳng phụ với $(SBD)$: một điểm là đỉnh $S$, điểm còn lại là giao của hai đường nằm trong đáy.

**Bước 3.** Giao điểm cần tìm là giao của $MN$ với giao tuyến vừa dựng, hai đường này cùng nằm trong mặt phẳng phụ.

**Bước 4.** Đối chiếu với từng phương án để chọn.

**Phần 2. Trình bày**

Vì $N\in SC$ nên $MN\subset(SMC)$.

Trong mặt phẳng $(ABCD)$ gọi $I=CM\cap BD$. Khi đó $I\in CM\subset(SMC)$ và $I\in BD\subset(SBD)$.

Lại có $S\in(SMC)\cap(SBD)$ nên $(SMC)\cap(SBD)=SI$.

Trong mặt phẳng $(SMC)$, gọi $H$ là giao điểm của hai đường thẳng $MN$ và $SI$.

Vì $H\in SI\subset(SBD)$ nên $H=MN\cap(SBD)$.

Vậy giao điểm của $MN$ và $(SBD)$ là giao điểm của $MN$ với $SI$.

Chọn D.

### Câu 5 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho tứ diện $ABCD$, $M$ là trung điểm $AB$; $N$ thuộc cạnh $AD$ sao cho $DN=\dfrac13AD$. Mặt phẳng $(CMN)$ cắt $BD$ tại $K$. Tính tỉ số $\dfrac{DK}{BK}$.
A. $\dfrac25$
B. $\dfrac13$
C. $\dfrac23$
D. $\dfrac12$

**Phần 1. Hướng dẫn**

**Mấu chốt:** điểm $K$ chính là giao điểm của hai đường thẳng $MN$ và $BD$ cùng nằm trong mặt phẳng $(ABD)$, nên tính tỉ số bằng đường thẳng song song và tam giác đồng dạng.

**Bước 1.** Chứng minh $K$ là giao điểm của $MN$ và $BD$ trong mặt phẳng $(ABD)$.

**Bước 2.** Kẻ qua $D$ một đường thẳng song song với $AB$ cắt $MN$ tại một điểm phụ để tạo hai cặp tam giác đồng dạng.

**Bước 3.** Dùng tỉ số $\dfrac{DN}{NA}$ và $AM=MB$ để tính tỉ số hai cạnh song song.

**Bước 4.** Suy ra tỉ số $\dfrac{DK}{BK}$ từ cặp tam giác đồng dạng còn lại.

**Phần 2. Trình bày**

Vì $(CMN)\cap BD=K$ nên $K\in MN$ và $K\in BD$, tức $K=MN\cap BD$ trong mặt phẳng $(ABD)$.

Từ $DN=\dfrac13AD$ suy ra $\dfrac{ND}{NA}=\dfrac12$.

Qua $D$ kẻ đường thẳng song song với $AB$, cắt đường thẳng $MN$ tại $E$.

Vì $DE\parallel AM$ nên hai tam giác $NDE$ và $NAM$ đồng dạng, suy ra $\dfrac{DE}{AM}=\dfrac{ND}{NA}=\dfrac12$.

Vì $AM=MB$ nên $DE=\dfrac12MB$.

Vì $DE\parallel BM$ nên hai tam giác $KDE$ và $KBM$ đồng dạng, suy ra $\dfrac{DK}{BK}=\dfrac{DE}{BM}=\dfrac12$.

Chọn D.

### Câu 6 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Chóp $S{.}ABCD$ có đáy $ABCD$ là hình bình hành, $M$, $N$, $P$ là trung điểm $AB$, $AD$, $SC$. Mặt phẳng $(MNP)$ cắt $SD$ tại $Q$. Tính tỉ số $\dfrac{QD}{QS}$.
A. $\dfrac13$
B. $\dfrac14$
C. $\dfrac15$
D. $\dfrac25$

**Phần 1. Hướng dẫn**

**Mấu chốt:** $MN\parallel BD$ nên giao tuyến của $(MNP)$ với $(SBD)$ song song với $BD$, từ đó chuyển bài toán về tỉ số trên $SO$ rồi trên $SD$.

**Bước 1.** Tìm giao điểm $I$ của $MN$ với $AC$ trong đáy và tính vị trí của $I$ trên $AC$.

**Bước 2.** Trong mặt phẳng $(SAC)$, tìm giao điểm $R$ của $PI$ với $SO$ rồi tính tỉ số $\dfrac{SR}{SO}$ bằng đường thẳng song song.

**Bước 3.** Qua $R$ kẻ đường thẳng song song với $BD$ trong $(SBD)$, cắt $SD$ tại $Q$ và suy ra tỉ số trên $SD$.

**Bước 4.** Suy ra $\dfrac{QD}{QS}$ từ tỉ số $\dfrac{SQ}{SD}$ vừa tính được.

**Phần 2. Trình bày**

Gọi $O=AC\cap BD$ và $I=MN\cap AC$. Vì $MN$ là đường trung bình của tam giác $ABD$ nên $MN\parallel BD$ và $I$ là trung điểm của $AO$, suy ra $CI=\dfrac34AC$ và $CO=\dfrac23CI$.

Trong $(SAC)$, gọi $R=PI\cap SO$. Qua $O$ kẻ $OT\parallel IP$ ($T\in SC$). Trong tam giác $CIP$ có $OT\parallel IP$ nên $CT=\dfrac23CP=\dfrac13SC$, suy ra $ST=\dfrac23SC$ và $SP=\dfrac12SC$.

Trong tam giác $STO$ có $PR\parallel TO$ nên $\dfrac{SR}{SO}=\dfrac{SP}{ST}=\dfrac34$.

Vì $MN\parallel BD$ nên $(MNP)\cap(SBD)$ là đường thẳng qua $R$ song song với $BD$, cắt $SD$ tại $Q$. Do đó $\dfrac{SQ}{SD}=\dfrac{SR}{SO}=\dfrac34$.

Suy ra $QS=\dfrac34SD$ và $QD=\dfrac14SD$, nên $\dfrac{QD}{QS}=\dfrac13$.

Chọn A.

### Câu 7 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy là hình thang ($AB\parallel CD$). Gọi $I$, $J$ lần lượt là trung điểm của $AD$ và $BC$, $G$ là trọng tâm tam giác $SAB$. Giao tuyến của $(SAB)$ và $(IJG)$ là
A. $SC$
B. đường thẳng qua $S$ và song song với $AB$
C. đường thẳng qua $G$ và song song với $CD$
D. đường thẳng $GJ$

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng chứa hai đường thẳng song song thì giao tuyến song song với hai đường thẳng đó nên cần tìm một đường thẳng song song nằm trong mỗi mặt phẳng.

**Bước 1.** Xác định $IJ$ là đường gì của hình thang và nó song song với đường nào trong đáy.

**Bước 2.** Tìm một điểm chung của hai mặt phẳng, dựa vào vị trí của $G$.

**Bước 3.** Áp dụng định lí về giao tuyến của hai mặt phẳng cắt nhau chứa hai đường thẳng song song để xác định hướng của giao tuyến.

**Phần 2. Trình bày**

Vì $I$, $J$ là trung điểm của $AD$, $BC$ nên $IJ$ là đường trung bình của hình thang $ABCD$, suy ra $IJ\parallel AB\parallel CD$.

$G\in(SAB)$ và $G\in(IJG)$ nên $G$ là điểm chung của hai mặt phẳng.

Ta có $IJ\subset(IJG)$, $AB\subset(SAB)$ và $IJ\parallel AB$ nên giao tuyến của hai mặt phẳng là đường thẳng $d$ đi qua $G$ và song song với $IJ$, $AB$.

Vì $AB\parallel CD$ nên $d\parallel CD$.

Vậy giao tuyến là đường thẳng qua $G$ và song song với $CD$.

Chọn C.

### Câu 8 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy là hình bình hành. Giao tuyến của mặt phẳng $(SAD)$ và mặt phẳng $(SBC)$ là đường thẳng song song với đường thẳng nào sau đây
A. $AD$
B. $BD$
C. $AC$
D. $SC$

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng cắt nhau lần lượt chứa hai đường thẳng song song thì giao tuyến song song với hai đường thẳng đó.

**Bước 1.** Tìm điểm chung hiển nhiên của hai mặt phẳng, là đỉnh chung của hai mặt bên.

**Bước 2.** Từ tính chất hình bình hành, tìm hai đường thẳng song song, một đường nằm trong mỗi mặt phẳng.

**Bước 3.** Áp dụng định lí về giao tuyến song song để xác định hướng của giao tuyến rồi đối chiếu với các phương án.

**Phần 2. Trình bày**

Hai mặt phẳng $(SAD)$ và $(SBC)$ có điểm chung $S$.

Vì $ABCD$ là hình bình hành nên $AD\parallel BC$, mà $AD\subset(SAD)$, $BC\subset(SBC)$.

Do đó giao tuyến của $(SAD)$ và $(SBC)$ là đường thẳng đi qua $S$ và song song với $AD$ (và $BC$).

Chọn A.

### Câu 9 | kho=hinh_hoc | loai=trac_nghiem | dap_an=B
**Đề:** Cho tứ diện $ABCD$, gọi $G$ và $E$ lần lượt là trọng tâm của tam giác $ABD$ và $ABC$. Và các mệnh đề
(I) $GE$ và $CD$ chéo nhau
(II) $GE\parallel CD$
(III) $GE$ cắt $AD$
(IV) $GE$ cắt $AC$
Số mệnh đề đúng là:
A. $0$
B. $1$
C. $2$
D. $3$

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai trọng tâm cùng nằm trên hai trung tuyến xuất phát từ một trung điểm chung nên tỉ số trên hai trung tuyến bằng nhau, từ đó suy ra $GE$ song song với một cạnh của tứ diện.

**Bước 1.** Gọi trung điểm của cạnh chung $AB$ rồi viết vị trí của $G$ và $E$ trên hai trung tuyến kẻ từ điểm đó.

**Bước 2.** So sánh hai tỉ số để dùng định lí Thalès đảo, xác định $GE$ song song với đường nào.

**Bước 3.** Xét mệnh đề (I) và (II) dựa vào kết quả song song vừa có.

**Bước 4.** Xét (III) và (IV) bằng cách tìm giao điểm của $AD$, $AC$ với mặt phẳng chứa $GE$, rồi đếm số mệnh đề đúng.

**Phần 2. Trình bày**

Gọi $M$ là trung điểm của $AB$. Khi đó $G\in MD$, $E\in MC$ và $\dfrac{MG}{MD}=\dfrac{ME}{MC}=\dfrac13$.

Suy ra $GE\parallel CD$ (định lí Thalès đảo trong tam giác $MCD$).

(I) sai vì $GE\parallel CD$ nên không chéo nhau. (II) đúng.

$GE$, $CD$ cùng nằm trong mặt phẳng $(MCD)$ và $GE$ không đi qua $D$ (do $GE\parallel CD$, $GE\neq CD$).

(III) Mặt phẳng $(MCD)$ cắt đường thẳng $AD$ tại đúng điểm $D$. Nếu $GE$ cắt $AD$ thì giao điểm là $D$, nhưng $D\notin GE$. Vậy (III) sai.

(IV) Tương tự, $(MCD)$ cắt $AC$ tại đúng điểm $C$ và $C\notin GE$. Vậy (IV) sai.

Có đúng $1$ mệnh đề đúng.

Chọn B.

### Câu 10 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho tứ diện $ABCD$. Gọi $M$, $N$ lần lượt là trung điểm của các cạnh $AC$, $BC$. Xác định giao tuyến của hai mặt phẳng $(DAN)$ và $(DBM)$.
A. $(DAN)\cap(DBM)=DH$ ($H$ là trực tâm tam giác $ABC$).
B. $(DAN)\cap(DBM)=DI$ ($I$ là trung điểm $MN$).
C. $(DAN)\cap(DBM)=DG$ ($G$ là trọng tâm tam giác $ABC$).
D. $(DAN)\cap(DBM)=MN$.
**Hình:** de_P22C10.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng có điểm chung $D$ nên chỉ cần tìm thêm một điểm chung nằm trong mặt phẳng đáy $(ABC)$ bằng giao của hai đường mà mỗi đường thuộc một mặt phẳng.

**Bước 1.** Chỉ ra điểm chung $D$ của hai mặt phẳng.

**Bước 2.** Trong mặt phẳng $(ABC)$, tìm giao điểm của $AN$ và $BM$, chú ý $M$, $N$ là trung điểm của hai cạnh nào.

**Bước 3.** Chứng minh giao điểm đó thuộc cả hai mặt phẳng rồi gọi tên điểm đặc biệt của tam giác $ABC$ mà nó là.

**Bước 4.** Nối với $D$ và đối chiếu các phương án.

**Phần 2. Trình bày**

Ta có $D\in(DAN)\cap(DBM)$.

Trong tam giác $ABC$, $AN$ và $BM$ là hai đường trung tuyến nên cắt nhau tại trọng tâm $G$.

$G\in AN\subset(DAN)$ và $G\in BM\subset(DBM)$ nên $G$ là điểm chung thứ hai.

Do đó $(DAN)\cap(DBM)=DG$ với $G$ là trọng tâm tam giác $ABC$.

Chọn C.

### Câu 11 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho tứ diện $ABCD$. Gọi $M$, $N$ lần lượt là trung điểm của $AC$, $CD$. Giao tuyến của hai mặt phẳng $(MBD)$ và $(ABN)$ là:
A. Đường thẳng $BN$
B. Đường thẳng $BH$ ($H$ là trực tâm tam giác $ACD$)
C. Đường thẳng $BG$ ($G$ là trọng tâm tam giác $ACD$)
D. Đường thẳng $BM$
**Hình:** de_P22C11.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai mặt phẳng có điểm chung $B$ nên cần thêm một điểm chung nằm trong mặt phẳng $(ACD)$, là giao của hai đường mà mỗi đường thuộc một mặt phẳng.

**Bước 1.** Chỉ ra điểm chung $B$ của hai mặt phẳng.

**Bước 2.** Trong mặt phẳng $(ACD)$, xác định $DM$ và $AN$ là hai đường gì của tam giác $ACD$ rồi tìm giao điểm của chúng.

**Bước 3.** Chứng minh giao điểm này thuộc cả $(MBD)$ và $(ABN)$.

**Bước 4.** Nối điểm đó với $B$ để có giao tuyến.

**Phần 2. Trình bày**

Ta có $B\in(MBD)\cap(ABN)$.

Trong tam giác $ACD$, $M$ là trung điểm của $AC$ và $N$ là trung điểm của $CD$ nên $DM$, $AN$ là hai đường trung tuyến, chúng cắt nhau tại trọng tâm $G$.

$G\in DM\subset(MBD)$ và $G\in AN\subset(ABN)$ nên $G$ là điểm chung thứ hai.

Do đó $(MBD)\cap(ABN)=BG$ với $G$ là trọng tâm tam giác $ACD$.

Chọn C.

### Câu 12 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho tứ diện $ABCD$. Gọi $M$, $N$ lần lượt là trung điểm các cạnh $AB$, $CD$. Xác định giao tuyến của mặt phẳng $(ABN)$ và $(ACD)$
A. $BN$
B. $MN$
C. $AB$
D. $AN$
**Hình:** de_P22C12.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** giao tuyến là đường thẳng qua hai điểm chung, và một điểm chung là đỉnh $A$ thuộc cả hai mặt phẳng.

**Bước 1.** Chỉ ra điểm chung $A$ của $(ABN)$ và $(ACD)$.

**Bước 2.** Xét điểm $N$ nằm trên cạnh nào của tứ diện để biết nó thuộc mặt phẳng nào trong hai mặt phẳng.

**Bước 3.** Nối hai điểm chung để có giao tuyến.

**Phần 2. Trình bày**

$A\in(ABN)$ và $A\in(ACD)$.

$N\in CD\subset(ACD)$ và $N\in(ABN)$.

Vậy $(ABN)\cap(ACD)=AN$.

Chọn D.

### Câu 13 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Cho hình chóp $S{.}ABCD$ và $E$ là một điểm tùy ý trên cạnh $SD$ như hình vẽ bên. Giao tuyến của mặt phẳng $(ABE)$ và $(SBD)$ là đường thẳng
A. $BE$
B. $SB$
C. $AE$
D. $SA$
**Hình:** de_P22C13.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** giao tuyến của hai mặt phẳng là đường thẳng qua hai điểm chung nên cần tìm hai điểm vừa thuộc $(ABE)$ vừa thuộc $(SBD)$.

**Bước 1.** Tìm điểm chung hiển nhiên là đỉnh của đáy có mặt trong tên của cả hai mặt phẳng.

**Bước 2.** Xét điểm $E$ nằm trên cạnh $SD$ để kiểm tra nó thuộc mặt phẳng nào trong hai mặt phẳng.

**Bước 3.** Nối hai điểm chung vừa tìm được và đối chiếu các phương án.

**Phần 2. Trình bày**

$B\in(ABE)$ và $B\in(SBD)$.

$E\in(ABE)$ và $E\in SD\subset(SBD)$ nên $E\in(SBD)$.

Vậy $(ABE)\cap(SBD)=BE$.

Chọn A.

### Câu 14 | kho=hinh_hoc | loai=trac_nghiem | dap_an=B
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy là hình bình hành $ABCD$ tâm $O$. Gọi $E$ là trung điểm của $SC$. Tìm giao tuyến của $(BED)$ và $(SAC)$.
A. $SO$
B. $OE$
C. $OD$
D. $CO$
**Hình:** de_P22C14.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm hai điểm chung của hai mặt phẳng, trong đó một điểm lấy trên cạnh bên $SC$ và điểm kia lấy trên đáy nhờ vai trò của tâm $O$.

**Bước 1.** Xét điểm $E$ nằm trên $SC$ để kiểm tra nó thuộc mặt phẳng nào trong hai mặt phẳng.

**Bước 2.** Xét tâm $O$ là giao của hai đường chéo, mỗi đường chéo nằm trong một mặt phẳng, để chứng minh $O$ là điểm chung.

**Bước 3.** Nối hai điểm chung rồi đối chiếu các phương án.

**Phần 2. Trình bày**

$E\in SC\subset(SAC)$ và $E\in(BED)$ nên $E$ là điểm chung.

$O=AC\cap BD$ mà $AC\subset(SAC)$ và $BD\subset(BED)$ nên $O$ là điểm chung.

Vậy $(BED)\cap(SAC)=OE$.

Chọn B.

### Câu 15 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho hình chóp tứ giác $S{.}ABCD$ và $M$ là điểm bất kỳ trên cạnh $SD$. Giao tuyến của hai mặt phẳng $(SBD)$ và $(MAC)$ là
A. $SO$ với $O$ là giao điểm của $AC$ và $BD$
B. $OM$ với $O$ là giao điểm của $MC$ và $BD$
C. $OM$ với $O$ là giao điểm của $AC$ và $BD$
D. $OM$ với $O$ là giao điểm của $SB$ và $AC$
**Hình:** de_P22C15.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm hai điểm chung: một điểm nằm trên cạnh $SD$ và một điểm là giao của hai đường chéo của đáy, mỗi đường nằm trong một mặt phẳng.

**Bước 1.** Xét điểm $M$ trên cạnh $SD$ để kiểm tra nó thuộc mặt phẳng nào trong hai mặt phẳng.

**Bước 2.** Gọi giao điểm hai đường chéo của đáy rồi chứng minh nó thuộc cả hai mặt phẳng.

**Bước 3.** Nối hai điểm chung và đối chiếu cách mô tả giao điểm ở từng phương án.

**Phần 2. Trình bày**

$M\in SD\subset(SBD)$ và $M\in(MAC)$ nên $M$ là điểm chung.

Gọi $O=AC\cap BD$. Vì $AC\subset(MAC)$ và $BD\subset(SBD)$ nên $O\in(MAC)$ và $O\in(SBD)$.

Vậy $(SBD)\cap(MAC)=OM$ với $O$ là giao điểm của $AC$ và $BD$.

Chọn C.

### Câu 16 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho tứ diện $ABCD$. Gọi $I$, $J$ lần lượt là trung điểm của $AD$ và $BC$ như hình vẽ. Giao tuyến của hai mặt phẳng $(ADJ)$ và $(BCI)$ là
A. $IP$
B. $PQ$
C. $PJ$
D. $IJ$
**Hình:** de_P22C16.png
**Ghi chú:** các phương án A, B, C nhắc tới $P$, $Q$ mà đề và hình không định nghĩa; giải theo hai điểm chung $I$, $J$ nên chỉ phương án D khớp.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hai điểm $I$, $J$ đều thuộc cả hai mặt phẳng theo cách đặt tên mặt phẳng nên giao tuyến là đường thẳng nối chúng.

**Bước 1.** Xét điểm $I$ nằm trên cạnh nào của tứ diện để kiểm tra nó thuộc mặt phẳng nào.

**Bước 2.** Xét điểm $J$ nằm trên cạnh nào để kiểm tra tương tự.

**Bước 3.** Nối hai điểm chung vừa tìm được và đối chiếu các phương án.

**Phần 2. Trình bày**

$I\in AD\subset(ADJ)$ và $I\in(BCI)$ nên $I$ là điểm chung.

$J\in BC\subset(BCI)$ và $J\in(ADJ)$ nên $J$ là điểm chung.

Vậy $(ADJ)\cap(BCI)=IJ$.

Chọn D.

### Câu 17 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho hình chóp $S{.}ABC$. Các điểm $E$, $F$ lần lượt thuộc các cạnh $SA$, $AC$ sao cho $\dfrac{SE}{SA}=\dfrac23$, $\dfrac{AF}{AC}=\dfrac23$. Giao điểm của $SC$ và mặt phẳng $(BEF)$ là
A. Giao điểm của $SC$ và $SA$
B. Giao điểm của $SC$ và $BE$
C. Giao điểm của $SC$ và $BF$
D. Giao điểm của $SC$ và $EF$
**Hình:** de_P22C17.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** để tìm giao điểm của $SC$ với $(BEF)$, tìm một đường thẳng nằm trong $(BEF)$ cùng nằm trong một mặt phẳng với $SC$ rồi lấy giao của hai đường đó.

**Bước 1.** Xác định mặt phẳng chứa $SC$ mà cũng chứa một đường của mặt phẳng $(BEF)$, dựa vào việc $E$, $F$ nằm trên hai cạnh nào.

**Bước 2.** Dùng hai tỉ số đề cho để kiểm tra hai đường thẳng đó có song song hay không, nhờ định lí Thalès.

**Bước 3.** Suy ra hai đường thẳng cắt nhau và giao điểm thuộc $(BEF)$.

**Phần 2. Trình bày**

$E\in SA$, $F\in AC$ nên $E$, $F$, $S$, $C$ cùng nằm trong mặt phẳng $(SAC)$.

Ta có $\dfrac{AE}{AS}=1-\dfrac23=\dfrac13$ và $\dfrac{AF}{AC}=\dfrac23$, hai tỉ số khác nhau nên $EF$ không song song với $SC$.

Do đó trong mặt phẳng $(SAC)$, $EF$ cắt $SC$ tại một điểm $H$.

$H\in EF\subset(BEF)$ nên $H=SC\cap(BEF)$.

Vậy giao điểm của $SC$ và $(BEF)$ là giao điểm của $SC$ và $EF$.

Chọn D.

### Câu 18 | kho=hinh_hoc | loai=trac_nghiem | dap_an=B
**Đề:** Cho hình chóp $S{.}ABCD$, đáy $ABCD$ là tứ giác có các cặp cạnh đối không song song, điểm $M$ là trung điểm $SD$. Tìm giao điểm của $AD$ và mặt phẳng $(MBC)$.
A. Giao điểm của $AD$ và $MC$
B. Giao điểm của $AD$ và $BC$
C. Giao điểm của $AD$ và $MB$
D. Giao điểm của $AD$ và $SB$
**Hình:** de_P22C18.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm một đường thẳng nằm trong mặt phẳng $(MBC)$ và cùng nằm với $AD$ trong một mặt phẳng, rồi lấy giao điểm của hai đường đó.

**Bước 1.** Chọn mặt phẳng chứa $AD$ là mặt phẳng đáy rồi tìm đường thẳng của $(MBC)$ nằm trong đáy.

**Bước 2.** Dùng giả thiết các cặp cạnh đối không song song để chứng minh hai đường thẳng đó cắt nhau.

**Bước 3.** Kết luận giao điểm thuộc $(MBC)$ rồi đối chiếu các phương án.

**Phần 2. Trình bày**

$AD$ và $BC$ cùng nằm trong mặt phẳng $(ABCD)$ và không song song (đáy có các cặp cạnh đối không song song) nên chúng cắt nhau tại một điểm $I$.

$I\in BC\subset(MBC)$ nên $I$ là giao điểm của $AD$ và $(MBC)$.

Các phương án khác sai vì $AD$ và $MC$ (hoặc $MB$, $SB$) không cùng nằm trong một mặt phẳng, hay chéo nhau.

Chọn B.

### Câu 19 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho hình chóp $S{\cdot}ABCD$ có đáy $ABCD$ là hình bình hành tâm $O$. Gọi $M$, $N$ lần lượt là trung điểm của $SA$ và $CD$. Tìm giao điểm của $AD$ và mặt phẳng $(BMN)$.
A. Giao điểm của $AD$ và $MB$
B. Giao điểm của $AD$ và $MN$
C. Giao điểm của $AD$ và $NB$
D. Giao điểm của $AD$ và $MC$
**Hình:** de_P22C19.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tìm đường thẳng của mặt phẳng $(BMN)$ nằm trong mặt phẳng đáy chứa $AD$, rồi lấy giao điểm của hai đường thẳng đồng phẳng đó.

**Bước 1.** Xác định đường thẳng của $(BMN)$ nằm trong mặt phẳng $(ABCD)$ dựa vào vị trí của $B$ và $N$.

**Bước 2.** Chứng minh đường thẳng đó cắt $AD$ bằng cách dùng tính chất của hình bình hành.

**Bước 3.** Kết luận giao điểm thuộc $(BMN)$ rồi đối chiếu các phương án.

**Phần 2. Trình bày**

$B\in(ABCD)$ và $N\in CD\subset(ABCD)$ nên $BN\subset(ABCD)$.

$BN$ cắt $BC$ tại $B$ và $AD\parallel BC$ nên $BN$ không song song với $AD$. Hai đường thẳng $BN$ và $AD$ cùng nằm trong $(ABCD)$ nên cắt nhau tại một điểm $I$.

$I\in BN\subset(BMN)$ nên $I$ là giao điểm của $AD$ và $(BMN)$.

Vậy giao điểm là giao điểm của $AD$ và $NB$.

Chọn C.

### Câu 20 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Cho hình chóp $S{.}ABCD$ có đáy $ABCD$ là hình bình hành tâm $O$. Gọi $M$ là trung điểm của $SD$. Giao điểm của đường thẳng $BM$ và mặt phẳng $(SAC)$ là
A. Giao điểm của $MB$ và $SO$
B. Giao điểm của $MB$ và $SA$
C. Giao điểm của $MB$ và $SC$
D. Giao điểm của $MB$ và $AC$
**Hình:** de_P22C20.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** đưa $BM$ vào một mặt phẳng chứa nó và tìm giao tuyến của mặt phẳng đó với $(SAC)$, giao điểm cần tìm nằm trên giao tuyến này.

**Bước 1.** Chọn mặt phẳng chứa $BM$ dựa vào việc $M$ nằm trên cạnh bên nào, rồi gọi tên mặt phẳng.

**Bước 2.** Tìm giao tuyến của mặt phẳng đó với $(SAC)$ bằng hai điểm chung, trong đó có đỉnh $S$ và tâm của đáy.

**Bước 3.** Lấy giao điểm của $BM$ với giao tuyến vừa tìm, hai đường này đồng phẳng.

**Phần 2. Trình bày**

Vì $M\in SD$ nên $BM\subset(SBD)$.

$S$ và $O$ là hai điểm chung của $(SBD)$ và $(SAC)$ (vì $O=AC\cap BD$) nên $(SBD)\cap(SAC)=SO$.

Trong mặt phẳng $(SBD)$, hai đường thẳng $BM$ và $SO$ cắt nhau tại một điểm $H$ (hai đường trung tuyến $BM$ và $SO$ của tam giác $SBD$).

$H\in SO\subset(SAC)$ nên $H=BM\cap(SAC)$.

Vậy giao điểm là giao điểm của $MB$ và $SO$.

Chọn A.

### Câu 21 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho hai đường thẳng phân biệt $a$, $b$ và mặt phẳng $(\alpha)$. Giả sử $a\parallel b$, $b\parallel(\alpha)$. Khi đó:
A. $a\parallel(\alpha)$.
B. $a\subset(\alpha)$.
C. $a$ cắt $(\alpha)$.
D. $a\parallel(\alpha)$ hoặc $a\subset(\alpha)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét mọi vị trí tương đối có thể có của $a$ so với $(\alpha)$ rồi loại các vị trí mâu thuẫn với giả thiết hai đường song song.

**Bước 1.** Liệt kê ba vị trí tương đối của một đường thẳng và một mặt phẳng.

**Bước 2.** Xét trường hợp $a$ cắt $(\alpha)$ và dùng tính chất của hai đường thẳng song song để tìm mâu thuẫn với $b\parallel(\alpha)$.

**Bước 3.** Kiểm tra hai vị trí còn lại có thể xảy ra hay không, rồi so với các phương án.

**Phần 2. Trình bày**

Đường thẳng $a$ có ba vị trí so với $(\alpha)$: cắt, song song, nằm trong.

Nếu $a$ cắt $(\alpha)$ tại $M$ thì $b\parallel a$ cũng cắt $(\alpha)$, trái với $b\parallel(\alpha)$. Vậy $a$ không cắt $(\alpha)$.

Hai trường hợp $a\parallel(\alpha)$ và $a\subset(\alpha)$ đều có thể xảy ra (chọn $a$ trong $(\alpha)$ hoặc ngoài $(\alpha)$ song song với $b$).

Do đó $a\parallel(\alpha)$ hoặc $a\subset(\alpha)$.

Chọn D.

### Câu 22 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho hai đường thẳng phân biệt $a$, $b$ và mặt phẳng $(\alpha)$. Giả sử $a\parallel(\alpha)$, $b\subset(\alpha)$. Khi đó:
A. $a\parallel b$.
B. $a$, $b$ chéo nhau.
C. $a\parallel b$ hoặc $a$, $b$ chéo nhau.
D. $a$, $b$ cắt nhau.

**Phần 1. Hướng dẫn**

**Mấu chốt:** xét xem hai đường thẳng $a$ và $b$ có điểm chung hay không, rồi chia các vị trí tương đối còn lại của hai đường thẳng.

**Bước 1.** Dùng $a\parallel(\alpha)$ để xem $a$ có điểm chung với mặt phẳng $(\alpha)$ và với đường thẳng $b$ nằm trong $(\alpha)$ hay không.

**Bước 2.** Liệt kê các vị trí tương đối của hai đường thẳng không có điểm chung.

**Bước 3.** Kiểm tra hai vị trí đó đều có thể xảy ra rồi so với các phương án.

**Phần 2. Trình bày**

Vì $a\parallel(\alpha)$ nên $a$ không có điểm chung với $(\alpha)$, mà $b\subset(\alpha)$ nên $a$ và $b$ không có điểm chung, do đó $a$, $b$ không cắt nhau.

Hai đường thẳng không cắt nhau thì song song hoặc chéo nhau, và cả hai trường hợp đều xảy ra (vẽ $a$ song song với $b$ hoặc $a$ không đồng phẳng với $b$).

Do đó $a\parallel b$ hoặc $a$, $b$ chéo nhau.

Chọn C.

### Câu 23 | kho=hinh_hoc | loai=trac_nghiem | dap_an=C
**Đề:** Cho tứ diện $ABCD$, $G$ là trọng tâm $\triangle ABD$ và $M$ là điểm trên cạnh $BC$, sao cho $BM=2MC$. Đường thẳng $MG$ song song với
A. $(ABD)$.
B. $(ABC)$.
C. $(ACD)$.
D. $(BCD)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** đường thẳng song song với mặt phẳng khi nó song song với một đường thẳng nằm trong mặt phẳng ấy, nên tìm đường thẳng trong một mặt phẳng song song với $MG$ bằng định lí Thalès.

**Bước 1.** Gọi trung điểm của cạnh chung của hai tam giác chứa $G$ rồi viết tỉ số trên trung tuyến chứa $G$.

**Bước 2.** Đổi giả thiết $BM=2MC$ thành tỉ số $\dfrac{BM}{BC}$ để so với tỉ số của $G$ trên trung tuyến.

**Bước 3.** Dùng Thalès đảo để tìm đường thẳng trong một mặt phẳng song song với $MG$, đồng thời kiểm tra $MG$ không nằm trong mặt phẳng đó.

**Phần 2. Trình bày**

Gọi $N$ là trung điểm của $AD$, khi đó $G\in BN$ và $\dfrac{BG}{BN}=\dfrac23$.

Vì $BM=2MC$ nên $\dfrac{BM}{BC}=\dfrac23$.

Trong tam giác $BNC$ có $\dfrac{BG}{BN}=\dfrac{BM}{BC}$ nên $MG\parallel CN$.

Mà $CN\subset(ACD)$ và $MG\not\subset(ACD)$ (vì $M\notin(ACD)$).

Do đó $MG\parallel(ACD)$.

Chọn C.

### Câu 24 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Đường thẳng $a\parallel(P)$ nếu
A. $a\parallel b$ và $b\parallel(P)$.
B. $a\cap(P)=a$.
C. $a\cap(P)=b$.
D. $a\parallel b$, $b\subset(P)$ và $a\not\subset(P)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** dùng điều kiện đủ để đường thẳng song song với mặt phẳng: song song với một đường thẳng nằm trong mặt phẳng và bản thân không nằm trong mặt phẳng.

**Bước 1.** Nhớ lại định lí nhận biết đường thẳng song song với mặt phẳng và các điều kiện cần có.

**Bước 2.** Xét từng phương án xem có đủ hai điều kiện đó, hoặc có điểm chung với mặt phẳng hay không.

**Bước 3.** Xét đủ bốn phương án rồi mới kết luận.

**Phần 2. Trình bày**

A sai vì $a\parallel b$, $b\parallel(P)$ thì $a$ có thể nằm trong $(P)$.

B sai vì $a\cap(P)=a$ nghĩa là $a\subset(P)$.

C sai vì $a\cap(P)=b$ cho thấy $a$ và $(P)$ có điểm chung nên $a$ không song song với $(P)$.

D đúng theo định lí: nếu $a$ không nằm trong $(P)$ và song song với một đường thẳng $b$ nằm trong $(P)$ thì $a\parallel(P)$.

Chọn D.

### Câu 25 | kho=hinh_hoc | loai=trac_nghiem | dap_an=D
**Đề:** Cho hình chóp $S{.}ABCD$ đáy $ABCD$ là hình bình hành. Gọi $I$, $J$ lần lượt là trọng tâm các tam giác $SAB$ và $SAD$. $E$, $F$ lần lượt là trung điểm của $AB$ và $AD$. Chọn khẳng định đúng trong các khẳng định sau.
A. $IJ\parallel(SAD)$.
B. $IJ\parallel(SCD)$.
C. $IJ\parallel(SAB)$.
D. $IJ\parallel(SDB)$.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chứng minh $IJ$ song song với một đường thẳng trong đáy rồi tìm mặt phẳng chứa đường thẳng đó mà $IJ$ không nằm trong.

**Bước 1.** Viết vị trí của $I$ và $J$ trên hai trung tuyến kẻ từ cùng một đỉnh để so sánh tỉ số và suy ra $IJ$ song song với đường nào.

**Bước 2.** Tìm đường thẳng trong đáy song song với đường vừa tìm, dùng đường trung bình của tam giác $ABD$.

**Bước 3.** Xác định mặt phẳng chứa đường thẳng đó, kiểm tra $IJ$ không nằm trong mặt phẳng ấy.

**Bước 4.** Đối chiếu từng phương án, loại phương án mà $IJ$ có điểm chung với mặt phẳng.

**Phần 2. Trình bày**

$I\in SE$, $J\in SF$ với $\dfrac{SI}{SE}=\dfrac{SJ}{SF}=\dfrac23$ nên $IJ\parallel EF$.

$EF$ là đường trung bình của tam giác $ABD$ nên $EF\parallel BD$.

Suy ra $IJ\parallel BD$ mà $BD\subset(SBD)$.

$I\in(SAB)$ và $(SAB)\cap(SBD)=SB$, $I\notin SB$ nên $I\notin(SBD)$, do đó $IJ\not\subset(SBD)$.

Vậy $IJ\parallel(SBD)$.

Các phương án A, C sai vì $J\in(SAD)$, $I\in(SAB)$ nên $IJ$ có điểm chung với mặt phẳng tương ứng; B sai vì $BD$ cắt $(SCD)$ tại $D$ nên đường thẳng $IJ\parallel BD$ cũng cắt $(SCD)$.

Chọn D.

### Câu 26 | kho=hinh_hoc | loai=trac_nghiem | dap_an=A
**Đề:** Tìm mệnh đề đúng trong các mệnh đề sau đây.
A. Nếu hai mặt phẳng $(P)$ và $(Q)$ song song với nhau thì mọi đường thẳng nằm trong mặt phẳng $(P)$ đều song song với mặt phẳng $(Q)$.
B. Nếu hai mặt phẳng $(P)$ và $(Q)$ song song với nhau thì mọi đường thẳng nằm trong mặt phẳng $(P)$ đều song song với mọi đường thẳng nằm trong mặt phẳng $(Q)$.
C. Nếu hai đường thẳng song song với nhau lần lượt nằm trong hai mặt phẳng phân biệt $(P)$ và $(Q)$ thì $(P)$ và $(Q)$ song song với nhau.
D. Qua một điểm nằm ngoài mặt phẳng cho trước ta vẽ được một và chỉ một đường thẳng song song với mặt phẳng cho trước đó.

**Phần 1. Hướng dẫn**

**Mấu chốt:** với mỗi mệnh đề, thử tìm phản ví dụ bằng hình ảnh trong không gian hoặc đối chiếu với tính chất của hai mặt phẳng song song.

**Bước 1.** Với hai mặt phẳng song song, xét vị trí của một đường thẳng nằm trong mặt phẳng này so với mặt phẳng kia và so với các đường của mặt phẳng kia.

**Bước 2.** Với hai đường thẳng song song nằm trong hai mặt phẳng phân biệt, tìm khả năng hai mặt phẳng cắt nhau.

**Bước 3.** Với một điểm ngoài mặt phẳng, xét có bao nhiêu đường thẳng đi qua điểm đó và song song với mặt phẳng.

**Bước 4.** Xét đủ bốn mệnh đề rồi mới kết luận.

**Phần 2. Trình bày**

A đúng: nếu $(P)\parallel(Q)$ và $d\subset(P)$ thì $d$ không có điểm chung với $(Q)$ (vì $(P)\cap(Q)=\varnothing$), nên $d\parallel(Q)$.

B sai: hai đường thẳng nằm trong hai mặt phẳng song song có thể chéo nhau.

C sai: hai mặt phẳng $(P)$, $(Q)$ có thể cắt nhau theo giao tuyến song song với hai đường thẳng đó.

D sai: qua một điểm ngoài mặt phẳng có vô số đường thẳng song song với mặt phẳng đó (các đường thẳng nằm trong mặt phẳng qua điểm đó song song với mặt phẳng cho trước).

Chọn A.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Khúc 2 gồm ảnh trang 5–8: PHẦN 21 (Chương Giới hạn, Phần III, Câu 1–11) và PHẦN 22 (Chương IV, Phần I, Câu 1–26). Câu 27 trở đi nằm ở khúc sau.
- Câu 1–5 và 9 (nhiều ý độc lập) đã tách thành Câu 1a, 1b, ...; Câu 8 tách 8a, 8b; Câu 10 (hai ý cùng một hàm) giữ một câu.
- Câu 6 (dãy hình vuông) dùng cấp số nhân lùi vô hạn; Câu 7 đáp số $6068{,}5$ không tô được trên 4 ô nên để tự luận.
- Câu 8a: đề in $x\to1$ (không phải $-1$), giải đúng như in.
- Trắc nghiệm Câu 16: các phương án nhắc $P$, $Q$ không có trong đề; xem Ghi chú ở câu đó.
- Trắc nghiệm Câu 19: hình in nhãn điểm $A$ lệch vị trí, không ảnh hưởng lời giải.
- Câu 24 phương án C và Câu 26 phương án D dựa trên cách hiểu thông thường của SGK, không có nghi vấn.
