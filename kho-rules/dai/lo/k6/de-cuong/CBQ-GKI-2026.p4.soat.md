KẾT LUẬN: ĐẠT

# CBQ-GKI-2026 · trạm 4 (Bài 4a–4m, tìm $x$ luỹ thừa) — biên bản soát (Opus, 20/10)

- Số câu: **12** (12 trả lời ngắn).
- Khớp Pha 1 (`.kiem.md`, giải mù + vét cạn `node -e`) ngay từ đầu: **12/12** đáp số.
- Đề chép đúng ảnh `t-1.png` / `z/b4-1.png`: 12/12.
- Phân loại: 12/12 đúng (`tra_loi_ngan`, đáp số 1–2 chữ số).
- Phải sửa: **3 câu** (lập luận Phần 1: 3 · định dạng: 1 — 4e dính cả hai). Bản gốc: `CBQ-GKI-2026.p4.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 6 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 4c | lập luận | Phần 1 Bước 1: "tính $105:21$ trước vì nó đứng trước phép trừ" ⇒ "nhân, chia trước; cộng, trừ sau" | Lí do sai: phép chia đứng SAU phép trừ trong biểu thức; làm trước là do thứ tự thực hiện phép tính |
| Bài 4e | lập luận | Phần 1 Bước 4: "ta có $x-1$ là số bị trừ" ⇒ "được giá trị của $x-1$; trong phép trừ này $x$ là số bị trừ" | $x-1$ là hiệu, $x$ mới là số bị trừ |
| Bài 4e | định dạng | `$2(x-1)^2$` ⇒ `$2.(x-1)^2$` ở Phần 1 + Phần 2 (dòng **Đề** giữ đúng ảnh) | k6.md §3: dấu nhân trước ngoặc viết dấu chấm (`$6.(x+1)$`) |
| Bài 4g | lập luận | Bước 3 "phương trình đơn giản cho $x+3$" ⇒ "giá trị của cả cụm số mũ $x+3$"; câu "Thử lại" vô nghĩa ("có cùng số mũ với luỹ thừa của 32") viết lại thành thay $x$ vào tính lại được 32 | "Phương trình" là thuật ngữ lớp sau; câu thử lại cũ không kiểm gì |

## Ghi nhận (không sửa)

- Bài 4l, 4m: nghiệm "âm" của cơ số ($x-7=-9$, $4x-18=-2$ ⇒ $x=4$) bị loại đúng vì phép trừ phải thực hiện được trong $\mathbb{N}$; bản soạn có dòng **Chú ý** nêu điều này. Không phải lỗi đề.
- Bài 4i: dùng $3^x=3^{x-1}.3$ (nhân hai luỹ thừa cùng cơ số) rồi đặt thừa số chung — đúng kiến thức khối 6.

## Câu còn `Chưa chắc`

Không có.
