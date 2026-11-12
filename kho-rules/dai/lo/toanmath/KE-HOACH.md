# Kế hoạch giải phần còn lại bộ đề toanmath — theo BATCH

> Lập 12/11/2026. Số liệu từ `hang-doi.json` (đo sha256 + kiểm nghi trùng bằng nội dung) và kết quả bóc máy lượt Word.
> Danh sách bài từng batch: `batch.json` (sinh bởi `lap-batch.mjs`). Tiến độ: `so-theo-doi.md` (sinh bởi `so-theo-doi.mjs`, không sửa tay).

## 1. Phạm vi

Bộ đã tải 2.988 bài đăng: **1.474 đã có trong kho** · **1.501 còn phải làm** · 13 bài không có file (bỏ).

| Giai đoạn | Batch | Bài | Câu | Ghi chú |
|---|---|---|---|---|
| 1. Word đã bóc (K7, K10–12 đề thi + đề cương) | B001–B006 | 38 | 1.066 (đã bóc) | B001 là batch thử |
| 2. THCS đề thi K6→K9 + vào 10 | B007–B036 | 492 | chưa bóc | gồm 6 batch scan nghi trùng (B027–B032) |
| 3. THCS đề cương K6→K9 | B037–B062 | 248 | chưa bóc | ≤10 bài/batch vì đề cương dài |
| 4. K10–12 đề thi + đề chính thức THPT | B063–B073, B103 | 175 | chưa bóc | gồm scan nghi trùng (B071–B073) |
| 5. K10–12 đề cương | B074–B102 | 279 | chưa bóc | |
| 6. **K12 thi thử — làm cuối** | B104–B119 | 269 | 1.100 phần Word | Word 4 batch, PDF 10 batch, scan 2 batch |
| **Tổng** | **119 batch** | **1.501** | | |

Cỡ batch: Word ≤ ~280 câu · PDF đề thi ≤ 20 bài · PDF đề cương ≤ 10 bài. Số câu PDF chỉ biết sau khi bóc —
bóc xong mà batch > 300 câu thì tách thành `a`/`b`, mỗi nửa báo cáo riêng.

## 2. Một batch đi qua 7 bước — xong batch này mới mở batch sau

| # | Bước | Ai/công cụ | Ra |
|---|---|---|---|
| 1 | **Bóc** | Word: `boc-word.mjs` (máy, 0 AI) · PDF: `boc-pdf.mjs` (Gemini) | số câu, bài bóc 0 câu, câu hỏng công thức |
| 2 | **Đo trùng kho TRƯỚC khi giải** | so nội dung chuẩn hoá với kho (cùng luật `insertCauBatch`), chỉ đọc DB, **ngoài 17–22h** | câu trùng ⇒ loại khỏi lượt giải (đỡ tốn AI) |
| 3 | **Sonnet giải chi tiết** | subagent Sonnet, lô ~60 câu, brief `de-hoc-ki/brief-giai-chi-tiet.md` + luật khối `kho-rules/dai/k<khối>.md` | đáp án + lời giải |
| 4 | **Opus giải mù** | subagent Opus, KHÔNG thấy bài Sonnet | đáp số độc lập |
| 5 | **So khớp** | máy | khớp · lệch · bỏ (câu hỏng / thiếu hình / đề sai) |
| 6 | **HTML duyệt** | `build-duyet-html.mjs` — ảnh gốc + đề + lời giải, câu lệch đứng đầu | **Thùy xem** |
| 7 | **Ghi DB khi Thùy nói "ghi"** | `ghi.mjs --ghi` — `da_duyet=false`, dạng chờ `…000000`, tạo `tai_lieu` đề thi | số câu ghi, số câu trỏ về câu cũ |

Luật áp ở mọi batch:
- Chỉ ghi câu **Sonnet và Opus ra cùng đáp số**. Câu lệch không ghi — liệt kê trong báo cáo.
- Câu Hình (K6–K9) vào `hinh_hoc_*`; câu Đúng/Sai vào kho Đ/S cấp chủ đề, không gán dạng cả câu.
- Đề sai: giải bình thường, ghi rõ đề sai. Đường trung bình chỉ dùng cho đề Hoàng Mai.
- Batch scan nghi trùng: bóc xong so kho trước — nếu trùng thì dừng ở bước 2, không giải.
- Phân dạng (B3) **không** nằm trong batch — làm sau theo khối, khi bản đồ khối đó sẵn sàng.

## 3. Báo cáo sau mỗi batch (gửi Thùy, ghi `batch/<ma>/bao-cao.json`)

| Mục | Ví dụ |
|---|---|
| Bài · câu bóc · bài bóc 0 câu | 7 bài · 142 câu · 0 |
| Trùng kho (loại trước khi giải) | 18 câu |
| Sonnet giải · Opus khớp · lệch · bỏ | 124 · 110 · 9 · 5 |
| Ghi DB (mới / trỏ câu cũ) | 110 (104 / 6) |
| Lỗi phát sinh + cách sửa | … |
| Thời gian · lượt AI | … |
| Link HTML duyệt | … |

Sau **B001 (batch thử)** dừng lại báo: tỉ lệ khớp, tỉ lệ trùng, thời gian/batch ⇒ Thùy quyết nhịp
(1 batch/lượt hay gộp 2–3) và có cần chỉnh brief không, rồi mới sang B002.

## 4. Việc còn treo, không nằm trong batch

- 35 file Word bóc lỗi + 15 bài Word 0 câu — đã dồn vào batch PDF cùng khối.
- Bù lời giải cho 2.411 câu Đ/S đã có trong kho.
- 13 bài không có file (11 bài "bo-de … knttvcs" CSV ghi không tải được).
