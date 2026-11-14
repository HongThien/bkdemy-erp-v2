# ⚠️⚠️ BẢN ÁP DỤNG BATCH B038 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 11 CỦA TRƯỜNG, TẢI TỪ TOANMATH (K11 đề cương cuối kì 3/5, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 11 (24/10, kèm `brief-cki.md` 28/10), đã đổi sẵn đường dẫn. Luật kiến thức K11, khuôn câu (TN · Đ/S · TLN · tự luận), khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B038-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B038\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach` (+ `bo_sach_can_cu`), `cau_truc` (ước số câu / đề), `de` / `hd` (trang ĐỀ / trang ĐÁP ÁN **trong file PDF gốc**).
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B038\<MA>` (đã có `goc.pdf` = NGUYÊN file PDF, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`). Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ CƯƠNG = MỘT TỆP** (đề cương dài hay nhiều đề vẫn một tệp — KHÔNG chia khúc `.p<P>`): tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B038\<MA>.soan.md`. Bạn soạn CẢ đề cương, làm hết, không bỏ dở. **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới và **BỎ mục "Đánh số PHẦN (chia khúc)" của `brief-cki.md`**. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B038/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
- **Đầu tệp (đề cương — thay khuôn §3 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 11 năm <năm học> — <don_vi>
  nam: <nam>
  bo_sach: <KNTT | Cánh Diều | CTST — theo ds-de.json, sửa nếu ảnh cho thấy khác>
  kieu: de_cuong
  ```
  Năm học viết `2024–2025` / `2025–2026` / `2026–2027` đúng như trang bìa trên ảnh; lệch `ds-de.json` thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo đúng cách đề cương chia, đánh số 1, 2, 3… LIÊN TỤC trong tệp:** đề cương gồm nhiều đề (ĐỀ SỐ 1–5, ĐỀ ÔN TẬP…) ⇒ mỗi đề × mỗi mục in (Phần I TN · Phần II Đ/S · Phần III TLN · Phần IV tự luận) là MỘT `## PHẦN n | Đề số k — Phần I Trắc nghiệm | trac_nghiem` (tên PHẦN ghi như đề in, kèm tiền tố đề / chương); đề cương chia theo chương ⇒ tiền tố chương. Nhãn câu giữ như in, **duy nhất trong PHẦN**. Đ/S đủ 4 ý a–d. Phần LÝ THUYẾT, ma trận, bản đặc tả, bìa, quảng cáo "Xem thêm … toanmath.com" KHÔNG đưa vào.
  Đề in "Phần 1 TNKQ gồm cả Đ/S" (vd đề số 4 Linh Trung) ⇒ tách theo dạng thức thật của từng câu, ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 11 THEO BỘ SÁCH CỦA ĐỀ CƯƠNG** (K11 theo `kho-rules/dai/lo/k11/de-cuong/brief-soan.md` §1 + `brief-cki.md`):
  - **KNTT:** C1 Hàm số LG & PTLG · C2 Dãy số, CSC, CSN · C3 Số đặc trưng mẫu ghép nhóm · C4 Quan hệ song song trong không gian · C5 Giới hạn, hàm số liên tục + toàn bộ lớp ≤ 10.
  - **Cánh Diều:** Ch I Hàm số LG & PTLG · Ch II Dãy số, CSC, CSN · Ch III Giới hạn, hàm số liên tục · Ch IV Quan hệ song song (cả lăng trụ, hình hộp, phép chiếu song song) — cùng chủ đề KNTT, thứ tự khác; thống kê mẫu ghép nhóm của Cánh Diều nằm học kì 2.
  - **CTST:** Ch1 LG · Ch2 Dãy số · Ch3 Giới hạn · Ch4 Quan hệ song song · Ch5 Mẫu ghép nhóm — cùng phạm vi KNTT.
  - `bo_sach` trong `ds-de.json` phần lớn là **suy đoán** (đề cương ít khi ghi) — đọc nội dung / thứ tự chương trên ảnh rồi chốt; `bo_sach: không rõ` (Linh Trung) ⇒ tự chốt theo nội dung và ghi căn cứ vào `## GHI CHÚ CHO NGƯỜI DUYỆT`. Đề cương chỉ gồm vài chương (vd Xuân Đỉnh: Chương 4–5) ⇒ giải đúng phạm vi đó.
  - **CẤM** như brief gốc: đạo hàm · mũ–logarit · xác suất lớp 11 · quan hệ vuông góc · L'Hôpital · định lí ngoài SGK (Menelaus, Ceva… — tự chứng minh bằng Thales / đường trung bình / tính chất song song). **Câu khái niệm đạo hàm (học kì II) ⇒ BỎ câu + nêu nhãn trong báo cáo** (B036-01, B037-08 đã biết có). Câu khác đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì BỎ + báo.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC:** đề cương chỉ có đáp án ở những mục có cột "Đáp án" trong bảng dưới (không có Word đáp án). Giải xong cả đề cương rồi mới mở trang đáp án. Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`. Lời giải theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn của trường. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai`** (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị; hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10). Câu **trùng nguyên văn** giữa các đề ⇒ giữ nguyên, giải bình thường.
- **Phân kho:** `kho=hinh_hoc` cho hình học không gian (quan hệ song song, giao tuyến, giao điểm, thiết diện, hình chóp / lăng trụ / hộp, phép chiếu song song); còn lại `kho=dai`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B038` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Lớp chữ của PDF mất ký hiệu (chữ Hy Lạp, mũ, căn) nên **gõ đề từ ẢNH** như §2 bên dưới; lớp chữ chỉ để định vị.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề cương B038

| MA | Trường · năm học | Bộ sách | Trang đề | Đáp án | Cấu trúc (ước) · lưu ý |
|---|---|---|---|---|---|
| B038-01 | THPT Linh Trung, TP Hồ Chí Minh · 2025–2026 | không rõ | 1-28 → `trang\p-N` (N = số trang trong PDF gốc) | **KHÔNG có** | 9 đề ôn tập (cô Thu, cô Hà, cô Lan, cô Huyền Trang, thầy Hòa, cô Vân Anh, cô Thục Vy, thầy Duy, cô Hương): I TN · II Đ/S · III TLN · IV tự luận; đề số 4 gộp TN + Đ/S ở Phần 1 (≈199 câu). đề số 9 (cô Hương) có PHẦN TỰ LUẬN 6,0 điểm — cấu trúc riêng; trang 28 còn chữ cuối đề |
| B038-02 | THPT Nguyễn Trãi, Đà Nẵng · 2024–2025 | KNTT | 4-18 → `trang\p-N` (N = số trang trong PDF gốc) | trang 6-7,10,14,17-18 (đáp án / hướng dẫn của trường — nhân chứng) | 4 đề câu hỏi ôn tập: mỗi đề PHẦN I 12 TN · II 4 Đ/S · III 6 TLN, kèm ĐÁP ÁN từng đề (≈99 câu). CÓ ĐÁP ÁN xen sau mỗi đề (bảng TN, Đ/S, TLN; trang 7 có hướng dẫn một số câu) ⇒ nhân chứng, tự giải trước; trang 1–3 nội dung + cấu trúc (BỎ); trang 17 là đuôi Câu 6 đề 4 |
| B038-03 | THPT Nguyễn Trãi, Đà Nẵng · 2025–2026 | KNTT | 4-13 → `trang\p-N` (N = số trang trong PDF gốc) | trang 9 (đáp án / hướng dẫn của trường — nhân chứng) | 3 đề: 2 đề tham khảo (I 12 TN · II 2 Đ/S · III 6 TLN · IV tự luận 3 câu) + 1 đề mẫu thứ ba trang 10–13 (I TN · II Đ/S · III TLN · IV tự luận) (≈77 câu). CÓ ĐÁP ÁN đề tham khảo ở trang 9 (bảng TN, Đ/S, TLN, thang điểm tự luận) ⇒ nhân chứng; trang 1–3 BỎ; khác đề 2024–2025 của cùng trường (đo: 9/180 dòng trùng — chỉ phần mô tả cấu trúc) |

Tất cả đều có lớp chữ (không phải scan) nhưng vẫn gõ từ ảnh.
