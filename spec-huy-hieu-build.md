# Spec BUILD — Huy hiệu (thành tựu) phase 1 · môn TOÁN — 28/09/2026

> **Đọc trước:** `spec-thanh-tuu-nhiem-vu.md` §0.7 (logic đã chốt) · `ma-tran-thanh-tuu-huy-hieu.xlsx` (ma trận).
> File này = **cách ĐO chính xác + schema + RPC + màn**. Lệch §0 thì §0 đúng; lệch DB thật thì đo lại DB.
> Số liệu "đo DB" bên dưới lấy 28/09 bằng role đọc, môn Toán, từ 01/07/2026.

---

## 1. Quyết định Thùy 28/09 (vòng Q1–Q4)

| # | Câu | Chốt |
|---|---|---|
| Q1 | Năm huy hiệu gồm tháng nào? | **Tháng 7 → tháng 4** (10 tháng). Giữa tháng 5 nghỉ hè ⇒ tháng 5, 6 **không đếm**. Mùa `2026-27` = 2026-07 … 2027-04 |
| Q2 | Tính lùi? | **Có, từ tháng 7/2026.** Điều kiện của tính năng chưa mở (Thử thách…) ở tháng trước khi mở = **không áp dụng** (không tính trượt) |
| Q3 | Chia đợt? | **Không chia.** Rank + Thử thách + Nhiệm vụ + Huy hiệu làm **cùng đợt**; đủ 8 huy hiệu |
| Q4 | H8 — đạt lại năm sau | **Chốt:** bản mềm ghi ×2, ×3…; bản cứng chỉ trao lần đầu |

---

## 2. Khái niệm thời gian

- **Tháng T** = tháng lịch giờ VN (`buoi_hoc.ngay` ∈ [01/T, 01/T+1)).
- **MT của tháng T** = kỳ `ky_thi.loai='mt_sat_hach'` có `buoi_hoc.ngay` ∈ **[25/T, 10/T+1)**, giống cửa sổ của `fn_bxh_diem_mt_khoi(p_ym=T)`.
  - Đo DB: MT thực tế tổ chức **đầu tháng sau** (MT 03–06/08 là MT của tháng 7; MT 03–07/09 là MT của tháng 8).
  - ⇒ MT tháng 4 thi đầu tháng 5, trước khi nghỉ hè, vẫn tính cho tháng 4.
- **Chốt tháng T** = sau khi cửa sổ MT đóng, tức **từ 10/T+1**.
  - Trước khi chốt: app hiện **"tạm tính"**, tính động, không ghi dòng.
  - Chốt: hàm ghi dòng đạt **1 lần** (idempotent). **Đã chốt thì không thu hồi**, kể cả khi sau đó sửa điểm hay sửa điểm danh (§1.5: dòng chỉ ra đời khi có kết quả thật; "đạt rồi không mất").
  - Ai bấm: gắn vào **cùng quy trình chốt xu tháng** đang có (không có `pg_cron`). Hàm idempotent nên gọi lại không sao.
- **Tính lùi** = chạy hàm chốt cho 2026-07, 2026-08 (và 2026-09 khi tới 10/10) ngay khi build xong.

---

## 3. Định nghĩa đo 14 thành tựu (điều kiện 1 tháng · 1 HS · môn Toán)

**Luật chung:**
- **Tháng không có dữ liệu = không đạt.** Điều kiện "mọi bài / không buổi nào" phải có **≥ 1 dòng thật** mới xét, không thì tháng rỗng tự thành "đạt" (§1.5).
- Dòng chưa chấm / chưa điểm danh (`NULL`) **bỏ khỏi mẫu**. Ngày chốt (10/T+1) đã cho OPS 10 ngày để điền đủ.
- **Không áp dụng** (Q2) chỉ dành cho điều kiện có `mo_tu` (ngày tính năng mở) > tháng T.
- **Khối** = `ky_thi.khoi` (với MT) · `lop.khoi` (với Bảng đua tháng).

| Mã | Điều kiện | Cách đo chính xác | Mở từ |
|---|---|---|---|
| **A1** | Không vắng buổi nào | Mọi dòng `buoi_hoc_hs` của em, buổi `loai='thuong'`, `trang_thai<>'huy'`, lớp Toán, trong tháng: `diem_danh='co_mat'`. **`vang_phep` cũng là vắng** (Thùy: "không nghỉ"; đã bác phương án tính bù). Cần ≥ 1 buổi có điểm danh | 07/2026 |
| **A2** | Nộp đủ, đúng hạn mọi BTVN | Mọi dòng `btvn_ket_qua` (buổi trong tháng, lớp Toán, `trang_thai_nop` không NULL): `trang_thai_nop='nop_dung_han'`. **`xin_phep` = không đạt** (cùng luật "không nghỉ"). Cần ≥ 1 bài. *(Cột `hoan_thanh`, `dung_han` không dùng — đo DB: `hoan_thanh` luôn false)* | 07/2026 |
| **A4** | Tự luyện ≥ 200 câu đúng | Đếm `bai_lam_cau.verdict='correct'` của `bai_test.loai='tu_luyen'`, `mon='Toán'`, `cham_at` trong tháng. **Tính cả câu Thử thách** (Thử thách là 1 kiểu tự luyện) | 07/2026 |
| **A5** | Pass Thử thách ≥ 10 ngày | Số ngày VN khác nhau có ≥ 1 lượt Thử thách pass (≥ 80%) | ngày mở Thử thách |
| **A6** | Pass Thử thách ≥ 15 ngày | Như A5, ngưỡng 15 | ngày mở Thử thách |
| **B1** | ET ≥ 80% ở ≥ ¾ số bài | 1 bài ET = (em × buổi) có dòng `gami_grades` phase `et`. Tỉ lệ bài = TB(correct 1 · partial 0,5 · wrong 0), **cùng quy đổi với mastery**. Đạt khi số bài ≥ 0,8 chiếm ≥ ¾ số bài, cần ≥ 1 bài. *(Đo DB: ET online từ 09/2026 đã mirror vào `gami_grades` qua `bai_lam_cau_id`; 32 câu ET online tháng 8 chưa mirror — bỏ qua, không đáng)* | 07/2026 |
| **B2** | MT top 30% khối | Xếp **chỉ em có điểm** MT tháng T trong khối (điểm = `diem`, lỡ thi thì `diem_thi_lai`; nhiều kỳ thì lấy TB). `rank()` giảm dần; đạt khi hạng ≤ `ceil(0,3 × số em có điểm)` | 07/2026 |
| **B4** | BTVN đúng TB ≥ 85% | TB `btvn_ket_qua.ti_le_dung` (không NULL) các bài trong tháng ≥ 0,85. Cần ≥ 1 bài | 07/2026 |
| **B5** | BTVN đúng TB ≥ 90% | Như B4, ≥ 0,90 | 07/2026 |
| **B6** | ≥ 5 lượt Thử thách 10/10 | Đếm lượt Thử thách đúng hết | ngày mở Thử thách |
| **P1** | Hạng MT tốt hơn đầu năm (hoặc giữ top 10%) | Phân vị `p = hạng / số em có điểm` (như B2). **Mốc** = p của **tháng MT đầu tiên em có điểm trong mùa**. Đạt khi `p(T) < p(mốc)` **hoặc** hạng ≤ `ceil(0,1 × N)`. **Tháng mốc không xét** (so với chính nó) | 07/2026 |
| **C3** | Lấp ≥ 1 lỗ (hoặc không còn dạng yếu) | Mastery **tính đến đầu tháng** vs **tính đến cuối tháng** (cần tham số `p_den`, xem §5). Đạt khi: ≥ 1 dạng `yeu` đầu tháng → `dat` với độ tin ≥ `tb` cuối tháng; **hoặc** cuối tháng 0 dạng `yeu` **và** trong tháng có ≥ 1 lần đo. Toán = nhánh Đại (`ma_dang`) + Hình (`hinh_baitoan`) qua registry nhánh (§1.6) | 07/2026 |
| **D30** | Top 30% Bảng đua tháng | Xếp Điểm Rank kiếm trong tháng T theo khối × Toán. Chỉ xếp **em có Điểm Rank > 0** trong tháng. Tháng trước khi mở Thử thách: Điểm Rank gồm 3 nguồn còn lại (tính lùi được) | 07/2026 |
| **D10** | Top 10% Bảng đua tháng | Như D30, 10% | 07/2026 |

> ⚠ **2 chỗ t tự quyết theo luật "không nghỉ" — Thùy bác thì đổi tham số, không đổi code:** `vang_phep` tính là vắng (A1) · `xin_phep` tính là không đúng hạn (A2).
> Đo DB T7–T9: `vang_phep` 233 / 98 / 71 dòng · `xin_phep` 22 / 11 / 47 dòng.

---

## 4. Từ thành tựu ra sao

- **Tháng đạt chuẩn** của huy hiệu H = mọi thành tựu **vai `chuan`** của H đạt.
- **Tháng hoàn hảo** = tháng đạt chuẩn **và** mọi thành tựu **vai `them`** của H đạt **hoặc không áp dụng**.
  - Nếu **mọi** điều kiện chuẩn đều không áp dụng (vd Hercules tháng 7–9) ⇒ tháng đó **không đếm**, cả chuẩn lẫn hoàn hảo.
- **Sao** (đếm trong mùa, tháng 7 → 4):

| ★ | Cần | Loại tháng | Bản cứng | EXP |
|---|---|---|---|---|
| 1 | 1 | chuẩn | — | 0 |
| 2 | 2 | chuẩn | — | 0 |
| 3 | 4 | chuẩn | — | 100 |
| 4 | 6 | **hoàn hảo** | Có — GV trao | 200 |
| 5 | 9 | **hoàn hảo** | Có — GV trao | 300 |

- Đạt ★ ở lúc chốt tháng: dòng `hs_huy_hieu_dat` ra đời, kèm EXP (nếu có) trong **cùng transaction**.
- **Lần** (H8): mùa sau đạt lại cùng sao ⇒ dòng mới, `lan = 2`. Việc trao bản cứng chỉ sinh cho `lan = 1`.

---

## 5. Schema (migration mới — tên theo `npm run new-migration`)

Mọi bảng mang `mon` (§1.6). Config ở bảng, **không viết cứng trong hàm** (A9).

| Bảng | Cột chính | Ghi chú |
|---|---|---|
| `gami_mua` | `mua` PK ('2026-27') · `bat_dau` date · `ket_thuc` date · `hh_thang_dau` text ('2026-07') · `hh_thang_cuoi` ('2027-04') | Dùng chung cho rank (mùa 1/7–30/6) và huy hiệu (7→4) |
| `thanh_tuu` | PK(`mon`,`key`) · `ten` · `loai_chi_so` (CHECK: danh sách registry §6) · `tham_so` jsonb (ngưỡng) · `mo_tu` date NULL (NULL = không áp dụng khái niệm này, tức luôn mở) · `active` | Seed 14 dòng Toán §3 |
| `huy_hieu` | PK(`mon`,`key`) · `ten` · `bieu_tuong` · `ghi_nhan` · `thu_tu` · `active` | Seed 8 dòng Hy Lạp |
| `huy_hieu_dieu_kien` | PK(`mon`,`huy_hieu_key`,`thanh_tuu_key`) · `vai` CHECK (`chuan`,`them`) | **Bảng nối N–N = màn Ma trận.** Seed đúng xlsx. *(Thay `huy_hieu_cap_dieu_kien` ở A5.7: mô hình chuẩn/hoàn hảo đã chốt chỉ cần vai, không cần theo từng sao)* |
| `huy_hieu_thang_sao` | PK(`mon`,`sao`) · `so_thang` · `loai_thang` CHECK (`chuan`,`hoan_hao`) · `ban_cung` bool · `exp` int | Seed bảng §4 |
| `hs_thanh_tuu_thang` | PK(`hoc_sinh_id`,`mon`,`thang`,`thanh_tuu_key`) · `ket_qua` CHECK (`dat`,`khong_dat`,`khong_ap_dung`) · `chot_at` | Kết quả **đã chốt**. `khong_dat` cũng ghi (là kết quả thật, không phải "chưa đo") ⇒ album hiện được lịch sử tháng. Không ghi dòng cho tháng em không học |
| `hs_huy_hieu_dat` | `id` · `hoc_sinh_id` · `mon` · `huy_hieu_key` · `sao` · `mua` · `lan` · `dat_at` · UNIQUE(`hoc_sinh_id`,`mon`,`huy_hieu_key`,`sao`,`mua`) | Append-only |
| `hs_huy_hieu_trao` | PK(`dat_id`) FK→`hs_huy_hieu_dat` · `trao_at` · `trao_boi` FK `nhan_su` | Tách bảng để dòng đạt bất biến; **trigger** ghi log nếu sửa/xoá (§4) |

**Catalog cũ:** `thanh_tich_loai` (12 key, 0 dòng ghim) ⇒ `active=false`, **không xoá**. `hoc_sinh_thanh_tich_ghim` đổi FK sang `huy_hieu` (bảng đang 0 dòng — kiểm lại lúc migrate). Code đọc cũ: `BangThanhTich.tsx`, `ThanhTichScreen.tsx`, `lib/gami.ts::getThanhTich*`, `lib/thanhtich.ts` ⇒ chuyển sang RPC mới.

**Sửa hàm có sẵn:**
- `fn_mastery_cells` / `fn_mastery_cells_hinh`: thêm `p_den timestamptz DEFAULT NULL` ở **cuối** (drop + create, cấp lại grant; gọi theo vị trí cũ vẫn chạy). **Không chép công thức sang hàm thứ 2.**
- `fn_bxh_diem_mt_khoi` **không sửa** (đang phục vụ bảng xếp hạng hiển thị). Viết `fn_mt_hang_thang(mon, khoi, ym)` chỉ xếp em có điểm, dùng chung cho B2 / P1 / Điểm Rank MT.

---

## 6. Hàm (Postgres — §2.0)

| Hàm | Việc |
|---|---|
| `fn_thanh_tuu_thang(p_mon, p_ym, p_hs uuid[] DEFAULT NULL)` → (hs, key, ket_qua) | **1 hàm đánh giá chung**, dispatch theo `loai_chi_so` qua registry: `diem_danh_du` · `btvn_dung_han_du` · `tu_luyen_cau_dung` · `thu_thach_ngay_pass` · `thu_thach_luot_full` · `et_ti_le_bai` · `mt_top_pct` · `btvn_ti_le_tb` · `mt_hon_moc` · `lap_lo` · `dua_thang_top_pct`. Tính **động** — dùng cho cả "tạm tính" lẫn chốt |
| `fn_huy_hieu_chot_thang(p_mon, p_ym)` | Kiểm `now() ≥ 10/T+1` và T ∈ năm huy hiệu. Ghi `hs_thanh_tuu_thang` → tính sao → ghi `hs_huy_hieu_dat` mới + EXP `exp_thanh_tuu`, **1 transaction**, idempotent |
| `fn_hs_album(p_mon)` | App HS (security definer + `revoke … from anon`): 8 huy hiệu × sao đã có · tiến độ tới sao kế (tháng đã có / cần) · **checklist tháng hiện tại (tạm tính)** · "N bạn trong khối có" · nhãn *Hiếm* (< 10%) · "Sắp đạt" |
| `fn_huy_hieu_viec_trao(p_nhan_su)` | **Invariant §4:** dòng `hs_huy_hieu_dat` có `sao ∈ ban_cung`, `lan = 1` **TRỪ** đã có `hs_huy_hieu_trao`, lọc theo GV chính lớp Toán em đang học (`phan_cong_lop.vai_tro='gv'`, `la_chinh`) |
| `fn_huy_hieu_trao(p_dat_id)` | GV bấm "Đã trao" |
| `fn_huy_hieu_ma_tran(p_mon)` / `fn_huy_hieu_ma_tran_sua(...)` | Màn admin: đọc / tích ô `huy_hieu_dieu_kien` |

**EXP `exp_thanh_tuu`** — nguồn mới, nhớ bẫy §0.9: sửa 4 chỗ đọc viết cứng (`fn_gami_exp_xu_thang` · `fn_gami_exp_chi_tiet_thang` · `fn_hs_vi_xu_cua_toi` · `EXP_NOTE_SOURCES`) và loại khỏi delete của `fn_recompute_exp_thang`. Trần 5 xu / tháng / môn nằm trong hàm chốt xu (§0.6).

---

## 7. Màn

| Màn | Ai | Nội dung |
|---|---|---|
| **Album huy hiệu** (app HS, theo môn) | HS | Lưới 8 × 5 sao, sao chưa có bóng mờ · % album · "Sắp đạt" · bấm huy hiệu ⇒ checklist tháng này (✓ không vắng · ☐ BTVN 4/5 đúng hạn…) + lịch sử tháng. Card theo **kiểu 1** (CLAUDE.md §6). Ghim 3 huy hiệu khoe |
| **Trao bản cứng** (ERP GV) | GV lớp | Danh sách việc trao suy động, nút "Đã trao" (vá tại chỗ, không reload) |
| **Ma trận** (ERP admin) | Admin | Hàng = thành tựu, cột = huy hiệu, ô = `chuan` / `them` / trống · cột đếm số huy hiệu mỗi thành tựu nuôi |
| TV lớp · hồ sơ | — | 3 huy hiệu ghim (đi cùng khoe rank, C11) |

---

## 8. Thứ tự build (trong đợt chung Q3)

1. Schema + seed + `fn_mt_hang_thang` + `p_den` cho mastery.
2. `fn_thanh_tuu_thang` với 9 chỉ số dữ liệu có sẵn (A1 A2 A4 B1 B2 B4 B5 P1 C3) → **so với số đo DB 28/09** (A1 ~48–72%, A2 ~43–51%, B1 ~41–46%) trước khi đi tiếp.
3. `fn_huy_hieu_chot_thang` + EXP ⇒ chốt thử tháng 7, 8 trong transaction rollback, xem phân bố sao.
4. Album HS · màn trao · màn ma trận.
5. Nối A5 / A6 / B6 khi Thử thách xong · D30 / D10 khi Điểm Rank xong (đặt `mo_tu`).
6. Tính lùi thật tháng 7, 8, 9.
