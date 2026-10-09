import { readFileSync, writeFileSync } from 'node:fs'
const t = readFileSync('k9dt/PHL.txt', 'utf8').normalize('NFKC').replace(/[𝐴-𝑧]/gu, (c) => c)
const parts = t.split(/\n(?=\s*Câu \d+\.)/)
const phl = []
for (const p of parts) { const m = p.match(/^\s*Câu (\d+)\.\s*([\s\S]*)/); if (m) phl.push({ id: 'PHL ' + m[1], text: m[2].replace(/\n\s*5\.\d[\s\S]*$/, '').replace(/\s+/g, ' ').trim() }) }
const ndt = JSON.parse(readFileSync('k9b/ndt.json', 'utf8')).filter((x) => !x.laDang)
const norm = (s) => s.normalize('NFKD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]/g, '')
const grams = (s) => { const n = norm(s), g = new Set(); for (let i = 0; i < n.length - 4; i++) g.add(n.slice(i, i + 5)); return g }
const sim = (a, b) => { let k = 0; for (const x of a) if (b.has(x)) k++; return k / Math.max(1, Math.min(a.size, b.size)) }
const G = ndt.map((x) => [x.id, grams(x.text)])
const out = []
for (const p of phl) { const g = grams(p.text); let best = ['', 0]; for (const [id, h] of G) { const s = sim(g, h); if (s > best[1]) best = [id, s] } p.trung = best[1] > 0.8 ? best[0] : null; p.giong = best; out.push(p) }
writeFileSync('k9b/phl.json', JSON.stringify(out, null, 1))
console.log(out.length, 'câu PHL; trùng NĐT:', out.filter((p) => p.trung).length)
for (const p of out.filter((p) => !p.trung)) console.log(p.id, p.giong[0], p.giong[1].toFixed(2), '|', p.text.slice(0, 110))
