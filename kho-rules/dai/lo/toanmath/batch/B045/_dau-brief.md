# ⚠️⚠️ BẢN ÁP DỤNG BATCH B045 — ĐỀ CƯƠNG ÔN TẬP CUỐI HỌC KÌ 1 TOÁN 10 CỦA TRƯỜNG, TẢI TỪ TOANMATH (9 đề cương, 14/11/2026) — ĐỌC TRƯỚC, ĐÈ LÊN MỌI DÒNG BÊN DƯỚI

Bên dưới là brief GÕ + GIẢI đã chạy thật cho đề cương Toán 10 (25/10), đã đổi sẵn đường dẫn. Luật kiến thức K10, khuôn câu (TN · Đ/S · TLN · tự luận),
khuôn lời giải 2 phần, hình, bẫy: GIỮ NGUYÊN. Chỉ khác những điểm sau:

- `<MA>` = `B045-NN`. Danh sách đề cương: `Repo\kho-rules\dai\lo\toanmath\batch\B045\ds-de.json` — mỗi mục có `don_vi`, `nam` (năm đầu năm học), `bo_sach`, `bo_sach_can_cu`,
  `de` (trang có bài tập **trong file PDF gốc**), `hd` (trang đáp án nếu có), `uoc_cau` (ước số câu — chỉ để chia khúc), `ghi_chu`.
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\B045\<MA>` (có `goc.pdf` = NGUYÊN file, `trang\p-N.png` **150 dpi** đánh số theo trang file gốc, `img\`, `tam\`, `de.boc.json`).
  Phóng to: `pdftoppm -r 300 … -x -y -W -H` với toạ độ 300 dpi = **2 ×** toạ độ trên `p-N.png`. Bỏ qua trang bìa / mục lục / ma trận / đặc tả / lý thuyết chỉ chữ / quảng cáo "Xem thêm … toanmath.com".
- **MỘT ĐỀ CƯƠNG = MỘT MỤC (một tệp soạn)** — tệp soạn `Repo\kho-rules\dai\lo\toanmath\batch\B045\<MA>.soan.md`. Đề cương dài (ước > ~120 câu) vẫn là một mục; **người điều phối tự chia khúc khi soạn**
  (khi đó hậu tố `.p<P>` do điều phối quy định). **BỎ bước `ghep-k10.mjs`/ghép khúc ở §7 bên dưới nếu điều phối giao cả mục một lượt.** Cổng duy nhất (chạy ở Repo, sửa tới khi "✔ đạt cổng"):
  `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/B045/<MA>.soan.md --lam-viec "<LV>" --khoi 10 --chi-kiem`
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
- **Hình:** cắt hình đề / vẽ hình giải đúng §4 bên dưới, Read kiểm từng hình. Xong và soát xong ⇒ **người điều phối** chạy `node kho-rules/dai/lo/toanmath/anh-batch.mjs day B045` (hình sống trên kho — Thùy 13/11). Trạm không tự chạy.
- KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp nào khác ngoài `<MA>.soan.md` và `<LV>\img\`, `<LV>\tam\`, `<LV>\z\`.
- Đề có lớp chữ vẫn **gõ từ ẢNH** (lớp chữ mất ký hiệu).

## Ghi chú riêng từng đề cương B045

| MA | Trường · năm học | Bộ sách | Trang có bài tập (`trang\p-N.png`) | Đáp án | Lớp chữ | ~câu | Lưu ý |
|---|---|---|---|---|---|---|---|
| B045-01 | THPT Thanh Khê, Đà Nẵng · 2024–2025 | KNTT? | 3-10 | **KHÔNG có** | chữ | ~62 | p1–2 ma trận (bỏ); không đáp án |
| B045-02 | THPT Trưng Vương, Bình Định · 2024–2025 | KNTT? | 1-18 | **KHÔNG có** | chữ | ~180 | Bài tập theo chủ đề (TN dày), p18 phiếu họ tên; không đáp án |
| B045-03 | THPT Đức Trọng, Lâm Đồng · 2025–2026 | KNTT | 10-23 | **KHÔNG có** | chữ | ~135 | p1–9 lý thuyết (bỏ), bài tập từ p10; p24 quảng cáo; CHỈ Chương III–V; không đáp án |
| B045-04 | THPT Hoàng Văn Thụ, Hà Nội · 2025–2026 | KNTT? | 2-9 | **KHÔNG có** | chữ | ~64 | Bản nhẹ hơn bản 2024-2025 ("Hàm số", bỏ hàm số bậc hai); không đáp án; 62% cụm chữ trùng với B044-01 — vẫn khác năm học |
| B045-05 | THPT Thanh Khê, Đà Nẵng · 2025–2026 | KNTT? | 3-7 | **KHÔNG có** | chữ | ~42 | p1–2 ma trận (bỏ), p8 quảng cáo; ít câu; không đáp án |
| B045-06 | THPT Bắc Thăng Long, Hà Nội · 2024–2025 | KNTT? | 1-12 | **KHÔNG có** | chữ | ~112 | Nhiều "ĐỀ SỐ" PHẦN 1 TN + Đ/S; không đáp án |
| B045-07 | THPT Phan Đình Phùng, Hà Nội · 2025–2026 | KNTT | 1-16 | **KHÔNG có** | chữ | ~149 | Phần tự luận theo bài (Bài 1…); không đáp án |
| B045-08 | THPT Việt Đức, Hà Nội · 2025–2026 | KNTT | 1-11 | **KHÔNG có** | chữ | ~73 | Đề minh họa số 1.. theo dạng thức 1/2/3; kho có VĐ giữa kì 2026-2027 nhưng khác năm học + nội dung (≤5/62 câu) ⇒ giữ |
| B045-09 | THPT Vân Nội, Hà Nội · 2026–2027 | KNTT? | 1-29 | **KHÔNG có** | chữ | ~308 | Đề cương dài: nội dung + bài tập theo chương; ghi năm học 2026–2027; không đáp án |
