# Kế hoạch giải phần còn lại bộ đề toanmath — theo BATCH

> Lập 12/11/2026. Số liệu từ `hang-doi.json` (đo sha256 + kiểm nghi trùng bằng nội dung) và kết quả bóc máy lượt Word.
> Danh sách bài từng batch: `batch.json` (sinh bởi `lap-batch.mjs`). Tiến độ: `so-theo-doi.md` (sinh bởi `so-theo-doi.mjs`, không sửa tay).

## 1. Phạm vi

Bộ đã tải 2.988 bài đăng: **1.474 đã có trong kho** · 13 bài không có file (bỏ) · 1.501 chưa có, trong đó **bỏ 118**:
- **96 bài đề cương K12 — KHÔNG làm** (Thùy 12/11: đề thi thử K12 đã quá nhiều).
- **22 bài trùng bộ Noctorium** (đề K12 nhập từ Word Noctorium, file khác nên sha256 không bắt được) — đủ 2 nhân chứng:
  nội dung (cụm 6 chữ, câu khớp ≥50% cụm, vượt hẳn đề đứng nhì) + tên trường khớp. Chi tiết: `kiem-noctorium.json` (`bo_vi_noctorium`).

⇒ **Còn làm 1.383 bài, 130 batch.**

**Thứ tự (Thùy 12/11): CUỐI KÌ trước, khối 9 → 8 → 7 → 6 → 11 → 10 → 12;** rồi giữa kì cùng thứ tự khối; rồi thi vào lớp trên
(K12 thi thử sau cùng). Trong mỗi khối: đề thi (Word đã bóc → PDF → scan nghi trùng) rồi đề cương.

| Chặng | Khối | Batch | Đề thi | Đề cương | Ghi chú |
|---|---|---|---|---|---|
| **1. Cuối kì** (CKI + CKII) | K9 | B001–B009 | 77 | 34 | **B001 = batch thử** |
| | K8 | B010–B016 | 52 | 35 | |
| | K7 | B017–B023 | 46 | 29 | |
| | K6 | B024–B030 | 25 | 31 | |
| | K11 | B031–B040 | 30 | 48 | 287 câu Word đã bóc |
| | K10 | B041–B049 | 8 | 54 | 139 câu Word đã bóc |
| | K12 | B050–B054 | 50 | — | đề cương K12 không làm |
| **2. Giữa kì** (GKI + GKII) | K9 | B055–B063 | 72 | 32 | |
| | K8 | B064–B072 | 71 | 34 | |
| | K7 | B073–B080 | 47 | 29 | |
| | K6 | B081–B086 | 29 | 24 | |
| | K11 | B087–B096 | 44 | 43 | 214 câu Word |
| | K10 | B097–B105 | 18 | 45 | 125 câu Word |
| | K12 | B106–B109 | 47 | — | |
| **3. Thi vào lớp trên** | K9 vào 10 | B110–B114 | 74 | — | 9 đề chính thức + 65 thi thử |
| | K12 THPT | B115–B130 | 255 | — | 6 chính thức + thi thử (955 câu Word) — **sau cùng** |
| **Tổng** | | **130 batch** | **945** | **438** | |

Chặng 1 (cuối kì) = 54 batch, 519 bài (288 đề thi + 231 đề cương).

Noctorium chưa đo được: 73 bài scan K12 (không có lớp chữ) và 72 bộ nhiều đề (4 bộ có chứa ≥1 đề Noctorium) — bước 2 của từng
batch (đo trùng kho sau khi bóc) sẽ bắt, câu trùng tự trỏ về câu cũ lúc ghi.

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
| 5b | **Đẩy hình lên kho NGAY** | `anh-batch.mjs day <BATCH>` (Thùy 13/11: hình không được nằm ở máy) | máy nào cũng ghi được; `ghi-batch.sh` tự `keo` về |
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
B001 = 16 đề thi cuối kì K9 dạng PDF ⇒ đo luôn cả khâu bóc Gemini và tách câu Hình (vào `hinh_hoc_*`) — hai khâu chặng 1 dùng nhiều nhất.

## 4. Việc còn treo, không nằm trong batch

- 35 file Word bóc lỗi + 15 bài Word 0 câu — đã dồn vào batch PDF cùng khối.
- Bù lời giải cho 2.411 câu Đ/S đã có trong kho.
- 13 bài không có file (11 bài "bo-de … knttvcs" CSV ghi không tải được).
