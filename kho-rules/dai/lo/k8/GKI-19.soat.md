KẾT LUẬN: ĐẠT

# GKI-19 — Biên bản soát (THCS Nguyễn Chơn, phường Thanh Khê — giữa kì 1 Toán 8, 2025–2026; đề scan 2 trang)

- Số câu sau khi tách ý: **20** (Câu 1–10 trắc nghiệm · Câu 11–12 trả lời ngắn · Bài 1, 2a, 2b, 2c, 3a, 3b, 3c, 4 tự luận); 18 câu `dai`, 2 câu `hinh_hoc` (Câu 11, 12).
- Khớp đáp án Pha 1 (giải mù, `GKI-19.kiem.md`) ngay từ đầu: **19 / 20**. Lệch: Câu 2 (bản soạn chọn C, giải mù ra B).
- Số câu phải sửa: **9** — đáp án 1 (Câu 2) · dòng Chưa chắc thừa 1 (Câu 4) · Phần 1 lộ đáp số 3 (Câu 5, Câu 11, Bài 4) · Phần 1 có bước quá vụn 4 (Bài 2b, 2c, 3a, 3b — đây là 5 lỗi cổng của bản bị ngắt) · kèm theo: từ "nghiệm" (Bài 3b), công thức gõ hỏng (Bài 4), 2 dòng Ghi chú không phải lỗi đề (Bài 3a, 3b), thêm hình giải (Bài 4). Không câu nào chép sai đề; không câu nào sai toán trong Phần 2 ngoài Câu 2.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: trước khi sửa ❌ 5 lỗi (bước quá vụn); sau khi sửa ✔ đạt cổng (20 câu · 10 TN · 2 TLN · 8 tự luận · hình 1 · chưa chắc 1).
- Bản trước khi sửa: `GKI-19.soan.goc.md`.

## Cách soát

- Pha 1: đọc `trang/p-1.png`, `p-2.png`; ảnh gốc trong PDF chỉ 208 ppi nên cắt phóng to 300 dpi toàn bộ (10 mảnh `tam/s-1a … s-2c.png`) và 600–900 dpi cho các chỗ số mũ nhỏ
  (`s-c2`, `s-c3`, `s-c4`, `s-c5m`, `s-b1m`, `s-b4h`). Máy kiểm `tam/s-kiem.mjs` (viết trước khi mở bản soạn): mọi đẳng thức đa thức thay 40 bộ số nguyên ngẫu nhiên (BigInt),
  Câu 7 thử cả bốn phương án, Bài 3b vét $x$ từ $-50$ đến $50$, Bài 4 thay ngược — tất cả khớp.
- Pha 2: so từng câu của bản soạn với ảnh (số, số mũ, dấu, phương án, đủ ý) — **đề chép đúng 20 / 20**; đọc từng dòng lời giải theo `k8.md` §1, §10; chạy lại `tam/kiem.mjs` của trạm soạn
  (trạm soạn ĐÃ có script thử lại, in "TAT CA OK" — kể cả cách tách bình phương khác của Bài 3c).
- Luật kiến thức: đề chạm tới hằng đẳng thức (Câu 7–10, Bài 3a, 3c) và phân tích nhân tử (Bài 2) ⇒ lời giải được dùng cả hai; hình chỉ có tổng các góc của tứ giác (Câu 11, 12).
  Không có đường trung bình, Thalès, Pythagore, "phương trình – tập nghiệm" (đã sửa một chữ "nghiệm" ở Bài 3b).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 2 | đáp số | `dap_an` C → **B**; sửa Mấu chốt, Bước 3, Phần 2 (bỏ "Nhóm 4: $\dfrac{2}{5}$", kết luận 3 nhóm, "Chọn B."); viết lại dòng `Chưa chắc` | Đề hỏi "mấy nhóm đơn thức **đồng dạng với nhau**": một nhóm phải có từ hai đơn thức; số $\dfrac{2}{5}$ đứng một mình, không đồng dạng với đơn thức nào trong dãy nên không thành nhóm. Bản soạn đếm nó thành nhóm thứ tư. Hai trạm lệch nhau và đề không in đáp án ⇒ giữ `Chưa chắc` cho CEO |
| Câu 4 | định dạng (Chưa chắc thừa) | Xoá dòng `**Chưa chắc:**` (số mũ $y^5$ đọc từ ảnh mờ); chuyển lời giải thích xuống GHI CHÚ CHO NGƯỜI DUYỆT | Phóng to 900 dpi: nét số mũ ở $x^2y^5$ trùng nét số mũ 5 của $8x^5$ ở Câu 5 — mà phương án A của Câu 5 ("5; 3; 1") liệt kê đúng các số mũ đó nên biết chắc nét ấy là số 5; số mũ 3 trong cùng bản scan có nét khác hẳn. Hai trạm đọc độc lập đều ra $y^5$ |
| Câu 5 | lập luận (Phần 1 lộ đáp án) | Bước 2 bỏ dãy "$8$; $2$; $-7$ và hệ số của hạng tử $1$"; Chú ý bỏ "phương án A là…, phương án B thiếu…" ⇒ nói cách nghĩ (lấy cả dấu, không sót hệ số tự do, không nhầm số mũ) | Phần 1 không được ghi đáp số cuối; bản cũ liệt kê đủ bốn hệ số và loại sẵn hai phương án |
| Câu 11 | lập luận (Phần 1 lộ đáp số) | Bước 1–3 viết lại: nhớ định lí → nếu quên thì kẻ đường chéo chia tứ giác thành hai tam giác → hai lần tổng ba góc của tam giác | Bước 1, Bước 2 bản cũ ghi thẳng $360^\circ$ — chính là đáp số của câu trả lời ngắn |
| Bài 2b | định dạng (bước quá vụn — lỗi cổng) | Bước 1, 2, 3 viết thành câu đủ ý (nhóm theo bậc; nhóm đầu có dạng $A^2+2AB+B^2$; nhóm sau đặt $-2$ ra ngoài) | Cổng báo Bước 1, Bước 2 dưới 5 chữ ngoài công thức; Bước 2 cũ chép nguyên dòng tính của Phần 2 |
| Bài 2c | định dạng (bước quá vụn — lỗi cổng) | Bước 1 viết đủ ý (nhóm bốn hạng tử bậc ba, hai hạng tử bậc hai) | Cổng báo Bước 1 quá vụn |
| Bài 3a | định dạng (bước quá vụn — lỗi cổng) + ghi chú | Viết lại Bước 1–3 (vì sao không thay thẳng → nhận dạng bình phương của một tổng → thay số), thêm Chú ý; bỏ $(x+6)^2$ khỏi Mấu chốt; xoá dòng `Ghi chú` | Cổng báo Bước 2 quá vụn; "Bước 1: nhận ra $x^2=x^2$" không phải bước nghĩ. Ghi chú cũ nói về cách phân loại (đáp số 7 chữ số, tách ý) — không phải lỗi đề gốc ⇒ chuyển xuống GHI CHÚ CHO NGƯỜI DUYỆT |
| Bài 3b | định dạng (bước quá vụn — lỗi cổng) + kiến thức + ghi chú | Bước 2 viết thành bước nghĩ (tích bằng 0 ⇒ xét hai trường hợp), không ghi sẵn $x=0$; Chú ý: "mất nghiệm $x=0$" → "mất một giá trị của $x$"; xoá dòng `Ghi chú` | Cổng báo Bước 2 quá vụn và bước đó lộ đáp số; từ "nghiệm" thuộc phương trình (Chương VII, cấm ở đề giữa kì 1); Ghi chú cũ chỉ nói về phân loại |
| Bài 4 | định dạng + lập luận (lộ đáp số) + hình | Bước 2: bỏ công thức gõ hỏng `$=2 \cdot ($chiều dài + chiều rộng$)$`, viết bằng lời; Bước 3 gọn lại; Chú ý bỏ "$x=30$ … $5$ m và $15$ m", thay bằng cách thử lại và điều kiện $x>25$; thêm `**Hình giải:** giai_bai4.png` (`tam/ve.mjs`) | Công thức cũ hiển thị thành ba mảnh rời; Chú ý cũ ghi sẵn giá trị $x$ và kích thước mảnh đất. Hình scan của đề mờ (nhãn "15 (m)" và chữ trong ô xám khó đọc) nên vẽ lại bằng code cho lời giải: đúng tỉ lệ thật, mảnh đất $5\times 15$, script tự kiểm chu vi $=40=4x-80$ |
| Cuối tệp | định dạng | "Tổng 19 câu" → 20 câu; bỏ Câu 4 khỏi danh sách cần CEO xem; thêm lí do phân loại Bài 3a, 3b, lỗi ngắt câu của Câu 1, ghi chú về hình Bài 4 | Đếm sai (10 + 2 + 8 = 20); cập nhật theo các chỗ sửa trên |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Bài 3c:** bản soạn tách $M=(x-3)^2+(x-3y)^2+(y+6)^2+2014y^2+1978$; giải mù tách $(x-3y)^2+(x-3)^2+(2y+3)^2+2011y^2+2005$. Hai cách đều đúng (máy kiểm khớp cả hai), giữ cách của bản soạn.
- **Tách ý:** Bài 2 (phân tích nhân tử, 3 ý độc lập) tách đúng luật. Bài 3 là cái vỏ gom ba bài toán khác hẳn nhau, không chung dữ kiện (tính nhanh · tìm $x$ · chứng minh) ⇒ tách 3a / 3b / 3c là hợp luật. Bài 1 (chung $P$, $Q$) và Bài 4 (bài lời văn) giữ chung — đúng.
- **Phân loại:** Câu 11 (360), Câu 12 (167) vừa 4 ô ⇒ `tra_loi_ngan`, kho `hinh_hoc`. Bài 3a ($1\,000\,000$, 7 chữ số) và Bài 3b (hai giá trị) ⇒ `tu_luan`. Bài 4 là bài thực tế viết / tính biểu thức ⇒ `dai`.
- **Ghi chú giữ lại:** Bài 2a/2b/2c (đề in "các thức" thay vì "các đa thức" — lỗi đề gốc); Bài 4 (dữ kiện chỉ có trên hình).
- **Hình `p3c4_1.png`:** đúng hình của Bài 4, đủ ba nhãn 25 (m), 15 (m), $x$ (m), không cụt, không dính chữ câu khác. Nhãn "15 (m)" in mờ nhưng đọc chắc: nếu là 25 thì mảnh đất thành hình vuông $10\times10$ (trái với "hình chữ nhật" và với hình vẽ cao hơn rộng), còn 15 cho $x=30$, mảnh đất $5\times15$.
- **Hình giải:** đề không có bài hình tự luận nào nên không có hình giải bắt buộc; hình `giai_bai4.png` là hình thêm (xem bảng trên).
- **Bộ sách:** KNTT — đề đi đúng thứ tự Chương I → II (tới phân tích nhân tử) → bài Tứ giác, không có Pythagore, hình chóp, phân thức.

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 2** — đề có hai cách đếm "nhóm đơn thức đồng dạng với nhau": **B (3 nhóm)** nếu nhóm phải có từ hai đơn thức (đáp án đang chọn — số $\dfrac{2}{5}$ đứng một mình không thành nhóm); **C (4 nhóm)** nếu người ra đề tính $\dfrac{2}{5}$ là một nhóm riêng. Trạm soạn chọn C, trạm soát giải độc lập ra B; đề không in đáp án.
