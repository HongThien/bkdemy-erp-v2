// Vẽ lại hình — gói MH-5 (hình CẤU HÌNH của mô hình · Luyện): MH.064 Ứng dụng tiên đề Ơ-clit
//   node scripts/anh/ve_lai/MH-5.mjs [<thu_muc_ra>]
// Mô hình chưa có hình bài toán vẽ lại ⇒ dựng theo giả thiết + ảnh cũ.
// Ảnh cũ: AB, AC, BC, đường N–A–M (nằm ngang, qua A), BM (qua D), CN (qua E); không ô vuông, không gạch bằng nhau.
import { P, seg, dot, label, mid, doiXung, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/MH-5/moi'
const ok = (cond, msg) => console.assert(cond, 'SAI: ' + msg)
const near = (a, b, e = 0.01) => Math.abs(a - b) < e
const dd = (...p) => p.map(dot).join('')

// ───── MH.064 ─────
// Tam giác thường ABC (BC ngang, A trên lệch trái: tỉ lệ đúng ảnh cũ — BC : lệch : cao = 374 : 124 : 313).
// D trung điểm AC, E trung điểm AB, M = đối xứng B qua D (DM = DB), N = đối xứng C qua E (EN = EC).
{
  const k = 0.55
  const B = P(0, 0), C = P(374 * k, 0), A = P(124 * k, -313 * k)
  const D = mid(A, C), E = mid(A, B)
  const M = doiXung(B, D), N = doiXung(C, E)
  ok(near(dist(D, M), dist(D, B)) && near(dist(E, N), dist(E, C)), 'DM = DB, EN = EC')
  ok(near(M.y, A.y, 1e-6) && near(N.y, A.y, 1e-6), 'M, A, N thẳng hàng (hệ quả: AM ∥ BC)')
  ok(near(dist(A, M), dist(B, C), 1e-6) && near(dist(A, N), dist(B, C), 1e-6), 'AM = AN = BC (hệ quả)')
  hinh('MH.064', [A, B, C, M, N], [
    seg(N, M), seg(A, B), seg(A, C), seg(B, C), seg(B, M), seg(C, N),
    dd(A, B, C, D, E, M, N),
    label(N, 'N', 0, -14), label(A, 'A', 0, -14), label(M, 'M', 0, -14),
    label(B, 'B', -17, -8), label(C, 'C', 17, -8),
    label(E, 'E', -10, -14), label(D, 'D', 30, 12)])
}

await xuatTat(RA)
