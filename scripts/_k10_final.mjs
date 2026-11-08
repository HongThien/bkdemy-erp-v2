// moi.json + anh-cache.json → các lô JSON cho `nhap_kho.mjs insert`.   node scripts/_k10_final.mjs <scratch> [kích-cỡ-lô]
import fs from 'node:fs'
import path from 'node:path'

const S = process.argv[2]
const SIZE = +(process.argv[3] || 10)
const moi = JSON.parse(fs.readFileSync(path.join(S, 'moi.json'), 'utf8'))
const cache = JSON.parse(fs.readFileSync(path.join(S, 'anh-cache.json'), 'utf8'))
const NBV_DIR = path.join(S, 'nbv2'), PNL_DIR = path.join(S, 'pnl')
const TT_DIR = 'E:/BK ACADEMY/Tài liệu tham khảo/K10/TOAN 10 - TOAN TU TAM/TOÁN 10 - TỪ TÂM/CHƯƠNG 5-VECTO'
const idx = new Map()
function quet(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const p = path.join(d, e.name)
    if (e.isDirectory()) quet(p)
    else if (e.name.endsWith('.docx') && !e.name.startsWith('~$')) idx.set(e.name.replace(/\.docx$/, ''), p)
  }
}
quet(NBV_DIR); quet(PNL_DIR); quet(TT_DIR)

const BAI = { 13: 'Khái niệm vectơ', 14: 'Tổng và hiệu vectơ', 15: 'Tích của một số với một vectơ', 16: 'Tích vô hướng', 17: 'Toạ độ vectơ', 18: 'Ôn tập chương Vectơ' }
const MUC = { B: 'Tự luận', C: 'Trắc nghiệm', D: 'Đúng sai', E: 'Trả lời ngắn', F: 'Nâng cao' }
function nhan(r) {
  if (r.nguon === 'NBV') {
    const m = r.file.match(/^10-(\d+)\._.*?(?:_([B-F])\._)?/)
    const b = BAI[+r.file.match(/^10-(\d+)/)[1]] || r.file
    const mu = r.file.match(/_([B-F])\._/)
    const de = r.file.match(/DE_SO_(\d)/)
    const bo = /CANH_DIEU/.test(r.file) ? 'Cánh Diều–CTST' : /KNTT/.test(r.file) ? 'KNTT' : ''
    return `Sách NBV Toán 10 · ${b}${mu ? ' · ' + MUC[mu[1]] : ''}${de ? ` · ${bo} đề ${de[1]}` : ''} · Câu ${r.so}`
  }
  if (r.nguon === 'PNL') return `PNL Toán 10 (2026) · ${r.file.replace(/_GV$/, '')} · Câu ${r.so}`
  return `Toán Từ Tâm 10 · ${r.file.replace(/-P2$/, '')} · Câu ${r.so}`
}

const out = []
const skip = { anh_de_loi: 0 }
let giaiAnhMat = 0
for (const r of moi) {
  const de = [r.noi_dung, ...(r.lua_chon || []), ...(r.menh_de || []).map((x) => x.noi_dung)].filter(Boolean).join(' ')
  const gi = [r.loi_giai, ...(r.menh_de || []).map((x) => x.loi_giai)].filter(Boolean).join(' ')
  if (/\[\[(eq-|EQ-|omml|shape)/.test(de + ' ' + gi)) continue
  if ((r.imgs_de || []).length > 1 || (r.imgs_opt || []).length || (r.imgs_md || []).some((a) => a.length)) continue
  if (!idx.has(r.file)) continue
  if (r.noi_dung.length < 8) continue
  if (r.loai === 'trac_nghiem' && (!r.lua_chon || r.lua_chon.some((x) => !x))) continue
  const q = {
    khoi: '10', dang_chinh: null, loai_cau: r.loai, noi_dung: r.noi_dung,
    ten_de_goc: nhan(r), nguon: 'le', nguon_giai: 'nguoi',
  }
  if (r.loai === 'trac_nghiem') { q.lua_chon = r.lua_chon; q.dap_an = r.dap_an }
  if (r.loai === 'tra_loi_ngan') q.dap_an = r.dap_an
  if (r.loai === 'dung_sai') q.menh_de = r.menh_de.map((m) => ({ noi_dung: m.noi_dung, dap_an: m.dap_an, loi_giai: m.loi_giai }))
  else q.loi_giai = r.loi_giai
  if (r.imgs_de?.length === 1) {
    const c = cache[idx.get(r.file) + '|' + r.imgs_de[0]]
    if (!c?.url) { skip.anh_de_loi++; continue }
    q.anh_de = c.url
  }
  if (r.imgs_giai?.length === 1) {
    const c = cache[idx.get(r.file) + '|' + r.imgs_giai[0]]
    if (c?.url) q.anh_dap_an = c.url; else giaiAnhMat++
  }
  out.push(q)
}
const dir = path.join(S, 'lo'); fs.mkdirSync(dir, { recursive: true })
for (const f of fs.readdirSync(dir)) fs.unlinkSync(path.join(dir, f))
let n = 0
for (let i = 0; i < out.length; i += SIZE) fs.writeFileSync(path.join(dir, `lo_${String(++n).padStart(3, '0')}.json`), JSON.stringify(out.slice(i, i + SIZE)))
console.log({ cau: out.length, lo: n, bo_vi_loi_anh_de: skip.anh_de_loi, giai_mat_anh: giaiAnhMat })
