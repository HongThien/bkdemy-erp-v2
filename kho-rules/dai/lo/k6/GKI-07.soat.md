KẾT LUẬN: ĐẠT

# Biên bản soát GKI-07 — Giữa học kì I Toán 6, Trường TH, THCS & THPT Đa Trí Tuệ, 2025–2026, mã đề 02

- Nguồn soát: ảnh `trang/p-1.png`, `trang/p-2.png` (trang 3–4 là đề khác — mã GKI-07b — không soát ở đây).
- Bản giải mù (Pha 1): `GKI-07.kiem.md`, ghi xong TRƯỚC khi mở bản soạn. Bản soạn nguyên gốc trước khi sửa: `GKI-07.soan.goc.md`.
- Cổng: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k6/GKI-07.soan.md --lam-viec "<LV>" --chi-kiem` ⇒ **✔ đạt cổng**
  (2 phần · 21 câu: 12 TN · 6 TLN · 3 tự luận · HGT 0 · hình 0 · chưa chắc 1).

## Số liệu

- Số câu: **21** (Câu 1–12 · Bài 1 · Bài 2a, 2b, 2c · Bài 3a, 3b, 3c · Bài 4 · Bài 5).
- Khớp đáp án / đáp số với Pha 1 ngay từ đầu: **20 / 20 câu có đáp số chốt được** (11 TN + 6 TLN + Bài 1, Bài 4 cùng kết quả; Bài 5 cùng hướng chứng minh).
  Câu 2: hai bên **cùng nhận định** đề có hai phương án đúng (B và C) — không bên nào chốt được, giữ `Chưa chắc`.
- Không có câu nào lệch đáp số giữa hai lượt giải.
- Chép đề: soát từng câu với ảnh — đúng số, số mũ, ngoặc, đủ 4 phương án, đủ ý; không sót, không thừa câu. Đề không có phần tiếng Anh, không có hình.
- Số câu phải sửa: **5** (không câu nào sửa đáp số, không câu nào sửa đề) + 1 câu viết lại dòng `Chưa chắc` cho rõ.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 6 | định dạng (ghi chú) | Xoá dòng `**Ghi chú:**` "đề gốc in Lũy thừa — chép thành Luỹ thừa…" | Không phải lỗi của đề gốc, chỉ là hai cách đặt dấu thanh của cùng một chữ; ghi chú không mang thông tin cho người duyệt. |
| Câu 10 | lập luận | Phần 2: "Số 17 không chia hết cho 2 và 3 **nên** chỉ có hai ước…" ⇒ "Số 17 lớn hơn 1 và chỉ có hai ước là 1 và 17 nên 17 là số nguyên tố". Phần 1 Bước 2: "thử chia cho các số nguyên tố nhỏ như 2, 3" ⇒ "lần lượt thử chia cho các số nhỏ hơn nó (2, 3, 4, …)". | Suy luận "không chia hết cho 2 và 3 ⇒ nguyên tố" không đúng nói chung (25, 35…); nó chỉ đúng nhờ tiêu chuẩn "chỉ cần thử các số nguyên tố có bình phương không vượt quá số đó", không có trong lý thuyết bản đồ K6. |
| Bài 1 | lập luận (Chú ý ở Phần 1) | "275 có chữ số tận cùng là 5 nên bắt đầu chia cho 5, không chia cho 2 hay 3" ⇒ "275 là số lẻ và có tổng các chữ số là 14 nên không chia hết cho 2 và cho 3; chữ số tận cùng là 5 nên bắt đầu chia cho 5". | Câu cũ ngụ ý "tận cùng là 5 thì không chia hết cho 3" — sai (15, 45, 75…). Không chia hết cho 3 là do tổng các chữ số. |
| Bài 4 | định dạng (ghi chú) | Xoá dòng `**Ghi chú:**` "bản bóc máy gắn nhầm hình p2c4_1.png…" | Ghi chú về lỗi công cụ, không phải lỗi đề gốc (brief soát mục 6). Đã mở `img/p2c4_1.png`: là hình mảnh đất của đề khác, câu này đúng là không có hình. |
| Bài 5 | lập luận (thiếu điều kiện) | Thêm "($k\in\mathbb{N}^*$)" ở dòng "tức là $p=3k+2$". | Chữ $k$ trước đó chỉ được khai báo trong trường hợp giả định $p=3k+1$ (đã bị loại); dùng lại phải nói rõ. |
| Câu 2 | (không phải lỗi — viết lại `Chưa chắc`) | Ghi rõ đây là lỗi của đề gốc, trạm soát cũng ra hai phương án đúng, và nêu hai hướng xử lí. | Để CEO quyết nhanh. Đáp án tạm vẫn là B như bản soạn. |

## Đã soát mà KHÔNG sửa (ghi lại để người duyệt biết)

- **Bài 1** để `tu_luan`, giữ chung 3 ý — đúng luật (chỉ tách bài Tính và Tìm $x$). Dòng `**Ghi chú:**` "lời giải viết theo sơ đồ cột, không vẽ sơ đồ cây" được giữ vì đề cho chọn một trong hai cách.
- **Bài 5**: chứng minh tự đủ, không trích "chia hết cho 2 và 3 thì chia hết cho 6" như một quy tắc — dùng phép chia có dư cho 3 rồi lập luận chẵn lẻ để viết $p+1=6n$. Đúng toán từng dòng; đã thử máy mọi cặp nguyên tố sinh đôi $p<100000$.
- **Bài 3c**: tìm $x$ bằng thành phần chưa biết, không chuyển vế; đưa $27$ về $3^3$ rồi so số mũ — đúng khuôn NNB00899.
- **Bài 4**: đúng khuôn NNB00921 (gọi ẩn → ƯC → ƯCLN → phân tích → tính phụ → Vậy).
- Phân kho: cả 21 câu `kho=dai` — đúng, đề không có câu hình.
- Mục `## GHI CHÚ CHO NGƯỜI DUYỆT` ở cuối bản soạn (tệp PDF 4 trang chứa hai đề của hai trường) giữ nguyên — đây là điều người duyệt cần biết.

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| **Câu 2** | Lỗi đề gốc: "Chữ số 2 trong số 24 826 có giá trị là" — số này có HAI chữ số 2 (hàng chục nghìn ⇒ $20000$ = phương án B; hàng chục ⇒ $20$ = phương án C), nên có hai phương án đúng. Bản soạn tạm chọn **B**. Cần CEO chọn: (a) giữ B, (b) đổi C, hoặc (c) sửa đề thành "chữ số 2 ở hàng chục nghìn" để chỉ còn một phương án đúng. |
