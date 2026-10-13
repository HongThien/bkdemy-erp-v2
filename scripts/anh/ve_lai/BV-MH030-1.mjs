// Vẽ lại hình — gói BV-MH030-1 (MH.030, biến thể đổi tên điểm: tứ giác MNPQ có M̂ = N̂ và NP = MQ)
//   node scripts/anh/ve_lai/BV-MH030-1.mjs [<thu_muc_ra>]
// Dựng: M, N trên cạnh trên; Q, P ở cùng phía dưới, QMN = MNP = 117°, MQ = NP (⇒ P, Q đối xứng qua trung trực MN — do ĐỀ ép, không phải thêm).
import { P, seg, tick, angleMark, sector, ray, dot, label, hinh, xuatTat, dist, goc } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH030-1/moi'

function dung() {
  const th = 117, L = 212
  const M = P(0, 0), N = P(190, 0)
  const Q = ray(M, -th, L), Pp = ray(N, -(180 - th), L)
  console.assert(Math.abs(goc(M, N, Q) - th) < 0.01 && Math.abs(goc(N, M, Pp) - th) < 0.01, 'M = N')
  console.assert(Math.abs(dist(M, Q) - dist(N, Pp)) < 0.01, 'MQ = NP')
  return { M, N, P: Pp, Q }
}

// Cả ba hình (BT .01/.02/.03) dùng đúng một hình gốc như ảnh cũ: có hai đường chéo QN, PM; chỉ ký hiệu M̂ = N̂ và MQ = NP (giả thiết) — KHÔNG đánh dấu điều phải chứng minh
for (const ten of ['a42a623a-92e6-4e6b-b262-a1ea18023d55', '322a53d5-c713-4f46-857e-d605cdb16fc9', '23188c13-03cf-445b-bdea-746b005eb857']) {
  const { M, N, P: Pp, Q } = dung()
  hinh(ten, [M, N, Pp, Q], [sector(M, N, Q, 30), sector(N, M, Pp, 30), angleMark(M, N, Q, 30), angleMark(N, M, Pp, 30),
    seg(M, N), seg(N, Pp), seg(Pp, Q), seg(Q, M), seg(Q, N), seg(M, Pp), tick(M, Q, 2), tick(N, Pp, 2),
    dot(M), dot(N), dot(Pp), dot(Q),
    label(M, 'M', -6, -14), label(N, 'N', 6, -14), label(Pp, 'P', 20, 24), label(Q, 'Q', -20, 24)])
}

await xuatTat(RA)
