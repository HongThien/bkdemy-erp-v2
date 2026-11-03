// ra-tsv.mjs — ánh xạ câu đề thi (không Đ/S) → dạng MỚI cho HS/VT (theo `tu` mã cũ + `moi` mô tả NEW). node ra-tsv.mjs <rows.json>
import fs from 'node:fs'
const rows = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'))
for (const c of ['HS', 'VT']) {
  const j = JSON.parse(fs.readFileSync(new URL(c + '.json', import.meta.url), 'utf8'))
  const mapMa = {}, mapMo = {}
  for (const cd of j.chuyen_de) for (const n of cd.nhom) for (const d of n.dang) { for (const t of d.tu || []) mapMa[t] = d.id; for (const m of d.moi || []) mapMo[m] = d.id }
  const out = []
  for (const r of rows.filter((r) => r.ch === c && r.loai !== 'dung_sai')) {
    const moi = /^(NEW|\?)$/.test(r.dang), id = moi ? mapMo[r.mo] : mapMa[r.dang]
    if (id) out.push(`${r.id}\t${id}\t${moi ? 'moi: ' + r.mo : 'cũ ' + r.dang}`)
  }
  fs.writeFileSync(new URL(c + '-cau.tsv', import.meta.url), out.join('\n') + '\n')
  console.log(c, out.length)
}
