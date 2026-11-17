-- ============================================================================
-- 202611171118 — mtt_dang_tinh_trang
-- VÌ SAO: Thùy 17/11 — tờ Mục tiêu tuần, mỗi DẠNG bài trong nhóm phải có tình trạng (%). Tờ tính sẵn chỉ chứa tên dạng.
--   Hàm này đọc TÌNH TRẠNG của các dạng đang mở trên màn, MỘT em, một lượt — màn chỉ gọi khi bấm "Chi tiết" của một nhóm
--   (bấm đến đâu gọi đến đấy; không đụng bảng tính sẵn, không đổi tờ).
--   Công thức KHÔNG viết lại: dùng thẳng fn_mastery_cells_moi (MỘT công thức mastery — spec-mastery; ≤5 lần, ngưỡng 80/50).
--   Dạng Hình–Học (ô = bài, không có trong ô mastery dạng) ⇒ không trả dòng ⇒ màn không hiện nhãn (không bịa số).
-- MẤT GÌ: không xoá/sửa gì; chỉ thêm 1 hàm đọc.
-- Quyền: nhân sự trong quyền môn (_mon_duoc_xem) hoặc chính em đó. Người khác ⇒ raise.
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
  with c as (select x.ma_dang, x.score, x.n, x.muc from public.fn_mastery_cells_moi(array[p_hs], true) x)
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma', m.ma,
           'p', case when c.score is null then null else round(c.score * 100)::int end,
           'n', coalesce(c.n, 0),
           'muc', c.muc)), '[]'::jsonb)
    into v
    from unnest(coalesce(p_ma, '{}'::text[])) as m(ma)
    left join c on c.ma_dang = m.ma
   where c.ma_dang is not null or exists (select 1 from dai_bdm_dang_bai db where db.id = m.ma);   -- dạng bản đồ mới chưa đo ⇒ p null ("Chưa đo"); mã khác (Hình–Học) ⇒ không trả
  return v;
end $$;

revoke execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) from public, anon;
grant execute on function public.fn_mtt_dang_tinh_trang(uuid, text, text[]) to authenticated;
