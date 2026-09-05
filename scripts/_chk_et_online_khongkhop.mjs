import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
console.table((await c.query(`
select hs.ma_hs, bl.bien_the as hs_bien_the, bc.thu_tu, bc.bien_the as cau_bien_the, bc.ma_cau, bc.ma_dang, blc.verdict,
  exists(select 1 from gami_session_problems p where p.buoi_hoc_id='bd2cf652-0627-407a-bdb1-7bd674cb7b5c' and p.phase='et' and p.ma_cau=bc.ma_cau) as co_o,
  (select ma_cau from bai_test_cau b2 where b2.bai_test_id=bc.bai_test_id and b2.thu_tu=bc.thu_tu and b2.bien_the=1) as ma_cau_goc
from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join hoc_sinh hs on hs.id=bl.hoc_sinh_id
join bai_lam_cau blc on blc.bai_lam_id=bl.id join bai_test_cau bc on bc.id=blc.bai_test_cau_id
where bt.loai='et' and bt.ngay='2026-09-03' and bt.lop_id=(select lop_id from buoi_hoc where id='bd2cf652-0627-407a-bdb1-7bd674cb7b5c')
  and bl.trang_thai='da_nop' order by hs.ma_hs, bc.thu_tu`)).rows)
console.table((await c.query(`select problem_no, ma_cau, ma_dang from gami_session_problems where buoi_hoc_id='bd2cf652-0627-407a-bdb1-7bd674cb7b5c' and phase='et' order by problem_no`)).rows)
await c.end()
