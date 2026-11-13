import { pool, form, luu } from './lib.mjs'
// đơn vị diện tích tính theo mm² (BigInt) + "bậc" 10^k để dựng hệ số sai
const U = { 'mm': 1n, 'cm': 100n, 'dm': 10000n, 'm': 1000000n, 'ha': 10000000000n, 'km': 1000000000000n }
const LV = { mm: 0, cm: 2, dm: 4, m: 6, ha: 10, km: 12 } // log10 theo mm²
const chuan = (t) => t.replace(/\\text\{\s*([^}]*)\}/g, ' $1 ').replace(/\\mathrm\{\s*([^}]*)\}/g, ' $1 ').replace(/\\,/g, '').replace(/\$/g, ' ')
  .replace(/\^\{?2\}?/g, '²').replace(/\s+²/g, '²').replace(/\s+/g, ' ')
function fmtDec(v, den) { // v/den chính xác, dấu phẩy
  const neg = v < 0n; if (neg) v = -v
  const ip = v / den; let r = v % den; if (r === 0n) return (neg ? '-' : '') + ip
  let ds = ''; let cnt = 0
  while (r !== 0n && cnt < 12) { r *= 10n; ds += r / den; r %= den; cnt++ }
  if (r !== 0n) return null
  return (neg ? '-' : '') + ip + ',' + ds
}
const canon = (s) => String(s).replace(/\s/g, '').replace(/\./g, '')
export function phan(t, parts) { // (số, đơn vị)* -> tổng mm²
  let tot = 0n, den = 1n
  for (const [a, u] of parts) { const [i, f = ''] = a.split(','); const sc = 10n ** BigInt(f.length); tot = tot * sc + BigInt(i + f) * U[u] * (den === 1n ? 1n : 1n); den = den * sc }
  return [tot, den]
}
function giaTri(parts) { let sum = 0n, sc = 1n; // dùng mẫu chung
  const items = parts.map(([a, u]) => { const [i, f = ''] = a.split(','); return [BigInt(i + f), 10n ** BigInt(f.length), U[u]] })
  const L = items.reduce((m, x) => (x[1] > m ? x[1] : m), 1n)
  for (const [n, d, u] of items) sum += (n * (L / d)) * u
  return [sum, L] }
const out = []
const re = /(\d+(?:,\d+)?)\s*(km|ha|mm|cm|dm|m)(?:²)?(?:\s+(\d+(?:,\d+)?)\s*(km|ha|mm|cm|dm|m)(?:²)?)?\s*=\s*\.+\s*(km|ha|mm|cm|dm|m)²?/g
for (const c of pool().filter((c) => c.ma_dang_bai === 'NDB02143')) {
  const t = chuan(c.noi_dung); const tm = []; let m
  re.lastIndex = 0
  while ((m = re.exec(t))) tm.push(m)
  if (tm.length !== 2) { out.push({ ma_cau: c.ma_cau, bo: 'không phải khuôn 2 chỗ chấm đổi đơn vị' }); continue }
  const kho = c.dap_an.replace(/\.$/, '').split(';').map((s) => s.trim())
  if (kho.length !== 2) { out.push({ ma_cau: c.ma_cau, bo: 'đáp số kho không 2 phần' }); continue }
  const tinh = (m, mode) => {
    const parts = [[m[1], m[2]]]; if (m[3]) parts.push([m[3], m[4]])
    const tgt = m[5]; const [sum, L] = giaTri(parts)
    if (mode === 'dung') return fmtDec(sum, U[tgt] * L)
    if (mode === 'k10') { // R383: hệ số 10 thay vì 100 giữa 2 đơn vị liền kề (bậc 2); bậc khác: dùng căn bậc
      const wrong = (u) => 10n ** BigInt(Math.round(LV[u] / 2)); const w = parts.map(([a, u]) => [a, u])
      let s2 = 0n; const items = w.map(([a, u]) => { const [i, f = ''] = a.split(','); return [BigInt(i + f), 10n ** BigInt(f.length), wrong(u)] })
      for (const [n, d, u] of items) s2 += (n * (L / d)) * u
      return fmtDec(s2, wrong(tgt) * L) }
    if (mode === 'k1000') { // R384: nhân thêm 10 so với hệ số đúng ở mỗi đơn vị
      const items = parts.map(([a, u]) => { const [i, f = ''] = a.split(','); return [BigInt(i + f), 10n ** BigInt(f.length), U[u] * 10n ** BigInt(Math.round(LV[u] / 2) ? 0 : 0)] })
      let s2 = 0n; for (const [n, d, u] of items) s2 += (n * (L / d)) * u
      const lvDiff = Math.abs(LV[parts[0][1]] - LV[tgt]); const f = lvDiff <= 2 ? 10n : 100n
      const base = fmtDec(sum, U[tgt] * L); if (base === null) return null
      // đổi từ đơn vị lớn xuống nhỏ -> nhân; nhỏ lên lớn -> chia: lấy kết quả đúng × f (hoặc ÷ f) theo chiều đổi
      const lớnXuống = LV[parts[0][1]] > LV[tgt]
      return lớnXuống ? fmtDec(sum * f, U[tgt] * L) : fmtDec(sum, U[tgt] * L * f) }
    if (mode === 'ghep') { if (!m[3]) return null; return m[1] + m[3] } // R385: ghép liền hai số
    if (mode === 'doichieu') { // R388: nhân thay vì chia hoặc ngược lại (theo hệ số đúng)
      const lớnXuống = LV[parts[0][1]] > LV[tgt]; const base = sum
      return lớnXuống ? fmtDec(sum, U[tgt] * L * (U[parts[0][1]] / U[tgt] || 1n) * (U[parts[0][1]] / U[tgt] || 1n)) : null }
    return null }
  const dungP = [tinh(tm[0], 'dung'), tinh(tm[1], 'dung')]
  if (dungP.some((x) => x === null) || dungP.map(canon).join(';') !== kho.map(canon).join(';')) { out.push({ ma_cau: c.ma_cau, bo: `máy ${dungP.join('; ')} ≠ kho ${c.dap_an}` }); continue }
  const rule = { R383: 'k10', R384: 'k1000', R385: 'ghep', R388: 'doichieu' }
  const ten = { R383: 'dùng hệ số 10 thay vì 100 khi đổi đơn vị diện tích', R384: 'dùng hệ số 1 000 (hoặc 10 000) thay vì 100', R385: 'ghép liền hai số rồi coi là kết quả, không đổi từng phần', R388: 'đổi nhầm chiều: nhân thay vì chia (hoặc ngược lại)' }
  const ds = []
  for (const [rr, md] of Object.entries(rule)) {
    const p = tm.map((mm, i) => tinh(mm, md))
    const arr = p.map((x, i) => (x === null ? dungP[i] : x))
    if (md === 'ghep' && p.every((x) => x === null)) continue
    const txt = arr.join('; ')
    ds.push({ text: txt, rule: rr, duong_sai: ten[rr] })
  }
  out.push(form(c.ma_cau, dungP.join('; '), ds))
}
luu('k5_b2_dvdt', out)
