// KHUÔN Điền Ô cho nhóm "Chứng minh bất đẳng thức dãy phân số" khối 7 nâng cao — 4 dạng T107010504-507 (khảo sát
// 19/09: gộp CHUNG 1 khuôn vì cùng HÌNH THÁI lời giải "chuỗi bước $...$ nối bằng >/</=", dù KỸ THUẬT chặn khác hẳn
// nhau giữa 4 dạng (504: chia đôi nhóm rồi thay bằng số hạng nhỏ/lớn nhất nhóm · 505: nhân luỹ thừa cơ số rồi
// cộng/trừ vế-vế kiểu hiệu tích, có khi LỒNG 2 TẦNG (506) · 507: nhóm số hạng theo luỹ thừa 2 rồi thay hằng số) —
// và MỖI CÂU trong CÙNG 1 dạng còn tự chọn cách chia nhóm RIÊNG (không theo 1 công thức đóng chung, khác hẳn
// hieutich/ancnd). ⇒ KHÔNG mô hình hoá thuật toán chặn (bất khả thi vét hết biến thể); khuôn này đục theo CÚ PHÁP
// dòng lời giải — giống triết lý "đục cả cụm, không hiểu ngữ nghĩa" đã dùng ở hieutich khuôn D/E: mỗi dòng GIỮA có
// quan hệ so sánh (>/</≥/≤) là 1 ô, đục TỪ dấu quan hệ tới hết cụm ngay sau nó (giữ vế trái làm ngữ cảnh cho HS).
// Bỏ dòng MỞ ĐẦU (định nghĩa/tách nhóm, không có quan hệ) và dòng CUỐI CÙNG (kết luận đpcm) — đúng spec-dien-o.md
// §0b "Mở đầu/Kết không đục, chỉ đục PHẦN GIỮA". Bỏ luôn dòng "Vì ..." liệt kê ≥3 quan hệ liên tiếp (vd
// "1/31>1/32>...>1/50") vì đó là thứ tự HIỂN NHIÊN của chính các số trong đề, không phải bước suy luận mới.
// Mã rule riêng D49-D51 (max trước = D48, kiểm bằng `select max(ma) where ma like 'D%'` lúc đặt — seed mig riêng).
export const RULE_BDT = {
  D49: 'đảo chiều bất đẳng thức (đổi > thành < hoặc ngược lại) ở bước so sánh/chặn',
  D50: 'đếm nhầm số lượng số hạng trong nhóm/ngoặc (lệch hệ số nhân hoặc chỉ số cuối 1 đơn vị)',
  D51: 'sai dấu cộng/trừ khi khai triển biểu thức so sánh',
}

function dongCua(text) { const out = []; let p = 0; for (const l of text.split('\n')) { out.push({ start: p, end: p + l.length, text: l }); p += l.length + 1 }; return out }
const daoDau = (s) => s.replace(/[+-]/g, (ch) => (ch === '+' ? '-' : '+'))
const REL = { '<': '>', '>': '<', '\\le': '\\ge', '\\ge': '\\le' }

// Tách 1 mảnh `$…$` (raw) thành các đoạn (op, text) theo ranh giới \Rightarrow / < / > / \ge / \le — offset TƯƠNG ĐỐI trong raw.
function tachDoanQuanHe(raw) {
  const re = /\\Rightarrow|\\ge|\\le|<|>/g
  const bounds = []; let m
  while ((m = re.exec(raw))) bounds.push({ i: m.index, len: m[0].length, tok: m[0] })
  const segs = []
  for (let i = 0; i < bounds.length; i++) {
    const b = bounds[i]
    const textStart = b.i + b.len, textEnd = i + 1 < bounds.length ? bounds[i + 1].i : raw.length
    segs.push({ op: b.tok, opStart: b.i, textStart, textEnd, text: raw.slice(textStart, textEnd) })
  }
  // "liệt kê hiển nhiên" (vd "1/31>1/32>...>1/50") = CHUỖI CÙNG 1 KÝ HIỆU, KHÔNG có \Rightarrow chen giữa — khác hẳn
  // chuỗi suy luận nhiều bước qua \Rightarrow (vd "4B>1 ⇒ 2B>1/2 ⇒ 1-2B<1/2") dù cũng đếm được ≥3 quan hệ.
  const relToks = bounds.filter((b) => b.tok !== '\\Rightarrow')
  const laListe = relToks.length >= 3 && !raw.includes('\\Rightarrow') && relToks.every((b) => b.tok === relToks[0].tok)
  return { segs, laListe }
}

function shiftCoefBefore(text, delta) {
  const re = /(\d+)(\s*(?:\.|\\cdot)\s*)/g
  let m, last = null
  while ((m = re.exec(text))) last = m
  if (!last) return null
  const n = BigInt(last[1]) + BigInt(delta)
  if (n <= 0n) return null
  return text.slice(0, last.index) + n.toString() + text.slice(last.index + last[1].length)
}
function shiftLastInt(text, delta, skipIdx = -1) {
  const ms = [...text.matchAll(/\d+/g)]
  for (let i = ms.length - 1; i >= 0; i--) {
    if (i === skipIdx) continue
    const n = BigInt(ms[i][0]) + BigInt(delta)
    if (n < 0n) continue
    return { text: text.slice(0, ms[i].index) + n.toString() + text.slice(ms[i].index + ms[i][0].length), idx: i }
  }
  return null
}

// Sinh ≤3 phương án sai theo CÚ PHÁP dòng (không cần hiểu ngữ nghĩa của cách chặn) — dùng đúng nguyên văn `full` = op+text.
function sinhDistractor(op, text) {
  const out = []
  // D49: đảo chiều, giữ nguyên phần sau
  if (REL[op]) out.push({ r: 'D49', text: REL[op] + text, ds: RULE_BDT.D49 })
  // D50: đếm nhầm số lượng (hệ số nhân ngoài, vd "10.") lệch 1; không có thì lệch số cuối cùng trong cụm
  let d50 = shiftCoefBefore(text, -1); let idx50 = -1
  if (!d50) { const s = shiftLastInt(text, -1); if (s) { d50 = s.text; idx50 = s.idx } }
  if (!d50) { const s = shiftLastInt(text, 1); if (s) { d50 = s.text; idx50 = s.idx } }
  if (d50) out.push({ r: 'D50', text: op + d50, ds: RULE_BDT.D50 })
  // D51: sai dấu +/- khi khai triển; nếu cụm không có +/- (không đổi gì) thì lệch 1 SỐ KHÁC D50 vừa chọn
  let d51 = daoDau(text)
  if (d51 === text) { const s = shiftLastInt(text, 1, idx50); d51 = s ? s.text : null }
  if (d51 && d51 !== text) out.push({ r: 'D51', text: op + d51, ds: RULE_BDT.D51 })
  return out
}

export function timUngVienBdt(q, ctx) {
  const { loai = [] } = ctx
  const text = String(q.loi_giai ?? '').replace(/\r/g, '').replace(/\\n/g, '\n')
  const dong = dongCua(text)
  const idxCuoi = (() => { for (let i = dong.length - 1; i >= 0; i--) if (dong[i].text.trim()) return i; return -1 })()
  const dapChuan = String(q.dap_an ?? '').replace(/\s+/g, '')
  const cands = []
  for (let di = 0; di < dong.length; di++) {
    if (di === 0 || di === idxCuoi) continue // Mở đầu / Kết — không đục (spec §0b)
    const d = dong[di]
    if (/^\s*Vì\b/.test(d.text)) continue // liệt kê thứ tự hiển nhiên của các số trong đề, không phải bước suy luận mới
    for (const mm of d.text.matchAll(/\$([^$]*)\$/g)) {
      const raw = mm[1], base = d.start + mm.index + 1
      const { segs, laListe } = tachDoanQuanHe(raw)
      if (laListe) continue // "1/31>1/32>...>1/50" kiểu liệt kê thứ tự — bỏ cả cụm
      for (const s of segs) {
        if (s.op === '\\Rightarrow') continue
        const bodyText = s.text.trim()
        if (!bodyText) continue
        const full = raw.slice(s.opStart, s.textEnd)
        const fullNorm = full.replace(/\s+/g, '')
        if (dapChuan.includes(fullNorm) && fullNorm.length > 2) continue // trùng nguyên văn đpcm — khỏi lộ đích
        const pick = sinhDistractor(s.op, bodyText.length === s.text.length ? s.text : s.text)
        // chốt chặn trùng key/trùng nhau
        const nk = (t) => t.replace(/\s+/g, '')
        const seenT = new Set([nk(full)])
        const uniq = pick.filter((p) => { const t = nk(p.text); if (seenT.has(t)) return false; seenT.add(t); return true })
        if (uniq.length < 3) { loai.push(`dòng${di + 1} "${full.slice(0, 24)}": chỉ ${uniq.length}/3 distractor khác nhau — bỏ`); continue }
        const start = base + s.opStart, end = base + s.textEnd
        cands.push({
          vi_tri: `bdt_${cands.length + 1}`, kieu: 'tap', v: `bdt:${di}:${fullNorm}`, key: null,
          tok: { token: full }, start, end, dong: di,
          pick: uniq.slice(0, 3).map((p) => ({ ...p, kieu: 'tap' })), tinh_tu: 'bước so sánh/chặn giữa chứng minh',
        })
      }
    }
  }
  if (cands.length < 1) { loai.push(`không tìm được dòng giữa nào có quan hệ so sánh đủ distractor`); return [] }
  // mật độ (spec §0b): tối đa 4 ô/bài, bài ngắn 1-2 ô — nếu nhiều hơn 4 thì trải đều thay vì lấy 4 cái đầu
  if (cands.length <= 4) return cands
  const buoc = cands.length / 4
  const out = []; for (let i = 0; i < 4; i++) out.push(cands[Math.round(i * buoc)])
  return out
}
