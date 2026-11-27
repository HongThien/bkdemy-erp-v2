// k5v-G22.mjs — vẽ lại 10 hình: 3 hình tam giác vuông nội tiếp đường tròn (đường kính BC) + 7 bảng "đường kính → chu vi"
//   node scripts/anh/ve_moi/k5v-G22.mjs "<gói>\moi"
import { P, seg, circle, dot, label, num, labelOut, rightAngle, sideText, trongTam, mid, dist, hinh, xuatTat } from '../ve_hinh_lib.mjs'
import { bang, ra, baoCao } from './k5-HK2-chung.mjs'
const out = process.argv[2]
if (!out) { console.error('Dùng: node k5v-G22.mjs <thu_muc_moi>'); process.exit(2) }
const ok = (t, c) => { if (!c) { console.error('✗', t); process.exit(1) } console.log('✔', t) }

// ── 3 hình tam giác vuông + đường tròn (quy chuẩn: A góc dưới trái, AC ngang, B trên)
function tron(ten, ab, ac, bc, dv, s) {
  const A = P(0, 0), C = P(ac * s, 0), B = P(0, -ab * s)
  const O = mid(B, C), r = dist(B, C) / 2
  ok(`${ten}: AB²+AC²=BC² (${ab},${ac},${bc})`, ab * ab + ac * ac === bc * bc)
  ok(`${ten}: BC = ${bc}${dv} theo tỉ lệ`, Math.abs(dist(B, C) - bc * s) < 1e-6)
  ok(`${ten}: A nằm trên đường tròn (OA = r)`, Math.abs(dist(O, A) - r) < 1e-6)
  ok(`${ten}: góc A vuông`, Math.abs((B.x - A.x) * (C.x - A.x) + (B.y - A.y) * (C.y - A.y)) < 1e-6)
  const G = trongTam([A, B, C])
  const body = [
    circle(O, r), seg(A, B), seg(A, C), seg(B, C), rightAngle(A, B, C, 14), dot(O),
    labelOut(A, 'A', O, 22), labelOut(B, 'B', O, 22), labelOut(C, 'C', O, 22),
    // O: lệch xuống dưới-trái BC (phía không có A)
    label(P(O.x - 4, O.y), 'O', -10, 26),
    sideText(A, B, `${ab} ${dv}`, G, -34), // trong tam giác, bên phải AB
    sideText(A, C, `${ac} ${dv}`, G, 22),  // dưới AC
    // phía ngoài tam giác của BC, dịch về phía C cho khỏi sát chấm O
    (() => { const m = mid(B, C), u = P((C.x - B.x) / (2 * r), (C.y - B.y) / (2 * r)), n = P(-u.y, u.x); const sg = Math.sign((m.x - G.x) * n.x + (m.y - G.y) * n.y); return num(P(m.x + u.x * 55 + n.x * sg * 26, m.y + u.y * 55 + n.y * sg * 26), `${bc} ${dv}`, 0, 7.5, 22) })(),
  ]
  hinh(ten, [P(O.x - r, O.y - r), P(O.x + r, O.y + r), A, C, B], body, { pad: 44, padDuoi: 44 })
}
tron('T105000000811', 6, 8, 10, 'cm', 27)
tron('T105000000817', 9, 12, 15, 'dm', 19)
tron('T105000000819', 9, 12, 15, 'dm', 19)
await xuatTat(out)

// ── 7 bảng
const B7 = {
  T105100407001: [['6 dm', '2,5 dm', '10 cm', '4 m']],
  T105100407002: [['8 dm', '1,5 dm', '20 cm', '5 m']],
  T105100407003: [['4 dm', '2,5 cm', '0,5 m', '12 cm']],
  T105100407004: [['7 dm', '3,5 dm', '2 cm', '1,5 m']],
  T105100407005: [['9 dm', '2 cm', '0,5 dm', '2,5 m']],
  T105100407006: [['5 dm', '1,5 cm', '30 cm', '0,8 m']],
  T105100407007: [['3 dm', '2,5 m', '4 cm', '1,2 m']],
}
for (const [ten, [dk]] of Object.entries(B7)) {
  const cho = '..................'
  const { body, w, h } = bang([205, 125, 125, 125, 125], [
    ['Đường kính hình tròn', ...dk],
    ['Chu vi hình tròn', cho, cho, cho, cho],
  ], [50, 58], 20)
  await ra(out, ten, w, h, body)
}

const ghi = (t) => `${t}: vẽ lại theo đề`
baoCao(out,
  [
    { ma_cau: 'T105000000811', ghi_chu: 'Tam giác vuông A (AB=6, AC=8, BC=10 cm) nội tiếp đường tròn tâm O đường kính BC; có ô vuông góc A, chấm O; hướng AC ngang, B trên; không vẽ sẵn chu vi.' },
    { ma_cau: 'T105000000817', ghi_chu: 'Như trên với AB=9, AC=12, BC=15 dm; không vẽ sẵn diện tích.' },
    { ma_cau: 'T105000000819', ghi_chu: 'Ảnh cũ là ảnh chụp sách (mờ, cắt dòng chữ thừa trên đỉnh); vẽ lại AB=9, AC=12, BC=15 dm, không vẽ sẵn chu vi. Ảnh cũ viết 9/12 dm đúng đề.' },
    ...Object.keys(B7).map((m) => ({ ma_cau: m, ghi_chu: 'Bảng 2 hàng: Đường kính (4 số liệu theo đề) / Chu vi (4 ô chấm trống). Ảnh cũ là SVG nhúng JPEG, số liệu khớp lời giải.' })),
  ],
  [])
