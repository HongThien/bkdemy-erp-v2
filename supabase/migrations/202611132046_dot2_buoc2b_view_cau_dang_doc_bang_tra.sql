-- ĐỢT 2 — BƯỚC 2b (13/11/2026): view bdm_cau_dang đọc BẢNG TRA SẴN kho_cau_dang thay cho UNION 8 nhánh (mig 202611132043 đã dựng bảng + trigger, khớp từng dòng).
-- Giữ nguyên 4 cột và phạm vi (kho dai + hgt) ⇒ view bdm_cau_hoi, _do_o_bdm, _do_o_bdm_core… không phải sửa.
-- Hoàn tác: dựng lại view theo định nghĩa cũ (lưu trong lịch sử schema.md trước commit này).
create or replace view public.bdm_cau_dang with (security_invoker = on) as
  select t.ma_cau, t.kho, t.dang_bai_id, t.nguon
    from public.kho_cau_dang t
   where t.kho in ('dai', 'hgt');
