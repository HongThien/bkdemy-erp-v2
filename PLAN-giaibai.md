# PLAN — Tool GIẢI BÀI kho chung (`giaibai.bkacademy.edu.vn`)

Thùy chốt 06/09/2026. Story gốc: "giống hệ giải bài kho chung của Qanda" — 6 bước: (1) hệ luôn liệt kê bài chưa có lời
giải → (2) TA bấm **Nhận giải**, bài rời danh sách chung về danh sách riêng → (3) soạn bằng tool soạn thảo có sẵn →
(4) Nộp → duyệt trên hệ → (5) duyệt xong mới thành lời giải chính thức trong kho → (6) ghi nhận ai / lúc nào / bao lâu.

## Quyết định (CEO)

| # | Việc | Chốt |
|---|---|---|
| Kiến trúc | Tách hẳn khỏi ERP, chỉ chung DB | **Modular monolith**: entry Vite thứ 8 cùng repo (`giaibai.html` → `dist-giaibai/`), Vercel project riêng, login = tài khoản nhân sự ERP. Không tách repo (mất tái dùng bộ soạn công thức). |
| 1 | Ai nhận | **Ai có môn cũng nhận được** (lọc người bằng "ai được biết tên miền"). Scope môn = luật `useMonScope`. |
| 2 | Giới hạn | **≤3 bài đang giữ / người · hạn 48h** (kể từ nhận / kể từ bị từ chối), quá hạn = tự trả về pool, có nút Trả bài. |
| 3 | Từ chối | Trả về **đúng người đó** kèm lý do, sửa + nộp lại; **từ chối lần 3 → về pool**, người đó không nhận lại bài đó. |
| 4 | Ai duyệt | **Team học thuật** (ghế `hoc_thuat` đúng môn) hoặc admin hệ thống. Không tự duyệt bài mình. |
| 5 | Pool | Bài **chưa có lời giải chi tiết** (`loi_giai` & `anh_dap_an` NULL; Hình: node chưa có cách giải có nội dung / biến thể trống). **Claude = 1 TA cao cấp**: bài đặt Claude cũng biến khỏi pool. |
| 6 | Tiền | **Ngoài hệ.** Tool chỉ xuất báo cáo tháng: số bài đã duyệt · độ khó (`muc_do` của dạng — Hình chưa có) · số ký tự · số công thức · thời gian giải. **Top 3** tháng. |
| 7 | Nền tảng | **Web máy bàn**, không app. |
| ⭐ | Kho | **Luồng này KHÔNG xoá/ghi đè gì trong kho.** Lời giải người soạn nằm ở dòng nhận bài cho tới khi DUYỆT mới ghi vào câu. |

## DB (mig `202609060122_giaibai_nhan_bai.sql`)

- KHÔNG đẻ khái niệm mới: 5 bảng hàng đợi Claude `{dai,khtn,hgt}_cau_hoi_yeu_cau_giai` · `hinh_{baitoan,bien_the}_yeu_cau_giai`
  **mở rộng** thành bảng NHẬN BÀI chung: `nguoi_giai` (NULL = Claude) · `trang_thai` (`cho_claude|da_xong|dang_giai|cho_duyet|
  can_sua|da_duyet|da_tra|qua_han|tu_choi_3`) · `han_at` · `nop_at` · `loi_giai_nhap/anh_nhap/dap_an_nhap` · `tu_choi_lan/ly_do_tu_choi`
  · `duyet_boi/duyet_at` · generated `so_ky_tu`, `so_cong_thuc`. Index unique `(bài) where xu_ly_at is null` sẵn có = mỗi bài 1 người giữ.
- View `v_giaibai_nhan` (mọi dòng nhận, 5 bảng, kèm nhãn bài + tên người + `dang_giu`/`qua_han`/`giay_giai`) · `v_giaibai_bai` (mọi bài
  chưa giải 4 nhánh + ai đang giữ).
- `fn_giaibai_*`: `pool` · `dem_pool` · `nhan` (atomic: đếm ≤3, chặn từ chối 3 lần, đóng dòng quá hạn, insert) · `tra` · `luu_nhap` ·
  `nop` · `cua_toi` · `cho_duyet` · `la_nguoi_duyet` · `duyet` (ghi vào kho `nguon_giai='nguoi'`, `giai_method='ta'`, `da_duyet=true`;
  Hình qua `fn_hinh_ghi_loi_giai`) · `tu_choi` · `bao_cao_tong` · `bao_cao_chi_tiet`.
- Vá fn cũ để không giẫm lên bài người đang giữ: `fn_kho_cau_chua_giai` + `v_hinh_chua_giai` trả thêm người giữ (ERP tab "Chưa có lời
  giải" hiện "🧑 X đang giải"); `fn_*_yeu_cau_giai_cho` (worker) chỉ lấy dòng Claude; `fn_kho_giai_nguoi_xong` / `fn_hinh_ghi_loi_giai`
  chặn khi có người giữ; `fn_*_dat_giai` đóng dòng quá hạn trước khi đặt.

## App (`src/AppGiaiBai.tsx`, `src/screens/giaibai/`, `src/lib/giaibai.ts`)

- **Kho bài**: khối (badge số bài) · nhánh · nhóm theo dạng/mô hình · thẻ bài (đề, ảnh, phương án/mệnh đề, đáp án gợi ý, độ khó) · **Nhận giải**.
- **Bài của tôi**: Đang giải (đếm ngược hạn, Soạn/Trả) · Chờ duyệt · Lịch sử. Soạn = `GiaiEditor` (MathTextarea + Ctrl+M + phím tắt +
  ⤢ SoanModal + chèn ảnh giữa bài + ảnh lời giải riêng + đáp án ngắn) · Lưu nháp (DB) · Nộp.
- **Duyệt** (chỉ học thuật/admin): đề trái · lời giải phải · Duyệt / Từ chối (lý do bắt buộc, hiện lần x/3).
- **Thống kê**: chọn tháng · top 3 · bảng tổng theo người · chi tiết từng bài · tải CSV.
- Lệnh: `npm run dev:giaibai` (port 5181; launch.json `giaibai-dev` 5218) · `npm run build:giaibai` → `dist-giaibai/`.

## Treo

- Deploy Vercel project riêng + domain `giaibai.bkacademy.edu.vn` (Thùy làm trên dashboard).
- Nhánh Hình chưa có độ khó → cột ĐK trống trong báo cáo; muốn có thì thêm `muc_do` cho `hinh_mo_hinh`/`hinh_baitoan` (migration riêng).
- Bundle 3.2 MB (kéo useStore/pdfjs qua MathTextarea/ImgInsertBar) — chấp nhận, máy bàn.
