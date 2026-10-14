KẾT LUẬN: ĐẠT

# Biên bản soát gói 7 — ƯC · ƯCLN · BC · BCNN (cơ bản + thực tế) — 14/10

- Trạm soát: Opus (bản soạn Sonnet). Bản gốc trước khi sửa: `out-7.goc.json`.
- Đã soát: **30 ví dụ / 15 dạng** (NDB00400–NDB00414) · **0 khối lý thuyết** (cả 8 nhóm `can_ly_thuyet=false`).
- Toán: giải lại mọi đề bằng máy (vét cạn ước, ƯCLN/BCNN, vét cạn khoảng cả hai đầu cho bài BC có điều kiện và thừa/thiếu) — **30/30 đáp số đúng**, từng dòng phân tích TSNT / liệt kê Ư, B đúng.
- Dạng: mỗi ví dụ khớp `mo_ta`, không trượt sang dạng anh em (ƯC có khoảng ↔ ƯCLN "lớn nhất"; BC vừa đủ có khoảng ↔ BC thừa/thiếu ↔ BCNN "ít nhất").
- Kiến thức: không chuyển vế, không đồng dư, không ƯCLN.BCNN=a.b; thừa/thiếu xử bằng bớt/thêm số dư rồi lấy BC (số dư 3 < 10, 12, 15).
- Định dạng: dấu nhân chấm, `\text{Ư}`, `\text{ƯC}`, `\text{BCNN}`, `\vdots`; không `\cdot`/`\times`.
- Cổng `kiem-goi.mjs`: ✔ đạt cổng (trước và sau khi sửa).

## Chỗ đã sửa

| Mã | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| NDB00410 (VD1, VD2) | đề mơ hồ / khuôn | Điều kiện `$250<x<400$` → `$250\le x\le 400$`; `$400<x<500$` → `$400\le x\le 500$` (cả dòng gọi ẩn và dòng lọc) | Đề nói "trong khoảng **từ** 250 **đến** 400" (gồm hai đầu) mà lời giải viết khoảng mở — đáp số không đổi nhưng HS học sai cách đặt điều kiện |
| NDB00410 (VD2) | khuôn | `$\text{B}(120)=\{0;120;240;360;\dots\}$` → thêm `480;600` | Tập liệt kê dừng trước đáp số 480 rồi kết luận $x=480$ — phải liệt kê tới số thoả khoảng |
| NDB00411 (VD1, VD2) | đề mơ hồ / khuôn | Điều kiện đổi sang `\le` như trên; dòng lọc viết rõ khoảng của $x-3$ / $x+1$: `$197\le x-3\le 297$, suy ra $x-3=240$` · `$401\le x+1\le 501$, suy ra $x+1=480$`, tách dòng "Do đó $x=…$" | Lời giải cũ nhảy từ khoảng của $x$ sang giá trị $x-3$ mà không nói vì sao — đúng là chỗ bẫy "thừa/thiếu" (phải lọc trên $x\mp r$) |
| NDB00403 (VD2) | đề mơ hồ | Đề thêm "chia **đều** … (không thừa chiếc bút, quyển vở nào)" | Đề cũ chỉ nói "chia vào các phần thưởng … như nhau", không khẳng định chia hết — thiếu căn cứ để viết $x\in\text{ƯC}(36,60)$ |
| NDB00412 (VD1) | khuôn | Lập luận "Vì $x$ là số ngày để An trực nhật lại…" → "Vì An cứ 6 ngày trực nhật một lần, Bình cứ 8 ngày trực nhật một lần nên $x\vdots 6$ và $x\vdots 8$" | Lập luận chia hết phải xuất phát từ dữ kiện đề (khuôn NNB00925 bước 2) |
| NDB00412 (VD2) | khuôn | "Ta có 60 phút bằng 1 giờ." → "Ta có 60 phút $=1$ giờ, $6+1=7$ (giờ)." | Kết luận "7 giờ" thiếu phép tính dẫn tới |

## Ghi chú còn lại gửi CEO (giữ nguyên trong `ghi_chu` của out)

1. Gói 7 không có nhóm nào cần lý thuyết — chỉ ví dụ 15 dạng.
2. Bản đồ cũ gộp cụm ⇒ ứng viên của các dạng anh em (NDB00403/00404, 00405/00406, 00410/00411/00412, 00413/00414) là bản sao y hệt; ví dụ các dạng "lớn nhất / nhỏ nhất / thừa thiếu" soạn mới theo mô tả.
3. **NDB00406** tên "Tìm UCLN của 2 số" nhưng mô tả là "tìm $n$ lớn nhất sao cho hai số chia hết cho $n$" — cùng bản chất, ví dụ viết theo mô tả.
4. **NDB00411 (thừa/thiếu):** lý thuyết nhóm NNB00925 chưa có dòng nào cho trường hợp thừa/thiếu (chỉ "xếp hàng vừa đủ" và "nhỏ nhất") — nên bổ sung *"thừa $r$ ⇒ $x-r\in\text{BC}$; thiếu $r$ ⇒ $x+r\in\text{BC}$; lọc khoảng trên $x\mp r$; số dư phải nhỏ hơn mọi số chia"*. Nhóm cờ `can_ly_thuyet=false` nên trạm không ghi.
5. Lý thuyết hiện có NNB00920 / 00923 / 00924 / 00925 còn gõ `UCLN`, `BC(a;b)` không `\text{}`, `\cdot`, và "Bước 1:" thay vì `##PP` — lệch định dạng k6.md §3, không ảnh hưởng ví dụ.
6. (Trạm soát thêm) Lý thuyết hiện có NNB00921 ví dụ "36 kẹo/48 bánh/24 lốc" đặt điều kiện $x<24$ — thực ra phải $x\le 24$ (24 cũng là ước chung khả dĩ trước khi xét); đáp số 12 không đổi, nhưng nếu CEO chép khuôn này thì nên sửa thành $x\le 24$ hoặc bỏ.
