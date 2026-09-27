// Gắn kí hiệu khối (spec-format-noidung.md) cho lý thuyết HÌNH GIẢI TÍCH — Thùy 27/09 "phần hình giải tích
// chưa áp dụng cái này à? Áp luôn đi". Trước đó 0/19 bản ghi HGT có kí hiệu ⇒ PDF không có ô nào.
// Cách sửa: THAY ĐOẠN CHÍNH XÁC trên văn bản gốc (không gõ lại công thức) — mỗi `tim` phải xuất hiện ĐÚNG
// 1 lần, lệch là bỏ cả lượt. Chỉ thêm kí hiệu / dòng trống / chuyển nhãn có sẵn lên dòng kí hiệu; không đổi
// chữ nội dung (script chạy kiểm "chữ cũ ⊆ chữ mới" trước khi ghi). Khối không rõ loại ⇒ để nguyên (§1.5).
// Chạy: node --env-file=.env scripts/data/hgt_lt_gan_tag_2609.mjs [--ghi]   (không --ghi = xem trước)

const R = String.raw

export const OPS = {
  // ── Lớp 9: 3 dạng lý thuyết = đúng 1 bài mẫu có lời giải ⇒ Ví dụ ──
  T309010101: [[R`Cho $\triangle ABC$ vuông tại A.`, R`##VD
Cho $\triangle ABC$ vuông tại A.`]],
  T309010102: [[R`Cho tam giác ABC vuông ở A có $\hat{B} = 60^0$`, R`##VD
Cho tam giác ABC vuông ở A có $\hat{B} = 60^0$`]],
  T309010105: [[R`Cho tam giác ABC vuông ở A có $AB = 6cm`, R`##VD
Cho tam giác ABC vuông ở A có $AB = 6cm`]],

  // ── Lớp 10 véc tơ: "1. Phương pháp làm bài" ⇒ ##PP (mỗi trường hợp 1 dòng) · "2. Ví dụ minh họa" ⇒ ##VD ──
  T310010101: [
    [R`**1. Phương pháp làm bài**

Khi đề bài yêu cầu đếm số vec tơ khác $\vec{0}$: từ $n$ điểm phân biệt có $n(n - 1)$ vec tơ.

Khi đề bài hỏi về phương, hướng của hai vec tơ:

Bước 1: Giá song song hoặc trùng nhau thì hai vec tơ cùng phương.

Bước 2: Cùng phương thì so sánh chiều để kết luận cùng hướng hay ngược hướng.

Khi đề bài yêu cầu đếm véc tơ cùng phương`, R`##PP Phương pháp làm bài
Khi đề bài yêu cầu đếm số vec tơ khác $\vec{0}$: từ $n$ điểm phân biệt có $n(n - 1)$ vec tơ.
Khi đề bài hỏi về phương, hướng của hai vec tơ: Bước 1: Giá song song hoặc trùng nhau thì hai vec tơ cùng phương. Bước 2: Cùng phương thì so sánh chiều để kết luận cùng hướng hay ngược hướng.
Khi đề bài yêu cầu đếm véc tơ cùng phương`],
    [R`véc tơ.

Khi đề bài hỏi về véc tơ bằng nhau, đối nhau: bằng nhau là cùng hướng và cùng độ dài; đối nhau là ngược hướng và cùng độ dài.

Hình bình hành ABCD:`, R`véc tơ.
Khi đề bài hỏi về véc tơ bằng nhau, đối nhau: bằng nhau là cùng hướng và cùng độ dài; đối nhau là ngược hướng và cùng độ dài.
Hình bình hành ABCD:`],
    [R`**2. Ví dụ minh họa**`, R`**Ví dụ minh họa**`],
    [R`Ví dụ 1: Cho tam giác ABC.`, R`##VD
Ví dụ 1: Cho tam giác ABC.`],
    [R`Ví dụ 2: Cho hình bình hành ABCD, M là trung điểm`, R`##VD
Ví dụ 2: Cho hình bình hành ABCD, M là trung điểm`],
    [R`Ví dụ 3: Cho hình vuông ABCD.`, R`##VD
Ví dụ 3: Cho hình vuông ABCD.`],
  ],
  T310010102: [
    [R`**1. Phương pháp làm bài**

Quy tắc ba điểm: $\vec{AB} + \vec{BC} = \vec{AC}$.

Quy tắc hình bình hành ABCD: $\vec{AB} + \vec{AD} = \vec{AC}$.

Quy tắc trừ: $\vec{OB} - \vec{OA} = \vec{AB}$.

Khi hai véc tơ không nối tiếp, không chung điểm đầu: thay một véc tơ bằng véc tơ bằng nó để đưa về nối tiếp.

Khi đề bài cho đẳng thức chứa nhiều điểm:`, R`##PP Phương pháp làm bài
Quy tắc ba điểm: $\vec{AB} + \vec{BC} = \vec{AC}$.
Quy tắc hình bình hành ABCD: $\vec{AB} + \vec{AD} = \vec{AC}$.
Quy tắc trừ: $\vec{OB} - \vec{OA} = \vec{AB}$.
Khi hai véc tơ không nối tiếp, không chung điểm đầu: thay một véc tơ bằng véc tơ bằng nó để đưa về nối tiếp.
Khi đề bài cho đẳng thức chứa nhiều điểm:`],
    [R`so sánh.

Khi đề bài có trung điểm`, R`so sánh.
Khi đề bài có trung điểm`],
    [R`**2. Ví dụ minh họa**`, R`**Ví dụ minh họa**`],
    [R`Ví dụ 1: Cho hình bình hành ABCD. Tìm véc tơ tổng`, R`##VD
Ví dụ 1: Cho hình bình hành ABCD. Tìm véc tơ tổng`],
    [R`Ví dụ 2: Cho ba điểm phân biệt`, R`##VD
Ví dụ 2: Cho ba điểm phân biệt`],
    [R`Ví dụ 3: Cho tam giác ABC có trọng tâm G.`, R`##VD
Ví dụ 3: Cho tam giác ABC có trọng tâm G.`],
  ],
  T310010103: [
    [R`**1. Phương pháp làm bài**

- Khi đề bài hỏi độ dài một véc tơ:`, R`##PP Phương pháp làm bài
- Khi đề bài hỏi độ dài một véc tơ:`],
    [R`cắt nhau tại trung điểm mỗi đường.

- Khi đề bài hỏi độ dài véc tơ tổng, hiệu:

Bước 1: Thu gọn`, R`cắt nhau tại trung điểm mỗi đường.
- Khi đề bài hỏi độ dài véc tơ tổng, hiệu: Bước 1: Thu gọn`],
    [R`($M$ là trung điểm $BC$).

Bước 2: Tính độ dài $XY$.

- Khi hình vẽ trên lưới ô vuông: đếm số cạnh ô vuông dọc theo véc tơ.

- Lỗi sai hay gặp:`, R`($M$ là trung điểm $BC$). Bước 2: Tính độ dài $XY$.
- Khi hình vẽ trên lưới ô vuông: đếm số cạnh ô vuông dọc theo véc tơ.

##CY Lỗi sai hay gặp
`],
    [R`**2. Ví dụ minh họa**`, R`**Ví dụ minh họa**`],
    [R`Ví dụ 1: Cho hình thoi`, R`##VD
Ví dụ 1: Cho hình thoi`],
    // Lỗi dữ liệu gốc: Ví dụ 2 DÍNH liền cuối lời giải Ví dụ 1 ("= a\sqrt{3}$.Ví dụ 2:") ⇒ tách ra.
    [R`$|\vec{OB}| = OB = \sqrt{AB^2 - OA^2} = a\sqrt{3}$.Ví dụ 2: Cho hình vuông`, R`$|\vec{OB}| = OB = \sqrt{AB^2 - OA^2} = a\sqrt{3}$.

##VD
Ví dụ 2: Cho hình vuông`],
    // Gốc đánh trùng "Ví dụ 2" hai lần — khung tự đánh số nên hiện đúng "Ví dụ 3".
    [R`Ví dụ 2: Cho hình chữ nhật`, R`##VD
Ví dụ 2: Cho hình chữ nhật`],
  ],

  // ── Lớp 12 mặt phẳng / đường thẳng / khoảng cách ──
  T312010101: [
    [R`1. Vectơ pháp tuyến và cặp vectơ chỉ phương của mặt phẳng
Vectơ pháp tuyến của mặt phẳng: Cho mặt phẳng`, R`**1. Vectơ pháp tuyến và cặp vectơ chỉ phương của mặt phẳng**

##ĐN Vectơ pháp tuyến của mặt phẳng
Cho mặt phẳng`],
    [R`gọi là vectơ pháp tuyến của mặt phẳng $(\alpha)$.
Nhận xét:
Nếu`, R`gọi là vectơ pháp tuyến của mặt phẳng $(\alpha)$.

##NX Nhận xét
Nếu`],
    [R`một vectơ pháp tuyến của nó.
Cặp vectơ chỉ phương của mặt phẳng: Cho mặt phẳng`, R`một vectơ pháp tuyến của nó.

##ĐN Cặp vectơ chỉ phương của mặt phẳng
Cho mặt phẳng`],
    [R`là cặp vectơ chỉ phương của mặt phẳng $(\alpha)$.
Nhận xét: Một mặt phẳng`, R`là cặp vectơ chỉ phương của mặt phẳng $(\alpha)$.

##NX Nhận xét
Một mặt phẳng`],
    [R`cặp vectơ chỉ phương của nó.
Vectơ pháp tuyến của mặt phẳng khi biết một cặp vectơ chỉ phương: Trong không gian`, R`cặp vectơ chỉ phương của nó.

##TC Vectơ pháp tuyến của mặt phẳng khi biết một cặp vectơ chỉ phương
Trong không gian`],
    [R`Chú ý: Vectơ $\vec{n}=(a_2b_3`, R`##CY Chú ý
Vectơ $\vec{n}=(a_2b_3`],
    [R`2 Phương trình tổng quát của mặt phẳng

Định nghĩa: Trong không gian`, R`**2. Phương trình tổng quát của mặt phẳng**

##ĐN Định nghĩa
Trong không gian`],
    [R`Nhận xét: Cho mặt phẳng $(\alpha)$ có phương trình tổng quát là $Ax+By+Cz+D=0$. Khi đó:

* Mặt phẳng`, R`##NX Nhận xét
Cho mặt phẳng $(\alpha)$ có phương trình tổng quát là $Ax+By+Cz+D=0$. Khi đó:
* Mặt phẳng`],
    [R`$\vec{n}=(A;B;C)$

* Điểm`, R`$\vec{n}=(A;B;C)$
* Điểm`],
    [R`Ax_0+By_0+Cz_0+D=0$

* Mỗi phương trình`, R`Ax_0+By_0+Cz_0+D=0$
* Mỗi phương trình`],
  ],
  T312010102: [
    [R`Trong không gian $Oxyz$, phương trình tổng quát`, R`##TC
Trong không gian $Oxyz$, phương trình tổng quát`],
    [R`$D=-Ax_0-By_0-Cz_0$
**Lập phương trình`, R`$D=-Ax_0-By_0-Cz_0$

**Lập phương trình`],
    [R`ta thực hiện như sau:
**Bước 1:** Tìm một vecto pháp tuyến`, R`ta thực hiện như sau:

##PP
**Bước 1:** Tìm một vecto pháp tuyến`],
    [R`$(Q): A'x+B'y+C'z+D'=0$.
**Phương pháp**
Bước 1:`, R`$(Q): A'x+B'y+C'z+D'=0$.

##PP
Bước 1:`],
    [R`$(\delta): Ax+By+Cz+D=0$.
Phương pháp
Bước 1:`, R`$(\delta): Ax+By+Cz+D=0$.

##PP
Bước 1:`],
    [R`---

Bước 1: Vectơ pháp tuyến của mặt $(\alpha)$ là: $\vec{n} = \vec{AB}$.`, R`---

##PP
Bước 1: Vectơ pháp tuyến của mặt $(\alpha)$ là: $\vec{n} = \vec{AB}$.`],
  ],
  T312010103: [
    [R`ta thực hiện như sau:
**Bước 1:**`, R`ta thực hiện như sau:

##PP
**Bước 1:**`],
    [R`vecto pháp tuyến $\overrightarrow{n}$.
![](`, R`vecto pháp tuyến $\overrightarrow{n}$.

![](`],
    [R`.png)
**Nhận xét:**
Mặt phẳng`, R`.png)

##NX Nhận xét
Mặt phẳng`],
  ],
  T312010201: [
    [R`**Ví dụ 1.1.** Trong không gian $Oxyz$, xác định một vecto chỉ phương của đường thẳng dưới đây:

(1)`, R`##VD
Trong không gian $Oxyz$, xác định một vecto chỉ phương của đường thẳng dưới đây:
(1)`],
  ],
  T312010202: [
    [R`**Phương pháp**

Phương trình $\begin{cases} x = x_0 + at \\ y = y_0 + bt \\ z = z_0 + ct \end{cases}$

hoặc`, R`##PP
Phương trình $\begin{cases} x = x_0 + at \\ y = y_0 + bt \\ z = z_0 + ct \end{cases}$ hoặc`],
    [R`**Lưu ý:** Phương trình`, R`##CY Lưu ý
Phương trình`],
  ],
  T312010205: [
    [R`Gợi $\begin{cases}`, R`##PP
Gợi $\begin{cases}`],
    // "MN là đường vuông góc chung ⇔ …" là 1 ý bị ngắt 2 dòng ⇒ nối lại, kẻo thành 2 bước.
    [R`$MN$ là đường vuông góc chung
$\Leftrightarrow`, R`$MN$ là đường vuông góc chung $\Leftrightarrow`],
    [R`\end{cases}$.
Lưu ý: Phương trình`, R`\end{cases}$.

##CY Lưu ý
Phương trình`],
  ],
  T312010502: [[R`Công thức khoảng cách từ điểm`, R`##TC
Công thức khoảng cách từ điểm`]],
  T312010503: [
    [R`như sau:
**Bước 1:**`, R`như sau:

##PP
**Bước 1:**`],
    [R`Ax+By+Cz+D=0$.

**Bước 2:**`, R`Ax+By+Cz+D=0$.
**Bước 2:**`],
    [R`**Lưu ý:** $d(M_o,(Oxy))`, R`##CY Lưu ý
$d(M_o,(Oxy))`],
  ],
  T312010504: [
    [R`Công thức khoảng cách giữa 2 đường thẳng chéo nhau`, R`##TC
Công thức khoảng cách giữa 2 đường thẳng chéo nhau`],
    [R`vecto chỉ phương $\vec{u_2}$) là:

$$d(d_1;d_2)`, R`vecto chỉ phương $\vec{u_2}$) là:
$$d(d_1;d_2)`],
  ],
  T312010505: [[R`Cho mặt phẳng $(P): Ax + By + Cz + D = 0$
Mặt phẳng $(Q)`, R`##TC
Cho mặt phẳng $(P): Ax + By + Cz + D = 0$
Mặt phẳng $(Q)`]],
  T312010701: [
    [R`Có 3 vị trí tương đối`, R`##TC
Có 3 vị trí tương đối`],
    [R`Chú ý: Cho mặt phẳng`, R`##CY Chú ý
Cho mặt phẳng`],
  ],

  // ── Chuyên đề Lớp 6: hình phẳng thực tiễn — mỗi hình = 1 ô Kiến thức cần nhớ, tên hình lên tag ──
  T3060101: [
    [R`MỘT SỐ HÌNH PHẲNG TRONG THỰC TIỄN
I. HÌNH TAM GIÁC ĐỀU.
`, R`**MỘT SỐ HÌNH PHẲNG TRONG THỰC TIỄN**

##TC Hình tam giác đều
`],
    [R`II. HÌNH VUÔNG.
Hình vuông $ABCD$`, R`##TC Hình vuông
Hình vuông $ABCD$`],
    [R`III. LỤC GIÁC ĐỀU.
`, R`##TC Lục giác đều
`],
    [R`IV. HÌNH CHỮ NHẬT.
Hình chữ nhật $MNPQ$`, R`##TC Hình chữ nhật
Hình chữ nhật $MNPQ$`],
    [R`V. HÌNH THOI.
Hình thoi $ABCD$`, R`##TC Hình thoi
Hình thoi $ABCD$`],
    [R`VI. HÌNH BÌNH HÀNH.
Hình bình hành ABCD`, R`##TC Hình bình hành
Hình bình hành ABCD`],
    [R`VII. HÌNH THANG CÂN.
`, R`##TC Hình thang cân
`],
    [R`CHU VI, DIỆN TÍCH CỦA MỘT SỐ HÌNH PHẲNG
I. HÌNH TAM GIÁC.
Chu vi: $P=a+b+c$
Diện tích: $S=\dfrac{1}{2}\cdot a\cdot h$ (với $a$ là độ dài cạnh đáy, $h$ là chiều cao)
![](`, R`**CHU VI, DIỆN TÍCH CỦA MỘT SỐ HÌNH PHẲNG**

##TC Hình tam giác
Chu vi: $P=a+b+c$
Diện tích: $S=\dfrac{1}{2}\cdot a\cdot h$ (với $a$ là độ dài cạnh đáy, $h$ là chiều cao)

![](`],
    [R`II. HÌNH VUÔNG.
Chu vi: $P=a\cdot 4$
Diện tích: $S=a^2$
Trong đó $a$ là cạnh hình vuông.
![](`, R`##TC Hình vuông
Chu vi: $P=a\cdot 4$
Diện tích: $S=a^2$
Trong đó $a$ là cạnh hình vuông.

![](`],
    [R`III. HÌNH CHỮ NHẬT.
Chu vi: $P=(a+b)\cdot 2$
Diện tích: $S=a\cdot b$
Với $a$ là chiều rộng, $b$ là chiều dài của hình chữ nhật.
![](`, R`##TC Hình chữ nhật
Chu vi: $P=(a+b)\cdot 2$
Diện tích: $S=a\cdot b$
Với $a$ là chiều rộng, $b$ là chiều dài của hình chữ nhật.

![](`],
    [R`IV. HÌNH THANG.
Chu vi: $P=a+b+c+d$
Diện tích: $S=\dfrac{(a+b)\cdot h}{2}$
![](`, R`##TC Hình thang
Chu vi: $P=a+b+c+d$
Diện tích: $S=\dfrac{(a+b)\cdot h}{2}$

![](`],
    [R`V. HÌNH BÌNH HÀNH.
Chu vi: $P=(a+b)\cdot 2$
Diện tích: $S=a\cdot h$
![](`, R`##TC Hình bình hành
Chu vi: $P=(a+b)\cdot 2$
Diện tích: $S=a\cdot h$

![](`],
    [R`VI. HÌNH THOI.
Chu vi: $P=a\cdot 4$
Diện tích: $S=\dfrac{m\cdot n}{2}$
![](`, R`##TC Hình thoi
Chu vi: $P=a\cdot 4$
Diện tích: $S=\dfrac{m\cdot n}{2}$

![](`],
  ],

  // ── Chuyên đề Lớp 10: véc tơ ──
  T3100101: [
    [R`đoạn thẳng có hướng.
a) Định nghĩa
Vecto là`, R`đoạn thẳng có hướng.

##ĐN Định nghĩa
Vecto là`],
    [R`Giá của vecto: Đường thẳng`, R`##ĐN Giá của vecto
Đường thẳng`],
    [R`giá của vecto đó.
Vecto cùng phương, vecto cùng hướng: Hai vecto được gọi là cùng phương`, R`giá của vecto đó.

##ĐN Vecto cùng phương, vecto cùng hướng
Hai vecto được gọi là cùng phương`],
    [R`cùng hướng hoặc ngược hướng.
Nhận xét: Ba điểm`, R`cùng hướng hoặc ngược hướng.

##NX Nhận xét
Ba điểm`],
    [R`cùng phương.
Hai vecto bằng nhau: Hai vecto`, R`cùng phương.

##ĐN Hai vecto bằng nhau
Hai vecto`],
    [R`Kí hiệu $\vec{a} = \vec{b}$.
Chú ý: Khi cho trước`, R`Kí hiệu $\vec{a} = \vec{b}$.

##CY Chú ý
Khi cho trước`],
    [R`**3. Vectơ không**
Vectơ không là`, R`**3. Vectơ không**

##ĐN
Vectơ không là`],
    [R`Cho hai vectơ $\vec{a}$ và $\vec{b}$. Lấy một điểm $A$ tùy ý`, R`##ĐN
Cho hai vectơ $\vec{a}$ và $\vec{b}$. Lấy một điểm $A$ tùy ý`],
    [R`được gọi là phép cộng vectơ.
Quy tắc ba điểm: Với ba điểm`, R`được gọi là phép cộng vectơ.

##TC Quy tắc ba điểm
Với ba điểm`],
    [R`Quy tắc hình bình hành: Nếu`, R`##TC Quy tắc hình bình hành
Nếu`],
    [R`= \vec{AC}$.
Với ba vectơ $\vec{a}, \vec{b}, \vec{c}$ tùy ý:`, R`= \vec{AC}$.

##TC
Với ba vectơ $\vec{a}, \vec{b}, \vec{c}$ tùy ý:`],
    [R`Chú ý: Do các vectơ`, R`##CY Chú ý
Do các vectơ`],
    [R`**5. Hiệu của hai vector**
Vector có cùng độ dài`, R`**5. Hiệu của hai vector**

##ĐN
Vector có cùng độ dài`],
    [R`được coi là vector đối của chính nó.
Cho hai vector`, R`được coi là vector đối của chính nó.

##ĐN
Cho hai vector`],
    [R`kí hiệu $\vec{a} - \vec{b}$.
Chú ý 1: Hai vetơ đối nhau khi và chỉ khi tổng của chúng bằng $\vec{0}$
Quy tắc về hiệu vecto: Với ba điểm`, R`kí hiệu $\vec{a} - \vec{b}$.

##CY Chú ý 1
Hai vetơ đối nhau khi và chỉ khi tổng của chúng bằng $\vec{0}$

##TC Quy tắc về hiệu vecto
Với ba điểm`],
  ],
}

// ── Chạy ────────────────────────────────────────────────────────────────────────────────────────────
import { fileURLToPath } from 'url'
if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const { default: pg } = await import('pg')
  const fs = await import('fs')
  const ghi = process.argv.includes('--ghi')
  const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect()
  const bang = (ma) => (ma.length > 8 ? { t: 'hgt_dang_ly_thuyet', k: 'ma_dang' } : { t: 'hgt_chuyen_de_ly_thuyet', k: 'ma_chuyen_de' })
  const tu = (s) => (s.replace(/##(ĐL|DL|ĐN|DN|TC|CY|PP|VD|NX|BT)/g, ' ').match(/[\p{L}\p{N}]+/gu) || [])
  const moi = {}, cu = {}; let loi = 0
  for (const [ma, ops] of Object.entries(OPS)) {
    const { t, k } = bang(ma)
    const r = (await c.query(`select noi_dung from ${t} where ${k} = $1`, [ma])).rows
    if (r.length !== 1) { console.log('✗', ma, 'không thấy bản ghi'); loi++; continue }
    cu[ma] = r[0].noi_dung
    let s = cu[ma].replace(/[ \t]+\n/g, '\n') // dấu cách thừa CUỐI dòng (file script bị editor tự xoá nên đoạn tìm không khớp)
    if (/^##/m.test(s)) { console.log('✗', ma, 'ĐÃ có kí hiệu — bỏ qua (không gắn chồng)'); loi++; continue }
    for (const [tim, thay] of ops) {
      const n = s.split(tim).length - 1
      if (n !== 1) { console.log('✗', ma, `đoạn tìm xuất hiện ${n} lần:`, JSON.stringify(tim.slice(0, 50))); loi++; continue }
      s = s.replace(tim, () => thay)
    }
    // Nhân chứng: chữ cũ vs chữ mới — chỉ được MẤT nhãn đánh số (I., 1., a), Bước…) / nhãn chuyển lên tag.
    const a = tu(cu[ma]), b = tu(s), dem = (xs) => xs.reduce((m, x) => m.set(x, (m.get(x) || 0) + 1), new Map())
    const da = dem(a), db = dem(b), mat = [], them = []
    for (const [w, n] of da) if ((db.get(w) || 0) < n) mat.push(`${w}×${n - (db.get(w) || 0)}`)
    for (const [w, n] of db) if ((da.get(w) || 0) < n) them.push(`${w}×${n - (da.get(w) || 0)}`)
    moi[ma] = s
    console.log(`• ${ma}: ${ops.length} chỗ · mất [${mat.join(' ')}] · thêm [${them.join(' ')}]`)
  }
  if (loi) { console.log(`\n${loi} lỗi ⇒ KHÔNG ghi gì.`); await c.end(); process.exit(1) }
  const out = process.argv.find((x) => x.startsWith('--xem='))
  if (out) fs.writeFileSync(out.slice(6), Object.entries(moi).map(([m, s]) => `================= ${m}\n${s}`).join('\n'))
  if (!ghi) { console.log('\nXem trước xong (chưa ghi). Thêm --ghi để ghi.'); await c.end(); process.exit(0) }
  const bak = `scripts/data/hgt_lt_truoc_tag_2609.json`
  fs.writeFileSync(bak, JSON.stringify(cu, null, 1))
  await c.query('begin')
  try {
    for (const [ma, s] of Object.entries(moi)) {
      const { t, k } = bang(ma)
      const u = await c.query(`update ${t} set noi_dung = $2, cap_nhat_at = now() where ${k} = $1 and noi_dung = $3`, [ma, s, cu[ma]])
      if (u.rowCount !== 1) throw new Error(`${ma}: nội dung đổi giữa chừng (rowCount ${u.rowCount})`)
    }
    await c.query('commit'); console.log(`\nĐã ghi ${Object.keys(moi).length} bản ghi. Bản cũ: ${bak}`)
  } catch (e) { await c.query('rollback'); console.log('✗ rollback:', e.message); process.exitCode = 1 }
  await c.end()
}
