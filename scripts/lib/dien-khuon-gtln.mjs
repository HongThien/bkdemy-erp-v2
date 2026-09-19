// KHUÔN Điền Ô cho dạng 077022220401 "Tìm GTLN/GTNN của biểu thức có √ / |…| / (…)^chẵn" (khối 7, 87 câu, khảo sát 12/09:
// 100% lời giải cùng 1 khuôn: … ⇒ A ≤/≥ c · "Dấu bằng xảy ra khi E=0 ⇒ x = v" (1 biến) hoặc hệ 2 biến trong \begin{array}).
// CEO 12/09: chỗ HS hay sai nhất là ĐẢO CHIỀU khi biến đổi (A > B thì C − A < C − B) ⇒ ô1 = dòng ĐẢO CHIỀU (GTLN) / kết luận (GTNN), HS chọn
// "chiều + hằng số" (ô kiểu QUAN HỆ, không phải giá trị); ô2/ô3 = giá trị x (và y) ở dấu bằng, phương án sai = engine tìm x
// (chuyển vế không đổi dấu R19, chia ngược R20, dấu R10…) áp lên đúng phương trình đứng ngay trước "x =".
// Trả về ứng viên ô cùng cấu trúc với bộ đọc chung (mcq-dien.mjs sinhCau) để dùng chung phần chọn ô / đục lỗ / cân A-D.
// Mỗi ô mang `vi_tri` (tinh_chat_khong_am · bien_doi · dao_chieu · x · y) — CEO 12/09 tối: form LƯU HẾT ô, giao bài mới chọn
// tổ hợp 3 ô xoay vòng theo vị trí ("giết nhầm còn hơn bỏ sót", sau này biết HS hay sai ở đâu).
import { parse, solve, canonOf, evalRule, ev } from '../mcq-auto.mjs'
import { chuanManh, fmtNhu, kieuToken } from './dien-buoc.mjs'

// Mã rule riêng của Điền Ô = tiền tố D (D01–D06), KHÔNG dùng R: 2 lần trong 1 giờ (12/09) luồng form-tn chiếm đúng mã R tôi vừa đặt
// (R89–R99 rồi R125–R129) — đua max(ma) với luồng khác là vô ích, tách không gian mã là cách duy nhất chắc. Seed: migration 202609121527_mcq_rule_dien_d01_d06.sql
export const RULE_QH = {
  D01: 'không đảo chiều bất đẳng thức khi nhân với số âm / lấy C − A',
  D02: 'sai dấu hằng số khi kết luận (đổi dấu c cùng với chiều)',
  D03: 'quên dấu bằng, viết bất đẳng thức nghiêm ngặt',
  D04: '|…| = 0 hoặc (…)² = 0 mà kết luận x = 0, không giải biểu thức bên trong',
  D05: 'chuyển vế đúng nhưng quên chia cho hệ số của x',
  D06: 'vừa không đảo chiều vừa bỏ dấu bằng (viết > thay vì ≤)',
  D07: 'nhầm chiều tính chất không âm: viết |…| ≤ 0 / √… ≤ 0 / (…)² ≤ 0',
  D08: 'bỏ dấu |…| / √ / (…)², coi biểu thức bên trong ≥ 0 (nhầm điều kiện xác định thành chặn dưới)',
  D09: 'cộng/trừ hằng số vào 2 vế mà sai dấu hằng số ở vế phải (0 + 17 viết thành 0 − 17)',
  D10: 'đảo chiều bất đẳng thức khi cộng hằng số / nhân với số dương (không được đảo mà đảo)',
  D11: 'nhân 2 vế với k mà vế phải 0 viết thành k (2|x−4| ≥ 2)',
}
const RULE_X = ['R19', 'R20', 'R10', 'R04', 'R21', 'R22', 'R16', 'R11', 'R31', 'D04', 'D05', 'R05']

// Chuỗi text lời giải → dòng {start,end,text}
function dongCua(text) { const out = []; let p = 0; for (const l of text.split('\n')) { out.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 } return out }
const NUM = String.raw`-?\\dfrac\{\d+\}\{\d+\}|-?\d+(?:,\d+)?`

export function timUngVienGtln(q, ctx) {
  const { ruleUsed = {}, loai = [] } = ctx
  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const cands = []
  // ── ô1: dòng kết luận "$\Rightarrow A\le19$." ─────────────────────────────────────────────────────────────────
  const kl = dong.find((d) => /^\$\\Rightarrow\s*[A-Z]\s*\\(le|ge)/.test(d.text.trim()))
  if (!kl) { loai.push('không thấy dòng kết luận ⇒ A ≤/≥ c'); return cands }
  const m = kl.text.match(/^(\s*\$\\Rightarrow\s*[A-Z]\s*)(\\le|\\ge)\s*(.+?)\$\.?\s*$/)
  if (!m) { loai.push('dòng kết luận không đúng khuôn'); return cands }
  const rel = m[2], cText = m[3].trim()
  let cVal; try { cVal = parse(chuanManh(cText)) } catch { cVal = null }
  const cCanon = cVal ? (() => { try { return canonOf(require_ev(cVal)) } catch { return null } })() : null
  if (!cCanon) { loai.push(`hằng số kết luận không đọc được: ${cText}`); return cands }
  // nhân chứng thứ hai: đáp số kho phải = c
  let dapCanon = null; try { dapCanon = canonOf(require_ev(parse(chuanManh(String(q.dap_an).replace(/^\$|\$$/g, ''))))) } catch {}
  if (dapCanon !== cCanon) { loai.push(`đáp số kho ${q.dap_an} ≠ hằng số kết luận ${cText}`); return cands }
  const laMax = /GTLN/i.test(q.noi_dung)
  if ((laMax && rel !== '\\le') || (!laMax && rel !== '\\ge')) { loai.push(`đề ${laMax ? 'GTLN' : 'GTNN'} nhưng kết luận dùng ${rel}`); return cands }
  // ── ô0 (CEO 12/09: "dòng đầu tiên quan trọng, cần 1 câu chỗ này"): tính chất không âm "$|2x-3|\ge0$" — đục CẢ bất đẳng thức,
  //    4 phương án là 4 mệnh đề trọn vẹn: đúng · "> 0" (D03) · "≤ 0" (D07) · bỏ vỏ |…|/√/(…)^n, "2x−3 ≥ 0" (D08).
  //    Dòng có 2 bất đẳng thức ("$|5x-5|\ge0$; $|y|\ge0$") chỉ đục cái đầu.
  {
    const d0 = dong.find((d) => d.start < kl.start && /\$[^$]*\\ge\s*0\s*\$/.test(d.text))
    if (d0) {
      const m0 = d0.text.match(/\$([^$]*?)\\ge\s*0\s*\$/)
      const lhs = m0[1].trim(), key0 = m0[0].slice(1, -1)
      const i0 = d0.text.indexOf(m0[0]) + 1
      const ruotVo = (s) => { let m; if ((m = s.match(/^\\left\|(.+)\\right\|$/)) || (m = s.match(/^\|(.+)\|$/)) || (m = s.match(/^\\sqrt\{(.+)\}$/)) || (m = s.match(/^\\left\((.+)\\right\)\^\{?\d+\}?$/)) || (m = s.match(/^\((.+)\)\^\{?\d+\}?$/))) return m[1]; return null }
      const trong = ruotVo(lhs)
      const pick0 = [{ r: 'D03', text: `${lhs}>0`, ds: RULE_QH.D03 }, { r: 'D07', text: `${lhs}\\le0`, ds: RULE_QH.D07 }]
      if (trong) pick0.push({ r: 'D08', text: `${trong}\\ge0`, ds: RULE_QH.D08 })
      if (pick0.length === 3) cands.push({ vi_tri: 'tinh_chat_khong_am', kieu: 'quan_he', v: 'qh:ko_am:' + lhs.replace(/\s+/g, ''), key: null, tok: { token: key0 }, start: d0.start + i0, end: d0.start + i0 + key0.length, dong: dong.indexOf(d0), pick: pick0.map((p) => ({ ...p, kieu: 'quan_he' })), tinh_tu: 'tính chất không âm của |…| / √ / (…)^chẵn' })
      else loai.push(`ô0: không bóc được vỏ của "${lhs}" (thiếu phương án D08)`)
    } else loai.push('ô0: không thấy dòng "$… \\ge 0$" đầu tiên')
  }
  // ── ô BIẾN ĐỔI (CEO 12/09: "cả mấy dòng biến đổi nữa: 2|x−4| ≥ 0 → 2|x−4|+17 ≥ 17 cũng đáng làm câu; A ≥ 17 thì bỏ, tư duy
  //    gì đâu"): MỌI dòng bất đẳng thức giữa dòng đầu và dòng kết luận (không tính kết luận) là 1 ô = "chiều + vế phải".
  //    Phương án sai: (1) chiều ngược — D01 nếu dòng này ĐẢO chiều so với dòng trước (không đảo), D10 nếu KHÔNG đảo (đảo bừa
  //    khi cộng hằng / nhân số dương); (2) quên dấu bằng D03; (3) dòng đảo chiều: `>`/`<` ngược D06; dòng có hằng số ≠ 0 ở vế
  //    phải: sai dấu hằng số D09 (0+17 → 0−17); dòng nhân hệ số k (vế phải 0): nhân k vào vế phải D11 (≥ 0 → ≥ k).
  //    Dòng có 2 bất đẳng thức chỉ đục cái đầu. Dòng không đủ 3 phương án ⇒ bỏ dòng đó (báo), không đoán.
  {
    const toan = dong.filter((d) => d.start < kl.start && /\$[^$]*\\(le|ge)[^$]*\$/.test(d.text))
    for (let i = 1; i < toan.length; i++) {
      const d = toan[i], mq = d.text.match(/\$([^$]*?)(\\le|\\ge)([^$]*?)\$/)
      if (!mq) continue
      const prev = toan[i - 1].text.match(/\$[^$]*?(\\le|\\ge)[^$]*?\$/)
      const relQ = mq[2], relPrev = prev ? prev[1] : relQ, dao = relQ !== relPrev
      const lhs = mq[1].trim(), rhs = mq[3].trim()
      const keyQ = relQ + mq[3], i0 = d.text.indexOf(mq[0]) + 1 + mq[1].length
      const relNguoc = relQ === '\\le' ? '\\ge' : '\\le', strict = relQ === '\\le' ? '<' : '>', strictNguoc = relQ === '\\le' ? '>' : '<'
      const pk = [
        { r: dao ? 'D01' : 'D10', text: relNguoc + mq[3], ds: dao ? RULE_QH.D01 : RULE_QH.D10 },
        { r: 'D03', text: strict + mq[3], ds: RULE_QH.D03 },
      ]
      const soRhs = rhs.match(/\\dfrac\{\d+\}\{\d+\}|\d+(?:,\d+)?/g) ?? [] // KHÔNG kèm dấu — dấu do bước lật xử lý ("0-14,2" → "0+14,2"; bug đã dính: kèm dấu thì lật xong trùng key)
      const hangKhac0 = soRhs.find((s) => !/^0$/.test(s))
      if (dao) pk.push({ r: 'D06', text: strictNguoc + mq[3], ds: RULE_QH.D06 })
      else if (hangKhac0) { // đổi dấu hằng số: "0+17"→"0-17", "19+0"→"-19+0", "6"→"-6", "-14,2"→"14,2" (lật dấu đứng trước, không chèn "+-")
        const esc = hangKhac0.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        const t = mq[3].replace(new RegExp('([+-]?)\\s*' + esc), (m0, sg) => (sg === '+' ? '-' : sg === '-' ? '+' : '-') + hangKhac0.replace(/^-/, ''))
        pk.push({ r: 'D09', text: relQ + t, ds: RULE_QH.D09 })
      } else { const k = lhs.replace(/^\\Rightarrow\s*/, '').match(/^(\d+)\s*[|(\\]/); if (k && /^0$/.test(rhs)) pk.push({ r: 'D11', text: relQ + mq[3].replace(/0/, k[1]), ds: RULE_QH.D11 }) }
      // chốt chặn: phương án sai không được trùng key hoặc trùng nhau (so text bỏ khoảng trắng)
      const nk = (s) => s.replace(/\s+/g, ''); const seenT = new Set([nk(keyQ)]); const pkOk = pk.filter((p) => { const t = nk(p.text); if (seenT.has(t)) return false; seenT.add(t); return true })
      if (pkOk.length < 3) { loai.push(`dòng biến đổi "${lhs.slice(0, 30)} ${relQ} ${rhs}": chỉ ${pkOk.length} phương án sai khác key — bỏ dòng`); continue }
      pk.length = 0; pk.push(...pkOk)
      cands.push({ vi_tri: dao ? 'dao_chieu' : 'bien_doi', kieu: 'quan_he', v: `qh:bd${i}:` + (relQ + rhs).replace(/\s+/g, ''), key: null, tok: { token: keyQ }, start: d.start + i0, end: d.start + i0 + keyQ.length, dong: dong.indexOf(d), pick: pk.map((p) => ({ ...p, kieu: 'quan_he' })), tinh_tu: dao ? 'bước đảo chiều bất đẳng thức (nhân −1 / lấy nghịch đảo)' : 'bước biến đổi giữ chiều (cộng hằng / nhân số dương)' })
    }
  }
  // ── ô2/ô3: "Dấu bằng xảy ra khi … ⇒ x = v" (1 biến) / hệ trong \begin{array} (2 biến) ─────────────────────
  const db = dong.find((d) => /Dấu bằng/.test(d.text))
  if (!db) { loai.push('không thấy dòng Dấu bằng'); return cands }
  const segs = db.text.split('\\Rightarrow')
  if (segs.length < 2) { loai.push('dòng Dấu bằng không có ⇒'); return cands }
  const last = segs[segs.length - 1], prev = segs[segs.length - 2]
  const lastStart = db.start + db.text.length - last.length
  // bỏ phần chữ "Dấu bằng xảy ra khi $" trước phương trình (1 biến, không có \Rightarrow ở giữa) + vỏ \left\{\begin{array} (2 biến)
  // kho viết cả {l} lẫn {1} (số một) sau \begin{array}
  const eqsPrev = prev.replace(/^[^$]*\$/, '').replace(/\\left\\\{|\\begin\{array\}\s*\{[l1]\}|\\end\{array\}|\\right\./g, '').split('\\\\').map((s) => s.trim()).filter(Boolean)
  for (const mm of last.matchAll(new RegExp(String.raw`([xy])\s*=\s*(${NUM})`, 'g'))) {
    const bien = mm[1], vText = mm[2]
    const eqText = eqsPrev.find((e) => e.includes(bien)); if (!eqText) { loai.push(`${bien}: không thấy phương trình trước "${bien} ="`); continue }
    if (/x/.test(eqText) && /y/.test(eqText)) { loai.push(`${bien}: phương trình 2 ẩn "${eqText}" (thế x rồi giải y) — ngoài khuôn, bỏ`); continue }
    let tree; try { tree = parse(chuanManh(eqText.replace(/y/g, 'x'))) } catch (e) { loai.push(`${bien}: parse "${eqText}" lỗi ${e.message}`); continue }
    if (tree.t !== 'eq') { loai.push(`${bien}: "${eqText}" không phải phương trình`); continue }
    let dung; try { dung = solve(tree, { rule: null }) } catch { dung = null }
    let vVal; try { vVal = require_ev(parse(chuanManh(vText))) } catch { vVal = null }
    if (!dung || !vVal || !dung.some((s) => canonOf(s) === canonOf(vVal))) { loai.push(`${bien}: máy giải "${eqText}" ra ${dung ? dung.map(canonOf).join(';') : '?'} ≠ kho ${vText}`); continue }
    const kieuKey = kieuToken(vText), seen = new Set([canonOf(vVal)]), ds = []
    for (const r of RULE_X) {
      if (r === 'R05' && !(vVal.q === 1n && (vVal.p < 0n ? -vVal.p : vVal.p) < 1000n)) continue
      let res; try { res = evalRule(tree, null, r) } catch { res = null }
      if (!res || !res.v) continue
      const vs = Array.isArray(res.v) ? res.v : [res.v]
      for (const v of vs) { const c = canonOf(v); if (seen.has(c)) continue; seen.add(c); const t = fmtNhu(vText, v); ds.push({ r, v, c, text: t, kieu: kieuToken(t), ds: res.fired }); break }
    }
    // 2 lỗi riêng của khuôn "E = 0 ⇒ x = v" (phương trình quá đơn giản nên rule số học chỉ cho 1–2 đường sai):
    // D04: HS thấy "= 0" là ghi luôn x = 0 · D05: chuyển vế đúng, quên chia cho hệ số a của x (ax + b = 0 ⇒ x = −b)
    const them = (r, v) => { const c = canonOf(v); if (seen.has(c)) return; seen.add(c); const t = fmtNhu(vText, v); ds.push({ r, v, c, text: t, kieu: kieuToken(t), ds: RULE_QH[r] }) }
    them('D04', { p: 0n, q: 1n })
    const heSo = eqText.replace(/\\left|\\right|\s/g, '').match(/(?:^|[(|{])(\d+)x/)
    if (heSo && heSo[1] !== '1' && heSo[1] !== '0') { let p = vVal.p * BigInt(heSo[1]), q = vVal.q; const g = ((a, b) => { a = a < 0n ? -a : a; while (b) [a, b] = [b, a % b]; return a || 1n })(p, q); them('D05', { p: p / g, q: q / g }) }
    const byXoay = (a, b) => (ruleUsed[a.r] ?? 0) - (ruleUsed[b.r] ?? 0) || RULE_X.indexOf(a.r) - RULE_X.indexOf(b.r)
    const pick = []
    const cung = [...ds].filter((d) => d.kieu === kieuKey).sort(byXoay)[0]; if (cung) pick.push(cung)
    for (const d of ds.filter((d) => d !== cung).sort(byXoay)) if (pick.length < 3) pick.push(d)
    if (pick.length < 3 || !pick.some((p) => p.kieu === kieuKey)) { loai.push(`${bien}=${vText}: chỉ ${pick.length} distractor (${ds.map((d) => d.r + '=' + d.c).join(',')})`); continue }
    const st = lastStart + mm.index + mm[0].length - vText.length
    cands.push({ vi_tri: bien, kieu: 'gia_tri', v: canonOf(vVal), key: vVal, tok: { token: vText }, start: st, end: st + vText.length, dong: dong.indexOf(db), pick, tinh_tu: `giải ${eqText}` })
  }
  return cands
}
function require_ev(n) { const v = ev(n, { rule: null }); if (!v) throw new Error('không tính được'); return v }
