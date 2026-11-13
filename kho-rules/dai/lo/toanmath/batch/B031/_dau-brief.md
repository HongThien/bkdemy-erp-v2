# ⚠️⚠️ BẢN ÁP DỤNG BATCH B031 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 11 CỦA TRƯỜNG, TẢI TỪ TOANMATH (8 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 11 (24/10), đã đổi sẵn đường dẫn. Luật kiến thức K11, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B031-NN` (01–08). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B031\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B031\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B031\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B031/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Với đề có `tach`, `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Đề không có `tach` (B031-05) ⇒
  `goc.pdf` là nguyên file, hướng dẫn chấm nằm ở `trang\p-<hd>.png`. Bỏ qua trang ma trận / đặc tả / quảng cáo "Xem thêm … toanmath.com".
- **Đầu tệp (thay khuôn đề cương §3 bên dưới):**
  ```
  # ĐỀ | Đề kiểm tra cuối học kì 1 Toán 11 năm <năm học> — <don_vi> (Mã đề <ma_de>)
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  thoi_gian_phut: <theo đề, thường 90>
  ```
  **KHÔNG có dòng `kieu: de_cuong`.** Năm học viết `2024–2025` / `2025–2026`. Đối chiếu tiêu đề trên ảnh; lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG đề:** `## PHẦN 1 | Trắc nghiệm nhiều phương án | trac_nghiem` · `## PHẦN 2 | Đúng/Sai | dung_sai` · `## PHẦN 3 | Trả lời ngắn | tra_loi_ngan` ·
  (`## PHẦN 4 | Tự luận | tu_luan` nếu đề có). Số câu đúng như `cau_truc`; nhãn câu giữ như đề in ("Câu 1"…, đề đánh số liên tục thì giữ số liên tục). Đ/S đủ 4 ý a–d.
  Câu TLN mà đáp số không tô được 4 ô ⇒ vẫn ở PHẦN 3 nhưng `loai=tu_luan` + `**Ghi chú:**` (luật §3 bên dưới).
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 11 THEO BỘ SÁCH CỦA ĐỀ** (`bo_sach` trong ds-de.json; `bo_sach_can_cu` nói căn cứ — "suy đoán" nghĩa là đề không ghi):
  - **KNTT:** C1 Hàm số LG & PTLG · C2 Dãy số, CSC, CSN · C3 Số đặc trưng mẫu ghép nhóm · C4 Quan hệ song song trong không gian · C5 Giới hạn, hàm số liên tục
    (như §1 bên dưới) + toàn bộ lớp ≤ 10.
  - **Cánh Diều (B031-06):** Ch I Hàm số LG & PTLG · Ch II Dãy số, CSC, CSN · Ch III Giới hạn, hàm số liên tục · Ch IV Quan hệ song song (cả hình lăng trụ, hình hộp,
    phép chiếu song song) — cùng chủ đề KNTT, thứ tự khác; thống kê mẫu ghép nhóm của Cánh Diều nằm học kì 2 (ma trận của trường không có).
  - **CTST** (nếu ảnh cho thấy): Ch1 LG · Ch2 Dãy số · Ch3 Giới hạn · Ch4 Quan hệ song song · Ch5 Mẫu ghép nhóm — cùng phạm vi KNTT.
  - Thấy ảnh ghi bộ sách khác `bo_sach` ⇒ sửa dòng `bo_sach:` theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
  - **CẤM** như brief gốc: đạo hàm · mũ–logarit · xác suất lớp 11 · quan hệ vuông góc · L'Hôpital · định lí ngoài SGK (Menelaus, Ceva… — tự chứng minh bằng
    Thales / đường trung bình / tính chất song song). Câu đề tự đòi kiến thức ngoài phạm vi ⇒ giải bằng cái đã học nếu được, không thì `**Chưa chắc:**`.
- **Đáp án của trường = NHÂN CHỨNG, TỰ GIẢI TRƯỚC** (như B001): giải xong cả đề rồi mới mở trang `hd` (và/hoặc Word `dap_an_word` — đọc bằng node + `jszip`, đường dẫn
  có dấu nên không dùng poppler). Khớp ⇒ tốt. Lệch ⇒ tính lại bằng máy; đáp án trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`.
  Lời giải viết theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Phân kho:** `kho=hinh_hoc` cho hình học không gian (quan hệ song song, giao tuyến, giao điểm, thiết diện, hình chóp/lăng trụ/hộp, phép chiếu song song); còn lại `kho=dai`.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B031` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B031

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B031-01 | THPT Kon Tum · 111 | KNTT? | 1–4 | `hd\p-9.png` (bảng 4 mã, cột 111) + Word | ~75% câu đã có trong kho dưới tên "Đề ôn tập CKI Toán 11 Cánh Diều (Toán Từ Tâm, Đề số 6)" (bản phóng tác của đề này) — vẫn soạn đủ, máy gom câu trùng khi ghi |
| B031-02 | THPT Minh Hà, Hà Nội · 001 | KNTT | 1–4 | `hd\p-9.png` (đề 001-002) + Word | |
| B031-03 | THPT Ngô Gia Tự, Đắk Lắk · 401 | KNTT? (không có câu thống kê) | 1–3 | `hd\p-7.png`, `p-8.png` (bảng mã 401–408, cột 401) | Không có Word đáp án |
| B031-04 | THPT Bắc Yên Thành, Nghệ An · 101 | KNTT? | 1–3 | `hd\p-7…11.png` + Word | Đề "KSCL cuối kì 1": PHẦN I 8 TN · II 3 Đ/S · III 4 TLN · PHẦN 4 tự luận 4 câu. ⚠ Đáp án tự luận trang 7–8 ghi "MÃ ĐỀ 101,103" nhưng Câu 1 không khớp đề mã 101 (đề: $x\to-1$, $2x^2+5x+3$; đáp án: $x\to2$, $2x^2-3x-2$) — tìm đúng phần ở trang 9–11; không thấy ⇒ coi tự luận không có đáp án |
| B031-05 | THPT Hòa Vang, Đà Nẵng · 101 | KNTT? | 1–4 (nguyên file) | `trang\p-5.png`, `p-6.png` (lời giải chi tiết) + Word | Một mã duy nhất. PHẦN 4 tự luận 3 câu |
| B031-06 | THPT số 1 Lê Hồng Phong, Đắk Lắk · 1246 | **Cánh Diều** | 1–3 | `hd\p-7…11.png` (bảng mã 2103 · 5378 · **1246** · 3579; TLN ở trang 11) | Không có Word đáp án (Word "BẢNG ĐẶC TẢ" chỉ là đặc tả) |
| B031-07 | THPT chuyên Trần Phú, Hải Phòng — **môn Toán chuyên** · 101 | KNTT? | 1–4 | `hd\p-9…11.png` + Word | PHẦN I 16 TN · II 2 Đ/S · III 4 TLN · IV 2 bài. **PHẦN I–III GIỐNG HỆT B031-08**, chỉ PHẦN IV khác (Bài 1 PTLG tích → tổng; Bài 2 diện tích thiết diện lăng trụ) |
| B031-08 | THPT chuyên Trần Phú, Hải Phòng — môn Toán · 101 | KNTT? | 1–4 | `hd\p-9…11.png` + Word | Như B031-07 (PHẦN IV: Bài 1 giao tuyến của mp qua M // (SAB); Bài 2 PTLG $\sin 2x=3m-1$ theo tham số). ~50% câu đã có trong kho dưới tên "Toán Từ Tâm CD Đề số 4" |

Đề nào cũng là PDF có lớp chữ (không scan) nhưng **vẫn gõ từ ẢNH** (lớp chữ mất ký hiệu). Word đề của trường (`Ma de 111.docx`, `Made 1246.docx`…) KHÔNG dùng làm nguồn gõ.
