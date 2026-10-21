// ============================================================================
// NT-GKI-2026.build.mjs — gõ lại "NỘI DUNG ÔN TẬP GIỮA HỌC KÌ I — MÔN TOÁN 9" năm học 2026–2027, UBND phường Bồ Đề · THCS Ngọc Thụy (Hà Nội)
// (PDF 11 trang Thùy bỏ vào `E:\BK ACADEMY\Tài liệu tham khảo\K9\Đề cương\GKI\` ngày 21/10; trang 34–44 của tập đề cương chung). → de.json (khung) + 9 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/NT-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_P5B1…B4.png, de_P6B3_1.png)
//
// PDF sinh từ Word, có lớp chữ nhưng công thức mất kí hiệu (Equation) ⇒ đọc từ ẢNH trang, không tin pdftotext cho công thức.
// PHẠM VI (đề tự ghi): PHẦN SỐ HỌC = Chương I (phương trình và hệ hai phương trình bậc nhất hai ẩn) · PHẦN HÌNH HỌC = Chương IV (hệ thức lượng trong tam giác vuông). 100% tự luận, 90 phút.
// CẤU TRÚC: mục C.II "Hướng dẫn làm bài" có 4 dạng, mỗi dạng = "a) Ví dụ" (có lời giải mẫu) + "b) Bài tập thực hành" (Bài 1…) — đánh số LẠI TỪ 1 ở mỗi dạng;
//   (Ví dụ 4 không in — Ví dụ 5 là ví dụ thứ tư) ; D. Đề minh họa: Bài I · II · III · V (không in Bài IV).
//   ⇒ khoá câu = (phần, nhãn) (dc-lib). Phần 1 gom 4 ví dụ thành Bài 1–4 (Bài 1 = Ví dụ 1 · Bài 2 = Ví dụ 2 · Bài 3 = Ví dụ 3 · Bài 4 = Ví dụ 5).
// Tách ý (k8.md §12.1, k9.md §10): mỗi phương trình / hệ / ý ĐỘC LẬP một câu; bài lời văn, bài có tam giác (chung dữ kiện), bài nâng cao ⇒ giữ cả bài.
// KHO: câu hình (tỉ số lượng giác, hệ thức cạnh – góc, tam giác vuông) ⇒ `hinh_hoc` (Thùy 18/10: "tất cả bài Hình"); chạy cổng với DANG_HINH_K9=HH00095 (Các bài toán liên quan đến tỉ số lượng giác).
//
// CHỖ ĐỀ CƯƠNG IN THIẾU / IN SAI (đã đọc ảnh 130 dpi + phóng to khi cần):
//   · P4 Bài 1: "loại mỳ tôm bạn Hoa dự định mua" — cả bài nói về bạn Lan ⇒ sửa "bạn Lan"; "dự đinh" ⇒ "dự định".   · P4 Bài 4: "chi tiêt" ⇒ "chi tiết".
//   · P5 Bài 4: "qua song", "với sang được bờ" ⇒ "qua sông", "mới sang được bờ".   · P6 Bài 5: "Cho các số thực thỏa mãn" thiếu "x, y".
//   · P5 Bài 2 / P6 Bài 3.1: số liệu nằm cả trên hình (CB = 5,8 m, góc C = 60°; AC… ) ⇒ viết thêm vào lời văn cho đủ dữ kiện.
//   · P5 Bài 3: hình chỉ vẽ mặt trời + cái cây (không vẽ bóng 3,2 m).
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NT-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
const CC = (s) => 'CHƯA CHẮC — ' + s
const tach = (phan, kho, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const KHONG_NHAP = []

const PHAN = [
  { thu_tu: 1, ten: 'Ví dụ mẫu có lời giải (Bài 1 = Ví dụ 1 · Bài 2 = Ví dụ 2 · Bài 3 = Ví dụ 3 · Bài 4 = Ví dụ 5)' },
  { thu_tu: 2, ten: '1. Phương trình quy về phương trình bậc nhất một ẩn — bài tập thực hành' },
  { thu_tu: 3, ten: '2. Hệ hai phương trình bậc nhất hai ẩn — bài tập thực hành' },
  { thu_tu: 4, ten: '3. Giải bài toán bằng cách lập phương trình và hệ phương trình — bài tập thực hành' },
  { thu_tu: 5, ten: '4. Tỉ số lượng giác của góc nhọn — bài tập thực hành' },
  { thu_tu: 6, ten: 'D. Đề minh họa' },
]

const CAU = [
  // ───────────── Ví dụ mẫu ─────────────
  ...tach(1, 'dai', 1, R`Giải phương trình:`, [
    ['a', bt(R`x(x-4)-3x+12=0`), [R`Đây là Ví dụ 1 của đề cương (Phần "Hướng dẫn làm bài", dạng 1), có lời giải mẫu in sẵn.`]],
    ['b', bt(R`\dfrac{2}{x+1}+\dfrac{1}{x-2}=\dfrac{3}{(x+1)(x-2)}`)]]),
  ...ca(1, 'dai', 2, R`Giải hệ phương trình $\begin{cases} x+2y=3 \\ 6x+y=7 \end{cases}$.`, { cb: [R`Ví dụ 2 của đề cương (dạng 2), có lời giải mẫu hai cách: phương pháp thế và phương pháp cộng đại số.`] }),
  ...ca(1, 'dai', 3, R`Một tổ sản xuất có kế hoạch làm $120$ sản phẩm cùng loại trong một số ngày quy định. Thực tế, mỗi ngày tổ đã sản xuất được nhiều hơn $4$ sản phẩm so với số sản phẩm dự định làm trong một ngày theo kế hoạch. Do đó, tổ đã hoàn thành công việc sớm hơn kế hoạch $2$ ngày và sản xuất thêm được $8$ sản phẩm. Hỏi theo kế hoạch, mỗi ngày tổ sản xuất được bao nhiêu sản phẩm?`, { cb: [R`Ví dụ 3 của đề cương (dạng 3), có lời giải mẫu hai cách: lập phương trình và lập hệ phương trình.`] }),
  ...ca(1, 'hinh_hoc', 4, R`Giải tam giác $ABC$ vuông tại $A$, biết $AB=3$ và $AC=4$ (làm tròn số đo góc đến độ).`, { cb: [R`Ví dụ 5 của đề cương (dạng 4; đề cương không in Ví dụ 4), có lời giải mẫu: tính $BC$ rồi $\widehat{B}$, $\widehat{C}$ bằng $\sin$ hoặc $\cos$, $\tan$. Yêu cầu "làm tròn số đo góc theo độ" lấy từ mục "Xác định yêu cầu" của ví dụ.`] }),

  // ───────────── 1. Phương trình quy về bậc nhất ─────────────
  ...tach(2, 'dai', 1, R`Giải các phương trình sau:`, [
    ['a', bt(R`5x^2-8x=0`), [R`Bài 1 của đề cương in 8 phương trình đánh số 1)–8); nhập thành các ý a–h theo đúng thứ tự.`]],
    ['b', bt(R`(x-2)(x-3)=0`)],
    ['c', bt(R`(5-x)^2(3x-1)=0`)],
    ['d', bt(R`3x^2-3x=(x-1)(x+3)`)],
    ['e', bt(R`(4y+14)^2=(7y+21)^2`)],
    ['f', bt(R`x^2+4x+4=(x+2)(2x-5)`)],
    ['g', bt(R`(1+x)^2-(x-1)^2=0`)],
    ['h', bt(R`(5y-4)^2=(4-5y)^2`)]]),
  ...tach(2, 'dai', 2, R`Giải các phương trình sau:`, [
    ['a', bt(R`\dfrac{1}{x+1}+\dfrac{5}{x-2}=\dfrac{3x}{(x+1)(x-2)}`), [R`Bài 2 của đề cương in 6 phương trình đánh số 1)–6); nhập thành các ý a–f theo đúng thứ tự.`]],
    ['b', bt(R`\dfrac{2x+3}{2x-3}-\dfrac{3}{4x-6}=\dfrac{2}{5}`)],
    ['c', bt(R`\dfrac{x+1}{x-1}-\dfrac{4}{x+1}=\dfrac{3-x^2}{1-x^2}`)],
    ['d', bt(R`\dfrac{x+3}{x-3}-\dfrac{x-3}{x+3}=\dfrac{48}{9-x^2}`)],
    ['e', bt(R`\dfrac{1}{x-1}+\dfrac{2x^2-5}{x^3-1}=\dfrac{4}{x^2+x+1}`)],
    ['f', bt(R`\dfrac{2x}{x-1}+\dfrac{4}{x^2+2x-3}=\dfrac{2x-5}{x+3}`)]]),

  // ───────────── 2. Hệ phương trình ─────────────
  ...tach(3, 'dai', 1, R`Giải các hệ phương trình sau:`, [
    ['a', he(R`x+3y=3`, R`7x-3y=5`), [R`Bài 1 của đề cương in 4 hệ đánh số 1)–4); nhập thành các ý a–d theo đúng thứ tự.`]],
    ['b', he(R`4x-3y-15=0`, R`4x+y=19`)],
    ['c', he(R`2(x+y)+3(x-y)=4`, R`(x+y)+2(x-y)=5`)],
    ['d', he(R`\dfrac{1}{x+2}-\dfrac{3}{y-3}=-2`, R`\dfrac{3}{x+2}+\dfrac{4}{y-3}=7`)]]),

  // ───────────── 3. Lập phương trình / hệ ─────────────
  ...ca(4, 'dai', 1, R`Bạn Lan dự định dùng hết số tiền 900 000 đồng để mua mỳ tôm ủng hộ đồng bào chịu ảnh hưởng của bão Yagi. Khi đến cửa hàng, loại mỳ tôm bạn Lan dự định mua được giảm giá 15 000 đồng/thùng. Do vậy, bạn Lan đã mua được nhiều hơn so với dự định là $2$ thùng mỳ. Tính giá tiền của mỗi thùng mỳ tôm mà bạn Lan đã mua?`,
    { cb: [R`Đề in "loại mỳ tôm bạn Hoa dự định mua" nhưng cả bài chỉ nói về bạn Lan ⇒ sửa thành "bạn Lan"; "dự đinh" ⇒ "dự định".`] }),
  ...ca(4, 'dai', 2, R`Một người đi xe gắn máy, đi từ địa điểm $A$ đến địa điểm $B$ trên một quãng đường dài $35\ \text{km}$. Lúc trở về người đó đi theo con đường khác dài $42\ \text{km}$ với vận tốc kém hơn vận tốc lượt đi là $6\ \text{km/h}$. Thời gian lượt về bằng $\dfrac{3}{2}$ thời gian lượt đi. Tìm vận tốc lượt đi và lượt về.`),
  ...ca(4, 'dai', 3, R`Một xe máy đi từ $A$ đến $B$. Sau đó $1$ giờ, một ô tô cũng đi từ $A$ đến $B$ với tốc độ lớn hơn tốc độ của xe máy là $10\ \text{km/h}$. Biết rằng ô tô và xe máy đến $B$ cùng một lúc. Tính tốc độ của mỗi xe, biết quãng đường $AB$ dài $200\ \text{km}$.`),
  ...ca(4, 'dai', 4, R`Tháng giêng hai tổ sản xuất được $900$ chi tiết máy, tháng hai do cải tiến kĩ thuật tổ I vượt mức $15\%$ và tổ II vượt mức $10\%$ so với tháng giêng, vì vậy hai tổ đã sản xuất được $1010$ chi tiết máy. Hỏi tháng giêng mỗi tổ sản xuất được bao nhiêu chi tiết máy?`,
    { cb: [R`Đề in "chi tiêt" ⇒ sửa thành "chi tiết".`] }),
  ...ca(4, 'dai', 5, R`Một ca nô chạy trên sông trong $8\ \text{h}$, xuôi dòng $81\ \text{km}$ và ngược dòng $105\ \text{km}$. Một lần khác cũng chạy trên khúc sông đó ca nô này chạy trong $4\ \text{h}$, xuôi dòng $54\ \text{km}$ và ngược dòng $42\ \text{km}$. Hãy tính vận tốc xuôi và ngược dòng biết vận tốc dòng nước và vận tốc riêng của ca nô là không đổi.`),
  ...ca(4, 'dai', 6, R`Một người mua hai loại hàng và phải trả tổng cộng $2{,}17$ triệu đồng, kể cả thuế giá trị gia tăng (VAT) với mức $10\%$ đối với loại hàng thứ nhất và $8\%$ đối với loại hàng thứ hai. Nếu thuế VAT là $9\%$ đối với cả hai loại hàng thì người đó phải trả tổng cộng $2{,}18$ triệu đồng. Hỏi nếu không kể thuế VAT thì người đó phải trả bao nhiêu tiền cho mỗi loại hàng?`),

  // ───────────── 4. Tỉ số lượng giác ─────────────
  ...ca(5, 'hinh_hoc', 1, R`Cho $\triangle ABC$ vuông tại $A$, đường cao $AH$. Biết $AB=3\ \text{cm}$, $AC=4\ \text{cm}$ (Hình 19).
a) Tính độ dài $BC$, $AH$.
b) Tính số đo góc $B$, $C$.
c) Đường phân giác trong của góc $A$ cắt $BC$ tại $E$. Tính $BE$, $CE$.`, { anh: ['de_P5B1.png'] }),
  ...ca(5, 'hinh_hoc', 2, R`Tìm chiều cao của tháp canh $AB$ trong hình bên dưới, biết $AB\perp BC$, $BC=5{,}8\ \text{m}$ và $\widehat{ACB}=60^\circ$ (kết quả làm tròn đến hàng phần trăm).`,
    { anh: ['de_P5B2.png'], cb: [R`Số liệu $BC=5{,}8\ \text{m}$ và $\widehat{C}=60^\circ$ chỉ có trên hình của đề cương ⇒ viết thêm vào lời văn.`] }),
  ...ca(5, 'hinh_hoc', 3, R`Một cái cây cao $6\ \text{m}$ đang có bóng dài $3{,}2\ \text{m}$ (như hình vẽ). Tính góc hợp bởi tia nắng với thân cây (biết thân cây vuông góc với mặt đất).`,
    { anh: ['de_P5B3.png'], cb: [R`Hình của đề cương chỉ vẽ mặt trời, tia nắng và cái cây ($6\ \text{m}$), không vẽ bóng $3{,}2\ \text{m}$.`] }),
  ...ca(5, 'hinh_hoc', 4, R`Một khúc sông rộng khoảng $250\ \text{m}$. Một chiếc đò chèo qua sông bị dòng nước đẩy xiên nên phải chèo khoảng $320\ \text{m}$ mới sang được bờ bên kia. Hỏi dòng nước đã đẩy chiếc đò lệch đi một góc $\alpha$ bằng bao nhiêu độ?`,
    { anh: ['de_P5B4.png'], cb: [R`Đề in "qua song", "với sang được bờ" ⇒ sửa thành "qua sông", "mới sang được bờ".`] }),
  ...ca(5, 'hinh_hoc', 5, R`Cho hình chữ nhật $ABCD$ có $AB>AD$. Kẻ $AH\perp BD$ tại $H$. Cho biết $HD=4\ \text{cm}$, $BD=16\ \text{cm}$.
a) Chứng minh $\triangle AHD\backsim\triangle BAD$.
b) Tính $AD$, $\widehat{ADH}$.
c) Gọi $M$, $N$ lần lượt là trung điểm của $AH$, $BH$. Chứng minh $MH\cdot CD=AH\cdot MN$.`),
  ...ca(5, 'hinh_hoc', 6, R`Cho $\triangle ABC$ vuông tại $A$ có đường cao $AH$. Qua $C$ vẽ đường thẳng song song với $AB$ và cắt $AH$ tại $D$. Biết $AB=20\ \text{cm}$, $AC=15\ \text{cm}$.
a) Giải tam giác $ABC$.
b) Chứng minh $\triangle ABC\backsim\triangle HBA$.
c) Chứng minh $AC^2=AB\cdot DC$.
d) Gọi $I$, $K$ lần lượt là trung điểm của $AB$ và $CD$. Chứng minh $I$, $H$, $K$ thẳng hàng.`),

  // ───────────── D. Đề minh họa ─────────────
  ...tach(6, 'dai', 1, R`Giải các phương trình sau:`, [
    ['a', bt(R`(x-1)(3x-6)=0`), [R`Đề minh họa in Bài I (2 điểm) gồm 4 phương trình 1)–4); nhập thành các ý a–d. Đề minh họa in Bài I, II, III, V (không có Bài IV).`]],
    ['b', bt(R`3x^2-3x=(x-1)(x+3)`)],
    ['c', bt(R`\dfrac{3}{x+2}+\dfrac{9}{(x+2)(x-1)}=\dfrac{1}{x-1}`)],
    ['d', bt(R`\dfrac{1}{x+2}+\dfrac{2}{2-x}=\dfrac{2x-3}{x^2-4}`)]]),
  ...ca(6, 'dai', '2.1', R`Một tổ sản xuất có kế hoạch làm $150$ sản phẩm cùng loại trong một số ngày quy định. Thực tế, mỗi ngày tổ đã sản xuất được nhiều hơn $5$ sản phẩm so với số sản phẩm dự định làm trong một ngày theo kế hoạch. Do đó, tổ đã hoàn thành công việc sớm hơn kế hoạch $3$ ngày và sản xuất thêm $30$ sản phẩm. Hỏi theo kế hoạch, mỗi ngày tổ sản xuất được bao nhiêu sản phẩm?`,
    { cb: [R`Đề minh họa in Bài II (3,5 điểm) gồm ba bài con độc lập 1), 2), 3) ⇒ nhập thành ba câu "Bài 2.1", "Bài 2.2", "Bài 2.3".`] }),
  ...ca(6, 'dai', '2.2', R`Nhân dịp ngày Giỗ Tổ Hùng Vương, một siêu thị điện máy đã giảm giá nhiều mặt hàng để kích cầu mua sắm. Giá niêm yết của một chiếc tủ lạnh và một chiếc máy giặt có tổng số tiền là $25{,}4$ triệu đồng. Tuy nhiên, trong dịp này tủ lạnh giảm $40\%$ giá niêm yết và máy giặt giảm $25\%$ giá niêm yết. Vì thế, cô Liên đã mua hai mặt hàng trên với tổng số tiền là $16{,}77$ triệu đồng. Hỏi giá niêm yết của mỗi mặt hàng trên là bao nhiêu?`),
  ...ca(6, 'dai', '2.3', R`Giải hệ phương trình $\begin{cases} 2x+y=1 \\ 3x+4y=-1 \end{cases}$.`),
  ...ca(6, 'hinh_hoc', '3.1', R`Một người $A$ đang ở trên khinh khí cầu ở độ cao $150\ \text{m}$ nhìn thấy một vật $B$ trên mặt đất cách hình chiếu của khí cầu xuống đất một khoảng $285\ \text{m}$ (như hình vẽ). Tính góc hạ của tia $AB$. Nếu khinh khí cầu tiếp tục bay thẳng đứng thì khi góc hạ của tia $AB$ là $46^\circ$ thì độ cao của khinh khí cầu là bao nhiêu (làm tròn đến mét)?`,
    { anh: ['de_P6B3_1.png'], cb: [R`Đề minh họa in Bài III (4 điểm) gồm hai bài con độc lập 1), 2) ⇒ nhập thành hai câu "Bài 3.1", "Bài 3.2". Đề không nêu cách làm tròn số đo góc hạ ở câu đầu.`] }),
  ...ca(6, 'hinh_hoc', '3.2', R`Cho tam giác $ABC$ vuông tại $A$ có $AB=6\ \text{cm}$, $BC=10\ \text{cm}$.
a) Hãy giải tam giác vuông $ABC$ (kết quả làm tròn đến độ).
b) Kẻ đường cao $AI$ ($I\in BC$). Chứng minh $AB^2=BI\cdot BC$. Tính $BI$.
c) Trên cạnh $AC$ lấy điểm $M$ bất kì, kẻ $AE\perp BM$ ($E\in BM$). Chứng minh $\dfrac{\sin\widehat{AMB}}{\cos\widehat{ABC}}=\dfrac{CE}{IM}$.`),
  ...ca(6, 'dai', 5, R`Cho các số thực $x$, $y$ thỏa mãn $x^2-xy+y^2=9$. Tìm giá trị lớn nhất của biểu thức $P=x^2+y^2$.`,
    { cb: [R`Đề minh họa đánh số bài này là "Bài V" (các bài trước là Bài I–III, không có Bài IV) ⇒ nhập nhãn "Bài 5". Đề in "Cho các số thực thỏa mãn" (thiếu "$x$, $y$") ⇒ thêm.`] }),
]

const NHOM = [[1, 1, 4], [2, 1, 1], [2, 2, 2], [3, 1, 1], [4, 1, 6], [5, 1, 3], [5, 4, 6], [6, 1, 2], [6, 3, 5]]

dung({ MA: 'NT-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS Ngọc Thụy (Hà Nội)', NGUON: 'le', NAM: 2026,
  FILE: 'on-tap-giua-hoc-ki-1-toan-9-nam-2026-2027-truong-thcs-ngoc-thuy-ha-noi.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP })
