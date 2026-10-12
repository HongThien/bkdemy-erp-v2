// ============================================================================
// dau-vao-clc6.mjs — dựng ĐẦU VÀO SOẠN cho từng đề của bộ CLC lớp 6 từ de.json (tach-clc6.mjs).
//
//   node scripts/kho/de-thi/dau-vao-clc6.mjs <de.json> --de "LTV 2018,CG 2022" --media <thư mục ảnh> --ra <thư mục>
//
// Mỗi đề một tệp <ra>/in-<mã đề>.json: [{ ma_nguon, kieu, diem, noi_dung, lua_chon, hinh[] }].
// ma_nguon = "<mã đề> · <số>" (đề không chia phần hoặc đánh số nối tiếp) | "<mã đề> · P<phần>.<số>" (mỗi phần đếm lại từ 1)
// — bám NHÃN in trong đề, không bám vị trí. Không gọi AI, không đụng DB.
// ============================================================================
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs'
import { join } from 'node:path'

const args = process.argv.slice(2)
const lay = (k) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : null }
const tep = args.find((a) => !a.startsWith('--')), DE = lay('--de'), MEDIA = lay('--media'), RA = lay('--ra')
const HINH_DE = lay('--hinh-de')   // thư mục hình bù (kho-rules/dai/hinh-de), đường dẫn tuyệt đối để người soạn mở được
if (!tep || !RA) { console.error('Dùng: node scripts/kho/de-thi/dau-vao-clc6.mjs <de.json> [--de "LTV 2018,CG 2022"] --media <dir> --ra <dir>'); process.exit(2) }
const de = JSON.parse(readFileSync(tep, 'utf8'))
const chon = DE ? DE.split(',').map((s) => s.trim()) : de.map((d) => d.ma)
mkdirSync(RA, { recursive: true })

export const maNguon = (d, c) => `${d.ma} · ${d.danh_so_xuyen_phan || !d.phan.length ? '' : `P${c.phan}.`}${c.so}`

for (const ma of chon) {
  const d = de.find((x) => x.ma === ma)
  if (!d) { console.error('❌ không có đề', ma); process.exit(1) }
  if (d.co.length) console.log(`⚠ ${ma}: ${d.co.join(' · ')}`)
  // câu có `bo` (đề nguồn không có nội dung — tệp sửa đề) không đưa vào đầu vào
  const ds = d.cau.filter((c) => !c.bo).map((c) => {
    const hinh = [
      ...c.hinh.map((h) => MEDIA ? join(MEDIA, h).replace(/\\/g, '/') : h),
      ...(c.hinh_bu ?? []).map((h) => HINH_DE ? join(HINH_DE, h).replace(/\\/g, '/') : h),   // hình lấy bù từ PDF
    ]
    for (const h of hinh) if ((MEDIA || HINH_DE) && !existsSync(h)) console.log(`⚠ ${ma} câu ${c.so}: thiếu tệp ảnh ${h}`)
    const r = { ma_nguon: c.ma_nguon ?? maNguon(d, c), kieu: c.kieu, diem: c.diem, noi_dung: c.noi_dung, lua_chon: c.lua_chon, hinh }
    if (c.luu_y_soan) r.luu_y_de = c.luu_y_soan
    return r
  })
  const trung = ds.map((x) => x.ma_nguon).filter((k, i, a) => a.indexOf(k) !== i)
  if (trung.length) { console.error(`❌ ${ma}: ma_nguon trùng ${trung.join(', ')}`); process.exit(1) }
  const f = join(RA, `in-${ma.replace(/\s+/g, '-')}.json`)
  writeFileSync(f, JSON.stringify({ ma_de: d.ma, ten_de: d.ten, truong: d.truong, nam_hoc: d.nam, ghi_chu: d.ghi_chu, phan: d.phan, cau: ds }, null, 1))
  console.log(`✔ ${ma}: ${ds.length} câu (${ds.filter((x) => x.hinh.length).length} câu có hình) → ${f}`)
}
