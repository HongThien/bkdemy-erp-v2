// ============================================================================
// TC-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG GIỮA HỌC KÌ I Toán 6 (2026–2027) — Trường THCS Thành Công (Hà Nội), Tổ Tự Nhiên
// (PDF 6 trang có lớp chữ nhưng công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi + phóng 200 dpi; không có trang bìa — trang 1 là đề luôn)
//
//   node kho-rules/dai/lo/k6/de-cuong/TC-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_cau22..26.png, de_bai12..15.png)
//
// Phạm vi KIẾN THỨC (đề ghi): Số học "Hết bài 11. Ước chung – Ước chung lớn nhất" = thứ tự thực hiện phép tính trong ℕ, số La Mã · luỹ thừa · quan hệ chia hết + tính chất chia hết
// của một tổng · dấu hiệu chia hết 2; 3; 5; 9 · phân tích ra thừa số nguyên tố · ƯCLN, ƯC qua ƯCLN. Hình học = tam giác đều, lục giác đều, hình vuông, hình chữ nhật, hình thoi,
// hình bình hành, hình thang cân · chu vi + diện tích hình vuông, hình chữ nhật. (KHÔNG BCNN, KHÔNG số nguyên.)
// Cấu trúc: A. Trắc nghiệm — Câu 1–30 (4 phương án) · Câu 31–35 trắc nghiệm đúng sai (a–d) · B. Trả lời ngắn Câu 36–40 · C. Tự luận Bài 1–15 · Bài tập nâng cao Bài 16–20.
// Nhãn: giữ ĐÚNG như in — "Câu N" cho phần A–B, "Bài N" cho phần C + nâng cao (hai dãy số riêng, nhãn khác chữ nên không trùng).
// Tách ý: chỉ ý có dữ kiện RIÊNG (Bài 2, 3, 4, 5, 6, 11, 16, 19); bài lời văn / bài hình nhiều ý dùng chung dữ kiện (Bài 1, 7–10, 12–15, 20) ⇒ giữ cả bài.
// Số in "18 000", "400 000", "40 000", "900 000" đã gõ LIỀN (18000…) theo k6.md §3.
// Đề cương KHÔNG có đáp án / lời giải. Chỗ nghi: xem canh_bao ('CHƯA CHẮC — …') của từng câu.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TC-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
/** tách ý: mỗi ý một câu, câu = lead + ý. ys = [[hậu tố nhãn, nội dung, [canh_bao]]] */
const tach = (phan, kho, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
/** giữ nguyên cả bài */
const ca = (phan, kho, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
/** câu trắc nghiệm 4 phương án (phần 1) */
const tn = (n, nhom, kho, stem, opts, o = {}) => [{ phan: 1, kho, nhom, loai: 'trac_nghiem', nhan: `Câu ${n}`,
  noi_dung: `${stem}\n${opts.map((t, i) => `${'ABCD'[i]}. ${t}`).join('\n')}`, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
/** câu đúng/sai + trả lời ngắn (phần 2, 3) — loai mặc định tu_luan */
const cx = (phan, n, nhom, nd, o = {}) => [{ phan, kho: o.kho ?? 'dai', nhom, nhan: `Câu ${n}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'A. Trắc nghiệm (Câu 1–30)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'A. Trắc nghiệm đúng sai (Câu 31–35)' },
  { thu_tu: 3, ten: 'B. Trả lời ngắn (Câu 36–40)' },
  { thu_tu: 4, ten: 'C. Tự luận (Bài 1–15)' },
  { thu_tu: 5, ten: 'Bài tập nâng cao (Bài 16–20)' },
]

const HINH = (n, mo) => `Đọc hình: ${mo}`

const CAU = [
  // ══════════ A. TRẮC NGHIỆM (Câu 1–30) ══════════
  ...tn(1, 1, 'dai', R`Cho tập hợp $A=\{x\in\mathbb{N}\mid 4<x\le 9\}$. Tập hợp $A$ viết dưới dạng liệt kê là:`,
    [R`$\{4; 5; 6; 7; 8; 9\}$.`, R`$\{4; 5; 6; 7; 8\}$.`, R`$\{5; 6; 7; 8\}$.`, R`$\{5; 6; 7; 8; 9\}$.`]),
  ...tn(2, 1, 'dai', R`Số tự nhiên $x$ thỏa mãn $(x-29)-11=0$ là:`, ['30.', '39.', '40.', '41.']),
  ...tn(3, 1, 'dai', R`Kết quả phép tính $312-97$ bằng:`, ['212.', '215.', '225.', '409.']),
  ...tn(4, 1, 'dai', R`Tích $2525:25.5-5$ là:`, ['50', '0.', '500.', 'Kết quả khác'],
    { cb: ['Đề in chữ "Tích" cho biểu thức có phép chia và phép trừ — gõ đúng như in.'] }),
  ...tn(5, 1, 'dai', R`Thứ tự thực hiện các phép tính đối với biểu thức không có dấu ngoặc là :`,
    [R`Nhân và chia $\Rightarrow$ Lũy thừa $\Rightarrow$ Cộng và trừ.`, R`Lũy thừa $\Rightarrow$ Nhân và chia $\Rightarrow$ Cộng và trừ.`,
     R`Cộng và trừ $\Rightarrow$ Nhân và chia $\Rightarrow$ Lũy thừa.`, R`Lũy thừa $\Rightarrow$ Cộng và trừ $\Rightarrow$ Nhân và chia.`]),
  ...tn(6, 1, 'dai', R`Tính giá trị của lũy thừa $2^6$ ta được kết quả là:`, ['16', '32', '64', '12']),
  ...tn(7, 1, 'dai', R`Kết quả phép tính $5^5.5^9$ bằng:`, [R`$5^{45}$`, R`$5^{14}$`, R`$25^{14}$`, R`$10^{14}$`]),
  ...tn(8, 1, 'dai', R`Tìm số tự nhiên $x$, biết: $(x-25).2021=0$ ta được kết quả $x$ bằng:`, ['0', '45', '25', '26']),
  ...tn(9, 1, 'dai', R`Thương $q$ và số dư $r$ trong phép chia $a=713$ cho $b=51$ là:`,
    [R`$q=14;\ r=0$.`, R`$q=13;\ r=50$.`, R`$q=50;\ r=13$.`, R`$q=14;\ r=1$.`]),
  ...tn(10, 1, 'dai', R`Dạng tổng quát của số tự nhiên chia hết cho 3 là?`,
    [R`$3k\ (k\in\mathbb{N})$.`, R`$5k+3\ (k\in\mathbb{N})$.`, R`$3k+1\ (k\in\mathbb{N})$.`, R`$3k+2\ (k\in\mathbb{N})$.`]),
  ...tn(11, 2, 'dai', 'Một tàu cần chở 1200 hành khách. Mỗi toa có 12 khoang, mỗi khoang có 8 chỗ ngồi. Hỏi tàu hỏa cần ít nhất bao nhiêu toa để chở hết chỗ hành khách đó?',
    ['12.', '13.', '11.', '14.']),
  ...tn(12, 2, 'dai', 'Trong các số sau, số nào là ước của 10?', ['10', '0', '3', '6']),
  ...tn(13, 2, 'dai', R`Tổng tất cả các số tự nhiên $x$ thỏa mãn $15\vdots(2x+1)$ là`, ['10.', '4.', '7.', '9.']),
  ...tn(14, 2, 'dai', 'Tổng (hoặc hiệu) nào dưới đây chia hết cho 7', [R`$147+21$`, R`$28+16$.`, R`$49-24$.`, R`$35-12$.`]),
  ...tn(15, 2, 'dai', 'Giá trị tương ứng trong hệ thập phân của số La Mã XXIV là:', ['101015.', '10104.', '24.', '26.'],
    { cb: ['Đề in phương án A "101015", B "10104" (dãy chữ số lạ) — gõ đúng như ảnh.'] }),
  ...tn(16, 2, 'dai', R`Tìm tập hợp các chữ số điền vào dấu $*$ để để được số $\overline{14*}$ chia hết cho 2`,
    [R`$\{0; 2; 4; 6; 8\}$.`, R`$\{2; 4; 6; 8\}$.`, R`$\{2\}$.`, R`$\{0; 2; 4; 6; 8; 10..\}$`],
    { cb: ['Đề in "để để được" (lặp chữ) và phương án D kết thúc "10. . }" (hai chấm, không có dấu chấm câu cuối) — gõ đúng như in.'] }),
  ...tn(17, 2, 'dai', 'Tất cả các số nguyên tố có một chữ số là .', ['1; 3; 5; 7.', '3; 5; 7.', '2; 3; 5; 9.', '2; 3; 5; 7.']),
  ...tn(18, 2, 'dai', R`Có bao nhiêu số tự nhiên $x$ để $\overline{3x}$ là hợp số?`, ['2.', '8.', '7.', '9.']),
  ...tn(19, 2, 'dai', 'Phân tích số 18 ra thừa số nguyên tố. Cách viết nào sau đây là đúng?',
    [R`$18=18.1$.`, R`$18=10+8$.`, R`$18=2.3^2$.`, R`$18=6+6+6$.`]),
  ...tn(20, 2, 'dai', R`Số $126=2.3^2.7$ có bao nhiêu ước nguyên tố?`, ['3', '4.', '10.', '12.']),
  ...tn(21, 3, 'dai', R`Số tự nhiên $x$ để $(x+6)\vdots(x+2)$ là:`, [R`$x=0$`, R`$x=3$.`, R`$x\in\{1; 2\}$.`, R`$x\in\{0; 2\}$.`]),
  ...tn(22, 3, 'hgt', 'Trong các hình dưới đây, hình nào là tam giác đều?', ['Hình (1).', 'Hình (2).', 'Hình (3).', 'Hình (4).'],
    { anh: ['de_cau22.png'], cb: [HINH(22, 'bốn hình tam giác, không ghi số đo hay ký hiệu bằng nhau: (1) đỉnh ở giữa, thấp và bè (trông cân, đáy dài); (2) lệch, đỉnh bên trái, đáy dài; (3) cao, đỉnh ở giữa đáy (vẽ trông gần đều); (4) lệch hẳn, góc tù ở bên trái.')] }),
  ...tn(23, 3, 'hgt', 'Trong các hình dưới đây, hình nào là hình vuông?', ['Hình (1).', 'Hình (2).', 'Hình (3).', 'Hình (4).'],
    { anh: ['de_cau23.png'], cb: [HINH(23, 'bốn hình, không ghi số đo: (1) tứ giác thường có các cạnh khác nhau; (2) hình chữ nhật (dài hơn rộng); (3) hình thoi đặt chéo (hai đường chéo ngang và đứng); (4) hình vuông.')] }),
  ...tn(24, 3, 'hgt', 'Trong các hình dưới đây, hình nào là hình lục giác đều?', ['Hình (1).', 'Hình (2).', 'Hình (3).', 'Hình (4).'],
    { anh: ['de_cau24.png'], cb: [HINH(24, 'bốn đa giác: (1) bát giác (thấy cạnh trên, hai cạnh chéo trên, hai cạnh đứng); (2) lục giác, 6 cạnh trông bằng nhau, cạnh trên và cạnh dưới nằm ngang; (3) ngũ giác (đỉnh ở trên); (4) hình thang cân (hai đáy nằm ngang, đáy dưới dài hơn). Không ghi số đo.'),
      'Trong tệp gốc hình (1) bát giác và (3) ngũ giác bị cắt mất phần dưới ở chỗ ngắt trang (trang 2 → 3), hình (2), (4) và nhãn (1)–(4) nằm ở trang 3; ảnh đã ghép hai trang, vị trí nhãn khớp từng hình. Phần mất không ảnh hưởng việc nhận ra hình lục giác.'] }),
  ...tn(25, 3, 'hgt', 'Chọn hình ảnh xuất hiện tam giác đều:', ['Hình (1).', 'Hình (2).', 'Hình (3).', 'Hình (4).'],
    { anh: ['de_cau25.png'], cb: [HINH(25, 'bốn hình ảnh thực tế: (1) biển báo tam giác viền đỏ có người đi bộ (tam giác đều, đỉnh ở trên); (2) cái ê ke màu vàng (tam giác vuông cân); (3) tam giác lệch hẳn, góc tù, nét tím; (4) lá cờ màu xanh lá hình tam giác trên cán xanh (lệch).')] }),
  ...tn(26, 3, 'hgt', 'Hình dưới đây có bao nhiêu hình thoi?', ['9', '10', '12', '14'],
    { anh: ['de_cau26.png'], cb: [HINH(26, 'một hình thoi lớn đặt nghiêng (viền xanh dương) được hai nhóm đường xanh lục song song chia thành lưới 3 × 3 = 9 hình thoi nhỏ bằng nhau; không ghi số đo.')] }),
  ...tn(27, 3, 'hgt', R`Hình vuông có cạnh $5\ \text{cm}$ thì chu vi và diện tích của nó lần lượt là:`,
    [R`$20\ \text{cm}$ và $25\ \text{cm}$`, R`$20\ \text{cm}$ và $25\ \text{cm}^2$`, R`$25\ \text{cm}^2$ và $20\ \text{cm}$`, R`$20\ \text{cm}$ và $10\ \text{cm}^2$`]),
  ...tn(28, 3, 'hgt', 'Khẳng định nào sau đây là sai ?',
    ['Hình thang cân có hai cạnh bên bằng nhau.', 'Hình bình hành có hai đường chéo bằng nhau.', 'Hình thoi có các cạnh đối song song với nhau.', 'Hình chữ nhật có các cạnh đối bằng nhau.']),
  ...tn(29, 3, 'hgt', R`Hình chữ nhật có diện tích $800\ \text{m}^2$, độ dài một cạnh là $40\ \text{m}$ thì chu vi của hình chữ nhật đó là:`,
    [R`$100\ \text{m}$`, R`$60\ \text{m}$`, R`$120\ \text{m}$`, R`$1600\ \text{m}$`]),
  ...tn(30, 3, 'hgt', R`Một sợi dây đồng được uốn thành một hình vuông có cạnh $50\ \text{cm}$. Sợi dây đồng đó có độ dài là :`,
    [R`$50\ \text{cm}$`, R`$200\ \text{cm}$`, R`$200\ \text{dm}$`, R`$500\ \text{cm}$`]),

  // ══════════ A. TRẮC NGHIỆM ĐÚNG SAI (Câu 31–35) — giữ cả câu, 4 mệnh đề a–d ══════════
  ...cx(2, 31, 4, R`Cho tập hợp $A=\{x\in\mathbb{N}^*\mid x<6\}$
a) $0\in A$
b) $6\in A$
c) Tập hợp $A$ có 5 phần tử
d) $A=\{1; 2; 3; 4; 5; 6\}$`),
  ...cx(2, 32, 4, R`Một người bán năm giỏ táo và lê. Mỗi giỏ chỉ đựng một loại quả táo hoặc lê, với số lượng trong năm giỏ như sau: 20 quả, 25 quả, 30 quả, 35 quả và 40 quả. Sau khi bán một giỏ lê trong năm giỏ, người ấy thấy số táo còn lại gấp 2 lần số lê còn lại.
a) Tổng số táo và lê ban đầu là 150 quả
b) Số quả lê trong giỏ đã bán phải chia hết cho 3
c) Người đó đã bán đi giỏ 30 quả lê và số quả còn lại là 120 quả
d) Số quả táo ban đầu là 50 quả`),
  ...cx(2, 33, 4, R`Cho các số 1; 3; 13; 17; 18; 25; 39; 41.
a) 1 là số nguyên tố
b) 41 là hợp số
c) Số nguyên tố 3; 13; 17; 41
d) Hợp số là 1; 17; 18; 25.`),
  ...cx(2, 34, 4, R`Một lớp có 27 học sinh nam và 18 học sinh nữ. Giáo viên chia lớp đó thành một số tổ sao cho mỗi tổ có số học sinh nam và nữ bằng nhau.
a) Sổ tổ của lớp đó là ước chung của 27 và 18
b) $\text{ƯC}(27; 18)=\{1; 2; 3; 9\}$
c) $\text{ƯCLN}(27; 18)=9$
d) Để mỗi tổ có ít học sinh nhất thì ta chia lớp thành 9 tổ`,
    { cb: ['CHƯA CHẮC — Đề in "Sổ tổ" ở ý a) (lỗi chính tả, đáng lẽ "Số tổ") — gõ đúng như in.'] }),
  ...cx(2, 35, 4, R`Cho số $\overline{4a3}$ trong đó $a$ là chữ số
a) Nếu $a=2$ thì $\overline{4a3}$ chia hết cho 3
b) Số $\overline{4a3}$ chia hết cho 9 khi $a=4$
c) Với mọi $a$ là chữ số chẵn, số $\overline{4a3}$ luôn chia hết cho 3
d) Có đúng 3 giá trị của $a$ để có $\overline{4a3}$ chia hết cho 9`),

  // ══════════ B. TRẢ LỜI NGẮN (Câu 36–40) ══════════
  ...cx(3, 36, 4, R`Số phần tử của tập hợp $M=\{x\in\mathbb{N}\mid x+2<8\}$ là …`),
  ...cx(3, 37, 4, R`Giá trị của biểu thức $5^2.2-10$ là …`),
  ...cx(3, 38, 4, 'Số tự nhiên biểu diễn số La Mã XXIV là …'),
  ...cx(3, 39, 4, 'Một quyển vở kẻ ngang có giá 18000 đồng. Với 400000 đồng, số vở bạn An có thể mua được nhiều nhất là …'),
  ...cx(3, 40, 4, R`Cho biết $120=2^3.3.5$, khi đó số ước của 120 là …`),

  // ══════════ C. TỰ LUẬN (Bài 1–15) ══════════
  ...ca(4, 'dai', 1, 5, R`Cho tập hợp $T=\{n\in\mathbb{N}\mid 0<n\le 20\}$
a) Viết tập hợp $T$ bằng cách liệt kê các phần tử. Tập hợp $T$ có bao nhiêu phần tử.
b) Dùng kí hiệu $(\in;\ \notin)$ để viết các số 15 và 22 thuộc hay không thuộc tập hợp $T$.
c) Tính tổng tất cả các phần tử của tập hợp $T$.`),
  ...tach(4, 'dai', 2, 5, 'Thực hiện phép tính (Tính nhanh nếu có thể):', [
    ['a', bt(R`164+219+236+381`)],
    ['b', bt(R`2121+345-45-121`)],
    ['c', bt(R`21.453-53.21`)],
    ['d', bt(R`37.75+37.50-37.25`)],
    ['e', bt(R`36.13+9.4.88-36`)],
    ['g', bt(R`34.2-16:2^2`)],
    ['h', bt(R`160-(2^3.5^2-6.25)`)],
    ['i', bt(R`100:\{250:[450-(4.5^3-2^2.25)]\}`)],
    ['k', bt(R`2^3.5^2-[231-(23-2^3)^2]`)],
    ['p', bt(R`2.(38.13-13.11):27-2026^0`)]]),
  ...tach(4, 'dai', 3, 6, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`21-x=9`)],
    ['b', bt(R`17+2.x=35`)],
    ['c', bt(R`100-7.(x-5)=58`)],
    ['d', bt(R`2550:[85-(2x+3)]=51`)],
    ['e', bt(R`72-(84-9x):7=69`)],
    ['f', bt(R`(2x-5)^2=9`)],
    ['g', bt(R`2x+5x-3x=2^3.2^4`)],
    ['h', bt(R`(x^2-81).(x-5^2)=0`)],
    ['i', bt(R`3^{x-2}=81`)],
    ['k', bt(R`267<7x<456`)]]),
  ...tach(4, 'dai', 4, 6, '', [
    ['a', 'Trong các số sau: 2540; 1347; 1638; 2356. Số nào chia hết cho 2? Số nào chia hết cho 3? Số nào chia hết cho cả 2 và 3?'],
    ['b', R`Tìm số tự nhiên $x$, $y$ biết: $\overline{712x4y}$ chia hết cho đồng thời 2; 3; 5; 9.`]]),
  ...tach(4, 'dai', 5, 7, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', R`$x\in\text{Ư}(20)$ và $x>10$.`],
    ['b', R`$x\ \text{Ư}(44)$ và $5\le x\le 50$.`, [R`CHƯA CHẮC — Đề in "x Ư (44)" THIẾU ký hiệu ∈ giữa $x$ và Ư(44) (khoảng trống trên ảnh, các ý a, c đều có ∈) — gõ đúng như in, không tự thêm.`]],
    ['c', R`$x\in\text{Ư}(24)$ và $x\in\text{Ư}(18)$.`],
    ['d', R`$54\vdots x$; $81\vdots x$ và $x>10$.`],
    ['e', R`$28\vdots(x+1)$, $26\vdots(x+1)$ và $x$ là số lẻ.`]]),
  ...tach(4, 'dai', 6, 7, R`Tìm $\text{ƯCLN}$ của:`, [
    ['a', '220; 240 và 300'],
    ['b', '40; 75 và 106'],
    ['c', '18; 36 và 72']]),
  ...ca(4, 'dai', 7, 7, 'Có 48 quả quýt, 18 quả cam. Hỏi có thể chia cam và quýt cho nhiều nhất bao nhiêu em biết mỗi em được phần như nhau. Khi đó mỗi em được bao nhiêu quả cam? Bao nhiêu quả quýt?'),
  ...ca(4, 'dai', 8, 7, 'Cô giáo chủ nhiệm muốn chia 128 quyển vở, 48 bút chì và 192 tập giấy thành một số phần thưởng như nhau để thưởng cho học sinh nhân dịp tổng kết học kì I. Hỏi có thể chia được nhiều nhất bao nhiêu phần thưởng? Mỗi phần thưởng có bao nhiêu quyển vở, bao nhiêu bút chì, bao nhiêu tập giấy?'),
  ...ca(4, 'dai', 9, 7, 'Lớp 6A có 42 học sinh. Trong dịp tham quan, cô giáo muốn chia lớp thành các nhóm sao cho mỗi nhóm có số học sinh như nhau và mỗi nhóm có nhiều hơn 3 học sinh. Hỏi mỗi nhóm có bao nhiêu người?'),
  ...ca(4, 'dai', 10, 7, 'An Nhiên có 18 viên bi. Bạn muốn xếp số bi đó vào các túi sao cho số bi ở mỗi túi đều bằng nhau. An Nhiên có bao nhiêu cách chia túi? (kể cả trường hợp xếp vào một túi). Khi đó mỗi túi có bao nhiêu viên bi?'),
  ...tach(4, 'hgt', 11, 8, 'Vẽ hình:', [
    ['a', R`Tam giác đều $ABC$ có độ dài cạnh $3\ \text{cm}$.`],
    ['b', R`Hình vuông $MNPQ$ có độ dài cạnh $4\ \text{cm}$.`],
    ['c', R`Hình chữ nhật $DEGH$ có cạnh $DE=5\ \text{cm}$, $EG=3\ \text{cm}$.`],
    ['d', R`Hình thoi $GHIK$ có $GI=6\ \text{cm}$, $HK=8\ \text{cm}$.`],
    ['e', R`Hình bình hành $EFHI$ có $EF=3\ \text{cm}$, $FH=4\ \text{cm}$.`, [R`Đề chỉ cho hai cạnh kề $EF$, $FH$, không cho góc — bài vẽ hình nên chọn góc tuỳ ý (hình bình hành không duy nhất, không phải lỗi đề).`]]]),
  ...ca(4, 'hgt', 12, 8, R`Cho hình vẽ (h.1) . Hãy chỉ ra: Các tam giác đều, các hình thang cân, các lục giác đều.`,
    { anh: ['de_bai12.png'], cb: [HINH(12, 'lục giác $ABCDEF$ (A trên-trái, B trên-phải, C bên phải, F bên trái, D dưới-phải, E dưới-trái) tâm $O$; ba đường chéo chính $AD$, $BE$, $CF$ cắt nhau tại $O$ (AD vẽ nét đen mảnh, còn lại nét tím) ⇒ 6 tam giác nhỏ có chung đỉnh $O$; có chấm đỏ ở các đỉnh. Ảnh trong tệp gốc bị ảnh bài 13 che mất đáy dưới: nhãn $D$ cắt dở, nhãn $E$ không hiện (đỉnh vẫn thấy). Không ghi số đo.'),
      'CHƯA CHẮC — Hình bị che mất đáy dưới trong tệp gốc (nhãn D cắt dở, E không có); đề có thể ngụ ý hình đủ 6 tam giác đều — chỉ gõ lại, không suy diễn.'] }),
  ...ca(4, 'hgt', 13, 8, R`Một mảnh sân nhà có hình dạng và kích thước như hình (h.2) bên.
a) Tính diện tích mảnh sân.
b) Nếu lát sân bằng những viên gạch hình vuông có cạnh $50\ \text{cm}$ thì cần bao nhiêu viên gạch? (Biết mạch nối giữa các viên gạch không đáng kể).`,
    { anh: ['de_bai13.png'], cb: [HINH(13, 'hình chữ L (đa giác 6 cạnh, các góc vuông): cạnh trên cùng 2 m, cạnh trái 5 m, cạnh phải của phần trên 3 m, cạnh ngang bậc thang 4 m; hai cạnh còn lại (cạnh phải dưới và đáy) KHÔNG ghi số. Nhãn đáy (nếu có) bị ảnh bên dưới che trong tệp gốc.')] }),
  ...ca(4, 'hgt', 14, 8, R`Một mảnh đất có dạng hình chữ nhật với chiều dài $11\ \text{m}$ và chiều rộng $7\ \text{m}$.
a) Tính diện tích của mảnh đất?
b) Người ta để một phần mảnh đất để trồng hoa (phần kẻ sọc trong hình vẽ), phần còn lại lát gạch (phần trắng). Tính diện tích phần lát gạch?
c) Nếu lát phần còn lại của mảnh đất bằng những viên gạch hình vuông cạnh $50\ \text{cm}$ thì cần bao nhiêu viên gạch?`,
    { anh: ['de_bai14.png'], cb: [HINH(14, 'hình chữ nhật ngoài 11 m (dài) × 7 m (rộng); bên trong có hình chữ nhật kẻ sọc chéo (phần trồng hoa) kích thước 6 m (ngang) × 3 m (dọc), nằm lệch giữa; phần trắng bao quanh là phần lát gạch.')] }),
  ...ca(4, 'hgt', 15, 8, R`Bố bạn Lan thuê thợ để sơn một bức tường hình chữ nhật có kích thước chiều dài $15\ \text{m}$; chiều rộng $7\ \text{m}$. Trên bức tường đó có hai ô cửa sổ có dạng hình vuông có độ dài cạnh là $1\ \text{m}$.
a) Tính diện tích tường phải sơn.
b) Tính số tiền mà bố bạn Lan phải trả, biết rằng giá tiền công sơn tường là 40000 đồng/$\text{m}^2$ và để sơn hết bức tường cần dùng một hộp sơn có giá là 900000 đồng.`,
    { anh: ['de_bai15.png'], cb: [HINH(15, 'bức tường hình chữ nhật 15 m × 7 m (nền vàng nhạt) có hai ô cửa sổ vuông cạnh 1 m (nhãn "1m" dưới mỗi cửa) nằm cùng hàng ở nửa trên.')] }),

  // ══════════ BÀI TẬP NÂNG CAO (Bài 16–20) ══════════
  ...tach(5, 'dai', 16, 9, '', [
    ['a', R`Cho $B=2+2^2+2^3+2^4+\ldots+2^{19}+2^{20}$. Chứng tỏ $A$ chia hết cho 3.`,
      [R`CHƯA CHẮC — Đề in "Chứng tỏ A chia hết cho 3" nhưng biểu thức tên là $B$ (ý b, c, d cũng lệch chữ cái: b) cho $C$ mà chứng tỏ $B$; c) cho $D$ mà chứng tỏ $C$) — đã xem ảnh phóng to 260 dpi: đề IN THẬT như vậy, người gõ không đọc nhầm; gõ đúng như in; nhiều khả năng đề muốn chứng tỏ chính biểu thức vừa cho.`]],
    ['b', R`Cho $C=1+3+3^2+3^3+3^4+\ldots+3^{98}+3^{99}$. Chứng tỏ rằng $B$ chia hết cho 4.`, [R`CHƯA CHẮC — Lệch chữ cái như ý a): cho $C$ nhưng chứng tỏ $B$ chia hết cho 4 — gõ đúng như in.`]],
    ['c', R`Cho $D=1+4+4^2+4^3+4^4+\ldots+4^{58}+4^{59}$. Chứng tỏ $C$ chia hết cho 5; cho 21.`, [R`CHƯA CHẮC — Lệch chữ cái như ý a): cho $D$ nhưng chứng tỏ $C$ chia hết cho 5; cho 21 — gõ đúng như in.`]],
    ['d', R`Cho $A=2+2^1+2^2+2^3+\ldots+2^{60}$. Chứng minh rằng $A\vdots 7,\ A\vdots 42$.`,
      [R`CHƯA CHẮC — Tổng như in (đã xem ảnh phóng to: in thật "2 + 2^1 + 2^2 + 2^3 + … + 2^60") có hai số hạng $2$ và $2^1$ trùng nhau; tính nhanh thì $A=2^{61}$, KHÔNG chia hết cho 7 ⇒ có thể thừa số hạng "2" đầu (khi đó $A=2^1+\ldots+2^{60}=2^{61}-2$). Gõ đúng như in, không sửa.`]]]),
  ...ca(5, 'dai', '17a', 9, R`Chứng minh $2n+5$ và $4n+9$ là hai số nguyên tố cùng nhau với mọi số tự nhiên $n$`).map((q) => ({ ...q, nhan: 'Bài 17a' })),
  ...tach(5, 'dai', 18, 9, '', [
    ['b', R`Tìm số nguyên tố $p$ sao cho $p+4$ và $p+8$ đều là số nguyên tố.`, ['Đề in "Bài 17: a) …" rồi "Bài 18: b) …, c) …" (đã xem ảnh: nhãn "Bài 18:" do đánh số tự động chèn vào dòng b) — ba ý a, b, c vốn cùng một bài nhưng là ba bài toán ĐỘC LẬP (không chung dữ kiện) nên vẫn tách; giữ đúng nhãn như in (Bài 17a, Bài 18b, Bài 18c) để khớp bản in HS cầm.']],
    ['c', R`Tìm số tự nhiên $n$ biết $(3n+5)\vdots(2n+1)$.`]]),
  ...tach(5, 'dai', 19, 10, R`Tìm $x;\ y\in\mathbb{N}$, biết:`, [
    ['a', bt(R`x.y=106`)],
    ['b', bt(R`(x+1)(y-2)=48`)],
    ['c', bt(R`xy+3x-2y=51`)]]),
  ...ca(5, 'dai', 20, 10, R`Tìm số tự nhiên $a$ nhỏ nhất sao cho $a+1$ chia hết cho 2; $a$ chia hết cho tích của hai số nguyên tố liên tiếp và tích $2023a$ là số chính phương.`,
    { cb: ['Đã xem ảnh phóng to: in đúng "a +1 chia hết cho 2". KHÔNG mâu thuẫn — điều kiện a lẻ chỉ loại cặp số nguyên tố liên tiếp (2; 3), các cặp lẻ (3; 5), (5; 7)… vẫn dùng được; đề giải được (đã thử nhanh).'] }),
]

dung({
  MA: 'TC-GKI-2026',
  TEN: 'Đề cương ôn tập giữa kì I Toán 6 năm 2026–2027 — Trường THCS Thành Công, Hà Nội',
  NGUON: 'Trường THCS Thành Công',
  FILE: 'De-cuong-giua-ki-1-Toan-6-Thanh-Cong-2026.pdf',
  PHAN, CAU, LV, HERE,
})
