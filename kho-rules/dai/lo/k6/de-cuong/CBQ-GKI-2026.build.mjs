// ============================================================================
// CBQ-GKI-2026.build.mjs — gõ lại "TRỌNG TÂM ÔN TẬP GIỮA HỌC KÌ I — MÔN TOÁN LỚP 6, năm học 2026–2027" — Trường THCS Cao Bá Quát (UBND xã Thuận An, Hà Nội)
// (PDF 4 trang có lớp chữ, ký hiệu toán hỏng ⇒ đọc từ ẢNH trang 130 dpi + phóng 260 dpi chỗ nhỏ; Thùy gửi 20/10)
//
//   node kho-rules/dai/lo/k6/de-cuong/CBQ-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_hinh_bai14.png)
//
// Phạm vi KIẾN THỨC (đề ghi): Số học = các cách mô tả tập hợp · thứ tự thực hiện phép tính · công thức luỹ thừa · tính chất chia hết của tổng, hiệu ·
//   cách tìm ước, bội · dấu hiệu chia hết cho 2, 3, 5, 9 · số nguyên tố, hợp số · ƯC, ƯCLN · BC, BCNN.
//   Hình học = các yếu tố cơ bản của tam giác đều, hình vuông, lục giác đều, hình chữ nhật, hình thoi, hình bình hành, hình thang cân; công thức chu vi, diện tích
//   hình vuông, hình chữ nhật, hình thang. (Bài tập thực tế chỉ dùng hình vuông / chữ nhật / thang.)
// Cấu trúc: I. Trọng tâm kiến thức (không có câu) · II. Các dạng bài tập:
//   PHẦN A: SỐ HỌC — Dạng 1…8, Bài 1–21 đánh số LIÊN TỤC xuyên các dạng (ví dụ Dạng 2 có Bài 3, 4, 5) ⇒ nhãn giữ "Bài N"; mỗi Dạng = 1 PHẦN của file này.
//   PHẦN B: HÌNH HỌC — Bài 1–14 đánh số LẠI từ 1 ⇒ nhãn "Hình Bài N".
//   PHẦN C: BÀI TẬP NÂNG CAO — Bài 1–8 đánh số LẠI từ 1 ⇒ nhãn "NC Bài N".
// Tách ý: chỉ ý có dữ kiện RIÊNG (Bài 1, 2, 3, 4, 5, 6, 7, 9, 11, 12 của Số học); giữ cả bài khi chung dữ kiện / ý sau dùng ý trước
//   (Số học Bài 8 chung danh sách số · Bài 10 một dòng liệt kê 8 số, đề KHÔNG đánh a)…h) · Bài 13–21 lời văn · Hình Bài 7, 11, 13 · NC Bài 1–3, 8).
// Nhãn ý giữ ĐÚNG nhãn in (Bài 1: a b c d e f g i k — đề bỏ h, j · Bài 2: a…h i k l m · Bài 3: a…h i k l · Bài 4: a…h i k l m).
// Dấu "." giữa hai số trong đề là DẤU NHÂN (đề dùng cả "·" lẫn "."): giữ "." như in.
// Đề cương KHÔNG có đáp án / lời giải — chỉ gõ ĐỀ.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/CBQ-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Phần A. Số học — Dạng 1: Thực hiện phép tính (Bài 1–2)' },
  { thu_tu: 2, ten: 'Phần A. Số học — Dạng 2: Tìm x (Bài 3–5)' },
  { thu_tu: 3, ten: 'Phần A. Số học — Dạng 3: Quan hệ chia hết và tính chất (Bài 6–7)' },
  { thu_tu: 4, ten: 'Phần A. Số học — Dạng 4: Dấu hiệu chia hết (Bài 8–9)' },
  { thu_tu: 5, ten: 'Phần A. Số học — Dạng 5: Phân tích ra thừa số nguyên tố (Bài 10)' },
  { thu_tu: 6, ten: 'Phần A. Số học — Dạng 6: Ước chung, Ước chung lớn nhất (Bài 11)' },
  { thu_tu: 7, ten: 'Phần A. Số học — Dạng 7: Bội chung, BCNN (Bài 12)' },
  { thu_tu: 8, ten: 'Phần A. Số học — Dạng 8: Bài toán thực tế về ƯC LN, BCNN (Bài 13–21)' },
  { thu_tu: 9, ten: 'Phần B. Hình học (Bài 1–14)' },
  { thu_tu: 10, ten: 'Phần C. Bài tập nâng cao (Bài 1–8)' },
]

// Trạm đối chiếu 20/10: ảnh 260 dpi — cột g/i/k của Bài 1 in dấu chấm CHÂN dòng "." (cột d/e/f in "·"); cả đề không có số thập phân nào (không có dấu ","),
//   đọc nhân thì g = 545.80-80.445, i = 43.30+30.57, k = 64.100-2300 đều ra số tự nhiên tròn; đọc thập phân thì k ÂM. ⇒ DẤU NHÂN chắc chắn, hạ xuống ghi chú thường.
const DAU_NHAN = R`Đề in dấu "." (chấm chân dòng) giữa hai số — là DẤU NHÂN (vd $545.65$ là 545 nhân 65): đề không có số thập phân nào, ý k cùng cột đọc thập phân thì ra số âm.`

const CAU = [
  // ══════════ PHẦN A — SỐ HỌC ══════════
  // ── Dạng 1: Thực hiện phép tính ──
  ...tach(1, 'dai', '', 1, 1, R`Tính hợp lí (nếu có thể).`, [
    ['a', bt(R`176+228+272+324`)],
    ['b', bt(R`526-131-326+321`)],
    ['c', bt(R`27.35+27.65`)],
    ['d', bt(R`56.72-56.62`)],
    ['e', bt(R`125.24+125.76`)],
    ['f', bt(R`2025.37-2025`)],
    ['g', bt(R`545.65+15.545-80.445`), [DAU_NHAN]],
    ['i', bt(R`43.78-43.48+30.80-30.23`), [DAU_NHAN]],
    ['k', bt(R`64.57+64.43-2300`), [DAU_NHAN]]]),
  ...tach(1, 'dai', '', 2, 2, R`Thực hiện phép tính.`, [
    ['a', bt(R`3^2.5+18:3`)],
    ['b', bt(R`2^3.5-36:6`)],
    ['c', bt(R`3.5^2-16:2^2`), [R`Đề in "3.5²" — dấu "." là DẤU NHÂN ($3.5^2$ là 3 nhân $5^2$), không phải số thập phân 3,5.`]],
    ['d', bt(R`2^3.17-2^3.14`)],
    ['e', bt(R`8.5^2-189:3^2`), [R`Đề in "8.5²" — dấu "." là DẤU NHÂN ($8.5^2$ là 8 nhân $5^2$), không phải số thập phân 8,5.`]],
    ['f', bt(R`120-[35-(12+8)]`)],
    ['g', bt(R`5^2.4-3.(18-7)`)],
    ['h', bt(R`200:[117-(23-2.3)]`)],
    ['i', bt(R`20-[30-(5-1)^2]`)],
    ['k', bt(R`2^4.5-[131-(13-4)^2]`)],
    ['l', bt(R`2020-[45-(6-1)^2]+1992^0`)],
    ['m', bt(R`480:[75+(7^2-8.3):5]+2021^0`)]]),

  // ── Dạng 2: Tìm x ──
  ...tach(2, 'dai', '', 3, 3, R`Tìm số tự nhiên $x$ biết:`, [
    ['a', bt(R`x+125=348`)],
    ['b', bt(R`x-237=156`)],
    ['c', bt(R`5x=145`)],
    ['d', bt(R`x:8=24`)],
    ['e', bt(R`3x+15=60`)],
    ['f', bt(R`5x-17=48`)],
    ['g', bt(R`72-4x=28`)],
    ['h', bt(R`(x+15).4=100`)],
    ['i', bt(R`(x-12):5=8`)],
    ['k', bt(R`120:(x-5)=10`)],
    ['l', bt(R`x+21=7^5:7^3`)]]),
  ...tach(2, 'dai', '', 4, 4, R`Tìm số tự nhiên $x$ biết:`, [
    ['a', bt(R`(x+7)-25=13`)],
    ['b', bt(R`87-(73-x)=20`)],
    ['c', bt(R`x-105:21=15`)],
    ['d', bt(R`15+(x+2)^2:3=18`)],
    ['e', bt(R`20-2(x-1)^2=2`)],
    ['f', bt(R`5^x=25`)],
    ['g', bt(R`2^{x+3}=32`)],
    ['h', bt(R`7^{x-5}=49`)],
    ['i', bt(R`3^{x-1}+3^x+3^{x+1}=39`)],
    ['k', bt(R`(x+1)^3=27`)],
    ['l', bt(R`(x-7)^2=81`)],
    ['m', bt(R`(4x-18)^4=16`)]]),
  ...tach(2, 'dai', '', 5, 5, R`Tìm số tự nhiên $x$ biết:`, [
    ['a', R`$x\in\text{Ư}(18)$ và $x\in\text{B}(4)$`],
    ['b', R`$x\in\text{Ư}(20)$ và $x\in\text{B}(2)$`],
    ['c', R`$x\in\text{B}(18)$ và $30\le x\le 100$`],
    ['d', R`$x\in\text{Ư}(20)$ và $x\le 50$`]]),

  // ── Dạng 3: Quan hệ chia hết và tính chất ──
  ...tach(3, 'dai', '', 6, 5, '', [
    ['a', R`Viết tập hợp các ước của 24; 36; 53; 91.`],
    ['b', R`Viết tập hợp 5 bội đầu tiên khác 0 của 8; 12; 21; 35.`]]),
  ...tach(3, 'dai', '', 7, 5, R`Không thực hiện phép tính, áp dụng tính chất chia hết, xét xem mỗi tổng (hoặc hiệu) sau có chia hết cho 9 hay không? Vì sao?`, [
    ['a', R`$72+61$`],
    ['b', R`$28-9$`],
    ['c', R`$12+18+36$`],
    ['d', R`$180+27-45$`]]),

  // ── Dạng 4: Dấu hiệu chia hết ──
  ...ca(4, 'dai', '', 8, 6, R`Trong các số sau: 120; 135; 246; 375; 480; 625; 730; 126; 135; 217; 324; 405; 512; 729
Không thực hiện phép chia:
a) Số nào chia hết cho 2, số nào chia hết cho 5, số nào chia hết cho cả 2 và 5?
b) Số nào chia hết cho 3, số nào chia hết cho 9, số nào chia hết cho cả 3 và 9?
c) Số nào chia hết cho cả 2,3,5,9? Số nào chia hết cho 3 và 5 nhưng không chia hết cho 9?`, { cb: [R`CHƯA CHẮC — Danh sách số in hai lần số 135 (vị trí thứ 2 và thứ 9); đã gõ đúng như in, không bỏ bản trùng.`] }),
  ...tach(4, 'dai', '', 9, 6, R`Tìm $x$ để:`, [
    ['a', R`$\overline{24x}$ chia hết cho 2.`],
    ['b', R`$\overline{35x}$ chia hết cho 5`],
    ['c', R`$\overline{12x}$ chia hết cho 3.`],
    ['d', R`$\overline{45x}$ chia hết cho 9.`],
    ['e', R`$\overline{3x5}$ chia hết cho 5 và 3.`],
    ['f', R`$\overline{450x}$ chia hết cho 2, 5 và 9.`]]),

  // ── Dạng 5: Phân tích ra thừa số nguyên tố ──
  ...ca(5, 'dai', '', 10, 6, R`Phân tích các số sau ra thừa số nguyên tố: 60; 84; 120; 180; 72; 90; 126; 225`),

  // ── Dạng 6: ƯC, ƯCLN ──
  ...tach(6, 'dai', '', 11, 7, R`Tìm ƯCLN của:`, [
    ['a', R`18 và 24`],
    ['b', R`36 và 48`],
    ['c', R`60 và 84`],
    ['d', R`72 và 108`],
    ['e', R`45, 75 và 105`],
    ['f', R`48, 72 và 120`],
    ['g', R`84, 126 và 210.`]]),

  // ── Dạng 7: BC, BCNN ──
  ...tach(7, 'dai', '', 12, 8, R`Tìm BCNN của:`, [
    ['a', R`6 và 8`],
    ['b', R`12 và 18`],
    ['c', R`15 và 20`],
    ['d', R`24 và 36`],
    ['e', R`18, 24 và 30`],
    ['f', R`12, 20 và 45`],
    ['g', R`24, 36 và 54`]]),

  // ── Dạng 8: Bài toán thực tế về ƯC LN, BCNN ──
  ...ca(8, 'dai', '', 13, 8, R`Một lớp có 36 học sinh nam và 48 học sinh nữ. Cô giáo muốn chia lớp thành các nhóm sao cho số học sinh nam và số học sinh nữ được chia đều vào các nhóm. Hỏi có thể chia được nhiều nhất bao nhiêu nhóm? Khi đó mỗi nhóm có bao nhiêu học sinh nam và bao nhiêu học sinh nữ?`),
  ...ca(8, 'dai', '', 14, 8, R`Một cửa hàng có 84 quyển vở và 126 chiếc bút. Người ta muốn chia đều số vở và số bút thành các phần quà giống nhau sao cho số phần quà là nhiều nhất. Hỏi chia được nhiều nhất bao nhiêu phần quà? Mỗi phần có bao nhiêu quyển vở và bao nhiêu chiếc bút?`),
  ...ca(8, 'dai', '', 15, 9, R`Một lớp học có 24 học sinh nam và 18 học sinh nữ'. Có bao nhiêu cách chia tổ sao cho số nam và số nữ được chia đều vào các tổ?.`, { cb: [R`CHƯA CHẮC — Đề in lỗi dấu câu: có dấu nháy thừa sau "nữ" ("nữ'.") và "tổ?." ở cuối; đã gõ đúng như in. Câu hỏi "bao nhiêu cách chia tổ" có hai cách hiểu: số tổ $\in\text{ƯC}(24,18)=\{1;2;3;6\}$ ⇒ 4 cách nếu tính cả "1 tổ" (cả lớp), 3 cách nếu số tổ phải từ 2 trở lên — lời giải phải nói rõ cách hiểu.`] }),
  ...ca(8, 'dai', '', 16, 9, R`Tổ 1 của lớp 6B được nhận phần thưởng của cô giáo chủ nhiệm và mỗi em được nhận phần thưởng như nhau. Cô giáo chủ nhiệm đã chia hết 54 quyển vở và 45 bút bi. Hỏi số học sinh tổ 1 của lớp 6B là bao nhiêu? Biết mỗi tổ của lớp có số học sinh nhiều hơn 3.`),
  ...ca(8, 'dai', '', 17, 9, R`Cô giáo chủ nhiệm muốn chia 24 quyển vở, 48 bút bi và 36 gói bánh thành một số phần thưởng như nhau để trao trong dịp sơ kết học kì. Hỏi có thể chia được nhiều nhất bao nhiêu phần thưởng? Khi đó mỗi phần thưởng có bao nhiêu quyển vở, bút bi và gói bánh?.`, { cb: [R`CHƯA CHẮC — Đề in lỗi dấu câu "bánh?." ở cuối; đã gõ đúng như in.`] }),
  ...ca(8, 'dai', '', 18, 9, R`Bạn Hà có 42 viên bi màu đỏ và 30 viên bi màu vàng. Hà có thể chia nhiều nhất vào bao nhiêu túi sao cho số bi đỏ và bi vàng được chia đều vào các túi? Khi đó mỗi túi có bao nhiêu viên bi đỏ và viên bi vàng.`),
  ...ca(8, 'dai', '', 19, 9, R`Ba khối 6, 7, 8 theo thứ tự có 300 học sinh, 276 học sinh, 252 học sinh xếp thành hàng dọc để diễu hành sao cho số hàng dọc của mỗi khối như nhau. Có thể xếp nhiều nhất thành mấy hàng dọc để mỗi khối đều không có ai lẻ hàng? Khi đó ở mỗi khối có bao nhiêu hàng ngang?`),
  ...ca(8, 'dai', '', 20, 9, R`Ba bạn An, Bình và Cường cùng trực nhật. An cứ 6 ngày trực nhật một lần, Bình cứ 8 ngày trực nhật một lần và Cường cứ 12 ngày trực nhật một lần. Hôm nay ba bạn cùng trực nhật. Hỏi sau ít nhất bao nhiêu ngày ba bạn lại cùng trực nhật?`),
  ...ca(8, 'dai', '', 21, 9, R`Một đèn đỏ cứ 12 giây bật sáng một lần, một đèn xanh cứ 18 giây bật sáng một lần. Lúc 8 giờ hai đèn cùng bật sáng. Hỏi sau ít nhất bao nhiêu giây hai đèn lại cùng bật sáng?`),

  // ══════════ PHẦN B — HÌNH HỌC ══════════
  ...ca(9, 'hgt', 'Hình ', 1, 10, R`Một hình vuông có cạnh 8 cm. Tính chu vi và diện tích hình vuông.`),
  ...ca(9, 'hgt', 'Hình ', 2, 10, R`Một hình vuông có chu vi 48 cm. Tính diện tích hình vuông.`),
  ...ca(9, 'hgt', 'Hình ', 3, 10, R`Một khu đất hình vuông có diện tích 225 $\text{m}^2$. Tính độ dài cạnh và chu vi khu đất.`),
  ...ca(9, 'hgt', 'Hình ', 4, 10, R`Một hình chữ nhật có chiều dài 15 cm và chiều rộng 8 cm. Tính chu vi và diện tích hình chữ nhật.`),
  ...ca(9, 'hgt', 'Hình ', 5, 10, R`Một hình chữ nhật có chu vi 50 cm, chiều dài 15 cm. Tính chiều rộng và diện tích hình chữ nhật.`),
  ...ca(9, 'hgt', 'Hình ', 6, 10, R`Mảnh vườn hình chữ nhật có chiều rộng bằng 8m và diện tích bằng $120\ \text{m}^2$. Tính chu vi mảnh vườn hình chữ nhật đó?`),
  ...ca(9, 'hgt', 'Hình ', 7, 10, R`Một nền nhà hình chữ nhật có chiều dài 8m, chiều rộng 6m.
a) Tính chu vi và diện tích nền nhà.
b) Nếu lát nền nhà bằng những viên gạch hình vuông cạnh 40cm thì cần bao nhiêu viên gạch?`),
  ...ca(9, 'hgt', 'Hình ', 8, 11, R`Nền một căn phòng hình chữ nhật có chiều dài 10m và chiều rộng bằng $\dfrac{1}{2}$ chiều dài. Người ta định dùng gạch men hình vuông có cạnh 50cm để lát kín nền căn phòng ấy. Hỏi cần bao nhiêu viên gạch như thế? Biết rằng các mối nối và sự hao hụt không đáng kể.`),
  ...ca(9, 'hgt', 'Hình ', 9, 11, R`Một hình thang có hai đáy dài 12 cm và 20 cm, chiều cao 7 cm. Tính diện tích hình thang.`),
  ...ca(9, 'hgt', 'Hình ', 10, 11, R`Một hình thang có diện tích 120 $\text{cm}^2$, hai đáy dài 10 cm và 14 cm. Tính chiều cao hình thang.`),
  ...ca(9, 'hgt', 'Hình ', 11, 11, R`Một hình thang cân có hai đáy dài 10cm và 18cm, hai cạnh bên đều dài 5 cm.
a) Tính chu vi hình thang.
b) Tính diện tích hình thang biết chiều cao bằng 3 cm.`),
  ...ca(9, 'hgt', 'Hình ', 12, 11, R`Một hình vuông có diện tích bằng diện tích của một hình chữ nhật có chiều dài 16 cm và chiều rộng 9 cm. Tính độ dài cạnh hình vuông.`),
  ...ca(9, 'hgt', 'Hình ', 13, 11, R`Một khu đất hình chữ nhật có chiều dài 30 m và chiều rộng 20 m. Ở giữa khu đất có một bồn hoa hình vuông cạnh 8 m.
a) Tính diện tích khu đất.
b) Tính diện tích phần đất còn lại sau khi làm bồn hoa.`),
  ...ca(9, 'hgt', 'Hình ', 14, 11, R`Để chuẩn bị cho Tết nguyên đán 2022 bác An chia khu vườn của mình thành ba phần để trồng hoa theo hình vẽ sau (đơn vị độ dài là mét):
Trong đó: Phần đất hình chữ nhật trồng hoa Mai. Phần đất hình vuông trồng hoa Cúc. Phân đất hình tam giác trồng hoa Hồng. Em hãy tính diện tích mỗi phần.`, {
    anh: ['de_hinh_bai14.png'],
    cb: [
      R`Đọc hình: ghép ba phần — hình chữ nhật (tô xanh lá) dài 15, rộng 10; hình vuông (tô tím) cạnh 10 nằm liền bên phải hình chữ nhật (chung cạnh 10); tam giác (tô đỏ) đặt trên cạnh trên của hình vuông, có cạnh đáy 10 (trùng cạnh trên hình vuông) và cạnh đứng 10 dựng lên từ đỉnh trên bên phải của hình vuông (vuông góc với đáy, tam giác vuông cân ở góc trên bên phải hình vuông). Đơn vị mét.`,
      R`CHƯA CHẮC — Đề in "Phân đất hình tam giác" (chắc là "Phần"); đã gõ đúng như in. Mốc "Tết nguyên đán 2022" là của đề gốc.`]
  }),

  // ══════════ PHẦN C — BÀI TẬP NÂNG CAO ══════════
  ...ca(10, 'dai', 'NC ', 1, 12, R`Cho $C=3+3^2+3^3\ldots+3^{120}$. Chứng minh rằng:
a) $C$ chia hết cho 4
b) $C$ chia hết cho 13`, { cb: [R`CHƯA CHẮC — Đề in "$3^3\ldots+3^{120}$" (thiếu dấu + trước dấu ba chấm); đã gõ đúng như in.`] }),
  ...ca(10, 'dai', 'NC ', 2, 12, R`Cho $D=3^2+3^4+3^6+\ldots+3^{120}$. Chứng minh rằng:
a) $D$ chia hết cho 9
b) $D$ chia hết cho 91`),
  ...ca(10, 'dai', 'NC ', 3, 12, R`Cho $E=1+4+4^2+4^3+4^4+\ldots+4^{99}$. Chứng minh rằng:
a) $E$ chia hết cho 5
b) $E$ chia hết cho 17`),
  ...ca(10, 'dai', 'NC ', 4, 12, R`Tìm số tự nhiên $x$ để $(x+3)\ \vdots\ x$`),
  ...ca(10, 'dai', 'NC ', 5, 13, R`Tìm số tự nhiên $x$ để $(8-x)\ \vdots\ x$`),
  ...ca(10, 'dai', 'NC ', 6, 13, R`Tìm số tự nhiên $x$ để $(x+3)\ \vdots\ (x+1)$`),
  ...ca(10, 'dai', 'NC ', 7, 13, R`Tìm số tự nhiên nhỏ nhất có bốn chữ số, biết rằng khi chia số đó cho 12, 15 và 18 đều có cùng một số dư khác 0.`),
  ...ca(10, 'dai', 'NC ', 8, 13, R`Cho 2 số tự nhiên $a$ và $b$ biết: $\text{ƯCLN}(a,\ b)=12$; $\text{BCNN}(a,\ b)=180$; $a<b$.
a) Tìm tất cả các cặp số $(a,\ b)$
b) Tính tổng các cặp số tìm được.`),
]

dung({
  MA: 'CBQ-GKI-2026',
  TEN: 'Đề cương ôn tập giữa kì I Toán 6 năm 2026–2027 — Trường THCS Cao Bá Quát, Hà Nội',
  NGUON: 'Trường THCS Cao Bá Quát',
  FILE: 'Trong-tam-on-tap-giua-ki-1-Toan-6-Cao-Ba-Quat-2026.pdf',
  PHAN, CAU, LV, HERE,
})
