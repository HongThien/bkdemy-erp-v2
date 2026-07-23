// VERIFY cho module "Đánh giá kết quả học tập" (spec-danhgia-hoctap.md §8).
// CHỈ SELECT — chạy bằng DATABASE_URL(_RO) trong .env (role claude_ro, không ghi được).
// Chạy: node scripts/verify_danhgia_hoctap.mjs [> docs/verify-danhgia-hoctap.out.md]
//
// Trả lời 3 nhóm câu hỏi trước khi implement:
//   A. ENUM — chuỗi giá trị THẬT của các cột trạng thái/kết quả.
//   B. CONNECTIVITY — các join SỐNG CÒN có nối được không (day_at, ma_dang, chuyên đề).
//   C. CALIBRATE — base-rate thật để chọn ngưỡng (min-n k, sĩ số lớp, cỡ candidate).
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import pg from 'pg'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

function loadUrl() {
  let txt
  try { txt = readFileSync(join(root, '.env'), 'utf8') }
  catch { console.error('❌ .env không có.'); process.exit(1) }
  const m = txt.match(/^\s*DATABASE_URL(?:_RO)?\s*=\s*(.+?)\s*$/m)
  if (!m) { console.error('❌ Thiếu DATABASE_URL trong .env'); process.exit(1) }
  return m[1].replace(/^["']|["']$/g, '')
}

// Cửa sổ 14 ngày MỐC FIX (spec §0): ngày 1-15 = nửa đầu tháng, 16-cuối = nửa sau.
// Biểu diễn window key = 'YYYY-MM-A' | 'YYYY-MM-B' (giờ VN).
const WIN = `(to_char((%s at time zone 'Asia/Ho_Chi_Minh')::date, 'YYYY-MM')
              || case when extract(day from (%s at time zone 'Asia/Ho_Chi_Minh')::date) <= 15
                      then '-A' else '-B' end)`
const win = (col) => WIN.replaceAll('%s', col)

// Nguồn đo vào mastery (spec §9): et=2 · mt=3 · btvn=1 · ingame/bổ-trợ = KHÔNG vào.
const DCS = `case g.result when 'correct' then 1 when 'partial' then 0.5 when 'wrong' then 0 end`
const W = `case p.phase when 'mt' then 3 when 'et' then 2 when 'btvn' then 1 else 0 end`

// ⚠ KHÔNG gộp 2 bản đồ rồi join bằng ma_dang: 17 mã TRÙNG SỐ giữa dai_ban_do và
// khtn_ban_do (HANDOFF ②) → union all sẽ NHÂN ĐÔI dòng đo. Phải biết `mon` trước,
// rồi mới tra ĐÚNG 1 bảng (luật khoCuaMon(mon)).
//
// Môn của 1 lần đo = lop.mon của buổi. Buổi BÙ có lop_id NULL → lùi về buổi GỐC
// của chính HS đó (buoi_hoc_hs.bu_cho_buoi_id).
const MON = `coalesce(l.mon, (
    select lg.mon from buoi_hoc_hs bhs
    join buoi_hoc bg on bg.id = bhs.bu_cho_buoi_id
    join lop lg on lg.id = bg.lop_id
    where bhs.buoi_hoc_id = bh.id and bhs.hoc_sinh_id = g.hoc_sinh_id
    limit 1))`

const DO_LUONG = `
  select d.*,
         coalesce(da.ma_chuyen_de, kh.ma_chuyen_de)   as ma_chuyen_de,
         coalesce(da.ten_chuyen_de, kh.ten_chuyen_de) as ten_chuyen_de,
         coalesce(da.muc_do, kh.muc_do)               as muc_do
  from (
    select g.hoc_sinh_id,
           p.phase,
           p.ma_dang,
           ${MON} as mon,
           bh.lop_id,
           ${DCS} as v,
           ${W}   as w,
           g.graded_at,
           ${win('g.graded_at')} as cua_so
    from gami_grades g
    join gami_session_problems p on p.id = g.problem_id
    join buoi_hoc bh on bh.id = g.buoi_hoc_id
    left join lop l on l.id = bh.lop_id
    where p.phase in ('et','mt','btvn')
  ) d
  left join dai_ban_do  da on da.ma_dang = d.ma_dang and d.mon = 'Toán'
  left join khtn_ban_do kh on kh.ma_dang = d.ma_dang and d.mon = 'KHTN'`

const Q = [
  // ─────────────────────────── A. ENUM ───────────────────────────
  ['A1 · gami_grades.result', `
    select result, count(*) n from gami_grades group by 1 order by 2 desc`],

  ['A2 · gami_session_problems.phase × gắn dạng', `
    select p.phase, count(*) n,
           count(p.ma_dang) co_ma_dang,
           round(100.0*count(p.ma_dang)/nullif(count(*),0),1) pct_co_dang
    from gami_session_problems p group by 1 order by 2 desc`],

  ['A3 · btvn_ket_qua.thai_do (4 bậc?)', `
    select coalesce(thai_do,'∅ NULL') thai_do, count(*) n,
           round(100.0*count(*)/sum(count(*)) over (),1) pct
    from btvn_ket_qua group by 1 order by 2 desc`],

  ['A4 · btvn_ket_qua.trang_thai_nop', `
    select coalesce(trang_thai_nop,'∅ NULL') trang_thai_nop, count(*) n
    from btvn_ket_qua group by 1 order by 2 desc`],

  ['A5 · bo_tro_duoi.trang_thai × nguon', `
    select trang_thai, nguon, count(*) n from bo_tro_duoi group by 1,2 order by 3 desc`],

  ['A6 · canh_bao_yeu.nguon (③ chuông đỏ persist ở đây?)', `
    select nguon, count(*) n,
           count(ma_dang) co_dang, count(buoi_hoc_id) co_buoi, count(ghi_chu) co_ghichu,
           min(created_at)::date tu, max(created_at)::date den
    from canh_bao_yeu group by 1 order by 2 desc`],

  ['A7 · bai_test.loai × bai_lam_cau.verdict', `
    select t.loai, c.verdict, count(*) n
    from bai_lam_cau c
    join bai_lam bl on bl.id = c.bai_lam_id
    join bai_test t on t.id = bl.bai_test_id
    group by 1,2 order by 1,3 desc`],

  ['A8 · buoi_hoc_hs.diem_danh', `
    select coalesce(diem_danh,'∅ NULL') diem_danh, count(*) n from buoi_hoc_hs group by 1 order by 2 desc`],

  // ──────────────────── B. CONNECTIVITY (sống còn) ────────────────────
  ['B1 · bo_tro_duoi_dang.day_at CÓ POPULATE KHÔNG (neo outcome §5)', `
    select count(*) n_dong,
           count(day_at) co_day_at,
           round(100.0*count(day_at)/nullif(count(*),0),1) pct_day_at,
           count(day_buoi_id) co_buoi,
           min(day_at)::date tu, max(day_at)::date den
    from bo_tro_duoi_dang`],

  ['B2 · Lần đo (et/mt/btvn) — nối được tới dạng & chuyên đề?', `
    with d as (${DO_LUONG})
    select phase, mon, count(*) n_cham,
           count(ma_dang) co_dang,
           count(ma_chuyen_de) co_chuyen_de,
           round(100.0*count(ma_chuyen_de)/nullif(count(*),0),1) pct_chuyen_de
    from d group by 1,2 order by 3 desc`],

  ['B2b · ma_dang TRÙNG SỐ giữa 2 bản đồ (bẫy join gộp)', `
    select count(*) so_ma_trung from dai_ban_do d join khtn_ban_do k on k.ma_dang = d.ma_dang`],

  ['B3 · Dạng MỒ CÔI (đo rồi nhưng không có trong bản đồ)', `
    select p.ma_dang, count(*) n_cham, min(g.graded_at)::date tu, max(g.graded_at)::date den
    from gami_grades g
    join gami_session_problems p on p.id = g.problem_id
    where p.ma_dang is not null
      and not exists (select 1 from dai_ban_do d where d.ma_dang = p.ma_dang)
      and not exists (select 1 from khtn_ban_do k where k.ma_dang = p.ma_dang)
    group by 1 order by 2 desc limit 20`],

  ['B4 · Test online: bai_test_cau.ma_dang + verdict phủ tới đâu', `
    select t.loai,
           count(*) n_cau_lam,
           count(bc.ma_dang) co_dang,
           count(c.verdict) co_verdict,
           round(100.0*count(bc.ma_dang)/nullif(count(*),0),1) pct_dang
    from bai_lam_cau c
    join bai_test_cau bc on bc.id = c.bai_test_cau_id
    join bai_test t on t.id = bc.bai_test_id
    group by 1 order by 2 desc`],

  ['B5 · thai_do — ĐỘ PHỦ so với buổi đã đóng BTVN', `
    with buoi as (select id, lop_id from buoi_hoc where btvn_dong_at is not null),
         hs as (select bh.buoi_hoc_id, bh.hoc_sinh_id from buoi_hoc_hs bh
                join buoi b on b.id = bh.buoi_hoc_id where bh.diem_danh = 'co_mat')
    select (select count(*) from buoi) buoi_da_dong_btvn,
           (select count(*) from hs) hs_co_mat,
           (select count(*) from btvn_ket_qua k join buoi b on b.id = k.buoi_hoc_id) dong_ket_qua,
           (select count(*) from btvn_ket_qua k join buoi b on b.id = k.buoi_hoc_id where k.thai_do is not null) co_thai_do`],

  ['B6 · bt_grades (bổ trợ đuổi) — có gắn học sinh không?', `
    select count(*) n, count(ma_dang) co_dang, min(graded_at)::date tu, max(graded_at)::date den
    from bt_grades`],

  // ──────────────────── C. CALIBRATE (base-rate thật) ────────────────────
  ['C1 · Khoảng thời gian có data đo, theo phase', `
    with d as (${DO_LUONG})
    select phase, count(*) n, min(graded_at)::date tu, max(graded_at)::date den,
           count(distinct cua_so) so_cua_so, count(distinct hoc_sinh_id) so_hs
    from d group by 1 order by 2 desc`],

  ['C2 · MẬT ĐỘ: số câu mỗi (HS × chuyên đề × cửa sổ 14 ngày) → chọn min-n k', `
    with d as (${DO_LUONG}),
         cell as (select hoc_sinh_id, ma_chuyen_de, cua_so, count(*) n_cau
                  from d where ma_chuyen_de is not null group by 1,2,3)
    select count(*) so_o,
           round(avg(n_cau),1) tb_cau,
           percentile_disc(0.5)  within group (order by n_cau) p50,
           percentile_disc(0.75) within group (order by n_cau) p75,
           percentile_disc(0.9)  within group (order by n_cau) p90,
           max(n_cau) max_cau,
           round(100.0*count(*) filter (where n_cau >= 3)/count(*),1) pct_ge3,
           round(100.0*count(*) filter (where n_cau >= 5)/count(*),1) pct_ge5,
           round(100.0*count(*) filter (where n_cau >= 8)/count(*),1) pct_ge8
    from cell`],

  ['C3 · Mỗi (HS × cửa sổ) có bao nhiêu chuyên đề đủ ≥5 câu (cỡ stat sheet)', `
    with d as (${DO_LUONG}),
         cell as (select hoc_sinh_id, cua_so, ma_chuyen_de, count(*) n_cau
                  from d where ma_chuyen_de is not null group by 1,2,3)
    select cua_so, count(distinct hoc_sinh_id) so_hs,
           count(*) filter (where n_cau >= 5) o_du_5,
           count(*) o_tong,
           round(1.0*count(*) filter (where n_cau >= 5)/nullif(count(distinct hoc_sinh_id),0),1) cd_du5_moi_hs
    from cell group by 1 order by 1 desc limit 12`],

  ['C4 · Chuỗi cửa sổ liên tiếp của 1 HS×chuyên đề (đủ 3 chu kỳ để mượt MA-3?)', `
    with d as (${DO_LUONG}),
         cell as (select hoc_sinh_id, ma_chuyen_de, cua_so, count(*) n_cau
                  from d where ma_chuyen_de is not null group by 1,2,3),
         du as (select hoc_sinh_id, ma_chuyen_de, count(*) so_cua_so
                from cell where n_cau >= 5 group by 1,2)
    select so_cua_so, count(*) so_cap_hs_chuyende
    from du group by 1 order by 1`],

  ['C5 · SĨ SỐ lớp đang học (ngưỡng lùi-lên-khối khi lớp < 8)', `
    select l.mon, count(*) so_lop,
           round(avg(c.n),1) tb_si_so,
           min(c.n) min_ss, max(c.n) max_ss,
           count(*) filter (where c.n < 8) lop_duoi_8
    from lop l
    join (select lop_id, count(*) n from hoc_sinh_lop where trang_thai='dang_hoc' group by 1) c on c.lop_id = l.id
    where l.trang_thai = 'dang_hoc'
    group by 1 order by 2 desc`],

  ['C6 · CỠ CANDIDATE: %HS có ≥1 dạng YẾU (mastery 5-gần-nhất, ET+MT+BTVN)', `
    with d as (${DO_LUONG}),
         r as (select *, row_number() over (partition by hoc_sinh_id, ma_dang order by graded_at desc) rn from d),
         m as (select hoc_sinh_id, ma_dang, mon,
                      sum(v*w)/nullif(sum(w),0) score, count(*) n
               from r where rn <= 5 and ma_dang is not null group by 1,2,3),
         hs as (select hoc_sinh_id, mon,
                       count(*) filter (where score <= 0.5) so_yeu,
                       count(*) filter (where score > 0.5 and score < 0.8) so_can_luyen,
                       count(*) filter (where score >= 0.8) so_dat,
                       count(*) so_dang_da_do
                from m group by 1,2)
    select mon, count(*) so_hs,
           count(*) filter (where so_yeu >= 1) hs_co_yeu,
           round(100.0*count(*) filter (where so_yeu >= 1)/count(*),1) pct_co_yeu,
           round(avg(so_yeu),1) tb_dang_yeu,
           round(avg(so_dang_da_do),1) tb_dang_da_do
    from hs group by 1 order by 2 desc`],

  ['C7 · Phân bố số dạng YẾU mỗi HS (chọn ngưỡng ~10-15% roster)', `
    with d as (${DO_LUONG}),
         r as (select *, row_number() over (partition by hoc_sinh_id, ma_dang order by graded_at desc) rn from d),
         m as (select hoc_sinh_id, ma_dang, sum(v*w)/nullif(sum(w),0) score
               from r where rn <= 5 and ma_dang is not null group by 1,2),
         hs as (select hoc_sinh_id, count(*) filter (where score <= 0.5) so_yeu from m group by 1)
    select least(so_yeu, 10) so_dang_yeu, count(*) so_hs,
           round(100.0*count(*)/sum(count(*)) over (),1) pct
    from hs group by 1 order by 1`],

  ['C8 · Nguồn đo mỗi cửa sổ (ET/MT/BTVN có đều không → trọng số có ý nghĩa?)', `
    with d as (${DO_LUONG})
    select cua_so,
           count(*) filter (where phase='et') et,
           count(*) filter (where phase='mt') mt,
           count(*) filter (where phase='btvn') btvn
    from d group by 1 order by 1 desc limit 12`],
]

const url = loadUrl()
const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } })
await client.connect()

const pad = (s, n) => String(s ?? '∅').padEnd(n)
for (const [title, sql] of Q) {
  console.log('\n### ' + title)
  try {
    const { rows, fields } = await client.query(sql)
    if (!rows.length) { console.log('  (0 dòng)'); continue }
    const cols = fields.map(f => f.name)
    const wds = cols.map(c => Math.max(c.length, ...rows.map(r => String(r[c] ?? '∅').length)))
    console.log('  ' + cols.map((c, i) => pad(c, wds[i])).join(' | '))
    console.log('  ' + wds.map(w => '-'.repeat(w)).join('-+-'))
    for (const r of rows) console.log('  ' + cols.map((c, i) => pad(r[c], wds[i])).join(' | '))
  } catch (e) {
    console.log('  ❌ ' + e.message)
  }
}
await client.end()
