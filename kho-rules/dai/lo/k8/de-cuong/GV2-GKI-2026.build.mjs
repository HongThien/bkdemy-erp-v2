// ============================================================================
// GV2-GKI-2026.build.mjs — gõ lại "HƯỚNG DẪN ÔN TẬP KIỂM TRA GIỮA KỲ I" Toán 8 (2026–2027) — Trường THCS Giảng Võ 2 (Hà Nội), Tổ Tự nhiên 1
// (PDF 5 trang có lớp chữ, công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi; Thùy gửi 19/10)
//
//   node kho-rules/dai/lo/k8/de-cuong/GV2-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai_6.png)
//
// Trọng tâm KIẾN THỨC (đề ghi): Đại số = phép nhân đa thức · phép chia đa thức cho đơn thức · hiệu hai bình phương, bình phương của một tổng hay một hiệu
// (KNTT 8 bài 6 — CHƯA có lập phương); Hình học = hình bình hành, hình chữ nhật. ⇒ KHÔNG hình thoi / hình vuông, KHÔNG lập phương / tổng-hiệu hai lập phương, KHÔNG phân tích nhân tử.
// Cấu trúc: II. Bài tập Bài 1–15 · III. Đề minh họa (Bài I–V ⇒ nhãn "ĐMH Bài 1…5").
// Tách ý: chỉ ý có dữ kiện RIÊNG (Bài 1, 2, 3, 11, 12, 14 · ĐMH Bài 1, 2); bài chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/GV2-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'II. Bài tập (Bài 1–15)' },
  { thu_tu: 2, ten: 'III. Đề minh họa' },
]

const CAU = [
  ...tach(1, 'dai', '', 1, 1, R`Rút gọn các biểu thức:`, [
    ['a', bt(R`(2x-5)(x+3)+(x-3)(1-2x)`)],
    ['b', bt(R`(2x-3)(2x+3)-(2x+3)^2+12x`)],
    ['c', bt(R`(x^2-5)(5+x^2)-(12x^5-6x):6x`)],
    ['d', bt(R`(x-2)(x+2)(x^2+4)(x^4+16)`)]]),
  ...tach(1, 'dai', '', 2, 1, R`Rút gọn các biểu thức:`, [
    ['a', bt(R`(x+7y)^2-x(x+14y)`)],
    ['b', bt(R`(3x^3y^2-12x^2y^2):3xy-(x-4)(y+xy)`)],
    ['c', bt(R`(4x-5y)(x+2y)-(x+5y)(x-3y)-3x^2-y(x+5y)`)],
    ['d', bt(R`(3x+5)^2-(2x-3)^2+3(6x-7)`)]]),
  ...tach(1, 'dai', '', 3, 2, R`Tìm $x$, biết:`, [
    ['a', bt(R`4x(x-5)-(x-1)(4x-3)=5`)],
    ['b', bt(R`(x-5)(-x+4)-(x-1)(x+3)=-2x^2`)],
    ['c', bt(R`(2x+1)^2-(x-1)^2=0`)],
    ['d', bt(R`4(x+1)^2+(2x-1)^2-8(x-1)(x+1)=11`)],
    ['e', bt(R`9x^2+6x+1=0`)],
    ['f', bt(R`(x^2+4x)^2+8(x^2+4x)-65=0`)]]),
  ...ca(1, 'dai', '', 4, 2, R`Cho hai số $a,\ b>0$ sao cho $a>b,\ a^2+b^2=17$ và $ab=4$. Hãy tính giá trị của:
a) $a+b$;
b) $a-b$;
c) $a^4+b^4$.`),
  ...ca(1, 'dai', '', 5, 2, R`Một phân xưởng may theo kế hoạch cần phải may một số áo trong $m$ ngày, mỗi ngày may $n$ chiếc áo. Nhưng thực tế, phân xưởng đó đã may được vượt mức $30$ chiếc áo mỗi ngày và đã hoàn thành công việc sớm hơn $2$ ngày so với kế hoạch.
a) Viết biểu thức biểu thị số áo phân xưởng phải làm theo kế hoạch và trong thực tế.
b) Hỏi theo kế hoạch thì phân xưởng đó phải may bao nhiêu chiếc áo mỗi ngày nếu $m=10$?`),
  ...ca(1, 'dai', '', 6, 3, R`Cho hình vẽ bên gồm ba hình vuông và hai hình chữ nhật. Biết hình vuông $ABCD,\ ONCP$ có độ dài các cạnh lần lượt là $a,\ b$ (cm), $a>b>0$.
a) Viết biểu thức biểu thị độ dài cạnh của hình vuông $AMOQ$.
b) Viết biểu thức biểu thị diện tích của hình vuông $AMOQ$.
c) Viết biểu thức biểu thị $S_{ABCD}-2\cdot S_{MBNO}-S_{ONCP}$.
Hỏi từ đó suy ra được hằng đẳng thức nào?`, { anh: ['de_bai_6.png'], cb: [R`Đọc hình: $ABCD$ là hình vuông cạnh $a$; $M\in AB,\ N\in BC,\ P\in CD,\ Q\in DA$ sao cho $AMOQ$ và $ONCP$ là hai hình vuông ($O$ là giao điểm của $MP$ và $QN$), còn $MBNO$ và $QOPD$ là hai hình chữ nhật.`] }),
  ...ca(1, 'dai', '', 7, 3, R`Từ một tấm tôn hình chữ nhật có chiều dài bằng $5$ m, chiều rộng bằng $3$ m, người ta cắt bỏ bốn hình vuông cạnh bằng $x$ (m) với $0<x\le 1$ ở bốn góc, rồi gấp và hàn thành thùng không có nắp. Viết biểu thức biểu thị:
a) Diện tích mặt đáy của chiếc thùng.
b) Giả sử $x=1$ (m), thể tích của thùng là bao nhiêu?`),
  ...ca(1, 'hinh_hoc', '', 8, 5, R`Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$). Lấy $M$ là một điểm trên cạnh $BC$ sao cho $BM>MC$ và $M\neq C$. Gọi $N$ và $D$ lần lượt là hình chiếu vuông góc của điểm $M$ trên các cạnh $AB$ và $AC$.
a) Chứng minh tứ giác $ADMN$ là hình chữ nhật.
b) Trên tia đối của tia $NM$ lấy điểm $P$ sao cho $NM=NP$. Chứng minh tứ giác $APND$ là hình bình hành.
c) Gọi $Q$ là chân đường vuông góc kẻ từ điểm $M$ đến đường thẳng $AP$; $O$ là giao điểm của đoạn thẳng $QM$ và đoạn thẳng $ND$. Chứng minh $O$ là trung điểm của đoạn thẳng $QM$ và $\widehat{AQN}=\widehat{ADN}$.`),
  ...ca(1, 'hinh_hoc', '', 9, 5, R`Cho tam giác $ABC$ vuông tại $A$, có đường cao $AH$. Gọi các điểm $E,\ F$ lần lượt là chân các đường vuông góc kẻ từ $H$ đến các cạnh $AB,\ AC$.
a) Chứng minh tứ giác $EAFH$ là hình chữ nhật.
b) Chứng minh $\widehat{AEF}=\widehat{ACB}$.
c) Gọi $M$ là hình chiếu vuông góc của điểm $A$ lên đường thẳng $EF$, $I$ là trung điểm của cạnh $BC$. Chứng minh ba điểm $A,\ M,\ I$ thẳng hàng.`),
  ...ca(1, 'hinh_hoc', '', 10, 5, R`Cho tam giác nhọn $ABC$, có đường cao $AH$. Gọi $I$ là trung điểm của $AC$. Trên tia đối của tia $IH$ lấy điểm $E$ sao cho $IE=IH$.
a) Chứng minh tứ giác $AHCE$ là hình chữ nhật.
b) Gọi $M,\ N$ lần lượt là trung điểm của các đoạn thẳng $HC,\ EC$. Các đoạn thẳng $AM,\ AN$ cắt đoạn thẳng $HE$ lần lượt tại $G$ và $K$. Chứng minh $GK=\dfrac{1}{3}AC$ và tứ giác $AKCG$ là hình bình hành.`),
  ...tach(1, 'dai', '', 11, 3, '', [
    ['a', R`Cho số thực $x$ thoả mãn $x+\dfrac{2}{x}-5=0$. Tính giá trị của biểu thức $P=x^2+\dfrac{4}{x^2}$.`, [R`CHƯA CHẮC — đề dùng biểu thức có biến ở mẫu ($\dfrac{2}{x}$) trong khi phân thức đại số chưa học ở đề cương này; lời giải xử lý như phép chia cho $x\neq 0$ (đề cương coi là bài nâng cao).`]],
    ['b', R`Cho số thực $x$ thoả mãn $x^2-6x+3=0$. Tính giá trị của biểu thức $P=x^2+\dfrac{9}{x^2}$.`, [R`CHƯA CHẮC — cùng lí do như ý a): đề dùng $\dfrac{9}{x^2}$.`]],
    ['c', R`Cho các số thực $a,\ b,\ c$ thỏa mãn $a+b-2c=0$ và $2ab-bc-ca=0$. Chứng minh $a=b=c$.`]]),
  ...tach(1, 'dai', '', 12, 4, R`Tìm giá trị nhỏ nhất của biểu thức sau:`, [
    ['a', bt(R`A=x^2-4x+3`)],
    ['b', bt(R`C=x^2+y^2-8x-4y-21`)],
    ['c', bt(R`B=3x^2+2x-1`)],
    ['d', bt(R`D=x^2-4xy+5y^2-2y+2023`)]]),
  ...ca(1, 'dai', '', 13, 4, R`Cho số $A=(n+1)(n+2)(n+3)(n+4)+1$ với $n$ là số nguyên. Chứng minh $A$ là số chính phương.`),
  ...tach(1, 'dai', '', 14, 4, R`Chứng minh rằng:`, [
    ['a', R`Nếu số $n$ là tổng của hai số chính phương thì $2n$ cũng là tổng của hai số chính phương.`],
    ['b', R`Nếu số $2n$ là tổng của hai số chính phương thì $n$ cũng là tổng của hai số chính phương.`]]),
  ...ca(1, 'dai', '', 15, 4, R`Cho biểu thức $A=(2x+2y-z)^2+(2y+2z-x)^2+(2z+2x-y)^2$.
1) Chứng minh $A=9(x^2+y^2+z^2)$.
2) Nếu $x,\ y,\ z$ là các số thực thỏa mãn $xy+yz+zx=-1$, tìm giá trị nhỏ nhất của biểu thức $A$.`),

  // ══════════ III. ĐỀ MINH HỌA ══════════
  ...tach(2, 'dai', 'ĐMH ', 1, 6, '', [
    ['a', R`Rút gọn biểu thức $A$ với $A=x(x-y)+(x^3y-x^2y^2):xy-2x^2$.`],
    ['b', R`Cho biểu thức $B=(x+y)^2+(x-y)(x+y)-2x(x+y)-7$. Chứng minh giá trị của biểu thức $B$ không phụ thuộc vào giá trị của biến.`],
    ['c', R`Cho biểu thức $C=4x^2-4xy+y^2$. Tính giá trị của biểu thức $C$ khi $x=1013$ và $y=2025$.`]]),
  ...tach(2, 'dai', 'ĐMH ', 2, 6, R`Tìm $x$, biết:`, [
    ['a', bt(R`2(3-x)+3x=-5`)],
    ['b', bt(R`(x-2)^2+(1+x)(1-x)+3=x`)],
    ['c', bt(R`x^2+2x=-1`)]]),
  ...ca(2, 'dai', 'ĐMH ', 3, 6, R`Một ô tô đi từ Hà Nội đến Hải Phòng với vận tốc trung bình là $x$ km/h và hết thời gian là $y$ giờ.
1) Viết đa thức biểu thị độ dài quãng đường từ Hà Nội đến Hải Phòng.
2) Khi đi từ Hải Phòng về Hà Nội trên cùng quãng đường đó, do thời tiết xấu nên ô tô đi với vận tốc trung bình ít hơn vận tốc trung bình lúc đi là $20$ km/h. Vì vậy, thời gian ô tô đi từ Hải Phòng về Hà Nội nhiều hơn thời gian ô tô đi từ Hà Nội đến Hải Phòng là $1$ giờ. Nếu $x=60$, hãy tính độ dài quãng đường ô tô đã đi từ Hà Nội đến Hải Phòng.`),
  ...ca(2, 'hinh_hoc', 'ĐMH ', 4, 7, R`Cho $\triangle ABC$ vuông tại $A$ có $AB<AC$. Gọi $I$ là trung điểm cạnh $AC$. Trên tia đối của tia $IB$ lấy điểm $D$ sao cho $IB=ID$.
1) Chứng minh tứ giác $ABCD$ là hình bình hành.
2) Từ điểm $D$ kẻ đường thẳng song song với đường thẳng $AC$, đường thẳng này cắt đường thẳng $AB$ tại $E$. Chứng minh $AD=CE=BC$.
3) Gọi $O$ là giao điểm $AD$ và $CE$. Đường thẳng $OI$ cắt cạnh $BC$ tại $N$, $EN$ cắt $AC$ tại $K$. Chứng minh ba điểm $B,\ K,\ O$ thẳng hàng.`),
  ...ca(2, 'dai', 'ĐMH ', 5, 7, R`Cho $x,\ y$ là hai số nguyên dương thỏa mãn $3x^2-4xy+2y^2=3$.
Tính giá trị của biểu thức $A$ biết $A=(x-2)^{2025}+(y-3)^{2026}$.`),
]

dung({
  MA: 'GV2-GKI-2026',
  TEN: 'Hướng dẫn ôn tập kiểm tra giữa kì I Toán 8 năm 2026–2027 — Trường THCS Giảng Võ 2, Hà Nội',
  NGUON: 'Trường THCS Giảng Võ 2',
  FILE: 'On-tap-giua-ki-1-Toan-8-Giang-Vo-2-2026.pdf',
  PHAN, CAU, LV, HERE,
})
