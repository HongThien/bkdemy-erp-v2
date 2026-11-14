// ============================================================================
// k4T-5dang-sinh.mjs — SINH câu cho 5 dạng bài bản đồ mới 4T mà sách "Toán arc 4 Q1" KHÔNG có bài nào (Thùy 14/11 "Soạn 5 dạng còn trống"):
//   NDB01547 tỉ số nhiều đại lượng — quy về đại lượng nhỏ nhất · NDB01548 — tỉ số đôi một · NDB01549 — phân số của các đại lượng bằng nhau
//   NDB01553 quy đồng tử số 2 phân số · NDB01577 tìm x áp dụng dãy phân số hiệu – tích.
// Mẫu bám MÔ TẢ + LÝ THUYẾT + VÍ DỤ của dạng (đã ghi lên bản đồ 14/11, kho-rules/dai/lo/b3/k4T-lt). Không có câu gốc (parent = null).
// Đề hỏi MỘT đại lượng (đáp số 1 giá trị ⇒ sinh được trắc nghiệm). Lời giải 2 phần như kho 4T (lg của k4T-sinh.mjs, card 3–6 bước).
// Bộ kiểm độc lập: k4T-5dang-kiem.mjs (đọc lại số từ chữ của đề, vét cạn / tính phân số đúng, không dùng công thức bộ sinh).
//   node scripts/kho/clone/k4T-5dang-sinh.mjs --out <lo.json> [--muc 40] [--seed 20261114]
// ============================================================================
import { writeFileSync } from 'node:fs'
import { taoRnd, lg, chuanDe } from './k4T-sinh.mjs'

const args = process.argv.slice(2), opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d }
let R = taoRnd(+opt('--seed', 20261114))
const ri = (a, b) => a + Math.floor(R() * (b - a + 1))
const pick = (a) => a[Math.floor(R() * a.length)]
const xao = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a))
const lcm = (a, b) => (a / gcd(a, b)) * b
const m$ = (x) => `$${x}$`
const F = (p, q) => `\\dfrac{${p}}{${q}}`
const rg = (p, q) => { const g = gcd(p, q); return [p / g, q / g] }
const X = '\\times '
const TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Lan', 'Mai', 'Nam', 'Hoa', 'Minh', 'Tú', 'Phúc', 'Quân', 'Vy', 'Linh', 'Khoa', 'Hùng', 'Thảo', 'Huy', 'Yến', 'Trang', 'Sơn']
const SO = ['', 'một', 'hai', 'ba', 'bốn']
const cap = (s) => s[0].toUpperCase() + s.slice(1)

export const MAU = []
const them = (m) => MAU.push(m)

// Ngữ cảnh "ba người / ba kho …" — vật · đơn vị · động từ có · khoảng tổng hợp lý
const CTX = [
  { ai: () => xao(TEN).slice(0, 3), loai: 'người', vat: 'viên bi', dv: 'viên', co: 'có', tong: [40, 300] },
  { ai: () => xao(TEN).slice(0, 3), loai: 'người', vat: 'quyển truyện', dv: 'quyển', co: 'có', tong: [30, 200] },
  { ai: () => xao(TEN).slice(0, 3), loai: 'người', vat: 'nghìn đồng tiền tiết kiệm', dv: 'nghìn đồng', co: 'có', tong: [60, 600] },
  { ai: () => ['kho thứ nhất', 'kho thứ hai', 'kho thứ ba'], loai: 'kho', vat: 'tấn thóc', dv: 'tấn', co: 'chứa', tong: [60, 600] },
  { ai: () => ['lớp 4A', 'lớp 4B', 'lớp 4C'], loai: 'lớp', vat: 'cây', dv: 'cây', co: 'trồng được', tong: [60, 400] },
  { ai: () => ['thùng thứ nhất', 'thùng thứ hai', 'thùng thứ ba'], loai: 'thùng', vat: 'lít dầu', dv: 'lít', co: 'đựng', tong: [60, 500] },
  { ai: () => ['đội Một', 'đội Hai', 'đội Ba'], loai: 'đội', vat: 'mét đường', dv: 'm', co: 'sửa được', tong: [120, 900] },
]
const tenTap = (ctx, ai) => (ctx.loai === 'người' ? `Ba bạn ${ai[0]}, ${ai[1]} và ${ai[2]}` : `Ba ${ctx.loai} ${ai.map((x) => x.replace(/^(kho|thùng|đội|lớp) /, '')).join(', ').replace(/, ([^,]+)$/, ' và $1')}`)
const goi = (ctx, x) => (ctx.loai === 'người' ? x : x)

// ── NDB01547 · quy về đại lượng nhỏ nhất ─────────────────────────────────────────────────────
them({ dang: 'NDB01547', ten: 'quy-ve-nho-nhat',
  tham() {
    for (;;) {
      const ctx = pick(CTX), ai = ctx.ai(), p = ri(2, 5), q = ri(2, 6); if (p === q) continue
      const tongPhan = 1 + p + q, a = ri(Math.ceil(ctx.tong[0] / tongPhan), Math.floor(ctx.tong[1] / tongPhan)); if (a < 2) continue
      return { ctx, ai, p, q, a, T: a * tongPhan, tongPhan, hoi: ri(0, 2) }
    }
  },
  dung({ ctx, ai, p, q, a, T, tongPhan, hoi }) {
    const v = [a, a * p, a * q], ten = ai.map((x) => goi(ctx, x))
    const de = `${tenTap(ctx, ai)} ${ctx.co} tất cả ${T} ${ctx.vat}. Số ${ctx.vat} của ${ten[1]} gấp ${p} lần của ${ten[0]}, số ${ctx.vat} của ${ten[2]} gấp ${q} lần của ${ten[0]}. Hỏi ${ten[hoi]} ${ctx.co} bao nhiêu ${ctx.vat}?`
    const tim = hoi === 0 ? [] : [`${cap(ten[hoi])} ${ctx.co} số ${ctx.vat} là: ${m$(`${a}${X}${hoi === 1 ? p : q}=${v[hoi]}`)} (${ctx.dv})`]
    return { noi_dung: de, dap_an: `${m$(v[hoi])} ${ctx.dv}`, loi_giai: lg({
      mau_chot: `${cap(ten[1])} và ${ten[2]} đều được so với cùng ${ten[0]} — đại lượng nhỏ nhất. Coi số ${ctx.vat} của ${ten[0]} là $1$ phần thì ${ten[1]} có ${m$(p)} phần, ${ten[2]} có ${m$(q)} phần.`,
      buoc: [`Tính tổng số phần bằng nhau của cả ba: ${m$(`1+${p}+${q}`)}.`, `Lấy tổng ${m$(T)} chia cho tổng số phần để được giá trị một phần (đó cũng là số ${ctx.vat} của ${ten[0]}).`, hoi === 0 ? `Đề hỏi ${ten[0]} — chính là giá trị một phần.` : `Nhân giá trị một phần với số phần của ${ten[hoi]}.`],
      chu_y: `${cap(ten[0])} cũng tính là $1$ phần khi cộng tổng số phần.`,
      p2: ['Bài giải', `Tổng số phần bằng nhau là: ${m$(`1+${p}+${q}=${tongPhan}`)} (phần)`, `${cap(ten[0])} ${ctx.co} số ${ctx.vat} là: ${m$(`${T}:${tongPhan}=${a}`)} (${ctx.dv})`, ...tim, `Đáp số: ${m$(v[hoi])} ${ctx.dv}`] }) }
  } })

// ── NDB01548 · tỉ số đôi một (đại lượng ở giữa xuất hiện hai lần) ────────────────────────────
them({ dang: 'NDB01548', ten: 'ti-so-doi-mot',
  tham() {
    for (;;) {
      const ctx = pick(CTX), ai = ctx.ai()
      const b = ri(2, 6), a = ri(1, b - 1), d = ri(2, 7), c = ri(1, d - 1)              // I = a/b II ; II = c/d III
      if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
      const L = lcm(b, c), pI = (a * L) / b, pII = L, pIII = (d * L) / c, tp = pI + pII + pIII
      if (tp > 40 || b === c) continue                                                    // b = c thì đã cùng số phần — không còn bước đồng nhất
      const u = ri(Math.ceil(ctx.tong[0] / tp), Math.floor(ctx.tong[1] / tp)); if (u < 1) continue
      return { ctx, ai, a, b, c, d, L, pI, pII, pIII, tp, u, T: u * tp, hoi: ri(0, 2) }
    }
  },
  dung({ ctx, ai, a, b, c, d, L, pI, pII, pIII, tp, u, T, hoi }) {
    const ten = ai, ph = [pI, pII, pIII], v = ph.map((x) => x * u)
    const de = `${tenTap(ctx, ai)} ${ctx.co} tất cả ${T} ${ctx.vat}. Số ${ctx.vat} của ${ten[0]} bằng ${m$(F(a, b))} số ${ctx.vat} của ${ten[1]}, số ${ctx.vat} của ${ten[1]} bằng ${m$(F(c, d))} số ${ctx.vat} của ${ten[2]}. Hỏi ${ten[hoi]} ${ctx.co} bao nhiêu ${ctx.vat}?`
    const kI = L / b, kIII = L / c
    return { noi_dung: de, dap_an: `${m$(v[hoi])} ${ctx.dv}`, loi_giai: lg({
      mau_chot: `${cap(ten[1])} xuất hiện ở cả hai tỉ số: là ${m$(b)} phần khi so với ${ten[0]} nhưng là ${m$(c)} phần khi so với ${ten[2]}. Phải đưa ${ten[1]} về cùng một số phần (${m$(L)} phần) rồi mới ghép được cả ba.`,
      buoc: [`Từ tỉ số thứ nhất: ${ten[0]} ${m$(a)} phần thì ${ten[1]} ${m$(b)} phần.`, `Từ tỉ số thứ hai: ${ten[1]} ${m$(c)} phần thì ${ten[2]} ${m$(d)} phần.`, `Chọn số phần chung cho ${ten[1]} là ${m$(L)} (số nhỏ nhất chia hết cho cả ${m$(b)} và ${m$(c)}), nhân cả hai số trong mỗi tỉ số lên cho khớp.`, `Cộng số phần của cả ba, lấy tổng chia cho tổng số phần được một phần, rồi tính số cần tìm.`],
      chu_y: `Khi nhân số phần lên phải nhân cả hai số trong cùng một tỉ số.`,
      p2: ['Bài giải',
        ...(kI === 1 ? [] : [`Ta có: ${m$(`${F(a, b)}=${F(`${a}${X}${kI}`, `${b}${X}${kI}`)}=${F(pI, pII)}`)}`]),
        `Số ${ctx.vat} của ${ten[0]} bằng ${m$(F(pI, pII))} số ${ctx.vat} của ${ten[1]} nên ${ten[0]} có ${m$(pI)} phần thì ${ten[1]} có ${m$(pII)} phần.`,
        ...(kIII === 1 ? [] : [`Ta có: ${m$(`${F(c, d)}=${F(`${c}${X}${kIII}`, `${d}${X}${kIII}`)}=${F(pII, pIII)}`)}`]),
        `Số ${ctx.vat} của ${ten[1]} bằng ${m$(F(pII, pIII))} số ${ctx.vat} của ${ten[2]} nên ${ten[1]} có ${m$(pII)} phần thì ${ten[2]} có ${m$(pIII)} phần.`,
        `Tổng số phần bằng nhau là: ${m$(`${pI}+${pII}+${pIII}=${tp}`)} (phần)`,
        `Giá trị một phần là: ${m$(`${T}:${tp}=${u}`)} (${ctx.dv})`,
        `${cap(ten[hoi])} ${ctx.co} số ${ctx.vat} là: ${m$(`${u}${X}${ph[hoi]}=${v[hoi]}`)} (${ctx.dv})`,
        `Đáp số: ${m$(v[hoi])} ${ctx.dv}`] }) }
  } })

// ── NDB01549 · phân số của các đại lượng bằng nhau ───────────────────────────────────────────
them({ dang: 'NDB01549', ten: 'phan-so-bang-nhau',
  tham() {
    for (;;) {
      const ctx = pick(CTX), ai = ctx.ai(), n = ri(2, 3) === 2 && R() < 0.35 ? 2 : 3
      const m = xao([2, 3, 4, 5, 6, 7]).slice(0, n); const tp = m.reduce((s, x) => s + x, 0)
      const u = ri(Math.ceil(ctx.tong[0] / tp), Math.floor(ctx.tong[1] / tp)); if (u < 2) continue
      return { ctx, ai: ai.slice(0, n), m, tp, u, T: u * tp, hoi: ri(0, n - 1) }
    }
  },
  dung({ ctx, ai, m, tp, u, T, hoi }) {
    const n = ai.length, ten = ai, v = m.map((x) => x * u)
    const tap = n === 3 ? tenTap(ctx, ai) : (ctx.loai === 'người' ? `Hai bạn ${ai[0]} và ${ai[1]}` : `Hai ${ctx.loai} ${ai.map((x) => x.replace(/^(kho|thùng|đội|lớp) /, '')).join(' và ')}`)
    const bang = ten.map((t, i) => `${m$(F(1, m[i]))} số ${ctx.vat} của ${t}`).join(' bằng ')
    const de = `${tap} ${ctx.co} tất cả ${T} ${ctx.vat}. Biết ${bang}. Hỏi ${ten[hoi]} ${ctx.co} bao nhiêu ${ctx.vat}?`
    return { noi_dung: de, dap_an: `${m$(v[hoi])} ${ctx.dv}`, loi_giai: lg({
      mau_chot: `Các phân số ${m.map((x) => m$(F(1, x))).join(', ')} của ${n === 3 ? 'ba' : 'hai'} đại lượng bằng nhau. Coi phần bằng nhau ấy là $1$ phần: ${m$(F(1, m[0]))} số ${ctx.vat} của ${ten[0]} là $1$ phần thì ${ten[0]} có ${m$(m[0])} phần.`,
      buoc: [`Từ mỗi phân số ${m$(F(1, 'a'))} suy ra đại lượng đó có ${m$('a')} phần: ${ten.map((t, i) => `${t} ${m$(m[i])} phần`).join(', ')}.`, `Cộng số phần của ${n === 3 ? 'cả ba' : 'cả hai'} được tổng số phần.`, `Lấy tổng ${m$(T)} chia cho tổng số phần được giá trị một phần.`, `Nhân giá trị một phần với số phần của ${ten[hoi]}.`],
      chu_y: `${m$(F(1, 'a'))} của một đại lượng là $1$ phần nghĩa là đại lượng đó có ${m$('a')} phần, không phải ${m$(F(1, 'a'))} phần.`,
      p2: ['Bài giải', `Coi ${m$(F(1, m[0]))} số ${ctx.vat} của ${ten[0]} là $1$ phần thì ${ten.map((t, i) => `${t} có ${m$(m[i])} phần`).join(', ')}.`,
        `Tổng số phần bằng nhau là: ${m$(`${m.join('+')}=${tp}`)} (phần)`, `Giá trị một phần là: ${m$(`${T}:${tp}=${u}`)} (${ctx.dv})`,
        `${cap(ten[hoi])} ${ctx.co} số ${ctx.vat} là: ${m$(`${u}${X}${m[hoi]}=${v[hoi]}`)} (${ctx.dv})`, `Đáp số: ${m$(v[hoi])} ${ctx.dv}`] }) }
  } })

// ── NDB01553 · quy đồng tử số 2 phân số ──────────────────────────────────────────────────────
them({ dang: 'NDB01553', ten: 'quy-dong-tu',
  tham() {
    for (;;) {
      const a = ri(2, 9), c = ri(2, 9); if (a === c) continue
      const b = ri(a + 1, a + 9), d = ri(c + 1, c + 9)
      if (gcd(a, b) !== 1 || gcd(c, d) !== 1) continue
      const T = lcm(a, c); if (T === a || T === c || T > 60) continue                     // một tử chia hết cho tử kia ⇒ quá dễ; tránh tử chung quá lớn
      return { a, b, c, d, T }
    }
  },
  dung({ a, b, c, d, T }) {
    const k1 = T / a, k2 = T / c, p1 = F(T, b * k1), p2 = F(T, d * k2)
    return { noi_dung: `Quy đồng tử số hai phân số ${m$(F(a, b))} và ${m$(F(c, d))}.`, dap_an: `${m$(p1)} ; ${m$(p2)}`, loi_giai: lg({
      mau_chot: `Quy đồng tử số là đưa hai phân số về cùng một TỬ số mà giá trị không đổi, nên nhân cả tử số lẫn mẫu số của mỗi phân số với cùng một số.`,
      buoc: [`Chọn tử số chung: số nhỏ nhất chia hết cho cả hai tử số ${m$(a)} và ${m$(c)} là ${m$(T)}.`, `Lấy ${m$(T)} chia cho từng tử số: ${m$(`${T}:${a}=${k1}`)} và ${m$(`${T}:${c}=${k2}`)}.`, `Nhân cả tử số và mẫu số của ${m$(F(a, b))} với ${m$(k1)}, của ${m$(F(c, d))} với ${m$(k2)}.`],
      chu_y: `Vẫn phải nhân cả mẫu số, không chỉ nhân tử số.`,
      p2: [`Chọn tử số chung là: ${m$(T)}.`, `${m$(`${F(a, b)}=${F(`${a}${X}${k1}`, `${b}${X}${k1}`)}=${p1}`)}`, `${m$(`${F(c, d)}=${F(`${c}${X}${k2}`, `${d}${X}${k2}`)}=${p2}`)}`,
        `Vậy quy đồng tử số hai phân số ${m$(F(a, b))} và ${m$(F(c, d))} ta được hai phân số ${m$(p1)} và ${m$(p2)}.`] }) }
  } })

// ── NDB01577 · tìm x áp dụng dãy phân số hiệu – tích ─────────────────────────────────────────
const tru = ([p, q], [r, s]) => rg(p * s - r * q, q * s), cong = ([p, q], [r, s]) => rg(p * s + r * q, q * s), nhan = ([p, q], [r, s]) => rg(p * r, q * s), chia = ([p, q], [r, s]) => rg(p * s, q * r)
const fs$ = ([p, q]) => (q === 1 ? `${p}` : F(p, q))
them({ dang: 'NDB01577', ten: 'tim-x-day-hieu-tich',
  tham() {
    for (;;) {
      const k = ri(1, 3)                                         // tử số = k = hiệu hai thừa số ở mẫu (chuẩn): k/(n(n+k))
      const dau = ri(2, 6), so = ri(3, 6), cuoi = dau + k * so    // dãy n = dau, dau+k, …, cuoi-k ; tổng = 1/dau - 1/cuoi
      if (cuoi > 30) continue
      const S = rg(cuoi - dau, dau * cuoi)
      const phep = pick(['x-S', 'x+S', 'S-x', 'x*S', 'x:S'])
      const r = pick([[1, 2], [1, 3], [2, 3], [1, 4], [3, 4], [1, 5], [2, 5], [1, 6], [5, 6], [1, 1], [2, 1]])
      let x
      if (phep === 'x-S') x = cong(r, S); else if (phep === 'x+S') { x = tru(r, S); if (x[0] <= 0) continue } else if (phep === 'S-x') { x = tru(S, r); if (x[0] <= 0) continue }
      else if (phep === 'x*S') x = chia(r, S); else x = nhan(r, S)
      if (x[1] > 200 || x[0] > 400) continue
      return { k, dau, so, cuoi, S, phep, r, x }
    }
  },
  dung({ k, dau, so, cuoi, S, phep, r, x }) {
    const hang = Array.from({ length: so }, (_, i) => dau + k * i)
    const day = hang.length > 4 ? [hang[0], hang[1], hang[2]].map((n) => F(k, `${n}${X}${n + k}`)).join('+') + `+…+${F(k, `${hang.at(-1)}${X}${cuoi}`)}` : hang.map((n) => F(k, `${n}${X}${n + k}`)).join('+')
    const tach = hang.length > 4 ? `${F(1, dau)}-${F(1, dau + k)}+${F(1, dau + k)}-${F(1, dau + 2 * k)}+…+${F(1, hang.at(-1))}-${F(1, cuoi)}` : hang.map((n) => `${F(1, n)}-${F(1, n + k)}`).join('+')
    const D = `\\left(${day}\\right)`, rr = fs$(r)
    const de = { 'x-S': `x-${D}=${rr}`, 'x+S': `x+${D}=${rr}`, 'S-x': `${D}-x=${rr}`, 'x*S': `x${X}${D}=${rr}`, 'x:S': `x:${D}=${rr}` }[phep]
    const S$ = fs$(S)
    const tp = { 'x-S': ['số bị trừ', `x=${rr}+${S$}`], 'x+S': ['số hạng', `x=${rr}-${S$}`], 'S-x': ['số trừ', `x=${S$}-${rr}`], 'x*S': ['thừa số', `x=${rr}:${S$}`], 'x:S': ['số bị chia', `x=${rr}${X}${S$}`] }[phep]
    const lai = { 'x-S': `x-${S$}=${rr}`, 'x+S': `x+${S$}=${rr}`, 'S-x': `${S$}-x=${rr}`, 'x*S': `x${X}${S$}=${rr}`, 'x:S': `x:${S$}=${rr}` }[phep]
    return { noi_dung: `Tìm $x$, biết: ${m$(de)}`, dap_an: `${m$(`x=${fs$(x)}`)}`, loi_giai: lg({
      mau_chot: `Trong ngoặc là dãy phân số có tử số ${m$(k)} đúng bằng hiệu hai thừa số ở mẫu, nên tách mỗi phân số thành hiệu, ví dụ ${m$(`${F(k, `${dau}${X}${dau + k}`)}=${F(1, dau)}-${F(1, dau + k)}`)}. Tính dãy trước rồi mới tìm $x$.`,
      buoc: [`Tách từng phân số trong ngoặc thành hiệu hai phân số có tử số $1$.`, `Các phân số ở giữa vừa cộng vừa trừ nên triệt tiêu, còn ${m$(`${F(1, dau)}-${F(1, cuoi)}=${S$}`)}.`, `Viết lại: ${m$(lai)}; $x$ là ${tp[0]}.`, `Áp dụng quy tắc tìm ${tp[0]} rồi tính.`],
      chu_y: `Tính xong cả dãy trong ngoặc rồi mới tìm $x$; xác định đúng $x$ là thành phần nào trước khi chọn phép tính.`,
      p2: [`${m$(de)}`, `${m$(de.replace(day, tach))}`, `${m$(de.replace(D, `\\left(${F(1, dau)}-${F(1, cuoi)}\\right)`))}`, `${m$(lai)}`, `${m$(tp[1])}`, `${m$(`x=${fs$(x)}`)}`, `Vậy ${m$(`x=${fs$(x)}`)}.`] }) }
  } })

// ── chạy ─────────────────────────────────────────────────────────────────────────────────────
export function sinh({ muc = 40 } = {}) {
  const lo = [], bao = []
  for (const m of MAU) {
    const da = new Set(), dapSo = new Map(); let n = 0, thu = 0
    while (n < muc && thu < 6000) {
      thu++
      const c = m.dung(m.tham()), k = chuanDe(c.noi_dung); if (da.has(k)) continue
      const lap = dapSo.get(c.dap_an) || 0; if (lap >= 2 && thu < 3000) continue
      da.add(k); dapSo.set(c.dap_an, lap + 1); n++
      lo.push({ id: lo.length + 1, dang: m.dang, parent: null, mau: m.ten, loai_cau: 'tra_loi_ngan', so_do: null, ...c })
    }
    bao.push(`${m.dang} ${m.ten}: ${n}${n < muc ? ' ⚠ THIẾU' : ''}`)
  }
  return { lo, bao }
}
if (process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/').split('/').pop())) {
  const { lo, bao } = sinh({ muc: +opt('--muc', 40) })
  writeFileSync(opt('--out', 'k4T-5dang.json'), JSON.stringify(lo, null, 1))
  console.log(bao.join('\n'), '\n→', opt('--out', 'k4T-5dang.json'), lo.length, 'câu')
}
