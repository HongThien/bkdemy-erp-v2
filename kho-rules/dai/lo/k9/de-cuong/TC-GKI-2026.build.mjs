// ============================================================================
// TC-GKI-2026.build.mjs — gõ lại "ĐỀ CƯƠNG GIỮA HỌC KÌ I — MÔN TOÁN — LỚP 9" THCS Thành Công (Tổ Tự nhiên, Hà Nội), năm học 2026–2027
// (PDF 4 trang, bản số — có lớp chữ nhưng công thức mất cấu trúc ⇒ đọc từ ẢNH; Thùy bỏ vào `Tài liệu tham khảo/K9/Đề cương/GKI` ngày 29/10.) → de.json (khung) + 6 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/TC-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_PBB2.png, de_PBB3.png, de_PBB4.png, de_PBB5.png, de_PCB4.png)
//
// CẤU TRÚC: A. PHẦN ĐẠI SỐ (Bài 1–19) · B. PHẦN HÌNH HỌC (Bài 1–10) · C. MỘT SỐ BÀI TẬP NÂNG CAO (Bài 1–4) — đánh số LẠI TỪ 1 ở mỗi phần ⇒ khoá câu = (phần, nhãn).
//   PHẦN 1 = A · PHẦN 2 = B · PHẦN 3 = C.
// Tách ý (k8.md §12.1): mỗi phương trình / hệ / ý ĐỘC LẬP một câu (A Bài 1, 2, 3 · A Bài 4 a–d · B Bài 1 a–b); bài lời văn + bài hình có chung dữ kiện ⇒ giữ cả bài.
// KHO: câu hình / lượng giác ⇒ `hinh_hoc` (chạy cổng với DANG_HINH_K9=HH00095). Bài lời văn / nâng cao ⇒ `dai`.
// CHỖ CẦN LƯU Ý: A Bài 4 (hàm số bậc nhất — lớp 8) · A Bài 13 (dung dịch: "gam" in thừa) · A Bài 16 (bảng điểm in thiếu cột Toán — đúng chủ ý) · B Bài 7c, 8, 9, 10 có chứng minh dùng hệ thức đường cao (phải tự suy từ đồng dạng).
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/TC-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
const ys = (phan, kho, bai, list) => list.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: nd, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const L = 'abcdefghijklmnopqrstuvwxyz'
// danh sách biểu thức đánh số 1)…n) ⇒ ý a…; lead chung đặt vào từng ý
const dsPT = (phan, bai, lead, exprs, ghiChu) => ys(phan, 'dai', bai, exprs.map((e, i) => [L[i], `${lead} $${e}$.`, i === 0 && ghiChu ? [ghiChu] : []]))
const dsHe = (phan, bai, lead, pairs, ghiChu) => ys(phan, 'dai', bai, pairs.map(([a, b], i) => [L[i], `${lead} ${he(a, b)}`, i === 0 && ghiChu ? [ghiChu] : []]))

const PHAN = [
  { thu_tu: 1, ten: 'A. Phần Đại số (Bài 1–19)' },
  { thu_tu: 2, ten: 'B. Phần Hình học (Bài 1–10)' },
  { thu_tu: 3, ten: 'C. Một số bài tập nâng cao (Bài 1–4)' },
]

const CAU = [
  // ───────────── A. ĐẠI SỐ ─────────────
  ...dsHe(1, 1, R`Giải hệ phương trình:`, [
    [R`3x+2y=4`, R`4x-y=9`],
    [R`2(x+1)+3(x+y)=15`, R`4(x-1)-(x+2y)=0`],
    [R`3(x+1)+2(x+2y)=4`, R`4(x+1)-(x+2y)=9`],
    [R`(x+4)(y+4)=xy+216`, R`(x+2)(y-2)=xy-50`],
    [R`\dfrac{2}{x}+\dfrac{1}{y}=2`, R`\dfrac{8}{x}-\dfrac{3}{y}=1`],
    [R`\dfrac{2}{x-1}+\dfrac{1}{y+2}=2`, R`\dfrac{8}{x-1}-\dfrac{3}{y+2}=1`],
    [R`\dfrac{1}{x+y}-\dfrac{2}{x-y}=-3`, R`\dfrac{3}{x+y}+\dfrac{4}{x-y}=2`],
    [R`\dfrac{1}{x+y}+3(y+1)=5`, R`\dfrac{2}{x+y}-5(y+1)=-1`]],
    R`Bài 1 của đề cương in 8 hệ đánh số 1)–8); nhập thành các ý a–h theo đúng thứ tự (các bài 2, 3 cũng vậy).`),
  ...dsPT(1, 2, R`Giải phương trình:`, [
    R`(x+2)(3-3x)=0`, R`(2x-7)(x+13)=0`, R`(3x-4)(x+1)(2x-1)=0`, R`(x+1)^2(x+2)=0`,
    R`x(2x-1)+5(2x-1)=0`, R`3x(x-5)+6(x-5)=0`, R`(3x-2)^2-25=0`, R`x(3x+5)-6x-10=0`,
    R`(x-1)^2+4x-4=0`, R`(2x+3)^2=(x-5)^2`, R`2(3x+1)^2=(3x+1)(x-2)`, R`(x-2)(7-3x)=(3x-7)(8x+32)`,
    R`(6x-7)(3x+4)=(7-6x)(x-1)`, R`(x-1)^2+x^2-1=(x-1)(x+3)`]),
  ...dsPT(1, 3, R`Giải phương trình:`, [
    R`\dfrac{1}{3x}+\dfrac{1}{2x}=\dfrac{1}{4}`, R`\dfrac{5}{x+2}=3`, R`\dfrac{x^2-6}{x}=x+\dfrac{3}{2}`,
    R`\dfrac{2x-5}{x+5}=3`, R`\dfrac{3}{2}=6-\dfrac{x+10}{x-3}`, R`\dfrac{2x-1}{x-1}+1=\dfrac{1}{x-1}`,
    R`\dfrac{(x+2)^2}{2x-3}-1=\dfrac{x^2+10}{2x-3}`, R`\dfrac{2}{x-3}=\dfrac{1}{x+2}`, R`\dfrac{x+2}{x-1}-\dfrac{1}{x}=\dfrac{1}{x(x-1)}`,
    R`\dfrac{x+1}{x-1}+\dfrac{x-1}{x+1}=\dfrac{4}{(x+1)(x-1)}`, R`\dfrac{2}{x+1}-\dfrac{3}{x+2}=\dfrac{1}{3(x+1)}`, R`\dfrac{2}{x-2}+\dfrac{1}{x+2}=\dfrac{3}{x^2-4}`,
    R`\dfrac{x-3}{x-1}=\dfrac{x-4}{x^2-4x}+\dfrac{x+1}{x}`, R`\dfrac{x+1}{2x-2}-\dfrac{x-1}{2x+2}+\dfrac{2x}{(1-x)(x+1)}=0`, R`\dfrac{x-1}{x-5}-\dfrac{4x}{x+5}=\dfrac{9x-5}{x^2-25}`,
    R`\dfrac{2x-5}{x+4}+\dfrac{x}{4-x}=\dfrac{-17x+56}{x^2-16}`, R`\dfrac{1}{x+1}-\dfrac{x}{x^2-x+1}=\dfrac{3x}{x^3+1}`, R`\dfrac{1}{x-1}-\dfrac{4x}{x^3-1}=\dfrac{x}{x^2+x+1}`]),
  ...ys(1, 'dai', 4, [
    ['a', R`Tìm $a$, $b$ để đường thẳng $y=ax+b$ đi qua hai điểm $A(-5;3)$ và $B\left(\dfrac{3}{2};-1\right)$.`, [R`Bài 4 của đề cương có 4 ý a–d độc lập (hàm số bậc nhất, lớp 8) ⇒ nhập thành 4 câu Bài 4a–4d.`]],
    ['b', R`Viết phương trình đường thẳng đi qua hai điểm $M(2;1)$ và $N(5;-1)$.`],
    ['c', R`Tìm tọa độ giao điểm của đường thẳng $(d)$: $2x-3y=-5$ và đường thẳng $(d')$: $-3x+4y=2$.`],
    ['d', R`Cho $d_1: y=x-4$, $d_2: y=2x+3$ và $d_3: y=mx+m+1$. Tìm $m$ để ba đường thẳng trên đồng quy.`]]),
  ...ca(1, 'dai', 5, R`Cô Linh chia số tiền $500$ triệu đồng của mình cho hai khoản đầu tư. Sau một năm, tổng số tiền lãi thu được là $28$ triệu đồng. Lãi suất cho khoản đầu tư thứ nhất là $5\%$/năm và khoản đầu tư thứ hai là $6\%$/năm. Tính số tiền cô Linh đầu tư cho mỗi khoản.`),
  ...ca(1, 'dai', 6, R`Tổng giá niêm yết của một chiếc máy lọc nước và một chiếc nồi cơm điện là $8$ triệu đồng. Bác Bình mua hàng vào dịp tri ân khách hàng nên so với giá niêm yết máy lọc nước được giảm giá $10\%$ và nồi cơm điện được giảm giá $15\%$. Do đó, tổng số tiền bác Bình phải trả là $7{,}05$ triệu đồng. Tìm giá niêm yết của mỗi sản phẩm đã nêu.`),
  ...ca(1, 'dai', 7, R`Hai công nhân cùng làm một công việc trong $18\ \text{h}$ thì xong. Nếu người thứ nhất làm trong $6\ \text{h}$ và người thứ hai làm trong $12\ \text{h}$ thì hoàn thành được $50\%$ công việc. Hỏi nếu làm riêng thì mỗi người hoàn thành công việc trong bao lâu?`),
  ...ca(1, 'dai', 8, R`Một ca nô đi từ $A$ đến $B$ với vận tốc và thời gian dự định. Nếu ca nô tăng vận tốc thêm $3\ \text{km/h}$ thì thời gian rút ngắn được $2$ giờ. Nếu ca nô giảm vận tốc đi $3\ \text{km/h}$ thì thời gian tăng $3$ giờ. Tính vận tốc và thời gian dự định của ca nô.`),
  ...ca(1, 'dai', 9, R`Hai xe máy khởi hành cùng một lúc từ $A$ đến $B$. Vận tốc xe I là $45\ \text{km/h}$. Vận tốc xe II ít hơn vận tốc xe I là $9\ \text{km/h}$ nên xe II đến $B$ chậm hơn xe I là $40$ phút. Tính quãng đường $AB$.`),
  ...ca(1, 'dai', 10, R`Lớp $9A$ có $40$ học sinh giỏi và học sinh tiên tiến. Nhà trường trao thưởng cho mỗi học sinh giỏi $10$ quyển vở, mỗi học sinh tiên tiến $5$ quyển vở. Tính số học sinh giỏi, học sinh tiên tiến của lớp $9A$ biết rằng lớp $9A$ được thưởng $325$ quyển vở?`),
  ...ca(1, 'dai', 11, R`Một mảnh đất hình chữ nhật có chu vi bằng $80\ \text{m}$. Nếu giảm chiều rộng $3\ \text{m}$ và tăng chiều dài $8\ \text{m}$ thì diện tích tăng thêm $32\ \text{m}^2$. Tính chiều dài và chiều rộng mảnh đất ban đầu?`),
  ...ca(1, 'dai', 12, R`Trong một phòng họp hình chữ nhật, ghế được sắp xếp theo hàng và số ghế trong mỗi hàng là như nhau. Nếu kê bớt đi $2$ hàng và mỗi hàng bớt đi $2$ ghế thì tổng số ghế trong mỗi phòng họp đó giảm đi $80$ ghế so với ban đầu. Nếu kê thêm $1$ hàng và mỗi hàng kê thêm $2$ ghế thì tổng số ghế trong mỗi phòng họp lúc đó tăng thêm $68$ ghế so với ban đầu. Tính số hàng ghế và số ghế trong phòng họp lúc ban đầu.`),
  ...ca(1, 'dai', 13, R`Dung dịch oxi già chứa chất tan là hydrogen peroxide, có tác dụng làm sạch vết thương, làm sạch hốc tủy hay ống chân răng, vệ sinh loại bỏ ráy tai… Hỏi cần phải trộn bao nhiêu gam dung dịch hydrogen peroxide $30\%$ với dung dịch hydrogen peroxide $1{,}5\%$ để được $300\ \text{g}$ dung dịch hydrogen peroxide $15\%$.`,
    { cb: [R`Đề in "Hỏi cần phải trộn gam bao nhiêu dung dịch…" (chữ "gam" đặt sai chỗ) ⇒ sửa thành "trộn bao nhiêu gam dung dịch…".`] }),
  ...ca(1, 'dai', 14, R`Một tổ sản xuất theo kế hoạch mỗi ngày phải sản xuất $40$ sản phẩm. Khi thực hiện, nhờ cải tiến kỹ thuật nên mỗi ngày tổ sản xuất được $45$ sản phẩm. Do đó không những tổ hoàn thành trước kế hoạch $1$ ngày mà còn vượt mức $10$ sản phẩm. Hỏi theo kế hoạch tổ phải sản xuất bao nhiêu sản phẩm?`),
  ...ca(1, 'dai', 15, R`Do ảnh hưởng của bão Yagi, Ngân đã kêu gọi người thân và bạn bè quyên góp được $10\,000\,000$ đồng và dự định mua gạo và mì gói dành tặng cho những đồng bào bị thiệt hại. Ngân đã mua $10$ bao gạo giá $650\,000$ đồng/bao, số tiền còn lại Ngân mua mì gói. Hỏi Ngân có thể mua tối đa bao nhiêu thùng mì, biết $1$ thùng mì giá $150\,000$ đồng?`),
  ...ca(1, 'dai', 16, R`Trong một kì thi, bạn Chiến phải thi bốn môn Văn, Toán, Tiếng Anh và Hóa. Chiến đã thi ba môn và được kết quả như bảng sau:
Môn: Văn — Tiếng Anh — Hóa
Điểm: $8$ — $7$ — $10$
Kì thi quy định muốn đạt loại giỏi phải có điểm trung bình các môn thi là $8$ trở lên và không có môn nào bị điểm dưới $6$. Biết môn Văn và Toán được tính hệ số $2$. Hãy cho biết, để đạt loại giỏi bạn Chiến phải có điểm thi môn Toán ít nhất là bao nhiêu?`,
    { cb: [R`Bảng điểm trong đề in 3 cột (Văn, Tiếng Anh, Hóa) — môn Toán là điều phải tìm; đã chuyển bảng thành hai dòng chữ.`] }),
  ...ca(1, 'dai', 17, R`Tổng chi phí của một doanh nghiệp sản xuất áo sơ mi là $390$ triệu đồng/tháng. Giá bán của mỗi chiếc áo sơ mi là $380$ nghìn đồng. Hỏi trung bình mỗi tháng doanh nghiệp phải bán được ít nhất bao nhiêu chiếc áo sơ mi để thu được lợi nhuận ít nhất là $1{,}02$ tỉ đồng sau $1$ năm?`),
  ...ca(1, 'dai', 18, R`Để lập đội tuyển năng khiếu về bóng rổ của trường, thầy giáo môn Thể dục đưa ra quy định tuyển chọn như sau: mỗi bạn dự tuyển sẽ được ném đúng $20$ quả bóng vào rổ, mỗi quả bóng vào rổ được cộng $3$ điểm; mỗi quả bóng ném ra ngoài bị trừ $1$ điểm. Nếu bạn nào có số điểm từ $28$ điểm trở lên sẽ được vào đội tuyển. Hỏi một học sinh muốn được chọn vào đội tuyển thì phải ném ít nhất bao nhiêu quả bóng vào rổ.`),
  ...ca(1, 'dai', 19, R`Sau Tết Nga có $1\,500\,000$ đồng tiền lì xì. Mỗi ngày Nga để dành được $25\,000$ đồng, Nga muốn mua một chiếc xe đạp trị giá $3\,280\,000$ đồng. Hỏi Nga phải để dành ít nhất bao nhiêu ngày thì đủ tiền mua xe?`),

  // ───────────── B. HÌNH HỌC ─────────────
  ...ys(2, 'hinh_hoc', 1, [
    ['a', R`Tính giá trị của biểu thức: $A=\cos 22^\circ-\dfrac{\tan 67^\circ}{\cot 23^\circ}-\sin 68^\circ$.`, [R`Bài 1 của đề cương có hai ý a, b độc lập (tính giá trị biểu thức) ⇒ nhập thành Bài 1a, 1b.`]],
    ['b', R`Tính giá trị của biểu thức: $C=\sin^2 33^\circ-\dfrac{\sin 29^\circ}{\cos 61^\circ}-\dfrac{1}{2}\cdot\cos 60^\circ+\sin^2 57^\circ$.`]]),
  ...ca(2, 'hinh_hoc', 2, R`Một con thuyền cách bờ biển $30\ \text{m}$ nhìn thấy ánh sáng từ ngọn hải đăng nằm sát bờ biển. Biết rằng tia sáng từ ngọn hải đăng hợp với phương thẳng đứng một góc bằng $65^\circ$. Tính chiều cao của ngọn hải đăng. (Kết quả làm tròn đến chữ số thập phân thứ hai).`, { anh: ['de_PBB2.png'] }),
  ...ca(2, 'hinh_hoc', 3, R`Hình bên đây là hình ảnh biển báo giao thông cảnh báo đường dốc. Độ dốc của đường ($i\%$) được tính theo công thức $i=\dfrac{H}{L}\cdot100\%$, trong đó $H$ là độ cao theo phương thẳng đứng, $L$ là độ dài theo phương nằm ngang. Hỏi con dốc có biển báo $10\%$ nghiêng bao nhiêu độ so với phương nằm ngang? (Kết quả làm tròn đến độ).`, { anh: ['de_PBB3.png'] }),
  ...ca(2, 'hinh_hoc', 4, R`Thang xếp chữ $A$ gồm hai thang đơn tựa vào nhau. Khi mở thang để sử dụng, nó tạo thành một tam giác $ABC$ cân tại $A$ (xem hình vẽ bên). Để an toàn, người ta đặt mỗi thang đơn tạo với mặt đất một góc $65^\circ$, khi đó thang ở độ cao $AH=2\ \text{m}$. Hỏi độ dài của mỗi thang đơn là bao nhiêu mét? (Kết quả làm tròn đến chữ số thập phân thứ hai).`, { anh: ['de_PBB4.png'] }),
  ...ca(2, 'hinh_hoc', 5, R`Tính chiều cao của một ngọn núi (kết quả làm tròn đến hàng đơn vị), biết tại hai điểm $A$, $B$ cách nhau $500\ \text{m}$, người ta nhìn thấy đỉnh núi với góc nâng lần lượt là $34^\circ$ và $38^\circ$.`, { anh: ['de_PBB5.png'] }),
  ...ca(2, 'hinh_hoc', 6, R`Cho tam giác $ABC$ nhọn, đường cao $AK$.
a) Giải tam giác $ACK$ biết $\widehat{C}=30^\circ$, $AK=3\ \text{cm}$.
b) Chứng minh $AK=\dfrac{BC}{\cot B+\cot C}$.
c) Biết $BC=5\ \text{cm}$, $\widehat{B}=68^\circ$, $\widehat{C}=30^\circ$. Tính diện tích tam giác $ABC$ (làm tròn chữ số thập phân thứ nhất).`),
  ...ca(2, 'hinh_hoc', 7, R`Cho tam giác $ABC$ vuông tại $A$ với đường cao $AH$.
a) Hãy tính $\cos C$ theo hai cách và suy ra $AC^2=BC\cdot HC$.
b) Tính $\tan\widehat{ABH}$ và $\tan\widehat{CAH}$, suy ra $AH^2=BH\cdot CH$.
c) Chứng minh rằng: $\dfrac{1}{AH^2}=\dfrac{1}{AB^2}+\dfrac{1}{AC^2}$.`),
  ...ca(2, 'hinh_hoc', 8, R`Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$.
a) Tính $AC$, $AB$ biết $\widehat{C}=30^\circ$, $AH=3\ \text{cm}$.
b) Trên cạnh $AC$ lấy điểm $K$ ($K\ne A$, $K\ne C$), gọi $D$ là hình chiếu của $A$ trên $BK$. Chứng minh rằng: $BD\cdot BK=BH\cdot BC$.
c) Chứng minh góc $BDH$ bằng góc $BAH$.
d) Tam giác $ABC$ cần thỏa mãn điều kiện gì để $S_{BHD}=\dfrac{1}{4}S_{BKC}\cos^2\widehat{ABD}$.`),
  ...ca(2, 'hinh_hoc', 9, R`Cho $\triangle ABC$ vuông tại $A$ có $AB<AC$. Kẻ $AH\perp BC$ tại $H$.
a) Cho biết $AB=3\ \text{cm}$, $BC=6\ \text{cm}$. Tính $BH$ và góc $B$.
b) Qua $B$ kẻ đường thẳng song song với $AH$ cắt $CA$ tại $K$. Chứng minh: $BK^2=KA\cdot KC$.
c) Vẽ $AM\perp BK$ tại $M$. Chứng minh rằng: $\triangle BMH$ đồng dạng $\triangle BCK$ và $\dfrac{S_{BMH}}{S_{BCK}}=\sin^2 K\cdot\sin^2 C$.`),
  ...ca(2, 'hinh_hoc', 10, R`Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$.
a) Giả sử $AB=6\ \text{cm}$; $AC=8\ \text{cm}$. Hãy tính độ số đo $\widehat{ACB}$ và $AH$ (số đo góc làm tròn đến phút).
b) Gọi điểm $E$ và $F$ lần lượt là hình chiếu của điểm $H$ trên cạnh $AB$ và $AC$. Chứng minh rằng $AE\cdot AB=AF\cdot AC$ từ đó suy ra $\widehat{AFE}=\widehat{ABC}$.
c) Đường trung tuyến $AI$ của tam giác $ABC$ cắt cạnh $EF$ tại điểm $K$. Chứng minh rằng $\cos^3 B\cdot\sin B=\dfrac{KF}{BC}$.`),

  // ───────────── C. NÂNG CAO ─────────────
  ...ca(3, 'dai', 1, R`Tìm các số nguyên $x$ và $y$ thỏa mãn phương trình $x^2+xy-2y-x-5=0$.`),
  ...ca(3, 'dai', 2, R`Giải phương trình $\dfrac{x+1}{x(x+2)}+\dfrac{x+6}{x^2+12x+35}=\dfrac{x+2}{x^2+4x+3}+\dfrac{x+5}{x^2+10x+24}$.`),
  ...ca(3, 'dai', 3, R`Một người nông dân muốn rào một khu đất hình chữ nhật có chu vi $60\ \text{m}$ để xây dựng một vườn hoa. Với chiều rộng của khu đất là $x$ ($\text{m}$), tìm $x$ để diện tích vườn hoa xây được lớn nhất.`),
  ...ca(3, 'dai', 4, R`Mảnh đất của nhà bác An có dạng hình tam giác vuông với hai cạnh góc vuông dài $60\ \text{m}$ và $40\ \text{m}$ (như hình vẽ bên). Bác An muốn làm một khu vườn có dạng hình chữ nhật để trồng hoa, sao cho một đỉnh của hình chữ nhật trùng với đỉnh góc vuông, hai cạnh nằm trên hai cạnh góc vuông của tam giác và đỉnh đối diện với đỉnh đó nằm trên cạnh huyền. Tìm kích thước của khu vườn hình chữ nhật để diện tích của nó đạt giá trị lớn nhất.`, { anh: ['de_PCB4.png'] }),
]

// 6 tệp khung: A Bài 1 · A Bài 2 · A Bài 3–4 · A Bài 5–19 · B (Hình) · C
const NHOM = [[1, 1, 1], [1, 2, 2], [1, 3, 4], [1, 5, 19], [2, 1, 10], [3, 1, 4]]

dung({ MA: 'TC-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS Thành Công (Hà Nội)', NGUON: 'le', NAM: 2026,
  FILE: 'de-cuong-giua-hoc-ki-1-toan-9-nam-2026-2027-truong-thcs-thanh-cong-ha-noi.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP: [] })
