// Vẽ lại hình — gói HH00064-1 (Hình vuông, Hình học 8).
//   node scripts/anh/ve_lai/HH00064-1.mjs [<thu_muc_ra>]
// HH00064001: ABCD hình vuông (A trên-trái, B trên-phải, C dưới-phải, D dưới-trái); M ∈ AB; đường qua A vuông góc DM cắt BC tại N.
// Nét: bốn cạnh, DM, AN; ô góc vuông tại giao điểm của DM và AN (không đặt tên, như ảnh cũ).
// Lời giải dùng tam giác ADM, BAN — không cần điểm/đường phụ ⇒ hình _lg trùng hình _de (như ảnh lời giải cũ).
import { P, seg, rightAngle, dot, label, hinh, xuatTat, inter, goc, dist } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00064-1/moi'
const ok = (c, m) => console.assert(c, m)
const gan = (a, b, e = 0.05) => Math.abs(a - b) < e

const s = 280
const A = P(0, 0), B = P(s, 0), C = P(s, s), D = P(0, s)
const M = P(0.664 * s, 0)                                  // M ∈ AB
const N = P(s, M.x)                                        // AN có phương (s, AM) ⊥ DM có phương (AM, -s); N ∈ BC
const H = inter(A, N, D, M)
ok(gan(Math.abs((N.x - A.x) * (M.x - D.x) + (N.y - A.y) * (M.y - D.y)), 0, 0.01), 'AN ⊥ DM')
ok(N.y > 0 && N.y < s, 'N ∈ BC (trong cạnh)')
ok(gan(dist(A, B), dist(B, C)) && gan(dist(B, C), dist(C, D)) && gan(goc(A, B, D), 90), 'ABCD là hình vuông')

for (const ten of ['HH00064001_de', 'HH00064001_lg']) {
  hinh(ten, [A, B, C, D, M, N], [
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(D, M), seg(A, N),
    rightAngle(H, M, N, 12),
    dot(A), dot(B), dot(C), dot(D), dot(M), dot(N),
    label(A, 'A', -14, -10), label(M, 'M', 0, -14), label(B, 'B', 14, -10), label(N, 'N', 18, 8), label(D, 'D', -14, 26), label(C, 'C', 16, 26),
  ])
}

await xuatTat(RA)
