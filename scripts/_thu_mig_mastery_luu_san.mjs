// Thử mig 202611101644_mastery_luu_san trong TRANSACTION rồi ROLLBACK. Nhẹ (hộp thời gian nhỏ) — chạy được cả giờ cao điểm.
import pg from 'pg'; import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#')).map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const time = async (lbl, s, p) => { const t = Date.now(); const r = await q(s, p); console.log(`${lbl}: ${Date.now() - t} ms`); return r }
const giay = Number(process.argv[2] ?? 8)
try {
  await c.query('begin'); await c.query("set local statement_timeout='5min'")
  const uid = (await q(`select updated_by u from he_thong_cong_tac where ma='mastery_ban_do_moi'`))[0].u
  await c.query(`select set_config('request.jwt.claims',$1,true)`, [JSON.stringify({ sub: uid, role: 'authenticated' })])
  const lop = (await q(`select l.ten_lop, array_agg(hl.hoc_sinh_id order by hl.hoc_sinh_id) hs from lop l join hoc_sinh_lop hl on hl.lop_id=l.id and hl.trang_thai='dang_hoc'
    where l.mon='Toán' and l.trang_thai='dang_hoc' and l.khoi='9' group by 1 order by count(*) desc limit 1`))[0]
  await c.query(`create temp table _truoc as select * from fn_mastery_cells_moi($1)`, [lop.hs])
  await c.query(`create temp table _truoc_b as select * from fn_mastery_cells_bdm($1, true)`, [lop.hs])
  await c.query(`create temp table _truoc_n as select * from fn_mastery_nhom($1)`, [lop.hs])
  await time('TRƯỚC · fn_mastery_cells_moi lớp ' + lop.ten_lop, `select count(*) from fn_mastery_cells_moi($1)`, [lop.hs])
  await c.query(fs.readFileSync('supabase/migrations/202611101644_mastery_luu_san.sql', 'utf8'))
  console.log('mig chạy được trong txn')
  // chụp riêng lớp mẫu: đánh bẩn lớp rồi làm mới (bẩn được ưu tiên trước em chưa chụp)
  await q(`select _mastery_danh_dau_ban($1)`, [lop.hs])
  const con = await time(`fn_mastery_lam_moi(${giay}s)`, `select fn_mastery_lam_moi($1) n`, [giay])
  console.log('  còn chờ:', con[0].n, '· đã chụp:', (await q(`select count(*) n from mastery_luu_san_tinh`))[0].n, 'em ·', (await q(`select count(*) n from mastery_luu_san`))[0].n, 'ô')
  console.log('  lớp mẫu sạch:', (await q(`select cardinality(_mastery_hs_sach($1)) n`, [lop.hs]))[0].n, '/', lop.hs.length)
  await time('SAU · fn_mastery_cells_moi lớp (đọc bản chụp)', `select count(*) from fn_mastery_cells_moi($1)`, [lop.hs])
  const so = async (bang, sql) => (await q(`with s as (${sql}) select (select count(*) from (select * from ${bang} except select * from s) a) l1, (select count(*) from (select * from s except select * from ${bang}) b) l2`, [lop.hs]))[0]
  console.log('  khớp trước (A):', await so('_truoc', 'select * from fn_mastery_cells_moi($1)'))
  console.log('  khớp trước (B):', await so('_truoc_b', 'select * from fn_mastery_cells_bdm($1, true)'))
  console.log('  khớp trước (nhóm):', await so('_truoc_n', 'select * from fn_mastery_nhom($1)'))
  console.log('  đối chiếu ngẫu nhiên:', JSON.stringify((await q(`select fn_mastery_doi_chieu(10) j`))[0].j).slice(0, 300))
  // đánh bẩn bằng trigger: sửa giả 1 dòng chấm của em đầu lớp (update không đổi giá trị)
  const g = (await q(`select g.problem_id, g.hoc_sinh_id from gami_grades g where g.hoc_sinh_id = any($1) limit 1`, [lop.hs]))[0]
  await q(`update gami_grades set result = result where problem_id=$1 and hoc_sinh_id=$2`, [g.problem_id, g.hoc_sinh_id])
  console.log('  sau update gami_grades: em bị bẩn?', (await q(`select exists(select 1 from mastery_ban where hoc_sinh_id=$1) b`, [g.hoc_sinh_id]))[0].b,
    '· sạch còn', (await q(`select cardinality(_mastery_hs_sach($1)) n`, [lop.hs]))[0].n)
  await time('  đọc lại lớp (1 em tính trực tiếp)', `select count(*) from fn_mastery_cells_moi($1)`, [lop.hs])
  console.log('  vẫn khớp (A):', await so('_truoc', 'select * from fn_mastery_cells_moi($1)'))
  // gán dạng câu: đánh bẩn những em từng làm câu đó
  const cau = (await q(`select ma_cau from dai_bdm_gan_cau limit 1`))[0].ma_cau
  await time('  update dai_bdm_gan_cau 1 dòng (trigger dò HS)', `update dai_bdm_gan_cau set ma_cau = ma_cau where ma_cau = $1`, [cau])
  // chấm 1 lớp kiểu thật: update 200 dòng gami_grades một câu lệnh — đo thời gian trigger thêm vào
  await time('  update 200 dòng gami_grades (1 câu lệnh)', `update gami_grades set result = result where ctid in (select ctid from gami_grades limit 200)`)
  // bổ trợ đọc qua bản nhanh
  await time('  _dang_yeu_tai_lo lớp (đọc bản chụp)', `select count(*) from _dang_yeu_tai_lo($1,'Toán',null)`, [lop.hs])
} catch (e) { console.log('LỖI', e.message) } finally { await c.query('rollback'); await c.end(); console.log('ROLLBACK') }
