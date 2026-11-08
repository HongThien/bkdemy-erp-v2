# Brief SOÁT (nhân chứng thứ hai) — câu nhập từ sách tham khảo K11 chương Giới hạn

Bạn soát MỘT tệp `Repo\kho-rules\dai\lo\k11\sach-gioi-han\<id>.json` do trạm khác soạn. Người làm ≠ người kiểm. KHÔNG ghi DB, KHÔNG commit, KHÔNG xoá. `Repo = C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
Đọc trước: `Repo\kho-rules\dai\lo\k11\sach-gioi-han\brief.md` (luật của trạm soạn: vai, tách ý, dạng, định dạng, phạm vi kiến thức CẤM L'Hôpital / đạo hàm…), `Repo\kho-rules\dai\k11.md` §3, `Repo\kho-rules\dai\lo\k11\sach-gioi-han\dich.md`.

## Pha 1 — giải MÙ (CHƯA mở `<id>.json`, CHƯA mở nguồn `.txt`)
1. Chạy `node kho-rules/dai/lo/k11/sach-gioi-han/xem-de.mjs <id>` (từ Repo): in id + loại + đề. Đây là nguồn DUY NHẤT của pha 1.
2. Tự giải TỪNG câu, tính bằng script node (giới hạn dãy: tính ở n rất lớn; giới hạn hàm: hai phía của điểm; tham số / liên tục: thay lại; trắc nghiệm: xét ĐỦ 4 phương án; Đúng/Sai: xét từng ý). Đề có chỗ in lỗi / mơ hồ ⇒ ghi rõ.
3. Ghi `Repo\kho-rules\dai\lo\k11\sach-gioi-han\<id>.kiem.md`: bảng `| id | đáp số của tôi | ghi chú đề |`, mỗi câu một dòng.

## Pha 2 — đối chiếu và sửa
1. BÂY GIỜ mới mở `<id>.json` (và nguồn `C:\Users\WBPC\bk-kho-lam-viec\bdm\k11\sach-gh\don-vi\<id>.txt` khi cần). So `dap_an` / kết luận cuối `loi_giai` / `menh_de[].dap_an` với bản giải mù. MỌI câu lệch: giải lại bằng máy để biết ai đúng (bản soạn sai thì sửa; bản bạn sai thì giữ).
2. Soát thêm: (a) đề chuẩn hoá có giữ nghĩa đề sách (số, dấu, ngoặc, số mũ, chỉ số, ký hiệu ∞) · đủ câu, không bỏ / thừa; (b) **tách ý / `vai`** đúng brief (chỉ mục "Ví dụ" ⇒ giang; còn lại luyen; Đ/S chỉ luyen, không dạng); (c) **`dang_bai`**: đối chiếu `dich.md`, luật DẠNG SAU THẮNG — gán sai rõ ràng thì sửa; chỗ "bản đồ thiếu dạng" ghi lại; (d) **lời giải**: đúng toán từng dòng · đúng phạm vi (không L'Hôpital, không đạo hàm) · ĐKXĐ · Phần 1 là bước nghĩ thật, **không lộ đáp số cuối kể cả qua loại trừ phương án** · Phần 2 mỗi phép một dòng, kết "Vậy …" / "Chọn X." · dấu nhân `\cdot`; (e) `loai_cau` / `dap_an`: TLN chỉ khi số ≤ 4 ký tự; (f) câu BỎ vì hình: soạn có bỏ nhầm câu đủ chữ để giải không; (g) `kiem` có thật sự tính lại đáp số từ đề không (không tautology).
3. Trước lần sửa ĐẦU TIÊN: copy `<id>.json` → `<id>.goc.json`. Sửa bằng script Node (không gõ JSON tay). Sau khi sửa chạy `node kho-rules/dai/lo/k11/sach-gioi-han/kiem.mjs kho-rules/dai/lo/k11/sach-gioi-han/<id>.json` tới khi ✔ đạt.
4. Ghi `<id>.soat.md`: dòng đầu `KẾT LUẬN: ĐẠT` hoặc `CHƯA ĐẠT — <vì sao>`; số câu · số câu lệch Pha 1 (trước / sau) · bảng `| id | lỗi (đáp số / đề / tách ý / dạng / lời giải / phạm vi) | sửa gì |` · danh sách câu CÒN nghi cần CEO (id + lý do, so sánh sách vs bản của bạn).

## Báo cáo cuối (≤ 10 dòng)
Số câu · số câu lệch đáp số · số câu đã sửa theo loại · câu còn nghi · quyết định nào cần Thùy chọn.
