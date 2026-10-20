KẾT LUẬN: ĐẠT

# TC-GKI-2026 · trạm 3 (Câu 21–30) — biên bản soát (Opus, 20/10)

- Số câu: **10** (10 trắc nghiệm; Câu 21 kho `dai`, Câu 22–30 kho `hgt`; 5 câu có hình đề).
- Khớp Pha 1 ngay từ đầu: **10/10** đáp án (D · C · D · B · A · D · B · B · C · B).
- Phải sửa: **4 câu** (21, 22, 24, 25 — câu chữ / lập luận / Đọc hình; 22 thêm `Chưa chắc`). Không câu nào sai đáp án, chép đề hay phân loại.
- Cổng: `✔ đạt cổng` (10 TN · HGT 9 · hình 5 · chưa chắc 1).

## Cách kiểm hình (không đọc bằng mắt)

- Hình Câu 22, 23, 24, 26 trong `goc.pdf` là **hình vector** ⇒ xuất `pdftocairo -svg` trang 2, 3 (`<LV>\z\soatp3-pg2.svg`, `soatp3-pg3.svg`), lấy toạ độ đỉnh, tính cạnh và góc bằng `node`.
- Hình Câu 25 là ảnh nhúng ⇒ `pdfimages` (`<LV>\z\soatp3-img-000.png`), đo điểm ảnh bằng pngjs.
- Kết quả đo: xem `TC-GKI-2026.p3.kiem.md`. Điểm chính:
  - **Câu 22:** hình (3) cạnh $76,5 ; 76,6 ; 81,3$, góc $58^\circ$–$64^\circ$–$58^\circ$ ⇒ cân, **không đều thật**; ba hình kia lệch hẳn ((1) vuông cân; (2), (4) cạnh dài gấp ~2 cạnh ngắn) ⇒ đáp án C theo ý đề.
  - **Câu 24:** bát giác (1) và ngũ giác (3) là đường vector KHÉP KÍN 8 và 5 đỉnh; đỉnh dưới vượt mép trang 2 nên bị cắt ngay trong PDF gốc (không phải lỗi cắt ảnh). Lục giác (2) cạnh $39,5$–$42,7$ (lệch ≤ 8 %), thang (4) cân. Ghi chú ghép hai trang của người gõ đúng.
  - **Câu 25:** biển báo (1) cao/rộng $0,88$ (đều: $0,866$, góc bo tròn), đỉnh chính giữa ⇒ đều; ê ke (2) $98\times96$ px vuông cân; (3) tù; lá cờ (4) cạnh $86 ; 86 ; 51$ ⇒ cân, không đều.
  - **Câu 23:** hình (4) $55,2\times55,0$ góc vuông ⇒ vuông. **Câu 26:** lưới 3 × 3 chia đều ⇒ $9+4+1=14$.

## Bảng sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 21 | lập luận (câu chữ) | Phần 1 Bước 1: "cộng thêm phần dư là một số cụ thể" ⇒ "cộng với một số cụ thể" | 4 không phải "phần dư" khi $x+2\le4$; dùng sai thuật ngữ phép chia có dư |
| Câu 22 | hình / lập luận | Thêm `**Chưa chắc:**` (số đo thật của hình (3)); Phần 2 "đo ba cạnh thấy bằng nhau" ⇒ "ba cạnh bằng nhau (không có cạnh nào dài hơn hẳn)" | Đo vector: cạnh đáy hình (3) dài hơn hai cạnh bên ~6 % — HS đo thước sẽ không thấy "bằng nhau"; đáp án C không đổi |
| Câu 24 | lập luận | Phần 1 Chú ý: "hai hình đầu bị cắt" ⇒ "hình (1) và hình (3) bị cắt" | Hình bị cắt là (1) bát giác và (3) ngũ giác, không phải (1), (2) |
| Câu 25 | lập luận | Phần 1 Bước 4 viết lại: hai hình còn lại sau Bước 3 là (1) và (4), loại (4) vì một cạnh ngắn hơn hẳn | Bản soạn: sau khi loại góc vuông / tù vẫn còn 2 hình, Bước 4 nói "hình còn lại" (số ít) là hụt bước |
| Câu 25 | hình / lập luận | Phần 2 Hình (4) "ba cạnh khác nhau" ⇒ "cạnh sát cán ngắn hơn hẳn hai cạnh kia"; Đọc hình (4) "(lệch)" ⇒ "(tam giác cân, cạnh sát cán ngắn hơn hẳn hai cạnh kia)" | Đo: lá cờ cạnh $86 ; 86 ; 51$ px — cân, không phải ba cạnh khác nhau |

Các câu 23, 26, 27, 28, 29, 30: đề khớp ảnh, đáp án khớp, lời giải đúng, Phần 1 3–4 bước không lộ đáp số, Phần 2 kết `Chọn X.` — giữ nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 22** — hình (3) trong đề gốc vẽ không đều thật (cạnh đáy dài hơn ~6 %, góc $58^\circ$–$64^\circ$–$58^\circ$); đáp án C chắc theo ý đề, nhưng đề xuất **vẽ lại hình (3) thành tam giác đều thật** (như GKI-14 Câu 7) để HS đo thước không bị lệch.

## Đề xuất (không phải Chưa chắc)

- **Câu 24** — ảnh ghép `de_cau24.png` hiện bát giác (1) và ngũ giác (3) bị cụt nửa dưới (do PDF gốc cắt ở mép trang). Nếu muốn hình đẹp trên app: PDF có sẵn toạ độ vector đầy đủ cả hai hình (`<LV>\z\soatp3-pg2.svg`) ⇒ dựng lại trọn vẹn bằng code được. Đáp án B không phụ thuộc phần bị cắt.
