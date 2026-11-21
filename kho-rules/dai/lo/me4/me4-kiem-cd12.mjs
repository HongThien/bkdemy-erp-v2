// me4-kiem-cd12.mjs — máy kiểm đáp số CĐ12 (Bài toán hai hiệu số). Mỗi hàm TỰ TÍNH TỪ ĐỀ bằng vét cạn: thử số người / số ngày / số thuyền…
// rồi giữ lại giá trị làm cả hai điều kiện của đề cùng đúng. KHÔNG chép các bước lời giải sách.
const so = (x) => String(x)
// vét cạn n = 0..gh; ok(n) trả mảng giá trị cần báo (hoặc null nếu n không thoả)
const co = (r) => { if (!r.length) throw new Error('vét cạn không ra nghiệm nào'); return r.map(so) }
const vet = (gh, ok) => { const r = []; for (let n = 0; n <= gh; n++) { const v = ok(n); if (v) r.push(...v) } return co(r) }

export const KIEM_CD12 = {
  // n em; kẹo = 3n+2 (thừa 2) = 4n-2 (thiếu 2)
  'CĐ12 · B1': () => vet(1000, (n) => (3 * n + 2 === 4 * n - 2 ? [3 * n + 2, n] : null)),
  // n học sinh; vở = 8n+6 = 10n+2
  'CĐ12 · B2': () => vet(1000, (n) => (8 * n + 6 === 10 * n + 2 ? [8 * n + 6, n] : null)),
  // g nhóm = g cô; cháu c: chia 6 mỗi nhóm thì c-6g = 4 cháu chưa có ai; chia 8 mỗi nhóm thì thừa một cô = chỉ đủ g-1 nhóm đầy
  'CĐ12 · B3': () => { const r = []; for (let g = 1; g <= 300; g++) for (let c = 0; c <= 3000; c++) if (c - 6 * g === 4 && c === 8 * (g - 1)) r.push(c, g); return co(r) },
  // b bàn; học sinh h = 4b+1 (còn 1 bạn chưa có chỗ); h = 5(b-2) (thừa 2 bàn)
  'CĐ12 · B4': () => { const r = []; for (let b = 3; b <= 500; b++) for (let h = 0; h <= 3000; h++) if (h === 4 * b + 1 && h === 5 * (b - 2)) r.push(h, b); return co(r) },
  // t tổ; sách = 7t+3 = 8t-3 (Văn = Toán)
  'CĐ12 · B5': () => vet(1000, (t) => (7 * t + 3 === 8 * t - 3 ? [t, 7 * t + 3] : null)),
  // r hàng khi xếp 12; học sinh = 12r+5; xếp 15 thì thừa 5 và ít hơn 4 hàng: 15(r-4)+5
  'CĐ12 · B6': () => vet(1000, (r) => (12 * r + 5 === 15 * (r - 4) + 5 ? [12 * r + 5] : null)),
  // t giờ theo kế hoạch; N = 32t; làm 35 sản phẩm mỗi giờ: sau t-1 giờ còn 20 sản phẩm
  'CĐ12 · B7': () => vet(1000, (t) => (32 * t === 35 * (t - 1) + 20 ? [32 * t] : null)),
  // d ngày; mỗi người nhận N = 8d+60 = 10d+40
  'CĐ12 · B8': () => vet(1000, (d) => (8 * d + 60 === 10 * d + 40 ? [8 * d + 60] : null)),
  // n người; cam q = 5n+5; mỗi người 6 quả thì một người không có quả nào: q = 6(n-1)
  'CĐ12 · B9': () => vet(1000, (n) => (n >= 1 && 5 * n + 5 === 6 * (n - 1) ? [n, 5 * n + 5] : null)),
  // b thuyền; người p = 20b+8; mỗi thuyền 24 người thì thừa một thuyền: p = 24(b-1)
  'CĐ12 · B10': () => vet(1000, (b) => (20 * b + 8 === 24 * (b - 1) ? [b, 20 * b + 8] : null)),
  // c can; dầu L = 6c (vừa hết); đổ 10 lít thì số can giảm 5 và thừa 2 lít: L = 10(c-5)+2
  'CĐ12 · B11': () => vet(1000, (c) => (6 * c === 10 * (c - 5) + 2 ? [6 * c] : null)),
  // n học sinh; vở v = 6n+4; chia 8 quyển: 2 em không nhận, thừa 6: v = 8(n-2)+6
  'CĐ12 · B12': () => vet(1000, (n) => (6 * n + 4 === 8 * (n - 2) + 6 ? [n, 6 * n + 4] : null)),
  // mỗi em k viên; tổ hai 12k, tổ một 9k; 12k-9k = 12
  'CĐ12 · B13': () => vet(100, (k) => (12 * k - 9 * k === 12 ? [9 * k, 12 * k] : null)),
  // d ngày; mỗi chị cần N = 48d+62 = 56d+14
  'CĐ12 · B14': () => vet(1000, (d) => (48 * d + 62 === 56 * d + 14 ? [48 * d + 62] : null)),
  // n cháu; kẹo = bánh = x; bánh: 3n+2; kẹo: 4n-3
  'CĐ12 · B15': () => vet(1000, (n) => (3 * n + 2 === 4 * n - 3 ? [3 * n + 2, n] : null)),
  // t phút; dung tích V = 40t; vòi 2 sau t phút chảy 30t, còn 600 nữa mới đầy: V = 30t+600
  'CĐ12 · B16': () => vet(1000, (t) => (40 * t === 30 * t + 600 ? [40 * t] : null)),
  // t phút; còn lại bằng nhau: 800-15t = 1200-25t
  'CĐ12 · B17': () => vet(1000, (t) => (800 - 15 * t === 1200 - 25 * t ? [t] : null)),
  // n túi; bi = 9n+15 = 12n
  'CĐ12 · B18': () => vet(1000, (n) => (9 * n + 15 === 12 * n ? [12 * n, n] : null)),
}
