// ve_hinh_mh072.mjs — hình cho TỪNG GIẢ THIẾT của mô hình MH.072 "Hình chữ nhật trong tam giác vuông – Trung điểm M"
// (Thùy 22/10: "mỗi mô hình phải có hình vẽ tương ứng với giả thiết để người dùng còn hình dung được").
//   node scripts/anh/ve_hinh_mh072.mjs <thu_muc_ra>   rồi   node --env-file=.env scripts/anh/gan_hinh.mjs <thu_muc_ra> --bang mohinh [--ghi]
// Tên file = mã giả thiết (MH.xxx) ⇒ cột hinh_mo_hinh.anh_cau_hinh. Hình của một nhánh CỘNG DỒN giả thiết trên đường từ gốc xuống
// (nhánh chính: gốc → AH → K → I → MF⊥AK; nhánh phụ: P,Q từ gốc · O, J từ K). Chỉ vẽ dữ kiện, KHÔNG vẽ sẵn điều cần chứng minh.
// Hướng hình (Thùy 23/10): vuông tại A ⇒ A góc dưới trái, AB THẲNG ĐỨNG, AC NẰM NGANG; giả thiết có AB < AC ⇒ AB ngắn hẳn.
import { P, seg, tick, rightAngle, dot, labelOut, mid, foot, doiXung, hinh, xuatTat } from './ve_hinh_lib.mjs'

const dir = process.argv[2]
if (!dir) { console.error('Dùng: node scripts/anh/ve_hinh_mh072.mjs <thu_muc_ra>'); process.exit(2) }

const A = P(200, 300), B = P(200, 150), C = P(450, 300)        // AB = 150 < AC = 250
const M = mid(B, C)
const D = foot(M, A, B), E = foot(M, A, C)
const H = foot(A, B, C)
const Pp = mid(B, M), Q = mid(M, C)
const K = doiXung(M, E), I = doiXung(M, D), J = doiXung(B, E), O = mid(A, M)
const F = foot(M, A, K)
const G = P(310, 240)                                           // điểm "trong" để đẩy nhãn ra ngoài

const diem = (ds) => ds.map(([p]) => dot(p)).join('')
const nhan = (ds) => ds.map(([p, ten, tu]) => labelOut(p, ten, tu ?? G)).join('')
// gốc: tam giác vuông + MD, ME ⊥ AB, AC; BM = MC (vạch lệch khỏi giữa đoạn để không đè chân H)
const goc = (giuTickBC = true) => ({
  ve: [seg(A, B), seg(B, C), seg(C, A), seg(M, D), seg(M, E),
    rightAngle(A, B, C), rightAngle(D, M, A, 12), rightAngle(E, M, A, 12), giuTickBC ? tick(B, M, 1, 0.3) + tick(M, C, 1, 0.7) : ''],
  diem: [[A, 'A'], [B, 'B'], [C, 'C'], [M, 'M', A], [D, 'D', P(D.x + 20, D.y + 20)], [E, 'E', P(E.x + 20, E.y - 20)]],
})
const ghep = (...phan) => ({ ve: phan.flatMap((x) => x.ve), diem: phan.flatMap((x) => x.diem) })
const xep = (ten, h) => hinh(ten, h.diem.map(([p]) => p), [...h.ve, diem(h.diem), nhan(h.diem)])

const AH = { ve: [seg(A, H), rightAngle(H, A, C, 12)], diem: [[H, 'H', A]] }
const KK = { ve: [seg(E, K), tick(M, E, 2), tick(E, K, 2)], diem: [[K, 'K', E]] }
const II = { ve: [seg(D, I), tick(M, D, 3), tick(D, I, 3)], diem: [[I, 'I', D]] }

xep('MH.072', goc())                                                                    // giả thiết mô hình
xep('MH.100', ghep(goc(false), { ve: [tick(B, Pp, 1), tick(Pp, M, 1), tick(M, Q, 1), tick(Q, C, 1)], diem: [[Pp, 'P', A], [Q, 'Q', A]] }))   // P, Q trung điểm MB, MC
xep('MH.101', ghep(goc(), AH))                                                          // nhánh chính 2: AH ⊥ BC
xep('MH.102', ghep(goc(), AH, KK))                                                      // nhánh chính 3: K đối xứng M qua E
xep('MH.103', ghep(goc(), AH, KK, { ve: [seg(A, M), tick(A, O, 4), tick(O, M, 4)], diem: [[O, 'O', D]] }))          // phụ: O trung điểm AM
xep('MH.104', ghep(goc(), AH, KK, { ve: [seg(B, J), tick(B, E, 5, 0.22), tick(E, J, 5, 0.78)], diem: [[J, 'J', E]] }))  // phụ: J đối xứng B qua E
xep('MH.105', ghep(goc(), AH, KK, II))                                                  // nhánh chính 4: I đối xứng M qua D
xep('MH.106', ghep(goc(), AH, KK, II, { ve: [seg(A, K), seg(M, F), rightAngle(F, M, K, 12)], diem: [[F, 'F', M]] }))  // nhánh chính 5: MF ⊥ AK
await xuatTat(dir)
