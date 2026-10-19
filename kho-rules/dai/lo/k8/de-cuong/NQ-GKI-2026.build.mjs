// ============================================================================
// NQ-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa học kì I Toán 8 (2026–2027) — Trường THCS Ngô Quyền (Hà Nội)
// (PDF 3 trang bản scan Thùy gửi 19/10: "HƯỚNG DẪN ÔN TẬP GIỮA HỌC KÌ I – KHỐI 8", trang 1 là lịch kiểm tra, trang 2–3 là Toán) → de.json (khung) + tệp khung từng trạm.
//
//   node kho-rules/dai/lo/k8/de-cuong/NQ-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai_d4b2.png)
//
// Trọng tâm KIẾN THỨC (đề ghi): Đại số = đơn thức – đa thức; cộng, trừ, nhân, chia đơn thức – đa thức; hằng đẳng thức đáng nhớ **hết bài 6**
// (KNTT 8: bài 6 = hiệu hai bình phương, bình phương của một tổng / hiệu — CHƯA có lập phương); Hình học = tứ giác: hình thang, hình thang cân, hình bình hành, hình chữ nhật, hình thoi, hình vuông.
// Đề gồm 8 câu TRẮC NGHIỆM + 6 "dạng" tự luận (đánh số Bài lại trong từng dạng). Ở đây đánh số Bài liên tục theo thứ tự in:
//   Bài 1 = Dạng 1 Bài 1 (A, B) · Bài 2 = Dạng 1 Bài 2 · Bài 3 = Dạng 2 Bài 1 (A–E) · Bài 4 = Dạng 3 Bài 1 (a, b) · Bài 5 = Dạng 4 Bài 1 · Bài 6 = Dạng 4 Bài 2 · Bài 7 = Dạng 5 Bài 1 (hình) · Bài 8 = Dạng 6.
// Tách ý: chỉ ý có dữ kiện RIÊNG (Bài 1, 3, 4); bài chung dữ kiện / hình ⇒ giữ cả bài.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NQ-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const tn = (kho, so, nd) => ({ phan: 1, kho, nhom: 1, loai: 'trac_nghiem', nhan: `Câu ${so}`, noi_dung: nd, canh_bao: [] })

const PHAN = [
  { thu_tu: 1, ten: 'A. Phần trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'B. Phần tự luận — Đại số (Dạng 1, 2, 3, 4, 6)' },
  { thu_tu: 3, ten: 'C. Phần tự luận — Hình học tổng hợp (Dạng 5)' },
]

const CAU = [
  // ── A. TRẮC NGHIỆM ──
  tn('dai', 1, R`Biểu thức nào là đơn thức trong các biểu thức sau?
A. $x^2+y$
B. $5-7xy^2$
C. $-3x^2$
D. $5\sqrt{x}$`),
  tn('dai', 2, R`Cho các biểu thức $2x+y+x^2y$; $-3xy^2z^3+\dfrac{1}{2}x^2y^2z$; $\dfrac{x+y}{x-y}$. Có bao nhiêu đa thức trong các biểu thức trên?
A. $0$
B. $1$
C. $2$
D. $3$`),
  tn('dai', 3, R`Cho đa thức $P=5xy-25$ và $Q=30-5xy+y$. Khi đó:
A. $P+Q=5+y$
B. $P+Q=y$
C. $Q+P=5$
D. $P+Q=-5+y$`),
  tn('dai', 4, R`Giá trị của đa thức $x^3y-14y^3-6xy^2+y+2$ tại $x=-1$; $y=0{,}5$ là:
A. $1$
B. $0{,}75$
C. $2{,}5$
D. $1{,}75$`),
  tn('hinh_hoc', 5, R`Tứ giác $ABCD$ có $\widehat{A}=100^\circ$, $\widehat{B}=55^\circ$, $\widehat{C}=80^\circ$. Số đo góc $D$ là:
A. $90^\circ$
B. $110^\circ$
C. $63^\circ$
D. $125^\circ$`),
  tn('hinh_hoc', 6, R`Cho hình thang cân $ABCD$ ($AB\parallel CD$) có $\widehat{A}=120^\circ$. Số đo của góc $C$ là:
A. $100^\circ$
B. $60^\circ$
C. $80^\circ$
D. $120^\circ$`),
  tn('hinh_hoc', 7, R`Phát biểu nào sau đây sai?
A. Hình thang có hai góc kề một đáy bằng nhau là hình thang cân
B. Tổng hai góc đối của hình thang cân bằng $180^\circ$
C. Hình thang có hai đường chéo bằng nhau là hình thang cân
D. Hình thang có hai cạnh bên bằng nhau là hình thang cân`),
  tn('hinh_hoc', 8, R`Dấu hiệu nào nhận biết được hình thoi?
A. Tứ giác có hai đường chéo vuông góc
B. Hình bình hành có 2 cạnh kề bằng nhau
C. Hình bình hành có hai đường chéo bằng nhau
D. Tứ giác có hai đường chéo cắt nhau tại trung điểm mỗi đường`),

  // ── B. TỰ LUẬN — ĐẠI SỐ ──
  ...tach(2, 'dai', 1, 2, R`Thu gọn và tìm bậc, chỉ rõ phần hệ số và phần biến của đơn thức sau:`, [
    ['a', bt(R`A=5x^2y^3\cdot(-3xy^2z)`)],
    ['b', bt(R`B=-\dfrac{2}{3}x^2y\cdot(3xy^3)^2`)]]),
  ...ca(2, 'dai', 2, 2, R`Cho đa thức $P=3x^2y-5xy+2-3x^2y+7xy-x^3$.
a) Thu gọn đa thức $P$ và xác định bậc của $P$.
b) Tính giá trị của đa thức $P$ tại $x=1,\ y=-2$.`),
  ...tach(2, 'dai', 3, 2, R`Thực hiện phép tính (rút gọn biểu thức):`, [
    ['a', bt(R`A=2x(x^2-3x+1)-x^2(2x-1)`)],
    ['b', bt(R`B=(2x-3)(x+4)-(2x+5)(x-2)`)],
    ['c', bt(R`C=(15x^3y^2-10x^2y^3+5x^2y^2):(5x^2y^2)`)],
    ['d', bt(R`D=(2x+3y)^2-(2x-3y)^2`)],
    ['e', bt(R`E=(x+2)(x^2-2x+5)-x(x-1)^2`)]]),
  ...tach(2, 'dai', 4, 3, R`Tìm $x$, biết:`, [
    ['a', bt(R`(x-2)^2-x(x+3)=16`)],
    ['b', bt(R`(x+3)(x^2-3x+1)-x(x-2)(x+2)=31`)]]),
  ...ca(2, 'dai', 5, 3, R`Một bức tường hình chữ nhật được trang trí bởi hai tấm giấy dán tường hình chữ nhật có cùng chiều cao $3x$ (m) và có diện tích lần lượt là $6x^2$ ($\text{m}^2$) và $7xy$ ($\text{m}^2$). Viết biểu thức tính chiều rộng của bức tường.`),
  ...ca(2, 'dai', 6, 3, R`Khu vườn của nhà bác Xuân có dạng hình vuông (hình vẽ bên). Bác Xuân muốn dành một mảnh đất có dạng hình chữ nhật ở góc khu vườn để trồng rau (hình vẽ). Biết diện tích của mảnh đất trồng rau bằng $150\ \text{m}^2$. Tính độ dài cạnh $x$ (m) của khu vườn đó.`,
    { anh: ['de_bai_d4b2.png'], cb: [R`Hình trong đề cương ghi đơn vị "(cm)" ở các số đo $15,\ 10,\ x$, còn lời đề ghi $150\ \text{m}^2$ và $x$ (m) ⇒ nhập theo lời đề (mét); coi các số đo $15,\ 10$ trên hình cũng tính bằng mét. Mảnh đất trồng rau là hình chữ nhật ở góc trên bên phải, cách cạnh trái khu vườn $15$ m và cách cạnh đáy $10$ m.`] }),

  // ── C. HÌNH HỌC (không tách ý — k8.md §10) ──
  ...ca(3, 'hinh_hoc', 7, 4, R`Cho tam giác $ABC$ có ba góc nhọn và $AB<AC$. Các đường cao $BE,\ CF$ cắt nhau tại $H$. Gọi $M$ là trung điểm của $BC$. Trên tia đối của tia $MH$ lấy điểm $K$ sao cho $HM=MK$.
a) Chứng minh: Tứ giác $BHCK$ là hình bình hành.
b) Chứng minh: $BK\perp AB$; $CK\perp AC$.
c) Chứng minh: tam giác $MEF$ cân.
d) Kẻ $HN\perp BC$ tại $N$. Trên tia $HN$ lấy điểm $I$ sao cho $HN=NI$. Chứng minh: Tứ giác $BIKC$ là hình thang cân.`),

  // ── D. NÂNG CAO (Dạng 6) — xếp vào phần Đại số ──
  ...ca(2, 'dai', 8, 3, R`Cho các số $x,\ y$ thỏa mãn đẳng thức $5x^2+5y^2+8xy-2x+2y+2=0$. Tính giá trị của biểu thức $M=(x+y)^{2023}+(x-2)^{2024}+(y+1)^{2025}$.`),
]

dung({
  MA: 'NQ-GKI-2026',
  TEN: 'Hướng dẫn ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Ngô Quyền, Hà Nội',
  NGUON: 'Trường THCS Ngô Quyền',
  FILE: 'On-tap-giua-ki-1-Toan-8-Ngo-Quyen-2026.pdf',
  PHAN, CAU, LV, HERE,
})
