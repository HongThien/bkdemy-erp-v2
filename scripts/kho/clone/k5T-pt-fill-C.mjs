// ============================================================================
// k5T-pt-fill-C.mjs — BỘ SINH lô FILL "C" cho chuyên đề Tỉ số phần trăm khối 5T, hai nhóm:
//   "Bài toán hỗn hợp"                    : NDB02777 trộn A và B tìm hỗn hợp · NDB02778 cho hỗn hợp tìm ngược lại A và B
//   "Tăng – giảm liên tiếp và lãi suất"   : NDB03004 pha loãng / cô đặc · NDB03005 hạt tươi – hạt khô ·
//                                           NDB03006 tăng / giảm liên tiếp · NDB03007 lãi suất ngân hàng
// Mỗi câu = 1 MẪU (item model) + tham số "ĐẸP" (số thập phân hữu hạn gọn, tiền là bội của 1000 đồng). Lời giải 2 phần theo k5T-pt-sinh.mjs:
//   Phần 1 = Mấu chốt + 3–6 Bước + Chú ý ; Phần 2 = "Bài giải", mỗi dòng 1 lời giải + 1 phép tính, "Đáp số: …".
// Hạt giống cố định ⇒ chạy lại ra đúng lô. Bộ KIỂM độc lập (đọc lại CHỮ của đề, phân số BigInt riêng): k5T-pt-fill-C-kiem.mjs.
//   node scripts/kho/clone/k5T-pt-fill-C.mjs --ra kho-rules/dai/clone/k5T-pt-fill-C.json
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export const D = { TRON: 'NDB02777', NGUOC: 'NDB02778', LOANG: 'NDB03004', HAT: 'NDB03005', LIEN_TIEP: 'NDB03006', LAI: 'NDB03007' }
// số câu cần THÊM + 2 dư
export const CAN = { NDB02777: 28, NDB02778: 31, NDB03004: 23, NDB03005: 26, NDB03006: 30, NDB03007: 27 }

// ── rng ──────────────────────────────────────────────────────────────────────────────────────────────────────────
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
let rnd = mulberry32(20261128)
const pick = (a) => a[Math.floor(rnd() * a.length)]
const cap = (s) => s[0].toUpperCase() + s.slice(1)

// ── phân số BigInt ───────────────────────────────────────────────────────────────────────────────────────────────
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class R {
  constructor(n, d = 1n) { if (d < 0n) { n = -n; d = -d } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g }
  add(o) { return new R(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new R(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new R(this.n * o.n, this.d * o.d) }
  div(o) { return new R(this.n * o.d, this.d * o.n) }
  eq(o) { return this.n === o.n && this.d === o.d }
  lt(o) { return this.n * o.d < o.n * this.d }
  get nguyen() { return this.d === 1n }
  get duong() { return this.n > 0n }
  get dp() { let d = this.d, a = 0, b = 0; while (d % 2n === 0n) { d /= 2n; a++ } while (d % 5n === 0n) { d /= 5n; b++ } return d === 1n ? Math.max(a, b) : Infinity }
}
const Rn = (x) => (typeof x === 'number' ? new R(BigInt(Math.round(x * 1000)), 1000n) : x)   // 2,5 → 5/2
const H100 = new R(100n), ONE = new R(1n)
const fmt = (x) => {
  const k = x.dp; if (k === Infinity) throw new Error('số thập phân vô hạn')
  const neg = x.n < 0n; const v = (neg ? -x.n : x.n) * 10n ** BigInt(k) / x.d
  const s = String(v).padStart(k + 1, '0'); const nguyen = k ? s.slice(0, -k) : s, le = k ? s.slice(-k) : ''
  return (neg ? '-' : '') + nguyen + (le ? ',' + le : '')
}
const P = (x) => fmt(x) + '\\%'                  // x là số phần trăm: 4,5 → "4,5\%"
const ofp = (M, a) => M.mul(a).div(H100)         // a% của M
const nhom3 = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
const ok = (x, k) => x.dp <= k
const tien = (n) => `$${n}$ đồng`

// ── chống trùng ──────────────────────────────────────────────────────────────────────────────────────────────────
const dungVan = new Set(), dungSo = new Set()
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '').replace(/[$\\{}]/g, '')
function tryAdd(ds, c) {
  const k = chuan(c.noi_dung), ks = c.mau + '|' + (c.noi_dung.match(/\d+(?:,\d+)?/g) || []).join(',')
  if (dungVan.has(k) || dungSo.has(ks)) return false
  dungVan.add(k); dungSo.add(ks); ds.push(c); return true
}

/** khuôn lời giải 2 phần (đúng k5T-pt-sinh.mjs) */
function loiGiai({ matChot, buoc, chuY, thuLai, dong, dapSo }) {
  return [
    '**Phần 1. Hướng dẫn**',
    `**Mấu chốt:** ${matChot}`,
    ...buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`),
    `**Chú ý:** ${chuY}`,
    ...(thuLai ? [`Thử lại: ${thuLai}`] : []),
    '**Phần 2. Trình bày**',
    'Bài giải',
    ...dong,
    `Đáp số: ${dapSo}`,
  ].join('\n\n')
}

// ── ngữ cảnh chất tan ────────────────────────────────────────────────────────────────────────────────────────────
const MAS = {
  g: [50, 60, 75, 80, 100, 120, 150, 200, 240, 250, 300, 320, 350, 400, 450, 500, 600, 800],
  kg: [10, 12, 15, 20, 24, 25, 30, 40, 45, 50, 60, 75, 80, 100, 120, 150],
  'tấn': [5, 6, 8, 10, 12, 15, 20, 24, 25, 30, 40, 50, 60, 75, 80, 100],
}
const CTX = [
  { k: 'muoi', max: 25, loai: 'dd', obj: 'dung dịch nước muối', ct: 'muối', u: 'g', khac: 'nước', tr: 'Trộn', pc: [0.9, 1, 1.5, 2, 2.5, 3, 4, 4.5, 5, 6, 7.5, 8, 10, 12, 15, 20] },
  { k: 'duong', max: 60, loai: 'dd', obj: 'dung dịch nước đường', ct: 'đường', u: 'g', khac: 'nước', tr: 'Trộn', pc: [2, 2.5, 4, 5, 6, 8, 10, 12, 15, 20, 25, 30, 40] },
  { k: 'con', max: 96, loai: 'dd', obj: 'dung dịch cồn', ct: 'cồn', u: 'g', khac: 'nước', tr: 'Trộn', pc: [30, 40, 45, 50, 60, 70, 75, 80, 90] },
  { k: 'hk', max: 95, loai: 'kl', obj: 'hợp kim', ct: 'đồng', u: 'kg', khac: 'kim loại khác', tr: 'Nấu chảy chung', pc: [20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80] },
  { k: 'quang', max: 95, loai: 'kl', obj: 'quặng', ct: 'sắt', u: 'tấn', khac: 'tạp chất', tr: 'Trộn', pc: [30, 35, 40, 45, 50, 55, 60, 65, 70, 72, 75, 80] },
  { k: 'sua', max: 10, loai: 'sua', obj: 'sữa', ct: 'chất béo', u: 'kg', khac: 'phần còn lại', tr: 'Trộn', pc: [1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 6] },
]
const DD = CTX.filter((c) => c.loai === 'dd'), HK_ = CTX.filter((c) => c.k === 'hk')
const masP = (c) => Rn(pick(MAS[c.u])), pcP = (c) => Rn(pick(c.pc))
const lab = (c, m, a) => `$${fmt(m)}$ ${c.u} ${c.obj} $${P(a)}$`           // "$100$ g dung dịch nước muối $3\%$"
const chua = (c, a) => `chứa ${fmt(a)}% ${c.ct}`
const hoiP = (c) => `bao nhiêu phần trăm ${c.ct}`

// ============================================================================
// NDB02777 — TRỘN A VÀ B ĐỂ TÌM HỖN HỢP
// ============================================================================
const mkTr = (mau, nd, da, lg) => ({ dang: D.TRON, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })

function trAB(c, hai, nuoc) {   // hai = 2 phần, ngược lại 3 phần; nuoc = hỏi % nước (chỉ dung dịch)
  const n = hai ? 2 : 3, m = [], a = [], C = []
  for (let i = 0; i < n; i++) { m.push(masP(c)); a.push(pcP(c)); C.push(ofp(m[i], a[i])); if (!ok(C[i], 2)) return null }
  if (new Set(m.map(fmt)).size < n || new Set(a.map(fmt)).size < n) return null
  const T = m.reduce((s, x) => s.add(x), new R(0n)), Cs = C.reduce((s, x) => s.add(x), new R(0n)), p = Cs.div(T).mul(H100)
  if (!ok(p, 1) || !ok(Cs, 2)) return null
  const u = c.u, ct = c.ct, obj = c.obj, g = m.map((x, i) => `${fmt(x)} ${u} ${obj} ${chua(c, a[i])}`)
  let nd
  if (hai && nuoc) nd = pick([
    `${c.tr} ${g[0]} với ${g[1]}. Hỏi hỗn hợp thu được chứa bao nhiêu phần trăm nước?`,
    `Có ${g[0]} và ${g[1]}. Nếu trộn hai loại này với nhau thì nước chiếm bao nhiêu phần trăm hỗn hợp?`,
    `Người ta đổ ${g[0]} vào ${g[1]} rồi khuấy đều. Tính tỉ số phần trăm nước trong hỗn hợp mới.`,
  ])
  else if (hai) nd = pick([
    `${c.tr} ${g[0]} với ${g[1]}. Hỏi hỗn hợp thu được chứa ${hoiP(c)}?`,
    `Có ${g[0]} và ${g[1]}. Nếu trộn hai loại này với nhau thì hỗn hợp có tỉ lệ ${ct} là bao nhiêu phần trăm?`,
    `Người ta đổ ${g[0]} vào ${g[1]} rồi khuấy đều. Tính tỉ số phần trăm ${ct} trong hỗn hợp mới.`,
  ])
  else nd = pick([
    `${c.tr} ${g[0]}, ${g[1]} và ${g[2]} với nhau. Hỏi hỗn hợp thu được chứa ${hoiP(c)}?`,
    `Người ta đổ chung ba loại vào một thùng: ${g[0]}, ${g[1]} và ${g[2]}. Tính tỉ số phần trăm ${ct} của hỗn hợp trong thùng.`,
  ])
  const dong = m.map((x, i) => `Khối lượng ${ct} trong ${lab(c, x, a[i])} là: $${fmt(x)}\\times ${P(a[i])}=${fmt(C[i])}$ (${u})`)
  dong.push(`Khối lượng ${ct} trong hỗn hợp là: $${C.map(fmt).join('+')}=${fmt(Cs)}$ (${u})`)
  dong.push(`Khối lượng hỗn hợp là: $${m.map(fmt).join('+')}=${fmt(T)}$ (${u})`)
  dong.push(`Tỉ số phần trăm ${ct} trong hỗn hợp là: $${fmt(Cs)}:${fmt(T)}=${fmt(Cs.div(T))}=${P(p)}$`)
  if (nuoc) {
    const nu = H100.sub(p)
    dong.push(`Tỉ số phần trăm nước trong hỗn hợp là: $100\\%-${P(p)}=${P(nu)}$`)
    const lg2 = loiGiai({
      matChot: `trong dung dịch, phần không phải ${ct} là nước. Tìm tỉ số phần trăm ${ct} của hỗn hợp trước (lượng ${ct} chia cho khối lượng hỗn hợp), rồi lấy $100\\%$ trừ đi để được tỉ số phần trăm nước.`,
      buoc: [
        `Tính lượng ${ct} trong từng phần bằng khối lượng nhân với tỉ số phần trăm ${ct} của phần đó.`,
        `Cộng hai lượng ${ct} và cộng khối lượng hai phần để được hỗn hợp.`,
        `Lấy lượng ${ct} chia cho khối lượng hỗn hợp để được tỉ số phần trăm ${ct}.`,
        `Lấy $100\\%$ trừ tỉ số phần trăm ${ct} vừa tìm để được tỉ số phần trăm nước.`,
      ],
      chuY: `đề hỏi tỉ số phần trăm nước, không phải ${ct}, nên không dừng lại ở bước 3.`,
      dong, dapSo: `$${P(nu)}$`,
    })
    return mkTr('tr_f', nd, `$${P(nu)}$`, lg2)
  }
  const lg = loiGiai({
    matChot: `khi trộn, khối lượng các phần cộng lại và lượng ${ct} của các phần cũng cộng lại. Tỉ số phần trăm ${ct} của hỗn hợp bằng lượng ${ct} trong hỗn hợp chia cho khối lượng hỗn hợp.`,
    buoc: [
      `Tính lượng ${ct} trong từng phần bằng cách lấy khối lượng nhân với tỉ số phần trăm ${ct} của phần đó.`,
      `Cộng các lượng ${ct} lại để được lượng ${ct} trong hỗn hợp.`,
      `Cộng khối lượng các phần để được khối lượng của hỗn hợp.`,
      `Lấy lượng ${ct} chia cho khối lượng hỗn hợp rồi đổi kết quả ra tỉ số phần trăm.`,
    ],
    chuY: `không cộng các tỉ số phần trăm rồi chia trung bình, vì các phần có khối lượng khác nhau nên đóng góp ${ct} khác nhau.`,
    dong, dapSo: `$${P(p)}$`,
  })
  return mkTr(hai ? 'tr_a' : 'tr_b', nd, `$${P(p)}$`, lg)
}

function trE(c) {   // phần thứ hai có khối lượng bằng k% phần đầu
  const m1 = masP(c), a1 = pcP(c), a2 = pcP(c), k = Rn(pick([50, 60, 75, 120, 125, 150, 250])), m2 = ofp(m1, k)
  if (a1.eq(a2) || !ok(m2, 1)) return null
  const C1 = ofp(m1, a1), C2 = ofp(m2, a2); if (!ok(C1, 2) || !ok(C2, 2)) return null
  const T = m1.add(m2), Cs = C1.add(C2), p = Cs.div(T).mul(H100); if (!ok(p, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `${c.tr} ${fmt(m1)} ${u} ${obj} ${chua(c, a1)} với ${obj} ${chua(c, a2)} có khối lượng bằng ${fmt(k)}% khối lượng loại đầu. Hỏi hỗn hợp thu được chứa ${hoiP(c)}?`,
    `Một người có ${fmt(m1)} ${u} ${obj} ${chua(c, a1)}. Người đó đổ thêm ${obj} ${chua(c, a2)} với khối lượng bằng ${fmt(k)}% khối lượng loại đầu rồi trộn đều. Tính tỉ số phần trăm ${ct} của hỗn hợp.`,
  ])
  const dong = [
    `Khối lượng loại thứ hai là: $${fmt(m1)}\\times ${P(k)}=${fmt(m2)}$ (${u})`,
    `Khối lượng ${ct} trong ${lab(c, m1, a1)} là: $${fmt(m1)}\\times ${P(a1)}=${fmt(C1)}$ (${u})`,
    `Khối lượng ${ct} trong ${lab(c, m2, a2)} là: $${fmt(m2)}\\times ${P(a2)}=${fmt(C2)}$ (${u})`,
    `Khối lượng ${ct} trong hỗn hợp là: $${fmt(C1)}+${fmt(C2)}=${fmt(Cs)}$ (${u})`,
    `Khối lượng hỗn hợp là: $${fmt(m1)}+${fmt(m2)}=${fmt(T)}$ (${u})`,
    `Tỉ số phần trăm ${ct} trong hỗn hợp là: $${fmt(Cs)}:${fmt(T)}=${fmt(Cs.div(T))}=${P(p)}$`,
  ]
  const lg = loiGiai({
    matChot: `đề không cho trực tiếp khối lượng loại thứ hai mà cho nó bằng $${P(k)}$ khối lượng loại đầu, nên phải tìm khối lượng đó trước, rồi mới cộng lượng ${ct} và khối lượng của hai loại.`,
    buoc: [
      `Tìm khối lượng loại thứ hai bằng cách lấy khối lượng loại đầu nhân với $${P(k)}$.`,
      `Tính lượng ${ct} trong từng loại bằng khối lượng nhân với tỉ số phần trăm ${ct} của loại đó.`,
      `Cộng lượng ${ct} của hai loại, cộng khối lượng của hai loại để được hỗn hợp.`,
      `Lấy lượng ${ct} chia cho khối lượng hỗn hợp rồi đổi ra tỉ số phần trăm.`,
    ],
    chuY: `$${P(k)}$ là so với khối lượng loại đầu, không phải so với khối lượng hỗn hợp.`,
    dong, dapSo: `$${P(p)}$`,
  })
  return mkTr('tr_e', nd, `$${P(p)}$`, lg)
}

// ============================================================================
// NDB02778 — CHO HỖN HỢP, TÌM NGƯỢC LẠI A VÀ B
// ============================================================================
const mkNg = (mau, nd, da, lg) => ({ dang: D.NGUOC, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })

/** tìm % của phần còn lại. kieuG: đề cho khối lượng CẢ HAI phần (ng_g); ngược lại đề cho tổng khối lượng hỗn hợp + phần đã biết (ng_a) */
function ngA(c, kieuG) {
  const m1 = masP(c), a1 = pcP(c), m2 = masP(c), b = pcP(c); if (b.eq(a1)) return null
  const T = m1.add(m2), Cm = ofp(m1, a1).add(ofp(m2, b)), m = Cm.div(T).mul(H100)
  if (!ok(m, 1) || !ok(ofp(T, m), 2) || !ok(ofp(m1, a1), 2) || !ok(ofp(m2, b), 2)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const Cmix = ofp(T, m), C1 = ofp(m1, a1), C2 = Cmix.sub(C1)
  let nd, dong
  if (kieuG) {
    nd = pick([
      `Trộn ${fmt(m1)} ${u} ${obj} ${chua(c, a1)} với ${fmt(m2)} ${u} ${obj} khác thì được hỗn hợp ${chua(c, m)}. Hỏi ${obj} khác đó chứa ${hoiP(c)}?`,
      `Cho ${fmt(m1)} ${u} ${obj} ${chua(c, a1)} hòa vào ${fmt(m2)} ${u} ${obj} loại khác, người ta được hỗn hợp ${chua(c, m)}. Tính tỉ số phần trăm ${ct} của loại ${obj} khác đó.`,
    ])
    dong = [
      `Khối lượng hỗn hợp là: $${fmt(m1)}+${fmt(m2)}=${fmt(T)}$ (${u})`,
      `Khối lượng ${ct} trong ${fmt(T)} ${u} hỗn hợp $${P(m)}$ là: $${fmt(T)}\\times ${P(m)}=${fmt(Cmix)}$ (${u})`,
      `Khối lượng ${ct} trong ${lab(c, m1, a1)} là: $${fmt(m1)}\\times ${P(a1)}=${fmt(C1)}$ (${u})`,
      `Khối lượng ${ct} trong loại còn lại là: $${fmt(Cmix)}-${fmt(C1)}=${fmt(C2)}$ (${u})`,
      `Tỉ số phần trăm ${ct} của loại còn lại là: $${fmt(C2)}:${fmt(m2)}=${fmt(C2.div(m2))}=${P(b)}$`,
    ]
  } else {
    nd = pick([
      `Để có ${fmt(T)} ${u} hỗn hợp ${chua(c, m)}, người ta trộn ${fmt(m1)} ${u} ${obj} ${chua(c, a1)} với một loại ${obj} khác. Hỏi loại ${obj} khác đó chứa ${hoiP(c)}?`,
      `Một hỗn hợp nặng ${fmt(T)} ${u}, ${chua(c, m)}, được tạo thành khi trộn ${fmt(m1)} ${u} ${obj} ${chua(c, a1)} với một loại ${obj} khác. Tính tỉ số phần trăm ${ct} của loại ${obj} khác đó.`,
      `Người ta pha ${fmt(T)} ${u} ${obj} ${chua(c, m)} từ hai loại, trong đó loại thứ nhất nặng ${fmt(m1)} ${u} và ${chua(c, a1)}. Hỏi loại thứ hai chứa ${hoiP(c)}?`,
    ])
    dong = [
      `Khối lượng ${ct} trong ${fmt(T)} ${u} hỗn hợp $${P(m)}$ là: $${fmt(T)}\\times ${P(m)}=${fmt(Cmix)}$ (${u})`,
      `Khối lượng ${ct} trong ${lab(c, m1, a1)} là: $${fmt(m1)}\\times ${P(a1)}=${fmt(C1)}$ (${u})`,
      `Khối lượng loại còn lại là: $${fmt(T)}-${fmt(m1)}=${fmt(m2)}$ (${u})`,
      `Khối lượng ${ct} trong loại còn lại là: $${fmt(Cmix)}-${fmt(C1)}=${fmt(C2)}$ (${u})`,
      `Tỉ số phần trăm ${ct} của loại còn lại là: $${fmt(C2)}:${fmt(m2)}=${fmt(C2.div(m2))}=${P(b)}$`,
    ]
  }
  const lg = loiGiai({
    matChot: `đây là bài trộn ngược: đã biết hỗn hợp và một phần, cần tìm phần còn lại. Lượng ${ct} của hỗn hợp bằng lượng ${ct} của hai phần cộng lại, nên lượng ${ct} của phần còn lại bằng lượng ${ct} của hỗn hợp trừ lượng ${ct} của phần đã biết.`,
    buoc: [
      `Tính lượng ${ct} trong hỗn hợp và lượng ${ct} trong phần đã biết (khối lượng nhân tỉ số phần trăm).`,
      `Tìm khối lượng phần còn lại bằng cách lấy khối lượng hỗn hợp trừ khối lượng phần đã biết.`,
      `Lấy lượng ${ct} của hỗn hợp trừ lượng ${ct} của phần đã biết để được lượng ${ct} trong phần còn lại.`,
      `Lấy lượng ${ct} đó chia cho khối lượng phần còn lại rồi đổi ra tỉ số phần trăm.`,
    ],
    chuY: `tỉ số phần trăm của phần còn lại phải tính trên khối lượng của chính nó, không tính trên khối lượng hỗn hợp.`,
    dong, dapSo: `$${P(b)}$`,
  })
  return mkNg(kieuG ? 'ng_g' : 'ng_a', nd, `$${P(b)}$`, lg)
}

/** biết m1 (loại a%), % loại b, % hỗn hợp → khối lượng loại b (phần chênh nồng độ) hoặc tổng hỗn hợp */
function ngB(c, hoiTong) {
  const m1 = masP(c), a = pcP(c), b = pcP(c); if (a.eq(b)) return null
  const k = Rn(pick([0.25, 0.4, 0.5, 0.6, 0.75, 1, 1.5, 2, 3])), Y = m1.mul(k); if (!ok(Y, 1)) return null
  const m = a.mul(m1).add(b.mul(Y)).div(m1.add(Y)); if (!ok(m, 1) || m.eq(a) || m.eq(b)) return null
  const dA = a.lt(m) ? m.sub(a) : a.sub(m), dB = b.lt(m) ? m.sub(b) : b.sub(m), X = ofp(m1, dA)
  if (!ok(X, 2) || !Y.eq(X.div(dB.div(H100)))) return null
  const u = c.u, ct = c.ct, obj = c.obj, tong = m1.add(Y)
  const nd = hoiTong
    ? `Người ta trộn ${fmt(m1)} ${u} ${obj} ${chua(c, a)} với ${obj} ${chua(c, b)} để được hỗn hợp ${chua(c, m)}. Hỏi sau khi trộn thu được bao nhiêu ${u} hỗn hợp?`
    : pick([
      `Trộn ${fmt(m1)} ${u} ${obj} ${chua(c, a)} với một lượng ${obj} ${chua(c, b)} thì được hỗn hợp ${chua(c, m)}. Hỏi phải dùng bao nhiêu ${u} ${obj} loại ${fmt(b)}% ${ct}?`,
      `Một người có ${fmt(m1)} ${u} ${obj} ${chua(c, a)}. Người đó cần trộn thêm ${obj} ${chua(c, b)} để được hỗn hợp ${chua(c, m)}. Hỏi phải trộn thêm bao nhiêu ${u} ${obj} loại ${fmt(b)}% ${ct}?`,
    ])
  const tha = (x) => (x.lt(m) ? 'thấp hơn' : 'cao hơn')
  const dong = [
    `Tỉ số phần trăm ${ct} của loại thứ nhất ${tha(a)} hỗn hợp: $${a.lt(m) ? `${P(m)}-${P(a)}` : `${P(a)}-${P(m)}`}=${P(dA)}$`,
    `Lượng ${ct} chênh lệch của loại thứ nhất so với hỗn hợp là: $${fmt(m1)}\\times ${P(dA)}=${fmt(X)}$ (${u})`,
    `Tỉ số phần trăm ${ct} của loại thứ hai ${tha(b)} hỗn hợp: $${b.lt(m) ? `${P(m)}-${P(b)}` : `${P(b)}-${P(m)}`}=${P(dB)}$`,
    `Khối lượng loại thứ hai cần dùng là: $${fmt(X)}:${P(dB)}=${fmt(Y)}$ (${u})`,
  ]
  if (hoiTong) dong.push(`Khối lượng hỗn hợp thu được là: $${fmt(m1)}+${fmt(Y)}=${fmt(tong)}$ (${u})`)
  const da = hoiTong ? `$${fmt(tong)}$ ${u}` : `$${fmt(Y)}$ ${u}`
  const lg = loiGiai({
    matChot: `tỉ số phần trăm ${ct} của hỗn hợp nằm giữa tỉ số của hai loại: loại này thiếu bao nhiêu ${ct} so với hỗn hợp thì loại kia thừa đúng bấy nhiêu. Dùng chỗ thiếu và chỗ thừa bù nhau để tìm khối lượng loại chưa biết.`,
    buoc: [
      `Tìm loại thứ nhất chênh lệch bao nhiêu phần trăm ${ct} so với hỗn hợp (lấy số lớn trừ số bé).`,
      `Nhân khối lượng loại thứ nhất với phần trăm chênh lệch để được lượng ${ct} chênh lệch của cả loại.`,
      `Tìm loại thứ hai chênh lệch bao nhiêu phần trăm ${ct} so với hỗn hợp, theo chiều ngược lại với loại thứ nhất.`,
      hoiTong ? `Lượng ${ct} chênh lệch chia cho phần trăm chênh lệch của loại thứ hai được khối lượng loại thứ hai, rồi cộng với loại thứ nhất.` : `Lượng ${ct} chênh lệch của loại thứ nhất chia cho phần trăm chênh lệch của loại thứ hai được khối lượng loại thứ hai.`,
    ],
    chuY: `hai chỗ chênh lệch phải bù nhau: loại một thiếu thì loại hai thừa, nên lượng ${ct} chênh lệch của hai loại bằng nhau.`,
    dong, dapSo: da,
  })
  return mkNg(hoiTong ? 'ng_h' : 'ng_b', nd, da, lg)
}

/** biết tổng khối lượng, % hai loại, % hỗn hợp → khối lượng từng loại (giả thiết tạm) */
function ngC(c) {
  const X = masP(c), Y = masP(c); if (X.eq(Y)) return null
  let a = pcP(c), b = pcP(c); if (a.eq(b)) return null; if (b.lt(a)) [a, b] = [b, a]
  const T = X.add(Y), m = a.mul(X).add(b.mul(Y)).div(T); if (!ok(m, 1)) return null
  const Ca = ofp(T, a), Cm = ofp(T, m); if (!ok(Ca, 2) || !ok(Cm, 2)) return null
  const D_ = Cm.sub(Ca), d = b.sub(a); if (!Y.eq(D_.div(d.div(H100)))) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `Người ta trộn hai loại ${obj}, một loại ${chua(c, a)} và một loại ${chua(c, b)}, để được ${fmt(T)} ${u} hỗn hợp ${chua(c, m)}. Hỏi phải dùng mỗi loại bao nhiêu ${u}?`,
    `Cần pha ${fmt(T)} ${u} hỗn hợp từ hai loại ${obj}: loại nhẹ ${chua(c, a)} và loại đậm ${chua(c, b)}, sao cho hỗn hợp ${chua(c, m)}. Hỏi cần lấy mỗi loại bao nhiêu ${u}?`,
    `Trộn ${obj} ${chua(c, a)} với ${obj} ${chua(c, b)} được ${fmt(T)} ${u} hỗn hợp ${chua(c, m)}. Tính khối lượng của mỗi loại đã trộn.`,
  ])
  const da = `Loại $${P(a)}$: $${fmt(X)}$ ${u}; loại $${P(b)}$: $${fmt(Y)}$ ${u}`
  const dong = [
    `Giả sử cả ${fmt(T)} ${u} đều là ${obj} loại $${P(a)}$, khi đó khối lượng ${ct} là: $${fmt(T)}\\times ${P(a)}=${fmt(Ca)}$ (${u})`,
    `Khối lượng ${ct} thực tế trong hỗn hợp là: $${fmt(T)}\\times ${P(m)}=${fmt(Cm)}$ (${u})`,
    `Khối lượng ${ct} còn thiếu so với thực tế là: $${fmt(Cm)}-${fmt(Ca)}=${fmt(D_)}$ (${u})`,
    `Mỗi ${u} loại $${P(a)}$ được thay bằng một ${u} loại $${P(b)}$ thì lượng ${ct} tăng thêm: $${P(b)}-${P(a)}=${P(d)}$ (của mỗi ${u})`,
    `Khối lượng ${obj} loại $${P(b)}$ là: $${fmt(D_)}:${P(d)}=${fmt(Y)}$ (${u})`,
    `Khối lượng ${obj} loại $${P(a)}$ là: $${fmt(T)}-${fmt(Y)}=${fmt(X)}$ (${u})`,
  ]
  const lg = loiGiai({
    matChot: `dùng phương pháp giả thiết tạm: giả sử cả hỗn hợp chỉ toàn loại $${P(a)}$ ${ct}, so với thực tế sẽ thiếu một lượng ${ct}. Mỗi lần thay một ${u} loại thấp bằng một ${u} loại đậm thì lượng ${ct} tăng một lượng cố định, từ đó tìm được số ${u} phải thay.`,
    buoc: [
      `Giả sử toàn bộ hỗn hợp là loại có $${P(a)}$ ${ct} rồi tính lượng ${ct} nếu giả sử như vậy.`,
      `Tính lượng ${ct} thực tế của hỗn hợp, rồi lấy trừ đi lượng vừa giả sử để biết còn thiếu bao nhiêu.`,
      `Tìm lượng ${ct} tăng thêm khi thay một ${u} loại $${P(a)}$ bằng một ${u} loại $${P(b)}$ ${ct}.`,
      `Lấy lượng ${ct} còn thiếu chia cho lượng tăng thêm của mỗi ${u} để được khối lượng loại $${P(b)}$ ${ct}.`,
      `Lấy khối lượng hỗn hợp trừ khối lượng loại $${P(b)}$ để được khối lượng loại $${P(a)}$.`,
    ],
    chuY: `đề hỏi khối lượng của CẢ HAI loại nên phải ghi đủ hai đáp số, không dừng lại ở khối lượng vừa tìm được.`,
    thuLai: `$${fmt(X)}\\times ${P(a)}+${fmt(Y)}\\times ${P(b)}=${fmt(ofp(X, a))}+${fmt(ofp(Y, b))}=${fmt(Cm)}$ (${u}), đúng bằng lượng ${ct} của hỗn hợp.`,
    dong, dapSo: da,
  })
  return mkNg('ng_c', nd, da, lg)
}

// ============================================================================
// NDB03004 — PHA LOÃNG / CÔ ĐẶC
// ============================================================================
const mkPl = (mau, nd, da, lg) => ({ dang: D.LOANG, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })
const MAS_PL = { g: [100, 150, 200, 240, 250, 300, 400, 450, 500, 600, 800], kg: [10, 12, 15, 20, 24, 25, 30, 40, 50, 60, 80, 100] }
const masPL = (c) => Rn(pick(MAS_PL[c.u]))
const pcPL = (c) => Rn(pick(c.pc.filter((x) => x <= 40)))

function plA(c) {   // thêm nước → %
  const M = masPL(c), a = pcPL(c), w = Rn(pick([20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 200, 250, 300])); const C = ofp(M, a)
  const T = M.add(w), p = C.div(T).mul(H100); if (!ok(C, 2) || !ok(p, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `Có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Người ta đổ thêm ${fmt(w)} ${u} nước cất vào dung dịch đó. Hỏi dung dịch lúc sau chứa ${hoiP(c)}?`,
    `Một bình đựng ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Sau khi thêm ${fmt(w)} ${u} nước tinh khiết vào bình, tỉ số phần trăm ${ct} trong bình là bao nhiêu?`,
  ])
  const lg = loiGiai({
    matChot: `thêm nước thì lượng ${ct} không đổi, chỉ có khối lượng dung dịch tăng lên. Tìm lượng ${ct} trước, tìm khối lượng dung dịch lúc sau rồi chia để có tỉ số phần trăm mới.`,
    buoc: [
      `Tính lượng ${ct} có trong dung dịch lúc đầu bằng cách lấy khối lượng nhân với $${P(a)}$.`,
      `Lượng ${ct} này không đổi khi thêm nước nên giữ nguyên cho dung dịch lúc sau.`,
      `Cộng khối lượng nước thêm vào khối lượng ban đầu để được khối lượng dung dịch lúc sau.`,
      `Lấy lượng ${ct} chia cho khối lượng dung dịch lúc sau rồi đổi ra tỉ số phần trăm.`,
    ],
    chuY: `phải chia cho khối lượng dung dịch LÚC SAU (đã có nước thêm vào), không chia cho khối lượng lúc đầu.`,
    dong: [
      `Khối lượng ${ct} không đổi.`,
      `Khối lượng ${ct} trong ${fmt(M)} ${u} dung dịch là: $${fmt(M)}\\times ${P(a)}=${fmt(C)}$ (${u})`,
      `Khối lượng dung dịch lúc sau là: $${fmt(M)}+${fmt(w)}=${fmt(T)}$ (${u})`,
      `Tỉ số phần trăm ${ct} lúc sau là: $${fmt(C)}:${fmt(T)}=${fmt(C.div(T))}=${P(p)}$`,
    ], dapSo: `$${P(p)}$`,
  })
  return mkPl('pl_a', nd, `$${P(p)}$`, lg)
}
function plB(c) {   // cần thêm bao nhiêu nước để đạt b%
  const M = masPL(c), a = pcPL(c), b = pcPL(c); if (!b.lt(a)) return null
  const C = ofp(M, a), T = C.div(b.div(H100)), w = T.sub(M); if (!ok(C, 2) || !ok(T, 1) || !w.duong || !ok(w, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `Có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Cần đổ thêm bao nhiêu ${u} nước cất để được dung dịch ${chua(c, b)}?`,
    `Muốn làm loãng ${fmt(M)} ${u} ${obj} ${chua(c, a)} thành dung dịch ${chua(c, b)} thì phải thêm bao nhiêu ${u} nước tinh khiết?`,
  ])
  const lg = loiGiai({
    matChot: `thêm nước thì lượng ${ct} không đổi. Lượng ${ct} đó chiếm $${P(b)}$ khối lượng dung dịch lúc sau, nên tìm được khối lượng dung dịch lúc sau; hiệu hai khối lượng chính là nước cần thêm.`,
    buoc: [
      `Tính lượng ${ct} trong dung dịch lúc đầu bằng cách lấy khối lượng nhân với $${P(a)}$.`,
      `Lượng ${ct} này chiếm $${P(b)}$ dung dịch lúc sau nên lấy lượng ${ct} chia cho $${P(b)}$.`,
      `Lấy khối lượng dung dịch lúc sau trừ khối lượng lúc đầu để được khối lượng nước cần thêm.`,
    ],
    chuY: `$${P(b)}$ là của dung dịch lúc sau, không phải của ${fmt(M)} ${u} lúc đầu.`,
    thuLai: `$${fmt(T)}\\times ${P(b)}=${fmt(C)}$ (${u}), đúng bằng lượng ${ct} ban đầu.`,
    dong: [
      `Khối lượng ${ct} không đổi.`,
      `Khối lượng ${ct} trong ${fmt(M)} ${u} dung dịch là: $${fmt(M)}\\times ${P(a)}=${fmt(C)}$ (${u})`,
      `Khối lượng dung dịch lúc sau là: $${fmt(C)}:${P(b)}=${fmt(T)}$ (${u})`,
      `Khối lượng nước cần thêm là: $${fmt(T)}-${fmt(M)}=${fmt(w)}$ (${u})`,
    ], dapSo: `$${fmt(w)}$ ${u}`,
  })
  return mkPl('pl_b', nd, `$${fmt(w)}$ ${u}`, lg)
}
function plC(c) {   // bay hơi → %
  const M = masPL(c), a = pcPL(c), w = Rn(pick([10, 20, 25, 40, 50, 60, 75, 80, 100, 120, 150, 200])); if (!w.lt(M)) return null
  const C = ofp(M, a), T = M.sub(w), p = C.div(T).mul(H100); if (!ok(C, 2) || !ok(p, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `Đun ${fmt(M)} ${u} ${obj} ${chua(c, a)} cho bay hơi bớt ${fmt(w)} ${u} nước. Hỏi dung dịch còn lại chứa ${hoiP(c)}?`,
    `Một nồi có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Sau khi đun sôi, ${fmt(w)} ${u} nước đã bay hơi. Tính tỉ số phần trăm ${ct} của dung dịch còn lại trong nồi.`,
  ])
  const lg = loiGiai({
    matChot: `đun cho bay hơi thì chỉ có nước mất đi, lượng ${ct} không đổi. Dung dịch nhẹ đi nên ${ct} chiếm tỉ số phần trăm lớn hơn lúc đầu.`,
    buoc: [
      `Tính lượng ${ct} trong dung dịch lúc đầu bằng cách lấy khối lượng nhân với $${P(a)}$.`,
      `Lượng ${ct} này không đổi sau khi đun vì chỉ có nước bay hơi.`,
      `Lấy khối lượng lúc đầu trừ khối lượng nước bay hơi để được khối lượng dung dịch còn lại.`,
      `Lấy lượng ${ct} chia cho khối lượng dung dịch còn lại rồi đổi ra tỉ số phần trăm.`,
    ],
    chuY: `phải chia cho khối lượng dung dịch CÒN LẠI sau khi đun, không chia cho khối lượng lúc đầu.`,
    dong: [
      `Khối lượng ${ct} không đổi.`,
      `Khối lượng ${ct} trong ${fmt(M)} ${u} dung dịch là: $${fmt(M)}\\times ${P(a)}=${fmt(C)}$ (${u})`,
      `Khối lượng dung dịch còn lại là: $${fmt(M)}-${fmt(w)}=${fmt(T)}$ (${u})`,
      `Tỉ số phần trăm ${ct} lúc sau là: $${fmt(C)}:${fmt(T)}=${fmt(C.div(T))}=${P(p)}$`,
    ], dapSo: `$${P(p)}$`,
  })
  return mkPl('pl_c', nd, `$${P(p)}$`, lg)
}
function plD(c) {   // bay hơi bao nhiêu để đạt b%
  const M = masPL(c), a = pcPL(c), b = pcPL(c); if (!a.lt(b)) return null
  const C = ofp(M, a), T = C.div(b.div(H100)), w = M.sub(T); if (!ok(C, 2) || !ok(T, 1) || !w.duong || !ok(w, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = pick([
    `Cần đun cho bay hơi bớt bao nhiêu ${u} nước trong ${fmt(M)} ${u} ${obj} ${chua(c, a)} để được dung dịch ${chua(c, b)}?`,
    `Có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Muốn dung dịch đặc lại thành ${fmt(b)}% ${ct} thì phải cho bay hơi bao nhiêu ${u} nước?`,
  ])
  const lg = loiGiai({
    matChot: `khi bay hơi, lượng ${ct} không đổi và chiếm $${P(b)}$ khối lượng dung dịch lúc sau. Tìm khối lượng dung dịch lúc sau, rồi lấy khối lượng lúc đầu trừ đi để biết bao nhiêu nước đã bay hơi.`,
    buoc: [
      `Tính lượng ${ct} trong dung dịch lúc đầu bằng cách lấy khối lượng nhân với $${P(a)}$.`,
      `Lượng ${ct} này chiếm $${P(b)}$ dung dịch lúc sau nên lấy lượng ${ct} chia cho $${P(b)}$.`,
      `Lấy khối lượng lúc đầu trừ khối lượng lúc sau để được khối lượng nước bay hơi.`,
    ],
    chuY: `khối lượng lúc sau nhỏ hơn lúc đầu nên phép trừ cuối cùng lấy lúc đầu trừ lúc sau.`,
    thuLai: `$${fmt(T)}\\times ${P(b)}=${fmt(C)}$ (${u}), đúng bằng lượng ${ct} ban đầu.`,
    dong: [
      `Khối lượng ${ct} không đổi.`,
      `Khối lượng ${ct} trong ${fmt(M)} ${u} dung dịch là: $${fmt(M)}\\times ${P(a)}=${fmt(C)}$ (${u})`,
      `Khối lượng dung dịch lúc sau là: $${fmt(C)}:${P(b)}=${fmt(T)}$ (${u})`,
      `Khối lượng nước đã bay hơi là: $${fmt(M)}-${fmt(T)}=${fmt(w)}$ (${u})`,
    ], dapSo: `$${fmt(w)}$ ${u}`,
  })
  return mkPl('pl_d', nd, `$${fmt(w)}$ ${u}`, lg)
}
function plE(c) {   // thêm chất tan → %
  const M = masPL(c), a = pcPL(c), s = Rn(pick([5, 10, 12, 15, 20, 25, 30, 40, 50, 60])); const C = ofp(M, a)
  const C2 = C.add(s), T = M.add(s), p = C2.div(T).mul(H100); if (!ok(C, 2) || !ok(p, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = c.loai === 'dd'
    ? pick([
      `Có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Người ta hòa thêm ${fmt(s)} ${u} ${ct} nguyên chất vào dung dịch đó. Hỏi dung dịch mới chứa ${hoiP(c)}?`,
      `Một bình đựng ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Cho thêm ${fmt(s)} ${u} ${ct} tinh khiết vào bình và khuấy tan hết. Tính tỉ số phần trăm ${ct} trong bình lúc sau.`,
    ])
    : `Nấu chảy ${fmt(M)} ${u} ${obj} ${chua(c, a)} cùng với ${fmt(s)} ${u} ${ct} nguyên chất. Hỏi khối ${obj} vừa nấu được chứa ${hoiP(c)}?`
  const lg = loiGiai({
    matChot: `thêm ${ct} nguyên chất thì cả lượng ${ct} lẫn khối lượng đều tăng đúng bằng lượng thêm vào. Tìm lượng ${ct} lúc sau và khối lượng lúc sau rồi mới chia.`,
    buoc: [
      `Tính lượng ${ct} lúc đầu bằng cách lấy khối lượng nhân với $${P(a)}$.`,
      `Cộng lượng ${ct} thêm vào để được lượng ${ct} lúc sau.`,
      `Cộng lượng ${ct} thêm vào khối lượng lúc đầu để được khối lượng lúc sau.`,
      `Lấy lượng ${ct} lúc sau chia cho khối lượng lúc sau rồi đổi ra tỉ số phần trăm.`,
    ],
    chuY: `lượng ${ct} thêm vào phải cộng cả vào tử (lượng ${ct}) lẫn mẫu (khối lượng), không chỉ cộng vào một bên.`,
    dong: [
      `Khối lượng ${ct} lúc đầu là: $${fmt(M)}\\times ${P(a)}=${fmt(C)}$ (${u})`,
      `Khối lượng ${ct} lúc sau là: $${fmt(C)}+${fmt(s)}=${fmt(C2)}$ (${u})`,
      `Khối lượng lúc sau là: $${fmt(M)}+${fmt(s)}=${fmt(T)}$ (${u})`,
      `Tỉ số phần trăm ${ct} lúc sau là: $${fmt(C2)}:${fmt(T)}=${fmt(C2.div(T))}=${P(p)}$`,
    ], dapSo: `$${P(p)}$`,
  })
  return mkPl('pl_e', nd, `$${P(p)}$`, lg)
}
function plF(c) {   // thêm bao nhiêu chất tan để đạt b% (phần còn lại không đổi)
  const M = masPL(c), a = pcPL(c), b = Rn(pick([5, 8, 10, 12, 15, 20, 25, 30, 40, 50, 60, 75, 80]))
  if (!a.lt(b) || !b.lt(Rn(c.max + 0.5))) return null
  const n1 = H100.sub(a), n2 = H100.sub(b), W = ofp(M, n1), T = W.div(n2.div(H100)), s = T.sub(M)
  if (!ok(W, 2) || !ok(T, 1) || !s.duong || !ok(s, 1)) return null
  const u = c.u, ct = c.ct, obj = c.obj, kh = c.khac
  const nd = c.loai === 'dd'
    ? pick([
      `Có ${fmt(M)} ${u} ${obj} ${chua(c, a)}. Cần hòa thêm bao nhiêu ${u} ${ct} nguyên chất vào để được dung dịch ${chua(c, b)}?`,
      `Muốn làm đặc ${fmt(M)} ${u} ${obj} ${chua(c, a)} thành dung dịch ${chua(c, b)} thì phải cho thêm bao nhiêu ${u} ${ct} tinh khiết?`,
    ])
    : `Cần nấu chảy ${fmt(M)} ${u} ${obj} ${chua(c, a)} cùng với bao nhiêu ${u} ${ct} nguyên chất để được khối ${obj} ${chua(c, b)}?`
  const lg = loiGiai({
    matChot: `khi chỉ thêm ${ct}, phần ${kh} không đổi. Tìm khối lượng phần ${kh} lúc đầu, rồi biết phần đó chiếm $${P(n2)}$ khối lượng lúc sau để tìm khối lượng lúc sau.`,
    buoc: [
      `Tìm phần ${kh} chiếm bao nhiêu phần trăm lúc đầu bằng cách lấy $100\\%$ trừ $${P(a)}$.`,
      `Tính khối lượng phần ${kh} lúc đầu rồi giữ nguyên số đó cho lúc sau.`,
      `Lúc sau phần ${kh} chiếm $100\\%-${P(b)}=${P(n2)}$, nên lấy khối lượng phần ${kh} chia cho $${P(n2)}$ để được khối lượng lúc sau.`,
      `Lấy khối lượng lúc sau trừ khối lượng lúc đầu để được lượng ${ct} cần thêm.`,
    ],
    chuY: `đừng lấy ${ct} làm đại lượng không đổi: bài này ${ct} tăng, còn phần ${kh} mới không đổi.`,
    dong: [
      `Khối lượng phần ${kh} không đổi.`,
      `Phần ${kh} lúc đầu chiếm: $100\\%-${P(a)}=${P(n1)}$`,
      `Khối lượng phần ${kh} là: $${fmt(M)}\\times ${P(n1)}=${fmt(W)}$ (${u})`,
      `Phần ${kh} lúc sau chiếm: $100\\%-${P(b)}=${P(n2)}$`,
      `Khối lượng lúc sau là: $${fmt(W)}:${P(n2)}=${fmt(T)}$ (${u})`,
      `Khối lượng ${ct} cần thêm là: $${fmt(T)}-${fmt(M)}=${fmt(s)}$ (${u})`,
    ], dapSo: `$${fmt(s)}$ ${u}`,
  })
  return mkPl('pl_f', nd, `$${fmt(s)}$ ${u}`, lg)
}
function plG(c, boc) {   // biết lượng nước thêm / bay hơi và % trước–sau → khối lượng ban đầu (hiệu–tỉ)
  const cap_ = boc ? [[3, 4], [3, 5], [4, 5], [6, 8], [2, 4], [5, 8], [3, 6], [6, 10], [9, 12], [12, 16]] : [[6, 4], [5, 4], [8, 4], [9, 6], [10, 8], [12, 8], [4, 2], [15, 10], [7.5, 5], [3, 2.4]]
  const [a0, b0] = pick(cap_), a = Rn(a0), b = Rn(b0), ratio = a.div(b), h = boc ? ONE.sub(ratio) : ratio.sub(ONE)
  if (!ok(ratio, 3) || !ok(h, 3)) return null
  const M = masPL(c), w = M.mul(h); if (!ok(w, 1) || !w.duong) return null
  const u = c.u, ct = c.ct, obj = c.obj
  const nd = boc
    ? pick([
      `Người ta đun cho bay hơi ${fmt(w)} ${u} nước của một bình ${obj} ${chua(c, a)} thì được dung dịch ${chua(c, b)}. Hỏi lúc đầu bình có bao nhiêu ${u} dung dịch?`,
      `Một nồi ${obj} ${chua(c, a)}. Sau khi đun bay hơi bớt ${fmt(w)} ${u} nước, dung dịch trong nồi ${chua(c, b)}. Hỏi lúc đầu trong nồi có bao nhiêu ${u} dung dịch?`,
    ])
    : pick([
      `Người ta đổ thêm ${fmt(w)} ${u} nước cất vào một bình ${obj} ${chua(c, a)} thì được dung dịch ${chua(c, b)}. Hỏi lúc đầu bình có bao nhiêu ${u} dung dịch?`,
      `Một thùng ${obj} ${chua(c, a)}. Sau khi thêm ${fmt(w)} ${u} nước tinh khiết, dung dịch trong thùng ${chua(c, b)}. Hỏi lúc đầu trong thùng có bao nhiêu ${u} dung dịch?`,
    ])
  const dong = boc
    ? [`Khối lượng ${ct} không đổi nên khối lượng dung dịch tỉ lệ nghịch với tỉ số phần trăm ${ct}.`,
      `Khối lượng dung dịch lúc sau bằng: $${P(a)}:${P(b)}=${fmt(ratio)}$ (lần khối lượng lúc đầu)`,
      `Khối lượng nước bay hơi bằng: $1-${fmt(ratio)}=${fmt(h)}$ (lần khối lượng lúc đầu)`,
      `Khối lượng dung dịch lúc đầu là: $${fmt(w)}:${fmt(h)}=${fmt(M)}$ (${u})`]
    : [`Khối lượng ${ct} không đổi nên khối lượng dung dịch tỉ lệ nghịch với tỉ số phần trăm ${ct}.`,
      `Khối lượng dung dịch lúc sau gấp khối lượng lúc đầu: $${P(a)}:${P(b)}=${fmt(ratio)}$ (lần)`,
      `Khối lượng nước đã thêm bằng: $${fmt(ratio)}-1=${fmt(h)}$ (lần khối lượng lúc đầu)`,
      `Khối lượng dung dịch lúc đầu là: $${fmt(w)}:${fmt(h)}=${fmt(M)}$ (${u})`]
  const lg = loiGiai({
    matChot: `lượng ${ct} không đổi, mà ${ct} chiếm $${P(a)}$ lúc đầu và $${P(b)}$ lúc sau, nên khối lượng dung dịch tỉ lệ nghịch với tỉ số phần trăm ${ct}. Từ đó tìm được khối lượng lúc sau bằng bao nhiêu lần lúc đầu, rồi dùng phần chênh ${boc ? 'bay hơi' : 'thêm nước'} để tìm khối lượng lúc đầu.`,
    buoc: [
      `Nhận ra lượng ${ct} không đổi, nên khối lượng dung dịch lúc sau gấp lúc đầu bằng tỉ số $${P(a)}:${P(b)}$.`,
      `Tính tỉ số $${P(a)}:${P(b)}$ để biết khối lượng lúc sau bằng bao nhiêu lần khối lượng lúc đầu.`,
      `Phần nước ${boc ? 'bay hơi' : 'đã thêm'} ứng với phần chênh lệch giữa $1$ lần và số lần vừa tìm.`,
      `Lấy khối lượng nước ${boc ? 'bay hơi' : 'đã thêm'} chia cho phần chênh lệch đó để được khối lượng lúc đầu.`,
    ],
    chuY: `tỉ số $${P(a)}:${P(b)}$ cho biết khối lượng lúc sau gấp mấy lần lúc đầu, không phải là khối lượng nước.`,
    dong, dapSo: `$${fmt(M)}$ ${u}`,
  })
  return mkPl(boc ? 'pl_h' : 'pl_g', nd, `$${fmt(M)}$ ${u}`, lg)
}

// ============================================================================
// NDB03005 — HẠT TƯƠI – HẠT KHÔ
// ============================================================================
const mkHk = (mau, nd, da, lg) => ({ dang: D.HAT, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })
const HK = [
  { tuoi: 'hạt cà phê tươi', kho: 'hạt cà phê khô', du: ['kg', 'tấn'] },
  { tuoi: 'hạt ngô tươi', kho: 'hạt ngô khô', du: ['kg'] },
  { tuoi: 'hạt điều tươi', kho: 'hạt điều khô', du: ['kg'] },
  { tuoi: 'hạt tiêu tươi', kho: 'hạt tiêu khô', du: ['kg'] },
  { tuoi: 'cỏ tươi', kho: 'cỏ khô', du: ['kg', 'tấn'] },
  { tuoi: 'gỗ tươi', kho: 'gỗ đã sấy khô', du: ['kg', 'tấn'] },
  { tuoi: 'thóc mới gặt', kho: 'thóc khô', du: ['kg', 'tấn'] },
  { tuoi: 'nho tươi', kho: 'nho khô', du: ['kg'] },
  { tuoi: 'xoài tươi', kho: 'xoài sấy khô', du: ['kg'] },
  { tuoi: 'hạt sen tươi', kho: 'hạt sen khô', du: ['kg'] },
]
const MH = [10, 12, 15, 20, 24, 25, 30, 40, 48, 50, 60, 64, 72, 75, 80, 90, 96, 100, 120, 150, 200, 240, 250, 300, 400, 500]
const AT = [25, 30, 35, 40, 45, 46, 50, 55, 60, 65, 68, 70, 72, 75, 80, 85, 88, 90], AK = [4, 5, 8, 10, 12, 14, 15, 16, 20, 25]
const tenU = (u) => (u === 'kg' ? 'ki-lô-gam' : 'tấn')
function hkTham() {   // trả { h, u, a, c, x, y }
  const h = pick(HK), u = pick(h.du), a = Rn(pick(AT)), c = Rn(pick(AK)); if (!c.lt(a)) return null
  return { h, u, a, c, x: H100.sub(a), y: H100.sub(c) }
}
function hkA(loai) {   // 'a' tìm khô từ tươi · 'b' tìm tươi từ khô · 'c' nước bay hơi
  const t = hkTham(); if (!t) return null; const { h, u, a, c, x, y } = t
  const M = Rn(pick(MH))
  if (loai === 'b') {
    const K = M, Dk = ofp(K, y), Tuoi = Dk.div(x.div(H100)); if (!ok(Dk, 2) || !ok(Tuoi, 1)) return null
    const nd = pick([
      `${cap(h.tuoi)} có ${fmt(a)}% nước, ${h.kho} có ${fmt(c)}% nước. Muốn có ${fmt(K)} ${u} ${h.kho} thì phải phơi bao nhiêu ${tenU(u)} ${h.tuoi}?`,
      `${cap(h.tuoi)} chứa ${fmt(a)}% nước, sau khi phơi thì ${h.kho} chứa ${fmt(c)}% nước. Để thu được ${fmt(K)} ${u} ${h.kho} cần dùng bao nhiêu ${tenU(u)} ${h.tuoi}?`,
    ])
    const lg = loiGiai({
      matChot: `phơi khô chỉ làm mất nước, nên khối lượng chất khô không đổi. Tìm khối lượng chất khô trong ${h.kho} rồi biết nó chiếm bao nhiêu phần trăm ${h.tuoi} để tìm khối lượng ${h.tuoi}.`,
      buoc: [
        `Tìm chất khô chiếm bao nhiêu phần trăm ${h.kho} bằng cách lấy $100\\%$ trừ $${P(c)}$.`,
        `Tính khối lượng chất khô trong ${fmt(K)} ${u} ${h.kho} rồi giữ nguyên số đó cho ${h.tuoi}.`,
        `Tìm chất khô chiếm bao nhiêu phần trăm ${h.tuoi} bằng cách lấy $100\\%$ trừ $${P(a)}$.`,
        `Lấy khối lượng chất khô chia cho phần trăm chất khô trong ${h.tuoi} để được khối lượng ${h.tuoi}.`,
      ],
      chuY: `${h.kho} vẫn còn $${P(c)}$ nước nên khối lượng chất khô chưa phải là khối lượng ${h.kho}.`,
      dong: [
        `Khối lượng chất khô không đổi.`,
        `Chất khô chiếm: $100\\%-${P(c)}=${P(y)}$ (${h.kho})`,
        `Khối lượng chất khô là: $${fmt(K)}\\times ${P(y)}=${fmt(Dk)}$ (${u})`,
        `Chất khô chiếm: $100\\%-${P(a)}=${P(x)}$ (${h.tuoi})`,
        `Khối lượng ${h.tuoi} cần phơi là: $${fmt(Dk)}:${P(x)}=${fmt(Tuoi)}$ (${u})`,
      ], dapSo: `$${fmt(Tuoi)}$ ${u}`,
    })
    return mkHk('hk_b', nd, `$${fmt(Tuoi)}$ ${u}`, lg)
  }
  const D_ = ofp(M, x), K = D_.div(y.div(H100)); if (!ok(D_, 2) || !ok(K, 1) || !K.lt(M)) return null
  const bay = M.sub(K); if (!ok(bay, 1)) return null
  const dong = [
    `Khối lượng chất khô không đổi.`,
    `Chất khô chiếm: $100\\%-${P(a)}=${P(x)}$ (${h.tuoi})`,
    `Khối lượng chất khô trong ${fmt(M)} ${u} ${h.tuoi} là: $${fmt(M)}\\times ${P(x)}=${fmt(D_)}$ (${u})`,
    `Chất khô chiếm: $100\\%-${P(c)}=${P(y)}$ (${h.kho})`,
    `Khối lượng ${h.kho} thu được là: $${fmt(D_)}:${P(y)}=${fmt(K)}$ (${u})`,
  ]
  const chung = (mauk) => ({
    matChot: `phơi khô chỉ làm mất nước, nên khối lượng chất khô không đổi. Tìm khối lượng chất khô trong ${h.tuoi}, rồi biết chất khô đó chiếm bao nhiêu phần trăm ${h.kho} để tìm khối lượng ${h.kho}${mauk === 'c' ? '; lượng nước bay hơi là phần chênh lệch' : ''}.`,
    buoc: [
      `Tìm chất khô chiếm bao nhiêu phần trăm ${h.tuoi} bằng cách lấy $100\\%$ trừ $${P(a)}$.`,
      `Tính khối lượng chất khô trong ${fmt(M)} ${u} ${h.tuoi} và giữ nguyên số đó cho ${h.kho}.`,
      `Tìm chất khô chiếm bao nhiêu phần trăm ${h.kho} bằng cách lấy $100\\%$ trừ $${P(c)}$.`,
      mauk === 'c' ? `Lấy khối lượng chất khô chia cho phần trăm đó để được khối lượng ${h.kho}, rồi lấy khối lượng ${h.tuoi} trừ đi để được lượng nước bay hơi.` : `Lấy khối lượng chất khô chia cho phần trăm chất khô trong ${h.kho} để được khối lượng ${h.kho}.`,
    ],
    chuY: mauk === 'c' ? `đề hỏi lượng NƯỚC bay hơi, không hỏi khối lượng ${h.kho}.` : `${h.kho} vẫn còn $${P(c)}$ nước nên khối lượng chất khô chưa phải là khối lượng ${h.kho}.`,
  })
  if (loai === 'c') {
    dong.push(`Khối lượng nước đã bay hơi là: $${fmt(M)}-${fmt(K)}=${fmt(bay)}$ (${u})`)
    const nd = pick([
      `${cap(h.tuoi)} có ${fmt(a)}% nước, ${h.kho} có ${fmt(c)}% nước. Khi phơi ${fmt(M)} ${u} ${h.tuoi} thành ${h.kho}, có bao nhiêu ${tenU(u)} nước đã bay hơi?`,
      `Lượng nước trong ${h.tuoi} là ${fmt(a)}%, trong ${h.kho} là ${fmt(c)}%. Người ta phơi ${fmt(M)} ${u} ${h.tuoi}. Hỏi lượng nước bay hơi khi phơi là bao nhiêu ${tenU(u)}?`,
    ])
    return mkHk('hk_c', nd, `$${fmt(bay)}$ ${u}`, loiGiai({ ...chung('c'), dong, dapSo: `$${fmt(bay)}$ ${u}` }))
  }
  const nd = pick([
    `${cap(h.tuoi)} có ${fmt(a)}% nước, ${h.kho} có ${fmt(c)}% nước. Hỏi nếu phơi khô ${fmt(M)} ${u} ${h.tuoi} thì thu được bao nhiêu ${tenU(u)} ${h.kho}?`,
    `Lượng nước trong ${h.tuoi} là ${fmt(a)}%, trong ${h.kho} là ${fmt(c)}%. Phơi ${fmt(M)} ${u} ${h.tuoi} cho đến khi thành ${h.kho}. Hỏi thu được bao nhiêu ${tenU(u)} ${h.kho}?`,
    `Người ta thu hoạch ${fmt(M)} ${u} ${h.tuoi} chứa ${fmt(a)}% nước. Sau khi phơi, ${h.kho} chỉ còn ${fmt(c)}% nước. Hỏi khối lượng ${h.kho} thu được là bao nhiêu ${tenU(u)}?`,
  ])
  return mkHk('hk_a', nd, `$${fmt(K)}$ ${u}`, loiGiai({ ...chung('a'), dong, dapSo: `$${fmt(K)}$ ${u}` }))
}
function hkD(loai) {   // d: M, K, a → % nước khô · e: M, nhẹ w, a → % nước khô · f: M, K, c → % nước tươi
  const t = hkTham(); if (!t) return null; const { h, u, a, c, x, y } = t
  const M = Rn(pick(MH)), Dm = ofp(M, x), K = Dm.div(y.div(H100)); if (!ok(Dm, 2) || !ok(K, 1) || !K.lt(M)) return null
  const w = M.sub(K); if (!ok(w, 1)) return null
  if (loai === 'f') {
    const Dk = ofp(K, y), xx = Dk.div(M); if (!ok(Dk, 2)) return null
    const nd = pick([
      `Phơi ${fmt(M)} ${u} ${h.tuoi} thì thu được ${fmt(K)} ${u} ${h.kho}, trong đó nước chiếm ${fmt(c)}%. Hỏi ${h.tuoi} lúc đầu có bao nhiêu phần trăm nước?`,
      `Từ ${fmt(M)} ${u} ${h.tuoi}, sau khi phơi người ta được ${fmt(K)} ${u} ${h.kho} có ${fmt(c)}% nước. Tính tỉ số phần trăm nước trong ${h.tuoi}.`,
    ])
    const lg = loiGiai({
      matChot: `chất khô không đổi khi phơi. Tìm khối lượng chất khô từ ${h.kho}, rồi cho biết nó chiếm bao nhiêu phần trăm ${h.tuoi}; phần còn lại là nước.`,
      buoc: [
        `Tìm chất khô chiếm bao nhiêu phần trăm ${h.kho} bằng cách lấy $100\\%$ trừ $${P(c)}$.`,
        `Tính khối lượng chất khô trong ${fmt(K)} ${u} ${h.kho}; số này không đổi khi phơi.`,
        `Lấy khối lượng chất khô chia cho khối lượng ${h.tuoi} để biết chất khô chiếm bao nhiêu phần trăm ${h.tuoi}.`,
        `Lấy $100\\%$ trừ phần trăm chất khô để được tỉ số phần trăm nước trong ${h.tuoi}.`,
      ],
      chuY: `đề hỏi phần trăm NƯỚC của ${h.tuoi}, nên bước cuối phải lấy $100\\%$ trừ đi phần trăm chất khô.`,
      dong: [
        `Khối lượng chất khô không đổi.`,
        `Chất khô chiếm: $100\\%-${P(c)}=${P(y)}$ (${h.kho})`,
        `Khối lượng chất khô là: $${fmt(K)}\\times ${P(y)}=${fmt(Dk)}$ (${u})`,
        `Chất khô chiếm số phần trăm ${h.tuoi} là: $${fmt(Dk)}:${fmt(M)}=${fmt(xx)}=${P(x)}$`,
        `Nước chiếm số phần trăm ${h.tuoi} là: $100\\%-${P(x)}=${P(a)}$`,
      ], dapSo: `$${P(a)}$`,
    })
    return mkHk('hk_f', nd, `$${P(a)}$`, lg)
  }
  const e = loai === 'e'
  const nd = e
    ? pick([
      `Lượng nước trong ${h.tuoi} là ${fmt(a)}%. Có ${fmt(M)} ${u} ${h.tuoi} sau khi phơi khô thì nhẹ đi ${fmt(w)} ${u}. Tính tỉ số phần trăm nước trong ${h.kho}.`,
      `${cap(h.tuoi)} chứa ${fmt(a)}% nước. Phơi ${fmt(M)} ${u} ${h.tuoi} thì khối lượng giảm ${fmt(w)} ${u}. Hỏi ${h.kho} chứa bao nhiêu phần trăm nước?`,
    ])
    : pick([
      `Lượng nước trong ${h.tuoi} là ${fmt(a)}%. Phơi ${fmt(M)} ${u} ${h.tuoi} thì thu được ${fmt(K)} ${u} ${h.kho}. Hỏi tỉ số phần trăm nước trong ${h.kho} là bao nhiêu?`,
      `${cap(h.tuoi)} chứa ${fmt(a)}% nước. Sau khi phơi ${fmt(M)} ${u} ${h.tuoi} người ta được ${fmt(K)} ${u} ${h.kho}. Tính tỉ số phần trăm nước còn lại trong ${h.kho}.`,
    ])
  const chiem = Dm.div(K)
  const dong = [`Khối lượng chất khô không đổi.`]
  if (e) dong.push(`Khối lượng ${h.kho} là: $${fmt(M)}-${fmt(w)}=${fmt(K)}$ (${u})`)
  dong.push(`Chất khô chiếm: $100\\%-${P(a)}=${P(x)}$ (${h.tuoi})`,
    `Khối lượng chất khô là: $${fmt(M)}\\times ${P(x)}=${fmt(Dm)}$ (${u})`,
    `Chất khô chiếm số phần trăm ${h.kho} là: $${fmt(Dm)}:${fmt(K)}=${fmt(chiem)}=${P(y)}$`,
    `Nước chiếm số phần trăm ${h.kho} là: $100\\%-${P(y)}=${P(c)}$`)
  const lg = loiGiai({
    matChot: `chất khô không đổi khi phơi. Tìm khối lượng chất khô từ ${h.tuoi}, rồi cho biết nó chiếm bao nhiêu phần trăm ${h.kho}; phần còn lại là nước.`,
    buoc: [
      ...(e ? [`Tìm khối lượng ${h.kho} bằng cách lấy khối lượng ${h.tuoi} trừ khối lượng đã nhẹ đi.`] : []),
      `Tìm chất khô chiếm bao nhiêu phần trăm ${h.tuoi} bằng cách lấy $100\\%$ trừ $${P(a)}$.`,
      `Tính khối lượng chất khô trong ${fmt(M)} ${u} ${h.tuoi}; số này không đổi khi phơi.`,
      `Lấy khối lượng chất khô chia cho khối lượng ${h.kho} để biết chất khô chiếm bao nhiêu phần trăm ${h.kho}.`,
      `Lấy $100\\%$ trừ phần trăm chất khô để được tỉ số phần trăm nước trong ${h.kho}.`,
    ],
    chuY: `đề hỏi phần trăm NƯỚC của ${h.kho}, nên bước cuối phải lấy $100\\%$ trừ đi phần trăm chất khô.`,
    dong, dapSo: `$${P(c)}$`,
  })
  return mkHk(e ? 'hk_e' : 'hk_d', nd, `$${P(c)}$`, lg)
}
function hkG(giam) {   // coi hạt tươi là 100%: khô bằng bao nhiêu % tươi / giảm bao nhiêu %
  const t = hkTham(); if (!t) return null; const { h, a, c, x, y } = t
  const k = x.div(y); if (!ok(k, 2) || !k.lt(ONE)) return null
  const kp = k.mul(H100), gi = H100.sub(kp)
  const nd = giam
    ? pick([
      `${cap(h.tuoi)} có ${fmt(a)}% nước, ${h.kho} có ${fmt(c)}% nước. Hỏi sau khi phơi, khối lượng giảm đi bao nhiêu phần trăm so với lúc còn tươi?`,
      `Lượng nước trong ${h.tuoi} là ${fmt(a)}%, trong ${h.kho} là ${fmt(c)}%. Khi phơi ${h.tuoi} thành ${h.kho} thì khối lượng giảm đi bao nhiêu phần trăm so với ban đầu?`,
    ])
    : pick([
      `${cap(h.tuoi)} có ${fmt(a)}% nước, ${h.kho} có ${fmt(c)}% nước. Hỏi khối lượng ${h.kho} bằng bao nhiêu phần trăm khối lượng ${h.tuoi} ban đầu?`,
      `Lượng nước trong ${h.tuoi} là ${fmt(a)}%, trong ${h.kho} là ${fmt(c)}%. Sau khi phơi, khối lượng ${h.kho} bằng bao nhiêu phần trăm khối lượng ${h.tuoi}?`,
    ])
  const dong = [
    `Coi khối lượng ${h.tuoi} là $100\\%$. Khối lượng chất khô không đổi.`,
    `Chất khô chiếm: $100\\%-${P(a)}=${P(x)}$ (${h.tuoi})`,
    `Chất khô chiếm: $100\\%-${P(c)}=${P(y)}$ (${h.kho})`,
    `Khối lượng ${h.kho} bằng: $${P(x)}:${P(y)}=${fmt(k)}=${P(kp)}$ (${h.tuoi})`,
  ]
  if (giam) dong.push(`Khối lượng đã giảm: $100\\%-${P(kp)}=${P(gi)}$ (${h.tuoi})`)
  const lg = loiGiai({
    matChot: `đề không cho khối lượng cụ thể nên coi khối lượng ${h.tuoi} là $100\\%$. Chất khô không đổi, mà chất khô đó chiếm $${P(x)}$ ${h.tuoi} và chiếm $${P(y)}$ ${h.kho}, từ đó so sánh được hai khối lượng.`,
    buoc: [
      `Coi khối lượng ${h.tuoi} là $100\\%$ và tìm chất khô chiếm bao nhiêu phần trăm của số đó.`,
      `Tìm chất khô chiếm bao nhiêu phần trăm ${h.kho} bằng cách lấy $100\\%$ trừ $${P(c)}$.`,
      `Chất khô là một lượng không đổi nên lấy hai phần trăm chất khô chia cho nhau để được khối lượng ${h.kho} so với ${h.tuoi}.`,
      ...(giam ? [`Lấy $100\\%$ trừ tỉ số vừa tìm để được phần khối lượng đã giảm.`] : []),
    ],
    chuY: giam ? `đề hỏi khối lượng GIẢM đi bao nhiêu phần trăm, không phải ${h.kho} bằng bao nhiêu phần trăm.` : `tỉ số tìm được là của ${h.kho} so với ${h.tuoi}, nên đáp số nhỏ hơn $100\\%$.`,
    dong, dapSo: giam ? `$${P(gi)}$` : `$${P(kp)}$`,
  })
  return mkHk(giam ? 'hk_g2' : 'hk_g1', nd, giam ? `$${P(gi)}$` : `$${P(kp)}$`, lg)
}

// ============================================================================
// NDB03006 — TĂNG / GIẢM LIÊN TIẾP MỘT ĐẠI LƯỢNG
// ============================================================================
const mkTg = (mau, nd, da, lg) => ({ dang: D.LIEN_TIEP, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })
const SERIES = [
  ['tháng 1', 'tháng 2', 'tháng 3', 'tháng 4'], ['tháng 5', 'tháng 6', 'tháng 7', 'tháng 8'], ['tháng 9', 'tháng 10', 'tháng 11', 'tháng 12'],
  ['quý I', 'quý II', 'quý III', 'quý IV'], ['năm 2022', 'năm 2023', 'năm 2024', 'năm 2025'], ['năm 2020', 'năm 2021', 'năm 2022', 'năm 2023'],
]
const THING = [
  { th: 'giá một cân thịt bò', loai: 'tien' }, { th: 'giá một chiếc điện thoại', loai: 'tien' }, { th: 'giá một bộ bàn ghế', loai: 'tien' },
  { th: 'giá một cân cà phê', loai: 'tien' }, { th: 'giá một chiếc xe đạp', loai: 'tien' }, { th: 'giá một thùng sữa', loai: 'tien' },
  { th: 'giá một chiếc tủ lạnh', loai: 'tien' }, { th: 'giá một túi gạo', loai: 'tien' },
  { th: 'số dân của một thị trấn', loai: 'sl', un: 'người' }, { th: 'sản lượng lúa của một hợp tác xã', loai: 'sl', un: 'tấn' },
  { th: 'số khách tham quan một khu du lịch', loai: 'sl', un: 'lượt khách' }, { th: 'số xe máy một cửa hàng bán được', loai: 'sl', un: 'chiếc xe máy' },
  { th: 'số quyển sách của một thư viện', loai: 'sl', un: 'quyển sách' },
]
const PCT_TG = [5, 10, 12, 15, 20, 25, 30, 40, 50, 60]
const dauTG = (w, a) => (w === 't' ? H100.add(a) : H100.sub(a))
const tg = (w) => (w === 't' ? 'tăng' : 'giảm')
const chuoiTG = (n) => Array.from({ length: n }, () => ({ w: rnd() < 0.5 ? 't' : 'g', a: Rn(pick(PCT_TG)) }))
const cauTG = (buoc, lb) => buoc.map((b, i) => `${lb[i + 1]} ${tg(b.w)} ${fmt(b.a)}% so với ${lb[i]}`)

function tgA(n3) {   // % so với đầu: 2 bước (tg_a) hoặc 3 bước (tg_c1)
  const n = n3 ? 3 : 2, b = chuoiTG(n); if (!n3 && rnd() < 0.3) b[1] = { w: b[0].w === 't' ? 'g' : 't', a: b[0].a }   // tăng/giảm cùng % (bẫy)
  const f = b.map((x) => dauTG(x.w, x.a))
  let acc = ONE; for (const x of f) acc = acc.mul(x.div(H100)); const kp = acc.mul(H100)
  if (!ok(kp, n3 ? 2 : 1) || kp.eq(H100)) return null
  const th = pick(THING), lb = pick(SERIES), ds = cauTG(b, lb), T = cap(th.th)
  const nd = !n3
    ? pick([
      `${T} ${ds[0]}, sang ${lb[2]} lại ${tg(b[1].w)} ${fmt(b[1].a)}% so với ${lb[1]}. Hỏi ${th.th} ${lb[2]} tăng hay giảm bao nhiêu phần trăm so với ${lb[0]}?`,
      `Từ ${lb[0]} đến ${lb[1]}, ${th.th} ${tg(b[0].w)} ${fmt(b[0].a)}%; từ ${lb[1]} đến ${lb[2]}, ${th.th} lại ${tg(b[1].w)} ${fmt(b[1].a)}% so với ${lb[1]}. Hỏi so với ${lb[0]}, ${th.th} ${lb[2]} tăng hay giảm bao nhiêu phần trăm?`,
    ])
    : pick([
      `${T} ${ds[0]}, ${ds[1]} và ${ds[2]}. Hỏi so với ${lb[0]}, ${th.th} ${lb[3]} tăng hay giảm bao nhiêu phần trăm?`,
      `${T} thay đổi như sau: ${ds[0]}; ${ds[1]}; ${ds[2]}. Hỏi ${th.th} ${lb[3]} tăng hay giảm bao nhiêu phần trăm so với ${lb[0]}?`,
    ])
  const dong = []
  b.forEach((x, i) => dong.push(`${cap(th.th)} ${lb[i + 1]} bằng: $100\\%${x.w === 't' ? '+' : '-'}${P(x.a)}=${P(f[i])}$ (${th.th} ${lb[i]})`))
  if (!n3) dong.push(`${cap(th.th)} ${lb[2]} so với ${lb[0]} bằng: $${P(f[0])}\\times ${P(f[1])}=${fmt(f[0].div(H100))}\\times ${fmt(f[1].div(H100))}=${fmt(acc)}=${P(kp)}$`)
  else {
    const f12 = f[0].mul(f[1]).div(H100)
    dong.push(`${cap(th.th)} ${lb[2]} so với ${lb[0]} bằng: $${P(f[0])}\\times ${P(f[1])}=${fmt(f[0].div(H100))}\\times ${fmt(f[1].div(H100))}=${fmt(f12.div(H100))}=${P(f12)}$`)
    dong.push(`${cap(th.th)} ${lb[3]} so với ${lb[0]} bằng: $${P(f12)}\\times ${P(f[2])}=${fmt(f12.div(H100))}\\times ${fmt(f[2].div(H100))}=${fmt(acc)}=${P(kp)}$`)
  }
  const tang = H100.lt(kp), chenh = tang ? kp.sub(H100) : H100.sub(kp), cuoi = n3 ? lb[3] : lb[2]
  dong.push(`${cap(th.th)} ${cuoi} ${tang ? 'tăng' : 'giảm'} so với ${lb[0]}: $${tang ? `${P(kp)}-100\\%` : `100\\%-${P(kp)}`}=${P(chenh)}$`)
  const da = `${tang ? 'Tăng' : 'Giảm'} $${P(chenh)}$`
  const lg = loiGiai({
    matChot: `mỗi lần tăng hoặc giảm đều tính trên giá trị của lần ngay trước, nên không được cộng hay trừ các tỉ số phần trăm. Đổi từng lần ra tỉ số phần trăm so với lần trước, nhân các tỉ số đó lại để biết cuối cùng bằng bao nhiêu phần trăm lúc đầu.`,
    buoc: [
      `Đổi mỗi lần tăng thành $100\\%$ cộng thêm phần tăng, mỗi lần giảm thành $100\\%$ trừ đi phần giảm.`,
      `Đổi các tỉ số phần trăm đó ra số thập phân rồi nhân lần lượt với nhau.`,
      `Tích tìm được cho biết giá trị cuối bằng bao nhiêu phần trăm lúc đầu.`,
      `So sánh với $100\\%$ để biết tăng hay giảm, rồi lấy hiệu hai số để được số phần trăm thay đổi.`,
    ],
    chuY: `các tỉ số phần trăm tính trên những giá trị khác nhau nên không cộng trừ trực tiếp, ví dụ tăng $20\\%$ rồi giảm $20\\%$ không về lại giá trị ban đầu.`,
    dong, dapSo: da,
  })
  return mkTg(n3 ? 'tg_c1' : 'tg_a', nd, da, lg)
}
function tgTien(n3) {   // giá cuối (tiền) sau 2 / 3 lần
  const n = n3 ? 3 : 2, b = chuoiTG(n), th = pick(THING.filter((t) => t.loai === 'tien')), lb = pick(SERIES)
  const M = new R(BigInt(pick([100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000]) * 1000))
  const gia = [M]; for (let i = 0; i < n; i++) gia.push(gia[i].mul(dauTG(b[i].w, b[i].a)).div(H100))
  if (gia.slice(1).some((g) => !g.nguyen || g.n % 1000n !== 0n)) return null
  const fin = gia[n]; if (fin.eq(M)) return null
  const T = cap(th.th), ds = cauTG(b, lb)
  const nd = n3
    ? pick([
      `${T} vào ${lb[0]} là ${nhom3(M.n)} đồng. ${cap(ds[0])}, ${ds[1]} và ${ds[2]}. Hỏi ${th.th} vào ${lb[3]} là bao nhiêu đồng?`,
      `${T} vào ${lb[0]} là ${nhom3(M.n)} đồng. Sau đó, giá ${lb[1]} ${tg(b[0].w)} ${fmt(b[0].a)}% so với ${lb[0]}, giá ${lb[2]} ${tg(b[1].w)} ${fmt(b[1].a)}% so với ${lb[1]}, giá ${lb[3]} ${tg(b[2].w)} ${fmt(b[2].a)}% so với ${lb[2]}. Tính ${th.th} vào ${lb[3]}.`,
    ])
    : pick([
      `${T} vào ${lb[0]} là ${nhom3(M.n)} đồng. ${cap(ds[0])}, ${ds[1]}. Hỏi ${th.th} vào ${lb[2]} là bao nhiêu đồng?`,
      `Vào ${lb[0]}, ${th.th} là ${nhom3(M.n)} đồng. Đến ${lb[1]}, giá ${tg(b[0].w)} ${fmt(b[0].a)}% so với ${lb[0]}; đến ${lb[2]}, giá lại ${tg(b[1].w)} ${fmt(b[1].a)}% so với ${lb[1]}. Tính ${th.th} vào ${lb[2]}.`,
    ])
  const dong = []
  b.forEach((x, i) => {
    const F = dauTG(x.w, x.a)
    dong.push(`${cap(th.th)} ${lb[i + 1]} bằng: $100\\%${x.w === 't' ? '+' : '-'}${P(x.a)}=${P(F)}$ (${th.th} ${lb[i]})`)
    dong.push(`${cap(th.th)} ${lb[i + 1]} là: $${gia[i].n}\\times ${P(F)}=${gia[i + 1].n}$ (đồng)`)
  })
  const lg = loiGiai({
    matChot: `mỗi lần đổi giá tính trên giá của lần ngay trước. Đổi từng lần ra tỉ số phần trăm so với giá trước, rồi lấy giá trước nhân với tỉ số đó để được giá sau, làm lần lượt cho đến lần cuối.`,
    buoc: [
      `Đổi lần đổi giá thứ nhất ra tỉ số phần trăm của giá lúc đầu rồi tính giá sau lần đầu.`,
      `Đổi lần đổi giá tiếp theo ra tỉ số phần trăm của giá vừa tìm được ở lần trước.`,
      `Lấy giá của lần trước nhân với tỉ số phần trăm đó để được giá của lần sau.`,
      ...(n3 ? [`Lặp lại cho lần đổi giá cuối cùng và ghi đáp số kèm đơn vị đồng.`] : [`Giá tìm được ở lần cuối là đáp số, ghi kèm đơn vị đồng.`]),
    ],
    chuY: `mỗi tỉ số phần trăm chỉ được nhân với giá ngay trước nó, không nhân với giá lúc đầu.`,
    dong, dapSo: tien(fin.n),
  })
  return mkTg(n3 ? 'tg_c2' : 'tg_b', nd, tien(fin.n), lg)
}
function tgD() {   // đại lượng (người, tấn…) 2 bước, tìm số lượng cuối
  const b = chuoiTG(2), th = pick(THING.filter((t) => t.loai === 'sl')), lb = pick(SERIES)
  const N0 = new R(BigInt(pick([200, 250, 400, 500, 800, 1000, 1200, 1500, 2000, 2400, 2500, 3000, 4000, 5000, 8000])))
  const q = [N0]; for (let i = 0; i < 2; i++) q.push(q[i].mul(dauTG(b[i].w, b[i].a)).div(H100))
  if (q.slice(1).some((x) => !x.nguyen)) return null
  const ds = cauTG(b, lb)
  const nd = pick([
    `${cap(th.th)} vào ${lb[0]} là ${nhom3(N0.n)} ${th.un}. ${cap(ds[0])}, ${ds[1]}. Hỏi ${th.th} vào ${lb[2]} là bao nhiêu ${th.un}?`,
    `Vào ${lb[0]}, ${th.th} là ${nhom3(N0.n)} ${th.un}. Đến ${lb[1]}, con số này ${tg(b[0].w)} ${fmt(b[0].a)}% so với ${lb[0]}; đến ${lb[2]}, lại ${tg(b[1].w)} ${fmt(b[1].a)}% so với ${lb[1]}. Tính ${th.th} vào ${lb[2]}.`,
  ])
  const dong = []
  b.forEach((x, i) => {
    const F = dauTG(x.w, x.a)
    dong.push(`${cap(th.th)} ${lb[i + 1]} bằng: $100\\%${x.w === 't' ? '+' : '-'}${P(x.a)}=${P(F)}$ (${lb[i]})`)
    dong.push(`${cap(th.th)} ${lb[i + 1]} là: $${q[i].n}\\times ${P(F)}=${q[i + 1].n}$ (${th.un})`)
  })
  const da = `$${q[2].n}$ ${th.un}`
  const lg = loiGiai({
    matChot: `mỗi kỳ tăng hoặc giảm tính trên số của kỳ ngay trước, nên phải tính lần lượt từng kỳ, lấy kết quả kỳ trước nhân với tỉ số phần trăm của kỳ sau.`,
    buoc: [
      `Đổi lần thay đổi thứ nhất thành tỉ số phần trăm của số lúc đầu.`,
      `Lấy số lúc đầu nhân với tỉ số phần trăm đó để được số sau lần thay đổi thứ nhất.`,
      `Đổi lần thay đổi thứ hai thành tỉ số phần trăm của số vừa tìm được, rồi nhân để được số cuối cùng.`,
    ],
    chuY: `tỉ số phần trăm của lần sau phải nhân với số của lần trước, không nhân với số lúc đầu.`,
    dong, dapSo: da,
  })
  return mkTg('tg_d', nd, da, lg)
}
function tgE() {   // ngược: biết giá cuối → giá đầu
  const b = chuoiTG(2), th = pick(THING.filter((t) => t.loai === 'tien')), lb = pick(SERIES)
  const f = b.map((x) => dauTG(x.w, x.a)), acc = f[0].mul(f[1]).div(H100)   // % so với đầu
  const M = new R(BigInt(pick([100, 120, 150, 200, 240, 250, 300, 400, 500, 600, 800, 1000, 1200, 1500, 2000, 2500, 3000, 4000, 5000]) * 1000))
  const N = M.mul(acc).div(H100); if (!N.nguyen || N.n % 1000n !== 0n || !ok(acc, 2) || acc.eq(H100)) return null
  const ds = cauTG(b, lb)
  const nd = pick([
    `${cap(th.th)} ${ds[0]}, ${ds[1]}. Biết giá ${lb[2]} là ${nhom3(N.n)} đồng. Hỏi ${th.th} vào ${lb[0]} là bao nhiêu đồng?`,
    `Giá một mặt hàng ${ds[0]}, ${ds[1]}. Giá vào ${lb[2]} là ${nhom3(N.n)} đồng. Hỏi giá của mặt hàng đó vào ${lb[0]} là bao nhiêu đồng?`,
  ])
  const dong = []
  b.forEach((x, i) => dong.push(`Giá ${lb[i + 1]} bằng: $100\\%${x.w === 't' ? '+' : '-'}${P(x.a)}=${P(f[i])}$ (giá ${lb[i]})`))
  dong.push(`Giá ${lb[2]} so với ${lb[0]} bằng: $${P(f[0])}\\times ${P(f[1])}=${fmt(f[0].div(H100))}\\times ${fmt(f[1].div(H100))}=${fmt(acc.div(H100))}=${P(acc)}$`)
  dong.push(`Giá vào ${lb[0]} là: $${N.n}:${P(acc)}=${M.n}$ (đồng)`)
  const lg = loiGiai({
    matChot: `biết giá cuối, tìm giá đầu: trước hết tìm giá cuối bằng bao nhiêu phần trăm giá đầu (nhân các tỉ số phần trăm), rồi lấy giá cuối chia cho tỉ số đó, vì giá cuối là $${P(acc)}$ của giá đầu.`,
    buoc: [
      `Đổi từng lần tăng hoặc giảm thành tỉ số phần trăm so với giá của lần ngay trước.`,
      `Nhân hai tỉ số phần trăm với nhau để biết giá cuối bằng bao nhiêu phần trăm giá lúc đầu.`,
      `Giá cuối ứng với tỉ số phần trăm vừa tìm, nên lấy giá cuối chia cho tỉ số đó để được giá lúc đầu.`,
    ],
    chuY: `không lấy giá cuối nhân với các tỉ số: giá lúc đầu là số chưa biết, phải chia ngược lại.`,
    thuLai: `$${M.n}\\times ${P(acc)}=${N.n}$ (đồng), đúng bằng giá cuối.`,
    dong, dapSo: tien(M.n),
  })
  return mkTg('tg_e', nd, tien(M.n), lg)
}
function tgF() {   // phải đổi bao nhiêu % để về mức ban đầu
  const tang = rnd() < 0.5, th = pick(THING.filter((t) => t.loai === 'tien')), lb = pick(SERIES)
  if (tang) {
    const a = Rn(pick([25, 60, 100, 150, 300, 400])), A = H100.add(a), r = a.div(A); if (!ok(r.mul(H100), 1)) return null
    const nd = pick([
      `${cap(th.th)} ${lb[1]} tăng ${fmt(a)}% so với ${lb[0]}. Hỏi ${th.th} ${lb[1]} phải giảm bao nhiêu phần trăm so với giá ${lb[1]} để trở về giá ${lb[0]}?`,
      `Sau khi tăng ${fmt(a)}% so với ${lb[0]}, ${th.th} ${lb[1]} cần giảm bao nhiêu phần trăm (so với giá ${lb[1]}) để quay lại đúng giá ${lb[0]}?`,
    ])
    const dong = [
      `${cap(th.th)} ${lb[1]} bằng: $100\\%+${P(a)}=${P(A)}$ (giá ${lb[0]})`,
      `Phần giá cần giảm bằng: $${P(A)}-100\\%=${P(a)}$ (giá ${lb[0]})`,
      `Phần giá cần giảm so với giá ${lb[1]}: $${P(a)}:${P(A)}=${fmt(r)}=${P(r.mul(H100))}$`,
    ]
    const da = `Giảm $${P(r.mul(H100))}$`
    const lg = loiGiai({
      matChot: `giá tăng $${P(a)}$ so với giá cũ, nên giá mới bằng $${P(A)}$ giá cũ. Muốn về giá cũ phải bớt đúng phần đã tăng, nhưng phần trăm giảm lại tính trên giá MỚI nên khác $${P(a)}$.`,
      buoc: [
        `Coi giá lúc đầu là $100\\%$ rồi tính giá mới bằng bao nhiêu phần trăm giá đầu.`,
        `Phần giá cần giảm để về giá cũ chính là phần đã tăng, bằng hiệu của giá mới và $100\\%$.`,
        `Lấy phần cần giảm chia cho giá mới để được tỉ số phần trăm giảm so với giá mới.`,
      ],
      chuY: `không trả lời $${P(a)}$: phần trăm tăng tính trên giá cũ còn phần trăm giảm tính trên giá mới, hai gốc khác nhau.`,
      dong, dapSo: da,
    })
    return mkTg('tg_f', nd, da, lg)
  }
  const b = Rn(pick([20, 37.5, 50, 60, 75, 80])), B = H100.sub(b), r = b.div(B); if (!ok(r.mul(H100), 1)) return null
  const nd = pick([
    `${cap(th.th)} ${lb[1]} giảm ${fmt(b)}% so với ${lb[0]}. Hỏi ${th.th} ${lb[1]} phải tăng bao nhiêu phần trăm so với giá ${lb[1]} để trở về giá ${lb[0]}?`,
    `Sau khi giảm ${fmt(b)}% so với ${lb[0]}, ${th.th} ${lb[1]} cần tăng bao nhiêu phần trăm (so với giá ${lb[1]}) để quay lại đúng giá ${lb[0]}?`,
  ])
  const dong = [
    `${cap(th.th)} ${lb[1]} bằng: $100\\%-${P(b)}=${P(B)}$ (giá ${lb[0]})`,
    `Phần giá cần tăng bằng: $100\\%-${P(B)}=${P(b)}$ (giá ${lb[0]})`,
    `Phần giá cần tăng so với giá ${lb[1]}: $${P(b)}:${P(B)}=${fmt(r)}=${P(r.mul(H100))}$`,
  ]
  const da = `Tăng $${P(r.mul(H100))}$`
  const lg = loiGiai({
    matChot: `giá giảm $${P(b)}$ so với giá cũ, nên giá mới bằng $${P(B)}$ giá cũ. Muốn về giá cũ phải cộng lại đúng phần đã giảm, nhưng phần trăm tăng lại tính trên giá MỚI nên khác $${P(b)}$.`,
    buoc: [
      `Coi giá lúc đầu là $100\\%$ rồi tính giá mới bằng bao nhiêu phần trăm giá đầu.`,
      `Phần giá cần tăng để về giá cũ chính là phần đã giảm, bằng hiệu của $100\\%$ và giá mới.`,
      `Lấy phần cần tăng chia cho giá mới để được tỉ số phần trăm tăng so với giá mới.`,
    ],
    chuY: `không trả lời $${P(b)}$: phần trăm giảm tính trên giá cũ còn phần trăm tăng tính trên giá mới, hai gốc khác nhau.`,
    dong, dapSo: da,
  })
  return mkTg('tg_f', nd, da, lg)
}

// ============================================================================
// NDB03007 — LÃI SUẤT NGÂN HÀNG
// ============================================================================
const mkLs = (mau, nd, da, lg) => ({ dang: D.LAI, mau, loai_cau: 'tra_loi_ngan', noi_dung: nd, dap_an: da, loi_giai: lg })
const NG = ['Cô Mai', 'Chú Hùng', 'Bác Lan', 'Anh Nam', 'Chị Hoa', 'Ông Tâm', 'Bà Liên', 'Thầy Cường', 'Cô Thu']
const TRIEU = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500]
const money = (tr) => new R(BigInt(tr) * 1000000n)
const d1000 = (x) => x.nguyen && x.n % 1000n === 0n
const nguoi = (ng) => (ng.startsWith('Cô') ? 'cô' : 'người đó')
function lsA(hoiLai) {   // lãi đơn nhiều năm
  const M = money(pick(TRIEU)), r = Rn(pick([4, 5, 6, 6.5, 7, 7.5, 8])), n = pick([2, 3, 4, 5])
  const L1 = ofp(M, r), L = L1.mul(new R(BigInt(n))), T = M.add(L); if (!d1000(L1) || !d1000(L)) return null
  const ng = pick(NG)
  const nd = pick([
    `${ng} gửi ${nhom3(M.n)} đồng vào ngân hàng với lãi suất ${fmt(r)}%/năm, tiền lãi chỉ tính trên số tiền gốc ban đầu (không nhập lãi vào vốn). Hỏi sau ${n} năm, ${hoiLai ? 'số tiền lãi nhận được là bao nhiêu đồng' : 'tổng số tiền cả gốc lẫn lãi nhận được là bao nhiêu đồng'}?`,
    `Một người gửi tiết kiệm ${nhom3(M.n)} đồng với lãi suất ${fmt(r)}%/năm theo cách tính lãi đơn (lãi mỗi năm đều tính trên số tiền gửi ban đầu). Hỏi sau ${n} năm, ${hoiLai ? 'người đó nhận được bao nhiêu đồng tiền lãi' : 'người đó rút ra được cả gốc lẫn lãi bao nhiêu đồng'}?`,
  ])
  const dong = [
    `Tiền lãi sau $1$ năm là: $${M.n}\\times ${P(r)}=${L1.n}$ (đồng)`,
    `Tiền lãi sau $${n}$ năm là: $${L1.n}\\times ${n}=${L.n}$ (đồng)`,
  ]
  if (!hoiLai) dong.push(`Số tiền cả gốc lẫn lãi là: $${M.n}+${L.n}=${T.n}$ (đồng)`)
  const lg = loiGiai({
    matChot: `lãi đơn nghĩa là mỗi năm tiền lãi đều tính trên số tiền gốc ban đầu, nên tiền lãi các năm bằng nhau. Tìm tiền lãi một năm rồi nhân với số năm${hoiLai ? '' : ', cuối cùng cộng thêm vốn gốc'}.`,
    buoc: [
      `Tính tiền lãi của một năm bằng cách lấy số tiền gửi nhân với lãi suất $${P(r)}$.`,
      `Nhân tiền lãi một năm với ${n} để được tiền lãi của ${n} năm.`,
      hoiLai ? `Ghi đáp số kèm đơn vị đồng, vì đề chỉ hỏi tiền lãi.` : `Cộng số tiền gốc với tiền lãi của ${n} năm để được cả gốc lẫn lãi.`,
    ],
    chuY: hoiLai ? `đề hỏi tiền LÃI nên không cộng thêm số tiền gốc.` : `đề hỏi cả gốc lẫn lãi nên phải cộng thêm số tiền gốc vào tiền lãi.`,
    dong, dapSo: tien(hoiLai ? L.n : T.n),
  })
  return mkLs(hoiLai ? 'ls_a1' : 'ls_a2', nd, tien(hoiLai ? L.n : T.n), lg)
}
function lsB() {   // lãi theo tháng, kỳ hạn n tháng, lãi không nhập vốn
  const vay = rnd() < 0.4, M = money(pick(TRIEU)), r = Rn(pick([0.5, 0.6, 0.7, 0.75, 0.8, 1, 1.2, 1.5])), n = pick([3, 4, 6, 8, 12])
  const L1 = ofp(M, r), L = L1.mul(new R(BigInt(n))); if (!d1000(L1) || !d1000(L)) return null
  const T = M.add(L), ng = pick(NG)
  const nd = vay
    ? `${ng} vay ngân hàng ${nhom3(M.n)} đồng với lãi suất ${fmt(r)}%/tháng. Mỗi tháng tiền lãi đều tính trên số tiền vay ban đầu (không nhập lãi vào vốn). Hỏi sau ${n} tháng, ${nguoi(ng)} phải trả cả gốc lẫn lãi bao nhiêu đồng?`
    : `${ng} gửi ${nhom3(M.n)} đồng vào ngân hàng, kỳ hạn ${n} tháng, lãi suất ${fmt(r)}%/tháng. Hết kỳ hạn mới nhận lãi và tiền lãi các tháng không nhập vào vốn. Hỏi hết kỳ hạn, tổng số tiền nhận được cả gốc lẫn lãi là bao nhiêu đồng?`
  const dong = [
    `Tiền lãi sau $1$ tháng là: $${M.n}\\times ${P(r)}=${L1.n}$ (đồng)`,
    `Tiền lãi sau $${n}$ tháng là: $${L1.n}\\times ${n}=${L.n}$ (đồng)`,
    `Số tiền cả gốc lẫn lãi là: $${M.n}+${L.n}=${T.n}$ (đồng)`,
  ]
  const lg = loiGiai({
    matChot: `lãi không nhập vào vốn nên mỗi tháng tiền lãi là như nhau, đều tính trên số tiền gốc ban đầu. Tìm tiền lãi một tháng, nhân với số tháng rồi cộng với số tiền gốc.`,
    buoc: [
      `Tính tiền lãi của một tháng bằng cách lấy số tiền ban đầu nhân với $${P(r)}$.`,
      `Nhân tiền lãi một tháng với ${n} để được tiền lãi của ${n} tháng.`,
      `Cộng số tiền gốc với tiền lãi để được số tiền cả gốc lẫn lãi.`,
    ],
    chuY: `đề hỏi cả gốc lẫn lãi nên phải cộng thêm số tiền gốc, không dừng lại ở tiền lãi.`,
    dong, dapSo: tien(T.n),
  })
  return mkLs('ls_b', nd, tien(T.n), lg)
}
function lsC() {   // lãi suất theo năm, gửi n tháng
  const M = money(pick(TRIEU)), r = Rn(pick([4, 5, 6, 6.5, 7, 8, 9, 10])), n = pick([3, 6, 9]), he = Rn(n / 12)
  const L1 = ofp(M, r), L = L1.mul(he); if (!d1000(L1) || !d1000(L)) return null
  const ng = pick(NG), T = M.add(L), hoiLai = rnd() < 0.5
  const nd = pick([
    `${ng} gửi tiết kiệm ${nhom3(M.n)} đồng, kỳ hạn ${n} tháng, với lãi suất ${fmt(r)}%/năm. Hỏi đến hết kỳ hạn, ${hoiLai ? 'số tiền lãi nhận được là bao nhiêu đồng' : 'tổng số tiền cả gốc lẫn lãi là bao nhiêu đồng'}?`,
    `Ngân hàng có lãi suất ${fmt(r)}%/năm. Một người gửi ${nhom3(M.n)} đồng, kỳ hạn ${n} tháng. Hỏi khi đến hạn, người đó ${hoiLai ? 'nhận được bao nhiêu đồng tiền lãi' : 'nhận được tất cả bao nhiêu đồng cả gốc lẫn lãi'}?`,
  ])
  const dong = [
    `Đổi: ${n} tháng = ${fmt(he)} năm.`,
    `Tiền lãi sau $1$ năm là: $${M.n}\\times ${P(r)}=${L1.n}$ (đồng)`,
    `Tiền lãi sau ${n} tháng là: $${L1.n}\\times ${fmt(he)}=${L.n}$ (đồng)`,
  ]
  if (!hoiLai) dong.push(`Số tiền cả gốc lẫn lãi là: $${M.n}+${L.n}=${T.n}$ (đồng)`)
  const lg = loiGiai({
    matChot: `lãi suất cho theo năm nhưng gửi chưa đủ một năm, nên phải đổi số tháng ra năm (${n} tháng = ${fmt(he)} năm) rồi lấy tiền lãi một năm nhân với số năm đó.`,
    buoc: [
      `Đổi ${n} tháng ra năm, vì lãi suất đề cho tính theo năm.`,
      `Tính tiền lãi của một năm bằng cách lấy số tiền gửi nhân với $${P(r)}$.`,
      `Nhân tiền lãi một năm với ${fmt(he)} để được tiền lãi của ${n} tháng.`,
      ...(hoiLai ? [] : [`Cộng số tiền gốc với tiền lãi để được cả gốc lẫn lãi.`]),
    ],
    chuY: hoiLai ? `không lấy tiền lãi một năm làm đáp số: ${n} tháng chỉ bằng ${fmt(he)} năm.` : `đề hỏi cả gốc lẫn lãi, nên phải cộng thêm số tiền gốc vào tiền lãi.`,
    dong, dapSo: tien(hoiLai ? L.n : T.n),
  })
  return mkLs('ls_c', nd, tien(hoiLai ? L.n : T.n), lg)
}
function lsKep(soKy) {   // lãi nhập vốn 2 hoặc 3 kỳ
  const M = money(pick([20, 40, 50, 60, 80, 100, 120, 150, 200, 250, 300, 400, 500])), thang = rnd() < 0.55
  const r = Rn(soKy === 2 ? pick(thang ? [0.5, 0.6, 0.8, 1, 1.5, 2] : [5, 6, 7, 8, 10]) : pick(thang ? [0.5, 1, 2] : [5, 10]))
  const v = [M], lai = []
  for (let i = 0; i < soKy; i++) { const l = ofp(v[i], r); if (!d1000(l)) return null; lai.push(l); v.push(v[i].add(l)) }
  const ky = thang ? 'tháng' : 'năm', ng = pick(NG), T = v[soKy]
  const nd = pick([
    `${ng} gửi tiết kiệm ${nhom3(M.n)} đồng với lãi suất ${fmt(r)}%/${ky}. Biết tiền lãi của ${ky} trước được nhập vào vốn để tính lãi cho ${ky} sau. Hỏi sau ${soKy} ${ky}, ${nguoi(ng)} nhận được bao nhiêu đồng cả vốn lẫn lãi?`,
    `Một người gửi ngân hàng ${nhom3(M.n)} đồng, lãi suất ${fmt(r)}%/${ky}, lãi mỗi ${ky} được nhập vào vốn của ${ky} sau. Hỏi sau ${soKy} ${ky}, tổng số tiền cả vốn lẫn lãi là bao nhiêu đồng?`,
  ])
  const ord = ['thứ nhất', 'thứ hai', 'thứ ba'], dong = []
  for (let i = 0; i < soKy; i++) {
    dong.push(`Tiền lãi ${ky} ${ord[i]} là: $${v[i].n}\\times ${P(r)}=${lai[i].n}$ (đồng)`)
    dong.push(`Số tiền cả vốn lẫn lãi sau ${ky} ${ord[i]} là: $${v[i].n}+${lai[i].n}=${v[i + 1].n}$ (đồng)`)
  }
  const lg = loiGiai({
    matChot: `lãi được nhập vào vốn nên sang ${ky} sau, tiền lãi tính trên số tiền cả vốn lẫn lãi của ${ky} trước chứ không tính trên số tiền gốc ban đầu. Phải tính lần lượt từng ${ky}.`,
    buoc: [
      `Tính tiền lãi ${ky} thứ nhất bằng cách lấy số tiền gốc nhân với $${P(r)}$ rồi cộng vào vốn.`,
      `Lấy số tiền cả vốn lẫn lãi vừa tìm được làm gốc để tính tiền lãi của ${ky} tiếp theo.`,
      soKy === 2 ? `Cộng tiền lãi ${ky} thứ hai vào vốn để được số tiền sau ${soKy} ${ky}.` : `Làm tương tự cho ${ky} thứ ba rồi cộng tiền lãi vào vốn để được số tiền sau ${soKy} ${ky}.`,
    ],
    chuY: `nếu lãi không nhập vào vốn thì tiền lãi mỗi ${ky} bằng nhau; vì đề cho nhập vốn nên tiền lãi các ${ky} sau lớn dần.`,
    dong, dapSo: tien(T.n),
  })
  return mkLs(soKy === 2 ? 'ls_d' : 'ls_e', nd, tien(T.n), lg)
}
function lsF() {   // biết tiền lãi 1 kỳ → tiền gửi
  const thang = rnd() < 0.5, ky = thang ? 'tháng' : 'năm', M = money(pick(TRIEU)), r = Rn(thang ? pick([0.5, 0.6, 0.8, 1, 1.2, 1.5]) : pick([4, 5, 6, 7, 8, 10])), L = ofp(M, r)
  if (!d1000(L)) return null
  const ng = pick(NG)
  const nd = pick([
    `${ng} gửi tiết kiệm với lãi suất ${fmt(r)}%/${ky}. Sau 1 ${ky}, ${nguoi(ng)} nhận được ${nhom3(L.n)} đồng tiền lãi. Hỏi lúc đầu người đó đã gửi bao nhiêu đồng?`,
    `Lãi suất tiết kiệm là ${fmt(r)}%/${ky}. Một người gửi một số tiền và sau 1 ${ky} nhận được tiền lãi là ${nhom3(L.n)} đồng. Tính số tiền người đó đã gửi.`,
  ])
  const lg = loiGiai({
    matChot: `tiền lãi là $${P(r)}$ của số tiền gửi. Biết $${P(r)}$ của một số là ${nhom3(L.n)} đồng thì lấy số đã biết chia cho $${P(r)}$ để tìm số đó.`,
    buoc: [
      `Nhận ra tiền lãi bằng $${P(r)}$ số tiền gửi, nên số tiền gửi là số cần tìm.`,
      `Đổi đề bài thành: biết $${P(r)}$ của một số là ${nhom3(L.n)} đồng, tìm số đó.`,
      `Lấy tiền lãi chia cho $${P(r)}$ để được số tiền đã gửi.`,
    ],
    chuY: `không lấy tiền lãi nhân với $${P(r)}$: đó là cách tìm tiền lãi, còn bài này tìm số tiền gửi.`,
    thuLai: `$${M.n}\\times ${P(r)}=${L.n}$ (đồng), đúng bằng tiền lãi đề cho.`,
    dong: [`Số tiền đã gửi là: $${L.n}:${P(r)}=${M.n}$ (đồng)`], dapSo: tien(M.n),
  })
  return mkLs('ls_f', nd, tien(M.n), lg)
}
function lsG() {   // biết cả gốc lẫn lãi sau 1 kỳ → tiền gửi
  const thang = rnd() < 0.5, ky = thang ? 'tháng' : 'năm', M = money(pick(TRIEU)), r = Rn(thang ? pick([0.5, 0.6, 0.8, 1, 1.2, 1.5]) : pick([4, 5, 6, 7, 8, 10, 12]))
  const L = ofp(M, r), N = M.add(L), X = H100.add(r); if (!d1000(L)) return null
  const ng = pick(NG)
  const nd = pick([
    `${ng} gửi tiết kiệm với lãi suất ${fmt(r)}%/${ky}. Sau 1 ${ky}, cả gốc lẫn lãi là ${nhom3(N.n)} đồng. Hỏi lúc đầu người đó gửi bao nhiêu đồng?`,
    `Một người gửi tiền vào ngân hàng với lãi suất ${fmt(r)}%/${ky}. Sau 1 ${ky}, người đó rút cả vốn lẫn lãi được ${nhom3(N.n)} đồng. Tính số tiền gửi ban đầu.`,
  ])
  const lg = loiGiai({
    matChot: `coi số tiền gửi là $100\\%$ thì cả vốn lẫn lãi bằng $100\\%+${P(r)}=${P(X)}$ số tiền gửi. Biết ${nhom3(N.n)} đồng ứng với $${P(X)}$ nên lấy số đó chia cho $${P(X)}$.`,
    buoc: [
      `Coi số tiền gửi là $100\\%$ rồi cộng thêm tiền lãi để biết cả vốn lẫn lãi bằng bao nhiêu phần trăm.`,
      `Cả vốn lẫn lãi là ${nhom3(N.n)} đồng, ứng với $${P(X)}$ của số tiền gửi.`,
      `Lấy ${nhom3(N.n)} đồng chia cho $${P(X)}$ để được số tiền gửi ban đầu.`,
    ],
    chuY: `không lấy ${nhom3(N.n)} đồng nhân với $${P(r)}$ rồi trừ đi: lãi tính trên số tiền gửi chứ không tính trên cả vốn lẫn lãi.`,
    thuLai: `$${M.n}\\times ${P(X)}=${N.n}$ (đồng), đúng bằng số tiền cả vốn lẫn lãi.`,
    dong: [`Cả vốn lẫn lãi bằng: $100\\%+${P(r)}=${P(X)}$ (số tiền gửi)`, `Số tiền gửi ban đầu là: $${N.n}:${P(X)}=${M.n}$ (đồng)`], dapSo: tien(M.n),
  })
  return mkLs('ls_g', nd, tien(M.n), lg)
}
function lsH(cachN) {   // tìm lãi suất / năm
  const M = money(pick(TRIEU)), r = Rn(pick([4, 5, 6, 6.5, 7, 7.5, 8, 9, 10])), L = ofp(M, r); if (!d1000(L)) return null
  const N = M.add(L), ng = pick(NG), rat = L.div(M)
  const nd = cachN
    ? pick([
      `${ng} gửi tiết kiệm ${nhom3(M.n)} đồng. Sau 1 năm, cả gốc lẫn lãi là ${nhom3(N.n)} đồng. Hỏi lãi suất của ngân hàng là bao nhiêu phần trăm một năm?`,
      `Một người gửi ngân hàng ${nhom3(M.n)} đồng, sau 1 năm nhận được cả vốn lẫn lãi là ${nhom3(N.n)} đồng. Tính lãi suất một năm của ngân hàng.`,
    ])
    : pick([
      `${ng} gửi tiết kiệm ${nhom3(M.n)} đồng. Sau 1 năm, ${nguoi(ng)} nhận được ${nhom3(L.n)} đồng tiền lãi. Hỏi lãi suất của ngân hàng là bao nhiêu phần trăm một năm?`,
      `Một người gửi ${nhom3(M.n)} đồng vào ngân hàng và sau 1 năm nhận được tiền lãi là ${nhom3(L.n)} đồng. Tính lãi suất một năm của ngân hàng.`,
    ])
  const dong = []
  if (cachN) dong.push(`Số tiền lãi sau 1 năm là: $${N.n}-${M.n}=${L.n}$ (đồng)`)
  dong.push(`Lãi suất một năm là: $${L.n}:${M.n}=${fmt(rat)}=${P(r)}$`)
  const lg = loiGiai({
    matChot: `lãi suất là tỉ số phần trăm của tiền lãi so với số tiền gửi. ${cachN ? 'Phải tìm tiền lãi trước bằng cách lấy cả vốn lẫn lãi trừ số tiền gửi, rồi ' : 'Lấy tiền lãi '}chia cho số tiền gửi và đổi ra tỉ số phần trăm.`,
    buoc: [
      ...(cachN ? [`Lấy số tiền cả vốn lẫn lãi trừ số tiền gửi để được tiền lãi sau một năm.`] : [`Xác định tiền lãi sau một năm và số tiền gửi ban đầu từ đề bài.`]),
      `Lấy tiền lãi chia cho số tiền gửi để được tỉ số của tiền lãi so với tiền gửi.`,
      `Đổi tỉ số vừa tìm ra tỉ số phần trăm, đó chính là lãi suất một năm.`,
    ],
    chuY: `phải chia cho số tiền GỬI ban đầu, không chia cho số tiền cả vốn lẫn lãi.`,
    dong, dapSo: `$${P(r)}$`,
  })
  return mkLs(cachN ? 'ls_h2' : 'ls_h1', nd, `$${P(r)}$`, lg)
}

// ============================================================================
// ĐIỀU PHỐI
// ============================================================================
const KE = [
  // [dang, mẫu, số câu, hàm sinh]
  [D.TRON, 'tr_a', 10, () => trAB(pick(CTX), true)], [D.TRON, 'tr_b', 6, () => trAB(pick(CTX), false)],
  [D.TRON, 'tr_e', 6, () => trE(pick(CTX))], [D.TRON, 'tr_f', 6, () => trAB(pick(DD), true, true)],
  [D.NGUOC, 'ng_a', 7, () => ngA(pick(CTX), false)], [D.NGUOC, 'ng_g', 6, () => ngA(pick(CTX), true)],
  [D.NGUOC, 'ng_b', 6, () => ngB(pick(CTX), false)], [D.NGUOC, 'ng_h', 4, () => ngB(pick(CTX), true)], [D.NGUOC, 'ng_c', 8, () => ngC(pick(CTX))],
  [D.LOANG, 'pl_a', 3, () => plA(pick(DD))], [D.LOANG, 'pl_b', 3, () => plB(pick(DD))], [D.LOANG, 'pl_c', 2, () => plC(pick(DD))], [D.LOANG, 'pl_d', 3, () => plD(pick(DD))],
  [D.LOANG, 'pl_e', 3, () => plE(pick(DD.concat(HK_)))], [D.LOANG, 'pl_f', 3, () => plF(pick(DD.concat(HK_)))], [D.LOANG, 'pl_g', 3, () => plG(pick(DD), false)], [D.LOANG, 'pl_h', 3, () => plG(pick(DD), true)],
  [D.HAT, 'hk_a', 5, () => hkA('a')], [D.HAT, 'hk_b', 4, () => hkA('b')], [D.HAT, 'hk_c', 3, () => hkA('c')], [D.HAT, 'hk_d', 3, () => hkD('d')],
  [D.HAT, 'hk_e', 3, () => hkD('e')], [D.HAT, 'hk_f', 3, () => hkD('f')], [D.HAT, 'hk_g1', 2, () => hkG(false)], [D.HAT, 'hk_g2', 3, () => hkG(true)],
  [D.LIEN_TIEP, 'tg_a', 8, () => tgA(false)], [D.LIEN_TIEP, 'tg_b', 5, () => tgTien(false)], [D.LIEN_TIEP, 'tg_c1', 4, () => tgA(true)], [D.LIEN_TIEP, 'tg_c2', 3, () => tgTien(true)],
  [D.LIEN_TIEP, 'tg_d', 4, () => tgD()], [D.LIEN_TIEP, 'tg_e', 3, () => tgE()], [D.LIEN_TIEP, 'tg_f', 3, () => tgF()],
  [D.LAI, 'ls_a1', 2, () => lsA(true)], [D.LAI, 'ls_a2', 2, () => lsA(false)], [D.LAI, 'ls_b', 3, () => lsB()], [D.LAI, 'ls_c', 3, () => lsC()],
  [D.LAI, 'ls_d', 4, () => lsKep(2)], [D.LAI, 'ls_e', 3, () => lsKep(3)], [D.LAI, 'ls_f', 3, () => lsF()], [D.LAI, 'ls_g', 3, () => lsG()],
  [D.LAI, 'ls_h1', 2, () => lsH(false)], [D.LAI, 'ls_h2', 2, () => lsH(true)],
]

export function sinh() {
  rnd = mulberry32(20261128); dungVan.clear(); dungSo.clear()
  const out = []
  for (const [dang, mau, n, fn] of KE) {
    const ds = []; let thu = 0
    while (ds.length < n && thu++ < 20000) {
      let c = null; try { c = fn() } catch (e) { if (!/vô hạn|chia 0/.test(e.message)) throw e }
      if (!c) continue
      tryAdd(ds, c)
    }
    if (ds.length < n) throw new Error(`mẫu ${mau}: chỉ sinh được ${ds.length}/${n}`)
    out.push(...ds)
  }
  return out
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-C.mjs')) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const cau = sinh(), dem = {}, mauDem = {}
  for (const c of cau) { dem[c.dang] = (dem[c.dang] || 0) + 1; (mauDem[c.dang] ??= new Set()).add(c.mau) }
  console.log('Sinh', cau.length, 'câu')
  for (const k of Object.keys(dem)) console.log(' ', k, dem[k], '(cần', CAN[k] + ')', 'mẫu:', [...mauDem[k]].join(','))
  const ra = lay('--ra')
  if (ra) { mkdirSync(dirname(ra), { recursive: true }); writeFileSync(ra, JSON.stringify(cau, null, 1)); console.log('→', ra) }
}
