// ============================================================================
// NS-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG "HƯỚNG DẪN ÔN TẬP GIỮA HỌC KÌ I — KHỐI 9" (2026–2027) — Trường THCS & THPT Nguyễn Siêu (Hà Nội)
// (PDF 4 trang BẢN SCAN Thùy gửi 13/10: A. Đại số 22 bài · B. Hình học 10 bài · C. Bài tập tham khảo và nâng cao 5 bài) → de.json (khung) + 9 tệp khung.
//
//   node kho-rules/dai/lo/k9/de-cuong/NS-GKI-2026.build.mjs <thư mục làm việc>
//   (cần <LV>/goc.pdf + <LV>/img/de_A12.png, de_A13.png, de_B6.png, de_B7.png, de_B8.png)
//
// KIẾN THỨC TRỌNG TÂM (đề ghi): Chương I; chương II; chương IV
//   = phương trình và hệ hai phương trình bậc nhất hai ẩn · phương trình tích, phương trình chứa ẩn ở mẫu, bất đẳng thức, bất phương trình bậc nhất một ẩn
//   · hệ thức lượng trong tam giác vuông (tỉ số lượng giác, hệ thức giữa cạnh và góc).  ⇒ CHƯA có: căn thức (chương III), đường tròn (chương V), công thức nghiệm / Viète.
// Tách ý (k8.md §12.1): chỉ ý có dữ kiện RIÊNG và không dùng kết quả ý khác (A: Bài 1–4, 6–9 · B: Bài 1, 2 · C: Bài 1, 2); bài chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài.
// Đề cương đánh số bài LẠI TỪ 1 ở mỗi phần ⇒ nhãn chỉ duy nhất trong phần (dc-lib khoá theo (phần, nhãn)).
//
// CHỖ ĐỀ CƯƠNG IN THIẾU / IN SAI (đã phóng to 260 dpi đọc lại từng chỗ — xem các dòng Ghi chú / CHƯA CHẮC bên dưới):
//   · A Bài 2a: phương trình thứ nhất KHÔNG có vế phải · A Bài 8b: KHÔNG có dấu bất đẳng thức và vế phải  ⇒ không giải được, KHÔNG nhập (chờ CEO bổ sung đề) — xem KHONG_NHAP.
//   · A Bài 6a, b, c: thiếu "= 0" · A Bài 4b: thừa "y =" · A Bài 5: dấu căn trùm cả "2x" · A Bài 10: "mx+4)y=9" · A Bài 6h, i, j: nghi sai số mũ
//   · C Bài 1a, b, c + ý cuối không nhãn: bất đẳng thức in sai (đúng như in thì SAI với a=b=1) · C Bài 2: lời dẫn in "Tính giá trị của biểu thức" cho hai bất đẳng thức
//   · Hình B Bài 9, B Bài 10, C Bài 4 lệch lời văn ⇒ KHÔNG đưa vào đề (trạm soạn vẽ hình giải theo lời văn).
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NS-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const he = (a, b) => `$\\begin{cases} ${a} \\\\ ${b} \\end{cases}$.`
const CC = (s) => 'CHƯA CHẮC — ' + s
const tach = (phan, kho, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [], ...(o.lap ? { lap: o.lap } : {}) }]

// Hai ý KHÔNG nhập vì đề cương in thiếu hẳn một vế (không có gì để giải) — báo CEO, bổ sung đề rồi thêm sau.
const KHONG_NHAP = [
  { nhan: 'A. Bài 2a', in: R`$\begin{cases} \dfrac{x+y}{2}+\dfrac{x-y}{4} \\ \dfrac{x}{3}-\dfrac{y}{5}=1 \end{cases}$`, ly_do: 'phương trình thứ nhất in thiếu dấu "=" và vế phải' },
  { nhan: 'A. Bài 8b', in: R`$\dfrac{3x-17}{20}-\dfrac{5x+1}{15}$`, ly_do: 'in thiếu dấu bất đẳng thức và vế phải' },
]

const PHAN = [
  { thu_tu: 1, ten: 'A. Đại số (Bài 1–22)' },
  { thu_tu: 2, ten: 'B. Hình học (Bài 1–10)' },
  { thu_tu: 3, ten: 'C. Bài tập tham khảo và nâng cao (Bài 1–5)' },
]

const THIEU0 = [R`Đề cương in thiếu "$=0$" ở ý này (chỉ in vế trái, các ý d–k cùng bài đều có "$=0$"); đã nhập thêm "$=0$".`]

const CAU = [
  // ───────────────────────── A. ĐẠI SỐ ─────────────────────────
  ...tach(1, 'dai', 1, R`Giải hệ phương trình:`, [
    ['a', he(R`3x+2y=6`, R`2x-2y=14`)],
    ['b', he(R`0{,}3x+0{,}5y=3`, R`1{,}5x-2y=1{,}5`)],
    ['c', he(R`-2x+6y=8`, R`3x-9y=-12`)],
    ['d', he(R`2x-3y=-5`, R`x+3y=11`)],
    ['e', he(R`3x+2y=7`, R`2x+3y=3`)],
    ['f', he(R`2x-5y=-14`, R`2x+3y=2`)],
    ['g', he(R`4x+5y=15`, R`6x-4y=11`)],
    ['h', he(R`x-3y=5`, R`-2x+6y=10`)]]),
  ...tach(1, 'dai', 2, R`Giải hệ phương trình:`, [
    ['b', he(R`\dfrac{1}{x}+\dfrac{1}{y}=-1`, R`\dfrac{3}{x}-\dfrac{2}{y}=7`), [R`Bài 2 của đề cương có 6 ý a–f; ý a) in thiếu vế phải của phương trình thứ nhất ($\dfrac{x+y}{2}+\dfrac{x-y}{4}$ rồi hết) nên KHÔNG nhập — chờ bổ sung đề.`]],
    ['c', he(R`\dfrac{7}{x+2}+\dfrac{3}{y}=2`, R`\dfrac{1}{x+2}+\dfrac{1}{y}=\dfrac{5}{2}`)],
    ['d', he(R`6(x+y)=8+2x-3y`, R`5(y-x)=5+3x+2y`)],
    ['e', he(R`(x-2)(y+1)=xy`, R`(x+8)(y-2)=xy`)],
    ['f', he(R`(x-1)(y-2)=(x+1)(y-3)`, R`(x-5)(y+4)=(x-4)(y+1)`)]]),
  ...tach(1, 'dai', 3, R`Xác định $a,\ b$ để đồ thị của hàm số $y=ax+b$ đi qua hai điểm $A$ và $B$, biết:`, [
    ['a', R`$A(2;1)$ và $B(4;-2)$.`],
    ['b', R`$A(1;2)$ và $B(3;8)$.`],
    ['c', R`$A(5;-2)$ và $B(-2;-11)$.`]]),
  ...tach(1, 'dai', 4, R`Xác định toạ độ giao điểm của hai đường thẳng:`, [
    ['a', R`$(d)\colon y=x-2$ và $(d')\colon y=2x+1$.`],
    ['b', R`$(d)\colon x+y+1=0$ và $(d')\colon x-2y+4=0$.`, [CC(R`đề cương in "$(d)\colon y=x+y+1=0$" (thừa "$y=$"); đã nhập $(d)\colon x+y+1=0$ (cùng dạng với $(d')$ và ý c). Nếu ý đề là $(d)\colon y=x+1$ thì giao điểm là $(2;3)$.`)]],
    ['c', R`$(d)\colon x-3y+5=0$ và $(d')\colon 2x+y-18=0$.`]]),
  ...ca(1, 'dai', 5, R`Cho ba đường thẳng $(d_1)\colon x-2y=-3$; $(d_2)\colon \sqrt{2}x+y=\sqrt{2}+2$; $(d_3)\colon mx-(1-2m)y=5-m$. Xác định tham số $m$ để ba đường thẳng đồng quy.`,
    { cb: [R`Đề cương in dấu căn trùm cả "$2x$" ($\sqrt{2x}+y=\sqrt{2}+2$); vì $(d_2)$ là đường thẳng nên đã nhập $\sqrt{2}x+y=\sqrt{2}+2$.`] }),
  ...tach(1, 'dai', 6, R`Giải phương trình:`, [
    ['a', bt(R`2x(3x-1)-(3x-1)=0`), THIEU0],
    ['b', bt(R`3(x-5)(x+2)-x^2-5x=0`), [...THIEU0, CC(R`đúng như in, vế trái thu gọn thành $2x^2-14x-30$ nên nghiệm vô tỉ $x=\dfrac{7\pm\sqrt{109}}{2}$; rất có thể đề gốc là $3(x-5)(x+2)-x^2+5x=0$ (khi đó đặt được nhân tử chung $x-5$, nghiệm $x=5$ và $x=-3$). Giải theo bản in.`)]],
    ['c', bt(R`(x-1)(2x+3)+2x-2=0`), THIEU0],
    ['d', bt(R`(3x-2)^2-(x+6)^2=0`)],
    ['e', bt(R`\dfrac{7-x}{2}+\dfrac{2}{3}(x-7)(x-3)=0`)],
    ['f', bt(R`(2x-1)^2+(-3)(2x-1)=0`)],
    ['g', bt(R`3x^2-11x+6=0`)],
    ['h', bt(R`2x^2+3x^2-5=0`), [CC(R`đề cương in $2x^2+3x^2-5=0$ (hai hạng tử cùng bậc hai — đã phóng to đọc lại); nghi sai số mũ, có thể là $2x^3+3x^2-5=0$ (khi đó nghiệm duy nhất $x=1$). Giải theo bản in.`)]],
    ['i', bt(R`x^2-4x^2+4-x=0`), [CC(R`đề cương in $x^2-4x^2+4-x=0$ (đã phóng to đọc lại); nghi sai số mũ, có thể là $x^3-4x^2+4-x=0$ (khi đó $x=4$, $x=1$, $x=-1$). Giải theo bản in.`)]],
    ['j', bt(R`x^4-8x^2-9x^3=0`), [CC(R`đề cương in $x^4-8x^2-9x^3=0$ (đã phóng to đọc lại) — ra nghiệm vô tỉ; nghi in thừa, có thể là $x^4-8x^2-9=0$ (khi đó $x=3$, $x=-3$). Giải theo bản in.`)]],
    ['k', bt(R`x^4+2x^3+5x^2+4x-12=0`)],
    ['l', bt(R`\dfrac{5x}{x-2}=7+\dfrac{10}{x-2}`)],
    ['m', bt(R`\dfrac{x^2-6}{x}=x+\dfrac{3}{2}`)],
    ['n', bt(R`\dfrac{x+3}{x-2}+\dfrac{x+2}{x-3}=2`)],
    ['o', bt(R`\dfrac{x+2}{x-2}-\dfrac{x-2}{x+2}=\dfrac{16}{x^2-4}`)]]),
  ...tach(1, 'dai', 7, R`Giải bất phương trình:`, [
    ['a', bt(R`6<x-3`)],
    ['b', bt(R`-8x+1\ge5`)],
    ['c', bt(R`x-7<2-x`)],
    ['d', bt(R`x+2\le2+3x`)],
    ['e', bt(R`-x+7\ge x-3`)],
    ['f', bt(R`3x+2>2x+3`)],
    ['g', bt(R`5x+4<-3x-2`)],
    ['h', bt(R`\dfrac{2}{3}(2x+3)<7-4x`)],
    ['i', bt(R`\dfrac{1}{2}(x-3)\le3-2x`)],
    ['j', bt(R`\dfrac{8-3x}{2}-x<5`)],
    ['k', bt(R`0{,}7x+\dfrac{6+4x}{3}>0`)],
    ['l', bt(R`0{,}7x+\dfrac{2x-4}{3}-\dfrac{x}{6}>1`)]]),
  ...tach(1, 'dai', 8, R`Tìm số nguyên lớn nhất thoả mãn bất phương trình:`, [
    ['a', bt(R`9-5x>1{,}5`), [R`Bài 8 của đề cương có 2 ý; ý b) in thiếu dấu bất đẳng thức và vế phải ($\dfrac{3x-17}{20}-\dfrac{5x+1}{15}$ rồi hết) nên KHÔNG nhập — chờ bổ sung đề.`]]]),
  ...tach(1, 'dai', 9, R`Tìm nghiệm chung của hai bất phương trình:`, [
    ['a', R`$15x-4>8$ và $7-6x>-20$.`],
    ['b', R`$\dfrac{2}{3}x+5>9$ và $\dfrac{x-18}{7}>1$.`]]),
  ...ca(1, 'dai', 10, R`Cho hệ phương trình $\begin{cases} mx+4y=9 \\ x+my=8 \end{cases}$. Với giá trị nào của $m$ thì hệ phương trình có nghiệm $(x;y)$ thoả mãn $2x+y+\dfrac{38}{m^2-4}=3$?`,
    { cb: [R`Đề cương in phương trình thứ nhất là "$mx+4)y=9$" (lỗi gõ dấu ngoặc); đã nhập $mx+4y=9$ (khớp mẫu số $m^2-4$ của điều kiện).`] }),
  ...ca(1, 'dai', 11, R`Cho phương trình $5x-4=3m+2$ $(1)$, trong đó $x$ là ẩn số, $m$ là một số cho trước. Tìm giá trị của $m$ để phương trình $(1)$ có nghiệm dương.`),
  ...ca(1, 'dai', 12, R`Bác An có một mảnh đất hình chữ nhật với chiều dài $14\ \text{m}$ và chiều rộng $12\ \text{m}$. Bác dự định xây nhà trên mảnh đất đó và dành một phần diện tích để làm sân vườn như hình vẽ. Biết diện tích đất làm nhà là $100\ \text{m}^2$. Hỏi $x$ bằng bao nhiêu mét?`,
    { anh: ['de_A12.png'], cb: [R`Đề cương in "Bác có định xây nhà" (lỗi gõ); đã nhập "Bác dự định xây nhà".`] }),
  ...ca(1, 'dai', 13, R`Một mảnh đất có dạng hình chữ nhật với chu vi bằng $52\ \text{m}$. Trên mảnh đất đó, người ta làm vườn rau có dạng hình chữ nhật với diện tích là $112\ \text{m}^2$ và một lối đi xung quanh vườn rộng $1\ \text{m}$. Tính các kích thước của mảnh đất đó.`,
    { anh: ['de_A13.png'] }),
  ...ca(1, 'dai', 14, R`Hai người cùng làm chung một công việc thì xong trong $8$ giờ. Hai người cùng làm được $4$ giờ thì người thứ nhất bị điều đi làm công việc khác. Người thứ hai tiếp tục làm việc trong $12$ giờ nữa thì xong công việc. Gọi $x$ là thời gian người thứ nhất làm một mình xong công việc (đơn vị tính là giờ, $x>0$).
a) Hãy biểu thị theo $x$: khối lượng công việc mà người thứ nhất làm được trong $1$ giờ; khối lượng công việc mà người thứ hai làm được trong $1$ giờ.
b) Hãy lập phương trình theo $x$ và giải phương trình đó. Sau đó cho biết, nếu làm một mình thì mỗi người phải làm trong bao lâu mới xong công việc.`),
  ...ca(1, 'dai', 15, R`Một ca nô đi xuôi dòng từ địa điểm $A$ đến địa điểm $B$, rồi lại đi ngược dòng từ địa điểm $B$ trở về địa điểm $A$. Thời gian cả đi và về là $3$ giờ. Tính tốc độ của dòng nước. Biết tốc độ của ca nô khi nước yên lặng là $27\ \text{km/h}$ và độ dài quãng đường $AB$ là $40\ \text{km}$.`),
  ...ca(1, 'dai', 16, R`Một người đi xe đạp từ $A$ đến $B$ cách nhau $60\ \text{km}$. Sau $1$ giờ $40$ phút, một xe máy cũng đi từ $A$ đến $B$ và đến $B$ sớm hơn xe đạp $1$ giờ. Tính tốc độ của mỗi xe, biết rằng tốc độ của xe máy gấp $3$ lần tốc độ của xe đạp.`),
  ...ca(1, 'dai', 17, R`Một xe máy đi từ $A$ đến $B$ trong thời gian dự định. Nếu đi với vận tốc $45\ \text{km/h}$ thì sẽ tới $B$ chậm mất nửa giờ. Nếu đi với vận tốc $60\ \text{km/h}$ thì sẽ đến $B$ sớm hơn $45$ phút. Tính quãng đường $AB$ và thời gian dự định.`),
  ...ca(1, 'dai', 18, R`Một xí nghiệp dự định chia đều 12 600 000 đồng để thưởng cho các công nhân tham gia hội thao nhân ngày thành lập xí nghiệp. Khi đến ngày hội thao chỉ có $80\%$ số công nhân tham gia, vì thế mỗi người tham gia hội thao được nhận thêm 105 000 đồng. Tính số công nhân dự định tham gia lúc đầu.`),
  ...ca(1, 'dai', 19, R`Bạn Hoa dự định dùng hết số tiền $600$ nghìn đồng để mua một số chiếc áo đồng giá tặng các bạn có hoàn cảnh khó khăn. Khi đến cửa hàng, loại áo mà bạn Hoa dự định mua được giảm giá $30$ nghìn đồng/chiếc. Do vậy bạn Hoa đã mua số lượng áo gấp $1{,}25$ lần so với số lượng dự định. Tính giá tiền mỗi chiếc áo mà bạn Hoa đã mua.`),
  ...ca(1, 'dai', 20, R`Một trường tổ chức cho học sinh đi tham quan bằng ô tô. Nếu xếp mỗi xe $40$ học sinh thì còn thừa $5$ học sinh. Nếu xếp mỗi xe $41$ học sinh thì xe cuối cùng thiếu $3$ học sinh. Hỏi có bao nhiêu học sinh đi tham quan và có bao nhiêu ô tô?`,
    { cb: [CC(R`đề cương in "xe cuối cùng nhiều 3 học sinh" — câu không rõ nghĩa; đã nhập "xe cuối cùng thiếu $3$ học sinh" (còn trống $3$ chỗ), ra $8$ xe và $325$ học sinh. Nếu hiểu là xe cuối cùng chỉ có $3$ học sinh thì ra $43$ xe và $1725$ học sinh.`)] }),
  ...ca(1, 'dai', 21, R`Cho một hình chữ nhật. Nếu tăng độ dài mỗi cạnh của nó lên $1\ \text{cm}$ thì diện tích của hình chữ nhật sẽ tăng thêm $13\ \text{cm}^2$. Nếu giảm chiều dài đi $2\ \text{cm}$, chiều rộng đi $1\ \text{cm}$ thì diện tích của hình chữ nhật sẽ giảm đi $15\ \text{cm}^2$. Tính chiều dài và chiều rộng của hình chữ nhật.`),
  ...ca(1, 'dai', 22, R`Nếu hai vòi nước cùng chảy vào một bể không có nước thì bể sẽ đầy trong $1$ giờ $20$ phút. Nếu mở riêng vòi thứ nhất trong $10$ phút và vòi thứ hai trong $12$ phút thì chỉ được $\dfrac{2}{15}$ bể nước. Hỏi nếu mở riêng từng vòi thì thời gian để mỗi vòi chảy đầy bể là bao nhiêu phút?`),

  // ───────────────────────── B. HÌNH HỌC ─────────────────────────
  ...tach(2, 'hgt', 1, R`Sắp xếp các tỉ số lượng giác sau theo thứ tự tăng dần:`, [
    ['a', R`$\sin70^\circ,\ \cos30^\circ,\ \cos40^\circ,\ \sin51^\circ$.`],
    ['b', R`$\cos34^\circ,\ \sin57^\circ,\ \cot32^\circ$.`],
    ['c', R`$\cot40^\circ,\ \sin40^\circ,\ \cot43^\circ,\ \tan42^\circ$.`],
    ['d', R`$\tan52^\circ,\ \cot63^\circ,\ \tan72^\circ,\ \cot31^\circ,\ \sin27^\circ$.`]]),
  ...tach(2, 'hgt', 2, R`Tính giá trị của biểu thức:`, [
    ['a', bt(R`P=\sin^230^\circ-\sin^240^\circ-\sin^250^\circ+\sin^260^\circ`)],
    ['b', bt(R`B=\tan45^\circ\cdot\cot30^\circ\cdot\cot30^\circ`)],
    ['c', bt(R`C=\cos^225^\circ-\cos^235^\circ+\cos^245^\circ-\cos^255^\circ+\cos^265^\circ`)],
    ['d', bt(R`C=\cos^215^\circ+\cos^225^\circ+\ldots+\cos^275^\circ`), [R`Đề cương đặt tên biểu thức ở ý d) cũng là $C$ (trùng tên với ý c) — giữ đúng như in. Các góc cách đều $10^\circ$: $15^\circ,\ 25^\circ,\ \ldots,\ 75^\circ$.`]]]),
  ...ca(2, 'hgt', 3, R`Cho tam giác $ABC$ vuông tại $A$, có $AB=10\ \text{cm}$, $AC=15\ \text{cm}$.
a) Tính góc $B$.
b) Phân giác trong của góc $B$ cắt $AC$ tại $I$. Tính $AI$.
c) Vẽ $AH$ vuông góc với $BI$ tại $H$. Tính $AH$.`),
  ...ca(2, 'hgt', 4, R`Cho tam giác $ABC$ vuông tại $A$, biết $AB=9\ \text{cm}$ và $\widehat{C}=30^\circ$.
a) Giải tam giác vuông $ABC$.
b) Kẻ đường cao $AH$ của tam giác $ABC$. Tính $AH,\ BH$.
c) Tính độ dài đường phân giác $AD$ của tam giác $ABC$.
(Số đo độ dài làm tròn đến chữ số thập phân thứ hai.)`,
    { cb: [R`Đề cương in ý b) là "Kẻ đường cao của tam giác AH. của tam giác ABC. Tính AH, BH." (lỗi gõ); đã nhập "Kẻ đường cao $AH$ của tam giác $ABC$".`] }),
  ...ca(2, 'hgt', 5, R`Cho tam giác $ABC$ vuông tại $A$, biết $AB=21\ \text{cm}$, $BC=35\ \text{cm}$.
a) Giải tam giác vuông $ABC$.
b) Tính độ dài phân giác $AD$ và đường cao $AH$.
(Số đo độ dài làm tròn đến số thập phân thứ hai, số đo góc làm tròn đến phút.)`),
  ...ca(2, 'hgt', 6, R`Một chiếc thang có chiều dài $AB=4\ \text{m}$ được đặt dựa vào tường, chân thang cách tường là $BH=1{,}5\ \text{m}$ (như hình vẽ). Tính góc tạo bởi cạnh $AB$ và phần tường nằm ngang trên mặt đất (làm tròn kết quả đến hàng đơn vị).`,
    { anh: ['de_B6.png'], cb: [R`Đề cương in "không cách tường là $BH=1{,}5$ m" (lỗi gõ); đã nhập "chân thang cách tường là $BH=1{,}5$ m". "Phần tường nằm ngang trên mặt đất" trên hình là đoạn $BH$.`] }),
  ...ca(2, 'hgt', 7, R`Tính chiều cao của tháp canh trong hình bên, biết rằng từ một điểm trên mặt đất cách chân tháp $6{,}8\ \text{m}$ người ta nhìn thấy đỉnh $A$ của tháp theo phương tạo với mặt đất một góc $60^\circ$ (kết quả làm tròn đến hàng phần trăm).`,
    { anh: ['de_B7.png'], cb: [R`Đề cương chỉ in "Tính chiều cao của tháp canh trong hình bên (kết quả làm tròn đến hàng phần trăm)"; số liệu $6{,}8$ m và $60^\circ$ chỉ có trên hình — đã viết thêm vào lời văn cho câu tự đủ.`] }),
  ...ca(2, 'hgt', 8, R`Tia nắng chiếu qua điểm $B$ của toà nhà tạo với mặt đất một góc $x$ và tạo với cạnh $AB$ của toà nhà một góc $y$ (hình vẽ). Cho biết $\cos x\approx0{,}78$ và $\cot x\approx1{,}25$. Tính $\sin y$ và $\tan y$ (kết quả làm tròn đến hàng phần trăm).`,
    { anh: ['de_B8.png'], cb: [R`Hình của đề cương ghi kí hiệu $x$ ở đỉnh $B$ và $y$ ở chân tia nắng $C$ — ngược với lời văn ($x$ là góc với mặt đất, $y$ là góc với cạnh $AB$); chân toà nhà $A$ không ghi trên hình. Hai góc phụ nhau nên đáp số không phụ thuộc cách ghi.`] }),
  ...ca(2, 'hgt', 9, R`Cho tam giác $ABC$ vuông tại $A$, $AB=6\ \text{cm}$, $\tan B=\dfrac{5}{12}$. Tính độ dài đường cao $AH$ và trung tuyến $BM$ của tam giác $ABC$.`,
    { cb: [R`Đề cương có hình kèm nhưng hình đánh dấu các đoạn bằng nhau ($AB$, $MC$, $HC$) không khớp lời văn ⇒ không đưa hình đó vào đề; lời giải vẽ hình theo lời văn. Đề không nêu cách làm tròn.`] }),
  ...ca(2, 'hgt', 10, R`Từ nóc một cao ốc cao $50\ \text{m}$, người ta nhìn thấy chân và đỉnh một cột ăng-ten với các góc hạ và nâng lần lượt là $62^\circ$ và $34^\circ$. Tính chiều cao của cột ăng-ten.`,
    { cb: [CC(R`hình minh hoạ của đề cương vẽ cột ăng-ten THẤP hơn cao ốc và đặt góc $34^\circ$ giữa hai tia ngắm — lệch lời văn ("góc hạ $62^\circ$ tới chân, góc nâng $34^\circ$ tới đỉnh") ⇒ không đưa hình đó vào đề, giải theo lời văn (cột cao hơn cao ốc, khoảng $67{,}9$ m). Nếu theo hình (cả hai đều là góc hạ) thì cột cao khoảng $32{,}1$ m. Đề không nêu cách làm tròn.`)] }),

  // ───────────────────────── C. BÀI TẬP THAM KHẢO VÀ NÂNG CAO ─────────────────────────
  ...tach(3, 'dai', 1, R`Cho $a,\ b,\ c$ là các số thực. Chứng minh bất đẳng thức:`, [
    ['a', bt(R`ab\le\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}`), [CC(R`đề cương in $ab\le\dfrac{(a+b)^2}{2}\le\dfrac{a^2+b^2}{2}$ — đúng như in thì vế sau SAI (với $a=b=1$: $2\le1$); đã nhập dạng quen thuộc $ab\le\left(\dfrac{a+b}{2}\right)^2\le\dfrac{a^2+b^2}{2}$ (số mũ $2$ đặt cho cả phân số).`)]],
    ['b', R`$\dfrac{a^3+b^3}{2}\ge\left(\dfrac{a+b}{2}\right)^3$, với $a,\ b\ge0$.`, [CC(R`đề cương in $\dfrac{a^3+b^3}{2}\ge\dfrac{(a+b)^3}{2}$ — đúng như in thì SAI (với $a=b=1$: $1\ge4$); đã nhập dạng quen thuộc $\dfrac{a^3+b^3}{2}\ge\left(\dfrac{a+b}{2}\right)^3$ (số mũ $3$ đặt cho cả phân số).`)]],
    ['c', bt(R`a^4+b^4\ge a^3b+ab^3`), [CC(R`đề cương in $a^4+b^4\ge a^2b+ab^3$ — đúng như in thì SAI (với $a=b=\dfrac{1}{2}$: $\dfrac{1}{8}\ge\dfrac{3}{16}$); đã nhập dạng quen thuộc $a^4+b^4\ge a^3b+ab^3$.`)]],
    ['d', bt(R`a^4+3\ge4a`)],
    ['e', bt(R`a^2+b^2+c^2\ge ab+bc+ca`), [CC(R`đề cương in bất đẳng thức này cùng dòng với ý d), KHÔNG có nhãn ý, dạng "$a^2+b^2+c^2>(ab+bc+ca)$ với $a,\ b,\ c>0$" — với dấu "$>$" thì SAI khi $a=b=c$; đã nhập thành ý e) với dấu "$\ge$" (đúng với mọi số thực).`)]]]),
  ...tach(3, 'dai', 2, R`Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh:`, [
    ['a', bt(R`1<\dfrac{a}{a+b}+\dfrac{b}{b+c}+\dfrac{c}{c+a}<2`), [CC(R`đề cương in lời dẫn Bài 2 là "Tính giá trị của biểu thức:" nhưng hai ý đều là bất đẳng thức kép, và không nêu điều kiện của $a,\ b,\ c,\ d$; đã nhập "Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh:".`)]],
    ['b', bt(R`1<\dfrac{a}{a+b+c}+\dfrac{b}{b+c+d}+\dfrac{c}{c+d+a}+\dfrac{d}{d+a+b}<2`), [CC(R`lời dẫn và điều kiện "các số dương" do người gõ bổ sung (xem ý a).`)]]]),
  ...ca(3, 'hgt', 3, R`Cho tam giác $ABC$ vuông tại $A$, có $AB<AC$, chu vi là $72\ \text{cm}$ và trung tuyến $AM=15\ \text{cm}$. Tính tỉ số lượng giác của các góc $B,\ C$.`),
  ...ca(3, 'hgt', 4, R`Cho hình thang $ABCD$ ($\widehat{A}=\widehat{D}=90^\circ$), $AB<CD$. Hai đường chéo $AC$ và $BD$ vuông góc với nhau tại $O$.
a) Chứng minh: $AD^2=AB\cdot CD$.
b) Cho $AB=4{,}5\ \text{cm}$, $CD=8\ \text{cm}$. Tính $OA,\ OC$ và diện tích hình thang $ABCD$.`,
    { cb: [R`Đề cương có hình kèm nhưng hình vẽ hai đáy là $BC$ và $AD$ (góc vuông chỉ ở $A$) — không khớp lời văn ($\widehat{A}=\widehat{D}=90^\circ$ nên hai đáy là $AB$ và $CD$) ⇒ không đưa hình đó vào đề; lời giải vẽ hình theo lời văn.`] }),
  ...ca(3, 'hgt', 5, R`Cho tam giác $ABC$ vuông tại $A$, biết $AB=21\ \text{cm}$, $BC=35\ \text{cm}$.
a) Giải tam giác vuông $ABC$.
b) Tính độ dài phân giác $AD$ và đường cao $AH$.
(Số đo độ dài làm tròn đến số thập phân thứ hai, số đo góc làm tròn đến phút.)`,
    { lap: 'P2 Bài 5', cb: [R`Bài 5 phần C của đề cương in lặp nguyên văn Bài 5 phần B (chỉ khác "Giải tam giác $ABC$" / "Giải tam giác vuông $ABC$") — trong kho là MỘT câu.`] }),
]

// 9 trạm soạn: [phần, từ bài, đến bài]
const NHOM = [[1, 1, 2], [1, 3, 5], [1, 6, 6], [1, 7, 11], [1, 12, 22], [2, 1, 2], [2, 3, 5], [2, 6, 10], [3, 1, 4]]

dung({ MA: 'NS-GKI-2026', TEN: 'Đề cương ôn tập giữa học kì I Toán 9 — THCS & THPT Nguyễn Siêu (Hà Nội) 2026–2027', NGUON: 'le',
  FILE: 'on-tap-giua-ki-1-toan-9-nam-2026-2027-truong-thcsthpt-nguyen-sieu-ha-noi.pdf', PHAN, CAU, NHOM, LV, HERE, KHONG_NHAP })
