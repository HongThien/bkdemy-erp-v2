KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 8 (Bài 11a–11j) — trạm soát Opus, 11/10

- Số câu: **10** (9 trả lời ngắn · 1 tự luận).
- Khớp đáp số Pha 1 (`NSHM-GKI-2026.p8.kiem.md`) ngay từ đầu: **10/10** (a=5, b=1, c=0, d=không có $x$ theo đề in, e=3, f=2, g=2, h=1, i=0, j=0 — tính lại bằng `node -e`).
- Đề: 10/10 chép đúng ảnh `trang/p-2.png` (phóng 2×). 11f: ảnh in `1+2+3...+87+88` (thiếu `+` trước `...`), bản soạn chuẩn hoá `1+2+3+\dots+87+88` — lỗi gõ, nghĩa không đổi, không cần ghi chú.
- Phân loại: đúng (đáp số một số ≤ 4 kí tự ⇒ TLN; 11d vô nghiệm theo đề in ⇒ tự luận).
- Kiến thức: không chuyển vế, không $(a^m)^n$ / luỹ thừa của tích (11i viết $175^5$ thành tích năm thừa số $5^2.7$), tổng $1+\dots+88$ tự suy bằng ghép cặp (11f), "hai luỹ thừa cùng số mũ khác cơ số bằng nhau khi số mũ bằng 0" tự lập luận (11b, 11c). 11g/11h giải bằng phân tích TSNT + thử + "vế trái tăng theo $x$" — đúng và trong phạm vi lớp 6.
- Số câu phải sửa: **1** (định dạng/lập luận nhỏ).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 11b | lập luận (định dạng tìm $x$) | Sau "chỉ bằng nhau khi $x-1=0$" thêm hai dòng `$x-1=0$` → `$x=0+1$` trước `$x=1$` | Khuôn Tìm $x$ (k6.md §2 NNB00894): tìm số bị trừ = hiệu + số trừ theo cột; bản soạn nhảy thẳng từ $x-1=0$ sang $x=1$ |

Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (10 câu · 9 TLN · 1 tự luận · chưa chắc 1). Bản gốc: `NSHM-GKI-2026.p8.soan.goc.md`.

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Bài 11d | Đề in $3^x+25=26.2^3+2.3^0$ ⇒ $3^x=185$, **không có $x$ tự nhiên** (ảnh rõ số mũ 3, hai trạm đọc giống nhau). Gần chắc đề gốc là $26.2^2$ ⇒ $3^x=81$ ⇒ $x=4$ (bài kinh điển). Lời giải hiện giải đúng như đề in; nếu CEO sửa đề thành $26.2^2$ thì đổi sang `loai=tra_loi_ngan`, `dap_an=4` và viết lại lời giải. |
