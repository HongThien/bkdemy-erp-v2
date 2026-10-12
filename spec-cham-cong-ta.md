# Chấm công & lương Trợ giảng — bản nháp để CEO duyệt (12/10/2026)

> Mục tiêu CEO: **lần sau tính lương KHÔNG qua file sheet** — toàn bộ dữ liệu nằm trên ERP và CEO nắm được hết.
> Phạm vi v1: **TA part-time theo package chuẩn** (CEO chốt 12/10: "làm cho TA chuẩn trước"). Full-time / core team làm sau, logic giờ làm khác.
> Nguồn công thức & số liệu kiểm chuẩn: bảng chấm công tháng 9/2026 + 14 phiếu lương đã tính tay (tổng 26.836.984đ).

## 0. Quyết định đã chốt (CEO 12/10/2026)

| # | Quyết định | Hệ quả |
|---|---|---|
| 1 | **TA phải chấm công có mặt.** Đảo quyết định 07/09 ("mặc định có mặt, chỉ ghi vắng"). Có mặt là dữ liệu duy nhất ERP không tự biết, không chấm thì không kiểm được. Việc làm thì vẫn kiểm được từ ERP. | Thay `ta_vang` (cờ vắng) bằng bản ghi có mặt thật. |
| 2 | **Lương tính riêng, không nhân hiệu suất.** Làm sai bị đánh **gậy** và **phạt tiền** qua hệ Gậy đã có. | Net = Gross package + ngoài package − `gay_chot_thang.tien_phat`. Hiệu suất chỉ hiển thị, không vào lương. |
| 3 | **Hai kênh độc lập để đối chiếu; ERP là nguồn số 1.** Không có trong ERP mới dùng nguồn khác (TA khai). | Cờ lệch giữa hai kênh đưa cho người duyệt (§4). |
| 4 | **Đơn giá chỉ áp cho việc ngoài package.** 3 phần chính (TG+ET, BTVN, bổ trợ) tính theo hệ số, không có đơn giá lẻ. | Danh mục việc có cột `nhom` (`package` / `ngoai_package`). |
| 5 | **Dạy thay tính vào số buổi để ra tỉ lệ.** Bình thường 7/7, thêm 1 buổi dạy thay thành 8/7. | Tử số %TG gồm cả buổi dạy thay. Xem §3 về trần 100%. |
| 6 | **Làm cho TA chuẩn trước.** | v1 không đụng full-time/core team. |
| 7 | **Xác thực có mặt = QR check-in** tại trung tâm. Hậu kiểm bằng người duyệt hằng ngày. | Không cần định vị/wifi. Kiểm soát ở bước duyệt daily, không ở bước bấm. |
| 8 | **Không trần** cho %TG và %BTVN: có tháng số buổi nhiều hơn mẫu số thì tỉ lệ vượt 100%. | Bỏ `LEAST(1, …)` ở hai tỉ lệ này. Số tháng 9 tính tay (đang chặn 100%) sẽ đổi ở các lớp ghi nhiều hơn mẫu số. |
| 9 | **Trang duyệt** công. | Một người duyệt, hàng đợi daily. |
| 10 | **Dạy thay cộng vào lớp chính** của TA. | %TG của lớp chính = (buổi lớp chính + buổi dạy thay) ÷ buổi lớp chính diễn ra. |

## 1. Nguyên tắc thiết kế

1. **ERP tự điền những gì ERP đã biết, TA chỉ khai phần ERP không biết.** Mở app, TA thấy sẵn "hôm nay có": buổi lớp mình (từ lịch + `phan_cong_lop`), ca trực khối / ca bổ trợ đã xếp (`ca_bo_tro`). TA xác nhận có mặt và thêm việc ngoài lịch. Không bắt nhập lại cái hệ thống đã có.
2. **Khoá bám khoá tự nhiên** (`buoi_hoc_id`, `ca_bo_tro_id`), không bám vị trí. Một việc không thể ghi hai lần vì cùng khoá.
3. **Dòng chỉ ra đời khi có việc thật** (§1.5 CLAUDE.md). Không có "chờ điền".
4. **Mọi con số lương tính ở Postgres** (`fn_ta_luong_*`), app chỉ gọi (§2.0 CLAUDE.md). Công thức đang sống ở script tạm ngoài repo phải chuyển vào đây, không để hai nơi.
5. **Mọi đổi trạng thái có vết** (trigger ghi actor + ts + cũ/mới).

## 2. Hai kênh dữ liệu

| Kênh | Nội dung | Ai ghi |
|---|---|---|
| **K1 — ERP (số 1)** | Buổi diễn ra / huỷ, lớp, sĩ số, buổi đã đóng ET/BTVN, ca bổ trợ đã mở, HS có mặt, gậy | Hệ thống, OPS, GV |
| **K2 — Chấm công TA** | TA có mặt (vào/ra), việc TA khai (nhất là việc K1 không có: trông thi, chấm thi, bổ trợ riêng, dạy thay) | TA |

Quy tắc dùng:
- Việc **có trong K1** → số liệu lấy K1. K2 dùng để **đối chiếu**.
- Việc **không có trong K1** → K2 là nguồn, **phải qua duyệt** mới vào lương.
- **Có mặt** chỉ có ở K2 → bắt buộc. Buổi lớp diễn ra mà TA phụ trách không có chấm công → hiện cờ "thiếu chấm công", người duyệt xử lý (TA quên bấm, hay TA không đến).

## 3. Công thức lương (đã chạy tay đúng trên tháng 9)

```
Gross = Σ lớp [ Bậc(sĩ số lớp) × (0,4 × %TG + 0,2 × %BTVN) ]
      + 0,4 × %BổTrợ × Bậc(lớp chính)
      + Σ việc ngoài package (đơn giá × số lượng)
Net   = Gross − tien_phat (gay_chot_thang của kỳ)
```

| Thành phần | Tỉ lệ | Chi tiết |
|---|---|---|
| %TG (TG + ET, 40%) | (buổi dạy lớp mình + buổi dạy thay) ÷ buổi lớp diễn ra | Mẫu số = buổi `thuong` không `huy` trong tháng. Dạy thay cộng vào tử số (CEO #5). |
| %BTVN (20%) | số lần phát có chấm ÷ định mức | Định mức: lớp 8 buổi/tháng = 7 lần, lớp 4 buổi/tháng = 3 lần. Có chấm là tính đạt, chưa tính theo số bài. |
| %BổTrợ (40%) | tổng giờ ÷ 8 | Gồm bù · yếu · đuổi · định kì (trực khối). Vượt 8 giờ thì nhân lên, không trần. Không gồm bổ trợ đặc biệt (tính riêng). |
| Bậc lương lớp | 5–8 HS: 1.000.000 · 9–12: 1.200.000 · 13–15: 1.400.000 · 16–20: 1.600.000 · 21–25: 1.800.000 | Lớp dưới 5 HS lấy bậc thấp nhất. Sĩ số tại ngày chốt kỳ (từ `hoc_sinh_lop.ngay_vao/ngay_roi`, không dùng sĩ số hiện tại). |
| Lớp chính | lớp có TG, bậc cao nhất | Dùng nhân phần bổ trợ. |
| Lớp chỉ chấm BTVN, không TG | chỉ tính phần 0,2 × %BTVN | Không phạt phần TG. |
| Trông thi lớp mình | nằm trong công TG, không tính riêng | |
| Trông thi lớp khác | giờ × 50.000đ | Việc ngoài package, đã có đơn giá. |
| Bổ trợ đặc biệt (kèm riêng) | 150.000đ / buổi | Tính riêng, không vào 8 giờ. |

**Đã chốt (CEO 12/10):** %TG và %BTVN **không có trần** (§0 #8); dạy thay cộng vào lớp chính (§0 #10).
Tác động lên số tính tay tháng 9: các lớp ghi nhiều hơn mẫu số được tính vượt 100% (vd Dương 5A2 TG 8/6, Dương 5A1 và Nguyên 7B1 BTVN 8/7). Phiếu tháng 9 đã gửi theo trần 100% sẽ lệch khi chạy bằng hàm ERP, ghi vào báo cáo kiểm chuẩn.

## 4. Dữ liệu cần dựng

### 4.1 Danh mục & cấu hình (migration)
- `ta_loai_viec`: `ma` · `ten` · `nhom` (`package`/`ngoai_package`) · `tinh_vao` (`tg`,`btvn`,`bo_tro`,`trong_thi`,`cham_thi`,`day_thay`,`khac`) · `don_vi` (`buoi`/`gio`) · `don_gia` (null cho package) · `can_lop` · `can_hs` · `nguon_erp` · `can_duyet`.
  Khởi tạo từ file chấm công: Trợ giảng · Dạy thay · Bổ trợ bù / yếu / đuổi / định kì (trực khối) / ôn thi · Bổ trợ đặc biệt (150k/buổi) · Trông thi (50k/giờ) · Chấm thi (đơn giá chưa có) · Khác (bắt buộc ghi chú, qua duyệt).
- `ta_luong_bac(si_tu, si_den, luong)`.
- Mở rộng `ta_dinh_muc` (đã có `botro_gio`=8, `btvn`=7): thêm `btvn_lop_4_buoi`=3, `trong_thi_gia`=50000, `bo_tro_dac_biet_gia`=150000.

### 4.2 Chấm công (dữ liệu mới)
- `ta_cham_cong`: `id` · `nhan_su_id` · `ngay` (giờ VN) · `vao_at` · `ra_at` · `co_so` · `cach_xac_thuc` · `trang_thai` (`dang_lam`/`xong`/`quen_ra`).
  Dòng ra đời khi TA bấm Vào. `ra_at` null chỉ hợp lệ khi `dang_lam`.
- `ta_cong_viec`: `id` · `cham_cong_id` · `loai_viec` · `lop_id?` · `buoi_hoc_id?` · `ca_bo_tro_id?` · `gio_bat_dau` · `gio_ket_thuc` · `hoc_sinh_ids?` · `ghi_chu` · `nguon` (`he_thong`/`tu_khai`) · `trang_thai` (`cho_duyet`/`da_duyet`/`tu_choi`) · `duyet_boi` · `duyet_at`.
  Unique theo khoá tự nhiên (một buổi / ca chỉ một dòng cho một TA).
- Trigger ghi `ta_cong_log` (actor, ts, cũ/mới) cho mọi đổi trạng thái.
- Bỏ dần `ta_vang` và `ChamCongTa.tsx` (box quản lý ghi vắng) khi chuyển xong.

### 4.3 Việc ERP chưa có thực thể
- **Ca trông thi**: kỳ thi · lớp/phòng · khung giờ · người trông. Hiện `ky_thi` không có người trông.
- **Chấm thi**: phân công + khối lượng (chưa có định nghĩa).
- **Bổ trợ riêng / đặc biệt**: có loại việc nhưng cần danh sách HS được kèm.

### 4.4 Hàm Postgres (đặt tên theo quy ước)
- `fn_ta_hom_nay(p_ns)` → danh sách "hôm nay có" (buổi, ca đã xếp) để TA xác nhận.
- `fn_ta_cham_cong_vao / ra / khai_viec` (ghi, transaction).
- `fn_ta_cong_thang(p_ns, p_ky)` → từng việc, nguồn K1/K2, cờ lệch.
- `fn_ta_luong_thang(p_ky)` → bảng lương Gross/phạt/Net từng TA, kèm chi tiết cách ra số.
- `fn_ta_chot_ky(p_ky)` → snapshot bất biến.

## 5. Kịch bản TA (app TA, mở rộng `TaHome`)

1. Đến trung tâm, mở app → màn **Chấm công**, **quét QR** dán tại quầy để Vào ca. QR đổi định kỳ, `ta_cham_cong.cach_xac_thuc='qr'`.
2. Màn hiện sẵn các việc hôm nay từ lịch; TA tick xác nhận, thêm việc khác từ danh sách (Dạy thay, Trông thi, Chấm thi, Bổ trợ riêng, Khác…), điền giờ + ghi chú / HS nếu cần.
3. Rời trung tâm bấm **Ra ca**. Quên ra → hệ nhắc, trạng thái `quen_ra` chờ người duyệt chốt giờ.
4. Cuối tuần/tháng TA xem **bảng công của mình** (đã duyệt / chờ duyệt / lệch) và sửa trong hạn.

## 6. Đối chiếu chéo & duyệt

Cờ tự động cho người duyệt (nguyên tắc triangulation §5 CLAUDE.md):
- Buổi lớp diễn ra, TA phụ trách, **không có chấm công** · có chấm công nhưng **buổi bị huỷ**.
- TA khai TG nhưng buổi không có ET/BTVN đóng · có đóng nhưng không chấm công.
- Hai việc **trùng giờ** · giờ ngoài 7h–22h30 · kết thúc ≤ bắt đầu.
- Số buổi TA khai ≠ số buổi ERP (vd Dương 5A2: file 8, ERP 6 vì 2 buổi huỷ).
- Lớp có BTVN nhưng không có TG (kiểu Khánh 8B1, Ngân 3A1) · lớp có TG nhưng không BTVN.
- Việc `ngoai_package` / `Khác` luôn qua duyệt, không tự vào lương.
- Giờ bổ trợ vượt 8 giờ nhiều (vd >25 giờ) → cờ soát (tháng 9: TrangQ 31,5 giờ).

Người duyệt: **Trang**, duyệt hằng ngày; có hạn chót khai/sửa trước khi chốt kỳ lương.

## 7. Việc còn mở (cần CEO chốt)

1. **Chi tiết QR**: một QR cho cả trung tâm hay mỗi cơ sở/phòng một QR; chu kỳ đổi mã (vd 5 phút / mỗi ngày); in hay hiển thị trên màn hình quầy.
2. **Hạn chót sửa/duyệt** trước khi chốt kỳ (đề xuất: ngày 3 tháng sau).
3. **Đơn giá chấm thi** và định nghĩa khối lượng (theo bài? theo giờ?).
4. **Phạt gậy ra tiền**: `gay_chot_thang` đã có `don_gia` và `tien_phat` — xác nhận dùng nguyên, hay có trần phạt?
5. **TA online / ET online**: không ở trung tâm thì chấm công thế nào (QR không áp dụng).
6. **Tháng ngang kỳ**: ca đêm qua 0h, ca ngày 1–5 đầu tháng sau (file tháng 9 có dòng ngày 1–8/10; Long trông thi 4–5/10) thuộc kỳ nào. Đề xuất: theo ngày diễn ra, không theo ngày khai.

Đã chốt 12/10: QR check-in, không trần, Trang duyệt, dạy thay vào lớp chính (§0 #7–#10).

## 8. Thứ tự build & kiểm

1. Migration §4.1 + §4.2 + RPC ghi (có smoke giả JWT, rollback).
2. App TA: màn Chấm công (Vào/Ra, hôm nay có, khai việc, bảng công của tôi).
3. Màn duyệt + danh sách cờ cho người duyệt (desktop ERP).
4. `fn_ta_luong_thang` + màn bảng lương; **kiểm chuẩn**: chạy lại tháng 9 trên dữ liệu đã nhập, so 14 phiếu tính tay đến từng đồng; lệch → liệt kê nguyên nhân.
5. Chốt kỳ + phiếu lương TA xem trên app (thay PDF làm tay) + khiếu nại có vết.
6. **Chạy song song 1 tháng** (tháng 11): sheet và ERP cùng chạy, so từng TA; lệch về 0 thì tắt sheet.
7. Thực thể trông thi / chấm thi (4.3) có thể làm sau bước 4, giữa lúc TA đã dùng được phần lõi.

## 9. Ngoài phạm vi v1
Full-time / core team theo giờ làm · tự nhận/giao việc ngoài danh mục · thông báo đẩy (ERP chưa có hạ tầng) · điều chỉnh lương theo hiệu suất (đã bỏ, CEO #2).
