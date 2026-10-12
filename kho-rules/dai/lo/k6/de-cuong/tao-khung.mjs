// tao-khung.mjs — chia đề cương NSHM-GKI-2026 thành 10 tệp KHUNG cho trạm soạn: NSHM-GKI-2026.p<N>.soan.md
// (đề + ghi chú lúc nhập đã có; trạm soạn thêm loai / dap_an / lời giải 2 phần).
//   node kho-rules/dai/lo/k6/de-cuong/tao-khung.mjs <thư mục làm việc>
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const LV = process.argv[2]
const de = JSON.parse(readFileSync(join(LV, 'de.json'), 'utf8'))
const OUT = dirname(fileURLToPath(import.meta.url))
// nhóm theo bài (số bài + ý); mỗi nhóm ~10 câu, nâng cao tách riêng
const NHOM = [
  [1, 2, 3], [4, 5], [6], [7], [8, '9a-d'], ['9e-k'], [10], [11], [12, 13, 14, 15], [16, 17, 18, 19, 20],
]
const baiCua = (nhan) => { const m = nhan.match(/^Bài (\d+)([a-z]?)$/); return { bai: +m[1], y: m[2] } }
const thuocNhom = (q, g) => g.some((x) => {
  const { bai, y } = baiCua(q.nhan)
  if (typeof x === 'number') return bai === x
  const m = x.match(/^(\d+)([a-z])-([a-z])$/); if (!m) return false
  const [, b, y0, y1] = m
  // thứ tự ý của Bài 9: a b c d e f g h i j q k  (nhãn gốc) — theo vị trí trong đề, không theo chữ cái
  const bs = de.cau.filter((c) => baiCua(c.nhan).bai === +b).map((c) => baiCua(c.nhan).y)
  const i = bs.indexOf(y), i0 = bs.indexOf(y0), i1 = bs.indexOf(y1)
  return bai === +b && i >= i0 && i <= i1 && !(i1 === bs.length - 1 && false)
})
const thuocNhomRong = (q, g) => {
  // "9e-k" nghĩa là từ ý e tới ý cuối của Bài 9
  return g.some((x) => {
    const { bai, y } = baiCua(q.nhan)
    if (typeof x === 'number') return bai === x
    const m = x.match(/^(\d+)([a-z])-([a-z])$/)
    const bs = de.cau.filter((c) => baiCua(c.nhan).bai === +m[1]).map((c) => baiCua(c.nhan).y)
    const i = bs.indexOf(y), i0 = bs.indexOf(m[2])
    const i1 = x === '9e-k' ? bs.length - 1 : bs.indexOf(m[3])
    return bai === +m[1] && i >= i0 && i <= i1
  })
}
void thuocNhom

const used = new Set()
NHOM.forEach((g, n) => {
  const cs = de.cau.filter((q) => thuocNhomRong(q, g))
  cs.forEach((q) => { if (used.has(q.nhan)) throw new Error('trùng ' + q.nhan); used.add(q.nhan) })
  const phans = [...new Set(cs.map((q) => q.phan))]
  let md = `# ĐỀ | ${de.ten}\nnam: 2026\nbo_sach: KNTT\n`
  for (const pt of phans) {
    const p = de.phan.find((x) => x.thu_tu === pt)
    md += `\n## PHẦN ${pt} | ${p.ten} | tu_luan\n`
    for (const q of cs.filter((c) => c.phan === pt)) {
      md += `\n### ${q.nhan} | kho=dai | loai=tu_luan | dap_an=—\n**Đề:** ${q.noi_dung}\n`
      for (const cb of q.canh_bao) md += cb.startsWith('CHƯA CHẮC — ') ? `**Chưa chắc:** ${cb.slice(12)}\n` : `**Ghi chú:** ${cb}\n`
    }
  }
  writeFileSync(join(OUT, `NSHM-GKI-2026.p${n + 1}.soan.md`), md)
  console.log(`p${n + 1}: ${cs.length} câu — ${cs.map((q) => q.nhan.replace('Bài ', '')).join(' ')}`)
})
if (used.size !== de.cau.length) throw new Error(`thiếu câu: ${used.size}/${de.cau.length}`)
