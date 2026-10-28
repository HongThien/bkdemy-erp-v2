KẾT LUẬN: ĐẠT

# TX-GKI-2026 — Phần 4 — Biên bản soát (trạm soát Opus, 24/10)

- **Số câu:** 9 (Dạng 3 Bài 3f, 3g, 3h, 3i · Hình Bài 1–5), đều `tu_luan`; kho giữ nguyên (4 `dai` + 5 `hinh_hoc`), không tách / gộp / đổi nhãn.
- **Khớp Pha 1 ngay từ đầu:** 9/9 (3f $x=-2$ · 3g $\pm1$ · 3h $0;1$ · 3i $-4;-2;1;3$ · Hình 3c "vuông cân tại $M$" · mọi hướng chứng minh Hình 1–5 trùng hướng Pha 1).
- **Số câu phải sửa:** 5 = 2 lời Phần 1 (3f, Hình 3) + 3 hình giải (Hình 1, 2, 5). Không đổi đáp số, không đổi lập luận Phần 2.
- **Đề:** đối chiếu ảnh `t-3.png`, `t-4.png`; phóng to 3f–3i ở 400 dpi (`<LV>\z\soat_p4_fi-3.png`): khoảng trống mất ngoặc khớp đúng bản khôi phục $(2-x)^2-2(x-2)(x+1)+(x+1)^2-3x-5=10$ và $(x^2+x)^2-14(x^2+x)+24=0$ (số mũ 2 nằm ngoài chỗ ngoặc). Năm bài hình chép đúng chữ, tên điểm, đủ ý.
- **Kiến thức:** không đường trung bình (2b đi qua tam giác cân $IHC$ từ đường chéo hình chữ nhật; 1c qua trọng tâm $\triangle AHC$; 4c, 5b qua hai hình bình hành + tiên đề Euclid); hình chữ nhật đi qua tổng góc 360° + định nghĩa (không "ba góc vuông"); 3c dùng dấu hiệu "HCN có đường chéo là phân giác" (có trong KNTT); Đại dùng hằng đẳng thức, đặt nhân tử chung, đặt ẩn phụ, hoàn thành bình phương, tách hạng tử (thuộc bài Phân tích nhân tử, TX có đủ Chương II). Không Thalès / Pythagore / công thức nghiệm.
- **Máy kiểm:** `<LV>\tam\soat_p4_kiem.mjs` — nghiệm 3f–3i vét lưới; Hình 1–5 toạ độ số 3 bộ tam giác (song song, góc bằng nhau, $AK/AD=3{,}000000$, thẳng hàng, $MH=IK$, hình bình hành).
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (9 câu · 9 tự luận · chưa chắc 0).

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Dạng 3 Bài 3f | định dạng (Phần 1) | Bước 1 "Đọc đề theo từng cụm…" ⇒ "Nhận ra ba hạng tử đầu … cùng xoay quanh hai biểu thức $x-2$ và $x+1$…" | Brief cấm bước "Đọc kĩ đề"; nội dung giữ, đổi thành bước nhận diện thật |
| Hình Bài 3 | định dạng (Phần 1 lộ đáp số) | Bước 5 bỏ "tam giác $MNP$ cân tại $M$" ⇒ "nếu hai cạnh góc vuông có quan hệ vừa tìm thì đường cao $MH$ cũng là phân giác…" | Bước 4 đã giấu quan hệ $MN=MP$, Bước 5 lại nói thẳng kết luận ý c |
| Hình Bài 1 | hình | Nhãn $O$ chuyển sang trái điểm (`label(O,'O',-20,9)`) | Nhãn cũ bị đường $OC$ cắt ngang |
| Hình Bài 2 | hình | Nhãn $I$ chuyển sang trái điểm; bỏ gạch $AB=AC$ | Nhãn cũ bị đường $IC$ cắt ngang; gạch đơn trên $AC$ rơi vào đoạn $AI$ đang mang dấu kép $AI=IC$ ⇒ một đoạn hai dấu, đọc nhầm (cân tại $A$ vẫn ở đề) |
| Hình Bài 5 | hình | Nhãn $P$ hạ thấp (`label(Pp,'P',-16,27)`) | Đỉnh chữ $P$ chạm đường $KP$ |

Hình vẽ lại bằng bản soát `<LV>\tam\ve_p4_soat.mjs` (bản gốc `ve_p4.mjs` giữ nguyên), mở lại cả 5 ảnh kiểm: đủ điểm mọi ý, tên điểm đúng chỗ, $AB<AC$ đúng ở Bài 1, 5, chỉ đánh dấu giả thiết (góc vuông, trung điểm), không đánh dấu điều phải chứng minh, không nhãn đè nét. Các đoạn nối nằm trên kết luận thẳng hàng ($BEM$, $NAM$, $QAK$) là cạnh / đường chéo của hình bình hành dùng trong lời giải — giữ.
Cũng sửa mục "GHI CHÚ CHO NGƯỜI DUYỆT": bỏ câu nói về lệnh giao bị cắt, thêm dòng ghi việc vẽ lại hình.

**Câu còn `Chưa chắc`:** không có. **Câu "Đề sai":** không có (3f, 3i là scan mất ngoặc, đã khôi phục và kiểm ảnh phóng to — không phải đề sai).
