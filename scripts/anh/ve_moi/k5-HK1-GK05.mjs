// k5-HK1-GK05.mjs — Toán 5 HK1, Giữa kì 5: Câu 2 (T105000000319) hình thang, điểm trên đáy bé nối với hai đỉnh đáy lớn (đếm góc tù). Toạ độ đo từ hình sách.
import { P, seg, hinh, xuatTat, goc } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5-HK1-GK05.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }
const k = 0.62
const Q = (x, y) => P(x * k, y * k)
const BL = Q(45, 305), BR = Q(695, 305), TL = Q(220, 45), TR = Q(525, 45), M = Q(352, 45)
ok('đáy trên song song đáy dưới', TL.y === TR.y && BL.y === BR.y)
ok('M nằm trên đáy trên, giữa TL và TR', M.y === TL.y && M.x > TL.x && M.x < TR.x)
ok('hai cạnh bên không song song', Math.abs((TL.x - BL.x) * (BR.y - TR.y) - (TL.y - BL.y) * (BR.x - TR.x)) > 1)
console.log('  góc MBL.. :', goc(M, BL, TL).toFixed(1), goc(M, BR, TR).toFixed(1), goc(TL, BL, M).toFixed(1), goc(TR, BR, M).toFixed(1))
hinh('T105000000319', [TL, TR, BL, BR], [seg(TL, TR), seg(TR, BR), seg(BR, BL), seg(BL, TL), seg(M, BL), seg(M, BR)])
await xuatTat(dir)
