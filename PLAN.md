# PLAN — Hệ Vận hành Ops (theo `BKDEMY_OPS_SPEC_DETAIL.md`)

> PHA 0 (khảo sát) đã xong — verify DB thật (`schema.md` + query trực tiếp) + đọc code thật, KHÔNG đoán tên cột.
> Bản này để Thùy duyệt trước khi code (theo đúng kỷ luật cuối spec). Chưa đụng dòng code/migration nào cho 4 story.

---

## 0. Reuse map (đã verify)

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| TKB (`thoi_khoa_bieu`) | ✅ có sẵn | cột thật: `lop_id, thu, gio_bat_dau, gio_ket_thuc, phong, hieu_luc_tu, hieu_luc_den`. **`gio_ket_thuc` = giờ tan gốc** (không có cột "giờ tan" riêng, đúng nó). `phong` nullable, gắn **SLOT TKB**, không gắn `lop` (lớp không có cột phòng — đúng, vì 1 lớp có thể đổi phòng theo buổi). |
| Buổi/điểm danh (`buoi_hoc`, `buoi_hoc_hs`) | ✅ có sẵn | `buoi_hoc` có `gio_bat_dau/gio_ket_thuc/phong` (snapshot từ TKB lúc mở) + các cột `*_dong_at` (ingame/et/danh_gia/btvn). `buoiAoCuaNgay()` cho buổi **ẢO** (chưa mở) — dùng được cho task Report (phải tồn tại TRƯỚC khi ai "mở buổi"). |
| Task engine (`gami.ts`) | ✅ có, MỞ RỘNG ĐƯỢC | `TabKey`/`MyTask`/`StaffTaskRow`/`getMyTasks`/`listAllStaffTasks` — hiện chỉ có vai `gv|tg`, nguồn = `phan_cong_lop`. Cần thêm vai `ops` + nguồn mới (xem mục A). |
| Duyệt chất lượng (`viec_van_hanh_duyet`) | ✅ có, cần NỚI CHECK | Khoá `(buoi_hoc_id, tab, nhan_su_id)` — khớp thẳng "1 người × 1 ca × 1 loại việc". Cột `tab` có **CHECK constraint** `in ('danhgia','ingame','et','btvn')` (migration 0081) → **PHẢI nới** khi thêm tab mới, cùng 1 migration (bài học HANDOFF §②, đừng quên như vụ 0045). Công thức `tinhHieuSuat`/`deXuatTienDo`/`duyetHangLoat` (`src/lib/vanhanh.ts`) DÙNG THẲNG được, không sửa. |
| ETPrintView | ⚠ có layout, THIẾU QR/markers/lưới-OMR | `src/screens/tailieu/ETPrintView.tsx` — bảng chấm hiện tại chỉ có ô trắng để GV khoanh tay (`pv-et-score`), KHÔNG QR, KHÔNG fiducial marker, KHÔNG lưới Đ/C/S 3-ô. Phải thêm mới hoàn toàn. |
| Mastery feed | ✅ có, đúng model spec cần | `src/lib/mastery.ts` đọc `gami_grades`(ingame/et)+`buoi_danh_gia_dang`+`bai_lam_cau` → feed **CHỈ khi ET đóng** (khớp "feed mastery CHỈ khi TA đóng ET" của spec — không cần sửa gì, chỉ cần Story 4 ghi đúng vào `gami_grades` giống luồng chấm tay hiện tại). |
| Storage | ✅ có 3 bucket, pattern rõ | `avatars` · `kho-anh` (ảnh, có prefix `report/` cho bao lỗi — `uploadReportAnh()` ở `baoloi.ts`) · `kho-tailieu` (file PDF/Word). **Đủ dùng** cho evidence Story 1-3 (ảnh) và PDF scan Story 4 (dùng `kho-tailieu` hoặc bucket mới `et-scan` — xem câu hỏi). |
| Engine hiệu suất | ✅ có, dùng thẳng | `tinhHieuSuat = chất_lượng − (100 − tiến_độ)`, 4 mức trễ giờ (`TIEN_DO_TIERS`), `duyetHangLoat`/`duyetMot`. Không cần code lại. |
| Phân công CA Ops | ❌ CHƯA CÓ | `phan_cong_lop` chỉ gán GV/TA dài hạn theo LỚP (`vai_tro: 'gv'|'tg'`) — không có "ai trực ca này". Grep `ca_truc|truc_ops|phan_cong_ca` → 0 kết quả. **Đây là spine phải dựng trước** (xem mục A). |
| Leaf/nav Ops | ❌ CHƯA CÓ | `adminLeaves` (fixtures.ts) chưa có `report`/`prep`/`scan_et`. Cần thêm leaf mới nhóm "Vận hành". |
| Server compute | ❌ KHÔNG TỒN TẠI trong dự án | Không có `supabase/functions` (Edge Function), không cron worker — **100% chạy client-side** (kể cả gọi Gemini hiện tại cũng chạy từ browser). Việc này va chạm trực tiếp với yêu cầu Story 4 "luồng hệ tự động, chạy được trong đêm" — xem câu hỏi §Q6, đây là quyết định kiến trúc lớn nhất của cả spec. |
| Dep image/QR | ❌ CHƯA CÓ | package.json chỉ có `pdfjs-dist` (đang dùng cho PdfCropper). Chưa có lib sinh QR (`qrcode`), đọc QR (`jsqr`), hay xử lý ảnh (opencv/jimp). Cần thêm dep mới cho Story 4. |

---

## A. SPINE — Phân công CA trực Ops (§B spec) — ✅ CHỐT (Thùy 07-06)

**Quyết định:** pure-derive THUẦN, KHÔNG đóng băng tuần, KHÔNG bảng ngoại lệ riêng. 1 bảng DUY NHẤT, effective-dated y hệt TKB — sửa trực tiếp khi cần swap (đổi ca 1 lần thì tự đóng dòng cũ/mở dòng mới sớm rồi mở lại dòng gốc sau — Thùy chấp nhận phải tự "reset" lại 1 lần khi hết đợt swap, đổi lấy việc KHÔNG cần dựng thêm bảng tuần/ngoại lệ).

**Schema:**
```
phan_cong_ops        -- pure-derive, effective-dated y hệt TKB
  id            uuid PK
  tkb_id        uuid FK→thoi_khoa_bieu.id
  nhan_su_id    uuid FK→nhan_su.id
  hieu_luc_tu   date
  hieu_luc_den  date NULL
```
- Sửa = đóng dòng cũ (set `hieu_luc_den`) + mở dòng mới — KHÔNG đè (giống sửa TKB).
- Ca trực của 1 (tkb_id, ngày) = dòng có `hieu_luc_tu <= ngày AND (hieu_luc_den is null OR hieu_luc_den >= ngày)`.
- Ca trống = TKB slot không có dòng hiệu lực tại ngày đó → derive được, không cần cột cờ.

---

## A.1 ⚠ Sửa lại thiết kế evidence Report/Tan (phát hiện lúc code, KHÁC bản PLAN gốc)

Bản PLAN gốc định thêm cột `report_dong_at/report_anh_url/tan_dong_at/tan_anh_url` thẳng vào `buoi_hoc` — **SAI**, vì Report phải tồn tại & đóng được **TRƯỚC KHI buổi "mở"** (report gửi tối hôm trước; buổi chỉ mở lúc vào học/điểm danh) → lúc đó **CHƯA CÓ dòng `buoi_hoc`** để gắn cột vào (chỉ có buổi ẢO từ `buoiAoCuaNgay`). Ép mở buổi sớm để có chỗ lưu sẽ đẻ tác dụng phụ (roster/GV snapshot sớm, buổi hiện "đang mở" trước khi thực sự diễn ra).

**Sửa: 1 bảng tự-chứa riêng, khoá theo (tkb_id, ngày, loại việc) — KHÔNG phụ thuộc buoi_hoc tồn tại:**
```
vh_ops_task
  id          uuid PK
  tkb_id      uuid FK→thoi_khoa_bieu.id
  ngay        date
  tab         text check (tab in ('report','tan'))
  nhan_su_id  uuid FK→nhan_su.id      -- người đóng (snapshot — dù phân công gốc đổi sau vẫn giữ đúng ai đã làm)
  anh_url     text
  dong_at     timestamptz
  chat_luong  numeric default 100     -- tự-chứa duyệt (KHÔNG reuse viec_van_hanh_duyet — bảng đó bắt buộc buoi_hoc_id not null)
  nguoi_duyet uuid FK→nhan_su.id
  duyet_at    timestamptz
  created_at  timestamptz default now()
  unique (tkb_id, ngay, tab)
```
Công thức `tinhHieuSuat`/`deXuatTienDo` (`vanhanh.ts`) vẫn TÁI DÙNG nguyên (chỉ là hàm thuần nhận số, không đụng bảng) — chỉ khác NƠI LƯU kết quả duyệt.

---

## B. Story 1 (Report) + Story 2 (Báo tan) — ✅ CHỐT

Dùng bảng `vh_ops_task` (mục A.1) — KHÔNG đụng `buoi_hoc`, KHÔNG reuse `viec_van_hanh_duyet` (tự chứa duyệt trong chính bảng).

**Deadline (Thùy chốt 07-06):**
- Report = **mốc giờ cố định 20:00 ngày hôm trước** (bất kể ca học mấy giờ — KHÔNG trừ ngược N-tiếng-trước-giờ-học).
- Tan = `gio_ket_thuc` (của TKB slot) `+ 15'`.

**Code:**
- File mới `src/lib/opsvanhanh.ts` (KHÔNG nhét vào `gami.ts` — nguồn dữ liệu khác hẳn `phan_cong_lop`, tách file cho rõ ranh giới, giống cách `botro.ts`/`tuyensinh.ts` tách riêng).
- `getMyOpsTasks()` — đọc `phan_cong_ops` (ai trực TKB slot nào) × `buoiAoCuaKhoang`/derive theo ngày → sinh 2 task report/tan mỗi (tkb_id, ngày), tra `vh_ops_task` xem đã đóng chưa.
- `buildReportMessage(slot, ngay)` — hàm thuần, render câu nhắc từ TKB (lớp, thứ, ngày, giờ) — ví dụ y hệt spec.
- `dongOpsTask(tkbId, ngay, tab, anhUrl)` — ghi `vh_ops_task` (upsert, chặn nếu thiếu `anh_url`).
- `duyetOpsTask`/`duyetOpsHangLoat` — copy công thức từ `vanhanh.ts` (`tinhHieuSuat`/`deXuatTienDo`) nhưng ghi vào `vh_ops_task` thay vì `viec_van_hanh_duyet`.

**Màn hình:** 1 leaf mới `ops_report` (Vận hành) — list task report/tan theo tuần (Ops) + tab Leader duyệt. **KHÔNG nhét vào "Việc của tôi"/`TaskCard` hiện tại ở bước này** (`TaskCard`/`MyTask` gắn chặt với `buoi_hoc`/vai gv-tg — nhét ép sẽ đụng nhiều chỗ). Có thể fast-follow sau khi 3 story chạy ổn.

---

## C. Story 3 (Prep) — ✅ CHỐT (đơn giản hoá theo Thùy 07-06)

**Không cần thuật toán gộp-theo-khoảng-cách-phút.** Chốt: dọn phòng chỉ **1 lần/ngày thường** (bao nhiêu ca trong buổi tối cũng chỉ 1 lượt) · **2 lần T7/CN** (1 lượt sáng + 1 lượt chiều, ranh giới = mốc 12:00 của TKB — sáng là các band kết thúc ≤12:00, chiều là band bắt đầu ≥12:00).

**Schema:**
```
prep_phong
  id              uuid PK
  phong           text            -- 1 trong 6 phòng cố định (P101…P302, đã có ở TKBScreen)
  ngay            date
  luot            text            -- 'ngay' (thứ 2-6, 1 lượt/ngày) | 'sang' | 'chieu' (T7/CN)
  nhan_su_id      uuid  NULL FK→nhan_su.id   -- ai trực dọn (từ phan_cong_ops, slot đầu lượt)
  don_phong       boolean not null default false
  chuan_bi_kit    boolean not null default false
  anh_url         text
  dong_at         timestamptz
  gv_diem_nen     numeric default 100        -- GV dùng phòng chấm (điểm nền − lỗi)
  gv_ghi_chu      text
  gv_cham_at      timestamptz
  leader_chot_at  timestamptz                -- leader chốt cuối (giữ GV bận quên vẫn chốt được)
  created_at      timestamptz not null default now()
  unique (phong, ngay, luot)
```
**Suy "lượt":** hàm thuần `luotPrepCuaNgay(phong, ngay)` — quét TKB slot hiệu lực tại `ngay` có `phong` này; T2-T6 → 1 lượt `'ngay'` (ca sớm nhất = mốc cửa); T7/CN → tách 2 nhóm theo mốc 12:00 (band kết thúc ≤12:00 = `'sang'`, band bắt đầu ≥12:00 = `'chieu'`), mỗi nhóm có ca sớm nhất riêng.

**Cửa thời gian:** `[giờ_ca_đầu − 60', giờ_ca_đầu − 30']` (thường), T7/CN biên 15'. Validate ở tầng service (constant chỉnh được như `NGUONG_DEADLINE`), CHẶN cứng nếu đóng sớm hơn cửa dưới.

**Màn hình:** 1 leaf mới `prep` (Vận hành) — task card (checklist 2 ô + upload + nút đóng có kiểm cửa giờ), tab GV chấm phòng (nhận xét/điểm khi đến lớp), leader chốt cuối.

---

## D. Story 4 (Scan ET) — ⏸ GÁC LẠI (Thùy 07-06: làm story khác trước; "ET chỉ thay TA 1 bước nhập liệu" → khi quay lại làm GỌN, đừng over-engineer dashboard accuracy/confidence-tier ngay từ đầu). Giữ nguyên phần khảo sát dưới đây để tham khảo khi quay lại, KHÔNG code phần này bây giờ.

### D.1 In ấn (ETPrintView)
Thêm vào `src/screens/tailieu/ETPrintView.tsx`:
- **QR** mã hoá `{buoi_hoc_id, hoc_sinh_id, ma_de}` — render ảnh QR bằng lib mới (`qrcode`, SVG data-URI — theo đúng pattern data-URI đã dùng cho wave-header trong `buildPagedCss`, an toàn với paged.js rewrite `url()`).
- **Fiducial markers** 4 góc tờ (ô vuông/tròn đen cố định vị trí — dùng để nắn ảnh sau scan).
- **Lưới OMR thật** thay bảng ô-trắng hiện tại: mỗi câu 3 ô tròn Đ/C/S kích thước+khoảng-cách CỐ ĐỊNH (bắt buộc để đo toạ độ ổn định). Tự bẻ hàng ≤6 câu/hàng · >6 → 2 hàng (theo đúng số spec).

### D.2 Luồng Ops (upload)
- Ops scan cả lớp → 1 PDF → upload thẳng ERP (bucket `kho-tailieu` hoặc bucket mới `et-scan` — câu hỏi Q7).
- File hợp lệ = evidence (không cần ảnh riêng).

### D.3 Pipeline đọc (⚠ QUYẾT ĐỊNH KIẾN TRÚC LỚN NHẤT — xem câu hỏi Q6)
Cần: tách PDF→trang (pdfjs-dist, đã có) → đọc QR (`jsqr`, dep mới) → nắn theo fiducial marker (tự viết phép biến đổi phối cảnh 4-điểm, chưa có lib nào trong dự án làm việc này) → đo mật độ mực 3 ô/câu (canvas, không cần lib) → confidence gate → AI vision cho ô lưỡng lự (tái dùng `callGeminiRich` pattern có sẵn).

**Vấn đề:** dự án hiện **100% client-side** (không Edge Function, không cron/worker nào tồn tại) — mọi xử lý AI/ảnh hiện tại (PdfCropper, ingest kho) chạy ngay trong tab trình duyệt của người dùng lúc đó. Spec Story 4 lại viết rõ: *"Luồng hệ (tự động, chạy được trong đêm — gỡ nút 'TA về muộn')"* — nghĩa là xử lý phải chạy **độc lập với việc ai đó có mở trình duyệt hay không**. 2 việc này MÂU THUẪN nếu làm client-side thuần. Cần Thùy quyết hướng (câu hỏi Q6) — đây là điểm tôi KHÔNG tự chọn vì đổi cả kiến trúc hạ tầng (thêm Edge Function/worker lần đầu tiên trong dự án).

### D.4 Schema đề xuất (accuracy + log sửa)
```
et_scan
  id                uuid PK
  buoi_hoc_id       uuid FK→buoi_hoc.id
  file_url          text
  uploaded_by       uuid FK→nhan_su.id
  uploaded_at       timestamptz
  so_trang          int
  trang_thai        text  -- 'dang_xu_ly' | 'da_doc' | 'loi'

et_scan_trang       -- 1 dòng / 1 trang giấy
  id            uuid PK
  et_scan_id    uuid FK→et_scan.id
  trang_so      int
  hoc_sinh_id   uuid NULL FK→hoc_sinh.id   -- null nếu QR không đọc được → flag nhập tay
  qr_doc_duoc   boolean

et_scan_o           -- 1 dòng / 1 Ô (câu × HS) — hạt nhân đo accuracy
  id             uuid PK
  et_scan_trang_id uuid FK→et_scan_trang.id
  ma_cau         text
  gia_tri_may    text  -- 'dung'|'chinh'|'sai'|null (kết quả OMR/AI trước khi người sửa)
  nguon          text  -- 'omr'|'ai'|'nguoi'
  confidence     numeric
  gia_tri_cuoi   text  -- sau khi TA duyệt (null nếu TA chưa mở ET)
  da_sua         boolean not null default false   -- TA có sửa so với gia_tri_may không (= mẫu số accuracy)
  sua_boi        uuid NULL FK→nhan_su.id
  sua_luc        timestamptz
```
`accuracy = (số ô da_sua=false) / (tổng số ô)`, TÁCH riêng theo `confidence` cao/thấp (đúng công thức spec §Đo-accuracy). Feed `gami_grades` thật (Đ/C/S→1/0.5/0) **CHỈ** khi TA bấm "Đóng ET" — dùng `gia_tri_cuoi`, không phải `gia_tri_may`.

### D.5 Kỷ luật đầu vào
"Sửa sạch không phạt / dập xoá bẩn bị phạt" — chấm ở tầng viec_van_hanh_duyet (TA chấm ET giấy là 1 task nghiệp vụ RIÊNG với report/tan/prep — có `nguoi_cham_giay` + `gv_diem_nen − loi`), câu hỏi Q8 (ai chấm việc TA chấm giấy, theo cây tổ chức hay theo lớp?).

---

## E. File dự kiến tạo/sửa (CHỈ phạm vi build đợt này — spine + Story 1/2/3; Story 4 gác lại)

**Migration mới:**
- `0084_phan_cong_ops.sql` — bảng `phan_cong_ops` (mục A).
- `0085_vh_ops_task.sql` — bảng `vh_ops_task` (mục A.1, Story 1+2).
- `0086_prep_phong.sql` — bảng `prep_phong` (mục C, Story 3).

**Lib mới/sửa:**
- `src/lib/opsvanhanh.ts` (mới) — phân công ca (CRUD `phan_cong_ops`), message report động, `getMyOpsTasks`/`dongOpsTask`/duyệt (Story 1+2), luồng prep (`luotPrepCuaNgay`/CRUD `prep_phong`, Story 3). 1 file cho cả 3 story (cùng domain "Ops vận hành", tách khỏi `gami.ts` vì nguồn dữ liệu khác `phan_cong_lop`).
- KHÔNG đụng `gami.ts`/`TabKey`/`MyTask` (quyết định B — không nhét vai `ops` vào engine gv/tg hiện tại ở bước này).

**Screen mới (nhóm nav "Vận hành"):**
- `src/screens/vanhanhops/OpsReportScreen.tsx` (leaf `ops_report`) — Story 1+2: list report/tan theo tuần + tab Leader duyệt.
- `src/screens/vanhanhops/PrepScreen.tsx` (leaf `prep`) — Story 3: checklist+ảnh+đóng, tab GV chấm phòng, leader chốt.
- `src/screens/vanhanhops/PhanCongOpsScreen.tsx` (leaf `phancong_ops`) — quản `phan_cong_ops` (gán người trực từng slot TKB). **Tách màn riêng** (không nhét vào `PhanCongScreen.tsx` có sẵn — mô hình khác hẳn: ca×người vs lớp×vai_trò, nhét chung dễ rối 2 mental model).

**fixtures.ts:** thêm 3 leaf `ops_report`, `prep`, `phancong_ops` vào nhóm "Vận hành".

**RLS:** theo đúng default dự án + note spec — `staffs ENABLE` (member-gate `la_thanh_vien()`, cùng pattern mọi bảng mới gần đây), không ngoại lệ.

---

## F. Còn mở (không chặn code, quyết khi đụng tới)

- Story 4 (Scan ET): toàn bộ câu hỏi kiến trúc (bucket riêng, pipeline QR/OMR chạy đâu, TA-chấm-giấy có phải task riêng không) — **để khi quay lại Story 4**, không cần trả lời bây giờ.
- Tích hợp report/tan/prep vào "Việc của tôi" (`TaskCard` hiện tại) — fast-follow sau khi 3 leaf mới chạy ổn, nếu Thùy muốn gộp 1 chỗ thay vì 3 leaf riêng.

---

## G. Thứ tự build (ĐANG LÀM)

1. **A — Phân công Ops** (bảng + lib CRUD + màn `PhanCongOpsScreen`) — spine.
2. **Story 1+2 (Report/Tan)** — bảng `vh_ops_task` + lib + màn `OpsReportScreen`.
3. **Story 3 (Prep)** — bảng `prep_phong` + lib + màn `PrepScreen`.

Mỗi bước: implement → `tsc` sạch → tự review đối chiếu spec → commit → append `DEVLOG.md` → sang bước tiếp (đúng "VÒNG LÀM" cuối spec). Story 4 KHÔNG nằm trong đợt build này.
