// me4-kiem-cd08.mjs — máy kiểm đáp số CĐ8 "Cấu tạo số" (ME 4). Mỗi hàm TỰ TÍNH TỪ ĐỀ bằng vét cạn trên mọi số (không dùng ẩn chữ số, không chép lời giải sách).
// Trả mảng chuỗi phải có mặt trong dap_an sau chuẩn hoá (bỏ $ và khoảng trắng, chữ thường).
// Quy ước: "số tự nhiên" của các bài tìm số được xét từ 1 trở lên (CĐ8 · B5: số 0 cũng thoả 0 = 9 × 0 nhưng sách và đề tìm số khác 0 — xem ghi chú).

const MAX = 200000   // đủ rộng: mọi bài dưới đây có đáp số rõ ràng bé hơn nhiều; thêm cận kiểm cho bài không giới hạn số chữ số
const tongCs = (n) => String(n).split('').reduce((s, c) => s + Number(c), 0)
const tichCs = (n) => String(n).split('').reduce((s, c) => s * Number(c), 1)
const duyNhat = (ds, ten) => { if (ds.length !== 1) throw new Error(`${ten}: tìm được ${ds.length} nghiệm`); return ds[0] }

export const KIEM_CD08 = {
  // xoá chữ số 3 ở hàng đơn vị thì số mới giảm 1794 so với số ban đầu (số ban đầu tận cùng bằng 3, ≥ 10)
  'CĐ8 · B1': () => {
    const ds = []
    for (let n = 13; n <= MAX; n += 10) if (n % 10 === 3 && n - Math.floor(n / 10) === 1794) ds.push(n)
    return [String(duyNhat(ds, 'B1'))]
  },
  // viết thêm chữ số 2 vào đằng trước số có ba chữ số được số mới bằng 9 lần số cũ
  'CĐ8 · B2': () => {
    const ds = []
    for (let n = 100; n <= 999; n++) if (Number('2' + n) === 9 * n) ds.push(n)
    return [String(duyNhat(ds, 'B2'))]
  },
  // số có ba chữ số: viết 5 đằng trước và đằng sau thì được hai số có bốn chữ số, số trước hơn số sau 1107
  'CĐ8 · B3': () => {
    const ds = []
    for (let n = 100; n <= 999; n++) if (Number('5' + n) - Number(n + '5') === 1107) ds.push(n)
    return [String(duyNhat(ds, 'B3'))]
  },
  // số có hai chữ số: viết thêm chữ số 0 vào giữa hai chữ số được số mới bằng 7 lần số cũ
  'CĐ8 · B4': () => {
    const ds = []
    for (let n = 10; n <= 99; n++) { const s = String(n); if (Number(s[0] + '0' + s[1]) === 7 * n) ds.push(n) }
    return [String(duyNhat(ds, 'B4'))]
  },
  // số tự nhiên (≥ 1) bằng 9 lần chữ số hàng đơn vị của nó (xét tới MAX)
  'CĐ8 · B5': () => {
    const ds = []
    for (let n = 1; n <= MAX; n++) if (n === 9 * (n % 10)) ds.push(n)
    return [String(duyNhat(ds, 'B5'))]
  },
  // số có hai chữ số chia cho tổng các chữ số được thương 9 dư 1 (số dư bé hơn số chia)
  'CĐ8 · B6': () => {
    const ds = []
    for (let n = 10; n <= 99; n++) { const s = tongCs(n); if (Math.floor(n / s) === 9 && n % s === 1) ds.push(n) }
    return [String(duyNhat(ds, 'B6'))]
  },
  // số có ba chữ số chia cho tổng các chữ số của nó thì bằng 11 (chia hết, thương 11)
  'CĐ8 · B7': () => {
    const ds = []
    for (let n = 100; n <= 999; n++) if (n === 11 * tongCs(n)) ds.push(n)
    return [String(duyNhat(ds, 'B7'))]
  },
  // số hai chữ số ab, viết thêm hai chữ số cd vào bên phải thì số mới lớn hơn ab đúng 1986 đơn vị
  'CĐ8 · B8': () => {
    const ds = []
    for (let ab = 10; ab <= 99; ab++) for (let cd = 0; cd <= 99; cd++) {
      if (ab * 100 + cd === ab + 1986) ds.push([ab, String(cd).padStart(2, '0')])
    }
    const [ab, cd] = duyNhat(ds, 'B8')
    return [`sốđãcho:${ab}`, `${cd[0]}và${cd[1]}`]
  },
  // số có ba chữ số; gạch chữ số hàng trăm được số có hai chữ số (chữ số đầu khác 0), nhân với 7 được số ban đầu
  'CĐ8 · B9': () => {
    const ds = []
    for (let n = 100; n <= 999; n++) { const con = n % 100; if (con >= 10 && con * 7 === n) ds.push(n) }
    return [String(duyNhat(ds, 'B9'))]
  },
  // số có ba chữ số gấp 5 lần tích các chữ số của nó
  'CĐ8 · B10': () => {
    const ds = []
    for (let n = 100; n <= 999; n++) if (n === 5 * tichCs(n)) ds.push(n)
    return [String(duyNhat(ds, 'B10'))]
  },
  // abcd + abc + ab + a = 11106 (a ≠ 0)
  'CĐ8 · B11': () => {
    const ds = []
    for (let n = 1000; n <= 9999; n++) {
      const s = String(n)
      if (n + Number(s.slice(0, 3)) + Number(s.slice(0, 2)) + Number(s[0]) === 11106) ds.push(s)
    }
    const s = duyNhat(ds, 'B11')
    return [`a=${s[0]};b=${s[1]};c=${s[2]};d=${s[3]}`]
  },
  // abcd + abc + ab + a = 1111 (a ≠ 0)
  'CĐ8 · B12': () => {
    const ds = []
    for (let n = 1000; n <= 9999; n++) {
      const s = String(n)
      if (n + Number(s.slice(0, 3)) + Number(s.slice(0, 2)) + Number(s[0]) === 1111) ds.push(s)
    }
    const s = duyNhat(ds, 'B12')
    return [`a=${s[0]};b=${s[1]};c=${s[2]};d=${s[3]}`]
  },
  // aa × bc = 1001, a, b, c khác nhau (a ≠ 0, b ≠ 0 vì bc là số có hai chữ số)
  'CĐ8 · B13': () => {
    const ds = []
    for (let a = 1; a <= 9; a++) for (let b = 0; b <= 9; b++) for (let c = 0; c <= 9; c++) {
      if (a !== b && b !== c && a !== c && (a * 11) * (b * 10 + c) === 1001) ds.push([a, b, c])
    }
    const [a, b, c] = duyNhat(ds, 'B13')
    return [`a=${a};b=${b};c=${c}`]
  },
  // a × b × ab = bbb, a và b khác 0
  'CĐ8 · B14': () => {
    const ds = []
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) if (a * b * (a * 10 + b) === b * 111) ds.push([a, b])
    const [a, b] = duyNhat(ds, 'B14')
    return [`a=${a};b=${b}`]
  },
  // ab × cd = bbb, ab và cd là số có hai chữ số (chữ số hàng chục khác 0)
  'CĐ8 · B15': () => {
    const ds = []
    for (let ab = 10; ab <= 99; ab++) for (let cd = 10; cd <= 99; cd++) {
      const b = ab % 10
      if (b >= 1 && ab * cd === b * 111) ds.push([ab, cd])
    }
    if (ds.length !== 2) throw new Error(`B15: ${ds.length} cặp`)
    return ds.map(([ab, cd]) => `\\overline{ab}=${ab}và\\overline{cd}=${cd}`)
  },
}
