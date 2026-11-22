// ve-bode.mjs — 7 hình cho LÝ THUYẾT + VÍ DỤ bài HH00162 "Bổ đề hình thang" khối 8T (Thùy 22/11).
//   node kho-rules/hinh/lo/k8T-thales/lt/ve-bode.mjs        → kho-rules/hinh/lo/k8T-thales/lt/ra/<ten>.png + .svg
// Hình thang ABCD, AB ∥ CD (AB là đáy nhỏ, AB : CD = 1 : 2), I = AD ∩ BC, O = AC ∩ BD. Toạ độ DỰNG theo công thức (không ước mắt).
// bode_mot: đường thẳng qua I cắt AB tại M, CD tại N (MA:MB = 2:3) · bode_hai: đường thẳng qua O cắt AB tại M, CD tại N ·
// bode_ba: đường thẳng IO (M, N sẽ là trung điểm) · bode_dao: M, N là trung điểm (đánh dấu gạch bằng nhau) ·
// bode_vd_trung_diem: M trung điểm AB, MO cắt CD tại N · bode_song_song: EF qua O song song hai đáy · bode_tam_giac: tam giác ABC, EF ∥ BC, BF ∩ CE = O.
// Hình chỉ vẽ DỮ KIỆN (không đánh dấu điều phải chứng minh).
import { P, seg, dot, label, lerp, inter, tick, hinh, xuatTat } from '../../../../../scripts/anh/ve_hinh_lib.mjs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
const RA = join(dirname(fileURLToPath(import.meta.url)), 'ra')
const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds) => ds.map(([p, t, dx, dy]) => label(p, t, dx, dy)).join('')

const I = P(180, 30), D = P(40, 210), C = P(360, 210)
const A = lerp(I, D, 0.5), B = lerp(I, C, 0.5)                    // AB ∥ DC, AB = DC/2 ⇒ I, A, D thẳng hàng và A là trung điểm ID
const O = inter(A, C, B, D)
const M1 = lerp(A, B, 0.4)                                         // MA : MB = 2 : 3
const N1 = inter(I, M1, D, C)                                      // đường thẳng IM cắt CD
const N2 = inter(M1, O, D, C)                                      // đường thẳng MO cắt CD
const Mt = lerp(A, B, 0.5), Nt = lerp(D, C, 0.5)                   // trung điểm hai đáy (I, Mt, O, Nt thẳng hàng)
const day = [seg(A, B), seg(D, C)]
const chanTam = [[A, 'A', -20, 4], [B, 'B', 20, 4], [C, 'C', 16, 28], [D, 'D', -16, 28]]

// 1) bổ đề 1: qua I
hinh('bode_mot', [I, D, C], [seg(I, D), seg(I, C), ...day, seg(I, N1), diem([[I], [A], [B], [C], [D], [M1], [N1]]),
  nhan([[I, 'I', 0, -14], ...chanTam, [M1, 'M', 16, -8], [N1, 'N', 0, 32]])])
// 2) bổ đề 2: qua O
hinh('bode_hai', [A, B, C, D, M1, N2], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(M1, N2), diem([[A], [B], [C], [D], [O], [M1], [N2]]),
  nhan([[A, 'A', -20, 4], [B, 'B', 20, 4], [C, 'C', 16, 28], [D, 'D', -16, 28], [O, 'O', -12, 36], [M1, 'M', -2, -14], [N2, 'N', 0, 32]])])
// 3) bổ đề 3: đường thẳng IO cắt AB, CD tại M, N
hinh('bode_ba', [I, D, C], [seg(I, D), seg(I, C), ...day, seg(A, C), seg(B, D), seg(I, Nt), diem([[I], [A], [B], [C], [D], [O], [Mt], [Nt]]),
  nhan([[I, 'I', 0, -14], ...chanTam, [O, 'O', -12, 36], [Mt, 'M', 18, -8], [Nt, 'N', 0, 32]])])
// 4) hệ quả: M, N trung điểm (gạch bằng nhau)
hinh('bode_dao', [I, D, C], [seg(I, D), seg(I, C), ...day, seg(A, C), seg(B, D), seg(I, Nt), tick(A, Mt, 1), tick(Mt, B, 1), tick(D, Nt, 2), tick(Nt, C, 2), diem([[I], [A], [B], [C], [D], [O], [Mt], [Nt]]),
  nhan([[I, 'I', 0, -14], ...chanTam, [O, 'O', -12, 36], [Mt, 'M', 18, -8], [Nt, 'N', 0, 32]])])
// 5) ví dụ 3: M trung điểm AB, MO cắt CD tại N
hinh('bode_vd_trung_diem', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(Mt, Nt), tick(A, Mt, 1), tick(Mt, B, 1), diem([[A], [B], [C], [D], [O], [Mt], [Nt]]),
  nhan([[A, 'A', -20, 4], [B, 'B', 20, 4], [C, 'C', 16, 28], [D, 'D', -16, 28], [O, 'O', -12, 36], [Mt, 'M', 0, -14], [Nt, 'N', 0, 32]])])
// 6) ví dụ 4: EF qua O song song hai đáy, E ∈ AD, F ∈ BC
{
  const E = P(A.x + (D.x - A.x) * ((O.y - A.y) / (D.y - A.y)), O.y), F = P(B.x + (C.x - B.x) * ((O.y - B.y) / (C.y - B.y)), O.y)
  hinh('bode_song_song', [A, B, C, D], [seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(A, C), seg(B, D), seg(E, F), diem([[A], [B], [C], [D], [O], [E], [F]]),
    nhan([[A, 'A', -20, 4], [B, 'B', 20, 4], [C, 'C', 16, 28], [D, 'D', -16, 28], [O, 'O', -2, 36], [E, 'E', -18, 6], [F, 'F', 18, 6]])])
}
// 7) ví dụ 5: tam giác ABC, M trung điểm BC, EF ∥ BC, BF ∩ CE = O (không vẽ AM)
{
  const A3 = P(150, 20), B3 = P(50, 200), C3 = P(350, 200), M3 = lerp(B3, C3, 0.5), E3 = lerp(A3, B3, 0.55), F3 = lerp(A3, C3, 0.55)
  const O3 = inter(B3, F3, C3, E3)
  hinh('bode_tam_giac', [A3, B3, C3], [seg(A3, B3), seg(B3, C3), seg(C3, A3), seg(E3, F3), seg(B3, F3), seg(C3, E3), tick(B3, M3, 1), tick(M3, C3, 1), diem([[A3], [B3], [C3], [M3], [E3], [F3], [O3]]),
    nhan([[A3, 'A', 0, -14], [B3, 'B', -16, 28], [C3, 'C', 16, 28], [M3, 'M', 0, 32], [E3, 'E', -18, 6], [F3, 'F', 18, 6], [O3, 'O', 0, 28]])])
}
await xuatTat(RA)
