import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL })
await c.connect()
const lops = await c.query(`select id, ten_lop, khoi from lop where khoi::text in ('12','L12') or ten_lop ilike '12%' order by ten_lop limit 50`)
console.log('LỚP 12:', lops.rows.map(r=>`${r.ten_lop}(${r.khoi})`).join(', '))
const tests = await c.query(`select bt.id, bt.loai, bt.ngay, bt.mon, bt.trang_thai, bt.so_cau, l.ten_lop, bt.created_at
  from bai_test bt join lop l on l.id=bt.lop_id
  where l.id = any($1) and bt.loai='giao_trinh' order by bt.ngay desc limit 20`, [lops.rows.map(r=>r.id)])
console.log('TEST giao_trinh lớp 12:', tests.rows.length)
for (const t of tests.rows) {
  const q = await c.query(`select thu_tu, ma_dang, ma_cau, loai_cau from bai_test_cau where bai_test_id=$1 and bien_the=1 order by thu_tu`, [t.id])
  const seq = q.rows.map(r=>r.ma_dang)
  const seen = new Set(); let last=null; const vipham=[]
  for (const [i,d] of seq.entries()) { if (d!==last) { if (seen.has(d)) vipham.push({thu_tu:i+1, ma_dang:d}); seen.add(d); last=d } }
  const chum = []; for (const d of seq) { if (chum.length && chum[chum.length-1].d===d) chum[chum.length-1].n++; else chum.push({d,n:1}) }
  console.log(`\n${t.ten_lop} ${t.ngay} ${t.mon} tt=${t.trang_thai} so_cau=${t.so_cau} rows=${q.rows.length}`)
  console.log('  chùm:', chum.map(x=>`${x.d}×${x.n}`).join(' | '))
  console.log('  ', vipham.length ? '❌ DẠNG BỊ TÁCH: '+JSON.stringify(vipham) : '✅ mỗi dạng 1 chùm liên tục')
  const src = await c.query(`select p.thu_tu as p_tt, p.loai_phan, p.ref_ma, c.thu_tu as c_tt, c.ma_cau
    from bai_test bt join tai_lieu_phan p on p.tai_lieu_id=bt.nguon_tai_lieu_id
    join tai_lieu_cau c on c.phan_id=p.id where bt.id=$1 and p.loai_phan='dang' order by p.thu_tu, c.thu_tu`, [t.id])
  const a = src.rows.map(r=>r.ma_cau).join(','), b = q.rows.map(r=>r.ma_cau).join(',')
  console.log('  ', a===b ? '✅ thứ tự câu KHỚP doc nguồn' : `⚠ LỆCH doc nguồn (nguồn ${src.rows.length} câu / test ${q.rows.length})`)
}
await c.end()
