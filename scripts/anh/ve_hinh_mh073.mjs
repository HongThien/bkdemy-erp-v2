// ve_hinh_mh073.mjs — hình cho TỪNG GIẢ THIẾT của mô hình MH.073 "Hình chữ nhật trong tam giác vuông – Chân đường cao H"
//   node scripts/anh/ve_hinh_mh073.mjs <thu_muc_ra>   rồi   node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc_ra> --bang mohinh [--ghi]
// Tên file = mã giả thiết. Cây (dựng 23/10 bởi scripts/kho/hl-chuoi-mh073.mjs): gốc MH.073 · phụ MH.116 (M) → chính MH.117 (O, xy ⊥ OM)
// · phụ MH.118 (K, J) · phụ MH.119 (G, L) · phụ MH.120 (P, Q) · chính MH.121 (I, K) → phụ MH.122 (F), phụ MH.123 (R, S).
// Hình một nhánh CỘNG DỒN giả thiết trên đường từ gốc xuống; chỉ vẽ dữ kiện, không vẽ sẵn điều cần chứng minh.
// Hướng hình (Thùy 23/10): vuông tại A ⇒ A góc dưới trái, AB THẲNG ĐỨNG, AC NẰM NGANG. Tam giác vẽ lệch (AB < AC) — mô hình tổng quát.
import { P, seg, tick, rightAngle, dot, label, labelOut, mid, foot, doiXung, inter, add, vec, mul, hinh, xuatTat } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_mh073.mjs <thu_muc_ra>'); process.exit(2) }

const A = P(200, 300), B = P(200, 120), C = P(450, 300)        // AB = 180 < AC = 250
const H = foot(A, B, C), D = foot(H, A, B), E = foot(H, A, C), O = mid(A, H)
const M = mid(B, C)
const G0 = P(300, 245)                                          // điểm "trong" để đẩy nhãn ra ngoài
const di = (dx, dy) => (p) => P(p.x - dx, p.y - dy)             // nhãn lệch về hướng (dx, dy)

const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds) => ds.map(([p, ten, tu]) => labelOut(p, ten, typeof tu === 'function' ? tu(p) : tu ?? G0)).join('')
const ghep = (...phan) => ({ ve: phan.flatMap((x) => x.ve), diem: phan.flatMap((x) => x.diem ?? []), them: phan.flatMap((x) => x.them ?? []) })
const xep = (ten, h) => hinh(ten, [...h.diem.map(([p]) => p), ...h.them], [...h.ve, diem(h.diem), nhan(h.diem)])

// gốc: tam giác vuông tại A, đường cao AH, HD ⊥ AB, HE ⊥ AC
const gocV = (huongD = di(-1, 0)) => ({
  ve: [seg(A, B), seg(B, C), seg(C, A), seg(A, H), seg(H, D), seg(H, E),
    rightAngle(A, B, C), rightAngle(H, A, C, 12), rightAngle(D, H, A, 12), rightAngle(E, H, A, 12)],
  diem: [[A, 'A', di(-1, 1)], [B, 'B', di(-1, -1)], [C, 'C', di(1, 1)], [H, 'H', A], [D, 'D', huongD], [E, 'E', di(0, 1)]],
})
const goc = gocV()
const DE = { ve: [seg(D, E)], diem: [[O, 'O', di(-1, 0)]] }
// MH.116: M trung điểm BC (vạch lệch khỏi chân H)
const MM = { ve: [tick(B, M, 1, 0.3), tick(M, C, 1, 0.5)], diem: [[M, 'M', A]] }
// MH.117: O = AH ∩ DE; qua A kẻ xy ⊥ OM
const u = (() => { const v = vec(O, M), l = Math.hypot(v.x, v.y); return P(-v.y / l, v.x / l) })()
const X = add(A, mul(u, 90)), Y = add(A, mul(u, -200))
const XY = { ve: [seg(O, M), seg(X, Y), label(add(X, mul(u, 18)), 'x', 0, 9), label(add(Y, mul(u, -18)), 'y', 0, 9)], them: [X, Y] }
// MH.118: E trung điểm AK; J = DK ∩ HE
const K1 = doiXung(A, E), J = inter(D, K1, H, E)
const KJ = { ve: [seg(D, K1), tick(A, E, 2), tick(E, K1, 2)], diem: [[K1, 'K', di(0, 1)], [J, 'J', di(1, -0.6)]] }
// MH.119: D trung điểm AG (G trên tia AB, quá B); L = EG ∩ HD
const G = doiXung(A, D), L = inter(E, G, H, D)
const GL = { ve: [seg(B, G), seg(E, G), tick(A, D, 2, 0.3), tick(D, G, 2, 0.25)], diem: [[G, 'G', di(-1, -0.3)], [L, 'L', di(0.3, -1)]] }
// MH.120: qua C kẻ đường song song AH, cắt DH, DE tại P, Q
const C2 = add(C, vec(A, H)), Pp = inter(D, H, C, C2), Q = inter(D, E, C, C2)
const PQ = { ve: [seg(H, Pp), seg(D, E), seg(E, Q), seg(Pp, Q), seg(C, Pp)], diem: [[Pp, 'P', di(1, -0.4)], [Q, 'Q', di(1, 0.4)]] }
// MH.121: I trung điểm HC, K đối xứng A qua I
const I = mid(H, C), K2 = doiXung(A, I)
const IK = { ve: [seg(A, K2), tick(H, I, 1, 0.5), tick(I, C, 1, 0.5), tick(A, I, 2, 0.3), tick(I, K2, 2, 0.5)], diem: [[I, 'I', di(-0.3, -1)], [K2, 'K', di(1, -0.3)]] }
// MH.122: O = AH ∩ DE; AK cắt CO tại F
const F = inter(A, K2, C, O)
const FF = { ve: [seg(C, O)], diem: [[F, 'F', di(0.2, 1)]] }
// MH.123: R, S trung điểm AH, CK
const R = mid(A, H), S = mid(C, K2)
const RS = { ve: [seg(C, K2), tick(A, R, 3), tick(R, H, 3), tick(C, S, 4), tick(S, K2, 4)], diem: [[R, 'R', di(1, 0.2)], [S, 'S', di(1, 0)]] }

xep('MH.073', ghep(goc))
xep('MH.116', ghep(goc, MM))
xep('MH.117', ghep(gocV(di(0.6, -1)), MM, DE, XY))   // nhãn D lên trên-phải: đường xy đi sát bên trái AB
xep('MH.118', ghep(goc, DE, KJ))
xep('MH.119', ghep(goc, DE, GL))
xep('MH.120', ghep(goc, PQ))
xep('MH.121', ghep(goc, IK))
xep('MH.122', ghep(goc, IK, DE, FF))
xep('MH.123', ghep(goc, IK, RS))
await xuatTat(dir)
