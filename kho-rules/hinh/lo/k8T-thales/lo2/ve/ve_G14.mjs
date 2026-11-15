// ve_G14.mjs — hình đề + hình lời giải TCHH-3.II.28. Chạy: node ve_G14.mjs (từ thư mục h8t2)
import { P, seg, segDash, tick, dot, label, mid, doiXung, dist, trongTam, hinh, xuatTat } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'

const OUT = 'C:/Users/WBPC/AppData/Local/Temp/claude/0ce3df5438caf103/cf0b21d3-a89a-437b-ae80-9b607bdf58bb/scratchpad/h8t2/hinh_G14'
const dots = (...ps) => ps.map(dot).join('')
const near = (a, b, e = 0.5) => console.assert(Math.abs(a - b) < e, 'sai dữ kiện', a, b)
const NP = { pad: 40, padDuoi: 50 }

// ABC lệch; AM trung tuyến; I = trung điểm BM; E đối xứng A qua I (IE = IA); N = trung điểm EC
function cau28(voiLg) {
  const A = P(170, 40), B = P(40, 180), C = P(400, 180)
  const M = mid(B, C), I = mid(B, M), E = doiXung(A, I), N = mid(E, C)
  near(dist(I, A), dist(I, E), 0.01); near(dist(B, M), dist(M, C), 0.01); near(dist(E, N), dist(N, C), 0.01)
  const pts = [A, B, C, M, I, E, N]
  const g = trongTam([A, B, C])
  hinh(voiLg ? 'TCHH-3-II-28_lg' : 'TCHH-3-II-28', pts, [
    seg(A, B), seg(B, C), seg(C, A), seg(A, M), seg(A, E), seg(E, C),
    voiLg ? segDash(B, E) : '', voiLg ? segDash(M, N) : '',
    tick(B, I, 1, 0.5), tick(I, M, 1, 0.5), tick(A, I, 2, 0.5), tick(I, E, 2, 0.5),
    tick(B, M, 3, 0.1), tick(M, C, 3, 0.75), tick(E, N, 4, 0.5), tick(N, C, 4, 0.5),
    dots(...pts),
    label(A, 'A', -4, -16), label(B, 'B', -18, 8), label(C, 'C', 18, 8), label(M, 'M', 20, -10),
    label(I, 'I', 18, 22), label(E, 'E', -8, 28), label(N, 'N', 20, 18),
  ], NP)
}
cau28(false)
cau28(true)

await xuatTat(OUT)
