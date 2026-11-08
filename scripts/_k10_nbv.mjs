// Bóc câu từ NBV (đã trích .txt). node scripts/_k10_nbv.mjs <thư-mục-txt-nbv> <ra.json>
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { docDong, tachAnh, sach, che } from './_k10_lib.mjs'

const [dir, ra] = process.argv.slice(2)
const files = readdirSync(dir).filter((f) => f.endsWith('.txt') && !/_-_CH\.txt$/.test(f) && !/_A\._LY_THUYET/.test(f))
const out = []
const bao = []

const reCau = /^\s*(?:\[\[b\]\])?\s*Câu\s*(\d+)\s*[.:]/i

function loaiFile(f) {
  if (/_C\._TRAC_NGHIEM_KHACH_QUAN/.test(f)) return 'trac_nghiem'
  if (/_D\._TRAC_NGHIEM_DUNG_SAI/.test(f)) return 'dung_sai'
  if (/_E\._TRA_LOI_NGAN/.test(f)) return 'tra_loi_ngan'
  if (/_B\.(_BAI_TAP)?_TU_LUAN/.test(f)) return 'tu_luan'
  if (/_F\._BAI_TAP_NANG_CAO/.test(f)) return 'tu_luan'
  if (/_ON_TAP_CHUONG/.test(f)) return 'on_tap'
  return null
}

function tachCau(dong) {
  // trả về mảng {so, lines:[raw...], dang}
  const cau = []
  let cur = null, dang = null
  for (const raw of dong) {
    const txt = sach(tachAnh(raw).s)
    const mDang = txt.match(/^D[ẠạAa]NG\s*(\d+)\s*[.:]\s*(.*)$/i)
    if (mDang && !reCau.test(raw)) { dang = `${mDang[1]}. ${mDang[2]}`.trim(); cur = null; continue }
    const m = txt.match(/^Câu\s*(\d+)\s*[.:]\s*(.*)$/i)
    if (m) { cur = { so: +m[1], lines: [raw.replace(/^(\s*(?:\[\[[^\]]+\]\])*\s*)Câu\s*\d+\s*[.:]\s*(?:\[\[\/b\]\])?\s*/i, '$1')], dang }; cau.push(cur); continue }
    if (cur) cur.lines.push(raw)
  }
  return cau
}

function giaiDoan(lines) {
  // tách [stem...] | Lời giải | [giải...]
  const i = lines.findIndex((l) => /^\s*(?:\[\[b\]\])?\s*L[ờơ]i\s*gi[ảa]i/i.test(sach(tachAnh(l).s)) || /^\s*(?:\[\[b\]\])?L[ờơ]i gi[ảa]i/i.test(l.trim()))
  if (i < 0) return { de: lines, giai: [] }
  return { de: lines.slice(0, i), giai: lines.slice(i + 1) }
}

function vanBan(lines) {
  const imgs = []
  const parts = []
  for (const raw of lines) {
    const { s, imgs: im } = tachAnh(raw)
    imgs.push(...im)
    const t = sach(s)
    if (t) parts.push(t)
  }
  return { text: parts.join('\n'), imgs }
}

function boThamChieu(s) {
  return s.replace(/^\s*\((?:CD|KNTT|CTST|CD10|KNTT10|CTST10|Cánh Diều|Chân trời)[^)]*\)\s*/i, '').trim()
}

for (const f of files) {
  const loai = loaiFile(f)
  if (!loai) { bao.push({ f, loi: 'không rõ loại file' }); continue }
  const dong = docDong(join(dir, f))
  const ds = tachCau(dong)
  for (const c of ds) {
    const { de, giai } = giaiDoan(c.lines)
    const rec = { nguon: 'NBV', file: f.replace(/\.txt$/, ''), so: c.so, loai, dang_nguon: c.dang, imgs_de: [], imgs_giai: [], loi: null }
    const dGiai = vanBan(giai)
    rec.imgs_giai = dGiai.imgs
    rec.loi_giai = dGiai.text || null
    if (loai === 'trac_nghiem') {
      const raw = de.join('\n')
      // đáp án = chữ cái gạch chân
      const mU = [...raw.matchAll(/\[\[u\]\](?:\[\[[^\]]+\]\])*\s*([A-D])\b/g)].map((m) => m[1])
      const dapAn = [...new Set(mU)]
      // stem vs option
      const idxA = de.findIndex((l) => /(^|\s|\]\])A\s*[.$]/.test(sach(tachAnh(l).s)) && /\bB\s*[.$]|B\./.test(de.join('\n')))
      let stemLines = de, optText = ''
      // tìm dòng đầu chứa mốc "A." ngoài công thức
      let iA = -1
      for (let i = 0; i < de.length; i++) {
        const t = che(sach(tachAnh(de[i]).s))
        if (/(^|\s)A\s*\.?\s*(?=\u0001|\s|$|[^\w])/.test(t) && /(^|\s)A\s*\.|^A\u0001|\sA\u0001/.test(t)) { iA = i; break }
      }
      if (iA < 0) { rec.loi = 'không thấy mốc A.'; out.push(rec); continue }
      stemLines = de.slice(0, iA)
      const optLines = de.slice(iA)
      const dStem = vanBan(stemLines)
      // phần sau mốc A gộp cả dòng
      const dOpt = vanBan(optLines)
      rec.imgs_de = dStem.imgs
      rec.imgs_opt = dOpt.imgs
      // dòng stem có thể chứa ảnh nằm sau lựa chọn → imgs_opt
      const opt = dOpt.text.replace(/\n/g, ' ')
      const masked = che(opt)
      const pos = []
      let from = 0
      for (const L of ['A', 'B', 'C', 'D']) {
        const re = new RegExp(`(^|\\s|\u0001)${L}\\s*\\.?`, 'g')
        re.lastIndex = from
        let m, hit = -1
        while ((m = re.exec(masked))) {
          const st = m.index + m[1].length
          // chấp nhận nếu theo sau là khoảng trắng / $ / chữ (không phải chữ cái liền: "ABC")
          const nxt = masked[st + 1 + (m[0].endsWith('.') ? 0 : 0)]
          const after = masked.slice(st + 1, st + 2)
          if (m[0].includes('.') || after === ' ' || after === '\u0001' || after === '$') { hit = st; break }
        }
        if (hit < 0) { pos.length = 0; break }
        pos.push(hit); from = hit + 1
      }
      if (pos.length !== 4) { rec.loi = 'không tách được 4 phương án'; out.push(rec); continue }
      const lc = pos.map((p, k) => opt.slice(p, k < 3 ? pos[k + 1] : undefined).replace(/^[A-D]\s*\.?\s*/, '').trim())
      rec.lua_chon = lc
      rec.noi_dung = boThamChieu(dStem.text.replace(/\n/g, '\n'))
      if (dapAn.length === 1) rec.dap_an = dapAn[0]
      else {
        const gtxt = giai.map((l) => sach(tachAnh(l).s)).join(String.fromCharCode(10))
        const mm = [...gtxt.matchAll(/(?:Đáp án|Chọn(?: đáp án)?)\s*[:：]?\s*\(?([A-D])\b/g)]
        const u = [...new Set(mm.map((x) => x[1]))]
        if (dapAn.length === 0 && u.length === 1) rec.dap_an = u[0]
        else rec.loi = dapAn.length ? 'nhiều đáp án gạch chân' : 'không có đáp án gạch chân'
      }
    } else if (loai === 'dung_sai') {
      const iA = de.findIndex((l) => /^\s*(?:\[\[b\]\])*\s*a\)/.test(sach(tachAnh(l).s)) || /^\s*(?:\[\[[^\]]+\]\])*a\)/.test(l.trim()))
      if (iA < 0) { rec.loi = 'không thấy mệnh đề a)'; out.push(rec); continue }
      const dStem = vanBan(de.slice(0, iA))
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      // mệnh đề
      const md = []
      let cur = null
      for (const raw of de.slice(iA)) {
        const { s, imgs } = tachAnh(raw)
        const t = sach(s)
        const m = t.match(/^([a-d])\)\s*(.*)$/)
        if (m) { cur = { k: m[1], noi_dung: m[2].trim(), imgs: [...imgs] }; md.push(cur) }
        else if (cur && t) { cur.noi_dung += '\n' + t; cur.imgs.push(...imgs) }
      }
      // giải từng mệnh đề: cắt theo dòng bắt đầu bằng "k)"
      const seg = {}
      let k = null
      for (const raw of giai) {
        const { s } = tachAnh(raw)
        const t = sach(s)
        const m = t.match(/^([a-d])\)\s*(.*)$/)
        if (m) { k = m[1]; seg[k] = [m[2]]; continue }
        if (k && t) seg[k].push(t)
      }
      const gl = {}
      for (const kk of Object.keys(seg)) {
        const txt = seg[kk].join(String.fromCharCode(10))
        let v = null, body = txt
        const m1 = txt.match(/^(Đúng|Sai|Đ|S)(?=[\s.:,;]|$)[.:,;]?\s*([\s\S]*)$/)
        if (m1) { v = /^s/i.test(m1[1]) ? 'S' : 'D'; body = m1[2] }
        else {
          const all = [...txt.matchAll(/(?:Vậy|Do đó|Suy ra|Nên)[^.\n]*?(đúng|sai)/gi)]
          if (all.length) v = /^s/i.test(all[all.length - 1][1]) ? 'S' : 'D'
          else { const e = txt.match(/(đúng|sai)\s*\.?\s*$/i); if (e) v = /^s/i.test(e[1]) ? 'S' : 'D' }
        }
        if (v) gl[kk] = { dapAn: v, parts: [body] }
      }
      if (md.length !== 4 || md.some((x) => !gl[x.k])) { rec.loi = `mệnh đề ${md.length}/giải ${Object.keys(gl).length} không khớp`; out.push(rec); continue }
      rec.menh_de = md.map((x) => ({ noi_dung: x.noi_dung, dap_an: gl[x.k].dapAn, loi_giai: gl[x.k].parts.filter(Boolean).join('\n') || null }))
      rec.imgs_md = md.map((x) => x.imgs)
      rec.loi_giai = null
      rec.dap_an = null
    } else if (loai === 'tra_loi_ngan') {
      // "Trả lời: X" nằm trong phần đề/giải
      const all = c.lines
      let dapAn = null, iTL = -1
      for (let i = 0; i < all.length; i++) {
        const t = sach(tachAnh(all[i]).s)
        const m = t.match(/^(?:Tr[ảa] l[ờơ]i|Đáp án|Đáp số)\s*[:：]?\s*(.*)$/i)
        if (m) { dapAn = m[1].trim(); iTL = i; break }
      }
      const { de: de2, giai: giai2 } = giaiDoan(c.lines)
      const iG = c.lines.length - giai2.length - 1
      const stem = c.lines.slice(0, iTL >= 0 ? iTL : (iG >= 0 ? iG : c.lines.length))
      const dStem = vanBan(stem)
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      rec.dap_an = dapAn
      if (!dapAn) rec.loi = 'không có Trả lời'
    } else { // tu_luan / on_tap-tự luận
      const dStem = vanBan(de)
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      rec.dap_an = null
      if (!rec.loi_giai) rec.loi = 'không có lời giải'
    }
    out.push(rec)
  }
}
writeFileSync(ra, JSON.stringify({ out, bao }, null, 1))
const dem = {}
for (const r of out) { const k = r.file.replace(/^10-(\d+)\._.*?_([A-F])\..*/, '$1$2'); dem[k] = dem[k] || { n: 0, loi: 0 }; dem[k].n++; if (r.loi) dem[k].loi++ }
console.log(`tổng ${out.length} câu, lỗi ${out.filter((r) => r.loi).length}`)
console.table(dem)
const lo = {}
for (const r of out) if (r.loi) lo[r.loi] = (lo[r.loi] || 0) + 1
console.log(lo, bao)
