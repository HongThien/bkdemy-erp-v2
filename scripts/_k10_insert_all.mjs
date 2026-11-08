import fs from 'node:fs'; import path from 'node:path'; import { execFileSync } from 'node:child_process'
const S = process.argv[2]; const dir = path.join(S, 'lo')
const files = fs.readdirSync(dir).filter(f=>f.endsWith('.json')).sort().filter(f => f !== 'lo_001.json')
const res = { ok: 0, trung: 0, loi: [], ma: [] }
for (const f of files) {
  try {
    const out = execFileSync('node', ['scripts/nhap_kho.mjs', 'insert', '--subject', 'hgt', '--json', path.join(dir, f)], { encoding: 'utf8', stdio: ['ignore','pipe','pipe'] })
    const j = JSON.parse(out.slice(out.indexOf('{')))
    res.ok += j.inserted ?? 0; res.trung += (j.trung||[]).length; res.ma.push(...(j.ma_cau_list||[]))
    console.log(f, 'ok', j.inserted, 'trung', (j.trung||[]).length)
  } catch (e) { res.loi.push([f, String(e.stderr||e.message).slice(0,200)]); console.log(f, 'LỖI', String(e.stderr||e.message).slice(0,160)) }
}
fs.writeFileSync(path.join(S, 'insert-res.json'), JSON.stringify(res))
console.log('XONG', res.ok, 'trung', res.trung, 'loi', res.loi.length)
