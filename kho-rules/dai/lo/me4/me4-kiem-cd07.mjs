// me4-kiem-cd07.mjs — máy kiểm đáp số CĐ7 "Dấu hiệu và tính chất chia hết" (ME 4). Mỗi hàm TỰ TÍNH TỪ ĐỀ (vét cạn / chia thật bằng BigInt), không chép lời giải sách.
// Câu chữ số bị che: thay thật rồi chia thật, không dùng dấu hiệu chia hết. Câu "có thể hay không": mô phỏng / chứng minh bằng vét cạn khi làm được.
// Trả mảng chuỗi phải có mặt trong dap_an sau chuẩn hoá (bỏ $ và khoảng trắng, chữ thường).

const duyNhat = (ds, ten) => { if (ds.length !== 1) throw new Error(`${ten}: tìm được ${ds.length} nghiệm`); return ds[0] }
const cap = (x, y) => `x=${x},y=${y}`
const so = (s) => BigInt(s)

/** các cặp (x, y), x và y từ 0 đến 9, mà mẫu(x, y) thoả điều kiện */
const capXY = (mau, dk) => {
  const ra = []
  for (let x = 0; x <= 9; x++) for (let y = 0; y <= 9; y++) if (dk(mau(x, y))) ra.push([x, y])
  return ra
}
/** các số có 3 chữ số khác nhau, chữ số hàng trăm khác 0, lập từ bộ chữ số cho trước, chia hết cho k */
const lapBaChuSo = (cs, k) => {
  let d = 0
  for (const a of cs) for (const b of cs) for (const c of cs) {
    if (a === 0 || a === b || b === c || a === c) continue
    if ((a * 100 + b * 10 + c) % k === 0) d++
  }
  return d
}
/** chuỗi chia hết cho / không chia hết cho trong {2,3,5,9}: xét chuỗi chữ số thật bằng BigInt */
const chiaHetTrong = (n) => {
  const co = [2, 3, 5, 9].filter((k) => n % BigInt(k) === 0n)
  const khong = [2, 3, 5, 9].filter((k) => n % BigInt(k) !== 0n)
  return { co, khong }
}
const dinhDang = ({ co, khong }) => `chiahếtcho${co.join(';')};khôngchiahếtcho${khong.join(';')}`

export const KIEM_CD07 = {
  // 426* vừa chia hết cho 9 vừa chia hết cho 5 (thay thật rồi chia thật)
  'CĐ7 · B1a': () => {
    const ds = []
    for (let d = 0; d <= 9; d++) { const n = 4260 + d; if (n % 9 === 0 && n % 5 === 0) ds.push(d) }
    return ds.length === 0 ? ['khôngcó'] : ds.map(String)
  },
  'CĐ7 · B1b': () => {
    const ds = []
    for (let d = 0; d <= 9; d++) { const n = 6700 + d; if (n % 9 === 0 && n % 5 === 0) ds.push(d) }
    return [String(duyNhat(ds, 'B1b'))]
  },
  // viết thêm a bên trái, b bên phải số 1996 để chia hết cho 2, 5, 9 (a khác 0)
  'CĐ7 · B2': () => {
    const ds = []
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) {
      const n = a * 100000 + 1996 * 10 + b
      if (n % 2 === 0 && n % 5 === 0 && n % 9 === 0) ds.push(n)
    }
    return [String(duyNhat(ds, 'B2'))]
  },
  // 4x5y chia hết cho cả 9 và 4
  'CĐ7 · B3': () => capXY((x, y) => 4000 + x * 100 + 50 + y, (n) => n % 9 === 0 && n % 4 === 0).map(([x, y]) => cap(x, y)),
  // 2x387y chia hết cho 12
  'CĐ7 · B4a': () => capXY((x, y) => 200000 + x * 10000 + 3870 + y, (n) => n % 12 === 0).map(([x, y]) => cap(x, y)),
  // 2x387y chia hết cho 225
  'CĐ7 · B4b': () => capXY((x, y) => 200000 + x * 10000 + 3870 + y, (n) => n % 225 === 0).map(([x, y]) => cap(x, y)),
  // số có 3 chữ số khác nhau lập từ 0;4;5;8 chia hết cho 6 / 15 / 18 / 45
  'CĐ7 · B5a': () => [`${lapBaChuSo([0, 4, 5, 8], 6)}số`],
  'CĐ7 · B5b': () => [`${lapBaChuSo([0, 4, 5, 8], 15)}số`],
  'CĐ7 · B5c': () => [`${lapBaChuSo([0, 4, 5, 8], 18)}số`],
  'CĐ7 · B5d': () => [`${lapBaChuSo([0, 4, 5, 8], 45)}số`],
  // 18×19×20×21×a = 3*91000 : tìm * để tồn tại a nguyên dương
  'CĐ7 · B6a': () => {
    const goc = 18 * 19 * 20 * 21, ds = []
    for (let d = 0; d <= 9; d++) { const n = 3091000 + d * 100000; if (n % goc === 0) ds.push(d) }
    return [String(duyNhat(ds, 'B6a'))]
  },
  // 21×22×23×24×25 có dạng 63*56** — tính tích thật rồi đọc các chữ số ở vị trí dấu *
  'CĐ7 · B6b': () => {
    const t = String(21 * 22 * 23 * 24 * 25)
    if (t.length !== 7 || t.slice(0, 2) !== '63' || t.slice(3, 5) !== '56') throw new Error(`tích ${t} không có dạng 63*56**`)
    return [`${t[2]};${t[5]};${t[6]}`]
  },
  // N = 3x57y chia 2 dư 1, chia 5 dư 3, chia hết 9
  'CĐ7 · B7a': () => capXY((x, y) => 30000 + x * 1000 + 570 + y, (n) => n % 2 === 1 && n % 5 === 3 && n % 9 === 0).map(([x, y]) => cap(x, y)),
  // A = 5x1y chia hết 6, chia 5 dư 4
  'CĐ7 · B7b': () => capXY((x, y) => 5000 + x * 100 + 10 + y, (n) => n % 6 === 0 && n % 5 === 4).map(([x, y]) => cap(x, y)),
  // số lớn nhất có 4 chữ số, tổng chữ số 9, chia 2 dư 1, chia 5 dư 2
  'CĐ7 · B8': () => {
    let tot = null
    for (let n = 1000; n <= 9999; n++) {
      if (String(n).split('').reduce((s, c) => s + Number(c), 0) === 9 && n % 2 === 1 && n % 5 === 2) tot = n
    }
    return [String(tot)]
  },
  // số bé nhất khác 3 chia cho 4; 5; 7 đều dư 3
  'CĐ7 · B9': () => { for (let n = 0; ; n++) if (n !== 3 && n % 4 === 3 && n % 5 === 3 && n % 7 === 3) return [String(n)] },
  // số bé nhất chia cho 3; 4; 5; 7 dư lần lượt 1; 2; 3; 5
  'CĐ7 · B10': () => { for (let n = 0; ; n++) if (n % 3 === 1 && n % 4 === 2 && n % 5 === 3 && n % 7 === 5) return [String(n)] },
  // số đại biểu n có 2 chữ số, n ≤ 50; hai dãy bằng nhau, mỗi dãy xếp ghế 3 người vừa hết (n/2 chia hết 3); xếp 5 người một ghế thì dư 1 người (n chia 5 dư 1)
  'CĐ7 · B11': () => {
    const ds = []
    for (let n = 10; n <= 50; n++) if (n % 2 === 0 && (n / 2) % 3 === 0 && n % 5 === 1) ds.push(n)
    return [`${duyNhat(ds, 'B11')}người`]
  },
  // số 11…1 (2010 chữ số 1): chia thật bằng BigInt
  'CĐ7 · B12a': () => [dinhDang(chiaHetTrong(so('1'.repeat(2010))))],
  'CĐ7 · B12b': () => [dinhDang(chiaHetTrong(so('3'.repeat(2007))))],
  'CĐ7 · B12c': () => [dinhDang(chiaHetTrong(so('4'.repeat(2001))))],
  // bbb…bbb (999 chữ số b, b chẵn khác 0): kết quả phải như nhau với mọi b = 2, 4, 6, 8
  'CĐ7 · B12d': () => {
    const kq = new Set([2, 4, 6, 8].map((b) => dinhDang(chiaHetTrong(so(String(b).repeat(999))))))
    if (kq.size !== 1) throw new Error('B12d: kết quả khác nhau theo b')
    return [...kq]
  },
  // bắt đầu 3 mảnh; mỗi lần chọn 1 mảnh xé thành 5 (thêm 4 mảnh). Có thể có 49 mảnh không? (duyệt các số mảnh đạt được tới 49)
  'CĐ7 · B13': () => {
    const dat = new Set([3])
    for (let n = 3; n <= 49; n++) if (dat.has(n)) dat.add(n + 4)
    return [dat.has(49) ? 'có' : 'không']
  },
  // CHAMHOC − HOCCHAM = 102386: duyệt mọi cách gán chữ số cho 5 chữ cái (cho phép trùng, chữ đầu khác 0)
  'CĐ7 · B14': () => {
    let co = false
    for (let C = 1; C <= 9; C++) for (let H = 1; H <= 9; H++) for (let A = 0; A <= 9; A++) for (let M = 0; M <= 9; M++) for (let O = 0; O <= 9; O++) {
      const a = Number([C, H, A, M, H, O, C].join('')), b = Number([H, O, C, C, H, A, M].join(''))
      if (a - b === 102386) co = true
    }
    return [co ? 'có' : 'không']
  },
  // 21 bạn Giỏi, 18 bạn Khá, mỗi bạn cùng loại nhận số vở như nhau (g, k quyển ≥ 1): có 21g + 18k = 200 không?
  'CĐ7 · B15': () => {
    let co = false
    for (let g = 1; g <= 200; g++) for (let k = 1; k <= 200; k++) if (21 * g + 18 * k === 200) co = true
    return [co ? 'có' : 'không']
  },
  // 32 que 1cm + 48 que 2cm + 45 que 3cm nối thành hình chữ nhật: chu vi = tổng độ dài phải chẵn (điều kiện cần của chu vi 2(d+r))
  'CĐ7 · B16a': () => {
    const tong = 32 * 1 + 48 * 2 + 45 * 3
    return [tong % 2 === 0 ? 'có' : 'không']
  },
  // 12 que 25cm + 20 que 21cm nối thành hình vuông: tìm cách chia que cho 4 cạnh bằng nhau, dùng hết que
  'CĐ7 · B16b': () => {
    const tong = 12 * 25 + 20 * 21
    if (tong % 4 !== 0) return ['không']
    const canh = tong / 4, ds = []
    for (let x = 0; x <= 12; x++) for (let y = 0; y <= 20; y++) if (25 * x + 21 * y === canh) ds.push([x, y])
    // mỗi cạnh dùng (x, y): 4 cạnh dùng hết 12 que 25cm và 20 que 21cm
    const ok = ds.filter(([x, y]) => 4 * x === 12 && 4 * y === 20)
    if (ok.length !== 1) return ['không']
    return ['có', `${ok[0][0]}đoạndài25cm`, `${ok[0][1]}đoạndài21cm`]
  },
  // 7 rổ trứng, bán 6 rổ, còn 1 rổ trứng gà; trong số đã bán trứng vịt gấp 3 lần trứng gà
  'CĐ7 · B17': () => {
    const r = [45, 56, 60, 66, 75, 85, 92], tong = r.reduce((a, b) => a + b, 0), ds = []
    for (let i = 0; i < 7; i++) {
      const con = r[i], ban = r.filter((_, j) => j !== i)
      for (let mask = 0; mask < 64; mask++) {
        let ga = 0, vit = 0
        ban.forEach((v, j) => { if (mask >> j & 1) ga += v; else vit += v })
        if (vit === 3 * ga) ds.push([con, ga + con, vit])
      }
    }
    const [con, gaDau, vitDau] = duyNhat(ds, 'B17')
    if (gaDau + vitDau !== tong) throw new Error('B17: tổng sai')
    return [`${con}quả`, `${gaDau}quả`, `${vitDau}quả`]
  },
  // M = 55…5 (2024 chữ số 5): số nhỏ nhất cộng thêm để chia hết 15; số nhỏ nhất bớt đi để chia hết 45
  'CĐ7 · B18a': () => {
    const M = so('5'.repeat(2024))
    for (let k = 0n; ; k++) if ((M + k) % 15n === 0n) return [`${k}đơnvị`]
  },
  'CĐ7 · B18b': () => {
    const M = so('5'.repeat(2024))
    for (let k = 0n; ; k++) if ((M - k) % 45n === 0n) return [`${k}đơnvị`]
  },
}
