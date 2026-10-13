// Vẽ lại hình — gói BV-MH045-3 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · biến thể của BT.07.045.04). Thùy 13/10.
//   node scripts/anh/ve_lai/BV-MH045-3.mjs [<thu_muc_ra>]
// Hai đường song song nằm ngang (trên / dưới), hai cát tuyến (trái / phải). Dựng bằng ray: cát tuyến trái nghiêng góc a so với đường trên
// (tia lên-phải), cát tuyến phải tạo góc b với tia phải của đường trên ở phía dưới (tia xuống-phải). Số đo ghi: a ở hai giao điểm bên trái
// (đồng vị), b ở giao điểm trên bên phải — đúng như ảnh cũ.
import { P, seg, angleMark, ray, dot, label, angleText, goc, labelOut, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH045-3/moi'

/**
 * ten = tên tệp ra; [dTren, dDuoi] = tên 2 đường ngang; [cTrenT, cDuoiT] = tên 2 đầu cát tuyến trái; [cTrenP, cDuoiP] = cát tuyến phải;
 * [U1, L1, U2, L2] = tên 4 giao điểm (trên-trái, dưới-trái, trên-phải, dưới-phải).
 */
function mh(ten, [dTren, dDuoi], [zT, zD], [tT, tD], [U1n, L1n, U2n, L2n], a, b) {
  const H = 120, kcach = 150
  const U1 = P(0, 0), U2 = P(kcach, 0)
  const L1 = ray(U1, 180 + a, H / Math.sin(a * Math.PI / 180))   // xuống-trái
  const L2 = ray(U2, -b, H / Math.sin(b * Math.PI / 180))        // xuống-phải
  const zTop = ray(U1, a, 72), zBot = ray(L1, 180 + a, 55)
  const tTop = ray(U2, 180 - b, 72), tBot = ray(L2, -b, 55)
  const xR1 = P(U2.x + 70, 0), xR2 = P(L2.x + 70, H)
  const xL = Math.min(zBot.x, L1.x) - 22
  const hTrenT = P(xL, 0), hTrenP = P(Math.max(xR1.x, tBot.x + 22), 0)
  const hDuoiT = P(xL, H), hDuoiP = P(Math.max(xR2.x, tBot.x + 22), H)
  // kiểm: song song thật, đúng số đo
  console.assert(Math.abs(L1.y - H) < 1e-6 && Math.abs(L2.y - H) < 1e-6)
  console.assert(Math.abs(goc(U1, zTop, hTrenP) - a) < 0.01, ten + ' a trên')
  console.assert(Math.abs(goc(L1, P(L1.x + (zTop.x - U1.x), L1.y + (zTop.y - U1.y)), hDuoiP) - a) < 0.01, ten + ' a dưới')
  console.assert(Math.abs(goc(U2, hTrenP, L2) - b) < 0.01, ten + ' b')
  const rr = 30
  const body = [
    seg(hTrenT, hTrenP), seg(hDuoiT, hDuoiP), seg(zBot, zTop), seg(tBot, tTop),
    angleMark(U1, zTop, hTrenP, rr), angleMark(L1, zTop, hDuoiP, rr),
    angleMark(U2, hTrenP, L2, rr),
    angleText(U1, zTop, hTrenP, a + '°', 64),
    angleText(L1, zTop, hDuoiP, a + '°', 64),
    angleText(U2, hTrenP, L2, b + '°', b < 60 ? 70 : 64),
    dot(U1), dot(L1), dot(U2), dot(L2),
    label(U1, U1n, -20, -12), label(U2, U2n, 18, -12),
    label(L1, L1n, 24, 28), label(L2, L2n, -24, 28),
    labelOut(zTop, zT, U1, 20), labelOut(zBot, zD, L1, 20),
    labelOut(tTop, tT, U2, 20), labelOut(tBot, tD, L2, 20),
    label(hTrenP, dTren, 16, 8), label(hDuoiP, dDuoi, 16, 8),
  ]
  hinh(ten, [hTrenT, hTrenP, hDuoiT, hDuoiP, zTop, zBot, tTop, tBot], body)
}

// Mx ∥ Ny; ∠zMx = ∠zNy = 70°; ∠xPQ = 65°
mh('6cac0d82-c901-4f51-bff0-230fe203c35c', ['x', 'y'], ['z', 'z′'], ['t', 't′'], ['M', 'N', 'P', 'Q'], 70, 65)
// Pa ∥ Qb; ∠cPa = ∠cQb = 60°; ∠aRS = 70°
mh('53354772-3510-44f0-8df8-f8bcc5dbf5a3', ['a', 'b'], ['c', 'c′'], ['d', 'd′'], ['P', 'Q', 'R', 'S'], 60, 70)
// Am ∥ Bn; ∠xAm = ∠xBn = 68°; ∠mCD = 62°
mh('0fdde83f-697a-4866-8cb8-659a1bb8f6c1', ['m', 'n'], ['x', 'x′'], ['y', 'y′'], ['A', 'B', 'C', 'D'], 68, 62)
// Ea ∥ Fb; ∠mEa = ∠mFb = 72°; ∠aGH = 58°
mh('5d256817-12cf-4c8e-8b11-4d86862409a8', ['a', 'b'], ['m', 'm′'], ['n', 'n′'], ['E', 'F', 'G', 'H'], 72, 58)
// Kc ∥ Ld; ∠zKc = ∠zLd = 66°; ∠cMN = 52°
mh('eaad6316-a89a-4435-97df-f67fd0c45abf', ['c', 'd'], ['z', 'z′'], ['t', 't′'], ['K', 'L', 'M', 'N'], 66, 52)

await xuatTat(RA)
