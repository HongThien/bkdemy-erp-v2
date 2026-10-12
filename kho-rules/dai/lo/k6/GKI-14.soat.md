KẾT LUẬN: ĐẠT

# GKI-14 — biên bản soát (trạm soát, 10/10)

> THCS Lê Ngọc Hân — Giữa kì I, 2025–2026 (2 trang scan). Pha 1 giải mù: `GKI-14.kiem.md` (ghi xong trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-14.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ "✔ đạt cổng" (2 phần · 18 câu: 8 TN · 6 TLN · 4 tự luận · HGT 3 · hình 2 · chưa chắc 1).

## Số liệu

- Số câu: **18** (8 câu trắc nghiệm + Bài 1a–c, Bài 2a–d, Bài 3, Bài 4, Bài 5). Đề không có phần tiếng Anh, không câu nào bị bỏ.
- Khớp đáp án Pha 1 ngay từ đầu: **18 / 18** (không câu nào lệch đáp án / đáp số).
- Số câu phải sửa: **5** — 3 câu sửa nội dung (Câu 1, Câu 3, Câu 5) + 2 câu chỉ sửa dòng cờ (Câu 7 viết lại `Chưa chắc`, Bài 3 xoá `Chưa chắc`). Không sửa đáp án nào, không sửa dòng tính nào của Phần 2.

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Tên đề | định dạng | "THCS Lê Ngọc Hân (đề không ghi quận, không ghi mã đề)" → "THCS Lê Ngọc Hân (bộ đề GKI 6, đề 14)" | Dòng `# ĐỀ` thành tên đề trên ERP; lời nhận xét của trạm soạn không được nằm trong tên. Viết theo kiểu GKI-13 |
| Câu 1 | định dạng (Phần 1) | Viết lại 3 bước: đọc phần tử trong dấu ngoặc nhọn → đối chiếu từng phương án ($\in$) → số không có mặt là $\notin$ | Bước 1 cũ là bước "Đọc kĩ câu hỏi" (brief soạn cấm bịa bước đọc đề), lại trùng ý với `Mấu chốt` và `Chú ý` |
| Câu 3 | lập luận | Phần 1, Bước 3: bỏ "tổng (hiệu) **chỉ** chia hết cho 5 **khi** mọi số hạng đều chia hết cho 5", viết lại đúng hai chiều của tính chất (mọi số hạng chia hết ⇒ chia hết; đúng một số hạng không chia hết, các số còn lại chia hết ⇒ không chia hết) | Câu cũ sai toán ($2+3$ chia hết cho 5 mà không số hạng nào chia hết) — đúng chỗ `k6.md` §2 nhóm NNB00905 dặn "tổng chia hết không suy ra từng số chia hết" |
| Câu 3 | chép đề (lỗi của đề gốc) | Thêm dòng `Ghi chú`: phương án C có số bị trừ $12760$ nhỏ hơn số trừ $5.3^{2025}$ nên hiệu không phải số tự nhiên; giữ nguyên đề, đáp án vẫn C | Giữa kì 1 lớp 6 chưa học số nguyên âm — người duyệt cần biết. Đáp án C chắc chắn: A = 193, B = 2587, D = 481 đều không chia hết cho 5 (tính máy), $12760-5.3^{2025}$ chia hết cho 5 (tính máy bằng BigInt) |
| Câu 5 | chép đề | "giá 8000 đồng" → "giá 8 000 đồng" | Đề gốc in "8 000 đồng"; luật viết liền số chỉ áp cho số trong công thức (các phương án cùng câu vẫn viết "192 000 đồng") |
| Câu 7 | định dạng (dòng cờ) | Giữ `Chưa chắc`, viết lại cho chính xác: hình của đề gốc bị kéo dãn ngang ~1,3 lần; kèm số đo và câu hỏi cần người duyệt quyết | Đo trên `p1c7_chung.png`: hình a đáy ≈ 190 px, cạnh bên ≈ 157 px. Nén ngang 0,76 lần ⇒ đáy ≈ 144, cạnh bên ≈ 144 (đều); b, c, d vẫn không đều. Chữ trên trang không dãn ⇒ lỗi nằm ở hình của đề gốc, không phải do scan |
| Bài 3 | định dạng (dòng cờ) | Xoá dòng `Chưa chắc` ở ý b (34 phút hay 33 phút) | Đã kiểm chắc: đề hỏi "ít nhất bao nhiêu phút" để đốt 500 calo; $500:15=33$ dư $5$, 33 phút mới đốt 495 calo (chưa đủ), 34 phút đốt 510 calo ⇒ 34. Cùng kiểu "chia có dư thì thêm 1" với Câu 4 của chính đề này. Pha 1 giải độc lập cũng ra 34 |
| Mục cuối tệp | — | Cập nhật `GHI CHÚ CHO NGƯỜI DUYỆT`: bỏ câu nói về bản máy gõ, sửa "Câu 3 ý b" thành "Bài 3 ý b", ghi hai chỗ chưa chuẩn của đề gốc (Câu 3, Câu 7) | Cho khớp nội dung từng câu; lỗi công cụ không ghi trong tệp soạn |

## Đã soát, không phải sửa

- **Đề**: 18 câu chép đúng ảnh. Số mũ đã soi lại trên bản cắt 300 dpi từ `goc.pdf`: $3^{2025}:3^3$, $3^{1012}$, $3^{2022}$ (Câu 2) · $5.3^{2025}$ (Câu 3) · $6^2$, $2025^0$, $(18-12)^2$, $3^2$ (Bài 1) · $2^3$, $5^{100}:5^{98}$ (Bài 2) · $2^{64}-1$ (Bài 5). Đủ 4 phương án mỗi câu, đủ ý a–d. Bài 3 đổi "1,600 - 2,000" thành "1 600 - 2 000" đã có `Ghi chú` của trạm soạn — hợp lí, giữ.
- **Lời giải**: mọi dòng tính của Phần 2 tính lại bằng máy đều đúng (D · B · C · 14 xe · 192000 · 250000 · A · 6 · 297 · 720 · 2024 · 520 · 12 · 5 · $\{30;35\}$ · 840 / 34 · 55 / 4400000 · $1+2+\dots+2^{63}=2^{64}-1$). Tìm $x$ theo thành phần chưa biết, không chuyển vế; dấu nhân là dấu chấm; Bài 2d đúng khuôn NNB00905, Bài 5 đúng khuôn NNB00902; Phần 1 đủ 3–4 bước, không lộ đáp số, không chép Phần 2.
- **Phân loại**: Câu 7, Câu 8, Bài 4 `kho=hgt`; Bài 2d (hai giá trị) `tu_luan`; Bài 3, Bài 4 (lời văn nhiều ý) giữ chung một câu; Bài 5 (đúng / sai, vì sao) `tu_luan`; chỉ tách Bài 1 và Bài 2 — đúng luật.
- **Hình**: `p1c7_chung.png` đủ bốn hình a–d kèm nhãn, không cụt; `p2c5_1.png` đúng hình bàn cờ của Bài 5 (minh hoạ).

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Câu 7 | Hình của đề gốc bị kéo dãn theo chiều ngang (~1,3 lần) nên theo đúng hình in, hình a không đều tuyệt đối (đáy dài hơn cạnh bên ~1,2 lần). Đáp án **A** không đổi (nén lại thì a đều, b / c / d không). Cần CEO quyết: giữ hình scan như đề gốc, hay thay bằng hình nén lại đúng tỉ lệ trước khi học sinh làm trên app. |

## Điều người duyệt nên biết thêm (không phải `Chưa chắc`)

- Câu 3: phương án C của đề gốc là một hiệu có số bị trừ nhỏ hơn số trừ (xem `Ghi chú` của câu). Đáp án C chắc chắn, đề giữ nguyên.
