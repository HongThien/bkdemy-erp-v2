# BRIEF LÔ 2 — Hình–Học 8T, chuyên đề Thalès (Thalès · đường trung bình) — nguồn còn lại (Thùy 14/11: "tập trung các câu về Thales, đường trung bình trước", "nhưng không được phép có đồng dạng")

**ĐỌC `BRIEF.md` CÙNG THƯ MỤC TRƯỚC — mọi luật ở đó vẫn áp**, trừ các điểm thay / thêm dưới đây.
`<TH>` của lô 2 = `C:\Users\WBPC\AppData\Local\Temp\claude\0ce3df5438caf103\cf0b21d3-a89a-437b-ae80-9b607bdf58bb\scratchpad\h8t2`. Ghi nháp `<TH>\drafts\draft_<G>.md`, hình `<TH>\hinh_<G>\`, script `<TH>\ve_<G>.mjs`, `<TH>\kiem_<G>.mjs`.
**KHÔNG ghi DB, KHÔNG sửa file trong repo.**

## A. TUYỆT ĐỐI KHÔNG ĐỒNG DẠNG
Lời giải cho mọi mã trong chuyên đề Thalès (`HH00127`, `HH00161`, `HH00128`, `HH00162`, `HH00131`) KHÔNG dùng tam giác đồng dạng, hệ thức lượng, tỉ số diện tích / phương pháp diện tích. Cổng nhập tự chặn các chữ "đồng dạng", "∽/\backsim", "hệ thức lượng", "diện tích" trong lời giải.
Sách giải bằng đồng dạng ⇒ tìm lời giải Thalès (kẻ song song, hệ quả Thalès) gọn và tự nhiên; không có ⇒ `DE_SAU (HH00129…)`, không ép.

## B. CHỈ LÀM bài thuộc chuyên đề Thalès — bài khác để riêng
Mục đích lô này là Thalès + đường trung bình. Sau khi đọc lời giải:
- Lời giải thật sự cần **Thalès / hệ quả / Thalès đảo** ⇒ `HH00127`; cần **đường trung bình** (tam giác hoặc hình thang) ⇒ `HH00161`; cần **tính chất đường phân giác** ⇒ `HH00128`; **bổ đề hình thang** ⇒ `HH00162`; **Mê-nê-la-uýt / Xê-va** ⇒ `HH00131`. Làm đủ (đề + sơ đồ / lời giải + hình + verify).
- Lời giải CHỈ cần kiến thức Tứ giác / tam giác bằng nhau / tam giác cân, đều (không Thalès, không đường trung bình) ⇒ `### <nhãn> → KHAC (HH000xx)` (mã bài Tứ giác: HH00089 hình thang · HH00090 hình bình hành · HH00091 hình chữ nhật · HH00092 hình thoi · HH00093 hình vuông · HH00094 đối xứng; hoặc HH8T000000 nếu chỉ dùng tam giác bằng nhau), chỉ ghi `**nguon:**`, `**noi_dung:**` (đề), `**ly_do:**` một dòng. KHÔNG giải, không vẽ.
- Cần đồng dạng / diện tích / cực trị / quỹ tích ⇒ `DE_SAU (<mã>)` như lô 1.
- Sách KHÔNG có lời giải / chỉ ghi "bạn đọc tự giải / tự chứng minh" / đề mất trang ⇒ `### <nhãn> → KHONG_NHAP` + một dòng lý do (CEO 10/10: chỉ nhập bài có lời giải hoặc đáp số).

## C. TRÙNG ĐỀ — kiểm trước khi làm
Kho đã có 59 câu lô 1 (NĐT Hình I §3, Hình III §1–2; TCHH CĐ5) — bản nháp ở `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\hinh\lo\k8T-thales\drafts\draft_G1.md … draft_G9.md` (grep đề). Sách in lại rất nhiều bài của nhau (TCHH CĐ3 ↔ CĐ1, CĐ2, CĐ5; VHB ↔ NĐT). Bài **giống hệt** (cùng giả thiết, cùng kết luận, chỉ khác tên điểm / lời dẫn) ⇒ `### <nhãn> → TRUNG (<nhãn câu đã có>)` + một dòng. Khác giả thiết / khác yêu cầu = biến thể ⇒ làm bình thường.

## D. KHUÔN LỜI GIẢI (luật 14/11 — viết ngay từ đầu, không viết Phần 1 cho câu chứng minh)
- Câu/ý **chứng minh** (kể cả "tìm điều kiện" có chứng minh hai chiều): khối `**Sơ đồ tư duy**` + `**Phần 2. Trình bày**` chia khúc — khuôn và luật ở `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\README.md` mục "SƠ ĐỒ TƯ DUY" (≈ dòng 130–165), mẫu `…\kho-rules\dai\lo\toanmath\mau-so-do-tu-duy.html`. Ở lô này cột ý luôn `-` (mỗi ý của bài nhiều ý là một câu riêng). Ví dụ chuẩn đã ghi: `…\kho-rules\hinh\lo\k8T-thales\drafts\draft_G6.md` (NDT-H3.16b, 17a).
  ```
  **Sơ đồ tư duy**

  **Mấu chốt:** <đường phụ kẻ gì, vì dấu hiệu nào; ý then chốt>

  - n1 | - | <mốc> | gt | <lý do ngắn>
  - n2 | - | <điều đề hỏi> | n1, gt | <lý do>

  **Phần 2. Trình bày**

  [[so-do:n1]]
  <các dòng ra mốc n1>
  [[so-do:n2]]
  <các dòng ra mốc n2>
  ```
  Ô = MỐC trung gian (không phải từng dòng); "từ" chỉ trỏ gt hoặc ô ĐỨNG TRƯỚC; mỗi ô đúng một khúc đúng thứ tự; mọi dòng Phần 2 nằm sau một `[[so-do:nK]]`.
- Câu **tính** / trả lời ngắn: giữ `**Phần 1. Hướng dẫn**` (Mấu chốt + 3–6 `**Bước k.**` + Chú ý) + `**Phần 2. Trình bày**` như lô 1. `dap_an` dạng số ("6", "4,8", "28/3"); đáp án là một quan hệ ("DE ∥ BC") ⇒ `tu_luan`.
- Tự kiểm khuôn (bắt buộc, lặp tới hết lỗi ở nhãn của mày), chạy từ thư mục repo:
  `node kho-rules/hinh/lo/k8T-thales/nhap_lo.mjs "<TH>" --chi-kiem`

## E. Nguồn lô 2 (ảnh trang 150 dpi, xem bằng Read)
- **TCHH** (`…\bk-kho-lam-viec\sach\8T\TCHH\trang\p-NNN.png`) Chuyên đề 3 "Các bài toán chứng minh vuông góc, song song", **phần II Chứng minh hai đường thẳng song song** (PDF 136–173): "1.2 Một số ví dụ minh hoạ" VD1–10 (có "Giải"), "3. Bài tập tự luyện" Bài 1–45 (có "Hướng dẫn giải" ngay sau đề; **có hai bài cùng nhãn "Bài 14"** ⇒ nhãn `TCHH-3.II.14` và `TCHH-3.II.14bis`). Từ Bài 22 trở đi nhiều bài ra khỏi chủ đề song song (trung tuyến, bất đẳng thức tam giác, đồng quy, đối xứng – cực trị) ⇒ phân loại theo §B. Nhãn: `TCHH-3.II.VD<k>`, `TCHH-3.II.<k>`; nguồn `CĐ3 II VD<k>@p<trang>` / `CĐ3 II Bài <k>@p<trang>`.
- **VHB2** (`…\sach\8T\VHB2\trang\p-NNN.png`) Nâng cao và phát triển Toán 8 tập 2 — Vũ Hữu Bình, Chương III §13 "Định lí Ta-lét" (đề PDF 74–82: VD31–33, BT 171–207) và §14 "Định lí Ta-lét đảo" (đề PDF 82–86: VD34–35, BT 208–218). **Lời giải bài tập dồn ở CUỐI SÁCH**: "Lời giải, chỉ dẫn hoặc đáp số — Phần Hình học" PDF 186–202 (§13 ≈ 186–199, §14 ≈ 199–202) — tìm theo số bài. Ví dụ có lời giải ngay sau đề. Lời giải sách thường TẮT ⇒ viết đủ. Nhãn `VHB2-VD<k>`, `VHB2-<số BT>`; nguồn `§13 BT <k>@p<trang đề> (giải p<trang>)`. Số bài 60–377 dùng chung cho Đại và Hình ở VHB — đừng nhầm với bài Đại.
- **VHB1** (`…\sach\8T\VHB1\trang\p-NNN.png`) tập 1, §2 "Hình thang", phần **Đường trung bình của hình thang, của tam giác**: BT 14–20 (đề PDF 69–72; lời giải cuối sách PDF 177–182). Nhãn `VHB1-<số BT>`.
- Ví dụ của sách: ghi vào khối như bài thường (lô này để cả vào kho luyện; chép sang kho trên lớp làm sau).
