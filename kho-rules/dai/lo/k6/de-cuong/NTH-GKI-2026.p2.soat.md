KẾT LUẬN: ĐẠT

# Biên bản soát — NTH-GKI-2026 · trạm 2 (Bài 5a–5d, VD Bài 3, Bài 6a–6c, Bài 7a–7c) — Opus, 20/10

- Số câu: **11** (0 TN · 11 trả lời ngắn · 0 tự luận).
- Khớp Pha 1 ngay từ đầu: **11/11** đáp số (122 · 146 · 17 · 90 · 15 · 44 · 2 · 252 · 2 · 4 · 14), kiểm lại bằng `node -e` (tính thẳng + vét cạn $x$ từ 0 đến 499).
- Phải sửa: **1 câu** (từ ngữ Phần 1). Đề cả 11 câu chép đúng ảnh.
- **Soi số mũ** (trạm soạn chưa soi ở 260 dpi): phóng to 700 dpi từ `goc.pdf` (`z/s2_b5ab-4.png`, `z/s2_b5cd-4.png`) và 400 dpi (`z/s2_vd3-4.png`, `z/s2_b67-4.png`). Đọc được: 5a $5^2$, $2^2$ · 5b $2^{91}$, $2^{88}$, $1^5$ · 5c $2^4$, $5^2$ · 5d $2^3$ · VD3 $2^2$ · 7a $(\dots)^3$ · 7b $2^x$ · 7c $2^3$. Khớp hết với bản soạn.
- Phân loại: cả 11 câu đáp số là một số ≤ 4 kí tự ⇒ `tra_loi_ngan` đúng.
- Lời giải mẫu in sẵn của VD Bài 3 ra $x=15$, khớp với lời giải độc lập; mẫu không có lỗi toán. Dòng `Ghi chú` (do khung `NTH-GKI-2026.build.mjs` sinh ra) giữ nguyên.
- Kiến thức: tìm $x$ đều theo cách tìm thành phần chưa biết (không chuyển vế); chia hai luỹ thừa cùng cơ số $a^m:a^n=a^{m-n}$ nằm trong whitelist NNB00897; dấu nhân là dấu chấm; Phần 1 không lộ đáp số cuối.
- Cổng: `✔ đạt cổng`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 7a | kiến thức (từ ngữ) | Phần 1 Bước 3: "Giải phương trình $2x+1=$ cơ số đó: …" ⇒ "Từ $2x+1$ bằng cơ số đó, tìm $2x$ như số hạng chưa biết rồi tìm $x$ như thừa số chưa biết." | "Phương trình" là từ của lớp 8, lớp 6 chỉ nói "tìm $x$" (cùng tiền lệ CKI-21, CKI-03, GKI-27) |

## Câu còn `Chưa chắc`

Không có.
