// Chạy thử mig 202610011120 trong 1 transaction rồi ROLLBACK — không ghi gì vào DB.
import pg from 'pg'; import fs from 'node:fs'; process.loadEnvFile('.env');
const c = new pg.Client({ connectionString: process.env.DATABASE_URL }); await c.connect();
const sql = fs.readFileSync('supabase/migrations/202610011120_hs_mon_hoc_chan_ro_mon.sql', 'utf8');
const ma = process.argv[2] ?? 'HS0557';
await c.query('begin');
try {
  await c.query(sql);
  const [{ id: uid }] = (await c.query(`select tk.id from tai_khoan tk join hoc_sinh h on h.id=tk.hoc_sinh_id where h.ma_hs=$1`, [ma])).rows;
  await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })]);
  const q = async (s, p = []) => { await c.query('savepoint s'); try { return (await c.query(s, p)).rows } catch (e) { return 'LỖI: ' + e.message } finally { await c.query('rollback to savepoint s') } };
  console.log('hs_mon_hoc_cua_toi', await q('select * from hs_mon_hoc_cua_toi()'));
  for (const mon of ['Toán', 'KHTN', 'Tiếng Anh', 'Văn']) {
    const n = (r) => Array.isArray(r) ? (r[0]?.x !== undefined ? (Array.isArray(r[0].x) ? r[0].x.length + ' mục' : JSON.stringify(r[0].x).slice(0, 90)) : r.length + ' dòng') : r
    console.log(`\n== ${mon}`)
    console.log('  hs_dang_evals          ', n(await q('select hs_dang_evals($1) x', [mon])))
    console.log('  tu_luyen_chu_de_ds_dang', n(await q('select tu_luyen_chu_de_ds_dang($1) x', [mon])))
    console.log('  htd_lo_trinh           ', n(await q('select htd_lo_trinh($1) x', [mon])))
    console.log('  lich_su(30, mon)       ', n(await q('select * from fn_hs_lich_su_lam_bai(30, $1)', [mon])))
    console.log('  xep_hang_tu_luyen(9,mon)', n(await q(`select hs_xep_hang_tu_luyen('9', $1) x`, [mon])))
    console.log('  tu_luyen_sinh          ', n(await q(`select tu_luyen_sinh($1, '["X"]'::jsonb) x`, [mon])))
    console.log('  thu_thach_sinh         ', n(await q(`select thu_thach_sinh($1, '["X"]'::jsonb) x`, [mon])))
  }
  console.log('\nbản cũ còn chạy: lich_su(30)', (await q('select count(*) from fn_hs_lich_su_lam_bai(30)'))[0], ' xep_hang(9)', (await q(`select jsonb_array_length(hs_xep_hang_tu_luyen('9')) n`))[0])
  console.log('ACL', (await q(`select p.oid::regprocedure::text f, p.proacl::text from pg_proc p where p.proname in ('hs_mon_hoc_cua_toi','hs_xep_hang_tu_luyen','fn_hs_lich_su_lam_bai','_kho_co_mon','tu_luyen_sinh')`)))
} finally { await c.query('rollback'); await c.end() }
