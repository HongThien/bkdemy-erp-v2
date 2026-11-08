// Bổ sung 2 hình VT-1/VT-6 mà trạm bỏ vì "ảnh chia 4 phần, đề AB=3AI" — vẽ theo ĐỀ (luật vẽ lại hình: đề thắng ảnh): A, I (AI = AB/3), B trên một đoạn thẳng.
import { P, seg, dot, label, hinh, xuatTat } from '../ve_hinh_lib.mjs'
const RA = 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh'
for (const [goi, ten] of [['VT-1', 'T310010201006'], ['VT-6', 'T3100000001114']]) {
  const A = P(0, 0), B = P(330, 0), I = P(110, 0)
  hinh(ten, [A, B], [seg(A, B), dot(A), dot(I), dot(B), label(A, 'A', 0, -16), label(I, 'I', 0, -16), label(B, 'B', 0, -16)], { pad: 48, padDuoi: 40 })
  await xuatTat(`${RA}/${goi}/moi`)
}
