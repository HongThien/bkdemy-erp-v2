// KHUÔN Điền Ô cho dạng T106020601 "Dãy luỹ thừa cùng cơ số — tính bằng nhân hệ số rồi cộng/trừ 2 dãy" (44 câu).
// CEO 2 vòng góp ý (13/09):
//   (1) đầu: "đặc biệt hay sai dấu biến đổi khi trừ 2 dãy cho nhau".
//   (2) sau khi xem mẫu: "chỗ 4^m=4^31 (ô 'tìm m') dễ quá — bỏ. Để ô trống ở chỗ tính 4C=..., 3C=..., 3C+1=...".
// ⇒ THIẾT KẾ: app HS hiện bài THEO THỨ TỰ, "đến ô nào hiện đúng/sai ô đó rồi mới mở ô kế" (spec-dien-o.md §0.2) —
// một giá trị lặp lại ở NHIỀU DÒNG không phải "lộ đáp án" miễn lần lặp SAU nằm ở dòng ĐẾN SAU ô đã hỏi (HS chỉ thấy
// nó sau khi đã trả lời + đã được hiện đáp án đúng). Chỉ nguy hiểm khi giá trị đã hiện Ở DÒNG TRƯỚC ô định hỏi.
// ⇒ LUÔN đục ở LẦN XUẤT HIỆN SỚM NHẤT (theo thứ tự đọc) của mỗi giá trị — không còn phải né trùng lặp như bản trước.
// 2-3 ô/câu: 'nhan_he_so' (số mũ sau khi nhân hệ số, mọi câu) · 'hieu_2_day' (kết quả cộng/trừ 2 dãy, mọi câu) ·
// 'cong_1' (chỉ 11 câu có thêm "Biết kC+1=b^m, Tìm m" — bỏ hẳn ô "m=" vì quá lộ, thay bằng ô ở bước "+1" TRƯỚC đó).
// Không dùng AST của mcq-auto (biểu thức có "..." và biến A/B/C/D).
function dongCua(text) { const out = []; let p = 0; for (const l of text.split('\n')) { out.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 } return out }
function timDauTien(dong, re) { for (const d of dong) { const m = d.text.match(re); if (m) return { d, m } } return null }
const RE_HANG_DE = /^([A-Z])\s*=\s*1\s*([+-])\s*(?:\\text\{)?(\d+)\}?(?:\^\{?(\d+)\}?)?/ // "B=1+3+3^2+..." | "D=1-5+5^2-..." | "A=1+3^2+3^4+..."
const RE_LAST_TERM = /(?:\\ldots|\.\.\.\.?|\\dots)\s*[+-]\s*(?:\\text\{)?(\d+)\}?\^\{(\d+)\}\s*\$/ // số mũ CUỐI trong đề
const RE_RHS = /(?:\\text\{)?(\d+)\}?\s*\^\{?(\d+)\}?\s*([+-])\s*1\s*\$/g // "…3^{101}-1$" / "…\text{5}^{21}+1$" cuối 1 đoạn $…$
const RE_TIM_M = /\$\s*(\d*)([A-Z])\s*\+\s*1\s*=\s*(\d+)\^m\s*\$/ // đề "3C+1 = 4^m"
const powR = (b, n) => { let v = 1n; for (let i = 0n; i < n; i++) v *= b; return v }

// Đề → { bien, base, step, laDanDau, cuoi } — khảo sát 44/44 câu: bien=1 chữ hoa, "1" luôn là hạng tử đầu.
function extractDe(noiDung) {
  const mMath = noiDung.match(/\$([^$]+)\$/) // đề luôn "Tính $B=1+3+...+3^{100}$" — lấy nội dung TRONG $…$ trước khi khớp đầu chuỗi
  if (!mMath) return { loi: 'không thấy $…$ trong đề' }
  const m1 = mMath[1].match(RE_HANG_DE)
  if (!m1) return { loi: 'không khớp khuôn "VAR=1±BASE..." ở đầu đề' }
  const [, bien, dau2, baseTxt, expTerm2] = m1
  const base = BigInt(baseTxt)
  const laDanDau = dau2 === '-'
  const step = expTerm2 ? BigInt(expTerm2) : 1n // hạng tử 2 có số mũ tường minh (VD "3^2") ⇒ step=số mũ đó; không thì step=1
  const m2 = noiDung.match(RE_LAST_TERM)
  if (!m2) return { loi: 'không đọc được số mũ hạng tử CUỐI trong đề' }
  if (BigInt(m2[1]) !== base) return { loi: `cơ số hạng cuối (${m2[1]}) ≠ cơ số đầu (${base})` }
  const cuoi = BigInt(m2[2])
  return { bien, base, step, laDanDau, cuoi }
}

export function timUngVienLuyThua(q, ctx) {
  const { loai = [] } = ctx
  const de = extractDe(q.noi_dung)
  if (de.loi) { loai.push(de.loi); return [] }
  const { bien, base, step, laDanDau, cuoi } = de
  if (laDanDau && step !== 1n) { loai.push('dãy đan dấu + bước nhảy ≠1 — chưa gặp trong khảo sát, không suy diễn, bỏ'); return [] }
  const expDung = cuoi + step, dauDung = laDanDau ? '+' : '-'
  const heSoDung = laDanDau ? base ** step + 1n : base ** step - 1n // triệt 2 dãy: (b^step ∓ 1)·S = b^(cuối+step) ± 1

  const mTimM = q.noi_dung.match(RE_TIM_M)
  const laTimM = !!mTimM
  if (laTimM) {
    const heSoDe = mTimM[1] ? BigInt(mTimM[1]) : 1n
    if (mTimM[2] !== bien || heSoDe !== heSoDung || BigInt(mTimM[3]) !== base) { loai.push(`đề "Tìm m" (${mTimM[0]}) không khớp (${bien},${heSoDung},${base}) máy tính`); return [] }
    const dapKhoVal = BigInt(String(q.dap_an).trim())
    if (dapKhoVal !== expDung) { loai.push(`đáp số kho m=${dapKhoVal} ≠ máy tính m=${expDung}`); return [] }
  } else {
    // nhân chứng: đáp số kho phải KHỚP máy tự tính (S = (b^expDung ± 1)/heSoDung)
    const tuSo = dauDung === '+' ? powR(base, expDung) + 1n : powR(base, expDung) - 1n
    if (tuSo % heSoDung !== 0n) { loai.push(`máy tính (${base}^${expDung}${dauDung}1) không chia hết cho ${heSoDung} — công thức sai`); return [] }
    const sTrue = tuSo / heSoDung
    const dapKhoTxt = String(q.dap_an).replace(/\\text\{(\d+)\}/g, '$1').replace(/\s/g, '').replace(/^\$|\$$/g, '')
    let dapKhoVal = null
    const mFrac = dapKhoTxt.match(/^\\dfrac\{(\d+)\^\{?(\d+)\}?([+-])1\}\{(\d+)\}$/)
    const mBare = dapKhoTxt.match(/^(\d+)\^\{?(\d+)\}?([+-])1$/)
    if (mFrac && BigInt(mFrac[1]) === base && mFrac[3] === dauDung) dapKhoVal = (powR(base, BigInt(mFrac[2])) + (mFrac[3] === '+' ? 1n : -1n)) / BigInt(mFrac[4])
    else if (mBare && BigInt(mBare[1]) === base && mBare[3] === dauDung) dapKhoVal = powR(base, BigInt(mBare[2])) + (mBare[3] === '+' ? 1n : -1n)
    if (dapKhoVal === null || dapKhoVal !== sTrue) { loai.push(`đáp số kho "${q.dap_an}" không khớp máy tính S=(${base}^${expDung}${dauDung}1)/${heSoDung}`); return [] }
  }

  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []

  // ── ô1 'nhan_he_so': CẢ CỤM biểu thức sau khi nhân hệ số (không chỉ số mũ) — từ dấu "=" GẦN NHẤT trước lần ĐẦU
  //    xuất hiện "base^{expDung}" tới dấu "$" đóng dòng đó. VD "…= $4^1+4^2+\ldots+⟦4^{31}⟧$" nhưng chị chốt: đục
  //    NGUYÊN CỤM "4^1+4^2+\ldots+4^{31}", không chỉ số mũ — HS phải viết lại đúng cả dãy đã dịch số mũ, không
  //    được chỉ điền 1 số. Distractor = CÙNG cụm gốc (giữ "…\ldots…" y nguyên) nhưng đổi số mũ CUỐI.
  {
    const re = new RegExp(`(?:\\\\text\\{)?${base}\\}?\\^\\{(${expDung})\\}`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push(`nhan_he_so: không thấy "${base}^{${expDung}}" lần đầu trong lời giải`); return [] }
    const matchStart = hit.m.index
    const eqIdx = hit.d.text.lastIndexOf('=', matchStart)
    if (eqIdx < 0) { loai.push('nhan_he_so: không tìm thấy dấu "=" trước cụm biểu thức'); return [] }
    let cStart = eqIdx + 1; while (hit.d.text[cStart] === ' ') cStart++
    let cEnd = hit.d.text.indexOf('$', matchStart); if (cEnd < 0) { loai.push('nhan_he_so: không thấy "$" đóng dòng'); return [] }
    while (hit.d.text[cEnd - 1] === ' ') cEnd--
    const start = hit.d.start + cStart, end = hit.d.start + cEnd
    const exprDung = text.slice(start, end)
    const marker = `{${expDung}}`, posMarker = exprDung.lastIndexOf(marker)
    if (posMarker < 0) { loai.push('nhan_he_so: không định vị lại được số mũ trong cụm đã cắt'); return [] }
    const mkWrong = (w) => exprDung.slice(0, posMarker) + `{${w}}` + exprDung.slice(posMarker + marker.length)
    const pick = [
      { r: 'D27', text: mkWrong(cuoi), ds: RULE_LUYTHUA.D27 },
      { r: 'D33', text: mkWrong(expDung + step), ds: RULE_LUYTHUA.D33 },
      { r: 'D34', text: mkWrong(expDung + 2n * step), ds: RULE_LUYTHUA.D34 },
    ].map((p) => ({ ...p, kieu: 'tap' }))
    cands.push({ vi_tri: 'nhan_he_so', kieu: 'tap', v: `nhan:${exprDung}`, key: null, tok: { token: exprDung }, start, end,
      dong: dong.indexOf(hit.d), pick, tinh_tu: `biểu thức sau khi nhân ${base}^${step}` })
  }

  // ── ô2 'hieu_2_day': LẦN ĐẦU xuất hiện "base^{expDung}±1" (đúng chiều cộng/trừ) ────────────────────────────────
  {
    let hit = null
    for (const d of dong) {
      RE_RHS.lastIndex = 0
      let m
      while ((m = RE_RHS.exec(d.text))) { if (BigInt(m[1]) === base && BigInt(m[2]) === expDung && m[3] === dauDung) { hit = { d, start: d.start + m.index, end: d.start + m.index + m[0].length - 1 }; break } }
      if (hit) break
    }
    if (!hit) { loai.push(`hieu_2_day: không thấy "${base}^{${expDung}}${dauDung}1" trong lời giải`); return [] }
    const token = text.slice(hit.start, hit.end)
    const pick = [
      { r: 'D26', text: `${base}^{${expDung}}${dauDung === '+' ? '-' : '+'}1`, ds: RULE_LUYTHUA.D26 },
      { r: 'D27', text: `${base}^{${cuoi}}${dauDung}1`, ds: RULE_LUYTHUA.D27 },
      { r: 'D28', text: `${base}^{${expDung + step}}${dauDung}1`, ds: RULE_LUYTHUA.D28 },
    ].map((p) => ({ ...p, kieu: 'tap' }))
    cands.push({ vi_tri: 'hieu_2_day', kieu: 'tap', v: `hieu:${base}^${expDung}${dauDung}1`, key: null, tok: { token }, start: hit.start, end: hit.end,
      dong: dong.indexOf(hit.d), pick, tinh_tu: `${dauDung === '+' ? 'cộng' : 'trừ'} 2 dãy sau khi nhân ${base}^${step}` })
  }

  // ── ô3 'cong_1' (chỉ khuôn con "Tìm m"): dòng "$HỆ_SỐ·VAR+1 = base^{expDung}$" — bước cộng 1 vào 2 vế ──────────
  if (laTimM) {
    const re = new RegExp(`\\$(?:${heSoDung})?${bien}\\+1\\s*=\\s*(?:\\\\text\\{)?${base}\\}?\\^\\{(${expDung})\\}\\s*\\$`)
    const hit = timDauTien(dong, re)
    if (!hit) { loai.push('cong_1: không thấy dòng "HỆ_SỐ·VAR+1 = base^{expDung}"'); return [] }
    const eqPos = hit.m[0].indexOf('=')
    const afterEq = hit.m[0].slice(eqPos + 1, -1) // bỏ "=" và "$" cuối
    const leadWs = afterEq.length - afterEq.trimStart().length, trailWs = afterEq.length - afterEq.trimEnd().length
    const start = hit.d.start + hit.m.index + eqPos + 1 + leadWs
    const end = hit.d.start + hit.m.index + hit.m[0].length - 1 - trailWs
    const termFull = text.slice(start, end)
    const pick = [
      { r: 'D35', text: `${base}^{${expDung}}${dauDung}1`, ds: RULE_LUYTHUA.D35 },
      { r: 'D36', text: `${base}^{${expDung + 1n}}`, ds: RULE_LUYTHUA.D36 },
      { r: 'D37', text: `-${base}^{${expDung}}`, ds: RULE_LUYTHUA.D37 },
    ].map((p) => ({ ...p, kieu: 'tap' }))
    cands.push({ vi_tri: 'cong_1', kieu: 'tap', v: `cong1:${base}^${expDung}`, key: null, tok: { token: termFull }, start, end,
      dong: dong.indexOf(hit.d), pick, tinh_tu: `cộng 1 vào 2 vế để đưa về luỹ thừa thuần` })
  }

  return cands
}
export const RULE_LUYTHUA = {
  D26: 'nhầm dấu khi cộng/trừ 2 dãy cho nhau',
  D27: 'quên cộng thêm bước nhảy vào số mũ, dùng luôn số mũ cuối của đề',
  D28: 'cộng thừa bước nhảy vào số mũ',
  D33: 'cộng thừa 1 lần bước nhảy vào số mũ (khi chỉ mới nhân hệ số, chưa trừ)',
  D34: 'cộng thừa 2 lần bước nhảy vào số mũ',
  D35: 'quên cộng 1 vào vế phải, giữ nguyên như dòng trước',
  D36: 'cộng nhầm 1 vào số mũ thay vì cộng vào cả biểu thức',
  D37: 'sai dấu khi cộng 1 vào 2 vế',
}
