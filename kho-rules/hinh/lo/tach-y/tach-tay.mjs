// Cắt TAY các bài máy cắt lệch (Thùy 16/11 "Cắt tay 32 bài") — KHÔNG đụng DB. Đọc nhap.json (bài !sach), ghi nhap-tay.json.
// "Cắt tay" = QUYẾT ĐỊNH do người đọc từng bài (bảng TAY bên dưới: bài nào để nguyên, bước nào thuộc ý nào, dòng nào bỏ),
// còn CHỮ thì máy lắp nguyên văn từ đề / lời giải gốc ⇒ không gõ lại, không mất chữ. Cuối lượt tự kiểm từng dòng gốc đã đi đâu.
// Khác máy cắt (tach.mjs):
//   · ý LỒNG: "1) … a) b) c)  2) …" ⇒ ý 1a · 1b · 1c · 2 (đề của ý con = dòng của ý cha + dòng ý con)
//   · bước Phần 1 gắn NHIỀU ý ("Ý a và c:", "Ý a, b:", "Ý a–b:", "Ý 1a, 1b:") ⇒ bước đó vào lời giải của TỪNG ý được nêu (giữ nguyên chữ "Ý a và c: …")
//   · Phần 1 không chia bước / không chia nhãn ⇒ cả Phần 1 là phần chung của mọi ý
//   · nhãn con trong lời giải của một ý không lồng ở đề (vd ý 4 có a) b) bên trong) ⇒ là chữ của ý đó, không phải ý mới
// Dùng: node kho-rules/hinh/lo/tach-y/tach-tay.mjs
import fs from 'fs'
const DIR = 'kho-rules/hinh/lo/tach-y/'
const d = JSON.parse(fs.readFileSync(DIR + 'nhap.json', 'utf8')).filter((o) => !o.sach)

// ── Quyết định tay theo từng bài ──
//   deNguyen: lý do KHÔNG tách (bài không phải bài hình nhiều ý dùng chung một hình/lời dẫn)
//   boDong:   các dòng lời giải bỏ khỏi mọi ý (dòng tổng kết liệt kê lại đáp án mọi ý) — khớp theo tiền tố
//   ganBuoc:  { soBuoc: [ý…] } ghi đè ý của một bước Phần 1 khi nhãn trong bước không đọc được bằng máy
//   veLoiDan: dòng của ĐỀ (khớp tiền tố) là ghi chú chung cho cả bài nhưng nằm sau một ý ⇒ chuyển lên cuối lời dẫn
//   thayNhan: [[cũ, mới]] sửa NHÃN trong lời giải khi người viết gộp nhãn ("b), c) …") — chỉ đổi nhãn, không đổi chữ lời giải
//   ghiChu:   điều Thùy cần biết khi duyệt
const TAY = JSON.parse(fs.readFileSync(DIR + 'tach-tay-quyet-dinh.json', 'utf8'))

const L = (s) => (s ?? '').replace(/\r\n/g, '\n').split('\n')
const gon = (a) => a.join('\n').replace(/\n{3,}/g, '\n\n').trim()
// Nhãn đầu dòng: "1)" · "a)" · "1a)" · "1) a)" (có thể bọc **…**), b*) = ý nâng cao
function nhanDong(ln) {
  let m = ln.match(/^[ \t]*(?:\*\*)?(\d)\)(?:\*\*)?[ \t]*([a-h])(\*?)\)(?:\*\*)?[ \t]*/); if (m) return { so: m[1], chu: m[2], cat: m[0].length }
  m = ln.match(/^[ \t]*(?:\*\*)?(\d)([a-h])(\*?)\)(?:\*\*)?[ \t]*/); if (m) return { so: m[1], chu: m[2], cat: m[0].length }
  m = ln.match(/^[ \t]*(?:\*\*)?(\d)\)(?:\*\*)?[ \t]*/); if (m) return { so: m[1], chu: null, cat: m[0].length }
  m = ln.match(/^[ \t]*(?:\*\*)?([a-h])(\*?)\)(?:\*\*)?[ \t]*/); if (m) return { so: null, chu: m[1], cat: m[0].length }
  return null
}
// ĐỀ → lời dẫn + danh sách ý (có lồng)
function catDe(text) {
  const dau = [], muc = []   // muc: {so, chu, dong[]}
  for (const ln of L(text)) {
    const n = nhanDong(ln)
    if (n) { if (n.so && n.chu) { muc.push({ so: n.so, chu: null, dong: [] }); muc.push({ so: null, chu: n.chu, dong: [ln.slice(n.cat)] }) } else muc.push({ so: n.so, chu: n.chu, dong: [ln.slice(n.cat)] }) }
    else if (muc.length) muc[muc.length - 1].dong.push(ln)
    else dau.push(ln)
  }
  const coSo = muc.some((m) => m.so), ys = []
  let cha = null
  for (let i = 0; i < muc.length; i++) {
    const m = muc[i]
    if (m.so) { const coCon = coSo && muc[i + 1] && !muc[i + 1].so; cha = coCon ? m : null; if (!coCon) ys.push({ nhan: m.so, cau_hoi: gon(m.dong) }) }
    else if (cha) ys.push({ nhan: cha.so + m.chu, cau_hoi: gon([...cha.dong, ...m.dong]) })
    else ys.push({ nhan: m.chu, cau_hoi: gon(m.dong) })
  }
  return { loi_dan: gon(dau), ys }
}
// Đoạn văn có nhãn (Phần 2, hoặc cả lời giải không chia phần) → { chung, theoY: {nhan: text} }; nhãn không thuộc danh sách ý ⇒ là chữ của ý đang mở
function catTheoNhan(text, nhans) {
  const chung = [], theoY = {}; let cur = null, so = null; const choCha = []
  const doi = (n) => {
    if (n.so && n.chu) return nhans.includes(n.so + n.chu) ? n.so + n.chu : null
    if (n.so) { if (nhans.includes(n.so)) return n.so; if (nhans.some((x) => x.startsWith(n.so) && x.length === 2)) return '#' + n.so; return null }
    if (so && nhans.includes(so + n.chu)) return so + n.chu
    if (nhans.includes(n.chu)) return n.chu
    const ung = nhans.filter((x) => x.length === 2 && x[1] === n.chu); return ung.length === 1 ? ung[0] : null
  }
  for (const ln of L(text)) {
    const n = nhanDong(ln), y = n ? doi(n) : null
    if (y && y[0] === '#') { so = y[1]; cur = null; const con = ln.slice(n.cat); choCha.length = 0; if (con.trim()) choCha.push(con); continue }
    if (y) { if (n.so) so = n.so; cur = y; (theoY[cur] ??= []).push(...choCha.splice(0), ln.slice(n.cat)); continue }
    if (cur) theoY[cur].push(ln); else if (so && !cur) choCha.push(ln); else chung.push(ln)
  }
  return { chung: gon(chung), theoY: Object.fromEntries(Object.entries(theoY).map(([k, v]) => [k, gon(v)])) }
}
// Nhãn ý trong đầu một bước: "Ý a:" · "Ý a và c:" · "Ý a và ý d:" · "Ý a–b:" · "Ý b, c:" · "Ý 1a, 1b:" · "Ý c(i):" · "Ý b, hệ thức:"
function yCuaBuoc(text, nhans) {
  const m = text.match(/^Ý\s+/); if (!m) return null
  let rest = text.slice(m[0].length); const ra = []
  const doi = (t) => { if (nhans.includes(t)) return [t]; if (/^\d[a-h]$/.test(t) && nhans.includes(t[0])) return [t[0]];   /* "Ý 4a" khi đề chỉ có ý 4 */ if (/^\d$/.test(t)) return nhans.filter((x) => x.startsWith(t)); const u = nhans.filter((x) => x.length === 2 && x[1] === t); return u.length === 1 ? u : [] }
  for (;;) {
    const t = rest.match(/^(\d[a-h]|\d|[a-h])\*?(?:\([ivx]+\))?/); if (!t) break
    const sau = rest.slice(t[0].length)
    const kh = sau.match(/^\s*[–-]\s*(\d?[a-h]|\d)\b/)     // khoảng a–c
    if (kh) { const a = doi(t[1])[0], b = doi(kh[1])[0]; const i = nhans.indexOf(a), j = nhans.indexOf(b); if (i >= 0 && j >= i) ra.push(...nhans.slice(i, j + 1)); rest = sau.slice(kh[0].length) }
    else { ra.push(...doi(t[1])); rest = sau }
    const noi = rest.match(/^\s*(?:,|và)\s*(?:ý\s+)?(?=(?:\d[a-h]|\d|[a-h])\*?(?:\([ivx]+\))?(?:\s*[,:)–-]|\s+và\b|\s*$))/i); if (!noi) break
    rest = rest.slice(noi[0].length)
  }
  return ra.length ? [...new Set(ra)] : null
}
function catLoiGiai(o, ys, tay) {
  const nhans = ys.map((y) => y.nhan)
  let t = (o.loi_giai ?? '').replace(/\r\n/g, '\n')
  const bo = []
  if (tay.boDong) t = t.split('\n').filter((ln) => { const b = tay.boDong.some((p) => ln.trim().startsWith(p)); if (b) bo.push(ln.trim()); return !b }).join('\n')
  const m1 = t.match(/^\*\*Phần 1\.[^\n]*$/m), m2 = t.match(/^\*\*Phần 2\.[^\n]*$/m)
  const out = {}
  if (!(m1 && m2)) {   // không chia phần ⇒ cắt theo nhãn, đoạn trước ý đầu là chung
    const c = catTheoNhan(t, nhans)
    for (const n of nhans) out[n] = c.theoY[n] ? [c.chung, c.theoY[n]].filter(Boolean).join('\n\n') : null
    return { out, bo }
  }
  const p1 = t.slice(m1.index + m1[0].length, m2.index), p2 = t.slice(m2.index + m2[0].length)
  const c2 = catTheoNhan(p2, nhans)
  // Phần 1: (a) có "**Bước n.**" · (b) chia theo nhãn a) b) khớp đúng danh sách ý · (c) còn lại = chung cả
  const dau = [], buoc = [], cuoi = []; let cur = null, coBuoc = false
  for (const ln of L(p1)) {
    const mb = ln.match(/^\*\*Bước (\d+)\.\*\*\s*(.*)$/)
    if (mb) { coBuoc = true; const ys1 = tay.ganBuoc?.[mb[1]] ?? yCuaBuoc(mb[2], nhans); if (ys1) cur = ys1; buoc.push({ so: mb[1], y: cur, text: mb[2], don: ys1?.length === 1 && !tay.ganBuoc?.[mb[1]] }); continue }
    if (/^\*\*Chú ý/.test(ln) || cuoi.length) { cuoi.push(ln); continue }
    if (!coBuoc) dau.push(ln); else if (ln.trim()) buoc.push({ y: cur, text: ln, noi: true })
  }
  const c1 = !coBuoc ? catTheoNhan(p1, nhans) : null
  const p1TheoNhan = c1 && nhans.every((n) => c1.theoY[n])
  for (const n of nhans) {
    if (!c2.theoY[n]) { out[n] = null; continue }
    let phan1
    if (coBuoc) {
      const bs = buoc.filter((x) => x.y === null || x.y.includes(n)); let k = 0
      // bước gắn đúng MỘT ý: bỏ tiền tố "Ý a:" như máy cắt; gắn nhiều ý: giữ nguyên chữ để rõ bước này chung cho các ý nào
      const dong = bs.map((x) => { if (x.noi) return x.text; let tx = x.text; if (x.don) { tx = tx.replace(/^Ý\s+\S+?\s*[:,]\s*/, ''); tx = tx.charAt(0).toUpperCase() + tx.slice(1) } return `**Bước ${++k}.** ${tx}` })
      phan1 = [gon(dau), dong.join('\n\n'), gon(cuoi)].filter(Boolean).join('\n\n')
    } else if (p1TheoNhan) phan1 = [c1.chung, c1.theoY[n]].filter(Boolean).join('\n\n')
    else phan1 = gon(L(p1))
    out[n] = [m1[0], phan1, m2[0], c2.chung, c2.theoY[n]].filter(Boolean).join('\n\n')
  }
  return { out, bo, buoc: buoc.filter((b) => b.so).map((b) => `B${b.so}→${b.y ? b.y.join('+') : 'chung'}`).join(' ') }
}

const ra = [], bao = []
for (let o of d) {
  const goc = o   // bản gốc (thayNhan chỉ dùng để cắt — bản ghi giữ lời giải gốc cho ghi.mjs so với DB)
  const tay = TAY[o.ma_cau] ?? {}
  if (tay.deNguyen) { ra.push({ ...o, tach: false, ly_do: tay.deNguyen, ghi_chu: tay.ghiChu ?? null }); bao.push(`${o.ma_cau} K${o.khoi}  ĐỂ NGUYÊN — ${tay.deNguyen}`); continue }
  let deGoc = o.noi_dung.replace(/\r\n/g, '\n'); const len = []
  if (tay.veLoiDan) deGoc = deGoc.split('\n').filter((ln) => { const c = tay.veLoiDan.some((p) => ln.trim().startsWith(p)); if (c) len.push(ln.trim()); return !c }).join('\n')
  const de = catDe(deGoc)
  if (len.length) de.loi_dan = [de.loi_dan, ...len].join('\n')
  if (tay.thayNhan) { o = { ...o, loi_giai: tay.thayNhan.reduce((t, [x, y]) => { if (t.split(x).length !== 2) throw new Error(o.ma_cau + ': thayNhan không khớp đúng 1 chỗ: ' + x); return t.replace(x, () => y) }, o.loi_giai.replace(/\r\n/g, '\n')) } }
  const lg = catLoiGiai(o, de.ys, tay)
  const ys = de.ys.map((y) => ({ nhan: y.nhan, cau_hoi: y.cau_hoi, loi_giai: lg.out[y.nhan] ?? null }))
  const ok = !!de.loi_dan && ys.length >= 2 && ys.every((y) => y.cau_hoi && y.loi_giai)
  // Tự kiểm: mỗi dòng gốc (đề, lời giải) phải nằm trong ít nhất một ý / lời dẫn; dòng nào không thấy ⇒ liệt kê
  const chuan = (s) => s.replace(/\*\*Bước \d+\.\*\*\s*/g, '').replace(/^[ \t]*(?:\*\*)?(?:\d\)\s*)?(?:\d?[a-h]\*?\)|\d\))(?:\*\*)?[ \t]*/, '').replace(/^Ý\s+\S+?\s*[:,]\s*/, '').trim().toLowerCase()
  const kho = (de.loi_dan + '\n' + ys.map((y) => y.cau_hoi + '\n' + (y.loi_giai ?? '')).join('\n')).toLowerCase()
  const mat = [...L(o.noi_dung), ...L(o.loi_giai)].map((x) => x.trim()).filter(Boolean).filter((ln) => { const c = chuan(ln); return c && !kho.includes(c) && !lg.bo.includes(ln) })
  ra.push({ ...goc, tach: true, sach: ok, loi_dan: de.loi_dan, ys, bo_dong: lg.bo, mat_dong: mat, buoc: lg.buoc ?? null, ghi_chu: tay.ghiChu ?? null })
  bao.push(`${o.ma_cau} K${o.khoi}  ${ok ? 'OK ' : 'CHƯA'}  ý: ${ys.map((y) => y.nhan + (y.loi_giai ? '' : '(thiếu LG)')).join(',')}${lg.buoc ? '  | ' + lg.buoc : ''}${lg.bo.length ? `  | bỏ ${lg.bo.length} dòng tổng kết` : ''}${mat.length ? `  | ⚠ ${mat.length} dòng gốc không thấy: ${mat.map((x) => x.slice(0, 50)).join(' ¦ ')}` : ''}`)
}
fs.writeFileSync(DIR + 'nhap-tay.json', JSON.stringify(ra, null, 1))
console.log(bao.join('\n'))
console.log('\ntách được:', ra.filter((x) => x.tach && x.sach).length, '· chưa xong:', ra.filter((x) => x.tach && !x.sach).length, '· để nguyên:', ra.filter((x) => !x.tach).length)
