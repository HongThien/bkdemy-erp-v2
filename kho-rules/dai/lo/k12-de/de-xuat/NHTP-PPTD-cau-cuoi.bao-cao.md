# NHTP + PPTD — gắn câu đề thi vào dạng (bản cuối) — 03/11

File: `NHTP-cau-cuoi.tsv` (1065 dòng), `PPTD-cau-cuoi.tsv` (**1086 dòng** = 1041 câu của chương + 45 câu nhận từ VT). Cột `id⇥dạng⇥ghi_chú`.
Tự kiểm: mỗi id đúng 1 dòng; số câu không Đ/S của chương khớp thống kê (NHTP 1065, PPTD 1041); không có câu kho rác; mọi mã NDB đều có trong thực đơn của chương.
Không đổi, không xoá, không gộp dạng nào. Câu Đ/S bỏ qua.

Cách gắn: nhãn bước 1 có mã NDB thì giữ nguyên (riêng NHTP: các câu Newton–Leibniz chuyển sang M1, xem dưới). Câu NEW/? thì: có trong `nghi_gan_nham` → dạng cũ ghi ở đó; mô tả nằm trong `moi` của M… → M…; nằm trong `bo_moi` → `CHUA`. Câu M… nào cũng đã đọc lại đề.

## NHTP — 1065 câu
- **M1 (Newton–Leibniz): 53 câu** = 7 câu NEW + **46 câu chuyển sang** (23 từ NDB00747, 16 từ NDB00751, 7 từ NDB00752).
  - ⚠ **Số câu chuyển là 46, không phải ~12 như lúc Thùy duyệt.** Con số ~12 lấy từ ghi chú bước 1. Đọc hết 231 câu của 3 dạng thì thấy 46 câu đúng định nghĩa M1: cho F hoặc giá trị F(a), F(b) rồi hỏi ∫f (kể cả có thêm phép cộng tuyến tính); cho f(a), f(b), đồ thị hoặc công thức f rồi hỏi ∫f′; hỏi mệnh đề ∫ₐᵇf = F(b)−F(a); cho ∫f và F(a) rồi hỏi F(b). Nếu chỉ chuyển 12 câu thì câu cùng kiểu vẫn nằm ở 4 chỗ, trái với lý do Thùy chọn phương án này. Mỗi câu chuyển có ghi chú `chuyển M1 … từ NDB…` nên lọc ra rồi trả về chỗ cũ được ngay. **Cần Thùy xác nhận.**
  - Để nguyên chỗ cũ: các câu "∫f′dx = f + C" (đây là nguyên hàm, không phải tích phân); T1120000006796 (lẫn nhiều tính chất); T1120000006830 (đề ghi ∫f mà hỏi f(4), dữ liệu lỗi).
- Dạng cũ nhận câu NEW (13 câu): NDB00787 +8, NDB00778 +2, NDB00788 +1, NDB00782 +1, NDB00636 +1.
- Số câu mỗi dạng sau khi gắn: NDB00747 58 · 00751 39 · 00752 88; các dạng khác giữ như thống kê, cộng thêm phần nhận ở dòng trên.
- **CHUA: 6** (bo_moi): giá trị trung bình ×2, ∫f bằng hằng số ×1, hàm ngược ×1, ∫√(a²−x²) ×2.
- Dạng cũ 0 câu: không có (NDB00757, 00761, 00639, 00786 mỗi dạng còn 1 câu).

## PPTD — 1062 dòng
- Dạng mới: M1 15 · M2 3 · M3 5 · M4 8 · M5 5 · M6 7 · M7 3 = **46 câu** (đều là NEW, không chuyển câu cũ nào).
- Dạng cũ nhận câu NEW (31 câu, theo `nghi_gan_nham`): NDB00881 +5, NDB00846 +4, NDB00851 +3, NDB00856 +3, NDB00868 +3, NDB00878 +2, NDB00877 +2, NDB00860 +2, NDB00867 +2, NDB00857 +2, NDB00853 +1, NDB00872 +1, NDB00844 +1.
- **CHUA: 22** (bo_moi): quỹ đạo bóng ×6, mặt cầu tâm thuộc đường/mặt qua 2 điểm ×3, chiếu xuyên tâm ×2, đường tròn trong không gian ×2, mặt cầu chứa đường tròn hoặc tứ diện đều ×2, các bài thực tế lẻ ×5, T112070311048 (nghiêng chương VT) và T1120000004463 (**dữ liệu hỏng**: nội dung là câu Hàm số).
- **CẬP NHẬT (sau khi có `VT-cau-cuoi.tsv`, 46 câu `CHUONG:PPTD`): nhận 45 câu, tổng file = 1041 + 45 = 1086 dòng** (đã tự kiểm: không trùng id, đủ 3 cột). Gắn như sau:
  - NDB00878 16 · NDB00856 5 (danh sách ở dưới) · NDB00835 +4 (T3120000001079, T312000000972, T3120000001098, T112000000479) · NDB00849 +1 (T3120000001103) · NDB00857 +1 (T312000000130) · NDB00859 +1 (T112000000454) · **M5 +4** (T312000000560, T312000000119, T312000000650, T312000000349: M trên mặt cầu, cực trị ΣkMA² hoặc |Σ vectơ|) · **M3 +1** (T312000000074) · **M7 +1** (T312010403001).
  - **CHUA 11**: 7 câu ghi ở dưới (VT đã chuyển hết sang PPTD nên chuyển thành CHUA ở đây) + T312000000819 (quỹ tích là mặt cầu, tìm tâm) + T312010107080, T312000000148 (M thuộc mặt phẳng, cực trị ΣkMA²: chưa có dạng) + T312000000105.
  - **T312000000676 (viên đạn): KHÔNG nhận, trả VT C4.3.1.** Lý do: chỉ thế t = 3 vào phương trình tham số để lấy toạ độ, không dùng phương pháp PPTD nào.
  - Số mới của PPTD: CHUA 33 · M1 15 · M2 3 · M3 6 · M4 8 · M5 9 · M6 7 · M7 4 · NDB00835 104 · NDB00849 28 · NDB00857 32 · NDB00859 28.
  - Gợi ý cho đợt sau (chưa làm): "M thuộc mặt phẳng hoặc mặt cầu, cực trị ΣkMA²" (tâm tỉ cự) có 2 câu trên mặt phẳng đang CHUA. Nếu đề tăng thì xét một dạng trong nhóm Cực trị.
- (Bản đầu, trước khi có báo cáo VT) **Nhận từ VT: 21 câu.** Dùng `VT-thucte-phanloai.tsv` (28 câu nhãn PPTD?/GPS), đọc từng câu:
  - NDB00878 (đường thẳng cắt mặt cầu: radar, hải đăng, flycam) **16**: T312000000630, T312010706004, T312000000433, T312010802042, T312000000911, T312000000597, T312010802047, T312010802026, T312010705013, T312010802037, T3120000001074, T312000000685, T312010802048, T312010802063, T312000000360, T312010802043.
  - NDB00856 (GPS: điểm biết khoảng cách tới 4 điểm) **5**: T3120000001144, T312000000492, T312000000623, T312000000856, T312000000240.
  - **Không nhận, để VT quyết (7 câu, chưa chắc tới 90%):** T312010802024 (radar gắn trên máy bay đang bay, chuyển động tương đối) · T312000000481 (hai mặt phẳng trung trực, mặt cầu, thời gian) · T312000000150 (góc phụ nhau, quỹ tích không phải đường tròn) · T312010802025, T312010802033 (tường chắn sóng, vùng bóng) · T312010802038 (tấm chắn, có thêm tích phân vận tốc) · T312000000153 (lều, chiếu sáng xuyên tâm). Bảy câu này không có dòng nào trong PPTD; nếu bên VT cũng loại ra thì cả 7 sẽ không thuộc dạng nào.
  - Khi `VT-cau-cuoi.bao-cao.md` xong, cần đối chiếu: câu nào bên VT vẫn giữ thì phải bỏ ở một bên, tránh một câu nằm ở cả hai chương.
- Dạng cũ 0 câu (chỉ báo, không đề xuất xoá): **NDB00864** Khoảng cách giữa đường thẳng và mặt phẳng · **NDB00875** Viết phương trình mặt phẳng khi biết thiết diện cắt mặt cầu.
- Tăng mạnh: NDB00878 từ 3 lên 21 câu, NDB00856 từ 4 lên 12 câu (do bài thực tế và câu nhận từ VT).
