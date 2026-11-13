import { pool, form, luu } from './lib.mjs'
import { norm, tok, ev, bieuThuc, dungForm, soTrong, thayLanLuot } from './core.mjs'
const out = []
const P = pool()
const an = new Set() // câu đã xử lý
const push = (r) => { out.push(r); an.add(r.ma_cau) }
let rot = 0
// ---------- A. tìm số còn thiếu (inverse) ----------
function inverse(c) {
  const t = norm(c.noi_dung); const segs = t.split(';').map((s) => s.trim()).filter((s) => s.includes('...') && s.includes('='))
  const body = segs.map((s) => s.replace(/^[^.]*?[a-zà-ỹ][^.]*:\s*/i, '').replace(/\.$/, ''))
  const vals = [], comps = []
  for (const s of body) {
    const m = s.replace(/\s+/g, '').replace(/×/g, '*').replace(/:/g, '/').match(/^(\.\.\.|\d+)([-+*/])(\.\.\.|\d+)=(\d+)$/)
    if (!m) return null
    const [, A, op, B, R] = m; const r = +R; let x, sai, a
    if (A === '...') { a = +B; x = op === '+' ? r - a : op === '-' ? r + a : op === '*' ? (r % a ? NaN : r / a) : r * a; sai = op === '+' ? r + a : op === '-' ? r - a : op === '*' ? r * a : (r % a ? NaN : r / a) }
    else { a = +A; x = op === '+' ? r - a : op === '-' ? a - r : op === '*' ? (r % a ? NaN : r / a) : (a % r ? NaN : a / r); sai = op === '+' ? r + a : op === '-' ? a + r : op === '*' ? r * a : a * r }
    if (!Number.isInteger(x) || x < 0) return null
    vals.push(x); comps.push({ sai: Number.isInteger(sai) ? sai : undefined })
  }
  return vals.length ? { vals, comps } : null
}
// ---------- B. chuỗi "Bắt đầu từ" ----------
function chain(c) {
  const t = norm(c.noi_dung); const m = t.match(/[Bb]ắt đầu từ ([\d :*+()-]+?)(?=,|\.)(.*?)(?:Tìm|$)/); if (!m) return null
  let cur = ev(tok(m[1])); if (cur === null) return null
  const ops = [...m[2].matchAll(/(cộng|trừ|nhân|chia) (\d+)/g)]; if (!ops.length) return null
  const vals = [], comps = []; const first = m[1].trim()
  if (!/\d\s*[:*+-]\s*\d/.test(first)) { /* bắt đầu từ số */ }
  const seq = []
  for (const [, o, n] of ops) { const b = +n; cur = o === 'cộng' ? cur + b : o === 'trừ' ? cur - b : o === 'nhân' ? cur * b : (cur % b ? NaN : cur / b); if (!Number.isInteger(cur) || cur < 0) return null; seq.push(cur); comps.push({ loai: o === 'cộng' ? 'cong' : o === 'trừ' ? 'tru' : o === 'chia' ? 'chia' : undefined }) }
  if (/số cuối cùng/.test(t)) return { vals: [seq.at(-1)], comps: [comps.at(-1)] }
  return { vals: seq, comps }
}
// ---------- D. lời / mẫu câu ----------
const W = [
  [/Biết hai số hạng là (\d+) và (\d+)\. Tìm tổng/, (a, b) => `${a}+${b}`],
  [/Số bị trừ là (\d+), số trừ là (\d+)\. Tìm hiệu/, (a, b) => `${a}-${b}`],
  [/Một tổng bằng (\d+), trong đó một số hạng là (\d+)/, (a, b) => `${a}-${b}`],
  [/Số trừ là (\d+), hiệu là (\d+)\. Tìm số bị trừ/, (a, b) => `${a}+${b}`],
  [/Số bị trừ là (\d+), hiệu là (\d+)\. Tìm số trừ/, (a, b) => `${a}-${b}`],
  [/Một tích bằng (\d+), trong đó một thừa số là (\d+)/, (a, b) => `${a}/${b}`],
  [/Số bị chia là (\d+), thương là (\d+)\. Tìm số chia/, (a, b) => `${a}/${b}`],
  [/Số chia là (\d+), thương là (\d+)\. Tìm số bị chia/, (a, b) => `${a}*${b}`],
]
function loiVan(c) { const t = norm(c.noi_dung); for (const [re, f] of W) { const m = t.match(re); if (m) { const b = bieuThuc(f(m[1], m[2])); return b ? { vals: [b.v], comps: [b] } : null } } return null }
// ---------- E. thêm/gấp/giảm ----------
function themGap(c) {
  const t = norm(c.noi_dung); const it = [...t.matchAll(/(?:số (\d+) (thêm|gấp) (\d+)|giảm (\d+) đi (\d+) lần)/g)]; if (!it.length) return null
  const vals = [], comps = []
  for (const m of it) { const e = m[1] ? (m[2] === 'thêm' ? `${m[1]}+${m[3]}` : `${m[1]}*${m[3]}`) : `${m[4]}/${m[5]}`; const b = bieuThuc(e); if (!b) return null; vals.push(b.v); comps.push(b) }
  return { vals, comps }
}
// ---------- F. danh sách biểu thức ----------
function dsBieuThuc(c) {
  const raw = c.noi_dung; const segs = [...raw.matchAll(/\$([^$]+)\$/g)].map((m) => m[1])
  let L = segs.length ? segs : [raw.replace(/^[^:]*:\s*/, '')]
  L = L.flatMap((s) => norm(s).split(';')).map((s) => s.trim().replace(/\.$/, '')).filter(Boolean)
  const comps = []; for (const s of L) { if (!/[-+*/:×]/.test(s.replace(/^-/, ''))) continue; const b = bieuThuc(s); if (!b) { if (/^\d+$/.test(s)) continue; return null } comps.push(b) }
  return comps.length ? { vals: comps.map((b) => b.v), comps } : null
}
// ---------- G. Số gồm a trăm, b chục, c đơn vị ----------
function soGom(c) { const m = norm(c.noi_dung).match(/Số gồm (\d) trăm, (\d) chục và (\d) đơn vị/); if (!m) return null; const [, a, b, d] = m; const n = 100 * a + 10 * b + +d; return { n, a, b, d } }
for (const c of P) {
  const t = c.noi_dung
  const sg = soGom(c)
  if (sg) { const s = String(sg.n); const co0 = s.includes('0')
    if (s !== soTrong(c.dap_an).join('')) { push({ ma_cau: c.ma_cau, bo: 'khác kho' }); continue }
    const t365 = co0 ? s.replace('0', '') : s[0] + '0' + s.slice(1)
    push(form(c.ma_cau, c.dap_an.trim(), [
      { text: thayLanLuot(c.dap_an, [+t365]), rule: 'R365', duong_sai: 'bỏ sót hoặc viết thừa một chữ số 0 khi ghép số' },
      { text: thayLanLuot(c.dap_an, [+(s + '0')]), rule: 'R414', duong_sai: 'viết thừa một chữ số 0 (gấp 10 lần)' },
      { text: thayLanLuot(c.dap_an, [sg.n + 100]), rule: 'R413', duong_sai: 'ghép nhầm chữ số ở hàng trăm (lệch 100)' },
    ], rot++ % 4)); continue }
  if (/\.\.\./.test(norm(t).replace(/\.{4,}/g, '...')) && /=/.test(t) && !/hình|dm|cm/.test(t)) { const r = inverse(c); if (r) { push(dungForm(c, r.vals, r.comps, rot++)); continue } }
  if (/[Bb]ắt đầu từ/.test(t)) { const r = chain(c); if (r) { push(dungForm(c, r.vals, r.comps, rot++)); continue } }
  const lv = loiVan(c); if (lv) { push(dungForm(c, lv.vals, lv.comps, rot++)); continue }
  const tg = themGap(c); if (tg) { push(dungForm(c, tg.vals, tg.comps, rot++)); continue }
  if (/^(Đặt tính|Tính|Tìm tích|Tìm tổng|Tìm hiệu|Tìm thương|Tính giá trị)/.test(t) && !/Điền dấu|Bắt đầu|Viết các số/.test(t)) { const r = dsBieuThuc(c); if (r) { push(dungForm(c, r.vals, r.comps, rot++)); continue } }
}
luu('k3_b1_tinh', out)
