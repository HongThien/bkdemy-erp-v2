-- ============================================================================
-- 202611051713 — bdm_k5_nhom_hinh_ghep
-- ----------------------------------------------------------------------------
-- VÌ SAO: Thùy 05/11 chọn "Nhóm riêng Hình ghép" cho dạng NDB02152 "Tính diện tích các hình kì dị bằng phương pháp chia hình" (18 câu hình
--   ghép) — dạng còn lại một mình ở nhóm "Hình học phẳng" (NNB01901) sau khi tách 4 nhóm ở mig 202611051711.
-- LÀM: đổi TÊN nhóm NNB01901 thành "Hình ghép (chia hình)", mã nhóm giữ nguyên (mã gốc bất biến), dạng bài ở yên.
-- MẤT GÌ (Luật xoá): Không xoá gì — chỉ đổi tên 1 nhóm (trigger log ghi vết).
-- ============================================================================
update dai_bdm_nhom set ten = 'Hình ghép (chia hình)' where id = 'NNB01901' and ten = 'Hình học phẳng';
do $$ begin
  if (select ten from dai_bdm_nhom where id = 'NNB01901') <> 'Hình ghép (chia hình)' then raise exception 'Đổi tên nhóm NNB01901 không thành'; end if;
end $$;
