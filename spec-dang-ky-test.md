# Spec — Đăng ký lịch test (Thùy chốt 15/10/2026)

## 1. Đích
- **Lộc** dựng lịch test **cố định theo tuần** (khung, vd T7 08:00–11:00). Không giới hạn số chỗ, áp cho mọi môn.
- **PH** vào web `bkacademy.edu.vn/dang-ky-test` (gửi link qua Zalo được) → chọn **lớp** (ở trường), **trường**,
  **tích môn**; **mỗi môn 1 ca riêng**: chọn buổi + **giờ bắt đầu** (bước 15') → hệ báo
  *"Bài test dự kiến N phút"* và *"Dự kiến xong lúc HH:MM — bố mẹ đón con lúc này"*. Chỉ gõ tay 2 ô: tên HS, SĐT PH.
  Trường không có trong danh sách ⇒ "Trường khác" và gõ.
- Gửi xong PH thấy: *"Trung tâm đã nhận thông tin đăng kí của con và sẽ báo lại với bố mẹ trong thời gian sớm nhất."*
  Đổi lịch: PH nhắn Zalo, **Lộc sửa** trong ERP.
- Thông tin vào phễu **Tuyển sinh** (L5) + **hòm thư ERP** báo người nhận (Lộc).
- PH báo thẳng Lộc ⇒ **Lộc nhập thay** bằng cùng một form (cùng hàm ghi) ⇒ đầu vào chuẩn hoá.
- Môn hiện theo lớp = môn **đang có lớp học** ở khối đó (suy từ `lop`), và phải đã khai **thời lượng bài test**.

## 2. Thiết kế (mig `202610151355_dang_ky_lich_test.sql`)
| Bảng | Vai trò |
|---|---|
| `lich_test_khung` | khung tuần (thứ ISO 1–7, giờ tròn 15'). Bỏ khung = `xoa_at` (hẹn cũ vẫn trỏ được) |
| `lich_test_dong` | đóng 1 buổi cụ thể (khung × ngày); mở lại = xoá dòng |
| `test_dau_vao_thoi_luong` | thời lượng bài test (lớp 1–12 × môn). **Không seed** — không có dòng = môn chưa mở trên web |
| `truong_hoc_dm` | danh mục trường (`cap` rỗng = liên cấp, hiện ở mọi lớp). Seed nháp 41 trường gom từ `hoc_sinh.truong_hoc` |
| `dang_ky_test` | **hẹn**: 1 dòng = 1 môn của 1 lần đăng ký (`lan_dk_id`). `gio_xong` generated. Tối đa 1 hẹn hiệu lực / ứng viên |
| `tuyen_sinh_nhan_bao` | ai nhận hòm thư khi có đăng ký (seed: Lộc) |
| `dang_ky_test_web_log` | chống spam (≤10 lần/giờ/IP, ≤5 lần/ngày/SĐT) |
| `lich_test_log` | vết mọi đổi (trigger) |

- **Hẹn ≠ `ca_test`.** `ca_test` vẫn sinh lúc em **có mặt** (Ops điểm danh, L5→L6). Tạo ca lúc đăng ký = "insert trước, điền sau" (§1.5).
  *Đã đến* = có `ca_test` của (ung_vien, môn); *lỡ hẹn* = giờ xong đã qua mà chưa đến — đều **suy**, không lưu.
  Điểm danh test chọn ứng viên L5 có hẹn ⇒ tự điền thời lượng (+ giờ nếu hẹn đúng hôm nay).
- Mỗi môn = 1 `ung_vien` (§1.6). Trùng SĐT + tên + môn với lead đang chạy ⇒ dùng lại lead, huỷ hẹn cũ ("đăng ký lại").
  SĐT trùng PH cũ ⇒ chỉ **nêu trong hòm thư**, không tự nối `phu_huynh_id`.
- `ung_vien.nguon` = `web` (PH tự đăng ký) hoặc nguồn Lộc chọn; kênh nhập thay (Zalo/ĐT/Trực tiếp/Khác) ở `dang_ky_test.kenh`.
- Hòm thư dùng loại `viec` sẵn có, liên kết màn `tuyensinh`.

### Phòng (Thùy 15/10, mig `202610151730_lich_test_gan_phong.sql`)
- Mỗi khung test = **1 phòng** (`lich_test_khung.phong_id`). Cần thêm phòng ⇒ tạo thêm khung cùng giờ ở phòng khác.
- **Giữ trọn khung** trên Quản lý phòng học (Lịch phòng / Tổng quan tuần): nguồn thứ 4 "Tuyển sinh · Test đầu vào" (`fn_phong_lich_test_ngay`), kèm số hẹn. Đóng buổi test ⇒ phòng tự trả lại.
- **Không giới hạn** số em theo sức chứa phòng.
- Dựng khung trùng **TKB** hoặc **khung test khác** cùng phòng ⇒ **DB chặn** (trigger `_ts_khung_chan_trung`). Buổi lẻ (bù/bổ trợ/phát sinh) 60 ngày tới ⇒ chỉ cảnh báo (`fn_ts_khung_trung_phong`).
- Phát sinh / xếp lịch bổ trợ đặt trùng khung test ⇒ `kiemTraTrungPhong` tự cảnh báo (vì khung đã nằm trong lịch phòng).
- Chưa chặn chiều ngược: sửa TKB sang phòng/giờ đang là khung test thì không bị chặn (chỉ thấy chồng trên Lịch phòng).

## 3. Hàm
- `fn_ts_dk_form(so_ngay, som_phut)` — dữ liệu form: lớp→môn→thời lượng, trường, buổi mở kèm **danh sách giờ bắt đầu + giờ xong theo từng thời lượng** (tính ở DB).
- `fn_ts_dang_ky_test_web(p, ip)` — chỉ `service_role` (Edge Function). Web: 14 ngày tới, giờ bắt đầu cách bây giờ ≥ 60'.
- `fn_ts_dang_ky_test_nhap(p, kenh)` — Lộc nhập thay (60 ngày, không cách giờ).
- Cả hai qua `_ts_dang_ky_test` (kiểm tên/SĐT/lớp/trường/môn mở/slot hợp lệ/không chồng giờ giữa các môn).
- `fn_ts_lich_test_tong_quan` (màn Lộc), `fn_ts_hen_doi_lich`, `fn_ts_hen_huy`, `fn_ts_hen_cua_ung_vien`.

## 4. Đường web → ERP
Web (repo `bkdemy-web`) **không giữ key ERP**. Trình duyệt gọi Edge Function `dang-ky-test` trên project ERP
(`supabase/functions/dang-ky-test/index.ts`): GET = dữ liệu form (không có dữ liệu cá nhân), POST = ghi.
Ô bẫy bot `website`. URL function đặt ở biến `NEXT_PUBLIC_DANG_KY_TEST_URL` của web.
*Lệch spec web cũ (`SPEC-tuyen-sinh-khoi-7.md` §1 "đọc qua view bkdemy-ph"): lịch đọc qua function thay vì sync sang bkdemy-ph —
lịch đổi liên tục, sync thêm độ trễ + 1 khâu hỏng được; function chỉ trả dữ liệu công khai.*

## 5. Màn ERP
Tuyển sinh → **📅 Lịch test**: *Lịch & hẹn* (cần xử lý: lỡ hẹn · trường PH tự gõ · lớp×môn chưa khai thời lượng;
lịch 14 ngày, đóng/mở buổi, đổi lịch, huỷ hẹn) · *Cài đặt* (khung tuần, thời lượng, danh mục trường) · nút **Đăng ký test thay PH**.

## 6. Việc để bật chạy thật
1. Deploy Edge Function `dang-ky-test` (tắt Verify JWT).
2. Đặt `NEXT_PUBLIC_DANG_KY_TEST_URL=https://<project ERP>.supabase.co/functions/v1/dang-ky-test` trên Vercel `bkdemy-web`, push web.
3. Lộc: dựng khung tuần + khai thời lượng các lớp×môn + soát danh mục trường.
4. Deploy ERP (thủ công).

## 7. Chưa làm
- UI sửa danh sách người nhận hòm thư (đang sửa bằng bảng `tuyen_sinh_nhan_bao`).
- Tin xác nhận Zalo/SMS cho PH (Thùy: chỉ màn thông báo).
