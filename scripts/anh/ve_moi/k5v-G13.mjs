// k5v-G13.mjs — gói G13 (kho Đại K5, "Diện tích các hình"): 6 hình HCN ABCD + H trên AB (tam giác HDC tô), tam giác vuông ABC, 2 ảnh "hình nào là hình thang".
//   node scripts/anh/ve_moi/k5v-G13.mjs "<thư mục gói>\moi"
import { P, seg, hinh, xuatTat, fill, dot, label, num, rightAngle, sideText, dist } from '../ve_hinh_lib.mjs'
const dir = process.argv[2]
if (!dir) { console.error('Dùng: node k5v-G13.mjs <thu_muc_ra>'); process.exit(2) }
const ok = (t, c) => { console.log(c ? '✔' : '✗', t); if (!c) process.exit(1) }

// ── HCN ABCD, H trên AB; dài/rộng theo ĐỀ (rộng = diện tích : dài) ──
const hcn = (ten, dai, rong, t = 0.37) => {
  const L = 380, W = L * rong / dai
  const A = P(0, 0), B = P(L, 0), C = P(L, W), D = P(0, W), H = P(L * t, 0)
  ok(`${ten}: tỉ lệ rộng/dài = ${rong}/${dai}`, Math.abs(dist(A, D) / dist(A, B) - rong / dai) < 1e-9)
  ok(`${ten}: H nằm giữa A và B, không trùng đỉnh`, H.x > 20 && H.x < L - 20 && H.y === A.y)
  ok(`${ten}: H không là trung điểm AB (không đặc biệt)`, Math.abs(t - 0.5) > 0.05)
  hinh(ten, [A, B, C, D], [
    fill([H, D, C]),
    seg(A, B), seg(B, C), seg(C, D), seg(D, A), seg(H, D), seg(H, C),
    dot(A), dot(B), dot(C), dot(D), dot(H),
    label(A, 'A', -2, -14), label(H, 'H', 0, -14), label(B, 'B', 2, -14),
    label(D, 'D', -2, 32), label(C, 'C', 2, 32),
  ])
}
hcn('T105000000953', 9, 31.5 / 9, 0.37)    // 9 × 3,5
hcn('T105000000954', 12, 45.6 / 12, 0.33)  // 12 × 3,8
hcn('T105000000955', 5, 18.5 / 5, 0.40)    // 5 × 3,7
hcn('T105000000956', 10, 42 / 10, 0.36)    // 10 × 4,2
hcn('T105000000957', 15, 63 / 15, 0.38)    // 15 × 4,2
hcn('T105000000958', 8, 33.6 / 8, 0.35)    // 8 × 4,2
hcn('T105100402038', 37, 24, 0.34)         // AB = 37, BC = 24

// ── Tam giác vuông ABC: AB = 14 cm (đứng), AC = 2 dm = 20 cm (ngang), vuông tại A ──
{
  const k = 15
  const A = P(0, 210), B = P(0, 210 - 14 * k), C = P(20 * k, 210)
  ok('T105100402025: AB:AC = 14:20', Math.abs(dist(A, B) / dist(A, C) - 14 / 20) < 1e-9)
  ok('T105100402025: vuông tại A', (B.x - A.x) * (C.x - A.x) + (B.y - A.y) * (C.y - A.y) === 0)
  hinh('T105100402025', [A, B, C, P(-60, 100)], [
    seg(A, B), seg(B, C), seg(C, A), rightAngle(A, B, C, 16),
    dot(A), dot(B), dot(C),
    label(A, 'A', -14, 28), label(B, 'B', 0, -14), label(C, 'C', 14, 28),
    sideText(A, B, '14 cm', C, 40), sideText(A, C, '2 dm', B, 26),
  ], { pad: 56 })
}

// ── Bốn hình: tam giác / tứ giác / ngũ giác / hình thang (đều theo toạ độ ảnh cũ, thu 0,5) ──
const poly4 = (pts) => pts.map((p) => P(p.x / 2, p.y / 2))
const slope = (a, b) => (b.y - a.y) / (b.x - a.x)
const song2 = (a, b, c, d) => Math.abs((b.x - a.x) * (d.y - c.y) - (b.y - a.y) * (d.x - c.x)) < 1e-6
const bon = (ten, hs) => {
  const parts = [], all = []
  const x0 = hs.map((h) => h.ten)
  hs.forEach((h) => {
    const pts = poly4(h.pts)
    parts.push(fill(pts), `<path d="M ${pts.map((p) => `${p.x} ${p.y}`).join(' L ')} Z" fill="none"/>`)
    const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length
    parts.push(num(P(cx, 175), `Hình <tspan font-style="italic">${h.ten}</tspan>`, 0, 0, 26))
    all.push(...pts, P(cx - 40, 150), P(cx + 40, 175))
  })
  hinh(ten, all, parts, { pad: 20, padDuoi: 30 })
  return x0
}
const co = (a) => a.map(([x, y]) => P(x, y))
{
  // M tam giác · N tứ giác không có cặp cạnh song song · P ngũ giác · Q hình thang vuông
  const N = co([[360 + 0, 120], [520, 80], [600, 220], [380, 300]])
  const Qh = co([[1010, 100], [1130, 100], [1230, 280], [1010, 280]])
  ok('G13 A: N không có cặp cạnh đối song song', !song2(N[0], N[1], N[3], N[2]) && !song2(N[1], N[2], N[0], N[3]))
  ok('G13 A: Q có cạnh trên ∥ cạnh dưới', song2(Qh[0], Qh[1], Qh[3], Qh[2]))
  ok('G13 A: Q có cạnh bên không song song (hình thang, không phải bình hành)', !song2(Qh[1], Qh[2], Qh[0], Qh[3]))
  bon('T1050000001000', [
    { ten: 'M', pts: co([[140, 80], [280, 280], [40, 280]]) },
    { ten: 'N', pts: N },
    { ten: 'P', pts: co([[800, 60], [920, 150], [870, 290], [730, 290], [680, 150]]) },
    { ten: 'Q', pts: Qh },
  ])
}
{
  // E hình thang cân · G tứ giác không song song · H tam giác · K tứ giác không song song
  const E = co([[120, 120], [240, 120], [280, 280], [40, 280]])
  const G = co([[420, 140], [550, 90], [590, 290], [370, 260]])
  const K = co([[1000, 120], [1160, 80], [1240, 220], [1020, 300]])
  ok('G13 B: E có cạnh trên ∥ cạnh dưới', song2(E[0], E[1], E[3], E[2]))
  ok('G13 B: E hai cạnh bên không song song', !song2(E[1], E[2], E[0], E[3]))
  ok('G13 B: G không có cặp cạnh đối song song', !song2(G[0], G[1], G[3], G[2]) && !song2(G[1], G[2], G[0], G[3]))
  ok('G13 B: K không có cặp cạnh đối song song', !song2(K[0], K[1], K[3], K[2]) && !song2(K[1], K[2], K[0], K[3]))
  bon('T1050000001001', [
    { ten: 'E', pts: E },
    { ten: 'G', pts: G },
    { ten: 'H', pts: co([[780, 80], [920, 280], [680, 280]]) },
    { ten: 'K', pts: K },
  ])
}
await xuatTat(dir)
