// ============================================================================
// NTL-GKI-2026.build.mjs — gõ lại "Phiếu bổ sung và đề cương ôn tập giữa học kì I Toán 8" (2026–2027) — Trường THCS Nam Từ Liêm (Hà Nội)
// (PDF 16 trang: 15 trang có nội dung + trang 16 chỉ là bóng mờ mặt sau, bỏ; scan, trang 1–2 có chữ viết tay của học sinh (khoanh đáp án, lời giải nháp) — BỎ QUA, chỉ gõ chữ in)
//
//   node kho-rules/dai/lo/k8/de-cuong/NTL-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_*.png)
//
// Cấu trúc đề (đúng thứ tự trong PDF):
//   Tiết 19 (tr.1–2) "Một số phương pháp phân tích đa thức thành nhân tử": A. Trắc nghiệm Câu 1–5 · B. Tự luận Bài 1–5 (tại lớp) · Bài tập về nhà Bài 1–4   ⇒ nhãn "Tiết 19 Câu N", "Tiết 19 Bài N", "Tiết 19 VN Bài N"
//   Tiết 20 (tr.2–3) cùng chuyên đề: tại lớp Bài 1–5 · về nhà Bài 1–4                                                                              ⇒ "Tiết 20 Bài N", "Tiết 20 VN Bài N"
//   Tiết 21 (tr.3) Hình bình hành: tại lớp Bài 1–3 · về nhà Bài 1–2                                                                              ⇒ "Tiết 21 Bài N", "Tiết 21 VN Bài N"
//   Đề cương ôn tập giữa kì I Tiết 22–23–24 (tr.4–9): A. Phạm vi KT = Đại số (Chương I Đa thức · Chương II Hằng đẳng thức đáng nhớ, phân tích đa thức thành nhân tử) + Hình học
//     (định nghĩa, tính chất, dấu hiệu nhận biết: hình thang, hình thang cân, hình bình hành) ⇒ KHÔNG hình chữ nhật / thoi / vuông.
//     Phần 1 Đại số: I. Trắc nghiệm Câu 1–10 ⇒ "Đại Câu N"; II. Tự luận Dạng 1 (Bài 1–7) · Dạng 2 (Bài 1–2) · Dạng 3 Nâng cao (Bài 1–5)  ⇒ "Dạng N Bài M…"
//     Phần 2 Hình học: I. Trắc nghiệm Bài 1 (Câu 1–4) ⇒ "Hình Câu N"; Bài 2 (9 khẳng định đúng/sai) ⇒ MỘT câu "Hình Bài 2"; II. Tự luận Dạng 1 (Bài 1–2) · Dạng 2 (Bài 1–5*) ⇒ "Hình Dạng N Bài M"
//   Một số đề tự luyện (tr.9–15): Đề số 01 (A. TN Câu 1–6, Tự luận Bài 1–5) · 02 (TN 1–6, Bài 1–6; Bài 6 chọn một trong hai ⇒ 6a / 6b tiếng Anh) · 03 (TN 1–6, Bài 1–5; Bài 4 có 4.1/4.2 ⇒ 4a / 4b; Bài 5 chọn một ⇒ 5a / 5b tiếng Anh)
//     · 04 (TN 1–6, Bài 1–5; Bài 1 = Câu 1 a/b + Câu 2 ⇒ 1a / 1b / 1c) ⇒ nhãn "Đề N Câu M", "Đề N Bài M…"
//   (Brief liệt kê Đề 1 chỉ "Bài 1…2" nhưng Đề số 01 thật có Bài 1–5 (tr.9–10) — đã gõ đủ 5 bài.)
// Tách ý: chỉ ý có dữ kiện RIÊNG; bài chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài.
// Hình trong đề (cắt vào img/): de_khoi_go · de_hinh_vuong_chia · de_cau_thang · de_hinh_thang_can · de_hinh_kinh_efgh · de_cay_co_thu · de_manh_vuon · de_tam_kinh · de_hop_bia · de_san_bong · de_5_coc · de_hinh_thang_ban_dat.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/NTL-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
// tach(phan, kho, tiềnTố, số bài, nhóm trạm, lời dẫn, [[ý, nội dung, cảnh báo?, ảnh?]…])
const tach = (phan, kho, pre, bai, nhom, lead, ys) => ys.map(([y, nd, cb, anh]) => ({ phan, kho, nhom, nhan: `${pre}Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`.trim(), anh: anh ?? [], canh_bao: cb ?? [] }))
const ca = (phan, kho, pre, bai, nhom, nd, o = {}) => [{ phan, kho, nhom, nhan: `${pre}Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]
const op = (...xs) => xs.map((x, i) => `${'ABCD'[i]}. ${x}`).join('\n')
const tn = (phan, kho, pre, so, nhom, q, opts, o = {}) => ({ phan, kho, nhom, loai: 'trac_nghiem', nhan: `${pre}Câu ${so}`, noi_dung: `${q}\n${op(...opts)}`, anh: o.anh ?? [], canh_bao: o.cb ?? [] })

const PHAN = [
  { thu_tu: 1, ten: 'Tiết 19 — A. Trắc nghiệm (bài tập tại lớp, Câu 1–5)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 2, ten: 'Tiết 19 — B. Tự luận (tại lớp Bài 1–5) và Bài tập về nhà (Bài 1–4)' },
  { thu_tu: 3, ten: 'Tiết 20 — Phân tích đa thức thành nhân tử (tại lớp Bài 1–5, về nhà Bài 1–4)' },
  { thu_tu: 4, ten: 'Tiết 21 — Hình bình hành (tại lớp Bài 1–3, về nhà Bài 1–2)' },
  { thu_tu: 5, ten: 'Đề cương tuần 8 — Phần 1 Đại số: I. Trắc nghiệm (Câu 1–10)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 6, ten: 'Đề cương tuần 8 — Phần 1 Đại số: II. Tự luận (Dạng 1, Dạng 2, Dạng 3 Nâng cao)' },
  { thu_tu: 7, ten: 'Đề cương tuần 8 — Phần 2 Hình học: I. Trắc nghiệm Bài 1 (Câu 1–4)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 8, ten: 'Đề cương tuần 8 — Phần 2 Hình học: I. Bài 2 (các khẳng định đúng hay sai)' },
  { thu_tu: 9, ten: 'Đề cương tuần 8 — Phần 2 Hình học: II. Tự luận (Dạng 1, Dạng 2)' },
  { thu_tu: 10, ten: 'Đề số 01 — I. Trắc nghiệm (Câu 1–6)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 11, ten: 'Đề số 01 — II. Tự luận (Bài 1–5)' },
  { thu_tu: 12, ten: 'Đề số 02 — A. Trắc nghiệm (Câu 1–6)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 13, ten: 'Đề số 02 — Phần II. Tự luận (Bài 1–6)' },
  { thu_tu: 14, ten: 'Đề số 03 — A. Trắc nghiệm (Câu 1–6)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 15, ten: 'Đề số 03 — B. Tự luận (Bài 1–5)' },
  { thu_tu: 16, ten: 'Đề số 04 — A. Trắc nghiệm (Câu 1–6)', dang_thuc: 'trac_nghiem' },
  { thu_tu: 17, ten: 'Đề số 04 — B. Tự luận (Bài 1–5)' },
]

const CAU = [
  // ══════════ TIẾT 19 — A. TRẮC NGHIỆM (tại lớp) ══════════
  tn(1, 'dai', 'Tiết 19 ', 1, 1, R`Phân tích đa thức $x^3-y^3$ thành nhân tử được kết quả là:`, [
    R`$x^3-y^3=(x-y)(x+y)^2$`, R`$x^3-y^3=(x-y)\left(x^2-y^2\right)$`, R`$x^3-y^3=(x+y)(x-y)^2$`, R`$x^3-y^3=(x-y)\left(x^2+xy+y^2\right)$`],
    { cb: [R`Bản scan trang 1–2 có vết khoanh đáp án / chữ viết tay của học sinh — bỏ qua, chỉ gõ chữ in.`] }),
  tn(1, 'dai', 'Tiết 19 ', 2, 1, R`Trong các kết quả sau, kết quả nào sai?`, [
    R`$-17x^3y-34x^2y^2+51xy^3=-17xy\left(x^2+2xy-3y^2\right)$`, R`$x(y-1)+3(y-1)=-(1-y)(x+3)$`,
    R`$16x^2(x-y)-8y(x-y)=8(x-y)\cdot\left(2x^2-y\right)$`, R`$1-2y+y^2=-(1-y)^2$`],
    { cb: [R`Đề in dấu chấm giữa hai thừa số ở phương án C ($8(x-y).(2x^2-y)$) — đề in dấu chấm = dấu nhân, đã gõ $\cdot$.`] }),
  tn(1, 'dai', 'Tiết 19 ', 3, 1, R`Với $(x-1)^2=x-1$ thì giá trị của $x$ sẽ là:`, [R`$x=0$`, R`$x=-1$`, R`$x=1;\ x=2$`, R`$x=0;\ x=1$`]),
  tn(1, 'dai', 'Tiết 19 ', 4, 1, R`Phân tích đa thức $\left(a^2+9\right)^2-36a^2$ thành nhân tử ta được`, [
    R`$(a+3)^4$`, R`$(a-3)^2(a+3)^2$`, R`$\left(a^2+36a+9\right)\left(a^2-36a+9\right)$`, R`$\left(a^2+9\right)^2$`]),
  tn(1, 'dai', 'Tiết 19 ', 5, 1, R`Cho $8x^3-64=(2x-4)(\ldots)$. Biểu thức thích hợp điền vào dấu $\ldots$ là`, [
    R`$2x^2+8x+8$`, R`$2x^2+8x+16$`, R`$4x^2-8x+16$`, R`$4x^2+8x+16$`]),

  // ══════════ TIẾT 19 — B. TỰ LUẬN (tại lớp) ══════════
  ...tach(2, 'dai', 'Tiết 19 ', 1, 1, R`Phân tích các đa thức sau thành nhân tử:`, [
    ['a', bt(R`5x^3y^2-20x^2y^3+45x^3y^3`)],
    ['b', bt(R`15x^2(x-y)+30x^3(x-y)`)],
    ['c', bt(R`4x^2(x-y)+9y^2(y-x)`)],
    ['d', bt(R`50x^2(x-y)^2-8y^2(y-x)^2`)]]),
  ...tach(2, 'dai', 'Tiết 19 ', 2, 2, R`Phân tích các đa thức sau thành nhân tử:`, [
    ['a', bt(R`27x^3-0{,}001y^6`)],
    ['b', bt(R`-125x^3+75x^2-15x+1`)],
    ['c', bt(R`(2x+1)^2-4(x-1)^2`)],
    ['d', bt(R`(x+1)^2-4(x+1)y^2+4y^4`)]]),
  ...tach(2, 'dai', 'Tiết 19 ', 3, 2, R`Tìm các giá trị của $x$, biết:`, [
    ['a', bt(R`2x(x-3)+5(3-x)^2=0`)],
    ['b', bt(R`(4x-8)\left(x^2+x+6\right)-(4x-8)(x+7)+8(8-4x)=0`)],
    ['c', bt(R`4x^2-25+(2x+7)(5-2x)=0`)],
    ['d', bt(R`x^2-9=5(x-3)^2`)]]),
  ...ca(2, 'dai', 'Tiết 19 ', 4, 2, R`Một khối gỗ dạng hình lập phương có cạnh là $x$ (cm). Người ta cắt bỏ đi một phần gỗ cũng có dạng hình lập phương có thể tích là $1728\ \text{cm}^3$.
a) Tính thể tích $V$ của phần gỗ còn lại rồi sau đó phân tích $V$ thành nhân tử.
b) Tính thể tích $V$ của phần gỗ còn lại biết $x=26$ (cm).`, { anh: ['de_khoi_go.png'], cb: [R`Đọc hình: khối gỗ lập phương cạnh $x$; ở một góc phía trên bị khoét đi một khối lập phương nhỏ, nhãn "$V=1728\,\text{cm}^3$" chỉ vào khối nhỏ bị cắt bỏ; chú thích "Hình ảnh minh họa một khối gỗ".`] }),
  ...tach(2, 'dai', 'Tiết 19 ', 5, 2, '', [
    ['a', R`Chứng minh rằng $4^{1994}-25$ chia hết cho $2^{1994}+5$.`],
    ['b', R`Tìm $n\in\mathbb{N}$ để biểu thức $A=\left(n^2+10\right)^2-36n^2$ có giá trị là một số nguyên tố.`]]),

  // ══════════ TIẾT 19 — BÀI TẬP VỀ NHÀ ══════════
  ...tach(2, 'dai', 'Tiết 19 VN ', 1, 3, R`Phân tích các đa thức sau thành nhân tử:`, [
    ['a', bt(R`10x(x-y)-8y(y-x)`)],
    ['b', bt(R`7x(y-4)^2-(4-y)^3`)],
    ['c', bt(R`x^6-12x^4+48x^2-64`)]]),
  ...tach(2, 'dai', 'Tiết 19 VN ', 2, 3, R`Tìm $x$ biết:`, [
    ['a', bt(R`4x(x-2020)-x+2020=0`)],
    ['b', bt(R`4x^2(x-2)-8x(2-x)^2=0`)]]),
  ...tach(2, 'dai', 'Tiết 19 VN ', 3, 3, R`Phân tích các đa thức sau thành nhân tử:`, [
    ['a', R`$16x^2-8x+1-3(4x-1)$;`],
    ['b', R`$27x^3+8$;`],
    ['c', R`$-(x+2)+3\left(x^2-4\right)$;`],
    ['d', bt(R`(ax+by)^2-(ay+bx)^2`)]]),
  ...ca(2, 'dai', 'Tiết 19 VN ', 4, 3, R`Cho mảnh đất hình chữ nhật có chiều dài là $x+1$ mét, chiều rộng là $x$ mét. Người ta làm muốn quy hoạch một phần diện tích của mảnh đất bằng $6x-6\ \text{m}^2$ để trồng cây. Phần còn lại để làm nhà.
a) Viết biểu thức tính $S$ phần làm nhà của mảnh đất theo $x$.
b) Phân tích $S$ thành nhân tử rồi tính $S$ khi $x=14$ (m).`, { cb: [R`Đề in thừa chữ: "Người ta làm muốn quy hoạch" (thừa "làm") và "$6x-6\ \text{m}^2$" (đơn vị đặt sau biểu thức, không ngoặc — hiểu là diện tích trồng cây $(6x-6)\ \text{m}^2$); gõ đúng như in, giải bình thường.`] }),

  // ══════════ TIẾT 20 ══════════
  ...tach(3, 'dai', 'Tiết 20 ', 1, 4, R`Phân tích các đa thức sau thành nhân tử`, [
    ['a', bt(R`4x^4+4x^3-x^2-x`)],
    ['b', bt(R`x^2-4xy+4y^2-9`)],
    ['c', bt(R`x^2\left(x^2-6\right)-x^2+9`)],
    ['d', bt(R`x^2-2x-4y^2-4y`)],
    ['e', bt(R`x^2+2xy+y^2-xz-zy`)],
    ['f', bt(R`x^3-4x^2-8x+8`)],
    ['g', bt(R`x^3-2x^2y+xy^2-4x`)],
    ['h', bt(R`x^3-3x^2y+3xy^2-y^3-x+y`)]]),
  ...tach(3, 'dai', 'Tiết 20 ', 2, 5, R`Phân tích các đa thức sau thành nhân tử bằng phương pháp nhẩm nghiệm (Ứng dụng định lí Bezout):`, [
    ['a', bt(R`x^2+5x+4`)],
    ['b', bt(R`x^2-5x+6`)],
    ['c', bt(R`2x^2-x-15`)],
    ['d', bt(R`9x^2-24x+15`)],
    ['e', bt(R`2x^3-5x^2+8x-3`)],
    ['f', bt(R`x^3-7x+6`)]]),
  ...tach(3, 'dai', 'Tiết 20 ', 3, 5, R`Tìm các giá trị của $x$, biết:`, [
    ['a', bt(R`x^2(x-1)-2x(x-3)-9(x-1)=0`)],
    ['b', bt(R`3x^4-9x^3=-9x^2+27x`)],
    ['c', bt(R`x(x+4)-3x^2+48=0`)]]),
  ...ca(3, 'dai', 'Tiết 20 ', 4, 5, R`Một hình vuông được chia thành các hình vuông và hình chữ nhật (hình vẽ). Tính diện tích mỗi hình vuông và mỗi hình chữ nhật được chia theo $x$ và $y$ rồi tính tổng của chúng và phân tích kết quả vừa tìm được thành nhân tử.`,
    { anh: ['de_hinh_vuong_chia.png'], cb: [R`Đọc hình: hình vuông lớn chia bởi một đường ngang và một đường dọc thành 4 phần; cạnh trên ghi $x$ (bên trái) và $y$ (bên phải), cạnh trái ghi $x$ (phía trên) và $y$ (phía dưới); ô trên-trái là hình vuông cạnh $x$ (gạch chéo), ô dưới-phải là hình vuông cạnh $y$ (gạch chéo), hai ô còn lại là hình chữ nhật kích thước $x$ và $y$ (không gạch).`] }),
  ...tach(3, 'dai', 'Tiết 20 ', 5, 5, '', [
    ['a', R`Phân tích các đa thức sau thành nhân tử: $\left(x^2-2x\right)\left(x^2-2x-1\right)-6$.`],
    ['b', R`Chứng minh với mọi số nguyên $x$ thì giá trị của biểu thức $x(x+1)(x+2)(x+3)+1$ là số chính phương (Số chính phương là số có dạng bình phương của số tự nhiên).`]]),

  ...tach(3, 'dai', 'Tiết 20 VN ', 1, 6, R`Phân tích các đa thức thành nhân tử`, [
    ['a', bt(R`x^2+2x-4y^2-4y`), [R`Đề cương đánh nhãn ý của Bài 1 là a, b, c, d, e*, g* (có dấu * ở e và g, không có f) — giữ nhãn 1e, 1g đúng như in.`]],
    ['b', bt(R`4x^2-8x+4-2(1-x)(1+x)`)],
    ['c', bt(R`x^2-4xy+4y^2-z^2+4zt-4t^2`)],
    ['d', bt(R`x^4+x^3+2x^2+x+1`)],
    ['e', bt(R`a^3+b^3+c^3-3abc`), [R`Đề in "e*)" (dấu * = nâng cao).`]],
    ['g', bt(R`(x-y)^3+(y-z)^3+(z-x)^3`), [R`Đề in "g*)" (dấu * = nâng cao).`]]]),
  ...tach(3, 'dai', 'Tiết 20 VN ', 2, 6, R`Tìm $x$, biết:`, [
    ['a', R`$5(x+3)-2x(3+x)=0$;`],
    ['b', R`$6x\left(x^2-2\right)-\left(2-x^2\right)=0$;`],
    ['c', R`$4x(x-2013)-x+2013=0$;`],
    ['d', bt(R`(x+1)^2=x+1`)]]),
  ...ca(3, 'dai', 'Tiết 20 VN ', 3, 6, R`Tìm $x$, biết: $x^4-2x^3+10x^2-20x=0$.`),
  ...ca(3, 'dai', 'Tiết 20 VN ', 4, 6, R`Cho mảnh đất hình vuông có cạnh dài $x+2$ mét. Người ta làm đường đi bao quanh rộng $y-2$ mét.
a) Viết biểu thức tính $S$ phần diện tích làm đường đi của mảnh đất theo $x$ và $y$.
b) Phân tích $S$ thành nhân tử rồi tính $S$ khi $x=20$ (m) và $y=5$ (m).`),

  // ══════════ TIẾT 21 — HÌNH BÌNH HÀNH ══════════
  ...ca(4, 'hinh_hoc', 'Tiết 21 ', 1, 7, R`Cho hình bình hành $ABCD$ có $O$ là giao điểm hai đường chéo $AC$ và $BD$. Trên đường chéo $AC$ lấy hai điểm $E$ và $F$ sao cho $AE=EF=FC$.
a) Chứng minh tứ giác $BEDF$ là hình bình hành.
b) Kéo dài $BF$ cắt $DC$ tại $I$ và $DE$ cắt $AB$ tại $J$. Chứng minh ba điểm $I,\ O,\ J$ thẳng hàng.`),
  ...ca(4, 'hinh_hoc', 'Tiết 21 ', 2, 7, R`Cho hình bình hành $MNPQ$. Trên đường chéo $NQ$ lấy các điểm $H$ và $K$ sao cho $NH=HK=KQ$.
a) Chứng minh tứ giác $MHPK$ là hình bình hành.
b) Trên tia đối của các tia $MN,\ NP,\ PQ$ và $QM$ lần lượt lấy các điểm $A,\ B,\ C,\ D$ sao cho: $AM=BN=CP=DQ$. Chứng minh bốn đường thẳng $MP,\ HK,\ AC,\ BD$ đồng quy.`),
  ...ca(4, 'hinh_hoc', 'Tiết 21 ', 3, 7, R`Cho hình bình hành $ABCD$. Gọi $I$ là giao điểm của $AC$ và $BD$. Gọi $M,\ P$ lần lượt là hình chiếu của $A$ và $C$ lên $BD$ ; $N,\ Q$ lần lượt là hình chiếu của $D$ và $B$ lên $AC$.
a) Chứng minh $I$ là trung điểm của $NQ$.
b) Chứng minh tứ giác $MNPQ$ là hình bình hành.`),
  ...ca(4, 'hinh_hoc', 'Tiết 21 VN ', 1, 7, R`Gọi $O$ là giao điểm của hai đường chéo của hình bình hành $ABCD$. Một đường thẳng đi qua $O$ lần lượt cắt các cạnh $AB,\ CD$ của hình bình hành tại hai điểm $M$ và $N$. Chứng minh $\triangle OAM=\triangle OCN$. Từ đó suy ra tứ giác $MBND$ là hình bình hành.`),
  ...ca(4, 'hinh_hoc', 'Tiết 21 VN ', 2, 7, R`Cho tam giác $ABC$, các đường cao $BH$ và $CK$ cắt nhau tại $E$. Đường thẳng qua $B$ vuông góc với $AB$ và đường thẳng qua $C$ vuông góc với $AC$ cắt nhau tại $D$. Gọi $M$ là trung điểm của $BC$.
a) Chứng minh rằng $\widehat{BAC}+\widehat{BDC}=180^\circ$.
b) Tứ giác $BDCE$ là hình gì? Vì sao?
c) Chứng minh rằng $M$ là trung điểm của $DE$. Tam giác $ABC$ thỏa mãn điều kiện gì thì $DE$ đi qua $A$?`, { cb: [R`Đề in "BAC + BDC = 180°" không có ký hiệu góc — đã gõ $\widehat{BAC}+\widehat{BDC}$ (hiểu là hai góc).`] }),

  // ══════════ ĐỀ CƯƠNG TUẦN 8 — PHẦN 1 ĐẠI SỐ — I. TRẮC NGHIỆM ══════════
  tn(5, 'dai', 'Đại ', 1, 8, R`Bậc của đơn thức $2xy^2\cdot\dfrac{4}{3}x^2y^3\cdot 6x$ là?`, [R`$7$`, R`$8$`, R`$9$`, R`$12$`],
    { cb: [R`Đề in liền các thừa số "$2xy^2\ \dfrac{4}{3}x^2y^3\ 6x$" không có dấu nhân — đã thêm $\cdot$ giữa các thừa số.`] }),
  tn(5, 'dai', 'Đại ', 2, 8, R`Tích của hai đơn thức $-7x^2yz$ và $\dfrac{3}{7}xy^2z^3$ bằng:`, [R`$3x^3y^3z^4$`, R`$-3x^3y^3z^4$`, R`$-3x^4y^3z^3$`, R`$3x^3y^4z^3$`]),
  tn(5, 'dai', 'Đại ', 3, 8, R`Đa thức $\left(1{,}6x^2+1{,}7y^2+2xy\right)-\left(0{,}5x^2-0{,}3y^2-2xy\right)$ có bậc là :`, [R`$2$`, R`$3$`, R`$4$`, R`$6$`]),
  tn(5, 'dai', 'Đại ', 4, 8, R`Thu gọn đa thức $\left(-3x^2y-2xy^2+16\right)+\left(-2x^2y+5xy^2-10\right)$ ta được`, [
    R`$-x^2y-7xy^2+26$`, R`$-5x^2y+3xy^2+6$`, R`$5x^2y+3xy^2+6$`, R`$5x^2y+3xy^2-6$`]),
  tn(5, 'dai', 'Đại ', 5, 8, R`Kết quả của phép nhân $-\dfrac{3}{4}x(4x-8)$ là:`, [R`$-3x^2+6x$`, R`$-3x^2-6x$`, R`$3x^2+6x$`, R`$3x^2-6x$`]),
  tn(5, 'dai', 'Đại ', 6, 8, R`Thực hiện phép tính nhân $(2x-y)(x-y)$ ta được:`, [R`$2x^2+3xy-y^2$`, R`$2x^2+xy-y^2$`, R`$2x^2-xy+y^2$`, R`$2x^2-3xy+y^2$`]),
  tn(5, 'dai', 'Đại ', 7, 8, R`Tính $\left(\dfrac{1}{3}x^3y^3+2x^2y^4\right):\left(xy^2\right)$ ta được :`, [
    R`$\dfrac{1}{3}x^2y+2x^2y$`, R`$\dfrac{1}{2}x^2y+2xy$`, R`$\dfrac{1}{2}x^2y+xy^2$`, R`$\dfrac{1}{3}x^2y+2xy^2$`]),
  tn(5, 'dai', 'Đại ', 8, 8, R`Biểu thức nào sau đây không phải là đa thức bậc $4$?`, [R`$2x^2yz$`, R`$x^4-\dfrac{3}{2}x^3y^2$`, R`$x^2y+xyzt$`, R`$x^4-2^5$`]),
  tn(5, 'dai', 'Đại ', 9, 8, R`Nếu $P=x^4-4x^2$ thì :`, [R`$P=x^2(x-2)(x+2)$`, R`$P=x(x-2)(x+2)$`, R`$P=x^2(x-4)(x+4)$`, R`$P=x(x-4)(x+2)$`]),
  tn(5, 'dai', 'Đại ', 10, 8, R`Giá trị của biểu thức $4(x+y)^2-9(x-y)^2$ với $x=2;\ y=4$ là :`, [R`$78$`, R`$98$`, R`$108$`, R`$118$`]),

  // ══════════ PHẦN 1 ĐẠI SỐ — II. TỰ LUẬN — DẠNG 1 (CÁC BÀI TOÁN VỀ ĐA THỨC NHIỀU BIẾN) ══════════
  ...tach(6, 'dai', 'Dạng 1 ', 1, 9, R`Thực hiện phép tính`, [
    ['a', bt(R`B=(2x-y)\left(4x^2+2xy+y^2\right)-2x(2x-y)(2x+y)+y\left(y^2-2xy\right)+2025`), [R`Đề in hai biểu thức $B$ và $E$ liền nhau dưới "Bài 1. Thực hiện phép tính" (không đánh a/b) — đã tách 1a ($B$) và 1b ($E$).`]],
    ['b', bt(R`E=\left(12x^4y^3+6x^2y^4-4x^3y\right):(2xy)-\left(2xy^2+3\right)\left(y+x^2\right)`)]]),
  ...tach(6, 'dai', 'Dạng 1 ', 2, 9, R`Tính giá trị của biểu thức:`, [
    ['a', R`$B=6x(2x-7)-(3x-5)(4x+7)$ tại $x=-2$.`, [R`Đề đánh các mục 1), 2), 3) — đã đổi thành a, b, c.`]],
    ['b', R`$C=x^2+9y^2-6xy+3x-9y-20$ biết $x-3y=5$.`],
    ['c', R`$N=a^3+b^3+4ab(a+b)+\left(a^2+ab+b^2\right)$ biết $a+b=1$.`]]),
  ...tach(6, 'dai', 'Dạng 1 ', 3, 9, R`Rút gọn các biểu thức sau:`, [
    ['a', bt(R`A=3(x-1)\left(x^2+x+1\right)+(x-1)^3-4x(x+1)(x-1)+x^2+x-4`)],
    ['b', bt(R`B=\left(9x^2y^2+6xy+4\right)(3xy-2)-(1+3xy)^2\cdot 3xy+18x^2y^2`)],
    ['c', bt(R`C=(x-3)\left(x^2+3x+9\right)-\left(x^3+3\right)`)],
    ['d', bt(R`D=(x+3)^2+(x-3)^2-2(x-5)(x+5)`)],
    ['e', bt(R`E=3x^2(x+1)(x-1)+\left(x^2-1\right)^3-\left(x^6-1\right)+(x+1)`)]]),
  ...tach(6, 'dai', 'Dạng 1 ', 4, 10, R`Phân tích các đa thức sau thành nhân tử`, [
    ['a', R`$3x^2y-9xy^2+12x^2y^2$`, [R`Đề đánh các mục 1)–9) — đã đổi thành a–i (a=1), …, i=9).`]],
    ['b', R`$3x(x-y)+6x^2(y-x)$`],
    ['c', R`$9(x-y)^2-4(x+y)^2$`],
    ['d', R`$x^3y-x^2y+xy-y$`],
    ['e', R`$4x^2-9y^2-4x-6y$`],
    ['f', R`$x^2-z^2+4xy+4y^2$`],
    ['g', R`$x^3-4x^2+4x-xy^2$`],
    ['h', R`$2x^2-x-15$`],
    ['i', R`$(x+1)(x+2)(x+3)(x+4)+8$`]]),
  ...tach(6, 'dai', 'Dạng 1 ', 5, 11, R`Tìm các giá trị của $x$, biết:`, [
    ['a', R`$-2x(x-3)+x(2x-1)=10$`, [R`Đề đánh các mục 1)–8) — đã đổi thành a–h.`]],
    ['b', R`$4x^2-(x-1)^2=0$`],
    ['c', R`$(x+2)\left(x^2-2x+4\right)-x\left(x^2+2\right)=15$`],
    ['d', R`$3x^2+4(x-1)(x+1)-7x(x-1)=x+12$`],
    ['e', R`$(x+1)^3-(x-1)^3-6(x-1)^2=-10$`],
    ['f', R`$(x-3)\left(x^2+3x+9\right)+x(x+2)(2-x)=1$`],
    ['g', R`$x^4-3x^3+3x^2-x=0$`],
    ['h', R`$x^2-3x+2=0$`]]),
  ...tach(6, 'dai', 'Dạng 1 ', 6, 11, R`Chứng minh các đẳng thức sau:`, [
    ['a', bt(R`\left(x^2+1\right)\left(x^2-x+1\right)\left(x^3-1\right)=x^6-1`), [R`Đề in sai: ảnh in rõ thừa số đầu là $(x^2+1)$ — khi đó vế trái bậc 7, đẳng thức KHÔNG đúng; đẳng thức đúng khi thừa số đầu là $(x+1)$ vì $(x+1)\left(x^2-x+1\right)=x^3+1$. Gõ đúng như in; lời giải ghi rõ đề in sai và chứng minh với $(x+1)$.`]],
    ['b', bt(R`\left(-3a^3+9+a^6\right)\left(3+a^3\right)\left(a^9-27\right)=a^{18}-729`)],
    ['c', bt(R`x^6+y^6=\left(x^2+y^2\right)\left[\left(x^2+y^2\right)^2-3x^2y^2\right]`)],
    ['d', bt(R`x^6-y^6=\left(x^2-y^2\right)\left(x^2-xy+y^2\right)\left(x^2+xy+y^2\right)`)]]),
  ...tach(6, 'dai', 'Dạng 1 ', 7, 12, R`Chứng minh giá trị của mỗi biểu thức sau không phụ thuộc vào giá trị của biến.`, [
    ['a', R`$A=(x-1)^3-4x(x+1)(x-1)+3(x-1)\left(x^2+x+1\right)+3(x-1)^2-x-5$`],
    ['b', R`$B=\left(\dfrac{1}{3}y+2x\right)\left(4x^2-\dfrac{2}{3}xy+\dfrac{y^2}{9}\right)-\left(8x^3+\dfrac{2}{27}y^3\right)$`],
    ['c', R`$C=(x-y)^3-(x-y)\left(x^2+xy+y^2\right)-3(y-x)xy-1$`],
    ['d', R`$D=8x(x-2)(x+2)-(2x+3)\left(4x^2-6x+9\right)+32(x-1)$`]]),

  // ══════════ DẠNG 2 — BÀI TOÁN THỰC TẾ VỀ ĐA THỨC ══════════
  ...ca(6, 'dai', 'Dạng 2 ', 1, 12, R`Một mảnh vườn hình chữ nhật ở bên trong vườn người ta đào 1 cái ao cũng là hình chữ nhật có kích thước như hình dưới, phần đất còn lại dùng để trồng rau (phần tô đậm).
a) Viết biểu thức tính diện tích phần đất trồng rau.
b) Tính diện tích phần đất trồng rau biết $x=5$ (m) và $y=3$ (m).`,
    { anh: ['de_manh_vuon.png'], cb: [R`Đọc hình: hình chữ nhật lớn (tô nền) có cạnh dọc ghi $5y$, cạnh ngang dưới ghi $2x+3y$; bên trong là hình chữ nhật nhỏ (ao, để trắng) có cạnh ngang trên ghi $x+y$ và cạnh dọc trái ghi $x$.`] }),
  ...ca(6, 'dai', 'Dạng 2 ', 2, 12, R`Tại một công trình xây dựng, người ta dùng ba loại tấm kính chống nắng $A$, $B$ và $C$ với kích thước như Hình 1 (tính bằng m). Giá tiền các tấm kính được tính theo diện tích với đơn giá $a$ (đồng/$\text{m}^2$). Tại đây có hai lần nhập vật liệu như bảng sau:
$\begin{array}{|c|c|c|c|}\hline \text{Số tấm mỗi loại} & A & B & C \\ \hline \text{Lần 1} & 2 & 4 & 5 \\ \hline \text{Lần 2} & 4 & 3 & 6 \\ \hline \end{array}$
Lập đa thức tính tổng số tiền mua tất cả các loại kính của cả 2 lần.`,
    { anh: ['de_tam_kinh.png'], cb: [R`Bảng số tấm (in cạnh Hình 1) đã chép vào lời đề dạng bảng.`, R`Đọc hình: bảng "Số tấm mỗi loại" — Lần 1: A = 2, B = 4, C = 5; Lần 2: A = 4, B = 3, C = 6. Hình 1: tấm A là hình (vuông) kích thước $x$ và $x$; tấm B kích thước $x$ và $1$; tấm C kích thước $x$ và $y$ (cạnh dọc đều ghi $x$; cạnh ngang A: $x$, B: $1$, C: $y$).`] }),

  // ══════════ DẠNG 3 — NÂNG CAO ══════════
  ...tach(6, 'dai', 'Dạng 3 ', 1, 13, R`Tìm giá trị lớn nhất (nhỏ nhất) của biểu thức:`, [
    ['a', R`$4x^2-2x+5$`, [R`Đề in "Tìm giá trị lớn nhất (nhỏ nhất)" chung cho cả 4 ý, không nói rõ ý nào tìm GTLN, ý nào GTNN.`]],
    ['b', R`$(1-x)(3x+4)$`],
    ['c', R`$-x^2-y^2-x+y+1$`],
    ['d', bt(R`x^2-2xy+6y^2-12x+2y+45`)]]),
  ...ca(6, 'dai', 'Dạng 3 ', 2, 13, R`Cho $x,\ y$ thỏa mãn $x^2+2y^2+2xy-10y+25=0$
Tính giá trị của biểu thức $A=(x+y)^{2024}+(x+4)^{2025}+(y-6)^{2026}+2024$.`),
  ...ca(6, 'dai', 'Dạng 3 ', 3, 13, R`Cho $x,\ y,\ z$ là các số thực đôi một khác nhau thỏa mãn $x^3+y^3+z^3=3xyz$
Tính giá trị $M=(x+y+2z)^2-z^2+2024$.`),
  ...ca(6, 'dai', 'Dạng 3 ', 4, 13, R`[Đề thi vào lớp 10 THPT chuyên ĐHSP Hà Nội năm học 2012-2013]
Cho $a,\ b,\ c$ đôi một khác nhau thỏa mãn $a^2(b+c)=b^2(c+a)=2012$.
Chứng minh: $M=c^2(a+b)=2012$.`),
  ...ca(6, 'dai', 'Dạng 3 ', 5, 13, R`[Đề thi vào lớp 10 THPT chuyên ĐHSP Hà Nội năm học 2013-2014]
Với các số thực $a,\ b,\ c$ thỏa mãn $a+b+c=0$, chứng minh đẳng thức
$\left(a^2+b^2+c^2\right)^2=2\left(a^4+b^4+c^4\right)$.`),

  // ══════════ PHẦN 2 HÌNH HỌC — I. TRẮC NGHIỆM ══════════
  tn(7, 'hinh_hoc', 'Hình ', 1, 14, R`Cho tứ giác $ABCD$ có $\widehat{A}=60^\circ;\ \widehat{B}=135^\circ;\ \widehat{D}=29^\circ$. Số đo $\widehat{C}$ là:`, [R`$137^\circ$`, R`$136^\circ$`, R`$135^\circ$`, R`$134^\circ$`],
    { cb: [R`Đề in "A = 60°; B = 135°; D = 29°", "Số đo C" không có ký hiệu góc — đã gõ $\widehat{A}$, $\widehat{B}$, $\widehat{C}$, $\widehat{D}$.`] }),
  tn(7, 'hinh_hoc', 'Hình ', 2, 14, R`Tứ giác $ABCD$ là hình bình hành nếu :`, [R`$\widehat{A}=\widehat{C}$`, R`$\widehat{B}=\widehat{D}$`, R`$AB\parallel DC,\ BC=AD$`, R`$\widehat{A}=\widehat{C};\ \widehat{B}=\widehat{D}$`],
    { cb: [R`Đề in phương án A, B, D là "A = C", "B = D", "A = C; B = D" không có ký hiệu góc — đã gõ $\widehat{\ }$.`] }),
  tn(7, 'hinh_hoc', 'Hình ', 3, 14, R`Bạn An dự định lắp đèn Led để trang trí cầu thang nhà mình theo dạng hình bình hành $ABCD$ như hình vẽ, An đo được $AB=5\,\text{cm}$, $AD=1{,}2\,\text{cm}$, độ dài dây đèn Led bạn An cần dùng là :`, [
    R`$6{,}2\,\text{m}$`, R`$12{,}4\,\text{m}$`, R`$6\,\text{m}$`, R`$10\,\text{m}$`],
    { anh: ['de_cau_thang.png'], cb: [R`Đề in sai đơn vị: $AB=5\,\text{cm}$, $AD=1{,}2\,\text{cm}$ nhưng các phương án đều tính bằng m (cầu thang thật thì phải là m); gõ đúng như in, lời giải ghi rõ đề in nhầm đơn vị.`, R`Đọc hình: ảnh chụp cầu thang có lan can, bốn điểm $A$ (trên cùng), $D$ (dưới $A$, bên phải), $B$ (giữa, bên trái), $C$ (dưới cùng) đánh dấu bốn đỉnh hình bình hành $ABCD$ của dây đèn Led; không có số đo trên hình.`] }),
  tn(7, 'hinh_hoc', 'Hình ', 4, 14, R`Cho hình thang cân $ABCD$ (Hình vẽ). Biết $\widehat{BAD}=60^\circ$. Số đo góc $BCD$ bằng:`, [R`$120^\circ$`, R`$60^\circ$`, R`$50^\circ$`, R`$80^\circ$`],
    { anh: ['de_hinh_thang_can.png'], cb: [R`Đề in "BAD = 60°" không có ký hiệu góc — đã gõ $\widehat{BAD}$.`, R`Đọc hình: hình thang cân $ABCD$, hai đáy $DC$ (trên, ngắn) và $AB$ (dưới, dài); $D$, $C$ ở trên, $A$, $B$ ở dưới; góc tại $A$ ghi $60^\circ$.`] }),

  // ══════════ PHẦN 2 HÌNH HỌC — I. BÀI 2 (đúng / sai) — GIỮ MỘT CÂU ══════════
  ...ca(8, 'hinh_hoc', 'Hình ', 2, 14, `Các khẳng định sau đúng hay sai?
1) Tứ giác có 2 cạnh đối bằng nhau là hình bình hành.
2) Tứ giác có 2 cạnh đối song song là hình bình hành.
3) Hình bình hành là tứ giác có 2 đường chéo cắt nhau và bằng nhau.
4) Hình bình hành có 2 cạnh đối song song và bằng nhau.
5) Hình bình hành là tứ giác có 2 cạnh đối bằng nhau hoặc 2 cạnh đối song song.
6) Tứ giác có 4 cạnh bằng nhau hoặc 4 góc bằng nhau là hình bình hành.
7) Tứ giác có 2 góc kề 1 cạnh bằng nhau là hình thang cân.
8) Hình thang có 2 cạnh bên bằng nhau là hình thang cân.
9) Hình thang có hai góc kề một đáy bằng nhau là hình bình hành.`, { cb: ['Bài đúng/sai gồm 9 khẳng định gõ liền thành MỘT câu (theo yêu cầu).'] }),

  // ══════════ PHẦN 2 HÌNH HỌC — II. TỰ LUẬN ══════════
  ...ca(9, 'hinh_hoc', 'Hình Dạng 1 ', 1, 14, R`Mặt trước một cộng trình xây dựng được làm bằng kính có dạng hình bình hành $EFGH$ với $M$ là giao điểm của hai đường chéo (Hình vẽ). Cho biết $EF=40\,\text{m},\ EM=36\,\text{m},\ HM=16\,\text{m}$. Tính độ dài cạnh $HG$ và độ dài hai đường chéo.`,
    { anh: ['de_hinh_kinh_efgh.png'], cb: [R`Đề in lỗi chính tả "cộng trình xây dựng" (= "công trình"); gõ đúng như in.`, R`Đọc hình: mặt kính hình bình hành $EFGH$: $E$, $F$ ở trên, $H$, $G$ ở dưới ($E$ lệch sang trái so với $H$); hai đường chéo $EG$ và $FH$ cắt nhau tại $M$; không ghi số đo trên hình (số đo cho trong lời đề).`] }),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 1 ', 2, 14, R`Giữa hai địa điểm $A$ và $B$ có vướng một cây cổ thụ. Biết rằng $DC=90\,\text{m}$. Hỏi khoảng cách giữa hai địa điểm $A$ và $B$ là bao nhiêu mét? Vì sao?
(Học sinh không phải vẽ lại hình)`,
    { anh: ['de_cay_co_thu.png'], cb: [R`Đọc hình: tứ giác $ABCD$ (hình bình hành) với $A$, $B$ ở trên (đoạn $AB$ bị cây cổ thụ che), $D$, $C$ ở dưới, $DC$ ghi $90\ \text{m}$; hai đường chéo $AC$ và $BD$ cắt nhau tại $I$; dấu gạch: $IA$ và $IC$ cùng một gạch, $IB$ và $ID$ cùng hai gạch (tức $IA=IC$, $IB=ID$).`] }),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 2 ', 1, 15, R`Cho tam giác $ABC$ cân tại $A$. Lấy điểm $D$ trên cạnh $AB$, điểm $E$ trên cạnh $AC$ sao cho $AD=AE$.
a) Tứ giác $BDEC$ là hình gì? Vì sao?
b) Qua $E$ kẻ tia $Ex$ song song với $DC$ và $Ex$ cắt đường thẳng $BC$ tại $K$. Chứng minh $\triangle EBK$ là tam giác cân;
c) Các điểm $D,\ E$ ở vị trí nào thì $BD=DE=EC$ ?`),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 2 ', 2, 15, R`Cho hình bình hành $ABCD$. Trên đường chéo $AC$ lấy hai điểm $E,\ F$ sao cho $AE=EF=FC$.
a) Tứ giác $BEDF$ là hình gì? Vì sao?
b) Gọi $M$ là giao điểm của $DF$ và $BC$. Chứng minh: $DF=2FM$.
c) $BF$ cắt $DC$ tại $I$ và $DE$ cắt $AB$ tại $J$. Chứng minh: $EIFJ$ là hình bình hành.`),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 2 ', 3, 15, R`Cho hình bình hành $ABCD$, có góc $\widehat{ADC}=60^\circ,\ AB=2AD$. Lấy $M$ là trung điểm của $AB$, $N$ là trung điểm của $CD$. Trên tia đối của tia $AD$ lấy điểm $E$ sao cho $A$ là trung điểm của $DE$.
a) Tứ giác $AMND$ là hình gì? Vì sao?
b) Tứ giác $DNME$ là hình gì? Vì sao?
c) Chứng minh các điểm $E,\ M,\ C$ thẳng hàng.
d) Tính góc $DMC$.`),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 2 ', 4, 15, R`Cho hình bình hành $ABCD$. Trên tia đối của tia $BA$ lấy điểm $E$ sao cho $B$ là trung điểm của $AE$. Lấy điểm $F$ sao cho $D$ là trung điểm của $AF$.
a. Chứng minh tứ giác $DBEC$ là hình bình hành.
b. Chứng minh $C$ là trung điểm của đoạn $EF$.
c. Chứng minh ba đường thẳng $AC,\ BF,\ DE$ đồng quy.
d. Gọi $M$ là giao điểm của $CD$ và $BF,\ N$ là giao điểm của $AM$ và $CF$. Chứng minh $FN=\dfrac{2}{3}FC$.`),
  ...ca(9, 'hinh_hoc', 'Hình Dạng 2 ', 5, 15, R`Cho tam giác nhọn $ABC$ trực tâm $H$.
Chứng minh rằng chu vi của tam giác $ABC$ lớn hơn $\dfrac{3}{2}(HA+HB+HC)$.`, { cb: [R`Đề in "Bài 5*." (dấu * = nâng cao); câu hỏi nằm đầu trang 9.`] }),

  // ══════════ ĐỀ SỐ 01 ══════════
  tn(10, 'dai', 'Đề 1 ', 1, 16, R`Kết quả thu gọn của biểu thức $(2x-1)\left(4x^2+2x+1\right)$ là:`, [R`$8x-1$`, R`$8x+1$`, R`$8x^3+1$`, R`$8x^3-1$`]),
  tn(10, 'dai', 'Đề 1 ', 2, 16, R`Giá trị của biểu thức $3x(x-2)+(x-3)\left(x^2+3x+9\right)$ tại $x=2$ là:`, [R`$-19$`, R`$19$`, R`$29$`, R`$-29$`]),
  tn(10, 'dai', 'Đề 1 ', 3, 16, R`Kết quả phân tích đa thức $9x^2-16y^2$ là:`, [R`$(3x-y)(3x+y)$`, R`$(3x-4y)(3x+4y)$`, R`$(x-4y)(x+4y)$`, R`$(x-2y)(x+2y)$`]),
  tn(10, 'hinh_hoc', 'Đề 1 ', 4, 16, R`Hình bình hành không có tính chất nào sau đây?`, [
    'Hai cặp cạnh đối song song và bằng nhau.', 'Hai cặp góc đối bằng nhau.', 'Hai đường chéo bằng nhau.', 'Hai đường chéo cắt nhau tại trung điểm mỗi đường.']),
  tn(10, 'hinh_hoc', 'Đề 1 ', 5, 16, R`Cho hình bình hành $ABCD$ có $\widehat{A}=3\widehat{B}$. Tính số đo góc $C$?`, [R`$120^\circ$`, R`$90^\circ$`, R`$45^\circ$`, R`$135^\circ$`],
    { cb: [R`Đề in "A = 3B" không có ký hiệu góc — đã gõ $\widehat{A}=3\widehat{B}$.`, R`Phương án D ($135^\circ$) bị xuống dòng ở dòng dưới trong ảnh — đã ghép lại đúng.`] }),
  tn(10, 'hinh_hoc', 'Đề 1 ', 6, 16, R`Khẳng định nào dưới nào đây SAI ?`, [
    'Tứ giác có hai cạnh đối song song và bằng nhau là hình bình hành.', 'Hình thang có hai cạnh bên song song là hình bình hành.',
    'Hình thang có hai đường chéo bằng nhau là hình bình hành.', 'Tứ giác có hai đường chéo cắt nhau tại trung điểm của mỗi đường là hình bình hành.'],
    { cb: [R`Đề in thừa chữ "Khẳng định nào dưới nào đây SAI ?" (= "dưới đây"); gõ đúng như in.`] }),
  ...tach(11, 'dai', 'Đề 1 ', 1, 17, R`Phân tích các đa thức sau thành nhân tử:`, [
    ['a', bt(R`x^2+4x+4-y^2`)],
    ['b', bt(R`am-bn+bm-an`)],
    ['c', bt(R`2x^2-3x+1`)]]),
  ...tach(11, 'dai', 'Đề 1 ', 2, 17, R`Tìm $x$, biết:`, [
    ['a', R`$(5x-1)^2-(5x-4)(5x+4)=7$`],
    ['b', R`$4x^2(x-5)+16(5-x)=0$`],
    ['c', R`$(x+4)\left(x^2-4x+16\right)-x(x+5)(x-5)=264$`]]),
  ...ca(11, 'dai', 'Đề 1 ', 3, 17, R`Bạn Thành dùng một miếng bìa hình chữ nhật để làm một chiếc hộp (không nắp) bằng cách cắt bốn hình vuông cạnh $x$ cm ở bốn góc rồi gấp lại. Biết rằng miếng bìa có chiều dài là $y$ cm, chiều rộng là $z$ cm.
a) Tìm đa thức biểu thị thể tích của chiếc hộp.
b) Xác định bậc của đa thức đó.`,
    { anh: ['de_hop_bia.png'], cb: [R`Đọc hình: miếng bìa hình chữ nhật, cạnh ngang dưới ghi $y\ \text{cm}$, cạnh dọc trái ghi $z\ \text{cm}$; bốn hình vuông ở bốn góc, mỗi cạnh ghi $x\ \text{cm}$ (các cạnh ngang trên/dưới và dọc trái/phải của các hình vuông đều ghi $x\ \text{cm}$); nét đứt là đường gấp.`] }),
  ...ca(11, 'hinh_hoc', 'Đề 1 ', 4, 17, R`Cho tam giác $ABC$ có $D$ là trung điểm của $BC$, $E$ là trung điểm của $AB$. Lấy điểm $F$ đối xứng với điểm $D$ qua $E$.
a) Chứng minh tứ giác $FADB$ là hình bình hành.
b) Kẻ $FG\perp AB;\ DH\perp AB;\ (G,\ H\in AB)$. Chứng minh $FD=AC;\ BFH=ADG$.
c) Vẽ điểm $Q$ đối xứng với điểm $C$ qua $A$, $DQ$ cắt đoạn $AB$ tại điểm $I$, $M$ là trung điểm của $AD$. Chứng minh $F,\ M,\ I$ thẳng hàng.`,
    { cb: [R`Ở ý b) đề in "$BFH=ADG$" thiếu ký hiệu (tam giác hay góc). Với $FADB$ là hình bình hành và $EG=EH$ thì $\triangle BFH=\triangle ADG$ (c.c.c) nên cũng có $\widehat{BFH}=\widehat{ADG}$ — lời giải chứng minh hai tam giác bằng nhau rồi suy ra cặp góc, ghi rõ đề thiếu ký hiệu. Gõ đúng như in.`] }),
  ...ca(11, 'dai', 'Đề 1 ', 5, 17, R`Cho các số thực $a,\ b$ dương thỏa mãn $a^3+b^3=3ab-1$. Chứng minh rằng $a^{2022}+b^{2023}=2$.`),

  // ══════════ ĐỀ SỐ 02 ══════════
  tn(12, 'dai', 'Đề 2 ', 1, 18, R`Trong các biểu thức sau, biểu thức nào là đơn thức?`, [R`$3-2x^2yz^3$`, R`$\dfrac{1}{5}xyz^2$`, R`$\dfrac{1}{2}x(x-y)$`, R`$x^2+y^2$`],
    { cb: [R`Đề in "A. TRẮC NGHIỆM (1,5 điểm)" kèm chú ý "Học sinh viết câu trả lời trắc nghiệm vào tờ giấy thi. Ví dụ: Câu 1 em chọn phương án A thì ghi "Câu 1: A"" — không phải đề, bỏ.`] }),
  tn(12, 'dai', 'Đề 2 ', 2, 18, R`Kết quả phân tích đa thức $81y^2-1$ thành nhân tử là:`, [R`$(9y-1)(9y+1)$`, R`$(3y-1)(3y+1)$`, R`$(81y-1)(81y+1)$`, R`$\left(9y^2-1\right)\left(9y^2+1\right)$`]),
  tn(12, 'dai', 'Đề 2 ', 3, 18, R`Chọn đẳng thức đúng.`, [
    R`$8x^3+y^3=(8x+y)\left(64x^2-8xy+y^2\right)$`, R`$8x^3+y^3=(8x+y)\left(64x^2+8xy+y^2\right)$`,
    R`$8x^3+y^3=(2x+y)\left(4x^2-2xy+y^2\right)$`, R`$8x^3+y^3=(2x+y)\left(4x^2+2xy+y^2\right)$`]),
  tn(12, 'hinh_hoc', 'Đề 2 ', 4, 18, R`Cho tứ giác $ABCD$ có $\widehat{A}=80^\circ,\ \widehat{B}=70^\circ,\ \widehat{C}=2\widehat{D}$. Khi đó số đo của góc $C$ bằng:`, [R`$70^\circ$`, R`$80^\circ$`, R`$140^\circ$`, R`$150^\circ$`],
    { cb: [R`Đề in "A = 80°, B = 70°, C = 2D" không có ký hiệu góc — đã gõ $\widehat{\ }$.`] }),
  tn(12, 'hinh_hoc', 'Đề 2 ', 5, 18, R`Cho hình thang cân $ABCD$ có hai đáy là $AB$ và $CD$. Gọi $O$ là giao điểm của $AC$ và $BD$. Chọn phát biểu đúng.`, [
    R`$OA=OC$`, R`$OB=OD$`, R`$\widehat{ADC}=\widehat{BCD}$`, R`$AB=CD$`],
    { cb: [R`Đề in phương án C "ADC = BCD" không có ký hiệu góc — đã gõ $\widehat{ADC}=\widehat{BCD}$.`] }),
  tn(12, 'hinh_hoc', 'Đề 2 ', 6, 18, R`Hình bình hành $ABCD$ có $\widehat{A}-\widehat{B}=20^\circ$. Số đo góc $A$ bằng`, [R`$80^\circ$`, R`$90^\circ$`, R`$100^\circ$`, R`$110^\circ$`],
    { cb: [R`Đề in "A − B = 20°" không có ký hiệu góc — đã gõ $\widehat{A}-\widehat{B}$.`] }),
  ...tach(13, 'dai', 'Đề 2 ', 1, 18, R`Phân tích các đa thức sau thành nhân tử`, [
    ['a', R`$x^2(x+3)-y^2(x+3)$`],
    ['b', R`$x^3-2x^2+5x-10$`],
    ['c', bt(R`x^2+8x-4y^2+16`)]]),
  ...tach(13, 'dai', 'Đề 2 ', 2, 19, R`Tìm các giá trị của $x$, biết:`, [
    ['a', R`$x^2-(x+1)^2=-17$`],
    ['b', R`$9x^2(x-2)+3x^2-6x=0$`],
    ['c', R`$x^2-4x+3=0$`]]),
  ...tach(13, 'dai', 'Đề 2 ', 3, 19, R`Rút gọn các biểu thức sau :`, [
    ['a', R`$3a\left(a^2+2b\right)^2-12ab\left(a^2+b\right)+3b^5$`],
    ['b', R`$x(x-2)(x+2)-\left(x^2+1\right)\left(x^2-1\right)+4x+1$`]]),
  ...ca(13, 'dai', 'Đề 2 ', 4, 19, R`Một sân bóng hình chữ nhật có chiều dài $15x+5y$ (m) và chiều rộng là $10x-5y$ (m). Mỗi cạnh chừa lại $3$ m làm lối đi. Phần trong là sân trồng cỏ phục vụ cho các trận đấu.
a) Viết biểu thức biểu thị biểu diễn diện tích của mặt sân trồng cỏ.
b) Diện tích của mặt sân trồng cỏ khi $x=9$ m, $y=3$ m.`,
    { anh: ['de_san_bong.png'], cb: [R`Đề in vênh: lời đề ghi chiều dài $15x+5y$ (m) nhưng hình sân bóng ghi chiều dài $10x+5y\ \text{(m)}$ (chiều rộng $10x-5y$ khớp). Gõ đúng như in; lời giải theo LỜI ĐỀ ($15x+5y$) và ghi rõ hình in khác.`, R`Đọc hình: sân bóng hình chữ nhật (ảnh sân cỏ có vạch giữa sân, vòng tròn giữa sân, hai khu vực khung thành), mũi tên ngang phía trên ghi $10x+5y\ \text{(m)}$, mũi tên dọc bên trái ghi $10x-5y\ \text{(m)}$.`] }),
  ...ca(13, 'hinh_hoc', 'Đề 2 ', 5, 19, R`Cho hình bình hành $ABCD$. Lấy điểm $M$ và $N$ lần lượt là trung điểm của $CD$ và $AB$. Gọi $O$ là giao điểm của $AC$ và $BD$.
a) Tứ giác $ANCM$ là hình gì? Chứng minh.
b) Gọi $G$ là giao điểm của $AM$ và $BD$, $K$ là giao điểm của $CN$ và $BD$.
+) Chứng minh $G$ và $K$ lần lượt là trọng tâm của tam giác $ACD$ và tam giác $ACB$.
+) Chứng minh tứ giác $AGCK$ là hình bình hành.
c) Chứng minh $GK,\ MN,\ AC,\ BD$ đồng quy tại một điểm.`),
  ...tach(13, 'dai', 'Đề 2 ', 6, 19, '', [
    ['a', R`Tìm giá trị nhỏ nhất của biểu thức $M=3\left(x^2+y^2\right)$ biết $x^2+y^2=xy+12$.`, [R`Đề in "Bài 6. Học sinh chọn một trong hai câu sau": Câu 1 (tiếng Việt) = 6a, Câu 2 (tiếng Anh) = 6b.`]],
    ['b', R`Five open cups labeled 1, 2, 3, 4, 5 line in row, as shown below. At first, a ball is put into cup #3. In each move, Daniel moves the ball to an adjacent cup. If the ball is in cup #1, it can only be moved to cup #2. If the ball is in cup #5, it can only be moved to cup #4. Daniel moves the ball 2023 times. Which cups can hold the ball in the end?`, [R`Đọc hình: 5 chiếc cốc để ngửa (miệng rộng hướng lên trên) xếp thành một hàng ngang, đánh số 1, 2, 3, 4, 5 (từ trái sang phải) dưới từng cốc.`], ['de_5_coc.png']]]),

  // ══════════ ĐỀ SỐ 03 ══════════
  tn(14, 'dai', 'Đề 3 ', 1, 20, R`Trong các biểu thức đại số sau, biểu thức đại số nào là đơn thức?`, [R`$1-xy$`, R`$99x^{100}y^{101}$`, R`$2x+y$`, R`$4y(1-x)$`]),
  tn(14, 'dai', 'Đề 3 ', 2, 20, R`Giá trị của biểu thức $x^2-y^2$ tại $x=125;\ y=25$ là:`, [R`$100$`, R`$10000$`, R`$15000$`, R`$1500$`]),
  tn(14, 'dai', 'Đề 3 ', 3, 20, R`Thực hiện phép tính $\left(8x^3y^2-6x^2y^3\right):(-2xy)$ ta được kết quả:`, [
    R`$-4x^2y+3xy^2$`, R`$-4xy^2+3x^2y$`, R`$-10x^2y+4xy^2$`, R`$-10x^2y+4xy^2$`],
    { cb: [R`Đề in phương án C và D giống hệt nhau ($-10x^2y+4xy^2$, đều sai); đáp án đúng nằm ở A hoặc B nên câu vẫn làm được. Gõ đúng như in.`] }),
  tn(14, 'hinh_hoc', 'Đề 3 ', 4, 20, R`Dấu hiệu nhận biết hình thang cân là:`, [
    'Hình thang có hai cạnh bên bằng nhau là hình thang cân.', 'Hình thang có hai đường chéo vuông góc với nhau là hình thang cân.',
    'Hình thang có hai đường chéo cắt nhau tại trung điểm là hình thang cân.', 'Hình thang có hai đường chéo bằng nhau là hình thang cân.']),
  tn(14, 'hinh_hoc', 'Đề 3 ', 5, 20, R`Cho tứ giác $ABCD$ có $\widehat{A}=80^\circ,\ \widehat{B}=70^\circ,\ \widehat{C}-\widehat{D}=30^\circ$. Khi đó số đo của góc $C$ bằng :`, [R`$70^\circ$`, R`$80^\circ$`, R`$90^\circ$`, R`$120^\circ$`],
    { cb: [R`Đề in "A = 80°, B = 70°, C − D = 30°" không có ký hiệu góc — đã gõ $\widehat{\ }$.`] }),
  tn(14, 'hinh_hoc', 'Đề 3 ', 6, 20, R`Hình bình hành là tứ giác có:..`, ['hai cạnh song song', 'các cạnh đối song song', 'các góc bằng nhau', 'các góc đối bù nhau']),
  ...ca(15, 'dai', 'Đề 3 ', 1, 20, R`Cho đa thức $A=x^5y+3x^4+5x^2y,\ B=2x^2y-3x^4+9$
a) Tính giá trị của $B$ tại $x=-1,\ y=2$
b) Tính $A+B$ và $A-B$`, { cb: ['Giữ cả bài (hai ý chung dữ kiện $A$, $B$); nếu trạm sau muốn tách thì tách 1a/1b.'] }),
  ...tach(15, 'dai', 'Đề 3 ', 2, 20, R`Tìm các giá trị của $x$, biết:`, [
    ['a', R`$3(5x-1)+x(x+2)-x^2=14$`],
    ['b', R`$(x+2)^2-x(x-3)=2$`],
    ['c', R`$(x+1)^3-(x-4)(x+4)-x^3=17$`]]),
  ...tach(15, 'dai', 'Đề 3 ', 3, 21, R`Phân tích các đa thức sau thành nhân tử`, [
    ['a', R`$10x^2(x+y)-15x(x+y)$`],
    ['b', R`$x^2-2x+2y-y^2$`],
    ['c', R`$5x^2-10xy+5y^2-3x+3y$`]]),
  ...ca(15, 'hinh_hoc', 'Đề 3 ', '4a', 21, R`Bác Ngọc có một miếng đất hình thang cân với diện tích là $1500\,\text{m}^2$. Bác mua thêm hai miếng đất nữa để đất của bác trở thành hình chữ nhật (như hình vẽ dưới). Hỏi diện tích đất mà bác mua thêm là bao nhiêu?`,
    { anh: ['de_hinh_thang_ban_dat.png'], cb: [R`Đề in "Bài 4. (3,5 điểm): 4.1. (0,5 điểm)…" — nhãn 4.1 ⇒ 4a, 4.2 ⇒ 4b. Kho 'hinh_hoc': câu nằm trong Bài 4 phần hình (hình thang cân, hình chữ nhật — toán hình học thực tế, như "Hình Dạng 1").`, R`Đọc hình: hai hình. Hình trái: hình thang $ABCD$ ($AB\parallel DC$, $AB$ ở trên ghi $4x\ \text{(m)}$, $DC$ ở dưới ghi $6x\ \text{(m)}$), $AH\perp DC$ tại $H$ ($H$ nằm trên $DC$), $AH=30\ \text{(m)}$. Hình phải: hình chữ nhật $EFCD$ ($E$, $F$ ở trên; $D$, $C$ ở dưới) chứa hình thang $ABCD$, $A$ và $B$ nằm trên cạnh $EF$; hai tam giác vuông $EAD$ và $BFC$ (hai miếng đất mua thêm) tô xám; $AB=4x$, $AH=30$ (nét đứt), $DC=6x$.`] }),
  // ca() dưới đây cần nhãn "Bài 4b" — dùng cấu trúc thủ công
  { phan: 15, kho: 'hinh_hoc', nhom: 21, nhan: 'Đề 3 Bài 4b', noi_dung: R`Cho $\triangle ABC$ nhọn, đường trung tuyến $AM$. Trên tia đối của tia $MA$ lấy điểm $D$ sao cho $AM=DM$.
a) Chứng minh: Tứ giác $ACDB$ là hình bình hành.
b) Trên cạnh $AC$ lấy điểm $E$, trên cạnh $BD$ lấy điểm $F$ sao cho $AE=FD$ và $AE<EC$.
Chứng minh $AF=ED$ và ba đường thẳng $AD,\ BC,\ EF$ đồng quy.
c) Trên cạnh $AC$ lấy điểm $Q$ sao cho $AE=EQ$. Gọi $DQ$ cắt $BE$ tại $N$.
Chứng minh rằng: Nếu $ND\perp BC$ thì $\triangle AFN$ cân`, anh: [], canh_bao: [R`Đề in 4.2 (xem ghi chú ở 4a). Câu c) đề in không có dấu chấm cuối.`] },
  { phan: 15, kho: 'dai', nhom: 21, nhan: 'Đề 3 Bài 5a', noi_dung: R`Cho các số $a,\ b$ thỏa mãn $a\left(a^2-3b^2\right)=10$ và $b\left(b^2-3a^2\right)=30$.
Tính $P=2024\left(a^2+b^2-9\right)^{2025}$.`, anh: [], canh_bao: [R`Đề in "Bài 5. Học sinh chọn một trong hai câu sau": Câu 1 (tiếng Việt) = 5a, Câu 2 (tiếng Anh) = 5b.`] },
  { phan: 15, kho: 'dai', nhom: 21, nhan: 'Đề 3 Bài 5b', noi_dung: R`A company is designing a custom shipping box for its new product. The box needs to have a rectangular base, and its volume must be exactly 210 cubic inches. The length of the base is 2 inches more than its width, and the height is 4 inches less than twice the width. What are the dimensions of the box?`, anh: [], canh_bao: [] },

  // ══════════ ĐỀ SỐ 04 ══════════
  tn(16, 'dai', 'Đề 4 ', 1, 22, R`Giá trị của biểu thức $M=x^3-6x^2+12x-8$ tại $x=3$ là`, [R`$129$`, R`$-71$`, R`$1$`, R`$125$`]),
  tn(16, 'dai', 'Đề 4 ', 2, 22, R`Kết quả phân tích đa thức $3x(x-y)-6y(y-x)$ thành nhân tử là`, [R`$(x-y)(3x-6)$`, R`$3(x-y)(x+2y)$`, R`$3(x-y)(x-2y)$`, R`$3(x-y)(x+6y)$`]),
  tn(16, 'dai', 'Đề 4 ', 3, 22, R`Giá trị của $x$ để $5x(x-2022)-x+2022=0$ là`, [R`$x=0$`, R`$x=2022$`, R`$x=\dfrac{1}{5};\ x=2022$`, R`$x=\dfrac{-1}{5};\ x=2022$`]),
  tn(16, 'hinh_hoc', 'Đề 4 ', 4, 22, R`Chọn câu trả lời đúng
Tứ giác $MNPQ$ là hình bình hành nếu :`, [R`$\widehat{M}=\widehat{P}$`, R`$MN\parallel PQ$`, R`$MN=PQ;\ NP=MQ$`, R`$NP=MQ;\ MP=MQ$`],
    { cb: [R`Đề in phương án A "M = P" (in nghiêng, không có ký hiệu góc) — đã gõ $\widehat{M}=\widehat{P}$.`] }),
  tn(16, 'hinh_hoc', 'Đề 4 ', 5, 22, R`Cho hình bình hành $ABCD$, hai đường chéo $AC$ và $BD$ cắt nhau tại $O$. Biết $AC=3x-2,\ AO=x+3$.
Giá trị của $x$ là:`, [R`$4$`, R`$6$`, R`$8$`, R`$10$`], { cb: [R`Đề in hai đẳng thức $AC=3x-2$ và $AO=x+3$ trên một dòng riêng ở giữa; đã nối vào câu hỏi.`] }),
  tn(16, 'hinh_hoc', 'Đề 4 ', 6, 22, R`Cho hình bình hành $ABCD$. Biết: $\widehat{A}:\widehat{B}=2:1$. Số đo góc $D$ là:`, [R`$60^\circ$`, R`$90^\circ$`, R`$120^\circ$`, R`$135^\circ$`],
    { cb: [R`Dấu ":" ở $\widehat{A}:\widehat{B}=2:1$ là tỉ số (không phải chia hết); phương án A–D nằm ở đầu trang 15.`] }),
  { phan: 17, kho: 'dai', nhom: 22, nhan: 'Đề 4 Bài 1a', noi_dung: R`Thu gọn biểu thức sau: $A=(x-2)\left(x^2+2x+4\right)-x\left(x^2+1\right)+3(x-2)(x+2)$`, anh: [], canh_bao: [R`Đề in "Bài 1. Câu 1: a) …; b) …" và "Câu 2: …" — đã đặt nhãn 1a (Câu 1 ý a), 1b (Câu 1 ý b), 1c (Câu 2).`] },
  { phan: 17, kho: 'dai', nhom: 22, nhan: 'Đề 4 Bài 1b', noi_dung: R`Cho biểu thức $A=(x-2)\left(x^2+2x+4\right)-x\left(x^2+1\right)+3(x-2)(x+2)$. Tính giá trị của biểu thức $A$ tại $x=3$.`, anh: [], canh_bao: [R`Đề in ý b) chỉ "Tính giá trị của biểu thức A tại x = 3" (A là biểu thức ở ý a) — đã chép lại biểu thức $A$ vào đề để câu đứng riêng được.`] },
  { phan: 17, kho: 'dai', nhom: 22, nhan: 'Đề 4 Bài 1c', noi_dung: R`Chứng minh giá trị biểu thức sau không phụ thuộc vào giá trị của biến. $B=4x(5-x)+(2x+1)(2x-1)-2(10x+1)$`, anh: [], canh_bao: [] },
  ...tach(17, 'dai', 'Đề 4 ', 2, 23, R`Phân tích các đa thức sau thành nhân tử.`, [
    ['a', R`$x^2+2xy+y^2-4$`],
    ['b', R`$9x^2-25+(2x+7)(5-3x)$`],
    ['c', R`$3x^2-16x+5$`]]),
  ...tach(17, 'dai', 'Đề 4 ', 3, 23, R`Tìm $x$, biết:`, [
    ['a', R`$x(x+4)-(x+2)(x+3)=5$`],
    ['b', R`$x^4(x-3)-16x+48=0$`],
    ['c', R`$(3x+1)\left(9x^2-3x+1\right)-27x\left(x^2+\dfrac{1}{9}\right)=17$`]]),
  ...ca(17, 'hinh_hoc', 'Đề 4 ', 4, 23, R`Cho hình bình hành $ABCD$. Gọi $M$ là trung điểm của $DC$. Từ $C$ kẻ đường thẳng song song với $AM$ và cắt đoạn thẳng $AB$ tại $N$.
a) Chứng minh tứ giác $AMCN$ là hình bình hành.
b) Chứng minh $DN=BM$.
c) Gọi $I$ là giao điểm của $AM$ và $DN$, $K$ là giao điểm của $BM$ và $NC$, $O$ là giao điểm của $AC$ và $BD$. Chứng minh ba điểm $I,\ O,\ K$ thẳng hàng,
d) Từ $B$ kẻ đường thẳng $BE$ vuông góc với đường thẳng $AD$ tại $E$.
Chứng minh $\triangle MBE$ là tam giác cân.`),
  ...ca(17, 'dai', 'Đề 4 ', 5, 23, R`Tìm $x,\ y$ nguyên thoả mãn $6x^2y^2+x^2+y^2=8xy$.`),
]

dung({
  MA: 'NTL-GKI-2026',
  TEN: 'Phiếu bổ sung và đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS Nam Từ Liêm, Hà Nội',
  NGUON: 'THCS Nam Từ Liêm, Hà Nội',
  FILE: 'DE-CUONG-GK1-NAM-TU-LIEM-K8.pdf',
  PHAN, CAU, LV, HERE,
})
