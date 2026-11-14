# ⚠️⚠️ BẢN ÁP DỤNG BATCH B042 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 10 CỦA TRƯỜNG, TẢI TỪ TOANMATH (2 đề, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 10 (25/10), đã đổi sẵn đường dẫn. Luật kiến thức K10, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B042-NN` (01–02). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B042\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B042\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `hd\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B042\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước ghép khúc** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B042/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Cả hai đề của batch này đều có `tach`: `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Bỏ qua trang ma trận / đặc tả / quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra cuối học kì 1 Toán 10 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2024–2025`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in (Phần II/III đánh lại từ "Câu 1"). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô ⇒ vẫn ở PHẦN 3 nhưng `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 10 THEO BỘ SÁCH CỦA ĐỀ** (đề KHÔNG ghi bộ sách ⇒ `bo_sach: KNTT` kèm "suy đoán" ở `bo_sach_can_cu`):
  - **KNTT (Tập 1):** C1 Mệnh đề và tập hợp · C2 BPT và hệ BPT bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác · C4 Vectơ (kể cả toạ độ của vectơ, tích vô hướng) ·
    C5 Các số đặc trưng của mẫu số liệu không ghép nhóm (số gần đúng – sai số, tứ phân vị, độ lệch chuẩn…) + toàn bộ lớp ≤ 9. Đề nào kiểm tra tới hàm số bậc hai / Tập 2 thì giải đúng cái đề hỏi + `**Chưa chắc:**`.
  - **CẤM** như brief gốc K10: đạo hàm · giới hạn · mũ–logarit · tích phân · tổ hợp/xác suất lớp 10 chương sau · công thức chưa học (hạ bậc, tích → tổng…) · định lí ngoài SGK. Câu đề tự đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì `**Chưa chắc:**`.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC**: giải xong cả đề rồi mới mở trang `hd` (và/hoặc Word `dap_an_word` — đọc bằng node + `jszip`, đường dẫn có dấu nên không dùng poppler).
  Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho (như brief gốc K10 §3):** `kho=hgt` cho câu **Vectơ** (khái niệm, tổng – hiệu, tích với số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, lực – vận tốc);
  `kho=dai` cho mọi câu còn lại — kể cả **hệ thức lượng trong tam giác** (sin, côsin, diện tích, giải tam giác, đo đạc), mệnh đề – tập hợp, BPT – hệ BPT, số đặc trưng. Câu nhập nhằng ⇒ chọn theo bản chất + `**Ghi chú:**`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B042` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- Luật chung đã chốt: đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit).
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B042

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B042-01 | THPT Ngô Gia Tự, Đắk Lắk · 001 | KNTT? | 1–3 → `trang\p-1…p-3` (`goc.pdf` chỉ chứa mã 001) | `hd\p-7.png`, `hd\p-8.png` (bảng 7 mã 001–007 trên p-7, mã 008 trên p-8; **chỉ đọc cột 001**) | Đề 3 trang, **22 câu = 12 TN + 4 Đ/S + 6 TLN, KHÔNG có tự luận**. Một số câu TLN (câu 2 "ba lực", câu 3 tam giác đều với k = a/b) đọc kĩ ảnh; đáp số không tô được 4 ô ⇒ `loai=tu_luan` + Ghi chú |
| B042-02 | THPT Quế Sơn, Quảng Nam · 101 | KNTT? | 1–3 → `trang\p-1…p-3` | `hd\p-7.png` (đáp án TN 4 mã 101–104, **chỉ cột 101**) và `hd\p-8.png` (tự luận "Đề 101 + 102") | **4 PHẦN, ĐIỂM khác chuẩn:** I 25 TN (5,0 đ, câu 1–25) · II 2 Đ/S (2,0 đ) · III 2 TLN (1,0 đ) · IV tự luận 2 câu (2,0 đ) = 31 câu. Câu 10 và 15 dùng chung một bảng thời gian chạy 100 m; Đ/S câu 2 có hình tam giác MNP; TLN câu 2 có bảng điểm 40 học sinh; tự luận câu 2 có hình lực. Trang 9–14 là ma trận / đặc tả — BỎ QUA (không nằm trong `goc.pdf`) |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).
