// Vẽ lại hình đề giữa kì I Toán 7 — THCS Nguyễn Trường Tộ (GKI-16, tai_lieu 0d9f73f3…) — Thùy 16/10.
//   node scripts/anh/ve_lai/DT-GKI-16-K7.mjs [<thu_muc_ra>]
// Tên tệp ra = <mã câu>_de  (gan_hinh: đuôi _de = chỉ gắn hình ĐỀ, lời giải của hai câu này chưa có hình).
import { P, seg, angleMark, sector, ray, dot, label, bien, num, rightAngle, angleText, angleBien, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/DT-GKI-16-K7/moi'

// HHC002810 — Câu 4: a // b nằm ngang, cùng vuông góc với đường thẳng đứng qua C; AB cắt hai đường tại A (trên), B (dưới);
// C trên đường dưới, bên trái B; góc 120° ở A (giữa tia hướng lên của AB và tia ngang bên phải); x = góc ABC.
{
  const D = 150                                   // khoảng cách hai đường ngang
  const A = P(0, 0)
  const B = ray(A, -60, D / Math.sin(Math.PI / 3)) // AB lập với đường ngang bên phải A góc 120° ⇒ đi xuống phải 60° so với phương ngang
  const C = P(-105, D), Hc = P(-105, 0)            // giao của đường đứng với đường ngang trên
  const aTren = ray(A, 120, 70), bDuoi = ray(B, -60, 42)
  const traiT = P(-165, 0), phaiT = P(195, 0), traiD = P(-165, D), phaiD = P(195, D)
  const dinh = P(-105, -55), day = P(-105, D + 55)
  hinh('HHC002810_de', [traiT, phaiT, traiD, phaiD, aTren, bDuoi, dinh, day], [
    seg(traiT, phaiT), seg(traiD, phaiD), seg(dinh, day), seg(aTren, bDuoi),
    rightAngle(Hc, P(Hc.x + 50, 0), P(Hc.x, 50), 14), rightAngle(C, P(C.x + 50, D), P(C.x, D - 50), 14),
    sector(A, aTren, P(A.x + 70, 0), 30), angleMark(A, aTren, P(A.x + 70, 0), 30), angleText(A, aTren, P(A.x + 70, 0), '120°', 62),
    sector(B, A, C, 36), angleMark(B, A, C, 36), angleBien(B, A, C, 'x', 66),
    dot(A), dot(B), dot(C),
    label(A, 'A', -20, 22), label(B, 'B', -2, 34), label(C, 'C', -22, 22),
  ], { pad: 36, padDuoi: 44 })
}

// HHC002811 — Bài 4: xx′ // yy′ // tt′ (nằm ngang), đường đứng qua A, H, K vuông góc với yy′ và tt′; zz′ đi qua A, B, C;
// B ∈ yy′, C ∈ tt′, B giữa A và C; ∠xAC = 50° (x ở bên trái A, C ở dưới-trái A); ∠AHy′ = ∠AKt′ = 90°.
{
  const A = P(0, 0)
  const dH = 105, dK = 210                        // yy′ cách xx′ 105, tt′ cách xx′ 210
  const dirAC = 180 + 50                          // tia AC lập với tia Ax (hướng trái) góc 50°
  const B = ray(A, dirAC, dH / Math.sin(50 * Math.PI / 180)), C = ray(A, dirAC, dK / Math.sin(50 * Math.PI / 180))
  const H = P(0, dH), K = P(0, dK)
  const x = P(-205, 0), x1 = P(70, 0), y = P(-205, dH), y1 = P(70, dH), t = P(-205, dK), t1 = P(70, dK)
  const z = ray(A, 50, 62), z1 = ray(C, dirAC, 44)
  const dinh = P(0, -50), day = P(0, dK + 44)
  hinh('HHC002811_de', [x, x1, y, y1, t, t1, z, z1, dinh, day], [
    seg(x, x1), seg(y, y1), seg(t, t1), seg(dinh, day), seg(z, z1),
    rightAngle(H, y1, A, 14), rightAngle(K, t1, H, 14),
    sector(A, x, C, 40), angleMark(A, x, C, 40), angleText(A, x, C, '50°', 70),
    dot(A), dot(B), dot(C), dot(H), dot(K),
    label(A, 'A', -22, -8), label(B, 'B', 22, 24), label(C, 'C', 22, 24), label(H, 'H', 24, 24), label(K, 'K', 24, 24),
    label(x, 'x', -2, -10), label(x1, 'x′', 14, 10), label(y, 'y', -2, -10), label(y1, 'y′', 14, 10), label(t, 't', -2, -10), label(t1, 't′', 14, 10),
    label(z, 'z', 16, 0), label(z1, 'z′', 0, 26),
  ], { pad: 34, padDuoi: 42 })
}

await xuatTat(RA)
