// ============================================================================
// k5T-pt-fill-A.mjs — SINH câu 5T chuyên đề "Tỉ số phần trăm" nhóm "Phép toán với tỉ số phần trăm" để fill đủ 30 câu/dạng:
//   NDB02767 Cộng trừ nhân chia tỉ số phần trăm            (+15)   NDB03000 Đổi số thập phân / phân số ↔ %          (+27)
//   NDB02768 Tính thuận tiện liên quan đến tỉ số phần trăm (+32)   NDB03001 Tính tỉ số % của hai đại lượng          (+24)
//   NDB02769 Tìm phần trăm của một số                       (+9)    NDB03553 Hiệu / tổng hai bộ phận ứng với x% (thêm bớt) (+32)
//   NDB02770 Tìm một số khi biết phần trăm của nó           (+14)
// (mỗi dạng sinh dư 2 câu so với số cần thêm). Đề dùng số "đẹp"; lời giải 2 phần theo khuôn k5T-pt-sinh.mjs.
//   node scripts/kho/clone/k5T-pt-fill-A.mjs --ra kho-rules/dai/clone/k5T-pt-fill-A.json
// Hạt giống cố định ⇒ chạy lại ra đúng lô. Bộ KIỂM độc lập (không import hàm tính từ file này): k5T-pt-fill-A-kiem.mjs.
// ============================================================================
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'node:fs'
import { dirname } from 'node:path'
import { createRequire } from 'node:module'

export const DANG = { CT: 'NDB02767', TT: 'NDB02768', PC: 'NDB02769', TS: 'NDB02770', DOI: 'NDB03000', TI: 'NDB03001', HT: 'NDB03553' }
export const SO_CAU = { NDB02767: 15, NDB02768: 32, NDB02769: 9, NDB02770: 14, NDB03000: 27, NDB03001: 24, NDB03553: 32 }

// ── tiện ích ─────────────────────────────────────────────────────────────────────────────────────────────────────
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
let rnd = mulberry32(20261128)
const pick = (a) => a[Math.floor(rnd() * a.length)]
const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1))
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
const fmt = (x) => String(Math.round(x * 1e8) / 1e8).replace('.', ',')          // 162.5 → "162,5"
const dp = (x, k = 4) => Math.abs(x * 10 ** k - Math.round(x * 10 ** k)) < 1e-6   // x có ≤ k chữ số thập phân
const isInt = (x) => Math.abs(x - Math.round(x)) < 1e-9
const nhom3 = (n) => (isInt(n) && n >= 10000 ? String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') : fmt(n))   // trong ĐỀ
const P = (x) => `${fmt(x)}\\%`            // trong công thức: 162,5\%
const D = (a) => fmt(a / 100)               // a% → số thập phân
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '')
const bt1 = (nd) => { const m = nd.match(/\$([^$]+)\$/); return m ? 'bt:' + chuan(m[1]) : null }

let dung = new Set()
function them(ds, c) {
  const k = chuan(c.noi_dung); if (dung.has(k)) return false
  if ([DANG.CT, DANG.TT, DANG.DOI].includes(c.dang)) { const b = bt1(c.noi_dung); if (b && dung.has(b)) return false; if (b) dung.add(b) }
  dung.add(k); ds.push(c); return true
}
function lap(ds, n, fn, maxTry = 6000) {
  let dem = 0
  for (let t = 0; t < maxTry && dem < n; t++) { const c = fn(); if (c && them(ds, c)) dem++ }
  if (dem < n) throw new Error(`thiếu câu: cần ${n}, chỉ sinh ${dem} (${ds.at(-1)?.mau ?? '?'})`)
}
/** khuôn lời giải 2 phần; tinh=true (bài tính / đổi): Phần 2 chỉ các dòng biến đổi (không Bài giải / Đáp số) — luật 4T "Tính / tính thuận tiện" */
function loiGiai({ matChot, buoc, chuY, dong, dapSo, tinh = false }) {
  const p = ['**Phần 1. Hướng dẫn**', `**Mấu chốt:** ${matChot}`, ...buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`), `**Chú ý:** ${chuY}`, '**Phần 2. Trình bày**']
  if (!tinh) p.push('Bài giải')
  p.push(...dong)
  if (!tinh) p.push(`Đáp số: ${dapSo}`)
  return p.join('\n\n')
}
const mk = (dang, mau, noi_dung, dap_an, lg) => ({ dang, mau, loai_cau: 'tra_loi_ngan', noi_dung, dap_an, loi_giai: lg })

// ============================================================================
// NDB02767 — Cộng trừ nhân chia tỉ số phần trăm (15)
// ============================================================================
function sinh02767() {
  const ds = []
  const tv = () => (rnd() < 0.6 ? ri(3, 150) : ri(3, 120) + pick([0.5, 0.5, 0.2, 0.4, 0.6, 0.8, 0.25, 0.75]))
  // (a) cộng trừ — kết quả dạng phần trăm (3) / số thập phân (2)
  const congTru = (dangTD) => () => {
    const n = pick([2, 3, 3]); const v = [tv()], dau = []
    for (let i = 1; i < n; i++) { v.push(tv()); dau.push(rnd() < 0.5 ? '+' : '-') }
    let s = v[0]; for (let i = 1; i < n; i++) s = dau[i - 1] === '+' ? s + v[i] : s - v[i]
    s = Math.round(s * 100) / 100; if (s <= 1 || s > 300 || !dp(s, 2)) return null
    for (let i = 1; i < n; i++) { let t = v[0]; for (let j = 1; j <= i; j++) t = dau[j - 1] === '+' ? t + v[j] : t - v[j]; if (t <= 0) return null }
    const bt = v.map((x, i) => (i ? dau[i - 1] : '') + P(x)).join('')
    const trong = v.map((x, i) => (i ? dau[i - 1] : '') + fmt(x)).join('')
    const yc = dangTD ? 'viết kết quả dưới dạng số thập phân' : 'viết kết quả dưới dạng phần trăm'
    const nd = `${pick(['Tính', 'Thực hiện phép tính', 'Tính giá trị biểu thức'])} (${yc}):\n$${bt}$`
    const r = s / 100
    if (dangTD && !dp(r, 4)) return null
    const dong = [`$${bt}$`, dangTD ? `$=(${trong})\\%=${P(s)}=${fmt(r)}$` : `$=(${trong})\\%=${P(s)}$`]
    const lg = loiGiai({
      tinh: true,
      matChot: `Các tỉ số phần trăm đều lấy $1\\%$ làm đơn vị, nên cộng hoặc trừ chúng chỉ cần cộng, trừ phần số rồi viết dấu $\\%$ vào kết quả.`,
      buoc: [
        `Nhận ra biểu thức chỉ gồm các tỉ số phần trăm nối với nhau bằng dấu cộng hoặc dấu trừ.`,
        `Cộng, trừ các phần số theo thứ tự từ trái sang phải và giữ đúng dấu phẩy thập phân.`,
        dangTD ? `Viết kết quả thành tỉ số phần trăm rồi đổi sang số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.` : `Viết dấu $\\%$ vào kết quả vì đề yêu cầu viết dưới dạng phần trăm.`,
      ],
      chuY: dangTD ? `kết quả viết dưới dạng số thập phân thì không còn dấu $\\%$.` : `chỉ viết dấu $\\%$ một lần ở kết quả, không nhân hay chia thêm $100$.`,
      dong, dapSo: '',
    })
    return mk(DANG.CT, dangTD ? 'ct_td' : 'ct_pt', nd, dangTD ? `$${fmt(r)}$` : `$${P(s)}$`, lg)
  }
  lap(ds, 3, congTru(false)); lap(ds, 2, congTru(true))
  // (b) nhân hai tỉ số phần trăm — số thập phân (2) / phần trăm (1)
  const nhan2 = (dangTD) => () => {
    const a = pick([25, 40, 50, 60, 75, 80, 120, 125, 150, 170, 200, 30, 20, 15, 45, 35]), b = pick([10, 20, 25, 30, 40, 50, 60, 75, 80, 120, 150, 5, 15])
    const r = (a / 100) * (b / 100); if (!dp(r, 5) || r <= 0) return null
    const yc = dangTD ? 'viết kết quả dưới dạng số thập phân' : 'viết kết quả dưới dạng phần trăm'
    const nd = `${pick(['Tính', 'Thực hiện phép tính'])} (${yc}):\n$${P(a)}\\times ${P(b)}$`
    const dong = [`$${P(a)}\\times ${P(b)}$`, dangTD ? `$=${D(a)}\\times ${D(b)}=${fmt(r)}$` : `$=${D(a)}\\times ${D(b)}=${fmt(r)}=${P(r * 100)}$`]
    const lg = loiGiai({
      tinh: true,
      matChot: `Nhân hai tỉ số phần trăm thì đổi từng tỉ số ra số thập phân rồi nhân hai số thập phân, không nhân phần số rồi giữ nguyên dấu $\\%$.`,
      buoc: [
        `Đổi từng tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`,
        `Nhân hai số thập phân vừa đổi, chú ý đếm đủ số chữ số ở phần thập phân của kết quả.`,
        dangTD ? `Viết kết quả dưới dạng số thập phân đúng như đề yêu cầu.` : `Đổi kết quả sang phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số rồi viết dấu $\\%$.`,
      ],
      chuY: `tích của hai tỉ số phần trăm không phải là tích hai phần số: $50\\%\\times 50\\%=0,5\\times 0,5=0,25$ chứ không phải $2500\\%$.`,
      dong, dapSo: '',
    })
    return mk(DANG.CT, dangTD ? 'nhan_td' : 'nhan_pt', nd, dangTD ? `$${fmt(r)}$` : `$${P(r * 100)}$`, lg)
  }
  lap(ds, 2, nhan2(true)); lap(ds, 1, nhan2(false))
  // (c) chia hai tỉ số phần trăm — số thập phân (3)
  lap(ds, 3, () => {
    const b = pick([10, 20, 25, 40, 50, 5, 8, 15, 30, 60, 75, 120, 150, 200]), q = pick([0.5, 0.8, 1.2, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6, 7.5, 8, 9, 12, 0.25, 1.6, 2.4, 0.4]); const a = Math.round(b * q * 100) / 100
    const r = Math.round((a / b) * 1e6) / 1e6; if (!dp(a, 1) || a > 600 || a < 3) return null
    const nd = `${pick(['Tính', 'Thực hiện phép tính'])} (viết kết quả dưới dạng số thập phân):\n$${P(a)}:${P(b)}$`
    const dong = [`$${P(a)}:${P(b)}$`, `$=${D(a)}:${D(b)}=${fmt(r)}$`]
    const lg = loiGiai({
      tinh: true,
      matChot: `Chia hai tỉ số phần trăm cho nhau thì đổi cả hai ra số thập phân rồi chia; kết quả là một số bình thường, không còn dấu $\\%$.`,
      buoc: [
        `Đổi từng tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`,
        `Chia số thập phân thứ nhất cho số thập phân thứ hai theo đúng thứ tự đề bài.`,
        `Viết kết quả dưới dạng số thập phân, không viết dấu $\\%$.`,
      ],
      chuY: `thương của hai tỉ số phần trăm là một số không có dấu $\\%$.`,
      dong, dapSo: '',
    })
    return mk(DANG.CT, 'chia_2', nd, `$${fmt(r)}$`, lg)
  })
  // (d) ba tỉ số: nhân rồi chia (2)
  lap(ds, 2, () => {
    const a = pick([150, 120, 200, 125, 60, 80, 75, 40, 30]), b = pick([40, 50, 20, 60, 25, 80, 30]), c = pick([25, 20, 50, 40, 10, 5, 30])
    const r = ((a / 100) * (b / 100)) / (c / 100); if (!dp(r, 4) || r <= 0) return null
    const nd = `Tính (viết kết quả dưới dạng số thập phân):\n$${P(a)}\\times ${P(b)}:${P(c)}$`
    const t1 = (a / 100) * (b / 100)
    const dong = [`$${P(a)}\\times ${P(b)}:${P(c)}$`, `$=${D(a)}\\times ${D(b)}:${D(c)}=${fmt(t1)}:${D(c)}=${fmt(r)}$`]
    const lg = loiGiai({
      tinh: true,
      matChot: `Biểu thức có nhân và chia các tỉ số phần trăm: đổi tất cả ra số thập phân rồi tính từ trái sang phải.`,
      buoc: [
        `Đổi cả ba tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`,
        `Thực hiện phép nhân đứng trước, vì phép nhân và phép chia được tính từ trái sang phải.`,
        `Chia kết quả vừa tìm cho số thập phân cuối cùng rồi viết đáp số.`,
      ],
      chuY: `không giữ dấu $\\%$ khi đã đổi ra số thập phân; kết quả cuối là một số bình thường.`,
      dong, dapSo: '',
    })
    return mk(DANG.CT, 'ba_so', nd, `$${fmt(r)}$`, lg)
  })
  // (e) tỉ số phần trăm nhân / chia với số tự nhiên (2): a%×n · a%:n · n:b%
  lap(ds, 2, () => {
    const kieu = pick(['nhan', 'chia', 'so_chia'])
    if (kieu === 'nhan') {
      const a = pick([15.3, 12.5, 7.5, 24, 35, 6.2, 18, 45, 2.6, 8.4, 33, 0.9]), n = pick([4, 5, 3, 6, 8, 10, 20]); const r = (a / 100) * n; if (!dp(r, 5)) return null
      const nd = `Tính (viết kết quả dưới dạng số thập phân):\n$${P(a)}\\times ${n}$`
      const lg = loiGiai({
        tinh: true,
        matChot: `Nhân một tỉ số phần trăm với một số tự nhiên: đổi tỉ số phần trăm ra số thập phân rồi nhân với số đó.`,
        buoc: [`Đổi tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`, `Nhân số thập phân vừa đổi với số tự nhiên đã cho.`, `Viết kết quả dưới dạng số thập phân.`],
        chuY: `kết quả không còn dấu $\\%$ vì đề yêu cầu số thập phân.`,
        dong: [`$${P(a)}\\times ${n}$`, `$=${D(a)}\\times ${n}=${fmt(r)}$`], dapSo: '',
      })
      return mk(DANG.CT, 'so_nhan', nd, `$${fmt(r)}$`, lg)
    }
    if (kieu === 'chia') {
      const n = pick([3, 4, 5, 6, 8, 12, 15, 25]), q = pick([1.2, 0.32, 2.5, 1.6, 0.6, 0.75, 0.24, 1.5]); const a = Math.round(q * n * 100 * 1e4) / 1e4; const r = Math.round((a / 100 / n) * 1e8) / 1e8
      if (!dp(a, 1) || !dp(r, 4) || a < 5 || a > 400) return null
      const nd = `Tính (viết kết quả dưới dạng số thập phân):\n$${P(a)}:${n}$`
      const lg = loiGiai({
        tinh: true,
        matChot: `Chia một tỉ số phần trăm cho một số tự nhiên: đổi tỉ số phần trăm ra số thập phân rồi chia cho số đó.`,
        buoc: [`Đổi tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`, `Chia số thập phân vừa đổi cho số tự nhiên đã cho.`, `Viết kết quả dưới dạng số thập phân.`],
        chuY: `chia tỉ số phần trăm cho một số tự nhiên thì kết quả vẫn là số thập phân nhỏ.`,
        dong: [`$${P(a)}:${n}$`, `$=${D(a)}:${n}=${fmt(r)}$`], dapSo: '',
      })
      return mk(DANG.CT, 'so_chia', nd, `$${fmt(r)}$`, lg)
    }
    const b = pick([50, 25, 20, 40, 10, 5, 80, 125, 60]), n = ri(2, 60); const r = n / (b / 100); if (!dp(r, 3)) return null
    const nd = `Tính (viết kết quả dưới dạng số thập phân):\n$${n}:${P(b)}$`
    const lg = loiGiai({
      tinh: true,
      matChot: `Chia một số tự nhiên cho một tỉ số phần trăm: đổi tỉ số phần trăm ra số thập phân rồi chia; kết quả lớn hơn số bị chia khi tỉ số bé hơn $100\\%$.`,
      buoc: [`Đổi tỉ số phần trăm ra số thập phân bằng cách dịch dấu phẩy sang trái hai chữ số.`, `Chia số tự nhiên cho số thập phân vừa đổi theo đúng thứ tự đề bài.`, `Viết kết quả dưới dạng số thập phân.`],
      chuY: `số bị chia là số tự nhiên đứng trước dấu hai chấm, không đảo thứ tự hai số.`,
      dong: [`$${n}:${P(b)}$`, `$=${n}:${D(b)}=${fmt(r)}$`], dapSo: '',
    })
    return mk(DANG.CT, 'so_chia_pt', nd, `$${fmt(r)}$`, lg)
  })
  return ds
}

// ============================================================================
// NDB02768 — Tính thuận tiện liên quan đến tỉ số phần trăm (32)
// ============================================================================
const MLIST = [48, 36, 25, 64, 7.2, 12.5, 90, 4.8, 250, 125, 3.7, 1.6, 8.4, 72, 56, 15, 144, 6.4, 24, 5.4, 80, 4.5, 120, 32, 16, 2.5, 40, 0.8, 9.6, 45.6, 18, 360, 75]
function sinh02768() {
  const ds = []; const yc = () => pick(['Tính bằng cách thuận tiện:', 'Tính một cách thuận tiện:', 'Tính nhanh:'])
  const toBt = (c) => c.length
  // T1: a%×M + b%×M (6)
  lap(ds, 6, () => {
    const s = pick([100, 100, 100, 50, 25, 75, 40, 60, 80, 20, 30, 10, 90]); const a = 5 * ri(1, Math.floor(s / 5) - 1), b = s - a; const M = pick(MLIST); const r = (M * s) / 100
    if (!dp(r, 4) || a === b || b % 5) return null
    const kieu = rnd() < 0.5
    const bt = kieu ? `${P(a)}\\times ${fmt(M)}+${P(b)}\\times ${fmt(M)}` : `${fmt(M)}\\times ${P(a)}+${fmt(M)}\\times ${P(b)}`
    const chung = kieu ? `(${P(a)}+${P(b)})\\times ${fmt(M)}` : `${fmt(M)}\\times(${P(a)}+${P(b)})`
    const sM = kieu ? `${P(s)}\\times ${fmt(M)}` : `${fmt(M)}\\times ${P(s)}`
    const cuoi = s === 100 ? `=${sM}=1\\times ${fmt(M)}=${fmt(r)}` : `=${sM}=${fmt(r)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Hai tích $${P(a)}\\times ${fmt(M)}$ và $${P(b)}\\times ${fmt(M)}$ có chung thừa số $${fmt(M)}$, nên đặt $${fmt(M)}$ làm thừa số chung: cộng hai tỉ số phần trăm rồi mới nhân với $${fmt(M)}$.`,
      buoc: [
        `Nhìn ra thừa số $${fmt(M)}$ xuất hiện ở cả hai tích, đó là thừa số chung cần đặt ra ngoài.`,
        `Viết tổng hai tỉ số phần trăm trong ngoặc, vì tổng hai tích có chung một thừa số bằng tổng hai số còn lại nhân với thừa số đó.`,
        s === 100 ? `Tính tổng hai tỉ số phần trăm được $100\\%$, mà $100\\%=1$ nên kết quả bằng chính số chung.` : `Cộng hai tỉ số phần trăm rồi đổi kết quả ra số thập phân để nhân với số chung.`,
      ],
      chuY: s === 100 ? `$100\\%=1$ nên $100\\%\\times ${fmt(M)}$ bằng chính $${fmt(M)}$.` : `phải cộng hai tỉ số phần trăm trước, đừng nhân từng tích riêng rồi mới cộng.`,
      dong: [`$${bt}$`, `$=${chung}${cuoi}$`], dapSo: '',
    })
    return mk(DANG.TT, 'tt_chung_cong', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  // T2: a%×M − b%×M (4)
  lap(ds, 4, () => {
    const a = 5 * ri(8, 30), b = 5 * ri(1, a / 5 - 1); const M = pick(MLIST); const d = a - b; const r = (M * d) / 100
    if (!dp(r, 4) || d === 100) return null
    const kieu = rnd() < 0.5
    const bt = kieu ? `${P(a)}\\times ${fmt(M)}-${P(b)}\\times ${fmt(M)}` : `${fmt(M)}\\times ${P(a)}-${fmt(M)}\\times ${P(b)}`
    const chung = kieu ? `(${P(a)}-${P(b)})\\times ${fmt(M)}=${P(d)}\\times ${fmt(M)}` : `${fmt(M)}\\times(${P(a)}-${P(b)})=${fmt(M)}\\times ${P(d)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Hai tích có chung thừa số $${fmt(M)}$, nên đặt $${fmt(M)}$ làm thừa số chung: trừ hai tỉ số phần trăm rồi mới nhân với $${fmt(M)}$.`,
      buoc: [
        `Tìm thừa số xuất hiện ở cả hai tích, đó là $${fmt(M)}$.`,
        `Viết hiệu hai tỉ số phần trăm trong ngoặc, vì hiệu hai tích có chung một thừa số bằng hiệu hai số còn lại nhân với thừa số đó.`,
        `Trừ hai tỉ số phần trăm, đổi kết quả ra số thập phân rồi nhân với số chung.`,
      ],
      chuY: `trừ hai tỉ số phần trăm trước, kết quả vẫn mang dấu $\\%$ cho tới khi nhân với số chung.`,
      dong: [`$${bt}$`, `$=${chung}=${fmt(r)}$`], dapSo: '',
    })
    return mk(DANG.TT, 'tt_chung_tru', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  // T3: cặp nghịch đảo a%×n = k (8)
  const CAP = [[25, 4], [50, 2], [12.5, 8], [20, 5], [10, 10], [5, 20], [75, 4], [40, 5], [60, 5], [15, 20], [30, 10], [2, 50], [4, 25], [6, 50], [80, 5], [125, 8], [35, 20], [45, 20], [2.5, 40], [1.25, 80]]
  lap(ds, 8, () => {
    const [a, n] = pick(CAP); const k = (a * n) / 100; if (!isInt(k)) return null
    const M = pick(MLIST); const r = M * k; if (!dp(r, 4) || r > 5000) return null
    const kieu = ri(0, 2)
    const bt = [`${P(a)}\\times ${fmt(M)}\\times ${n}`, `${n}\\times ${fmt(M)}\\times ${P(a)}`, `${fmt(M)}\\times ${P(a)}\\times ${n}`][kieu]
    const nhom = kieu === 1 ? `${n}\\times ${P(a)}` : `${P(a)}\\times ${n}`
    const nhom2 = kieu === 1 ? `${n}\\times ${D(a)}` : `${D(a)}\\times ${n}`
    const cuoi = k === 1 ? `${fmt(M)}\\times 1=${fmt(r)}` : `${fmt(M)}\\times ${k}=${fmt(r)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Hai thừa số $${P(a)}$ và $${n}$ nhân với nhau được số tròn ($${P(a)}\\times ${n}=${k}$), nên dùng tính chất giao hoán và kết hợp để nhóm hai số này lại trước.`,
      buoc: [
        `Nhận ra cặp số $${P(a)}$ và $${n}$ có tích tròn, vì $${P(a)}=${D(a)}$ và $${D(a)}\\times ${n}=${k}$.`,
        `Nhóm hai số đó trong ngoặc: $${fmt(M)}\\times(${nhom})$, còn $${fmt(M)}$ để riêng.`,
        `Tính phần trong ngoặc trước, sau đó nhân kết quả với $${fmt(M)}$.`,
      ],
      chuY: `chỉ nhóm hai số khi cả ba số đều được nhân với nhau, không có dấu cộng hay trừ xen giữa.`,
      dong: [`$${bt}$`, `$=${fmt(M)}\\times(${nhom})=${fmt(M)}\\times(${nhom2})=${cuoi}$`], dapSo: '',
    })
    return mk(DANG.TT, 'tt_cap_tron', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  // T4: ba tích chung thừa số (4)
  lap(ds, 4, () => {
    const s = pick([100, 100, 50, 75, 60, 40, 80]); const a = 5 * ri(1, s / 5), b = 5 * ri(1, s / 5), c = s - a - b; if (c < 5 || c % 5 || a === b || b === c || a === c) return null
    const M = pick(MLIST); const r = (M * s) / 100; if (!dp(r, 4)) return null
    const bt = `${P(a)}\\times ${fmt(M)}+${P(b)}\\times ${fmt(M)}+${P(c)}\\times ${fmt(M)}`
    const cuoi = s === 100 ? `${P(s)}\\times ${fmt(M)}=1\\times ${fmt(M)}=${fmt(r)}` : `${P(s)}\\times ${fmt(M)}=${fmt(r)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Ba tích đều có thừa số $${fmt(M)}$, nên đặt $${fmt(M)}$ làm thừa số chung rồi cộng ba tỉ số phần trăm trong ngoặc.`,
      buoc: [
        `Nhìn ra thừa số $${fmt(M)}$ có mặt ở cả ba tích.`,
        `Viết tổng ba tỉ số phần trăm trong ngoặc rồi nhân với $${fmt(M)}$.`,
        s === 100 ? `Cộng ba tỉ số phần trăm được $100\\%$, mà $100\\%=1$ nên kết quả bằng chính số chung.` : `Cộng ba tỉ số phần trăm rồi nhân kết quả với số chung.`,
      ],
      chuY: `cộng đủ cả ba tỉ số phần trăm trong ngoặc, không bỏ sót số nào.`,
      dong: [`$${bt}$`, `$=(${P(a)}+${P(b)}+${P(c)})\\times ${fmt(M)}=${cuoi}$`], dapSo: '',
    })
    return mk(DANG.TT, 'tt_ba_tich', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  // T5: M − M×a% − M×b% (4)
  lap(ds, 4, () => {
    const a = pick([10, 15, 20, 25, 30, 35, 40, 45]), b = pick([10, 15, 20, 25, 30, 35, 5]); const s = 100 - a - b; if (s < 10 || a === b) return null
    const M = pick(MLIST); const r = (M * s) / 100; if (!dp(r, 4)) return null
    const bt = `${fmt(M)}-${fmt(M)}\\times ${P(a)}-${fmt(M)}\\times ${P(b)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Viết $${fmt(M)}=${fmt(M)}\\times 100\\%$ để cả ba số hạng đều có thừa số $${fmt(M)}$, rồi đặt thừa số chung ra ngoài.`,
      buoc: [
        `Viết số hạng đầu thành $${fmt(M)}\\times 100\\%$, vì $100\\%=1$ nên giá trị không đổi.`,
        `Đặt $${fmt(M)}$ làm thừa số chung: $${fmt(M)}\\times(100\\%-${P(a)}-${P(b)})$.`,
        `Tính phần trong ngoặc bằng cách trừ liên tiếp các tỉ số phần trăm rồi nhân với $${fmt(M)}$.`,
      ],
      chuY: `phải đổi số hạng đứng một mình thành $${fmt(M)}\\times 100\\%$ trước khi đặt thừa số chung.`,
      dong: [`$${bt}$`, `$=${fmt(M)}\\times 100\\%-${fmt(M)}\\times ${P(a)}-${fmt(M)}\\times ${P(b)}=${fmt(M)}\\times(100\\%-${P(a)}-${P(b)})=${fmt(M)}\\times ${P(s)}=${fmt(r)}$`], dapSo: '',
    })
    return mk(DANG.TT, 'tt_tru_100', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  // T6: a%×M ± a%×N, M±N tròn (6)
  lap(ds, 6, () => {
    const a = pick([5, 10, 12.5, 15, 20, 25, 30, 35, 40, 45, 60, 75, 80, 8, 24, 36]); const cong = rnd() < 0.6; const S = pick([10, 100, 1000, 50, 20, 200, 500, 40, 60])
    let M, N, tong
    if (cong) { M = pick([ri(1, S - 1), ri(1, S * 10 - 1) / 10]); N = Math.round((S - M) * 100) / 100; tong = S; if (N <= 0 || !dp(M, 1) || !dp(N, 1)) return null }
    else { N = pick([ri(1, S), ri(1, S * 10) / 10]); M = Math.round((S + N) * 100) / 100; tong = S; if (!dp(N, 1) || !dp(M, 1)) return null }
    if (M === N) return null
    const r = (a * tong) / 100; if (!dp(r, 4)) return null
    const dau = cong ? '+' : '-'; const kieu = rnd() < 0.5
    const bt = kieu ? `${P(a)}\\times ${fmt(M)}${dau}${P(a)}\\times ${fmt(N)}` : `${fmt(M)}\\times ${P(a)}${dau}${fmt(N)}\\times ${P(a)}`
    const chung = kieu ? `${P(a)}\\times(${fmt(M)}${dau}${fmt(N)})=${P(a)}\\times ${fmt(tong)}` : `(${fmt(M)}${dau}${fmt(N)})\\times ${P(a)}=${fmt(tong)}\\times ${P(a)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Hai tích có chung thừa số $${P(a)}$, nên đặt $${P(a)}$ làm thừa số chung rồi ${cong ? 'cộng' : 'trừ'} hai số còn lại: $${fmt(M)}${dau}${fmt(N)}$ cho kết quả tròn.`,
      buoc: [
        `Nhìn ra thừa số $${P(a)}$ có mặt ở cả hai tích.`,
        `Đặt $${P(a)}$ ra ngoài, trong ngoặc ${cong ? 'cộng' : 'trừ'} hai số còn lại.`,
        `Tính phần trong ngoặc được số tròn rồi nhân với $${P(a)}$ để ra kết quả.`,
      ],
      chuY: `thừa số chung ở đây là một tỉ số phần trăm, còn phần trong ngoặc là hai số bình thường.`,
      dong: [`$${bt}$`, `$=${chung}=${fmt(r)}$`], dapSo: '',
    })
    return mk(DANG.TT, cong ? 'tt_chung_pt_cong' : 'tt_chung_pt_tru', `${yc()}\n$${bt}$`, `$${fmt(r)}$`, lg)
  })
  return ds
}

// ============================================================================
// NDB02769 — Tìm phần trăm của một số (9)
// ============================================================================
function sinh02769() {
  const ds = []
  const DV = ['kg', 'lít', 'm', 'km', 'tạ', 'tấn']
  // m1: tìm a% của M (2)
  lap(ds, 2, () => {
    const a = pick([2, 4, 5, 6, 8, 12, 15, 16, 18, 24, 25, 35, 36, 45, 48, 55, 64, 72, 85, 12.5, 37.5, 7.5, 2.5, 65, 95]); const M = pick([6.4, 12, 45, 7.5, 250, 3.2, 18.4, 96, 1.5, 220, 0.8, 36, 420, 16.5, 84, 5.6, 125, 38, 15.2, 64, 150, 28, 9.5]); const dv = pick(DV)
    const r = (M * a) / 100; if (!dp(r, 4) || r <= 0) return null
    const nd = pick([`Tìm ${fmt(a)}% của ${fmt(M)} ${dv}.`, `${fmt(a)}% của ${fmt(M)} ${dv} bằng bao nhiêu ${dv}?`])
    const lg = loiGiai({
      matChot: `Tìm $${P(a)}$ của một số là lấy số đó nhân với $${P(a)}$; vì $${P(a)}=${D(a)}$ nên có thể đổi ra số thập phân rồi nhân.`,
      buoc: [`Xác định số đã cho là $${fmt(M)}$ ${dv} và tỉ số phần trăm cần lấy là $${P(a)}$.`, `Viết phép nhân: số đã cho nhân với $${P(a)}$ (từ "của" báo hiệu phép nhân).`, `Đổi $${P(a)}$ ra số thập phân rồi nhân, viết kết quả kèm đơn vị ${dv}.`],
      chuY: `đây là tìm một phần của số đã cho nên dùng phép nhân, không dùng phép chia.`,
      dong: [`Kết quả là: $${fmt(M)}\\times ${P(a)}=${fmt(M)}\\times ${D(a)}=${fmt(r)}$ (${dv})`], dapSo: `$${fmt(r)}$ ${dv}`,
    })
    return mk(DANG.PC, 'pc_tinh', nd, `$${fmt(r)}$ ${dv}`, lg)
  })
  // m2: học sinh (2)
  const HSV = ['đạt loại giỏi', 'tham gia câu lạc bộ cờ vua', 'đi học bằng xe đạp', 'thích môn Toán', 'biết bơi', 'đăng ký học thêm tiếng Anh', 'được khen thưởng cuối năm']
  lap(ds, 2, () => {
    const lop = pick(['Lớp 5A', 'Lớp 5B', 'Lớp 5C', 'Khối lớp Năm của một trường', 'Một trường tiểu học']); const N = pick(lop.startsWith('Lớp') ? [20, 25, 30, 32, 36, 40, 45, 50] : [120, 150, 200, 250, 300, 400]), a = pick([15, 20, 25, 30, 35, 40, 45, 60, 65, 70, 75, 80, 12, 16, 24, 36]), v = pick(HSV); const r = (N * a) / 100; if (!isInt(r)) return null
    const nd = `${lop} có ${N} học sinh, trong đó ${a}% số học sinh ${v}. Hỏi có bao nhiêu học sinh ${v}?`
    const lg = loiGiai({
      matChot: `Số học sinh ${v} là $${a}\\%$ của tổng số học sinh; tìm $${a}\\%$ của $${N}$ thì lấy $${N}$ nhân với $${a}\\%$.`,
      buoc: [`Xác định số cả là $${N}$ học sinh và số học sinh ${v} chiếm $${a}\\%$ của số cả.`, `Viết phép nhân: tổng số học sinh nhân với $${a}\\%$.`, `Đổi $${a}\\%$ ra số thập phân rồi nhân, viết kết quả kèm đơn vị học sinh.`],
      chuY: `đáp số là số học sinh ${v}, không phải số học sinh còn lại.`,
      dong: [`Số học sinh ${v} là: $${N}\\times ${P(a)}=${fmt(r)}$ (học sinh)`], dapSo: `$${fmt(r)}$ học sinh`,
    })
    return mk(DANG.PC, 'pc_hs', nd, `$${fmt(r)}$ học sinh`, lg)
  })
  // m3: dùng a% còn lại bao nhiêu (2)
  const VT = [['một can', 'dầu ăn', 'lít'], ['một bao', 'gạo', 'kg'], ['một cuộn', 'dây điện', 'm'], ['một thùng', 'nước mắm', 'lít'], ['một bao', 'đường', 'kg'], ['một tấm', 'vải', 'm']]
  lap(ds, 2, () => {
    const [vc, vat, dv] = pick(VT); const M = pick([40, 50, 24, 36, 64, 80, 120, 25, 45, 60, 32, 72, 4.8, 12.5, 7.5]), a = pick([20, 25, 30, 35, 40, 45, 60, 15, 12, 8, 75]); const dung = (M * a) / 100; const con = M - dung
    if (!dp(dung, 3) || !dp(con, 3)) return null
    const nd = `${cap(vc)} chứa ${fmt(M)} ${dv} ${vat}. Người ta đã dùng ${a}% lượng ${vat} đó. Hỏi trong ${vc} còn lại bao nhiêu ${dv} ${vat}?`
    const lg = loiGiai({
      matChot: `Tìm lượng đã dùng bằng cách lấy tổng lượng nhân với $${a}\\%$, rồi lấy tổng lượng trừ đi lượng đã dùng để được lượng còn lại.`,
      buoc: [`Tìm lượng ${vat} đã dùng: lấy $${fmt(M)}$ ${dv} nhân với $${a}\\%$.`, `Lấy tổng lượng ${vat} trừ đi lượng đã dùng để tìm lượng còn lại.`, `Viết đáp số kèm đơn vị ${dv}.`],
      chuY: `đề hỏi lượng còn lại chứ không phải lượng đã dùng, nên còn một bước trừ.`,
      dong: [`Lượng ${vat} đã dùng là: $${fmt(M)}\\times ${P(a)}=${fmt(dung)}$ (${dv})`, `Lượng ${vat} còn lại là: $${fmt(M)}-${fmt(dung)}=${fmt(con)}$ (${dv})`], dapSo: `$${fmt(con)}$ ${dv}`,
    })
    return mk(DANG.PC, 'pc_con_lai', nd, `$${fmt(con)}$ ${dv}`, lg)
  })
  // m4: diện tích (2)
  lap(ds, 2, () => {
    const dai = pick([20, 30, 40, 50, 25, 60, 80, 24, 36, 45]), rong = pick([10, 15, 20, 12, 16, 25, 30, 18, 24]); if (rong >= dai) return null
    const a = pick([20, 25, 30, 35, 40, 45, 60, 75, 15, 12.5]); const S = dai * rong, r = (S * a) / 100; if (!dp(r, 3)) return null
    const dt = pick(['trồng rau', 'làm nhà', 'đào ao thả cá', 'trồng hoa', 'xây chuồng trại'])
    const nd = `Một mảnh đất hình chữ nhật có chiều dài ${dai} m và chiều rộng ${rong} m. Người ta dùng ${fmt(a)}% diện tích mảnh đất để ${dt}. Tính diện tích phần đất dùng để ${dt}.`
    const lg = loiGiai({
      matChot: `Phải tìm diện tích cả mảnh đất trước (dài nhân rộng), rồi tìm $${P(a)}$ của diện tích đó bằng phép nhân.`,
      buoc: [`Tìm diện tích mảnh đất hình chữ nhật: lấy chiều dài nhân chiều rộng.`, `Phần đất dùng để ${dt} là $${P(a)}$ của diện tích mảnh đất, nên lấy diện tích nhân với $${P(a)}$.`, `Viết đáp số kèm đơn vị mét vuông.`],
      chuY: `$${P(a)}$ tính trên diện tích chứ không tính trên chiều dài hay chiều rộng.`,
      dong: [`Diện tích mảnh đất là: $${dai}\\times ${rong}=${S}$ ($\\text{m}^2$)`, `Diện tích đất dùng để ${dt} là: $${S}\\times ${P(a)}=${fmt(r)}$ ($\\text{m}^2$)`], dapSo: `$${fmt(r)}\\ \\text{m}^2$`,
    })
    return mk(DANG.PC, 'pc_dien_tich', nd, `$${fmt(r)}\\ \\text{m}^2$`, lg)
  })
  // m5: tăng thêm a% (1)
  lap(ds, 1, () => {
    const X = pick([['Năm ngoái, một cây xanh cao', 'Năm nay cây tăng thêm', 'cm', 'Tính chiều cao của cây năm nay.', 'chiều cao của cây'], ['Tháng trước, một xưởng may sản xuất được', 'Tháng này sản lượng tăng thêm', 'chiếc áo', 'Hỏi tháng này xưởng sản xuất được bao nhiêu chiếc áo?', 'số áo']]); const [d1, d2, dv, q, ten] = X
    const M = pick([80, 120, 250, 400, 160, 500, 240, 320]), a = pick([5, 10, 15, 20, 25, 12, 8]); const them_ = (M * a) / 100; if (!dp(them_, 3)) return null; const r = M + them_
    const nd = `${d1} ${M} ${dv}. ${d2} ${a}% so với trước đó. ${q}`
    const lg = loiGiai({
      matChot: `Phần tăng thêm là $${a}\\%$ của số ban đầu; tìm phần tăng bằng phép nhân rồi cộng vào số ban đầu.`,
      buoc: [`Xác định số ban đầu là $${M}$ ${dv} và phần tăng thêm bằng $${a}\\%$ của số đó.`, `Tìm phần tăng thêm: lấy $${M}$ nhân với $${a}\\%$.`, `Cộng phần tăng thêm vào số ban đầu để được ${ten} sau khi tăng.`],
      chuY: `đề hỏi giá trị sau khi tăng nên phải cộng thêm phần tăng vào số ban đầu.`,
      dong: [`Phần tăng thêm là: $${M}\\times ${P(a)}=${fmt(them_)}$ (${dv})`, `Giá trị sau khi tăng là: $${M}+${fmt(them_)}=${fmt(r)}$ (${dv})`], dapSo: `$${fmt(r)}$ ${dv}`,
    })
    return mk(DANG.PC, 'pc_tang', nd, `$${fmt(r)}$ ${dv}`, lg)
  })
  return ds
}

// ============================================================================
// NDB02770 — Tìm một số khi biết phần trăm của nó (14)
// ============================================================================
function sinh02770() {
  const ds = []
  // n1: tìm A (3)
  lap(ds, 3, () => {
    const a = pick([20, 25, 40, 50, 60, 75, 80, 12.5, 15, 35, 45, 8, 4, 30, 24, 16]); const A = pick([40, 64, 120, 250, 36, 80, 4.8, 15, 7.5, 28, 90, 200, 12.5, 48, 160, 6.4]); const M = (A * a) / 100
    if (!dp(M, 3) || M <= 0 || isInt(M) === false && !dp(M, 2)) return null
    const nd = pick([`Tìm số A, biết rằng ${fmt(a)}% của số A là ${fmt(M)}.`, `Biết ${fmt(a)}% của số A bằng ${fmt(M)}. Tìm số A.`])
    const lg = loiGiai({
      matChot: `Số A ứng với $100\\%$, còn $${fmt(M)}$ chỉ là $${P(a)}$ của A; biết $${P(a)}$ của một số là $${fmt(M)}$ thì số đó bằng $${fmt(M)}:${P(a)}$.`,
      buoc: [`Nhận ra số A là số cả (ứng với $100\\%$) và $${fmt(M)}$ ứng với $${P(a)}$ của A.`, `Muốn tìm cả số khi biết một phần trăm của nó, ta lấy giá trị đã biết chia cho tỉ số phần trăm.`, `Đổi $${P(a)}$ ra số thập phân rồi chia, sau đó nhân lại với $${P(a)}$ để thử kết quả.`],
      chuY: `không nhân $${fmt(M)}$ với $${P(a)}$: đó là cách tìm phần trăm của một số, không phải tìm cả số.`,
      dong: [`Số A là: $${fmt(M)}:${P(a)}=${fmt(M)}:${D(a)}=${fmt(A)}$`], dapSo: `$A=${fmt(A)}$`,
    })
    return mk(DANG.TS, 'ts_tim_A', nd, `$A=${fmt(A)}$`, lg)
  })
  // n2: phần chiếm a% → cả (3)
  const CT = [
    (k, a, w) => `Trong một đàn gà có ${k} con gà trống, chiếm ${a}% tổng số gà của đàn. Hỏi đàn gà có tất cả bao nhiêu con?`,
    (k, a, w) => `Lớp 5A có ${k} học sinh nữ, chiếm ${a}% số học sinh cả lớp. Hỏi lớp 5A có bao nhiêu học sinh?`,
    (k, a, w) => `Thư viện của trường có ${k} quyển truyện tranh, chiếm ${a}% tổng số sách của thư viện. Hỏi thư viện có tất cả bao nhiêu quyển sách?`,
    (k, a, w) => `Một vườn cây có ${k} cây cam, chiếm ${a}% tổng số cây trong vườn. Hỏi vườn có tất cả bao nhiêu cây?`,
  ]
  const DVN = ['con', 'học sinh', 'quyển sách', 'cây']
  lap(ds, 3, () => {
    const i = ri(0, 3); const a = pick([20, 25, 30, 40, 45, 60, 35, 15, 12, 16, 36, 24, 55, 65, 8]); const T = pick(i === 1 ? [20, 25, 30, 40, 45, 50] : [40, 50, 60, 80, 120, 150, 200, 250, 300, 400, 500, 160, 240, 320, 450]); const k = (T * a) / 100; if (!isInt(k)) return null
    const nd = CT[i](k, a)
    const lg = loiGiai({
      matChot: `Số phần đã biết ứng với $${a}\\%$ của tổng; muốn tìm tổng ta lấy số đã biết chia cho $${a}\\%$.`,
      buoc: [`Xác định số đã biết là $${k}$, đó là $${a}\\%$ của tổng số cần tìm.`, `Tổng số ứng với $100\\%$; lấy số đã biết chia cho tỉ số phần trăm $${a}\\%$.`, `Thử lại: lấy tổng vừa tìm nhân với $${a}\\%$ phải ra đúng $${k}$.`],
      chuY: `không lấy $${k}$ nhân với $${a}\\%$: $${k}$ chưa phải là cả.`,
      dong: [`Tổng số là: $${k}:${P(a)}=${T}$ (${DVN[i]})`], dapSo: `$${T}$ ${DVN[i]}`,
    })
    return mk(DANG.TS, 'ts_phan_chiem', nd, `$${T}$ ${DVN[i]}`, lg)
  })
  // n3: a% là X, biết số Y → cả (3)
  const CL = [
    (a, k) => `${a}% số học sinh của lớp 5C là nữ. Biết lớp có ${k} học sinh nam. Hỏi lớp 5C có tất cả bao nhiêu học sinh?`,
    (a, k) => `Trong một kho hàng, gạo tẻ chiếm ${a}% tổng số gạo, còn lại là gạo nếp. Biết có ${k} bao gạo nếp. Hỏi kho có tất cả bao nhiêu bao gạo?`,
    (a, k) => `Một nông trại nuôi gà và vịt, số gà chiếm ${a}% tổng số gia cầm. Biết số vịt là ${k} con. Hỏi nông trại nuôi tất cả bao nhiêu con gia cầm?`,
  ]
  const CLU = ['học sinh', 'bao gạo', 'con gia cầm']
  lap(ds, 3, () => {
    const i = ri(0, 2); const a = pick([40, 35, 45, 30, 60, 65, 25, 20, 36, 24, 52, 48]); const T = pick([40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500]); const k = (T * (100 - a)) / 100; if (!isInt(k)) return null
    const nd = CL[i](a, k); const b = 100 - a
    const lg = loiGiai({
      matChot: `Số đã biết là phần còn lại, chiếm $100\\%-${a}\\%=${b}\\%$ của tổng; lấy số đó chia cho $${b}\\%$ để tìm tổng.`,
      buoc: [`Tìm phần trăm của phần đã biết số lượng: lấy $100\\%$ trừ $${a}\\%$.`, `Số $${k}$ ứng với $${b}\\%$ của tổng nên lấy $${k}$ chia cho $${b}\\%$.`, `Viết đáp số kèm đơn vị ${CLU[i]}.`],
      chuY: `không chia $${k}$ cho $${a}\\%$: số $${k}$ không ứng với $${a}\\%$ mà ứng với phần còn lại.`,
      dong: [`Phần còn lại chiếm: $100\\%-${P(a)}=${P(b)}$ (tổng số)`, `Tổng số là: $${k}:${P(b)}=${T}$ (${CLU[i]})`], dapSo: `$${T}$ ${CLU[i]}`,
    })
    return mk(DANG.TS, 'ts_con_lai', nd, `$${T}$ ${CLU[i]}`, lg)
  })
  // n4: tăng / giảm a% (2)
  for (const tang of [true, false]) lap(ds, 1, () => {
    const a = pick([5, 8, 10, 12, 20, 25, 15, 4]); const b = tang ? 100 + a : 100 - a; const G = pick([200, 250, 400, 500, 800, 1000, 1200, 2000, 2500, 4000, 5000]); const M = (G * b) / 100; if (!isInt(M)) return null
    const nd = tang
      ? pick([`Dân số của một xã năm nay tăng ${a}% so với năm ngoái và đạt ${nhom3(M)} người. Hỏi năm ngoái xã đó có bao nhiêu người?`, `Số học sinh của một trường năm nay tăng ${a}% so với năm ngoái và đạt ${nhom3(M)} em. Hỏi năm ngoái trường đó có bao nhiêu học sinh?`])
      : pick([`Sau khi dùng hết ${a}% số xi măng trong kho, trong kho còn ${nhom3(M)} bao xi măng. Hỏi lúc đầu kho có bao nhiêu bao xi măng?`, `Một xe tải chở hàng, sau khi dỡ xuống ${a}% số hàng thì trên xe còn ${nhom3(M)} thùng. Hỏi lúc đầu xe chở bao nhiêu thùng hàng?`])
    const dv = /xã|người/.test(nd) ? 'người' : /học sinh/.test(nd) ? 'học sinh' : /bao xi/.test(nd) ? 'bao xi măng' : 'thùng hàng'
    const lg = loiGiai({
      matChot: tang ? `Số năm ngoái là $100\\%$; năm nay tăng $${a}\\%$ nên bằng $100\\%+${a}\\%=${b}\\%$ số năm ngoái, từ đó lấy số hiện có chia cho $${b}\\%$.` : `Số lúc đầu là $100\\%$; đã bớt $${a}\\%$ nên số còn lại bằng $100\\%-${a}\\%=${b}\\%$ số lúc đầu, từ đó lấy số còn lại chia cho $${b}\\%$.`,
      buoc: [tang ? `Coi số năm ngoái là $100\\%$, cộng thêm $${a}\\%$ để biết số năm nay bằng bao nhiêu phần trăm.` : `Coi số lúc đầu là $100\\%$, trừ đi $${a}\\%$ để biết số còn lại bằng bao nhiêu phần trăm.`, `Số đã cho ${nhom3(M)} ứng với $${b}\\%$ của số cần tìm.`, `Lấy số đã cho chia cho $${b}\\%$ để tìm số cần tìm.`],
      chuY: tang ? `$${a}\\%$ tính trên số năm ngoái, nên không lấy số năm nay trừ đi $${a}\\%$ của nó.` : `$${a}\\%$ tính trên số lúc đầu, nên không lấy số còn lại cộng thêm $${a}\\%$ của nó.`,
      dong: [tang ? `Số năm nay bằng: $100\\%+${P(a)}=${P(b)}$ (số năm ngoái)` : `Số còn lại bằng: $100\\%-${P(a)}=${P(b)}$ (số lúc đầu)`, `${tang ? 'Số năm ngoái' : 'Số lúc đầu'} là: $${G > 0 ? M : M}:${P(b)}=${G}$ (${dv})`], dapSo: `$${G}$ ${dv}`,
    })
    return mk(DANG.TS, tang ? 'ts_tang' : 'ts_giam', nd, `$${G}$ ${dv}`, lg)
  })
  // n5: đổi đơn vị (2)
  const VN = [['Mè (vừng) đem ép thì được', 'dầu mè', 'mè'], ['Lúa xay xát thì được', 'gạo', 'thóc'], ['Mía đem ép thì được', 'nước mía', 'mía'], ['Đậu nành đem ép thì được', 'dầu nành', 'đậu nành']]
  lap(ds, 2, () => {
    const [v1, sp, nl] = pick(VN); const a = pick([25, 20, 40, 50, 60, 80, 30, 45, 75]); const tonTa = pick([2, 3, 4, 5, 6, 8, 10, 1.5, 2.5]); const nlKg = tonTa * 100; const spKg = (nlKg * a) / 100; if (!isInt(spKg)) return null
    const nd = `${v1} ${a}% ${sp}. Hỏi muốn có ${nhom3(spKg)} kg ${sp} thì cần bao nhiêu tạ ${nl}?`
    const lg = loiGiai({
      matChot: `${cap(sp)} chiếm $${a}\\%$ khối lượng ${nl}; biết khối lượng ${sp} thì lấy khối lượng đó chia cho $${a}\\%$ để tìm khối lượng ${nl}, rồi đổi ra tạ.`,
      buoc: [`Xác định ${nhom3(spKg)} kg ${sp} ứng với $${a}\\%$ khối lượng ${nl}.`, `Lấy ${nhom3(spKg)} chia cho $${a}\\%$ để tìm khối lượng ${nl} theo ki-lô-gam.`, `Đổi ki-lô-gam sang tạ vì đề hỏi bằng tạ ($1$ tạ $=100$ kg).`],
      chuY: `đề hỏi bằng đơn vị tạ nên phải đổi đơn vị ở bước cuối.`,
      dong: [`Khối lượng ${nl} cần dùng là: $${spKg}:${P(a)}=${nlKg}$ (kg)`, `Đổi: $${nlKg}:100=${fmt(tonTa)}$ (tạ)`], dapSo: `$${fmt(tonTa)}$ tạ ${nl}`,
    })
    return mk(DANG.TS, 'ts_doi_don_vi', nd, `$${fmt(tonTa)}$ tạ ${nl}`, lg)
  })
  // n6: a% của số là M, tìm b% của số đó (1)
  lap(ds, 1, () => {
    const a = pick([20, 25, 40, 30, 60, 15, 35, 45]), b = pick([12, 15, 35, 60, 75, 80, 5, 90, 45, 10]); const S = pick([120, 200, 250, 300, 400, 160, 240, 500, 600]); const M = (S * a) / 100; const r = (S * b) / 100; if (!isInt(M) || !dp(r, 3) || a === b) return null
    const nd = `${a}% của một số là ${M}. Hỏi ${b}% của số đó là bao nhiêu?`
    const lg = loiGiai({
      matChot: `Trước hết tìm số đó: biết $${a}\\%$ của số là $${M}$ thì số đó bằng $${M}:${a}\\%$; sau đó tìm $${b}\\%$ của số vừa tìm.`,
      buoc: [`Tìm số đó: lấy $${M}$ chia cho $${a}\\%$ vì $${M}$ là $${a}\\%$ của số cần tìm.`, `Tìm $${b}\\%$ của số đó bằng cách lấy số vừa tìm nhân với $${b}\\%$.`, `Viết đáp số là kết quả của bước hai.`],
      chuY: `đề hỏi $${b}\\%$ của số đó chứ không hỏi chính số đó.`,
      dong: [`Số đó là: $${M}:${P(a)}=${S}$`, `${b}% của số đó là: $${S}\\times ${P(b)}=${fmt(r)}$`], dapSo: `$${fmt(r)}$`,
    })
    return mk(DANG.TS, 'ts_roi_pt', nd, `$${fmt(r)}$`, lg)
  })
  return ds
}

// ============================================================================
// NDB03000 — Đổi số thập phân / phân số ↔ % (27)
// ============================================================================
const FR = (a, b) => `\\dfrac{${a}}{${b}}`
function chuoiPsPt(a, b) { // phân số a/b (tối giản, b có ước 2,5) → chuỗi biến đổi tới % + giá trị phần trăm
  const v = (a / b) * 100
  if (100 % b === 0) { const q = 100 / b; return { chuoi: `${FR(a, b)}=${FR(`${a}\\times ${q}`, `${b}\\times ${q}`)}=${FR(a * q, 100)}=${a * q}\\%`, ptram: a * q, theoMau100: true } }
  return { chuoi: `${FR(a, b)}=${a}:${b}=${fmt(a / b)}=${P(v)}`, ptram: v, theoMau100: false }
}
function sinh03000() {
  const ds = []
  // c1: STP → % (6)
  lap(ds, 6, () => {
    const x = pick([ri(1, 99) / 100, ri(1, 99) / 100, ri(101, 299) / 100, ri(1, 999) / 1000, ri(11, 39) / 10, ri(2, 9) / 10, ri(1, 9) / 100, ri(1, 5)])
    if (!dp(x, 3)) return null
    const nd = pick([`Viết số thập phân $${fmt(x)}$ dưới dạng tỉ số phần trăm.`, `Viết $${fmt(x)}$ thành tỉ số phần trăm.`])
    const pcv = x * 100
    const lg = loiGiai({
      tinh: true,
      matChot: `Muốn viết một số thập phân dưới dạng tỉ số phần trăm, ta nhân số đó với $100$ (dịch dấu phẩy sang phải hai chữ số) rồi viết thêm dấu $\\%$, vì $1=100\\%$.`,
      buoc: [`Xác định số thập phân cần đổi là $${fmt(x)}$.`, `Dịch dấu phẩy sang phải hai chữ số, thêm chữ số $0$ nếu phần thập phân không đủ hai chữ số.`, `Viết thêm dấu $\\%$ vào bên phải kết quả.`],
      chuY: `số lớn hơn $1$ khi đổi ra phần trăm thì lớn hơn $100\\%$, chẳng hạn $1,2=120\\%$.`,
      dong: [`$${fmt(x)}=${P(pcv)}$`], dapSo: '',
    })
    return mk(DANG.DOI, 'doi_stp_pt', nd, `$${P(pcv)}$`, lg)
  })
  // c2: phân số → % (6)
  lap(ds, 6, () => {
    const b = pick([2, 4, 5, 8, 10, 16, 20, 25, 40, 50, 125, 200, 4, 5, 20, 25]); const a = ri(1, b * 2); if (gcd(a, b) !== 1 || a === b) return null
    const v = (a / b) * 100; if (!dp(v, 2)) return null
    const { chuoi, ptram, theoMau100 } = chuoiPsPt(a, b)
    const nd = pick([`Viết phân số $${FR(a, b)}$ dưới dạng tỉ số phần trăm.`, `Đổi phân số $${FR(a, b)}$ ra tỉ số phần trăm.`])
    const lg = loiGiai({
      tinh: true,
      matChot: theoMau100 ? `Mẫu số $${b}$ là ước của $100$, nên nhân cả tử và mẫu với cùng một số để được phân số có mẫu số $100$ rồi viết thành phần trăm.` : `Mẫu số $${b}$ không nhân được thành $100$ gọn, nên chia tử số cho mẫu số được số thập phân rồi đổi sang phần trăm.`,
      buoc: theoMau100
        ? [`Tìm số nhân với mẫu số $${b}$ để được $100$: $100:${b}=${100 / b}$.`, `Nhân cả tử số và mẫu số với $${100 / b}$ để được phân số có mẫu số $100$.`, `Viết phân số có mẫu số $100$ thành tỉ số phần trăm: tử số là số phần trăm.`]
        : [`Chia tử số cho mẫu số: $${a}:${b}$ để được số thập phân.`, `Dịch dấu phẩy của thương sang phải hai chữ số.`, `Viết thêm dấu $\\%$ vào kết quả.`],
      chuY: `phân số có mẫu số $100$ thì tử số chính là số phần trăm: $\\dfrac{15}{100}=15\\%$.`,
      dong: [`$${chuoi}$`], dapSo: '',
    })
    return mk(DANG.DOI, 'doi_ps_pt', nd, `$${P(ptram)}$`, lg)
  })
  // c3: % → phân số tối giản (5)
  lap(ds, 5, () => {
    const p = pick([ri(1, 99), ri(101, 250), 12.5, 37.5, 62.5, 87.5, 6.25, 2.5, 7.5, 0.5, 17.5, ri(1, 99), ri(110, 250)]); if (!dp(p, 2) || p % 100 === 0) return null
    const d = String(p).includes('.') ? String(p).split('.')[1].length : 0; const m = 10 ** d; const tu = Math.round(p * m), mau = 100 * m; const g = gcd(tu, mau); const u = tu / g, v = mau / g; if (v === 1) return null
    const nd = pick([`Viết tỉ số phần trăm $${P(p)}$ dưới dạng phân số tối giản.`, `Đổi $${P(p)}$ ra phân số tối giản.`])
    const buoc3 = d === 0 ? `${FR(p, 100)}=${FR(`${p}:${g}`, `100:${g}`)}=${FR(u, v)}` : `${FR(fmt(p), 100)}=${FR(tu, mau)}=${FR(`${tu}:${g}`, `${mau}:${g}`)}=${FR(u, v)}`
    const lg = loiGiai({
      tinh: true,
      matChot: `Viết $${P(p)}=\\dfrac{${fmt(p)}}{100}$ rồi rút gọn phân số bằng cách chia cả tử và mẫu cho số lớn nhất mà cả hai cùng chia hết.`,
      buoc: [`Viết $${P(p)}$ thành phân số có mẫu số $100$: $\\dfrac{${fmt(p)}}{100}$.`, d ? `Nhân cả tử và mẫu với $${m}$ để tử số không còn dấu phẩy.` : `Tìm số lớn nhất mà cả tử số $${p}$ và mẫu số $100$ cùng chia hết.`, `Chia cả tử và mẫu cho số đó, kiểm tra phân số mới đã tối giản chưa.`],
      chuY: `đề yêu cầu phân số tối giản nên không dừng lại ở phân số có mẫu số $100$.`,
      dong: [`$${P(p)}=${buoc3}$`], dapSo: '',
    })
    return mk(DANG.DOI, 'doi_pt_ps', nd, `$${FR(u, v)}$`, lg)
  })
  // c4: % → số thập phân (4)
  lap(ds, 4, () => {
    const p = pick([ri(1, 99), ri(101, 999), ri(1, 99) + 0.5, 7.5, 13.24, 38.64, 2.05, 405, 1924.2, ri(1, 99) + 0.25]); if (!dp(p, 2)) return null
    const r = p / 100; if (!dp(r, 5)) return null
    const nd = pick([`Viết tỉ số phần trăm $${P(p)}$ dưới dạng số thập phân.`, `Đổi $${P(p)}$ ra số thập phân.`])
    const lg = loiGiai({
      tinh: true,
      matChot: `Vì $${P(p)}=\\dfrac{${fmt(p)}}{100}$ nên đổi tỉ số phần trăm ra số thập phân bằng cách chia cho $100$, tức dịch dấu phẩy sang trái hai chữ số và bỏ dấu $\\%$.`,
      buoc: [`Viết $${P(p)}$ thành phân số có mẫu số $100$: $\\dfrac{${fmt(p)}}{100}$.`, `Chia tử số cho $100$ bằng cách dịch dấu phẩy sang trái hai chữ số.`, `Bỏ dấu $\\%$ và viết kết quả dưới dạng số thập phân.`],
      chuY: `dịch dấu phẩy sang trái, thêm chữ số $0$ ở đầu nếu số có ít hơn hai chữ số ở phần nguyên.`,
      dong: [`$${P(p)}=${FR(fmt(p), 100)}=${fmt(r)}$`], dapSo: '',
    })
    return mk(DANG.DOI, 'doi_pt_stp', nd, `$${fmt(r)}$`, lg)
  })
  // c5: hỗn số → % (3)
  lap(ds, 3, () => {
    const b = pick([2, 4, 5, 8, 10, 20, 25, 50]); const a = ri(1, b - 1); if (gcd(a, b) !== 1) return null; const w = ri(1, 4)
    const N = w * b + a; const v = (N / b) * 100; if (!dp(v, 2)) return null
    const nd = pick([`Viết hỗn số $${w}${FR(a, b)}$ dưới dạng tỉ số phần trăm.`, `Đổi hỗn số $${w}${FR(a, b)}$ ra tỉ số phần trăm.`])
    const lg = loiGiai({
      tinh: true,
      matChot: `Đổi hỗn số ra phân số, chia tử số cho mẫu số được số thập phân, rồi dịch dấu phẩy sang phải hai chữ số và viết dấu $\\%$.`,
      buoc: [`Đổi hỗn số $${w}${FR(a, b)}$ thành phân số: nhân phần nguyên với mẫu số rồi cộng tử số.`, `Chia tử số cho mẫu số để được số thập phân.`, `Dịch dấu phẩy sang phải hai chữ số và viết thêm dấu $\\%$.`],
      chuY: `hỗn số lớn hơn $1$ nên kết quả phải lớn hơn $100\\%$.`,
      dong: [`$${w}${FR(a, b)}=${FR(N, b)}=${N}:${b}=${fmt(N / b)}=${P(v)}$`], dapSo: '',
    })
    return mk(DANG.DOI, 'doi_hs_pt', nd, `$${P(v)}$`, lg)
  })
  // c6: danh sách 4 số → % (3)
  lap(ds, 3, () => {
    const mucs = []
    for (let i = 0; i < 4; i++) {
      const loai = pick(['stp', 'stp', 'ps', 'hs'])
      if (loai === 'stp') { const x = pick([ri(1, 99) / 100, ri(101, 299) / 100, ri(1, 999) / 1000]); mucs.push({ txt: fmt(x), v: x * 100, ch: (r) => `${fmt(x)}=${P(r)}` }) }
      else if (loai === 'ps') { const b = pick([4, 5, 8, 20, 25, 40, 50]), a = ri(1, 2 * b); if (gcd(a, b) !== 1 || a === b) { i--; continue } const { chuoi, ptram } = chuoiPsPt(a, b); mucs.push({ txt: FR(a, b), v: ptram, ch: () => chuoi }) }
      else { const b = pick([2, 4, 5, 20, 25]), a = ri(1, b - 1), w = ri(1, 3); if (gcd(a, b) !== 1) { i--; continue } const N = w * b + a; mucs.push({ txt: `${w}${FR(a, b)}`, v: (N / b) * 100, ch: () => `${w}${FR(a, b)}=${FR(N, b)}=${N}:${b}=${fmt(N / b)}=${P((N / b) * 100)}` }) }
    }
    if (mucs.some((m) => !dp(m.v, 2))) return null
    if (new Set(mucs.map((m) => m.txt)).size < 4) return null
    const nd = `Viết các số sau dưới dạng tỉ số phần trăm: $${mucs.map((m) => m.txt).join(';\\ ')}$.`
    const lg = loiGiai({
      tinh: true,
      matChot: `Mỗi số được đổi riêng: số thập phân thì dịch dấu phẩy sang phải hai chữ số, phân số và hỗn số thì chia tử cho mẫu (hoặc quy đồng mẫu số $100$) rồi mới viết dấu $\\%$.`,
      buoc: [`Với số thập phân, dịch dấu phẩy sang phải hai chữ số rồi viết dấu $\\%$.`, `Với phân số, đổi thành mẫu số $100$ hoặc chia tử số cho mẫu số rồi đổi sang phần trăm.`, `Với hỗn số, đổi ra phân số trước rồi làm như với phân số.`],
      chuY: `làm từng số một và kiểm tra lại số nào lớn hơn $1$ thì phần trăm lớn hơn $100\\%$.`,
      dong: mucs.map((m, i) => `${'abcd'[i]}) $${m.ch(m.v)}$`), dapSo: '',
    })
    return mk(DANG.DOI, 'doi_danh_sach', nd, mucs.map((m) => `$${P(m.v)}$`).join('; '), lg)
  })
  return ds
}

// ============================================================================
// NDB03001 — Tính tỉ số % của hai đại lượng (24)
// ============================================================================
function sinh03001() {
  const ds = []
  const tl = (a, b) => { const r = a / b; return dp(r, 4) && dp(r * 100, 2) ? r : null }
  // (1) phần / cả (4)
  const T1 = [
    (N, k) => `Lớp 5A có ${N} học sinh, trong đó có ${k} học sinh giỏi. Hỏi số học sinh giỏi chiếm bao nhiêu phần trăm số học sinh cả lớp?`,
    (N, k) => `Một xưởng sản xuất được ${N} sản phẩm, trong đó có ${k} sản phẩm đạt loại A. Tìm tỉ số phần trăm của số sản phẩm loại A và tổng số sản phẩm của xưởng.`,
    (N, k) => `Trong hộp có ${N} viên bi, trong đó có ${k} viên bi màu đỏ. Hỏi số bi đỏ chiếm bao nhiêu phần trăm số bi trong hộp?`,
    (N, k) => `Thư viện của một trường có ${N} quyển sách, trong đó có ${k} quyển sách khoa học. Hỏi sách khoa học chiếm bao nhiêu phần trăm số sách của thư viện?`,
  ]
  lap(ds, 4, () => {
    const i = ri(0, 3); const N = pick(i === 0 ? [25, 30, 32, 36, 40, 45, 48, 50] : [40, 50, 25, 80, 125, 200, 160, 250, 400, 500, 60, 75]), k = ri(3, N - 2); const r = tl(k, N); if (r === null || isInt(r * 100) === false && !dp(r * 100, 1)) return null
    const nd = T1[i](N, k)
    const lg = loiGiai({
      matChot: `Tìm tỉ số phần trăm của hai số là lấy số được so sánh chia cho số gốc (số "cả"), rồi đổi thương ra phần trăm.`,
      buoc: [`Xác định số được so sánh là $${k}$ và số gốc làm chuẩn là $${N}$ (đứng sau "số ... cả" hoặc "tổng số").`, `Chia số được so sánh cho số gốc để được số thập phân.`, `Đổi số thập phân sang phần trăm: dịch dấu phẩy sang phải hai chữ số và viết dấu $\\%$.`],
      chuY: `chia đúng thứ tự: phần chia cho cả, không đảo lại.`,
      dong: [`Tỉ số phần trăm là: $${k}:${N}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_phan_cl', nd, `$${P(r * 100)}$`, lg)
  })
  // (2) bằng bao nhiêu % (3)
  const T2 = [['Năm ngoái, một thửa ruộng thu hoạch được', 'kg thóc', 'năm nay thu hoạch được', 'Hỏi năm nay thu hoạch bằng bao nhiêu phần trăm năm ngoái?'], ['Tháng trước, một cửa hàng bán được', 'chiếc quạt', 'tháng này bán được', 'Hỏi số quạt bán được trong tháng này bằng bao nhiêu phần trăm số quạt bán được trong tháng trước?'], ['Học kì I, trường có', 'học sinh giỏi, học kì II có', 'Hỏi số học sinh giỏi học kì II bằng bao nhiêu phần trăm số học sinh giỏi học kì I?']]
  lap(ds, 3, () => {
    const A = pick([40, 50, 80, 100, 120, 125, 200, 250, 400, 500, 800, 1200, 160, 60]), B = pick([30, 45, 60, 75, 90, 110, 140, 150, 180, 210, 300, 350, 450, 600, 720, 1500, 1800]); const r = tl(B, A); if (r === null || A === B) return null
    const i = ri(0, 2); const t = T2[i]
    const nd2 = i === 0 ? `Năm ngoái, một thửa ruộng thu hoạch được ${nhom3(A)} kg thóc, năm nay thu hoạch được ${nhom3(B)} kg thóc. ${t[3]}` : i === 1 ? `Tháng trước, một cửa hàng bán được ${nhom3(A)} chiếc quạt, tháng này bán được ${nhom3(B)} chiếc quạt. ${t[3]}` : `Học kì I, trường có ${A} học sinh giỏi, học kì II có ${B} học sinh giỏi. ${t[2]}`
    const lg = loiGiai({
      matChot: `So sánh hai số bằng tỉ số phần trăm: số của thời điểm sau là số được so sánh, số của thời điểm trước là số gốc, nên lấy số sau chia cho số trước.`,
      buoc: [`Xác định số gốc là số ở thời điểm trước, bằng $${nhom3(A)}$, và số được so sánh là $${nhom3(B)}$.`, `Lấy số được so sánh chia cho số gốc để được số thập phân.`, `Đổi kết quả sang phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số.`],
      chuY: `số đứng sau chữ "so với" hoặc "của" là số gốc, nó là số chia.`,
      dong: [`Tỉ số phần trăm là: $${B}:${A}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_bang_pt', nd2, `$${P(r * 100)}$`, lg)
  })
  // (3) hơn / kém bao nhiêu % (4)
  lap(ds, 4, () => {
    const hon = ds.filter((c) => c.mau === 'ti_hon_kem').length % 2 === 0
    const A = pick([40, 50, 80, 100, 120, 125, 200, 250, 400, 500, 800, 1200, 160, 60, 20, 300]); const k = hon ? pick([1.1, 1.2, 1.25, 1.3, 1.5, 1.75, 1.6, 1.4, 2.5]) : pick([0.9, 0.8, 0.75, 0.6, 0.85, 0.7, 0.4, 0.95, 0.64]); const B0 = A * k; if (!isInt(B0)) return null; const B = Math.round(B0); const r = B / A
    const diff = Math.round(Math.abs(r * 100 - 100) * 100) / 100; if (!dp(diff, 2)) return null
    const Ctx = pick([
      { t0: 'Tháng trước', t1: 'tháng này', pre: 'nhà bạn An dùng', dv: 'kWh điện', q: 'lượng điện' },
      { t0: 'Năm ngoái', t1: 'năm nay', pre: 'một trang trại thu hoạch được', dv: 'kg cà phê', q: 'sản lượng cà phê' },
      { t0: 'Tuần trước', t1: 'tuần này', pre: 'một cửa hàng bán được', dv: 'chiếc bút', q: 'số bút bán được' },
      { t0: 'Quý trước', t1: 'quý này', pre: 'một xưởng sản xuất được', dv: 'chiếc ghế', q: 'số ghế sản xuất được' },
    ])
    const nd = `${Ctx.t0}, ${Ctx.pre} ${nhom3(A)} ${Ctx.dv}, ${Ctx.t1} ${nhom3(B)} ${Ctx.dv}. Hỏi ${Ctx.q} ${Ctx.t1} ${hon ? 'nhiều hơn' : 'ít hơn'} ${Ctx.t0.toLowerCase()} bao nhiêu phần trăm?`
    const lg = loiGiai({
      matChot: `Trước hết tìm số sau bằng bao nhiêu phần trăm số trước (lấy số sau chia số trước), sau đó so với $100\\%$ để biết ${hon ? 'nhiều hơn' : 'ít hơn'} bao nhiêu phần trăm.`,
      buoc: [`Xác định số trước là số gốc $${nhom3(A)}$ và số sau là $${nhom3(B)}$.`, `Lấy số sau chia cho số gốc rồi đổi ra phần trăm để biết số sau bằng bao nhiêu phần trăm số gốc.`, hon ? `Số sau lớn hơn số gốc nên lấy kết quả trừ đi $100\\%$ để tìm phần nhiều hơn.` : `Số sau bé hơn số gốc nên lấy $100\\%$ trừ kết quả để tìm phần ít hơn.`],
      chuY: `"${hon ? 'nhiều hơn' : 'ít hơn'} bao nhiêu phần trăm" khác "bằng bao nhiêu phần trăm": phải so với $100\\%$.`,
      dong: [`Số sau bằng số trước: $${B}:${A}=${fmt(r)}=${P(r * 100)}$`, hon ? `Số sau nhiều hơn số trước: $${P(r * 100)}-100\\%=${P(diff)}$` : `Số sau ít hơn số trước: $100\\%-${P(r * 100)}=${P(diff)}$`], dapSo: `$${P(diff)}$`,
    })
    return mk(DANG.TI, 'ti_hon_kem', nd, `$${P(diff)}$`, lg)
  })
  // (4) kế hoạch (1 đạt + 2 vượt)
  const KH = [['Một xưởng may đặt kế hoạch may', 'thực tế may được', 'bộ quần áo'], ['Một tổ công nhân được giao làm', 'thực tế làm được', 'chiếc đèn lồng'], ['Một nông trại đặt kế hoạch thu hoạch', 'thực tế thu hoạch được', 'kg rau xanh']]
  const kh = (vuot) => () => {
    const K = pick([200, 250, 400, 500, 800, 1000, 1200, 2000, 80, 120, 160]); const f = vuot ? pick([1.1, 1.2, 1.25, 1.3, 1.5, 1.15, 1.4, 1.05]) : pick([0.8, 0.75, 0.9, 0.6, 0.85, 0.96, 0.5]); const Tt = K * f; if (!isInt(Tt)) return null
    const Tt2 = Math.round(Tt); const [c0, c1, dv] = pick(KH); const diff = Math.round((f * 100 - 100) * 100) / 100
    const nd = vuot ? `${c0} ${nhom3(K)} ${dv}, ${c1} ${nhom3(Tt2)} ${dv}. Hỏi xưởng đã vượt mức kế hoạch bao nhiêu phần trăm?`.replace('xưởng', c0.includes('xưởng') ? 'xưởng' : c0.includes('tổ') ? 'tổ công nhân' : 'nông trại') : `${c0} ${nhom3(K)} ${dv}, ${c1} ${nhom3(Tt2)} ${dv}. Hỏi đã thực hiện được bao nhiêu phần trăm kế hoạch?`
    const lg = loiGiai({
      matChot: vuot ? `Số thực tế so với kế hoạch: lấy thực tế chia kế hoạch được tỉ số phần trăm đã thực hiện, rồi trừ $100\\%$ để biết đã vượt mức bao nhiêu.` : `Số đã thực hiện so với kế hoạch: lấy số thực tế chia cho số kế hoạch rồi đổi ra phần trăm.`,
      buoc: [`Xác định kế hoạch (số gốc) là $${nhom3(K)}$ và thực tế (số so sánh) là $${nhom3(Tt2)}$.`, `Lấy thực tế chia cho kế hoạch để được số thập phân.`, vuot ? `Đổi ra phần trăm rồi lấy kết quả trừ $100\\%$ để được phần vượt mức.` : `Đổi số thập phân sang phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số.`],
      chuY: vuot ? `kết quả cuối là phần vượt mức, không phải số phần trăm kế hoạch đã thực hiện.` : `số gốc là kế hoạch, không phải số thực tế.`,
      dong: vuot ? [`Số đã thực hiện so với kế hoạch là: $${Tt2}:${K}=${fmt(f)}=${P(f * 100)}$`, `Đã vượt mức kế hoạch là: $${P(f * 100)}-100\\%=${P(diff)}$`] : [`Số đã thực hiện so với kế hoạch là: $${Tt2}:${K}=${fmt(f)}=${P(f * 100)}$`],
      dapSo: vuot ? `$${P(diff)}$` : `$${P(f * 100)}$`,
    })
    return mk(DANG.TI, vuot ? 'ti_ke_hoach_vuot' : 'ti_ke_hoach_dat', nd, vuot ? `$${P(diff)}$` : `$${P(f * 100)}$`, lg)
  }
  lap(ds, 1, kh(false)); lap(ds, 2, kh(true))
  // (5) nam : nữ (3)
  lap(ds, 3, () => {
    const n = ri(8, 28), m = ri(8, 28); const r = tl(n, m); if (r === null || n === m) return null
    const nd = pick([`Một lớp học có ${n} học sinh nam và ${m} học sinh nữ. Tính tỉ số phần trăm của số học sinh nam và số học sinh nữ.`, `Trong một câu lạc bộ có ${n} bạn nam và ${m} bạn nữ. Số bạn nam bằng bao nhiêu phần trăm số bạn nữ?`])
    const lg = loiGiai({
      matChot: `Tìm tỉ số phần trăm của số nam so với số nữ: số đứng sau "so với" (số nữ) là số gốc nên là số chia.`,
      buoc: [`Xác định số được so sánh là số nam $${n}$ và số gốc là số nữ $${m}$.`, `Lấy số nam chia cho số nữ để được số thập phân.`, `Đổi số thập phân sang phần trăm: dịch dấu phẩy sang phải hai chữ số và viết dấu $\\%$.`],
      chuY: `đề so với số nữ (không phải cả lớp) nên không cần tìm tổng số.`,
      dong: [`Tỉ số phần trăm là: $${n}:${m}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_nam_nu', nd, `$${P(r * 100)}$`, lg)
  })
  // (6) nữ so với cả lớp (2)
  lap(ds, 2, () => {
    const n = ri(10, 28), m = ri(10, 28); const tong = n + m; const r = tl(m, tong); if (tong > 50 || r === null) return null
    const nd = pick(['Lớp 5B', 'Lớp 5C', 'Lớp 5D']) + ` có ${n} học sinh nam và ${m} học sinh nữ. Hỏi số học sinh nữ chiếm bao nhiêu phần trăm số học sinh cả lớp?`
    const lg = loiGiai({
      matChot: `Số gốc là cả lớp (tổng nam và nữ) nên phải tìm tổng trước, rồi lấy số nữ chia cho tổng.`,
      buoc: [`Tìm tổng số học sinh cả lớp: cộng số nam và số nữ.`, `Lấy số học sinh nữ chia cho tổng số vừa tìm để được số thập phân.`, `Đổi số thập phân sang phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số.`],
      chuY: `không lấy số nữ chia cho số nam: đề so với cả lớp.`,
      dong: [`Số học sinh cả lớp là: $${n}+${m}=${tong}$ (học sinh)`, `Số học sinh nữ chiếm số phần trăm số học sinh cả lớp là: $${m}:${tong}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_nu_cl', nd, `$${P(r * 100)}$`, lg)
  })
  // (7) hiệu → cả (2)
  lap(ds, 2, () => {
    const n = ri(10, 22), k = ri(2, 8); const nu = n + k, tong = n + nu; const r = tl(nu, tong); if (tong > 50 || r === null) return null
    const nd = `Một lớp học có ${n} học sinh nam. Số học sinh nữ nhiều hơn số học sinh nam là ${k} em. Hỏi số học sinh nữ chiếm bao nhiêu phần trăm số học sinh cả lớp?`
    const lg = loiGiai({
      matChot: `Phải tìm số học sinh nữ rồi tìm tổng số học sinh cả lớp, sau đó lấy số nữ chia cho tổng số.`,
      buoc: [`Tìm số học sinh nữ: lấy số nam cộng với số em nữ nhiều hơn.`, `Tìm số học sinh cả lớp: cộng số nam với số nữ.`, `Lấy số nữ chia cho số học sinh cả lớp rồi đổi ra phần trăm.`],
      chuY: `số nữ nhiều hơn số nam ${k} em, không phải số nữ bằng ${k} em.`,
      dong: [`Số học sinh nữ là: $${n}+${k}=${nu}$ (học sinh)`, `Số học sinh cả lớp là: $${n}+${nu}=${tong}$ (học sinh)`, `Số học sinh nữ chiếm số phần trăm số học sinh cả lớp là: $${nu}:${tong}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_hieu_tong', nd, `$${P(r * 100)}$`, lg)
  })
  // (8) đổi đơn vị (3)
  const DVI = [['Một đoạn đường dài', 'km', 'đã sửa được', 'm', 1000, 'Hỏi đã sửa được bao nhiêu phần trăm đoạn đường?'], ['Một bao gạo nặng', 'kg', 'đã dùng hết', 'g', 1000, 'Hỏi lượng gạo đã dùng chiếm bao nhiêu phần trăm bao gạo?'], ['Một dải ruy băng dài', 'm', 'đã cắt đi', 'cm', 100, 'Hỏi đã cắt đi bao nhiêu phần trăm dải ruy băng?'], ['Một kho chứa', 'tạ', 'đã xuất đi', 'kg', 100, 'Hỏi lượng hàng đã xuất chiếm bao nhiêu phần trăm lượng hàng trong kho?']]
  lap(ds, 3, () => {
    const [c0, ub, c1, us, f, q] = pick(DVI); const W = pick([2, 2.5, 4, 5, 1.5, 3, 0.8, 1.2, 2.4, 6]); const Wsmall = W * f; if (!isInt(Wsmall)) return null; const p = ri(1, Math.round(Wsmall) - 1); const r = tl(p, Wsmall); if (r === null) return null
    const nd = `${c0} ${fmt(W)} ${ub}, ${c1} ${p} ${us}. ${q}`
    const lg = loiGiai({
      matChot: `Hai số đo ở hai đơn vị khác nhau phải đổi về cùng một đơn vị rồi mới lập tỉ số: đổi đơn vị lớn sang đơn vị bé.`,
      buoc: [`Đổi số đo lớn $${fmt(W)}$ ${ub} sang ${us} để cùng đơn vị với $${p}$ ${us}.`, `Lấy số đo của phần đã có chia cho số đo của cả (số gốc) sau khi đã cùng đơn vị.`, `Đổi kết quả sang phần trăm bằng cách dịch dấu phẩy sang phải hai chữ số.`],
      chuY: `không lập tỉ số khi hai số đo khác đơn vị: $${fmt(W)}$ ${ub} và $${p}$ ${us} chưa so sánh được ngay.`,
      dong: [`Đổi: $${fmt(W)}\\times ${f}=${Wsmall}$ (${us})`, `Tỉ số phần trăm là: $${p}:${Wsmall}=${fmt(r)}=${P(r * 100)}$`], dapSo: `$${P(r * 100)}$`,
    })
    return mk(DANG.TI, 'ti_don_vi', nd, `$${P(r * 100)}$`, lg)
  })
  return ds
}

// ============================================================================
// NDB03553 — hiệu (hoặc tổng) hai bộ phận ứng với x% cả lớp, có thêm bớt (32)
// ============================================================================
const C2 = [   // hai bộ phận chia hết cả tổng
  { tot: [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2400], dau: 'Ở một trường tiểu học,', A: 'số học sinh nam', B: 'số học sinh nữ', Wh: 'tổng số học sinh toàn trường', unit: 'học sinh', Q: 'trường đó có tất cả bao nhiêu học sinh', A1: 'học sinh nam', B1: 'học sinh nữ', Tt: 'Tổng số học sinh toàn trường' },
  { tot: [20, 25, 30, 40, 45, 50], dau: 'Lớp 5A có', A: 'số bạn nam', B: 'số bạn nữ', Wh: 'sĩ số của lớp', unit: 'bạn', Q: 'lớp 5A có tất cả bao nhiêu bạn', A1: 'bạn nam', B1: 'bạn nữ', Tt: 'Sĩ số của lớp' },
  { tot: [40, 50, 60, 80, 100, 120, 150, 200, 250, 300], dau: 'Một câu lạc bộ có', A: 'số thành viên nam', B: 'số thành viên nữ', Wh: 'tổng số thành viên', unit: 'thành viên', Q: 'câu lạc bộ đó có tất cả bao nhiêu thành viên', A1: 'thành viên nam', B1: 'thành viên nữ', Tt: 'Tổng số thành viên' },
  { tot: [100, 200, 300, 400, 500, 600, 800, 1000, 1200, 2000], dau: 'Một vườn cây ăn quả chỉ trồng cam và bưởi,', A: 'số cây cam', B: 'số cây bưởi', Wh: 'tổng số cây trong vườn', unit: 'cây', Q: 'vườn đó có tất cả bao nhiêu cây', A1: 'cây cam', B1: 'cây bưởi', Tt: 'Tổng số cây trong vườn' },
  { tot: [200, 300, 400, 500, 800, 1000, 1500, 2000, 3000], dau: 'Một thư viện chỉ có sách khoa học và sách truyện,', A: 'số sách khoa học', B: 'số sách truyện', Wh: 'tổng số sách', unit: 'quyển sách', Q: 'thư viện đó có tất cả bao nhiêu quyển sách', A1: 'quyển sách khoa học', B1: 'quyển sách truyện', Tt: 'Tổng số sách' },
]
const C3 = [   // ba bộ phận
  { tot: [20, 25, 30, 40, 45, 50], B1: 'học sinh khá', dau: 'Cuối học kì I, lớp 5A có', A: 'số học sinh giỏi', B: 'số học sinh khá', rest: 'học sinh trung bình', Wh: 'số học sinh cả lớp', unit: 'học sinh', Q: 'lớp 5A có tất cả bao nhiêu học sinh', A1: 'học sinh giỏi', Tt: 'Số học sinh cả lớp' },
  { tot: [100, 200, 300, 400, 500, 600, 800, 1000, 2000, 3000], B1: 'cây quýt', dau: 'Trong một khu vườn có', A: 'số cây cam', B: 'số cây quýt', rest: 'cây bưởi', Wh: 'tổng số cây trong vườn', unit: 'cây', Q: 'khu vườn có tất cả bao nhiêu cây', A1: 'cây cam', Tt: 'Tổng số cây trong vườn' },
  { tot: [200, 300, 400, 500, 800, 1000, 1500, 2000, 3000], B1: 'quyển sách truyện', dau: 'Một thư viện có', A: 'số sách khoa học', B: 'số sách truyện', rest: 'sách tham khảo', Wh: 'tổng số sách', unit: 'quyển sách', Q: 'thư viện có tất cả bao nhiêu quyển sách', A1: 'quyển sách khoa học', Tt: 'Tổng số sách' },
  { tot: [100, 200, 300, 400, 500, 600, 800, 1000, 2000], B1: 'con vịt', dau: 'Một trại chăn nuôi có', A: 'số con gà', B: 'số con vịt', rest: 'ngan', Wh: 'tổng số gia cầm', unit: 'con', Q: 'trại đó có tất cả bao nhiêu con gia cầm', A1: 'con gà', Tt: 'Tổng số gia cầm' },
]
const C4 = [   // đầu năm nam = nữ, thêm bớt
  { tot: [200, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2400], u: [60, 80, 100, 120, 150, 200, 250, 300], Sub: 'Một trường tiểu học', sub: 'một trường tiểu học', A: 'số học sinh nam', B: 'số học sinh nữ', A1: 'học sinh nam', B1: 'học sinh nữ', Wh: 'tổng số học sinh toàn trường', unit: 'học sinh', Lt: 'nhà trường', Q: 'trường đó', Tt: 'Tổng số học sinh toàn trường', moc: 'Đầu năm học', moc2: 'Đến cuối học kì I', moc3: 'lúc cuối học kì I' },
  { tot: [40, 50, 60, 80, 100, 120, 150, 200, 250, 300], u: [20, 24, 30, 36, 40, 45, 50, 60, 75, 90], Sub: 'Một câu lạc bộ', sub: 'một câu lạc bộ', A: 'số thành viên nam', B: 'số thành viên nữ', A1: 'thành viên nam', B1: 'thành viên nữ', Wh: 'tổng số thành viên', unit: 'thành viên', Lt: 'câu lạc bộ', Q: 'câu lạc bộ đó', Tt: 'Tổng số thành viên', moc: 'Lúc mới thành lập', moc2: 'Sau một tháng', moc3: 'lúc sau một tháng' },
  { tot: [20, 25, 30, 40, 45, 50], u: [10, 12, 15, 16, 18, 20, 24, 25], Sub: 'Lớp 5C', sub: 'lớp 5C', A: 'số bạn nam', B: 'số bạn nữ', A1: 'bạn nam', B1: 'bạn nữ', Wh: 'sĩ số của lớp', unit: 'bạn', Lt: 'lớp', Q: 'lớp 5C', Tt: 'Sĩ số của lớp', moc: 'Đầu năm học', moc2: 'Sang học kì II', moc3: 'lúc học kì II' },
]
const TOT = [100, 120, 150, 160, 180, 200, 240, 250, 300, 320, 360, 400, 480, 500, 600, 640, 800, 1000, 1200, 1500, 1600, 2000, 2400, 3000]
function sinh03553() {
  const ds = []
  const lgHieu = (c, a, k, T, ten) => { // 2–3 dòng: hiệu ứng với e%
    const b = 100 - a, hon = a > 50, e = Math.abs(100 - 2 * a)
    return {
      b, e, hon,
      dong: [`Số ${ten} chiếm: $100\\%-${P(a)}=${P(b)}$ (${c.Wh})`, `Hiệu hai số ứng với: $${P(Math.max(a, b))}-${P(Math.min(a, b))}=${P(e)}$ (${c.Wh})`],
    }
  }
  // p1: hiệu + 1 phần trăm → tổng (6)
  lap(ds, 6, () => {
    const c = pick(C2); const T = pick(c.tot), a = pick([30, 32, 35, 36, 38, 40, 42, 44, 45, 46, 48, 52, 54, 55, 56, 58, 60, 62, 64, 65, 68, 70]); const A = (T * a) / 100, k = (T * Math.abs(100 - 2 * a)) / 100; if (!isInt(A) || !isInt(k) || k < 2) return null
    const hon = a > 50; const e = Math.abs(100 - 2 * a), b = 100 - a
    const nd = `${c.dau} ${c.A} chiếm ${a}% ${c.Wh} và ${hon ? 'nhiều hơn' : 'ít hơn'} ${c.B} là ${k} ${c.unit}. Hỏi ${c.Q}?`
    const lg = loiGiai({
      matChot: `Hai bộ phận chiếm $${P(a)}$ và $${P(b)}$ của cùng một tổng thì hiệu của chúng ứng với $${P(e)}$ của tổng; biết hiệu là $${k}$ thì lấy $${k}$ chia cho $${P(e)}$ để tìm tổng.`,
      buoc: [`Tìm phần trăm của bộ phận còn lại: lấy $100\\%$ trừ đi $${P(a)}$.`, `Tìm hiệu hai bộ phận ứng với bao nhiêu phần trăm của tổng: lấy phần trăm lớn trừ phần trăm bé.`, `Số $${k}$ ứng với $${P(e)}$ của tổng nên lấy $${k}$ chia cho $${P(e)}$ để tìm tổng.`],
      chuY: `hai phần trăm phải cùng tính trên một tổng, và không lấy $${k}$ nhân với $${P(e)}$.`,
      dong: [`${cap(c.B)} chiếm: $100\\%-${P(a)}=${P(b)}$ (${c.Wh})`, `Hiệu hai bộ phận ứng với: $${P(Math.max(a, b))}-${P(Math.min(a, b))}=${P(e)}$ (${c.Wh})`, `${c.Tt} là: $${k}:${P(e)}=${T}$ (${c.unit})`], dapSo: `$${T}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_hieu_mot_pt', nd, `$${T}$ ${c.unit}`, lg)
  })
  // p1b: hiệu + 1 phần trăm → a) tổng b) từng bộ phận (4)
  lap(ds, 4, () => {
    const c = pick(C2); const T = pick(c.tot), a = pick([30, 35, 36, 40, 42, 44, 45, 46, 48, 52, 54, 55, 56, 58, 60, 65, 70]); const A = (T * a) / 100, B = T - A, k = (T * Math.abs(100 - 2 * a)) / 100; if (!isInt(A) || !isInt(k) || k < 2) return null
    const hon = a > 50; const e = Math.abs(100 - 2 * a), b = 100 - a
    const nd = `${c.dau} ${c.A} chiếm ${a}% ${c.Wh} và ${hon ? 'nhiều hơn' : 'ít hơn'} ${c.B} là ${k} ${c.unit}. Hỏi: a) ${cap(c.Q)}? b) Có bao nhiêu ${c.A1}, bao nhiêu ${c.B1}?`
    const da = `a) $${T}$ ${c.unit}; b) $${A}$ ${c.A1}, $${B}$ ${c.B1}`
    const lg = loiGiai({
      matChot: `Hiệu hai bộ phận ứng với $${P(e)}$ của tổng nên tìm được tổng; có tổng rồi thì tìm bộ phận chiếm $${P(a)}$ bằng phép nhân, bộ phận còn lại bằng phép trừ.`,
      buoc: [`Tìm phần trăm của bộ phận còn lại và hiệu hai bộ phận ứng với bao nhiêu phần trăm của tổng.`, `Lấy $${k}$ chia cho $${P(e)}$ để tìm tổng.`, `Tìm bộ phận chiếm $${P(a)}$ bằng cách nhân tổng với $${P(a)}$, rồi lấy tổng trừ đi để được bộ phận còn lại.`],
      chuY: `ý a) cần tìm trước để làm ý b); kiểm tra lại hiệu hai bộ phận có đúng bằng $${k}$ không.`,
      dong: [`a) ${cap(c.B)} chiếm: $100\\%-${P(a)}=${P(b)}$ (${c.Wh})`, `Hiệu hai bộ phận ứng với: $${P(Math.max(a, b))}-${P(Math.min(a, b))}=${P(e)}$ (${c.Wh})`, `${c.Tt} là: $${k}:${P(e)}=${T}$ (${c.unit})`, `b) Số ${c.A1} là: $${T}\\times ${P(a)}=${A}$ (${c.unit})`, `Số ${c.B1} là: $${T}-${A}=${B}$ (${c.unit})`], dapSo: da,
    })
    return mk(DANG.HT, 'ht_hieu_hai_y', nd, da, lg)
  })
  // p2: hai phần trăm cho trước, hiệu → tổng (3) / một bộ phận (1)
  const p2 = (hoiPhan) => () => {
    const c = pick(C3); const T = pick(c.tot); const a = ri(20, 55), b = ri(10, a - 5); if (a + b >= 95) return null; const A = (T * a) / 100, B = (T * b) / 100, k = A - B; if (!isInt(A) || !isInt(B) || k < 2) return null
    const e = a - b
    const nd = `${c.dau} ${c.A} chiếm ${a}% và ${c.B} chiếm ${b}% ${c.Wh}, còn lại là ${c.rest}. Biết ${c.A} nhiều hơn ${c.B} là ${k} ${c.unit}. ${hoiPhan ? `Hỏi có bao nhiêu ${c.A1}?` : `Hỏi ${c.Q}?`}`
    const dong = [`${cap(c.A)} nhiều hơn ${c.B} ứng với: $${P(a)}-${P(b)}=${P(e)}$ (${c.Wh})`, `${c.Tt} là: $${k}:${P(e)}=${T}$ (${c.unit})`]
    if (hoiPhan) dong.push(`Số ${c.A1} là: $${T}\\times ${P(a)}=${A}$ (${c.unit})`)
    const lg = loiGiai({
      matChot: `Hai bộ phận chiếm $${P(a)}$ và $${P(b)}$ của cùng một tổng thì hiệu của chúng ứng với $${P(e)}$ của tổng; biết hiệu là $${k}$ thì lấy $${k}$ chia cho $${P(e)}$ để tìm tổng.`,
      buoc: [`Tìm hiệu hai bộ phận ứng với bao nhiêu phần trăm của tổng: lấy $${P(a)}$ trừ $${P(b)}$.`, `Số $${k}$ ứng với $${P(e)}$ của tổng nên lấy $${k}$ chia cho $${P(e)}$ để tìm tổng.`, hoiPhan ? `Tìm số ${c.A1}: lấy tổng vừa tìm nhân với $${P(a)}$.` : `Đối chiếu đề hỏi tổng nên kết quả bước hai là đáp số.`],
      chuY: `phần "còn lại" không liên quan đến hiệu nên không dùng đến trong bài này.`,
      dong, dapSo: hoiPhan ? `$${A}$ ${c.unit}` : `$${T}$ ${c.unit}`,
    })
    return mk(DANG.HT, hoiPhan ? 'ht_hieu_hai_pt_phan' : 'ht_hieu_hai_pt', nd, hoiPhan ? `$${A}$ ${c.unit}` : `$${T}$ ${c.unit}`, lg)
  }
  lap(ds, 3, p2(false)); lap(ds, 1, p2(true))
  // p3: tổng hai bộ phận ứng với (a+b)% → tổng (4)
  lap(ds, 4, () => {
    const c = pick(C3); const T = pick(c.tot); const a = ri(15, 50), b = ri(10, 45); if (a + b >= 95 || a === b) return null; const A = (T * a) / 100, B = (T * b) / 100, k = A + B; if (!isInt(A) || !isInt(B)) return null
    const e = a + b
    const nd = `${c.dau} ${c.A} chiếm ${a}% và ${c.B} chiếm ${b}% ${c.Wh}, còn lại là ${c.rest}. Biết tổng số ${c.A1} và ${c.B1} là ${k} ${c.unit}. Hỏi ${c.Q}?`
    const lg = loiGiai({
      matChot: `Hai bộ phận chiếm $${P(a)}$ và $${P(b)}$ của cùng một tổng thì cả hai cộng lại chiếm $${P(e)}$ của tổng; biết tổng hai bộ phận là $${k}$ thì lấy $${k}$ chia cho $${P(e)}$.`,
      buoc: [`Tìm cả hai bộ phận chiếm bao nhiêu phần trăm tổng: cộng $${P(a)}$ với $${P(b)}$.`, `Số $${k}$ ứng với $${P(e)}$ của tổng nên lấy $${k}$ chia cho $${P(e)}$.`, `Viết đáp số kèm đơn vị ${c.unit}.`],
      chuY: `ở bài này cộng hai phần trăm (vì đề cho tổng), còn bài cho hiệu thì trừ hai phần trăm.`,
      dong: [`Hai bộ phận chiếm: $${P(a)}+${P(b)}=${P(e)}$ (${c.Wh})`, `${c.Tt} là: $${k}:${P(e)}=${T}$ (${c.unit})`], dapSo: `$${T}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_tong_hai_pt', nd, `$${T}$ ${c.unit}`, lg)
  })
  // p4: đầu năm A = B, thêm n (B) và m (A) → B chiếm b% → hỏi đầu năm (5)
  lap(ds, 5, () => {
    const c = pick(C4); const u = pick(c.u); const n = ri(4, Math.max(8, Math.round(u * 0.9))), m = ri(1, n - 3); const Tc = 2 * u + n + m, Bc = u + n; const b = Math.round((Bc / Tc) * 1e8) / 1e6; if (!dp(b, 0) || b <= 50 || b >= 80 || n - m < 4) return null
    const e = 2 * b - 100; if (e <= 0) return null
    const nd = `${c.moc}, ${c.sub} có ${c.A} bằng ${c.B}. ${c.moc2}, ${c.Lt} nhận thêm ${n} ${c.B1} và ${m} ${c.A1} nên ${c.B} chiếm ${b}% ${c.Wh}. Hỏi ${c.moc.toLowerCase()}, ${c.Q} có bao nhiêu ${c.unit}?`
    const d = n - m; const a = 100 - b
    const lg = loiGiai({
      matChot: `Hiệu hai bộ phận ${c.moc3} chính là hiệu số ${c.B1} và ${c.A1} nhận thêm (vì lúc đầu hai bộ phận bằng nhau); hiệu này ứng với $${P(e)}$ của tổng ${c.moc3}, từ đó tìm tổng rồi trừ đi số nhận thêm.`,
      buoc: [`Tìm hiệu hai bộ phận ${c.moc3}: bằng số ${c.B1} nhận thêm trừ số ${c.A1} nhận thêm.`, `Tìm hiệu đó ứng với bao nhiêu phần trăm tổng ${c.moc3}: $${P(b)}$ trừ $${P(a)}$.`, `Lấy hiệu chia cho phần trăm vừa tìm để được tổng ${c.moc3}, rồi trừ số nhận thêm để tìm tổng lúc đầu.`],
      chuY: `lúc đầu hai bộ phận bằng nhau nên hiệu lúc sau chỉ do số nhận thêm tạo ra; đừng quên trừ số nhận thêm ở bước cuối.`,
      dong: [`Số ${c.B1} nhiều hơn số ${c.A1} ${c.moc3} là: $${n}-${m}=${d}$ (${c.unit})`, `${cap(c.A)} chiếm: $100\\%-${P(b)}=${P(a)}$ (${c.Wh} ${c.moc3})`, `Hiệu hai bộ phận ứng với: $${P(b)}-${P(a)}=${P(e)}$ (${c.Wh} ${c.moc3})`, `${c.Tt} ${c.moc3} là: $${d}:${P(e)}=${Tc}$ (${c.unit})`, `${c.Tt} lúc đầu là: $${Tc}-${n}-${m}=${2 * u}$ (${c.unit})`], dapSo: `$${2 * u}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_bang_nhau_them', nd, `$${2 * u}$ ${c.unit}`, lg)
  })
  // p5: sau khi thêm t, hiệu & % → hỏi lúc đầu (3)
  lap(ds, 3, () => {
    const c = pick(C4); const T = pick(c.tot); const a = pick([35, 36, 40, 42, 44, 45, 46, 48, 52, 54, 55, 56, 58, 60, 65]); const k = (T * Math.abs(100 - 2 * a)) / 100; if (!isInt(k) || !isInt((T * a) / 100) || k < 2) return null; const t = ri(3, Math.max(4, Math.min(40, Math.round(T / 8)))); if (T - t < 15) return null
    const hon = a > 50; const e = Math.abs(100 - 2 * a), b = 100 - a
    const nd = `${c.Sub} nhận thêm ${t} ${c.unit} mới. Lúc này ${c.A} chiếm ${a}% ${c.Wh} và ${hon ? 'nhiều hơn' : 'ít hơn'} ${c.B} là ${k} ${c.unit}. Hỏi trước khi nhận thêm, ${c.Q} có bao nhiêu ${c.unit}?`
    const lg = loiGiai({
      matChot: `Lúc sau, hiệu hai bộ phận ứng với $${P(e)}$ của tổng lúc sau; tìm tổng lúc sau rồi trừ đi số đã nhận thêm để được tổng lúc đầu.`,
      buoc: [`Tìm phần trăm của bộ phận còn lại lúc sau: lấy $100\\%$ trừ $${P(a)}$.`, `Hiệu hai bộ phận ứng với $${P(e)}$ của tổng lúc sau, nên lấy $${k}$ chia cho $${P(e)}$ để tìm tổng lúc sau.`, `Lấy tổng lúc sau trừ đi số đã nhận thêm để được tổng lúc đầu.`],
      chuY: `các phần trăm tính trên tổng LÚC SAU (đã nhận thêm), nên phải trừ số nhận thêm ở bước cuối.`,
      dong: [`${cap(c.B)} chiếm: $100\\%-${P(a)}=${P(b)}$ (${c.Wh} lúc sau)`, `Hiệu hai bộ phận ứng với: $${P(Math.max(a, b))}-${P(Math.min(a, b))}=${P(e)}$ (${c.Wh} lúc sau)`, `${c.Tt} lúc sau là: $${k}:${P(e)}=${T}$ (${c.unit})`, `${c.Tt} trước khi nhận thêm là: $${T}-${t}=${T - t}$ (${c.unit})`], dapSo: `$${T - t}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_sau_them_hoi_dau', nd, `$${T - t}$ ${c.unit}`, lg)
  })
  // p6: cho % + hiệu lúc đầu, sau đó thêm / chuyển đi t → hỏi lúc sau (3)
  lap(ds, 3, () => {
    const c = pick(C4); const T = pick(c.tot); const a = pick([35, 36, 40, 42, 44, 45, 46, 48, 52, 54, 55, 56, 58, 60, 65]); const k = (T * Math.abs(100 - 2 * a)) / 100; if (!isInt(k) || !isInt((T * a) / 100) || k < 2) return null; const t = ri(3, Math.max(4, Math.min(40, Math.round(T / 8))))
    const them_ = rnd() < 0.5; const hon = a > 50; const e = Math.abs(100 - 2 * a), b = 100 - a; const Tsau = them_ ? T + t : T - t
    const nd = `${c.Sub} có ${c.A} chiếm ${a}% ${c.Wh} và ${hon ? 'nhiều hơn' : 'ít hơn'} ${c.B} là ${k} ${c.unit}. Sau đó có ${t} ${c.unit} ${them_ ? 'mới được nhận thêm' : 'chuyển đi nơi khác'}. Hỏi lúc này ${c.Q} có bao nhiêu ${c.unit}?`
    const lg = loiGiai({
      matChot: `Các phần trăm tính trên tổng lúc đầu: hiệu hai bộ phận ứng với $${P(e)}$ của tổng lúc đầu nên tìm được tổng lúc đầu, rồi ${them_ ? 'cộng thêm' : 'trừ đi'} số ${c.unit} ${them_ ? 'nhận thêm' : 'chuyển đi'}.`,
      buoc: [`Tìm hiệu hai bộ phận ứng với bao nhiêu phần trăm tổng lúc đầu: lấy phần trăm lớn trừ phần trăm bé.`, `Lấy $${k}$ chia cho $${P(e)}$ để tìm tổng lúc đầu.`, `${them_ ? 'Cộng thêm' : 'Trừ đi'} $${t}$ ${c.unit} để được tổng lúc sau.`],
      chuY: `đề hỏi tổng lúc này (sau khi ${them_ ? 'nhận thêm' : 'chuyển đi'}), không phải tổng lúc đầu.`,
      dong: [`${cap(c.B)} chiếm: $100\\%-${P(a)}=${P(b)}$ (${c.Wh} lúc đầu)`, `Hiệu hai bộ phận ứng với: $${P(Math.max(a, b))}-${P(Math.min(a, b))}=${P(e)}$ (${c.Wh} lúc đầu)`, `${c.Tt} lúc đầu là: $${k}:${P(e)}=${T}$ (${c.unit})`, `${c.Tt} lúc này là: $${T}${them_ ? '+' : '-'}${t}=${Tsau}$ (${c.unit})`], dapSo: `$${Tsau}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_dau_hoi_sau', nd, `$${Tsau}$ ${c.unit}`, lg)
  })
  // p7: tổng hai bộ phận → tổng, rồi thêm t (3)
  lap(ds, 3, () => {
    const c = pick(C3); const T = pick(c.tot); const a = ri(15, 50), b = ri(10, 45); if (a + b >= 95 || a === b) return null; const A = (T * a) / 100, B = (T * b) / 100, k = A + B; if (!isInt(A) || !isInt(B)) return null
    const t = ri(3, Math.max(4, Math.min(30, Math.round(T / 8)))); const e = a + b
    const nd = `${c.dau} ${c.A} chiếm ${a}% và ${c.B} chiếm ${b}% ${c.Wh}, còn lại là ${c.rest}. Biết tổng số ${c.A1} và ${c.B1} là ${k} ${c.unit}. Sau đó có thêm ${t} ${c.unit} mới. Hỏi lúc này có tất cả bao nhiêu ${c.unit}?`
    const lg = loiGiai({
      matChot: `Hai bộ phận chiếm $${P(a)}$ và $${P(b)}$ của tổng lúc đầu, cộng lại ứng với $${P(e)}$ của tổng đó; tìm tổng lúc đầu rồi cộng thêm số ${c.unit} mới.`,
      buoc: [`Tìm cả hai bộ phận chiếm bao nhiêu phần trăm tổng lúc đầu: cộng $${P(a)}$ với $${P(b)}$.`, `Lấy $${k}$ chia cho $${P(e)}$ để tìm tổng lúc đầu.`, `Cộng thêm $${t}$ ${c.unit} mới để được tổng lúc này.`],
      chuY: `các phần trăm tính trên tổng lúc đầu, nên chỉ cộng số mới thêm vào ở bước cuối.`,
      dong: [`Hai bộ phận chiếm: $${P(a)}+${P(b)}=${P(e)}$ (${c.Wh} lúc đầu)`, `${c.Tt} lúc đầu là: $${k}:${P(e)}=${T}$ (${c.unit})`, `${c.Tt} lúc này là: $${T}+${t}=${T + t}$ (${c.unit})`], dapSo: `$${T + t}$ ${c.unit}`,
    })
    return mk(DANG.HT, 'ht_tong_roi_them', nd, `$${T + t}$ ${c.unit}`, lg)
  })
  return ds
}

// ── tổng hợp ────────────────────────────────────────────────────────────────────────────────────────────────────
/** daCo: mảng noi_dung các câu đã có trong DB của 7 dạng (để chống trùng). Hạt giống cố định ⇒ cùng daCo ⇒ cùng lô. */
export function sinh(daCo = []) {
  rnd = mulberry32(20261128); dung = new Set()
  for (const nd of daCo) { dung.add(chuan(nd)); const b = bt1(nd); if (b) dung.add(b) }
  const tat = [...sinh02767(), ...sinh02768(), ...sinh02769(), ...sinh02770(), ...sinh03000(), ...sinh03001(), ...sinh03553()]
  return tat
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────
async function docDB() {
  const require = createRequire('C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/package.json'); const pg = require('pg')
  const envp = 'C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/.env'; if (!existsSync(envp)) return []
  const env = readFileSync(envp, 'utf8'); const m = env.match(/^DATABASE_URL_RO=(.*)$/m) || env.match(/^DATABASE_URL=(.*)$/m); if (!m) return []
  const c = new pg.Client({ connectionString: m[1].trim().replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } })
  await c.connect()
  try {
    const r = await c.query(`select c.noi_dung from bdm_cau_dang d join dai_cau_hoi c on c.ma_cau=d.ma_cau where d.dang_bai_id = any($1) and c.xoa_at is null`, [Object.values(DANG)])
    return r.rows.map((x) => x.noi_dung)
  } finally { await c.end() }
}
if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-A.mjs')) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  let daCo = []; try { daCo = await docDB() } catch (e) { console.log('(không đọc được DB để chống trùng:', e.message, ')') }
  const cau = sinh(daCo)
  const dem = {}; for (const c of cau) { dem[c.dang] = dem[c.dang] || { cau: 0, mau: new Set() }; dem[c.dang].cau++; dem[c.dang].mau.add(c.mau) }
  console.log('Sinh', cau.length, 'câu (chống trùng với', daCo.length, 'câu đã có)')
  for (const [d, v] of Object.entries(dem)) console.log(' ', d, v.cau, 'câu', v.mau.size, 'mẫu:', [...v.mau].join(', '))
  const ra = lay('--ra')
  if (ra) { mkdirSync(dirname(ra), { recursive: true }); writeFileSync(ra, JSON.stringify(cau, null, 1)); console.log('→', ra) }
}
