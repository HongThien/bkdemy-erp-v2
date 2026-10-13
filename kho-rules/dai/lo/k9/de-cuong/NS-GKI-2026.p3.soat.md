KẾT LUẬN: ĐẠT

# Biên bản soát — NS-GKI-2026 · Phần 3 (A. Đại số — Bài 6, 15 phương trình a–o) · 13/10

- Số câu: **15** (tất cả `kho=dai`) · sau soát: 2 trả lời ngắn (6m, 6n) · 13 tự luận.
- Khớp Pha 1 (giải mù, `NS-GKI-2026.p3.kiem.md`) ngay từ đầu về **đáp số**: **15 / 15**. Lệch về **phân loại**: 1 câu (6n).
- Số câu phải sửa: **4** (6g, 6j, 6k, 6n) — không câu nào sai đáp số, sai toán hay chép sai đề.
- Máy: `<LV>\tam\mu_p3.mjs` — thay nghiệm vào đề + quét lưới $[-60;60]$ (không sót nghiệm); kiểm cả các phương án "nếu đề là …" của 6b, 6h, 6i, 6j.
- Cổng `dung-de-tu-soan.mjs --khoi 9 --chi-kiem`: ✔ đạt cổng (15 câu · 0 TN · 2 TLN · 13 tự luận · chưa chắc 4).
- Bản gốc trước khi sửa: `NS-GKI-2026.p3.soan.goc.md`.

## Đọc lại đề trên ảnh (260 dpi + 400 dpi: `z/p3_trai|giua|phai.png`, `z/p3_b400|hi400|gj400.png`)

| Ý | Bản in đọc được | Người gõ | Kết luận |
|---|---|---|---|
| 6a | $2x(3x-1)-(3x-1)$ — không có "$=0$" | thêm "$=0$" | Đồng ý (đề "Giải các phương trình", các ý d–k đều "$=0$") |
| 6b | $3(x-5)(x+2)-x^2-5x$ — dấu trước $5x$ là **trừ**, không có "$=0$" | chép đúng, thêm "$=0$", cờ nghi sai dấu | Xác nhận cách đọc. Máy: như in ⇒ $x=\dfrac{7\pm\sqrt{109}}{2}$; nếu $-x^2+5x$ ⇒ $x=5$; $x=-3$ (đúng như cờ) |
| 6c | $(x-1)(2x+3)+2x-2$ — không có "$=0$" | thêm "$=0$" | Đồng ý |
| 6h | $2x^2+3x^2-5=0$ — hai số mũ đều là **2** | chép đúng, cờ nghi sai mũ | Xác nhận. Máy: như in ⇒ $x=\pm1$; nếu $2x^3+3x^2-5=0$ ⇒ $(x-1)(2x^2+5x+5)=0$ ⇒ chỉ $x=1$ (đúng như cờ). Thêm: nếu $2x^4+3x^2-5=0$ ⇒ $(x^2-1)(2x^2+5)=0$ ⇒ vẫn $x=\pm1$ |
| 6i | $x^2-4x^2+4-x=0$ — số mũ đầu là **2** | chép đúng, cờ nghi sai mũ | Xác nhận. Máy: như in ⇒ $x=1$; $x=-\dfrac43$; nếu $x^3-4x^2+4-x=0$ ⇒ $x=4$; $x=1$; $x=-1$ (đúng như cờ) |
| 6j | $x^4-8x^2-9x^3=0$ | chép đúng, cờ nghi in thừa | Xác nhận. Máy: như in ⇒ $x=0$; $x=\dfrac{9\pm\sqrt{113}}{2}$; nếu $x^4-8x^2-9=0$ ⇒ $x=\pm3$ (đúng như cờ); khả năng thứ hai (đảo số mũ) $x^4-8x^3-9x^2=0$ ⇒ $x=0$; $x=9$; $x=-1$ |
| d, e, f, g, k, l, m, n, o | rõ | chép đúng | Khớp ảnh từng số, mũ, dấu |

## Soát luật kiến thức

- Không có $\Delta$ / công thức nghiệm / Viète, không `⇔`, không "tập nghiệm $S$", không biến đổi căn thức chương III ở cả 15 câu.
- Bậc hai, bậc cao đều qua phương trình tích (6a, c, d, e, f, g, h, i, k); 6b, 6j (nghiệm vô tỉ theo bản in) qua hoàn thành bình phương + căn bậc hai số học lớp 7.
- 6k: nhân tử $x^2+x+6$ có chứng minh luôn dương $\left(x+\dfrac12\right)^2+\dfrac{23}{4}>0$.
- 6l, 6m, 6n, 6o: đủ điều kiện xác định + đối chiếu; 6l, 6o vô nghiệm (nghiệm $x=2$ bị loại).
- Phần 1: 3–4 bước / câu, là bước nghĩ, không lộ đáp số cuối (kể cả Chú ý của 6a, 6f).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| 6n | phân loại | `loai=tu_luan`, `dap_an=—` → `loai=tra_loi_ngan`, `dap_an=2,5`; Phần 2 viết $x=\dfrac{5}{2}=2{,}5$, kết luận $x=2{,}5$; thêm dòng $-13=-10x+12$ | Phương trình có đúng MỘT nghiệm, viết được trong 4 ô (`2,5`) ⇒ trả lời ngắn; trạm soạn coi $\dfrac52$ là phân số nên xếp tự luận |
| 6g | kiến thức (lời Phần 1) | Mấu chốt bỏ cụm "không dùng công thức nghiệm" | Học sinh ở chương này chưa học công thức nghiệm — lời hướng dẫn không nhắc tới kiến thức của chương sau |
| 6j | định dạng (gộp bước) + Chưa chắc | Tách dòng "Suy ra $x=…$ hoặc $x=…$" thành hai dòng có bước $2x=9\pm\sqrt{113}$ (như 6b); nối thêm vào cờ Chưa chắc khả năng đề gốc $x^4-8x^3-9x^2=0$ | Mỗi phép biến đổi một dòng; khả năng in đảo số mũ cho nghiệm đẹp $0$; $9$; $-1$ — CEO cần thấy cả hai phương án |
| 6k | định dạng (gộp bước) | "Suy ra $x=1$ hoặc $x=-2$" → nêu rõ $x-1=0$ hoặc $x+2=0$; đoạn chứng minh $x^2+x+6>0$ tách thành 4 dòng (nêu phương trình → hoàn thành bình phương có bước tách → đánh giá → kết luận vô nghiệm) | Một đoạn dồn 3 lập luận; thiếu bước tách $x^2+2\cdot x\cdot\dfrac12+\dfrac14+\dfrac{23}{4}$ |

Ngoài ra bổ sung mục `GHI CHÚ CHO NGƯỜI DUYỆT` (6n là trả lời ngắn; kết quả đọc lại ảnh).

## Câu còn `Chưa chắc` — gửi CEO (4 câu, đều là cờ của người gõ đề, trạm soát xác nhận còn nguyên)

- **Bài 6b** — bản in $3(x-5)(x+2)-x^2-5x$ ra nghiệm vô tỉ $\dfrac{7\pm\sqrt{109}}{2}$; nghi đề gốc là $-x^2+5x$ (khi đó $x=5$; $x=-3$). Đang giải theo bản in.
- **Bài 6h** — bản in $2x^2+3x^2-5=0$ (hai hạng tử cùng bậc hai) ⇒ $x=\pm1$; nghi $2x^3+3x^2-5=0$ (chỉ $x=1$) hoặc $2x^4+3x^2-5=0$ (vẫn $x=\pm1$). Đang giải theo bản in.
- **Bài 6i** — bản in $x^2-4x^2+4-x=0$ ⇒ $x=1$; $x=-\dfrac43$; nghi $x^3-4x^2+4-x=0$ ($x=4$; $x=1$; $x=-1$). Đang giải theo bản in.
- **Bài 6j** — bản in $x^4-8x^2-9x^3=0$ ⇒ $x=0$; $x=\dfrac{9\pm\sqrt{113}}{2}$; nghi $x^4-8x^2-9=0$ ($x=\pm3$) hoặc $x^4-8x^3-9x^2=0$ ($x=0$; $x=9$; $x=-1$). Đang giải theo bản in.

Cả bốn: nếu CEO chốt đề gốc khác bản in thì phải soạn lại lời giải (và 6h theo $2x^3$ sẽ thành trả lời ngắn `1`).
