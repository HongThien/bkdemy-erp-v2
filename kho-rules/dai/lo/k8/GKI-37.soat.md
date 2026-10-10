KẾT LUẬN: ĐẠT

# GKI-37 — Biên bản soát (THCS Tân Bình, TP. Hải Dương, giữa học kì 1 2024–2025)

- Số câu: **16** (đề 12 câu; Câu 8, 9, 10 tách ý thành 8a, 8b, 9a, 9b, 10a, 10b, 10c) — 4 trắc nghiệm · 5 trả lời ngắn · 7 tự luận.
- Khớp đáp án Pha 1 (giải mù, `GKI-37.kiem.md`) ngay từ đầu: **16/16**. Không câu nào lệch đáp số.
- Số câu phải sửa: **4** (8a, 10b, 11, 12) — không sửa đáp số nào; bản gốc lưu ở `GKI-37.soan.goc.md`.
- Đề chép đúng ảnh ở mọi câu (đã phóng 300 dpi Câu 1–3, 5–6, 8–10): số mũ, dấu, phương án, đủ ý, không sót câu. Đề không in bảng đáp án.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (4 phần · 16 câu · chưa chắc 1).
- Hình giải `giai_cau11.png`: đúng dữ kiện ($AB>AC$, $M$ trung điểm $BC$, $D$, $E$ là chân đường vuông góc, $O$ trung điểm $ME$), chỉ đánh dấu giả thiết (ba góc vuông, $MB=MC$, $OM=OE$), không vẽ $DC$ (điều phải chứng minh), nhãn không đè — không sửa.
- Luật kiến thức: đề chạm tới hằng đẳng thức (Câu 3, 8, 10) và hình chữ nhật – thoi – vuông (Câu 4, 11) ⇒ dùng hằng đẳng thức và "trung tuyến ứng với cạnh huyền" là hợp lệ. Câu 11b tự chứng minh $E$ là trung điểm $AC$ bằng hai tam giác vuông bằng nhau (không đường trung bình); Câu 11a đi qua tổng góc $360^\circ$ rồi định nghĩa bốn góc vuông (không dùng "ba góc vuông").

## Hai chỗ trạm soạn báo — phân xử

- **Câu 5b:** ảnh 300 dpi in rõ "Giá trị của đa thức A tại $y=-1$ là 1". Máy tính: $A(-1)=9$ (không phụ thuộc $x$). Ý b **Sai** — đúng như bản soạn. Đây là câu đúng/sai nên mệnh đề sai không phải lỗi đề; không cần `Chưa chắc`.
- **Câu 11:** ảnh in rõ "(AB > AC)". Ý c cần $AB=AC$ — mâu thuẫn với giả thiết đầu bài. Kiểm toạ độ 2 bộ: với $AB>AC$ thì $AD>AE$, $ADME$ không bao giờ là hình vuông. Lỗi của **đề gốc**; đáp án chấm của trường chắc chắn là "tam giác $ABC$ vuông cân tại $A$". Giữ nguyên đề, giữ `Chưa chắc` (viết lại cho rõ), thêm một câu vào `Chú ý` để học sinh không bị vướng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 8a | định dạng | Bước 2: hằng đẳng thức viết bằng chữ thường $a^2-2ab+b^2=(a-b)^2$ với $a=2x$, $b=y$ (trước: $A^2-2AB+B^2$) | Biểu thức của đề đã tên là $A$ — dùng lại chữ $A$ cho hằng đẳng thức gây nhầm |
| Câu 10b | lập luận (diễn đạt) | Mấu chốt: "hai vế trái đều có $4x^2$…" ⇒ "khai triển hai tích ở vế trái thì được hai hạng tử $4x^2$ trái dấu nhau…" | "Hai vế trái" sai nghĩa (chỉ có một vế trái, gồm hai tích) |
| Câu 11 | lập luận (Phần 1 lộ đáp số) + ghi chú | Bước 5 không còn ghi "$AB=AC$" (đáp số của ý c), thay bằng hướng đổi điều kiện $AD=AE$ về hai cạnh góc vuông, nói rõ $D$ trung điểm chứng minh tương tự ý b · `Chú ý` thêm câu "ý c phải bỏ điều kiện $AB>AC$…" · `Chưa chắc` viết lại: nêu rõ là lỗi đề gốc và hai lựa chọn cho CEO | Phần 1 không được lộ đáp số cuối; mâu thuẫn của đề phải nói thẳng với cả học sinh lẫn người duyệt |
| Câu 12 | kiến thức | Phần 2 thêm hai dòng trung gian $(4x^2-4xy+y^2)+(4x-2y)+1+\dots=(2x-y)^2+2(2x-y)+1+\dots$ trước khi ra $(2x-y+1)^2$; Phần 1 Bước 1 viết lại theo đúng cách gom đó | Bản gốc viết thẳng $4x^2+y^2+1-4xy+4x-2y=(2x-y+1)^2$ — tức dùng ngầm bình phương của tổng ba số hạng, không có trong các hằng đẳng thức lớp 8; phải đi qua bình phương của một tổng với $A=2x-y$, $B=1$ |

Không sửa: đề, đáp án, phân loại `kho` / `loai`, cách tách ý của mọi câu; lời giải các câu 1–7, 8b, 9a, 9b, 10a, 10c.

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 11 (ý c)** — đề gốc cho $AB>AC$ ở đầu bài nhưng ý c hỏi điều kiện để $ADME$ là hình vuông, điều kiện đó là $AB=AC$ (tam giác $ABC$ vuông cân tại $A$). Lời giải trả lời "vuông cân tại $A$" (hiểu ý c là bỏ điều kiện $AB>AC$). CEO quyết: giữ nguyên đề + cách hiểu này, hay bỏ "($AB>AC$)" khỏi đề (khi đó ý a, b không đổi gì, chỉ cần xoá câu thêm trong `Chú ý`).

## Điều người duyệt nên biết (không phải `Chưa chắc`)

- Câu 5b: mệnh đề của đề sai ($9\ne 1$) — đáp án ý b là **Sai**.
- Câu 6: đề gốc viết "mảnh ruộng" rồi "mảnh sân"; bản soạn đã thống nhất thành "mảnh ruộng" (có `Ghi chú`). Đáp số là biểu thức $4x^2-25$ nên nhập tự luận dù đề xếp vào phần trả lời ngắn.
- Câu 8b: đáp số $10\,000$ (5 chữ số) nên nhập tự luận.
