// cắt HÌNH GỐC từ PDF tài liệu (vector ⇒ nét đẹp): toạ độ đo trên ảnh trang 100 dpi (k9b/trang/<sach>-NN.png), xuất PNG 300 dpi.
//   node cat-hinh.mjs <ndt|nt|phl> <trang> <x> <y> <w> <h> <ra.png>
import { execFileSync } from 'node:child_process'
import { renameSync, readdirSync } from 'node:fs'
import { dirname, basename, join } from 'node:path'
const PDF = { ndt: 'DT.pdf', nt: 'DT2.pdf', phl: 'ly-thuyet-va-bai-tap-mon-toan-9-knttvcs-hoc-ky-1-pham-hoang-long.pdf' }
const [s, tr, x, y, w, h, ra] = process.argv.slice(2)
if (!ra || !PDF[s]) { console.error('Dùng: node cat-hinh.mjs <ndt|nt|phl> <trang> <x> <y> <w> <h> <ra.png>  (px trên ảnh trang 100 dpi)'); process.exit(2) }
const k = 3, goc = ra.replace(/\.png$/i, '')
execFileSync('C:/Users/WBPC/bin/pdftoppm.exe', ['-r', '300', '-f', tr, '-l', tr, '-x', String(Math.round(x * k)), '-y', String(Math.round(y * k)), '-W', String(Math.round(w * k)), '-H', String(Math.round(h * k)), '-png', '-singlefile', join('E:/BK ACADEMY/Tài liệu tham khảo/K9/Đường tròn', PDF[s]), goc])
console.log('→', goc + '.png')
