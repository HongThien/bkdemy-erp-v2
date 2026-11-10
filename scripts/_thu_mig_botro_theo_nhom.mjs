// Thử mig 202611101521_botro_yeu_theo_nhom TRONG TRANSACTION rồi ROLLBACK.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const time = async (lbl, s, p) => { const t = Date.now(); const r = await q(s, p); console.log(`${lbl}: ${Date.now() - t} ms`); return r }
const hsMon = (mon) => `array(select distinct h.id from hoc_sinh h join hoc_sinh_lop hl on hl.hoc_sinh_id=h.id and hl.trang_thai='dang_hoc'
  join lop l on l.id=hl.lop_id and l.mon='${mon}' and l.trang_thai='dang_hoc' where h.trang_thai='dang_hoc')`
try {
  await c.query('begin'); await c.query("set local statement_timeout='10min'")
  await c.query(`create temp table _m_truoc as select * from fn_mastery_cells_bdm(${hsMon('Toán')}, true)`)
  await time('CŨ · _dang_yeu_tai_lo cả Toán', `create temp table _cu as select * from _dang_yeu_tai_lo(${hsMon('Toán')}, 'Toán', null)`)   // luật DẠNG (trước mig: công tắc bật nhưng hàm cũ)
  await c.query(fs.readFileSync('supabase/migrations/202611101521_botro_yeu_theo_nhom.sql', 'utf8'))
  console.log('mig chạy được trong txn')
  console.log('mastery dạng sau khi đổi _mastery_lan_core:', (await q(`with s as (select * from fn_mastery_cells_bdm(${hsMon('Toán')}, true))
    select (select count(*) from (select * from _m_truoc except select * from s) x) l1, (select count(*) from (select * from s except select * from _m_truoc) x) l2`))[0])

  await time('MỚI · _dang_yeu_tai_lo cả Toán', `create temp table _moi as select * from _dang_yeu_tai_lo(${hsMon('Toán')}, 'Toán', null)`)
  console.log('cũ (dạng yếu):', (await q(`select count(*) dang, count(distinct hoc_sinh_id) hs from _cu`))[0])
  console.log('mới (dạng thuộc nhóm yếu):', (await q(`select count(*) dang, count(distinct hoc_sinh_id) hs from _moi`))[0])
  console.log('mới · số nhóm yếu:', (await q(`select count(distinct (hoc_sinh_id, nhom_id)) nhom, count(*) filter (where nhom_id is null) dang_khong_nhom
    from _btyeu_dang_theo_nhom(${hsMon('Toán')}, 'Toán', null, _btyeu_moc_2_cua_so(), null)`))[0])
  console.log('HS ở cả hai:', (await q(`select count(*) n from (select distinct hoc_sinh_id from _cu intersect select distinct hoc_sinh_id from _moi) x`))[0].n)
  // mẫu 1 em
  const em = (await q(`select hoc_sinh_id from _moi group by 1 order by count(*) desc limit 1 offset 20`))[0].hoc_sinh_id
  console.log('mẫu 1 em:', (await q(`select h.ho_ten, d.ma_dang, d.ten_dang, round(d.score,2) s, d.n, d.nhom_id, round(d.nhom_score,2) ns
     from _btyeu_dang_theo_nhom(array[$1]::uuid[], 'Toán', null, _btyeu_moc_2_cua_so(), null) d join hoc_sinh h on h.id=d.hoc_sinh_id`, [em])).map((x) => `${x.nhom_id} ${x.ns} | ${x.ma_dang} ${x.s} n${x.n} ${x.ten_dang}`).join('\n  '))
  // chốt tuần: lô 10 em, mốc thứ Hai này (trần 8 s/câu lệnh khi app gọi)
  await time('Chốt tuần · lô 10 em mốc T2', `select count(*) from _dang_yeu_tai_lo((${hsMon('Toán')})[1:10], 'Toán', date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh')`)
  await time('1 em · _btyeu_dang_theo_nhom', `select count(*) from _btyeu_dang_theo_nhom(array[$1]::uuid[], 'Toán', null, _btyeu_moc_2_cua_so(), null)`, [em])
  for (const mon of ['KHTN', 'Anh']) {
    try { const r = await time(`${mon} · _dang_yeu_tai_lo`, `select count(*) n, count(distinct hoc_sinh_id) hs from _dang_yeu_tai_lo(${hsMon(mon)}, '${mon}', null)`); console.log('  ', r[0]) } catch (e) { console.log('LỖI', mon, e.message) }
  }
  await c.query(`update he_thong_cong_tac set bat=false where ma='mastery_theo_lan'`)
  const tat = (await q(`select count(*) n from (select * from _dang_yeu_tai_lo(${hsMon('Toán')}, 'Toán', null) except select * from _cu) x`))[0]
  console.log('TẮT công tắc ⇒ khác luật dạng cũ (mastery theo câu nên khác _cu là bình thường):', tat.n)
} catch (e) { console.log('LỖI:', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK xong') }
