KẾT LUẬN: ĐẠT

# DTK8-GKI-2026 — Phần 7 (Dạng 5 nâng cao, Bài 26–29) — biên bản soát (Opus)

- Số câu: **4** (1 TLN · 3 tự luận) · khớp Pha 1 ngay từ đầu: **4/4** (Bài 26: 196, 803, 914 — vét cạn độc lập ra đúng 3 số, bỏ 9 số ba chữ số giống nhau · Bài 27: 30 · Bài 28, 29: đồng nhất thức đúng, BigInt 50 bộ) · phải sửa: **4 câu**, không đổi đáp số / loại câu nào.
- Đề: đối chiếu ảnh t-5 (tr. 34) + phóng to 260 dpi (`z\soat_p7_b26_29-5.png`) — khớp từng chữ, số, dấu cả 4 câu.
- Kiến thức (phạm vi DTK8: chỉ Chương I; Dạng 5 được nhân trực tiếp / thay $a+b=-c$): Bài 26 dùng chia hết lớp 6 + đặt thừa số chung · Bài 27 chỉ thay số + trừ vế theo vế (không Bézout / Vi-ét) · Bài 28 nhân đa thức trực tiếp · Bài 29 thay $a+b=-c$. Không gọi tên hằng đẳng thức sau khi sửa.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 29 | lập luận (Phần 1) | Bước 2: "nhân hai số đối được số dương nên dấu trừ biến mất" ⇒ "tích $(-c)(-b)$ có hai dấu trừ nên bằng $bc$" | Câu cũ sai toán: $(-c)(-b)=bc$ không nhất thiết dương ($b$, $c$ là số bất kì) |
| Bài 28 | kiến thức (Phần 1) | Chú ý bỏ "chưa cần hằng đẳng thức hay phân tích nhân tử", thay bằng nhắc đổi dấu với $-a$ và các cặp triệt tiêu | DTK8 chỉ Chương I — không gọi tên hằng đẳng thức / phân tích nhân tử trước học sinh |
| Bài 28 | định dạng (Phần 2) | Thêm dòng khai triển tường minh $a(b+c-a)+b(b+c-a)+c(b+c-a)$ trước dòng đã nhân | Khuôn đa × đa k8.md §2 (dòng khai triển từng tích) |
| Bài 27 | kiến thức (Phần 1) | Chú ý bỏ "không cần phân tích $P(x)$ thành tích", thay bằng: hai điều kiện không đủ tìm riêng $a,b,c$ và không cần tìm; $P(0)=c$ | Phân tích thành tích là Chương II, ngoài phạm vi DTK8; câu mới là bẫy thật của bài |

**Đề sai:** không. **Chưa chắc:** không.
