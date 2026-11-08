KẾT LUẬN: ĐẠT

# TC-GKI-2026 · P6 (PHẦN 3 = C. Một số bài tập nâng cao, Bài 1–4) — biên bản trạm SOÁT (Opus)

- Số câu: **4** (2 trả lời ngắn: Bài 2 `-3,5`, Bài 3 `15` · 2 tự luận: Bài 1, Bài 4). `kho=dai` cả 4, giữ nguyên.
- Khớp Pha 1 ngay từ đầu: **4/4** (giải mù ở `TC-GKI-2026.p6.kiem.md`, máy kiểm `<LV>\tam\soat_p6.mjs`).
  - Bài 1: 4 cặp $(3;-1)$, $(1;-5)$, $(5;-5)$, $(-1;-1)$ — quét $x\in[-2000;2000]$.
  - Bài 2: ĐKXĐ $x\ne0;-1;\dots;-7$; nghiệm duy nhất $x=-3{,}5$ thoả ĐKXĐ; phần ngoặc $\dfrac{8(t^2+18t+90)}{\dots}$ với $(t+9)^2+9>0$ (kiểm đồng nhất bằng máy). `tra_loi_ngan` hợp lệ: một nghiệm, thập phân hữu hạn 4 kí tự.
  - Bài 3: $S=225-(x-15)^2$, $x=15$; đề chỉ hỏi $x$ ⇒ `tra_loi_ngan` `15` đúng phân loại; $x=15$ thuộc cả $0<x<30$ lẫn $0<x\le15$ (rộng ≤ dài).
  - Bài 4: $\triangle BEH\backsim\triangle BAC$ ⇒ $y=40-\dfrac23x$, $S=600-\dfrac23(x-30)^2$ ⇒ $30\ \text{m}\times20\ \text{m}$, $600\ \text{m}^2$.
- Đề: chép đúng ảnh `p-4.png` (đã phóng to 260 dpi `z\p6_C12.png`, `z\p6_C34.png`). Không đề sai.
- Luật kiến thức: không $\Delta$ / Viète / Cô-si thẳng / `⇔` / tập nghiệm $S$; cực trị bằng hoàn thành bình phương; Bài 4 dùng đồng dạng (không đường trung bình). Đạt.
- Số câu phải sửa: **4** (Bài 1, 2, 3 chỉ định dạng nhẹ; Bài 4 hình + định dạng). Không đổi đáp số, không đổi phân loại.
- Cổng `--chi-kiem`: ✔ đạt cổng. Bản gốc trước sửa: `TC-GKI-2026.p6.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 4 | hình | Thêm `**Hình giải:** giai_P3B4.png` (vẽ trong `<LV>\tam\ve_p6.mjs`): tam giác vuông tại $A$, $AB=60$ m đứng, $AC=40$ m ngang đúng tỉ lệ, hình chữ nhật $AEHF$ ($H$ trên $BC$, máy tự kiểm), đường kích thước nét đứt cho cả hai cạnh, nhãn $x$, $y$; vị trí vẽ $AE=20$ m (không lộ vị trí tối ưu) + dòng `**Ghi chú:**` | Hình đề `de_PCB4.png` vẽ sai tỉ lệ ($60$ m vẽ ngắn hơn $40$ m); brief áp dụng TC ghi rõ "C Bài 4 cần hình giải tam giác vuông đủ điểm". Sửa dòng tương ứng trong GHI CHÚ CHO NGƯỜI DUYỆT |
| Bài 1, 2, 3, 4 | định dạng | Bỏ dấu chấm cuối dòng ngay trước dòng tiếp nối bắt đầu bằng `$=…$` (Bài 1 dòng phân tích nhóm; Bài 2 "Biểu thức trong ngoặc vuông là …"; Bài 3 $S=-(x^2-30x)$; Bài 4 $y=\dfrac{40(60-x)}{60}$ và $S=-\dfrac23(x^2-60x)$) | Chuỗi "$=$" là một biểu thức liên tục, dấu chấm giữa chừng làm đứt câu |
| Bài 2 | định dạng (lập luận) | Thêm dòng khai triển $\dfrac{6t^2+132t+720+2t^2+12t}{\dots}$ trước $\dfrac{8t^2+144t+720}{\dots}$ | Mỗi phép biến đổi một dòng (trước đó nhảy thẳng từ tích sang đa thức thu gọn) |

Đã kiểm, không sửa: hình giải `giai_P3B3.png` (hình chữ nhật cạnh $x$, $30-x$, vẽ tỉ lệ ứng $x\approx9$ — không lộ $x=15$, nhãn không đè); hình đề `de_PCB4.png` (đúng câu, không dính chữ câu khác, đủ điểm, giữ). Phần 1 cả 4 câu 4–5 bước nghĩ thật, không lộ đáp số cuối. Dòng `**Ghi chú:**` của Bài 2 (nêu nghiệm) chỉ vào cảnh báo cho người duyệt, không hiện cho học sinh — giữ.

## Câu còn `Chưa chắc`

Không có.
