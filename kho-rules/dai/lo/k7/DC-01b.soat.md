KẾT LUẬN: ĐẠT

# DC-01b — biên bản SOÁT (Opus, 11/10)

Nguồn: đề cương ôn tập GKI Toán 7 THCS Ngôi Sao Hoàng Mai (MathCare) — phần của tệp b: Bài 1–6 (trang 3/7–4/7, tách ý) và Bài 16–20 (trang 7/7).
Bản gốc trước khi sửa: `DC-01b.soan.goc.md`. Giải mù: `DC-01b.kiem.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (45 câu · 11 TLN · 34 tự luận · chưa chắc 7).

- Số câu: **45** (Bài 1a–h, 2a–h, 3a–f, 4a–d, 5a–f, 6a–f, 16a, 16b, 17a, 17b, 18, 19, 20).
- Khớp đáp án Pha 1 ngay từ đầu: **45/45** (Bài 19 = 323301 và Bài 20 = 17575 thêm máy đếm trực tiếp; Bài 19 máy kiểm $\sqrt{n(n+1)(n+2)(n+3)+1}=n^2+3n+1$ cho cả 97 số hạng).
- Chép đề: đúng ảnh ở cả 45 câu (đã phóng 400 dpi Bài 3c–f, Bài 4, Bài 16, 18, 20: chu kì $1,2(4)$, $1,(4)$, $1,1(6)$, $0,2(7)$; $\sqrt{9^2}$, $\sqrt{6^2}$; $44100$; căn lồng 16b là tích, không có dấu cộng).
- Phân loại: đúng (tách ý đúng luật — Bài 1–6 là Tính / Tìm $x$; TLN chỉ ở đáp số số nguyên hoặc $0,75$; $x=1,125$ ở 6e quá 4 ô nên tự luận — đúng).
- Số câu phải sửa: **5** (không câu nào sai đáp số / sai toán).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2d | định dạng (ghi chú) | Xoá dòng `**Ghi chú:**` "đề gốc dùng dấu ×…" | Không phải lỗi của đề gốc, chỉ là quy ước chép; mục GHI CHÚ CHO NGƯỜI DUYỆT đã nêu chung |
| Bài 4c | ghi chú thừa | Xoá dòng `Chưa chắc` về quy luật dãy, xoá gạch đầu dòng tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Quy luật xác định chắc: $4,36,144,400=(1.2)^2,(2.3)^2,(3.4)^2,(4.5)^2$ và số cuối $44100=(14.15)^2$ khớp đúng; giải mù cùng kết quả $\dfrac{14}{15}$ |
| Bài 16b | ghi chú thừa | Rút `Chưa chắc` còn phần kĩ thuật (phản chứng, truy hồi, "căn số không chính phương vô tỉ"); bỏ phần nghi cách đọc đề | Phóng 400 dpi: $\sqrt{1\sqrt{2\sqrt{3\dots\sqrt{99}}}}$ viết liền = tích, không có hai cách hiểu |
| Bài 19 | trình bày / kiến thức | Viết lại Phần 2 bỏ kí hiệu $\sum$: đặt $T=2.3+3.4+\dots+98.99$, $3T$ triệt tiêu; Chưa chắc đổi chữ tương ứng | HS lớp 7 chưa học kí hiệu $\sum$; toán và đáp số giữ nguyên |
| Bài 20 | trình bày / kiến thức | Viết lại Phần 2 bỏ kí hiệu $\sum$: đặt $P=1.2+\dots+29.30$, $3P=29.30.31$; thêm dòng tính $1+\dots+29=435$; Chưa chắc đổi chữ tương ứng | Như trên |

## Câu còn `Chưa chắc` (gửi CEO)

Cả 7 câu đều ĐÚNG đáp số và lập luận chặt (đã kiểm từng dòng); `Chưa chắc` giữ lại chỉ vì dùng kĩ thuật ngoài lý thuyết lớp 7 — CEO quyết giữ hay loại.

- **Bài 16a** — phản chứng + dãy căn truy hồi + "căn của số nguyên dương không chính phương là số vô tỉ".
- **Bài 16b** — như 16a (truy hồi dạng tích $b_k=\sqrt{k.b_{k+1}}$).
- **Bài 17a** — phản chứng "giả sử $y\ne0$ thì $\sqrt3$ hữu tỉ".
- **Bài 17b** — như 17a, sau khi chuyển vế về $2x-1=(5-y)\sqrt3$.
- **Bài 18** — tách $A=1+\dfrac{3}{\sqrt x-2}$, "$\sqrt x$ hữu tỉ ⇒ $x$ chính phương", ước nguyên âm của 3.
- **Bài 19** — biến đổi $n(n+1)(n+2)(n+3)+1=(n^2+3n+1)^2$ (nhân đa thức, bình phương một tổng — lớp 8) + tổng $2.3+\dots+98.99$ bằng triệt tiêu.
- **Bài 20** — khái niệm phân nguyên (đề tự định nghĩa) + đếm theo khoảng giữa hai số chính phương + tổng $1.2+\dots+29.30$ bằng triệt tiêu.

## ẢNH CHO CEO

| Câu | Ảnh (tên tệp) | Trang trong PDF gốc (đề cương, số trang in) | Vấn đề |
|---|---|---|---|
| Bài 16a | `can-xem/DC-01_Bai16a.png` | 7/7 | Lời giải dùng phản chứng + "căn số không chính phương là vô tỉ" (ngoài lý thuyết lớp 7) — giữ hay loại câu? |
| Bài 16b | `can-xem/DC-01_Bai16b.png` | 7/7 | Cùng kĩ thuật như 16a — giữ hay loại câu? |
| Bài 17a | `can-xem/DC-01_Bai17a.png` | 7/7 | Lời giải dùng phản chứng với $\sqrt3$ vô tỉ, bản đồ lớp 7 chưa có mẫu — giữ hay loại? |
| Bài 17b | `can-xem/DC-01_Bai17b.png` (cả Bài 17, vì lời dẫn chung) | 7/7 | Cùng kĩ thuật như 17a — giữ hay loại? |
| Bài 18 | `can-xem/DC-01_Bai18.png` | 7/7 | Cần "$\sqrt x$ hữu tỉ ⇒ $x$ chính phương" và ước âm của 3 (ngoài lớp 7) — giữ hay loại? |
| Bài 19 | `can-xem/DC-01_Bai19.png` | 7/7 | Cần bình phương một tổng (hằng đẳng thức lớp 8) để khai căn từng số hạng — giữ hay loại? |
| Bài 20 | `can-xem/DC-01_Bai20.png` | 7/7 | Khái niệm phân nguyên + tổng triệt tiêu (nâng cao, ngoài lý thuyết lớp 7) — giữ hay loại? |
