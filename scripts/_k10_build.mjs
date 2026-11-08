// moi.json → lô JSON cho nhap_kho.mjs insert (có upload ảnh).
//   node scripts/_k10_build.mjs <scratch> [--dry]
import fs from 'node:fs'
import path from 'node:path'
import { execFileSync } from 'node:child_process'
import JSZip from 'jszip'

const S = process.argv[2]
const DRY = process.argv.includes('--dry')
const NBV_DIR = path.join(S, 'nbv2')
const PNL_DIR = path.join(S, 'pnl')
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

const moi = JSON.parse(fs.readFileSync(path.join(S, 'moi.json'), 'utf8'))
const bad = /\[\[(eq-|EQ-|omml|shape)/
const skip = {}
const them = (k) => { skip[k] = (skip[k] || 0) + 1 }
const keep = []
for (const r of moi) {
  const de = [r.noi_dung, ...(r.lua_chon || []), ...(r.menh_de || []).map((x) => x.noi_dung)].filter(Boolean).join(' ')
  const gi = [r.loi_giai, ...(r.menh_de || []).map((x) => x.loi_giai)].filter(Boolean).join(' ')
  if (bad.test(de) || bad.test(gi)) { them('công thức hỏng/mất (eq-empty, EQ-FAILED…)'); continue }
  if ((r.imgs_de || []).length > 1) { them('đề có >1 ảnh'); continue }
  if ((r.imgs_opt || []).length) { them('phương án có ảnh'); continue }
  if ((r.imgs_md || []).some((a) => a.length)) { them('mệnh đề có ảnh'); continue }
  if (!idx.has(r.file)) { them('không tìm thấy docx nguồn'); continue }
  if (r.loai === 'trac_nghiem' && (!r.lua_chon || r.lua_chon.some((x) => !x))) { them('phương án rỗng'); continue }
  if (r.noi_dung.length < 8) { them('đề quá ngắn'); continue }
  keep.push(r)
}
console.log('giữ', keep.length, 'bỏ', moi.length - keep.length, skip)

// ảnh cần
const need = new Map() // key docx|name -> {docx,name}
for (const r of keep) {
  const names = []
  if (r.imgs_de?.length === 1) names.push(r.imgs_de[0])
  if (r.imgs_giai?.length === 1) names.push(r.imgs_giai[0])
  r._anh = names
  for (const n of names) need.set(idx.get(r.file) + '|' + n, { docx: idx.get(r.file), name: n })
}
console.log('ảnh cần', need.size)
if (DRY) process.exit(0)

const MEDIA = path.join(S, 'media'); const PNGS = path.join(S, 'pngs')
fs.mkdirSync(MEDIA, { recursive: true }); fs.mkdirSync(PNGS, { recursive: true })
const cacheF = path.join(S, 'anh-cache.json')
const cache = fs.existsSync(cacheF) ? JSON.parse(fs.readFileSync(cacheF, 'utf8')) : {}

// 1. trích
const zips = new Map()
const todo = []
let n = 0
for (const [key, { docx, name }] of need) {
  if (cache[key]) continue
  if (!zips.has(docx)) zips.set(docx, await JSZip.loadAsync(fs.readFileSync(docx)))
  const f = zips.get(docx).file('word/media/' + name)
  if (!f) { cache[key] = { loi: 'không có trong docx' }; continue }
  const ext = name.split('.').pop().toLowerCase()
  const id = 'a' + String(++n).padStart(4, '0')
  const fn = id + '.' + ext
  fs.writeFileSync(path.join(MEDIA, fn), await f.async('nodebuffer'))
  todo.push({ key, id, fn, ext })
}
// 2. đổi EMF/WMF → PNG
const man = {}
for (const t of todo) if (/^(emf|wmf)$/.test(t.ext)) man[t.id] = { tep: t.id + '.png', nguon: [t.fn], cach: 'emf' }
if (Object.keys(man).length) {
  const mf = path.join(S, 'manifest-emf.json'); fs.writeFileSync(mf, JSON.stringify(man))
  const cmd = "& ([scriptblock]::Create([IO.File]::ReadAllText('kho-rules/dai/hinh-de/dung-hinh-de.ps1'))) -Media '" + MEDIA + "' -Manifest '" + mf + "' -Out '" + PNGS + "'"
  try {
    execFileSync('powershell', ['-NoProfile', '-Command', cmd], { stdio: 'inherit' })
  } catch (e) { console.error('đổi EMF lỗi', String(e.message).slice(0, 200)) }
}
// 3. upload
let up = 0
for (const t of todo) {
  const src = /^(emf|wmf)$/.test(t.ext) ? path.join(PNGS, t.id + '.png') : path.join(MEDIA, t.fn)
  if (!fs.existsSync(src)) { cache[t.key] = { loi: 'đổi PNG thất bại' }; continue }
  let png = src
  if (!/\.png$/i.test(src)) { // jpg/jpeg → chép nguyên, kho_anh up nhận png → cần PNG; bỏ qua nếu không phải PNG
    cache[t.key] = { loi: 'không phải PNG (' + t.ext + ')' }; continue
  }
  try {
    const out = execFileSync('node', ['scripts/kho_anh.mjs', 'up', '--png', png, '--ten', 'k10vecto'], { encoding: 'utf8' })
    const j = JSON.parse(out.slice(out.indexOf('{')))
    if (j.ok && j.url) { cache[t.key] = { url: j.url }; up++ } else cache[t.key] = { loi: 'upload: ' + out.slice(0, 100) }
  } catch (e) { cache[t.key] = { loi: 'upload lỗi ' + String(e.message).slice(0, 100) } }
  if (up % 25 === 0) fs.writeFileSync(cacheF, JSON.stringify(cache))
}
fs.writeFileSync(cacheF, JSON.stringify(cache))
console.log('đã upload', up)
