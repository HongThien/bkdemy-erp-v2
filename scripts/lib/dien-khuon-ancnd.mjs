// KHUÔN Điền Ô cho dạng T106030401 "Tìm số tự nhiên x để an+b chia hết cho cn+d" (139 câu, khảo sát 12/09 tối: 8 khuôn con,
// tất cả cùng đích tới "$cn+d \in U(r) = \{...\}$" rồi "Vậy $x \in \{...\}$" — 2 mốc này CÓ TRONG 139/139 câu, đủ ổn định để
// khoá vào, không cần phân biệt tay 8 khuôn con).
// CEO 12/09 tối: "an+b:cn+d hay sai đặc biệt ở chỗ tách xong thì số bên ngoài bị sai" ⇒ 3 vị trí đo trong 1 câu:
//   vi_tri 'so_ben_ngoai' — hằng số r còn lại sau khi tách (chỉ khi a≠0, thật có bước tách; a=0 thì r = số đề cho sẵn, không có gì để sai)
//   vi_tri 'tap_uoc'       — tập Ư(r) = {...}
//   vi_tri 'tap_n'         — tập nghiệm x/n cuối câu (sau khi lọc bằng "thử lại")
// KHÔNG dùng lại AST parser của mcq-auto (biểu thức có biến, AST đó không biểu diễn đa thức) — viết bộ đọc SỐ HỌC riêng
// (bigint), và QUAN TRỌNG: đáp số đúng của MỌI ô đều được MÁY TÍNH LẠI từ (a,b,c,d) đọc từ ĐỀ, không tin số trong lời giải —
// chỉ dùng lời giải để XÁC NHẬN vị trí (r/tập ước/tập nghiệm có xuất hiện đúng ở đó không); lệch giữa máy tính và lời giải ⇒
// bỏ câu (đẩy về kho chuẩn, không đoán — §1.5).
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] }; return a || 1n }
const divisorsOf = (n) => { n = n < 0n ? -n : n; const out = []; for (let i = 1n; i * i <= n; i++) if (n % i === 0n) { out.push(i); if (i !== n / i) out.push(n / i) } return out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0)) }
// "3n+5" | "x-1" | "2n+2" | "x+5" | "4" (bare, a=0) → {coef, const} theo BIẾN varChar. Không hỗ trợ ×/phân số — đề dạng này luôn tuyến tính nguyên.
function parseLin(sRaw, varChar) {
  const s = String(sRaw).replace(/\\left|\\right|\s/g, '').replace(/^\$|\$$/g, '')
  if (!s.includes(varChar)) { if (!/^-?\d+$/.test(s)) return null; return { coef: 0n, const: BigInt(s) } }
  const m = s.match(new RegExp(`^([+-]?\\d*)${varChar}([+-]\\d+)?$`))
  if (!m) return null
  const coefStr = m[1]
  const coef = coefStr === '' || coefStr === '+' ? 1n : coefStr === '-' ? -1n : BigInt(coefStr)
  const cst = m[2] ? BigInt(m[2]) : 0n
  return { coef, const: cst }
}
// Đề: "Tìm số tự nhiên $VAR$ để (SỐ|$BIỂU_THỨC$) chia hết cho $BIỂU_THỨC$." → {varChar, a, b, c, d}
function extractDe(noiDung) {
  const v = (noiDung.match(/số tự nhiên\s*\$\s*([a-z])\s*\$/) || [])[1]
  if (!v) return { loi: 'không tìm thấy biến "số tự nhiên $x$"' }
  const m = noiDung.match(/(?:\$([^$]+?)\$|(\d+))\s*chia hết cho\s*\$([^$]+?)\$/)
  if (!m) return { loi: 'không khớp khuôn "... chia hết cho ..."' }
  const soHang = m[1] ?? m[2]
  const numer = parseLin(soHang, v), denom = parseLin(m[3], v)
  if (!numer || !denom) return { loi: `không parse được "${soHang}" hoặc "${m[3]}"` }
  return { v, a: numer.coef, b: numer.const, c: denom.coef, d: denom.const, numerRaw: soHang.trim(), denomRaw: m[3].trim() }
}
// Máy tự giải: mọi u > 0 là ước của r=|a·d−c·b| (điều kiện CẦN, luôn đúng dù kho có rút gọn hệ số hay không) → var=(u−d)/c
// phải là số tự nhiên, rồi lọc lại bằng chính điều kiện chia hết THẬT (an+b) mod u === 0 (đây chính là bước "thử lại" —
// máy làm lại từ gốc, không suy diễn theo cách rút gọn của kho).
function tuGiai({ a, b, c, d }) {
  // a = k·c ĐÚNG BỘI (c chia hết a) ⇒ tách CHÍNH XÁC (không cần nhân 2 vế với c, không có nghiệm ngoại lai, KHÔNG cần thử
  // lại) dùng r rút gọn = |b − (a/c)·d| — kho luôn ưu tiên cách này khi làm được (khảo sát 12/09: nhóm 'nhanHS_khongThuLai').
  // Ngược lại phải nhân cả 2 vế với c trước khi tách ⇒ r đầy đủ = |a·d − c·b| = c · r_rút_gọn, CÓ THỂ sinh nghiệm ngoại lai
  // (kho làm 'thử lại' đúng lúc này). Không tự chọn theo suy diễn — thử r rút gọn trước, khớp lời giải thì dùng, không thì
  // r đầy đủ mới là giá trị đem so ở bước gọi (hàm chỉ trả CẢ HAI, người gọi tự so với U(...) trong lời giải để chọn đúng).
  const rGon = (c !== 0n && a % c === 0n) ? absN(b - (a / c) * d) : null
  const rDay = absN(a * d - c * b)
  return { rGon, rDay }
}
function tuGiaiTheoR(absR, { a, b, c, d }) {
  if (absR === 0n) return null
  const divs = divisorsOf(absR)
  const truoc = [], sau = []
  for (const u of divs) {
    const num = u - d
    if (c === 0n || num % c !== 0n) continue
    const nVal = num / c
    if (nVal < 0n) continue
    truoc.push(nVal)
    if ((a * nVal + b) % u === 0n) sau.push(nVal)
  }
  const uniqSort = (arr) => [...new Set(arr.map(String))].map(BigInt).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))
  return { r: absR, divs, truoc: uniqSort(truoc), sau: uniqSort(sau) }
}
function dongCua(text) { const out = []; let p = 0; for (const l of text.split('\n')) { out.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 } return out }
const setText = (arr) => `\\{${arr.map(String).join(';')}\\}`

export const RULE_ANCND = {
  D12: 'tính hệ số nhân để triệt biến sai (quên chia/nhân hệ số mẫu số cho đúng)',
  D13: 'cộng thay vì trừ khi tách ra số dư (sai dấu)',
  D14: 'đảo vai trò hằng số tử/mẫu khi tính số dư',
  D15: 'nhân chéo nhầm vai trò hệ số biến và hằng số khi tính số dư',
  D16: 'tính số dư lệch thêm 1 lần hệ số mẫu số',
  D24: 'tính số dư lệch 1 đơn vị (trừ nhầm)',
  D25: 'tính số dư lệch 1 đơn vị (cộng nhầm)',
  D17: 'liệt kê tập ước thiếu chính số đó (ước lớn nhất)',
  D18: 'liệt kê tập ước thiếu số 1 (ước nhỏ nhất)',
  D19: 'liệt kê tập ước thừa 1 số không phải ước',
  D20: 'quên thử lại, giữ luôn nghiệm không thoả mãn chia hết thật',
  D21: 'bỏ sót 1 nghiệm hợp lệ trong tập nghiệm cuối',
  D22: 'liệt kê tập nghiệm thừa 1 giá trị không phải nghiệm',
  D23: 'lệch 1 đơn vị ở một nghiệm trong tập nghiệm cuối',
  D38: 'dùng biến gốc, quên biểu thức mẫu (không trừ/cộng hằng số)',
  D39: 'đảo vai trò trong quan hệ chia hết — nhầm cái nào thuộc ước của cái nào',
  D40: 'nhầm Ước (U) thành Bội (B)',
}

export function timUngVienAnCnD(q, ctx) {
  const { loai = [] } = ctx
  const de = extractDe(q.noi_dung)
  if (de.loi) { loai.push(de.loi); return [] }
  const { v, a, b, c, d } = de
  const { rGon, rDay } = tuGiai({ a, b, c, d })
  if (rGon === 0n || rDay === 0n) { loai.push('r = 0 (a·d = c·b) — vô số nghiệm hoặc vô nghiệm, ngoài phạm vi khuôn 4 phương án'); return [] }

  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const mU = text.match(/[UƯ]\s*\(\s*(-?\d+)\s*\)\s*=\s*\\\{([^}]*)\\\}/)
  if (!mU) { loai.push('không thấy "U(r)={...}" trong lời giải'); return [] }
  const rKho = BigInt(mU[1])
  // Kho ưu tiên r RÚT GỌN khi tách được chính xác (a chia hết cho c); không tách được thì dùng r ĐẦY ĐỦ (nhân 2 vế với c).
  // Không suy diễn cách kho làm — thử khớp với CHÍNH SỐ trong lời giải, khớp cái nào dùng cái đó, không khớp cái nào thì bỏ.
  const r = rKho === rGon ? rGon : rKho === rDay ? rDay : null
  if (r === null) { loai.push(`máy tính r_rút_gọn=${rGon ?? '(không áp dụng)'} · r_đầy_đủ=${rDay} — cả hai ≠ r trong lời giải U(${rKho})`); return [] }
  const giai = tuGiaiTheoR(r, { a, b, c, d })
  const { divs, sau } = giai
  // nhân chứng: đáp số kho phải KHỚP tập nghiệm máy tự giải (so nội dung, không so số lượng — §2 CLAUDE.md)
  const dapKho = String(q.dap_an).replace(/\$/g, '').replace(/x\s*\\in\s*/, '').replace(/n\s*=\s*/, '').replace(/\\\{|\\\}/g, '').split(';').map((s) => s.trim()).filter(Boolean)
  let dapKhoSet; try { dapKhoSet = dapKho.map((s) => BigInt(s)).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)) } catch { loai.push(`đáp số kho "${q.dap_an}" không parse được thành tập số`); return [] }
  if (dapKhoSet.length !== sau.length || dapKhoSet.some((x, i) => x !== sau[i])) { loai.push(`máy giải ra {${sau.join(';')}} ≠ đáp số kho {${dapKhoSet.join(';')}}`); return [] }

  const divsKho = mU[2].split(';').map((s) => s.trim()).filter(Boolean)
  let divsKhoN; try { divsKhoN = divsKho.map((s) => BigInt(s)).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)) } catch { loai.push(`U(${r})={...} trong lời giải không parse được`); return [] }
  if (divsKhoN.length !== divs.length || divsKhoN.some((x, i) => x !== divs[i])) { loai.push(`tập ước lời giải {${divsKhoN.join(';')}} ≠ tập ước thật của ${r} {${divs.join(';')}}`); return [] }

  const cands = []

  // ── ô "so_ben_ngoai" (chỉ khi a≠0 — có bước tách thật; a=0 thì r = số đề cho sẵn, chép lại, không phải suy luận) ──
  if (a !== 0n) {
    const uPos = mU.index
    const truoc = text.slice(0, uPos)
    // Ưu tiên dòng "$R$ chia hết cho ..." / "$R \vdots (...)$" — bare statement gần U(...) nhất; không thấy thì lùi vào chính chữ số trong U(...).
    // "seg" phải là ĐÚNG chuỗi con chữ số R (không phải cả câu "3 \vdots (x-1)") — tìm digit-token khớp đầu/cuối bằng \vdots.
    let mm = null, seg = null
    for (const m2 of truoc.matchAll(/\$([^$]+?)\$/g)) {
      const t = m2[1].trim()
      if (t === String(r)) { mm = m2; seg = t; continue }
      const md = t.match(new RegExp(`(?:^|\\\\vdots)\\s*(${r})\\s*(?:\\\\vdots|$)`))
      if (md && (t.includes('\\vdots') || /chia hết cho/.test(t))) { mm = m2; seg = md[1] }
    }
    let start, end, token
    if (mm) { const innerStart = mm.index + 1 + mm[1].indexOf(seg); start = innerStart; end = innerStart + seg.length; token = seg }
    else { start = uU_digitStart(text, mU); end = start + mU[1].length; token = mU[1] } // fallback: chính chữ số r trong "U(r)"
    if (start != null) {
      // Distractor phụ thuộc kho tách theo cách RÚT GỌN (k=a/c, không cần nhân 2 vế) hay ĐẦY ĐỦ (nhân 2 vế với c) — 2 cách
      // ra 2 công thức đúng khác nhau nên "cái sai" cũng phải tính theo ĐÚNG cách kho đang dùng ở câu này (r === rGon hay rDay).
      const chinhPool = r === rGon
        ? [{ r: 'D12', v: absN(b - a * d) },                 // quên chia a cho c trước khi lấy làm hệ số nhân
           { r: 'D13', v: absN(b + (a / c) * d) },            // sai dấu: cộng thay vì trừ
           { r: 'D14', v: absN(d - (a / c) * b) }]            // đảo vai trò b/d
        : [{ r: 'D12', v: absN(a * d - b) },                  // quên nhân c vào b trước khi trừ
           { r: 'D13', v: absN(a * d + c * b) },              // sai dấu: cộng thay vì trừ
           { r: 'D15', v: absN(a * b - c * d) }]              // nhân chéo nhầm vai trò hệ số/hằng số
      const seen = new Set([r.toString()])
      const duPhongPool = [{ r: 'D16', v: absN(r + c) }, { r: 'D24', v: absN(r - 1n) }, { r: 'D25', v: absN(r + 1n) }]
      const pick = []
      for (const cand of chinhPool) { if (pick.length >= 3) break; if (cand.v === 0n) continue; const k = cand.v.toString(); if (seen.has(k)) continue; seen.add(k); pick.push(cand) }
      for (const cand of duPhongPool) { if (pick.length >= 3) break; const k = cand.v.toString(); if (seen.has(k)) continue; seen.add(k); pick.push(cand) }
      if (pick.length === 3) {
        cands.push({ vi_tri: 'so_ben_ngoai', kieu: 'gia_tri', v: r.toString(), key: null, tok: { token }, start, end, dong: dong.findIndex((dd) => start >= dd.start && start <= dd.end),
          pick: pick.map((p) => ({ r: p.r, text: p.v.toString(), ds: RULE_ANCND[p.r] })), tinh_tu: `số dư sau khi tách (a,b,c,d)=(${a},${b},${c},${d})` })
      } else loai.push(`so_ben_ngoai: chỉ ${pick.length}/3 distractor khác nhau`)
    } else loai.push('so_ben_ngoai: không định vị được vị trí r trong lời giải')
  }

  // ── ô "menh_de_uoc": "denomExpr \in U(r)" — CEO 13/09: "4 chia hết cho x-1 thì x-1 thuộc ước của 4" — mệnh đề
  //    biểu thức mẫu THUỘC ước của r, tách RIÊNG khỏi ô tap_uoc (ô đó chỉ đục tập số {...}, không đụng "U(r)").
  {
    const before = text.slice(0, mU.index)
    const md = before.match(/\$(?:\s*\\Rightarrow\s*|\s*nên\s*)?([^$]*?)\s*\\in\s*$/d)
    const denomExpr = md ? md[1].trim() : null
    if (md && denomExpr) {
      const [gs, ge] = md.indices[1]
      const pick = [
        { r: 'D38', text: `${v}\\in U(${r})`, ds: RULE_ANCND.D38 },
        { r: 'D39', text: `${r}\\in U(${denomExpr})`, ds: RULE_ANCND.D39 },
        { r: 'D40', text: `${denomExpr}\\in B(${r})`, ds: RULE_ANCND.D40 },
      ].map((p) => ({ ...p, kieu: 'tap' }))
      const seenT = new Set([`${denomExpr}\\in U(${r})`])
      const uniq = pick.filter((p) => { if (seenT.has(p.text)) return false; seenT.add(p.text); return true })
      if (uniq.length >= 3) {
        cands.push({ vi_tri: 'menh_de_uoc', kieu: 'tap', v: `menhde:${denomExpr}\\in U(${r})`, key: null, tok: { token: denomExpr }, start: gs, end: ge,
          dong: dong.findIndex((dd) => gs >= dd.start && gs <= dd.end), pick: uniq.slice(0, 3), tinh_tu: `mệnh đề "${denomExpr} thuộc ước của ${r}"` })
      } else loai.push(`menh_de_uoc: chỉ ${uniq.length}/3 distractor khác nhau`)
    } else loai.push('menh_de_uoc: không định vị được biểu thức mẫu ngay trước "U(r)"')
  }

  // ── ô "tap_uoc": U(r) = ⟦{...}⟧ ─────────────────────────────────────────────────────────────────────────────────
  {
    const braceStart = text.indexOf('\\{', mU.index), braceEnd = text.indexOf('\\}', braceStart) + 2
    if (braceStart >= 0 && braceEnd > braceStart) {
      const pick = []
      if (divs.length >= 2) pick.push({ r: 'D17', text: setText(divs.slice(0, -1)), ds: RULE_ANCND.D17 })
      if (divs.length >= 2) pick.push({ r: 'D18', text: setText(divs.slice(1)), ds: RULE_ANCND.D18 })
      pick.push({ r: 'D19', text: setText([...divs, r + 1n]), ds: RULE_ANCND.D19 })
      if (divs.length < 2) pick.push({ r: 'D19', text: setText([2n * r]), ds: RULE_ANCND.D19 }) // r nguyên tố: chỉ 1 distractor thật từ D19 dạng khác — thêm biến thể
      const uniq = []; const seenT = new Set([setText(divs)])
      for (const p of pick) { if (seenT.has(p.text)) continue; seenT.add(p.text); uniq.push(p) }
      if (uniq.length >= 3) {
        cands.push({ vi_tri: 'tap_uoc', kieu: 'tap', v: 'uoc:' + setText(divs), key: null, tok: { token: text.slice(braceStart, braceEnd) }, start: braceStart, end: braceEnd,
          dong: dong.findIndex((dd) => braceStart >= dd.start && braceStart <= dd.end), pick: uniq.slice(0, 3), tinh_tu: `tập ước của ${r}` })
      } else loai.push(`tap_uoc: chỉ ${uniq.length}/3 distractor khác nhau`)
    } else loai.push('tap_uoc: không định vị được "{...}" trong U(r)')
  }

  // ── ô "tap_n": kết luận cuối câu — "Vậy $x \in \{...\}$" hoặc chỉ "$\Rightarrow x \in \{...\}$" không có chữ "Vậy"
  // (8 khuôn con lời giải không đồng nhất cách kết — quét NGƯỢC từ cuối, lấy dòng CUỐI CÙNG khớp "$var quan_hệ giá_trị$") ──
  const reKetLuan = new RegExp(`\\$\\s*(?:\\\\Rightarrow\\s*)?${v}\\s*(\\\\in\\s*\\\\\\{[^}]*\\\\\\}|=\\s*-?\\d+)\\s*\\$`)
  {
    const dongVay = [...dong].reverse().find((dd) => reKetLuan.test(dd.text))
    const mV = dongVay ? dongVay.text.match(reKetLuan) : null
    if (mV) {
      const grp = mV[1], isSet = grp.includes('\\in')
      const relStart = mV.index + mV[0].indexOf(grp)
      const valStart = isSet ? relStart + grp.indexOf('\\{') : relStart + grp.indexOf('=') + 1
      const valEnd = isSet ? relStart + grp.lastIndexOf('\\}') + 2 : relStart + grp.length
      const token = dongVay.text.slice(valStart, valEnd)
      const fmt = (arr) => (isSet ? setText(arr) : String(arr[0]))
      const drop1 = sau.length > 1 ? sau.slice(1) : []
      const nMax = sau.length ? sau[sau.length - 1] : 0n, extra = nMax + 1n
      const pick = []
      const truocLoc = giai.truoc.filter((x) => !sau.some((y) => y === x))
      if (truocLoc.length) pick.push({ r: 'D20', text: fmt([...sau, ...truocLoc].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0))), ds: RULE_ANCND.D20 })
      if (drop1.length || sau.length === 1) pick.push({ r: 'D21', text: drop1.length ? fmt(drop1) : '\\{\\}', ds: RULE_ANCND.D21 })
      pick.push({ r: 'D22', text: fmt([...sau, extra]), ds: RULE_ANCND.D22 })
      if (sau.length) pick.push({ r: 'D23', text: fmt([sau[0] + 1n, ...sau.slice(1)]), ds: RULE_ANCND.D23 })
      const uniq = []; const seenT = new Set([fmt(sau)])
      for (const p of pick) { if (seenT.has(p.text)) continue; seenT.add(p.text); uniq.push(p) }
      if (uniq.length >= 3) {
        cands.push({ vi_tri: 'tap_n', kieu: 'tap', v: 'nghiem:' + fmt(sau), key: null, tok: { token }, start: dongVay.start + valStart, end: dongVay.start + valEnd,
          dong: dong.indexOf(dongVay), pick: uniq.slice(0, 3), tinh_tu: `tập nghiệm ${v} sau khi thử lại` })
      } else loai.push(`tap_n: chỉ ${uniq.length}/3 distractor khác nhau`)
    } else loai.push('tap_n: không thấy dòng "Vậy $x \\in {...}$" / "Vậy $n=...$"')
  }

  return cands
}
function absN(x) { return x < 0n ? -x : x }
function uU_digitStart(text, mU) { return text.indexOf(mU[1], mU.index + mU[0].indexOf('(')) }
