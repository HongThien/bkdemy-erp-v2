// Lô vẽ lại hình BÀI TẬP dạng NDB00775 (diện tích giữa hai đồ thị / ứng dụng) — CHỜ Thùy duyệt, chưa ghi DB.
// Dạng này nhiều hình thực tế/hình học phức tạp (bể cá, hoa văn, cổng parabol…) đã đủ đọc ⇒ giữ. Chỉ vẽ lại hình yếu mà hàm xác định đủ từ đề/lời giải.
const G = 'gach'
export const BT_775 = [
  { cau: ['T112000000036'], ten: 'lưới ô vuông 1cm: y=0,5x², y=0,25x²+2, x∈[−4;4]', S: 9.75, tol: 0.01, mt: { loai: 'giai_tich', x: [-4, 4], y: [0, 8], deu: true, luoi: true, anTruc: true, nhanX: 'khong', nhanY: 'khong',
    ham: [{ f: '0.5*x^2', tu: -4, den: 4, mau: 'xanh' }, { f: '0.25*x^2+2', tu: -4, den: 4, mau: 'do' }],
    to: [{ tren: 'h1', duoi: 'h0', tu: -4, den: 4, kieu: G }] } },
  { cau: ['T1120000006818'], ten: 'y=x³ (0..1), y=(x−2)² (1..2), trục Ox', S: 7 / 12, mt: { loai: 'giai_tich', x: [-0.6, 3], y: [-0.5, 2.3], deu: true, nhanX: [1, 2], nhanY: [1],
    ham: [{ f: 'x^3', tu: -0.1, den: 1.3, nhan: 'y = x³', xnhan: 1.25, neo: 'start', dx: 6, dy: 4, mau: 'xanh' }, { f: '(x-2)^2', tu: 0.55, den: 2.45, nhan: 'y = x² − 4x + 4', xnhan: 0.8, neo: 'end', dx: -6, dy: 4, mau: 'do' }],
    to: [{ tren: 'h0', duoi: 0, tu: 0, den: 1, kieu: G }, { tren: 'h1', duoi: 0, tu: 1, den: 2, kieu: G }], doc: [{ x: 1, den: 'h0' }], diem: [{ x: 1, y: 1, tren: 0 }] } },
  { cau: ['T1120000005230'], ten: 'hình vuông OABC cạnh 4, y = x²/4', S: 16 / 3, mt: { loai: 'giai_tich', x: [-0.8, 5.4], y: [-0.8, 5], deu: true,
    khung: [{ x: [0, 4], y: [0, 4] }], ham: [{ f: 'x^2/4', tu: 0, den: 4, nhan: '(C)', xnhan: 3.3, neo: 'end', dx: -6, dy: -4, mau: 'xanh' }],
    to: [{ tren: 'h0', duoi: 0, tu: 0, den: 4, kieu: G }],
    diem: [{ x: 0, y: 4, ten: 'A', vi: 'tl' }, { x: 4, y: 4, ten: 'B', vi: 'tr' }, { x: 4, y: 0, ten: 'C', vi: 'br' }],
    chu: [{ x: 1.3, y: 2.7, t: 'S₁' }, { x: 2.9, y: 0.7, t: 'S₂' }] } },
  { cau: ['T1120000004880', 'T1120000004893'], ten: 'hồ nước: y = √x, y = x²/√27', S: Math.sqrt(3), mt: { loai: 'giai_tich', x: [-0.6, 4], y: [-0.5, 3], deu: true, nhanX: [3],
    ham: [{ f: 'sqrt(x)', tu: 0, den: 3.6, nhan: 'y = √x', xnhan: 1.4, neo: 'middle', dy: -14, mau: 'xanh' }, { f: 'x^2/sqrt(27)', tu: -0.4, den: 3.6, nhan: 'y = x²/√27', xnhan: 3.5, neo: 'end', dy: 26, dx: -4, mau: 'do' }],
    to: [{ tren: 'h0', duoi: 'h1', tu: 0, den: 3, mau: 'cam' }], doc: [{ x: 3, den: 'h0' }], diem: [{ x: 3, y: Math.sqrt(3), tren: 0 }] } },
  { cau: ['T1120000007476'], ten: 'y = 2x − x², y = 2 − x, x=1..2', S: 1 / 6, mt: { loai: 'giai_tich', x: [-0.8, 3.2], y: [-0.7, 2.7], deu: true, nhanX: [1, 2], nhanY: [1, 2],
    ham: [{ f: '2*x-x^2', tu: -0.2, den: 2.3, nhan: 'y = 2x − x²', xnhan: 0.3, neo: 'end', dx: -8, dy: -10, mau: 'xanh' }, { f: '2-x', tu: -0.5, den: 3, nhan: 'y = 2 − x', xnhan: 2.9, neo: 'end', dx: -6, dy: -8, mau: 'do' }],
    to: [{ tren: 'h1', duoi: 'h0', tu: 1, den: 2, kieu: G }], doc: [{ x: 1, den: 'h0' }, { x: 2, den: 'h0' }], diem: [{ x: 1, y: 1, tren: 0 }, { x: 2, y: 0, tren: 0 }] } },
  { cau: ['T112000000044'], ten: 'f = −x³/2+3x²/2+1, g = −x/2+5/2, x=−1..1', S: 2, mt: { loai: 'giai_tich', x: [-1.8, 4], y: [-0.8, 4.2], nhanX: [-1, 1, 3], nhanY: [],
    ham: [{ f: '-0.5*x^3+1.5*x^2+1', tu: -1.4, den: 3.4, nhan: 'f(x)', xnhan: 3.3, neo: 'end', dy: -10, mau: 'xanh' }, { f: '-0.5*x+2.5', tu: -1.6, den: 3.8, nhan: 'g(x)', xnhan: 3.7, neo: 'end', dy: -10, mau: 'do' }],
    to: [{ tren: 'h1', duoi: 'h0', tu: -1, den: 1, kieu: G }], doc: [{ x: -1, den: 'h1' }, { x: 1, den: 'h1' }, { x: 3, den: 'h1' }] } },
]
