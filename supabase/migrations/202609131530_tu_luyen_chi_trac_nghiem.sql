-- ============================================================================
-- 202609131530 — Tự luyện HS: CHỈ trac_nghiem (Thùy 13/09 chốt lại — bỏ luôn dung_sai)
-- ----------------------------------------------------------------------------
-- VÌ SAO: Sau khi kiểm kho khối 7, form MCQ Thùy đang duyệt sẽ mở dần vào kho tự luyện. CEO chốt
--   đơn giản hoá: TỰ LUYỆN HS chỉ dùng câu "4 đáp án" (loai_cau='trac_nghiem'), bỏ luôn dung_sai
--   (đang trả về 0 câu ĐS duyệt tại khối 7 nên bỏ không mất gì; câu ĐS gốc chưa dùng cho tự luyện
--   HS được vì UI HS chưa tối ưu cho ĐS 4 mệnh đề trên phone). Câu có form_tn đã duyệt (snapshot
--   sang loai_cau='trac_nghiem') vẫn dùng bình thường.
--
-- ẢNH HƯỞNG: CHỈ tu_luyen_sinh (client HS). KHÔNG đụng _btyeu_chon_cau / _kho_dk_online_sql.
-- MẤT GÌ: không mất data. Thay 1 function _kho_dk_online_hs_sql (create or replace).
-- ============================================================================

create or replace function public._kho_dk_online_hs_sql(p_cautbl text) returns text
language sql stable as $$
  select '((c.loai_cau = ''trac_nghiem'' and c.dap_an is not null)'
      || case when public._kho_form_tn_cua(p_cautbl) is null then ''
              else format(' or exists (select 1 from %I f where f.ma_cau = c.ma_cau and f.da_duyet and f.xoa_at is null)', public._kho_form_tn_cua(p_cautbl)) end
      || ')'
$$;
