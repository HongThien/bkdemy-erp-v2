// ============================================================================
// k5T-pt-fill-B-mcq.mjs — PHƯƠNG ÁN NHIỄU MCQ cho lô k5T-pt-fill-B.json (142 câu, 5 dạng % bán hàng / thay đổi % của tích).
// Mỗi nhiễu = KẾT QUẢ THẬT của một đường sai có tên: tham số đọc lại từ CHỮ của đề (tiền, %, số đo, dấu tăng/giảm), tính bằng phân số,
// rồi viết cùng khuôn chữ với `dap_an` (thay số, và đổi từ hướng khi đường sai là "đảo chiều").
//   node scripts/kho/clone/k5T-pt-fill-B-mcq.mjs [--vao kho-rules/dai/clone/k5T-pt-fill-B.json] --ra kho-rules/dai/clone/k5T-pt-fill-B-mcq.json
// Kiểm: node scripts/kho/clone/k5T-pt-mcq-kiem.mjs kho-rules/dai/clone/k5T-pt-fill-B-mcq.json
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'

const gcd = (a, b) => (b ? gcd(b, a % b) : a)
class Q {
  constructor(n, d = 1) { if (d < 0) { n = -n; d = -d } const g = gcd(Math.abs(n), d) || 1; this.n = n / g; this.d = d / g }
  add(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new Q(this.n * o.n, this.d * o.d) }
  div(o) { return new Q(this.n * o.d, this.d * o.n) }
  cmp(o) { return this.n * o.d - o.n * this.d }
  get abs() { return new Q(Math.abs(this.n), this.d) }
  get zero() { return this.n === 0 }
}
const q = (n, d = 1) => new Q(n, d), ONE = q(1)
const so = (s) => { const t = s.replace(/\s+/g, '').replace(',', '.'); const [a, b = ''] = t.split('.'); return new Q(Number(a + b), 10 ** b.length) }
/** số thập phân (dấu phẩy) tối đa md chữ lẻ; null nếu vô hạn / quá dài */
function dec(r, md = 2) {
  let k = 0; while ((10 ** k) % r.d !== 0) { k++; if (k > md) return null }
  const v = Math.abs(r.n) * (10 ** k) / r.d, s = String(v).padStart(k + 1, '0')
  const ng = k ? s.slice(0, -k) : s, le = k ? s.slice(-k) : ''
  return ng + (le ? ',' + le : '')
}
const nhom = (s) => s

// ── đọc đề (độc lập với bộ sinh) ────────────────────────────────────────────────────────────────────────────────
const GIAM_RE = /giảm|bớt|hạ|ít hơn|thấp hơn|kém/, TANG_RE = /tăng|thêm|nâng|cao hơn|nhiều hơn/
function docDe(d) {
  const M = [...d.matchAll(/(\d{1,3}(?: \d{3})+|\d+) đồng/g)].map((m) => so(m[1]))
  const P = []
  for (const m of d.matchAll(/(\d+(?:,\d+)?)\s?%/g)) {
    const truoc = d.slice(0, m.index), s = [...truoc.matchAll(/\d+(?:,\d+)?/g)].pop()
    const win = truoc.slice(Math.max(s ? s.index + s[0].length : 0, m.index - 60))
    const dau = GIAM_RE.test(win) ? -1 : TANG_RE.test(win) ? 1 : 0
    const v = so(m[1]).div(q(100))
    P.push({ v, dau, r: dau === 0 ? v : (dau > 0 ? ONE.add(v) : ONE.sub(v)) })
  }
  const u = d.match(/\$(\d+(?:,\d+)?)\\ \\text\{(\w+)\}\^(\d)\$/)
  const cm = d.match(/(\d+(?:,\d+)?) cm\b/), ng = d.match(/(\d+) ngày/)
  return { M, P, U: u ? so(u[1]) : null, cm: cm ? so(cm[1]) : null, ngay: ng ? so(ng[1]) : null }
}

const HUONG_A = ['Tăng', 'Giảm'], HUONG_B = ['Nhiều hơn', 'Ít hơn']
const tuHuong = (da) => HUONG_A.find((h) => da.startsWith(h + ' ')) ? HUONG_A : HUONG_B.find((h) => da.startsWith(h + ' ')) ? HUONG_B : null
const huongHT = (da) => [...HUONG_A, ...HUONG_B].find((h) => da.startsWith(h + ' ')) ?? null

/** sinh ứng viên cho 1 câu */
function nhieuCau(c) {
  const da = c.dap_an, mau = c.mau, { M, P, U, cm, ngay } = docDe(c.noi_dung)
  const A = P.map((p) => p.v), S = P.map((p) => p.dau), R = P.map((p) => p.r)
  const loai = da.includes('\\%') ? 'pt' : ''
  const bo = tuHuong(da), hDung = huongHT(da)
  const ds = [] // [chuỗi text, rule, duong_sai]
  const prod = (a) => a.reduce((x, y) => x.mul(y), ONE)
  const sg = (i) => (S[i] > 0 ? A[i] : q(0).sub(A[i]))            // % có dấu
  const sumR = (idx) => idx.reduce((t, i) => t.add(sg(i)), ONE)     // 1 + tổng % có dấu (cộng trừ thẳng)
  const vi = (R_, rule, msg) => { /* phần trăm thay đổi từ tỉ số R_ : đổi tỉ số → "Tăng/Giảm x%" theo dấu của R_ − 1 */
    if (R_.cmp(ONE) === 0 || R_.cmp(q(0)) <= 0) return
    const x = R_.cmp(ONE) > 0 ? R_.sub(ONE) : ONE.sub(R_), t = mkPt(x, R_.cmp(ONE) > 0 ? 0 : 1); if (t) ds.push([t, rule, msg])
  }
  const idx = (h) => (bo ? bo.indexOf(h) : -1)
  const dungI = bo ? bo.indexOf(hDung) : 0
  /** "Tăng x%" với chỉ số hướng i (0 = từ thứ nhất của bộ, 1 = từ thứ hai) */
  function mkPt(x, i) {
    const s = dec(x.mul(q(100)), 2); if (!s || x.zero) return null
    if (bo && (bo[i] === 'Giảm' || bo[i] === 'Ít hơn') && x.cmp(ONE) >= 0) return null   // giảm từ 100% trở lên là phi lí
    const num = `${s}\\%`
    return bo ? `${bo[i]} $${num}$` : `$${num}$`
  }
  const viX = (x, i, rule, msg) => { const t = mkPt(x, i); if (t) ds.push([t, rule, msg]) }       // giữ nguyên x, chọn chỉ số hướng
  const viDung = (x, rule, msg) => viX(x, dungI, rule, msg)                                         // hướng đúng của đáp án
  const viLat = (x, rule, msg) => viX(x, 1 - dungI, rule, msg)
  const asIs = (R_, rule, msg) => viDung(R_, rule, msg)                                             // ghi luôn "bằng x%" (x = tỉ số)
  const gt = (v, rule, msg) => { // giá trị không phải %: tiền / số đo
    if (!v || v.cmp(q(0)) <= 0) return
    if (/ đồng$/.test(da)) { const s = dec(v, 0); if (!s || v.n % 1000 !== 0) return; ds.push([da.replace(/\d+/, String(v.n)), rule, msg]); return }
    const s = dec(v, 2); if (!s) return
    ds.push([da.replace(/\d+(?:,\d+)?/, s), rule, msg])
  }
  const kq = {}
  const cha = ([x, y]) => x // eslint helper
  switch (mau) {
    case 'gk_a1': case 'gk_a2': {
      const G = M[0], F = G.mul(R[0]).mul(R[1])
      gt(G.mul(sumR([0, 1])), 'R526', 'Cộng hai phần trăm giảm rồi giảm một lần trên giá ban đầu')
      gt(G.mul(R[0]), 'R539', 'Chỉ tính lần giảm thứ nhất rồi lấy làm đáp số')
      gt(G.mul(R[0]).mul(ONE.add(A[1])), 'R407', 'Lần giảm thứ hai lại cộng thêm thay vì trừ đi')
      gt(G.sub(F), 'R408', 'Tính xong tổng tiền được giảm rồi dừng, quên lấy giá ban đầu trừ đi')
      gt(G.mul(A[0]).mul(A[1]), 'R101', 'Nhân giá với số phần trăm giảm thay vì phần trăm còn lại')
      gt(F.add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước tính cuối')
      break
    }
    case 'gk_b1': case 'gk_b2': {
      const F = M[0]
      gt(ONE.sub(A[0]).sub(A[1]).cmp(q(0)) > 0 ? F.div(ONE.sub(A[0]).sub(A[1])) : null, 'R526', 'Cộng hai phần trăm giảm rồi chia giá cuối cho phần còn lại')
      gt(F.mul(R[0]).mul(R[1]), 'R525', 'Nhân giá cuối với tỉ số còn lại thay vì chia')
      gt(F.div(R[1]), 'R539', 'Chỉ ngược lần giảm thứ hai, lấy giá sau lần giảm thứ nhất làm đáp số')
      gt(F.mul(ONE.add(A[0])).mul(ONE.add(A[1])), 'R407', 'Cộng thêm phần trăm vào giá cuối thay vì chia ngược')
      gt(F.div(R[0]), 'R408', 'Chỉ chia cho tỉ số của lần giảm đầu, bỏ sót lần giảm còn lại')
      gt(F.div(R[0].mul(R[1])).add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước tính cuối')
      break
    }
    case 'gk_c_con': {
      const T = R[0].mul(R[1])
      viX(ONE.sub(A[0]).sub(A[1]), 0, 'R526', 'Cộng hai phần trăm giảm rồi lấy 100% trừ đi')
      viX(ONE.sub(T), 0, 'R528', 'Tính được phần đã giảm nhưng ghi nhầm là phần còn lại')
      viX(R[0], 0, 'R539', 'Chỉ tính lần giảm thứ nhất rồi lấy làm đáp số')
      viX(A[0].mul(A[1]), 0, 'R101', 'Nhân hai phần trăm giảm thay vì hai phần trăm còn lại')
      viX(R[1], 0, 'R408', 'Chỉ lấy tỉ số còn lại của lần giảm thứ hai')
      viX(T.add(q(1, 100)), 0, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'gk_c_giam': {
      const T = R[0].mul(R[1])
      viX(A[0].add(A[1]), 0, 'R526', 'Cộng thẳng hai phần trăm giảm')
      viX(T, 0, 'R528', 'Tính được giá còn bằng bao nhiêu phần trăm rồi ghi luôn, quên lấy 100% trừ đi')
      viX(A[0], 0, 'R539', 'Chỉ lấy phần trăm giảm của lần thứ nhất')
      viX(A[0].mul(A[1]), 0, 'R101', 'Nhân hai phần trăm giảm với nhau')
      viX(A[1], 0, 'R408', 'Chỉ lấy phần trăm giảm của lần thứ hai')
      viX(ONE.sub(T).add(q(1, 100)), 0, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'gk_d': {
      const G = M[0], F = G.mul(R[0]).mul(R[1])
      gt(F, 'R408', 'Tính ra giá sau hai lần giảm rồi dừng, chưa lấy giá ban đầu trừ đi')
      gt(G.mul(A[0]), 'R539', 'Chỉ lấy số tiền được giảm ở lần thứ nhất')
      gt(G.mul(A[0].add(A[1])), 'R526', 'Cộng hai phần trăm giảm rồi tính trên giá ban đầu')
      gt(G.add(F), 'R407', 'Cộng giá ban đầu với giá cuối thay vì trừ')
      gt(G.sub(F).add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'gk_e': {
      const G = M[0], F = M[1], X = G.mul(R[0]), r2 = F.div(X)
      viX(ONE.div(r2).sub(ONE), 0, 'R529', 'Lấy giá sau lần giảm thứ nhất chia giá cuối (chia ngược)')
      viX(ONE.sub(r2).mul(R[0]), 0, 'R527', 'Tính phần trăm giảm trên giá niêm yết thay vì giá sau lần giảm đầu')
      viX(r2, 0, 'R528', 'Tìm được giá cuối bằng bao nhiêu phần trăm rồi ghi luôn, quên lấy 100% trừ đi')
      viX(ONE.sub(F.div(G)), 0, 'R408', 'Lấy tổng phần trăm đã giảm so với giá niêm yết làm đáp số')
      viX(ONE.sub(r2).add(q(1, 100)), 0, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'gk_h': {
      const G = M[0], F = G.mul(R[0]).mul(R[1]).mul(R[2])
      gt(G.mul(ONE.sub(A[0]).sub(A[1]).sub(A[2])), 'R526', 'Cộng ba phần trăm giảm rồi giảm một lần')
      gt(G.mul(R[0]).mul(R[1]), 'R539', 'Chỉ tính hai lần giảm đầu rồi lấy làm đáp số')
      gt(G.mul(R[0]).mul(R[1]).mul(ONE.add(A[2])), 'R407', 'Lần giảm thứ ba lại cộng thêm thay vì trừ')
      gt(G.mul(R[0]), 'R408', 'Chỉ tính lần giảm thứ nhất rồi dừng')
      gt(F.add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_a': case 'dtich_a': {
      const T = R[0].mul(R[1])
      viX(sumR([0, 1]).sub(ONE).abs, sumR([0, 1]).cmp(ONE) > 0 ? 0 : 1, 'R526', 'Cộng trừ thẳng hai phần trăm thay đổi thay vì nhân hai tỉ số')
      viX(T.sub(ONE).abs, T.cmp(ONE) > 0 ? 1 : 0, 'R530', 'Làm đúng phép nhân nhưng kết luận ngược chiều tăng/giảm')
      viX(T, T.cmp(ONE) > 0 ? 0 : 1, 'R528', 'Tìm được tỉ số bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      viX(A[0], S[0] > 0 ? 0 : 1, 'R539', 'Chỉ lấy phần trăm thay đổi của đại lượng thứ nhất')
      viX(A[1], S[1] > 0 ? 0 : 1, 'R408', 'Chỉ lấy phần trăm thay đổi của đại lượng thứ hai')
      viX(T.sub(ONE).abs.add(q(1, 100)), T.cmp(ONE) > 0 ? 0 : 1, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_b': case 'dtich_d': {
      // R[0] = giá (hay chiều dài), R[1] = doanh thu (hay diện tích) → tỉ số cần tìm N = R1/R0
      const N = R[1].div(R[0]), up = (r_) => (r_.cmp(ONE) > 0 ? 0 : 1)
      const sd = sg(1).sub(sg(0))
      viX(sd.abs, sd.cmp(q(0)) > 0 ? 0 : 1, 'R526', 'Lấy hiệu hai phần trăm thay đổi thay vì chia hai tỉ số')
      viX(N.sub(ONE).abs, up(N) === 0 ? 1 : 0, 'R530', 'Làm đúng phép chia nhưng kết luận ngược chiều tăng/giảm')
      viX(N, up(N), 'R528', 'Tìm được tỉ số bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      vi(R[0].mul(R[1]), 'R525', 'Nhân hai tỉ số thay vì chia')
      vi(R[0].div(R[1]), 'R529', 'Chia ngược: lấy tỉ số giá chia tỉ số doanh thu')
      viX(N.sub(ONE).abs.add(q(1, 100)), up(N), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_c': {
      const G = M[0]
      gt(G.mul(R[0]).mul(R[1]), 'R525', 'Nhân hai tỉ số thay vì chia doanh thu cho số lượng')
      gt(G.mul(R[0]).div(R[1]), 'R529', 'Chia ngược: lấy tỉ số số lượng chia tỉ số doanh thu')
      gt(G.mul(ONE.add(sg(1)).sub(sg(0)).cmp(q(0)) > 0 ? ONE.add(sg(1)).sub(sg(0)) : ONE), 'R526', 'Lấy hiệu hai phần trăm thay đổi thay vì chia hai tỉ số')
      gt(G.mul(R[1]), 'R539', 'Chỉ tính theo phần trăm doanh thu, bỏ qua số lượng')
      gt(G.mul(R[0]), 'R408', 'Chỉ tính theo phần trăm số lượng, bỏ qua doanh thu')
      gt(G.mul(q(2).sub(R[1].div(R[0]))), 'R530', 'Làm đúng phép chia nhưng đổi chiều: giá giảm thành tăng và ngược lại')
      gt(G.mul(R[1]).div(R[0]).add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_d1': case 'dt_d2': {
      const x = R[0], y = R[1], N = mau === 'dt_d1' ? x.mul(y) : x.div(y), up = (r_) => (r_.cmp(ONE) > 0 ? 0 : 1)
      viX(N.sub(ONE).abs, up(N) === 0 ? 1 : 0, 'R530', 'Làm đúng phép tính nhưng kết luận ngược nhiều hơn / ít hơn')
      const Wr = mau === 'dt_d1' ? x.div(y) : y.div(x)
      vi2(Wr, 'R529', 'Dùng ngược quan hệ giá: lấy tỉ số giá của nơi này thay cho nơi kia')
      viX(N, up(N), 'R528', 'Tìm được số lượng bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      if (mau === 'dt_d1') vi2(ONE.div(y), 'R539', 'Chỉ tính giá của A so với B rồi lấy làm đáp số')
      else vi2(x.mul(y), 'R525', 'Nhân thay vì chia doanh thu cho giá')
      viX(x.sub(y).abs, x.cmp(y) > 0 ? 0 : 1, 'R526', 'Lấy hiệu hai phần trăm đề cho thay vì chia')
      viX(N.sub(ONE).abs.add(q(1, 100)), up(N), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      function vi2(r_, rule, msg) { if (r_.cmp(ONE) === 0 || r_.cmp(q(0)) <= 0) return; viX(r_.sub(ONE).abs, r_.cmp(ONE) > 0 ? 0 : 1, rule, msg) }
      break
    }
    case 'dt_e': {
      const D = M[0], T = R[0].mul(R[1])
      gt(D.mul(sumR([0, 1])), 'R526', 'Cộng trừ thẳng hai phần trăm thay vì nhân hai tỉ số')
      gt(D.mul(R[0]), 'R539', 'Chỉ tính theo thay đổi của giá, bỏ qua số lượng')
      gt(D.mul(R[1]), 'R408', 'Chỉ tính theo thay đổi của số lượng, bỏ qua giá')
      gt(D.div(T), 'R525', 'Chia cho tích hai tỉ số thay vì nhân')
      gt(D.mul(q(2).sub(T)), 'R530', 'Làm đúng phép nhân nhưng đổi chiều tăng/giảm của doanh thu')
      gt(D.mul(T).add(q(1000)), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_f': case 'ns_a': case 'ns_b': case 'ns_e': {
      const N = ONE.div(R[0]), up = (r_) => (r_.cmp(ONE) > 0 ? 0 : 1), xa = A[0]
      viX(N.sub(ONE).abs, up(N) === 0 ? 1 : 0, 'R530', 'Làm đúng phép chia nhưng kết luận ngược chiều tăng/giảm')
      viX(N, up(N), 'R528', 'Tìm được tỉ số bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      viX(xa, up(N), 'R527', 'Lấy luôn phần trăm đề cho nhưng đổi chiều, quên tính trên số mới')
      viX(xa, up(N) === 0 ? 1 : 0, 'R525', 'Nhân thay vì chia: coi đại lượng đổi cùng chiều với phần trăm đề cho')
      viX(N.sub(ONE).abs.add(q(1, 100)), up(N), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dt_g': {
      const x = R[0], y = R[1], N = x.div(y), up = (r_) => (r_.cmp(ONE) > 0 ? 0 : 1)
      viX(N.sub(ONE).abs, up(N) === 0 ? 1 : 0, 'R530', 'Làm đúng phép chia nhưng kết luận ngược chiều tăng/giảm')
      viX(N, up(N), 'R528', 'Tìm được giá bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      { const r_ = x.mul(y); viX(r_.sub(ONE).abs, up(r_), 'R525', 'Nhân hai tỉ số thay vì chia') }
      viX(x.sub(y).abs, x.cmp(y) > 0 ? 0 : 1, 'R526', 'Lấy hiệu hai phần trăm đề cho thay vì chia')
      { const r_ = y.div(x); viX(r_.sub(ONE).abs, up(r_), 'R529', 'Chia ngược: lấy phần trăm số lượng chia phần trăm doanh thu') }
      viX(N.sub(ONE).abs.add(q(1, 100)), up(N), 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dtich_b': {
      const S0 = U, T = R[0].mul(R[1])
      gt(S0.mul(sumR([0, 1])), 'R526', 'Cộng trừ thẳng hai phần trăm thay vì nhân hai tỉ số')
      gt(S0.mul(R[0]), 'R539', 'Chỉ tính theo thay đổi của chiều dài')
      gt(S0.mul(R[1]), 'R408', 'Chỉ tính theo thay đổi của chiều rộng')
      gt(S0.div(T), 'R525', 'Chia cho tích hai tỉ số thay vì nhân')
      gt(S0.mul(q(2).sub(T)), 'R530', 'Làm đúng phép nhân nhưng đổi chiều tăng/giảm của diện tích')
      gt(S0.mul(T).mul(q(10)), 'R540', 'Làm đúng cách nhưng lệch một hàng ở bước cuối')
      break
    }
    case 'dtich_c1': case 'dtich_c2': {
      const L = R[0], W = ONE.div(L), x = W.sub(ONE).abs
      viX(A[0], 0, 'R527', 'Lấy luôn phần trăm đề cho, quên rằng phần trăm tính trên số mới')
      viX(W, 0, 'R528', 'Tìm được tỉ số bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      viX(L, 0, 'R539', 'Lấy tỉ số chiều dài mới làm đáp số')
      viX(ONE.sub(x).cmp(q(0)) > 0 ? ONE.sub(x) : x.add(q(1, 10)), 0, 'R101', 'Lấy phần trăm bù thay vì phần trăm cần tìm')
      viX(x.add(q(1, 100)), 0, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dtich_e': {
      const w = R[0], RA = R[1], l = RA.div(w), dd = cm, tangL = l.cmp(ONE) > 0
      const dq = tangL ? l.sub(ONE) : ONE.sub(l), X = dd.div(dq), sgnd = tangL ? 1 : -1
      const moi = (cu, s) => (s > 0 ? cu.add(dd) : cu.sub(dd))
      gt(X, 'R531', 'Tìm được chiều dài cũ rồi dừng, quên cộng/trừ số xăng-ti-mét đề cho')
      gt(moi(X, -sgnd), 'R407', 'Cộng thay vì trừ (hoặc ngược lại) ở bước cuối')
      { const dq2 = RA.cmp(ONE) > 0 ? RA.sub(ONE) : ONE.sub(RA); gt(moi(dd.div(dq2), sgnd), 'R527', 'Lấy phần trăm diện tích thay cho phần trăm chiều dài để tìm chiều dài cũ') }
      { const l2 = w.div(RA); if (l2.cmp(ONE) !== 0) { const dq3 = l2.cmp(ONE) > 0 ? l2.sub(ONE) : ONE.sub(l2); gt(dd.div(dq3).mul(l2), 'R529', 'Chia ngược tỉ số chiều rộng và diện tích') } }
      gt(X.mul(l).mul(q(10)), 'R540', 'Làm đúng cách nhưng lệch một hàng ở bước cuối')
      gt(dd.mul(l), 'R525', 'Nhân số xăng-ti-mét đề cho với tỉ số thay vì chia')
      break
    }
    case 'dtich_f': {
      const T = R[0].mul(R[0]), up = T.cmp(ONE) > 0 ? 0 : 1
      viX(A[0].mul(q(2)), S[0] > 0 ? 0 : 1, 'R526', 'Cộng hai lần phần trăm thay đổi của cạnh thay vì nhân')
      viX(T.sub(ONE).abs, 1 - up, 'R530', 'Làm đúng phép nhân nhưng kết luận ngược chiều tăng/giảm')
      viX(A[0], S[0] > 0 ? 0 : 1, 'R539', 'Chỉ lấy phần trăm thay đổi của cạnh làm đáp số')
      viX(T, up, 'R528', 'Tìm được diện tích bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      viX(T.sub(ONE).abs.add(q(1, 100)), up, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'dtich_g': {
      const T = R[0].mul(R[1]), dT = T.sub(ONE).abs, Dv = U
      gt(Dv.mul(dT), 'R525', 'Nhân phần diện tích thay đổi với phần trăm thay vì chia')
      gt(Dv.div(T), 'R528', 'Chia cho tỉ số bằng bao nhiêu phần trăm, quên trừ 100%')
      { const s_ = sumR([0, 1]).sub(ONE).abs; if (!s_.zero) gt(Dv.div(s_), 'R526', 'Cộng trừ thẳng hai phần trăm rồi chia') }
      { const d1 = R[0].sub(ONE).abs; gt(Dv.div(d1), 'R539', 'Chỉ lấy phần trăm thay đổi của chiều dài') }
      gt(Dv.div(dT).mul(T), 'R408', 'Tìm được diện tích mới rồi dừng, quên tìm diện tích ban đầu')
      gt(T.cmp(ONE) > 0 ? Dv.div(dT).add(Dv.mul(q(2))) : Dv.div(dT).sub(Dv.mul(q(2))), 'R407', 'Cộng/trừ phần thay đổi hai lần thay vì một lần')
      gt(Dv.div(dT).mul(q(10)), 'R540', 'Làm đúng cách nhưng lệch một hàng ở bước cuối')
      break
    }
    case 'ns_c': {
      const T0 = ngay
      gt(T0.mul(R[0]), 'R525', 'Nhân số ngày với tỉ số thay vì chia')
      gt(T0.mul(ONE.sub(A[0])).cmp(q(0)) > 0 ? T0.mul(ONE.sub(A[0])) : null, 'R526', 'Số người tăng a% nên cho số ngày giảm a%')
      gt(T0.mul(A[0]), 'R101', 'Lấy phần trăm của số ngày dự định thay vì chia cho tỉ số')
      gt(T0.sub(T0.div(R[0])), 'R408', 'Tìm số ngày rút ngắn được rồi lấy làm đáp số')
      gt(T0.div(R[0]).add(q(1)), 'R540', 'Làm đúng cách nhưng sai một đơn vị ở bước cuối')
      break
    }
    case 'ns_d': {
      const T0 = ngay, tm = T0.div(R[0])
      gt(tm, 'R408', 'Tìm số ngày làm thật rồi dừng, quên lấy số ngày dự kiến trừ đi')
      gt(T0.mul(R[0]).sub(T0), 'R525', 'Nhân số ngày với tỉ số thay vì chia rồi lấy hiệu')
      gt(T0.mul(A[0]), 'R526', 'Số ngày sớm hơn bằng phần trăm tăng năng suất của số ngày dự kiến')
      gt(T0.add(tm), 'R407', 'Cộng thay vì trừ ở bước cuối')
      gt(T0.sub(tm).add(q(1)), 'R540', 'Làm đúng cách nhưng sai một đơn vị ở bước cuối')
      break
    }
    case 'ns_f': {
      const N = ONE.div(R[0]), x = N.sub(ONE).abs
      viX(A[0], 0, 'R527', 'Lấy luôn phần trăm thời gian giảm làm phần trăm năng suất tăng')
      viX(N, 0, 'R528', 'Tìm được tỉ số bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      viX(R[0], 0, 'R539', 'Lấy tỉ số thời gian còn lại làm đáp số')
      viX(ONE.sub(x).cmp(q(0)) > 0 ? ONE.sub(x) : x.add(q(1, 10)), 0, 'R101', 'Lấy phần trăm bù thay vì phần trăm cần tìm')
      viX(x.add(q(1, 100)), 0, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'ns_g': {
      const T0 = ngay, tot = R[0].mul(R[1])
      gt(T0.div(sumR([0, 1])), 'R526', 'Cộng trừ thẳng hai phần trăm thay vì nhân hai tỉ số')
      gt(T0.div(R[0]), 'R539', 'Chỉ tính theo số người tăng, bỏ qua năng suất mỗi người giảm')
      gt(T0.div(R[1]), 'R408', 'Chỉ tính theo năng suất mỗi người, bỏ qua số người')
      gt(T0.mul(tot), 'R525', 'Nhân số ngày với tích hai tỉ số thay vì chia')
      gt(T0.div(tot).add(q(1)), 'R540', 'Làm đúng cách nhưng sai một đơn vị ở bước cuối')
      break
    }
    case 'ns_h': {
      const tot = R[0].mul(R[1]), N = ONE.div(tot)
      viX(A[0].add(A[1]), 1, 'R526', 'Cộng thẳng hai phần trăm tăng rồi coi là thời gian giảm')
      viX(N.sub(ONE).abs, 0, 'R530', 'Làm đúng phép chia nhưng kết luận ngược chiều tăng/giảm')
      viX(N, 1, 'R528', 'Tìm được thời gian bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      { const r_ = ONE.div(R[0]); viX(ONE.sub(r_), 1, 'R539', 'Chỉ tính theo số người, bỏ qua năng suất mỗi người') }
      viX(tot.sub(ONE), 0, 'R525', 'Nhân thay vì chia: lấy phần trăm năng suất cả đội tăng làm đáp số')
      viX(ONE.sub(N).add(q(1, 100)), 1, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'tt_a': case 'tt_e': case 'tt_g': {
      const T = prod(R.slice(0, mau === 'tt_a' ? 3 : mau === 'tt_e' ? 1 : 2).map((r_, i) => r_))
      const Tr = mau === 'tt_a' ? R[0].mul(R[1]).mul(R[2]) : mau === 'tt_e' ? R[0].mul(R[0]).mul(R[0]) : R[0].mul(R[0]).mul(R[1])
      const up = Tr.cmp(ONE) > 0 ? 0 : 1
      const sum = mau === 'tt_a' ? sumR([0, 1, 2]) : mau === 'tt_e' ? ONE.add(sg(0).mul(q(3))) : ONE.add(sg(0).mul(q(2))).add(sg(1))
      viX(sum.sub(ONE).abs, sum.cmp(ONE) > 0 ? 0 : 1, 'R526', 'Cộng trừ thẳng các phần trăm thay vì nhân các tỉ số')
      viX(Tr.sub(ONE).abs, 1 - up, 'R530', 'Làm đúng phép nhân nhưng kết luận ngược chiều tăng/giảm')
      viX(Tr, up, 'R528', 'Tìm được thể tích bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      const dở = mau === 'tt_a' ? R[0].mul(R[1]) : mau === 'tt_e' ? R[0].mul(R[0]) : R[0].mul(R[0])
      if (dở.cmp(ONE) !== 0) viX(dở.sub(ONE).abs, dở.cmp(ONE) > 0 ? 0 : 1, 'R539', mau === 'tt_a' ? 'Chỉ nhân hai tỉ số đầu, bỏ sót kích thước còn lại' : 'Chỉ nhân hai tỉ số, thiếu một lần nhân')
      if (mau === 'tt_g') { const r1 = R[0].mul(R[1]); if (r1.cmp(ONE) !== 0) viX(r1.sub(ONE).abs, r1.cmp(ONE) > 0 ? 0 : 1, 'R408', 'Chỉ tính cạnh đáy một lần, quên cạnh đáy xuất hiện hai lần') }
      if (mau === 'tt_a') { const r2 = R[1].mul(R[2]); if (r2.cmp(ONE) !== 0) viX(r2.sub(ONE).abs, r2.cmp(ONE) > 0 ? 0 : 1, 'R408', 'Bỏ sót tỉ số của chiều dài khi nhân') }
      viX(Tr.sub(ONE).abs.add(q(1, 100)), up, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'tt_b': {
      const V = U, Tr = prod(R)
      gt(V.mul(sumR(R.map((_, i) => i))), 'R526', 'Cộng trừ thẳng các phần trăm thay vì nhân các tỉ số')
      gt(V.mul(R[0].mul(R[1])), 'R539', 'Chỉ nhân hai tỉ số đầu, bỏ sót tỉ số còn lại')
      gt(V.div(Tr), 'R525', 'Chia cho tích các tỉ số thay vì nhân')
      gt(V.mul(R[R.length - 1]), 'R408', 'Chỉ tính theo thay đổi của kích thước cuối')
      gt(V.mul(q(2).sub(Tr)), 'R530', 'Làm đúng phép nhân nhưng đổi chiều tăng/giảm của thể tích')
      gt(V.mul(Tr).mul(q(10)), 'R540', 'Làm đúng cách nhưng lệch một hàng ở bước cuối')
      break
    }
    case 'tt_c': case 'tt_d': {
      const kd = mau === 'tt_c', Tdb = R[0].mul(R[1]), N = kd ? R[2].div(Tdb) : ONE.div(Tdb), up = N.cmp(ONE) > 0 ? 0 : 1
      const sd = kd ? sg(2).sub(sg(0)).sub(sg(1)) : q(0).sub(sg(0)).sub(sg(1))
      if (!sd.zero) viX(sd.abs, sd.cmp(q(0)) > 0 ? 0 : 1, 'R526', 'Cộng trừ thẳng các phần trăm thay vì chia cho tích hai tỉ số')
      viX(N.sub(ONE).abs, 1 - up, 'R530', 'Làm đúng phép chia nhưng kết luận ngược chiều tăng/giảm')
      viX(N, up, 'R528', 'Tìm được chiều cao bằng bao nhiêu phần trăm rồi ghi luôn, quên so với 100%')
      { const r_ = kd ? R[2].mul(Tdb) : Tdb; viX(r_.sub(ONE).abs, r_.cmp(ONE) > 0 ? 0 : 1, 'R525', 'Nhân thay vì chia cho tích hai tỉ số') }
      if (kd) { const r_ = Tdb.div(R[2]); viX(r_.sub(ONE).abs, r_.cmp(ONE) > 0 ? 0 : 1, 'R529', 'Chia ngược: lấy tích hai tỉ số chia tỉ số thể tích') }
      else { const r_ = ONE.div(R[0]); if (r_.cmp(ONE) !== 0) viX(r_.sub(ONE).abs, r_.cmp(ONE) > 0 ? 0 : 1, 'R539', 'Chỉ tính theo chiều dài, bỏ sót chiều rộng') }
      viX(N.sub(ONE).abs.add(q(1, 100)), up, 'R540', 'Làm đúng cách nhưng sai một chữ số ở bước cuối')
      break
    }
    case 'tt_h': {
      const V = U, Tr = prod(R), d_ = Tr.sub(ONE).abs
      gt(V.mul(d_), 'R525', 'Nhân phần thể tích thay đổi với phần trăm thay vì chia')
      gt(V.div(Tr), 'R528', 'Chia cho tỉ số bằng bao nhiêu phần trăm, quên trừ 100%')
      { const s_ = sumR(R.map((_, i) => i)).sub(ONE).abs; if (!s_.zero) gt(V.div(s_), 'R526', 'Cộng trừ thẳng các phần trăm rồi chia') }
      { const r_ = R[0].mul(R[1]).sub(ONE).abs; if (!r_.zero) gt(V.div(r_), 'R539', 'Chỉ tính hai tỉ số đầu rồi chia') }
      gt(V.div(d_).mul(Tr), 'R408', 'Tìm được thể tích mới rồi dừng, quên tìm thể tích ban đầu')
      gt(Tr.cmp(ONE) > 0 ? V.div(d_).add(U.mul(q(2))) : V.div(d_).sub(U.mul(q(2))), 'R407', 'Cộng/trừ phần thay đổi hai lần thay vì một lần')
      gt(V.div(d_).mul(q(10)), 'R540', 'Làm đúng cách nhưng lệch một hàng ở bước cuối')
      break
    }
    default: throw new Error('mẫu lạ: ' + mau)
  }
  // bỏ ứng viên rỗng/trùng text/trùng đáp án, giữ thứ tự ưu tiên (đã xếp theo thứ tự đường sai tự nhiên)
  const thay = new Set([da]), kq2 = []
  for (const [text, rule, duong_sai] of ds) { if (!text || thay.has(text)) continue; thay.add(text); kq2.push({ text, rule, duong_sai }) }
  return kq2
}

export function sinhNhieu(cau) {
  return cau.map((c) => ({ noi_dung: c.noi_dung, nhieu: nhieuCau(c).slice(0, 6) }))
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-B-mcq.mjs')) {
  const a = process.argv.slice(2), lay = (k, mac) => (a.includes(k) ? a[a.indexOf(k) + 1] : mac)
  const cau = JSON.parse(readFileSync(lay('--vao', 'kho-rules/dai/clone/k5T-pt-fill-B.json'), 'utf8'))
  const lo = sinhNhieu(cau)
  console.log(lo.length, 'câu; ít hơn 4 ứng viên:', lo.filter((x) => x.nhieu.length < 4).length)
  const ra = lay('--ra', null); if (ra) { writeFileSync(ra, JSON.stringify(lo, null, 1)); console.log('→', ra) }
}
