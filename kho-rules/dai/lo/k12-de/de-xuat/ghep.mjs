// ghep.mjs — ghép noi-dung/<CH>-<JOB>.txt theo thứ tự cây thành noi-dung/<CH>.txt (+ <CH>.ghichu.md). node ghep.mjs HS VT
import fs from 'node:fs'
for (const ch of process.argv.slice(2)) {
  const j = JSON.parse(fs.readFileSync(new URL(ch + '.json', import.meta.url), 'utf8'))
  const dir = new URL('noi-dung/', import.meta.url)
  const jobs = fs.readdirSync(dir).filter((f) => new RegExp(`^${ch}-[A-Z]\.txt$`).test(f)).sort()
  const khoi = {}, notes = []
  for (const f of jobs) {
    let t = fs.readFileSync(new URL(f, dir), 'utf8').replace(/\r\n/g, '\n')
    const i = t.search(/^## GHI CHÚ/m)
    if (i >= 0) { notes.push(`### ${f}\n` + t.slice(i).replace(/^## GHI CHÚ[^\n]*\n/, '')); t = t.slice(0, i) }
    for (const k of t.split(/^=== /m).slice(1)) { const id = k.slice(0, k.indexOf('\n')).trim().replace(/^N\s+/, '').split(/\s+/)[0]; if (khoi[id]) console.log('TRÙNG', id, f); khoi[id] = '=== ' + k.trimEnd() + '\n' }
  }
  const out = [], thieu = []
  for (const cd of j.chuyen_de) for (const n of cd.nhom) {
    if (khoi[n.id]) out.push(khoi[n.id]); else thieu.push(n.id)
    for (const d of n.dang) { if (khoi[d.id]) out.push(khoi[d.id]); else thieu.push(d.id) }
  }
  fs.writeFileSync(new URL(ch + '.txt', dir), out.join('\n') + '\n')
  fs.writeFileSync(new URL(ch + '.ghichu.md', dir), `# GHI CHÚ CHO CEO — ${ch} (gộp từ các lượt soạn)\n\n` + notes.join('\n\n') + '\n')
  const ids = j.chuyen_de.flatMap((c) => c.nhom.flatMap((n) => [n.id, ...n.dang.map((d) => d.id)]))
  console.log(ch, 'khối', out.length, '· thiếu', thieu.join(',') || 'không', '· thừa', Object.keys(khoi).filter((k) => !ids.includes(k)).join(',') || 'không')
}
