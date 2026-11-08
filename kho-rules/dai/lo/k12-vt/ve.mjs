// ve.mjs — dựng hình SVG cho ví dụ K12 Hàm số từ mô tả JSON (bảng biến thiên · bảng xét dấu · đồ thị hàm số).
// Trong tệp soạn, hình viết MỘT DÒNG:  [[HINH {json}]]   (nằm trong đề của ##VD)
//
//  1) Đồ thị:   {"loai":"dothi","x":[-3,3],"y":[-4,4],
//                "f":[{"e":"x^3-3*x","ten":"y=f(x)"}, {"e":"(2*x+1)/(x-1)","x":[-3,3],"ten":"(C)","dut":true}],
//                "diem":[{"x":1,"y":-2,"nhan":"CT","chi":true}],
//                "duong":[{"ngang":2,"ten":"y=m"},{"dung":1,"ten":"x=1"},{"xien":[1,0],"ten":"y=x"}],
//                "luoi":true}
//     - e: biểu thức theo x (JS: ^ là luỹ thừa, ln, sqrt, abs, sin, cos, tan, exp, pi). Hình VẼ THEO CÔNG THỨC nên luôn khớp đề.
//     - f[i].x: đoạn vẽ riêng (hàm chia khúc); dut:true = vẽ nét đứt; nhan hiện ở đầu cuối đường cong.
//     - Hình trong ví dụ KHÔNG ghi hệ trục chi tiết nếu đề không cần; luoi mặc định true.
//  2) BBT:      {"loai":"bbt","x":["-∞","-1","1","+∞"],"dau":["+","-","+"],"y":["-∞","3","-1","+∞"]}
//               - x: các cột (n); dau: dấu y′ trên n−1 khoảng; y: giá trị tại n cột (chuỗi), cột gián đoạn (hai bên khác nhau/∞) viết cặp ["-∞","+∞"];
//                 vị trí cao/thấp tự suy từ dấu. "kd":{"2":"||"} đánh dấu cột 2 (chỉ số từ 0) là điểm gián đoạn (kẻ đôi); mặc định cột trong có y′=0 → ghi 0.
//               - "ten_dao":"f'(x)" · "ten_ham":"f(x)" · "hang":"dau" = chỉ bảng xét dấu (không hàng y).
const KT = { r: 380, c: 290, le: 34 }

const so = (v) => (Math.round(v * 100) / 100).toString()
const thoat = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

// ^ → pow(): xử lý đúng "-x^3" (JS cấm dấu âm đứng trước **) và các nhóm ngoặc
function doiMu(e) {
  let t = e
  for (let guard = 0; guard < 50; guard++) {
    const i = t.lastIndexOf('^')
    if (i < 0) break
    let l = i - 1
    while (l >= 0 && t[l] === ' ') l--
    let start
    if (t[l] === ')') { let d = 0; for (let k = l; k >= 0; k--) { if (t[k] === ')') d++; else if (t[k] === '(') { d--; if (d === 0) { start = k; break } } } while (start > 0 && /[A-Za-z0-9_]/.test(t[start - 1])) start-- }
    else { start = l; while (start > 0 && /[A-Za-z0-9_.]/.test(t[start - 1])) start-- }
    let r = i + 1
    while (t[r] === ' ') r++
    let end = r
    if (t[end] === '-' || t[end] === '+') end++
    if (t[end] === '(') { let d = 0; for (let k = end; k < t.length; k++) { if (t[k] === '(') d++; else if (t[k] === ')') { d--; if (d === 0) { end = k + 1; break } } } }
    else { while (end < t.length && /[A-Za-z0-9_.]/.test(t[end])) end++; if (t[end] === '(') { let d = 0; for (let k = end; k < t.length; k++) { if (t[k] === '(') d++; else if (t[k] === ')') { d--; if (d === 0) { end = k + 1; break } } } } }
    t = t.slice(0, start) + 'pow(' + t.slice(start, l + 1) + ',' + t.slice(r, end) + ')' + t.slice(end)
  }
  return t
}
function hamTu(e) {
  const m = doiMu(e).replace(/ln/g, 'log').replace(/pi/gi, 'PI')
  // eslint-disable-next-line no-new-func
  return new Function('x', `with(Math){ return (${m}) }`)
}

export function veDoThi(sp) {
  const [x0, x1] = sp.x ?? [-4, 4], [y0, y1] = sp.y ?? [-4, 4]
  const W = KT.r, H = KT.c, L = KT.le
  const px = (x) => L + ((x - x0) / (x1 - x0)) * (W - 2 * L), py = (y) => H - L - ((y - y0) / (y1 - y0)) * (H - 2 * L)
  const o = []
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="${thoat(sp.mo_ta ?? 'Đồ thị hàm số')}" style="max-width:100%;height:auto;color:currentColor;font-family:system-ui,sans-serif">`)
  o.push(`<defs><marker id="mt" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`)
  o.push(`<clipPath id="kp"><rect x="${L - 8}" y="${L - 10}" width="${W - 2 * L + 16}" height="${H - 2 * L + 20}"/></clipPath>`)
  if (sp.luoi !== false) {
    for (let x = Math.ceil(x0); x <= x1; x++) o.push(`<line x1="${so(px(x))}" y1="${L - 6}" x2="${so(px(x))}" y2="${H - L + 6}" stroke="currentColor" stroke-opacity=".10"/>`)
    for (let y = Math.ceil(y0); y <= y1; y++) o.push(`<line x1="${L - 6}" y1="${so(py(y))}" x2="${W - L + 6}" y2="${so(py(y))}" stroke="currentColor" stroke-opacity=".10"/>`)
  }
  const ax = Math.min(Math.max(0, x0), x1), ay = Math.min(Math.max(0, y0), y1)
  o.push(`<line x1="${L - 10}" y1="${so(py(ay))}" x2="${W - L + 14}" y2="${so(py(ay))}" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt)"/>`)
  o.push(`<line x1="${so(px(ax))}" y1="${H - L + 10}" x2="${so(px(ax))}" y2="${L - 14}" stroke="currentColor" stroke-width="1.3" marker-end="url(#mt)"/>`)
  o.push(`<text x="${W - L + 10}" y="${so(py(ay) + 16)}" font-size="13" font-style="italic" fill="currentColor">x</text><text x="${so(px(ax) + 8)}" y="${L - 14}" font-size="13" font-style="italic" fill="currentColor">y</text>`)
  const nx = Math.max(1, Math.round((x1 - x0) / 8)), ny = Math.max(1, Math.round((y1 - y0) / 8))
  for (let x = Math.ceil(x0); x <= x1; x++) if (x !== 0 && x % nx === 0) o.push(`<text x="${so(px(x))}" y="${so(py(ay) + 14)}" font-size="10.5" text-anchor="middle" fill="currentColor" fill-opacity=".75">${x}</text>`)
  for (let y = Math.ceil(y0); y <= y1; y++) if (y !== 0 && y % ny === 0) o.push(`<text x="${so(px(ax) - 5)}" y="${so(py(y) + 4)}" font-size="10.5" text-anchor="end" fill="currentColor" fill-opacity=".75">${y}</text>`)
  o.push(`<text x="${so(px(ax) - 5)}" y="${so(py(ay) + 14)}" font-size="10.5" text-anchor="end" fill="currentColor" fill-opacity=".75">O</text>`)
  for (const d of sp.duong ?? []) {
    let l
    if (d.ngang != null) l = [px(x0), py(d.ngang), px(x1), py(d.ngang), px(x1) - 4, py(d.ngang) - 5]
    else if (d.dung != null) l = [px(d.dung), py(y0), px(d.dung), py(y1), px(d.dung) + 4, py(y1) + 12]
    else if (d.xien) { const [a, b] = d.xien; l = [px(x0), py(a * x0 + b), px(x1), py(a * x1 + b), px(x1) - 28, py(a * x1 + b) - 6] }
    if (l) { o.push(`<line x1="${so(l[0])}" y1="${so(l[1])}" x2="${so(l[2])}" y2="${so(l[3])}" stroke="currentColor" stroke-opacity=".6" stroke-dasharray="5 4"/>`); if (d.ten) o.push(`<text x="${so(l[4])}" y="${so(l[5])}" font-size="11.5" font-style="italic" text-anchor="end" fill="currentColor" fill-opacity=".85">${thoat(d.ten)}</text>`) }
  }
  const HUE = ['#2D9CDB', '#d9534f', '#2e8b57', '#b23a72']
  ;(sp.f ?? []).forEach((c, i) => {
    const fn = hamTu(c.e), [a, b] = c.x ?? [x0, x1], N = 800
    const ymin = y0 - (y1 - y0) * 0.35, ymax = y1 + (y1 - y0) * 0.35, nhay = (y1 - y0) * 0.75
    let d = '', mo = false, truoc = null
    for (let k = 0; k <= N; k++) {
      const x = a + ((b - a) * k) / N, y = fn(x)
      const ok = Number.isFinite(y) && y >= ymin && y <= ymax && !(truoc != null && Math.abs(y - truoc) > nhay)
      if (ok) { d += `${mo ? 'L' : 'M'}${so(px(x))} ${so(py(y))}`; mo = true; truoc = y } else { mo = false; truoc = Number.isFinite(y) ? y : null }
    }
    o.push(`<path d="${d}" fill="none" stroke="${HUE[i % 4]}" stroke-width="2.2" ${c.dut ? 'stroke-dasharray="6 4"' : ''} stroke-linejoin="round" clip-path="url(#kp)"/>`)
    if (c.ten) {
      const xt = c.xt ?? b - (b - a) * 0.12, yt = fn(xt)
      if (Number.isFinite(yt)) o.push(`<text x="${so(px(xt) + 6)}" y="${so(Math.min(Math.max(py(yt) - 6, 14), H - 8))}" font-size="12" font-style="italic" fill="${HUE[i % 4]}">${thoat(c.ten)}</text>`)
    }
  })
  for (const p of sp.diem ?? []) {
    if (p.chi !== false) {
      o.push(`<line x1="${so(px(p.x))}" y1="${so(py(p.y))}" x2="${so(px(p.x))}" y2="${so(py(ay))}" stroke="currentColor" stroke-opacity=".45" stroke-dasharray="3 3"/>`)
      o.push(`<line x1="${so(px(p.x))}" y1="${so(py(p.y))}" x2="${so(px(ax))}" y2="${so(py(p.y))}" stroke="currentColor" stroke-opacity=".45" stroke-dasharray="3 3"/>`)
    }
    o.push(`<circle cx="${so(px(p.x))}" cy="${so(py(p.y))}" r="3.6" fill="${p.rong ? 'var(--the,#fff)' : 'currentColor'}" stroke="currentColor" stroke-width="1.4"/>`)
    if (p.nhan) o.push(`<text x="${so(px(p.x) + 6)}" y="${so(py(p.y) - 7)}" font-size="12" fill="currentColor">${thoat(p.nhan)}</text>`)
  }
  o.push('</svg>')
  return o.join('')
}

export function veBBT(sp) {
  const xs = sp.x, n = xs.length, dau = sp.dau ?? [], chiDau = sp.hang === 'dau'
  if (dau.length !== n - 1) throw new Error(`BBT: ${n} cột x cần ${n - 1} dấu (có ${dau.length})`)
  if (!chiDau && (!sp.y || sp.y.length !== n)) throw new Error(`BBT: hàng y cần ${n} giá trị`)
  const kd = sp.kd ?? {}, LB = 78, CW = Math.max(74, Math.min(110, 560 / n)), W = LB + CW * n - CW / 2 + 22
  const H1 = 30, H2 = 30, H3 = chiDau ? 0 : 110, H = H1 + H2 + H3 + 4
  const cx = (i) => LB + CW * i + CW / 2 - CW / 2 + 12
  const vtri = (kieu, s) => (kieu === 'trai' ? (s === '+' ? 0 : 1) : (s === '+' ? 1 : 0)) // 0 = cao, 1 = thấp
  const yv = (v) => 3 + H1 + H2 + 14 + v * (H3 - 38) // v: 0 cao, 0.5 giữa, 1 thấp (px)
  const o = []
  o.push(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H + 6}" width="${W}" height="${H + 6}" role="img" aria-label="${thoat(sp.mo_ta ?? 'Bảng biến thiên')}" style="max-width:100%;height:auto;color:currentColor;font-family:system-ui,sans-serif">`)
  o.push(`<defs><marker id="mb" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto"><path d="M0 0L10 5L0 10z" fill="currentColor"/></marker></defs>`)
  o.push(`<rect x="2" y="2" width="${W - 4}" height="${H}" fill="none" stroke="currentColor" stroke-width="1.3"/>`)
  o.push(`<line x1="2" y1="${H1 + 2}" x2="${W - 2}" y2="${H1 + 2}" stroke="currentColor"/>`)
  o.push(`<line x1="${LB}" y1="2" x2="${LB}" y2="${H + 2}" stroke="currentColor"/>`)
  o.push(`<text x="${LB / 2}" y="22" font-size="14" font-style="italic" text-anchor="middle" fill="currentColor">x</text>`)
  if (!chiDau) o.push(`<line x1="2" y1="${H1 + H2 + 2}" x2="${W - 2}" y2="${H1 + H2 + 2}" stroke="currentColor"/>`)
  o.push(`<text x="${LB / 2}" y="${H1 + 23}" font-size="13.5" font-style="italic" text-anchor="middle" fill="currentColor">${thoat(sp.ten_dao ?? "y′")}</text>`)
  if (!chiDau) o.push(`<text x="${LB / 2}" y="${H1 + H2 + H3 / 2 + 6}" font-size="13.5" font-style="italic" text-anchor="middle" fill="currentColor">${thoat(sp.ten_ham ?? 'y')}</text>`)
  const nhay = (i) => kd[i] === '||' || kd[String(i)] === '||'
  xs.forEach((t, i) => {
    o.push(`<text x="${cx(i)}" y="22" font-size="13" text-anchor="middle" fill="currentColor">${thoat(t)}</text>`)
    if (i > 0 && i < n - 1) {
      if (nhay(i)) { o.push(`<line x1="${cx(i) - 2}" y1="${H1 + 3}" x2="${cx(i) - 2}" y2="${H + 1}" stroke="currentColor"/><line x1="${cx(i) + 2}" y1="${H1 + 3}" x2="${cx(i) + 2}" y2="${H + 1}" stroke="currentColor"/>`) }
      else o.push(`<text x="${cx(i)}" y="${H1 + 23}" font-size="13" text-anchor="middle" fill="currentColor">${thoat(kd[i] ?? '0')}</text>`)
    }
  })
  dau.forEach((s, i) => o.push(`<text x="${(cx(i) + cx(i + 1)) / 2}" y="${H1 + 23}" font-size="16" text-anchor="middle" fill="currentColor">${s === '+' ? '+' : '−'}</text>`))
  if (!chiDau) {
    const dau_ = dau.map((s) => (s === '-' || s === '−' ? '-' : '+'))
    const trai = (i) => (i === 0 ? null : vtri('trai', dau_[i - 1])), phai = (i) => (i === n - 1 ? null : vtri('phai', dau_[i]))
    const diem = [] // mỗi cột: {l:{v,y}, r:{v,y}}
    sp.y.forEach((g, i) => {
      const [gl, gp] = Array.isArray(g) ? g : [g, g]
      const tl = trai(i), tp = phai(i)
      let yl, yp
      if (Array.isArray(g)) { yl = tl == null ? yv(tp) : yv(tl); yp = tp == null ? yv(tl) : yv(tp) }
      else { const t = tl == null ? tp : tp == null ? tl : tl === tp ? tl : 0.5; yl = yp = yv(t) }
      const xl = Array.isArray(g) ? cx(i) - 6 : cx(i), xp = Array.isArray(g) ? cx(i) + 6 : cx(i)
      diem.push({ gl, gp, yl, yp, xl, xp, arr: Array.isArray(g) })
      if (Array.isArray(g)) {
        o.push(`<text x="${xl - 4}" y="${yl + 5}" font-size="13" text-anchor="end" fill="currentColor">${thoat(gl)}</text><text x="${xp + 4}" y="${yp + 5}" font-size="13" text-anchor="start" fill="currentColor">${thoat(gp)}</text>`)
      } else o.push(`<text x="${xl}" y="${yl + 5}" font-size="13" text-anchor="middle" fill="currentColor">${thoat(gl)}</text>`)
    })
    dau_.forEach((s, i) => {
      const a = diem[i], b = diem[i + 1]
      const x1 = a.arr ? a.xp + 5 + 22 : a.xp + 14, x2 = b.arr ? b.xl - 5 - 22 : b.xl - 14
      const ya = a.yp + (s === '+' ? -14 : 14) * -1, yb = b.yl + (s === '+' ? 14 : -14) * -1
      const y1 = s === '+' ? a.yp - 8 : a.yp + 8 - 2, y2 = s === '+' ? b.yl + 8 : b.yl - 8 + 2
      void ya; void yb
      o.push(`<line x1="${so(x1)}" y1="${so(s === '+' ? a.yp - 4 : a.yp + 4)}" x2="${so(x2)}" y2="${so(s === '+' ? b.yl + 4 : b.yl - 4)}" stroke="currentColor" stroke-width="1.4" marker-end="url(#mb)"/>`)
    })
  }
  o.push('</svg>')
  return o.join('')
}

export function veHinh(sp) {
  if (sp.loai === 'dothi') return veDoThi(sp)
  if (sp.loai === 'bbt') return veBBT(sp)
  throw new Error('loai hình phải là dothi | bbt')
}

// Tìm mọi [[HINH {...}]] trong chuỗi: trả về [{raw, sp}] — ném lỗi nếu JSON hỏng.
export function timHinh(s) {
  const kq = []
  for (const m of s.matchAll(/\[\[HINH ([^\n]*?)\]\](?=\s*$|\s*\n)/gm)) {
    let sp
    try { sp = JSON.parse(m[1]) } catch (e) { throw new Error(`JSON hình hỏng: ${m[1].slice(0, 60)}… (${e.message})`) }
    kq.push({ raw: m[0], sp })
  }
  return kq
}
