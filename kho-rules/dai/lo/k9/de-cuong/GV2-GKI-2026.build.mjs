// ============================================================================
// GV2-GKI-2026.build.mjs — gõ lại "HƯỚNG DẪN ÔN TẬP VÀ KIỂM TRA GIỮA HỌC KỲ 1 NĂM HỌC 2026–2027 — KHỐI 9 — MÔN TOÁN 9", UBND phường Giảng Võ · THCS Giảng Võ 2 (Hà Nội)
// (PDF 6 trang bản số: trang 1 = bìa, trang 2–6 = nội dung. Thùy bỏ vào `Tài liệu tham khảo/K9/Đề cương/GKI` ngày 29/10.) → de.json (khung) + 8 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/GV2-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_P4B9.png, de_P4B10.png, de_P4B11.png, de_P4B12.png, de_P6B19.png, de_P6B20.png, de_P7B3_1.png)
//
// PHẠM VI (đề ghi): Đại số = hệ phương trình bậc nhất hai ẩn · phương trình quy về bậc nhất một ẩn · lập phương trình / hệ phương trình. Hình học = tỉ số lượng giác · một số hệ thức giữa cạnh và góc trong tam giác vuông ·
//   "một số bài toán về đường tròn: chứng minh nhiều điểm thuộc đường tròn".
// CẤU TRÚC: 6 dạng — Bài 1–22 đánh số LIÊN TỤC qua các dạng (mỗi dạng một phần) · ĐỀ MINH HỌA (Bài I–IV, đánh số lại) ⇒ khoá câu = (phần, nhãn). PHẦN 1–6 = Dạng 1–6 · PHẦN 7 = Đề minh họa.
//   Đề minh họa: Bài I → "Bài 1" (ý a–d) · Bài II → "Bài 2.1", "2.2" (hai bài con độc lập) · Bài III → "Bài 3.1", "3.2" · Bài IV → "Bài 4".
// ĐỀ IN NHÃN Ý BỎ CHỮ "f": Bài 1 in a, b, c, d, e, g, h, i · Bài 2 in a, b, c, d, e, g · Bài 3 in a, b, c, d, e, g, h ⇒ nhập lại liên tiếp a–h / a–f / a–g theo đúng thứ tự (Ghi chú ở ý a).
// Tách ý (k8.md §12.1): mỗi phương trình / hệ ĐỘC LẬP một câu (Dạng 1, 2) · bài lời văn, bài hình có chung dữ kiện, bài hình tổng hợp (Bài 13–17), bài nâng cao ⇒ giữ cả bài.
// KHO: câu hình / lượng giác / đường tròn ⇒ `hinh_hoc` (cổng chạy với DANG_HINH_K9=HH00095; bài đường tròn có thể xếp lại HH00105 sau). Bài thực tế nâng cao (kể cả hình chóp, hình hộp) ⇒ `dai`.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/GV2-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
const ys = (phan, kho, bai, list) => list.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: nd, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const L = 'abcdefghijklmnopqrstuvwxyz'
const dsPT = (phan, bai, lead, exprs, ghiChu) => ys(phan, 'dai', bai, exprs.map((e, i) => [L[i], `${lead} $${e}$.`, i === 0 && ghiChu ? [ghiChu] : []]))
const dsHe = (phan, bai, lead, pairs, ghiChu) => ys(phan, 'dai', bai, pairs.map(([a, b], i) => [L[i], `${lead} ${he(a, b)}`, i === 0 && ghiChu ? [ghiChu] : []]))

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Giải phương trình (Bài 1–2)' },
  { thu_tu: 2, ten: 'Dạng 2. Giải hệ phương trình (Bài 3)' },
  { thu_tu: 3, ten: 'Dạng 3. Giải bài toán bằng cách lập phương trình, lập hệ phương trình (Bài 4–8)' },
  { thu_tu: 4, ten: 'Dạng 4. Bài toán thực tế ứng dụng tỉ số lượng giác của góc nhọn (Bài 9–12)' },
  { thu_tu: 5, ten: 'Dạng 5. Bài toán hình học tổng hợp (Bài 13–17)' },
  { thu_tu: 6, ten: 'Dạng 6. Một số bài toán nâng cao (Bài 18–22)' },
  { thu_tu: 7, ten: 'Đề minh họa (Bài I–IV)' },
]

const CAU = [
  // ───────────── Dạng 1 ─────────────
  ...dsPT(1, 1, R`Giải phương trình:`, [
    R`x(2x-3)-2x(x-6)=5`, R`(2{,}3x-4{,}6)(0{,}2x+3)=0`, R`3\left(\dfrac{2}{3}x+1\right)-4\left(\dfrac{1}{2}x-3\right)=10`,
    R`(x-4)(3x-5)=3(4-x)`, R`(5x-1)^2-16x^2=0`, R`(2x+5)^2-(3x-7)^2=0`, R`x^2-x-20=0`, R`x^3-4x^2+4x=(x^2-2x)(5x-3)`],
    R`Đề in nhãn ý a, b, c, d, e, g, h, i (bỏ chữ f) ⇒ nhập lại liên tiếp a–h theo đúng thứ tự (Bài 2, Bài 3 cũng bỏ chữ f).`),
  ...dsPT(1, 2, R`Giải phương trình:`, [
    R`\dfrac{x}{2x-1}=\dfrac{x-5}{2x+3}`, R`\dfrac{2x-3}{x-2}=7-\dfrac{3}{x-2}`, R`\dfrac{4x}{(x-2)(x+4)}=\dfrac{3}{x+4}-\dfrac{6}{x-2}`,
    R`\dfrac{x+5}{x-3}-\dfrac{x-3}{x+3}=\dfrac{2-x}{x^2-9}`, R`\dfrac{x^2}{x^2+x+1}-\dfrac{x}{x-1}=\dfrac{-4x+2}{x^3-1}`,
    R`\dfrac{2x-1}{2x^2+3x-2}-\dfrac{3}{x^2-4}=\dfrac{2x^2+2025}{(x+2)(2x^2-5x+2)}`]),
  // ───────────── Dạng 2 ─────────────
  ...dsHe(2, 3, R`Giải hệ phương trình:`, [
    [R`5x-3y=-4`, R`x-5y=11`],
    [R`2x-11y=-5`, R`4x-22y=1`],
    [R`2(x-3y-5)=2x-y`, R`3(x-2y)-4(3x-2y)=3`],
    [R`(x-2)(y-3)=(x-1)(y+4)`, R`(x-5)(y+1)=(x-3)(y-1)`],
    [R`x(4+3y)=7+2y+3xy`, R`x-14=2(y+3)`],
    [R`\dfrac{1}{x}+\dfrac{2}{y}=\dfrac{7}{6}`, R`\dfrac{8}{x}+\dfrac{15}{y}=9`],
    [R`\dfrac{3}{x-2}+\dfrac{4}{y+1}=7`, R`\dfrac{5}{x-2}-\dfrac{3}{y+1}=2`]]),
  // ───────────── Dạng 3 ─────────────
  ...ca(3, 'dai', 4, R`Cho một số tự nhiên có hai chữ số. Biết rằng tổng của chữ số hàng chục và hai lần chữ số hàng đơn vị là $12$. Nếu thêm chữ số $0$ vào giữa hai chữ số của số đó thì ta được một số mới có ba chữ số lớn hơn số ban đầu $180$ đơn vị. Tìm số ban đầu.`),
  ...ca(3, 'dai', 5, R`Một tàu thủy chạy xuôi dòng sông $50\ \text{km}$ hết thời gian bằng thời gian tàu chạy ngược dòng $30\ \text{km}$. Nếu tàu chạy xuôi dòng $25\ \text{km}$ và ngược dòng $3\ \text{km}$ thì hết $1$ giờ $12$ phút. Tính vận tốc riêng của tàu thủy và vận tốc dòng nước (biết vận tốc riêng của tàu không đổi).`),
  ...ca(3, 'dai', 6, R`Nhân kỉ niệm ngày Phụ nữ Việt Nam $20/10$, một nhà sách giảm giá mỗi cây bút bi là $20\%$ và mỗi quyển vở là $10\%$ so với giá niêm yết. Bạn Hà vào nhà sách mua $20$ quyển vở và $10$ cây bút bi. Khi tính tiền, bạn Hà đưa nhân viên thu tiền $175\,000$ đồng và được trả lại $3\,000$ đồng. Tính giá niêm yết của mỗi quyển vở và mỗi cây bút bi, biết rằng tổng số tiền phải trả nếu không được giảm giá là $195\,000$ đồng.`),
  ...ca(3, 'dai', 7, R`Một tổ sản xuất mỗi ngày phải sản xuất $200$ bộ đồ bảo hộ y tế để hoàn thành đơn hàng theo thời gian quy định. Do cải tiến kĩ thuật nên thực tế, mỗi ngày tổ đó đã làm được nhiều hơn $100$ bộ đồ bảo hộ y tế so với kế hoạch. Vì thế tổ đã hoàn thành trước thời gian quy định $8$ ngày. Hỏi theo kế hoạch, tổ phải sản xuất bao nhiêu ngày? (Giả định rằng số bộ đồ bảo hộ y tế mà tổ đó sản xuất được trong mỗi ngày là bằng nhau).`),
  ...ca(3, 'dai', 8, R`Hai người cùng làm chung một công việc thì sau $5$ ngày làm xong công việc. Nếu người thứ nhất làm một mình trong $12$ ngày, sau đó người thứ hai đến và hai người cùng làm thêm $3$ ngày thì hoàn thành công việc. Hỏi nếu mỗi người làm riêng thì sau bao lâu mới hoàn thành công việc?`),
  // ───────────── Dạng 4 ─────────────
  ...ca(4, 'hinh_hoc', 9, R`Ở siêu thị Big C có một thang máy cuốn (hình vẽ) có thể giúp khách hàng di chuyển từ tầng $1$ của siêu thị lên tầng $2$ rất tiện lợi. Biết rằng thang máy này được thiết kế có độ nghiêng $35^\circ$ so với phương nằm ngang và tốc độ vận hành là $1{,}6\ \text{m/s}$. Một khách hàng đã di chuyển bằng thang máy này từ tầng $1$ lên tầng $2$ của siêu thị Big C hết $5$ giây. Hỏi chiều cao $AC$ của tầng $2$ so với tầng $1$ của siêu thị Big C là bao nhiêu mét? (Kết quả tính theo mét làm tròn đến hàng phần trăm).`, { anh: ['de_P4B9.png'] }),
  ...ca(4, 'hinh_hoc', 10, R`Một cột đèn cao $7\ \text{m}$ có bóng trên mặt đất dài $4\ \text{m}$. Gần đó có một tòa nhà cao tầng có bóng trên mặt đất là $60\ \text{m}$ (hình vẽ). Tính chiều cao tòa nhà (Kết quả tính theo mét làm tròn đến hàng phần mười).`, { anh: ['de_P4B10.png'] }),
  ...ca(4, 'hinh_hoc', 11, R`Một máy bay đang ở vị trí $A$ có độ cao $3{,}2\ \text{km}$ so với mặt đất (hình vẽ). Máy bay bắt đầu quy trình hạ cánh từ vị trí $A$ xuống vị trí $B$ trên mặt đất. Quãng đường bay $AB$ dài $6{,}8\ \text{km}$. Tính góc nhọn tạo bởi đường bay $AB$ và phương nằm ngang (Kết quả tính theo độ và làm tròn đến hàng đơn vị).`, { anh: ['de_P4B11.png'] }),
  ...ca(4, 'hinh_hoc', 12, R`Một cái thang dài $12\ \text{m}$ được đặt dựa vào một bức tường sao cho chân thang cách chân tường $7\ \text{m}$ (hình vẽ). Tính góc $\alpha$ tạo bởi thang và bức tường (Kết quả tính theo độ và làm tròn đến hàng đơn vị).`, { anh: ['de_P4B12.png'] }),
  // ───────────── Dạng 5 ─────────────
  ...ca(5, 'hinh_hoc', 13, R`Cho tam giác $ABC$ nhọn ($AB<AC$), đường cao $BD$, $CE$ cắt nhau tại $H$. Lấy $I$ là trung điểm của $BC$, $K$ là điểm đối xứng của $H$ qua $I$. Chứng minh
a) Tứ giác $BHCK$ là hình bình hành.
b) Bốn điểm $A$, $B$, $K$, $C$ cùng thuộc một đường tròn tâm $O$.
c) Chứng minh $OI\parallel AH$.`),
  ...ca(5, 'hinh_hoc', 14, R`Cho tam giác $MHP$ vuông tại $H$, với đường cao $HF$.
a) Chứng minh rằng $\triangle MHF$ đồng dạng $\triangle MPH$.
b) Từ $M$ kẻ đường thẳng vuông góc với $MP$ và cắt tia $PH$ tại $N$. Kẻ $HE\perp MN$ tại $E$. Chứng minh rằng $ME\cdot MN=MH^2$ và $\dfrac{ME}{MF}=\dfrac{MP}{MN}$.
c) Chứng minh rằng $\dfrac{S_{MNP}}{S_{MFHE}}=\dfrac{1}{2\cos^2\widehat{EMH}}+\dfrac{1}{2\cos^2\widehat{FMH}}$.`),
  ...ca(5, 'hinh_hoc', 15, R`Cho tam giác $ABC$ nhọn ($AB<AC$), đường cao $BD$, $CE$ cắt nhau tại $H$.
a) Chứng minh rằng bốn điểm $B$, $D$, $C$, $E$ cùng thuộc một đường tròn. Hãy chỉ rõ tâm $O$ của đường tròn này.
b) Chứng minh $AB\cdot AE=AC\cdot AD$.
c) Gọi $R$ là bán kính của đường tròn tâm $O$. Trên tia đối của tia $CB$ lấy điểm $M$ sao cho $CM=R$. Giả sử $\widehat{DBC}=30^\circ$, chứng minh $DM^2=3R^2$.`),
  ...ca(5, 'hinh_hoc', 16, R`Cho tam giác $ABC$ nhọn ($AB<AC$). Hai đường cao $BE$, $CF$ cắt nhau tại $H$.
a) Chứng minh bốn điểm $B$, $F$, $E$, $C$ cùng thuộc một đường tròn.
b) Tia $EF$ cắt tia $CB$ tại $M$. Chứng minh $\triangle AEF\backsim\triangle ABC$ và $MF\cdot ME=MB\cdot MC$.
c) Tia $AH$ cắt $BC$ tại $D$. Chứng minh $FB$ là tia phân giác của góc $\widehat{MFD}$.`),
  ...ca(5, 'hinh_hoc', 17, R`Cho đường tròn tâm $(O)$ đường kính $BC$. Lấy điểm $A$ nằm ngoài $(O)$ ($A$, $B$, $C$ không thẳng hàng). Các đường thẳng $AB$, $AC$ cắt đường tròn $(O)$ lần lượt tại $M$, $N$ ($M$, $N$ là các giao điểm thứ hai, phân biệt với $B$, $C$). Biết đường thẳng $BN$, $CM$ cắt nhau tại $H$.
a) Chứng minh $AH$ vuông góc $BC$.
b) Gọi $I$ là trung điểm của $AH$. Tính số đo góc $\widehat{INO}$.
c) Chứng minh $BM\cdot BA+CN\cdot CA=4OC^2$.`),
  // ───────────── Dạng 6 ─────────────
  ...ca(6, 'dai', 18, R`Nhân dịp Tết Trung Thu, một Câu lạc bộ Viên ngọc xanh trường THCS Giảng Võ 2 muốn kinh doanh đèn ông sao để gây quỹ thiện nguyện. Chi phí để hoàn thiện mỗi chiếc đèn ông sao là $7$ nghìn đồng. Với mức giá bán $25$ nghìn đồng cho mỗi chiếc đèn ông sao, câu lạc bộ bán được $200$ chiếc đèn. Cứ với mỗi nghìn đồng giảm giá, số lượng đèn bán ra tăng thêm $20$ chiếc. Hỏi Câu lạc bộ Viên ngọc xanh nên bán mỗi chiếc đèn ông sao với giá khuyến mãi là bao nhiêu để thu được tổng lợi nhuận lớn nhất?`),
  ...ca(6, 'dai', 19, R`Người ta muốn lợp ngói cho mái nhà dạng hình chóp tứ giác đều (như hình vẽ). Mặt trần nhà có dạng hình vuông $ABCD$ cạnh dài $8\ \text{m}$. Khoảng cách $SA=\sqrt{41}\ \text{m}$. Số tiền mà người đó phải trả để mua ngói lợp phần mái hình chóp tứ giác trên là bao nhiêu? Biết giá mỗi viên ngói là $17\,000$ (VNĐ) và cứ $10$ viên ngói lợp được $1\ \text{m}^2$.`, { anh: ['de_P6B19.png'] }),
  ...ca(6, 'dai', 20, R`Bác An muốn đặt làm một chiếc hộp đựng quà lưu niệm có dạng hình hộp chữ nhật với mặt đáy $ABCD$ là hình vuông (hình vẽ). Để món quà trở nên đặc biệt bác An muốn sơn mặt ngoài bốn mặt xung quanh và mặt đáy dưới của chiếc hộp (không sơn nắp hộp). Em hãy tìm độ dài cạnh $MN$ của mặt đáy và chiều cao $AM$ của hộp quà sao cho tổng diện tích các mặt được sơn là nhỏ nhất, biết rằng thể tích của chiếc hộp là $4\ \text{dm}^3$.`, { anh: ['de_P6B20.png'] }),
  ...ca(6, 'dai', 21, R`Một cửa hàng bán $3$ loại trái cây: táo, cam và quýt. Mỗi ngày, số lượng hộp quả táo, hộp quả cam và hộp quả quýt nhập về được ký hiệu lần lượt là $x$, $y$, $z$ ($x$, $y$, $z$ là các số tự nhiên). Cửa hàng có các thông tin và điều kiện như sau:
1) Chi phí nhập mỗi hộp quả táo là $100\,000$ đồng, mỗi hộp quả cam là $200\,000$ đồng và mỗi hộp quả quýt là $100\,000$ đồng.
2) Tổng chi phí nhập không được vượt quá $1\,000\,000$ đồng.
3) Cửa hàng phải nhập đủ cả $3$ loại trái cây.
4) Cửa hàng cần nhập ít nhất $3$ hộp quả táo và cam cộng lại.
Lợi nhuận (lãi) thu về từ việc bán mỗi loại trái cây là: $200\,000$ đồng cho mỗi hộp quả táo, $300\,000$ đồng cho mỗi hộp quả cam và $100\,000$ đồng cho mỗi hộp quả quýt.
Giả định rằng tất cả số trái cây nhập về đều được bán hết trong ngày, hãy chỉ ra phương án nhập hàng giúp người bán hàng có được lợi nhuận cao nhất.`),
  ...ca(6, 'dai', 22, R`Trong những ngày đầu tháng $9$ năm $2024$, cơn bão số $3$ (có tên quốc tế là Yagi) với cường độ rất mạnh, kèm theo mưa lũ rất lớn đã ảnh hưởng đến các tỉnh miền Bắc nước ta. Với truyền thống đoàn kết, "tương thân, tương ái", "lá lành đùm lá rách". Tập thể lớp $9A$ đã không tổ chức một buổi Trung thu vui vẻ mà thay vào đó là một buổi chia sẻ và quyên góp ủng hộ các bạn nhỏ trong cùng thành phố mà chịu hậu quả của bão lũ. Số tiền lớp $9A$ quyên góp được là $4\,000\,000$ đồng. Các bạn quyết định dành hết số tiền quyên góp được để mua cả vở và bút tặng cho các bạn nhỏ. Gọi $x$, $y$ lần lượt là số vở và số bút các bạn lớp $9A$ có thể mua được ($x>0$; $x\in\mathbb{Z}$; $y>0$; $y\in\mathbb{Z}$). Biết vở có giá là $15\,000$ đồng/quyển, bút có giá là $8\,000$ đồng/chiếc. Em hãy giúp các bạn lớp $9A$ tìm số vở và số bút các bạn có thể mua được thỏa mãn yêu cầu trên với tổng số tiền đúng bằng $4\,000\,000$ đồng.`),
  // ───────────── ĐỀ MINH HỌA ─────────────
  ...ys(7, 'dai', 1, [
    ['a', R`Giải phương trình $(x-1)^2=x(x+3)-2x$.`, [R`Đề minh họa in Bài I (3,0 điểm) gồm 4 ý a–d (phương trình, hệ phương trình) ⇒ nhập thành Bài 1a–1d; Bài II (2,5 điểm) hai bài con ⇒ Bài 2.1, 2.2; Bài III (4,0 điểm) hai bài con ⇒ Bài 3.1, 3.2; Bài IV (0,5 điểm) ⇒ Bài 4.`]],
    ['b', R`Giải phương trình $(4x-3)(x+4)=x^2-16$.`],
    ['c', R`Giải phương trình $\dfrac{x+1}{x-3}-\dfrac{x-1}{x}=\dfrac{7}{x^2-3x}$.`],
    ['d', R`Giải hệ phương trình $\begin{cases} 2(x+y)+3(x-y)=4 \\ (x+y)+2(x-y)=5 \end{cases}$.`]]),
  ...ca(7, 'dai', '2.1', R`Giải bài toán sau bằng cách lập phương trình hoặc lập hệ phương trình: Tìm hai số tự nhiên biết rằng tổng của chúng bằng $1006$ và nếu lấy số lớn chia cho số nhỏ thì được thương là $2$ và số dư là $124$.`),
  ...ca(7, 'dai', '2.2', R`Giải bài toán sau bằng cách lập phương trình hoặc lập hệ phương trình: Một ô tô đi từ $A$ đến $B$ với một vận tốc và trong một thời gian đã định trước. Nếu vận tốc của ô tô giảm $10\ \text{km/h}$ thì đến $B$ chậm $1$ giờ so với dự định. Nếu vận tốc ô tô tăng $5\ \text{km/h}$ thì sẽ đến $B$ sớm $20$ phút so với dự định. Tính vận tốc và thời gian ô tô dự định đi từ $A$ đến $B$?`),
  ...ca(7, 'hinh_hoc', '3.1', R`Tia nắng chiếu qua nóc của một tòa nhà hợp với mặt đất một góc $\alpha$ (hình vẽ). Cho biết tòa nhà cao $21\ \text{m}$ và bóng của nó trên mặt đất dài $15\ \text{m}$. Tính góc $\alpha$ (Kết quả tính theo độ và làm tròn đến hàng đơn vị).`, { anh: ['de_P7B3_1.png'] }),
  ...ca(7, 'hinh_hoc', '3.2', R`Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$.
a) Nếu $\widehat{ACB}=30^\circ$ và $BC=20\ \text{cm}$. Hãy tính $\widehat{ABC}$; $AB$; $AC$. (Số đo góc làm tròn đến độ)
b) Kẻ $HD$, $HE$ lần lượt vuông góc với $AB$ và $AC$ ($D$ thuộc $AB$, $E$ thuộc $AC$). Chứng minh các điểm $A$, $E$, $H$, $D$ cùng thuộc đường tròn và $AB\cdot AD=AH^2$. Từ đó suy ra $AB\cdot AD=AE\cdot AC$.
c) Lấy điểm $M$ nằm giữa $E$ và $C$, kẻ $AI$ vuông góc với $MB$ tại $I$. Chứng minh $\sin\widehat{AMB}\cdot\sin\widehat{ACB}=\dfrac{HI}{CM}$.`),
  ...ca(7, 'dai', 4, R`Cửa hàng nhà bác Dũng chuyên kinh doanh máy tính tại Hà Nội. Một loại máy tính có giá nhập vào mỗi chiếc là $18$ triệu đồng và bán ra với giá $22$ triệu đồng. Với giá bán như trên thì một năm số lượng máy tính bán được dự kiến là $500$ chiếc. Để tăng thêm lượng tiêu thụ dòng máy tính này, bác Dũng dự định giảm giá bán và ước lượng cứ giảm $200$ nghìn đồng một chiếc thì số lượng máy tính bán ra trong một năm sẽ tăng $50$ chiếc. Vậy bác Dũng phải bán với giá bao nhiêu để sau khi giảm giá lợi nhuận thu được sẽ cao nhất?`),
]

// 8 tệp khung: D1 Bài 1 · D1 Bài 2 · D2 · D3 · D4 · D5 · D6 · Đề minh họa
const NHOM = [[1, 1, 1], [1, 2, 2], [2, 3, 3], [3, 4, 8], [4, 9, 12], [5, 13, 17], [6, 18, 22], [7, 1, 4]]

dung({ MA: 'GV2-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS Giảng Võ 2 (Hà Nội)', NGUON: 'le', NAM: 2026,
  FILE: 'on-tap-giua-hoc-ky-1-toan-9-nam-2026-2027-truong-thcs-giang-vo-2-ha-noi.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP: [] })
