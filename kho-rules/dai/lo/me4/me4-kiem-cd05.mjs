// me4-kiem-cd05.mjs — máy kiểm đáp số CĐ5 (Mối quan hệ giữa các thành phần phép tính). Mỗi hàm TỰ TÍNH TỪ ĐỀ (vét cạn / thay ngược), không chép lời giải sách.
const so = (x) => String(x)
// gom giá trị duy nhất; nhiều giá trị khác nhau ⇒ đề không xác định một đáp số ⇒ báo lỗi để khỏi kiểm hờ
const duyNhat = (tap, ten) => { const a = [...tap]; if (a.length !== 1) throw new Error(`${ten}: ${a.length} giá trị (${a.slice(0, 5).join(', ')})`); return a[0] }
// số có chữ số đảo theo hoán vị vị trí (chuỗi chữ số)
const chuSo = (n) => String(n).split('').map(Number)

export const KIEM_CD05 = {
  // B1: hai số a + b = 5729, bớt a đi 1908, thêm b 626 ⇒ tổng mới (mọi cặp cho cùng một kết quả)
  'CĐ5 · B1': () => { const r = new Set(); for (let a = 1908; a <= 5729; a++) { const b = 5729 - a; r.add((a - 1908) + (b + 626)) } return [so(duyNhat(r, 'B1'))] },
  // B2: cùng thêm 285 vào SBT và ST ⇒ hiệu mới 20187; hiệu ban đầu của mọi cặp (a, b) như vậy
  'CĐ5 · B2': () => { const r = new Set(); for (let b = 0; b <= 400; b++) { const a = b + 20187 /* a + 285 - (b + 285) = 20187 */; const aMoi = a + 285, bMoi = b + 285; if (aMoi - bMoi === 20187) r.add(a - b) } return [so(duyNhat(r, 'B2'))] },
  // B3: (a − 95) − (b + 56) = 7082 ⇒ hiệu a − b
  'CĐ5 · B3': () => { const r = new Set(); for (let b = 0; b <= 300; b++) for (let a = 95; a <= 8000; a++) if ((a - 95) - (b + 56) === 7082) r.add(a - b); return [so(duyNhat(r, 'B3'))] },
  // B4: số trừ s có hai chữ số cuối 49, bị viết thành 94; hiệu sai = 1935 ⇒ hiệu đúng
  'CĐ5 · B4': () => { const r = new Set(); for (let k = 0; k <= 100; k++) { const s = 100 * k + 49, sSai = 100 * k + 94; for (let a = sSai; a <= sSai + 1935; a++) if (a - sSai === 1935) r.add(a - s) } return [so(duyNhat(r, 'B4'))] },
  // B5: a − s = h, a + s + h = 2000, s − h = 200
  'CĐ5 · B5': () => { const r = []; for (let a = 0; a <= 2000; a++) for (let s = 0; s <= a; s++) { const h = a - s; if (a + s + h === 2000 && s - h === 200) r.push(a, s) } return r.map(so) },
  // B6: n + 1007 = 1996 ⇒ tổng đúng n + 107
  'CĐ5 · B6': () => { const r = new Set(); for (let n = 0; n <= 3000; n++) if (n + 1007 === 1996) r.add(n + 107); return [so(duyNhat(r, 'B6'))] },
  // B7: a − s = 2162; a − 10s = 56
  'CĐ5 · B7': () => { const r = []; for (let s = 0; s <= 5000; s++) { const a = 2162 + s; if (a - 10 * s === 56) r.push(a, s) } return r.map(so) },
  // B8: a có 3 chữ số, s có 1 chữ số; đặt s thẳng hàng trăm ⇒ a − 100 s = 486; a − s = 783
  'CĐ5 · B8': () => { const r = []; for (let s = 1; s <= 9; s++) for (let a = 100; a <= 999; a++) if (a - 100 * s === 486 && a - s === 783) r.push(a, s); return r.map(so) },
  // B9: a − s = 1850; viết thêm chữ số 5 bên phải số trừ ⇒ a − (10 s + 5) = 360
  'CĐ5 · B9': () => { const r = []; for (let s = 0; s <= 6000; s++) { const a = 1850 + s; if (a - (10 * s + 5) === 360) r.push(a, s) } return r.map(so) },
  // B10a: thương q = L : b = L/4 = 8 b
  'CĐ5 · B10a': () => { const r = []; for (let b = 1; b <= 400; b++) for (let L = b; L <= 3000; L++) if (L % b === 0) { const q = L / b; if (4 * q === L && q === 8 * b) r.push(b, L) } return r.map(so) },
  // B10b: b = q/3, q = L/9, q = L : b
  'CĐ5 · B10b': () => { const r = []; for (let b = 1; b <= 400; b++) for (let L = b; L <= 5000; L++) if (L % b === 0) { const q = L / b; if (3 * b === q && 9 * q === L) r.push(b, L) } return r.map(so) },
  // B11a: thương 125, dư 47, số chia bé nhất ⇒ số chia d (d > 47) nhỏ nhất, số bị chia = 125 d + 47
  'CĐ5 · B11a': () => { for (let d = 1; d <= 1000; d++) { const a = 125 * d + 47; if (Math.floor(a / d) === 125 && a % d === 47) return [so(d), so(a)] } throw new Error('không tìm thấy') },
  // B11b: dư lớn nhất 78 ⇒ d − 1 = 78; thương = 24 d
  'CĐ5 · B11b': () => { const r = []; for (let d = 1; d <= 500; d++) if (d - 1 === 78) { const q = 24 * d; r.push(q * d + 78) } return r.map(so) },
  // B11c: chia cho 97, dư lẻ lớn nhất có thể, thương = dư − 2
  'CĐ5 · B11c': () => { let rMax = -1; for (let r = 0; r < 97; r++) if (r % 2 === 1) rMax = r; const r = []; for (let a = 0; a <= 1000000; a++) if (a % 97 === rMax && Math.floor(a / 97) === rMax - 2) r.push(a); return r.map(so) },
  // B12a: d = 65, dư 31 (a = 65 q + 31); bớt ít nhất x để chia hết và thương giảm 5
  'CĐ5 · B12a': () => { const r = new Set(); for (let q = 5; q <= 60; q++) { const a = 65 * q + 31; let best = null; for (let x = 0; x <= a; x++) { const m = a - x; if (m % 65 === 0 && m / 65 === q - 5) { best = x; break } } r.add(best) } return [so(duyNhat(r, 'B12a'))] },
  // B12b: d = 29, dư lớn nhất 28; thêm ít nhất x để chia hết và thương tăng 3
  'CĐ5 · B12b': () => { const r = new Set(); for (let q = 0; q <= 60; q++) { const a = 29 * q + 28; let best = null; for (let x = 0; x <= 500; x++) { const m = a + x; if (m % 29 === 0 && m / 29 === q + 3) { best = x; break } } r.add(best) } return [so(duyNhat(r, 'B12b'))] },
  // B13: 71 chia cho d được thương 11, dư lớn nhất có thể (d − 1)
  'CĐ5 · B13': () => { const r = []; for (let d = 2; d <= 71; d++) if (Math.floor(71 / d) === 11 && 71 % d === d - 1) r.push(d); return r.map(so) },
  // B14: a = 6 d + 51 (dư 51 < d), a + d + 6 + 51 = 969
  'CĐ5 · B14': () => { const r = []; for (let d = 52; d <= 969; d++) { const a = 6 * d + 51; if (a + d + 6 + 51 === 969) r.push(a, d) } return r.map(so) },
  // B15a: x y = 1932, (x + 8) y = 2604
  'CĐ5 · B15a': () => { const r = []; for (let x = 1; x <= 1932; x++) if (1932 % x === 0) { const y = 1932 / x; if ((x + 8) * y === 2604) r.push(x, y) } return r.map(so) },
  // B15b: x y = 1692, x (y − 17) = 893
  'CĐ5 · B15b': () => { const r = []; for (let x = 1; x <= 1692; x++) if (1692 % x === 0) { const y = 1692 / x; if (y > 17 && x * (y - 17) === 893) r.push(x, y) } return r.map(so) },
  // B16: n × 253 − n × 25 = 32376 ⇒ tích đúng n × 25
  'CĐ5 · B16': () => { const r = []; for (let n = 1; n <= 20000; n++) if (n * 253 - n * 25 === 32376) r.push(n * 25); return r.map(so) },
  // B17: thừa số m (4 chữ số: nghìn a, trăm b, chục c, đơn vị d); đổi nghìn↔chục, đơn vị↔trăm ⇒ m' = c d a b; 234 m' = 2250846 ⇒ tích đúng 234 m
  'CĐ5 · B17': () => { const r = []; for (let m = 1000; m <= 9999; m++) { const [a, b, c, d] = chuSo(m); const mDao = Number([c, d, a, b].join('')); if (234 * mDao === 2250846) r.push(234 * m) } return r.map(so) },
  // B18: x × (y với đơn vị 2 → 8, tức y + 6) = 2034; x × y = 1356, y tận cùng 2
  'CĐ5 · B18': () => { const r = []; for (let x = 1; x <= 2034; x++) for (let y = 2; y <= 1356; y += 10) if (x * y === 1356 && x * (y + 6) === 2034) r.push(x, y); return r.map(so) },
  // B19: n × (9 + 0 + 1) = 2100 (đặt các tích riêng thẳng cột như phép cộng) ⇒ tích đúng n × 901
  'CĐ5 · B19': () => { const r = []; for (let n = 1; n <= 5000; n++) if (n * 9 + n * 0 + n * 1 === 2100) r.push(n * 901); return r.map(so) },
  // B20: số m = a0a (a từ 1 đến 9): tích đúng 345 m, tích sai = 345 a + 345·0 + 345 a; đúng − sai = 136620
  'CĐ5 · B20': () => { const r = []; for (let a = 1; a <= 9; a++) { const m = 101 * a; const dung = 345 * m, sai = 345 * a + 345 * 0 + 345 * a; if (dung - sai === 136620) r.push(dung) } return r.map(so) },
}
