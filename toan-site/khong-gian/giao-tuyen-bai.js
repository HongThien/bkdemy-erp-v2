/* DỮ LIỆU các bài GIAO TUYẾN – GIAO ĐIỂM (hình học không gian lớp 11) cho trang giao-tuyen.html.
   Mỗi bài = một mục; địa chỉ cố định giao-tuyen.html?bai=<id> (id đã phát hành thì KHÔNG đổi).
   Toạ độ kiểu sách: x sang phải, y vào trong (ra phía sau), z hướng lên. Điểm dựng thêm (giao điểm, trung điểm…) TÍNH từ điểm gốc,
   không gõ tay — sai hình là lộ ngay ở số.

   Khai một bài:
     diem   : { S: [x, y, z], … }            mọi điểm (gốc + dựng thêm)
     dinh   : ['S','A',…]                    điểm luôn hiện (đỉnh của khối)
     mat    : [['S','A','B'], …]             các mặt của khối — dùng để vẽ nét khuất (đứt) đúng theo góc nhìn
     canh   : ['SA', …]                      cạnh của khối (luôn hiện)
     doan   : { AB: { keo: ['K'] }, … }      đoạn dựng thêm / cạnh kéo dài được; keo = kéo dài tới các điểm này
     mp     : { SAD: { ten, da: ['S','A','D'], phu: ['J'], mau } }   mặt phẳng: da = đa giác "của nó", phu = điểm cần phủ khi MỞ RỘNG
     buoc   : [{ ten, chu, mp: { SAD: 2 }, doan: { AD: 2 }, hot: ['SJ'], diem: ['J'], nhin: 'SAD' }]
              mp: 1 = tô, 2 = mở rộng · doan: 1 = nối, 2 = kéo dài · hot = giao tuyến/đường cần nhấn (màu cam) · nhin = nhìn thẳng mặt đó
     y      : [{ n: 'a', chu, dung, buoc }]   (bài Đúng/Sai) — buoc = số thứ tự bước minh hoạ ý đó (đếm từ 1)
     dap    : đáp số (bài trả lời ngắn) */
(function () {
'use strict'
const cong = (a, b) => a.map((v, i) => v + b[i]), tru = (a, b) => a.map((v, i) => v - b[i]), nhan = (a, k) => a.map(v => v * k)
const tich = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2]
const chia = (P, Q, t) => cong(P, nhan(tru(Q, P), t))          // điểm trên đường PQ: P + t·PQ
const trungDiem = (P, Q) => chia(P, Q, 0.5)
const trongTam = (...P) => nhan(P.reduce(cong), 1 / P.length)
function cat(P1, P2, Q1, Q2) {   // giao của hai đường đồng phẳng P1P2 và Q1Q2
  const u = tru(P2, P1), v = tru(Q2, Q1), w = tru(Q1, P1)
  const uu = tich(u, u), uv = tich(u, v), vv = tich(v, v), uw = tich(u, w), vw = tich(v, w)
  return chia(P1, P2, (uw * vv - uv * vw) / (uu * vv - uv * uv))
}
const NGUON = 'Đề cương GKI Toán 11 · THPT Việt Đức · 2026–2027'
const CHOP4 = { dinh: ['S', 'A', 'B', 'C', 'D'], mat: [['S', 'A', 'B'], ['S', 'B', 'C'], ['S', 'C', 'D'], ['S', 'D', 'A'], ['A', 'B', 'C', 'D']], canh: ['SA', 'SB', 'SC', 'SD', 'AB', 'BC', 'CD', 'DA'] }

// ═══ Bài 1 — Đề 2 · Phần II · Câu 3 (Đúng/Sai) ═══
const b1 = (() => {
  // Đáy là tứ giác lồi có AB cắt CD (tại K) và AD cắt BC (tại J): chọn K, J trước rồi dựng tứ giác cho chắc hai cặp cạnh cắt nhau trong khung nhìn.
  const A = [-3.5, -2.5, 0], K = [6, 0, 0], J = [0, 6, 0]
  const B = chia(A, K, 0.55), D = chia(A, J, 0.6), C = cat(B, J, D, K)
  const S = [-0.8, 0.2, 5.4], I = cat(A, C, B, D)
  return { S, A, B, C, D, I, K, J }
})()

// ═══ Bài 2 — Đề 2 · Phần III · Câu 4 (trả lời ngắn) ═══
const b2 = (() => {
  const A = [-3.2, -2, 0], B = [2.4, -2, 0], D = [-2, 2.2, 0], C = cong(B, tru(D, A))   // hình bình hành
  const O = trungDiem(A, C), S = [-0.2, 0.3, 5.4]
  const K = chia(S, B, 1 / 3), L = chia(S, C, 1 / 3), I = cat(D, K, S, O)
  const P = trungDiem(K, B)   // kẻ OP ∥ DK, P ∈ SB (O trung điểm BD ⇒ P trung điểm BK)
  return { S, A, B, C, D, O, K, L, I, P }
})()

// ═══ Bài 3 — Đề 3 · Phần II · Câu 2 (Đúng/Sai) ═══
const b3 = (() => {
  const A = [-3.2, -2, 0], B = [2.4, -2, 0], D = [-2, 2.2, 0], C = cong(B, tru(D, A))
  const O = trungDiem(A, C), S = [-0.2, 0.3, 5.4]
  const M = trungDiem(C, B), N = trungDiem(C, D), G = trongTam(S, B, D)
  const E = cat(M, N, A, C), H = cat(E, G, S, A)
  return { S, A, B, C, D, O, M, N, G, E, H }
})()

// ═══ Bài 4 — Đề 3 · Phần III · Câu 3 (trả lời ngắn) ═══
const b4 = (() => {
  const A = [-3, -1.2, 0], B = [2.6, -2.4, 0], C = [1.6, 2.6, 0], S = [-0.4, 0.2, 5.2]
  const M = trungDiem(S, B), N = trungDiem(S, C), E = trungDiem(B, C), I = cat(M, N, S, E)
  return { S, A, B, C, M, N, E, I }
})()

window.BAI_GIAO_TUYEN = [
{
  id: 'vd11-gk1-d2-ds3', tab: 'Đề 2 · Đ/S Câu 3', loai: 'ds',
  nguon: NGUON + ' · Đề 2 · Phần II · Câu 3', ten: 'Giao tuyến qua giao điểm hai cạnh',
  de: 'Cho hình chóp tứ giác $S.ABCD$. Gọi $I$ là giao điểm của hai đường chéo $AC$ và $BD$; $K$ là giao điểm của cạnh $AB$ và $CD$. Xét tính đúng, sai của các mệnh đề sau:',
  diem: b1, ...CHOP4,
  doan: { AB: { keo: ['K'] }, CD: { keo: ['K'] }, AD: { keo: ['J'] }, BC: { keo: ['J'] }, AC: {}, BD: {}, IK: {}, SI: {}, SJ: {}, SK: {} },
  mp: {
    ABCD: { ten: '(ABCD)', da: ['A', 'B', 'C', 'D'], phu: ['K', 'J'], mau: 'xanh' },
    SAD: { ten: '(SAD)', da: ['S', 'A', 'D'], phu: ['J'], mau: 'hong' },
    SBC: { ten: '(SBC)', da: ['S', 'B', 'C'], phu: ['J'], mau: 'luc' },
    SAC: { ten: '(SAC)', da: ['S', 'A', 'C'], phu: ['I'], mau: 'tim' },
    SBD: { ten: '(SBD)', da: ['S', 'B', 'D'], phu: ['I'], mau: 'vang' },
    SAB: { ten: '(SAB)', da: ['S', 'A', 'B'], phu: ['K'], mau: 'hong' },
    SCD: { ten: '(SCD)', da: ['S', 'C', 'D'], phu: ['K'], mau: 'luc' },
  },
  y: [
    { n: 'a', chu: 'Đường thẳng $IK$ nằm trong mặt phẳng $(ABCD)$.', dung: true, buoc: 3 },
    { n: 'b', chu: 'Đường thẳng $SI$ là giao tuyến của mặt phẳng $(SAD)$ và $(SBC)$.', dung: false, buoc: 6 },
    { n: 'c', chu: 'Đường thẳng $SB$ là giao tuyến của mặt phẳng $(SIA)$ và $(SDK)$.', dung: false, buoc: 7 },
    { n: 'd', chu: 'Đường thẳng $SK$ là giao tuyến của mặt phẳng $(SAB)$ và $(SCD)$.', dung: true, buoc: 8 },
  ],
  buoc: [
    { ten: 'Hình chóp', chu: 'Đáy $ABCD$ là tứ giác thường (không phải hình bình hành) nên các cặp cạnh đối $AB, CD$ và $AD, BC$ kéo dài sẽ cắt nhau. Kéo để xoay hình; mục <b>Công cụ</b> bên dưới cho tô / mở rộng từng mặt phẳng, nối / kéo dài từng đường.' },
    { ten: 'a · Tìm I, K', chu: 'Trong mặt đáy: $I = AC \\cap BD$. Kéo dài $AB$ và $CD$ — hai đường cùng nằm trong $(ABCD)$ nên cắt nhau tại $K$.', mp: { ABCD: 2 }, doan: { AC: 1, BD: 1, AB: 2, CD: 2 } },
    { ten: 'a · Đường IK', chu: '$I$ và $K$ đều thuộc $(ABCD)$ ⇒ cả đường thẳng $IK$ nằm trong $(ABCD)$. <b>a) Đúng.</b>', mp: { ABCD: 2 }, doan: { AC: 1, BD: 1, AB: 2, CD: 2, IK: 1 }, hot: ['IK'] },
    { ten: 'b · Mở rộng 2 mặt', chu: 'Mở rộng hai mặt $(SAD)$ và $(SBC)$. Điểm chung thứ nhất: đỉnh $S$. Cần thêm <b>một điểm chung nữa</b>.', mp: { SAD: 2, SBC: 2 } },
    { ten: 'b · Kéo dài AD, BC', chu: '$AD \\subset (SAD)$, $BC \\subset (SBC)$, và cả hai cùng nằm trong mặt đáy ⇒ kéo dài cắt nhau tại $J$. Vậy $J$ là điểm chung thứ hai ⇒ $(SAD) \\cap (SBC) = SJ$.', mp: { SAD: 2, SBC: 2 }, doan: { AD: 2, BC: 2, SJ: 1 }, hot: ['SJ'] },
    { ten: 'b · SI thuộc mặt nào?', chu: '$I \\in AC \\subset (SAC)$ và $I \\in BD \\subset (SBD)$ ⇒ $SI = (SAC) \\cap (SBD)$. Giao tuyến của $(SAD)$ và $(SBC)$ là $SJ$, không phải $SI$. <b>b) Sai.</b>', mp: { SAC: 2, SBD: 2 }, doan: { AC: 1, BD: 1, SI: 1, AD: 2, BC: 2, SJ: 1 }, hot: ['SI'] },
    { ten: 'c · (SIA) và (SDK)', chu: '$I \\in AC$ nên mặt $(SIA)$ chính là $(SAC)$; $K \\in CD$ nên $(SDK)$ chính là $(SCD)$. Hai mặt có chung $S$ và $C$ ⇒ giao tuyến là $SC$, không phải $SB$. <b>c) Sai.</b>', mp: { SAC: 2, SCD: 2 }, doan: { AC: 1, BD: 1, CD: 2 }, diem: ['I', 'K'], hot: ['SC'] },
    { ten: 'd · (SAB) và (SCD)', chu: 'Chung $S$. $K = AB \\cap CD$ với $AB \\subset (SAB)$, $CD \\subset (SCD)$ ⇒ $K$ là điểm chung thứ hai ⇒ $(SAB) \\cap (SCD) = SK$. <b>d) Đúng.</b>', mp: { SAB: 2, SCD: 2 }, doan: { AB: 2, CD: 2, SK: 1 }, hot: ['SK'] },
  ],
},
{
  id: 'vd11-gk1-d2-tln4', tab: 'Đề 2 · TLN Câu 4', loai: 'tln',
  nguon: NGUON + ' · Đề 2 · Phần III · Câu 4', ten: 'Giao điểm của SO với mặt (ADK)',
  de: 'Cho hình chóp $S.ABCD$ có đáy $ABCD$ là hình bình hành tâm $O$. Gọi $K$ là điểm thuộc cạnh $SB$ sao cho $SB = 3SK$; $I$ là giao điểm của đường thẳng $SO$ và mặt phẳng $(ADK)$. Tính tỉ số $\\dfrac{IS}{IO}$.',
  dap: '1',
  diem: b2, ...CHOP4,
  doan: { AC: {}, BD: {}, SO: {}, AK: {}, DK: {}, KL: {}, DL: {}, AL: {}, OP: {} },
  mp: {
    ADK: { ten: '(ADK)', da: ['A', 'D', 'K'], phu: ['L', 'I'], mau: 'hong' },
    SBD: { ten: '(SBD)', da: ['S', 'B', 'D'], phu: ['I', 'O'], mau: 'xanh' },
    ABCD: { ten: '(ABCD)', da: ['A', 'B', 'C', 'D'], mau: 'luc' },
    SBC: { ten: '(SBC)', da: ['S', 'B', 'C'], phu: ['K', 'L'], mau: 'tim' },
  },
  buoc: [
    { ten: 'Hình chóp', chu: '$O$ là tâm hình bình hành; $K$ trên $SB$ với $SK = \\tfrac13 SB$. Cần tìm giao điểm của <b>đường</b> $SO$ với <b>mặt</b> $(ADK)$.', doan: { AC: 1, BD: 1, SO: 1 }, diem: ['K'] },
    { ten: 'Mặt (ADK)', chu: 'Mở rộng mặt $(ADK)$. $SO$ không cắt thẳng một đường nào có sẵn của mặt này ⇒ phải đưa $SO$ vào một <b>mặt phẳng phụ</b>.', mp: { ADK: 2 }, doan: { AC: 1, BD: 1, SO: 1, AK: 1, DK: 1 } },
    { ten: 'Mặt phụ (SBD)', chu: 'Chọn mặt phụ $(SBD) \\supset SO$. Giao tuyến của $(ADK)$ và $(SBD)$: $D$ chung; $K \\in SB \\subset (SBD)$ nên $K$ chung ⇒ giao tuyến là $DK$.', mp: { ADK: 2, SBD: 2 }, doan: { AC: 1, BD: 1, SO: 1, AK: 1, DK: 1 }, hot: ['DK'] },
    { ten: 'Giao điểm I', chu: '$DK$ và $SO$ cùng nằm trong $(SBD)$ ⇒ cắt nhau tại $I$. Mà $I \\in DK \\subset (ADK)$ ⇒ $I = SO \\cap (ADK)$.', mp: { SBD: 1 }, doan: { AC: 1, BD: 1, SO: 1, AK: 1, DK: 1 }, hot: ['DK', 'SO'], diem: ['I'] },
    { ten: 'Tính tỉ số', chu: 'Nhìn thẳng mặt $(SBD)$. Kẻ $OP \\parallel DK$ ($P \\in SB$).<br>• Tam giác $BDK$: $O$ là trung điểm $BD$ ⇒ $P$ là trung điểm $BK$ ⇒ $KP = \\tfrac12 KB = \\tfrac13 SB = SK$.<br>• Tam giác $SOP$: $K$ là trung điểm $SP$, $KI \\parallel PO$ ⇒ $I$ là trung điểm $SO$.<br>⇒ $\\dfrac{IS}{IO} = 1$.', mp: { SBD: 1 }, doan: { BD: 1, SO: 1, DK: 1, OP: 1 }, hot: ['OP'], diem: ['I', 'P'], nhin: 'SBD' },
    { ten: 'Thêm · thiết diện', chu: '$AD \\parallel BC$ nên $(ADK)$ cắt $(SBC)$ theo $KL \\parallel BC$ ($L \\in SC$, $SL = \\tfrac13 SC$). Thiết diện là hình thang $ADLK$; $I$ chính là giao điểm hai đường chéo $DK$, $AL$ của nó.', mp: { ADK: 2 }, doan: { SO: 1, AK: 1, DK: 1, KL: 1, DL: 1, AL: 1 }, hot: ['KL'], diem: ['I'] },
  ],
},
{
  id: 'vd11-gk1-d3-ds2', tab: 'Đề 3 · Đ/S Câu 2', loai: 'ds',
  nguon: NGUON + ' · Đề 3 · Phần II · Câu 2', ten: 'Mặt (GMN) cắt cạnh SA',
  de: 'Cho hình chóp $S.ABCD$ có đáy là hình bình hành tâm $O$. Gọi $M, N$ lần lượt là trung điểm của $CB, CD$ và $G$ là trọng tâm của $\\Delta SBD$. Biết $H$ là giao điểm của đường thẳng $SA$ và mặt phẳng $(GMN)$. Xét tính đúng, sai của các mệnh đề sau:',
  diem: b3, ...CHOP4,
  doan: { AC: {}, BD: {}, SO: {}, MN: {}, GM: {}, GN: {}, EG: { keo: ['H'] }, GH: {} },
  mp: {
    ABCD: { ten: '(ABCD)', da: ['A', 'B', 'C', 'D'], mau: 'luc' },
    SAC: { ten: '(SAC)', da: ['S', 'A', 'C'], phu: ['E', 'H'], mau: 'xanh' },
    SBD: { ten: '(SBD)', da: ['S', 'B', 'D'], phu: ['G'], mau: 'tim' },
    GMN: { ten: '(GMN)', da: ['G', 'M', 'N'], phu: ['E', 'H'], mau: 'hong' },
  },
  y: [
    { n: 'a', chu: '$S \\in (ABCD)$.', dung: false, buoc: 2 },
    { n: 'b', chu: 'Giao tuyến của hai mặt phẳng $(SAC)$ và $(SBD)$ là $SO$.', dung: true, buoc: 3 },
    { n: 'c', chu: 'Giao điểm của đường thẳng $MN$ và mặt phẳng $(SAC)$ là trung điểm của $OC$.', dung: true, buoc: 4 },
    { n: 'd', chu: 'Tỉ số $\\dfrac{SH}{SA} = \\dfrac37$.', dung: false, buoc: 7 },
  ],
  buoc: [
    { ten: 'Hình chóp', chu: '$O = AC \\cap BD$; $M, N$ là trung điểm $CB, CD$; $G$ là trọng tâm tam giác $SBD$ nên $G$ nằm trên trung tuyến $SO$, $SG = \\tfrac23 SO$.', doan: { AC: 1, BD: 1, SO: 1 }, diem: ['M', 'N', 'G'] },
    { ten: 'a · S và mặt đáy', chu: 'Mở rộng mặt đáy $(ABCD)$: đỉnh $S$ nằm ngoài mặt đáy (nếu $S$ nằm trong đáy thì không có hình chóp). <b>a) Sai.</b>', mp: { ABCD: 2 } },
    { ten: 'b · (SAC) và (SBD)', chu: 'Chung $S$. $O = AC \\cap BD$ với $AC \\subset (SAC)$, $BD \\subset (SBD)$ ⇒ $O$ chung ⇒ $(SAC) \\cap (SBD) = SO$. <b>b) Đúng.</b>', mp: { SAC: 2, SBD: 2 }, doan: { AC: 1, BD: 1, SO: 1 }, hot: ['SO'] },
    { ten: 'c · MN cắt (SAC)', chu: 'Mặt phụ chứa $MN$ là mặt đáy; $(ABCD) \\cap (SAC) = AC$ ⇒ $E = MN \\cap AC$ là giao điểm của $MN$ với $(SAC)$.<br>$MN$ là đường trung bình của tam giác $CBD$ ⇒ $MN \\parallel BD$, cắt trung tuyến $CO$ tại trung điểm ⇒ $E$ là trung điểm $OC$. <b>c) Đúng.</b>', mp: { ABCD: 1, SAC: 2 }, doan: { AC: 1, BD: 1, MN: 1 }, hot: ['MN'], diem: ['E'] },
    { ten: 'd · Mặt (GMN)', chu: 'Tìm $H = SA \\cap (GMN)$: chọn mặt phụ $(SAC) \\supset SA$. Giao tuyến $(GMN) \\cap (SAC)$: $G \\in SO \\subset (SAC)$; $E \\in MN$ và $E \\in AC$ ⇒ hai điểm chung $G, E$ ⇒ giao tuyến là $EG$.', mp: { GMN: 2, SAC: 2 }, doan: { AC: 1, SO: 1, MN: 1, GM: 1, GN: 1, EG: 1 }, hot: ['EG'] },
    { ten: 'd · Kéo dài EG', chu: 'Kéo dài $EG$ trong mặt $(SAC)$ — nó cắt $SA$ tại $H$. Vì $H \\in EG \\subset (GMN)$ nên $H = SA \\cap (GMN)$.', mp: { GMN: 2, SAC: 2 }, doan: { AC: 1, SO: 1, MN: 1, GM: 1, GN: 1, EG: 2 }, hot: ['EG'], diem: ['H'] },
    { ten: 'd · Tính tỉ số', chu: 'Nhìn thẳng mặt $(SAC)$. Định lí Menelaus cho tam giác $SAO$ với ba điểm thẳng hàng $H, G, E$:<br>$\\dfrac{AH}{HS} \\cdot \\dfrac{SG}{GO} \\cdot \\dfrac{OE}{EA} = 1$, với $\\dfrac{SG}{GO} = 2$, $\\dfrac{OE}{EA} = \\dfrac{\\frac12 OA}{\\frac32 OA} = \\dfrac13$.<br>⇒ $\\dfrac{AH}{HS} = \\dfrac32$ ⇒ $\\dfrac{SH}{SA} = \\dfrac25 \\ne \\dfrac37$. <b>d) Sai.</b>', mp: { SAC: 1 }, doan: { AC: 1, SO: 1, EG: 2 }, hot: ['EG'], diem: ['H', 'G', 'E', 'O'], nhin: 'SAC' },
  ],
},
{
  id: 'vd11-gk1-d3-tln3', tab: 'Đề 3 · TLN Câu 3', loai: 'tln',
  nguon: NGUON + ' · Đề 3 · Phần III · Câu 3', ten: 'Giao điểm của MN với mặt (SAE)',
  de: 'Cho hình chóp $S.ABC$. Gọi $M, N, E$ lần lượt là trung điểm các cạnh $SB, SC, BC$. Gọi $I$ là giao điểm của đường thẳng $MN$ và mặt phẳng $(SAE)$. Tính tỉ số $\\dfrac{IM}{IN}$.',
  dap: '1',
  diem: b4,
  dinh: ['S', 'A', 'B', 'C'], mat: [['S', 'A', 'B'], ['S', 'B', 'C'], ['S', 'C', 'A'], ['A', 'B', 'C']], canh: ['SA', 'SB', 'SC', 'AB', 'BC', 'CA'],
  doan: { MN: {}, AE: {}, SE: {} },
  mp: {
    SAE: { ten: '(SAE)', da: ['S', 'A', 'E'], phu: ['I'], mau: 'hong' },
    SBC: { ten: '(SBC)', da: ['S', 'B', 'C'], phu: ['I'], mau: 'xanh' },
  },
  buoc: [
    { ten: 'Hình chóp', chu: '$M, N, E$ là trung điểm $SB, SC, BC$. Cần tìm giao điểm của <b>đường</b> $MN$ với <b>mặt</b> $(SAE)$.', doan: { MN: 1, AE: 1 }, diem: ['M', 'N', 'E'] },
    { ten: 'Mặt (SAE)', chu: 'Mở rộng mặt $(SAE)$ — mặt này đi qua đỉnh $S$ và trung tuyến $AE$ của đáy, cắt ngang hình chóp.', mp: { SAE: 2 }, doan: { MN: 1, AE: 1, SE: 1 } },
    { ten: 'Mặt phụ (SBC)', chu: 'Chọn mặt phụ $(SBC) \\supset MN$. Giao tuyến $(SAE) \\cap (SBC)$: chung $S$, và $E \\in BC$ nên chung $E$ ⇒ giao tuyến là $SE$.', mp: { SAE: 2, SBC: 2 }, doan: { MN: 1, AE: 1, SE: 1 }, hot: ['SE'] },
    { ten: 'Giao điểm I', chu: '$MN$ và $SE$ cùng nằm trong $(SBC)$ ⇒ cắt nhau tại $I$. Mà $I \\in SE \\subset (SAE)$ ⇒ $I = MN \\cap (SAE)$.', mp: { SBC: 1 }, doan: { MN: 1, AE: 1, SE: 1 }, hot: ['SE', 'MN'], diem: ['I'] },
    { ten: 'Tính tỉ số', chu: 'Nhìn thẳng mặt $(SBC)$. $MN$ là đường trung bình của tam giác $SBC$ ⇒ $MN \\parallel BC$. Theo Ta-lét: $\\dfrac{IM}{EB} = \\dfrac{SI}{SE} = \\dfrac{IN}{EC}$, mà $EB = EC$ ⇒ $\\dfrac{IM}{IN} = 1$.', mp: { SBC: 1 }, doan: { MN: 1, SE: 1 }, hot: ['MN'], diem: ['I', 'E'], nhin: 'SBC' },
  ],
},
]
})()
