// ============================================================================
// NSHM-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa kì I Toán 8 (2026–2027) — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai
// ("HƯỚNG DẪN ÔN TẬP GIỮA KÌ I", 5 trang ảnh Thùy gửi 12/10) → `de.json` (khung, chưa lời giải) + `goc.pdf` + 12 tệp khung
// `NSHM-GKI-2026.p<N>.soan.md` cho trạm soạn.
//
//   node kho-rules/dai/lo/k8/de-cuong/NSHM-GKI-2026.build.mjs <thư mục làm việc> <thư mục chứa 1.png 2.webp 3.webp 4.png 5.webp>
//
// Luật: kho-rules/dai/k8.md (§3 dấu nhân `\cdot`; §10 tách ý: CHỈ bài Tìm x có ý độc lập; bài cho chung dữ kiện / lời văn / HÌNH giữ cả bài).
//   · Bài 1–4: ý b), c) dùng kết quả ý a) ⇒ một câu.   · Bài 5–7: 10 ý độc lập ⇒ tách.   · Bài 8–12 lời văn ⇒ một câu.
//   · Bài 13–22 hình ⇒ một câu / bài (kho hinh_hoc, dạng chờ HH08000000).   · Bài 23–32 mỗi bài một câu.
// Nhãn giữ ĐÚNG nhãn in trên đề cương (Bài 5, 6, 7 có ý a b c d e f g h i k — không có j).
// `kieu: 'de_cuong'` ⇒ tab "Đề cương" của Kho đề thi (mig 202610102204).
// ============================================================================
import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'

const [LV, ANH] = process.argv.slice(2)
if (!LV || !ANH) { console.error('Dùng: node …/NSHM-GKI-2026.build.mjs <thư mục làm việc> <thư mục chứa ảnh 1..5>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const require = createRequire(new URL('../../../../../package.json', import.meta.url))
const katex = require('katex')
const R = String.raw
const bt = (e) => `$${e}$.`   // biểu thức + dấu chấm kết câu NGOÀI công thức

const TEN = 'Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường TH, THCS & THPT Ngôi Sao Hoàng Mai'
const PHAN = [
  { thu_tu: 1, ten: 'I. Đa thức' },
  { thu_tu: 2, ten: 'II. Tìm x' },
  { thu_tu: 3, ten: 'III. Bài toán thực tế' },
  { thu_tu: 4, ten: 'IV. Hình học' },
  { thu_tu: 5, ten: 'V. Dạng toán khác' },
]

/** tách ý: mỗi ý một câu, câu = lead + ý (kho dai) */
const tach = (phan, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho: 'dai', nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
/** giữ nguyên cả bài */
const ca = (phan, kho, bai, nd, cb) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, canh_bao: cb ?? [] }]

const CAU = [
  // ── I. ĐA THỨC ──
  ...ca(1, 'dai', 1, R`Cho đa thức $P=y(x-3y)+2x^2+2y^2$.
a) Rút gọn đa thức $P$.
b) Tính giá trị của đa thức $P$ tại $x=2;\ y=-1$.
c) Cho đa thức $Q=P-(x+y)^2$. Tìm các số nguyên $x,\ y$ để $Q=-2$.`),
  ...ca(1, 'dai', 2, R`Cho đa thức $A=x(x-y)+2y(x+y)-y^2$.
a) Rút gọn đa thức $A$.
b) Tính giá trị của đa thức $A$ tại $x=4;\ y=-2$.
c) Cho biểu thức $B=\dfrac{3}{A+2xy+y^2}$. Tìm các số nguyên $x,\ y$ để $B$ nhận giá trị nguyên.`),
  ...ca(1, 'dai', 3, R`Cho đa thức $M=3x(x-y)-2x^2+4y^2$.
a) Rút gọn đa thức $M$.
b) Tính giá trị của đa thức $M$ tại $x=3;\ y=1$.
c) Cho đa thức $N=2M+y^2+4x-3$. Tìm các số nguyên $x,\ y$ để $N=-2$.`),
  ...ca(1, 'dai', 4, R`Cho đa thức $G=x(3x-2y)-2x^2+y^2$.
a) Rút gọn đa thức $G$.
b) Tính giá trị của đa thức $G$ tại $x=5;\ y=2$.
c) Cho đa thức $K=G-y^2+3y-5x$. Tìm các số nguyên $x,\ y$ để $K=-7$.`),

  // ── II. TÌM x ──
  ...tach(2, 5, R`Tìm $x$ biết:`, [
    ['a', bt(R`3(x-2)-2(x+1)=5`)],
    ['b', bt(R`2x(x+3)-2x^2+5=17`)],
    ['c', bt(R`5(x-1)-3(x+2)=1`)],
    ['d', bt(R`3x(x-2)-3x^2+4=10`)],
    ['e', bt(R`2x(x+1)-4=2x^2`)],
    ['f', bt(R`2x\left(x-\dfrac{5}{2}\right)-2x^2=-5`)],
    ['g', bt(R`\dfrac{4}{5}x(5x-1)+3=4x^2`)],
    ['h', bt(R`x(3x-5)-3x^2=5`)],
    ['i', bt(R`3(5x-1)-x(x-2)+x^2-13x=7`)],
    ['k', bt(R`x(3x+1)-3x(x-2)+5=0`)]]),
  ...tach(2, 6, R`Tìm $x$ biết:`, [
    ['a', bt(R`(x+3)^2=16`)],
    ['b', bt(R`(2x-3)(2x+3)+5=0`)],
    ['c', bt(R`(x-5)^2+10=34`)],
    ['d', bt(R`(3x+2)^2-12x=40`)],
    ['e', bt(R`(x+3)^2-6x=25`)],
    ['f', bt(R`(2x-1)(2x+1)-3x^2=10`)],
    ['g', bt(R`(x-4)^2+8x=41`)],
    ['h', bt(R`8x^2-(3x-2)(3x+2)=-20`)],
    ['i', bt(R`(2x+1)^2+(x+5)(2-3x)=3`)],
    ['k', bt(R`(x+2)^2+(x-2)^2-26=0`)]]),
  ...tach(2, 7, R`Tìm $x$ biết:`, [
    ['a', bt(R`x^2-3x+2=0`)],
    ['b', bt(R`x(x-4)+3=0`)],
    ['c', bt(R`x(x-5)-x+8=0`)],
    ['d', bt(R`(3x+1)^2-5x(x+2)=4`)],
    ['e', bt(R`(2x+3)^2-(3x-1)(x+2)=1`)],
    ['f', bt(R`2(3x-1)^2-5x(2x-5)=8`)],
    ['g', bt(R`(3x-2)^2-5x(x+1)+9=0`)],
    ['h', bt(R`(x-3)^2-(2x-5)(x-1)+3x-7=0`)],
    ['i', bt(R`x(x+2)+3(x-1)=0`)],
    ['k', bt(R`2x(x-2)-(x+1)=0`)]]),

  // ── III. BÀI TOÁN THỰC TẾ ──
  ...ca(3, 'dai', 8, R`Tại một siêu thị bán hoa quả, giá của mỗi kilogram nho là 60 000 đồng và giá của mỗi kilogram dưa hấu là 25 000 đồng. Bác Hòa muốn mua $x$ kg nho và $y$ kg dưa hấu.
a) Viết biểu thức đại số biểu thị tổng số tiền bác Hòa phải trả. Tính số tiền bác Hòa phải trả khi $x=3,\ y=5$.
b) Bác Hòa mang theo 500 000 đồng đi siêu thị để mua nho và dưa hấu. Bác muốn mua đúng 12 kg hoa quả gồm cả hai loại sao cho tổng số tiền không vượt quá số tiền mang theo. Hỏi bác Hòa có thể mua nhiều nhất bao nhiêu kilogram nho? (Biết $x$ và $y$ là các số tự nhiên).`),
  ...ca(3, 'dai', 9, R`Một mảnh đất có dạng hình chữ nhật với chiều dài là $x+3y$ (m) và chiều rộng là $x-3y$ (m). ($x>3y>0$)
a) Viết biểu thức dưới dạng thu gọn biểu thị diện tích mảnh đất đó.
Người ta trồng rau trên toàn bộ diện tích mảnh đất đó, sau 3 tháng thì được thu hoạch và mang đi bán. Tính số tiền thu được sau mỗi lần bán khi $x=10,\ y=2$, biết rằng mỗi $\text{m}^2$ trồng rau thu được 50 000 đồng.
b) Để tiêu thụ toàn bộ số rau này, chủ vườn đưa ra 2 phương án thuê xe vận chuyển:
- Phương án A (Thuê xe tải nhỏ): Chi phí cố định là 100 000 đồng (tiền bốc xếp) cộng với 3000 đồng cho mỗi mét vuông rau thu hoạch.
- Phương án B (Thuê xe tải lớn): Không tốn phí bốc xếp cố định, nhưng chi phí vận chuyển là 5000 đồng cho mỗi mét vuông rau thu hoạch.
Với diện tích mảnh đất ở câu a, chủ vườn nên chọn phương án nào để chi phí vận chuyển là nhỏ nhất (tối ưu nhất)?`),
  ...ca(3, 'dai', 10, R`Một rạp chiếu phim bán hai loại vé:
- Vé người lớn: 70 000 đồng/vé
- Vé trẻ em: 50 000 đồng/vé.
Một gia đình gồm $x$ người lớn và $y$ trẻ em cùng đi xem phim.
a) Thiết lập đa thức tính tổng chi phí và tính số tiền gia đình đó phải trả nếu có 4 người lớn và 6 trẻ em.
b) Rạp phim có chương trình khuyến mãi "Giảm 10% hóa đơn nếu mua từ 10 vé trở lên". Một gia đình có 600 000 đồng. Hỏi gia đình đó có thể mua được nhiều nhất bao nhiêu vé (bao gồm cả vé người lớn và vé trẻ em).`),
  ...ca(3, 'dai', 11, R`Để chuẩn bị cho dịp Trung thu, lớp 8A chuẩn bị mua 3 loại sản phẩm: Bánh dẻo giá 50 000 đồng/gói, bánh nướng giá 60 000 đồng/gói, nước ngọt giá 20 000 đồng/chai. Giả sử lớp sẽ mua $x$ gói bánh dẻo, $y$ gói bánh nướng và $z$ chai nước ngọt. ($x,\ y,\ z\in\mathbb{N}^*$)
a) Viết đa thức biểu diễn tổng số tiền lớp 8A phải trả theo $x,\ y,\ z$.
b) Cửa hàng đang có chương trình giảm giá cho khách hàng mua từ 15 sản phẩm trở lên sẽ được giảm 15% hóa đơn. Biết lớp sẽ mua tổng là 18 sản phẩm (phải có đủ cả 3 loại). Hãy xác định số lượng bánh và nước ngọt để tổng tiền phải trả sau giảm giá là nhỏ nhất.`),
  ...ca(3, 'dai', 12, R`Một căn phòng cần được sơn lại các bức tường xung quanh và trần nhà. Căn phòng có dạng hình hộp chữ nhật với chiều dài là $x$ mét, chiều rộng là $y$ mét, và chiều cao là $z$ mét. Giá sơn mỗi mét vuông (bao gồm cả vật liệu và công thợ) là 120 000 đồng.
a) Lập đa thức biểu diễn tổng chi phí để sơn lại căn phòng. Áp dụng tính chi phí khi biết $x=5$ mét, $y=4$ mét, $z=3$ mét.
b) Giả sử diện tích sàn nhà là $20\ \text{m}^2$ và thể tích của phòng là $60\ \text{m}^3$. Hãy tìm các kích thước của căn phòng để chi phí sơn là thấp nhất và tính chi phí đó.`),

  // ── IV. HÌNH HỌC (không tách ý — k8.md §10) ──
  ...ca(4, 'hinh_hoc', 13, R`Cho hình chữ nhật $ABCD$ có $AD<AB$. Gọi $M,\ N$ lần lượt là trung điểm của $AD,\ BC$.
a) Chứng minh $ABNM$ là hình chữ nhật.
b) Qua $B$ kẻ đường thẳng vuông góc với $BM$ cắt tia $DC$ tại $K$. Trên đoạn $DC$ lấy điểm $P$ sao cho $DP=CK$. Chứng minh tứ giác $APKB$ là hình bình hành.
c) Kẻ $KH$ vuông góc với đường thẳng $AB$ tại $H$. Chứng minh $AN$ vuông góc với $HC$.`),
  ...ca(4, 'hinh_hoc', 14, R`Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Từ $H$ kẻ các đường thẳng $HM\perp AB\ (M\in AB)$, $HN\perp AC\ (N\in AC)$. Gọi $O$ là giao điểm của $AH$ và $MN$.
a) Chứng minh tứ giác $AMHN$ là hình chữ nhật.
b) Trên tia $NC$ lấy điểm $P$ sao cho $AN=PN$. Gọi $I$ là giao điểm của $MP$ và $HN$. Chứng minh rằng tứ giác $HMNP$ là hình bình hành và $OI=\dfrac{1}{2}AN$.
c) Qua $C$ kẻ đường thẳng song song với $AH$ và cắt đường thẳng $MH$ tại điểm $E$, cắt đường thẳng $MN$ tại điểm $F$. Hỏi tam giác $ABC$ cần thêm điều kiện gì để tam giác $MFE$ là tam giác vuông cân?`),
  ...ca(4, 'hinh_hoc', 15, R`Cho tam giác $ABC$ vuông tại $A$ $(AB>AC)$. Gọi $M$ là trung điểm cạnh $BC$, trên tia đối của tia $MA$ lấy điểm $D$ sao cho $MD=MA$.
a) Chứng minh tứ giác $ABDC$ là hình chữ nhật và $AM=\dfrac{1}{2}BC$.
b) Gọi $E$ là chân đường vuông góc hạ từ $D$ xuống $BC$, lấy điểm $F$ sao cho $E$ là trung điểm của $FD$. Chứng minh $CF=AB$ và $AF$ vuông góc với $FD$.
c) Qua $F$ kẻ các đường thẳng vuông góc với các đường thẳng $AB$ và $AC$ lần lượt tại $H$ và $K$. Chứng minh $H,\ K,\ E$ thẳng hàng.`),
  ...ca(4, 'hinh_hoc', 16, R`Cho hình chữ nhật $ABCD$. Kẻ $BH$ vuông góc với $AC$ ($H$ thuộc $AC$). Gọi $M,\ N,\ P$ lần lượt là trung điểm của $AB,\ AH,\ CD$.
a) Chứng minh tứ giác $MBCP$ là hình chữ nhật.
b) Chứng minh $MN$ vuông góc với $AC$.
c) Kẻ $NK\parallel AB$ ($K$ thuộc $BH$). Chứng minh $NP=CK$.
d) Chứng minh $NP$ vuông góc với $NB$.`),
  ...ca(4, 'hinh_hoc', 17, R`Cho hình chữ nhật $ABCD$. Kẻ $AN$ và $CM$ cùng vuông góc với $BD$ ($N,\ M$ thuộc $BD$).
a) Chứng minh $DN=BM$.
b) Chứng minh tứ giác $ANCM$ là hình bình hành.
c) Trên tia đối của tia $NA$ lấy điểm $K$ sao cho $NK=NA$. Tứ giác $DKCB$ là hình gì? Vì sao?
d) Tia $AM$ cắt tia $KC$ tại điểm $P$. Chứng minh rằng $PN,\ AC,\ KM$ đồng quy.`),
  ...ca(4, 'hinh_hoc', 18, R`Cho tam giác $ABC$ vuông tại $A$ $(AB>AC)$. Gọi $E$ là trung điểm của $BC$. $D,\ H$ lần lượt là chân đường vuông góc kẻ từ $E$ xuống $AB,\ AC$.
a) Chứng minh tứ giác $ADEH$ là hình chữ nhật.
b) Chứng minh $D$ là trung điểm $AB$.
c) Lấy điểm $F$ sao cho $D$ là trung điểm của $EF$. Kẻ $EI$ vuông góc với $AF$ tại $I$. Chứng minh $IH$ vuông góc với $ID$.
d) Chứng minh $\widehat{IAD}=\widehat{IHD}$.`),
  ...ca(4, 'hinh_hoc', 19, R`Cho tam giác $ABC$ vuông tại $A$ $(AB<AC)$. Gọi $M,\ N,\ Q$ lần lượt là trung điểm của $AB,\ BC,\ AC$. Kẻ $AI$ vuông góc với $BC$ tại $I$.
a) Chứng minh tứ giác $AMNQ$ là hình chữ nhật.
b) Qua $A$ kẻ đường thẳng song song với $BC$ và cắt $NQ$ tại điểm $K$. Chứng minh rằng $AK\parallel MQ$.
c) Chứng minh tứ giác $INQM$ là hình thang cân.
d) Chứng minh $MI$ vuông góc với $QI$.`),
  ...ca(4, 'hinh_hoc', 20, R`Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Kẻ $HI$ vuông góc với $AB$ tại $I$. Kẻ $HK$ vuông góc với $AC$ tại $K$.
a) Chứng minh $AH=IK$.
b) Gọi $M$ là trung điểm của $BC$. Chứng minh $BC\ge 2\cdot IK$.
c) Chứng minh $AM$ vuông góc với $IK$.`),
  ...ca(4, 'hinh_hoc', 21, R`Cho hình chữ nhật $ABCD$. Điểm $I,\ K$ thuộc cạnh $CD$ sao cho $DI=CK$ ($I$ khác $D$). Qua $I$ kẻ đường thẳng vuông góc với $AI$, cắt đường thẳng $BC$ tại $N$. Gọi $O$ là trung điểm của $AN$.
a) Chứng minh $OC=OD$.
b) Chứng minh tam giác $AKN$ vuông tại $K$.
c) Kẻ $NM$ vuông góc với $AD$ tại $M$. Chứng minh tam giác $BKM$ vuông tại $K$.`),
  ...ca(4, 'hinh_hoc', 22, R`Cho tam giác $ABC$ vuông tại $A$, $M$ là trung điểm của $BC$. Điểm $D$ thuộc đoạn thẳng $AM$. Kẻ $DE,\ DF$ vuông góc với $AB,\ AC$ tại $E,\ F$.
a) Chứng minh tứ giác $AEDF$ là hình chữ nhật.
b) Chứng minh $EF\parallel BC$.
c) Tìm vị trí điểm $D$ trên $AM$ để $BC=4EF$.`),

  // ── V. DẠNG TOÁN KHÁC (số chính phương — nâng cao) ──
  ...ca(5, 'dai', 23, R`Tìm tất cả các số nguyên dương $n>2008$ thỏa mãn $2^{2008}+2^{2012}+2^{2013}+2^{2014}+2^n$ là số chính phương.`),
  ...ca(5, 'dai', 24, R`Tìm tất cả các số nguyên $n$ sao cho $A=n^4+2n^3+2n^2+n+7$ là số chính phương.`),
  ...ca(5, 'dai', 25, R`Tìm tất cả các số nguyên $k$ sao cho $B=k^4-8k^3+23k^2-26k+10$ là số chính phương.`),
  ...ca(5, 'dai', 26, R`Tìm tất cả các số nguyên dương $x,\ y$ sao cho $2^x+5^y+2$ là số chính phương.`),
  ...ca(5, 'dai', 27, R`Tồn tại hay không các số nguyên $a,\ b,\ c$ sao cho: $ab^2c+2,\ bc^2a+2$ và $ca^2b+2$ là các số chính phương?`),
  ...ca(5, 'dai', 28, R`Có hay không hai số nguyên dương khác nhau $x$ và $y$ trong khoảng $(998;1994)$ sao cho $xy+x$ và $xy+y$ là hai số chính phương khác nhau?`),
  ...ca(5, 'dai', 29, R`Cho $B=1\cdot 2\cdot 3+2\cdot 3\cdot 4+\dots+k(k+1)(k+2)$ với $k$ là số tự nhiên. Chứng minh rằng $4B+1$ là số chính phương.`),
  ...ca(5, 'dai', 30, R`Cho số tự nhiên $n$ thỏa mãn $\dfrac{n^2-1}{3}$ là tích của hai số tự nhiên liên tiếp. Chứng minh rằng $n$ là tổng của hai số chính phương liên tiếp.`),
  ...ca(5, 'dai', 31, R`Chứng minh rằng số $A=n^4+2n^3+2n^2+2n+1$ không phải là số chính phương với $n$ là số tự nhiên lớn hơn 1.`),
  ...ca(5, 'dai', 32, R`Chứng minh rằng $A=n^6-n^4+2n^3+2n^2$ không là số chính phương với $n$ là số tự nhiên lớn hơn 1.`),
]

// ── KIỂM ────────────────────────────────────────────────────────────────────
const loi = []
for (const q of CAU) {
  const s = q.noi_dung
  if ((s.match(/\$/g) || []).length % 2) loi.push(`${q.nhan}: số dấu $ lẻ`)
  for (const m of s.matchAll(/\$([^$]+)\$/g)) {
    try { katex.renderToString(m[1], { throwOnError: true, strict: 'ignore' }) } catch (e) { loi.push(`${q.nhan}: KaTeX hỏng «${m[1].slice(0, 50)}» — ${e.message.slice(0, 80)}`) }
    if (/\\times/.test(m[1])) loi.push(`${q.nhan}: khối 8 không dùng \\times`)
    if (/[À-ỹĐđ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`${q.nhan}: chữ Việt ngoài \\text{} trong công thức`)
  }
}
if (new Set(CAU.map((q) => q.nhan)).size !== CAU.length) loi.push('trùng nhãn câu')
if (loi.length) { console.error('❌\n  ' + loi.join('\n  ')); process.exit(3) }

// ── FILE GỐC (5 ảnh → 1 PDF) ───────────────────────────────────────────────
mkdirSync(join(LV, 'img'), { recursive: true })
const anh = ['1.png', '2.webp', '3.webp', '4.png', '5.webp']
const pdf = join(LV, 'goc.pdf')
if (!existsSync(pdf)) {
  const puppeteer = require('puppeteer-core')
  const imgs = anh.map((f) => {
    const p = join(ANH, f); if (!existsSync(p)) throw new Error('thiếu ảnh ' + p)
    const mime = f.endsWith('.png') ? 'png' : 'webp'
    return `<img src="data:image/${mime};base64,${readFileSync(p).toString('base64')}" style="display:block;width:100%;page-break-after:always">`
  }).join('')
  const br = await puppeteer.launch({ executablePath: process.env.CHROME_PATH || 'C:/Program Files/Google/Chrome/Application/chrome.exe', headless: 'new' })
  try {
    const pg = await br.newPage()
    await pg.setContent(`<body style="margin:0">${imgs}</body>`, { waitUntil: 'load' })
    await pg.pdf({ path: pdf, width: '1070px', height: '1320px', printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 } })
  } finally { await br.close() }
}
const sha256 = createHash('sha256').update(readFileSync(pdf)).digest('hex')

// ── de.json (khung) ─────────────────────────────────────────────────────────
const cau = CAU.map((q) => ({ phan: q.phan, so: 0, nhan: q.nhan, kho: q.kho, loai_cau: 'tu_luan', noi_dung: q.noi_dung, lua_chon: null, dap_an: null, dap_an_nguon: null,
  menh_de: null, loi_giai: null, anh: [], anh_giai: [], dang: null, canh_bao: q.canh_bao }))
const dem = {}
for (const q of cau) q.so = (dem[q.phan] = (dem[q.phan] ?? 0) + 1)
const de = {
  khoi: '8', mon: 'Toán', nam: 2026, nguon: 'Trường TH, THCS & THPT Ngôi Sao Hoàng Mai', kieu: 'de_cuong', ten: TEN,
  file: 'De-cuong-giua-ki-1-Toan-8-NSHM-2026.pdf', sha256, thoi_gian_phut: null, thang_diem: 10,
  phan: PHAN.map((p) => ({ ...p, dang_thuc: 'tu_luan', diem_moi_cau: 0 })), cau,
}
writeFileSync(join(LV, 'de.json'), JSON.stringify(de, null, 1))

// ── 12 tệp khung cho trạm soạn ──────────────────────────────────────────────
const NHOM = [
  ['Bài 1', 'Bài 2'], ['Bài 3', 'Bài 4'], ['Bài 5'], ['Bài 6'], ['Bài 7'], ['Bài 8', 'Bài 9'], ['Bài 10', 'Bài 11', 'Bài 12'],
  ['Bài 13', 'Bài 14', 'Bài 15'], ['Bài 16', 'Bài 17', 'Bài 18'], ['Bài 19', 'Bài 20', 'Bài 21', 'Bài 22'],
  ['Bài 23', 'Bài 24', 'Bài 25', 'Bài 26', 'Bài 27'], ['Bài 28', 'Bài 29', 'Bài 30', 'Bài 31', 'Bài 32'],
]
const baiCua = (nhan) => nhan.match(/^(Bài \d+)/)[1]
const dung = new Set()
NHOM.forEach((g, n) => {
  const cs = CAU.filter((q) => g.includes(baiCua(q.nhan)))
  cs.forEach((q) => { if (dung.has(q.nhan)) throw new Error('trùng ' + q.nhan); dung.add(q.nhan) })
  let md = `# ĐỀ | ${TEN}\nnam: 2026\nbo_sach: KNTT\nkieu: de_cuong\n`
  for (const pt of [...new Set(cs.map((q) => q.phan))]) {
    const p = PHAN.find((x) => x.thu_tu === pt)
    md += `\n## PHẦN ${pt} | ${p.ten} | tu_luan\n`
    for (const q of cs.filter((c) => c.phan === pt)) {
      md += `\n### ${q.nhan} | kho=${q.kho} | loai=tu_luan | dap_an=—\n**Đề:** ${q.noi_dung}\n`
      for (const cb of q.canh_bao) md += cb.startsWith('CHƯA CHẮC — ') ? `**Chưa chắc:** ${cb.slice(12)}\n` : `**Ghi chú:** ${cb}\n`
    }
  }
  writeFileSync(join(HERE, `NSHM-GKI-2026.p${n + 1}.soan.md`), md)
  console.log(`p${n + 1}: ${cs.length} câu — ${cs.map((q) => q.nhan.replace('Bài ', '')).join(' ')}`)
})
if (dung.size !== CAU.length) throw new Error(`thiếu câu: ${dung.size}/${CAU.length}`)
const tk = PHAN.map((p) => `${p.ten}: ${cau.filter((q) => q.phan === p.thu_tu).length}`).join(' · ')
console.log(`✔ ${join(LV, 'de.json')} — ${cau.length} câu (${tk}) · sha256 ${sha256.slice(0, 12)}…`)
