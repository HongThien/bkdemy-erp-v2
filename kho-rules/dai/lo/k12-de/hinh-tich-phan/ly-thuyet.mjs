// Hình cho LÝ THUYẾT NHÓM — K12 chương Nguyên hàm–Tích phân (NCD00095) + K11 chương Giới hạn–Liên tục (NCD00186).
// Hình MINH HOẠ KHÁI NIỆM (chữ cái a, b, x₀, L… — không số liệu cụ thể). Máy vẽ: scripts/kho/hinh-giai-tich.mjs.
// Mỗi mục: { nhom: 'NNB…', lt: 'đoạn chữ nằm trong dòng cần chèn SAU nó', mt }.
const bis = (f, a, b) => { for (let i = 0; i < 60; i++) { const m = (a + b) / 2; if (f(a) * f(m) <= 0) b = m; else a = m } return (a + b) / 2 }
const fCt = (x) => 0.75 * (x - 2.3) + 0.3 * Math.sin(2.5 * x)
const cNghiem = bis(fCt, 0.6, 3.9)

const _LT = [
  // ── K12
  { nhom: 'NNB01217', lt: 'Nếu $f(x)\\ge0$ trên $[a;b]$ thì', mt: { loai: 'giai_tich', x: [-0.5, 5], y: [-0.5, 3.6],
    ham: [{ f: '1.4+0.9*sin(1.1*x)+0.1*x', tu: 0.3, den: 4.5, nhan: 'y = f(x)', xnhan: 4.4, dy: -10 }],
    to: [{ tren: 'h0', tu: 1, den: 3.8, mau: 'cam' }], doc: [{ x: 1, nhan: 'a', den: 'h0' }, { x: 3.8, nhan: 'b', den: 'h0' }], chu: [{ x: 2.4, y: 0.8, t: 'S' }] } },
  { nhom: 'NNB01415', lt: 'Khi $g(x)=0$ (trục hoành)', mt: { loai: 'giai_tich', x: [-0.5, 5], y: [-0.5, 4.4],
    ham: [{ f: '3.3-0.35*(x-2.2)^2', tu: 0.3, den: 4.3, nhan: 'y = f(x)', xnhan: 4.2, dy: -10, mau: 'xanh' }, { f: '0.5+0.45*(x-2.2)^2', tu: 0.3, den: 4.3, nhan: 'y = g(x)', xnhan: 0.45, dx: -6, dy: 6, neo: 'end', mau: 'do' }],
    to: [{ tren: 'h0', duoi: 'h1', tu: 1, den: 3.6, mau: 'cam' }], doc: [{ x: 1, nhan: 'a', den: 'h0' }, { x: 3.6, nhan: 'b', den: 'h0' }], chu: [{ x: 2.3, y: 1.95, t: 'S' }] } },
  { nhom: 'NNB01499', lt: 'Hình phẳng giới hạn bởi parabol', mt: { loai: 'giai_tich', x: [-0.5, 5], y: [-0.8, 3.8],
    ham: [{ f: '0.6*(x-2.4)^2-0.6', tu: 0.4, den: 4.4, nhan: 'parabol', xnhan: 0.5, dx: -8, dy: 10, neo: 'end', mau: 'xanh' }, { f: '0.4+0.25*x', tu: 0.3, den: 4.6, nhan: 'đường thẳng', xnhan: 4.5, dy: -22, mau: 'do' }],
    to: [{ tren: 'h1', duoi: 'h0', tu: 0.8, den: 3.8, mau: 'cam' }], doc: [{ x: 0.8, nhan: 'x₁', den: 'h1' }, { x: 3.8, nhan: 'x₂', den: 'h1' }], chu: [{ x: 2.3, y: 0.85, t: 'S' }] } },
  { nhom: 'NNB01227', lt: 'V=\\pi\\int_{a}^{b} f^{2}(x)\\,dx$.', mt: { loai: 'giai_tich', x: [-0.6, 5.2], y: [-2.3, 2.3],
    ham: [{ f: '1.1+0.45*sin(1.4*x)', tu: 0.2, den: 4.8, nhan: 'y = f(x)', xnhan: 4.7, dy: -10 }],
    to: [{ tren: 'h0', tu: 1, den: 4, mau: 'xanh' }], doc: [{ x: 1, nhan: 'a', den: 'h0' }, { x: 4, nhan: 'b', den: 'h0' }], xoay: { ham: 0, tu: 1, den: 4 } } },
  { nhom: 'NNB01227', lt: '$V=\\pi\\int_{a}^{b}\\big|f^{2}(x)-g^{2}(x)\\big|\\,dx$.', mt: { loai: 'giai_tich', x: [-0.6, 5.2], y: [-2.5, 2.5],
    ham: [{ f: '1.6+0.3*sin(1.2*x)', tu: 0.2, den: 4.8, nhan: 'y = f(x)', xnhan: 4.7, dy: -10, mau: 'xanh' }, { f: '0.6+0.15*x', tu: 0.2, den: 4.8, nhan: 'y = g(x)', xnhan: 4.7, dy: 18, mau: 'do' }],
    to: [{ tren: 'h0', duoi: 'h1', tu: 1, den: 4, mau: 'cam' }], doc: [{ x: 1, nhan: 'a', den: 'h0' }, { x: 4, nhan: 'b', den: 'h0' }], xoay: { ham: 0, tu: 1, den: 4 } } },
  { nhom: 'NNB01221', lt: 'Độ dịch chuyển trong khoảng thời gian', mt: { loai: 'giai_tich', x: [-0.5, 5.4], y: [-0.5, 4], truc: ['t', 'v'],
    ham: [{ f: '1.6+0.9*sin(1.1*x)+0.2*x', tu: 0, den: 5, nhan: 'v = v(t)', xnhan: 4.9, dy: -10 }],
    to: [{ tren: 'h0', tu: 1, den: 4, mau: 'cam' }], doc: [{ x: 1, nhan: 't₁', den: 'h0' }, { x: 4, nhan: 't₂', den: 'h0' }], chu: [{ x: 2.5, y: 0.9, t: 'S' }] } },
  // ── K11
  { nhom: 'NNB01585', lt: '$\\lim\\limits_{x\\to x_0^-}f(x)=L$', mt: { loai: 'giai_tich', x: [-0.4, 5.2], y: [-0.4, 5.2], deu: true,
    ham: [{ f: '1+x', tu: 0, den: 2, mau: 'xanh' }, { f: '4-0.4*(x-2)', tu: 2, den: 4.6, mau: 'xanh' }],
    diem: [{ x: 2, y: 3, kieu: 'rong', tren: 0 }, { x: 2, y: 4, kieu: 'dac', tren: 1 }],
    doc: [{ x: 2, nhan: 'x₀', den: 'truc' }], ngang: [{ y: 3, nhan: 'L₁', den: 2 }, { y: 4, nhan: 'L₂', den: 2 }],
    chu: [{ x: 0.7, y: 2.4, t: 'x → x₀⁻', nghieng: false, mau: 'xam', co: 14 }, { x: 3.5, y: 4.8, t: 'x → x₀⁺', nghieng: false, mau: 'xam', co: 14 }] } },
  { nhom: 'NNB01587', lt: '$\\lim\\limits_{x\\to x_0}f(x)=+\\infty$', mt: { loai: 'giai_tich', x: [-0.5, 5], y: [-0.5, 5.2],
    ham: [{ f: '0.5+0.7/(x-2.4)^2', tu: 0.2, den: 4.8, bo: [2.4], nhan: 'y = f(x)', xnhan: 4.7, dy: -10 }],
    doc: [{ x: 2.4, nhan: 'x₀', den: 'truc', tiem: true }] } },
  { nhom: 'NNB01589', lt: 'Chấm đặc là điểm thuộc đồ thị', mt: { loai: 'giai_tich', x: [-0.4, 5.2], y: [-0.4, 4.6], deu: true,
    ham: [{ f: '0.5+0.5*x+0.1*x*x', tu: 0, den: 4.8, mau: 'xanh', bo: [2] }],
    diem: [{ x: 2, y: 1.9, kieu: 'rong', tren: 0, ten: 'L', vi: 'br' }, { x: 2, y: 3.2, kieu: 'dac', ten: 'f(x₀)', vi: 'tl' }],
    doc: [{ x: 2, nhan: 'x₀', den: 'truc' }] } },
  { nhom: 'NNB01592', lt: 'Nếu hàm số $y=f(x)$ liên tục trên đoạn $[a;b]$ và', mt: { loai: 'giai_tich', x: [-0.4, 4.8], y: [-1.9, 2.1],
    ham: [{ f: '0.75*(x-2.3)+0.3*sin(2.5*x)', tu: 0.6, den: 3.9, nhan: 'y = f(x)', xnhan: 3.0, dy: -22, dx: 0, neo: 'middle' }],
    doc: [{ x: 0.6, nhan: 'a', den: 'h0' }, { x: 3.9, nhan: 'b', den: 'h0' }, { x: cNghiem, nhan: 'c', den: 'h0' }],
    diem: [{ x: 0.6, y: fCt(0.6), ten: 'f(a)', tren: 0, vi: 'bl' }, { x: 3.9, y: fCt(3.9), ten: 'f(b)', tren: 0, vi: 'tl' }, { x: cNghiem, y: 0, tren: 0 }] } },
]
export const HINH_LT = _LT.map((d) => ({ ...d, mt: { ...d.mt, minhHoa: true } }))
