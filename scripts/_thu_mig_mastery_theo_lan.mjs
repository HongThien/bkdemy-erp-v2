// Thử mig 202611101427_mastery_theo_lan TRONG TRANSACTION rồi ROLLBACK — không để lại gì trên DB.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const time = async (lbl, s, p) => { const t = Date.now(); const r = await q(s, p); console.log(`${lbl}: ${Date.now() - t} ms`); return r }
const HS = `array(select distinct h.id from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id=h.id and hl.trang_thai='dang_hoc'
  join lop l on l.id=hl.lop_id and l.mon='Toán' and l.trang_thai='dang_hoc' where h.trang_thai='dang_hoc')`
try {
  await c.query('begin'); await c.query("set local statement_timeout='10min'")
  await c.query(`create temp table _truoc as select * from fn_mastery_cells_bdm(${HS}, true)`)
  await c.query(`create temp table _truoc_a as select * from fn_mastery_cells_moi(${HS})`)
  console.log('trước mig:', (await q('select count(*) n from _truoc'))[0].n, 'ô (B)')
  await c.query(fs.readFileSync('supabase/migrations/202611101427_mastery_theo_lan.sql', 'utf8'))
  console.log('mig chạy được trong txn. công tắc:', (await q('select _mastery_theo_lan_bat() b'))[0].b)
  // TẮT: phải giống hệt
  const tat = await time('TẮT · fn_mastery_cells_bdm B', `select * from fn_mastery_cells_bdm(${HS}, true)`)
  const kt = (await q(`with s as (select * from fn_mastery_cells_bdm(${HS}, true))
    select (select count(*) from _truoc) a, (select count(*) from s) b,
      (select count(*) from (select * from _truoc except select * from s) x) lech1, (select count(*) from (select * from s except select * from _truoc) x) lech2`))[0]
  console.log('TẮT · B so với trước mig:', kt)
  const kta = (await q(`with s as (select * from fn_mastery_cells_moi(${HS}))
    select (select count(*) from (select * from _truoc_a except select * from s) x) lech1, (select count(*) from (select * from s except select * from _truoc_a) x) lech2`))[0]
  console.log('TẮT · A (mặc định) lệch:', kta)
  await time('tham chiếu · trước mig B (đọc lại bảng tạm)', 'select 1')
  // BẬT
  await c.query(`update he_thong_cong_tac set bat = true where ma = 'mastery_theo_lan'`)
  const b = await time('BẬT · fn_mastery_cells_bdm B', `select * from fn_mastery_cells_bdm(${HS}, true)`)
  console.log('BẬT · dạng B: ô', b.length, '· yếu', b.filter((x) => x.muc === 'yeu').length, '(script so: 2412)')
  const a = await time('BẬT · fn_mastery_cells_moi A', `select * from fn_mastery_cells_moi(${HS})`)
  console.log('BẬT · dạng A: yếu', a.filter((x) => x.muc === 'yeu').length, '(script so: 2611)')
  const nb = await time('fn_mastery_nhom B', `select * from fn_mastery_nhom(${HS}, true)`)
  console.log('nhóm B: ô', nb.length, '· yếu', nb.filter((x) => x.muc === 'yeu').length, '(script so: 9193 ô · 875 yếu)')
  const na = await q(`select * from fn_mastery_nhom(${HS})`)
  console.log('nhóm A: yếu', na.filter((x) => x.muc === 'yeu').length, '(script so: 1007)')
  // các hàm phía sau vẫn chạy khi bật (mẫu)
  for (const s of [
    `select count(*) from fn_btyeu_dang_yeu_2_cua_so_moi((select id from hoc_sinh where trang_thai='dang_hoc' and khoi='9' limit 1), 'Toán')`,
    `select count(*) from _dang_yeu_tai_lo(${HS}, 'Toán', null)`,
  ]) { try { await time('  chạy ' + s.slice(21, 60), s) } catch (e) { console.log('  LỖI', s.slice(21, 60), e.message) } }
  console.log('quyền authenticated:', (await q(`select has_function_privilege('authenticated','fn_mastery_nhom(uuid[],boolean,timestamptz,integer,integer,integer,timestamptz)','execute') a,
    has_function_privilege('anon','fn_mastery_nhom(uuid[],boolean,timestamptz,integer,integer,integer,timestamptz)','execute') anon,
    has_function_privilege('authenticated','_mastery_cells_cau(boolean,uuid[],boolean,timestamptz,integer,integer,integer,timestamptz)','execute') cau`))[0])
} catch (e) { console.log('LỖI:', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong') }
