KẾT LUẬN: ĐẠT

# NSHM-GKI-2026 — Phần 5 (Bài 8a–8f, Bài 9a–9d) — biên bản trạm soát

- Số câu: **10** (8 trả lời ngắn · 2 tự luận).
- Khớp Pha 1 (`NSHM-GKI-2026.p5.kiem.md`) ngay từ đầu: **10/10** đáp số (8a $=8$ · 8b $=\dfrac{1}{243}$ · 8c $=81$ · 8d $=9$ · 8e $=27$ · 8f $=\dfrac{221}{1620}$ theo đề in · 9a $=100$ · 9b $=28$ · 9c $=410$ · 9d $=10$), tính lại bằng `node` (BigInt / vét cạn).
- Đề: 10/10 chép đúng ảnh `p-2.png` (phóng to vùng Bài 8–9). Phân loại 10/10 đúng.
- Số câu phải sửa: **1** (Bài 8f, 2 chỗ nhỏ). Bản gốc: `NSHM-GKI-2026.p5.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 8f | lập luận (Phần 1 lộ đáp số) | `**Chú ý:**` "$221=13.17$ không có thừa số chung với $1620=2^2.3^4.5$…" ⇒ "số còn lại trong ngoặc ở tử không chia hết cho 2, 3 và 5 nên … không rút gọn tiếp được nữa" | Câu cũ nêu nguyên tử và mẫu của kết quả cuối — Phần 1 không được lộ đáp số. |
| Bài 8f | kiến thức | Phần 2: "$6^{11}=2^{11}.3^{11}$." ⇒ "Tương tự, $6^{11}$ là tích của 11 thừa số $6=2.3$ nên $6^{11}=2^{11}.3^{11}$." | Luỹ thừa của tích không có trong lý thuyết K6 (k6.md §1 luật 4) — phải nêu lí do như dòng $6^6$ ngay trên. |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 8f** — đề in rõ $\dfrac{4^6.9^5+6^6.120}{8^4.3^{12}-6^{11}}$, giải đúng như in ra $\dfrac{221}{1620}$ (xấu). Bài kinh điển là $6^9.120$: tử $=2^{13}.3^{11}$, kết quả $\dfrac{4}{5}$ (trạm soát tính lại bằng máy, xác nhận cả hai con số). Gần chắc đề cương in nhầm số mũ 9 thành 6 — CEO chọn: giữ đề in hay sửa đề thành $6^9$ (khi đó 8f thành phân số $\dfrac{4}{5}$, vẫn `tu_luan`, phải viết lại lời giải).

Ghi chú khác: dòng `**Ghi chú:**` ở 8b, 8f (đáp số là phân số ⇒ để tự luận) do trạm soạn thêm — giữ, đúng kiểu "điều người duyệt cần biết" như mẫu GKI-01 Bài 2b.
