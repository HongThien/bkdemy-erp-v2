// me4-kiem-cd06.mjs — máy kiểm đáp số CĐ6 "Tìm hai số biết tổng và hiệu" (ME 4). Mỗi hàm TỰ TÍNH TỪ ĐỀ (vét cạn / thay ngược), không chép lời giải sách.
// Trả mảng chuỗi (đã dính đơn vị như trong dap_an) phải có mặt trong dap_an sau chuẩn hoá (bỏ $ và khoảng trắng).
// CĐ6 · B6b: đề có hai cách hiểu (hiệu lúc đầu hay hiệu sau khi mua thêm) ⇒ KHÔNG viết hàm kiểm (máy không phân xử được).

/** Tìm mọi cặp (x, y) tự nhiên x + y = tong thoả đk(x, y). */
const capTheoTong = (tong, dk) => {
  const ra = []
  for (let x = 0; x <= tong; x++) if (dk(x, tong - x)) ra.push([x, tong - x])
  return ra
}
const duyNhat = (ds, ten) => {
  if (ds.length !== 1) throw new Error(`${ten}: tìm được ${ds.length} nghiệm`)
  return ds[0]
}
/** số số lẻ / chẵn / số tự nhiên nằm thật sự giữa a và b (a < b) */
const giuaLe = (a, b) => { let d = 0; for (let n = a + 1; n < b; n++) if (n % 2 === 1) d++; return d }
const giuaChan = (a, b) => { let d = 0; for (let n = a + 1; n < b; n++) if (n % 2 === 0) d++; return d }
const giuaTuNhien = (a, b) => Math.max(0, b - a - 1)

export const KIEM_CD06 = {
  // An + Bình = 70; Bình thêm 16 thì bằng An
  'CĐ6 · B1': () => {
    const [an, binh] = duyNhat(capTheoTong(70, (a, b) => b + 16 === a), 'B1')
    return [`${an}viênbi`, `${binh}viênbi`]
  },
  // hai bao tổng 147; lấy 5 và 22 thì còn lại bằng nhau
  'CĐ6 · B2': () => {
    const [b1, b2] = duyNhat(capTheoTong(147, (x, y) => x - 5 === y - 22), 'B2')
    return [`${b1}kg`, `${b2}kg`]
  },
  // vịt + ngan + ngỗng = 200; vịt = ngan + ngỗng; ngan - ngỗng = 40
  'CĐ6 · B3': () => {
    const ds = []
    for (let vit = 0; vit <= 200; vit++) for (let ngan = 0; ngan <= 200 - vit; ngan++) {
      const ngong = 200 - vit - ngan
      if (vit === ngan + ngong && ngan - ngong === 40) ds.push([vit, ngan, ngong])
    }
    const [vit, ngan, ngong] = duyNhat(ds, 'B3')
    return [`${vit}con`, `${ngan}con`, `${ngong}con`]
  },
  // hai tổ 30 cây; tổ 1 thêm 5, tổ 2 thêm 3 thì tổ 1 hơn tổ 2 là 8
  'CĐ6 · B4': () => {
    const [t1, t2] = duyNhat(capTheoTong(30, (x, y) => (x + 5) - (y + 3) === 8), 'B4')
    return [`${t1}cây`, `${t2}cây`]
  },
  // cách đây 5 năm tổng tuổi mẹ + con = 34; mẹ sinh con năm 26 tuổi (hiệu tuổi 26)
  'CĐ6 · B5': () => {
    const ds = []
    for (let con = 5; con <= 40; con++) for (let me = con; me <= 80; me++) {
      if ((con - 5) + (me - 5) === 34 && me - con === 26) ds.push([con, me])
    }
    const [con, me] = duyNhat(ds, 'B5')
    return [`${con}tuổi`, `${me}tuổi`]
  },
  // Huy hơn Hoàng 6; Huy mua thêm 5, Hoàng thêm 9 thì tổng là 34
  'CĐ6 · B6a': () => {
    const ds = []
    for (let hoang = 0; hoang <= 40; hoang++) { const huy = hoang + 6; if ((huy + 5) + (hoang + 9) === 34) ds.push([huy, hoang]) }
    const [huy, hoang] = duyNhat(ds, 'B6a')
    return [`${huy}quyển`, `${hoang}quyển`]
  },
  // hai thùng 82 lít; chuyển 7 lít từ thùng 1 sang thùng 2 thì bằng nhau
  'CĐ6 · B7': () => {
    const [t1, t2] = duyNhat(capTheoTong(82, (x, y) => x - 7 === y + 7), 'B7')
    return [`${t1}lít`, `${t2}lít`]
  },
  // An + Bình = 120; Bình cho An 25 thì Bình còn hơn An 10
  'CĐ6 · B8': () => {
    const [an, binh] = duyNhat(capTheoTong(120, (a, b) => (b - 25) - (a + 25) === 10), 'B8')
    return [`${an}viênbi`, `${binh}viênbi`]
  },
  // Huy + Hoàng = 25; Huy cho 5 rồi nhận lại 3 thì Huy hơn Hoàng 1; ý b: số viên Huy cho để Hoàng hơn Huy 1
  'CĐ6 · B9': () => {
    const [huy, hoang] = duyNhat(capTheoTong(25, (h, w) => (h - 5 + 3) - (w + 5 - 3) === 1), 'B9a')
    const ks = []
    for (let k = 0; k <= huy; k++) if ((hoang + k) - (huy - k) === 1) ks.push(k)
    const k = duyNhat(ks, 'B9b')
    return [`${huy}viênbi`, `${hoang}viênbi`, `${k}viênbi`]
  },
  // hai kho 45 tấn; lấy ra 5 và 4, rồi chuyển 10 từ kho 1 sang kho 2 thì kho 1 ít hơn kho 2 là 6
  'CĐ6 · B10': () => {
    const [k1, k2] = duyNhat(capTheoTong(45, (x, y) => (y - 4 + 10) - (x - 5 - 10) === 6 && x - 15 >= 0), 'B10')
    return [`${k1}tấn`, `${k2}tấn`]
  },
  // hai ngăn 2995; chuyển 125 từ ngăn 1 sang 2 rồi 48 từ ngăn 2 sang 1 thì ngăn 1 hơn ngăn 2 là 341
  'CĐ6 · B11': () => {
    const [n1, n2] = duyNhat(capTheoTong(2995, (x, y) => (x - 125 + 48) - (y + 125 - 48) === 341), 'B11')
    return [`${n1}quyển`, `${n2}quyển`]
  },
  // hai số lẻ liên tiếp, tổng 4020
  'CĐ6 · B12a': () => {
    const ds = []
    for (let a = 1; a < 4020; a += 2) if (a + (a + 2) === 4020) ds.push([a, a + 2])
    const [a, b] = duyNhat(ds, 'B12a'); return [String(a), String(b)]
  },
  // hai số chẵn tổng 1000, giữa có đúng 2 số lẻ
  'CĐ6 · B12b': () => {
    const ds = []
    for (let a = 0; a <= 1000; a += 2) { const b = 1000 - a; if (a < b && b % 2 === 0 && giuaLe(a, b) === 2) ds.push([a, b]) }
    const [a, b] = duyNhat(ds, 'B12b'); return [String(a), String(b)]
  },
  // hai số chẵn tổng 480, giữa có đúng 6 số lẻ liên tiếp (các số lẻ nằm giữa đều liên tiếp trong dãy lẻ)
  'CĐ6 · B12c': () => {
    const ds = []
    for (let a = 0; a <= 480; a += 2) { const b = 480 - a; if (a < b && giuaLe(a, b) === 6) ds.push([a, b]) }
    const [a, b] = duyNhat(ds, 'B12c'); return [String(a), String(b)]
  },
  // hai số lẻ tổng 2010, giữa có đúng 10 số chẵn
  'CĐ6 · B12d': () => {
    const ds = []
    for (let a = 1; a <= 2010; a += 2) { const b = 2010 - a; if (a < b && b % 2 === 1 && giuaChan(a, b) === 10) ds.push([a, b]) }
    const [a, b] = duyNhat(ds, 'B12d'); return [String(a), String(b)]
  },
  // hai số tổng 2024, giữa có đúng 15 số tự nhiên khác
  'CĐ6 · B12e': () => {
    const ds = []
    for (let a = 0; a <= 2024; a++) { const b = 2024 - a; if (a < b && giuaTuNhien(a, b) === 15) ds.push([a, b]) }
    const [a, b] = duyNhat(ds, 'B12e'); return [String(a), String(b)]
  },
  // hai số tự nhiên tổng 2023, giữa có tất cả 15 số chẵn
  'CĐ6 · B13': () => {
    const ds = []
    for (let a = 0; a <= 2023; a++) { const b = 2023 - a; if (a < b && giuaChan(a, b) === 15) ds.push([a, b]) }
    const [a, b] = duyNhat(ds, 'B13'); return [String(a), String(b)]
  },
  // trung bình cộng hai số = 2375; viết thêm chữ số 3 vào bên trái số bé được số lớn (số bé ≥ 1)
  'CĐ6 · B14': () => {
    const ds = []
    for (let be = 1; be <= 4750; be++) {
      const lon = Number('3' + String(be))
      if (be < lon && (be + lon) / 2 === 2375) ds.push(be)
    }
    return [String(duyNhat(ds, 'B14'))]
  },
  // số có hai chữ số, tổng hai chữ số 11, đổi chỗ thì tăng 27
  'CĐ6 · B15': () => {
    const ds = []
    for (let n = 10; n <= 99; n++) {
      const a = Math.floor(n / 10), b = n % 10, dao = b * 10 + a
      if (a + b === 11 && dao - n === 27) ds.push(n)
    }
    return [String(duyNhat(ds, 'B15'))]
  },
  // số có hai chữ số, hiệu hai chữ số là 5 (lớn trừ bé), số + số đảo = 143
  'CĐ6 · B16': () => {
    const ds = []
    for (let n = 10; n <= 99; n++) {
      const a = Math.floor(n / 10), b = n % 10, dao = b * 10 + a
      if (Math.abs(a - b) === 5 && n + dao === 143) ds.push(n)
    }
    if (ds.length < 1) throw new Error('B16: không có nghiệm')
    return ds.map(String)
  },
}
