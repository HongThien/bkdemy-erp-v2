# Đề xuất bản đồ 4 tầng — Chương 5 Toán 11 "Giới hạn. Hàm số liên tục" (19/10)

Nguồn: SGK Toán 11 tập 1 KNTT Bài 15–17 · Từ Tâm Chương 3 · PNL 2026 Chương 5 · 107 đề giữa kì K11 (chưa có đề cuối kì). Xem bản HTML: `kho-rules/dai/k11-ban-do-gioi-han-de-xuat.html`.

**1 chủ đề · 3 chuyên đề · 17 nhóm bài · 55 dạng bài.**

## Chuyên đề 1. Giới hạn của dãy số (SGK Bài 15 (tr.104–110))

### Nhóm 1.1. Giới hạn của dãy số: định nghĩa và quy tắc
*Nguồn: SGK §1–2 · Từ Tâm D1 · PNL D1*
- **1.1.1** Nhận biết dãy số có giới hạn $0$ hoặc giới hạn hữu hạn — Cho dãy $u_n$, hỏi có giới hạn không / kể từ số hạng nào $|u_n|$ nhỏ hơn một số dương cho trước; các giới hạn cơ bản $\dfrac1{n^k}$, $q^n$ với $|q|<1$. _(HĐ1, VD1, LT1)_
- **1.1.2** Chứng minh giới hạn của dãy số bằng định nghĩa hoặc nguyên lí kẹp — Chứng minh $\lim u_n=a$ bằng $\lim(u_n-a)=0$; hoặc dùng $|u_n|\le v_n$, $v_n\to0$. _(HĐ2, VD2, LT2)_
- **1.1.3** Tính giới hạn khi biết giới hạn của các dãy thành phần — Cho $\lim u_n=a$, $\lim v_n=b$; tính giới hạn của tổng, hiệu, tích, thương, căn các dãy đó. _(HĐ3, 5.2)_ · câu thật: T111000000205

### Nhóm 1.2. Giới hạn dãy số dạng phân thức
*Nguồn: SGK VD3 · Từ Tâm D2 · PNL D2*
- **1.2.1** Phân thức có tử và mẫu cùng bậc, hoặc tử bậc thấp hơn — Chia cả tử và mẫu cho luỹ thừa cao nhất của $n$ rồi dùng quy tắc. _(VD3, 5.1a)_ · câu thật: T111000000206
- **1.2.2** Phân thức có tử bậc cao hơn mẫu (giới hạn $\pm\infty$) — Rút luỹ thừa cao nhất, xét dấu hệ số. _(PNL D2)_
- **1.2.3** Phân thức chứa tham số — Tìm tham số để giới hạn bằng giá trị cho trước, hoặc để giới hạn hữu hạn, hoặc để giới hạn là số nguyên. _(PNL D2 BT3–4)_ · câu thật: T111000000133

### Nhóm 1.3. Giới hạn dãy số dạng luỹ thừa và dạng tổng
*Nguồn: Từ Tâm D3 · PNL D3 · SGK 5.19*
- **1.3.1** Thương các luỹ thừa $a^n$, $b^n$ — Chia tử và mẫu cho luỹ thừa có cơ số lớn nhất. _(Từ Tâm D3)_
- **1.3.2** Dãy chứa cả $n^k$ và $q^n$ — Nhận ra $q^n$ ($q>1$) lớn hơn mọi $n^k$, rút ra ngoài rồi xét. _(PNL D3)_
- **1.3.3** Dãy là tổng $n$ số hạng của cấp số cộng hoặc cấp số nhân — Tính tổng theo công thức rồi lấy giới hạn, ví dụ $\dfrac{1+2+\dots+n}{n^2}$, $\dfrac{2+2^2+\dots+2^n}{2^n}$. _(5.19)_

### Nhóm 1.4. Giới hạn dãy số dạng căn thức
*Nguồn: SGK LT3, 5.1b, 5.3b, 5.18 · Từ Tâm D4*
- **1.4.1** Căn thức dưới dấu thương, đưa $n$ ra ngoài căn — Chia tử và mẫu cho $n$, chú ý $\sqrt{n^2}=n$. _(LT3)_
- **1.4.2** Hiệu hai căn hoặc căn trừ đa thức (dạng $\infty-\infty$) — Nhân và chia cho biểu thức liên hợp. _(5.1b, 5.3b, 5.18)_
- **1.4.3** Căn bậc ba, liên hợp bậc ba — Dùng $a-b=\dfrac{a^3-b^3}{a^2+ab+b^2}$ cho căn bậc ba. _(Từ Tâm D4 (trường hợp 2))_

### Nhóm 1.5. Giới hạn vô cực của dãy số
*Nguồn: SGK §4 · HĐ5, VD6, LT5*
- **1.5.1** Nhận biết dãy có giới hạn $+\infty$ hoặc $-\infty$ — $\lim n^k$, $\lim q^n$ với $q>1$; dãy vượt mọi số dương kể từ một số hạng nào đó. _(HĐ5)_
- **1.5.2** Tính giới hạn $\pm\infty$ bằng cách rút luỹ thừa cao nhất — Như $\lim(n^2-2n)$, $\lim(n-\sqrt n)$: rút $n^2$ hoặc $n$, dùng quy tắc tích. _(VD6, LT5)_
- **1.5.3** Quy tắc thương và tích khi có giới hạn vô cực — $\dfrac{u_n}{v_n}$ với $v_n\to0$ hoặc $v_n\to\pm\infty$; $u_nv_n$ khi $u_n\to\pm\infty$. _(khung tr.109)_

### Nhóm 1.6. Tổng của cấp số nhân lùi vô hạn
*Nguồn: SGK §3 · VD4–5, LT4, 5.4, 5.20*
- **1.6.1** Nhận biết cấp số nhân lùi vô hạn và tính tổng — Kiểm $|q|<1$, tính $S=\dfrac{u_1}{1-q}$. _(VD4, LT4, 5.20)_
- **1.6.2** Biểu diễn số thập phân vô hạn tuần hoàn dưới dạng phân số — Tách thành tổng cấp số nhân lùi vô hạn, ví dụ $2{,}222\dots$, $1{,}(12)$. _(VD5, 5.4)_
- **1.6.3** Tìm số hạng đầu hoặc công bội khi biết tổng (bài toán ngược) — Từ $S=\dfrac{u_1}{1-q}$ tìm đại lượng còn lại; ngoài SGK, mức nâng cao. _((ngoài SGK))_

### Nhóm 1.7. Bài toán thực tế về giới hạn dãy số
*Nguồn: SGK Vận dụng 1–2, HĐ4, 5.5, 5.6*
- **1.7.1** Đại lượng giảm dần hoặc tích luỹ lặp lại (bóng nảy, lượng thuốc trong cơ thể) — Lập dãy theo chu kì, chứng minh dần về $0$ hoặc tính giá trị ổn định. _(Vận dụng 1, 5.5)_
- **1.7.2** Hình học lặp vô hạn (hình vuông tô màu, đường gấp khúc, nghịch lí Zeno) — Lập cấp số nhân lùi vô hạn của độ dài hoặc diện tích, tính tổng. _(HĐ4, Vận dụng 2, 5.6)_

## Chuyên đề 2. Giới hạn của hàm số (SGK Bài 16 (tr.111–118))

### Nhóm 2.1. Giới hạn hữu hạn của hàm số tại một điểm: định nghĩa và quy tắc
*Nguồn: SGK §1 · HĐ1, VD1–2, 5.7*
- **2.1.1** Dùng định nghĩa (dãy $x_n$) chứng minh hoặc tính giới hạn — Lấy dãy $x_n\ne x_0$, $x_n\to x_0$, tính $f(x_n)$. _(HĐ1, VD1)_
- **2.1.2** Tính giới hạn bằng thay trực tiếp và quy tắc tổng, hiệu, tích, thương — Hàm xác định tại $x_0$, mẫu khác $0$. _(VD2)_
- **2.1.3** Nhận biết khẳng định đúng về giới hạn — Hai hàm khác nhau tại một điểm nhưng cùng giới hạn; cho $\lim f$, $\lim g$ tính giới hạn biểu thức. _(5.7)_

### Nhóm 2.2. Giới hạn dạng vô định $\dfrac00$
*Nguồn: SGK VD3, LT1, 5.8 · Từ Tâm D1 · PNL D1*
- **2.2.1** Phân thức hữu tỉ: phân tích nhân tử (có thể dùng chia Horner) — Triệt nhân tử chung $x-x_0$. _(Từ Tâm D1, 5.8a)_
- **2.2.2** Có một căn thức: nhân liên hợp — Nhân tử và mẫu với biểu thức liên hợp. _(VD3, LT1, 5.8b)_
- **2.2.3** Có hai căn thức, căn bậc ba, hoặc nhân liên hợp nhiều lần — Tách thành hiệu rồi liên hợp từng phần. _(Từ Tâm D1, PNL D1)_
- **2.2.4** Tìm tham số để giới hạn dạng $\dfrac00$ bằng giá trị cho trước — Điều kiện tử có nghiệm $x_0$, phân tích rồi so giới hạn. _(PNL D1 (nâng cao))_

### Nhóm 2.3. Giới hạn một bên
*Nguồn: SGK §1 · HĐ2, VD4, LT2, 5.9–5.11*
- **2.3.1** Hàm số cho bởi nhiều công thức — Giới hạn trái, phải tại điểm chia nhánh, kể cả hàm Heaviside. _(VD4, LT2, 5.9)_
- **2.3.2** Hàm chứa dấu giá trị tuyệt đối hoặc căn tại điểm biên — Bỏ dấu giá trị tuyệt đối theo từng bên. _(HĐ2, 5.11, 5.22)_
- **2.3.3** Điều kiện tồn tại giới hạn: giới hạn trái bằng giới hạn phải — Kết luận $\lim$ tồn tại hay không, tìm tham số để tồn tại. _(khung kiến thức tr.113)_

### Nhóm 2.4. Giới hạn hữu hạn của hàm số tại vô cực
*Nguồn: SGK §2 · VD5–6, LT3, 5.12, 5.21 · Từ Tâm D2*
- **2.4.1** Phân thức hữu tỉ khi $x\to\pm\infty$ — Chia tử và mẫu cho luỹ thừa cao nhất của $x$. _(Từ Tâm D2 (1))_ · câu thật: T111000000209
- **2.4.2** Biểu thức chứa căn khi $x\to\pm\infty$ (chú ý dấu khi $x\to-\infty$) — Đưa $|x|$ ra ngoài căn, $\sqrt{x^2}=-x$ khi $x<0$. _(VD6, LT3, 5.12a)_
- **2.4.3** Dạng $\infty-\infty$ — Nhân liên hợp đưa về $\dfrac\infty\infty$. _(5.12b, 5.21, Từ Tâm D2 (2))_
- **2.4.4** Dạng $0\cdot\infty$ — Đưa về $\dfrac00$ hoặc $\dfrac\infty\infty$. _(Từ Tâm D2 (3), ngoài SGK)_

### Nhóm 2.5. Giới hạn vô cực của hàm số
*Nguồn: SGK §3 · VD7–10, LT4–5, 5.10, 5.13*
- **2.5.1** Giới hạn tại một điểm dạng $\dfrac L0$ (xét dấu mẫu theo từng bên) — Giới hạn một bên bằng $+\infty$ hoặc $-\infty$. _(VD7, VD9, VD10, 5.10, 5.13)_ · câu thật: T111000000210
- **2.5.2** Giới hạn $\pm\infty$ khi $x\to\pm\infty$ của đa thức hoặc phân thức tử bậc cao hơn — Dùng $x^k$ chẵn hoặc lẻ khi $x\to-\infty$. _(Chú ý tr.116, PNL D2)_
- **2.5.3** Giới hạn của tích khi một hàm có giới hạn vô cực — Áp bảng dấu quy tắc tích $f(x)g(x)$. _(khung tr.117)_

### Nhóm 2.6. Bài toán thực tế về giới hạn hàm số
*Nguồn: SGK VD8, Vận dụng tr.115*
- **2.6.1** Mô hình vật lí hoặc kinh tế có giới hạn — Khối lượng theo vận tốc ($v\to c^-$), chi phí trung bình, nồng độ. _(VD8)_
- **2.6.2** Điểm dịch chuyển trong hình học (đường cao khi $A\to O$ hoặc $A\to\infty$) — Lập hàm theo tham số rồi lấy giới hạn. _(Vận dụng tr.115)_

## Chuyên đề 3. Hàm số liên tục (SGK Bài 17 (tr.119–122))

### Nhóm 3.1. Tính liên tục của hàm số tại một điểm
*Nguồn: SGK §1 · HĐ1, VD1–2, LT1 · Từ Tâm D1*
- **3.1.1** Xét tính liên tục tại một điểm của hàm một công thức — Kiểm $x_0$ thuộc tập xác định, $\lim f=f(x_0)$. _(VD1)_
- **3.1.2** Xét tính liên tục tại điểm chia nhánh của hàm nhiều công thức — So giới hạn trái, phải với $f(x_0)$. _(HĐ1, VD2, LT1)_
- **3.1.3** Nhận biết hàm liên tục hoặc gián đoạn qua đồ thị — Đồ thị liền nét hay đứt tại điểm đang xét (đề cần hình). _(HĐ2)_
- **3.1.4** Nhận biết khẳng định đúng về giới hạn và liên tục tại một điểm — Trắc nghiệm: có giới hạn nhưng không liên tục, hàm nào gián đoạn tại điểm cho trước. _(PNL TN)_ · câu thật: T111000000207

### Nhóm 3.2. Tìm tham số để hàm số liên tục hoặc gián đoạn tại một điểm
*Nguồn: SGK 5.24 · Từ Tâm D2 · PNL D1*
- **3.2.1** Tham số nằm ở giá trị tại điểm chia nhánh — Tính giới hạn rồi cho bằng $f(x_0)$. _(Từ Tâm D2)_ · câu thật: T111000000208
- **3.2.2** Giới hạn dạng $\dfrac00$ cho bằng giá trị hàm tại điểm — Phân tích hoặc liên hợp rồi tìm tham số. _(5.24)_
- **3.2.3** Tham số ở cả hai nhánh — Giới hạn trái bằng giới hạn phải bằng $f(x_0)$. _(PNL D1)_
- **3.2.4** Tìm tham số để hàm số gián đoạn tại một điểm — Phủ định điều kiện liên tục. _(Từ Tâm D2)_

### Nhóm 3.3. Tính liên tục trên một khoảng, đoạn, tập xác định
*Nguồn: SGK §2–3 · VD3–5, LT2, 5.15–5.17, 5.23*
- **3.3.1** Tìm các khoảng liên tục của hàm sơ cấp — Đa thức, phân thức, căn, lượng giác, tổng hiệu tích thương hàm liên tục. _(VD3–5, LT2, 5.15a, 5.23)_
- **3.3.2** Xét tính liên tục của hàm nhiều công thức trên tập xác định — Liên tục trên từng khoảng rồi xét điểm chia nhánh. _(5.15b)_
- **3.3.3** Tìm tham số để hàm số liên tục trên $\mathbb R$ hoặc trên một khoảng — Điều kiện liên tục tại điểm ghép. _(5.16)_
- **3.3.4** Bài toán thực tế về hàm số liên tục — Cước taxi, bảng giá bậc thang, hàm Heaviside, hàm dấu. _(5.17, 5.9)_

### Nhóm 3.4. Chứng minh phương trình có nghiệm
*Nguồn: SGK Nhận xét tr.122, VD6 · Từ Tâm D3*
- **3.4.1** Chứng minh phương trình có ít nhất một nghiệm trong khoảng cho trước — Hàm liên tục trên $[a;b]$ và $f(a)f(b)<0$. _(VD6, Từ Tâm D3)_
- **3.4.2** Chứng minh phương trình có ít nhất $k$ nghiệm — Chia thành nhiều khoảng, mỗi khoảng đổi dấu. _(PNL (nâng cao))_
- **3.4.3** Phương trình chứa tham số luôn có nghiệm — Chọn $a,b$ không phụ thuộc tham số sao cho $f(a)f(b)<0$. _(PNL (nâng cao))_
- **3.4.4** Bài toán thực tế dùng tính liên tục (giá trị trung gian) — Như bài vận tốc $60$ km/h ở phần mở đầu. _(Vận dụng tr.122)_

## 7 câu giới hạn thật trong 107 đề giữa kì K11
- T111000000133 — Dãy phân thức · tham số
- T111000000205 — Dãy · quy tắc từ giới hạn cho trước
- T111000000206 — Dãy phân thức cùng bậc
- T111000000207 — Liên tục tại một điểm (nhận biết)
- T111000000208 — Tham số liên tục tại điểm
- T111000000209 — Hàm số tại vô cực (phân thức)
- T111000000210 — Giới hạn vô cực, một bên
