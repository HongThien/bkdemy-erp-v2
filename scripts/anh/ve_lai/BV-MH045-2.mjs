// Vẽ lại hình — gói BV-MH045-2 (MH.045 Hai đường thẳng song song, Hình 7 · Luyện · biến thể của BT.07.045.02/03).
//   node scripts/anh/ve_lai/BV-MH045-2.mjs [<thu_muc_ra>]
// Hai đường thẳng nằm ngang SONG SONG THẬT (số đo trên hình khiến chúng song song); cát tuyến dựng bằng ray theo đúng số đo.
import { P, seg, angleMark, ray, dot, label, labelOut, angleText, goc, hinh, xuatTat } from '../ve_hinh_lib.mjs'

const RA = process.argv[2] || 'C:/Users/WBPC/bk-kho-lam-viec/ve-lai-hinh/BV-MH045-2/moi'
const H = 130   // khoảng cách hai đường thẳng
const EXT = 50  // cát tuyến kéo dài ra ngoài hai đường thẳng
const RAD = Math.PI / 180

// Cát tuyến cắt đường trên tại hoành độ Tx; al = góc (độ) của tia hướng LÊN so với chiều dương trục x.
function tv(Tx, al) {
  const T = P(Tx, 0)
  const B = ray(T, al + 180, H / Math.sin(al * RAD))
  return { T, B, top: ray(T, al, EXT), bot: ray(B, al + 180, EXT) }
}

// ── MỘT cát tuyến (hình ngắn của BT.07.045.02) ──
// top: 'ur' = góc giữa tia phải của đường trên và tia lên của cát tuyến · 'll' = giữa tia trái và tia xuống
// bot: 'ul' = góc giữa tia trái của đường dưới và tia lên của cát tuyến
function mot(ten, { al, nm: [nl, nr, ml, mr], pt: [nT, nB], end: [eT, eB], top, bot }) {
  const { T, B, top: Et, bot: Eb } = tv(0, al)
  const xL = Math.min(T.x, B.x) - 150, xR = Math.max(T.x, B.x) + 150
  const Lt = P(T.x - 100, 0), Rt = P(T.x + 100, 0), Lb = P(B.x - 100, H)
  console.assert(Math.abs(goc(B, Lb, Et) - (180 - al)) < 0.01, ten + ' goc duoi')
  const body = [
    seg(P(xL, 0), P(xR, 0)), seg(P(xL, H), P(xR, H)), seg(Et, Eb),
    top.k === 'ur' ? angleMark(T, Rt, Et, 32) : angleMark(T, Lt, Eb, 32),
    angleMark(B, Lb, Et, 32),
    top.k === 'ur' ? angleText(T, Rt, Et, top.t, 80) : angleText(T, Lt, Eb, top.t, 80),
    angleText(B, Lb, Et, bot.t, 70),
    dot(T), dot(B),
    label(T, nT, -26, -12), label(B, nB, 28, 32),
    label(P(xL, 0), nl, 0, -12), label(P(xR, 0), nr, 0, -12),
    label(P(xL, H), ml, 0, -12), label(P(xR, H), mr, 0, -12),
    eT ? labelOut(Et, eT, B, 22) : '', eB ? labelOut(Eb, eB, T, 22) : '',
  ]
  if (top.k === 'ur') console.assert(Math.abs(goc(T, Rt, Et) - al) < 0.01, ten + ' goc tren')
  else console.assert(Math.abs(goc(T, Lt, Eb) - al) < 0.01, ten + ' goc tren')
  hinh(ten, [P(xL, 0), P(xR, 0), P(xL, H), P(xR, H), Et, Eb], body)
}

// ── HAI cát tuyến (hình của BT.07.045.03) ──
// A,B = cát tuyến 1 (A trên, B dưới); C,D = cát tuyến 2. a1 = góc xAB = góc ABD; a2 = góc (tia lên của cát tuyến 2, tia phải đường trên).
// tx = [số đo ở A (tia trái – cát tuyến xuống), số đo ở B (tia phải – cát tuyến lên), số đo ở C].
function hai(ten, { a1, a2, nm: [nl, nr, ml, mr], pt: [nA, nB, nC, nD], end: [e1t, e1b, e2t, e2b], tx: [n1, n2, n3] }) {
  const t1 = tv(0, a1), t2 = tv(135, a2)
  const A = t1.T, B = t1.B, C = t2.T, D = t2.B
  const xL = Math.min(A.x, B.x) - 45, xR = Math.max(C.x, D.x) + 45
  const LA = P(A.x - 100, 0), RB = P(B.x + 100, H), RC = P(C.x + 100, 0), RD = P(D.x + 100, H)
  console.assert(Math.abs(goc(A, LA, B) - a1) < 0.01, ten + ' goc A')
  console.assert(Math.abs(goc(B, RB, A) - a1) < 0.01, ten + ' goc B')
  console.assert(Math.abs(goc(C, RC, t2.top) - a2) < 0.01, ten + ' goc C')
  console.assert(Math.abs(goc(D, RD, C) - a2) < 0.01, ten + ' dong vi D')
  const body = [
    seg(P(xL, 0), P(xR, 0)), seg(P(xL, H), P(xR, H)), seg(t1.top, t1.bot), seg(t2.top, t2.bot),
    angleMark(A, LA, B, 30), angleMark(B, RB, A, 30), angleMark(C, RC, t2.top, 30),
    angleText(A, LA, B, n1, 66), angleText(B, RB, A, n2, 66), angleText(C, RC, t2.top, n3, 62),
    dot(A), dot(B), dot(C), dot(D),
    label(A, nA, -26, -12), label(B, nB, 28, 32), label(C, nC, -28, 34), label(D, nD, -28, 34),
    label(P(xL, 0), nl, 0, -12), label(P(xR, 0), nr, 0, -12),
    label(P(xL, H), ml, 0, -12), label(P(xR, H), mr, 0, -12),
    e1t ? labelOut(t1.top, e1t, B, 22) : '', e1b ? labelOut(t1.bot, e1b, A, 22) : '',
    e2t ? labelOut(t2.top, e2t, D, 22) : '', e2b ? labelOut(t2.bot, e2b, C, 22) : '',
  ]
  hinh(ten, [P(xL, 0), P(xR, 0), P(xL, H), P(xR, H), t1.top, t1.bot, t2.top, t2.bot], body)
}

// 1) e24f… — pp' ∥ qq', cát tuyến rr' qua C, D: góc rCp' = 55°, góc CDq = 125°
mot('e24f34ad-b24b-4326-b9d1-5a73227d6953', { al: 55, nm: ['p', 'p′', 'q', 'q′'], pt: ['C', 'D'], end: ['r', 'r′'], top: { k: 'ur', t: '55°' }, bot: { t: '125°' } })

// 2) 7395… — uu' ∥ vv', cát tuyến ss' qua E, F: góc sEu' = 80°, góc EFv = 100°
mot('739548fa-07c1-4b03-87f4-ec01b60d4a92', { al: 80, nm: ['u', 'u′', 'v', 'v′'], pt: ['E', 'F'], end: ['s', 's′'], top: { k: 'ur', t: '80°' }, bot: { t: '100°' } })

// 3) 2a88… — ĐỀ + lời giải: xx' ∥ yy', M, N; góc xMN = 55°, góc MNy = 125° (ảnh cũ ghi a,b,c,P,Q, 68°/112° — vênh, vẽ theo lời giải)
mot('2a8878e2-0c62-44f3-bd3c-056367d448f0', { al: 55, nm: ['x', 'x′', 'y', 'y′'], pt: ['M', 'N'], end: [null, null], top: { k: 'll', t: '55°' }, bot: { t: '125°' } })

// 4) 394d… — xx' ∥ yy' (A,B,C,D): xAB = ABD = 72°, tCx' = 118°
hai('394d83f2-28a6-4712-adff-a0eb97337d35', { a1: 72, a2: 118, nm: ['x', 'x′', 'y', 'y′'], pt: ['A', 'B', 'C', 'D'], end: ['z', 'z′', 't', 't′'], tx: ['72°', '72°', '118°'] })

// 5) daa1… — theo ĐỀ + lời giải: aa' ∥ bb' (M,N,P,Q): aMN = MNQ = 65°, dPa' = 124° (ảnh cũ ghi x,y,z,t, 72°/118° — vênh)
hai('daa1387e-72a6-4f1a-b98d-cbbc78301302', { a1: 65, a2: 124, nm: ['a', 'a′', 'b', 'b′'], pt: ['M', 'N', 'P', 'Q'], end: [null, null, 'd', null], tx: ['65°', '65°', '124°'] })

// 6) 20c0… — mm' ∥ nn' (E,F,G,H): mEF = EFH = 78°, yGm' = 112°
hai('20c0b59d-cb29-4323-a363-7f8a6beea4b4', { a1: 78, a2: 112, nm: ['m', 'm′', 'n', 'n′'], pt: ['E', 'F', 'G', 'H'], end: ['x', 'x′', 'y', 'y′'], tx: ['78°', '78°', '112°'] })

// 7) 1888… — xx' ∥ yy' (P,Q,R,S): xPQ = PQS = 60°, bRx' = 130°
hai('18880415-bffe-464c-8465-2557147c43d5', { a1: 60, a2: 130, nm: ['x', 'x′', 'y', 'y′'], pt: ['P', 'Q', 'R', 'S'], end: ['a', null, 'b', null], tx: ['60°', '60°', '130°'] })

// 8) 6c73… — mm' ∥ nn' (U,V,P,Q): mUV = UVQ = 68°, tPm' = 121°
hai('6c735d0c-e402-4ea8-9c20-d2d034aaf499', { a1: 68, a2: 121, nm: ['m', 'm′', 'n', 'n′'], pt: ['U', 'V', 'P', 'Q'], end: ['z', 'z′', 't', 't′'], tx: ['68°', '68°', '121°'] })

await xuatTat(RA)
