// ============================================================================
// k5T-pt-sinh.mjs — SINH câu 5T chuyên đề "Tỉ số phần trăm" theo MẪU (item model): máy dựng đề + đáp số + lời giải 2 phần
// (Phần 1 card 3–6 bước) từ tham số "ĐẸP" (mọi số là số nguyên nghìn đồng / phần trăm tròn). Thùy 08/11:
//   · Bài toán cơ bản về bán hàng (NDB02771)  — 5 loại × 20 câu: giá gốc · lãi · giá bán · tỉ lệ lãi · tỉ lệ bán
//   · Bài toán cho lãi theo giá bán (NDB02772) — ~40 câu: "lãi bằng a% GIÁ BÁN" (cho giá gốc hỏi giá bán, giá gốc = c% giá bán + lãi…)
//   · Bài toán giảm giá (NDB02773)             — 2 kiểu × 30 câu: (1) ngày thường lãi p%, giảm d% ⇒ còn lãi bao nhiêu ·
//                                                (2) giảm d% còn lãi q% ⇒ ngày thường lãi bao nhiêu
//
//   node scripts/kho/clone/k5T-pt-sinh.mjs --ra kho-rules/dai/clone/k5T-pt-c1.json [--html reports/xxx.html]
//
// Khuôn lời giải theo k5T.md §1.5 + §2b-G: tìm a% của M viết M×a%; tìm số biết b% là M viết M:b%; nhân/chia hai tỉ số % viết thêm bước
// số thập phân; mỗi câu lời văn = 1 câu lời giải + 1 phép tính (đơn vị trong ngoặc) → "Đáp số:". Hạt giống cố định ⇒ chạy lại ra đúng lô cũ.
// Bộ KIỂM độc lập (đọc CHỮ của đề tính lại bằng phân số, kiểm số học từng dòng Phần 2): k5T-pt-kiem.mjs.
// ============================================================================
import { writeFileSync, mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

export const DANG = { CO_BAN: 'NDB02771', THEO_GIA_BAN: 'NDB02772', GIAM_GIA: 'NDB02773' }

// ── tiện ích ─────────────────────────────────────────────────────────────────────────────────────────────────────
function mulberry32(a) { return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const rnd = mulberry32(20261108)
const shuffle = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const pick = (a) => a[Math.floor(rnd() * a.length)]
const nhom3 = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')   // trong ĐỀ: 850 000 (có dấu cách)
const raw = (n) => String(n)                                          // trong CÔNG THỨC: 850000
const gcd = (a, b) => (b ? gcd(b, a % b) : a)
/** số thập phân dạng Việt (dấu phẩy) từ phân số tử/mẫu — mẫu chỉ có ước 2 và 5, nếu không thì ném lỗi (không có số "xấu"). */
function thapPhan(tu, mau) {
  const g = gcd(Math.abs(tu), mau); tu /= g; mau /= g
  let m = mau; while (m % 2 === 0) m /= 2; while (m % 5 === 0) m /= 5
  if (m !== 1) throw new Error(`số thập phân vô hạn: ${tu}/${mau}`)
  let s = 0; while ((10 ** s) % mau !== 0) s++
  const v = (Math.abs(tu) * (10 ** s)) / mau
  const str = String(v).padStart(s + 1, '0')
  const nguyen = s ? str.slice(0, -s) : str, le = s ? str.slice(-s) : ''
  return (tu < 0 ? '-' : '') + nguyen + (le ? ',' + le : '')
}
/** x% (x là số nguyên hoặc k/10) → dạng thập phân của x/100. pc(130) → "1,3" */
const dec = (phanTram) => thapPhan(Math.round(phanTram * 10), 1000)
const pcs = (x) => (Number.isInteger(x) ? String(x) : thapPhan(Math.round(x * 10), 10))   // 162.5 → "162,5"
const P = (x) => `${pcs(x)}\\%`                                                             // "162,5\%"

const GOC = [['giá gốc', 'giá gốc'], ['giá vốn', 'giá vốn'], ['giá nhập', 'giá nhập']]
const HANG = [
  { ten: 'chiếc áo khoác', gia: [150, 200, 240, 250, 300, 350, 400, 450, 500] },
  { ten: 'đôi giày thể thao', gia: [300, 350, 400, 450, 500, 600, 700, 800, 900] },
  { ten: 'chiếc cặp sách', gia: [200, 240, 250, 300, 350, 400, 450, 500, 600] },
  { ten: 'chiếc đồng hồ đeo tay', gia: [500, 600, 800, 1000, 1200, 1500, 2000, 2400] },
  { ten: 'chiếc xe đạp', gia: [1500, 1800, 2000, 2400, 2500, 3000, 3500, 4000] },
  { ten: 'chiếc quạt điện', gia: [300, 350, 400, 450, 500, 600, 800] },
  { ten: 'bộ đồ chơi xếp hình', gia: [100, 120, 150, 200, 240, 250, 300, 400] },
  { ten: 'chiếc bàn học', gia: [400, 500, 600, 800, 1000, 1200, 1500] },
  { ten: 'chiếc máy tính bảng', gia: [2000, 2400, 3000, 3500, 4000, 5000, 6000] },
  { ten: 'chiếc ti vi', gia: [5000, 6000, 8000, 10000, 12000, 15000] },
  { ten: 'chiếc tủ lạnh', gia: [8000, 10000, 12000, 15000, 18000, 20000] },
  { ten: 'chiếc máy giặt', gia: [6000, 8000, 10000, 12000, 15000] },
  { ten: 'chiếc ba lô du lịch', gia: [250, 300, 350, 400, 500, 600, 800] },
  { ten: 'bộ bàn ghế ăn', gia: [3000, 4000, 5000, 6000, 8000, 10000] },
  { ten: 'chiếc điện thoại', gia: [3000, 4000, 5000, 6000, 8000, 10000, 12000] },
  { ten: 'chiếc áo sơ mi', gia: [120, 150, 200, 240, 250, 300, 350] },
  { ten: 'chiếc váy', gia: [200, 250, 300, 350, 400, 500, 600] },
  { ten: 'chiếc nồi cơm điện', gia: [400, 500, 600, 800, 1000, 1200] },
  { ten: 'chiếc bàn ủi', gia: [200, 250, 300, 400, 500] },
  { ten: 'chiếc loa bluetooth', gia: [300, 400, 500, 600, 800, 1000, 1500] },
]
const SHOP = ['Một cửa hàng', 'Một siêu thị', 'Một cửa hàng đồ gia dụng', 'Một đại lý', 'Cô Lan, chủ một cửa hàng,', 'Chú Hùng, chủ một cửa hàng,', 'Một cửa hàng thời trang', 'Một nhà sách']
const SHOP_CHUNG = ['Một cửa hàng', 'Một siêu thị', 'Một đại lý', 'Một cửa hàng bán lẻ']
const dongK = (k) => k * 1000
const DUOC_P = [10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70, 75, 80, 100]

/** ghép lời giải 2 phần theo khuôn k5T §1.5 */
function loiGiai({ matChot, buoc, chuY, dong, dapSo }) {
  return [
    '**Phần 1. Hướng dẫn**',
    `**Mấu chốt:** ${matChot}`,
    ...buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`),
    `**Chú ý:** ${chuY}`,
    '**Phần 2. Trình bày**',
    'Bài giải',
    ...dong,
    `Đáp số: ${dapSo}`,
  ].join('\n\n')
}
const tien = (n) => `$${raw(n)}$ đồng`

// ── tập tham số ĐẸP (G = giá gốc, L = lãi, B = giá bán: đều là bội của 1000, lãi tính từ phần trăm nguyên) ─────────
function boBa(hang, p) { // trả {G,L,B} nếu đẹp
  const out = []
  for (const g of shuffle(hang.gia)) {
    const G = dongK(g)
    if ((G * p) % 100 !== 0) continue
    const L = (G * p) / 100
    if (L % 1000 !== 0) continue
    out.push({ G, L, B: G + L })
  }
  return out
}
const dung = new Set()
const chuan = (s) => s.toLowerCase().replace(/\s+/g, '')
function them(ds, c) { const k = chuan(c.noi_dung); if (dung.has(k)) return false; dung.add(k); ds.push(c); return true }

// ============================================================================
// A. BÁN HÀNG CƠ BẢN — 5 loại × 20 câu
// ============================================================================
function sinhCoBan() {
  const kq = { gia_goc: [], lai: [], gia_ban: [], ti_le_lai: [], ti_le_ban: [] }
  const mk = (loai, mau, noi_dung, dap_an, lg, tham_so) => ({ dang: DANG.CO_BAN, loai, mau, loai_cau: 'tra_loi_ngan', noi_dung, dap_an, loi_giai: lg, tham_so })
  // chọn tổ hợp (hàng, p) đẹp
  const toHop = () => { const t = []; for (const h of HANG) for (const p of DUOC_P) for (const b of boBa(h, p)) t.push({ h, p, ...b }); return shuffle(t) }
  const kho = toHop()
  let idx = 0
  const lay = (dk = () => true) => { for (let k = 0; k < kho.length * 2; k++) { const t = kho[idx++ % kho.length]; if (dk(t)) return t } throw new Error('hết tổ hợp') }
  // 1) TÌM GIÁ GỐC — 12 (cho giá bán + p) + 8 (cho lãi + p)
  for (let i = 0; i < 12; i++) {
    const t = lay((x) => x.p <= 80 && x.B <= 20000000); const [gn] = pick(GOC), gocTen = gn
    const sh = pick(SHOP), X = 100 + t.p
    const nd = pick([
      `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng và thu được lãi ${t.p}% so với ${gocTen}. Hỏi ${gocTen} của ${t.h.ten} đó là bao nhiêu tiền?`,
      `${sh} bán ${t.h.ten} được ${nhom3(t.B)} đồng, lãi ${t.p}% ${gocTen}. Tính ${gocTen} của ${t.h.ten} đó.`,
    ])
    const lg = loiGiai({
      matChot: `Lãi $${t.p}\\%$ so với ${gocTen} nghĩa là coi ${gocTen} là $100\\%$ thì giá bán bằng $100\\%+${t.p}\\%=${X}\\%$ ${gocTen}. Vậy ${nhom3(t.B)} đồng chính là $${X}\\%$ của ${gocTen}.`,
      buoc: [
        `Coi ${gocTen} là $100\\%$ rồi cộng thêm phần lãi để biết giá bán bằng bao nhiêu phần trăm ${gocTen}.`,
        `Đề cho giá bán là ${nhom3(t.B)} đồng, tức ${nhom3(t.B)} đồng ứng với $${X}\\%$ của ${gocTen}.`,
        `Muốn tìm một số khi biết một phần trăm của nó, ta lấy số đã biết chia cho phần trăm đó: lấy giá bán chia cho $${X}\\%$ để được ${gocTen}.`,
      ],
      chuY: `không lấy giá bán nhân với $${t.p}\\%$: lãi $${t.p}\\%$ tính trên ${gocTen}, không tính trên giá bán.`,
      dong: [`Giá bán bằng: $100\\%+${P(t.p)}=${P(X)}$ (${gocTen})`, `${gocTen[0].toUpperCase() + gocTen.slice(1)} của ${t.h.ten} là: $${raw(t.B)}:${P(X)}=${raw(t.G)}$ (đồng)`],
      dapSo: tien(t.G),
    })
    them(kq.gia_goc, mk('gia_goc', 'bh_gg_a', nd, tien(t.G), lg, { G: t.G, p: t.p }))
  }
  for (let i = 0; i < 8; i++) {
    const t = lay((x) => x.p >= 10 && x.p <= 80); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = pick([
      `${sh} bán ${t.h.ten} và lãi được ${nhom3(t.L)} đồng, số tiền lãi bằng ${t.p}% ${gocTen}. Hỏi ${gocTen} của ${t.h.ten} đó là bao nhiêu tiền?`,
      `Khi bán ${t.h.ten}, ${sh.toLowerCase().replace(/,$/, '')} lãi ${nhom3(t.L)} đồng, tương ứng ${t.p}% so với ${gocTen}. Tìm ${gocTen} của ${t.h.ten} đó.`,
    ])
    const lg = loiGiai({
      matChot: `Tiền lãi chính là $${t.p}\\%$ của ${gocTen}. Biết ${nhom3(t.L)} đồng là $${t.p}\\%$ của ${gocTen} thì ${gocTen} là số phải tìm: lấy ${nhom3(t.L)} chia cho $${t.p}\\%$.`,
      buoc: [
        `Đọc đề để nhận ra tiền lãi bằng $${t.p}\\%$ của ${gocTen}, tức ${gocTen} là số đứng sau chữ "của".`,
        `Đổi câu "${nhom3(t.L)} đồng là $${t.p}\\%$ của ${gocTen}" thành bài toán tìm một số khi biết phần trăm của nó.`,
        `Lấy tiền lãi chia cho $${t.p}\\%$ để tìm ${gocTen}.`,
      ],
      chuY: `không cần tìm giá bán, đề hỏi ${gocTen}.`,
      dong: [`${gocTen[0].toUpperCase() + gocTen.slice(1)} của ${t.h.ten} là: $${raw(t.L)}:${P(t.p)}=${raw(t.G)}$ (đồng)`],
      dapSo: tien(t.G),
    })
    them(kq.gia_goc, mk('gia_goc', 'bh_gg_b', nd, tien(t.G), lg, { L: t.L, p: t.p }))
  }
  // 2) TÌM LÃI — 10 (G,p) + 5 (G,B) + 5 (B,p)
  for (let i = 0; i < 10; i++) {
    const t = lay(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = pick([
      `${sh} nhập ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng và bán ra với lãi ${t.p}% so với ${gocTen}. Hỏi khi bán ${t.h.ten} đó, cửa hàng lãi bao nhiêu tiền?`,
      `${gocTen[0].toUpperCase() + gocTen.slice(1)} của ${t.h.ten} là ${nhom3(t.G)} đồng. ${sh} định giá bán để lãi ${t.p}% so với ${gocTen}. Tính số tiền lãi khi bán ${t.h.ten} đó.`,
    ])
    const lg = loiGiai({
      matChot: `Lãi $${t.p}\\%$ so với ${gocTen} nghĩa là tiền lãi bằng $${t.p}\\%$ của ${gocTen}. Tìm $${t.p}\\%$ của một số thì lấy số đó nhân với $${t.p}\\%$.`,
      buoc: [
        `Xác định số đã biết là ${gocTen} ${nhom3(t.G)} đồng và phần trăm lãi là $${t.p}\\%$ của số đó.`,
        `Đổi $${t.p}\\%$ ra số thập phân rồi nhân với ${gocTen} để tìm tiền lãi.`,
        `Kiểm tra đề hỏi tiền lãi nên đáp số là số tiền vừa tìm, không cộng thêm ${gocTen}.`,
      ],
      chuY: `đề hỏi **tiền lãi** nên không cộng thêm ${gocTen} (cộng thêm mới ra giá bán).`,
      dong: [`Số tiền lãi là: $${raw(t.G)}\\times ${P(t.p)}=${raw(t.L)}$ (đồng)`],
      dapSo: tien(t.L),
    })
    them(kq.lai, mk('lai', 'bh_lai_a', nd, tien(t.L), lg, { G: t.G, p: t.p }))
  }
  for (let i = 0; i < 5; i++) {
    const t = lay(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = `${sh} mua ${t.h.ten} với giá ${nhom3(t.G)} đồng rồi bán lại với giá ${nhom3(t.B)} đồng. Hỏi cửa hàng lãi bao nhiêu tiền khi bán ${t.h.ten} đó?`
    const lg = loiGiai({
      matChot: `Tiền lãi là phần giá bán nhiều hơn ${gocTen}: lãi = giá bán − ${gocTen}.`,
      buoc: [
        `Xác định ${gocTen} là ${nhom3(t.G)} đồng và giá bán là ${nhom3(t.B)} đồng.`,
        `Lấy giá bán trừ đi ${gocTen} để tìm số tiền lãi.`,
        `Viết đáp số kèm đơn vị đồng.`,
      ],
      chuY: `giá bán phải lớn hơn ${gocTen} thì cửa hàng mới có lãi.`,
      dong: [`Số tiền lãi là: $${raw(t.B)}-${raw(t.G)}=${raw(t.L)}$ (đồng)`],
      dapSo: tien(t.L),
    })
    them(kq.lai, mk('lai', 'bh_lai_b', nd, tien(t.L), lg, { G: t.G, B: t.B }))
  }
  for (let i = 0; i < 5; i++) {
    const t = lay((x) => x.p <= 60); const [gocTen] = pick(GOC); const sh = pick(SHOP); const X = 100 + t.p
    const nd = `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng và lãi ${t.p}% so với ${gocTen}. Hỏi cửa hàng lãi được bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Giá bán bằng $${X}\\%$ ${gocTen}, nên phải tìm ${gocTen} trước; tiền lãi là giá bán trừ ${gocTen} (hoặc $${t.p}\\%$ của ${gocTen}).`,
      buoc: [
        `Coi ${gocTen} là $100\\%$ thì giá bán bằng $100\\%+${t.p}\\%=${X}\\%$ ${gocTen}.`,
        `Giá bán ${nhom3(t.B)} đồng ứng với $${X}\\%$ nên lấy giá bán chia cho $${X}\\%$ để được ${gocTen}.`,
        `Lấy giá bán trừ ${gocTen} để tìm tiền lãi.`,
      ],
      chuY: `không lấy ${nhom3(t.B)} nhân với $${t.p}\\%$: $${t.p}\\%$ tính trên ${gocTen}, không phải trên giá bán.`,
      dong: [`Giá bán bằng: $100\\%+${P(t.p)}=${P(X)}$ (${gocTen})`, `${gocTen[0].toUpperCase() + gocTen.slice(1)} là: $${raw(t.B)}:${P(X)}=${raw(t.G)}$ (đồng)`, `Số tiền lãi là: $${raw(t.B)}-${raw(t.G)}=${raw(t.L)}$ (đồng)`],
      dapSo: tien(t.L),
    })
    them(kq.lai, mk('lai', 'bh_lai_c', nd, tien(t.L), lg, { B: t.B, p: t.p }))
  }
  // 3) TÌM GIÁ BÁN — 12 (G,p) + 4 (G,L) + 4 (n sản phẩm)
  for (let i = 0; i < 12; i++) {
    const t = lay(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = pick([
      `${sh} nhập ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng. Hỏi phải bán ${t.h.ten} đó với giá bao nhiêu tiền để lãi ${t.p}% so với ${gocTen}?`,
      `${gocTen[0].toUpperCase() + gocTen.slice(1)} của ${t.h.ten} là ${nhom3(t.G)} đồng. ${sh} muốn lãi ${t.p}% so với ${gocTen}. Hỏi cửa hàng phải bán ${t.h.ten} đó với giá bao nhiêu?`,
    ])
    const lg = loiGiai({
      matChot: `Giá bán bằng ${gocTen} cộng tiền lãi. Tiền lãi bằng $${t.p}\\%$ của ${gocTen}, tìm bằng cách lấy ${gocTen} nhân với $${t.p}\\%$.`,
      buoc: [
        `Tìm tiền lãi: lấy ${gocTen} ${nhom3(t.G)} đồng nhân với $${t.p}\\%$.`,
        `Giá bán bằng ${gocTen} cộng với tiền lãi vừa tìm.`,
        `Kiểm tra: đề hỏi giá bán chứ không phải tiền lãi nên đáp số là kết quả của bước 2.`,
      ],
      chuY: `$${raw(t.G)}\\times ${t.p}\\%$ mới là **tiền lãi**, chưa phải giá bán.`,
      dong: [`Số tiền lãi là: $${raw(t.G)}\\times ${P(t.p)}=${raw(t.L)}$ (đồng)`, `Giá bán ${t.h.ten} là: $${raw(t.G)}+${raw(t.L)}=${raw(t.B)}$ (đồng)`],
      dapSo: tien(t.B),
    })
    them(kq.gia_ban, mk('gia_ban', 'bh_gb_a', nd, tien(t.B), lg, { G: t.G, p: t.p }))
  }
  for (let i = 0; i < 4; i++) {
    const t = lay(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = `${sh} nhập ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng và muốn lãi ${nhom3(t.L)} đồng cho mỗi ${t.h.ten.split(' ')[0]}. Hỏi cửa hàng phải bán ${t.h.ten} đó với giá bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Giá bán = ${gocTen} + tiền lãi.`,
      buoc: [
        `Xác định ${gocTen} là ${nhom3(t.G)} đồng và tiền lãi muốn có là ${nhom3(t.L)} đồng.`,
        `Cộng ${gocTen} với tiền lãi để được giá bán.`,
        `Viết đáp số kèm đơn vị đồng.`,
      ],
      chuY: `giá bán luôn lớn hơn ${gocTen} khi cửa hàng có lãi.`,
      dong: [`Giá bán ${t.h.ten} là: $${raw(t.G)}+${raw(t.L)}=${raw(t.B)}$ (đồng)`],
      dapSo: tien(t.B),
    })
    them(kq.gia_ban, mk('gia_ban', 'bh_gb_b', nd, tien(t.B), lg, { G: t.G, L: t.L }))
  }
  for (let i = 0; i < 4; i++) {
    const t = lay((x) => x.B * 10 <= 60000000); const n = pick([5, 8, 10, 12, 20, 25]); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const T = t.B * n
    const nd = `${sh} nhập ${n} ${t.h.ten} (mỗi ${t.h.ten.split(' ')[0]} có ${gocTen} ${nhom3(t.G)} đồng) và bán hết với lãi ${t.p}% so với ${gocTen}. Hỏi cửa hàng thu được tất cả bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Tìm giá bán của **một** ${t.h.ten.split(' ')[0]} (giá gốc cộng lãi $${t.p}\\%$ giá gốc) rồi mới nhân với số ${t.h.ten.split(' ')[0]} đã bán.`,
      buoc: [
        `Tìm tiền lãi của một ${t.h.ten.split(' ')[0]}: lấy ${gocTen} nhân với $${t.p}\\%$.`,
        `Tìm giá bán một ${t.h.ten.split(' ')[0]}: lấy ${gocTen} cộng tiền lãi.`,
        `Nhân giá bán một ${t.h.ten.split(' ')[0]} với ${n} để được tổng số tiền thu được.`,
      ],
      chuY: `đề hỏi **tổng số tiền thu được** (tiền bán hàng), không phải tiền lãi.`,
      dong: [`Tiền lãi một ${t.h.ten.split(' ')[0]} là: $${raw(t.G)}\\times ${P(t.p)}=${raw(t.L)}$ (đồng)`, `Giá bán một ${t.h.ten.split(' ')[0]} là: $${raw(t.G)}+${raw(t.L)}=${raw(t.B)}$ (đồng)`, `Số tiền thu được là: $${raw(t.B)}\\times ${n}=${raw(T)}$ (đồng)`],
      dapSo: tien(T),
    })
    them(kq.gia_ban, mk('gia_ban', 'bh_gb_c', nd, tien(T), lg, { G: t.G, p: t.p, n }))
  }
  // 4) TỈ LỆ LÃI — 10 (G,B) + 6 (G,L) + 4 (B,L)
  const taoTL = (kieu) => {
    for (let k = 0; k < 400; k++) {
      const t = lay((x) => [10, 20, 25, 30, 40, 50, 60, 75, 80].includes(x.p)); return t
    }
  }
  for (let i = 0; i < 10; i++) {
    const t = taoTL(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = pick([`${sh} mua ${t.h.ten} với giá ${nhom3(t.G)} đồng rồi bán lại với giá ${nhom3(t.B)} đồng. Hỏi cửa hàng lãi bao nhiêu phần trăm so với ${gocTen}?`, `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng, biết ${gocTen} là ${nhom3(t.G)} đồng. Hỏi tỉ lệ lãi của cửa hàng là bao nhiêu phần trăm ${gocTen}?`])
    const lg = loiGiai({
      matChot: `Tỉ lệ lãi là tỉ số phần trăm giữa **tiền lãi** và ${gocTen}. Phải tìm tiền lãi (giá bán trừ ${gocTen}) trước rồi mới so với ${gocTen}.`,
      buoc: [
        `Tìm tiền lãi: lấy giá bán trừ ${gocTen}.`,
        `Lập tỉ số của tiền lãi và ${gocTen}, đây là gốc để so sánh (lãi so với ${gocTen}, không so với giá bán).`,
        `Đổi tỉ số vừa tìm ra số thập phân rồi viết thành phần trăm.`,
      ],
      chuY: `tỉ lệ lãi tính trên ${gocTen}; nếu chia cho giá bán sẽ ra kết quả khác.`,
      dong: [`Số tiền lãi là: $${raw(t.B)}-${raw(t.G)}=${raw(t.L)}$ (đồng)`, `Tỉ lệ lãi là: $${raw(t.L)}:${raw(t.G)}=${dec(t.p)}=${P(t.p)}$ (${gocTen})`],
      dapSo: `$${t.p}\\%$`,
    })
    them(kq.ti_le_lai, mk('ti_le_lai', 'bh_tl_a', nd, `$${t.p}\\%$`, lg, { G: t.G, B: t.B }))
  }
  for (let i = 0; i < 6; i++) {
    const t = taoTL(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = `${sh} nhập ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng. Khi bán ra, cửa hàng lãi ${nhom3(t.L)} đồng. Hỏi tiền lãi bằng bao nhiêu phần trăm ${gocTen}?`
    const lg = loiGiai({
      matChot: `Muốn biết số này bằng bao nhiêu phần trăm số kia, ta lập tỉ số rồi đổi ra phần trăm. Ở đây so **tiền lãi** với ${gocTen}.`,
      buoc: [
        `Xác định số đem so sánh là tiền lãi ${nhom3(t.L)} đồng, và số làm gốc là ${gocTen} ${nhom3(t.G)} đồng.`,
        `Lấy tiền lãi chia cho ${gocTen}.`,
        `Đổi kết quả sang số thập phân rồi viết thành phần trăm.`,
      ],
      chuY: `gốc để so sánh là ${gocTen}, không phải giá bán.`,
      dong: [`Tiền lãi bằng: $${raw(t.L)}:${raw(t.G)}=${dec(t.p)}=${P(t.p)}$ (${gocTen})`],
      dapSo: `$${t.p}\\%$`,
    })
    them(kq.ti_le_lai, mk('ti_le_lai', 'bh_tl_b', nd, `$${t.p}\\%$`, lg, { G: t.G, L: t.L }))
  }
  for (let i = 0; i < 4; i++) {
    const t = taoTL(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng và lãi ${nhom3(t.L)} đồng. Hỏi cửa hàng lãi bao nhiêu phần trăm so với ${gocTen}?`
    const lg = loiGiai({
      matChot: `Đề cho giá bán và tiền lãi nên tìm ${gocTen} trước (giá bán trừ tiền lãi), rồi lấy tiền lãi so với ${gocTen}.`,
      buoc: [
        `Tìm ${gocTen}: lấy giá bán trừ tiền lãi.`,
        `Lập tỉ số của tiền lãi và ${gocTen} vừa tìm được.`,
        `Đổi tỉ số ra số thập phân rồi viết thành phần trăm.`,
      ],
      chuY: `không chia tiền lãi cho giá bán: lãi so với ${gocTen}.`,
      dong: [`${gocTen[0].toUpperCase() + gocTen.slice(1)} là: $${raw(t.B)}-${raw(t.L)}=${raw(t.G)}$ (đồng)`, `Tỉ lệ lãi là: $${raw(t.L)}:${raw(t.G)}=${dec(t.p)}=${P(t.p)}$ (${gocTen})`],
      dapSo: `$${t.p}\\%$`,
    })
    them(kq.ti_le_lai, mk('ti_le_lai', 'bh_tl_c', nd, `$${t.p}\\%$`, lg, { B: t.B, L: t.L }))
  }
  // 5) TỈ LỆ BÁN — 7 (tỉ lệ bán %) + 7 (số hàng bán rồi tiền thu) + 6 (tiền lãi của phần đã bán)
  const MAT = [{ ten: 'kg gạo', dv: 'ki-lô-gam gạo', gia: [15, 18, 20, 22, 25, 30, 35] }, { ten: 'kg cam', dv: 'ki-lô-gam cam', gia: [30, 35, 40, 45, 50, 60] }, { ten: 'quyển vở', dv: 'quyển vở', gia: [8, 10, 12, 15, 20] }, { ten: 'chiếc bút bi', dv: 'chiếc bút bi', gia: [4, 5, 6, 8, 10] }, { ten: 'hộp bánh', dv: 'hộp bánh', gia: [60, 80, 100, 120, 150] }, { ten: 'chiếc áo phông', dv: 'chiếc áo phông', gia: [80, 100, 120, 150, 200] }]
  const NA = [{ N: 40, a: [25, 50, 75, 20, 80] }, { N: 60, a: [25, 50, 20, 40, 75] }, { N: 80, a: [25, 50, 75, 20, 40, 60] }, { N: 100, a: [20, 25, 40, 50, 60, 75, 80] }, { N: 120, a: [25, 50, 75, 40, 60] }, { N: 200, a: [20, 25, 40, 50, 60, 75, 80] }, { N: 150, a: [20, 40, 60, 80, 50] }, { N: 300, a: [20, 25, 40, 50, 60, 75, 80] }]
  const bo = () => { const m = pick(MAT), na = pick(NA), a = pick(na.a); return { m, N: na.N, a, S: (na.N * a) / 100 } }
  for (let i = 0; i < 7; i++) {
    const { m, N, a, S } = bo(); const sh = pick(SHOP_CHUNG)
    const nd = pick([`${sh} nhập về ${N} ${m.dv}, đến cuối ngày đã bán được ${S} ${m.dv}. Hỏi tỉ lệ bán (số hàng đã bán so với số hàng nhập) là bao nhiêu phần trăm?`, `Trong tuần, ${sh.toLowerCase()} nhập ${N} ${m.dv} và bán được ${S} ${m.dv}. Hỏi cửa hàng đã bán được bao nhiêu phần trăm số hàng đã nhập?`])
    const lg = loiGiai({
      matChot: `Tỉ lệ bán là tỉ số phần trăm giữa **số hàng đã bán** và **số hàng đã nhập** (lấy tổng số hàng làm gốc).`,
      buoc: [
        `Xác định số hàng đã bán là ${S} và tổng số hàng đã nhập là ${N}.`,
        `Lấy số hàng đã bán chia cho tổng số hàng đã nhập.`,
        `Đổi kết quả sang số thập phân rồi viết thành phần trăm.`,
      ],
      chuY: `gốc để so sánh là tổng số hàng đã nhập (${N}), không phải số hàng đã bán.`,
      dong: [`Tỉ lệ bán là: $${S}:${N}=${dec(a)}=${P(a)}$ (số hàng nhập)`],
      dapSo: `$${a}\\%$`,
    })
    them(kq.ti_le_ban, mk('ti_le_ban', 'bh_tb_a', nd, `$${a}\\%$`, lg, { N, S }))
  }
  for (let i = 0; i < 7; i++) {
    const { m, N, a, S } = bo(); const sh = pick(SHOP_CHUNG); const B = dongK(pick(m.gia))
    const T = S * B
    const nd = `${sh} nhập ${N} ${m.dv} và bán được ${a}% số hàng đã nhập, mỗi ${m.ten.replace(/^kg /, 'ki-lô-gam ')} bán với giá ${nhom3(B)} đồng. Hỏi cửa hàng thu được bao nhiêu tiền từ số hàng đã bán?`
    const lg = loiGiai({
      matChot: `Số hàng đã bán là $${a}\\%$ của số hàng đã nhập: tìm $${a}\\%$ của ${N}, rồi nhân với giá bán của một đơn vị hàng.`,
      buoc: [
        `Tìm số hàng đã bán: lấy tổng số hàng nhập ${N} nhân với $${a}\\%$.`,
        `Giá bán mỗi đơn vị hàng là ${nhom3(B)} đồng đã cho sẵn trong đề.`,
        `Nhân số hàng đã bán với giá bán để được số tiền thu được.`,
      ],
      chuY: `chỉ tính tiền bán của phần hàng **đã bán**, không tính cả ${N} đơn vị hàng nhập.`,
      dong: [`Số hàng đã bán là: $${N}\\times ${P(a)}=${S}$`, `Số tiền thu được là: $${S}\\times ${raw(B)}=${raw(T)}$ (đồng)`],
      dapSo: tien(T),
    })
    them(kq.ti_le_ban, mk('ti_le_ban', 'bh_tb_b', nd, tien(T), lg, { N, a, B }))
  }
  for (let i = 0; i < 6; i++) {
    const { m, N, a, S } = bo(); const sh = pick(SHOP_CHUNG); const g = dongK(pick(m.gia)); const p = pick([10, 20, 25, 30, 40, 50].filter((x) => (g * x) % 100 === 0))
    const l1 = (g * p) / 100, LT = S * l1
    const nd = `${sh} nhập ${N} ${m.dv}, mỗi ${m.ten.replace(/^kg /, 'ki-lô-gam ')} có giá gốc ${nhom3(g)} đồng. Cửa hàng bán được ${a}% số hàng với lãi ${p}% so với giá gốc, số hàng còn lại chưa bán. Hỏi cửa hàng lãi được bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Chỉ phần hàng **đã bán** mới có lãi: tìm số hàng đã bán, tiền lãi của một đơn vị hàng, rồi nhân hai số này.`,
      buoc: [
        `Tìm số hàng đã bán: tìm $${a}\\%$ của tổng số hàng ${N}.`,
        `Tìm tiền lãi của một đơn vị hàng: tìm $${p}\\%$ của giá gốc ${nhom3(g)} đồng.`,
        `Nhân số hàng đã bán với tiền lãi của một đơn vị hàng để được tổng tiền lãi.`,
      ],
      chuY: `số hàng chưa bán chưa mang lại lãi nên không tính vào.`,
      dong: [`Số hàng đã bán là: $${N}\\times ${P(a)}=${S}$`, `Tiền lãi của một đơn vị hàng là: $${raw(g)}\\times ${P(p)}=${raw(l1)}$ (đồng)`, `Tổng số tiền lãi là: $${S}\\times ${raw(l1)}=${raw(LT)}$ (đồng)`],
      dapSo: tien(LT),
    })
    them(kq.ti_le_ban, mk('ti_le_ban', 'bh_tb_c', nd, tien(LT), lg, { N, a, g, p }))
  }
  return kq
}

// ============================================================================
// B. LÃI THEO GIÁ BÁN — 40 câu
// ============================================================================
function sinhTheoGiaBan() {
  const ds = []
  const mk = (mau, noi_dung, dap_an, lg, tham_so) => ({ dang: DANG.THEO_GIA_BAN, loai: 'theo_gia_ban', mau, loai_cau: 'tra_loi_ngan', noi_dung, dap_an, loi_giai: lg, tham_so })
  const A = [10, 20, 25, 30, 40, 50, 60, 75]       // lãi = a% giá bán
  const cho = (dk) => { const t = []; for (const h of HANG) for (const a of A) for (const g of h.gia) { const G = dongK(g), c = 100 - a; if ((G * 100) % c !== 0) continue; const B = (G * 100) / c; if (B % 1000 !== 0) continue; const L = B - G; t.push({ h, a, c, G, B, L }) } return shuffle(t.filter(dk)) }
  const kho = cho(() => true); let idx = 0
  const lay = (dk = () => true) => { for (let k = 0; k < kho.length * 2; k++) { const t = kho[idx++ % kho.length]; if (dk(t)) return t } throw new Error('hết tổ hợp (theo giá bán)') }
  // 1) cho giá gốc + lãi a% GIÁ BÁN → giá bán (12)
  for (let i = 0; i < 12; i++) {
    const t = lay((x) => x.B <= 25000000); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = pick([`${sh} mua ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng và muốn lãi bằng ${t.a}% giá bán. Hỏi cửa hàng phải bán ${t.h.ten} đó với giá bao nhiêu tiền?`, `${sh} nhập ${t.h.ten} với ${gocTen} ${nhom3(t.G)} đồng rồi bán ra, tiền lãi bằng ${t.a}% giá bán. Tính giá bán của ${t.h.ten} đó.`])
    const lg = loiGiai({
      matChot: `Lãi bằng $${t.a}\\%$ **giá bán** nên lần này coi **giá bán** là $100\\%$ (không phải ${gocTen}). Khi đó ${gocTen} chỉ bằng $100\\%-${t.a}\\%=${t.c}\\%$ giá bán.`,
      buoc: [
        `Coi giá bán là $100\\%$; lãi là $${t.a}\\%$ giá bán nên phần còn lại là ${gocTen}.`,
        `Tìm ${gocTen} bằng bao nhiêu phần trăm giá bán: lấy $100\\%$ trừ đi $${t.a}\\%$.`,
        `Đề cho ${gocTen} là ${nhom3(t.G)} đồng, ứng với $${t.c}\\%$ giá bán; lấy ${gocTen} chia cho $${t.c}\\%$ để được giá bán.`,
      ],
      chuY: `đây là lãi theo **giá bán**; nếu làm như lãi theo ${gocTen} (lấy ${gocTen} nhân $${100 + t.a}\\%$) sẽ sai.`,
      dong: [`${gocTen[0].toUpperCase() + gocTen.slice(1)} bằng: $100\\%-${P(t.a)}=${P(t.c)}$ (giá bán)`, `Giá bán ${t.h.ten} là: $${raw(t.G)}:${P(t.c)}=${raw(t.B)}$ (đồng)`],
      dapSo: tien(t.B),
    })
    them(ds, mk('gb_1', nd, tien(t.B), lg, { G: t.G, a: t.a }))
  }
  // 2) giá gốc bằng c% giá bán + cho lãi (L) → hỏi giá bán / giá gốc (10: 5 + 5)
  for (let i = 0; i < 10; i++) {
    const t = lay((x) => x.c >= 40 && x.L <= 6000000); const [gocTen] = pick(GOC); const sh = pick(SHOP); const hoiGia = i % 2 === 0
    const nd = hoiGia
      ? `${sh} bán ${t.h.ten}, biết ${gocTen} bằng ${t.c}% giá bán và cửa hàng lãi ${nhom3(t.L)} đồng. Hỏi giá bán của ${t.h.ten} đó là bao nhiêu tiền?`
      : `${sh} bán ${t.h.ten}, biết ${gocTen} bằng ${t.c}% giá bán và cửa hàng lãi ${nhom3(t.L)} đồng. Hỏi ${gocTen} của ${t.h.ten} đó là bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Coi giá bán là $100\\%$. ${gocTen[0].toUpperCase() + gocTen.slice(1)} là $${t.c}\\%$ giá bán nên tiền lãi là phần còn lại: $100\\%-${t.c}\\%=${t.a}\\%$ giá bán. Biết tiền lãi, tìm được giá bán.`,
      buoc: [
        `Coi giá bán là $100\\%$, tìm tiền lãi bằng bao nhiêu phần trăm giá bán (lấy $100\\%$ trừ $${t.c}\\%$ là phần ${gocTen}).`,
        `Tiền lãi ${nhom3(t.L)} đồng ứng với $${t.a}\\%$ giá bán; lấy tiền lãi chia cho $${t.a}\\%$ để tìm giá bán.`,
        hoiGia ? `Đề hỏi giá bán, đó chính là kết quả của bước 2.` : `Đề hỏi ${gocTen}: lấy giá bán trừ tiền lãi (hoặc nhân giá bán với $${t.c}\\%$).`,
      ],
      chuY: `$${t.a}\\%$ là phần trăm của **giá bán**, không phải của ${gocTen}.`,
      dong: [`Tiền lãi bằng: $100\\%-${P(t.c)}=${P(t.a)}$ (giá bán)`, `Giá bán là: $${raw(t.L)}:${P(t.a)}=${raw(t.B)}$ (đồng)`, ...(hoiGia ? [] : [`${gocTen[0].toUpperCase() + gocTen.slice(1)} là: $${raw(t.B)}-${raw(t.L)}=${raw(t.G)}$ (đồng)`])],
      dapSo: tien(hoiGia ? t.B : t.G),
    })
    them(ds, mk(hoiGia ? 'gb_2a' : 'gb_2b', nd, tien(hoiGia ? t.B : t.G), lg, { L: t.L, c: t.c, hoi: hoiGia ? 'B' : 'G' }))
  }
  // 3) cho giá bán + lãi a% giá bán → lãi / giá gốc (10: 5 + 5)
  for (let i = 0; i < 10; i++) {
    const t = lay((x) => x.B <= 30000000); const [gocTen] = pick(GOC); const sh = pick(SHOP); const hoiLai = i % 2 === 0
    const nd = hoiLai
      ? `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng, tiền lãi bằng ${t.a}% giá bán. Hỏi cửa hàng lãi được bao nhiêu tiền?`
      : `${sh} bán ${t.h.ten} với giá ${nhom3(t.B)} đồng, tiền lãi bằng ${t.a}% giá bán. Hỏi ${gocTen} của ${t.h.ten} đó là bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Lãi bằng $${t.a}\\%$ **giá bán** và giá bán đã biết, nên tiền lãi là $${t.a}\\%$ của giá bán: lấy giá bán nhân với $${t.a}\\%$.${hoiLai ? '' : ` ${gocTen[0].toUpperCase() + gocTen.slice(1)} là giá bán trừ tiền lãi.`}`,
      buoc: [
        `Xác định số đã biết là giá bán ${nhom3(t.B)} đồng và tiền lãi là $${t.a}\\%$ của số đó.`,
        `Tìm tiền lãi: lấy giá bán nhân với $${t.a}\\%$.`,
        hoiLai ? `Đề hỏi tiền lãi nên kết quả bước 2 là đáp số.` : `Lấy giá bán trừ tiền lãi vừa tìm để được ${gocTen}.`,
      ],
      chuY: `phần trăm lãi ở đây tính trên **giá bán** nên không cần tìm ${gocTen} trước để tính lãi.`,
      dong: [`Tiền lãi là: $${raw(t.B)}\\times ${P(t.a)}=${raw(t.L)}$ (đồng)`, ...(hoiLai ? [] : [`${gocTen[0].toUpperCase() + gocTen.slice(1)} là: $${raw(t.B)}-${raw(t.L)}=${raw(t.G)}$ (đồng)`])],
      dapSo: tien(hoiLai ? t.L : t.G),
    })
    them(ds, mk(hoiLai ? 'gb_3a' : 'gb_3b', nd, tien(hoiLai ? t.L : t.G), lg, { B: t.B, a: t.a, hoi: hoiLai ? 'L' : 'G' }))
  }
  // 4) mua G bán B → lãi bằng bao nhiêu % giá bán (4)
  for (let i = 0; i < 4; i++) {
    const t = lay(); const [gocTen] = pick(GOC); const sh = pick(SHOP)
    const nd = `${sh} mua ${t.h.ten} với giá ${nhom3(t.G)} đồng rồi bán lại với giá ${nhom3(t.B)} đồng. Hỏi tiền lãi bằng bao nhiêu phần trăm giá bán?`
    const lg = loiGiai({
      matChot: `Lần này so tiền lãi với **giá bán** (không phải với ${gocTen}): phần trăm = tiền lãi : giá bán.`,
      buoc: [
        `Tìm tiền lãi: lấy giá bán trừ ${gocTen}.`,
        `Lập tỉ số của tiền lãi và giá bán (gốc để so sánh là giá bán).`,
        `Đổi tỉ số ra số thập phân rồi viết thành phần trăm.`,
      ],
      chuY: `chia cho giá bán chứ không chia cho ${gocTen}.`,
      dong: [`Tiền lãi là: $${raw(t.B)}-${raw(t.G)}=${raw(t.L)}$ (đồng)`, `Tiền lãi bằng: $${raw(t.L)}:${raw(t.B)}=${dec(t.a)}=${P(t.a)}$ (giá bán)`],
      dapSo: `$${t.a}\\%$`,
    })
    them(ds, mk('gb_4', nd, `$${t.a}\\%$`, lg, { G: t.G, B: t.B }))
  }
  // 5) đổi gốc so sánh (4): lãi a% giá bán → lãi bao nhiêu % giá gốc, và ngược lại
  const DOI = [
    { kieu: 'bg', x: 20, y: 25 }, { kieu: 'bg', x: 60, y: 150 },    // lãi x% giá bán → lãi y% giá gốc
    { kieu: 'gb', x: 25, y: 20 }, { kieu: 'gb', x: 100, y: 50 },    // lãi x% giá gốc → lãi y% giá bán
  ]
  for (const d of DOI) {
    const [gocTen] = pick(GOC); const sh = pick(SHOP_CHUNG)
    let nd, lg
    if (d.kieu === 'bg') {
      const c = 100 - d.x
      nd = `${sh} bán một mặt hàng và lãi ${d.x}% giá bán. Hỏi cửa hàng lãi bao nhiêu phần trăm so với ${gocTen}?`
      lg = loiGiai({
        matChot: `Hai phần trăm có hai gốc khác nhau. Coi giá bán là $100\\%$ thì ${gocTen} là $100\\%-${d.x}\\%=${c}\\%$ giá bán; lãi so với ${gocTen} là tỉ số phần trăm của lãi và ${gocTen}.`,
        buoc: [
          `Coi giá bán là $100\\%$; lãi là $${d.x}\\%$ giá bán.`,
          `Tìm ${gocTen} bằng bao nhiêu phần trăm giá bán: lấy $100\\%$ trừ phần lãi.`,
          `Lấy lãi chia cho ${gocTen} (cùng tính theo giá bán) để biết lãi bằng bao nhiêu phần trăm ${gocTen}.`,
        ],
        chuY: `không kết luận lãi $${d.x}\\%$ ${gocTen}: gốc so sánh đã đổi từ giá bán sang ${gocTen}.`,
        dong: [`${gocTen[0].toUpperCase() + gocTen.slice(1)} bằng: $100\\%-${P(d.x)}=${P(c)}$ (giá bán)`, `Lãi so với ${gocTen} bằng: $${P(d.x)}:${P(c)}=${dec(d.x)}:${dec(c)}=${dec(d.y)}=${P(d.y)}$`],
        dapSo: `$${d.y}\\%$`,
      })
    } else {
      const v = 100 + d.x
      nd = `${sh} bán một mặt hàng và lãi ${d.x}% so với ${gocTen}. Hỏi tiền lãi bằng bao nhiêu phần trăm giá bán?`
      lg = loiGiai({
        matChot: `Hai phần trăm có hai gốc khác nhau. Coi ${gocTen} là $100\\%$ thì giá bán là $100\\%+${d.x}\\%=${v}\\%$ ${gocTen}; tiền lãi so với giá bán là tỉ số phần trăm của lãi và giá bán.`,
        buoc: [
          `Coi ${gocTen} là $100\\%$; lãi là $${d.x}\\%$ ${gocTen}.`,
          `Tìm giá bán bằng bao nhiêu phần trăm ${gocTen}: lấy $100\\%$ cộng phần lãi.`,
          `Lấy lãi chia cho giá bán (cùng tính theo ${gocTen}) để biết lãi bằng bao nhiêu phần trăm giá bán.`,
        ],
        chuY: `không kết luận lãi $${d.x}\\%$ giá bán: gốc so sánh đã đổi từ ${gocTen} sang giá bán.`,
        dong: [`Giá bán bằng: $100\\%+${P(d.x)}=${P(v)}$ (${gocTen})`, `Lãi so với giá bán bằng: $${P(d.x)}:${P(v)}=${dec(d.x)}:${dec(v)}=${dec(d.y)}=${P(d.y)}$`],
        dapSo: `$${d.y}\\%$`,
      })
    }
    them(ds, mk('gb_5', nd, `$${d.y}\\%$`, lg, d))
  }
  return ds
}

// ============================================================================
// C. GIẢM GIÁ — 2 kiểu × 30
// ============================================================================
function sinhGiamGia() {
  const k1 = [], k2 = []
  const mk = (kieu, mau, noi_dung, dap_an, lg, tham_so) => ({ dang: DANG.GIAM_GIA, loai: kieu, mau, loai_cau: 'tra_loi_ngan', noi_dung, dap_an, loi_giai: lg, tham_so })
  const Pset = [20, 25, 30, 40, 50, 60, 70, 75, 80, 100]       // lãi ngày thường ≤ 100% giá gốc (thực tế)
  const Dset = [10, 20, 25, 30, 40, 50]
  // bộ ba (p, d, q): (100+p)(100-d)/100 = 100+q, q nguyên dương, còn lãi ≥ 5% và < 100%
  const ba = []
  for (const p of Pset) for (const d of Dset) { const z = ((100 + p) * (100 - d)) / 100; if (Number.isInteger(z) && z >= 105 && z < 200) ba.push({ p, d, z, q: z - 100 }) }
  const bo = shuffle(ba)
  const SHOPGG = ['cửa hàng quần áo', 'siêu thị điện máy', 'cửa hàng giày dép', 'nhà sách', 'cửa hàng đồ gia dụng', 'cửa hàng mỹ phẩm', 'cửa hàng đồ chơi', 'cửa hàng thể thao']
  const DIP = ['nhân dịp khai trương', 'nhân dịp Quốc tế Phụ nữ', 'trong tuần lễ tri ân khách hàng', 'nhân dịp cuối năm', 'nhân ngày lễ', 'để dọn kho', 'vào dịp khuyến mãi mùa hè', 'nhân dịp sinh nhật cửa hàng']
  let i1 = 0, i2 = 0
  const kiem = (arr, n, fn) => { let sx = 0, vong = 0; while (sx < n) { if (++vong > bo.length * 6) throw new Error('hết tổ hợp (giảm giá)'); if (fn(bo[(arr === 1 ? i1++ : i2++) % bo.length]) !== false) sx++ } }
  // ---- Kiểu 1: ngày thường lãi p%, giảm d% → còn lãi bao nhiêu %  (20 chỉ % + 10 có tiền) ----
  kiem(1, 20, (t, k) => {
    const [gocTen] = pick(GOC); const sh = pick(SHOPGG), dip = pick(DIP); const X = 100 + t.p, Y = 100 - t.d
    const nd = pick([
      `Ngày thường, một ${sh} bán hàng với lãi ${t.p}% so với ${gocTen}. ${dip[0].toUpperCase() + dip.slice(1)}, cửa hàng giảm giá ${t.d}% so với giá bán ngày thường. Hỏi khi đó cửa hàng còn lãi bao nhiêu phần trăm so với ${gocTen}?`,
      `Một ${sh} thường bán hàng lãi ${t.p}% ${gocTen}. ${dip[0].toUpperCase() + dip.slice(1)}, cửa hàng hạ giá ${t.d}% so với giá bán thường ngày. Hỏi sau khi hạ giá, cửa hàng còn lãi bao nhiêu phần trăm so với ${gocTen}?`,
    ])
    const lg = loiGiai({
      matChot: `Hai phần trăm có hai gốc khác nhau: lãi $${t.p}\\%$ tính trên ${gocTen}, còn giảm giá $${t.d}\\%$ tính trên **giá bán ngày thường**. Phải đổi giá sau giảm về cùng gốc là ${gocTen} (coi ${gocTen} là $100\\%$).`,
      buoc: [
        `Coi ${gocTen} là $100\\%$, tìm giá bán ngày thường bằng bao nhiêu phần trăm ${gocTen}.`,
        `Giảm giá $${t.d}\\%$ nên giá sau khi giảm bằng $100\\%-${t.d}\\%=${Y}\\%$ giá bán ngày thường.`,
        `Đổi giá sau khi giảm về ${gocTen}: lấy $${X}\\%$ nhân với $${Y}\\%$.`,
        `Giá sau khi giảm hơn ${gocTen} bao nhiêu phần trăm thì đó là phần lãi còn lại.`,
      ],
      chuY: `không lấy $${t.p}\\%-${t.d}\\%$: hai phần trăm này tính trên hai gốc khác nhau.`,
      dong: [
        `Coi ${gocTen} là $100\\%$.`,
        `Giá bán ngày thường bằng: $100\\%+${P(t.p)}=${P(X)}$ (${gocTen})`,
        `Giá sau khi giảm bằng: $100\\%-${P(t.d)}=${P(Y)}$ (giá bán ngày thường)`,
        `Giá sau khi giảm bằng: $${P(X)}\\times ${P(Y)}=${dec(X)}\\times ${dec(Y)}=${dec(t.z)}=${P(t.z)}$ (${gocTen})`,
        `Cửa hàng còn lãi: $${P(t.z)}-100\\%=${P(t.q)}$ (${gocTen})`,
      ],
      dapSo: `Lãi $${t.q}\\%$`,
    })
    return them(k1, mk('giam_gia_1', 'gg_1_pt', nd, `Lãi $${t.q}\\%$`, lg, { p: t.p, d: t.d }))
  })
  kiem(1, 10, (t, k) => {
    // thêm tiền: cho giá gốc G, hỏi tiền lãi còn lại sau giảm
    const cand = shuffle([100000, 120000, 150000, 200000, 240000, 250000, 300000, 400000, 500000, 600000, 800000, 1000000]).find((g) => (g * t.z) % 100 === 0 && (g * t.z / 100) % 1000 === 0 && (g * t.q / 100) % 1000 === 0)
    const G = cand ?? 200000
    if (!((G * t.z) % 100 === 0)) return false
    const [gocTen] = pick(GOC); const sh = pick(SHOPGG), dip = pick(DIP); const X = 100 + t.p, Y = 100 - t.d
    const Bth = (G * X) / 100, Bsau = (G * t.z) / 100, Lai = Bsau - G
    if (Bth % 1000 !== 0 || Bsau % 1000 !== 0) return false
    const nd = `Một ${sh} nhập một mặt hàng với ${gocTen} ${nhom3(G)} đồng. Ngày thường cửa hàng bán lãi ${t.p}% so với ${gocTen}. ${dip[0].toUpperCase() + dip.slice(1)}, cửa hàng giảm giá ${t.d}% so với giá bán ngày thường. Hỏi khi đó, bán mặt hàng này cửa hàng còn lãi bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Giảm giá $${t.d}\\%$ tính trên **giá bán ngày thường**, không phải trên ${gocTen}. Phải tìm giá bán ngày thường trước, rồi giá sau khi giảm, cuối cùng so với ${gocTen} để biết lãi.`,
      buoc: [
        `Tìm giá bán ngày thường: ${gocTen} cộng lãi $${t.p}\\%$ của ${gocTen} (hay lấy ${gocTen} nhân $${X}\\%$).`,
        `Tìm số tiền được giảm: lấy giá bán ngày thường nhân với $${t.d}\\%$, rồi trừ để được giá sau khi giảm.`,
        `Lấy giá sau khi giảm trừ ${gocTen} để biết số tiền còn lãi.`,
      ],
      chuY: `không tính $${t.d}\\%$ của ${gocTen}: tiền giảm tính trên giá bán ngày thường.`,
      dong: [
        `Giá bán ngày thường là: $${raw(G)}\\times ${P(X)}=${raw(Bth)}$ (đồng)`,
        `Giá sau khi giảm là: $${raw(Bth)}\\times ${P(Y)}=${raw(Bsau)}$ (đồng)`,
        `Số tiền cửa hàng còn lãi là: $${raw(Bsau)}-${raw(G)}=${raw(Lai)}$ (đồng)`,
      ],
      dapSo: tien(Lai),
    })
    return them(k1, mk('giam_gia_1', 'gg_1_tien', nd, tien(Lai), lg, { G, p: t.p, d: t.d }))
  })
  // ---- Kiểu 2: giảm d% còn lãi q% → ngày thường lãi bao nhiêu % (20 chỉ % + 10 có tiền) ----
  kiem(2, 20, (t, k) => {
    const [gocTen] = pick(GOC); const sh = pick(SHOPGG), dip = pick(DIP); const Y = 100 - t.d, Z = t.z
    const nd = pick([
      `${dip[0].toUpperCase() + dip.slice(1)}, một ${sh} giảm giá ${t.d}% so với giá niêm yết. Tuy nhiên, cửa hàng vẫn còn lãi ${t.q}% so với ${gocTen}. Hỏi ngày thường (không giảm giá) cửa hàng bán lãi bao nhiêu phần trăm so với ${gocTen}?`,
      `Một ${sh} giảm giá ${t.d}% so với giá niêm yết ${dip}, và bán vẫn lãi ${t.q}% so với ${gocTen}. Hỏi nếu bán đúng giá niêm yết thì cửa hàng lãi bao nhiêu phần trăm so với ${gocTen}?`,
    ])
    const lg = loiGiai({
      matChot: `Có hai giá bán: giá sau khi giảm (biết lãi $${t.q}\\%$ so với ${gocTen}) và giá niêm yết (giá ngày thường). Giảm giá $${t.d}\\%$ là giảm **so với giá niêm yết**, nên giá sau giảm bằng $${Y}\\%$ giá niêm yết — $${t.d}\\%$ này không phải phần trăm của ${gocTen}.`,
      buoc: [
        `Coi ${gocTen} là $100\\%$. Lãi $${t.q}\\%$ nên giá sau khi giảm bằng $${Z}\\%$ ${gocTen}.`,
        `Giá sau khi giảm cũng bằng $${Y}\\%$ giá niêm yết, tức $${Y}\\%$ giá niêm yết là $${Z}\\%$ ${gocTen}.`,
        `Muốn biết giá niêm yết bằng bao nhiêu phần trăm ${gocTen}, lấy $${Z}\\%$ chia cho $${Y}\\%$.`,
        `Giá niêm yết hơn ${gocTen} bao nhiêu phần trăm thì đó là phần lãi ngày thường.`,
      ],
      chuY: `không cộng $${t.d}\\%+${t.q}\\%$: hai phần trăm này tính trên hai gốc khác nhau.`,
      dong: [
        `Coi ${gocTen} là $100\\%$.`,
        `Giá sau khi giảm bằng: $100\\%+${P(t.q)}=${P(Z)}$ (${gocTen})`,
        `Giá sau khi giảm bằng: $100\\%-${P(t.d)}=${P(Y)}$ (giá niêm yết)`,
        `Giá niêm yết bằng: $${P(Z)}:${P(Y)}=${dec(Z)}:${dec(Y)}=${dec(100 + t.p)}=${P(100 + t.p)}$ (${gocTen})`,
        `Ngày thường cửa hàng lãi: $${P(100 + t.p)}-100\\%=${P(t.p)}$ (${gocTen})`,
      ],
      dapSo: `Lãi $${t.p}\\%$`,
    })
    return them(k2, mk('giam_gia_2', 'gg_2_pt', nd, `Lãi $${t.p}\\%$`, lg, { q: t.q, d: t.d }))
  })
  kiem(2, 10, (t, k) => {
    const Z = t.z, Y = 100 - t.d
    const cand = shuffle([100000, 120000, 150000, 200000, 240000, 250000, 300000, 400000, 500000, 600000, 800000, 1000000]).find((g) => (g * Z) % 100 === 0 && (g * (100 + t.p)) % 100 === 0 && ((g * Z) / 100) % 1000 === 0 && ((g * (100 + t.p)) / 100) % 1000 === 0)
    if (!cand) return false
    const G = cand; const [gocTen] = pick(GOC); const sh = pick(SHOPGG), dip = pick(DIP)
    const Bsau = (G * Z) / 100, Bniem = (G * (100 + t.p)) / 100
    const nd = `Một ${sh} nhập một mặt hàng với ${gocTen} ${nhom3(G)} đồng. ${dip[0].toUpperCase() + dip.slice(1)}, cửa hàng giảm giá ${t.d}% so với giá niêm yết và vẫn còn lãi ${t.q}% so với ${gocTen}. Hỏi giá niêm yết của mặt hàng đó là bao nhiêu tiền?`
    const lg = loiGiai({
      matChot: `Giá sau khi giảm bằng $${Y}\\%$ **giá niêm yết**, còn lãi $${t.q}\\%$ tính trên ${gocTen}. Tìm giá sau khi giảm bằng tiền trước, rồi tìm giá niêm yết khi biết $${Y}\\%$ của nó.`,
      buoc: [
        `Tìm giá sau khi giảm: ${gocTen} cộng lãi $${t.q}\\%$ của ${gocTen} (hay ${gocTen} nhân $${Z}\\%$).`,
        `Giảm giá $${t.d}\\%$ nên giá sau khi giảm bằng $100\\%-${t.d}\\%=${Y}\\%$ giá niêm yết.`,
        `Biết $${Y}\\%$ của giá niêm yết là giá sau khi giảm, ta lấy giá sau khi giảm chia cho $${Y}\\%$ để được giá niêm yết.`,
      ],
      chuY: `giảm giá tính trên giá niêm yết nên không lấy giá sau khi giảm cộng thêm $${t.d}\\%$ của nó.`,
      dong: [
        `Giá sau khi giảm là: $${raw(G)}\\times ${P(Z)}=${raw(Bsau)}$ (đồng)`,
        `Giá sau khi giảm bằng: $100\\%-${P(t.d)}=${P(Y)}$ (giá niêm yết)`,
        `Giá niêm yết là: $${raw(Bsau)}:${P(Y)}=${raw(Bniem)}$ (đồng)`,
      ],
      dapSo: tien(Bniem),
    })
    return them(k2, mk('giam_gia_2', 'gg_2_tien', nd, tien(Bniem), lg, { G, q: t.q, d: t.d }))
  })
  return { k1, k2 }
}

/** Sinh đủ lô; mỗi hạng mục báo số câu thực có để người đọc thấy ngay khi thiếu. */
export function sinhTatCa() {
  const cb = sinhCoBan(), tg = sinhTheoGiaBan(), gg = sinhGiamGia()
  const tat = [...cb.gia_goc, ...cb.lai, ...cb.gia_ban, ...cb.ti_le_lai, ...cb.ti_le_ban, ...tg, ...gg.k1, ...gg.k2]
  const dem = {}
  for (const c of tat) dem[`${c.dang}/${c.loai}`] = (dem[`${c.dang}/${c.loai}`] || 0) + 1
  return { cau: tat, dem }
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────
if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-sinh.mjs')) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  const { cau, dem } = sinhTatCa()
  console.log('Sinh', cau.length, 'câu'); console.table(dem)
  const ra = lay('--ra')
  if (ra) { mkdirSync(dirname(ra), { recursive: true }); writeFileSync(ra, JSON.stringify(cau, null, 1)); console.log('→', ra) }
}
