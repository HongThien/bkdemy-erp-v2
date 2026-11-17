-- ============================================================================
-- 202611171140 — mtt_dang_tinh_trang_bo_trung
-- VÌ SAO: mig 202611171129 thêm nhánh Hình (_mastery_lan_cap cap 'nhom') nhưng đo thật cho thấy fn_mastery_cells_moi ĐÃ trả sẵn dòng của bài Hình–Học
--   (cùng điểm) ⇒ mỗi bài Hình hiện 2 lần. Bỏ nhánh thừa; giữ điều kiện "bài Hình–Học chưa đo ⇒ p null".
-- MẤT GÌ: không xoá gì; create or replace cùng hàm (chữ ký, quyền giữ nguyên).
-- ============================================================================
create or replace function public.fn_mtt_dang_tinh_trang(p_hs uuid, p_mon text, p_ma text[])
returns jsonb
language plpgsql stable
set search_path to 'public'
as $$
declare v jsonb;
begin
  if not (
       (public.la_thanh_vien() and public._mon_duoc_xem(p_mon))
    or public.my_hoc_sinh_id() = p_hs
  ) then
    raise exception 'Ngoài quyền xem.' using errcode = '42501';
  end if;
  with c as (select x.ma_dang as ma, x.score, x.n, x.muc from public.fn_mastery_cells_moi(array[p_hs], true) x)
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', m.ma,
           'p', case when c.score is null then null else round(c.score * 100)::int end,
           'n', coalesce(c.n, 0),
           'muc', c.muc)), '[]'::jsonb)
    into v
    from unnest(coalesce(p_ma, '{}'::text[])) as m(ma)
    left join c on c.ma = m.ma
   where c.ma is not null
      or exists (select 1 from dai_bdm_dang_bai db where db.id = m.ma)
      or exists (select 1 from hinh_hoc_bai hh where hh.ma_bai = m.ma);   -- chưa đo ⇒ p null ("Chưa đo")
  return v;
end $$;

revoke execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) from public, anon;
grant execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) to authenticated;
