KẾT LUẬN: ĐẠT

# Biên bản soát — NTL-GKI-2026 · phần 4 (Tiết 20, tại lớp, Bài 1a–1h)

- Số câu: **8** (8 tự luận, 0 trắc nghiệm, 0 trả lời ngắn; toàn Đại — không có bài Hình, không có câu tiếng Anh).
- Khớp Pha 1 (`NTL-GKI-2026.p4.kiem.md`) ngay từ đầu: **8/8** đáp số (cùng dạng nhân tử, kể cả 1f dừng ở $(x+2)(x^2-6x+4)$).
- Đề: đối chiếu ảnh `t-02.png` + phóng to 260 dpi (`z\soat_p4_bai1-02.png`) — chép đúng cả 8 ý, không sửa chữ đề.
- Kiến thức: trong phạm vi NTL (Chương I + II đầy đủ; 1f dùng nhẩm nghiệm + "định lí Bézout" — đề Tiết 20 cho phép; 1h dùng lập phương của một hiệu — đã học). Không dùng phân thức / phương trình.
- Kiểm máy: `<LV>\tam\kiem_soat_p4.mjs` (BigInt, 200 bộ số nguyên/ý) — 8/8 đồng nhất; $x^2-6x+4$ không có nghiệm hữu tỉ (thử ±1, ±2, ±4).
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.
- Số câu phải sửa: **2** — cả hai **chỉ sửa trình bày** (lời Phần 1); **0 câu sửa vì lỗi toán** (không đổi đáp số, không đổi dòng nào của Phần 2).
- Bản gốc trước khi sửa: `NTL-GKI-2026.p4.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Tiết 20 Bài 1b | định dạng / lời Phần 1 (chỉ trình bày) | Bước 2 "Lấy căn của $x^2$ và $4y^2$" → "Viết $x^2$ và $4y^2$ thành bình phương của hai biểu thức $A$, $B$". Chú ý "hai thừa số cuối là hai nhị thức giống nhau ở phần $x-2y$…" → chú ý về dấu của hạng tử giữa ($-4xy$ ⇒ bình phương của một hiệu) | "Căn của $4y^2$" không chính xác (là $\lvert 2y\rvert$); câu Chú ý cũ gọi sai $x-2y\pm3$ là "nhị thức" (có ba hạng tử) và gần như lộ dạng đáp số cuối |
| Tiết 20 Bài 1c | định dạng / lời Phần 1 (chỉ trình bày) | Mấu chốt "còn lại $-x^2$ cũng là một bình phương" → "còn lại là trừ đi $x^2$ — cũng là một bình phương" | $-x^2$ không phải một bình phương; ý đúng là trừ đi bình phương $x^2$ |

## Câu "Đề sai" / Chưa chắc

Không có. (1f: dòng `**Ghi chú:**` của trạm soạn về nhân tử $x^2-6x+4$ không phân tích tiếp trong số hữu tỉ — đúng, giữ.)
