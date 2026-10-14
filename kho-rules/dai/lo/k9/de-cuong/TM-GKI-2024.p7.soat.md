KẾT LUẬN: ĐẠT

# TM-GKI-2024 — Phần 7 (PHẦN 4 · Bài 23–25, kho=hgt) — biên bản trạm SOÁT

- Số câu: 3 (3 tự luận, 0 trả lời ngắn).
- Khớp Pha 1 ngay từ đầu: 3/3 (Bài 23a: $\widehat{C}=37^\circ$, $AC\approx8$ cm, $BC\approx10$ cm · Bài 24a: $DH=7{,}2$ cm, $\widehat{DAC}\approx53^\circ8'$ · Bài 25a: $AB=3{,}6$ cm, $AC=4{,}8$ cm, $\widehat{B}\approx53^\circ$, $\widehat{BCA}\approx37^\circ$; các ý chứng minh đúng — kiểm toạ độ số + 2000–3000 bộ ngẫu nhiên, sai số $10^{-13}$, script `tam/soat_p7.mjs`).
- Đề chép đúng ảnh cả 3 bài (đã phóng to 260 dpi). Công thức Bài 24c in đúng (không phải bản in sai).
- Số câu phải sửa: 1 (Bài 25, hai chỗ). Bản trước khi sửa: `TM-GKI-2024.p7.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs --khoi 9 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 25 (ý a) | lập luận (làm tròn) | $\widehat{BCA}=90^\circ-\widehat{CBA}\approx90^\circ-53^\circ=37^\circ$ ⇒ $\sin\widehat{BCA}=\dfrac{AB}{BC}=\dfrac{3{,}6}{6}=\dfrac35$, suy ra $\widehat{BCA}\approx37^\circ$ (bấm máy) | Tính tiếp từ số đo đã làm tròn — trái luật `hgt/k9.md` (giữ giá trị đúng tới bước cuối). Kết quả không đổi. |
| Bài 25 (Phần 1, Bước 2) | lập luận | Viết lại: ghép $\triangle HCA$ với $\triangle ACB$, $\triangle ECA$ với $\triangle ACM$ (chung góc nhọn đỉnh $C$) | Bản soạn viết "đồng dạng với tam giác vuông có cạnh huyền chứa $AC$" — sai ($AC$ là cạnh góc vuông của $\triangle ACB$, $\triangle ACM$) và hai tam giác nhỏ đồng dạng với hai tam giác KHÁC nhau. |

Hình giải `giai_P4B23/24/25.png`: đã mở kiểm — dựng đúng số liệu (script có dòng kiểm vuông góc), đủ điểm mọi ý, góc vuông đánh dấu đúng, không ghi kết quả phải tìm, nhãn không đè. Bài 24 ghi "9 cm" ở cạnh $BC$ (= $AD$ đề cho, cạnh đối của hình chữ nhật) — đã thử dời sang $AD$ nhưng nhãn sát điểm $M$ dễ đọc nhầm thành $DM$/$AM$, nên giữ như bản soạn. Bài 23 nhãn $53^\circ$ hơi xa cung góc nhưng vẫn rõ — giữ.

Soát luật kiến thức: không Δ / Viète / Cô-si; hệ thức đường cao ($DC^2=CH\cdot CA$, $CA^2=CH\cdot CB$…) đều chứng minh qua tam giác đồng dạng; $\sin^2\alpha+\cos^2\alpha=1$ có ghi căn cứ (Bài 24c); Bài 25c không dùng công thức nhân đôi (chứng minh bằng trung tuyến ứng với cạnh huyền + góc ngoài, có dùng điều kiện $CM>CB$ để $A$ nằm giữa $B$ và $I$); Bài 23c xử lí cả trường hợp $AM\perp BC$. Không `⇔`, không `\times`.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 25** (ý a): đề không nêu cách làm tròn — lời giải để độ dài là số đúng ($3{,}6$; $4{,}8$), góc làm tròn đến độ theo mặc định luật hgt khối 9 (kèm số đo đến phút nếu GV muốn: $53^\circ8'$, $36^\circ52'$ — đã kiểm máy).
