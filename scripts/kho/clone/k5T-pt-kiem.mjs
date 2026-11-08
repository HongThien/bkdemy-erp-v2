// ============================================================================
// k5T-pt-kiem.mjs — BỘ KIỂM ĐỘC LẬP cho lô clone phần trăm 5T (k5T-pt-sinh.mjs). KHÔNG dùng chung hàm tính với bộ sinh:
//   ① đọc CHỮ CỦA ĐỀ (số tiền, phần trăm) và tính lại đáp số bằng PHÂN SỐ chính xác (BigInt) rồi đối chiếu `dap_an`
//   ② từng dòng Phần 2 có dấu "=": máy tính cả chuỗi `a=b=c`, mọi vế phải bằng nhau (bắt sai số học ở BƯỚC TRUNG GIAN, không chỉ đáp số)
//   ③ dòng "Đáp số:" cuối Phần 2 = `dap_an`
//   ④ hình thức Phần 1 card 3–6 bước (kiem-p1-card.mjs) · KaTeX · không ký hiệu cấm · mọi số tiền trong đề là bội của 1000
//   node scripts/kho/clone/k5T-pt-kiem.mjs kho-rules/dai/clone/k5T-pt-c1.json
// ============================================================================
import { readFileSync } from 'node:fs'
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
  get nguyen() { return this.d === 1n }
}
const so = (s) => { // "1 200 000" | "162,5" | "40"
  const t = s.replace(/\s+/g, '').replace(',', '.'); const [a, b = ''] = t.split('.')
  return new F(BigInt(a + b), 10n ** BigInt(b.length))
}
const ONE = new F(1n), HUN = new F(100n)
const pc = (x) => so(x).div(HUN)   // x% → x/100

// ── máy tính biểu thức trong $…$: số, \%, \times, :, +, - (không ngoặc) ───────────────────────────────────────────
function tinh(expr) {
  const t = expr.replace(/\\times/g, '×').replace(/\\%/g, '%').replace(/\s+/g, '')
  const tok = []
  const re = /(\d+(?:,\d+)?)(%?)|([×:+\-])/g; let m, vi = 0
  while ((m = re.exec(t))) { if (m.index !== vi) throw new Error('ký tự lạ: ' + t.slice(vi, m.index)); vi = re.lastIndex; tok.push(m[3] ? m[3] : (m[2] ? pc(m[1]) : so(m[1]))) }
  if (vi !== t.length) throw new Error('ký tự lạ ở cuối: ' + t.slice(vi))
  // × : trước, rồi + -
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
const pcts = (d) => [...d.matchAll(/(\d+(?:,\d+)?)%/g)].map((m) => pc(m[1]))
const hanh = (d) => d // giữ chỗ cho dễ đọc

/** đáp số kỳ vọng (phân số) tính LẠI từ chữ của đề. Trả về { kq: F, kieu: 'tien'|'pt'|'so' } */
function kyVong(c) {
  const d = c.noi_dung, M = tiens(d), Pc = pcts(d), mau = c.mau
  const bu = (x) => ONE.add(x), tru = (x) => ONE.sub(x)
  switch (mau) {
    case 'bh_gg_a': return { kq: M[0].div(bu(Pc[0])), kieu: 'tien' }
    case 'bh_gg_b': return { kq: M[0].div(Pc[0]), kieu: 'tien' }
    case 'bh_lai_a': return { kq: M[0].mul(Pc[0]), kieu: 'tien' }
    case 'bh_lai_b': return { kq: M[1].sub(M[0]), kieu: 'tien' }
    case 'bh_lai_c': return { kq: M[0].sub(M[0].div(bu(Pc[0]))), kieu: 'tien' }
    case 'bh_gb_a': return { kq: M[0].mul(bu(Pc[0])), kieu: 'tien' }
    case 'bh_gb_b': return { kq: M[0].add(M[1]), kieu: 'tien' }
    case 'bh_gb_c': { const n = so(d.match(/nhập (\d+) /)[1]); return { kq: n.mul(M[0]).mul(bu(Pc[0])), kieu: 'tien' } }
    case 'bh_tl_a': { const [G, B] = M[0].n * M[1].d < M[1].n * M[0].d ? [M[0], M[1]] : [M[1], M[0]]; return { kq: B.sub(G).div(G), kieu: 'pt' } }   // lãi: giá bán > giá gốc; đề có thể nêu giá bán trước
    case 'bh_tl_b': return { kq: M[1].div(M[0]), kieu: 'pt' }
    case 'bh_tl_c': return { kq: M[1].div(M[0].sub(M[1])), kieu: 'pt' }
    case 'bh_tb_a': { const m = d.match(/nhập (?:về )?(\d+) .*?bán được (\d+) /); return { kq: so(m[2]).div(so(m[1])), kieu: 'pt' } }
    case 'bh_tb_b': { const N = so(d.match(/nhập (\d+) /)[1]); return { kq: N.mul(Pc[0]).mul(M[0]), kieu: 'tien' } }
    case 'bh_tb_c': { const N = so(d.match(/nhập (\d+) /)[1]); return { kq: N.mul(Pc[0]).mul(M[0].mul(Pc[1])), kieu: 'tien' } }
    case 'gb_1': return { kq: M[0].div(tru(Pc[0])), kieu: 'tien' }
    case 'gb_2a': return { kq: M[0].div(tru(Pc[0])), kieu: 'tien' }
    case 'gb_2b': { const B = M[0].div(tru(Pc[0])); return { kq: B.sub(M[0]), kieu: 'tien' } }
    case 'gb_3a': return { kq: M[0].mul(Pc[0]), kieu: 'tien' }
    case 'gb_3b': return { kq: M[0].sub(M[0].mul(Pc[0])), kieu: 'tien' }
    case 'gb_4': return { kq: M[1].sub(M[0]).div(M[1]), kieu: 'pt' }
    case 'gb_5': return { kq: /so với (giá gốc|giá vốn|giá nhập)\?$/.test(d) ? Pc[0].div(tru(Pc[0])) : Pc[0].div(bu(Pc[0])), kieu: 'pt' }
    case 'gg_1_pt': return { kq: bu(Pc[0]).mul(tru(Pc[1])).sub(ONE), kieu: 'pt' }
    case 'gg_1_tien': { const G = M[0]; return { kq: G.mul(bu(Pc[0])).mul(tru(Pc[1])).sub(G), kieu: 'tien' } }
    case 'gg_2_pt': return { kq: bu(Pc[1]).div(tru(Pc[0])).sub(ONE), kieu: 'pt' }
    case 'gg_2_tien': return { kq: M[0].mul(bu(Pc[1])).div(tru(Pc[0])), kieu: 'tien' }
    default: throw new Error('mẫu lạ: ' + mau)
  }
}
/** số trong dap_an: bỏ $, đồng, Lãi, \% → phân số; % ⇒ chia 100 */
function docDapAn(da) {
  const m = da.match(/(\d+(?:,\d+)?)/); if (!m) throw new Error('không có số trong đáp án: ' + da)
  return /\\%/.test(da) ? pc(m[1]) : so(m[1])
}

export function kiemCau(c) {
  const loi = []
  try {
    // ① đáp số
    const { kq, kieu } = kyVong(c)
    const co = docDapAn(c.dap_an)
    if (!kq.eq(co)) loi.push(`đáp án ${c.dap_an} ≠ tính lại từ đề (${Number(kq.n) / Number(kq.d)}${kieu === 'pt' ? ' = ' + Number(kq.n) * 100 / Number(kq.d) + '%' : ''})`)
    if (kieu === 'tien' && !kq.nguyen) loi.push('đáp án tiền không nguyên')
    if (kieu === 'tien' && kq.nguyen && kq.n % 1000n !== 0n) loi.push('đáp án tiền không là bội của 1000 (số xấu)')
    // ② đề: mọi số tiền là bội của 1000
    for (const t of tiens(c.noi_dung)) if (!t.nguyen || t.n % 1000n !== 0n) loi.push('số tiền trong đề không đẹp: ' + t.n)
  } catch (e) { loi.push('không tính lại được: ' + e.message) }
  // ③ Phần 2 từng dòng
  const lg = c.loi_giai ?? ''
  const i2 = lg.indexOf('**Phần 2. Trình bày**')
  if (i2 < 0) { loi.push('thiếu Phần 2'); return loi }
  const p1 = lg.slice(0, i2).trim(), p2 = lg.slice(i2).replace('**Phần 2. Trình bày**', '').trim().split(/\n\n/)
  if (p2[0] !== 'Bài giải') loi.push('Phần 2 phải mở bằng "Bài giải"')
  const cuoi = p2[p2.length - 1]
  if (!cuoi.startsWith('Đáp số: ')) loi.push('Phần 2 phải kết bằng "Đáp số: …"')
  else if (cuoi.slice(8).trim() !== c.dap_an.trim()) loi.push(`Đáp số cuối "${cuoi.slice(8)}" ≠ dap_an "${c.dap_an}"`)
  for (const dong of p2.slice(1, -1)) {
    for (const m of dong.matchAll(/\$([^$]+)\$/g)) {
      const e = m[1]; if (!e.includes('=')) continue
      try {
        const vs = e.split('='), gt = vs.map(tinh)
        for (let k = 1; k < gt.length; k++) if (!gt[k].eq(gt[0])) { loi.push(`sai số học: $${e}$ (vế ${k + 1} ≠ vế 1)`); break }
      } catch (er) { loi.push(`không tính được $${e}$: ${er.message}`) }
    }
  }
  // ④ hình thức
  for (const l of kiemP1(p1)) loi.push('Phần 1: ' + l)
  if (/[⇒⇔∈∀≤≥]/.test(lg + c.noi_dung)) loi.push('ký hiệu cấm (⇒ ⇔ ∈ ∀ ≤ ≥)')
  if (/\\div|\\cdot|\\frac/.test(lg)) loi.push('dùng \\div / \\cdot / \\frac (phải \\times và dấu :)')
  return loi
}

if (process.argv[1]?.replace(/\\/g, '/').endsWith('k5T-pt-kiem.mjs')) {
  const cau = JSON.parse(readFileSync(process.argv[2], 'utf8'))
  let hong = 0
  for (const c of cau) { const l = kiemCau(c); if (l.length) { hong++; console.log(`✘ [${c.mau}] ${c.noi_dung.slice(0, 90)}\n    ${l.join('\n    ')}`) } }
  const trung = cau.map((c) => c.noi_dung.toLowerCase().replace(/\s+/g, '')).filter((x, i, a) => a.indexOf(x) !== i).length
  console.log(`${cau.length} câu · hỏng ${hong} · trùng đề ${trung}`)
  process.exit(hong || trung ? 1 : 0)
}
