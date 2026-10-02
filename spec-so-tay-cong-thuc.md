# Sổ tay CÔNG THỨC (app HS) — spec đợt 1

> CEO chốt 03/10/2026. Đọc trước khi đụng thẻ công thức, RPC tìm sổ tay, hay màn `SoTayHS`.
> Dữ liệu nguồn: `scripts/sotay-cong-thuc/toan12.mjs` · PDF duyệt: `docs/so-tay-cong-thuc/`.

## 1. Hành vi mong muốn
HS quên công thức nào ⇒ mở app ⇒ gõ **tên công thức** (tên sách, tên dân gian, không dấu…) ⇒ thấy ngay công thức.

## 2. Quyết định đã chốt
| # | Quyết định | Ai / khi nào |
|---|---|---|
| 1 | **Gộp vào ô Sổ tay hiện có** (không mở ô mới). Một ô tìm chung cho cả công thức lẫn lý thuyết dạng. | Thùy 03/10 |
| 2 | Kết quả tìm: **thẻ công thức hiện TRƯỚC**, gắn nhãn **"Công thức"**; dạng bài (sổ tay cũ) hiện sau, gắn nhãn **"Lý thuyết"**. | Thùy 03/10 |
| 3 | **Đợt 1 chỉ Toán 12** (theo chương trình GDPT 2018). Lượng giác, hình phẳng, hình không gian lớp 11, Oxy lớp 10 của quyển nguồn ⇒ đợt sau. | Thùy 03/10 |
| 4 | Công thức là kiến thức chung ⇒ được viết lại theo khuôn BK từ nhiều quyển; KHÔNG chép nguyên hình/bố cục ⇒ hình vẽ lại. | Thùy 03/10 |
| 5 | Hình cần vẽ: Claude xuất PDF danh sách (kèm mẫu cắt từ nguồn), **Thùy vẽ lại**, đặt tên file theo mã hình (`H05.png`). | Thùy 03/10 |

## 3. Đơn vị dữ liệu = 1 THẺ công thức
Khác sổ tay cũ (đơn vị = 1 DẠNG, lý thuyết dài). Một công thức dùng cho nhiều dạng; một dạng dùng nhiều công thức.

Trường của thẻ (xem đầu `toan12.mjs`): `ma` · `mon` (§1.6 — bắt buộc) · `chu_de` · `ten` · **`ten_khac[]`** (tìm kiếm sống nhờ cột này) ·
`noi_dung` (chữ + `$…$`, khuôn `MathText`) · `luu_y` · `cau_nho` · `hinh` · `nguon[]` · `ct2018` · `ghi_chu_kiem`.
Sau này: nối thẻ ↔ `ma_dang` (nhiều-nhiều) để từ thẻ bấm sang dạng và ngược lại.

## 4. Cổng kiểm (không kiểm thì không lên app)
- Thẻ có **≥2 quyển ĐỘC LẬP** ghi giống nhau ⇒ tự qua. Hai trang của cùng 1 quyển không tính.
- Chỉ 1 nguồn / nguồn mâu thuẫn / BK tự soạn ⇒ **GV duyệt** (PDF `the-cong-thuc-toan12.pdf` có ô tick).
- `ct2018 = 'nghi_van'` ⇒ GV quyết giữ hay bỏ. `ghi_chu_kiem` = chỗ nguồn in sai đã sửa khi chép — GV đọc trước.
- Đợt 1 hiện mới có 1 quyển (thầy Đạt, bản CŨ ~2023) ⇒ **mọi thẻ đang chờ GV**. Thêm quyển 2 (vd sổ tay Phạm Phú Thứ 06/2025) sẽ tự đẩy nhiều thẻ qua cổng.

## 5. Hiện trạng 03/10
- 77 thẻ / 6 chủ đề: khảo sát hàm số 18 · vectơ & tọa độ 11 · thống kê ghép nhóm 6 · nguyên hàm–tích phân 13 · Oxyz 24 · xác suất có điều kiện 5.
- 10 thẻ `nghi_van` (trùng phương, tích có hướng & ứng dụng, nguyên hàm mở rộng, từng phần, đổi biến, khoảng cách điểm–đường / 2 đường chéo, mặt phẳng–mặt cầu).
- 7 thẻ có `ghi_chu_kiem` — đáng kể nhất: nguồn ghi "cực trị ⇔ y'=0, y''≠0" (sai, chỉ là điều kiện đủ).
- Phần CT 2018 mà nguồn KHÔNG có (ghép nhóm, Bayes, góc Oxyz, tiệm cận xiên, phân thức bậc 2/bậc 1…) do BK tự soạn.
- 19 hình (11 có mẫu từ nguồn, 8 vẽ mới) — `hinh-can-ve-toan12.pdf`.
- Đã kiểm: mọi `$…$` render KaTeX không lỗi (`node scripts/sotay-cong-thuc/xuat-pdf.mjs`).

## 6. Việc kế tiếp
1. GV duyệt PDF thẻ · Thùy vẽ 19 hình.
2. Migration: bảng thẻ công thức (có `mon`, `xoa_at` kho rác §2) + nạp từ `toan12.mjs` (chỉ thẻ đã duyệt) + ảnh hình.
3. RPC tìm: mở rộng đường tìm của sổ tay (`hs_sotay_tim` — dùng lại `fn_bo_dau` + luật khớp ranh giới từ mig 202609201203), trả 2 loại có cột `loai` ('cong_thuc' | 'ly_thuyet'), công thức xếp trước — sắp ở DB (§2.0). Khớp trên `ten` + `ten_khac`.
4. Màn `SoTayHS`: nhãn "Công thức" / "Lý thuyết" trên kết quả, trang chi tiết thẻ. Dựng bằng `skin/KhungHS`, `npm run check:style-hs`.
5. Ghi lại lượt tìm KHÔNG ra kết quả (từ khoá + khối) ⇒ danh sách công thức / tên gọi còn thiếu — bổ sung theo cái HS thật sự gõ.
6. `npm run smoke:sotay` sau mọi migration đụng RPC sổ tay (bài học 20/09).
