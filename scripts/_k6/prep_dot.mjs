// Kho lớp 6 viết dấu nhân bằng "." (vd 12.53+53.172-53.84 = 5300). mcq-auto đọc "." là dấu thập phân ⇒ tính sai.
// Chuẩn hoá "." → " \cdot " CHỈ trong file pool tạm cho mcq-auto (kho không bị đổi; verify đọc đáp số từ DB).
import { readFileSync, writeFileSync } from 'node:fs'
const S = 'C:/Users/Admin/AppData/Local/Temp/claude/f905597530a85c45/51e171c7-f497-4a83-9c66-5c227b8c3c0f/scratchpad'
const BS = String.fromCharCode(92)
const [vao, ra] = process.argv.slice(2)
const p = JSON.parse(readFileSync(vao.replace('S:', S), 'utf8'))
let doi = 0
for (const c of p.cau) {
  const mathParts = c.noi_dung.split('$')
  const moi = mathParts.map((seg, i) => (i % 2 === 1 ? seg.replace(/(?<![.\d]\.)(?<=[\d)\]}a-z])\.(?=[\d(\[\\{a-z-])/g, ` ${BS}cdot `) : seg)).join('$')
  if (moi !== c.noi_dung) { c.noi_dung = moi; doi++ }
}
writeFileSync(ra.replace('S:', S), JSON.stringify(p))
console.log('đã đổi', doi, 'câu')
