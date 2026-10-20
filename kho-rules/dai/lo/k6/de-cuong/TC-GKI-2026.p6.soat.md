KẾT LUẬN: ĐẠT

# TC-GKI-2026 · trạm 6 — biên bản soát (Opus, 20/10)

- Phạm vi: Bài 3a–3i, 3k (đề đánh ý không có j — giữ nhãn), Bài 4a, 4b.
- **Số câu:** 12 (8 trả lời ngắn · 4 tự luận · 0 TN · 0 hình).
- **Khớp Pha 1 ngay từ đầu:** 12/12 (3a 12 · 3b 9 · 3c 11 · 3d 16 · 3e 7 · 3f 4 · 3g 32 · 3h $\{9;25\}$ theo cách hiểu thông thường · 3i 6 · 3k $x\in\{39;\dots;65\}$ · 4a chia hết cho 2: 2540, 1638, 2356 / cho 3: 1347, 1638 / cả hai: 1638 · 4b $x=4$, $y=0$ — vét cạn bằng `node -e`).
- **Đề chép đúng ảnh:** 12/12 (đối chiếu ảnh phóng to 260 dpi `z/p6_bai34-5.png`).
- **Phân loại:** đúng cả 12 (3h, 3k, 4a, 4b nhiều đáp số ⇒ tự luận; còn lại một số ≤ 4 kí tự ⇒ trả lời ngắn).
- **Số câu phải sửa:** 10 (3a, 3b, 3c, 3d, 3e, 3f, 3g, 3i, 3k, 4b) — đáp số, đề, Phần 2 không sai; lỗi ở Phần 1 (dòng "Thử lại" lộ đáp số), 2 bước giải nói sai vai trò / dùng thuật ngữ lớp sau, và 1 lập luận chia hết cho 3 ở 4b.
- Cổng: `✔ đạt cổng`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3a | định dạng (Phần 1 lộ đáp số) | Bỏ `Thử lại: $21-12=9$`, thay `**Chú ý:**` số trừ = số bị trừ **trừ** hiệu, thay $x$ vào đề để thử | Phần 1 không được ghi đáp số cuối; dòng rời không thuộc bước nào (cùng cách xử lý các trạm soát trước) |
| Bài 3b | định dạng (lộ đáp số) | Bỏ `Thử lại: $17+2.9=…$`, thay `**Chú ý:**` gỡ cộng trước, chia sau | Như trên |
| Bài 3c | định dạng (lộ đáp số) | Bỏ `Thử lại: $100-7.(11-5)=…$`, thay `**Chú ý:**` không lấy $100-7$ trước | Như trên |
| Bài 3d | định dạng (lộ đáp số) | Bỏ `Thử lại: $85-(2.16+3)=…$`, thay `**Chú ý:**` ngoặc vuông là số chia | Như trên |
| Bài 3e | định dạng (lộ đáp số) | Bỏ `Thử lại: $72-(84-9.7):7=…$`, thay `**Chú ý:**` $(84-9x)$ là số bị chia | Như trên |
| Bài 3f | lập luận · kiến thức · định dạng | Bước 3 "tìm **số hạng** chưa biết rồi thừa số" ⇒ "$2x$ là **số bị trừ** chưa biết … rồi thừa số chưa biết"; Bước 2–3 bỏ chữ "phương trình"; bỏ `Thử lại: $(2.4-5)^2=…$` | Trong $2x-5=3$, $2x$ là số bị trừ, không phải số hạng; "phương trình" là thuật ngữ lớp sau; dòng thử lại lộ $x=4$ |
| Bài 3g | định dạng (lộ đáp số) | Bỏ `Thử lại: $2.32+5.32-3.32=…$`, thay `**Chú ý:**` tính $2+5-3$ từ trái sang phải | Lộ $x=32$ |
| Bài 3i | kiến thức · định dạng | Bước 3 "Giải phương trình số mũ" ⇒ "Từ hai số mũ bằng nhau, $x$ là số bị trừ chưa biết …"; bỏ `Thử lại: $3^{6-2}=…$`, thay `**Chú ý:**` chỉ so số mũ khi cùng cơ số | "Phương trình" là thuật ngữ lớp sau; lộ $x=6$ |
| Bài 3k | lập luận · định dạng | Bước 4 "nhớ lấy cả hai đầu" ⇒ "bắt đầu từ số ứng với bội nhỏ nhất và dừng ở số ứng với bội lớn nhất"; bỏ `Thử lại: $7.39=…$, $7.65=…$` | "Lấy cả hai đầu" mâu thuẫn với khoảng chặt $38<x<66$; dòng thử lại lộ hai đầu 39, 65 của đáp số |
| Bài 4b | lập luận · định dạng | Phần 2 bỏ dòng "Vì $9\vdots 3$ nên số chia hết cho 9 thì cũng chia hết cho 3" (đứng chen giữa), thêm sau khi tìm $x$: "tổng các chữ số là 18, mà $18\vdots 3$ nên $712440$ cũng chia hết cho 3"; Bước 2 Phần 1 viết theo tổng chữ số; bỏ `Thử lại: $712440:2=…$` | Tính chất bắc cầu "$a\vdots 9$, $9\vdots 3$ ⇒ $a\vdots 3$" không có trong lý thuyết bản đồ K6 — đi bằng dấu hiệu chia hết cho 3 (tổng chữ số) cho chắc; dòng thử lại lộ số 712440 |

Không sửa: 4a (Phần 2 đúng khuôn NNB00906–907), 3h (lời giải đúng theo cách hiểu đã chọn). Phần 2 cả 12 câu dùng tìm thành phần chưa biết, không chuyển vế, dấu nhân chấm, kết "Vậy …".

## Câu còn `Chưa chắc`

| Câu | Lí do |
|---|---|
| Bài 3h | $(x^2-81).(x-5^2)=0$: với $x=9$ thì thừa số $x-25=9-25$ không thực hiện được trong $\mathbb{N}$ (GKI chưa học số nguyên âm). Cách hiểu thông thường (đang trình bày): $x\in\{9;25\}$; nếu đòi mọi thừa số đều thực hiện được trong $\mathbb{N}$ thì chỉ $x=25$. Trạm soát giải mù ra cùng hai cách hiểu — giữ `Chưa chắc` của trạm soạn, chờ CEO chốt. |
