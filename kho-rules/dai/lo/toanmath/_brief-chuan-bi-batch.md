# Brief TRẠM CHUẨN BỊ một batch toanmath (đề thi cuối kì I) — 13/11/2026

> Giao cho model Opus, MỘT batch / trạm. Làm theo đúng quy trình đã chạy cho B002 (K9, 15 đề) và B005 (K9, 2 đề).
> Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2` (thư mục hiện hành khi chạy node). Máy nhà Thùy: user `Admin` (KHÔNG phải WBPC).

## Đầu vào có sẵn
- `kho-rules/dai/lo/toanmath/batch.json` — mục `ma = <BATCH>`: danh sách bài (`files` là đường dẫn tương đối `K<khối>\Đề thi\CKI\…`).
- File gốc ĐÃ chép sẵn vào `BK_GOC = C:/Users/Admin/AppData/Local/Temp/claude/ccff1e05f3618f8c/83191a63-9962-4207-934d-198b42dd0488/scratchpad/goc`
  (cùng cây thư mục `K<khối>/Đề thi/CKI/…`). **Chỉ làm bài CKI** (`folder` = `Đề thi/CKI`); bài CKII trong batch: BỎ QUA (lượt sau).
- Kết quả đo trùng kho (máy, chỉ đọc): `kho-rules/dai/lo/toanmath/batch/<BATCH>/do-trung.json` (đã chạy). `khong_doc` = scan, máy không so được.
- Mẫu đầu ra đã duyệt: `batch/B002/ds-de.json`, `batch/B002/bo.md`, `batch/B002/_dau-brief.md`, `batch/B005/bo.md`, `batch/B005/_dau-brief.md`.

## Việc phải làm (theo thứ tự)
1. **Đọc trang từng bài.** `pdftotext`/`pdftoppm` bản msys KHÔNG mở được đường dẫn có chữ có dấu ("Đề thi") ⇒ luôn chép PDF sang tên ASCII trong
   scratchpad của bạn rồi mới chạy. Bài có lớp chữ: `pdftotext -f N -l N -layout` từng trang để biết trang ĐỀ / trang HƯỚNG DẪN CHẤM / ma trận / quảng cáo.
   Bài scan: render 60–70 dpi (`pdftoppm -r 60 -png`) và XEM ảnh từng trang. Ghi lại: trang đề, trang hướng dẫn chấm, số mã đề, bộ nhiều đề.
2. **Đo trùng kho bằng 2 nhân chứng** (luật B002/B005): bài nào máy không kết luận được (`khong_doc`, `mo_ho`, hoặc tên trường + năm học trùng một đề
   đã có) ⇒ (a) tìm đề cùng trường + năm học trong kho: `select id, ten from tai_lieu where loai='de_thi' and khoi='<khối>' and ten ilike '%<trường>%'`;
   (b) lấy 3 câu đầu của đề đó (`tai_lieu_phan` → `tai_lieu_cau` → `dai_cau_hoi`/`hgt_cau_hoi`/`hinh_hoc_cau_hoi`.noi_dung, theo `p.thu_tu, tc.thu_tu`)
   và so với ảnh/chữ trang 1. Khớp cả 2 ⇒ BỎ (ghi vào `bo.md`). Chỉ khớp tên, nội dung khác ⇒ GIỮ. Kết nối DB CHỈ ĐỌC:
   `node --env-file=.env` + `pg` với `set default_transaction_read_only = on`. Script tạm để ở scratchpad của bạn, KHÔNG để trong repo.
3. **Luật Thùy:** đề có 2 (hay nhiều) MÃ ĐỀ ⇒ chỉ lấy MỘT mã (mã đầu); bộ nhiều đề khác nhau (đề ôn tập số 1, 2…) ⇒ tách mỗi đề một mục (`tach`).
   Đề chỉ còn câu kiến thức học kì 2 / thiếu trang ⇒ bỏ, ghi lý do.
4. **Viết** `batch/<BATCH>/ds-de.json` (khuôn B002: `ma` = `<BATCH>-NN` đánh số liên tục từ 01, `ten_bai`, `don_vi` đọc từ ảnh tiêu đề, `nam` = năm đầu năm học,
   `de` = trang đề ("1" / "1-2" / "6-7"), `hd` = trang hướng dẫn chấm hoặc "", `tach` chỉ khi lấy riêng trang trong file nhiều đề/nhiều mã — giá trị NGẮN, vd "Đề 01", "Mã đề 901").
   Viết `batch/<BATCH>/bo.md` (bài bỏ + bằng chứng, khuôn B005).
5. **Viết** `batch/<BATCH>/_dau-brief.md` theo khuôn `batch/B005/_dau-brief.md`, đổi cho đúng batch/khối:
   - `<MA>`/`<LV>` (dạng `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<BATCH>\<MA>` — giữ WBPC, sẽ đổi sau), danh sách đề không có hướng dẫn chấm, đề scan.
   - **Phạm vi kiến thức = cuối học kì 1 của khối** (bộ sách KNTT, Tập 1). Brief gốc của khối (`kho-rules/dai/lo/k<khối>-brief-soan.md`) viết cho GIỮA kì ⇒
     đọc `kho-rules/dai/k<khối>.md` (luật kiến thức theo thứ tự bài) và GHI RÕ trong `_dau-brief.md` những chương/bài được dùng thêm tới hết học kì 1.
     K6/K7 đã từng chạy bộ đề CKI (xem `k6.md`, `k7.md` mục tiến độ/nhật ký, thư mục `lo/k6`, `lo/k7` có `CKI-*.soan.md`) ⇒ chép đúng phạm vi đã dùng.
     K8 chưa từng chạy CKI ⇒ dùng luật `k8.md` "whitelist = những gì ĐỀ đó kiểm tra tới theo bộ sách của trường, tính tới hết học kì 1"; đề dùng kiến thức bộ sách
     khác (CTST/Cánh Diều) ⇒ giải đúng kiến thức đề đó kiểm tra + ghi `bo_sach`. Kiến thức nào repo KHÔNG nói rõ được hay cấm ở cuối kì 1 (vd đường trung bình ở K8)
     ⇒ ghi trong `_dau-brief`: "dùng được nếu đề kiểm tra tới; câu nào dùng ⇒ `**Chưa chắc:**`" — KHÔNG tự quyết thay Thùy.
   - Giữ các luật chung: đáp án/hướng dẫn chấm của trường CHỈ tham khảo, tự giải trước, lời giải CHI TIẾT 2 phần, mọi đáp số thử lại bằng máy, chỗ chưa chắc ⇒ `**Chưa chắc:**`.
6. **Chạy** (thư mục Repo):
   - `BK_GOC=<như trên> BK_LV="C:/Users/Admin/bk-kho-lam-viec" node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>`
   - `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k<khối>` (K8 → `k8`, K7 → `k7`, K6 → `k6`)
   - Đổi `WBPC` → `Admin` trong `batch/<BATCH>/brief-soan.md` và `brief-soat.md` (bằng node `split('WBPC').join('Admin')`, KHÔNG dùng sed với `\`).
   - Kiểm: `grep -c WBPC` hai brief = 0; mỗi `C:/Users/Admin/bk-kho-lam-viec/de-thi/toanmath/<BATCH>/<MA>/trang/` có ảnh; trong brief-soan đường dẫn tệp soạn là
     `lo\toanmath\batch\<BATCH>\<MA>.soan.md` và đề mẫu `lo\k<khối>\GKI-01.soan.md` (hoặc mẫu brief gốc trỏ tới) còn đúng đường dẫn thật (mở thử).
7. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào ngoài `batch/<BATCH>/`, KHÔNG xoá bất cứ thứ gì.

## Trả lời cuối (≤ 200 từ)
Số bài CKI trong batch · số bài bỏ (vì sao) · số đề cuối cùng trong `ds-de.json` (liệt kê `ma` + trường + có/không hướng dẫn chấm + scan/chữ) ·
phạm vi kiến thức đã ghi cho khối · điểm nào cần Thùy quyết. Xác nhận đã chạy chuan-bi + ghep-brief + đổi WBPC thành công.
