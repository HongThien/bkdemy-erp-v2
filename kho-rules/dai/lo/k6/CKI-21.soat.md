KẾT LUẬN: ĐẠT

# CKI-21 — Biên bản soát (trạm soát, 10/10)

Đề: kiểm tra cuối học kì 1 Toán 6 năm 2025-2026 — UBND xã Đông Anh, Phòng Văn hóa – Xã hội (đề chính thức, 1 trang, toàn tự luận, không có phần tiếng Anh).

- **Số câu:** 13 (Bài 1 · 2a–2d · 3a–3d · 4.1 · 4.2 · 5 · 6) — 8 trả lời ngắn, 5 tự luận; 1 câu hình (Bài 5, kho HGT).
- **Khớp đáp án Pha 1 ngay từ đầu:** 13 / 13 (bản giải mù `CKI-21.kiem.md` ghi trước khi mở bản soạn; mọi đáp số đã vét cạn bằng `node -e`).
- **Số câu phải sửa:** 6 (Bài 2b, 2c, 3c, 4.1, 5, 6) — không câu nào sai đáp số, không câu nào chép sai đề; ngoài ra Bài 1 chỉ viết lại dòng `Chưa chắc` (không tính là lỗi). Bản gốc trước khi sửa: `CKI-21.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --chi-kiem` ⇒ "✔ đạt cổng" (1 phần · 13 câu · 0 TN · 8 TLN · 5 tự luận · HGT 1 · hình 1 · chưa chắc 1).

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1 | (không phải lỗi — viết lại dòng `Chưa chắc`) | Ghi rõ phần đã kiểm chắc: đề in $x\in N$ (không phải $Z$); phần còn treo là ý người ra đề, kèm hai phương án đáp số 15 / 9 | Trạm soạn chưa chắc kí hiệu; đã soi ảnh 600 dpi + lớp chữ PDF nên phần "đọc" hết nghi ngờ, chỉ còn việc CEO quyết giữ hay sửa đề |
| Bài 2b | kiến thức (từ ngữ) | Phần 1 Bước 2, Bước 3, Chú ý: bỏ chữ "phương trình", "nghiệm" ⇒ "bài tìm $x$", "giá trị của $x$" | "Phương trình", "nghiệm" là từ của lớp 8; lớp 6 chỉ có "tìm $x$" |
| Bài 2c | kiến thức (từ ngữ) | Phần 1 Bước 3: "Giải phương trình số mũ" ⇒ "Từ đẳng thức của hai số mũ, tìm $x$ bằng cách tìm số bị trừ $2x$ trước rồi tìm thừa số chưa biết" | Như trên |
| Bài 3c | lập luận (Phần 1) | Bước 1 tả sai biểu thức ("một tích nhân với $-31$") ⇒ tả đúng: hai tích $47.69$ và $31.(-47)$ có thừa số 47 và $-47$. Chú ý viết "$-31.(-47)=+31.47$ vì nhân hai số cùng dấu" ⇒ "$31.(-47)=-(31.47)$ nên trừ đi $31.(-47)$ là cộng với $31.47$" | Trong đề thừa số là $31$ và $(-47)$, không có $-31$; dấu trừ là phép trừ giữa hai tích. Phần 2 và đáp số vốn đúng, không đổi |
| Bài 4.1 | định dạng (khuôn) | Dòng gọi ẩn thêm $x\in\mathbb{N}^*$ | Khuôn NNB00921 / NNB00925 (`k6.md` §2): gọi ẩn kèm điều kiện $x\in\mathbb{N}^*$ |
| Bài 5 | chép đề (ghi chú thiếu) | Dòng `Ghi chú` bổ sung lỗi in thứ hai của đề gốc: "dáy nhỏ" ⇒ "đáy nhỏ" (đề trong bản soạn đã sửa sẵn nhưng chưa khai) | Sửa chữ của đề gốc thì phải khai trong `Ghi chú` |
| Bài 6 | lập luận (Phần 1) | Dòng `Thử lại` chung chung ("số vở chia cho số bút là một số tự nhiên") ⇒ thử lại bằng số: $n=2$, $30:5=6$ | Thử lại phải là phép tính thật như mẫu GKI-01 |
| Ghi chú cho người duyệt | — | Thêm dòng về Bài 1 (đề in "1)" không có "2)"; kí hiệu $N$) | Điều người duyệt cần biết |

## Đã soát, không phải sửa

- **Đề** của 13 câu khớp ảnh trang: số, số mũ ($7^{2x-6}$, $4^3$, $5^2$), dấu âm ($(-6).(-5)$, $31.(-47)$), gạch ngang $\overline{3a4b}$, kí hiệu chia hết ở Bài 2d (ba chấm dọc, **không** gạch chéo — soi 400 dpi).
- **Phân loại:** Bài 2, Bài 3 tách từng ý (bài Tìm $x$ / Tính) · Bài 4 tách thành 4.1 và 4.2 (hai bài toán khác hẳn, mỗi bài một bộ dữ kiện) · Bài 1, Bài 5, Bài 6 giữ chung · Bài 2b, 4.2, 6 có hai giá trị trong đáp số ⇒ tự luận là đúng · các đáp số trả lời ngắn ($40$; $4$; $24$; $-20$; $-900$; $4700$; $596$; $504$) đều vừa 4 ô theo đúng đơn vị đề hỏi.
- **Lời giải Phần 2:** đúng toán từng dòng; tìm $x$ theo thành phần chưa biết, không chuyển vế; dấu nhân là dấu chấm; khuôn ƯCLN / BCNN / dấu hiệu chia hết / $an+b\vdots cn+d$ đúng `k6.md` §2.
- **Hình:** `p1b5_hinh.png` đúng hình của Bài 5, đủ nhãn $A, B, C, D, E, F$, `30m`, `24m`, hai phần tô đậm, không cụt, không dính chữ.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 1** — đề in $M=\{x\in N\mid -4<x\le 5\}$. Chữ in chắc chắn là $N$ (ảnh 600 dpi + lớp chữ PDF), nhưng điều kiện $-4<x$ thừa với số tự nhiên ⇒ nhiều khả năng đề định viết $\mathbb{Z}$. Bản soạn đang giữ đúng chữ in: $M=\{0;1;2;3;4;5\}$, tổng $15$. Nếu CEO sửa đề thành $\mathbb{Z}$: $M=\{-3;-2;-1;0;1;2;3;4;5\}$, tổng $9$, phải viết lại lời giải Bài 1.

## Điều người duyệt cần biết (không phải `Chưa chắc`)

- Bài 2b, 3a, 3b, 3c (số nguyên — Ch III) và Bài 5 (diện tích hình thang — Ch IV) thuộc phần lý thuyết bản đồ K6 chưa phủ (`k6.md` §1 luật 3, câu hỏi Q5); lời giải theo quy tắc SGK Kết nối tri thức 6, khuôn chờ CEO duyệt.
