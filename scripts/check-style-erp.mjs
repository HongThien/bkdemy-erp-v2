// NGHIỆM THU bộ ảnh style Trang chính ERP — theo design/YEU-CAU-ANH-STYLE-ERP.md §9.
// Chạy:  node scripts/check-style-erp.mjs <thư-mục-style> [<thư-mục-style>…]
//        node scripts/check-style-erp.mjs design/bk-ui-src/AppHS/bk-erp-home-production-v2/ke-hoc-thuat
// Kiểm: khuôn manifest · đủ id · file tồn tại + kích thước PNG khớp · toạ độ trong canvas · ô yêu thích / box nhóm ·
// ghép cảnh (nền + đồ vật theo place/z) so với preview-clean.jpg · tương phản chữ trong text_box · dung lượng.
// Thoát mã 1 nếu có lỗi (✖); cảnh báo (⚠) không làm hỏng.
import { loadImage, createCanvas } from '@napi-rs/canvas'
import fs from 'node:fs'
import path from 'node:path'

const IDS_BAT_BUOC = [
  'panel-today', 'panel-greeting', 'panel-development', 'panel-order',
  ...Array.from({ length: 8 }, (_, i) => `favorite-slot-${i + 1}`), 'favorite-empty',
  'group-viec-cua-toi', 'group-van-hanh', 'group-gamification', 'group-hoc-thuat', 'group-quan-ly-chat-luong', 'group-core-team', 'group-dashboard',
  'mail-empty', 'mail-unread', 'btn-primary', 'btn-secondary', 'avatar-frame', 'checkbox-off', 'checkbox-on',
  'progress-track', 'progress-fill', 'popup-frame', 'tab-on', 'tab-off',
]
const CAN_9_SLICE = ['btn-primary', 'btn-secondary', 'progress-track', 'progress-fill', 'popup-frame', 'tab-on', 'tab-off']
const CAN_TEXT_BOX = ['panel-today', 'panel-greeting', 'panel-development', 'panel-order', 'btn-primary', 'btn-secondary', 'tab-on', 'tab-off']
const CAN_LABEL = (id) => id.startsWith('favorite-slot-') || id.startsWith('group-')
const CAN_BADGE = (id) => id.startsWith('group-') || id.startsWith('mail-')

const lum = (r, g, b) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4 }; return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b) }
const hex = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(h ?? ''); if (!m) return null; const n = parseInt(m[1], 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255] }
const tuongPhan = (a, b) => { const l1 = lum(...a), l2 = lum(...b); return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05) }
const pngKichThuoc = (f) => { const b = fs.readFileSync(f); return b.toString('ascii', 1, 4) === 'PNG' ? [b.readUInt32BE(16), b.readUInt32BE(20)] : null }

async function kiem(thuMuc) {
  const loi = [], canh = [], ok = []
  const E = (m) => loi.push(m), W = (m) => canh.push(m)
  const mf = path.join(thuMuc, 'manifest.json')
  if (!fs.existsSync(mf)) { E('thiếu manifest.json'); return { loi, canh, ok } }
  let m
  try { m = JSON.parse(fs.readFileSync(mf, 'utf8')) } catch (e) { E('manifest.json không parse được: ' + e.message); return { loi, canh, ok } }
  const { width: CW, height: CH } = m.canvas ?? {}
  if (!CW || !CH) E('thiếu canvas.width/height')
  for (const k of ['style_id', 'tone', 'background', 'tokens', 'regions', 'objects']) if (m[k] == null) E(`thiếu khoá "${k}"`)
  if (!['sang', 'toi'].includes(m.tone)) E(`tone phải là "sang"|"toi" (đang là ${m.tone})`)
  const T = m.tokens ?? {}
  for (const k of ['ink', 'muted', 'acc', 'acc_ink', 'surface', 'surface2', 'line']) if (!hex(T[k])) E(`tokens.${k} không phải hex 6 số (${T[k]})`)
  for (const k of ['font_head', 'font_body']) if (!T[k]) E(`thiếu tokens.${k}`)

  // 1. đủ id
  const dsObj = m.objects ?? []
  const co = new Map(dsObj.map((o) => [o.id, o]))
  // Đồ DỰ PHÒNG không ghép lên cảnh nằm ở library/ + library-assets.json (bản v3) — vẫn là "có", nhưng không tính vào cảnh.
  const libF = path.join(thuMuc, 'library-assets.json')
  if (fs.existsSync(libF)) { try { for (const o of JSON.parse(fs.readFileSync(libF, 'utf8').replace(/^﻿/, ''))) if (!co.has(o.id)) { co.set(o.id, o); dsObj.push({ ...o, render: false }) } } catch { W('library-assets.json không đọc được') } }
  const thieu = IDS_BAT_BUOC.filter((i) => !co.has(i))
  if (thieu.length) E(`thiếu ${thieu.length} id bắt buộc: ${thieu.join(', ')}`)
  else ok.push(`đủ ${IDS_BAT_BUOC.length} id bắt buộc (+${dsObj.length - IDS_BAT_BUOC.length} id thêm)`)

  // 2. file + kích thước + toạ độ
  let tong = 0
  for (const o of [...dsObj, ...(m.characters ?? [])]) {
    const f = path.join(thuMuc, o.file ?? '')
    if (!o.file || !fs.existsSync(f)) { E(`${o.id}: file không tồn tại (${o.file})`); continue }
    const kb = fs.statSync(f).size / 1024; tong += kb
    if (kb > 250) W(`${o.id}: ${Math.round(kb)} KB > 250 KB`)
    const d = pngKichThuoc(f)
    if (!d) E(`${o.id}: không phải PNG`)
    else if (d[0] !== o.width || d[1] !== o.height) E(`${o.id}: PNG ${d[0]}×${d[1]} ≠ manifest ${o.width}×${o.height}`)
    const p = o.place
    if (!Array.isArray(p) || p.length !== 4) { E(`${o.id}: thiếu place [x,y,w,h]`); continue }
    if (p[0] < -8 || p[1] < -8 || p[0] + p[2] > CW + 8 || p[1] + p[3] > CH + 8) E(`${o.id}: place ${JSON.stringify(p)} vượt canvas`)
    if (typeof o.z !== 'number') E(`${o.id}: thiếu z`)
  }
  const bg = path.join(thuMuc, m.background?.file ?? 'background.jpg')
  if (!fs.existsSync(bg)) E('thiếu background')
  else {
    const kb = fs.statSync(bg).size / 1024; tong += kb
    if (kb > 400) W(`background ${Math.round(kb)} KB > 400 KB`)
  }
  if (m.background_4x3 && !fs.existsSync(path.join(thuMuc, m.background_4x3.file))) E('background_4x3 khai báo nhưng thiếu file')
  if (!m.background_4x3) W('không có background_4x3 (màn vuông sẽ bị cắt)')
  if (tong / 1024 > 3) W(`tổng ${(tong / 1024).toFixed(1)} MB > 3 MB`)
  ok.push(`dung lượng ${(tong / 1024).toFixed(2)} MB`)

  // 3. text_box / label_box / badge / slice
  for (const id of CAN_TEXT_BOX) { const o = co.get(id); if (o && !o.text_box) E(`${id}: thiếu text_box`) }
  for (const o of dsObj) {
    if (CAN_LABEL(o.id) && !o.label_box && !(o.id === 'favorite-empty')) E(`${o.id}: thiếu label_box`)
    if (CAN_BADGE(o.id) && !o.badge_anchor) E(`${o.id}: thiếu badge_anchor`)
  }
  for (const id of CAN_9_SLICE) { const o = co.get(id); if (o && !(Array.isArray(o.slice) && o.slice.length === 4)) E(`${id}: thiếu slice [trái,trên,phải,dưới]`) }
  const av = co.get('avatar-frame'); if (av && !av.avatar_circle) W('avatar-frame: thiếu avatar_circle [x,y,d] (vòng chèn ảnh)')

  // 4. giới hạn thiết kế: yêu thích ≤ 8, box nhóm ≤ 4
  const render = (o) => o.render !== false
  const fav = dsObj.filter((o) => o.id.startsWith('favorite-slot-') && render(o))
  const grp = dsObj.filter((o) => o.id.startsWith('group-') && render(o))
  if (fav.length > 8) E(`yêu thích đang ghép ${fav.length} ô > 8`)
  if (grp.length > TOI_DA_NHOM) E(`box nhóm đang ghép ${grp.length} > ${TOI_DA_NHOM} (phần dư phải ở library hoặc render=false)`)
  ok.push(`ô yêu thích ghép ${fav.length}/8 · box nhóm ghép ${grp.length}/${TOI_DA_NHOM}`)
  if (!Array.isArray(m.favorite_slots) || m.favorite_slots.length !== 8) W('favorite_slots không đủ 8 vị trí')
  if (!Array.isArray(m.group_slots) || m.group_slots.length !== 4) W('group_slots không đủ 4 vị trí')

  // 5. vùng không đè nhau
  const R = Object.entries(m.regions ?? {})
  for (let i = 0; i < R.length; i++) for (let j = i + 1; j < R.length; j++) {
    const [na, a] = R[i], [nb, b] = R[j]
    if (na === 'character' || nb === 'character') continue
    const w = Math.min(a[0] + a[2], b[0] + b[2]) - Math.max(a[0], b[0]), h = Math.min(a[1] + a[3], b[1] + b[3]) - Math.max(a[1], b[1])
    if (w > 16 && h > 16) W(`vùng ${na} và ${nb} chồng nhau ${w}×${h}px`)
  }

  // 6. ghép cảnh so với preview-clean
  const prev = path.join(thuMuc, 'preview-clean.jpg')
  if (fs.existsSync(bg) && fs.existsSync(prev) && CW) {
    const c = createCanvas(CW, CH), x = c.getContext('2d')
    x.drawImage(await loadImage(bg), 0, 0, CW, CH)
    const lop = [...dsObj.filter(render), ...(m.characters ?? []).filter(render)].filter((o) => o.place && o.file && fs.existsSync(path.join(thuMuc, o.file)))
    lop.sort((a, b) => (a.z ?? 0) - (b.z ?? 0))
    for (const o of lop) { const im = await loadImage(path.join(thuMuc, o.file)); x.drawImage(im, o.place[0], o.place[1], o.place[2], o.place[3]) }
    const pimg = await loadImage(prev)
    const c2 = createCanvas(CW, CH), x2 = c2.getContext('2d'); x2.drawImage(pimg, 0, 0, CW, CH)
    const A = x.getImageData(0, 0, CW, CH).data, B = x2.getImageData(0, 0, CW, CH).data
    let sum = 0, lech = 0
    for (let i = 0; i < A.length; i += 4) {
      const d = (Math.abs(A[i] - B[i]) + Math.abs(A[i + 1] - B[i + 1]) + Math.abs(A[i + 2] - B[i + 2])) / 3
      sum += d; if (d > 24) lech++
    }
    const tb = sum / (A.length / 4), pc = (lech / (A.length / 4)) * 100
    if (pc > 3) E(`ghép theo manifest KHÁC preview-clean.jpg: ${pc.toFixed(1)}% điểm ảnh lệch (TB ${tb.toFixed(1)}/255)`)
    else ok.push(`ghép khớp preview-clean: ${pc.toFixed(2)}% điểm lệch (TB ${tb.toFixed(2)}/255)`)

    // 7. tương phản chữ trong text_box (trên ảnh đã ghép)
    const ink0 = hex(T.ink)
    const xau = []
    for (const o of dsObj.filter((q) => render(q) && q.text_box && q.place)) {
      const [tx, ty, tw, th] = o.text_box
      const sx = o.place[2] / o.width, sy = o.place[3] / o.height
      const rx = Math.max(0, Math.round(o.place[0] + tx * sx)), ry = Math.max(0, Math.round(o.place[1] + ty * sy))
      const rw = Math.min(CW - rx, Math.round(tw * sx)), rh = Math.min(CH - ry, Math.round(th * sy))
      if (rw < 4 || rh < 4) continue
      const dta = x.getImageData(rx, ry, rw, rh).data
      let r = 0, g = 0, b = 0, n = 0
      for (let i = 0; i < dta.length; i += 4) { r += dta[i]; g += dta[i + 1]; b += dta[i + 2]; n++ }
      const ink = hex(o.ink) ?? ink0
      const tp = tuongPhan(ink, [r / n, g / n, b / n])
      if (tp < 4.5) xau.push(`${o.id} ${tp.toFixed(1)}`)
    }
    if (xau.length) E(`tương phản chữ < 4.5 ở: ${xau.join(' · ')}`)
    else ok.push('tương phản chữ trong mọi text_box ≥ 4.5')
  }

  // 8. OCR (do ChatGPT chạy) — chỉ đọc kết quả
  const ocr = path.join(thuMuc, 'ocr-report.json')
  if (fs.existsSync(ocr)) {
    try {
      const j = JSON.parse(fs.readFileSync(ocr, 'utf8').replace(/^﻿/, ''))   // PowerShell ghi BOM
      const text = JSON.stringify(j)
      if (/"(co_chu|has_text|text_found)"\s*:\s*true/i.test(text)) E('OCR báo có chữ trong ảnh')
      else ok.push('ocr-report.json: không báo chữ')
    } catch { W('ocr-report.json không đọc được') }
  } else W('không có ocr-report.json')
  return { loi, canh, ok }
}

const TOI_DA_NHOM = Number((process.argv.find((a) => a.startsWith('--toi-da-nhom=')) ?? '--toi-da-nhom=4').split('=')[1])
const dsThuMuc = process.argv.slice(2).filter((a) => !a.startsWith('--'))
if (!dsThuMuc.length) { console.error('Dùng: node scripts/check-style-erp.mjs <thư-mục-style> […]'); process.exit(2) }
let hong = 0
for (const t of dsThuMuc) {
  const r = await kiem(t)
  console.log(`\n=== ${t} ===`)
  r.ok.forEach((s) => console.log('  ✔', s))
  r.canh.forEach((s) => console.log('  ⚠', s))
  r.loi.forEach((s) => console.log('  ✖', s))
  if (r.loi.length) hong++
}
console.log(hong ? `\n✖ ${hong}/${dsThuMuc.length} bộ chưa đạt` : `\n✔ ${dsThuMuc.length}/${dsThuMuc.length} bộ đạt`)
process.exit(hong ? 1 : 0)
