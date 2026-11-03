// chuan-bi.mjs — chuẩn bị thư mục làm việc cho 28 ĐỀ CƯƠNG CUỐI KÌ I Toán 9 trong kho tham khảo (Thùy 03/11: "Làm Cuối kì trước đi. Ưu tiên bài Hình trước").
//   node kho-rules/dai/lo/k9/ck/chuan-bi.mjs            → quét "E:\BK ACADEMY\Tài liệu tham khảo\K9\Đề cương\CKI", ghi ds.json + <LV>\{goc.pdf,trang\,img\,tam\,z\,de.boc.json}
// Mỗi tệp PDF = một đề cương (bản .doc/.docx trùng tên với .pdf bị bỏ qua). Mã: CK-<năm học 2425|2526>-<slug trường>.
// Hai lượt: HÌNH (tai_lieu "… · phần Hình") rồi ĐẠI SỐ ("… · phần Đại số") — sha256 khoá chặn trùng của ghi.mjs khác nhau theo lượt (sha256 của pdf + ':hinh' / ':dai').
import { readdirSync, mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from 'node:fs'
import { join, dirname, basename } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createHash } from 'node:crypto'
import { spawnSync } from 'node:child_process'
import { homedir } from 'node:os'

const HERE = dirname(fileURLToPath(import.meta.url))
const NGUON = 'E:/BK ACADEMY/Tài liệu tham khảo/K9/Đề cương/CKI'
const GOC = join(homedir(), 'bk-kho-lam-viec/de-cuong/K9/CK')
const TEN = {
  'everest-schools': 'Everest Schools', 'thanh-am': 'THCS Thanh Âm', 'tho-loc': 'THCS Thọ Lộc', 'lomonoxop': 'Trường M.V. Lômônôxốp',
  'nguyen-binh-khiem': 'THCS Nguyễn Bỉnh Khiêm', 'thinh-liet': 'THCS Thịnh Liệt', 'thanh-cong': 'THCS Thành Công', 'hoang-hoa-tham': 'THCS Hoàng Hoa Thám',
  'archimedes-school': 'Hệ thống GD Archimedes School', 'doan-thi-diem': 'THCS Đoàn Thị Điểm', 'thang-long': 'THCS Thăng Long', 'phan-chu-trinh': 'THCS Phan Chu Trinh',
  'phuc-dien': 'THCS Phúc Diễn', 'le-quy-don': 'THCS Lê Quý Đôn', 'nguyen-truong-to': 'THCS Nguyễn Trường Tộ', 'ai-mo': 'THCS Ái Mộ', 'nguyen-du': 'THCS Nguyễn Du',
  'ngoc-lam': 'THCS Ngọc Lâm', 'yen-hoa': 'THCS Yên Hòa', 'ban-mai-school': 'Trường Ban Mai School', 'chu-van-an': 'THCS Chu Văn An', 'giang-vo-2': 'THCS Giảng Võ 2',
}
const ds = []
const tep = readdirSync(NGUON).filter((f) => f.toLowerCase().endsWith('.pdf')).sort()
for (const f of tep) {
  const m = f.match(/nam-(\d{4})-(\d{4})-(.+)\.pdf$/i)
  if (!m) { console.log('⚠ bỏ qua (không đọc được năm học):', f); continue }
  const nam = m[1].slice(2) + m[2].slice(2)
  let slug = m[3].replace(/^(truong-thcsthpt-|truong-thcs-|truong-m-v-|truong-|he-thong-gd-)/, (x) => (x === 'truong-m-v-' ? '' : '')).replace(/-ha-noi$/, '')
  if (/lomonoxop/.test(f)) slug = 'lomonoxop'
  const khoa = Object.keys(TEN).find((k) => slug === k || slug.startsWith(k)) ?? slug
  const ma = `CK-${nam}-${slug}`
  const LV = join(GOC, ma)
  for (const d of ['trang', 'img', 'tam', 'z']) mkdirSync(join(LV, d), { recursive: true })
  if (!existsSync(join(LV, 'goc.pdf'))) copyFileSync(join(NGUON, f), join(LV, 'goc.pdf'))
  if (!existsSync(join(LV, 'trang', 'p-1.png')) && !existsSync(join(LV, 'trang', 'p-01.png'))) spawnSync('pdftoppm', ['-r', '130', '-png', join(LV, 'goc.pdf'), join(LV, 'trang', 'p')], { stdio: 'ignore' })
  const pdf = readFileSync(join(LV, 'goc.pdf'))
  const sha = (hau) => createHash('sha256').update(pdf).update(hau).digest('hex')
  const nHoc = `${m[1]}–${m[2]}`
  const tenTruong = TEN[khoa] ?? slug
  const trang = readdirSync(join(LV, 'trang')).length
  const info = { ma, tep: f, nam_hoc: nHoc, truong: tenTruong, trang, LV: LV.replaceAll('\\', '/'), sha_hinh: sha(':hinh'), sha_dai: sha(':dai') }
  writeFileSync(join(LV, 'de.boc.json'), JSON.stringify({ file: f, sha256: info.sha_hinh, ghi_chu: 'khung cho dung-de-tu-soan.mjs (lượt Hình); lượt Đại đổi sha256 = sha_dai' }, null, 1))
  writeFileSync(join(LV, 'thongtin.json'), JSON.stringify(info, null, 1))
  ds.push(info)
}
writeFileSync(join(HERE, 'ds.json'), JSON.stringify(ds, null, 1))
console.log(`✔ ${ds.length} đề cương · ${ds.reduce((s, x) => s + x.trang, 0)} trang → kho-rules/dai/lo/k9/ck/ds.json`)
for (const x of ds) console.log(`${x.ma.padEnd(34)} ${String(x.trang).padStart(2)} tr  ${x.nam_hoc}  ${x.truong}`)
