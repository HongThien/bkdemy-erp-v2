// ============================================================================
// ap-sua-de-clc6.mjs — ÁP tệp sửa đề (kho-rules/dai/lo/clc6/sua-de.mjs) lên de.json của tach-clc6.mjs ⇒ de-da-sua.json.
//
//   node scripts/kho/de-thi/ap-sua-de-clc6.mjs <de.json> --sua kho-rules/dai/lo/clc6/sua-de.mjs --hinh-de kho-rules/dai/hinh-de --ra <de-da-sua.json>
//
// Giữ `noi_dung_goc` / `lua_chon_goc` / `hinh_goc` (bản Word) cạnh bản đã sửa ⇒ luôn truy lại được đã đổi gì.
// `thay` không tìm thấy chuỗi cũ ⇒ DỪNG (đề đã đổi hoặc tệp sửa lệch) — không sửa "gần đúng".
// Không gọi AI, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const args = process.argv.slice(2)
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const fDe = args.find((a) => !a.startsWith('--') && a !== lay('--sua') && a !== lay('--ra') && a !== lay('--hinh-de'))
const fSua = lay('--sua'), RA = lay('--ra'), HD = lay('--hinh-de')
if (!fDe || !fSua || !RA) { console.error('Dùng: node scripts/kho/de-thi/ap-sua-de-clc6.mjs <de.json> --sua <sua-de.mjs> [--hinh-de <dir>] --ra <de-da-sua.json>'); process.exit(2) }

const de = JSON.parse(readFileSync(fDe, 'utf8'))
const { SUA } = await import(pathToFileURL(resolve(fSua)).href)
const maNguon = (d, c) => `${d.ma} · ${d.danh_so_xuyen_phan || !d.phan.length ? '' : `P${c.phan}.`}${c.so}`
const daDung = new Set(), loi = [], dem = { thay: 0, noi_dung: 0, lua_chon: 0, kieu: 0, hinh: 0, hinh_bu: 0, bo: 0, luu_y: 0 }

for (const d of de) for (const c of d.cau) {
  const m = maNguon(d, c), s = SUA[m]
  c.ma_nguon = m
  if (!s) continue
  daDung.add(m)
  if (s.thay) {
    c.noi_dung_goc ??= c.noi_dung
    for (const [cu, moi] of s.thay) {
      if (!c.noi_dung.includes(cu)) { loi.push(`${m}: không thấy chuỗi cần thay «${cu.slice(0, 60)}»`); continue }
      if (c.noi_dung.split(cu).length > 2) { loi.push(`${m}: chuỗi cần thay xuất hiện nhiều hơn 1 lần «${cu.slice(0, 40)}»`); continue }
      c.noi_dung = c.noi_dung.replace(cu, () => moi); dem.thay++
    }
  }
  if (s.noi_dung != null) { c.noi_dung_goc ??= c.noi_dung; c.noi_dung = s.noi_dung; dem.noi_dung++ }
  if (s.lua_chon) { c.lua_chon_goc = c.lua_chon; c.lua_chon = s.lua_chon; dem.lua_chon++ }
  if (s.kieu) { c.kieu_goc = c.kieu; c.kieu = s.kieu; dem.kieu++ }
  if (s.hinh) { c.hinh_goc = c.hinh; c.hinh = s.hinh; dem.hinh++ }
  if (s.hinh_bu) {
    for (const h of s.hinh_bu) if (HD && !existsSync(join(HD, h))) loi.push(`${m}: thiếu tệp hình bù ${h}`)
    c.hinh_bu = s.hinh_bu; dem.hinh_bu++
  }
  if (s.bo) { c.bo = s.bo; dem.bo++ }
  if (s.luu_y_soan) { c.luu_y_soan = s.luu_y_soan; dem.luu_y++ }
  if (s.ghi_chu_duyet) c.ghi_chu_duyet = s.ghi_chu_duyet
  if (s.bang_chung) c.bang_chung = s.bang_chung
  if (c.lua_chon && c.kieu !== 'trac_nghiem') loi.push(`${m}: có lua_chon mà kieu = ${c.kieu}`)
}
for (const m of Object.keys(SUA)) if (!daDung.has(m)) loi.push(`${m}: có trong tệp sửa nhưng KHÔNG có câu này trong đề`)
// mỗi ảnh media chỉ thuộc một câu
const chu = new Map()
for (const d of de) for (const c of d.cau) for (const h of c.hinh) { if (chu.has(h)) loi.push(`ảnh ${h} gắn cho 2 câu: ${chu.get(h)} và ${c.ma_nguon}`); chu.set(h, c.ma_nguon) }

const n = de.reduce((s, d) => s + d.cau.length, 0), bo = de.reduce((s, d) => s + d.cau.filter((c) => c.bo).length, 0)
console.log(`${de.length} đề · ${n} câu (bỏ ${bo}, còn ${n - bo}) · sửa ${daDung.size} câu: ${JSON.stringify(dem)}`)
const theoBC = {}
for (const m of daDung) { const b = SUA[m].bang_chung ?? (SUA[m].bo ? 'bo' : '?'); (theoBC[b] ??= []).push(m) }
for (const [b, ds] of Object.entries(theoBC)) console.log(`  ${b}: ${ds.length}`)
if (loi.length) { for (const l of loi) console.log('❌', l); process.exit(1) }
writeFileSync(RA, JSON.stringify(de, null, 1))
console.log('→', RA)
