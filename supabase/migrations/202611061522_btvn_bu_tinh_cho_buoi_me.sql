-- BTVN HỌC BÙ TÍNH CHO BUỔI MẸ — phần "đếm đã làm bài" (Thùy 06/11: "BTVN bù của học sinh đi học bù phải được map vào dữ liệu
-- của buổi học đấy, vẫn phải tính học sinh đã làm bài"). Mig 202611031749 mới gắn KẾT QUẢ về buổi mẹ cho Report PH + tab BTVN buổi
-- học; mọi chỗ ĐẾM vẫn chỉ đọc buổi thường ⇒ em vắng buổi mẹ đã làm bù vẫn bị tính "vắng/chưa làm" (81 lượt T8–T10, 0 lượt được tính).
-- Nguồn nối DUY NHẤT = fn_btvn_bu_theo_buoi_me (buoi_hoc_hs.bu_cho_buoi_id — khoá tự nhiên, không nối câu theo vị trí).
--   A. fn_matrix_lop (bảng ET/BTVN của lớp + hồ sơ HS trong Trợ lý qua _troly_matrix): ô buổi mẹ = % bài bù / "không làm".
--   B. fn_completion_theo_lop: em làm bù = có bài phải nộp VÀ đã làm.
--   C. fn_thanh_tuu_thang (BTVN đúng hạn đủ · tỉ lệ đúng BTVN) và D. fn_recompute_exp_thang (EXP BTVN, ledger neo BUỔI MẸ):
--      CHỈ từ tháng 11/2026 theo tháng của buổi mẹ — Thùy chọn 06/11, T9–T10 giữ nguyên EXP/Level/xu đã chốt.
--   E. Trigger: TA ghi trạng thái nộp BTVN bù ⇒ tính lại EXP tháng của buổi mẹ (nếu từ T11) — bù thường chấm SAU khi buổi mẹ đã đóng.
-- Không đổi: việc chấm của TA (buổi thường chỉ HS có mặt; BTVN bù có luồng riêng fn_bu_btvn_viec_cua_toi) · mastery (đã đọc mọi buổi).

CREATE OR REPLACE FUNCTION public.fn_matrix_lop(p_lop uuid, p_phase text, p_ym text DEFAULT NULL::text)
 RETURNS TABLE(hoc_sinh_id uuid, buoi_hoc_id uuid, pct integer, status text)
 LANGUAGE sql
 STABLE
AS $function$
  with buoi as (
    select id from buoi_hoc b
    where b.lop_id = p_lop and b.loai = 'thuong' and b.trang_thai <> 'huy'
      and case p_phase when 'et' then b.et_dong_at when 'mt' then b.mt_dong_at else b.btvn_dong_at end is not null
      and (p_ym is null or (b.ngay >= (p_ym || '-01')::date and b.ngay < (p_ym || '-01')::date + interval '1 month'))
  ),
  agg as (
    select g.hoc_sinh_id, sp.buoi_hoc_id, sum(g.points) as pts, count(*) as n
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
    where sp.buoi_hoc_id in (select id from buoi) and sp.phase = p_phase
    group by g.hoc_sinh_id, sp.buoi_hoc_id
  ),
  miss as (
    select k.hoc_sinh_id, k.buoi_hoc_id from btvn_ket_qua k
    where p_phase = 'btvn' and k.buoi_hoc_id in (select id from buoi)
      and k.trang_thai_nop in ('khong_lam', 'xin_phep')
  ),
  bu as (   -- 06/11 (Thùy): em vắng buổi này đã làm BTVN ở ca HỌC BÙ ⇒ ô buổi này lấy kết quả bù (nối qua bu_cho_buoi_id)
    select x.hoc_sinh_id, x.buoi_me_id as buoi_hoc_id, x.pct, x.trang_thai_nop
      from public.fn_btvn_bu_theo_buoi_me(array(select id from buoi where p_phase = 'btvn')) x
     where x.pct is not null or x.trang_thai_nop in ('khong_lam', 'xin_phep')
  ),
  vang as (
    select r.hoc_sinh_id, r.buoi_hoc_id from buoi_hoc_hs r
    where r.buoi_hoc_id in (select id from buoi) and r.diem_danh in ('vang', 'vang_phep')
  )
  select a.hoc_sinh_id, a.buoi_hoc_id,
         least(100, round((a.pts / (a.n * 100.0)) * 100))::int, 'done'
  from agg a where a.n > 0
  union all
  select m.hoc_sinh_id, m.buoi_hoc_id, null, 'khong_lam' from miss m
  where not exists (select 1 from agg a where a.hoc_sinh_id = m.hoc_sinh_id and a.buoi_hoc_id = m.buoi_hoc_id and a.n > 0)
  union all
  select u.hoc_sinh_id, u.buoi_hoc_id, u.pct, case when u.pct is not null then 'done' else 'khong_lam' end from bu u
  where not exists (select 1 from agg a where a.hoc_sinh_id = u.hoc_sinh_id and a.buoi_hoc_id = u.buoi_hoc_id and a.n > 0)
    and not exists (select 1 from miss m where m.hoc_sinh_id = u.hoc_sinh_id and m.buoi_hoc_id = u.buoi_hoc_id)
  union all
  select v.hoc_sinh_id, v.buoi_hoc_id, null, 'vang' from vang v
  where not exists (select 1 from agg a where a.hoc_sinh_id = v.hoc_sinh_id and a.buoi_hoc_id = v.buoi_hoc_id and a.n > 0)
    and not exists (select 1 from miss m where m.hoc_sinh_id = v.hoc_sinh_id and m.buoi_hoc_id = v.buoi_hoc_id)
    and not exists (select 1 from bu u where u.hoc_sinh_id = v.hoc_sinh_id and u.buoi_hoc_id = v.buoi_hoc_id)
$function$
;

CREATE OR REPLACE FUNCTION public.fn_completion_theo_lop(p_mon text, p_phase text, p_ym text)
 RETURNS TABLE(lop_id uuid, buoi_count bigint, expected bigint, done bigint)
 LANGUAGE sql
 STABLE
AS $function$
  with buoi as (
    select b.id, b.lop_id from buoi_hoc b join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy'
      and case p_phase when 'et' then b.et_dong_at when 'mt' then b.mt_dong_at else b.btvn_dong_at end is not null
      and b.ngay >= (p_ym || '-01')::date and b.ngay < (p_ym || '-01')::date + interval '1 month'
  ),
  bu as (   -- 06/11 (Thùy): em vắng đã làm BTVN ở ca học bù ⇒ tính cho buổi mẹ
    select x.hoc_sinh_id, x.buoi_me_id as buoi_hoc_id
      from public.fn_btvn_bu_theo_buoi_me(array(select id from buoi where p_phase = 'btvn')) x
  ),
  expected as (
    select bh.lop_id, r.hoc_sinh_id, r.buoi_hoc_id
    from buoi_hoc_hs r join buoi bh on bh.id = r.buoi_hoc_id
    where r.diem_danh = 'co_mat'
    union
    select bh.lop_id, u.hoc_sinh_id, u.buoi_hoc_id from bu u join buoi bh on bh.id = u.buoi_hoc_id
  ),
  done_pairs as (
    select distinct x.hoc_sinh_id, x.buoi_hoc_id from (
      select g.hoc_sinh_id, sp.buoi_hoc_id
      from gami_grades g join gami_session_problems sp on sp.id = g.problem_id
      where p_phase <> 'btvn' and sp.phase = p_phase and sp.buoi_hoc_id in (select id from buoi)
      union all
      select k.hoc_sinh_id, k.buoi_hoc_id from btvn_ket_qua k
      where p_phase = 'btvn' and k.buoi_hoc_id in (select id from buoi)
      union all
      select u.hoc_sinh_id, u.buoi_hoc_id from bu u
    ) x
  )
  select l.id,
         (select count(*) from buoi b where b.lop_id = l.id),
         (select count(*) from expected e where e.lop_id = l.id),
         (select count(*) from expected e join done_pairs d
            on d.hoc_sinh_id = e.hoc_sinh_id and d.buoi_hoc_id = e.buoi_hoc_id
          where e.lop_id = l.id) -- done GIAO kỳ vọng — đúng JS gốc
  from lop l where l.mon = p_mon
$function$
;

CREATE OR REPLACE FUNCTION public.fn_thanh_tuu_thang(p_mon text, p_ym text, p_hs uuid[] DEFAULT NULL::uuid[])
 RETURNS TABLE(hoc_sinh_id uuid, thanh_tuu_key text, ket_qua text)
 LANGUAGE plpgsql
AS $function$   -- volatile: dùng bảng tạm
declare
  v_ms date := (p_ym || '-01')::date;
  v_me date := ((p_ym || '-01')::date + interval '1 month')::date - 1;
  v_tu timestamptz := (p_ym || '-01')::date::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_den timestamptz := (((p_ym || '-01')::date + interval '1 month')::date)::timestamp at time zone 'Asia/Ho_Chi_Minh';
  v_mua record; v_hs uuid[]; v_dangs text[]; v_khoi text; v_ym text;
begin
  select * into v_mua from gami_mua where p_ym between thang_dau and thang_cuoi limit 1;
  -- em "học tháng đó" = có dòng điểm danh ở buổi lớp môn trong tháng
  select array_agg(distinct h.hoc_sinh_id) into v_hs
  from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
  where l.mon = p_mon and b.ngay between v_ms and v_me and b.trang_thai <> 'huy'
    and (p_hs is null or h.hoc_sinh_id = any(p_hs));
  if v_hs is null then return; end if;
  execute format('select coalesce(array_agg(ma_dang), ''{}'') from (select ma_dang from %I union select ma_dang from %I union select ma_dang from %I union select ma_dang from bdm_ban_do) z',
                 public._kho_ban_do_tbl(p_mon), public._kho_ban_do_tbl(p_mon, 'hinh_gt'), public._kho_ban_do_tbl(p_mon, 'hinh_hoc')) into v_dangs;

  -- Bảng đua tháng: chỉ các khối có em trong danh sách (1 HS ⇒ 1 khối)
  create temp table _dua (hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_khoi in select distinct l.khoi from hoc_sinh_lop hl join lop l on l.id = hl.lop_id
                where hl.trang_thai = 'dang_hoc' and l.mon = p_mon and hl.hoc_sinh_id = any(v_hs) and l.khoi is not null loop
    insert into _dua select d.hoc_sinh_id, d.hang, d.so_em_co_diem from public.fn_rank_dua_thang(p_mon, v_khoi, p_ym) d;
  end loop;
  -- MT: tháng này + mốc (tháng MT đầu tiên của em trong mùa)
  create temp table _mt (ym text, hoc_sinh_id uuid, hang integer, so_em integer) on commit drop;
  for v_ym in select to_char(g, 'YYYY-MM') from generate_series((coalesce(v_mua.thang_dau, p_ym) || '-01')::date, v_ms, interval '1 month') g loop
    insert into _mt select v_ym, m.hoc_sinh_id, m.hang, m.so_em from public.fn_mt_hang_thang(p_mon, v_ym) m where m.hoc_sinh_id = any(v_hs);
  end loop;

  return query
  with
  hs as materialized (select unnest(v_hs) as hs),
  dd as materialized (select h.hoc_sinh_id as hs, count(*) filter (where h.diem_danh = 'co_mat') as co, count(*) filter (where h.diem_danh in ('vang', 'vang_phep')) as vang
         from buoi_hoc_hs h join buoi_hoc b on b.id = h.buoi_hoc_id join lop l on l.id = b.lop_id
         where l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and h.hoc_sinh_id = any(v_hs)
         group by 1),
  -- 06/11 (Thùy): BTVN làm ở ca HỌC BÙ tính cho BUỔI MẸ (môn + tháng của buổi mẹ), từ tháng 11/2026. Ca bù không có lớp nên
  -- 2 khối dưới (join lop) vốn không đếm nó — không trùng. Buổi mẹ đã có kết quả của chính em thì không lấy bù.
  bu as materialized (select x.* from public.fn_btvn_bu_theo_buoi_me(array(
           select b.id from buoi_hoc b join lop l on l.id = b.lop_id
            where p_ym >= '2026-11' and l.mon = p_mon and b.loai = 'thuong' and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me)) x
         where x.hoc_sinh_id = any(v_hs)
           and not exists (select 1 from btvn_ket_qua k2 where k2.buoi_hoc_id = x.buoi_me_id and k2.hoc_sinh_id = x.hoc_sinh_id)),
  bt as materialized (select y.hs, count(*) as n, count(*) filter (where y.t = 'nop_dung_han') as dh from (
           select k.hoc_sinh_id as hs, k.trang_thai_nop as t
             from btvn_ket_qua k join buoi_hoc b on b.id = k.buoi_hoc_id join lop l on l.id = b.lop_id
            where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and k.trang_thai_nop is not null and k.hoc_sinh_id = any(v_hs)
           union all
           select bu.hoc_sinh_id, bu.trang_thai_nop from bu where bu.trang_thai_nop is not null) y
         group by 1),
  bai as materialized (   -- tỉ lệ đúng từng bài (em × buổi × phase) — cùng quy đổi mastery
    select g.hoc_sinh_id as hs, sp.phase, g.buoi_hoc_id, avg(case g.result when 'correct' then 1.0 when 'partial' then 0.5 else 0 end) as tl
    from gami_grades g join gami_session_problems sp on sp.id = g.problem_id and sp.phase in ('et', 'btvn')
    join buoi_hoc b on b.id = g.buoi_hoc_id join lop l on l.id = b.lop_id
    where l.mon = p_mon and b.trang_thai <> 'huy' and b.ngay between v_ms and v_me and g.hoc_sinh_id = any(v_hs)
    group by 1, 2, 3
    union all   -- 06/11: bài BTVN làm ở ca bù = 1 bài của buổi mẹ
    select bu.hoc_sinh_id, 'btvn', bu.buoi_me_id, bu.pct / 100.0 from bu where bu.pct is not null),
  tl as materialized (select bl.hoc_sinh_id as hs, count(*) as n
         from bai_lam_cau blc join bai_lam bl on bl.id = blc.bai_lam_id join bai_test bt2 on bt2.id = bl.bai_test_id
         where bt2.loai = 'tu_luyen' and bt2.mon = p_mon and blc.verdict = 'correct' and bl.hoc_sinh_id = any(v_hs)
           and blc.cham_at >= v_tu and blc.cham_at < v_den
         group by 1),
  tt as materialized (select t.hoc_sinh_id as hs, count(distinct t.ngay) filter (where t.pass) as ngay_pass, count(*) filter (where t.so_dung = t.so_cau) as so_full
         from thu_thach_luot t where t.mon = p_mon and t.ngay between v_ms and v_me and t.hoc_sinh_id = any(v_hs) group by 1),
  mt_nay as materialized (select * from _mt where ym = p_ym),
  mt_moc as materialized (select distinct on (m.hoc_sinh_id) m.hoc_sinh_id, m.ym, m.hang, m.so_em from _mt m order by m.hoc_sinh_id, m.ym),
  ms0 as materialized (select m.hoc_sinh_id as hs, m.ma_dang from public.fn_mastery_cells_moi(v_hs, false, null, 5, 5, 3, v_tu) m
          where m.muc = 'yeu' and m.ma_dang = any(v_dangs)),
  ms1 as materialized (select m.hoc_sinh_id as hs, m.ma_dang, m.muc, m.tin from public.fn_mastery_cells_moi(v_hs, false, null, 5, 5, 3, v_den) m
          where m.ma_dang = any(v_dangs)),
  msdo as materialized (select distinct m.hoc_sinh_id as hs from public.fn_mastery_cells_moi(v_hs, false, v_tu, 5, 5, 3, v_den) m where m.ma_dang = any(v_dangs)),
  ll as materialized (select h.hs,
                exists (select 1 from ms0 join ms1 on ms1.hs = ms0.hs and ms1.ma_dang = ms0.ma_dang
                        where ms0.hs = h.hs and ms1.muc = 'dat' and ms1.tin in ('tb', 'cao')) as lap,
                not exists (select 1 from ms1 where ms1.hs = h.hs and ms1.muc = 'yeu') and exists (select 1 from msdo where msdo.hs = h.hs) as sach
         from hs h),
  tk as materialized (select * from thanh_tuu where mon = p_mon and active)
  select h.hs, tk.key,
    case
      when tk.mo_tu is not null and v_me < tk.mo_tu then 'khong_ap_dung'
      when tk.loai_chi_so = 'mt_hon_moc' and (select mm.ym from mt_moc mm where mm.hoc_sinh_id = h.hs) = p_ym then 'khong_ap_dung'
      when case tk.loai_chi_so
        when 'diem_danh_du'        then coalesce((select dd.co >= 1 and dd.vang = 0 from dd where dd.hs = h.hs), false)
        when 'btvn_dung_han_du'    then coalesce((select bt.n >= 1 and bt.dh = bt.n from bt where bt.hs = h.hs), false)
        when 'tu_luyen_cau_dung'   then coalesce((select tl.n >= (tk.tham_so->>'n')::int from tl where tl.hs = h.hs), false)
        when 'thu_thach_ngay_pass' then coalesce((select tt.ngay_pass >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'thu_thach_luot_full' then coalesce((select tt.so_full >= (tk.tham_so->>'n')::int from tt where tt.hs = h.hs), false)
        when 'et_ti_le_bai'        then coalesce((select count(*) >= 1 and count(*) filter (where bai.tl >= (tk.tham_so->>'ti_le')::numeric)
                                                         >= (tk.tham_so->>'phan')::numeric * count(*)
                                                  from bai where bai.hs = h.hs and bai.phase = 'et'), false)
        when 'btvn_ti_le_tb'       then coalesce((select avg(bai.tl) >= (tk.tham_so->>'ti_le')::numeric from bai where bai.hs = h.hs and bai.phase = 'btvn'), false)
        when 'mt_top_pct'          then coalesce((select m.hang <= ceil((tk.tham_so->>'pct')::numeric * m.so_em) from mt_nay m where m.hoc_sinh_id = h.hs), false)
        when 'mt_hon_moc'          then coalesce((select m.hang::numeric / m.so_em < mc.hang::numeric / mc.so_em
                                                         or m.hang <= ceil((tk.tham_so->>'top_pct')::numeric * m.so_em)
                                                  from mt_nay m join mt_moc mc on mc.hoc_sinh_id = m.hoc_sinh_id where m.hoc_sinh_id = h.hs), false)
        when 'lap_lo'              then coalesce((select ll.lap or ll.sach from ll where ll.hs = h.hs), false)
        when 'dua_thang_top_pct'   then coalesce((select d.hang <= ceil((tk.tham_so->>'pct')::numeric * d.so_em) from _dua d where d.hoc_sinh_id = h.hs), false)
        when 'giai_thuong'         then exists (select 1 from hs_giai_thuong g where g.hoc_sinh_id = h.hs and g.mon = p_mon and g.thang = v_ms)
      end then 'dat'
      else 'khong_dat'
    end
  from hs h cross join tk;
  drop table _dua; drop table _mt;
end $function$
;

CREATE OR REPLACE FUNCTION public.fn_recompute_exp_thang(p_lop_id uuid, p_ym text)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$
declare
  v_mon text; v_tu date; v_den date; v_buoi_cuoi uuid;
  v_hs integer; v_tong numeric;
begin
  select mon into v_mon from lop where id = p_lop_id;
  v_mon := coalesce(v_mon, 'Toán');
  v_tu := (p_ym || '-01')::date;
  v_den := v_tu + interval '1 month';

  create temp table _ret_buoi on commit drop as
    select id, ngay from buoi_hoc
    where lop_id = p_lop_id and loai = 'thuong' and trang_thai <> 'huy' and ngay >= v_tu and ngay < v_den;
  select id into v_buoi_cuoi from _ret_buoi order by ngay desc limit 1;

  -- ET events (từ history đã có hạng)
  create temp table _ret_et on commit drop as
    select h.hoc_sinh_id, h.buoi_hoc_id, public.fn_exp_et_rank(h.rank, h.rank_total) as amount
    from gami_elo_history h join _ret_buoi b on b.id = h.buoi_hoc_id
    where h.phase = 'et' and h.rank is not null and h.rank_total is not null;

  -- BTVN per bài + độ đúng per (hs×buổi)
  create temp table _ret_btvn on commit drop as
    select k.hoc_sinh_id, k.buoi_hoc_id, k.trang_thai_nop, k.thai_do,
           public.fn_exp_btvn_bai(k.trang_thai_nop, k.thai_do) as amount,
           (case when coalesce(case k.trang_thai_nop when 'nop_dung_han' then 1.0 when 'nop_muon' then 0.9 else 0 end, 0) = 0
                 then 1 else 0 end) as miss
    from btvn_ket_qua k join _ret_buoi b on b.id = k.buoi_hoc_id
    union all   -- 06/11 (Thùy): BTVN làm ở ca HỌC BÙ tính cho BUỔI MẸ, từ tháng 11/2026 (T9–T10 giữ nguyên EXP/xu đã chốt)
    select x.hoc_sinh_id, x.buoi_me_id, x.trang_thai_nop, x.thai_do,
           public.fn_exp_btvn_bai(x.trang_thai_nop, x.thai_do),
           (case when coalesce(case x.trang_thai_nop when 'nop_dung_han' then 1.0 when 'nop_muon' then 0.9 else 0 end, 0) = 0
                 then 1 else 0 end)
    from public.fn_btvn_bu_theo_buoi_me(array(select id from _ret_buoi where p_ym >= '2026-11')) x
    where x.trang_thai_nop is not null
      and not exists (select 1 from btvn_ket_qua k2 where k2.buoi_hoc_id = x.buoi_me_id and k2.hoc_sinh_id = x.hoc_sinh_id);

  create temp table _ret_acc on commit drop as
    select g.hoc_sinh_id, sp.buoi_hoc_id, sum(g.points) / (count(*) * 100.0) as acc
    from gami_grades g
    join gami_session_problems sp on sp.id = g.problem_id and sp.phase = 'btvn'
    join _ret_buoi b on b.id = sp.buoi_hoc_id
    group by g.hoc_sinh_id, sp.buoi_hoc_id
    union all   -- 06/11: độ đúng bài BTVN bù = của buổi mẹ
    select x.hoc_sinh_id, x.buoi_me_id, x.pct / 100.0
    from public.fn_btvn_bu_theo_buoi_me(array(select id from _ret_buoi where p_ym >= '2026-11')) x
    where x.pct is not null
      and not exists (select 1 from btvn_ket_qua k2 where k2.buoi_hoc_id = x.buoi_me_id and k2.hoc_sinh_id = x.hoc_sinh_id);

  -- tổng hợp per HS (studentAcc = TB acc các buổi; classMean = TB studentAcc của HS có acc)
  create temp table _ret_hs on commit drop as
    with hs_all as (
      select hoc_sinh_id from _ret_et union select hoc_sinh_id from _ret_btvn union select hoc_sinh_id from _ret_acc
    ), acc_hs as (select hoc_sinh_id, avg(acc) as student_acc from _ret_acc group by hoc_sinh_id),
    cm as (select avg(student_acc) as class_mean from acc_hs)
    select a.hoc_sinh_id,
           coalesce((select sum(amount) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id), 0) as subtotal,
           coalesce((select sum(miss) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id), 0) as miss_count,
           (select count(*) from _ret_btvn t where t.hoc_sinh_id = a.hoc_sinh_id) as so_bai,
           ah.student_acc, (select class_mean from cm) as class_mean
    from hs_all a left join acc_hs ah on ah.hoc_sinh_id = a.hoc_sinh_id;

  -- điều chỉnh tháng (đúng thứ tự + jsround như exp.js monthlyBtvnExp)
  create temp table _ret_adj on commit drop as
    select hoc_sinh_id, subtotal,
      (case when so_bai > 0 and miss_count = 0 then public.fn_jsround(subtotal * 0.05) else 0 end)
      + (case when student_acc is not null and class_mean is not null and student_acc - class_mean > 0.05
              then public.fn_jsround(subtotal * 0.05) else 0 end)
      + (case when student_acc is not null and class_mean is not null and student_acc - class_mean < -0.10
              then -public.fn_jsround(subtotal * 0.05) else 0 end)
      + (-public.fn_jsround(subtotal * 0.05 * miss_count)) as adj
    from _ret_hs;

  -- XOÁ ledger chi tiết cũ của (lớp×tháng) + dòng gộp legacy, rồi GHI MỚI — cùng transaction.
  delete from gami_exp_ledger where ref_buoi_hoc_id in (select id from _ret_buoi) and source <> 'exp_tren_lop'; -- mig 202609272048: EXP game trong buổi không thuộc recompute
  delete from gami_exp_ledger where source = 'exp_btvn_thang' and note = p_ym   -- mig 202610091934: điều chỉnh tháng neo vào buổi ĐÃ HUỶ (trước đây sống mãi ⇒ cộng đôi)
    and ref_buoi_hoc_id in (select id from buoi_hoc where lop_id = p_lop_id and loai = 'thuong' and trang_thai = 'huy'
                            and ngay >= v_tu and ngay < v_den);
  delete from gami_exp_ledger where source = 'exp_thang' and mon = v_mon and note = p_ym
    and hoc_sinh_id in (select hoc_sinh_id from _ret_hs);

  insert into gami_exp_ledger (hoc_sinh_id, source, amount, mon, note, ref_buoi_hoc_id)
  select hoc_sinh_id, 'exp_et', amount, v_mon, p_ym, buoi_hoc_id from _ret_et
  union all
  select hoc_sinh_id, 'exp_btvn', amount, v_mon, p_ym, buoi_hoc_id from _ret_btvn where amount > 0
  union all
  select a.hoc_sinh_id, 'exp_btvn_thang',
         greatest(0, a.subtotal + a.adj) - a.subtotal, v_mon, p_ym, v_buoi_cuoi
  from _ret_adj a where greatest(0, a.subtotal + a.adj) - a.subtotal <> 0 and v_buoi_cuoi is not null;

  select count(*), coalesce(sum(t), 0) into v_hs, v_tong from (
    select h.hoc_sinh_id,
           coalesce((select sum(amount) from _ret_et e where e.hoc_sinh_id = h.hoc_sinh_id), 0)
           + greatest(0, h.subtotal + a.adj) as t
    from _ret_hs h join _ret_adj a on a.hoc_sinh_id = h.hoc_sinh_id
  ) x where x.t > 0;
  drop table _ret_buoi, _ret_et, _ret_btvn, _ret_acc, _ret_hs, _ret_adj;
  return jsonb_build_object('hs', v_hs, 'tong', v_tong);
end $function$
;


-- ── E. TA ghi trạng thái BTVN bù ⇒ tính lại EXP (lớp × tháng) của buổi mẹ
create or replace function public._trg_btvn_bu_exp_buoi_me()
returns trigger language plpgsql set search_path to 'public' as $$
declare r record;
begin
  for r in
    select distinct me.lop_id, to_char(me.ngay, 'YYYY-MM') as ym
      from buoi_hoc bb
      join buoi_hoc_hs hh on hh.buoi_hoc_id = bb.id and hh.hoc_sinh_id = new.hoc_sinh_id and hh.bu_cho_buoi_id is not null
      join buoi_hoc me on me.id = hh.bu_cho_buoi_id and me.loai = 'thuong' and me.trang_thai <> 'huy'
     where bb.id = new.buoi_hoc_id and bb.loai = 'bu' and me.lop_id is not null
       and to_char(me.ngay, 'YYYY-MM') >= '2026-11'
  loop
    perform public.fn_recompute_exp_thang(r.lop_id, r.ym);
  end loop;
  return null;
end $$;
drop trigger if exists trg_btvn_bu_exp_buoi_me on public.btvn_ket_qua;
create trigger trg_btvn_bu_exp_buoi_me
  after insert or update of trang_thai_nop, thai_do on public.btvn_ket_qua
  for each row when (new.trang_thai_nop is not null)
  execute function public._trg_btvn_bu_exp_buoi_me();
