# SỔ THEO DÕI MÔ HÌNH 3D — mỗi mô hình ứng với câu nào của tài liệu nào

> **Để làm gì:** Thùy 10/10 — *"Đưa lên app thì cứ từ từ. Khớp sau. Lưu vết để sau này còn track."* Sổ này là chỗ DUY NHẤT ghi mô hình nào dựng từ câu nào,
> để khi câu ấy vào kho và lên app HS thì khớp lại được (spec `spec-day-hinh-3d.md` A5, B7).
> **Luật ghi:** dựng xong một mô hình là thêm / sửa một dòng ở đây, trong cùng commit. `id` đã phát hành thì không đổi, không dùng lại.
> Cột **Mã câu trong kho** để TRỐNG cho tới khi khớp thật (CLAUDE.md §1.5: thà bỏ trống còn hơn đánh sai) — khớp bằng nội dung đề, không khớp bằng số thứ tự.

Trang đang chạy: **https://toan.bkacademy.edu.vn/the-tich/** (deploy tay — cách làm ở spec §D.8).

## Tài liệu nguồn

| Mã nguồn | Tài liệu | File gốc (máy công ty) | Bản trích trong repo |
|---|---|---|---|
| NBV-12-18-F | Nguyễn Bảo Vương, Toán 12 mới — *12-18. Ứng dụng tích phân tính diện tích – thể tích* — **F. Bài tập nâng cao** (Dạng 2: thể tích, câu 43–56) | `E:\BK ACADEMY\Tài liệu tham khảo\K12\TOAN 12 NBV NEW FULL\TOAN 12 NBV NEW FULL\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\12-18. UNG DUNG TP TINH DIEN TICH-THE TICH\F. BAI TAP NANG CAO.docx` | `docs/hinh-3d/nguon-12-18F-dang2.md` + `docs/hinh-3d/hinh/` |

## Mô hình

| id | Nguồn · câu | Tên mô hình | Loại | Địa chỉ (sau `https://toan.bkacademy.edu.vn/the-tich/`) | Đáp số | Dựng | Thùy xem | Mã câu trong kho |
|---|---|---|---|---|---|---|---|---|
| 43 | NBV-12-18-F · câu 43 | Cốc nước nghiêng | thiết diện | `coc-nghieng.html` | 240 cm³ | 10/10/2026 | ok 10/10 (thêm luật A3) | |
| 48 | NBV-12-18-F · câu 48 | Miền vắt qua trục quay | tròn xoay | `tron-xoay.html?bai=48` | 836π/15 | 10/10/2026 | bản 7 bước: bắt bỏ cắt lát (A4); bản 5 bước trong trang chuyên đề: chưa xem | |
| 49 | NBV-12-18-F · câu 49 | Hai đường ở hai phía trục | tròn xoay | `tron-xoay.html?bai=49` | 21π/5 | 10/10/2026 | chưa xem | |

Thêm `&nhung=1` vào địa chỉ trang chuyên đề để nhúng cạnh bài giải (không có nút / bảng chọn bài).

## Chưa dựng (đã giải + có phiếu ở spec S.7)

| Nguồn · câu | Tên dự kiến | Loại | Đáp số | Ghi chú |
|---|---|---|---|---|
| NBV-12-18-F · câu 44 | Mái vòm sân vận động | thiết diện | (π − 2)·101 250 ≈ 115 586 m³ | file riêng |
| NBV-12-18-F · câu 45 | Mũ Noel | tròn xoay (quanh Oy) | 2500π/3 | thêm vào trang chuyên đề |
| NBV-12-18-F · câu 46 | Hình vuông + bốn nửa đường tròn | tròn xoay (quanh Oy, có lỗ) | 32π/3 + 4π² | thêm vào trang chuyên đề |
| NBV-12-18-F · câu 47 | Giao hai khối ¼ trụ | thiết diện | 2a³/3 | file riêng |
| NBV-12-18-F · câu 50 | Thùng rượu đường sinh elip | tròn xoay | 1416π/25 ≈ 177,9 lít | thêm vào trang chuyên đề |
| NBV-12-18-F · câu 52 | Thùng rượu đường sinh parabol | tròn xoay | M = 144 262 (nguồn ghi 144 270 — sai) | thêm vào trang chuyên đề |
| NBV-12-18-F · câu 53 | Trụ bị mặt phẳng nghiêng cắt | diện tích mặt cắt | (4π/3 + √3/2)R² (nguồn Cách 1 sai) | file riêng |

## Khi khớp với kho / app (chưa làm)

- Mỗi mục trong `tron-xoay-bai.js` có sẵn trường `maCau: null`. Khi câu đã ở trong kho: điền mã câu vào ĐÓ và vào cột cuối bảng trên, cùng một commit.
- Câu của tài liệu này chưa chắc đã ở trong kho K12. Trước khi điền phải mở câu trong kho, đối chiếu đề + đáp số (2 nhân chứng), không suy từ số thứ tự câu.
