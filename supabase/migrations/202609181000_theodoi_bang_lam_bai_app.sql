-- Theo dõi bài tập trên app HS — CEO 2026-09-17
-- Scope loại: `tu_luyen`, `bo_tro`, `bo_tro_test`, `retest` (những gì HS làm NGOÀI lớp)
-- Không tính ET/BTVN/giáo trình/đề thi (làm trên lớp có giám sát) — user đã chọn 09-17.
-- Trả về theo NGÀY VN, chỉ dòng có dữ liệu; HS trong scope mà không có dòng nào → 1 dòng
-- (hs, ngay=null, so_cau=0) để client biết HS lười vẫn hiện trong bảng.
-- Quyền: la_admin_he_thong → mọi lớp. Người khác → lớp thuộc phan_cong_lop (vai gv/tg).
--   Không phải admin và không phụ trách lớp nào → trả rỗng (không lỗi, tránh spam UI).

create or replace function public.fn_theodoi_bang_lam_bai(
  p_tu date,
  p_den date,
  p_lop_ids uuid[] default null,
  p_hoc_sinh_ids uuid[] default null
) returns table (
  hoc_sinh_id uuid,
  ho_ten text,
  ma_hs text,
  khoi text,
  lop_id uuid,
  ten_lop text,
  ngay date,
  so_cau integer,
  so_dung integer,
  so_sai integer,
  thoi_gian_giay integer
) language plpgsql stable security definer set search_path = public as $$
declare
  v_ns uuid;
  v_admin boolean;
  v_lops uuid[];
begin
  if p_tu is null or p_den is null or p_tu > p_den or (p_den - p_tu) > 92 then
    raise exception 'Khoảng ngày không hợp lệ (tối đa 93 ngày)';
  end if;

  select nhan_su_id into v_ns from tai_khoan where id = public.jwt_uid();
  if v_ns is null then
    return; -- chưa xác thực nhân sự → không trả gì
  end if;
  select coalesce(la_admin_he_thong, false) into v_admin from nhan_su where id = v_ns;

  if not v_admin then
    select array_agg(distinct pcl.lop_id) into v_lops
      from phan_cong_lop pcl
     where pcl.nhan_su_id = v_ns and pcl.vai_tro in ('gv', 'tg');
    if v_lops is null then
      return; -- không phụ trách lớp nào → rỗng
    end if;
  end if;

  return query
  with scope as (
    select h.id as hs_id, h.ho_ten as ht, h.ma_hs as mhs, h.khoi as kh,
           hl.lop_id as lid, l.ten_lop as tlop
      from hoc_sinh h
      join hoc_sinh_lop hl on hl.hoc_sinh_id = h.id and hl.trang_thai = 'dang_hoc'
      join lop l on l.id = hl.lop_id
     where h.trang_thai = 'dang_hoc'
       and (v_admin or hl.lop_id = any(v_lops))
       and (p_lop_ids is null or hl.lop_id = any(p_lop_ids))
       and (p_hoc_sinh_ids is null or h.id = any(p_hoc_sinh_ids))
  ),
  dong as (
    select bl.hoc_sinh_id as hs_id,
           (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date as d,
           blc.cham_at as t,
           blc.verdict as v
      from bai_lam_cau blc
      join bai_lam bl on bl.id = blc.bai_lam_id
      join bai_test bt on bt.id = bl.bai_test_id
     where blc.verdict is not null
       and bt.loai in ('tu_luyen', 'bo_tro', 'bo_tro_test', 'retest')
       and bl.hoc_sinh_id in (select hs_id from scope)
       and (blc.cham_at at time zone 'Asia/Ho_Chi_Minh')::date between p_tu and p_den
  ),
  agg as (
    select d.hs_id, d.d as ngay_v,
           count(*)::int as sc,
           count(*) filter (where d.v = 'correct')::int as sd,
           count(*) filter (where d.v <> 'correct')::int as ss,
           case when count(*) < 2 then 0
                else greatest(0, extract(epoch from (max(d.t) - min(d.t)))::int) end as tg
      from dong d
     group by d.hs_id, d.d
  )
  -- HS có làm bài trong ít nhất 1 ngày → 1 dòng/ngày
  select s.hs_id, s.ht, s.mhs, s.kh, s.lid, s.tlop,
         a.ngay_v, a.sc, a.sd, a.ss, a.tg
    from scope s
    join agg a on a.hs_id = s.hs_id
   union all
  -- HS không có ngày nào → 1 dòng ngay=null, so_cau=0 (giữ HS lười trong bảng)
  select s.hs_id, s.ht, s.mhs, s.kh, s.lid, s.tlop,
         null::date, 0, 0, 0, 0
    from scope s
   where not exists (select 1 from agg a where a.hs_id = s.hs_id)
   order by 6, 2, 7 desc nulls last;
end $$;

revoke all on function public.fn_theodoi_bang_lam_bai(date, date, uuid[], uuid[]) from public;
grant execute on function public.fn_theodoi_bang_lam_bai(date, date, uuid[], uuid[]) to authenticated;
