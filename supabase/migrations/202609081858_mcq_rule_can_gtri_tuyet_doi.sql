-- MCQ FORM — POOL 2A: mở rộng scripts/mcq-auto.mjs với nút AST √ (căn bậc hai) và |…| (giá trị tuyệt đối)
-- (khảo sát 08/09 tiếp, spec-mcq-form.md — 4 dạng "Số thực" khối 7: Thực hiện phép tính/Tìm x liên quan
-- Căn bậc hai/GTTĐ, 260 câu, engine sinh ra 232 câu OK). 4 rule lỗi mới cho 2 phép toán này.
--
-- LƯU Ý ĐÁNH SỐ: spec-mcq-form.md §4 từng ghi "chỗ CEO bổ sung form tính toán thật trong đề thi: thêm
-- dòng R28+" — dành riêng R28+ cho CEO. Tại thời điểm viết migration này DB CHƯA có row nào từ R28 trở
-- đi (kiểm tay). Nếu CEO đã/sẽ thêm rule khác vào đúng mã này ở nơi khác thì đổi số ở migration MỚI —
-- không sửa file này (lịch sử migration bất biến, CLAUDE.md §2.1).
insert into dai_mcq_rule (ma, ten, mo_ta, vi_du, nhom, ap_dung, du_phong) values
('R28','Chia đôi thay vì khai căn','Coi √a = a:2 (khi tính) hoặc bình phương sai thành nhân đôi (khi tìm x qua căn) — không hiểu phép khai căn là gì','$\sqrt{64}=64:2=32$ (đúng: 8)','khai_niem','{07702202202,077022022203}',false),
('R29','Quên khai căn','Bỏ qua dấu căn, giữ nguyên số dưới căn làm đáp số','$\sqrt{81}=81$ (đúng: 9)','khai_niem','{07702202202}',false),
('R30','Bỏ dấu GTTĐ giữ nguyên âm','$|a|=a$ kể cả khi a âm — không đổi dấu, mất hẳn ý nghĩa "khoảng cách tới 0"','$|-\dfrac{2}{7}|=-\dfrac{2}{7}$ (đúng: $\dfrac{2}{7}$)','khai_niem','{07702220320302}',false),
('R31','GTTĐ chỉ lấy nghiệm âm','Giải $|x|=k$ ra $x=-k$, đổi dấu cả biểu thức thay vì tách 2 trường hợp — chiều ngược của R21 (thiếu nghiệm dương)','$|x|=\dfrac{3}{4}\Rightarrow x=-\dfrac{3}{4}$ (thiếu $x=\dfrac{3}{4}$)','khai_niem','{07702220320320303}',false)
on conflict (ma) do update set ten = excluded.ten, mo_ta = excluded.mo_ta, vi_du = excluded.vi_du,
  nhom = excluded.nhom, ap_dung = excluded.ap_dung, du_phong = excluded.du_phong;
