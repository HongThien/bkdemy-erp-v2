---
description: Chấm hàng đợi BTVN mà trợ giảng đã bấm "Gửi chấm" trên app — lấy ảnh, chấm Đ/C/S từng câu, ghi GỢI Ý lên ERP chờ TA xác nhận
argument-hint: [--env <file .env có quyền ghi>]
---

# /cham-btvn-hang-doi — Máy chấm BTVN (chế độ hàng đợi, CEO chọn 07/11/2026)

TA trên app trợ giảng: Chấm BTVN → 🤖 Chấm tự động → lớp → buổi → học sinh → thêm ảnh → **Gửi chấm**.
Lệnh này lấy các bài đang chờ, chấm, ghi **gợi ý** (bảng nháp `btvn_ai_*`). Chỉ khi TA bấm **Xác nhận** trên app
mới ghi vào `gami_grades`. Không ghi thẳng điểm, không đụng bài TA đã chấm tay.

`$ARGUMENTS` truyền tiếp cho 2 script (vd `--env C:/Users/Admin/Desktop/BK_V2/bkdemy-erp-v2/.env`). File env cần:
`DATABASE_URL` (role ghi), `VITE_SUPABASE_URL`, `SUPABASE_SERVICE_ROLE`.

## Bước 1 — Lấy hàng đợi
```
node scripts/btvn-ai/hang-doi.mjs $ARGUMENTS
```
Mỗi bài thành 1 thư mục trong `cham_btvn_ai/` gồm `de.json` (lớp, khối, học sinh, danh sách câu với `problem_id`,
số câu `so`, đề/đáp án/lời giải kho nếu có, danh sách ảnh `{id, file}`) và các file ảnh. Hàng đợi rỗng ⇒ báo
"không có bài chờ" rồi dừng.

## Bước 2 — Chấm từng bài
Nhiều bài ⇒ giao mỗi bài 1 subagent (song song, tối đa 10), mỗi subagent đọc đúng thư mục của bài đó.
Mỗi bài:
1. Đọc `spec-quy-tac-cham.md` (quy tắc chấm v0.1) — đặc biệt §A1–A9 và mục khối của bài.
2. Đọc `de.json`, xem TỪNG ảnh (Read file ảnh). Ảnh có thể xoay ngang/lộn ngược, lộn thứ tự: tự xoay để đọc,
   xác định thứ tự trang theo số câu / số trang in trên phiếu.
3. Tự giải từng câu trước, đối chiếu đáp án kho nếu có (đáp án kho có thể sai ⇒ `chac: false`). Phóng to
   (crop) chỗ chữ nhỏ trước khi kết luận.
4. Ghi `ket_qua.json` trong thư mục bài:
   ```json
   { "thu_tu_anh": ["<id ảnh trang 1>", "<id ảnh trang 2>", "..."],
     "nhan_xet_chung": "1 dòng nhận xét chung gửi phụ huynh, không chi tiết từng câu, không ghi điểm",
     "xoay_anh": { "<id ảnh chụp ngang>": 90 },
     "cau": [ { "problem_id": "<uuid trong de.json>", "result": "correct|partial|wrong",
                "chac": true, "loai_loi": "", "nhan_xet": "" } ] }
   ```
   - `result`: correct = Đ, partial = C, wrong = S (định nghĩa ở spec §A1).
   - Câu **không có trên ảnh** ⇒ KHÔNG đưa vào `cau` (thiếu = không dòng, không ghi S).
   - `chac: false` khi không chắc ≥ 90% (chữ số nhập nhằng quyết định kết quả, khoanh 2 đáp án, ảnh cắt…) ⇒ app tô vàng.
   - `nhan_xet` câu C/S: 1 dòng "<lỗi> vì: <lý do>. Đúng: <đáp án>". Câu Đ để trống.
   - `loai_loi`: ket_qua_sai · sai_phuong_phap · dong_giua_sai · sai_mot_buoc · thieu_ly_do · thieu_ket_luan ·
     chua_phan_tich_het · sai_dau · nhan_ky_hieu · don_vi · dieu_kien · trinh_bay — chỉ gán khi chắc, không thì "".
   - `thu_tu_anh` phải chứa ĐỦ mọi id ảnh trong `de.json` (thiếu thì script giữ thứ tự cũ).
   - `xoay_anh` (tuỳ chọn): `{ "<id ảnh>": 90 }` — góc TUYỆT ĐỐI (0/90/180/270, chiều kim đồng hồ) để ẢNH GỐC đứng
     đúng chiều khi hiển thị cho TA/phụ huynh. Chỉ ghi ảnh đang xoay ngang/ngược; `de.json` có `xoay_hien_tai` của từng ảnh
     (TA có thể đã xoay tay) — đúng rồi thì bỏ qua ảnh đó.

## Bước 3 — Ghi gợi ý lên ERP
```
node scripts/btvn-ai/ghi.mjs $ARGUMENTS --thu     # chạy thử, kiểm định dạng
node scripts/btvn-ai/ghi.mjs $ARGUMENTS           # ghi thật
```
Script chỉ ghi bài có `ket_qua.json` mà chưa có `da_ghi.json`, mỗi bài 1 transaction, mang danh nghĩa TA đã gửi.

## Bước 4 — Báo cáo
Mỗi bài 1 dòng: lớp · học sinh · số câu Đ/C/S · số câu không chắc. Nhắc TA vào app xác nhận.
Không xoá thư mục `cham_btvn_ai/` (luật xoá CLAUDE.md) — dọn khi CEO đồng ý.

## Chạy định kỳ
Muốn máy tự chấm theo giờ: `/loop 30m /cham-btvn-hang-doi --env <file>` (máy phải bật và mở Claude Code).
