-- ============================================================================
-- 202610221509 — dai_lop_cua_nhom
-- ----------------------------------------------------------------------------
-- VÌ SAO (không phải "làm gì" — đọc SQL là biết làm gì):
--   Kho trên lớp (mig 202610221458) bước 3: builder giáo trình / chuyên đề bản đồ mới chọn câu từ CẢ 2 kho (Thùy 22/10 "giáo viên
--   phải được chọn nguồn từ cả 2 kho"). Popup "✎ Chọn câu" cần danh sách câu kho trên lớp của 1 NHÓM (như fn_tl_bdm_cau của kho
--   luyện), kèm số lần đã dùng trong tài liệu (_tl_bdm_so_lan_dung — cùng định nghĩa với kho luyện).
--
-- MẤT GÌ (nếu có delete/drop/alter thu hẹp — liệt kê CHÍNH XÁC, Luật xoá):
--   Không mất gì — thêm 1 hàm đọc.
-- ============================================================================

create or replace function fn_dai_lop_cua_nhom(p_nhom text) returns jsonb
language sql stable as $$
  with v as materialized (
    select c.ma_cau, c.dang_bai_id, c.vai, c.loai_cau, c.thu_tu, d.thu_tu d_tt
      from dai_cau_lop c join dai_bdm_dang_bai d on d.id = c.dang_bai_id
     where d.nhom_id = p_nhom and c.xoa_at is null
  ),
  u as materialized (select * from _tl_bdm_so_lan_dung(array(select v.ma_cau from v)))
  select coalesce(jsonb_agg(jsonb_build_object(
           'ma_cau', v.ma_cau, 'dang_bai_id', v.dang_bai_id, 'vai', v.vai, 'loai_cau', v.loai_cau, 'so_lan_dung', coalesce(u.n, 0))
         order by v.d_tt, v.dang_bai_id, v.vai, v.thu_tu), '[]'::jsonb)
    from v left join u on u.ma_cau = v.ma_cau
$$;

revoke execute on function fn_dai_lop_cua_nhom(text) from public, anon;
grant execute on function fn_dai_lop_cua_nhom(text) to authenticated;
