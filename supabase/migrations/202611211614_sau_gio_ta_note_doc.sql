-- ============================================================================
-- 202611211614 — sau_gio_ta_note_doc
-- VÌ SAO (Thùy 21/11): Trang soát điểm danh dựa trên ghi chú TA (mig 202611211613) ⇒ màn cần ĐỌC ghi chú theo danh sách buổi đang hiện (1 lượt gọi,
--   không đọc bảng thẳng từ client — spec-kien-truc: hàm đọc theo phần đang hiện).
-- MẤT GÌ (Luật xoá): không — thêm 1 hàm đọc.
-- ============================================================================
create or replace function public.fn_btnhe_ta_note_doc(p_buoi uuid[])
returns table(buoi_hoc_id uuid, noi_dung text, ten_ta text, updated_at timestamptz)
language sql stable security definer set search_path = public as $$
  select n.buoi_hoc_id, n.noi_dung, s.ho_ten, n.updated_at
    from sau_gio_ta_note n left join nhan_su s on s.id = n.ns_id
   where public.la_thanh_vien() and n.buoi_hoc_id = any(coalesce(p_buoi, '{}'::uuid[])) and cardinality(coalesce(p_buoi, '{}'::uuid[])) <= 300
$$;
revoke execute on function public.fn_btnhe_ta_note_doc(uuid[]) from public, anon;
grant execute on function public.fn_btnhe_ta_note_doc(uuid[]) to authenticated;
