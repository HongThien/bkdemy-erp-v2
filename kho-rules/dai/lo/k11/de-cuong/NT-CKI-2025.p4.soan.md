# ĐỀ | Ôn tập học kì I Toán 11 năm 2025–2026 — Trường THPT Nguyễn Trãi, Hà Nội
nam: 2026
bo_sach: KNTT
kieu: de_cuong

## PHẦN 41 | Phần 2: Bài tập tự luận | tu_luan

### Câu 17 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Khi nhấn một phím trên điện thoại cảm ứng, bàn phím sẽ tạo ra hai âm thuần, kết hợp với nhau để tạo ra âm thanh nhận dạng duy nhất phím. Hình cho thấy tần số thấp $f_1$ và tần số cao $f_2$ liên quan đến mỗi phím. Nhấn một phím sẽ tạo ra sóng âm $y=\sin(2\pi f_1t)+\sin(2\pi f_2t)$, ở đó $t$ là biến thời gian (tính bằng giây).
a) Tìm hàm số mô hình hoá âm thanh được tạo ra khi nhấn phím 4.
b) Biến đổi công thức vừa tìm được ở câu a về dạng tích của một hàm số sin và một hàm số côsin.
**Hình:** de_P41C17.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** tra bảng phím để lấy đúng hai tần số của phím 4, thay vào công thức sóng âm rồi dùng công thức biến đổi tổng thành tích của sin.

**Bước 1.** Ý a: đọc trên hình hàng chứa phím 4 để lấy tần số thấp và cột chứa phím 4 để lấy tần số cao, rồi gán chúng cho $f_1$ và $f_2$.

**Bước 2.** Ý a: thay hai tần số vừa đọc vào biểu thức $y$ và nhân $2\pi$ với từng tần số để viết gọn đối số của mỗi hàm sin.

**Bước 3.** Ý b: nhận ra tổng hai hàm sin có dạng $\sin u+\sin v$ nên áp dụng công thức biến đổi tổng thành tích của sin.

**Bước 4.** Ý b: tính nửa tổng và nửa hiệu của hai đối số, chú ý côsin là hàm chẵn để bỏ dấu trừ ở đối số côsin nếu có.

**Phần 2. Trình bày**

a) Phím 4 nằm ở hàng có tần số thấp $770$ Hz và cột có tần số cao $1209$ Hz, nên $f_1=770$, $f_2=1209$.

Hàm số mô hình hoá âm thanh khi nhấn phím 4 là:

$y=\sin(2\pi\cdot770t)+\sin(2\pi\cdot1209t)=\sin(1540\pi t)+\sin(2418\pi t)$

b) Áp dụng công thức $\sin u+\sin v=2\sin\dfrac{u+v}{2}\cos\dfrac{u-v}{2}$ với $u=1540\pi t$, $v=2418\pi t$:

$\dfrac{u+v}{2}=\dfrac{1540\pi t+2418\pi t}{2}=1979\pi t$

$\dfrac{u-v}{2}=\dfrac{1540\pi t-2418\pi t}{2}=-439\pi t$

$y=2\sin(1979\pi t)\cos(-439\pi t)=2\sin(1979\pi t)\cos(439\pi t)$

Vậy $y=\sin(1540\pi t)+\sin(2418\pi t)$ và $y=2\sin(1979\pi t)\cos(439\pi t)$.

### Câu 18 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Trong Vật lí, phương trình tổng quát của một vật dao động điều hoà cho bởi công thức $x(t)=A\cos(\omega t+\varphi)$, trong đó $t$ là thời điểm (tính bằng giây), $x(t)$ là li độ của vật tại thời điểm $t$, $A$ là biên độ dao động ($A>0$) và $\varphi\in[-\pi;\pi]$ là pha ban đầu của dao động.
Xét hai dao động điều hoà có phương trình: $x_1(t)=2\cos\left(\dfrac{\pi}{3}t+\dfrac{\pi}{6}\right)$ (cm), $x_2(t)=2\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{3}\right)$ (cm).
Tìm dao động tổng hợp $x(t)=x_1(t)+x_2(t)$ và sử dụng công thức biến đổi tổng thành tích để tìm biên độ và pha ban đầu của dao động tổng hợp này.

**Phần 1. Hướng dẫn**

**Mấu chốt:** cộng hai hàm côsin cùng tần số bằng công thức tổng thành tích rồi đưa kết quả về dạng $A\cos(\omega t+\varphi)$ với $A>0$.

**Bước 1.** Viết tổng $x_1(t)+x_2(t)$ và nhận ra đây là tổng của hai côsin nên dùng công thức biến đổi tổng thành tích của côsin.

**Bước 2.** Tính nửa tổng và nửa hiệu của hai đối số để biết đối số của thừa số côsin phụ thuộc $t$ và đối số của thừa số còn lại là một hằng số.

**Bước 3.** Tính giá trị của thừa số côsin hằng số, nhân với hệ số $2\cdot2$ để thu được biểu thức có dạng $A\cos(\omega t+\varphi)$.

**Bước 4.** Đối chiếu với dạng tổng quát để đọc $A$ và $\varphi$, kiểm tra $A>0$ và $\varphi\in[-\pi;\pi]$.

**Phần 2. Trình bày**

Dao động tổng hợp là:

$x(t)=x_1(t)+x_2(t)=2\cos\left(\dfrac{\pi}{3}t+\dfrac{\pi}{6}\right)+2\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{3}\right)$

Áp dụng $\cos a+\cos b=2\cos\dfrac{a+b}{2}\cos\dfrac{a-b}{2}$ với $a=\dfrac{\pi}{3}t+\dfrac{\pi}{6}$, $b=\dfrac{\pi}{3}t-\dfrac{\pi}{3}$:

$\dfrac{a+b}{2}=\dfrac{\dfrac{2\pi}{3}t-\dfrac{\pi}{6}}{2}=\dfrac{\pi}{3}t-\dfrac{\pi}{12}$

$\dfrac{a-b}{2}=\dfrac{\dfrac{\pi}{6}+\dfrac{\pi}{3}}{2}=\dfrac{\pi}{4}$

$x(t)=2\cdot2\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{12}\right)\cos\dfrac{\pi}{4}=4\cdot\dfrac{\sqrt2}{2}\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{12}\right)$

$x(t)=2\sqrt2\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{12}\right)$ (cm)

Đối chiếu với $x(t)=A\cos(\omega t+\varphi)$ có $A=2\sqrt2>0$ và $\varphi=-\dfrac{\pi}{12}\in[-\pi;\pi]$.

Vậy dao động tổng hợp là $x(t)=2\sqrt2\cos\left(\dfrac{\pi}{3}t-\dfrac{\pi}{12}\right)$ (cm), biên độ $A=2\sqrt2$ cm, pha ban đầu $\varphi=-\dfrac{\pi}{12}$.

### Câu 19 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Giả sử khi một cơn sóng biển đi qua một cái cọc ở ngoài khơi, chiều cao của nước được mô hình hoá bởi hàm số $h(t)=90\cos\left(\dfrac{\pi}{10}t\right)$, trong đó $h(t)$ là độ cao tính bằng centimét trên mực nước biển trung bình tại thời điểm $t$ giây.
a) Tìm chu kì của sóng.
b) Tìm chiều cao của sóng, tức là khoảng cách theo phương thẳng đứng giữa đáy và đỉnh của sóng.

**Phần 1. Hướng dẫn**

**Mấu chốt:** chu kì của $\cos(\omega t)$ là $\dfrac{2\pi}{\omega}$, còn chiều cao sóng là hiệu giữa giá trị lớn nhất và nhỏ nhất của $h(t)$.

**Bước 1.** Ý a: xác định hệ số $\omega$ đứng trước $t$ trong đối số của hàm côsin.

**Bước 2.** Ý a: áp dụng công thức chu kì của hàm $y=\cos(\omega t)$ với $\omega$ vừa tìm để tính chu kì, nhớ ghi đơn vị giây.

**Bước 3.** Ý b: dùng tập giá trị $[-1;1]$ của hàm côsin để suy ra khoảng giá trị của $h(t)$, tức độ cao đỉnh sóng và đáy sóng.

**Bước 4.** Ý b: lấy độ cao đỉnh sóng trừ độ cao đáy sóng để được khoảng cách theo phương thẳng đứng giữa chúng, ghi đơn vị cm.

**Phần 2. Trình bày**

a) Hàm $h(t)=90\cos\left(\dfrac{\pi}{10}t\right)$ tuần hoàn với chu kì $T=\dfrac{2\pi}{\frac{\pi}{10}}$.

$T=2\pi\cdot\dfrac{10}{\pi}=20$ (giây)

b) Vì $-1\le\cos\left(\dfrac{\pi}{10}t\right)\le1$ nên $-90\le h(t)\le90$.

Đỉnh sóng cao $90$ cm so với mực nước biển trung bình, đáy sóng thấp hơn mực đó $90$ cm.

Chiều cao của sóng là $90-(-90)=180$ (cm).

Vậy chu kì của sóng là $20$ giây và chiều cao của sóng là $180$ cm.

### Câu 20 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Khi Mặt Trăng quay quanh Trái Đất, mặt đối diện với Trái Đất thường chỉ được Mặt Trời chiếu sáng một phần. Các pha của Mặt Trăng mô tả mức độ phần bề mặt của nó được Mặt Trời chiếu sáng. Khi góc giữa Mặt Trời, Trái Đất và Mặt Trăng là $\alpha$ ($0^\circ\le\alpha\le360^\circ$) thì tỉ lệ $F$ của phần Mặt Trăng được chiếu sáng cho bởi công thức $F=\dfrac12(1-\cos\alpha)$. (Theo trang usno.navy.mil).
Xác định góc $\alpha$ tương ứng với các pha sau của Mặt Trăng:
a) $F=0$ (trăng mới);
b) $F=0{,}25$ (trăng lưỡi liềm);
c) $F=0{,}5$ (trăng bán nguyệt đầu tháng hoặc trăng bán nguyệt cuối tháng);
d) $F=1$ (trăng tròn).
**Hình:** de_P41C20.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** thay từng giá trị $F$ vào công thức để đưa về phương trình $\cos\alpha=c$ rồi tìm mọi góc trong đoạn $[0^\circ;360^\circ]$.

**Bước 1.** Từ công thức $F=\dfrac12(1-\cos\alpha)$ biểu diễn $\cos\alpha$ theo $F$ để dùng chung cho cả bốn pha.

**Bước 2.** Ý a và ý d: tính $\cos\alpha$ ứng với $F$ lấy hai giá trị đặc biệt ở hai đầu và nhớ các góc có côsin bằng $\pm1$ trên đoạn đã cho.

**Bước 3.** Ý b và ý c: tính $\cos\alpha$ rồi dùng bảng giá trị lượng giác của góc đặc biệt để tìm góc nhọn có côsin đó.

**Bước 4.** Với mỗi giá trị $\cos\alpha$, lấy thêm góc đối xứng qua trục hoành trên đường tròn lượng giác để không sót nghiệm trong $[0^\circ;360^\circ]$.

**Phần 2. Trình bày**

Từ $F=\dfrac12(1-\cos\alpha)$ suy ra $\cos\alpha=1-2F$.

a) $F=0$ thì $\cos\alpha=1$. Với $0^\circ\le\alpha\le360^\circ$ ta có $\alpha=0^\circ$ hoặc $\alpha=360^\circ$.

b) $F=0{,}25$ thì $\cos\alpha=1-0{,}5=0{,}5$. Với $0^\circ\le\alpha\le360^\circ$ ta có $\alpha=60^\circ$ hoặc $\alpha=300^\circ$.

c) $F=0{,}5$ thì $\cos\alpha=0$. Với $0^\circ\le\alpha\le360^\circ$ ta có $\alpha=90^\circ$ hoặc $\alpha=270^\circ$.

d) $F=1$ thì $\cos\alpha=-1$. Với $0^\circ\le\alpha\le360^\circ$ ta có $\alpha=180^\circ$.

Vậy trăng mới: $\alpha=0^\circ$ hoặc $360^\circ$; trăng lưỡi liềm: $\alpha=60^\circ$ hoặc $300^\circ$; trăng bán nguyệt: $\alpha=90^\circ$ hoặc $270^\circ$; trăng tròn: $\alpha=180^\circ$.

### Câu 21 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một quả đạn pháo được bắn ra khỏi nòng pháo với vận tốc ban đầu $v_0=500$ m/s hợp với phương ngang một góc $\alpha$. Trong Vật lí, ta biết rằng, nếu bỏ qua sức cản của không khí và coi quả đạn được bắn ra từ mặt đất thì quỹ đạo của quả đạn tuân theo phương trình $y=\dfrac{-g}{2v_0^2\cos^2\alpha}x^2+x\tan\alpha$, ở đó $g=9{,}8$ m/s$^2$ là gia tốc trọng trường.
a) Tính theo góc bắn $\alpha$ tầm xa mà quả đạn đạt tới (tức là khoảng cách từ vị trí bắn đến điểm quả đạn chạm đất).
b) Tìm góc bắn $\alpha$ để quả đạn trúng mục tiêu cách vị trí đặt khẩu pháo $22000$ m.
c) Tìm góc bắn $\alpha$ để quả đạn đạt độ cao lớn nhất.
**Ghi chú:** ảnh khẩu pháo trong đề chỉ minh hoạ, không đưa vào. Ý b: $\sin2\alpha=0{,}8624$ có hai góc $\alpha$ thoả mãn trong $(0^\circ;90^\circ)$, nêu cả hai. Ý c: công thức quỹ đạo chứa $\tan\alpha$ nên không xác định đúng tại $\alpha=90^\circ$; hiểu là độ cao tối đa $\dfrac{v_0^2\sin^2\alpha}{2g}$ đạt khi $\sin\alpha=1$, đáp án $\alpha=90^\circ$ (bắn thẳng đứng).

**Phần 1. Hướng dẫn**

**Mấu chốt:** quả đạn chạm đất khi $y=0$ với $x\ne0$, còn độ cao lớn nhất là tung độ đỉnh của parabol quỹ đạo.

**Bước 1.** Ý a: cho $y=0$, đặt $x$ làm nhân tử chung rồi giải phương trình bậc nhất còn lại để tìm hoành độ điểm chạm đất khác điểm bắn.

**Bước 2.** Ý a: rút gọn biểu thức bằng công thức $2\sin\alpha\cos\alpha$ để đưa tầm xa về dạng chỉ chứa $\sin2\alpha$, rồi thay $v_0$ và $g$.

**Bước 3.** Ý b: cho tầm xa bằng $22000$ để được phương trình theo $\sin2\alpha$, giải phương trình rồi chia đôi, nhớ rằng $0^\circ<2\alpha<180^\circ$ nên có hai góc.

**Bước 4.** Ý c: coi quỹ đạo là parabol $y=ax^2+bx$ với $a<0$, dùng tung độ đỉnh để viết độ cao lớn nhất theo $\alpha$.

**Bước 5.** Ý c: dùng $\sin^2\alpha\le1$ để tìm góc làm độ cao lớn nhất.

**Phần 2. Trình bày**

a) Quả đạn chạm đất khi $y=0$:

$x\left(\dfrac{-g}{2v_0^2\cos^2\alpha}x+\tan\alpha\right)=0$

$x=0$ (vị trí bắn) hoặc $x=\dfrac{2v_0^2\cos^2\alpha\tan\alpha}{g}$

Vì $\cos^2\alpha\tan\alpha=\sin\alpha\cos\alpha$ nên $x=\dfrac{2v_0^2\sin\alpha\cos\alpha}{g}=\dfrac{v_0^2\sin2\alpha}{g}$.

Với $v_0=500$, $g=9{,}8$: tầm xa $x=\dfrac{500^2}{9{,}8}\sin2\alpha\approx25510{,}2\sin2\alpha$ (m).

b) Tầm xa $22000$ m nên $\dfrac{250000}{9{,}8}\sin2\alpha=22000$.

$\sin2\alpha=\dfrac{22000\cdot9{,}8}{250000}=0{,}8624$

Với $0^\circ<\alpha<90^\circ$ thì $0^\circ<2\alpha<180^\circ$, nên $2\alpha\approx59{,}59^\circ$ hoặc $2\alpha\approx180^\circ-59{,}59^\circ=120{,}41^\circ$.

$\alpha\approx29{,}8^\circ$ hoặc $\alpha\approx60{,}2^\circ$.

c) Quỹ đạo là parabol $y=ax^2+bx$ với $a=\dfrac{-g}{2v_0^2\cos^2\alpha}<0$, $b=\tan\alpha$.

Độ cao lớn nhất là tung độ đỉnh: $y_{\max}=-\dfrac{b^2}{4a}=\tan^2\alpha\cdot\dfrac{2v_0^2\cos^2\alpha}{4g}=\dfrac{v_0^2\sin^2\alpha}{2g}$.

Vì $\sin^2\alpha\le1$ nên $y_{\max}\le\dfrac{v_0^2}{2g}$, đạt khi $\sin^2\alpha=1$ tức $\alpha=90^\circ$ (bắn thẳng đứng).

Vậy tầm xa là $\dfrac{v_0^2\sin2\alpha}{g}\approx25510{,}2\sin2\alpha$ m; để trúng mục tiêu cách $22000$ m cần $\alpha\approx29{,}8^\circ$ hoặc $\alpha\approx60{,}2^\circ$; độ cao lớn nhất khi $\alpha=90^\circ$.

### Câu 22 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Anh Thanh vừa được tuyển dụng vào một công ty công nghệ, được cam kết lương năm đầu sẽ là 200 triệu đồng và lương mỗi năm tiếp theo sẽ được tăng thêm 25 triệu đồng.
Gọi $s_n$ (triệu đồng) là lương vào năm thứ $n$ mà anh Thanh làm việc cho công ty đó. Khi đó ta có: $s_1=200$, $s_n=s_{n-1}+25$; $n\ge2$.
a) Tính lương của anh Thanh vào năm thứ 5 làm việc cho công ty.
b) Chứng minh $(s_n)$ là dãy số tăng. Giải thích ý nghĩa thực tế của kết quả này.

**Phần 1. Hướng dẫn**

**Mấu chốt:** hệ thức $s_n=s_{n-1}+25$ cho thấy $(s_n)$ là cấp số cộng, và tính tăng được xét qua dấu của $s_{n+1}-s_n$.

**Bước 1.** Ý a: từ hệ thức truy hồi nhận ra mỗi số hạng hơn số hạng liền trước một lượng không đổi, tức dãy là cấp số cộng, và xác định số hạng đầu, công sai.

**Bước 2.** Ý a: áp dụng công thức số hạng tổng quát của cấp số cộng với chỉ số của năm cần tính.

**Bước 3.** Ý b: viết hiệu $s_{n+1}-s_n$ từ hệ thức truy hồi và xét dấu của hiệu này với mọi $n$ nguyên dương.

**Bước 4.** Ý b: đổi kết luận toán học sang ngôn ngữ thực tế về lương từ năm này sang năm kế tiếp.

**Phần 2. Trình bày**

a) Vì $s_n-s_{n-1}=25$ với mọi $n\ge2$ nên $(s_n)$ là cấp số cộng có số hạng đầu $s_1=200$, công sai $d=25$.

$s_n=s_1+(n-1)d$

$s_5=200+4\cdot25=300$ (triệu đồng).

b) Với mọi $n\ge1$ ta có $s_{n+1}-s_n=25>0$, nên $s_{n+1}>s_n$.

Vậy $(s_n)$ là dãy số tăng.

Ý nghĩa thực tế: lương của anh Thanh mỗi năm đều cao hơn năm trước (cụ thể tăng thêm 25 triệu đồng mỗi năm).

Vậy lương năm thứ 5 của anh Thanh là $300$ triệu đồng và $(s_n)$ là dãy số tăng.

### Câu 23 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một gia đình cần khoan một cái giếng để lấy nước. Họ thuê một đội khoan giếng nước. Biết giá của mét khoan đầu tiên là 80 000 đồng, kể từ mét khoan thứ hai giá của mỗi mét khoan tăng thêm 5 000 đồng so với giá của mét khoan trước đó. Biết cần phải khoan sâu xuống 50 m mới có nước. Hỏi phải trả bao nhiêu tiền để khoan cái giếng đó?

**Phần 1. Hướng dẫn**

**Mấu chốt:** giá của các mét khoan liên tiếp lập thành một cấp số cộng, và tổng tiền phải trả là tổng của các số hạng đó.

**Bước 1.** Đặt $u_k$ là giá của mét khoan thứ $k$ và nhận ra dãy này là cấp số cộng, xác định số hạng đầu và công sai từ đề.

**Bước 2.** Xác định số số hạng cần cộng dựa vào độ sâu cần khoan để có nước.

**Bước 3.** Áp dụng công thức tổng $n$ số hạng đầu của cấp số cộng, thay số và tính, ghi kèm đơn vị đồng.

**Phần 2. Trình bày**

Gọi $u_k$ là giá của mét khoan thứ $k$ (đồng). Vì mỗi mét khoan tăng thêm 5 000 đồng so với mét trước nên $(u_k)$ là cấp số cộng có $u_1=80000$, $d=5000$.

Cần khoan $50$ m nên số tiền phải trả là tổng $50$ số hạng đầu:

$S_{50}=\dfrac{50\left[2u_1+49d\right]}{2}=25\left(2\cdot80000+49\cdot5000\right)$

$S_{50}=25\cdot(160000+245000)=25\cdot405000=10125000$

Vậy phải trả 10 125 000 đồng để khoan cái giếng đó.

### Câu 24 | kho=dai | loai=tra_loi_ngan | dap_an=20
**Đề:** Một kiến trúc sư thiết kế một hội trường với 15 ghế ngồi ở hàng thứ nhất, 18 ghế ngồi ở hàng thứ hai, 21 ghế ngồi ở hàng thứ ba, và cứ như vậy (số ghế ở hàng sau nhiều hơn 3 ghế so với số ghế ở hàng liền trước nó). Nếu muốn hội trường đó có sức chứa ít nhất 870 ghế ngồi thì kiến trúc sư đó phải thiết kế tối thiểu bao nhiêu hàng ghế?

**Phần 1. Hướng dẫn**

**Mấu chốt:** số ghế các hàng lập thành cấp số cộng, nên sức chứa của $n$ hàng là $S_n$ và cần tìm $n$ nguyên dương nhỏ nhất để $S_n$ không nhỏ hơn mức yêu cầu.

**Bước 1.** Xác định số hạng đầu và công sai của cấp số cộng số ghế mỗi hàng từ ba hàng đầu đề cho.

**Bước 2.** Viết tổng $S_n$ của $n$ hàng đầu bằng công thức tổng của cấp số cộng, rút gọn thành đa thức bậc hai theo $n$.

**Bước 3.** Lập bất phương trình $S_n\ge870$, chuyển về dạng bậc hai và giải bằng cách phân tích hoặc dùng biệt thức.

**Bước 4.** Kết hợp điều kiện $n$ nguyên dương, chọn giá trị nhỏ nhất thoả mãn và kiểm tra lại bằng cách tính $S_n$ tại đó.

**Phần 2. Trình bày**

Số ghế các hàng là cấp số cộng có $u_1=15$, $d=3$.

Sức chứa của $n$ hàng đầu là:

$S_n=\dfrac{n\left[2\cdot15+(n-1)\cdot3\right]}{2}=\dfrac{n(3n+27)}{2}$

Yêu cầu $S_n\ge870$:

$\dfrac{n(3n+27)}{2}\ge870$

$3n^2+27n-1740\ge0$

$n^2+9n-580\ge0$

$\Delta=81+2320=2401=49^2$ nên $n^2+9n-580=0$ có hai nghiệm $n=20$ và $n=-29$.

Tam thức $n^2+9n-580$ có hệ số $a=1>0$ nên $n^2+9n-580\ge0\Leftrightarrow n\le-29$ hoặc $n\ge20$.

Vì $n$ là số nguyên dương nên $n\ge20$.

Kiểm tra: $S_{20}=\dfrac{20\cdot87}{2}=870$.

Vậy kiến trúc sư phải thiết kế tối thiểu $20$ hàng ghế.

### Câu 25 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Từ hình vuông đầu tiên có cạnh bằng 1 (đơn vị độ dài), nối các trung điểm của bốn cạnh để có hình vuông thứ hai. Tiếp tục nối các trung điểm của bốn cạnh của hình vuông thứ hai để được hình vuông thứ ba. Cứ tiếp tục làm như thế, nhận được một dãy hình vuông (xem Hình 5).
Kí hiệu $p_n$ là chu vi của hình vuông thứ $n$ và $Q_n$ là tổng chu vi của $n$ hình vuông đầu tiên. Viết công thức tính $p_n$ và $Q_n$ ($n=1,2,3,\ldots$) và tìm $\lim Q_n$ (giới hạn này nếu có được gọi là tổng chu vi của các hình vuông).
**Hình:** de_P41C25.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** cạnh các hình vuông liên tiếp nhân với cùng một hệ số, nên chu vi lập thành cấp số nhân và $Q_n$ là tổng của cấp số nhân đó.

**Bước 1.** Dùng định lí Pythagore trong tam giác vuông tạo bởi hai nửa cạnh để so sánh cạnh hình vuông sau với cạnh hình vuông trước.

**Bước 2.** Từ tỉ số cạnh suy ra tỉ số chu vi, nhận ra $(p_n)$ là cấp số nhân và viết công thức số hạng tổng quát khi biết số hạng đầu và công bội.

**Bước 3.** Viết $Q_n$ bằng công thức tổng $n$ số hạng đầu của cấp số nhân.

**Bước 4.** Tìm giới hạn của $Q_n$ khi $n$ tăng vô hạn bằng cách dùng $\lim q^n=0$ khi công bội thoả $|q|<1$.

**Phần 2. Trình bày**

Gọi $a_n$ là cạnh của hình vuông thứ $n$, $a_1=1$.

Các đỉnh của hình vuông thứ $n+1$ là trung điểm bốn cạnh hình vuông thứ $n$, nên cạnh của nó là cạnh huyền của tam giác vuông có hai cạnh góc vuông bằng $\dfrac{a_n}{2}$.

$a_{n+1}=\sqrt{\left(\dfrac{a_n}{2}\right)^2+\left(\dfrac{a_n}{2}\right)^2}=\dfrac{\sqrt2}{2}a_n$

Do đó chu vi $p_{n+1}=4a_{n+1}=\dfrac{\sqrt2}{2}p_n$ và $p_1=4$.

Vậy $(p_n)$ là cấp số nhân có $p_1=4$, công bội $q=\dfrac{\sqrt2}{2}$:

$p_n=4\left(\dfrac{\sqrt2}{2}\right)^{n-1}$

Tổng chu vi $n$ hình vuông đầu tiên:

$Q_n=p_1\cdot\dfrac{1-q^n}{1-q}=\dfrac{4\left[1-\left(\dfrac{\sqrt2}{2}\right)^n\right]}{1-\dfrac{\sqrt2}{2}}$

Vì $0<q=\dfrac{\sqrt2}{2}<1$ nên $\lim q^n=0$.

$\lim Q_n=\dfrac{4}{1-\dfrac{\sqrt2}{2}}=\dfrac{8}{2-\sqrt2}=\dfrac{8(2+\sqrt2)}{2}=8+4\sqrt2$

Vậy $p_n=4\left(\dfrac{\sqrt2}{2}\right)^{n-1}$, $Q_n=\dfrac{4\left[1-\left(\frac{\sqrt2}{2}\right)^n\right]}{1-\frac{\sqrt2}{2}}$ và $\lim Q_n=8+4\sqrt2$.

### Câu 26 | kho=dai | loai=tra_loi_ngan | dap_an=4
**Đề:** Với hình vuông $A_1B_1C_1D_1$ như hình vẽ bên, cách tô màu như phần gạch sọc được gọi là cách tô màu “đẹp”. Một nhà thiết kế tiến hành tô màu cho một hình vuông như hình bên, theo quy trình sau:
Bước 1: Tô màu “đẹp” cho hình vuông $A_1B_1C_1D_1$.
Bước 2: Tô màu “đẹp” cho hình vuông $A_2B_2C_2D_2$ là hình vuông ở chính giữa khi chia hình vuông $A_1B_1C_1D_1$ thành 9 phần bằng nhau như hình vẽ.
Bước 3: Tô màu “đẹp” cho hình vuông $A_3B_3C_3D_3$ là hình vuông ở chính giữa khi chia hình vuông $A_2B_2C_2D_2$ thành 9 phần bằng nhau. Cứ tiếp tục như vậy. Hỏi cần ít nhất bao nhiêu bước để tổng diện tích phần được tô màu chiếm $49{,}99\%$.
**Hình:** de_P41C26.png
**Ghi chú:** đề không nói rõ phần gạch sọc; theo hình, một lần tô “đẹp” hình vuông $A_kB_kC_kD_k$ là gạch nửa hình vuông (tam giác $A_kD_kC_k$) trừ nửa tam giác của hình vuông giữa $A_{k+1}B_{k+1}C_{k+1}D_{k+1}$ (phần đó để bước sau tô). “Chiếm $49{,}99\%$” hiểu là tỉ lệ diện tích tô màu từ $49{,}99\%$ trở lên.

**Phần 1. Hướng dẫn**

**Mấu chốt:** diện tích tô thêm ở mỗi bước lập thành cấp số nhân, nên tổng diện tích tô sau $n$ bước tính được bằng công thức tổng, rồi giải bất phương trình theo $n$.

**Bước 1.** Lấy diện tích hình vuông đầu làm đơn vị và tìm tỉ số diện tích giữa hai hình vuông liên tiếp (hình vuông giữa có cạnh bằng một phần ba cạnh hình vuông lớn).

**Bước 2.** Đọc từ hình vẽ phần diện tích được tô ở bước đầu, rồi suy ra diện tích tô thêm ở bước thứ $k$ theo diện tích hình vuông thứ $k$.

**Bước 3.** Nhận ra các diện tích tô thêm lập thành cấp số nhân, tính công bội và tổng của $n$ bước đầu.

**Bước 4.** Lập bất phương trình tổng diện tích tô đạt ít nhất $49{,}99\%$, quy về so sánh luỹ thừa của $9$ với một số, rồi thử các giá trị $n$ nguyên dương.

**Phần 2. Trình bày**

Coi diện tích hình vuông $A_1B_1C_1D_1$ là $1$.

Hình vuông giữa có cạnh bằng $\dfrac13$ cạnh hình vuông ngoài nên diện tích bằng $\dfrac19$ diện tích hình vuông ngoài. Do đó hình vuông thứ $k$ có diện tích $\left(\dfrac19\right)^{k-1}$.

Ở bước $k$ phần tô thêm là nửa hình vuông thứ $k$ trừ nửa hình vuông thứ $k+1$:

$t_k=\dfrac12\left(\dfrac19\right)^{k-1}-\dfrac12\left(\dfrac19\right)^{k}=\dfrac49\left(\dfrac19\right)^{k-1}$

Vậy $(t_k)$ là cấp số nhân có $t_1=\dfrac49$, công bội $q=\dfrac19$.

Tổng diện tích tô sau $n$ bước:

$S_n=\dfrac49\cdot\dfrac{1-\left(\dfrac19\right)^n}{1-\dfrac19}=\dfrac12\left[1-\left(\dfrac19\right)^n\right]$

Yêu cầu $S_n\ge0{,}4999$:

$\dfrac12\left[1-\dfrac{1}{9^n}\right]\ge0{,}4999$

$1-\dfrac{1}{9^n}\ge0{,}9998$

$\dfrac{1}{9^n}\le0{,}0002$

$9^n\ge5000$

Ta có $9^3=729<5000$ và $9^4=6561\ge5000$. Vì $9^n$ tăng theo $n$ nên $n\ge4$.

Vậy cần ít nhất $4$ bước.

### Câu 27 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một lọ thủy tinh dung tích 1 000 ml chứa đầy 1 loại dung dịch chất độc nồng độ $10\%$ đã được chuyển sang bình chứa khác; nhưng dung dịch độc hại sau khi đổ hết vẫn còn dính lọ $0{,}1\%$. Để chất độc còn trong lọ $\le0{,}001$ μ gam (microgam), người ta dùng nước cất xúc rửa lọ thủy tinh này. Hỏi phải xúc rửa bao nhiêu lần nếu mỗi lần dùng 1 000 ml nước cất? Giả thử rằng mỗi lần xúc rửa, chất độc hòa tan hết trong nước và sau khi đổ đi dung dịch mới cũng vẫn còn dính lọ một lượng như nhau.
**Ghi chú:** đề sai (thiếu dữ kiện): không cho khối lượng riêng của dung dịch và không nói rõ “$0{,}1\%$” tính theo đại lượng nào. Giả thiết dung dịch nặng $1$ g/ml (tương đương hiểu nồng độ $10\%$ là $10$ g chất độc trong $100$ ml), lượng còn dính lọ sau mỗi lần đổ là $0{,}1\%$ lượng chất độc đang có trong lọ. Nếu hiểu phần dính lọ là $0{,}1\%$ thể tích ($1$ ml) thì mỗi lần rửa lượng chất độc nhân với $\dfrac{1}{1001}$ — vẫn cần đúng $3$ lần (đã kiểm bằng máy).

**Phần 1. Hướng dẫn**

**Mấu chốt:** lượng chất độc còn trong lọ sau mỗi lần xúc rửa bằng lượng trước đó nhân với $0{,}001$, nên lập thành cấp số nhân.

**Bước 1.** Đổi lượng chất độc ban đầu trong $1000$ ml dung dịch nồng độ $10\%$ sang đơn vị microgam, dựa vào giả thiết khối lượng riêng của dung dịch.

**Bước 2.** Tính lượng chất độc còn dính lọ ngay sau khi đổ hết dung dịch, dùng tỉ lệ còn dính của đề.

**Bước 3.** Nhận ra mỗi lần xúc rửa làm lượng còn lại nhân với cùng một hệ số, viết các số hạng liên tiếp của dãy lượng chất độc.

**Bước 4.** So sánh các số hạng với ngưỡng cho phép để tìm số lần xúc rửa nhỏ nhất, nhớ rằng dãy này giảm dần.

**Phần 2. Trình bày**

Lưu ý: đề thiếu khối lượng riêng của dung dịch; giả thiết dung dịch nặng $1$ g/ml và phần còn dính lọ là $0{,}1\%$ lượng chất độc đang có trong lọ.

Khối lượng dung dịch ban đầu là $1000$ g, chất độc chiếm $10\%$ nên có $100$ g $=10^8$ μg.

Sau khi đổ hết, lượng chất độc còn dính lọ là $u_0=10^8\cdot0{,}001=10^5$ μg.

Mỗi lần xúc rửa, lượng chất độc còn lại bằng $0{,}1\%$ lượng trước đó, nên gọi $u_k$ là lượng chất độc còn trong lọ sau $k$ lần rửa thì $u_k=u_{k-1}\cdot0{,}001$.

Vậy $(u_k)$ là cấp số nhân có $u_0=10^5$, công bội $q=10^{-3}$.

$u_1=10^5\cdot10^{-3}=100$

$u_2=100\cdot10^{-3}=0{,}1$

$u_3=0{,}1\cdot10^{-3}=0{,}0001$

Ta thấy $u_2=0{,}1>0{,}001$ và $u_3=0{,}0001\le0{,}001$. Dãy $(u_k)$ giảm nên từ lần thứ $3$ trở đi đều thoả mãn.

Vậy phải xúc rửa ít nhất $3$ lần.

### Câu 28 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một hãng taxi đưa ra giá cước cho loại xe 4 chỗ như sau: loại xe VF 5 plus có giá cước cho 1 km đầu tiên là 20 000 đồng/km; giá cước cho km thứ 2 đến km thứ 25 là 15 000 đồng/km; giá cước cho km thứ 26 trở lên là 15 000 đồng/km (qua 1 km đầu được tính cho km thứ hai, qua km thứ 25 được tính cho km thứ 26).
Giá cước được biểu diễn bởi hàm số $T(x)=\begin{cases}20000 & \text{khi } 0<x\le1\\20000+(x-1)\cdot15000 & \text{khi } 1<x\le25\\380000+(x-25)\cdot14000 & \text{khi } x>25\end{cases}$.
Xét tính liên tục của hàm số $T(x)$, với $x$ (km).
**Ghi chú:** đề sai: bảng ghi giá cước từ km thứ 26 là 15 000 đồng/km nhưng hàm số $T(x)$ dùng hệ số 14 000. Giải theo hàm số in trong đề; kết luận về tính liên tục không phụ thuộc hệ số này (hệ số 14 000 hay 15 000 đều cho cùng kết quả).

**Phần 1. Hướng dẫn**

**Mấu chốt:** mỗi nhánh của $T(x)$ là hàm đa thức nên liên tục trên khoảng của nó, vì vậy chỉ cần kiểm tra điều kiện liên tục tại các điểm nối $x=1$ và $x=25$.

**Bước 1.** Nêu tính liên tục của hàm trên từng khoảng mở của ba nhánh, dựa vào việc mỗi nhánh là hàm đa thức.

**Bước 2.** Tại điểm nối $x=1$: tính giá trị $T(1)$, giới hạn bên trái và giới hạn bên phải rồi so sánh.

**Bước 3.** Tại điểm nối $x=25$: làm tương tự với $T(25)$ và hai giới hạn một phía.

**Bước 4.** Tổng hợp kết quả để kết luận về tính liên tục của $T(x)$ trên $(0;+\infty)$ và nêu ý nghĩa thực tế.

**Phần 2. Trình bày**

Lưu ý: đề sai (bảng ghi 15 000 đồng/km từ km thứ 26 nhưng hàm số dùng 14 000); giải theo hàm số $T(x)$ đã cho.

Trên khoảng $(0;1)$, $T(x)=20000$ là hàm hằng nên liên tục. Trên khoảng $(1;25)$, $T(x)=20000+15000(x-1)$ là hàm đa thức nên liên tục. Trên khoảng $(25;+\infty)$, $T(x)=380000+14000(x-25)$ là hàm đa thức nên liên tục.

Xét tại $x=1$:

$T(1)=20000$

$\lim_{x\to1^-}T(x)=\lim_{x\to1^-}20000=20000$

$\lim_{x\to1^+}T(x)=\lim_{x\to1^+}\left[20000+15000(x-1)\right]=20000$

Vì $\lim_{x\to1^-}T(x)=\lim_{x\to1^+}T(x)=T(1)$ nên $T(x)$ liên tục tại $x=1$.

Xét tại $x=25$:

$T(25)=20000+24\cdot15000=380000$

$\lim_{x\to25^-}T(x)=\lim_{x\to25^-}\left[20000+15000(x-1)\right]=380000$

$\lim_{x\to25^+}T(x)=\lim_{x\to25^+}\left[380000+14000(x-25)\right]=380000$

Vì $\lim_{x\to25^-}T(x)=\lim_{x\to25^+}T(x)=T(25)$ nên $T(x)$ liên tục tại $x=25$.

Vậy hàm số $T(x)$ liên tục trên $(0;+\infty)$: giá cước thay đổi liên tục theo quãng đường, không có bước nhảy giá tại km thứ 1 và km thứ 25.

### Câu 29 | kho=dai | loai=tu_luan | dap_an=—
**Đề:** Một người nhảy bungee (một trò chơi mạo hiểm mà người chơi nhảy từ một nơi có địa thế cao xuống với dây đai an toàn buộc xung quanh người) từ một cây cầu và căng một sợi dây dài 100 m. Sau mỗi lần rơi xuống, nhờ sự đàn hồi của dây, người nhảy được kéo lên một quãng đường có độ dài bằng $75\%$ so với lần rơi trước đó và lại bị rơi xuống đúng bằng quãng đường vừa được kéo lên (Hình 3). Tính tổng quãng đường người đó đi được sau 10 lần kéo lên và lại rơi xuống.
**Hình:** de_P41C29.png

**Phần 1. Hướng dẫn**

**Mấu chốt:** các quãng đường kéo lên lập thành cấp số nhân công bội $0{,}75$, mỗi quãng đó được đi hai lần (lên rồi xuống), cộng thêm lần rơi đầu tiên.

**Bước 1.** Tách tổng quãng đường thành lần rơi đầu tiên và các cặp (kéo lên, rơi xuống) tiếp theo.

**Bước 2.** Tìm quãng đường kéo lên lần thứ nhất rồi nhận ra các quãng đường kéo lên liên tiếp lập thành cấp số nhân, xác định số hạng đầu và công bội.

**Bước 3.** Tính tổng $10$ quãng đường kéo lên bằng công thức tổng cấp số nhân, rồi nhân đôi vì mỗi quãng được đi cả lên lẫn xuống.

**Bước 4.** Cộng thêm quãng đường rơi lần đầu và làm tròn kết quả ở bước cuối, ghi đơn vị mét.

**Phần 2. Trình bày**

Lần rơi đầu tiên người nhảy đi $100$ m.

Gọi $d_k$ là quãng đường kéo lên lần thứ $k$ (cũng là quãng đường rơi xuống ngay sau đó). Ta có $d_1=0{,}75\cdot100=75$ và $d_{k+1}=0{,}75d_k$.

Vậy $(d_k)$ là cấp số nhân có $d_1=75$, công bội $q=0{,}75$.

Tổng $10$ quãng đường kéo lên:

$d_1+d_2+\cdots+d_{10}=75\cdot\dfrac{1-0{,}75^{10}}{1-0{,}75}=300\left(1-0{,}75^{10}\right)$

Mỗi quãng $d_k$ được đi hai lần (kéo lên rồi rơi xuống), nên tổng quãng đường là:

$S=100+2\cdot300\left(1-0{,}75^{10}\right)=100+600\left(1-0{,}75^{10}\right)$

$S\approx100+600\cdot0{,}9437\approx666{,}2$ (m)

Vậy tổng quãng đường người đó đi được xấp xỉ $666{,}2$ m.

## GHI CHÚ CHO NGƯỜI DUYỆT

- Khúc 4 (tr.13–16): Câu 17–29 của "Phần 2: Bài tập tự luận" (cùng tên PHẦN với các khúc trước, đánh số PHẦN 41 theo dải khúc). Không câu hình học không gian nào ⇒ không có hình giải.
- Câu 21c: công thức quỹ đạo chứa $\tan\alpha$ nên không xác định tại $90^\circ$; đáp án $\alpha=90^\circ$ theo nghĩa độ cao tối đa $\dfrac{v_0^2\sin^2\alpha}{2g}$ (đã Ghi chú).
- Câu 26: đề không mô tả chính xác phần gạch sọc; dựng theo hình (tổng giới hạn $\dfrac12$, cần $4$ bước). Nếu CEO hiểu khác (tô cả nửa hình vuông mỗi bước, không trừ nửa hình giữa) thì đáp số sẽ là $1$ — xin xem hình.
- Câu 27: đề thiếu khối lượng riêng (ảnh phóng to đọc rõ “0,001 μ gam (microgam)”); đã giải theo giả thiết nêu ở Ghi chú, đáp số $3$ (cách hiểu phần dính lọ theo thể tích cũng ra $3$).
- Câu 28: đề sai (bảng 15 000 ≠ hàm 14 000), kết luận không đổi.
- Hình đề đã cắt: Câu 17 (bàn phím), 20 (sơ đồ pha Mặt Trăng), 25 (Hình 5), 26 (hình vuông tô sọc), 29 (Hình 3). Ảnh minh hoạ Câu 21 (khẩu pháo) và Câu 27 (lọ độc) không đưa vào.
