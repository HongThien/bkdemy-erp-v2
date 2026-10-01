// Chạy thử mig 202610011207 trong transaction rồi ROLLBACK — không ghi gì.
import pg from 'pg'; import fs from 'node:fs'; process.loadEnvFile('.env');
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
const q = async (s, p) => (await c.query(s, p)).rows;
const evalsToan = async (ma) => {
  const [{ id }] = await q(`select tk.id from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.ma_hs=$1`, [ma]);
  await q(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: id })]);
  return (await q(`select jsonb_array_length(hs_dang_evals('Toán')) n`))[0].n
}
await c.query('begin');
try {
  const truoc = { hs0645: await evalsToan('HS0645'), hs0546: await evalsToan('HS0546') }
  await c.query(fs.readFileSync('supabase/migrations/202610011207_sua_nhan_mon_tu_luyen_ve_toan.sql', 'utf8'));
  console.log('evals Toán trước', truoc, 'sau', { hs0645: await evalsToan('HS0645'), hs0546: await evalsToan('HS0546') });
  console.table(await q(`select bang, cot, count(*) from log_sua_nhan_mon_2026_10_01 group by 1,2 order by 1,2`));
  console.table(await q(`select mon, count(*) from bai_test where loai='tu_luyen' group by 1`));
  console.log('tu_luyen_dang_lan mon:', await q(`select mon, count(*) from tu_luyen_dang_lan group by 1 order by 1`));
  console.log('trùng lan_thu (em×dạng×lần có >1 bài):', await q(`select count(*) from (select 1 from tu_luyen_dang_lan where mon='Toán' group by hoc_sinh_id, ma_dang, lan_thu having count(distinct bai_test_id) > 1) x`));
  console.log('lớp mới:', await q(`select h.ma_hs, l.ten_lop, l.mon, count(*) from bai_test bt join hoc_sinh h on h.id=bt.hoc_sinh_id join lop l on l.id=bt.lop_id
     where bt.id in (select id from log_sua_nhan_mon_2026_10_01 where bang='bai_test') group by 1,2,3 order by 1,2`));
  console.log('may_man:', await q(`select mon, count(*) from may_man_hs_luot where id in (select id from log_sua_nhan_mon_2026_10_01 where bang='may_man_hs_luot') group by 1`));
} finally { await c.query('rollback'); await c.end() }
