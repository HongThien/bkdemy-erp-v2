// ============================================================================
// LTV-GKI-2026.build.mjs — gõ lại ĐỀ CƯƠNG ôn tập giữa học kì I Toán 8 (2026–2027) — Trường THCS & THPT Lương Thế Vinh (Hà Nội)
// (PDF 6 trang bản scan Thùy gửi 13/10: "TRỌNG TÂM KIẾN THỨC … MỘT SỐ BÀI TẬP THAM KHẢO", 30 bài) → de.json (khung) + 6 tệp khung.
//
//   node kho-rules/dai/lo/k8/de-cuong/LTV-GKI-2026.build.mjs <thư mục làm việc>     (cần <LV>/goc.pdf + <LV>/img/de_bai10.png, de_bai11.png)
//
// Trọng tâm KIẾN THỨC (đề ghi): Đại số = Chương 1 + Chương 2 đến hết bài 7 (lập phương của một tổng, một hiệu); Hình học = Chương 3 đến hết bài 13 (hình chữ nhật).
// ⇒ KHÔNG có: tổng / hiệu hai lập phương (bài 8), phân tích đa thức thành nhân tử (bài 9), hình thoi / hình vuông (bài 14).
// Tách ý: chỉ ý có dữ kiện RIÊNG và không dùng kết quả ý khác (Bài 2, 4, 5, 6, 7, 8, 12, 16); bài cho chung dữ kiện / ý sau dùng ý trước / bài hình ⇒ giữ cả bài.
// ============================================================================
import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { dung } from './dc-lib.mjs'

const LV = process.argv[2]
if (!LV) { console.error('Dùng: node …/LTV-GKI-2026.build.mjs <thư mục làm việc>'); process.exit(2) }
const HERE = dirname(fileURLToPath(import.meta.url))
const R = String.raw
const bt = (e) => `$${e}$.`
const tach = (phan, kho, bai, lead, ys) => ys.map(([y, nd, cb]) => ({ phan, kho, nhan: `Bài ${bai}${y}`, noi_dung: `${lead} ${nd}`, canh_bao: cb ?? [] }))
const ca = (phan, kho, bai, nd, o = {}) => [{ phan, kho, nhan: `Bài ${bai}`, noi_dung: nd, anh: o.anh ?? [], canh_bao: o.cb ?? [] }]

const PHAN = [
  { thu_tu: 1, ten: 'A. Đại số (Bài 1–19)' },
  { thu_tu: 2, ten: 'B. Hình học (Bài 20–30)' },
]

const CAU = [
  // ── A. ĐẠI SỐ ──
  ...ca(1, 'dai', 1, R`Cho hai đơn thức $A=-\dfrac{5}{72}x^2y^3z,\ B=\dfrac{2}{5}x^3yz^2$.
a) Tìm bậc, hệ số và phần biến của đơn thức $A$.
b) Tính giá trị của $A$ tại $x=-2,\ y=3,\ z=-4$.
c) Thu gọn đơn thức $C=A\cdot B$.`),
  ...tach(1, 'dai', 2, R`Thu gọn rồi xác định bậc của mỗi đa thức:`, [
    ['a', bt(R`A=2x^3y^2-7x^5-5x^3y^2+4+9x^5`)],
    ['b', bt(R`B=3x^2yz-2xy^2z-8x^2yz+5xy^2z+4xyz`)],
    ['c', bt(R`C=4x^6-\dfrac{2}{3}x^2y-\dfrac{5}{6}xy^2-4x^6-\dfrac{7}{6}x^2y`)],
    ['d', bt(R`D=\dfrac{2}{5}x^2y+2xy^2-3xy+\dfrac{3}{4}xy^2-4xy-\dfrac{2}{5}x^2y`)]]),
  ...ca(1, 'dai', 3, R`Cho $M=(3x-4)(3x+4)-2(x^2-5)-(6x^4y^3+6x^3y^3):(-3x^3y^2)$.
a) Thu gọn đa thức $M$.
b) Tính giá trị của $M$ tại $x=-2,\ y=3$.
c) Tìm các số nguyên $x,\ y$ để $M=4$.`),
  ...tach(1, 'dai', 4, R`Thực hiện phép tính:`, [
    ['a', bt(R`2xy^2-7xy+(5xy+12-3xy^2)`), [R`Đề cương in thiếu lời dẫn của Bài 4 (chữ "Bài 4." bị chồng lên ý a); đã nhập lời dẫn "Thực hiện phép tính" theo dạng các ý (đều là phép tính đa thức).`]],
    ['b', bt(R`(6x^2-3xy+2y^2)-(2x^2+y^2)+(5x^2-4xy+3)`)],
    ['c', bt(R`\left(-3x^2+\dfrac{2}{5}y^2-4xy\right)(-5xy^2)`)],
    ['d', bt(R`x^2(x-3y+2)+(x^2-4)(x+2y)`)],
    ['e', bt(R`(12x^3y^4+18x^3y^5-24x^5y^3):(-6x^3y^3)`)],
    ['f', bt(R`15x^5y^3:5x^3y^3-(x^2-4x+4):(x-2)`)]]),
  ...tach(1, 'dai', 5, R`Rút gọn biểu thức:`, [
    ['a', bt(R`x(x^2+3xy+4x)-4x^2+3x^2y`)],
    ['b', bt(R`5x^2+(x+2y)(x-2y)`)],
    ['c', bt(R`(5x-2)^2-(x+1)(25x-7)`)],
    ['d', bt(R`(x+2y)^2+(x-2y)^2+(x+2y)(x-2y)-3x^2`)],
    ['e', bt(R`(3x-2)^3-27x(x^2-2)`)],
    ['f', bt(R`(x-5)^3-(x+2)^3+21(1-x)`)]]),
  ...tach(1, 'dai', 6, R`Chứng minh:`, [
    ['a', R`$P=(3x-2)(x+4)-3x(x+2)+(11-4x)$ không phụ thuộc vào $x$.`],
    ['b', bt(R`(3x+y)(x^2+xy-y^2)-y(4x^2+xy-y^2)=3x(x^2-y^2)`)]]),
  ...tach(1, 'dai', 7, R`Tìm $x$ biết:`, [
    ['a', bt(R`x(4x-7)+9x-4x^2=12`)],
    ['b', bt(R`(x-3)(x+3)+(2x+1)^2+2=5x^2-4x`)],
    ['c', bt(R`(1+3x)(3x-1)-9x(x+1)=20`)],
    ['d', bt(R`(3x+1)^2-9(x+2)^2=16`)],
    ['e', bt(R`(x+3)^2+(2x-1)^2-5(x+4)(x-4)=55`)],
    ['f', bt(R`(x-2)^3+x(x+3)(3-x)+4(x+1)^2=35`)],
    ['g', bt(R`(x+2)^3-(2x+3)(4x-1)=(x-3)^3+26`)],
    ['h', bt(R`x^3+12x^2+48x+56=0`)],
    ['i', R`$(3x-2)^2+(8x^3-6x^2):(-2x^2)=4x^2+4\ (x\neq 0)$.`]]),
  ...tach(1, 'dai', 8, R`Phép chia đa thức.`, [
    ['a', R`Tìm $m$ để $A(x)=3x^3-2x^2+5x+m+2027$ chia hết cho $B(x)=x+2$.`],
    ['b', R`Tìm $m,\ n$ để $A(x)=2x^3+4x^2+(2m+5)x+n-3$ chia hết cho $(x+2)^2$.`],
    ['c', R`Tìm $m\in\mathbb{N}$ để $A=6x^{m-2}y^5-7x^4y^{8-m}$ chia hết cho $B=2x^3y^2$.`]]),
  ...ca(1, 'dai', 9, R`Đa thức $f(x)$ khi chia cho $x-1$ được số dư bằng 4, khi chia cho $x-3$ được số dư bằng 14. Tìm đa thức dư của phép chia $f(x)$ cho $(x-1)(x-3)$.`),
  ...ca(1, 'dai', 10, R`Một khu đất hình chữ nhật có chiều dài $(2x+5)$ m và chiều rộng $(y+3)$ m. Người ta dành một phần hình chữ nhật có kích thước $x$ (m) và $y$ (m) ở góc trên bên phải để làm nhà kho; phần còn lại có dạng chữ L như hình vẽ.
a) Viết biểu thức biểu thị diện tích phần đất hình chữ L.
b) Thu gọn biểu thức đó thành một đa thức theo hai biến $x,\ y$.
c) Tính diện tích phần đất hình chữ L khi $x=5$ và $y=4$.`, { anh: ['de_bai10.png'] }),
  ...ca(1, 'dai', 11, R`Một sân vận động hình chữ nhật có chiều dài là $(x+y)$ mét và chiều rộng là $(x-y)$ mét.
1) Viết biểu thức tính diện tích của sân vận động.
2) Người ta làm lối đi rộng 3 mét xung quanh sân, phần còn lại để trồng cỏ nhằm phục vụ cho các trận bóng đá.
a) Viết biểu thức tính diện tích phần trồng cỏ.
b) Cho $x=40,\ y=6$. Biết chi phí trồng $1\ \text{m}^2$ cỏ là 100 000 đồng. Tính số tiền trồng cỏ cho mặt sân.`, { anh: ['de_bai11.png'] }),
  ...tach(1, 'dai', 12, R`Vận dụng hằng đẳng thức:`, [
    ['a', R`Cho $x+y=4$. Tính $A=9x^2+18xy+9y^2-5x-5y+12$.`],
    ['b', R`Cho $x-y=3$. Tính $B=3(x^3-y^3)-9xy(x-y)$.`],
    ['c', R`Tính $C=-x^4+18x^3+18x^2+18x-161$ tại $x=19$.`]]),
  ...ca(1, 'dai', 13, R`Cho $a,\ b,\ c$ là các số thực thỏa mãn $a+b+c=3$. Chứng minh:
a) $(a-1)^2-(b-1)(c-1)=(b-1)^2-(a-1)(c-1)=(c-1)^2-(a-1)(b-1)$.
b) $(a-1)^3+(b-1)^3+(c-1)^3=3(a-1)(b-1)(c-1)$.`, { cb: [R`Đề cương in "thỏa mãn và $a+b+c=3$" (thừa chữ "và"); đã sửa thành "thỏa mãn $a+b+c=3$".`] }),
  ...ca(1, 'dai', 14, R`Cho $a,\ b,\ c$ thỏa mãn $a+b+c=0$. Chứng minh rằng
$2(a^5+b^5+c^5)=5abc(a^2+b^2+c^2)$.`),
  ...ca(1, 'dai', 15, R`Cho $a+b+c=9$ và $a^2+b^2+c^2=27$. Tính
$P=(a-4)^{2025}+(b-4)^{2026}+(c-4)^{2027}$.`),
  ...tach(1, 'dai', 16, R`Chứng minh với mọi $n\in\mathbb{Z}$:`, [
    ['a', R`$P=(3n-1)^3-(3n-1)$ luôn chia hết cho 6.`],
    ['b', R`$Q=(3n+2)(3n+4)-(9n+2)(n+1)+1$ luôn chia hết cho 7.`]]),
  ...ca(1, 'dai', 17, R`Chứng minh rằng nếu $x,\ y\in\mathbb{Z}$ thì
$M=(xy-1)(x^{2023}+y^{2023})-(xy+1)(x^{2023}-y^{2023})$
chia hết cho 2.`),
  ...ca(1, 'dai', 18, R`Cho $a,\ b,\ c$ là các số thực khác 0, thỏa mãn
$(a+b+c)\left(\dfrac{1}{a}+\dfrac{1}{b}+\dfrac{1}{c}\right)=1$.
Tính
$P=(a^{2027}+b^{2027})(b^{2025}+c^{2025})(c^{2013}+a^{2013})$.`),
  ...ca(1, 'dai', 19, R`Cho $x,\ y\in\mathbb{R}$ thỏa mãn
$x^2+5y^2-4xy-4x+6y+5=0$.
Tính $M=(x-6)^{2025}+(y-3)^{2026}$.`),

  // ── B. HÌNH HỌC (không tách ý — k8.md §10) ──
  ...ca(2, 'hinh_hoc', 20, R`Cho tam giác $ABC$ vuông tại $A$, $AB<AC$, đường cao $AH$ và trung tuyến $AE$. Gọi $D,\ F$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$; $O$ là giao điểm của $AE$ và $DF$.
a) Chứng minh $ADEF$ là hình chữ nhật.
b) Chứng minh $DF\parallel BC$.
c) Chứng minh $BDFE$ là hình bình hành.
d) Chứng minh $F$ là trung điểm của $AC$.
e) Chứng minh $DFEH$ là hình thang cân.
f) Lấy $M,\ N$ sao cho $F$ lần lượt là trung điểm của $EM$ và $BN$. Chứng minh $A,\ N,\ M$ thẳng hàng.`),
  ...ca(2, 'hinh_hoc', 21, R`Cho tam giác $ABC$ vuông tại $A$ ($AC<AB$), gọi $M$ là trung điểm của $BC$. Kẻ $ME\perp AB$ tại $E$, kẻ $MF\perp AC$ tại $F$.
a) Chứng minh tứ giác $AEMF$ là hình chữ nhật.
b) Lấy điểm $H$ trên tia $MF$ sao cho $FM=FH$. Chứng minh tứ giác $AHFE$ là hình bình hành.
c) Gọi $I$ là giao điểm của $EH$ và $AF$; $J$ là trung điểm của $ME$. Chứng minh $I$ là trung điểm của $AF,\ EH$ và $IJ\perp ME$.`),
  ...ca(2, 'hinh_hoc', 22, R`Cho hình chữ nhật $ABCD$ với $AB>AD$. Kẻ $AN\perp BD,\ CM\perp BD$ ($N,\ M\in BD$).
a) Chứng minh $DN=BM$.
b) Chứng minh $ANCM$ là hình bình hành.
c) Trên tia đối của tia $NA$ lấy $K$ sao cho $NK=NA$. Chứng minh $BA=BK$ và $DA=DK$.
d) Chứng minh $DKCB$ là hình thang cân.`),
  ...ca(2, 'hinh_hoc', 23, R`Cho tam giác $ABC$ vuông tại $A$. Lấy $D\in BC$. Gọi $M,\ N$ lần lượt là hình chiếu của $D$ trên $AB,\ AC$.
a) Chứng minh $AD=MN$.
b) Kẻ đường cao $AH$ của tam giác $ABC$. Chứng minh $\widehat{MHN}=90^\circ$.`),
  ...ca(2, 'hinh_hoc', 24, R`Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), lấy điểm $M$ bất kỳ thuộc $BC$ ($M\neq B,\ M\neq C$). Kẻ $MD\perp AB$ tại $D$, $ME\perp AC$ tại $E$.
a) Chứng minh tứ giác $ADME$ là hình chữ nhật.
b) Qua $A$ kẻ tia $Ax\parallel DE$; $Ax$ cắt tia $ME$ tại $F$. Trên tia $MD$ lấy điểm $G$ sao cho $D$ là trung điểm của $MG$. Chứng minh tứ giác $ADEF$ là hình bình hành và $A$ là trung điểm của đoạn thẳng $GF$.
c) $AM$ cắt $DE$ tại $O$, kẻ đường cao $AH$ của tam giác $ABC$. Tính số đo góc $DHE$.`),
  ...ca(2, 'hinh_hoc', 25, R`Cho hình chữ nhật $ABCD$. Gọi $H$ là hình chiếu của $B$ trên $AC$. Gọi $M,\ N,\ P$ lần lượt là trung điểm của $AB,\ AH,\ DC$.
a) Chứng minh $MBCP$ là hình chữ nhật.
b) Chứng minh $MN\perp AC$.
c) Kẻ $NK\parallel AB$ ($K\in BH$). Chứng minh $NKCP$ là hình bình hành.
d) Chứng minh $K$ là trung điểm của $BH$.`),
  ...ca(2, 'hinh_hoc', 26, R`Cho tam giác $ABC$ vuông tại $A$, $AB<AC$, đường cao $AH$. Từ $H$ kẻ $HM\perp AB,\ HN\perp AC$ ($M\in AB,\ N\in AC$). Gọi $I$ là trung điểm của $HC$; lấy $K$ sao cho $I$ là trung điểm của $AK$.
a) Chứng minh $AC\parallel HK$.
b) $MN$ cắt $AH$ tại $O$. Chứng minh $O$ là trung điểm của $AH$ và $MN$.
c) Chứng minh $MNCK$ là hình thang cân.`),
  ...ca(2, 'hinh_hoc', 27, R`Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$), đường cao $AH$. Gọi $M$ là trung điểm của đoạn thẳng $HC$. Trên tia đối của tia $MA$, lấy điểm $D$ sao cho $MD=MA$.
a) Chứng minh tứ giác $AHDC$ là hình bình hành.
b) Gọi $N,\ K$ lần lượt là trung điểm của các đoạn thẳng $AH$ và $CD$. Chứng minh $HNCK$ là hình bình hành.
c) Chứng minh $M$ là trung điểm của $NK$.`),
  ...ca(2, 'hinh_hoc', 28, R`Cho tam giác $ABC$ vuông tại $A$ ($AB\ge AC$). Gọi $E$ là trung điểm của $BC$; $D,\ H$ lần lượt là hình chiếu của $E$ trên $AB,\ AC$.
a) Chứng minh $ADEH$ là hình chữ nhật.
b) Chứng minh $D$ là trung điểm của $AB$.
c) Lấy $F$ sao cho $D$ là trung điểm của $EF$. Chứng minh $AHDF$ là hình bình hành.
d) Gọi $O$ là giao điểm của $AD$ và $HF$. Chứng minh $O$ là trung điểm của $AD$ và $HF$.`),
  ...ca(2, 'hinh_hoc', 29, R`Cho tam giác $ABC$ vuông tại $A$ ($AB<AC$). Lấy $M\in BC$ sao cho $BM>MC,\ M\neq C$. Gọi $N,\ D$ lần lượt là hình chiếu của $M$ trên $AB,\ AC$.
a) Chứng minh $ADMN$ là hình chữ nhật.
b) Trên tia đối của tia $NM$ lấy $P$ sao cho $NM=NP$. Chứng minh $APND$ là hình bình hành.
c) Gọi $Q$ là hình chiếu của $M$ trên $AP$, $O$ là giao điểm của $QM$ và $ND$. Chứng minh $O$ là trung điểm của $QM$ và $\widehat{AQN}=\widehat{ADN}$.`),
  ...ca(2, 'hinh_hoc', 30, R`Cho tam giác $ABC$ vuông tại $A$. Gọi $M$ là trung điểm của $BC$; lấy $D$ sao cho $M$ là trung điểm của $AD$.
a) Chứng minh $ABDC$ là hình chữ nhật.
b) Trên tia đối của tia $CA$, lấy $E$ sao cho $CE=CA$. Chứng minh $BDEC$ là hình bình hành.
c) Gọi $O$ là trung điểm của $CD$. Chứng minh $O$ là trung điểm của $BE$.`),
]

dung({
  MA: 'LTV-GKI-2026',
  TEN: 'Đề cương ôn tập giữa học kì I Toán 8 năm 2026–2027 — Trường THCS & THPT Lương Thế Vinh, Hà Nội',
  NGUON: 'Trường THCS & THPT Lương Thế Vinh',
  FILE: 'De-cuong-giua-ki-1-Toan-8-Luong-The-Vinh-2026.pdf',
  PHAN, CAU, LV, HERE,
  NHOM: [[1, 5], [6, 9], [10, 19], [20, 23], [24, 27], [28, 30]],
})
