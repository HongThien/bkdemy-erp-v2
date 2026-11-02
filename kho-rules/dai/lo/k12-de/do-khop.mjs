// do-khop.mjs — đo độ nhất quán của trạm đọc: (1) hai bản độc lập cùng lô; (2) đối chiếu chương với nhóm cũ (chỉ để kiểm, KHÔNG dùng làm nhãn).
//   node kho-rules/dai/lo/k12-de/do-khop.mjs <thư mục k12de> <lô A.tsv> [<lô B.tsv>]
import fs from 'node:fs'
const [d, fa, fb] = process.argv.slice(2)
const doc = (f) => fs.readFileSync(`${d}/kq/${f}`, 'utf8').trim().split('\n').map((l) => l.split('\t'))
const meta = JSON.parse(fs.readFileSync(`${d}/meta-nhom-cu.json`, 'utf8'))
const map = { T11201: 'HS', T11204: 'NHTP', T11207: 'VT', T11208: 'XS', T11209: 'SDT', T11210: 'PPTD' }
const a = doc(fa)
console.log(fa, a.length, 'dòng; số cột', [...new Set(a.map((x) => x.length))].join(','))
let n = 0, ok = 0; const sai = []
for (const x of a) { const c = map[(meta[x[0]] || '').slice(0, 6)]; if (c) { n++; if (c === x[1]) ok++; else sai.push(`${x[0]} cũ=${c} mới=${x[1]}/${x[2]}`) } }
console.log(`đối chiếu nhóm cũ: ${ok}/${n} cùng chương`, sai.slice(0, 8))
if (fb) {
  const b = doc(fb); let ch = 0, dg = 0, lech = 0; const kh = []
  for (let i = 0; i < a.length; i++) { if (a[i][0] !== b[i]?.[0]) { lech++; continue } if (a[i][1] === b[i][1]) { ch++; if (a[i][2] === b[i][2]) dg++ } else kh.push(`${a[i][0]} ${a[i][1]}/${a[i][2]} ≠ ${b[i][1]}/${b[i][2]}`) }
  console.log(`hai bản: lệch id ${lech} · khớp chương ${ch}/${a.length} · khớp cả dạng ${dg}/${a.length}`); console.log('khác chương:', kh.slice(0, 8))
}
