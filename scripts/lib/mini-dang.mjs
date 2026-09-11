// MINI-SOLVER cho 3 dạng KHÔNG khớp khuôn "biểu thức LaTeX → AST" của mcq-auto.mjs — mỗi dạng 1 hình dạng đề
// văn bản RIÊNG (không phải công thức toán chung), nên đọc bằng regex trên câu chữ thay vì tokenize/parse.
// Dùng CHUNG kiểu Rat {p,q} BigInt với mcq-auto.mjs (không import qua lại — copy 6 hàm cơ bản, giữ ĐỘC LẬP
// để không dính vòng import; 2 file cùng 1 quy ước `texR`/`fmtV` nên format số giữ nhất quán).

const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] } return a }
export const R = (p, q = 1n) => { if (q === 0n) return null; if (q < 0n) { p = -p; q = -q } const g = gcd(p, q) || 1n; return { p: p / g, q: q / g } }
const add = (a, b) => R(a.p * b.q + b.p * a.q, a.q * b.q)
const sub = (a, b) => R(a.p * b.q - b.p * a.q, a.q * b.q)
const mul = (a, b) => R(a.p * b.p, a.q * b.q)
const div = (a, b) => (b.p === 0n ? null : R(a.p * b.q, a.q * b.p))
const cmp = (a, b) => { const l = a.p * b.q, r = b.p * a.q; return l < r ? -1 : l > r ? 1 : 0 }
const floorDiv = (a, b) => { let q = a / b, r = a % b; if (r !== 0n && (r < 0n) !== (b < 0n)) q -= 1n; return q } // b > 0n
const roundHalfUp = (v) => floorDiv(2n * v.p + v.q, 2n * v.q) // Rat v ⇒ BigInt gần nhất, ,5 làm tròn LÊN (quy ước VN)

// ── DẠNG 1: Viết STP vô hạn tuần hoàn thành phân số tối giản (07702011103) ──────────────────────────────────
// A = N,ABC(DEF) — N phần nguyên, ABC KHÔNG lặp (p chữ số, có thể rỗng), DEF lặp (q chữ số).
// Công thức: A = [int(N‖ABC‖DEF) − int(N‖ABC)] / [10^p·(10^q−1)]. (Nhân A với 10^(p+q) rồi trừ 10^p·A, SGK.)
const texR = (r) => r.q === 1n ? `${r.p}` : `${r.p < 0n ? '-' : ''}\\dfrac{${r.p < 0n ? -r.p : r.p}}{${r.q}}`
export function tinhTuanHoan(raw, rule) {
  let s = String(raw ?? '').replace(/\\left|\\right/g, '').replace(/\s+/g, '').trim()
  // raw có thể là NGUYÊN CÂU ("Viết STP … $2,(7)$ dưới dạng …") — trích đúng đoạn $…$ chứa dấu ( ) trước khi khớp.
  const inDollar = s.match(/\$(-?\d+,\d*\(\d+\))\$/)
  s = (inDollar ? inDollar[1] : s).replace(/\$/g, '')
  const m = s.match(/^(-?)(\d+),(\d*)\((\d+)\)$/)
  if (!m) return null
  const [, dau, whole, nonrep, rep] = m
  const p = nonrep.length, q = rep.length
  let numer, denom, ds = null
  if (rule === 'R38') { // coi CẢ phần thập phân tuần hoàn từ đầu — bỏ qua ABC không lặp, ghép ABC+DEF làm 1 chu kì
    if (p === 0) return null // p=0 thì y hệt cách đúng, không phải đường sai riêng — bỏ, không sinh trùng
    numer = BigInt(whole + nonrep + rep) - BigInt(whole); denom = 10n ** BigInt(p + q) - 1n
    ds = `coi ${dau}${whole},(${nonrep}${rep}) tuần hoàn từ đầu, bỏ qua ${nonrep} không lặp`
  } else if (rule === 'R39') { // quên nhân thêm 10^p ở mẫu — mẫu chỉ còn q chữ số 9
    if (p === 0) return null
    numer = BigInt(whole + nonrep + rep) - BigInt(whole + nonrep)
    denom = 10n ** BigInt(q) - 1n
    ds = `quên nhân thêm 10^${p} vào mẫu, mẫu chỉ còn ${q} chữ số 9`
  } else if (rule === 'R40') { // quên cộng phần nguyên — chỉ tính phần thập phân, coi như N=0
    if (whole === '0') return null // N=0 sẵn thì y hệt cách đúng
    numer = BigInt((nonrep || '0') + rep) - BigInt(nonrep || '0'); denom = 10n ** BigInt(p) * (10n ** BigInt(q) - 1n)
    ds = `quên cộng phần nguyên ${whole}, chỉ tính phần thập phân tuần hoàn`
  } else if (rule === 'R50') { // SAI MẪU — dùng 10^q (luỹ thừa trơn) thay vì 10^q−1 (dãy số 9) — áp được MỌI câu
    numer = BigInt(whole + nonrep + rep) - BigInt(whole + nonrep); denom = 10n ** BigInt(p + q)
    ds = `dùng mẫu 10^${p + q} thay vì 10^${p + q}−1 (quên trừ 1, không phải dãy số 9)`
  } else if (rule === 'R04') { // TÁI DÙNG R04 có sẵn trong catalog ("lấy dấu kết quả sai") — đảo thứ tự phép trừ 10A−A.
    numer = BigInt(whole + nonrep) - BigInt(whole + nonrep + rep); denom = 10n ** BigInt(p) * (10n ** BigInt(q) - 1n)
    ds = 'lấy dấu kết quả sai — trừ ngược A − 10A thay vì 10A − A'
  } else {
    numer = BigInt(whole + nonrep + rep) - BigInt(whole + nonrep)
    denom = 10n ** BigInt(p) * (10n ** BigInt(q) - 1n)
  }
  const v = R(dau === '-' ? -numer : numer, denom)
  return v ? { value: v, text: `$${texR(v)}$`, ds } : null
}

// ── DẠNG 2: Làm tròn số thập phân (0770201102) — 2 kiểu đề ──────────────────────────────────────────────────
const ORD = { 'nhất': 1, 'hai': 2, 'ba': 3, 'tư': 4, 'bốn': 4, 'năm': 5 }
function nguonSo(raw, rule) { // số nguồn: hoặc thập phân thường, hoặc tuần hoàn (…) — rule R38/R39/R40 CHỈ áp cho phần này
  const s = String(raw).trim()
  if (/\(/.test(s)) { const r = tinhTuanHoan(s, ['R38', 'R39', 'R40', 'R50', 'R04'].includes(rule) ? rule : null); return r ? r.value : null }
  const m = s.replace(/\$/g, '').match(/^(-?)(\d+)(?:[.,](\d+))?$/)
  if (!m) return null
  const [, dau, whole, frac] = m
  const v = frac ? R(BigInt(whole + frac), 10n ** BigInt(frac.length)) : R(BigInt(whole))
  return dau === '-' ? R(-v.p, v.q) : v
}
function tronToiBuoc(value, step, rule) { // làm tròn value theo bước step — rule R43/R44/R48 là ĐƯỜNG SAI ở BƯỚC LÀM TRÒN
  if (!value || !step || step.p <= 0n) return null
  if (rule === 'R43') { // chặt cụt (bỏ đi) thay vì làm tròn — luôn về phía 0 (value ≥0 đúng hết dữ liệu dạng này)
    const q = floorDiv(value.p * step.q, value.q * step.p)
    return mul(R(q), step)
  }
  if (rule === 'R48') { // luôn làm tròn LÊN bất kể chữ số kế tiếp — ceil(value/step) = −floor(−value/step)
    const q = -floorDiv(-(value.p * step.q), value.q * step.p)
    return mul(R(q), step)
  }
  const n = roundHalfUp(div(value, step))
  return mul(R(n), step)
}
// places để HIỂN THỊ (không phải bước làm tròn) — số chữ số thập phân NHỎ NHẤT để biểu diễn step ĐÚNG (tìm k
// nhỏ nhất sao cho step.q chia hết 10^k). CẤM lấy "số chữ số của q" — sai khi q không phải luỹ thừa 10 (vd
// step=0,05 rút gọn còn q=20=2²·5, cần 2 chữ số chứ không phải 1 — bug thật đã bắt được lúc verify FAIL).
function placesOfStep(step) { for (let k = 0; k <= 10; k++) if (10n ** BigInt(k) % step.q === 0n) return k; return 10 }
export function fmtFixed(rat, places) {
  const scale = 10n ** BigInt(Math.max(places, 0))
  const neg = rat.p < 0n; const num = neg ? -rat.p : rat.p
  const k = (num * scale) / rat.q
  let s = k.toString().padStart(places + 1, '0')
  const out = places > 0 ? s.slice(0, -places) + ',' + s.slice(-places) : s
  return (neg ? '-' : '') + out
}
const DS_NGUON = { R38: 'coi cả phần thập phân tuần hoàn từ đầu, bỏ qua phần không lặp', R39: 'quên nhân thêm 10^p vào mẫu khi đổi số nguồn ra phân số', R40: 'quên cộng phần nguyên của số nguồn khi đổi ra phân số', R50: 'sai mẫu khi đổi số nguồn ra phân số, dùng 10^q thay vì 10^q−1', R04: 'lấy dấu kết quả sai khi đổi số nguồn tuần hoàn ra phân số' }
export function layTron(noiDung, rule) {
  const s = String(noiDung)
  const srcRule = ['R38', 'R39', 'R40', 'R50', 'R04'].includes(rule) ? rule : null
  let m = s.match(/Làm tròn số\s*\$?(-?[\d.,()]+)\$?\s*đến chữ số thập phân thứ\s*(\S+?)[.\s]*$/)
  if (m) {
    const N = ORD[m[2].replace(/[.$]/g, '')]; if (!N) return null
    // R42: LỆCH VỊ TRÍ — làm tròn đến N−1 chữ số (đếm THIẾU 1 chữ số) thay vì đúng N.
    // R49: LỆCH VỊ TRÍ ngược — làm tròn đến N+1 chữ số (đếm THỪA 1 chữ số). Cần cả 2 chiều: R43("luôn xuống")
    // và R48("luôn lên") LUÔN có đúng 1 cái trùng đáp án đúng (tuỳ chữ số kế tiếp ≥5 hay <5) — chỉ 1 trong 2 dùng
    // được mỗi câu, không đủ 3 nếu không có R49 làm trục ĐỘC LẬP thứ ba (lệch VỊ TRÍ, không lệch HƯỚNG).
    const dungN = rule === 'R42' ? Math.max(0, N - 1) : rule === 'R49' ? N + 1 : N
    const src = nguonSo(m[1], srcRule); if (!src) return null
    const step = R(1n, 10n ** BigInt(dungN))
    const v = tronToiBuoc(src, step, rule); if (!v) return null
    let ds = srcRule ? DS_NGUON[srcRule] : rule === 'R42' ? `đếm thiếu 1 chữ số, làm tròn đến chữ số thập phân thứ ${dungN} thay vì thứ ${N}` : rule === 'R49' ? `đếm thừa 1 chữ số, làm tròn đến chữ số thập phân thứ ${dungN} thay vì thứ ${N}` : rule === 'R43' ? `cứ bỏ đi (chặt cụt) phần thừa thay vì so sánh với 5 để làm tròn` : rule === 'R48' ? `cứ làm tròn LÊN bất kể chữ số kế tiếp là gì` : null
    return { value: v, text: `$${fmtFixed(v, dungN)}$`, ds }
  }
  m = s.match(/Làm tròn số\s*\$?(-?[\d.,()]+)\$?\s*với độ chính xác\s*\$?([\d.,]+)\$?/)
  if (m) {
    const dm = m[2].match(/^(\d+)(?:[.,](\d+))?$/); if (!dm) return null
    const d = dm[2] ? R(BigInt(dm[1] + dm[2]), 10n ** BigInt(dm[2].length)) : R(BigInt(dm[1]))
    const dungBuoc = mul(d, R(2n))
    // R44: HIỂU SAI "độ chính xác d" — coi là làm tròn tới CHÍNH d (bước = d), đúng ra bước = 2d.
    const step = rule === 'R44' ? d : dungBuoc
    const src = nguonSo(m[1], srcRule); if (!src) return null
    const v = tronToiBuoc(src, step, rule); if (!v) return null
    const places = placesOfStep(step)
    let ds = srcRule ? DS_NGUON[srcRule] : rule === 'R43' ? 'cứ bỏ đi (chặt cụt) phần thừa thay vì làm tròn' : rule === 'R44' ? `hiểu "độ chính xác ${m[2]}" là làm tròn tới chính ${m[2]}, không nhân đôi bước làm tròn` : rule === 'R48' ? `cứ làm tròn LÊN bất kể phần dư là bao nhiêu` : null
    return { value: v, text: `$${fmtFixed(v, places)}$`, ds }
  }
  return null
}

// ── DẠNG 3: So sánh — "Tìm số nguyên x,y biết A OP x/d1 OP y/d2 OP B" (T107010103, chỉ nhánh có x,y nguyên) ──
export function soSanhTimXY(noiDung, rule) {
  const s = String(noiDung)
  const TOK = /\\dfrac\{(-?\d+|x|y)\}\{(\d+)\}/g
  const terms = []; let mm
  while ((mm = TOK.exec(s))) terms.push({ num: mm[1], den: BigInt(mm[2]) })
  if (terms.length !== 4 || terms[1].num !== 'x' || terms[2].num !== 'y') return null
  const ops = (s.match(/[<>]/g) || [])
  if (ops.length < 3 || !ops.every((o) => o === ops[0])) return null
  const lt = ops[0] === '<'
  const lcm = (a, b) => a / gcd(a, b) * b
  const L = [terms[0].den, terms[1].den, terms[2].den, terms[3].den].reduce(lcm, 1n)
  const boundL = BigInt(terms[0].num) * (L / terms[0].den)
  const boundR = BigInt(terms[3].num) * (L / terms[3].den)
  let coefX = L / terms[1].den
  let coefY = L / terms[2].den
  if (rule === 'R45') { if (terms[1].den === terms[2].den) return null; coefY = coefX } // quy đồng sai: lấy nhầm mẫu x cho cả y
  // Duyệt x,y nguyên trong khoảng suy từ 2 cận (đủ rộng, dữ liệu dạng này luôn nhỏ).
  const lo = -(boundL < 0n ? -boundL : boundL) / (coefX < coefY ? coefX : coefY) - 5n
  const hi = (boundR < 0n ? -boundR : boundR) / (coefX < coefY ? coefX : coefY) + 5n
  const sols = []
  for (let x = lo; x <= hi; x++) {
    const vx = coefX * x
    if (lt ? !(boundL < vx) : !(boundL > vx)) continue
    for (let y = lo; y <= hi; y++) {
      const vy = coefY * y
      if (lt ? (vx < vy && vy < boundR) : (vx > vy && vy > boundR)) sols.push([x, y])
    }
  }
  if (rule === 'R51' && (boundL % coefX !== 0n || boundR % coefY !== 0n)) return null // cận không chia hết cho hệ số ⇒ không "đọc thẳng" được số nguyên, bỏ
  if (sols.length !== 1 && rule !== 'R51') return null
  let x, y, ds = null
  if (rule === 'R51') { x = boundL / coefX; y = boundR / coefY; ds = 'lấy thẳng 2 số ở đầu và cuối bất đẳng thức làm x,y, không tìm số nguyên ở giữa' }
  else { [x, y] = sols[0] }
  if (rule === 'R45') ds = 'quy đồng sai — dùng nhầm mẫu số của x cho cả y'
  if (rule === 'R46') { x += 1n; y += 1n; ds = 'liệt kê lố lên 1 số nguyên' } // lấy lố lên 1 đơn vị nguyên
  if (rule === 'R47') { x -= 1n; y -= 1n; ds = 'liệt kê lố xuống 1 số nguyên' } // lấy lố xuống 1 đơn vị nguyên
  return { value: [R(x), R(y)], ds }
}

// ── DẠNG 4: Phân tích 1 số ra thừa số nguyên tố (T106030302) — ĐÁP SỐ LÀ BIỂU THỨC, không phải 1 giá trị ─────
// So khớp đúng/sai của dạng này phải so TEXT chuẩn hoá (không phải giá trị số) — R54 "chưa phân tích hết" cố ý
// giữ NGUYÊN giá trị số (12·11 = 132 = 2²·3·11) nhưng SAI HÌNH THỨC (12 không phải số nguyên tố) — nếu so bằng
// giá trị sẽ bị coi là trùng đáp án đúng. Vì vậy KHÔNG dùng chung `value:Rat` với các dạng kia — trả thẳng {text}.
export function chuanHoaFactorText(s) {
  return String(s ?? '').replace(/\$/g, '').replace(/\\left|\\right/g, '').replace(/\s+/g, '').trim()
}
// Giá trị SỐ của 1 biểu thức "p^e·p^e·…" — dùng để KIỂM TRA (đúng phải = N), không dùng để so trùng/khác.
export function evalFactorText(s) {
  const terms = chuanHoaFactorText(s).split(/\\cdot|\*|×/).filter(Boolean)
  let val = 1n
  for (const t of terms) {
    const m = t.match(/^(\d+)(?:\^\{?(\d+)\}?)?$/); if (!m) return null
    const base = BigInt(m[1]), exp = m[2] ? Number(m[2]) : 1
    if (exp < 1 || exp > 30) return null
    let p = 1n; for (let i = 0; i < exp; i++) p *= base
    val *= p
  }
  return val > 0n ? val : null
}
function phanTichThat(N) { // N: BigInt dương → [[prime,exp], …] tăng dần theo prime — trial division, N nhỏ (lớp 6)
  const out = []; let n = N, p = 2n
  while (p * p <= n) { let e = 0; while (n % p === 0n) { n /= p; e++ } if (e > 0) out.push([p, e]); p += (p === 2n ? 1n : 2n) }
  if (n > 1n) out.push([n, 1])
  return out
}
function isPrime(n) { if (n < 2n) return false; for (let p = 2n; p * p <= n; p++) if (n % p === 0n) return false; return true }
function nextPrime(n) { let p = n + 1n; while (!isPrime(p)) p++; return p }
function fmtFactor(pairs) { return pairs.map(([p, e]) => (e > 1 ? `${p}^${e}` : `${p}`)).join('\\cdot ') }
export function phanTichNguyenTo(noiDung, rule) {
  const m = String(noiDung).match(/Phân tích\s*\$?(\d+)\$?\s*ra thừa số nguyên tố/); if (!m) return null
  const N = BigInt(m[1])
  const dung = phanTichThat(N); if (!dung.length) return null
  if (!rule) return { text: `$${fmtFactor(dung)}$` }
  if (rule === 'R53' && dung.length) { // nhầm số mũ — +1/-1 ở thừa số CÓ exp>1 (ưu tiên), không có thì bơm exp thừa số đầu lên 2
    const cp = dung.map((x) => [...x]); let i = cp.findIndex((x) => x[1] > 1)
    if (i < 0) { i = 0; cp[i][1] += 1 } else cp[i][1] -= 1
    if (cp[i][1] < 1) return null
    return { text: `$${fmtFactor(cp)}$`, ds: `sai số mũ của ${cp[i][0]}: đúng phải là ${dung[i][0]}^${dung[i][1]}` }
  }
  if (rule === 'R54') { // chưa phân tích hết — gộp 2 thừa số nhỏ nhất (hoặc tách đôi số mũ) thành 1 hợp số chưa rút gọn tiếp, GIÁ TRỊ VẪN = N
    if (dung.length >= 2) {
      const [p1, e1] = dung[0], [p2, e2] = dung[1]
      let v = 1n; for (let i = 0; i < e1; i++) v *= p1; v *= p2
      const parts = [...dung.slice(2), ...(e2 > 1 ? [[p2, e2 - 1]] : [])]
      const text = parts.length ? `${v}\\cdot ${fmtFactor(parts)}` : `${v}`
      return { text: `$${text}$`, ds: `${v} chưa phải số nguyên tố, chưa phân tích tiếp thành ${p1}^${e1}\\cdot ${p2}` }
    }
    const [p, e] = dung[0]; if (e < 2) return null
    // gộp TỪNG CẶP p thành 1 hợp số v=p² (giữ giá trị: v^floor(e/2) · phần dư lẻ nếu e lẻ) — KHÔNG chia đôi số mũ
    // (bug cũ: e1·e2 phải bằng e, không phải e1+e2=e — vd 2^8 chia đôi số mũ ra "16^4" thì SAI giá trị 65536).
    const v = p * p, e2 = Math.floor(e / 2), le = e % 2
    const text = le ? `${v}^${e2}\\cdot ${p}` : `${v}^${e2}`
    return { text: `$${text}$`, ds: `${v} chưa phải số nguyên tố, chưa phân tích tiếp thành ${p}^2` }
  }
  if (rule === 'R55' && dung.length >= 2) { // bỏ sót 1 thừa số (thừa số CUỐI, prime lớn nhất) — sai giá trị
    const bo = dung[dung.length - 1]
    return { text: `$${fmtFactor(dung.slice(0, -1))}$`, ds: `bỏ sót thừa số ${bo[0]}${bo[1] > 1 ? `^${bo[1]}` : ''}` }
  }
  if (rule === 'R56') { // nhầm 1 thừa số nguyên tố khác (thừa số ĐẦU, prime nhỏ nhất) sang số nguyên tố kế tiếp — sai giá trị
    const cp = dung.map((x) => [...x]); const old = cp[0][0]; cp[0][0] = nextPrime(old)
    return { text: `$${fmtFactor(cp)}$`, ds: `nhầm thừa số ${old} thành ${cp[0][0]} (số nguyên tố kế tiếp)` }
  }
  return null
}

// ── DẠNG 5: Nhận biết Số nguyên tố / Hợp số trong 1 danh sách (T106030301) — ĐÁP SỐ LÀ TẬP HỢP SỐ (vd
// "2; 5; 23; 41; 47"), không phải 1 giá trị hay 1 biểu thức — so khớp bằng TEXT chuẩn hoá riêng (KHÔNG dùng
// chuanHoaFactorText/evalFactorText của DẠNG 4 — cú pháp \cdot không áp dụng ở đây). Thùy chốt 11/09: vẫn 4 đáp
// án, đề xuất thêm ngoài 2 kiểu Thùy nêu (nhầm 0/1, lẫn số khác nhóm) → thêm "bỏ sót" và "đổi chỗ" (bốn rule ĐỘC
// LẬP về mặt cơ chế nên luôn ra 4 kết quả khác nhau, không vi phạm luật "3 distractor phải 3 rule khác nhau").
function laSoNguyenTo(n) { if (n < 2) return false; for (let p = 2; p * p <= n; p++) if (n % p === 0) return false; return true }
function nhomCua(n) { return n < 2 ? 'khac' : (laSoNguyenTo(n) ? 'nt' : 'hop') } // 0 và 1: không nguyên tố, không hợp số
export function chuanHoaTapText(s) {
  return String(s ?? '').replace(/\$/g, '').split(';').map((x) => x.trim()).filter(Boolean).map(Number).filter((n) => Number.isFinite(n)).sort((a, b) => a - b).join('; ')
}
// "Giá trị" của 1 tập — với dạng này KHÔNG có khái niệm "cùng giá trị khác hình" (không như R54 của DẠNG 4),
// nên chính TEXT chuẩn hoá đã LÀ giá trị so sánh; trả null nếu không parse được (rỗng/không phải số).
export function evalTapText(s) {
  const t = chuanHoaTapText(s); return t ? t : null
}
export function nhanBietNguyenToHopSo(noiDung, rule) {
  const mNt = String(noiDung).match(/là\s*Số nguyên tố:\s*\$?([^$]+)\$?/)
  const mHop = String(noiDung).match(/là\s*Hợp số:\s*\$?([^$]+)\$?/)
  const isNt = !!mNt; const listStr = mNt?.[1] ?? mHop?.[1]; if (!listStr) return null
  const nums = listStr.split(';').map((s) => Number(s.trim())).filter((n) => Number.isFinite(n)); if (!nums.length) return null
  const target = isNt ? 'nt' : 'hop'
  const dung = nums.filter((n) => nhomCua(n) === target).sort((a, b) => a - b); if (!dung.length) return null
  if (!rule) return { text: dung.join('; ') }
  const khac = [...new Set(nums.filter((n) => nhomCua(n) === 'khac'))].sort((a, b) => a - b)
  const wrongCands = [...new Set(nums.filter((n) => nhomCua(n) !== target && nhomCua(n) !== 'khac'))].sort((a, b) => a - b)
  const nhanTen = (x) => (target === 'nt' ? 'số nguyên tố' : 'hợp số')
  const nhanNguoc = (x) => (target === 'nt' ? 'hợp số' : 'số nguyên tố')
  if (rule === 'R57') { // nhầm 0 hoặc 1 (không nguyên tố cũng không hợp số) là nguyên tố/hợp số — lỗi kinh điển nhất
    if (!khac.length) return null
    const k = khac.includes(1) ? 1 : khac[0]
    const cp = [...new Set([...dung, k])].sort((a, b) => a - b)
    return { text: cp.join('; '), ds: `nhầm ${k} là ${nhanTen(k)} — thực ra ${k} không phải số nguyên tố cũng không phải hợp số` }
  }
  if (rule === 'R58') { // lẫn 1 số thuộc nhóm ngược lại vào danh sách (giữ nguyên tất cả số đúng, thêm nhầm 1 số sai)
    if (!wrongCands.length) return null
    const w = wrongCands[0]
    const cp = [...new Set([...dung, w])].sort((a, b) => a - b)
    return { text: cp.join('; '), ds: `nhầm ${w} là ${nhanTen(w)} — thực ra ${w} là ${nhanNguoc(w)}` }
  }
  if (rule === 'R59') { // bỏ sót 1 số đúng trong danh sách (quên chưa xét hết, thường sót số LỚN nhất)
    if (dung.length < 2) return null
    const bo = dung[dung.length - 1]
    return { text: dung.slice(0, -1).join('; '), ds: `bỏ sót ${bo}, quên chưa liệt kê hết ${nhanTen(bo)} trong danh sách` }
  }
  if (rule === 'R60') { // đổi chỗ: bỏ 1 số đúng, lẫn 1 số sai khác vào (khác wrongCands[0] của R58 nếu có thể)
    if (!wrongCands.length) return null
    const w = wrongCands.length > 1 ? wrongCands[wrongCands.length - 1] : wrongCands[0]
    const bo = dung[0]
    const cp = [...new Set([...dung.slice(1), w])].sort((a, b) => a - b)
    if (!cp.length) return null
    return { text: cp.join('; '), ds: `nhầm ${bo} không thuộc nhóm này (bỏ sót), lại nhầm ${w} là ${nhanTen(w)} — thực ra ${w} là ${nhanNguoc(w)}` }
  }
  if (rule === 'R61') { // liệt kê TUỐT cả danh sách gốc, không lọc gì — cứu các câu đáp đúng chỉ 1 số (R57/R59 không áp dụng)
    if (nums.length <= dung.length) return null
    const cp = [...new Set(nums)].sort((a, b) => a - b)
    return { text: cp.join('; '), ds: 'liệt kê tuốt cả danh sách đề bài, không lọc số nào — quên phân loại' }
  }
  return null
}

// ── DẠNG 6: ƯCLN/BCNN (T106040102/202 — 1 giá trị; T106040104/204 — trộn 1 giá trị + tập ước/bội trong khoảng) ──
// T106040102/202 luôn ra 1 SỐ (đi qua SPECIAL_DANG/parseHuuTi như thường). T106040104/204 trộn 2 kiểu đề trong
// CÙNG 1 dạng: "n lớn nhất/nhỏ nhất" → 1 số; "n biết ... và n<C / C<n<D" → TẬP ước/bội thoả khoảng — vì 1 dạng chỉ
// dispatch qua 1 nhánh (TEXT_DANG hoặc SPECIAL_DANG), dùng TEXT_DANG cho cả 2 (1 số = tập 1 phần tử, vẫn hợp lệ
// qua chuanHoaTapText). T106040104 luôn chiều ƯCLN (n | A, n | B), T106040204 luôn chiều BCNN (A | n, B | n, C | n).
function gcdLcmFactor(nums, op) { // nums: BigInt[] → { value, factors:[[p,e],...] tăng dần theo prime }
  const facts = nums.map((n) => new Map(phanTichThat(n)))
  const primes = [...new Set(facts.flatMap((f) => [...f.keys()]))].sort((a, b) => (a < b ? -1 : 1))
  const factors = []
  for (const p of primes) {
    const es = facts.map((f) => Number(f.get(p) ?? 0))
    const e = op === 'ucln' ? Math.min(...es) : Math.max(...es)
    if (e > 0) factors.push([p, e])
  }
  let value = 1n; for (const [p, e] of factors) for (let k = 0; k < e; k++) value *= p
  return { value, factors }
}
function uocCua(n) { // BigInt n>0 → mọi ước, tăng dần
  const out = []
  for (let i = 1n; i * i <= n; i++) { if (n % i === 0n) { out.push(i); if (i !== n / i) out.push(n / i) } }
  return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0))
}
function boiTrongKhoang(n, lo, hi) { // bội dương của n (BigInt, n>0) trong khoảng MỞ (lo,hi)
  const out = []; for (let v = n; v < hi; v += n) if (v > lo) out.push(v); return out
}
// R62-R65: rule cho câu ĐÁP SỐ = 1 GIÁ TRỊ (T106040102/202, và sub-shape "lớn nhất/nhỏ nhất" của 104/204).
function uclnBcnnRule(op, nums, trueValue, trueFactors, rule) {
  if (rule === 'R62') { // nhầm ƯCLN <-> BCNN — tính ngược khái niệm
    const opp = op === 'ucln' ? 'bcnn' : 'ucln'
    const { value } = gcdLcmFactor(nums, opp)
    if (value === trueValue || value <= 0n) return null
    return { value, ds: `nhầm ${op === 'ucln' ? 'ƯCLN' : 'BCNN'} thành ${op === 'ucln' ? 'BCNN' : 'ƯCLN'} — tính ngược khái niệm` }
  }
  if (rule === 'R63') { // sai quy tắc số mũ ở thừa số CHUNG (ƯCLN: lấy max thay vì min; BCNN: lấy min thay vì max)
    const facts = nums.map((n) => new Map(phanTichThat(n)))
    const primesAll = [...new Set(facts.flatMap((f) => [...f.keys()]))]
    const common = primesAll.filter((p) => facts.every((f) => (f.get(p) ?? 0) > 0))
    if (!common.length) return null
    let v = 1n
    if (op === 'ucln') { for (const p of common) { const e = Math.max(...facts.map((f) => Number(f.get(p)))); for (let k = 0; k < e; k++) v *= p } }
    else { for (const p of primesAll) { const es = facts.map((f) => Number(f.get(p) ?? 0)); const isCommon = es.every((e) => e > 0); const e = isCommon ? Math.min(...es) : Math.max(...es); if (e > 0) for (let k = 0; k < e; k++) v *= p } }
    if (v === trueValue || v <= 0n) return null
    return { value: v, ds: op === 'ucln' ? 'lấy số mũ LỚN NHẤT thay vì nhỏ nhất ở thừa số chung' : 'lấy số mũ NHỎ NHẤT thay vì lớn nhất ở thừa số chung' }
  }
  if (rule === 'R64') { // bỏ sót 1 thừa số (lớn nhất) khi nhân lại
    if (trueFactors.length < 2) return null
    const [pBo, eBo] = trueFactors[trueFactors.length - 1]
    let v = 1n; for (const [p, e] of trueFactors.slice(0, -1)) for (let k = 0; k < e; k++) v *= p
    if (v === trueValue || v <= 0n) return null
    return { value: v, ds: `bỏ sót thừa số ${pBo}${eBo > 1 ? `^${eBo}` : ''} khi nhân lại` }
  }
  if (rule === 'R65') { // BCNN: nhân trực tiếp các số với nhau, không rút gọn theo ước chung
    if (op !== 'bcnn') return null
    let v = 1n; for (const n of nums) v *= n
    if (v === trueValue) return null
    return { value: v, ds: 'nhân trực tiếp các số với nhau, không rút gọn theo ước chung' }
  }
  if (rule === 'R70') { // tính nhầm bằng hiệu 2 số — chỉ áp dụng câu 2 số (cứu các câu ƯCLN/BCNN chỉ có 1 thừa số chung)
    if (nums.length !== 2) return null
    const v = nums[0] > nums[1] ? nums[0] - nums[1] : nums[1] - nums[0]
    if (v === trueValue || v <= 0n) return null
    return { value: v, ds: 'tính nhầm bằng hiệu 2 số (a−b) thay vì phân tích thừa số nguyên tố' }
  }
  if (rule === 'R71') { // rule dự phòng: ƯCLN lấy nhầm ước chung nhỏ nhất (=1); BCNN lấy nhầm bội chung đầu liệt kê (=0)
    if (op === 'ucln') { if (trueValue === 1n) return null; return { value: 1n, ds: 'lấy nhầm ước chung NHỎ NHẤT (luôn bằng 1) thay vì lớn nhất' } }
    return { value: 0n, ds: 'lấy nhầm bội chung ĐẦU TIÊN khi liệt kê (0) thay vì bội chung nhỏ nhất khác 0' }
  }
  return null
}
function giaiDonGia(op, nums, rule) {
  const { value, factors } = gcdLcmFactor(nums, op)
  if (value <= 0n) return null
  if (!rule) return { text: value.toString() }
  const r = uclnBcnnRule(op, nums, value, factors, rule)
  return r ? { text: r.value.toString(), ds: r.ds } : null
}
// R66-R69: rule cho câu ĐÁP SỐ = TẬP ước/bội thoả khoảng (sub-shape "n<C"/"C<n<D" của 104/204).
function giaiTapKhoang(op, nums, lo, hi, rule) {
  const { value: coreVal } = gcdLcmFactor(nums, op)
  if (coreVal <= 0n) return null
  const dungArr = op === 'ucln' ? uocCua(coreVal).filter((v) => v > lo && v < hi) : boiTrongKhoang(coreVal, lo, hi)
  if (!dungArr.length) return null
  const dungText = dungArr.join('; ')
  if (!rule) return { text: dungText }
  if (rule === 'R66') { // sai ƯCLN/BCNN gốc (đảo khái niệm) rồi liệt kê lại theo khoảng
    const oppOp = op === 'ucln' ? 'bcnn' : 'ucln'
    const { value: wrongVal } = gcdLcmFactor(nums, oppOp)
    if (wrongVal <= 0n || wrongVal === coreVal) return null
    const wrongArr = oppOp === 'ucln' ? uocCua(wrongVal).filter((v) => v > lo && v < hi) : boiTrongKhoang(wrongVal, lo, hi)
    if (!wrongArr.length) return null
    const t = wrongArr.join('; '); if (t === dungText) return null
    return { text: t, ds: `nhầm ${op === 'ucln' ? 'ƯCLN' : 'BCNN'} thành ${op === 'ucln' ? 'BCNN' : 'ƯCLN'} rồi liệt kê theo khoảng` }
  }
  if (rule === 'R67') { // nhầm khoảng MỞ thành ĐÓNG — lấy thêm số ở biên nếu biên đúng là ước/bội thật
    const extra = []
    const laUocBoi = (x) => (op === 'ucln' ? (x > 0n && coreVal % x === 0n) : (x > 0n && x % coreVal === 0n))
    if (laUocBoi(lo) && !dungArr.includes(lo)) extra.push(lo)
    if (laUocBoi(hi) && !dungArr.includes(hi)) extra.push(hi)
    if (!extra.length) return null
    const t = [...dungArr, ...extra].sort((a, b) => (a < b ? -1 : 1)).join('; ')
    return { text: t, ds: `nhầm khoảng mở thành đóng — lấy thêm ${extra.join(', ')} ở biên` }
  }
  if (rule === 'R68') { // bỏ sót 1 phần tử đúng (phần tử lớn nhất trong khoảng)
    if (dungArr.length < 2) return null
    return { text: dungArr.slice(0, -1).join('; '), ds: `bỏ sót ${dungArr[dungArr.length - 1]}, liệt kê thiếu` }
  }
  if (rule === 'R69') { // quên áp điều kiện khoảng / quên xét đủ điều kiện chia hết
    if (op === 'ucln') {
      const t = uocCua(coreVal).join('; '); if (t === dungText) return null
      return { text: t, ds: 'tìm đúng ƯC nhưng quên lọc theo điều kiện khoảng của đề, liệt kê hết' }
    }
    if (nums.length < 3) return null // bỏ bớt 1 số cần đủ ≥3 số mới còn ý nghĩa (câu 2 số dùng R66/R67/R68 là đủ)
    const bo = nums[nums.length - 1]
    const { value: wrongVal } = gcdLcmFactor(nums.slice(0, -1), 'bcnn'); if (wrongVal <= 0n) return null
    const wrongArr = boiTrongKhoang(wrongVal, lo, hi); if (!wrongArr.length || wrongArr.length > 6) return null
    const t = wrongArr.join('; '); if (t === dungText) return null
    return { text: t, ds: `quên điều kiện chia hết cho ${bo}, chỉ xét BCNN của các số còn lại` }
  }
  if (rule === 'R72') { // nhầm sang kiểu "tìm 1 số duy nhất" (lớn nhất/nhỏ nhất) thay vì liệt kê CẢ tập thoả khoảng
    if (dungArr.length < 2) return null
    const one = op === 'ucln' ? dungArr[dungArr.length - 1] : dungArr[0]
    return { text: one.toString(), ds: `nhầm bài toán "liệt kê cả tập thoả khoảng" thành "tìm 1 số duy nhất" — chỉ chọn 1 phần tử` }
  }
  return null
}
export function uclnBcnnDinhNghia(noiDung, rule) { // T106040102/202: "Tìm UCLN/BCNN bằng định nghĩa/phân tích... của A[; B] và C."
  const m = String(noiDung).match(/(UCLN|BCNN)\s+bằng[^.]*?của\s+(.+?)\.\s*$/)
  if (!m) return null
  const op = m[1] === 'UCLN' ? 'ucln' : 'bcnn'
  const nums = [...m[2].matchAll(/\d+/g)].map((x) => BigInt(x[0]))
  if (nums.length < 2) return null
  const { value, factors } = gcdLcmFactor(nums, op)
  if (value <= 0n) return null
  if (!rule) return { value: R(value) }
  const r = uclnBcnnRule(op, nums, value, factors, rule)
  return r ? { value: R(r.value), ds: r.ds } : null
}
export function tapUcBc(noiDung, rule) { // T106040104/T106040204 — trộn "n lớn nhất/nhỏ nhất" (1 số) + "n<C"/"C<n<D" (tập)
  const nd = String(noiDung)
  let m = nd.match(/n\$?\s+lớn nhất sao cho\s+(.+?)\.\s*$/)
  if (m) { const nums = [...m[1].matchAll(/\d+/g)].map((x) => BigInt(x[0])); return nums.length >= 2 ? giaiDonGia('ucln', nums, rule) : null }
  m = nd.match(/n\$?\s+nhỏ nhất khác\s+\$?0\$?\s+biết rằng\s+(.+?)\.\s*$/)
  if (m) { const nums = [...m[1].matchAll(/\d+/g)].map((x) => BigInt(x[0])); return nums.length >= 2 ? giaiDonGia('bcnn', nums, rule) : null }
  m = nd.match(/n\$?\s+biết rằng\s+(.+?)\s+và\s+\$?n\s*<\s*(\d+)\$?\.\s*$/)
  if (m && /\\vdots\s*n/.test(m[1])) {
    const nums = [...m[1].matchAll(/\d+/g)].map((x) => BigInt(x[0]))
    return nums.length >= 2 ? giaiTapKhoang('ucln', nums, 0n, BigInt(m[2]), rule) : null
  }
  m = nd.match(/n\$?\s+biết rằng\s+(.+?)\s+và\s+\$?(\d+)\s*<\s*n\s*<\s*(\d+)\$?\.\s*$/)
  if (m) {
    const nums = [...m[1].matchAll(/\d+/g)].map((x) => BigInt(x[0]))
    if (nums.length < 2) return null
    if (/\\vdots\s*n/.test(m[1])) return giaiTapKhoang('ucln', nums, BigInt(m[2]), BigInt(m[3]), rule)
    if (/n\s*:/.test(m[1])) return giaiTapKhoang('bcnn', nums, BigInt(m[2]), BigInt(m[3]), rule)
  }
  return null
}

// ── DẠNG 7: Ước/Bội cơ bản của 1 SỐ (T106030101) — "5 bội đầu" / "tất cả ước" / "ước hoặc bội thoả khoảng" ────
// Đáp số luôn là TẬP (kể cả "tất cả ước" — dùng chung khuôn chuanHoaTapText). Không cần gcd/lcm 2 số như DẠNG 6
// — chỉ 1 số N, nhưng cùng nhóm ước/bội nên tái dùng `uocCua` đã có.
function dsUocBoi(kind, N, lo, loInc, hi, hiInc) { // kind: 'uoc'|'boi'; lo/hi=null nghĩa là không chặn phía đó
  if (kind === 'uoc') return uocCua(N).filter((x) => (lo == null || (loInc ? x >= lo : x > lo)) && (hi == null || (hiInc ? x <= hi : x < hi)))
  const out = []
  for (let v = 0n; out.length < 200; v += N) {
    if (hi != null && (hiInc ? v > hi : v >= hi)) break
    if (lo == null || (loInc ? v >= lo : v > lo)) out.push(v)
  }
  return out
}
function ruleUocBoi(kind, N, lo, loInc, hi, hiInc, dungArr, rule) {
  const dungText = dungArr.join('; ')
  if (rule === 'R73') { // nhầm Ước <-> Bội (giữ cùng điều kiện khoảng; ước không hi tường minh thì lấy N làm mốc)
    const kind2 = kind === 'uoc' ? 'boi' : 'uoc'
    const arr = dsUocBoi(kind2, N, lo, lo == null ? true : loInc, hi ?? N, hi == null ? true : hiInc)
    if (!arr.length) return null
    const t = arr.join('; '); if (t === dungText) return null
    return { text: t, ds: `nhầm ${kind === 'uoc' ? 'Ước' : 'Bội'} thành ${kind === 'uoc' ? 'Bội' : 'Ước'} của ${N}` }
  }
  if (rule === 'R74') { // nhầm biên đóng/mở của khoảng
    if (lo == null && hi == null) return null
    const arr = dsUocBoi(kind, N, lo, lo == null ? true : !loInc, hi, hi == null ? true : !hiInc)
    const t = arr.join('; '); if (!arr.length || t === dungText) return null
    return { text: t, ds: 'nhầm biên đóng/mở của khoảng — lấy thừa hoặc thiếu 1 số ở biên' }
  }
  if (rule === 'R75') { // bỏ sót phần tử lớn nhất
    if (dungArr.length < 2) return null
    return { text: dungArr.slice(0, -1).join('; '), ds: `bỏ sót ${dungArr[dungArr.length - 1]}, liệt kê thiếu` }
  }
  if (rule === 'R76') { // lẫn nhầm 1 số liền kề không phải ước/bội thật vào danh sách
    if (!dungArr.length) return null
    const last = dungArr[dungArr.length - 1]
    const w = last + 1n
    if (kind === 'uoc' && N % w === 0n) return null
    return { text: [...dungArr, w].join('; '), ds: `lẫn nhầm ${w} vào danh sách — không phải ${kind === 'uoc' ? 'ước' : 'bội'} thật của ${N}` }
  }
  return null
}
export function uocBoiCoBan(noiDung, rule) {
  const nd = String(noiDung)
  let kind, N, lo = null, loInc = true, hi = null, hiInc = true
  let m = nd.match(/Tìm năm bội của\s*\$?(\d+)\$?\.?\s*$/)
  if (m) { kind = 'boi'; N = BigInt(m[1]); lo = 0n; loInc = true; hi = 5n * N; hiInc = false }
  else {
    m = nd.match(/Tìm tất cả các ước của\s*\$?(\d+)\$?\.?\s*$/)
    if (m) { kind = 'uoc'; N = BigInt(m[1]) }
    else {
      m = nd.match(/\$?(\d+)\s*\\vdots\s*[a-zA-Z]\$?\.?\s*$/)
      if (m) { kind = 'uoc'; N = BigInt(m[1]) }
      else {
        m = nd.match(/[a-zA-Z]\s*\\in\s*(B|U|\\text\{Ư\})\((\d+)\)\$?\s*và\s*(.+?)\.?\s*$/)
        if (!m) return null
        kind = m[1] === 'B' ? 'boi' : 'uoc'; N = BigInt(m[2])
        const cond = m[3]
        let mm = cond.match(/(\d+)\s*\\le\s*[a-zA-Z]\s*\\le\s*(\d+)/)
        if (mm) { lo = BigInt(mm[1]); loInc = true; hi = BigInt(mm[2]); hiInc = true }
        else if ((mm = cond.match(/[a-zA-Z]\s*<\s*(\d+)/))) { lo = 0n; loInc = true; hi = BigInt(mm[1]); hiInc = false }
        else if ((mm = cond.match(/[a-zA-Z]\s*\\ge\s*(\d+)/))) { lo = BigInt(mm[1]); loInc = true }
        else if ((mm = cond.match(/[a-zA-Z]\s*>\s*(\d+)/))) { lo = BigInt(mm[1]); loInc = false }
        else return null
      }
    }
  }
  if (N <= 0n) return null
  const dungArr = dsUocBoi(kind, N, lo, loInc, hi, hiInc)
  if (!dungArr.length) return null
  if (!rule) return { text: dungArr.join('; ') }
  return ruleUocBoi(kind, N, lo, loInc, hi, hiInc, dungArr, rule)
}

// ── DẠNG 8: ƯC/BC của 2 số (T106040101/201) — "Tìm UC(a;b)" (tập hữu hạn = ước của ƯCLN) / "Tìm BC(a;b)"
// (tập VÔ HẠN, kho viết "0;L;2L;...." — giữ nguyên "...." trong TEXT hiển thị; chuanHoaTapText tự lọc "...."
// ra khỏi canon vì Number("....")=NaN, không ảnh hưởng so khớp đúng/sai vì áp dụng NHẤT QUÁN 2 bên).
function boiVoHanText(l) { return `0; ${l}; ${2n * l}; ....` }
export function ucBcCoBan(noiDung, rule) {
  const nd = String(noiDung)
  let m = nd.match(/\\text\{UC\}\((\d+)\s*;\s*(\d+)\)/)
  if (m) {
    const nums = [BigInt(m[1]), BigInt(m[2])]
    const { value: g } = gcdLcmFactor(nums, 'ucln')
    if (g <= 0n) return null
    const dungArr = uocCua(g)
    if (!dungArr.length) return null
    if (!rule) return { text: dungArr.join('; ') }
    return ruleUocBoi('uoc', g, null, true, null, true, dungArr, rule)
  }
  m = nd.match(/BC\((\d+)\s*;\s*(\d+)\)/)
  if (m) {
    const nums = [BigInt(m[1]), BigInt(m[2])]
    const { value: l } = gcdLcmFactor(nums, 'bcnn')
    if (l <= 0n) return null
    if (!rule) return { text: boiVoHanText(l) }
    if (rule === 'R77') { // nhầm BCNN thành ƯCLN
      const { value: g } = gcdLcmFactor(nums, 'ucln')
      if (g <= 0n || g === l) return null
      return { text: boiVoHanText(g), ds: 'nhầm BCNN thành ƯCLN — liệt kê bội của ƯCLN thay vì BCNN' }
    }
    if (rule === 'R78') { // chỉ xét bội của 1 trong 2 số
      const n0 = nums[0]; if (n0 === l) return null
      return { text: boiVoHanText(n0), ds: `chỉ liệt kê bội của ${n0}, quên số còn lại phải cùng chia hết` }
    }
    if (rule === 'R79') { // quên số 0, bắt đầu liệt kê từ chính BCNN
      return { text: `${l}; ${2n * l}; ${3n * l}; ....`, ds: 'quên số 0 (B(a) luôn bắt đầu từ 0 theo định nghĩa), bắt đầu liệt kê từ chính BCNN' }
    }
    if (rule === 'R80') { // nhân trực tiếp 2 số làm BCNN
      const p = nums[0] * nums[1]; if (p === l) return null
      return { text: boiVoHanText(p), ds: 'nhân trực tiếp 2 số với nhau làm BCNN, không rút gọn theo ước chung' }
    }
  }
  return null
}

// ── DẠNG 9: Tổng các phần tử của tập {x∈N | x<K} (T106010103, sub-shape nhỏ — 4 câu) — ĐÁP SỐ LÀ 1 GIÁ TRỊ ──
export function tongTapHopNhoHon(noiDung, rule) {
  const m = String(noiDung).match(/x\s*<\s*(\d+)[^.]*?\.\s*Tổng các phần tử/)
  if (!m) return null
  const K = BigInt(m[1]); if (K <= 0n) return null
  const dung = (K * (K - 1n)) / 2n
  if (!rule) return { value: R(dung) }
  if (rule === 'R81') { const v = dung + K; return { value: R(v), ds: 'quên x<K là nghiêm ngặt, cộng luôn cả K vào tổng' } }
  if (rule === 'R82') { const v = K * (K - 1n); if (v === dung || K < 2n) return null; return { value: R(v), ds: 'dùng công thức cặp số (Gauss) nhưng quên chia đôi' } }
  if (rule === 'R83') { if (K < 2n) return null; const v = dung - (K - 1n); return { value: R(v), ds: 'cộng thiếu phần tử lớn nhất (K−1)' } }
  if (rule === 'R84') { if (K === dung) return null; return { value: R(K), ds: 'nhầm bài toán "đếm số phần tử" với "tính tổng các phần tử"' } }
  return null
}
