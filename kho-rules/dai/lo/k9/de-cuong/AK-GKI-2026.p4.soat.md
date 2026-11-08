KẾT LUẬN: ĐẠT

# AK-GKI-2026 — PHẦN 4 (ĐỀ 4) — biên bản trạm SOÁT (Opus, 24/10)

- Số câu: **8** (Bài 1a, 1b, 2a, 2b, 3, 4, 5, 6) — sau soát: 2 trả lời ngắn (1b `-2`, 6 `1,5`) + 6 tự luận.
- Khớp Pha 1 ngay từ đầu (đáp số): **8/8** (giải mù: `AK-GKI-2026.p4.kiem.md`, máy: `<LV>\tam\soat_p4.mjs`).
- Số câu phải sửa: **3** (Bài 4, 5, 6) — không đổi đáp số nào. Bản gốc trạm soạn: `AK-GKI-2026.p4.soan.goc.md`.
- Đề: 8/8 chép đúng ảnh (`p-3.png` nửa dưới, `p-4.png` đầu). Hình đề `de_P4C5.png` đúng câu, không dính chữ. Hình giải `giai_P4B4.png` (đo lại pixel: $BH:BC=3{,}06:4{,}5$, $\widehat B=40^\circ$, $AH\perp BC$) và `giai_P4B5.png` ($\widehat A=21^\circ$, vuông tại $H$) dựng đúng dữ kiện, chỉ ghi số đo đề cho, nhãn không đè.
- Cổng `--chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 4 | kiến thức (căn cứ) / định dạng | Tách $AH=AB\cdot\sin B$, $BH=AB\cdot\cos B$ thành dòng có căn cứ "(hệ thức giữa cạnh và góc)" rồi dòng thay số | `hgt/k9.md` §2 khuôn "Tính cạnh": phải ghi căn cứ hệ thức |
| Bài 5 | lập luận | Ý b: $t=\dfrac{558{,}09}{150}$ ⇒ $t=\dfrac{200}{150\cdot\sin21^\circ}$ (tính từ giá trị đúng); ý a thêm căn cứ "(hệ thức giữa cạnh và góc)"; dòng đổi đơn vị viết lại $9\ \text{km/h}=\dfrac{9000}{60}\ \text{m/phút}=150\ \text{m/phút}$ | Không tính tiếp từ số đã làm tròn; dòng đổi đơn vị cũ trộn "m : phút" khó đọc |
| Bài 6 | lập luận / phân loại | Câu "Cộng ba vế … với $a$, $b$, $c$ tương ứng" (mơ hồ) ⇒ viết rõ $\dfrac{a^3}{a^2+b^2}\ge a-\dfrac b2$ (và hai bất đẳng thức tương tự) rồi "Cộng theo vế"; `tu_luan`/`—` ⇒ `tra_loi_ngan`/`1,5`; kết luận ghi $\dfrac32=1{,}5$ | Đáp số là một số $1{,}5$ (≤ 4 kí tự) đúng dạng "tìm giá trị nhỏ nhất"; cùng cách xếp với Đề 3 Bài 6 (`0`) và tiền lệ NS 6n |

Không phát hiện lỗi kiến thức cấm (không Δ / Viète, không Cô-si dùng thẳng — $a^2+b^2\ge2ab$ chứng minh từ $(a-b)^2\ge0$, không hệ thức đường cao, không đường trung bình, không `⇔`, không "tập nghiệm $S$"). Phần 1 cả 8 câu 3–4 bước, không lộ đáp số.

## Câu còn `Chưa chắc`

Không có. (Đề 4 không có chỗ đề sai: Bài 4 đề nêu cách làm tròn; Bài 5 trùng nguyên văn Đề 3 Câu 5 — máy gom khi ghi.)
