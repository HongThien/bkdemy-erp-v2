# spec-su-kien.md — Hệ thống tổ chức SỰ KIỆN (Trung thu 26/09/2026 + các sự kiện sau)

> Trạng thái: **CHỐT YÊU CẦU (Thùy 25/09)** · CHƯA code · chạy thật **26/09**.
> Dữ liệu **KHÔNG gắn môn** (vận hành, không phải học tập — §1.6). Tiền tệ **riêng của sự kiện**, KHÔNG đụng ví `qlht_xu_ledger`.
> Tên gọi quốc tế: **event check-in + virtual queue** (kiểu hàng đợi ảo Disney FastPass / waitlist nhà hàng).

---

## 1. Quyết định CEO (25/09)

| # | Chủ đề | Chốt |
|---|---|---|
| 1 | Hạn | Chạy thật **ngày mai 26/09**, làm bản đầy đủ |
| 2 | Quy mô | BK >300 HS, dự **~100–160** + HS ngoài |
| 3 | Tổng quát | Các sự kiện sau vận hành **y như nhau** → cấu hình theo sự kiện, không code cứng Trung thu |
| 4 | Check-in | **Nhân sự trực bấm** trên laptop (HS không tự thao tác) |
| 5 | Tìm HS BK | Theo **tên** (lấy từ `hoc_sinh` DB BK) |
| 6 | HS ngoài BK | Chỉ ghi **tên**; hệ **cấp số thứ tự** (#37) để phân biệt trùng tên — quản trò hô "Lan số 37" |
| 7 | Check-in bắt buộc? | **Không.** HS ngoài không check-in được nhưng **vẫn đăng ký game** |
| 8 | Xu | **Tiền tệ riêng của sự kiện** (không vào ví BK). HS ngoài cũng nhận xu như thường |
| 9 | Vòng quay | Chỉ HS BK **đã check-in**, **1 lần/sự kiện**: 15 / 20 / 25 xu, tỉ lệ **25 / 50 / 25 %** |
| 10 | Màn quay | Check-in trên **laptop**, vòng quay hiện trên **TV riêng** đặt gần đó |
| 11 | Phí chơi | Đăng ký game **miễn phí** |
| 12 | Phòng | Nhiều phòng chơi, nhưng **chỉ 1 phòng dùng hàng đợi** (phòng iPad). Vẫn thiết kế theo `phong` để sau thêm được |
| 13 | 1 lần vào phòng | = **3 ván liền**; iPad **cộng tổng xu 3 ván** (Nhất 5 · Nhì 3 · còn lại 2 mỗi ván) |
| 14 | Xếp hàng | Mỗi HS chỉ **1 chỗ chờ** tại 1 thời điểm; chơi xong **đăng ký lại được**, không giới hạn |
| 15 | Mỗi lượt | Tối đa **6 HS** mọi game; quản trò chủ động bắt đầu khi <6 |
| 16 | Bỏ qua | HS vắng lần 1 → **giữ vị trí**, được gọi lại thêm 1 lần; vắng lần 2 → **loại khỏi hàng** (đăng ký lại từ đầu nếu muốn) |
| 17 | Gọi HS | **Quản trò hô** là chính; **có màn TV thông báo** hàng chờ |
| 18 | Kết quả | Lấy **từ iPad** tự động (fallback: quản trò nhập tay/trả thẳng) |
| 19 | Quản trò | **Nhân sự ERP** (đăng nhập tài khoản ERP) |
| 20 | Thiết bị | Check-in: **laptop** · Quản trò: **điện thoại** · Wifi ổn |
| 21 | Tiêu xu | **Đổi quà tại quầy** → cần màn trừ xu + số dư từng HS |

---

## 2. Luồng vận hành

```
[Cửa] Laptop check-in (nhân sự)
  ├─ HS BK: gõ tên → chọn → CHECK-IN ──► bấm QUAY ──► TV vòng quay chạy → +15/20/25 xu
  ├─ HS ngoài: gõ tên → cấp số #N (không check-in, không quay)
  └─ ĐĂNG KÝ GAME (cả 2 loại) ──► vào hàng chờ phòng iPad
                                        │ realtime
[Phòng iPad] Điện thoại quản trò        ▼
  Danh sách chờ (theo thứ tự) → hô tên → ✔ Có mặt  /  ✖ Bỏ qua (lần 2 = loại)
  Đủ 6 (hoặc quản trò quyết) → BẮT ĐẦU → HS được gán slot iPad 1..6
  3 ván → iPad gửi tổng xu từng slot → KẾT THÚC LƯỢT → xu vào ví sự kiện, HS rảnh, đăng ký lại được
                                        │ realtime
[TV hàng chờ] "Đang chơi: … · Mời vào: … · Đang chờ: N bạn"   (+ đồng thời số liệu hiện ở laptop check-in)

[Quầy quà] Nhân sự tìm HS (tên / số) → xem số dư → trừ xu đổi quà
```

---

## 3. Thiết kế DB (đề xuất CTO — R2, tự quyết)

Tiền tố `sk_`. Mọi phép tính ở Postgres (§2.0), client chỉ gọi `fn_sk_*`.

| Bảng | Vai trò | Ghi chú |
|---|---|---|
| `sk_su_kien` | 1 dòng / sự kiện | `ten`, `ngay`, `cau_hinh jsonb` = `{vong_quay:[{xu:15,ti_le:25},{xu:20,ti_le:50},{xu:25,ti_le:25}], toi_da_luot:6, so_van:3}` |
| `sk_phong` | Phòng chơi | `su_kien_id`, `ten`, `hang_doi bool`, `ma_hub` (room code iPad hub), `thu_tu` |
| `sk_nguoi_choi` | Người tham gia | `su_kien_id`, `so` (số thứ tự trong sự kiện), `hoc_sinh_id` (**NULL = HS ngoài** — "không áp dụng", đúng §1.5), `ten`. Unique `(su_kien_id, so)`, `(su_kien_id, hoc_sinh_id)` |
| `sk_checkin` | Dòng tồn tại = đã check-in | PK `nguoi_choi_id`, `at`, `by`. Chỉ HS BK |
| `sk_xu` | **Sổ cái xu sự kiện** (append-only) | `so_xu` (±), `nguon` ∈ `vong_quay · game · doi_qua · dieu_chinh`, `luot_id`, `ghi_chu`, `at`, `by`. **Unique partial** `(nguoi_choi_id) where nguon='vong_quay'` ⇒ DB chặn quay 2 lần; `(luot_id, nguoi_choi_id) where nguon='game'` ⇒ không cộng đúp. Dòng vòng quay = chính kết quả quay (không cần bảng riêng) |
| `sk_dang_ky` | 1 lần xếp hàng | `phong_id`, `nguoi_choi_id`, `trang_thai` ∈ `cho · co_mat · dang_choi · xong · bo · huy`, `so_lan_bo_qua`, `luot_id`, `slot`. Unique partial `(nguoi_choi_id) where trang_thai in ('cho','co_mat','dang_choi')` ⇒ **1 chỗ chờ/HS ở mức DB**. Thứ tự hàng = `created_at` (bỏ qua lần 1 không đổi vị trí) |
| `sk_dang_ky_log` | Vết đổi trạng thái | **Trigger** tự ghi (actor, ts, cũ→mới) — §4, app không tự log |
| `sk_luot` | 1 lượt chơi của phòng | `phong_id`, `game`, `bat_dau_at`, `ket_thuc_at`. 1 phòng chỉ 1 lượt đang chạy |

RLS: `select` cho `authenticated using (la_thanh_vien())`; ghi **chỉ qua RPC**. Thêm các bảng `sk_*` vào `supabase_realtime`.

### RPC

| Hàm | Việc |
|---|---|
| `fn_sk_tim_hs(su_kien, q)` | Tìm `hoc_sinh` đang học theo tên (`fn_bo_dau`, không có unaccent) + lớp + cờ đã check-in/đã quay/đang chờ |
| `fn_sk_checkin(su_kien, hoc_sinh_id)` | Tạo `sk_nguoi_choi` (nếu chưa) + `sk_checkin`, idempotent |
| `fn_sk_them_khach(su_kien, ten)` | HS ngoài → cấp `so` (khoá dòng `sk_su_kien` khi cấp số) |
| `fn_sk_quay(nguoi_choi)` | **Random có trọng số ở Postgres** theo `cau_hinh`, ghi `sk_xu` — client/TV chỉ diễn hoạt ảnh dừng đúng ô |
| `fn_sk_dang_ky(phong, nguoi_choi)` | Vào hàng; đang có chỗ khác ⇒ báo lỗi rõ |
| `fn_sk_danh_dau(dang_ky, 'co_mat'\|'bo_qua'\|'tra_ve'\|'huy')` | `co_mat` chặn khi đã đủ 6; `bo_qua` lần 1 +1, lần 2 → `bo` |
| `fn_sk_bat_dau(phong, game)` | Tạo `sk_luot`, gán slot 1..n cho HS `co_mat` → `dang_choi` |
| `fn_sk_ket_thuc(luot, ket_qua jsonb [{slot, xu}])` | Ghi `sk_xu` nguồn `game` + `dang_ky → xong`, 1 transaction |
| `fn_sk_doi_qua(nguoi_choi, xu, ghi_chu)` | Khoá dòng, kiểm số dư ≥ xu, ghi âm |
| `fn_sk_tong_quan(su_kien)` | Theo phòng: đang chơi / sắp vào (co_mat) / đang chờ (thứ tự) + tổng check-in, tổng xu phát ra |
| `fn_sk_so_du(su_kien, q)` | Tìm theo tên/số → số dư + lịch sử xu (quầy quà) |

---

## 4. Màn hình (staff app ERP, đăng nhập nhân sự)

| Màn | Thiết bị | Nội dung |
|---|---|---|
| **Check-in** | Laptop | Ô tìm tên → Check-in · Quay · Đăng ký game; tab "HS ngoài" (tên → số #N → Đăng ký game); khung tóm tắt hàng chờ realtime (đang chơi / đang chờ) |
| **TV Vòng quay** | TV gần bàn check-in | Toàn màn hình; nghe `sk_xu` nguồn `vong_quay` mới → quay dừng đúng ô, hiện tên + số xu |
| **Quản trò** | Điện thoại (mobile-first) | Danh sách chờ; nút lớn ✔ Có mặt / ✖ Bỏ qua (hiện "đã bỏ qua 1 lần"); khung "Lượt kế" ≤6; Bắt đầu; Kết thúc lượt (kết quả tự điền từ iPad, sửa được) |
| **TV Hàng chờ** | TV phòng/hành lang | Đang chơi · Mời vào · N bạn đang chờ + 10 tên kế tiếp |
| **Quầy quà** | Laptop/điện thoại | Tìm tên/số → số dư → trừ xu |
| **Cài đặt sự kiện** | Admin | Tạo sự kiện, phòng, tỉ lệ vòng quay (mặc định seed sẵn cho Trung thu) |

Mutation trong cùng màn: **vá tại chỗ**, không reload trắng (§2); realtime chỉ refetch nền.

---

## 5. Nối iPad hub (`games-site/`) — ⚠️ CÒN PHẢI DÒ

Hub hiện: TV chọn game → iPad theo `slot` trong room (`bk-hub:<room>`, Supabase Realtime broadcast), mỗi game tự tính thứ hạng + xu
(Nhất 5 · Nhì 3 · còn lại 2). Việc cần làm:
1. `fn_sk_bat_dau` trả `[{slot, ten, so}]` → broadcast xuống hub để **iPad hiện tên HS** đúng slot.
2. Hub cộng xu **3 ván** theo slot → broadcast `ket_qua` → màn Quản trò nhận và điền sẵn vào form **Kết thúc lượt**.
3. **Ghi DB do điện thoại quản trò** (đã đăng nhập) gọi `fn_sk_ket_thuc` — iPad/anon **không ghi DB** (không mở RPC cho anon).
4. Fallback: iPad lỗi ⇒ quản trò nhập tay xu từng slot, hoặc trả xu ngoài hệ.

**Chưa biết (dò khi code):** message shape hiện tại các game gửi kết quả; hub có chỗ nhận tên người chơi chưa; cộng dồn 3 ván đặt ở hub hay ở màn quản trò.

---

## 6. Thứ tự build (ưu tiên nếu thiếu giờ)

1. Migration `sk_*` + RPC + seed sự kiện Trung thu + phòng iPad → `npm run migrate` → `npm run schema`.
2. Màn **Check-in** + **Quản trò** + **TV hàng chờ** (lõi hàng đợi — thiếu là sự kiện kẹt).
3. **TV vòng quay** + **Quầy quà**.
4. Nối iPad hub (tự điền kết quả). Chưa kịp ⇒ quản trò nhập tay xu, hệ vẫn chạy đủ.
5. Test tải giả: 150 người chơi, 1 phòng, 2 điện thoại quản trò mở cùng lúc (chống bấm đúp/đua).
