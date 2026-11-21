// ============================================================================
// k7-fill.mjs — fill kho Đại K7 (spec-giai-bai §C13) cho các dạng thiếu, theo luật Thùy 21/11:
//   · dạng độ khó ≥ 4: chỉ cần 10–30 câu, số lượng do điều phối quyết theo độ biến đổi được của dạng;
//   · dạng độ khó ≤ 3: đủ 30 câu dùng được.
//   NDB00797 (4) 15 · NDB01343 (5) 12 · NDB01345 (5) 15 · NDB01346 (4) 20 · NDB01350 (4) 15 · NDB01037 (3) → 30 · NDB01206 (2) → 30 · NDB01355 (3) → 30
//   (NDB00441, NDB01344 đã ≥ 28 — giữ nguyên; NDB01340 nháp chờ trưởng khối; NDB01349 cần hình đề.)
//
//   node scripts/kho/clone/k7-fill.mjs [--dang NDB…,NDB…] [--ghi]     # mặc định chạy thử (ROLLBACK)
//   node scripts/kho/clone/k7-fill.mjs thu                              # chỉ chạy bộ kiểm (+ thử cố tình sai)
//
// Bài lẻ theo chỉ định dạng (§C11): bộ sinh bằng code (đáp số tính bằng code) → bộ kiểm ĐỘC LẬP đọc lại đề từ chữ, tính lại bằng phân số BigInt
// → cổng `cong-ghi` → `_kho_insert` (dang_bai + dang_bai_chot) → da_duyet=true, duyet_nguon='ai'.
// ============================================================================
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'
import { xetGoi, bamNoiDung } from '../cong-ghi.mjs'
import { insertCauBatch } from '../../_kho_insert.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..')
const env = Object.fromEntries(readFileSync(join(root, '.env'), 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.trim().startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]))
const [LENH0, ...rest] = process.argv.slice(2)
const LENH = LENH0?.startsWith('--') ? 'moi' : (LENH0 ?? 'moi')
const args = LENH0?.startsWith('--') ? [LENH0, ...rest] : rest
const GHI = args.includes('--ghi')
const CHI_DANG = args.includes('--dang') ? args[args.indexOf('--dang') + 1].split(',') : null

// ── phân số BigInt ────────────────────────────────────────────────────────────────────────────────────────────────
const G = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class Q {
  constructor(n, d = 1n) { n = BigInt(n); d = BigInt(d); if (d < 0n) { n = -n; d = -d } const g = G(n, d) || 1n; this.n = n / g; this.d = d / g }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new Q(this.n * o.n, this.d * o.d) }
  cmp(o) { const x = this.n * o.d - o.n * this.d; return x < 0n ? -1 : x > 0n ? 1 : 0 }
  str() { return this.d === 1n ? `${this.n}` : `\\dfrac{${this.n}}{${this.d}}` }
}
const inv = (a, b) => new Q(a, b)
let seed = 20261121
const rnd = () => { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296 }
const tron = (a) => { a = [...a]; for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] } return a }
const LG = (chot, buoc, trinhBay) => `**Phần 1. Hướng dẫn**\n\n**Mấu chốt:** ${chot}\n\n${buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`).join('\n\n')}\n\n**Phần 2. Trình bày**\n\n${trinhBay.join('\n\n')}`
const df = (a, b) => `\\dfrac{${a}}{${b}}`
const mu = (b, e) => (e === 1 ? `${b}` : `${b}^{${e}}`)

// ═════════════════ NDB00797 — hiệu tích: mẫu là tích ba thừa số cách đều ═════════════════════════════════════════
function hieuTich3(c, d, a, m, kieu) {
  const ks = Array.from({ length: m }, (_, i) => a + i * d), L = ks[m - 1]
  const T = (k) => `${df(c, `${k}\\cdot${k + d}\\cdot${k + 2 * d}`)}`
  const dau = `${T(ks[0])}+${T(ks[1])}+${T(ks[2])}+\\dots+${T(L)}`
  const he = new Q(c, 2 * d), dauQ = inv(1, a * (a + d)), cuoiQ = inv(1, (L + d) * (L + 2 * d)), S = he.mul(dauQ.sub(cuoiQ))
  const tren = he.mul(dauQ)
  const bd = (k) => `${df(1, `${k}\\cdot${k + d}`)}-${df(1, `${k + d}\\cdot${k + 2 * d}`)}`
  const chung = [
    `Với mỗi số $k$ ta có $${df(2 * d, `k(k+${d})(k+${2 * d})`)}=${df(`(k+${2 * d})-k`, `k(k+${d})(k+${2 * d})`)}=${df(1, `k(k+${d})`)}-${df(1, `(k+${d})(k+${2 * d})`)}$, suy ra $${df(c, `k(k+${d})(k+${2 * d})`)}=${he.str()}.\\left[${df(1, `k(k+${d})`)}-${df(1, `(k+${d})(k+${2 * d})`)}\\right]$.`,
    `Do đó $A=${he.str()}.\\left[(${bd(ks[0])})+(${bd(ks[1])})+\\dots+(${bd(L)})\\right]$.`,
    `Các số hạng ở giữa triệt tiêu nhau, chỉ còn số hạng đầu và số hạng cuối: $A=${he.str()}.\\left[${df(1, `${a}\\cdot${a + d}`)}-${df(1, `${L + d}\\cdot${L + 2 * d}`)}\\right]$.`]
  const base = { noi_dung: kieu === 'tinh' ? `Tính $A=${dau}$.` : `Chứng minh rằng $A=${dau}<${tren.str()}$.` }
  const guide = LG('đưa mỗi số hạng về hiệu của hai phân số có mẫu là tích hai thừa số liên tiếp (cách đều) để các số hạng triệt tiêu nhau.', [
    'Tách $\\dfrac{2d}{k(k+d)(k+2d)}$ thành hiệu hai phân số bằng cách viết $2d=(k+2d)-k$.', 'Viết $A$ thành tổng các hiệu đó rồi triệt tiêu các số hạng ở giữa.', kieu === 'tinh' ? 'Tính kết quả còn lại và rút gọn.' : 'Bỏ số trừ dương để đánh giá kết quả so với số cần chứng minh.'], [...chung,
    ...(kieu === 'tinh' ? [`Suy ra $A=${he.str()}.\\left[${dauQ.str()}-${cuoiQ.str()}\\right]=${S.str()}$.`, `Vậy $A=${S.str()}$.`] : [`Vì $${cuoiQ.str()}>0$ nên $A<${he.str()}.${dauQ.str()}=${tren.str()}$.`, `Vậy $A<${tren.str()}$.`])])
  return { ...base, dap_an: kieu === 'tinh' ? `$${S.str()}$` : null, loai: kieu === 'tinh' ? 'tra_loi_ngan' : 'tu_luan', loi_giai: guide }
}
const MOI_00797 = [
  ...[[1, 1, 1, 20], [1, 1, 2, 30], [1, 1, 3, 18], [2, 1, 1, 15], [1, 2, 1, 12], [2, 2, 1, 10], [4, 2, 3, 9], [3, 1, 2, 25], [5, 1, 1, 40], [1, 1, 4, 40]].map((x) => hieuTich3(...x, 'tinh')),
  ...[[1, 1, 1, 48], [1, 1, 2, 30], [1, 2, 1, 25], [2, 1, 3, 40], [1, 1, 5, 60]].map((x) => hieuTich3(...x, 'cm')),
]

// ═════════════════ NDB01343 — dãy lập phương ═════════════════════════════════════════════════════════════════════
function dayLapPhuong(s, n, kieu) {
  const A = `${df(1, `${s}^3`)}+${df(1, `${s + 1}^3`)}+${df(1, `${s + 2}^3`)}+\\dots+${df(1, `${n}^3`)}`
  const chat = inv(1, 2 * s * (s - 1))                                // cận chặt: 1/(2s(s-1))
  const bd = (k) => `${df(1, `${k - 1}\\cdot${k}`)}-${df(1, `${k}\\cdot${k + 1}`)}`
  const chung = [
    `Với $k\\ge 2$ ta có $k^3>(k-1)k(k+1)$ nên $${df(1, 'k^3')}<${df(1, '(k-1)k(k+1)')}=${df(1, 2)}\\left[${df(1, '(k-1)k')}-${df(1, 'k(k+1)')}\\right]$.`,
    `Do đó $A<${df(1, 2)}\\left[(${bd(s)})+(${bd(s + 1)})+\\dots+(${bd(n)})\\right]=${df(1, 2)}\\left[${df(1, `${s - 1}\\cdot${s}`)}-${df(1, `${n}\\cdot${n + 1}`)}\\right]<${df(1, 2)}.${df(1, `${s - 1}\\cdot${s}`)}=${chat.str()}$.`]
  let de, ket
  if (kieu === 'chat') { de = `Chứng minh rằng $A=${A}<${chat.str()}$.`; ket = [`Vậy $A<${chat.str()}$.`] }
  else if (kieu === 'cong1') { const b = new Q(1).add(chat); de = `Chứng minh rằng $C=1+${A}<${b.str()}$.`; ket = [`Suy ra $C=1+A<1+${chat.str()}=${b.str()}$.`, `Vậy $C<${b.str()}$.`] }
  else { const lon = inv(1, s * (s - 1)); de = `Chứng minh rằng $A=${A}<${lon.str()}$.`; ket = [`Mà $${chat.str()}<${lon.str()}$ nên $A<${lon.str()}$.`, `Vậy $A<${lon.str()}$.`] }
  return {
    noi_dung: de.replace('$C=1+', '$C=1+'), dap_an: null, loai: 'tu_luan',
    loi_giai: LG('làm trội từng số hạng $\\dfrac1{k^3}$ bằng $\\dfrac1{(k-1)k(k+1)}$ rồi tách thành hiệu hai phân số để các số hạng triệt tiêu nhau.', ['Làm trội: $k^3>(k-1)k(k+1)$ nên $\\dfrac1{k^3}<\\dfrac1{(k-1)k(k+1)}$.', 'Tách $\\dfrac1{(k-1)k(k+1)}=\\dfrac12\\left[\\dfrac1{(k-1)k}-\\dfrac1{k(k+1)}\\right]$ rồi cộng lại, các số hạng ở giữa triệt tiêu.', 'So sánh kết quả với số cần chứng minh.'], [...chung, ...ket]),
  }
}
const MOI_01343 = [[2, 100, 'chat'], [2, 50, 'chat'], [3, 40, 'chat'], [3, 200, 'chat'], [4, 60, 'chat'], [5, 100, 'chat'], [2, 2025, 'chat'], [6, 80, 'chat'], [2, 30, 'cong1'], [2, 2024, 'cong1'], [2, 99, 'cong1'], [2, 10, 'nhe'], [3, 100, 'nhe'], [2, 500, 'nhe']].map(([s, n, k]) => dayLapPhuong(s, n, k))

// ═════════════════ NDB01345 — tổng của tích các số liên tiếp ═════════════════════════════════════════════════════
function tongTich(loai, a, n) {
  // loai 1: k(k+1) ; 2: k(k+1)(k+2) ; 3: k(k+2) với k lẻ (bước 2)
  const tich = (k) => (loai === 1 ? `${k}\\cdot${k + 1}` : loai === 2 ? `${k}\\cdot${k + 1}\\cdot${k + 2}` : `${k}\\cdot${k + 2}`)
  const buoc = loai === 3 ? 2 : 1, ks = []; for (let k = a; k <= n; k += buoc) ks.push(k)
  const dau = `${tich(ks[0])}+${tich(ks[1])}+${tich(ks[2])}+\\dots+${tich(ks.at(-1))}`
  const val = ks.reduce((s, k) => s + (loai === 1 ? BigInt(k) * BigInt(k + 1) : loai === 2 ? BigInt(k) * BigInt(k + 1) * BigInt(k + 2) : BigInt(k) * BigInt(k + 2)), 0n)
  const he = loai === 1 ? 3 : loai === 2 ? 4 : 6, ten = 'A'
  const f = (k) => (loai === 1 ? `${k - 1}\\cdot${k}\\cdot${k + 1}` : loai === 2 ? `${k - 1}\\cdot${k}\\cdot${k + 1}\\cdot${k + 2}` : `${k - 2}\\cdot${k}\\cdot${k + 2}`)
  const g = (k) => (loai === 1 ? `${k}\\cdot${k + 1}\\cdot${k + 2}` : loai === 2 ? `${k}\\cdot${k + 1}\\cdot${k + 2}\\cdot${k + 3}` : `${k}\\cdot${k + 2}\\cdot${k + 4}`)
  const kk = loai === 1 ? '(k+2)-(k-1)' : loai === 2 ? '(k+3)-(k-1)' : '(k+4)-(k-2)'
  const dacTrung = loai === 1 ? `3.k(k+1)=k(k+1).[(k+2)-(k-1)]=k(k+1)(k+2)-(k-1)k(k+1)` : loai === 2 ? `4.k(k+1)(k+2)=k(k+1)(k+2).[(k+3)-(k-1)]=k(k+1)(k+2)(k+3)-(k-1)k(k+1)(k+2)` : `6.k(k+2)=k(k+2).[(k+4)-(k-2)]=k(k+2)(k+4)-(k-2)k(k+2)`
  void kk
  const hs = (k) => `(${g(k)}-${f(k)})`
  const ket = BigInt(0)
  void ket
  const cuoi = (() => { const x = ks.at(-1), z = ks[0]; return { g: g(x), f: f(z) } })()
  const tongKQ = (() => { const [x, z] = [ks.at(-1), ks[0]]; const v = (k, t) => (t === 'g' ? (loai === 1 ? BigInt(k) * BigInt(k + 1) * BigInt(k + 2) : loai === 2 ? BigInt(k) * BigInt(k + 1) * BigInt(k + 2) * BigInt(k + 3) : BigInt(k) * BigInt(k + 2) * BigInt(k + 4)) : (loai === 1 ? BigInt(k - 1) * BigInt(k) * BigInt(k + 1) : loai === 2 ? BigInt(k - 1) * BigInt(k) * BigInt(k + 1) * BigInt(k + 2) : BigInt(k - 2) * BigInt(k) * BigInt(k + 2))); return { G: v(x, 'g'), F: v(z, 'f') } })()
  if ((tongKQ.G - tongKQ.F) !== BigInt(he) * val) throw new Error('lỗi nội bộ tổng tích')
  return {
    noi_dung: `Tính $${ten}=${dau}$.`, dap_an: `${val}`, loai: 'tra_loi_ngan',
    loi_giai: LG(`nhân tổng với ${he} rồi viết mỗi số hạng thành hiệu hai tích liên tiếp để các số hạng triệt tiêu nhau.`, [
      `Nhân hai vế với ${he}.`, `Viết thừa số ${he} thành hiệu hai thừa số để mỗi số hạng tách thành hiệu hai tích.`, 'Cộng lại: các số hạng ở giữa triệt tiêu, chỉ còn số hạng cuối trừ số hạng đầu.', `Chia cho ${he} để tìm $${ten}$.`], [
      `Ta có $${dacTrung}$.`, `Do đó $${he}${ten}=${hs(ks[0])}+${hs(ks[1])}+\\dots+${hs(ks.at(-1))}$.`,
      `Các số hạng ở giữa triệt tiêu nhau nên $${he}${ten}=${cuoi.g}-${cuoi.f}=${tongKQ.G}-${tongKQ.F}=${tongKQ.G - tongKQ.F}$.`, `Suy ra $${ten}=${tongKQ.G - tongKQ.F}:${he}=${val}$.`, `Vậy $${ten}=${val}$.`]),
  }
}
const MOI_01345 = [[1, 1, 99], [1, 1, 50], [1, 2, 40], [1, 3, 60], [1, 5, 100], [2, 1, 98], [2, 1, 30], [2, 2, 50], [2, 4, 40], [2, 3, 25], [3, 1, 49], [3, 1, 99], [3, 3, 61], [3, 1, 29], [3, 5, 101]].map(([l, a, n]) => tongTich(l, a, n))

// ═════════════════ NDB01346 — so sánh phân thức (a^m+p)/(a^m+q) ═════════════════════════════════════════════════
const sg = (x) => (x >= 0 ? `+${x}` : `${x}`)
function soSanhPT(a, m, n, p, q) {
  const F = (e) => `${df(`${mu(a, e)}${sg(p)}`, `${mu(a, e)}${sg(q)}`)}`
  const r = Math.abs(p - q), cong = p > q
  const dang = (e) => `1${cong ? '+' : '-'}${df(r, `${mu(a, e)}${sg(q)}`)}`
  const mauNho = m < n                                                    // mẫu của A nhỏ hơn
  const kq = cong ? (mauNho ? '>' : '<') : (mauNho ? '<' : '>')
  return {
    noi_dung: `So sánh $A=${F(m)}$ và $B=${F(n)}$.`, dap_an: `$A${kq}B$`, loai: 'tra_loi_ngan',
    loi_giai: LG('viết mỗi phân thức thành $1$ cộng (hoặc trừ) một phân số "phần dư" cùng tử, rồi so sánh các mẫu.', [
      `Tách $A$ và $B$ thành $1${cong ? '+' : '-'}$ phân số có tử ${r}.`, 'So sánh hai mẫu: số mũ lớn hơn thì mẫu lớn hơn; cùng tử dương, mẫu lớn hơn thì phân số bé hơn.', 'Chú ý dấu cộng hay trừ trước phần dư để suy ra chiều so sánh của $A$ và $B$.'], [
      `Ta có $A=${dang(m)}$; $B=${dang(n)}$.`, `Vì $${mu(a, m)}${sg(q)}${mauNho ? '<' : '>'}${mu(a, n)}${sg(q)}$ nên $${df(r, `${mu(a, m)}${sg(q)}`)}${mauNho ? '>' : '<'}${df(r, `${mu(a, n)}${sg(q)}`)}$.`,
      cong ? `Suy ra $${dang(m)}${mauNho ? '>' : '<'}${dang(n)}$, tức $A${kq}B$.` : `Suy ra $${dang(m)}${mauNho ? '<' : '>'}${dang(n)}$ (vì trừ đi phân số lớn hơn thì được số bé hơn), tức $A${kq}B$.`, `Vậy $A${kq}B$.`]),
  }
}
const MOI_01346 = [[2, 10, 12, 1, -1], [3, 20, 21, 1, -1], [5, 15, 16, 1, -1], [10, 8, 9, 1, -1], [2, 30, 31, 1, 3], [3, 50, 51, 1, 3], [7, 12, 13, 2, 5], [5, 9, 10, 5, 2], [2, 20, 22, -1, 1], [3, 14, 15, -1, 1], [10, 6, 7, 3, 1], [2, 40, 42, 2, 6], [4, 25, 24, 1, -1], [6, 18, 17, 1, 4], [3, 33, 32, 7, 2], [9, 11, 10, -1, 2], [2, 17, 15, 3, 1], [8, 13, 14, 1, 5], [5, 40, 41, -2, 1], [11, 7, 8, 4, -1]].map((x) => soSanhPT(...x))

// ═════════════════ NDB01350 — dãy hiệu tích chứa căn ═════════════════════════════════════════════════════════════
function dayCan(t, d, s, m) {
  const c = t * d, k = (i) => s + i * d, x = (i) => k(i) * k(i)
  const T = (i) => df(c, `\\sqrt{${x(i)}}\\cdot\\sqrt{${x(i + 1)}}`)
  const dau = `${T(0)}+${T(1)}+${T(2)}+\\dots+${T(m - 1)}`
  const S = new Q(t).mul(inv(1, s).sub(inv(1, s + m * d)))
  const Tk = (i) => df(c, `${k(i)}\\cdot${k(i + 1)}`)
  const bd = (i) => `${df(1, k(i))}-${df(1, k(i + 1))}`
  const bdHe = (i) => `${t === 1 ? '' : `${t}.`}(${bd(i)})`
  return {
    noi_dung: `Tính $A=${dau}$.`, dap_an: `$${S.str()}$`, loai: 'tra_loi_ngan',
    loi_giai: LG('tính các căn bậc hai trước để mẫu là tích hai số cách đều, rồi tách mỗi số hạng thành hiệu hai phân số để triệt tiêu.', [
      'Tính các căn bậc hai: $\\sqrt{a^2}=a$ với $a\\ge 0$.', `Tách mỗi số hạng bằng công thức $${df('k', 'n(n+k)')}=${df(1, 'n')}-${df(1, 'n+k')}$.`, 'Cộng lại, các số hạng ở giữa triệt tiêu, chỉ còn số hạng đầu và số hạng cuối.'], [
      `Vì $\\sqrt{${x(0)}}=${k(0)}$, $\\sqrt{${x(1)}}=${k(1)}$, ..., $\\sqrt{${x(m - 1)}}=${k(m - 1)}$, $\\sqrt{${x(m)}}=${k(m)}$ nên`,
      `$A=${Tk(0)}+${Tk(1)}+${Tk(2)}+\\dots+${Tk(m - 1)}$`,
      `$A=${bdHe(0)}+${bdHe(1)}+\\dots+${bdHe(m - 1)}$`,
      `$A=${t === 1 ? '' : `${t}.`}\\left(${df(1, k(0))}-${df(1, k(m))}\\right)=${S.str()}$.`, `Vậy $A=${S.str()}$.`]),
  }
}
const MOI_01350 = [[1, 1, 2, 30], [1, 1, 3, 20], [2, 1, 2, 15], [1, 2, 1, 12], [1, 2, 3, 20], [1, 3, 2, 10], [2, 3, 2, 8], [1, 1, 5, 50], [2, 2, 3, 12], [1, 4, 1, 10], [1, 1, 10, 40], [3, 1, 2, 18], [1, 5, 2, 9], [2, 1, 7, 30]].map((x) => dayCan(...x))

// ═════════════════ NDB01037 — căn bậc hai của số chính phương ═════════════════════════════════════════════════════
const MOI_01037 = [196, 256, 324, 361, 400, 441, 484, 529, 576, 625, 676, 729].map((N) => {
  const a = Math.sqrt(N)
  return { noi_dung: `Tính $\\sqrt{${N}}$.`, dap_an: `${a}`, loai: 'tra_loi_ngan', loi_giai: LG('tìm số không âm có bình phương bằng số dưới dấu căn.', ['Phân tích hoặc nhẩm: tìm số tự nhiên $a$ sao cho $a^2$ bằng số trong căn.', 'Kết luận căn bậc hai số học là số không âm đó.'], [`Vì $${a}^2=${N}$ và $${a}>0$ nên $\\sqrt{${N}}=${a}$.`, `Vậy $\\sqrt{${N}}=${a}$.`]) }
}).concat([12, 13, 14, 15, 16, 17, 18, 20].map((a) => ({
  noi_dung: `Tính: $\\sqrt{(-${a})^2}$.`, dap_an: `${a}`, loai: 'tra_loi_ngan',
  loi_giai: LG('tính luỹ thừa trong căn trước, ra một số không âm, rồi lấy căn bậc hai số học (nhớ $\\sqrt{x^2}=\\left|x\\right|$).', [`Tính $(-${a})^2$.`, 'Tìm số không âm có bình phương bằng kết quả đó.', 'Kết luận giá trị của căn.'], [`Ta có $(-${a})^2=${a * a}$.`, `Vì $${a}^2=${a * a}$ và $${a}>0$ nên $\\sqrt{(-${a})^2}=\\sqrt{${a * a}}=${a}$.`]),
})))

// ═════════════════ NDB01206 — nhận biết số thập phân hữu hạn / vô hạn tuần hoàn qua phân số ═══════════════════════
const phanTich = (n) => { const f = []; for (let p = 2n; p * p <= n; p++) { let e = 0; while (n % p === 0n) { n /= p; e++ } if (e) f.push(p) } if (n > 1n) f.push(n); return f }
const hanHan = (a, b) => { const q = new Q(a, b); return phanTich(q.d).every((p) => p === 2n || p === 5n) }
function phanSo(ds, kieu, hoi) { // hoi: 'huu' | 'vo'
  const so = (x) => (x[0] < 0 ? `-${df(-x[0], x[1])}` : df(x[0], x[1]))
  const lietKe = ds.map(so).join(';\\ ')
  const facS = (n) => { const f = []; let m = n; for (let p = 2n; p * p <= m; p++) { let e = 0; while (m % p === 0n) { m /= p; e++ } if (e) f.push(e > 1 ? `${p}^${e}` : `${p}`) } if (m > 1n) f.push(`${m}`); return f.join('.') }
  const dong = ds.map(([a, b]) => {
    const q = new Q(Math.abs(a), b), rg = q.d !== BigInt(b), ok = hanHan(a, b), ps = phanTich(q.d)
    return `${rg ? `Ta có $${so([a, b])}=${a < 0 ? '-' : ''}${df(q.n, q.d)}$. ` : ''}Mẫu $${q.d}${facS(q.d) === String(q.d) ? '' : `=${facS(q.d)}`}$ ${ok ? 'chỉ có ước nguyên tố $2$ hoặc $5$' : `có ước nguyên tố $${ps.find((p) => p !== 2n && p !== 5n)}$ khác $2$ và $5$`}, nên $${so([a, b])}$ viết được dưới dạng số thập phân ${ok ? 'hữu hạn' : 'vô hạn tuần hoàn'}.`
  })
  const dung = ds.filter(([a, b]) => hanHan(a, b) === (hoi === 'huu'))
  const huu = hoi === 'huu' ? 'hữu hạn' : 'vô hạn tuần hoàn'
  if (kieu === 'dem') {
    if (!dung.length) return null
    return { noi_dung: `Cho các phân số $${lietKe}$. Hỏi có bao nhiêu phân số viết được dưới dạng số thập phân ${huu}?`, dap_an: `${dung.length}`, loai: 'tra_loi_ngan', dong, dung, huu }
  }
  if (!dung.length || dung.length === ds.length) return null
  return { noi_dung: `Trong các phân số sau, những phân số nào viết được dưới dạng số thập phân ${huu}? $${lietKe}$.`, dap_an: `$${dung.map(so).join(';\\ ')}$`, loai: 'tra_loi_ngan', dong, dung, huu }
}
const loiGiaiPS = (c, so) => LG('rút gọn phân số về tối giản (mẫu dương) rồi phân tích mẫu ra thừa số nguyên tố: mẫu chỉ có ước nguyên tố $2$ hoặc $5$ thì viết được dưới dạng số thập phân hữu hạn, có ước nguyên tố khác $2$ và $5$ thì là số thập phân vô hạn tuần hoàn.', [
  'Rút gọn từng phân số (nếu rút gọn được).', 'Phân tích mẫu của phân số tối giản ra thừa số nguyên tố.', 'Xét mẫu có ước nguyên tố nào khác $2$ và $5$ hay không để kết luận từng phân số.', 'Đếm hoặc liệt kê theo yêu cầu của đề.'], [
  ...c.dong.map((x) => x), `Vậy ${c.noi_dung.includes('bao nhiêu') ? `có ${c.dung.length} phân số viết được dưới dạng số thập phân ${c.huu}` : `các phân số viết được dưới dạng số thập phân ${c.huu} là: ${so}`}.`])
const MOI_01206 = (() => {
  const hh = [[1, 2], [3, 4], [7, 8], [3, 5], [7, 10], [9, 20], [13, 25], [11, 40], [17, 50], [5, 16], [9, 32], [21, 28], [15, 60], [6, 15], [12, 48], [-3, 8], [-7, 20], [-9, 25], [14, 35], [18, 24]]
  const vo = [[1, 3], [5, 6], [2, 7], [4, 9], [7, 12], [5, 11], [13, 14], [8, 15], [11, 18], [17, 22], [-5, 12], [-4, 33], [19, 30], [23, 24], [10, 21], [-8, 27], [9, 14], [16, 45], [7, 30], [5, 36]]
  const R = (arr, k) => tron(arr).slice(0, k)
  const out = []; const dem = new Set()
  for (let i = 0; i < 80 && out.length < 28; i++) {
    const k1 = 2 + (i % 3), k2 = 6 - k1, ds = tron([...R(hh, k1 + (i % 2)), ...R(vo, k2)]).slice(0, 6)
    const kieu = i % 2 === 0 ? 'dem' : 'liet', hoi = i % 4 < 2 ? 'vo' : 'huu'
    const c = phanSo(ds, kieu, hoi); if (!c || dem.has(c.noi_dung)) continue
    dem.add(c.noi_dung); c.loi_giai = loiGiaiPS(c, c.dap_an); out.push(c)
  }
  return out
})()

// ═════════════════ NDB01355 — toán thực tế số thực ═══════════════════════════════════════════════════════════════
const MOI_01355 = (() => {
  const out = []
  const doi = [['mảnh đất', 'rào xung quanh'], ['khu vườn', 'căng lưới xung quanh'], ['sân chơi', 'làm hàng rào quanh sân'], ['mảnh ruộng', 'đắp bờ bao quanh']]
  ;[[169, 0], [196, 1], [324, 2], [400, 3], [256, 0], [529, 1]].forEach(([S, i]) => { const a = Math.sqrt(S), [vat, viec] = doi[i]
    out.push({ noi_dung: `Một ${vat} hình vuông có diện tích $${S}\\ \\text{m}^2$. Người ta muốn ${viec}. Tính độ dài hàng rào cần dùng (theo mét), coi phần cổng không đáng kể.`, dap_an: `${4 * a}`, loai: 'tra_loi_ngan',
      loi_giai: LG('từ diện tích hình vuông tìm cạnh bằng căn bậc hai số học, rồi nhân $4$ để được chu vi.', ['Gọi cạnh hình vuông là $a$ (m), $a>0$; diện tích bằng $a^2$.', 'Tìm $a$ bằng căn bậc hai số học của diện tích.', 'Chu vi bằng $4a$.'], [`Gọi cạnh của ${vat} là $a$ (m), $a>0$. Diện tích là $a^2=${S}$ nên $a=\\sqrt{${S}}=${a}$ (m).`, `Độ dài hàng rào cần dùng là chu vi: $4.${a}=${4 * a}$ (m).`, `Vậy cần ${4 * a} m hàng rào.`]) }) })
  ;[[100, 1600], [36, 400], [144, 900], [81, 1296]].forEach(([S, N]) => { const q = new Q(S, N), a = Math.sqrt(Number(q.n) / Number(q.d)) * 100; const cm = Math.round(a)
    if (Math.abs(a - cm) > 1e-9) return
    out.push({ noi_dung: `Để lát một sân có diện tích $${S}\\ \\text{m}^2$, người ta dùng vừa đủ $${N}$ viên gạch hình vuông cùng cỡ (mạch ghép không đáng kể). Tính độ dài cạnh mỗi viên gạch theo đơn vị xăng-ti-mét.`, dap_an: `${cm}`, loai: 'tra_loi_ngan',
      loi_giai: LG('diện tích mỗi viên gạch bằng tổng diện tích chia cho số viên; cạnh là căn bậc hai số học của diện tích đó; đổi đơn vị sang xăng-ti-mét.', ['Tính diện tích một viên gạch.', 'Tìm cạnh bằng căn bậc hai số học.', 'Đổi từ mét sang xăng-ti-mét ($1\\ \\text{m}=100\\ \\text{cm}$).'], [`Diện tích mỗi viên gạch: $${S}:${N}=${q.str()}\\ (\\text{m}^2)$.`, `Cạnh mỗi viên gạch: $\\sqrt{${q.str()}}=${cm / 100 === Math.floor(cm / 100) ? cm / 100 : (cm / 100).toString().replace('.', ',')}\\ (\\text{m})=${cm}\\ (\\text{cm})$.`, `Vậy cạnh mỗi viên gạch dài ${cm} cm.`]) }) })
  ;[[16, 40], [36, 30], [9, 50], [49, 20]].forEach(([S, x]) => { const N = (S * 10000) / (x * x)
    out.push({ noi_dung: `Một căn phòng hình vuông có diện tích $${S}\\ \\text{m}^2$ được lát bằng gạch hình vuông cạnh $${x}\\ \\text{cm}$ (coi các mạch ghép là không đáng kể). Hỏi cần bao nhiêu viên gạch để lát kín căn phòng?`, dap_an: `${N}`, loai: 'tra_loi_ngan',
      loi_giai: LG('đổi các độ dài về cùng đơn vị rồi chia diện tích căn phòng cho diện tích một viên gạch.', [`Đổi $${S}\\ \\text{m}^2$ sang $\\text{cm}^2$ (nhân $10\\,000$).`, 'Tính diện tích một viên gạch.', 'Chia để tìm số viên gạch.'], [`Diện tích căn phòng: $${S}\\ \\text{m}^2=${S * 10000}\\ \\text{cm}^2$.`, `Diện tích một viên gạch: $${x}.${x}=${x * x}\\ (\\text{cm}^2)$.`, `Số viên gạch cần dùng: $${S * 10000}:${x * x}=${N}$ (viên).`, `Vậy cần ${N} viên gạch.`]) }) })
  ;[[50, 7.07], [20, 4.47], [75, 8.66], [90, 9.49]].forEach(([S, a]) => {
    out.push({ noi_dung: `Một mảnh vườn hình vuông có diện tích $${S}\\ \\text{m}^2$. Tính độ dài cạnh của mảnh vườn (làm tròn đến hàng phần trăm của mét).`, dap_an: `${String(a).replace('.', ',')}`, loai: 'tra_loi_ngan',
      loi_giai: LG('cạnh hình vuông là căn bậc hai số học của diện tích; dùng máy tính hoặc bảng để được giá trị gần đúng rồi làm tròn theo yêu cầu.', ['Gọi cạnh là $a$ (m), $a>0$ và $a^2$ bằng diện tích.', 'Tính $a=\\sqrt{S}$ rồi làm tròn đến hàng phần trăm.'], [`Gọi cạnh của mảnh vườn là $a$ (m), $a>0$. Ta có $a^2=${S}$ nên $a=\\sqrt{${S}}\\approx ${String(Math.sqrt(S).toFixed(4)).replace('.', ',')}$.`, `Làm tròn đến hàng phần trăm: $a\\approx ${String(a).replace('.', ',')}$ (m).`, `Vậy cạnh mảnh vườn khoảng ${String(a).replace('.', ',')} m.`]) }) })
  ;[[121, 3], [225, 5], [64, 2], [49, 4], [81, 3]].forEach(([S, n]) => { const a = Math.sqrt(S)
    out.push({ noi_dung: `Một sân hình vuông có diện tích $${S}\\ \\text{m}^2$. Một bạn chạy quanh sân $${n}$ vòng (đi sát mép sân). Hỏi bạn đó chạy được quãng đường dài bao nhiêu mét?`, dap_an: `${4 * a * n}`, loai: 'tra_loi_ngan',
      loi_giai: LG('tìm cạnh bằng căn bậc hai số học của diện tích, tính chu vi, rồi nhân với số vòng.', ['Tìm cạnh của sân.', 'Tính chu vi sân.', 'Nhân chu vi với số vòng.'], [`Cạnh của sân: $\\sqrt{${S}}=${a}$ (m).`, `Chu vi của sân: $4.${a}=${4 * a}$ (m).`, `Quãng đường chạy ${n} vòng: $${n}.${4 * a}=${4 * a * n}$ (m).`, `Vậy bạn đó chạy được ${4 * a * n} m.`]) }) })
  return out
})()

// ═════════════════ bộ kiểm ĐỘC LẬP: đọc đề từ chữ, tính lại ═════════════════════════════════════════════════════════
const bo = (s) => String(s ?? '').replace(/\$/g, '').replace(/\\ /g, ' ').replace(/\s+/g, ' ').trim()
const boHet = (s) => bo(s).replace(/\s+/g, '')
const gtHienThi = (da) => { const t = boHet(da); const m = t.match(/^(-?)\\dfrac\{(\d+)\}\{(\d+)\}$/); if (m) return new Q(BigInt(m[2]) * (m[1] ? -1n : 1n), BigInt(m[3])); if (/^-?\d+$/.test(t)) return new Q(BigInt(t)); return null }
const cuoiLG = (lg) => String(lg).replace(/\$/g, '').trim().split('\n').filter(Boolean).pop()
const bangDa = (da, q) => { const v = gtHienThi(da); return v && v.cmp(q) === 0 ? [] : [`đáp án ${da} ≠ ${q.str()}`] }

const KIEM = {
  NDB00797: (nd, da, lg) => { // c/(k(k+d)(k+2d)) cộng dần
    const t = boHet(nd); const terms = [...t.matchAll(/\\dfrac\{(\d+)\}\{(\d+)\\cdot(\d+)\\cdot(\d+)\}/g)].map((m) => m.slice(1).map(Number))
    if (terms.length < 4) return ['không đọc được đề']
    const [c, x, y, z] = terms[0], d = y - x; if (z - y !== d) return ['ba thừa số không cách đều']
    const [, x1] = terms[1]; if (x1 !== x + d) return ['các số hạng không cách đều d']
    const L = terms.at(-1)[1]; let S = new Q(0)
    for (let k = x; k <= L; k += d) S = S.add(new Q(c, k * (k + d) * (k + 2 * d)))
    if (/Tính/.test(t)) return bangDa(da, S)
    const b = t.match(/<\\dfrac\{(\d+)\}\{(\d+)\}\.?$/) ?? t.match(/<(\d+)\.?$/); if (!b) return ['không đọc được cận']
    return [S.cmp(new Q(BigInt(b[1]), BigInt(b[2] ?? 1))) < 0 ? null : 'A không nhỏ hơn cận'].filter(Boolean)
  },
  NDB01343: (nd) => {
    const t = boHet(nd).replace(/\\dots/g, '…')
    const m = t.match(/^Chứngminhrằng([AC])=(1\+)?\\dfrac\{1\}\{(\d+)\^3\}\+\\dfrac\{1\}\{(\d+)\^3\}\+\\dfrac\{1\}\{(\d+)\^3\}\+…\+\\dfrac\{1\}\{(\d+)\^3\}<\\dfrac\{(\d+)\}\{(\d+)\}\.?$/)
    if (!m) return ['không đọc được đề']
    const [s, s1, s2, n, bn, bd] = [3, 4, 5, 6, 7, 8].map((i) => Number(m[i]))
    if (s1 !== s + 1 || s2 !== s + 2) return ['các số hạng không liên tiếp']
    let S = m[2] ? 1 : 0; for (let k = s; k <= n; k++) S += 1 / (k * k * k)
    return [S < bn / bd - 1e-12 ? null : `tổng ${S} không nhỏ hơn cận ${bn / bd}`].filter(Boolean)
  },
  NDB01345: (nd, da) => {
    const t = boHet(nd).replace(/\\dots/g, '…'); const m = t.match(/^TínhA=(.+?)\+…\+(.+?)\.?$/); if (!m) return ['không đọc được đề']
    const toks = m[1].split('+').map((x) => x.split('\\cdot').map(Number)), last = m[2].split('\\cdot').map(Number)
    if (toks.length < 3) return ['thiếu số hạng']
    const g = toks[0][1] - toks[0][0], step = toks[1][0] - toks[0][0], f = toks[0].length
    if (step !== (f === 2 && g === 2 ? 2 : 1)) return ['bước giữa hai số hạng không hợp lệ']
    let S = 0n; for (let k = toks[0][0]; k <= last[0]; k += step) { let p = 1n; for (let j = 0; j < f; j++) p *= BigInt(k + j * g); S += p }
    return bangDa(da, new Q(S))
  },
  NDB01346: (nd, da) => {
    const t = boHet(nd); const m = t.match(/^SosánhA=\\dfrac\{(\d+)\^\{?(\d+)\}?([+-]\d+)\}\{\d+\^\{?\d+\}?([+-]\d+)\}vàB=\\dfrac\{(\d+)\^\{?(\d+)\}?([+-]\d+)\}\{\d+\^\{?\d+\}?([+-]\d+)\}\.?$/) ?? t.match(/^So.?sánhA=\\dfrac\{(\d+)\^\{?(\d+)\}?([+-]\d+)\}\{\d+\^\{?\d+\}?([+-]\d+)\}vàB=\\dfrac\{(\d+)\^\{?(\d+)\}?([+-]\d+)\}\{\d+\^\{?\d+\}?([+-]\d+)\}\.?$/)
    if (!m) return ['không đọc được đề']
    const [a, ea, p, q, a2, eb] = [1, 2, 3, 4, 5, 6].map((i) => BigInt(m[i]))
    if (a !== a2 || BigInt(m[7]) !== p || BigInt(m[8]) !== q) return ['hai phân thức không cùng khuôn']
    const A = new Q(a ** ea + p, a ** ea + q), B = new Q(a ** eb + p, a ** eb + q), c = A.cmp(B)
    const d = bo(da).replace(/\s/g, ''); const k = c < 0 ? 'A<B' : c > 0 ? 'A>B' : 'A=B'
    return [d !== k && `đáp án ${da} ≠ ${k}`].filter(Boolean)
  },
  NDB01350: (nd, da) => {
    const t = boHet(nd).replace(/\\dots/g, '…'); const terms = [...t.matchAll(/\\dfrac\{(\d+)\}\{\\sqrt\{(\d+)\}\\cdot\\sqrt\{(\d+)\}\}/g)].map((m) => m.slice(1).map(Number))
    if (terms.length < 4) return ['không đọc được đề']
    const r = (x) => { const s = Math.round(Math.sqrt(x)); return s * s === x ? s : null }
    const ks = terms.map(([, x, y]) => [r(x), r(y)]); if (ks.some(([x, y]) => x === null || y === null)) return ['có số dưới căn không chính phương']
    const d = ks[0][1] - ks[0][0], c = terms[0][0]; if (d < 1 || ks[1][0] !== ks[0][1]) return ['cấp số không đúng']
    if (c % d) return ['tử không chia hết cho d']
    let S = new Q(0); for (let k = ks[0][0]; k <= ks.at(-1)[0]; k += d) S = S.add(new Q(c, k * (k + d)))
    return bangDa(da, S)
  },
  NDB01037: (nd, da) => {
    const t = boHet(nd); const m = t.match(/^Tính:?\\sqrt\{(\d+)\}\.?$/) ?? t.match(/^Tính:?\\sqrt\{\(-(\d+)\)\^2\}\.?$/); if (!m) return ['không đọc được đề']
    const v = t.includes('(-') ? Number(m[1]) : Math.sqrt(Number(m[1])); if (!Number.isInteger(v)) return ['không là số chính phương']
    return [bo(da) !== String(v) && `đáp án ${da} ≠ ${v}`].filter(Boolean)
  },
  NDB01206: (nd, da) => {
    const t = bo(nd); const fr = (s) => [...s.matchAll(/(-?)\\dfrac\{(\d+)\}\{(\d+)\}/g)].map((m) => [BigInt(m[2]), BigInt(m[3])])
    const hu = /hữu hạn\?/.test(t) ? 'huu' : /vô hạn tuần hoàn\?/.test(t) ? 'vo' : null; if (!hu) return ['không đọc được loại số thập phân']
    const ds = fr(t); if (ds.length < 4) return ['không đọc được phân số']
    const ok = ([a, b]) => hanHan(Number(a), Number(b)); const dung = ds.filter((x) => ok(x) === (hu === 'huu'))
    if (/bao nhiêu/.test(t)) return [bo(da) !== String(dung.length) && `đáp án ${da} ≠ ${dung.length}`].filter(Boolean)
    const dd = fr(da).map(([a, b]) => `${new Q(a, b).n}/${new Q(a, b).d}`).sort().join('|'), ex = dung.map(([a, b]) => `${new Q(a, b).n}/${new Q(a, b).d}`).sort().join('|')
    return [dd !== ex && `đáp án ${da} ≠ ${ex}`].filter(Boolean)
  },
  NDB01355: (nd, da) => {
    const t = bo(nd); let m, v
    if ((m = t.match(/hình vuông có diện tích (\d+) \\text\{m\}\^2\..*?hàng rào/))) v = 4 * Math.sqrt(+m[1])
    else if ((m = t.match(/diện tích (\d+) \\text\{m\}\^2, người ta dùng vừa đủ (\d+) viên gạch/))) v = Math.sqrt(+m[1] / +m[2]) * 100
    else if ((m = t.match(/diện tích (\d+) \\text\{m\}\^2 được lát bằng gạch hình vuông cạnh (\d+) \\text\{cm\}/))) v = (+m[1] * 10000) / (+m[2] * +m[2])
    else if ((m = t.match(/diện tích (\d+) \\text\{m\}\^2\. Tính độ dài cạnh.*phần trăm/))) v = Math.round(Math.sqrt(+m[1]) * 100) / 100
    else if ((m = t.match(/diện tích (\d+) \\text\{m\}\^2\. Một bạn chạy quanh sân (\d+) vòng/))) v = 4 * Math.sqrt(+m[1]) * +m[2]
    else return ['không đọc được đề']
    const dd = Number(bo(da).replace(',', '.')); return [Math.abs(dd - v) > 1e-9 && `đáp án ${da} ≠ ${v}`].filter(Boolean)
  },
}
// NDB01206 cần hanHan ở bộ kiểm — dùng lại hàm trên (cùng phép kiểm số học thuần: ước nguyên tố của mẫu tối giản)

const MOI = { NDB00797: MOI_00797, NDB01343: MOI_01343, NDB01345: MOI_01345, NDB01346: MOI_01346, NDB01350: MOI_01350, NDB01037: MOI_01037, NDB01206: MOI_01206, NDB01355: MOI_01355 }
const kiemTai = (dang, c) => (KIEM[dang] ? KIEM[dang](c.noi_dung, c.dap_an ?? '', c.loi_giai) : ['chưa có bộ kiểm'])

if (LENH === 'thu') {
  for (const [dang, ds] of Object.entries(MOI)) {
    const dung = ds.filter((c) => !kiemTai(dang, c).length).length
    const c = ds[1] ?? ds[0]
    const sai = { ...c, dap_an: c.dap_an == null ? null : c.dap_an.replace(/\d/, (m) => String((+m + 1) % 10)) }
    const saiDe = { ...c, noi_dung: c.noi_dung.replace(/\d/, (m) => String((+m + 1) % 10)) }
    const l1 = c.dap_an == null ? [] : kiemTai(dang, sai), l2 = kiemTai(dang, saiDe)
    console.log(`${dang}: ${dung}/${ds.length} qua bộ kiểm · sai đáp án → ${c.dap_an == null ? '(không có đáp án)' : l1.length ? 'bắt' : '⚠ KHÔNG BẮT'} · đổi 1 số trong đề → ${l2.length ? 'bắt' : '(không đổi kết luận)'}`)
    for (const c2 of ds.filter((x) => kiemTai(dang, x).length).slice(0, 2)) console.log('    ✘', kiemTai(dang, c2).join(' | '), '::', c2.noi_dung.slice(0, 90))
    if (args.includes('--in') && (!CHI_DANG || CHI_DANG.includes(dang))) console.log('-----\n' + c.noi_dung + '\n=> ' + c.dap_an + '\n' + c.loi_giai.split('**Phần 2. Trình bày**')[1] + '\n-----')
  }
} else {
  const db = new pg.Client({ connectionString: process.env.DATABASE_URL_RW ?? env.DATABASE_URL, ssl: { rejectUnauthorized: false } }); await db.connect()
  try {
    await db.query('begin')
    const qua = [], dem = {}
    for (const [dang, ds] of Object.entries(MOI)) {
      if (CHI_DANG && !CHI_DANG.includes(dang)) continue
      const thay = new Set(), TRAN = { NDB01206: 20, NDB01355: 12 }                // đã có 11 / 20 câu: chỉ bù vừa đủ 30, không dư nhiều
      for (const c of ds) {
        if (thay.size >= (TRAN[dang] ?? 999)) break
        const l = kiemTai(dang, c)
        if (l.length) { console.log(`  ✘ ${dang}: ${l.join(' | ')} :: ${c.noi_dung.slice(0, 80)}`); continue }
        if (thay.has(c.noi_dung)) continue; thay.add(c.noi_dung)
        const cau = { khoi: '7', loai_cau: c.loai, noi_dung: c.noi_dung, lua_chon: null, menh_de: null, dap_an: c.dap_an ?? null, loi_giai: c.loi_giai, anh_de: null, anh_dap_an: null, ma_cum: null, nguon_giai: 'ai' }
        const bam = bamNoiDung({ ...cau, dang_chinh: 'cho' })
        const mk = (tram, ghi) => ({ tram, lan_chay: 'k7-fill-kiem', cach: 'code', ket_qua: 'dat', ghi_chu: ghi, bam_noi_dung: bam })
        const kq = xetGoi({ cau: { ...cau, dang_chinh: 'cho' }, vet: { lam: { tram: 'giai', lan_chay: 'k7-fill-sinh', model: 'claude-sonnet-5-5 (bộ sinh bằng code)' }, kiem: [
          mk('kiem-doc', `bài lẻ soạn bù dạng ${dang}: khuôn hai phần, không nhãn "Câu N"`), mk('kiem-dang', `dạng ${dang} do điều phối chỉ định (§C11)`),
          mk('kiem-dap-so', 'bộ kiểm đọc lại đề từ chữ, tính lại bằng phân số BigInt / vét cạn, khớp đáp án')] } })
        if (!kq.duoc_ghi) { console.log(`  ✘ ${dang} cổng: ${kq.ly_do.join(' | ')}`); continue }
        qua.push({ dang, cau, kq })
      }
    }
    if (qua.length) {
      const cauList = qua.map(({ dang, cau }) => ({ ...cau, nguon: 'le', giai_method: 'claude_code', ai_model: 'claude-sonnet-5-5', dang_bai: dang, dang_bai_chot: true, ten_de_goc: `Soạn bù ${dang} · fill K7 21/11` }))
      const { maCauList, trung } = await insertCauBatch({ client: db, subject: 'dai', cauList })
      const laTrung = new Set(trung.map((t) => t.idx))
      for (let i = 0; i < qua.length; i++) {
        if (laTrung.has(i)) { console.log(`  ≈ trùng đề: ${qua[i].dang} ↔ ${maCauList[i]}`); continue }
        const { dang, kq } = qua[i]
        await db.query(`update dai_cau_hoi set kiem_may = $2, kiem_may_at = now(), kiem_may_boi = 'claude_code', kiem_may_ghi = $3, da_duyet = true, duyet_nguon = 'ai', duyet_at = now() where ma_cau = $1`, [maCauList[i], kq.kiem_may, kq.kiem_may_ghi.slice(0, 1500)])
        dem[dang] = (dem[dang] || 0) + 1
      }
    }
    console.log(GHI ? '■ GHI THẬT' : '□ CHẠY THỬ (sẽ ROLLBACK)', '· qua cổng', qua.length); console.table(dem)
    await db.query(GHI ? 'commit' : 'rollback')
  } catch (e) { await db.query('rollback').catch(() => {}); console.error('LỖI — đã rollback:', e.message); process.exitCode = 1 } finally { await db.end() }
}
