// me4-kiem-cd14.mjs — máy kiểm đáp số CĐ14 (Bài toán hai tỉ số). Mỗi hàm TỰ TÍNH TỪ ĐỀ bằng vét cạn số nguyên thoả mọi điều kiện của đề
// (tỉ số viết dạng nhân chéo để không dùng số thập phân), KHÔNG chép các bước lời giải sách.
const so = (x) => String(x)
const co = (r) => { if (!r.length) throw new Error('vét cạn không ra nghiệm nào'); return r.map(so) }
// a, b thoả ok(a, b) trong 0..gh; mỗi cặp nghiệm trả bởi ra(a, b)
const vet2 = (gh, ok, ra) => { const r = []; for (let a = 0; a <= gh; a++) for (let b = 0; b <= gh; b++) if (ok(a, b)) r.push(...ra(a, b)); return co(r) }

export const KIEM_CD14 = {
  // n nữ f, nam m (lúc đầu): 4f = m; thay 1 nữ bằng 1 nam: 5(f-1) = m+1. Hỏi f+m
  'CĐ14 · B1': () => vet2(400, (f, m) => f >= 1 && 4 * f === m && 5 * (f - 1) === m + 1, (f, m) => [f + m]),
  // ngăn trên a, ngăn dưới b: b = 3a; chuyển 10 xuống: b+10 = 7(a-10)
  'CĐ14 · B2': () => vet2(400, (a, b) => a >= 10 && b === 3 * a && b + 10 === 7 * (a - 10), (a, b) => [a, b]),
  // rộng w, dài l: 5w = 2l; (w+4)×3 = 2(l-4). Diện tích w×l
  'CĐ14 · B3': () => vet2(300, (w, l) => l > 4 && 5 * w === 2 * l && 3 * (w + 4) === 2 * (l - 4), (w, l) => [w * l]),
  // vịt trên bờ x, dưới ao y: y = 5x; sau khi 3 con nhảy xuống: y+3 = 8(x-3). Hỏi x+y
  'CĐ14 · B4': () => vet2(400, (x, y) => x >= 3 && y === 5 * x && y + 3 === 8 * (x - 3), (x, y) => [x + y]),
  // Lan l, Hồng h: 5l = 3h; sau thêm 15: 13(l+15) = 9(h+15)
  'CĐ14 · B5': () => vet2(400, (l, h) => 5 * l === 3 * h && 13 * (l + 15) === 9 * (h + 15), (l, h) => [l, h]),
  // con c, bố b: b = 3c; 12 năm trước b-12 = 7(c-12)
  'CĐ14 · B6': () => vet2(150, (c, b) => c > 12 && b === 3 * c && b - 12 === 7 * (c - 12), (c, b) => [c, b]),
  // ngăn I a, ngăn II b: 3a = 7b; thêm 40 mỗi ngăn: ngăn II = 17/29 ngăn I tức 29(b+40) = 17(a+40). Hỏi tổng lúc sau a+b+80
  'CĐ14 · B7': () => vet2(600, (a, b) => 3 * a === 7 * b && 29 * (b + 40) === 17 * (a + 40), (a, b) => [a + b + 80]),
  // gà g, vịt v: 5g = 3v; thêm 10 mỗi loại: vịt = 3/2 gà tức 2(v+10) = 3(g+10)
  'CĐ14 · B8': () => vet2(300, (g, v) => 5 * g === 3 * v && 2 * (v + 10) === 3 * (g + 10), (g, v) => [g, v]),
  // nam m, nữ f: 4m = 3f; thêm 3 nam: 10(m+3) = 9f. Hỏi m+f
  'CĐ14 · B9': () => vet2(300, (m, f) => 4 * m === 3 * f && 10 * (m + 3) === 9 * f, (m, f) => [m + f]),
  // ngăn trên a, dưới b: 5b = 6a; thêm 15 vào ngăn trên: 11b = 12(a+15)
  'CĐ14 · B10': () => vet2(600, (a, b) => 5 * b === 6 * a && 11 * b === 12 * (a + 15), (a, b) => [a, b]),
  // gà mái m, trống t: m = 6t; thêm 5 trống: 4(t+5) = m
  'CĐ14 · B11': () => vet2(300, (m, t) => m === 6 * t && 4 * (t + 5) === m, (m, t) => [m, t]),
  // nhập N, quầy q = N/8, kho k = N-q; bán 3 ở quầy: k = 10(q-3)
  'CĐ14 · B12': () => { const r = []; for (let N = 8; N <= 2000; N += 8) { const q = N / 8, k = N - q; if (q > 3 && k === 10 * (q - 3)) r.push(N) } return co(r) },
  // gà g, vịt v: g = 7v; thêm 200 gà và 900 vịt: gà = 9/10 vịt tức 10(g+200) = 9(v+900)
  'CĐ14 · B13': () => vet2(3000, (g, v) => g === 7 * v && 10 * (g + 200) === 9 * (v + 900), (g, v) => [g, v]),
  // sách giáo khoa g, tham khảo t: 5g = 2t; nhập 50 giáo khoa, bán 100 tham khảo: 8(g+50) = 5(t-100)
  'CĐ14 · B14': () => vet2(2000, (g, t) => t >= 100 && 5 * g === 2 * t && 8 * (g + 50) === 5 * (t - 100), (g, t) => [g, t]),
  // ngăn 1 a, ngăn 2 b: 3a = 2b; thêm 80 vào ngăn 1, 40 vào ngăn 2: 4(a+80) = 3(b+40)
  'CĐ14 · B15': () => vet2(2000, (a, b) => 3 * a === 2 * b && 4 * (a + 80) === 3 * (b + 40), (a, b) => [a, b]),
}
