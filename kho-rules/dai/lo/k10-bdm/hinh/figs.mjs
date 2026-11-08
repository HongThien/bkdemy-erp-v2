// Hình cho lý thuyết/ví dụ K10 (Thùy nhận xét 15/10: thiếu hình trục số, hình miền nghiệm; dạng "xác định BPT dựa vào miền nghiệm" chưa có ví dụ).
// key → { loai: 'truc'|'mien', mo_ta }.  PATCH ở patch.mjs: dạng → ví dụ thứ i → key + vị trí ('de' = trước "Hướng dẫn giải", 'giai' = sau).
const I = (l, r, lc, rc) => [l, r, lc, rc]
const m = (v, ten) => (ten ? { v, ten } : { v })

export const FIGS = {
  // ───────── TRỤC SỐ — NDB00519 giao ─────────
  gx1: { loai: 'truc', mo_ta: { moc: [m(-4), m(0), m(1), m(3)], hang: [{ ten: '(−4;1]', khoang: [I(-4, 1, false, true)], kieu: 'gach' }, { ten: '[0;3)', khoang: [I(0, 3, true, false)], kieu: 'gach' }], ket_qua: { ten: '∩', khoang: [I(0, 1, true, true)] } } },
  gx2: { loai: 'truc', mo_ta: { moc: [m(-1), m(0), m(4)], hang: [{ ten: 'A', khoang: [I(-1, null, false, false)], kieu: 'gach' }, { ten: 'B', khoang: [I(null, 4, false, true)], kieu: 'gach' }], ket_qua: { ten: 'A∩B', khoang: [I(-1, 4, false, true)] } } },
  // ───────── NDB00520 hợp ─────────
  hx1: { loai: 'truc', mo_ta: { moc: [m(-3), m(0), m(1), m(2)], hang: [{ ten: '(0;2]', khoang: [I(0, 2, false, true)], kieu: 'dam' }, { ten: '(−3;1]', khoang: [I(-3, 1, false, true)], kieu: 'dam' }], ket_qua: { ten: '∪', khoang: [I(-3, 2, false, true)] } } },
  hx2: { loai: 'truc', mo_ta: { moc: [m(-1), m(0), m(5), m(7)], hang: [{ ten: 'A', khoang: [I(-1, 5, false, true)], kieu: 'dam' }, { ten: 'B', khoang: [I(0, 7, true, false)], kieu: 'dam' }], ket_qua: { ten: 'A∪B', khoang: [I(-1, 7, false, false)] } } },
  // ───────── NDB00521 hiệu ─────────
  hieu2: { loai: 'truc', mo_ta: { moc: [m(1), m(3), m(5)], hang: [{ ten: 'A', khoang: [I(null, 3, false, false)], kieu: 'dam' }, { ten: 'B', khoang: [I(1, 5, false, true)], kieu: 'dam' }, { ten: 'A\\B', khoang: [I(null, 1, false, true)], kieu: 'kq' }, { ten: 'B\\A', khoang: [I(3, 5, true, true)], kieu: 'kq' }] } },
  // ───────── NDB00522 phần bù ─────────
  bu1: { loai: 'truc', mo_ta: { moc: [m(0), m(3)], hang: [{ ten: '(−∞;3)', khoang: [I(null, 3, false, false)], kieu: 'gach' }], ket_qua: { ten: 'ℝ∖', khoang: [I(3, null, true, false)] } } },
  bu2: { loai: 'truc', mo_ta: { moc: [m(-2), m(1), m(3), m(4), m(5)], hang: [
    { ten: 'A', khoang: [I(null, 3, false, false)], kieu: 'dam' }, { ten: 'ℝ∖A', khoang: [I(3, null, true, false)], kieu: 'kq' },
    { ten: 'B', khoang: [I(1, 5, false, true)], kieu: 'dam' }, { ten: 'ℝ∖B', khoang: [I(null, 1, false, true), I(5, null, false, false)], kieu: 'kq' },
    { ten: 'C', khoang: [I(-2, 4, true, true)], kieu: 'dam' }, { ten: 'ℝ∖C', khoang: [I(null, -2, false, false), I(4, null, false, false)], kieu: 'kq' }] } },
  bu3: { loai: 'truc', mo_ta: { moc: [m(7), m(22)], hang: [{ ten: 'A', khoang: [I(null, 7, false, true)], kieu: 'dam' }, { ten: 'B', khoang: [I(22, null, false, false)], kieu: 'dam' }], ket_qua: { ten: 'ℝ∖(A∪B)', khoang: [I(7, 22, false, true)] }, L: 80 } },
  // ───────── NDB00524 hình ảnh trục số ─────────
  tr1: { loai: 'truc', mo_ta: { moc: [m(-3), m(2), m(5), m(7)], hang: [{ ten: '[−3;5]', khoang: [I(-3, 5, true, true)], kieu: 'gach' }, { ten: '(2;7)', khoang: [I(2, 7, false, false)], kieu: 'gach' }], ket_qua: { ten: '∩', khoang: [I(2, 5, false, true)] } } },
  tr2: { loai: 'truc', mo_ta: { moc: [m(-2), m(3), m(7), m(9)], hang: [{ ten: '[3;9]', khoang: [I(3, 9, true, true)], kieu: 'dam' }, { ten: '[−2;7)', khoang: [I(-2, 7, true, false)], kieu: 'gach' }], ket_qua: { ten: 'A', khoang: [I(7, 9, true, true)] } } },
  // ───────── NDB00829 tập con (VD3) ─────────
  tc3: { loai: 'truc', mo_ta: { moc: [m(1, '1'), m(1.6, 'm'), m(2.6, 'm+1'), m(3, '3')], hang: [{ ten: 'A', khoang: [I(1, 3, true, true)], kieu: 'dam' }, { ten: 'B', khoang: [I(1.6, 2.6, true, true)], kieu: 'dam' }] } },
  // ───────── NDB00535 A ⊂ B (LT + VD) ─────────
  con_lt: { loai: 'truc', mo_ta: { moc: [m(0, 'c'), m(1, 'a'), m(3, 'b'), m(4, 'd')], hang: [{ ten: 'B', khoang: [I(0, 4, true, true)], kieu: 'dam' }, { ten: 'A', khoang: [I(1, 3, true, true)], kieu: 'dam' }] } },
  con1: { loai: 'truc', mo_ta: { moc: [m(1, '1'), m(1.5, 'm'), m(2.5, 'm+1'), m(3, '3')], hang: [{ ten: 'B', khoang: [I(1, 3, true, true)], kieu: 'dam' }, { ten: 'A', khoang: [I(1.5, 2.5, true, true)], kieu: 'dam' }] } },
  con2: { loai: 'truc', mo_ta: { moc: [m(-1, '−1'), m(-0.5, 'm'), m(1.5, 'm+2'), m(2, '2')], hang: [{ ten: 'B', khoang: [I(-1, 2, true, true)], kieu: 'dam' }, { ten: 'A', khoang: [I(-0.5, 1.5, true, true)], kieu: 'dam' }] } },
  con3: { loai: 'truc', mo_ta: { moc: [m(-2, '−2'), m(-0.5, 'm−1'), m(4, '4'), m(5.5, '2m+2')], hang: [{ ten: 'B', khoang: [I(-2, 5.5, false, false)], kieu: 'dam' }, { ten: 'A', khoang: [I(-0.5, 4, false, true)], kieu: 'dam' }] } },
  // ───────── NDB00536 A ∩ B = ∅ ─────────
  rong_lt: { loai: 'truc', mo_ta: { moc: [m(0, 'a'), m(1.5, 'b'), m(3, 'c'), m(4.5, 'd'), m(6, 'e'), m(7.5, 'f')], L: 78,
    hang: [{ ten: 'B', khoang: [I(3, 4.5, true, true)], kieu: 'dam' }, { ten: 'A (TH1)', khoang: [I(0, 1.5, true, true)], kieu: 'dam' }, { ten: 'A (TH2)', khoang: [I(6, 7.5, true, true)], kieu: 'dam' }] } },
  rong1: { loai: 'truc', mo_ta: { moc: [m(-1.2, 'm'), m(0.8, 'm+2'), m(1, '1'), m(4, '4'), m(4.8, 'm'), m(6.8, 'm+2')], L: 86,
    hang: [{ ten: 'B=[1;4)', khoang: [I(1, 4, true, false)], kieu: 'dam' }, { ten: 'A (TH1)', khoang: [I(-1.2, 0.8, false, false)], kieu: 'dam' }, { ten: 'A (TH2)', khoang: [I(4.8, 6.8, false, false)], kieu: 'dam' }] } },
  rong2: { loai: 'truc', mo_ta: { moc: [m(1.2, 'm'), m(2.2, '3m−1'), m(5, '3m+3')], L: 70,
    hang: [{ ten: 'A', khoang: [I(null, 1.2, false, false)], kieu: 'dam' }, { ten: 'B', khoang: [I(2.2, 5, true, true)], kieu: 'dam' }] } },
  // ───────── NDB00537 A ∩ B ≠ ∅ ─────────
  giao_lt: { loai: 'truc', mo_ta: { moc: [m(0, 'c'), m(1.5, 'a'), m(3, 'd'), m(4.5, 'b')], hang: [{ ten: 'B', khoang: [I(0, 3, true, true)], kieu: 'dam' }, { ten: 'A', khoang: [I(1.5, 4.5, true, true)], kieu: 'dam' }], ket_qua: { ten: 'A∩B', khoang: [I(1.5, 3, true, true)] } } },
  giao1: { loai: 'truc', mo_ta: { moc: [m(-2, '−2'), m(-0.5, 'm−1'), m(3, '2m+2'), m(4, '4')], L: 60,
    hang: [{ ten: 'B', khoang: [I(-2, 3, false, false)], kieu: 'dam' }, { ten: 'A', khoang: [I(-0.5, 4, false, true)], kieu: 'dam' }], ket_qua: { ten: 'A∩B', khoang: [I(-0.5, 3, false, false)] } } },

  // ───────── MIỀN NGHIỆM — NDB00538 ─────────
  mn1: { loai: 'mien', mo_ta: { x: [-2, 4.5], y: [-1.5, 3], nhan_truc: { x: [1, 2, 3, 4], y: [1, 2] }, bpt: [{ a: 1, b: 2, c: 3, dau: '<', nhan: 'd' }] } },
  mn2: { loai: 'mien', mo_ta: { x: [-4, 3], y: [-2, 3], nhan_truc: { x: [-3, -2, -1, 1, 2], y: [-1, 1, 2] }, bpt: [{ a: -1, b: 5, c: 2, dau: '>', nhan: 'd', nhan_tai: [-3.5, -1.1] }] } },
  mn3: { loai: 'mien', mo_ta: { x: [-8, 4], y: [-2, 7], pxu: 34, nhan_truc: { x: [-6, -4, -2, 2, 4], y: [2, 4, 6] }, bpt: [{ a: -1, b: 2, c: 8, dau: '>', nhan: 'd', nhan_tai: [-7.6, 0.2] }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: 6, dy: 16 }, { x: 1, y: 1, ten: 'A' }, { x: 1, y: 5, ten: 'B' }, { x: 4, y: 3, ten: 'C' }, { x: 0, y: 4, ten: 'D', dx: -16 }] } },
  // ───────── NDB00539 nghiệm của BPT ─────────
  ng1: { loai: 'mien', mo_ta: { x: [-3, 3], y: [-3, 3], nhan_truc: { x: [-2, -1, 1, 2], y: [-2, -1, 1, 2] }, bpt: [{ a: 2, b: 2, c: -3, dau: '>', nhan: 'd', nhan_tai: [-2.9, -0.4] }],
    diem: [{ x: 1, y: 1, ten: 'A' }, { x: -1, y: -2, ten: 'B' }, { x: 0, y: 1, ten: 'C', dx: 7 }, { x: 1, y: -1, ten: 'D' }] } },
  ng2: { loai: 'mien', mo_ta: { x: [-2, 4], y: [-2, 6], pxu: 34, nhan_truc: { x: [-1, 1, 2, 3], y: [-1, 1, 2, 3, 4, 5] }, bpt: [{ a: 2, b: -1, c: -1, dau: '<', nhan: 'd', nhan_tai: [2.3, 5.4], dx: 8 }],
    diem: [{ x: 0, y: -1, ten: 'A', dx: 8 }, { x: 3, y: 5, ten: 'B' }, { x: 1, y: 4, ten: 'C' }, { x: 2, y: -1, ten: 'D' }] } },
  // ───────── NDB00884 / 540 (hình trong đề) ─────────
  xd1: { loai: 'mien', mo_ta: { x: [-2, 5], y: [-4, 3], nhan_truc: { x: [-1, 1, 2, 3, 4], y: [-3, -2, -1, 1, 2] }, bpt: [{ a: 1, b: -1, c: 2, dau: '>', nhan: 'd', nhan_tai: [3.6, 1.5] }],
    diem: [{ x: 3, y: -1, ten: 'M' }, { x: 2, y: 0 }, { x: 0, y: -2 }] } },
  xd2: { loai: 'mien', mo_ta: { x: [-3, 6], y: [-4, 3], nhan_truc: { x: [-2, -1, 1, 2, 3, 4, 5], y: [-3, -2, -1, 1, 2] }, bpt: [{ a: 1, b: -2, c: 4, dau: '<=', nhan: 'd', nhan_tai: [-2.8, -3.4] }],
    diem: [{ x: 4, y: 0 }, { x: 0, y: -2 }] } },
  // dạng 540 — ví dụ mới
  hd540a: { loai: 'mien', mo_ta: { x: [-2, 6], y: [-2, 4], nhan_truc: { x: [-1, 1, 2, 3, 4, 5], y: [-1, 1, 2, 3] }, bpt: [{ a: 1, b: 2, c: 4, dau: '<=', nhan: 'd', nhan_tai: [4.6, 0.2] }], diem: [{ x: 0, y: 0, ten: 'O', dx: 6, dy: 16 }, { x: 4, y: 0 }, { x: 0, y: 2 }] } },
  hd540b: { loai: 'mien', mo_ta: { x: [-3, 4], y: [-4, 2], nhan_truc: { x: [-2, -1, 1, 2, 3], y: [-3, -2, -1, 1] }, bpt: [{ a: 3, b: -1, c: 3, dau: '>', nhan: 'd', nhan_tai: [1.4, -3.4] }], diem: [{ x: 0, y: 0, ten: 'O', dx: 6, dy: 16 }, { x: 1, y: 0 }, { x: 0, y: -3 }] } },
  // dạng 544 — ví dụ mới (hệ)
  hd544a: { loai: 'mien', mo_ta: { x: [-1.5, 4.5], y: [-1.5, 4.5], nhan_truc: { x: [1, 2, 3, 4], y: [1, 2, 3, 4] }, bpt: [{ a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }, { a: 1, b: 1, c: 3, dau: '<=', nhan: 'd', nhan_tai: [3.2, 1.1] }],
    diem: [{ x: 3, y: 0, ten: 'A', dy: 18 }, { x: 0, y: 3, ten: 'B' }] } },
  hd544b: { loai: 'mien', mo_ta: { x: [-1.5, 5], y: [-1.5, 4], nhan_truc: { x: [1, 2, 3, 4], y: [1, 2, 3] }, bpt: [{ a: 0, b: 1, c: 0, dau: '>' }, { a: 1, b: -1, c: 0, dau: '>', nhan: 'd₁', nhan_tai: [3.4, 3.6] }, { a: 1, b: 1, c: 4, dau: '<', nhan: 'd₂', nhan_tai: [3.0, 1.3] }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 4, y: 0, ten: 'A', dy: 18 }, { x: 2, y: 2, ten: 'B' }] } },
  // ───────── NDB00546 vẽ miền nghiệm hệ ─────────
  he1: { loai: 'mien', mo_ta: { x: [-1, 3.5], y: [-1, 5], pxu: 40, nhan_truc: { x: [1, 2, 3], y: [1, 2, 3, 4] }, bpt: [{ a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }, { a: 2, b: 1, c: 4, dau: '<=', nhan: 'd', nhan_tai: [2.4, 0.5] }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 2, y: 0, ten: 'A', dy: 18 }, { x: 0, y: 4, ten: 'B' }] } },
  he2: { loai: 'mien', mo_ta: { x: [-4, 4], y: [-2, 3.5], pxu: 40, nhan_truc: { x: [-3, -2, -1, 1, 2, 3], y: [-1, 1, 2, 3] }, bpt: [{ a: 1, b: 1, c: 2, dau: '<=', nhan: 'd', nhan_tai: [2.6, -0.5] }, { a: -1, b: 1, c: 2, dau: '<=', nhan: "d'", nhan_tai: [-3.6, -1.6] }, { a: 0, b: 1, c: -1, dau: '>', nhan: "d''", nhan_tai: [3.3, -0.9] }],
    diem: [{ x: 0, y: 2, ten: 'A' }, { x: -3, y: -1, ten: 'B', dx: -22 }, { x: 3, y: -1, ten: 'C' }] } },
  he3: { loai: 'mien', mo_ta: { x: [-1, 5.5], y: [-1, 4.5], pxu: 40, nhan_truc: { x: [1, 2, 3, 4, 5], y: [1, 2, 3, 4] }, bpt: [{ a: -1, b: 2, c: 6, dau: '<=', nhan: 'd₁', nhan_tai: [-0.8, 2.6] }, { a: 1, b: 1, c: 4, dau: '<=', nhan: 'd₂', nhan_tai: [4.2, 0.2] }, { a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 4, y: 0, ten: 'A', dy: 18 }, { x: 2 / 3, y: 10 / 3, ten: 'B' }, { x: 0, y: 3, ten: 'C', dx: -16 }] } },
  // ───────── NDB00886 miền nghiệm là đa giác ─────────
  da1: { loai: 'mien', mo_ta: { x: [-3.5, 4.5], y: [-3, 4], pxu: 38, nhan_truc: { x: [-3, -2, -1, 1, 2, 3, 4], y: [-2, -1, 1, 2, 3] },
    bpt: [{ a: -3, b: 2, c: 6, dau: '<=' }, { a: 5, b: 3, c: 9, dau: '<=' }, { a: -2, b: -5, c: 4, dau: '<=' }],
    diem: [{ x: -2, y: 0, ten: 'A', dx: -18 }, { x: 0, y: 3, ten: 'B' }, { x: 3, y: -2, ten: 'C' }, { x: 0, y: 0, ten: 'O', dx: 6, dy: 16 }] } },
  da2: { loai: 'mien', mo_ta: { x: [-3.5, 4.5], y: [-3, 4], pxu: 38, nhan_truc: { x: [-3, -2, -1, 1, 2, 3, 4], y: [-2, -1, 1, 2, 3] },
    bpt: [{ a: -3, b: 2, c: 6, dau: '<' }, { a: 1, b: 3, c: 9, dau: '<' }, { a: 1, b: 0, c: 3, dau: '<' }, { a: -2, b: -5, c: 4, dau: '<' }],
    diem: [{ x: -2, y: 0, ten: 'A', dx: -18 }, { x: 0, y: 3, ten: 'B' }, { x: 3, y: 2, ten: 'C' }, { x: 3, y: -2, ten: 'D' }, { x: 0, y: 0, ten: 'O', dx: 6, dy: 16 }] } },
  // ───────── NDB00887 / 888 bài toán thực tế ─────────
  tt1: { loai: 'mien', mo_ta: { x: [-1, 11.5], y: [-1, 7.5], pxu: 36, nhan_truc: { x: [2, 4, 6, 8, 10], y: [2, 4, 6] },
    bpt: [{ a: 1, b: 4, c: 25, dau: '<=' }, { a: 1, b: 1, c: 10, dau: '<=' }, { a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 10, y: 0, ten: 'A', dy: 18 }, { x: 5, y: 5, ten: 'B' }, { x: 0, y: 6.25, ten: 'C' }] } },
  tt2: { loai: 'mien', mo_ta: { x: [-1, 9.5], y: [-1, 7.5], pxu: 38, nhan_truc: { x: [2, 4, 6, 8], y: [2, 4, 6] },
    bpt: [{ a: 1, b: 1, c: 8, dau: '<=' }, { a: 2, b: 3, c: 18, dau: '<=' }, { a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 8, y: 0, ten: 'C', dy: 18 }, { x: 6, y: 2, ten: 'B' }, { x: 0, y: 6, ten: 'A' }] } },
  tt3: { loai: 'mien', mo_ta: { x: [-0.5, 11.5], y: [-0.5, 10.5], pxu: 34, nhan_truc: { x: [2, 4, 6, 8, 10], y: [2, 4, 6, 8, 10] },
    bpt: [{ a: 2, b: 1, c: 14, dau: '>=' }, { a: 1.2, b: 3, c: 18, dau: '>=' }, { a: 1, b: 0, c: 10, dau: '<=' }, { a: 0, b: 1, c: 9, dau: '<=' }],
    diem: [{ x: 5, y: 4, ten: 'A', dy: 18 }, { x: 10, y: 2, ten: 'B', dy: 18 }, { x: 10, y: 9, ten: 'C' }, { x: 2.5, y: 9, ten: 'D' }] } },
  tt4: { loai: 'mien', mo_ta: { x: [-30, 340], y: [-20, 240], pxu: 1.45, luoi: 100, nhan_truc: { x: [100, 200, 300], y: [100, 200] },
    bpt: [{ a: 4, b: 1, c: 1200, dau: '<=' }, { a: 0, b: 1, c: 200, dau: '<=' }, { a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 300, y: 0, ten: 'A', dx: 12, dy: 18 }, { x: 250, y: 200, ten: 'B' }, { x: 0, y: 200, ten: 'C', dx: -18 }] } },
  // ───────── NDB01377 min max từ MIỀN NGHIỆM có sẵn (ví dụ soạn mới 22/10) ─────────
  mm1: { loai: 'mien', mo_ta: { x: [-0.5, 6.5], y: [-0.5, 5], pxu: 40, nhan_truc: { x: [1, 2, 3, 4, 5, 6], y: [1, 2, 3, 4] },
    bpt: [{ a: 0, b: 1, c: 1, dau: '>=' }, { a: 3, b: -2, c: 1, dau: '>=' }, { a: 3, b: 2, c: 17, dau: '<=' }],
    diem: [{ x: 1, y: 1, ten: 'A(1;1)', dx: -50, dy: 18 }, { x: 5, y: 1, ten: 'B(5;1)', dy: 18 }, { x: 3, y: 4, ten: 'C(3;4)', dy: -10 }] } },
  mm2: { loai: 'mien', mo_ta: { x: [-0.8, 5.5], y: [-0.8, 4.2], pxu: 44, nhan_truc: { x: [1, 2, 3, 4, 5], y: [1, 2, 3, 4] },
    bpt: [{ a: 1, b: 0, c: 0, dau: '>=' }, { a: 0, b: 1, c: 0, dau: '>=' }, { a: 3, b: 1, c: 12, dau: '<=' }, { a: 1, b: -3, c: -6, dau: '>=' }],
    diem: [{ x: 0, y: 0, ten: 'O', dx: -16, dy: 16 }, { x: 4, y: 0, ten: 'A(4;0)', dx: 8, dy: -10 }, { x: 3, y: 3, ten: 'B(3;3)' }, { x: 0, y: 2, ten: 'C(0;2)', dx: 8, dy: -8 }] } },
}

/** dạng → { vd: { <số thứ tự ví dụ 1..>: [key, 'de'|'giai'] }, lt: [key] (chèn cuối khối ##TC đầu tiên) } */
export const PATCH = {
  NDB00519: { vd: { 1: ['gx1', 'giai'], 2: ['gx2', 'giai'] } },
  NDB00520: { vd: { 1: ['hx1', 'giai'], 2: ['hx2', 'giai'] } },
  NDB00521: { vd: { 2: ['hieu2', 'giai'] } },
  NDB00522: { vd: { 1: ['bu1', 'giai'], 2: ['bu2', 'giai'], 3: ['bu3', 'giai'] } },
  NDB00524: { vd: { 1: ['tr1', 'giai'], 2: ['tr2', 'giai'] } },
  NDB00829: { vd: { 3: ['tc3', 'giai'] } },
  NDB00535: { lt: ['con_lt'], vd: { 1: ['con1', 'giai'], 2: ['con2', 'giai'], 3: ['con3', 'giai'] } },
  NDB00536: { lt: ['rong_lt'], vd: { 1: ['rong1', 'giai'], 2: ['rong2', 'giai'] } },
  NDB00537: { lt: ['giao_lt'], vd: { 1: ['giao1', 'giai'], 2: ['giao1', 'giai'] } },
  NDB00538: { vd: { 1: ['mn1', 'giai'], 2: ['mn2', 'giai'], 3: ['mn3', 'giai'] } },
  NDB00539: { vd: { 1: ['ng1', 'giai'], 2: ['ng2', 'giai'] } },
  NDB00884: { vd: { 1: ['xd1', 'de'], 2: ['xd2', 'de'] } },
  NDB00546: { vd: { 1: ['he1', 'giai'], 2: ['he2', 'giai'], 3: ['he3', 'giai'] } },
  NDB00886: { vd: { 1: ['da1', 'giai'], 2: ['da2', 'giai'] } },
  NDB00887: { vd: { 1: ['tt1', 'giai'], 2: ['tt2', 'giai'], 3: ['tt3', 'giai'] } },
  NDB00888: { vd: { 1: ['tt4', 'giai'] } },
}

/** Ví dụ MỚI cho 2 dạng chưa có (Thùy 15/10). Soạn theo khuôn nguồn (NBV 10-4/10-5, PNL Bài 01–02 Dạng 02): đề cho miền nghiệm bằng HÌNH + 4 đáp án. Hình dựng đúng theo BPT của đáp án. */
export const VD_MOI = {
  NDB00540: (url) => ({ a: url.hd540a, b: url.hd540b }),
}
