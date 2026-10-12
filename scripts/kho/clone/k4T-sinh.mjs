// ============================================================================
// k4T-sinh.mjs — SINH CÂU CLONE khối 4T THEO MẪU (đề + đáp số + lời giải 2 phần do MÁY dựng từ tham số).
//
//   node scripts/kho/clone/k4T-sinh.mjs <hien-co.json> --ra <lo.json> [--muc-tieu 60] [--seed 20261010] [--dang T14T010106,…]
//
// Vì sao máy sinh (Thùy 10/10: "clone các dạng bài, mỗi dạng khoảng 60 câu"): các dạng 4T đang cạn đều là dạng SỐ, câu trong kho
// vốn là 1–3 câu gốc đổi số. Máy dựng đề từ tham số ⇒ đáp số tính bằng công thức, không có chỗ cho "giải sai"; bộ kiểm
// k4T-kiem.mjs (cùng thư mục) TÍNH LẠI đáp số từ CHỮ CỦA ĐỀ bằng cách khác (vét cạn) — hai đường độc lập phải khớp.
// hien-co.json = [{ ma_dang, app, cau: [{ ma_cau, noi_dung, … }] }] (đọc DB trước khi sinh) ⇒ không sinh câu trùng đề đã có.
// Mỗi mẫu bám MỘT câu gốc (parent): giữ nguyên câu chữ và cách giải của gốc, chỉ đổi số / bối cảnh (spec-clone-ai.md §3).
// Lời giải theo kho-rules/README.md §3: Phần 1 = Mấu chốt + 3–6 `**Bước k.**` + Chú ý; Phần 2 = đúng cái HS viết.
// Ra: [{ dang, parent, mau, loai_cau, noi_dung, dap_an, loi_giai }] — KHÔNG ghi DB (ghi: k4T-ghi.mjs).
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'
import { pathToFileURL } from 'node:url'

// ── tiện ích ─────────────────────────────────────────────────────────────────
export function taoRnd(seed) { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 } }
const day = (a, b) => Array.from({ length: b - a + 1 }, (_, i) => a + i)
const tong = (a) => a.reduce((s, x) => s + x, 0)
const tich = (a) => a.reduce((s, x) => s * x, 1)
const L = (s) => `\\left(${s}\\right)`
/** chuẩn hoá đề để so trùng: chỉ giữ chữ và số */
export const chuanDe = (s) => String(s).normalize('NFC').toLowerCase().replace(/\\ldots|\\times|\\dfrac|\\frac|\\left|\\right/g, (m) => m.slice(1)).replace(/[^\p{L}\p{N}]/gu, '')
function toHop(arr, k) { const ra = []; const di = (i, cur) => { if (cur.length === k) { ra.push([...cur]); return } for (let j = i; j < arr.length; j++) { cur.push(arr[j]); di(j + 1, cur); cur.pop() } }; di(0, []); return ra }
const HANG = { 2: ['chục', 'đơn vị'], 3: ['trăm', 'chục', 'đơn vị'], 4: ['nghìn', 'trăm', 'chục', 'đơn vị'], 5: ['chục nghìn', 'nghìn', 'trăm', 'chục', 'đơn vị'] }
const noi = (a) => a.map((x) => `$${x}$`).join('; ')

/** lời giải 2 phần — buoc: mảng 3–6 chuỗi; p2: mảng dòng */
function lg({ mau_chot, buoc, chu_y, p2 }) {
  if (buoc.length < 3 || buoc.length > 6) throw new Error(`số bước ${buoc.length} (cần 3–6)`)
  return ['**Phần 1. Hướng dẫn**', `**Mấu chốt:** ${mau_chot}`, ...buoc.map((b, i) => `**Bước ${i + 1}.** ${b}`), ...(chu_y ? [`**Chú ý:** ${chu_y}`] : []), '**Phần 2. Trình bày**', ...p2].join('\n\n')
}

// ── CÁC MẪU ─ mỗi mẫu: { dang, parent, ten, ung_vien(): tham số[], dung(tham số): { noi_dung, dap_an, loi_giai } } ───────────
export const MAU = []
const them = (m) => MAU.push(m)

// A1 · T14T010106001 — số nhỏ nhất có tổng các chữ số là N (không bắt khác nhau)
them({ dang: 'T14T010106', parent: 'T14T010106001', ten: 'nho-nhat-tong',
  ung_vien: () => day(10, 54).map((N) => ({ N })),
  dung({ N }) {
    const q = Math.floor(N / 9), r = N % 9, so = (r ? String(r) : '') + '9'.repeat(q)
    const tach = [...(r ? [r] : []), ...Array(q).fill(9)].join('+')
    return { noi_dung: `Tìm số tự nhiên nhỏ nhất có tổng các chữ số là ${N}`, dap_an: so, loi_giai: lg({
      mau_chot: 'Số càng ít chữ số thì càng nhỏ, nên dùng càng nhiều chữ số $9$ càng tốt; đề không bắt các chữ số khác nhau nên chữ số $9$ được dùng nhiều lần.',
      buoc: [
        `Lấy tổng các chữ số chia cho $9$ để biết dùng được nhiều nhất mấy chữ số $9$: $${N}:9=${q}$${r ? ` (dư $${r}$)` : ''}.`,
        r ? `Phần dư $${r}$ là một chữ số nữa, nên số cần tìm có $${q + 1}$ chữ số: chữ số $${r}$ và $${q}$ chữ số $9$.` : `Phép chia không dư nên số cần tìm gồm đúng $${q}$ chữ số $9$, không cần thêm chữ số nào khác.`,
        r ? `Xếp chữ số bé nhất vào hàng cao nhất để được số nhỏ nhất: chữ số $${r}$ đứng đầu, các chữ số $9$ đứng sau.` : 'Các chữ số đều là $9$ nên chỉ có một cách viết số, đó chính là số cần tìm.',
      ],
      chu_y: 'Không thêm chữ số $0$: tổng các chữ số không đổi nhưng số có thêm chữ số nên lớn hơn.',
      p2: ['Số tự nhiên nhỏ nhất khi nó có ít chữ số nhất và chữ số bé nhất đứng ở hàng cao nhất.', `Ta có: $${N}=${tach}$ (dùng nhiều chữ số $9$ nhất).`, r ? `Xếp chữ số $${r}$ ở hàng cao nhất, được số cần tìm là $${so}$.` : `Vậy số cần tìm là $${so}$.`],
    }) }
  } })

// A2 · T14T010106012 — số nhỏ nhất có các chữ số KHÁC NHAU, tổng các chữ số là N
them({ dang: 'T14T010106', parent: 'T14T010106012', ten: 'nho-nhat-tong-khac-nhau',
  ung_vien: () => day(10, 44).map((N) => ({ N })),
  dung({ N }) {
    const lay = []; let con = N, d = 9
    while (d >= 1 && con >= d) { lay.push(d); con -= d; d-- }           // lấy liền 9, 8, 7, … tới khi không đủ
    const ke = d                                                          // chữ số kế tiếp (lấy thêm thì vượt)
    const cs = [...lay, ...(con ? [con] : [])].sort((a, b) => a - b), so = cs.join('')
    const tongLay = N - con
    return { noi_dung: `Viết số tự nhiên nhỏ nhất có các chữ số khác nhau có tổng các chữ số là ${N}`, dap_an: so, loi_giai: lg({
      mau_chot: 'Số càng ít chữ số thì càng nhỏ; các chữ số phải khác nhau nên lấy lần lượt các chữ số lớn nhất $9$; $8$; $7$; ... để dùng ít chữ số nhất.',
      buoc: [
        `Cộng dần các chữ số lớn nhất khác nhau: $${lay.join('+')}${lay.length > 1 ? `=${tongLay}` : ''}$${ke >= 1 ? `; lấy thêm $${ke}$ nữa thì tổng là $${tongLay + ke}$, vượt quá $${N}$ nên dừng` : ''}.`,
        con ? `Phần còn thiếu là $${N}-${tongLay}=${con}$, đó là chữ số thứ ${['', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy', 'tám', 'chín'][lay.length]} (khác các chữ số đã lấy).` : `Tổng vừa đủ $${N}$ nên không cần thêm chữ số nào; số cần tìm có $${lay.length}$ chữ số.`,
        'Xếp các chữ số vừa tìm theo thứ tự từ bé đến lớn, chữ số bé nhất ở hàng cao nhất, để được số nhỏ nhất.',
      ],
      chu_y: 'Không dùng chữ số $0$: tổng các chữ số không đổi nhưng số có thêm chữ số nên lớn hơn.',
      p2: ['Số tự nhiên nhỏ nhất khi nó có ít chữ số nhất và chữ số bé nhất đứng ở hàng cao nhất.', `Ta có: $${N}=${[...cs].reverse().join('+')}$ (các chữ số khác nhau, dùng ít chữ số nhất).`, `Sắp xếp các chữ số từ bé đến lớn, được số cần tìm là $${so}$.`],
    }) }
  } })

// B · T14T040103 — tính thuận tiện a×b ± a×c + a (trong ngoặc ra 100)
for (const [parent, dau] of [['T14T040103001', '+'], ['T14T040103022', '-']]) them({ dang: 'T14T040103', parent, ten: `phan-phoi-${dau === '+' ? 'cong' : 'tru'}`,
  ung_vien() { const ra = []; for (const a of day(2, 99)) for (const b of dau === '+' ? day(12, 87) : day(111, 198)) { const c = dau === '+' ? 99 - b : b - 99; if (a % 10 && b % 10 && c % 10 && c !== b && c >= 11) ra.push({ a, b, c }) } return ra },
  dung({ a, b, c }) {
    const T = '\\times', de = `${a} ${T} ${b} ${dau} ${a} ${T} ${c} + ${a}`
    return { noi_dung: `Tính thuận tiện :\n$${de}$`, dap_an: String(a * 100), loi_giai: lg({
      mau_chot: `Cả ba số hạng đều có thừa số $${a}$ (số $${a}$ đứng riêng chính là $${a}\\times 1$), nên đặt $${a}$ làm thừa số chung.`,
      buoc: [
        `Viết số hạng đứng riêng $${a}$ thành $${a}\\times 1$ để cả ba số hạng cùng có thừa số $${a}$.`,
        `Dùng tính chất nhân một số với một tổng${dau === '+' ? '' : ', một hiệu'}: đưa $${a}$ ra ngoài làm thừa số chung, trong ngoặc còn $${b}${dau}${c}+1$.`,
        `Tính trong ngoặc trước: $${b}${dau}${c}+1=100$ là số tròn trăm, rồi nhân nhẩm với $${a}$.`,
      ],
      chu_y: `Đừng bỏ sót số $1$ trong ngoặc: thiếu nó thì trong ngoặc chỉ còn $99$, không tròn trăm.`,
      p2: [`$${de}$`, `$= ${a} ${T} ${b} ${dau} ${a} ${T} ${c} + ${a} ${T} 1$`, `$= ${a} ${T} ${L(`${b} ${dau} ${c} + 1`)}$`, `$= ${a} ${T} 100$`, `$= ${a * 100}$`],
    }) }
  } })

// C · T14T010102 — số lớn nhất có k chữ số khác nhau, tích các chữ số bằng P
const C_BANG = (() => { const m = new Map(); for (const k of [2, 3, 4]) for (const s of toHop(day(1, 9), k)) { const key = `${k}|${tich(s)}`; if (!m.has(key)) m.set(key, []); m.get(key).push(s) } return m })()
for (const [parent, ks] of [['T14T010102001', [3]], ['T14T010102022', [4]]]) them({ dang: 'T14T010102', parent, ten: `lon-nhat-tich-${ks.join('')}`,
  // k = 3: chỉ lấy tích có ≥ 2 cách tách (như câu gốc — phải so sánh các cách); k = 4: gốc chỉ có 1 cách tách ⇒ lấy cả hai loại
  ung_vien: () => [...C_BANG.entries()].map(([x, bo]) => [...x.split('|').map(Number), bo.length]).filter(([k, P, n]) => ks.includes(k) && P <= 400 && (k === 4 || n >= 2)).map(([k, P]) => ({ k, P })),
  dung({ k, P }) {
    // bo: các cách tách, xếp theo thứ tự liệt kê "từ chữ số bé" (toHop đã sinh theo thứ tự đó) — ĐẢO lại ở các chỗ in để giữ nguyên code dưới
    const lietKe = C_BANG.get(`${k}|${P}`).map((s) => ({ s, so: Number([...s].sort((a, b) => b - a).join('')) }))
    const bo = [...lietKe].reverse()
    const X = '\\times ', viet = (s) => s.join(X)
    const giam = [...lietKe].sort((x, y) => y.so - x.so), dapSo = giam[0].so
    return { noi_dung: `Viết số tự nhiên lớn nhất có ${k} chữ số khác nhau có tích bằng ${P}`, dap_an: String(dapSo), loi_giai: lg({
      mau_chot: `Liệt kê hết các cách viết $${P}$ thành tích của $${k}$ chữ số khác nhau; với mỗi cách, xếp chữ số lớn đứng trước; rồi chọn số lớn nhất.`,
      buoc: [
        `Tách $${P}$ thành tích của $${k}$ chữ số khác nhau, thử lần lượt từ chữ số bé để không sót: ${bo.length === 1 ? `chỉ có một cách là $${viet(bo[0].s)}$` : `có $${bo.length}$ cách là ${[...bo].reverse().map((b) => `$${viet(b.s)}$`).join('; ')}`}.`,
        `Với mỗi cách tách, xếp các chữ số theo thứ tự từ lớn đến bé để được số lớn nhất viết từ các chữ số đó.`,
        bo.length === 1 ? 'Kiểm tra lại không còn cách tách nào khác, khi đó số vừa xếp chính là số cần tìm.' : 'So sánh các số vừa viết: số nào có chữ số hàng cao nhất lớn hơn thì lớn hơn; chọn số lớn nhất.',
      ],
      chu_y: 'Không dùng chữ số $0$ (tích sẽ bằng $0$) và không lặp lại chữ số (các chữ số phải khác nhau).',
      p2: [`Ta có: $${P}=${[...bo].reverse().map((b) => viet(b.s)).join('=')}$`,
        ...(bo.length === 1 ? [`Chỉ có một cách tách, xếp các chữ số từ lớn đến bé được số $${dapSo}$.`] : [...bo].reverse().map((b) => `Với $${viet(b.s)}$, số lớn nhất là $${b.so}$.`)),
        bo.length === 1 ? `Vậy số cần tìm là $${dapSo}$.` : `Vì $${giam.map((b) => b.so).join('>')}$ nên số cần tìm là $${dapSo}$.`],
    }) }
  } })

// D · T14T060101 — số hạng thứ n của dãy cách đều
for (const [parent, kieu] of [['T14T060101001', 'co-cuoi'], ['T14T060101022', 'ba-cham']]) them({ dang: 'T14T060101', parent, ten: `so-hang-thu-n-${kieu}`,
  ung_vien() { const ra = []; for (const a of day(1, 12)) for (const d of day(2, 9)) for (const n of [15, 20, 24, 25, 30, 35, 40, 45, 50, 60, 70, 80]) for (const M of [100, 120, 150, 200]) if (a !== d && n < M) ra.push({ a, d, n, M }); return ra },
  khoa: ({ a, d, n }) => `${a}|${d}|${n}`,
  dung({ a, d, n, M }) {
    const h = (i) => a + (i - 1) * d, cuoi = h(M), kq = h(n)
    const de = kieu === 'co-cuoi' ? `Cho dãy số : ${[1, 2, 3, 4, 5].map(h).join(', ')}, ..........................., ${cuoi - d}, ${cuoi}. Tìm số hạng thứ ${n}` : `Cho dãy số : $${[1, 2, 3, 4].map(h).join(', ')}, \\ldots$. Tìm số hạng thứ ${n}`
    return { noi_dung: de, dap_an: String(kq), loi_giai: lg({
      mau_chot: `Đây là dãy số cách đều: số sau hơn số liền trước $${d}$ đơn vị. Từ số hạng thứ nhất đến số hạng thứ $${n}$ có $${n}-1$ khoảng cách.`,
      buoc: [
        `Tìm khoảng cách giữa hai số hạng liền nhau: $${h(2)}-${h(1)}=${d}$ (thử lại: $${h(3)}-${h(2)}=${d}$).`,
        `Đếm số khoảng cách từ số hạng thứ nhất đến số hạng thứ $${n}$: ít hơn số số hạng $1$ đơn vị, tức là $${n}-1=${n - 1}$ khoảng.`,
        `Lấy số hạng thứ nhất cộng với tổng các khoảng cách đó (số khoảng cách nhân với $${d}$).`,
      ],
      chu_y: `Nhân với $${n - 1}$ chứ không nhân với $${n}$: số hạng thứ nhất chưa cộng khoảng cách nào.`,
      p2: [`Dãy số cách đều, hai số hạng liền nhau hơn kém nhau: $${h(2)}-${h(1)}=${d}$`, `Số hạng thứ $${n}$ là: $${a}+${L(`${n}-1`)}\\times ${d}=${kq}$`, `Đáp số: $${kq}$`],
    }) }
  } })

// E · T14T060102 — số số hạng của dãy cách đều
for (const [parent, kieu] of [['T14T060102001', 'hai-cuoi'], ['T14T060102022', 'mot-cuoi']]) them({ dang: 'T14T060102', parent, ten: `so-so-hang-${kieu}`,
  ung_vien() { const ra = []; for (const a of day(1, 12)) for (const d of day(2, 9)) for (const M of [41, 51, 61, 76, 81, 91, 101, 111, 121, 126, 141, 151, 161, 181, 201]) if (a !== d) ra.push({ a, d, M }); return ra },
  dung({ a, d, M }) {
    const h = (i) => a + (i - 1) * d, cuoi = h(M)
    const de = kieu === 'hai-cuoi' ? `Cho dãy số : ${[1, 2, 3, 4, 5].map(h).join(', ')}, ............................, ${cuoi - d}, ${cuoi}. Tính số số hạng của dãy số trên` : `Cho dãy số : ${[1, 2, 3, 4, 5].map(h).join(', ')}, ..., ${cuoi}. Tính số số hạng của dãy số trên`
    return { noi_dung: de, dap_an: String(M), loi_giai: lg({
      mau_chot: `Dãy số cách đều $${d}$ đơn vị: số khoảng cách bằng (số cuối $-$ số đầu) chia cho $${d}$, và số số hạng nhiều hơn số khoảng cách $1$.`,
      buoc: [
        `Tìm khoảng cách giữa hai số hạng liền nhau: $${h(2)}-${h(1)}=${d}$ (thử lại: $${h(3)}-${h(2)}=${d}$).`,
        `Tính số khoảng cách từ số đầu đến số cuối: lấy hiệu của số cuối và số đầu chia cho $${d}$.`,
        `Cộng thêm $1$ vào số khoảng cách để được số số hạng (hai đầu của mỗi khoảng cách đều là số hạng).`,
      ],
      chu_y: 'Đừng quên cộng $1$: có $1$ khoảng cách thì đã có $2$ số hạng.',
      p2: [`Dãy số cách đều, hai số hạng liền nhau hơn kém nhau: $${h(2)}-${h(1)}=${d}$`, `Số số hạng của dãy số là: $${L(`${cuoi}-${a}`)}:${d}+1=${M}$ (số hạng)`, `Đáp số: $${M}$ số hạng`],
    }) }
  } })

// F / J — dựng số nhỏ nhất / lớn nhất có k chữ số (khác nhau hoặc không) với tổng S: chọn từng hàng từ trái sang
function chonTungHang(k, S, khacNhau, nhoNhat) {
  const dung = new Set(), cs = [], ly = []
  const gioiHan = (m, cam) => {          // các chữ số cho tổng bé nhất / lớn nhất của m hàng còn lại
    if (m === 0) return { lo: 0, hi: 0, csLo: [], csHi: [] }
    if (!khacNhau) return { lo: 0, hi: 9 * m, csLo: Array(m).fill(0), csHi: Array(m).fill(9) }
    const con = day(0, 9).filter((x) => !cam.has(x)); if (con.length < m) return { lo: 1, hi: 0, csLo: [], csHi: [] }
    return { lo: tong(con.slice(0, m)), hi: tong(con.slice(-m)), csLo: con.slice(0, m), csHi: con.slice(-m).reverse() }
  }
  let con = S
  for (let i = 0; i < k; i++) {
    const m = k - i - 1, thu = nhoNhat ? day(i === 0 ? 1 : 0, 9) : day(i === 0 ? 1 : 0, 9).reverse()
    let chon = null, dauTien = null
    for (const d of thu) {
      if (khacNhau && dung.has(d)) continue
      if (dauTien === null) dauTien = d
      const cam = new Set(dung); cam.add(d); const g = gioiHan(m, cam)
      if (con - d >= g.lo && con - d <= g.hi) { chon = d; break }
    }
    if (chon === null) return null
    const cam = new Set(dung); cam.add(chon)
    ly.push({ d: chon, dauTien, truoc: con, sau: con - chon, m, ...gioiHan(m, cam) })
    dung.add(chon); cs.push(chon); con -= chon
  }
  return con === 0 ? { so: cs.join(''), ly } : null
}
const SO_CHU = ['', 'Một', 'Hai', 'Ba', 'Bốn']
function loiTungHang(k, S, khacNhau, nhoNhat) {
  const kq = chonTungHang(k, S, khacNhau, nhoNhat); if (!kq) return null
  const H = HANG[k], buoc = [], p2 = []
  const conLai = (m) => (m === 1 ? 'chữ số còn lại' : `${SO_CHU[m].toLowerCase()} chữ số còn lại`)
  for (let i = 0; i < k; i++) {
    const { d, dauTien, truoc, sau, lo, hi, csLo, csHi, m } = kq.ly[i], ten = `hàng ${H[i]}`
    if (m === 0) {
      if (d !== truoc) return null
      buoc.push(`Chữ số ${ten} là phần tổng còn lại sau khi đã chọn các hàng trước: $${d}$.`)
      p2.push(`Chữ số ${ten} là $${d}$.`)
      continue
    }
    // số LỚN nhất, không bắt khác nhau, tổng đã dùng hết: các hàng còn lại đều là 0 ⇒ gộp một bước rồi dừng
    if (!nhoNhat && !khacNhau && truoc === 0) {
      const cacHang = H.slice(i).map((h) => `hàng ${h}`).join(', ')
      buoc.push(`Tổng các chữ số đã đủ $${S}$ nên ${k - i === 1 ? 'chữ số' : 'các chữ số'} ${cacHang} đều là $0$.`)
      p2.push(`Tổng các chữ số đã đủ $${S}$ nên ${cacHang} là chữ số $0$.`)
      break
    }
    if (d === dauTien) {
      const vi = i === 0 ? (nhoNhat ? ' (hàng cao nhất phải khác $0$)' : '') : (khacNhau && !(nhoNhat && d === 0) ? ' (khác các chữ số đã chọn)' : '')
      buoc.push(`Chọn chữ số ${ten} ${nhoNhat ? 'bé' : 'lớn'} nhất có thể là $${d}$${vi}. Khi đó ${m === 1 ? `chữ số còn lại phải là $${truoc}-${d}=${sau}$` : `${conLai(m)} có tổng là $${truoc}-${d}=${sau}$`}.`)
      p2.push(`Chọn chữ số ${ten} ${nhoNhat ? 'bé' : 'lớn'} nhất là $${d}$. ${m === 1 ? 'Chữ số còn lại là' : `Tổng ${conLai(m)} là`}: $${truoc}-${d}=${sau}$`)
    } else if (nhoNhat) {
      // phải lớn hơn chữ số bé nhất còn dùng được, vì các hàng sau không gánh nổi phần tổng còn lại: d = truoc − (tổng lớn nhất của m hàng sau)
      if (truoc - hi !== d) return null
      const max = m === 1 ? `Chữ số còn lại lớn nhất chỉ là $${hi}$` : `${SO_CHU[m]} chữ số còn lại${khacNhau ? ' (khác nhau)' : ''} có tổng lớn nhất là $${csHi.join('+')}=${hi}$`
      buoc.push(`${max}, nên chữ số ${ten} bé nhất có thể là $${truoc}-${hi}=${d}$.`)
      p2.push(`${max} nên chữ số ${ten} bé nhất là: $${truoc}-${hi}=${d}$`)
    } else {
      // số lớn nhất mà không lấy được chữ số lớn nhất còn dùng được: bị chặn bởi tổng còn lại (d = truoc − tổng bé nhất của m hàng sau)
      if (truoc - lo !== d || (lo > 0 && m === 1)) return null
      if (lo === 0) {
        buoc.push(`Tổng còn lại chỉ là $${truoc}$ nên chữ số ${ten} lớn nhất có thể là $${d}$.`)
        p2.push(`Tổng còn lại là $${truoc}$ nên chọn chữ số ${ten} lớn nhất là $${d}$.`)
      } else {
        const min = `${SO_CHU[m]} chữ số còn lại (khác nhau) có tổng bé nhất là $${csLo.join('+')}=${lo}$`
        buoc.push(`${min}, nên chữ số ${ten} lớn nhất có thể là $${truoc}-${lo}=${d}$.`)
        p2.push(`${min} nên chữ số ${ten} lớn nhất là: $${truoc}-${lo}=${d}$`)
      }
    }
  }
  if (buoc.length < 3) return null
  p2.push(`Vậy số cần tìm là $${kq.so}$.`)
  return { so: kq.so, buoc, p2 }
}

// F · T14T010105 — số nhỏ nhất có k chữ số khác nhau, tổng các chữ số S
for (const [parent, ks, cham] of [['T14T010105001', [3], '.'], ['T14T010105007', [4, 5], '']]) them({ dang: 'T14T010105', parent, ten: `nho-nhat-k-chu-so-tong-${ks.join('')}`,
  ung_vien() { const ra = []; for (const k of ks) for (const S of day(k === 3 ? 6 : k === 4 ? 9 : 12, k === 3 ? 24 : k === 4 ? 30 : 35)) if (loiTungHang(k, S, true, true)) ra.push({ k, S }); return ra }, nhom: ({ k }) => k,
  dung({ k, S }) {
    const x = loiTungHang(k, S, true, true)
    return { noi_dung: `Viết số tự nhiên nhỏ nhất có ${k} chữ số khác nhau có tổng là ${S}${cham}`, dap_an: x.so, loi_giai: lg({
      mau_chot: 'Muốn số nhỏ nhất thì chọn chữ số bé nhất cho hàng cao nhất trước, rồi lần lượt đến các hàng sau; mỗi lần chọn phải bảo đảm các chữ số còn lại (khác nhau) vẫn đủ tổng.',
      buoc: x.buoc, chu_y: 'Chữ số hàng cao nhất phải khác $0$; các chữ số khác nhau nên không dùng lại chữ số đã chọn.', p2: x.p2,
    }) }
  } })

// J · T14T010101 — số lớn nhất có k chữ số (không bắt khác nhau / khác nhau), tổng các chữ số S
for (const [parent, khac, cham] of [['T14T010101001', false, '.'], ['T14T010101022', true, '']]) them({ dang: 'T14T010101', parent, ten: `lon-nhat-k-chu-so-tong-${khac ? 'khac' : 'lap'}`,
  ung_vien() { const ra = []; for (const k of [3, 4]) for (const S of day(k === 3 ? 10 : 12, k === 3 ? (khac ? 24 : 26) : (khac ? 30 : 34))) if (loiTungHang(k, S, khac, false)) ra.push({ k, S }); return ra }, nhom: ({ k }) => k,
  dung({ k, S }) {
    const x = loiTungHang(k, S, khac, false)
    return { noi_dung: `Tìm số tự nhiên lớn nhất có ${k} chữ số${khac ? ' khác nhau' : ''} có tổng là ${S}${cham}`, dap_an: x.so, loi_giai: lg({
      mau_chot: `Muốn số lớn nhất thì chọn chữ số lớn nhất cho hàng cao nhất trước, rồi lần lượt đến các hàng sau, sao cho tổng các chữ số vẫn đúng bằng $${S}$${khac ? ' và các chữ số khác nhau' : ''}.`,
      buoc: x.buoc, chu_y: khac ? 'Các chữ số phải khác nhau nên hàng sau không được lấy lại chữ số của hàng trước.' : 'Đề không bắt các chữ số khác nhau nên được dùng lại chữ số $9$.', p2: x.p2,
    }) }
  } })

// G · T14T010103 — số lớn nhất có các chữ số khác nhau, tổng các chữ số N
function lonNhatKhacNhau(N) {
  let k = 0; while (k < 10 && tong(day(0, k)) <= N) k++                    // nhiều chữ số nhất: 0+1+…+(k−1) ≤ N
  const dung = new Set(), cs = []; let con = N
  for (let i = 0; i < k; i++) {
    const m = k - i - 1; let chon = null
    for (const d of day(0, 9).reverse()) {
      if (dung.has(d)) continue
      const r = day(0, 9).filter((x) => !dung.has(x) && x !== d); if (r.length < m) continue
      const lo = tong(r.slice(0, m)), hi = m ? tong(r.slice(-m)) : 0
      if (con - d >= lo && con - d <= hi) { chon = d; break }
    }
    if (chon === null) return null
    dung.add(chon); cs.push(chon); con -= chon
  }
  if (con !== 0) return null
  // lời giải nói "dồn phần thiếu vào chữ số lớn nhất trước, tối đa 9, dư thì dồn tiếp": dựng lại theo đúng lời đó, phải ra cùng bộ chữ số
  const don = day(0, k - 1); let du = N - tong(don)
  for (let i = k - 1, tran = 9; i >= 0 && du > 0; i--, tran--) { const t = Math.min(du, tran - don[i]); don[i] += t; du -= t }
  if (du !== 0 || don.join() !== [...cs].sort((a, b) => a - b).join()) return null
  return { k, cs }
}
them({ dang: 'T14T010103', parent: 'T14T010103001', ten: 'lon-nhat-tong-khac-nhau',
  ung_vien: () => day(3, 44).filter((N) => lonNhatKhacNhau(N)).map((N) => ({ N })),
  dung({ N }) {
    const { k, cs } = lonNhatKhacNhau(N), so = cs.join(''), coSo = tong(day(0, k - 1)), thieu = N - coSo
    const tang = [...cs].sort((a, b) => a - b)
    return { noi_dung: `Tìm số tự nhiên lớn nhất có các chữ số khác nhau có tổng là ${N}`, dap_an: so, loi_giai: lg({
      mau_chot: 'Số càng nhiều chữ số thì càng lớn, nên tách tổng thành càng nhiều chữ số khác nhau càng tốt: ưu tiên các chữ số bé $0$; $1$; $2$; ... trước.',
      buoc: [
        `Cộng dần các chữ số bé nhất khác nhau: $${day(0, k - 1).join('+')}=${coSo}$${thieu ? ` chưa vượt $${N}$` : `, vừa bằng $${N}$`}${k < 10 ? `; lấy thêm $${k}$ nữa thì tổng là $${coSo + k}$, vượt quá $${N}$` : ''}. Vậy dùng được nhiều nhất $${k}$ chữ số.`,
        thieu ? `Còn thiếu $${N}-${coSo}=${thieu}$: dồn phần thiếu vào chữ số lớn nhất trước (tối đa đến $9$, còn dư thì dồn tiếp vào chữ số lớn thứ hai) để số càng lớn. Được các chữ số ${noi(tang)}.` : `Tổng vừa đủ $${N}$ nên các chữ số cần dùng chính là ${noi(tang)}.`,
        'Xếp các chữ số theo thứ tự từ lớn đến bé, chữ số lớn nhất ở hàng cao nhất, để được số lớn nhất.',
      ],
      chu_y: 'Phải dùng cả chữ số $0$ (thêm được một chữ số mà tổng không đổi); chữ số $0$ đứng ở hàng đơn vị.',
      p2: ['Số tự nhiên lớn nhất khi nó có nhiều chữ số nhất và chữ số lớn nhất đứng ở hàng cao nhất.', `Ta có: $${N}=${tang.join('+')}$ (nhiều chữ số khác nhau nhất).`, `Sắp xếp các chữ số từ lớn đến bé, được số cần tìm là $${so}$.`],
    }) }
  } })

// H · T14T040201 — chia cho số có hai chữ số (hết / có dư), thương có hai chữ số
for (const [parent, coDu] of [['T14T040201001', false], ['T14T040201022', true]]) them({ dang: 'T14T040201', parent, ten: `chia-2-chu-so-${coDu ? 'du' : 'het'}`,
  ung_vien() { const ra = []; for (const b of day(12, 48)) for (const q of day(11, 79)) for (const r of coDu ? [3, 5, 7, 8, 11, 13, 14, 17, 19, 21, 23] : [0]) { const A = b * q + r; if (r < b && A >= 200 && A <= 999 && b % 10 && Math.floor(A / 10) >= b) ra.push({ A, b }) } return ra },
  dung({ A, b }) {
    const q = Math.floor(A / b), r = A % b, a1 = Math.floor(A / 10), q1 = Math.floor(a1 / b), r1 = a1 - q1 * b, a2 = r1 * 10 + (A % 10), q2 = Math.floor(a2 / b), r2 = a2 - q2 * b
    if (q1 * 10 + q2 !== q || r2 !== r) throw new Error('chia sai')
    return { noi_dung: `Tính $${A} : ${b}$`, dap_an: r ? `${q} dư ${r}` : String(q), loi_giai: lg({
      mau_chot: 'Chia cho số có hai chữ số: chia lần lượt từ trái sang phải; mỗi lượt ước lượng một chữ số của thương, nhân ngược lại rồi trừ để tìm số dư của lượt đó.',
      buoc: [
        `Lượt chia thứ nhất: lấy $${a1}$ chia $${b}$ được $${q1}$; $${q1}\\times ${b}=${q1 * b}$; $${a1}-${q1 * b}=${r1}$.`,
        q2 === 0 ? `Lượt chia thứ hai: hạ $${A % 10}$ được $${a2}$; $${a2}$ bé hơn $${b}$ nên viết $0$ vào thương, còn lại $${a2}$.` : `Lượt chia thứ hai: hạ $${A % 10}$ được $${a2}$; $${a2}$ chia $${b}$ được $${q2}$; $${q2}\\times ${b}=${q2 * b}$; $${a2}-${q2 * b}=${r2}$.`,
        `Ghép hai chữ số vừa tìm theo thứ tự để được thương; số còn lại sau lượt chia cuối là số dư${coDu ? ' (số dư phải bé hơn số chia)' : ' (ở đây phép chia hết)'}.`,
      ],
      chu_y: `Sau mỗi lượt, số còn lại phải bé hơn $${b}$; nếu chưa bé hơn thì chữ số thương vừa ước lượng còn nhỏ.`,
      p2: [r ? `$${A} : ${b} = ${q}$ (dư $${r}$)` : `$${A} : ${b} = ${q}$`, r ? `Thử lại: $${q}\\times ${b}+${r}=${A}$` : `Thử lại: $${q}\\times ${b}=${A}$`],
    }) }
  } })

// I · T14T010104 — số chẵn / lẻ lớn nhất / nhỏ nhất có k chữ số khác nhau (k = 2, 8, 9 — các k còn lại kho đã có)
them({ dang: 'T14T010104', parent: 'T14T010104001', ten: 'chan-le-lon-nho-k-chu-so',
  ung_vien() { const ra = []; for (const k of [2, 8, 9]) for (const le of [true, false]) for (const lon of [true, false]) ra.push({ k, le, lon }); return ra },
  dung({ k, le, lon }) {
    const dau = lon ? day(0, 9).reverse().slice(0, k - 1) : [1, 0, ...day(2, 9)].slice(0, k - 1)
    const conLai = day(0, 9).filter((x) => !dau.includes(x) && (x % 2 === 1) === le)
    const cuoi = lon ? Math.max(...conLai) : Math.min(...conLai), so = [...dau, cuoi].join('')
    const tc = le ? 'lẻ' : 'chẵn', csTc = le ? '$1$; $3$; $5$; $7$; $9$' : '$0$; $2$; $4$; $6$; $8$'
    return { noi_dung: `Viết số tự nhiên ${tc}, ${lon ? 'lớn' : 'nhỏ'} nhất có ${k} chữ số khác nhau`, dap_an: so, loi_giai: lg({
      mau_chot: `Số ${lon ? 'lớn' : 'nhỏ'} nhất thì các hàng cao lấy chữ số ${lon ? 'lớn' : 'bé'} nhất có thể; số ${tc} hay không chỉ phụ thuộc chữ số hàng đơn vị.`,
      buoc: [
        k === 2 ? `Chọn chữ số hàng chục ${lon ? 'lớn nhất là $9$' : 'bé nhất là $1$ (hàng cao nhất phải khác $0$)'}.` : `Viết $${k - 1}$ chữ số đầu là các chữ số ${lon ? 'lớn' : 'bé'} nhất khác nhau, từ hàng cao xuống: ${noi(dau)}${lon ? '' : ' (hàng cao nhất phải khác $0$ nên bắt đầu bằng $1$ rồi mới đến $0$)'}.`,
        `Chọn chữ số hàng đơn vị: phải là chữ số ${tc} (${csTc}), khác các chữ số đã dùng và ${lon ? 'lớn' : 'bé'} nhất có thể, đó là $${cuoi}$.`,
        `Ghép các chữ số theo đúng thứ tự các hàng rồi kiểm tra lại hai điều kiện: các chữ số khác nhau và số là số ${tc}.`,
      ],
      chu_y: lon ? 'Chỉ đổi chữ số hàng đơn vị cho đúng chẵn, lẻ; các hàng cao vẫn giữ chữ số lớn nhất.' : 'Chữ số $0$ không đứng ở hàng cao nhất, nhưng nên dùng ngay ở hàng thứ hai để số nhỏ nhất.',
      p2: [k === 2 ? `Số ${lon ? 'lớn' : 'nhỏ'} nhất thì chữ số hàng chục ${lon ? 'lớn' : 'bé'} nhất, là $${dau[0]}$.` : `Số ${lon ? 'lớn' : 'nhỏ'} nhất có các chữ số khác nhau thì các hàng cao lần lượt là: ${noi(dau)}.`, `Số cần tìm là số ${tc} nên chữ số hàng đơn vị là chữ số ${tc} ${lon ? 'lớn' : 'bé'} nhất chưa dùng: $${cuoi}$.`, `Vậy số cần tìm là $${so}$.`],
    }) }
  } })

// K / L · đếm số có k chữ số khác nhau lập từ n chữ số (không có 0 / có 0)
function demLap(parent, dang, coKhong, ten) {
  them({ dang, parent, ten,
    ung_vien() { const ra = []; for (const n of [3, 4, 5, 6]) for (const k of [2, 3, 4]) { if (k > n) continue; for (const s of toHop(day(1, 9), coKhong ? n - 1 : n)) ra.push({ cs: coKhong ? [0, ...s] : s, k }) } return ra },
    khoa: ({ cs, k }) => `${cs.join('')}|${k}`, nhom: ({ cs, k }) => `${cs.length}|${k}`, lapDapSo: Infinity,
    dung({ cs, k }) {
      const n = cs.length, H = HANG[k], cach = Array.from({ length: k }, (_, i) => (coKhong ? (i === 0 ? n - 1 : n - i) : n - i)), kq = tich(cach)
      const buoc = cach.map((c, i) => i === 0
        ? `Chọn chữ số hàng ${H[0]}: ${coKhong ? `có $${n}$ chữ số nhưng chữ số $0$ không đứng đầu được, nên còn $${c}$ cách chọn` : `chọn một trong $${n}$ chữ số đã cho nên có $${c}$ cách chọn`}.`
        : `Chọn chữ số hàng ${H[i]}: phải khác ${i === 1 ? 'chữ số hàng ' + H[0] : 'các chữ số đã chọn ở ' + ['', '', 'hai', 'ba'][i] + ' hàng trước'}${coKhong && i === 1 ? ' (lúc này được dùng chữ số $0$)' : ''}, nên còn $${n}-${i}=${c}$ cách chọn.`)
      buoc.push('Mỗi cách chọn ở hàng này ghép được với mọi cách chọn ở hàng kia, nên nhân các số cách chọn với nhau.')
      return { noi_dung: `Từ các chữ số ${cs.join(', ')} viết được bao nhiêu số có ${k} chữ số khác nhau ?`, dap_an: String(kq), loi_giai: lg({
        mau_chot: `Đếm số cách chọn chữ số cho từng hàng, từ hàng cao nhất; chữ số đã dùng ở hàng trước thì không dùng lại${coKhong ? '; riêng hàng cao nhất không được chọn chữ số $0$' : ''}.`,
        buoc,
        chu_y: coKhong ? 'Chỉ hàng cao nhất mới phải khác $0$; các hàng sau vẫn dùng được chữ số $0$.' : 'Các chữ số phải khác nhau nên mỗi hàng sau ít hơn hàng trước một cách chọn.',
        p2: [...cach.map((c, i) => `Hàng ${H[i]} có $${c}$ cách chọn${i === 0 && coKhong ? ' (khác $0$)' : ''}.`), `Số các số viết được là: $${cach.join('\\times ')}=${kq}$ (số)`, `Đáp số: $${kq}$ số`],
      }) }
    } })
}
demLap('T14T020101001', 'T14T020101', false, 'dem-lap-khong-0')
demLap('T14T020102001', 'T14T020102', true, 'dem-lap-co-0')

// M · T14T020103 — đếm số CHẴN có 3 chữ số khác nhau lập từ n chữ số có chữ số 0
them({ dang: 'T14T020103', parent: 'T14T020103001', ten: 'dem-so-chan-co-0',
  ung_vien() { const ra = []; for (const n of [4, 5]) for (const s of toHop(day(1, 9), n - 1)) if (s.some((x) => x % 2 === 0)) ra.push({ cs: [0, ...s] }); return ra },
  nhom: ({ cs }) => `${cs.length}|${cs.filter((x) => x && x % 2 === 0).length}`, lapDapSo: Infinity,
  dung({ cs }) {
    const n = cs.length, chan = cs.filter((x) => x && x % 2 === 0), t0 = (n - 1) * (n - 2), t1 = (n - 2) * (n - 2), kq = t0 + chan.length * t1
    const buoc = [
      `Số chẵn thì chữ số hàng đơn vị phải chẵn; trong các chữ số đã cho, chữ số chẵn là ${noi([0, ...chan])}. Vì có chữ số $0$ nên tách riêng từng trường hợp của hàng đơn vị.`,
      `Trường hợp hàng đơn vị là $0$: hàng trăm chọn trong $${n - 1}$ chữ số còn lại, hàng chục chọn trong $${n - 2}$ chữ số còn lại.`,
    ]
    if (chan.length) buoc.push(`Trường hợp hàng đơn vị là ${chan.length === 1 ? `$${chan[0]}$` : `một chữ số chẵn khác $0$ (${noi(chan)})`}: hàng trăm phải khác $0$ và khác chữ số hàng đơn vị nên có $${n - 2}$ cách; hàng chục có $${n - 2}$ cách.`)
    buoc.push('Cộng số các số của tất cả các trường hợp lại.')
    const p2 = [`Vì số cần lập là số chẵn nên hàng đơn vị là ${[0, ...chan].slice(0, -1).map((x) => `$${x}$`).join(', ')} hoặc $${chan[chan.length - 1]}$.`]
    p2.push('Trường hợp 1: Hàng đơn vị là $0$.', `Hàng trăm có $${n - 1}$ cách chọn, hàng chục có $${n - 2}$ cách chọn.`, `Có: $${n - 1}\\times ${n - 2}=${t0}$ (số)`)
    chan.forEach((c, i) => p2.push(`Trường hợp ${i + 2}: Hàng đơn vị là $${c}$.`, `Hàng trăm có $${n - 2}$ cách chọn (khác $0$ và khác $${c}$), hàng chục có $${n - 2}$ cách chọn.`, `Có: $${n - 2}\\times ${n - 2}=${t1}$ (số)`))
    p2.push(chan.length ? `Số các số chẵn viết được là: $${[t0, ...chan.map(() => t1)].join('+')}=${kq}$ (số)` : `Số các số chẵn viết được là $${kq}$ số.`, `Đáp số: $${kq}$ số`)
    return { noi_dung: `Từ các chữ số ${cs.join(', ')} viết được bao nhiêu số chẵn có 3 chữ số khác nhau ?`, dap_an: String(kq), loi_giai: lg({
      mau_chot: 'Số chẵn do chữ số hàng đơn vị quyết định, còn chữ số $0$ thì không được đứng ở hàng trăm. Hai điều kiện vướng nhau nên chia trường hợp theo chữ số hàng đơn vị.',
      buoc, chu_y: 'Khi hàng đơn vị khác $0$ thì hàng trăm mất hai chữ số (chữ số $0$ và chữ số hàng đơn vị), còn hàng chục lại được dùng chữ số $0$.', p2,
    }) }
  } })

// N · T14T040102 — nhân số có nhiều chữ số (đặt tính)
for (const [parent, soCs] of [['T14T040102001', 2], ['T14T040102043', 3]]) them({ dang: 'T14T040102', parent, ten: `nhan-${soCs}x${soCs}`,
  ung_vien() { const ra = [], khong0 = (x) => !String(x).includes('0'); const R = soCs === 2 ? day(12, 98) : day(112, 498); for (const a of R) for (const b of R) if (khong0(a) && khong0(b) && a !== b && String(b).split('').every((c) => +c > 1)) ra.push({ a, b }); return ra },
  dung({ a, b }) {
    const cs = String(b).split('').map(Number).reverse(), X = '\\times ', ten = ['nhất', 'hai', 'ba'], gt = ['đơn vị', 'chục', 'trăm']
    const rieng = cs.map((c, i) => ({ c, t: a * c, that: a * c * 10 ** i }))
    const buoc = rieng.map((r, i) => i === 0 ? `Tích riêng thứ nhất: lấy $${a}$ nhân với chữ số hàng đơn vị của $${b}$: $${a}${X}${r.c}=${r.t}$.`
      : `Tích riêng thứ ${ten[i]}: $${a}${X}${r.c}=${r.t}$; vì $${r.c}$ là $${r.c}$ ${gt[i]} nên viết lùi sang trái ${i === 1 ? 'một' : 'hai'} cột (thực chất là $${r.that}$).`)
    buoc.push('Cộng các tích riêng theo từng cột, từ phải sang trái, nhớ sang cột bên trái khi cần.')
    return { noi_dung: `Đặt tính rồi tính : $${a} ${X}${b}$`, dap_an: String(a * b), loi_giai: lg({
      mau_chot: `Nhân với số có ${soCs === 2 ? 'hai' : 'ba'} chữ số: lấy thừa số thứ nhất nhân lần lượt với từng chữ số của thừa số thứ hai (từ phải sang trái), mỗi tích riêng viết lùi sang trái thêm một cột, rồi cộng các tích riêng.`,
      buoc, chu_y: 'Viết thẳng cột: tích riêng thứ hai bắt đầu từ cột chục. Viết lệch cột là cộng sai.',
      p2: [`$${a} ${X}${b}$`, `$= ${rieng.map((r, i) => `${a} ${X}${r.c * 10 ** i}`).join(' + ')}$`, `$= ${rieng.map((r) => r.that).join(' + ')}$`, `$= ${a * b}$`],
    }) }
  } })

// O · T14T060104 — một số có thuộc dãy cách đều không, là số hạng thứ mấy (trường hợp CÓ)
them({ dang: 'T14T060104', parent: 'T14T060104001', ten: 'vi-tri-trong-day',
  ung_vien() { const ra = []; for (const a of day(1, 11)) for (const d of day(3, 12)) for (const M of [51, 61, 76, 81, 101, 121, 151]) for (const n of [18, 22, 26, 30, 34, 38, 42, 46, 55, 64, 72]) if (a < d && n < M - 3) ra.push({ a, d, M, n }); return ra },
  khoa: ({ a, d, n }) => `${a}|${d}|${n}`,
  dung({ a, d, M, n }) {
    const h = (i) => a + (i - 1) * d, cuoi = h(M), X = h(n)
    return { noi_dung: `Cho dãy số : ${[1, 2, 3, 4, 5].map(h).join(', ')}, ........................., ${cuoi - d}, ${cuoi}\nSố ${X} có thuộc dãy trên không ? Nếu có là số hạng thứ mấy ?`, dap_an: String(n), loi_giai: lg({
      mau_chot: `Các số hạng của dãy cách đều $${d}$ đơn vị nên khi chia cho $${d}$ đều có cùng một số dư. Một số thuộc dãy khi nó không vượt quá số cuối và chia cho $${d}$ cũng có số dư đó.`,
      buoc: [
        `Tìm khoảng cách giữa hai số hạng liền nhau: $${h(2)}-${h(1)}=${d}$.`,
        `Tìm số dư chung của các số hạng khi chia cho $${d}$: chẳng hạn $${h(2)}:${d}=${Math.floor(h(2) / d)}$ (dư $${a}$), $${h(3)}:${d}=${Math.floor(h(3) / d)}$ (dư $${a}$).`,
        `Kiểm tra số $${X}$: $${X}:${d}=${Math.floor(X / d)}$ (dư $${a}$), cùng số dư với các số hạng, và $${X}$ bé hơn số cuối $${cuoi}$, nên $${X}$ thuộc dãy.`,
        `Tìm vị trí: đếm số khoảng cách từ số đầu đến $${X}$ (lấy hiệu chia cho $${d}$) rồi cộng thêm $1$.`,
      ],
      chu_y: 'Phải kiểm tra số đó có thuộc dãy trước, rồi mới tính vị trí; khi tính vị trí đừng quên cộng $1$.',
      p2: [`Các số hạng của dãy khi chia cho $${d}$ đều dư $${a}$.`, `Mà $${X}$ chia $${d}$ dư $${a}$ và $${X}$ bé hơn $${cuoi}$ nên $${X}$ thuộc dãy số.`, `$${X}$ là số hạng thứ: $${L(`${X}-${a}`)}:${d}+1=${n}$`, `Đáp số: Có, là số hạng thứ $${n}$`],
    }) }
  } })

// P · T14T070102 — trồng cây khép kín quanh hình chữ nhật
const P_BOI_CANH = [
  { noi: 'Một sân bóng', vat: 'lá cờ', lam: 'cắm cờ', cau: (D, R, k) => `Một sân bóng có chiều dài ${D} m và chiều rộng ${R} m. Người ta cắm cờ xung quanh sân bóng, hai lá cờ liên tiếp cách nhau ${k} m. Hỏi cần bao nhiêu lá cờ để cắm đủ xung quanh sân bóng, biết mỗi góc sân đều cắm cờ?`, ten: 'sân bóng', hoi: 'Số lá cờ cần cắm là' },
  { vat: 'cái cọc', cau: (D, R, k) => `Một mảnh vườn hình chữ nhật có chiều dài ${D} m và chiều rộng ${R} m. Bác Tư đóng cọc rào xung quanh mảnh vườn, hai cọc liên tiếp cách nhau ${k} m. Hỏi bác Tư cần bao nhiêu cái cọc, biết mỗi góc vườn đều có cọc?`, ten: 'mảnh vườn', hoi: 'Số cái cọc bác Tư cần là' },
  { vat: 'cây dừa', cau: (D, R, k) => `Một cái ao hình chữ nhật có chiều dài ${D} m và chiều rộng ${R} m. Người ta trồng dừa xung quanh bờ ao, hai cây dừa liên tiếp cách nhau ${k} m. Hỏi trồng được bao nhiêu cây dừa, biết mỗi góc ao đều trồng cây?`, ten: 'cái ao', hoi: 'Số cây dừa trồng được là' },
  { vat: 'chậu hoa', cau: (D, R, k) => `Sân trường hình chữ nhật có chiều dài ${D} m và chiều rộng ${R} m. Nhà trường đặt các chậu hoa xung quanh sân, hai chậu hoa liên tiếp cách nhau ${k} m. Hỏi cần bao nhiêu chậu hoa, biết mỗi góc sân đều đặt chậu hoa?`, ten: 'sân trường', hoi: 'Số chậu hoa cần đặt là' },
  { vat: 'cây cau', cau: (D, R, k) => `Một khu đất hình chữ nhật có chiều dài ${D} m và chiều rộng ${R} m. Người ta trồng cau xung quanh khu đất, hai cây cau liên tiếp cách nhau ${k} m. Hỏi trồng được bao nhiêu cây cau, biết mỗi góc khu đất đều trồng cây?`, ten: 'khu đất', hoi: 'Số cây cau trồng được là' },
  { vat: 'bóng đèn', cau: (D, R, k) => `Một bể bơi hình chữ nhật có chiều dài ${D} m và chiều rộng ${R} m. Người ta lắp đèn xung quanh bể bơi, hai bóng đèn liên tiếp cách nhau ${k} m. Hỏi cần lắp bao nhiêu bóng đèn, biết mỗi góc bể đều có đèn?`, ten: 'bể bơi', hoi: 'Số bóng đèn cần lắp là' },
]
them({ dang: 'T14T070102', parent: 'T14T070102001', ten: 'trong-cay-khep-kin',
  ung_vien() { const ra = []; for (const [i] of P_BOI_CANH.entries()) for (const k of [2, 3, 4, 5, 6, 8]) for (const x of day(6, 30)) for (const y of day(4, 20)) { const D = x * k, R = y * k; if (D > R && D <= [120, 150, 100, 100, 150, 50][i] && R >= (i === 5 ? 10 : 20) && R <= (i === 5 ? 25 : 150) && D - R >= 10) ra.push({ i, D, R, k }) } return ra },
  khoa: ({ D, R, k }) => `${D}|${R}|${k}`, nhom: ({ i }) => i,
  dung({ i, D, R, k }) {
    const b = P_BOI_CANH[i], cv = (D + R) * 2, kq = cv / k, dv = b.vat
    return { noi_dung: b.cau(D, R, k), dap_an: String(kq), loi_giai: lg({
      mau_chot: `Các ${b.vat} đặt cách đều nhau thành một vòng xung quanh ${b.ten}: đây là bài toán trồng cây trên đường khép kín, số ${b.vat} bằng đúng số khoảng cách. Đường khép kín ở đây là chu vi hình chữ nhật.`,
      buoc: [
        `Tính độ dài cả vòng xung quanh ${b.ten}, tức là chu vi hình chữ nhật: lấy chiều dài cộng chiều rộng rồi nhân với $2$.`,
        `Tính số khoảng cách: lấy chu vi chia cho khoảng cách giữa hai ${b.vat} liên tiếp ($${k}$ m).`,
        `Vì đường khép kín, ${b.vat} cuối cùng nối vòng về ${b.vat} đầu tiên, nên số ${b.vat} bằng đúng số khoảng cách.`,
      ],
      chu_y: 'Đường khép kín thì không cộng thêm $1$ như khi trồng cây trên đoạn thẳng có trồng ở cả hai đầu.',
      p2: ['Bài giải', `Chu vi ${b.ten} là: $${L(`${D}+${R}`)}\\times 2=${cv}$ (m)`, `${b.hoi}: $${cv}:${k}=${kq}$ (${dv})`, `Đáp số: $${kq}$ ${dv}`],
    }) }
  } })

// ── chạy ─────────────────────────────────────────────────────────────────────
export function sinhLo(hienCo, { mucTieu = 60, seed = 20261010, chiDang = null } = {}) {
  const rnd = taoRnd(seed), xao = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(rnd() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
  const lo = [], bao = []
  const theoDang = new Map(); for (const m of MAU) { if (!theoDang.has(m.dang)) theoDang.set(m.dang, []); theoDang.get(m.dang).push(m) }
  for (const [dang, maus] of theoDang) {
    if (chiDang && !chiDang.includes(dang)) continue
    const hc = hienCo.find((d) => d.ma_dang === dang); if (!hc) { bao.push(`${dang}: không có trong hien-co — bỏ`); continue }
    const can = Math.max(0, mucTieu - hc.app); if (!can) { bao.push(`${dang}: đã đủ ${hc.app}`); continue }
    const daCo = new Set(hc.cau.map((c) => chuanDe(c.noi_dung))), dapSoDaCo = new Map()
    // mẫu có `nhom`: xếp ứng viên xen kẽ đều giữa các nhóm (vd số chữ số, bối cảnh) để lô không dồn vào nhóm đông ứng viên nhất
    const xenNhom = (m, uv) => {
      if (!m.nhom) return uv
      const xo = new Map(); for (const u of uv) { const g = m.nhom(u); if (!xo.has(g)) xo.set(g, []); xo.get(g).push(u) }
      const ds = [...xo.values()], ra = []
      for (let i = 0; ds.some((d) => i < d.length); i++) for (const d of ds) if (i < d.length) ra.push(d[i])
      return ra.reverse()          // vòng lặp lấy bằng pop() ⇒ đảo để lấy theo đúng thứ tự xen kẽ
    }
    const hang = maus.map((m) => ({ m, uv: xenNhom(m, xao(m.ung_vien())), khoa: new Set(), n: 0 }))
    let ra = 0, vong = 0
    while (ra < can && hang.some((h) => h.uv.length)) {
      const h = hang[vong++ % hang.length]; if (!h.uv.length) continue
      // chia đều giữa các mẫu của dạng: mẫu đã vượt phần của mình mà mẫu khác còn ứng viên thì nhường
      const ts = h.uv.pop(), k = h.m.khoa ? h.m.khoa(ts) : null
      if (k && h.khoa.has(k)) { vong--; continue }
      let cau; try { cau = h.m.dung(ts) } catch (e) { bao.push(`${dang}/${h.m.ten}: ${e.message}`); vong--; continue }
      const cd = chuanDe(cau.noi_dung); if (daCo.has(cd)) { vong--; continue }
      const lap = dapSoDaCo.get(cau.dap_an) || 0; if (lap >= (h.m.lapDapSo ?? 2) && h.uv.length > can) { vong--; continue }   // đáp số không lặp quá 2 lần trong lô khi còn lựa chọn (dạng đếm: đáp số vốn ít giá trị ⇒ lapDapSo = ∞)
      daCo.add(cd); if (k) h.khoa.add(k); dapSoDaCo.set(cau.dap_an, lap + 1); h.n++; ra++
      lo.push({ dang, parent: h.m.parent, mau: h.m.ten, loai_cau: 'tra_loi_ngan', ...cau })
    }
    bao.push(`${dang}: app ${hc.app} · cần ${can} · sinh ${ra}${ra < can ? ` ⚠ HẾT ĐỀ KHÁC NHAU (thiếu ${can - ra})` : ''} — ${hang.map((h) => `${h.m.ten} ${h.n}`).join(' · ')}`)
  }
  return { lo, bao }
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const a = process.argv.slice(2), lay = (k) => { const i = a.indexOf(k); return i >= 0 ? a[i + 1] : null }
  if (!a[0] || !lay('--ra')) { console.error('Dùng: node scripts/kho/clone/k4T-sinh.mjs <hien-co.json> --ra <lo.json> [--muc-tieu 60] [--seed N] [--dang a,b]'); process.exit(2) }
  const { lo, bao } = sinhLo(JSON.parse(readFileSync(a[0], 'utf8')), { mucTieu: Number(lay('--muc-tieu') ?? 60), seed: Number(lay('--seed') ?? 20261010), chiDang: lay('--dang')?.split(',') ?? null })
  writeFileSync(lay('--ra'), JSON.stringify(lo, null, 1))
  for (const b of bao) console.log(b)
  console.log(`→ ${lo.length} câu · ${lay('--ra')}`)
}
