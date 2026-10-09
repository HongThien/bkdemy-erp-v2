// gom nghi vấn của mọi câu đã ghi ⇒ bảng markdown (mã câu DB · nguồn · nghi vấn), bỏ các câu "Nghi vấn: không".
import { readFileSync, existsSync, writeFileSync } from 'node:fs'
const K = 'C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/0b0aaccd-e68b-45b5-96e4-b914b4d1311c/scratchpad/k9b'
const out = process.argv[2]
const TEN = { HH00105: 'Đường tròn', HH00106: 'Độ dài cung tròn', HH00107: 'Diện tích quạt tròn', HH00108: 'Vị trí đường thẳng – đường tròn', HH00109: 'Hai tiếp tuyến cắt nhau', HH00110: 'Vị trí hai đường tròn' }
let md = ''
let tong = 0
for (const bai of Object.keys(TEN)) {
  const ma = {}
  for (const d of [`${K}/gan/${bai}`, `${K}/gan/${bai}-noi`]) if (existsSync(`${d}/_map.json`)) for (const m of JSON.parse(readFileSync(`${d}/_map.json`, 'utf8'))) ma[m.nhan] = m.ma_cau
  const nguon = Object.fromEntries(JSON.parse(readFileSync(`${K}/ghep/${bai}/nguon.json`, 'utf8')).map((x) => [x.nhan, x.nguon]))
  const txt = [`${K}/ghep/${bai}/draft.md`, `${K}/ghep/${bai}/noi.md`].filter(existsSync).map((f) => readFileSync(f, 'utf8')).join('\n')
  const rows = []
  for (const b of txt.split(/\n(?=### )/).filter((x) => x.startsWith('### '))) {
    const nh = b.match(/^### (\S+)/)[1]
    const kh = b.slice(b.search(/\*\*(cấu hình|nghi vấn)/)).replace(/\*\*hinh(_lg)?:\*\*.*/g, '')
    const i = kh.lastIndexOf('Nghi vấn')
    let nv = (i >= 0 ? kh.slice(i + 8).replace(/^[:\s]+/, '') : '').replace(/\s+/g, ' ').trim()
    if (!nv || /^(không|không có)\.?$/i.test(nv) || /^không[.;,]? *$/i.test(nv)) continue
    nv = nv.replace(/\|/g, '/').slice(0, 600)
    rows.push(`| ${ma[nh] || nh} | ${nguon[nh] || ''} | ${nv} |`)
  }
  tong += rows.length
  md += `\n## ${bai} — ${TEN[bai]} (${rows.length} câu có ghi chú)\n\n| Mã câu | Nguồn | Ghi chú của người soạn (đã sửa/thêm vào đề, cách hiểu, đề xuất) |\n|---|---|---|\n${rows.join('\n')}\n`
}
writeFileSync(out, md)
console.log('tổng', tong, 'câu có ghi chú →', out)
