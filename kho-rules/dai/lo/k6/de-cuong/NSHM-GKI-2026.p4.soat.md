KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 4 (Bài 7 Tính tổng, 9 ý a–k)

- Số câu: **9** (cả 9 tự luận vì đáp số từ 6 chữ số trở lên — phân loại đúng).
- Khớp đáp án giải mù Pha 1 (`.kiem.md`) ngay từ đầu: **9/9** (vét cạn bằng `node -e` BigInt cộng từng số hạng: $333300$ · $176800$ · $24497550$ · $338350$ · $171700$ · $926061526$ · $25164150$ · $4216250329201$ · $1386011925$).
- Mọi dòng tính trung gian kiểm lại bằng máy: $2026.2029.2032=8353052128$, $2027.676=1370252$, $99.100.101.102=101989800$, $2025.2026.2027.2028=16864993103400$, $2024.2026.2028=8316065472$… đều đúng.
- Đề chép khớp ảnh (trang 1 cho 7a–7d, trang 2 cho 7e–7k; 7k phóng to 3×: in rõ $2023^3$ — lỗi in, người gõ đề đã sửa thành $2023^2$ ở dòng Ghi chú).
- Kiến thức: không dùng công thức tổng như đã biết — mọi tổng $1+2+\dots+n$, $2+4+\dots$, $1+4+\dots$ đều tự suy ra bằng viết ngược + cộng từng cặp; tổng tích liên tiếp bằng nhân hệ số rồi triệt tiêu; không hằng đẳng thức, không chuyển vế. Phần 1 mỗi câu 4–5 bước nghĩ thật, không lộ đáp số cuối.
- Số câu phải sửa: **5** (3 câu chữ Phần 1 sai chiều triệt tiêu / tham chiếu bài khác · 2 câu Phần 2 dùng đẳng thức chưa chứng minh) + gỡ 1 `Chưa chắc`.
- Cổng máy: ✔ đạt cổng (9 câu, chưa chắc 0).
- Bản gốc trạm soạn: `NSHM-GKI-2026.p4.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 7a | lập luận (Phần 1) | Bước 3: "tích ba số vừa bị trừ ở số hạng này lại xuất hiện ở số hạng kế tiếp" ⇒ "tích được cộng ở số hạng này lại bị trừ ở số hạng kế tiếp" | Sai chiều: tích bị trừ ở số hạng thứ $k$ là tích được cộng ở số hạng **trước** nó, không phải số hạng kế tiếp |
| Bài 7b | lập luận (Phần 1) | Bước 3: viết lại như 7a | Câu gốc "triệt tiêu với tích đứng trước nó ở số hạng kế tiếp" sai chiều, khó hiểu |
| Bài 7c | lập luận (Phần 1) | Bước 3: bỏ "như ở bài tổng các tích hai số liên tiếp", nói thẳng cơ chế triệt tiêu | Câu trong kho đứng riêng, không được trỏ sang bài khác |
| Bài 7h | lập luận / kiến thức (Phần 2) | "Vì $k^3=(k-1).k.(k+1)+k$ (ví dụ $5^3=4.5.6+5$)" ⇒ chứng minh bằng phân phối: $(k-1).(k+1)=(k-1).k+(k-1)=k.k-1$, suy ra $(k-1).k.(k+1)=k^3-k$ | Một ví dụ số không chứng minh được đẳng thức tổng quát; lớp 6 không có hằng đẳng thức nên phải tự suy ra trong lời giải (k6.md §1 luật 2) |
| Bài 7k | lập luận / kiến thức (Phần 2) | "Vì $a^2=(a-1).(a+1)+1$" ⇒ thêm dòng suy ra bằng phân phối $(a-1).(a+1)=(a-1).a+(a-1)=a.a-1$ | Như 7h — đẳng thức kiểu hằng đẳng thức phải tự lập luận |
| Bài 7k | Chưa chắc | Gỡ dòng `**Chưa chắc:**` của trạm soạn; sửa câu tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Chắc chắn: ảnh in rõ $2023^3$, mọi số hạng còn lại là bình phương số lẻ ⇒ lỗi in; người gõ đề đã sửa và ghi ở dòng Ghi chú (giữ nguyên). Câu "nếu giữ mũ 3 thì không tính được" cũng không đúng (vẫn tính được: $9661105563$) |

## Câu còn `Chưa chắc` (gửi CEO)

- Không có. (Bài 7k: đề in $2023^3$ — đã có dòng Ghi chú của người gõ đề sửa thành $2023^2$, đáp số $1386011925$.)
