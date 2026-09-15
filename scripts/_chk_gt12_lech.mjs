import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n')
  .map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean)
  .map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL })
await c.connect()
const tests = await c.query(`select bt.id, bt.ngay::date::text as ngay, bt.so_cau, bt.nguon_tai_lieu_id, bt.created_at, l.ten_lop,
   tl.id as tl_id, tl.loai as tl_loai, tl.ten as tl_ten, tl.updated_at as tl_upd
  from bai_test bt join lop l on l.id=bt.lop_id left join tai_lieu tl on tl.id=bt.nguon_tai_lieu_id
  where l.ten_lop='12B1' and bt.loai='giao_trinh' order by bt.ngay desc, bt.created_at`)
for (const t of tests.rows) {
  console.log(`\n${t.ten_lop} ${t.ngay} test=${t.id.slice(0,8)} so_cau=${t.so_cau} created=${t.created_at.toISOString()} nguon=${t.nguon_tai_lieu_id?.slice(0,8)} tl=${t.tl_id ? `${t.tl_loai} "${t.tl_ten}" upd=${t.tl_upd?.toISOString()}` : 'KHÔNG CÒN tai_lieu'}`)
  if (!t.tl_id) continue
  const phans = await c.query(`select p.thu_tu, p.loai_phan, p.ref_ma, count(c.id) as n from tai_lieu_phan p left join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=$1 group by p.id order by p.thu_tu`, [t.tl_id])
  console.log('  phan:', phans.rows.map(p=>`${p.thu_tu}:${p.loai_phan}/${p.ref_ma}(${p.n})`).join(' | '))
  const src = await c.query(`select c.ma_cau from tai_lieu_phan p join tai_lieu_cau c on c.phan_id=p.id where p.tai_lieu_id=$1 and p.loai_phan='dang' order by p.thu_tu, c.thu_tu`, [t.tl_id])
  const snap = await c.query(`select ma_cau, loai_cau from bai_test_cau where bai_test_id=$1 order by thu_tu`, [t.id])
  const S = new Set(snap.rows.map(r=>r.ma_cau))
  const missing = src.rows.map(r=>r.ma_cau).filter(m=>!S.has(m))
  if (missing.length) {
    const kho = await c.query(`select ma_cau, loai_cau, dap_an is not null and dap_an<>'' as co_dap_an from dai_cau_hoi where ma_cau = any($1)`, [missing])
    console.log('  câu nguồn KHÔNG có trong test:', kho.rows.map(r=>`${r.ma_cau}[${r.loai_cau}${r.co_dap_an?'':' ko đáp án'}]`).join(', '))
  }
}
// cột tai_lieu có xoa_at?
await c.end()
