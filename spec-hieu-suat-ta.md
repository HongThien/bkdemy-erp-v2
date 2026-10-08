# Hiệu suất Trợ giảng — màn "Chất lượng vận hành" (CEO chốt 08/10/2026)

> Thay màn Chất lượng vận hành cũ (CL − (100 − TĐ), leader chấm chất lượng tay, toán ở JS — đã outdate).
> Làm **Trợ giảng** trước; GV / OPS dùng lại khung này sau.
> Code: mig `202610081343_hieu_suat_ta.sql` + `202610081414_hieu_suat_ta_theo_gay.sql` · `src/lib/hieusuat_ta.ts` · `src/screens/dashboard/HieuSuatTAScreen.tsx` (lá `db_chatluong`).

## 1. Công thức

| Đầu việc | Tỉ trọng | Đơn vị đo |
|---|---|---|
| Chấm BTVN | 50% | 1 task / buổi |
| Chấm ET | 15% | 1 task / buổi (bỏ buổi ET online) |
| Bổ trợ (bù · yếu · đuổi) | 35% | chỉ tiêu **8 giờ / tháng** — quản lý chấm tay (xem §3) |

- **Điểm 1 task CHỈ dựa vào HỆ GẬY** (CEO 08/10, sửa lần 2 — không tự đo lại): **không có gậy = 100**.
  - Gậy **"Chậm deadline"** đã vào sổ ⇒ trừ **tiến độ** theo số phút trễ mà gậy đã ghi (`gay_de_xuat.tre_phut`):
    ≤ 6h −10 · 6–12h −20 · 12–24h −30 · > 24h −40 (1 task chỉ trừ tiến độ 1 lần; gậy không ghi phút ⇒ −10 + cờ).
  - Gậy **loại khác** đã vào sổ ⇒ trừ **chất lượng** −15 mỗi gậy. Sàn 0.
  - Gậy còn **chờ chốt** hoặc **đã thu hồi** ⇒ không trừ (task hiện cờ "có đề xuất gậy chờ chốt").
  - Giờ trễ tự đo từ giờ đóng vẫn HIỆN để tham khảo, KHÔNG vào điểm.
- **Gậy ↔ task** khớp bằng khoá `vh:<buổi>|<btvn|et>|<nhân sự>` (= `ref_key` của `fn_viec_buoi_thuong`). Màn chi tiết có khối
  **"Gậy của tháng"** liệt kê MỌI gậy của TA (vào sổ / thu hồi / chờ chốt), gắn task nào, có vào điểm không và vì sao
  (không phải lớp TA chính · không thuộc BTVN/ET · gậy bổ trợ · ngoài task) — đối chiếu 1-1 với màn Gậy, không gậy nào rơi mất.
- **Hiệu suất đầu việc** = trung bình các task được tính. **Tổng** = trung bình có trọng số các đầu việc đang có số
  (mỗi đầu việc lấy số ĐÃ CHỐT nếu có, không thì số hệ thống; bổ trợ chỉ có khi đã chốt) — thiếu đầu việc thì ghi "tạm".

## 2. Task nào được tính

- **Chỉ lớp được phân công TRỰC TIẾP = TA chính** (`phan_cong_lop.la_chinh`) — khớp cách hệ Gậy chọn người chịu.
- Task chỉ tồn tại khi **buổi có câu của phase đó trên hệ thống** (BTVN / ET) — đo 09/2026: 215/216 task BTVN đã đóng có câu,
  33/36 task "ảo" không có câu. Buổi không có câu ⇒ vẫn hiện từng dòng cho từng TA nhưng "không tính";
  **NGOẠI LỆ: đã có gậy vào sổ ⇒ task có thật (người đã xác nhận) ⇒ vẫn tính.**
- Không tính: TA vắng buổi đó (`ta_vang`) · chưa xác định được hạn. Không xếp hạng người có cờ `an_xep_hang` (vd CEO).

## 3. Bổ trợ

- Hệ thống **chưa đo được giờ chính xác** (giờ nhập tay sai: 04:30–05:30, 19:30–19:30…) ⇒ **không đề xuất điểm**.
- Hiện đủ từng ca: ngày · giờ · phút · loại · HS có mặt / vắng · lớp gốc (bù) · giờ bài đầu tiên trên hệ thống · giờ đánh giá xong · gậy.
- Giờ tạm tính = **hợp các khoảng giờ** có HS (ca chung nhiều em chỉ tính 1 lần), chỉ để tham khảo cạnh chỉ tiêu 8h.
- Cờ: không HS có mặt · thiếu giờ · kết thúc ≤ bắt đầu · giờ ngoài 7h–22h30 · chồng giờ với ca khác · chưa đánh giá.
- Chưa có mốc "mở ca trên iPad" ⇒ chưa đo được "mở ca muộn" (cần build nút Bắt đầu ca — việc sau).

## 4. Tỉ lệ hoàn thành dữ liệu (soi bất thường)

Đếm số dòng thì luôn đủ (muốn đóng phải có trạng thái cho mọi HS) ⇒ soi **nội dung**:
- **BTVN:** số nộp đúng hạn / muộn / không làm / phép; cờ khi ≥ 40% muộn + không làm; **nhân chứng độc lập** = tỉ lệ đúng hạn
  của CHÍNH các em đó ở lớp khác (TA khác chấm, ±90 ngày) — lệch > 30 điểm ⇒ cờ.
- **ET:** ô đã chấm / (HS có mặt × câu); cờ còn ô chưa chấm · HS vắng mà có điểm · đóng mà không có dữ liệu.
- Mở lại task ⇒ cờ + số lần mở lại + giờ đóng cuối.

## 5. Chốt & ghi thêm

- Mọi số: **hệ thống đề xuất → quản lý chốt** theo **TA × tháng × đầu việc** (BTVN · ET · Bổ trợ · Tổng).
  Lưu luôn số hệ thống lúc chốt (`hsta_chot.diem_he_thong`) để sau đo độ chính xác hệ thống; mọi lần chốt/sửa/bỏ chốt có nhật ký (`hsta_chot_log`).
- **Ghi thêm** (`hsta_ghi_them`): việc ngoài hệ thống — đầu việc · nội dung · số giờ (tuỳ chọn). Là căn cứ để chốt, KHÔNG tự cộng/trừ điểm
  (giờ ghi thêm của bổ trợ được hiện cộng bên cạnh giờ hệ thống).
- Quyền ghi: `co_quyen_ghi('db_chatluong')`; quyền xem: `co_chuc_nang('db_chatluong')`.

## 6. Giới hạn đã biết

- Gậy tự động đo trễ theo giờ đóng HIỆN TẠI (lần đóng cuối) ⇒ task bị mở lại rồi đóng lại có thể nhận gậy trễ dù lần đầu đúng hạn
  (vd Nguyễn Hà Giang 7S1 20/09: lần đầu đúng hạn, gậy ghi trễ 47h) — người chốt gậy xem cờ "Đã mở lại" để quyết.
- Phân công lớp (`phan_cong_lop`) không có lịch sử ⇒ TA đổi lớp giữa chừng thì task cũ của lớp tính cho TA chính hiện tại.
- Tham số (tỉ trọng, thang trễ, 15/gậy, 8h) nằm ở 4 hàm `_hsta_*` — đổi số = 1 migration sửa đúng hàm đó.
