// ============================================================================
// NTH-GKI-2026.build.mjs — gõ lại "NỘI DUNG ÔN TẬP GIỮA HỌC KÌ I — MÔN TOÁN 6" năm học 2026–2027 — Trường THCS Ngọc Thụy (UBND phường Bồ Đề, Hà Nội)
// (PDF 8 trang: trang 1 = bìa + lịch kiểm tra các môn, KHÔNG có đề; đề thực = trang 2–8 (trang 8 chỉ còn Bài 5.2 ĐMH + dặn dò). Có lớp chữ nhưng công thức hỏng ⇒ đọc từ ẢNH.)
//
//   node kho-rules/dai/lo/k6/de-cuong/NTH-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai11,13,14,15,16.png)
//
// Phạm vi KIẾN THỨC (đề ghi): Phần Số học = Chương I (Tập hợp các số tự nhiên) · Phần Hình học = Chương IV (Một số yếu tố hình phẳng trong thực tiễn).
// Dạng điển hình: viết tập hợp + điền ∈ ∉ · thực hiện phép tính (hợp lí) · tìm số tự nhiên x · toán thực tế · bài hình có vẽ hình / tính toán.
// Hình thức thi: 100% tự luận, 90 phút. KHÔNG có trắc nghiệm.
// Cấu trúc: C. Hướng dẫn làm bài — 5 dạng (1) tập hợp (2) phép tính (3) tìm x (4) toán thực tế (5) hình; mỗi dạng có 1 "Ví dụ" IN SẴN LỜI GIẢI MẪU (khung SEE–THINK–WONDER)
//   + "Bài tập thực hành" Bài 1–16 (Bài 11 chính là Ví dụ 5, cũng in sẵn lời giải mẫu) · D. Đề minh họa Bài 1–5.
// Nhãn: Bài thực hành "Bài N"; Ví dụ (không đánh số "Bài" trong đề) ⇒ tiền tố "VD " + số thứ tự dạng: "VD Bài 1" = Ví dụ 1 (tập hợp M), "VD Bài 2a/2b" = Ví dụ 2, "VD Bài 3" = Ví dụ 3 (tìm x),
//   "VD Bài 4" = Ví dụ 4 (xe tải); Ví dụ 5 = Bài 11 (giữ nhãn "Bài 11"). Đề minh họa: "ĐMH Bài N"; Bài 4 gồm ý 1., 2. ⇒ "ĐMH Bài 4.1", "ĐMH Bài 4.2"; Bài 5 "chọn 1 trong 2" ⇒ "ĐMH Bài 5.1", "ĐMH Bài 5.2" (nhập cả hai).
// Tách ý: chỉ bài Tính / Tìm x có dữ kiện riêng (VD Bài 2, Bài 4, 5, 6, 7, ĐMH Bài 2, 3); còn lại giữ cả bài — kể cả Bài 12 "Vẽ hình" (k6.md §1.5: chỉ tách Tính + Tìm x; brief-go-de §3.3: bài hình giữ nguyên) — trạm đối chiếu 20/10 đã gộp lại.
// Kho: Chương I ⇒ 'dai'; Chương IV (diện tích / chu vi / vẽ hình, kể cả bài thực tế lát gạch, dán giấy…) ⇒ 'hgt'.
// Chỗ nghi: ĐMH Bài 2d (ngoặc tròn không hiện trên ảnh — đối chiếu đã quyết (5-1)^2, xem canh_bao) ·ĐMH Bài 3b (dấu ":" thừa cuối dòng) · Bài 15b ("1 một góc" in thừa chữ "1").
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NTH-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const LGM = 'Đề cương in sẵn lời giải mẫu (khung SEE–THINK–WONDER) — đáp số phải giải độc lập; lỗi in (nếu có): không thấy.'

const PHAN = [
  { thu_tu: 1, ten: 'C. Hướng dẫn ôn tập và làm bài (Ví dụ + Bài tập thực hành 1–16)' },
  { thu_tu: 2, ten: 'D. Đề minh họa' },
]

const CAU = [
  // ══════════ 1) Viết tập hợp. Điền kí hiệu thích hợp ══════════
  ...ca(1, 'dai', 'VD ', 1, 1, R`Gọi $M$ là tập hợp các số tự nhiên lớn hơn $7$ và không lớn hơn $10$.
• Mô tả tập hợp $M$ bằng hai cách.
• Điền dấu $\in$ hoặc $\notin$ thích hợp vào ô trống: $5\ \square\ M$; $10\ \square\ M$.`, { cb: [LGM] }),
  ...ca(1, 'dai', '', 1, 1, R`Gọi $E$ là tập hợp các số tự nhiên khác $0$, lớn hơn $2$ nhưng không lớn hơn $5$. Hãy mô tả tập hợp $E$ bằng hai cách.`),
  ...ca(1, 'dai', '', 2, 1, R`Cho $B$ là tập hợp gồm các chữ cái trong từ NGỌC THỤY.
a) Bằng cách liệt kê các phần tử, hãy mô tả tập hợp $B$.
b) Điền dấu $\in$ hoặc $\notin$ thích hợp vào ô trống: $J\ \square\ B$; $T\ \square\ B$.`),
  ...ca(1, 'dai', '', 3, 1, R`Gọi $C$ là tập hợp các số tự nhiên có hai chữ số giống nhau. Hãy mô tả tập $C$ bằng cách liệt kê phần tử của nó.`),

  // ══════════ 2) Thực hiện phép tính ══════════
  ...tach(1, 'dai', 'VD ', 2, 1, R`Thực hiện phép tính:`, [
    ['a', bt(R`72-48:3.4+2^1`), [LGM]],
    ['b', bt(R`\{125-[1+3.(37-3^3)]\}:2`), [LGM]]]),
  ...tach(1, 'dai', '', 4, 1, R`Tính một cách hợp lí:`, [
    ['a', bt(R`66.28+66.72-230`)],
    ['b', bt(R`27.121-87.27+73.34`)],
    ['c', bt(R`27.39+27.63-2.27`)],
    ['d', bt(R`41.36+59.90+41.84+59.30`)]]),
  ...tach(1, 'dai', '', 5, 2, R`Thực hiện phép tính:`, [
    ['a', bt(R`3.5^2+15.2^2-26:2`)],
    ['b', bt(R`151-2^{91}:2^{88}+1^5.3`)],
    ['c', bt(R`47-[(45.2^4-5^2.12):14]`)],
    ['d', bt(R`50+[(20-2^3):2+34]`)]]),

  // ══════════ 3) Tìm số tự nhiên x ══════════
  ...ca(1, 'dai', 'VD ', 3, 2, R`Tìm số tự nhiên $x$, biết: $120:(x-5)=2^2.3$.`, { cb: [LGM] }),
  ...tach(1, 'dai', '', 6, 2, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`x+56=100`)],
    ['b', bt(R`2x+11=15`)],
    ['c', bt(R`(x-36):18=12`)]]),
  ...tach(1, 'dai', '', 7, 2, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`(2x+1)^3=125`)],
    ['b', bt(R`3.2^x-3=45`)],
    ['c', bt(R`720:[41-(2x-5)]=2^3.5`)]]),

  // ══════════ 4) Bài toán thực tế ══════════
  ...ca(1, 'dai', 'VD ', 4, 3, R`Một xe tải chở gạo chứa các bao gạo loại 10 kg/1 bao và 20 kg/1 bao. Trên xe chứa 100 bao loại 10 kg và 50 bao loại 20 kg. Biết trọng tải của xe là 3 tấn. Hỏi xe chở hàng có đúng trọng tải quy định không?`, { cb: [LGM] }),
  ...ca(1, 'dai', '', 8, 3, R`Tập thể lớp 6A vận động các học sinh quyên góp 2000000 đồng để ủng hộ đồng bào miền Trung lũ lụt. Có bạn Quân ủng hộ 200000 đồng, bạn Hoa đã ủng hộ 300000 đồng, số tiền còn lại dự kiến chia đều cho các thành viên còn lại của lớp. Hỏi mỗi học sinh cần ủng hộ bao nhiêu tiền? Biết sĩ số lớp 6A là 32 học sinh.`),
  ...ca(1, 'dai', '', 9, 3, R`Khối 6 và khối 7 của một trường trung học cơ sở lần lượt có 480 và 378 học sinh đi tham quan. Nhà trường cần thuê ít nhất bao nhiêu xe ô tô 45 chỗ ngồi để đủ chỗ cho tổng tất cả học sinh khối 6 và khối 7 đi tham quan?`),
  ...ca(1, 'dai', '', 10, 3, R`Một cửa hàng bán quần áo niêm yết giá 1 chiếc áo phông là 250000 đồng, giá 1 chiếc áo sơ mi là 300000 đồng. Do có chương trình khuyến mãi, mỗi chiếc áo phông giảm 30000 đồng, mỗi chiếc áo sơ mi giảm 40000 đồng. Chị Hoa mua 2 chiếc áo phông và 3 chiếc áo sơ mi. Hỏi tổng số tiền mà chị Hoa phải trả là bao nhiêu?`),

  // ══════════ 5) Bài toán hình học có nội dung vẽ hình và tính toán (Chương IV) ══════════
  ...ca(1, 'hgt', '', 11, 3, R`Khoảng sân nhà bác Minh là một hình vuông có độ dài cạnh 6 m. Bác Minh xây 4 góc theo các hình vuông nhỏ có độ dài cạnh 15 dm để làm khu đất trồng hoa, phần sân còn lại để lát gạch.
a) Hãy tính diện tích phần sân lát gạch.
b) Biết chi phí để trồng 1 $\text{m}^2$ hoa (đã bao gồm cả hoa và tiền công) là 65000 đồng, chi phí để lát 1 $\text{m}^2$ gạch (đã bao gồm cả vật tư và tiền công) là 165000 đồng. Hỏi bác Minh cần chi trả bao nhiêu tiền để hoàn thiện khoảng sân?`, { anh: ['de_bai11.png'], cb: [
    'Đọc hình: hình vuông lớn, cạnh ghi 6 m (mũi tên dưới đáy); bốn hình vuông nhỏ tô xám ở bốn góc, cạnh ghi 15 dm (nhãn đặt cạnh hình vuông nhỏ góc dưới bên phải).',
    'Bài 11 chính là "Ví dụ 5" của dạng (5) — ' + LGM] }),
  ...ca(1, 'hgt', '', 12, 3, R`Vẽ hình theo các yêu cầu sau:
a) Hình vuông có cạnh bằng 4 cm.
b) Hình chữ nhật có chiều dài 6cm, chiều rộng 4cm.
c) Hình thoi có cạnh bằng 3cm.
d) Hình bình hành có cạnh 3cm và 5cm.`, { cb: ['Ý c), d) đề không cho góc ⇒ hình không duy nhất; lời giải vẽ một hình thoả đề và nói rõ góc tự chọn.'] }),
  ...ca(1, 'hgt', '', 13, 4, R`Trong mảnh vườn hình chữ nhật có chiều dài 16 m, chiều rộng 10 m, người ta trồng hoa hồng trong một mảnh đất hình thoi như hình bên. Nếu mỗi mét vuông trồng 4 cây hoa thì cần bao nhiêu cây hoa để trồng trên mảnh đất hình thoi đó?`, { anh: ['de_bai13.png'], cb: [
    'Đọc hình: hình chữ nhật chiều dài 16 m (ghi dưới đáy), chiều rộng 10 m (ghi bên phải); hình thoi tô xanh nằm trong hình chữ nhật, bốn đỉnh nằm trên bốn cạnh của hình chữ nhật (nhìn trên hình là trung điểm các cạnh).'] }),
  ...ca(1, 'hgt', '', 14, 4, R`Bác An cần dán giấy cho một bức tường hình chữ nhật có chiều dài 7 m, chiều rộng 4 m. Biết trên bức tường đó bác An không dán giấy phần cửa sổ hình vuông có cạnh dài 20 dm
a) Tính diện tích phần tường cần dán giấy.
b) Bác An sử dụng loại giấy dán tường có giá 120000 đồng/$\text{m}^2$. Công dán giấy là 50000 đồng/$\text{m}^2$. Hỏi tổng chi phí bác An cần chi trả để dán giấy cho bức tường đó là bao nhiêu?`, { anh: ['de_bai14.png'], cb: [
    'Đọc hình: bức tường hình chữ nhật, chiều dài ghi 7 m (trên), chiều rộng ghi 4 m (trái); bên trong có cửa sổ hình vuông chia 4 ô, cạnh ghi 20dm.'] }),
  ...ca(1, 'hgt', '', 15, 4, R`Cho mảnh vườn có dạng hình vuông cạnh 30m. Người ta để một phần vườn làm lối đi rộng 3m (như hình vẽ), phần còn lại để trồng rau.
a) Tính diện tích phần trồng rau?
b) Người ta làm hàng rào xung quanh mảnh vườn trồng rau và ở 1 một góc vườn rau có để cửa ra vào rộng 3m. Tính độ dài hàng rào đó.`, { anh: ['de_bai15.png'], cb: [
    'Đọc hình: hình vuông lớn cạnh 30m (ghi bên trái; mũi tên cạnh trên không ghi số); lối đi hình chữ L rộng 3m chạy dọc cạnh bên phải và cạnh đáy (ghi "Lối đi: 3m" ở cả hai); phần còn lại ở góc trên bên trái là mảnh vườn trồng rau.',
    'CHƯA CHẮC — Ý b) đề in "ở 1 một góc vườn rau" (thừa chữ "1", gõ đúng như in); hiểu là cửa ra vào ở MỘT góc vườn rau.'] }),
  ...ca(1, 'hgt', '', 16, 4, R`Một thửa ruộng có dạng hình thang cân có kích thước như hình vẽ. Biết năng suất lúa là $0,8$ kg/$\text{m}^2$.
a) Tính diện tích mảnh ruộng.
b) Hỏi mảnh ruộng cho sản lượng là bao nhiêu kilogam thóc?`, { anh: ['de_bai16.png'], cb: [
    'Đọc hình: hình thang cân, đáy trên 15 m, đáy dưới 25 m, đường cao 10 m (kẻ từ đỉnh trên bên trái xuống đáy dưới, có kí hiệu góc vuông).'] }),

  // ══════════ D. ĐỀ MINH HỌA ══════════
  ...ca(2, 'dai', 'ĐMH ', 1, 4, R`Cho tập hợp $A=\{x\in\mathbb{N}^*\mid x\le 6\}$.
a) Viết tập hợp $A$ bằng cách liệt kê các phần tử của tập hợp.
b) Điền các kí hiệu $\in;\ \notin$ thích hợp vào dấu “…”:
$0\ \ldots\ A$; $6\ \ldots\ A$.`),
  ...tach(2, 'dai', 'ĐMH ', 2, 4, R`Thực hiện phép tính (tính một cách hợp lí nếu có thể):`, [
    ['a', bt(R`176+228+272+324`)],
    ['b', bt(R`27.36+27.64`)],
    ['c', bt(R`3.5^2-16:2^2`)],
    ['d', bt(R`20-[30-(5-1)^2]`), [R`Ảnh dựng từ PDF hiện "20 − [30 − 5 − 1²]" vì máy dựng ảnh thiếu phông Symbol (pdftoppm báo "No display font for 'Symbol'") nên mất glyph ngoặc tròn. Đối chiếu (20/10): (1) toạ độ chữ trong PDF — khoảng "30" → "5" rộng 17,1pt so với 12,6pt của " − " thường (thừa ≈ một dấu "("), số mũ 2 cách chữ "1" 3,3pt trong khi số mũ ở câu 3d dính sát cơ số (chỗ trống = một dấu ")"); (2) đọc nguyên văn $20-[30-5-1^2]=20-24$ ra số âm, ngoài $\mathbb{N}$; đọc có ngoặc $20-[30-(5-1)^2]=20-14=6$. Hai nhân chứng khớp ⇒ nhập $(5-1)^2$.`]]]),
  ...tach(2, 'dai', 'ĐMH ', 3, 5, R`Tìm số tự nhiên $x$, biết:`, [
    ['a', bt(R`x-12=13`)],
    ['b', R`$87-(73-x)=20$ :`, [R`CHƯA CHẮC — đề in thừa dấu ":" ở cuối phương trình (sau "= 20"); gõ đúng như in.`]],
    ['c', bt(R`2.x+3=15`)],
    ['d', bt(R`4x-20=2^5:2^3`)]]),
  ...ca(2, 'dai', 'ĐMH ', '4.1', 5, R`Mẹ Lan mang 300000 đồng vào siêu thị mua 2 kg khoai tây, 5 kg gạo và 2 nải chuối chín. Giá mỗi ki-lô-gam khoai tây là 26500 đồng, mỗi ki-lô-gam gạo là 24000 đồng, mỗi nải chuối là 32000 đồng. Hỏi mẹ Lan còn bao nhiêu tiền?`),
  ...ca(2, 'hgt', 'ĐMH ', '4.2', 5, R`Một nền nhà hình chữ nhật có chiều dài 16 m, chiều rộng 6 m. Người ta dự định lát nền bởi những viên gạch men hình vuông có cạnh 40 cm. Hỏi người ta cần dùng bao nhiêu viên gạch để lát ?`),
  ...ca(2, 'dai', 'ĐMH ', '5.1', 5, R`Một phòng chiếu phim có 7 hàng ghế, mỗi hàng ghế có 12 ghế. Giá mỗi vé xem phim là 60 nghìn đồng.
a) Nếu tất cả các vé đều được bán thì số tiền bán vé thu được là bao nhiêu?
b) Tối chủ nhật còn 23 vé không bán được. Hỏi số tiền bán vé thu được là bao nhiêu?`, { cb: ['Bài 5 của đề minh họa ghi "(Chọn 1 trong 2 bài)", 0,5 điểm — đã nhập cả hai (5.1 và 5.2).'] }),
  ...ca(2, 'dai', 'ĐMH ', '5.2', 5, R`Một đoàn tàu mất 65 giây để đi qua cây cầu dài 1200 m. Cũng với đoàn tàu và vận tốc đó, sẽ mất 85 giây để đi qua một đường hầm dài 1600 m. Hỏi chiều dài đoàn tàu là bao nhiêu mét? Vận tốc của đoàn tàu khi đi qua cây cầu và đường hầm là bao nhiêu?`, { cb: [
    'Bài 5 của đề minh họa ghi "(Chọn 1 trong 2 bài)" — đã nhập cả hai.',
    'CHƯA CHẮC — bài dạng nâng cao (chuyển động, vận tốc – quãng đường – thời gian của tiểu học); đề không ghi đơn vị vận tốc cần trả lời (m/giây hay km/giờ).'] }),
]

dung({
  MA: 'NTH-GKI-2026',
  TEN: 'Đề cương ôn tập giữa kì I Toán 6 năm 2026–2027 — Trường THCS Ngọc Thụy, Hà Nội',
  NGUON: 'Trường THCS Ngọc Thụy',
  FILE: 'De-cuong-giua-ki-1-Toan-6-Ngoc-Thuy-2026.pdf',
  PHAN, CAU, LV, HERE,
})
