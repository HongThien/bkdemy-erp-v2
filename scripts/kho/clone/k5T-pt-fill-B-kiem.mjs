// ============================================================================
// k5T-pt-fill-B-kiem.mjs — BỘ KIỂM ĐỘC LẬP cho lô k5T-pt-fill-B.json (giảm giá kép · doanh thu · diện tích · năng suất · thể tích hộp).
// KHÔNG dùng chung hàm tính với bộ sinh:
//   ① đọc CHỮ CỦA ĐỀ (tiền, %, số đo; dấu tăng/giảm lấy từ động từ đứng ngay trước mỗi số %) → tính lại đáp số bằng PHÂN SỐ BigInt
//      rồi đối chiếu `dap_an` (kể cả hướng "Tăng/Giảm/Nhiều hơn/Ít hơn") · câu hỏi cuối đề đúng loại với mẫu
//   ② từng dòng Phần 2 có "=": tính cả chuỗi a=b=c bằng phân số, mọi vế phải bằng nhau
//   ③ dòng "Đáp số:" cuối Phần 2 = `dap_an` · mọi số của đề (%, tiền, số đo) có mặt trong Phần 2
//   ④ Phần 1 card 3–6 bước (kiem-p1-card.mjs) · KaTeX · ký hiệu cấm · tiền là bội của 1000 · 0 trùng nội bộ (+ DB với --db)
//   node scripts/kho/clone/k5T-pt-fill-B-kiem.mjs kho-rules/dai/clone/k5T-pt-fill-B.json [--db]
// ============================================================================
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'

// ── phân số BigInt ──────────────────────────────────────────────────────────────────────────────────────────────
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class F {
  constructor(n, d = 1n) { if (d === 0n) throw new Error('chia 0'); if (d < 0n) { n = -n; d = -d } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g }
  add(o) { return new F(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new F(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new F(this.n * o.n, this.d * o.d) }
  div(o) { return new F(this.n * o.d, this.d * o.n) }
  eq(o) { return this.n === o.n && this.d === o.d }
  gt(o) { return this.n * o.d > o.n * this.d }
  get nguyen() { return this.d === 1n }
  get so() { return Number(this.n) / Number(this.d) }
}
const so = (s) => { const t = s.replace(/\s+/g, '').replace(',', '.'); const [a, b = ''] = t.split('.'); return new F(BigInt(a + b), 10n ** BigInt(b.length)) }
const ONE = new F(1n), HUN = new F(100n)
const pc = (x) => so(x).div(HUN)

// ── máy tính biểu thức trong $…$: số, \%, \times, :, +, - ───────────────────────────────────────────────────────
function tinh(expr) {
  const t = expr.replace(/\\times/g, '×').replace(/\\%/g, '%').replace(/\s+/g, '')
  const tok = []; const re = /(\d+(?:,\d+)?)(%?)|([×:+\-])/g; let m, vi = 0
  while ((m = re.exec(t))) { if (m.index !== vi) throw new Error('ký tự lạ: ' + t.slice(vi, m.index)); vi = re.lastIndex; tok.push(m[3] ? m[3] : (m[2] ? pc(m[1]) : so(m[1]))) }
  if (vi !== t.length) throw new Error('ký tự lạ ở cuối: ' + t.slice(vi))
  const hang = []; let cur = null, op = null
  for (const x of tok) {
    if (typeof x === 'string') { if (x === '×' || x === ':') op = x; else { hang.push(cur, x); cur = null; op = null } continue }
    if (cur === null) cur = x; else if (op === '×') { cur = cur.mul(x); op = null } else if (op === ':') { cur = cur.div(x); op = null } else throw new Error('thiếu toán tử')
  }
  hang.push(cur)
  let kq = hang[0]; for (let i = 1; i < hang.length; i += 2) kq = hang[i] === '+' ? kq.add(hang[i + 1]) : kq.sub(hang[i + 1])
  return kq
}

// ── đọc đề ─────────────────────────────────────────────────────────────────────────────────────────────────────
const tiens = (d) => [...d.matchAll(/(\d{1,3}(?: \d{3})+|\d+) đồng/g)].map((m) => so(m[1]))
const GIAM_RE = /giảm|bớt|hạ|ít hơn|thấp hơn|kém/, TANG_RE = /tăng|thêm|nâng|cao hơn|nhiều hơn/
/** mọi số % trong đề: { v: F (a/100), dau: +1/-1/0, r: tỉ số (1±v hoặc v nếu "bằng") }. Dấu = động từ nằm giữa số liền trước và số này. */
function docPct(d) {
  const kq = []
  for (const m of d.matchAll(/(\d+(?:,\d+)?)\s?%/g)) {
    const truoc = d.slice(0, m.index), s = [...truoc.matchAll(/\d+(?:,\d+)?/g)].pop()
    const bat = s ? s.index + s[0].length : 0
    const win = truoc.slice(Math.max(bat, m.index - 60))
    const dau = GIAM_RE.test(win) ? -1 : TANG_RE.test(win) ? 1 : 0
    const v = pc(m[1]); kq.push({ v, dau, r: dau === 0 ? v : ONE.add(dau > 0 ? v : new F(0n).sub(v)), goc: m[1] })
  }
  return kq
}
/** số có đơn vị mũ: $600\ \text{m}^2$ → { v, u, mu } */
function docDonVi(d) { const m = d.match(/\$(\d+(?:,\d+)?)\\ \\text\{(\w+)\}\^(\d)\$/); return m ? { v: so(m[1]), u: m[2], mu: m[3], goc: m[1] } : null }
const docCm = (d) => { const m = d.match(/(\d+(?:,\d+)?) cm\b/); if (!m) return null; const truoc = d.slice(0, m.index), s = [...truoc.matchAll(/\d+(?:,\d+)?/g)].pop(); const win = truoc.slice(Math.max(s ? s.index + s[0].length : 0, m.index - 60)); return { v: so(m[1]), dau: GIAM_RE.test(win) ? -1 : TANG_RE.test(win) ? 1 : 0, goc: m[1] } }
const docNgay = (d) => { const m = d.match(/(\d+) ngày/); return so(m[1]) }
const chg = (R, h = ['Tăng', 'Giảm']) => { if (R.eq(ONE)) throw new Error('không đổi'); return R.gt(ONE) ? { x: R.sub(ONE), huong: h[0] } : { x: ONE.sub(R), huong: h[1] } }
const cau = (d) => d.split(/(?<=[.?!])\s+/).pop()

/** đáp số kỳ vọng: { kq: F (số tiền / số / tỉ số %), huong?: 'Tăng'.., loai: 'tien'|'pt'|'so' } */
function kyVong(c) {
  const d = c.noi_dung, M = tiens(d), P = docPct(d), R = P.map((x) => x.r), mau = c.mau, cuoi = cau(d)
  const must = (re, ten) => { if (!re.test(cuoi)) throw new Error(`câu hỏi cuối không khớp mẫu ${mau} (${ten}): "${cuoi.slice(0, 70)}"`) }
  const prod = (a) => a.reduce((x, y) => x.mul(y), ONE)
  switch (mau) {
    case 'gk_a1': case 'gk_a2': must(/bao nhiêu tiền/, 'giá sau giảm'); return { kq: M[0].mul(R[0]).mul(R[1]), loai: 'tien' }
    case 'gk_b1': case 'gk_b2': must(/(ban đầu|trước khi giảm|chưa giảm)/, 'giá ban đầu'); return { kq: M[0].div(R[0].mul(R[1])), loai: 'tien' }
    case 'gk_c_con': must(/bằng bao nhiêu phần trăm giá/, 'giá còn lại %'); return { kq: R[0].mul(R[1]), loai: 'pt' }
    case 'gk_c_giam': must(/(tương đương|giảm tổng cộng)/, 'tương đương'); return { kq: ONE.sub(R[0].mul(R[1])), loai: 'pt' }
    case 'gk_d': must(/(rẻ hơn|tổng số tiền được giảm)/, 'tiền giảm'); return { kq: M[0].sub(M[0].mul(R[0]).mul(R[1])), loai: 'tien' }
    case 'gk_e': must(/(lần giảm thứ hai|lần giảm sau)/, '% lần hai'); return { kq: ONE.sub(M[1].div(M[0].mul(R[0]))), loai: 'pt' }
    case 'gk_h': must(/bao nhiêu tiền/, 'giá sau 3 lần'); return { kq: M[0].mul(prod(R.slice(0, 3))), loai: 'tien' }
    case 'dt_a': must(/doanh thu .*(tăng hay giảm|thay đổi)/, 'doanh thu %'); return { ...chg(R[0].mul(R[1])), kq: chg(R[0].mul(R[1])).x, loai: 'pt' }
    case 'dt_b': must(/số .*(tăng hay giảm|thay đổi)/, 'số lượng %'); { const c = chg(R[1].div(R[0])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dt_c': must(/giá .*bao nhiêu tiền/, 'giá mới'); return { kq: M[0].mul(R[1]).div(R[0]), loai: 'tien' }
    case 'dt_d1': { must(/nhiều hơn hay ít hơn/, 'so sánh số lượng'); const c = chg(R[0].mul(R[1]), ['Nhiều hơn', 'Ít hơn']); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dt_d2': { must(/nhiều hơn hay ít hơn/, 'so sánh số lượng'); const c = chg(R[0].div(R[1]), ['Nhiều hơn', 'Ít hơn']); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dt_e': must(/bao nhiêu tiền/, 'doanh thu mới'); return { kq: M[0].mul(R[0]).mul(R[1]), loai: 'tien' }
    case 'dt_f': { must(/(tăng hay giảm)/, 'lượng mua %'); const c = chg(ONE.div(R[0])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dt_g': { must(/giá .*(tăng hay giảm)/, 'giá %'); const c = chg(R[0].div(R[1])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dtich_a': { must(/diện tích .*(tăng hay giảm|thay đổi)/, 'diện tích %'); const c = chg(R[0].mul(R[1])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dtich_b': { must(/(mét vuông|xăng-ti-mét vuông)/, 'diện tích mới'); const u = docDonVi(d); return { kq: u.v.mul(R[0]).mul(R[1]), loai: 'so' } }
    case 'dtich_c1': must(/tăng chiều rộng thêm bao nhiêu phần trăm/, 'rộng tăng'); return { kq: ONE.div(R[0]).sub(ONE), loai: 'pt' }
    case 'dtich_c2': must(/giảm chiều rộng đi bao nhiêu phần trăm/, 'rộng giảm'); return { kq: ONE.sub(ONE.div(R[0])), loai: 'pt' }
    case 'dtich_d': { must(/chiều rộng .*(tăng hay giảm|thay đổi)/, 'rộng %'); const c = chg(R[1].div(R[0])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dtich_e': {
      must(/Tính chiều dài mới/, 'chiều dài mới'); const cm = docCm(d), l = R[1].div(R[0])   // R[0] = rộng, R[1] = diện tích
      const dl = l.gt(ONE) ? 1 : -1; if (dl !== cm.dau) throw new Error('hướng đổi chiều dài (cm) mâu thuẫn với % diện tích/chiều rộng')
      const cu = cm.v.div(l.gt(ONE) ? l.sub(ONE) : ONE.sub(l)); return { kq: cu.mul(l), loai: 'so' }
    }
    case 'dtich_f': { must(/diện tích .*(tăng hay giảm)/, 'diện tích hình vuông'); const c = chg(R[0].mul(R[0])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'dtich_g': {
      must(/(Tính diện tích ban đầu|diện tích ban đầu là bao nhiêu)/, 'diện tích ban đầu'); const u = docDonVi(d), t = R[0].mul(R[1]), dau = t.gt(ONE) ? 1 : -1
      if (!d.match(/diện tích (tăng|giảm|bớt|tăng thêm|giảm đi)/) || (/diện tích (giảm|bớt)/.test(d) ? -1 : 1) !== dau) throw new Error('hướng diện tích thay đổi mâu thuẫn')
      return { kq: u.v.div(t.gt(ONE) ? t.sub(ONE) : ONE.sub(t)), loai: 'so' }
    }
    case 'ns_a': case 'ns_b': case 'ns_e': { must(/(giảm|tăng).* bao nhiêu phần trăm/, '% thời gian'); const c = chg(ONE.div(R[0])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'ns_c': must(/bao nhiêu ngày/, 'số ngày'); return { kq: docNgay(d).div(R[0]), loai: 'so' }
    case 'ns_d': must(/sớm hơn .*bao nhiêu ngày/, 'sớm bao nhiêu ngày'); return { kq: docNgay(d).sub(docNgay(d).div(R[0])), loai: 'so' }
    case 'ns_f': must(/(tăng|năng suất).*bao nhiêu phần trăm/, '% năng suất'); return { kq: ONE.div(R[0]).sub(ONE), loai: 'pt' }
    case 'ns_g': must(/bao nhiêu ngày/, 'số ngày'); return { kq: docNgay(d).div(R[0].mul(R[1])), loai: 'so' }
    case 'ns_h': { must(/giảm.* bao nhiêu phần trăm/, '% thời gian'); const c = chg(ONE.div(R[0].mul(R[1]))); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_a': { must(/thể tích .*(tăng hay giảm|thay đổi)/, 'thể tích %'); const c = chg(prod(R.slice(0, 3))); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_b': { must(/(Tính thể tích mới|thể tích mới .*là bao nhiêu)/, 'thể tích mới'); const u = docDonVi(d); return { kq: u.v.mul(prod(R)), loai: 'so' } }
    case 'tt_c': { must(/chiều cao phải/, 'cao %'); const c = chg(R[2].div(R[0].mul(R[1]))); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_d': { must(/chiều cao phải/, 'cao %'); const c = chg(ONE.div(R[0].mul(R[1]))); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_e': { must(/thể tích .*(tăng hay giảm)/, 'thể tích %'); const c = chg(prod([R[0], R[0], R[0]])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_g': { must(/thể tích .*(tăng hay giảm|thay đổi)/, 'thể tích %'); const c = chg(R[0].mul(R[0]).mul(R[1])); return { kq: c.x, huong: c.huong, loai: 'pt' } }
    case 'tt_h': {
      must(/(thể tích ban đầu)/, 'thể tích ban đầu'); const u = docDonVi(d), t = prod(R), dau = t.gt(ONE) ? 1 : -1
      if ((/thể tích (giảm|bớt)/.test(d) || /hộp chữ nhật (giảm|bớt)/.test(d) ? -1 : 1) !== dau) throw new Error('hướng thể tích thay đổi mâu thuẫn')
      return { kq: u.v.div(t.gt(ONE) ? t.sub(ONE) : ONE.sub(t)), loai: 'so' }
    }
    default: throw new Error('mẫu lạ: ' + mau)
  }
}
const DANG_CUA_MAU = { gk: 'NDB02774', dt_: 'NDB02775', dtich: 'NDB02776', ns: 'NDB03002', tt: 'NDB03003' }
const dangCuaMau = (m) => (m.startsWith('gk_') ? 'NDB02774' : m.startsWith('dtich_') ? 'NDB02776' : m.startsWith('dt_') ? 'NDB02775' : m.startsWith('ns_') ? 'NDB03002' : 'NDB03003')

/** đáp án: (Tăng|Giảm|Nhiều hơn|Ít hơn)? số [%|đơn vị] */
function docDapAn(da) {
  const m = da.match(/^(Tăng|Giảm|Nhiều hơn|Ít hơn)? ?\$(\d+(?:,\d+)?)(\\%)?(?:\\ \\text\{(\w+)\}\^(\d))?\$( (?:đồng|cm|ngày))?$/)
  if (!m) throw new Error('dạng đáp án lạ: ' + da)
  return { huong: m[1] || null, v: m[3] ? pc(m[2]) : so(m[2]), pct: !!m[3], goc: m[2], donvi: m[6]?.trim() || (m[4] ? `${m[4]}^${m[5]}` : null) }
}

export function kiemCau(c) {
  const loi = []
  try {
    if (dangCuaMau(c.mau) !== c.dang) loi.push(`mẫu ${c.mau} không thuộc dạng ${c.dang}`)
    // ① đáp số
    const e = kyVong(c), co = docDapAn(c.dap_an)
    if (!e.kq.eq(co.v)) loi.push(`đáp án ${c.dap_an} ≠ tính lại từ đề (${e.kq.so}${e.loai === 'pt' ? ' = ' + e.kq.so * 100 + '%' : ''})`)
    if (e.loai === 'pt' && !co.pct) loi.push('đáp án phần trăm thiếu \\%')
    if (e.loai !== 'pt' && co.pct) loi.push('đáp án không phải phần trăm mà có \\%')
    if (e.huong && co.huong !== e.huong) loi.push(`hướng "${co.huong}" ≠ tính lại "${e.huong}"`)
    if (!e.huong && co.huong) loi.push(`thừa từ hướng "${co.huong}"`)
    if (e.loai === 'tien') { if (!e.kq.nguyen || e.kq.n % 1000n !== 0n) loi.push('đáp án tiền không là số nguyên bội của 1000'); if (!/ đồng$/.test(c.dap_an)) loi.push('đáp án tiền thiếu "đồng"') }
    // đáp số đẹp: hữu hạn ≤ 4 chữ số lẻ (phần trăm ≤ 2)
    { let d = e.kq.d; let k = 0; for (const p of [2n, 5n]) while (d % p === 0n) d /= p; if (d !== 1n) loi.push('đáp số là số thập phân vô hạn') }
    // đề: tiền bội 1000
    for (const t of tiens(c.noi_dung)) if (!t.nguyen || t.n % 1000n !== 0n) loi.push('số tiền trong đề không đẹp: ' + t.n)
    if (!/[?.]$/.test(c.noi_dung.trim())) loi.push('đề không kết bằng dấu câu')
    if (c.noi_dung.length < 60) loi.push('đề quá ngắn')
  } catch (er) { loi.push('không tính lại được: ' + er.message) }
  // ③ Phần 2
  const lg = c.loi_giai ?? '', i2 = lg.indexOf('**Phần 2. Trình bày**')
  if (i2 < 0) { loi.push('thiếu Phần 2'); return loi }
  const p1 = lg.slice(0, i2).trim(), p2 = lg.slice(i2).replace('**Phần 2. Trình bày**', '').trim().split(/\n\n/)
  if (p2[0] !== 'Bài giải') loi.push('Phần 2 phải mở bằng "Bài giải"')
  const cuoi = p2[p2.length - 1]
  if (!cuoi.startsWith('Đáp số: ')) loi.push('Phần 2 phải kết bằng "Đáp số: …"')
  else if (cuoi.slice(8).trim() !== c.dap_an.trim()) loi.push(`Đáp số cuối "${cuoi.slice(8)}" ≠ dap_an "${c.dap_an}"`)
  if (p2.length < 4) loi.push('Phần 2 quá ngắn (cần ≥ 2 dòng lời giải)')
  let coPhepTinh = 0
  for (const dong of p2.slice(1, -1)) {
    const cs = [...dong.matchAll(/\$([^$]+)\$/g)].map((m) => m[1]).filter((x) => x.includes('='))
    if (cs.length > 1) loi.push(`một dòng có ${cs.length} phép tính (1 câu lời giải → 1 phép tính): ${dong.slice(0, 50)}`)
    for (const ex of cs) {
      coPhepTinh++
      try {
        const vs = ex.split('='), gt = vs.map(tinh)
        for (let k = 1; k < gt.length; k++) if (!gt[k].eq(gt[0])) { loi.push(`sai số học: $${ex}$ (vế ${k + 1} ≠ vế 1)`); break }
      } catch (er) { loi.push(`không tính được $${ex}$: ${er.message}`) }
    }
  }
  if (!coPhepTinh) loi.push('Phần 2 không có phép tính nào')
  // mọi số của đề phải có mặt trong Phần 2
  const p2s = p2.join('\n')
  for (const x of docPct(c.noi_dung)) if (!p2s.includes(`${x.goc}\\%`)) loi.push(`số ${x.goc}% trong đề không xuất hiện ở Phần 2`)
  for (const t of c.noi_dung.matchAll(/(\d{1,3}(?: \d{3})+|\d+) đồng/g)) if (!p2s.includes(t[1].replace(/ /g, ''))) loi.push(`số tiền ${t[1]} trong đề không xuất hiện ở Phần 2`)
  const u = docDonVi(c.noi_dung); if (u && !p2s.includes(u.goc)) loi.push(`số đo ${u.goc} trong đề không xuất hiện ở Phần 2`)
  const cm = docCm(c.noi_dung); if (cm && !p2s.includes(cm.goc)) loi.push(`số đo ${cm.goc} cm không xuất hiện ở Phần 2`)
  // ④ hình thức
  for (const l of kiemP1(p1)) loi.push('Phần 1: ' + l)
  const tat = lg + '\n' + c.noi_dung
  if (/[⇒⇔∈∀≤≥]/.test(tat)) loi.push('ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥)')
  if (/\\div|\\cdot|\\frac/.test(lg)) loi.push('dùng \\div / \\cdot / \\frac (phải \\times và dấu :)')
  if (/\d\.\d/.test(tat.replace(/\*\*/g, ''))) loi.push('số thập phân dùng dấu chấm (phải dấu phẩy)')
  if ((c.noi_dung.match(/\$/g) || []).length % 2) loi.push('đề: số dấu $ lẻ')
  for (const m of tat.matchAll(/\$([^$]+)\$/g)) if (/[À-ỹ]/.test(m[1].replace(/\\text\{[^}]*\}/g, ''))) loi.push(`chữ Việt trong công thức: ${m[1].slice(0, 40)}`)
  if (/\b[xy]\b/.test(lg.replace(/\$[^$]*\$/g, ' ').replace(/\*\*/g, '')) && /Gọi|đặt ẩn/.test(lg)) loi.push('tự đặt ẩn')
  if (c.loai_cau !== 'tra_loi_ngan') loi.push('loai_cau phải tra_loi_ngan')
  return loi
}

// ── tự thử: bộ kiểm PHẢI bắt các sai cố ý ───────────────────────────────────────────────────────────────────────
function doiChuSo(s, tuViTri = 0) { for (let i = tuViTri; i < s.length; i++) if (/\d/.test(s[i])) return s.slice(0, i) + String((+s[i] + 1) % 10) + s.slice(i + 1); return s }
export function tuThu(cau) {
  const theoMau = new Map(); for (const c of cau) if (!theoMau.has(c.mau)) theoMau.set(c.mau, c)
  let bat = 0, tong = 0
  for (const c of theoMau.values()) {
    // (1) đổi 1 chữ số ở đáp số (cả dap_an lẫn dòng Đáp số cuối ⇒ chỉ phép tính lại từ đề mới bắt được)
    const da2 = doiChuSo(c.dap_an), c1 = { ...c, dap_an: da2, loi_giai: c.loi_giai.replace(/Đáp số: .*$/s, 'Đáp số: ' + da2) }
    // (2) sửa 1 số ở vế phải của một phép tính trong Phần 2
    const i2 = c.loi_giai.indexOf('**Phần 2'); const p2 = c.loi_giai.slice(i2), m = [...p2.matchAll(/\$([^$]*=[^$]*)\$/g)][1] ?? [...p2.matchAll(/\$([^$]*=[^$]*)\$/g)][0]
    const sai = m[0].replace(/(\d)([^\d]*)$/, (_, d, r) => String((+d + 1) % 10) + r)
    const c2 = { ...c, loi_giai: c.loi_giai.slice(0, i2) + p2.replace(m[0], sai) }
    // (3) đổi 1 chữ số trong đề (số liệu) mà giữ nguyên lời giải + đáp án
    const i3 = c.noi_dung.search(/\d/), c3 = { ...c, noi_dung: doiChuSo(c.noi_dung, i3 + 1 < c.noi_dung.length ? i3 : 0) }
    for (const [ten, x] of [['đổi chữ số đáp số', c1], ['sai số học trong Phần 2', c2], ['đổi số trong đề', c3]]) {
      tong++; const l = kiemCau(x); if (l.length) bat++; else console.log(`  KHÔNG BẮT: [${c.mau}] ${ten}`)
    }
  }
  console.log(`tự thử: bắt ${bat}/${tong} sai cố ý (${theoMau.size} mẫu × 3 kiểu)`)
  return bat === tong
}

// ── trùng với DB ───────────────────────────────────────────────────────────────────────────────────────────────
async function trungDB(cau) {
  const require = createRequire(new URL('../../../package.json', import.meta.url)), pg = require('pg')
  const env = readFileSync(new URL('../../../.env', import.meta.url), 'utf8'), mm = env.match(/^DATABASE_URL_RO=(.*)$/m) || env.match(/^DATABASE_URL=(.*)$/m)
  const cl = new pg.Client({ connectionString: mm[1].trim().replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } }); await cl.connect()
  const r = await cl.query("select c.noi_dung from bdm_cau_dang d join dai_cau_hoi c on c.ma_cau=d.ma_cau where d.dang_bai_id in ('NDB02771','NDB02772','NDB02773','NDB02774','NDB02775','NDB02776','NDB03002','NDB03003') and c.xoa_at is null")
  await cl.end()
  const co = new Set(r.rows.map((x) => x.noi_dung.toLowerCase().replace(/\s+/g, '')))
  const tr = cau.filter((c) => co.has(c.noi_dung.toLowerCase().replace(/\s+/g, '')))
  return { n: r.rowCount, tr }
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-B-kiem.mjs')) {
  const f = process.argv[2], cauL = JSON.parse(readFileSync(f, 'utf8'))
  let hong = 0
  for (const c of cauL) { const l = kiemCau(c); if (l.length) { hong++; console.log(`✘ [${c.mau}] ${c.noi_dung.slice(0, 100)}\n    ${l.join('\n    ')}`) } }
  const keys = cauL.map((c) => c.noi_dung.toLowerCase().replace(/\s+/g, '')), trung = keys.filter((x, i, a) => a.indexOf(x) !== i).length
  const dem = {}; for (const c of cauL) { dem[c.dang] ??= { cau: 0, mau: new Set() }; dem[c.dang].cau++; dem[c.dang].mau.add(c.mau) }
  for (const k of Object.keys(dem)) console.log(`${k}: ${dem[k].cau} câu · ${dem[k].mau.size} mẫu`)
  let trDB = 0
  if (process.argv.includes('--db')) { const { n, tr } = await trungDB(cauL); trDB = tr.length; console.log(`đối chiếu ${n} câu có sẵn trong DB: trùng ${trDB}`); for (const c of tr) console.log('  trùng DB:', c.noi_dung.slice(0, 80)) }
  console.log(`${cauL.length} câu · hỏng ${hong} · trùng đề ${trung}`)
  const okTu = tuThu(cauL)
  process.exit(hong || trung || trDB || !okTu ? 1 : 0)
}
