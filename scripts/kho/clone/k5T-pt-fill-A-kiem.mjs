// ============================================================================
// k5T-pt-fill-A-kiem.mjs — BỘ KIỂM ĐỘC LẬP cho lô fill phần trăm 5T (k5T-pt-fill-A.mjs). KHÔNG import hàm tính từ bộ sinh:
//   ① đọc CHỮ của đề (số, phần trăm, đơn vị, "nhiều hơn / ít hơn") rồi tính lại đáp số bằng PHÂN SỐ BigInt, đối chiếu `dap_an`
//      · bài tính (02767 · 02768 · 03000): máy tính CHÍNH biểu thức trong đề (hỗ trợ ngoặc, \%, \times, :, \dfrac, hỗn số)
//      · bài lời văn: tính lại theo từng mẫu từ chữ của đề
//   ② Phần 2: mọi chuỗi a=b=c trong $…$ phải có các vế bằng nhau; bài tính: dòng 1 chép đúng biểu thức đề, mọi vế của cả bài bằng giá trị đề;
//      bài lời văn: chuỗi cuối = dap_an, "Đáp số" = dap_an, mọi số của đề có mặt trong Phần 2
//   ③ hình thức: Phần 1 card 3–6 bước (kiem-p1-card.mjs), số trong Mấu chốt/Bước thuộc đề ∪ Phần 2, KaTeX cả đề / lời giải,
//      không chữ Việt trong $…$ (trừ \text), không ký hiệu cấm, không \div \cdot \frac, tổng quát không trùng đề (nội bộ, --db: với kho)
//   node scripts/kho/clone/k5T-pt-fill-A-kiem.mjs kho-rules/dai/clone/k5T-pt-fill-A.json [--db] [--tu-thu]
// ============================================================================
import { readFileSync, existsSync } from 'node:fs'
import { createRequire } from 'node:module'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'
const require = createRequire(import.meta.url)
const katex = require('katex')

// ── phân số BigInt ──────────────────────────────────────────────────────────────────────────────────────────────
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class F {
  constructor(n, d = 1n) { if (d === 0n) throw new Error('chia 0'); if (d < 0n) { n = -n; d = -d } const g = gcd(n, d) || 1n; this.n = n / g; this.d = d / g }
  add(o) { return new F(this.n * o.d + o.n * this.d, this.d * o.d) }
  sub(o) { return new F(this.n * o.d - o.n * this.d, this.d * o.d) }
  mul(o) { return new F(this.n * o.n, this.d * o.d) }
  div(o) { return new F(this.n * o.d, this.d * o.n) }
  eq(o) { return this.n === o.n && this.d === o.d }
  lt(o) { return this.n * o.d < o.n * this.d }
  get nguyen() { return this.d === 1n }
  get so() { return Number(this.n) / Number(this.d) }
}
const ONE = new F(1n), HUN = new F(100n), ZERO = new F(0n)
const so = (s) => { const t = String(s).replace(/\s+/g, '').replace(',', '.'); const [a, b = ''] = t.split('.'); return new F(BigInt(a + b), 10n ** BigInt(b.length)) }
const pc = (x) => (x instanceof F ? x : so(x)).div(HUN)

// ── máy tính biểu thức LaTeX đơn giản ───────────────────────────────────────────────────────────────────────────
export function tinhBt(src) {
  let s = src.replace(/\\text\{[^}]*\}/g, '').replace(/\\[ ,;!]/g, '').replace(/\s+/g, '').replace(/\\times/g, '*').replace(/\\%/g, '%')
  let i = 0
  const nhom = () => { // đọc {…} cân ngoặc
    if (s[i] !== '{') throw new Error('thiếu {')
    let sau = 1, j = i + 1; while (j < s.length && sau) { if (s[j] === '{') sau++; else if (s[j] === '}') sau--; j++ }
    const noi = s.slice(i + 1, j - 1); i = j; return noi
  }
  const frac = () => { i += '\\dfrac'.length; const t = nhom(), m = nhom(); return tinhBt(t).div(tinhBt(m)) }
  const atom = () => {
    let v
    if (s[i] === '(') { i++; v = expr(); if (s[i] !== ')') throw new Error('thiếu )'); i++ }
    else if (s.startsWith('\\dfrac', i)) v = frac()
    else {
      const m = /^\d+(?:,\d+)?/.exec(s.slice(i)); if (!m) throw new Error('ký tự lạ tại: ' + s.slice(i, i + 12)); i += m[0].length; v = so(m[0])
      if (s.startsWith('\\dfrac', i)) v = v.add(frac())   // hỗn số
    }
    while (s[i] === '%') { v = v.div(HUN); i++ }
    return v
  }
  const term = () => { let v = atom(); while (s[i] === '*' || s[i] === ':') { const o = s[i++]; const r = atom(); v = o === '*' ? v.mul(r) : v.div(r) } return v }
  const expr = () => { let v = term(); while (s[i] === '+' || s[i] === '-') { const o = s[i++]; const r = term(); v = o === '+' ? v.add(r) : v.sub(r) } return v }
  const v = expr(); if (i !== s.length) throw new Error('còn thừa: ' + s.slice(i, i + 12)); return v
}
const veChuoi = (e) => e.split('=')
const gtChuoi = (e) => veChuoi(e).map(tinhBt)

// ── đọc đề ─────────────────────────────────────────────────────────────────────────────────────────────────────
/** các số trong văn bản (không tính "5A", "5B"): {v, pct, unit} */
function docSo(d) {
  const kq = []
  for (const m of d.matchAll(/(?<![\w,.])(\d{1,3}(?: \d{3})+|\d+)(?:,(\d+))?(?![\dA-Za-z])(\s*%)?(?:\s+([\p{L}]+))?/gu)) kq.push({ v: so(m[1] + (m[2] ? ',' + m[2] : '')), pct: !!m[3], unit: m[4] || '' })
  return kq
}
const NUM = (d) => docSo(d).filter((x) => !x.pct)
const PCT = (d) => docSo(d).filter((x) => x.pct).map((x) => pc(x.v))
const nguoc = (x) => ONE.sub(x)
const dapAnSo = (da) => [...da.replace(/\\text\{[^}]*\}/g, '').matchAll(/(\d+(?:,\d+)?)/g)].map((m) => so(m[1]))
const cobPct = (da) => /\\%/.test(da)

/** đáp số kỳ vọng cho bài lời văn: { kq: F | [F…], pct: bool } */
function kyVong(c) {
  const d = c.noi_dung, N = NUM(d).map((x) => x.v), Pc = PCT(d), mau = c.mau
  const hon = /nhiều hơn/.test(d), it = /ít hơn/.test(d)
  const hieuDK = (a) => { // đề nói "nhiều hơn" thì phần trăm của chủ thể phải > 50, "ít hơn" thì < 50
    const a100 = a.mul(HUN); if (hon && !(a100.n > 50n * a100.d)) throw new Error('đề nói "nhiều hơn" nhưng phần trăm ≤ 50'); if (it && !(a100.n < 50n * a100.d)) throw new Error('đề nói "ít hơn" nhưng phần trăm ≥ 50')
    return a.mul(new F(2n)).sub(ONE)
  }
  const abs = (x) => (x.lt(ZERO) ? ZERO.sub(x) : x)
  switch (mau) {
    case 'pc_tinh': return { kq: N[0].mul(Pc[0]) }
    case 'pc_hs': { const m = d.match(/có (\d+) học sinh/); return { kq: so(m[1]).mul(Pc[0]) } }
    case 'pc_con_lai': return { kq: N[0].sub(N[0].mul(Pc[0])) }
    case 'pc_dien_tich': return { kq: N[0].mul(N[1]).mul(Pc[0]) }
    case 'pc_tang': return { kq: N[0].add(N[0].mul(Pc[0])) }
    case 'ts_tim_A': return { kq: N[0].div(Pc[0]) }
    case 'ts_phan_chiem': return { kq: N[0].div(Pc[0]) }
    case 'ts_con_lai': return { kq: N[0].div(nguoc(Pc[0])) }
    case 'ts_tang': if (!/tăng/.test(d)) throw new Error('mẫu tăng mà đề không nói tăng'); return { kq: N[0].div(ONE.add(Pc[0])) }
    case 'ts_giam': if (!/(dùng hết|dỡ xuống|giảm)/.test(d)) throw new Error('mẫu giảm mà đề không nói bớt'); return { kq: N[0].div(nguoc(Pc[0])) }
    case 'ts_doi_don_vi': return { kq: N[0].div(Pc[0]).div(HUN) }
    case 'ts_roi_pt': return { kq: N[0].div(Pc[0]).mul(Pc[1]) }
    case 'ti_phan_cl': return { kq: N[1].div(N[0]), pct: true }
    case 'ti_bang_pt': return { kq: N[1].div(N[0]), pct: true }
    case 'ti_hon_kem': { const r = N[1].div(N[0]); if (/nhiều hơn/.test(d)) { if (!ONE.lt(r)) throw new Error('đề nói nhiều hơn nhưng số sau không lớn hơn'); return { kq: r.sub(ONE), pct: true } } if (!r.lt(ONE)) throw new Error('đề nói ít hơn nhưng số sau không bé hơn'); return { kq: ONE.sub(r), pct: true } }
    case 'ti_ke_hoach_dat': return { kq: N[1].div(N[0]), pct: true }
    case 'ti_ke_hoach_vuot': return { kq: N[1].div(N[0]).sub(ONE), pct: true }
    case 'ti_nam_nu': return { kq: N[0].div(N[1]), pct: true }
    case 'ti_nu_cl': return { kq: N[1].div(N[0].add(N[1])), pct: true }
    case 'ti_hieu_tong': return { kq: N[0].add(N[1]).div(N[0].mul(new F(2n)).add(N[1])), pct: true }
    case 'ti_don_vi': {
      const u = docSo(d).filter((x) => !x.pct); const cap = `${u[0].unit}>${u[1].unit}`; const f = { 'km>m': 1000n, 'kg>g': 1000n, 'm>cm': 100n, 'tạ>kg': 100n }[cap]; if (!f) throw new Error('cặp đơn vị lạ: ' + cap)
      return { kq: u[1].v.div(u[0].v.mul(new F(f))), pct: true }
    }
    case 'ht_hieu_mot_pt': return { kq: N[0].div(abs(hieuDK(Pc[0]))), nguyenCan: [Pc[0]] }
    case 'ht_hieu_hai_y': { const T = N[0].div(abs(hieuDK(Pc[0]))); const A = T.mul(Pc[0]); return { kq: [T, A, T.sub(A)] } }
    case 'ht_hieu_hai_pt': { if (!(Pc[1].lt(Pc[0]))) throw new Error('phần trăm hiệu sai thứ tự'); return { kq: N[0].div(Pc[0].sub(Pc[1])), nguyenCan: [Pc[0], Pc[1]] } }
    case 'ht_hieu_hai_pt_phan': { if (!(Pc[1].lt(Pc[0]))) throw new Error('phần trăm hiệu sai thứ tự'); const T = N[0].div(Pc[0].sub(Pc[1])); return { kq: T.mul(Pc[0]), nguyenCan: [Pc[0], Pc[1]], T } }
    case 'ht_tong_hai_pt': return { kq: N[0].div(Pc[0].add(Pc[1])), nguyenCan: [Pc[0], Pc[1]] }
    case 'ht_bang_nhau_them': { const b = Pc[0]; const e = b.mul(new F(2n)).sub(ONE); if (!(ZERO.lt(e)) || !(N[1].lt(N[0]))) throw new Error('điều kiện b>50% và nữ thêm > nam thêm'); const Tc = N[0].sub(N[1]).div(e); return { kq: Tc.sub(N[0]).sub(N[1]) } }
    case 'ht_sau_them_hoi_dau': { const T = N[1].div(abs(hieuDK(Pc[0]))); return { kq: T.sub(N[0]), nguyenCan: [Pc[0]], T } }
    case 'ht_dau_hoi_sau': { const T = N[0].div(abs(hieuDK(Pc[0]))); const bot = /chuyển đi/.test(d); if (!bot && !/nhận thêm/.test(d)) throw new Error('không rõ thêm hay bớt'); return { kq: bot ? T.sub(N[1]) : T.add(N[1]), nguyenCan: [Pc[0]], T } }
    case 'ht_tong_roi_them': return { kq: N[0].div(Pc[0].add(Pc[1])).add(N[1]), nguyenCan: [Pc[0], Pc[1]], T: N[0].div(Pc[0].add(Pc[1])) }
    default: throw new Error('mẫu lạ: ' + mau)
  }
}

const CALC = new Set(['NDB02767', 'NDB02768', 'NDB03000'])
const dauCongThuc = (t) => [...t.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])

function kiemKatexVaViet(chuoi, nhan, loi) {
  for (const e of dauCongThuc(chuoi)) {
    const warn = []; const o = console.warn; console.warn = (x) => warn.push(x)
    try { katex.renderToString(e, { throwOnError: true, strict: 'warn' }) } catch (er) { warn.push(er.message) }
    console.warn = o
    if (warn.length) loi.push(`KaTeX (${nhan}): ${e.slice(0, 50)} | ${String(warn[0]).slice(0, 60)}`)
    if (/[À-ỹ]/.test(e.replace(/\\text\{[^}]*\}/g, ''))) loi.push(`chữ Việt trong công thức (${nhan}): ${e.slice(0, 50)}`)
  }
}
const soTrong = (t) => { const kq = []; for (const e of dauCongThuc(t)) for (const m of e.replace(/\\text\{[^}]*\}/g, '').matchAll(/\d+(?:,\d+)?/g)) kq.push(so(m[0])); return kq }
const co = (tap, v) => tap.some((x) => x.eq(v))

export function kiemCau(c) {
  const loi = []
  const nd = c.noi_dung ?? '', lg = c.loi_giai ?? '', da = (c.dap_an ?? '').trim()
  if (c.loai_cau !== 'tra_loi_ngan') loi.push('loai_cau phải là tra_loi_ngan')
  if (!/^NDB\d{5}$/.test(c.dang ?? '')) loi.push('thiếu dang')
  const i2 = lg.indexOf('**Phần 2. Trình bày**')
  if (i2 < 0) { loi.push('thiếu Phần 2'); return loi }
  const p1 = lg.slice(0, i2).trim(), p2 = lg.slice(i2).replace('**Phần 2. Trình bày**', '').trim().split(/\n\n/)
  const tinh = CALC.has(c.dang)
  const so2 = []   // các số nằm trong công thức của Phần 2
  for (const dong of p2) for (const v of soTrong(dong)) so2.push(v)

  if (tinh) {
    // ── bài tính ───────────────────────────────────────────────────────────────────────────────────────────────
    const ct = dauCongThuc(nd); if (!ct.length) { loi.push('đề không có biểu thức $…$'); return loi }
    if (/Bài giải|Đáp số:/.test(p2.join('\n'))) loi.push('bài tính: Phần 2 chỉ các dòng biến đổi (không "Bài giải" / "Đáp số")')
    try {
      if (c.dang !== DANG_DOI) {
        // 02767 / 02768: biểu thức = công thức đề
        const expr = ct[0].replace(/\s+/g, ''), gt = tinhBt(ct[0]); const dong1 = dauCongThuc(p2[0])[0]
        if (dong1?.replace(/\s+/g, '') !== expr) loi.push('dòng 1 Phần 2 phải chép nguyên biểu thức của đề')
        // chuỗi toàn bài: nối các dòng "$=…$" với dòng trước
        let vesAll = []
        for (const dong of p2) for (const e of dauCongThuc(dong)) vesAll.push(...veChuoi(e).filter((x) => x !== '').map(tinhBt))
        if (vesAll.length < 3) loi.push('Phần 2 quá ngắn (cần ít nhất một bước biến đổi)')
        for (let k = 0; k < vesAll.length; k++) if (!vesAll[k].eq(gt)) { loi.push(`vế thứ ${k + 1} của Phần 2 ≠ giá trị biểu thức đề (${vesAll[k].so} ≠ ${gt.so})`); break }
        const yc = /dưới dạng phần trăm/.test(nd) ? 'pt' : /dưới dạng số thập phân/.test(nd) ? 'td' : 'so'
        const gtDa = dauCongThuc(da).length ? tinhBt(dauCongThuc(da)[0]) : null
        if (!gtDa) loi.push('dap_an phải nằm trong $…$')
        else {
          if (!gtDa.eq(gt)) loi.push(`dap_an ${da} ≠ tính lại từ đề (${gt.so})`)
          if (yc === 'pt' && !cobPct(da)) loi.push('đề yêu cầu phần trăm mà dap_an không có \\%')
          if (yc === 'td' && cobPct(da)) loi.push('đề yêu cầu số thập phân mà dap_an còn \\%')
        }
        if (c.dang === 'NDB02768') { if (!/\(/.test(p2.join(' '))) loi.push('tính thuận tiện: Phần 2 phải có bước nhóm trong ngoặc') }
      } else {
        // 03000: đổi
        const dich = [...nd.matchAll(/(?:dưới dạng|thành|ra)\s+(tỉ số phần trăm|phân số tối giản|số thập phân)/g)].at(-1)?.[1]
        if (!dich) throw new Error('không đọc được dạng đích của đề')
        const muc = ct[0].replace(/\\[ ,;]/g, ' ').split(';').map((x) => x.trim().replace(/\\ /g, '').replace(/\s+/g, ''))
        const dans = da.split(/;\s*(?=\$)/).map((x) => x.trim())
        if (dans.length !== muc.length) loi.push(`số mục đáp án ${dans.length} ≠ số mục đề ${muc.length}`)
        muc.forEach((m, k) => {
          const gt = tinhBt(m), a = dans[k] ?? ''; const a1 = dauCongThuc(a)[0]; if (!a1) { loi.push(`mục ${k + 1}: đáp án không nằm trong $…$`); return }
          if (!tinhBt(a1).eq(gt)) loi.push(`mục ${k + 1}: đáp án ${a} ≠ tính lại từ đề (${gt.so})`)
          if (dich === 'tỉ số phần trăm' && !/\\%$/.test(a1)) loi.push(`mục ${k + 1}: đích là phần trăm mà đáp án không kết thúc bằng \\%`)
          if (dich === 'số thập phân' && /\\%|\\dfrac/.test(a1)) loi.push(`mục ${k + 1}: đích là số thập phân mà đáp án còn \\% hoặc phân số`)
          if (dich === 'phân số tối giản') { const mm = /^\\dfrac\{(\d+)\}\{(\d+)\}$/.exec(a1); if (!mm) loi.push(`mục ${k + 1}: đáp án phải là \\dfrac{p}{q}`); else if (gcd(BigInt(mm[1]), BigInt(mm[2])) !== 1n || mm[2] === '1') loi.push(`mục ${k + 1}: phân số chưa tối giản`) }
        })
        // Phần 2: từng dòng; mọi vế trong một $…$ bằng nhau, và bằng giá trị của một mục đề; chuỗi cuối = đáp án mục đó
        const dongs = p2.filter((x) => /\$/.test(x)); if (dongs.length !== muc.length) loi.push(`số dòng Phần 2 ${dongs.length} ≠ số mục ${muc.length}`)
        dongs.forEach((dg, k) => {
          const e = dauCongThuc(dg)[0]; const ves = veChuoi(e), gts = ves.map(tinhBt)
          if (muc[k] && ves[0].replace(/\s+/g, '') !== muc[k]) loi.push(`dòng ${k + 1} Phần 2 phải mở bằng chính số của đề (${muc[k]})`)
          for (let t = 1; t < gts.length; t++) if (!gts[t].eq(gts[0])) { loi.push(`sai số học dòng ${k + 1}: $${e.slice(0, 60)}$ (vế ${t + 1} ≠ vế 1)`); break }
          const cuoiStr = ves.at(-1).replace(/\s+/g, ''); const daK = dauCongThuc(dans[k] ?? '')[0]?.replace(/\s+/g, '')
          if (daK && cuoiStr !== daK) loi.push(`dòng ${k + 1}: vế cuối "${cuoiStr}" ≠ đáp án "${daK}"`)
          if (muc.length > 1 && !new RegExp(`^${'abcd'[k]}\\)`).test(dg.trim())) loi.push(`dòng ${k + 1} phải mở bằng "${'abcd'[k]})"`)
        })
      }
    } catch (e) { loi.push('không tính lại được: ' + e.message) }
  } else {
    // ── bài lời văn ───────────────────────────────────────────────────────────────────────────────────────────
    try {
      const { kq, pct, nguyenCan, T } = kyVong(c)
      const ds = dapAnSo(da)
      if (Array.isArray(kq)) { if (ds.length !== kq.length || kq.some((x, k) => !x.eq(ds[k]))) loi.push(`dap_an ${da} ≠ tính lại [${kq.map((x) => x.so).join('; ')}]`) }
      else {
        if (!ds.length || !(pct ? pc(ds[0]).eq(kq) : ds[0].eq(kq))) loi.push(`dap_an ${da} ≠ tính lại từ đề (${pct ? kq.so * 100 + '%' : kq.so})`)
        if (pct && !cobPct(da)) loi.push('đáp số phần trăm mà dap_an không có \\%')
        if (!pct && cobPct(da)) loi.push('đáp số không phải phần trăm mà dap_an có \\%')
      }
      for (const x of (Array.isArray(kq) ? kq : [kq])) if (!pct && !x.nguyen && !/\$A=/.test(da) && !/(kg|lít|m|km|tạ|tấn|cm)/.test(da)) loi.push('đáp số đếm người/vật mà không nguyên: ' + x.so)
      for (const x of (Array.isArray(kq) ? kq : [])) if (!x.nguyen) loi.push('một đáp số đếm không nguyên: ' + x.so)
      if (!Array.isArray(kq) && c.mau.startsWith('ht_') && !kq.nguyen) loi.push('đáp số đếm không nguyên: ' + kq.so)
      if (nguyenCan && T === undefined) { const Tt = Array.isArray(kq) ? kq[0] : kq; for (const p of nguyenCan) if (!Tt.mul(p).nguyen) loi.push(`số phần của bộ phận (${Tt.so}×${p.so * 100}%) không nguyên`) }
      if (nguyenCan && T !== undefined) { if (!T.nguyen) loi.push('tổng trung gian không nguyên'); for (const p of nguyenCan) if (!T.mul(p).nguyen) loi.push('một bộ phận không nguyên') }
      // số của đề phải có mặt trong Phần 2
      for (const x of docSo(nd)) if (!co(so2, x.v)) loi.push(`số ${x.v.so}${x.pct ? '%' : ''} của đề không xuất hiện trong Phần 2`)
    } catch (e) { loi.push('không tính lại được: ' + e.message) }
    // Phần 2: Bài giải … Đáp số
    if (p2[0] !== 'Bài giải') loi.push('Phần 2 phải mở bằng "Bài giải"')
    const cuoi = p2.at(-1)
    if (!cuoi.startsWith('Đáp số: ')) loi.push('Phần 2 phải kết bằng "Đáp số: …"')
    else if (cuoi.slice(8).trim() !== da) loi.push(`Đáp số cuối "${cuoi.slice(8)}" ≠ dap_an "${da}"`)
    let chuoiCuoi = null
    for (const dong of p2.slice(1, -1)) for (const e of dauCongThuc(dong)) {
      if (!e.includes('=')) continue
      try { const gt = gtChuoi(e); for (let k = 1; k < gt.length; k++) if (!gt[k].eq(gt[0])) { loi.push(`sai số học: $${e.slice(0, 70)}$ (vế ${k + 1} ≠ vế 1)`); break } chuoiCuoi = gt.at(-1) } catch (er) { loi.push(`không tính được $${e.slice(0, 50)}$: ${er.message}`) }
    }
    if (chuoiCuoi && !/^a\)/.test(da) && dapAnSo(da).length === 1) { const dv = dapAnSo(da)[0]; if (!(chuoiCuoi.eq(dv) || chuoiCuoi.eq(pc(dv)))) loi.push('chuỗi tính cuối của Phần 2 ≠ dap_an') }
    if (chuoiCuoi && /^a\)/.test(da)) { const ds = dapAnSo(da); if (!(chuoiCuoi.eq(ds.at(-1)))) loi.push('chuỗi tính cuối của Phần 2 ≠ số cuối của dap_an') }
  }
  // ── hình thức chung ───────────────────────────────────────────────────────────────────────────────────────────
  for (const l of kiemP1(p1)) loi.push('Phần 1: ' + l)
  // số trong Mấu chốt / Bước thuộc đề ∪ Phần 2 ∪ hằng chung
  const moLuan = p1.split(/\n\n/).filter((x) => /^\*\*(Mấu chốt|Bước)/.test(x)).join('\n')
  const hang = [0, 1, 2, 10, 100, 1000].map((x) => new F(BigInt(x))); const duocPhep = [...so2, ...docSo(nd).map((x) => x.v), ...dauCongThuc(nd).flatMap((e) => soTrong('$' + e + '$')), ...hang]
  for (const v of soTrong(moLuan)) if (!co(duocPhep, v)) { loi.push(`Phần 1 có số ${v.so} không thuộc đề / Phần 2`); break }
  kiemKatexVaViet(nd, 'đề', loi); kiemKatexVaViet(lg, 'lời giải', loi); kiemKatexVaViet(da, 'dap_an', loi)
  if (/[⇒⇔∈∀≤≥]/.test(lg + nd)) loi.push('ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥)')
  if (/\\div|\\cdot|\\frac/.test(lg + nd)) loi.push('dùng \\div / \\cdot / \\frac (phải \\times, dấu :, \\dfrac)')
  if (/(\d)\.(\d)/.test(nd.replace(/\$[^$]*\$/g, '')) || /\d\.\d/.test(da)) loi.push('số thập phân phải dùng dấu phẩy')
  if (/e[+-]\d|\d{9,}/.test(lg + nd + da)) loi.push('số xấu (dấu phẩy động) trong văn bản')
  if (!nd.trim() || !da) loi.push('đề hoặc đáp án rỗng')
  return loi
}
const DANG_DOI = 'NDB03000'

export const chuan = (s) => s.toLowerCase().replace(/\s+/g, '')
const bt1 = (nd) => { const m = nd.match(/\$([^$]+)\$/); return m ? chuan(m[1]) : null }

// ── tự thử: cố tình làm hỏng rồi xem bộ kiểm có bắt không ───────────────────────────────────────────────────────
function tuThu(cau) {
  let bat = 0, tong = 0; const khong = []
  const suaChuSo = (s) => { const k = [...s.matchAll(/\d/g)].filter((m) => m[0] !== '0' && !/[A-Za-z]/.test(s[m.index + 1] ?? '')); if (!k.length) return null; const m = k[k.length - 1]; const moi = String((Number(m[0]) % 9) + 1); return s.slice(0, m.index) + moi + s.slice(m.index + 1) }
  for (const c of cau) {
    const thu = []
    // (1) đổi 1 chữ số của đáp số
    { const dm = suaChuSo(c.dap_an); if (dm && dm !== c.dap_an) thu.push(['đáp số', { ...c, dap_an: dm }]) }
    // (2) đổi 1 chữ số trong một dòng Phần 2 (vế cuối của một chuỗi có dấu =)
    { const i2 = c.loi_giai.indexOf('**Phần 2. Trình bày**'); const ph1 = c.loi_giai.slice(0, i2), ph2 = c.loi_giai.slice(i2)
      const ms = [...ph2.matchAll(/\$([^$]*=[^$]*)\$/g)]
      if (ms.length) { const m = ms[Math.floor(ms.length / 2)]; const e = m[1]; const j = e.lastIndexOf('='); const dm = suaChuSo(e.slice(j + 1)); if (dm) thu.push(['dòng Phần 2', { ...c, loi_giai: ph1 + ph2.slice(0, m.index) + '$' + e.slice(0, j + 1) + dm + '$' + ph2.slice(m.index + m[0].length) }]) } }
    // (3) đổi 1 chữ số của một số trong đề (đáp án giữ nguyên)
    { const dm = suaChuSo(c.noi_dung); if (dm && dm !== c.noi_dung) thu.push(['số trong đề', { ...c, noi_dung: dm }]) }
    for (const [nhan, cm] of thu) { tong++; let l = []; try { l = kiemCau(cm) } catch (e) { l = ['ném lỗi'] } if (l.length) bat++; else khong.push(`${c.dang}/${c.mau} [${nhan}]`) }
  }
  return { bat, tong, khong }
}

// ── CLI ─────────────────────────────────────────────────────────────────────────────────────────────────────────
async function docDB() {
  const pg = require('pg'); const envp = 'C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/.env'; if (!existsSync(envp)) return []
  const env = readFileSync(envp, 'utf8'); const m = env.match(/^DATABASE_URL_RO=(.*)$/m) || env.match(/^DATABASE_URL=(.*)$/m); if (!m) return []
  const cl = new pg.Client({ connectionString: m[1].trim().replace(/^["']|["']$/g, ''), ssl: { rejectUnauthorized: false } }); await cl.connect()
  try { const r = await cl.query(`select c.noi_dung from bdm_cau_dang d join dai_cau_hoi c on c.ma_cau=d.ma_cau where d.dang_bai_id = any($1) and c.xoa_at is null`, [['NDB02767', 'NDB02768', 'NDB02769', 'NDB02770', 'NDB03000', 'NDB03001', 'NDB03553']]); return r.rows.map((x) => x.noi_dung) } finally { await cl.end() }
}
if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-A-kiem.mjs')) {
  const a = process.argv.slice(2); const file = a.find((x) => !x.startsWith('--')); const cau = JSON.parse(readFileSync(file, 'utf8'))
  let hong = 0; const dem = {}
  for (const c of cau) { dem[c.dang] = (dem[c.dang] ?? 0) + 1; const l = kiemCau(c); if (l.length) { hong++; console.log(`✘ [${c.dang}/${c.mau}] ${c.noi_dung.slice(0, 90).replace(/\n/g, ' ')}\n    ${l.join('\n    ')}`) } }
  const seen = new Map(); let trung = 0
  for (const c of cau) { const ks = [chuan(c.noi_dung), CALC.has(c.dang) ? 'bt:' + bt1(c.noi_dung) : null].filter(Boolean); for (const k of ks) { if (seen.has(k)) { trung++; console.log('✘ trùng nội bộ:', c.noi_dung.slice(0, 70).replace(/\n/g, ' ')) ; break } seen.set(k, 1) } }
  let trungDB = 0
  if (a.includes('--db')) { const db = await docDB(); const kdb = new Set(db.flatMap((x) => [chuan(x), 'bt:' + (bt1(x) ?? '')])); for (const c of cau) if (kdb.has(chuan(c.noi_dung)) || (CALC.has(c.dang) && bt1(c.noi_dung) && kdb.has('bt:' + bt1(c.noi_dung)))) { trungDB++; console.log('✘ trùng kho:', c.noi_dung.slice(0, 70).replace(/\n/g, ' ')) } console.log(`(đối chiếu ${db.length} câu trong kho)`) }
  console.log(`${cau.length} câu · hỏng ${hong} · trùng nội bộ ${trung}${a.includes('--db') ? ` · trùng kho ${trungDB}` : ''}`); console.log('  theo dạng:', JSON.stringify(dem))
  let tuThuLoi = 0
  if (a.includes('--tu-thu')) {
    const r = tuThu(cau); console.log(`TỰ THỬ: cố tình sửa sai ${r.tong} chỗ (đáp số · dòng Phần 2 · số trong đề) → bộ kiểm BẮT ${r.bat}/${r.tong}`)
    if (r.khong.length) { tuThuLoi = r.khong.length; console.log('  KHÔNG BẮT:', r.khong.slice(0, 20).join(' | ')) } else console.log('  bắt hết')
  }
  process.exit(hong || trung || trungDB || tuThuLoi ? 1 : 0)
}
