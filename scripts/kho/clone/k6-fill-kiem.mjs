// ============================================================================
// k6-fill-kiem.mjs — BỘ KIỂM ĐỘC LẬP cho các dạng K6 fill thêm 21/11 (spec-giai-bai §C13).
// Mỗi bộ kiểm: (noi_dung, dap_an, loi_giai) → [] nếu đạt, hoặc danh sách lỗi.
// ĐỌC LẠI đề từ chữ rồi tính lại bằng BigInt / vét cạn — KHÔNG dùng dữ liệu của bộ sinh (k6-fill.mjs).
// Dùng ở: duyet-nhap-clone.mjs (3 dạng hao do loại) và k6-fill.mjs (6 dạng 0 gốc).
// ============================================================================
const bo = (s) => String(s ?? '').replace(/\$/g, '').replace(/\\,|\\ /g, ' ').replace(/\s+/g, ' ').trim()
const boHet = (s) => bo(s).replace(/\s+/g, '')
const gcd = (x, y) => (y ? gcd(y, x % y) : x), lcm = (x, y) => (x / gcd(x, y)) * y
const ucDuong = (n) => { const r = []; for (let i = 1; i <= n; i++) if (n % i === 0) r.push(i); return r }
const isqrt = (n) => { if (n < 2n) return n; let x = BigInt(Math.floor(Math.sqrt(Number(n)))) || 1n; while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x }
// Cho các số quá lớn với Number: Newton
const isqrtBig = (n) => { if (n < 2n) return n; let x = 1n << BigInt((n.toString(2).length >> 1) + 1); for (;;) { const y = (x + n / x) >> 1n; if (y >= x) return x; x = y } }
const laSCP = (n) => { const r = isqrtBig(n); return r * r === n }
const cuoi = (lg, re) => { const m = [...String(lg).replace(/\$/g, '').matchAll(new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'))]; return m.length ? m[m.length - 1] : null }
// Các cặp (a;b) trong "{(1;8);(4;5)}" → chuỗi chuẩn "1,8|4,5" (sắp xếp)
const cacCap = (s) => [...String(s).matchAll(/\((-?\d+)\s*;\s*(-?\d+)\)/g)].map((m) => `${m[1]},${m[2]}`).sort().join('|')

// ── Chuỗi luỹ thừa xen dấu: X=1-b^k+b^{2k}-…+b^n ────────────────────────────────────────────────
const kiemXenDau = (nd, da, lg) => {
  const t = bo(nd).replace(/\\dots|\\ldots|\.\.\./g, '…')
  const m = t.match(/^Tính [A-Z]\s*=\s*1\s*-\s*(\d+)(?:\^\{?(\d+)\}?)?\s*\+\s*\d+\^\{?(\d+)\}?\s*-\s*…\s*\+\s*\d+\^\{?(\d+)\}?\.?$/)
  if (!m) return ['không đọc được đề']
  const b = BigInt(m[1]), k = BigInt(m[2] ?? 1), k2 = BigInt(m[3]), n = BigInt(m[4])
  if (k2 !== 2n * k) return ['số mũ số hạng thứ ba không gấp đôi số hạng thứ hai']
  if (n % k !== 0n || (n / k) % 2n !== 0n) return ['số mũ cuối không khớp quy luật xen dấu (cuối phải là dấu +)']
  let S = 0n; for (let i = 0n, s = 1n; i <= n / k; i++, s = -s) S += s * b ** (k * i)
  const mm = bo(da).match(/^\\dfrac\{(\d+)\^\{?(\d+)\}?\+1\}\{(\d+)\}$/)
  if (!mm) return ['đáp án không đúng dạng \\dfrac{b^N+1}{D}']
  const [B2, N, D] = [BigInt(mm[1]), BigInt(mm[2]), BigInt(mm[3])]
  const loi = []
  if (B2 !== b) loi.push('cơ số ở đáp án khác cơ số ở đề')
  if (S * D !== b ** N + 1n) loi.push(`đáp án ${da} sai: S·D ≠ b^N+1`)
  if (D !== b ** k + 1n) loi.push('mẫu số không là b^k+1')
  const c = cuoi(lg, /=\s*\\dfrac\{(\d+)\^\{?(\d+)\}?\+1\}\{(\d+)\}\s*$/m)
  if (!c || BigInt(c[1]) !== b || BigInt(c[2]) !== N || BigInt(c[3]) !== D) loi.push('kết luận cuối lời giải khác đáp án')
  return loi
}

// ── Toán thực tế ước chung: chia hết A (vật 1) và B (vật 2), số người > k ────────────────────────
const kiemUocChungThucTe = (nd, da, lg) => {
  const t = bo(nd)
  const m = t.match(/chia hết (\d+) [^.]*? và (\d+) [^.]*?\./) , k = t.match(/(?:nhiều hơn|lớn hơn) (\d+)\.?$/)
  if (!m || !k) return ['không đọc được đề']
  const A = +m[1], B = +m[2], K = +k[1], uc = ucDuong(gcd(A, B)).filter((d) => d > K)
  if (uc.length !== 1) return [`đề không có đúng một ước chung > ${K} (có ${uc.length})`]
  const c = cuoi(lg, /(\d+) (?:học sinh|người|bạn|em)\.?\s*$/m)
  return [String(da).trim() !== String(uc[0]) && `đáp án ${da} ≠ ${uc[0]}`, (!c || +c[1] !== uc[0]) && `kết luận lời giải ${c?.[1]} ≠ ${uc[0]}`].filter(Boolean)
}

// ── Tìm x, y ∈ N: (ax+b)(cy+d)=N ───────────────────────────────────────────────────────────────
const dayThua = (s, v) => { // "2x+1" | "x-2" | "x" | "3y" … → { a, b } với biến v
  const m = s.match(new RegExp(`^(\\d*)${v}(?:([+-])(\\d+))?$`)); if (!m) return null
  return { a: m[1] === '' ? 1 : +m[1], b: m[2] ? (m[2] === '-' ? -1 : 1) * +m[3] : 0 }
}
const kiemTichXY = (nd, da, lg) => {
  const t = boHet(nd).replace(/\\ /g, '')
  let m = t.match(/\(([^()]*x[^()]*)\)\(([^()]*y[^()]*)\)=(\d+)/)
  let f1, f2, N
  if (m) { f1 = dayThua(m[1], 'x'); f2 = dayThua(m[2], 'y'); N = +m[3] }
  else if ((m = t.match(/x\(([^()]*y[^()]*)\)=(\d+)/))) { f1 = { a: 1, b: 0 }; f2 = dayThua(m[1], 'y'); N = +m[2] }
  else if ((m = t.match(/x[.]y=(\d+)/))) { f1 = { a: 1, b: 0 }; f2 = { a: 1, b: 0 }; N = +m[1] }
  else return ['không đọc được đề']
  if (!f1 || !f2) return ['không đọc được thừa số']
  const sol = []
  for (let x = 0; x <= N + 10; x++) for (let y = 0; y <= N + 10; y++) if ((f1.a * x + f1.b) * (f2.a * y + f2.b) === N) sol.push(`${x},${y}`)
  if (!sol.length) return ['đề vô nghiệm trong N']
  const c = cuoi(lg, /Vậy[^{]*\\in\s*\\\{(.*)\\\}\s*\.?\s*$/m)
  if (!c) return ['không đọc được tập nghiệm cuối lời giải']
  const lgCap = cacCap(c[1]), dung = sol.sort().join('|')
  return [lgCap !== dung && `tập nghiệm lời giải ${lgCap} ≠ ${dung}`].filter(Boolean)
}

// ── 03068: tìm a<b biết BCNN và tích ─────────────────────────────────────────────────────────────
const kiemBcnnTich = (nd, da, lg) => {
  const t = boHet(nd).replace(/\\text\{([^}]*)\}/g, '$1')
  const L = t.match(/BCNN\(a,b\)=(\d+)/), P = t.match(/a\.b=(\d+)/)
  if (!L || !P) return ['không đọc được đề']
  return kiemBcnnTichTinh(+L[1], +P[1], da, lg)
}
const kiemBcnnTichTinh = (L, P, da, lg) => {
  const sol = []
  for (let a = 1; a * a <= P; a++) if (P % a === 0) { const b = P / a; if (a < b && lcm(a, b) === L) sol.push(`${a},${b}`) }
  if (!sol.length) return ['đề vô nghiệm']
  const dung = sol.sort().join('|')
  return [cacCap(da) !== dung && `đáp án ${da} ≠ ${dung}`, cacCap(cuoi(lg, /\\in\s*\\\{(.*)\\\}/)?.[1] ?? '') !== dung && 'tập nghiệm cuối lời giải ≠ tính lại'].filter(Boolean)
}

// ── 01231: chứng minh (k-1)A+k^s (hoặc hệ số) là số chính phương ──────────────────────────────────
const kiemChungMinhSCP = (nd, da, lg) => {
  const t = bo(nd).replace(/\\dots|\\ldots|\.\.\./g, '…')
  const m = t.match(/^Cho ([A-Z]) ?= ?(.+?)\. Chứng minh (?:rằng )?(\d*)([A-Z]) ?\+ ?(\d+) là số chính phương\.?$/)
  if (!m) return ['không đọc được đề']
  const pw = (s) => { const q = s.trim().match(/^(\d+)(?:\^\{?(\d+)\}?)?$/); return q ? [BigInt(q[1]), BigInt(q[2] ?? 1)] : null }
  const ds = m[2].split('+').map((x) => x.trim())
  if (ds.length < 4 || ds[ds.length - 2] !== '…') return ['dãy không đúng dạng a+a²+…+a^n']
  const hs = ds.filter((x) => x !== '…').map(pw); if (hs.some((x) => !x)) return ['không đọc được số hạng']
  // hs[0], hs[1] xác định công bội r = hs[1]/hs[0]; số hạng cuối hs.at(-1)
  const a0 = hs[0][0] ** hs[0][1], a1 = hs[1][0] ** hs[1][1], aN = hs.at(-1)[0] ** hs.at(-1)[1]
  if (a1 % a0 !== 0n) return ['số hạng 2 không chia hết số hạng 1']
  const r = a1 / a0; if (r < 2n) return ['công bội < 2']
  let S = 0n, cur = a0; while (cur <= aN) { S += cur; if (cur === aN) break; cur *= r }
  if (cur !== aN) return ['số hạng cuối không thuộc dãy']
  const hso = BigInt(m[3] === '' ? 1 : m[3]), val = hso * S + BigInt(m[5])
  const loi = []
  if (!laSCP(val)) loi.push('biểu thức không là số chính phương (đề sai)')
  if (hso !== r - 1n) loi.push('hệ số không là (công bội − 1)')
  if (!/số chính phương/.test(lg) || !/Phần 2/.test(lg)) loi.push('lời giải thiếu kết luận số chính phương')
  return loi
}

// ── 01410: tìm x ∈ N: tích các luỹ thừa có số mũ x+c ─────────────────────────────────────────────
const kiemTichLuyThua = (nd, da, lg) => {
  const t = boHet(nd)
  const m = t.match(/Tìmsốtựnhiênx,biết:(.+)=(\d+)\.?$/); if (!m) return ['không đọc được đề']
  const fs = m[1].split('.').map((p) => p.match(/^(\d+)\^\{x(?:\+(\d+))?\}$|^(\d+)\^x$/)); if (fs.some((f) => !f) || fs.length < 2) return ['không đọc được thừa số']
  const R = BigInt(m[2]), ds = fs.map((f) => f[3] ? [BigInt(f[3]), 0n] : [BigInt(f[1]), BigInt(f[2] ?? 0)])
  const nghiem = []
  for (let x = 0n; x <= 40n; x++) { let v = 1n; for (const [b, c] of ds) v *= b ** (x + c); if (v === R) nghiem.push(x) }
  if (nghiem.length !== 1) return [`đề có ${nghiem.length} nghiệm`]
  const c = cuoi(lg, /x\s*=\s*(\d+)\.?\s*$/m)
  return [String(da).replace(/\$/g, '').replace(/x=/, '').trim() !== String(nghiem[0]) && `đáp án ${da} ≠ ${nghiem[0]}`, (!c || BigInt(c[1]) !== nghiem[0]) && 'kết luận lời giải ≠ nghiệm tính lại'].filter(Boolean)
}

// ── 01621: tìm x (y) dùng bình phương ≥ 0 ─────────────────────────────────────────────────────────
const kiemBinhPhuong = (nd, da, lg) => {
  const t = boHet(nd).replace(/\\leq|\\le|≤/g, '<=')
  // (x-3)^2 → hàm bình phương; hệ số đứng trước (vd 3(x-3)^2)
  const bt = (s, v) => { const m = s.match(new RegExp(`^(\\d*)\\(${v}([+-])(\\d+)\\)\\^2$`)); return m ? (val) => (m[1] === '' ? 1 : +m[1]) * (val + (m[2] === '-' ? -1 : 1) * +m[3]) ** 2 : null }
  const hang = (s) => Number(s)
  let ds = {}, m
  const T = '(\\d*\\(x[+-]\\d+\\)\\^2)', U = '(\\d*\\(y[+-]\\d+\\)\\^2)'
  if ((m = t.match(new RegExp(`^Tìmsốnguyênx,biết:${T}<=0\\.?$`)))) { const f = bt(m[1], 'x'); const ns = []; for (let x = -200; x <= 200; x++) if (f(x) <= 0) ns.push(x); ds = { x: ns } }
  else if ((m = t.match(new RegExp(`^Tìmcácsốnguyênx,ybiết:${T}\\+${U}(<=|=)0\\.?$`)))) {
    const f = bt(m[1], 'x'), g = bt(m[2], 'y'); const xs = [], ys = []
    for (let v = -200; v <= 200; v++) { if (f(v) === 0) xs.push(v); if (g(v) === 0) ys.push(v) }
    ds = { x: xs, y: ys }
  } else if ((m = t.match(/^Cho[A-Z]=(\d*\(x[+-]\d+\)\^2)([+-]\d+)\.Tìmsốnguyênxđể[A-Z]đạtgiátrịnhỏnhất\.?$/))) {
    const f = bt(m[1], 'x'), c = hang(m[2]); let min = Infinity, arg = []
    for (let x = -200; x <= 200; x++) { const v = f(x) + c; if (v < min) { min = v; arg = [x] } else if (v === min) arg.push(x) }
    ds = { x: arg }
  } else if ((m = t.match(/^Cho[A-Z]=(-?\d+)-(\d*\(x[+-]\d+\)\^2)\.Tìmsốnguyênxđể[A-Z]đạtgiátrịlớnnhất\.?$/))) {
    const f = bt(m[2], 'x'), c = hang(m[1]); let max = -Infinity, arg = []
    for (let x = -200; x <= 200; x++) { const v = c - f(x); if (v > max) { max = v; arg = [x] } else if (v === max) arg.push(x) }
    ds = { x: arg }
  } else return ['không đọc được đề']
  if (Object.values(ds).some((a) => a.length !== 1)) return ['đề không có nghiệm duy nhất']
  const loi = []
  const bd = (s) => String(s).replace(/\$/g, '').replace(/\\ /g, '').replace(/\s/g, '')
  const dapAn = bd(da)
  for (const [v, a] of Object.entries(ds)) { const mm = dapAn.match(new RegExp(`${v}=(-?\\d+)`)); if (!mm || +mm[1] !== a[0]) loi.push(`đáp án ${da}: ${v} phải bằng ${a[0]}`) }
  // kết luận ở đoạn cuối lời giải phải khớp
  const dc = String(lg).trim().split(/\n\s*\n/).pop()
  for (const [v, a] of Object.entries(ds)) { const mm = bd(dc).match(new RegExp(`${v}=(-?\\d+)`)); if (!mm || +mm[1] !== a[0]) loi.push(`kết luận lời giải: ${v} phải bằng ${a[0]}`) }
  return loi
}

// ── 01619: biết giá trị biểu thức chứa biến, tính giá trị biểu thức khác ───────────────────────────
// Kiểm bằng THẾ SỐ: lấy nhiều bộ số nguyên thoả điều kiện đã cho, tính biểu thức → phải luôn bằng đáp án.
const kiemBieuThucBiet = (nd, da, lg) => {
  const t = boHet(nd).replace(/−/g, '-')
  const m = t.match(/^Tínhgiátrịbiểuthức([A-Z]=[^,;]*?)(?:biết|khibiết|,biết)(.+?)\.?$/) ?? t.match(/^Cho([^.]*?)\.Tínhgiátrịbiểuthức([A-Z]=[^.]*)\.?$/)
  if (!m) return ['không đọc được đề']
  const mauThuc = t.includes('biết') && /^Tínhgiátrị/.test(t)
  const bt = mauThuc ? m[1].split('=')[1] : m[2].split('=')[1]
  const dk = (mauThuc ? m[2] : m[1]).replace(/^[a-z]?=/, '')
  const dks = dk.split(/(?:,|;|và)/).map((s) => s.trim()).filter(Boolean)
  const vars = [...new Set((bt + dks.join('')).match(/[a-z]/g) ?? [])]
  const ev = (s, env) => { // chỉ + - * ( ) số, biến, ngầm nhân
    let e = s.replace(/\\cdot|\./g, '*').replace(/(\d|\))(?=[a-z(])/g, '$1*').replace(/([a-z])(?=[a-z(\d])/g, '$1*').replace(/\)(?=\()/g, ')*')
    const keys = Object.keys(env); return Function(...keys, `return (${e})`)(...keys.map((k) => env[k]))
  }
  let tin = 0, tong = 0; const gt = new Set()
  for (let i = 0; i < 60000 && tin < 30; i++) {
    const env = Object.fromEntries(vars.map((v) => [v, Math.floor(Math.random() * 31) - 15]))
    tong++
    try { if (dks.every((d) => { const [l, r] = d.split('='); return ev(l, env) === ev(r, env) })) { tin++; gt.add(ev(bt, env)) } } catch { return ['không tính được biểu thức'] }
  }
  if (tin < 5) return ['không tìm đủ bộ số thoả điều kiện để thử']
  if (gt.size !== 1) return ['biểu thức không xác định duy nhất bởi điều kiện (đề sai)']
  const v = [...gt][0]
  return [String(da).replace(/\$/g, '').trim() !== String(v) && `đáp án ${da} ≠ ${v}`].filter(Boolean)
}

// ── 01224: so sánh số tự nhiên ─────────────────────────────────────────────────────────────────────
const num = (s) => BigInt(String(s).replace(/[\s.]/g, ''))
const kiemSoSanhTN = (nd, da, lg) => {
  const t = bo(nd).replace(/\\ldots|\\dots|\.\.\./g, '…').replace(/\\leq|\\le/g, '≤'), d = bo(da)
  let m
  if ((m = t.match(/^Điền dấu <, > hoặc = vào chỗ trống: (\d[\d ]*) … (\d[\d ]*)\.?$/))) { const a = num(m[1]), b = num(m[2]); const k = a < b ? '<' : a > b ? '>' : '='; return [d !== k && `đáp án ${da} ≠ ${k}`].filter(Boolean) }
  if ((m = t.match(/^Sắp xếp các số sau theo thứ tự (tăng|giảm) dần: (.+)\.$/))) {
    const xs = m[2].split(';').map((s) => num(s)); const s = [...xs].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)); if (m[1] === 'giảm') s.reverse()
    const dung = s.join(m[1] === 'tăng' ? '<' : '>'); return [d.replace(/\s/g, '') !== dung && `đáp án ${da} ≠ ${dung}`].filter(Boolean)
  }
  if ((m = t.match(/^Tìm số (lớn|nhỏ) nhất trong các số sau: (.+)\.$/))) {
    const xs = m[2].split(';').map((s) => num(s)); const v = xs.reduce((a, b) => ((m[1] === 'lớn') === (b > a) ? b : a)); return [d.replace(/\s/g, '') !== String(v) && `đáp án ${da} ≠ ${v}`].filter(Boolean)
  }
  if ((m = t.match(/^Tìm chữ số thích hợp ở dấu \* sao cho: (\d+)\s*<\s*\\overline\{(\d*)\*(\d*)\}\s*<\s*(\d+)\.?$/))) {
    const lo = BigInt(m[1]), hi = BigInt(m[4]), ok = []
    for (let c = 0; c <= 9; c++) { const v = BigInt(m[2] + c + m[3]); if (lo < v && v < hi) ok.push(c) }
    const got = [...d.matchAll(/\d/g)].map((x) => +x[0]).sort(); return [ok.join() !== got.join() && `đáp án ${da} ≠ {${ok.join(';')}}`].filter(Boolean)
  }
  if ((m = t.match(/^Tìm số tự nhiên liền (sau|trước) của (\d[\d ]*)\.?$/))) { const a = num(m[2]); const v = m[1] === 'sau' ? a + 1n : a - 1n; return [d.replace(/\s/g, '') !== String(v) && `đáp án ${da} ≠ ${v}`].filter(Boolean) }
  if ((m = t.match(/^Có bao nhiêu số tự nhiên x thỏa mãn (\d+) < x ≤ (\d+)\?$/)) || (m = t.match(/^Có bao nhiêu số tự nhiên x thỏa mãn (\d+) ≤ x < (\d+)\?$/))) {
    const a = BigInt(m[1]), b = BigInt(m[2]); return [String(b - a) !== d && `đáp án ${da} ≠ ${b - a}`].filter(Boolean)
  }
  return ['không đọc được đề']
}

export const KIEM_K6 = {
  NDB00367: kiemXenDau,
  NDB00403: kiemUocChungThucTe,
  NDB01229: kiemTichXY,
  NDB03068: kiemBcnnTich,
  NDB01231: kiemChungMinhSCP,
  NDB01410: kiemTichLuyThua,
  NDB01621: kiemBinhPhuong,
  NDB01619: kiemBieuThucBiet,
  NDB01224: kiemSoSanhTN,
}
