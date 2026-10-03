// ============================================================================
// boc-tsa.mjs — đọc bộ tài liệu TSA (PNL 2027): folder = CHỦ ĐỀ, file "Chủ đề NN. …" = CHUYÊN ĐỀ.
// Mỗi chuyên đề có 2 file Word cùng tên: _GV (lý thuyết + ví dụ + bài rèn luyện, CÓ lời giải/đáp án)
// và _HS (cùng đề, KHÔNG lời giải) ⇒ bản HS là NHÂN CHỨNG độc lập cho "đọc đủ câu, đúng chữ đề".
//
//   node scripts/tsa/boc-tsa.mjs "<thư mục gốc TSA>" --ra <thư mục ra>
//
// Ra: <ra>/tsa.json (bản đồ + câu + cảnh báo) · <ra>/img/<tên file> (ảnh PNG/JPG tham chiếu) · báo cáo in màn hình.
// KHÔNG ghi DB. Đọc Word bằng bộ MathType có sẵn (scripts/kho/mathtype-thu) — 0 AI.
// Luật §1.5: không chắc đáp án ⇒ để TRỐNG + ghi cảnh báo, không đoán.
// ============================================================================
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join, basename } from 'node:path'
import { createHash } from 'node:crypto'
import JSZip from 'jszip'
import { convertDocx } from '../kho/mathtype-thu/doc.mjs'

// ── tách thẻ định dạng → chữ thường + mặt nạ gạch chân ────────────────────────
const RE_TAG = /\[\[(\/?)(u|b|mau:[0-9A-Fa-f]+|nen:[A-Za-z]+|mau|nen)\]\]|\[\[img:([^\]]+)\]\]|\[\[EQ[^\]]*\]\]/g
function phanTich(s) {
  let text = '', u = [], uD = 0, bD = 0, anh = [], hong = 0
  let last = 0
  const them = (chu) => { text += chu; for (let i = 0; i < chu.length; i++) u.push(uD > 0) }
  for (const m of s.matchAll(RE_TAG)) {
    them(s.slice(last, m.index)); last = m.index + m[0].length
    if (m[3]) { anh.push(m[3]); continue }
    if (m[0].startsWith('[[EQ')) { hong++; continue }
    const dong = m[1] === '/', ten = m[2]
    if (ten === 'u') uD += dong ? -1 : 1
    else if (ten === 'b') { bD += dong ? -1 : 1; them('\u0001') } // dấu đậm: xử lý ở gon()
  }
  them(s.slice(last))
  return { text, u, anh, hong }
}
// bỏ dấu đậm tạm \u0001 → **…** theo cặp (mở/đóng), dời khoảng trắng sát dấu ra ngoài, gọn khoảng trắng
function gon(t) {
  const phan = t.split('\u0001')
  let out = phan[0]
  for (let i = 1; i < phan.length; i++) out += (i % 2 === 1 ? '\u0002' : '\u0003') + phan[i]
  out = out.replace(/\u0002(\s*)\u0003/g, '$1')          // cặp rỗng → bỏ
  out = out.replace(/\u0002(\s+)/g, '$1\u0002').replace(/(\s+)\u0003/g, '\u0003$1') // khoảng trắng ra ngoài
  out = out.replace(/\u0002/g, '**').replace(/\u0003/g, '**')
  out = out.split('****').join('')                        // hai khối đậm liền nhau → gộp
  return out.replace(/\t+/g, ' ').replace(/ {2,}/g, ' ').trim()
}
const thuan = (s) => phanTich(s).text.replace(/\u0001/g, '').replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim()
const chuanSo = (s) => thuan(s).toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')

// ── nhận diện dòng ──────────────────────────────────────────────────────────
const RE_CAU = /^Câu\s*(\d+)\s*[:.]\s*(.*)$/s
const RE_MUC = /^(I{1,3}|IV)\.\s+\S/
const laLoiGiai = (t) => /^Lời giải\b/i.test(t) && t.length <= 24
const laHet = (t) => /^[-–—\s]*HẾT[-–—\s]*$/i.test(t) || /^-{4,}/.test(t)

function tachCau(dong) {
  // dong: mảng { raw, t } — trả về { lyThuyet:[raw], cau:[{phan, so, raws:[]}] }
  const lyThuyet = []
  const cau = []
  let phan = 'bai_tap', muc = 0, cur = null
  for (const d of dong) {
    const t = d.t
    const mm = t.match(RE_MUC)
    if (mm && t === t.toUpperCase()) { // tiêu đề mục viết HOA: "I. HỆ THỐNG LÝ THUYẾT…"
      muc = { I: 1, II: 2, III: 3, IV: 4 }[mm[1]]
      phan = muc === 2 ? 'vi_du' : muc === 3 ? 'ren_luyen' : muc === 1 ? 'ly_thuyet' : 'bai_tap'
      cur = null; continue
    }
    if (laHet(t)) { cur = null; continue }
    const mc = t.match(RE_CAU)
    if (mc && phan !== 'ly_thuyet') { cur = { phan, so: +mc[1], raws: [d.raw], sttGoc: cau.length + 1 }; cau.push(cur); continue }
    if (cur) cur.raws.push(d.raw)
    else if (phan === 'ly_thuyet' || muc === 0) lyThuyet.push(d.raw)
  }
  return { lyThuyet, cau }
}

// ── 1 câu ───────────────────────────────────────────────────────────────────
const RE_DA = /^Đáp án\s*[:：]\s*(.*)$/s
function nhanTN(pre) {
  // pre: mảng phanTich của các dòng; tìm dòng đầu chứa "A." rồi gom tới hết
  // ghép các dòng thành 1 chuỗi, BỎ dấu đậm  cùng mặt nạ gạch chân (để nhãn "A." vẫn khớp)
  const ghep = (arr) => {
    let text = '', u = []
    arr.forEach((p, k) => {
      for (let i = 0; i < p.text.length; i++) if (p.text[i] !== '') { text += p.text[i]; u.push(p.u[i]) }
      if (k < arr.length - 1) { text += ' '; u.push(false) }
    })
    return { text, u }
  }
  for (let i = 0; i < pre.length; i++) {
    if (!/(^|[\s\t])A\.\s*/.test(pre[i].text.replace(/\u0001/g, ''))) continue
    const g = ghep(pre.slice(i))
    const txt = g.text
    const viTri = []
    let pos = 0
    for (const L of ['A', 'B', 'C', 'D']) {
      const re = new RegExp(`(^|[\\s\\t\\u0001])(${L})\\s*\\.(?!\\d)`, 'g')
      re.lastIndex = pos
      let m, tim = -1
      while ((m = re.exec(txt))) { tim = m.index + m[1].length; break }
      if (tim < 0) { viTri.length = 0; break }
      viTri.push(tim); pos = tim + 2
    }
    if (viTri.length !== 4) continue
    const pa = viTri.map((v, k) => {
      const den = k < 3 ? viTri[k + 1] : txt.length
      const raw = txt.slice(v, den)
      const daGach = g.u[v] === true
      let nd = raw.replace(/^[A-D]\s*\./, '').replace(/\u0001/g, '')
      nd = nd.replace(/\s*\$\\quad\$\s*$/g, '').replace(/\s*\$\\quad\$\s*/g, ' ').replace(/\t+/g, ' ').replace(/\s+/g, ' ').trim()
      return { nd, daGach }
    })
    return { chiSo: i, pa }
  }
  return null
}

function boCau(c, tenFile) {
  const canhBao = []
  const dong = c.raws.map((raw) => ({ raw, p: phanTich(raw) }))
  const mc = dong[0].p.text.replace(/\u0001/g, '').match(RE_CAU)
  // bỏ nhãn "Câu N:" khỏi dòng đầu — giữ phần còn lại cùng mặt nạ
  {
    const p = dong[0].p
    const raw0 = p.text.replace(/\u0001/g, '')
    const cut = raw0.length - (mc ? mc[2].length : raw0.length)
    // cắt theo vị trí ký tự thực (bỏ \u0001 trước): dựng lại
    const sach = []
    const uu = []
    for (let i = 0; i < p.text.length; i++) if (p.text[i] !== '\u0001') { sach.push(p.text[i]); uu.push(p.u[i]) }
    dong[0].p = { text: sach.slice(cut).join(''), u: uu.slice(cut), anh: p.anh, hong: p.hong }
  }
  const idxLG = dong.findIndex((d, i) => i > 0 && laLoiGiai(d.p.text.replace(/\u0001/g, '').trim()))
  const pre = (idxLG < 0 ? dong : dong.slice(0, idxLG)).map((d) => d.p)
  const post = idxLG < 0 ? [] : dong.slice(idxLG + 1).map((d) => d.p)
  if (idxLG < 0) canhBao.push('không thấy dòng "Lời giải"')

  // dòng "Đáp án:" tường minh (cuối lời giải) + dòng giữ chỗ "Đáp án: ____" (trước lời giải)
  let daRo = null
  const postGon = []
  for (const p of post) {
    const t = thuan(p.text ? p.text : '')
    const m = t.match(RE_DA)
    if (m) { daRo = { raw: m[1], p }; continue }
    postGon.push(p)
  }
  const preGon = pre.filter((p) => !/^Đáp án\s*[:：]\s*[_\s.…-]*$/.test(thuan(p.text)))

  const anhDe = preGon.flatMap((p) => p.anh), anhGiai = postGon.flatMap((p) => p.anh)
  const hong = [...pre, ...post].reduce((s, p) => s + p.hong, 0)
  if (hong) canhBao.push(`có ${hong} công thức hỏng khi đọc — soi lại bằng mắt`)

  const gomDong = (arr) => arr.map((p) => gon(p.text)).filter((x) => x).join('\n\n')
  const out = { phan: c.phan, so: c.so, loai_cau: null, noi_dung: '', lua_chon: null, menh_de: null, dap_an: null, dap_an_nguon: null,
    loi_giai: null, anh: anhDe, anh_giai: anhGiai, canh_bao: canhBao, ten_file: tenFile }
  const loiGiaiText = gomDong(postGon)
  const thuanPre = preGon.map((p) => thuan(p.text))

  // ── Đúng/Sai: có a) b) c) d)
  const iA = thuanPre.findIndex((t) => /^a\)\s*/.test(t))
  const tn = nhanTN(preGon)
  if (tn) {
    out.loai_cau = 'trac_nghiem'
    out.noi_dung = gomDong(preGon.slice(0, tn.chiSo))
    out.lua_chon = tn.pa.map((x) => x.nd)
    const gach = tn.pa.map((x, k) => (x.daGach ? 'ABCD'[k] : null)).filter(Boolean)
    const rg = daRo ? daRo.raw.match(/^\s*([A-D])\s*\.?\s*$/) : null
    if (gach.length === 1 && rg) {
      if (gach[0] === rg[1]) { out.dap_an = gach[0]; out.dap_an_nguon = 'gach_chan+dong_dap_an' }
      else { out.dap_an = null; out.dap_an_nguon = 'mau_thuan'; canhBao.push(`gạch chân ${gach[0]} ≠ dòng "Đáp án: ${rg[1]}" — để trống, người duyệt xét`) }
    } else if (gach.length === 1) { out.dap_an = gach[0]; out.dap_an_nguon = 'gach_chan' }
    else if (rg) { out.dap_an = rg[1]; out.dap_an_nguon = 'dong_dap_an' }
    else {
      const mCh = loiGiaiText.match(/Chọn\s+([A-D])\b/)
      if (mCh) { out.dap_an = mCh[1]; out.dap_an_nguon = 'chon_trong_loi_giai' }
      else canhBao.push(`không xác định được đáp án (gạch chân: ${gach.length} chỗ, không có dòng Đáp án)`)
    }
    out.loi_giai = loiGiaiText || null
  } else if (iA >= 0 && thuanPre.some((t) => /^b\)/.test(t)) && !/kéo/i.test(thuanPre.join(' ')) &&
             (thuanPre.some((t) => /^d\)/.test(t)) || /đúng\s*(\/|hay|,)?\s*sai/i.test(thuanPre.slice(0, iA).join(' ')))) {
    out.loai_cau = 'dung_sai'
    out.noi_dung = gomDong(preGon.slice(0, iA))
    // mệnh đề: gom dòng tới nhãn kế
    const md = []
    for (let i = iA; i < preGon.length; i++) {
      const t = gon(preGon[i].text)
      const m = t.match(/^([a-d])\)\s*(.*)$/s)
      if (m) md.push({ chu: m[1], noi_dung: m[2], anh: [...preGon[i].anh] })
      else if (md.length) { md[md.length - 1].noi_dung += '\n\n' + t; md[md.length - 1].anh.push(...preGon[i].anh) }
    }
    if (md.length !== 4) canhBao.push(`có ${md.length} mệnh đề (khuôn là 4)`)
    // lời giải theo ý: dòng bắt đầu "a) …"; đáp án ở cuối đoạn "(Đúng)/(Sai)"
    const theoY = {}
    const chung = []
    let cur = null
    for (const p of postGon) {
      const t = gon(p.text)
      const m = t.match(/^([a-d])\)\s*(.*)$/s)
      if (m) { cur = m[1]; theoY[cur] = [m[2]] } else if (cur) { theoY[cur].push(t) } else if (t) { chung.push(t) }
    }
    const docDS = (s) => { const k = [...s.matchAll(/\((Đúng|Sai)\)/gi)].pop(); return k ? (/^đ/i.test(k[1]) ? 'D' : 'S') : null }
    // đáp án tường minh "a) Sai, b) Đúng, …"
    const roMap = {}
    if (daRo) for (const m of thuan(daRo.raw).matchAll(/([a-d])\)\s*(Đúng|Sai)/gi)) roMap[m[1]] = /^đ/i.test(m[2]) ? 'D' : 'S'
    out.menh_de = md.map((x) => {
      const g = theoY[x.chu]
      const tu = g ? docDS(g.join(' ')) : null
      const ro = roMap[x.chu] ?? null
      let da = null, ng = null
      if (tu && ro) { if (tu === ro) { da = tu; ng = 'loi_giai+dong_dap_an' } else { canhBao.push(`mệnh đề ${x.chu}): lời giải ghi ${tu === 'D' ? 'Đúng' : 'Sai'} ≠ dòng Đáp án — để trống`); ng = 'mau_thuan' } }
      else if (tu) { da = tu; ng = 'loi_giai' } else if (ro) { da = ro; ng = 'dong_dap_an' }
      else canhBao.push(`mệnh đề ${x.chu}): không thấy (Đúng)/(Sai)`)
      let lg = g ? g.join('\n\n') : null
      if (lg) lg = lg.replace(/\s*\((Đúng|Sai)\)\s*$/i, '').trim()
      return { chu: x.chu, noi_dung: x.noi_dung, dap_an: da, loi_giai: lg || null, dap_an_nguon: ng, anh: x.anh }
    })
    out.loi_giai = chung.join('\n\n') || null
  } else if (/kéo/i.test(thuanPre.join(' '))) {
    out.loai_cau = 'keo_tha'
    // ngân hàng đáp án = các dòng CHỈ gồm thẻ "[ … ]" (có thể rải nhiều dòng, xen $\quad$)
    const theTrongDong = (t) => {
      const sach = t.replace(/\$\\quad\$/g, ' ')
      if (sach.replace(/\[\s*[^\]]+?\s*\]/g, '').trim() !== '') return null
      return [...sach.matchAll(/\[\s*([^\]]+?)\s*\]/g)].map((m) => m[1])
    }
    const bank = [], laBank = new Set()
    thuanPre.forEach((t, i) => {
      if (i === 0) return
      const th = theTrongDong(t)
      // thẻ đơn "[1]" (số thứ tự ô trống) KHÔNG phải ngân hàng; ngân hàng = ≥2 thẻ, hoặc 1 thẻ không phải số nguyên nhỏ
      if (th && th.length && (th.length >= 2 || !/^\d{1,2}$/.test(th[0]))) { bank.push(...th); laBank.add(i) }
    })
    if (bank.length) out.lua_chon = bank
    else canhBao.push('không thấy ngân hàng đáp án dạng thẻ [ … ]')
    // giữ NGUYÊN dòng thẻ trong đề (màn nào chưa có khuôn kéo thả vẫn thấy đủ thẻ); lua_chon là bản có cấu trúc
    out.noi_dung = gomDong(preGon)
    if (daRo) { out.dap_an = thuan(daRo.raw); out.dap_an_nguon = 'dong_dap_an' }
    else canhBao.push('kéo thả không có dòng "Đáp án:" — đáp án nằm trong lời giải, chưa tách tự động')
    out.loi_giai = loiGiaiText || null
  } else {
    out.loai_cau = 'tra_loi_ngan'
    out.noi_dung = gomDong(preGon)
    if (daRo && thuan(daRo.raw)) { out.dap_an = thuan(daRo.raw); out.dap_an_nguon = 'dong_dap_an' }
    else {
      // không có dòng "Đáp án:" ⇒ chỉ nhận đáp số khi CÂU CUỐI lời giải là câu kết luận ("Vậy …", "Do đó …") — lời tác giả, không phải ta đoán
      const cuoi = postGon.map((p) => thuan(p.text)).filter(Boolean).pop() ?? ''
      const kl = /^(Vậy|Do đó|Đáp số|Suy ra|Kết luận|Từ đó|Như vậy)\b/i.test(cuoi) && !/chứng minh|chứng tỏ/i.test(out.noi_dung)
        ? [...cuoi.matchAll(/\$([^$]+)\$/g)].pop() : null
      if (kl) { out.dap_an = kl[1].trim(); out.dap_an_nguon = 'cuoi_loi_giai'; canhBao.push('đáp số lấy từ câu cuối lời giải (không có dòng "Đáp án:") — người duyệt xác nhận') }
      else if (c.phan === 'vi_du' && /chứng minh|chứng tỏ|tìm tất cả|giải (phương trình|hệ)/i.test(out.noi_dung)) { out.loai_cau = 'tu_luan'; out.dap_an_nguon = 'khong_ap_dung' }
      else canhBao.push('không có dòng "Đáp án:" và câu cuối lời giải không phải kết luận đọc được — đáp số để trống')
    }
    out.loi_giai = loiGiaiText || null
  }
  if (!out.noi_dung) canhBao.push('đề rỗng')
  if (!out.loi_giai && !(out.menh_de && out.menh_de.some((m) => m.loi_giai))) canhBao.push('không có lời giải')
  return out
}

// ── 1 file Word → { lyThuyet, cau } ─────────────────────────────────────────
async function docFile(tep) {
  const kq = await convertDocx(tep)
  const dong = kq.paragraphs.map((raw) => ({ raw, t: thuan(raw) }))
  return { ...tachCau(dong), paragraphs: kq.paragraphs, thongKe: { cong_thuc: kq.equations.length, hong: kq.equations.filter((e) => !e.ok).length } }
}

// ── chạy ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
const goc = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--ra')
const ra = args.includes('--ra') ? args[args.indexOf('--ra') + 1] : null
if (!goc || !ra) { console.error('Dùng: node scripts/tsa/boc-tsa.mjs "<thư mục gốc>" --ra <thư mục ra>'); process.exit(2) }
mkdirSync(join(ra, 'img'), { recursive: true })

const thuMucChuDe = readdirSync(goc, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()
const chuDe = [], chuyenDe = [], cau = [], thieu = []
let thuTuToan = 0
for (const tm of thuMucChuDe) {
  const m = tm.match(/^(\d+)\.\s*(.+)$/)
  const so = m ? m[1] : null
  const files = readdirSync(join(goc, tm)).filter((f) => /_GV\.docx$/i.test(f)).sort((a, b) => a.localeCompare(b, 'vi', { numeric: true }))
  const coDe = /^(bộ|đề)/i.test((m ? m[2] : tm))
  chuDe.push({ thu_muc: tm, so, ten: m ? m[2] : tm, so_chuyen_de: files.length, la_bo_de: coDe })
  if (!files.length) { thieu.push(tm); continue }
  let stt = 0
  for (const fGV of files) {
    stt++
    const base = fGV.replace(/_GV\.docx$/i, '')
    const fHS = base + '_HS.docx'
    const pGV = join(goc, tm, fGV), pHS = join(goc, tm, fHS)
    const gv = await docFile(pGV)
    const hs = existsSync(pHS) ? await docFile(pHS) : null
    const sha = createHash('sha256').update(readFileSync(pGV)).digest('hex')
    const ten = base.replace(/^Chủ đề\s*\d+\s*\.\s*/i, '')
    const cd = { thu_muc: tm, so_chu_de: so, thu_tu: stt, file_goc: base, ten, sha256_gv: sha, co_hs: !!hs,
      thong_ke_doc: { gv: gv.thongKe, hs: hs?.thongKe ?? null } }
    {
      const pl = gv.lyThuyet.map((raw) => phanTich(raw))
      // bỏ dòng tiêu đề "I. HỆ THỐNG LÝ THUYẾT TRỌNG TÂM" (tiêu đề mục, không phải nội dung)
      cd.ly_thuyet = pl.map((p) => gon(p.text)).filter((t) => t && !/^I\.\s+HỆ THỐNG LÝ THUYẾT/i.test(t)).join('\n\n')
      cd.ly_thuyet_anh = pl.flatMap((p) => p.anh)
    }
    // ảnh: chép PNG/JPG tham chiếu
    const zip = await JSZip.loadAsync(readFileSync(pGV))
    const hsCau = new Map((hs?.cau ?? []).map((c) => [`${c.phan}|${c.so}`, c]))
    let idx = 0
    for (const c of gv.cau) {
      idx++
      const q = boCau(c, base)
      q.chuyen_de = `${so}.${stt}`
      q.thu_tu = idx
      // nhân chứng: bản HS có cùng câu, cùng chữ đề?
      if (hs) {
        const h = hsCau.get(`${c.phan}|${c.so}`)
        if (!h) { q.canh_bao.push('bản HS không có câu này'); q.hs_khop = false }
        else {
          const qh = boCau(h, base)
          const a = chuanSo(q.noi_dung + (q.lua_chon ?? []).join('') + (q.menh_de ?? []).map((x) => x.noi_dung).join(''))
          const b = chuanSo(qh.noi_dung + (qh.lua_chon ?? []).join('') + (qh.menh_de ?? []).map((x) => x.noi_dung).join(''))
          q.hs_khop = a === b
          if (!q.hs_khop) q.canh_bao.push('chữ đề bản GV ≠ bản HS')
        }
      } else q.hs_khop = null
      cau.push(q)
      for (const f of [...q.anh, ...q.anh_giai, ...(q.menh_de ?? []).flatMap((x) => x.anh)]) {
        if (!/\.(png|jpe?g)$/i.test(f)) { q.canh_bao.push(`ảnh ${f} không phải PNG/JPG`); continue }
        const z = zip.file('word/media/' + f)
        const dich = join(ra, 'img', `${so}${String(stt).padStart(2, '0')}_${f}`)
        if (z) writeFileSync(dich, Buffer.from(await z.async('uint8array')))
        else q.canh_bao.push(`không thấy word/media/${f}`)
      }
    }
    // số câu HS có mà GV không
    if (hs) for (const k of hsCau.keys()) if (!gv.cau.some((c) => `${c.phan}|${c.so}` === k)) cd.canh_bao_hs = [...(cd.canh_bao_hs ?? []), `bản HS có câu ${k} mà bản GV không`]
    cd.so_cau = gv.cau.length
    cd.so_cau_hs = hs ? hs.cau.length : null
    chuyenDe.push(cd)
    thuTuToan++
  }
}
const out = { nguon: basename(goc), doc_luc: new Date().toISOString(), chu_de: chuDe, thu_muc_trong: thieu, chuyen_de: chuyenDe, cau }
writeFileSync(join(ra, 'tsa.json'), JSON.stringify(out, null, 1), 'utf8')

// ── báo cáo ──
const dem = (f) => cau.filter(f).length
console.log(`Chủ đề: ${chuDe.length} (rỗng: ${thieu.length}: ${thieu.join(' | ')})`)
console.log(`Chuyên đề: ${chuyenDe.length} · Câu: ${cau.length}`)
for (const cd of chuyenDe) console.log(`  ${cd.so_chu_de}.${cd.thu_tu} ${cd.ten.slice(0, 50).padEnd(50)} GV ${cd.so_cau} · HS ${cd.so_cau_hs}${cd.canh_bao_hs ? ' ⚠ ' + cd.canh_bao_hs.join(';') : ''}`)
const theoLoai = {}
for (const q of cau) theoLoai[q.loai_cau] = (theoLoai[q.loai_cau] || 0) + 1
console.log('Loại câu:', JSON.stringify(theoLoai))
console.log('Có đáp án:', dem((q) => q.loai_cau === 'dung_sai' ? q.menh_de.every((m) => m.dap_an) : !!q.dap_an), '/', cau.length)
console.log('Có lời giải:', dem((q) => q.loi_giai || q.menh_de?.some((m) => m.loi_giai)), '/', cau.length)
console.log('Khớp bản HS:', dem((q) => q.hs_khop === true), '· lệch:', dem((q) => q.hs_khop === false))
console.log('Có hình (đề/giải):', dem((q) => q.anh.length), '/', dem((q) => q.anh_giai.length))
const nguon = {}
for (const q of cau) if (q.dap_an_nguon) nguon[q.dap_an_nguon] = (nguon[q.dap_an_nguon] || 0) + 1
console.log('Nguồn đáp án:', JSON.stringify(nguon))
const cb = {}
for (const q of cau) for (const w of q.canh_bao) { const k = w.replace(/\d+/g, 'N').slice(0, 70); cb[k] = (cb[k] || 0) + 1 }
console.log('Cảnh báo:'); for (const [k, v] of Object.entries(cb).sort((a, b) => b[1] - a[1])) console.log('  ', String(v).padStart(4), k)
