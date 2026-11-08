// ============================================================================
// NQ-GKI-2026.build.mjs — gõ lại "HƯỚNG DẪN ÔN TẬP GIỮA HỌC KÌ I – KHỐI 6", MÔN TOÁN — Trường THCS Ngô Quyền (Hà Nội), năm học 2026–2027
// (PDF 3 trang, BẢN SCAN không lớp chữ ⇒ đọc từ ẢNH; trang 1 = bìa + lịch kiểm tra, không có đề ⇒ đề thực = trang 2–3)
//
//   node kho-rules/dai/lo/k6/de-cuong/NQ-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_cau6.png, de_bai5.png)
//
// Phạm vi KIẾN THỨC (đề ghi): Số học hết bài 10 (Số nguyên tố); Hình học hết bài 19 (Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân).
// Cấu trúc: I. Trắc nghiệm (Câu 1–8) · II. Tự luận gồm 5 dạng (D1 Tính hợp lý · D2 Tìm x · D3 Toán thực tế · D4 Chia hết, ước, bội · D5 Hình học) · III. Một số bài tập nâng cao (2 ý).
// Nhãn: đề không đánh số bài ⇒ Phần II dùng "Bài k<ý>" với k = SỐ DẠNG (Dạng 1 ⇒ Bài 1a–c; Dạng 2 ⇒ Bài 2a–c; Dạng 3 ⇒ Bài 3a–b; Dạng 4 ⇒ Bài 4.1a–d và 4.2a–d; Dạng 5 ⇒ Bài 5);
//   Phần III ⇒ "NC Bài 1a/1b". Chữ cái a b c d của 4.2 (phân tích 46; 84; 98; 105) là do TÔI đặt theo thứ tự số in.
// Tách ý: D1, D2, D4.1 (từng ý độc lập), D4.2 (4 số tách thành 4 câu), D3 a/b (hai bài toán khác hẳn nhau — sẵn là hai bài riêng trên đề), NC a/b (hai bài khác hẳn nhau).
//   Giữ nguyên cả bài: Bài 5 (hình học thực tế, ý b dùng cạnh của ý a).
// Hình: Câu 6 (4 hình tam giác) · Bài 5 (mảnh đất 9m × 12m). Đề scan, lệch nhẹ — hình cắt từ trang scan.
// Chỗ nghi (người gõ): Bài 1b ngoặc vuông lỗi font · NC Bài 1b dấu "¼" thay "…" · Câu 8 D "ba đường chéo".
//   Trạm đối chiếu 20/10: cả ba hạ xuống ghi chú thường (mã font Symbol xác định duy nhất; Câu 8 đọc kiểu nào cũng chỉ D sai).
//   Bài 4.1c/d: phóng to 400 dpi thấy đề in ĐÚNG ký hiệu ⋮ (ba chấm dọc) ⇒ bỏ ghi chú "in dấu ':'".
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NQ-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
/** tách ý: mỗi ý một câu, câu = lead + ý. bai có thể là '4.1' */
const tach = (phan, kho, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const tachNC = (phan, kho, bai, nhom, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `NC Bài ${bai}${y}`, noi_dung: nd, canh_bao: cb ?? [] }))
const ca = (phan, kho, nhan, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
/** trắc nghiệm: câu hỏi + 4 dòng A. B. C. D. */
const tn = (so, kho, nhom, hoi, ph, o = {}) => ({ phan: 1, kho, nhom, loai: 'trac_nghiem', nhan: `Câu ${so}`, noi_dung: `${hoi}\n${['A', 'B', 'C', 'D'].map((c, i) => `${c}. ${ph[i]}`).join('\n')}`, anh: o.anh ?? [], canh_bao: o.cb ?? [] })

const PHAN = [
  { thu_tu: 1, ten: 'I. Bài tập trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'II. Bài tập tự luận' },
  { thu_tu: 3, ten: 'III. Một số bài tập nâng cao' },
]

const CAU = [
  // ══════════ I. TRẮC NGHIỆM ══════════
  tn(1, 'dai', 1, R`Cho $M$ là tập hợp các chữ cái xuất hiện trong từ “NGO QUYEN”. Cách viết tập hợp $M$ nào dưới đây đúng?`, [
    R`$M=\{N;G;O;Q;U;Y;E;N\}$.`, R`$M=\{N;G;O;Q;U;Y\}$.`, R`$M=\{N;G;O;Q;U;Y;E\}$.`, R`$M=\{N;Q\}$.`]),
  tn(2, 'dai', 1, R`Chữ số thích hợp ở dấu $*$ để $\overline{837*}$ chia hết cho cả 2 và 9 là`, ['9.', '4.', '6.', '0.']),
  tn(3, 'dai', 1, 'Trong các số 1; 3; 5; 7; 9 có bao nhiêu số là số nguyên tố?', ['1.', '2.', '3.', '4.']),
  tn(4, 'dai', 1, 'Kết quả phân tích số 24 ra thừa số nguyên tố là', [R`$3.8$.`, R`$2^3.3$.`, R`$4.6$.`, R`$2^2.3^2$.`]),
  tn(5, 'hgt', 1, 'Một hình lục giác đều có chu vi là 18cm. Độ dài cạnh của hình lục giác đều đó là', ['3cm.', '6cm.', '9cm.', '18cm.']),
  tn(6, 'hgt', 1, 'Hình nào dưới đây là hình tam giác đều', ['Hình 1.', 'Hình 2.', 'Hình 3.', 'Hình 4.'], {
    anh: ['de_cau6.png'],
    cb: ['Đọc hình: Hình 1 = tam giác vuông (có ký hiệu góc vuông), không có ký hiệu bằng nhau; Hình 2 = tam giác cân hẹp, đánh dấu bằng nhau ở HAI cạnh bên, đáy không đánh dấu; Hình 3 = tam giác thường lệch, không ký hiệu gì; Hình 4 = tam giác trông đều, đánh dấu bằng nhau ở cả BA cạnh (hai cạnh bên và đáy). Mỗi hình có nhãn Hình 1…Hình 4 bên dưới.'] }),
  tn(7, 'hgt', 1, 'Một hình chữ nhật có chu vi là 16m. Tổng chiều dài và chiều rộng của hình chữ nhật đó là:', ['8m.', '16m.', '24m.', '32m.']),
  tn(8, 'hgt', 1, 'Khẳng định nào dưới đây sai?', ['Hình chữ nhật có hai đường chéo bằng nhau.', 'Hình thoi có hai đường chéo vuông góc.', 'Hình thoi có bốn cạnh bằng nhau.', 'Hình lục giác đều có ba đường chéo.'], {
    cb: ['Phương án D in "ba đường chéo" (lục giác đều có 9 đường chéo, trong đó 3 đường chéo chính). Đã gõ đúng như in. Hiểu theo chữ in thì D sai; A, B, C đều đúng ⇒ dù đề định viết "ba đường chéo chính" hay không, phương án sai duy nhất vẫn là D.'] }),

  // ══════════ II. TỰ LUẬN ══════════
  // Dạng 1: Tính hợp lý nếu có thể
  ...tach(2, 'dai', 1, 2, 'Tính hợp lý nếu có thể:', [
    ['a', bt(R`76+24:4`)],
    ['b', bt(R`121-21.[(3+2)^2:5-3^0]`), [R`Ảnh scan in ngoặc vuông ở hai đầu cụm "$(3+2)^2:5-3^0$" thành các ký tự dọc "é ê ë" / "ù ú û" — đó là mã các mảnh ngoặc vuông [ ] của font Symbol (trên/giữa/dưới), không phải ngoặc nhọn (ì í î / ü ý þ). Đã đọc là $121-21.[(3+2)^2:5-3^0]$ (trạm đối chiếu xác nhận).`]],
    ['c', bt(R`73+27.49+3^3.51`)]]),
  // Dạng 2: Tìm số tự nhiên x
  ...tach(2, 'dai', 2, 2, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`17-x=8`)],
    ['b', bt(R`39:(2x-1)=13`)],
    ['c', bt(R`2^{x+1}:32=2^7`)]]),
  // Dạng 3: Toán thực tế (hai bài riêng)
  ...ca(2, 'dai', 'Bài 3a', 2, 'Để chuẩn bị cho năm học mới, bố đi siêu thị mua cho Phượng 20 quyển vở, 5 quyển sổ, 6 cái bút. Biết giá mỗi quyển vở là 15 nghìn đồng, giá mỗi quyển sổ là 30 nghìn đồng, giá mỗi cái bút là 5 nghìn đồng. Tính tổng số tiền mà bố của Phượng phải trả cho siêu thị.'),
  ...ca(2, 'dai', 'Bài 3b', 2, 'Trong đợt ủng hộ đồng bào bão lũ, lớp 6A quyên góp được 55 bộ quần áo đồng phục đã qua sử dụng để gửi tặng các bạn học sinh. Cán bộ lớp giặt là cẩn thận và chia đều số quần áo đó vào các thùng quà. Biết số bộ quần áo trong mỗi thùng khoảng từ 7 đến 13 bộ. Hỏi mỗi thùng có bao nhiêu bộ quần áo?'),
  // Dạng 4: Quan hệ chia hết, ước, bội
  ...tach(2, 'dai', '4.1', 3, R`Tìm các số tự nhiên $x$ sao cho:`, [
    ['a', R`$x\in\text{Ư}(12)$ và $2\le x\le 8$.`],
    ['b', R`$x\in\text{B}(5)$ và $20\le x\le 36$.`],
    ['c', R`$x\vdots 5$ và $13<x\le 78$.`],
    ['d', R`$12\vdots x$ và $x>4$.`]]),
  ...tach(2, 'dai', '4.2', 3, 'Phân tích các số sau ra thừa số nguyên tố:', [
    ['a', R`$46$.`], ['b', R`$84$.`], ['c', R`$98$.`], ['d', R`$105$.`]]),
  // Dạng 5: Hình học
  ...ca(2, 'hgt', 'Bài 5', 4, R`Một mảnh đất có dạng hình chữ nhật với chiều dài là 12m và chiều rộng là 9m. Người ta để một phần làm lối đi có dạng hình chữ nhật (như hình vẽ), phần còn lại có dạng hình vuông để làm vườn hoa, được xây hàng rào bao quanh.
a) Tính độ dài của hàng rào bao quanh vườn hoa.
b) Tính diện tích phần lối đi.`, {
    anh: ['de_bai5.png'],
    cb: ['Đọc hình: hình chữ nhật đặt đứng; cạnh ngang phía trên ghi 9m (mũi tên hai đầu), cạnh dọc bên phải ghi 12m (mũi tên hai đầu); phía trên là ô "Vườn hoa" (chiếm phần lớn), phía dưới là dải hình chữ nhật hẹp ghi "Lối đi" chạy hết chiều ngang 9m.'] }),

  // ══════════ III. MỘT SỐ BÀI TẬP NÂNG CAO ══════════
  ...tachNC(3, 'dai', 1, 4, [
    ['a', R`Tìm số tự nhiên $n$ biết $3n+11$ chia cho $n+2$ dư 1.`],
    ['b', R`Cho tổng $M=4+4^2+4^3+4^4+\ldots+4^{97}+4^{98}+4^{99}$.
Hãy giải thích vì sao tổng $M$ chia hết cho 21.`, [R`Ở giữa $4^4$ và $4^{97}$ ảnh scan in ký tự "¼" — đó là mã dấu chấm lửng "…" của font Symbol (0xBC) hiện sai font. Đã đọc là $\ldots$ (99 số hạng, nhóm ba số hạng liền nhau được $4^k.21$ — khớp đề; trạm đối chiếu xác nhận).`]]]),
]

dung({
  MA: 'NQ-GKI-2026',
  TEN: 'Đề cương ôn tập giữa kì I Toán 6 năm 2026–2027 — Trường THCS Ngô Quyền, Hà Nội',
  NGUON: 'Trường THCS Ngô Quyền',
  FILE: 'Huong-dan-on-tap-giua-ki-1-khoi-6-Ngo-Quyen-2026.pdf',
  PHAN, CAU, LV, HERE,
})
