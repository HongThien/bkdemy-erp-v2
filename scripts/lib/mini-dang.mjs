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
function chuanBiBieuThucNhan(s) { // bỏ \left(/\right)/\cdot, đổi dấu "." nhân ngầm (KHÔNG phải thập phân) thành khoảng trắng để dễ tách nhân tử; chuẩn hoá dấu gạch ngang lạ (–/—, lỗi copy-paste từ Word) về dấu trừ "-" thường
  return String(s).replace(/\\left\(/g, '(').replace(/\\right\)/g, ')').replace(/\\cdot/g, ' ').replace(/[‒-―−]/g, '-').replace(/(?<!\d)\.(?!\d)/g, ' ').trim()
}
function tachNhanTu(s) { // tách chuỗi đã chuẩn bị thành từng nhân tử: 1 cụm ngoặc () (có thể kèm luỹ thừa "^n" → lặp lại n lần) hoặc 1 cụm ký tự trần liền nhau
  const out = []; let i = 0
  while (i < s.length) {
    if (s[i] === ' ') { i++; continue }
    if (s[i] === '(') {
      let depth = 1, j = i + 1
      while (j < s.length && depth > 0) { if (s[j] === '(') depth++; else if (s[j] === ')') depth--; j++ }
      const content = s.slice(i + 1, j - 1); i = j
      const mPow = s.slice(i).match(/^\^\{?(\d+)\}?/); const n = mPow ? Number(mPow[1]) : 1; if (mPow) i += mPow[0].length
      for (let k = 0; k < n; k++) out.push(content)
      continue
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

// ── DẠNG 20: Tìm m nguyên để đa thức chia hết cho đơn thức (T108010404, khối 8) ──────────────────────────────
// Đề LUÔN đúng 1 khuôn: "Tìm m nguyên để $(C1 x^m y^{p1} + C2 x^q y^{p2}) chia hết cho $C3 x^q y^m$" — hạng
// tử 2 CÙNG số mũ x với mẫu (q), mẫu có số mũ y là ẨN m. Điều kiện: m≥q (từ hạng 1, mũ x) và m≤p1 (hạng 1,
// mũ y) và m≤p2 (hạng 2, mũ y) ⇒ đáp số là khoảng nguyên [q, min(p1,p2)]. Không dùng `parseDonThucCore`
// (số mũ có thể là CHỮ "m", không phải số) — viết trích xuất riêng bằng regex cho đúng khuôn cứng này.
function trichMuBienSo(s) { // "7x^5 y^m" → Map(biến → số mũ), số mũ là number HOẶC chuỗi (ẩn, vd "m")
  const vars = new Map(); const re = /([a-zA-Z])\^\{?([a-zA-Z]+|\d+)\}?/g; let mm
  while ((mm = re.exec(s))) vars.set(mm[1], /^\d+$/.test(mm[2]) ? Number(mm[2]) : mm[2])
  return vars
}
function ghepDsKhoang(lo, hi) { const out = []; for (let v = lo; v <= hi; v++) out.push(v); return out.join('; ') }
export function dieuKienChiaHetDonThuc(noiDung, rule) {
  const mm = String(noiDung).match(/\$\(?(.+?)\)?\$\s*chia hết cho\s*\$(.+?)\$/); if (!mm) return null
  const terms = chiaHangTu(boNgoacNgoai(mm[1])); if (terms.length !== 2) return null
  const t1 = trichMuBienSo(terms[0].text), t2 = trichMuBienSo(terms[1].text), mau = trichMuBienSo(mm[2])
  // biến ẩn (vd "m") = biến có giá trị KHÔNG PHẢI số trong mẫu; biến còn lại trong mẫu có số mũ q (số).
  const anEntry = [...mau.entries()].find(([, v]) => typeof v === 'string'); if (!anEntry) return null
  const [bienAn, tenAn] = anEntry
  const bienKhac = [...mau.keys()].find((v) => v !== bienAn); if (!bienKhac) return null
  const q = mau.get(bienKhac); if (typeof q !== 'number') return null
  // hạng tử "chứa ẩn" = hạng có số mũ của bienKhac ĐÚNG BẰNG tên ẩn (vd x^m); hạng còn lại phải khớp q với mẫu.
  const t1CoAn = t1.get(bienKhac) === tenAn, t2CoAn = t2.get(bienKhac) === tenAn
  const [hangCoAn, hangKhac] = t1CoAn ? [t1, t2] : (t2CoAn ? [t2, t1] : [null, null])
  if (!hangCoAn || hangKhac.get(bienKhac) !== q) return null
  const p1 = hangCoAn.get(bienAn), p2 = hangKhac.get(bienAn)
  if (typeof p1 !== 'number' || typeof p2 !== 'number') return null
  const lo = q, hi = Math.min(p1, p2); if (lo > hi) return null
  const dungText = ghepDsKhoang(lo, hi)
  if (!rule) return { text: dungText }
  if (rule === 'R159') { // quên điều kiện của hạng tử KHÔNG chứa ẩn (chỉ xét hạng có ẩn) — cận trên thành p1 thay vì min(p1,p2)
    if (p1 <= p2) return null
    const t = ghepDsKhoang(lo, p1); if (t === dungText) return null
    return { text: t, ds: 'quên xét điều kiện chia hết của hạng tử còn lại, chỉ xét hạng tử có chứa ẩn' }
  }
  if (rule === 'R160') { // tưởng chỉ có 1 giá trị duy nhất — lấy cận dưới (bỏ qua các giá trị lớn hơn cũng thoả)
    if (lo === hi) return null
    const t = String(lo); if (t === dungText) return null
    return { text: t, ds: 'tưởng chỉ có 1 giá trị duy nhất thoả mãn, lấy cận dưới của khoảng' }
  }
  if (rule === 'R161') { // tưởng chỉ có 1 giá trị duy nhất — lấy cận trên
    if (lo === hi) return null
    const t = String(hi); if (t === dungText) return null
    return { text: t, ds: 'tưởng chỉ có 1 giá trị duy nhất thoả mãn, lấy cận trên của khoảng' }
  }
  if (rule === 'R162') { // dự phòng — lệch cận dưới của khoảng xuống 1 đơn vị
    const t = ghepDsKhoang(lo - 1, hi); if (t === dungText) return null
    return { text: t, ds: 'tính lệch cận dưới của khoảng xuống 1 đơn vị (dự phòng)' }
  }
  if (rule === 'R163') { // lệch CẢ khoảng lên 1 đơn vị (tính nhầm mốc xuất phát của cả 2 đầu mút)
    const t = ghepDsKhoang(lo + 1, hi + 1); if (t === dungText) return null
    return { text: t, ds: 'tính lệch cả khoảng lên 1 đơn vị' }
  }
  return null
}
export function chuanHoaDkChiaHet(s) {
  const nums = String(s ?? '').replace(/\$/g, '').split(';').map((x) => x.trim()).filter(Boolean).map(Number)
  if (!nums.length || nums.some((n) => !Number.isFinite(n))) return String(s ?? '').trim()
  return [...new Set(nums)].sort((a, b) => a - b).join('; ')
}
export function evalDkChiaHetKetQua(s) { const t = chuanHoaDkChiaHet(s); return t || null }

// ── DẠNG 21: Rút gọn biểu thức 1 biến — TỔNG các TÍCH đa thức (T108010501, khối 8) ──────────────────────────
// Đề "A = $(x^2+2x+3)(x-1) - (x^2-x+1)(x-1) + 3x^2 + 2$" — tổng quát hơn DẠNG 13/16: mỗi hạng tử ở bậc
// NGOÀI CÙNG (tách bằng `chiaHangTu`) có thể là 1 TÍCH nhiều nhân tử (tách tiếp bằng `tachNhanTu`) hoặc 1
// đa thức trần. Tái dùng TOÀN BỘ máy DẠNG 13/16 (`parseFactorAsPoly`, `nhanCacDaThuc`, `hienThiDaThuc`).
function extractDfracArgsPlain(text) { // "\dfrac{A}{B}" (PHỦ HẾT text, không có gì thừa) → [A, B] theo ĐỘ SÂU ngoặc nhọn, hoặc null
  if (!text.startsWith('\\dfrac{')) return null
  let i = 7, depth = 1; const start1 = i
  while (i < text.length && depth > 0) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; i++ }
  const a = text.slice(start1, i - 1)
  if (text[i] !== '{') return null
  i++; depth = 1; const start2 = i
  while (i < text.length && depth > 0) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; i++ }
  const b = text.slice(start2, i - 1)
  return i === text.length ? [a, b] : null
}
function parseHangTuBieuThuc(text) { // 1 hạng tử bậc ngoài — có thể là TÍCH nhiều nhân tử, 1 phép CHIA đa thức:đơn thức (vd "(6x^3-3x^2):(x^2)"), hoặc "\dfrac{tử NHIỀU HẠNG}{mẫu SỐ}" (vd "\dfrac{x-1}{-3}" — khác nhánh \dfrac 1-hạng đã có sẵn trong parseDonThucCore, dùng cho hệ số phân số của PT/BPT, KHÔNG phải phân thức mẫu chứa biến)
  const divSplit = tachChiaDonThuc(text)
  if (divSplit) {
    const tuTerms = parseFactorAsPoly(boNgoacNgoai(divSplit[0])); if (!tuTerms) return null
    const mau = parseDonThucCore(boNgoacNgoai(divSplit[1])); if (!mau || mau.hasIrrational || mau.coef.p === 0n) return null
    const out = []
    for (const p of tuTerms) {
      const vars = new Map(); const allV = new Set([...p.vars.keys(), ...mau.vars.keys()])
      for (const v of allV) { const e = (p.vars.get(v) ?? 0) - (mau.vars.get(v) ?? 0); if (e < 0) return null; if (e > 0) vars.set(v, e) }
      const coef = div(p.coef, mau.coef); if (!coef) return null
      out.push({ coef, vars })
    }
    return out
  }
  const dfArgs = extractDfracArgsPlain(text)
  if (dfArgs && /^-?\d+$/.test(dfArgs[1].trim())) {
    const tuPoly = phanTichDaThucCumNhanTu(dfArgs[0]); if (tuPoly) { const mauVal = R(BigInt(dfArgs[1].trim())); if (mauVal.p !== 0n) return tuPoly.map((t) => ({ coef: div(t.coef, mauVal), vars: t.vars })) }
  }
  const factorTexts = tachNhanTu(text); if (!factorTexts.length) return null
  const factorsPolys = factorTexts.map(parseFactorAsPoly); if (factorsPolys.some((p) => !p)) return null
  return nhanCacDaThuc(factorsPolys)
}
export function rutGonBieuThuc(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim() // nhãn "C =" đôi khi nằm TRONG $...$ (không nhất quán giữa các câu)
  const expr = chuanBiBieuThucNhan(raw)
  const topTerms = chiaHangTu(expr); if (!topTerms.length) return null
  const hangList = topTerms.map((t) => ({ sign: t.sign, text: t.text, terms: parseHangTuBieuThuc(t.text) }))
  if (hangList.some((h) => !h.terms)) return null
  const gopLai = (layTerms) => {
    const gop = new Map()
    for (const h of hangList) for (const [idx, p] of layTerms(h).entries()) {
      const c = h.sign === '-' ? mul(R(-1n), p.coef) : p.coef
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    }
    return [...gop.values()]
  }
  const dungTerms = sapXepChuanDaThuc(gopLai((h) => h.terms))
  const dungText = hienThiDaThuc(dungTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R164') { // quên đổi dấu khi trừ cả cụm đã nhân — chỉ đổi dấu hạng tử ĐẦU của kết quả tích, các hạng tử sau coi như dương
    if (!hangList.some((h) => h.sign === '-' && h.terms.length >= 2)) return null
    const gop = new Map()
    for (const h of hangList) h.terms.forEach((p, idx) => {
      const c = h.sign === '-' && idx > 0 ? p.coef : (h.sign === '-' ? mul(R(-1n), p.coef) : p.coef)
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    })
    const t = hienThiDaThuc(sapXepChuanDaThuc([...gop.values()])); if (t === dungText) return null
    return { text: t, ds: 'quên đổi dấu khi trừ cả cụm tích đã nhân — chỉ đổi dấu hạng tử đầu, các hạng tử sau coi như dương' }
  }
  if (rule === 'R165') { // chỉ nhân với hạng tử đầu của nhân tử thứ 2 trở đi trong mỗi cặp ngoặc, quên phân phối hết
    let coApDung = false
    const layTerms = (h) => {
      const factorTexts = tachNhanTu(h.text)
      if (factorTexts.length < 2) return h.terms
      const factorsPolys = factorTexts.map(parseFactorAsPoly)
      if (!factorsPolys.slice(1).some((p) => p.length >= 2)) return h.terms
      coApDung = true
      return nhanCacDaThuc([factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])])
    }
    const terms = gopLai(layTerms); if (!coApDung) return null
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'chỉ nhân với hạng tử đầu của nhân tử thứ hai trở đi trong mỗi cặp ngoặc, quên phân phối hết' }
  }
  if (rule === 'R166') { // nhân số mũ biến CHUNG giữa các hạng tử được nhân trong 1 tổ hợp, thay vì cộng
    let coApDung = false
    const layTerms = (h) => {
      const factorTexts = tachNhanTu(h.text)
      if (factorTexts.length < 2) return h.terms
      coApDung = true
      const factorsPolys = factorTexts.map(parseFactorAsPoly)
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
      return combos.map(({ coef, varLists }) => {
        const vars = new Map(); for (const [v, list] of varLists) vars.set(v, list.length >= 2 ? list.reduce((x, y) => x * y, 1) : list[0])
        return { coef, vars }
      })
    }
    const terms = gopLai(layTerms); if (!coApDung) return null
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'nhân số mũ của biến chung giữa các hạng tử được nhân, thay vì cộng số mũ' }
  }
  if (rule === 'R167') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất
    if (!dungTerms.length) return null
    const top = dungTerms[0]; const v = add(top.coef, R(1n))
    const terms = dungTerms.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}

// ── DẠNG 22: Tìm x ứng dụng rút gọn biểu thức (T108010503, khối 8) ──────────────────────────────────────────
// Đề "$(2x+1)(x-1)-(x-2)(2x-1)=4$" — VẾ TRÁI rút gọn y hệt DẠNG 21 (tổng các tích), theo thiết kế đề LUÔN
// rút gọn về BẬC NHẤT (mọi hạng bậc ≥2 tự triệt tiêu) rồi giải x. Đáp số là 1 GIÁ TRỊ HỮU TỈ ⇒ đi qua
// SPECIAL_DANG (trả `{value: Rat}`, KHÔNG qua TEXT_DANG) — tái dùng nguyên `parseHangTuBieuThuc` DẠNG 21.
export function timXQuaRutGon(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const parts = m[1].trim().split('='); if (parts.length !== 2) return null
  const parseVe = (raw, dauGoc) => { // 1 vế phương trình → [{sign,text,terms}], dauGoc lật dấu nếu vế này bị CHUYỂN sang bên kia
    const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw.trim())); if (!topTerms.length) return null
    const out = topTerms.map((t) => ({ sign: dauGoc ? t.sign : (t.sign === '-' ? '+' : '-'), text: t.text, terms: parseHangTuBieuThuc(t.text) }))
    return out.some((h) => !h.terms) ? null : out
  }
  const veTrai = parseVe(parts[0], true), vePhai = parseVe(parts[1], false) // vế phải CHUYỂN sang trái ⇒ lật dấu — quy về "vế trái - vế phải = 0"
  if (!veTrai || !vePhai) return null
  const hangList = [...veTrai, ...vePhai]
  const gopLai = (layTerms) => {
    const gop = new Map()
    for (const h of hangList) for (const p of layTerms(h)) {
      const c = h.sign === '-' ? mul(R(-1n), p.coef) : p.coef
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    }
    return [...gop.values()].filter((x) => x.coef.p !== 0n)
  }
  const giaiBacNhat = (terms) => { // đa thức bậc nhất 1 biến {coef,vars}[] → {heSoX, hangSo} hoặc null nếu không phải bậc nhất
    const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
    if (bienSet.size > 1) return null
    const bien = [...bienSet][0]
    let heSoX = R(0n), hangSo = R(0n)
    for (const t of terms) { const d = bien ? (t.vars.get(bien) ?? 0) : 0; if (d > 1) return null; if (d === 1) heSoX = add(heSoX, t.coef); else hangSo = add(hangSo, t.coef) }
    return { heSoX, hangSo }
  }
  // Sau khi quy về 1 vế: heSoX·x + hangSo = 0 ⇒ x = -hangSo/heSoX
  const dungBN = giaiBacNhat(gopLai((h) => h.terms)); if (!dungBN || dungBN.heSoX.p === 0n) return null
  const dungX = div(mul(R(-1n), dungBN.hangSo), dungBN.heSoX); if (!dungX) return null
  if (!rule) return { value: dungX }
  if (rule === 'R168') { // quên đổi dấu khi chuyển hằng số sang vế kia — coi heSoX·x = hangSo (thay vì = -hangSo)
    const v = div(dungBN.hangSo, dungBN.heSoX); if (!v || cmp(v, dungX) === 0) return null
    return { value: v, ds: 'quên đổi dấu khi chuyển hằng số sang vế phải' }
  }
  if (rule === 'R169') { // rút gọn sai — chỉ nhân hạng tử đầu của nhân tử thứ 2 trở đi trong mỗi cặp ngoặc, quên phân phối hết
    let coApDung = false
    const layTerms = (h) => {
      const factorTexts = tachNhanTu(h.text)
      if (factorTexts.length < 2) return h.terms
      const factorsPolys = factorTexts.map(parseFactorAsPoly)
      if (factorsPolys.some((p) => !p) || !factorsPolys.slice(1).some((p) => p.length >= 2)) return h.terms
      coApDung = true
      return nhanCacDaThuc([factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])])
    }
    const saiTerms = gopLai(layTerms); if (!coApDung) return null
    const saiBN = giaiBacNhat(saiTerms); if (!saiBN || saiBN.heSoX.p === 0n) return null
    const v = div(mul(R(-1n), saiBN.hangSo), saiBN.heSoX); if (!v || cmp(v, dungX) === 0) return null
    return { value: v, ds: 'chỉ nhân với hạng tử đầu của nhân tử thứ hai trở đi trong mỗi cặp ngoặc, quên phân phối hết' }
  }
  if (rule === 'R170') { // quên chia hệ số x — coi hệ số x luôn là 1
    const v = mul(R(-1n), dungBN.hangSo); if (!v || cmp(v, dungX) === 0) return null
    return { value: v, ds: 'quên chia hệ số của x, coi hệ số x luôn bằng 1' }
  }
  if (rule === 'R171') { const v = add(dungX, R(1n)); if (cmp(v, dungX) === 0) return null; return { value: v, ds: 'tính lệch nghiệm x thêm 1 đơn vị (dự phòng)' } }
  if (rule === 'R263') { // rescue cho T108020602 — cứu ca hệ số x = 1 khiến R169/R170 trùng đáp số đúng (như T108020602004/010)
    const v = sub(dungX, R(1n)); if (cmp(v, dungX) === 0) return null
    return { value: v, ds: 'tính lệch nghiệm x trừ 1 đơn vị theo chiều ngược lại' }
  }
  return null
}

// ── DẠNG 23: Tính giá trị biểu thức áp dụng rút gọn (T108010504, khối 8) ────────────────────────────────────
// Đề "Cho $A = x(x^2+2y^2)-xy(x+2y)+y(x^2-1).$\nTính giá trị của A khi $x=1, y=10$" — ĐA BIẾN (x,y hoặc
// a,b hoặc p,q...). Rút gọn y hệt DẠNG 21 (đã hỗ trợ đa biến sẵn qua Map biến→mũ) rồi THẾ SỐ. Nhãn "A=" và
// vị trí khối thế số ($ riêng mỗi biến hay gộp 1 khối) không nhất quán giữa các câu — trích bằng cách quét
// TẤT CẢ đoạn $...$ ngoài đoạn đầu tiên (biểu thức) tìm mọi cặp "biến=giá_trị".
export function tinhGiaTriRutGon(noiDung, rule) {
  const segs = [...String(noiDung).matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  let exprRaw = segs[0].trim()
  const mLabel = exprRaw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) exprRaw = mLabel[2].trim()
  const expr = chuanBiBieuThucNhan(exprRaw)
  const topTerms = chiaHangTu(expr); if (!topTerms.length) return null
  const hangList = topTerms.map((t) => ({ sign: t.sign, text: t.text, terms: parseHangTuBieuThuc(t.text) }))
  if (hangList.some((h) => !h.terms)) return null
  const gopLai = (layTerms) => {
    const gop = new Map()
    for (const h of hangList) for (const p of layTerms(h)) {
      const c = h.sign === '-' ? mul(R(-1n), p.coef) : p.coef
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    }
    return [...gop.values()].filter((x) => x.coef.p !== 0n)
  }
  const dungTerms = gopLai((h) => h.terms)
  const subText = segs.slice(1).join(', ')
  const gia = new Map(); const reGan = /([a-zA-Z])\s*=\s*(-?\\dfrac\{[^{}]+\}\{[^{}]+\}|-?\d+(?:\.\d+)?)/g; let gm
  while ((gm = reGan.exec(subText))) { const p = parseDonThucCore(gm[2]); if (!p || p.vars.size > 0 || p.hasIrrational) return null; gia.set(gm[1], p.coef) }
  if (gia.size < 1) return null
  const theSo = (terms, giaTri) => {
    let total = R(0n)
    for (const t of terms) {
      let v = t.coef
      for (const [bien, e] of t.vars) { const gv = giaTri.get(bien); if (!gv) return null; for (let k = 0; k < e; k++) v = mul(v, gv) }
      total = add(total, v)
    }
    return total
  }
  const dungVal = theSo(dungTerms, gia); if (!dungVal) return null
  if (!rule) return { value: dungVal }
  if (rule === 'R172') { // rút gọn sai — chỉ nhân hạng tử đầu của nhân tử thứ 2 trở đi trong mỗi cặp ngoặc, quên phân phối hết
    let coApDung = false
    const layTerms = (h) => {
      const factorTexts = tachNhanTu(h.text)
      if (factorTexts.length < 2) return h.terms
      const factorsPolys = factorTexts.map(parseFactorAsPoly)
      if (factorsPolys.some((p) => !p) || !factorsPolys.slice(1).some((p) => p.length >= 2)) return h.terms
      coApDung = true
      return nhanCacDaThuc([factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])])
    }
    const saiTerms = gopLai(layTerms); if (!coApDung) return null
    const v = theSo(saiTerms, gia); if (!v || cmp(v, dungVal) === 0) return null
    return { value: v, ds: 'chỉ nhân với hạng tử đầu của nhân tử thứ hai trở đi trong mỗi cặp ngoặc, quên phân phối hết' }
  }
  if (rule === 'R173') { // quên đổi dấu khi trừ cả cụm tích đã nhân — chỉ đổi dấu hạng tử đầu, các hạng tử sau coi như dương
    if (!hangList.some((h) => h.sign === '-' && h.terms.length >= 2)) return null
    const gop = new Map()
    for (const h of hangList) h.terms.forEach((p, idx) => {
      const c = h.sign === '-' && idx > 0 ? p.coef : (h.sign === '-' ? mul(R(-1n), p.coef) : p.coef)
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    })
    const v = theSo([...gop.values()], gia); if (!v || cmp(v, dungVal) === 0) return null
    return { value: v, ds: 'quên đổi dấu khi trừ cả cụm tích đã nhân — chỉ đổi dấu hạng tử đầu, các hạng tử sau coi như dương' }
  }
  if (rule === 'R174') { // hoán đổi nhầm giá trị thế của 2 biến (rút gọn đúng, thế số sai)
    const bienList = [...gia.keys()]; if (bienList.length < 2) return null
    const giaSai = new Map(gia); giaSai.set(bienList[0], gia.get(bienList[1])); giaSai.set(bienList[1], gia.get(bienList[0]))
    const v = theSo(dungTerms, giaSai); if (!v || cmp(v, dungVal) === 0) return null
    return { value: v, ds: `hoán đổi nhầm giá trị thế của ${bienList[0]} và ${bienList[1]}` }
  }
  if (rule === 'R175') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch kết quả 1 đơn vị (dự phòng)' } }
  if (rule === 'R176') { const v = sub(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch kết quả 1 đơn vị theo chiều ngược lại (dự phòng)' } }
  if (rule === 'R177') { const v = mul(R(-1n), dungVal); if (!v || cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính sai dấu kết quả cuối cùng' } }
  return null
}

// ── DẠNG 24: Khai triển hằng đẳng thức bình phương tổng/hiệu (T108020101, khối 8) ───────────────────────────
// Đề "$(x+1)^2 = ......$" / "$(2x-1)^2=......$" — luôn ĐÚNG 1 nhị thức bình phương. Nhờ `tachNhanTu` vừa mở
// rộng hỗ trợ "(...)^n", việc rút gọn dùng lại NGUYÊN `parseHangTuBieuThuc` (DẠNG 21). Rule thì viết riêng
// (không tái dùng R164-166) vì đây là lỗi KINH ĐIỂN của hằng đẳng thức, không phải lỗi nhân đa thức chung.
export function khaiTrienBinhPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const expr = chuanBiBieuThucNhan(m[1].replace(/=.*$/, '').trim())
  const topTerms = chiaHangTu(expr); if (topTerms.length !== 1) return null // luôn đúng 1 hạng ngoài cùng: 1 nhị thức bình phương
  const hang = { sign: topTerms[0].sign, text: topTerms[0].text, terms: parseHangTuBieuThuc(topTerms[0].text) }
  if (!hang.terms) return null
  const dungTerms = hang.sign === '-' ? hang.terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : hang.terms
  const dungText = hienThiDaThuc(sapXepChuanDaThuc(dungTerms))
  if (!rule) return { text: dungText }
  if (rule === 'R181') { // dự phòng — lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (KHÔNG cần cấu trúc nhị thức bình phương, đặt TRƯỚC guard)
    const sorted = sapXepChuanDaThuc(dungTerms); if (!sorted.length) return null
    const top = sorted[0]; const v = add(top.coef, R(1n))
    const terms = sorted.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  const factorTexts = tachNhanTu(hang.text)
  if (factorTexts.length !== 2 || factorTexts[0] !== factorTexts[1]) return null // không đúng dạng "(nhị thức)^2" ⇒ R178-180 không áp dụng (vd đơn thức bình phương "(4x)^2")
  const poly = parseFactorAsPoly(factorTexts[0]); if (!poly || poly.length !== 2) return null
  if (rule === 'R178') { // quên hạng tử giữa (2ab) khi bình phương một tổng/hiệu
    const terms = poly.map((p) => ({ coef: mul(p.coef, p.coef), vars: new Map([...p.vars].map(([v, e]) => [v, e * 2])) }))
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'quên hạng tử giữa (2ab) khi bình phương một tổng/hiệu' }
  }
  if (rule === 'R179') { // nhầm dấu hạng tử giữa
    const crossVars = new Map(poly[0].vars); for (const [v, e] of poly[1].vars) crossVars.set(v, (crossVars.get(v) ?? 0) + e)
    const crossKey = phanBienKey(crossVars)
    const terms = dungTerms.map((t) => phanBienKey(t.vars) === crossKey ? { coef: mul(R(-1n), t.coef), vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu hạng tử giữa khi bình phương một tổng/hiệu' }
  }
  if (rule === 'R180') { // nhân đôi biểu thức trong ngoặc thay vì bình phương
    const terms = poly.map((p) => ({ coef: mul(p.coef, R(2n)), vars: p.vars }))
    const tFull = hang.sign === '-' ? terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : terms
    const t = hienThiDaThuc(sapXepChuanDaThuc(tFull)); if (t === dungText) return null
    return { text: t, ds: 'nhân đôi biểu thức trong ngoặc thay vì bình phương (hiểu nhầm "bình phương" thành "nhân đôi")' }
  }
  return null
}

function isqrtBig(n) { // n: BigInt ≥0 → căn bậc hai NGUYÊN nếu n là số chính phương, else null
  if (n < 0n) return null
  if (n === 0n) return 0n
  let x = n, y = (x + 1n) / 2n
  while (y < x) { x = y; y = (x + n / x) / 2n }
  return x * x === n ? x : null
}
// ── DẠNG 25: Viết biểu thức thành bình phương (T108020102, khối 8) — NGHỊCH ĐẢO DẠNG 24 ─────────────────────
// Đề "$x^2+2x+1=(.....)^2$" / "$9x^2-6x+1=(\text{.....})^2$" — cho tam thức $Ax^2+Bx+C$ (1 biến, A,C là số
// chính phương), tìm nhị thức $(\sqrt A\,x \pm \sqrt C)$ sao cho bình phương ra đúng tam thức đó.
export function vietThanhBinhPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const lhsRaw = m[1].split('=')[0]; if (!lhsRaw) return null
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(lhsRaw.trim())); if (!terms) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null
  const bien = [...bienSet][0] || 'x'
  let coefA = R(0n), coefB = R(0n), coefC = R(0n)
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = add(coefA, t.coef); else if (d === 1) coefB = add(coefB, t.coef); else if (d === 0) coefC = add(coefC, t.coef); else return null }
  if (coefA.q !== 1n || coefC.q !== 1n || coefA.p < 0n || coefC.p < 0n) return null
  const sqA = isqrtBig(coefA.p), sqC = isqrtBig(coefC.p); if (sqA === null || sqC === null) return null
  const coefBSai = R(2n * sqA * sqC) // 2·√A·√C — so với hạng giữa thật để suy dấu đúng của C trong nhị thức
  let dauC
  if (cmp(coefB, coefBSai) === 0) dauC = 1n
  else if (cmp(coefB, mul(R(-1n), coefBSai)) === 0) dauC = -1n
  else return null // không phải tam thức chính phương đúng khuôn
  const dungCTerm = R(dauC * sqC)
  const dungText = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: dungCTerm, vars: new Map() }])
  if (!rule) return { text: dungText }
  if (rule === 'R182') { // quên căn bậc hai của hệ số x^2, giữ nguyên hệ số
    const t = hienThiDaThuc([{ coef: coefA, vars: new Map([[bien, 1]]) }, { coef: dungCTerm, vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc hai của hệ số bậc 2, giữ nguyên hệ số' }
  }
  if (rule === 'R183') { // nhầm dấu — lấy dấu ngược của hạng tử tự do trong nhị thức
    const t = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: mul(R(-1n), dungCTerm), vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của hạng tử tự do trong nhị thức' }
  }
  if (rule === 'R184') { // quên căn bậc hai của hằng số, giữ nguyên hằng số
    const hangSoSai = R(dauC * coefC.p)
    const t = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: hangSoSai, vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc hai của hạng tử tự do, giữ nguyên hạng tử tự do' }
  }
  if (rule === 'R185') { // dự phòng — lệch 1 đơn vị ở hạng tử tự do của nhị thức
    const v = add(dungCTerm, R(1n)); if (cmp(v, dungCTerm) === 0) return null
    const t = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: v, vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tử tự do của nhị thức (dự phòng)' }
  }
  if (rule === 'R186') { // lệch 1 đơn vị ở hệ số của biến trong nhị thức — lưới an toàn khi √A=1 VÀ hạng tự do "quên căn"/"nhầm dấu" đều trùng đúng (coefC=0 hoặc 1)
    const v = add(R(sqA), R(1n)); if (cmp(v, R(sqA)) === 0) return null
    const t = hienThiDaThuc([{ coef: v, vars: new Map([[bien, 1]]) }, { coef: dungCTerm, vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số của biến trong nhị thức' }
  }
  return null
}

// ── DẠNG 26: Hoàn thiện biểu thức bình phương tổng/hiệu (T108020103, khối 8) ────────────────────────────────
// TRỘN 2 sub-shape: (a) "$4x^2+12x+..... = (.....)^2$" — thiếu HẠNG TỰ DO cuối cùng; (b) "$9x^2-.....+25=
// (.....)^2$" — thiếu HẠNG TỬ GIỮA (dấu +/- của hạng giữa đã cho sẵn trong đề, chỉ điền độ lớn). Đáp số
// kho ghi 2 phần "X; nhị thức" (đôi khi ngăn bằng "," thay vì ";") — TEXT_DANG.
export function hoanThienBinhPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const lhsRaw = m[1].split('=')[0]; if (!lhsRaw) return null
  const lhsTrim = lhsRaw.trim()
  if (/^\./.test(lhsTrim) && /\.\s*$/.test(lhsTrim)) return hoanThienCaHaiDau(m[1], rule) // chấm CẢ ĐẦU LẪN CUỐI ⇒ thiếu CẢ hạng đầu lẫn hạng tự do (√A đọc từ vế phải)
  const mGiua = lhsRaw.match(/^(.*?)([+-])\s*\.+\s*([+-]\s*.+)$/) // dấu chấm ở GIỮA, có nội dung theo sau (hạng tự do C) ⇒ thiếu hạng GIỮA
  if (mGiua) return hoanThienHangGiua(mGiua, rule)
  const mDau = lhsTrim.match(/^\.+\s*([+-]\s*.+)$/) // dấu chấm Ở ĐẦU ⇒ thiếu hạng ĐẦU (bậc 2)
  if (mDau) return hoanThienHangDau(mDau, rule)
  const trimmed = lhsRaw.replace(/[+-]\s*\.+\s*$/, '') // bỏ hạng tử CUỐI dạng "+ ....." (chỗ trống cần điền)
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(trimmed)); if (!terms || terms.length !== 2) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, coefB = null
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = t.coef; else if (d === 1) coefB = t.coef; else return null }
  if (!coefA || !coefB || coefA.q !== 1n || coefA.p <= 0n || coefB.q !== 1n) return null
  const sqA = isqrtBig(coefA.p); if (sqA === null || sqA === 0n) return null
  const absB = coefB.p < 0n ? -coefB.p : coefB.p, denom = 2n * sqA
  if (absB % denom !== 0n) return null
  const sqrtC = absB / denom, dauB = coefB.p < 0n ? -1n : 1n
  const dungCValue = R(sqrtC * sqrtC)
  const dungBinomTerms = [{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: R(dauB * sqrtC), vars: new Map() }]
  const ghepText = (cVal, binomTerms) => `${hienThiDonThuc(cVal, new Map())}; ${hienThiDaThuc(binomTerms)}`
  const dungText = ghepText(dungCValue, dungBinomTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R187') { // quên bình phương B — điền số hạng còn thiếu bằng B thay vì B^2
    const v = R(sqrtC); if (cmp(v, dungCValue) === 0) return null
    const t = ghepText(v, dungBinomTerms); if (t === dungText) return null
    return { text: t, ds: 'quên bình phương, điền số hạng còn thiếu bằng B thay vì B²' }
  }
  if (rule === 'R188') { // nhầm dấu trong nhị thức
    const sai = [dungBinomTerms[0], { coef: mul(R(-1n), dungBinomTerms[1].coef), vars: dungBinomTerms[1].vars }]
    const t = ghepText(dungCValue, sai); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của hạng tự do trong nhị thức' }
  }
  if (rule === 'R189') { // quên nhân đôi căn A khi tìm B — coi 2B=hệ số giữa thay vì 2·√A·B
    if (absB % 2n !== 0n) return null
    const sqrtCSai = absB / 2n; if (sqrtCSai === sqrtC) return null
    const cSai = R(sqrtCSai * sqrtCSai)
    const binomSai = [dungBinomTerms[0], { coef: R(dauB * sqrtCSai), vars: new Map() }]
    const t = ghepText(cSai, binomSai); if (t === dungText) return null
    return { text: t, ds: 'quên nhân đôi căn bậc hai của hệ số bậc 2 khi tìm số hạng tự do, coi 2B bằng hệ số giữa' }
  }
  if (rule === 'R190') { // dự phòng — lệch 1 đơn vị ở hạng tự do C, nhị thức giữ nguyên
    const v = add(dungCValue, R(1n)); if (cmp(v, dungCValue) === 0) return null
    const t = ghepText(v, dungBinomTerms); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tự do cần điền (dự phòng)' }
  }
  if (rule === 'R191') { // lệch 1 đơn vị ở hệ số biến trong nhị thức — lưới an toàn khi √A=1 (R189 vô hiệu) VÀ √C=1 (R187 vô hiệu)
    const v = add(R(sqA), R(1n)); if (cmp(v, R(sqA)) === 0) return null
    const binomSai = [{ coef: v, vars: new Map([[bien, 1]]) }, dungBinomTerms[1]]
    const t = ghepText(dungCValue, binomSai); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số của biến trong nhị thức' }
  }
  return null
}
function hoanThienHangGiua(mGiua, rule) { // sub-shape (b): "$Ax^2 [+/-] ..... [+/-]C = (...)^2$" — thiếu hạng tử GIỮA
  const termAtext = mGiua[1].trim(), dauGiua = mGiua[2], termCtext = mGiua[3].trim()
  const polyA = parseDonThucCore(chuanBiBieuThucNhan(termAtext)); if (!polyA || polyA.vars.size !== 1 || polyA.hasIrrational) return null
  const bien = [...polyA.vars.keys()][0]; if (polyA.vars.get(bien) !== 2) return null
  const coefA = polyA.coef; if (coefA.q !== 1n || coefA.p <= 0n) return null
  const cTerms = chiaHangTu(chuanBiBieuThucNhan(termCtext)); if (cTerms.length !== 1) return null
  const polyC = parseDonThucCore(cTerms[0].text); if (!polyC || polyC.vars.size !== 0 || polyC.hasIrrational) return null
  const coefC = cTerms[0].sign === '-' ? mul(R(-1n), polyC.coef) : polyC.coef
  if (coefC.q !== 1n || coefC.p < 0n) return null
  const sqA = isqrtBig(coefA.p), sqC = isqrtBig(coefC.p); if (sqA === null || sqC === null || sqA === 0n) return null
  const dungMidValue = R(2n * sqA * sqC) // LUÔN dương — dấu hạng giữa đã thể hiện qua dauGiua ngay trong đề, không nằm trong đáp số
  const dauB = dauGiua === '-' ? -1n : 1n
  const dungBinomTerms = [{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: R(dauB * sqC), vars: new Map() }]
  const ghepText = (midVal, binomTerms) => `${hienThiDaThuc([{ coef: midVal, vars: new Map([[bien, 1]]) }])}; ${hienThiDaThuc(binomTerms)}`
  const dungText = ghepText(dungMidValue, dungBinomTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R192') { // quên nhân đôi khi tìm hạng tử giữa — coi hạng giữa = √A·√C (không nhân 2)
    const v = R(sqA * sqC); if (cmp(v, dungMidValue) === 0) return null
    const t = ghepText(v, dungBinomTerms); if (t === dungText) return null
    return { text: t, ds: 'quên nhân với 2 khi tìm hạng tử giữa, chỉ tính √A·√C' }
  }
  if (rule === 'R193') { // nhầm dấu trong nhị thức
    const sai = [dungBinomTerms[0], { coef: mul(R(-1n), dungBinomTerms[1].coef), vars: dungBinomTerms[1].vars }]
    const t = ghepText(dungMidValue, sai); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của hạng tự do trong nhị thức' }
  }
  if (rule === 'R194') { // quên căn A khi tìm hạng tử giữa — coi hạng giữa = 2·A·√C thay vì 2·√A·√C
    const v = R(2n * coefA.p * sqC); if (cmp(v, dungMidValue) === 0) return null
    const t = ghepText(v, dungBinomTerms); if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc hai của hệ số bậc 2 khi tìm hạng tử giữa, dùng thẳng hệ số A' }
  }
  if (rule === 'R195') { const v = add(dungMidValue, R(1n)); if (cmp(v, dungMidValue) === 0) return null; const t = ghepText(v, dungBinomTerms); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tử giữa cần điền (dự phòng)' } }
  return null
}
function hoanThienHangDau(mDau, rule) { // sub-shape (c): "$..... [+/-]Bx [+/-]C = (...)^2$" — thiếu hạng ĐẦU (bậc 2)
  const terms = chiaHangTu(chuanBiBieuThucNhan(mDau[1].trim())); if (terms.length !== 2) return null
  const polyB = parseDonThucCore(terms[0].text); if (!polyB || polyB.vars.size !== 1 || polyB.hasIrrational) return null
  const bien = [...polyB.vars.keys()][0]; if (polyB.vars.get(bien) !== 1) return null
  const coefBabs = polyB.coef; if (coefBabs.q !== 1n || coefBabs.p <= 0n) return null
  const dauB = terms[0].sign === '-' ? -1n : 1n
  const polyC = parseDonThucCore(terms[1].text); if (!polyC || polyC.vars.size !== 0 || polyC.hasIrrational) return null
  const coefC = terms[1].sign === '-' ? mul(R(-1n), polyC.coef) : polyC.coef
  if (coefC.q !== 1n || coefC.p < 0n) return null
  const sqC = isqrtBig(coefC.p); if (sqC === null || sqC === 0n) return null
  if (coefBabs.p % (2n * sqC) !== 0n) return null
  const sqA = coefBabs.p / (2n * sqC)
  const dungAValue = R(sqA * sqA)
  const dungBinomTerms = [{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: R(dauB * sqC), vars: new Map() }]
  const ghepText = (aVal, binomTerms) => `${hienThiDaThuc([{ coef: aVal, vars: new Map([[bien, 2]]) }])}; ${hienThiDaThuc(binomTerms)}`
  const dungText = ghepText(dungAValue, dungBinomTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R196') { // quên bình phương √A — điền hạng tử bậc 2 bằng √A thay vì A
    const v = R(sqA); if (cmp(v, dungAValue) === 0) return null
    const t = ghepText(v, dungBinomTerms); if (t === dungText) return null
    return { text: t, ds: 'quên bình phương, điền hạng tử bậc 2 bằng √A thay vì A' }
  }
  if (rule === 'R197') { // nhầm dấu trong nhị thức
    const sai = [dungBinomTerms[0], { coef: mul(R(-1n), dungBinomTerms[1].coef), vars: dungBinomTerms[1].vars }]
    const t = ghepText(dungAValue, sai); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của hạng tự do trong nhị thức' }
  }
  if (rule === 'R198') { // quên nhân đôi căn C khi tìm A — coi √A = B/√C (không chia 2)
    if (coefBabs.p % sqC !== 0n) return null
    const sqASai = coefBabs.p / sqC; if (sqASai === sqA) return null
    const aSai = R(sqASai * sqASai)
    const binomSai = [{ coef: R(sqASai), vars: new Map([[bien, 1]]) }, dungBinomTerms[1]]
    const t = ghepText(aSai, binomSai); if (t === dungText) return null
    return { text: t, ds: 'quên nhân đôi căn bậc hai của hạng tự do khi tìm hệ số bậc 2, coi √A = B/√C' }
  }
  if (rule === 'R199') { const v = add(dungAValue, R(1n)); if (cmp(v, dungAValue) === 0) return null; const t = ghepText(v, dungBinomTerms); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tử bậc 2 cần điền (dự phòng)' } }
  return null
}
function hoanThienCaHaiDau(fullContent, rule) { // sub-shape (d): "$.....+Bx+.....=(Ax.....)^2$" — thiếu CẢ hạng đầu lẫn hạng tự do; √A đọc được từ vế phải (đã cho sẵn trước chỗ trống)
  const eqParts = fullContent.split('='); if (eqParts.length !== 2) return null
  const mLhs = eqParts[0].trim().match(/^\.+\s*([+-])\s*(.+?)\s*[+-]\s*\.+\s*$/); if (!mLhs) return null
  const polyB = parseDonThucCore(chuanBiBieuThucNhan(mLhs[2].trim())); if (!polyB || polyB.vars.size !== 1 || polyB.hasIrrational) return null
  const bien = [...polyB.vars.keys()][0]; if (polyB.vars.get(bien) !== 1) return null
  const coefBabs = polyB.coef; if (coefBabs.q !== 1n || coefBabs.p <= 0n) return null
  const dauB = mLhs[1] === '-' ? -1n : 1n
  const mRhs = eqParts[1].trim().match(/^\(([^()]*?)\.+\)\^\{?2\}?$/); if (!mRhs) return null
  const polyA = parseDonThucCore(chuanBiBieuThucNhan(mRhs[1])); if (!polyA || polyA.vars.size !== 1 || polyA.hasIrrational) return null
  if (polyA.vars.get(bien) !== 1) return null
  const sqA = polyA.coef; if (sqA.q !== 1n || sqA.p <= 0n) return null
  if (coefBabs.p % (2n * sqA.p) !== 0n) return null
  const sqC = coefBabs.p / (2n * sqA.p)
  const dungAValue = mul(sqA, sqA), dungCValue = R(sqC * sqC), dungConst = R(dauB * sqC)
  const ghepText = (aVal, cVal, constVal) => `${hienThiDonThuc(aVal, new Map([[bien, 2]]))}; ${hienThiDonThuc(cVal, new Map())}; ${hienThiDonThuc(constVal, new Map())}`
  const dungText = ghepText(dungAValue, dungCValue, dungConst)
  if (!rule) return { text: dungText }
  if (rule === 'R196') { // quên bình phương √A ở hạng đầu
    const t = ghepText(sqA, dungCValue, dungConst); if (t === dungText) return null
    return { text: t, ds: 'quên bình phương, điền hạng tử bậc 2 bằng √A thay vì A' }
  }
  if (rule === 'R197') { // nhầm dấu hạng tự do trong nhị thức (và do đó C giữ nguyên vì C luôn dương, chỉ constVal đổi dấu)
    const t = ghepText(dungAValue, dungCValue, mul(R(-1n), dungConst)); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của hạng tự do trong nhị thức' }
  }
  if (rule === 'R198') { // quên nhân đôi căn A khi tìm C — coi √C = B/√A (không chia 2)
    if (coefBabs.p % sqA.p !== 0n) return null
    const sqCSai = coefBabs.p / sqA.p; if (sqCSai === sqC) return null
    const t = ghepText(dungAValue, R(sqCSai * sqCSai), R(dauB * sqCSai)); if (t === dungText) return null
    return { text: t, ds: 'quên nhân đôi căn bậc hai của hệ số bậc 2 khi tìm hạng tự do, coi √C = B/√A' }
  }
  if (rule === 'R199') { // dự phòng — lệch 1 đơn vị ở hạng tự do C
    const v = add(dungCValue, R(1n)); if (cmp(v, dungCValue) === 0) return null
    const t = ghepText(dungAValue, v, dungConst); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tự do cần điền (dự phòng)' }
  }
  return null
}
export function chuanHoaHoanThienBP(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  let parts = clean.split(';').map((x) => x.trim())
  if (parts.length < 2) parts = clean.split(',').map((x) => x.trim())
  if (parts.length < 2) return clean
  return parts.map((p) => chuanHoaDaThuc(p)).join('; ')
}
export function evalHoanThienBPKetQua(s) { const t = chuanHoaHoanThienBP(s); return t || null }

// ── DẠNG 27: Tách biểu thức thành bình phương (T108020104, khối 8) — "hoàn thiện bình phương" tổng quát ─────
// Đề "Tách bình phương $A = x^2+4x+7$" / "$A=2x^2-4x+9$" — viết $Ax^2+Bx+C = A(x+p)^2+q$ với $p=B/(2A)$,
// $q=C-Ap^2$. Đáp số dạng "A(x±p)^2 ± q" (A/q bỏ khi bằng 1/0) — canon bằng cách KHAI TRIỂN LẠI toàn bộ
// biểu thức (tái dùng `parseHangTuBieuThuc` đã hỗ trợ "(...)^n" từ DẠNG 24) rồi so sánh đa thức, KHÔNG so
// chuỗi — tự động bất biến với mọi cách viết (\left(\right), có/không hệ số A, khoảng trắng...).
export function tachBinhPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(raw)); if (!terms) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null
  const bien = [...bienSet][0] || 'x'
  let coefA = R(0n), coefB = R(0n), coefC = R(0n)
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = add(coefA, t.coef); else if (d === 1) coefB = add(coefB, t.coef); else if (d === 0) coefC = add(coefC, t.coef); else return null }
  if (coefA.p === 0n) return null
  const p = div(coefB, mul(R(2n), coefA)); if (!p) return null
  const q = sub(coefC, mul(coefA, mul(p, p)))
  const fmt = (A, pp, qq) => {
    const binomText = hienThiDaThuc([{ coef: R(1n), vars: new Map([[bien, 1]]) }, { coef: pp, vars: new Map() }])
    const coefPrefix = (A.p === 1n && A.q === 1n) ? '' : hienThiDonThuc(A, new Map())
    let out = `${coefPrefix}(${binomText})^2`
    if (qq.p !== 0n) out += qq.p < 0n ? ` - ${hienThiDonThuc(R(-qq.p, qq.q), new Map())}` : ` + ${hienThiDonThuc(qq, new Map())}`
    return out
  }
  const dungText = fmt(coefA, p, q)
  if (!rule) return { text: dungText }
  if (rule === 'R200') { // quên trừ lại phần thừa — giữ nguyên hằng số gốc C, không tính lại q
    const t = fmt(coefA, p, coefC); if (t === dungText) return null
    return { text: t, ds: 'quên trừ lại phần thừa khi tách bình phương, giữ nguyên hằng số gốc' }
  }
  if (rule === 'R201') { // nhầm dấu p trong nhị thức
    const t = fmt(coefA, mul(R(-1n), p), q); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của p trong nhị thức' }
  }
  if (rule === 'R202') { // quên chia 2 khi tìm p — coi p = B/A thay vì B/(2A)
    const pSai = div(coefB, coefA); if (!pSai || cmp(pSai, p) === 0) return null
    const t = fmt(coefA, pSai, q); if (t === dungText) return null
    return { text: t, ds: 'quên chia 2 khi tìm p, coi p = B/A thay vì B/(2A)' }
  }
  if (rule === 'R203') { const v = add(q, R(1n)); if (cmp(v, q) === 0) return null; const t = fmt(coefA, p, v); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số cộng thêm (dự phòng)' } }
  return null
}
export function chuanHoaTachBinhPhuong(s) {
  const clean = String(s ?? '').replace(/\$/g, '').replace(/\\left|\\right/g, '').trim()
  const noLabel = clean.replace(/^[A-Za-zĐ]\s*=\s*/, '')
  const expr = chuanBiBieuThucNhan(noLabel)
  const topTerms = chiaHangTu(expr)
  const parsed = topTerms.map((t) => { const p = parseHangTuBieuThuc(t.text); return p ? { sign: t.sign, terms: p } : null })
  if (parsed.some((x) => !x)) return clean
  const gop = new Map()
  for (const { sign, terms } of parsed) for (const p of terms) {
    const c = sign === '-' ? mul(R(-1n), p.coef) : p.coef
    const key = phanBienKey(p.vars); const old = gop.get(key)
    gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
  }
  return hienThiDaThuc(sapXepChuanDaThuc([...gop.values()]))
}
export function evalTachBinhPhuongKetQua(s) { const t = chuanHoaTachBinhPhuong(s); return t || null }

// ── DẠNG 28: GTLN-GTNN của biểu thức bậc hai (T108020105, khối 8) ───────────────────────────────────────────
// Đề "Tìm GTNN của biểu thức $A = 3x^2-4x+5$" — GIỐNG HỆT phép "tách bình phương" (DẠNG 27), đáp số chính
// là hằng số $q = C - Ap^2$ (GTNN khi A>0, GTLN khi A<0). Đáp số là 1 GIÁ TRỊ HỮU TỈ ⇒ SPECIAL_DANG.
export function gtlnGtnnBacHai(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  // phanTichDaThucCumNhanTu (không phải parseFactorAsPoly) — tự khai triển tích nếu đề cho dạng CHƯA nhân
  // ra, vd "$A=(4-x)(x+2)$" (T109080101), chứ không chỉ tổng đơn thức trần như "$A=2x^2+4x+5$".
  const terms = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(raw)); if (!terms) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null
  const bien = [...bienSet][0] || 'x'
  let coefA = R(0n), coefB = R(0n), coefC = R(0n)
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = add(coefA, t.coef); else if (d === 1) coefB = add(coefB, t.coef); else if (d === 0) coefC = add(coefC, t.coef); else return null }
  if (coefA.p === 0n) return null
  const p = div(coefB, mul(R(2n), coefA)); if (!p) return null
  const q = sub(coefC, mul(coefA, mul(p, p)))
  if (!rule) return { value: q }
  if (rule === 'R204') { // quên trừ lại phần thừa — coi GTLN/GTNN = hằng số gốc C
    if (cmp(coefC, q) === 0) return null
    return { value: coefC, ds: 'quên trừ lại phần thừa, coi GTLN/GTNN bằng hằng số gốc' }
  }
  if (rule === 'R205') { // nhầm dấu phần bù — cộng thay vì trừ Ap²
    const v = add(coefC, mul(coefA, mul(p, p))); if (cmp(v, q) === 0) return null
    return { value: v, ds: 'nhầm dấu phần bù, cộng thay vì trừ khi tính GTLN/GTNN' }
  }
  if (rule === 'R206') { // quên chia 2 khi tìm p — dẫn tới tính sai GTLN/GTNN theo p sai
    const pSai = div(coefB, coefA); if (!pSai || cmp(pSai, p) === 0) return null
    const v = sub(coefC, mul(coefA, mul(pSai, pSai))); if (cmp(v, q) === 0) return null
    return { value: v, ds: 'quên chia 2 khi tìm p, dẫn tới tính sai GTLN/GTNN' }
  }
  if (rule === 'R207') { const v = add(q, R(1n)); if (cmp(v, q) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị ở GTLN/GTNN (dự phòng)' } }
  return null
}

// ── DẠNG 29: GTLN-GTNN của biểu thức 2 BIẾN (T108020201/202/203, khối 8) — dạng toàn phương tổng quát ────────
// Đề "Tìm GTNN của $A=x^2+y^2+2x+4y+11$" (T108020201, KHÔNG có hạng chéo xy) hoặc "$A=2x^2+2xy+y^2-4x+7$"
// (T108020202, CÓ hạng chéo — cần nhóm thành tổng bình phương, kho tự chọn cách nhóm "đẹp"). Thay vì dò
// TỪNG CÁCH nhóm cụ thể (nhiều cách nhóm khác nhau đều cho cùng 1 GTLN/GTNN), giải trực tiếp bằng ĐẠI SỐ
// TUYẾN TÍNH: $A=ax^2+bxy+cy^2+dx+ey+f$ đạt cực trị tại điểm nghiệm hệ $\{2ax+by+d=0; bx+2cy+e=0\}$ (từ đạo
// hàm riêng = 0), thế lại vào A. Cách này ĐÚNG bất kể kho nhóm bình phương kiểu gì — không cần đoán cách nhóm.
export function gtlnGtnnHaiBien(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  // dùng parseHangTuBieuThuc (không phải parseFactorAsPoly trần) để tự khai triển được cả hạng tử có TÍCH
  // cần phân phối, vd "2x(y+1)" (đã gặp trong dữ liệu thật) — parseFactorAsPoly không tự nhân ra được.
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (!topTerms.length) return null
  const gopSrc = []
  for (const t of topTerms) { const p = parseHangTuBieuThuc(t.text); if (!p) return null; for (const x of p) gopSrc.push({ coef: t.sign === '-' ? mul(R(-1n), x.coef) : x.coef, vars: x.vars }) }
  const gopMap = new Map()
  for (const x of gopSrc) { const key = phanBienKey(x.vars); const old = gopMap.get(key); gopMap.set(key, old ? { coef: add(old.coef, x.coef), vars: x.vars } : x) }
  const terms = [...gopMap.values()].filter((x) => x.coef.p !== 0n)
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 2) return null
  const [bienX, bienY] = [...bienSet].sort()
  let a = R(0n), b = R(0n), c = R(0n), d = R(0n), e = R(0n), f = R(0n)
  for (const t of terms) {
    const ex = t.vars.get(bienX) ?? 0, ey = t.vars.get(bienY) ?? 0
    if (ex === 2 && ey === 0) a = add(a, t.coef)
    else if (ex === 1 && ey === 1) b = add(b, t.coef)
    else if (ex === 0 && ey === 2) c = add(c, t.coef)
    else if (ex === 1 && ey === 0) d = add(d, t.coef)
    else if (ex === 0 && ey === 1) e = add(e, t.coef)
    else if (ex === 0 && ey === 0) f = add(f, t.coef)
    else return null // bậc >2 hoặc >2 biến — ngoài phạm vi toàn phương
  }
  const giaiCucTri = (aa, bb, cc, dd, ee) => { // hệ {2aa·x+bb·y=-dd; bb·x+2cc·y=-ee} — Cramer
    const det = sub(mul(R(4n), mul(aa, cc)), mul(bb, bb)); if (det.p === 0n) return null
    const x0 = div(sub(mul(bb, ee), mul(R(2n), mul(cc, dd))), det)
    const y0 = div(sub(mul(bb, dd), mul(R(2n), mul(aa, ee))), det)
    if (!x0 || !y0) return null
    return { x0, y0 }
  }
  const evalA = (x0, y0) => add(add(add(add(add(mul(a, mul(x0, x0)), mul(b, mul(x0, y0))), mul(c, mul(y0, y0))), mul(d, x0)), mul(e, y0)), f)
  const cuc = giaiCucTri(a, b, c, d, e); if (!cuc) return null
  const dungValue = evalA(cuc.x0, cuc.y0)
  if (!rule) return { value: dungValue }
  if (rule === 'R208') { // quên hạng chéo khi tìm điểm cực trị — giải hệ như thể b=0, rồi thế lại A đầy đủ (có b)
    const cucSai = giaiCucTri(a, R(0n), c, d, e); if (!cucSai) return null
    const v = evalA(cucSai.x0, cucSai.y0); if (cmp(v, dungValue) === 0) return null
    return { value: v, ds: 'quên hạng tử chéo khi tìm điểm cực trị, giải hệ như thể không có hạng xy' }
  }
  if (rule === 'R209') { // nhầm dấu — lấy điểm đối xứng qua gốc toạ độ
    const v = evalA(mul(R(-1n), cuc.x0), mul(R(-1n), cuc.y0)); if (cmp(v, dungValue) === 0) return null
    return { value: v, ds: 'nhầm dấu khi giải hệ tìm điểm cực trị, lấy điểm đối xứng qua gốc toạ độ' }
  }
  if (rule === 'R210') { // quên hệ số 2 trong công thức định thức — dùng det = ac-b² thay vì 4ac-b²
    const detSai = sub(mul(a, c), mul(b, b)); if (detSai.p === 0n) return null
    const x0s = div(sub(mul(b, e), mul(R(2n), mul(c, d))), detSai), y0s = div(sub(mul(b, d), mul(R(2n), mul(a, e))), detSai)
    if (!x0s || !y0s) return null
    const v = evalA(x0s, y0s); if (cmp(v, dungValue) === 0) return null
    return { value: v, ds: 'quên hệ số 2 khi tính định thức, dẫn tới tìm sai điểm cực trị' }
  }
  if (rule === 'R211') { const v = add(dungValue, R(1n)); if (cmp(v, dungValue) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị ở GTLN/GTNN (dự phòng)' } }
  return null
}

function icbrtBig(n) { // BigInt căn bậc BA nguyên nếu n là lập phương đúng, else null (nhận cả n âm)
  const neg = n < 0n; const an = neg ? -n : n
  let lo = 0n, hi = an + 1n
  while (lo < hi) { const mid = (lo + hi + 1n) / 2n; if (mid * mid * mid <= an) lo = mid; else hi = mid - 1n }
  if (lo * lo * lo !== an) return null
  return neg ? -lo : lo
}
function ratSqrt(r) { // Rat r≥0 → Rat căn bậc hai nếu cả tử/mẫu đều chính phương, else null
  if (r.p < 0n) return null
  const sp = isqrtBig(r.p), sq = isqrtBig(r.q); if (sp === null || sq === null) return null
  return R(sp, sq)
}
// ── DẠNG 30: Khai triển / hoàn thiện hằng đẳng thức lập phương tổng-hiệu (T108020301, khối 8) ────────────────
// TRỘN 2 sub-shape: (a) "Khai triển biểu thức:$(x+1)^3$" — khai triển trực tiếp (tái dùng `parseHangTuBieuThuc`
// đã hỗ trợ "(...)^n" bất kỳ n); (b) "$x^3+\ldots+12x+\ldots=(\ldots)^3$" — hoàn thiện, CHỈ hỏi nhị thức
// (không hỏi từng hạng thiếu riêng như DẠNG 26). Sub-shape (c) dùng dấu chấm trần khác hẳn 2 sub-shape trên
// (11/43 câu, phức tạp hơn — CHỦ ĐỘNG bỏ qua, tự động không khớp cả 2 pattern dưới nên rơi ra ngoài tự nhiên).
export function khaiTrienLapPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const content = m[1].trim()
  if (/\\ldots/.test(content)) return hoanThienLapPhuong(content, rule)
  const expr = chuanBiBieuThucNhan(content.replace(/=.*$/, '').trim())
  const topTerms = chiaHangTu(expr); if (topTerms.length !== 1) return null
  const hang = { sign: topTerms[0].sign, text: topTerms[0].text, terms: parseHangTuBieuThuc(topTerms[0].text) }
  if (!hang.terms || hang.terms.length !== 4) return null // (a+b)^3 khai triển đúng phải ra 4 hạng tử
  const dungTerms = hang.sign === '-' ? hang.terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : hang.terms
  const sorted = sapXepChuanDaThuc(dungTerms); if (sorted.length !== 4) return null
  const dungText = hienThiDaThuc(sorted)
  if (!rule) return { text: dungText }
  const factorTexts = tachNhanTu(hang.text)
  if (factorTexts.length !== 3 || factorTexts[0] !== factorTexts[1] || factorTexts[1] !== factorTexts[2]) return null
  if (rule === 'R212') { // quên 2 hạng tử giữa — chỉ giữ hạng bậc cao nhất và thấp nhất
    const t = hienThiDaThuc([sorted[0], sorted[3]]); if (t === dungText) return null
    return { text: t, ds: 'quên 2 hạng tử giữa khi khai triển lập phương một tổng/hiệu' }
  }
  if (rule === 'R213') { // nhầm dấu 1 trong 2 hạng tử giữa (hạng bậc 2)
    const terms = sorted.map((t, i) => i === 1 ? { coef: mul(R(-1n), t.coef), vars: t.vars } : t)
    const t = hienThiDaThuc(terms); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu 1 trong 2 hạng tử giữa khi khai triển lập phương một tổng/hiệu' }
  }
  if (rule === 'R214') { // hiểu nhầm "lập phương" thành "nhân 3"
    const poly = parseFactorAsPoly(factorTexts[0]); if (!poly) return null
    const terms = poly.map((p) => ({ coef: mul(p.coef, R(3n)), vars: p.vars }))
    const tFull = hang.sign === '-' ? terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : terms
    const t = hienThiDaThuc(sapXepChuanDaThuc(tFull)); if (t === dungText) return null
    return { text: t, ds: 'nhân 3 biểu thức trong ngoặc thay vì lập phương (hiểu nhầm "lập phương" thành "nhân 3")' }
  }
  if (rule === 'R215') { const v = add(sorted[0].coef, R(1n)); const terms = sorted.map((t, i) => i === 0 ? { coef: v, vars: t.vars } : t); const t = hienThiDaThuc(terms); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' } }
  return null
}
function hoanThienLapPhuong(content, rule) { // sub-shape (b): "$Ax^3 [+/-]\ldots [+/-]Cx [+/-]\ldots=(\ldots)^3$" — chỉ hỏi nhị thức
  const mm = content.match(/^(-?\d*)x\^3\s*([+-])\s*\\ldots\s*[+-]\s*(\\dfrac\{-?\d+\}\{-?\d+\}|-?\d+)x\s*[+-]\s*\\ldots\s*=\s*\(\s*\\ldots\s*\)\^3\s*$/)
  if (!mm) return null
  const aCubed = mm[1] === '' ? 1n : mm[1] === '-' ? -1n : BigInt(mm[1])
  const a = icbrtBig(aCubed); if (a === null || a === 0n) return null
  const cParsed = parseDonThucCore(mm[3]); if (!cParsed || cParsed.hasIrrational) return null
  const bSq = div(cParsed.coef, mul(R(3n), R(a))); if (!bSq) return null
  const b = ratSqrt(bSq); if (!b || b.p === 0n) return null
  const dauB = mm[2] === '-' ? -1n : 1n
  const dungBinomTerms = [{ coef: R(a), vars: new Map([['x', 1]]) }, { coef: R(dauB * b.p, b.q), vars: new Map() }]
  const dungText = hienThiDaThuc(dungBinomTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R216') { // quên khai căn — dùng thẳng b² (=C/(3a)) làm b, không lấy căn bậc hai
    const t = hienThiDaThuc([dungBinomTerms[0], { coef: mul(R(dauB), bSq), vars: new Map() }])
    if (t === dungText) return null
    return { text: t, ds: 'quên khai căn bậc hai, dùng thẳng b² làm hạng tự do của nhị thức' }
  }
  if (rule === 'R217') { // nhầm dấu b trong nhị thức
    const t = hienThiDaThuc([dungBinomTerms[0], { coef: mul(R(-1n), dungBinomTerms[1].coef), vars: dungBinomTerms[1].vars }])
    if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu của b trong nhị thức' }
  }
  if (rule === 'R218') { // quên lấy căn bậc 3 của hệ số A, dùng thẳng A làm hệ số a
    if (R(aCubed).p === R(a).p) return null
    const t = hienThiDaThuc([{ coef: R(aCubed), vars: new Map([['x', 1]]) }, dungBinomTerms[1]])
    if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc ba của hệ số bậc 3, dùng thẳng hệ số A làm hệ số của nhị thức' }
  }
  if (rule === 'R219') { const v = add(dungBinomTerms[1].coef, R(1n)); if (cmp(v, dungBinomTerms[1].coef) === 0) return null; const t = hienThiDaThuc([dungBinomTerms[0], { coef: v, vars: new Map() }]); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tự do của nhị thức (dự phòng)' } }
  if (rule === 'R220') { // lưới an toàn thứ 2 — lệch 1 đơn vị hạng tự do CHIỀU NGƯỢC LẠI với R219 (không đánh dự phòng để dùng ĐỒNG THỜI với R219)
    const v = sub(dungBinomTerms[1].coef, R(1n)); if (cmp(v, dungBinomTerms[1].coef) === 0) return null
    const t = hienThiDaThuc([dungBinomTerms[0], { coef: v, vars: new Map() }]); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tự do của nhị thức theo chiều ngược lại' }
  }
  return null
}

// ── DẠNG 31: Tính giá trị biểu thức ứng dụng lập phương tổng-hiệu (T108020302, khối 8) ──────────────────────
// Đề "Tính giá trị biểu thức $P=y^3+6y^2+12y+8$ tại $y=8$" — kho dùng mẹo hằng đẳng thức để tính nhanh
// nhưng ĐÁP SỐ chỉ là giá trị đa thức tại điểm đó — thế trực tiếp, không cần nhận diện lập phương. Giá trị
// thế đôi khi viết KIỂU VIỆT "5,5" (dấu phẩy thập phân) thay vì "5.5".
export function tinhGiaTriLapPhuong(noiDung, rule) {
  const segs = [...String(noiDung).matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  let exprRaw = segs[0].trim()
  const mLabel = exprRaw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) exprRaw = mLabel[2].trim()
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(exprRaw)); if (!terms) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null
  const bien = [...bienSet][0]
  const subText = segs.slice(1).join(', ')
  const mGia = subText.match(new RegExp(`${bien}\\s*=\\s*(-?\\\\dfrac\\{[^{}]+\\}\\{[^{}]+\\}|-?\\d+(?:[.,]\\d+)?)`)); if (!mGia) return null
  const giaTriParsed = parseDonThucCore(mGia[1].replace(',', '.')); if (!giaTriParsed || giaTriParsed.vars.size > 0) return null
  const giaTri = giaTriParsed.coef
  const theSo = (ts) => { let total = R(0n); for (const t of ts) { let v = t.coef; const e = bien ? (t.vars.get(bien) ?? 0) : 0; for (let k = 0; k < e; k++) v = mul(v, giaTri); total = add(total, v) } return total }
  const dungVal = theSo(terms)
  if (!rule) return { value: dungVal }
  if (rule === 'R221') { const v = mul(R(-1n), dungVal); if (!v || cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính sai dấu kết quả cuối cùng' } }
  if (rule === 'R222') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R223') { const v = sub(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị theo chiều ngược lại' } }
  if (rule === 'R224') { // quên hạng tử hằng số (bậc 0) khi cộng kết quả
    const hangSo = terms.find((t) => (t.vars.get(bien) ?? 0) === 0); if (!hangSo) return null
    const v = sub(dungVal, hangSo.coef); if (cmp(v, dungVal) === 0) return null
    return { value: v, ds: 'quên cộng hạng tử hằng số khi tính giá trị biểu thức' }
  }
  return null
}

// ── DẠNG 32: Viết đa thức thành tích / mở rộng ứng dụng hiệu hai bình phương (T108020401, khối 8) ───────────
// TRỘN 2 sub-shape: (a) "Hoàn thành biểu thức $9x^2-16=\ldots$" — cho $Ax^2-C$ (hiệu 2 bình phương), FACTOR
// thành $(\sqrt A x+\sqrt C)(\sqrt A x-\sqrt C)$; (b) "Tính $(3x+2)(2-3x)=\ldots$" — cho TÍCH 2 nhân tử,
// KHAI TRIỂN ra (chiều ngược lại, nhưng đáp số kho vẫn là đa thức khai triển, không phải dạng tích — tái
// dùng nguyên `parseHangTuBieuThuc` như mọi dạng "nhân đa thức" trước). Sub-shape (c) 11 câu cần NHẬN DIỆN
// CÁCH NHÓM 4 hạng tử — CHỦ ĐỘNG bỏ qua, không khớp cả 2 pattern dưới nên rơi ra ngoài tự nhiên.
export function vietThanhTichHieuBinhPhuong(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const raw = m[1].split('=')[0].trim()
  if (raw.startsWith('(')) return tinhTichHieuBinhPhuong(raw, rule) // sub-shape (b): khai triển tích
  // sub-shape (a): factor Ax²-C thành 2 nhân tử
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(raw)); if (!terms || terms.length !== 2) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, coefC = null
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = t.coef; else if (d === 0) coefC = t.coef; else return null }
  if (!coefA || !coefC || coefA.q !== 1n || coefA.p <= 0n || coefC.q !== 1n || coefC.p >= 0n) return null // cần đúng khuôn Ax²-C (C hiển thị âm)
  const sqA = isqrtBig(coefA.p), sqC = isqrtBig(-coefC.p); if (sqA === null || sqC === null) return null
  const ghepText = (a1, c1, a2, c2) => `(${hienThiDaThuc([{ coef: R(a1), vars: new Map([[bien, 1]]) }, { coef: R(c1), vars: new Map() }])})(${hienThiDaThuc([{ coef: R(a2), vars: new Map([[bien, 1]]) }, { coef: R(c2), vars: new Map() }])})`
  const dungText = ghepText(sqA, sqC, sqA, -sqC)
  if (!rule) return { text: dungText }
  if (rule === 'R225') { // hiểu nhầm thành BÌNH PHƯƠNG (2 nhân tử cùng dấu) thay vì HIỆU bình phương
    const t = ghepText(sqA, sqC, sqA, sqC); if (t === dungText) return null
    return { text: t, ds: 'hiểu nhầm hiệu hai bình phương thành bình phương, viết 2 nhân tử cùng dấu' }
  }
  if (rule === 'R226') { // quên căn bậc hai của hệ số A, dùng thẳng A
    if (R(coefA.p).p === R(sqA).p) return null
    const t = ghepText(coefA.p, sqC, coefA.p, -sqC); if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc hai của hệ số bậc 2, dùng thẳng hệ số A' }
  }
  if (rule === 'R227') { // quên căn bậc hai của hằng số C, dùng thẳng |C|
    const absC = -coefC.p; if (absC === sqC) return null
    const t = ghepText(sqA, absC, sqA, -absC); if (t === dungText) return null
    return { text: t, ds: 'quên lấy căn bậc hai của hằng số, dùng thẳng |C|' }
  }
  if (rule === 'R228') { const t = ghepText(sqA, sqC + 1n, sqA, -sqC); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng tự do của 1 nhân tử (dự phòng)' } }
  if (rule === 'R233') { // lưới an toàn — lệch 1 đơn vị hệ số biến ở 1 nhân tử (khi √A=1 và √C=1, R226/R227 đều vô hiệu)
    const t = ghepText(sqA + 1n, sqC, sqA, -sqC); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số của biến trong 1 nhân tử' }
  }
  return null
}
function tinhTichHieuBinhPhuong(raw, rule) { // sub-shape (b): "(A)(B)" — khai triển trực tiếp
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (topTerms.length !== 1) return null
  const hang = { sign: topTerms[0].sign, text: topTerms[0].text, terms: parseHangTuBieuThuc(topTerms[0].text) }
  if (!hang.terms) return null
  const dungTerms = hang.sign === '-' ? hang.terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : hang.terms
  const dungText = hienThiDaThuc(sapXepChuanDaThuc(dungTerms))
  if (!rule) return { text: dungText }
  const factorTexts = tachNhanTu(hang.text); if (factorTexts.length < 2) return null
  if (rule === 'R229') { // quên đổi dấu khi trừ cả cụm tích đã nhân — chỉ đổi dấu hạng tử đầu (chỉ áp dụng khi CẢ HẠNG NÀY bị trừ ở bậc ngoài, hiếm — dùng biến thể: chỉ nhân hạng đầu của nhân tử SAU thay vì đủ)
    const factorsPolys = factorTexts.map(parseFactorAsPoly); if (factorsPolys.some((p) => !p) || !factorsPolys.slice(1).some((p) => p.length >= 2)) return null
    const terms = nhanCacDaThuc([factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])])
    const tFull = hang.sign === '-' ? terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : terms
    const t = hienThiDaThuc(sapXepChuanDaThuc(tFull)); if (t === dungText) return null
    return { text: t, ds: 'chỉ nhân với hạng tử đầu của nhân tử thứ hai, quên phân phối hết' }
  }
  if (rule === 'R230') { // nhân số mũ biến chung thay vì cộng
    const factorsPolys = factorTexts.map(parseFactorAsPoly); if (factorsPolys.some((p) => !p)) return null
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
    const rawTerms = combos.map(({ coef, varLists }) => { const vars = new Map(); for (const [v, list] of varLists) vars.set(v, list.length >= 2 ? list.reduce((x, y) => x * y, 1) : list[0]); return { coef, vars } })
    const gop = new Map()
    for (const x of rawTerms) { const key = phanBienKey(x.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, x.coef), vars: x.vars } : x) }
    const terms = [...gop.values()].filter((x) => x.coef.p !== 0n)
    const tFull = hang.sign === '-' ? terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : terms
    const t = hienThiDaThuc(sapXepChuanDaThuc(tFull)); if (t === dungText) return null
    return { text: t, ds: 'nhân số mũ của biến chung giữa các hạng tử được nhân, thay vì cộng số mũ' }
  }
  if (rule === 'R231') { // nhầm dấu — coi phép trừ trong 1 nhân tử thành phép cộng (vd (2-3x) thành (2+3x))
    const factorsPolys = factorTexts.map(parseFactorAsPoly); if (factorsPolys.some((p) => !p)) return null
    let doiDau = false
    const saiFactors = factorsPolys.map((poly) => {
      if (doiDau || poly.length < 2 || !poly.some((p) => p.coef.p < 0n)) return poly
      doiDau = true
      return poly.map((p) => p.coef.p < 0n ? { coef: mul(R(-1n), p.coef), vars: p.vars } : p)
    })
    if (!doiDau) return null
    const terms = nhanCacDaThuc(saiFactors)
    const tFull = hang.sign === '-' ? terms.map((p) => ({ coef: mul(R(-1n), p.coef), vars: p.vars })) : terms
    const t = hienThiDaThuc(sapXepChuanDaThuc(tFull)); if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu trừ thành dấu cộng trong 1 nhân tử' }
  }
  if (rule === 'R232') {
    const sorted = sapXepChuanDaThuc(dungTerms); if (!sorted.length) return null
    const top = sorted[0]; const v = add(top.coef, R(1n))
    const terms = sorted.map((t) => t === top ? { coef: v, vars: t.vars } : t)
    const t = hienThiDaThuc(sapXepChuanDaThuc(terms)); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất (dự phòng)' }
  }
  return null
}

// ── DẠNG 33: Tính giá trị biểu thức ứng dụng hiệu hai bình phương (T108020402, khối 8) ───────────────────────
// TRỘN 2 sub-shape: (a) "Tính giá trị biểu thức $A = 79.81$" — nhân nhanh 2 số bằng mẹo hiệu hai bình phương
// (dấu CHẤM ở đây là NHÂN chứ KHÔNG phải thập phân — 2 số cách đều 1 số ở giữa) (6 câu); (b) "Tính: $A=x^2-C$
// tại $x=V$" — thế giá trị vào biểu thức có sẵn dạng x²-C, cùng khuôn thế-giá-trị như DẠNG 31 (11 câu).
// Đáp số là 1 GIÁ TRỊ HỮU TỈ bare — SPECIAL_DANG, không phải TEXT_DANG.
export function tinhGiaTriHieuBinhPhuong(noiDung, rule) {
  const s = String(noiDung)
  const mNhan = s.match(/\$[A-Za-zĐ]\s*=\s*(\d+)\.(\d+)\$/)
  if (mNhan && !s.includes('tại')) {
    const p = BigInt(mNhan[1]), q = BigInt(mNhan[2])
    const m = (p + q) / 2n, d = q > p ? (q - p) / 2n : (p - q) / 2n
    if (m * m - d * d !== p * q) return null // đảm bảo đúng khuôn (m-d)(m+d), lệch thì bỏ qua
    const dungVal = R(p * q)
    if (!rule) return { value: dungVal }
    if (rule === 'R234') { const v = R(m * m); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'quên trừ bình phương khoảng cách, chỉ lấy bình phương số ở giữa' } }
    if (rule === 'R235') { const v = R(m * m + d * d); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'nhầm dấu, cộng bình phương khoảng cách thay vì trừ' } }
    if (rule === 'R236') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
    if (rule === 'R237') { const v = sub(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị theo chiều ngược lại' } }
    return null
  }
  // sub-shape (b): thế giá trị vào x²-C
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  let exprRaw = segs[0].trim()
  const mLabel = exprRaw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) exprRaw = mLabel[2].trim()
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(exprRaw)); if (!terms || terms.length !== 2) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, hangSo = null
  for (const t of terms) { const dgr = t.vars.get(bien) ?? 0; if (dgr === 2) coefA = t; else if (dgr === 0) hangSo = t; else return null }
  if (!coefA || !hangSo || coefA.coef.p !== 1n || coefA.coef.q !== 1n) return null
  const subText = segs.slice(1).join(', ')
  const mGia = subText.match(new RegExp(`${bien}\\s*=\\s*(-?\\\\dfrac\\{[^{}]+\\}\\{[^{}]+\\}|-?\\d+(?:[.,]\\d+)?)`)); if (!mGia) return null
  const giaTriParsed = parseDonThucCore(mGia[1].replace(',', '.')); if (!giaTriParsed || giaTriParsed.vars.size > 0) return null
  const giaTri = giaTriParsed.coef
  const theSo = (ts) => { let total = R(0n); for (const t of ts) { let v = t.coef; const e = t.vars.get(bien) ?? 0; for (let k = 0; k < e; k++) v = mul(v, giaTri); total = add(total, v) } return total }
  const dungVal = theSo(terms)
  if (!rule) return { value: dungVal }
  if (rule === 'R238') { const v = mul(R(-1n), dungVal); if (!v || cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính sai dấu kết quả cuối cùng' } }
  if (rule === 'R239') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R240') { const v = sub(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị theo chiều ngược lại' } }
  if (rule === 'R241') { const v = sub(dungVal, hangSo.coef); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'quên trừ hạng tử hằng số, chỉ tính bình phương của giá trị thế' } }
  return null
}

// ── DẠNG 34: Biến đổi tổng/hiệu thành tích ứng dụng tổng-hiệu hai lập phương (T108020501, khối 8) ────────────
// TRỘN 4 sub-shape, mọi câu đều dựa trên CẶP hằng đẳng thức A³-B³=(A-B)(A²+AB+B²), A³+B³=(A+B)(A²-AB+B²)
// với A=kx (k nguyên dương, thường 1), B nguyên dương. (a) 21 câu "$Akx^3-C=\ldots$" (LHS đủ, RHS = TOÀN BỘ
// tích, chỉ gặp hiệu). (b) 11 câu "$x^3+\text{..}=(x+B)(\text{..})$" (LHS thiếu hằng số B³, nhân tử 1 cho
// sẵn, nhân tử 2 thiếu, chỉ gặp tổng, k=1) — **đáp số kho là 2 MẢNH nối bằng ";"**, format chưa từng gặp
// trong pipeline này ⇒ viết canon riêng `chuanHoaTongHieuLapPhuong` tách theo ";" rồi canon từng mảnh bằng
// `chuanHoaTachBinhPhuong` có sẵn. (c) 11 câu "$\ldots=(x\mp B)(\text{..})$" (LHS ẩn hoàn toàn NGOÀI \$, RHS
// nhân tử 1 cho sẵn — suy dấu+B, nhân tử 2 là đáp số duy nhất, k=1). (d) 11 câu "$\ldots=(\text{..})(x^2\pm
// Bx+\text{..})$" (LHS ẩn, RHS nhân tử 1 ẩn hoàn toàn, nhân tử 2 cho sẵn hạng GIỮA (suy dấu+B) nhưng thiếu
// hằng số cuối — đáp số kho là CẢ 2 nhân tử đầy đủ y hệt phần cho sẵn).
function faLapPhuong(bien, k, constTerm) { return hienThiDaThuc([{ coef: R(k), vars: new Map([[bien, 1]]) }, { coef: R(constTerm), vars: new Map() }]) }
function f2LapPhuong(bien, k2, midCoef, constTerm2) { return hienThiDaThuc([{ coef: R(k2), vars: new Map([[bien, 2]]) }, { coef: R(midCoef), vars: new Map([[bien, 1]]) }, { coef: R(constTerm2), vars: new Map() }]) }
function ghepLapPhuong(bien, k, B, dau) {
  const f1 = faLapPhuong(bien, k, dau === '-' ? -B : B)
  const f2 = f2LapPhuong(bien, k * k, (dau === '-' ? 1n : -1n) * k * B, B * B)
  return { f1, f2, text: `(${f1})(${f2})` }
}
export function chuanHoaTongHieuLapPhuong(s) {
  const raw = String(s ?? '')
  if (raw.includes(';')) return raw.split(';').map((p) => chuanHoaTachBinhPhuong(p)).join(' ; ')
  return chuanHoaTachBinhPhuong(raw)
}
export function evalTongHieuLapPhuongKetQua(s) { const t = chuanHoaTongHieuLapPhuong(s); return t || null }

function ruleSubA(bien, k, B, dau, coefAp, dung, rule) {
  if (rule === 'R242') {
    const newDau = dau === '-' ? '+' : '-'
    const t = ghepLapPhuong(bien, k, B, newDau).text; if (t === dung.text) return null
    return { text: t, ds: 'nhầm dấu hằng đẳng thức, đổi cả dấu nhân tử đầu và dấu hạng giữa của nhân tử bậc hai' }
  }
  if (rule === 'R243') {
    if (coefAp === k) return null
    const f1 = faLapPhuong(bien, coefAp, dau === '-' ? -B : B)
    const f2 = f2LapPhuong(bien, coefAp * coefAp, (dau === '-' ? 1n : -1n) * coefAp * B, B * B)
    const t = `(${f1})(${f2})`; if (t === dung.text) return null
    return { text: t, ds: 'quên lấy căn bậc ba của hệ số bậc 3, dùng thẳng hệ số A' }
  }
  if (rule === 'R244') {
    const f2 = f2LapPhuong(bien, k * k, (dau === '-' ? -1n : 1n) * k * B, B * B)
    const t = `(${dung.f1})(${f2})`; if (t === dung.text) return null
    return { text: t, ds: 'nhầm dấu hạng tử giữa của nhân tử bậc hai' }
  }
  if (rule === 'R245') {
    const f2 = f2LapPhuong(bien, k * k, (dau === '-' ? 1n : -1n) * k * B, B * B + 1n)
    const t = `(${dung.f1})(${f2})`; if (t === dung.text) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số cuối của nhân tử bậc hai (dự phòng)' }
  }
  return null
}
function ruleSubB(bien, B, dung, dungLhs, rule) {
  if (rule === 'R246') {
    const v = B; if (v === dungLhs) return null
    return { text: `${v}; ${dung.f2}`, ds: 'quên lập phương hằng số B, dùng thẳng B' }
  }
  if (rule === 'R247') {
    const v = B * B; if (v === dungLhs) return null
    return { text: `${v}; ${dung.f2}`, ds: 'nhầm lập phương thành bình phương của B' }
  }
  if (rule === 'R248') {
    const f2 = f2LapPhuong(bien, 1n, B, B * B); if (f2 === dung.f2) return null
    return { text: `${dungLhs}; ${f2}`, ds: 'nhầm dấu hạng tử giữa của nhân tử bậc hai' }
  }
  if (rule === 'R249') {
    const f2 = f2LapPhuong(bien, 1n, -B, B * B + 1n); if (f2 === dung.f2) return null
    return { text: `${dungLhs}; ${f2}`, ds: 'tính lệch 1 đơn vị ở hằng số cuối của nhân tử bậc hai (dự phòng)' }
  }
  if (rule === 'R258') { // rescue — khác trục với R246/R247 (thường vô hiệu khi B=1) và R248/R249
    const f2 = f2LapPhuong(bien, 1n, -(B + 1n), B * B); if (f2 === dung.f2) return null
    return { text: `${dungLhs}; ${f2}`, ds: 'tính lệch 1 đơn vị ở hệ số của hạng tử giữa nhân tử bậc hai' }
  }
  return null
}
function ruleSubC(bien, B, dau, dung, rule) {
  if (rule === 'R250') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? -1n : 1n) * B, B * B); if (f2 === dung.f2) return null
    return { text: f2, ds: 'nhầm dấu hạng tử giữa' }
  }
  if (rule === 'R251') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? 1n : -1n) * B, B); if (f2 === dung.f2) return null
    return { text: f2, ds: 'quên bình phương hằng số B, dùng thẳng B làm hằng số cuối' }
  }
  if (rule === 'R252') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? 1n : -1n) * B, B * B + 1n); if (f2 === dung.f2) return null
    return { text: f2, ds: 'tính lệch 1 đơn vị ở hằng số cuối (dự phòng)' }
  }
  if (rule === 'R253') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? 1n : -1n) * (B + 1n), B * B); if (f2 === dung.f2) return null
    return { text: f2, ds: 'tính lệch 1 đơn vị ở hệ số của hạng tử giữa' }
  }
  return null
}
function ruleSubD(bien, B, dau, dung, rule) {
  if (rule === 'R254') {
    const f1 = faLapPhuong(bien, 1n, dau === '-' ? B : -B)
    const t = `(${f1})(${dung.f2})`; if (t === dung.text) return null
    return { text: t, ds: 'nhầm dấu nhân tử đầu, không khớp với hạng tử giữa đã cho ở nhân tử bậc hai' }
  }
  if (rule === 'R255') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? 1n : -1n) * B, B)
    const t = `(${dung.f1})(${f2})`; if (t === dung.text) return null
    return { text: t, ds: 'quên bình phương hằng số B, dùng thẳng B làm hằng số cuối' }
  }
  if (rule === 'R256') {
    const f2 = f2LapPhuong(bien, 1n, (dau === '-' ? 1n : -1n) * B, B * B + 1n)
    const t = `(${dung.f1})(${f2})`; if (t === dung.text) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số cuối của nhân tử bậc hai (dự phòng)' }
  }
  if (rule === 'R257') {
    const f1 = faLapPhuong(bien, 1n, dau === '-' ? -(B + 1n) : (B + 1n))
    const t = `(${f1})(${dung.f2})`; if (t === dung.text) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số của nhân tử đầu' }
  }
  return null
}
export function tongHieuLapPhuong(noiDung, rule) {
  const cleaned = String(noiDung).replace(/\$/g, '').replace(/\n/g, ' ').replace(/\s+/g, ' ').trim().replace(/^(vd|vídụ|ví dụ)\s*:\s*/i, '')
  const eqIdx = cleaned.indexOf('='); if (eqIdx < 0) return null
  const lhsRaw = cleaned.slice(0, eqIdx).trim(), rhsRaw = cleaned.slice(eqIdx + 1).trim()

  if (/^\.+$/.test(rhsRaw)) { // sub-shape (a): RHS toàn dấu chấm — LHS đầy đủ Ax³±C
    const terms = parseFactorAsPoly(chuanBiBieuThucNhan(lhsRaw)); if (!terms || terms.length !== 2) return null
    const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
    if (bienSet.size !== 1) return null
    const bien = [...bienSet][0]
    let coefA = null, coefC = null
    for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 3) coefA = t.coef; else if (d === 0) coefC = t.coef; else return null }
    if (!coefA || !coefC || coefA.q !== 1n || coefA.p <= 0n || coefC.q !== 1n) return null
    const k = icbrtBig(coefA.p); if (k === null) return null
    const dau = coefC.p < 0n ? '-' : '+'
    const B = icbrtBig(dau === '-' ? -coefC.p : coefC.p); if (B === null) return null
    const dung = ghepLapPhuong(bien, k, B, dau)
    if (!rule) return { text: dung.text }
    return ruleSubA(bien, k, B, dau, coefA.p, dung, rule)
  }

  if (cleaned.includes('\\text{')) { // sub-shape (b): LHS thiếu hằng số, RHS nhân tử 1 cho sẵn
    const mLhs = lhsRaw.match(/^([a-zA-Z])\^3\s*\+\s*\\text\{/); if (!mLhs) return null
    const bien = mLhs[1]
    const mF1 = rhsRaw.match(/^\(([a-zA-Z])\+(\d+)\)/); if (!mF1 || mF1[1] !== bien) return null
    const B = BigInt(mF1[2])
    const dung = ghepLapPhuong(bien, 1n, B, '+')
    const dungLhs = B * B * B
    if (!rule) return { text: `${dungLhs}; ${dung.f2}` }
    return ruleSubB(bien, B, dung, dungLhs, rule)
  }

  const mRhs = rhsRaw.match(/^\(([^()]*)\)\(([^()]*)\)$/); if (!mRhs) return null // sub-shape (c)/(d)
  const f1raw = mRhs[1].trim(), f2raw = mRhs[2].trim()
  if (/^\.+$/.test(f2raw) && !/^\.+$/.test(f1raw)) { // (c): nhân tử 1 cho sẵn, nhân tử 2 toàn dấu chấm
    const mF1 = f1raw.match(/^([a-zA-Z])\s*([+-])\s*(\d+)$/); if (!mF1) return null
    const bien = mF1[1], dau = mF1[2], B = BigInt(mF1[3])
    const dung = ghepLapPhuong(bien, 1n, B, dau)
    if (!rule) return { text: dung.f2 }
    return ruleSubC(bien, B, dau, dung, rule)
  }
  if (/^\.+$/.test(f1raw)) { // (d): nhân tử 1 toàn dấu chấm, nhân tử 2 cho sẵn hạng đầu+giữa, thiếu hằng số cuối
    const mF2 = f2raw.match(/^([a-zA-Z])\^2\s*([+-])\s*(\d*)\s*\1\s*\+\s*\.+$/); if (!mF2) return null
    const bien = mF2[1], dauGiua = mF2[2], B = mF2[3] === '' ? 1n : BigInt(mF2[3])
    const dau = dauGiua === '+' ? '-' : '+'
    const dung = ghepLapPhuong(bien, 1n, B, dau)
    if (!rule) return { text: dung.text }
    return ruleSubD(bien, B, dau, dung, rule)
  }
  return null
}

// ── DẠNG 35: Tính giá trị biểu thức áp dụng tổng-hiệu hai lập phương (T108020502, khối 8) ────────────────────
// Biểu thức luôn là TÍCH đã cho sẵn dạng $(A\mp B)(A^2\pm AB+B^2)$ — KHÔNG cần nhận diện lại hằng đẳng thức,
// chỉ cần THẾ GIÁ TRỊ (giống hệt DẠNG 23 `tinhGiaTriRutGon` nhưng regex nhận GIÁ TRỊ sửa lại để bắt cả
// THẬP PHÂN DẤU PHẨY "1,5" — DẠNG 23 chỉ nhận dấu chấm, không parse được sub-shape 2 biến của dạng này).
export function tinhGiaTriApDungLapPhuong(noiDung, rule) {
  const segs = [...String(noiDung).matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  let exprRaw = segs[0].trim()
  const mLabel = exprRaw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) exprRaw = mLabel[2].trim()
  const expr = chuanBiBieuThucNhan(exprRaw)
  const topTerms = chiaHangTu(expr); if (!topTerms.length) return null
  const hangList = topTerms.map((t) => ({ sign: t.sign, text: t.text, terms: parseHangTuBieuThuc(t.text) }))
  if (hangList.some((h) => !h.terms)) return null
  const gopLai = (layTerms) => {
    const gop = new Map()
    for (const h of hangList) for (const p of layTerms(h)) {
      const c = h.sign === '-' ? mul(R(-1n), p.coef) : p.coef
      const key = phanBienKey(p.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: p.vars } : { coef: c, vars: p.vars })
    }
    return [...gop.values()].filter((x) => x.coef.p !== 0n)
  }
  const dungTerms = gopLai((h) => h.terms)
  const subText = segs.slice(1).join(', ')
  const gia = new Map(); const reGan = /([a-zA-Z])\s*=\s*(-?\\dfrac\{[^{}]+\}\{[^{}]+\}|-?\d+(?:[.,]\d+)?)/g; let gm
  while ((gm = reGan.exec(subText))) { const p = parseDonThucCore(gm[2].replace(',', '.')); if (!p || p.vars.size > 0 || p.hasIrrational) return null; gia.set(gm[1], p.coef) }
  if (gia.size < 1) return null
  const theSo = (terms, giaTri) => {
    let total = R(0n)
    for (const t of terms) {
      let v = t.coef
      for (const [bien, e] of t.vars) { const gv = giaTri.get(bien); if (!gv) return null; for (let k = 0; k < e; k++) v = mul(v, gv) }
      total = add(total, v)
    }
    return total
  }
  const dungVal = theSo(dungTerms, gia); if (!dungVal) return null
  if (!rule) return { value: dungVal }
  if (rule === 'R259') { // chỉ nhân hạng tử đầu của nhân tử thứ hai, quên phân phối hết (như R172 DẠNG 23)
    let coApDung = false
    const layTerms = (h) => {
      const factorTexts = tachNhanTu(h.text)
      if (factorTexts.length < 2) return h.terms
      const factorsPolys = factorTexts.map(parseFactorAsPoly)
      if (factorsPolys.some((p) => !p) || !factorsPolys.slice(1).some((p) => p.length >= 2)) return h.terms
      coApDung = true
      return nhanCacDaThuc([factorsPolys[0], ...factorsPolys.slice(1).map((p) => [p[0]])])
    }
    const saiTerms = gopLai(layTerms); if (!coApDung) return null
    const v = theSo(saiTerms, gia); if (!v || cmp(v, dungVal) === 0) return null
    return { value: v, ds: 'chỉ nhân với hạng tử đầu của nhân tử thứ hai, quên phân phối hết' }
  }
  if (rule === 'R260') { // hoán đổi nhầm giá trị thế của 2 biến
    const bienList = [...gia.keys()]; if (bienList.length < 2) return null
    const giaSai = new Map(gia); giaSai.set(bienList[0], gia.get(bienList[1])); giaSai.set(bienList[1], gia.get(bienList[0]))
    const v = theSo(dungTerms, giaSai); if (!v || cmp(v, dungVal) === 0) return null
    return { value: v, ds: `hoán đổi nhầm giá trị thế của ${bienList[0]} và ${bienList[1]}` }
  }
  if (rule === 'R261') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R262') { const v = mul(R(-1n), dungVal); if (!v || cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính sai dấu kết quả cuối cùng' } }
  return null
}

// ── DẠNG 36: Tổng bình phương/lập phương 2 biến qua tổng-tích (T108020701, sub-shape 2 biến, khối 8) ─────────
// Đề "Cho $a+b=S$; $ab=P$. Tính $a^2+b^2$" (hoặc $a^3+b^3$) — LUÔN giải bằng ĐÚNG 1 hằng đẳng thức cố định:
// $a^2+b^2=S^2-2P$ hoặc $a^3+b^3=S^3-3SP$. CHỈ làm sub-shape 2 biến này (17/49 câu của T108020701) — CEO
// chốt 13/09: các sub-shape 3 biến (ép $a=b=c$, hoặc Newton power-sum qua $e_1,e_2,e_3$) phức tạp hơn hẳn,
// cần suy luận riêng từng câu, để lại làm sau, không ép vào cùng 1 engine.
export function tongBinhLapPhuongHaiBien(noiDung, rule) {
  const s = String(noiDung)
  const m1 = s.match(/\$([a-zA-Z])\s*\+\s*([a-zA-Z])\s*=\s*(-?\d+)\$/); if (!m1) return null
  const bienA = m1[1], bienB = m1[2], S = BigInt(m1[3])
  const m2 = s.match(new RegExp(`\\$${bienA}${bienB}\\s*=\\s*(-?\\d+)\\$`)) || s.match(new RegExp(`\\$${bienB}${bienA}\\s*=\\s*(-?\\d+)\\$`)); if (!m2) return null
  const P = BigInt(m2[1])
  const mTarget = s.match(new RegExp(`Tính\\s*\\$${bienA}\\^([23])\\s*\\+\\s*${bienB}\\^\\1\\$`)); if (!mTarget) return null
  const bac = Number(mTarget[1])
  const dungVal = bac === 2 ? R(S * S - 2n * P) : R(S * S * S - 3n * S * P)
  if (!rule) return { value: dungVal }
  if (rule === 'R264') { const v = bac === 2 ? R(S * S) : R(S * S * S); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: `quên trừ ${bac === 2 ? '2ab' : '3ab(a+b)'}, chỉ tính $(a+b)^${bac}$` } }
  if (rule === 'R265') { const v = bac === 2 ? R(S * S + 2n * P) : R(S * S * S + 3n * S * P); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'nhầm dấu, cộng thay vì trừ' } }
  if (rule === 'R266') { const v = bac === 2 ? R(S * S - P) : R(S * S * S - S * P); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: `quên hệ số nhân (${bac === 2 ? '2' : '3'}), chỉ trừ ${bac === 2 ? 'ab' : 'ab(a+b)'}` } }
  if (rule === 'R267') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R268') { // rescue — cứu ca S=0 khiến R264/R265/R266 đều trùng 0 (mọi số hạng có nhân tử S đều triệt tiêu)
    const v = sub(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null
    return { value: v, ds: 'tính lệch 1 đơn vị theo chiều ngược lại' }
  }
  if (rule === 'R269') { // rescue — nhầm sang công thức của bậc còn lại (độc lập với nhân tử S, cứu tiếp ca S=0)
    const v = bac === 2 ? R(S * S * S - 3n * S * P) : R(S * S - 2n * P); if (cmp(v, dungVal) === 0) return null
    return { value: v, ds: `nhầm sang công thức của $a^${bac === 2 ? 3 : 2}+b^${bac === 2 ? 3 : 2}$` }
  }
  return null
}

// ── DẠNG 37: $a^3+b^3+K^3=3Kab$, $a\ne b$ ⇒ $a+b=-K$ (T108020702, sub-shape tính M, khối 8) ──────────────────
// Đề "Cho $a^3+b^3+27=9ab$. Biết $a\ne b$. Tính $M=a+b+14$" — ứng dụng $a^3+b^3+c^3-3abc=(a+b+c)(\ldots)$
// với $c=K$: nhân tử thứ 2 = 0 ⟺ $a=b=c=K$ (loại vì $a\ne b$) ⇒ nhân tử 1 = 0 ⟺ $a+b+K=0$ ⇒ $a+b=-K$.
// CHỈ làm sub-shape NÀY (6/15 câu) — 9 câu còn lại của T108020702 là "Chứng minh" (không có đáp số MCQ) hoặc
// đề "Tính" nhưng đáp số LUÔN LÀ HẰNG SỐ 3 bất kể số liệu (identity $x+y+z=0\Rightarrow x^3+y^3+z^3=3xyz`),
// quá mỏng (2 câu) và không có tham số biến thiên để sinh nhiễu có ý nghĩa — bỏ qua tự nhiên, không cần hỏi
// CEO (giống việc bỏ câu "Chứng minh" ở mọi dạng khác trong phiên này).
export function tongLapPhuongCongThemHangSo(noiDung, rule) {
  const s = String(noiDung)
  const m1 = s.match(/\$a\^3\s*\+\s*b\^3\s*([+-])\s*(\d+)\s*=\s*(-?)\s*(\d+)ab\$/); if (!m1) return null
  const constTerm = m1[1] === '-' ? -BigInt(m1[2]) : BigInt(m1[2])
  const coefAB = m1[3] === '-' ? -BigInt(m1[4]) : BigInt(m1[4])
  if (coefAB % 3n !== 0n) return null
  const K = coefAB / 3n; if (K * K * K !== constTerm) return null
  const mC = s.match(/M\s*=\s*a\s*\+\s*b\s*([+-])\s*(\d+)/); if (!mC) return null
  const C = mC[1] === '-' ? -BigInt(mC[2]) : BigInt(mC[2])
  const aPlusB = -K
  const dungVal = R(aPlusB + C)
  if (!rule) return { value: dungVal }
  if (rule === 'R270') { const v = R(K + C); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'quên đổi dấu, dùng $a+b=K$ thay vì $a+b=-K$' } }
  if (rule === 'R271') { const v = R(aPlusB - C); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'nhầm dấu hằng số cộng thêm khi tính M' } }
  if (rule === 'R272') { const v = R(aPlusB); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'quên cộng hằng số, chỉ lấy $a+b$' } }
  if (rule === 'R273') { const v = add(dungVal, R(1n)); if (cmp(v, dungVal) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  return null
}

// ── DẠNG 38: Phân tích đa thức thành nhân tử — rút nhân tử chung (T108030101, khối 8) ────────────────────────
// Mỗi hạng tử = [hệ số·biến] × tối đa 1 CỤM HỢP (ngoặc, có thể xuất hiện với dấu ngược — vd (3-y)=-(y-3)).
// Rút: GCD hệ số + biến chung (mũ nhỏ nhất, 0 nếu vắng ở 1 hạng) + cụm hợp chung (sau khi chuẩn hoá dấu).
function phanTichDaThucCumNhanTu(text) { // parse 1 cụm CÓ THỂ nhiều hạng tử (vd "y-3", "x-3y") → mảng terms đã gộp
  // (parseHangTuBieuThuc chỉ dành cho 1 hạng-tích, KHÔNG tự tách +/- top-level — phải chiaHangTu trước)
  const topTerms = chiaHangTu(text); if (!topTerms.length) return null
  const gop = new Map()
  for (const t of topTerms) {
    const p = parseHangTuBieuThuc(t.text); if (!p) return null
    for (const term of p) {
      const c = t.sign === '-' ? mul(R(-1n), term.coef) : term.coef
      const key = phanBienKey(term.vars); const old = gop.get(key)
      gop.set(key, old ? { coef: add(old.coef, c), vars: term.vars } : { coef: c, vars: term.vars })
    }
  }
  return [...gop.values()].filter((x) => x.coef.p !== 0n)
}
function chuanHoaCumNhanTu(text) { // canon 1 cụm ngoặc đa hạng → {sign, key, terms} — sign để so dấu (3-y)=-(y-3)
  const terms = phanTichDaThucCumNhanTu(text); if (!terms || !terms.length) return null
  const sorted = sapXepChuanDaThuc(terms); if (!sorted.length) return null
  const sign = sorted[0].coef.p < 0n ? -1n : 1n
  const norm = sign === -1n ? sorted.map((t) => ({ coef: mul(R(-1n), t.coef), vars: t.vars })) : sorted
  return { sign, key: hienThiDaThuc(norm) }
}
export function rutNhanTuChung(noiDung, rule) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  const mLabel2 = String(noiDung).match(/thành nhân tử\s*\.?\s*$/) // sub-shape "Phân tích đa thức $...$ thành nhân tử." — biểu thức KHÔNG có "="
  let raw = mLabel2 ? m[1].trim() : m[1].split('=')[0].trim()
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (topTerms.length < 2) return null
  const parsed = []
  for (const t of topTerms) {
    const factors = tachNhanTu(t.text)
    let coef = R(1n); const vars = new Map(); let compound = null, compoundCount = 0
    for (const f of factors) {
      const mono = parseDonThucCore(f)
      if (mono && !mono.hasIrrational) { coef = mul(coef, mono.coef); for (const [v, e] of mono.vars) vars.set(v, (vars.get(v) ?? 0) + e); continue }
      const c = chuanHoaCumNhanTu(f); if (!c) return null
      if (compound && compound.key !== c.key) return null // 2 cụm hợp KHÁC nhau trong 1 hạng — vượt phạm vi rút nhân tử chung đơn giản
      compound = c; compoundCount++
    }
    if (compoundCount > 1) return null // cụm hợp lặp lại (mũ >1) — vượt phạm vi sub-shape này
    const totalSign = (t.sign === '-' ? -1n : 1n) * (compound ? compound.sign : 1n)
    parsed.push({ sign: totalSign, coef, vars, compoundKey: compound?.key ?? null })
  }
  const gcdBig = (a, b) => { while (b) { [a, b] = [b, a % b] }; return a < 0n ? -a : a }
  const gAbs = parsed.reduce((g, p) => gcdBig(g, p.coef.p), 0n); if (gAbs === 0n) return null
  const allNeg = parsed.every((p) => p.sign === -1n)
  const G = allNeg ? -gAbs : gAbs
  const allVars = new Set(); for (const p of parsed) for (const v of p.vars.keys()) allVars.add(v)
  const commonVars = new Map()
  for (const v of allVars) { const minE = Math.min(...parsed.map((p) => p.vars.get(v) ?? 0)); if (minE > 0) commonVars.set(v, minE) }
  const compoundKeys = new Set(parsed.map((p) => p.compoundKey))
  let commonCompoundKey = null
  if (parsed.every((p) => p.compoundKey !== null) && compoundKeys.size === 1) commonCompoundKey = parsed[0].compoundKey
  else if (parsed.some((p) => p.compoundKey !== null)) return null // cụm hợp không xuất hiện ở MỌI hạng — vượt phạm vi (cần nhóm hạng tử)
  const remTerms = parsed.map((p) => {
    const signedCoef = p.sign === -1n ? -p.coef.p : p.coef.p
    const remCoef = signedCoef / G; if (remCoef * G !== signedCoef) return null
    const remVars = new Map()
    for (const [v, e] of p.vars) { const left = e - (commonVars.get(v) ?? 0); if (left > 0) remVars.set(v, left) }
    return { coef: R(remCoef), vars: remVars }
  })
  if (remTerms.some((t) => !t)) return null
  const remText = hienThiDaThuc(sapXepChuanDaThuc(remTerms))
  const monoText = hienThiDonThuc(R(G), commonVars)
  const dungText = `${monoText}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${remText})`
  if (!rule) return { text: dungText }
  if (rule === 'R274') { // quên rút hệ số (dùng thẳng 1, không chia hệ số) — chỉ khi |G|>1
    if (gAbs === 1n) return null
    const remWrong = parsed.map((p) => {
      const signedCoef = p.sign === -1n ? -p.coef.p : p.coef.p
      const remVars = new Map(); for (const [v, e] of p.vars) { const left = e - (commonVars.get(v) ?? 0); if (left > 0) remVars.set(v, left) }
      return { coef: R(signedCoef), vars: remVars }
    })
    const t = `${hienThiDonThuc(R(1n), commonVars)}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(remWrong))})`
    if (t === dungText) return null
    return { text: t, ds: 'quên rút hệ số chung, chỉ rút phần biến' }
  }
  if (rule === 'R275') { // rút hệ số SAI — dùng 1 ước số của G (không phải GCD lớn nhất) — chỉ khi G có ước thực sự
    let uocSai = null
    for (let k = 2n; k * k <= gAbs; k++) if (gAbs % k === 0n) { uocSai = allNeg ? -k : k; break }
    if (!uocSai) return null
    const gWrong = uocSai
    const remWrong = parsed.map((p) => {
      const signedCoef = p.sign === -1n ? -p.coef.p : p.coef.p
      const remVars = new Map(); for (const [v, e] of p.vars) { const left = e - (commonVars.get(v) ?? 0); if (left > 0) remVars.set(v, left) }
      const rc = signedCoef / gWrong; if (rc * gWrong !== signedCoef) return null
      return { coef: R(rc), vars: remVars }
    })
    if (remWrong.some((x) => !x)) return null
    const t = `${hienThiDonThuc(R(gWrong), commonVars)}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(remWrong))})`
    if (t === dungText) return null
    return { text: t, ds: 'rút nhân tử chung chưa lớn nhất, chỉ rút 1 ước của GCD' }
  }
  if (rule === 'R276') { // quên rút 1 biến chung (bỏ sót 1 biến trong phần chung, để nguyên trong ngoặc) — chỉ khi có ≥1 biến chung
    if (!commonVars.size) return null
    const bienBoQuen = [...commonVars.keys()][0]
    const commonVarsWrong = new Map(commonVars); commonVarsWrong.delete(bienBoQuen)
    const remWrong = parsed.map((p) => {
      const signedCoef = p.sign === -1n ? -p.coef.p : p.coef.p
      const remCoef = signedCoef / G; if (remCoef * G !== signedCoef) return null
      const remVars = new Map(); for (const [v, e] of p.vars) { const left = e - (commonVarsWrong.get(v) ?? 0); if (left > 0) remVars.set(v, left) }
      return { coef: R(remCoef), vars: remVars }
    })
    if (remWrong.some((x) => !x)) return null
    const t = `${hienThiDonThuc(R(G), commonVarsWrong)}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(remWrong))})`
    if (t === dungText) return null
    return { text: t, ds: `quên rút biến ${bienBoQuen} chung, để sót lại trong ngoặc` }
  }
  if (rule === 'R277') { // nhầm dấu hạng tử cuối trong ngoặc còn lại — lỗi chép/tính sai dấu khi rút gọn
    const bracket = sapXepChuanDaThuc(remTerms); if (bracket.length < 2) return null
    const last = bracket[bracket.length - 1]
    const terms = bracket.map((x) => x === last ? { coef: mul(R(-1n), x.coef), vars: x.vars } : x)
    const t = `${monoText}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(terms))})`
    if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu 1 hạng tử trong ngoặc còn lại' }
  }
  if (rule === 'R278') { const bracket = sapXepChuanDaThuc(remTerms); if (!bracket.length) return null; const top = bracket[0]; const v = add(top.coef, R(1n)); const terms = bracket.map((x) => x === top ? { coef: v, vars: x.vars } : x); const t = `${monoText}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(terms))})`; if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc (dự phòng)' } }
  if (rule === 'R280') { // rescue — chiều ngược lại R278, cứu ca không có hệ số/biến chung để rút (R274-276 vô hiệu, chỉ còn R277)
    const bracket = sapXepChuanDaThuc(remTerms); if (!bracket.length) return null
    const top = bracket[0]; const v = sub(top.coef, R(1n))
    const terms = bracket.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${monoText}${commonCompoundKey ? `(${commonCompoundKey})` : ''}(${hienThiDaThuc(sapXepChuanDaThuc(terms))})`
    if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc theo chiều ngược lại' }
  }
  return null
}
// Canon RIÊNG cho "rút nhân tử chung" — KHÔNG được dùng chuanHoaTachBinhPhuong (so bằng GIÁ TRỊ khai triển):
// với bài toán PHÂN TÍCH THÀNH NHÂN TỬ, "3(2x²-4)" và "6(x²-2)" khai triển RA CÙNG 1 GIÁ TRỊ nhưng là 2 cách
// rút KHÁC NHAU (1 cái chưa rút hết) — so bằng giá trị sẽ coi nhầm 2 đáp số khác nhau là "trùng". Canon này
// tách factor số·biến (không ngoặc) RIÊNG khỏi các cụm trong ngoặc (canon từng cụm bằng đa thức rồi sort),
// giữ nguyên ranh giới "cái gì đã được rút ra ngoài" — đúng bản chất phép so sánh cần thiết.
export function chuanHoaRutNhanTuChung(s) {
  // Mỗi cụm ngoặc CANON HOÁ THEO DẤU (leading term dương — vd "3-c" ↔ "c-3") rồi dồn dấu bị lật vào hệ số
  // ngoài: "(3-c)(5c-2)" và "(c-3)(-5c+2)" PHẢI ra CÙNG 1 canon vì lật dấu 2 cụm cùng lúc không đổi giá trị
  // tích — đây là 1 quy ước viết KHÁC nhau nhưng tương đương, không phải lỗi "chưa rút hết" (khác hẳn ca
  // "x²y²(18x²-24)" vs "6x²y²(3x²-4)" — 2 MỨC rút khác nhau, phải phân biệt được, xem comment ở trên).
  const clean = String(s ?? '').replace(/\$/g, '').replace(/\\left|\\right/g, '').trim()
  const expr = chuanBiBieuThucNhan(clean)
  const factors = tachNhanTu(expr)
  let coef = R(1n); const vars = new Map(); const brackets = []
  for (const f of factors) {
    const mono = parseDonThucCore(f)
    if (mono && !mono.hasIrrational) { coef = mul(coef, mono.coef); for (const [v, e] of mono.vars) vars.set(v, (vars.get(v) ?? 0) + e); continue }
    const c = chuanHoaCumNhanTu(f); if (!c) return clean
    coef = mul(coef, R(c.sign)); brackets.push(c.key)
  }
  brackets.sort()
  return `${hienThiDonThuc(coef, vars)}::${brackets.join('|')}`
}
export function evalRutNhanTuChungKetQua(s) { const t = chuanHoaRutNhanTuChung(s); return t || null }

// ── DẠNG 39: Phân tích đa thức thành nhân tử — nhóm hạng tử (T108030102, khối 8) ──────────────────────────────
// CHỈ làm sub-shape "4 hạng tử, nhóm 2 hạng ĐẦU + 2 hạng CUỐI (thứ tự viết sẵn, không cần thử mọi cách nhóm)"
// — khảo sát thực tế: mọi câu mẫu đều nhóm theo đúng thứ tự liền kề. Mỗi nhóm rút GCD riêng (dùng lại máy
// GCD 2-hạng), 2 nhóm phải ra CÙNG 1 cụm ngoặc (cùng hoặc ngược dấu) mới nhóm được; sau đó thử rút THÊM 1
// lớp GCD nữa trên đơn thức "hệ số nhóm 1 ± hệ số nhóm 2" (ca $x^3+x^2y-x^2z-xyz=(x+y)(x^2-xz)=x(x+y)(x-z)$
// cần đúng bước này). Đáp số cùng khuôn "hệ số·biến·(ngoặc)(ngoặc)" như DẠNG 38 ⇒ TÁI DÙNG canon
// `chuanHoaRutNhanTuChung`. Bỏ qua tự nhiên các câu cần nhận diện hằng đẳng thức trong 1 nhóm (nhóm 3+2 hạng
// dạng bình phương) hoặc nhóm không phải 4 hạng — phức tạp hơn hẳn, để sau.
function gcdBigDon(a, b) { while (b) { [a, b] = [b, a % b] }; return a < 0n ? -a : a }
function trichGcdDonThuc(items) { // items: [{sign:±1n, coefAbs:BigInt, vars:Map}] → {G:BigInt, commonVars, remTerms} | null
  const gAbs = items.reduce((g, p) => gcdBigDon(g, p.coefAbs), 0n); if (gAbs === 0n) return null
  const allNeg = items.every((p) => p.sign === -1n)
  const G = allNeg ? -gAbs : gAbs
  const allVars = new Set(); for (const p of items) for (const v of p.vars.keys()) allVars.add(v)
  const commonVars = new Map()
  for (const v of allVars) { const minE = Math.min(...items.map((p) => p.vars.get(v) ?? 0)); if (minE > 0) commonVars.set(v, minE) }
  const remTerms = items.map((p) => {
    const signedCoef = p.sign * p.coefAbs
    const remCoef = signedCoef / G; if (remCoef * G !== signedCoef) return null
    const remVars = new Map(); for (const [v, e] of p.vars) { const left = e - (commonVars.get(v) ?? 0); if (left > 0) remVars.set(v, left) }
    return { coef: R(remCoef), vars: remVars }
  })
  if (remTerms.some((t) => !t)) return null
  return { G, commonVars, remTerms }
}
function ghepNhomHangTu(items) { // items: 4 phần tử {sign,coefAbs,vars} → {b1Text, m2Sign, outerList, g1, g2} | null
  const g1 = trichGcdDonThuc(items.slice(0, 2)); const g2 = trichGcdDonThuc(items.slice(2, 4)); if (!g1 || !g2) return null
  const b1 = sapXepChuanDaThuc(g1.remTerms), b2 = sapXepChuanDaThuc(g2.remTerms)
  const b1Text = hienThiDaThuc(b1), b2Text = hienThiDaThuc(b2)
  const b2NegText = hienThiDaThuc(sapXepChuanDaThuc(g2.remTerms.map((t) => ({ coef: mul(R(-1n), t.coef), vars: t.vars }))))
  let m2Sign
  if (b1Text === b2Text) m2Sign = 1n
  else if (b1Text === b2NegText) m2Sign = -1n
  else return null
  const outerRaw = [{ coef: R(g1.G), vars: g1.commonVars }, { coef: R(m2Sign * g2.G), vars: g2.commonVars }]
  const gop = new Map()
  for (const t of outerRaw) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
  const outerList = [...gop.values()].filter((x) => x.coef.p !== 0n)
  if (outerList.length !== 2) return null // gộp mất còn 1 hạng hoặc triệt tiêu hết — ngoài phạm vi sub-shape này
  return { b1Text, m2Sign, outerList, g1, g2 }
}
function thuHieuBinhPhuong(terms) { // thử phân tích Ax²-C (2 hạng, 1 biến) thành (√A x+√C)(√A x-√C)
  if (terms.length !== 2) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, coefC = null
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = t.coef; else if (d === 0) coefC = t.coef; else return null }
  if (!coefA || !coefC || coefA.q !== 1n || coefA.p <= 0n || coefC.q !== 1n || coefC.p >= 0n) return null
  const sqA = isqrtBig(coefA.p), sqC = isqrtBig(-coefC.p); if (sqA === null || sqC === null) return null
  const f1 = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: R(sqC), vars: new Map() }])
  const f2 = hienThiDaThuc([{ coef: R(sqA), vars: new Map([[bien, 1]]) }, { coef: R(-sqC), vars: new Map() }])
  return { f1, f2 }
}
export function nhomHangTu(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$\s*thành nhân tử/) || s.match(/thành nhân tử:\s*\$([^$]+)\$/) || s.match(/ĐTTNT:\s*\$([^$]+)\$/)
  if (!m) return null
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(m[1].trim())); if (topTerms.length !== 4) return null
  const items = topTerms.map((t) => { const p = parseDonThucCore(t.text); if (!p || p.hasIrrational) return null; return { sign: t.sign === '-' ? -1n : 1n, coefAbs: p.coef.p < 0n ? -p.coef.p : p.coef.p, vars: p.vars } })
  if (items.some((x) => !x)) return null
  const ghep = ghepNhomHangTu(items); if (!ghep) return null
  const { b1Text, outerList } = ghep
  const outerItems = outerList.map((t) => ({ sign: t.coef.p < 0n ? -1n : 1n, coefAbs: t.coef.p < 0n ? -t.coef.p : t.coef.p, vars: t.vars }))
  const g3 = trichGcdDonThuc(outerItems)
  const coRutThem = g3 && (g3.G !== 1n || g3.commonVars.size > 0)
  const extraMono = coRutThem ? hienThiDonThuc(R(g3.G), g3.commonVars) : ''
  const finalOuterList = coRutThem ? sapXepChuanDaThuc(g3.remTerms) : sapXepChuanDaThuc(outerList)
  const hbp = thuHieuBinhPhuong(finalOuterList) // ngoặc còn lại (sau khi rút hết GCD nếu có) dạng Ax²-C — hiệu hai bình phương
  const dungText = hbp ? `${extraMono}(${b1Text})(${hbp.f1})(${hbp.f2})` : `${extraMono}(${b1Text})(${hienThiDaThuc(finalOuterList)})`
  if (!rule) return { text: dungText }
  if (rule === 'R281') { // nhầm dấu khi ghép 2 nhóm (coi 2 cụm ngược dấu trong khi thực ra cùng dấu, hoặc ngược lại)
    const wrongSign = -ghep.m2Sign
    const outerRaw = [{ coef: R(ghep.g1.G), vars: ghep.g1.commonVars }, { coef: R(wrongSign * ghep.g2.G), vars: ghep.g2.commonVars }]
    const gop = new Map(); for (const t of outerRaw) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    const wrongOuter = [...gop.values()].filter((x) => x.coef.p !== 0n); if (wrongOuter.length !== 2) return null
    const t = `(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(wrongOuter))})`; if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu khi ghép 2 nhóm lại với nhau' }
  }
  if (rule === 'R282') { // quên rút/phân tích thêm ở ngoặc còn lại (dừng ở 2 nhân tử) — chỉ khi thật sự còn bước nữa
    if (!coRutThem && !hbp) return null
    const t = `(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(outerList))})`; if (t === dungText) return null
    return { text: t, ds: 'quên phân tích/rút thêm ở phần còn lại sau khi nhóm hạng tử' }
  }
  if (rule === 'R283') {
    if (hbp) { const t = `(${b1Text})(${hbp.f1})(${hbp.f1})`; if (t === dungText) return null; return { text: t, ds: 'hiểu nhầm hiệu hai bình phương thành bình phương, viết 2 nhân tử cùng dấu' } }
    const top = finalOuterList[0]; if (!top) return null
    const v = add(top.coef, R(1n))
    const terms = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc còn lại (dự phòng)' }
  }
  if (rule === 'R284') {
    if (hbp) { const t = `(${b1Text})(${hbp.f2})(${hbp.f2})`; if (t === dungText) return null; return { text: t, ds: 'hiểu nhầm hiệu hai bình phương thành bình phương, viết 2 nhân tử cùng dấu (chiều ngược lại)' } }
    const top = finalOuterList[0]; if (!top) return null
    const v = sub(top.coef, R(1n))
    const terms = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc còn lại, chiều ngược lại' }
  }
  return null
}

// ── DẠNG 40: Phân tích ĐTTNT — tam thức bậc hai $x^2+Bx+C$ (T108030103, khối 8) ───────────────────────────────
// CHỈ làm sub-shape "hệ số bậc 2 = 1" (38/166 câu — phần lớn còn lại của T108030103 cần nhóm hạng tử 2 biến
// hoặc đặt ẩn phụ, khác hẳn kỹ thuật này, để sau). $x^2+Bx+C=(x+p)(x+q)$ với $p+q=B$, $pq=C$ — tìm bằng cách
// duyệt ước của $C$ (kể cả âm) cho tới khi tổng khớp $B$.
function timNghiemTamThuc(B, C) { // → [p,q] (p+q=B, pq=C) hoặc null
  if (C === 0n) { if (B === 0n) return [0n, 0n]; return [0n, B] } // trường hợp biên C=0: x(x+B)
  const absC = C < 0n ? -C : C
  for (let d = 1n; d * d <= absC; d++) {
    if (C % d !== 0n) continue
    for (const dd of [d, -d]) { const ee = C / dd; if (dd + ee === B) return [dd, ee] }
  }
  return null
}
export function phanTichTamThucBac2(noiDung, rule) {
  const s = String(noiDung).replace(/\n/g, ' ')
  const m = s.match(/\$([^$]+)\$/)
  let raw = m ? m[1].trim() : s.replace(/^.*thành nhân tử:?\s*/i, '').trim() // sub-shape KHÔNG có $ — nhãn "A = ..." nằm trần ngoài LaTeX
  const mLabel = raw.match(/^[A-Za-zĐ]\s*=\s*(.+)$/); if (mLabel) raw = mLabel[1].trim() // nhãn "A =" có thể nằm TRONG hoặc NGOÀI $...$, không nhất quán giữa các câu
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(raw)); if (!terms || terms.length !== 3) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, coefB = null, coefC = null
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) coefA = t.coef; else if (d === 1) coefB = t.coef; else if (d === 0) coefC = t.coef; else return null }
  if (!coefA || coefA.p !== 1n || coefA.q !== 1n || !coefB || !coefC || coefB.q !== 1n || coefC.q !== 1n) return null
  const B = coefB.p, C = coefC.p
  const nghiem = timNghiemTamThuc(B, C); if (!nghiem) return null
  const [p, q] = nghiem
  const ghepText = (pp, qq) => `(${hienThiDaThuc([{ coef: R(1n), vars: new Map([[bien, 1]]) }, { coef: R(pp), vars: new Map() }])})(${hienThiDaThuc([{ coef: R(1n), vars: new Map([[bien, 1]]) }, { coef: R(qq), vars: new Map() }])})`
  const dungText = ghepText(p, q)
  if (!rule) return { text: dungText }
  if (rule === 'R285') { const t = ghepText(p, -q); if (t === dungText) return null; return { text: t, ds: 'nhầm dấu 1 nghiệm' } }
  if (rule === 'R286') { const t = ghepText(-p, -q); if (t === dungText) return null; return { text: t, ds: 'nhầm dấu cả 2 nghiệm' } }
  if (rule === 'R287') { const t = ghepText(p + 1n, q); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở 1 nghiệm (dự phòng)' } }
  if (rule === 'R288') { const t = ghepText(p - 1n, q); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở 1 nghiệm, chiều ngược lại' } }
  return null
}

// ── DẠNG 41: Phân tích ĐTTNT — tách hạng tử, TỔNG QUÁT (T108030104, khối 8) ──────────────────────────────────
// Mở rộng DẠNG 40 cho $Ax^2+Bx+C$ với $A\ne 1$ VÀ/HOẶC dạng ĐẲNG CẤP 2 biến $Ax^2+Bxy+Cy^2$ — kỹ thuật
// "tách hạng tử" ĐÚNG TÊN GỌI của dạng này: tìm $M,N$ với $M+N=B, MN=AC$ (AC-method), tách $Bx$ thành
// $Mx+Nx$ rồi NHÓM lại — TÁI DÙNG NGUYÊN `ghepNhomHangTu`/`trichGcdDonThuc` đã viết cho DẠNG 39 (nhóm hạng
// tử) vì sau khi tách, bài toán CHÍNH LÀ 1 bài "nhóm 4 hạng tử". CHỈ làm sub-shape "đúng 3 hạng, tối đa 2
// biến, không đa thức bậc cao hơn" — bỏ qua tự nhiên các câu bậc 4 (đặt ẩn phụ) hoặc nhiều hơn 2 biến.
function timMN(A, B, C) { // tìm M,N: M+N=B, M·N=A·C (AC-method)
  const AC = A * C
  if (AC === 0n) { if (B === 0n) return [0n, 0n]; return [0n, B] }
  const absAC = AC < 0n ? -AC : AC
  for (let d = 1n; d * d <= absAC; d++) {
    if (AC % d !== 0n) continue
    for (const dd of [d, -d]) { const ee = AC / dd; if (dd + ee === B) return [dd, ee] }
  }
  return null
}
export function tachHangTuTongQuat(noiDung, rule) {
  const s = String(noiDung).replace(/\n/g, ' ')
  const m = s.match(/\$([^$]+)\$/)
  let raw = m ? m[1].trim() : s.replace(/^.*thành nhân tử:?\s*/i, '').trim()
  const mLabel = raw.match(/^[A-Za-zĐ]\s*=\s*(.+)$/); if (mLabel) raw = mLabel[1].trim()
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(raw)); if (!terms || terms.length !== 3) return null
  const allVars = new Set(); for (const t of terms) for (const v of t.vars.keys()) allVars.add(v)
  if (allVars.size < 1 || allVars.size > 2) return null
  let bienChinh = null
  for (const t of terms) { const es = [...t.vars.entries()]; if (es.length === 1 && es[0][1] === 2) { bienChinh = es[0][0]; break } }
  if (!bienChinh) return null
  const bienPhu = [...allVars].find((v) => v !== bienChinh) ?? null
  let coefA = null, coefB = null, coefC = null
  for (const t of terms) {
    const dChinh = t.vars.get(bienChinh) ?? 0
    const dPhu = bienPhu ? (t.vars.get(bienPhu) ?? 0) : 0
    const laBienKhac = [...t.vars.keys()].some((v) => v !== bienChinh && v !== bienPhu)
    if (laBienKhac) return null
    if (dChinh === 2 && dPhu === 0) coefA = t.coef
    else if (dChinh === 1 && (dPhu === 0 || dPhu === 1)) coefB = t.coef
    else if (dChinh === 0 && (dPhu === 0 || dPhu === 2)) coefC = t.coef
    else return null
  }
  if (coefA === null || coefB === null || coefC === null || coefA.q !== 1n || coefB.q !== 1n || coefC.q !== 1n) return null
  if (coefA.p === 1n && !bienPhu) return null // A=1, 1 biến — đã có phanTichTamThucBac2 xử lý, tránh trùng
  const A = coefA.p, B = coefB.p, C = coefC.p
  const mn = timMN(A, B, C); if (!mn) return null
  const [M, N] = mn
  const mkVars = (dChinh, dPhu) => { const v = new Map(); if (dChinh) v.set(bienChinh, dChinh); if (dPhu) v.set(bienPhu, dPhu); return v }
  const item = (coef, dChinh, dPhu) => ({ sign: coef < 0n ? -1n : 1n, coefAbs: coef < 0n ? -coef : coef, vars: mkVars(dChinh, dPhu) })
  const dPhuGiua = bienPhu ? 1 : 0
  const items = [item(A, 2, 0), item(M, 1, dPhuGiua), item(N, 1, dPhuGiua), item(C, 0, bienPhu ? 2 : 0)]
  const ghep = ghepNhomHangTu(items); if (!ghep) return null
  const { b1Text, outerList } = ghep
  const outerItems = outerList.map((t) => ({ sign: t.coef.p < 0n ? -1n : 1n, coefAbs: t.coef.p < 0n ? -t.coef.p : t.coef.p, vars: t.vars }))
  const g3 = trichGcdDonThuc(outerItems)
  const coRutThem = g3 && (g3.G !== 1n || g3.commonVars.size > 0)
  const extraMono = coRutThem ? hienThiDonThuc(R(g3.G), g3.commonVars) : ''
  const finalOuterList = coRutThem ? sapXepChuanDaThuc(g3.remTerms) : sapXepChuanDaThuc(outerList)
  const dungText = `${extraMono}(${b1Text})(${hienThiDaThuc(finalOuterList)})`
  if (!rule) return { text: dungText }
  if (rule === 'R289') { // nhầm dấu khi ghép 2 nhóm lại với nhau
    const wrongSign = -ghep.m2Sign
    const outerRaw = [{ coef: R(ghep.g1.G), vars: ghep.g1.commonVars }, { coef: R(wrongSign * ghep.g2.G), vars: ghep.g2.commonVars }]
    const gop = new Map(); for (const t of outerRaw) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    const wrongOuter = [...gop.values()].filter((x) => x.coef.p !== 0n); if (wrongOuter.length !== 2) return null
    const t = `(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(wrongOuter))})`; if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu khi ghép 2 nhóm lại với nhau' }
  }
  if (rule === 'R290') { // quên rút thêm 1 lớp nhân tử chung sau khi nhóm — chỉ khi thật sự còn rút được thêm
    if (!coRutThem) return null
    const t = `(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(outerList))})`; if (t === dungText) return null
    return { text: t, ds: 'quên rút thêm 1 lớp nhân tử chung sau khi nhóm hạng tử' }
  }
  if (rule === 'R291') {
    const top = finalOuterList[0]; if (!top) return null
    const v = add(top.coef, R(1n))
    const terms2 = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms2))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc còn lại (dự phòng)' }
  }
  if (rule === 'R292') {
    const top = finalOuterList[0]; if (!top) return null
    const v = sub(top.coef, R(1n))
    const terms2 = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms2))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số hạng tử bậc cao nhất trong ngoặc còn lại, chiều ngược lại' }
  }
  return null
}
// T108030104 trộn 2 sub-shape loại trừ lẫn nhau (A=1,1 biến → phanTichTamThucBac2; A≠1 hoặc 2 biến →
// tachHangTuTongQuat) — dispatcher chung để cả 2 dùng CHUNG 1 dang_chinh trong TEXT_DANG.
export function tachHangTuKetHop(noiDung, rule) { return phanTichTamThucBac2(noiDung, rule) || tachHangTuTongQuat(noiDung, rule) }

// ── DẠNG 42: Phân tích ĐTTNT — nhẩm nghiệm (T108030105, khối 8) ─────────────────────────────────────────────
// Đa thức BẬC BA $Ax^3+Bx^2+Cx+D$ (1 biến): nhẩm 1 nghiệm nguyên $r$ (duyệt ước của $D$, kể cả âm) sao cho
// $Ar^3+Br^2+Cr+D=0$, chia tổng hợp (synthetic division) lấy thương $Ax^2+ex+f$ ($e=B+Ar$, $f=C+re$), rồi
// PHÂN TÍCH TIẾP tam thức bậc 2 còn lại bằng TÁI DÙNG NGUYÊN `timMN`+`ghepNhomHangTu` (DẠNG 39/41) — đáp số
// cuối là TÍCH 3 NHÂN TỬ $(x-r)(\ldots)(\ldots)$.
function timNghiemNguyen(A, B, C, D) { // duyệt ước nguyên (kể cả âm) của D tìm nghiệm r sao cho Ar³+Br²+Cr+D=0
  if (D === 0n) return 0n
  const absD = D < 0n ? -D : D
  for (let d = 1n; d <= absD; d++) {
    if (absD % d !== 0n) continue
    for (const r of [d, -d]) { if (A * r * r * r + B * r * r + C * r + D === 0n) return r }
  }
  return null
}
export function phanTichNhamNghiem(noiDung, rule) {
  const s = String(noiDung).replace(/\n/g, ' ')
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^[A-Za-zĐ]\s*=\s*(.+)$/); if (mLabel) raw = mLabel[1].trim()
  const terms = parseFactorAsPoly(chuanBiBieuThucNhan(raw)); if (!terms || terms.length !== 4) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let coefA = null, coefB = R(0n), coefC = R(0n), coefD = R(0n)
  for (const t of terms) {
    const d = t.vars.get(bien) ?? 0
    if (d === 3) coefA = t.coef; else if (d === 2) coefB = t.coef; else if (d === 1) coefC = t.coef; else if (d === 0) coefD = t.coef; else return null
  }
  if (!coefA || coefA.q !== 1n || coefB.q !== 1n || coefC.q !== 1n || coefD.q !== 1n) return null
  const A = coefA.p, B = coefB.p, C = coefC.p, D = coefD.p
  const r = timNghiemNguyen(A, B, C, D); if (r === null) return null
  const e = B + A * r, f = C + r * e
  const mn = timMN(A, e, f); if (!mn) return null
  const [M, N] = mn
  const item = (coef, dChinh) => ({ sign: coef < 0n ? -1n : 1n, coefAbs: coef < 0n ? -coef : coef, vars: dChinh ? new Map([[bien, dChinh]]) : new Map() })
  const items = [item(A, 2), item(M, 1), item(N, 1), item(f, 0)]
  const ghep = ghepNhomHangTu(items); if (!ghep) return null
  const { b1Text, outerList } = ghep
  const outerItems = outerList.map((t) => ({ sign: t.coef.p < 0n ? -1n : 1n, coefAbs: t.coef.p < 0n ? -t.coef.p : t.coef.p, vars: t.vars }))
  const g3 = trichGcdDonThuc(outerItems)
  const coRutThem = g3 && (g3.G !== 1n || g3.commonVars.size > 0)
  const extraMono = coRutThem ? hienThiDonThuc(R(g3.G), g3.commonVars) : ''
  const finalOuterList = coRutThem ? sapXepChuanDaThuc(g3.remTerms) : sapXepChuanDaThuc(outerList)
  const rFactorText = (rr) => hienThiDaThuc([{ coef: R(1n), vars: new Map([[bien, 1]]) }, { coef: R(-rr), vars: new Map() }])
  const dungText = `${extraMono}(${rFactorText(r)})(${b1Text})(${hienThiDaThuc(finalOuterList)})`
  if (!rule) return { text: dungText }
  if (rule === 'R293') { // nhầm dấu nghiệm nhẩm được đầu tiên
    const t = `${extraMono}(${rFactorText(-r)})(${b1Text})(${hienThiDaThuc(finalOuterList)})`; if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu nghiệm nhẩm được' }
  }
  if (rule === 'R294') { // nhầm dấu khi ghép nhóm ở bước phân tích tam thức bậc 2 còn lại
    const wrongSign = -ghep.m2Sign
    const outerRaw = [{ coef: R(ghep.g1.G), vars: ghep.g1.commonVars }, { coef: R(wrongSign * ghep.g2.G), vars: ghep.g2.commonVars }]
    const gop = new Map(); for (const t of outerRaw) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    const wrongOuter = [...gop.values()].filter((x) => x.coef.p !== 0n); if (wrongOuter.length !== 2) return null
    const t = `${extraMono}(${rFactorText(r)})(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(wrongOuter))})`; if (t === dungText) return null
    return { text: t, ds: 'nhầm dấu khi ghép nhóm ở bước phân tích tam thức bậc hai còn lại' }
  }
  if (rule === 'R295') {
    const top = finalOuterList[0]; if (!top) return null
    const v = add(top.coef, R(1n))
    const terms2 = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${rFactorText(r)})(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms2))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số trong nhân tử bậc hai còn lại (dự phòng)' }
  }
  if (rule === 'R296') {
    const top = finalOuterList[0]; if (!top) return null
    const v = sub(top.coef, R(1n))
    const terms2 = finalOuterList.map((x) => x === top ? { coef: v, vars: x.vars } : x)
    const t = `${extraMono}(${rFactorText(r)})(${b1Text})(${hienThiDaThuc(sapXepChuanDaThuc(terms2))})`; if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hệ số trong nhân tử bậc hai còn lại, chiều ngược lại' }
  }
  return null
}

// ── DẠNG 43: Tìm x — phương trình tích qua rút nhân tử chung (T108030602, khối 8) ─────────────────────────────
// Đề "$(x-2)^2-7(x-2)=0$" hoặc "$3x(2x-1)+6(2x-1)=0$" — vế trái là 2 hạng tử, mỗi hạng = [hệ số·biến-khác] ×
// [cụm hợp]^power (power 1 hoặc 2, CÙNG 1 cụm ở cả 2 hạng) — rút cụm hợp ở LUỸ THỪA NHỎ NHẤT, phần còn lại
// GIẢI phương trình bậc nhất (thế ngược cụm hợp nếu leftover power ≥1). Đáp số kho là 2 NGHIỆM, định dạng
// KHÔNG NHẤT QUÁN ("x = 2; x = 9" hoặc "-2; 1/2") — canon riêng `chuanHoaDanhSachNghiem` trích mọi giá trị
// số/phân số trong text, sắp xếp rồi nối lại (thứ tự nghiệm không quan trọng).
export function chuanHoaDanhSachNghiem(s) {
  let clean = String(s ?? '').replace(/\$/g, '').trim()
  // khuôn "{-2;2;3}" (tập nghiệm) cũng cần strip ngoặc nhọn NGOÀI CÙNG — CHỈ cặp bọc cả chuỗi, KHÔNG strip
  // mọi "{"/"}" trong chuỗi (bug thật: từng strip TOÀN BỘ, phá luôn \dfrac{p}{q} thành "\dfracpq" vô nghĩa
  // khi đáp số không có dấu "=" để đi nhánh eqMatches — vd "\dfrac{3}{2} ; -\dfrac{5}{2}").
  if (clean.startsWith('{') && clean.endsWith('}')) clean = clean.slice(1, -1).trim()
  const numRe = /-?\\dfrac\{-?\d+\}\{-?\d+\}|-?\d+\/\d+|-?\d+(?:[.,]\d+)?/g
  const eqMatches = [...clean.matchAll(new RegExp(`=\\s*(${numRe.source})`, 'g'))]
  const pieces = eqMatches.length ? eqMatches.map((m) => m[1]) : clean.split(/[;,]/).map((x) => x.trim()).filter(Boolean)
  const vals = []
  for (const p of pieces) { const c = parseDonThucCore(p.replace(',', '.').replace(/^(\d+)\/(\d+)$/, '\\dfrac{$1}{$2}')); if (c && c.vars.size === 0 && !c.hasIrrational) vals.push(c.coef) }
  if (!vals.length) return clean
  vals.sort(cmp)
  return vals.map(texR).join(' ; ')
}
export function evalDanhSachNghiemKetQua(s) { const t = chuanHoaDanhSachNghiem(s); return t || null }
function giaiBacNhat1Bien(terms) {
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size > 1) return null
  const bien = [...bienSet][0]
  let heSo = R(0n), hang = R(0n)
  for (const t of terms) { const d = bien ? (t.vars.get(bien) ?? 0) : 0; if (d > 1) return null; if (d === 1) heSo = add(heSo, t.coef); else hang = add(hang, t.coef) }
  if (heSo.p === 0n) return null
  return div(mul(R(-1n), hang), heSo)
}
export function timXPhuongTrinhTich2Hang(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (!segs.length) return null
  const eqSeg = segs.find((seg) => seg.includes('=')) ?? segs[0] // nhãn "Tìm $x$ biết" có $ RIÊNG cho "x" — phải tìm đúng đoạn chứa "="
  const eqParts = eqSeg.split('='); if (eqParts.length !== 2 || eqParts[1].trim() !== '0') return null
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(eqParts[0].trim())); if (topTerms.length !== 2) return null
  const info = []
  for (const t of topTerms) {
    const factors = tachNhanTu(t.text)
    let coef = R(1n); const vars = new Map(); let compoundText = null, power = 0
    for (const f of factors) {
      const mono = parseDonThucCore(f)
      if (mono && !mono.hasIrrational) { coef = mul(coef, mono.coef); for (const [v, e] of mono.vars) vars.set(v, (vars.get(v) ?? 0) + e); continue }
      if (compoundText === null) compoundText = f
      else if (compoundText !== f) return null // 2 cụm hợp KHÁC nhau trong 1 hạng — ngoài phạm vi
      power++
    }
    if (!compoundText || power < 1) return null
    info.push({ sign: t.sign === '-' ? -1n : 1n, coef, vars, compoundText, power })
  }
  const compoundTerms = phanTichDaThucCumNhanTu(info[0].compoundText); if (!compoundTerms) return null
  const compoundTerms2 = phanTichDaThucCumNhanTu(info[1].compoundText); if (!compoundTerms2) return null
  if (hienThiDaThuc(sapXepChuanDaThuc(compoundTerms)) !== hienThiDaThuc(sapXepChuanDaThuc(compoundTerms2))) return null
  const minPower = Math.min(info[0].power, info[1].power)
  const buildRemaining = (infoArr) => {
    let remTerms = []
    for (const it of infoArr) {
      const leftoverPower = it.power - minPower
      let pieceTerms = [{ coef: mul(it.coef, R(it.sign)), vars: it.vars }]
      for (let k = 0; k < leftoverPower; k++) pieceTerms = nhanCacDaThuc([pieceTerms, compoundTerms])
      remTerms.push(...pieceTerms)
    }
    const gop = new Map()
    for (const t of remTerms) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    return [...gop.values()].filter((x) => x.coef.p !== 0n)
  }
  const remaining = buildRemaining(info)
  const r1 = giaiBacNhat1Bien(compoundTerms), r2 = giaiBacNhat1Bien(remaining)
  if (!r1 || !r2) return null
  const dungText = `${texR(r1)} ; ${texR(r2)}`
  if (!rule) return { text: dungText }
  if (rule === 'R297') { const v = mul(R(-1n), r1); if (cmp(v, r1) === 0) return null; const t = `${texR(v)} ; ${texR(r2)}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'quên đổi dấu khi giải nghiệm từ cụm hợp (nghiệm thứ nhất)' } }
  if (rule === 'R298') { const v = mul(R(-1n), r2); if (cmp(v, r2) === 0) return null; const t = `${texR(r1)} ; ${texR(v)}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'quên đổi dấu khi giải nghiệm ở phần còn lại (nghiệm thứ hai)' } }
  if (rule === 'R299') { const v = add(r2, R(1n)); const t = `${texR(r1)} ; ${texR(v)}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm thứ hai (dự phòng)' } }
  if (rule === 'R300') { const v = sub(r2, R(1n)); const t = `${texR(r1)} ; ${texR(v)}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm thứ hai, chiều ngược lại' } }
  return null
}

// ── DẠNG 44: Giải phương trình bậc ba qua nhóm hạng tử (T108030603, khối 8, 6 câu nhỏ) ────────────────────────
// "$x^3-3x^2-4x+12=0$" — TÁI DÙNG NGUYÊN `nhomHangTu` (DẠNG 39, đã chain sẵn hiệu-hai-bình-phương) để phân
// tích vế trái thành tích 3 nhân tử tuyến tính, rồi GIẢI từng nhân tử=0 lấy nghiệm. Đáp số kho là TẬP HỢP
// "{r1;r2;r3}" — tái dùng canon `chuanHoaDanhSachNghiem` (đã strip {} sẵn).
export function giaiPtBacBaQuaNhom(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const eqParts = m[1].split('='); if (eqParts.length !== 2 || eqParts[1].trim() !== '0') return null
  const res = nhomHangTu(`$${eqParts[0].trim()}$ thành nhân tử.`, null); if (!res) return null
  const factorTexts = tachNhanTu(chuanBiBieuThucNhan(res.text))
  const roots = []
  for (const f of factorTexts) {
    const terms = phanTichDaThucCumNhanTu(f); if (!terms) return null
    const rr = giaiBacNhat1Bien(terms); if (!rr) return null
    roots.push(rr)
  }
  if (roots.length < 2) return null
  roots.sort(cmp)
  const dungText = `{${roots.map(texR).join(';')}}`
  if (!rule) return { text: dungText }
  if (rule === 'R301') {
    const wrong = roots.map((r, i) => i === 0 ? mul(R(-1n), r) : r); wrong.sort(cmp)
    const t = `{${wrong.map(texR).join(';')}}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'nhầm dấu 1 nghiệm' }
  }
  if (rule === 'R302') {
    if (roots.length < 3) return null
    const t = `{${roots.slice(0, 2).map(texR).join(';')}}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'quên xét 1 trường hợp, chỉ tìm được 2/3 nghiệm' }
  }
  if (rule === 'R303') {
    const wrong = roots.map((r, i) => i === roots.length - 1 ? add(r, R(1n)) : r); wrong.sort(cmp)
    const t = `{${wrong.map(texR).join(';')}}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở 1 nghiệm (dự phòng)' }
  }
  if (rule === 'R304') {
    const wrong = roots.map((r, i) => i === roots.length - 1 ? sub(r, R(1n)) : r); wrong.sort(cmp)
    const t = `{${wrong.map(texR).join(';')}}`; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở 1 nghiệm, chiều ngược lại' }
  }
  return null
}

// ── DẠNG 45: Giải bất phương trình bậc nhất một ẩn (T109020201, khối 9) ─────────────────────────────────────
// "$2x+4\ge 10$" → quy về $heSoX\cdot x + hangSo \;op\; 0$ — NẾU heSoX ÂM thì PHẢI ĐỔI CHIỀU bất đẳng thức khi
// chia. Đáp số kho là "x [op] value" với KÝ HIỆU op không nhất quán (`\ge`/`\geq`, `\le`/`\leq`, `<`,`>`) —
// canon riêng `chuanHoaBatDangThuc` chuẩn hoá cả toán tử lẫn giá trị.
const OP_MAP = { '\\geqslant': '≥', '\\geq': '≥', '\\ge': '≥', '\\leqslant': '≤', '\\leq': '≤', '\\le': '≤', '≥': '≥', '≤': '≤', '>': '>', '<': '<' }
const OP_FLIP = { '≥': '≤', '≤': '≥', '>': '<', '<': '>' }
export function chuanHoaBatDangThuc(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const m = clean.match(/(\\geqslant|\\geq|\\ge|\\leqslant|\\leq|\\le|≥|≤|>|<)\s*(-?\s*\\dfrac\{-?\d+\}\{-?\d+\}|-?\s*\d+\/\d+|-?\s*\d+(?:[.,]\d+)?)/)
  if (!m) return clean
  const op = OP_MAP[m[1]]; if (!op) return clean
  const c = parseDonThucCore(m[2].replace(',', '.').replace(/^(\d+)\/(\d+)$/, '\\dfrac{$1}{$2}')); if (!c || c.vars.size > 0) return clean
  return `x${op}${texR(c.coef)}`
}
export function evalBatDangThucKetQua(s) { const t = chuanHoaBatDangThuc(s); return t || null }
export function giaiBptBacNhat(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const expr = m[1].trim()
  const opM = expr.match(/(\\geqslant|\\geq|\\ge|\\leqslant|\\leq|\\le|>|<)/); if (!opM) return null
  const op = OP_MAP[opM[1]]; if (!op) return null
  const idx = expr.indexOf(opM[1])
  const lhsRaw = expr.slice(0, idx), rhsRaw = expr.slice(idx + opM[1].length)
  const parseVe = (raw, giuDau) => {
    const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw.trim())); if (!topTerms.length) return null
    const out = topTerms.map((t) => ({ sign: giuDau ? t.sign : (t.sign === '-' ? '+' : '-'), terms: parseHangTuBieuThuc(t.text) }))
    return out.some((h) => !h.terms) ? null : out
  }
  const veTrai = parseVe(lhsRaw, true), vePhai = parseVe(rhsRaw, false); if (!veTrai || !vePhai) return null
  const hangList = [...veTrai, ...vePhai]
  const bienSet = new Set(); for (const h of hangList) for (const t of h.terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  const gopTheoBac = new Map() // bậc → hệ số gộp — PHẢI gộp trước khi kiểm bậc (x² có thể triệt tiêu giữa 2 vế)
  for (const h of hangList) for (const t of h.terms) {
    const d = t.vars.get(bien) ?? 0
    const c = h.sign === '-' ? mul(R(-1n), t.coef) : t.coef
    gopTheoBac.set(d, add(gopTheoBac.get(d) ?? R(0n), c))
  }
  for (const [d, c] of gopTheoBac) if (d > 1 && c.p !== 0n) return null // bậc >1 còn sót sau khi gộp — vượt phạm vi bậc nhất
  const heSoX = gopTheoBac.get(1) ?? R(0n), hangSo = gopTheoBac.get(0) ?? R(0n)
  if (heSoX.p === 0n) return null
  const boundary = div(mul(R(-1n), hangSo), heSoX); if (!boundary) return null
  const opCuoi = heSoX.p < 0n ? OP_FLIP[op] : op
  const dungText = `x${opCuoi}${texR(boundary)}`
  if (!rule) return { text: dungText }
  if (rule === 'R305') { // quên đổi chiều khi hệ số x âm — chỉ áp dụng khi THẬT SỰ có đổi chiều
    if (heSoX.p >= 0n) return null
    const t = `x${op}${texR(boundary)}`; if (t === dungText) return null
    return { text: t, ds: 'quên đổi chiều bất đẳng thức khi chia/nhân cho số âm' }
  }
  if (rule === 'R306') { const v = add(boundary, R(1n)); const t = `x${opCuoi}${texR(v)}`; if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị biên (dự phòng)' } }
  if (rule === 'R307') { const v = sub(boundary, R(1n)); const t = `x${opCuoi}${texR(v)}`; if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị biên, chiều ngược lại' } }
  if (rule === 'R308') { const v = mul(R(-1n), boundary); const t = `x${opCuoi}${texR(v)}`; if (t === dungText || cmp(v, boundary) === 0) return null; return { text: t, ds: 'tính sai dấu giá trị biên' } }
  if (rule === 'R309') { // rescue — quên chia hệ số x, coi hệ số luôn là 1 (cứu ca R307/R308 trùng nhau khi biên = 0.5)
    const v = mul(R(-1n), hangSo); const t = `x${opCuoi}${texR(v)}`; if (t === dungText || cmp(v, boundary) === 0) return null
    return { text: t, ds: 'quên chia hệ số của x, coi hệ số x luôn bằng 1' }
  }
  return null
}

// ── DẠNG 46: Giải phương trình tích của 2 nhị thức bậc nhất (T109020401, khối 9) ────────────────────────────
// "$(2x-4)\cdot(3x+9)=0$" — 2 NHÂN TỬ ĐỘC LẬP (khác DẠNG 43: không chung 1 cụm hợp), mỗi nhân tử là 1 nhị thức
// bậc nhất riêng → GIẢI TỪNG nhân tử=0. Đáp số kho là 2 NGHIỆM, đôi khi câu kết "= 0." có dấu CHẤM trong $...$
// (phần cuối câu, không phải thập phân) — phải bỏ trước khi so với "0".
export function timXTichHaiNhiThuc(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const eqParts = m[1].split('='); if (eqParts.length !== 2) return null
  const rhs = eqParts[1].trim().replace(/\.$/, '').trim(); if (rhs !== '0') return null
  const factors = tachNhanTu(chuanBiBieuThucNhan(eqParts[0].trim())); if (factors.length !== 2) return null
  const roots = []
  for (const f of factors) {
    const terms = phanTichDaThucCumNhanTu(f); if (!terms) return null
    const r = giaiBacNhat1Bien(terms); if (!r) return null
    roots.push(r)
  }
  const dungText = `${texR(roots[0])} ; ${texR(roots[1])}`
  if (!rule) return { text: dungText }
  if (rule === 'R310') {
    const t = `${texR(mul(R(-1n), roots[0]))} ; ${texR(roots[1])}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'quên đổi dấu khi giải nghiệm thứ nhất' }
  }
  if (rule === 'R311') {
    const t = `${texR(roots[0])} ; ${texR(mul(R(-1n), roots[1]))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'quên đổi dấu khi giải nghiệm thứ hai' }
  }
  if (rule === 'R312') {
    const t = `${texR(roots[0])} ; ${texR(add(roots[1], R(1n)))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm thứ hai (dự phòng)' }
  }
  if (rule === 'R313') {
    const t = `${texR(roots[0])} ; ${texR(sub(roots[1], R(1n)))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm thứ hai, chiều ngược lại' }
  }
  return null
}

// ── DẠNG 47: Giải phương trình quy về phương trình bậc hai dạng tích (T109020402, khối 9) ────────────────────
// "$(x-3)(x+2)-x^2+9=0$", "$(x+2)(x-10)=-36$"… — KHÔNG có khuôn "tích 2 nhân tử = 0" sẵn (vế trái có thể là
// tổng/hiệu NHIỀU cụm, hoặc RHS ≠ 0) → chuyển vế + khai triển ĐẦY ĐỦ bằng `phanTichDaThucCumNhanTu` (đã hỗ
// trợ chiaHangTu + nhân đa thức lồng nhau qua tachNhanTu/nhanCacDaThuc, TÁI DÙNG NGUYÊN) → gộp về $Ax^2+Bx+
// C=0$ rồi tìm 1 nghiệm hữu tỉ bằng ĐỊNH LÝ NGHIỆM HỮU TỈ (nghiệm $p/q$ tối giản có $p\mid C$, $q\mid A$),
// suy nghiệm còn lại qua Viète ($x_1+x_2=-B/A$) — không cần tách/nhóm hạng tử tường minh. Cho phép nghiệm KÉP.
function uocSoNguyen(n) {
  if (n === 0n) return [0n]
  const a = n < 0n ? -n : n; const out = []
  for (let d = 1n; d * d <= a; d++) if (a % d === 0n) { out.push(d); out.push(a / d) }
  return [...new Set(out)]
}
function timNghiemHuuTiBacHai(A, B, C) { // Ax²+Bx+C=0 (A≠0 nguyên) — tìm 1 nghiệm hữu tỉ theo định lý nghiệm hữu tỉ
  const qs = uocSoNguyen(A).filter((q) => q !== 0n)
  const psAbs = uocSoNguyen(C)
  for (const q of qs) for (const pAbs of psAbs) for (const p of pAbs === 0n ? [0n] : [pAbs, -pAbs]) {
    if (A * p * p + B * p * q + C * q * q === 0n) return R(p, q)
  }
  return null
}
export function giaiPtQuyVeTich(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const eqParts = m[1].split('='); if (eqParts.length !== 2) return null
  const lhs = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(eqParts[0].trim())); if (!lhs) return null
  const rhsRaw = eqParts[1].trim().replace(/\.$/, '').trim()
  const rhs = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(rhsRaw)); if (!rhs) return null
  const allTerms = [...lhs, ...rhs.map((t) => ({ coef: mul(R(-1n), t.coef), vars: t.vars }))]
  const bienSet = new Set(); for (const t of allTerms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  const gopTheoBac = new Map()
  for (const t of allTerms) {
    const d = t.vars.get(bien) ?? 0
    if ([...t.vars.keys()].some((v) => v !== bien)) return null
    gopTheoBac.set(d, add(gopTheoBac.get(d) ?? R(0n), t.coef))
  }
  for (const [d, c] of gopTheoBac) if (d > 2 && c.p !== 0n) return null // bậc >2 còn sót sau khi gộp — vượt phạm vi dạng này
  const coefA = gopTheoBac.get(2) ?? R(0n), coefB = gopTheoBac.get(1) ?? R(0n), coefC = gopTheoBac.get(0) ?? R(0n)
  if (coefA.q !== 1n || coefB.q !== 1n || coefC.q !== 1n) return null // hệ số không nguyên sau gộp — ngoài phạm vi
  const A = coefA.p, B = coefB.p, C = coefC.p
  let roots
  if (A === 0n) { // sau khi khai triển thực chất chỉ còn bậc nhất (vd $(x-3)(x+2)-x^2+9=0$ ⇒ $-x+3=0$)
    if (B === 0n) return null // hằng đẳng thức/vô nghiệm sau khi gộp — ngoài phạm vi dạng này
    roots = [R(-C, B)]
  } else {
    const r1 = timNghiemHuuTiBacHai(A, B, C); if (!r1) return null
    const r2 = div(sub(R(-B), mul(R(A), r1)), R(A)); if (!r2) return null
    roots = cmp(r1, r2) === 0 ? [r1] : [r1, r2].sort(cmp) // nghiệm KÉP → kho ghi 1 giá trị duy nhất, không lặp lại
  }
  const dungText = roots.map(texR).join(' ; ')
  if (!rule) return { text: dungText }
  const flipAt = (i) => { const cp = [...roots]; cp[i] = mul(R(-1n), cp[i]); return cp.map(texR).join(' ; ') }
  const shiftAt = (i, d) => { const cp = [...roots]; cp[i] = add(cp[i], R(d)); return cp.map(texR).join(' ; ') }
  if (rule === 'R314') {
    const t = flipAt(0)
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'nhầm dấu nghiệm thứ nhất' }
  }
  if (rule === 'R315') {
    if (roots.length < 2) return null
    const t = flipAt(1)
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'nhầm dấu nghiệm thứ hai' }
  }
  if (rule === 'R316') {
    const t = shiftAt(roots.length - 1, 1n)
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm cuối (dự phòng)' }
  }
  if (rule === 'R317') {
    const t = shiftAt(roots.length - 1, -1n)
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm cuối, chiều ngược lại' }
  }
  return null
}

// ── DẠNG 48: GTLN-GTNN của biểu thức bậc hai một biến TRÊN 1 ĐOẠN (T109080102, khối 9) ───────────────────────
// "$A=x^2-4x+2$ với $0\le x\le 4$" — khác DẠNG 28 (không điều kiện): cực trị có thể rơi ở ĐỈNH PARABOL (nếu
// đỉnh nằm TRONG đoạn) HOẶC ở 1 trong 2 ĐẦU MÚT — so sánh f(a), f(b), f(đỉnh nếu áp dụng) rồi lấy max/min
// trên tập ứng viên đó (KHÔNG giả định trước đỉnh là max hay min — đúng cho cả A>0 và A<0). Đáp số kho "GTLN;
// GTNN" — thứ tự không quan trọng vì canon `chuanHoaDanhSachNghiem` tự sắp lại khi so sánh.
function parseSoBienDoan(s) { const c = parseDonThucCore(String(s).replace(',', '.').trim()); return (!c || c.vars.size > 0 || c.hasIrrational) ? null : c.coef }
export function gtlnGtnnBacHaiCoDieuKien(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  const boundSeg = segs.find((seg) => /\\le|\\leq|\\leqslant|≤/.test(seg) && /x/.test(seg)); if (!boundSeg) return null
  const exprSeg = segs.find((seg) => seg !== boundSeg); if (!exprSeg) return null
  const bm = boundSeg.match(/(-?[\d.,]+)\s*(?:\\le|\\leq|\\leqslant|≤)\s*x\s*(?:\\le|\\leq|\\leqslant|≤)\s*(-?[\d.,]+)/); if (!bm) return null
  const lo = parseSoBienDoan(bm[1]), hi = parseSoBienDoan(bm[2]); if (!lo || !hi) return null
  let raw = exprSeg.trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  const terms = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(raw)); if (!terms) return null
  const bienSet = new Set(); for (const t of terms) for (const v of t.vars.keys()) bienSet.add(v)
  if (bienSet.size !== 1) return null
  const bien = [...bienSet][0]
  let A = R(0n), B = R(0n), C = R(0n)
  for (const t of terms) { const d = t.vars.get(bien) ?? 0; if (d === 2) A = add(A, t.coef); else if (d === 1) B = add(B, t.coef); else if (d === 0) C = add(C, t.coef); else return null }
  if (A.p === 0n) return null
  const evalAt = (x) => add(add(mul(A, mul(x, x)), mul(B, x)), C)
  const x0 = div(mul(R(-1n), B), mul(R(2n), A)); if (!x0) return null
  const trongDoan = cmp(lo, x0) <= 0 && cmp(x0, hi) <= 0
  const fA = evalAt(lo), fB = evalAt(hi), fV = trongDoan ? evalAt(x0) : null
  const layMax = (arr) => arr.reduce((m, v) => cmp(v, m) > 0 ? v : m)
  const layMin = (arr) => arr.reduce((m, v) => cmp(v, m) < 0 ? v : m)
  const candidates = fV ? [fA, fB, fV] : [fA, fB]
  const maxV = layMax(candidates), minV = layMin(candidates)
  const dungText = `${texR(maxV)} ; ${texR(minV)}`
  if (!rule) return { text: dungText }
  if (rule === 'R318') { // quên xét đỉnh rơi trong đoạn, chỉ so 2 đầu mút
    const t = `${texR(layMax([fA, fB]))} ; ${texR(layMin([fA, fB]))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'quên xét điểm rơi vào đoạn (đỉnh parabol), chỉ so sánh 2 đầu mút' }
  }
  if (rule === 'R319') { // nhầm dấu phần bù khi tính giá trị tại đỉnh
    if (!trongDoan) return null
    const fVsai = add(C, mul(A, mul(x0, x0)))
    const t = `${texR(layMax([fA, fB, fVsai]))} ; ${texR(layMin([fA, fB, fVsai]))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'nhầm dấu phần bù khi tính giá trị tại đỉnh parabol' }
  }
  if (rule === 'R320') { // quên xét đầu mút phải của đoạn
    const cands2 = fV ? [fA, fV] : [fA]
    const t = `${texR(layMax(cands2))} ; ${texR(layMin(cands2))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'quên xét đầu mút phải của đoạn' }
  }
  if (rule === 'R321') { // dự phòng — lệch 1 đơn vị ở GTNN
    const t = `${texR(maxV)} ; ${texR(add(minV, R(1n)))}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở GTNN (dự phòng)' }
  }
  if (rule === 'R322') { // rescue — lệch 1 đơn vị ở GTLN (cứu ca đoạn đối xứng khiến R320/R321 trùng nhau/trùng đúng)
    const t = `${texR(sub(maxV, R(1n)))} ; ${texR(minV)}`
    if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở GTLN' }
  }
  return null
}

// ── DẠNG 49: Giải hệ phương trình bậc nhất hai ẩn cơ bản (T109010201, khối 9) ─────────────────────────────────
// "$\begin{cases} x+2y=4 \\ 2x+9y=18 \end{cases}$" — 2 phương trình $Ax+By=C$/$Dx+Ey=F$ — giải bằng ĐỊNH THỨC
// (Cramer): $x=(CE-BF)/\Delta$, $y=(AF-CD)/\Delta$, $\Delta=AE-BD$. Đáp số kho "(x;y)" — GIỮ THỨ TỰ (không
// sort như DẠNG khác), canon riêng `chuanHoaCapNghiem`.
export function chuanHoaCapNghiem(s) {
  let clean = String(s ?? '').replace(/\$/g, '').replace(/\.$/, '').trim()
  if (clean.startsWith('(') && clean.endsWith(')')) clean = clean.slice(1, -1).trim()
  const parts = clean.split(';').map((x) => x.trim()); if (parts.length !== 2) return clean
  const vals = parts.map((p) => { const c = parseDonThucCore(p.replace(',', '.').replace(/^(-?\d+)\/(-?\d+)$/, '\\dfrac{$1}{$2}')); return (c && c.vars.size === 0 && !c.hasIrrational) ? c.coef : null })
  if (vals.some((v) => !v)) return clean
  return `(${vals.map(texR).join(';')})`
}
export function evalCapNghiemKetQua(s) { const t = chuanHoaCapNghiem(s); return t || null }
export function giaiHePtBacNhatHaiAn(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/); if (!m) return null
  const eqTexts = m[1].split('\\\\').map((t) => t.trim()).filter(Boolean); if (eqTexts.length !== 2) return null
  const parseEq = (eq) => {
    const parts = eq.split('='); if (parts.length !== 2) return null
    const lhs = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(parts[0].trim())); if (!lhs) return null
    const rhsRaw = parts[1].replace(/[\\.\s]+$/, '').trim()
    const rhs = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(rhsRaw)); if (!rhs) return null
    const allTerms = [...lhs, ...rhs.map((t) => ({ coef: mul(R(-1n), t.coef), vars: t.vars }))]
    // GỘP theo key biến TRƯỚC khi kiểm bậc — vế trái có thể là tích 2 nhị thức (vd "(x+1)(y-1)=xy-1", T109010202)
    // sinh hạng chéo "xy", hạng này PHẢI triệt tiêu với "xy" bên vế phải sau khi gộp mới còn tuyến tính.
    const gop = new Map()
    for (const t of allTerms) { const key = phanBienKey(t.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, t.coef), vars: t.vars } : t) }
    const merged = [...gop.values()].filter((t) => t.coef.p !== 0n)
    let A = R(0n), B = R(0n), C0 = R(0n)
    for (const t of merged) {
      const vs = [...t.vars.keys()]
      if (vs.length === 0) { C0 = add(C0, t.coef); continue }
      if (vs.length !== 1) return null
      const v = vs[0], d = t.vars.get(v); if (d !== 1) return null
      if (v === 'x') A = add(A, t.coef); else if (v === 'y') B = add(B, t.coef); else return null
    }
    return { A, B, C: mul(R(-1n), C0) }
  }
  const eq1 = parseEq(eqTexts[0]), eq2 = parseEq(eqTexts[1]); if (!eq1 || !eq2) return null
  const { A, B, C } = eq1, { A: D, B: E, C: F } = eq2
  const det = sub(mul(A, E), mul(B, D)); if (!det || det.p === 0n) return null
  const x = div(sub(mul(C, E), mul(B, F)), det), y = div(sub(mul(A, F), mul(C, D)), det); if (!x || !y) return null
  const dungText = `(${texR(x)};${texR(y)})`
  if (!rule) return { text: dungText }
  if (rule === 'R323') { // hoán đổi nhầm giá trị x và y
    const t = `(${texR(y)};${texR(x)})`; if (chuanHoaCapNghiem(t) === chuanHoaCapNghiem(dungText)) return null
    return { text: t, ds: 'hoán đổi nhầm giá trị x và y' }
  }
  if (rule === 'R324') { // nhầm dấu định thức, dẫn tới nhầm dấu cả 2 nghiệm
    const t = `(${texR(mul(R(-1n), x))};${texR(mul(R(-1n), y))})`; if (chuanHoaCapNghiem(t) === chuanHoaCapNghiem(dungText)) return null
    return { text: t, ds: 'nhầm dấu định thức, dẫn tới nhầm dấu cả 2 nghiệm' }
  }
  if (rule === 'R325') { // dự phòng — lệch 1 đơn vị ở x
    const t = `(${texR(add(x, R(1n)))};${texR(y)})`; if (chuanHoaCapNghiem(t) === chuanHoaCapNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm x (dự phòng)' }
  }
  if (rule === 'R326') { // rescue — lệch 1 đơn vị ở y
    const t = `(${texR(x)};${texR(sub(y, R(1n)))})`; if (chuanHoaCapNghiem(t) === chuanHoaCapNghiem(dungText)) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm y' }
  }
  return null
}

// ── DẠNG 50: Số học SỐ VÔ TỈ (căn bậc hai) — biểu diễn $c_1\sqrt{k_1}+c_2\sqrt{k_2}+\dots$ (T109030101, khối 9)
// SurdVal = mảng {coef: Rat, k: BigInt} — k=1n là phần HỮU TỈ, k>1 (square-free) là hệ số của √k. KHÔNG dùng
// chung engine đa thức (biến x,y…) vì đây là số học SỐ, không phải biểu thức có biến — luật nhân/chia/rút gọn
// hoàn toàn khác (√a·√b=√(ab) rồi rút căn lại, không phải cộng số mũ).
function tachCanBac2(n) { // n≥0 (BigInt) → {out, inRad}: √n = out·√inRad, inRad square-free
  if (n === 0n) return { out: 0n, inRad: 1n }
  let inRad = n, out = 1n, d = 2n
  while (d * d <= inRad) { while (inRad % (d * d) === 0n) { inRad /= d * d; out *= d }; d += 1n }
  return { out, inRad }
}
function surdMergeAdd(list, coef, k) {
  if (coef.p === 0n) return list
  const idx = list.findIndex((t) => t.k === k)
  if (idx < 0) return [...list, { coef, k }]
  const nc = add(list[idx].coef, coef); const out = list.slice()
  if (nc.p === 0n) out.splice(idx, 1); else out[idx] = { coef: nc, k }
  return out
}
function surdAdd(a, b) { let r = a; for (const t of b) r = surdMergeAdd(r, t.coef, t.k); return r }
function surdNeg(a) { return a.map((t) => ({ coef: mul(R(-1n), t.coef), k: t.k })) }
function surdSub(a, b) { return surdAdd(a, surdNeg(b)) }
function surdFromInt(n) { if (n < 0n) return null; const { out, inRad } = tachCanBac2(n); return inRad === 1n ? (out === 0n ? [] : [{ coef: R(out), k: 1n }]) : [{ coef: R(out), k: inRad }] }
function surdMul(a, b) {
  let result = []
  for (const ta of a) for (const tb of b) {
    const { out, inRad } = tachCanBac2(ta.k * tb.k)
    result = surdMergeAdd(result, mul(mul(ta.coef, tb.coef), R(out)), inRad)
  }
  return result
}
function surdDivRat(a, r) { if (!r || r.p === 0n) return null; return a.map((t) => ({ coef: div(t.coef, r), k: t.k })) }
function surdSqrtOfRat(r) { // √r cho r=Rat không âm → SurdVal, vd √(1/2) = √2/2
  if (r.p < 0n) return null
  if (r.p === 0n) return []
  return surdDivRat(surdFromInt(r.p * r.q), R(r.q))
}
function isqrtRatPart(n) { return n < 0n ? null : isqrtBig(n) } // giữ tên riêng cho ngữ cảnh "phần tử của Rat", tránh nhầm với isqrtBig dùng cho DẠNG 25
function denestSqrt(a, b, c) { // "CĂN LỒNG": √(a+b√c) (a,b: Rat; c: BigInt square-free >1) → SurdVal nếu a²-b²c là bình phương hữu tỉ
  if (c === 1n) return null
  const absB = b.p < 0n ? mul(R(-1n), b) : b
  const D = sub(mul(a, a), mul(mul(absB, absB), R(c))); if (D.p < 0n) return null
  const sp = isqrtRatPart(D.p), sq_ = isqrtRatPart(D.q); if (sp === null || sq_ === null) return null
  const sqrtD = R(sp, sq_)
  const p = div(add(a, sqrtD), R(2n)), q = div(sub(a, sqrtD), R(2n)); if (!p || !q || p.p < 0n || q.p < 0n) return null
  const rp = surdSqrtOfRat(p), rq = surdSqrtOfRat(q); if (!rp || !rq) return null
  return b.p < 0n ? surdSub(rp, rq) : surdAdd(rp, rq)
}
function surdDiv(numer, denom) { // hữu tỉ hoá mẫu bằng LIÊN HỢP — TỔNG QUÁT cho mẫu 1 hoặc 2 hạng (kể cả 2 căn khác nhau, vd "√11-√2")
  if (!denom.length) return null
  if (denom.length === 1) {
    const { coef, k } = denom[0]
    if (k === 1n) return surdDivRat(numer, coef)
    return surdDivRat(surdMul(numer, [{ coef: R(1n), k }]), mul(coef, R(k)))
  }
  if (denom.length === 2) {
    const conj = [denom[0], { coef: mul(R(-1n), denom[1].coef), k: denom[1].k }] // (A+B)(A-B)=A²-B² luôn hữu tỉ
    const prod = surdMul(denom, conj); if (prod.length !== 1 || prod[0].k !== 1n) return null
    return surdDivRat(surdMul(numer, conj), prod[0].coef)
  }
  return null
}
function surdSignTerm(t) { return t.coef.p > 0n ? 1 : t.coef.p < 0n ? -1 : 0 }
function surdAbs(a) { // |c₁√k₁+c₂√k₂| — so² từng hạng để xác định dấu khi trái dấu, KHÔNG cần tính số thực
  if (a.length === 0) return a
  if (a.length === 1) return surdSignTerm(a[0]) < 0 ? surdNeg(a) : a
  if (a.length === 2) {
    const [t0, t1] = a, s0 = surdSignTerm(t0), s1 = surdSignTerm(t1)
    if (s0 === 0) return s1 < 0 ? surdNeg(a) : a
    if (s1 === 0) return s0 < 0 ? surdNeg(a) : a
    if (s0 === s1) return s0 < 0 ? surdNeg(a) : a
    const mag0 = mul(mul(t0.coef, t0.coef), R(t0.k)), mag1 = mul(mul(t1.coef, t1.coef), R(t1.k))
    const cmpv = cmp(mag0, mag1), dauTong = cmpv > 0 ? s0 : cmpv < 0 ? s1 : 0
    return dauTong < 0 ? surdNeg(a) : a
  }
  return null
}
function surdParseFull(text) { // đệ quy: nội dung lồng (trong ngoặc/{}) luôn gọi lại surdParseFull trên CHUỖI CON riêng, không dùng chung con trỏ vị trí
  const s = String(text)
  const skipWs = (i) => { while (i < s.length && /\s/.test(s[i])) i++; return i }
  const parseNumber = (i) => {
    i = skipWs(i)
    const m = s.slice(i).match(/^\d+(?:\{,\}\d+|[.,]\d+)?/); if (!m) return null
    const raw = m[0].replace('{,}', '.').replace(',', '.')
    const [ip, fp] = raw.split('.')
    const val = fp ? R(BigInt(ip + fp), 10n ** BigInt(fp.length)) : R(BigInt(ip))
    return [[{ coef: val, k: 1n }], i + m[0].length]
  }
  const parseBraceArg = (i) => { i = skipWs(i); if (s[i] !== '{') return null; let depth = 1, j = i + 1; while (j < s.length && depth > 0) { if (s[j] === '{') depth++; else if (s[j] === '}') depth--; j++ }; return [s.slice(i + 1, j - 1), j] }
  const parseMacroArg = (i) => { i = skipWs(i); if (s[i] === '{') return parseBraceArg(i); return i < s.length ? [s[i], i + 1] : null } // \dfrac13 = \dfrac{1}{3} (không ngoặc, 1 ký tự)
  const parseAtom = (i) => {
    i = skipWs(i)
    if (s.slice(i, i + 5) === '\\sqrt') {
      const b = parseMacroArg(i + 5); if (!b) return null // \sqrt4 = \sqrt{4} (không ngoặc, 1 ký tự) cũng như \sqrt{...}
      const [inner, j] = b, trimmed = inner.trim()
      if (/^\d+$/.test(trimmed)) { const v = surdFromInt(BigInt(trimmed)); return v ? [v, j] : null }
      const mSq = trimmed.match(/^\(([\s\S]+)\)\^2$/)
      if (mSq) { const innerVal = surdParseFull(mSq[1]); if (!innerVal) return null; const ab = surdAbs(innerVal); return ab ? [ab, j] : null }
      // nội dung không phải số nguyên trần/bình phương — thử rút gọn về 1 SỐ HỮU TỈ không âm (vd "\dfrac1{2}")
      const innerVal = surdParseFull(trimmed)
      if (innerVal && innerVal.length <= 1 && (innerVal.length === 0 || innerVal[0].k === 1n)) {
        const rr = innerVal.length === 0 ? R(0n) : innerVal[0].coef
        const sq = surdSqrtOfRat(rr); if (sq) return [sq, j]
      }
      // CĂN LỒNG "√(a+b√c)" — nội dung rút gọn về ĐÚNG 2 hạng, 1 hạng hữu tỉ (k=1) + 1 hạng căn (k=c)
      if (innerVal && innerVal.length === 2) {
        const rat = innerVal.find((t) => t.k === 1n), surdT = innerVal.find((t) => t.k !== 1n)
        if (rat && surdT) { const dn = denestSqrt(rat.coef, surdT.coef, surdT.k); if (dn) return [dn, j] }
      }
      return null
    }
    if (s.slice(i, i + 6) === '\\dfrac') {
      const a1 = parseMacroArg(i + 6); if (!a1) return null
      const a2 = parseMacroArg(a1[1]); if (!a2) return null
      const numV = surdParseFull(a1[0]), denV = surdParseFull(a2[0]); if (!numV || !denV) return null
      const r = surdDiv(numV, denV); return r ? [r, a2[1]] : null
    }
    if (s[i] === '(') {
      let depth = 1, j = i + 1; while (j < s.length && depth > 0) { if (s[j] === '(') depth++; else if (s[j] === ')') depth--; j++ }
      const v = surdParseFull(s.slice(i + 1, j - 1)); return v ? [v, j] : null
    }
    return parseNumber(i)
  }
  const parseUnary = (i) => {
    i = skipWs(i)
    if (s[i] === '-') { const r = parseUnary(i + 1); return r ? [surdNeg(r[0]), r[1]] : null }
    if (s[i] === '+') return parseUnary(i + 1)
    return parseAtom(i)
  }
  const looksLikeAtomStart = (i) => { i = skipWs(i); return /[0-9(]/.test(s[i] ?? '') || s.slice(i, i + 5) === '\\sqrt' || s.slice(i, i + 6) === '\\dfrac' }
  const parseMultiplicative = (i) => {
    const r0 = parseUnary(i); if (!r0) return null
    let [val, j] = r0
    while (true) {
      let k = skipWs(j)
      if (s.slice(k, k + 5) === '\\cdot') { k = skipWs(k + 5); const r2 = parseUnary(k); if (!r2) return null; val = surdMul(val, r2[0]); j = r2[1]; continue }
      if (s[k] === ':') { k = skipWs(k + 1); const r2 = parseUnary(k); if (!r2) return null; val = surdDiv(val, r2[0]); if (!val) return null; j = r2[1]; continue }
      if (looksLikeAtomStart(k)) { const r2 = parseUnary(k); if (!r2) return null; val = surdMul(val, r2[0]); j = r2[1]; continue }
      break
    }
    return [val, j]
  }
  const parseAdditive = (i) => {
    i = skipWs(i); let sign = 1n
    if (s[i] === '-') { sign = -1n; i++ } else if (s[i] === '+') { i++ }
    const r0 = parseMultiplicative(skipWs(i)); if (!r0) return null
    let [val, j] = r0; val = sign === -1n ? surdNeg(val) : val
    while (true) {
      const k = skipWs(j)
      if (s[k] === '+' || s[k] === '-') {
        const op = s[k]; const r2 = parseMultiplicative(skipWs(k + 1)); if (!r2) return null
        val = op === '+' ? surdAdd(val, r2[0]) : surdSub(val, r2[0]); j = r2[1]
      } else break
    }
    return [val, j]
  }
  const r = parseAdditive(0); if (!r) return null
  const [val, j] = r
  return skipWs(j) === s.length ? val : null // còn dư ký tự chưa parse hết → ngoài phạm vi, an toàn trả null
}
function surdToText(val) {
  if (val.length === 0) return '0'
  // sắp xếp CHUẨN: phần hữu tỉ (k=1) sau cùng, các hạng căn theo k tăng dần — để canon so sánh ổn định
  const sorted = [...val].sort((a, b) => (a.k === 1n ? 1 : b.k === 1n ? -1 : (a.k < b.k ? -1 : a.k > b.k ? 1 : 0)))
  const termText = ({ coef, k }, isFirst) => {
    if (k === 1n) return isFirst ? texR(coef) : (coef.p < 0n ? `-${texR(mul(R(-1n), coef))}` : `+${texR(coef)}`)
    const abs = coef.p < 0n ? mul(R(-1n), coef) : coef
    const coefPart = (abs.p === 1n && abs.q === 1n) ? '' : texR(abs)
    const body = `${coefPart}\\sqrt{${k}}`
    if (isFirst) return coef.p < 0n ? `-${body}` : body
    return coef.p < 0n ? `-${body}` : `+${body}`
  }
  return sorted.map((t, i) => termText(t, i === 0)).join('')
}
export function chuanHoaCanThucKetQua(s) {
  const clean = String(s ?? '').replace(/\$/g, '').replace(/\.$/, '').trim()
  const val = surdParseFull(clean); if (!val) return clean
  const t = surdToText(val); return t ?? clean
}
export function evalCanThucKetQuaVal(s) { return chuanHoaCanThucKetQua(s) || null }
// Rule CHUNG cho MỌI kết quả là SurdVal ≤2 hạng (dùng chung tinhGiaTriCanThuc + tinhGiaTriCanThucTheoX) — vì
// cách sai có thể xảy ra ở BẤT KỲ bước trung gian nào tuỳ sub-shape (rút gọn căn đồng dạng, hữu tỉ hoá mẫu,
// căn lồng…), không tách được 1 công thức sai DUY NHẤT áp cho mọi câu — dùng 4 phép nhiễu TỔNG QUÁT trên kết
// quả CUỐI (nhầm dấu toàn bộ/từng phần, lệch 1 đơn vị) thay vì mô phỏng lại từng bước sai cụ thể.
function surdNegTermAt(val, idx) { if (idx < 0 || idx >= val.length) return null; const cp = val.map((t) => ({ ...t })); cp[idx] = { coef: mul(R(-1n), cp[idx].coef), k: cp[idx].k }; return cp }
function surdBumpTermAt(val, idx, delta) { if (idx < 0 || idx >= val.length) return null; const cp = val.map((t) => ({ ...t })); const nc = add(cp[idx].coef, delta); if (nc.p === 0n) return null; cp[idx] = { coef: nc, k: cp[idx].k }; return cp }
function canThucRuleKetQua(val, dungText, rule) {
  if (!val.length) { // "0" — không có hạng nào để nhiễu, tổng hợp trực tiếp vài giá trị lân cận khác 0
    if (rule === 'R336') return { text: '1', ds: 'tính lệch 1 đơn vị ở hạng thứ nhất' }
    if (rule === 'R337') return { text: '-1', ds: 'tính lệch 1 đơn vị ở hạng thứ nhất, chiều ngược lại (dự phòng)' }
    if (rule === 'R338') return { text: '2', ds: 'tính lệch 2 đơn vị (cứu ca trùng công thức)' }
    return null
  }
  if (rule === 'R335') { const v = surdNeg(val); const t = surdToText(v); if (t === dungText) return null; return { text: t, ds: 'nhầm dấu toàn bộ kết quả' } }
  if (rule === 'R336') { const v = surdBumpTermAt(val, 0, R(1n)); if (!v) return null; const t = surdToText(v); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng thứ nhất' } }
  if (rule === 'R337') { const v = surdBumpTermAt(val, 0, R(-1n)); if (!v) return null; const t = surdToText(v); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hạng thứ nhất, chiều ngược lại (dự phòng)' } }
  if (rule === 'R338') {
    // hạng ≥2 → nhiễu hạng THỨ HAI (độc lập với R336/R337); chỉ 1 hạng → dùng delta=3 (tránh trùng R335 khi
    // hệ số duy nhất là ±1 — delta 1/2 lúc đó khiến R338 trùng hệt R335 hoặc bị guard-null như R336/R337)
    const idx = val.length >= 2 ? 1 : 0, delta = val.length >= 2 ? R(1n) : R(3n)
    const v = surdBumpTermAt(val, idx, delta); if (!v) return null
    const t = surdToText(v); if (t === dungText) return null
    return { text: t, ds: val.length >= 2 ? 'tính lệch 1 đơn vị ở hạng thứ hai' : 'tính lệch 3 đơn vị (cứu ca trùng công thức)' }
  }
  return null
}
// "$A=\dfrac{\sqrt{x}-1}{\sqrt{x}-2}$ tại $x=9$" (T109030202) — x LUÔN là số chính phương (đề chọn sẵn) nên
// thay literal "x" bằng giá trị rồi cho qua CÙNG engine surd ở trên — không cần biến riêng.
export function tinhGiaTriCanThucTheoX(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (segs.length < 2) return null
  const xSeg = segs.find((seg) => /x\s*=|\|\s*x/.test(seg)); if (!xSeg) return null
  const exprSeg = segs.find((seg) => seg !== xSeg); if (!exprSeg) return null
  let xVal = null
  const mDirect = xSeg.match(/x\s*=\s*(-?\d+)(?!.*\|)/) // "x=9" (KHÔNG phải nằm trong |x-K|=M)
  const mAbs = xSeg.match(/\|\s*x\s*-\s*(-?\d+)\s*\|\s*=\s*(-?\d+)/) // "|x-1|=8" → x=K+M hoặc x=K-M, chọn nghiệm ≥0 và CHÍNH PHƯƠNG
  if (mAbs) {
    const K = BigInt(mAbs[1]), M = BigInt(mAbs[2])
    const cands = [K + M, K - M].filter((v) => v >= 0n && isqrtBig(v) !== null)
    if (cands.length !== 1) return null
    xVal = String(cands[0])
  } else if (mDirect) xVal = mDirect[1]
  if (xVal === null) return null
  let raw = exprSeg.trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  const substituted = raw.replace(/\bx\b/g, xVal)
  const val = surdParseFull(substituted); if (!val) return null
  const dungText = surdToText(val)
  if (!rule) return { text: dungText }
  return canThucRuleKetQua(val, dungText, rule)
}
// "Tìm ĐKXĐ của $\sqrt{x-1}$" / "$\dfrac{2}{\sqrt{x-1}}$" / "$\dfrac{1}{\sqrt{x-1}-1}$" / "$\dfrac{\sqrt{x}}
// {\sqrt{x-1}}$" (T109030201) — 4 khuôn CỐ ĐỊNH (khảo sát xác nhận), so khớp trực tiếp bằng regex trên biểu
// thức đã trim — không cần parser tổng quát.
function parseIntSigned(s) { return BigInt(String(s).replace(/\s+/g, '')) }
function renderDkxd(cs) { return cs.map((c) => c.op === 'ge' ? `x\\ge${c.val}` : c.op === 'gt' ? `x>${c.val}` : `x\\ne${c.val}`).join(' và ') }
export function chuanHoaDkxdCanThuc(s) {
  const clean = String(s ?? '').replace(/\$/g, '').replace(/\.$/, '').trim()
  const parts = clean.split(/và/).map((p) => p.trim()).filter(Boolean)
  const cs = []
  for (const p of parts) {
    let mm
    if ((mm = p.match(/^x\s*(?:\\ge|\\geq|≥)\s*(-?\d+)$/))) cs.push({ op: 'ge', val: mm[1] })
    else if ((mm = p.match(/^x\s*(?:>|\\gt)\s*(-?\d+)$/))) cs.push({ op: 'gt', val: mm[1] })
    else if ((mm = p.match(/^x\s*(?:\\ne|\\neq|≠)\s*(-?\d+)$/))) cs.push({ op: 'ne', val: mm[1] })
    else return clean
  }
  cs.sort((a, b) => (a.op === b.op ? Number(a.val) - Number(b.val) : (a.op === 'ge' || a.op === 'gt' ? -1 : 1)))
  return renderDkxd(cs)
}
export function evalDkxdCanThucKetQua(s) { const t = chuanHoaDkxdCanThuc(s); return t || null }
export function timDkxdCanThuc(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const expr = m[1].trim()
  let mm = expr.match(/^\\sqrt\{x\s*([+-]\s*\d+)\s*\}$/)
  if (mm) return dkxdKetQua([{ op: 'ge', val: (-parseIntSigned(mm[1])).toString() }], rule)
  mm = expr.match(/^\\dfrac\{[^{}]+\}\{\\sqrt\{x\s*([+-]\s*\d+)\s*\}\}$/)
  if (mm) return dkxdKetQua([{ op: 'gt', val: (-parseIntSigned(mm[1])).toString() }], rule)
  mm = expr.match(/^\\dfrac\{[^{}]+\}\{\\sqrt\{x\s*([+-]\s*\d+)\s*\}\s*-\s*(\d+)\}$/)
  if (mm) { const K = -parseIntSigned(mm[1]), M = BigInt(mm[2]); return dkxdKetQua([{ op: 'ge', val: K.toString() }, { op: 'ne', val: (K + M * M).toString() }], rule) }
  mm = expr.match(/^\\dfrac\{\\sqrt\{x\}\}\{\\sqrt\{x\s*([+-]\s*\d+)\s*\}\}$/)
  if (mm) { const K = -parseIntSigned(mm[1]); if (K < 0n) return null; return dkxdKetQua([{ op: 'gt', val: K.toString() }], rule) }
  return null
}
function dkxdKetQua(cs, rule) {
  const dungText = renderDkxd(cs)
  if (!rule) return { text: dungText }
  if (rule === 'R327') { // đổi dấu ≥/> ngược lại ở điều kiện đầu (nhầm biên chặt/lỏng)
    const cs2 = cs.map((c, i) => i === 0 ? { ...c, op: c.op === 'ge' ? 'gt' : c.op === 'gt' ? 'ge' : c.op } : c)
    const t = renderDkxd(cs2); if (t === dungText) return null
    return { text: t, ds: 'nhầm biên chặt/lỏng (≥ với >) ở điều kiện đầu' }
  }
  if (rule === 'R328') { // quên điều kiện thứ 2 (x≠...) nếu có
    if (cs.length < 2) return null
    const t = renderDkxd([cs[0]]); if (t === dungText) return null
    return { text: t, ds: 'quên điều kiện thứ hai (mẫu số khác 0)' }
  }
  if (rule === 'R329') { // dự phòng — lệch 1 đơn vị ở điều kiện đầu
    const cs2 = cs.map((c, i) => i === 0 ? { ...c, val: (BigInt(c.val) + 1n).toString() } : c)
    const t = renderDkxd(cs2); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở điều kiện đầu (dự phòng)' }
  }
  if (rule === 'R330') { // rescue — lệch 1 đơn vị ở điều kiện thứ 2 (nếu có), hoặc chiều ngược lại ở điều kiện đầu
    if (cs.length >= 2) {
      const cs2 = cs.map((c, i) => i === 1 ? { ...c, val: (BigInt(c.val) + 1n).toString() } : c)
      const t = renderDkxd(cs2); if (t === dungText) return null
      return { text: t, ds: 'tính lệch 1 đơn vị ở điều kiện thứ hai' }
    }
    const cs2 = cs.map((c, i) => i === 0 ? { ...c, val: (BigInt(c.val) - 1n).toString() } : c)
    const t = renderDkxd(cs2); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở điều kiện đầu, chiều ngược lại' }
  }
  return null
}
// "$\sqrt{x-5}+\dfrac{1}{3}\sqrt{9x-45} = \dfrac{1}{5}\sqrt{25x-125}+6$" (T109030204) — mọi hạng căn đều
// CHUNG 1 nhân tử $(x-A)$ dưới dạng $c\cdot(x-A)$ với $c$ CHÍNH PHƯƠNG (nên $\sqrt{c(x-A)}=\sqrt c\cdot
// \sqrt{x-A}$ rút gọn về SỐ HỮU TỈ·$\sqrt{x-A}$) — đặt $t=\sqrt{x-A}$, phương trình trở thành BẬC NHẤT
// theo $t$, giải $t$ rồi suy $x=A+t^2$ (yêu cầu $t\ge0$).
function parsePrefixCoefCan(pre) {
  const t = pre.trim()
  if (t === '') return R(1n)
  if (/^-?\d+$/.test(t)) return R(BigInt(t))
  const m1 = t.match(/^\\dfrac\{(-?\d+)\}\{(-?\d+)\}$/); if (m1) return R(BigInt(m1[1]), BigInt(m1[2]))
  const m2 = t.match(/^\\dfrac(-?\d)(-?\d)$/); if (m2) return R(BigInt(m2[1]), BigInt(m2[2])) // \dfrac13 = \dfrac{1}{3}
  return null
}
function parseVeCanTuyenTinh(sideText) {
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(sideText.trim())); if (!topTerms.length) return null
  let coefT = R(0n), constPart = R(0n), A = null
  for (const t of topTerms) {
    const mm = t.text.match(/^(.*?)\\sqrt\{([^{}]+)\}$/)
    if (mm) {
      const coefOut = parsePrefixCoefCan(mm[1]); if (!coefOut) return null
      const linTerms = phanTichDaThucCumNhanTu(mm[2]); if (!linTerms) return null
      let cx = R(0n), d = R(0n)
      for (const lt of linTerms) {
        const vs = [...lt.vars.keys()]
        if (vs.length === 0) d = add(d, lt.coef)
        else if (vs.length === 1 && vs[0] === 'x' && lt.vars.get('x') === 1) cx = add(cx, lt.coef)
        else return null
      }
      if (cx.q !== 1n || cx.p <= 0n) return null // hệ số x dưới căn phải NGUYÊN DƯƠNG (thực tế mẫu luôn vậy)
      const { inRad, out } = tachCanBac2(cx.p); if (inRad !== 1n) return null // c phải là SỐ CHÍNH PHƯƠNG — nếu không, ngoài phạm vi
      const thisA = div(mul(R(-1n), d), cx); if (!thisA) return null
      if (A === null) A = thisA; else if (cmp(A, thisA) !== 0) return null
      const signedCoef = t.sign === '-' ? mul(R(-1n), coefOut) : coefOut
      coefT = add(coefT, mul(signedCoef, R(out)))
    } else {
      const c = parseDonThucCore(t.text); if (!c || c.vars.size > 0 || c.hasIrrational) return null
      constPart = add(constPart, t.sign === '-' ? mul(R(-1n), c.coef) : c.coef)
    }
  }
  return { coefT, constPart, A }
}
export function timXPtCanThucTuyenTinh(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (!segs.length) return null
  const eqSeg = segs.find((seg) => seg.includes('=')) ?? segs[0] // nhãn "x" riêng có $ RIÊNG trước phương trình
  const eqParts = eqSeg.split('='); if (eqParts.length !== 2) return null
  const veTrai = parseVeCanTuyenTinh(eqParts[0]); if (!veTrai) return null
  const vePhai = parseVeCanTuyenTinh(eqParts[1].replace(/\.$/, '')); if (!vePhai) return null
  if (veTrai.A === null && vePhai.A === null) return null
  if (veTrai.A !== null && vePhai.A !== null && cmp(veTrai.A, vePhai.A) !== 0) return null
  const A = veTrai.A ?? vePhai.A
  const coefDiff = sub(veTrai.coefT, vePhai.coefT); if (coefDiff.p === 0n) return null
  const t = div(sub(vePhai.constPart, veTrai.constPart), coefDiff); if (!t || t.p < 0n) return null
  const x = add(A, mul(t, t))
  const dungText = texR(x)
  if (!rule) return { value: x }
  if (rule === 'R331') { // quên bình phương — coi đáp số x = t (giá trị của căn), không phải x
    if (cmp(t, x) === 0) return null
    return { value: t, ds: 'quên bình phương t để ra x, lấy nhầm giá trị của căn làm đáp số' }
  }
  if (rule === 'R332') { // nhầm dấu hằng số A khi cộng lại — coi x = t² - A thay vì t² + A
    const v = sub(mul(t, t), A); if (cmp(v, x) === 0) return null
    return { value: v, ds: 'nhầm dấu A khi cộng lại, tính x = t²-A thay vì t²+A' }
  }
  if (rule === 'R333') { // dự phòng — lệch 1 đơn vị
    const v = add(x, R(1n)); if (cmp(v, x) === 0) return null
    return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' }
  }
  if (rule === 'R334') { // rescue — lệch 1 đơn vị chiều ngược lại (cứu ca R331/R332 trùng nhau)
    const v = sub(x, R(1n)); if (cmp(v, x) === 0 || cmp(v, sub(mul(t, t), A)) === 0) return null
    return { value: v, ds: 'tính lệch 1 đơn vị, chiều ngược lại' }
  }
  return null
}
export function tinhGiaTriCanThuc(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  raw = raw.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')').replace(/\.$/, '').trim()
  const val = surdParseFull(raw); if (!val) return null
  const dungText = surdToText(val); if (dungText == null) return null
  if (!rule) return { text: dungText }
  return canThucRuleKetQua(val, dungText, rule)
}

// ── DẠNG 51: Tìm x để $P$ (phân thức 1 tầng theo $\sqrt x$) thoả mãn đẳng thức (T109030301, khối 9) ───────────
// "$P=\dfrac{2x}{\sqrt x-3}$, tìm $x$ để $P=32$" — CHỈ 1 phân thức (khác cụm "phân thức nhiều mẫu" đã hoãn —
// không cần quy đồng nhiều mẫu, chỉ cần khử MỘT mẫu). Đặt $t=\sqrt x$ ($x=t^2$) — thay literal rồi TÁI DÙNG
// `phanTichDaThucCumNhanTu` (đã hỗ trợ khai triển tích) để đưa Tử/Mẫu về đa thức 1 biến $t$. Điều kiện có 4
// khuôn: "$P=k$"/"$P=$ biểu thức theo $\sqrt x$" (1 nhánh) · "$|P|=k$"/"$P^2=k$" (2 nhánh, $\pm k$) ·
// "$P^3-K=0$" (1 nhánh, quy về $P=\sqrt[3]K$) — mỗi nhánh quy về $\text{Num}(t)=\text{VP}(t)\cdot\text{Mẫu}(t)$,
// GIẢI bậc ≤2 theo $t$ bằng ĐỊNH LÝ NGHIỆM HỮU TỈ (tái dùng `timNghiemHuuTiBacHai`), lọc $t\ge0$ và mẫu≠0
// (tự loại nghiệm ngoại lai do khử mẫu sinh ra), rồi $x=t^2$.
function substXChoT(text) { return String(text).replace(/\\sqrt\{x\}/g, 't').replace(/(?<![a-zA-Z])x(?![a-zA-Z])/g, 't^2') }
function parseDaThucTheoT(text) {
  const terms = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(substXChoT(text))); if (!terms) return null
  for (const tm of terms) { const vs = [...tm.vars.keys()]; if (vs.length > 1 || (vs.length === 1 && vs[0] !== 't')) return null }
  return terms
}
function evalDaThucTheoTTai(poly, tVal) {
  let acc = R(0n)
  for (const tm of poly) { const d = tm.vars.get('t') ?? 0; let p = R(1n); for (let i = 0; i < d; i++) p = mul(p, tVal); acc = add(acc, mul(tm.coef, p)) }
  return acc
}
function giaiPhuongTrinhTheoT(eqTerms) { // đa thức bậc ≤2 theo t = 0 → mảng nghiệm hữu tỉ (0, 1 hoặc 2 phần tử), hoặc null nếu ngoài phạm vi
  const gop = new Map()
  for (const tm of eqTerms) { const d = tm.vars.get('t') ?? 0; gop.set(d, add(gop.get(d) ?? R(0n), tm.coef)) }
  for (const [d, c] of gop) if (d > 2 && c.p !== 0n) return null
  let A = gop.get(2) ?? R(0n), B = gop.get(1) ?? R(0n), C = gop.get(0) ?? R(0n)
  if (A.q !== 1n || B.q !== 1n || C.q !== 1n) { // hệ số PHÂN SỐ (vd vế phải là 5/2) — quy đồng khử mẫu trước, nghiệm không đổi
    const lcm = (a, b) => a * b / gcdBigDon(a, b)
    const L = lcm(lcm(A.q, B.q), C.q)
    A = R(A.p * (L / A.q)); B = R(B.p * (L / B.q)); C = R(C.p * (L / C.q))
  }
  if (A.p === 0n) { if (B.p === 0n) return []; return [R(-C.p, B.p)] }
  const r1 = timNghiemHuuTiBacHai(A.p, B.p, C.p); if (!r1) return [] // KHÔNG có nghiệm hữu tỉ — nhánh này hợp lệ nhưng KHÔNG đóng góp nghiệm (khác lỗi cấu trúc), KHÔNG bỏ cả câu
  const r2 = div(sub(R(-B.p), mul(R(A.p), r1)), R(A.p)); if (!r2) return []
  return cmp(r1, r2) === 0 ? [r1] : [r1, r2]
}
function parseDieuKienP(condText) {
  const t = condText.trim().replace(/^,\s*/, '')
  let m = t.match(/^\|P\|\s*=\s*(-?\d+(?:\/\d+)?)$/)
  if (m) return { kind: 'abs', val: parseFraction(m[1]) }
  m = t.match(/^P\^2\s*=\s*(-?\d+(?:\/\d+)?)$/) || t.match(/^P\^2\s*-\s*(-?\d+(?:\/\d+)?)\s*=\s*0$/)
  if (m) return { kind: 'sq', val: parseFraction(m[1]) }
  m = t.match(/^P\^3\s*-\s*(\d+)\s*=\s*0$/)
  if (m) { const K = BigInt(m[1]); const r = icbrtBig(K); return r !== null ? { kind: 'cube', target: R(r) } : null }
  m = t.match(/^(\d*)P\s*=\s*(.+)$/)
  if (m) return { kind: 'lin', coefP: m[1] ? BigInt(m[1]) : 1n, rhsRaw: m[2] }
  return null
}
function parseFraction(s) { const m = String(s).match(/^(-?\d+)\/(-?\d+)$/); return m ? R(BigInt(m[1]), BigInt(m[2])) : R(BigInt(s)) }
function extractDfracArgs(text) { // "P=\dfrac{NUM}{DEN}" — bóc NUM/DEN theo ĐỘ SÂU ngoặc nhọn (nội dung có thể chứa "{}" lồng, vd "\sqrt{x}")
  const m = text.match(/^P\s*=\s*\\dfrac\{/); if (!m) return null
  let i = m[0].length, depth = 1
  const start1 = i
  while (i < text.length && depth > 0) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; i++ }
  const numText = text.slice(start1, i - 1)
  if (text[i] !== '{') return null
  i++; depth = 1; const start2 = i
  while (i < text.length && depth > 0) { if (text[i] === '{') depth++; else if (text[i] === '}') depth--; i++ }
  const denText = text.slice(start2, i - 1)
  return i === text.length ? [numText, denText] : null
}
export function timXPhanThucCanBac2(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1]); if (!segs.length) return null
  const defSeg = segs.find((seg) => /^P\s*=\s*\\dfrac/.test(seg.trim())); if (!defSeg) return null
  const dm = extractDfracArgs(defSeg.trim()); if (!dm) return null
  const numPoly = parseDaThucTheoT(dm[0]), denPoly = parseDaThucTheoT(dm[1]); if (!numPoly || !denPoly) return null
  const condSeg = segs.find((seg) => seg !== defSeg && seg.includes('P')); if (!condSeg) return null
  const dk = parseDieuKienP(condSeg); if (!dk) return null
  let rhsBranches = [], coefP = 1n
  if (dk.kind === 'abs' || dk.kind === 'sq') {
    let valRat = dk.val
    if (dk.kind === 'sq') { if (valRat.q !== 1n || valRat.p < 0n) return null; const sq = isqrtBig(valRat.p); if (sq === null) return null; valRat = R(sq) }
    rhsBranches = [[{ coef: valRat, vars: new Map() }], [{ coef: mul(R(-1n), valRat), vars: new Map() }]]
  } else if (dk.kind === 'cube') {
    rhsBranches = [[{ coef: dk.target, vars: new Map() }]]
  } else if (dk.kind === 'lin') {
    coefP = dk.coefP
    const rhsPoly = parseDaThucTheoT(dk.rhsRaw); if (!rhsPoly) return null
    rhsBranches = [rhsPoly]
  } else return null
  const allRoots = []
  for (const rhsPoly of rhsBranches) {
    const rhsTimesDen = nhanCacDaThuc([rhsPoly, denPoly])
    const scaledNum = numPoly.map((tm) => ({ coef: mul(tm.coef, R(coefP)), vars: tm.vars }))
    const eqTerms = [...scaledNum, ...rhsTimesDen.map((tm) => ({ coef: mul(R(-1n), tm.coef), vars: tm.vars }))]
    const roots = giaiPhuongTrinhTheoT(eqTerms); if (roots === null) return null
    for (const tRoot of roots) {
      if (tRoot.p < 0n) continue
      const denVal = evalDaThucTheoTTai(denPoly, tRoot); if (denVal.p === 0n) continue
      allRoots.push(mul(tRoot, tRoot))
    }
  }
  const uniq = []; for (const x of allRoots) if (!uniq.some((u) => cmp(u, x) === 0)) uniq.push(x)
  if (!uniq.length) return null
  uniq.sort(cmp)
  const dungText = uniq.map(texR).join(';')
  if (!rule) return { text: dungText }
  const flipAt = (i) => { if (i >= uniq.length) return null; const cp = [...uniq]; cp[i] = mul(R(-1n), cp[i]); return cp.map(texR).join(';') }
  const shiftAt = (i, d) => { if (i >= uniq.length) return null; const cp = [...uniq]; cp[i] = add(cp[i], R(d)); return cp.map(texR).join(';') }
  if (rule === 'R339') { const t = flipAt(0); if (!t) return null; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'nhầm dấu nghiệm thứ nhất' } }
  if (rule === 'R340') { const t = uniq.length >= 2 ? flipAt(1) : shiftAt(0, 1n); if (!t) return null; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: uniq.length >= 2 ? 'nhầm dấu nghiệm thứ hai' : 'tính lệch 1 đơn vị' } }
  if (rule === 'R341') { const t = shiftAt(uniq.length - 1, 1n); if (!t) return null; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm cuối (dự phòng)' } }
  if (rule === 'R342') { const t = shiftAt(uniq.length - 1, -1n); if (!t) return null; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm cuối, chiều ngược lại' } }
  return null
}

// ── DẠNG 52: "Bài toán thực tế" — SINH NHIỄU TỪ ĐÁP SỐ, KHÔNG đọc-hiểu đề (T1090103xx/T1090203xx/T10909xxx…) ──
// Ý CEO (14/09): kho đã có đáp số ĐÚNG (đã duyệt) cho mỗi câu — máy KHÔNG cần hiểu đề bài (đọc-hiểu tình
// huống là việc KHÔNG đâu Rat/đa thức nào làm được), chỉ cần lấy đáp số ĐÃ CÓ rồi áp lỗi tính toán PHỔ BIẾN
// (hoán đổi 2 giá trị, lệch 1 đơn vị…) để sinh 3 phương án nhiễu — giống hệt cách R335-338 xử lý cụm căn thức
// khi không tách được 1 công thức sai riêng. Khảo sát xác nhận đáp số toàn cụm ~98% (459/469) là "1 số",
// "2 số cách nhau ; hoặc ,", hoặc "N hoặc M" — KHÁC MỌI dạng khác trong file này: hàm nhận ĐÁP SỐ (không phải
// noi_dung) làm đầu vào — mcq-auto.mjs phải gọi khác đi (dispatch riêng, xem ANSWER_DANG).
function parseSoThucTe(s) { const c = parseDonThucCore(String(s).trim().replace(',', '.')); return (c && c.vars.size === 0 && !c.hasIrrational) ? c.coef : null }
export function chuanHoaDapSoThucTe(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const hoacM = clean.match(/^(.+?)\s*hoặc\s*(.+)$/)
  if (hoacM) {
    const a = parseSoThucTe(hoacM[1]), b = parseSoThucTe(hoacM[2]); if (!a || !b) return clean
    const arr = [a, b].sort(cmp)
    return `${texR(arr[0])} hoặc ${texR(arr[1])}`
  }
  const parts = clean.split(/[;,]/).map((p) => p.trim()).filter(Boolean); if (parts.length < 1 || parts.length > 2) return clean
  const nums = parts.map(parseSoThucTe); if (nums.some((n) => !n)) return clean
  return nums.map(texR).join(';')
}
export function evalDapSoThucTeKetQua(s) { const t = chuanHoaDapSoThucTe(s); return t || null }
export function sinhNhieuDapSoThucTe(dapAn, rule) {
  const clean = String(dapAn ?? '').replace(/\$/g, '').trim()
  let vals, sep
  const hoacM = clean.match(/^(.+?)\s*hoặc\s*(.+)$/)
  if (hoacM) {
    const a = parseSoThucTe(hoacM[1]), b = parseSoThucTe(hoacM[2]); if (!a || !b) return null
    vals = [a, b]; sep = ' hoặc '
  } else {
    const parts = clean.split(/[;,]/).map((p) => p.trim()).filter(Boolean); if (parts.length < 1 || parts.length > 2) return null
    vals = parts.map(parseSoThucTe); if (vals.some((v) => !v)) return null
    sep = ';'
  }
  const render = (arr) => arr.map(texR).join(sep)
  const dungText = render(vals)
  if (!rule) return { text: dungText }
  if (rule === 'R343') {
    if (vals.length === 2) { const t = render([vals[1], vals[0]]); if (t === dungText) return null; return { text: t, ds: 'hoán đổi nhầm 2 giá trị' } }
    const t = render([mul(vals[0], R(2n))]); if (t === dungText) return null
    return { text: t, ds: 'tính gấp đôi giá trị đúng (quên chia đôi ở 1 bước)' }
  }
  if (rule === 'R344') { const cp = [...vals]; cp[0] = add(cp[0], R(1n)); const t = render(cp); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị thứ nhất' } }
  if (rule === 'R345') { const cp = [...vals]; cp[0] = sub(cp[0], R(1n)); const t = render(cp); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị thứ nhất, chiều ngược lại (dự phòng)' } }
  if (rule === 'R346') {
    const idx = vals.length >= 2 ? 1 : 0, delta = vals.length >= 2 ? R(1n) : R(-2n)
    const cp = [...vals]; cp[idx] = add(cp[idx], delta); const t = render(cp); if (t === dungText) return null
    return { text: t, ds: vals.length >= 2 ? 'tính lệch 1 đơn vị ở giá trị thứ hai' : 'tính lệch giá trị (cứu ca trùng công thức)' }
  }
  return null
}

// ── DẠNG 53: Phương trình QUY VỀ BẬC NHẤT/TÍCH — MẪU SỐ CHỨA BIẾN (T109020103/T109020403, khối 9) ─────────────
// "$\dfrac{4}{x+3}+\dfrac{x-1}{x-3}=\dfrac{x^2+x}{x^2-9}$" — engine LCD TỔNG QUÁT: mỗi mẫu số phân tích thành
// tích các NHỊ THỨC TUYẾN TÍNH monic (bậc 2 dùng `timNghiemHuuTiBacHai` có sẵn để tìm 2 nghiệm hữu tỉ, coi
// như 2 nhân tử — KHÔNG cần hiệu-hai-bình-phương chuyên biệt vì tổng quát hơn); LCD = tích các nhân tử PHÂN
// BIỆT xuất hiện trong TOÀN PHƯƠNG TRÌNH; mỗi hạng nhân với "phần THIẾU" của LCD so với mẫu riêng nó rồi cộng
// dồn — khử hết mẫu, giải phương trình bậc ≤2 còn lại, LỌC nghiệm trùng bất kỳ nhân tử nào (ĐKXĐ) — nếu MỌI
// nghiệm đều bị loại (ngoại lai) → "Vô nghiệm" (đáp số kho ĐÚNG format này, không phải bỏ qua/lỗi).
function parseXPolyTuVanBan(text) {
  const terms = phanTichDaThucCumNhanTu(chuanBiBieuThucNhan(text)); if (!terms) return null
  for (const t of terms) { const vs = [...t.vars.keys()]; if (vs.length > 1 || (vs.length === 1 && vs[0] !== 'x')) return null }
  return terms
}
function phanTichNhanTuTuyenTinh(polyTerms, bien = 'x') { // → {factors:[{root}], leadCoef} (factors=[] nếu bậc 0) hoặc null nếu KHÔNG phân tích được (bậc>2, hệ số không quy đồng được, hoặc bậc 2 vô nghiệm hữu tỉ)
  const gop = new Map()
  for (const t of polyTerms) { const d = t.vars.get(bien) ?? 0; gop.set(d, add(gop.get(d) ?? R(0n), t.coef)) }
  for (const [d] of gop) if (d > 2) return null
  const A = gop.get(2) ?? R(0n), B = gop.get(1) ?? R(0n), C = gop.get(0) ?? R(0n)
  if (A.p !== 0n) {
    if (A.q !== 1n || B.q !== 1n || C.q !== 1n) return null
    const r1 = timNghiemHuuTiBacHai(A.p, B.p, C.p); if (!r1) return null
    const r2 = div(sub(R(-B.p), mul(R(A.p), r1)), R(A.p)); if (!r2) return null
    return { factors: [{ root: r1 }, { root: r2 }], leadCoef: A }
  }
  if (B.p !== 0n) return { factors: [{ root: div(mul(R(-1n), C), B) }], leadCoef: B }
  if (C.p === 0n) return null
  return { factors: [], leadCoef: C }
}
function nhiThucTuNghiem(root, bien = 'x') { return [{ coef: R(1n), vars: new Map([[bien, 1]]) }, { coef: mul(R(-1n), root), vars: new Map() }] } // (bien - root)
function tichNhiThuc(roots, bien = 'x') { return roots.reduce((acc, r) => nhanCacDaThuc([acc, nhiThucTuNghiem(r, bien)]), [{ coef: R(1n), vars: new Map() }]) }
function parseVePhanThuc(sideText) {
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(sideText.trim())); if (!topTerms.length) return null
  const out = []
  for (const t of topTerms) {
    const df = extractDfracArgsPlain(t.text)
    const numText = df ? df[0] : t.text, denText = df ? df[1] : '1'
    const numPoly = parseXPolyTuVanBan(numText), denPoly = parseXPolyTuVanBan(denText); if (!numPoly || !denPoly) return null
    const denFac = phanTichNhanTuTuyenTinh(denPoly); if (!denFac) return null
    out.push({ sign: t.sign, numPoly, denFac })
  }
  return out
}
export function giaiPtPhanThucBacNhat(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\$([^$]+)\$/); if (!m) return null
  const eqParts = m[1].split('='); if (eqParts.length !== 2) return null
  const veTrai = parseVePhanThuc(eqParts[0]); if (!veTrai) return null
  const vePhai = parseVePhanThuc(eqParts[1].replace(/[\\.\s]+$/, '')); if (!vePhai) return null
  const allTerms = [...veTrai, ...vePhai.map((t) => ({ ...t, sign: t.sign === '-' ? '+' : '-' }))]
  const excludedRoots = []
  for (const t of allTerms) for (const f of t.denFac.factors) if (!excludedRoots.some((e) => cmp(e, f.root) === 0)) excludedRoots.push(f.root)
  let combined = []
  for (const t of allTerms) {
    const ownRoots = t.denFac.factors.map((f) => f.root)
    const missing = excludedRoots.filter((r) => !ownRoots.some((o) => cmp(o, r) === 0))
    let contrib = nhanCacDaThuc([t.numPoly, tichNhiThuc(missing)])
    contrib = contrib.map((x) => ({ coef: div(x.coef, t.denFac.leadCoef), vars: x.vars }))
    if (t.sign === '-') contrib = contrib.map((x) => ({ coef: mul(R(-1n), x.coef), vars: x.vars }))
    combined = [...combined, ...contrib]
  }
  const gopTheoBac = new Map()
  for (const t of combined) { const d = t.vars.get('x') ?? 0; gopTheoBac.set(d, add(gopTheoBac.get(d) ?? R(0n), t.coef)) }
  for (const [d, c] of gopTheoBac) if (d > 2 && c.p !== 0n) return null
  let A = gopTheoBac.get(2) ?? R(0n), B = gopTheoBac.get(1) ?? R(0n), C = gopTheoBac.get(0) ?? R(0n)
  if (A.q !== 1n || B.q !== 1n || C.q !== 1n) {
    const lcm = (a, b) => a * b / gcdBigDon(a, b); const L = lcm(lcm(A.q, B.q), C.q)
    A = R(A.p * (L / A.q)); B = R(B.p * (L / B.q)); C = R(C.p * (L / C.q))
  }
  let candidateRoots = null
  if (A.p === 0n) { if (B.p !== 0n) candidateRoots = [R(-C.p, B.p)]; else if (C.p !== 0n) candidateRoots = [] }
  else { const r1 = timNghiemHuuTiBacHai(A.p, B.p, C.p); if (r1) { const r2 = div(sub(R(-B.p), mul(R(A.p), r1)), R(A.p)); if (r2) candidateRoots = cmp(r1, r2) === 0 ? [r1] : [r1, r2] } }
  if (candidateRoots === null) return null
  const excludedHit = []
  const validRoots0 = candidateRoots.filter((r) => { const bad = excludedRoots.some((e) => cmp(e, r) === 0); if (bad) excludedHit.push(r); return !bad })
  if (validRoots0.length > 2) return null // ngoài phạm vi khảo sát (tối đa 2 nghiệm hợp lệ)
  if (validRoots0.length >= 1) {
    const validRoots = [...validRoots0].sort(cmp)
    const dungText = validRoots.map(texR).join(';')
    if (!rule) return { text: dungText }
    const flipAt = (i) => { if (i >= validRoots.length) return null; const cp = [...validRoots]; cp[i] = mul(R(-1n), cp[i]); return cp.map(texR).join(';') }
    const shiftAt = (i, d) => { if (i >= validRoots.length) return null; const cp = [...validRoots]; cp[i] = add(cp[i], R(d)); return cp.map(texR).join(';') }
    if (rule === 'R347') { const t = flipAt(0); if (!t) return null; if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'nhầm dấu nghiệm thứ nhất' } }
    if (rule === 'R348') {
      const t = validRoots.length >= 2 ? flipAt(1) : shiftAt(0, 1n); if (!t) return null
      if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
      return { text: t, ds: validRoots.length >= 2 ? 'nhầm dấu nghiệm thứ hai' : 'tính lệch 1 đơn vị' }
    }
    if (rule === 'R349') {
      // ≥2 nghiệm: lệch nghiệm CUỐI +1 (dự phòng). CHỈ 1 nghiệm: PHẢI đổi delta (không lặp lại +1 của R348 ở
      // cùng vị trí index 0, kẻo trùng hệt R348 khi validRoots.length===1) — dùng -1 thay vì +1.
      const t = validRoots.length >= 2 ? shiftAt(validRoots.length - 1, 1n) : shiftAt(0, -1n); if (!t) return null
      if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
      return { text: t, ds: 'tính lệch 1 đơn vị ở nghiệm cuối (dự phòng)' }
    }
    if (rule === 'R350') {
      if (excludedHit.length) { const t = texR(excludedHit[0]); if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null; return { text: t, ds: 'quên kiểm tra điều kiện xác định, báo nhầm nghiệm ngoại lai làm đáp số' } }
      const t = validRoots.length >= 2 ? shiftAt(validRoots.length - 1, -1n) : shiftAt(0, 2n); if (!t) return null
      if (chuanHoaDanhSachNghiem(t) === chuanHoaDanhSachNghiem(dungText)) return null
      return { text: t, ds: 'tính lệch giá trị ở nghiệm cuối, chiều ngược lại' }
    }
    return null
  }
  // validRoots.length === 0 → Vô nghiệm
  if (!rule) return { text: 'Vô nghiệm' }
  // ca "0 = hằng số ≠ 0" (mâu thuẫn thật, KHÔNG phải do loại nghiệm ngoại lai) → excludedHit RỖNG (candidateRoots
  // vốn đã rỗng, filter không chạy) — dùng thẳng excludedRoots (giá trị x bị cấm bởi ĐKXĐ) làm nguồn nhiễu tự nhiên
  const fallbackRoots = excludedHit.length ? excludedHit : excludedRoots
  if (rule === 'R347') { if (!fallbackRoots.length) return null; return { text: texR(fallbackRoots[0]), ds: 'quên kiểm tra điều kiện xác định, báo nhầm 1 giá trị bị cấm làm đáp số' } }
  if (rule === 'R348') { if (fallbackRoots.length < 2) return null; return { text: texR(fallbackRoots[1]), ds: 'quên kiểm tra điều kiện xác định, báo nhầm giá trị bị cấm còn lại' } }
  if (rule === 'R349') { if (!fallbackRoots.length) return null; return { text: texR(add(fallbackRoots[0], R(1n))), ds: 'quên kiểm tra ĐKXĐ và tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R350') { if (!fallbackRoots.length) return null; return { text: texR(sub(fallbackRoots[0], R(1n))), ds: 'quên kiểm tra ĐKXĐ và tính lệch 1 đơn vị, chiều ngược lại' } }
  return null
}
export function chuanHoaPtPhanThucKetQua(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  if (/^vô\s*nghiệm$/i.test(clean)) return 'Vô nghiệm'
  return chuanHoaDanhSachNghiem(clean)
}
export function evalPtPhanThucKetQua(s) { const t = chuanHoaPtPhanThucKetQua(s); return t || null }

// ── DẠNG 54: Rút gọn phân thức chứa CĂN (T109030203, khối 9) ────────────────────────────────────────────────
// "$B=\dfrac{\sqrt{x}}{\sqrt{x}-1}+\dfrac{2}{\sqrt{x}+1}-\dfrac{5\sqrt{x}-3}{x-1}$" — đặt $t=\sqrt x$, TÁI
// DÙNG NGUYÊN engine LCD của DẠNG 53 (`phanTichNhanTuTuyenTinh`/`tichNhiThuc`, giờ tổng quát hoá theo biến)
// để cộng dồn về 1 PHÂN THỨC DUY NHẤT Tử(t)/Mẫu(t), rồi PHÂN TÍCH LẠI Tử thành nhân tử tuyến tính để RÚT GỌN
// (huỷ nhân tử chung với Mẫu) — khác DẠNG 53 ở chỗ KHÔNG giải phương trình, chỉ rút gọn rồi hiển thị lại.
function renderTuMau(tuTerms, mauTerms) {
  const tuText = hienThiDaThuc(sapXepChuanDaThuc(tuTerms)).replace(/t/g, '\\sqrt{x}')
  if (!mauTerms || (mauTerms.length === 1 && mauTerms[0].vars.size === 0 && mauTerms[0].coef.p === 1n && mauTerms[0].coef.q === 1n)) return tuText
  const mauText = hienThiDaThuc(sapXepChuanDaThuc(mauTerms)).replace(/t/g, '\\sqrt{x}')
  return `\\dfrac{${tuText}}{${mauText}}`
}
function rutGonToBieuThucCan(exprText) {
  if (/\\left\(/.test(exprText)) return null // câu có thêm 1 tầng chia ngoài (hiếm, 1 câu) — ngoài phạm vi
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(substXChoT(exprText))); if (!topTerms.length) return null
  const parsed = []
  for (const t of topTerms) {
    const df = extractDfracArgsPlain(t.text)
    const numText = df ? df[0] : t.text, denText = df ? df[1] : '1'
    const numPoly = parseDaThucTheoT(numText), denPoly = parseDaThucTheoT(denText); if (!numPoly || !denPoly) return null
    const denFac = phanTichNhanTuTuyenTinh(denPoly, 't'); if (!denFac) return null
    parsed.push({ sign: t.sign, numPoly, denFac })
  }
  const allRoots = []
  for (const t of parsed) for (const f of t.denFac.factors) if (!allRoots.some((e) => cmp(e, f.root) === 0)) allRoots.push(f.root)
  let numTotal = []
  for (const t of parsed) {
    const own = t.denFac.factors.map((f) => f.root)
    const missing = allRoots.filter((r) => !own.some((o) => cmp(o, r) === 0))
    let contrib = nhanCacDaThuc([t.numPoly, tichNhiThuc(missing, 't')])
    contrib = contrib.map((x) => ({ coef: div(x.coef, t.denFac.leadCoef), vars: x.vars }))
    if (t.sign === '-') contrib = contrib.map((x) => ({ coef: mul(R(-1n), x.coef), vars: x.vars }))
    numTotal = [...numTotal, ...contrib]
  }
  const gop = new Map()
  for (const term of numTotal) { const key = phanBienKey(term.vars); const old = gop.get(key); gop.set(key, old ? { coef: add(old.coef, term.coef), vars: term.vars } : term) }
  const numTotalGop = [...gop.values()].filter((x) => x.coef.p !== 0n)
  const mauGoc = allRoots.length ? tichNhiThuc(allRoots, 't') : [{ coef: R(1n), vars: new Map() }]
  if (!numTotalGop.length) return { tuTerms: [{ coef: R(0n), vars: new Map() }], mauTerms: [{ coef: R(1n), vars: new Map() }], tuTermsGoc: numTotalGop, mauTermsGoc: mauGoc }
  const numFac = phanTichNhanTuTuyenTinh(numTotalGop, 't')
  if (!numFac) { if (allRoots.length) return null; return { tuTerms: numTotalGop, mauTerms: [{ coef: R(1n), vars: new Map() }], tuTermsGoc: numTotalGop, mauTermsGoc: mauGoc } }
  const numRootsLeft = [...numFac.factors.map((f) => f.root)], denRootsLeft = [...allRoots]
  for (let i = numRootsLeft.length - 1; i >= 0; i--) {
    const j = denRootsLeft.findIndex((r) => cmp(r, numRootsLeft[i]) === 0)
    if (j >= 0) { numRootsLeft.splice(i, 1); denRootsLeft.splice(j, 1) }
  }
  const tuTerms = tichNhiThuc(numRootsLeft, 't').map((x) => ({ coef: mul(x.coef, numFac.leadCoef), vars: x.vars }))
  const mauTerms = denRootsLeft.length ? tichNhiThuc(denRootsLeft, 't') : [{ coef: R(1n), vars: new Map() }]
  return { tuTerms, mauTerms, tuTermsGoc: numTotalGop, mauTermsGoc: mauGoc }
}
function bumpHangTuDoc(terms, delta) { // cộng delta vào hạng BẬC 0 (hằng số), thêm mới nếu chưa có hạng hằng
  const idx = terms.findIndex((t) => t.vars.size === 0)
  if (idx < 0) return [...terms, { coef: delta, vars: new Map() }]
  const nc = add(terms[idx].coef, delta); const out = terms.slice()
  if (nc.p === 0n) out.splice(idx, 1); else out[idx] = { coef: nc, vars: new Map() }
  return out
}
export function rutGonPhanThucCan(noiDung, rule) {
  const s = String(noiDung)
  const segs = [...s.matchAll(/\$([^$]+)\$/g)].map((mm) => mm[1])
  const exprSeg = segs.find((seg) => /^[A-Za-zĐ]\s*=/.test(seg.trim()) && /\\dfrac/.test(seg)); if (!exprSeg) return null
  const mLabel = exprSeg.trim().match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (!mLabel) return null
  const info = rutGonToBieuThucCan(mLabel[2].trim()); if (!info) return null
  const dungText = renderTuMau(info.tuTerms, info.mauTerms)
  if (!rule) return { text: dungText }
  if (rule === 'R351') {
    const t = renderTuMau(info.tuTerms.map((x) => ({ coef: mul(R(-1n), x.coef), vars: x.vars })), info.mauTerms)
    if (t === dungText) return null; return { text: t, ds: 'nhầm dấu ở tử số' }
  }
  if (rule === 'R352') { const t = renderTuMau(bumpHangTuDoc(info.tuTerms, R(1n)), info.mauTerms); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số trong tử' } }
  if (rule === 'R353') { const t = renderTuMau(bumpHangTuDoc(info.tuTerms, R(-1n)), info.mauTerms); if (t === dungText) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số trong tử, chiều ngược lại (dự phòng)' } }
  if (rule === 'R354') {
    const goc = renderTuMau(info.tuTermsGoc, info.mauTermsGoc)
    if (goc !== dungText) return { text: goc, ds: 'quên rút gọn hết, để nguyên tử/mẫu trước khi khử nhân tử chung' }
    const t = renderTuMau(info.tuTerms, bumpHangTuDoc(info.mauTerms, R(1n))); if (t === dungText) return null
    return { text: t, ds: 'tính lệch 1 đơn vị ở hằng số trong mẫu' }
  }
  return null
}
export function chuanHoaRutGonCanKetQua(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const info = rutGonToBieuThucCan(clean)
  return info ? renderTuMau(info.tuTerms, info.mauTerms) : clean
}
export function evalRutGonCanKetQuaVal(s) { const t = chuanHoaRutGonCanKetQua(s); return t || null }

// ── DẠNG 55: Hệ phương trình đối xứng dạng TỔNG-TÍCH (T109010401, khối 9) ──────────────────────────────────
// "$\begin{cases}(x+1)(y+1)=12\\x^2+y^2=13\end{cases}$" — đặt $S=x+y,P=xy$: $(x+A)(y+A)=P+AS+A^2=C$ và
// $x^2+y^2=S^2-2P=D$ → khử P: $S^2+2AS-(2(C-A^2)+D)=0$ (bậc 2 theo S, giải bằng `timNghiemHuuTiBacHai` có
// sẵn) → mỗi nghiệm S hợp lệ suy $P$ rồi giải TIẾP $t^2-St+P=0$ (Viète) ra x,y — hệ ĐỐI XỨNG nên (x,y) và
// (y,x) đều là nghiệm, đáp số kho liệt kê CẢ HAI hoán vị.
function parseFractionOrInt(s) { const m = String(s).trim().match(/^(-?\d+)\/(-?\d+)$/); return m ? R(BigInt(m[1]), BigInt(m[2])) : R(BigInt(s.trim())) }
export function chuanHoaHePtTongTich(s) {
  const clean = String(s ?? '').replace(/\$/g, '').trim()
  const matches = [...clean.matchAll(/\(\s*(-?\d+(?:\/\d+)?)\s*,\s*(-?\d+(?:\/\d+)?)\s*\)/g)]; if (!matches.length) return clean
  const pairs = matches.map((m) => [parseFractionOrInt(m[1]), parseFractionOrInt(m[2])])
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]))
  return pairs.map(([a, b]) => `(${texR(a)},${texR(b)})`).join(',')
}
export function evalHePtTongTichKetQua(s) { const t = chuanHoaHePtTongTich(s); return t || null }
export function giaiHePtTongTich(noiDung, rule) {
  const s = String(noiDung)
  const m = s.match(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/); if (!m) return null
  const eqTexts = m[1].split('\\\\').map((t) => t.trim()).filter(Boolean); if (eqTexts.length !== 2) return null
  const m1 = eqTexts[0].match(/^\(x\s*([+-]\s*\d+)\s*\)\s*\(y\s*([+-]\s*\d+)\s*\)\s*=\s*(-?\d+)$/)
  const m2 = eqTexts[1].match(/^x\^2\s*\+\s*y\^2\s*=\s*(-?\d+)$/)
  if (!m1 || !m2) return null
  const A1 = parseIntSigned(m1[1]), A2 = parseIntSigned(m1[2]); if (A1 !== A2) return null
  const A = A1, C = BigInt(m1[3]), D = BigInt(m2[1])
  const Bcoef = 2n * A, Ccoef = -(2n * (C - A * A) + D)
  const s1 = timNghiemHuuTiBacHai(1n, Bcoef, Ccoef); if (!s1) return null
  const s2 = sub(R(-Bcoef), s1); if (!s2) return null
  const svals = cmp(s1, s2) === 0 ? [s1] : [s1, s2]
  const pairs = []
  for (const Sv of svals) {
    if (Sv.q !== 1n) continue
    const Pv = sub(R(C - A * A), mul(R(A), Sv)); if (Pv.q !== 1n) continue
    const x1 = timNghiemHuuTiBacHai(1n, -Sv.p, Pv.p); if (!x1) continue
    const y1 = sub(Sv, x1); if (!y1) continue
    pairs.push([x1, y1]); if (cmp(x1, y1) !== 0) pairs.push([y1, x1])
  }
  if (!pairs.length) return null
  pairs.sort((a, b) => cmp(a[0], b[0]) || cmp(a[1], b[1]))
  const dungText = pairs.map(([a, b]) => `(${texR(a)},${texR(b)})`).join(',')
  if (!rule) return { text: dungText }
  if (rule === 'R355') { // chỉ báo 1 hoán vị, quên nghiệm hoán vị còn lại
    if (pairs.length < 2) return null
    const t = pairs.slice(0, pairs.length - 1).map(([a, b]) => `(${texR(a)},${texR(b)})`).join(',')
    if (chuanHoaHePtTongTich(t) === chuanHoaHePtTongTich(dungText)) return null
    return { text: t, ds: 'quên 1 hoán vị nghiệm (hệ đối xứng luôn có cặp (x;y) và (y;x))' }
  }
  if (rule === 'R356') { const cp = pairs.map(([a, b]) => [add(a, R(1n)), b]); const t = cp.map(([a, b]) => `(${texR(a)},${texR(b)})`).join(','); if (chuanHoaHePtTongTich(t) === chuanHoaHePtTongTich(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị x mọi cặp (dự phòng)' } }
  if (rule === 'R357') { const cp = pairs.map(([a, b]) => [a, add(b, R(1n))]); const t = cp.map(([a, b]) => `(${texR(a)},${texR(b)})`).join(','); if (chuanHoaHePtTongTich(t) === chuanHoaHePtTongTich(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị y mọi cặp' } }
  if (rule === 'R358') { const cp = pairs.map(([a, b]) => [sub(a, R(1n)), b]); const t = cp.map(([a, b]) => `(${texR(a)},${texR(b)})`).join(','); if (chuanHoaHePtTongTich(t) === chuanHoaHePtTongTich(dungText)) return null; return { text: t, ds: 'tính lệch 1 đơn vị ở giá trị x mọi cặp, chiều ngược lại' } }
  return null
}

// ── DẠNG 56: GTLN-GTNN ứng dụng Cauchy/AM-GM (T109080103-105/107, khối 9) ──────────────────────────────────
// Khảo sát xác nhận đề CHỈ dùng 4 KHUÔN CỐ ĐỊNH (không phải thuật toán "tách hạng tử tìm tỉ lệ" tổng quát):
//  · $Ax+\dfrac{B}{x}$ ($x>0$) → AM-GM 2 số: GTNN$=2\sqrt{AB}$ (T109080105, cả A=1)
//  · $x+\dfrac{k}{x}$ ($x\in\mathbb N^*$) → x NGUYÊN nên cực trị KHÔNG nhất thiết tại $\sqrt k$ — so f(⌊√k⌋)
//    và f(⌈√k⌉), lấy nhỏ hơn (T109080107)
//  · $x^2+\dfrac{C}{x}$ HOẶC $Ax+\dfrac{B}{x^2}$ ($x>0$) → AM-GM 3 số (tách đôi hạng còn lại để tích hằng số):
//    GTNN$=3\sqrt[3]{C^2/4}$ hoặc $3\sqrt[3]{(A/2)^2B}$ (T109080103)
//  · $x^2(A-x)$ HOẶC $x(A-x)^2$ ($0\le x\le A$) → AM-GM 3 số (tách đôi hạng LỚN): GTLN$=4A^3/27$ luôn, bất
//    kể tách theo chiều nào vì $\frac{x}{2}+\frac{x}{2}+(A-x)=A$ và $(A-x)/2+(A-x)/2+x=A$ đều hằng số A
//    (T109080104)
function isqrtFloorBig(n) { // n≥0 → ⌊√n⌋ (Newton, KHÔNG cần n là số chính phương, khác isqrtBig)
  if (n < 0n) return null
  if (n < 2n) return n
  let x = n, y = (x + 1n) / 2n
  while (y < x) { x = y; y = (x + n / x) / 2n }
  return x
}
function cubeRootOfRat(r) { // ∛r nếu r là LẬP PHƯƠNG HỮU TỈ đúng (giả định r≥0 trong ngữ cảnh Cauchy)
  if (r.p < 0n) return null
  const cp = icbrtBig(r.p), cq = icbrtBig(r.q); if (cp === null || cq === null) return null
  return R(cp, cq)
}
function sqrtOfRat(r) { // √r nếu r là BÌNH PHƯƠNG HỮU TỈ đúng, r≥0
  if (r.p < 0n) return null
  const sp = isqrtBig(r.p), sq = isqrtBig(r.q); if (sp === null || sq === null) return null
  return R(sp, sq)
}
function parseCauchyTerm(text) { // → {kind:'x2'|'x1'|'fracX'|'fracX2', coef} hoặc null
  const df = extractDfracArgsPlain(text.trim())
  if (df) {
    const numPoly = parseXPolyTuVanBan(df[0]); if (!numPoly || numPoly.length !== 1 || numPoly[0].vars.size !== 0) return null
    const denPoly = parseXPolyTuVanBan(df[1]); if (!denPoly || denPoly.length !== 1) return null
    const dterm = denPoly[0], deg = dterm.vars.get('x') ?? 0
    if (dterm.vars.size !== (deg ? 1 : 0)) return null
    if (deg === 1) return { kind: 'fracX', coef: div(numPoly[0].coef, dterm.coef) }
    if (deg === 2) return { kind: 'fracX2', coef: div(numPoly[0].coef, dterm.coef) }
    return null
  }
  const poly = parseXPolyTuVanBan(text.trim()); if (!poly || poly.length !== 1) return null
  const tm = poly[0], deg = tm.vars.get('x') ?? 0
  if (tm.vars.size !== (deg ? 1 : 0)) return null
  if (deg === 2) return { kind: 'x2', coef: tm.coef }
  if (deg === 1) return { kind: 'x1', coef: tm.coef }
  return null
}
function layBieuThucNhan(noiDung) {
  const m = String(noiDung).match(/\$([^$]+)\$/); if (!m) return null
  let raw = m[1].trim()
  const mLabel = raw.match(/^([A-Za-zĐ])\s*=\s*(.+)$/); if (mLabel) raw = mLabel[2].trim()
  return raw
}
// "$A=Ax+\dfrac{B}{x}$ ($x>0$)" — GTNN=2√(AB) (T109080105)
export function gtnnAmGm2So(noiDung, rule) {
  const raw = layBieuThucNhan(noiDung); if (!raw) return null
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (topTerms.length !== 2 || topTerms.some((t) => t.sign !== '+')) return null
  const parts = topTerms.map((t) => parseCauchyTerm(t.text)); if (parts.some((p) => !p)) return null
  const [t1, t2] = parts
  const x1 = t1.kind === 'x1' ? t1 : t2.kind === 'x1' ? t2 : null
  const fr = t1.kind === 'fracX' ? t1 : t2.kind === 'fracX' ? t2 : null
  if (!x1 || !fr) return null
  const A = x1.coef, B = fr.coef
  const sq = sqrtOfRat(mul(A, B)); if (!sq) return null
  const gtnn = mul(R(2n), sq)
  if (!rule) return { value: gtnn }
  if (rule === 'R359') { const v = sq; if (cmp(v, gtnn) === 0) return null; return { value: v, ds: 'quên nhân 2, lấy nhầm √(AB) làm GTNN' } }
  if (rule === 'R360') { const v = add(gtnn, R(1n)); return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R361') { const v = sub(gtnn, R(1n)); if (v.p < 0n || cmp(v, sq) === 0) return null; return { value: v, ds: 'tính lệch 1 đơn vị, chiều ngược lại' } }
  if (rule === 'R362') { const v = add(gtnn, R(2n)); if (cmp(v, sq) === 0) return null; return { value: v, ds: 'tính lệch 2 đơn vị (cứu ca trùng công thức khi AB=1)' } }
  return null
}
// "$A=x+\dfrac{k}{x}$ với $x\in\mathbb N^*$" — x NGUYÊN, so f(⌊√k⌋) và f(⌈√k⌉) (T109080107)
export function gtnnAmGm2SoNguyen(noiDung, rule) {
  const raw = layBieuThucNhan(noiDung); if (!raw) return null
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (topTerms.length !== 2 || topTerms.some((t) => t.sign !== '+')) return null
  const parts = topTerms.map((t) => parseCauchyTerm(t.text)); if (parts.some((p) => !p)) return null
  const [t1, t2] = parts
  const x1 = t1.kind === 'x1' ? t1 : t2.kind === 'x1' ? t2 : null
  const fr = t1.kind === 'fracX' ? t1 : t2.kind === 'fracX' ? t2 : null
  if (!x1 || !fr) return null
  if (x1.coef.p !== 1n || x1.coef.q !== 1n) return null // chỉ gặp "x" trần trong mẫu, hệ số ≠1 ngoài phạm vi khảo sát
  const k = fr.coef; if (k.q !== 1n || k.p <= 0n) return null
  const f = (xv) => add(R(xv), div(k, R(xv)))
  const x0 = isqrtFloorBig(k.p); if (x0 === null || x0 < 1n) return null
  const cands = [x0, x0 + 1n].filter((v) => v >= 1n).map(f)
  const gtnn = cands.reduce((mn, v) => cmp(v, mn) < 0 ? v : mn)
  if (!rule) return { value: gtnn }
  if (rule === 'R359') { const v = add(gtnn, R(1n)); return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R360') { const v = sub(gtnn, R(1n)); if (v.p < 0n) return null; return { value: v, ds: 'tính lệch 1 đơn vị, chiều ngược lại' } }
  if (rule === 'R361') {
    const v = f(x0 + 2n); if (cmp(v, gtnn) === 0) return null
    return { value: v, ds: 'thử nhầm giá trị x nguyên khác (lệch xa hơn ⌊√k⌋)' }
  }
  return null
}
// "$A=x^2+\dfrac{C}{x}$" HOẶC "$A=Ax+\dfrac{B}{x^2}$" ($x>0$) — AM-GM 3 số (T109080103)
export function gtnnAmGm3So(noiDung, rule) {
  const raw = layBieuThucNhan(noiDung); if (!raw) return null
  const topTerms = chiaHangTu(chuanBiBieuThucNhan(raw)); if (topTerms.length !== 2 || topTerms.some((t) => t.sign !== '+')) return null
  const parts = topTerms.map((t) => parseCauchyTerm(t.text)); if (parts.some((p) => !p)) return null
  const [t1, t2] = parts
  let inner, quenChiaDoi
  const x2 = t1.kind === 'x2' ? t1 : t2.kind === 'x2' ? t2 : null
  const frX = t1.kind === 'fracX' ? t1 : t2.kind === 'fracX' ? t2 : null
  if (x2 && frX) {
    if (x2.coef.p !== 1n || x2.coef.q !== 1n) return null
    const C = frX.coef
    inner = div(mul(C, C), R(4n)); quenChiaDoi = mul(C, C)
  } else {
    const x1 = t1.kind === 'x1' ? t1 : t2.kind === 'x1' ? t2 : null
    const frX2 = t1.kind === 'fracX2' ? t1 : t2.kind === 'fracX2' ? t2 : null
    if (!x1 || !frX2) return null
    const A = x1.coef, B = frX2.coef
    const half = div(A, R(2n))
    inner = mul(mul(half, half), B); quenChiaDoi = mul(mul(A, A), B)
  }
  const cb = cubeRootOfRat(inner); if (!cb) return null
  const gtnn = mul(R(3n), cb)
  if (!rule) return { value: gtnn }
  if (rule === 'R359') { const v = cb; if (cmp(v, gtnn) === 0) return null; return { value: v, ds: 'quên nhân 3, lấy nhầm căn bậc ba làm GTNN' } }
  if (rule === 'R360') {
    const cb2 = cubeRootOfRat(quenChiaDoi)
    const v = cb2 ? mul(R(3n), cb2) : mul(gtnn, R(2n)) // "quên chia đôi" đôi khi không ra lập phương đúng (GTNN nhỏ) — cứu bằng gấp đôi GTNN
    if (cmp(v, gtnn) === 0) return null
    return { value: v, ds: cb2 ? 'quên chia đôi hệ số khi tách hạng tử làm 2 phần bằng nhau' : 'tính gấp đôi GTNN đúng' }
  }
  if (rule === 'R361') { const v = add(gtnn, R(1n)); return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R362') {
    const v = gtnn.p >= gtnn.q ? sub(gtnn, R(1n)) : add(gtnn, R(2n)) // GTNN<1 thì lệch -1 sẽ âm (vô lý) — cứu bằng +2
    if (cmp(v, gtnn) === 0) return null
    return { value: v, ds: 'tính lệch giá trị, chiều ngược lại với R361' }
  }
  return null
}
// "$A=x^2(K-x)$" HOẶC "$A=x(K-x)^2$" ($0\le x\le K$) — AM-GM 3 số, GTLN=4K³/27 (T109080104)
export function gtlnAmGm3SoTich(noiDung, rule) {
  const raw = layBieuThucNhan(noiDung); if (!raw) return null
  let mm = raw.match(/^x\^2\s*\(\s*(-?\d+)\s*-\s*x\s*\)$/)
  let K = mm ? BigInt(mm[1]) : null
  if (K === null) { mm = raw.match(/^x\s*\(\s*(-?\d+)\s*-\s*x\s*\)\^2$/); K = mm ? BigInt(mm[1]) : null }
  if (K === null || K <= 0n) return null
  const gtln = div(mul(R(4n), R(K * K * K)), R(27n))
  if (!rule) return { value: gtln }
  if (rule === 'R359') { const v = div(R(K * K * K), R(27n)); if (cmp(v, gtln) === 0) return null; return { value: v, ds: 'quên nhân 4' } }
  if (rule === 'R360') { const v = mul(R(4n), R(K * K * K)); if (cmp(v, gtln) === 0) return null; return { value: v, ds: 'quên chia 27' } }
  if (rule === 'R361') { const v = add(gtln, R(1n)); return { value: v, ds: 'tính lệch 1 đơn vị (dự phòng)' } }
  if (rule === 'R362') { const v = sub(gtln, R(1n)); if (v.p < 0n) return null; return { value: v, ds: 'tính lệch 1 đơn vị, chiều ngược lại' } }
  return null
}
