KẾT LUẬN: ĐẠT

# Soát nbv-b2-b (NBV — Giới hạn hàm số, phần B tự luận)

- Số câu: 78 (tất cả `luyen`, `tu_luan`, `dap_an` "—"); 0 giảng, 0 Đ/S, 0 chưa dạng.
- Lệch đáp số so với Pha 1 (giải mù, tính bằng node): **trước 0 / sau 0**. Mọi kết luận cuối khớp bản giải mù và `sach_dap_so`.
- `kiem.mjs`: ✔ đạt. Bản gốc trạm soạn: `nbv-b2-b.goc.json`.

## Xác nhận các điểm trạm soạn nêu
- **Câu 28, 29 bỏ: đúng.** Nguồn: "Quan sát đồ thị hàm số ở Hình 1/Hình 2…" — chỉ đọc được từ hình, không có công thức.
- **Câu 47, 48 giữ: đúng.** Đề đủ chữ (toạ độ M, A, parabol), giải thuần toạ độ; đã tính lại: 47 → $HK/HA=(1+t)/t\to 2$; 48 → $N\to(0;\tfrac12)$.
- **Không lệch sách:** đúng (0 câu).
- **Lỗi in lời giải sách 10a, 23b, 34b:** chỉ ở lời giải sách; lời giải soạn của cả ba đã đúng từng dòng (đã đọc), ghi chú giữ nguyên.
- **Câu 45 gán NDB01185:** giữ. Phép tính bên trong là 0/0 phân tích nhân tử (NDB01171), nhưng bài là mô hình thực tế hỏi ý nghĩa ⇒ hợp cả hai, dạng sau thắng ⇒ 01185. Đã ghi lý do vào `dang_bai_ly_do`.
- **Câu f(x) chưa cho công thức xếp "vừa" (2, 3, 7, 9, 11, 12, 21):** hợp lý — bản đồ thiếu dạng "giới hạn của hàm chưa cho công thức (dùng quy tắc)". Đã ghi rõ "bản đồ thiếu" vào `dang_bai_ly_do` từng câu.
- **Phần 1 khuôn máy: xác nhận đúng là vấn đề.** Bản soạn chỉ có ~16 mẫu Phần 1 dùng chung theo dạng (vd 14 câu 0/0 cùng một chữ), không lộ đáp số nhưng không phải bước nghĩ của từng câu; vài chỗ sai ngữ cảnh: 33/34a/35a nói "tử và mẫu" cho đa thức; 35c "chia cả tử và mẫu" khi không có phân thức; 5a "mẫu khác 0, căn không âm" cho đa thức; 39/40 không nhắc bước tìm tham số / xét $m=0$; 30 "xét dấu từ mỗi phía" khi $(x-1)^2>0$ cả hai phía; 13 nói nhân liên hợp nhưng Phần 2 phân tích $x-4$. ⇒ **Viết lại Phần 1 cho 77/78 câu** (giữ câu 25 vì đã riêng), mỗi câu nêu đúng biểu thức, nhân tử, liên hợp, phía, tham số của câu đó; không nêu đáp số cuối. Sau sửa: 78/78 Phần 1 khác nhau.

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| 1 | dạng | NDB01168 → **NDB01171** (vua): đề KHÔNG ghi "dùng định nghĩa"; rút gọn nhân tử là một cách giải 0/0, dạng sau thắng. Phần 2 viết lại theo rút gọn nhân tử (sách giải bằng dãy). |
| 30 | dạng + lời giải | NDB01182 → **NDB01184** (cao): ví dụ của 01184 đúng khuôn $\frac{x-4}{(x-1)^2}$, dạng sau thắng. Phần 2 viết lại theo quy tắc tích $f(x)\cdot\frac1{(x-1)^2}$. |
| 45 | dạng (xét lại) | giữ NDB01185, bổ sung lý do (dạng sau thắng so với 01171). |
| 2, 3, 7, 9, 11, 12, 21 | dạng (ly_do) | giữ dạng + "vua", ghi "bản đồ thiếu dạng hàm trừu tượng". |
| 77 câu (trừ 25) | lời giải — Phần 1 | viết lại Phần 1 riêng từng câu (Mấu chốt + 3–5 bước), không lộ đáp số. |

Không có lỗi đáp số, đề (đã so từng ý với nguồn: số, dấu, mũ, cận), tách ý, phạm vi (không L'Hôpital/đạo hàm; câu 25 dùng kẹp dãy $0\le f(x_n)\le 1/x_n^2$ như sách), `kiem` (đều tính lại từ đề, không tautology; câu hàm trừu tượng dùng hàm mẫu thoả giả thiết).

## Còn nghi — cần CEO
1. **Câu 1** (`NDB01168` vs `NDB01171`): sách đặt câu này trong mục định nghĩa và giải bằng dãy; ví dụ của 01168 trong bản đồ chính là bài này *có* chữ "Dùng định nghĩa". Đề NBV không có chữ đó ⇒ tôi theo luật dạng sau thắng chuyển sang 01171. Nếu Thùy muốn giữ ý đồ sách (luyện định nghĩa) thì trả về 01168 + lời giải dãy trong `nbv-b2-b.goc.json`.
2. **Bản đồ thiếu dạng "giới hạn của hàm chưa cho công thức"** (7 câu: 2, 3, 7, 9, 11, 12, 21) — đang tạm ở 01169 / 01174 / 01178 mức "vua".
