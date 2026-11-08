// Vẽ lại hình ví dụ K11 chương Giới hạn–Liên tục (NCD00186) bằng máy vẽ chung (hinh-giai-tich.mjs) cho đồng bộ nét với K12. THAY URL hình cũ (hình cũ giữ trên bucket).
export const HINH_K11 = [
  { dang: 'NDB01175', vd: 1, thay: 1, mt: { loai: 'giai_tich', x: [-1.2, 5.3], y: [-0.5, 5.3], deu: true, nhanX: [2], nhanY: [3, 4],
    ham: [{ f: 'x+1', tu: -1, den: 2, mau: 'xanh' }, { f: '6-x', tu: 2, den: 5, mau: 'xanh' }],
    diem: [{ x: 2, y: 3, kieu: 'rong', tren: 0 }, { x: 2, y: 4, kieu: 'dac', tren: 1 }], doc: [{ x: 2, den: 'truc' }], ngang: [{ y: 3, den: 2 }, { y: 4, den: 2 }] } },
  { dang: 'NDB01177', vd: 1, thay: 1, mt: { loai: 'giai_tich', x: [-2.2, 3.4], y: [-0.5, 7.2], nhanX: [1], nhanY: [2],
    ham: [{ f: 'x^2+1', tu: -1.8, den: 1, mau: 'xanh' }, { f: '3*x-1', tu: 1, den: 2.5, mau: 'xanh' }],
    diem: [{ x: 1, y: 2, kieu: 'dac', tren: 0 }], doc: [{ x: 1, den: 'h0' }], ngang: [{ y: 2, den: 1 }] } },
  { dang: 'NDB01182', vd: 1, thay: 1, mt: { loai: 'giai_tich', x: [-2.2, 7], y: [-6.5, 9], nhanX: [3], nhanY: [2],
    ham: [{ f: '(2*x-1)/(x-3)', tu: -2, den: 6.8, bo: [3], nhan: 'y = (2x − 1)/(x − 3)', xnhan: 5.6, dy: -16, neo: 'middle' }],
    doc: [{ x: 3, tiem: true }], ngang: [{ y: 2, den: 6.8 }] } },
  { dang: 'NDB01189', vd: 1, thay: 1, mt: { loai: 'giai_tich', x: [-2.2, 4.5], y: [-1.5, 3.8], deu: true, nhanX: [1], nhanY: [2, 3],
    ham: [{ f: 'x+1', tu: -2, den: 1, mau: 'xanh' }, { f: '4-x', tu: 1, den: 4, mau: 'xanh' }],
    diem: [{ x: 1, y: 2, kieu: 'rong', tren: 0 }, { x: 1, y: 3, kieu: 'dac', tren: 1 }], doc: [{ x: 1, den: 'truc' }], ngang: [{ y: 2, den: 1 }, { y: 3, den: 1 }] } },
  { dang: 'NDB01189', vd: 2, thay: 1, mt: { loai: 'giai_tich', x: [-1.2, 5.2], y: [-4.2, 4.5], nhanX: [2],
    ham: [{ f: '1/(x-2)+1', tu: -1, den: 5, bo: [2], nhan: 'y = f(x)', xnhan: 4.9, dy: -10 }], doc: [{ x: 2, tiem: true }] } },
  { dang: 'NDB01189', vd: 2, thay: 2, mt: { loai: 'giai_tich', x: [-1.2, 4.6], y: [-0.6, 5], deu: true, nhanX: [2], nhanY: [1],
    ham: [{ f: 'abs(x-2)+1', tu: -1, den: 4.4, nhan: 'y = g(x)', xnhan: 4.3, dy: -10 }], diem: [{ x: 2, y: 1, tren: 0 }], doc: [{ x: 2, den: 'h0' }], ngang: [{ y: 1, den: 2 }] } },
]
