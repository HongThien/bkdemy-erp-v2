import { readFileSync } from 'node:fs'; import { fileURLToPath } from 'node:url'; import { dirname, join } from 'node:path'; import pg from 'pg'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const url = readFileSync(join(root, '.env'), 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)?.[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect(); const q = async s => (await c.query(s)).rows
const TBV = { gv: [['danhgia','Đánh giá'],['ingame','Chấm bài']], tg: [['ingame','Chấm bài'],['et','Chấm ET']] }
for (const who of ['Phạm Thị Thùy Trang','Nguyễn Công Hải']) {
  const ns = (await q(`select id from nhan_su where ho_ten='${who}' limit 1`))[0]
  const roles = {}; for (const r of await q(`select lop_id, vai_tro from phan_cong_lop where nhan_su_id='${ns.id}'`)) (roles[r.lop_id] ??= new Set()).add(r.vai_tro==='gv'?'gv':'tg')
  const buois = await q(`select b.id, l.ten_lop, b.lop_id from buoi_hoc b join lop l on l.id=b.lop_id where b.trang_thai='mo' and b.loai='thuong' and b.lop_id = any(array[${Object.keys(roles).map(x=>`'${x}'`).join(',')||"'00000000-0000-0000-0000-000000000000'"}]::uuid[])`)
  console.log(`\n${who}:`)
  for (const b of buois) { const seen=new Set(); const tasks=[]; for (const v of ['gv','tg']) if (roles[b.lop_id]?.has(v)) for (const [tab,lbl] of TBV[v]) if(!seen.has(tab)){seen.add(tab);tasks.push(lbl)} ; console.log(`  ${b.ten_lop}: ${tasks.join(' · ')}`) }
}
await c.end()
