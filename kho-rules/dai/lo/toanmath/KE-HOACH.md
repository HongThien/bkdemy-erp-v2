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

## 2. Quy trình (Thùy 15/11)

**Quy trình, luật, điều kiện vào kho: `spec-giai-bai.md` Phần C** (8 trạm · phân dạng trước · Sonnet giải, Opus kiểm một phần · câu đủ 4 điều kiện tự vào kho,
chưa chắc → trưởng khối · không HTML duyệt, không chờ "ghi" · lô mẫu một lần mỗi khối × loại kì). Brief batch: `ghep-brief.mjs <BATCH> <khối>` (cắt từ spec).
**Tình trạng: `TINH-TRANG.md`** (`tinh-trang.mjs`, chạy lại sau mỗi việc). 

## 4. Việc còn treo, không nằm trong batch

- 35 file Word bóc lỗi + 15 bài Word 0 câu — đã dồn vào batch PDF cùng khối.
- Bù lời giải cho 2.411 câu Đ/S đã có trong kho.
- 13 bài không có file (11 bài "bo-de … knttvcs" CSV ghi không tải được).
