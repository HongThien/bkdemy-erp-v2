// KHUÔN Điền Ô cho dạng "Dãy phân số hiệu tích" T107010501/502 (60 câu, khảo sát 13/09: ≥5 khuôn con). Thùy chốt
// làm 2 khuôn CHÍNH trước, rồi mở rộng (13/09 tiếp) sau khi soi 27 câu bị bỏ — hầu hết KHÔNG khó về toán, chỉ là
// khuôn A ban đầu bắt cứng "bước nhảy mẫu số = 1" và chưa có route cho "x là hệ số NGOÀI tổng":
//   A "Tính tổng" — $VAR=\dfrac1{a.(a+S)}+...+\dfrac1{n.(n+S)}$, bước nhảy S≥1 (S=1: tách trực tiếp; S>1: kho
//     NHÂN CẢ TỔNG với S trước, tách, rồi CHIA LẠI cho S ở cuối — cùng lõi, chỉ thêm 1 bước).
//   B "Tìm x" — $\dfrac1{a(a+S)}+...+\dfrac1{x(x+S)}=TARGET$, x nằm Ở MẪU số hạng cuối.
//   C "Tìm x (hệ số ngoài)" — $\dfrac{x}{a.(a+1)}+...+\dfrac{x}{n.(n+1)}=TARGET$, x là HỆ SỐ nhân với cả tổng —
//     tính tổng trong ngoặc y hệt khuôn A (S=1) rồi thêm 1 bước chia ra x.
// Lõi toán CHUNG: 1/(k(k+S)) = (1/S)(1/k − 1/(k+S)) → tách thành hiệu rồi triệt giữa, chỉ còn 2 đầu mút.
// Không dùng AST của mcq-auto (biểu thức có "...", biến ẩn x, phân số lồng \dfrac) — trích XÁC ĐỊNH bằng regex neo
// vào TỪ KHOÁ đặc trưng của từng dòng (không suy luận lại toàn bộ cấu trúc), đáp số luôn máy tính lại rồi so với
// kho (nhân chứng thứ hai) — khớp KHÔNG thì bỏ câu, không đoán.
function dongCua(text) { const out = []; let p = 0; for (const l of text.split('\n')) { out.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 } return out }
const gcd = (a, b) => { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b] }; return a || 1n }
function fracOf(p, q) { if (q < 0n) { p = -p; q = -q } const g = gcd(p, q) || 1n; return { p: p / g, q: q / g } }
const fracEq = (a, b) => a.p === b.p && a.q === b.q
const fracStr = (f) => (f.q === 1n ? String(f.p) : `${f.p}/${f.q}`)
const daoDau = (s) => s.replace(/[+-]/g, (ch) => (ch === '+' ? '-' : '+')) // sai dấu: đảo NGƯỢC mọi dấu +/- trong cụm
// "\dfrac{p}{q}" hoặc số nguyên trần → Rat (dùng cho đáp số kho, KHÔNG cho biểu thức có biến)
function parseFracKho(s) {
  s = String(s).replace(/\\text\{(\d+)\}/g, '$1').replace(/\s/g, '').replace(/^\$|\$$/g, '')
  let m = s.match(/^-?\\dfrac\{(-?\d+)\}\{(-?\d+)\}$/) || s.match(/^-?\\frac\{(-?\d+)\}\{(-?\d+)\}$/)
  if (m) { const neg = s.startsWith('-'); return fracOf(BigInt(neg ? '-' + m[1].replace(/^-/, '') : m[1]), BigInt(m[2])) }
  if (/^-?\d+$/.test(s)) return fracOf(BigInt(s), 1n)
  return null
}
export const RULE_HIEUTICH = {
  D41: 'sai dấu khi tách 1 phân số thành hiệu 2 phân số',
  D42: 'lệch mẫu số cuối (số hạng cuối của dãy) đi 1 bước',
  D43: 'lệch mẫu số cuối đi 2 bước',
  D44: 'quên rút gọn phần triệt giữa, sai mẫu số ở kết quả cuối',
  D45: 'sai dấu ở kết quả sau khi triệt giữa',
  D46: 'lệch bước nhảy ở mẫu số cuối cùng (x+step) đi 1 đơn vị',
  D47: 'lệch bước nhảy ở mẫu số cuối cùng (x+step) đi ngược dấu',
  D48: 'thừa 1 bước nhảy ở mẫu số cuối cùng (x+step)',
}

// ── Khuôn A: "Tính tổng" — $VAR=\dfrac1{a.(a+S)}+...+\dfrac1{n.(n+S)}$, bước nhảy S≥1 ─────────────────────────────
// S=1: kho tách trực tiếp "VAR=1/a0 - 1/a1 + ...". S>1: kho NHÂN CẢ TỔNG với S trước ("S·VAR=S/(a0.a1)+...")
// rồi mới tách, cuối CHIA LẠI cho S ("VAR = (...) : S"). 2 ô 'tach_day'/'rut_gon' đọc ở vế "S·VAR" (S=1 thì
// chính là "VAR"), không cần thêm ô riêng cho bước nhân/chia (đã đủ 2 ô, tránh phình khuôn — có thể bổ sung sau).
export function timUngVienHieuTichA(q, ctx) {
  const { loai = [] } = ctx
  const mDe = q.noi_dung.match(/\$([^$]+)\$/)
  if (!mDe) { loai.push('không thấy $…$ trong đề'); return [] }
  const terms = [...mDe[1].matchAll(/\\dfrac\{1\}\{(\d+)\.(\d+)\}/g)].map((m) => [BigInt(m[1]), BigInt(m[2])])
  if (terms.length < 2) { loai.push('đề không đủ 2 số hạng tường minh dạng 1/(a.b)'); return [] }
  const [a0, a1] = terms[0], [nZ, n1] = terms[terms.length - 1]
  const S = a1 - a0
  if (S < 1n || n1 !== nZ + S) { loai.push('bước nhảy hạng đầu và hạng cuối không khớp nhau — khuôn con khác, bỏ'); return [] }
  const bien = (mDe[1].match(/^([A-Z])\s*=/) || [])[1]
  if (!bien) { loai.push('không tìm thấy biến ở đầu đề'); return [] }

  const correct = fracOf(n1 - a0, S * a0 * n1) // (1/a0 - 1/n1)/S = (n1-a0)/(S·a0·n1)
  const dapKho = parseFracKho(q.dap_an)
  if (!dapKho || !fracEq(dapKho, correct)) { loai.push(`đáp số kho "${q.dap_an}" ≠ máy tính ${fracStr(correct)}`); return [] }

  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []
  // Vế trái sau khi nhân S (S=1 thì chính là VAR): "3A", "2B"... ghép SỐ liền chữ, không khoảng trắng.
  const veTrai = S === 1n ? bien : `${S}${bien}`
  // Hạng tử đầu bên phải "=" luôn 1/a0; a0=1 kho viết KHÔNG NHẤT QUÁN — có câu TRẦN "1" (1/1=1), có câu vẫn
  // \dfrac{1}{1} — chấp nhận CẢ HAI, không suy đoán câu nào dùng cách nào.
  const dauHang = a0 === 1n ? `(?:1|\\\\dfrac\\{1\\}\\{1\\})` : `\\\\dfrac\\{1\\}\\{${a0}\\}`

  // ô1 'tach_day': dòng ĐẦU TIÊN "veTrai = 1/a0 - ..." (mẫu TRẦN từng số, phân biệt với đề dùng mẫu GHÉP "a.b")
  {
    const re = new RegExp(`\\$${veTrai}\\s*=\\s*(${dauHang}[\\s\\S]*?)\\$`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push(`tach_day: không thấy dòng tách "${veTrai}=1/${a0} - ..."`); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const markerLast = `{${n1}}`, posLast = exprDung.lastIndexOf(markerLast)
    if (posLast < 0) { loai.push('tach_day: không định vị lại mẫu số cuối trong cụm'); return [] }
    const mk = (w) => exprDung.slice(0, posLast) + `{${w}}` + exprDung.slice(posLast + markerLast.length)
    const pick = [
      { r: 'D42', text: mk(n1 - 1n), ds: RULE_HIEUTICH.D42 },
      { r: 'D43', text: mk(n1 + 1n), ds: RULE_HIEUTICH.D43 },
      { r: 'D41', text: daoDau(exprDung), ds: RULE_HIEUTICH.D41 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'tach_day', kieu: 'tap', v: `tach:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `tách mỗi phân số thành hiệu 2 phân số` })
    else loai.push(`tach_day: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  // ô2 'rut_gon': dòng "veTrai = 1/a0 - 1/n1" (bare, KHÔNG có gì khác ở vế phải ngoài 2 số hạng)
  {
    const re = new RegExp(`\\$${veTrai}\\s*=\\s*(${dauHang}\\s*-\\s*\\\\dfrac\\{1\\}\\{${n1}\\})\\s*(?:=|\\$)`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push(`rut_gon: không thấy dòng "${veTrai}=1/${a0}-1/${n1}" (đã triệt giữa)`); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const dau0 = exprDung.match(new RegExp(`^${dauHang}`))[0] // giữ ĐÚNG cách viết gốc (trần "1" hay \dfrac{1}{1}, hoặc \dfrac{1}{a0}) để dùng lại trong phương án sai
    const dau1 = a1 === 1n ? '1' : `\\dfrac{1}{${a1}}`
    const pick = [
      { r: 'D45', text: `${dau0}+\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D45 },
      { r: 'D42', text: `${dau0}-\\dfrac{1}{${n1 - 1n}}`, ds: RULE_HIEUTICH.D42 },
      { r: 'D44', text: `${dau1}-\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D44 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'rut_gon', kieu: 'tap', v: `rutgon:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `rút gọn sau khi các số hạng giữa triệt nhau` })
    else loai.push(`rut_gon: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  return cands
}

// ── Khuôn B: "Tìm x" — $\dfrac1{a(a+S)}+...+\dfrac1{x(x+S)}=TARGET$, có/không "Nhân cả 2 vế với S" ───────────────
export function timUngVienHieuTichB(q, ctx) {
  const { loai = [] } = ctx
  const mDe = q.noi_dung.match(/\\dfrac\{1\}\{(\d+)\.(\d+)\}[\s\S]*?\\dfrac\{1\}\{x\(x[+](\d+)\)\}\s*=\s*(\\dfrac\{\d+\}\{\d+\}|\d+)/)
  if (!mDe) { loai.push('không khớp khuôn "1/(a.(a+S))+...+1/(x(x+S))=target"'); return [] }
  const a0 = BigInt(mDe[1]), a1 = BigInt(mDe[2]), S = BigInt(mDe[3])
  if (a1 - a0 !== S) { loai.push(`bước nhảy hạng tử đầu (${a1}-${a0}) ≠ bước nhảy ở x(x+${mDe[3]})`); return [] }
  if (a0 !== 1n) { loai.push('hạng tử đầu không bắt đầu từ 1 — khuôn con khác, bỏ'); return [] }
  const target = parseFracKho(mDe[4])
  if (!target) { loai.push('không parse được vế phải của đề'); return [] }

  // Sum = target (đề) nhưng lời giải NHÂN CẢ 2 VẾ VỚI S trước khi tách ⇒ S·Sum = 1 − 1/(x+S) = S·target
  const sTarget = fracOf(target.p * S, target.q)
  const oneMinus = fracOf(sTarget.q - sTarget.p, sTarget.q) // 1 − S·target = 1/(x+S)
  if (oneMinus.p <= 0n) { loai.push('1 - target ≤ 0 — vô nghiệm theo công thức, bỏ'); return [] }
  // 1/(x+S) = oneMinus ⇒ x+S = oneMinus.q/oneMinus.p (phải nguyên vì oneMinus tối giản dạng 1/k)
  if (oneMinus.p !== 1n) { loai.push(`1-target = ${fracStr(oneMinus)} không phải dạng 1/k — công thức không áp dụng trực tiếp, bỏ`); return [] }
  const xPlusS = oneMinus.q, xTrue = xPlusS - S
  const dapKhoVal = (() => { try { return BigInt(String(q.dap_an).trim()) } catch { return null } })()
  if (dapKhoVal === null || dapKhoVal !== xTrue) { loai.push(`đáp số kho x=${q.dap_an} ≠ máy tính x=${xTrue}`); return [] }

  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []

  // ô1 'tach_day': dòng chứa "\dfrac{1}{x} -" — a0 luôn =1 ⇒ hạng tử đầu 1/a0=1/1=1 kho LUÔN viết TRẦN "1".
  {
    const re = new RegExp(`\\$(1[\\s\\S]*?\\\\dfrac\\{1\\}\\{x\\}\\s*-\\s*\\\\dfrac\\{1\\}\\{x\\+${S}\\})\\s*=`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push('tach_day: không thấy dòng tách chứa "1/x - 1/(x+S)"'); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const marker = `x+${S}`, posM = exprDung.lastIndexOf(marker)
    if (posM < 0) { loai.push('tach_day: không định vị lại "x+S" trong cụm'); return [] }
    const mk = (w) => exprDung.slice(0, posM) + w + exprDung.slice(posM + marker.length)
    const pick = [
      { r: 'D46', text: mk(`x+${S - 1n}`), ds: RULE_HIEUTICH.D46 },
      { r: 'D47', text: mk(`x-${S}`), ds: RULE_HIEUTICH.D47 },
      { r: 'D41', text: daoDau(exprDung), ds: RULE_HIEUTICH.D41 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'tach_day', kieu: 'tap', v: `tach:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `tách mỗi phân số thành hiệu 2 phân số (bước nhảy ${S})` })
    else loai.push(`tach_day: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  // ô2 'rut_gon': dòng "1 - \dfrac{1}{x+S} = target" (đã triệt giữa) — đục cụm "x+S"
  {
    const re = new RegExp(`\\$1\\s*-\\s*\\\\dfrac\\{1\\}\\{(x\\+${S})\\}\\s*=`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push('rut_gon: không thấy dòng "1 - 1/(x+S) = target"'); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge) // chỉ "x+S"
    const pick = [
      { r: 'D46', text: `x+${S - 1n}`, ds: RULE_HIEUTICH.D46 },
      { r: 'D48', text: `x+${S + 1n}`, ds: RULE_HIEUTICH.D48 },
      { r: 'D47', text: `x-${S}`, ds: RULE_HIEUTICH.D47 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'rut_gon', kieu: 'tap', v: `rutgon:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `mẫu số cuối sau khi triệt giữa (x + bước nhảy)` })
    else loai.push(`rut_gon: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  return cands
}

// ── Khuôn C: "Tìm x (hệ số ngoài)" — $\dfrac{x}{a.(a+1)}+...+\dfrac{x}{n.(n+1)}=TARGET$ ───────────────────────────
// x là HỆ SỐ nhân với cả tổng (không nằm ở mẫu). Tính tổng trong ngoặc y hệt khuôn A (luôn S=1 trong khảo sát
// 13/09) rồi chia ra x = target / tổng. 2 ô 'tach_day'/'rut_gon' đọc TRONG CẶP "\left(...\right)".
export function timUngVienHieuTichC(q, ctx) {
  const { loai = [] } = ctx
  const mDe = q.noi_dung.match(/\\dfrac\{x\}\{(\d+)\.(\d+)\}[\s\S]*?\\dfrac\{x\}\{(\d+)\.(\d+)\}\s*=\s*(\\dfrac\{-?\d+\}\{\d+\}|-?\d+)/)
  if (!mDe) { loai.push('không khớp khuôn "x/(a.(a+1))+...+x/(n.(n+1))=target"'); return [] }
  const a0 = BigInt(mDe[1]), a1 = BigInt(mDe[2]), nZ = BigInt(mDe[3]), n1 = BigInt(mDe[4])
  if (a1 !== a0 + 1n || n1 !== nZ + 1n) { loai.push('mẫu không phải cặp (k,k+1) liên tiếp — khuôn con khác, bỏ'); return [] }
  const target = parseFracKho(mDe[5])
  if (!target) { loai.push('không parse được vế phải của đề'); return [] }
  const tongTrongNgoac = fracOf(n1 - a0, a0 * n1) // 1/a0 - 1/n1
  if (tongTrongNgoac.p === 0n) { loai.push('tổng trong ngoặc = 0 — vô nghiệm, bỏ'); return [] }
  const xTrue = fracOf(target.p * tongTrongNgoac.q, target.q * tongTrongNgoac.p) // x = target / tongTrongNgoac
  const dapKho = parseFracKho(q.dap_an)
  if (!dapKho || !fracEq(dapKho, xTrue)) { loai.push(`đáp số kho x="${q.dap_an}" ≠ máy tính x=${fracStr(xTrue)}`); return [] }

  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []
  const dauHang = a0 === 1n ? `(?:1|\\\\dfrac\\{1\\}\\{1\\})` : `\\\\dfrac\\{1\\}\\{${a0}\\}`

  // ô1 'tach_day': trong ngoặc "x\left(1/a0 - ... \right)"
  {
    const re = new RegExp(`\\\\left\\(\\s*(${dauHang}[\\s\\S]*?)\\s*\\\\right\\)`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push('tach_day: không thấy cụm "\\left(1/a0 - ...\\right)"'); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const markerLast = `{${n1}}`, posLast = exprDung.lastIndexOf(markerLast)
    if (posLast < 0) { loai.push('tach_day: không định vị lại mẫu số cuối trong cụm'); return [] }
    const mk = (w) => exprDung.slice(0, posLast) + `{${w}}` + exprDung.slice(posLast + markerLast.length)
    const pick = [
      { r: 'D42', text: mk(n1 - 1n), ds: RULE_HIEUTICH.D42 },
      { r: 'D43', text: mk(n1 + 1n), ds: RULE_HIEUTICH.D43 },
      { r: 'D41', text: daoDau(exprDung), ds: RULE_HIEUTICH.D41 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'tach_day', kieu: 'tap', v: `tach:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `tách mỗi phân số thành hiệu 2 phân số (trong ngoặc)` })
    else loai.push(`tach_day: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  // ô2 'rut_gon': trong ngoặc "x\left(1/a0 - 1/n1\right)"
  {
    const re = new RegExp(`\\\\left\\(\\s*(${dauHang}\\s*-\\s*\\\\dfrac\\{1\\}\\{${n1}\\})\\s*\\\\right\\)`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push('rut_gon: không thấy cụm "\\left(1/a0-1/n1\\right)" (đã triệt giữa)'); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const dau0 = exprDung.match(new RegExp(`^${dauHang}`))[0]
    const dau1 = a1 === 1n ? '1' : `\\dfrac{1}{${a1}}`
    const pick = [
      { r: 'D45', text: `${dau0}+\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D45 },
      { r: 'D42', text: `${dau0}-\\dfrac{1}{${n1 - 1n}}`, ds: RULE_HIEUTICH.D42 },
      { r: 'D44', text: `${dau1}-\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D44 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'rut_gon', kieu: 'tap', v: `rutgon:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `rút gọn sau khi các số hạng giữa triệt nhau (trong ngoặc)` })
    else loai.push(`rut_gon: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  return cands
}

// ── Khuôn D: "liệt kê TỪNG CẶP riêng, nối bằng ' ; '" — dùng cho tử ĐỀ ≠ 1 hoặc mẫu cách >1 đơn vị mà kho không
// viết 1 chuỗi telescoping dài (khuôn A/C) mà viết MỖI cặp 1 đẳng thức 3 vế: "$\dfrac{T}{k.(k+S)} = \dfrac{...}
// {k.(k+S)} = \dfrac1k - \dfrac1{k+S}$" rồi "Vậy [...] = \dfrac1{a0} - \dfrac1{n1} = KẾT_QUẢ". Nhận ra 13/09 sau
// khi Thùy chỉ rõ "vẫn là hiệu tích, cho thêm nhân tử để đánh lạc hướng" — ĐÚNG: tới lúc liệt kê từng cặp thì
// TỬ HIỂN THỊ luôn tự nhiên = bước nhảy S (đóng gói hệ số ngoài xong RỒI mới liệt kê), nên khuôn D không cần đọc
// hiểu bọc ngoài (x-hằng=…, VAR=T(…), (…)·x=target…) — tự VERIFY qua CHÍNH đẳng thức liệt kê (luôn đúng khi
// T_hiển_thị=S) + khớp dòng "Vậy…=1/a0-1/n1" — không cần so với dap_an cuối cùng (dap_an có thể còn qua bước
// tính khác ở ngoài, vd nhân với 1 tổng khác — T107010501051). Bù lại KHÔNG dùng được cho câu thiếu cả 2 mốc này.
const RE_CAP = /\\dfrac\{(\d+)\}\{(\d+)\.(\d+)\}\s*=\s*\\dfrac\{[^{}]+\}\{\2\.\3\}\s*=\s*\\dfrac\{1\}\{\2\}\s*-\s*\\dfrac\{1\}\{\3\}/g
export function timUngVienHieuTichD(q, ctx) {
  const { loai = [] } = ctx
  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const hits = [...text.matchAll(RE_CAP)]
  if (hits.length < 2) { loai.push('khuôn D: không đủ ≥2 đẳng thức liệt kê dạng "T/(k.(k+S))=.../(k.(k+S))=1/k-1/(k+S)"'); return [] }
  const S = BigInt(hits[0][3]) - BigInt(hits[0][2])
  for (const h of [hits[0], hits[hits.length - 1]]) {
    if (BigInt(h[1]) !== S) { loai.push(`khuôn D: tử hiển thị (${h[1]}) ≠ bước nhảy (${S}) ở 1 đẳng thức — không phải "dạng chuẩn", bỏ`); return [] }
    if (BigInt(h[3]) - BigInt(h[2]) !== S) { loai.push('khuôn D: bước nhảy không nhất quán giữa các cặp liệt kê'); return [] }
  }
  const a0 = BigInt(hits[0][2]), n1 = BigInt(hits[hits.length - 1][3])
  const dungTong = fracOf(n1 - a0, a0 * n1) // 1/a0 - 1/n1 — nhân chứng: PHẢI khớp dòng "Vậy...=" tìm dưới đây

  const cands = []
  // ô1 'tach_day': đẳng thức liệt kê CUỐI CÙNG (đại diện) — đục CẢ 3 vế "T/(k.(k+S)) = .../(k.(k+S)) = 1/k-1/(k+S)"
  {
    const last = hits[hits.length - 1]
    const gs = last.index, ge = last.index + last[0].length
    const d = dong.find((dd) => gs >= dd.start && gs <= dd.end)
    if (!d) { loai.push('tach_day: không định vị được dòng chứa đẳng thức cuối'); return [] }
    const exprDung = text.slice(gs, ge)
    const kA = BigInt(last[2]), kB = BigInt(last[3])
    // MỘT LẦN QUÉT thay cả kA và kB (thay tuần tự 2 lần sẽ bị chồng: kA→kB rồi kB(mới)→kB+shift đè luôn số vừa thay)
    const mk = (shift) => exprDung.replace(new RegExp(`\\{(${kA}|${kB})\\}`, 'g'), (_, num) => `{${BigInt(num) + shift}}`)
    const pick = [
      { r: 'D42', text: mk(-1n), ds: RULE_HIEUTICH.D42 },
      { r: 'D43', text: mk(1n), ds: RULE_HIEUTICH.D43 },
      { r: 'D41', text: daoDau(exprDung), ds: RULE_HIEUTICH.D41 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'tach_day', kieu: 'tap', v: `tach:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `tách 1 cặp phân số thành hiệu (đại diện)` })
    else loai.push(`tach_day: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  // ô2 'rut_gon': dòng "Vậy ... = \dfrac1{a0} - \dfrac1{n1}" (nếu a0/n1 CHÍNH LÀ số nguyên viết trần khi =1)
  {
    const dauHang = a0 === 1n ? `(?:1|\\\\dfrac\\{1\\}\\{1\\})` : `\\\\dfrac\\{1\\}\\{${a0}\\}`
    // có thể bọc thêm hệ số ngoài "5(...)" / "5\left(...\right)" trước cụm rút gọn (T107010501052 kiểu) — cho phép bỏ qua
    // (\left? viết SAI ý ban đầu — "?" chỉ áp cho ký tự "t" cuối "\left" chứ không áp cho cả "\left"; sửa thành (?:\left)?).
    const re = new RegExp(`Vậy[\\s\\S]{0,200}?=\\s*(?:\\d+\\s*(?:\\\\left)?\\(\\s*)?(${dauHang}\\s*-\\s*\\\\dfrac\\{1\\}\\{${n1}\\})\\s*(?:=|\\)|\\$)`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push(`rut_gon: không thấy dòng "Vậy...=1/${a0}-1/${n1}"`); return [] }
    const [gs, ge] = hit.range
    const exprDung = text.slice(gs, ge)
    const dau0 = exprDung.match(new RegExp(`^${dauHang}`))[0]
    const dau1n = a0 + S === 1n ? '1' : `\\dfrac{1}{${a0 + S}}`
    const pick = [
      { r: 'D45', text: `${dau0}+\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D45 },
      { r: 'D42', text: `${dau0}-\\dfrac{1}{${n1 - S}}`, ds: RULE_HIEUTICH.D42 },
      { r: 'D44', text: `${dau1n}-\\dfrac{1}{${n1}}`, ds: RULE_HIEUTICH.D44 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length >= 3) cands.push({ vi_tri: 'rut_gon', kieu: 'tap', v: `rutgon:${exprDung}`, key: null, tok: { token: exprDung }, start: gs, end: ge,
      dong: dong.indexOf(hit.d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `rút gọn sau khi các số hạng giữa triệt nhau` })
    else loai.push(`rut_gon: chỉ ${uniq.length}/3 distractor khác nhau`)
  }

  return cands.length === 2 ? cands : []
}

// ── Khuôn E: "N số hạng LIỆT KÊ HẾT (không '...'), mẫu là BIẾN x liên tiếp" — Thùy chỉ trực tiếp trên ảnh chụp
// lời giải T107010501049 (13/09): "để 3 ô trống ở 3 biểu thức biến đổi đấy là được mà, đoạn tách ra thành 2
// phân số trừ đi nhau ấy" — MỖI dòng liệt kê là 1 Ô RIÊNG (khác Khuôn D chỉ đục 1 dòng ĐẠI DIỆN cho cả dãy dài,
// ở đây dãy NGẮN có hạn nên đục HẾT). Mỗi dòng: "$\dfrac1{(x+i)(x+i+1)} = \dfrac{...}{...} = \dfrac1{x+i}-\dfrac1{x+i+1}$"
// (i=0 viết "x" trần, không phải "x+0"). Đục CHỈ vế thứ 3 (kết quả tách), giữ 2 vế đầu để HS thấy đề bài.
const parseXOff = (m) => (m ? BigInt(m) : 0n)
const fmtXOff = (n) => (n === 0n ? 'x' : `x+${n}`)
const RE_LINE_E = new RegExp(String.raw`\$\\dfrac\{1\}\{\(?x(?:\+(?<i0>\d+))?\)?\(x\+(?<i1>\d+)\)\}\s*=\s*\\dfrac\{[^{}]+\}\{[^{}]+\}\s*=\s*(?<expr>\\dfrac\{1\}\{x(?:\+(?<j0>\d+))?\}\s*-\s*\\dfrac\{1\}\{x\+(?<j1>\d+)\})\$`)
export function timUngVienHieuTichE(q, ctx) {
  const { loai = [] } = ctx
  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []
  for (const d of dong) {
    const m = d.text.match(RE_LINE_E)
    if (!m) continue
    const g = m.groups
    const i0 = parseXOff(g.i0), i1 = BigInt(g.i1), j0 = parseXOff(g.j0), j1 = BigInt(g.j1)
    if (i1 !== i0 + 1n) { loai.push(`khuôn E: mẫu "(x+${i0})(x+${i1})" không phải 2 hạng LIÊN TIẾP — bỏ dòng`); continue }
    if (j0 !== i0 || j1 !== i1) { loai.push(`khuôn E: kết quả tách (x+${j0}, x+${j1}) không khớp mẫu gốc (x+${i0}, x+${i1}) — bỏ dòng`); continue }
    const start = d.start + d.text.indexOf(g.expr, m.index), end = start + g.expr.length
    const exprDung = text.slice(start, end)
    const pick = [
      { r: 'D46', text: `\\dfrac{1}{${fmtXOff(i0)}}-\\dfrac{1}{${fmtXOff(i1 - 1n >= 0n ? i1 - 1n : 0n)}}`, ds: RULE_HIEUTICH.D46 },
      { r: 'D48', text: `\\dfrac{1}{${fmtXOff(i0)}}-\\dfrac{1}{${fmtXOff(i1 + 1n)}}`, ds: RULE_HIEUTICH.D48 },
      { r: 'D41', text: daoDau(exprDung), ds: RULE_HIEUTICH.D41 },
    ]
    const uniq = dedupe(pick, exprDung)
    if (uniq.length < 3) { loai.push(`khuôn E: dòng (x+${i0},x+${i1}) chỉ ${uniq.length}/3 distractor khác nhau — bỏ dòng`); continue }
    cands.push({ vi_tri: `tach_day_${i0}`, kieu: 'tap', v: `tachE:${exprDung}`, key: null, tok: { token: exprDung }, start, end,
      dong: dong.indexOf(d), pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: `tách phân số hạng thứ ${i0 + 1n} thành hiệu` })
  }
  if (cands.length < 2) { loai.push(`khuôn E: chỉ tìm được ${cands.length}/≥2 dòng liệt kê hợp lệ`); return [] }
  return cands
}

// Dispatcher cho T107010501 (5 khuôn con A/B/C/D/E sống chung 1 dang_chinh). Phân biệt: đề có "x(x+" MÀ KHÔNG
// có "..." ⇒ liệt kê hết hữu hạn số hạng, dùng khuôn E (Thùy 13/09, ảnh chụp T107010501049) · có "x(x+" VÀ có
// "..." ⇒ khuôn B (chuỗi vô hạn theo x) · có ẩn x là HỆ SỐ "\dfrac{x}{...}" ⇒ khuôn C · còn lại thử A rồi D.
export function timUngVienHieuTich(q, ctx) {
  const mDe0 = q.noi_dung.match(/\$([^$]+)\$/)
  const coElip = mDe0 && /\.\.\.|\\ldots|\\dots|\.{4,}/.test(mDe0[1])
  if (/x\s*\(\s*x\s*[+]/.test(q.noi_dung)) return coElip ? timUngVienHieuTichB(q, ctx) : timUngVienHieuTichE(q, ctx)
  if (/\\dfrac\{x\}\{/.test(q.noi_dung)) return timUngVienHieuTichC(q, ctx)
  const loaiA = []
  const A = timUngVienHieuTichA(q, { loai: loaiA })
  if (A.length) return A
  return timUngVienHieuTichD(q, ctx)
}
function timDauTien(dong, re) {
  for (const d of dong) {
    const m = d.text.match(re)
    if (!m) continue
    const groupStart = d.text.indexOf(m[1], m.index)
    return { d, m, range: [d.start + groupStart, d.start + groupStart + m[1].length] }
  }
  return null
}
function dedupe(pick, correctText) {
  const seen = new Set([correctText.replace(/\s+/g, '')])
  const out = []
  for (const p of pick) { const k = p.text.replace(/\s+/g, ''); if (seen.has(k)) continue; seen.add(k); out.push(p) }
  return out
}
