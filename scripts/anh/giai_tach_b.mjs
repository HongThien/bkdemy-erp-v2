// Tách câu THIẾU đáp án từ các lô của giai_chuan_bi.mjs ⇒ vao_b/lo-NNN.json cho bên B (giải mù lần 2, độc lập bên A). node … <thư mục> [cỡ lô=60]
import fs from 'node:fs'
import path from 'node:path'
const dir = process.argv[2]; const CO = Number(process.argv[3] ?? 60)
const khoa = JSON.parse(fs.readFileSync(`${dir}_khoa/khoa.json`, 'utf8'))
const ds = fs.readdirSync(dir).filter((f) => /^lo-\d+\.json$/.test(f)).sort().flatMap((f) => JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))).filter((c) => !khoa[c.ma].dap_an)
fs.mkdirSync(path.join(dir, 'vao_b'), { recursive: true })
for (let i = 0; i * CO < ds.length; i++) fs.writeFileSync(path.join(dir, 'vao_b', `lo-${String(i + 1).padStart(3, '0')}.json`), JSON.stringify(ds.slice(i * CO, (i + 1) * CO), null, 1))
console.log(`${ds.length} câu thiếu đáp án ⇒ ${Math.ceil(ds.length / CO)} lô bên B`)
