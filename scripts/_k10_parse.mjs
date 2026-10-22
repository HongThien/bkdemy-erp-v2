// Bóc câu K10 Vectơ từ .txt (doc-docx.mjs). Dùng chung cho NBV / PNL / Từ Tâm.
//   node scripts/_k10_parse.mjs <nguon: NBV|PNL|TT> <thư-mục-txt> <ra.json>
import { readdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { docDong, tachAnh, sach, che } from './_k10_lib.mjs'

const [NGUON, dir, ra] = process.argv.slice(2)
const NL = String.fromCharCode(10)

const reMarker = /^(?:»\s*)?(?:Câu|Bài tập)\s*(\d+)\s*[.:]\s*/i

function macDinh(f) {
  if (/_C\._TRAC_NGHIEM_KHACH_QUAN/.test(f)) return 'trac_nghiem'
  if (/_D\._TRAC_NGHIEM_DUNG_SAI/.test(f)) return 'dung_sai'
  if (/_E\._TRA_LOI_NGAN/.test(f)) return 'tra_loi_ngan'
  if (/_B\.(_BAI_TAP)?_TU_LUAN/.test(f) || /_F\._BAI_TAP_NANG_CAO/.test(f)) return 'tu_luan'
  return null
}

function nhanPhan(txt) {
  if (txt.length > 200 || reMarker.test(txt)) return null
  let m = txt.match(/^PH[ẦA]N\s*(IV|I{1,3})\b/i)
  if (m) return { I: 'trac_nghiem', II: 'dung_sai', III: 'tra_loi_ngan', IV: 'tu_luan' }[m[1].toUpperCase()]
  if (/TR[ẢA] L[ỜƠ]I NG[ẮA]N/i.test(txt)) return 'tra_loi_ngan'
  if (/[ĐD][ÚU]NG\s*[-–—]?\s*SAI/i.test(txt)) return 'dung_sai'
  if (/TR[ẮA]C NGHI[ỆE]M/i.test(txt) && !/[ĐD][ÚU]NG\s*[-–—]?\s*SAI/i.test(txt)) return 'trac_nghiem'
  if (/T[ỰU] LU[ẬA]N/i.test(txt)) return 'tu_luan'
  return null
}

function tachCau(dong, macDinhLoai) {
  const cau = []
  let cur = null, dang = null, sec = macDinhLoai
  for (const raw of dong) {
    const txt = sach(tachAnh(raw).s)
    const ph = nhanPhan(txt)
    if (ph) { sec = ph; cur = null; continue }
    const mDang = txt.match(/^D[ẠẠA]NG\s*(\d+)\s*[.:]\s*(.*)$/i)
    if (mDang && !reMarker.test(txt)) { dang = `${mDang[1]}. ${mDang[2]}`.trim(); cur = null; continue }
    const m = txt.match(reMarker)
    if (m) {
      // bỏ phần mốc "Câu n." ở dòng thô nhưng giữ thẻ ảnh / gạch chân
      let r = raw.replace(/^\s*(?:\[\[(?:\/?(?:b|i|nen|mau)(?::[^\]]*)?)\]\]|\s|»)*(?:Câu|Bài tập)\s*\d+\s*[.:]\s*/i, '')
      r = r.replace(/^(?:\[\[\/(?:b|mau|nen)\]\]\s*)+/, '')
      cur = { so: +m[1], lines: [r], dang, sec }
      cau.push(cur)
      continue
    }
    if (cur) cur.lines.push(raw)
  }
  return cau
}

function giaiDoan(lines) {
  const i = lines.findIndex((l) => /^L[ờơ]i\s*gi[ảa]i/i.test(sach(tachAnh(l).s)))
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
  return { text: parts.join(NL), imgs }
}

function boThamChieu(s) {
  return s.replace(/^\s*\((?:CD|KNTT|CTST|Cánh Diều|Chân trời)[^)]*\)\s*/i, '').trim()
}

function chuanDapAnNgan(s) {
  let t = s.trim()
  for (let i = 0; i < 4; i++) t = t.replace(/[.;,\s]+$/, '').replace(/^\$+|\$+$/g, '').trim()
  t = t.replace(/\\text\{\s*\}|\\quad|\\,|\\\s/g, ' ').replace(/\\+\s*$/, '').trim()
  const m = t.match(/^[A-Za-z_0-9']{1,6}\s*=\s*(.+)$/)
  if (m) t = m[1].trim()
  t = t.replace(/[.;]\s*$/, '').trim()
  const rhs = t.split('=').pop().trim()
  if (t.includes('=') && /^-?\d+(?:[.,]\d+)?$/.test(rhs)) t = rhs
  if (/^-?\d+(?:[.,]\d+)?$/.test(t)) return t
  const u = t.match(/^(-?\d+(?:[.,]\d+)?)\s*(?:\\?\s*)(?:\\mathrm\{|\\text\{)?\(?\s*(?:N|J|m|cm|km|kg|s|W|độ|\^?\{?\\circ\}?|°)\s*\}?\)?$/)
  if (u) return u[1]
  return '$' + t + '$'
}

const files = readdirSync(dir).filter((f) => f.endsWith('.txt'))
const out = []
for (const f of files) {
  if (NGUON === 'NBV' && (/_-_CH\.txt$/.test(f) || /_A\._LY_THUYET/.test(f))) continue
  if (NGUON === 'PNL' && !/_GV\.txt$/.test(f)) continue
  if (NGUON === 'TT' && !/-P2\.txt$/.test(f)) continue
  const dong = docDong(join(dir, f))
  const def = macDinh(f)
  const ds = tachCau(dong, def)
  for (const c of ds) {
    const { de, giai } = giaiDoan(c.lines)
    const loai = c.sec || 'tu_luan'
    const rec = { nguon: NGUON, file: f.replace(/\.txt$/, ''), so: c.so, loai, dang_nguon: c.dang, imgs_de: [], imgs_giai: [], loi: null }
    const dGiai = vanBan(giai)
    rec.imgs_giai = dGiai.imgs
    rec.loi_giai = dGiai.text || null
    const gtxt = giai.map((l) => sach(tachAnh(l).s)).join(NL)

    if (giai.length === 0 && loai !== 'dung_sai') { rec.loi = 'không có lời giải'; out.push(rec); continue }

    if (loai === 'trac_nghiem') {
      const raw = de.join(NL)
      const dapAn = [...new Set([...raw.matchAll(/\[\[u\]\](?:\[\[[^\]]+\]\])*\s*([A-D])\b/g)].map((m) => m[1]))]
      // dòng đầu chứa mốc "A." ngoài công thức
      let iA = -1
      for (let i = 0; i < de.length; i++) {
        const t = che(sach(tachAnh(de[i]).s))
        if (/(^|\s)A\s*\./.test(t) || /(^|\s)A(?=\u0001)/.test(t)) { iA = i; break }
      }
      if (iA < 0) { rec.loi = 'không thấy mốc A.'; out.push(rec); continue }
      const dStem = vanBan(de.slice(0, iA))
      const dOpt = vanBan(de.slice(iA))
      rec.imgs_de = dStem.imgs
      rec.imgs_opt = dOpt.imgs
      const opt = dOpt.text.split(NL).join(' ')
      const masked = che(opt)
      const pos = []
      let from = 0
      for (const L of ['A', 'B', 'C', 'D']) {
        const re = new RegExp('(^|\\s|\\u0001)' + L + '\\s*\\.?', 'g')
        re.lastIndex = from
        let m, hit = -1
        while ((m = re.exec(masked))) {
          const st = m.index + m[1].length
          const after = masked.slice(st + 1, st + 2)
          if (m[0].includes('.') || after === ' ' || after === '\u0001' || after === '$') { hit = st; break }
        }
        if (hit < 0) { pos.length = 0; break }
        pos.push(hit); from = hit + 1
      }
      if (pos.length !== 4) { rec.loi = 'không tách được 4 phương án'; out.push(rec); continue }
      rec.lua_chon = pos.map((p, k) => opt.slice(p, k < 3 ? pos[k + 1] : undefined).replace(/^[A-D]\s*\.?\s*/, '').trim())
      rec.noi_dung = boThamChieu(dStem.text)
      if (dapAn.length === 1) rec.dap_an = dapAn[0]
      else {
        const mm = [...gtxt.matchAll(/(?:Đáp án|Chọn(?: đáp án)?)\s*[:：]?\s*\(?([A-D])\b/g)]
        const u = [...new Set(mm.map((x) => x[1]))]
        if (dapAn.length === 0 && u.length === 1) rec.dap_an = u[0]
        else rec.loi = dapAn.length ? 'nhiều đáp án gạch chân' : 'không có đáp án gạch chân'
      }
    } else if (loai === 'dung_sai') {
      const iA = de.findIndex((l) => /^a\)/.test(sach(tachAnh(l).s)))
      if (iA < 0) { rec.loi = 'không thấy mệnh đề a)'; out.push(rec); continue }
      const dStem = vanBan(de.slice(0, iA))
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      const md = []
      let cur = null
      for (const raw of de.slice(iA)) {
        const { s, imgs } = tachAnh(raw)
        const t = sach(s)
        const m = t.match(/^([a-d])\)\s*(.*)$/)
        if (m) { cur = { noi_dung: m[2].trim(), imgs: [...imgs] }; md.push(cur) }
        else if (cur && t) { cur.noi_dung += NL + t; cur.imgs.push(...imgs) }
      }
      if (giai.length === 0) { rec.loi = 'không có lời giải'; out.push(rec); continue }
      const seg = []
      let kc = null
      for (const raw of giai) {
        const t = sach(tachAnh(raw).s)
        const m = t.match(/^([a-d])\)\s*(.*)$/)
        if (m) { kc = [m[2]]; seg.push(kc); continue }
        if (kc && t) kc.push(t)
      }
      const gl = seg.map((parts) => {
        const txt = parts.join(NL)
        let v = null, body = txt
        const m1 = txt.match(/^(Đúng|Sai|Đ|S)(?=[\s.:,;]|$)[.:,;]?\s*([\s\S]*)$/)
        if (m1) { v = /^s/i.test(m1[1]) ? 'S' : 'D'; body = m1[2] }
        else {
          const all = [...txt.matchAll(/(?:Vậy|Do đó|Suy ra|Nên)[^.\n]*?(đúng|sai)/gi)]
          if (all.length) v = /^s/i.test(all[all.length - 1][1]) ? 'S' : 'D'
          else { const e = txt.match(/(đúng|sai)\s*\.?\s*$/i); if (e) v = /^s/i.test(e[1]) ? 'S' : 'D' }
        }
        return { v, body }
      })
      if (md.length !== 4 || gl.length !== 4 || gl.some((x) => !x.v)) { rec.loi = `mệnh đề ${md.length}/giải ${gl.length} không khớp`; out.push(rec); continue }
      rec.menh_de = md.map((x, i) => ({ noi_dung: x.noi_dung, dap_an: gl[i].v, loi_giai: gl[i].body || null }))
      rec.imgs_md = md.map((x) => x.imgs)
      rec.loi_giai = null
      rec.dap_an = null
    } else if (loai === 'tra_loi_ngan') {
      let dapAn = null
      const stemLines = []
      const rest = []
      let seenAns = false
      for (const raw of c.lines) {
        const t = sach(tachAnh(raw).s)
        const m = t.match(/^(?:Tr[ảa] l[ờơ]i|Đáp án|Đáp số)\s*[:：]?\s*(.*)$/i)
        if (m && !dapAn) { dapAn = m[1].trim(); seenAns = true; continue }
        if (!seenAns && !/^L[ờơ]i\s*gi[ảa]i/i.test(t)) stemLines.push(raw)
        else if (!/^L[ờơ]i\s*gi[ảa]i/i.test(t)) rest.push(raw)
      }
      const iG = c.lines.findIndex((l) => /^L[ờơ]i\s*gi[ảa]i/i.test(sach(tachAnh(l).s)))
      const stem = iG >= 0 ? c.lines.slice(0, iG).filter((l) => !/^(?:Tr[ảa] l[ờơ]i|Đáp án|Đáp số)/i.test(sach(tachAnh(l).s))) : stemLines
      const dStem = vanBan(stem)
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      // lời giải = mọi thứ sau "Lời giải", bỏ dòng Đáp án
      const gl2 = vanBan(iG >= 0 ? c.lines.slice(iG + 1).filter((l) => !/^(?:Tr[ảa] l[ờơ]i|Đáp án|Đáp số)/i.test(sach(tachAnh(l).s))) : [])
      rec.loi_giai = gl2.text || null
      rec.imgs_giai = gl2.imgs
      if (!rec.loi_giai) { rec.loi = 'không có lời giải'; out.push(rec); continue }
      if (!dapAn) { rec.loi = 'không có đáp án rõ'; out.push(rec); continue }
      rec.dap_an = chuanDapAnNgan(dapAn)
    } else {
      const dStem = vanBan(de)
      rec.imgs_de = dStem.imgs
      rec.noi_dung = boThamChieu(dStem.text)
      rec.dap_an = null
    }
    out.push(rec)
  }
}
writeFileSync(ra, JSON.stringify(out, null, 1))
const dem = {}
for (const r of out) { const k = r.file.slice(0, 70) + ' | ' + r.loai; dem[k] = dem[k] || { n: 0, loi: 0 }; dem[k].n++; if (r.loi) dem[k].loi++ }
console.log(`${NGUON}: tổng ${out.length} câu, lỗi ${out.filter((r) => r.loi).length}`)
console.table(dem)
const lo = {}
for (const r of out) if (r.loi) lo[r.loi.replace(/\d+/g, 'n')] = (lo[r.loi.replace(/\d+/g, 'n')] || 0) + 1
console.log(lo)
