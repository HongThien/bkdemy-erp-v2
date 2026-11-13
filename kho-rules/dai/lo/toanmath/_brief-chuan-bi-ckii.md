# ⚠️ ĐẦU ĐÈ cho brief chuẩn bị batch — ĐỀ THI CUỐI KÌ II, MÁY CÔNG TY (13/11) — đọc trước, đè lên `_brief-chuan-bi-batch.md`

Làm theo `kho-rules/dai/lo/toanmath/_brief-chuan-bi-batch.md` (quy trình 1–7 + trả lời cuối), CHỈ khác:

- **Máy công ty:** Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. KHÔNG đặt `BK_GOC`/`BK_LV` (mặc định đã đúng: nguồn `E:/BK ACADEMY/Tài liệu tham khảo`,
  làm việc `C:/Users/WBPC/bk-kho-lam-viec`). KHÔNG đổi `WBPC`→`Admin` trong brief. Lệnh: `node kho-rules/dai/lo/toanmath/chuan-bi-batch.mjs <BATCH>`
  rồi `node kho-rules/dai/lo/toanmath/ghep-brief.mjs <BATCH> k9-cki`.
- **Batch này là CUỐI KÌ II** (`folder` = `Đề thi/CKII`) — làm HẾT bài trong batch (bỏ dòng "chỉ làm CKI").
  Đo trùng máy đã chạy: `batch/<BATCH>/do-trung.json` — kho CHƯA có đề cuối kì II K9 nào (mọi ứng viên là CKI/GKI, khớp ≤ 0,25). Vẫn xem trang 1 các bài
  `khong_doc` để chắc không phải đề CKI/GKI đã có, đề trùng nhau trong batch (cùng trường + cùng năm, hai file) ⇒ giữ 1.
- **Đề có file Word** (`dinh_dang = word`): chuan-bi-batch chỉ đọc PDF — xem `batch.json` `files`; nếu bài chỉ có Word, ghi vào `bo.md` mục "chờ — chỉ có Word" (KHÔNG bỏ hẳn), không đưa vào ds-de.
- **`_dau-brief.md` cho CUỐI KÌ II — PHẠM VI = CẢ NĂM LỚP 9 (KNTT, Tập 1 + Tập 2)** — viết rõ, ĐÈ lên mục phạm vi / CẤM của brief CKI bên dưới:
  - Được dùng toàn bộ lớp 9: C1–C3 (hệ, bất phương trình, căn thức) · C4 hệ thức lượng · C5 đường tròn · **C6 hàm số $y=ax^2$, phương trình bậc hai,
    công thức nghiệm / $\Delta$ / $\Delta'$, Viète (sau khi chỉ ra có hai nghiệm — `k9.md` §1), giải bài toán bằng cách lập phương trình** · C7 tần số, tần số tương đối,
    biểu đồ · C8 xác suất (liệt kê không gian mẫu, không tổ hợp) · **C9 góc nội tiếp, đường tròn ngoại tiếp / nội tiếp tam giác, tứ giác nội tiếp, đa giác đều** ·
    **C10 hình trụ, hình nón, hình cầu** (công thức diện tích, thể tích). Lớp 6–8 là nền, **kể cả đường trung bình** (Thùy 13/11 đã cho dùng ở K8 cuối kì 1).
  - Vẫn CẤM: Cô-si / Bunhiacopxki dùng thẳng (tự chứng minh từ bình phương ≥ 0) · dấu $\Leftrightarrow$ nối chuỗi · "tập nghiệm $S=\{…\}$" · định lí sin/côsin ·
    hệ thức đường cao $h^2=b'c'$… dùng thẳng (dùng đồng dạng / tỉ số lượng giác) · tổ hợp, chỉnh hợp · tích vô hướng, toạ độ vectơ.
  - Tên đề: `Đề kiểm tra cuối học kì 2 Toán 9 năm <năm học> — <don_vi> (<mã đề nếu có>)`. Phân kho như brief CKI (mọi câu hình — kể cả hình khối thực tế
    trụ/nón/cầu — `kho=hinh_hoc`; còn lại `dai`).
  - Thêm dòng: **hình vẽ/cắt xong, trạm soát xong ⇒ người điều phối chạy `anh-batch.mjs day <BATCH>`** (hình sống trên kho — Thùy 13/11).
- Trả lời cuối thêm: số bài chỉ có Word (chờ), số đề scan.
