// ============================================================================
// TM-GKI-2024.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa kì môn Toán 9 — Trường THCS Tây Mỗ (Hà Nội)
// (PDF 6 trang BẢN SCAN Thùy gửi 14/10, tên tệp "ĐỀ-CƯƠNG-GIỮA-KÌ-II-THCS-TÂY-MỖ-LỚP-9-TOÁN.pdf"; trang 34–39 của tập đề cương chung các môn,
//  thiếu trang 33 — phần đầu "I. Nội dung ôn tập"). → de.json (khung) + 9 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/TM-GKI-2024.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_P4B15…19.png, de_P6B4_1.png, de_P6B5.png)
//
// TÊN TỆP ghi "giữa kì II" nhưng NỘI DUNG là giữa kì I: trang 34 ghi phạm vi "… Bất đẳng thức · 2. Hình học: Tỉ số lượng giác của góc nhọn; một số hệ thức
//   về cạnh và góc trong tam giác vuông", bài tập = phương trình quy về bậc nhất, hệ hai phương trình bậc nhất hai ẩn, lập hệ, lượng giác (Chương I, II, IV KNTT)
//   ⇒ đặt tên "giữa học kì I". Đề minh hoạ dùng số 2024 ⇒ năm học 2024–2025 (mã TM-GKI-2024).
// CẤU TRÚC: III. Một số bài tập tham khảo — Bài 1–29 đánh số LIÊN TỤC qua 5 dạng (mỗi dạng một phần) · IV. Đề minh hoạ — Bài 1–4 + "Bài V" (đánh số lại từ 1)
//   ⇒ khoá câu = (phần, nhãn) (dc-lib). "Bài V" nhập nhãn "Bài 5"; Bài 4 đề minh hoạ có hai bài con độc lập 1) và 2) ⇒ "Bài 4.1", "Bài 4.2".
// Tách ý (k8.md §12.1): Bài 1–6, 21 và đề minh hoạ Bài 1 (mỗi ý một phương trình / hệ / biểu thức riêng); bài lời văn, bài có tam giác (20, 22–25), bài nâng cao ⇒ giữ cả bài.
//
// CHỖ ĐỀ CƯƠNG IN THIẾU / IN SAI (đã phóng to 260 dpi):
//   · Bài 1a: chỉ in "a) z" (mất hẳn phương trình) ⇒ KHÔNG nhập.
//   · Bài 1b: có vết mực giữa "2x" và "3"; nét dưới là dấu trừ ⇒ đọc $(2x-3)$.
//   · Bài 28: đề viết "như hình dưới đây" nhưng đề cương KHÔNG in hình ⇒ trạm soạn vẽ hình giải.
//   · Chữ viết tay trên bản scan ("The Piee coolie" đầu trang 35, "−x+y=1" cạnh Bài 12, nét gạch ở "Hai đội" Bài 11) — của người dùng tài liệu, bỏ qua.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TM-GKI-2024.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
const CC = (s) => 'CHƯA CHẮC — ' + s
const tach = (phan, kho, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const KHONG_NHAP = [
  { nhan: 'Dạng 1. Bài 1a', in: 'a) z', ly_do: 'đề cương chỉ in chữ "z" — mất hẳn phương trình' },
]

const PHAN = [
  { thu_tu: 1, ten: 'Dạng 1. Giải phương trình quy về phương trình bậc nhất một ẩn (Bài 1–4)' },
  { thu_tu: 2, ten: 'Dạng 2. Giải hệ hai phương trình bậc nhất hai ẩn (Bài 5–6)' },
  { thu_tu: 3, ten: 'Dạng 3. Giải bài toán bằng cách lập hệ phương trình (Bài 7–14)' },
  { thu_tu: 4, ten: 'Dạng 4. Các bài toán hình học (Bài 15–25)' },
  { thu_tu: 5, ten: 'Dạng 5. Các dạng khác (Bài 26–29)' },
  { thu_tu: 6, ten: 'Đề minh hoạ (Bài 1–5)' },
]

const CAU = [
  // ───────────── Dạng 1 ─────────────
  ...tach(1, 'dai', 1, R`Giải phương trình:`, [
    ['b', bt(R`(2x-3)\left(\dfrac{1}{4}x-1\right)=0`), [R`Bài 1 của đề cương có 4 ý a–d; ý a) chỉ in chữ "z" (mất phương trình) nên KHÔNG nhập. Ý b) bản scan có vết mực giữa "$2x$" và "$3$", nét dưới là dấu trừ — đã nhập $(2x-3)$.`]],
    ['c', bt(R`(3-2x)\left(\dfrac{5}{4}x-2\right)=0`)],
    ['d', bt(R`\left(\dfrac{1}{3}x+2\right)(4+x)=0`)]]),
  ...tach(1, 'dai', 2, R`Giải phương trình:`, [
    ['a', bt(R`2x(x-3)+5(x-3)=0`)],
    ['b', bt(R`3x(x-5)+6(x-5)=0`)],
    ['c', bt(R`(x+1)^2-4=0`)],
    ['d', bt(R`(2x+1)^2-(x+2)^2=0`)]]),
  ...tach(1, 'dai', 3, R`Giải phương trình:`, [
    ['a', bt(R`(x-1)(5x+3)-2(x-1)=0`)],
    ['b', bt(R`x(2x-7)-4x+14=0`)],
    ['c', bt(R`(2x+1)(3x-2)=(5x-8)(2x+1)`)],
    ['d', bt(R`0{,}5x(x-3)=(x-3)(1{,}5x-1)`)]]),
  ...tach(1, 'dai', 4, R`Giải phương trình:`, [
    ['a', bt(R`\dfrac{5}{x+2}+\dfrac{3}{x-1}=\dfrac{3x+4}{(x+2)(x-1)}`)],
    ['b', bt(R`\dfrac{4}{2x-3}-\dfrac{3}{x(2x-3)}=\dfrac{5}{x}`)],
    ['c', bt(R`\dfrac{2}{x-3}+\dfrac{3}{x+3}=\dfrac{3x-5}{x^2-9}`)],
    ['d', bt(R`\dfrac{x-1}{x+1}-\dfrac{x+1}{x-1}=\dfrac{8}{x^2-1}`)]]),
  // ───────────── Dạng 2 ─────────────
  ...tach(2, 'dai', 5, R`Giải hệ phương trình:`, [
    ['a', he(R`x-y=1`, R`x+y=3`)],
    ['b', he(R`2x-y=2`, R`x+y=4`)],
    ['c', he(R`x+2y=1`, R`2x+3y=4`)],
    ['d', he(R`3x+2y=3`, R`2x-y=2`)]]),
  ...tach(2, 'dai', 6, R`Giải hệ phương trình:`, [
    ['a', he(R`2(x-2)+3(1+y)=-2`, R`3(x-2)-2(1+y)=-3`)],
    ['b', he(R`(x+4)(y+4)=xy+16`, R`(x+2)(y-5)=xy+11`)],
    ['c', he(R`\dfrac{2}{x-3}-3y=1`, R`\dfrac{3}{x-3}+2y=8`)],
    ['d', he(R`\dfrac{1}{x}+\dfrac{1}{y}=\dfrac{1}{12}`, R`\dfrac{8}{x}+\dfrac{15}{y}=1`)]]),
  // ───────────── Dạng 3 ─────────────
  ...ca(3, 'dai', 7, R`Theo kế hoạch hai tổ sản xuất được $800$ sản phẩm trong một thời gian nhất định. Do cải tiến kỹ thuật nên tổ 1 sản xuất vượt mức $15\%$, tổ 2 vượt mức $20\%$, vì vậy trong thời gian quy định họ đã hoàn thành vượt mức $145$ sản phẩm. Hỏi số sản phẩm được giao của mỗi tổ theo kế hoạch?`),
  ...ca(3, 'dai', 8, R`Cô Lan có 1 tỷ đồng tiền tiết kiệm và quyết định chia số tiền này làm hai phần để gửi vào hai ngân hàng khác nhau. Ngân hàng thứ nhất áp dụng mức lãi suất $5\%$/năm, còn ngân hàng thứ hai áp dụng mức lãi suất $8\%$/năm. Sau đúng một năm, tổng số tiền lãi cô Lan nhận được từ cả hai khoản gửi là $62$ triệu đồng. Tính số tiền cô Lan đã gửi vào mỗi ngân hàng.`),
  ...ca(3, 'dai', 9, R`Một gia đình cần mua sắm một chiếc tủ lạnh và một chiếc máy rửa bát. Tổng giá niêm yết của hai sản phẩm này là $45$ triệu đồng. Nhờ chương trình khuyến mãi, chiếc tủ lạnh được giảm giá $12\%$ và chiếc máy rửa bát được giảm giá $15\%$ so với giá niêm yết. Do đó, gia đình chỉ phải thanh toán tổng số tiền là $39$ triệu đồng. Hỏi giá niêm yết của mỗi sản phẩm là bao nhiêu?`),
  ...ca(3, 'dai', 10, R`Một mảnh đất hình chữ nhật có chu vi bằng $80\ \text{m}$. Nếu giảm chiều rộng $3\ \text{m}$ và tăng chiều dài $8\ \text{m}$ thì diện tích tăng thêm $32\ \text{m}^2$. Tính chiều dài và chiều rộng mảnh đất ban đầu.`),
  ...ca(3, 'dai', 11, R`Hai đội công nhân cùng làm chung một công việc thì sau $15$ ngày thì xong. Nếu đội thứ nhất làm riêng trong $3$ ngày rồi dừng lại và đội thứ hai làm tiếp công việc đó trong $5$ ngày thì cả hai đội hoàn thành được $25\%$ công việc. Hỏi mỗi đội làm riêng thì sau bao nhiêu ngày xong công việc.`),
  ...ca(3, 'dai', 12, R`Một ô tô đi quãng đường $AB$ với vận tốc $70\ \text{km/h}$, rồi đi tiếp quãng đường $BC$ với vận tốc $50\ \text{km/h}$. Biết tổng chiều dài quãng đường $AB$ và $BC$ là $290\ \text{km}$ và thời gian ô tô đi đoạn đường $AB$ ít hơn thời gian đi đoạn đường $BC$ là $1$ giờ. Tính thời gian ô tô đi trên mỗi quãng đường?`),
  ...ca(3, 'dai', 13, R`Một chiếc xe khách đi từ Hà Nội đến Thanh Hóa, quãng đường dài $150\ \text{km}$. Sau khi xe khách xuất phát $45$ phút, một chiếc xe tải bắt đầu đi từ Thanh Hóa về Hà Nội (trên cùng một tuyến đường với xe khách) và hai xe gặp nhau sau đó $1$ giờ. Tính vận tốc của mỗi xe, biết rằng mỗi giờ xe khách đi nhanh hơn xe tải $15\ \text{km}$.`),
  ...ca(3, 'dai', 14, R`Một ô tô đi từ $A$ đến $B$ với vận tốc xác định, trong thời gian đã định. Nếu vận tốc giảm $10\ \text{km/h}$ thì thời gian tăng lên $45$ phút, nếu vận tốc tăng $10\ \text{km/h}$ thì thời gian giảm đi $30$ phút. Tính thời gian ô tô dự định đi trên quãng đường $AB$.`),
  // ───────────── Dạng 4 ─────────────
  ...ca(4, 'hgt', 15, R`Chiều cao của một cột cờ là đoạn thẳng $AH$. Khi tia nắng mặt trời tạo với mặt đất một góc $68^\circ$, người ta đo được khoảng cách từ chân cột cờ $H$ đến điểm $B$ dài $12\ \text{m}$. Tính chiều cao cột cờ $AH$ (làm tròn đến chữ số thập phân thứ nhất).`, { anh: ['de_P4B15.png'] }),
  ...ca(4, 'hgt', 16, R`Cột cờ Lũng Cú (thuộc tỉnh Hà Giang) cao $30\ \text{m}$. Tại một thời điểm người ta đo được bóng của cột cờ $40\ \text{m}$. Hỏi tại thời điểm đó, tia nắng mặt trời tạo với mặt đất một góc bao nhiêu độ? (làm tròn kết quả đến độ)`, { anh: ['de_P4B16.png'] }),
  ...ca(4, 'hgt', 17, R`Một cái cây bị sét đánh trúng giữa thân cây làm thân cây ngã xuống đất, tạo với mặt đất một góc là $40^\circ$. Biết rằng khúc cây còn đứng cao $3$ mét. Tính chiều cao lúc đầu của cây?`, { anh: ['de_P4B17.png'] }),
  ...ca(4, 'hgt', 18, R`Hải đăng Kê Gà thuộc xã Tân Thành, huyện Hàm Thuận Nam, Bình Thuận là ngọn hải đăng được trung tâm sách kỉ lục Việt Nam xác nhận là ngọn hải đăng cao nhất và nhiều tuổi nhất. Hải đăng Kê Gà được xây dựng từ năm 1897–1899 và toàn bộ bằng đá. Tháp đèn có hình bát giác, cao $66$ mét so với mực nước biển. Ngọn đèn đặt trong tháp có thể phát sáng xa $22$ hải lý (tương đương $40\ \text{km}$). Một người đi thuyền thúng trên biển, muốn đến ngọn hải đăng có độ cao $66$ mét, người đó đứng trên mũi thuyền và dùng giác kế đo được góc giữa thuyền và tia nắng chiếu từ đỉnh ngọn hải đăng đến thuyền là $25^\circ$. Tính khoảng cách của thuyền đến ngọn hải đăng (làm tròn đến mét).`, { anh: ['de_P4B18.png'] }),
  ...ca(4, 'hgt', 19, R`Một người đang ở trên một cái tháp có chiều cao $h=100\ \text{m}$ nhìn xuống một con đường chạy thẳng đến chân tháp. Anh ta nhìn thấy một chiếc xe máy với góc hạ $30^\circ$. Sáu phút sau lại nhìn thấy nó với góc hạ $60^\circ$. Hỏi sau bao nhiêu phút thì xe máy đến chân tháp? Cho biết vận tốc xe máy không đổi.`, { anh: ['de_P4B19.png'] }),
  ...ca(4, 'hgt', 20, R`Cho tam giác $ABC$ vuông tại $A$ có đường cao $AH$. Chứng minh:
a) $AH=AB\sin B$.
b) $AC=BC\sin B$.
c) $\dfrac{AH}{AB}=\dfrac{AC}{BC}$.`),
  ...tach(4, 'hgt', 21, R`Tính giá trị của biểu thức:`, [
    ['a', R`$A=\cos^2 42^\circ\cdot\sin 30^\circ+\sin^2 42^\circ\cdot\cos 60^\circ$.`],
    ['b', R`$C=\cos^2 10^\circ+\cos^2 35^\circ+\cos^2 30^\circ+\cos^2 60^\circ+\cos^2 55^\circ+\cos^2 80^\circ$.`]]),
  ...ca(4, 'hgt', 22, R`Cho $\triangle ABC$ vuông tại $A$, đường cao $AH$. Gọi $E$ và $F$ lần lượt là hình chiếu của $H$ trên $AB$, $AC$.
a) Biết $AB=3\ \text{cm}$, $AC=4\ \text{cm}$. Giải tam giác vuông $ABC$ (số đo góc làm tròn đến độ).
b) Chứng minh: $AE\cdot AB=AF\cdot AC=AH^2$.
c) Chứng minh: $BE=BC\cos^3 B$.`),
  ...ca(4, 'hgt', 23, R`Cho $\triangle ABC$ vuông tại $A$ $(AB<AC)$.
a) Biết $AB=6\ \text{cm}$, $\widehat{B}=53^\circ$. Giải tam giác vuông $ABC$ (làm tròn kết quả đến hàng đơn vị).
b) Lấy điểm $M$ bất kì trên cạnh $BC$ ($M$ khác $B$, $C$). Kẻ $BK\perp AM$ $(K\in AM)$ và $CH$ vuông góc với đường thẳng $AM$ $(H\in AM)$. Chứng minh $\triangle ABK\backsim\triangle CAH$ và $BK=AH\cot\widehat{ABC}$.
c) Chứng minh $\dfrac{MB}{MC}=\dfrac{AH\tan^2\widehat{ACB}}{AK}$.`),
  ...ca(4, 'hgt', 24, R`Cho hình chữ nhật $ABCD$. Gọi $H$ là hình chiếu của điểm $D$ trên đường thẳng $AC$.
a) Giả sử $AD=9\ \text{cm}$, $AB=12\ \text{cm}$. Tính độ dài đoạn thẳng $DH$; số đo góc $DAC$ (số đo làm tròn đến phút).
b) Chứng minh rằng: $\dfrac{DC^2}{BC^2}=\dfrac{CH}{AH}$.
c) Gọi $M$ và $N$ là hình chiếu của $H$ trên đường thẳng $AD$ và $DC$. Chứng minh rằng: $\dfrac{S_{BAC}}{S_{DMN}}=\dfrac{1}{\sin^2\widehat{DAC}}+\dfrac{1}{\cos^2\widehat{HDC}}$.`),
  ...ca(4, 'hgt', 25, R`Cho $\triangle BCM$ vuông tại $C$ $(CM>CB)$, đường cao $CA$. Gọi $H$, $E$ là hình chiếu của $A$ xuống $BC$, $CM$.
a) Giải tam giác $BCA$ biết $BC=6\ \text{cm}$, $BM=10\ \text{cm}$.
b) Chứng minh $HC\cdot BC=CE\cdot CM$.
c) Gọi $I$ là trung điểm của cạnh $BM$, số đo góc $M$ là $\alpha$. Chứng minh rằng $\sin 2\alpha=2\sin\alpha\cos\alpha$.`),
  // ───────────── Dạng 5 ─────────────
  ...ca(5, 'dai', 26, R`Cho các số thực $x\ge1$; $y\ge1$; $z\ge1$ thỏa mãn $xy+yz+xz=9$. Tìm GTNN, GTLN của $P=x^2+y^2+z^2$.`),
  ...ca(5, 'dai', 27, R`Cho hai số dương $x,\ y$ thỏa mãn điều kiện $x+y=2$. Chứng minh rằng $x^2y^2(x^2+y^2)\le2$.`),
  ...ca(5, 'dai', 28, R`Bác Minh muốn đặt đóng một chiếc hộp đựng quà lưu niệm có dạng hình hộp chữ nhật với mặt đáy $ABCD$ là hình vuông như hình dưới đây. Để món quà trở nên đặc biệt, bác Minh muốn mạ bốn mặt xung quanh và mặt đáy dưới (đáy $MNPQ$) của chiếc hộp bằng kim loại quý (không mạ nắp hộp). Em hãy tìm độ dài cạnh $MN$ của mặt đáy và chiều cao $AM$ của hộp quà sao cho tổng diện tích các mặt được mạ kim loại quý của chiếc hộp là nhỏ nhất biết rằng thể tích của chiếc hộp là $4\ \text{dm}^3$.`,
    { cb: [R`Đề cương ghi "như hình dưới đây" nhưng KHÔNG in hình; tên các mặt ($ABCD$ là mặt đáy hình vuông, đáy dưới $MNPQ$, chiều cao $AM$) lấy theo lời văn.`] }),
  ...ca(5, 'dai', 29, R`Cửa hàng nhà bác Dũng chuyên kinh doanh máy tính tại Hà Nội. Một loại máy tính có giá nhập vào một chiếc là $18$ triệu đồng và bán ra với giá $22$ triệu đồng. Với giá bán như trên thì một năm số lượng máy tính bán được dự kiến là $500$ chiếc. Để tăng thêm lượng tiêu thụ dòng máy tính này, bác Dũng dự định giảm giá bán và ước lượng cứ giảm $200$ nghìn đồng một chiếc thì số lượng máy tính bán ra trong một năm sẽ tăng $50$ chiếc. Vậy bác Dũng phải bán với giá bao nhiêu để sau khi giảm giá lợi nhuận thu sẽ được cao nhất?`),
  // ───────────── Đề minh hoạ ─────────────
  ...tach(6, 'dai', 1, R`Giải phương trình, hệ phương trình:`, [
    ['a', bt(R`5x(x-2024)+3(x-2024)=0`)],
    ['b', bt(R`\dfrac{1}{2x-3}-\dfrac{3}{x(2x-3)}=\dfrac{5}{x}`)],
    ['c', he(R`(x-1)(y-2)=xy+5`, R`3x+y=6`)]]),
  ...ca(6, 'dai', 2, R`Giải bài toán sau bằng cách lập hệ phương trình. Bác An có $500$ triệu đồng để đầu tư vào hai khoản gửi tiết kiệm ngân hàng và trái phiếu với kỳ hạn 1 năm. Lãi suất ngân hàng và trái phiếu mỗi năm lần lượt là $6\%$ và $7\%$. Tính số tiền mà bác An đầu tư vào mỗi khoản để sau 1 năm bác nhận được $532$ triệu đồng cả gốc và lãi từ hai khoản đầu tư đó.`),
  ...ca(6, 'dai', 3, R`Giải bài toán sau bằng cách lập hệ phương trình. Hai ô tô cùng khởi hành một lúc từ hai tỉnh, cách nhau $150\ \text{km}$ đi ngược chiều và gặp nhau sau $2$ giờ. Tìm vận tốc của mỗi ô tô, biết rằng nếu vận tốc của ô tô thứ nhất tăng thêm $5\ \text{km/h}$ và vận tốc của ô tô thứ hai giảm đi $5\ \text{km/h}$ thì vận tốc của ô tô thứ nhất bằng $2$ lần vận tốc của ô tô thứ hai.`),
  ...ca(6, 'hgt', '4.1', R`Một tháp canh có bóng trên mặt đất dài $5{,}8\ \text{m}$. Các tia nắng mặt trời tạo với mặt đất một góc xấp xỉ bằng $60^\circ$ (hình vẽ). Tính:
a) Số đo góc tạo bởi tháp canh và các tia nắng mặt trời.
b) Chiều cao của tháp canh trong hình (kết quả làm tròn đến hàng phần trăm).`, { anh: ['de_P6B4_1.png'], cb: [R`Đề minh hoạ in Bài 4 gồm hai bài con độc lập "1)" và "2)" — nhập thành hai câu "Bài 4.1", "Bài 4.2".`] }),
  ...ca(6, 'hgt', '4.2', R`Cho tam giác $ABC$ vuông tại $B$ (có $AB>BC$), đường cao $BH$.
a) Biết $AB=2\sqrt{3}\ \text{cm}$, $BC=2\ \text{cm}$. Giải tam giác $ABC$.
b) Kẻ $HF$, $HE$ lần lượt vuông góc với $CB$, $AB$ ($F$ thuộc $BC$, $E$ thuộc $AB$). Chứng minh: $BE\cdot AE=HE^2$ và $BE\cdot AE+BF\cdot FC=BH^2$.
c) Lấy điểm $M$ nằm giữa $E$ và $A$, kẻ $BD$ vuông góc với $MC$ tại $D$. Chứng minh: $CD\cdot CM=CH\cdot CA$ và $\sin\widehat{BMC}\cdot\sin\widehat{CAB}=\dfrac{HD}{MA}$.`),
  ...ca(6, 'dai', 5, R`Người ta cần lập hàng rào quanh khu vực bảo vệ có dạng hình chữ nhật cho một toà nhà như hình vẽ bên. Hỏi nếu có $80\ \text{m}$ hàng rào bao quanh 3 mặt. Biết hàng rào là các cạnh $AB$, $BC$, $CD$ như hình vẽ thì diện tích tối đa của khu vực bảo vệ là bao nhiêu?`,
    { anh: ['de_P6B5.png'], cb: [R`Đề minh hoạ đánh số bài này là "Bài V" (các bài trước là Bài 1–4) — nhập nhãn "Bài 5".`] }),
]

const NHOM = [[1, 1, 2], [1, 3, 4], [2, 5, 6], [3, 7, 14], [4, 15, 19], [4, 20, 22], [4, 23, 25], [5, 26, 29], [6, 1, 5]]

dung({ MA: 'TM-GKI-2024', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS Tây Mỗ (Hà Nội)', NGUON: 'le', NAM: 2024,
  FILE: 'ĐỀ-CƯƠNG-GIỮA-KÌ-II-THCS-TÂY-MỖ-LỚP-9-TOÁN.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP })
