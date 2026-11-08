# Bảng đích khối 12 — 40 dạng bài (nhánh Toán · Đại) — CHỈ chủ đề NCD00095 (bản đồ chuẩn)

> Chủ đề KHÔNG nằm trong bảng đích: Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số [toan] · Vectơ và hệ trục toạ độ trong không gian [toan] · Xác suất có điều kiện [toan] · Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm [toan] · Phương pháp toạ độ trong không gian [hgt]. Câu thuộc các chủ đề này ⇒ để trống, lý do "thuộc <tên chủ đề>" (chủ đề chưa có bản đồ chuẩn — KHÔNG ép vào bảng đích).

## Chủ đề: Nguyên hàm và tích phân

### Nguyên hàm › Nguyên hàm của hàm cơ bản — Tìm nguyên hàm có thêm điều kiện để xác định hằng số kiểu như  : F(0) =5....

- **NDB00747** · Áp dụng định nghĩa  / tính chất
  - Mô tả: Phần này sử dụng định nghĩa để lập công thức chứ không tính
  - Ví dụ: ##VD Chứng minh $F(x)=x\ln x-x$ là một nguyên hàm của $f(x)=\ln x$ trên khoảng $(0;+\infty)$. Lời giải. Ta có $F'(x)=\ln x+x\cdot\dfrac{1}{x}-1=\ln x$ với mọi $x\in(0;+\infty)$. Vậy $F(x)$ là một nguyên hàm của $f(x)$ trên $(0;+\infty)$. ##VD Biết $\int f(x)\,dx=\sin 2x+C$. Tính $\int\big[f(x)+2x\big]\,dx$. Lời giải. Ta có $\int\big[f(x)+2x\big]\,dx=\int f(x)\,dx+\int 2x\,dx$. $=\sin 2x+x^{2}+C$.
- **NDB00742** · Nguyên hàm của hàm đa thức
  - Mô tả: Nguyên hàm của hàm số dạng đa thức
  - Ví dụ: ##VD Tìm $\int(3x^{2}-4x+5)\,dx$. Lời giải. $\int(3x^{2}-4x+5)\,dx=3\cdot\dfrac{x^{3}}{3}-4\cdot\dfrac{x^{2}}{2}+5x+C=x^{3}-2x^{2}+5x+C$. ##VD Tìm $\int(x+1)(x-2)\,dx$. Lời giải. Khai triển: $(x+1)(x-2)=x^{2}-x-2$. $\int(x^{2}-x-2)\,dx=\dfrac{x^{3}}{3}-\dfrac{x^{2}}{2}-2x+C$.
- **NDB00744** · Nguyên hàm của hàm phân thức
  - Mô tả: Nguyên hàm của hàm số dạng phân thức
  - Ví dụ: ##VD Tìm $\int\dfrac{x^{2}+2x+3}{x}\,dx$ trên khoảng $(0;+\infty)$. Lời giải. Tách: $\dfrac{x^{2}+2x+3}{x}=x+2+\dfrac{3}{x}$. $\int\Big(x+2+\dfrac{3}{x}\Big)dx=\dfrac{x^{2}}{2}+2x+3\ln x+C$. ##VD Tìm $\int\dfrac{2x+1}{x^{2}}\,dx$ trên khoảng $(0;+\infty)$. Lời giải. Tách: $\dfrac{2x+1}{x^{2}}=\dfrac{2}{x}+\dfrac{1}{x^{2}}$. $\int\Big(\dfrac{2}{x}+\dfrac{1}{x^{2}}\Big)dx=2\ln x-\dfrac{1}{x}+C$. ##VD Tìm $\int\dfrac{1}{x^{2}-1}\,dx$ trên khoảng $(1 …
- **NDB00743** · Nguyên hàm của hàm lượng giác
  - Mô tả: Nguyên hàm của hàm số dạng lượng giác
  - Ví dụ: ##VD Tìm $\int(2\sin x-3\cos x)\,dx$. Lời giải. $\int(2\sin x-3\cos x)\,dx=-2\cos x-3\sin x+C$. ##VD Tìm $\int\cos^{2}\dfrac{x}{2}\,dx$. Lời giải. Hạ bậc: $\cos^{2}\dfrac{x}{2}=\dfrac{1+\cos x}{2}$. $\int\dfrac{1+\cos x}{2}\,dx=\dfrac{x}{2}+\dfrac{\sin x}{2}+C=\dfrac{x+\sin x}{2}+C$. ##VD Tìm $\int\tan^{2}x\,dx$. Lời giải. Ta có $\tan^{2}x=\dfrac{1}{\cos^{2}x}-1$. $\int\tan^{2}x\,dx=\tan x-x+C$.
- **NDB00748** · Nguyên hàm của hàm căn thức
  - Mô tả: Nguyên hàm của hàm số dạng căn thức
  - Ví dụ: ##VD Tìm $\int\Big(\sqrt{x}+\dfrac{1}{\sqrt{x}}\Big)dx$ trên khoảng $(0;+\infty)$. Lời giải. Đưa về lũy thừa: $\sqrt{x}=x^{\frac{1}{2}}$, $\dfrac{1}{\sqrt{x}}=x^{-\frac{1}{2}}$. $\int\Big(x^{\frac{1}{2}}+x^{-\frac{1}{2}}\Big)dx=\dfrac{2}{3}x^{\frac{3}{2}}+2x^{\frac{1}{2}}+C=\dfrac{2}{3}x\sqrt{x}+2\sqrt{x}+C$. ##VD Tìm $\int\sqrt[3]{x^{2}}\,dx$. Lời giải. $\sqrt[3]{x^{2}}=x^{\frac{2}{3}}$. $\int x^{\frac{2}{3}}dx=\dfrac{3}{5}x^{\frac{5}{3}}+C$. ## …
- **NDB00745** · Nguyên hàm của hàm mũ
  - Mô tả: Nguyên hàm của hàm số dạng mũ
  - Ví dụ: ##VD Tìm $\int(e^{x}+2^{x})\,dx$. Lời giải. $\int e^{x}dx=e^{x}+C$ và $\int 2^{x}dx=\dfrac{2^{x}}{\ln 2}+C$. Vậy $\int(e^{x}+2^{x})\,dx=e^{x}+\dfrac{2^{x}}{\ln 2}+C$. ##VD Tìm $\int e^{2x+1}\,dx$. Lời giải. Áp dụng $\int f(ax+b)\,dx=\dfrac{1}{a}F(ax+b)+C$ với $a=2$. $\int e^{2x+1}dx=\dfrac{1}{2}e^{2x+1}+C$. ##VD Tìm $\int 3^{x}\cdot 2^{x}\,dx$. Lời giải. $3^{x}\cdot2^{x}=6^{x}$. $\int6^{x}dx=\dfrac{6^{x}}{\ln 6}+C$.
- **NDB00746** · Tìm nguyên hàm khi có điều kiện
  - Mô tả: Nguyên hàm của hàm số khi có thêm điều kiện để tính hằng số như :  F(0)...
  - Ví dụ: ##VD Cho $F'(x)=3x^{2}-2x+1$ và $F(1)=3$. Tìm $F(x)$. Lời giải. $F(x)=\int(3x^{2}-2x+1)\,dx=x^{3}-x^{2}+x+C$. Vì $F(1)=3$ nên $1-1+1+C=3$, suy ra $C=2$. Vậy $F(x)=x^{3}-x^{2}+x+2$. ##VD Tìm nguyên hàm $F(x)$ của $f(x)=\sin x+\cos x$ thoả mãn $F\Big(\dfrac{\pi}{2}\Big)=2$. Lời giải. $F(x)=\int(\sin x+\cos x)\,dx=-\cos x+\sin x+C$. $F\Big(\dfrac{\pi}{2}\Big)=0+1+C=2$ nên $C=1$. Vậy $F(x)=\sin x-\cos x+1$. ##VD Cho $F(x)$ là một nguyên hàm của $f(x) …
### Nguyên hàm › Bài toán thực tế ứng dụng nguyên hàm

- **NDB00749** · Bài toán thực tế liên quan đến quãng đường, vận tốc, gia tốc
  - Mô tả: Bài toán nói về dạng chuyển động
  - Ví dụ: ##VD Một ô tô đang chạy thì hãm phanh, vận tốc $v(t)=19-2t$ (m/s), $t$ là số giây kể từ lúc hãm phanh. Tính quãng đường ô tô đi được trong 5 giây đầu tiên. Lời giải. Quãng đường $s(t)=\int(19-2t)\,dt=19t-t^{2}+C$. Tại $t=0$ ô tô bắt đầu hãm nên $s(0)=0$, suy ra $C=0$. Sau 5 giây: $s(5)=19\cdot5-5^{2}=70$ (m). ##VD Một vật chuyển động thẳng có gia tốc $a(t)=6t-4$ (m/s²). Biết vận tốc ban đầu $v(0)=2$ m/s và quãng đường $s(0)=0$. Tính quãng đường v …
- **NDB00750** · Bài toán thực tế liên quan đến tốc độ tăng trưởng....
  - Mô tả: Bài toán nói về tốc độ thay đổi của 1 đại lượng. Thường là cho đại lượng hỏi tốc độ biến đổi hoặc ngược lại
  - Ví dụ: ##VD Dân số của một thị trấn tăng với tốc độ $P'(t)=300+12t$ (người/năm), $t$ tính bằng năm kể từ năm 2020. Biết năm 2020 thị trấn có 10 000 người. Hỏi sau 5 năm dân số là bao nhiêu? Lời giải. $P(t)=\int(300+12t)\,dt=300t+6t^{2}+C$. $P(0)=10\,000$ nên $C=10\,000$. $P(5)=1500+150+10\,000=11\,650$ (người). ##VD Lượng nước chảy vào bể có tốc độ $f(t)=3t^{2}+2t$ (lít/phút). Lúc đầu bể có 10 lít. Tính lượng nước trong bể sau 2 phút. Lời giải. $V(t)=\i …
### Tích phân › Áp dụng định nghĩa – tính chất

- **NDB00751** · Tính tích phân dựa trên tính chất của cận
  - Mô tả: Sử dụng định nghía tính chất của tích phân để chọn đáp án - thường liên quan đến tích phân của một tổng , hiêu  hoặc nhân với hằng số...
  - Ví dụ: ##VD Cho $\int_{-2}^{2} f(x)\,dx=1$ và $\int_{-2}^{4} f(t)\,dt=-4$. Tính $\int_{2}^{4} f(y)\,dy$. Lời giải. Tích phân không phụ thuộc tên biến nên có thể viết tất cả theo $x$. Nối cận: $\int_{-2}^{2} f(x)\,dx+\int_{2}^{4} f(x)\,dx=\int_{-2}^{4} f(x)\,dx$. $\int_{2}^{4} f(x)\,dx=-4-1=-5$. ##VD Cho $\int_{1}^{4} f(x)\,dx=5$ và $\int_{1}^{6} f(x)\,dx=3$. Tính $\int_{6}^{4} f(x)\,dx$. Lời giải. Ta có $\int_{4}^{6} f(x)\,dx=\int_{1}^{6} f(x)\,dx-\int_ …
- **NDB00752** · Tính tích phân dựa trên tính chất tổng hiệu các tích phân
  - Mô tả: Sử dụng tính chất nối cận để tính. Chứ không trực tiếp tính nguyên hàm từ hàm số
  - Ví dụ: ##VD Cho $\int_{0}^{3} f(x)\,dx=5$ và $\int_{0}^{3} g(x)\,dx=2$. Tính $\int_{0}^{3}\big[2f(x)-3g(x)\big]\,dx$. Lời giải. $\int_{0}^{3}\big[2f(x)-3g(x)\big]\,dx=2\int_{0}^{3} f(x)\,dx-3\int_{0}^{3} g(x)\,dx$. $=2\cdot5-3\cdot2=4$. ##VD Cho $\int_{1}^{3}\big[f(x)+3g(x)\big]\,dx=10$ và $\int_{1}^{3}\big[2f(x)-g(x)\big]\,dx=6$. Tính $\int_{1}^{3}\big[f(x)+g(x)\big]\,dx$. Lời giải. Đặt $X=\int_{1}^{3} f(x)\,dx$, $Y=\int_{1}^{3} g(x)\,dx$. Ta có hệ $\b …
### Tích phân › Tích phân của hàm số cơ bản — Tích phân của hàm mũ

- **NDB00753** · Tích phân của hàm đưa về đa thức
  - Mô tả: Tích phân của hàm đa thức và hàm đưa được về đa thức
  - Ví dụ: ##VD Tính $I=\int_{0}^{2}(3x^{2}-2x+1)\,dx$. Lời giải. $I=\Big(x^{3}-x^{2}+x\Big)\Big|_{0}^{2}=8-4+2=6$. ##VD Tính $I=\int_{1}^{2}(x+1)(x-2)\,dx$. Lời giải. $(x+1)(x-2)=x^{2}-x-2$. $I=\Big(\dfrac{x^{3}}{3}-\dfrac{x^{2}}{2}-2x\Big)\Big|_{1}^{2}=\Big(\dfrac{8}{3}-2-4\Big)-\Big(\dfrac{1}{3}-\dfrac{1}{2}-2\Big)=-\dfrac{7}{6}$.
- **NDB00629** · Tích phân hàm số lượng giác
  - Mô tả: Tích phân của hàm lượng giác
  - Ví dụ: ##VD Tính $I=\int_{0}^{\frac{\pi}{2}}\sin x\,dx$. Lời giải. $I=-\cos x\Big|_{0}^{\frac{\pi}{2}}=-0+1=1$. ##VD Tính $I=\int_{0}^{\pi}\sin^{2}x\,dx$. Lời giải. Hạ bậc: $\sin^{2}x=\dfrac{1-\cos2x}{2}$. $I=\Big(\dfrac{x}{2}-\dfrac{\sin2x}{4}\Big)\Big|_{0}^{\pi}=\dfrac{\pi}{2}$. ##VD Tính $I=\int_{0}^{\frac{\pi}{4}}\dfrac{1}{\cos^{2}x}\,dx$. Lời giải. $I=\tan x\Big|_{0}^{\frac{\pi}{4}}=1-0=1$.
- **NDB00630** · Tích phân hàm số mũ
  - Ví dụ: ##VD Tính $I=\int_{0}^{1} e^{2x}\,dx$. Lời giải. $I=\dfrac{1}{2}e^{2x}\Big|_{0}^{1}=\dfrac{e^{2}-1}{2}$. ##VD Tính $I=\int_{0}^{1} 2^{x}\,dx$. Lời giải. $I=\dfrac{2^{x}}{\ln2}\Big|_{0}^{1}=\dfrac{2-1}{\ln2}=\dfrac{1}{\ln2}$.
- **NDB00754** · Tích phân của hàm đưa về phân thức
  - Mô tả: Tích phân của hàm phân thức và hàm đưa được về phân thức
  - Ví dụ: ##VD Tính $I=\int_{0}^{1}\dfrac{1}{x+1}\,dx$. Lời giải. $I=\ln|x+1|\Big|_{0}^{1}=\ln2$. ##VD Tính $I=\int_{1}^{2}\dfrac{x^{2}+1}{x}\,dx$. Lời giải. Tách: $\dfrac{x^{2}+1}{x}=x+\dfrac{1}{x}$. $I=\Big(\dfrac{x^{2}}{2}+\ln x\Big)\Big|_{1}^{2}=\Big(2+\ln2\Big)-\dfrac{1}{2}=\dfrac{3}{2}+\ln2$. ##VD Tính $I=\int_{2}^{3}\dfrac{1}{x^{2}-1}\,dx$. Lời giải. $\dfrac{1}{x^{2}-1}=\dfrac{1}{2}\Big(\dfrac{1}{x-1}-\dfrac{1}{x+1}\Big)$. $I=\dfrac{1}{2}\ln\dfrac{x …
### Tích phân › Tích phân của hàm số nhiều dạng

- **NDB00627** · Tích phân hàm số có chứa giá trị tuyệt đối
  - Mô tả: Tích phân hàm số có chứa giá trị tuyệt đối
  - Ví dụ: ##VD Tính $I=\int_{0}^{3}|x-1|\,dx$. Lời giải. $x-1=0\Leftrightarrow x=1\in[0;3]$. Trên $[0;1]$: $|x-1|=1-x$; trên $[1;3]$: $|x-1|=x-1$. $I=\int_{0}^{1}(1-x)\,dx+\int_{1}^{3}(x-1)\,dx=\dfrac{1}{2}+2=\dfrac{5}{2}$. ##VD Tính $I=\int_{-2}^{2}|x^{2}-1|\,dx$. Lời giải. $x^{2}-1=0\Leftrightarrow x=\pm1$. Xét dấu: $x^{2}-1>0$ trên $[-2;-1)$ và $(1;2]$, $x^{2}-1<0$ trên $(-1;1)$. $I=\int_{-2}^{-1}(x^{2}-1)\,dx+\int_{-1}^{1}(1-x^{2})\,dx+\int_{1}^{2}(x^{ …
- **NDB00628** · Tích phân hàm số nhiều dạng trên đừng đoạn
  - Mô tả: Tích phân hàm số chứa nhiều biểu thức khác nhau trên từng đoạn giá trị của x
  - Ví dụ: ##VD Cho $f(x)=\begin{cases}x^{2}-2x+3 & \text{khi } x<2\\ x^{2}-1 & \text{khi } x\ge2\end{cases}$. Tính $I=\int_{1}^{3} f(x)\,dx$. Lời giải. Tách cận tại $x=2$: $I=\int_{1}^{2}(x^{2}-2x+3)\,dx+\int_{2}^{3}(x^{2}-1)\,dx$. $\int_{1}^{2}(x^{2}-2x+3)\,dx=\dfrac{7}{3}$ và $\int_{2}^{3}(x^{2}-1)\,dx=\dfrac{16}{3}$. Vậy $I=\dfrac{7}{3}+\dfrac{16}{3}=\dfrac{23}{3}$. ##VD Cho $f(x)=\begin{cases}3x^{2} & \text{khi } 0\le x\le1\\ 4-x & \text{khi } 1<x\le2\ …
- **NDB00755** · Tích phân của hàm số nhiều dạng cho bởi đồ thị
  - Mô tả: Đề bài cho đồ thị ghép bởi nhiều hàm số khác nhau
  - Ví dụ: ##VD Đồ thị hàm số $y=f(x)$ trên đoạn $[0;4]$ gồm hai đoạn thẳng: đoạn nối $O(0;0)$ với $A(2;2)$ và đoạn nối $A(2;2)$ với $B(4;0)$. Tính $\int_{0}^{4} f(x)\,dx$. Lời giải. Vì $f(x)\ge0$ nên tích phân bằng diện tích tam giác $OAB$ có đáy $OB=4$, chiều cao $2$. $\int_{0}^{4} f(x)\,dx=\dfrac{1}{2}\cdot4\cdot2=4$. ##VD Đồ thị hàm số $y=f(x)$ trên $[-2;2]$ là nửa đường tròn phía trên trục hoành, tâm $O$, bán kính $2$. Tính $\int_{-2}^{2} f(x)\,dx$. Lờ …
### Tích phân › Ứng dụng tích phân vào bài toán chuyển động

- **NDB00631** · Tính toán các đại lượng chuyển động dựa trên đồ thị
  - Mô tả: Đề bài cho đồ thị biểu diễn các đại lượng của chuyển động để từ đó lập được biểu thức của các đại lượng
  - Ví dụ: ##VD Đồ thị vận tốc $v(t)$ (m/s) của một xe: tăng đều từ $0$ lên $10$ m/s trong $5$ giây đầu, giữ nguyên $10$ m/s trong $5$ giây tiếp theo, rồi giảm đều về $0$ trong $5$ giây cuối. Tính quãng đường xe đi được trong $15$ giây. Lời giải. Quãng đường bằng $\int_{0}^{15} v(t)\,dt$, tức diện tích hình phẳng dưới đồ thị. Hình gồm: tam giác ($5$ giây đầu) + hình chữ nhật ($5$ giây giữa) + tam giác ($5$ giây cuối). $s=\dfrac{1}{2}\cdot5\cdot10+5\cdot10+\ …
- **NDB00632** · Tính toán các đại lượng chuyển động dựa trên phương trình có sẵn
  - Mô tả: Đề bài cho sẵn biểu thức các đại lượng đặc trưng chuyển động như s,v,a...
  - Ví dụ: ##VD Một chất điểm chuyển động thẳng có vận tốc $v(t)=3t^{2}-6t$ (m/s). Tính quãng đường chất điểm đi được trong 3 giây đầu. Lời giải. $v(t)=0\Leftrightarrow t=0$ hoặc $t=2$. Trên $[0;2]$: $v\le0$; trên $[2;3]$: $v\ge0$. $s=\int_{0}^{3}|v(t)|\,dt=\int_{0}^{2}(6t-3t^{2})\,dt+\int_{2}^{3}(3t^{2}-6t)\,dt$. $=\Big(3t^{2}-t^{3}\Big)\Big|_{0}^{2}+\Big(t^{3}-3t^{2}\Big)\Big|_{2}^{3}=4+4=8$ (m).
- **NDB00756** · Tính toán các đại lượng dựa trên các đại lượng đã cho với chuyển động thẳng
  - Mô tả: Đề bài mô tả các đại lượng đặc trưng của chuyển động như s, v, a...
  - Ví dụ: ##VD Một vật chuyển động thẳng có gia tốc $a(t)=2t+1$ (m/s²) và vận tốc ban đầu $v(0)=3$ m/s. Tính quãng đường vật đi được trong 4 giây đầu. Lời giải. $v(t)=\int(2t+1)\,dt=t^{2}+t+C$; $v(0)=3$ nên $C=3$, $v(t)=t^{2}+t+3>0$. $s=\int_{0}^{4}(t^{2}+t+3)\,dt=\Big(\dfrac{t^{3}}{3}+\dfrac{t^{2}}{2}+3t\Big)\Big|_{0}^{4}=\dfrac{64}{3}+8+12=\dfrac{124}{3}$ (m).
- **NDB00757** · Tính toán các đại lượng dựa trên các đại lượng đã cho với chuyển động bay/rơi
  - Mô tả: Đề bài liên quan đến việc rơi/ bay theo phương thẳng đứng thì lập phương trình phải dùng Gia tốc trọng tường g.
  - Ví dụ: ##VD Một quả bóng được ném thẳng đứng lên từ mặt đất với vận tốc $20$ m/s. Lấy gia tốc trọng trường $g=10$ m/s². Tính độ cao lớn nhất của quả bóng. Lời giải. Chọn chiều dương hướng lên: $a(t)=-10$, nên $v(t)=\int(-10)\,dt=-10t+C$; $v(0)=20$ nên $v(t)=20-10t$. Độ cao: $h(t)=\int(20-10t)\,dt=20t-5t^{2}+C'$; $h(0)=0$ nên $h(t)=20t-5t^{2}$. Cao nhất khi $v(t)=0\Leftrightarrow t=2$; khi đó $h(2)=40-20=20$ (m).
### Tích phân › Ứng dụng tích phân vào các bài toán thực tế khác

- **NDB00758** · Bài toán ứng dụng tích phân vào tìm các đại lượng vật lý, hóa học
  - Mô tả: Bài toán ứng dụng tích phân vào tìm các đại lượng vật lý, hóa học
  - Ví dụ: ##VD Một lực biến thiên $F(x)=3x+2$ (N) tác dụng lên vật làm vật dịch chuyển từ $x=0$ đến $x=4$ (m). Tính công của lực. Lời giải. $W=\int_{0}^{4}(3x+2)\,dx=\Big(\dfrac{3x^{2}}{2}+2x\Big)\Big|_{0}^{4}=24+8=32$ (J). ##VD Cường độ dòng điện qua một dây dẫn là $i(t)=2t$ (A). Tính điện lượng chuyển qua mặt cắt dây dẫn trong 3 giây đầu. Lời giải. $q=\int_{0}^{3}2t\,dt=t^{2}\Big|_{0}^{3}=9$ (C).
- **NDB00759** · Bài toán về doanh thu , dân số....
  - Mô tả: Bài toán về doanh thu , dân số....
  - Ví dụ: ##VD Chi phí cận biên (chi phí tăng thêm khi sản xuất thêm một sản phẩm) là $C'(x)=0{,}04x+20$ (nghìn đồng). Tính chi phí tăng thêm khi tăng sản lượng từ $100$ lên $200$ sản phẩm. Lời giải. Chi phí tăng thêm $=\int_{100}^{200}(0{,}04x+20)\,dx=\Big(0{,}02x^{2}+20x\Big)\Big|_{100}^{200}$. $=(800+4000)-(200+2000)=2600$ (nghìn đồng).
- **NDB00760** · Cho tốc độ thay đổi của đại lượng. Tính giá trị đại lượng tại thời điểm
  - Mô tả: Cho tốc độ thay đổi của đại lượng. Tính giá trị đại lượng tại thời điểm
  - Ví dụ: ##VD Mực nước trong một hồ dâng lên với tốc độ $h'(t)=0{,}2t+0{,}5$ (m/giờ). Lúc $t=0$ mực nước là $2$ m. Tính mực nước sau $3$ giờ. Lời giải. $h(3)=h(0)+\int_{0}^{3}(0{,}2t+0{,}5)\,dt=2+\Big(0{,}1t^{2}+0{,}5t\Big)\Big|_{0}^{3}$. $=2+0{,}9+1{,}5=4{,}4$ (m).
- **NDB00761** · Cho giá trị các đại lượng. Tính tốc độ thay đổi của đại lượng
  - Mô tả: Cho giá trị các đại lượng. Tính tốc độ thay đổi của đại lượng
  - Ví dụ: ##VD Dân số của một khu dân cư sau $t$ năm là $P(t)=5000+120t+3t^{2}$ (người). Tính tốc độ tăng dân số tại thời điểm $t=10$ năm. Lời giải. Tốc độ tăng dân số là đạo hàm: $P'(t)=120+6t$. $P'(10)=120+60=180$ (người/năm).
### Ứng dụng hình học của tích phân › Tính diện tích hình phẳng

- **NDB00774** · Tính diện tích của hình phằng có cho cận
  - Mô tả: Đề bài cho sẵn cận x=a, x=b và các hàm số. lắp công thức là xong
  - Ví dụ: ##VD Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y=x^{2}$, trục hoành và hai đường thẳng $x=1$, $x=3$. Lời giải. $S=\int_{1}^{3}x^{2}\,dx=\dfrac{x^{3}}{3}\Big|_{1}^{3}=9-\dfrac{1}{3}=\dfrac{26}{3}$. ##VD Tính diện tích hình phẳng giới hạn bởi đồ thị hàm số $y=\sin x$, trục hoành và hai đường thẳng $x=0$, $x=2\pi$. Lời giải. $\sin x\ge0$ trên $[0;\pi]$ và $\sin x\le0$ trên $[\pi;2\pi]$. $S=\int_{0}^{\pi}\sin x\,dx+\int_{\pi}^{2\pi}(-\sin …
- **NDB00775** · Tính diện tích của hình phẳng giới hạn bởi hai hàm số
  - Mô tả: Đề bài cho hai hàm số. Mình phải tự tính giao điểm của đồ thị hai hàm số để xác định cận
  - Ví dụ: ##VD Tính diện tích hình phẳng giới hạn bởi các đồ thị $y=x^{2}$ và $y=2x$. Lời giải. Hoành độ giao điểm: $x^{2}=2x\Leftrightarrow x=0$ hoặc $x=2$. Trên $[0;2]$: $2x\ge x^{2}$ nên $S=\int_{0}^{2}(2x-x^{2})\,dx=\Big(x^{2}-\dfrac{x^{3}}{3}\Big)\Big|_{0}^{2}=\dfrac{4}{3}$. ##VD Tính diện tích hình phẳng giới hạn bởi các đồ thị $y=x^{3}$ và $y=x$. Lời giải. Hoành độ giao điểm: $x^{3}=x\Leftrightarrow x=-1,\ 0,\ 1$. Trên $[-1;0]$: $x^{3}\ge x$; trên $ …
- **NDB00777** · Tính diện tích hình phẳng trên đồ thị
  - Mô tả: Đề bài cho đồ thị 2 hàm số . Dựa vào đồ thị , xác định được cận của tích phân và biểu thức hai hàm số để lắp công thức
  - Ví dụ: ##VD Đồ thị parabol $y=x^{2}-1$ và đường thẳng $y=x+1$ cắt nhau tại hai điểm có hoành độ $x=-1$ và $x=2$ (đường thẳng nằm phía trên parabol trong khoảng $(-1;2)$). Tính diện tích hình phẳng giới hạn bởi hai đồ thị đó. Lời giải. Từ đồ thị: cận $x=-1$, $x=2$; hàm phía trên là $y=x+1$, hàm phía dưới là $y=x^{2}-1$. $S=\int_{-1}^{2}\big[(x+1)-(x^{2}-1)\big]\,dx=\int_{-1}^{2}(-x^{2}+x+2)\,dx$. $=\Big(-\dfrac{x^{3}}{3}+\dfrac{x^{2}}{2}+2x\Big)\Big|_{-1 …
### Ứng dụng hình học của tích phân › Diện tích các hình phẳng đặc biệt

- **NDB00787** · Tính diện tích các hình phẳng có công thức
  - Mô tả: Diện tích các hình thường gặp có thể dùng công thức luôn cách đơn giản - để đỡ phải tính bằng công thức tích phân . Ví dụ : viên phân, vành khăn, hình cắt ngang parabol....
  - Ví dụ: ##VD Tính diện tích hình phẳng giới hạn bởi parabol $y=x^{2}-4x+3$ và trục hoành. Lời giải. Phương trình hoành độ giao điểm $x^{2}-4x+3=0$ có hai nghiệm $x_{1}=1$, $x_{2}=3$. Áp dụng công thức: $S=\dfrac{|a|(x_{2}-x_{1})^{3}}{6}=\dfrac{1\cdot2^{3}}{6}=\dfrac{4}{3}$. ##VD Tính diện tích phần nhỏ của hình tròn $x^{2}+y^{2}=4$ bị cắt bởi đường thẳng $x=1$. Lời giải. Đây là viên phân với $R=2$, $d=1$ (khoảng cách từ tâm tới dây). $S=R^{2}\arccos\dfra …
- **NDB00788** · Tính diện tích các hình đối xứng
  - Mô tả: Các hình phức tạp nhưng đối xứng. Cách làm dựa theo việc đối xứng thì chỉ cần tính 1 phần hình vẽ rồi nhân lên sẽ được hình ban đầu
  - Ví dụ: ##VD Tính diện tích hình phẳng giới hạn bởi parabol $y=x^{2}$ và đường gấp khúc $y=2-|x|$. Lời giải. Hai đồ thị cùng đối xứng qua trục $Oy$, nên $S=2\int_{0}^{1}(2-x-x^{2})\,dx$ (hoành độ giao điểm với $x\ge0$ là $x=1$). $=2\Big(2x-\dfrac{x^{2}}{2}-\dfrac{x^{3}}{3}\Big)\Big|_{0}^{1}=2\cdot\dfrac{7}{6}=\dfrac{7}{3}$. ##VD Tính diện tích hình phẳng giới hạn bởi đồ thị $y=\cos x$, trục hoành, $x=-\dfrac{\pi}{2}$ và $x=\dfrac{\pi}{2}$. Lời giải. Hình …
### Ứng dụng hình học của tích phân › Thể tích khối tròn xoay — Đề bài cho xoay quanh trục Oy

- **NDB00636** · Thể tích hình giới hạn bởi hai hàm số quay quanh trục Ox có cận
  - Mô tả: Đề bài cho đầy đủ 2 cận và hai hàm số, chỉ cần lắp công thức
  - Ví dụ: ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Ox$ hình phẳng giới hạn bởi $y=\sqrt{x}$, $y=0$, $x=1$, $x=4$. Lời giải. $V=\pi\int_{1}^{4}(\sqrt{x})^{2}\,dx=\pi\int_{1}^{4}x\,dx=\pi\cdot\dfrac{x^{2}}{2}\Big|_{1}^{4}=\dfrac{15\pi}{2}$. ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Ox$ hình phẳng giới hạn bởi $y=x^{2}$, $y=2x$, $x=0$, $x=2$. Lời giải. Trên $[0;2]$: $2x\ge x^{2}\ge0$ nên $V=\pi\int_{0}^{2}\big[(2 …
- **NDB00635** · Thể tích hình giới hạn bởi hai hàm số quay quanh trục Ox khuyết cận
  - Mô tả: Đề bài không cho cận, phải tự tính giao điểm
  - Ví dụ: ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Ox$ hình phẳng giới hạn bởi $y=x^{2}$ và $y=\sqrt{x}$. Lời giải. Hoành độ giao điểm: $x^{2}=\sqrt{x}\Leftrightarrow x=0$ hoặc $x=1$; trên $[0;1]$: $\sqrt{x}\ge x^{2}$. $V=\pi\int_{0}^{1}\big(x-x^{4}\big)\,dx=\pi\Big(\dfrac{1}{2}-\dfrac{1}{5}\Big)=\dfrac{3\pi}{10}$. ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Ox$ hình phẳng giới hạn bởi $y=x^{2}-2x$ và $y=0$. Lời …
- **NDB00639** · Thể tích hình giới hạn bởi hai hàm số quay quanh trục tung Oy
  - Mô tả: Đề bài cho xoay quanh trục Oy
  - Ví dụ: ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Oy$ hình phẳng giới hạn bởi parabol $y=x^{2}$ (với $x\ge0$), trục $Oy$ và đường thẳng $y=4$. Lời giải. Từ $y=x^{2}$ với $x\ge0$ ta có $x=\sqrt{y}$, $y\in[0;4]$. $V=\pi\int_{0}^{4}x^{2}\,dy=\pi\int_{0}^{4}y\,dy=\pi\cdot\dfrac{y^{2}}{2}\Big|_{0}^{4}=8\pi$. ##VD Tính thể tích khối tròn xoay tạo thành khi quay quanh trục $Oy$ hình phẳng giới hạn bởi $y=\sqrt{x}$, $y=0$ và $x=4$. Lời giả …
- **NDB00778** · Thể tích của hình tròn xoay cho bởi đồ thị
  - Mô tả: Đề bài cho đồ thị các hàm số, phải tự suy ra cận và biểu thức của hai hàm số
  - Ví dụ: ##VD Đồ thị hàm số $y=f(x)$ trên $[0;2]$ là đoạn thẳng nối $O(0;0)$ với $A(2;1)$. Quay hình phẳng giới hạn bởi đồ thị, trục $Ox$ và đường thẳng $x=2$ quanh trục $Ox$. Tính thể tích khối tròn xoay tạo thành. Lời giải. Từ đồ thị: $f(x)=\dfrac{x}{2}$ trên $[0;2]$ (đường thẳng qua $O$ và $A$). $V=\pi\int_{0}^{2}\Big(\dfrac{x}{2}\Big)^{2}\,dx=\pi\int_{0}^{2}\dfrac{x^{2}}{4}\,dx=\pi\cdot\dfrac{x^{3}}{12}\Big|_{0}^{2}=\dfrac{2\pi}{3}$.
- **NDB00781** · Tính thể tích của các hình quen thuộc bằng công thức
  - Mô tả: Các hình quen thuộc hay gặp có công thức ngắn gọn để nhớ : parabol tròn xoay. ....
  - Ví dụ: ##VD Quay nửa đường tròn $y=\sqrt{9-x^{2}}$ quanh trục $Ox$. Tính thể tích khối tròn xoay tạo thành. Lời giải. Khối tạo thành là khối cầu bán kính $R=3$. $V=\dfrac{4}{3}\pi R^{3}=\dfrac{4}{3}\pi\cdot27=36\pi$. ##VD Quay hình phẳng giới hạn bởi $y=\sqrt{4x}$, trục $Ox$ và $x=3$ quanh trục $Ox$ (khối tròn xoay hình parabol). Tính thể tích. Lời giải. $V=\pi\int_{0}^{3}(4x)\,dx=\pi\cdot2x^{2}\Big|_{0}^{3}=18\pi$.
### Ứng dụng hình học của tích phân › Thể tích của vật khi biết công thức thiết diện

- **NDB00782** · Thể tích của hình có thiết diện không đổi
  - Mô tả: Dạng này thiết diện là hình có diện tích ko đổi. Thể tích chỉ cần lấy đáy nhân chiều cao là xong
  - Ví dụ: ##VD Một vật thể nằm giữa hai mặt phẳng $x=0$ và $x=6$. Mọi thiết diện của vật thể cắt bởi mặt phẳng vuông góc với trục $Ox$ đều có diện tích bằng $5$. Tính thể tích vật thể. Lời giải. Diện tích thiết diện không đổi $S(x)=5$. $V=\int_{0}^{6}5\,dx=5\cdot6=30$.
- **NDB00779** · Thể tích của hình có thiết diện thay đổi có sẵn công thức
  - Mô tả: Thiết diện thay đổi nhưng dạng vẫn thế : kiểu thiết diện vẫn là tam giác đều nhưng độ dài cạnh thay đổi. Dạng này thì dề sẽ cho sẵn hình dạng thiết diện hoặc cho luôn công thức diện tích thiết diện
  - Ví dụ: ##VD Một khối bê tông có chiều cao 2 mét được đặt trên mặt đất. Nếu cắt khối bê tông bởi một mặt phẳng nằm ngang và cách mặt đất $x$ mét ($0 \leq x \leq 2$) thì được mặt cắt là một hình chữ nhật có chiều dài 3 m và chiều rộng bằng $(0,8)^x$ mét (tham khảo hình vẽ). ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d3755485-5634-4037-8c4d-84b2c63625da.png) Tính thể tích (đơn vị $m^3$) của khối bê tông đó (làm tròn kết q …
- **NDB00780** · Thể tích của hình có thiết diện cần xây công thức
  - Mô tả: Dạng bài này thiết diện phức tạp hơn, học sinh phải tự xác định được hình dạng của thiết diện, tự xây công thức để tính
  - Ví dụ: Một chiếc lều vải du lịch dạng hình cong như hình vẽ. Khung chính bao gồm đáy là hình vuông cạnh $2\ \mathrm{m}$ và hai xương đây $a,b$ nằm trên các đường parabol đỉnh $S$. Biết chiều cao của lều là $SO=1,35\ \mathrm{m}$, $O$ là tâm của đáy. Tính thể tích chiếc lều theo đơn vị $\mathrm{m^3}$. Viết kết quả dưới dạng số thập phân. ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/dd961dd6-93ae-4d55-9cb1-02a21a35e5ec.png) …
- **NDB00786** · Thể tích phần giao nhau của các hình
  - Mô tả: Dạng này thường xoay quanh việc 2 vật thể không gian giao nhau và tính diện tích phần giao nhau đó
  - Ví dụ: ##VD Gọi $(H)$ là phần giao của hai khối $\dfrac{1}{4}$ hình trụ có bán kính $a$, hai trục hình trụ vuông góc với nhau như hình vẽ sau. Tính thể tích của khối $(H)$. ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/ab14937e-0c12-4a65-b5e5-3889b816516b.png) Bài giải ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/d48749ae-dc06-4a23-9f1b-fba1353bb895.png) Đặt hệ toạ độ $Oxyz$ như hình vẽ, x …
