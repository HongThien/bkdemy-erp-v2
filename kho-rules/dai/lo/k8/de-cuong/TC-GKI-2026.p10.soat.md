KẾT LUẬN: ĐẠT

# TC-GKI-2026 — Phần 10 — Biên bản soát (Opus, nhân chứng thứ hai)

- **Số câu:** 7 (Hình Bài 10, 11, 12 · Khác Bài 1, 2, 3, 4) — 1 trả lời ngắn (Khác Bài 2 = 64) · 6 tự luận.
- **Khớp Pha 1 ngay từ đầu:** 7/7 đáp số / hướng chứng minh (Pha 1: `TC-GKI-2026.p10.kiem.md`, toạ độ số 2 bộ / bài hình; Khác Bài 2, 3, 4 tính lại bằng máy).
- **Số câu phải sửa:** 1 (chỉ hình giải; nội dung `p10.soan.md` KHÔNG đổi — `p10.soan.goc.md` giống hệt).
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng.

## Đã soát

- **Đề** chép đúng ảnh `t-5.png`, `t-6.png` (+ `de_bai_c1.png`, `de_bai_c2.png`) ở cả 7 câu. Ghi chú Hình Bài 10 ($ABCD$ in sai, đúng $ABDC$) đúng — giữ.
- **Luật kiến thức:** không câu nào dùng đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác, kể cả ngầm.
  Bài 10c, 11b–c dùng trọng tâm (lớp 7). Bài 12a đi qua tổng góc $360^\circ$ (không dùng "ba góc vuông"), $DE=AM=\dfrac{1}{2}BC$ bằng trung tuyến ứng cạnh huyền (được dùng);
  12b: $E$ trung điểm $AC$ qua $\triangle MAC$ cân, rồi $\triangle DMP=\triangle ECQ$ (c.g.c) + góc đồng vị — đã kiểm hướng tia (góc đồng vị đúng vị trí, $D$, $E$ cùng phía $BC$); 12c chứng minh hai chiều, không dùng Pythagore.
  Khác Bài 3, 4 chỉ Chương I (nhân đa thức, chuyển vế; mẫu $10$, $5$ là số — không phải phân thức).
- **Phần 1:** mỗi câu 3–5 bước nghĩ thật, không lộ đáp số cuối; bài hình chứng minh viết theo chiều "muốn … cần …", Phần 2 đi ngược khớp từng mắt xích.
- **Phân loại:** đúng (Khác Bài 2 = `64` ≤ 4 kí tự; các câu khác nhiều ý / biểu thức / chứng minh ⇒ `tu_luan`).
- **Hình giải:** `giai_hinh10.png` (đúng $AB<AC$, đủ $A,B,C,D,E,M,K$), `giai_hinh11.png` (tam giác nhọn, đủ 10 điểm), `giai_hinh12.png` (vẽ $AB\ne AC$, không lộ ý c) — đúng dữ kiện, nhãn không đè.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Hình Bài 12 | hình | `ve_p10.mjs`: bỏ hai dấu "x" (đánh $MB=MC$) nằm chồng trong đoạn $BP$ và $QC$; đánh cả bốn đoạn $BP=PM=MQ=QC$ cùng kiểu hai gạch; vẽ lại `giai_hinh12.png`, đã mở kiểm | Đoạn $BP$ mang cả "x" lẫn hai gạch, $QC$ mang cả "x" lẫn ba gạch ⇒ đọc rối; bốn đoạn bằng nhau suy thẳng từ giả thiết ($M$, $P$, $Q$ trung điểm), không phải điều phải chứng minh |

## Câu còn Chưa chắc (gửi CEO)

- **Hình Bài 12** — giữ cờ của trạm soạn: dữ kiện đúng kiểu bài đường trung bình ($DP$, $EQ$ là đường trung bình của $\triangle ABM$, $\triangle ACM$); lời giải tự chứng minh bằng tam giác cân + tam giác bằng nhau c.g.c, đã soát đúng và trong phạm vi.
  Đây là câu hỏi CHÍNH SÁCH (có cho đề cương Thành Công dùng đường trung bình không — cùng câu hỏi với 5 đề GKI Hà Nội, LTV, ĐTĐ), không phải nghi ngờ đáp số. Đáp số ý c ($\triangle ABC$ vuông cân tại $A$) đã kiểm bằng toạ độ: đúng.
