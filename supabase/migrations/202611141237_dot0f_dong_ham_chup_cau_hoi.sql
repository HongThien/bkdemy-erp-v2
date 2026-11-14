-- Đợt 0f (K14 / K1) — đóng hàm chụp câu hỏi với người đăng nhập thường. Thùy 14/11 ("tiếp đi" cho hai mục quyền còn dở).
-- _kho_snapshot_cau(bài test, bảng câu, bảng lý thuyết, mã câu, thứ tự, mã cụm) là hàm security definer GHI câu (kèm đáp án) vào một bài test bất kỳ.
-- Trước: mọi người đăng nhập (kể cả HS) gọi thẳng API được ⇒ chép câu + đáp án của kho vào bài test rồi đọc ra.
-- Đo 14/11: 14 hàm gọi nó đều là security definer do claude_build sở hữu (chạy bằng quyền chủ ⇒ không cần quyền của người gọi);
-- client không gọi; thống kê câu lệnh: 0 lượt gọi thẳng qua API từ trước tới nay ⇒ thu quyền không ảnh hưởng luồng nào.
-- (Bù cho _mastery_lan_cap_t vừa thêm ở mig 202611141211: tổng "hàm nội bộ client gọi được" giữ nguyên 319.)
revoke execute on function public._kho_snapshot_cau(uuid, text, text, text, integer, text) from public, anon, authenticated;
