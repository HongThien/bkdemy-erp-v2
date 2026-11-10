// ============================================================================
// DỰNG HÌNH theo bước — cho lệnh `dung_hinh` của phiên Claude (scripts/phien/ban-do.mjs). Thùy 09/11:
// "hình lớp 9 10 thì m làm như nào" ⇒ Claude KHÔNG tính toạ độ nhẩm (vuông góc không vuông, tiếp tuyến không chạm),
// chỉ MÔ TẢ cách dựng; máy tính toạ độ chính xác rồi vẽ bằng đúng các hàm của ve_hinh_lib (nét, gạch, cung góc, nhãn).
// Không chạy mã: đầu vào là JSON, mỗi phép là một tên trong danh sách cố định; đồ thị hàm qua bộ đọc biểu thức tự viết (không eval).
//
// Toạ độ TOÁN: y hướng LÊN. Điểm 3 chiều [x,y,z] được chiếu xiên NGAY khi khai (x sang phải, y vào sâu 45° co 1/2, z lên trên).
// Phép chiếu song song giữ trung điểm · tỉ lệ · trọng tâm · giao của hai đường cùng mặt phẳng ⇒ dùng các phép đó cho hình không gian;
// chân đường vuông góc / tâm đường tròn trong không gian thì tự tính toạ độ 3D rồi nhập thẳng.
// ============================================================================
import { tick, angleMark, rightAngle, label, num } from '../anh/ve_hinh_lib.mjs'

const f = (n) => Math.round(n * 100) / 100
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const sub = (a, b) => ({ x: a.x - b.x, y: a.y - b.y })
const add = (a, b) => ({ x: a.x + b.x, y: a.y + b.y })
const mul = (a, k) => ({ x: a.x * k, y: a.y * k })
const len = (a) => Math.hypot(a.x, a.y)
const unit = (a) => { const l = len(a); if (!l) throw new Error('hai điểm trùng nhau'); return mul(a, 1 / l) }
const dot = (a, b) => a.x * b.x + a.y * b.y
const lerp = (a, b, t) => add(a, mul(sub(b, a), t))
const rot = (p, o, deg) => { const r = deg * Math.PI / 180, v = sub(p, o); return { x: o.x + v.x * Math.cos(r) - v.y * Math.sin(r), y: o.y + v.x * Math.sin(r) + v.y * Math.cos(r) } }
const foot = (p, a, b) => { const d = sub(b, a); return lerp(a, b, dot(sub(p, a), d) / dot(d, d)) }
function giao(a, b, c, d) {
  const r = sub(b, a), s = sub(d, c), den = r.x * s.y - r.y * s.x
  if (Math.abs(den) < 1e-12) throw new Error('hai đường thẳng song song — không có giao điểm')
  const t = ((c.x - a.x) * s.y - (c.y - a.y) * s.x) / den
  return add(a, mul(r, t))
}
const tamNgoai = (a, b, c) => giao(lerp(a, b, 0.5), add(lerp(a, b, 0.5), rot(sub(b, a), { x: 0, y: 0 }, 90)), lerp(a, c, 0.5), add(lerp(a, c, 0.5), rot(sub(c, a), { x: 0, y: 0 }, 90)))
function tamNoi(a, b, c) { const la = len(sub(b, c)), lb = len(sub(a, c)), lc = len(sub(a, b)), s = la + lb + lc; return { x: (la * a.x + lb * b.x + lc * c.x) / s, y: (la * a.y + lb * b.y + lc * c.y) / s } }
const trucTam = (a, b, c) => giao(a, foot(a, b, c), b, foot(b, a, c))
function giaoTronThang(o, r, a, b) {
  const h = foot(o, a, b), d = len(sub(h, o))
  if (d > r + 1e-9) throw new Error('đường thẳng không cắt đường tròn')
  const k = Math.sqrt(Math.max(0, r * r - d * d)), u = unit(sub(b, a))
  return [add(h, mul(u, -k)), add(h, mul(u, k))]     // theo chiều a→b
}
function giaoHaiTron(o1, r1, o2, r2) {
  const d = len(sub(o2, o1))
  if (d > r1 + r2 + 1e-9 || d < Math.abs(r1 - r2) - 1e-9 || d === 0) throw new Error('hai đường tròn không cắt nhau')
  const a = (r1 * r1 - r2 * r2 + d * d) / (2 * d), h = Math.sqrt(Math.max(0, r1 * r1 - a * a))
  const u = unit(sub(o2, o1)), m = add(o1, mul(u, a)), n = { x: -u.y, y: u.x }
  return [add(m, mul(n, h)), add(m, mul(n, -h))]      // trái rồi phải nhìn từ o1 sang o2
}
function tiepDiem(m, o, r) {
  const d = len(sub(m, o))
  if (d <= r) throw new Error('điểm nằm trong/trên đường tròn — không kẻ được tiếp tuyến')
  return giaoHaiTron(o, r, lerp(m, o, 0.5), d / 2)
}

// ── bộ đọc biểu thức an toàn cho đồ thị: số, x, pi, e, + - * / ^, ( ), sin cos tan sqrt abs ln log exp; "2x" = 2*x ──
const HAM = { sin: Math.sin, cos: Math.cos, tan: Math.tan, sqrt: Math.sqrt, abs: Math.abs, ln: Math.log, log: Math.log10, exp: Math.exp }
export function docBieuThuc(src) {
  const tk = String(src).replace(/\s+/g, '').match(/\d+(?:\.\d+)?|[a-z]+|[-+*/^()]/gi)
  if (!tk || tk.join('') !== String(src).replace(/\s+/g, '')) throw new Error(`biểu thức "${src}" có ký tự lạ`)
  const t = []
  for (let i = 0; i < tk.length; i++) {   // nhân ngầm: 2x · 2(x+1) · x(x-1) · )(
    const a = t[t.length - 1], b = tk[i]
    if (a && (/^[\d.]+$|^x$|^pi$|^e$|^\)$/i.test(a)) && (/^[a-z(]/i.test(b) || /^\d/.test(b)) && !(/^\d/.test(a) && /^\d/.test(b))) t.push('*')
    t.push(b)
  }
  let i = 0
  const nhin = () => t[i], an = (c) => { if (t[i] !== c) throw new Error(`biểu thức "${src}": thiếu "${c}"`); i++ }
  function cong() { let v = nhan(); while (nhin() === '+' || nhin() === '-') { const o = t[i++], r = nhan(), l = v; v = o === '+' ? (x) => l(x) + r(x) : (x) => l(x) - r(x) } return v }
  function nhan() { let v = mot(); while (nhin() === '*' || nhin() === '/') { const o = t[i++], r = mot(), l = v; v = o === '*' ? (x) => l(x) * r(x) : (x) => l(x) / r(x) } return v }
  function mot() { if (nhin() === '-') { i++; const v = mot(); return (x) => -v(x) } if (nhin() === '+') { i++; return mot() } return mu() }
  function mu() { const b = goc(); if (nhin() === '^') { i++; const e = mot(); return (x) => Math.pow(b(x), e(x)) } return b }
  function goc() {
    const c = t[i++]
    if (c === undefined) throw new Error(`biểu thức "${src}" bị cụt`)
    if (/^\d/.test(c)) { const n = Number(c); return () => n }
    if (c === '(') { const v = cong(); an(')'); return v }
    const k = c.toLowerCase()
    if (k === 'x') return (x) => x
    if (k === 'pi') return () => Math.PI
    if (k === 'e') return () => Math.E
    if (HAM[k]) { an('('); const v = cong(); an(')'); return (x) => HAM[k](v(x)) }
    throw new Error(`biểu thức "${src}": không hiểu "${c}"`)
  }
  const v = cong()
  if (i !== t.length) throw new Error(`biểu thức "${src}": thừa "${t[i]}"`)
  return v
}

const SO = (v, ten) => { const n = Number(v); if (!Number.isFinite(n)) throw new Error(`${ten} phải là số`); return n }

export function dungHinh(spec) {
  const max = Math.min(SO(spec.kich_thuoc ?? 520, 'kich_thuoc'), 1200)
  const pts = Object.create(null)                    // toán học
  const chieu = (x, y, z) => ({ x: x + 0.5 * y * Math.SQRT1_2, y: z + 0.5 * y * Math.SQRT1_2 })   // chiếu xiên
  const lay = (k) => {
    if (Array.isArray(k) && k.length >= 2 && k.every((x) => typeof x === 'number')) return k.length === 3 ? chieu(k[0], k[1], k[2]) : { x: k[0], y: k[1] }
    if (typeof k !== 'string' || !pts[k]) throw new Error(`chưa có điểm "${k}" (khai trước khi dùng)`)
    return pts[k]
  }
  const banKinh = (o, r) => (typeof r === 'number' ? r : len(sub(lay(r), o)))
  const DUNG = {
    trung_diem: ([a, b]) => lerp(lay(a), lay(b), 0.5),
    chia: ([a, b, t]) => lerp(lay(a), lay(b), SO(t, 'tỉ lệ')),                    // A + t·AB
    chan: ([p, a, b]) => foot(lay(p), lay(a), lay(b)),                            // chân đường vuông góc từ p xuống ab
    giao: ([a, b, c, d]) => giao(lay(a), lay(b), lay(c), lay(d)),                 // giao đường ab và cd
    quay: ([p, o, g]) => rot(lay(p), lay(o), SO(g, 'góc')),                       // ngược chiều kim đồng hồ
    doi_xung_diem: ([p, o]) => sub(mul(lay(o), 2), lay(p)),
    doi_xung_truc: ([p, a, b]) => sub(mul(foot(lay(p), lay(a), lay(b)), 2), lay(p)),
    tinh_tien: ([p, a, b]) => add(lay(p), sub(lay(b), lay(a))),                   // p + vectơ AB
    trong_tam: ([a, b, c]) => mul(add(add(lay(a), lay(b)), lay(c)), 1 / 3),
    tam_ngoai: ([a, b, c]) => tamNgoai(lay(a), lay(b), lay(c)),
    tam_noi: ([a, b, c]) => tamNoi(lay(a), lay(b), lay(c)),
    truc_tam: ([a, b, c]) => trucTam(lay(a), lay(b), lay(c)),
    tren_tron: ([o, r, g]) => { const O = lay(o), R = banKinh(O, r), a = SO(g, 'góc') * Math.PI / 180; return { x: O.x + R * Math.cos(a), y: O.y + R * Math.sin(a) } },
    giao_tron_thang: ([o, r, a, b, k]) => { const O = lay(o); return giaoTronThang(O, banKinh(O, r), lay(a), lay(b))[k ? 1 : 0] },
    giao_hai_tron: ([o1, r1, o2, r2, k]) => { const A = lay(o1), B = lay(o2); return giaoHaiTron(A, banKinh(A, r1), B, banKinh(B, r2))[k ? 1 : 0] },
    tiep_diem: ([m, o, r, k]) => { const O = lay(o); return tiepDiem(lay(m), O, banKinh(O, r))[k ? 1 : 0] },
    phan_giac: ([v, p, q, l]) => { const V = lay(v), u = unit(add(unit(sub(lay(p), V)), unit(sub(lay(q), V)))); return add(V, mul(u, SO(l ?? 1, 'độ dài'))) },
    vuong_goc: ([p, a, b, l]) => { const d = unit(sub(lay(b), lay(a))); return add(lay(p), mul({ x: -d.y, y: d.x }, SO(l ?? 1, 'độ dài'))) },   // từ p, vuông góc ab, quay trái
    song_song: ([p, a, b, l]) => add(lay(p), mul(unit(sub(lay(b), lay(a))), SO(l ?? 1, 'độ dài'))),
  }
  for (const d of spec.diem ?? []) {
    if (!Array.isArray(d) || typeof d[0] !== 'string') throw new Error(`mỗi điểm dạng ["Tên", toạ độ hoặc ["phép", …]] — lỗi ở ${JSON.stringify(d).slice(0, 60)}`)
    const [ten, dn] = d
    if (Array.isArray(dn) && typeof dn[0] === 'string') {
      const fn = DUNG[dn[0]]
      if (!fn) throw new Error(`phép dựng "${dn[0]}" không có — chỉ: ${Object.keys(DUNG).join(' ')}`)
      try { pts[ten] = fn(dn.slice(1)) } catch (e) { throw new Error(`điểm ${ten}: ${e.message}`) }
    } else pts[ten] = lay(dn)
  }

  // ── gom nét (toạ độ toán) để biết khung, rồi mới đổi ra px ──
  const ve = spec.ve ?? []
  const khung = []
  const ke = Object.create(null)                                     // điểm → các điểm nối với nó (đặt nhãn né nét)
  const noi = (a, b) => { (ke[a] ??= []).push(b); (ke[b] ??= []).push(a) }
  let truc = null
  for (const v of ve) {
    const [loai, ...a] = v
    if (['doan', 'duong_thang', 'tia', 'vecto'].includes(loai)) { khung.push(lay(a[0]), lay(a[1])); if (typeof a[0] === 'string' && typeof a[1] === 'string') noi(a[0], a[1]) }
    else if (loai === 'da_giac') { const ds = a[0]; ds.forEach((p, i) => { khung.push(lay(p)); if (typeof p === 'string') noi(p, ds[(i + 1) % ds.length]) }) }
    else if (loai === 'duong_tron' || loai === 'cung') { const O = lay(a[0]), R = banKinh(O, a[1]); khung.push({ x: O.x - R, y: O.y - R }, { x: O.x + R, y: O.y + R }) }
    else if (loai === 'truc') { truc = a[0] ?? {}; const X = truc.x ?? [-1, 5], Y = truc.y ?? [-1, 5]; khung.push({ x: X[0], y: Y[0] }, { x: X[1], y: Y[1] }) }
    else if (loai === 'cham' || loai === 'nhan') for (const p of [].concat(a[0] === 'tat_ca' ? Object.keys(pts) : a[0])) khung.push(lay(p))
  }
  if (!khung.length) for (const k in pts) khung.push(pts[k])
  if (!khung.length) throw new Error('chưa có điểm hay nét nào để vẽ')
  const xs = khung.map((p) => p.x), ys = khung.map((p) => p.y)
  const x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys)
  const LE = 46
  const k = spec.ti_le ? SO(spec.ti_le, 'ti_le') : (max - 2 * LE) / Math.max(x1 - x0, y1 - y0, 1e-9)
  const W = Math.round((x1 - x0) * k + 2 * LE), H = Math.round((y1 - y0) * k + 2 * LE)
  if (W > 1600 || H > 1600) throw new Error(`hình ra ${W}×${H}px — quá to, giảm ti_le`)
  const S = (p) => ({ x: (p.x - x0) * k + LE, y: (y1 - p.y) * k + LE })     // toán → px (lật y)
  const sp = (p) => S(lay(p))
  const tamHinh = S({ x: (x0 + x1) / 2, y: (y0 + y1) / 2 })

  const nen = [], net = [], chu = []
  const hinhDoan = [], hinhTron = [], hangNhan = []      // nét đã vẽ (px) — nhãn né cả nét đi QUA điểm, không chỉ nét nối vào
  const ln = (a, b, o = {}) => { hinhDoan.push([a, b]); return lnS(a, b, o) }
  const lnS = (a, b, o = {}) => `<line x1="${f(a.x)}" y1="${f(a.y)}" x2="${f(b.x)}" y2="${f(b.y)}"${o.dut ? ' stroke-dasharray="7 6"' : ''}${o.mau ? ` stroke="${mauOk(o.mau)}"` : ''}${o.day ? ` stroke-width="${SO(o.day, 'day')}"` : ''}/>`
  const muiTen = (a, b, o = {}) => { const u = unit(sub(b, a)), n = { x: -u.y, y: u.x }, c = sub(b, mul(u, 14)); return ln(a, sub(b, mul(u, 6)), o) + `<path d="M ${f(b.x)} ${f(b.y)} L ${f(c.x + n.x * 6)} ${f(c.y + n.y * 6)} L ${f(c.x - n.x * 6)} ${f(c.y - n.y * 6)} Z" fill="${o.mau ? mauOk(o.mau) : '#222'}" stroke="none"/>` }
  const daNhan = new Set()
  const nhan = (ten, o = {}) => { if (!daNhan.has(ten)) { daNhan.add(ten); sp(ten); hangNhan.push([ten, o]) } }
  const kcDoan = (p, a, b) => { const d = sub(b, a), l2 = dot(d, d); const t = l2 ? Math.max(0, Math.min(1, dot(sub(p, a), d) / l2)) : 0; return len(sub(p, add(a, mul(d, t)))) }
  const daDat = []
  const datNhan = (ten, o) => {
    const p = sp(ten)
    let d
    if (o.huong != null) { const r = SO(o.huong, 'huong') * Math.PI / 180; d = { x: Math.cos(r), y: -Math.sin(r) } }
    else {
      // hướng mặc định: ngược các nét nối vào; rồi thử 16 hướng, chọn chỗ chữ (≈ hộp 18px) cách xa mọi nét / đường tròn / nhãn khác nhất
      const nb = (ke[ten] ?? []).filter((q) => typeof q === 'string' && pts[q]).map((q) => unit(sub(sp(q), p)))
      let v = nb.reduce((s, u) => sub(s, u), { x: 0, y: 0 })
      if (len(v) < 0.3) v = sub(p, tamHinh)
      const mac = len(v) ? unit(v) : { x: 0, y: -1 }
      let tot = -Infinity
      for (let i = 0; i < 16; i++) {
        const g = i * Math.PI / 8, u = { x: Math.cos(g), y: Math.sin(g) }, c = add(p, mul(u, 22))
        let kc = Math.min(30, ...hinhDoan.map(([a, b]) => kcDoan(c, a, b)), ...hinhTron.map(([o2, R]) => Math.abs(len(sub(c, o2)) - R)), ...daDat.map((q) => len(sub(c, q)) - 10))
        kc = Math.min(kc, c.x - 10, W - 10 - c.x, c.y - 14, H - 6 - c.y)
        const diem = Math.min(kc, 16) * 10 + dot(u, mac) * 3 + Math.min(kc, 30)
        if (diem > tot) { tot = diem; d = u }
      }
    }
    daDat.push(add(p, mul(d, 22)))
    const ten_hien = esc(ten).replace(/_(\w+)/, '<tspan baseline-shift="sub" font-size="18">$1</tspan>')
    chu.push(label({ x: p.x + d.x * 22, y: p.y + d.y * 22 }, ten_hien, 0, 9))
  }
  const mauOk = (m) => { if (!/^#[0-9a-f]{3,6}$|^[a-z]{3,12}$/i.test(m)) throw new Error(`màu "${m}" không hợp lệ (dùng #rrggbb)`); return m }

  for (const v of ve) {
    const [loai, ...a] = v
    const o = (a.length && a[a.length - 1] && typeof a[a.length - 1] === 'object' && !Array.isArray(a[a.length - 1])) ? a.pop() : {}
    switch (loai) {
      case 'doan': net.push(ln(sp(a[0]), sp(a[1]), o)); break
      case 'duong_thang': case 'tia': {
        const A = sp(a[0]), B = sp(a[1]), u = unit(sub(B, A)), ext = SO(o.keo ?? 40, 'keo')
        net.push(ln(loai === 'tia' ? A : sub(A, mul(u, ext)), add(B, mul(u, ext)), o)); break
      }
      case 'vecto': net.push(muiTen(sp(a[0]), sp(a[1]), o)); break
      case 'da_giac': {
        const ds = a[0].map(sp); ds.forEach((p, i) => hinhDoan.push([p, ds[(i + 1) % ds.length]])); const d = `M ${ds.map((p) => `${f(p.x)} ${f(p.y)}`).join(' L ')} Z`
        if (o.to) nen.push(`<path d="${d}" fill="${mauOk(o.to)}" stroke="none"/>`)
        net.push(`<path d="${d}" fill="none"${o.dut ? ' stroke-dasharray="7 6"' : ''}/>`); break
      }
      case 'duong_tron': { const O = lay(a[0]), c = S(O), R = banKinh(O, a[1]) * k; hinhTron.push([c, R]); net.push(`<circle cx="${f(c.x)}" cy="${f(c.y)}" r="${f(R)}" fill="none"${o.dut ? ' stroke-dasharray="7 6"' : ''}/>`); break }
      case 'cung': {   // cung tròn tâm a0 từ a1 tới a2 NGƯỢC chiều kim đồng hồ (toán)
        const O = lay(a[0]), c = S(O), P1 = sp(a[1]), P2 = sp(a[2]), R = len(sub(P1, c))
        hinhTron.push([c, R])
        const g = (p) => Math.atan2(-(p.y - c.y), p.x - c.x), lon = ((g(P2) - g(P1) + 4 * Math.PI) % (2 * Math.PI)) > Math.PI ? 1 : 0
        net.push(`<path d="M ${f(P1.x)} ${f(P1.y)} A ${f(R)} ${f(R)} 0 ${lon} 0 ${f(P2.x)} ${f(P2.y)}" fill="none"${o.dut ? ' stroke-dasharray="7 6"' : ''}/>`); break
      }
      case 'goc': net.push(angleMark(sp(a[0]), sp(a[1]), sp(a[2]), SO(o.r ?? 28, 'r'), Math.min(3, SO(a[3] ?? 1, 'số cung')))); break
      case 'goc_vuong': net.push(rightAngle(sp(a[0]), sp(a[1]), sp(a[2]))); break
      case 'gach': net.push(tick(sp(a[0]), sp(a[1]), SO(a[2] ?? 1, 'số gạch'))); break
      case 'cham': for (const p of [].concat(a[0] === 'tat_ca' ? Object.keys(pts) : a[0])) { const q = sp(p); chu.push(`<circle cx="${f(q.x)}" cy="${f(q.y)}" r="4" fill="#222" stroke="none"/>`) } break
      case 'nhan': for (const p of [].concat(a[0] === 'tat_ca' ? Object.keys(pts) : a[0])) nhan(p, o); break
      case 'chu': { const p = sp(a[0]); chu.push(num({ x: p.x + (o.dx ?? 0), y: p.y + (o.dy ?? 0) }, esc(a[1]), 0, 8, SO(o.co ?? 22, 'co'))); break }
      case 'truc': {
        const X = truc.x ?? [-1, 5], Y = truc.y ?? [-1, 5], b = SO(truc.vach ?? 1, 'vach')
        if (truc.luoi) for (let x = Math.ceil(X[0] / b) * b; x <= X[1] + 1e-9; x += b) nen.push(`<line x1="${f(S({ x, y: Y[0] }).x)}" y1="${f(S({ x, y: Y[0] }).y)}" x2="${f(S({ x, y: Y[1] }).x)}" y2="${f(S({ x, y: Y[1] }).y)}" stroke="#d5dae1" stroke-width="1"/>`)
        if (truc.luoi) for (let y = Math.ceil(Y[0] / b) * b; y <= Y[1] + 1e-9; y += b) nen.push(`<line x1="${f(S({ x: X[0], y }).x)}" y1="${f(S({ x: X[0], y }).y)}" x2="${f(S({ x: X[1], y }).x)}" y2="${f(S({ x: X[1], y }).y)}" stroke="#d5dae1" stroke-width="1"/>`)
        hinhDoan.push([S({ x: X[0], y: 0 }), S({ x: X[1], y: 0 })], [S({ x: 0, y: Y[0] }), S({ x: 0, y: Y[1] })])
        net.push(muiTen(S({ x: X[0], y: 0 }), S({ x: X[1], y: 0 }), { day: 1.5 }), muiTen(S({ x: 0, y: Y[0] }), S({ x: 0, y: Y[1] }), { day: 1.5 }))
        chu.push(label(add(S({ x: X[1], y: 0 }), { x: -6, y: 24 }), 'x', 0, 0), label(add(S({ x: 0, y: Y[1] }), { x: -16, y: 6 }), 'y', 0, 0), label(add(S({ x: 0, y: 0 }), { x: -14, y: 22 }), 'O', 0, 0))
        if (truc.so !== false) {
          for (let x = Math.ceil(X[0] / b) * b; x < X[1] - 1e-9; x += b) if (Math.abs(x) > 1e-9) { const p = S({ x, y: 0 }); net.push(`<line x1="${f(p.x)}" y1="${f(p.y - 4)}" x2="${f(p.x)}" y2="${f(p.y + 4)}" stroke-width="1.5"/>`); chu.push(num(p, String(+x.toFixed(2)).replace('-', '−'), 0, 24, 18)) }
          for (let y = Math.ceil(Y[0] / b) * b; y < Y[1] - 1e-9; y += b) if (Math.abs(y) > 1e-9) { const p = S({ x: 0, y }); net.push(`<line x1="${f(p.x - 4)}" y1="${f(p.y)}" x2="${f(p.x + 4)}" y2="${f(p.y)}" stroke-width="1.5"/>`); chu.push(num(p, String(+y.toFixed(2)).replace('-', '−'), -16, 6, 18)) }
        }
        break
      }
      case 'do_thi': {
        const fx = docBieuThuc(a[0]), xa = SO(a[1], 'x đầu'), xb = SO(a[2], 'x cuối'), n = 400
        let d = '', moi = true, truoc = null
        for (let i = 0; i <= n; i++) {
          const x = xa + (xb - xa) * i / n, y = fx(x)
          const yt = truc ? (truc.y ?? [-1, 5]) : [y0 - 2 * (y1 - y0), y1 + 2 * (y1 - y0)]
          if (!Number.isFinite(y) || y < yt[0] || y > yt[1]) { moi = true; truoc = null; continue }
          const p = S({ x, y }); if (!moi && truoc) hinhDoan.push([truoc, p]); truoc = p; d += `${moi ? 'M' : 'L'} ${f(p.x)} ${f(p.y)} `; moi = false
        }
        net.push(`<path d="${d.trim()}" fill="none"${o.mau ? ` stroke="${mauOk(o.mau)}"` : ''} stroke-width="${SO(o.day ?? 2.5, 'day')}" clip-path="url(#khung)"/>`); break
      }
      default: throw new Error(`nét "${loai}" không có — chỉ: doan duong_thang tia vecto da_giac duong_tron cung goc goc_vuong gach cham nhan chu truc do_thi`)
    }
  }
  for (const [t, o] of hangNhan) datNhan(t, o)
  const body = `<defs><clipPath id="khung"><rect x="0" y="0" width="${W}" height="${H}"/></clipPath></defs>${nen.join('')}<g stroke="#222" stroke-width="2" stroke-linecap="round" fill="none">${net.join('')}</g>${chu.join('')}`
  const toaDo = Object.fromEntries(Object.entries(pts).map(([t, p]) => [t, [+p.x.toFixed(3), +p.y.toFixed(3)]]))
  return { w: W, h: H, svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><rect width="${W}" height="${H}" fill="#fff"/>${body}</svg>`, toaDo }
}
