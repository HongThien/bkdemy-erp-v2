// ============================================================================
// so-ba-nguon.mjs — SO ĐÁP SỐ của một đề CLC lớp 6 từ BA nguồn độc lập:
//   (1) bản soạn (Sonnet soạn lời giải từ Word) · (2) người kiểm tự tính bằng code · (3) đáp số in trong sách (PDF).
//
//   node scripts/kho/de-thi/so-ba-nguon.mjs <in-đề.json> <soan-đề.json> <kiem-đề.json> [--ra <kq.json>]
//
// So bằng TẬP SỐ trong đáp số (bỏ đơn vị, cách gõ); trắc nghiệm so chữ cái. Máy chỉ xếp loại:
//   khop      — soạn = tự tính (và = sách nếu có)
//   sach_lech — soạn = tự tính ≠ sách  ⇒ nhiều khả năng sách sai, Opus xem
//   lech      — soạn ≠ tự tính         ⇒ Opus phân xử, KHÔNG ghi trước khi xử lý
//   mot_nguon — thiếu tự tính (không tính được) ⇒ Opus tự giải lại
// Không gọi AI, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync } from 'node:fs'

const args = process.argv.slice(2)
const [fIn, fSoan, fKiem] = args.filter((a) => !a.startsWith('--'))
const iRa = args.indexOf('--ra'), RA = iRa >= 0 ? args[iRa + 1] : null
if (!fKiem) { console.error('Dùng: node scripts/kho/de-thi/so-ba-nguon.mjs <in.json> <soan.json> <kiem.json> [--ra kq.json]'); process.exit(2) }
const vao = JSON.parse(readFileSync(fIn, 'utf8')), soan = JSON.parse(readFileSync(fSoan, 'utf8')), kiem = JSON.parse(readFileSync(fKiem, 'utf8'))

/** Tập số của một đáp số: bỏ lệnh LaTeX, gộp "36 000" → 36000, phân số a/b giữ thành "a/b", bỏ số mũ đơn vị (cm^2, m3). */
export function tapSo(s) {
  if (s == null) return null
  let t = String(s)
    .replace(/\\d?frac\{([^{}]*)\}\{([^{}]*)\}/g, ' $1/$2 ')
    .replace(/\\text\{[^}]*\}/g, ' ').replace(/\^\{?\d\}?/g, ' ')
    .replace(/\b(cm|dm|mm|km|m)[23]\b/g, ' ')
    .replace(/\\[a-zA-Z]+|[{}$]/g, ' ').replace(/\\[,;! ]/g, ' ')
  t = t.replace(/(?<=\d)[ .](?=\d{3}(?!\d))/g, '')
  const so = t.match(/\d+(?:,\d+)?(?:\s*\/\s*\d+)?/g) ?? []
  return so.map((x) => x.replace(/\s+/g, '').replace(/,0+$/, '').replace(/(,\d*?)0+$/, '$1')).sort()
}
const chu = (s) => (String(s ?? '').match(/(?:^|[\s(])([A-E])(?:[\s).]|$)/) ?? [])[1] ?? null
const bang = (a, b) => a && b && a.length === b.length && a.every((v, i) => v === b[i])
/** a "nằm trong" b: mọi số của a có trong b (đáp số gọn của soạn so với câu trả lời dài hơn của nguồn kia). */
const nam = (a, b) => a && b && a.length > 0 && a.every((v) => b.includes(v))

const kq = [], dem = {}
for (const c of vao.cau) {
  const s = soan.find((x) => x.ma_nguon === c.ma_nguon), k = kiem[c.ma_nguon]
  let loai, vi = ''
  if (!s) { loai = 'thieu_soan' }
  else if (s.bo) { loai = 'bo'; vi = s.bo }
  else if (!k || k.dap_so_tinh == null) { loai = 'mot_nguon' }
  else {
    let soanTinh, tinhSach
    if (c.kieu === 'trac_nghiem') {
      soanTinh = chu(s.dap_an) && chu(s.dap_an) === chu(k.dap_so_tinh)
      const cs = chu(k.dap_so_sach)
      tinhSach = k.dap_so_sach == null ? null : cs ? cs === chu(k.dap_so_tinh) : (k.khop_sach ?? null)
    } else {
      const a = tapSo(s.dap_an), b = tapSo(k.dap_so_tinh), d = tapSo(k.dap_so_sach)
      soanTinh = a.length || b.length ? bang(a, b) || nam(a, b) || nam(b, a) : String(s.dap_an).trim().toLowerCase() === String(k.dap_so_tinh).trim().toLowerCase()
      tinhSach = k.dap_so_sach == null ? null : (b.length || d.length ? bang(b, d) || nam(b, d) || nam(d, b) : null)
      if (tinhSach == null && k.dap_so_sach != null) tinhSach = k.khop_sach ?? null   // đáp số chữ (Thứ Ba…): tin cờ của người kiểm
      if (!a.length && !b.length && !soanTinh) vi = 'đáp số bằng chữ — so tay'
    }
    loai = !soanTinh ? 'lech' : tinhSach === false ? 'sach_lech' : 'khop'
  }
  dem[loai] = (dem[loai] ?? 0) + 1
  kq.push({ ma_nguon: c.ma_nguon, kieu: c.kieu, loai, soan: s?.dap_an ?? null, tinh: k?.dap_so_tinh ?? null, sach: k?.dap_so_sach ?? null, de_lech: k?.de_lech ?? null, ghi_chu_kiem: k?.ghi_chu ?? null, ghi_chu_soan: s?.ghi_chu_nghi ?? null, vi })
}
const thua = soan.filter((x) => !vao.cau.some((c) => c.ma_nguon === x.ma_nguon)).map((x) => x.ma_nguon)
console.log(`${vao.ma_de}: ${vao.cau.length} câu · ${JSON.stringify(dem)}${thua.length ? ' · ⚠ mã lạ trong bản soạn: ' + thua.join(', ') : ''}`)
const cat = (s, n) => String(s ?? '—').replace(/\s+/g, ' ').slice(0, n)
for (const r of kq) {
  const dau = { khop: '✔', sach_lech: '◐', lech: '✖', mot_nguon: '?', bo: '∅', thieu_soan: '✖' }[r.loai]
  if (r.loai !== 'khop' || r.de_lech || r.ghi_chu_soan) {
    console.log(`${dau} ${r.ma_nguon} [${r.kieu}] ${r.loai}\n    soạn: ${cat(r.soan, 90)}\n    tính: ${cat(r.tinh, 90)}\n    sách: ${cat(r.sach, 90)}${r.de_lech ? '\n    ĐỀ LỆCH: ' + cat(r.de_lech, 200) : ''}${r.ghi_chu_kiem ? '\n    kiểm ghi: ' + cat(r.ghi_chu_kiem, 220) : ''}${r.ghi_chu_soan ? '\n    soạn ghi: ' + cat(r.ghi_chu_soan, 220) : ''}${r.vi ? '\n    (' + r.vi + ')' : ''}`)
  }
}
if (RA) { writeFileSync(RA, JSON.stringify(kq, null, 1)); console.log('→', RA) }
