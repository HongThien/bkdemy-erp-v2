// ============================================================================
// NTH-GKI-2026.build.mjs — gõ lại "NỘI DUNG ÔN TẬP GIỮA KỲ I" Toán 8 (2026–2027) — Trường THCS Ngọc Thụy (Hà Nội, phường Bồ Đề)
// (PDF 7 trang có lớp chữ, công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi; Thùy gửi 19/10)
//
//   node kho-rules/dai/lo/k8/de-cuong/NTH-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai_md4.png)
//
// Trọng tâm KIẾN THỨC (đề ghi, trang 1): Đại số = Chương I Đa thức (đơn thức; cộng trừ nhân chia đa thức; tìm x, chứng minh biểu thức không phụ thuộc biến; bài toán thực tế về đa thức);
// Hình học = Chương III Tứ giác (chứng minh các tứ giác đặc biệt, song song, vuông góc…). ⇒ KHÔNG hằng đẳng thức (Chương II), KHÔNG đường trung bình / Thalès / Pythagore.
// Cấu trúc: 4 "Dạng" — mỗi Dạng có "Ví dụ" (có lời giải mẫu theo khuôn SEE–THINK–WONDER, đề cương IN SẴN lời giải) + "Bài tập thực hành" — rồi "ĐỀ MINH HỌA" (5 bài).
// Nhập cả "Ví dụ" lẫn "Bài tập thực hành" (đáp số Ví dụ KHÔNG lấy từ lời giải mẫu — giải độc lập; lời giải mẫu có chỗ sai, xem Ghi chú ở Dạng 1 Câu 1).
// Nhãn: "Dạng n Câu 1/2" = Ví dụ (đánh số theo thứ tự Ví dụ trong dạng) · "Dạng n Bài k" = Bài tập thực hành · "ĐMH Bài k" = đề minh họa.
// Tách ý: chỉ ý có dữ kiện RIÊNG (Dạng 2 Bài 2, 3, 4 · ĐMH Bài 4 hai phần); còn lại giữ cả bài.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NTH-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb, anh]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), anh: anh ?? [], canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}${o.loai ?? 'Bài'} ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Đơn thức' },
  { thu_tu: 2, ten: 'Dạng 2. Cộng, trừ, nhân, chia đa thức' },
  { thu_tu: 3, ten: 'Dạng 3. Bài toán thực tế về các phép tính với đơn thức, đa thức' },
  { thu_tu: 4, ten: 'Dạng 4. Hình tổng hợp' },
  { thu_tu: 5, ten: 'D. Đề minh họa' },
]

const CAU = [
  // ══════════ DẠNG 1 — ĐƠN THỨC ══════════
  ...ca(1, 'dai', 'Dạng 1 ', 1, 1, R`Cho đơn thức $A=-8x^3y^2xy$.
a) Thu gọn đơn thức $A$.
b) Tìm bậc, hệ số và phần biến của đơn thức $A$.
c) Biết $B=\dfrac{3}{4}x^4y^3$. Tính $A+B$ và $A\cdot B$.`, { loai: 'Câu', cb: [R`Đề cương in sẵn lời giải mẫu: đề chữ chỉ hỏi "Tính $A+B$", nhưng cột "Bài toán yêu cầu gì" ghi "Tính $A+B$ và $A\cdot B$" ⇒ nhập cả hai.`, R`Lời giải mẫu trong đề cương có lỗi in: ghi $A+B=-8x^4y^3+\dfrac{3}{4}x^4y^3=(-8+\dfrac{3}{4})x^4y^3$ rồi kết luận "$A+B=x^4y^3$" (sai; đúng là hệ số $-\dfrac{29}{4}$). Lời giải ở đây tính lại độc lập.`] }),
  ...ca(1, 'dai', 'Dạng 1 ', 1, 1, R`Cho các đơn thức đồng dạng: $A=2x^4;\ B=-5x^3\cdot x;\ C=-7x\cdot x^3$.
a) Tính $M$ biết $M=A+B-C$ rồi tìm hệ số, phần biến, bậc của $M$.
b) Tính giá trị của $M$ tại $x=0;\ -1;\ 2$.
c) Tính giá trị của $x$ để giá trị tương ứng của $M$ là $4$.`),
  ...ca(1, 'dai', 'Dạng 1 ', 2, 1, R`Cho các đơn thức $\dfrac{1}{2}x^2y^3$ và $3xy^2$.
a) Tìm tích của các đơn thức và cho biết phần hệ số, phần biến, bậc của các đơn thức vừa thu gọn được.
b) Tính giá trị của đơn thức vừa thu được với $x=\dfrac{1}{2};\ y=1$.`),
  ...ca(1, 'dai', 'Dạng 1 ', 3, 1, R`Cho các đơn thức $A=4m^2xy^3z^2$ và $B=16xy^3z^2$.
a) Hai đơn thức có đồng dạng không nếu $m$ là biến? $m$ là hằng số?
b) Tính hiệu $A-B$ trong trường hợp $m$ là hằng số?`),

  // ══════════ DẠNG 2 — CỘNG, TRỪ, NHÂN, CHIA ĐA THỨC ══════════
  ...ca(2, 'dai', 'Dạng 2 ', 1, 1, R`Cho 2 đa thức $A=2x^3-4x^2y+xy^2+1$ và $B=-2x^3-x^2y-3$.
a) Tính $A+B$ và xác định bậc của đa thức $A+B$.
b) Tính giá trị của $A+B$ tại $x=1;\ y=-2$.`, { loai: 'Câu' }),
  ...ca(2, 'dai', 'Dạng 2 ', 2, 1, R`Thực hiện phép chia: $(15x^5y^3-10x^3y^2+20x^4y^4):5x^2y$.`, { loai: 'Câu' }),
  ...ca(2, 'dai', 'Dạng 2 ', 1, 1, R`Cho hai đa thức $A=3x+5xy^2-x^2+15y$ và $B=x^2-5x+xy^2-4y$.
a) Tính $A+B;\ A-B$.
b) Tính giá trị của đa thức $M=A-B$ tại $x=-1;\ y=-1$.`),
  ...tach(2, 'dai', 'Dạng 2 ', 2, 2, R`Tìm đa thức $M$ hoặc $N$ rồi xác định bậc của chúng biết:`, [
    ['a', bt(R`M+5x^2-2xy=6x^2+9xy-y^2`)],
    ['b', bt(R`N-(6x^2-4xy)=7x^2-8xy+y^2`)],
    ['c', bt(R`x^2-2y^2+M=x^2-y^2+3xy^2-1`)],
    ['d', bt(R`N-5y^2+xyz=xy+2y^2-3xyz+4`)]]),
  ...tach(2, 'dai', 'Dạng 2 ', 3, 2, R`Thực hiện các phép chia sau:`, [
    ['a', bt(R`16x^3y^5z^2:(-4x^2y^2z)`)],
    ['b', bt(R`(4x^3y^2)^4:(2xy^2)^3`)],
    ['c', bt(R`(6x^2y^2-9x^3y^4):(-3xy^2)`)],
    ['d', bt(R`(10x^3y^2+12x^4y^3-6x^5y^4):\left(-\dfrac{1}{2}x^3y^2\right)`)],
    ['e', bt(R`\left[(2x^2y)^2+3x^4y^3-6x^3y^2\right]:(xy)^2`)]]),
  ...tach(2, 'dai', 'Dạng 2 ', 4, 2, R`Chứng minh giá trị của mỗi biểu thức sau không phụ thuộc vào giá trị của biến:`, [
    ['a', bt(R`P=(x-1)(x^2+x+1)-x^2(x-1)-x^2-23`)],
    ['b', bt(R`Q=\left(x-\dfrac{1}{2}y\right)(x^2+2y)-x(x^2+2y)+y\left(\dfrac{1}{2}x^2+y\right)-\dfrac{1}{2}`)]]),

  // ══════════ DẠNG 3 — BÀI TOÁN THỰC TẾ ══════════
  ...ca(3, 'dai', 'Dạng 3 ', 1, 3, R`Một mảnh vườn có dạng hình chữ nhật với chiều rộng là $x$ (m), chiều dài là $y$ (m).
a) Viết đa thức biểu thị diện tích của mảnh vườn.
b) Nếu tăng chiều rộng lên $2$ m và giảm chiều dài đi $3$ m thì được mảnh vườn mới. Viết đa thức biểu thị diện tích của mảnh vườn mới.`, { loai: 'Câu' }),
  ...ca(3, 'dai', 'Dạng 3 ', 1, 3, R`Tú muốn làm một cái bể cá không có nắp dạng hình lập phương có kích thước một cạnh là $x$ cm.
a) Viết đa thức biểu thị tổng diện tích kính để làm cái bể đó và dung tích của bể.
b) Tính tổng diện tích kính để làm cái bể đó khi $x=30$ cm.`),
  ...ca(3, 'dai', 'Dạng 3 ', 2, 3, R`Trong một khu nghỉ dưỡng có hai bể bơi dạng hình hộp chữ nhật. Bể thứ nhất có độ sâu là $1{,}4$ m, đáy là hình chữ nhật có chiều dài $x$ mét, chiều rộng $y$ mét. Bể thứ hai có độ sâu $1{,}6$ m, đáy là hình chữ nhật có hai kích thước gấp $3$ lần hai kích thước đáy của bể thứ nhất.
a) Viết và thu gọn đa thức biểu thị tổng số mét khối nước cần có để bơm đầy cả hai bể bơi.
b) Tính giá trị của tổng số mét khối nước cần bơm khi $x=10$ m và $y=5$ m.`),
  ...ca(3, 'dai', 'Dạng 3 ', 3, 3, R`Yến đi mua vở và bút để chuẩn bị cho năm học mới. Biết mỗi quyển vở giá $x$ đồng, mỗi chiếc bút giá $y$ đồng.
a) Viết và thu gọn đa thức biểu thị số tiền Yến phải trả để mua:
• $5$ quyển vở và $3$ cái bút;
• $5$ xấp vở và $3$ hộp bút, biết rằng mỗi xấp vở có $10$ quyển, mỗi hộp bút có $20$ chiếc.
b) Tính giá trị của số tiền Yến phải trả ở cả hai trường hợp trên khi $x=11\,000$ đồng và $y=5\,000$ đồng.`),

  // ══════════ DẠNG 4 — HÌNH TỔNG HỢP ══════════
  ...ca(4, 'hinh_hoc', 'Dạng 4 ', 1, 4, R`Cho $\triangle ABC$ nhọn biết $AB<AC$. Các đường cao $BE,\ CF$ cắt nhau tại $H$. Gọi $M$ là trung điểm của $BC$. Trên tia đối của tia $MH$ lấy điểm $K$ sao cho $MH=MK$.
a) Chứng minh tứ giác $BHCK$ là hình bình hành.
b) Chứng minh $BK\perp AB$.
c) Chứng minh rằng $\triangle MEF$ là tam giác cân.`, { loai: 'Câu' }),
  ...ca(4, 'hinh_hoc', 'Dạng 4 ', 1, 4, R`Cho $\triangle ABC$ vuông tại $A$ ($AC<AB$), đường cao $AH$. Kẻ $HE\perp AB$ tại $E$, kẻ $HF\perp AC$ tại $F$.
a) Chứng minh tứ giác $AEHF$ là hình chữ nhật.
b) Lấy điểm $M$ trên tia $HF$ sao cho $FH=FM$. Chứng minh rằng tứ giác $AMFE$ là hình bình hành.
c) Gọi $I$ là giao điểm của $EM$ và $AF$, $G$ là giao điểm của $EF$ và $HI$. Chứng minh $MG$ đi qua trung điểm của $EH$.`),
  ...ca(4, 'hinh_hoc', 'Dạng 4 ', 2, 4, R`Cho tam giác $ABC$ vuông tại $A$, trung tuyến $AH$. Gọi $E$ là trung điểm của $AB$, trên tia đối của tia $EH$ lấy điểm $M$ sao cho $EM=EH$.
a) Tứ giác $AMBH$ là hình gì? Vì sao?
b) Qua $M$ kẻ đường thẳng $d$ vuông góc với $AC$ tại $F$, lấy điểm $K$ trên $d$ sao cho $FM=FK$. Chứng minh $A$ là trung điểm của $HK$.
c) Nếu tam giác $ABC$ vuông cân tại $A$. Chứng minh $AEMF$ là hình vuông.`, { cb: [R`Đề in "trung tuyến $AM$" nhưng điểm $M$ được định nghĩa lại ngay sau đó (trên tia đối của tia $EH$) và điểm $H$ không được định nghĩa ⇒ nhập là "trung tuyến $AH$" ($H$ là trung điểm của $BC$) cho khớp tên điểm dùng ở các ý a, b, c.`, R`CHƯA CHẮC — đề in "trung tuyến $AM$ … trên tia đối của tia $EH$ lấy điểm $M$"; cách đọc hợp lí duy nhất là trung tuyến $AH$ với $H$ là trung điểm $BC$.`] }),
  ...ca(4, 'hinh_hoc', 'Dạng 4 ', 3, 4, R`Cho hình chữ nhật $ABCD$. Kẻ $AH$ và $CK$ vuông góc với $BD$ lần lượt tại $H$ và $K$.
a) Chứng minh $DH=BK$.
b) Chứng minh tứ giác $AHCK$ là hình bình hành.
c) Trên tia $AH$ lấy điểm $E$ sao cho $AH=HE$. Chứng minh tứ giác $HKCE$ là hình chữ nhật và tứ giác $BCED$ là hình gì? Vì sao?`),

  // ══════════ ĐỀ MINH HỌA ══════════
  ...ca(5, 'dai', 'ĐMH ', 1, 3, R`Cho đơn thức $A=\left(\dfrac{2}{3}x^2y^2\right)\left(\dfrac{-6}{5}x^4y^3\right)$.
a) Thu gọn đơn thức $A$.
b) Xác định bậc và hệ số của đơn thức $A$.`),
  ...ca(5, 'dai', 'ĐMH ', 2, 3, R`Cho hai đa thức $A=-6x^3y-3x^2y+3xy^3-2xy^2+2$ và $B=5x^2y-3xy^3+6x^3y+5+2xy^2$.
a) Tính $A+B;\ A-B$.
b) Tính giá trị của đa thức $M=A+B$ tại $x=-1;\ y=\dfrac{1}{2}$.`),
  ...ca(5, 'dai', 'ĐMH ', 3, 3, R`Bạn An mua một quyển từ điển với giá niêm yết là $x$ nghìn đồng và một món đồ chơi với giá niêm yết là $y$ nghìn đồng. Vì An mua đúng dịp cửa hàng có chương trình khuyến mại nên khi thanh toán giá quyển từ điển được giảm $20$ nghìn đồng, giá món đồ chơi được giảm $30$ nghìn đồng.
a) Viết biểu thức biểu thị số tiền An mua một quyển từ điển và một món đồ chơi sau khi được giảm giá.
b) Tính tổng số tiền An phải trả khi mua hai mặt hàng trên, biết giá một quyển từ điển là $93\,000$ đồng, và một món đồ chơi giá $110\,000$ đồng.`),
  ...tach(5, 'hinh_hoc', 'ĐMH ', 4, 5, '', [
    ['a', R`Hai thanh gỗ độ dài khác nhau, được gắn với nhau tại trung điểm mỗi thanh. Khi các đầu mút của hai thanh gỗ đó tạo thành bốn đỉnh của một tứ giác (hình bên dưới) thì tứ giác đó là hình gì? Vì sao?`, [R`Hình vẽ minh họa: tứ giác $ABCD$ có hai đường chéo $AC,\ BD$ cắt nhau tại $I$; $AI=IC$ và $BI=ID$ (nét gạch), và có dấu góc vuông tại $I$ ($AC\perp BD$).`, R`CHƯA CHẮC — lời đề chỉ nói "gắn với nhau tại trung điểm mỗi thanh" (⇒ hình bình hành) còn hình vẽ minh họa có thêm dấu góc vuông tại $I$ (⇒ hình thoi); đọc theo hình vẽ: hình thoi, và nêu rõ nếu chỉ dùng lời đề thì kết luận được hình bình hành.`], ['de_bai_md4.png']],
    ['b', R`Cho hình vuông $ABCD$. Lấy điểm $E$ trên cạnh $DC$, điểm $F$ trên tia đối của tia $BC$ sao cho $BF=DE$.
a) Chứng minh tam giác $AEF$ vuông cân.
b) Gọi $I$ là trung điểm của $EF$. Trên tia $AI$ lấy điểm $K$ sao cho $AI=IK$. Tứ giác $AEKF$ là hình gì? Vì sao?
c) Chứng minh $I,\ B,\ D$ thẳng hàng.`]]),
  ...ca(5, 'dai', 'ĐMH ', 5, 5, R`Cho đa thức một biến $F(x)=ax^2+bx+c$. Biết $7a+b=0$. Chứng minh rằng: $F(10)\cdot F(-3)$ là một số không âm.`),
]

dung({
  MA: 'NTH-GKI-2026',
  TEN: 'Nội dung ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Ngọc Thụy, Hà Nội',
  NGUON: 'Trường THCS Ngọc Thụy',
  FILE: 'On-tap-giua-ki-1-Toan-8-Ngoc-Thuy-2026.pdf',
  PHAN, CAU, LV, HERE,
})
