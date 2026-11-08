KẾT LUẬN: ĐẠT

# AK-GKI-2026 · Phần 2 (ĐỀ 2) — biên bản trạm SOÁT (Opus, 24/10)

- **Số câu:** 8 (Bài 1a, 1b, 2a, 2b, 3, 4, 5, 6) · 3 trả lời ngắn (1b `5`, 3 `15`, 5 `7,3`) + 5 tự luận · `dai` 6, `hinh_hoc` 2.
- **Khớp Pha 1 ngay từ đầu:** 8/8 (giải mù ở `AK-GKI-2026.p2.kiem.md`, script `<LV>\tam\mu_p2.mjs`).
- **Số câu phải sửa:** 2 (Bài 4, Bài 5) — không đổi đáp số, không đổi phân loại.
- Bản gốc trước khi sửa: `AK-GKI-2026.p2.soan.goc.md`. Cổng `--chi-kiem`: ✔ đạt cổng.

## Kiểm riêng theo brief

- **Bài 4b ($\widehat{BHK}=\widehat{BID}$):** kiểm độc lập bằng toạ độ — đúng với hình $12\times9$ và 20 000 hình chữ nhật ngẫu nhiên (lệch tối đa $2\cdot10^{-7}$ độ, sai số `acos`). Dạng tổng quát $A(0;0)$, $B(a;0)$, $D(0;b)$: $I_y=\dfrac{a^2b}{a^2+b^2}$, $D_y=b$, $M_y=\dfrac{a^2}{b}$ ⇒ $M$, $D$ luôn cùng phía $I$ ⇒ $\widehat{BIM}=\widehat{BID}$ với mọi hình chữ nhật. Đề KHÔNG sai; $N$ thừa (không dùng), $M$ dùng làm điểm phụ. Lời giải của trạm soạn ($BA^2=BK\cdot BI=BH\cdot BM$ chứng minh bằng hai cặp tam giác đồng dạng g.g, rồi c.g.c) đúng và không dùng thẳng hệ thức đường cao.
- **Bài 2b:** phóng to 260 dpi (`<LV>\z\p2s_c1.png`): đề in rõ $\dfrac{x-3}{5}<6-\dfrac{1-2x}{3}$, chép đúng ⇒ $x>-\dfrac{94}{7}$ là đáp số thật (thử hai phía biên + 5 000 điểm ngẫu nhiên).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 5 | chép đề | "kể từ lúc cất cánh máy bay **bay** lên cao được" ⇒ "máy bay lên cao được" | Ảnh phóng to (`<LV>\z\p2s_c5.png`) chỉ có một chữ "bay" ở câu hỏi (khung gõ thừa) |
| Bài 4 | lập luận | Thêm lí do "$AH\perp BM$ và $\triangle ABM$ vuông tại $A$ (các góc $B$, $M$ nhọn) nên $H$ nằm giữa $B$ và $M$" | Bản soạn khẳng định $H$ nằm giữa $B$, $M$ không có căn cứ — đây là mắt xích để suy ra $M$, $D$ cùng phía $I$ |
| Bài 4 | hình | `giai_P2B4.png`: ghi thêm số đo đề cho $AB=12$ cm, $BC=9$ cm (sửa `ve_p2.mjs`, nới khung sang phải 30 px) | Brief: hình ghi số đo đề cho; hình cũ không có số đo nào |

Hình đề `de_P2C5.png` (ảnh máy bay, góc $24^\circ$): đúng câu, không dính chữ câu khác. Hình giải `giai_P2B5.png` (tam giác $ABH$ vuông tại $H$, góc $A=24^\circ$): đúng dữ kiện, không ghi kết quả phải tìm. `giai_P2B4.png`: dựng đúng tỉ lệ $12:9$, $BH\perp AC$, $HI\perp AD$, $AK\perp BI$, $N$ trên $DC$ ($DN=5{,}25$), $M$ trên tia $AD$ kéo dài ($AM=16$), đủ điểm, nhãn không đè.

Các câu còn lại (1a, 1b, 2a, 2b, 3, 6): đề khớp ảnh, đáp số khớp, đúng luật khối 9 (không Δ, không `⇔`, không "tập nghiệm", bất phương trình chia $-7$ có đổi chiều và nói rõ, bất đẳng thức chứng minh bằng tổng bình phương), Phần 1 không lộ đáp số.

## Câu còn `Chưa chắc`

Không có.
