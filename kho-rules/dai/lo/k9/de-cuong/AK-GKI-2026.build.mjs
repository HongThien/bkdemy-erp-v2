// ============================================================================
// AK-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG giữa học kì I Toán 9 — THCS An Khánh (Hà Nội), năm học 2026–2027
// (PDF 4 trang BẢN SCAN/chụp trong `Downloads\decuong\TUYỂN TẬP ĐỀ CƯƠNG CÁC TRƯỜNG\ĐỀ CƯƠNG GK1 AN KHÁNH KHỐI 9.pdf`, Thùy đưa 24/10). → de.json (khung) + 5 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/AK-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_P1B6.png, de_P2C5.png, de_P3C5.png, de_P4C5.png, de_P5C5.png)
//
// CẤU TRÚC: 5 "ĐỀ" luyện tập, mỗi đề một phần (PHẦN n = ĐỀ n). Đề 1 đánh số "Bài 1–6", Đề 2–5 đánh số "Câu …" ⇒ nhập chung nhãn "Bài k" (k = số thứ tự trong đề).
//   Khoá câu = (phần, nhãn) (dc-lib). Phạm vi: Chương I (phương trình, hệ, lập hệ), Chương II (bất đẳng thức, bất phương trình bậc nhất một ẩn), Chương IV (tỉ số lượng giác).
// ĐỀ 2 đánh số sai: in "Câu 1, Câu 11 (1,0 điểm), Câu 2, Câu 3, Câu 4 (máy bay), Câu 4 (bất đẳng thức)" ⇒ đánh lại 1–6 theo thứ tự (Bài 2 = "Câu 11", Bài 3 = "Câu 2",
//   Bài 4 = "Câu 3", Bài 5 = "Câu 4" máy bay, Bài 6 = "Câu 4" bất đẳng thức) + Ghi chú.
// Tách ý (k8.md §12.1): mỗi phương trình / hệ / bất phương trình / mệnh đề ĐỘC LẬP một câu; bài lời văn, bài có hình dùng chung dữ kiện (hình chữ nhật, tàu ngầm, tam giác) ⇒ giữ cả bài.
// KHO: câu hình / lượng giác ⇒ `hinh_hoc`, chạy cổng với DANG_HINH_K9=HH00095 (Các bài toán liên quan đến tỉ số lượng giác).
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/AK-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
// ys: các ý ĐỘC LẬP, mỗi ý một lời dẫn riêng — [ý, nội dung đầy đủ, ghi chú?]
const ys = (phan, kho, bai, list) => list.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: nd, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'ĐỀ 1 (Bài 1–6)' },
  { thu_tu: 2, ten: 'ĐỀ 2 (Câu 1–6; đề in "Câu 11" ở vị trí Câu 2 ⇒ đánh lại 1–6 theo thứ tự)' },
  { thu_tu: 3, ten: 'ĐỀ 3 (Câu 1–6)' },
  { thu_tu: 4, ten: 'ĐỀ 4 (Câu 1–6)' },
  { thu_tu: 5, ten: 'ĐỀ 5 (Câu 1–6)' },
]

const CAU = [
  // ───────────── ĐỀ 1 ─────────────
  ...ys(1, 'dai', 1, [
    ['a', R`Giải hệ phương trình $\begin{cases} 2x+5y=8 \\ 2x-3y=0 \end{cases}$.`],
    ['b', R`Giải hệ phương trình $\begin{cases} 2x-y=4 \\ x+2y=-3 \end{cases}$.`]]),
  ...ys(1, 'dai', 2, [
    ['a', R`Giải phương trình $4x(x-3)-3x+9=0$.`],
    ['b', R`Giải phương trình $\dfrac{x+2}{x-2}=\dfrac{x-2}{x+2}+\dfrac{16}{x^2-4}$.`],
    ['c', R`Giải bất phương trình $3(x+2)<x-8$.`]]),
  ...ca(1, 'dai', 3, R`Cho $a>b$. Chứng minh $4a+4>4b+3$.`),
  ...ca(1, 'dai', 4, R`Để chuẩn bị cho buổi liên hoan của gia đình, bác Ngọc mua hai loại thực phẩm là thịt lợn và cá chép, giá tiền thịt lợn là $130$ nghìn đồng/kg, giá tiền cá chép là $50$ nghìn đồng/kg, bác Ngọc đã chi $295$ nghìn để mua $3{,}5\ \text{kg}$ hai loại thực phẩm trên. Tính số kilôgam thịt lợn và cá chép mà bác Ngọc đã mua.`),
  ...ca(1, 'hinh_hoc', 5, R`Cho tam giác $ABC$ vuông tại $A$. Có $\widehat{C}=30^\circ$. Cạnh $AB=8\ \text{cm}$. Giải $\triangle ABC$.`),
  ...ca(1, 'hinh_hoc', 6, R`Tính chiều cao $DP$ của một ngọn hải đăng (hình bên), (kết quả làm tròn đến hàng đơn vị). Biết tại hai điểm $M$, $N$ cách nhau $24\ \text{m}$, người ta nhìn thấy đỉnh của ngọn hải đăng với góc nâng lần lượt là $30^\circ$ và $40^\circ$.`,
    { anh: ['de_P1B6.png'] }),

  // ───────────── ĐỀ 2 ─────────────
  ...ys(2, 'dai', 1, [
    ['a', R`Giải phương trình $(15-3x)(2x+4)=0$.`],
    ['b', R`Giải phương trình $\dfrac{2}{x-2}-\dfrac{3}{x-3}=\dfrac{3x-20}{(x-3)(x-2)}$.`]]),
  ...ys(2, 'dai', 2, [
    ['a', R`Giải hệ phương trình $\begin{cases} 3x-2y=9 \\ x+2y=-5 \end{cases}$.`, [R`Đề in nhãn "Câu 11 (1,0 điểm)" ở giữa Câu 1 và Câu 2 ⇒ đánh lại: đây là Bài 2; "Câu 2" in tiếp theo là Bài 3; "Câu 3" ⇒ Bài 4; "Câu 4" (máy bay) ⇒ Bài 5; "Câu 4" (bất đẳng thức) ⇒ Bài 6.`]],
    ['b', R`Giải bất phương trình $\dfrac{x-3}{5}<6-\dfrac{1-2x}{3}$.`]]),
  ...ca(2, 'dai', 3, R`Bạn Chiến đã vượt qua một quãng đường dài $180\ \text{km}$ từ Sơn La đến bệnh viện Nhi Trung ương Hà Nội để thăm em. Sau khi đi bằng xe đạp $7$ giờ, bạn ấy được lên xe khách và đi tiếp $1$ giờ $30$ phút nữa thì đến nơi. Biết vận tốc của xe khách lớn hơn vận tốc của xe đạp là $35\ \text{km/h}$. Tính vận tốc xe đạp của bạn Chiến.`),
  ...ca(2, 'hinh_hoc', 4, R`Cho hình chữ nhật $ABCD$. Kẻ $BH$ vuông góc với $AC$ tại $H$.
a) Giả sử $AB=12\ \text{cm}$, $BC=9\ \text{cm}$. Tính $AC$ và số đo góc $BAC$ (số đo làm tròn đến độ).
b) Kẻ $HI$ vuông góc với $AD$ tại $I$, $AK$ vuông góc với $BI$ tại $K$. Đường thẳng $BH$ cắt $AD$ tại $M$ và cắt $DC$ tại $N$. Chứng minh $\widehat{BHK}=\widehat{BID}$.`),
  ...ca(2, 'hinh_hoc', 5, R`Một chiếc máy bay bay lên với vận tốc $540\ \text{km/h}$. Đường bay lên tạo với phương nằm ngang một góc $24^\circ$. Hỏi sau $2$ phút kể từ lúc cất cánh máy bay bay lên cao được bao nhiêu kilômét theo phương thẳng đứng? (Kết quả làm tròn đến chữ số thập phân thứ nhất).`,
    { anh: ['de_P2C5.png'] }),
  ...ca(2, 'dai', 6, R`Chứng minh bất đẳng thức sau: $3(a^2+b^2+c^2)\ge(a+b+c)^2\ge3(ab+bc+ca)$.`),

  // ───────────── ĐỀ 3 ─────────────
  ...ys(3, 'dai', 1, [
    ['a', R`Giải phương trình $(x-5)(2x+4)=0$.`],
    ['b', R`Giải bất phương trình $\dfrac{x-3}{5}<6-\dfrac{1-2x}{3}$.`],
    ['c', R`Giải hệ phương trình $\begin{cases} 2(x-1)+y=3 \\ x-3y=-8 \end{cases}$.`]]),
  ...ys(3, 'dai', 2, [
    ['a', R`Viết bất đẳng thức để mô tả tình huống sau: Bạn An ít nhất $18$ tuổi mới được đi bầu cử đại biểu Quốc hội.`],
    ['b', R`Viết bất đẳng thức để mô tả tình huống sau: Một thang máy chở được tối đa $700\ \text{kg}$.`],
    ['c', R`Viết bất đẳng thức để mô tả tình huống sau: Bạn phải mua hàng có tổng trị giá ít nhất $1$ triệu đồng mới được giảm giá.`],
    ['d', R`Viết bất đẳng thức để mô tả tình huống sau: Bạn ném vào rổ ít nhất $5$ quả bóng mới vào được đội tuyển bóng rổ.`]]),
  ...ca(3, 'dai', 3, R`Giải bài toán bằng cách lập phương trình. Để chuẩn bị cho năm học mới, học sinh hai lớp $9A$ và $9B$ ủng hộ thư viện $738$ quyển sách gồm hai loại sách giáo khoa và sách tham khảo. Trong đó mỗi học sinh lớp $9A$ ủng hộ $6$ quyển sách giáo khoa và $3$ quyển sách tham khảo; mỗi học sinh lớp $9B$ ủng hộ $5$ quyển sách giáo khoa và $4$ quyển sách tham khảo. Biết số sách giáo khoa ủng hộ nhiều hơn số sách tham khảo là $166$ quyển. Tính số học sinh của mỗi lớp.`),
  ...ys(3, 'hinh_hoc', 4, [
    ['.1', R`Hãy giải thích tại sao $\sin 35^\circ+3\sin 23^\circ-\cos 55^\circ-\tan 35^\circ-3\cos 67^\circ+\cot 55^\circ-2=-2$.`, [R`Đề in Câu 4 gồm hai ý đánh số 1., 2. độc lập ⇒ nhập thành hai câu "Bài 4.1", "Bài 4.2".`]],
    ['.2', R`Cho tam giác $ABC$ vuông tại $A$ có cạnh huyền bằng $20\ \text{cm}$, $\widehat{B}=36^\circ$. Hãy giải thích vì sao $AB\approx16{,}18\ \text{cm}$.`]]),
  ...ca(3, 'hinh_hoc', 5, R`Trong một buổi luyện tập, một tàu ngầm ở trên mặt biển bắt đầu lặn xuống và di chuyển theo một đường thẳng tạo với mặt nước biển một góc $21^\circ$.
a) Khi tàu chuyển động theo hướng đó và đi được $250\ \text{m}$ thì tàu ở độ sâu bao nhiêu so với mặt nước (làm tròn đến đơn vị mét).
b) Giả sử tốc độ trung bình của tàu là $9\ \text{km/h}$ thì sau bao lâu (tính từ lúc bắt đầu lặn) tàu ở độ sâu $200$ mét (cách mặt nước biển $200\ \text{m}$), làm tròn đến phút.`,
    { anh: ['de_P3C5.png'] }),
  ...ca(3, 'dai', 6, R`Tìm giá trị nhỏ nhất của biểu thức sau: $E=\dfrac{x}{\sqrt{2}}+\dfrac{2}{\sqrt{x}}-\sqrt{x}-\sqrt{2}$.`),

  // ───────────── ĐỀ 4 ─────────────
  ...ys(4, 'dai', 1, [
    ['a', R`Giải phương trình $(x-5)(2x+4)=0$.`],
    ['b', R`Giải phương trình $\dfrac{x+3}{x-3}-\dfrac{1}{x}=\dfrac{3}{x(x-3)}$.`]]),
  ...ys(4, 'dai', 2, [
    ['a', R`Giải hệ phương trình $\begin{cases} 2x-y=5 \\ x+3y=-1 \end{cases}$.`],
    ['b', R`Giải bất phương trình $3x-(6+2x)\le3\cdot(x+4)$.`]]),
  ...ca(4, 'dai', 3, R`Giải bài toán bằng cách lập hệ phương trình hoặc phương trình. Hai trường $A$ và $B$ có $210$ học sinh đỗ tốt nghiệp. Tỷ lệ đỗ tốt nghiệp của trường $A$ là $80\%$ và của trường $B$ là $90\%$. Tính số học sinh tham gia dự thi tốt nghiệp của mỗi trường. Biết tổng số học sinh tham gia dự thi tốt nghiệp của hai trường là $250$ học sinh.`),
  ...ca(4, 'hinh_hoc', 4, R`Cho tam giác $ABC$ có $AB=4\ \text{cm}$, $BC=4{,}5\ \text{cm}$, $\widehat{B}=40^\circ$. Gọi $AH$ là đường cao kẻ từ đỉnh $A$ của tam giác. Tính độ dài các đoạn thẳng $AH$, $BH$, $AC$ và số đo góc $C$ của tam giác $ABC$ (kết quả làm tròn đến hàng phần trăm của cm và làm tròn đến phút của số đo góc).`),
  ...ca(4, 'hinh_hoc', 5, R`Trong một buổi luyện tập, một tàu ngầm ở trên mặt biển bắt đầu lặn xuống và di chuyển theo một đường thẳng tạo với mặt nước biển một góc $21^\circ$.
a) Khi tàu chuyển động theo hướng đó và đi được $250\ \text{m}$ thì tàu ở độ sâu bao nhiêu so với mặt nước (làm tròn đến đơn vị mét).
b) Giả sử tốc độ trung bình của tàu là $9\ \text{km/h}$ thì sau bao lâu (tính từ lúc bắt đầu lặn) tàu ở độ sâu $200$ mét (cách mặt nước biển $200\ \text{m}$), làm tròn đến phút.`,
    { anh: ['de_P4C5.png'], cb: [R`Đề 4 Câu 5 trùng nguyên văn Đề 3 Câu 5 (hình và số liệu giống nhau) — bình thường, máy gom khi ghi.`] }),
  ...ca(4, 'dai', 6, R`Cho $a$, $b$, $c$ là các số thực dương thỏa mãn điều kiện $a+b+c=3$. Tìm giá trị nhỏ nhất của biểu thức $P=\dfrac{a^3}{a^2+b^2}+\dfrac{b^3}{b^2+c^2}+\dfrac{c^3}{c^2+a^2}$.`),

  // ───────────── ĐỀ 5 ─────────────
  ...ys(5, 'dai', 1, [
    ['a', R`Giải phương trình $(2x-4)(x-3)=0$.`],
    ['b', R`Giải phương trình $\dfrac{x-1}{x+3}-\dfrac{x}{x-3}=\dfrac{7x-4}{x^2-9}$.`]]),
  ...ca(5, 'dai', 2, R`Giải hệ phương trình sau: $\begin{cases} 2x+y=5 \\ x-y=1 \end{cases}$`),
  ...ys(5, 'dai', 3, [
    ['a', R`Cho $a<b$. So sánh $2a+2024$ với $2b+2024$.`],
    ['b', R`Giải bất phương trình: $3x+5\le5(x+3)$.`]]),
  ...ca(5, 'dai', 4, R`Giải bài toán bằng cách lập hệ phương trình. Cơn bão số 3 – Yagi gây hậu quả rất nặng nề cho các tỉnh miền Bắc. Hai lớp $9A2$ và $9A3$ trường APC Gia Lai cùng đóng góp vở trắng cho các bạn học sinh chịu ảnh hưởng bởi cơn bão vừa qua. Mỗi học sinh lớp $9A2$ ủng hộ $10$ quyển vở, mỗi học sinh lớp $9A3$ ủng hộ $5$ quyển vở nên số vở ủng hộ của lớp $9A2$ nhiều hơn $9A3$ là $120$ quyển. Biết hai lớp có $51$ học sinh, tìm số học sinh của mỗi lớp.`),
  ...ca(5, 'hinh_hoc', 5, R`Các tia nắng mặt trời tạo với mặt đất một góc xấp xỉ bằng $34^\circ$ và bóng của một tháp trên mặt đất dài $86\ \text{m}$. Tính chiều cao của tháp (làm tròn đến hàng đơn vị của mét).`,
    { anh: ['de_P5C5.png'] }),
  ...ca(5, 'hinh_hoc', 6, R`Cho tam giác $ABC$ vuông tại $A$ có $AH$ là đường cao.
a) Giả sử $AB=6\ \text{cm}$, $AC=8\ \text{cm}$. Tính $BC$ và các tỉ số lượng giác của góc nhọn $C$.
b) Chứng minh rằng $BC=AB\cdot\cos B+AC\cdot\cos C$.`),
]

const NHOM = [[1, 1, 6], [2, 1, 6], [3, 1, 6], [4, 1, 6], [5, 1, 6]]

dung({ MA: 'AK-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS An Khánh (Hà Nội)', NGUON: 'le', NAM: 2026,
  FILE: 'ĐỀ CƯƠNG GK1 AN KHÁNH KHỐI 9.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP: [] })
