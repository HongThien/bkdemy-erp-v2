# ⚠️⚠️ BẢN ÁP DỤNG BATCH B044 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 10 CỦA TRƯỜNG, TẢI TỪ TOANMATH (8 đề cương, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 10 (25/10), đã đổi sẵn đường dẫn. Luật kiến thức K10, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B044-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B044\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach`, `bo_sach_can_cu`,
  `de` (trang có bài tập **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (ước số câu — chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B044\<MA>` (có `goc.pdf` = NGUYÊN file, `trang\p-N.png` **150 dpi** đánh số theo trang file gốc, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`. Bỏ qua trang bìa / mục lục / ma trận / đặc tả / lý thuyết chỉ chữ / quảng cáo "Xem thêm … toanmath.com".
- **MỘT ĐỀ CƯƠNG = MỘT MỤC (một tệp soạn)** — tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B044\<MA>.soan.md`. Đề cương dài (ước > ~120 câu) vẫn là một mục; **người điều phối tự chia khúc khi soạn**
  (khi đó hậu tố `.p<P>` do điều phối quy định). **BỎ bước `ghep-k10.mjs`/ghép khúc ở §7 bên dưới nếu điều phối giao cả mục một lượt.** Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B044/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
- **Đầu tệp (thay khuôn §3 bên dưới):**
  ```
  # ĐỀ | Đề cương ôn tập cuối học kì 1 Toán 10 năm <năm học> — <don_vi>
  kieu: de_cuong
  nam: <nam>
  bo_sach: <bo_sach trong ds-de.json: KNTT | Cánh Diều | CTST>
  ```
  Năm học viết `2024–2025` / `2025–2026` / `2026–2027` theo đúng ảnh tiêu đề (tên tệp có thể lệch); lệch thì theo ảnh + ghi ở `## GHI CHÚ CHO NGƯỜI DUYỆT`.
- **PHẦN theo ĐÚNG cách đề cương chia** (TN · Đ/S đủ 4 ý a–d · TLN · tự luận); đề cương nhiều "ĐỀ SỐ" / nhiều phần ⇒ mỗi đề/phần một PHẦN riêng, đúng như in. Nhãn câu giữ như in (đề cương đánh số lại từ Câu 1 ở mỗi PHẦN thì giữ + nhãn duy nhất trong PHẦN).
- **Phạm vi kiến thức = CUỐI HỌC KÌ 1 lớp 10** (bộ sách ghi ở `bo_sach`; dấu "?" = suy đoán — đề cương không ghi, đọc lại tiêu đề / tên chương trên ảnh):
  - Luật gốc `k10/de-cuong/brief-soan.md` §1: whitelist = **KNTT Toán 10 tập 1** — C1 Mệnh đề và tập hợp · C2 BPT và hệ BPT bậc nhất hai ẩn · C3 Hệ thức lượng trong tam giác ·
    C4 Vectơ (kể cả toạ độ, tích vô hướng) · C5 Các số đặc trưng mẫu số liệu **không ghép nhóm** (số gần đúng – sai số, trung bình, trung vị, tứ phân vị, mốt, khoảng biến thiên, khoảng tứ phân vị, phương sai, độ lệch chuẩn, giá trị ngoại lệ) + toàn bộ lớp ≤ 9.
  - **Hàm số, đồ thị, hàm số bậc hai, dấu tam thức bậc hai** (KNTT chương VI — tập 2) **CHỈ được dùng khi chính đề cương nêu** (nhiều đề cương Hà Nội xếp vào HK1: Trần Phú, Cầu Giấy, Bắc Thăng Long, Phúc Thọ, Linh Trung, Hoàng Văn Thụ 2024-2025, Sơn Động 3…).
    Đề cương không nêu thì **CẤM**. Đề cương theo **Cánh Diều / CTST** (xem `bo_sach`) ⇒ giải đúng kiến thức đề cương đó kiểm tra, ghi `bo_sach` đúng.
  - Có đề cương **chỉ một phần** chương trình (vd Xuân Đỉnh, Đại Mỗ: chỉ Vectơ + Số đặc trưng; Đức Trọng: chương III–V; Trần Phú: phần sau giữa kì): giải đúng phần đề in, không bổ sung.
  - **CẤM** như brief gốc: đạo hàm · giới hạn · mũ–logarit · tích phân · tổ hợp–xác suất lớp 10 chương sau · công thức chưa học (hạ bậc, tích → tổng…) · định lí ngoài SGK (tự chứng minh bằng kiến thức đã học).
    Tiêu đề ghi "mẫu số liệu ghép nhóm" ở chương V (Yên Hòa 2025-2026): đọc ảnh — nếu thật là ghép nhóm thì ghi `**Chưa chắc:**`, không tự quyết.
- **Phân kho:** `kho=hgt` cho Vectơ (khái niệm, tổng–hiệu–tích với số, tích vô hướng, toạ độ vectơ, chứng minh đẳng thức vectơ, lực – vận tốc); còn lại `kho=dai` (kể cả hệ thức lượng tam giác, BPT, mệnh đề–tập hợp, số đặc trưng, hàm số). Kho `hinh_hoc` KHÔNG dùng ở khối 10.
- **Đáp án / hướng dẫn chấm = NHÂN CHỨNG, TỰ GIẢI TRƯỚC.** Đề cương có đáp án (cột "Đáp án" bên dưới; Nguyễn Trãi Đà Nẵng có bảng đáp án các đề tham khảo; Nguyễn Công Trứ in "Đáp án:/Đáp số:" sau một số câu) ⇒ giải xong rồi mới đối chiếu;
  lệch ⇒ tính lại bằng máy; đáp án của trường sai thì GIỮ đáp án đúng + `**Ghi chú:** đáp án của trường ghi …, đúng là … vì …`. Không có đáp án ⇒ tự giải toàn bộ, chỗ không kiểm chứng được ⇒ `**Chưa chắc:**`.
  Lời giải theo khuôn 2 phần, KHÔNG chép nguyên văn hướng dẫn chấm. Trả lời cuối nói rõ: có đáp án không, khớp bao nhiêu câu, lệch câu nào.
- **Luật chung đã chốt:** đề sai ⇒ giải theo đề in + `**Ghi chú:** đề sai` (không treo Chưa chắc); chỉ sửa chữ đề khi lỗi in HIỂN NHIÊN; KHÔNG tự thêm câu hỏi / tự chọn giá trị;
  hai phương án TN cùng đúng ⇒ sửa phương án nhiễu thành sai hẳn + Ghi chú (Thùy 10/10); mọi đáp số thử lại bằng máy; **KHÔNG ghi `\text`, `\frac`, `\notin`, `\neq` qua chuỗi JS (dùng Write/Edit)**.
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B044` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.
- Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

## Ghi chú riêng từng đề cương B044

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B044-01 | THPT Hoàng Văn Thụ, Hà Nội · 2024–2025 | KNTT? | 2-17 | **KHÔNG có** | chữ | ~99 | Bài tập tự luận theo chủ đề; không đáp án; p1 mục tiêu (bỏ) |
| B044-02 | THPT Xuân Đỉnh, Hà Nội · 2024–2025 | KNTT? | 1-13 | **KHÔNG có** | chữ | ~103 | CHỈ phần Vectơ + Số đặc trưng (không có chương I–III); TN + tự luận; không đáp án |
| B044-03 | THPT Sơn Động số 3, Bắc Ninh · 2025–2026 | KNTT | 8-11 | **KHÔNG có** | chữ | ~21 | p1–7 lý thuyết chỉ chữ (bỏ), p12 trống, p13 quảng cáo toanmath; cấu trúc 12 TN · 2 Đ/S · 4 TLN · 3 tự luận; ít câu |
| B044-04 | THPT Bắc Thăng Long, Hà Nội · 2025–2026 | KNTT? | 1-10 | **KHÔNG có** | chữ | ~107 | Nhiều "ĐỀ SỐ" cùng một tệp, có KQ trả lời ngắn; không đáp án |
| B044-05 | THPT Hướng Hóa, Quảng Trị · 2025–2026 | KNTT? | 9-21 | **KHÔNG có** | chữ | ~130 | "Ngân hàng đề ôn tập cuối kỳ I": DT1 TN · DT2 Đ/S · DT3 TLN · tự luận; kho đã có đề cuối kì thật của trường (≈4 câu trùng, 24%) — vẫn giữ |
| B044-06 | THPT Ngô Quyền, Đà Nẵng · 2024–2025 | KNTT? | 8-21 | **KHÔNG có** | chữ | ~100 | Có đề ôn mã đề 101 (3 trang) rồi bài tập các chương; không đáp án; p21 quảng cáo |
| B044-07 | THPT Nguyễn Bỉnh Khiêm, Gia Lai · 2024–2025 | KNTT? | 1-14 | **KHÔNG có** | chữ | ~156 | Nhiều "ĐỀ SỐ" (TN 7đ + tự luận); không đáp án |
| B044-08 | THPT Phúc Thọ, Hà Nội · 2024–2025 | KNTT? | 1-16 | **KHÔNG có** | chữ | ~123 | p1 danh mục lý thuyết + câu; TLN "Trả lời:…"; không đáp án |
