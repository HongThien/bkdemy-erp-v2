KẾT LUẬN: ĐẠT

PDP-CKI-2025 khúc 9 (tr.33–36) · trạm soát Opus · 28/10

- Số câu: 43 (PHẦN 91: 32 trắc nghiệm Câu 7–38 · PHẦN 92: 4 trả lời ngắn Câu 44, 45, 53, 54 + 7 tự luận Câu 46–52).
- Khớp Pha 1 ngay từ đầu: 43/43 (đáp án / đáp số đều trùng bản giải mù `PDP-CKI-2025.p9.kiem.md`; máy kiểm `<LV>\tam\soat_mu_p9.mjs`).
- Đề gõ: đối chiếu ảnh tr.33–36 từng câu — đủ câu, đúng số / mũ / dấu / phương án; không lỗi chép đề.
- Số câu phải sửa: 4 câu (C23, C24, C27, C48) + sửa định dạng toàn tệp (bỏ `\left` `\right`, 128 chỗ, ~30 câu) + dòng đầu tệp. Bản gốc: `PDP-CKI-2025.p9.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt (43 câu, chưa chắc 0).

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Toàn tệp | định dạng | Bỏ 128 lệnh `\left` / `\right` (giữ ngoặc thường) | brief-cki: cấm `\left` `\right` |
| Đầu tệp | định dạng | `nam: 2025` → `nam: 2026`; tên đề thống nhất với các khúc khác ("… năm 2025–2026 — Trường THPT Phan Đình Phùng") | brief-soan §3 khuôn `nam: 2026`; p3/p4/p6/p7/p10 đều 2026 |
| Câu 23 | định dạng | Xoá dòng `**Chưa chắc:**`, giữ `**Ghi chú:** đề sai …` (chọn D, D kéo theo C) | Kiểm chắc: $\lim_{x\to1^\pm}f=5=f(1)$ ⇒ C, D cùng đúng — là "đề sai", không phải hai cách hiểu (brief-soat §6) |
| Câu 24 | lập luận | Thay dòng "Vì $16^{n+1}:16^n=16$ …" (sai ý, đặt sau phép chia) bằng chú thích $\sqrt{16^{n+1}+4^n}=4^n\sqrt{16+\frac{1}{4^n}}$ … trước phép chia và dòng nêu ba giới hạn bằng 0 | Phép chia căn cho $4^n$ trước đó không có căn cứ; dòng cũ viết `:` và lặp |
| Câu 27 | định dạng | `2\dfrac{b}{n}` → `2\cdot\dfrac{b}{n}` | dấu nhân tường minh |
| Câu 48 | lập luận (Phần 1) | Bước 3 "Trục căn thức ở mẫu nếu cần" → "Tính căn … giữ kết quả dạng phân số chứa căn" | Mẫu $x+1$ không có căn — bước bịa |

Ghi nhận không sửa:
- Câu 53: đề in thừa "tại $x=1$ liên tục tại $x=1$"; bản soạn gõ gọn một lần — giữ.
- Đề in không có Câu 39–43 (sau Câu 38 sang thẳng "Phần 3: Trả lời ngắn", Câu 44) — bản soạn đã nêu ở GHI CHÚ CHO NGƯỜI DUYỆT.
- Câu 46–48 xếp tự luận đúng (đáp số $-\frac23$, $\sqrt3$, $\frac{\sqrt2}{2}$ không tô được 4 ô); Câu 45 TLN `-1,5` đúng.
- Câu 38: $a=-\frac34$, bất phương trình $4x^2+3x-7<0\Leftrightarrow -\frac74<x<1$, nghiệm nguyên $-1;0$ ⇒ D (máy kiểm).

Danh sách gửi CEO (Chưa chắc / đề sai):
- Câu 23 (PHẦN 91) — đề sai: phương án C và D cùng đúng, đã chọn D.
- Câu 51 (PHẦN 92) — đề in nhãn "Câu 351", đánh lại Câu 51 (không phải lỗi nội dung).
- Không còn câu `Chưa chắc`.
