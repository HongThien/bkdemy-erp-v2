KẾT LUẬN: ĐẠT

# NTL-NC-2026 — trạm 2 (Tiết 19: Số nguyên tố, hợp số — tiết 1) — biên bản SOÁT (Opus, 24/10)

- Số câu: **11** (0 TN · 1 TLN · 10 tự luận) — Bài 2–5* trên lớp, Bài 1a/1b, 2.A–D, 3 về nhà.
- Khớp Pha 1 (`NTL-NC-2026.p2.kiem.md`) ngay từ đầu: **11/11** (đáp số / kết luận đều trùng; T19 TL Bài 4* `dap_an=3` khớp).
- Đề chép đúng ảnh `t-01.png` (đối chiếu thêm bản phóng to 260 dpi `z/soat-p2-t19-01.png`): 11/11. Vết bút của người dùng trên trang 1 không dùng làm đáp án.
- Phân loại đúng: 11/11. Cổng `dung-de-tu-soan.mjs --khoi 6 --chi-kiem`: **✔ đạt cổng**.
- Phải sửa: **3 câu** (2 lập luận / câu chữ, 1 câu đề in lỗi làm rõ `Chưa chắc` + thêm Chú ý). Không câu nào sai đáp số.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| T19 TL Bài 5* | lập luận (câu chữ Phần 1) | Bước 1: "ngoài 1 và $p$ không có ước nào khác, trong đó có 3" → "$p$ chỉ có hai ước là 1 và $p$, do đó 3 không phải là ước của $p$" | Câu cũ đọc thành "trong các ước có 3" — nghĩa ngược |
| T19 VN Bài 2.D | lập luận | "$D>3$ (vì $7.8.39$ lớn hơn $2.3.5$ rất nhiều)" → "$7.8.39>39$ và $2.3.5=30$ nên $D>39-30=9>3$" | "rất nhiều" không phải lí do; viết so sánh cụ thể, vẫn không tính giá trị $D$ |
| T19 VN Bài 3 | lập luận (đề in lỗi) | Viết lại `**Chưa chắc:**` cho chính xác (bỏ chữ "nhẹ"; nêu $p+7\ge 12$ chẵn; kết luận đúng với mọi $p>3$; CEO sửa giả thiết hoặc bỏ câu); thêm `**Chú ý:**` cách chẵn lẻ ($p$ lẻ ⇒ $p+5$ chẵn $>2$) không cần giả thiết lỗi; Bước 1 sửa câu chữ như Bài 5* | Theo luật đề in lỗi (k6.md §9 10/10: CEO sửa đề cho rõ rồi nhập). Lời giải chia cho 3 của trạm soạn đúng từng dòng (giả thiết mâu thuẫn ⇒ kết luận đúng một cách rỗng), giữ lại vì cùng kĩ thuật Bài 5* |

Không sửa: Bài 2 ($43=2+41$ — duy nhất; $30=7+23$, $32=3+29$ — một trong các cách, máy vét đủ), Bài 3 ($A\vdots 5$, $B\vdots 9$), Bài 4* ($p=3$, ba trường hợp số dư bao cả $p=2$), VN 1a/1b, 2.A ($\vdots 2$), 2.B (đặt thừa số chung $5.51$ — chỉ tính hai tích nhỏ, không tính giá trị $B$), 2.C ($\vdots 7$; cũng $\vdots 13$).

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| T19 VN Bài 3 | Đề in lỗi chắc chắn: "$p>3$ nguyên tố và $p+7$ nguyên tố" không bao giờ xảy ra ($p$ lẻ ⇒ $p+7$ chẵn, $\ge 12$; máy 0 trường hợp với $p<10^6$). Kết luận "$p+5$ hợp số" vẫn đúng với mọi $p>3$ (vì $p+5$ chẵn). Không đoán được giả thiết gốc ⇒ CEO quyết: sửa giả thiết (vd đổi thành giả thiết khả thi) hay bỏ câu. |
