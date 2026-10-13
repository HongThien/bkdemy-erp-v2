// Vẽ lại hình — gói HH00021-1 (Đối đỉnh, Hình 7). TỆP MẪU của luồng vẽ lại hình (Thùy 13/10).
//   node scripts/anh/ve_lai/HH00021-1.mjs [<thu_muc_ra>]
// Quy ước: mỗi hình một khối { }; dựng điểm bằng số đo CỦA ĐỀ (ray/rot/mid/foot/inter…), không chép toạ độ ước mắt từ ảnh cũ.
import { P, seg, angleMark, sector, ray, dot, label, angleText, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/HH00021-1/moi'

// HHC000695 — hai đường thẳng xx′, yy′ cắt nhau tại O (không cho số đo)
{
  const O = P(0, 0), x = ray(O, -18, 230), x1 = ray(O, 162, 230), y = ray(O, 58, 200), y1 = ray(O, 238, 200)
  hinh('HHC000695', [x, x1, y, y1], [seg(x1, x), seg(y1, y), dot(O),
    label(O, 'O', -4, -16), label(x, 'x', 0, 30), label(x1, 'x′', 4, -12), label(y, 'y', 20, 8), label(y1, 'y′', 22, 6)])
}

// HHC000696 — như trên, cho góc x′Oy′ = 65° (đề hỏi góc xOy, x′Oy)
{
  const O = P(0, 0), x = ray(O, -18, 230), x1 = ray(O, 162, 230)
  const y1 = ray(O, 162 + 65, 200), y = ray(O, 162 + 65 - 180, 200) // góc x′Oy′ = 65° đúng số đo
  hinh('HHC000696', [x, x1, y, y1], [sector(O, x1, y1, 46), seg(x1, x), seg(y1, y), angleMark(O, x1, y1, 46), dot(O),
    angleText(O, x1, y1, '65°', 76),
    label(O, 'O', 6, -16), label(x, 'x', 0, 30), label(x1, 'x′', 4, -12), label(y, 'y', 20, 8), label(y1, 'y′', 22, 6)])
}

await xuatTat(RA)
