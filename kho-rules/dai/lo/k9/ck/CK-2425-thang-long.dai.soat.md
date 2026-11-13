KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-thang-long · lượt Đại (trạm soát Opus, 13/11)

- **Số câu:** 65 (5 phần: Dạng 1 = 30 · Dạng 2 = 17 · Dạng 3 = 9 · Dạng 4 = 5 · C = 4) · 14 trả lời ngắn + 51 tự luận. Cổng `--chi-kiem`: ✔ đạt cổng.
- **Pha 0:** danh sách tự lập từ ảnh p-1…p-6 trùng khít danh sách `###` của bản soạn — **không sót, không thừa**. C Bài 3 (nửa đường tròn) đã ở lượt Hình, bản soạn bỏ đúng. Không có bài hình nhập nhầm; C Bài 4 (hình hộp) lượt Hình chưa lấy ⇒ giữ ở đây, đổi `kho=hinh_hoc`.
- **Khớp Pha 1 ngay từ đầu:** 64/65 đáp số. Lệch duy nhất: C Bài 4 — bản soạn tự sửa đề $AC\to AC'$ và ra $54$; giải mù theo chữ in ra "không có giá trị lớn nhất" (máy: `<LV>\tam\soat_dai.mjs`).
- **Số câu phải sửa:** 7 (C 4 · D1 5c · D2 3, 4, 5, 6 · D3 9). Không đổi đáp số câu nào ngoài C 4.
- **Kiểm định dạng:** không TAB / FF / kí tự điều khiển; không `\notin` / `\neq` vỡ dòng; không `\times`, `\Leftrightarrow`, $\Delta$, Viète, Cô-si thẳng, "tập nghiệm", kí hiệu khoảng.
- **Bản gốc trước khi sửa:** `CK-2425-thang-long.dai.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| C Bài 4 | chép đề / đáp số / phân loại | Trả đề về chữ in $AC=3\sqrt3$ (ảnh phóng to `z/soat_c4.png` in rõ $AC$); giải theo đề in ⇒ $S$ không có GTLN (chọn $a=b=\frac{3\sqrt6}{2}$, $S=27+6\sqrt6\,c$); "Lưu ý: đề sai" đầu Phần 2 + trình bày thêm cách hiểu $AC'$ ⇒ $54$; thêm `Chưa chắc`; `kho=dai` → `kho=hinh_hoc`; tên hình `ABCD{.}A'B'C'D'` (bản soạn viết `ABCD \cdot A'B'C'D'`); Phần 1 viết lại | Luật Thùy 24/10: chỉ sửa chữ đề khi lỗi in hiển nhiên; thiếu dấu phẩy ở đây đổi hẳn bài toán (đề in vẫn giải được, ra kết luận khác) ⇒ không tự sửa. Lời giải dùng Pythagore trên hình hộp ⇒ kho Hình |
| D1 Bài 5c | lập luận (Phần 1 lộ đáp số) | Bước 3 "kết luận hệ vô nghiệm" → "nhận xét đẳng thức đúng hay sai, từ đó kết luận về nghiệm" | Phần 1 không lộ đáp số cuối |
| D2 Bài 3 | định dạng / Phần 1 lộ đáp số | Bỏ `Ghi chú` (chỉ nói đáp số ý c, không phải lỗi đề); Mấu chốt bỏ công thức $A$ rút gọn; Bước 4 bỏ dạng $A=2-\frac{3}{\sqrt x+1}$ | Ghi chú chỉ cho lỗi đề; Phần 1 không lộ đáp số |
| D2 Bài 4 | Phần 1 lộ đáp số | Mấu chốt bỏ $P=\frac6{x-9}$, $A=1+\frac3{\sqrt x}$ | như trên |
| D2 Bài 5 | Phần 1 lộ đáp số | Mấu chốt bỏ $B=\frac{12}{\sqrt x+3}$ và "chặn bởi 4" | như trên |
| D2 Bài 6 | định dạng / Phần 1 lộ đáp số | Ghi chú giữ phần thiếu điều kiện $x\ne1$, bỏ đáp số ý c; Mấu chốt bỏ công thức $B$ | như trên |
| D3 Bài 9 | ghi chú | Giữ sửa đề "18 triệu 400 nghìn" (ảnh phóng to `z/soat_d3b9.png` in "18 triệu 8400 nghìn"); Ghi chú thêm: đọc 18 840 000 hoặc 26 400 000 đều ra giá vở âm (máy: $-12\,680$; $-368\,000$), chỉ 18 400 000 cho 8000 / 6000 | Lỗi in hiển nhiên có đáp án duy nhất ⇒ được sửa chữ đề (brief soạn mục 6) |

## Ghi nhận khác (không sửa)

- D3 Bài 2 ("4200000" thiếu đơn vị), D3 Bài 4 ("bao nhiêu lâu" → "bao nhiêu ngày"), C Bài 5 ("nhuận" → "lợi nhuận"): sửa chữ nhẹ, đúng luật.
- D4 Bài 2: đề sai số liệu (8,5 tấn < tồn kho 160 tạ) — bản soạn giải theo đề in (0 ngày) + Ghi chú + Lưu ý, đúng luật; nếu là 85 tấn thì 12 ngày.
- D2 Bài 4: đề ghi $x\ge0$ chưa đủ cho $Q$ — Ghi chú của bản soạn đúng.
- D3 Bài 8 dùng phương trình bậc hai (phân tích nhân tử, không $\Delta$) — đúng luật.

## Câu còn `Chưa chắc` (gửi CEO)

- **PHẦN 5 (C) Bài 4** — đề in "đường chéo $AC=3\sqrt3$": theo chữ in ($AC$ đường chéo mặt đáy) ⇒ $S$ không có giá trị lớn nhất; nếu hiểu là đường chéo hình hộp $AC'$ ⇒ $S_{\max}=54$ (lập phương cạnh 3). Lời giải đã trình bày cả hai; CEO chọn cách hiểu.
