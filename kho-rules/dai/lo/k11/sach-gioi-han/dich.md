# Bảng đích — chủ đề Giới hạn. Hàm số liên tục (K11, NCD00186) — các DẠNG BÀI (mã NDB…) theo thứ tự bản đồ

(Xếp theo Chuyên đề › Nhóm bài; dạng đứng SAU thắng. 3 dạng NDB01149 · NDB01170 · NDB01190 đang chờ Thùy xoá nên KHÔNG có trong bảng.)

## Chủ đề: Giới hạn. Hàm số liên tục

### Giới hạn của dãy số › Giới hạn của dãy số: định nghĩa và quy tắc

- **NDB01148** · Nhận biết dãy số có giới hạn 0 hoặc giới hạn hữu hạn
  - Mô tả: Cho dãy u_n, hỏi có giới hạn không / kể từ số hạng nào |u_n| nhỏ hơn một số dương cho trước; các giới hạn cơ bản 1/n^k, qⁿ với |q|<1.
  - Ví dụ: ##VD Cho dãy số $(u_n)$ với $u_n=\dfrac{(-1)^n}{n^2}$. a) Dãy số này có giới hạn là $0$ không? Vì sao? b) Kể từ số hạng thứ mấy thì $|u_n|<0{,}0004$? Bài giải: a) Ta có $|u_n|=\dfrac{1}{n^2}$ và $\lim\dfrac{1}{n^2}=0$, nên $|u_n|$ nhỏ hơn mọi số dương bé tuỳ ý khi $n$ đủ lớn. Do đó $\lim u_n=0$. b) $|u_n|<0{,}0004\Leftrightarrow\dfrac{1}{n^2}<\dfrac{1}{2500}\Leftrightarrow n^2>2500\Leftrightarrow n>50$. Số nguyên dương nhỏ nhất thoả $n>50$ là $n= …
- **NDB01160** · Nhận biết dãy có giới hạn +∞ hoặc -∞
  - Mô tả: lim n^k, lim qⁿ với q>1; dãy vượt mọi số dương kể từ một số hạng nào đó.
  - Ví dụ: ##VD Cho dãy số $(u_n)$ với $u_n=2^n$. Chứng tỏ $\lim u_n=+\infty$ và cho biết kể từ số hạng thứ mấy thì $u_n>1000$. Bài giải: Vì $q=2>1$ nên $\lim2^n=+\infty$. Ta có $2^9=512<1000<1024=2^{10}$. Dãy $(2^n)$ tăng nên $u_n>1000\Leftrightarrow n\ge10$. Vậy $\lim u_n=+\infty$ và kể từ số hạng thứ $10$ trở đi thì $u_n>1000$. ##VD Dãy số nào sau đây có giới hạn $-\infty$? A. $u_n=(-3)^n$ B. $u_n=-\left(\dfrac{4}{3}\right)^n$ C. $u_n=\dfrac{-n^2}{n^2+1} …
- **NDB01150** · Tính giới hạn khi biết giới hạn của các dãy thành phần
  - Mô tả: Cho lim u_n=a, lim v_n=b; tính giới hạn của tổng, hiệu, tích, thương, căn các dãy đó.
  - Ví dụ: ##VD Cho $\lim u_n=4$ và $\lim v_n=-2$. Tính: a) $\lim(u_n+3v_n)$ b) $\lim(u_n\cdot v_n)$ c) $\lim\dfrac{2u_n+1}{v_n}$ Bài giải: a) $\lim(u_n+3v_n)=\lim u_n+3\lim v_n=4+3\cdot(-2)=-2$. b) $\lim(u_n\cdot v_n)=\lim u_n\cdot\lim v_n=4\cdot(-2)=-8$. c) Mẫu có giới hạn $-2\ne0$ nên $\lim\dfrac{2u_n+1}{v_n}=\dfrac{2\cdot4+1}{-2}=-\dfrac{9}{2}$. Vậy các giới hạn lần lượt bằng $-2$, $-8$ và $-\dfrac{9}{2}$. ##VD Cho dãy số $(u_n)$ có $u_n\ge0$ với mọi $n …
### Giới hạn của dãy số › Giới hạn dãy số dạng phân thức

- **NDB01151** · Phân thức có tử và mẫu cùng bậc, hoặc tử bậc thấp hơn
  - Mô tả: Chia cả tử và mẫu cho luỹ thừa cao nhất của n rồi dùng quy tắc.
  - Ví dụ: ##VD Tìm $\lim\dfrac{3n^2-n+2}{n^2+4}$. Bài giải: Chia cả tử và mẫu cho $n^2$, ta được $\lim\dfrac{3n^2-n+2}{n^2+4}=\lim\dfrac{3-\dfrac{1}{n}+\dfrac{2}{n^2}}{1+\dfrac{4}{n^2}}$. Vì $\lim\dfrac{1}{n}=0$ và $\lim\dfrac{1}{n^2}=0$ nên tử có giới hạn $3$, mẫu có giới hạn $1$. Vậy $\lim\dfrac{3n^2-n+2}{n^2+4}=\dfrac{3}{1}=3$. ##VD Tìm các giới hạn sau: a) $\lim\dfrac{(2n+1)^2(n-3)}{(n+1)(4n^2-5)}$ b) $\lim\dfrac{n^2+4n}{n^3-2}$ Bài giải: a) Tử và mẫu  …
- **NDB01152** · Phân thức có tử bậc cao hơn mẫu (giới hạn ±∞)
  - Mô tả: Rút luỹ thừa cao nhất, xét dấu hệ số.
  - Ví dụ: ##VD Tìm $\lim\dfrac{n^3-2n}{3n^2+1}$. Bài giải: Rút $n^3$ ở tử và $n^2$ ở mẫu: $\dfrac{n^3-2n}{3n^2+1}=n\cdot\dfrac{1-\dfrac{2}{n^2}}{3+\dfrac{1}{n^2}}$. Ta có $\lim n=+\infty$ và $\lim\dfrac{1-\dfrac{2}{n^2}}{3+\dfrac{1}{n^2}}=\dfrac{1}{3}>0$. Áp dụng quy tắc tích, $\lim\dfrac{n^3-2n}{3n^2+1}=+\infty$. Vậy $\lim\dfrac{n^3-2n}{3n^2+1}=+\infty$. ##VD Tìm $\lim\dfrac{-2n^4+n}{(n+1)(n^2+3)}$. Bài giải: Tử có bậc $4$, mẫu có bậc $3$. Rút $n^4$ ở tử, …
- **NDB01162** · Quy tắc thương và tích khi có giới hạn vô cực
  - Mô tả: (u_n)/(v_n) với v_n→0 hoặc v_n→±∞; u_nv_n khi u_n→±∞.
  - Ví dụ: ##VD Tính các giới hạn sau: a) $\lim\dfrac{5}{n^2-n}$ b) $\lim\dfrac{4}{\left(\dfrac{1}{3}\right)^n}$ c) $\lim\left[\dfrac{2n+1}{n}\cdot(-n^2)\right]$ Bài giải: a) Ta có $n^2-n=n^2\left(1-\dfrac{1}{n}\right)$ với $\lim n^2=+\infty$ và $\lim\left(1-\dfrac{1}{n}\right)=1>0$ nên $\lim(n^2-n)=+\infty$. Tử bằng $5$ nên giới hạn bằng $0$. b) Mẫu $\left(\dfrac{1}{3}\right)^n$ có giới hạn $0$ và luôn dương; tử bằng $4>0$. Theo bảng dấu giới hạn bằng $+\i …
- **NDB01153** · Phân thức chứa tham số
  - Mô tả: Tìm tham số để giới hạn bằng giá trị cho trước, hoặc để giới hạn hữu hạn, hoặc để giới hạn là số nguyên.
  - Ví dụ: ##VD Tìm số thực $a$ để $\lim\dfrac{(a-1)n^2+3n}{2n^2+1}=3$. Bài giải: Chia cả tử và mẫu cho $n^2$: $\lim\dfrac{(a-1)n^2+3n}{2n^2+1}=\lim\dfrac{(a-1)+\dfrac{3}{n}}{2+\dfrac{1}{n^2}}=\dfrac{a-1}{2}$. Giới hạn bằng $3$ nên $\dfrac{a-1}{2}=3\Leftrightarrow a-1=6\Leftrightarrow a=7$. Thử lại: với $a=7$ thì $\lim\dfrac{6n^2+3n}{2n^2+1}=\dfrac{6}{2}=3$. Vậy $a=7$. ##VD Tìm các giá trị của tham số $m$ để $\lim\dfrac{(m^2-4)n^3+3n^2+1}{n^2-n+2}$ là một s …
### Giới hạn của dãy số › Giới hạn dãy số dạng luỹ thừa và dạng tổng

- **NDB01154** · Thương các luỹ thừa aⁿ, bⁿ
  - Mô tả: Chia tử và mẫu cho luỹ thừa có cơ số lớn nhất.
  - Ví dụ: ##VD Tìm $\lim\dfrac{2\cdot3^n+5^n}{3\cdot5^n-4^n}$. Bài giải: Cơ số lớn nhất là $5$. Chia cả tử và mẫu cho $5^n$: $\dfrac{2\cdot3^n+5^n}{3\cdot5^n-4^n}=\dfrac{2\left(\dfrac{3}{5}\right)^n+1}{3-\left(\dfrac{4}{5}\right)^n}$. Vì $\lim\left(\dfrac{3}{5}\right)^n=0$ và $\lim\left(\dfrac{4}{5}\right)^n=0$ nên tử có giới hạn $1$, mẫu có giới hạn $3$. Vậy $\lim\dfrac{2\cdot3^n+5^n}{3\cdot5^n-4^n}=\dfrac{1}{3}$. ##VD Tìm $\lim\dfrac{3\cdot4^{n+1}-5^n}{2 …
- **NDB01155** · Dãy chứa cả n^k và qⁿ
  - Mô tả: Nhận ra qⁿ (q>1) lớn hơn mọi n^k, rút ra ngoài rồi xét.
  - Ví dụ: ##VD Tính các giới hạn sau: a) $\lim\dfrac{n^2+3^n}{2\cdot3^n-n}$ b) $\lim(3^n-n^4)$ Bài giải: a) Chia cả tử và mẫu cho $3^n$: $\dfrac{n^2+3^n}{2\cdot3^n-n}=\dfrac{\dfrac{n^2}{3^n}+1}{2-\dfrac{n}{3^n}}$. Theo kết quả đã biết $\lim\dfrac{n^k}{q^n}=0$ ($q>1$), ta có $\lim\dfrac{n^2}{3^n}=0$ và $\lim\dfrac{n}{3^n}=0$ nên giới hạn bằng $\dfrac{0+1}{2-0}=\dfrac{1}{2}$. b) Rút $3^n$ ra ngoài: $3^n-n^4=3^n\left(1-\dfrac{n^4}{3^n}\right)$. Ta có $\lim3^n …
- **NDB01161** · Tính giới hạn ±∞ bằng cách rút luỹ thừa cao nhất
  - Mô tả: Như lim(n²-2n), lim(n-√n): rút n² hoặc n, dùng quy tắc tích.
  - Ví dụ: ##VD Tìm các giới hạn sau: a) $\lim(n^3-3n^2+2)$ b) $\lim(2n-3\sqrt{n})$ Bài giải: a) Rút $n^3$ ra ngoài: $n^3-3n^2+2=n^3\left(1-\dfrac{3}{n}+\dfrac{2}{n^3}\right)$. Ta có $\lim n^3=+\infty$ và $\lim\left(1-\dfrac{3}{n}+\dfrac{2}{n^3}\right)=1>0$, nên giới hạn bằng $+\infty$. b) Rút $n$ ra ngoài: $2n-3\sqrt{n}=n\left(2-\dfrac{3}{\sqrt{n}}\right)$. Vì $\lim\sqrt{n}=+\infty$ nên $\lim\dfrac{3}{\sqrt{n}}=0$, suy ra $\lim\left(2-\dfrac{3}{\sqrt{n}}\r …
- **NDB01156** · Dãy là tổng n số hạng của cấp số cộng hoặc cấp số nhân
  - Mô tả: Tính tổng theo công thức rồi lấy giới hạn, ví dụ (1+2+…+n)/(n²), (2+2²+…+2ⁿ)/(2ⁿ).
  - Ví dụ: ##VD Tìm $\lim\dfrac{1+3+5+\dots+(2n-1)}{2n^2+n}$. Bài giải: Các số $1,3,5,\dots,2n-1$ lập thành cấp số cộng có $n$ số hạng, $u_1=1$, $u_n=2n-1$. Tổng của chúng là $\dfrac{n(1+2n-1)}{2}=n^2$. Do đó $\lim\dfrac{1+3+5+\dots+(2n-1)}{2n^2+n}=\lim\dfrac{n^2}{2n^2+n}=\lim\dfrac{1}{2+\dfrac{1}{n}}=\dfrac{1}{2}$. Vậy giới hạn bằng $\dfrac{1}{2}$. ##VD Tìm $\lim\dfrac{1+\dfrac{1}{2}+\dfrac{1}{2^2}+\dots+\dfrac{1}{2^n}}{1+\dfrac{1}{3}+\dfrac{1}{3^2}+\dots+ …
### Giới hạn của dãy số › Giới hạn dãy số dạng căn thức

- **NDB01157** · Căn thức dưới dấu thương, đưa n ra ngoài căn
  - Mô tả: Chia tử và mẫu cho n, chú ý √(n²)=n.
  - Ví dụ: ##VD Tìm các giới hạn sau: a) $\lim\dfrac{\sqrt{9n^2+n}}{2n-1}$ b) $\lim\sqrt{\dfrac{8n+3}{2n+5}}$ Bài giải: a) Với $n>0$ ta có $\sqrt{9n^2+n}=n\sqrt{9+\dfrac{1}{n}}$ nên $\dfrac{\sqrt{9n^2+n}}{2n-1}=\dfrac{n\sqrt{9+\dfrac{1}{n}}}{n\left(2-\dfrac{1}{n}\right)}=\dfrac{\sqrt{9+\dfrac{1}{n}}}{2-\dfrac{1}{n}}$. Vì $\lim\dfrac{1}{n}=0$ nên giới hạn bằng $\dfrac{\sqrt{9}}{2}=\dfrac{3}{2}$. b) Chia tử và mẫu của biểu thức dưới căn cho $n$: $\dfrac{8n+3} …
- **NDB01158** · Hiệu hai căn hoặc căn trừ đa thức (dạng ∞-∞)
  - Mô tả: Nhân và chia cho biểu thức liên hợp.
  - Ví dụ: ##VD Tìm $\lim\left(\sqrt{n^2+6n}-n\right)$. Bài giải: Nhân và chia với biểu thức liên hợp $\sqrt{n^2+6n}+n$ (khác $0$): $\sqrt{n^2+6n}-n=\dfrac{(n^2+6n)-n^2}{\sqrt{n^2+6n}+n}=\dfrac{6n}{\sqrt{n^2+6n}+n}$. Chia cả tử và mẫu cho $n$: $\dfrac{6}{\sqrt{1+\dfrac{6}{n}}+1}$ có giới hạn $\dfrac{6}{1+1}=3$. Vậy $\lim\left(\sqrt{n^2+6n}-n\right)=3$. ##VD Tìm các giới hạn sau: a) $\lim\left(\sqrt{n^2+3n+1}-\sqrt{n^2-n+2}\right)$ b) $\lim\left(\sqrt{4n^2+n …
- **NDB01159** · Căn bậc ba, liên hợp bậc ba
  - Mô tả: Dùng a-b=(a³-b³)/(a²+ab+b²) cho căn bậc ba.
  - Ví dụ: ##VD Tìm $\lim\left(\sqrt[3]{n^3+2n^2}-n\right)$. Bài giải: Đặt $a=\sqrt[3]{n^3+2n^2}$ và $b=n$, nhân và chia với $a^2+ab+b^2$: $a-b=\dfrac{a^3-b^3}{a^2+ab+b^2}=\dfrac{2n^2}{\sqrt[3]{(n^3+2n^2)^2}+n\sqrt[3]{n^3+2n^2}+n^2}$. Chia cả tử và mẫu cho $n^2$, ta được $\dfrac{2}{\left(\sqrt[3]{1+\dfrac{2}{n}}\right)^2+\sqrt[3]{1+\dfrac{2}{n}}+1}$. Mẫu có giới hạn $1+1+1=3$. Vậy $\lim\left(\sqrt[3]{n^3+2n^2}-n\right)=\dfrac{2}{3}$. ##VD Tìm $\lim\left(\sq …
### Giới hạn của dãy số › Tổng của cấp số nhân lùi vô hạn

- **NDB01163** · Nhận biết cấp số nhân lùi vô hạn và tính tổng
  - Mô tả: Kiểm |q|<1, tính S=(u_1)/(1-q).
  - Ví dụ: ##VD Tính tổng $S=3+1+\dfrac{1}{3}+\dfrac{1}{9}+\dots+3\left(\dfrac{1}{3}\right)^{n-1}+\dots$ Bài giải: Các số hạng lập thành cấp số nhân có $u_1=3$ và $q=\dfrac{1}{3}$; vì $|q|<1$ nên đây là tổng của cấp số nhân lùi vô hạn. Áp dụng công thức: $S=\dfrac{u_1}{1-q}=\dfrac{3}{1-\dfrac{1}{3}}=\dfrac{3}{\dfrac{2}{3}}=\dfrac{9}{2}$. Vậy $S=\dfrac{9}{2}$. ##VD Cho dãy số $(u_n)$ với $u_n=\dfrac{4\cdot(-3)^n}{7^n}$. Chứng minh $(u_n)$ là cấp số nhân lùi  …
- **NDB01164** · Biểu diễn số thập phân vô hạn tuần hoàn dưới dạng phân số
  - Mô tả: Tách thành tổng cấp số nhân lùi vô hạn, ví dụ 2,222…, 1,(12).
  - Ví dụ: ##VD Biểu diễn số thập phân vô hạn tuần hoàn $0{,}(45)=0{,}454545\dots$ dưới dạng phân số. Bài giải: Ta có $0{,}(45)=0{,}45+0{,}0045+0{,}000045+\dots$ Đây là tổng của cấp số nhân lùi vô hạn có $u_1=0{,}45$ và $q=0{,}01$. Do đó $0{,}(45)=\dfrac{u_1}{1-q}=\dfrac{0{,}45}{1-0{,}01}=\dfrac{0{,}45}{0{,}99}=\dfrac{45}{99}=\dfrac{5}{11}$. Vậy $0{,}(45)=\dfrac{5}{11}$. ##VD Biểu diễn số thập phân vô hạn tuần hoàn $2{,}1(36)=2{,}1363636\dots$ dưới dạng phâ …
- **NDB01165** · Tìm số hạng đầu hoặc công bội khi biết tổng (bài toán ngược)
  - Mô tả: Từ S=(u_1)/(1-q) tìm đại lượng còn lại; ngoài SGK, mức nâng cao.
  - Ví dụ: ##VD Cho cấp số nhân lùi vô hạn có số hạng đầu $u_1=6$ và tổng $S=8$. Tìm công bội $q$ và số hạng thứ hai $u_2$. Bài giải: Từ $S=\dfrac{u_1}{1-q}$ ta có $8=\dfrac{6}{1-q}$, suy ra $1-q=\dfrac{6}{8}=\dfrac{3}{4}$ nên $q=\dfrac{1}{4}$. Giá trị này thoả $|q|<1$. Số hạng thứ hai: $u_2=u_1q=6\cdot\dfrac{1}{4}=\dfrac{3}{2}$. Vậy $q=\dfrac{1}{4}$ và $u_2=\dfrac{3}{2}$. ##VD Cho cấp số nhân lùi vô hạn có tổng $S=12$ và số hạng thứ hai $u_2=-9$. Tìm số hạ …
### Giới hạn của dãy số › Bài toán thực tế về giới hạn dãy số

- **NDB01166** · Đại lượng giảm dần hoặc tích luỹ lặp lại (bóng nảy, lượng thuốc trong cơ thể)
  - Mô tả: Lập dãy theo chu kì, chứng minh dần về 0 hoặc tính giá trị ổn định.
  - Ví dụ: ##VD Một quả bóng được thả từ độ cao $8$ m xuống sàn. Sau mỗi lần chạm sàn, bóng nảy lên cao bằng $\dfrac{3}{4}$ độ cao trước đó. Gọi $u_n$ là độ cao (tính bằng mét) của bóng sau lần nảy thứ $n$. a) Tìm công thức tính $u_n$ theo $n$. b) Chứng minh dãy $(u_n)$ có giới hạn $0$ và tính $u_3$. Bài giải: a) Sau lần nảy đầu, $u_1=8\cdot\dfrac{3}{4}=6$. Mỗi lần nảy sau, độ cao bằng $\dfrac{3}{4}$ lần độ cao trước nên $(u_n)$ là cấp số nhân có $u_1=6$ và …
- **NDB01167** · Hình học lặp vô hạn (hình vuông tô màu, đường gấp khúc, nghịch lí Zeno)
  - Mô tả: Lập cấp số nhân lùi vô hạn của độ dài hoặc diện tích, tính tổng.
  - Ví dụ: ##VD Cho hình vuông thứ nhất có cạnh $4$. Nối trung điểm bốn cạnh được hình vuông thứ hai, lại nối trung điểm bốn cạnh của hình vuông thứ hai được hình vuông thứ ba, cứ tiếp tục như vậy vô hạn lần. Tính tổng diện tích của tất cả các hình vuông. Bài giải: Gọi $u_n$ là diện tích hình vuông thứ $n$. Ta có $u_1=4^2=16$. Hình vuông thứ hai có cạnh bằng $\dfrac{4}{\sqrt{2}}=2\sqrt{2}$ nên $u_2=8=\dfrac{1}{2}u_1$; tương tự, diện tích mỗi hình vuông bằng …
### Giới hạn của hàm số › Giới hạn hữu hạn của hàm số tại một điểm: định nghĩa và quy tắc

- **NDB01168** · Dùng định nghĩa (dãy x_n) chứng minh hoặc tính giới hạn
  - Mô tả: Lấy dãy x_n≠ x_0, x_n→ x_0, tính f(x_n).
  - Ví dụ: ##VD Cho hàm số $f(x)=\dfrac{x^2-9}{x-3}$. Dùng định nghĩa, chứng minh rằng $\lim\limits_{x\to3}f(x)=6$. Bài giải: Hàm số xác định trên $\mathbb{R}\setminus\{3\}$. Lấy dãy số $(x_n)$ bất kì sao cho $x_n\ne3$ và $x_n\to3$. Ta có $f(x_n)=\dfrac{x_n^2-9}{x_n-3}=\dfrac{(x_n-3)(x_n+3)}{x_n-3}=x_n+3$ (vì $x_n-3\ne0$). Do đó $\lim f(x_n)=\lim(x_n+3)=3+3=6$. Vậy $\lim\limits_{x\to3}f(x)=6$. ##VD Cho hàm số $f(x)=\dfrac{x^3-8}{x^2-4}$. a) Với $x_n=2+\dfra …
- **NDB01169** · Tính giới hạn bằng thay trực tiếp và quy tắc tổng, hiệu, tích, thương
  - Mô tả: Hàm xác định tại x_0, mẫu khác 0.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to-1}\dfrac{x^3+2x-4}{x^2+3}$. Bài giải: Hàm số xác định tại $x=-1$ vì $x^2+3>0$. Giới hạn của tử: $\lim\limits_{x\to-1}(x^3+2x-4)=(-1)^3+2\cdot(-1)-4=-7$. Giới hạn của mẫu: $\lim\limits_{x\to-1}(x^2+3)=1+3=4\ne0$. Vậy $\lim\limits_{x\to-1}\dfrac{x^3+2x-4}{x^2+3}=\dfrac{-7}{4}=-\dfrac74$. ##VD Tính $\lim\limits_{x\to1}\dfrac{(x^2+3x)\sqrt{x+8}}{2x+1}$. Bài giải: Ta có $\lim\limits_{x\to1}(x^2+3x)=1+3=4$. Vì $x+8>0$ gần $ …
### Giới hạn của hàm số › Giới hạn dạng vô định 0/0

- **NDB01171** · Phân thức hữu tỉ: phân tích nhân tử (có thể dùng chia Horner)
  - Mô tả: Triệt nhân tử chung x-x_0.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to2}\dfrac{x^2-5x+6}{x^2-4}$. Bài giải: Thay $x=2$: tử $=4-10+6=0$, mẫu $=4-4=0$ nên đây là dạng $\dfrac00$. Phân tích: $x^2-5x+6=(x-2)(x-3)$ và $x^2-4=(x-2)(x+2)$. Với $x\ne2$: $\dfrac{x^2-5x+6}{x^2-4}=\dfrac{(x-2)(x-3)}{(x-2)(x+2)}=\dfrac{x-3}{x+2}$. Do đó $\lim\limits_{x\to2}\dfrac{x^2-5x+6}{x^2-4}=\lim\limits_{x\to2}\dfrac{x-3}{x+2}=\dfrac{2-3}{2+2}=-\dfrac14$. Vậy $\lim\limits_{x\to2}\dfrac{x^2-5x+6}{x^2-4}=-\dfrac1 …
- **NDB01172** · Có một căn thức: nhân liên hợp
  - Mô tả: Nhân tử và mẫu với biểu thức liên hợp.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to4}\dfrac{\sqrt{x+5}-3}{x-4}$. Bài giải: Thay $x=4$: tử $=\sqrt9-3=0$, mẫu $=0$ nên đây là dạng $\dfrac00$. Nhân tử và mẫu với biểu thức liên hợp $\sqrt{x+5}+3>0$. Với $x\ne4$: $\dfrac{\sqrt{x+5}-3}{x-4}=\dfrac{(x+5)-9}{(x-4)(\sqrt{x+5}+3)}=\dfrac{x-4}{(x-4)(\sqrt{x+5}+3)}=\dfrac1{\sqrt{x+5}+3}$. Do đó $\lim\limits_{x\to4}\dfrac{\sqrt{x+5}-3}{x-4}=\dfrac1{\sqrt9+3}=\dfrac16$. Vậy $\lim\limits_{x\to4}\dfrac{\sqrt{x+5}-3} …
- **NDB01173** · Có hai căn thức, căn bậc ba, hoặc nhân liên hợp nhiều lần
  - Mô tả: Tách thành hiệu rồi liên hợp từng phần.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to0}\dfrac{\sqrt{4+x}-\sqrt{4-x}}{x}$. Bài giải: Thay $x=0$: tử $=2-2=0$, mẫu $=0$ nên đây là dạng $\dfrac00$. Nhân tử và mẫu với $\sqrt{4+x}+\sqrt{4-x}>0$. Với $x\ne0$: $\dfrac{\sqrt{4+x}-\sqrt{4-x}}{x}=\dfrac{(4+x)-(4-x)}{x(\sqrt{4+x}+\sqrt{4-x})}=\dfrac{2x}{x(\sqrt{4+x}+\sqrt{4-x})}=\dfrac2{\sqrt{4+x}+\sqrt{4-x}}$. Do đó giới hạn bằng $\dfrac2{2+2}=\dfrac12$. Vậy $\lim\limits_{x\to0}\dfrac{\sqrt{4+x}-\sqrt{4-x}}{x}=\d …
- **NDB01174** · Tìm tham số để giới hạn dạng 0/0 bằng giá trị cho trước
  - Mô tả: Điều kiện tử có nghiệm x_0, phân tích rồi so giới hạn.
  - Ví dụ: ##VD Tìm các số $a$, $b$ để $\lim\limits_{x\to1}\dfrac{x^2+ax+b}{x-1}=3$. Bài giải: Mẫu dần tới $0$ mà giới hạn hữu hạn nên tử phải dần tới $0$: $1+a+b=0$, tức là $b=-1-a$. Khi đó $x^2+ax+b=x^2+ax-1-a=(x^2-1)+a(x-1)=(x-1)(x+1+a)$. Với $x\ne1$: $\dfrac{x^2+ax+b}{x-1}=x+1+a$, nên giới hạn bằng $2+a$. Cho $2+a=3$ ta được $a=1$, từ đó $b=-2$. Thử lại: $\dfrac{x^2+x-2}{x-1}=\dfrac{(x-1)(x+2)}{x-1}=x+2\to3$. Vậy $a=1$ và $b=-2$. ##VD Tìm các số $a$, $b …
### Giới hạn của hàm số › Giới hạn một bên

- **NDB01175** · Hàm số cho bởi nhiều công thức
  - Mô tả: Giới hạn trái, phải tại điểm chia nhánh, kể cả hàm Heaviside.
  - Ví dụ: ##VD Cho hàm số $f(x)=\begin{cases}x+1&\text{nếu }x<2\\6-x&\text{nếu }x\ge2\end{cases}$ có đồ thị như hình vẽ. ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bdm-k11/NDB01175_40c9872e417a_0d3a03.svg) Tính $\lim\limits_{x\to2^-}f(x)$ và $\lim\limits_{x\to2^+}f(x)$. Giới hạn $\lim\limits_{x\to2}f(x)$ có tồn tại không? Bài giải: Với dãy $(x_n)$ bất kì sao cho $x_n<2$ và $x_n\to2$: $f(x_n)=x_n+1\to3$. Vậy $\lim\limits_{ …
- **NDB01176** · Hàm chứa dấu giá trị tuyệt đối hoặc căn tại điểm biên
  - Mô tả: Bỏ dấu giá trị tuyệt đối theo từng bên.
  - Ví dụ: ##VD Cho hàm số $g(x)=\dfrac{x^2-9}{|x-3|}$. Tìm $\lim\limits_{x\to3^+}g(x)$ và $\lim\limits_{x\to3^-}g(x)$. Giới hạn $\lim\limits_{x\to3}g(x)$ có tồn tại không? Bài giải: Khi $x\to3^+$ ta có $x-3>0$ nên $|x-3|=x-3$ và $g(x)=\dfrac{(x-3)(x+3)}{x-3}=x+3$. Do đó $\lim\limits_{x\to3^+}g(x)=6$. Khi $x\to3^-$ ta có $x-3<0$ nên $|x-3|=-(x-3)$ và $g(x)=\dfrac{(x-3)(x+3)}{-(x-3)}=-(x+3)$. Do đó $\lim\limits_{x\to3^-}g(x)=-6$. Hai giới hạn một bên khác nh …
- **NDB01177** · Điều kiện tồn tại giới hạn: giới hạn trái bằng giới hạn phải
  - Mô tả: Kết luận lim tồn tại hay không, tìm tham số để tồn tại.
  - Ví dụ: ##VD Cho hàm số $f(x)=\begin{cases}x^2+1&\text{nếu }x<1\\3x-1&\text{nếu }x\ge1\end{cases}$ có đồ thị như hình vẽ. ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bdm-k11/NDB01177_0c4cbf986456_375942.svg) Xét sự tồn tại của $\lim\limits_{x\to1}f(x)$. Bài giải: Khi $x\to1^-$: $f(x)=x^2+1$ nên $\lim\limits_{x\to1^-}f(x)=1^2+1=2$. Khi $x\to1^+$: $f(x)=3x-1$ nên $\lim\limits_{x\to1^+}f(x)=3\cdot1-1=2$. Hai giới hạn một bê …
### Giới hạn của hàm số › Giới hạn hữu hạn của hàm số tại vô cực

- **NDB01178** · Phân thức hữu tỉ khi x→±∞
  - Mô tả: Chia tử và mẫu cho luỹ thừa cao nhất của x.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to+\infty}\dfrac{3x^2-x+2}{2x^2+5}$. Bài giải: Chia tử và mẫu cho $x^2$: $\dfrac{3x^2-x+2}{2x^2+5}=\dfrac{3-\dfrac1x+\dfrac2{x^2}}{2+\dfrac5{x^2}}$. Vì $\lim\limits_{x\to+\infty}\dfrac1x=0$ và $\lim\limits_{x\to+\infty}\dfrac1{x^2}=0$ nên giới hạn của tử là $3$, giới hạn của mẫu là $2$. Vậy $\lim\limits_{x\to+\infty}\dfrac{3x^2-x+2}{2x^2+5}=\dfrac32$. ##VD Tính $\lim\limits_{x\to-\infty}\dfrac{(2x-1)^2(x+3)}{x^3-5x+1}$.  …
- **NDB01179** · Biểu thức chứa căn khi x→±∞ (chú ý dấu khi x→-∞)
  - Mô tả: Đưa |x| ra ngoài căn, √(x²)=-x khi x<0.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to+\infty}\dfrac{\sqrt{4x^2+3}}{x+1}$. Bài giải: Khi $x\to+\infty$ ta có $x>0$ nên $\sqrt{4x^2+3}=x\sqrt{4+\dfrac3{x^2}}$. Chia tử và mẫu cho $x$: $\dfrac{\sqrt{4x^2+3}}{x+1}=\dfrac{\sqrt{4+\dfrac3{x^2}}}{1+\dfrac1x}$. Vì $\lim\limits_{x\to+\infty}\dfrac3{x^2}=0$ và $\lim\limits_{x\to+\infty}\dfrac1x=0$ nên giới hạn bằng $\dfrac{\sqrt4}{1}=2$. Vậy $\lim\limits_{x\to+\infty}\dfrac{\sqrt{4x^2+3}}{x+1}=2$. ##VD Tính $\lim\l …
- **NDB01180** · Dạng ∞-∞
  - Mô tả: Nhân liên hợp đưa về ∞/∞.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to+\infty}\left(\sqrt{x^2+4x}-x\right)$. Bài giải: Đây là dạng $\infty-\infty$. Nhân và chia với $\sqrt{x^2+4x}+x>0$: $\sqrt{x^2+4x}-x=\dfrac{(x^2+4x)-x^2}{\sqrt{x^2+4x}+x}=\dfrac{4x}{\sqrt{x^2+4x}+x}$. Khi $x\to+\infty$ ta có $x>0$, chia tử và mẫu cho $x$: $\dfrac{4}{\sqrt{1+\dfrac4x}+1}$. Vì $\dfrac4x\to0$ nên giới hạn bằng $\dfrac4{1+1}=2$. Vậy $\lim\limits_{x\to+\infty}\left(\sqrt{x^2+4x}-x\right)=2$. ##VD Tính $\lim …
- **NDB01181** · Dạng 0·∞
  - Mô tả: Đưa về 0/0 hoặc ∞/∞.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to+\infty}x\left(\sqrt{x^2+1}-x\right)$. Bài giải: Khi $x\to+\infty$: $x\to+\infty$ còn $\sqrt{x^2+1}-x\to0$ nên đây là dạng $0\cdot\infty$. Nhân liên hợp: $\sqrt{x^2+1}-x=\dfrac{(x^2+1)-x^2}{\sqrt{x^2+1}+x}=\dfrac1{\sqrt{x^2+1}+x}$. Do đó $x\left(\sqrt{x^2+1}-x\right)=\dfrac x{\sqrt{x^2+1}+x}$. Với $x>0$, chia tử và mẫu cho $x$: $\dfrac1{\sqrt{1+\dfrac1{x^2}}+1}\to\dfrac1{1+1}=\dfrac12$. Vậy $\lim\limits_{x\to+\infty}x\ …
### Giới hạn của hàm số › Giới hạn vô cực của hàm số

- **NDB01182** · Giới hạn tại một điểm dạng L/0 (xét dấu mẫu theo từng bên)
  - Mô tả: Giới hạn một bên bằng +∞ hoặc -∞.
  - Ví dụ: ##VD Cho hàm số $f(x)=\dfrac{2x-1}{x-3}$ có đồ thị như hình vẽ. ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bdm-k11/NDB01182_9f1c76f19bfe_d35f1e.svg) Tính $\lim\limits_{x\to3^+}f(x)$, $\lim\limits_{x\to3^-}f(x)$ và cho biết $\lim\limits_{x\to3}f(x)$ có tồn tại không. Bài giải: Khi $x\to3$: tử $2x-1\to5>0$ và mẫu $x-3\to0$ nên có dạng $\dfrac50$. Khi $x\to3^+$: $x-3>0$ nên mẫu dần tới $0$ qua giá trị dương, do đó  …
- **NDB01183** · Giới hạn ±∞ khi x→±∞ của đa thức hoặc phân thức tử bậc cao hơn
  - Mô tả: Dùng x^k chẵn hoặc lẻ khi x→-∞.
  - Ví dụ: ##VD Tính $\lim\limits_{x\to-\infty}\left(x^3-4x^2+1\right)$. Bài giải: Rút $x^3$ ra ngoài: $x^3-4x^2+1=x^3\left(1-\dfrac4x+\dfrac1{x^3}\right)$. Khi $x\to-\infty$: $x^3\to-\infty$ và $1-\dfrac4x+\dfrac1{x^3}\to1>0$. Do đó tích dần tới $-\infty$. Vậy $\lim\limits_{x\to-\infty}\left(x^3-4x^2+1\right)=-\infty$. ##VD Tính $\lim\limits_{x\to-\infty}\dfrac{3x^3+x-2}{x^2+1}$. Bài giải: Bậc tử ($3$) lớn hơn bậc mẫu ($2$). Rút $x^3$ ở tử và $x^2$ ở mẫu:  …
- **NDB01184** · Giới hạn của tích khi một hàm có giới hạn vô cực
  - Mô tả: Áp bảng dấu quy tắc tích f(x)g(x).
  - Ví dụ: ##VD Tính $\lim\limits_{x\to1}\dfrac{x-4}{(x-1)^2}$. Bài giải: Viết $\dfrac{x-4}{(x-1)^2}=(x-4)\cdot\dfrac1{(x-1)^2}$. Ta có $\lim\limits_{x\to1}(x-4)=-3<0$. Vì $(x-1)^2>0$ với mọi $x\ne1$ và $(x-1)^2\to0$ nên $\lim\limits_{x\to1}\dfrac1{(x-1)^2}=+\infty$. Áp dụng quy tắc tích ($L<0$, giới hạn thứ hai là $+\infty$): giới hạn là $-\infty$. Vậy $\lim\limits_{x\to1}\dfrac{x-4}{(x-1)^2}=-\infty$. ##VD Tính $\lim\limits_{x\to-\infty}\left(-3+\dfrac1x\ …
### Giới hạn của hàm số › Bài toán thực tế về giới hạn hàm số

- **NDB01185** · Mô hình vật lí hoặc kinh tế có giới hạn
  - Mô tả: Khối lượng theo vận tốc (v→ c^-), chi phí trung bình, nồng độ.
  - Ví dụ: ##VD Chi phí sản xuất $x$ sản phẩm của một xưởng là $C(x)=2000+15x$ (nghìn đồng). Chi phí trung bình của mỗi sản phẩm là $\overline C(x)=\dfrac{C(x)}x$. Tính $\lim\limits_{x\to+\infty}\overline C(x)$ và giải thích ý nghĩa kết quả. Bài giải: Với $x>0$: $\overline C(x)=\dfrac{2000+15x}x=\dfrac{2000}x+15$. Vì $\lim\limits_{x\to+\infty}\dfrac{2000}x=0$ nên $\lim\limits_{x\to+\infty}\overline C(x)=15$. Ý nghĩa: khi số sản phẩm sản xuất rất lớn thì chi …
- **NDB01186** · Điểm dịch chuyển trong hình học (đường cao khi A→ O hoặc A→∞)
  - Mô tả: Lập hàm theo tham số rồi lấy giới hạn.
  - Ví dụ: ##VD Cho tam giác vuông $OAB$ với $O$ là gốc toạ độ, $A=(a;0)$ với $a>0$ và $B=(0;2)$. Gọi $H$ là chân đường cao kẻ từ $O$ và $h=OH$. a) Tính $h$ theo $a$. b) Tính $\lim\limits_{a\to0^+}h$ và $\lim\limits_{a\to+\infty}h$, từ đó nhận xét vị trí của $H$ khi $A$ dịch chuyển về $O$ và khi $A$ ra xa vô cực. Bài giải: a) Ta có $OA=a$, $OB=2$ nên $AB=\sqrt{a^2+4}$. Từ $OH\cdot AB=OA\cdot OB$ suy ra $h=\dfrac{2a}{\sqrt{a^2+4}}$. b) Khi $a\to0^+$: $\lim\l …
### Hàm số liên tục › Tính liên tục của hàm số tại một điểm

- **NDB01187** · Xét tính liên tục tại một điểm của hàm một công thức
  - Mô tả: Kiểm x_0 thuộc tập xác định, lim f=f(x_0).
  - Ví dụ: ##VD Xét tính liên tục của hàm số $f(x)=\dfrac{x^2+3x}{x+1}$ tại điểm $x_0=1$. Bài giải: Hàm số xác định khi $x+1\ne0$, tức $x\ne-1$. Tập xác định là $\mathbb{R}\setminus\{-1\}$ nên $x_0=1$ thuộc tập xác định. Ta có $f(1)=\dfrac{1^2+3\cdot1}{1+1}=2$. $\lim\limits_{x\to1}f(x)=\lim\limits_{x\to1}\dfrac{x^2+3x}{x+1}=\dfrac{1^2+3\cdot1}{1+1}=2$. Vì $\lim\limits_{x\to1}f(x)=f(1)=2$. Vậy hàm số $f(x)$ liên tục tại $x_0=1$. ##VD Cho hàm số $f(x)=\dfrac{ …
- **NDB01188** · Xét tính liên tục tại điểm chia nhánh của hàm nhiều công thức
  - Mô tả: So giới hạn trái, phải với f(x_0).
  - Ví dụ: ##VD Xét tính liên tục của hàm số $f(x)=\begin{cases}x+2&\text{nếu }x<1\\5-2x&\text{nếu }x\ge1\end{cases}$ tại $x_0=1$. Bài giải: Giới hạn trái: $\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^-}(x+2)=3$. Giới hạn phải: $\lim\limits_{x\to1^+}f(x)=\lim\limits_{x\to1^+}(5-2x)=3$. Giá trị tại điểm: $f(1)=5-2\cdot1=3$. Ba giá trị bằng nhau: $\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^+}f(x)=f(1)=3$. Vậy hàm số $f(x)$ liên tục tại $x_0=1$. ##VD Xét tí …
- **NDB01189** · Nhận biết hàm liên tục hoặc gián đoạn qua đồ thị
  - Mô tả: Đồ thị liền nét hay đứt tại điểm đang xét (đề cần hình).
  - Ví dụ: ##VD Đồ thị của hàm số $y=f(x)$ như hình vẽ, hai nhánh của đồ thị không nối nhau tại $x=1$. Hàm số $f(x)$ liên tục hay gián đoạn tại $x=1$? Vì sao? ![](https://osrvycilwshkzhljuxef.supabase.co/storage/v1/object/public/kho-anh/bdm-k11/NDB01189_5b22f24b10f1_8944fb.svg) Bài giải: Từ hình vẽ, đồ thị gồm hai nhánh không nối nhau tại hoành độ $x=1$. Khi $x$ tiến tới $1$ từ bên trái, đồ thị tiến tới tung độ $2$: $\lim\limits_{x\to1^-}f(x)=2$. Khi $x$ ti …
### Hàm số liên tục › Tìm tham số để hàm số liên tục hoặc gián đoạn tại một điểm

- **NDB01191** · Tham số nằm ở 1 nhánh
  - Mô tả: Bài toán tìm tham số để hàm liên tục tại 1 điểm, trong đó tham số chỉ nằm ở 1 nhánh
  - Ví dụ: ##VD Tìm giá trị của tham số $m$ để hàm số $f(x)=\begin{cases}\dfrac{2x+3}{x-1}&\text{nếu }x\ne2\\3m+1&\text{nếu }x=2\end{cases}$ liên tục tại $x=2$. Bài giải: Với $x\ne2$ hàm số cho bởi $\dfrac{2x+3}{x-1}$, xác định tại $x=2$ nên $\lim\limits_{x\to2}f(x)=\dfrac{2\cdot2+3}{2-1}=7$. Giá trị tại điểm: $f(2)=3m+1$. Hàm số liên tục tại $x=2$ khi và chỉ khi $3m+1=7$. Suy ra $3m=6$, tức $m=2$. Vậy $m=2$. ##VD Tìm tất cả các giá trị của tham số $m$ để h …
- **NDB01193** · Tham số ở cả hai nhánh
  - Mô tả: Giới hạn trái bằng giới hạn phải bằng f(x_0).
  - Ví dụ: ##VD Tìm giá trị của tham số $a$ để hàm số $f(x)=\begin{cases}ax+1&\text{nếu }x\le1\\x^2+4-a&\text{nếu }x>1\end{cases}$ liên tục tại $x=1$. Bài giải: Giá trị tại điểm: $f(1)=a\cdot1+1=a+1$. Giới hạn trái: $\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^-}(ax+1)=a+1$. Giới hạn phải: $\lim\limits_{x\to1^+}f(x)=\lim\limits_{x\to1^+}(x^2+4-a)=5-a$. Hàm số liên tục tại $x=1$ khi và chỉ khi $a+1=5-a$, suy ra $2a=4$, tức $a=2$. Vậy $a=2$. ##VD Tìm giá trị …
- **NDB01194** · Tìm tham số để hàm số gián đoạn tại một điểm
  - Mô tả: Phủ định điều kiện liên tục.
  - Ví dụ: ##VD Tìm tất cả các giá trị của tham số $m$ để hàm số $f(x)=\begin{cases}\dfrac{x^2-3x+2}{x-1}&\text{nếu }x\ne1\\2m+1&\text{nếu }x=1\end{cases}$ gián đoạn tại $x=1$. Bài giải: Với $x\ne1$: $x^2-3x+2=(x-1)(x-2)$ nên $f(x)=x-2$ và $\lim\limits_{x\to1}f(x)=-1$. Giá trị tại điểm: $f(1)=2m+1$. Hàm số liên tục tại $x=1$ khi và chỉ khi $2m+1=-1$, tức $m=-1$. Hàm số gián đoạn tại $x=1$ khi $2m+1\ne-1$, tức $m\ne-1$. Vậy hàm số gián đoạn tại $x=1$ khi $m\ …
### Hàm số liên tục › Tính liên tục trên một khoảng, đoạn, tập xác định

- **NDB01195** · Tìm các khoảng liên tục của hàm sơ cấp
  - Mô tả: Đa thức, phân thức, căn, lượng giác, tổng hiệu tích thương hàm liên tục.
  - Ví dụ: ##VD Tìm các khoảng trên đó hàm số $f(x)=\dfrac{x+3}{x^2-4}$ liên tục. Bài giải: Hàm số xác định khi $x^2-4\ne0$, tức $x\ne2$ và $x\ne-2$. Tập xác định là $D=(-\infty;-2)\cup(-2;2)\cup(2;+\infty)$. Hàm số là thương của hai đa thức nên liên tục trên từng khoảng của tập xác định. Vậy hàm số liên tục trên các khoảng $(-\infty;-2)$, $(-2;2)$ và $(2;+\infty)$. ##VD Tìm các khoảng trên đó hàm số $f(x)=\dfrac{\sqrt{3-x}}{x^2-1}$ liên tục. Bài giải: Điều …
- **NDB01196** · Xét tính liên tục của hàm nhiều công thức trên tập xác định
  - Mô tả: Liên tục trên từng khoảng rồi xét điểm chia nhánh.
  - Ví dụ: ##VD Xét tính liên tục của hàm số $f(x)=\begin{cases}x^2-1&\text{nếu }x<2\\5-x&\text{nếu }x\ge2\end{cases}$ trên tập xác định của nó. Bài giải: Tập xác định của hàm số là $\mathbb{R}$. Trên $(-\infty;2)$, $f(x)=x^2-1$ là đa thức nên liên tục; trên $(2;+\infty)$, $f(x)=5-x$ là đa thức nên liên tục. Tại $x=2$: $\lim\limits_{x\to2^-}f(x)=2^2-1=3$, $\lim\limits_{x\to2^+}f(x)=5-2=3$ và $f(2)=5-2=3$. Ba giá trị bằng nhau nên $f$ liên tục tại $x=2$. Vậy …
- **NDB01197** · Tìm tham số để hàm số liên tục trên ℝ hoặc trên một khoảng
  - Mô tả: Điều kiện liên tục tại điểm ghép.
  - Ví dụ: ##VD Tìm giá trị của tham số $m$ để hàm số $f(x)=\begin{cases}x^2-2x+m&\text{nếu }x\ge1\\3x+1&\text{nếu }x<1\end{cases}$ liên tục trên $\mathbb{R}$. Bài giải: Hai nhánh đều là đa thức nên $f$ liên tục trên $(-\infty;1)$ và $(1;+\infty)$; chỉ cần xét tại $x=1$. Giá trị tại điểm: $f(1)=1-2+m=m-1$. Giới hạn phải: $\lim\limits_{x\to1^+}f(x)=\lim\limits_{x\to1^+}(x^2-2x+m)=m-1$; giới hạn trái: $\lim\limits_{x\to1^-}f(x)=\lim\limits_{x\to1^-}(3x+1)=4$. …
- **NDB01198** · Bài toán thực tế về hàm số liên tục
  - Mô tả: Cước taxi, bảng giá bậc thang, hàm Heaviside, hàm dấu.
  - Ví dụ: ##VD Giá điện sinh hoạt tính theo bậc thang: 50 kWh đầu tiên giá 1 800 đồng mỗi kWh; mỗi kWh từ số 51 đến số 100 giá 2 000 đồng; mỗi kWh từ số 101 trở đi giá 2 400 đồng. Gọi $T(x)$ (đồng) là số tiền điện khi dùng $x$ kWh ($x\ge0$). a) Viết công thức của $T(x)$. b) Xét tính liên tục của hàm số $T(x)$ trên $[0;+\infty)$. Bài giải: a) Với $0\le x\le50$: $T(x)=1800x$. Dùng đúng $50$ kWh hết $1800\cdot50=90000$ đồng. Với $50<x\le100$: $T(x)=90000+2000 …
### Hàm số liên tục › Chứng minh phương trình có nghiệm

- **NDB01199** · Chứng minh phương trình có ít nhất một nghiệm trong khoảng cho trước
  - Mô tả: Hàm liên tục trên [a;b] và f(a)f(b)<0.
  - Ví dụ: ##VD Chứng minh rằng phương trình $x^3+2x-5=0$ có ít nhất một nghiệm trong khoảng $(1;2)$. Bài giải: Xét hàm số $f(x)=x^3+2x-5$. Đây là hàm đa thức nên liên tục trên $\mathbb{R}$, do đó liên tục trên đoạn $[1;2]$. Ta có $f(1)=1+2-5=-2<0$ và $f(2)=8+4-5=7>0$. Suy ra $f(1)\cdot f(2)=-14<0$. Vậy phương trình $x^3+2x-5=0$ có ít nhất một nghiệm trong khoảng $(1;2)$. ##VD Chứng minh rằng phương trình $2\cos x=x$ có ít nhất một nghiệm trong khoảng $\lef …
- **NDB01200** · Chứng minh phương trình có ít nhất k nghiệm
  - Mô tả: Chia thành nhiều khoảng, mỗi khoảng đổi dấu.
  - Ví dụ: ##VD Chứng minh rằng phương trình $2x^3-6x+1=0$ có ba nghiệm phân biệt trong khoảng $(-2;2)$. Bài giải: Xét hàm số $f(x)=2x^3-6x+1$, là đa thức nên liên tục trên $\mathbb{R}$. Ta có $f(-2)=-3$, $f(-1)=5$, $f(0)=1$, $f(1)=-3$, $f(2)=5$. Vì $f(-2)\cdot f(-1)<0$ nên phương trình có nghiệm trong $(-2;-1)$. Vì $f(0)\cdot f(1)<0$ nên phương trình có nghiệm trong $(0;1)$. Vì $f(1)\cdot f(2)<0$ nên phương trình có nghiệm trong $(1;2)$. Ba khoảng $(-2;-1) …
- **NDB01201** · Phương trình chứa tham số luôn có nghiệm
  - Mô tả: Chọn a,b không phụ thuộc tham số sao cho f(a)f(b)<0.
  - Ví dụ: ##VD Chứng minh rằng với mọi giá trị của $m$, phương trình $m(x-1)(x-2)+2x-3=0$ luôn có nghiệm. Bài giải: Xét hàm số $f(x)=m(x-1)(x-2)+2x-3$, là đa thức theo $x$ nên liên tục trên $\mathbb{R}$ với mọi $m$. Tại $x=1$ và $x=2$, số hạng chứa $m$ bằng $0$: $f(1)=2\cdot1-3=-1$ và $f(2)=2\cdot2-3=1$. Suy ra $f(1)\cdot f(2)=-1<0$ với mọi giá trị của $m$. Vậy phương trình có ít nhất một nghiệm trong khoảng $(1;2)$ với mọi $m$. ##VD Chứng minh rằng với mọ …
- **NDB01202** · Bài toán thực tế dùng tính liên tục (giá trị trung gian)
  - Mô tả: Như bài vận tốc 60 km/h ở phần mở đầu.
  - Ví dụ: ##VD Nhiệt độ ngoài trời tại một địa điểm được ghi liên tục: lúc $6$ giờ là $18^\circ\text{C}$, lúc $14$ giờ là $31^\circ\text{C}$. Chứng minh rằng có một thời điểm trong khoảng từ $6$ giờ đến $14$ giờ nhiệt độ đúng bằng $25^\circ\text{C}$. Bài giải: Gọi $T(t)$ là nhiệt độ tại thời điểm $t$ giờ. Nhiệt độ thay đổi liên tục nên $T$ liên tục trên đoạn $[6;14]$. Đặt $g(t)=T(t)-25$ thì $g$ liên tục trên $[6;14]$. Ta có $g(6)=18-25=-7<0$ và $g(14)=31-2 …
