# ⚠️⚠️ BẢN ÁP DỤNG BATCH B032 — ĐỀ CUỐI HỌC KÌ 1 TOÁN 11 CỦA TRƯỜNG, TẢI TỪ TOANMATH (4 đề, 13/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 11 (24/10), đã đổi sẵn đường dẫn. Luật kiến thức K11, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B032-NN` (01–04). Danh sách đề: `Repo\kho-rules\dai\lo\toanmath\batch\B032\ds-de.json` — mỗi đề có `don_vi`, `nam` (năm đầu năm học),
  `ma_de`, `bo_sach`, `cau_truc` (số câu từng PHẦN đã đếm sẵn), `de` / `hd` (trang ĐỀ / trang HƯỚNG DẪN CHẤM **trong file PDF gốc**), `tach`, `dap_an_word`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B032\<MA>` (đã có `goc.pdf`, `trang\p-N.png` **150 dpi**, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`.
- **MỘT ĐỀ = MỘT TỆP:** tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B032\<MA>.soan.md` (không chia khúc `.p<P>`). Bạn soạn CẢ đề.
  **BỎ bước `ghep-k11.mjs`** ở §7 bên dưới. Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B032/<MA>.soan.md --lam-viec "<LV>" --khoi 11 --chi-kiem`
- **Đề nhiều mã ⇒ chỉ MỘT mã (mã đầu), đã chọn sẵn ở `tach`/`ma_de`.** Với đề có `tach`, `goc.pdf` + `trang\` CHỈ chứa trang của mã đó (đánh số lại p-1…);
  trang hướng dẫn chấm của file gốc đã render riêng vào `<LV>\hd\p-N.png` (N = số trang trong file gốc, đúng như `hd`). Đề không có `tach` (B032-01, 03, 04) ⇒
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
  - **Cánh Diều:** Ch I Hàm số LG & PTLG · Ch II Dãy số, CSC, CSN · Ch III Giới hạn, hàm số liên tục · Ch IV Quan hệ song song (cả hình lăng trụ, hình hộp,
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
  `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B032` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.

## Ghi chú riêng từng đề B032

| MA | Trường · mã đề | Bộ sách | Trang đề → `trang\` | Đáp án | Lưu ý |
|---|---|---|---|---|---|
| B032-01 | THPT Lê Quý Đôn, TP Hồ Chí Minh · 102 | KNTT? | 1–4 (nguyên file) | **KHÔNG có** | **SCAN** (không lớp chữ) — chữ nhỏ thì phóng 300 dpi, không đoán. 12 TN · 4 Đ/S · 6 TLN. Tự giải toàn bộ; chỗ chưa kiểm chứng bằng máy ⇒ `**Chưa chắc:**` |
| B032-02 | THPT Nguyễn Trãi, Thái Bình · 101 | KNTT? (không có câu thống kê) | 1–3 | `hd\p-13.png` (bảng 4 mã, cột 101) | 12 TN · 4 Đ/S · 6 TLN. Không có Word đáp án |
| B032-03 | THPT Krông Bông, Đắk Lắk · 011 | KNTT? (không có câu thống kê) | 1–4 (nguyên file) | **KHÔNG có** | **60 phút**; 19 câu đánh số LIÊN TỤC: TN câu 1–12 · Đ/S câu 13–16 · TLN câu 17–19 — giữ nhãn như đề in. Tự giải toàn bộ |
| B032-04 | THPT Duy Tân, Quảng Ngãi · 111 | KNTT? | 1–3 (nguyên file) | `trang\p-4.png`, `p-5.png` | Đề in "PHẦN I. Trắc nghiệm (7 điểm)" gồm 3 mục (1. 12 TN · 2. 2 Đ/S · 3. 4 TLN) + "PHẦN II. Tự luận" 2 câu ⇒ tệp soạn tách thành `## PHẦN 1` TN · `## PHẦN 2` Đ/S · `## PHẦN 3` TLN · `## PHẦN 4` tự luận; nhãn giữ như in (mỗi mục đánh lại từ Câu 1) + ghi cách tách ở `## GHI CHÚ CHO NGƯỜI DUYỆT` |

Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

