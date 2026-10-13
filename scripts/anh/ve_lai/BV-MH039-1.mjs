// Vẽ lại hình — gói BV-MH039-1 (MH.039 Đối đỉnh thêm tia, Hình 7 · Luyện · biến thể).
//   node scripts/anh/ve_lai/BV-MH039-1.mjs [<thu_muc_ra>]
import { P, seg, ray, dot, label, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH039-1/moi'

// z′Oz nằm ngang; t, t′ đối nhau (t trên-phải ≈ 52°); tia a ở nửa trên phía trái (≈ 139°, không đối xứng với t). Không ghi số đo.
{
  const O = P(0, 0), z = ray(O, 0, 195), z1 = ray(O, 180, 195)
  const t = ray(O, 52, 175), t1 = ray(O, 232, 175), a = ray(O, 139, 160)
  console.assert(Math.abs(goc(O, z, z1) - 180) < 0.01)
  console.assert(Math.abs(goc(O, t, t1) - 180) < 0.01)
  hinh('81b5870c-c497-4028-8516-582f1fff3db9', [z, z1, t, t1, a], [
    seg(z1, z), seg(t1, t), seg(O, a), dot(O),
    label(O, 'O', 18, 30), labelOut(z, 'z', O, 22), labelOut(z1, 'z′', O, 22), labelOut(t, 't', O, 22), labelOut(t1, 't′', O, 22), labelOut(a, 'a', O, 22)])
}

await xuatTat(RA)
