# Brief SOÁT (nhân chứng thứ hai) — câu nhập từ sách Củng cố Toán 6 T1 Ch.III (Số nguyên)

Bạn soát MỘT file `Repo\kho-rules\dai\lo\k6\so-nguyen-sach\<f>.json` (`f` ∈ b1 b2 b3 b4 b5 ot) do trạm khác soạn. Người làm ≠ người kiểm. KHÔNG ghi DB, KHÔNG commit, KHÔNG xoá. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Luật: `Repo\kho-rules\dai\k6.md`, `Repo\kho-rules\dai\lo\k6\so-nguyen-sach\brief.md` (đọc hết — đây là brief của trạm soạn), mẫu `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md`.

## Pha 1 — giải MÙ (CHƯA mở file `<f>.json`, CHƯA mở nguồn `.txt` của sách)
1. Chạy `node kho-rules/dai/lo/k6/so-nguyen-sach/xem-de.mjs <f>` (từ Repo) — in id + loại + đề. Đây là nguồn DUY NHẤT của pha 1.
2. Tự giải TỪNG câu (tính/tìm x/số liệu: dùng `node -e` vét cạn, `BigInt`; trắc nghiệm: chữ cái đúng; tập nghiệm: liệt kê hết). Đề có chỗ in lỗi/mơ hồ ⇒ ghi rõ.
3. Ghi `Repo\kho-rules\dai\lo\k6\so-nguyen-sach\<f>.kiem.md`: bảng `| id | đáp số của tôi | ghi chú đề |`, mỗi câu một dòng, đáp số ngắn gọn (tập hợp / giá trị / chữ cái / "chứng minh: đúng").

## Pha 2 — đối chiếu và sửa
1. BÂY GIỜ mới mở `<f>.json` (và nguồn `.txt` khi cần: `C:\Users\WBPC\bk-kho-lam-viec\so-nguyen\cungco\C3. <tên>.txt`). Lập bảng so `dap_an`/kết luận cuối của `loi_giai` với bản giải mù. MỌI câu lệch: giải lại bằng máy để biết ai đúng (bản soạn hay bản của bạn), sửa trong JSON phần sai.
2. Soát thêm: (a) đề chuẩn hoá có giữ nghĩa đề sách không (số, dấu, ngoặc, số mũ); (b) **tách ý / `vai`** đúng brief (A ⇒ giang; B/VN/Ôn tập ⇒ luyen); (c) **`dang_bai`**: đối chiếu `dich.md`, luật DẠNG SAU THẮNG — câu gán sai rõ ràng thì sửa, nghi thì đổi `dang_bai_chac` thành "vua"; (d) **lời giải** đúng khuôn (Phần 1 3–6 bước, KHÔNG nêu đáp số cuối; Phần 2 ngắn kết "Vậy…"/"Chọn X."), không dùng kiến thức ngoài khối 6 (giá trị tuyệt đối, chuyển vế, `(a^m)^n` quy tắc, công thức đếm ước…), không lộ đáp án ở Phần 1; (e) các câu `LỆCH SÁCH` / `NGOÀI PHẠM VI` / đoán sửa đề của trạm soạn: tự xét, đúng hay sai; (f) `loai_cau` và `dap_an` hợp quy ước (trả lời ngắn ≤ 4 ký tự; tự luận `—`).
3. Trước lần sửa ĐẦU TIÊN: `copy <f>.json <f>.goc.json`. Sửa bằng script Node (không gõ JSON tay). Sau khi sửa, kiểm lại: JSON hợp lệ · mọi `kiem` ra `true` (nếu bạn đổi đáp số thì sửa `kiem` cho khớp) · không `\cdot` `\times` `\left` `\right` `|` · số `$` chẵn.
4. Ghi `<f>.soat.md`: số câu · số câu lệch (trước/sau) · bảng `| id | lỗi (đáp số / đề / tách ý / dạng / lời giải / phạm vi) | sửa gì |` · danh sách câu CÒN nghi cần CEO (id + lý do, kèm so sánh sách vs bản của bạn).

## Báo cáo cuối (≤ 10 dòng)
Số câu · số câu lệch đáp số · số câu đã sửa theo loại · câu còn nghi · mọi quyết định nào cần Thùy chọn.
