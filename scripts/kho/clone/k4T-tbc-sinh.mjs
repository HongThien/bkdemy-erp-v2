// ============================================================================
// k4T-tbc-sinh.mjs — SINH câu CLONE cho chuyên đề «Trung bình cộng» (NCH00516) của bản đồ mới 4T: 12 dạng bài, mỗi dạng ~50 câu.
//
//   import { sinhTBC } from './k4T-tbc-sinh.mjs'   →  sinhTBC({ co: {NDB: số câu đã có}, muc: 50, seed })
//
// Mỗi MẪU = một khuôn đề bám một câu gốc của sách (parent) hoặc, với 3 dạng sách không có câu (NDB01583 · 01585 · 01591), bám mô tả dạng
// của Thùy (parent = null ⇒ gán dạng RIÊNG từng câu). Máy dựng đề + đáp số + lời giải 2 phần (Phần 1 card 3–6 bước) từ tham số;
// bộ kiểm `k4T-tbc-kiem.mjs` tìm lại đáp số bằng VÉT CẠN từ chữ của đề (không dùng công thức của bộ sinh).
// Số liệu mỗi ngữ cảnh nằm trong khoảng ĐỜI THỰC (tuổi, điểm ≤ 10, cân nặng, vận tốc xe đạp…) — mọi `lo/hi` ở bảng ngữ cảnh.
// Số đếm trong ĐỀ viết bằng chữ ("ba bạn") để các chữ số trong đề chỉ còn là số liệu.
// ============================================================================
import { taoRnd, lg, chuanDe } from './k4T-sinh.mjs'

const L = (s) => `\\left(${s}\\right)`
const X = '\\times '
const m$ = (x) => `$${x}$`
export const TEN = ['An', 'Bình', 'Chi', 'Dũng', 'Hà', 'Lan', 'Mai', 'Nam', 'Hoa', 'Minh', 'Tú', 'Phúc', 'Quân', 'Vy', 'Linh', 'Khoa', 'Hùng', 'Thảo', 'Huy', 'Yến', 'Trang', 'Sơn', 'Lâm', 'Ngọc']
const TO = ['Tổ một', 'Tổ hai', 'Tổ ba', 'Tổ bốn', 'Tổ năm', 'Tổ sáu']
const chu = ['nhất', 'hai', 'ba', 'tư', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười']       // thứ nhất, thứ hai…
const SO = ['', 'một', 'hai', 'ba', 'bốn', 'năm', 'sáu', 'bảy', 'tám', 'chín', 'mười', 'mười một', 'mười hai', 'mười ba', 'mười bốn', 'mười lăm', 'mười sáu', 'mười bảy', 'mười tám', 'mười chín', 'hai mươi']
const sl = (n) => SO[n] ?? String(n)
const cap = (s) => s[0].toUpperCase() + s.slice(1)

let R = () => 0.5
const ri = (a, b) => a + Math.floor(R() * (b - a + 1))
const pick = (a) => a[Math.floor(R() * a.length)]
const xao = (a) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(R() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
const ten = (k) => xao(TEN).slice(0, k)
const tong = (a) => a.reduce((s, x) => s + x, 0)
/** k độ lệch tổng 0, mỗi cái trong [-r, r], không phải tất cả bằng 0 */
function lech(k, r) { for (;;) { const d = Array.from({ length: k - 1 }, () => ri(-r, r)); const c = -tong(d); if (Math.abs(c) <= r && d.some((x) => x)) return xao([...d, c]) } }
const ghepTiep = (a) => a.map((x, i) => (i === a.length - 1 ? `và ${x}` : String(x))).join(', ').replace(', và', ' và')

/** Sơ đồ TBC (n số, một số hơn/kém/bằng TBC k). */
function soDoTBC({ tbc, n, k, dau, nhanX, nhanY, hoi, ghiY, ghiTB }) {
  const x = { nhan: nhanX, phan: 1 }, y = { nhan: nhanY, phan: n - 1, ghi: ghiY }
  if (dau === '+') { x.them = `${k}`; y.bot = `${k}` } else if (dau === '-') { x.bot = `${k}`; y.them = `${k}` }
  return { gia_tri_phan: tbc, hang: [{ nhan: 'Trung bình cộng', phan: 1, ghi: ghiTB }, x, y], dau_hoi: [hoi ?? nhanX] }
}

// ═══ CÁC MẪU ═════════════════════════════════════════════════════════════════════════════════
export const MAU = []
const them = (m) => MAU.push(m)
const G = (n) => `T14T000000${String(n).padStart(3, '0')}`

// ── D1.1 NDB01542 · Tính trung bình cộng của các số ──────────────────────────────────────────
const CTX_BANG = [
  { mo: (k) => `Cân nặng của ${sl(k)} bạn học sinh là:`, it: (t, v) => `${t} ${v} kg`, hoi: 'Hỏi trung bình mỗi bạn cân nặng bao nhiêu ki-lô-gam?', cau: 'Trung bình mỗi bạn cân nặng số ki-lô-gam là', dv: 'kg', lo: [28, 46], ten: true },
  { mo: (k) => `Chiều cao của ${sl(k)} bạn học sinh là:`, it: (t, v) => `${t} ${v} cm`, hoi: 'Hỏi trung bình mỗi bạn cao bao nhiêu xăng-ti-mét?', cau: 'Trung bình mỗi bạn cao số xăng-ti-mét là', dv: 'cm', lo: [128, 152], ten: true },
  { mo: (k) => `Số quyển sách mà ${sl(k)} bạn đã đọc trong học kì I là:`, it: (t, v) => `${t} ${v} quyển`, hoi: 'Hỏi trung bình mỗi bạn đã đọc bao nhiêu quyển sách?', cau: 'Trung bình mỗi bạn đã đọc số quyển sách là', dv: 'quyển', lo: [8, 30], ten: true },
  { mo: (k) => `Số tiền tiết kiệm của ${sl(k)} bạn là:`, it: (t, v) => `${t} ${v} nghìn đồng`, hoi: 'Hỏi trung bình mỗi bạn tiết kiệm được bao nhiêu nghìn đồng?', cau: 'Trung bình mỗi bạn tiết kiệm được số nghìn đồng là', dv: 'nghìn đồng', lo: [20, 90], ten: true },
  { mo: (k) => `Quãng đường ${sl(k)} bạn đạp xe trong một buổi sáng là:`, it: (t, v) => `${t} ${v} km`, hoi: 'Hỏi trung bình mỗi bạn đạp xe được bao nhiêu ki-lô-mét?', cau: 'Trung bình mỗi bạn đạp xe được số ki-lô-mét là', dv: 'km', lo: [6, 24], ten: true },
  { mo: (k) => `Số cây trồng được của ${sl(k)} tổ lớp 4A là:`, it: (t, v) => `${t} ${v} cây`, hoi: 'Hỏi trung bình mỗi tổ trồng được bao nhiêu cây?', cau: 'Trung bình mỗi tổ trồng được số cây là', dv: 'cây', lo: [12, 40], ten: false },
  { mo: (k) => `Số bài điểm tốt của ${sl(k)} tổ trong tuần qua là:`, it: (t, v) => `${t} ${v} bài`, hoi: 'Hỏi trung bình mỗi tổ có bao nhiêu bài điểm tốt?', cau: 'Trung bình mỗi tổ có số bài điểm tốt là', dv: 'bài', lo: [10, 30], ten: false },
]
them({ dang: 'NDB01542', parent: G(282), ten: 'tbc-bang', pt: 17,
  tham() { const k = ri(4, 6), c = pick(CTX_BANG), m = ri(c.lo[0] + 6, c.lo[1] - 6), d = lech(k, 5); return { k, c, m, v: d.map((x) => m + x), tn: c.ten ? ten(k) : TO.slice(0, k) } },
  dung({ k, c, m, v, tn }) {
    const it = v.map((x, i) => c.it(tn[i], x))
    return { noi_dung: `${c.mo(k)} ${it.join(', ')}. ${c.hoi}`, dap_an: `${m$(m)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Muốn tìm trung bình cộng của ${sl(k)} số, ta lấy tổng của ${sl(k)} số đó chia cho ${k}.`,
      buoc: [`Đọc đề, xác định có ${k} số liệu cần tính trung bình: ${v.map(m$).join('; ')}.`, `Cộng các số liệu lại để được tổng: ${m$(v.join('+'))}.`, `Chia tổng cho số các số hạng (${m$(k)}) để được trung bình cộng.`],
      chu_y: `Số các số hạng là ${k} (đúng bằng số bạn hoặc số tổ nêu trong đề), không phải số nào khác.`,
      p2: ['Bài giải', `${c.cau}: ${m$(`${L(v.join('+'))}:${k}=${m}`)} (${c.dv})`, `Đáp số: ${m$(m)} ${c.dv}`] }) }
  } })

const CTX_DOI = [
  { mo: (k) => `Số đo chiều cao của ${sl(k)} học sinh lần lượt là:`, be: 'cm', lon: 'dm', he: 10, hoi: (k) => `Hỏi trung bình số đo chiều cao của ${sl(k)} học sinh đó là bao nhiêu xăng-ti-mét?`, lo: [128, 152], cau: 'Trung bình số đo chiều cao của học sinh là' },
  { mo: (k) => `Khối lượng của ${sl(k)} bao gạo lần lượt là:`, be: 'kg', lon: 'yến', he: 10, hoi: () => `Hỏi trung bình mỗi bao gạo nặng bao nhiêu ki-lô-gam?`, lo: [30, 60], cau: 'Trung bình mỗi bao gạo nặng' },
  { mo: (k) => `Chiều dài của ${sl(k)} đoạn dây lần lượt là:`, be: 'dm', lon: 'm', he: 10, hoi: () => `Hỏi trung bình mỗi đoạn dây dài bao nhiêu đề-xi-mét?`, lo: [20, 70], cau: 'Trung bình mỗi đoạn dây dài' },
  { mo: (k) => `Khối lượng thóc thu hoạch của ${sl(k)} thửa ruộng lần lượt là:`, be: 'kg', lon: 'tạ', he: 100, hoi: () => `Hỏi trung bình mỗi thửa ruộng thu hoạch được bao nhiêu ki-lô-gam thóc?`, lo: [300, 700], cau: 'Trung bình mỗi thửa ruộng thu hoạch được' },
]
them({ dang: 'NDB01542', parent: G(288), ten: 'tbc-doi-don-vi', pt: 15,
  tham() {
    for (;;) {
      const k = ri(4, 6), c = pick(CTX_DOI), m = c.he === 100 ? ri(4, 6) * 100 + 50 * ri(0, 1) : ri(c.lo[0] + 5, c.lo[1] - 5)
      const d = lech(k, c.he === 100 ? 2 : 6).map((x) => x * (c.he === 100 ? 100 : 1)), v = d.map((x) => m + x)
      if (v.some((x) => x <= 0)) continue
      const lonIdx = []; v.forEach((x, i) => { if (x % c.he === 0 && lonIdx.length < k - 2 && R() < 0.6) lonIdx.push(i) })
      if (!lonIdx.length) continue
      return { k, c, m, v, lonIdx }
    }
  },
  dung({ k, c, m, v, lonIdx }) {
    const it = v.map((x, i) => (lonIdx.includes(i) ? `${x / c.he} ${c.lon}` : `${x} ${c.be}`))
    return { noi_dung: `${c.mo(k)} ${it.join(', ')}. ${c.hoi(k)}`, dap_an: `${m$(m)} ${c.be}`, loi_giai: lg({
      mau_chot: `Các số liệu đo bằng đơn vị khác nhau phải đổi về CÙNG một đơn vị rồi mới cộng; sau đó lấy tổng chia cho số các số hạng.`,
      buoc: [`Tìm các số liệu đang ghi bằng ${c.lon}: ${lonIdx.map((i) => `${v[i] / c.he} ${c.lon}`).join('; ')}.`, `Đổi các số đo ghi bằng ${c.lon} về ${c.be} (1 ${c.lon} bằng ${c.he} ${c.be}).`, `Cộng tất cả ${k} số đo (cùng đơn vị ${c.be}) lại.`, `Chia tổng cho ${k} để được trung bình cộng.`],
      chu_y: `Đừng cộng thẳng số ghi bằng ${c.lon} với số ghi bằng ${c.be} khi chưa đổi đơn vị.`,
      p2: ['Bài giải', ...lonIdx.map((i) => `Đổi: ${m$(v[i] / c.he)} ${c.lon} = ${m$(v[i])} ${c.be}`), `${c.cau}: ${m$(`${L(v.join('+'))}:${k}=${m}`)} (${c.be})`, `Đáp số: ${m$(m)} ${c.be}`] }) }
  } })

const CTX_NGAY = [
  { sub: 'Một nhà máy', sub2: 'nhà máy đó', verb: 'sản xuất được', unit: 'sản phẩm', moc: 'ngày', a: [200, 600], pq: [10, 60] },
  { sub: 'Một cửa hàng', sub2: 'cửa hàng đó', verb: 'bán được', unit: 'ki-lô-gam gạo', moc: 'ngày', a: [150, 400], pq: [10, 50] },
  { sub: 'Bạn Lan', sub2: 'bạn Lan', verb: 'đọc được', unit: 'trang sách', moc: 'ngày', a: [20, 60], pq: [2, 9] },
  { sub: 'Một đội công nhân', sub2: 'đội công nhân đó', verb: 'trồng được', unit: 'cây', moc: 'tuần', a: [120, 400], pq: [10, 40] },
  { sub: 'Một xưởng may', sub2: 'xưởng may đó', verb: 'may được', unit: 'chiếc áo', moc: 'tháng', a: [300, 900], pq: [20, 90] },
  { sub: 'Một trang trại', sub2: 'trang trại đó', verb: 'thu hoạch được', unit: 'quả trứng', moc: 'ngày', a: [200, 600], pq: [10, 60] },
]
them({ dang: 'NDB01542', parent: G(38), ten: 'tbc-hon-kem', pt: 15,
  tham() { for (;;) { const c = pick(CTX_NGAY), a = ri(c.a[0], c.a[1]), p = ri(c.pq[0], c.pq[1]), q = ri(c.pq[0], c.pq[1]), v = pick([1, 2]); if (p !== q && (3 * a + (v === 1 ? q - p : p - q)) % 3 === 0) return { c, a, p, q, v } } },
  dung({ c, a, p, q, v }) {
    const hai = v === 1 ? a - p : a + p, ba = v === 1 ? a + q : a - q, m = (a + hai + ba) / 3
    const de = v === 1 ? `${c.sub} ${c.moc} thứ nhất ${c.verb} ${a} ${c.unit}, nhiều hơn ${c.moc} thứ hai ${p} ${c.unit} và ít hơn ${c.moc} thứ ba ${q} ${c.unit}.` : `${c.sub} ${c.moc} thứ nhất ${c.verb} ${a} ${c.unit}, ít hơn ${c.moc} thứ hai ${p} ${c.unit} và nhiều hơn ${c.moc} thứ ba ${q} ${c.unit}.`
    const [d2, d3] = v === 1 ? ['nhiều hơn', 'ít hơn'] : ['ít hơn', 'nhiều hơn']
    const M = cap(c.moc)
    return { noi_dung: `${de} Hỏi trung bình mỗi ${c.moc} ${c.sub2} ${c.verb} bao nhiêu ${c.unit}?`, dap_an: `${m$(m)} ${c.unit}`, loi_giai: lg({
      mau_chot: `Phải tìm đủ số liệu của cả ba ${c.moc} rồi mới lấy tổng chia $3$. Đọc kĩ chiều so sánh: ${c.moc} thứ nhất ${d2} ${c.moc} thứ hai nghĩa là ${c.moc} thứ hai ${v === 1 ? 'ÍT' : 'NHIỀU'} hơn ${c.moc} thứ nhất.`,
      buoc: [`Tìm số ${c.unit} của ${c.moc} thứ hai: ${c.moc} thứ nhất ${d2} ${c.moc} thứ hai ${p} nên ${c.moc} thứ hai ${v === 1 ? 'ít' : 'nhiều'} hơn ${c.moc} thứ nhất ${p}.`, `Tìm số ${c.unit} của ${c.moc} thứ ba: ${c.moc} thứ nhất ${d3} ${c.moc} thứ ba ${q} nên ${c.moc} thứ ba ${v === 1 ? 'nhiều' : 'ít'} hơn ${c.moc} thứ nhất ${q}.`, `Cộng số ${c.unit} của ba ${c.moc} rồi chia cho $3$ để được trung bình cộng.`],
      chu_y: `Hai phép tính ở hai bước đầu NGƯỢC chiều nhau: một bước ${v === 1 ? 'trừ' : 'cộng'}, một bước ${v === 1 ? 'cộng' : 'trừ'}.`,
      p2: ['Bài giải', `${M} thứ hai ${c.sub2} ${c.verb} số ${c.unit} là: ${m$(`${a}${v === 1 ? '-' : '+'}${p}=${hai}`)} (${c.unit})`, `${M} thứ ba ${c.sub2} ${c.verb} số ${c.unit} là: ${m$(`${a}${v === 1 ? '+' : '-'}${q}=${ba}`)} (${c.unit})`, `Trung bình mỗi ${c.moc} ${c.sub2} ${c.verb} số ${c.unit} là: ${m$(`${L(`${a}+${hai}+${ba}`)}:3=${m}`)} (${c.unit})`, `Đáp số: ${m$(m)} ${c.unit}`] }) }
  } })

// ── D1.2 NDB01583 · Tìm 1 đại lượng khi biết trung bình cộng ──────────────────────────────────
const CTX_TIM = [
  { de: (n, m, dau) => `Lan làm ${sl(n)} bài kiểm tra Toán, điểm trung bình cộng của ${sl(n)} bài là ${m} điểm. ${cap(sl(n - 1))} bài đầu Lan được lần lượt ${dau} điểm. Hỏi bài thứ ${chu[n - 1]} Lan được mấy điểm?`, dv: 'điểm', lo: [6, 9], d: 2, min: 3, max: 10 },
  { de: (n, m, dau) => `Chiều cao trung bình của ${sl(n)} bạn là ${m} cm. ${cap(sl(n - 1))} bạn đầu cao lần lượt ${dau} cm. Hỏi bạn thứ ${chu[n - 1]} cao bao nhiêu xăng-ti-mét?`, dv: 'cm', lo: [130, 150], d: 6 },
  { de: (n, m, dau) => `Trong ${sl(n)} ngày, trung bình mỗi ngày một xưởng làm được ${m} sản phẩm. ${cap(sl(n - 1))} ngày đầu xưởng làm được lần lượt ${dau} sản phẩm. Hỏi ngày thứ ${chu[n - 1]} xưởng làm được bao nhiêu sản phẩm?`, dv: 'sản phẩm', lo: [60, 200], d: 12 },
  { de: (n, m, dau) => `Trung bình mỗi tháng nhà bạn Hà tiết kiệm được ${m} nghìn đồng trong ${sl(n)} tháng. ${cap(sl(n - 1))} tháng đầu tiết kiệm được lần lượt ${dau} nghìn đồng. Hỏi tháng thứ ${chu[n - 1]} nhà bạn Hà tiết kiệm được bao nhiêu nghìn đồng?`, dv: 'nghìn đồng', lo: [40, 120], d: 15 },
  { de: (n, m, dau) => `Bạn Nam đọc xong một quyển truyện trong ${sl(n)} ngày, trung bình mỗi ngày đọc ${m} trang. ${cap(sl(n - 1))} ngày đầu bạn đọc lần lượt ${dau} trang. Hỏi ngày thứ ${chu[n - 1]} bạn Nam đọc bao nhiêu trang?`, dv: 'trang', lo: [20, 60], d: 8 },
  { de: (n, m, dau) => `Cân nặng trung bình của ${sl(n)} bạn là ${m} kg. ${cap(sl(n - 1))} bạn đầu nặng lần lượt ${dau} kg. Hỏi bạn thứ ${chu[n - 1]} nặng bao nhiêu ki-lô-gam?`, dv: 'kg', lo: [30, 44], d: 5 },
]
them({ dang: 'NDB01583', parent: null, ten: 'tim-so-cuoi', pt: 20,
  tham() { for (;;) { const c = pick(CTX_TIM), n = ri(3, 5), m = ri(c.lo[0], c.lo[1]), o = lech(n, c.d).map((x) => m + x); const x = o[n - 1]; if (x >= (c.min ?? 1) && x <= (c.max ?? 1e9) && o.slice(0, n - 1).every((y) => y >= (c.min ?? 1) && y <= (c.max ?? 1e9))) return { c, n, m, o } } },
  dung({ c, n, m, o }) {
    const dau = o.slice(0, n - 1), x = o[n - 1], T = m * n, S = tong(dau)
    return { noi_dung: c.de(n, m, ghepTiep(dau)), dap_an: `${m$(x)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Biết trung bình cộng và số các số hạng thì tìm được tổng của TẤT CẢ các số; lấy tổng đó trừ đi tổng các số đã biết thì ra số còn lại.`,
      buoc: [`Tính tổng của cả ${sl(n)} số: trung bình cộng nhân với ${n}.`, `Tính tổng của ${n - 1} số đã biết.`, `Số cần tìm bằng tổng của cả ${sl(n)} số trừ tổng ${n - 1} số đã biết.`],
      chu_y: `Phải nhân trung bình cộng với ${n} (cả số cần tìm cũng được tính), không nhân với ${n - 1}.`,
      p2: ['Bài giải', `Tổng của cả ${sl(n)} số là: ${m$(`${m}${X}${n}=${T}`)} (${c.dv})`, `Tổng của ${n - 1} số đã biết là: ${m$(`${dau.join('+')}=${S}`)} (${c.dv})`, `Số cần tìm là: ${m$(`${T}-${S}=${x}`)} (${c.dv})`, `Đáp số: ${m$(x)} ${c.dv}`] }) }
  } })

const CTX_HAI = [
  { de: (m, a) => `Trung bình cộng của hai số là ${m}, biết một trong hai số là ${a}. Tìm số còn lại.`, dv: '', m: [10, 90], da: 25 },
  { de: (m, a) => `Hà và Nam có trung bình mỗi bạn ${m} viên bi. Hà có ${a} viên bi. Hỏi Nam có bao nhiêu viên bi?`, dv: 'viên bi', m: [10, 60], da: 20 },
  { de: (m, a) => `Hai thùng dầu có trung bình mỗi thùng ${m} lít. Thùng thứ nhất có ${a} lít. Hỏi thùng thứ hai có bao nhiêu lít dầu?`, dv: 'lít dầu', m: [20, 90], da: 25 },
  { de: (m, a) => `Tuổi trung bình của hai chị em là ${m} tuổi. Em ${a} tuổi. Hỏi chị bao nhiêu tuổi?`, dv: 'tuổi', m: [8, 14], da: 4 },
  { de: (m, a) => `Hai bạn An và Bình tiết kiệm được trung bình mỗi bạn ${m} nghìn đồng. An tiết kiệm được ${a} nghìn đồng. Hỏi Bình tiết kiệm được bao nhiêu nghìn đồng?`, dv: 'nghìn đồng', m: [20, 90], da: 25 },
]
them({ dang: 'NDB01583', parent: null, ten: 'tim-so-con-lai-hai-so', pt: 12,
  tham() { for (;;) { const c = pick(CTX_HAI), m = ri(c.m[0], c.m[1]), a = ri(m - c.da, m + c.da); const x = 2 * m - a; if (a > 0 && x > 0 && x !== a) return { c, m, a, x } } },
  dung({ c, m, a, x }) {
    return { noi_dung: c.de(m, a), dap_an: c.dv ? `${m$(x)} ${c.dv}` : m$(x), loi_giai: lg({
      mau_chot: `Trung bình cộng của hai số bằng tổng hai số chia $2$, nên tổng hai số bằng trung bình cộng nhân $2$. Biết tổng và một số thì tìm số còn lại bằng phép trừ.`,
      buoc: [`Tính tổng hai số: trung bình cộng nhân với $2$.`, `Lấy tổng hai số trừ đi số đã biết.`, `Kiểm tra lại: hai số cộng lại rồi chia $2$ phải bằng ${m}.`],
      chu_y: `Nhân với $2$ (hai số), không nhân với ${m} hay số nào khác.`,
      p2: ['Bài giải', `Tổng của hai số là: ${m$(`${m}${X}2=${2 * m}`)}`, `Số còn lại là: ${m$(`${2 * m}-${a}=${x}`)}`, `Thử lại: ${m$(`${L(`${a}+${x}`)}:2=${m}`)} (đúng).`, `Đáp số: ${m$(x)}${c.dv ? ' ' + c.dv : ''}`] }) }
  } })

const CTX_CHUOI = [
  { de: (a, d, s, m) => `Ba lớp 4A, 4B, 4C cùng tham gia trồng cây. Lớp 4A trồng ${a} cây, lớp 4B trồng ${s === '+' ? 'nhiều' : 'ít'} hơn lớp 4A ${d} cây. Trung bình mỗi lớp trồng được ${m} cây. Hỏi lớp 4C trồng được bao nhiêu cây?`, dv: 'cây', ten2: 'lớp 4B', a: [30, 90], d: [3, 15], m: [40, 110] },
  { de: (a, d, s, m) => `Ba bạn Hoa, Mai, Lan cùng gấp ngôi sao giấy. Hoa gấp được ${a} ngôi sao, Mai gấp ${s === '+' ? 'nhiều' : 'ít'} hơn Hoa ${d} ngôi sao. Trung bình mỗi bạn gấp được ${m} ngôi sao. Hỏi Lan gấp được bao nhiêu ngôi sao?`, dv: 'ngôi sao', ten2: 'Mai', a: [20, 80], d: [3, 15], m: [30, 90] },
  { de: (a, d, s, m) => `Ba thùng dầu: thùng thứ nhất chứa ${a} lít, thùng thứ hai chứa ${s === '+' ? 'nhiều' : 'ít'} hơn thùng thứ nhất ${d} lít. Trung bình mỗi thùng chứa ${m} lít dầu. Hỏi thùng thứ ba chứa bao nhiêu lít dầu?`, dv: 'lít dầu', ten2: 'thùng thứ hai', a: [30, 120], d: [5, 25], m: [40, 130] },
  { de: (a, d, s, m) => `Ba cửa hàng bán gạo trong một ngày. Cửa hàng thứ nhất bán ${a} kg, cửa hàng thứ hai bán ${s === '+' ? 'nhiều' : 'ít'} hơn cửa hàng thứ nhất ${d} kg. Trung bình mỗi cửa hàng bán ${m} kg. Hỏi cửa hàng thứ ba bán bao nhiêu ki-lô-gam gạo?`, dv: 'kg', ten2: 'cửa hàng thứ hai', a: [60, 200], d: [5, 30], m: [80, 220] },
]
them({ dang: 'NDB01583', parent: null, ten: 'tim-so-thu-ba', pt: 18,
  tham() { for (;;) { const c = pick(CTX_CHUOI), s = pick(['+', '-']), a = ri(c.a[0], c.a[1]), d = ri(c.d[0], c.d[1]), m = ri(c.m[0], c.m[1]); const b = s === '+' ? a + d : a - d, x = 3 * m - a - b; if (b > 0 && x > 0 && x !== a && x !== b && x >= 0.6 * m && x <= 1.5 * m) return { c, s, a, d, m, b, x } } },
  dung({ c, s, a, d, m, b, x }) {
    return { noi_dung: c.de(a, d, s, m), dap_an: `${m$(x)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Biết trung bình cộng của ba số thì tìm được tổng ba số; tìm hết các số đã biết rồi lấy tổng trừ đi, ra số còn lại.`,
      buoc: [`Tính số của ${c.ten2}: nó ${s === '+' ? 'nhiều' : 'ít'} hơn số thứ nhất ${d}.`, `Tính tổng của cả ba số: trung bình cộng nhân với $3$.`, `Lấy tổng ba số trừ đi hai số đã biết để được số cần tìm.`],
      chu_y: `Chiều so sánh "${s === '+' ? 'nhiều' : 'ít'} hơn" quyết định phép ${s === '+' ? 'cộng' : 'trừ'} ở bước đầu.`,
      p2: ['Bài giải', `Số ${c.dv} của ${c.ten2} là: ${m$(`${a}${s}${d}=${b}`)} (${c.dv})`, `Tổng số ${c.dv} của ba nhóm là: ${m$(`${m}${X}3=${3 * m}`)} (${c.dv})`, `Số ${c.dv} cần tìm là: ${m$(`${3 * m}-${a}-${b}=${x}`)} (${c.dv})`, `Đáp số: ${m$(x)} ${c.dv}`] }) }
  } })

// ── D1.3 NDB01584 · Trung bình cộng của nhóm có nhiều loại ───────────────────────────────────
// pq = [lo, hi] số đo của mỗi cái (nhân với b); kg = đề hỏi ra tạ
const CTX_LOAI = [
  { kg: true, de: (T, a, p, b, q) => `Có ${T} xe ô tô chở thóc, trong đó có ${a} xe, mỗi xe chở được ${p} kg thóc và ${b} xe, mỗi xe chở được ${q} kg thóc. Hỏi trung bình mỗi xe chở được bao nhiêu tạ thóc?`, cau: 'Trung bình mỗi xe chở được', pq: [8, 14], b: 500 },
  { de: (T, a, p, b, q) => `Một đội có ${T} xe tải: ${a} xe, mỗi xe chở ${p} tấn hàng và ${b} xe, mỗi xe chở ${q} tấn hàng. Hỏi trung bình mỗi xe chở được bao nhiêu tấn hàng?`, dv: 'tấn', cau: 'Trung bình mỗi xe chở được', pq: [3, 15], b: 1 },
  { de: (T, a, p, b, q) => `Một thư viện có ${T} kệ sách, trong đó ${a} kệ, mỗi kệ có ${p} quyển và ${b} kệ, mỗi kệ có ${q} quyển. Hỏi trung bình mỗi kệ có bao nhiêu quyển sách?`, dv: 'quyển', cau: 'Trung bình mỗi kệ có', pq: [20, 90], b: 1 },
  { de: (T, a, p, b, q) => `Một cửa hàng bán gạo trong ${T} ngày: ${a} ngày đầu, mỗi ngày bán ${p} kg và ${b} ngày sau, mỗi ngày bán ${q} kg. Hỏi trung bình mỗi ngày cửa hàng bán được bao nhiêu ki-lô-gam gạo?`, dv: 'kg', cau: 'Trung bình mỗi ngày cửa hàng bán được', pq: [20, 120], b: 1 },
  { de: (T, a, p, b, q) => `Lớp 4A có ${T} tổ: ${a} tổ, mỗi tổ trồng được ${p} cây và ${b} tổ, mỗi tổ trồng được ${q} cây. Hỏi trung bình mỗi tổ trồng được bao nhiêu cây?`, dv: 'cây', cau: 'Trung bình mỗi tổ trồng được', pq: [5, 30], b: 1 },
  { de: (T, a, p, b, q) => `Bạn An mua ${a} quyển vở, mỗi quyển giá ${p} đồng và ${b} cái bút, mỗi cái giá ${q} đồng. Hỏi trung bình mỗi món đồ giá bao nhiêu đồng?`, dv: 'đồng', cau: 'Trung bình mỗi món đồ giá', pq: [4, 15], b: 1000 },
]
them({ dang: 'NDB01584', parent: G(289), ten: 'tbc-hai-loai', pt: 30,
  tham() { for (;;) { const c = pick(CTX_LOAI), a = ri(2, 6), b = ri(2, 6); if (a === b) continue
      const p = ri(c.pq[0], c.pq[1]) * c.b, q = ri(c.pq[0], c.pq[1]) * c.b; if (p === q) continue
      const t = a * p + b * q; if (t % (a + b)) continue; const m = t / (a + b); if (c.kg && m % 100) continue; return { c, a, b, p, q, m } } },
  dung({ c, a, b, p, q, m }) {
    const T = a + b, u = c.kg ? 'kg' : c.dv, ans = c.kg ? m / 100 : m, avu = c.kg ? 'tạ' : c.dv
    return { noi_dung: c.de(T, a, p, b, q), dap_an: `${m$(ans)} ${avu}`, loi_giai: lg({
      mau_chot: `Bài có hai nhóm với số lượng và đại lượng khác nhau: tính tổng của từng nhóm (số lượng nhân đại lượng của mỗi cái), cộng lại, rồi chia cho TỔNG số cái.`,
      buoc: [`Tính tổng của nhóm thứ nhất: ${a} nhân với ${p}.`, `Tính tổng của nhóm thứ hai: ${b} nhân với ${q}.`, `Cộng hai tổng, rồi chia cho tổng số cái (${a} cộng ${b} bằng ${T}).`, ...(c.kg ? [`Đổi kết quả sang tạ theo yêu cầu của đề.`] : [])],
      chu_y: `Chia cho TỔNG số cái (${T}), không chia cho số nhóm ($2$).${c.kg ? ' Nhớ đổi ki-lô-gam sang tạ.' : ''}`,
      p2: ['Bài giải', `Nhóm thứ nhất có tổng là: ${m$(`${p}${X}${a}=${p * a}`)} (${u})`, `Nhóm thứ hai có tổng là: ${m$(`${q}${X}${b}=${q * b}`)} (${u})`, `${c.cau} (đơn vị ${u}): ${m$(`${L(`${p * a}+${q * b}`)}:${T}=${m}`)} (${u})`, ...(c.kg ? [`Đổi: ${m$(m)} kg = ${m$(m / 100)} tạ`] : []), `Đáp số: ${m$(ans)} ${avu}`] }) }
  } })
const CTX_LOAI3 = [
  { de: (a, p, b, q, c, r) => `Trong một lần kiểm tra, lớp 4A có ${a} bạn được ${p} điểm, ${b} bạn được ${q} điểm và ${c} bạn được ${r} điểm. Hỏi trung bình mỗi bạn được bao nhiêu điểm?`, dv: 'điểm', cau: 'Trung bình mỗi bạn được', lo: [6, 10] },
  { de: (a, p, b, q, c, r) => `Một cửa hàng có ${a} chiếc áo giá ${p} nghìn đồng, ${b} chiếc áo giá ${q} nghìn đồng và ${c} chiếc áo giá ${r} nghìn đồng. Hỏi trung bình mỗi chiếc áo giá bao nhiêu nghìn đồng?`, dv: 'nghìn đồng', cau: 'Trung bình mỗi chiếc áo giá', lo: [40, 160] },
  { de: (a, p, b, q, c, r) => `Một đội xe có ${a} xe, mỗi xe chở ${p} tạ; ${b} xe, mỗi xe chở ${q} tạ và ${c} xe, mỗi xe chở ${r} tạ hàng. Hỏi trung bình mỗi xe chở bao nhiêu tạ hàng?`, dv: 'tạ', cau: 'Trung bình mỗi xe chở', lo: [20, 60] },
]
them({ dang: 'NDB01584', parent: G(289), ten: 'tbc-ba-loai', pt: 19,
  tham() { for (;;) { const c = pick(CTX_LOAI3), a = ri(2, 5), b = ri(2, 5), cc = ri(2, 5), p = ri(c.lo[0], c.lo[1]), q = ri(c.lo[0], c.lo[1]), r = ri(c.lo[0], c.lo[1]); if (new Set([p, q, r]).size < 3) continue; const T = a + b + cc, t = a * p + b * q + cc * r; if (t % T) continue; return { c, a, b, cc, p, q, r, m: t / T } } },
  dung({ c, a, b, cc, p, q, r, m }) {
    const T = a + b + cc
    return { noi_dung: c.de(a, p, b, q, cc, r), dap_an: `${m$(m)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Có ba nhóm khác nhau: tính tổng của từng nhóm, cộng ba tổng lại rồi chia cho TỔNG số cái của cả ba nhóm.`,
      buoc: [`Tính tổng của từng nhóm: số lượng nhân với đại lượng của mỗi cái.`, `Cộng ba tổng lại được tổng chung của cả nhóm.`, `Cộng số lượng của ba nhóm: ${a} cộng ${b} cộng ${cc} bằng ${T}.`, `Chia tổng chung cho ${T} để được trung bình cộng.`],
      chu_y: `Chia cho tổng số cái (${T}), không chia cho $3$ (số nhóm).`,
      p2: ['Bài giải', `Tổng của ba nhóm là: ${m$(`${p}${X}${a}+${q}${X}${b}+${r}${X}${cc}=${a * p + b * q + cc * r}`)} (${c.dv})`, `Tổng số cái là: ${m$(`${a}+${b}+${cc}=${T}`)}`, `${c.cau}: ${m$(`${a * p + b * q + cc * r}:${T}=${m}`)} (${c.dv})`, `Đáp số: ${m$(m)} ${c.dv}`] }) }
  } })

// ── D1.4 NDB01585 · Tìm một loại đại lượng khi biết trung bình cộng của nhóm ────────────────
const CTX_NGUOC = [
  { de: (T, a, p, b, m) => `Một đội có ${T} xe chở hàng: ${a} xe loại I, mỗi xe chở ${p} tấn và ${b} xe loại II (mỗi xe chở như nhau). Trung bình mỗi xe chở ${m} tấn. Hỏi mỗi xe loại II chở bao nhiêu tấn?`, dv: 'tấn', cau: 'Mỗi xe loại II chở được số tấn hàng là', a1: 'các xe loại I', pq: [3, 15] },
  { de: (T, a, p, b, m) => `Lớp 4A có ${T} bạn dự thi: ${a} bạn đạt ${p} điểm, ${b} bạn còn lại đạt số điểm bằng nhau. Điểm trung bình của cả ${T} bạn là ${m} điểm. Hỏi mỗi bạn trong ${b} bạn còn lại đạt bao nhiêu điểm?`, dv: 'điểm', cau: 'Mỗi bạn trong nhóm còn lại đạt số điểm là', a1: 'nhóm bạn đã biết điểm', pq: [5, 10] },
  { de: (T, a, p, b, m) => `Bạn Nam đọc xong quyển truyện trong ${T} ngày: ${a} ngày đầu, mỗi ngày đọc ${p} trang; ${b} ngày sau, mỗi ngày đọc như nhau. Trung bình mỗi ngày Nam đọc ${m} trang. Hỏi mỗi ngày trong ${b} ngày sau Nam đọc bao nhiêu trang?`, dv: 'trang', cau: 'Mỗi ngày trong các ngày sau Nam đọc số trang là', a1: 'các ngày đầu', pq: [15, 50] },
  { de: (T, a, p, b, m) => `Một cửa hàng bán gạo trong ${T} ngày: ${a} ngày đầu, mỗi ngày bán ${p} kg; ${b} ngày sau, mỗi ngày bán như nhau. Trung bình mỗi ngày cửa hàng bán ${m} kg gạo. Hỏi mỗi ngày trong ${b} ngày sau cửa hàng bán bao nhiêu ki-lô-gam gạo?`, dv: 'kg', cau: 'Mỗi ngày trong các ngày sau cửa hàng bán số ki-lô-gam gạo là', a1: 'các ngày đầu', pq: [30, 150] },
  { de: (T, a, p, b, m) => `Lớp 4B có ${T} tổ trồng cây: ${a} tổ, mỗi tổ trồng ${p} cây; ${b} tổ còn lại, mỗi tổ trồng số cây bằng nhau. Trung bình mỗi tổ trồng ${m} cây. Hỏi mỗi tổ trong ${b} tổ còn lại trồng bao nhiêu cây?`, dv: 'cây', cau: 'Mỗi tổ trong các tổ còn lại trồng số cây là', a1: 'các tổ đã biết', pq: [6, 30] },
]
them({ dang: 'NDB01585', parent: null, ten: 'tbc-tim-loai-con-lai', pt: 50,
  tham() { for (;;) { const c = pick(CTX_NGUOC), a = ri(2, 6), b = ri(2, 5), p = ri(c.pq[0], c.pq[1]), q = ri(c.pq[0], c.pq[1]); if (p === q) continue; const t = a * p + b * q, T = a + b; if (t % T) continue; const m = t / T; if (m === p || m === q) continue; return { c, a, b, p, q, m } } },
  dung({ c, a, b, p, q, m }) {
    const T = a + b
    return { noi_dung: c.de(T, a, p, b, m), dap_an: `${m$(q)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Đây là bài ngược của bài tìm trung bình cộng: biết trung bình cộng thì tìm tổng cả nhóm, trừ tổng nhóm đã biết, rồi chia cho số cái của nhóm cần tìm.`,
      buoc: [`Tính tổng của cả nhóm: trung bình cộng nhân với tổng số cái (${T}).`, `Tính tổng của ${c.a1} (${a} cái): ${a} nhân với ${p}.`, `Tổng của nhóm cần tìm bằng tổng cả nhóm trừ tổng của ${c.a1}.`, `Chia tổng đó cho ${b} để được đại lượng của MỖI cái trong nhóm cần tìm.`],
      chu_y: `Nhân trung bình cộng với TỔNG số cái (${T}); cuối cùng phải chia cho ${b} chứ không dừng ở tổng của nhóm.`,
      p2: ['Bài giải', `Tổng của cả nhóm là: ${m$(`${m}${X}${T}=${m * T}`)} (${c.dv})`, `Tổng của ${c.a1} là: ${m$(`${p}${X}${a}=${p * a}`)} (${c.dv})`, `Tổng của nhóm cần tìm là: ${m$(`${m * T}-${p * a}=${b * q}`)} (${c.dv})`, `${c.cau}: ${m$(`${b * q}:${b}=${q}`)} (${c.dv})`, `Đáp số: ${m$(q)} ${c.dv}`] }) }
  } })

// ── D1.5 NDB01586 · Trung bình cộng của dãy số cách đều ──────────────────────────────────────
them({ dang: 'NDB01586', parent: G(284), ten: 'day-cach-deu-ngan', pt: 12,
  tham() { for (;;) { const d = ri(1, 9), a = ri(1, 30), n = ri(8, 20), z = a + (n - 1) * d; if ((a + z) % 2 === 0) return { d, a, z, n } } },
  dung({ d, a, z }) {
    const dau = [a, a + d, a + 2 * d, a + 3 * d], m = (a + z) / 2
    return { noi_dung: `Cho dãy số ${dau.join('; ')}; ...; ${z}. Tìm trung bình cộng của các số trong dãy số đó.`, dap_an: m$(m), loi_giai: lg({
      mau_chot: `Dãy số trên có hai số liền nhau hơn kém nhau cùng một số, tức là dãy số cách đều; trung bình cộng của dãy số cách đều bằng (số đầu cộng số cuối) chia $2$.`,
      buoc: [`Kiểm tra dãy số cách đều: ${m$(`${a + d}-${a}=${d}`)}; ${m$(`${a + 2 * d}-${a + d}=${d}`)}; ${m$(`${a + 3 * d}-${a + 2 * d}=${d}`)}.`, `Xác định số đầu là ${a} và số cuối là ${z}.`, `Tính (số đầu cộng số cuối) chia $2$.`],
      chu_y: `Không cần đếm số các số hạng của dãy khi dùng cách này; nhưng chỉ dùng được cho dãy số CÁCH ĐỀU.`,
      p2: ['Bài giải', `Vì dãy số trên là dãy số cách đều (hai số liền nhau hơn kém nhau ${d} đơn vị) nên trung bình cộng các số hạng của dãy là: ${m$(`${L(`${a}+${z}`)}:2=${m}`)}`, `Đáp số: ${m$(m)}`] }) }
  } })
them({ dang: 'NDB01586', parent: G(293), ten: 'day-cach-deu-dai', pt: 11,
  tham() { for (;;) { const d = ri(2, 12), a = ri(2, 40), n = ri(80, 400), z = a + (n - 1) * d; if ((a + z) % 2 === 0) return { d, a, z } } },
  dung({ d, a, z }) {
    const m = (a + z) / 2
    return { noi_dung: `Tìm trung bình cộng của dãy số sau:\n${a}; ${a + d}; ${a + 2 * d};...; ${z - d}; ${z}`, dap_an: m$(m), loi_giai: lg({
      mau_chot: `Dãy số cách đều (hai số liền nhau hơn kém nhau ${d} đơn vị) có trung bình cộng bằng (số đầu cộng số cuối) chia $2$; không cần cộng cả dãy.`,
      buoc: [`Nhận ra dãy số cách đều với khoảng cách ${d}: ${m$(`${a + d}-${a}=${d}`)}; ${m$(`${z}-${z - d}=${d}`)}.`, `Lấy số đầu cộng số cuối: ${a} cộng ${z}.`, `Chia tổng đó cho $2$ được trung bình cộng.`],
      chu_y: `Cách làm này chỉ đúng khi dãy cách đều và không thiếu số nào giữa số đầu và số cuối.`,
      p2: ['Bài giải', `Vì dãy số trên là dãy số cách đều nên trung bình cộng của dãy là: ${m$(`${L(`${a}+${z}`)}:2=${m}`)}`, `Đáp số: ${m$(m)}`] }) }
  } })
const LOAI_TAP = [
  { tx: 'số tự nhiên', buoc: 1, ok: () => true, nghia: 'liên tiếp nhau, mỗi số hơn số liền trước $1$ đơn vị' },
  { tx: 'số chẵn', buoc: 2, ok: (x) => x % 2 === 0, nghia: 'là các số chẵn liên tiếp, mỗi số hơn số chẵn liền trước $2$ đơn vị' },
  { tx: 'số lẻ', buoc: 2, ok: (x) => x % 2 === 1, nghia: 'là các số lẻ liên tiếp, mỗi số hơn số lẻ liền trước $2$ đơn vị' },
  { tx: 'số chia hết cho 5', buoc: 5, ok: (x) => x % 5 === 0, nghia: 'là các số chia hết cho $5$, mỗi số hơn số liền trước $5$ đơn vị' },
  { tx: 'số chia hết cho 3', buoc: 3, ok: (x) => x % 3 === 0, nghia: 'là các số chia hết cho $3$, mỗi số hơn số liền trước $3$ đơn vị' },
]
them({ dang: 'NDB01586', parent: G(295), ten: 'day-tu-tap-so', pt: 14,
  tham() { for (;;) { const c = pick(LOAI_TAP), kieu = pick(['tu-den', 'nho-hon', 'co-chu-so'])
      if (kieu === 'tu-den') { let a = ri(1, 80), z = a + ri(30, 600); while (!c.ok(a)) a++; while (!c.ok(z)) z--; if (z - a < 20 || (a + z) % 2) continue; return { c, kieu, a, z } }
      if (kieu === 'nho-hon') { const N = ri(20, 400) * 10 + (c.buoc === 1 ? 1 : 0); let z = N - 1; while (!c.ok(z)) z--; let a = 0; while (!c.ok(a) || a === 0) a++; if ((a + z) % 2) continue; return { c, kieu, a, z, N } }
      const cs = pick([2, 3]); let a = Math.pow(10, cs - 1), z = Math.pow(10, cs) - 1; while (!c.ok(a)) a++; while (!c.ok(z)) z--; if ((a + z) % 2) continue; return { c, kieu, a, z, cs } } },
  dung({ c, kieu, a, z, N, cs }) {
    const m = (a + z) / 2, tx = c.tx
    const dau = kieu === 'tu-den' ? `Tính trung bình cộng của tất cả các ${tx} từ ${a} đến ${z}.` : kieu === 'nho-hon' ? `Tính trung bình cộng của các ${tx} ${tx.includes('lẻ') ? '' : 'khác 0 '}nhỏ hơn ${N}.` : `Tính trung bình cộng của các ${tx} có ${sl(cs)} chữ số.`
    return { noi_dung: dau, dap_an: m$(m), loi_giai: lg({
      mau_chot: `Các ${tx} đang xét ${c.nghia}, nên tạo thành một dãy số cách đều; trung bình cộng bằng (số đầu cộng số cuối) chia $2$.`,
      buoc: [`Viết dãy số cần tính và nhận ra đó là dãy số cách đều.`, `Xác định số đầu là ${a} và số cuối là ${z}.`, `Lấy số đầu cộng số cuối rồi chia $2$.`],
      chu_y: kieu === 'nho-hon' ? `Số cuối phải nhỏ hơn ${N} và vẫn là ${tx}: đó là ${z}.${tx.includes('lẻ') ? '' : ' Đề không tính số $0$.'}` : `Số đầu và số cuối phải là ${tx} đúng như đề yêu cầu.`,
      p2: ['Bài giải', `Các ${tx} cần tính tạo thành dãy số cách đều: ${m$(`${a};\\ ${a + c.buoc};\\ ${a + 2 * c.buoc};\\ ...;\\ ${z}`)}`, `Trung bình cộng của dãy là: ${m$(`${L(`${a}+${z}`)}:2=${m}`)}`, `Đáp số: ${m$(m)}`] }) }
  } })
const CTX_DAYTT = [
  { de: (a, d, n) => `Một người đi bộ: ngày đầu đi ${a} km, mỗi ngày sau đi nhiều hơn ngày trước ${d} km, và đi như vậy trong ${sl(n)} ngày. Hỏi trung bình mỗi ngày người đó đi bao nhiêu ki-lô-mét?`, dv: 'km', moc: 'ngày', a: [4, 10], d: [1, 2], n: [5, 10] },
  { de: (a, d, n) => `Bạn Hà tiết kiệm tiền trong ${sl(n)} tuần: tuần đầu được ${a} nghìn đồng, mỗi tuần sau nhiều hơn tuần trước ${d} nghìn đồng. Hỏi trung bình mỗi tuần bạn Hà tiết kiệm được bao nhiêu nghìn đồng?`, dv: 'nghìn đồng', moc: 'tuần', a: [10, 40], d: [2, 8], n: [5, 12] },
  { de: (a, d, n) => `Một xưởng may trong ${sl(n)} ngày: ngày đầu may được ${a} chiếc áo, mỗi ngày sau may nhiều hơn ngày trước ${d} chiếc. Hỏi trung bình mỗi ngày xưởng may được bao nhiêu chiếc áo?`, dv: 'chiếc áo', moc: 'ngày', a: [20, 60], d: [2, 8], n: [5, 12] },
  { de: (a, d, n) => `Một rạp chiếu phim có ${sl(n)} hàng ghế: hàng đầu có ${a} ghế, mỗi hàng sau nhiều hơn hàng trước ${d} ghế. Hỏi trung bình mỗi hàng có bao nhiêu ghế?`, dv: 'ghế', moc: 'hàng', a: [8, 20], d: [1, 3], n: [6, 14] },
]
them({ dang: 'NDB01586', parent: G(284), ten: 'day-tinh-huong', pt: 13,
  tham() { for (;;) { const c = pick(CTX_DAYTT), d = ri(c.d[0], c.d[1]), a = ri(c.a[0], c.a[1]), n = ri(c.n[0], c.n[1]), z = a + (n - 1) * d; if ((a + z) % 2 === 0) return { c, d, a, n, z } } },
  dung({ c, d, a, n, z }) {
    const m = (a + z) / 2
    return { noi_dung: c.de(a, d, n), dap_an: `${m$(m)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Mỗi ${c.moc} sau hơn ${c.moc} trước cùng một số, nên số ${c.dv} của các ${c.moc} tạo thành dãy số cách đều; trung bình cộng bằng (số đầu cộng số cuối) chia $2$.`,
      buoc: [`Tìm số của ${c.moc} cuối cùng: ${c.moc} đầu cộng ${n - 1} lần phần tăng thêm ${d}.`, `Cộng số của ${c.moc} đầu và ${c.moc} cuối.`, `Chia tổng đó cho $2$ để được trung bình cộng.`],
      chu_y: `Số lần tăng là ${n - 1} (ít hơn số ${c.moc} một đơn vị), không phải ${n}.`,
      p2: ['Bài giải', `Số ${c.dv} của ${c.moc} cuối cùng là: ${m$(`${a}+${L(`${n}-1`)}${X}${d}=${z}`)} (${c.dv})`, `Trung bình mỗi ${c.moc} có số ${c.dv} là: ${m$(`${L(`${a}+${z}`)}:2=${m}`)} (${c.dv})`, `Đáp số: ${m$(m)} ${c.dv}`] }) }
  } })

// ── D1.6 NDB01588 · Tổng hiệu ẩn tổng bằng trung bình cộng ───────────────────────────────────
them({ dang: 'NDB01588', parent: G(296), ten: 'so-lien-tiep', pt: 22,
  tham() { for (;;) { const k = pick([3, 3, 5]), loai = pick(['tự nhiên', 'chẵn', 'lẻ']), s = loai === 'tự nhiên' ? 1 : 2, m = ri(20, 400); if (loai === 'chẵn' && m % 2) continue; if (loai === 'lẻ' && m % 2 === 0) continue; if (m - s * ((k - 1) / 2) <= 0) continue; return { k, loai, s, m } } },
  dung({ k, loai, s, m }) {
    const h = (k - 1) / 2, ds = Array.from({ length: k }, (_, i) => m + (i - h) * s)
    const goi = `${sl(k)} số ${loai} liên tiếp`
    const buoc = []; for (let j = 1; j <= h; j++) buoc.push([j, m - j * s, m + j * s])
    return { noi_dung: `Biết trung bình cộng của ${goi} bằng ${m}. Tìm ${sl(k)} số đó.`, dap_an: ds.map(m$).join('; '), loi_giai: lg({
      mau_chot: `${cap(goi)} là dãy số cách đều (hơn kém nhau ${s} đơn vị), có số lượng số hạng lẻ nên trung bình cộng chính là số ở giữa. Biết số ở giữa thì các số còn lại hơn kém nó ${s}${h > 1 ? `, ${2 * s}` : ''}.`,
      buoc: [`Nhận ra dãy cách đều có ${k} số hạng: số ở giữa bằng trung bình cộng, tức là ${m}.`, `Các số đứng trước số ở giữa: lần lượt kém nó ${Array.from({ length: h }, (_, i) => (i + 1) * s).join(' và ')}.`, `Các số đứng sau số ở giữa: lần lượt hơn nó ${Array.from({ length: h }, (_, i) => (i + 1) * s).join(' và ')}.`],
      chu_y: loai === 'tự nhiên' ? `Số tự nhiên liên tiếp hơn kém nhau $1$.` : `Số ${loai} liên tiếp hơn kém nhau $2$ (không phải $1$).`,
      p2: ['Bài giải', `${cap(goi)} là dãy số cách đều nên số ở giữa bằng trung bình cộng, tức là ${m$(m)}.`, ...buoc.flatMap(([j, lo, hi]) => [`Số đứng trước số ở giữa ${j} vị trí là: ${m$(`${m}-${j * s}=${lo}`)}`, `Số đứng sau số ở giữa ${j} vị trí là: ${m$(`${m}+${j * s}=${hi}`)}`]), `Vậy ${sl(k)} số cần tìm là ${ds.map(m$).join('; ')}.`, `Đáp số: ${ds.map(m$).join('; ')}`] }) }
  } })
const CTX_TH = [
  { de: (m, d) => `Trung bình cộng của hai số là ${m}, số lớn hơn số bé ${d} đơn vị. Tìm hai số đó.`, lon: 'Số lớn', be: 'Số bé', m: [10, 90], d: [2, 14] },
  { de: (m, d) => `Tuổi trung bình của hai chị em là ${m} tuổi, chị hơn em ${d} tuổi. Hỏi chị và em mỗi người bao nhiêu tuổi?`, lon: 'Tuổi của chị', be: 'Tuổi của em', m: [8, 14], d: [2, 6] },
  { de: (m, d) => `Hai thửa ruộng thu hoạch trung bình mỗi thửa ${m} tạ thóc, thửa thứ nhất thu hoạch nhiều hơn thửa thứ hai ${d} tạ. Hỏi mỗi thửa thu hoạch được bao nhiêu tạ thóc?`, lon: 'Thửa thứ nhất', be: 'Thửa thứ hai', m: [20, 90], d: [2, 20] },
  { de: (m, d) => `Hai bạn An và Bình có trung bình mỗi bạn ${m} viên bi, An có nhiều hơn Bình ${d} viên bi. Hỏi mỗi bạn có bao nhiêu viên bi?`, lon: 'An', be: 'Bình', m: [10, 60], d: [2, 14] },
  { de: (m, d) => `Hai thùng dầu chứa trung bình mỗi thùng ${m} lít, thùng thứ nhất chứa nhiều hơn thùng thứ hai ${d} lít. Hỏi mỗi thùng chứa bao nhiêu lít dầu?`, lon: 'Thùng thứ nhất', be: 'Thùng thứ hai', m: [20, 90], d: [2, 20] },
]
them({ dang: 'NDB01588', parent: null, ten: 'hai-so-tbc-hieu', pt: 28,
  tham() { for (;;) { const c = pick(CTX_TH), m = ri(c.m[0], c.m[1]), d = 2 * ri(Math.ceil(c.d[0] / 2), Math.floor(c.d[1] / 2)); if (d >= 2 * m - 2 || d > (2 * m - d) / 2) continue; return { c, m, d } } },
  dung({ c, m, d }) {
    const t = 2 * m, be = (t - d) / 2, lon = be + d
    const so_do = { gia_tri_phan: be, hang: [{ nhan: c.lon, phan: 1, them: `${d}` }, { nhan: c.be, phan: 1 }], tong: `${t}`, hieu: `${d}`, dau_hoi: [c.lon, c.be] }
    return { noi_dung: c.de(m, d), dap_an: `${c.lon}: ${m$(lon)}; ${c.be}: ${m$(be)}`, so_do, loi_giai: lg({
      mau_chot: `Trung bình cộng của hai số cho biết TỔNG hai số (nhân $2$). Biết tổng và hiệu thì giải bằng bài toán tổng – hiệu: số bé bằng (tổng trừ hiệu) chia $2$.`,
      buoc: [`Tính tổng hai số: trung bình cộng nhân $2$.`, `Vẽ sơ đồ với tổng và hiệu đã biết.`, `Tìm số bé: lấy (tổng trừ hiệu) chia $2$.`, `Tìm số lớn: lấy số bé cộng hiệu.`],
      chu_y: `Phải đổi trung bình cộng thành tổng (${m$(`${m}${X}2`)}) trước khi dùng tổng – hiệu.`,
      p2: ['Bài giải', `Tổng của hai số là: ${m$(`${m}${X}2=${t}`)}`, 'Ta có sơ đồ:', `${c.be} là: ${m$(`${L(`${t}-${d}`)}:2=${be}`)}`, `${c.lon} là: ${m$(`${be}+${d}=${lon}`)}`, `Đáp số: ${c.lon}: ${m$(lon)}; ${c.be}: ${m$(be)}`] }) }
  } })

// ── D2.1 NDB01589 · TBC của nhóm khi thêm/bớt ──────────────────────────────────────────────
const CTX_THEM = [
  { so: true, m: [10, 600], x: [0.5, 1.5], rel: true, n: [3, 8] },
  { de: (n, m, x) => `Một đội có ${sl(n)} bạn, tuổi trung bình của các bạn là ${m} tuổi. Có một anh phụ trách mới đến, anh đó ${x} tuổi. Hỏi tuổi trung bình của cả đội lúc này là bao nhiêu?`, dv: 'tuổi', m: [9, 11], x: [12, 20], n: [3, 6] },
  { de: (n, m, x) => `Một người đi xe đạp trong ${sl(n)} giờ đầu, trung bình mỗi giờ đi được ${m} km. Giờ tiếp theo người đó đi được ${x} km. Hỏi trong cả ${sl(n + 1)} giờ, trung bình mỗi giờ người đó đi được bao nhiêu ki-lô-mét?`, dv: 'km', m: [8, 16], x: [4, 30], n: [3, 7] },
  { de: (n, m, x) => `Một cửa hàng bán trong ${sl(n)} ngày, trung bình mỗi ngày bán được ${m} kg gạo. Ngày tiếp theo cửa hàng bán được ${x} kg. Hỏi trung bình mỗi ngày trong ${sl(n + 1)} ngày cửa hàng bán được bao nhiêu ki-lô-gam gạo?`, dv: 'kg', m: [60, 300], x: [30, 450], n: [3, 8] },
  { de: (n, m, x) => `Điểm trung bình cộng của ${sl(n)} bài kiểm tra của Lan là ${m} điểm. Bài kiểm tra tiếp theo Lan được ${x} điểm. Hỏi điểm trung bình cộng của ${sl(n + 1)} bài kiểm tra là bao nhiêu?`, dv: 'điểm', m: [5, 8], x: [6, 10], n: [3, 4] },
]
them({ dang: 'NDB01589', parent: G(290), ten: 'them-so-tbc-moi', pt: 33,
  tham() { for (;;) { const c = pick(CTX_THEM), n = ri(c.n[0], c.n[1]), m = ri(c.m[0], c.m[1]), x = c.rel ? ri(Math.ceil(m * c.x[0]), Math.floor(m * c.x[1])) : ri(c.x[0], c.x[1]); if (x !== m && (n * m + x) % (n + 1) === 0) { const nm = (n * m + x) / (n + 1); if (nm !== m) return { c, n, m, x, nm } } } },
  dung({ c, n, m, x, nm }) {
    const de = c.so ? `Biết trung bình cộng của ${sl(n)} số là ${m}. Hỏi nếu thêm số thứ ${chu[n]} là ${x} thì trung bình cộng của ${sl(n + 1)} số là bao nhiêu?` : c.de(n, m, x)
    const dv = c.dv ? ` ${c.dv}` : ''
    return { noi_dung: de, dap_an: `${m$(nm)}${dv}`, loi_giai: lg({
      mau_chot: `Thêm một số thì tổng mới bằng tổng cũ cộng số thêm, và số các số hạng tăng thêm $1$. Không lấy trung bình cộng cũ cộng trực tiếp với số thêm.`,
      buoc: [`Tính tổng của ${sl(n)} số lúc đầu: trung bình cộng nhân ${n}.`, `Tính tổng mới: tổng cũ cộng số được thêm vào (${x}).`, `Chia tổng mới cho số các số hạng mới (${n + 1}) để được trung bình cộng mới.`],
      chu_y: `Số các số hạng mới là ${n + 1}, không phải ${n}.`,
      p2: ['Bài giải', `Tổng lúc đầu là: ${m$(`${m}${X}${n}=${m * n}`)}`, `Tổng sau khi thêm là: ${m$(`${m * n}+${x}=${m * n + x}`)}`, `Trung bình cộng mới là: ${m$(`${m * n + x}:${n + 1}=${nm}`)}${c.dv ? ` (${c.dv})` : ''}`, `Đáp số: ${m$(nm)}${dv}`] }) }
  } })
const CTX_BOT = [
  { so: true, m: [10, 400], x: [0.5, 1.5], rel: true, n: [4, 8] },
  { de: (n, m, x) => `Một đội gồm ${sl(n)} bạn, kể cả anh phụ trách, có tuổi trung bình là ${m} tuổi. Anh phụ trách ${x} tuổi rời đội đi nơi khác. Hỏi tuổi trung bình của ${sl(n - 1)} bạn còn lại là bao nhiêu?`, dv: 'tuổi', m: [10, 13], x: [14, 20], n: [4, 6] },
  { de: (n, m, x) => `Trung bình mỗi ngày một cửa hàng bán được ${m} kg gạo trong ${sl(n)} ngày. Ngày bán được ${x} kg gạo là ngày nghỉ lễ, nếu không tính ngày đó thì trung bình mỗi ngày trong ${sl(n - 1)} ngày còn lại bán được bao nhiêu ki-lô-gam gạo?`, dv: 'kg', m: [60, 300], x: [30, 500], n: [4, 8] },
  { de: (n, m, x) => `Điểm trung bình của ${sl(n)} bài kiểm tra là ${m} điểm. Nếu bỏ đi bài được ${x} điểm thì điểm trung bình của ${sl(n - 1)} bài còn lại là bao nhiêu?`, dv: 'điểm', m: [6, 9], x: [3, 10], n: [4, 5] },
]
them({ dang: 'NDB01589', parent: G(290), ten: 'bot-so-tbc-moi', pt: 16,
  tham() { for (;;) { const c = pick(CTX_BOT), n = ri(c.n[0], c.n[1]), m = ri(c.m[0], c.m[1]), x = c.rel ? ri(Math.ceil(m * c.x[0]), Math.floor(m * c.x[1])) : ri(c.x[0], c.x[1]); const t = n * m - x; if (t > 0 && x !== m && t % (n - 1) === 0) { const nm = t / (n - 1); if (nm !== m) return { c, n, m, x, nm } } } },
  dung({ c, n, m, x, nm }) {
    const de = c.so ? `Biết trung bình cộng của ${sl(n)} số là ${m}. Hỏi nếu bớt đi số ${x} thì trung bình cộng của ${sl(n - 1)} số còn lại là bao nhiêu?` : c.de(n, m, x)
    const dv = c.dv ? ` ${c.dv}` : ''
    return { noi_dung: de, dap_an: `${m$(nm)}${dv}`, loi_giai: lg({
      mau_chot: `Bớt một số thì tổng mới bằng tổng cũ trừ số bớt đi, và số các số hạng giảm đi $1$.`,
      buoc: [`Tính tổng của ${sl(n)} số lúc đầu: trung bình cộng nhân ${n}.`, `Tính tổng mới: tổng cũ trừ số bị bớt đi (${x}).`, `Chia tổng mới cho số các số hạng còn lại (${n - 1}).`],
      chu_y: `Số các số hạng còn lại là ${n - 1}, không phải ${n}.`,
      p2: ['Bài giải', `Tổng lúc đầu là: ${m$(`${m}${X}${n}=${m * n}`)}`, `Tổng sau khi bớt là: ${m$(`${m * n}-${x}=${m * n - x}`)}`, `Trung bình cộng mới là: ${m$(`${m * n - x}:${n - 1}=${nm}`)}${c.dv ? ` (${c.dv})` : ''}`, `Đáp số: ${m$(nm)}${dv}`] }) }
  } })

// ── D2.2 NDB01590 · Tìm số được thêm/bớt ──────────────────────────────────────────────────────
them({ dang: 'NDB01590', parent: G(283), ten: 'tim-so-them', pt: 17,
  tham() { for (;;) { const n = ri(3, 7), m = ri(5, 60), nm = m + ri(1, 9), x = (n + 1) * nm - n * m; if (x > 0 && x !== m && x !== nm) return { n, m, nm, x } } },
  dung({ n, m, nm, x }) {
    return { noi_dung: `Trung bình cộng của ${sl(n)} số là ${m}, nếu thêm số thứ ${chu[n]} thì trung bình cộng của ${sl(n + 1)} số là ${nm}. Tìm số thứ ${chu[n]}.`, dap_an: m$(x), loi_giai: lg({
      mau_chot: `Tổng mới trừ tổng cũ chính là số được thêm vào. Tính hai tổng bằng cách lấy trung bình cộng nhân với số các số hạng tương ứng.`,
      buoc: [`Tính tổng của ${sl(n)} số lúc đầu: ${m} nhân ${n}.`, `Tính tổng của ${sl(n + 1)} số sau khi thêm: ${nm} nhân ${n + 1}.`, `Số thêm vào bằng tổng mới trừ tổng cũ.`],
      chu_y: `Hai tổng nhân với hai số các số hạng KHÁC nhau (${n} và ${n + 1}).`,
      p2: ['Bài giải', `Tổng ${sl(n)} số là: ${m$(`${m}${X}${n}=${m * n}`)}`, `Tổng ${sl(n + 1)} số là: ${m$(`${nm}${X}${n + 1}=${nm * (n + 1)}`)}`, `Số thứ ${chu[n]} là: ${m$(`${nm * (n + 1)}-${m * n}=${x}`)}`, `Đáp số: ${m$(x)}`] }) }
  } })
const CTX_CO = [
  { de: (n, m, nm) => `Biết tuổi trung bình của ${n} học sinh trong lớp là ${m} tuổi. Nếu tính cả cô giáo thì tuổi trung bình của cô và ${n} học sinh là ${nm} tuổi. Hỏi cô giáo bao nhiêu tuổi?`, dv: 'tuổi', ai: 'cô giáo', ma: [8, 10], xmax: 60 },
  { de: (n, m, nm) => `Cân nặng trung bình của ${n} học sinh trong đội là ${m} kg. Nếu tính cả huấn luyện viên thì cân nặng trung bình của huấn luyện viên và ${n} học sinh là ${nm} kg. Hỏi huấn luyện viên nặng bao nhiêu ki-lô-gam?`, dv: 'kg', ai: 'huấn luyện viên', ma: [30, 40], xmax: 90 },
  { de: (n, m, nm) => `Chiều cao trung bình của ${n} bạn trong tổ là ${m} cm. Nếu thêm một bạn mới vào tổ thì chiều cao trung bình của cả tổ là ${nm} cm. Hỏi bạn mới cao bao nhiêu xăng-ti-mét?`, dv: 'cm', ai: 'bạn mới', ma: [130, 145], xmax: 175 },
  { de: (n, m, nm) => `Trong ${n} ngày đầu tuần, trung bình mỗi ngày một cửa hàng bán được ${m} kg đường. Nếu tính cả ngày chủ nhật thì trung bình mỗi ngày bán được ${nm} kg đường. Hỏi ngày chủ nhật cửa hàng bán được bao nhiêu ki-lô-gam đường?`, dv: 'kg', ai: 'ngày chủ nhật', ma: [40, 90], xmax: 220, nmax: 6, n6: true },
]
them({ dang: 'NDB01590', parent: G(39), ten: 'tim-so-them-nhieu', pt: 17,
  tham() { for (;;) { const c = pick(CTX_CO), n = c.n6 ? 6 : ri(c.nmax ? 3 : 12, c.nmax ?? 40), m = ri(c.ma[0], c.ma[1]), nm = m + ri(1, 3), x = (n + 1) * nm - n * m; if (x > 0 && x !== m && x <= c.xmax) return { c, n, m, nm, x } } },
  dung({ c, n, m, nm, x }) {
    const dn = c.nmax ? sl(n) : n
    return { noi_dung: c.de(dn, m, nm), dap_an: `${m$(x)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Thêm ${c.ai} thì số các số hạng tăng từ ${n} lên ${n + 1}; tổng mới trừ tổng cũ chính là số của ${c.ai}.`,
      buoc: [`Tính tổng của ${n} số lúc đầu: trung bình cộng nhân ${n}.`, `Tính tổng sau khi thêm ${c.ai}: trung bình cộng mới nhân ${n + 1}.`, `Lấy tổng mới trừ tổng cũ để được số cần tìm.`],
      chu_y: `Số cần tìm là số của ${c.ai}, đừng lấy hiệu của hai trung bình cộng.`,
      p2: ['Bài giải', `Tổng của ${n} số lúc đầu là: ${m$(`${m}${X}${n}=${m * n}`)}`, `Tổng sau khi thêm ${c.ai} là: ${m$(`${nm}${X}${n + 1}=${nm * (n + 1)}`)}`, `Số của ${c.ai} là: ${m$(`${nm * (n + 1)}-${m * n}=${x}`)} (${c.dv})`, `Đáp số: ${m$(x)} ${c.dv}`] }) }
  } })
const CTX_BO = [
  { de: (n, m, nm) => `Hiện nay, trung bình số tuổi của bố, mẹ và Hoa là ${m} tuổi. Nếu không tính tuổi bố thì trung bình cộng số tuổi của mẹ và Hoa là ${nm} tuổi. Tính tuổi bố hiện nay.`, n: 3, dv: 'tuổi', ai: 'bố', ma: [28, 36], nm: [18, 26], xr: [28, 60] },
  { de: (n, m, nm) => `Trung bình cộng điểm của ${sl(n)} bài kiểm tra là ${m} điểm. Nếu không tính bài kiểm tra đầu tiên thì trung bình cộng điểm của ${sl(n - 1)} bài còn lại là ${nm} điểm. Hỏi bài kiểm tra đầu tiên được mấy điểm?`, dv: 'điểm', ai: 'bài đầu tiên', ma: [5, 9], nm: [5, 9], nmax: 5, xr: [3, 10] },
  { de: (n, m, nm) => `Cân nặng trung bình của ${sl(n)} bạn là ${m} kg. Nếu không tính bạn Tùng thì cân nặng trung bình của ${sl(n - 1)} bạn còn lại là ${nm} kg. Hỏi bạn Tùng nặng bao nhiêu ki-lô-gam?`, dv: 'kg', ai: 'bạn Tùng', ma: [30, 40], nm: [28, 38], nmax: 6, xr: [25, 60] },
  { de: (n, m, nm) => `Trung bình mỗi ngày một xưởng làm được ${m} sản phẩm trong ${sl(n)} ngày. Nếu không tính ngày làm nhiều nhất thì trung bình mỗi ngày trong ${sl(n - 1)} ngày còn lại làm được ${nm} sản phẩm. Hỏi ngày làm nhiều nhất xưởng làm được bao nhiêu sản phẩm?`, dv: 'sản phẩm', ai: 'ngày làm nhiều nhất', ma: [100, 200], nm: [80, 190], nmax: 6, xr: [100, 400], cao: true },
]
them({ dang: 'NDB01590', parent: G(291), ten: 'tim-so-bot', pt: 16,
  tham() { for (;;) { const c = pick(CTX_BO), n = c.n ?? ri(3, c.nmax), nm = ri(c.nm[0], c.nm[1]); let m = ri(c.ma[0], c.ma[1]); if (c.cao && n * m - (n - 1) * nm <= nm) m = nm + 1 + (n % 3); const x = n * m - (n - 1) * nm; if (x >= c.xr[0] && x <= c.xr[1] && x !== m && x !== nm && Math.abs(m - nm) <= 20) return { c, n, m, nm, x } } },
  dung({ c, n, m, nm, x }) {
    return { noi_dung: c.de(n, m, nm), dap_an: `${m$(x)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Bớt ${c.ai} thì số các số hạng giảm từ ${n} xuống ${n - 1}; tổng cũ trừ tổng của các số còn lại chính là số của ${c.ai}.`,
      buoc: [`Tính tổng của ${sl(n)} số lúc đầu: trung bình cộng nhân ${n}.`, `Tính tổng của ${sl(n - 1)} số còn lại: trung bình cộng mới nhân ${n - 1}.`, `Lấy tổng cũ trừ tổng của các số còn lại để được số cần tìm.`],
      chu_y: `Hai tổng nhân với hai số các số hạng khác nhau (${n} và ${n - 1}).`,
      p2: ['Bài giải', `Tổng của ${sl(n)} số lúc đầu là: ${m$(`${m}${X}${n}=${m * n}`)}`, `Tổng của ${sl(n - 1)} số còn lại là: ${m$(`${nm}${X}${n - 1}=${nm * (n - 1)}`)}`, `Số của ${c.ai} là: ${m$(`${m * n}-${nm * (n - 1)}=${x}`)} (${c.dv})`, `Đáp số: ${m$(x)} ${c.dv}`] }) }
  } })

// ── D2.3 NDB01591 · Tính số đại lượng ────────────────────────────────────────────────────────
// a = TB cũ, e = chênh, n = số cũ; b = c + n·e — mỗi ngữ cảnh giữ b trong khoảng đời thực (bmax)
const CTX_SO = [
  { them: (a, b, c) => `Có một nhóm số có trung bình cộng là ${a}. Nếu thêm vào nhóm số ${b} thì trung bình cộng của cả nhóm là ${c}. Hỏi lúc đầu nhóm có bao nhiêu số?`, bot: (a, b, c) => `Có một nhóm số có trung bình cộng là ${a}. Nếu bớt đi số ${b} thì trung bình cộng của các số còn lại là ${c}. Hỏi lúc đầu nhóm có bao nhiêu số?`, dv: 'số', mot: 'số', a: [8, 60], e: [1, 6], n: [3, 12], bmax: 200 },
  { them: (a, b, c) => `Một nhóm bạn nhỏ có tuổi trung bình là ${a} tuổi. Khi có thêm một anh đội trưởng ${b} tuổi tham gia thì tuổi trung bình của cả nhóm là ${c} tuổi. Hỏi lúc đầu nhóm có bao nhiêu bạn nhỏ?`, bot: (a, b, c) => `Một nhóm bạn có tuổi trung bình là ${a} tuổi. Khi anh đội trưởng ${b} tuổi rời nhóm thì tuổi trung bình của các bạn còn lại là ${c} tuổi. Hỏi lúc đầu nhóm có bao nhiêu bạn?`, dv: 'bạn', mot: 'bạn', a: [8, 10], e: [1, 1], n: [3, 8], bmax: 60 },
  { them: (a, b, c) => `Điểm trung bình của một số bài kiểm tra của Lan là ${a} điểm. Bài kiểm tra tiếp theo Lan được ${b} điểm thì điểm trung bình của tất cả các bài là ${c} điểm. Hỏi trước đó Lan đã làm bao nhiêu bài kiểm tra?`, bot: (a, b, c) => `Điểm trung bình của một số bài kiểm tra là ${a} điểm. Nếu không tính bài được ${b} điểm thì điểm trung bình của các bài còn lại là ${c} điểm. Hỏi lúc đầu có bao nhiêu bài kiểm tra?`, dv: 'bài', mot: 'bài', a: [5, 7], e: [1, 1], n: [2, 3], bmax: 10 },
  { them: (a, b, c) => `Một đội công nhân, mỗi người trung bình làm được ${a} sản phẩm trong một ngày. Một công nhân mới vào đội làm được ${b} sản phẩm thì trung bình mỗi người trong cả đội làm được ${c} sản phẩm. Hỏi lúc đầu đội có bao nhiêu công nhân?`, bot: (a, b, c) => `Một đội công nhân, mỗi người trung bình làm được ${a} sản phẩm trong một ngày. Nếu không tính một người làm được ${b} sản phẩm thì trung bình mỗi người còn lại làm được ${c} sản phẩm. Hỏi lúc đầu đội có bao nhiêu công nhân?`, dv: 'công nhân', mot: 'người', a: [20, 60], e: [1, 4], n: [3, 10], bmax: 110 },
]
them({ dang: 'NDB01591', parent: null, ten: 'tinh-so-luong-them', pt: 34,
  tham() { for (;;) { const c = pick(CTX_SO), n = ri(c.n[0], c.n[1]), e = ri(c.e[0], c.e[1]), a = ri(c.a[0], c.a[1]), cc = a + e, b = cc + n * e; if (b <= c.bmax) return { c, n, e, a, cc, b } } },
  dung({ c, n, e, a, cc, b }) {
    return { noi_dung: c.them(a, b, cc), dap_an: `${m$(n)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Số được thêm vào hơn trung bình cộng mới một phần; phần hơn đó được chia đều để "bù" cho các số cũ, mỗi số cũ phải tăng từ trung bình cộng cũ lên trung bình cộng mới. Chia phần hơn cho mức tăng của mỗi số cũ thì ra số các số cũ.`,
      buoc: [`Tìm phần số thêm vào hơn trung bình cộng mới: ${b} trừ ${cc}.`, `Tìm mức mỗi số cũ phải tăng thêm: trung bình cộng mới trừ trung bình cộng cũ.`, `Số các số lúc đầu bằng phần hơn chia cho mức tăng của mỗi số.`, `Thử lại bằng cách tính trung bình cộng của cả nhóm sau khi thêm.`],
      chu_y: `Đáp số là số các số LÚC ĐẦU (chưa thêm), không phải số các số sau khi thêm.`,
      p2: ['Bài giải', `Số được thêm vào hơn trung bình cộng mới là: ${m$(`${b}-${cc}=${b - cc}`)}`, `Mỗi số cũ phải tăng thêm để đạt trung bình cộng mới là: ${m$(`${cc}-${a}=${e}`)}`, `Lúc đầu có số ${c.mot} là: ${m$(`${b - cc}:${e}=${n}`)} (${c.dv})`, `Thử lại: ${m$(`${L(`${a}${X}${n}+${b}`)}:${L(`${n}+1`)}=${cc}`)} (đúng).`, `Đáp số: ${m$(n)} ${c.dv}`] }) }
  } })
them({ dang: 'NDB01591', parent: null, ten: 'tinh-so-luong-bot', pt: 16,
  tham() { for (;;) { const c = pick(CTX_SO), n = ri(c.n[0], c.n[1]), e = ri(c.e[0], c.e[1]), cc = ri(c.a[0], c.a[1]), a = cc + e, b = cc + n * e; if (b <= c.bmax) return { c, n, e, a, cc, b } } },
  dung({ c, n, e, a, cc, b }) {
    return { noi_dung: c.bot(a, b, cc), dap_an: `${m$(n)} ${c.dv}`, loi_giai: lg({
      mau_chot: `Nếu thay số bị bớt bằng đúng trung bình cộng mới thì cả nhóm đều bằng trung bình cộng mới. Phần số bị bớt hơn trung bình cộng mới được chia đều cho các số lúc đầu: mỗi số lúc đầu hơn trung bình cộng mới một mức bằng (trung bình cộng cũ trừ trung bình cộng mới).`,
      buoc: [`Tìm phần số bị bớt hơn trung bình cộng mới: ${b} trừ ${cc}.`, `Tìm mức mỗi số lúc đầu hơn trung bình cộng mới: trung bình cộng cũ trừ trung bình cộng mới.`, `Số các số lúc đầu bằng phần hơn chia cho mức hơn của mỗi số.`, `Thử lại bằng cách bớt số đó rồi tính trung bình cộng các số còn lại.`],
      chu_y: `Đáp số là số các số LÚC ĐẦU (chưa bớt), không phải số các số còn lại.`,
      p2: ['Bài giải', `Số bị bớt hơn trung bình cộng mới là: ${m$(`${b}-${cc}=${b - cc}`)}`, `Mỗi số lúc đầu hơn trung bình cộng mới là: ${m$(`${a}-${cc}=${e}`)}`, `Lúc đầu có số ${c.mot} là: ${m$(`${b - cc}:${e}=${n}`)} (${c.dv})`, `Thử lại: ${m$(`${L(`${a}${X}${n}-${b}`)}:${L(`${n}-1`)}=${cc}`)} (đúng).`, `Đáp số: ${m$(n)} ${c.dv}`] }) }
  } })

// ── D3.x · Quan hệ với trung bình cộng (có sơ đồ) ─────────────────────────────────────────────
// ng = hai số đã biết (dạng viết GIỮA câu); x = số đang xét; dn = danh từ đại lượng; r = khoảng số liệu; kmax = chênh tối đa
const CTX_BA = [
  { ng: ['tổ bạn An', 'tổ bạn Bình'], x: 'tổ bạn Minh', dn: 'số ngôi sao', dv: 'ngôi sao', hanh: (n) => `được thưởng ${n} ngôi sao`, hoiX: 'Hỏi tổ bạn Minh được thưởng bao nhiêu ngôi sao?', hoiT: 'Hỏi cả ba tổ được thưởng tất cả bao nhiêu ngôi sao?', tbc: 'trung bình cộng số ngôi sao của ba tổ', r: [14, 60], kmax: 10 },
  { ng: ['Lan', 'Mai'], x: 'Hoa', dn: 'số ngôi sao giấy', dv: 'ngôi sao giấy', hanh: (n) => `gấp được ${n} ngôi sao giấy`, hoiX: 'Hỏi Hoa gấp được bao nhiêu ngôi sao giấy?', hoiT: 'Hỏi cả ba bạn gấp được tất cả bao nhiêu ngôi sao giấy?', tbc: 'trung bình cộng số ngôi sao giấy của cả ba bạn', r: [14, 60], kmax: 10 },
  { ng: ['lớp 4A', 'lớp 4B'], x: 'lớp 4C', dn: 'số cây', dv: 'cây', hanh: (n) => `trồng được ${n} cây`, hoiX: 'Hỏi lớp 4C trồng được bao nhiêu cây?', hoiT: 'Hỏi cả ba lớp trồng được tất cả bao nhiêu cây?', tbc: 'trung bình cộng số cây của cả ba lớp', r: [30, 90], kmax: 12 },
  { ng: ['Thuỷ', 'Hiền'], x: 'Hoà', dn: 'số nhãn vở', dv: 'nhãn vở', hanh: (n) => `mua ${n} nhãn vở`, hoiX: 'Hỏi Hoà mua bao nhiêu nhãn vở?', hoiT: 'Hỏi cả ba bạn mua tất cả bao nhiêu nhãn vở?', tbc: 'trung bình cộng số nhãn vở của cả ba bạn', r: [12, 50], kmax: 8 },
  { ng: ['xe thứ nhất', 'xe thứ hai'], x: 'xe thứ ba', dn: 'số hàng', dv: 'tạ hàng', hanh: (n) => `chở được ${n} tạ hàng`, hoiX: 'Hỏi xe thứ ba chở được bao nhiêu tạ hàng?', hoiT: 'Hỏi cả ba xe chở được tất cả bao nhiêu tạ hàng?', tbc: 'trung bình cộng số hàng của cả ba xe', r: [30, 90], kmax: 12 },
  { ng: ['bạn Hà', 'bạn Nam'], x: 'bạn Cường', dn: 'cân nặng', dv: 'kg', hanh: (n) => `nặng ${n} kg`, hoiX: 'Hỏi bạn Cường nặng bao nhiêu ki-lô-gam?', hoiT: 'Hỏi cả ba bạn nặng tất cả bao nhiêu ki-lô-gam?', tbc: 'trung bình cộng cân nặng của ba bạn', r: [28, 46], kmax: 6 },
  { ng: ['cửa hàng A', 'cửa hàng B'], x: 'cửa hàng C', dn: 'số gạo bán được', dv: 'kg gạo', hanh: (n) => `bán được ${n} kg gạo`, hoiX: 'Hỏi cửa hàng C bán được bao nhiêu ki-lô-gam gạo?', hoiT: 'Hỏi cả ba cửa hàng bán được tất cả bao nhiêu ki-lô-gam gạo?', tbc: 'trung bình cộng số gạo bán được của ba cửa hàng', r: [80, 300], kmax: 30 },
]
const dauChu = (d) => (d === '+' ? 'nhiều hơn' : 'ít hơn')
function mauBa(dau, dang, parent, pt, tenMau, hoiLoai) {
  them({ dang, parent, ten: tenMau, pt, soDo: true,
    tham() { for (;;) { const c = pick(CTX_BA), a = ri(c.r[0], c.r[1]), b = ri(c.r[0], c.r[1]), k = dau === '=' ? 0 : ri(2, c.kmax); if (a === b) continue; const hai = dau === '=' ? a + b : dau === '+' ? a + b + k : a + b - k; if (hai % 2) continue; const tb = hai / 2, X1 = dau === '=' ? tb : dau === '+' ? tb + k : tb - k; if (X1 <= 0 || X1 === a || X1 === b) continue; if (dau !== '=' && k < 0.05 * tb) continue   // phần chênh quá nhỏ ⇒ hai vạch dính nhau, sơ đồ không đọc được (Opus loại 4 sơ đồ 24/10)
      return { c, a, b, k } } },
    dung({ c, a, b, k }) {
      const hai = dau === '=' ? a + b : dau === '+' ? a + b + k : a + b - k, tb = hai / 2, X1 = dau === '=' ? tb : dau === '+' ? tb + k : tb - k, tongBa = tb * 3
      const [n1, n2] = c.ng, x = c.x, hoi = hoiLoai === 'x' ? c.hoiX : c.hoiT
      const quanHe = dau === '=' ? `${cap(c.dn)} của ${x} bằng ${c.tbc}.` : `${cap(c.dn)} của ${x} ${dauChu(dau)} ${c.tbc} là ${k} ${c.dv}.`
      const de = `${cap(n1)} ${c.hanh(a)}, ${n2} ${c.hanh(b)}. ${quanHe} ${hoi}`
      const sd = soDoTBC({ tbc: tb, n: 3, k, dau: dau === '=' ? null : dau, nhanX: cap(x), nhanY: `${cap(n1)} và ${n2}`, hoi: hoiLoai === 'x' ? undefined : 'Trung bình cộng', ghiY: `${a} + ${b} = ${a + b}`, ghiTB: hoiLoai === 'x' ? undefined : '× 3 = tổng cả ba' })
      const ans = hoiLoai === 'x' ? X1 : tongBa
      const mauChot = dau === '=' ? `${cap(x)} bằng trung bình cộng nên hai số còn lại bù cho nhau: hai lần trung bình cộng bằng tổng của hai số còn lại.` : dau === '+' ? `${cap(x)} nhiều hơn trung bình cộng ${k} nên hai số còn lại phải kém đúng phần đó: hai lần trung bình cộng bằng tổng hai số còn lại CỘNG ${k}.` : `${cap(x)} ít hơn trung bình cộng ${k} nên hai số còn lại phải hơn đúng phần đó: hai lần trung bình cộng bằng tổng hai số còn lại TRỪ ${k}.`
      const buoc = [`Vẽ sơ đồ: trung bình cộng là $1$ đoạn; ${x} là $1$ đoạn${dau === '=' ? '' : dau === '+' ? `, thêm ${k}` : `, bớt ${k}`}; ${n1} và ${n2} cộng lại là $2$ đoạn${dau === '=' ? '' : dau === '+' ? `, bớt ${k}` : `, thêm ${k}`}.`,
        `Tính hai lần trung bình cộng: ${dau === '=' ? `${a} cộng ${b}` : `${a} cộng ${b} ${dau === '+' ? 'cộng' : 'trừ'} ${k}`}.`, `Chia đôi để được trung bình cộng của ba số.`,
        hoiLoai === 'x' ? (dau === '=' ? `Số cần tìm chính là trung bình cộng.` : `Tìm số của ${x}: trung bình cộng ${dau === '+' ? 'cộng' : 'trừ'} ${k}.`) : `Nhân trung bình cộng với $3$ để được tổng của cả ba số.`]
      const p2 = ['Bài giải', 'Ta có sơ đồ:', `Hai lần ${c.tbc} là: ${m$(`${a}+${b}${dau === '=' ? '' : (dau === '+' ? '+' : '-') + k}=${hai}`)}`, `${cap(c.tbc)} là: ${m$(`${hai}:2=${tb}`)}`]
      if (hoiLoai === 'x') p2.push(dau === '=' ? `${cap(c.dn)} của ${x} là ${m$(tb)}.` : `${cap(c.dn)} của ${x} là: ${m$(`${tb}${dau === '+' ? '+' : '-'}${k}=${X1}`)}`)
      else p2.push(`Tổng của cả ba là: ${m$(`${tb}${X}3=${tongBa}`)}`)
      p2.push(`Đáp số: ${m$(ans)} ${c.dv}`)
      return { noi_dung: de, dap_an: `${m$(ans)} ${c.dv}`, so_do: sd, loi_giai: lg({ mau_chot: mauChot, buoc, chu_y: dau === '=' ? `Hỏi số của ${x} thì kết quả chính là trung bình cộng; hỏi cả ba thì phải nhân thêm $3$.` : `"${dauChu(dau)}" thì ${dau === '+' ? 'CỘNG' : 'TRỪ'} ${k} khi tính hai lần trung bình cộng${hoiLoai === 'x' ? ` và khi tìm số của ${x}` : ''}.`, p2 }) }
    } })
}
mauBa('=', 'NDB01592', G(285), 26, 'bang-tbc-x', 'x')
mauBa('=', 'NDB01592', G(299), 21, 'bang-tbc-tong', 't')
mauBa('+', 'NDB01593', G(286), 23, 'hon-tbc-x', 'x')
mauBa('+', 'NDB01593', G(286), 23, 'hon-tbc-tong', 't')
mauBa('-', 'NDB01594', G(287), 24, 'kem-tbc-x', 'x')
mauBa('-', 'NDB01594', G(287), 23, 'kem-tbc-tong', 't')

/** viết hoa chữ cái đầu mỗi câu trong đề */
const hoaCau = (s) => s.replace(/(^|[.?!]\s+)(\p{Ll})/gu, (_, a, b) => a + b.toUpperCase())

/** co[NDB] = số câu đang có trong dạng (gốc đã gán). Trả { lo, bao }. */
export function sinhTBC({ co = {}, muc = 50, seed = 20261024 } = {}) {
  R = taoRnd(seed)
  const lo = [], bao = []
  const dangs = [...new Set(MAU.map((m) => m.dang))]
  for (const dang of dangs) {
    const can = Math.max(0, muc - (co[dang] ?? 0)); if (!can) { bao.push(`${dang}: đã đủ`); continue }
    const maus = MAU.filter((m) => m.dang === dang), tongPt = maus.reduce((s, m) => s + m.pt, 0)
    const hang = maus.map((m) => ({ m, can: Math.round((m.pt / tongPt) * can), n: 0 }))
    hang[0].can += can - hang.reduce((s, h) => s + h.can, 0)
    const daCo = new Set(), dapSo = new Map()
    for (const h of hang) {
      let thu = 0
      while (h.n < h.can && thu < 4000) {
        thu++
        let c
        try { c = h.m.dung(h.m.tham()) } catch (e) { bao.push(`${dang}/${h.m.ten}: ${e.message}`); thu += 50; continue }
        c.noi_dung = hoaCau(c.noi_dung)
        const k = chuanDe(c.noi_dung); if (daCo.has(k)) continue
        const dk = `${h.m.ten}|${c.dap_an}`, lap = dapSo.get(dk) || 0; if (lap >= 2 && thu < 1500) continue
        daCo.add(k); dapSo.set(dk, lap + 1); h.n++
        lo.push({ dang, parent: h.m.parent, mau: h.m.ten, loai_cau: 'tra_loi_ngan', so_do: c.so_do ?? null, noi_dung: c.noi_dung, dap_an: c.dap_an, loi_giai: c.loi_giai })
      }
    }
    const tongSinh = hang.reduce((s, h) => s + h.n, 0)
    bao.push(`${dang}: có ${co[dang] ?? 0} · cần ${can} · sinh ${tongSinh}${tongSinh < can ? ' ⚠ THIẾU' : ''} — ${hang.map((h) => `${h.m.ten} ${h.n}/${h.can}`).join(' · ')}`)
  }
  return { lo, bao }
}
