import { readFileSync, writeFileSync } from 'node:fs'
const K = process.argv[2]
const goi = JSON.parse(readFileSync(`${K}/nguon/_tat-ca.json`, 'utf8'))
const PILOT = { HH00105: [1, 8], HH00109: [2, 7] }
const nhom = []
for (const [bai, ds] of Object.entries(goi)) {
  let cur = null, w = 0, n = 0
  ds.forEach((d, i0) => {
    const i = i0 + 1, p = PILOT[bai]
    if (p && i >= p[0] && i <= p[1]) { cur = null; return }
    const tn = /\bTN\d+/.test(d.ma)
    const wi = tn ? 1 : 2
    if (!cur || w + wi > 14 || (cur.tn !== tn && w >= 6)) { cur = { bai, ten: `g${++n}`, ds: [], tn }; nhom.push(cur); w = 0 }
    cur.ds.push(i); w += wi
  })
}
writeFileSync(`${K}/nhom.json`, JSON.stringify(nhom, null, 1))
console.log(nhom.length, 'nhóm'); for (const g of nhom) console.log(g.bai, g.ten, g.ds.length, `[${g.ds[0]}–${g.ds.at(-1)}]`)
