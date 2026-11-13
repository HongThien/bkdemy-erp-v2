-- Lớp 6 (MCQ vòng cuối): NDB00379–00381 "tìm số tự nhiên x để A chia hết cho x − k". Mã R517–R518 (luồng lớp 6). Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R517', 'Tìm x để A ⋮ (x − k): liệt kê các ước của A mà quên cộng k', 'Tìm đúng các ước d của A (x − k = d) nhưng viết luôn d làm đáp số x, quên chuyển vế x = d + k.', '12 ⋮ x − 1: ước của 12 là 1; 2; 3; 4; 6; 12 → trả lời x = 1; 2; 3; 4; 6; 12', 'khai_niem', array['NDB00379', 'NDB00380', 'NDB00381']::text[], false, true),
 ('R518', 'Tìm x để A ⋮ (x − k): trừ k thay vì cộng k', 'Chuyển vế sai dấu: x = d − k thay vì x = d + k (giữ lại các giá trị tự nhiên).', '12 ⋮ x − 1: ước 6 → x = 5 (đúng 7)', 'khai_niem', array['NDB00379', 'NDB00380', 'NDB00381']::text[], false, true)
on conflict (ma) do nothing;
