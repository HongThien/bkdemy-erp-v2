# Quy trình: Claude sửa kho theo NHẬN XÉT LÚC DUYỆT

> Thùy chốt 17/10: người duyệt bấm **✎ Cần sửa** ở bất kỳ màn duyệt kho nào, ghi *sai ở khâu nào + cần sửa thế nào*.
> Hệ thống lưu lại; Claude tự lấy việc và sửa — **không cần nhân sự gửi qua Thùy rồi Thùy gửi qua Claude nữa**.
> Chạy theo **lịch mỗi tối** và **khi Thùy gọi** ("sửa theo nhận xét").

## Dữ liệu (mig `202610171123`)

- `kho_nhan_xet` — mỗi dòng một nhận xét: `(doi_tuong, mon, ma)` = mã gốc đối tượng · `khau` (de · dap_an · loi_giai · dang · hinh · trinh_bay · khac) · `noi_dung` · `man` (màn ghi) · người · lúc.
- `kho_nhan_xet_xu_ly` — Claude/người ghi đã xử lý: `da_sua` (kèm *đã sửa gì*) hoặc `khong_sua` (kèm *vì sao*).
- Cả hai **chỉ thêm, không sửa/xoá**. Trạng thái **suy**: `cho_sua` (còn nhận xét chưa xử lý — đối tượng tạm ẩn khỏi hàng duyệt) · `da_sua` (hiện lại hàng duyệt, hộp xanh "đã sửa theo nhận xét") · `khong_sua` (hiện lại, hộp vàng kèm lý do).
- Đối tượng: `cau` (mọi kho câu) · `form_tn` · `form_dien` (Hình) · `hinh_bai` (+ ý `hinh_y`) · `hinh_bien_the` · `hinh_cach_giai` · `clone` · `de_thi` (sửa qua các câu con).

## Các bước (mỗi lượt)

1. **Lấy việc:** `node scripts/kho/nhan-xet.mjs --ds --ra <scratchpad>/nx.json` — mỗi đối tượng kèm mọi nhận xét đang mở + nội dung đầy đủ (dòng DB; bài Hình kèm các ý; đề thi kèm danh sách câu).
2. **Đọc luật trước khi sửa** theo loại việc: `kho-rules/README.md` + `kho-rules/<nhánh>/k<khối>.md` của khối câu đó · `spec-giai-bai-ai.md` (lời giải) · luật trình bày đã chốt (lời giải hiện liền dòng, Hình không dòng trống thừa…) · hình vẽ: `scripts/anh/ve_hinh_lib` + `gan_hinh.mjs` (vẽ bằng code, không cắt ảnh sách).
3. **Sửa ĐÚNG điều nhận xét yêu cầu**, không "nhân tiện" sửa chỗ khác. Đổi đáp án ⇒ tự giải lại kiểm (bài nhiều ý dùng lại kết quả ý trước). Đổi đáp án câu có form trắc nghiệm ⇒ ghi chú để người duyệt biết form có thể cần sinh lại.
4. **Không đồng ý / thiếu dữ kiện / nhận xét mơ hồ** ⇒ KHÔNG đoán (§1.5 "thà bỏ trống còn hơn đánh sai"): `--khong <id,id> "lý do cụ thể, cần người nói rõ gì"` — người duyệt thấy lý do ngay trên thẻ, ghi nhận xét mới nếu cần.
5. **Ghi:** viết `goi.json` (`nhan_xet` · `ghi_chu` = đã sửa GÌ, đủ để người duyệt kiểm nhanh · `thay` = cột đổi) → `node scripts/kho/nhan-xet.mjs --sua goi.json` (chạy thử, ROLLBACK) → đọc số → thêm `--ghi`. Sửa + ghi xử lý cùng 1 transaction. Script chỉ cho sửa cột trong registry `DT`/`CON`, **không đụng `da_duyet`**.
6. **Khâu "dạng" ở Bản đồ mới:** dạng bài do người chọn ngay tại màn Duyệt kho — Claude chỉ đổi `dang_chinh` (bản đồ cũ) khi nhận xét ghi rõ mã; còn lại `--khong` kèm gợi ý dạng bài.
7. **Học lại:** `node scripts/kho/nhan-xet.mjs --thong-ke`. Lỗi cùng kiểu lặp ≥3 lần ở một khối/loại ⇒ rút thành luật trong `kho-rules/<nhánh>/k<khối>.md` (ghi nguồn: "từ nhận xét duyệt #id…") để lô soạn sau không mắc lại.
8. **Báo + log:** DEVLOG (append) — số đã sửa / không sửa, luật mới rút. Commit theo pathspec.

## Luật cứng

- Claude **sửa, không duyệt**: đối tượng sửa xong quay lại hàng duyệt, người bấm Duyệt (luật 28/09: không để một phiên tự làm–tự kiểm–tự ghi).
- Không xoá câu / đối tượng nào (Luật xoá CLAUDE.md) — nhận xét đòi "bỏ câu này" ⇒ `--khong` "người duyệt bấm ✕ Từ chối".
- Mã gốc bất biến: sửa nội dung, không cấp lại mã.
