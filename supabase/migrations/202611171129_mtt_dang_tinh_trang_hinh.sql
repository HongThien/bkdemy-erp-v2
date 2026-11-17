-- ============================================================================
-- 202611171129 — mtt_dang_tinh_trang_hinh
-- VÌ SAO: Thùy 17/11 "Hình cũng thế" — fn_mtt_dang_tinh_trang (202611171118) mới trả dạng bản đồ mới (Đại); dạng Hình–Học (ô = BÀI HỌC hinh_hoc_bai)
--   chưa có nhãn. Ở Hình–Học bài học = chuyên đề = nhóm (_mastery_lan_d, Thùy 28/10) ⇒ tình trạng của "dạng" Hình = mastery cấp NHÓM của bài đó,
--   đọc từ _mastery_lan_cap (cap 'nhom') — cùng MỘT công thức mastery, không viết lại.
-- MẤT GÌ: không xoá gì; create or replace đúng hàm vừa tạo (cùng chữ ký, cùng quyền) — thân lấy từ bản đang chạy, chỉ thêm nhánh Hình.
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
  with c as (select x.ma_dang as ma, x.score, x.n, x.muc from public.fn_mastery_cells_moi(array[p_hs], true) x),
  h as (   -- Hình–Học: ô = bài học = nhóm ⇒ mastery cấp nhóm
    select l.nut as ma, l.score, l.n, l.muc
      from public._mastery_lan_cap(public._mastery_bdm_bat(), array[p_hs], true, null, null, array['nhom'], 5, 5, 3) l
     where l.nut = any(coalesce(p_ma, '{}'::text[]))
  ),
  t as (select * from c union all select * from h)
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', m.ma,
           'p', case when t.score is null then null else round(t.score * 100)::int end,
           'n', coalesce(t.n, 0),
           'muc', t.muc)), '[]'::jsonb)
    into v
    from unnest(coalesce(p_ma, '{}'::text[])) as m(ma)
    left join t on t.ma = m.ma
   where t.ma is not null
      or exists (select 1 from dai_bdm_dang_bai db where db.id = m.ma)
      or exists (select 1 from hinh_hoc_bai hh where hh.ma_bai = m.ma);   -- chưa đo ⇒ p null ("Chưa đo")
  return v;
end $$;

revoke execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) from public, anon;
grant execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) to authenticated;
