// ============================================================================
// k5T-pt-fill-C-kiem.mjs — BỘ KIỂM ĐỘC LẬP cho lô fill "C" (k5T-pt-fill-C.mjs). KHÔNG import hàm tính của bộ sinh:
//   ① ĐỌC CHỮ CỦA ĐỀ (khối lượng, phần trăm, tiền, số kỳ, dãy tăng/giảm) rồi tính lại đáp số bằng PHÂN SỐ BigInt, đối chiếu `dap_an`
//   ② mọi biểu thức `$a=b=c$` trong lời giải (cả Phần 1 lẫn Phần 2): máy tính tất cả vế, các vế phải bằng nhau
//   ③ "Đáp số:" cuối Phần 2 = `dap_an` · Phần 2 mở "Bài giải" · Phần 1 card 3–6 bước (kiem-p1-card.mjs) · KaTeX
//   ④ không ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥ \div \cdot \frac), không dấu chấm thập phân, tiền là bội của 1000, không trùng đề (trong lô + kho 5T)
//   node scripts/kho/clone/k5T-pt-fill-C-kiem.mjs kho-rules/dai/clone/k5T-pt-fill-C.json [--khong-db]
//   node scripts/kho/clone/k5T-pt-fill-C-kiem.mjs kho-rules/dai/clone/k5T-pt-fill-C.json --tu-thu     (cố tình sửa sai ⇒ bộ kiểm PHẢI bắt)
// ============================================================================
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { kiemP1 } from '../sach/kiem-p1-card.mjs'

// ── phân số ───────────────────────────────────────────────────────────────────────────────────────────────────────
const g_ = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) [a, b] = [b, a % b]; return a }
class F {
  constructor(n, d = 1n) { if (d === 0n) throw new Error('chia 0'); if (d < 0n) { n = -n; d = -d } const k = g_(n, d) || 1n; this.n = n / k; this.d = d / k }
  p(o) { return new F(this.n * o.d + o.n * this.d, this.d * o.d) }
  m(o) { return new F(this.n * o.d - o.n * this.d, this.d * o.d) }
  x(o) { return new F(this.n * o.n, this.d * o.d) }
  c(o) { return new F(this.n * o.d, this.d * o.n) }
  eq(o) { return this.n === o.n && this.d === o.d }
}
const so = (s) => { const t = String(s).replace(/\s+/g, '').replace(',', '.'); const [a, b = ''] = t.split('.'); return new F(BigInt(a + b), 10n ** BigInt(b.length)) }
const f1 = new F(1n), f100 = new F(100n), f0 = new F(0n)
const ph = (s) => so(s).c(f100)                      // "4,5" (%) → 9/200
const tp = (x) => x.x(f100)                          // phân số → số phần trăm

// ── máy tính biểu thức: số, \%, \times, :, +, - ───────────────────────────────────────────────────────────────────
function tinh(expr) {
  const t = expr.replace(/\\times/g, '×').replace(/\\%/g, '%').replace(/\s+/g, '')
  const tok = []; const re = /(\d+(?:,\d+)?)(%?)|([×:+\-])/g; let m, vi = 0
  while ((m = re.exec(t))) { if (m.index !== vi) throw new Error('ký tự lạ: ' + t.slice(vi, m.index)); vi = re.lastIndex; tok.push(m[3] ? m[3] : (m[2] ? ph(m[1]) : so(m[1]))) }
  if (vi !== t.length) throw new Error('ký tự lạ ở cuối: ' + t.slice(vi))
  const hang = []; let cur = null, op = null
  for (const x of tok) {
    if (typeof x === 'string') { if (x === '×' || x === ':') op = x; else { hang.push(cur, x); cur = null; op = null } continue }
    if (cur === null) cur = x; else if (op === '×') { cur = cur.x(x); op = null } else if (op === ':') { cur = cur.c(x); op = null } else throw new Error('thiếu toán tử')
  }
  hang.push(cur)
  let kq = hang[0]; for (let i = 1; i < hang.length; i += 2) kq = hang[i] === '+' ? kq.p(hang[i + 1]) : kq.m(hang[i + 1])
  return kq
}

// ── đọc chữ của đề ────────────────────────────────────────────────────────────────────────────────────────────────
const khoiLuong = (d) => [...d.matchAll(/(\d+(?:,\d+)?) (g|kg|tấn)(?![\p{L}])/gu)].map((m) => ({ v: so(m[1]), u: m[2] }))
const phanTram = (d) => [...d.matchAll(/(\d+(?:,\d+)?)%/g)].map((m) => so(m[1]))                    // số phần trăm (chưa chia 100)
const tiens = (d) => [...d.matchAll(/(\d{1,3}(?: \d{3})+|\d+) đồng/g)].map((m) => so(m[1]))
const dayTG = (d) => [...d.matchAll(/(tăng|giảm) (\d+(?:,\d+)?)%/g)].map((m) => ({ w: m[1], a: so(m[2]) }))
const soLuong = (d) => { const m = d.match(/(\d{1,3}(?: \d{3})+|\d+) (người|tấn|lượt khách|chiếc xe máy|quyển sách)(?![\p{L}])/u); return m ? { v: so(m[1]), u: m[2] } : null }
const sdau = (w, a) => (w === 'tăng' ? f100.p(a) : f100.m(a))                                         // 100%±a%  (đơn vị %)

/** trả { kieu, ... } kỳ vọng */
function kyVong(c) {
  const d = c.noi_dung, M = khoiLuong(d), Pc = phanTram(d), mau = c.mau, v = (i) => M[i].v, u0 = M[0]?.u
  const pt = (x) => ({ kieu: 'pct', v: x })                  // x: phân số THẬT (0,045)
  const ks = (x) => ({ kieu: 'kl', v: x, u: u0 })
  const hon = (i) => ph(String(Pc[i].n)).c(f1)                // không dùng
  const pc = (i) => Pc[i].c(f100)                             // Pc[i] % → phân số thật
  switch (mau) {
    case 'tr_a': return pt(v(0).x(pc(0)).p(v(1).x(pc(1))).c(v(0).p(v(1))))
    case 'tr_b': return pt(v(0).x(pc(0)).p(v(1).x(pc(1))).p(v(2).x(pc(2))).c(v(0).p(v(1)).p(v(2))))
    case 'tr_e': { const m2 = v(0).x(pc(2)); return pt(v(0).x(pc(0)).p(m2.x(pc(1))).c(v(0).p(m2))) }
    case 'tr_f': return pt(f1.m(v(0).x(pc(0)).p(v(1).x(pc(1))).c(v(0).p(v(1)))))
    case 'ng_a': { const T = v(0), m1 = v(1); return pt(T.x(pc(0)).m(m1.x(pc(1))).c(T.m(m1))) }
    case 'ng_g': { const m1 = v(0), m2 = v(1); return pt(m1.p(m2).x(pc(1)).m(m1.x(pc(0))).c(m2)) }
    case 'ng_b': case 'ng_h': {
      const a = Pc[0], b = Pc[1], m = Pc[2], ab = (x) => (x.n < 0n ? new F(-x.n, x.d) : x)
      const Y = v(0).x(ab(m.m(a))).c(ab(b.m(m))); return ks(mau === 'ng_h' ? v(0).p(Y) : Y)
    }
    case 'ng_c': { const T = v(0), a = Pc[0], b = Pc[1], m = Pc[2]; const Y = T.x(m.m(a)).c(b.m(a)); return { kieu: 'hai', a, b, X: T.m(Y), Y, u: u0 } }
    case 'pl_a': return pt(v(0).x(pc(0)).c(v(0).p(v(1))))
    case 'pl_b': return ks(v(0).x(Pc[0]).c(Pc[1]).m(v(0)))
    case 'pl_c': return pt(v(0).x(pc(0)).c(v(0).m(v(1))))
    case 'pl_d': return ks(v(0).m(v(0).x(Pc[0]).c(Pc[1])))
    case 'pl_e': return pt(v(0).x(pc(0)).p(v(1)).c(v(0).p(v(1))))
    case 'pl_f': { const T = v(0).x(f100.m(Pc[0])).c(f100.m(Pc[1])); return ks(T.m(v(0))) }
    case 'pl_g': return ks(v(0).c(Pc[0].c(Pc[1]).m(f1)))
    case 'pl_h': return ks(v(0).c(f1.m(Pc[0].c(Pc[1]))))
    case 'hk_a': return ks(v(0).x(f100.m(Pc[0])).c(f100.m(Pc[1])))
    case 'hk_b': return ks(v(0).x(f100.m(Pc[1])).c(f100.m(Pc[0])))
    case 'hk_c': return ks(v(0).m(v(0).x(f100.m(Pc[0])).c(f100.m(Pc[1]))))
    case 'hk_d': return pt(f1.m(v(0).x(f100.m(Pc[0])).c(f100).c(v(1))))
    case 'hk_e': return pt(f1.m(v(0).x(f100.m(Pc[0])).c(f100).c(v(0).m(v(1)))))
    case 'hk_f': return pt(f1.m(v(1).x(f100.m(Pc[0])).c(f100).c(v(0))))
    case 'hk_g1': return pt(f100.m(Pc[0]).c(f100.m(Pc[1])))
    case 'hk_g2': return pt(f1.m(f100.m(Pc[0]).c(f100.m(Pc[1]))))
    case 'tg_a': case 'tg_c1': {
      const s = dayTG(d); let acc = f1; for (const x of s) acc = acc.x(sdau(x.w, x.a).c(f100))
      const ch = acc.m(f1), neg = ch.n < 0n; return { kieu: 'huong', tang: !neg, v: neg ? new F(-ch.n, ch.d) : ch }
    }
    case 'tg_b': case 'tg_c2': { const s = dayTG(d); let acc = tiens(d)[0]; for (const x of s) acc = acc.x(sdau(x.w, x.a)).c(f100); return { kieu: 'tien', v: acc } }
    case 'tg_d': { const s = dayTG(d), q = soLuong(d); let acc = q.v; for (const x of s) acc = acc.x(sdau(x.w, x.a)).c(f100); return { kieu: 'sl', v: acc, u: q.u } }
    case 'tg_e': { const s = dayTG(d); let acc = f1; for (const x of s) acc = acc.x(sdau(x.w, x.a).c(f100)); return { kieu: 'tien', v: tiens(d)[0].c(acc) } }
    case 'tg_f': { const x = dayTG(d)[0], a = x.a; return x.w === 'tăng' ? { kieu: 'huong', tang: false, v: a.c(f100.p(a)) } : { kieu: 'huong', tang: true, v: a.c(f100.m(a)) } }
    case 'ls_a1': case 'ls_a2': {
      const T = tiens(d)[0], r = Pc[0].c(f100), n = so(d.match(/sau (\d+) năm/)[1]), L = T.x(r).x(n)
      const lai = !/cả gốc lẫn lãi|cả vốn lẫn lãi/.test(d); if (lai !== (mau === 'ls_a1')) throw new Error('mẫu ' + mau + ' không khớp câu hỏi (lãi / cả gốc lẫn lãi)')
      return { kieu: 'tien', v: lai ? L : T.p(L) }
    }
    case 'ls_b': { const T = tiens(d)[0], r = Pc[0].c(f100), n = so(d.match(/(?:sau|kỳ hạn) (\d+) tháng/)[1]); return { kieu: 'tien', v: T.p(T.x(r).x(n)) } }
    case 'ls_c': {
      const T = tiens(d)[0], r = Pc[0].c(f100), n = so(d.match(/kỳ hạn (\d+) tháng/)[1]), L = T.x(r).x(n).c(so(12))
      return { kieu: 'tien', v: /cả gốc lẫn lãi/.test(d) ? T.p(L) : L }
    }
    case 'ls_d': case 'ls_e': {
      const T = tiens(d)[0], r = Pc[0].c(f100), n = Number(d.match(/sau (\d+) (?:tháng|năm)/)[1]); let acc = T; for (let i = 0; i < n; i++) acc = acc.x(f1.p(r))
      if ((mau === 'ls_d') !== (n === 2)) throw new Error('mẫu ' + mau + ' không khớp số kỳ ' + n)
      return { kieu: 'tien', v: acc }
    }
    case 'ls_f': return { kieu: 'tien', v: tiens(d)[0].c(Pc[0].c(f100)) }
    case 'ls_g': return { kieu: 'tien', v: tiens(d)[0].c(f1.p(Pc[0].c(f100))) }
    case 'ls_h1': { const t = tiens(d); return pt(t[1].c(t[0])) }
    case 'ls_h2': { const t = tiens(d); return pt(t[1].m(t[0]).c(t[0])) }
    default: throw new Error('mẫu lạ: ' + mau)
  }
}
const so0 = (s) => so(s.replace(/\\,/g, ''))
/** đối chiếu dap_an với kỳ vọng; trả mảng lỗi */
function soDapAn(da, kv) {
  const L = []; let m
  const eq = (x, y, nhan) => { if (!x.eq(y)) L.push(`đáp án ${nhan} = ${da} ≠ tính lại từ đề (${Number(y.n) / Number(y.d)})`) }
  switch (kv.kieu) {
    case 'pct': if (!(m = da.match(/^\$(\d+(?:,\d+)?)\\%\$$/))) L.push('dap_an phải dạng $x\\%$: ' + da); else eq(ph(m[1]), kv.v, 'phần trăm'); break
    case 'kl': if (!(m = da.match(/^\$(\d+(?:,\d+)?)\$ (g|kg|tấn)$/))) L.push('dap_an phải dạng $x$ đơn vị: ' + da); else { eq(so(m[1]), kv.v, 'khối lượng'); if (m[2] !== kv.u) L.push(`đơn vị đáp án ${m[2]} ≠ đơn vị đề ${kv.u}`) } break
    case 'tien': if (!(m = da.match(/^\$(\d+)\$ đồng$/))) L.push('dap_an phải dạng $N$ đồng: ' + da); else { eq(so(m[1]), kv.v, 'tiền'); if (!kv.v.eq(new F(kv.v.n / kv.v.d)) || kv.v.n % 1000n !== 0n || kv.v.d !== 1n) L.push('đáp án tiền không là số nguyên bội của 1000') } break
    case 'sl': if (!(m = da.match(/^\$(\d+)\$ (.+)$/))) L.push('dap_an phải dạng $N$ đơn vị: ' + da); else { eq(so(m[1]), kv.v, 'số lượng'); if (m[2] !== kv.u) L.push(`đơn vị ${m[2]} ≠ ${kv.u}`) } break
    case 'huong': if (!(m = da.match(/^(Tăng|Giảm) \$(\d+(?:,\d+)?)\\%\$$/))) L.push('dap_an phải dạng Tăng/Giảm $x\\%$: ' + da); else { if ((m[1] === 'Tăng') !== kv.tang) L.push(`hướng ${m[1]} sai (phải ${kv.tang ? 'Tăng' : 'Giảm'})`); eq(ph(m[2]), kv.v, 'phần trăm thay đổi') } break
    case 'hai': {
      if (!(m = da.match(/^Loại \$(\d+(?:,\d+)?)\\%\$: \$(\d+(?:,\d+)?)\$ (g|kg|tấn); loại \$(\d+(?:,\d+)?)\\%\$: \$(\d+(?:,\d+)?)\$ (g|kg|tấn)$/))) { L.push('dap_an hai loại sai dạng: ' + da); break }
      if (!so(m[1]).eq(kv.a) || !so(m[4]).eq(kv.b)) L.push('nhãn % hai loại trong đáp án không khớp đề')
      eq(so(m[2]), kv.X, 'loại thứ nhất'); eq(so(m[5]), kv.Y, 'loại thứ hai'); if (m[3] !== kv.u || m[6] !== kv.u) L.push('đơn vị đáp án sai')
      break
    }
  }
  return L
}
const dep = (x, k) => { let d = x.d, a = 0, b = 0; while (d % 2n === 0n) { d /= 2n; a++ } while (d % 5n === 0n) { d /= 5n; b++ } return d === 1n && Math.max(a, b) <= k }

export function kiemCau(c) {
  const loi = [], lg = c.loi_giai ?? '', d = c.noi_dung ?? ''
  try {
    const kv = kyVong(c)
    loi.push(...soDapAn(c.dap_an.trim(), kv))
    // số "đẹp": phần trăm đáp án ≤ 2 chữ số thập phân, khối lượng ≤ 1
    if (kv.kieu === 'pct' && !dep(tp(kv.v), 2)) loi.push('đáp số phần trăm không phải số thập phân gọn')
    if (kv.kieu === 'kl' && !dep(kv.v, 2)) loi.push('đáp số khối lượng không phải số thập phân gọn')
    if (kv.kieu === 'tien' && kv.v.d !== 1n) loi.push('đáp số tiền không nguyên')
  } catch (e) { loi.push('không tính lại được: ' + e.message) }
  if (c.loai_cau !== 'tra_loi_ngan') loi.push('loai_cau phải là tra_loi_ngan')
  for (const t of tiens(d)) if (t.d !== 1n || t.n % 1000n !== 0n) loi.push('số tiền trong đề không phải bội của 1000: ' + t.n)
  if (/undefined|NaN|null|\[object/.test(d + lg + c.dap_an)) loi.push('có undefined/NaN/null')
  if (/\d\.\d/.test(d + lg.replace(/\$[^$]*\$/g, (s) => s)) ) loi.push('dùng dấu chấm thập phân (phải dấu phẩy)')
  if (!/[?.]$/.test(d.trim())) loi.push('đề không kết bằng dấu ? hoặc .')
  if (d.length < 40) loi.push('đề quá ngắn / trần')
  // Phần 2
  const i2 = lg.indexOf('**Phần 2. Trình bày**')
  if (i2 < 0) { loi.push('thiếu Phần 2'); return loi }
  const p1 = lg.slice(0, i2).trim(), p2 = lg.slice(i2).replace('**Phần 2. Trình bày**', '').trim().split(/\n\n/)
  if (p2[0] !== 'Bài giải') loi.push('Phần 2 phải mở bằng "Bài giải"')
  const cuoi = p2[p2.length - 1]
  if (!cuoi.startsWith('Đáp số: ')) loi.push('Phần 2 phải kết bằng "Đáp số: …"')
  else if (cuoi.slice(8).trim() !== c.dap_an.trim()) loi.push(`Đáp số cuối "${cuoi.slice(8)}" ≠ dap_an "${c.dap_an}"`)
  // mọi biểu thức có dấu "=" (cả Phần 1 lẫn Phần 2): mọi vế bằng nhau
  for (const m of lg.matchAll(/\$([^$]+)\$/g)) {
    const e = m[1]; if (!e.includes('=')) continue
    try {
      const gt = e.split('=').map(tinh)
      for (let k = 1; k < gt.length; k++) if (!gt[k].eq(gt[0])) { loi.push(`sai số học: $${e}$ (vế ${k + 1} ≠ vế 1)`); break }
    } catch (er) { loi.push(`không tính được $${e}$: ${er.message}`) }
  }
  // dòng Phần 2 có tiền (đồng): mọi số nguyên ≥ 1000 là bội của 1000
  for (const dong of p2.slice(1, -1)) if (/\(đồng\)/.test(dong)) for (const m of dong.matchAll(/\$([^$]+)\$/g)) for (const n of m[1].match(/\d+/g) || []) if (n.length >= 4 && Number(n) % 1000 !== 0) loi.push('số tiền không bội của 1000 trong Phần 2: ' + n)
  // hình thức
  for (const l of kiemP1(p1)) loi.push('Phần 1: ' + l)
  if (/[⇒⇔∈∀≤≥]/.test(lg + d)) loi.push('ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥)')
  if (/\\div|\\cdot|\\frac|\\dfrac/.test(lg)) loi.push('dùng \\div / \\cdot / \\frac (phải \\times và dấu :)')
  if (/\b(phương trình|đặt ẩn|chuyển vế|số âm)\b/i.test(lg)) loi.push('từ ngữ cấm của tiểu học (phương trình / đặt ẩn / chuyển vế)')
  for (const m of lg.matchAll(/\$([^$]+)\$/g)) if (/(^|[^\\A-Za-z])[xyXY]([^A-Za-z]|$)/.test(m[1])) { loi.push('có ẩn x / y trong công thức: $' + m[1].slice(0, 40) + '$'); break }
  return loi
}

// ── tự thử: cố tình sửa sai ⇒ bộ kiểm PHẢI bắt ────────────────────────────────────────────────────────────────────
function doiChuSo(s) { const i = s.search(/\d/); if (i < 0) return null; const ch = s[i]; return s.slice(0, i) + String((Number(ch) + 1) % 10 || 1) + s.slice(i + 1) }
function tuThu(cau) {
  let bat = [0, 0, 0], tong = [0, 0, 0], tuongDuong = 0; const truot = []
  for (const c of cau) {
    // (1) đổi 1 chữ số trong dap_an VÀ dòng "Đáp số" (nhất quán, chỉ bộ tính lại từ đề mới bắt được)
    { const da = doiChuSo(c.dap_an); if (da) {
      tong[0]++
      const lg = c.loi_giai.replace(/Đáp số: .*$/s, 'Đáp số: ' + da)
      if (kiemCau({ ...c, dap_an: da, loi_giai: lg }).length) bat[0]++; else truot.push(`#1 ${c.mau}: ${c.dap_an} → ${da}`)
    } }
    // (2) sai 1 số trong một dòng Phần 2 (kết quả sau dấu = cuối cùng của một biểu thức, KHÔNG phải dòng Đáp số)
    { const i2 = c.loi_giai.indexOf('**Phần 2. Trình bày**'), ph2 = c.loi_giai.slice(i2)
      const ds = [...ph2.matchAll(/\$([^$]*=[^$]*)\$/g)]
      if (ds.length) {
        const m = ds[Math.floor(ds.length / 2)], e = m[1], k = e.lastIndexOf('='), duoi = e.slice(k + 1), moi = doiChuSo(duoi)
        if (moi && moi !== duoi) {
          tong[1]++
          const e2 = e.slice(0, k + 1) + moi
          const lg = c.loi_giai.slice(0, i2) + ph2.slice(0, m.index) + '$' + e2 + '$' + ph2.slice(m.index + m[0].length)
          if (kiemCau({ ...c, loi_giai: lg }).length) bat[1]++; else truot.push(`#2 ${c.mau}: $${e}$ → $${e2}$`)
        }
      } }
    // (3) sửa 1 số có nghĩa trong ĐỀ (khối lượng / phần trăm / tiền / số kỳ; đáp số + lời giải giữ nguyên). Đề đổi mà đáp số cũ vẫn đúng (đề tương đương) thì bỏ qua.
    { const toks = [...c.noi_dung.matchAll(/(\d+(?:,\d+)?)(?=(?:g|kg|tấn|đồng|người|lượt khách|chiếc xe máy|quyển sách|tháng|năm)(?![\p{L}])|%)/gu)]
      for (const t of toks.slice(0, 3)) {
        const i = t.index, ch = c.noi_dung[i], n2 = c.noi_dung.slice(0, i) + String((Number(ch) + 1) % 10 || 1) + c.noi_dung.slice(i + 1)
        let td = false; try { td = soDapAn(c.dap_an.trim(), kyVong({ ...c, noi_dung: n2 })).length === 0 } catch { td = false }
        if (td) { tuongDuong++; continue }
        tong[2]++; if (kiemCau({ ...c, noi_dung: n2 }).length) bat[2]++; else truot.push(`#3 ${c.mau}: ${t[0]} → ${n2.slice(i, i + t[0].length)}`)
      } }
  }
  const ten = ['đổi 1 chữ số đáp số (cả dap_an lẫn dòng Đáp số)', 'sai 1 số trong dòng Phần 2', 'sửa 1 số có nghĩa trong đề (đáp số giữ nguyên)']
  for (let k = 0; k < 3; k++) console.log(`${bat[k] === tong[k] ? 'bắt' : 'KHÔNG BẮT'}: ${ten[k]} — ${bat[k]}/${tong[k]}`)
  console.log(`   (bỏ qua ${tuongDuong} lần sửa đề mà đáp số cũ vẫn đúng — vd tr_e: đổi khối lượng loại đầu không đổi % hỗn hợp)`)
  for (const t of truot.slice(0, 20)) console.log('   trượt:', t)
  return bat.every((b, k) => b === tong[k])
}

// ── CLI ──────────────────────────────────────────────────────────────────────────────────────────────────────────
const chuanTxt = (s) => s.toLowerCase().replace(/\s+/g, '').replace(/[$\\{}]/g, '')
if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-fill-C-kiem.mjs')) {
  const a = process.argv.slice(2), file = a.find((x) => !x.startsWith('--'))
  const cau = JSON.parse(readFileSync(file, 'utf8'))
  if (a.includes('--tu-thu')) { const ok = tuThu(cau); process.exit(ok ? 0 : 1) }
  let hong = 0
  for (const c of cau) { const l = kiemCau(c); if (l.length) { hong++; console.log(`✘ [${c.dang} ${c.mau}] ${c.noi_dung.slice(0, 100)}\n    ${l.join('\n    ')}`) } }
  const seen = new Map(); let trung = 0
  for (const c of cau) { const k = chuanTxt(c.noi_dung); if (seen.has(k)) { trung++; console.log('✘ trùng nội bộ:', c.noi_dung.slice(0, 80)) } else seen.set(k, c) }
  let trungDB = 0, dbNote = 'bỏ qua (--khong-db)'
  if (!a.includes('--khong-db')) {
    try {
      const require = createRequire('C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/package.json'), pg = require('pg')
      const env = readFileSync('C:/Users/Admin/Desktop/BKERP/bkdemy-erp-v2/.env', 'utf8')
      const url = (env.match(/^DATABASE_URL_RO=(.*)$/m) || env.match(/^DATABASE_URL=(.*)$/m))[1].trim().replace(/^["']|["']$/g, '')
      const cl = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } }); await cl.connect()
      const r = await cl.query(`select ma_cau, noi_dung from dai_cau_hoi where ma_cau like 'T15T%' and xoa_at is null limit 20000`); await cl.end()
      const db = new Map(r.rows.map((x) => [chuanTxt(x.noi_dung ?? ''), x.ma_cau]))
      for (const c of cau) { const m = db.get(chuanTxt(c.noi_dung)); if (m) { trungDB++; console.log(`✘ trùng kho ${m}: ${c.noi_dung.slice(0, 80)}`) } }
      dbNote = `${r.rows.length} câu 5T trong kho`
    } catch (e) { dbNote = 'KHÔNG đọc được DB: ' + e.message.slice(0, 60) }
  }
  const dem = {}; for (const c of cau) { (dem[c.dang] ??= { n: 0, mau: new Set() }); dem[c.dang].n++; dem[c.dang].mau.add(c.mau) }
  for (const k of Object.keys(dem).sort()) console.log(' ', k, dem[k].n, 'câu ·', dem[k].mau.size, 'mẫu:', [...dem[k].mau].join(','))
  console.log(`${cau.length} câu · hỏng ${hong} · trùng nội bộ ${trung} · trùng kho ${trungDB} (${dbNote})`)
  process.exit(hong || trung || trungDB ? 1 : 0)
}
