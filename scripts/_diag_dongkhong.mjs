// Tách nguyên nhân "buổi bù đóng đủ 2 mốc mà không có dòng chấm nào".
// Câu hỏi: bao nhiêu là KHÔNG CÓ GÌ ĐỂ CHẤM (buổi mẹ không có ET ⇒ bình thường)
// vs bao nhiêu là CÓ ĐỀ MÀ KHÔNG CHẤM (bấm cho xong ⇒ vấn đề thật).
// CHỈ SELECT.
import { readFileSync } from 'node:fs'
import pg from 'pg'
const env = readFileSync('.env', 'utf8')
const c = new pg.Client({ connectionString: env.match(/^\s*DATABASE_URL\s*=\s*(.+?)\s*$/m)[1].replace(/^["']|["']$/g, '') })
await c.connect()
const p = async (t, s) => {
  const r = await c.query(s)
  console.log(`\n▸ ${t}`)
  if (!r.rows.length) console.log('   (0 dòng)')
  else console.table(r.rows.slice(0, 15))
}

const BASE = `
  with bu as (
    select b.id, b.ngay, b.et_dong_at, b.danh_gia_xong_at
    from buoi_hoc b where b.loai='bu' and b.trang_thai<>'huy'
      and b.et_dong_at is not null and b.danh_gia_xong_at is not null
  ), comat as (
    select h.buoi_hoc_id, count(*) n from buoi_hoc_hs h
    join bu on bu.id=h.buoi_hoc_id where h.diem_danh='co_mat' group by 1
  ), cham as (   -- có ít nhất 1 dòng chấm ET hoặc đánh giá dạng
    select buoi_hoc_id from gami_grades where buoi_hoc_id in (select id from bu)
    union select buoi_hoc_id from buoi_danh_gia_dang where buoi_hoc_id in (select id from bu)
  ), code as (   -- buổi CÓ đề ET seed cho HS (ensureBuoiBuETProblems)
    select distinct buoi_hoc_id from gami_session_problems
    where phase='et' and buoi_hoc_id in (select id from bu)
  ), nx as (     -- có nhận xét chữ
    select distinct buoi_hoc_id from buoi_danh_gia
    where coalesce(btrim(nhan_xet),'')<>'' and buoi_hoc_id in (select id from bu)
  ), khong as (  -- ĐÓNG KHỐNG: có HS có mặt mà 0 dòng chấm
    select bu.*, comat.n as so_co_mat,
           (code.buoi_hoc_id is not null) as co_de_et,
           (nx.buoi_hoc_id is not null)  as co_nhan_xet
    from bu join comat on comat.buoi_hoc_id=bu.id
    left join cham on cham.buoi_hoc_id=bu.id
    left join code on code.buoi_hoc_id=bu.id
    left join nx   on nx.buoi_hoc_id=bu.id
    where cham.buoi_hoc_id is null
  )`

await p('Tổng buổi bù đã đóng đủ 2 mốc', `select count(*) as da_dong from buoi_hoc where loai='bu' and trang_thai<>'huy' and et_dong_at is not null and danh_gia_xong_at is not null`)

await p('⭐ ĐÓNG KHỐNG — tách theo CÓ ĐỀ ET hay KHÔNG', `${BASE}
  select case when co_de_et then 'CÓ đề ET mà không chấm  ⇒ VẤN ĐỀ'
              else 'KHÔNG có đề ET (buổi mẹ chưa soạn) ⇒ bình thường' end as loai,
         count(*) as so_buoi, sum(so_co_mat) as so_luot_hs,
         count(*) filter (where co_nhan_xet) as co_nhan_xet_chu,
         min(ngay) as cu_nhat, max(ngay) as moi_nhat
  from khong group by 1 order by 2 desc`)

await p('Nhóm VẤN ĐỀ — liệt kê (có đề mà 0 dòng chấm)', `${BASE}
  select k.ngay, k.so_co_mat, k.co_nhan_xet,
         (select count(*) from gami_session_problems p where p.buoi_hoc_id=k.id and p.phase='et') as so_de
  from khong k where k.co_de_et order by k.ngay desc`)

await p('Đối chiếu: buổi bù đã đóng mà CÓ chấm (nhóm khoẻ)', `
  with bu as (select id from buoi_hoc where loai='bu' and trang_thai<>'huy' and et_dong_at is not null and danh_gia_xong_at is not null)
  select count(distinct buoi_hoc_id) as co_cham from gami_grades where buoi_hoc_id in (select id from bu)`)

await c.end()
