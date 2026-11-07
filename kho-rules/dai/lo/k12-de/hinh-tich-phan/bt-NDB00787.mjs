// Lô vẽ lại hình BÀI TẬP dạng NDB00787 (diện tích hình phẳng có công thức) — CHỜ Thùy duyệt, chưa ghi DB.
// Dạng này gồm hầu hết ảnh chụp thực tế / hình hình học trang trí (kính, cổng, hoa văn…) ⇒ giữ. Chỉ vẽ lại 3 hình parabol đơn giản, yếu, hàm xác định đủ từ đề.
const G = 'gach'
export const BT_787 = [
  { cau: ['T1120000006760'], ten: 'cổng parabol y = 4 − x², lối đi chữ nhật ABCD (CD = 2)', S: 14 / 3, mt: { loai: 'giai_tich', x: [-3, 3.8], y: [-0.6, 4.8], nhanX: [-2, -1, 1, 2],
    ham: [{ f: '4-x^2', tu: -2.3, den: 2.3, nhan: 'y = 4 − x²', xnhan: 1.45, neo: 'start', dx: 8, dy: -8, mau: 'xanh' }],
    khung: [{ x: [-1, 1], y: [0, 3] }], to: [{ tren: 'h0', duoi: 0, tu: -2, den: -1, kieu: G }, { tren: 'h0', duoi: 0, tu: 1, den: 2, kieu: G }, { tren: 'h0', duoi: 3, tu: -1, den: 1, kieu: G }],
    diem: [{ x: -1, y: 3, ten: 'A', tren: 0, vi: 'tl' }, { x: 1, y: 3, ten: 'B', tren: 0, vi: 'tr' }, { x: 1, y: 0, ten: 'C', vi: 'tl' }, { x: -1, y: 0, ten: 'D', vi: 'tr' }] } },
  { cau: ['T1120000007040'], ten: 'cửa hầm: y = 8 − x²/2, đáy 8 m, cao 8 m', S: 128 / 3, mt: { loai: 'giai_tich', x: [-5, 5.5], y: [-1, 9], nhanX: [-4, 4], nhanY: [8],
    ham: [{ f: '8-0.5*x^2', tu: -4.1, den: 4.1, nhan: 'y = 8 − x²/2', xnhan: 2.4, neo: 'start', dx: 10, dy: -4, mau: 'xanh' }],
    to: [{ tren: 'h0', duoi: 0, tu: -4, den: 4, mau: 'cam' }] } },
  { cau: ['T1120000007670'], ten: 'cổng parabol rộng 8 m, cao 12,5 m: y = 12,5 − 25x²/32', S: 200 / 3, mt: { loai: 'giai_tich', x: [-5.5, 6.5], y: [-1.5, 14], buocY: 2.5, nhanX: [-4, 4], nhanY: [2.5, 5, 7.5, 10, 12.5],
    ham: [{ f: '12.5-25*x^2/32', tu: -4.3, den: 4.3, nhan: 'y = 12,5 − 25x²/32', xnhan: 2.6, neo: 'start', dx: 10, dy: -4, mau: 'xanh' }],
    to: [{ tren: 'h0', duoi: 0, tu: -4, den: 4, mau: 'cam' }] } },
]
