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

## 6. Đã build (03/10 — ĐÃ ÁP DB)
- **DB** mig `202610030214_sotay_cong_thuc` + `202610030215_..._seed_toan12` (77 thẻ `cho_duyet`, 19 hình chưa có ảnh):
  `sotay_ct_chu_de` · `sotay_ct_hinh` (url null = chưa vẽ) · `sotay_cong_thuc` (kho rác `xoa_at`) · `sotay_ct_lich_su` (trigger ghi).
  Trigger: thêm thẻ không mã ⇒ tự cấp `CT<khối>-<chủ đề>-<nn>` · sửa nội dung thẻ `da_duyet`/`tra_ve` ⇒ tự về `cho_duyet` ·
  đổi trạng thái ⇒ tự đóng dấu `xet_boi/xet_at` · `tra_ve` bắt buộc lý do (CHECK). Quyền staff = lá `sotay` (`co_chuc_nang`/`co_quyen_ghi`),
  không có xoá cứng. **Sau khi nạp: DB là chân lý** — `toan12.mjs` chỉ còn là đầu vào lịch sử, đừng sửa file rồi nạp đè.
- **RPC HS** `hs_sotay_tim_ct(tu_khoa, mon, khoi, limit)` — chỉ thẻ `da_duyet`, chưa xoá; SQL tĩnh (không `format()`); không cấp anon.
  `hs_sotay_tim` (lý thuyết dạng) giữ nguyên; app gọi 2 RPC song song, 1 bên lỗi ⇒ báo lỗi (không hiện nửa kết quả).
- **ERP** lá "Sổ tay công thức" (nhóm Học thuật, `src/screens/sotay/SoTayCongThucScreen.tsx`): lọc trạng thái/chủ đề/tìm · sửa
  (MathTextarea, tên khác mỗi dòng 1 tên, chọn hình gõ-lọc) · xem trước như HS · Lưu (Ctrl+S) / Duyệt (đang sửa ⇒ "Lưu & duyệt") /
  Trả về (lý do) / Bỏ duyệt / Thùng rác · nhật ký thẻ (kèm bản trước khi sửa) · tab Hình: dán/chọn/cắt-PDF ảnh cho từng hình.
  Cấp quyền cho vai trò ở màn Phân quyền (cột `sotay` tự hiện). Admin hệ thống tự có.
- **App HS** `SoTayHS`: placeholder "Tìm công thức, dạng bài…", kết quả **Công thức trước** (nhãn Công thức) rồi Lý thuyết (nhãn Lý thuyết),
  màn đọc thẻ (nội dung · hình · lưu ý · mẹo nhớ). Demo: `hs.html?demo=sotay` gõ "bac hai".
- Kiểm: `scripts/_q_sotay_ct_dryrun.mjs` (17 bước, rollback) · `scripts/_q_sotay_ct_rls.mjs` (quyền admin/HS, rollback).

## 7. Việc kế tiếp
1. GV duyệt 77 thẻ trên ERP · Thùy vẽ 19 hình (nền TRẮNG — app có giao diện tối) rồi dán vào tab Hình.
2. Ghi lại lượt tìm KHÔNG ra kết quả (từ khoá + khối) ⇒ danh sách công thức / tên gọi còn thiếu — bổ sung theo cái HS thật sự gõ.
3. Nối thẻ ↔ `ma_dang` (từ thẻ bấm sang dạng bài và ngược lại).
4. Thêm quyển nguồn thứ 2 (Phạm Phú Thứ) để đối chiếu; mở rộng lớp 10–11 nếu CEO muốn.
5. `npm run smoke:sotay` sau mọi migration đụng RPC sổ tay (bài học 20/09) — chưa thêm `hs_sotay_tim_ct` vào smoke.
