// ============================================================================
// GV2-GKI-2026.build.mjs — gõ lại "HƯỚNG DẪN ÔN TẬP VÀ KIỂM TRA GIỮA HỌC KỲ 1 NĂM HỌC 2026–2027 — KHỐI 6" — Trường THCS Giảng Võ 2 (UBND phường Giảng Võ, Hà Nội)
// (PDF 9 trang: 1 trang bìa + 8 trang nội dung, có lớp chữ nhưng công thức hỏng ⇒ đọc từ ẢNH trang 130 dpi t-1..t-9; Thùy gửi 20/10)
//
//   node kho-rules/dai/lo/k6/de-cuong/GV2-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_*.png)
//
// PHẠM VI KIẾN THỨC (đề ghi, trang 1): Số học = tập hợp · cộng trừ nhân chia luỹ thừa, thứ tự thực hiện phép tính · quan hệ chia hết và tính chất ·
//   dấu hiệu chia hết cho 2, 5, 9, 3 · số nguyên tố, hợp số, phân tích một số ra thừa số nguyên tố.
//   Hình học = tam giác đều · hình vuông · lục giác đều · hình chữ nhật, hình thoi, hình bình hành, hình thang cân · chu vi và diện tích các tứ giác đã học.
//   (KHÔNG ƯCLN/BCNN, KHÔNG số nguyên.)
// CẤU TRÚC: B.I Trắc nghiệm Câu 1–20 · B.II Tự luận Bài 1–17 · B.III Một số bài toán nâng cao Bài 18–25 · C. Đề minh họa (Trắc nghiệm Câu 1–8 ⇒ nhãn "ĐMH Câu N";
//   Tự luận Bài I–V ⇒ nhãn "ĐMH Bài 1…5" — số La Mã đổi thành số Ả Rập để dc-lib đọc được; Bài II có hai mục nhỏ ⇒ "ĐMH Bài 2.1a…d", "ĐMH Bài 2.2").
// TÁCH Ý: chỉ ý có dữ kiện RIÊNG (Bài 1, 2, 3, 4, 18, 20, 22, 23 · ĐMH Bài 1, 2.1); bài lời văn chung dữ kiện / ý sau dùng ý trước (Bài 5–17, 19, 24, 25 · ĐMH Bài 3, 4) ⇒ giữ cả bài.
// KHO: 'dai' = số học, lời văn tính tiền / vận tốc…; 'hgt' = hình (nhận dạng hình, tính chất đường chéo, chu vi, diện tích) — Câu 16–20, Bài 11–17, ĐMH Câu 5–8, ĐMH Bài 4.
// Số viết liền (đề in "18 000" ⇒ gõ 18000). Chữ in đậm trong đề ("đúng", "không phải", "không có") không giữ định dạng đậm.
// Đề cương KHÔNG có đáp án / lời giải — chỉ gõ ĐỀ.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/GV2-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
/** tách ý: mỗi ý một câu, câu = lead + ý */
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), canh_bao: cb ?? [] }))
/** giữ nguyên cả bài */
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
/** trắc nghiệm: câu hỏi + 4 phương án A–D (mỗi phương án một dòng) */
const tn = (phan, kho, pre, so, nhom, q, ops, o = {}) => ({
  phan, kho, nhom, loai: 'trac_nghiem', nhan: `${pre}Câu ${so}`,
  noi_dung: q + '\n' + ops.map((x, i) => `${'ABCD'[i]}. ${x}`).join('\n'),
  anh: o.anh ?? [], canh_bao: o.cb ?? [],
})

const PHAN = [
  { thu_tu: 1, ten: 'B.I. Câu hỏi trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'B.II. Bài tập tự luận (Bài 1–17)' },
  { thu_tu: 3, ten: 'B.III. Một số bài toán nâng cao (Bài 18–25)' },
  { thu_tu: 4, ten: 'C.I. Đề minh họa — Phần trắc nghiệm', dang_thuc: 'trac_nghiem' },
  { thu_tu: 5, ten: 'C.II. Đề minh họa — Phần tự luận' },
]

const DOC_HINH_CAU16 = R`Đọc hình: Hình 1 = biển báo STOP (bát giác đều, chữ STOP); Hình 2 = con sao biển cam có viền ngũ giác vẽ quanh; Hình 3 = ba khung kệ gỗ hình lục giác (đựng sách + bút, đồng hồ báo thức, chậu cây); Hình 4 = bàn cờ vua (hình vuông) có quân cờ.`
const DOC_HINH_DMH5 = R`Đọc hình: Hình 1 = ba khung kệ hình lục giác (hồng, xanh, trắng); Hình 2 = đồng hồ treo tường hình tam giác đều (đỉnh hướng xuống); Hình 3 = kệ gỗ ghép các ô hình chữ nhật; Hình 4 = bàn học mặt bàn hình thang (cam) kèm ghế.`
const DOC_HINH_DMH78 = R`Đọc hình: $ABCD$ hình thang cân, đáy $AB$ phía trên, $DC$ phía dưới; $F\in DC$, $ABFD$ là hình bình hành; $AB=15$ cm (ghi trên $AB$), $AD=10$ cm, đường cao từ $A$ xuống $DC$ dài $6$ cm (có ký hiệu vuông góc tại chân đường cao), đoạn $DF$ ghi $15$ cm, đoạn $FC$ ghi $16$ cm.`

const CAU = [
  // ══════════ B.I. TRẮC NGHIỆM (Câu 1–20) ══════════
  tn(1, 'dai', '', 1, 1, R`Phép tính $2^2+3^2$ có kết quả bằng`, [bt('24'), bt('25'), bt('13'), bt('14')]),
  tn(1, 'dai', '', 2, 1, R`Số tự nhiên $x$ thỏa mãn $12x-33=3^2.3^3:3^4$ là`, [bt('3'), bt('36'), bt('13'), bt('12')]),
  tn(1, 'dai', '', 3, 1, R`Giá trị của biểu thức $20-[30-(5-1)^2]$ bằng`, [bt('6'), bt('7'), bt('8'), bt('9')]),
  tn(1, 'dai', '', 4, 1, R`Mỗi hộp bánh gồm 5 gói bánh với khối lượng mỗi gói bánh là $200$ g. Nếu một thùng bánh chứa 20 hộp bánh như thế thì khối lượng của thùng bánh là bao nhiêu ki-lô-gam? (Bỏ qua khối lượng của vỏ hộp và vỏ thùng).`, [bt('20'), bt('2'), bt('4'), bt('40')]),
  tn(1, 'dai', '', 5, 1, R`Một quyển vở loại A có giá 18000 đồng. Với 300000 đồng, bạn Mai có thể mua được nhiều nhất bao nhiêu quyển vở loại này?`, [bt('15'), bt('16'), bt('17'), bt('18')]),
  tn(1, 'dai', '', 6, 1, R`Vận tốc của ánh sáng trong không khí được các nhà khoa học ghi nhận là khoảng $3.10^8$ m/s. Một máy bay không người lái có thể di chuyển với vận tốc tối đa là $10^3$ m/s. Hỏi vận tốc của ánh sáng trong không khí gấp bao nhiêu lần vận tốc tối đa của máy bay không người lái đó?`, [bt('3000'), bt('30000'), bt('300000'), bt('3000000')]),
  tn(1, 'dai', '', 7, 1, R`Tập hợp các ước của 36 là`, [bt(R`\{0;2;4;6;12;18;36\}`), bt(R`\{1;2;3;4;6;9;12;18;36\}`), bt(R`\{0;1;2;3;4;6;9;12;18;36\}`), bt(R`\{1;2;3;4;6;9;12;36\}`)]),
  tn(1, 'dai', '', 8, 1, R`Tập hợp nào sau đây có các phần tử đều là bội của $9$?`, [bt(R`\{1;3;9\}`), bt(R`\{0;27;126;819\}`), bt(R`\{0;9;123;241\}`), bt(R`\{1;3;6;9;12\}`)]),
  tn(1, 'dai', '', 9, 1, R`Tập hợp các chữ số $x$ sao cho $\overline{5x24}$ chia hết cho 3 là`, [bt(R`\{1;4;5\}`), bt(R`\{1;4;7\}`), bt(R`\{1;5;8\}`), bt(R`\{1;5;9\}`)]),
  tn(1, 'dai', '', 10, 1, R`Khẳng định nào sau đây đúng?`, [R`$120-4+48$ chia hết cho $12$.`, R`$135+5^3-30$ chia hết cho $5$.`, R`$293+42$ chia hết cho $3$.`, R`$8.45+18$ chia hết cho $4$.`]),
  tn(1, 'dai', '', 11, 2, R`Có bao nhiêu giá trị của số tự nhiên $n$ thỏa mãn $n+6$ chia hết cho $n$?`, [bt('1'), bt('2'), bt('3'), bt('4')]),
  tn(1, 'dai', '', 12, 2, R`Đội văn nghệ có 24 bạn được chia đều thành các nhóm để tập luyện. Biết rằng mỗi nhóm có từ 3 đến 12 bạn. Hỏi có bao nhiêu cách chọn số lượng nhóm?`, [bt('3'), bt('4'), bt('5'), bt('6')]),
  tn(1, 'dai', '', 13, 2, R`Tập hợp nào sau đây chỉ bao gồm các phần tử là số nguyên tố?`, [bt(R`\{0;1\}`), bt(R`\{1;3;5\}`), bt(R`\{5;7;9\}`), bt(R`\{2;5;7\}`)]),
  tn(1, 'dai', '', 14, 2, R`Phân tích số 60 ra thừa số nguyên tố được kết quả là`, [bt('2^2.3.5'), bt('3.4.5'), bt('2.3^2.5'), bt('2.30')]),
  tn(1, 'dai', '', 15, 2, R`Phân tích số $A=4^3.9^4$ ra thừa số nguyên tố được kết quả là`, [bt('2^5.3^8'), bt('2^6.3^6'), bt('2^6.3^8'), bt('2^6.3^{12}')]),
  tn(1, 'hgt', '', 16, 2, R`Hình lục giác đều có trong hình ảnh nào dưới đây?`, ['Hình 1.', 'Hình 2.', 'Hình 3.', 'Hình 4.'], { anh: ['de_cau16.png'], cb: [DOC_HINH_CAU16, 'Phương án A–D chỉ là tên hình (Hình 1–4), nội dung nằm ở ảnh — ảnh gắn kèm đề.'] }),
  tn(1, 'hgt', '', 17, 2, R`Cho các khẳng định sau:
(I) Hình chữ nhật, hình thang cân, hình vuông có hai đường chéo bằng nhau.
(II) Hình thoi, hình vuông có bốn cạnh bằng nhau.
(III) Hình thoi, hình chữ nhật có bốn góc bằng nhau.
(IV) Hình bình hành, hình thoi, hình chữ nhật, hình vuông có các cạnh đối song song.
Số khẳng định đúng trong các khẳng định trên là`, [bt('1'), bt('2'), bt('3'), bt('4')]),
  tn(1, 'hgt', '', 18, 2, R`Cho hình bình hành $ABCD$, hai đường chéo $AC$ và $BD$ cắt nhau tại điểm $O$. Biết rằng $AC=6$ cm và $BD=8$ cm. Khi đó $OA+OB$ bằng`, [R`$14$ cm.`, R`$7$ cm.`, R`$8$ cm.`, R`$10$ cm.`]),
  tn(1, 'hgt', '', 19, 2, R`Khẳng định nào sau đây là đúng?`, ['Hình thang cân có các cạnh bằng nhau.', 'Hình thang cân có các cạnh đối song song.', 'Hình thang cân có hai đường chéo bằng nhau.', 'Hình thang cân có các góc đối bằng nhau.']),
  tn(1, 'hgt', '', 20, 2, R`Một hình vuông có chu vi bằng chu vi hình chữ nhật có chiều dài $10$ cm và chiều rộng $6$ cm. Diện tích của hình vuông đó bằng`, [R`$8\ \text{cm}^2$.`, R`$16\ \text{cm}^2$.`, R`$60\ \text{cm}^2$.`, R`$64\ \text{cm}^2$.`]),

  // ══════════ B.II. TỰ LUẬN (Bài 1–17) ══════════
  ...tach(2, 'dai', '', 1, 3, 'Thực hiện phép tính (tính hợp lí nếu có thể)', [
    ['a', bt(R`226+665+174-65+48`)],
    ['b', bt(R`13+7.125-75:25`)],
    ['c', bt(R`25.125.19.32`)],
    ['d', bt(R`27.75+24.27+27`)],
    ['e', bt(R`41.27+114.59-41.13`)],
    ['f', bt(R`35.77+47.29-16.35-12.29`)],
    ['g', bt(R`9^2+81.57-58.80`)],
    ['h', bt(R`7^3+7^2.45-2^5.7^2`)],
    ['i', bt(R`480:[75+(7^2-8.3):5]+2026^0`)],
    ['j', bt(R`2^3.[3^9:3^6-(5^2-3):11]-1^{2026}`)]]),
  ...tach(2, 'dai', '', 2, 4, R`Tìm số tự nhiên $x$, biết`, [
    ['a', bt(R`(175-x)-86=0`)],
    ['b', bt(R`(7x-15):3=9`)],
    ['c', bt(R`70-5(x-3)=45`)],
    ['d', bt(R`3(x-1)-2025^0=3^3+2^3`)],
    ['e', bt(R`[43-(56-x)].12=384`)],
    ['f', bt(R`(2x-1)(x-3)=0`)],
    ['g', bt(R`x^5-3x^4=0`)],
    ['h', bt(R`6+3(x+1)^2=81`)],
    ['i', bt(R`187-2.3^x=5^2`)],
    ['j', bt(R`5^x+5^{x+1}=750`)]]),
  ...tach(2, 'dai', '', 3, 5, R`Tìm số tự nhiên $x$, biết`, [
    ['a', R`$x\in\text{Ư}(15)$ và $x$ là số nguyên tố.`],
    ['b', R`$x\in\text{B}(15)$ và $11<x\le 60$.`],
    ['c', R`$(x-2)\in\text{Ư}(24)$ và $x>9$.`],
    ['d', bt(R`(10+25+x+45)\vdots 5`)],
    ['e', R`$x+1\in\text{Ư}(30)$ và $x>12$.`],
    ['f', R`47 chia cho $x$ dư 2 và $x\ge 15$.`]]),
  ...tach(2, 'dai', '', 4, 5, R`Tìm các chữ số $x$ và $y$ sao cho`, [
    ['a', R`$\overline{24x1y}$ chia hết cho 2; 3 và 5.`],
    ['b', R`$\overline{x12456y}$ chia hết cho 2; 5 và 9.`],
    ['c', R`$\overline{98xy}$ chia hết cho 5 và 9.`],
    ['d', R`$\overline{3x2y}$ chia cho 2; 5 và 9 đều dư 1.`]]),
  ...ca(2, 'dai', '', 5, 6, R`Trong 8 tháng đầu năm, một cửa hàng văn phòng phẩm bán được 1352 chiếc bút loại A. Trong 4 tháng cuối năm, trung bình mỗi tháng cửa hàng bán được 142 chiếc bút cùng loại.
a) Tính số chiếc bút loại A mà cửa hàng đã bán được trong cả năm.
b) Biết cửa hàng nhập mỗi chiếc bút loại A với giá 12500 đồng và bán ra với giá 15000 đồng. Tính tổng số tiền lãi cửa hàng thu được từ việc bán loại bút này trong năm đó.`),
  ...ca(2, 'dai', '', 6, 6, R`Một công ty sản xuất đồ gia dụng có hai xưởng sản xuất. Xưởng A gồm 25 công nhân, mỗi công nhân làm trong một ngày được 40 sản phẩm. Xưởng B có số công nhân nhiều hơn xưởng A là 5 người nhưng mỗi người chỉ làm được 35 sản phẩm trong một ngày.
a) Hỏi mỗi ngày công ty sản xuất được bao nhiêu sản phẩm?
b) Người ta đóng gói toàn bộ số sản phẩm sản xuất được trong ngày vào các thùng, mỗi thùng chứa được tối đa 24 sản phẩm. Hỏi công ty cần dùng ít nhất bao nhiêu thùng để đóng gói hết số sản phẩm đó?`),
  ...ca(2, 'dai', '', 7, 6, R`Trong đợt ủng hộ sách cho thư viện nhà trường, lớp 6A đã quyên góp được một số cuốn sách. Biết khi xếp số sách đó thành từng chồng 4 cuốn thì vừa hết, nhưng nếu xếp thành từng chồng 5 cuốn thì còn thừa ra 1 cuốn. Hỏi lớp 6A đã đóng góp được bao nhiêu cuốn sách, biết số lượng sách đó là một số tự nhiên có hai chữ số và lớn hơn 80.`),
  ...ca(2, 'dai', '', 8, 6, R`Trong một buổi sinh hoạt ngoại khóa môn Toán 6, khi chia các học sinh tham gia thành các nhóm 5 người để chơi trò chơi thì vừa đủ, nhưng khi chia thành các nhóm 3 người để thảo luận thì lại cần thêm 2 bạn nữa mới đủ nhóm. Hỏi có tất cả bao nhiêu học sinh tham gia buổi sinh hoạt, biết số học sinh tham gia có từ 105 đến 120 người?`),
  ...ca(2, 'dai', '', 9, 6, R`Dưới đây là bảng giá nước sinh hoạt cho mỗi hộ gia đình (Biết số tiền nước phải trả được tính theo giá thanh toán sau thuế và phí):
Bảng giá (mức tiêu thụ hàng tháng tính theo $\text{m}^3$/tháng/hộ gia đình; giá tính theo đồng/$\text{m}^3$):
• $10\ \text{m}^3$ đầu tiên: giá bán lẻ chưa thuế 8500; giá thanh toán sau thuế và phí 8925.
• Từ trên $10\ \text{m}^3$ đến $20\ \text{m}^3$: giá bán lẻ chưa thuế 9900; giá thanh toán sau thuế và phí 10395.
• Từ trên $20\ \text{m}^3$ đến $30\ \text{m}^3$: giá bán lẻ chưa thuế 16000; giá thanh toán sau thuế và phí 16800.
• Trên $30\ \text{m}^3$: giá bán lẻ chưa thuế 27000; giá thanh toán sau thuế và phí 28350.
a) Tháng trước nhà bác An sử dụng hết $23\ \text{m}^3$ nước. Hỏi bác An phải trả bao nhiêu tiền?
b) Tháng này nhà bác An đã giảm lượng nước sử dụng xuống còn $18\ \text{m}^3$. Hỏi bác An đã tiết kiệm được bao nhiêu tiền nước so với tháng trước?`,
    { cb: ['Đề in BẢNG 3 cột (mức tiêu thụ · giá bán lẻ chưa thuế · giá thanh toán sau thuế và phí) × 4 hàng — chuyển thành 4 dòng liệt kê (bảng array quá rộng, tiêu đề chữ Việt dài tràn màn); đơn giá đồng/m³, số viết liền, đã đối chiếu ảnh trang 4.'] }),
  ...ca(2, 'dai', '', 10, 6, R`Một người lái xe ô tô trong 3 giờ với vận tốc 40 km/h, sau đó người đó dừng xe lại nghỉ ngơi rồi lái xe tiếp trong 2 giờ nữa với vận tốc 50 km/h.
a) Tính quãng đường người đó đi được trong 3 giờ đầu; trong 2 giờ sau.
b) Xe ô tô của người này trung bình tiêu thụ 1 lít xăng cho 10 km. Tính xem, sau 5 giờ di chuyển nói trên, xe ô tô tiêu thụ khoảng bao nhiêu lít xăng?`),
  ...ca(2, 'hgt', '', 11, 6, R`Nhà Mai có một mảnh vườn có dạng hình chữ nhật với diện tích $48\ \text{m}^2$ và một cạnh có độ dài 6 m.
a) Tính chu vi của mảnh vườn đó.
b) Dọc theo các cạnh của mảnh vườn, Mai trồng các khóm hoa sao cho cả bốn góc vườn đều có hoa và cứ 25 cm trồng một khóm. Hãy tính số khóm hoa mà Mai cần trồng.`),
  ...ca(2, 'hgt', '', 12, 7, R`Một thửa ruộng hình chữ nhật có chiều rộng là 15 m, chiều dài 30 m.
a) Tìm diện tích thửa ruộng đó.
b) Vụ mùa vừa qua người ta trồng lúa ST25, cứ $10\ \text{m}^2$ thu hoạch được 7 kg thóc. Hỏi khối lượng thóc ST25 thu được trên thửa ruộng đó là bao nhiêu?
c) Biết mỗi ki-lô-gam thóc ST25 được bán với giá 10500 đồng. Tính số tiền thu được khi bán lượng thóc ST25 thu được ở thửa ruộng trên.`,
    { cb: ['Giáp ranh dai/hgt: ý a là diện tích hình chữ nhật, ý b, c là nhân / chia theo tỉ lệ và tính tiền — đã chốt kho hgt cho đồng bộ với Bài 11, 14 và ĐMH Bài 4 (diện tích hình + tính tiền).'] }),
  ...ca(2, 'hgt', '', 13, 7, R`Bác Hà có một khu vườn có dạng hình vuông. Do còn đất nên bác mở rộng vườn thêm 2 m về mỗi phía. Sau khi mở rộng, bác thấy diện tích khu vườn tăng thêm $56\ \text{m}^2$. Tính diện tích khu vườn ban đầu của bác Hà.`,
    { anh: ['de_bai13.png'], cb: [R`Đọc hình: hình vuông lớn (sau mở rộng) chứa hình vuông nhỏ ở giữa (khu vườn ban đầu); các cạnh hình vuông nhỏ kéo dài bằng nét đứt tới cạnh hình vuông lớn, chia phần mở rộng thành dải rộng 2 m ở cả bốn phía (ghi "2 m" ở dải phía trên và dải bên trái); các đỉnh chấm đỏ.`] }),
  ...ca(2, 'hgt', '', 14, 7, R`Một cái túi xách có mặt trước có dạng hình thang cân với đáy lớn $30$ cm, đáy nhỏ $20$ cm và chiều cao $18$ cm.
a) Tính diện tích bề mặt trước của túi xách.
b) Người ta muốn dùng da bò để bọc mặt trước, mặt sau và mặt đáy của túi xách. Biết mặt sau có kích thước giống mặt trước, còn mặt đáy của túi xách có dạng hình chữ nhật với chiều rộng là $5$ cm và chiều dài bằng đáy lớn của mặt trước. Tính số tiền cần để mua da bọc, biết rằng da bò dùng để làm túi có giá 20000 đồng/$\text{dm}^2$ (Coi diện tích phần mép nối là không đáng kể).`,
    { anh: ['de_bai14.png'], cb: ['Hình là ảnh chụp túi xách màu nâu (minh hoạ, KHÔNG có kích thước / ký hiệu) — toàn bộ dữ kiện nằm ở lời đề.'] }),
  ...ca(2, 'hgt', '', 15, 7, R`Một mảnh đất có dạng hình chữ nhật $ABCD$, với chiều dài $AB=50$ m, chiều rộng $AD=30$ m.
a) Tính diện tích mảnh đất hình chữ nhật $ABCD$ nói trên.
b) Theo một dự án mở đường, phần đất làm đường có dạng hình bình hành $AEFH$ như hình vẽ. Biết $HF=15$ m, tính phần diện tích còn lại của mảnh đất.`,
    { anh: ['de_bai15.png'], cb: [R`Đọc hình: $ABCD$ chữ nhật ($A$ trên trái, $B$ trên phải, $C$ dưới phải, $D$ dưới trái), có ký hiệu góc vuông ở bốn đỉnh; $AB=50$ m (mũi tên nét đứt phía trên), $AD=30$ m; $E$ nằm trên $AB$ gần $A$; $H$, $F$ nằm trên $DC$ với $H$ gần $D$; $HF=15$ m; hình bình hành $AEFH$ tô xanh lá.`] }),
  ...ca(2, 'hgt', '', 16, 7, R`Mảnh vườn nhà ông Sơn có dạng hình chữ nhật với chiều dài $30$ m và chiều rộng $20$ m (xem hình minh họa).
a) Trong mảnh vườn đó, ông Sơn làm cái hồ có dạng hình thoi, phần đất còn lại của mảnh vườn để trồng hoa. Tính diện tích đất trồng hoa.
b) Tính số tiền ông Sơn phải trả để trồng hoa, biết cứ $10\ \text{m}^2$ trồng hoa có chi phí là 200000 đồng.`,
    { anh: ['de_bai16.png'], cb: [R`Đọc hình: hình chữ nhật có hình thoi (tô xanh) bên trong mà bốn đỉnh nằm ở trung điểm bốn cạnh hình chữ nhật (đỉnh trên và dưới ở giữa cạnh ngang, đỉnh trái và phải ở giữa cạnh dọc); có hai đoạn nối trung điểm (hai đường chéo của hình thoi) cắt nhau vuông góc ở tâm, ký hiệu góc vuông ở các góc hình chữ nhật và ở tâm; bốn góc còn lại có hoa. Hình KHÔNG ghi số đo.`] }),
  ...ca(2, 'hgt', '', 17, 7, R`Bác Nam có một lô đất hình vuông với độ dài cạnh là $20$ m. Bên trong lô đất, bác Nam xây một hồ cá có dạng hình thang cân $ABCD$ với các kích thước được cho như hình vẽ, phần đất còn lại bác dự định trồng hoa.
a) Tính diện tích bác Nam dự định trồng hoa.
b) Bác Nam muốn xây tường rào xung quanh lô đất hình vuông của nhưng bớt lại khu vực mặt ngoài $AB$ của hồ cá. Tính số tiền bác Nam phải trả để xây tường rào, biết chi phí cho mỗi mét tường rào là 600000 đồng.`,
    { anh: ['de_bai17.png'], cb: [R`CHƯA CHẮC — Đề in "xung quanh lô đất hình vuông của nhưng bớt lại" (thừa chữ "của"): đã gõ ĐÚNG như in.`, R`Đọc hình: lô vuông cạnh $20$ m (ghi trên cạnh trên); hồ cá hình thang cân $ABCD$ nằm sát cạnh dưới của lô, $A$, $B$ nằm trên cạnh dưới ($AB=15$ m, đáy lớn), $DC=10$ m (đáy nhỏ, phía trên), đường cao từ $D$ xuống $AB$ dài $8$ m (nét đứt, có ô vuông ký hiệu); phần còn lại trồng hoa.`] }),

  // ══════════ B.III. MỘT SỐ BÀI TOÁN NÂNG CAO (Bài 18–25) ══════════
  ...tach(3, 'dai', '', 18, 8, 'So sánh', [
    ['a', R`$16^{45}$ và $32^{37}$.`],
    ['b', R`$3^{400}$ và $4^{300}$.`],
    ['c', R`$5^{601}$ và $11^{399}$.`],
    ['d', R`$2^{41}$ và $5^{19}$.`]]),
  ...ca(3, 'dai', '', 19, 8, R`Cho $A=4+4^2+4^3+\dots+4^{60}$.
a) Hãy giải thích vì sao $A$ chia hết cho 5 và 21 nhưng $A$ không chia hết cho 16.
b) $3A+4$ có là số chính phương không? Vì sao?`),
  ...tach(3, 'dai', '', 20, 8, '', [
    ['a', R`Tìm số nguyên tố $p$ sao cho $p+20$ và $p+28$ cũng là các số nguyên tố.`],
    ['b', R`Tìm tất cả các số tự nhiên $n$ sao cho $n+1;\ n+3;\ n+7;\ n+9;\ n+13;\ n+15$ đều là các số nguyên tố.`]]),
  ...ca(3, 'dai', '', 21, 9, R`Cho số nguyên tố $p>3$ thỏa mãn $2p+1$ là số nguyên tố. Khi đó $4p+1$ là số nguyên tố hay hợp số? Vì sao?`),
  ...tach(3, 'dai', '', 22, 9, R`Tìm số tự nhiên $n$ sao cho`, [
    ['a', R`$n+7$ chia hết cho $n+1$.`],
    ['b', R`$3n$ chia hết cho $n-1$ (với $n>1$).`],
    ['c', R`$2n+14$ là bội của $3n+1$.`],
    ['d', R`$n+2$ là ước của $n^2+1$.`]]),
  ...tach(3, 'dai', '', 23, 10, R`Tìm tất cả các số tự nhiên $x$ và $y$ thỏa mãn`, [
    ['a', bt(R`(x+3)(2y-1)=6`)],
    ['b', bt(R`x(2y+1)+(4y+2)=12`)],
    ['c', bt(R`x(y+2)+3y=18`)],
    ['d', bt(R`2xy+6x-y-15=0`)]]),
  ...ca(3, 'dai', '', 24, 10, R`Có 6 hộp bút máy với số lượng bút bên trong lần lượt là: 31 chiếc, 20 chiếc, 19 chiếc, 18 chiếc, 16 chiếc, 15 chiếc. Ba bạn Lan, Tùng và Mai đem chia các hộp bút này cho nhau sao cho mỗi bạn đều nhận được nguyên hộp (không chia lẻ từng chiếc bút). Biết rằng tổng số hộp mà Lan và Tùng nhận được là 5 hộp, và tổng số bút máy của Lan gấp đôi tổng số bút máy của Tùng. Hỏi mỗi bạn nhận được tất cả bao nhiêu chiếc bút máy?`),
  ...ca(3, 'dai', '', 25, 10, R`Từ một tờ giấy ban đầu, bạn An đem cắt thành 6 mảnh hoặc 11 mảnh. Sau đó, An lại lấy một mảnh giấy bất kỳ thu được để tiếp tục cắt thành 6 mảnh hoặc 11 mảnh nhỏ hơn. Cứ làm như vậy, hỏi An có thể thu được đúng 2072 mảnh giấy không?`),

  // ══════════ C. ĐỀ MINH HỌA — I. TRẮC NGHIỆM (Câu 1–8) ══════════
  tn(4, 'dai', 'ĐMH ', 1, 11, R`Kết quả của phép tính $2^3.2^5$ được viết dưới dạng một lũy thừa là`, [bt('4^8'), bt('2^{15}'), bt('2^8'), bt('4^{15}')]),
  tn(4, 'dai', 'ĐMH ', 2, 11, R`Phân tích số 168 ra thừa số nguyên tố ta được kết quả nào dưới đây?`, [bt('2^3.21'), bt('2^2.6.7'), bt('2^3.3.7'), bt('8.3.7')]),
  tn(4, 'dai', 'ĐMH ', 3, 11, R`Trong các số sau, số nào không phải là bội của $14$?`, [bt('0'), bt('28'), bt('14'), bt('7')]),
  tn(4, 'dai', 'ĐMH ', 4, 11, R`Chữ số thích hợp ở dấu * để số $\overline{101*5}$ chia hết cho 9 là`, [bt('3'), bt('0'), bt('4'), bt('2')]),
  tn(4, 'hgt', 'ĐMH ', 5, 11, R`Trong các đồ vật dưới đây, không có đồ vật có dạng hình nào?`, ['Hình lục giác đều.', 'Hình chữ nhật.', 'Hình thoi.', 'Hình thang cân.'], { anh: ['de_dmh_cau5.png'], cb: [DOC_HINH_DMH5, 'Ảnh có nhãn Hình 1–4 nhưng phương án A–D là tên hình (không phải Hình 1–4) — gõ đúng như in.'] }),
  tn(4, 'hgt', 'ĐMH ', 6, 11, R`Cho các khẳng định sau:
i) Hình chữ nhật có hai đường chéo bằng nhau.
ii) Hình thoi có hai đường chéo bằng nhau và vuông góc với nhau.
iii) Hình bình hành có hai đường chéo cắt nhau tại trung điểm của mỗi đường.
iv) Hình thang cân có hai đường chéo bằng nhau.
Số khẳng định đúng trong các khẳng định trên là`, [bt('1'), bt('2'), bt('3'), bt('4')]),
  tn(4, 'hgt', 'ĐMH ', 7, 11, R`Sử dụng hình vẽ sau cho Câu 7 và Câu 8: Cho hình thang cân $ABCD$ và hình bình hành $ABFD$ có các kích thước như hình vẽ.
Diện tích của hình bình hành $ABFD$ là`, [R`$60\ \text{cm}^2$.`, R`$90\ \text{cm}^2$.`, R`$45\ \text{cm}^2$.`, R`$72\ \text{cm}^2$.`], { anh: ['de_dmh_cau7_8.png'], cb: [DOC_HINH_DMH78, 'Câu 7 và Câu 8 dùng chung một hình — ảnh gắn ở cả hai câu.'] }),
  tn(4, 'hgt', 'ĐMH ', 8, 11, R`Sử dụng hình vẽ sau cho Câu 7 và Câu 8: Cho hình thang cân $ABCD$ và hình bình hành $ABFD$ có các kích thước như hình vẽ.
Chu vi của hình thang cân $ABCD$ là`, [R`$66$ cm.`, R`$76$ cm.`, R`$86$ cm.`, R`$96$ cm.`], { anh: ['de_dmh_cau7_8.png'], cb: [DOC_HINH_DMH78] }),

  // ══════════ C. ĐỀ MINH HỌA — II. TỰ LUẬN (Bài I–V ⇒ ĐMH Bài 1–5) ══════════
  ...tach(5, 'dai', 'ĐMH ', 1, 12, 'Thực hiện phép tính (tính hợp lí nếu có thể)', [
    ['a', bt(R`165+56+35+24`)],
    ['b', bt(R`37.58-235+37.42`)],
    ['c', bt(R`2625:15-(7^5:7^3+2026^0).3`)]]),
  ...tach(5, 'dai', 'ĐMH ', 2, 12, R`Tìm các số tự nhiên $x$, biết`, [
    ['.1a', bt(R`15+x=42`)],
    ['.1b', bt(R`65-(73-2x)=36`)],
    ['.1c', bt(R`4^x+4^{x+1}=320`)],
    ['.1d', R`$x\in\text{Ư}(20)$ và $x$ là số nguyên tố.`]]),
  { phan: 5, kho: 'dai', nhom: 12, nhan: 'ĐMH Bài 2.2', noi_dung: R`Tìm các chữ số $a$ và $b$ sao cho số $\overline{82a4b}$ chia hết cho cả 2; 3 và 5.`, anh: [], canh_bao: [] },
  ...ca(5, 'dai', 'ĐMH ', 3, 12, R`Một buổi sáng cuối tuần, mẹ đưa cho Lan 500000 đồng và nhờ Lan đi siêu thị mua hoa quả và sữa. Lan đã mua 3 kg cam, 2 kg táo và 2 hộp sữa tươi. Biết rằng 1 kg cam có giá 60000 đồng, 1 kg táo có giá 50000 đồng.
a) Tính số tiền bạn Lan phải trả để mua số cam và số táo nói trên.
b) Biết rằng sau khi thanh toán các mặt hàng đã mua, Lan còn lại 150000 đồng. Hãy tính giá tiền 1 hộp sữa tươi bạn Lan đã mua.`),
  ...ca(5, 'hgt', 'ĐMH ', 4, 12, R`Một mảnh đất có dạng hình chữ nhật có chiều dài $50$ m, chiều rộng $40$ m. Người ta làm một sân khấu có dạng hình thang cân có kích thước như hình vẽ bên.
a) Tính diện tích mảnh đất và diện tích sân khấu.
b) Để trang trí sân khấu, người ta phải trả mỗi mét vuông sân khấu là 400000 đồng. Hỏi người ta phải chi hết bao nhiêu tiền để trang trí sân khấu?`,
    { anh: ['de_dmh_baiIV.png'], cb: [R`Đọc hình: hình chữ nhật, cạnh dọc ghi $50$ m, cạnh ngang ghi $40$ m; sân khấu hình thang cân sát cạnh trên của mảnh đất: đáy trên nằm trên cạnh trên, ghi $20$ m (nét đứt cong), đáy dưới ghi $16$ m, đường cao ghi $6$ m (có ô vuông góc vuông).`] }),
  ...ca(5, 'dai', 'ĐMH ', 5, 12, R`Với $n$ là số tự nhiên, hãy tìm chữ số tận cùng của biểu thức $A=5^{n+1}+5^n+4^{n+1}+4^n$.`,
    { cb: [R`Đề cho $n$ là số tự nhiên (gồm cả $n=0$): trường hợp $n=0$ cho chữ số tận cùng KHÁC với $n\ge 1$ — lời giải phải xét riêng $n=0$.`] }),
]

dung({
  MA: 'GV2-GKI-2026',
  TEN: 'Đề cương ôn tập giữa kì I Toán 6 năm 2026–2027 — Trường THCS Giảng Võ 2, Hà Nội',
  NGUON: 'Trường THCS Giảng Võ 2',
  FILE: 'Huong-dan-on-tap-giua-ki-1-Toan-6-Giang-Vo-2-2026.pdf',
  PHAN, CAU, LV, HERE,
})
