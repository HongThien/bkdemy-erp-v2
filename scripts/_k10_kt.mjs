import fs from 'node:fs'; import { createRequire } from 'node:module'
const require = createRequire(import.meta.url); const katex = require('katex')
const S = process.argv[2]
const moi = JSON.parse(fs.readFileSync(`${S}/moi.json`,'utf8'))
const tags = {}; let hong = 0, tongCT = 0; const ex = []
const fields = (r) => [r.noi_dung, ...(r.lua_chon||[]), r.loi_giai, r.dap_an, ...(r.menh_de||[]).flatMap(m=>[m.noi_dung,m.loi_giai])].filter(Boolean)
for (const r of moi) {
  for (const f of fields(r)) {
    for (const m of f.matchAll(/\[\[[^\]]*\]\]/g)) tags[m[0].replace(/:.*\]\]/, ':…]]')] = (tags[m[0].replace(/:.*\]\]/, ':…]]')]||0)+1
    const parts = f.split('$'); if ((parts.length-1)%2) { ex.push(['le$', r.file.slice(0,25), r.so, f.slice(0,80)]); }
    for (let i=1;i<parts.length;i+=2) { tongCT++; try { katex.renderToString(parts[i], {throwOnError:true}) } catch(e) { hong++; if (ex.length<25) ex.push(['katex', r.file.slice(0,25), r.so, parts[i].slice(0,70), String(e.message).slice(0,60)]) } }
  }
}
console.log({tongCT, hong, tags}); ex.slice(0,25).forEach(x=>console.log(JSON.stringify(x)))
