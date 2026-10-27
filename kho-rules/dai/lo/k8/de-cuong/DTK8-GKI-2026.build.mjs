// ============================================================================
// DTK8-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa kì I Toán 8 (2026–2027) — "tuyển tập đề cương", KHÔNG ghi tên trường
// (tệp gốc tên "ĐỀ THI GIỮA KÌ 1 K8 (1).pdf" nhưng NỘI DUNG là đề cương: 5 trang scan sách, tr. 30–34; Thùy gửi 24/10)
//
//   node kho-rules/dai/lo/k8/de-cuong/DTK8-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai8.png, de_bai10…14.png)
//
// Trang 1–4 (tr. 30–33) và nửa đầu trang 5 (tr. 34) là MÔN TOÁN: "Trọng tâm ôn tập" (Đại số: đơn thức nhiều biến, đa thức nhiều biến, các phép tính với
// đa thức nhiều biến · Hình học: tứ giác, hình thang, hình thang cân, hình bình hành, hình chữ nhật, hình thoi và hình vuông) + "II. Bài tập minh hoạ"
// Dạng 1–5, Bài 1–29. Nửa dưới trang 5 là môn KHOA HỌC TỰ NHIÊN (trọng tâm + hình thức + Câu 1–2) — BỎ, không gõ.
// Có vết khoanh tay ở lề (trang KHTN) — bỏ qua. Trang 2–3 có vài chữ lề trái bị cắt (mép sách) — không ảnh hưởng đề.
// Nhãn giữ số Bài liên tục (Bài 1…Bài 29, không tiền tố). 5 phần = 5 "Dạng".
// Tách ý: Bài 1 giữ cả bài (trạm đối chiếu gộp lại 24/10: ý b, c dùng A, C của ý a — như TX); Bài 2 → 2a,2b,2c,2d,2e,2g (đề KHÔNG có ý f); Bài 3, 4, 5 từng ý;
//   Bài 6, 7, 8, 9 giữ cả bài (ý sau dùng ý trước); Bài 10–14 bài hình thực tế có hình sẵn ⇒ giữ cả bài + cắt hình; Bài 15–21 hình chứng minh
//   KHÔNG tách ý, KHÔNG có hình sẵn; Bài 22–29 mỗi bài một câu.
// Chỗ nghi: Bài 1c ("y ≐ 2" — có chấm bụi trên dấu =) · Bài 8 (hình: mũi tên y+1 gán cho khu nào) · Bài 21c (đề in AND không có dấu góc).
//   → Trạm đối chiếu 24/10 đã xem ảnh phóng to, quyết hết (y=2; y+1 = cạnh khu hoa; góc AND); biên bản DTK8-GKI-2026.doichieu.md.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/DTK8-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Thực hiện phép tính' },
  { thu_tu: 2, ten: 'Dạng 2. Tìm x' },
  { thu_tu: 3, ten: 'Dạng 3. Bài toán có nội dung thực tế' },
  { thu_tu: 4, ten: 'Dạng 4. Hình học' },
  { thu_tu: 5, ten: 'Dạng 5. Một số bài tập nâng cao' },
]

const CAU = [
  // ══════════ Dạng 1. Thực hiện phép tính ══════════
  // Bài 1: a) xác định hệ số, phần biến, bậc 4 đơn thức; b) giá trị của A (mục 3 của a); c) giá trị của C (mục 4 của a)
  { phan: 1, kho: 'dai', nhom: 1, nhan: 'Bài 1', anh: [],
    noi_dung: R`a) Xác định hệ số, phần biến, bậc của các đơn thức:
1) $Q=-x^2y^5\cdot(-xy)$
2) $P=\dfrac{-3}{4}x^2y\cdot\left(\dfrac{2}{3}xy^2z\right)$
3) $A=\left(\dfrac{2}{3}x^2y^2\right)\left(\dfrac{-6}{5}x^4y^3\right)$
4) $C=\left(-5xy^3z\right)\cdot\left(-4x^2\right)^2$
b) Tính giá trị của đơn thức $A$ tại $x=-1,\ y=-2$.
c) Tính giá trị của đơn thức $C$ tại $x=-1,\ y=2,\ z=\dfrac{-1}{2}$.`,
    canh_bao: [R`Đề in dấu chấm giữa hai đơn thức (mục 1, 2, 4) = dấu nhân — đã nhập thành $\cdot$.`,
      'Giữ cả bài (ý b dùng A, ý c dùng C ở ý a).',
      R`Ý c) đề in "y ≐ 2": chấm phía trên dấu "=" là bụi in (trạm đối chiếu phóng 400 dpi: không có dấu trừ trước số 2) — đọc $y=2$.`] },

  ...tach(1, 'dai', '', 2, 1, R`Thực hiện phép tính:`, [
    ['a', bt(R`2xy\left(x+3y^2\right)`)],
    ['b', bt(R`-7x^2(3x-4y)`)],
    ['c', bt(R`\left(3x^2-4\right)(x+3y)`)],
    ['d', bt(R`2x(1-x)-(2x-1)(x+1)`)],
    ['e', bt(R`x^2y(xy+1)-(xy-1)\left(x^2y+1\right)`)],
    ['g', bt(R`\left(4x^4-8x^2y^2+12x^5y\right):\left(-4x^2\right)`), [R`Đề đánh nhãn a, b, c, d, e, g (KHÔNG có ý f) — giữ đúng như in.`]]]),

  // ══════════ Dạng 2. Tìm x ══════════
  ...tach(2, 'dai', '', 3, 2, R`Tìm $x$ biết:`, [
    ['a', bt(R`2(x+5)-4x=1`)],
    ['b', bt(R`3(x-2)+2(x-3)=5`)],
    ['c', bt(R`(5-2x)+2(x-1)=13`), [R`Đề in đúng $(5-2x)+2(x-1)=13$ (trạm đối chiếu phóng 400 dpi); rút gọn được $3=13$ ⇒ phương trình vô nghiệm (có thể đề in lỗi) — giải bình thường, kết luận vô nghiệm.`]],
    ['d', bt(R`3\left(\dfrac{4}{3}x+1\right)+4(x-2)=10`)]]),
  ...tach(2, 'dai', '', 4, 2, R`Tìm $x$ biết:`, [
    ['a', bt(R`x(5-2x)+2x(x-1)=13`)],
    ['b', bt(R`5\left(x^2-3x+1\right)+x(1-5x)=x-2`)],
    ['c', bt(R`12x^2-4x(3x-5)=10x-17`)],
    ['d', bt(R`4(2-x)+x(x+6)=x^2`)],
    ['e', bt(R`3x(12x-4)-9x(4x-3)=30`)],
    ['f', bt(R`(x-2026)x-2026(2026-x)=0`)]]),
  ...tach(2, 'dai', '', 5, 3, R`Tìm $x$ biết:`, [
    ['a', bt(R`(x-3)(x+3)-x(x-5)=1`)],
    ['b', bt(R`x(x-7)-(x-2)(x+5)=0`)],
    ['c', bt(R`(12x-5)(4x-1)+(3x-7)(1-16x)=81`)],
    ['d', bt(R`(2x+1)(x-3)-(3+x)(2x-1)=0`)],
    ['e', bt(R`(3x-1)(2x+7)-(x+1)(6x-5)=16`)],
    ['f', bt(R`(3x-4)(x-2)=3x(x-9)-3`)]]),

  // ══════════ Dạng 3. Bài toán có nội dung thực tế ══════════
  ...ca(3, 'dai', '', 6, 3, R`Một xe khách đi từ Quảng Ninh lên Hà Nội với vận tốc $(9x+15)$ km/h trong thời gian $(x-2)$ giờ.
a) Viết biểu thức đại số tính quãng đường Quảng Ninh – Hà Nội theo $x$.
b) Tính quãng đường Quảng Ninh – Hà Nội khi $x=5$.`),
  ...ca(3, 'dai', '', 7, 3, R`Thầy An dự định mua $x$ quyển vở để trao thưởng cho những học sinh tiến bộ cuối năm học, mỗi quyển vở giá $y$ đồng. Nhưng khi đến cửa hàng thầy An thấy giá vở đã giảm $2000$ đồng mỗi quyển nên quyết định mua thêm $30$ quyển.
a) Tìm đa thức biểu thị số tiền thầy An phải trả cho cửa hàng.
b) Em hãy cho biết bậc của đa thức vừa tìm được ở câu a.`),
  ...ca(3, 'dai', '', 8, 3, R`Bác Nam có một mảnh vườn hình chữ nhật. Bác chia mảnh vườn này ra làm hai khu đất hình chữ nhật: Khu thứ nhất dùng để trồng cỏ. Khu thứ hai dùng để trồng hoa. (Với các kích thước có trong hình vẽ).
a) Tính diện tích khu đất dùng để trồng cỏ theo $x,\ y$.
b) Tính diện tích đất dùng để trồng cỏ với $x=4$ và $y=4$.`, { anh: ['de_bai8.png'], cb: [
    R`Đọc hình: mảnh vườn hình chữ nhật vẽ nghiêng, chia bằng một đoạn song song cạnh ngắn thành khu cỏ (lớn, phía trên) và khu hoa (nhỏ, góc dưới); ghi kích thước: cạnh dài bên trái $2y+12$ (m), cạnh ngắn phía dưới $2x$ (m), và $y+1$ (m) ghi cạnh dưới bên phải (mũi tên song song cạnh dài, chỉ phần cạnh dài của khu hoa).`,
    R`Trạm đối chiếu (phóng 400 dpi) xác nhận: đoạn chia khu song song cạnh $2x$; mũi tên "$y+1$ (m)" chạy dọc cạnh dài bên phải, từ góc dưới phải tới đúng chỗ đoạn chia ⇒ khu hoa có hai cạnh $2x$ và $y+1$ (m), khu cỏ rộng $2x$, dài $(2y+12)-(y+1)=y+11$.`] }),
  ...ca(3, 'dai', '', 9, 3, R`Giá của một cái bánh ngọt là $a$ (nghìn đồng), bạn Hà dự định mua $b$ cái bánh ngọt để tổ chức liên hoan. Nhân dịp kỷ niệm $70$ năm ngày Giải phóng Thủ Đô $10/10/2024$, chủ cửa hàng bánh đã giảm giá $2$ nghìn đồng một cái nên bạn Hà đã mua thêm $7$ cái nữa.
a) Viết đa thức biểu thị số tiền mà bạn Hà phải trả cho cửa hàng?
b) Tính số tiền bạn Hà trả cửa hàng khi $a=12;\ b=48$.`),

  // ══════════ Dạng 4. Hình học ══════════
  ...ca(4, 'hinh_hoc', '', 10, 4, R`Một khung ảnh dạng hình vuông $ABCD$ (như hình vẽ bên). Cho biết $AC=28\ \text{cm}$. Tính độ dài $DB$.`, { anh: ['de_bai10.png'], cb: [
    R`Đọc hình: khung ảnh viền dày, bốn đỉnh $A$ (trên trái), $B$ (trên phải), $C$ (dưới phải), $D$ (dưới trái); vẽ hai đường chéo $AC$ và $DB$ cắt nhau ở giữa; không có số đo trên hình (hình vẽ trông hơi dẹt, không cần để ý).`] }),
  ...ca(4, 'hinh_hoc', '', 11, 4, R`Mặt của bàn học trong phòng Thí nghiệm có dạng hình thang cân $ABCD$ (như hình vẽ bên). Cho biết $BC=80\ \text{cm}$. Tính độ dài cạnh $AD$.`, { anh: ['de_bai11.png'], cb: [
    R`Đọc hình: mặt bàn hình thang, $DC$ là cạnh đáy trên (dài hơn, $D$ trái, $C$ phải), $AB$ là cạnh đáy dưới (ngắn hơn, $A$ trái, $B$ phải); $AD$ và $BC$ là hai cạnh bên; không có số đo trên hình.`] }),
  ...ca(4, 'hinh_hoc', '', 12, 4, R`Một mảnh vườn có dạng hình chữ nhật $MNPQ$ (như hình vẽ bên). Cho biết $MN=15\ \text{m};\ NP=11\ \text{m}$. Tính độ dài cạnh $QP$.`, { anh: ['de_bai12.png'], cb: [
    R`Đọc hình: hình chữ nhật $MNPQ$ ($M$ trên trái, $N$ trên phải, $P$ dưới phải, $Q$ dưới trái), trong vườn có năm luống cây; không có số đo trên hình.`] }),
  ...ca(4, 'hinh_hoc', '', 13, 4, R`Mặt trước của một công trình xây dựng được làm bằng kính có dạng hình thoi $EFGH$ với $M$ là giao điểm của hai đường chéo (Hình bên). Cho biết $EM=36\ \text{m}$. Tính độ dài đường chéo $EG$.`, { anh: ['de_bai13.png'], cb: [
    R`Đọc hình: tứ giác $EFGH$ ($E$ trên trái, $F$ trên phải, $G$ dưới phải, $H$ dưới trái, cạnh $EF$ và $HG$ nằm ngang) vẽ hai đường chéo $EG$ và $FH$ cắt nhau tại $M$; không có số đo trên hình (hình vẽ nghiêng như hình bình hành).`] }),
  ...ca(4, 'hinh_hoc', '', 14, 4, R`Mặt trước của một công trình xây dựng được làm bằng kính có dạng hình bình hành $EFGH$ (Hình bên). Cho biết $\widehat{HEF}=50^\circ$. Tính số đo góc $FGH$.`, { anh: ['de_bai14.png'], cb: [
    R`Đọc hình: hình bình hành $EFGH$ ($E$ trên trái, $F$ trên phải, $G$ dưới phải, $H$ dưới trái, $EF\parallel HG$ nằm ngang); không có số đo trên hình. Đề in "HEF = 50°" (góc ở đỉnh $E$) và hỏi "góc FGH" (góc ở đỉnh $G$).`] }),

  ...ca(4, 'hinh_hoc', '', 15, 4, R`Cho $\triangle ABC$ cân ở $A$ có điểm $D$ trên cạnh $BC$. Kẻ $DM\parallel AC,\ DN\parallel AB$.
a) Chứng minh $AMDN$ là hình bình hành.
b) $\triangle BDM$ là tam giác gì?
c) So sánh $DM+DN$ với $AB$.`, { cb: [R`Đề không nói rõ $M$, $N$ thuộc cạnh nào (đọc theo ngữ cảnh: $M\in AB$, $N\in AC$) — gõ đúng như in.`] }),
  ...ca(4, 'hinh_hoc', '', 16, 4, R`Cho hình bình hành $ABCD$. Gọi $E,\ K$ lần lượt là trung điểm của $CD$ và $AB$. Đường chéo $BD$ cắt $AE,\ AC,\ CK$ lần lượt tại $N,\ O,\ M$.
a) Chứng minh $AECK$ là hình bình hành.
b) Chứng minh ba điểm $O,\ E,\ K$ thẳng hàng.
c) Chứng minh $DN=NM=MB$.
d) Chứng minh $AE=3KM$.`),
  ...ca(4, 'hinh_hoc', '', 17, 5, R`Cho $\triangle ABC$ nhọn, các đường trung tuyến $AM,\ BN$ cắt nhau tại $G$. Trên tia $BN$ lấy điểm $E$ sao cho $N$ là trung điểm của $EG$.
a) Chứng minh tứ giác $AGCE$ là hình bình hành.
b) Trên tia $AM$ lấy điểm $F$ sao cho $AG=GF$. Chứng minh $MG=MF,\ BF\parallel AE$.
c) Để $AECF$ là hình thang cân thì $\triangle ABC$ cần thêm điều kiện gì?`),
  ...ca(4, 'hinh_hoc', '', 18, 5, R`Cho $\triangle ABD$ vuông tại $A$ có $AB<AD$. $M$ là trung điểm của $BD$. Lấy $C$ sao cho $M$ là trung điểm của $AC$.
a) Chứng minh $ABCD$ là hình chữ nhật.
b) Trên tia đối của tia $DA$ lấy điểm $E$ sao cho $DA=DE$. Gọi $I$ là trung điểm của $CD$. Chứng minh $IB=IE$.
c) Kẻ $AH\perp BD$. Lấy $K$ sao cho $H$ là trung điểm của $AK$. Chứng minh $BDCK$ là hình thang cân.`),
  ...ca(4, 'hinh_hoc', '', 19, 5, R`Cho $\triangle ABC$ vuông tại $A$, đường trung tuyến $AM$. Gọi $I$ là trung điểm của $AC$, Trên tia đối của tia $IM$ lấy điểm $K$ sao cho $IK=IM$.
a) Chứng minh $AMCK$ là hình thoi.
b) Chứng minh $AKMB$ là hình bình hành.
c) Tìm điều kiện của $\triangle ABC$ để tứ giác $AMCK$ là hình vuông.`, { cb: [R`Đề in dấu phẩy rồi viết hoa "Trên" ("trung điểm của AC, Trên tia đối…") — gõ đúng như in.`] }),
  ...ca(4, 'hinh_hoc', '', 20, 5, R`Cho $\triangle DEF$ vuông tại $D$ có $DE>DF$. $DM$ là đường trung tuyến. Gọi $MN$ là đường vuông góc kẻ từ $M$ đến $DE$, $MK$ là đường vuông góc kẻ từ $M$ đến $DF$. Trên tia $MN$ lấy $H$ sao cho $N$ là trung điểm của $MH$.
a) Tứ giác $DKMN$ là hình gì?
b) Gọi $O$ là trung điểm của $DM$. Chứng minh $3$ điểm $H,\ O,\ F$ thẳng hàng.
c) $\triangle DEF$ cần thêm điều kiện gì để tứ giác $DKMN$ là hình vuông`),
  ...ca(4, 'hinh_hoc', '', 21, 5, R`Cho $\triangle ABC$ vuông cân tại $A$. Gọi $M$ là trung điểm của $BC$. Trên tia đối của tia $MA$ lấy điểm $D$ bất kì. Từ $D$ kẻ các đường thẳng vuông góc với $AB,\ AC$ lần lượt tại $E,\ F$.
a) Chứng minh $AEDF$ là hình vuông.
b) Chứng minh $EF\parallel BC$.
c) Qua $E$ kẻ đường thẳng vuông góc với $MF$ tại $N$. Chứng minh $\widehat{AND}=90^\circ$.`, { cb: [R`Ý c) đề in "AND = 90⁰" không có dấu góc trên "AND" và dấu độ in là số mũ 0 — đã nhập thành $\widehat{AND}=90^\circ$ (đọc là góc $AND$).`] }),

  // ══════════ Dạng 5. Một số bài tập nâng cao ══════════
  ...ca(5, 'dai', '', 22, 6, R`Xác định dấu của $c$, biết rằng $2a^3bc$ trái dấu với $-3a^5b^3c^2$.`),
  ...ca(5, 'dai', '', 23, 6, R`Chứng minh rằng ba đơn thức $\dfrac{-1}{4}x^3y^4;\ \dfrac{-4}{5}x^4y^3;\ \dfrac{1}{2}xy$ không thể cùng có giá trị âm.`),
  ...ca(5, 'dai', '', 24, 6, R`Tìm các số tự nhiên có $3$ chữ số, sao cho hiệu của số ấy và số gồm $3$ chữ số ấy viết theo thứ tự ngược lại là một số chính phương.`, { cb: [R`Ghi chú trạm đối chiếu: hiệu $\overline{abc}-\overline{cba}=99(a-c)$; $99=9\cdot 11$ nên chỉ chính phương khi $a=c$ (hiệu $=0=0^2$) — đề in đúng như vậy, trạm soạn lưu ý đáp số là các số có $a=c$.`] }),
  ...ca(5, 'dai', '', 25, 6, R`Tìm số tự nhiên $\overline{abc}\ (a>b>c>0)$ sao cho $\overline{abc}+\overline{bca}+\overline{cab}=666$.`),
  ...ca(5, 'dai', '', 26, 7, R`Tìm số tự nhiên $\overline{abc}$ có ba chữ số khác nhau, sao cho $3a+5b=8c$.`),
  ...ca(5, 'dai', '', 27, 7, R`Cho đa thức $P(x)=x^3+ax^2+bx+c$, trong đó $a,\ b,\ c$ là hằng số. Biết $P(2)=0$ và $P(3)=0$. Tính $P(5)-P(0)$.`),
  ...ca(5, 'dai', '', 28, 7, R`Cho $a+b+c=2p$. Chứng minh đẳng thức $2bc+b^2+c^2-a^2=4p(p-a)$.`),
  ...ca(5, 'dai', '', 29, 7, R`Cho $a+b+c=0$. Chứng minh rằng $M=N=P$, với $M=a(a+b)(a+c);\ N=b(b+c)(b+a);\ P=c(c+a)(c+b)$.`),
]

dung({
  MA: 'DTK8-GKI-2026',
  TEN: 'Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — tuyển tập đề cương (Trọng tâm ôn tập + Bài tập minh hoạ, tr. 30–34; không ghi tên trường)',
  NGUON: 'Tuyển tập đề cương (không ghi tên trường)',
  FILE: 'DE-THI-GIUA-KI-1-K8.pdf',
  PHAN, CAU, LV, HERE,
})
