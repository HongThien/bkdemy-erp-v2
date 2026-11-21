-- Lớp 6 (MCQ, Thùy 21/11): NDB00415 / NDB00416 — bổ sung rule nhiễu R524 sau mẫu mù (nhiễu R521/R523 cùng là tập con của đáp án ⇒ đáp án lộ thành phương án bao trùm).
-- R524 thay một cặp đúng bằng cặp có ước chung ⇒ phương án KHÔNG phải tập con cũng không phải tập cha của đáp án. Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R524', 'Tìm hai số theo ƯCLN: thay một cặp đúng bằng cặp có ước chung', 'Lập đúng phương trình cho a'', b'' nhưng chọn nhầm một cặp (a''; b'') có ước chung khác 1 vào chỗ cặp nguyên tố cùng nhau đúng.', 'ƯCLN = 4, BCNN = 144: a''·b'' = 36 → lấy (2; 18) thay vì (4; 9)', 'khai_niem', array['NDB00415', 'NDB00416'], false, true)
on conflict (ma) do nothing;
