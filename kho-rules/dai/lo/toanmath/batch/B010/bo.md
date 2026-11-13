# B010 — bài BỎ khỏi batch (13/11/2026)

B010 = 17 bài đề thi cuối kì I Toán 8 (toàn bộ `Đề thi/CKI`, không có bài CKII) ⇒ **17 đề, KHÔNG bỏ bài nào.**
Luật Thùy 13/11 (đề nhiều mã chỉ lấy MỘT mã) chỉ cắt TRANG, không bỏ bài:

| Bài | Lấy | Bỏ (trang trong file gốc) |
|---|---|---|
| …ngoc-lam… 2024-25 (4 trang, scan) | Mã đề T801 (trang 1–2) | Mã đề T802 (trang 3–4). File không có hướng dẫn chấm |
| …phuc-dong… 2025-26 (3 trang, scan) | Mã đề 801 (trang 1) | Mã 802 (trang 2), 803 (trang 3). File không có hướng dẫn chấm |
| …phuc-dong… 2024-25 (16 trang, scan) | Mã đề 801 (trang 5–6) | Ma trận + đặc tả (1–4) · hướng dẫn chấm 801 (7–8, không chép vào `goc.pdf` vì tách trang) · mã 802 (9–12) · mã 803 (13–16) |
| …giang-bien… 2025-26 (13 trang, có chữ) | Đề 01 (trang 4–5) | Ma trận + đặc tả (1–3) · hướng dẫn chấm Đề 01 (6–8, không chép vào `goc.pdf`) · Đề 02 + hướng dẫn chấm (9–13) |

## Đo trùng kho — 2 nhân chứng (luật B002/B005)

Máy không kết luận được 8 bài: `khong_doc` (scan) — Lô-mô-nô-xốp, Ngọc Lâm 2024, Phúc Đồng 2025, Thăng Long, Phúc Đồng 2024; `mo_ho` — Hát Môn, Chương Mỹ, Lý Sơn.

- **Nhân chứng 1 (tên + năm):** trong kho, `tai_lieu` loại `de_thi` khối 8 có 50 đề — **toàn bộ là giữa học kì I / đề cương giữa kì**, KHÔNG có đề cuối học kì I nào
  (truy `ten ilike '%cuối%' | '%học kì I %' | '%học kỳ%'` và theo tên từng trường của batch: 0 đề cuối kì). Trùng tên trường duy nhất:
  - THCS Nguyễn Công Trứ, Ba Đình, **giữa** kì 1 2024-2025 (`05d68f17…`) — câu đầu kho: thu gọn đơn thức $A=\left(\tfrac23x^2y^2\right)\left(\tfrac{-5}{4}xy^3\right)$;
    đề B010-12 câu 1: khai triển $x^2-9$ theo hằng đẳng thức ⇒ **khác đề, GIỮ**.
  - THCS Ngọc Thụy — trong kho chỉ có *nội dung ôn tập giữa kì I 2026–2027* (câu đầu: thu gọn $A=-8x^3y^2xy$); đề B010-07 Bài 1a: $4x-2=5x+1$ ⇒ **khác, GIỮ**.
  - Thanh Trì — kho có THCS Vạn Phúc (huyện Thanh Trì) giữa kì; B010-01 là đề của Phòng GD&ĐT, cuối kì ⇒ khác đơn vị, khác kì, **GIỮ**.
- **Nhân chứng 2 (nội dung, bài `mo_ho`):** đề khớp cao nhất theo máy đều là đề giữa kì / đề cương khác trường —
  Hát Môn & Chương Mỹ ↔ GKI THCS Nguyễn Chơn (0,2; câu đầu kho "biểu thức nào không phải đơn thức?" ≠ "phân tích $4x^2-1$" / "có bao nhiêu đơn thức…" khác bộ biểu thức);
  Lý Sơn ↔ đề cương GKI Nam Từ Liêm 130 câu (0,35; câu đầu kho "phân tích $x^3-y^3$" ≠ Lý Sơn Bài 1 "$12x^2+6x$"). Khớp lẻ vài câu phân tích nhân tử phổ thông, không phải cùng đề ⇒ **GIỮ cả 3**.

## Trùng MỘT BÀI giữa các đề trong batch (giữ đề, để `ghi.mjs` tự trỏ câu cũ nếu trùng nguyên văn)

- B010-17 Việt Hưng Bài 4.2 ≈ B010-11 Chương Mỹ Câu 3 (cùng hình $ABC$ vuông tại $B$, $M$ trung điểm $AC$, $ME$, $MD$, $F$; ý c hỏi $\tfrac{IK}{FC}$ vs chứng minh $FC=6IK$).
- B010-08 Phúc Đồng 2025 (801) Bài 4, Bài 5 ≈ B010-13 Phúc Đồng 2024 (801) Bài 3, Bài 4 (cùng bài 120 km, cùng hình tam giác cân $AHCD$, $ABHD$).
- B010-15 Lý Sơn Bài 4 a–b ≈ B010-07 Ngọc Thụy Bài 4.2 a–b (ý c khác).
