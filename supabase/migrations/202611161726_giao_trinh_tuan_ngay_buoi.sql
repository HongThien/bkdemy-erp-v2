-- ============================================================================
-- 202611161726 — giao_trinh_tuan_ngay_buoi
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Giáo trình tuần bước 2 (spec-giao-trinh-tuan.md §2): builder hiện nhãn "📅 T5 26/11" trên buổi đã gắn ca, và khung bên phải của màn tuần
--   cần biết buổi nào của giáo trình đã gắn ca khác (1-1) khi chọn buổi có sẵn. Một hàm đọc theo MỘT giáo trình (chi phí theo một tài liệu).
--   Invoker + RLS (gtt_ca chỉ cho nhân sự đọc) — không cần secdef.
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không xoá gì.
-- ============================================================================

create or replace function fn_gtt_ngay_buoi(p_tai_lieu uuid)
returns table (buoi_id uuid, lop_id uuid, ngay date)
language sql stable set search_path = public as $$
  select g.buoi_id, g.lop_id, g.ngay
    from gtt_ca g join tai_lieu_phan p on p.id = g.buoi_id
   where p.tai_lieu_id = p_tai_lieu and p.loai_phan = 'buoi'
   order by g.ngay
$$;
revoke execute on function fn_gtt_ngay_buoi(uuid) from public, anon;
grant execute on function fn_gtt_ngay_buoi(uuid) to authenticated;
