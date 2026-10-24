// ============================================================================
// NTL-NC-2026.build.mjs — gõ lại "PHIẾU BỔ SUNG NÂNG CAO TOÁN 6" + "ĐỀ CƯƠNG ÔN TẬP GIỮA HỌC KÌ I TOÁN 6" (2026–2027) — Trường THCS Nam Từ Liêm (Hà Nội)
// (PDF 16 trang, KHÔNG có bìa — trang 1 là đề luôn; có lớp chữ nhưng công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi + phóng 200–400 dpi)
//
//   node kho-rules/dai/lo/k6/de-cuong/NTL-NC-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_*.png đã cắt)
//
// Phạm vi KIẾN THỨC (đề ghi): Tiết 19–20 số nguyên tố, hợp số, phân tích ra thừa số nguyên tố, số ước · Tiết 21–22 chu vi, diện tích hình bình hành, hình chữ nhật, hình vuông,
// hình thoi, hình thang cân · Tiết 23–25 ôn tập giữa kì I (tập hợp, các phép toán trong ℕ, chia hết, ước/bội, số nguyên tố, tam giác đều, hình vuông, lục giác đều,
// hình chữ nhật, hình thoi, hình bình hành) · 3 đề tham khảo.
// Cấu trúc (16 trang): (1) Tiết 19 [tr.1] · (2) Tiết 20 [tr.1–2] · (3) Tiết 21 [tr.2–4] · (4) Tiết 22 [tr.5–6] — mỗi tiết gồm I. Bài tập trên lớp (A. Trắc nghiệm, B. Tự luận)
// + II. Bài tập về nhà · (5) Đề cương ôn tập GK I (Tiết 23–25) [tr.7–12]: I. Trắc nghiệm Câu 1–40 · II. Bài tập rèn kĩ năng Dạng 1–6 · (6) III. Một số đề tham khảo [tr.13–16]:
// Đề số 1, 02, 03 — mỗi đề I. Trắc nghiệm Câu 1–8 (A–D) + II. Tự luận Bài 1–5 (Bài 5: chọn một trong hai câu, một câu bằng tiếng Anh).
//
// NHÃN (mỗi nhãn duy nhất): tiền tố theo mục — 'T19 ' 'T20 ' 'T21 ' 'T22 ' (câu về nhà thêm 'VN '; trắc nghiệm trên lớp 'Câu N'; tự luận 'Bài N'), 'ÔT Câu N' (1–40),
// 'ÔT D1 Bài N' (1–8), 'ÔT D2 Bài 1.N' (11 ý) · 'ÔT D2 Bài 2.N' (5 ý), 'ÔT D3 Bài …', 'ÔT D4 Bài …', 'ÔT D5 Bài …', 'ÔT D6 Bài …', 'TK1 / TK2 / TK3 Câu N | Bài N'.
// LƯU Ý T19: Bài 1 (bảng Đúng/Sai) đã chiếm nhãn 'T19 Bài 1' ⇒ phần Tự luận của Tiết 19 mang nhãn 'T19 TL Bài N' (tránh trùng); các tiết khác tự luận là 'T20 Bài N'… (không có bảng).
// Bài "chọn một trong hai câu" (TK Bài 5) nhập cả hai: 'TK1 Bài 5.1', 'TK1 Bài 5.2' (…).
// Tách ý: chỉ ý có dữ kiện RIÊNG (Tiết 19–20 các bài phân tích / đếm ước / thay dấu *, Dạng 1, Dạng 2, Dạng 3 Bài 1–3, Dạng 6 Bài 1–5, Bài 1–2 của đề tham khảo);
// bài thực tế nhiều ý chung dữ kiện, bài hình, bài chứng minh một đề (T19 TL Bài 3, T19/T22…) ⇒ giữ cả bài.
// Có VẾT BÚT (khoanh đáp án, gạch chân 'Bài N', tích ô Đúng/Sai ở trang 1–3) — ĐÃ BỎ QUA, chỉ gõ đề.
// Số in "12 000", "27 360 000" … đã gõ LIỀN (k6.md §3). Đề cương KHÔNG có đáp án / lời giải.
// Chỗ nghi: xem canh_bao ('CHƯA CHẮC — …') của từng câu.
// ĐỐI CHIẾU (Opus, 24/10): xem NTL-NC-2026.doichieu.md — sửa T20 Câu 2B (thiếu chữ), Đọc hình T22 VN 2 / ÔT D6 7 / TK1 Câu 7, bỏ ghi chú sai TK1 Câu 6 và cờ KT_NGOAI.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NTL-NC-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
/** ‹12 m› → $12\ \text{m}$ ; ‹6 cm2› → $6\ \text{cm}^2$ (đơn vị trong lời văn) */
const U = (s) => s.replace(/‹([^›]+)›/g, (_, c) => { const i = c.indexOf(' '); const n = c.slice(0, i); const u = c.slice(i + 1); const m2 = u.match(/^(cm|dm|m)2$/); return `$${n}\\ \\text{${m2 ? m2[1] : u}}${m2 ? '^2' : ''}$` })
/** tách ý: mỗi ý một câu; nhãn = tiền tố + hậu tố ý; nội dung = lead + ý. ys = [[hậu tố nhãn, nội dung, [canh_bao]]] */
const tach = (phan, kho, pre, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}${y}`, noi_dung: U(`${lead} ${nd}`.trim()), canh_bao: cb ?? [] }))
/** giữ nguyên cả bài */
const ca = (phan, kho, nhan, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan, noi_dung: U(nd), anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
/** câu trắc nghiệm 4 phương án */
const tn = (phan, kho, nhan, nhom, stem, opts, o = {}) => [{ phan, kho, nhom, loai: 'trac_nghiem', nhan,
  noi_dung: U(`${stem}\n${opts.map((t, i) => `${'ABCD'[i]}. ${t}`).join('\n')}`), anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const DK_CHIA_HET = 'Đề cương in ký hiệu chia hết "⋮" — đã nhập thành $\\vdots$.'
const DOC_HINH = (s) => `Đọc hình: ${s}`
const KT_NGOAI = 'CHƯA CHẮC — kiến thức có thể ngoài chương trình khối 6.'
const TIENG_ANH = 'Đề bằng TIẾNG ANH — đã gõ nguyên văn; nội dung toán trong phạm vi khối 6 nâng cao (trạm đối chiếu đã xét, bỏ cờ "ngoài chương trình").'

const PHAN = [
  { thu_tu: 1, ten: 'Phiếu bổ sung nâng cao tuần 7 — Tiết 19: Số nguyên tố, hợp số (tiết 1)' },
  { thu_tu: 2, ten: 'Tiết 20: Số nguyên tố, hợp số (tiết 2)' },
  { thu_tu: 3, ten: 'Tiết 21: Chu vi, diện tích các hình (tiết 1)' },
  { thu_tu: 4, ten: 'Phiếu bổ sung nâng cao tuần 8 + 9 — Tiết 22: Chu vi, diện tích các hình (tiết 2)' },
  { thu_tu: 5, ten: 'Ôn tập GK I (Tiết 23–25) — I. Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 6, ten: 'Ôn tập GK I (Tiết 23–25) — II. Bài tập rèn kĩ năng (Dạng 1–6)' },
  { thu_tu: 7, ten: 'Đề tham khảo số 1 — A. Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 8, ten: 'Đề tham khảo số 1 — II. Tự luận' },
  { thu_tu: 9, ten: 'Đề tham khảo số 02 — I. Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 10, ten: 'Đề tham khảo số 02 — II. Tự luận' },
  { thu_tu: 11, ten: 'Đề tham khảo số 03 — I. Trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 12, ten: 'Đề tham khảo số 03 — II. Tự luận' },
]

const CAU = [
  // ══════════ (1) TIẾT 19 — SỐ NGUYÊN TỐ, HỢP SỐ (TIẾT 1) ══════════
  ...ca(1, 'dai', 'T19 Bài 1', 1, R`Mỗi khẳng định sau đúng hay sai? Đánh dấu "x" vào ô thích hợp.
1) Số nguyên tố là số tự nhiên lớn hơn 1, chỉ có 2 ước là 1 và chính nó.
2) Số 1 là số nguyên tố.
3) Hợp số là số tự nhiên có nhiều hơn 2 ước.
4) Muốn chỉ ra một số tự nhiên là hợp số, ta cần chỉ ra số đó có ít nhất 3 ước.
5) Mọi số nguyên tố đều là số lẻ.
6) Có hai số tự nhiên liên tiếp đều là số nguyên tố.
7) Có ba số lẻ liên tiếp đều là số nguyên tố.
8) Mọi số nguyên tố đều có chữ số tận cùng là một trong các chữ số $1,3,7,9$.`, { cb: ['Bảng Đúng/Sai 8 khẳng định — đáp án phải tự giải.'] }),
  ...tn(1, 'dai', 'T19 Câu 1', 1, R`Trong các số sau, số nào là số nguyên tố?: $2;6;11;17;21;29$`,
    [R`$2;6;11;17;29$`, R`$6;11;17;21;29$`, R`$2;11;17;29$`, R`$2;6;11;17$`]),
  ...tn(1, 'dai', 'T19 Câu 2', 1, R`Tập hợp nào chỉ gồm các hợp số?`,
    [R`$\{2;3;5\}$`, R`$\{2;4;6\}$`, R`$\{4;6\}$`, R`$\{0;2;4\}$`]),
  ...tn(1, 'dai', 'T19 Câu 3', 1, R`Có bao nhiêu số nguyên tố $x$ thỏa mãn $60<x<70$?`, ['$1$.', '$2$.', '$3$.', '$4$.']),
  ...tn(1, 'dai', 'T19 Câu 4', 1, R`Kết quả của phép tính nào sau đây là hợp số?`,
    [R`$15-2+1$`, R`$15-3.4$`, R`$15:(6-3)$`, R`$30-(13-2)$`]),
  ...tn(1, 'dai', 'T19 Câu 5', 1, R`$\overline{9x}$ là số nguyên tố khi:`, [R`$x=5$`, R`$x=7$`, R`$x=1$`, R`$x=3$`]),
  ...tach(1, 'dai', 'T19 TL Bài 1', 1, '', [
    ['.1', R`Trong các số sau đây; số nào là số nguyên tố, số nào là hợp số, vì sao? $12;37;55;61;87$`],
    ['.2', R`Thay dấu $*$ bằng số thích hợp để số sau là số nguyên tố: $\overline{2*}$ ; $\overline{*7}$`],
    ['.3', R`Thay dấu $*$ bằng số thích hợp để số sau là hợp số: $\overline{3*}$ ; $\overline{8*}$`]]),
  ...ca(1, 'dai', 'T19 TL Bài 2', 2, R`Viết các số sau thành dạng tổng hai số nguyên tố: $43;30;32$.`),
  ...ca(1, 'dai', 'T19 TL Bài 3', 2, R`Không thực hiện phép tính, chứng minh số sau là hợp số:
$A=2020.2021+5$ ; $B=10^{2020}-1$`),
  ...ca(1, 'dai', 'T19 TL Bài 4*', 2, R`Tìm số nguyên tố $p$ biết $p+2$ và $p+4$ là số nguyên tố.`),
  ...ca(1, 'dai', 'T19 TL Bài 5*', 2, R`Cho $p$ và $p+4$ là các số nguyên tố $(p>3)$. Chứng minh rằng $p+8$ là hợp số.`),
  ...tach(1, 'dai', 'T19 VN Bài 1', 2, R`Tìm tập hợp ước của mỗi số sau, sau đó chỉ ra những ước nào là số nguyên tố?`, [
    ['a', '$40$'], ['b', '$85$']]),
  ...tach(1, 'dai', 'T19 VN Bài 2', 2, R`Không tính kết quả, xét xem tổng (hiệu) sau là số nguyên tố hay hợp số?`, [
    ['.A', bt(R`A=302+150+826`)],
    ['.B', bt(R`B=5.7.9-2.5.6`)],
    ['.C', bt(R`C=12.13.14.17+91`)],
    ['.D', bt(R`D=7.8.39-2.3.5`)]]),
  ...ca(1, 'dai', 'T19 VN Bài 3', 2, R`Cho $p$ là số nguyên tố lớn hơn $3$ và $p+7$ là số nguyên tố. Chứng minh rằng $p+5$ là hợp số.`),

  // ══════════ (2) TIẾT 20 — SỐ NGUYÊN TỐ, HỢP SỐ (TIẾT 2) ══════════
  ...tn(2, 'dai', 'T20 Câu 1', 3, R`Kết quả phân tích một số nguyên tố ra thừa số nguyên tố là:`,
    ['$1$.', 'Chính số nguyên tố đó.', 'Hợp số', 'Tích của các thừa số nguyên tố.']),
  ...tn(2, 'dai', 'T20 Câu 2', 3, R`Khẳng định nào sau đây là sai?`,
    ['Số $2$ là số nguyên tố chẵn duy nhất.', R`Các số tự nhiên có $1$ chữ số là số nguyên tố là $2;3;5;7$.`, R`Phân tích số $20$ ra thừa số nguyên tố ta được $20=4.5$`, 'Các số nguyên tố lớn hơn $2$ đều là số lẻ.']),
  ...tn(2, 'dai', 'T20 Câu 3', 3, R`Phân tích số ra thừa số nguyên tố được kết quả là:`,
    [R`$18=18.1$`, R`$18=10+8$`, R`$18=2.3^2$`, R`$18=6+6+6$`],
    { cb: [R`CHƯA CHẮC — đề in "Phân tích số  ra thừa số nguyên tố" thiếu mất số cần phân tích (chỗ trống giữa "số" và "ra"); bốn phương án đều là các cách viết của $18$, có thể đề gốc là số $18$. Đã gõ ĐÚNG như in (không điền).`] }),
  ...tn(2, 'dai', 'T20 Câu 4', 3, R`Chọn cách phân tích ra thừa số nguyên tố sai trong các cách sau:`,
    [R`$98=2.7^2$`, R`$145=5.29$`, R`$81=3^4$`, R`$100=10^2$`]),
  ...tn(2, 'dai', 'T20 Câu 5', 3, R`Phân tích số $40$ ra thừa số nguyên tố được kết quả là:`,
    [R`$2.4.5$`, R`$2^3.5$`, R`$5.8$`, R`$4.10$`]),
  ...tach(2, 'dai', 'T20 Bài 1', 3, R`Phân tích các số sau ra thừa số nguyên tố và viết tập hợp ước của nó:`, [
    ['a', '$65$'], ['b', '$27$'], ['c', '$42$'], ['d', '$140$']]),
  ...tach(2, 'dai', 'T20 Bài 2', 4, R`Phân tích các số sau ra thừa số nguyên tố rồi tìm các ước nguyên tố nó:`, [
    ['a', '$525$'], ['b', '$144$'], ['c', '$180$'], ['d', '$76$']]),
  ...tach(2, 'dai', 'T20 Bài 3', 4, R`Các số sau đây có tất cả bao nhiêu ước số?`, [
    ['a', '$46$'], ['b', R`$3^4.5^2$`], ['c', '$98$', ['Ý c in "98" kèm một vết nhỏ như dấu phẩy trên (98\') — coi là vết in, đã gõ $98$.']], ['d', R`$29.31$`]]),
  ...tach(2, 'dai', 'T20 Bài 4', 5, R`Thay dấu $*$ bởi chữ số thích hợp:`, [
    ['a', bt(R`*.\overline{**}=106`)],
    ['b', bt(R`\overline{**}.\overline{**}=377`)]]),
  ...ca(2, 'dai', 'T20 Bài 5', 5, R`Bảo Ngọc có 50 bút chì màu và muốn chia đều số bút đó cho các em nhỏ. Hỏi Bảo Ngọc có thể chia đều cho bao nhiêu em? (Kể cả trường hợp cho 1 em hết số bút chì màu).`),
  ...ca(2, 'dai', 'T20 Bài 6', 5, R`Tìm số tự nhiên $a$ biết $1+2+3+\dots+a=820$.`),
  ...tach(2, 'dai', 'T20 VN Bài 1', 5, R`Các số sau đây có tất cả bao nhiêu ước số?`, [
    ['a', '$32$'], ['b', R`$5^2.7$`], ['c', '$120$'], ['d', R`$2^2.5.13$`]]),
  ...ca(2, 'dai', 'T20 VN Bài 2', 5, R`Bạn Lan có 48 bông hoa và muốn chia đều số bông hoa vào các hộp nhỏ để gói quà. Hỏi Lan có thể chia đều vào bao nhiêu hộp? (Kể cả trường hợp cho hết hoa vào 1 hộp).`),
  ...ca(2, 'dai', 'T20 VN Bài 3', 5, R`Tìm tất cả các số nguyên tố $p$ sao cho $5p+7$ là số nguyên tố.`),

  // ══════════ (3) TIẾT 21 — CHU VI, DIỆN TÍCH CÁC HÌNH (TIẾT 1) ══════════
  ...tn(3, 'hgt', 'T21 Câu 1', 6, R`Cho hình bình hành $ABCD$ có $AB=2\ \text{cm}$ thì`,
    [R`$BC=2\ \text{cm}$.`, R`$AD=2\ \text{cm}$.`, R`$AC=2\ \text{cm}$.`, R`$DC=2\ \text{cm}$.`]),
  ...tn(3, 'hgt', 'T21 Câu 2', 6, R`Cho hình bình hành có cạnh đáy là bằng ‹15 cm› và cạnh bên bằng ‹7 cm› và có chiều cao là ‹5 cm›. Chu vi và diện tích hình bình hành đó lần lượt là`,
    [R`$40\ \text{cm}$; $75\ \text{cm}$`, R`$44\ \text{cm}$; $75\ \text{cm}$`, R`$44\ \text{cm}^2$ ; $75\ \text{cm}$`, R`$44\ \text{cm}$; $75\ \text{cm}^2$`]),
  ...tn(3, 'hgt', 'T21 Câu 3', 6, R`Hình chữ nhật có chu vi bằng ‹28 cm›. Biết chiều dài hơn chiều rộng ‹6 cm›, diện tích của hình chữ nhật đó là:`,
    [R`$24\ \text{cm}^2$`, R`$187\ \text{cm}^2$`, R`$66\ \text{cm}^2$`, R`$40\ \text{cm}^2$`]),
  ...tn(3, 'hgt', 'T21 Câu 4', 6, R`Một hình vuông có diện tích ‹64 m2›. Chu vi của hình vuông đó là:`,
    [R`$16\ \text{m}$`, R`$32\ \text{cm}$`, R`$8\ \text{m}$`, R`$8\ \text{cm}$`],
    { cb: [R`CHƯA CHẮC — phương án B in "32 cm" (phóng 600 dpi: chữ "c" in đen, có chấm bút xanh của người dùng đè lên). Như in thì KHÔNG phương án nào đúng (chu vi đúng tính theo m); có thể đề định in "32 m". Đã gõ ĐÚNG như in.`] }),
  ...ca(3, 'hgt', 'T21 Bài 1', 6, R`Từ một miếng bìa hình vuông, người ta cắt thành bốn hình chữ nhật bằng nhau như hình vẽ bên. Biết chu vi của mỗi hình chữ nhật là ‹40 cm›. Tính chu vi hình vuông ban đầu.`,
    { anh: ['de_t21-bai1.png'], cb: [DOC_HINH('hình vuông được cắt bởi ba đoạn thẳng ngang song song thành 4 hình chữ nhật bằng nhau xếp chồng lên nhau; hình không ghi số đo.')] }),
  ...ca(3, 'hgt', 'T21 Bài 2', 6, R`Trong một khu vườn hình chữ nhật, người ta làm một lối đi hình bình hành với các kích thước như hình vẽ sau. Chi phí cho mỗi mét vuông làm lối đi hết 120 nghìn đồng. Tính chi phí để làm lối đi.`,
    { anh: ['de_t21-bai2.png'], cb: [DOC_HINH('khu vườn hình chữ nhật có chiều cao (cạnh bên trái) 20 m; lối đi là hình bình hành nghiêng nối cạnh trên với cạnh dưới; đoạn lối đi trên cạnh trên dài 2 m và đoạn trên cạnh dưới dài 2 m.')] }),
  ...ca(3, 'hgt', 'T21 Bài 3', 6, R`Một hình bình hành có cạnh đáy là ‹71 cm›. Người ta thu hẹp hình bình hành đó bằng cách giảm các cạnh đáy của hình bình hành đi ‹19 cm› thì được hình bình hành mới có diện tích nhỏ hơn diện tích hình bình hành ban đầu là ‹665 cm2›. Tính diện tích hình bình hành ban đầu.`,
    { anh: ['de_t21-bai3.png'], cb: [DOC_HINH('hình bình hành $ABCD$ (đáy $DC=71$ cm); $M\\in AB$ với $MB=19$ cm; $N\\in DC$; phần gạch chéo là hình bình hành $MBCN$ có diện tích $665$ cm$^2$; $AH=h$ là đường cao vuông góc $DC$ tại $H$.')] }),
  ...ca(3, 'hgt', 'T21 Bài 4', 6, R`Hình chữ nhật $ABCD$ có $AB=35\ \text{m}$, $BC=25\ \text{m}$ được chia thành hai hình vuông, hai hình chữ nhật và một hình vuông nhỏ ở giữa (như hình vẽ). Tính diện tích của hình vuông nhỏ ở giữa.`,
    { anh: ['de_t21-bai4.png'], cb: [DOC_HINH('hình chữ nhật $ABCD$ ($AB=35$ m, $BC=25$ m) ghép từ 4 hình chữ nhật/hình vuông xếp xoay quanh (kiểu chong chóng) và một hình vuông nhỏ gạch chéo ở giữa; hình không ghi thêm số đo.')] }),
  ...ca(3, 'hgt', 'T21 Bài 5*', 6, R`Một hình chữ nhật $ABCD$ được ghép lại từ 6 hình chữ nhật nhỏ có diện tích như hình vẽ. Hãy tính diện tích của hình chữ nhật $ABCD$.`,
    { anh: ['de_t21-bai5.png'], cb: [DOC_HINH('$E,G\\in AB$; $F,H\\in CD$; $M\\in AD$, $N\\in BC$; $I,O\\in MN$. Hàng trên: $AEIM=8$ cm$^2$, $EGOI=16$ cm$^2$, $GBNO=?$; hàng dưới: $MIFD=12$ cm$^2$, $IFHO=?$, $OHCN=72$ cm$^2$.')] }),
  ...ca(3, 'hgt', 'T21 VN Bài 1', 7, R`Hình vẽ bên mô tả một cánh tủ bếp. Gỗ làm khung bao quanh có chiều rộng là ‹6 cm›. Phần kính ở giữa có dạng hình chữ nhật có chiều rộng ‹24 cm›, chiều dài ‹58 cm›. Tính chu vi cánh tủ bếp.`,
    { anh: ['de_t21-vn1.png'], cb: [DOC_HINH('hai hình chữ nhật lồng nhau (khung gỗ bao quanh phần kính); bề rộng khung ghi 6 (cm) ở bên phải, mũi tên bề rộng khung ở cạnh trên không ghi số.')] }),
  ...ca(3, 'hgt', 'T21 VN Bài 2', 7, R`Hình vuông $ABCD$ được chia thành năm hình vuông và một hình chữ nhật như hình bên. Biết $S_1=S_2$ và $S_5=1\ \text{cm}^2$. Tính diện tích mỗi hình.`,
    { anh: ['de_t21-vn2.png'], cb: [DOC_HINH('hình vuông chia thành 6 miền đánh số 1–6: hàng dưới cùng từ trái sang phải là 1, 2, 3; miền 6 (chữ nhật đứng) ở bên trái phía trên miền 1 và 2; miền 4 (hình vuông lớn) ở góc trên bên phải; miền 5 (hình vuông nhỏ) nằm trên miền 2, bên phải miền 6, dưới miền 4 và bên trái miền 3.')] }),
  ...ca(3, 'hgt', 'T21 VN Bài 3', 7, R`Một hình bình hành có chu vi là ‹364 cm›, độ dài cạnh đáy gấp 6 lần cạnh bên và gấp 2 lần chiều cao. Hãy tính diện tích hình bình hành đó.`),

  // ══════════ (4) TIẾT 22 — CHU VI, DIỆN TÍCH CÁC HÌNH (TIẾT 2) ══════════
  ...tn(4, 'hgt', 'T22 Câu 1', 7, R`Cho hình thang cân $ABCD$ có $AB=5\ \text{cm},\ BC=4\ \text{cm},\ CD=10\ \text{cm}$. Chu vi hình thang $ABCD$ là:`,
    [R`$70\ \text{cm}$.`, R`$200\ \text{cm}$.`, R`$19\ \text{cm}$.`, R`$23\ \text{cm}$.`],
    { anh: ['de_t22-c1.png'], cb: [DOC_HINH('hình thang cân $ABCD$, $AB$ là đáy nhỏ (trên), $CD$ là đáy lớn (dưới); hai góc ở $D$ và $C$ có ký hiệu cung bằng nhau.')] }),
  ...tn(4, 'hgt', 'T22 Câu 2', 7, R`Một hình thoi có cạnh dài ‹7 cm› thì chu vi của hình thoi đó là:`,
    [R`$49\ \text{cm}$`, R`$28\ \text{cm}$`, R`$42\ \text{cm}$`, R`$14\ \text{cm}$`]),
  ...tn(4, 'hgt', 'T22 Câu 3', 7, R`Diện tích của một hình thoi là ‹100 dm2›, biết độ dài một đường chéo là ‹20 dm›. Độ dài đường chéo còn lại là:`,
    [R`$10\ \text{dm}$`, R`$25\ \text{m}$`, R`$50\ \text{m}$`, R`$5\ \text{dm}$`],
    { cb: ['Đề in lẫn đơn vị: phương án A, D ghi dm còn B, C ghi m — đã gõ ĐÚNG như in.'] }),
  ...tn(4, 'hgt', 'T22 Câu 4', 7, R`Tính diện tích hình thang cân $ABCD$ trên giấy kẻ ô vuông (độ dài cạnh ô vuông là ‹1 cm›).`,
    [R`$9\ \text{cm}^2$.`, R`$18\ \text{cm}^2$.`, R`$4,5\ \text{cm}^2$.`, R`$24\ \text{cm}^2$.`],
    { anh: ['de_t22-c4.png'], cb: [DOC_HINH('lưới ô vuông 4 cột × 3 hàng; $A$, $B$ nằm trên cạnh trên (ở các nút lưới thứ 1 và thứ 3 tính từ trái); $D$, $C$ là hai góc dưới của lưới; nối $AD$, $BC$.')] }),
  ...ca(4, 'hgt', 'T22 Bài 1', 8, R`Mảnh vườn $ABFED$ được chia thành một hình chữ nhật và một hình thang vuông có kích thước như hình vẽ.
a) Tính diện tích mảnh vườn đó.
b) Giá của ‹1 m2› đất là 45000000 đồng. Tính giá tiền đất của toàn bộ mảnh vườn trên.`,
    { anh: ['de_t22-bai1.png'], cb: [DOC_HINH('$AB=30$ m; $DC=40$ m; $BC=15$ m ($BC\\perp DC$); $CF=5$ m; $DEFC$ là hình chữ nhật ($E$ dưới $D$, $F$ dưới $C$); $AD$ nối chéo từ $A$ xuống $D$.')] }),
  ...ca(4, 'hgt', 'T22 Bài 2', 8, R`Cho hình thoi $MAND$ có diện tích ‹150 cm2›, đường chéo $MN$ dài ‹20 cm›. Hãy so sánh diện tích hình vuông $ABCD$ với diện tích hình thoi $MAND$, hình nào có diện tích lớn hơn và lớn hơn bao nhiêu $\text{cm}^2$?`,
    { anh: ['de_t22-bai2.png'], cb: [DOC_HINH('hình thoi có hai đường chéo $MN$ (ngang) và $AB$ (dọc) cắt nhau tại tâm; hình vuông $ABCD$ nằm bên phải, có cạnh $AB$ là đường chéo dọc của hình thoi ($A,D$ ở trên; $B,C$ ở dưới).'),
      R`CHƯA CHẮC — đề in lỗi tên hình thoi: chữ ghi $MAND$ (hai lần) nhưng hình cho thấy rõ hình thoi là $MANB$ (đường chéo $MN$ ngang, $AB$ dọc; $D$ là đỉnh hình vuông, không thuộc hình thoi). Đã gõ ĐÚNG như in; khi soạn hiểu hình thoi là $MANB$ (dữ kiện vẫn đủ để giải).`] }),
  ...ca(4, 'hgt', 'T22 Bài 3', 8, R`Một mảnh vườn hình thang cân có đáy nhỏ là ‹12 m›, đáy lớn là ‹18 m› và có diện tích là ‹225 m2›. Người ta muốn lấy một phần miếng đất để trồng hoa có dạng hình chữ nhật có chiều rộng bằng đáy nhỏ, chiều dài đúng bằng chiều cao của mảnh vườn hình thang cân.
a) Tính diện tích phần đất trồng hoa.
b) Dự kiến sau khi thu hoạch hoa, mỗi mét vuông đất trồng hoa sẽ thu được 500000 đồng. Tính số tiền thu được sau khi thu hoạch hoa trên phần đất hình chữ nhật.`),
  ...ca(4, 'hgt', 'T22 Bài 4*', 8, R`Một miếng bìa hình bình hành có chu vi bằng ‹2 m›. Nếu bớt chiều dài đi ‹2 dm› thì ta được miếng bìa hình thoi có diện tích ‹6 dm2›. Tìm diện tích miếng bìa hình bình hành ban đầu.`,
    { anh: ['de_t22-bai4.png'], cb: [DOC_HINH('$ABCD$ là hình bình hành; $M\\in AB$ với $MB=2$ dm; $N\\in CD$; phần nét đứt $MBCN$ là phần bị cắt bớt; phần còn lại $AMND$ là hình thoi có diện tích $6$ dm$^2$.')] }),
  ...ca(4, 'hgt', 'T22 VN Bài 1', 8, R`Một mảnh đất hình chữ nhật có chiều dài ‹15 m›, chiều rộng ‹8 m›. Người ta trồng một vườn hoa hình thoi ở trong mảnh đất đó, biết diện tích phần còn lại là ‹75 m2›. Tính độ dài đường chéo $AC$, biết $BD=9\ \text{m}$.`,
    { anh: ['de_t22-vn1.png'], cb: [DOC_HINH('mảnh đất hình chữ nhật dài 15 m, rộng 8 m; hình thoi $ABCD$ nằm trong, $AB$ phía trên, $DC$ phía dưới; vẽ hai đường chéo $AC$ và $BD$.')] }),
  ...ca(4, 'hgt', 'T22 VN Bài 2', 8, R`Bác Lan có một thửa ruộng có dạng như hình bên. Bác trồng lúa trên toàn bộ thửa ruộng đó. Nếu trên mỗi mét vuông bác Lan thu hoạch được ‹0,8 kg› thóc thì số tiền bác thu được là bao nhiêu? Biết mỗi ki-lô-gam thóc có giá 13000 đồng.`,
    { anh: ['de_t22-vn2.png'], cb: [DOC_HINH('$AB=20$ m (cạnh trên); $B$ chiếu xuống $K$ trên đường $GD$ với $BK=25$ m ($BK\\perp GD$); $G,H,K,C,D$ thẳng hàng (nét đứt), $CD=3$ m; $F$ chiếu lên $H$ với $HF=26$ m ($HF\\perp GD$); $FE=45$ m (cạnh dưới). Đường nét đứt $GD$ chia thửa ruộng thành hình thang $ABCG$ ($AB\\parallel GC$) ở trên và hình thang $GDEF$ ($GD\\parallel FE$) ở dưới; hình không ghi độ dài $GC$, $GD$.')] }),
  ...ca(4, 'hgt', 'T22 VN Bài 3', 8, R`Tính diện tích lớn nhất của một hình thoi có tổng độ dài hai đường chéo bằng ‹20 cm› và độ dài hai đường chéo đều là số tự nhiên.`),

  // ══════════ (5) ĐỀ CƯƠNG ÔN TẬP GIỮA HK I — I. TRẮC NGHIỆM (Câu 1–40) ══════════
  ...tn(5, 'dai', 'ÔT Câu 1', 9, R`Cho tập hợp $H=\{7; 15; 20\}$. Cách viết nào sau đây đúng:`,
    [R`$20\in H$`, R`$15\notin H$`, R`$25\in H$`, R`$\{15\}\in H$`]),
  ...tn(5, 'dai', 'ÔT Câu 2', 9, R`Khi viết tập hợp các chữ cái trong từ "AN TOAN" chữ $N$ được viết mấy lần`, ['$1$', '$2$', '$3$', '$0$']),
  ...tn(5, 'dai', 'ÔT Câu 3', 9, R`Cho $A$ là tập hợp các số tự nhiên chẵn nhỏ hơn $10$. Số phần tử của tập hợp $A$ là`, ['$6$', '$5$', '$4$', '$3$']),
  ...tn(5, 'dai', 'ÔT Câu 4', 9, R`Cho hai tập hợp $A=\{a; b\}$ và $B=\{c; d\}$. Có thể viết được bao nhiêu tập hợp, mỗi tập hợp gồm một phần tử của tập hợp $A$ và một phần tử của tập hợp $B$`, ['$8$', '$4$', '$3$', '$2$']),
  ...tn(5, 'dai', 'ÔT Câu 5', 9, R`Chữ số $2$ ở hàng chục triệu của số $202420242025$ có giá trị là`, ['$2$ đơn vị', 'Hai trăm tỉ', 'Hai mươi triệu', 'Hai tỉ']),
  ...tn(5, 'dai', 'ÔT Câu 6', 9, R`Giá một quyển vở là 12000 đồng. Tính số tiền cần có để mua $20$ quyển vở như vậy?`, ['120000 đồng.', '200000 đồng.', '240000 đồng.', '300000 đồng.']),
  ...tn(5, 'dai', 'ÔT Câu 7', 9, R`Kết quả của phép tính $5^{12}:5^8$ dưới dạng lũy thừa là`, [R`$1^{20}$`, R`$5^{20}$`, R`$10^4$`, R`$25^2$`]),
  ...tn(5, 'dai', 'ÔT Câu 8', 9, R`Chọn đáp án đúng $3^x=81$`, ['$x=5$', '$x=4$', '$x=9$', '$x=27$']),
  ...tn(5, 'dai', 'ÔT Câu 9', 9, R`Nếu $2025^x=1^{2025}\ (x\in\mathbb{N})$ thì giá trị của $x$ là:`, ['$1$', '$2025$', '$0$', 'Một kết quả khác']),
  ...tn(5, 'dai', 'ÔT Câu 10', 9, R`Tìm số tự nhiên $x$ biết $4<2^x<32$. Ta có:`, ['$x=3$', R`$x\in\{3;4\}$`, '$x=4$', R`$x\in\{2;3;4;5\}$`]),
  ...tn(5, 'dai', 'ÔT Câu 11', 10, R`Tìm $x$ biết $100:2+2x=68$. Kết quả của $x$ là`, ['$x=59$', '$x=18$', '$x=36$', '$x=9$']),
  ...tn(5, 'dai', 'ÔT Câu 12', 10, R`Số tự nhiên $x$ thỏa mãn $(3-x).(x^2+1)=0$`, ['$1$', '$2$', '$3$', 'Không có đáp án']),
  ...tn(5, 'dai', 'ÔT Câu 13', 10, R`Giá trị của biểu thức $17+3.2^3$ bằng:`, ['$41$', '$160$', '$10$', '$32$']),
  ...tn(5, 'dai', 'ÔT Câu 14', 10, R`Kết quả của phép tính $2^5.67+2^5.46-2^5.13$ là:`, ['$1000$', '$2500$', '$3200$', '$700$']),
  ...tn(5, 'dai', 'ÔT Câu 15', 10, R`Giá trị của biểu thức: $76-[26+(16-2.7)^2]$ bằng:`, ['$0$', '$46$', '$54$', '$76$']),
  ...tn(5, 'dai', 'ÔT Câu 16', 10, R`Nếu $x\vdots 4$ và $y\vdots 6$ thì $x+y$ chia hết cho:`, ['$2$', '$4$', '$6$', '$10$'], { cb: [DK_CHIA_HET] }),
  ...tn(5, 'dai', 'ÔT Câu 17', 10, R`Hãy chọn câu sai:`,
    [R`$132.5+35$ chia hết cho $5$`, R`$19.24+37$ chia hết cho $6$`, R`$3.300+46$ chia hết cho $2$`, R`$49+562.7$ chia hết cho $7$`]),
  ...tn(5, 'dai', 'ÔT Câu 18', 10, R`Để $\overline{43a}$ chia hết cho $2$ thì:`,
    [R`$a$ là số tự nhiên lẻ`, R`$a$ là số tự nhiên chẵn`, R`$a$ là số tự nhiên bất kì`, R`$a\in\{0;2;4;6;8\}$`]),
  ...tn(5, 'dai', 'ÔT Câu 19', 10, R`Số dư trong phép chia $13456789$ cho $5$ là:`, ['$1$', '$2$', '$3$', '$4$']),
  ...tn(5, 'dai', 'ÔT Câu 20', 10, R`Có $84$ chiếc kẹo được chia đều vào các đĩa. Hỏi mỗi đĩa có bao nhiêu chiếc kẹo? Biết số đĩa lớn hơn $6$ và nhỏ hơn $10$.`, ['$6$', '$7$', '$12$', '$14$']),
  ...tn(5, 'dai', 'ÔT Câu 21', 11, R`Trong các số $1323;\ 4617;\ 7431;\ 8946$, số chia hết cho $3$ mà không chia hết cho $9$ là:`, ['$1323$', '$4617$', '$7431$', '$8946$']),
  ...tn(5, 'dai', 'ÔT Câu 22', 11, R`Trong các số $6;\ 7;\ 60;\ 18$. Bội của $30$ là:`, ['$6$', '$7$', '$60$', '$18$']),
  ...tn(5, 'dai', 'ÔT Câu 23', 11, R`Biết $x$ là ước của $24$ và $x\ge 10$. Tất cả các giá trị của $x$ thỏa mãn là:`,
    [R`$x\in\{10;12;24\}$`, R`$x\in\{12;18;24\}$`, R`$x\in\{12;24\}$`, R`$x\in\{12\}$`]),
  ...tn(5, 'dai', 'ÔT Câu 24', 11, R`Khẳng định nào sai?`,
    ['Số $2$ là số nguyên tố chẵn duy nhất', 'Tổng của hai số nguyên tố bất kì luôn là số chẵn', 'Mọi số nguyên tố lớn hơn $2$ đều là số lẻ', 'Mọi số nguyên tố lớn hơn $3$ thì chia $3$ dư $1$ hoặc dư $2$']),
  ...tn(5, 'dai', 'ÔT Câu 25', 11, R`Số giá trị của chữ số $x$ để $\overline{1x}$ là hợp số là:`, ['$6$', '$7$', '$8$', '$9$']),
  ...tn(5, 'hgt', 'ÔT Câu 26', 11, R`Cho tam giác $ABC$ đều. Nhận định nào sau đây sai.`,
    [R`Ba cạnh $AB=BC=CA$`, R`Ba đỉnh $A,B,C$ bằng nhau`, R`Ba góc ở đỉnh $A,B,C$ bằng nhau`, R`Ba góc $A,B,C$ bằng nhau.`]),
  ...tn(5, 'hgt', 'ÔT Câu 27', 11, R`Cho các hình sau, hình nào có hai tam giác đều:`,
    ['Hình 1', 'Hình 2', 'Hình 3', 'Hình 4'],
    { anh: ['de_c27.png'], cb: [DOC_HINH('Hình 1: tam giác (đỉnh quay xuống) chia đôi bởi một đường cao; Hình 2: hình vuông có một đường chéo; Hình 3: hình thoi có một đường chéo dọc; Hình 4: tam giác lớn chia thành 4 tam giác nhỏ bởi 3 đoạn nối giữa các cạnh.'),
      'Đề in lỗi chính tả "Hìn h 3" ở phương án C — đã gõ "Hình 3".'] }),
  ...tn(5, 'hgt', 'ÔT Câu 28', 11, R`Chọn câu sai trong các câu sau:`,
    ['Trong một hình vuông, hai đường chéo bằng nhau.', 'Trong hình lục giác đều, các cạnh đều bằng nhau.', R`Trong hình tam giác đều, ba góc bằng nhau và bằng $60^{0}$`, 'Cả ba câu A, B, C đều sai.'],
    { cb: ['Số đo góc in "60⁰" (số mũ 0, có thể là ký hiệu độ) — đã gõ $60^{0}$ đúng như in.'] }),
  ...tn(5, 'hgt', 'ÔT Câu 29', 11, R`Chọn câu đúng trong các câu sau`,
    ['Ghép 6 hình tam giác ta được hình lục giác đều', 'Ghép 6 hình vuông ta được hình tam giác đều.', 'Ghép 6 hình tam giác đều ta được hình vuông.', 'Ghép 6 hình tam giác đều ta được hình lục giác đều.']),
  ...tn(5, 'hgt', 'ÔT Câu 30', 11, R`Cho Hình 5. Đường chéo chính của hình lục giác đều là:`,
    ['$AE$', '$AD$', '$AC$', '$EC$'],
    { anh: ['de_c30.png'], cb: [DOC_HINH('lục giác đều $ABCDEF$ (A trên cùng bên trái, rồi B, C, D, E, F theo chiều kim đồng hồ), vẽ các đoạn $AC$, $AD$, $AE$, $CE$.')] }),
  ...tn(5, 'hgt', 'ÔT Câu 31', 12, R`Cho hình lục giác đều có kích thước như Hình 6. Chọn câu sai trong các câu sau:`,
    [R`$BM=6\ \text{cm}$`, R`$CN=6\ \text{cm}$`, R`$AB=6\ \text{cm}$`, R`$AB=BC=CD$`],
    { anh: ['de_c31.png'], cb: [DOC_HINH('lục giác đều $ABCDMN$ (A trên bên trái, B trên bên phải, C bên phải, D dưới bên phải, M dưới bên trái, N bên trái); chỉ vẽ MỘT đường chéo $AD$, nhãn "6 cm" ghi trên $AD$ (Hình 6).')] }),
  ...tn(5, 'hgt', 'ÔT Câu 32', 12, R`Cho một hình vuông, hỏi nếu cạnh của hình vuông đã cho tăng gấp $3$ lần thì diện tích của nó tăng gấp bao nhiêu lần?`, ['$3$ lần', '$6$ lần', '$8$ lần', '$9$ lần']),
  ...tn(5, 'hgt', 'ÔT Câu 33', 12, R`Một người dự định dùng dây thép gai để bao quanh một khu vườn hình chữ nhật có kích thước ‹15 m›; ‹7 m›. Hỏi cần bao nhiêu mét dây thép gai để rào khu đất trên?`,
    [R`$22\ \text{m}$`, R`$210\ \text{m}$`, R`$44\ \text{m}$`, R`$105\ \text{m}$`]),
  ...tn(5, 'hgt', 'ÔT Câu 34', 12, R`Trong hình chữ nhật, phát biểu nào sau đây sai?`,
    ['Bốn cạnh bằng nhau', 'Hai đường chéo bằng nhau', 'Hai cạnh đối bằng nhau', 'Bốn góc vuông'],
    { anh: ['de_c34.png'], cb: [DOC_HINH('hình chữ nhật có hai đường chéo; các cạnh đối có ký hiệu bằng nhau (cạnh ngang trên/dưới ba vạch, hai cạnh đứng hai vạch); bốn góc có ký hiệu góc vuông; các nửa đường chéo có vạch bằng nhau.')] }),
  ...tn(5, 'hgt', 'ÔT Câu 35', 12, R`Trong hình thoi, các khẳng định nào sai:`,
    ['Hai đường chéo vuông góc', 'Các cạnh đối song song', 'Bốn cạnh bằng nhau', 'Hai đường chéo bằng nhau']),
  ...tn(5, 'hgt', 'ÔT Câu 36', 12, R`Khẳng định nào sau đây là đúng nhất khi nói về hai đường chéo của hình thoi`,
    ['Hai đường chéo song song với nhau', 'Hai đường chéo trùng nhau', 'Hai đường chéo vuông góc với nhau', 'Hai đường chéo bằng nhau']),
  ...tn(5, 'hgt', 'ÔT Câu 37', 12, R`Một hình thoi có diện tích bằng ‹24 cm2›. Biết độ dài một đường chéo bằng ‹6 cm›, tính độ dài đường chéo còn lại của hình thoi đó.`,
    [R`$4\ \text{cm}$`, R`$8\ \text{cm}$`, R`$12\ \text{cm}$`, R`$16\ \text{cm}$`]),
  ...tn(5, 'hgt', 'ÔT Câu 38', 12, R`Cho lục giác đều $ABCDEG$, ba đường chéo chính cắt nhau tại $O$. Có bao nhiêu hình thoi được tạo thành?`,
    ['$4$', '$5$', '$6$', '$7$'],
    { anh: ['de_c38.png'], cb: [DOC_HINH('lục giác đều $ABCDEG$ (A trên bên trái, B trên bên phải, C bên phải, D dưới bên phải, E dưới bên trái, G bên trái); ba đường chéo chính $AD$, $BE$, $CG$ cắt nhau tại $O$.')] }),
  ...tn(5, 'hgt', 'ÔT Câu 39', 12, R`Người ta dự định lắp kính cho một cửa sổ hình thoi có độ dài hai đường chéo là ‹8 dm› và ‹12 dm›. Biết ‹1 dm2› kính để làm cửa sổ hết 5000 đồng. Số tiền cần có để lắp kính cho cửa sổ là:`,
    ['240000 đồng', '480000 đồng', '48000 đồng', '120000 đồng']),
  ...tn(5, 'hgt', 'ÔT Câu 40', 12, R`Gọi $a$ là độ dài một cạnh của các hình tam giác đều; hình thoi; hình vuông; hình lục giác đều. Công thức nào đúng với chu vi của hình lục giác đều`,
    ['$3a$', '$4a$', '$5a$', '$6a$']),

  // ══════════ (5) II. BÀI TẬP RÈN KĨ NĂNG — DẠNG 1: THỰC HIỆN PHÉP TÍNH ══════════
  ...tach(6, 'dai', 'ÔT D1 Bài ', 13, 'Thực hiện phép tính (tính hợp lý nếu có thể):', [
    ['1', bt(R`87.23+13.93+70.87`)],
    ['2', bt(R`178.75-178.35+22.40`)],
    ['3', bt(R`23.17+47.71+83.23+47.29`)],
    ['4', bt(R`84:4+3^9:3^7+1^{2025}`)],
    ['5', bt(R`2^3.15-[149-(12-5)^2]`)],
    ['6', bt(R`25-[49-(2^3.17-2^3.14)]`)],
    ['7', bt(R`25.2^3-[164-(12-4)^2]+10.2025^0`)],
    ['8', bt(R`100:\{250:[450-(4.5^3-2^2.25)]\}`)]]),

  // ══════════ DẠNG 2: TÌM SỐ TỰ NHIÊN x ══════════
  ...tach(6, 'dai', 'ÔT D2 Bài 1', 13, R`Tìm số tự nhiên $x$, biết:`, [
    ['.1', bt(R`45+2x=165`)],
    ['.2', bt(R`123-3(x+4)=3`)],
    ['.3', bt(R`165-(35:x+3).19=13`)],
    ['.4', bt(R`720:[41-(2x-5)]=2^3.5`)]]),
  ...tach(6, 'dai', 'ÔT D2 Bài 1', 14, R`Tìm số tự nhiên $x$, biết:`, [
    ['.5', bt(R`(12x-4^3).8^3=4.8^4`)],
    ['.6', bt(R`(7x-11)^3=2^2.5^2-73`)],
    ['.7', bt(R`(18-2x^2)(2x-4)=0`)],
    ['.8', bt(R`5.(3^x-2^2.4)=325`)],
    ['.9', bt(R`707:[(2^x-5)+74]=3^3-5.2^2`)],
    ['.10', bt(R`65-4^{x+2}=2025^0`)],
    ['.11', bt(R`2.2^{2x}+4^3.4^x=1056`)]]),
  ...tach(6, 'dai', 'ÔT D2 Bài 2', 14, R`Tìm số tự nhiên $x$ biết`, [
    ['.1', R`$x\in\text{Ư}(48)$ và $x>10$.`],
    ['.2', R`$x-1\in\text{B}(12)$ và $30\le x\le 100$.`],
    ['.3', R`$18$ chia hết cho $x-2$ và $5<x<10$.`],
    ['.4', R`$15$ là bội của $2x-1$.`],
    ['.5', R`$2x+3$ là ước của $10$.`]]),

  // ══════════ DẠNG 3: TÍNH CHẤT CHIA HẾT, DẤU HIỆU CHIA HẾT, SỐ NGUYÊN TỐ, HỢP SỐ ══════════
  ...tach(6, 'dai', 'ÔT D3 Bài 1', 15, R`Tìm các chữ số $x,\ y$ biết`, [
    ['a', R`$\overline{x63y}$ chia hết cho cả $5$ và $9$`],
    ['b', R`$\overline{13x5y}$ chia hết cho cả $3$ và $5$.`],
    ['c', R`$\overline{56x3y}$ chia hết cho cả $2$, $5$ và $9$.`],
    ['d', R`$\overline{4x6y}$ chia hết cho $2$; $5$ và chia cho $3$ dư $1$`],
    ['e', R`$\overline{57x2y}$ chia hết cho $5$; $9$ nhưng không chia hết cho $2$.`]]),
  ...tach(6, 'dai', 'ÔT D3 Bài 2', 15, '', [
    ['a', R`Tổng $10^{15}+8$ có chia hết cho $9$ và $2$ không?`],
    ['b', R`Tổng $10^{2020}+14$ có chia hết cho $3$ và $2$ không?`],
    ['c', R`Hiệu $10^{2020}-4$ có chia hết cho $3$ không?`]]),
  ...tach(6, 'dai', 'ÔT D3 Bài 3', 16, R`Mỗi tổng (hiệu) sau là số nguyên tố hay hợp số?`, [
    ['a', R`$A=2.3.5.7.11+13.17.19.21$`],
    ['b', R`$B=12.13.15.17+91$`],
    ['c', R`$C=15.31.37+110.102$`],
    ['d', R`$D=\overline{abcabc}+22$`],
    ['e', R`$E=121212.150-200.3.30303$`]]),
  ...ca(6, 'dai', 'ÔT D3 Bài 4', 16, R`Giáo sư Ngô Bảo Châu sinh năm $\overline{abcd}$, là nhà toán học người Việt Nam. Năm 2010, ông được trao Huy chương Fields, giải thưởng danh giá nhất của toán học thế giới, nhờ chứng minh được Bổ đề cơ bản trong chương trình Langlands. Tìm năm sinh của ông, biết: $a$ không là số nguyên tố cũng không là hợp số; $b$ là hợp số lớn nhất có một chữ số; $c$ là số nguyên tố lớn nhất có một chữ số; $d$ là số nguyên tố và số $\overline{abcd}$ chia hết cho $2$.`),

  // ══════════ DẠNG 4: TOÁN CÓ LỜI VĂN ══════════
  ...ca(6, 'dai', 'ÔT D4 Bài 1', 16, R`Bạn An đi nhà sách mua: $5$ cây bút bi, $1$ quyển sách và $15$ quyển tập. Biết giá mỗi cây bút bi là 4000 đồng, giá của cuốn sách là 60000 đồng và giá của một quyển tập là 8000 đồng. Bạn An mang theo 190000 đồng. Hỏi An có đủ tiền trả hay không? Bạn An thừa hay thiếu bao nhiêu tiền?`),
  ...ca(6, 'dai', 'ÔT D4 Bài 2', 16, R`Để chuẩn bị cho năm học mới, một trường THCS có kế hoạch thay mới các bóng đèn tuýp bằng các bóng đèn led cho $32$ phòng học, mỗi phòng thay $12$ bóng. Mỗi bóng đèn có giá 60000 đồng.
a) Tính số tiền để thay toàn bộ bóng đèn trong trường.
b) Khi thực hiện, có thêm $8$ phòng thực hành cũng cần thay thế một số bóng đèn led. Trường phải chi tổng cộng 27360000 đồng. Hỏi số bóng đèn led thay thế ở mỗi phòng thực hành là bao nhiêu? Biết số bóng đèn led ở mỗi phòng thực hành cần thay thế là như nhau.`,
    { cb: ['Đề có kèm ảnh chụp phòng học minh họa (không có dữ kiện toán) — không cần cắt hình.'] }),
  ...ca(6, 'dai', 'ÔT D4 Bài 3', 17, R`Nhân dịp Tết trung thu, bác Hoa tự tay chuẩn bị và làm được $20$ chiếc bánh trung thu. Bác muốn chia đều số bánh đó vào các hộp nhỏ. Hỏi bác Hoa có thể chia đều số bánh đó vào bao nhiêu hộp? Tính số bánh trong mỗi hộp ứng với từng cách chia? (Xét cả trường hợp cho tất cả số bánh vào chung $1$ hộp).`),
  ...ca(6, 'dai', 'ÔT D4 Bài 4', 17, R`Để chuẩn bị cho Hội khỏe Phù Đổng của trường, cô Tổng phụ trách mua một số chai nước khoáng cho các vận động viên. Biết số chai nước cô mua nhiều hơn $50$ chai và ít hơn $100$ chai.
a) Nếu xếp số chai nước đó vào các thùng, mỗi thùng $12$ chai thì vừa đủ, không thừa chai nào. Hỏi cô có thể đã mua bao nhiêu chai nước?
b) Biết thêm rằng nếu chia đều số chai nước đó cho các đội, mỗi đội $9$ chai thì cũng vừa hết. Hỏi cô đã mua bao nhiêu chai nước?`),
  ...ca(6, 'dai', 'ÔT D4 Bài 5', 17, R`Lớp 6A có số học sinh chưa đến $40$ em. Nếu xếp $4$ học sinh hay $6$ học sinh vào một tổ đều vừa đủ, nhưng nếu xếp $7$ học sinh vào một tổ thì thừa ra một em. Hỏi lớp 6A có bao nhiêu học sinh?`),

  // ══════════ DẠNG 5: HÌNH HỌC TỔNG HỢP ══════════
  ...ca(6, 'hgt', 'ÔT D5 Bài 1', 17, R`Nhà bạn Hà có mảnh sân hình chữ nhật có chiều dài ‹12 m› và chiều rộng ‹9 m›. Mảnh sân được lát nền bằng những viên gạch hình vuông có cạnh ‹0,6 m›. Biết rằng mỗi thùng có $6$ viên gạch.
a) Hỏi nhà Hà cần mua bao nhiêu thùng gạch để lát đủ mảnh sân?
b) Biết rằng mỗi thùng gạch giá 80000 đồng. Hỏi để lát đủ sân nhà Hà cần phải trả bao nhiêu tiền gạch?`),
  ...ca(6, 'hgt', 'ÔT D5 Bài 2', 17, R`Một bức tường trang trí phòng khách có dạng hình chữ nhật có chiều dài ‹5 m›, chiều rộng ‹3 m›.
1) Tính diện tích của bức tường;
2) Người ta muốn dán giấy trang trí có dạng hình vuông (1) có cạnh bằng chiều rộng của bức tường, phần còn lại được dán gỗ.
a) Tính số tiền giấy dán tường, biết rằng giá ‹1 m2› giấy dán tường là 100000 đồng.
b) Tính số tiền gỗ, biết giá của ‹1 m2› gỗ là 150000 đồng.`,
    { anh: ['de_d5-bai2.png'], cb: [DOC_HINH('hình chữ nhật dài 5 m, rộng 3 m; ở giữa là hình vuông tô màu ghi số (1) có cạnh bằng chiều rộng; hai dải trắng hình chữ nhật ở hai bên.')] }),
  ...ca(6, 'hgt', 'ÔT D5 Bài 3', 17, R`Nhà bạn Bách có mảnh đất hình chữ nhật có chiều dài ‹8 m›, chiều rộng ‹5 m›. Mẹ bạn Bách trồng hoa trong mảnh đất hình thoi và trồng cỏ trong các mảnh đất hình tam giác. Mỗi mét vuông trồng $4$ cây hoa.
a) Tính diện tích mảnh đất hình chữ nhật nhà bạn Bách.
b) Tính số cây hoa hồng trồng trên mảnh đất hình thoi.
c) Nếu mỗi cây hoa hồng có giá là 50000 đồng và tiền công trồng mỗi mét vuông cỏ là 40000 đồng thì mẹ Bách phải trả bao nhiêu tiền?`,
    { anh: ['de_d5-bai3.png'], cb: [DOC_HINH('hình chữ nhật cao 5 m, dài 8 m; hình thoi nằm trong có bốn đỉnh là trung điểm bốn cạnh của hình chữ nhật; bốn góc còn lại là các tam giác.')] }),
  ...ca(6, 'hgt', 'ÔT D5 Bài 4', 17, R`Một mảnh vườn có dạng hình thang cân $ABCD$ với đáy lớn $CD=30\ \text{m}$, đáy nhỏ $AB=18\ \text{m}$, cạnh bên $AD=BC=10\ \text{m}$ và chiều cao ‹8 m›. Người ta làm một lối đi có dạng hình bình hành nối hai đáy của mảnh vườn, cạnh của lối đi nằm trên mỗi đáy dài ‹2 m› (như hình vẽ). Phần đất còn lại dùng để trồng rau.
a) Người ta rào xung quanh mảnh vườn, chừa lại một cửa ra vào rộng ‹3 m›. Biết mỗi mét hàng rào giá 60000 đồng. Tính số tiền làm hàng rào.
b) Tính diện tích phần đất trồng rau.
c) Trung bình mỗi mét vuông đất trồng rau thu hoạch được ‹3 kg› rau. Bán mỗi ki-lô-gam rau được 15000 đồng. Hỏi sau một vụ, số tiền bán rau thu được là bao nhiêu?`,
    { anh: ['de_d5-bai4.png'], cb: [DOC_HINH('hình thang cân $ABCD$: $AB=18$ m (trên), $CD=30$ m (dưới), $AD=BC=10$ m, $AH=8$ m ($AH\\perp DC$ tại $H$); lối đi hình bình hành gạch chéo chạy từ đáy $AB$ xuống đáy $CD$, rộng 2 m (ghi trên đáy); hai phần hai bên ghi "Trồng rau".')] }),
  ...ca(6, 'hgt', 'ÔT D5 Bài 5', 17, R`Một mảnh vườn dạng hình vuông có cạnh bằng ‹10 m›. Người ta để một phần mảnh vườn làm lối đi rộng ‹2 m› (như hình vẽ), phần còn lại để trồng rau. Người ta làm hàng rào xung quanh mảnh vườn trồng rau và ở một góc vườn có để cửa ra vào rộng ‹2 m›.
a) Tính độ dài hàng rào.
b) Tính diện tích trồng rau.`,
    { anh: ['de_d5-bai5.png'], cb: [DOC_HINH('hình vuông cạnh 10 m; lối đi rộng 2 m chạy dọc cạnh phải và dọc cạnh dưới; phần còn lại là "Mảnh vườn trồng rau"; cửa vào rộng 2 m ở góc dưới bên phải của mảnh trồng rau (chỗ hai lối đi gặp nhau).')] }),

  // ══════════ DẠNG 6: NÂNG CAO ══════════
  ...tach(6, 'dai', 'ÔT D6 Bài 1', 18, R`Tìm các số tự nhiên $x,\ y$ biết:`, [
    ['a', bt(R`x(y-2)=8`)],
    ['b', bt(R`(x-2)(2y+3)=26`)],
    ['c', bt(R`(x+5)(y-3)=15`)],
    ['d', bt(R`xy+x+y=2`)]]),
  ...tach(6, 'dai', 'ÔT D6 Bài 2', 18, '', [
    ['a', R`Cho 2 số $A$ và $B$, biết rằng $A=1+2^1+2^2+2^3+\dots+2^{2025}$ và $B=2^{2026}$. Chứng minh $A$ và $B$ là 2 số tự nhiên liên tiếp.`],
    ['b', R`Chứng tỏ giá trị của biểu thức $C=5+5^2+5^3+\dots+5^8$ là bội của $30$.`]]),
  ...tach(6, 'dai', 'ÔT D6 Bài 3', 18, '', [
    ['a', R`Biết $a+4b$ chia hết cho $13$, $(a,\ b\in\mathbb{N})$, chứng minh rằng $10a+b$ chia hết cho $13$.`],
    ['b', R`Biết $3a+2b$ chia hết cho $17$ $(a,b\in\mathbb{N})$, chứng minh rằng $10a+b$ chia hết cho $17$.`]]),
  ...tach(6, 'dai', 'ÔT D6 Bài 4', 19, R`Tìm $n\in\mathbb{N}$ sao cho:`, [
    ['a', bt(R`n+6\vdots n+2`), [DK_CHIA_HET]],
    ['b', bt(R`2n+7\vdots n+1`), [DK_CHIA_HET]],
    ['c', bt(R`2n+3\vdots n-2`), [DK_CHIA_HET]]]),
  ...tach(6, 'dai', 'ÔT D6 Bài 5', 19, R`Tìm số nguyên tố $p$ sao cho:`, [
    ['a', R`$3p+5$ là số nguyên tố`],
    ['b', R`$p+8$ và $p+10$ là số nguyên tố`]]),
  ...ca(6, 'dai', 'ÔT D6 Bài 6', 19, R`Cho $p$ và $2p+1$ là các số nguyên tố $(p>5)$. Hỏi $4p+1$ là số nguyên tố hay hợp số?`),
  ...ca(6, 'hgt', 'ÔT D6 Bài 7', 19, R`Cho hình chữ nhật $ABCD$ có $AB=12\ \text{cm}$, $BC=8\ \text{cm}$. Trên cạnh $AB$ lấy điểm $M$, trên cạnh $CD$ lấy điểm $N$ sao cho $AM=CN=4\ \text{cm}$. Khi đó tứ giác $AMCN$ là hình bình hành.
a) Tính diện tích hình bình hành $AMCN$.
b) Tính diện tích tam giác $MBC$ và tam giác $AND$. So sánh tổng diện tích hai tam giác đó với diện tích hình bình hành $AMCN$.
c) Nếu thay đổi vị trí của $M$ trên $AB$ và $N$ trên $CD$ (vẫn giữ $AM=CN$) thì độ dài $AM$ bằng bao nhiêu để diện tích hình bình hành $AMCN$ gấp đôi tổng diện tích hai tam giác $MBC$ và $AND$?`,
    { anh: ['de_d6-bai7.png'], cb: [DOC_HINH('hình chữ nhật $ABCD$ ($AB=DC=12$ cm đo ở cạnh dưới, $BC=8$ cm); $M\\in AB$ với $AM=4$ cm; $N\\in DC$ với $NC=4$ cm; hình bình hành $AMCN$ gạch sọc, vẽ hai cạnh xiên song song $AN$ và $MC$ (KHÔNG vẽ đường chéo $AC$).')] }),

  // ══════════ (6) ĐỀ THAM KHẢO SỐ 1 ══════════
  ...tn(7, 'dai', 'TK1 Câu 1', 20, R`Tập hợp $M$ các số tự nhiên chẵn lớn hơn $5$ và nhỏ hơn hoặc bằng $10$ là:`,
    [R`$M=\{6;7;8;9\}$`, R`$M=\{6;8\}$`, R`$M=\{6;8;10\}$`, R`$M=\{6;7;8;9;10\}$`]),
  ...tn(7, 'dai', 'TK1 Câu 2', 20, R`Giá một quyển vở là 15000 đồng. Số tiền cần có để mua $15$ quyển vở như vậy là :`, ['215000 đồng', '225000 đồng', '205000 đồng', '125000 đồng']),
  ...tn(7, 'dai', 'TK1 Câu 3', 20, R`Biết $75-(2.x-3)=12$ giá trị $x$ là :`, ['$x=30$', '$x=31$', '$x=32$', '$x=33$']),
  ...tn(7, 'dai', 'TK1 Câu 4', 20, R`Tập hợp $P$ các số tự nhiên $x$ sao cho $x\in\text{B}(6)$ và $15<x\le 36$ là:`,
    [R`$P=\{24\}$`, R`$P=\{24;36\}$`, R`$P=\{18;24;30;36\}$`, R`$P=\{18;24;30\}$`]),
  ...tn(7, 'dai', 'TK1 Câu 5', 20, R`Cần ít nhất bao nhiêu xe $35$ chỗ ngồi để chở hết $450$ cổ động viên bóng đá?`, ['$10$ xe', '$11$ xe', '$12$ xe', '$13$ xe']),
  ...tn(7, 'dai', 'TK1 Câu 6', 20, R`Để số $\overline{a234}$ chia hết cho $9$ thì giá trị của $a$ là:`, ['$0$', '$4$', '$9$', '$3$']),
  ...tn(7, 'hgt', 'TK1 Câu 7', 20, R`Biết các đoạn thẳng ở hình bên đều bằng nhau. Hình bên có`,
    ['$2$ lục giác đều, $4$ hình vuông, $4$ tam giác đều', '$1$ lục giác đều, $5$ hình vuông, $5$ tam giác đều', '$2$ lục giác đều, $6$ hình vuông, $6$ tam giác đều', '$1$ lục giác đều, $6$ hình vuông, $6$ tam giác đều'],
    { anh: ['de_tk1-c7.png'], cb: [DOC_HINH('ở giữa là một lục giác; trên mỗi cạnh của lục giác dựng ra ngoài một hình vuông; giữa hai hình vuông kề nhau là một tam giác; viền ngoài là đa giác 12 cạnh; đề nói mọi đoạn thẳng trong hình bằng nhau.')] }),
  ...tn(7, 'hgt', 'TK1 Câu 8', 20, R`Quốc kì Brazil có dạng hình chữ nhật, nền xanh lá cây, ở trung tâm có một hình thoi màu vàng. Hình thoi có hai đường chéo dài ‹83 cm› và ‹54 cm›. Diện tích hình thoi đó là:`,
    [R`$4482\ \text{cm}$`, R`$4482\ \text{cm}^2$`, R`$2241\ \text{cm}^2$`, R`$137\ \text{cm}^2$`],
    { anh: ['de_tk1-c8.png'], cb: ['Ảnh minh họa quốc kì Brazil (hình chữ nhật nền xanh, hình thoi vàng, đĩa tròn ở giữa) — không có số đo trên hình.'] }),
  ...tach(8, 'dai', 'TK1 Bài 1', 20, 'Thực hiện phép tính (Tính hợp lý nếu có thể)', [
    ['a', bt(R`15.16-75:25+2024`)],
    ['b', bt(R`2023:[22-(7^2-2^3.3):5]`)],
    ['c', bt(R`(20.2^4+12.2^4-48.2^2):8^2`)]]),
  ...tach(8, 'dai', 'TK1 Bài 2', 21, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`50+2.x=8.115-15.8`)],
    ['b', bt(R`4.5^2+5^{x+1}=225`)],
    ['c', R`$15\vdots x$ và $x>3$.`, [DK_CHIA_HET]]]),
  ...ca(8, 'dai', 'TK1 Bài 3', 21, R`Một cửa hàng có hai loại khay nướng bánh. Loại khay thứ nhất chứa được $4$ chiếc bánh, loại khay thứ hai chứa được $6$ chiếc bánh.
a) Hôm qua cửa hàng dùng cả hai loại khay trên nướng bánh $11$ lần, mỗi khay đủ số bánh. Cửa hàng đã bán hết, giá mỗi bánh là 6000 đồng/1 chiếc. Hỏi cửa hàng thu về bao nhiêu tiền?
b) Hôm nay, sau một số lần nướng bánh bằng cả hai loại khay trên, người bán hàng đếm được số bánh làm ra là $123$ chiếc. Hỏi người bán hàng đếm đúng hay sai? Biết mỗi lần nướng, mỗi khay đều xếp đủ số bánh.`),
  ...ca(8, 'hgt', 'TK1 Bài 4', 21, R`Cho một mảnh đất hình chữ nhật có chiều dài là ‹150 m›, chiều rộng là ‹120 m›. Người ta mở một con đường $EBGF$ ($EF$ song song với $BG$) đi qua mảnh đất (dữ liệu được cho hình bên).
a) Hình $EBGF$ là hình gì? Tính diện tích con đường $EBGF$?
b) Tính diện tích phần còn lại của đám đất. Để việc đi lại thuận tiện hơn, người ta đã mở rộng con đường bằng cách dịch chuyển $EF$ một đoạn về phía $AD$ mà vẫn đảm bảo $EF$ song song với $BG$ và diện tích con đường bằng nửa diện tích của mảnh đất. Hỏi độ dài đoạn dịch chuyển là bao nhiêu?`,
    { anh: ['de_tk1-bai4.png'], cb: [DOC_HINH('hình chữ nhật $ABCD$: $AB=150$ m (mũi tên nét đứt trên cạnh trên), $BC=120$ m; $E\\in AB$; $F,G\\in DC$ với $FG=50$ m; con đường $EBGF$ nằm giữa (hai cạnh xiên $EF$ và $BG$ song song); hai phần $AEFD$ và $BGC$ gạch chấm.'),
      'Ý b) in gồm HAI yêu cầu (diện tích phần còn lại + độ dài đoạn dịch chuyển EF) — đề không có nhãn c); đã gõ đúng như in, lời giải trả lời cả hai yêu cầu trong ý b). Dữ kiện đủ (đã thử giải: không mâu thuẫn).'] }),
  ...ca(8, 'dai', 'TK1 Bài 5.1', 21, R`Cho $S=2.2^2+3.2^3+4.2^4+\dots+2024.2^{2024}$. Chứng tỏ rằng tổng $S$ chia hết cho $2023$.`),
  ...ca(8, 'dai', 'TK1 Bài 5.2', 21, R`Abel, Ben and Charlie took part in a competition which contained 30 questions. They had correctly answered 26, 23 and 18 questions, respectively. What is the least possible number of questions that were answered correctly by all 3 students?`,
    { cb: [TIENG_ANH,'Bài 5 của đề: "Học sinh chọn một trong hai câu sau" — nhập cả hai (5.1 tiếng Việt, 5.2 tiếng Anh).'] }),

  // ══════════ ĐỀ THAM KHẢO SỐ 02 ══════════
  ...tn(9, 'dai', 'TK2 Câu 1', 22, R`Cho tập hợp $A=\{2;4;5;7\}$. Khi đó, ta có:`, [R`$9\in A$`, R`$7\in A$`, R`$5\notin A$`, R`$2\notin A$`]),
  ...tn(9, 'dai', 'TK2 Câu 2', 22, R`Cho tập hợp $B=\{x\in\mathbb{N}^*\mid x\le 7\}$. Tập hợp $B$ có số phần tử là:`, ['$5$', '$6$', '$7$', '$8$']),
  ...tn(9, 'dai', 'TK2 Câu 3', 22, R`Biết $2^{2x-3}=8$, giá trị $x$ là :`, ['$2$', '$3$', '$4$', '$5$']),
  ...tn(9, 'dai', 'TK2 Câu 4', 22, R`Cho biểu thức $M=72+126+x$. Với giá trị nào của $x$ trong các giá trị sau thì $M$ chia hết cho $9$?`, ['$8$', '$26$', '$21$', '$27$']),
  ...tn(9, 'dai', 'TK2 Câu 5', 22, R`Kết quả của phép tính $2^6:2^3:2$ bằng:`, ['$4$', '$8$', '$2$', '$1$']),
  ...tn(9, 'hgt', 'TK2 Câu 6', 22, R`Hình bình hành là tứ giác có các cặp cạnh đối diện:`, ['Song song với nhau', 'Bằng nhau', 'Cả A và B đều đúng', 'Cả A và B đều sai']),
  ...tn(9, 'hgt', 'TK2 Câu 7', 22, R`Một hình thoi có diện tích bằng ‹28 cm2›. Biết độ dài một đường chéo bằng ‹7 cm›. Khi đó, độ dài đường chéo còn lại là:`,
    [R`$4\ \text{cm}$.`, R`$8\ \text{cm}$.`, R`$14\ \text{cm}$.`, R`$16\ \text{cm}$.`]),
  ...tn(9, 'hgt', 'TK2 Câu 8', 22, R`Một hình vuông có diện tích là ‹144 cm2›. Độ dài cạnh của hình vuông là:`,
    [R`$36\ \text{cm}$.`, R`$24\ \text{cm}$.`, R`$12\ \text{cm}$.`, R`$10\ \text{cm}$.`]),
  ...tach(10, 'dai', 'TK2 Bài 1', 22, 'Thực hiện phép tính (Tính hợp lý nếu có thể)', [
    ['a', bt(R`12.53+53.172-53.84`)],
    ['b', bt(R`8.5^2-189:3^2`)],
    ['c', bt(R`476-\{5.[409-(8.3-21)^2]-1724\}`)]]),
  ...tach(10, 'dai', 'TK2 Bài 2', 23, R`Tìm số tự nhiên $x$ biết`, [
    ['a', bt(R`575-(6x+70)=445`)],
    ['b', bt(R`(4x-1)^2=5^2.9`)],
    ['c', R`$x\in\text{B}(18)$ và $20\le x\le 60$`]]),
  ...ca(10, 'dai', 'TK2 Bài 3', 23, R`Lan được mẹ cho 300000 đồng để mua đồ dùng học tập là vở và bút. Biết rằng mỗi quyển vở có giá 12500 đồng và mỗi chiếc bút bi có giá 6000 đồng.
a) Lan đã mua $20$ quyển vở. Số tiền Lan phải trả cho số vở đó là bao nhiêu?
b) Với số tiền còn lại, Lan mua được nhiều nhất bao nhiêu chiếc bút bi? Vì sao?`),
  ...ca(10, 'hgt', 'TK2 Bài 4', 23, R`Nhà An có một mảnh vườn hình chữ nhật có chiều dài ‹15 m›, chiều rộng ‹7 m›. Ở giữa mảnh vườn, nhà An xây một bồn đất có dạng hình thoi với độ dài hai đường chéo là ‹6 m› và ‹4 m› để trồng hoa. Ở bốn góc của mảnh vườn, nhà An để lại bốn mảnh đất trồng rau. Các mảnh đất này đều có dạng tam giác vuông với cùng kích thước hai cạnh góc vuông lần lượt là ‹2 m› và ‹5 m›. (như hình bên).
a) Tính diện tích bồn đất hình thoi dùng để trồng hoa?
b) Tính diện tích đất trồng rau?
c) Phần đất còn lại nhà An sẽ lát đá để làm lối đi. Biết rằng mỗi mét vuông đá lát sân có giá 180000 đồng. Tính số tiền nhà An phải trả để lát kín lối đi. (Coi khoảng trống giữa các viên đá lát không đáng kể).`,
    { anh: ['de_tk2-bai4.png'], cb: [DOC_HINH('hình chữ nhật dài 15 m, rộng 7 m; hình thoi $EGFH$ ở giữa ($E$ trên, $F$ dưới, $G$ trái, $H$ phải) với $EF=4$ m (đường chéo dọc) và $GH=6$ m (đường chéo ngang); bốn tam giác vuông ở bốn góc gạch xám, hai cạnh góc vuông ghi 2 m (cạnh đứng, góc dưới bên phải) và 5 m (cạnh ngang đáy dưới).')] }),
  ...ca(10, 'dai', 'TK2 Bài 5.1', 23, R`Tìm tất cả các số nguyên tố $p,\ q$ sao cho $7p+q$ và $pq+11$ cũng là số nguyên tố.`),
  ...ca(10, 'dai', 'TK2 Bài 5.2', 23, R`The results of a survey in class 6A showed that: 20 students like soccer (set A), 17 students like swimming (set B), and 36 students like volleyball (set C). In addition, 14 students like both soccer and swimming, 13 students like both swimming and volleyball, 15 students like both soccer and volleyball, 10 students like all three subjects, and 12 students don't like any of the subjects.
a) Represent the sets above using a Venn diagram.
b) Calculate the total number of students in class 6A.`,
    { cb: [TIENG_ANH,'Bài 5 của đề: "Học sinh chọn một trong hai câu sau" — nhập cả hai (5.1 tiếng Việt, 5.2 tiếng Anh).'] }),

  // ══════════ ĐỀ THAM KHẢO SỐ 03 ══════════
  ...tn(11, 'dai', 'TK3 Câu 1', 24, R`Cho tập hợp $M=\{3;5;7;9\}$. Khi đó:`, [R`$6\in M$`, R`$7\in M$`, R`$5\notin M$`, R`$2\in M$`]),
  ...tn(11, 'dai', 'TK3 Câu 2', 24, R`Cho tập hợp $A=\{x\mid x\in\mathbb{N},\ x\le 4\}$. Tập hợp $A$ có số phần tử là:`, ['$5$', '$6$', '$7$', '$8$']),
  ...tn(11, 'dai', 'TK3 Câu 3', 24, R`Biết $3^x=9$, giá trị của $x$ là:`, ['$4$', '$3$', '$2$', '$1$']),
  ...tn(11, 'dai', 'TK3 Câu 4', 24, R`Kết quả của phép tính $225-5.(47-7)$ là:`, ['$8800$', '$880$', '$35$', '$25$']),
  ...tn(11, 'dai', 'TK3 Câu 5', 24, R`Dãy số nào sau đây chỉ gồm các số nguyên tố?`, ['$5;\\ 7;\\ 9$', '$2;\\ 3;\\ 4$', '$2;\\ 3;\\ 5$', '$1;\\ 2;\\ 3$']),
  ...tn(11, 'hgt', 'TK3 Câu 6', 24, R`Một hình bình hành có cạnh đáy là ‹7 cm›, cạnh bên là ‹5 cm›. Chu vi của hình bình hành đó là:`,
    [R`$35\ \text{cm}$`, R`$24\ \text{cm}$`, R`$22\ \text{cm}$`, R`$12\ \text{cm}$`]),
  ...tn(11, 'hgt', 'TK3 Câu 7', 24, R`Cho hình chữ nhật $ABCD$ có kích thước như hình vẽ dưới đây. Chọn khẳng định đúng.`,
    [R`$CD=3\ \text{cm}$`, R`$BC=5\ \text{cm}$`, R`$CD=5\ \text{cm}$`, R`$AB<CD$`],
    { anh: ['de_tk3-c7.png'], cb: [DOC_HINH('hình chữ nhật $ABCD$ ($A$ trên bên trái, $B$ trên bên phải, $C$ dưới bên phải, $D$ dưới bên trái); $AB=5$ cm (ghi trên cạnh trên), $AD=3$ cm (ghi bên cạnh trái).')] }),
  ...tn(11, 'hgt', 'TK3 Câu 8', 24, R`Một hình vuông có chu vi là ‹28 cm›. Diện tích của hình vuông đó là:`,
    [R`$64\ \text{cm}^2$`, R`$49\ \text{cm}^2$`, R`$36\ \text{cm}^2$`, R`$25\ \text{cm}^2$`]),
  ...tach(12, 'dai', 'TK3 Bài 1', 24, 'Thực hiện phép tính (Tính hợp lý nếu có thể)', [
    ['a', bt(R`45.180+45.15-45.95`)],
    ['b', bt(R`3.2^3+6^2-5^2`)],
    ['c', bt(R`80+\{4.[327-(12-9)^2]-272\}`)]]),
  ...tach(12, 'dai', 'TK3 Bài 2', 25, R`Tìm số tự nhiên $x$ biết:`, [
    ['a', bt(R`5x-75=226+124`)],
    ['b', bt(R`[(2x+3)^2-6]+2025^0=2^2.5`)],
    ['c', R`$x\vdots 12$ và $10<x\le 36$.`, [DK_CHIA_HET]]]),
  ...ca(12, 'dai', 'TK3 Bài 3', 25, R`Để ủng hộ học sinh chịu ảnh hưởng của lũ lụt ở Thái Nguyên, cô Dương mua $20$ quyển vở, $5$ hộp bút bi và $3$ cái cặp sách. Giá của một quyển vở là 8000 đồng, giá của một hộp bút bi là 60000 đồng. Tổng số tiền cô Dương phải trả cho cả vở, bút và cặp sách là 940000 đồng.
a) Tính tổng số tiền mua $20$ quyển vở và $5$ hộp bút bi.
b) Tính giá của một cái cặp sách.`),
  ...ca(12, 'hgt', 'TK3 Bài 4', 25, R`Gia đình bác Hòa có một mảnh đất hình thoi dùng để trồng trọt, với hai đường chéo lần lượt là ‹10 m› và ‹12 m›. Để tăng diện tích đất, bác Hòa mở rộng thêm bốn góc, mỗi góc là một hình tam giác vuông để tạo thành mảnh đất hình chữ nhật (xem hình vẽ bên).
a) Tính diện tích mảnh đất hình thoi ban đầu.
b) Tính diện tích phần đất được mở rộng thêm (bốn góc hình tam giác).
c) Trên phần đất hình thoi, bác Hòa trồng khoai lang, mỗi mét vuông thu được ‹5 kg› và bán với giá 15000 đồng/kg. Trên phần đất mở rộng, bác trồng ngô, mỗi mét vuông thu được ‹4 kg› và bán với giá 12000 đồng/kg. Hỏi bác Hòa thu được tất cả bao nhiêu tiền sau khi thu hoạch và bán toàn bộ sản phẩm?`,
    { anh: ['de_tk3-bai4.png'], cb: [DOC_HINH('hình chữ nhật có cạnh đứng ghi 10 m và cạnh ngang ghi 12 m; hình thoi trắng bên trong có bốn đỉnh nằm trên bốn cạnh (trung điểm), vẽ hai đường chéo của hình thoi (một ngang, một dọc); bốn tam giác vuông ở các góc tô tối.')] }),
  ...ca(12, 'dai', 'TK3 Bài 5.1', 25, R`Tìm các số tự nhiên $a$ và $b$ thỏa mãn $(100a+3b+1)(2^a+10a+b)=225$.`),
  ...ca(12, 'dai', 'TK3 Bài 5.2', 25, R`A number sequence is shown below.
$3,7,2,1,5,2,3,7,2,1,5,2,\dots$
a) What is the sum of the first 122 numbers?
b) What is the $140^{th}$ number?`,
    { cb: [TIENG_ANH,'Bài 5 của đề: "Học sinh chọn một trong hai câu sau" — nhập cả hai (5.1 tiếng Việt, 5.2 tiếng Anh).'] }),
]

dung({
  MA: 'NTL-NC-2026',
  TEN: 'Đề cương ôn tập nâng cao Toán 6 — Trường THCS Nam Từ Liêm (Phiếu bổ sung nâng cao + Ôn tập giữa kì I) năm 2026–2027',
  NGUON: 'THCS Nam Từ Liêm',
  FILE: 'ĐỀ CƯƠNG NÂNG CAO TOÁN 6 NAM TỪ LIÊM.pdf',
  PHAN, CAU, LV, HERE,
})
