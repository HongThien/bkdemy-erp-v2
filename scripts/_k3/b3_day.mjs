import { pool, luu } from './lib.mjs'
import { norm, dungForm } from './core.mjs'
const out = []; let rot = 0
for (const c of pool().filter((c) => /đếm (thêm|bớt)/.test(c.noi_dung))) {
  const t = norm(c.noi_dung).replace(/\.{3,}/g, '...')
  const m = t.match(/đếm (thêm|bớt) (\d+)\s*\)\s*:\s*(.*?)\.?$/)
  if (!m) { out.push({ ma_cau: c.ma_cau, bo: 'không đọc được đề' }); continue }
  const dir = m[1] === 'thêm' ? 1 : -1, st = +m[2]
  const items = m[3].replace(/\.$/, '').split(',').map((x) => x.trim())
  const known = items.map((x, i) => (/^\d+$/.test(x) ? [i, +x] : null)).filter(Boolean)
  if (!known.length || known.length === items.length) { out.push({ ma_cau: c.ma_cau, bo: 'dãy không có chỗ trống' }); continue }
  const [p, v] = known[0]; const at = (i) => v + dir * st * (i - p)
  if (known.some(([i, x]) => at(i) !== x)) { out.push({ ma_cau: c.ma_cau, bo: 'dãy không đều theo bước' }); continue }
  const vals = items.map((x, i) => (x === '...' ? at(i) : null)).filter((x) => x !== null)
  if (vals.some((x) => x < 0)) { out.push({ ma_cau: c.ma_cau, bo: 'âm' }); continue }
  out.push(dungForm(c, vals, vals.map(() => ({ loai: dir > 0 ? 'cong' : 'tru' })), rot++))
}
luu('k3_b3_day', out)
