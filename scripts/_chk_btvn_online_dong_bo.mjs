import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = Object.fromEntries(readFileSync('.env', 'utf8').split('\n').map((l) => l.match(/^\s*([A-Z_]+)\s*=\s*(.+?)\s*$/)).filter(Boolean).map((m) => [m[1], m[2].replace(/^["']|["']$/g, '')]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
for (const [lop, ngay] of [['12A1', '2026-09-03'], ['10A1', '2026-09-03']]) {
  const b = (await c.query(`select b.id from buoi_hoc b join lop l on l.id=b.lop_id where l.ten_lop=$1 and b.ngay=$2 and b.trang_thai<>'huy'`, [lop, ngay])).rows[0]
  console.log(`\n=== ${lop} ${ngay} buổi=${b?.id?.slice(0,8)}`)
  const r1 = (await c.query(`select fn_btvn_online_dong_bo($1) kq`, [b.id])).rows[0].kq
  const r2 = (await c.query(`select fn_btvn_online_dong_bo($1) kq`, [b.id])).rows[0].kq
  console.log('lần 1:', JSON.stringify(r1), '\nlần 2:', JSON.stringify(r2))
  console.table((await c.query(`
    select hs.ma_hs, string_agg(case g.result when 'correct' then 'Đ' when 'partial' then 'C' else 'S' end, '' order by p.problem_no) luoi,
      count(*) filter (where g.bai_lam_cau_id is not null) tu_online, count(*) n,
      (select trang_thai_nop from btvn_ket_qua k where k.buoi_hoc_id=$1 and k.hoc_sinh_id=hs.id) nop
    from gami_grades g join gami_session_problems p on p.id=g.problem_id join hoc_sinh hs on hs.id=g.hoc_sinh_id
    where g.buoi_hoc_id=$1 and p.phase='btvn' group by hs.id, hs.ma_hs order by hs.ma_hs`, [b.id])).rows)
  console.table((await c.query(`
    select hs.ma_hs, bl.trang_thai, string_agg(case blc.verdict when 'correct' then 'Đ' when 'partial' then 'C' else 'S' end, '' order by bc.thu_tu) online
    from bai_lam bl join bai_test bt on bt.id=bl.bai_test_id join hoc_sinh hs on hs.id=bl.hoc_sinh_id
    join bai_lam_cau blc on blc.bai_lam_id=bl.id join bai_test_cau bc on bc.id=blc.bai_test_cau_id
    where bt.loai='btvn' and bt.lop_id=(select lop_id from buoi_hoc where id=$1) and bt.ngay=$2 and blc.verdict is not null group by hs.ma_hs, bl.trang_thai order by hs.ma_hs`, [b.id, ngay])).rows)
}
await c.end()
