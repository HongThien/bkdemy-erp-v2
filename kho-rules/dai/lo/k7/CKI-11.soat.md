KẾT LUẬN: ĐẠT

# CKI-11 — Biên bản soát (Opus, 14/10)

Đề: THCS Tân Triều, kiểm tra đánh giá cuối học kì I Toán 7, năm học 2025–2026, 90 phút, 2 trang (trang 21–22 của BỘ-ĐỀ-CKI-7.pdf). Bộ KNTT.
Phạm vi: mọi câu nằm trong Chương I–V KNTT (số hữu tỉ, số thực, tam giác bằng nhau c.c.c / tam giác vuông, thu thập – biểu diễn dữ liệu). Không có kiến thức ngoài phạm vi cuối kì 1.

- Số câu: **16** (8 trắc nghiệm · 1 trả lời ngắn · 7 tự luận; Hình học 3 câu: Câu 7, Câu 8, Bài 4).
- Khớp đáp án Pha 1 (`CKI-11.kiem.md`) ngay từ đầu: **16/16**.
- Số câu phải sửa: **7** (Câu 3, Câu 8, Bài 1c, Bài 2a, Bài 3, Bài 4, Bài 5) — không câu nào sửa đáp số, không lỗi chép đề.
- Chép đề: đối chiếu ảnh trang đủ 8 câu TN + 5 bài, đúng số, dấu, số mũ, giá trị tuyệt đối, phương án. Khung tên trường / thời gian đã bỏ đúng.
- Hình: `p1c5.png` (biểu đồ đoạn thẳng), `p1c6.png` (biểu đồ quạt), `p2c8.png` (tam giác có kí hiệu cạnh bằng nhau) — đúng câu, không cụt, không dính chữ.
- Phân loại: đúng (`kho=hinh_hoc` cho Câu 7, 8, Bài 4; còn lại `dai`; Bài 1b `tra_loi_ngan` = 5; phân số ⇒ `tu_luan`). Tách ý Bài 1, Bài 2; Bài 3, 4 giữ chung — đúng luật.
- Cổng: `dung-de-tu-soan.mjs … --khoi 7 --chi-kiem` ⇒ **✔ đạt cổng** (16 câu, hình 3, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 3 | định dạng (Phần 1) | `Chú ý` "hai luỹ thừa bằng nhau chia cho nhau thì được 1" ⇒ "luỹ thừa bậc 0 của một số khác 0 thì bằng 1, không bằng 0" | Câu cũ lộ thẳng đáp án A |
| Câu 8 | lập luận | Lý do loại D: "$\widehat{BAC}$ không bằng $\widehat B$" ⇒ "đề chỉ cho $AB=AC$, không cho $AB=BC$, nên không có căn cứ…"; lý do $AB=AC$, $MB=MC$ ghi "(giả thiết)" | Khẳng định "không bằng" không chứng minh được từ dữ kiện; chỉ được nói "không có căn cứ" |
| Bài 1c | kiến thức | Bỏ "căn của phân số = căn tử trên căn mẫu" (Phần 1 Bước 1); thêm dòng `Vì $\left(\dfrac25\right)^2=\dfrac4{25}$ và $\dfrac25>0$ nên $\sqrt{\dfrac4{25}}=\dfrac25$` theo khuôn `NNB00966`; thêm dòng trung gian $\dfrac55+\dfrac34$ | Quy tắc $\sqrt{a/b}=\sqrt a/\sqrt b$ không có trong SGK 7 |
| Bài 2a | lập luận (Phần 1) | Bước 1 "chuyển $2x$ sang một vế và $\dfrac16$ sang vế kia" ⇒ "coi $2x$ là số trừ chưa biết: số trừ = số bị trừ − hiệu" | Bước cũ lộn xộn, không khớp Mấu chốt và Phần 2 |
| Bài 3 | phân loại / lập luận | Xoá `Chưa chắc` ý a); Phần 2 a) nêu các giá trị đều là số rồi kết luận "dữ liệu là số (số liệu)" | KNTT Bài 17 chỉ chia "dữ liệu là số (số liệu)" / "không phải là số" (Câu 4 của chính đề dùng đúng cách gọi này) — đáp án chắc chắn |
| Bài 4 | lập luận | Xoá `Chưa chắc` ý c); lý do góc đối đỉnh ghi gọn: $K\in ME$, $H\in MC$, $M$ nằm giữa $A$ và $C$, $M$ nằm giữa $D$ và $E$; ghi chú người duyệt thêm g.c.g (HH00102) | $M$ nằm giữa $D$, $E$ là chắc: đoạn $DM$ nằm trong tam giác $ABC$ nên không gặp tia $BA$, $E$ phải ở sau $M$. Tia $MN$ nằm trong góc $KMH$ là cấu hình chuẩn của bài lớp 7, không phải chỗ đáng ngờ |
| Bài 5 | lập luận | "Hai vế bằng nhau nên cả hai cùng bằng 5" ⇒ nêu đủ: vế trái không nhỏ hơn 5, vế phải không lớn hơn 5, mà hai vế bằng nhau | Câu cũ nhảy bước |

Kiểm thêm, không sửa: Câu 5, 6 số liệu biểu đồ để trong `Ghi chú` (không chép vào Đề vì câu hỏi chính là đọc biểu đồ — giống GKI-05 Câu 2). Câu 7 `Ghi chú` kí hiệu độ in lẫn lộn — lỗi trình bày, đáp án không đổi.

## Câu còn `Chưa chắc`

Không. (Trạm soạn có 2 dòng `Chưa chắc` — Bài 3a, Bài 4c — đều đã kiểm chắc chắn và xoá, lí do ở bảng trên.)

## ẢNH CHO CEO

Không. (Không câu nào còn `Chưa chắc`; không câu nào có lỗi / thiếu dữ kiện của đề gốc cần CEO sửa — Ghi chú Câu 7 chỉ là kí hiệu độ in lẫn lộn, đã chuẩn hoá.)
