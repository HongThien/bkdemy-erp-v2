// ============================================================================
// NQ-GKI-2026.build.mjs — gõ lại "ĐỀ CƯƠNG ÔN TẬP GIỮA HỌC KỲ I — Môn Toán 9" THCS Ngô Quyền (Hà Nội), năm học 2026–2027
// (PDF 3 trang scan: trang 1 = lịch kiểm tra các môn, KHÔNG có bài; trang 2–3 = đề cương. Thùy bỏ vào `Tài liệu tham khảo/K9/Đề cương/GKI` ngày 29/10.) → de.json (khung) + 2 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/NQ-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_P3B1.png)
//
// PHẠM VI (đề ghi): Đại số hết bài 6 "Bất phương trình bậc nhất một ẩn" · Hình học hết bài 12 "Một số hệ thức giữa cạnh, góc trong tam giác vuông và ứng dụng".
// CẤU TRÚC: 4 dạng (mỗi dạng một phần): 1 Giải phương trình, bất phương trình, hệ phương trình · 2 Lập hệ phương trình (Bài 1–3) · 3 Hình học (Bài 1–2) · 4 Toán nâng cao (Bài 1–2).
//   Dạng 1 không đánh số bài, chỉ 1)–5) ⇒ nhập "Bài 1a–1e". Tách ý: mỗi phương trình / bất phương trình / hệ ĐỘC LẬP một câu; bài lời văn + bài hình có chung dữ kiện ⇒ giữ cả bài.
// KHO: câu hình ⇒ `hinh_hoc` (chạy cổng với DANG_HINH_K9=HH00095).
// CHỖ ĐỀ IN CẦN LƯU Ý: Dạng 3 Bài 2 có "Chú ý" làm tròn (2 chữ số thập phân, đến phút; kết quả ý 1 không dùng cho ý 2) — giữ trong đề. Dạng 4 Bài 1 (kim cương) đề hỏi 3 câu liền nhau.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NQ-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const ys = (phan, kho, bai, list) => list.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: nd, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Giải các phương trình, bất phương trình, hệ phương trình (đề in 1)–5), nhập Bài 1a–1e)' },
  { thu_tu: 2, ten: 'Dạng 2. Giải bài toán bằng cách lập hệ phương trình (Bài 1–3)' },
  { thu_tu: 3, ten: 'Dạng 3. Hình học (Bài 1–2)' },
  { thu_tu: 4, ten: 'Dạng 4. Toán nâng cao (Bài 1–2)' },
]

const CAU = [
  ...ys(1, 'dai', 1, [
    ['a', R`Giải phương trình $(7-x)(2x-6)=0$.`, [R`Dạng 1 của đề cương in 5 mục 1)–5) không đánh số bài; nhập thành Bài 1, ý a–e theo đúng thứ tự.`]],
    ['b', R`Giải phương trình $\dfrac{x+1}{x-1}-\dfrac{x-1}{x+1}=\dfrac{16}{x^2-1}$.`],
    ['c', R`Giải bất phương trình $\dfrac{4x+5}{3}+x<3x+1$.`],
    ['d', R`Giải hệ phương trình $\begin{cases} (x-3)y=xy-x-2 \\ 3x+2y=5 \end{cases}$.`],
    ['e', R`Giải hệ phương trình $\begin{cases} \dfrac{1}{x-1}-\dfrac{3}{y-4}=-2 \\ \dfrac{2}{x-1}+\dfrac{1}{y-4}=3 \end{cases}$.`]]),

  ...ca(2, 'dai', 1, R`Một công nhân theo kế hoạch phải làm $88$ chi tiết máy trong một khoảng thời gian dự định. Thực tế, người công nhân đó phải làm $90$ chi tiết máy. Do đó mỗi giờ, người đó đã làm tăng thêm $3$ chi tiết máy, nên người đó đã hoàn thành công việc sớm hơn dự định $24$ phút. Hỏi mỗi giờ, người công nhân đó dự định làm bao nhiêu chi tiết máy?`),
  ...ca(2, 'dai', 2, R`Một người đi xe máy từ $A$ đến $B$ trong một thời gian dự định. Nếu vận tốc tăng thêm $14\ \text{km/h}$ thì đến $B$ sớm hơn dự định $2$ giờ. Nếu giảm vận tốc đi $4\ \text{km/h}$ thì đến $B$ muộn hơn $1$ giờ. Tính vận tốc và thời gian dự định của người đó.`),
  ...ca(2, 'dai', 3, R`Tính diện tích của hình chữ nhật, biết rằng nếu tăng mỗi chiều của hình chữ nhật thêm $4\ \text{m}$ thì diện tích của hình chữ nhật tăng thêm $156\ \text{m}^2$. Nếu giảm chiều rộng $3\ \text{m}$ và tăng chiều dài thêm $5\ \text{m}$ thì diện tích hình chữ nhật bằng diện tích ban đầu.`),

  ...ca(3, 'hinh_hoc', 1, R`Lotte Center là tòa cao ốc cao thứ hai tại Hà Nội. Tòa nhà có $65$ tầng, được lấy cảm hứng từ tà áo dài truyền thống của người Việt Nam. Tại một thời điểm trong ngày, tia nắng mặt trời tạo với mặt đất một góc xấp xỉ $80^\circ$ và bóng của tòa nhà đó trên mặt đất dài $48\ \text{m}$. Hỏi tòa nhà cao bao nhiêu mét? (Kết quả làm tròn đến mét).`,
    { anh: ['de_P3B1.png'] }),
  ...ca(3, 'hinh_hoc', 2, R`Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), đường cao $AH$, đường vuông góc với $AB$ tại $B$ cắt đường thẳng $AH$ tại $M$.
1) Cho $AB=6\ \text{cm}$, $AC=8\ \text{cm}$.
a) Tính $BC$, $AH$ và các tỉ số lượng giác của góc $\widehat{ACB}$.
b) Tính số đo các góc nhọn của tam giác $ABC$.
c) Tính diện tích tam giác $BMC$.
2) Đường thẳng qua $M$ song song với $BC$ cắt đường thẳng $AC$ tại $N$. Gọi $K$ là hình chiếu của $M$ trên $AN$. Chứng minh $NA\cdot NK=MK^2+KN^2$.
Chú ý: Các kết quả tính toán của ý 1 phải được làm tròn $2$ chữ số sau dấu phẩy (đơn vị đo độ dài), làm tròn đến phút (đơn vị đo góc). Kết quả ý 1 không được sử dụng cho ý 2.`),

  ...ca(4, 'dai', 1, R`Kim cương là một khoáng sản quý, có rất nhiều giá trị và được sử dụng với nhiều mục đích khác nhau. Giá bán của một viên kim cương rất cao và phụ thuộc vào rất nhiều yếu tố. Giả sử rằng giá bán của viên kim cương tỉ lệ với bình phương khối lượng của nó. Khi đem một viên kim cương cắt thành ba phần và vẫn bán với giá như trên (theo đúng tỉ lệ trên) thì tổng số tiền thu được tăng lên hay giảm đi? Trong trường hợp nào, giá bán của viên kim cương ban đầu giảm nhiều nhất? Và giảm bao nhiêu lần?`),
  ...ca(4, 'dai', 2, R`Giải phương trình: $\dfrac{1}{x^2+9x+20}+\dfrac{1}{x^2+11x+30}+\dfrac{1}{x^2+13x+42}=\dfrac{1}{18}$.`),
]

const NHOM = [[1, 1, 1], [2, 1, 3], [3, 1, 2], [4, 1, 2]]   // mỗi phần một tệp khung (p1–p4)

dung({ MA: 'NQ-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS Ngô Quyền (Hà Nội)', NGUON: 'le', NAM: 2026,
  FILE: 'on-tap-giua-hoc-ki-1-toan-9-nam-2026-2027-truong-thcs-ngo-quyen-ha-noi.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP: [] })
