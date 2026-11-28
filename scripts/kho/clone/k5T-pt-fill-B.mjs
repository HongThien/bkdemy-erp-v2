// ============================================================================
// k5T-pt-fill-B.mjs — SINH bù cho 5 dạng 5T chuyên đề "Tỉ số phần trăm" (nhóm Bán hàng + Thay đổi % của tích):
//   NDB02774 Giảm giá kép (27) · NDB02775 Doanh thu – chi phí (30) · NDB02776 Diện tích (26) · NDB03002 Năng suất – thời gian – số người (29)
//   · NDB03003 Thể tích hộp (30)   [mỗi dạng = số cần thêm + 2 dư]
//   node scripts/kho/clone/k5T-pt-fill-B.mjs --ra kho-rules/dai/clone/k5T-pt-fill-B.json
// Luật: M×a% · M:b% · nhân/chia hai tỉ số % viết thêm bước thập phân · mỗi câu lời văn = 1 câu lời giải + 1 phép tính · tiền là bội của 1000đ.
// Bộ KIỂM độc lập: k5T-pt-fill-B-kiem.mjs (không dùng chung hàm tính). Hạt giống cố định ⇒ chạy lại ra đúng lô.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export const DANG = { GG_KEP: 'NDB02774', DOANH_THU: 'NDB02775', DIEN_TICH: 'NDB02776', NANG_SUAT: 'NDB03002', THE_TICH: 'NDB03003' }

// ── tiện ích ────────────────────────────────────────────────────────────────────────────────────────────────────
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
let rnd = mulberry32(20261128)
const pick = (a) => a[Math.floor(rnd() * a.length)]
const cap = (s) => s[0].toUpperCase() + s.slice(1)
const nhom3 = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
class Q {
  constructor(n, d = 1) { if (d < 0) { n = -n; d = -d } const g = gcd(Math.abs(n), d) || 1; this.n = n / g; this.d = d / g }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new Q(this.n * o.n, this.d * o.d) }
  div(o) { return new Q(this.n * o.d, this.d * o.n) }
  cmp(o) { return this.n * o.d - o.n * this.d }
  get nguyen() { return this.d === 1 }
}
const q = (n, d = 1) => new Q(n, d)
const ONE = q(1), Q100 = q(100)
const SKIP = new Error('skip')
/** số thập phân dạng Việt (dấu phẩy); ném SKIP nếu cần quá md chữ số lẻ (số "xấu"). */
function dec(r, md = 4) {
  let k = 0
  while ((10 ** k) % r.d !== 0) { k++; if (k > md) throw SKIP }
  const v = Math.abs(r.n) * (10 ** k) / r.d
  const s = String(v).padStart(k + 1, '0')
  const ng = k ? s.slice(0, -k) : s, le = k ? s.slice(-k) : ''
  return (r.n < 0 ? '-' : '') + ng + (le ? ',' + le : '')
}
const pct = (r) => dec(r.mul(Q100), 2) + '\\%'
const ps = (r) => dec(r.mul(Q100), 2) + '%'                    // % trong ĐỀ (không LaTeX)
const dr = (r) => dec(r, 4)
const pcs = (x) => String(x).replace('.', ',')
const Pn = (x) => `${pcs(x)}\\%`
const rt = (s) => q(1000 + Math.round(s * 10), 1000)          // đổi % có dấu → tỉ số: +20 → 1,2
const sOf = (R) => Number(dec(R.sub(ONE).mul(Q100), 2).replace(',', '.'))   // tỉ số → % có dấu
const tien = (n) => `$${n}$ đồng`
const moneyOk = (r) => r.nguyen && r.n > 0 && r.n % 1000 === 0
const tg = (s) => (s > 0 ? pick(['tăng', 'tăng thêm']) : pick(['giảm', 'giảm đi', 'bớt']))   // động từ theo dấu
const tgG = (s) => (s > 0 ? 'tăng' : pick(['giảm', 'hạ']))   // động từ cho GIÁ
const vua = (r) => { if (r.cmp(q(13, 5)) > 0 || r.cmp(q(2, 5)) < 0) throw SKIP }   // tỉ số quá lệch (> 2,6 lần hoặc < 0,4) thì bỏ
const tg1 = (s) => (s > 0 ? 'tăng' : 'giảm')
const dau = (s) => (s > 0 ? '+' : '-')

function loiGiai({ matChot, buoc, chuY, dong, dapSo }) {
  return ['**Phần 1. Hướng dẫn**', `**Mấu chốt:** ${matChot}`, ...buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`), `**Chú ý:** ${chuY}`, '**Phần 2. Trình bày**', 'Bài giải', ...dong, `Đáp số: ${dapSo}`].join('\n\n')
}
/** dòng "X mới bằng: 100%±p% = R% (X cũ)" */
const lDoi = (ten, goc, s) => { const r = rt(s); return { r, ln: `${cap(ten)} mới bằng: $100\\%${dau(s)}${Pn(Math.abs(s))}=${pct(r)}$ (${ten} ${goc})` } }
/** dòng tích các tỉ số */
const lTich = (nhan, rs, ten, goc) => { let p = ONE; for (const r of rs) p = p.mul(r); return { r: p, ln: `${nhan}: $${rs.map(pct).join('\\times ')}=${rs.map(dr).join('\\times ')}=${dr(p)}=${pct(p)}$ (${ten} ${goc})` } }
/** dòng thương hai tỉ số */
const lThuong = (nhan, a, b, ten, goc) => { const r = a.div(b); return { r, ln: `${nhan}: $${pct(a)}:${pct(b)}=${dr(a)}:${dr(b)}=${dr(r)}=${pct(r)}$ (${ten} ${goc})` } }
const lKetLuan = (ten, R) => {
  const c = R.cmp(ONE); if (c === 0) throw SKIP
  if (c > 0) { const x = R.sub(ONE); return { ln: `${cap(ten)} tăng: $${pct(R)}-100\\%=${pct(x)}$`, dap: `Tăng $${pct(x)}$`, x } }
  const x = ONE.sub(R); return { ln: `${cap(ten)} giảm đi: $100\\%-${pct(R)}=${pct(x)}$`, dap: `Giảm $${pct(x)}$`, x }
}

const dung = new Set(), dungTS = new Set()
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '')
/** chạy gen() tới khi đủ n câu; gen ném SKIP khi tham số không đẹp. */
function lap(dang, mau, n, gen, out) {
  let got = 0, vong = 0
  while (got < n) {
    if (++vong > 20000) throw new Error(`hết tổ hợp: ${mau} (${got}/${n})`)
    let c; try { c = gen() } catch (e) { if (e === SKIP) continue; throw e }
    const k = chuan(c.noi_dung), ts = mau + '|' + c.ts
    if (dung.has(k) || dungTS.has(ts)) continue
    dung.add(k); dungTS.add(ts)
    out.push({ dang, mau, loai_cau: 'tra_loi_ngan', noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai }); got++
  }
}

// ── dữ liệu bối cảnh ────────────────────────────────────────────────────────────────────────────────────────────
const ITEMS = [
  { ten: 'chiếc áo khoác', gia: [200, 240, 250, 300, 400, 500, 600] }, { ten: 'đôi giày thể thao', gia: [300, 400, 450, 500, 600, 800] },
  { ten: 'chiếc cặp sách', gia: [200, 250, 300, 400, 500, 600] }, { ten: 'chiếc đồng hồ đeo tay', gia: [500, 600, 800, 1000, 1200, 2000] },
  { ten: 'chiếc xe đạp', gia: [1500, 2000, 2500, 3000, 4000] }, { ten: 'chiếc quạt điện', gia: [300, 400, 500, 600, 800] },
  { ten: 'chiếc bàn học', gia: [400, 500, 600, 800, 1000, 1200] }, { ten: 'chiếc máy tính bảng', gia: [2000, 3000, 4000, 5000, 6000] },
  { ten: 'chiếc ti vi', gia: [5000, 6000, 8000, 10000, 12000] }, { ten: 'chiếc tủ lạnh', gia: [8000, 10000, 12000, 15000, 20000] },
  { ten: 'chiếc ba lô du lịch', gia: [250, 400, 500, 600, 800] }, { ten: 'chiếc váy', gia: [200, 300, 400, 500, 600] },
  { ten: 'chiếc nồi cơm điện', gia: [400, 500, 600, 800, 1000] }, { ten: 'chiếc loa bluetooth', gia: [300, 400, 500, 800, 1000, 1500] },
]
const SHOP = ['cửa hàng quần áo', 'siêu thị điện máy', 'cửa hàng giày dép', 'nhà sách', 'cửa hàng đồ gia dụng', 'cửa hàng thể thao', 'cửa hàng đồ chơi', 'đại lý bán lẻ']
const DIP1 = ['Nhân dịp khai trương', 'Trong tuần lễ tri ân khách hàng', 'Nhân dịp cuối năm', 'Nhân ngày Quốc tế Phụ nữ', 'Vào dịp khuyến mãi mùa hè', 'Nhân dịp sinh nhật cửa hàng']
const DIP2 = ['Sau một tuần', 'Sang tuần sau', 'Hôm sau', 'Đến cuối tháng', 'Đến sát Tết']
const GIAM = [10, 15, 20, 25, 30, 40, 50]
const SP = [
  { sp: 'ly trà sữa', dv: 'ly', g: [20, 25, 30, 35, 40, 45, 50] }, { sp: 'chiếc bánh kem nhỏ', dv: 'chiếc', g: [40, 50, 60, 80, 100] },
  { sp: 'cuốn truyện tranh', dv: 'cuốn', g: [20, 25, 30, 40, 50, 60] }, { sp: 'hộp bút màu', dv: 'hộp', g: [20, 30, 40, 50, 60, 80] },
  { sp: 'vé xem phim', dv: 'vé', g: [40, 50, 60, 80, 100] }, { sp: 'suất cơm trưa', dv: 'suất', g: [25, 30, 35, 40, 50] },
  { sp: 'chiếc bánh mì', dv: 'chiếc', g: [15, 20, 25, 30] }, { sp: 'chai nước ép', dv: 'chai', g: [20, 25, 30, 40, 50] },
]
const VAT_HCN = ['mảnh vườn', 'tấm bìa', 'sân trường', 'tờ giấy', 'mặt bàn', 'tấm vải', 'bức tranh', 'miếng đất', 'tấm gỗ', 'màn hình ti vi']
const HOP = [
  { hop: 'hộp quà', u: 'cm', v: [200, 240, 300, 360, 400, 500, 600] }, { hop: 'hộp bánh', u: 'cm', v: [240, 300, 360, 400, 500, 800] },
  { hop: 'bể cá', u: 'dm', v: [100, 120, 150, 200, 240, 300] }, { hop: 'thùng xốp', u: 'dm', v: [80, 100, 120, 160, 200, 250] },
  { hop: 'bể nước', u: 'm', v: [20, 24, 30, 40, 50, 60] }, { hop: 'thùng đựng hàng', u: 'dm', v: [150, 200, 250, 300, 400, 500] },
]
const DOI = [
  { doi: 'đội công nhân', viec: 'hoàn thành một công trình' }, { doi: 'nhóm thợ xây', viec: 'xây xong một bức tường' },
  { doi: 'đội thợ may', viec: 'may xong một lô quần áo' }, { doi: 'đội thợ gặt', viec: 'gặt xong một thửa ruộng' },
  { doi: 'tổ sản xuất', viec: 'làm xong một đơn hàng' }, { doi: 'nhóm thợ sơn', viec: 'sơn xong một toà nhà' },
]
const TD = { tang: [5, 10, 15, 20, 25, 30, 40, 50, 60], giam: [5, 10, 15, 20, 25, 30, 40, 50] }
const sgn = () => { const s = pick([1, -1]); return s * pick(s > 0 ? TD.tang : TD.giam) }

// ============================================================================
// A. NDB02774 — GIẢM GIÁ KÉP (27)
// ============================================================================
function sinhGiamGiaKep(out) {
  const D = DANG.GG_KEP
  const chon = () => { const it = pick(ITEMS); return { it, G: pick(it.gia) * 1000 } }
  // a1: tìm giá cuối, giải bằng nhân hai tỉ số
  lap(D, 'gk_a1', 4, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b), pr = r1.mul(r2), F = q(G).mul(pr); if (!moneyOk(F)) throw SKIP
    const sh = pick(SHOP), d1 = pick(DIP1), d2 = pick(DIP2)
    const nd = pick([
      `Một ${sh} niêm yết giá ${it.ten} là ${nhom3(G)} đồng. ${d1}, cửa hàng giảm giá ${a}%. ${d2}, hàng vẫn còn nhiều nên cửa hàng giảm tiếp ${b}% so với giá đang bán. Hỏi sau hai lần giảm giá, ${it.ten} có giá bao nhiêu tiền?`,
      `${cap(it.ten)} có giá ${nhom3(G)} đồng. Cửa hàng giảm giá lần thứ nhất ${a}%, sau đó giảm giá lần thứ hai ${b}% so với giá đã giảm lần thứ nhất. Hỏi giá ${it.ten} sau hai lần giảm là bao nhiêu tiền?`,
      `Một ${it.ten} có giá niêm yết ${nhom3(G)} đồng. Cửa hàng giảm giá ${a}%, sau đó giảm thêm ${b}% trên giá đã giảm cho khách có thẻ thành viên. Mẹ Lan có thẻ thành viên thì phải trả bao nhiêu tiền để mua ${it.ten} đó?`,
    ])
    const lg = loiGiai({
      matChot: `Lần giảm thứ hai tính trên **giá đã giảm ở lần thứ nhất**, nên không thể cộng $${a}\\%+${b}\\%$. Mỗi lần giảm, giá còn lại bằng $100\\%$ trừ đi phần trăm giảm; hai lần giảm thì **nhân hai tỉ số phần trăm còn lại** rồi lấy giá ban đầu nhân với kết quả.`,
      buoc: [
        `Sau lần giảm thứ nhất, giá còn lại bằng $100\\%-${a}\\%$ của giá niêm yết ban đầu.`,
        `Lần giảm thứ hai tính trên giá mới, nên giá còn lại bằng $100\\%-${b}\\%$ của giá sau lần giảm thứ nhất.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân rồi nhân) để biết giá sau hai lần giảm bằng bao nhiêu phần trăm giá ban đầu.`,
        `Lấy giá ban đầu nhân với số phần trăm vừa tìm được để ra giá sau hai lần giảm.`,
      ],
      chuY: `giảm $${a}\\%$ rồi giảm $${b}\\%$ không bằng giảm một lần $${a + b}\\%$, vì hai lần giảm có hai giá gốc khác nhau.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá niêm yết)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        lTich('Giá sau hai lần giảm bằng', [r1, r2], 'giá', 'niêm yết').ln,
        `Giá ${it.ten} sau hai lần giảm là: $${G}\\times ${pct(pr)}=${F.n}$ (đồng)`,
      ],
      dapSo: tien(F.n),
    })
    return { noi_dung: nd, dap_an: tien(F.n), loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // a2: tìm giá cuối, từng bước bằng tiền
  lap(D, 'gk_a2', 3, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM)
    const g1 = q(G).mul(q(a, 100)), X = q(G).sub(g1), g2 = X.mul(q(b, 100)), F = X.sub(g2)
    if (![g1, X, g2, F].every(moneyOk)) throw SKIP
    const sh = pick(SHOP)
    const nd = pick([
      `Một ${sh} định bán ${it.ten} với giá ${nhom3(G)} đồng. Để thu hút khách hàng, cửa hàng giảm giá hai lần liên tiếp: lần đầu giảm ${a}%, lần sau giảm ${b}% so với giá bán trước đó. Hỏi sau hai lần giảm giá thì ${it.ten} có giá bao nhiêu tiền?`,
      `${cap(it.ten)} ở một ${sh} có giá ${nhom3(G)} đồng. Vì ế hàng nên cửa hàng giảm giá ${a}%, vẫn chưa bán được nên giảm tiếp ${b}% so với giá đã giảm. Hỏi giá cuối cùng của ${it.ten} là bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Mỗi lần giảm giá đều tính **trên giá bán ngay trước lần đó**: lần hai tính trên giá đã giảm ở lần một, không tính trên $${G}$ đồng.`,
      buoc: [
        `Lần giảm thứ nhất: tìm $${a}\\%$ của giá ban đầu, đó là số tiền giảm đi.`,
        `Lấy giá ban đầu trừ số tiền giảm đi để được giá sau lần giảm thứ nhất.`,
        `Lần giảm thứ hai: lấy giá mới làm gốc, tìm $${b}\\%$ của nó là số tiền giảm đi.`,
        `Trừ số tiền giảm đi ở lần hai khỏi giá sau lần một để được giá cuối cùng.`,
      ],
      chuY: `không tính $${b}\\%$ của giá ban đầu ở lần giảm thứ hai.`,
      dong: [
        `Lần giảm giá thứ nhất, giá ${it.ten} giảm đi: $${G}\\times ${Pn(a)}=${g1.n}$ (đồng)`,
        `Giá ${it.ten} sau lần giảm thứ nhất là: $${G}-${g1.n}=${X.n}$ (đồng)`,
        `Lần giảm giá thứ hai, giá ${it.ten} giảm đi: $${X.n}\\times ${Pn(b)}=${g2.n}$ (đồng)`,
        `Giá ${it.ten} sau hai lần giảm là: $${X.n}-${g2.n}=${F.n}$ (đồng)`,
      ],
      dapSo: tien(F.n),
    })
    return { noi_dung: nd, dap_an: tien(F.n), loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // b1: biết giá cuối → giá ban đầu (nhân hai tỉ số rồi chia)
  lap(D, 'gk_b1', 3, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b), pr = r1.mul(r2), F = q(G).mul(pr); if (!moneyOk(F)) throw SKIP
    const sh = pick(SHOP), d1 = pick(DIP1)
    const nd = pick([
      `${d1}, một ${sh} giảm giá ${it.ten} ${a}%. Ngày hôm sau, cửa hàng giảm thêm ${b}% giá đang bán nên giá ${it.ten} chỉ còn ${nhom3(F.n)} đồng. Hỏi trước khi giảm giá thì ${it.ten} có giá bao nhiêu tiền?`,
      `Một ${sh} giảm giá ${it.ten} hai lần liên tiếp: lần đầu giảm ${a}%, lần sau giảm ${b}% so với giá đang bán. Sau hai lần giảm, giá còn ${nhom3(F.n)} đồng. Hỏi giá ban đầu của ${it.ten} là bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Hai lần giảm cho giá sau cùng bằng **tích hai tỉ số còn lại** của giá ban đầu. Đề cho giá sau cùng, nên tìm số phần trăm đó rồi **lấy giá sau cùng chia cho nó** để ra giá ban đầu.`,
      buoc: [
        `Tìm giá sau lần giảm thứ nhất và sau lần thứ hai bằng bao nhiêu phần trăm giá trước đó (lấy $100\\%$ trừ phần trăm giảm).`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân) để biết giá sau hai lần giảm bằng bao nhiêu phần trăm giá ban đầu.`,
        `Đề cho giá sau hai lần giảm là ${nhom3(F.n)} đồng, đó chính là $${pct(pr)}$ của giá ban đầu.`,
        `Muốn tìm một số khi biết một phần trăm của nó, ta lấy số đã biết chia cho phần trăm đó.`,
      ],
      chuY: `không lấy ${nhom3(F.n)} đồng cộng thêm $${a}\\%+${b}\\%$ của nó, vì các phần trăm giảm không tính trên giá còn lại.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá ban đầu)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        lTich('Giá sau hai lần giảm bằng', [r1, r2], 'giá', 'ban đầu').ln,
        `Giá ${it.ten} ban đầu là: $${F.n}:${pct(pr)}=${G}$ (đồng)`,
      ],
      dapSo: tien(G),
    })
    return { noi_dung: nd, dap_an: tien(G), loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // b2: biết giá cuối → giá ban đầu, tính ngược từng lần
  lap(D, 'gk_b2', 3, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b)
    const X = q(G).mul(r1), F = X.mul(r2); if (!moneyOk(X) || !moneyOk(F)) throw SKIP
    const sh = pick(SHOP)
    const nd = pick([
      `Một ${sh} giảm giá ${it.ten} ${a}% để nhập hàng mới. Sau một tuần vẫn còn hàng tồn nên cửa hàng giảm tiếp ${b}% so với giá trước đó và bán được với giá ${nhom3(F.n)} đồng. Hỏi ban đầu giá ${it.ten} là bao nhiêu tiền?`,
      `${cap(it.ten)} bị giảm giá ${a}%, rồi lại giảm tiếp ${b}% so với giá vừa giảm, và hiện bán với giá ${nhom3(F.n)} đồng. Hỏi lúc chưa giảm giá, ${it.ten} có giá bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Đi **ngược từng lần giảm**: giá sau lần hai bằng $${pct(r2)}$ giá sau lần một, nên chia để tìm giá sau lần một; rồi giá sau lần một bằng $${pct(r1)}$ giá ban đầu, nên chia tiếp để tìm giá ban đầu.`,
      buoc: [
        `Sau lần giảm thứ hai, giá còn $100\\%-${b}\\%$ của giá sau lần giảm thứ nhất.`,
        `Lấy giá cuối cùng chia cho tỉ số phần trăm đó để được giá sau lần giảm thứ nhất.`,
        `Sau lần giảm thứ nhất, giá còn $100\\%-${a}\\%$ của giá ban đầu.`,
        `Lấy giá sau lần giảm thứ nhất chia cho tỉ số phần trăm này để được giá ban đầu.`,
      ],
      chuY: `mỗi phép chia dùng đúng giá gốc của lần giảm đó; không chia giá cuối cho $${pct(r1)}$ ngay.`,
      dong: [
        `Sau lần giảm giá thứ hai, giá còn: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        `Giá ${it.ten} sau lần giảm thứ nhất là: $${F.n}:${pct(r2)}=${X.n}$ (đồng)`,
        `Sau lần giảm giá thứ nhất, giá còn: $100\\%-${Pn(a)}=${pct(r1)}$ (giá ban đầu)`,
        `Giá ${it.ten} ban đầu là: $${X.n}:${pct(r1)}=${G}$ (đồng)`,
      ],
      dapSo: tien(G),
    })
    return { noi_dung: nd, dap_an: tien(G), loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // c_con: giá còn lại bằng bao nhiêu % giá ban đầu
  lap(D, 'gk_c_con', 2, () => {
    const a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b), pr = r1.mul(r2); dr(pr); pct(pr)
    const nd = pick([
      `Một cửa hàng giảm giá một mặt hàng ${a}%, sau đó giảm tiếp ${b}% so với giá đã giảm. Hỏi sau hai lần giảm, giá của mặt hàng đó bằng bao nhiêu phần trăm giá ban đầu?`,
      `Giá một món hàng được giảm hai lần liên tiếp: lần một giảm ${a}%, lần hai giảm ${b}% so với giá đang bán. Hỏi giá cuối cùng bằng bao nhiêu phần trăm giá lúc đầu?`,
    ])
    const lg = loiGiai({
      matChot: `Không cần biết giá tiền: coi giá ban đầu là $100\\%$, mỗi lần giảm thì nhân với tỉ số còn lại. Hai lần giảm cho giá cuối bằng **tích hai tỉ số còn lại**.`,
      buoc: [
        `Coi giá ban đầu là $100\\%$; sau lần giảm thứ nhất, giá còn $100\\%-${a}\\%$.`,
        `Sau lần giảm thứ hai, giá còn $100\\%-${b}\\%$ của giá sau lần giảm thứ nhất.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân rồi nhân) được giá cuối bằng bao nhiêu phần trăm giá ban đầu.`,
      ],
      chuY: `đáp số là phần trăm giá còn lại, không phải phần trăm đã giảm.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá ban đầu)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        lTich('Giá sau hai lần giảm bằng', [r1, r2], 'giá', 'ban đầu').ln,
      ],
      dapSo: `$${pct(pr)}$`,
    })
    return { noi_dung: nd, dap_an: `$${pct(pr)}$`, loi_giai: lg, ts: `${a}|${b}` }
  }, out)
  // c_giam: hai lần giảm tương đương một lần giảm bao nhiêu %
  lap(D, 'gk_c_giam', 3, () => {
    const a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b), pr = r1.mul(r2), x = ONE.sub(pr); dr(pr); pct(x)
    const nd = pick([
      `Một cửa hàng giảm giá một mặt hàng hai lần liên tiếp: lần đầu giảm ${a}%, lần sau giảm ${b}% so với giá đang bán. Hỏi hai lần giảm đó tương đương với một lần giảm bao nhiêu phần trăm so với giá ban đầu?`,
      `Giá một chiếc áo được giảm ${a}%, rồi giảm tiếp ${b}% so với giá đã giảm. Hỏi sau hai lần giảm, chiếc áo đã giảm tổng cộng bao nhiêu phần trăm so với giá ban đầu?`,
    ])
    const lg = loiGiai({
      matChot: `Hai lần giảm **không cộng** phần trăm vì có hai giá gốc khác nhau. Coi giá ban đầu là $100\\%$, tìm giá sau hai lần giảm bằng cách nhân hai tỉ số còn lại, rồi lấy $100\\%$ trừ đi.`,
      buoc: [
        `Coi giá ban đầu là $100\\%$; sau lần giảm thứ nhất giá còn $100\\%-${a}\\%$.`,
        `Sau lần giảm thứ hai, giá còn $100\\%-${b}\\%$ của giá sau lần giảm thứ nhất.`,
        `Nhân hai tỉ số phần trăm để biết giá sau hai lần giảm bằng bao nhiêu phần trăm giá ban đầu.`,
        `Lấy $100\\%$ trừ tỉ số vừa tìm được để biết giá đã giảm tổng cộng bao nhiêu phần trăm.`,
      ],
      chuY: `đáp số không phải $${a}\\%+${b}\\%=${a + b}\\%$.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá ban đầu)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        lTich('Giá sau hai lần giảm bằng', [r1, r2], 'giá', 'ban đầu').ln,
        `Hai lần giảm tương đương một lần giảm: $100\\%-${pct(pr)}=${pct(x)}$ (giá ban đầu)`,
      ],
      dapSo: `$${pct(x)}$`,
    })
    return { noi_dung: nd, dap_an: `$${pct(x)}$`, loi_giai: lg, ts: `${a}|${b}` }
  }, out)
  // d: tổng số tiền được giảm
  lap(D, 'gk_d', 2, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b), pr = r1.mul(r2), F = q(G).mul(pr); if (!moneyOk(F)) throw SKIP
    const tong = G - F.n, sh = pick(SHOP)
    const nd = pick([
      `Một ${sh} niêm yết giá ${it.ten} là ${nhom3(G)} đồng. Cửa hàng giảm giá ${a}%, sau đó giảm thêm ${b}% so với giá đã giảm. Hỏi sau hai lần giảm, ${it.ten} rẻ hơn lúc đầu bao nhiêu tiền?`,
      `${cap(it.ten)} có giá ${nhom3(G)} đồng. Cửa hàng giảm giá hai lần liên tiếp: lần một giảm ${a}%, lần hai giảm ${b}% so với giá đang bán. Hỏi tổng số tiền được giảm sau hai lần là bao nhiêu?`,
    ])
    const lg = loiGiai({
      matChot: `Số tiền được giảm cả hai lần bằng **giá ban đầu trừ giá cuối cùng**. Tìm giá cuối bằng cách nhân hai tỉ số còn lại, rồi lấy hiệu.`,
      buoc: [
        `Tìm mỗi lần giảm, giá còn bằng bao nhiêu phần trăm giá trước đó.`,
        `Nhân hai tỉ số phần trăm để biết giá cuối bằng bao nhiêu phần trăm giá ban đầu.`,
        `Lấy giá ban đầu nhân với tỉ số vừa tìm được để ra giá cuối cùng.`,
        `Lấy giá ban đầu trừ giá cuối cùng để biết tổng số tiền được giảm.`,
      ],
      chuY: `không tính tổng tiền giảm bằng $${a + b}\\%$ của giá ban đầu.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá ban đầu)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        lTich('Giá sau hai lần giảm bằng', [r1, r2], 'giá', 'ban đầu').ln,
        `Giá ${it.ten} sau hai lần giảm là: $${G}\\times ${pct(pr)}=${F.n}$ (đồng)`,
        `Số tiền được giảm là: $${G}-${F.n}=${tong}$ (đồng)`,
      ],
      dapSo: tien(tong),
    })
    return { noi_dung: nd, dap_an: tien(tong), loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // e: tìm tỉ lệ giảm lần hai
  lap(D, 'gk_e', 3, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), r1 = rt(-a), r2 = rt(-b)
    const X = q(G).mul(r1), F = X.mul(r2); if (!moneyOk(X) || !moneyOk(F)) throw SKIP
    const sh = pick(SHOP)
    const nd = pick([
      `Một ${sh} niêm yết giá ${it.ten} là ${nhom3(G)} đồng. Cửa hàng giảm giá lần thứ nhất ${a}%, rồi giảm tiếp lần thứ hai nên giá chỉ còn ${nhom3(F.n)} đồng. Hỏi lần giảm thứ hai là giảm bao nhiêu phần trăm so với giá sau lần giảm thứ nhất?`,
      `${cap(it.ten)} có giá ${nhom3(G)} đồng. Sau khi giảm giá ${a}%, cửa hàng giảm thêm một lần nữa và bán với giá ${nhom3(F.n)} đồng. Hỏi lần giảm sau là giảm bao nhiêu phần trăm so với giá đang bán trước đó?`,
    ])
    const lg = loiGiai({
      matChot: `Lần giảm thứ hai tính trên **giá sau lần giảm thứ nhất**, nên phải tìm giá đó bằng tiền trước. Sau đó so giá cuối với giá này để biết giá cuối bằng bao nhiêu phần trăm, rồi lấy $100\\%$ trừ đi.`,
      buoc: [
        `Giá sau lần giảm thứ nhất bằng $100\\%-${a}\\%$ giá niêm yết; lấy giá niêm yết nhân với tỉ số đó.`,
        `Lấy giá cuối cùng chia cho giá sau lần giảm thứ nhất để biết giá cuối bằng bao nhiêu phần trăm giá này.`,
        `Lấy $100\\%$ trừ tỉ số vừa tìm được để biết lần giảm thứ hai là bao nhiêu phần trăm.`,
      ],
      chuY: `không so giá cuối với giá niêm yết ban đầu, vì lần giảm thứ hai tính trên giá sau lần thứ nhất.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá niêm yết)`,
        `Giá ${it.ten} sau lần giảm thứ nhất là: $${G}\\times ${pct(r1)}=${X.n}$ (đồng)`,
        `Giá sau lần giảm thứ hai bằng: $${F.n}:${X.n}=${dr(r2)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        `Lần giảm giá thứ hai là: $100\\%-${pct(r2)}=${Pn(b)}$ (giá sau lần giảm thứ nhất)`,
      ],
      dapSo: `$${Pn(b)}$`,
    })
    return { noi_dung: nd, dap_an: `$${Pn(b)}$`, loi_giai: lg, ts: `${G}|${a}|${b}` }
  }, out)
  // h: giảm ba lần
  lap(D, 'gk_h', 4, () => {
    const { it, G } = chon(), a = pick(GIAM), b = pick(GIAM), c = pick(GIAM), r1 = rt(-a), r2 = rt(-b), r3 = rt(-c)
    const pr = r1.mul(r2).mul(r3), F = q(G).mul(pr); if (!moneyOk(F)) throw SKIP; dr(pr)
    const sh = pick(SHOP)
    const nd = pick([
      `Một ${sh} bán ${it.ten} với giá niêm yết ${nhom3(G)} đồng. Vì ế hàng nên cửa hàng giảm giá ba lần liên tiếp: lần một giảm ${a}%, lần hai giảm ${b}% so với giá sau lần một, lần ba giảm ${c}% so với giá sau lần hai. Hỏi sau ba lần giảm, giá ${it.ten} là bao nhiêu tiền?`,
      `${cap(it.ten)} giá ${nhom3(G)} đồng được giảm giá ba đợt: đợt đầu giảm ${a}%, đợt hai giảm ${b}% so với giá đang bán, đợt ba giảm ${c}% so với giá đang bán. Hỏi giá cuối cùng của ${it.ten} là bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Mỗi lần giảm giá cho một tỉ số còn lại tính trên **giá ngay trước đó**; ba lần giảm thì giá cuối bằng **tích ba tỉ số** nhân với giá ban đầu, không cộng dồn các phần trăm giảm.`,
      buoc: [
        `Với mỗi lần giảm, giá còn lại bằng $100\\%$ trừ đi phần trăm giảm của lần đó.`,
        `Nhân lần lượt ba tỉ số phần trăm (đổi ra số thập phân) để biết giá cuối bằng bao nhiêu phần trăm giá ban đầu.`,
        `Lấy giá ban đầu nhân với số phần trăm vừa tìm được để ra giá sau ba lần giảm.`,
      ],
      chuY: `không lấy $100\\%-(${a}\\%+${b}\\%+${c}\\%)$ vì ba lần giảm có ba giá gốc khác nhau.`,
      dong: [
        `Sau lần giảm giá thứ nhất, giá bằng: $100\\%-${Pn(a)}=${pct(r1)}$ (giá niêm yết)`,
        `Sau lần giảm giá thứ hai, giá bằng: $100\\%-${Pn(b)}=${pct(r2)}$ (giá sau lần giảm thứ nhất)`,
        `Sau lần giảm giá thứ ba, giá bằng: $100\\%-${Pn(c)}=${pct(r3)}$ (giá sau lần giảm thứ hai)`,
        lTich('Giá sau ba lần giảm bằng', [r1, r2, r3], 'giá', 'niêm yết').ln,
        `Giá ${it.ten} sau ba lần giảm là: $${G}\\times ${pct(pr)}=${F.n}$ (đồng)`,
      ],
      dapSo: tien(F.n),
    })
    return { noi_dung: nd, dap_an: tien(F.n), loi_giai: lg, ts: `${G}|${a}|${b}|${c}` }
  }, out)
}

// ============================================================================
// B. NDB02775 — DOANH THU – CHI PHÍ (30)
// ============================================================================
function sinhDoanhThu(out) {
  const D = DANG.DOANH_THU
  // a: giá ±, số lượng ± → doanh thu
  lap(D, 'dt_a', 5, () => {
    const s = pick(SP), a = sgn(), b = sgn()
    const p = lDoi('giá bán', 'cũ', a), n = lDoi('số lượng bán', 'cũ', b), t = lTich('Doanh thu mới bằng', [p.r, n.r], 'doanh thu', 'cũ'), k = lKetLuan('doanh thu', t.r)
    const nd = pick([
      `Một cửa hàng bán ${s.sp}. Tuần này cửa hàng ${tgG(a)} giá bán ${Math.abs(a)}% so với tuần trước, nhưng số ${s.dv} bán được ${tg(b)} ${Math.abs(b)}%. Hỏi doanh thu của tuần này tăng hay giảm bao nhiêu phần trăm so với tuần trước?`,
      `Sau khi điều chỉnh, giá mỗi ${s.sp} ${tg(a)} ${Math.abs(a)}% còn số ${s.dv} bán ra mỗi ngày ${tg(b)} ${Math.abs(b)}% so với trước. Hỏi doanh thu mỗi ngày tăng hay giảm bao nhiêu phần trăm?`,
      `Một quán bán ${s.sp}. Vào dịp lễ, quán ${tgG(a)} giá bán ${Math.abs(a)}% và số ${s.dv} bán được ${tg(b)} ${Math.abs(b)}% so với ngày thường. Hỏi doanh thu của quán trong dịp lễ thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá bán $\\times$ số lượng bán. Hai đại lượng cùng thay đổi nên doanh thu mới bằng **tích hai tỉ số phần trăm** so với lúc đầu; coi mỗi đại lượng lúc đầu là $100\\%$, không cộng trừ thẳng các phần trăm.`,
      buoc: [
        `Tìm giá bán mới bằng bao nhiêu phần trăm giá bán cũ (tăng thì cộng vào $100\\%$, giảm thì trừ đi).`,
        `Tìm số lượng bán mới bằng bao nhiêu phần trăm số lượng bán cũ.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân rồi nhân) được doanh thu mới bằng bao nhiêu phần trăm doanh thu cũ.`,
        `So với $100\\%$ để biết doanh thu tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `không cộng trừ thẳng $${Math.abs(a)}\\%$ với $${Math.abs(b)}\\%$ để kết luận về doanh thu.`,
      dong: [p.ln, n.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${s.sp}|${a}|${b}` }
  }, out)
  // b: giá ±, doanh thu ± → số lượng
  lap(D, 'dt_b', 4, () => {
    const s = pick(SP), a = sgn(), r = sgn()
    const P = rt(a), R = rt(r), N = R.div(P); dr(N); pct(N); vua(N); if (N.cmp(ONE) === 0) throw SKIP
    const dtl = lDoi('doanh thu', 'cũ', r), gl = lDoi('giá bán', 'cũ', a), nl = lThuong('Số lượng bán mới bằng', R, P, 'số lượng', 'cũ'), k = lKetLuan('số lượng bán', N)
    const nd = pick([
      `Sau khi ${tgG(a)} giá bán ${s.sp} ${Math.abs(a)}% thì doanh thu của cửa hàng ${tg(r)} ${Math.abs(r)}% so với trước. Hỏi số ${s.dv} bán được tăng hay giảm bao nhiêu phần trăm?`,
      `Một quán ${tgG(a)} giá mỗi ${s.sp} ${Math.abs(a)}%, nhờ vậy doanh thu ${tg(r)} ${Math.abs(r)}% so với tuần trước. Hỏi số ${s.sp} bán ra thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá bán $\\times$ số lượng, nên số lượng $=$ doanh thu $:$ giá bán. Muốn biết số lượng mới bằng bao nhiêu phần trăm số lượng cũ thì lấy **phần trăm doanh thu chia cho phần trăm giá bán** (cùng so với lúc đầu).`,
      buoc: [
        `Tìm doanh thu mới bằng bao nhiêu phần trăm doanh thu cũ (coi doanh thu cũ là $100\\%$).`,
        `Tìm giá bán mới bằng bao nhiêu phần trăm giá bán cũ.`,
        `Lấy phần trăm doanh thu chia cho phần trăm giá bán (đổi ra số thập phân) để được số lượng mới bằng bao nhiêu phần trăm số lượng cũ.`,
        `So với $100\\%$ để biết số lượng tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `không lấy hiệu hay tổng của $${Math.abs(r)}\\%$ và $${Math.abs(a)}\\%$ rồi kết luận ngay, vì doanh thu là tích của giá và số lượng.`,
      dong: [dtl.ln, gl.ln, nl.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${s.sp}|${a}|${r}` }
  }, out)
  // c: biết giá cũ (tiền), số lượng ±, doanh thu ± → giá mới
  lap(D, 'dt_c', 4, () => {
    const s = pick(SP), G = pick(s.g) * 1000, bq = sgn(), r = sgn()
    const Nq = rt(bq), R = rt(r), P = R.div(Nq), Gm = q(G).mul(P); dr(P); vua(P); if (!moneyOk(Gm) || P.cmp(ONE) === 0) throw SKIP
    const nd = pick([
      `Giá mỗi ${s.sp} là ${nhom3(G)} đồng. Sau khi thay đổi giá bán, số ${s.dv} bán được ${tg(bq)} ${Math.abs(bq)}% nên doanh thu ${tg(r)} ${Math.abs(r)}%. Hỏi giá mỗi ${s.sp} sau khi thay đổi là bao nhiêu tiền?`,
      `Một cửa hàng bán ${s.sp} với giá ${nhom3(G)} đồng mỗi ${s.dv}. Sau khi điều chỉnh giá, số ${s.dv} bán ra ${tg(bq)} ${Math.abs(bq)}% và doanh thu ${tg(r)} ${Math.abs(r)}% so với trước. Hỏi giá bán mới của mỗi ${s.dv} là bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá bán $\\times$ số lượng, nên giá bán $=$ doanh thu $:$ số lượng. Giá mới bằng **phần trăm doanh thu chia cho phần trăm số lượng** (so với lúc đầu), rồi nhân với giá cũ.`,
      buoc: [
        `Tìm doanh thu mới bằng bao nhiêu phần trăm doanh thu lúc đầu.`,
        `Tìm số lượng bán mới bằng bao nhiêu phần trăm số lượng lúc đầu.`,
        `Lấy phần trăm doanh thu chia cho phần trăm số lượng để biết giá mới bằng bao nhiêu phần trăm giá cũ.`,
        `Lấy giá cũ nhân với số phần trăm vừa tìm được để ra giá mới.`,
      ],
      chuY: `phải so từng đại lượng với lúc đầu ($${pct(R)}$ và $${pct(Nq)}$) rồi mới chia, không lấy hiệu hai phần trăm thay đổi.`,
      dong: [lDoi('doanh thu', 'cũ', r).ln, lDoi('số lượng bán', 'cũ', bq).ln, lThuong('Giá bán mới bằng', R, Nq, 'giá bán', 'cũ').ln, `Giá bán mới của mỗi ${s.dv} là: $${G}\\times ${pct(P)}=${Gm.n}$ (đồng)`],
      dapSo: tien(Gm.n),
    })
    return { noi_dung: nd, dap_an: tien(Gm.n), loi_giai: lg, ts: `${s.sp}|${G}|${bq}|${r}` }
  }, out)
  // d1 / d2: so sánh hai nơi
  const ten2 = () => pick([['phim A', 'phim B', 'vé'], ['cửa hàng A', 'cửa hàng B', 'sản phẩm'], ['quán A', 'quán B', 'ly nước'], ['rạp A', 'rạp B', 'vé']])
  lap(D, 'dt_d1', 3, () => {
    const [A, B, dv] = ten2(), x = pick([84, 90, 108, 115, 120, 126, 132, 136, 140, 150]), y = pick([50, 80, 125, 160, 200, 250])
    const rx = q(x, 100), ry = q(y, 100), pa = ONE.div(ry), N = rx.div(pa); dr(pa); dr(N); if (N.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan('x', N), hh = N.cmp(ONE) > 0 ? 'Nhiều hơn' : 'Ít hơn', dap = `${hh} $${pct(k.x)}$`
    const nd = pick([
      `Sau một tuần, doanh thu của ${A} bằng ${x}% doanh thu của ${B} mặc dù giá mỗi ${dv} của ${B} bằng ${y}% giá mỗi ${dv} của ${A}. Hỏi số ${dv} bán được của ${A} nhiều hơn hay ít hơn bao nhiêu phần trăm số ${dv} bán được của ${B}?`,
      `Tháng trước, doanh thu của ${A} bằng ${x}% doanh thu của ${B}, còn giá mỗi ${dv} của ${B} bằng ${y}% giá của ${A}. Hỏi số ${dv} bán ra của ${A} nhiều hơn hay ít hơn số ${dv} bán ra của ${B} bao nhiêu phần trăm?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá $\\times$ số lượng. Coi các đại lượng của ${B} là $100\\%$: tìm giá của ${A} bằng bao nhiêu phần trăm giá của ${B}, rồi lấy **phần trăm doanh thu chia cho phần trăm giá** để được số lượng của ${A}.`,
      buoc: [
        `Đề cho giá của ${B} bằng $${y}\\%$ giá của ${A}, nên lấy $100\\%$ chia cho $${y}\\%$ để biết giá của ${A} bằng bao nhiêu phần trăm giá của ${B}.`,
        `Doanh thu của ${A} bằng $${x}\\%$ doanh thu của ${B}.`,
        `Lấy phần trăm doanh thu chia cho phần trăm giá để biết số ${dv} của ${A} bằng bao nhiêu phần trăm số ${dv} của ${B}.`,
        `So với $100\\%$ để biết ${A} bán nhiều hơn hay ít hơn bao nhiêu phần trăm.`,
      ],
      chuY: `giá của ${B} bằng $${y}\\%$ giá của ${A}, không phải giá của ${A} bằng $${y}\\%$ giá của ${B}.`,
      dong: [
        `Giá của ${A} bằng: $100\\%:${Pn(y)}=${dr(ONE)}:${dr(ry)}=${dr(pa)}=${pct(pa)}$ (giá của ${B})`,
        `Số ${dv} bán được của ${A} bằng: $${pct(rx)}:${pct(pa)}=${dr(rx)}:${dr(pa)}=${dr(N)}=${pct(N)}$ (số ${dv} bán được của ${B})`,
        `Số ${dv} bán được của ${A} ${hh.toLowerCase()} ${B}: $${N.cmp(ONE) > 0 ? `${pct(N)}-100\\%` : `100\\%-${pct(N)}`}=${pct(k.x)}$`,
      ],
      dapSo: dap,
    })
    return { noi_dung: nd, dap_an: dap, loi_giai: lg, ts: `${A}|${x}|${y}` }
  }, out)
  lap(D, 'dt_d2', 3, () => {
    const [A, B, dv] = ten2(), x = pick([84, 90, 96, 108, 120, 126, 132, 150]), y = pick([60, 75, 80, 90, 120, 125, 150, 200])
    const rx = q(x, 100), ry = q(y, 100), N = rx.div(ry); dr(N); vua(N); if (N.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan('x', N), hh = N.cmp(ONE) > 0 ? 'Nhiều hơn' : 'Ít hơn', dap = `${hh} $${pct(k.x)}$`
    const nd = pick([
      `Doanh thu của ${A} bằng ${x}% doanh thu của ${B}, còn giá mỗi ${dv} của ${A} bằng ${y}% giá mỗi ${dv} của ${B}. Hỏi số ${dv} bán được của ${A} nhiều hơn hay ít hơn bao nhiêu phần trăm số ${dv} bán được của ${B}?`,
      `Trong một tuần, ${A} thu được số tiền bằng ${x}% số tiền ${B} thu được, và giá bán mỗi ${dv} ở ${A} bằng ${y}% giá bán mỗi ${dv} ở ${B}. Hỏi ${A} bán được nhiều hơn hay ít hơn ${B} bao nhiêu phần trăm số ${dv}?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá $\\times$ số lượng, nên số lượng $=$ doanh thu $:$ giá. Coi các đại lượng của ${B} là $100\\%$, rồi lấy **phần trăm doanh thu của ${A} chia cho phần trăm giá của ${A}**.`,
      buoc: [
        `Doanh thu của ${A} bằng $${x}\\%$ doanh thu của ${B}.`,
        `Giá mỗi ${dv} của ${A} bằng $${y}\\%$ giá mỗi ${dv} của ${B}.`,
        `Lấy phần trăm doanh thu chia cho phần trăm giá (đổi ra số thập phân) để biết số ${dv} của ${A} bằng bao nhiêu phần trăm của ${B}.`,
        `So với $100\\%$ để biết ${A} bán nhiều hơn hay ít hơn bao nhiêu phần trăm.`,
      ],
      chuY: `chia, không nhân: số lượng bằng doanh thu chia cho giá.`,
      dong: [
        `Số ${dv} bán được của ${A} bằng: $${pct(rx)}:${pct(ry)}=${dr(rx)}:${dr(ry)}=${dr(N)}=${pct(N)}$ (số ${dv} bán được của ${B})`,
        `Số ${dv} bán được của ${A} ${hh.toLowerCase()} ${B}: $${N.cmp(ONE) > 0 ? `${pct(N)}-100\\%` : `100\\%-${pct(N)}`}=${pct(k.x)}$`,
      ],
      dapSo: dap,
    })
    return { noi_dung: nd, dap_an: dap, loi_giai: lg, ts: `${A}|${x}|${y}` }
  }, out)
  // e: doanh thu cũ (tiền), giá ±, lượng ± → doanh thu mới
  lap(D, 'dt_e', 4, () => {
    const s = pick(SP), Dt = pick([12, 15, 20, 24, 30, 36, 40, 48, 50, 60, 80, 100]) * 100000, a = sgn(), b = sgn()
    const p = lDoi('giá bán', 'cũ', a), n = lDoi('số lượng bán', 'cũ', b), t = lTich('Doanh thu mới bằng', [p.r, n.r], 'doanh thu', 'cũ'), Dm = q(Dt).mul(t.r)
    if (!moneyOk(Dm) || t.r.cmp(ONE) === 0) throw SKIP
    const nd = pick([
      `Tháng trước, cửa hàng bán ${s.sp} thu được ${nhom3(Dt)} đồng. Tháng này cửa hàng ${tgG(a)} giá bán ${Math.abs(a)}%, nhưng số ${s.dv} bán ra ${tg(b)} ${Math.abs(b)}% so với tháng trước. Hỏi doanh thu tháng này là bao nhiêu tiền?`,
      `Một quán thu được ${nhom3(Dt)} đồng từ việc bán ${s.sp} trong tuần đầu. Sang tuần sau, giá mỗi ${s.dv} ${tg(a)} ${Math.abs(a)}% và số ${s.dv} bán được ${tg(b)} ${Math.abs(b)}% so với tuần đầu. Hỏi tuần sau quán thu được bao nhiêu tiền?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá bán $\\times$ số lượng, nên doanh thu mới bằng **tích hai tỉ số phần trăm** của giá và số lượng so với lúc đầu; sau đó lấy doanh thu cũ nhân với tỉ số này.`,
      buoc: [
        `Tìm giá bán mới bằng bao nhiêu phần trăm giá bán cũ.`,
        `Tìm số lượng bán mới bằng bao nhiêu phần trăm số lượng bán cũ.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân) để biết doanh thu mới bằng bao nhiêu phần trăm doanh thu cũ.`,
        `Lấy doanh thu cũ nhân với số phần trăm vừa tìm được để ra doanh thu mới.`,
      ],
      chuY: `không cộng trừ thẳng $${Math.abs(a)}\\%$ với $${Math.abs(b)}\\%$ rồi lấy phần trăm của doanh thu cũ.`,
      dong: [p.ln, n.ln, t.ln, `Doanh thu mới là: $${Dt}\\times ${pct(t.r)}=${Dm.n}$ (đồng)`], dapSo: tien(Dm.n),
    })
    return { noi_dung: nd, dap_an: tien(Dm.n), loi_giai: lg, ts: `${s.sp}|${Dt}|${a}|${b}` }
  }, out)
  // f: chi phí không đổi
  const NL = [['gạo', 'kg'], ['đường', 'kg'], ['bột mì', 'kg'], ['cà phê', 'kg'], ['dầu ăn', 'lít'], ['thịt heo', 'kg']]
  lap(D, 'dt_f', 4, () => {
    const [nl, dvi] = pick(NL), a = pick([1, -1]) * pick([25, 50, 60, 100, 150, 300, 20, 75, 80])
    const P = rt(a), N = ONE.div(P); dr(N); pct(N); if (a <= -100) throw SKIP
    const k = lKetLuan(`lượng ${nl} mua`, N)
    const nd = pick([
      `Mỗi tháng một quán ăn mua ${nl} với tổng số tiền không đổi. Tháng này giá ${nl} ${tg(a)} ${Math.abs(a)}% so với tháng trước. Hỏi để tổng số tiền mua ${nl} không đổi thì lượng ${nl} mua tháng này phải tăng hay giảm bao nhiêu phần trăm so với tháng trước?`,
      `Một nhà hàng dành số tiền cố định mỗi tháng để mua ${nl}. Giá mỗi ${dvi} ${nl} ${tg(a)} ${Math.abs(a)}% so với tháng trước. Hỏi nhà hàng phải mua số ${dvi} ${nl} tăng hay giảm bao nhiêu phần trăm để số tiền chi ra không đổi?`,
    ])
    const lg = loiGiai({
      matChot: `Chi phí $=$ giá $\\times$ lượng mua. Chi phí **không đổi** nên giá tăng bao nhiêu lần thì lượng mua giảm đi bấy nhiêu lần (và ngược lại): lượng mới bằng $100\\%$ **chia** cho phần trăm giá mới.`,
      buoc: [
        `Tìm giá mới bằng bao nhiêu phần trăm giá cũ.`,
        `Chi phí không đổi, tức chi phí mới bằng $100\\%$ chi phí cũ; lấy $100\\%$ chia cho phần trăm giá để biết lượng mua mới bằng bao nhiêu phần trăm lượng cũ.`,
        `So với $100\\%$ để biết lượng mua phải tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `lượng mua không thay đổi đúng bằng $${Math.abs(a)}\\%$; phải chia $100\\%$ cho $${pct(P)}$.`,
      dong: [lDoi('giá', 'cũ', a).ln, lThuong(`Lượng ${nl} mua mới bằng`, ONE, P, `lượng ${nl}`, 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${nl}|${a}` }
  }, out)
  // g: doanh thu bằng x%, số lượng bằng y% → giá
  lap(D, 'dt_g', 3, () => {
    const s = pick(SP), x = pick([90, 96, 105, 108, 110, 120, 126, 135, 144, 150]), y = pick([60, 75, 80, 90, 120, 125, 150, 160])
    const rx = q(x, 100), ry = q(y, 100), N = rx.div(ry); dr(N); vua(N); if (N.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan(`giá bán mỗi ${s.dv}`, N)
    const nd = pick([
      `Doanh thu bán ${s.sp} hôm nay bằng ${x}% doanh thu hôm qua, còn số ${s.dv} bán được hôm nay bằng ${y}% số ${s.dv} bán được hôm qua. Hỏi giá bán mỗi ${s.dv} hôm nay tăng hay giảm bao nhiêu phần trăm so với hôm qua?`,
      `Tuần này một cửa hàng thu được số tiền bằng ${x}% tuần trước nhờ bán ${s.sp}, và số ${s.dv} bán ra bằng ${y}% tuần trước. Hỏi giá mỗi ${s.dv} tuần này tăng hay giảm bao nhiêu phần trăm so với tuần trước?`,
    ])
    const lg = loiGiai({
      matChot: `Doanh thu $=$ giá $\\times$ số lượng, nên giá $=$ doanh thu $:$ số lượng. Lấy **phần trăm doanh thu chia cho phần trăm số lượng** để biết giá mới bằng bao nhiêu phần trăm giá cũ.`,
      buoc: [
        `Đề cho sẵn doanh thu mới bằng $${x}\\%$ doanh thu cũ và số lượng mới bằng $${y}\\%$ số lượng cũ.`,
        `Lấy phần trăm doanh thu chia cho phần trăm số lượng (đổi ra số thập phân) để được giá mới bằng bao nhiêu phần trăm giá cũ.`,
        `So với $100\\%$ để biết giá tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `phải chia hai tỉ số phần trăm, không lấy hiệu $${x}\\%-${y}\\%$.`,
      dong: [lThuong('Giá bán mới bằng', rx, ry, 'giá bán', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${s.sp}|${x}|${y}` }
  }, out)
}

// ============================================================================
// C. NDB02776 — DIỆN TÍCH (26)
// ============================================================================
const donvi2 = (u) => `\\text{${u}}^2`
function sinhDienTich(out) {
  const D = DANG.DIEN_TICH
  lap(D, 'dtich_a', 5, () => {
    const vat = pick(VAT_HCN), a = sgn(), b = sgn()
    const d = lDoi('chiều dài', 'cũ', a), r = lDoi('chiều rộng', 'cũ', b), t = lTich('Diện tích mới bằng', [d.r, r.r], 'diện tích', 'cũ'), k = lKetLuan('diện tích', t.r)
    const nd = pick([
      `Một ${vat} hình chữ nhật. Nếu ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}% thì diện tích của nó thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
      `Chiều dài của một ${vat} hình chữ nhật ${tg(a)} ${Math.abs(a)}%, chiều rộng ${tg(b)} ${Math.abs(b)}%. Hỏi diện tích ${vat} đó tăng hay giảm bao nhiêu phần trăm so với ban đầu?`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích hình chữ nhật $=$ chiều dài $\\times$ chiều rộng. Coi chiều dài, chiều rộng lúc đầu đều là $100\\%$; diện tích mới bằng **tích hai tỉ số phần trăm** mới, không cộng trừ thẳng các phần trăm.`,
      buoc: [
        `Tìm chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `Tìm chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân rồi nhân) để biết diện tích mới bằng bao nhiêu phần trăm diện tích cũ.`,
        `So với $100\\%$ để biết diện tích tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `không cộng trừ thẳng $${Math.abs(a)}\\%$ với $${Math.abs(b)}\\%$ để ra phần trăm diện tích thay đổi.`,
      dong: [d.ln, r.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${b}` }
  }, out)
  lap(D, 'dtich_b', 4, () => {
    const vat = pick(VAT_HCN), u = pick(['m', 'cm']), S = pick([200, 240, 300, 400, 500, 600, 800, 1000, 1200, 2000, 2400]), a = sgn(), b = sgn()
    const d = lDoi('chiều dài', 'cũ', a), r = lDoi('chiều rộng', 'cũ', b), t = lTich('Diện tích mới bằng', [d.r, r.r], 'diện tích', 'cũ'), Sm = q(S).mul(t.r)
    if (t.r.cmp(ONE) === 0) throw SKIP; const sm = dec(Sm, 1)
    const uu = u === 'm' ? 'mét vuông' : 'xăng-ti-mét vuông'
    const nd = pick([
      `Một ${vat} hình chữ nhật có diện tích $${S}\\ ${donvi2(u)}$. Nếu ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}% thì diện tích mới là bao nhiêu ${uu}?`,
      `Một ${vat} hình chữ nhật có diện tích $${S}\\ ${donvi2(u)}$. Người ta ${tg(a)} chiều dài ${Math.abs(a)}%, ${tg(b)} chiều rộng ${Math.abs(b)}%. Tính diện tích mới của ${vat} đó (đơn vị ${uu}).`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích mới bằng **tích hai tỉ số phần trăm** của chiều dài và chiều rộng so với lúc đầu; sau đó lấy diện tích cũ nhân với tỉ số này.`,
      buoc: [
        `Tìm chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `Tìm chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ.`,
        `Nhân hai tỉ số phần trăm (đổi ra số thập phân) được diện tích mới bằng bao nhiêu phần trăm diện tích cũ.`,
        `Lấy diện tích cũ nhân với số phần trăm vừa tìm để ra diện tích mới.`,
      ],
      chuY: `không cộng trừ thẳng hai phần trăm của hai cạnh để tìm diện tích mới.`,
      dong: [d.ln, r.ln, t.ln, `Diện tích mới là: $${S}\\times ${pct(t.r)}=${sm}$ ($${donvi2(u)}$)`], dapSo: `$${sm}\\ ${donvi2(u)}$`,
    })
    return { noi_dung: nd, dap_an: `$${sm}\\ ${donvi2(u)}$`, loi_giai: lg, ts: `${S}|${u}|${a}|${b}` }
  }, out)
  // c1: giảm dài → rộng tăng bao nhiêu % để diện tích không đổi; c2: tăng dài → rộng giảm
  lap(D, 'dtich_c1', 2, () => {
    const vat = pick(VAT_HCN), a = pick([20, 50, 60, 75, 37.5]), L = rt(-a), W = ONE.div(L); dr(W); pct(W)
    const x = W.sub(ONE)
    const nd = pick([
      `Khi giảm chiều dài của một ${vat} hình chữ nhật đi ${pcs(a)}%, cần tăng chiều rộng thêm bao nhiêu phần trăm để diện tích không đổi?`,
      `Một ${vat} hình chữ nhật bị giảm chiều dài ${pcs(a)}%. Hỏi phải tăng chiều rộng thêm bao nhiêu phần trăm (so với chiều rộng cũ) để diện tích vẫn như cũ?`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích $=$ chiều dài $\\times$ chiều rộng. Diện tích **không đổi** nên chiều dài mới bằng bao nhiêu phần trăm thì chiều rộng mới bằng $100\\%$ **chia** cho phần trăm đó.`,
      buoc: [
        `Tìm chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `Diện tích không đổi, tức diện tích mới bằng $100\\%$ diện tích cũ; lấy $100\\%$ chia cho tỉ số chiều dài để biết chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ.`,
        `Lấy tỉ số chiều rộng mới trừ $100\\%$ để biết chiều rộng phải tăng thêm bao nhiêu phần trăm.`,
      ],
      chuY: `chiều rộng phải tăng thêm nhiều hơn $${pcs(a)}\\%$, vì hai phần trăm này tính trên hai cạnh khác nhau.`,
      dong: [lDoi('chiều dài', 'cũ', -a).ln, lThuong('Chiều rộng mới bằng', ONE, L, 'chiều rộng', 'cũ').ln, `Chiều rộng phải tăng thêm: $${pct(W)}-100\\%=${pct(x)}$ (chiều rộng cũ)`], dapSo: `$${pct(x)}$`,
    })
    return { noi_dung: nd, dap_an: `$${pct(x)}$`, loi_giai: lg, ts: `${a}` }
  }, out)
  lap(D, 'dtich_c2', 2, () => {
    const vat = pick(VAT_HCN), a = pick([25, 60, 100, 150, 300, 400]), L = rt(a), W = ONE.div(L); dr(W); pct(W)
    const x = ONE.sub(W)
    const nd = pick([
      `Khi tăng chiều dài của một ${vat} hình chữ nhật thêm ${a}%, cần giảm chiều rộng đi bao nhiêu phần trăm để diện tích không đổi?`,
      `Một ${vat} hình chữ nhật được tăng chiều dài ${a}%. Hỏi phải giảm chiều rộng đi bao nhiêu phần trăm (so với chiều rộng cũ) để diện tích vẫn như cũ?`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích **không đổi** nên chiều rộng mới bằng $100\\%$ **chia** cho tỉ số phần trăm của chiều dài mới; sau đó so với $100\\%$ để biết phải giảm bao nhiêu.`,
      buoc: [
        `Tìm chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `Lấy $100\\%$ chia cho tỉ số chiều dài để biết chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ.`,
        `Lấy $100\\%$ trừ tỉ số chiều rộng mới để biết chiều rộng phải giảm đi bao nhiêu phần trăm.`,
      ],
      chuY: `chiều rộng giảm ít hơn $${a}\\%$, không giảm đúng $${a}\\%$.`,
      dong: [lDoi('chiều dài', 'cũ', a).ln, lThuong('Chiều rộng mới bằng', ONE, L, 'chiều rộng', 'cũ').ln, `Chiều rộng phải giảm đi: $100\\%-${pct(W)}=${pct(x)}$ (chiều rộng cũ)`], dapSo: `$${pct(x)}$`,
    })
    return { noi_dung: nd, dap_an: `$${pct(x)}$`, loi_giai: lg, ts: `${a}` }
  }, out)
  // d: dài ±p, diện tích ±r → rộng
  lap(D, 'dtich_d', 3, () => {
    const vat = pick(VAT_HCN), p = sgn(), r = sgn()
    const Lr = rt(p), Rr = rt(r), W = Rr.div(Lr); dr(W); vua(W); if (W.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan('chiều rộng', W)
    const nd = pick([
      `Một ${vat} hình chữ nhật được ${tg(p)} chiều dài ${Math.abs(p)}% và thay đổi cả chiều rộng, khi đó diện tích ${tg(r)} ${Math.abs(r)}% so với ban đầu. Hỏi chiều rộng đã tăng hay giảm bao nhiêu phần trăm?`,
      `Người ta ${tg(p)} chiều dài của một ${vat} hình chữ nhật ${Math.abs(p)}% và điều chỉnh chiều rộng, kết quả là diện tích ${tg(r)} ${Math.abs(r)}% so với trước. Hỏi chiều rộng thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích $=$ chiều dài $\\times$ chiều rộng, nên chiều rộng $=$ diện tích $:$ chiều dài. Muốn biết chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ thì lấy **phần trăm diện tích chia cho phần trăm chiều dài**.`,
      buoc: [
        `Tìm diện tích mới bằng bao nhiêu phần trăm diện tích cũ.`,
        `Tìm chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `Lấy phần trăm diện tích chia cho phần trăm chiều dài (đổi ra số thập phân) để biết chiều rộng mới bằng bao nhiêu phần trăm chiều rộng cũ.`,
        `So với $100\\%$ để biết chiều rộng tăng hay giảm bao nhiêu phần trăm.`,
      ],
      chuY: `không lấy hiệu hai phần trăm $${Math.abs(r)}\\%$ và $${Math.abs(p)}\\%$ làm đáp số.`,
      dong: [lDoi('diện tích', 'cũ', r).ln, lDoi('chiều dài', 'cũ', p).ln, lThuong('Chiều rộng mới bằng', Rr, Lr, 'chiều rộng', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${p}|${r}` }
  }, out)
  // e: chiều dài ± d cm, chiều rộng ± p% → diện tích ± r% → tính chiều dài mới
  lap(D, 'dtich_e', 3, () => {
    const X = pick([20, 30, 40, 45, 50, 60, 80]), k = pick([10, 20, 25, 30, 40, 50]), hd = pick([1, -1]), p = sgn()
    const l = rt(hd * k), w = rt(p), R = l.mul(w); dr(R); pct(R); if (R.cmp(ONE) === 0) throw SKIP
    const ds = dec(q(X).mul(q(k, 100)), 1), Xm = q(X).mul(l), sR = sOf(R)
    const nd = pick([
      `Cho một hình chữ nhật. Khi ${tg(hd)} chiều dài ${ds} cm và ${tg(p)} chiều rộng ${Math.abs(p)}% thì diện tích mới ${tg(sR)} ${ps(R.cmp(ONE) > 0 ? R.sub(ONE) : ONE.sub(R))} so với diện tích ban đầu. Tính chiều dài mới.`,
      `Một hình chữ nhật có chiều dài ${tg(hd)} ${ds} cm và chiều rộng ${tg(p)} ${Math.abs(p)}% thì diện tích mới ${tg(sR)} ${ps(R.cmp(ONE) > 0 ? R.sub(ONE) : ONE.sub(R))} so với diện tích cũ. Tính chiều dài mới của hình chữ nhật đó.`,
    ])
    const dq = hd > 0 ? l.sub(ONE) : ONE.sub(l)
    const lg = loiGiai({
      matChot: `Diện tích $=$ chiều dài $\\times$ chiều rộng, nên chiều dài mới bằng **phần trăm diện tích chia cho phần trăm chiều rộng**. Từ đó biết ${ds} cm ứng với bao nhiêu phần trăm chiều dài cũ để tìm chiều dài cũ, rồi suy ra chiều dài mới.`,
      buoc: [
        `Tìm chiều rộng mới và diện tích mới bằng bao nhiêu phần trăm lúc đầu.`,
        `Lấy phần trăm diện tích chia cho phần trăm chiều rộng để biết chiều dài mới bằng bao nhiêu phần trăm chiều dài cũ.`,
        `So với $100\\%$ để biết chiều dài đã ${hd > 0 ? 'tăng' : 'giảm'} bao nhiêu phần trăm; ${ds} cm ứng với số phần trăm đó nên chia để tìm chiều dài cũ.`,
        `${hd > 0 ? 'Cộng thêm' : 'Trừ đi'} ${ds} cm để ra chiều dài mới.`,
      ],
      chuY: `${ds} cm là số đo cụ thể, còn các tỉ số khác là phần trăm; phải đổi ${ds} cm sang phần trăm của chiều dài cũ.`,
      dong: [
        lDoi('chiều rộng', 'cũ', p).ln,
        lDoi('diện tích', 'cũ', sR).ln,
        lThuong('Chiều dài mới bằng', R, w, 'chiều dài', 'cũ').ln,
        hd > 0 ? `Chiều dài đã tăng: $${pct(l)}-100\\%=${pct(dq)}$ (chiều dài cũ)` : `Chiều dài đã giảm đi: $100\\%-${pct(l)}=${pct(dq)}$ (chiều dài cũ)`,
        `Chiều dài cũ là: $${ds}:${pct(dq)}=${X}$ (cm)`,
        `Chiều dài mới là: $${X}${dau(hd)}${ds}=${dec(Xm, 1)}$ (cm)`,
      ],
      dapSo: `$${dec(Xm, 1)}$ cm`,
    })
    return { noi_dung: nd, dap_an: `$${dec(Xm, 1)}$ cm`, loi_giai: lg, ts: `${X}|${k}|${hd}|${p}` }
  }, out)
  // f: hình vuông
  lap(D, 'dtich_f', 3, () => {
    const a = pick([1, -1]) * pick([10, 20, 25, 30, 40, 50]), c = rt(a)
    const lc = lDoi('cạnh hình vuông', 'cũ', a), t = lTich('Diện tích mới bằng', [c, c], 'diện tích', 'cũ'), k = lKetLuan('diện tích', t.r)
    const kieu = pick(['canh', 'canh', 'chu'])
    const nd = kieu === 'canh'
      ? pick([`Một hình vuông có độ dài cạnh ${tg(a)} ${Math.abs(a)}%. Hỏi diện tích của hình vuông đó tăng hay giảm bao nhiêu phần trăm?`, `Nếu ${tg(a)} mỗi cạnh của một hình vuông ${Math.abs(a)}% thì diện tích hình vuông thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`])
      : `Chu vi của một hình vuông ${tg(a)} ${Math.abs(a)}%. Hỏi diện tích của hình vuông đó tăng hay giảm bao nhiêu phần trăm?`
    const lg = loiGiai({
      matChot: kieu === 'canh' ? `Diện tích hình vuông $=$ cạnh $\\times$ cạnh. Cạnh mới bằng bao nhiêu phần trăm cạnh cũ thì diện tích mới bằng **tích hai tỉ số bằng nhau đó**.` : `Chu vi hình vuông $=$ cạnh $\\times$ $4$ nên chu vi thay đổi bao nhiêu phần trăm thì cạnh thay đổi bấy nhiêu phần trăm. Diện tích $=$ cạnh $\\times$ cạnh nên diện tích mới bằng **tích hai tỉ số bằng nhau** của cạnh.`,
      buoc: [kieu === 'canh' ? `Tìm cạnh mới bằng bao nhiêu phần trăm cạnh cũ.` : `Chu vi ${tg1(a)} ${Math.abs(a)}% nên cạnh cũng ${tg1(a)} ${Math.abs(a)}%; tìm cạnh mới bằng bao nhiêu phần trăm cạnh cũ.`,
        `Diện tích mới bằng cạnh mới nhân cạnh mới, nên nhân hai tỉ số phần trăm (đổi ra số thập phân rồi nhân).`,
        `So với $100\\%$ để biết diện tích tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `diện tích không ${tg1(a)} đúng $${Math.abs(a)}\\%$; phải nhân cạnh với chính nó.`,
      dong: [lc.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${kieu}` }
  }, out)
  // g: diện tích tăng/giảm D → diện tích ban đầu
  lap(D, 'dtich_g', 4, () => {
    const vat = pick(VAT_HCN), u = pick(['m', 'cm']), S = pick([200, 300, 400, 500, 600, 800, 1000, 1500, 2000]), a = sgn(), b = sgn()
    const d = lDoi('chiều dài', 'cũ', a), r = lDoi('chiều rộng', 'cũ', b), t = lTich('Diện tích mới bằng', [d.r, r.r], 'diện tích', 'cũ')
    if (t.r.cmp(ONE) === 0) throw SKIP
    const dif = q(S).mul(t.r).sub(q(S)), tang = dif.n > 0
    const ds = dec(tang ? dif : q(-dif.n, dif.d), 1), kl = lKetLuan('diện tích', t.r)
    const nd = pick([
      `Một ${vat} hình chữ nhật. Nếu ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}% thì diện tích ${tg(tang ? 1 : -1)} $${ds}\\ ${donvi2(u)}$. Tính diện tích ban đầu của ${vat} đó.`,
      `Một ${vat} hình chữ nhật có chiều dài ${tg(a)} ${Math.abs(a)}% và chiều rộng ${tg(b)} ${Math.abs(b)}% thì diện tích ${tg(tang ? 1 : -1)} $${ds}\\ ${donvi2(u)}$. Hỏi diện tích ban đầu là bao nhiêu?`,
    ])
    const lg = loiGiai({
      matChot: `Diện tích mới bằng **tích hai tỉ số phần trăm** của hai cạnh. Tìm diện tích ${tang ? 'tăng' : 'giảm'} bao nhiêu phần trăm diện tích cũ; phần diện tích thay đổi đề cho ứng với số phần trăm đó nên **chia** để tìm diện tích ban đầu.`,
      buoc: [
        `Tìm chiều dài mới và chiều rộng mới bằng bao nhiêu phần trăm lúc đầu.`,
        `Nhân hai tỉ số phần trăm để biết diện tích mới bằng bao nhiêu phần trăm diện tích cũ.`,
        `So với $100\\%$ để biết diện tích ${tang ? 'tăng' : 'giảm'} bao nhiêu phần trăm diện tích cũ.`,
        `Phần diện tích ${tang ? 'tăng thêm' : 'giảm đi'} đề cho ứng với số phần trăm vừa tìm, nên lấy số đó chia cho phần trăm để ra diện tích ban đầu.`,
      ],
      chuY: `không lấy $${ds}$ nhân với phần trăm; $${ds}$ là phần diện tích thay đổi nên phải chia.`,
      dong: [d.ln, r.ln, t.ln, kl.ln + ' (diện tích cũ)', `Diện tích ban đầu là: $${ds}:${pct(kl.x)}=${S}$ ($${donvi2(u)}$)`], dapSo: `$${S}\\ ${donvi2(u)}$`,
    })
    return { noi_dung: nd, dap_an: `$${S}\\ ${donvi2(u)}$`, loi_giai: lg, ts: `${S}|${u}|${a}|${b}` }
  }, out)
}

// ============================================================================
// D. NDB03002 — NĂNG SUẤT – THỜI GIAN – SỐ NGƯỜI (29)
// ============================================================================
function sinhNangSuat(out) {
  const D = DANG.NANG_SUAT
  const AU = [25, 60, 100, 150, 300, 400]            // tăng a% mà 1/(1+a) hữu hạn
  const BG = [20, 50, 60, 75, 80, 37.5]              // giảm b% mà 1/(1−b) hữu hạn
  // a: năng suất tăng → thời gian giảm %
  lap(D, 'ns_a', 4, () => {
    const dd = pick(DOI), a = pick(AU), P = rt(a), T = ONE.div(P); dr(T); pct(T)
    const k = lKetLuan('thời gian', T)
    const nd = pick([
      `Một ${dd.doi} cải tiến kĩ thuật nên năng suất lao động tăng ${a}% so với trước. Hỏi thời gian để ${dd.viec} giảm đi bao nhiêu phần trăm so với trước khi cải tiến?`,
      `Nhờ máy móc mới, năng suất của ${dd.doi} tăng ${a}% so với dự kiến. Hỏi thời gian ${dd.viec} giảm bao nhiêu phần trăm so với dự kiến?`,
    ])
    const lg = loiGiai({
      matChot: `Khối lượng công việc không đổi nên **năng suất và thời gian tỉ lệ nghịch**: công việc $=$ năng suất $\\times$ thời gian. Thời gian mới bằng $100\\%$ **chia** cho tỉ số phần trăm của năng suất mới.`,
      buoc: [`Tìm năng suất mới bằng bao nhiêu phần trăm năng suất cũ.`, `Lấy $100\\%$ chia cho tỉ số năng suất để biết thời gian mới bằng bao nhiêu phần trăm thời gian cũ.`, `Lấy $100\\%$ trừ tỉ số vừa tìm được để biết thời gian giảm đi bao nhiêu phần trăm.`],
      chuY: `thời gian không giảm đúng $${a}\\%$, vì năng suất và thời gian tỉ lệ nghịch.`,
      dong: [lDoi('năng suất', 'cũ', a).ln, lThuong('Thời gian mới bằng', ONE, P, 'thời gian', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${dd.doi}|${a}` }
  }, out)
  // b: năng suất giảm → thời gian tăng %
  lap(D, 'ns_b', 3, () => {
    const dd = pick(DOI), b = pick(BG), P = rt(-b), T = ONE.div(P); dr(T); pct(T)
    const k = lKetLuan('thời gian', T)
    const nd = pick([
      `Do thiết bị cũ hỏng, năng suất của một ${dd.doi} giảm ${pcs(b)}% so với lúc bình thường. Hỏi thời gian để ${dd.viec} tăng thêm bao nhiêu phần trăm so với lúc bình thường?`,
      `Vì thời tiết xấu, năng suất làm việc của ${dd.doi} giảm đi ${pcs(b)}%. Hỏi thời gian ${dd.viec} tăng bao nhiêu phần trăm so với dự định?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc $=$ năng suất $\\times$ thời gian và công việc không đổi, nên thời gian mới bằng $100\\%$ **chia** cho tỉ số phần trăm của năng suất mới.`,
      buoc: [`Tìm năng suất mới bằng bao nhiêu phần trăm năng suất cũ.`, `Lấy $100\\%$ chia cho tỉ số năng suất để được thời gian mới bằng bao nhiêu phần trăm thời gian cũ.`, `Lấy tỉ số vừa tìm trừ $100\\%$ để biết thời gian tăng thêm bao nhiêu phần trăm.`],
      chuY: `thời gian không tăng đúng $${pcs(b)}\\%$; phải chia $100\\%$ cho $${pct(P)}$.`,
      dong: [lDoi('năng suất', 'cũ', -b).ln, lThuong('Thời gian mới bằng', ONE, P, 'thời gian', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${dd.doi}|${b}` }
  }, out)
  // c: số người tăng → ngày
  lap(D, 'ns_c', 4, () => {
    const dd = pick(DOI), a = pick(AU), T0 = pick([20, 24, 30, 36, 40, 45, 48, 60, 72]), P = rt(a), Tm = q(T0).div(P); dr(ONE.div(P))
    const dv = dec(Tm, 1)
    const nd = pick([
      `Một ${dd.doi} dự định ${dd.viec} trong ${T0} ngày. Nếu tăng số người thêm ${a}% (năng suất mỗi người như nhau) thì ${dd.doi} đó ${dd.viec} trong bao nhiêu ngày?`,
      `Để ${dd.viec}, một ${dd.doi} cần ${T0} ngày. Người ta bổ sung thêm số người bằng ${a}% số người ban đầu, năng suất mỗi người như nhau. Hỏi lúc này cần bao nhiêu ngày để ${dd.viec}?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc không đổi, năng suất mỗi người như nhau nên **số người và thời gian tỉ lệ nghịch**: thời gian mới bằng $100\\%$ **chia** cho tỉ số phần trăm của số người mới, rồi nhân với số ngày dự định.`,
      buoc: [`Tìm số người mới bằng bao nhiêu phần trăm số người ban đầu.`, `Lấy $100\\%$ chia cho tỉ số số người để biết thời gian mới bằng bao nhiêu phần trăm thời gian dự định.`, `Lấy số ngày dự định nhân với số phần trăm vừa tìm để ra số ngày cần làm.`],
      chuY: `số người tăng thì số ngày giảm; không lấy số ngày trừ đi $${a}\\%$.`,
      dong: [lDoi('số người', 'ban đầu', a).ln, lThuong('Thời gian mới bằng', ONE, P, 'thời gian', 'dự định').ln, `Số ngày cần để ${dd.viec} là: $${T0}\\times ${pct(ONE.div(P))}=${dv}$ (ngày)`], dapSo: `$${dv}$ ngày`,
    })
    return { noi_dung: nd, dap_an: `$${dv}$ ngày`, loi_giai: lg, ts: `${dd.doi}|${a}|${T0}` }
  }, out)
  // d: năng suất tăng → sớm hơn bao nhiêu ngày
  lap(D, 'ns_d', 4, () => {
    const dd = pick(DOI), a = pick(AU), T0 = pick([20, 24, 30, 36, 40, 45, 48, 60, 72]), P = rt(a), Tm = q(T0).div(P); dr(ONE.div(P))
    const som = q(T0).sub(Tm), ds = dec(som, 1), dm = dec(Tm, 1)
    const nd = pick([
      `Một ${dd.doi} dự kiến ${dd.viec} trong ${T0} ngày. Nhờ cải tiến, năng suất tăng ${a}% so với dự kiến. Hỏi ${dd.doi} đó hoàn thành sớm hơn dự kiến bao nhiêu ngày?`,
      `Theo kế hoạch, ${dd.doi} sẽ ${dd.viec} trong ${T0} ngày. Do làm việc hiệu quả hơn nên năng suất tăng ${a}% so với kế hoạch. Hỏi ${dd.doi} xong sớm hơn kế hoạch bao nhiêu ngày?`,
    ])
    const lg = loiGiai({
      matChot: `Năng suất và thời gian tỉ lệ nghịch (công việc không đổi): thời gian mới bằng $100\\%$ **chia** cho tỉ số năng suất. Tìm số ngày làm thật rồi lấy số ngày dự kiến trừ đi.`,
      buoc: [`Tìm năng suất mới bằng bao nhiêu phần trăm năng suất dự kiến.`, `Lấy $100\\%$ chia cho tỉ số năng suất để biết thời gian mới bằng bao nhiêu phần trăm thời gian dự kiến.`, `Lấy số ngày dự kiến nhân với số phần trăm vừa tìm để biết số ngày làm thật.`, `Lấy số ngày dự kiến trừ số ngày làm thật để biết xong sớm bao nhiêu ngày.`],
      chuY: `đề hỏi xong sớm hơn bao nhiêu ngày, không phải số ngày làm thật.`,
      dong: [lDoi('năng suất', 'dự kiến', a).ln, lThuong('Thời gian mới bằng', ONE, P, 'thời gian', 'dự kiến').ln, `Số ngày làm thật là: $${T0}\\times ${pct(ONE.div(P))}=${dm}$ (ngày)`, `Số ngày xong sớm hơn dự kiến là: $${T0}-${dm}=${ds}$ (ngày)`], dapSo: `$${ds}$ ngày`,
    })
    return { noi_dung: nd, dap_an: `$${ds}$ ngày`, loi_giai: lg, ts: `${dd.doi}|${a}|${T0}` }
  }, out)
  // e: số người giảm → thời gian tăng %
  lap(D, 'ns_e', 3, () => {
    const dd = pick(DOI), b = pick(BG), P = rt(-b), T = ONE.div(P); dr(T); pct(T)
    const k = lKetLuan('thời gian', T)
    const nd = pick([
      `Một ${dd.doi} có một số người nghỉ nên số người làm việc giảm ${pcs(b)}% so với ban đầu (năng suất mỗi người như nhau). Hỏi thời gian để ${dd.viec} tăng thêm bao nhiêu phần trăm so với dự định?`,
      `Số người của ${dd.doi} giảm đi ${pcs(b)}% so với dự định, năng suất mỗi người không đổi. Hỏi thời gian ${dd.viec} tăng bao nhiêu phần trăm so với dự định?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc không đổi, năng suất mỗi người như nhau nên **số người và thời gian tỉ lệ nghịch**: thời gian mới bằng $100\\%$ **chia** cho tỉ số phần trăm của số người còn lại.`,
      buoc: [`Tìm số người còn lại bằng bao nhiêu phần trăm số người ban đầu.`, `Lấy $100\\%$ chia cho tỉ số số người để biết thời gian mới bằng bao nhiêu phần trăm thời gian dự định.`, `Lấy tỉ số vừa tìm trừ $100\\%$ để biết thời gian tăng thêm bao nhiêu phần trăm.`],
      chuY: `số người giảm $${pcs(b)}\\%$ nhưng thời gian không tăng đúng $${pcs(b)}\\%$.`,
      dong: [lDoi('số người', 'ban đầu', -b).ln, lThuong('Thời gian mới bằng', ONE, P, 'thời gian', 'dự định').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${dd.doi}|${b}` }
  }, out)
  // f: thời gian giảm d% → năng suất tăng bao nhiêu %
  lap(D, 'ns_f', 3, () => {
    const dd = pick(DOI), d = pick(BG), Tn = rt(-d), N = ONE.div(Tn); dr(N); pct(N)
    const x = N.sub(ONE)
    const nd = pick([
      `Để ${dd.viec} nhanh hơn, một ${dd.doi} muốn giảm thời gian làm đi ${pcs(d)}% so với dự định. Hỏi năng suất lao động phải tăng thêm bao nhiêu phần trăm so với dự định?`,
      `Muốn thời gian ${dd.viec} giảm đi ${pcs(d)}% so với kế hoạch thì ${dd.doi} cần tăng năng suất thêm bao nhiêu phần trăm so với kế hoạch?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc không đổi nên năng suất và thời gian tỉ lệ nghịch: năng suất mới bằng $100\\%$ **chia** cho tỉ số phần trăm của thời gian mới, rồi so với $100\\%$.`,
      buoc: [`Tìm thời gian mới bằng bao nhiêu phần trăm thời gian dự định (lấy $100\\%$ trừ phần trăm giảm).`, `Lấy $100\\%$ chia cho tỉ số thời gian để biết năng suất mới bằng bao nhiêu phần trăm năng suất cũ.`, `Lấy tỉ số vừa tìm trừ $100\\%$ để biết năng suất phải tăng thêm bao nhiêu phần trăm.`],
      chuY: `năng suất phải tăng nhiều hơn $${pcs(d)}\\%$, vì năng suất và thời gian tỉ lệ nghịch.`,
      dong: [lDoi('thời gian', 'dự định', -d).ln, lThuong('Năng suất mới bằng', ONE, Tn, 'năng suất', 'cũ').ln, `Năng suất phải tăng thêm: $${pct(N)}-100\\%=${pct(x)}$ (năng suất cũ)`], dapSo: `$${pct(x)}$`,
    })
    return { noi_dung: nd, dap_an: `$${pct(x)}$`, loi_giai: lg, ts: `${dd.doi}|${d}` }
  }, out)
  // g: người tăng a%, năng suất mỗi người giảm b% → ngày
  lap(D, 'ns_g', 4, () => {
    const dd = pick(DOI), a = pick([20, 25, 40, 50, 60, 100, 150]), b = pick([10, 20, 25, 30, 40, 50]), T0 = pick([20, 24, 30, 36, 40, 45, 48, 60])
    const tn = rt(a), nn = rt(-b), pr = tn.mul(nn); dr(pr); if (pr.cmp(ONE) === 0) throw SKIP
    const Tr = ONE.div(pr); dr(Tr); const Tm = q(T0).mul(Tr), dm = dec(Tm, 1)
    const nd = pick([
      `Một ${dd.doi} dự định ${dd.viec} trong ${T0} ngày. Sau đó số người tăng thêm ${a}% nhưng năng suất của mỗi người giảm ${b}% so với dự định. Hỏi ${dd.doi} đó ${dd.viec} trong bao nhiêu ngày?`,
      `Theo kế hoạch, ${dd.doi} ${dd.viec} trong ${T0} ngày. Thực tế, số người tăng ${a}% còn năng suất mỗi người giảm ${b}% so với kế hoạch. Hỏi thực tế cần bao nhiêu ngày để ${dd.viec}?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc $=$ số người $\\times$ năng suất mỗi người $\\times$ thời gian, và công việc không đổi. Số người và năng suất mỗi người đều thay đổi nên **nhân hai tỉ số** để được năng suất cả đội, rồi thời gian mới bằng $100\\%$ chia cho tỉ số đó.`,
      buoc: [`Tìm số người mới và năng suất mỗi người mới bằng bao nhiêu phần trăm lúc đầu.`, `Nhân hai tỉ số phần trăm để biết năng suất cả đội mới bằng bao nhiêu phần trăm năng suất cũ.`, `Lấy $100\\%$ chia cho tỉ số năng suất cả đội để được thời gian mới bằng bao nhiêu phần trăm thời gian dự định.`, `Lấy số ngày dự định nhân với số phần trăm vừa tìm để ra số ngày làm thật.`],
      chuY: `không lấy $${a}\\%-${b}\\%$; số người và năng suất mỗi người nhân với nhau.`,
      dong: [lDoi('số người', 'dự định', a).ln, lDoi('năng suất mỗi người', 'dự định', -b).ln, lTich('Năng suất cả đội mới bằng', [tn, nn], 'năng suất cả đội', 'cũ').ln, lThuong('Thời gian mới bằng', ONE, pr, 'thời gian', 'dự định').ln, `Số ngày cần để ${dd.viec} là: $${T0}\\times ${pct(Tr)}=${dm}$ (ngày)`], dapSo: `$${dm}$ ngày`,
    })
    return { noi_dung: nd, dap_an: `$${dm}$ ngày`, loi_giai: lg, ts: `${dd.doi}|${a}|${b}|${T0}` }
  }, out)
  // h: người tăng a%, năng suất mỗi người tăng b% → thời gian giảm %
  lap(D, 'ns_h', 4, () => {
    const dd = pick(DOI), a = pick([10, 20, 25, 30, 40, 50, 60, 100]), b = pick([10, 20, 25, 30, 40, 50, 60, 100])
    const tn = rt(a), nn = rt(b), pr = tn.mul(nn); dr(pr); const Tr = ONE.div(pr); dr(Tr); pct(Tr)
    const k = lKetLuan('thời gian', Tr)
    const nd = pick([
      `Một ${dd.doi} tăng số người thêm ${a}% và nhờ tập huấn nên năng suất của mỗi người cũng tăng ${b}% so với trước. Hỏi thời gian để ${dd.viec} giảm đi bao nhiêu phần trăm so với trước?`,
      `Số người của ${dd.doi} tăng ${a}%, đồng thời năng suất mỗi người tăng ${b}% so với dự định. Hỏi thời gian ${dd.viec} giảm bao nhiêu phần trăm so với dự định?`,
    ])
    const lg = loiGiai({
      matChot: `Công việc $=$ số người $\\times$ năng suất mỗi người $\\times$ thời gian, công việc không đổi. **Nhân hai tỉ số** để được năng suất cả đội mới, rồi thời gian mới bằng $100\\%$ chia cho tỉ số đó.`,
      buoc: [`Tìm số người mới và năng suất mỗi người mới bằng bao nhiêu phần trăm lúc đầu.`, `Nhân hai tỉ số phần trăm để biết năng suất cả đội mới bằng bao nhiêu phần trăm năng suất cũ.`, `Lấy $100\\%$ chia cho tỉ số đó để biết thời gian mới bằng bao nhiêu phần trăm thời gian cũ.`, `Lấy $100\\%$ trừ tỉ số vừa tìm để biết thời gian giảm bao nhiêu phần trăm.`],
      chuY: `không lấy $${a}\\%+${b}\\%$ làm số phần trăm thời gian giảm; hai tỉ số tăng phải nhân với nhau rồi lấy $100\\%$ chia cho tích.`,
      dong: [lDoi('số người', 'cũ', a).ln, lDoi('năng suất mỗi người', 'cũ', b).ln, lTich('Năng suất cả đội mới bằng', [tn, nn], 'năng suất cả đội', 'cũ').ln, lThuong('Thời gian mới bằng', ONE, pr, 'thời gian', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${dd.doi}|${a}|${b}` }
  }, out)
}

// ============================================================================
// E. NDB03003 — THỂ TÍCH HỘP (30)
// ============================================================================
function sinhTheTich(out) {
  const D = DANG.THE_TICH
  const dv3 = (u) => `\\text{${u}}^3`
  const hopTxt = (h) => `Một ${h.hop} có dạng hình hộp chữ nhật`
  lap(D, 'tt_a', 5, () => {
    const h = pick(HOP), a = sgn(), b = sgn(), c = sgn()
    const d = lDoi('chiều dài', 'cũ', a), r = lDoi('chiều rộng', 'cũ', b), cao = lDoi('chiều cao', 'cũ', c), t = lTich('Thể tích mới bằng', [d.r, r.r, cao.r], 'thể tích', 'cũ'), k = lKetLuan('thể tích', t.r)
    const nd = pick([
      `${hopTxt(h)}. Nếu ${tg(a)} chiều dài ${Math.abs(a)}%, ${tg(b)} chiều rộng ${Math.abs(b)}% và ${tg(c)} chiều cao ${Math.abs(c)}% thì thể tích của ${h.hop} thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
      `Chiều dài, chiều rộng, chiều cao của một ${h.hop} hình hộp chữ nhật lần lượt ${tg(a)} ${Math.abs(a)}%, ${tg(b)} ${Math.abs(b)}%, ${tg(c)} ${Math.abs(c)}%. Hỏi thể tích ${h.hop} đó tăng hay giảm bao nhiêu phần trăm?`,
    ])
    const lg = loiGiai({
      matChot: `Thể tích hình hộp chữ nhật $=$ dài $\\times$ rộng $\\times$ cao. Coi ba kích thước lúc đầu đều là $100\\%$; thể tích mới bằng **tích ba tỉ số phần trăm** mới (đổi ra số thập phân rồi nhân), không cộng trừ thẳng các phần trăm.`,
      buoc: [`Tìm chiều dài, chiều rộng, chiều cao mới bằng bao nhiêu phần trăm lúc đầu (tăng thì cộng vào $100\\%$, giảm thì trừ đi).`, `Nhân ba tỉ số phần trăm (đổi ra số thập phân) được thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `So với $100\\%$ để biết thể tích tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `không cộng trừ thẳng $${Math.abs(a)}\\%$, $${Math.abs(b)}\\%$, $${Math.abs(c)}\\%$ để ra phần trăm thể tích.`,
      dong: [d.ln, r.ln, cao.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${b}|${c}` }
  }, out)
  lap(D, 'tt_b', 5, () => {
    const h = pick(HOP), V = pick(h.v), a = sgn(), b = pick([0, 1]) ? sgn() : 0, c = sgn()
    const fs = [['chiều dài', a], ['chiều rộng', b], ['chiều cao', c]].filter(([, s]) => s !== 0)
    const ls = fs.map(([ten, s]) => lDoi(ten, 'cũ', s)), t = lTich('Thể tích mới bằng', ls.map((x) => x.r), 'thể tích', 'cũ'); if (t.r.cmp(ONE) === 0) throw SKIP
    const Vm = q(V).mul(t.r), vm = dec(Vm, 1)
    const cau = fs.map(([ten, s]) => `${tg(s)} ${ten} ${Math.abs(s)}%`)
    const nd = pick([
      `${hopTxt(h)} có thể tích $${V}\\ ${dv3(h.u)}$. Người ta ${cau.slice(0, -1).join(', ')} và ${cau[cau.length - 1]}. Tính thể tích mới của ${h.hop}.`,
      `Một ${h.hop} hình hộp chữ nhật có thể tích $${V}\\ ${dv3(h.u)}$. Nếu ${cau.slice(0, -1).join(', ')} và ${cau[cau.length - 1]} thì thể tích mới của ${h.hop} là bao nhiêu?`,
    ])
    const lg = loiGiai({
      matChot: `Thể tích mới bằng **tích các tỉ số phần trăm** của những kích thước có thay đổi (kích thước không đổi coi là $100\\%$); sau đó lấy thể tích cũ nhân với tỉ số này.`,
      buoc: [`Tìm mỗi kích thước có thay đổi bằng bao nhiêu phần trăm lúc đầu.`, `Nhân các tỉ số phần trăm (đổi ra số thập phân) để biết thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `Lấy thể tích cũ nhân với số phần trăm vừa tìm để ra thể tích mới.`],
      chuY: `kích thước không đổi thì không đưa vào phép nhân; không cộng trừ thẳng các phần trăm.`,
      dong: [...ls.map((x) => x.ln), t.ln, `Thể tích mới là: $${V}\\times ${pct(t.r)}=${vm}$ ($${dv3(h.u)}$)`], dapSo: `$${vm}\\ ${dv3(h.u)}$`,
    })
    return { noi_dung: nd, dap_an: `$${vm}\\ ${dv3(h.u)}$`, loi_giai: lg, ts: `${V}|${h.u}|${a}|${b}|${c}` }
  }, out)
  // c: dài ±a, rộng ±b, thể tích ±r → cao ±
  lap(D, 'tt_c', 4, () => {
    const h = pick(HOP), a = sgn(), b = sgn(), r = sgn()
    const d = lDoi('chiều dài', 'cũ', a), w = lDoi('chiều rộng', 'cũ', b), tdb = lTich('Diện tích đáy mới bằng', [d.r, w.r], 'diện tích đáy', 'cũ'), Rv = rt(r)
    const Hc = Rv.div(tdb.r); dr(Hc); vua(Hc); if (Hc.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan('chiều cao', Hc)
    const nd = pick([
      `Cho một ${h.hop} hình hộp chữ nhật. Người ta ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}%. Hỏi để thể tích ${h.hop} ${tg(r)} ${Math.abs(r)}% so với ban đầu thì chiều cao phải tăng hay giảm bao nhiêu phần trăm?`,
      `Một ${h.hop} hình hộp chữ nhật được ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}%. Để thể tích mới ${tg(r)} ${Math.abs(r)}% so với thể tích cũ thì chiều cao phải thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
    ])
    const lg = loiGiai({
      matChot: `Thể tích $=$ diện tích đáy $\\times$ chiều cao, nên chiều cao $=$ thể tích $:$ diện tích đáy. Tìm diện tích đáy mới (tích dài $\\times$ rộng) rồi lấy **phần trăm thể tích chia cho phần trăm diện tích đáy**.`,
      buoc: [`Tìm chiều dài mới và chiều rộng mới bằng bao nhiêu phần trăm lúc đầu rồi nhân để được diện tích đáy mới.`, `Tìm thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `Lấy phần trăm thể tích chia cho phần trăm diện tích đáy (đổi ra số thập phân) để biết chiều cao mới bằng bao nhiêu phần trăm chiều cao cũ.`, `So với $100\\%$ để biết chiều cao tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `không lấy hiệu các phần trăm thay đổi; thể tích là tích của dài, rộng và cao.`,
      dong: [d.ln, w.ln, tdb.ln, lDoi('thể tích', 'cũ', r).ln, lThuong('Chiều cao mới bằng', Rv, tdb.r, 'chiều cao', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${b}|${r}` }
  }, out)
  // d: thể tích không đổi
  lap(D, 'tt_d', 4, () => {
    const h = pick(HOP), a = sgn(), b = sgn()
    const d = lDoi('chiều dài', 'cũ', a), w = lDoi('chiều rộng', 'cũ', b), tdb = lTich('Diện tích đáy mới bằng', [d.r, w.r], 'diện tích đáy', 'cũ')
    const Hc = ONE.div(tdb.r); dr(Hc); vua(Hc); if (Hc.cmp(ONE) === 0) throw SKIP
    const k = lKetLuan('chiều cao', Hc)
    const nd = pick([
      `Một ${h.hop} hình hộp chữ nhật được ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}%. Hỏi chiều cao phải tăng hay giảm bao nhiêu phần trăm để thể tích không thay đổi?`,
      `Muốn giữ nguyên thể tích của một ${h.hop} hình hộp chữ nhật khi ${tg(a)} chiều dài ${Math.abs(a)}% và ${tg(b)} chiều rộng ${Math.abs(b)}% thì chiều cao phải tăng hay giảm bao nhiêu phần trăm?`,
    ])
    const lg = loiGiai({
      matChot: `Thể tích **không đổi** nên chiều cao mới bằng $100\\%$ **chia** cho tỉ số phần trăm của diện tích đáy mới (diện tích đáy mới $=$ tích hai tỉ số của dài và rộng).`,
      buoc: [`Tìm chiều dài mới và chiều rộng mới bằng bao nhiêu phần trăm lúc đầu.`, `Nhân hai tỉ số phần trăm để biết diện tích đáy mới bằng bao nhiêu phần trăm diện tích đáy cũ.`, `Lấy $100\\%$ chia cho tỉ số diện tích đáy để biết chiều cao mới bằng bao nhiêu phần trăm chiều cao cũ.`, `So với $100\\%$ để biết chiều cao tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `chiều cao không thay đổi đúng bằng tổng hay hiệu hai phần trăm của dài và rộng.`,
      dong: [d.ln, w.ln, tdb.ln, lThuong('Chiều cao mới bằng', ONE, tdb.r, 'chiều cao', 'cũ').ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${b}` }
  }, out)
  // e: cả ba kích thước (hay cạnh khối lập phương) cùng đổi
  lap(D, 'tt_e', 3, () => {
    const a = pick([1, -1]) * pick([10, 20, 25, 30, 40, 50]), c = rt(a), cp = lDoi('mỗi kích thước', 'cũ', a)
    const t = lTich('Thể tích mới bằng', [c, c, c], 'thể tích', 'cũ'), k = lKetLuan('thể tích', t.r)
    const kieu = pick(['hcn', 'lp'])
    const nd = kieu === 'hcn'
      ? pick([`Nếu cả ba kích thước (chiều dài, chiều rộng, chiều cao) của một hình hộp chữ nhật cùng ${tg(a)} ${Math.abs(a)}% thì thể tích của nó tăng hay giảm bao nhiêu phần trăm?`, `Một hình hộp chữ nhật có chiều dài, chiều rộng, chiều cao cùng ${tg(a)} ${Math.abs(a)}%. Hỏi thể tích hình hộp đó tăng hay giảm bao nhiêu phần trăm?`])
      : `Độ dài cạnh của một khối lập phương ${tg(a)} ${Math.abs(a)}%. Hỏi thể tích của khối lập phương đó tăng hay giảm bao nhiêu phần trăm?`
    const lg = loiGiai({
      matChot: kieu === 'hcn' ? `Thể tích $=$ dài $\\times$ rộng $\\times$ cao. Ba kích thước cùng đổi một tỉ số nên thể tích mới bằng **tích ba tỉ số giống nhau**.` : `Thể tích khối lập phương $=$ cạnh $\\times$ cạnh $\\times$ cạnh, nên thể tích mới bằng **tích ba tỉ số giống nhau** của cạnh.`,
      buoc: [`Tìm mỗi kích thước (hay cạnh) mới bằng bao nhiêu phần trăm lúc đầu.`, `Nhân ba tỉ số phần trăm giống nhau (đổi ra số thập phân) được thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `So với $100\\%$ để biết thể tích tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `thể tích không ${tg1(a)} đúng $${Math.abs(a)}\\%$, cũng không phải $3\\times ${Math.abs(a)}\\%$.`,
      dong: [cp.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${kieu}` }
  }, out)
  // g: đáy vuông
  lap(D, 'tt_g', 4, () => {
    const h = pick(HOP), a = sgn(), b = sgn(), c = rt(a)
    const cd = lDoi('cạnh đáy', 'cũ', a), ch = lDoi('chiều cao', 'cũ', b), t = lTich('Thể tích mới bằng', [c, c, ch.r], 'thể tích', 'cũ'), k = lKetLuan('thể tích', t.r)
    const nd = pick([
      `Một ${h.hop} có dạng hình hộp chữ nhật với đáy là hình vuông. Nếu ${tg(a)} cạnh đáy ${Math.abs(a)}% và ${tg(b)} chiều cao ${Math.abs(b)}% thì thể tích của ${h.hop} thay đổi như thế nào (tăng hay giảm bao nhiêu phần trăm)?`,
      `Một hình hộp chữ nhật có đáy là hình vuông. Cạnh đáy ${tg(a)} ${Math.abs(a)}% còn chiều cao ${tg(b)} ${Math.abs(b)}%. Hỏi thể tích hình hộp tăng hay giảm bao nhiêu phần trăm?`,
    ])
    const lg = loiGiai({
      matChot: `Đáy là hình vuông nên thể tích $=$ cạnh đáy $\\times$ cạnh đáy $\\times$ chiều cao. Cạnh đáy xuất hiện **hai lần**, nên thể tích mới bằng tích của **hai tỉ số cạnh đáy** và tỉ số chiều cao.`,
      buoc: [`Tìm cạnh đáy mới bằng bao nhiêu phần trăm cạnh đáy cũ.`, `Tìm chiều cao mới bằng bao nhiêu phần trăm chiều cao cũ.`, `Nhân hai lần tỉ số cạnh đáy với tỉ số chiều cao (đổi ra số thập phân) để biết thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `So với $100\\%$ để biết thể tích tăng hay giảm bao nhiêu phần trăm.`],
      chuY: `đừng quên tỉ số cạnh đáy phải nhân hai lần.`,
      dong: [cd.ln, ch.ln, t.ln, k.ln], dapSo: k.dap,
    })
    return { noi_dung: nd, dap_an: k.dap, loi_giai: lg, ts: `${a}|${b}` }
  }, out)
  // h: thể tích tăng/giảm D → thể tích ban đầu
  lap(D, 'tt_h', 5, () => {
    const h = pick(HOP), V = pick(h.v) * pick([1, 2, 5]), a = sgn(), b = sgn(), c = pick([0, 1]) ? sgn() : 0
    const fs = [['chiều dài', a], ['chiều rộng', b], ['chiều cao', c]].filter(([, s]) => s !== 0)
    const ls = fs.map(([ten, s]) => lDoi(ten, 'cũ', s)), t = lTich('Thể tích mới bằng', ls.map((x) => x.r), 'thể tích', 'cũ'); if (t.r.cmp(ONE) === 0) throw SKIP
    const dif = q(V).mul(t.r).sub(q(V)), tang = dif.n > 0; const ds = dec(tang ? dif : q(-dif.n, dif.d), 1)
    const kl = lKetLuan('thể tích', t.r)
    const cau = fs.map(([ten, s]) => `${tg(s)} ${ten} ${Math.abs(s)}%`)
    const nd = pick([
      `Một ${h.hop} hình hộp chữ nhật. Nếu ${cau.slice(0, -1).join(', ')} và ${cau[cau.length - 1]} thì thể tích ${tg(tang ? 1 : -1)} $${ds}\\ ${dv3(h.u)}$. Tính thể tích ban đầu của ${h.hop} đó.`,
      `Khi ${cau.slice(0, -1).join(', ')} và ${cau[cau.length - 1]}, thể tích của một ${h.hop} hình hộp chữ nhật ${tg(tang ? 1 : -1)} $${ds}\\ ${dv3(h.u)}$. Hỏi thể tích ban đầu của ${h.hop} là bao nhiêu?`,
    ])
    const lg = loiGiai({
      matChot: `Thể tích mới bằng **tích các tỉ số phần trăm** của kích thước. Tìm thể tích ${tang ? 'tăng' : 'giảm'} bao nhiêu phần trăm thể tích cũ; phần thể tích thay đổi đề cho ứng với số phần trăm đó nên **chia** để tìm thể tích ban đầu.`,
      buoc: [`Tìm mỗi kích thước có thay đổi bằng bao nhiêu phần trăm lúc đầu.`, `Nhân các tỉ số phần trăm để biết thể tích mới bằng bao nhiêu phần trăm thể tích cũ.`, `So với $100\\%$ để biết thể tích ${tang ? 'tăng' : 'giảm'} bao nhiêu phần trăm thể tích cũ.`, `Phần thể tích ${tang ? 'tăng thêm' : 'giảm đi'} ứng với số phần trăm vừa tìm, nên lấy số đó chia cho phần trăm để ra thể tích ban đầu.`],
      chuY: `không lấy $${ds}$ nhân với phần trăm; $${ds}$ là phần thay đổi nên phải chia.`,
      dong: [...ls.map((x) => x.ln), t.ln, kl.ln + ' (thể tích cũ)', `Thể tích ban đầu là: $${ds}:${pct(kl.x)}=${V}$ ($${dv3(h.u)}$)`], dapSo: `$${V}\\ ${dv3(h.u)}$`,
    })
    return { noi_dung: nd, dap_an: `$${V}\\ ${dv3(h.u)}$`, loi_giai: lg, ts: `${V}|${h.u}|${a}|${b}|${c}` }
  }, out)
}

export function sinh() {
  rnd = mulberry32(20261128); dung.clear(); dungTS.clear()
  const out = []
  sinhGiamGiaKep(out); sinhDoanhThu(out); sinhDienTich(out); sinhNangSuat(out); sinhTheTich(out)
  return out
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-B.mjs')) {
  const a = process.argv.slice(2), ra = a.includes('--ra') ? a[a.indexOf('--ra') + 1] : null
  const cau = sinh(), dem = {}
  for (const c of cau) { dem[c.dang] = dem[c.dang] || { cau: 0, mau: new Set() }; dem[c.dang].cau++; dem[c.dang].mau.add(c.mau) }
  for (const k in dem) console.log(k, dem[k].cau, 'câu,', dem[k].mau.size, 'mẫu')
  console.log('Tổng', cau.length)
  if (ra) { mkdirSync(dirname(ra), { recursive: true }); writeFileSync(ra, JSON.stringify(cau, null, 1)); console.log('→', ra) }
}
