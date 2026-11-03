# B1 — Hiện trạng DB bản đồ mới K12 (đo 03/11, CHỈ SELECT trong transaction READ ONLY)

> Role chạy: `claude_build` (không `bypassrls`, nhưng sở hữu các bảng `dai_bdm_*` nên đọc đủ). Điểm mù đã biết: 17 bảng owner `postgres` (đầu `schema.md`) trả 0 dòng — không bảng nào trong đó chứa mã dạng Đại, nhưng "0" ở đó không phải bằng chứng.

## 1. Chủ đề K12 (`dai_bdm_chu_de`, khối 12) — dò lại, khớp đề bài

| mã | tên | vùng | việc |
|---|---|---|---|
| NCD00094 | Ứng dụng đạo hàm để khảo sát và vẽ đồ thị hàm số | toan | LÀM LẠI (HS) |
| NCD00095 | Nguyên hàm và tích phân | toan | THÊM dạng (NHTP) |
| NCD00096 | Vectơ và hệ trục toạ độ trong không gian | toan | LÀM LẠI (VT) |
| NCD00097 | Xác suất có điều kiện | toan | LÀM LẠI (XS) |
| NCD00098 | Các số đặc trưng đo mức độ phân tán của mẫu số liệu ghép nhóm | toan | LÀM LẠI (SDT) |
| NCD00099 | Phương pháp toạ độ trong không gian | **hgt** | THÊM dạng (PPTD) |

## 2. Cây đang có

| chủ đề | chuyên đề (ô thu_tu) | nhóm | dạng | dạng có LT / VD | câu gán `dai_bdm_gan_cau` | `hgt_bdm_gan_cau` |
|---|---|---|---|---|---|---|
| NCD00094 HS | NCH00343 (5) · NCH00344 (6) · NCH00428 (7) | 11 · 10 · 12 = **33** | **11** (chỉ ở NCH00428: NDB00620–624, 00804–807, 00811–812) | 6 / 0 | **952** | 0 |
| NCD00095 NHTP | NCH00345 · 346 · 347 | 2 · 5 · 4 = 11 | 9 · 17 · 14 = 40 | 5 / 40 | 1.506 | 0 |
| NCD00096 VT | NCH00348 · 349 · 350 | 7 · 3 · 11 = **21** | **6** (NDB00640–645, chỉ NCH00348) | 0 / 0 | **154** | 0 |
| NCD00097 XS | NCH00351 · 352 | 4 · 3 = **7** | **0** | — | 0 | 0 |
| NCD00098 SDT | NCH00353 | **7** | **0** | — | 0 | 0 |
| NCD00099 PPTD | NCH00430 · 431 · 433 (rỗng) · 432 | 3 · 3 · 0 · 5 = 11 | 21 · 7 · 0 · 16 = 44 | 0 / 0 | 2 | 1.051 |

- Mọi chuyên đề trên chỉ thuộc **một** ô (không dùng chung với chủ đề khác) ⇒ gỡ ô không ảnh hưởng chủ đề khác.
- `dai_bdm_nhom_tien_de`: 0 mũi tên trong 6 chủ đề.
- Nội dung Thùy viết sẽ mất nếu xoá cây cũ (B5): LT nhóm HS NNB01188 (769), 01189 (1.740), 01191 (474), 01194, 01195, 01196 (1.106), **01197 (3.704)**, 01185, 01187, 01178 (886), 01179 (1.297), 01180; LT dạng NDB00804–807, 00811–812 (278–580 ký tự); VT LT nhóm NNB01230 (921), 01233 (683), 01235 (608), **01237 (1.685)**, 01238, 01241–01244, **01246 (1.337)**, 01248; mô tả nhóm XS/SDT/HS-NCH00344 (86–183 ký tự). Danh sách đầy đủ: `B3-doi-ung-de-xuat.md`.

## 3. Tham chiếu tới id CŨ (chuyên đề/nhóm/dạng) của 6 chủ đề

Cách quét: mọi cột `text/varchar/jsonb/json/ARRAY` của **1.861 cột / mọi bảng public** (trừ `dai_bdm_log`) lọc `~ 'N(DB|NB|CH|CD)[0-9]{5}'` (57 cột có ít nhất 1 mã), rồi tách từng mã bằng `regexp_matches` và đối chiếu với id cây cũ của 6 chủ đề. Số = số DÒNG trỏ tới.

### 3a. KHÔNG có FK — xoá cây cũ thì những dòng này trỏ vào hư không, IM LẶNG

| bảng.cột | ý nghĩa | HS 094 | NHTP 095 | VT 096 | XS 097 | SDT 098 | PPTD 099 |
|---|---|---|---|---|---|---|---|
| `gami_session_problems.ma_dang` | **đo lường**: câu ET/BTVN/MT của buổi | **55** (7 dạng) | 206 | **72** (6 dạng) | 0 | 0 | 112 |
| `bai_test_cau.ma_dang` | câu trong bài test (bổ trợ/test) | **10** (NDB00804) | 262 | **216** (6 dạng) | 0 | 0 | 369 |
| `ca_test_cau.ma_dang` | câu trong ca test | **38** (8 dạng) | 0 | **11** | 0 | 0 | 1 |
| `tu_luyen_dang_lan.ma_dang` | lượt tự luyện theo dạng | **10** | 21 | **34** | 0 | 0 | 109 |
| `bai_test_dang_phat_hanh.ma_dang` | dạng đã phát hành bài test | 0 | 3 | 1 (NDB00643) | 0 | 0 | 10 |
| `tai_lieu_phan.ref_ma` | **giáo trình**: phần trỏ nhóm/dạng | **40** (7 dạng + 13 nhóm; GT «Ôn tập hàm số») | 87 | **64** (6 dạng + 11 nhóm; «Giáo trình 12A», «Giáo Trình 12B») | 0 | 0 | 0 |
| `dang_yeu_hien_tai.dang` | dạng yếu hiện tại | 0 | 5 | 0 | 0 | 0 | 0 |
| `dai_bdm_de_xuat.ly_do` · `hgt_bdm_de_xuat.ly_do` · `hgt_bdm_cau_thieu_dang.ly_do` · `dai_bdm_cau_chua_khop.ly_do` | chữ tự do (lý do AI) — chỉ để đọc | 49 | 151+160 | 0 | 0 | 0 | 3+5 |

Không thấy mã của 6 chủ đề trong: `bo_tro_*`, `buoi_danh_gia_dang`, `canh_bao_yeu`, `hoc_tu_dau_dang`, `dtv_*`, `dai_cau_lop.noi_dung/loi_giai`, `tai_lieu.cau_hinh`, `dai_bdm_dang_bai.mo_ta/ly_thuyet/vi_du` (mấy cột này có mã NDB nhưng của chủ đề khác). Mastery bản đồ mới **không lưu** (suy từ `gan_cau` + đo) ⇒ không có bảng mastery trỏ id.

### 3b. CÓ FK (DB tự chặn/tự xử khi xoá — để biết trước B5)

| bảng.cột | HS 094 | NHTP 095 | VT 096 | XS 097 | SDT 098 | PPTD 099 | khi xoá dạng/nhóm cũ |
|---|---|---|---|---|---|---|---|
| `dai_bdm_gan_cau.dang_bai_id` | 952 | 1.506 | 154 | 0 | 0 | 2 | **chặn** (no action) |
| `hgt_bdm_gan_cau.dang_bai_id` | 0 | 0 | 0 | 0 | 0 | 1.051 | chặn |
| `dai_bdm_de_xuat.dang_bai_id` | 287 | 619 | 65 | 0 | 0 | 0 | chặn |
| `hgt_bdm_de_xuat.dang_bai_id` | 0 | 0 | 0 | 0 | 0 | 375 | chặn |
| `dai_cau_lop.dang_bai_id` | 0 | 76 | 0 | 0 | 0 | 0 | chặn |
| `dai_bdm_doi_ung.dich_dang_bai` | 6 | 11 | 0 | 0 | 0 | 0 | **CASCADE — xoá im lặng** |
| `dai_bdm_doi_ung.dich_nhom` | **31** | 8 | **21** | **7** | **7** | 0 | **CASCADE — xoá im lặng** |
| `dai_bdm_doi_ung_cum.dang_bai_id` | 5 | 9 | 6 | 0 | 0 | 0 | CASCADE |
| `dai_bdm_kiem_mau` · `dai_bdm_tu_choi` · `hgt_bdm_kiem_mau/tu_choi` | 0 | 0 | 0 | 0 | 0 | 0 | chặn |

Chi tiết từng mã (để làm B3): `B3-doi-ung-de-xuat.md`.

## 4. Trigger trên cây (đọc thân hàm từ DB đang chạy, `pg_get_functiondef`)

| trigger | bảng · lúc | làm gì | ảnh hưởng tới ghi-cay |
|---|---|---|---|
| **`trg_bdm_chu_de_khoa_vung`** → `_trg_bdm_chu_de_khoa_vung` | `dai_bdm_chu_de` BEFORE INSERT / UPDATE OF `nhanh` | (1) **chặn** `nhanh` = `hinh_hoc`/`hinh_luyen` (đã gộp thành `hinh`); (2) **chặn đổi vùng** (`nhanh`) của chủ đề đã có nội dung (`_bdm_chu_de_co_noi_dung`). KHÔNG chặn sửa tên, KHÔNG chặn thêm chuyên đề/nhóm/dạng, KHÔNG chặn xoá. | Không kích hoạt — script không đụng `dai_bdm_chu_de`. |
| `trg_bdm_*_log` → `_bdm_ghi_log` (security definer) | chu_de · chuyen_de · o · nhom · dang_bai, AFTER I/U/D | ghi `dai_bdm_log(bang, khoa, them/sua/xoa, cu, moi, actor=jwt_uid())`; UPDATE chỉ đổi `updated_at` thì bỏ qua | Mỗi dòng chèn = 1 dòng log `them` (actor NULL khi chạy script). |
| `trg_bdm_*_thu_tu` → `_bdm_thu_tu` | chu_de · o · nhom · dang_bai, BEFORE INSERT | `thu_tu` NULL ⇒ max+1 trong cha | Cây mới xếp SAU cây cũ cho tới B5. |
| `trg_bdm_dang_bai_bump` → `_bdm_bump_nhom` | dang_bai AFTER I/U/D | bump `updated_at` nhóm cha | Chèn dạng vào nhóm CŨ (NHTP/PPTD) bump 3 nhóm cũ (log bỏ qua). |
| `trg_bdm_*_touch` → `_bdm_touch` | BEFORE UPDATE | `updated_at = now()` | — |
| `trg_bdm_nhom_tien_de_cung_o` (constraint, deferred) | nhom AFTER UPDATE OF chu_de_id, chuyen_de_id | chặn chuyển nhóm có mũi tên tiền đề sang ô khác | Không kích hoạt (chỉ INSERT). |

Không trigger nào gọi mạng (pg_net/http) hay đổi bảng khác ngoài `dai_bdm_log` / `dai_bdm_nhom.updated_at`. Ràng buộc: `ten` khác rỗng (cả 3 bảng), `muc_do` 1–5 hoặc NULL, `bac_toi_thieu` ∈ S/A/B/C/D hoặc NULL; không có UNIQUE theo tên.
