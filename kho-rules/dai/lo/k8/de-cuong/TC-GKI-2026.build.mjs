// ============================================================================
// TC-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG giữa học kì I Toán 8 (2026–2027) — Trường THCS Thành Công (Hà Nội), Tổ Tự Nhiên
// (PDF 7 trang có lớp chữ nhưng công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi + phóng to chỗ khó; Thùy gửi 19/10)
//
//   node kho-rules/dai/lo/k8/de-cuong/TC-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai_*.png)
//
// Đề KHÔNG ghi "trọng tâm kiến thức". Nội dung: Đại số = đơn thức, đa thức, cộng trừ nhân chia (Chương I; KHÔNG có hằng đẳng thức — mọi bài "Tìm x / rút gọn / không phụ thuộc" làm được bằng nhân đa thức);
// Hình học = tứ giác → hình thang (cân) → hình bình hành → hình chữ nhật → hình thoi (+ vuông ở câu trắc nghiệm).
// Cấu trúc đề: A. Đại số (I trắc nghiệm 10 · II tự luận Bài 1–9) · B. Hình học (I trắc nghiệm 11 · II tự luận Bài 1–12) · C. Một số bài toán khác (Bài 1–4) · "Đề tham khảo" 1 và 2.
// Mỗi phần đánh số lại từ 1 ⇒ nhãn có TIỀN TỐ: "Đại Câu 3", "Hình Bài 2a", "Khác Bài 1", "Đề 1 Bài 3a", "Đề 2 Câu 4" (nhom-bai.mjs đã mở rộng cho tiền tố này).
// Tách ý: chỉ ý có dữ kiện RIÊNG (Đại Bài 1, 2, 4, 6, 7, 8 · Hình Bài 1 (8 hình) · Đề 1 Bài 1 (6 mục), Bài 3 · Đề 2 Bài 2); bài chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TC-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
// tach(phan, kho, tiềnTố, số bài, nhóm trạm, lời dẫn, [[ý, nội dung, cảnh báo?, ảnh?]…])
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb, anh]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), anh: anh ?? [], canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const tn = (phan, kho, pre, so, nhom, nd, o = {}) => ({ phan, kho, nhom, loai: o.loai ?? 'trac_nghiem', nhan: `${pre}Câu ${so}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] })

const PHAN = [
  { thu_tu: 1, ten: 'A1. Đại số — Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'A2. Đại số — Tự luận (Bài 1–9)' },
  { thu_tu: 3, ten: 'B1. Hình học — Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 4, ten: 'B2. Hình học — Tự luận (Bài 1–12)' },
  { thu_tu: 5, ten: 'C. Một số bài toán khác (Bài 1–4)' },
  { thu_tu: 6, ten: 'D. Đề tham khảo 1' },
  { thu_tu: 7, ten: 'E. Đề tham khảo 2' },
]

const CAU = [
  // ══════════ A1. ĐẠI SỐ — TRẮC NGHIỆM ══════════
  tn(1, 'dai', 'Đại ', 1, 1, R`Cho các biểu thức đại số: $13x$; $2xy-x+1$; $4xy^2z^3$; $\sqrt{2x}$; $\dfrac{1}{3xy}$; $\dfrac{-3}{4}xy^2z(-4z)$. Số các đơn thức trong các biểu thức trên là:
A. $6$
B. $5$
C. $4$
D. $3$`),
  tn(1, 'dai', 'Đại ', 2, 1, R`Đơn thức $-xy^2z\left(-\dfrac{1}{5}z\right)$ có phần hệ số là:
A. $1$
B. $-1$
C. $-\dfrac{1}{5}$
D. $\dfrac{1}{5}$`),
  tn(1, 'dai', 'Đại ', 3, 1, R`Thu gọn đơn thức $(1+2\cdot 4{,}5)xy^2\cdot 3x$ ta được kết quả là:
A. $27x^2y^2$
B. $30x^2y^2$
C. $27xy$
D. $28{,}5x^2y^2$`, { cb: [R`Đề in "$(1+2.4,5)$": dấu chấm là dấu nhân ($2\cdot 4{,}5=9$); các phương án ($27,\ 30,\ 28{,}5$) khớp cách đọc này.`] }),
  tn(1, 'dai', 'Đại ', 4, 1, R`Đơn thức không đồng dạng với đơn thức $-2a^2b^3$ là:
A. $-2a^3b^2$
B. $-0{,}5a^2b^3$
C. $\dfrac{9}{4}b^3a^2$
D. $-a^2b^3$`),
  tn(1, 'dai', 'Đại ', 5, 1, R`Bậc của đa thức $5x^2y^3-4+9x^3-12x^2y^2-5x^2y^3+12x^2y^2+0{,}7$ là:
A. $5$
B. $4$
C. $3$
D. $0$`),
  tn(1, 'dai', 'Đại ', 6, 1, R`Đa thức $M=a+3b+ab^2$ và đa thức $N=a^2b-ab^2-2b$ thì kết quả phép tính $M+N$ là:
A. $a+5b-a^2b+2ab^2$
B. $a+5b+2a^2b$
C. $a+b+a^2b$
D. $a-5b+a^2b$`),
  tn(1, 'dai', 'Đại ', 7, 1, R`Đa thức $M=a+3b+ab^2$ và đa thức $N=a^2b-ab^2-2b$ thì kết quả phép tính $M-N$ là:
A. $a+5b-a^2b+2ab^2$
B. $a+5b+2a^2b$
C. $a+b+a^2b$
D. $a-5b+a^2b$`),
  tn(1, 'dai', 'Đại ', 8, 1, R`Kết quả phép tính $\dfrac{-3}{4}xy^2z\cdot(-4z)^2$ là:
A. $3xy^2z$
B. $-3xy^2z^3$
C. $-12xy^2z^3$
D. $-12xy^2z^2$`),
  tn(1, 'dai', 'Đại ', 9, 1, R`Cho đa thức $A=2x^2y^2-5xy^3$ và đơn thức $B=3x^my^2$. Giá trị của số nguyên dương $m$ để đa thức $A$ chia hết cho đơn thức $B$ là:
A. $m\le 2$
B. $m=1$
C. $m=2$
D. $m>2$`),
  tn(1, 'dai', 'Đại ', 10, 1, R`Kết quả phép tính $5(x-y)^3:(y-x)^2$ là:
A. $5$
B. $5(x-y)^2$
C. $5(x-y)$
D. Một kết quả khác`),

  // ══════════ A2. ĐẠI SỐ — TỰ LUẬN ══════════
  ...tach(2, 'dai', 'Đại ', 1, 2, R`Thu gọn đơn thức sau rồi tìm bậc và hệ số:`, [
    ['a', bt(R`-xy(2x^3y^4)\left(\dfrac{-5}{4}x^2y^3\right)`)],
    ['b', bt(R`5xyz\cdot 4x^3y^2(-2x^5y)`), [R`Đề in "5xyz.4x³y²(−2x⁵y)": dấu chấm là dấu nhân.`]],
    ['c', bt(R`-1\dfrac{1}{2}x^3y^2\left(\dfrac{-4}{3}x^2y\right)^2`)],
    ['d', bt(R`\dfrac{2}{3}x^2\cdot\dfrac{1}{4}xy\cdot\left(\dfrac{1}{2}x^3y\right)^3`)]]),
  ...tach(2, 'dai', 'Đại ', 2, 2, R`Thực hiện phép tính:`, [
    ['a', bt(R`18x^7:6x^4`)],
    ['b', bt(R`6x^2y^2z^2:3xy`)],
    ['c', bt(R`5x^2y^2+9x^3y^4:(-3xy^2)`), [R`Đề in KHÔNG có ngoặc quanh $5x^2y^2+9x^3y^4$ (các phép chia khác như g), h) đều có ngoặc). Đã nhập đúng như in: thứ tự phép tính ⇒ chia trước, cộng sau. Nếu đề muốn $(5x^2y^2+9x^3y^4):(-3xy^2)$ thì kết quả khác.`]],
    ['d', bt(R`8x^6y^7z^2:4x^4y^7`)],
    ['e', bt(R`(-xy)^{10}:(-xy)^5`)],
    ['f', bt(R`(5xy-8x^2):x`)],
    ['g', bt(R`(3x^4y^3-9x^2y^2+25xy^2):(xy^2)`)],
    ['h', bt(R`(9x^3y^2-2xy^2+6x^2y):(-3xy)`)],
    ['i', bt(R`\left(5x^5y^4z+\dfrac{1}{2}x^4y^2z^3-2xy^3z^2\right):\left(\dfrac{1}{4}xy^2z\right)`)],
    ['j', bt(R`3x(2xy-5x^2y)`)],
    ['k', bt(R`6x^2y\left(3xy-\dfrac{1}{3}x+\dfrac{1}{2}y-x^2\right)`)],
    ['l', bt(R`-5x^2y^4(3x^2y^3-2x^3y^2-xy)`)],
    ['m', bt(R`(x+y)(x-3y)`)],
    ['n', bt(R`(5x-2)(7x-3)`)],
    ['o', bt(R`(x^2-2x-1)(x-3)`)],
    ['p', bt(R`(x-5)(-x^2+x+1)`)]]),
  ...ca(2, 'dai', 'Đại ', 3, 4, R`Cho biểu thức $A=2(3x+1)(x-1)-3(2x-3)(x-4)$.
a) Rút gọn biểu thức $A$.
b) Tính giá trị của $A$ tại $x=-2$.
c) Tìm $x$ để $A=0$.`),
  ...tach(2, 'dai', 'Đại ', 4, 4, R`Tính giá trị của biểu thức sau:`, [
    ['a', R`$B=(x+1)(x^2+2x+4)-x^2(x+3)$ tại $x=\dfrac{-10}{3}$.`],
    ['b', R`$C=6x(2x-7)-(3x-5)(4x+7)$ tại $x=-2$.`],
    ['c', R`$M=15x^5y^3:10xy^2$ tại $x=-3;\ y=\dfrac{2}{3}$.`],
    ['d', R`$N=-(x^3y^5z^2):(-x^2y^3z)$ tại $x=1;\ y=-1;\ z=100$.`],
    ['e', R`$P=(-x^3y)^5:(-x^{12}y^2)$ tại $x=2;\ y=\dfrac{-1}{2}$.`]]),
  ...ca(2, 'dai', 'Đại ', 5, 4, R`Cho hai đa thức $E=3xyz-3x^2+5xy-1$ và $F=5x^2+xyz-5xy+3-y$. Tính $E+F$; $E-F$; $F-E$.`),
  ...tach(2, 'dai', 'Đại ', 6, 4, R`Tìm $x$, biết:`, [
    ['a', bt(R`x(2x-7)-2x(x+1)=7`)],
    ['b', bt(R`3x(x+8)-x^2-2x(x+1)=2`)],
    ['c', bt(R`4x(x-5)-(x-1)(4x-3)=5`)],
    ['d', bt(R`(3x-4)(x-2)=3x(x-9)-3`)],
    ['e', bt(R`(x-5)(x-4)-(x+1)(x-2)=7`)],
    ['f', bt(R`2x^3-50x=0`)]]),
  ...tach(2, 'dai', 'Đại ', 7, 5, R`Chứng minh rằng giá trị của biểu thức sau không phụ thuộc vào giá trị của biến:`, [
    ['a', bt(R`5x^2-(2x+1)(x-2)-x(3x+3)+7`)],
    ['b', bt(R`(3x-1)(2x+3)-(x-5)(6x-1)-38x`)],
    ['c', bt(R`(5x-2)(x+1)-(x-3)(5x+1)-17(x-2)`)],
    ['d', bt(R`x(5x-3)-x^2(x-1)+x(x^2-6x)-10+3x`)]]),
  ...tach(2, 'dai', 'Đại ', 8, 5, '', [
    ['a', R`Tìm $a$ sao cho đa thức $f(x)=x^4-x^3+6x^2-x+a$ chia hết cho đa thức $g(x)=x^2-x+5$.`],
    ['b', R`Tìm $a,\ b$ sao cho $f(x)=ax^3+bx^2+10x-4$ chia hết cho đa thức $g(x)=x^2+x-2$.`]]),
  ...ca(2, 'dai', 'Đại ', 9, 5, R`Tìm giá trị nguyên của $n$ để giá trị biểu thức $2n^3+n^2+2n+4$ chia hết cho giá trị của biểu thức $2n+1$.`),

  // ══════════ B1. HÌNH HỌC — TRẮC NGHIỆM ══════════
  tn(3, 'hinh_hoc', 'Hình ', 1, 6, R`Tứ giác $ABCD$ có $\widehat{A}=60^\circ$, $\widehat{B}=80^\circ$, $\widehat{C}=110^\circ$. Số đo góc ngoài tại đỉnh $D$ bằng:
A. $70^\circ$
B. $110^\circ$
C. $80^\circ$
D. Một kết quả khác.`),
  tn(3, 'hinh_hoc', 'Hình ', 2, 6, R`Hình thang $ABCD$ ($AB\parallel CD$) có $\widehat{A}=100^\circ$, $\widehat{B}=120^\circ$. Số đo của góc $C$ bằng:
A. $80^\circ$
B. $100^\circ$
C. $120^\circ$
D. $60^\circ$`),
  tn(3, 'hinh_hoc', 'Hình ', 3, 6, R`Hình thang $ABCD$ ($AB\parallel CD$) có $\widehat{B}-\widehat{C}=20^\circ$. Số đo góc $C$ bằng:
A. $80^\circ$
B. $100^\circ$
C. $60^\circ$
D. Một kết quả khác.`),
  tn(3, 'hinh_hoc', 'Hình ', 4, 6, R`Hình thang cân $ABCD$ ($AB\parallel CD$) có $\widehat{A}=100^\circ$. Số đo góc $C$ bằng:
A. $100^\circ$
B. $80^\circ$
C. $70^\circ$
D. $120^\circ$.`),
  tn(3, 'hinh_hoc', 'Hình ', 5, 6, R`Hình bình hành $ABCD$ có $\widehat{A}+\widehat{C}=100^\circ$. Số đo của góc $B$ bằng:
A. $100^\circ$
B. $130^\circ$
C. $150^\circ$
D. $50^\circ$`),
  tn(3, 'hinh_hoc', 'Hình ', 6, 6, R`Hình thang $ABCD$ ($AB\parallel CD$) có $AB=BC$. Ta có được:
A. $AC$ là tia phân giác $\widehat{BAD}$
B. $BD$ là tia phân giác $\widehat{ABC}$
C. $CA$ là tia phân giác $\widehat{BCD}$
D. $DB$ là tia phân giác $\widehat{ADC}$`),
  tn(3, 'hinh_hoc', 'Hình ', 7, 6, R`Tìm khẳng định sai:
A. Hình bình hành có một góc vuông là hình chữ nhật
B. Hình thang cân có một góc vuông là hình chữ nhật
C. Hình thang cân có hai đường chéo bằng nhau là hình chữ nhật
D. Hình bình hành có hai đường chéo bằng nhau là hình chữ nhật.`),
  tn(3, 'hinh_hoc', 'Hình ', 8, 6, R`Cho tam giác $MNP$ có $MN=12$ cm, $MP=5$ cm, $PN=13$ cm, $MI$ là đường trung tuyến. Độ dài đoạn thẳng $MI$ bằng:
A. $6{,}5$ cm
B. $2{,}5$ cm
C. $6$ cm
D. Một kết quả khác.`),
  tn(3, 'hinh_hoc', 'Hình ', 9, 6, R`Tìm câu sai:
A. Hình vuông là tứ giác có bốn góc vuông và có bốn cạnh bằng nhau
B. Hình bình hành là tứ giác có các cạnh đối song song
C. Hình thoi là tứ giác có bốn góc vuông
D. Hình thang cân là hình thang có hai góc kề một đáy bằng nhau.`),
  tn(3, 'hinh_hoc', 'Hình ', 10, 6, R`Hình thang $MNPQ$ (đáy $MN$ và $PQ$) có $NP\parallel MQ$ là hình gì?
A. Hình thang
B. Hình thang cân
C. Hình bình hành
D. Hình chữ nhật`),
  tn(3, 'hinh_hoc', 'Hình ', 11, 6, R`Hình bình hành $ABCD$ là hình chữ nhật khi:
A. $AB=AD$
B. $\widehat{A}=90^\circ$
C. $AB=2AC$
D. $\widehat{A}=\widehat{C}$`),

  // ══════════ B2. HÌNH HỌC — TỰ LUẬN ══════════
  // Bài 1: bốn + bốn hình (hai hàng ở trang 3 và 4) — mỗi hình một câu
  ...tach(4, 'hinh_hoc', 'Hình ', 1, 7, R`Quan sát hình vẽ:`, [
    ['a', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: tứ giác $ABCD$ có đường chéo $BD$; hai góc $\widehat{ABD}$ và $\widehat{BDC}$ được đánh dấu bằng nhau (hai cung tô xám).`], ['de_bai_h1a.png']],
    ['b', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: $D,\ C$ ở trên, $A,\ B$ nằm trên một đường thẳng nằm ngang phía dưới; $AD=BC$ (hai nét gạch bằng nhau); góc tạo bởi $AD$ và tia đối của tia $AB$ bằng $80^\circ$; góc tạo bởi $BC$ và tia kéo dài của $AB$ về phía $B$ bằng $100^\circ$ (tức $\widehat{DAB}=100^\circ$, $\widehat{ABC}=80^\circ$).`], ['de_bai_h1b.png']],
    ['c', R`tứ giác $MNPQ$ là hình gì, vì sao?`, [R`Đọc hình: $\widehat{QMN}=115^\circ$, $\widehat{MNP}=65^\circ$, $\widehat{MQP}=65^\circ$.`], ['de_bai_h1c.png']],
    ['d', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: hai đường chéo $AC,\ BD$ cắt nhau tại $O$; các số ghi trên hình là $OA=4,\ OB=2,\ OD=3,\ OC=4$.`, R`CHƯA CHẮC — đề không nói các số 4, 2, 3, 4 là độ dài đoạn nào (đọc là $OA,\ OB,\ OD,\ OC$ theo vị trí số trên hình); nếu đúng thì $OB\neq OD$ nên $ABCD$ không phải hình bình hành.`], ['de_bai_h1d.png']],
    ['e', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: $AB=CD$ (hai nét gạch đôi), $AD=BC$ (hai nét gạch đơn), góc vuông ở $D$.`], ['de_bai_h1e.png']],
    ['f', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: hai đường chéo cắt nhau tại $O$; $OA=OC$ (gạch đơn), $OB=OD$ (gạch đôi); $AC\perp BD$ tại $O$ (góc vuông ở $O$).`], ['de_bai_h1f.png']],
    ['g', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: bốn đỉnh $A,\ B,\ C,\ D$ nằm trên một đường tròn tâm $O$; hai đường chéo $AC,\ BD$ cùng đi qua $O$.`], ['de_bai_h1g.png']],
    ['h', R`tứ giác $ABCD$ là hình gì, vì sao?`, [R`Đọc hình: hai đường chéo cắt nhau tại $O$; $\widehat{BAC}=\widehat{CAD}=\widehat{ACD}$ (ba cung có gạch); $\widehat{ABD}=\widehat{ADB}$ (hai cung tô xám).`, R`CHƯA CHẮC — cách đọc các dấu góc trên hình (đặc biệt hai cung tô xám ở $B$ và $D$: bằng nhau hay góc vuông); đã đọc theo hình dạng thấy trên bản scan.`], ['de_bai_h1h.png']]]),
  ...ca(4, 'hinh_hoc', 'Hình ', 2, 8, R`Cho hình bình hành $ABCD$. Gọi $E$ là trung điểm của $AB$, $F$ là trung điểm của $CD$.
a) Chứng minh: Tứ giác $AECF$ là hình bình hành.
b) $AF$ cắt $DE$ tại $M$, $BF$ cắt $CE$ tại $N$. Chứng minh: Tứ giác $EMFN$ là hình bình hành.
c) Chứng minh: $AC,\ EF,\ MN$ đồng quy.
d) Tìm điều kiện của hình bình hành $ABCD$ để tứ giác $AECF$ là hình thoi.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 3, 8, R`Cho hình bình hành $ABCD$, đường phân giác của góc $ADC$ cắt $AB$ tại $M$, phân giác của góc $ABC$ cắt $CD$ tại $N$. Chứng minh:
a) $AM=AD$.
b) Tứ giác $MBND$ là hình bình hành.
c) $AC$ đi qua trung điểm $O$ của $MN$.
d) Tứ giác $ANCM$ là hình bình hành.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 4, 8, R`Cho hình thang $ABCD$ ($AB\parallel CD$), $AB=2CD$. Hai tia $AD$ và $BC$ cắt nhau tại $I$. Gọi $M,\ N$ lần lượt là trung điểm của $AB,\ CD$. Chứng minh:
a) Các tứ giác $ADCM,\ BCDM,\ CIDM$ là hình bình hành.
b) Ba điểm $M,\ N,\ I$ thẳng hàng.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 5, 8, R`Cho hình bình hành $ABCD$. Hạ $AH$ và $CK$ vuông góc với $BD$ ($H,\ K$ thuộc $BD$).
a) Chứng minh: $\triangle AHD=\triangle CKB$.
b) Tứ giác $AHCK$ là hình bình hành.
c) $AH$ cắt $CD$ tại $M$, $CK$ cắt $AB$ tại $N$. Chứng minh: Tứ giác $AMCN$ là hình bình hành.
d) Chứng minh: $AC,\ BD,\ MN$ đồng quy.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 6, 9, R`Cho $\triangle ABC$ vuông cân tại $A$, trung tuyến $AM$. Gọi $I$ là trung điểm $AC$, trên tia $MI$ lấy $K$ sao cho $I$ là trung điểm $MK$. Chứng minh:
a) Tứ giác $AMCK$ là hình bình hành.
b) Tứ giác $AMCK$ là hình thoi.
c) Tứ giác $ABMK$ là hình bình hành.
d) Trên tia đối của tia $MA$ lấy điểm $E$ sao cho $ME=MA$. Chứng minh tứ giác $ABEC$ là hình thoi.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 7, 9, R`Cho hình bình hành $ABCD$. Lấy $K,\ E$ trên đường chéo $BD$ sao cho $DK=BE$ ($K$ nằm giữa $D$ và $E$).
a) Chứng minh $\triangle ADK=\triangle CBE$.
b) Chứng minh: Tứ giác $AKCE$ là hình bình hành.
c) Đường thẳng $AK$ cắt cạnh $CD$ tại $M$, đường thẳng $CE$ cắt cạnh $AB$ tại $N$, $AC$ cắt $BD$ tại $O$. Chứng minh: $3$ điểm $M,\ O,\ N$ thẳng hàng.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 8, 9, R`Cho hình chữ nhật $ABCD$, hai đường chéo $AC$ cắt $BD$ tại $O$. Lấy điểm $M$ bất kì trên đoạn $CD$, $MO$ cắt $AB$ tại $N$.
a) Chứng minh tứ giác $BNDM$ là hình bình hành.
b) Qua $M$ kẻ đường thẳng song song với $AC$ cắt $AD$ tại $E$, qua $N$ kẻ đường thẳng song song với $AC$ cắt $BC$ ở $F$. Chứng minh $O$ là trung điểm $EF$.
c) Chứng minh: $3$ đường thẳng $AC,\ MN,\ EF$ đồng quy.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 9, 9, R`Cho hình bình hành $ABCD$. Gọi $E,\ F$ theo thứ tự là trung điểm của $AB$ và $CD$.
a) Chứng minh: $AF\parallel CE$.
b) Gọi $M,\ N$ theo thứ tự là giao điểm của $BD$ với $AF$ và $CE$. Chứng minh: $DM=MN=NB$.
c) Chứng minh: $AC,\ BD,\ EF$ đồng quy.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 10, 10, R`Cho $\triangle ABC$ vuông tại $A$ có $AB<AC$. Gọi $M$ là trung điểm của $BC$. Trên tia đối của tia $MA$ lấy điểm $D$ sao cho $MD=MA$.
a) Chứng minh: tứ giác $ABCD$ là hình chữ nhật.
b) Lấy điểm $E$ sao cho $B$ là trung điểm của $AE$. Chứng minh: $BEDC$ là hình bình hành.
c) $EM$ cắt $BD$ tại $K$. Chứng minh $EK=2KM$.`, { cb: [R`Ý a) đề in "tứ giác $ABCD$" nhưng với $D$ đối xứng $A$ qua $M$ thì hình chữ nhật là $ABDC$ (thứ tự đỉnh $A,\ B,\ D,\ C$); $ABCD$ theo thứ tự in là tứ giác tự cắt. Lời giải gọi đúng tên $ABDC$ và nói rõ.`] }),
  ...ca(4, 'hinh_hoc', 'Hình ', 11, 10, R`Cho tam giác $ABC$ có ba góc nhọn, đường cao $AH$. Trên cạnh $AC$ lấy trung điểm $I$. Trên tia đối của tia $IH$ lấy điểm $E$ sao cho $IE=IH$.
a) Chứng minh: tứ giác $AHCE$ là hình chữ nhật;
b) Gọi $M$ là trung điểm của đoạn $HC$. Đoạn thẳng $AM$ cắt đoạn thẳng $HE$ tại $G$. Chứng minh: $G$ là trọng tâm của tam giác $AHC$.
c) Lấy $N$ là trung điểm của $EC$. Đoạn thẳng $AN$ cắt đoạn thẳng $HE$ tại $K$. Chứng minh: $GK=\dfrac{1}{3}AC$ và tứ giác $AKCG$ là hình bình hành.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 12, 10, R`Cho tam giác $ABC$ vuông tại $A$. Gọi $M$ là trung điểm của $BC$. Từ $M$ kẻ $MD,\ ME$ lần lượt vuông góc với $AB,\ AC$ ($D$ thuộc $AB$ và $E$ thuộc $AC$).
a) Chứng minh tứ giác $ADME$ là hình chữ nhật và $DE=\dfrac{1}{2}BC$.
b) Gọi $P$ là trung điểm của $BM$ và $Q$ là trung điểm của $MC$. Chứng minh $DP$ song song với $QE$.
c) Tam giác vuông $ABC$ cần thêm điều kiện gì để tứ giác $DPQE$ là hình chữ nhật.`),

  // ══════════ C. MỘT SỐ BÀI TOÁN KHÁC ══════════
  ...ca(5, 'dai', 'Khác ', 1, 10, R`Trên mảnh đất hình chữ nhật $MNPQ$, bác An đã sử dụng phần đất được tô đậm như hình bên để trồng cây. Các kích thước (tính theo mét) được ghi trên đó. Hãy viết biểu thức đại số với hai biến $x,\ y$ biểu thị:
a) Diện tích mảnh đất hình chữ nhật $MNKI$.
b) Diện tích mảnh đất hình chữ nhật $HGKP$.
c) Diện tích của mảnh đất không trồng cây.`, { anh: ['de_bai_c1.png'], cb: [R`Đọc hình: $MN=4y$, $MI=2x$, $KP=x$, $HP=y$; phần tô đậm là hai hình chữ nhật $MNKI$ và $HGKP$.`] }),
  ...ca(5, 'dai', 'Khác ', 2, 10, R`Một miếng đất hình chữ nhật được chia thành ba phần như hình vẽ: phần nhà ở là hình chữ nhật, phần vườn hoa là hình vuông cạnh $4$ m, phần trồng rau là hình chữ nhật có diện tích $70\ \text{m}^2$ và chiều rộng là $3{,}5$ m. Tính diện tích phần nhà ở?`, { anh: ['de_bai_c2.png'] }),
  ...ca(5, 'dai', 'Khác ', 3, 10, R`Cô Hằng dự định mua $x$ hộp sữa, mỗi hộp có giá $y$ đồng. Khi đến cửa hàng, cô Hằng thấy giá sữa đã giảm $2\,000$ đồng mỗi hộp nên quyết định mua thêm $3$ hộp sữa nữa.
a) Viết đa thức biểu thị số tiền cô Hằng dự định mua sữa.
b) Viết đa thức biểu thị số tiền cô Hằng mua sữa theo thực tế.
c) Nếu $y=10\,000$ đồng và số tiền mua sữa thực tế bằng dự định thì cô Hằng đã dự định mua bao nhiêu hộp sữa?`),
  ...ca(5, 'dai', 'Khác ', 4, 10, R`Trên một dòng sông, để đi được $10$ km, một chiếc xuồng tiêu tốn $a$ lít dầu khi đi xuôi dòng và tiêu tốn $(a+2)$ lít dầu khi đi ngược dòng. Viết biểu thức biểu thị số lít dầu mà xuồng tiêu tốn khi đi xuôi dòng từ bến $A$ đến bến $B$, rồi quay lại bến $A$. Biết khoảng cách giữa hai bến là $b$ km.`),

  // ══════════ D. ĐỀ THAM KHẢO 1 ══════════
  ...tach(6, 'dai', 'Đề 1 ', 1, 11, R`Điền kết quả đúng:`, [
    ['a', R`Đơn thức $-2x^2\left(\dfrac{-1}{6}\right)x$ có kết quả thu gọn là: ……`],
    ['b', R`Kết quả phép tính $\left(x^3y^3-\dfrac{1}{2}x^2y^3-x^3y^2\right):\dfrac{1}{3}x^2y^2$ là: ……`],
    ['c', R`Điều kiện của số tự nhiên $n$ để đơn thức $M=5x^2y^4$ chia hết cho đơn thức $N=-3x^{3n}y^3$ là: ……`],
    ['d', R`Hình thang cân $ABCD$ ($AB\parallel CD$) có $\widehat{A}=100^\circ$ thì $\widehat{B},\ \widehat{C},\ \widehat{D}$ lần lượt bằng: ……`],
    ['e', R`Hình thoi có chu vi bằng $15$ cm thì cạnh hình thoi bằng: ……`],
    ['f', R`$\triangle MNP$ có $E$ là trung điểm $MN$ và $2\cdot EP=MN$ thì tam giác $MNP$ vuông tại: ……`]]),
  ...ca(6, 'dai', 'Đề 1 ', 2, 11, R`Cho biểu thức $A=-5(x^2-1)+x(2x-y)-xy$ và biểu thức $B=x^2+2xy-9$.
a) Rút gọn biểu thức $A$.
b) Tính giá trị của biểu thức $B$ tại $x=-0{,}5$ và $x+y=-1{,}5$.
c) Tìm biểu thức $C$ biết $C=A+B$.
d) Chứng minh biểu thức $C$ luôn nhận giá trị âm với mọi giá trị của biến $x$.`),
  ...tach(6, 'dai', 'Đề 1 ', 3, 11, R`Tìm $x$, biết:`, [
    ['a', bt(R`x+2(x+3)=-7`)],
    ['b', bt(R`x^3-2x^2+1\dfrac{1}{3}+4x^2-x^3-1\dfrac{1}{3}=0`)],
    ['c', bt(R`2x(x-5)-(x-1)(3+2x)=26`), [R`Đề in nhãn "b)" hai lần (ý thứ ba bị đánh nhầm b) thay vì c)); nhập thành ý c).`]],
    ['d', bt(R`(2x-5)(1{,}75+x)(x^2+1)=0`)]]),
  ...ca(6, 'hinh_hoc', 'Đề 1 ', 4, 12, R`Cho hình vẽ:
a) Chứng minh tứ giác $ABCD$ là hình bình hành.
b) Cho $AD=3{,}5$ cm và $AB=2\cdot AD$. Tính chu vi hình bình hành $ABCD$.`, { anh: ['de_bai_dt1b4.png'], cb: [R`Đọc hình: $E$ nằm trên tia $DA$ kéo dài qua $A$; ba góc được đánh dấu bằng một cung: $\widehat{EAB},\ \widehat{ABC},\ \widehat{ADC}$ (cùng dấu ⇒ bằng nhau).`] }),
  ...ca(6, 'hinh_hoc', 'Đề 1 ', 5, 12, R`Cho tam giác $ABC$ cân tại $A$, có $AM$ là đường trung tuyến. Lấy $N$ là trung điểm $AC$. Trên tia đối của tia $NM$ lấy điểm $P$ sao cho $NP=NM$.
a) Chứng minh: Tứ giác $AMCP$ là hình chữ nhật.
b) Chứng minh: $AB\parallel MP$.
c) Lấy $D$ là trung điểm $MC$ và $K$ là trung điểm $CP$. Biết $AD$ và $AK$ lần lượt giao với $MP$ tại $E$ và $G$. Chứng minh: $ME=EG=GP$.`),
  ...ca(6, 'dai', 'Đề 1 ', 6, 12, R`Xác định các hệ số $a,\ b$ để đa thức $A=x^3+5x^2+ax+b$ chia cho $x-2$ dư $3$; chia cho $x+2$ dư $-5$.`),

  // ══════════ E. ĐỀ THAM KHẢO 2 ══════════
  tn(7, 'dai', 'Đề 2 ', 1, 12, R`Đơn thức $7x^2y^3$ có bậc là ……`, { loai: 'tu_luan' }),
  tn(7, 'dai', 'Đề 2 ', 2, 12, R`Nhân hai đơn thức $-5x^2y^3$ và $-4y^2$ có kết quả là ……`, { loai: 'tu_luan' }),
  tn(7, 'dai', 'Đề 2 ', 3, 12, R`Kết quả phép tính $\left(12x^4y^3-\dfrac{1}{4}x^3y^2\right):2x^2y^2$ là ……`, { loai: 'tu_luan' }),
  tn(7, 'hinh_hoc', 'Đề 2 ', 4, 12, R`Hình thang cân $ABCD$ ($AB\parallel CD$) có $\widehat{C}=110^\circ$ thì $\widehat{D}$ bằng ……`, { loai: 'tu_luan' }),
  tn(7, 'hinh_hoc', 'Đề 2 ', 5, 12, R`Hình thoi có chu vi bằng $18$ cm thì cạnh hình thoi bằng ……`, { loai: 'tu_luan' }),
  tn(7, 'hinh_hoc', 'Đề 2 ', 6, 12, R`Hình chữ nhật $ABCD$ có hai đường chéo cắt nhau tại $O$, nếu $OB=5$ cm thì $AC$ bằng ……`, { loai: 'tu_luan' }),
  ...tach(7, 'dai', 'Đề 2 ', 1, 13, '', [
    ['a', R`Thu gọn biểu thức $B=3xy^2+2x^2y+7xy^2-5-6x^2y+4xy$.`],
    ['b', R`Cho hai đa thức $M=5xy^2+3x^2y-\dfrac{3}{4}xy+6$ và $N=4xy^2-3x^2y-5xy+8$.
a) Tính tổng $M+N$.
b) Tìm đa thức $P$ biết $M-P=N$.`, [R`Phần 2 của Bài 1 (hai ý a, b dùng chung $M,\ N$) — nhập thành MỘT câu; nhãn "1b" ở đây nghĩa là "phần 2 của Bài 1".`]]]),
  ...tach(7, 'dai', 'Đề 2 ', 2, 13, R`Tìm $x$, biết:`, [
    ['a', bt(R`2x+7+4x=-11`)],
    ['b', bt(R`3x^2-8+6x-5x^2-2x+3x^2-4x=17`)],
    ['c', bt(R`5x(x-7)-(x-3)(4+5x)=21`)]]),
  ...tach(7, 'hinh_hoc', 'Đề 2 ', 3, 13, R`Cho hình vẽ.`, [
    ['a', R`Tìm số đo $x,\ y$ trong hình.`, [R`Đọc hình (Hình 1): tứ giác $MNPQ$ có $\widehat{M}=\widehat{P}=90^\circ$ (hai góc vuông); $Nn$ là tia kéo dài của $MN$ về phía $N$, góc $\widehat{PNn}=107^\circ$; $y=\widehat{MNP}$ (góc trong tại $N$), $x=\widehat{MQP}$ (góc tại $Q$).`], ['de_bai_dt2b3h1.png']],
    ['b', R`Chứng minh: Tứ giác $ABCD$ là hình thoi.`, [R`Đọc hình (Hình 2): $\widehat{B}=\widehat{D}$ (hai cung đơn), $\widehat{A}=\widehat{C}$ (hai cung đôi), $BC=CD$ (hai nét gạch).`], ['de_bai_dt2b3h2.png']]]),
  ...ca(7, 'hinh_hoc', 'Đề 2 ', 4, 13, R`Cho hình bình hành $MNPQ$, điểm $A$ và điểm $B$ lần lượt là trung điểm $MN,\ PQ$.
a) Chứng minh: Tứ giác $ANBQ$ là hình bình hành.
b) Chứng minh: $MB$ song song với $AP$.
c) Gọi $D$ là giao của $MB$ và $AQ$, $E$ là giao của $NB$ và $AP$. Tìm điều kiện của hình bình hành $MNPQ$ để tứ giác $AEBD$ là hình thoi.`),
  ...ca(7, 'dai', 'Đề 2 ', 5, 13, R`Tìm $x,\ y,\ z$ thỏa mãn $2x^2+2y^2+z^2+25-6y-2xy-8x+2z(y-x)=0$.`),
]

// Chia 13 trạm soạn theo nhãn (cân khoảng ≤ 11 câu / trạm; bài hình tách riêng vì phải vẽ hình giải)
const nhomCua = (nhan) => {
  const m = nhan.match(/^(Đại|Hình|Khác|Đề \d) (Bài|Câu) (\d+)([a-z]?)$/)
  const [, pt, loai, so, y] = m
  const n = +so
  if (pt === 'Đại' && loai === 'Câu') return 1
  if (pt === 'Đại') {
    if (n === 1 || (n === 2 && y <= 'f')) return 2
    if (n === 2) return 3
    if (n === 3 || n === 4 || n === 5 || (n === 6 && y <= 'c')) return 4
    return 5
  }
  if (pt === 'Hình' && loai === 'Câu') return 6
  if (pt === 'Hình') return n === 1 ? 7 : n <= 5 ? 8 : n <= 9 ? 9 : 10
  if (pt === 'Khác') return 10
  if (pt === 'Đề 1') return n <= 3 ? 11 : 12
  if (pt === 'Đề 2') return loai === 'Câu' ? 12 : 13
}
for (const q of CAU) q.nhom = nhomCua(q.nhan)

dung({
  MA: 'TC-GKI-2026',
  TEN: 'Đề cương giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Thành Công, Hà Nội',
  NGUON: 'Trường THCS Thành Công',
  FILE: 'De-cuong-giua-ki-1-Toan-8-Thanh-Cong-2026.pdf',
  PHAN, CAU, LV, HERE,
})
