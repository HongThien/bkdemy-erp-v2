-- Lớp 5 (MCQ lô 4): NDB02093 đọc hỗn số chỉ có R401/R402 (cần ≥3 rule). Chỉ INSERT.
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong, active) values
 ('R424', 'Hỗn số/phân số: đọc nhầm tên mẫu số (lệch bậc 10 lần)', 'Đọc đúng phần nguyên và tử số nhưng đọc mẫu số sai bậc (phần mười ↔ phần trăm ↔ phần nghìn).', '12 7/10 đọc "mười hai và bảy phần trăm"', 'khai_niem', array['NDB02093', 'NDB02090']::text[], false, true)
on conflict (ma) do nothing;
