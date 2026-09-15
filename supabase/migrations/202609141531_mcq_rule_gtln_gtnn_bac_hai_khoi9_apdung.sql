-- MCQ FORM — "GTLN-GTNN của biểu thức một biến bậc hai" (T109080101, khối 9, 33/33 câu) TÁI DÙNG NGUYÊN
-- `gtlnGtnnBacHai`/R204-207 của T108020105 (khối 8) — mở rộng hàm nhận thêm khuôn tích "(4-x)(x+2)" chưa
-- khai triển (dùng `phanTichDaThucCumNhanTu` thay `parseFactorAsPoly`), test tay 33/33 khớp, không rule mới.
update dai_mcq_rule set ap_dung = ap_dung || '{T109080101}'::text[]
where ma in ('R204', 'R205', 'R206', 'R207') and not ('T109080101' = any(ap_dung));
