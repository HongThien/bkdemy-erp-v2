// Gói TH-10 — 5 câu TN song song / vuông góc bị bỏ ở đợt TH-1…9 vì hình lộ đáp án; Thùy 20/10 chốt "vẽ hình minh hoạ (không đánh dấu kết luận)".
// Quy ước: chỉ đánh dấu ĐIỀU ĐỀ CHO (cặp góc bằng nhau bằng cung cùng bán kính, góc vuông bằng ô vuông); KHÔNG vẽ mũi tên song song, KHÔNG đánh dấu kết luận.
//   node scripts/anh/ve_lai/TH-10.mjs [<thu_muc_ra>]
import { P, seg, angleMark, ray, dot, label, rightAngle, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/TH-10/moi'

// c cắt a, b (a, b nằm ngang); c lập với a góc 60°. Trả về các điểm và hai tia ngang.
function catNgang() {
  const D = 150, A = P(0, 0), B = ray(A, 240, D / Math.sin(Math.PI / 3)) // c: từ A đi xuống-trái 60° so với phương ngang tới B
  const aT = P(-120, 0), aP = P(190, 0), bT = P(B.x - 150, D), bP = P(B.x + 150, D)
  const cTren = ray(A, 60, 80), cDuoi = ray(B, 240, 70)
  return { A, B, aT, aP, bT, bP, cTren, cDuoi, D }
}

// HHC002779 và HHC002796 — c cắt a, b; một cặp góc so le trong bằng nhau (đề không cho số đo)
for (const ten of ['HHC002779', 'HHC002796']) {
  const { A, B, aT, aP, bT, bP, cTren, cDuoi } = catNgang()
  hinh(ten, [aT, aP, bT, bP, cTren, cDuoi], [
    seg(aT, aP), seg(bT, bP), seg(cTren, cDuoi), dot(A), dot(B),
    angleMark(A, P(A.x + 90, A.y), B, 34), angleMark(B, P(B.x - 90, B.y), A, 34), // so le trong: ∠(Ax→phải, AB) và ∠(Bx→trái, BA)
    label(P(aP.x, aP.y), 'a', 14, -12), label(P(bP.x, bP.y), 'b', 14, -12), label(cTren, 'c', 14, -4),
  ])
}

// HHC002787 — c cắt a, b; một cặp góc đồng vị bằng nhau
{
  const { A, B, aT, aP, bT, bP, cTren, cDuoi } = catNgang()
  hinh('HHC002787', [aT, aP, bT, bP, cTren, cDuoi], [
    seg(aT, aP), seg(bT, bP), seg(cTren, cDuoi), dot(A), dot(B),
    angleMark(A, P(A.x + 90, A.y), cTren, 34), angleMark(B, P(B.x + 90, B.y), A, 34), // đồng vị: cùng phía phải, cùng phía trên của c
    label(P(aP.x, aP.y), 'a', 14, -12), label(P(bP.x, bP.y), 'b', 14, -12), label(cTren, 'c', 14, -4),
  ])
}

// HHC002786 — ba đường a, b, c phân biệt; a ∥ b (cùng nằm ngang, đề cho) và a ⊥ c (ô vuông). Không đánh dấu b ⊥ c.
{
  const D = 140, O = P(0, 0), aT = P(-190, 0), aP = P(190, 0), bT = P(-190, D), bP = P(190, D), cT = P(0, -60), cD = P(0, D + 60)
  hinh('HHC002786', [aT, aP, bT, bP, cT, cD], [
    seg(aT, aP), seg(bT, bP), seg(cT, cD), dot(O),
    rightAngle(O, P(O.x + 50, 0), P(0, 50), 14),
    label(aP, 'a', 14, -12), label(bP, 'b', 14, -12), label(cT, 'c', 16, 6),
  ])
}

// HHC002836 — a ⊥ c, b ⊥ c (đề cho): hai ô vuông; không vẽ ký hiệu song song
{
  const D = 140, O1 = P(0, 0), O2 = P(0, D), aT = P(-190, 0), aP = P(190, 0), bT = P(-190, D), bP = P(190, D), cT = P(0, -60), cD = P(0, D + 60)
  hinh('HHC002836', [aT, aP, bT, bP, cT, cD], [
    seg(aT, aP), seg(bT, bP), seg(cT, cD), dot(O1), dot(O2),
    rightAngle(O1, P(O1.x + 50, 0), P(0, 50), 14), rightAngle(O2, P(O2.x + 50, D), P(0, D - 50), 14),
    label(aP, 'a', 14, -12), label(bP, 'b', 14, -12), label(cT, 'c', 16, 6),
  ])
}

await xuatTat(RA)
