// Lô vẽ lại hình BÀI TẬP dạng NDB00636 (thể tích khối tròn xoay giữa hai đồ thị) — CHỜ Thùy duyệt, chưa ghi DB.
// Dạng này đa số đã là hình TikZ có phác khối quay (giữ). Vẽ lại câu hình cũ yếu/ảnh scan mà hàm xác định đủ từ đề. Câu chỉ có ảnh ở anh_dap_an, hình lẫn ảnh chụp (đồng hồ cát…) ⇒ bỏ qua.
// Kiểm số: V = π∫|f² − g²| trên vùng tô (máy tính) so với đáp số.
const G = 'gach'
export const BT_636 = [
  { cau: ['T1120000002600'], ten: 'y = cos x, 0 ≤ x ≤ π/2, quay Ox', V: Math.PI ** 2 / 4, tol: 1e-3, mt: { loai: 'giai_tich', x: [-0.8, 2.4], y: [-1.6, 1.6], deu: true, buocX: Math.PI / 2, buocY: 0.5, nhanX: [{ v: Math.PI / 2, t: 'π/2' }], nhanY: [1],
    ham: [{ f: 'cos(x)', tu: 0, den: Math.PI / 2, nhan: 'y = cos x', xnhan: 0.5, neo: 'start', dx: 8, dy: -10, mau: 'xanh' }], to: [{ tren: 'h0', tu: 0, den: Math.PI / 2, kieu: G }],
    xoay: { ham: 0, tu: 0, den: Math.PI / 2 }, chu: [{ x: 0.5, y: 0.35, t: '(H)' }] } },
  { cau: ['T1120000005049'], ten: 'y = 3√x, x=0..2, quay Ox', V: 18 * Math.PI, tol: 1e-2, mt: { loai: 'giai_tich', x: [-0.7, 3.4], y: [-5.2, 5.2], deu: true, nhanX: [2],
    ham: [{ f: '3*sqrt(x)', tu: 0, den: 2.2, nhan: 'y = 3√x', xnhan: 1.3, neo: 'start', dx: 10, dy: -8, mau: 'xanh' }], to: [{ tren: 'h0', tu: 0, den: 2, mau: 'cam' }],
    doc: [{ x: 2, den: 'h0' }], xoay: { ham: 0, tu: 0, den: 2 } } },
  { cau: ['T1120000007042'], ten: 'y = √x, y = 2 − x, trục hoành, quay Ox', V: 5 * Math.PI / 6, tol: 1e-3, mt: { loai: 'giai_tich', x: [-0.6, 3], y: [-1.7, 1.7], deu: true, nhanX: [1, 2],
    ham: [{ f: 'sqrt(x)', tu: 0, den: 2.6, nhan: 'y = √x', xnhan: 2.4, neo: 'end', dx: 0, dy: -10, mau: 'xanh' }, { f: '2-x', tu: -0.3, den: 2.5, nhan: 'y = 2 − x', xnhan: 2.3, neo: 'start', dx: 8, dy: 22, mau: 'do' }],
    to: [{ tren: 'h0', tu: 0, den: 1, kieu: G }, { tren: 'h1', tu: 1, den: 2, kieu: G }], doc: [{ x: 1, den: 'h0' }],
    xoay: [{ ham: 0, tu: 0, den: 1 }, { ham: 1, tu: 1, den: 2 }], diem: [{ x: 1, y: 1, tren: 0 }] } },
  { cau: ['T1120000004846'], ten: 'hình thang A(−3;0) B(−1;2) C(1;2) D(2;0), quay Ox (V = 12π)', V: 12 * Math.PI, tol: 1e-2, mt: { loai: 'giai_tich', x: [-3.8, 3.2], y: [-2.8, 2.8], deu: true,
    ham: [{ f: 'x+3', tu: -3, den: -1, mau: 'xanh' }, { f: '2', tu: -1, den: 1, mau: 'xanh' }, { f: '4-2*x', tu: 1, den: 2, mau: 'xanh' }],
    to: [{ tren: 'h0', tu: -3, den: -1, mau: 'cam' }, { tren: 'h1', tu: -1, den: 1, mau: 'cam' }, { tren: 'h2', tu: 1, den: 2, mau: 'cam' }],
    xoay: [{ ham: 0, tu: -3, den: -1 }, { ham: 1, tu: -1, den: 1 }, { ham: 2, tu: 1, den: 2 }], doc: [{ x: -1, den: 'h1' }, { x: 1, den: 'h1' }],
    diem: [{ x: -3, y: 0, ten: 'A', vi: 'tl' }, { x: -1, y: 2, ten: 'B', tren: 0, vi: 'tl' }, { x: 1, y: 2, ten: 'C', tren: 1, vi: 'tr' }, { x: 2, y: 0, ten: 'D', vi: 'br' }] } },
]
