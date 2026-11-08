// Chạy thử mig 202610262053 (4T sang bản đồ mới) TRONG ROLLBACK: HS 4T1 ra NDB, 4A1 + 9A1 y hệt, đo thời gian.
import pg from 'pg'
import fs from 'node:fs'
const url = fs.readFileSync('.env', 'utf8').match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '')
const c = new pg.Client({ connectionString: url }); await c.connect()
const q = async (s, a) => (await c.query(s, a)).rows
const lop = async (t) => (await q(`select array_agg(hoc_sinh_id) a from hoc_sinh_lop hl join lop l on l.id = hl.lop_id where l.ten_lop = $1 and l.mon = 'Toán' and hl.trang_thai = 'dang_hoc'`, [t]))[0].a
try {
  await q('begin'); await q('set local statement_timeout = 0')
  const [l4t, l4, l9] = [await lop('4T1'), await lop('4A1'), await lop('9A1')]
  const cells = async (hs) => JSON.stringify(await q(`select hoc_sinh_id, ma_dang, round(score, 4) s, n from fn_mastery_cells_moi($1, true) order by 1, 2`, [hs]))
  const truoc = { a4: await cells(l4), a9: await cells(l9) }
  const t4 = await q(`select count(*)::int o, count(*) filter (where ma_dang like 'NDB%')::int ndb from fn_mastery_cells_moi($1, true)`, [l4t])
  await q(fs.readFileSync('supabase/migrations/202610262053_bdm_4t_sang_ban_do_moi.sql', 'utf8'))
  console.log('4A1 y hệt:', truoc.a4 === await cells(l4), '· 9A1 y hệt:', truoc.a9 === await cells(l9))
  const s4 = await q(`select count(*)::int o, count(*) filter (where ma_dang like 'NDB%')::int ndb from fn_mastery_cells_moi($1, true)`, [l4t])
  console.log('4T1 ô mastery trước', t4[0], '→ sau', s4[0])
  const [tk] = await q(`select tk.id from tai_khoan tk where tk.hoc_sinh_id = $1`, [l4t[0]])
  await q("select set_config('request.jwt.claims', $1, true)", [JSON.stringify({ sub: tk.id, role: 'authenticated' })])
  for (const [ten, sql] of [['phieu_luu', `select fn_ban_do_phieu_luu('Toán') x`], ['ds_dang', `select tu_luyen_chu_de_ds_dang('Toán') x`], ['ren_yeu', `select fn_tu_luyen_sinh_tu_dong('Toán') x`], ['hoc_tap', `select hs_dang_hoc_tap('Toán') x`], ['so_tay', `select hs_sotay_cay_hs('Toán', null) x`]]) {
    const t = Date.now(); try { await q('savepoint s'); const x = JSON.stringify((await q(sql))[0].x); console.log(`  ${ten.padEnd(10)} ${String(Date.now() - t).padStart(5)}ms NDB=${(x.match(/NDB\d+/g) || []).length} cũ=${(x.match(/"T14T\d+"/g) || []).length} tổng hiệu=${(x.match(/[Tt]ổng hiệu/g) || []).length}`) } catch (e) { await q('rollback to savepoint s'); console.log('  ', ten, 'LỖI', e.message) }
  }
  const ds = (await q(`select tu_luyen_chu_de_ds_dang('Toán') x`))[0].x
  console.log('  DS tự luyện Tổng hiệu:', ds.filter((d) => /tổng hiệu|cho nhận|tăng giảm|tuổi/i.test(d.ten_dang)).map((d) => `${d.ten_dang} (${d.tong_cau})`).join(' · '))
} catch (e) { console.log('LỖI', e.message) } finally { await q('rollback'); await c.end() }
