# Spec — Box "Ôn thi giữa kì I" (app HS) — Thùy chốt 16/10

Nguồn đề = **Kho đề thi** (`tai_lieu` loai='de_thi'; đề cương = `cau_hinh.deThi.kieu='de_cuong'`). HS chỉ thấy đề **đã duyệt** (`duyet_at`) đúng **khối** của em ở môn đang chọn.
Đã build (commit 9508442b): ô ở Home → 2 tab → màn đọc đề + đáp án (`OnThiHS.tsx`, `fn_hs_on_thi_ds/xem`, mig `202610161054`). Bản này là **chỉ xem**; phần dưới là chế độ THỰC HÀNH.

## 1. Logic đã chốt
| | Tab Đề cương → **Luyện tập** | Tab Đề thi trường → **Thi thử** |
|---|---|---|
| Cách làm | Từng câu, chấm ngay như tự luyện | 1 lượt có đồng hồ (thời gian của đề, vd 90 phút), nộp 1 lần |
| Nút đặc biệt | **"Bỏ qua, xem đáp án"** (vì không ghi mastery chính) | — |
| Mastery | **KHÔNG** ghi | **KHÔNG** ghi |
| Vào làm | bấm đề → vào luôn | bấm đề → popup *"Làm đề thi sẽ mất {N} phút. Điểm thi sẽ dùng xếp hạng và nhận quà. Em đã sẵn sàng chưa?"* [Sẵn sàng] [Để sau] |
| Tutorial | không | **có** (lần đầu, xem lại được): trắc nghiệm → điền số/đáp án; tự luận → **chụp ảnh nộp kèm** |
| Chấm | máy, tức thì | trắc nghiệm máy chấm ngay; **tự luận: TA/GV chấm từ ảnh**; điểm tổng + xếp hạng chỉ có **sau khi chấm xong tự luận** (trước đó HS thấy "đang chấm") |
| Xếp hạng | — | BXH riêng theo từng đề × khối. **Quà: bàn sau** (chưa nối gami) |

## 2. Phát hiện kỹ thuật (đã soi DB 16/10) — ràng buộc thiết kế
- `bai_test.loai='de_thi'` hiện **TÍNH MASTERY** (`fn_mastery_cells` map `de_thi` → kênh `et`; `_hs_dang_da_hoc` cũng đếm). ⇒ **KHÔNG tái dùng `de_thi`**. Thêm 2 loai mới `on_thi_luyen`, `thi_thu` (nới CHECK `bai_test.loai` — CLAUDE §2.1) và **không** đưa vào các hàm mastery.
- Bảo vệ bài thi (HS không tự nộp/đặt giờ) nằm ở `_trg_bai_lam_thi` / `_trg_bai_lam_cau_thi` / `et_nop` theo danh sách `('et','de_thi','bo_tro_test','retest')` ⇒ `thi_thu` **phải thêm vào các danh sách đó**; `on_thi_luyen` thì không (làm tự do như tự luyện).
- `fn_de_thi_mo` phát hành theo **lớp** (`lop_id not null`); Thi thử/Luyện là **cá nhân** ⇒ RPC mới sinh `bai_test` có `hoc_sinh_id` (như `tu_luyen`), `nguon_tai_lieu_id` = đề, snapshot câu bằng `_kho_snapshot_cau` (tái dùng thân `fn_de_thi_mo`, lấy từ bản đang chạy).
- Tự luận hiện **chưa có đường nhập bài làm trên app** (`fn_de_thi_mo` chỉ lấy trắc nghiệm/đúng-sai/trả lời ngắn; `tu_luan` chỉ in). Cần mới: bảng ảnh bài làm tự luận + storage + hàng đợi chấm.

## 3. Việc cần dựng (theo pha, mỗi pha tự đứng được)
1. **Pha 1 — Luyện tập đề cương:** loai `on_thi_luyen`; RPC `fn_hs_on_thi_luyen_sinh(p_de)` (cá nhân, trắc nghiệm/ĐS/TLN, bỏ câu tự luận hoặc hiện như câu xem-đáp-án); nút "Bỏ qua, xem đáp án" (ghi câu = bỏ qua, không verdict); chắc chắn mastery/`_hs_dang_da_hoc` không đếm.
2. **Pha 2 — Thi thử (trắc nghiệm):** loai `thi_thu`; popup xác nhận; đồng hồ phía server; nộp qua RPC; chấm máy; màn kết quả.
3. **Pha 3 — Tự luận bằng ảnh:** tutorial; bảng `thi_thu_anh` (bai_lam × câu/phần, `url`, `uploaded_at`) + bucket storage; màn chụp/nộp ảnh trước khi nộp bài; **chỉ tạo dòng khi có ảnh thật** (CLAUDE §1.5).
4. **Pha 4 — Chấm & xếp hạng:** hàng đợi chấm của TA **derive** (bài nộp có tự luận mà chưa có điểm câu tự luận — không bảng `tasks`); màn TA chấm từ ảnh; `fn_hs_on_thi_bxh(p_de)` tính ở Postgres, chỉ gồm bài đã chấm xong.

## 4. Bàn sau (không trộn vào logic)
Quà theo hạng · thang điểm từng phần tự luận · thời gian cho đề thiếu `thoiGianPhut` · giới hạn số lần thi thử/đề (đề xuất 1 lần tính hạng, các lần sau chỉ luyện) · đề cương có câu tự luận hiển thị thế nào ở Luyện tập.
