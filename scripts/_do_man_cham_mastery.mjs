// ĐO: màn/hàm nào tốn thời gian vì tính mastery (Thùy 10/11 — tiền đề bảng mastery lưu sẵn). CHỈ ĐỌC: mỗi phép đo 1 transaction ROLLBACK.
// Chạy NGOÀI 17–22h. Xuất reports/_do-man-cham-mastery.json → node scripts/_html_do_man_cham_mastery.mjs
import pg from 'pg'
import fs from 'fs'
const env = Object.fromEntries(fs.readFileSync('.env', 'utf8').split(/\r?\n/).filter((l) => l.includes('=') && !l.startsWith('#'))
  .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]))
const c = new pg.Client({ connectionString: env.DATABASE_URL }); await c.connect()
const q = async (s, p) => (await c.query(s, p)).rows
const gioVN = (await q(`select extract(hour from now() at time zone 'Asia/Ho_Chi_Minh')::int h`))[0].h
if (gioVN >= 17 && gioVN < 22) { console.log('17–22h VN: không chạy (giờ HS chơi).'); process.exit(0) }

// bối cảnh: 1 lớp Toán khối 9 đang học, 1 HS có tài khoản app trong lớp, 1 nhân sự
const lop = (await q(`select l.id, l.ten_lop, l.khoi, array_agg(hl.hoc_sinh_id) hs from lop l join hoc_sinh_lop hl on hl.lop_id=l.id and hl.trang_thai='dang_hoc'
  where l.mon='Toán' and l.trang_thai='dang_hoc' and l.khoi='9' group by 1,2,3 order by count(*) desc limit 1`))[0]
const tkHS = (await q(`select t.id from tai_khoan t where t.hoc_sinh_id = any($1) limit 1`, [lop.hs]))[0]?.id
const tkNS = (await q(`select updated_by u from he_thong_cong_tac where ma='mastery_ban_do_moi'`))[0].u
const hs1 = lop.hs[0]
console.log(`lớp ${lop.ten_lop} · ${lop.hs.length} HS · tk HS ${tkHS ? 'có' : 'KHÔNG'}`)

const DO = [
  // [màn, mô tả, ai gọi, sql, params]
  ['Kết quả học tập 1 HS', 'mastery 1 em (fn_mastery_cells_moi)', 'ns', `select count(*) from fn_mastery_cells_moi(array[$1]::uuid[])`, [hs1]],
  ['Kết quả học tập cả lớp', `mastery ${lop.hs.length} em (fn_mastery_cells_moi)`, 'ns', `select count(*) from fn_mastery_cells_moi($1)`, [lop.hs]],
  ['Kết quả học tập cả lớp — Hình–Luyện', 'fn_mastery_cells_hinh', 'ns', `select count(*) from fn_mastery_cells_hinh($1, false, null)`, [lop.hs]],
  ['Mastery cấp nhóm cả lớp', 'fn_mastery_nhom', 'ns', `select count(*) from fn_mastery_nhom($1)`, [lop.hs]],
  ['App HS — Bản đồ phiêu lưu', 'fn_ban_do_phieu_luu', 'hs', `select count(*) from fn_ban_do_phieu_luu('Toán')`, []],
  ['App HS — Học tập theo dạng', 'hs_dang_hoc_tap', 'hs', `select count(*) from hs_dang_hoc_tap('Toán')`, []],
  ['App HS — Tự luyện chọn chủ đề', 'tu_luyen_chu_de_ds_dang', 'hs', `select count(*) from tu_luyen_chu_de_ds_dang('Toán')`, []],
  ['Dashboard học tập (khối 9, 4 tuần, chuyên đề)', 'fn_dbht_bang', 'ns', `select count(*) from (select fn_dbht_bang('Toán','9',4,'chuyen_de')) x`, []],
  ['Đánh giá cuối cấp (1 lớp, nhóm bài)', 'fn_dgcc_lop', 'ns', `select count(*) from fn_dgcc_lop($1,'nhom')`, [lop.id]],
  ['Bổ trợ nhẹ — danh sách lớp', 'fn_btnhe_lop_hs', 'ns', `select count(*) from fn_btnhe_lop_hs($1, (now() at time zone 'Asia/Ho_Chi_Minh')::date)`, [lop.id]],
  ['QLCL / mở case — dạng yếu 1 em', 'fn_btyeu_dang_yeu_2_cua_so_moi', 'ns', `select count(*) from fn_btyeu_dang_yeu_2_cua_so_moi($1,'Toán')`, [hs1]],
  ['Chốt tuần — 1 lô 10 em', '_dang_yeu_tai_lo (mốc T2)', 'ns', `select count(*) from _dang_yeu_tai_lo(($1::uuid[])[1:10],'Toán', date_trunc('week', now() at time zone 'Asia/Ho_Chi_Minh') at time zone 'Asia/Ho_Chi_Minh')`, [lop.hs]],
  ['Dashboard kết quả bổ trợ tuần', 'fn_botro_ket_qua_tuan (7 ngày)', 'ns', `select fn_botro_ket_qua_tuan(((now() at time zone 'Asia/Ho_Chi_Minh')::date - 7), (now() at time zone 'Asia/Ho_Chi_Minh')::date) is not null`, []],
  ['Thành tựu tháng (lớp)', 'fn_thanh_tuu_thang', 'ns', `select count(*) from (select fn_thanh_tuu_thang('Toán', to_char(now() at time zone 'Asia/Ho_Chi_Minh','YYYY-MM'), $1)) x`, [lop.hs]],
]

const ketQua = []
for (const [man, mo_ta, ai, sql, p] of DO) {
  const lan = []
  let loi = null
  for (let i = 0; i < 2; i++) {
    try {
      await c.query('begin'); await c.query("set local statement_timeout = '60s'")
      const sub = ai === 'hs' ? tkHS : tkNS
      if (ai === 'hs' && !tkHS) throw new Error('không có tài khoản HS')
      await c.query(`select set_config('request.jwt.claims', $1, true)`, [JSON.stringify({ sub, role: 'authenticated' })])
      const t = Date.now(); await c.query(sql, p); lan.push(Date.now() - t)
    } catch (e) { loi = e.message.slice(0, 120) } finally { await c.query('rollback') }
    if (loi) break
  }
  ketQua.push({ man, mo_ta, ai, lan, loi })
  console.log(`${man}: ${loi ? 'LỖI ' + loi : lan.join(' / ') + ' ms'}`)
}

// phần mastery thuần trong các màn (để so: bao nhiêu % thời gian là tính mastery)
// tần suất thay đổi: mỗi ngày bao nhiêu % HS có lần đo mới (⇒ tỉ lệ cache còn đúng sau 1 ngày)
const doi = await q(`with hs as (select distinct hl.hoc_sinh_id from hoc_sinh_lop hl join lop l on l.id=hl.lop_id and l.trang_thai='dang_hoc' where hl.trang_thai='dang_hoc'),
  ev as (
    select g.hoc_sinh_id, (g.graded_at at time zone 'Asia/Ho_Chi_Minh')::date d from gami_grades g where g.graded_at > now() - interval '15 days'
    union all select bl.hoc_sinh_id, (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date from bai_lam_cau blc join bai_lam bl on bl.id=blc.bai_lam_id where blc.cham_at > now() - interval '15 days'
    union all select tl.hoc_sinh_id, (b.graded_at at time zone 'Asia/Ho_Chi_Minh')::date from bt_grades b join tai_lieu tl on tl.id=b.tai_lieu_id where b.graded_at > now() - interval '15 days')
  select d::text, count(distinct ev.hoc_sinh_id)::int hs_doi, (select count(*) from hs)::int tong
  from ev join hs on hs.hoc_sinh_id = ev.hoc_sinh_id where d < (now() at time zone 'Asia/Ho_Chi_Minh')::date group by d order by d`)
console.log('HS có lần đo mới theo ngày:', doi.map((x) => `${x.d.slice(5)} ${x.hs_doi}/${x.tong}`).join(' · '))
// sửa dạng của câu (đo đi theo câu ⇒ đổi mastery của mọi em từng làm câu đó): mỗi ngày bao nhiêu câu đổi dạng
let doiDang = []
try {
  doiDang = await q(`select (coalesce(updated_at, created_at) at time zone 'Asia/Ho_Chi_Minh')::date::text d, count(*)::int n
    from dai_bdm_gan_cau where coalesce(updated_at, created_at) > now() - interval '15 days' group by 1 order by 1`)
} catch (e) { doiDang = [{ d: 'lỗi', n: e.message.slice(0, 80) }] }
console.log('câu gán dạng (dai_bdm_gan_cau) theo ngày:', doiDang.map((x) => `${x.d.slice(5)} ${x.n}`).join(' · '))
fs.writeFileSync('reports/_do-man-cham-mastery.json', JSON.stringify({ lop: { ten: lop.ten_lop, so_hs: lop.hs.length }, ketQua, doi, doiDang, luc: new Date().toISOString() }, null, 1))
await c.end()
