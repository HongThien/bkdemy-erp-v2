KẾT LUẬN: ĐẠT

# Biên bản soát — NT-CKI-2025 · khúc 1 (trang 1–4) · 28/10

- Số câu: 30 (PHẦN 11: 16 câu — 11 TN, 5 Đ/S; PHẦN 12: 14 câu — 10 TN, 4 Đ/S). Đủ câu, đúng thứ tự in, không thừa / thiếu.
- Khớp Pha 1 (`NT-CKI-2025.p1.kiem.md`) ngay từ đầu: **30/30** đáp án (kể cả từng ý Đ/S). Kiểm máy: `<LV>\tam\soat_p1.mjs`.
- Số câu phải sửa ngoài định dạng: 3 (PHẦN 11 Câu 13 — hình; Câu 14, Câu 16 — Phần 1 / ghi chú). Thêm một lượt định dạng toàn tệp (bỏ `\left` `\right`). Không câu nào sai đáp số, không câu nào chép đề sai.
- Bản gốc trước khi sửa: `NT-CKI-2025.p1.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (30 câu · 21 TN · 9 Đ/S · hình 2 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Toàn tệp (19 dòng, 44 lệnh) | định dạng | Bỏ `\left` / `\right` (thay bằng ngoặc thường `( ) [ ] \{ \}`) | brief-cki: không `\left` `\right` |
| P11 Câu 13 | hình | Cắt lại `de_P11C13.png` (200 dpi, trang 2) | Bản cũ dính vệt chữ dòng đề "lục giác đều ANPQRS như hình vẽ" ở mép trên; bản mới sạch, đủ nhãn A N P Q R S O x y |
| P11 Câu 14 | lập luận (Phần 1) | Mấu chốt: "có hai cạnh góc vuông bằng cạnh hình vuông" → "cạnh góc vuông kề góc tại $A$ chính là cạnh hình vuông" | Câu cũ sai: chỉ một cạnh góc vuông ($AB$, $AD$) là cạnh hình vuông |
| P11 Câu 16 | định dạng (đề mơ hồ) | `**Chưa chắc:**` → `**Ghi chú:** đề mơ hồ…` + dòng "Lưu ý" đầu Phần 2; giữ Sai cho ý c), dap_an DSSD | Luật Thùy 24/10: đề sai / mơ hồ giải bình thường + ghi rõ; nêu đáp án phương án kia (DSDD) trong Ghi chú |
| P11 Câu 16 | lập luận (Phần 1) | Bước 3 bỏ gợi ý "đoạn đó có lớn hơn khoảng đề cho hay không" | Ngầm lộ kết luận Sai của ý c) |

Đã kiểm, giữ nguyên: P11 Câu 12 ý d) gõ `\alpha` thay chữ $a$ in (lỗi in hiển nhiên, có Ghi chú) — đúng. Hình `de_P11C14.png` sạch, đủ A B C D M N (dấu "." trước A có sẵn trên bản in). P11 Câu 10 phương án in `k.360°` đã gõ `k\cdot 360^\circ`. P12 Câu 13 ý d) in "cảu … $(u_n)=3n-7$" gõ "của … $u_n=3n-7$" (lỗi in hiển nhiên, không đổi nghĩa). P11 Câu 15 ý d) "chu kì $2\pi$" Sai theo định nghĩa chu kì SGK (số dương nhỏ nhất). Phần 2 mọi câu dùng `\cdot`, không `\times`, không chấm làm dấu nhân; PTLG đủ ĐKXĐ, `k\in\mathbb{Z}`; không dùng kiến thức ngoài chương 1–2.

## Gửi CEO

- **PHẦN 11 Câu 16 ý c)** — đề mơ hồ: "phương trình $\sin 2x=m$ có nghiệm khi $m\in(-1;1)$". Đã chọn **Sai** (hiểu là điều kiện cần và đủ; tập đúng là $[-1;1]$) ⇒ dap_an DSSD. Nếu Thùy hiểu là điều kiện đủ thì đổi thành DSDD.
- Không còn câu `Chưa chắc`.
