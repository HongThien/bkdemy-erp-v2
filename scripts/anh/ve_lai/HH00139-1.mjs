// Vẽ lại hình — gói HH00139-1 (Ôn thi giữa kì I, Hình học 8).
//   node scripts/anh/ve_lai/HH00139-1.mjs [<thu_muc_ra>]
// Ảnh cũ là ảnh chụp cái bàn (mặt bàn hình thang cân, 4 chân, chụp nghiêng từ một góc). Câu hỏi hỏi "mặt bàn hình gì" nên phải giữ đúng góc nhìn
// của ảnh: vẽ lại bằng nét, mặt bàn nhìn xiên (mép sau dài, mép trước ngắn, hai mép bên nghiêng vào) + 4 chân bàn, không ghi tên điểm / số đo.
// Toạ độ lấy theo bố cục ảnh chụp (đề không ràng buộc số đo nào, ảnh chụp là dữ kiện duy nhất).
import { P, poly, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00139-1/moi'
const trang = (pts) => `<path d="M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="#fff"/>`

// HHC002529 — mặt bàn (hình thang cân nhìn xiên) + 4 chân bàn
{
  const L = P(0, 21), T = P(268, 0), R = P(327, 20), N = P(140, 41)   // 4 góc mặt bàn (L–T mép sau dài ∥ N–R mép trước)
  const d = 6                                                          // bề dày mặt bàn
  const Ld = P(L.x, L.y + d), Rd = P(R.x, R.y + d), Nd = P(N.x, N.y + d)
  const chan = (x0, x1, y0, y1) => [P(x0, y0), P(x1, y0), P(x1, y1), P(x0, y1)]
  const c3 = chan(250, 264, 30, 128), c1 = chan(28, 48, 29, 164), c4 = chan(293, 312, 25, 158), c2 = chan(128, 147, 46, 187)
  const body = []
  for (const c of [c3, c1, c4, c2]) body.push(trang(c), poly(c))
  body.push(trang([L, Nd, Rd, R, N]), poly([L, Ld, Nd, Rd, R]))       // cạnh dày phía trước
  body.push(trang([L, T, R, N]), poly([L, T, R, N]))                  // mặt bàn
  body.push(`<line x1="${N.x}" y1="${N.y}" x2="${Nd.x}" y2="${Nd.y}"/>`)
  hinh('HHC002529', [L, T, R, P(147, 187), P(28, 164)], body, { pad: 30, padDuoi: 30 })
}

await xuatTat(RA)
