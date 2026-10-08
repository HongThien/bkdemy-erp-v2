-- ============================================================================
-- diem_thi_nguon_mac_dinh_tay
-- ----------------------------------------------------------------------------
-- VÌ SAO: mig 202610081051 để diem_thi.nguon mặc định 'cau'. Bản app ĐANG CHẠY THẬT (chưa deploy) vẫn có màn
-- nhập điểm MT tay (theo tháng / 🔢 ở buổi học) ghi diem_thi KHÔNG kèm nguon ⇒ dòng mới thành 'cau' ⇒ trigger
-- _mt_dong_bo_diem_thi coi là điểm tự tính và có thể XOÁ số khi HS còn thiếu điểm câu = mất điểm nhập tay.
-- Đảo mặc định: dòng nào không nói nguồn = 'tay' (được bảo vệ). Đường mới (_mt_dong_bo_diem_thi, fn_mt_luu_tong)
-- đều ghi nguon='cau' TƯỜNG MINH nên không đổi hành vi. Kèm: dòng 'cau' do màn cũ tạo trong khoảng mig trước
-- → mig này (có CB/NC mà HS chưa đủ điểm câu) ⇒ chuyển 'tay'.
-- MẤT GÌ: không.
-- ============================================================================
alter table diem_thi alter column nguon set default 'tay';

update diem_thi d set nguon = 'tay'
  from ky_thi k
 where k.id = d.ky_thi_id and k.loai = 'mt_sat_hach' and d.nguon = 'cau'
   and (d.diem_co_ban is not null or d.diem_nang_cao is not null)
   and exists (select 1 from gami_session_problems s
                left join gami_grades g on g.problem_id = s.id and g.hoc_sinh_id = d.hoc_sinh_id
               where s.buoi_hoc_id = k.buoi_hoc_id and s.phase = 'mt' and not s.ngoai_de and g.diem_dat is null);
