// ============================================================================
// TX-GKI-2026.build.mjs — gõ lại "NỘI DUNG ÔN TẬP MÔN TOÁN 8 GIỮA HKI, NĂM HỌC 2026–2027" — Trường THCS Thanh Xuân (Hà Nội)
// (PDF scan 4 trang, lớp chữ hỏng ⇒ đọc từ ẢNH trang 130 dpi + phóng 260 dpi; Thùy gửi 24/10; KHÔNG có đáp án / lời giải)
//
//   node kho-rules/dai/lo/k8/de-cuong/TX-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf)
//
// Phạm vi KIẾN THỨC (đề ghi): Đại số = đơn thức, đa thức, hằng đẳng thức (cộng trừ nhân chia đơn thức/đa thức · tìm hệ số, bậc, điều kiện chia hết ·
// chứng minh biểu thức không phụ thuộc biến · tìm x · tính giá trị); Hình = vận dụng tính chất, dấu hiệu nhận biết các hình để chứng minh đoạn bằng nhau,
// góc bằng nhau, tia phân giác, hai đường thẳng vuông góc.
// Cấu trúc: 1 Phần đơn thức, đa thức (Bài 1–8, nhãn "Dạng 1 Bài n") · 2 Phần hằng đẳng thức ("Dạng 2 Bài n") · 3 Dạng tìm x ("Dạng 3 Bài n") ·
//           4 Phần hình học (Bài 1–5, nhãn "Hình Bài n", kho=hinh_hoc, KHÔNG tách ý) · 5 Phần nâng cao (Bài 1–5, nhãn "Khác Bài n").
// Đề không có hình vẽ sẵn ⇒ không cắt hình.
// Nghi: Dạng 3 Bài 3 (PDF mất dấu ngoặc ở hầu hết ý — đã khôi phục, ghi CHƯA CHẮC) · Dạng 1 Bài 7 (nhãn "b)" lặp) · Dạng 1 Bài 8 (gọi "đa thức" nhưng có |y−3|) ·
// Khác Bài 2c (có z mà lệnh chỉ "Tìm x, y").
// Trạm đối chiếu (Opus, 24/10): kiểm ảnh 260 dpi; mục 1/2/3 của Phần HĐT Bài 3 đổi nhãn thành "Dạng 2 Bài 3.1 / 3.2 / 3.3a / 3.3b" (trước gõ
// "3a / 4 / 5a / 5b" — Bài 4, 5 không có trong đề); hạ CHƯA CHẮC thành ghi chú ở các chỗ giải được (quy ước Thùy 24/10 "đề sai giải bình thường,
// ghi rõ"): Dạng 1 Bài 7, 8 · Dạng 3 Bài 3a, c, d, f, i · Khác Bài 2c. Còn CHƯA CHẮC: Dạng 3 Bài 3b. Biên bản: TX-GKI-2026.doichieu.md.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TX-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}${o.y ?? ''}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Phần đơn thức, đa thức' },
  { thu_tu: 2, ten: 'Phần hằng đẳng thức' },
  { thu_tu: 3, ten: 'Dạng tìm x' },
  { thu_tu: 4, ten: 'Phần hình học' },
  { thu_tu: 5, ten: 'Phần nâng cao' },
]

const DOT = 'Đề in dấu chấm = dấu nhân.'
const MAT_NGOAC = (kq) => R`Bản in mất dấu ngoặc (lỗi font, chỗ ngoặc còn khoảng trắng): đề in "${kq}"; đã khôi phục ngoặc theo khoảng trắng — trạm đối chiếu đã kiểm ảnh 260 dpi, phương trình khôi phục phân tích được thành nhân tử gọn.`
const MAT_NGOAC_CC = (kq, lido) => R`CHƯA CHẮC — bản in mất dấu ngoặc (lỗi font): đề in "${kq}"; đã khôi phục ngoặc theo khoảng trắng. ${lido}`

const CAU = [
  // ══════════ 1. PHẦN ĐƠN THỨC, ĐA THỨC (Dạng 1) ══════════
  ...ca(1, 'dai', 'Dạng 1 ', 1, 1, R`Cho đơn thức $A=\left(\dfrac{2}{3}x^2y^2\right)\left(\dfrac{-6}{5}x^4y^3\right)$.
a) Thu gọn rồi tìm bậc của đơn thức $A$.
b) Tính giá trị của đơn thức $A$ tại $x=-1,\ y=-2$.`, { cb: ['Giữ cả bài (ý b dùng A đã thu gọn).'] }),
  ...ca(1, 'dai', 'Dạng 1 ', 2, 1, R`Cho đa thức $A=x^5y+3x^4+5x^2y,\ B=2xy-3x^4-2xy+9+2x^2y$.
a) Tính $C=A+B$.
b) Tính giá trị của $C$ tại $x=-1,\ y=2$.`, { cb: ['Giữ cả bài (ý b dùng C ở ý a).'] }),
  ...tach(1, 'dai', 'Dạng 1 ', 3, 1, R`Chứng minh rằng các biểu thức sau không phụ thuộc vào $x$:`, [
    ['a', bt(R`A=(3x+7)(2x+3)-(3x-5)(2x+11)`)],
    ['b', bt(R`B=(x^2-2)(x^2+x-1)-x(x^3+x^2-3x-2)`)]]),
  ...tach(1, 'dai', 'Dạng 1 ', 4, 1, R`Tìm đa thức $N$ thỏa mãn điều kiện:`, [
    ['a', bt(R`(3x^5-4x^4+6x^3)=(-2x^2)\cdot N`), [DOT]],
    ['b', bt(R`N\cdot\left(-\dfrac{1}{3}x^2y^3\right)=6x^4y^5-3x^3y^4+\dfrac{1}{2}x^4y^3z`), [DOT]],
    ['c', bt(R`x^3-3x^2y+3xy^2-y^3=N\cdot(y-x)`), [DOT]],
    ['d', bt(R`x^4-2x^2y^2+y^4=(y^2-x^2)\cdot N`), [DOT]]]),
  ...tach(1, 'dai', 'Dạng 1 ', 5, 1, R`Tìm số tự nhiên $n$ để phép chia sau đây là phép chia hết:`, [
    ['a', bt(R`\left(\dfrac{1}{2}x^5y^{7-n}\right):\left(-2x^ny^3\right)`)],
    ['b', bt(R`\left(8xy^6+9x^4y^5-2x^5y^7\right):3x^{n-1}y^{n+1}`)],
    ['c', bt(R`\left(2x^{n-1}y^7+6x^{n+1}y^8\right):\left(\dfrac{1}{2}x^3y^n\right)`)]]),
  ...ca(1, 'dai', 'Dạng 1 ', 6, 2, R`Cho biểu thức $A=(2n-1)(2n+3)$ và $B=(4n-5)(n+1)-3$.
a) Tính: $Q=A-B$.
b) Chứng minh $Q$ luôn chia hết cho $5$ với mọi số nguyên $n$.`, { cb: ['Giữ cả bài (ý b dùng Q ở ý a).'] }),
  ...ca(1, 'dai', 'Dạng 1 ', 7, 2, R`Cho 2 đa thức: $A=3x^2y^4-5xy^3-\dfrac{3}{2}x^2y^4$ và $B=3xy^3+2xy^3+1$.
a) Tính tổng $M=A+B$.
b) Tính giá trị của $M$ khi $x=1;\ y=-1$.
c) Chứng minh rằng $M$ luôn dương với mọi $x;\ y$.`, { cb: [R`Đề in hai ý đều đánh nhãn "b)" (ý "Tính giá trị…" và ý "Chứng minh…") — lỗi in nhãn hiển nhiên, đã gõ ý thứ hai thành "c)".`, 'Giữ cả bài (ý sau dùng M ở ý a).'] }),
  ...ca(1, 'dai', 'Dạng 1 ', 8, 2, R`Cho đa thức: $(x^2-9)^2+\left|y-3\right|-1$
a) Tính giá trị của đa thức với $x=2;\ y=-1$.
b) Tìm giá trị lớn nhất (hoặc nhỏ nhất) của đa thức.`, { cb: [R`Đề sai thuật ngữ: gọi là "đa thức" nhưng biểu thức có giá trị tuyệt đối $\left|y-3\right|$ (không phải đa thức) — chép đúng như in, giải bình thường, lời giải ghi rõ. Ý b in "lớn nhất (hoặc nhỏ nhất)": biểu thức không bị chặn trên (theo $x$) nên chỉ có giá trị nhỏ nhất — lời giải nói rõ.`, 'Giữ cả bài (hai ý chung một biểu thức).'] }),

  // ══════════ 2. PHẦN HẰNG ĐẲNG THỨC (Dạng 2) ══════════
  ...ca(2, 'dai', 'Dạng 2 ', 1, 2, R`Cho hai biểu thức $A=(x-2)(x+2)-(x-3)^2$ và $B=(x+1)^3-(x-1)^3-6x^2$.
a) Rút gọn biểu thức $A$.
b) Tính giá trị của biểu thức $A$ tại $x=-1$.
c) Chứng minh rằng biểu thức $B$ luôn có giá trị không đổi (không phụ thuộc vào biến $x$).
d) Cho $C=B-A$. Tìm $x$ để $C=13$.`, { cb: ['Giữ cả bài (các ý dùng chung A, B).'] }),
  ...ca(2, 'dai', 'Dạng 2 ', 2, 2, R`Cho hai biểu thức $M=(x+2y)^2+(x-2y)^2$ và $N=x^2-4x+y^2+6y+15$.
a) Rút gọn biểu thức $M$.
b) Tính giá trị của biểu thức $M$ biết $x^2+4y^2=10$.
c) Tìm giá trị nhỏ nhất của biểu thức $N$.`, { cb: ['Giữ cả bài (ý b dùng M đã rút gọn).'] }),
  ...ca(2, 'dai', 'Dạng 2 ', 3, 2, R`Cho hai số $a,\ b$ thỏa mãn $a+b=7$ và $ab=12$.
a) Tính giá trị của biểu thức $M=a^2+b^2$.
b) Tính giá trị của biểu thức $N=a^3+b^3$.`, { y: '.1', cb: [R`Đề in "Bài 3" gồm 3 mục: 1. (ý a, b) · 2. · 3. Thu gọn (ý a, b). Nhãn theo mục: "Dạng 2 Bài 3.1" (giữ cả ý a, b chung dữ kiện $a+b=7,\ ab=12$), "Dạng 2 Bài 3.2", "Dạng 2 Bài 3.3a/3.3b".`] }),
  ...ca(2, 'dai', 'Dạng 2 ', 3, 2, R`Cho $a-b=1$. Chứng minh: $a^3-b^3=1+3ab$.`, { y: '.2', cb: ['Đề in mục 2 của Bài 3.'] }),
  ...tach(2, 'dai', 'Dạng 2 ', '3.3', 2, R`Thu gọn:`, [
    ['a', bt(R`(2+1)(2^2+1)(2^4+1)\cdots(2^{32}+1)-2^{64}`), ['Đề in mục 3a của Bài 3. Đề in dãy chấm "….".']],
    ['b', bt(R`(5+3)(5^2+3^2)(5^4+3^4)\cdots(5^{64}+3^{64})+\dfrac{5^{128}-3^{128}}{2}`), ['Đề in mục 3b của Bài 3. Đề in dãy chấm "….". Đã kiểm ảnh 260 dpi: dấu trước phân số in là "+".']]]),

  // ══════════ 3. DẠNG TÌM x (Dạng 3) ══════════
  ...tach(3, 'dai', 'Dạng 3 ', 1, 3, R`Tìm $x$, biết:`, [
    ['a', bt(R`2(5x-1)-x(3x-2)+3x^2-15x=8`)],
    ['b', bt(R`3x(8x-4)-6x(4x-3)=30`)],
    ['c', bt(R`3x(5-2x)+2x(3x-5)=20`)]]),
  ...tach(3, 'dai', 'Dạng 3 ', 2, 3, R`Tìm $x$, biết:`, [
    ['a', bt(R`2x(x-5)-(2x-1)(x+2)=28`)],
    ['b', bt(R`(12x-5)(4x-1)-(3x-1)(16x-1)=81`), ['Đã kiểm ảnh 260 dpi: in đúng như gõ (nghiệm không nguyên — vẫn giữ như in).']],
    ['c', bt(R`(5x+3)(x-4)+(x-5)(x-2)=(3x-5)(2x-4)`)]]),
  ...tach(3, 'dai', 'Dạng 3 ', 3, 3, R`Tìm $x$, biết`, [
    ['a', bt(R`x(x+3)-2(x+3)=0`), [MAT_NGOAC('x x+3 −2 x+3 =0')]],
    ['b', bt(R`\dfrac{5}{4}(2x+1)^2+2(x^2-4)-5(x-2)=0`), [MAT_NGOAC_CC('5/4 2x+1 ² +2 x²−4 −5 x−2 =0', R`Theo cách khôi phục này, phương trình rút gọn còn $7x^2+\dfrac{13}{4}=0$ (vô nghiệm) — nghi bản gốc in khác (hệ số / dấu); nếu giữ thì lời giải kết luận vô nghiệm và ghi rõ.`)]],
    ['c', bt(R`5x(x-2)-3(x-2)=0`), [MAT_NGOAC('5x x−2 −3 x−2 =0')]],
    ['d', bt(R`x^3(x^2-9)-8(9-x^2)=0`), [MAT_NGOAC('x³ x²−9 −8 9−x² =0')]],
    ['e', bt(R`x^3+4x^2-21x=0`)],
    ['f', bt(R`(2-x)^2-2(x-2)(x+1)+(x+1)^2-3x-5=10`), [MAT_NGOAC('2−x ² −2 x−2 x+1 + x+1 ² −3x−5=10')]],
    ['g', bt(R`x^4-2x^2+1=0`)],
    ['h', bt(R`x^3-2x^2+x=0`)],
    ['i', bt(R`(x^2+x)^2-14(x^2+x)+24=0`), [MAT_NGOAC('x²+x ² −14 x²+x +24=0')]]]),

  // ══════════ 4. PHẦN HÌNH HỌC (không tách ý, không hình sẵn) ══════════
  ...ca(4, 'hinh_hoc', 'Hình ', 1, 4, R`Cho tam giác $ABC$ vuông tại $A$ có $AB<AC$, đường cao $AH$. Từ $H$ kẻ $HM\perp AB\ (M\in AB)$, kẻ $HN\perp AC\ (N\in AC)$. Gọi $I$ là trung điểm của $HC$, lấy $K$ trên tia $AI$ sao cho $I$ là trung điểm của $AK$.
a) Chứng minh tứ giác $AHKC$ là hình bình hành.
b) Biết $MN$ cắt $AH$ tại $O$. Chứng minh $MH\parallel AC$ và $\widehat{OMH}=\widehat{HKC}$.
c) Gọi $D$ là giao điểm của $CO$ và $AK$. Chứng minh $AK=3AD$.`),
  ...ca(4, 'hinh_hoc', 'Hình ', 2, 4, R`Cho tam giác $ABC$ cân tại $A$, đường cao $AH$. Gọi $I$ là trung điểm của $AC$, lấy điểm $M$ sao cho $I$ là trung điểm của $HM$.
a) Chứng minh tứ giác $AHCM$ là hình bình hành, hình chữ nhật.
b) Gọi $K$ là trung điểm của $HC$. Chứng minh $AH$ song song với $KI$.
c) Gọi $E$ là trung điểm của $AH$. Chứng minh $B,\ E,\ M$ thẳng hàng.`, { cb: ['Đề in ý a: "là hình bình hành, hình chữ nhật" (chứng minh cả hai) — chép đúng như in.'] }),
  ...ca(4, 'hinh_hoc', 'Hình ', 3, 4, R`Cho tam giác $MNP$ vuông tại $M$, đường cao $MH$. Gọi $I,\ K$ lần lượt là chân đường vuông góc hạ từ $H$ đến $MN,\ MP$.
a) Tứ giác $MKHI$ là hình gì? Vì sao?
b) Chứng minh $MH=IK$.
c) Cần điều kiện gì của tam giác $MNP$ để $MKHI$ là hình vuông?`),
  ...ca(4, 'hinh_hoc', 'Hình ', 4, 4, R`Cho $\triangle ABC$ vuông ở $A$, đường cao $AH$. Kẻ $HE$ vuông góc với $AB$ tại $E$ và $HF$ vuông góc với $AC$ tại $F$.
a) Chứng minh tứ giác $AFHE$ là hình chữ nhật.
b) Trên tia đối của tia $FH$ lấy điểm $M$ sao cho $FH=FM$. Trên tia đối của tia $EH$ lấy điểm $N$ sao cho $EH=EN$. Chứng minh tứ giác $AEFM$ là hình bình hành.
c) Chứng minh $A,\ M,\ N$ thẳng hàng.`, { cb: ['Đề in sang hai trang: ý a cuối trang 3, ý b, c đầu trang 4 — cùng một bài.'] }),
  ...ca(4, 'hinh_hoc', 'Hình ', 5, 4, R`Cho tam giác $ABC$ vuông tại $A$ có $AB<AC$ và đường trung tuyến $AM$. Từ $M$ kẻ $MN$ vuông góc với $AC$ tại $N$ và kẻ $MP$ vuông góc với $AB$ tại $P$.
a) Tứ giác $APMN$ là hình gì? Vì sao?
b) Trên tia đối của tia $NM$ lấy điểm $Q$ sao cho $N$ là trung điểm của $MQ$. Trên tia đối của tia $PM$ lấy điểm $K$ sao cho $P$ là trung điểm của $MK$. Chứng minh $3$ điểm $Q,\ A,\ K$ thẳng hàng.`),

  // ══════════ 5. PHẦN NÂNG CAO ══════════
  ...tach(5, 'dai', 'Khác ', 1, 5, R`Chứng minh rằng không tồn tại các số thực $x,\ y,\ z$ thỏa mãn:`, [
    ['a', bt(R`5x^2+10y^2-6xy-4x-2y+3=0`)],
    ['b', bt(R`x^2+4y^2+z^2-2x-6z+8y+15=0`)]]),
  ...tach(5, 'dai', 'Khác ', 2, 5, R`Tìm $x,\ y$ thỏa mãn`, [
    ['a', bt(R`x^2+8y^2+9=4y(x+3)`)],
    ['b', bt(R`9x^2-8xy+8y^2-28x+28=0`)],
    ['c', bt(R`x^2+2y^2+5z^2+1=2(xy+2yz+z)`), [R`Đề in thiếu: lệnh chung "Tìm x, y thỏa mãn" nhưng ý c có thêm biến $z$ — giải bình thường, tìm cả $x,\ y,\ z$, lời giải ghi rõ.`]]]),
  ...ca(5, 'dai', 'Khác ', 3, 5, R`Tìm min của: $A=x^2+5y^2+5z^2-4xy-4yz-4z+12$.`),
  ...ca(5, 'dai', 'Khác ', 4, 5, R`Tìm GTNN của: $A=5x^2+y^2+2xy-12x-18$.`),
  ...ca(5, 'dai', 'Khác ', 5, 5, R`Tìm GTNN của: $A=x^2-2xy+2y^2-4y+5$.`),
]

for (const q of CAU) if (/^Dạng 3 Bài 3[fghi]$/.test(q.nhan)) q.nhom = 4

dung({
  MA: 'TX-GKI-2026',
  TEN: 'Nội dung ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Thanh Xuân, Hà Nội',
  NGUON: 'THCS Thanh Xuân, Hà Nội',
  FILE: 'DE-CUONG-GIUA-KI-LOP-8-THCS-THANH-XUAN.pdf',
  PHAN, CAU, LV, HERE,
})
