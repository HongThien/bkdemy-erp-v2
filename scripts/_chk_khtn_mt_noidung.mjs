import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const r = (await c.query(`select k.ma_cau, k.loai_cau, k.noi_dung, k.anh_de, k.lua_chon, k.menh_de from khtn_cau_hoi k join tai_lieu_cau c on c.ma_cau=k.ma_cau join tai_lieu_phan p on p.id=c.phan_id join tai_lieu t on t.id=p.tai_lieu_id where t.mon='KHTN' and t.loai='mt' order by k.ma_cau`)).rows
const dollars = (s) => (String(s ?? '').match(/\$/g) ?? []).length
const flag = (x) => ({ ma: x.ma_cau, loai: x.loai_cau, len: x.noi_dung?.length ?? 0, anh: !!x.anh_de, lc: Array.isArray(x.lua_chon) ? x.lua_chon.length : 0,
  dollarLe: dollars(x.noi_dung) % 2 === 1, uni: /\\unicode/.test(x.noi_dung ?? ''), nlit: /\\n/.test(x.noi_dung ?? ''), ce: /\\ce\{/.test(x.noi_dung ?? ''), lcDollarLe: (x.lua_chon ?? []).some((o) => dollars(o) % 2 === 1) })
const f = r.map(flag)
console.log('tổng', f.length, '| loai', JSON.stringify(f.reduce((a, x) => (a[x.loai] = (a[x.loai] ?? 0) + 1, a), {})), '| ảnh', f.filter((x) => x.anh).length, '| dài nhất', Math.max(...f.map((x) => x.len)))
for (const k of ['dollarLe', 'uni', 'nlit', 'ce', 'lcDollarLe']) console.log(k + ':', f.filter((x) => x[k]).map((x) => x.ma).join(',') || 'không')
console.log('TN thiếu lua_chon:', f.filter((x) => x.loai === 'trac_nghiem' && x.lc < 2).map((x) => x.ma).join(',') || 'không')
const bad = f.filter((x) => x.dollarLe || x.uni || x.nlit || x.lcDollarLe)
for (const b of bad.slice(0, 4)) console.log('\n', b.ma, JSON.stringify(r.find((x) => x.ma_cau === b.ma).noi_dung).slice(0, 300))
await c.end()
