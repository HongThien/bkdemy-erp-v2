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

// ── DẠNG 10: Sắp xếp số hữu tỉ theo thứ tự tăng dần (T107010103, sub-shape 6 câu) — ĐÁP SỐ LÀ CHUỖI BẤT ĐẲNG
// THỨC giữ NGUYÊN VĂN các số như đề cho (không rút gọn) — so khớp bằng TEXT (thứ tự PHẢI đúng, không phải tập).
export function chuanHoaThuTu(s) { return String(s ?? '').replace(/\$/g, '').replace(/\s+/g, ' ').trim() }
export function evalThuTu(s) { const t = chuanHoaThuTu(s); return t || null }
export function sapXepSoHuuTi(noiDung, rule) {
  const m = String(noiDung).match(/Sắp xếp các số hữu tỉ theo thứ tự tăng dần:\s*(.+?)\s*$/)
  if (!m) return null
  const raw = m[1].split(';').map((s) => s.trim()).filter(Boolean)
  const items = raw.map((t) => {
    if (/^0$/.test(t)) return { text: t, value: R(0n), neg: false, zero: true }
    const fm = t.match(/\\dfrac\{(-?\d+)\}\{(-?\d+)\}/)
    if (!fm) return null
    const v = R(BigInt(fm[1]), BigInt(fm[2])); if (!v) return null
    return { text: t, value: v, neg: v.p < 0n, zero: false }
  })
  if (items.length < 3 || items.some((x) => !x)) return null
  const sorted = [...items].sort((a, b) => cmp(a.value, b.value))
  const dungText = sorted.map((x) => x.text).join(' < ')
  if (!rule) return { text: dungText }
  const negs = items.filter((x) => x.neg), poss = items.filter((x) => !x.neg && !x.zero)
  if (rule === 'R85') { // nhầm so sánh 2 số âm — lấy trực tiếp tử số/giá trị tuyệt đối mà quên đổi dấu (đảo thứ tự 2 số âm)
    if (negs.length !== 2) return null
    const swapped = sorted.map((x) => (x === negs[0] ? negs[1] : x === negs[1] ? negs[0] : x))
    const t = swapped.map((x) => x.text).join(' < '); if (t === dungText) return null
    return { text: t, ds: 'so sánh nhầm 2 số âm — lấy trực tiếp tử số/giá trị tuyệt đối, quên đổi dấu' }
  }
  if (rule === 'R86') { // nhầm so sánh 2 số dương tương tự (quy đồng sai)
    if (poss.length !== 2) return null
    const swapped = sorted.map((x) => (x === poss[0] ? poss[1] : x === poss[1] ? poss[0] : x))
    const t = swapped.map((x) => x.text).join(' < '); if (t === dungText) return null
    return { text: t, ds: 'quy đồng sai khi so sánh 2 số dương, đảo nhầm thứ tự' }
  }
  if (rule === 'R87') { // sắp xếp giảm dần thay vì tăng dần
    const t = [...sorted].reverse().map((x) => x.text).join(' < '); if (t === dungText) return null
    return { text: t, ds: 'sắp xếp giảm dần thay vì tăng dần (đọc nhầm đề)' }
  }
  if (rule === 'R88') { // đặt 0 sai vị trí (đưa lên đầu)
    const zeroItem = items.find((x) => x.zero); if (!zeroItem) return null
    const rest = sorted.filter((x) => !x.zero)
    const t = [zeroItem, ...rest].map((x) => x.text).join(' < '); if (t === dungText) return null
    return { text: t, ds: 'đặt nhầm 0 lên đầu — quên xét dấu âm/dương của các số hữu tỉ khác' }
  }
  return null
}

// ── DẠNG 11: Đơn thức cơ bản (khối 8 — T108010101/102/103/104) — parser đơn thức chung dùng cho cả 4 dạng.
// Đơn thức = tích các nhân tử (số · biến^mũ · (đơn thức con)^mũ), KHÔNG có +/- giữa các hạng tử (trừ dấu đầu).
// Gặp +/- ở giữa (kể cả trong ngoặc con) ⇒ trả null — đúng nghĩa "không phải 1 đơn thức" (đa thức nhiều hạng tử).
function parseDonThucCore(s) {
  s = String(s ?? '').trim()
  let i = 0, sign = 1n
  if (s[i] === '-') { sign = -1n; i++ } else if (s[i] === '+') { i++ }
  let coefAcc = R(1n); const vars = new Map(); let any = false, hasIrrational = false
  while (i < s.length) {
    const rest = s.slice(i)
    if (rest[0] === ' ') { i++; continue }
    let mDec = rest.match(/^(\d+)\.(\d+)/) // số thập phân (vd 0.5) — PHẢI kiểm TRƯỚC dấu "." nhân ngầm, kẻo "0" rồi "." bị hiểu nhầm thành nhân
    if (mDec) { coefAcc = mul(coefAcc, R(BigInt(mDec[1] + mDec[2]), 10n ** BigInt(mDec[2].length))); i += mDec[0].length; any = true; continue }
    let mHon = rest.match(/^(\d+)\\dfrac\{(\d+)\}\{(\d+)\}/) // HỖN SỐ (vd 1\dfrac{1}{2} = 1+1/2 = 3/2) — số nguyên ĐỨNG NGAY TRƯỚC \dfrac không có dấu gì ở giữa
    if (mHon) { // PHẢI kiểm TRƯỚC nhánh \dfrac thuần số bên dưới, kẻo hiểu nhầm thành "nhân" (1 × 1/2 = 1/2, sai — đúng phải cộng)
      const nguyen = BigInt(mHon[1]), tu = BigInt(mHon[2]), mau = BigInt(mHon[3])
      coefAcc = mul(coefAcc, R(nguyen * mau + tu, mau)); i += mHon[0].length; any = true; continue
    }
    if (rest[0] === '.') { i++; continue }
    if (rest[0] === '(') {
      let depth = 1, j = i + 1
      while (j < s.length && depth > 0) { if (s[j] === '(') depth++; else if (s[j] === ')') depth--; j++ }
      const inner = s.slice(i + 1, j - 1); i = j
      const m = s.slice(i).match(/^\^\{?(\d+)\}?/); const power = m ? Number(m[1]) : 1; if (m) i += m[0].length
      const sub = parseDonThucCore(inner); if (!sub) return null
      let pw = R(1n); for (let k = 0; k < power; k++) pw = mul(pw, sub.coef)
      coefAcc = mul(coefAcc, pw)
      for (const [v, e] of sub.vars) vars.set(v, (vars.get(v) ?? 0) + e * power)
      if (sub.hasIrrational) hasIrrational = true
      any = true; continue
    }
    let m = rest.match(/^\\sqrt\{(\d+)\}/) // căn của 1 số làm hệ số (vd 7√5·b³) — hợp lệ là đơn thức nhưng KHÔNG có giá trị hữu tỉ chính xác
    if (m) { hasIrrational = true; i += m[0].length; any = true; continue }
    m = rest.match(/^\\dfrac\{(-?\d+)\}\{(-?\d+)\}/) // ca thường gặp: phân số thuần số/số
    if (m) { coefAcc = mul(coefAcc, R(BigInt(m[1]), BigInt(m[2]))); i += m[0].length; any = true; continue }
    m = rest.match(/^\\dfrac\{([^{}]+)\}\{(-?\d+)\}/) // tổng quát: tử là 1 đơn thức, mẫu là 1 số (vd \dfrac{-6x^4y^2}{11})
    if (m) {
      const tu = parseDonThucCore(m[1]); if (!tu) return null
      const chia = div(tu.coef, R(BigInt(m[2]))); if (!chia) return null
      coefAcc = mul(coefAcc, chia)
      for (const [v, e] of tu.vars) vars.set(v, (vars.get(v) ?? 0) + e)
      if (tu.hasIrrational) hasIrrational = true
      i += m[0].length; any = true; continue
    }
    m = rest.match(/^(\d+)\s*\/\s*(\d+)/) // phân số viết bằng "/" thường (không phải \dfrac)
    if (m) { coefAcc = mul(coefAcc, R(BigInt(m[1]), BigInt(m[2]))); i += m[0].length; any = true; continue }
    m = rest.match(/^(\d+)/)
    if (m) { coefAcc = mul(coefAcc, R(BigInt(m[1]))); i += m[0].length; any = true; continue }
    m = rest.match(/^([a-zA-Z])\^\{?(\d+)\}?/)
    if (m) { vars.set(m[1], (vars.get(m[1]) ?? 0) + Number(m[2])); i += m[0].length; any = true; continue }
    m = rest.match(/^([a-zA-Z])/)
    if (m) { vars.set(m[1], (vars.get(m[1]) ?? 0) + 1); i += m[0].length; any = true; continue }
    return null // gặp +, -, hoặc ký tự lạ giữa chừng ⇒ không phải 1 đơn thức
  }
  if (!any) return null
  return { coef: sign < 0n ? mul(R(-1n), coefAcc) : coefAcc, vars, hasIrrational }
}
function bacCua(vars) { let d = 0; for (const e of vars.values()) d += e; return d }
function hienThiPhanBien(vars) { return [...vars.entries()].filter(([, e]) => e > 0).sort((a, b) => a[0].localeCompare(b[0])).map(([v, e]) => (e === 1 ? v : `${v}^${e}`)).join('') }
function hienThiDonThuc(coef, vars) {
  if (coef.p === 0n) return '0' // 0 nhân bất kỳ phần biến nào cũng chỉ là 0, không viết "0x^2y"
  const varParts = hienThiPhanBien(vars)
  if (!varParts) return texR(coef)
  if (coef.p === 1n && coef.q === 1n) return varParts
  if (coef.p === -1n && coef.q === 1n) return `-${varParts}`
  return `${texR(coef)}${varParts}`
}
function phanBienKey(vars) { return [...vars.entries()].filter(([, e]) => e !== 0).sort((a, b) => a[0].localeCompare(b[0])).map(([v, e]) => `${v}${e}`).join(',') }
function timBieuThuc1(noiDung) { // "$X(...) = <expr>$ là bao nhiêu" → <expr>
  const m = String(noiDung).match(/\$[A-Za-zĐ]\([a-zA-Z,]*\)\s*=\s*(.+?)\$\s*là bao nhiêu/)
  return m ? m[1].trim() : null
}
function timBieuThucList(noiDung) { return [...String(noiDung).matchAll(/\$([^$]+)\$/g)].map((m) => m[1].trim()) }

function chiaHangTu(s) { // tách đa thức thành hạng tử theo +/- Ở BẬC NGOÀI CÙNG (không tính +/- trong {..} hay (..))
  const out = []; let depth = 0, cur = '', sign = '+'
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (ch === '{' || ch === '(') depth++
    if (ch === '}' || ch === ')') depth--
    if (depth === 0 && (ch === '+' || ch === '-')) {
      if (cur.trim() !== '') { out.push({ sign, text: cur.trim() }); cur = '' }
      sign = ch; continue
    }
    cur += ch
  }
  if (cur.trim() !== '') out.push({ sign, text: cur.trim() })
  return out
}
function gopHangTuDongDang(terms) { // terms: [{sign,text}] đã parse được từng hạng tử là đơn thức → gộp theo phần biến, bỏ hạng tử triệt tiêu (=0)
  const parsed = terms.map((t) => { const core = parseDonThucCore(t.text); if (!core) return null; return { coef: t.sign === '-' ? mul(R(-1n), core.coef) : core.coef, vars: core.vars } })
  if (parsed.some((t) => !t)) return null
  const gop = new Map()
  for (const t of parsed) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : { coef: t.coef, vars: t.vars }) }
  return [...gop.values()].filter((t) => t.coef.p !== 0n)
}
export function bacDonThuc(noiDung, rule) { // T108010102 — trộn 2 sub-shape: "bậc đơn thức" và "bậc đa thức"
  const expr1 = timBieuThuc1(noiDung)
  if (expr1) {
    const p = parseDonThucCore(expr1); if (!p || p.hasIrrational) return null
    const dung = bacCua(p.vars)
    if (!rule) return { value: R(BigInt(dung)) }
    const entries = [...p.vars.entries()].filter(([, e]) => e > 0)
    if (rule === 'R89') { // bỏ sót 1 biến khi cộng số mũ (bỏ biến có số mũ nhỏ nhất)
      if (entries.length < 2) return null
      const bo = entries.reduce((a, b) => (a[1] <= b[1] ? a : b))
      const v = dung - bo[1]; if (v === dung || v < 0) return null
      return { value: R(BigInt(v)), ds: `bỏ sót biến ${bo[0]} khi cộng số mũ` }
    }
    if (rule === 'R90') { // quên nhân số mũ NGOÀI luỹ thừa (…)^n — chỉ áp dụng khi biểu thức có ngoặc mũ
      if (!/\)\^/.test(expr1)) return null
      const m = expr1.match(/\(([^()]+)\)\^\{?(\d+)\}?/); if (!m) return null
      const inner = parseDonThucCore(m[1]); if (!inner) return null
      const n = Number(m[2]); const bacTrong = bacCua(inner.vars)
      const v = dung - bacTrong * n + bacTrong; if (v === dung || v < 0) return null
      return { value: R(BigInt(v)), ds: 'quên nhân số mũ trong ngoặc với luỹ thừa ngoài, chỉ cộng thẳng' }
    }
    if (rule === 'R91') { // lấy TÍCH các số mũ thay vì TỔNG
      if (entries.length < 2) return null
      let v = 1; for (const [, e] of entries) v *= e
      if (v === dung || v < 0) return null
      return { value: R(BigInt(v)), ds: 'lấy tích các số mũ thay vì tổng' }
    }
    if (rule === 'R131') { const v = dung + 1; return { value: R(BigInt(v)), ds: 'cộng thừa 1 vào bậc (đếm lố 1 đơn vị)' } }
    return null
  }
  // sub-shape "Bậc của đa thức $...$" — có thể cần gộp hạng tử đồng dạng (triệt tiêu) trước khi lấy bậc lớn nhất
  const m2 = String(noiDung).match(/Bậc của đa thức\s*\$(.+?)\$/); if (!m2) return null
  const termsRaw = chiaHangTu(m2[1]); if (termsRaw.length < 2) return null
  const gopLai = gopHangTuDongDang(termsRaw); if (!gopLai || !gopLai.length) return null
  const dung = Math.max(...gopLai.map((t) => bacCua(t.vars)))
  if (!rule) return { value: R(BigInt(dung)) }
  if (rule === 'R105') { // quên gộp hạng tử đồng dạng (triệt tiêu) trước khi lấy bậc — lấy bậc lớn nhất trên hạng tử GỐC
    const parsedGoc = termsRaw.map((t) => parseDonThucCore(t.text)); if (parsedGoc.some((p) => !p)) return null
    const v = Math.max(...parsedGoc.map((p) => bacCua(p.vars))); if (v === dung) return null
    return { value: R(BigInt(v)), ds: 'quên thu gọn (gộp hạng tử đồng dạng triệt tiêu) trước khi tìm bậc' }
  }
  if (rule === 'R106') { // cộng bậc các hạng tử thay vì lấy lớn nhất
    const v = gopLai.reduce((a, t) => a + bacCua(t.vars), 0); if (v === dung) return null
    return { value: R(BigInt(v)), ds: 'cộng bậc các hạng tử lại thay vì lấy bậc lớn nhất' }
  }
  if (rule === 'R107') { const v = gopLai.length; if (v === dung) return null; return { value: R(BigInt(v)), ds: 'đếm nhầm số hạng tử (sau khi thu gọn) thay vì lấy bậc' } }
  if (rule === 'R108') { const v = dung - 1; if (v < 0 || v === dung) return null; return { value: R(BigInt(v)), ds: 'tính bậc lệch 1 đơn vị (dự phòng)' } }
  return null
}
export function heSoDonThuc(noiDung, rule) { // T108010103 — trộn "hệ số đơn thức A(x)=.." và "hệ số cao nhất của đa thức Q(x)=.." (cần khai triển)
  const expr = timBieuThuc1(noiDung)
  if (!expr) return heSoCaoNhatDaThuc(noiDung, rule)
  const p = parseDonThucCore(expr); if (!p || p.hasIrrational) return null
  if (!rule) return { value: p.coef }
  if (rule === 'R92') { // bỏ dấu âm của hệ số
    if (p.coef.p >= 0n) return null
    return { value: R(-p.coef.p, p.coef.q), ds: 'bỏ dấu âm của hệ số' }
  }
  const mParen = expr.match(/\(([^()]+)\)\^\{?(\d+)\}?/)
  if (rule === 'R93') { // quên luỹ thừa hệ số trong ngoặc (chỉ nhân 1 lần thay vì mũ n)
    if (!mParen) return null
    const inner = parseDonThucCore(mParen[1]); if (!inner || inner.coef.p === 0n) return null
    const n = Number(mParen[2]); if (n < 2) return null
    let heSoNgoai = p.coef; for (let k = 0; k < n; k++) { heSoNgoai = div(heSoNgoai, inner.coef); if (!heSoNgoai) return null }
    const v = mul(heSoNgoai, inner.coef); if (!v || cmp(v, p.coef) === 0) return null
    return { value: v, ds: `quên luỹ thừa hệ số trong ngoặc lên bậc ${n}, chỉ nhân 1 lần` }
  }
  if (rule === 'R94') { // quên nhân hệ số trong ngoặc (đã mũ) với hệ số ngoài — chỉ lấy hệ số trong ngoặc đã mũ
    if (!mParen) return null
    const inner = parseDonThucCore(mParen[1]); if (!inner) return null
    const n = Number(mParen[2]); let heSoTrongMu = R(1n); for (let k = 0; k < n; k++) heSoTrongMu = mul(heSoTrongMu, inner.coef)
    if (cmp(heSoTrongMu, p.coef) === 0) return null
    return { value: heSoTrongMu, ds: 'quên nhân hệ số ngoài, chỉ lấy hệ số trong ngoặc đã luỹ thừa' }
  }
  if (rule === 'R132') { const v = add(p.coef, R(1n)); if (cmp(v, p.coef) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị ở hệ số' } }
  if (rule === 'R116') { // nhầm khái niệm — lấy số mũ của biến ĐẦU TIÊN làm hệ số
    const entries0 = [...p.vars.entries()].filter(([, e]) => e > 0); if (!entries0.length) return null
    const v = R(BigInt(entries0[0][1])); if (cmp(v, p.coef) === 0) return null
    return { value: v, ds: `nhầm số mũ của biến ${entries0[0][0]} là hệ số` }
  }
  return null
}
// Sub-shape KHÁC cùng dang_chinh T108010103: "Phần biến của đơn thức ... là bao nhiêu" / "Tìm phần biến của
// đơn thức M = ...:" — đáp số là TEXT (phần biến, vd "x^3y^2z^6"), không phải giá trị hữu tỉ ⇒ đi TEXT_DANG
// (dùng chung cơ chế "textFn null thì rơi xuống SPECIAL_DANG" đã có ở mcq-auto.mjs cho ca T107010103).
export function chuanHoaPhanBien(s) {
  const vars = new Map(); const re = /([a-zA-Z])\^\{?(\d+)\}?|([a-zA-Z])/g; let m
  while ((m = re.exec(String(s ?? '')))) { if (m[1]) vars.set(m[1], (vars.get(m[1]) ?? 0) + Number(m[2])); else vars.set(m[3], (vars.get(m[3]) ?? 0) + 1) }
  return hienThiPhanBien(vars)
}
export function evalPhanBien(s) { const t = chuanHoaPhanBien(s); return t || null }
export function phanBienDonThuc(noiDung, rule) {
  const nd = String(noiDung)
  const m = nd.match(/phần biến của đơn thức\s*\$[^=$]*=\s*(.+?)\$/i) // gộp mọi cách hỏi: "Phần biến…", "Tìm phần biến…", "Xác định phần biến…"
  if (!m) return null
  const p = parseDonThucCore(m[1]); if (!p || p.hasIrrational) return null
  const dungText = hienThiPhanBien(p.vars); if (!dungText) return null
  if (!rule) return { text: dungText }
  const entries = [...p.vars.entries()].filter(([, e]) => e > 0)
  if (rule === 'R109') { // quên nhân số mũ trong ngoặc với luỹ thừa ngoài — chỉ áp dụng khi có (…)^n
    const mp = m[1].match(/\(([^()]+)\)\^\{?(\d+)\}?/); if (!mp) return null
    const inner = parseDonThucCore(mp[1]); if (!inner) return null
    const n = Number(mp[2])
    const varsSai = new Map(p.vars)
    for (const [v, e] of inner.vars) { const dungE = e * n, saiE = e; varsSai.set(v, (varsSai.get(v) ?? 0) - dungE + saiE) }
    const t = hienThiPhanBien(varsSai); if (!t || t === dungText) return null
    return { text: t, ds: 'quên nhân số mũ trong ngoặc với luỹ thừa ngoài, giữ nguyên số mũ như chưa khai triển' }
  }
  if (rule === 'R110') { // bỏ sót 1 biến trong phần biến
    if (entries.length < 2) return null
    const bo = entries.reduce((a, b) => (a[1] <= b[1] ? a : b))
    const varsSai = new Map(p.vars); varsSai.delete(bo[0])
    const t = hienThiPhanBien(varsSai); if (!t || t === dungText) return null
    return { text: t, ds: `bỏ sót biến ${bo[0]} trong phần biến` }
  }
  if (rule === 'R111') { // sai lệch số mũ của 1 biến (+1)
    if (!entries.length) return null
    const [v, e] = entries[0]
    const varsSai = new Map(p.vars); varsSai.set(v, e + 1)
    const t = hienThiPhanBien(varsSai); if (!t || t === dungText) return null
    return { text: t, ds: `tính lệch số mũ của biến ${v} (thừa 1)` }
  }
  if (rule === 'R118') { // hoán đổi nhầm số mũ giữa 2 biến
    if (entries.length < 2) return null
    const [v1, e1] = entries[0], [v2, e2] = entries[1]; if (e1 === e2) return null
    const varsSai = new Map(p.vars); varsSai.set(v1, e2); varsSai.set(v2, e1)
    const t = hienThiPhanBien(varsSai); if (!t || t === dungText) return null
    return { text: t, ds: `hoán đổi nhầm số mũ giữa 2 biến ${v1} và ${v2}` }
  }
  return null
}
// Sub-shape thứ 3 cùng dang_chinh T108010103: "Xác định hệ số cao nhất của đa thức Q(x) = ..." — đa thức có
// thể CHƯA khai triển (dạng "hệ_số.(nhị thức)+..."), phải phân phối rồi gộp hạng tử đồng dạng trước khi tìm
// hạng tử bậc cao nhất. Tái dùng chiaHangTu/parseDonThucCore/phanBienKey đã có ở sub-shape "bậc đa thức".
function khaiTrienHangTu(sign, text) { // 1 hạng tử top-level (có thể là "hệ_số.(nhị thức)" cần phân phối) → mảng {coef,vars} đã nhân dấu sign
  const m = text.match(/^(.*)\(([^()]+)\)\s*$/) // kết thúc bằng đúng 1 cụm ngoặc không lồng
  if (m) {
    const prefix = parseDonThucCore(m[1] || '1')
    const innerTerms = chiaHangTu(m[2])
    if (prefix && innerTerms.length >= 2) {
      const out = []
      for (const it of innerTerms) {
        const core = parseDonThucCore(it.text); if (!core) return null
        let coef = mul(mul(prefix.coef, core.coef), R(it.sign === '-' ? -1n : 1n))
        if (sign === '-') coef = mul(R(-1n), coef)
        const vars = new Map(prefix.vars); for (const [v, e] of core.vars) vars.set(v, (vars.get(v) ?? 0) + e)
        out.push({ coef, vars })
      }
      return out
    }
  }
  const core = parseDonThucCore(text); if (!core) return null
  return [{ coef: sign === '-' ? mul(R(-1n), core.coef) : core.coef, vars: core.vars }]
}
function khaiTrienDaThuc(exprStr) { // chuỗi đa thức (có thể có hạng tử cần phân phối) → mảng {coef,vars} đã gộp đồng dạng, bỏ hạng tử triệt tiêu
  const terms = chiaHangTu(exprStr); const allOut = []
  for (const t of terms) { const ex = khaiTrienHangTu(t.sign, t.text); if (!ex) return null; allOut.push(...ex) }
  const gop = new Map()
  for (const t of allOut) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
  return [...gop.values()].filter((t) => t.coef.p !== 0n)
}
export function heSoCaoNhatDaThuc(noiDung, rule) {
  const m = String(noiDung).match(/hệ số cao nhất của đa thức\s*\$[^=$]*=\s*(.+?)\.?\$/i); if (!m) return null
  const terms = khaiTrienDaThuc(m[1]); if (!terms || !terms.length) return null
  const withDeg = terms.map((t) => ({ ...t, deg: bacCua(t.vars) }))
  const dungTerm = withDeg.reduce((a, b) => (b.deg > a.deg ? b : a))
  if (!rule) return { value: dungTerm.coef }
  if (rule === 'R112') { // quên khai triển (phân phối) — coi bậc ngoài ngoặc (bỏ hẳn phần trong ngoặc), mô phỏng "quên nhân phân phối"
    const rawWithDeg = chiaHangTu(m[1]).map((t) => {
      const mp = t.text.match(/^(.*?)\(([^()]+)\)\s*$/)
      const outerText = mp ? mp[1] : t.text
      const core = parseDonThucCore(outerText || '0'); if (!core) return null
      return { coef: t.sign === '-' ? mul(R(-1n), core.coef) : core.coef, deg: bacCua(core.vars) }
    })
    if (rawWithDeg.some((t) => !t)) return null
    const top = rawWithDeg.reduce((a, b) => (b.deg > a.deg ? b : a))
    if (cmp(top.coef, dungTerm.coef) === 0) return null
    return { value: top.coef, ds: 'quên khai triển (phân phối), lấy hệ số hạng tử bậc cao nhất khi CHƯA nhân vào trong ngoặc' }
  }
  if (rule === 'R113') { // nhầm lấy hệ số của hạng tử bậc THẤP NHẤT
    const thap = withDeg.reduce((a, b) => (b.deg < a.deg ? b : a))
    if (cmp(thap.coef, dungTerm.coef) === 0) return null
    return { value: thap.coef, ds: 'nhầm lấy hệ số của hạng tử bậc thấp nhất thay vì cao nhất' }
  }
  if (rule === 'R114') { // nhầm dấu khi phân phối (không đổi dấu khi nhân với hạng tử âm trong ngoặc)
    const mp = m[1].match(/\(([^()]+)\)/); if (!mp) return null
    const flippedInner = mp[1].replace(/-/g, '').replace(/\+/g, '-').replace(//g, '+')
    const exprSai = m[1].replace(mp[1], flippedInner)
    const termsSai = khaiTrienDaThuc(exprSai); if (!termsSai || !termsSai.length) return null
    const topSai = termsSai.reduce((a, b) => (bacCua(b.vars) > bacCua(a.vars) ? b : a))
    if (cmp(topSai.coef, dungTerm.coef) === 0) return null
    return { value: topSai.coef, ds: 'nhầm dấu khi phân phối vào trong ngoặc (không đổi dấu đúng)' }
  }
  if (rule === 'R115') { const v = add(dungTerm.coef, R(1n)); if (cmp(v, dungTerm.coef) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị ở hệ số cao nhất (dự phòng)' } }
  if (rule === 'R119') { // lấy hệ số hạng tử ĐẦU TIÊN viết trong đề, không xét bậc
    const rawTerms = chiaHangTu(m[1]); if (!rawTerms.length) return null
    const firstCore = parseDonThucCore(rawTerms[0].text); if (!firstCore) return null
    const v = rawTerms[0].sign === '-' ? mul(R(-1n), firstCore.coef) : firstCore.coef
    if (cmp(v, dungTerm.coef) === 0) return null
    return { value: v, ds: 'lấy hệ số hạng tử ĐẦU TIÊN viết trong đề, không xét bậc cao nhất' }
  }
  return null
}
export function demDonThucTrongDanhSach(noiDung, rule) { // T108010101 — trộn "đếm đơn thức" và "đếm đa thức"
  const list = timBieuThucList(noiDung); if (list.length < 2) return null
  const laDaThuc = /bao nhiêu đa thức/i.test(noiDung) && !/bao nhiêu đơn thức/i.test(noiDung)
  if (laDaThuc) {
    const hopLe = list.map((e) => { const t = khaiTrienDaThuc(e); return t && t.length >= 2 })
    const dung = hopLe.filter(Boolean).length
    if (!rule) return { value: R(BigInt(dung)) }
    if (rule === 'R95') { // đếm nhầm gồm cả đơn thức/hằng số (không phải đa thức đa hạng tử)
      const parsedMono = list.map((e) => parseDonThucCore(e))
      const soDon = parsedMono.filter((p) => p).length; if (!soDon) return null
      const v = dung + soDon; if (v === dung) return null
      return { value: R(BigInt(v)), ds: 'đếm nhầm gồm cả đơn thức/hằng số (không phải đa thức đa hạng tử) vào đa thức' }
    }
    if (rule === 'R96') { if (dung < 1) return null; return { value: R(BigInt(dung - 1)), ds: 'đếm thiếu 1 đa thức (dạng cần khai triển mới nhận ra, vd tích 1 đơn thức với 1 nhị thức)' } }
    if (rule === 'R97') { // không nhận ra biểu thức CẦN KHAI TRIỂN (dạng a(b+c)) cũng là đa thức — bỏ qua không đếm
      const chuaKhaiTrien = list.filter((e, idx) => hopLe[idx] && /\)/.test(e) && !parseDonThucCore(e)).length; if (!chuaKhaiTrien) return null
      const v = dung - chuaKhaiTrien; if (v === dung) return null
      return { value: R(BigInt(v)), ds: 'không nhận ra biểu thức dạng tích cần khai triển cũng là đa thức, bỏ qua không đếm' }
    }
    if (rule === 'R133') { const v = dung + 2; return { value: R(BigInt(v)), ds: 'đếm thừa 2 đơn vị' } }
    return null
  }
  const parsed = list.map((e) => parseDonThucCore(e))
  const dung = parsed.filter((p) => p).length
  if (!rule) return { value: R(BigInt(dung)) }
  if (rule === 'R95') { // đếm nhầm gồm cả đa thức (biểu thức có +/- nhiều hạng tử)
    const soDaThuc = parsed.filter((p) => !p).length; if (!soDaThuc) return null
    const v = dung + soDaThuc; if (v === dung) return null
    return { value: R(BigInt(v)), ds: 'đếm nhầm gồm cả đa thức (biểu thức nhiều hạng tử) vào đơn thức' }
  }
  if (rule === 'R96') { if (dung < 1) return null; return { value: R(BigInt(dung - 1)), ds: 'đếm thiếu 1 đơn thức (dạng viết phức tạp, tưởng không phải đơn thức)' } }
  if (rule === 'R97') { // không tính hằng số đơn thuần (không có biến) là đơn thức — sai khái niệm
    const soHangSo = parsed.filter((p) => p && p.vars.size === 0).length; if (!soHangSo) return null
    const v = dung - soHangSo; if (v === dung) return null
    return { value: R(BigInt(v)), ds: 'không tính hằng số đơn thuần (không có biến) là đơn thức' }
  }
  if (rule === 'R133') { const v = dung + 2; return { value: R(BigInt(v)), ds: 'đếm thừa 2 đơn vị' } }
  if (rule === 'R120') { // chỉ tính đơn thức viết ĐƠN GIẢN (không dấu chấm nhân/phân số/căn) — sai khái niệm, tưởng đơn thức viết phức tạp thì không phải đơn thức
    const simple = list.filter((e, idx) => parsed[idx] && !/\.|\\dfrac|\\sqrt|\//.test(e)).length
    if (simple === dung) return null
    return { value: R(BigInt(simple)), ds: 'chỉ tính đơn thức viết đơn giản, không tính đơn thức viết bằng dấu chấm nhân/phân số/căn' }
  }
  return null
}
export function demDongDang(noiDung, rule) { // T108010104
  const chunks = timBieuThucList(noiDung); if (chunks.length < 3) return null
  const refM = chunks[0].match(/=\s*(.+)$/); if (!refM) return null
  const ref = parseDonThucCore(refM[1]); if (!ref) return null
  const refKey = phanBienKey(ref.vars)
  const cands = chunks.slice(1, -1).map((c) => parseDonThucCore(c))
  const dung = cands.filter((p) => p && phanBienKey(p.vars) === refKey && p.coef.p !== 0n).length
  if (!rule) return { value: R(BigInt(dung)) }
  if (rule === 'R98') { const v = dung + 1; if (v > cands.length) return null; return { value: R(BigInt(v)), ds: 'đếm nhầm thêm 1 đơn thức khác phần biến nhưng nhìn thoáng qua giống' } }
  if (rule === 'R99') { if (dung < 1) return null; return { value: R(BigInt(dung - 1)), ds: 'đếm thiếu 1 đơn thức đồng dạng thật' } }
  if (rule === 'R130') { // coi phải cùng HỆ SỐ mới là đồng dạng (sai khái niệm)
    const v = cands.filter((p) => p && phanBienKey(p.vars) === refKey && cmp(p.coef, ref.coef) === 0).length
    if (v === dung) return null
    return { value: R(BigInt(v)), ds: 'nhầm khái niệm — coi phải cùng cả hệ số mới là đồng dạng, không chỉ cùng phần biến' }
  }
  if (rule === 'R134') { const v = cands.filter((p) => p).length; if (v === dung) return null; return { value: R(BigInt(v)), ds: 'đếm nhầm mọi đơn thức hợp lệ trong danh sách, không so phần biến' } }
  return null
}

// ── DẠNG 12: Cộng trừ đơn thức đồng dạng (T108010201, khối 8) — 3 sub-shape: "tính tổng/hiệu 2 đơn thức" và
// "thu gọn đa thức" (≥2 hạng tử đồng dạng viết sẵn trong 1 biểu thức). Đáp số luôn là 1 ĐƠN THỨC (đồng dạng
// với các hạng tử đưa vào) ⇒ TEXT_DANG, canon bằng cách RE-PARSE rồi format lại (tránh brittleness do kho
// khi có "$…$" khi không).
export function chuanHoaDonThucKetQua(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const p = parseDonThucCore(clean)
  return p ? hienThiDonThuc(p.coef, p.vars) : clean
}
export function evalDonThucKetQua(s) { const t = chuanHoaDonThucKetQua(s); return t || null }
export function congTruDonThucDongDang(noiDung, rule) {
  const nd = String(noiDung)
  let terms = null
  let m = nd.match(/Tính tổng của hai đơn thức sau:\s*\$(.+?)\$\s*và\s*\$(.+?)\$/)
  if (m) terms = [{ sign: '+', text: m[1] }, { sign: '+', text: m[2] }]
  else {
    m = nd.match(/Tính hiệu của hai đơn thức sau:\s*\$(.+?)\$\s*và\s*\$(.+?)\$/)
    if (m) terms = [{ sign: '+', text: m[1] }, { sign: '-', text: m[2] }]
    else {
      m = nd.match(/Thu gọn đa thức:\s*\$[A-Za-zĐ]\s*=\s*(.+?)\$/)
      if (m) terms = chiaHangTu(m[1])
    }
  }
  if (!terms || terms.length < 2) return null
  const parsed = terms.map((t) => { const p = parseDonThucCore(t.text); if (!p || p.hasIrrational) return null; return { coef: t.sign === '-' ? mul(R(-1n), p.coef) : p.coef, vars: p.vars } })
  if (parsed.some((p) => !p)) return null
  const key0 = phanBienKey(parsed[0].vars); if (!parsed.every((p) => phanBienKey(p.vars) === key0)) return null
  let dungCoef = R(0n); for (const p of parsed) dungCoef = add(dungCoef, p.coef)
  const dungText = hienThiDonThuc(dungCoef, parsed[0].vars)
  if (!rule) return { text: dungText }
  if (rule === 'R121') { // cộng luôn cả số mũ của biến (nhầm cách cộng đơn thức đồng dạng)
    const varsSai = new Map(); for (const p of parsed) for (const [v, e] of p.vars) varsSai.set(v, (varsSai.get(v) ?? 0) + e)
    const t = hienThiDonThuc(dungCoef, varsSai); if (t === dungText) return null
    return { text: t, ds: 'cộng luôn cả số mũ của biến, không chỉ cộng hệ số' }
  }
  if (rule === 'R122') { // đảo ngược phép tính — đề bảo tính tổng thì tính thành hiệu (hoặc ngược lại); chỉ áp dụng câu 2 hạng tử
    if (terms.length !== 2) return null
    const v = sub(parsed[0].coef, parsed[1].coef) // dungCoef = parsed[0]+parsed[1] (đã áp dấu đề); đảo ngược = trừ thay vì cộng
    const t = hienThiDonThuc(v, parsed[0].vars); if (t === dungText) return null
    return { text: t, ds: 'đảo ngược phép tính — đề yêu cầu tổng/hiệu nhưng tính ngược lại' }
  }
  if (rule === 'R123') { // tính sai dấu khi có hệ số âm — lấy trị tuyệt đối kết quả
    if (dungCoef.p >= 0n) return null
    const t = hienThiDonThuc(R(-dungCoef.p, dungCoef.q), parsed[0].vars); if (t === dungText) return null
    return { text: t, ds: 'bỏ dấu âm của kết quả' }
  }
  if (rule === 'R124') { const v = add(dungCoef, R(1n)); const t = hienThiDonThuc(v, parsed[0].vars); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số (dự phòng)' } }
  if (rule === 'R125') { // chỉ chép lại hạng tử đầu tiên, quên cộng/trừ các hạng tử còn lại (từ 3 hạng tử trở lên hay gặp)
    const t = hienThiDonThuc(parsed[0].coef, parsed[0].vars); if (t === dungText) return null
    return { text: t, ds: 'chỉ lấy hạng tử đầu tiên, quên cộng/trừ các hạng tử còn lại' }
  }
  return null
}

// ── DẠNG 13: Cộng trừ ĐA THỨC nhiều biến, có phân phối (T108010202, khối 8) ─────────────────────────────────
// Đề dạng "Cho đa thức $A(x)=...$ và $B(x)=...$. Tính $A(x)+B(x)$" / "Cho các đa thức A,B,C. Tính A-B+C" /
// phép tính đôi khi nằm NGOÀI $...$ (viết trần "A + B - C"). Đáp số là 1 ĐA THỨC nhiều hạng tử — khác hẳn
// DẠNG 11/12 (chỉ 1 đơn thức) nên cần bộ máy riêng: mỗi đa thức định nghĩa được khai triển (phân phối, tái
// dùng `khaiTrienDaThuc` đã có cho DẠNG 11) rồi CỘNG/TRỪ theo đúng thứ tự dấu trong phép tính yêu cầu.
function sapXepChuanDaThuc(terms) { // thứ tự hiển thị CỐ ĐỊNH — không cần khớp thứ tự kho ghi (canon tự re-parse cả 2 phía)
  return [...terms].filter((t) => t.coef.p !== 0n).sort((a, b) => {
    const da = bacCua(a.vars), db = bacCua(b.vars)
    return da !== db ? db - da : phanBienKey(a.vars).localeCompare(phanBienKey(b.vars))
  })
}
function hienThiDaThuc(terms) {
  const sorted = sapXepChuanDaThuc(terms)
  if (!sorted.length) return '0'
  let out = ''
  sorted.forEach((t, i) => {
    const isNeg = t.coef.p < 0n
    const abs = isNeg ? R(-t.coef.p, t.coef.q) : t.coef
    const piece = hienThiDonThuc(abs, t.vars)
    out += i === 0 ? (isNeg ? `-${piece}` : piece) : (isNeg ? ` - ${piece}` : ` + ${piece}`)
  })
  return out
}
function parseOpFromText(text, validNames) { // "A(x)+B(x)" / "A-B+C" (đã bỏ hết khoảng trắng) → [{name,sign}] hoặc null
  const compact = String(text).replace(/\s+/g, '')
  if (!compact) return null
  const re = /([+-]?)([A-Za-zĐ])(?:\([a-zA-Z,]*\))?/g
  let m, idx = 0; const out = []
  while ((m = re.exec(compact))) {
    if (m.index !== idx) return null // có ký tự lạ xen giữa ⇒ không phải chuỗi phép tính thuần A±B±C
    if (!validNames.has(m[2])) return null
    out.push({ name: m[2], sign: m[1] === '-' ? '-' : '+' }); idx = re.lastIndex
  }
  if (idx !== compact.length || out.length < 2) return null // cần ≥2 đa thức mới coi là "phép tính" (tránh khớp nhầm 1 chữ đứng lẻ)
  return out
}
function timPhepTinhTrongVanBanTran(text, validNames) { // phép tính đôi khi viết TRẦN ngoài $...$, lẫn giữa chữ thường
  // ("Cho ba đa thức sau: ... .\nA + B - C") — KHÔNG được strip hết whitespace của CẢ đoạn văn (sẽ dính chữ
  // xung quanh vào), phải tìm đúng CỤM liên tiếp "NAME (+/- NAME)+" bằng \b rồi mới rút gọn cụm đó.
  const names = [...validNames].map((n) => n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
  const re = new RegExp(`\\b(?:${names})(?:\\([a-zA-Z,]*\\))?(?:\\s*[+-]\\s*(?:${names})(?:\\([a-zA-Z,]*\\))?)+`)
  const m = re.exec(text)
  return m ? parseOpFromText(m[0], validNames) : null
}
function parseNamedPolysVaPhepTinh(noiDung) { // "Cho đa thức A(x)=... và B(x)=... . Tính A(x)+B(x)" → {defs:Map(tên→biểu thức), op:[{name,sign}]}
  const nd = String(noiDung)
  const segs = [...nd.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])
  const defs = new Map(); const nonDefSegs = []
  for (const seg of segs) {
    const m = seg.match(/^\s*([A-Za-zĐ])(?:\([a-zA-Z,]*\))?\s*=\s*(.+)$/)
    if (m && !defs.has(m[1])) defs.set(m[1], m[2].trim()); else nonDefSegs.push(seg)
  }
  if (defs.size < 2) return null
  const validNames = new Set(defs.keys())
  let op = null
  for (const seg of nonDefSegs) { op = parseOpFromText(seg, validNames); if (op) break }
  if (!op) op = timPhepTinhTrongVanBanTran(nd.replace(/\$[^$]+\$/g, ' '), validNames) // phép tính đôi khi viết TRẦN ngoài $...$
  if (!op) return null
  return { defs, op }
}
export function congTruDaThuc(noiDung, rule) {
  const parsed = parseNamedPolysVaPhepTinh(noiDung); if (!parsed) return null
  const { defs, op } = parsed
  const expanded = new Map()
  for (const [name, expr] of defs) { const t = khaiTrienDaThuc(expr); if (!t) return null; expanded.set(name, t) }
  const combine = (opSeq) => {
    const gop = new Map()
    for (const { name, sign } of opSeq) for (const t of expanded.get(name)) {
      const key = phanBienKey(t.vars), c = sign === '-' ? mul(R(-1n), t.coef) : t.coef
      const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, c), vars: t.vars } : { coef: c, vars: t.vars })
    }
    return [...gop.values()]
  }
  const dungTerms = sapXepChuanDaThuc(combine(op))
  const dungText = hienThiDaThuc(dungTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R126') { // quên đổi dấu khi phá ngoặc trừ — chỉ đổi dấu HẠNG TỬ ĐẦU của đa thức bị trừ, các hạng tử sau giữ nguyên dấu
    if (!op.some((o) => o.sign === '-' && expanded.get(o.name).length >= 2)) return null
    const gop = new Map()
    for (const { name, sign } of op) {
      const terms = expanded.get(name)
      terms.forEach((t, i) => {
        const flip = sign === '-' && i === 0
        const c = flip ? mul(R(-1n), t.coef) : t.coef
        const key = phanBienKey(t.vars); const old = gop.get(key)
        gop.set(key, old ? { coef: add(old.coef, c), vars: t.vars } : { coef: c, vars: t.vars })
      })
    }
    const t = hienThiDaThuc(sapXepChuanDaThuc([...gop.values()])); if (t === dungText) return null
    return { text: t, ds: 'quên đổi dấu khi phá ngoặc trừ — chỉ đổi dấu hạng tử đầu của đa thức bị trừ, các hạng tử sau giữ nguyên' }
  }
  if (rule === 'R127') { // đảo ngược toàn bộ phép tính (đổi hết dấu cộng thành trừ và ngược lại) = phủ định cả kết quả
    const t = hienThiDaThuc(sapXepChuanDaThuc(dungTerms.map((x) => ({ coef: mul(R(-1n), x.coef), vars: x.vars }))))
    if (t === dungText) return null
    return { text: t, ds: 'đảo ngược toàn bộ phép tính (đổi hết dấu cộng thành trừ và ngược lại)' }
  }
  if (rule === 'R128') { // chỉ lấy đa thức đầu tiên đã rút gọn, quên thực hiện phép tính với các đa thức còn lại
    const first = op[0]
    const terms = expanded.get(first.name).map((t) => ({ coef: first.sign === '-' ? mul(R(-1n), t.coef) : t.coef, vars: t.vars }))
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: `chỉ lấy đa thức ${first.name} (đã rút gọn), quên thực hiện phép tính với ${op.slice(1).map((o) => o.name).join(', ')}` }
  }
  if (rule === 'R129') { // dự phòng — tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất
    if (!dungTerms.length) return null
    const top = dungTerms[0] // đã sắp bậc giảm dần, phần tử đầu là bậc cao nhất
    const v = add(top.coef, R(1n))
    const terms = dungTerms.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}
export function chuanHoaDaThuc(s) {
  let clean = String(s ?? '').replace(/\$/g, '').trim()
  if (clean.includes('=')) clean = clean.slice(clean.lastIndexOf('=') + 1).trim() // kho đôi khi ghi "A - B = ..." hoặc "= ..." thay vì bare
  const terms = chiaHangTu(clean)
  const parsed = terms.map((t) => { const p = parseDonThucCore(t.text); if (!p) return null; return { coef: t.sign === '-' ? mul(R(-1n), p.coef) : p.coef, vars: p.vars } })
  if (parsed.some((p) => !p)) return clean // không parse được thì trả nguyên văn — canon sẽ lệch, lộ ra ở bước máy≠kho thay vì âm thầm sai
  const gop = new Map()
  for (const t of parsed) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
  return hienThiDaThuc(sapXepChuanDaThuc([...gop.values()]))
}
export function evalDaThucKetQua(s) { const t = chuanHoaDaThuc(s); return t || null }

// ── DẠNG 14: Nhân ĐƠN THỨC với ĐƠN THỨC (T108010301, khối 8) ────────────────────────────────────────────────
// Đề "Tính $4x^2yz \cdot (-3xyz^2)$" / bare "$(3a^2b^5c).(6a^3bc^2)$" / "Rút gọn biểu thức sau:\n$D=...$" —
// 2-3 nhân tử, mỗi nhân tử là 1 đơn thức (đôi khi hỗn số/phân số hệ số), nối bằng \cdot hoặc dấu "." nhân
// ngầm hoặc \left(...\right). Đáp số vẫn là 1 ĐƠN THỨC (dùng lại `chuanHoaDonThucKetQua`/`hienThiDonThuc`
// của DẠNG 11) — khác DẠNG 11/12 ở chỗ cần TÁCH RIÊNG từng nhân tử (không gộp 1 lần) để mô phỏng lỗi
// "nhân số mũ thay vì cộng" — `parseDonThucCore` một mình không phân biệt được các nhân tử.
function chuanBiBieuThucNhan(s) { // bỏ \left(/\right)/\cdot, đổi dấu "." nhân ngầm (KHÔNG phải thập phân) thành khoảng trắng để dễ tách nhân tử
  return String(s).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')').replace(/\\cdot/g, ' ').replace(/(?<!\d)\.(?!\d)/g, ' ').trim()
}
function tachNhanTu(s) { // tách chuỗi đã chuẩn bị thành từng nhân tử: 1 cụm ngoặc () hoặc 1 cụm ký tự trần liền nhau
  const out = []; let i = 0
  while (i < s.length) {
    if (s[i] === ' ') { i++; continue }
    if (s[i] === '(') {
      let depth = 1, j = i + 1
      while (j < s.length && depth > 0) { if (s[j] === '(') depth++; else if (s[j] === ')') depth--; j++ }
      out.push(s.slice(i + 1, j - 1)); i = j; continue
    }
    let j = i; while (j < s.length && s[j] !== '(' && s[j] !== ' ') j++
    if (j === i) { i++; continue }
    out.push(s.slice(i, j)); i = j
  }
  return out
}
export function nhanDonThuc(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let expr = m[1].trim()
  const mLabel = expr.match(/^[A-Za-zĐ]\s*=\s*(.+)$/); if (mLabel) expr = mLabel[1].trim() // bỏ nhãn "D=" nếu có
  const factors = tachNhanTu(chuanBiBieuThucNhan(expr)); if (factors.length < 2) return null
  const parsed = factors.map((f) => parseDonThucCore(f)); if (parsed.some((p) => !p || p.hasIrrational)) return null
  let dungCoef = R(1n); const dungVars = new Map()
  for (const p of parsed) { dungCoef = mul(dungCoef, p.coef); for (const [v, e] of p.vars) dungVars.set(v, (dungVars.get(v) ?? 0) + e) }
  const dungText = hienThiDonThuc(dungCoef, dungVars)
  if (!rule) return { text: dungText }
  if (rule === 'R135') { // nhân số mũ của biến thay vì cộng (chỉ ảnh hưởng biến xuất hiện ở ≥2 nhân tử)
    const theoBien = new Map() // v -> [số mũ ở từng nhân tử có chứa v]
    for (const p of parsed) for (const [v, e] of p.vars) { if (!theoBien.has(v)) theoBien.set(v, []); theoBien.get(v).push(e) }
    if (![...theoBien.values()].some((l) => l.length >= 2)) return null
    const varsSai = new Map()
    for (const [v, list] of theoBien) varsSai.set(v, list.length >= 2 ? list.reduce((a, b) => a * b, 1) : list[0])
    const t = hienThiDonThuc(dungCoef, varsSai); if (t === dungText) return null
    return { text: t, ds: 'nhân số mũ của biến thay vì cộng số mũ khi nhân các đơn thức đồng biến' }
  }
  if (rule === 'R136') { // cộng hệ số thay vì nhân hệ số
    let coefSai = R(0n); for (const p of parsed) coefSai = add(coefSai, p.coef)
    const t = hienThiDonThuc(coefSai, dungVars); if (t === dungText) return null
    return { text: t, ds: 'cộng các hệ số lại thay vì nhân, khi nhân đơn thức với đơn thức' }
  }
  if (rule === 'R137') { // chỉ lấy nhân tử đầu tiên (đã rút gọn), quên nhân các nhân tử còn lại
    const t = hienThiDonThuc(parsed[0].coef, parsed[0].vars); if (t === dungText) return null
    return { text: t, ds: 'chỉ lấy nhân tử đầu tiên, quên nhân với các nhân tử còn lại' }
  }
  if (rule === 'R138') { const v = add(dungCoef, R(1n)); const t = hienThiDonThuc(v, dungVars); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số (dự phòng)' } }
  return null
}

// ── DẠNG 15: Nhân ĐƠN THỨC với ĐA THỨC (T108010302, khối 8) ─────────────────────────────────────────────────
// Đề "Tính $2x^2y.(4x^2+6xy)$" / bare "$(-5x)(3x^3+7x^2-x)$" — 1 đơn thức PHÂN PHỐI vào từng hạng tử của 1 đa
// thức trong ngoặc. Đáp số là 1 ĐA THỨC — tái dùng `hienThiDaThuc`/`sapXepChuanDaThuc`/`chuanHoaDaThuc` của
// DẠNG 13, nhưng cần tự tách prefix/inner (không gọi thẳng `khaiTrienDaThuc`) vì rule cần biết RIÊNG prefix
// và từng hạng tử trong ngoặc để mô phỏng "quên phân phối hết"/"quên đổi dấu".
export function nhanDonDaThuc(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let expr = chuanBiBieuThucNhan(m[1].trim())
  const mLabel = expr.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) expr = mLabel[2].trim()
  const mm = expr.match(/^(.*)\(([^()]+)\)\s*$/); if (!mm) return null
  const prefix = parseDonThucCore(mm[1] || '1'); if (!prefix || prefix.hasIrrational) return null
  const innerTerms = chiaHangTu(mm[2]); if (innerTerms.length < 2) return null
  const parsedInner = innerTerms.map((t) => { const p = parseDonThucCore(t.text); if (!p || p.hasIrrational) return null; return { sign: t.sign, p } })
  if (parsedInner.some((x) => !x)) return null
  const distribute = (prefixCoefFn) => parsedInner.map(({ sign, p }, idx) => {
    const innerCoef = sign === '-' ? mul(R(-1n), p.coef) : p.coef
    const coef = mul(prefixCoefFn(idx), innerCoef)
    const vars = new Map(prefix.vars); for (const [v, e] of p.vars) vars.set(v, (vars.get(v) ?? 0) + e)
    return { coef, vars }
  })
  const dungTerms = sapXepChuanDaThuc(distribute(() => prefix.coef).filter((t) => t.coef.p !== 0n))
  const dungText = hienThiDaThuc(dungTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R139') { // chỉ nhân đơn thức với hạng tử ĐẦU TIÊN trong ngoặc, quên phân phối hết
    const only = distribute((idx) => (idx === 0 ? prefix.coef : R(0n))).filter((t) => t.coef.p !== 0n)
    const t = hienThiDaThuc(sapXepChuanDaThuc(only)); if (t === dungText) return null
    return { text: t, ds: 'chỉ nhân đơn thức với hạng tử đầu tiên trong ngoặc, quên phân phối với các hạng tử còn lại' }
  }
  if (rule === 'R140') { // quên đổi dấu khi nhân với các hạng tử SAU — chỉ hạng tử đầu nhân đúng dấu của đơn thức, coi như đơn thức luôn dương ở các hạng tử sau
    if (prefix.coef.p >= 0n || parsedInner.length < 2) return null
    const absPrefix = R(-prefix.coef.p, prefix.coef.q)
    const terms = distribute((idx) => (idx === 0 ? prefix.coef : absPrefix)).filter((t) => t.coef.p !== 0n)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'quên đổi dấu khi nhân đơn thức âm với các hạng tử sau (chỉ hạng tử đầu nhân đúng dấu)' }
  }
  if (rule === 'R141') { // nhân số mũ của biến chung (giữa đơn thức và hạng tử trong ngoặc) thay vì cộng
    const terms = parsedInner.map(({ sign, p }) => {
      const innerCoef = sign === '-' ? mul(R(-1n), p.coef) : p.coef
      const coef = mul(prefix.coef, innerCoef)
      const vars = new Map(); const allV = new Set([...prefix.vars.keys(), ...p.vars.keys()])
      for (const v of allV) { const e1 = prefix.vars.get(v) ?? 0, e2 = p.vars.get(v) ?? 0; vars.set(v, e1 && e2 ? e1 * e2 : e1 + e2) }
      return { coef, vars }
    }).filter((t) => t.coef.p !== 0n)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'nhân số mũ của biến chung giữa đơn thức và hạng tử trong ngoặc, thay vì cộng' }
  }
  if (rule === 'R142') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất
    if (!dungTerms.length) return null
    const top = dungTerms[0]; const v = add(top.coef, R(1n))
    const terms = dungTerms.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}

// ── DẠNG 16: Nhân ĐA THỨC với ĐA THỨC (T108010303, khối 8) ──────────────────────────────────────────────────
// Đề "Tính $(x^2+2y)(xy-y^2)$" — 2-3 nhân tử, MỖI nhân tử là 1 đa thức (≥2 hạng tử), khác DẠNG 15 (1 nhân tử
// luôn là đơn thức). Đáp số vẫn là 1 ĐA THỨC — tái dùng `hienThiDaThuc`/`sapXepChuanDaThuc`/`chuanHoaDaThuc`.
function parseFactorAsPoly(text) { // 1 nhân tử (nội dung TRONG ngoặc) → mảng {coef,vars} từng hạng tử
  const terms = chiaHangTu(text)
  const parsed = terms.map((t) => { const p = parseDonThucCore(t.text); if (!p || p.hasIrrational) return null; return { coef: t.sign === '-' ? mul(R(-1n), p.coef) : p.coef, vars: p.vars } })
  return parsed.some((p) => !p) ? null : parsed
}
function nhanCacDaThuc(factorsPolys) { // tích Cartesian tất cả nhân tử, gộp đồng dạng ở cuối
  let acc = [{ coef: R(1n), vars: new Map() }]
  for (const poly of factorsPolys) {
    const next = []
    for (const a of acc) for (const b of poly) {
      const vars = new Map(a.vars); for (const [v, e] of b.vars) vars.set(v, (vars.get(v) ?? 0) + e)
      next.push({ coef: mul(a.coef, b.coef), vars })
    }
    acc = next
  }
  const gop = new Map()
  for (const t of acc) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
  return [...gop.values()].filter((t) => t.coef.p !== 0n)
}
export function nhanDaThuc(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let expr = chuanBiBieuThucNhan(m[1].trim())
  const mLabel = expr.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) expr = mLabel[2].trim()
  const factorTexts = tachNhanTu(expr); if (factorTexts.length < 2) return null
  const factorsPolys = factorTexts.map(parseFactorAsPoly); if (factorsPolys.some((p) => !p)) return null
  if (!factorsPolys.some((p) => p.length >= 2)) return null // không nhân tử nào ≥2 hạng tử ⇒ thực chất là DẠNG 14/15, không phải dạng này
  const dungTerms = sapXepChuanDaThuc(nhanCacDaThuc(factorsPolys))
  const dungText = hienThiDaThuc(dungTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R143') { // chỉ nhân với hạng tử ĐẦU của các nhân tử SAU nhân tử thứ nhất — quên phân phối hết
    if (!factorsPolys.slice(1).some((p) => p.length >= 2)) return null
    const saiFactors = [factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])]
    const t = hienThiDaThuc(sapXepChuanDaThuc(nhanCacDaThuc(saiFactors))); if (t === dungText) return null
    return { text: t, ds: 'chỉ nhân với hạng tử đầu tiên của các đa thức sau, quên phân phối hết các hạng tử còn lại' }
  }
  if (rule === 'R144') { // quên đổi dấu — coi mọi hạng tử của các nhân tử SAU nhân tử thứ nhất đều dương
    const coDauAm = factorsPolys.slice(1).some((p) => p.some((t) => t.coef.p < 0n)); if (!coDauAm) return null
    const saiFactors = [factorsPolys[0], ...factorsPolys.slice(1).map((p) => p.map((t) => ({ coef: t.coef.p < 0n ? R(-t.coef.p, t.coef.q) : t.coef, vars: t.vars })))]
    const t = hienThiDaThuc(sapXepChuanDaThuc(nhanCacDaThuc(saiFactors))); if (t === dungText) return null
    return { text: t, ds: 'quên đổi dấu, coi mọi hạng tử của các đa thức sau đa thức thứ nhất đều dương' }
  }
  if (rule === 'R145') { // nhân số mũ biến CHUNG giữa các hạng tử được nhân với nhau (trong 1 tổ hợp), thay vì cộng
    let combos = [{ coef: R(1n), varLists: new Map() }]
    for (const poly of factorsPolys) {
      const next = []
      for (const a of combos) for (const b of poly) {
        const varLists = new Map(a.varLists)
        for (const [v, e] of b.vars) { const list = varLists.has(v) ? [...varLists.get(v)] : []; list.push(e); varLists.set(v, list) }
        next.push({ coef: mul(a.coef, b.coef), varLists })
      }
      combos = next
    }
    const terms = combos.map(({ coef, varLists }) => {
      const vars = new Map(); for (const [v, list] of varLists) vars.set(v, list.length >= 2 ? list.reduce((x, y) => x * y, 1) : list[0])
      return { coef, vars }
    })
    const gop = new Map()
    for (const t of terms) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    const t = hienThiDaThuc(sapXepChuanDaThuc([...gop.values()].filter((x) => x.coef.p !== 0n))); if (t === dungText) return null
    return { text: t, ds: 'nhân số mũ của biến chung giữa các hạng tử được nhân, thay vì cộng số mũ' }
  }
  if (rule === 'R146') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất
    if (!dungTerms.length) return null
    const top = dungTerms[0]; const v = add(top.coef, R(1n))
    const terms = dungTerms.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}

// ── DẠNG 17: Chia ĐƠN THỨC cho ĐƠN THỨC (T108010401, khối 8) ────────────────────────────────────────────────
// Đề "Tính $12x^2yz^2 : 4xyz$" / bare "$(24x^7y^5) : (-6x^3y^2)$" — dùng dấu ":" (không phải "/"), chia hệ
// số + TRỪ số mũ từng biến. Đáp số vẫn là 1 ĐƠN THỨC — tái dùng `hienThiDonThuc`/`chuanHoaDonThucKetQua`.
function tachChiaDonThuc(s) { // tách "TỬ : MẪU" tại dấu ":" Ở BẬC NGOÀI CÙNG (ngoài mọi ngoặc)
  let depth = 0
  for (let i = 0; i < s.length; i++) {
    const c = s[i]
    if (c === '(') depth++; else if (c === ')') depth--
    else if (c === ':' && depth === 0) return [s.slice(0, i), s.slice(i + 1)]
  }
  return null
}
export function chiaDonThuc(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const expr = chuanBiBieuThucNhan(m[1].trim())
  const split = tachChiaDonThuc(expr); if (!split) return null
  const tu = parseDonThucCore(split[0]), mau = parseDonThucCore(split[1])
  if (!tu || !mau || tu.hasIrrational || mau.hasIrrational || mau.coef.p === 0n) return null
  const dungVars = new Map(); const allV = new Set([...tu.vars.keys(), ...mau.vars.keys()])
  for (const v of allV) { const e = (tu.vars.get(v) ?? 0) - (mau.vars.get(v) ?? 0); if (e < 0) return null; if (e > 0) dungVars.set(v, e) }
  const dungCoef = div(tu.coef, mau.coef); if (!dungCoef) return null
  const dungText = hienThiDonThuc(dungCoef, dungVars)
  if (!rule) return { text: dungText }
  if (rule === 'R147') { // cộng số mũ thay vì trừ (nhầm như đang NHÂN)
    if (![...allV].some((v) => tu.vars.has(v) && mau.vars.has(v))) return null
    const varsSai = new Map()
    for (const v of allV) { const e1 = tu.vars.get(v) ?? 0, e2 = mau.vars.get(v) ?? 0; const e = e1 && e2 ? e1 + e2 : e1; if (e > 0) varsSai.set(v, e) }
    const t = hienThiDonThuc(dungCoef, varsSai); if (t === dungText) return null
    return { text: t, ds: 'cộng số mũ của biến thay vì trừ (nhầm phép chia thành phép nhân)' }
  }
  if (rule === 'R148') { // quên đổi dấu hệ số khi mẫu âm — coi mẫu luôn dương
    if (mau.coef.p >= 0n) return null
    const v = div(tu.coef, R(-mau.coef.p, mau.coef.q)); if (!v) return null
    const t = hienThiDonThuc(v, dungVars); if (t === dungText) return null
    return { text: t, ds: 'quên đổi dấu hệ số khi chia cho số âm, coi mẫu luôn dương' }
  }
  if (rule === 'R149') { // quên chia hệ số, chỉ trừ số mũ — giữ nguyên hệ số của tử
    const t = hienThiDonThuc(tu.coef, dungVars); if (t === dungText) return null
    return { text: t, ds: 'quên chia hệ số, chỉ trừ số mũ và giữ nguyên hệ số của tử' }
  }
  if (rule === 'R150') { const v = add(dungCoef, R(1n)); const t = hienThiDonThuc(v, dungVars); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số (dự phòng)' } }
  return null
}

// ── DẠNG 18: Chia ĐA THỨC cho ĐƠN THỨC (T108010402, khối 8) ─────────────────────────────────────────────────
// Đề "Tính: $(10x^5y^3 - 15x^3y^2 + 5x^4y^4) : x^3y$" — từng hạng tử của đa thức tử chia RIÊNG cho đơn thức
// mẫu. Đáp số là 1 ĐA THỨC — tái dùng `hienThiDaThuc`/`sapXepChuanDaThuc`/`chuanHoaDaThuc` của DẠNG 13.
function boNgoacNgoai(s) { // bỏ 1 lớp ngoặc bọc NGOÀI CÙNG cả chuỗi (không bỏ nếu ngoặc đóng sớm giữa chừng, vd "(a)+(b)")
  s = s.trim(); if (s[0] !== '(' || s[s.length - 1] !== ')') return s
  let depth = 0
  for (let i = 0; i < s.length; i++) { if (s[i] === '(') depth++; else if (s[i] === ')') { depth--; if (depth === 0 && i !== s.length - 1) return s } }
  return s.slice(1, -1)
}
export function chiaDaChoDon(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const expr = chuanBiBieuThucNhan(m[1].trim())
  const split = tachChiaDonThuc(expr); if (!split) return null
  const tuTerms = chiaHangTu(boNgoacNgoai(split[0])); if (tuTerms.length < 2) return null
  const mau = parseDonThucCore(split[1]); if (!mau || mau.hasIrrational || mau.coef.p === 0n) return null
  const parsedTu = tuTerms.map((t) => { const p = parseDonThucCore(t.text); if (!p || p.hasIrrational) return null; return { sign: t.sign, p } })
  if (parsedTu.some((x) => !x)) return null
  const varsChiaDung = (tuVars) => {
    const vars = new Map(); const allV = new Set([...tuVars.keys(), ...mau.vars.keys()])
    for (const v of allV) { const e = (tuVars.get(v) ?? 0) - (mau.vars.get(v) ?? 0); if (e < 0) return null; if (e > 0) vars.set(v, e) }
    return vars
  }
  const dungTerms = []
  for (const x of parsedTu) {
    const tuCoef = x.sign === '-' ? mul(R(-1n), x.p.coef) : x.p.coef
    const coef = div(tuCoef, mau.coef); const vars = varsChiaDung(x.p.vars)
    if (!coef || !vars) return null
    dungTerms.push({ coef, vars })
  }
  const dungSorted = sapXepChuanDaThuc(dungTerms)
  const dungText = hienThiDaThuc(dungSorted)
  if (!rule) return { text: dungText }
  if (rule === 'R151') { // chỉ chia hạng tử đầu tiên cho đơn thức, các hạng tử sau giữ nguyên (quên chia hết)
    const terms = parsedTu.map((x, idx) => {
      if (idx === 0) return dungTerms[0]
      const tuCoef = x.sign === '-' ? mul(R(-1n), x.p.coef) : x.p.coef
      return { coef: tuCoef, vars: x.p.vars }
    })
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'chỉ chia hạng tử đầu tiên cho đơn thức, các hạng tử sau giữ nguyên (quên chia hết đa thức)' }
  }
  if (rule === 'R152') { // cộng số mũ thay vì trừ, cho từng hạng tử có biến chung với mẫu
    if (!parsedTu.some((x) => [...x.p.vars.keys()].some((v) => mau.vars.has(v)))) return null
    const terms = parsedTu.map((x) => {
      const tuCoef = x.sign === '-' ? mul(R(-1n), x.p.coef) : x.p.coef
      const coef = div(tuCoef, mau.coef); if (!coef) return null
      const vars = new Map(); const allV = new Set([...x.p.vars.keys(), ...mau.vars.keys()])
      for (const v of allV) { const e1 = x.p.vars.get(v) ?? 0, e2 = mau.vars.get(v) ?? 0; const e = e1 && e2 ? e1 + e2 : e1; if (e > 0) vars.set(v, e) }
      return { coef, vars }
    })
    if (terms.some((t) => !t)) return null
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'cộng số mũ của biến thay vì trừ, khi chia từng hạng tử của đa thức cho đơn thức' }
  }
  if (rule === 'R153') { // quên chia hệ số từng hạng tử, chỉ trừ số mũ — giữ nguyên hệ số của đa thức
    const terms = parsedTu.map((x, idx) => { const tuCoef = x.sign === '-' ? mul(R(-1n), x.p.coef) : x.p.coef; return { coef: tuCoef, vars: dungTerms[idx].vars } })
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'quên chia hệ số từng hạng tử, chỉ trừ số mũ và giữ nguyên hệ số của đa thức' }
  }
  if (rule === 'R154') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất
    if (!dungSorted.length) return null
    const top = dungSorted[0]; const v = add(top.coef, R(1n))
    const terms = dungSorted.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}

// ── DẠNG 19: Chia ĐA THỨC cho ĐA THỨC MỘT BIẾN (T108010403, khối 8) — phép chia đa thức DÀI ─────────────────
// Đề "Tính : $x^3-6x^2+11x-3 : (x-1)$" — khác hẳn DẠNG 15-18 (không phải phân phối rồi gộp), cần thuật toán
// CHIA DÀI thật sự: lặp "chia hạng tử dẫn đầu → trừ tích ngược lại" tới khi bậc dư < bậc mẫu. Đáp số dạng
// "THƯƠNG dư DƯ" — kho đôi khi bỏ hẳn "dư $0$" khi chia hết (2/42 câu), nên canon PHẢI coi 2 cách viết này
// tương đương (mặc định dư=0 khi không thấy chữ "dư").
function daThucSangMangHeSo(terms, bien) { // {coef,vars}[] (đúng 1 biến) → mảng hệ số theo bậc, index=bậc, coefs[0]=hằng số
  const maxDeg = Math.max(0, ...terms.map((t) => t.vars.get(bien) ?? 0))
  const coefs = new Array(maxDeg + 1).fill(null).map(() => R(0n))
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; coefs[d] = add(coefs[d], t.coef) }
  return coefs
}
function mangHeSoSangDaThuc(coefs, bien) { return coefs.map((c, d) => ({ coef: c, vars: d > 0 ? new Map([[bien, d]]) : new Map() })) } // hienThiDaThuc tự lọc hệ số 0 + sắp bậc giảm dần
function chiaDaThucChuan(tuCoefs, mauCoefs, saiDauTru) { // thuật toán chia dài chuẩn; saiDauTru=true ⇒ mô phỏng lỗi cộng thay vì trừ ở MỌI bước
  const rem = [...tuCoefs]; const mauDeg = mauCoefs.length - 1
  const thuongDeg = rem.length - 1 - mauDeg
  if (thuongDeg < 0 || mauCoefs[mauDeg].p === 0n) return null
  const thuong = new Array(thuongDeg + 1).fill(R(0n))
  for (let d = rem.length - 1; d >= mauDeg; d--) {
    const q = div(rem[d], mauCoefs[mauDeg]); if (!q) return null
    thuong[d - mauDeg] = q
    for (let k = 0; k <= mauDeg; k++) { const delta = mul(q, mauCoefs[k]); rem[d - mauDeg + k] = saiDauTru ? add(rem[d - mauDeg + k], delta) : sub(rem[d - mauDeg + k], delta) }
  }
  return { thuong, du: rem.slice(0, mauDeg) }
}
function chiaMotBuoc(tuCoefs, mauCoefs) { // CHỈ 1 vòng lặp đầu tiên rồi dừng (mô phỏng "chia hạng tử dẫn đầu 1 lần, quên lặp lại")
  const rem = [...tuCoefs]; const mauDeg = mauCoefs.length - 1; const d = rem.length - 1
  if (d < mauDeg || mauCoefs[mauDeg].p === 0n) return null
  const q = div(rem[d], mauCoefs[mauDeg]); if (!q) return null
  const thuong = new Array(d - mauDeg + 1).fill(R(0n)); thuong[d - mauDeg] = q
  for (let k = 0; k <= mauDeg; k++) rem[d - mauDeg + k] = sub(rem[d - mauDeg + k], mul(q, mauCoefs[k]))
  return { thuong, du: rem.slice(0, d) } // "dư" ở đây vẫn còn bậc ≥ bậc mẫu (CHƯA chuẩn) — đúng ý đồ mô phỏng lỗi dừng sớm
}
export function chiaDaThucMotBien(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const expr = chuanBiBieuThucNhan(m[1].trim())
  const split = tachChiaDonThuc(expr); if (!split) return null
  const tuTerms = parseFactorAsPoly(boNgoacNgoai(split[0])), mauTerms = parseFactorAsPoly(boNgoacNgoai(split[1]))
  if (!tuTerms || !mauTerms) return null
  const bienSet = new Set(); for (const t of [...tuTerms, ...mauTerms]) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null // hơn 1 biến — ngoài phạm vi dạng này (đã có dạng riêng cho đa biến)
  const bien = [...bienSet][0] || 'x'
  const tuCoefs = daThucSangMangHeSo(tuTerms, bien), mauCoefs = daThucSangMangHeSo(mauTerms, bien)
  const dung = chiaDaThucChuan(tuCoefs, mauCoefs); if (!dung) return null
  const ghepText = (thuong, du) => `${hienThiDaThuc(mangHeSoSangDaThuc(thuong, bien))} dư ${hienThiDaThuc(mangHeSoSangDaThuc(du, bien))}`
  const dungText = ghepText(dung.thuong, dung.du)
  if (!rule) return { text: dungText }
  if (rule === 'R155') { // dừng sau 1 bước — chỉ chia đúng hạng tử dẫn đầu, không lặp lại cho các hạng tử còn thiếu
    const b1 = chiaMotBuoc(tuCoefs, mauCoefs); if (!b1) return null
    const t = ghepText(b1.thuong, b1.du); if (t === dungText) return null
    return { text: t, ds: 'chỉ chia hạng tử dẫn đầu 1 lần rồi dừng, không lặp lại phép chia cho các hạng tử còn thiếu' }
  }
  if (rule === 'R156') { // nhầm dấu khi trừ ở mỗi bước (cộng thay vì trừ tích ngược lại)
    const sai = chiaDaThucChuan(tuCoefs, mauCoefs, true); if (!sai) return null
    const t = ghepText(sai.thuong, sai.du); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu khi trừ ở mỗi bước của phép chia dài (cộng thay vì trừ tích ngược lại)' }
  }
  if (rule === 'R157') { // quên ghi phần dư dù dư khác 0 — trình bày như thể chia hết
    const duZero = hienThiDaThuc([]); if (hienThiDaThuc(mangHeSoSangDaThuc(dung.du, bien)) === duZero) return null
    const t = `${hienThiDaThuc(mangHeSoSangDaThuc(dung.thuong, bien))} dư ${duZero}`; if (t === dungText) return null
    return { text: t, ds: 'quên ghi phần dư, trình bày như thể chia hết' }
  }
  if (rule === 'R158') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử đầu của thương
    if (!dung.thuong.length) return null
    const topIdx = dung.thuong.length - 1; const thuongSai = [...dung.thuong]; thuongSai[topIdx] = add(thuongSai[topIdx], R(1n))
    const t = ghepText(thuongSai, dung.du); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử đầu của thương (dự phòng)' }
  }
  return null
}
export function chuanHoaChiaDaThuc(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const parts = clean.split(/dư/) // KHÔNG dùng \b quanh "dư" — \b của JS coi "ư" không phải \w nên biên từ sai, tách hụt
  return `${chuanHoaDaThuc(parts[0])} dư ${parts.length > 1 ? chuanHoaDaThuc(parts[1]) : '0'}`
}
export function evalChiaDaThucKetQua(s) { const t = chuanHoaChiaDaThuc(s); return t || null }
