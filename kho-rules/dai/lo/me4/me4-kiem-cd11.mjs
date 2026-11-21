// me4-kiem-cd11.mjs — máy kiểm đáp số CĐ11 (Tỉ số, tổng tỉ, hiệu tỉ) sách ME lớp 4. Mỗi hàm TỰ TÍNH từ ĐỀ (vét cạn / thay ngược), không chép lời giải sách.
const gcd = (a, b) => (b === 0 ? Math.abs(a) : gcd(b, a % b))
// phân số tối giản dạng "a/b"
const ps = (a, b) => { const g = gcd(a, b); return `${a / g}/${b / g}` }
const gan = (x, y) => Math.abs(x - y) < 1e-9

export const KIEM_CD11 = {
  // 3/4 cam = 2/5 quýt  =>  cam/quýt = (2/5)/(3/4) = 8/15
  'CĐ11 · B1': () => [ps(2 * 4, 5 * 3)],
  // 2/3 a = 3/5 c  =>  a/c = (3/5)/(2/3)
  'CĐ11 · B2': () => [ps(3 * 3, 5 * 2)],
  // a/b = 2/3 ; b/c = 4/5 ; hỏi a/c và b/a
  'CĐ11 · B3': () => [ps(2 * 4, 3 * 5), ps(3, 2)],
  // 1/3 xanh, 2/7 vàng, còn lại trắng = 16 em; tìm tổng N (vét cạn) và số xanh, vàng
  'CĐ11 · B4': () => {
    for (let n = 1; n <= 2000; n++) {
      if (n % 21 !== 0) continue
      const trang = n - n / 3 - (2 * n) / 7
      if (gan(trang, 16)) return [n, n / 3, (2 * n) / 7]
    }
    return []
  },
  // bán 1/2, rồi 2/3 phần còn lại, còn 12 m
  'CĐ11 · B5': () => {
    for (let l = 1; l <= 5000; l++) {
      const conSang = l - l / 2
      const conChieu = conSang - (conSang * 2) / 3
      if (gan(conChieu, 12)) return [l]
    }
    return []
  },
  // xanh = 3/7 T ; đỏ = 3/7 (xanh + vàng) ; vàng = 38
  'CĐ11 · B6': () => {
    for (let t = 1; t <= 5000; t++) {
      const xanh = (3 * t) / 7, vang = 38, do_ = t - xanh - vang
      if (do_ > 0 && gan(do_, (3 / 7) * (xanh + vang))) return [t]
    }
    return []
  },
  // tổ i = f_i × (tổng ba tổ còn lại), tổ 4 = 26
  'CĐ11 · B7': () => {
    for (let t = 1; t <= 5000; t++) {
      // tổ i thỏa x = f (t - x)  =>  x = f t / (1 + f)
      const x = (f) => (f * t) / (1 + f)
      const t4 = t - x(1 / 2) - x(1 / 3) - x(1 / 4)
      if (gan(t4, 26)) return [t]
    }
    return []
  },
  // thêm a vào tử và mẫu 31/61 được 4/7
  'CĐ11 · B8': () => {
    const r = []
    for (let a = 0; a <= 100000; a++) if ((31 + a) * 7 === 4 * (61 + a)) r.push(a)
    return r
  },
  // hiệu 705, tổng = 5 lần số bé
  'CĐ11 · B9': () => {
    for (let be = 1; be <= 5000; be++) {
      const lon = be + 705
      if (lon + be === 5 * be) return [be, lon]
    }
    return []
  },
  // ba thùng tổng 90; rót 1/5, 1/3, 3/7 thì còn lại bằng nhau
  'CĐ11 · B10': () => {
    for (let a = 1; a < 90; a++) for (let b = 1; a + b < 90; b++) {
      const c = 90 - a - b
      // 4a/5 = 2b/3 = 4c/7  (quy về số nguyên: nhân 105)
      if (84 * a === 70 * b && 70 * b === 60 * c) return [a, b, c]
    }
    return []
  },
  // kệ 1 hơn kệ 2 24 quyển; chuyển 6 từ kệ 1 sang kệ 2 thì kệ 2 = 3/5 kệ 1
  'CĐ11 · B11': () => {
    for (let b = 0; b <= 5000; b++) {
      const a = b + 24
      if (5 * (b + 6) === 3 * (a - 6)) return [a, b]
    }
    return []
  },
  // tổng 235; 3a = 4b = 5c
  'CĐ11 · B12': () => {
    for (let a = 1; a < 235; a++) for (let b = 1; a + b < 235; b++) {
      const c = 235 - a - b
      if (3 * a === 4 * b && 4 * b === 5 * c) return [a, b, c]
    }
    return []
  },
  // bao 3 = 4 × bao 2 ; bao 1 = 3/5 (bao 2 + bao 3) ; bao 1 + bao 3 = 49
  'CĐ11 · B13': () => {
    for (let b2 = 1; b2 <= 49; b2++) {
      const b3 = 4 * b2, b1 = 49 - b3
      if (b1 > 0 && 5 * b1 === 3 * (b2 + b3)) return [b1, b2, b3]
    }
    return []
  },
  // 635000 = 50000 n50 + 20000 n20 + 5000 n5 ; một loại đúng 75000 đồng ; hai loại còn lại số tờ bằng nhau
  'CĐ11 · B14': () => {
    const menh = [5000, 20000, 50000], kq = []
    for (let i = 0; i < 3; i++) {
      if (75000 % menh[i] !== 0) continue
      const n = [0, 0, 0]; n[i] = 75000 / menh[i]
      const j = (i + 1) % 3, k = (i + 2) % 3
      const conLai = 635000 - 75000, tong2 = menh[j] + menh[k]
      if (conLai % tong2 !== 0) continue
      n[j] = n[k] = conLai / tong2
      kq.push(n)
    }
    if (kq.length !== 1) throw new Error(`có ${kq.length} cách chọn loại mệnh giá`)
    return kq[0]   // [số tờ 5000, số tờ 20000, số tờ 50000]
  },
  // 290 con gà vịt; bán 24 gà, 35 vịt thì gà còn = 4/7 vịt còn
  'CĐ11 · B15': () => {
    for (let g = 25; g < 290; g++) {
      const v = 290 - g
      if (v >= 35 && 7 * (g - 24) === 4 * (v - 35)) return [g, v]
    }
    return []
  },
  // 785 tấn; A xuất 105, B nhập 136 thì A = 7/10 B
  'CĐ11 · B16': () => {
    for (let a = 105; a < 785; a++) {
      const b = 785 - a
      if (10 * (a - 105) === 7 * (b + 136)) return [a, b]
    }
    return []
  },
  // tổng 2024, hiệu = 2/3 số bé
  'CĐ11 · B17': () => {
    for (let be = 1; be <= 2024; be++) {
      const lon = 2024 - be
      if (lon >= be && 3 * (lon - be) === 2 * be) return [be, lon]
    }
    return []
  },
  // xanh = 3 đỏ ; bán 12 xanh 7 đỏ thì xanh hơn đỏ 51
  'CĐ11 · B18': () => {
    for (let d = 7; d <= 5000; d++) {
      const x = 3 * d
      if (x >= 12 && (x - 12) - (d - 7) === 51) return [d, x]
    }
    return []
  },
  // Bình tiêu 1/3, An tiêu 2/5 thì còn lại bằng nhau; An hơn Bình 120000
  'CĐ11 · B19': () => {
    for (let b = 1000; b <= 5000000; b += 1000) {
      const a = b + 120000
      if (gan((b * 2) / 3, (a * 3) / 5)) return [b, a]
    }
    return []
  },
  // 4 tổ tổng 70; t3 = 2 t4 ; t2 = t3 + t4 ; t1 = t2 + t4
  'CĐ11 · B20': () => {
    for (let t4 = 1; t4 <= 70; t4++) {
      const t3 = 2 * t4, t2 = t3 + t4, t1 = t2 + t4
      if (t1 + t2 + t3 + t4 === 70) return [t1, t2, t3, t4]
    }
    return []
  },
}
