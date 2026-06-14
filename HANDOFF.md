# HANDOFF — Kho (Bản đồ kiến thức) · BKdemy ERP v2

> Bản chuẩn để tiếp tục ở máy khác / session mới (không còn context chat). **Đọc nguyên file trước khi code.**
> 2 mục: **① Trạng thái hiện tại** (sự thật current) · **② Bài học còn hiệu lực** (đừng đạp lại).
> Nhật ký THÔ từng ngày ở **`DEVLOG.md`** — KHÔNG cần đọc khi làm, chỉ để truy lại / tổng hợp lại nếu bản này sai.
> *Quy tắc (CLAUDE.md §0): trong ngày chỉ APPEND `DEVLOG.md`; **CUỐI NGÀY** mới distill durable lên ①②, prune stale. Không append-chồng "STALE".*

---

## ① TRẠNG THÁI HIỆN TẠI

### Kiến trúc & file chính
- Kho = lá `bdkt` trong cây Admin → `src/screens/kho/KhoScreen.tsx`. Build **THẬT, wire Supabase DB v2** (ngoại lệ so với mock-first của shell — vì schema Kho đã đông cứng).
- **Seam:** UI KHÔNG gọi `supabase` trực tiếp, chỉ qua `src/lib/kho/api.ts`.
- `api.ts` (data-layer) · `KhoScreen.tsx` (tab Đại/Hình + khối) · `BanDo.tsx` (duyệt cây + modal dạng + lý thuyết) · `DangHub.tsx` (kho câu hỏi per-dạng + AI import) · `ui.tsx` (MathText/KaTeX + primitives) · `branches.ts` (config Đại/Hình) · `AdminScreen.tsx` · `App.tsx` (auth gate) · `auth/Login.tsx`.
- **Làm tài liệu**: `src/lib/tailieu.ts` (data-layer) · `src/screens/tailieu/` — `TaiLieuScreen` (thư viện) · `TaiLieuBuilder` (config/builder) · `PrintView` (xuất PDF). Lá Admin `lamtailieu`. Logo: `public/Logo.png`.
- **Nhân sự/Lớp/HS (khối STATIC)**: `src/lib/nhansu.ts` (data-layer seam) · `src/screens/nhansu/` — `NhanSuScreen` · `LopScreen` · `HocSinhScreen` · `OrgChartScreen`. Lá Admin `ns` / `lop` / `hs` / `orgchart`(founderOnly).

### Đã build (nhánh ĐẠI)
- **Bản đồ**: Chủ đề → Chuyên đề (card) → zoom Dạng (card + filter bậc/độ khó toggle). CRUD dạng thật, mã vị trí gợi ý sửa được.
- **Kho câu hỏi per-dạng** (`DangHub`): **Clone biến thể** + **Nhập chuỗi câu**; method Auto (ảnh/PDF→Gemini) / Manual (dán JSON) / Văn bản (parser). Trắc nghiệm 4 PA. Review 1-câu (Trước/Sau), layout đề+đáp án | lời giải. Sửa câu = preview + ✎.
- **Lý thuyết** (text+LaTeX, render như bài tập — KHÔNG phải file): editor popup to, upload ảnh/PDF → **AI bóc LaTeX**, trái code / phải preview. Cho **dạng** lẫn **chuyên đề**. Lý thuyết chuyên đề có **3 trạng thái: Có / Chưa / Không cần** (cờ `khong_can`); "không cần" loại khỏi tính %.
- **Badge % hoàn thành**: vòng tròn tiến độ (góc card chuyên đề) + pill (chủ đề/header), **5 thang màu**. % = câu(cap chuẩn) 70% + lý thuyết dạng 30%, gộp trục lý thuyết chuyên đề (Có=1/Chưa=0/Không-cần=loại). → liếc thấy chỗ thiếu.
- **Ảnh & file → Supabase Storage** (bucket `kho-anh` ảnh, `kho-tailieu` file đính kèm); DB lưu URL. Nút 📋 Dán clipboard + chọn file.
- **Auth + RLS**: đăng nhập Supabase Auth (email/pass); RLS toàn bộ bảng, chỉ `authenticated`.
- **Làm tài liệu (giáo trình)** — tài liệu = **THAM CHIẾU** vào kho (xuất mới snapshot). Tạo (tên+khối) → **Builder**: **cây cấu trúc bên trái** (Chuyên đề→Dạng→BTVN, click nhảy tới) · **+ Thêm chuyên đề (NHIỀU cái gộp)** · mỗi dạng có số-câu-theo-loại (khớp setting) + Gợi-ý-lại + chọn câu từ kho (KhoPicker **có filter loại toggle**) + ↑↓ + **✕ xoá dạng**, BTVN cuối · setting chrome (header/footer/watermark/màu).
- **Xuất PDF = paged.js** (`PrintView`): **preview = bản in** (phân trang A4 thật). Engine `new Previewer().preview(html,[cssBlobUrl],dst)`; Doc render ẩn `pv-src` → trang ra `pv-pages`. **Header/footer dải sóng full-bleed SÁT mép, lặp mọi trang** (qua `::before/::after` của `.pagedjs_pagebox`, data-URI SVG) · **logo góc trái header trên chip trắng** · **số trang** (`@page{@bottom-right{counter(page)/counter(pages)}}`) · **font Times New Roman 17px ≈ 13pt sách in** + KaTeX `0.95em` (Thùy chốt 06-11) · 2 bản **HS/GV**. Ngắt trang: lý thuyết tách **khối theo dòng trống** (`break-inside:avoid`), tiêu đề `break-after:avoid`, câu không xé. **In đậm nhãn** (Ví dụ/Quy tắc…) + `**markdown**` qua MathText.
- **Thư viện tài liệu**: filter "Tất cả"/khối + search tên + sort + ngày tạo/sửa (giờ VN) + `created_by` (uuid auth — app set lúc tạo; hiển thị TÊN chờ map `tai_khoan`→`nhan_su`).
- **Deploy**: Vercel project v2, nhánh `main` → `bkdemy-erp-v2.vercel.app`.

### Đã build (NHÂN SỰ + LỚP + HỌC SINH — khối STATIC, 06-11)
- **Thiết kế 2 trục độc lập (Thùy chốt):** NGHIỆP VỤ = 6 team (`gv ta ops hoc_thuat media marketing`), mỗi team 1 cây riêng × PHẠM VI = GV/TA theo lớp (`phan_cong_lop`); 4 team kia phase này toàn hệ. Sơ đồ dùng THẬT cho luồng đánh giá/báo cáo sau. Lọc quyền = **cách B** (filter ở query như V1), schema chừa đường siết RLS sau.
- **⭐ MODEL TỔ CHỨC = VỊ TRÍ là xương sống (Thùy chốt, ĐÃ ĐẢO 1 lần):** bảng `vi_tri` — cây = **cha_id giữa các VỊ TRÍ** (không phải giữa người); `nhan_su_id` = người đang đảm nhiệm, **NULL = vị trí trống vẫn hiện trên sơ đồ**. Luồng: **vị trí sinh vị trí → mới đặt người vào**. 1 người nhiều vị trí kể cả CÙNG team (Trang = Trưởng khối THCS + Trưởng khối THPT = 2 thẻ). Người đi vị trí còn (xoá NS → set null). `thanh_vien_team` ĐÃ DROP (0022) — đừng tham chiếu. **Wording UI: "VỊ TRÍ" (cấm "ghế")**; level = Trưởng/Phó/Thành viên (`cap`), scope = TÊN vị trí ("Quản lý khối THCS").
- **STATIC vs DYNAMIC (Thùy):** HS/NS/lớp/TKB/phân công = dữ liệu GỐC (làm rồi); session/điểm danh/chấm = ĐỘNG, chỉ sinh khi có hoạt động (chưa làm). **TKB = khung lặp tuần effective-dated** (`hieu_luc_tu/den`; sửa = đóng dòng cũ + mở dòng mới, KHÔNG đè) → **session pure-derive** từ TKB-đang-hiệu-lực (không cron đẻ dòng; đổi TKB tương lai tự lan; buổi có hoạt động mới đông cứng thành dòng).
- **Band năng lực MỊN** `muc_nang_luc` 12 mức = S/A/B/C × 3, **mức 1 = XỊN NHẤT** (S1 đỉnh `thu_tu`=12 … C3=1), cột `bac` roll-up về `lop_bac` (Kho không đổi). **Band per-MÔN** ở `hoc_sinh_lop.muc_nang_luc_id`. `lop.bac` = bậc thô của lớp.
- **Phụ huynh = thực thể** (`phu_huynh`, `ma_ph` PH0001 tự sinh) — 1 PH nhiều con qua `hoc_sinh.phu_huynh_id` (nền thu học phí + tài khoản PH).
- **Mã đề-xuất-sửa-được:** form hiện sẵn mã kế tiếp (max+1: NS001/HS0001) qua `suggestMaNS/HS`, user sửa được; DB default sequence làm lưới.
- **Màn hình:** `NhanSuScreen` (bảng + form CHỈ thông tin người + ảnh → bucket `avatars`; team suy từ vị trí — KHÔNG gán team/phân cấp ở đây) · `LopScreen` (card → detail hub: phân công GV/TG + TKB + sĩ số/band) · `HocSinhScreen` (modal to 2 cột: trái thông tin + ảnh + PhuHuynhPicker, phải **bảng Lớp & band THEO MÔN** kiểu V1 — môn data-driven, "không học" = rời giữ lịch sử) · `OrgChartScreen` (CÂY VỊ TRÍ thẻ bài dọc 128px có ảnh + dây nối CSS; "+ Vị trí gốc" → click thẻ → tên/cấp/vị-trí-cha/"+ Vị trí con"/Người đảm nhiệm; trống = viền đứt; chặn vòng descendant).
- **Luồng nhập HS×lớp:** HS mới → màn Học sinh (Tạo & xếp lớp 1 nhịp); sĩ số đầu kỳ → màn Lớp; 2 lối cùng ghi `hoc_sinh_lop` (upsert idempotent).

### Đã build thêm (06-12)
- **Import V1 (data thật 2025-26) + lên lớp 2026-27:** `scripts/import_v1.mjs` (327 HS·46 lớp·277 PH·369 ghi danh; band Upper/Inter/Lower→X1/X2/X3, T→S1) · `import_v1_tkb.mjs` (76 ca) · `len_lop_2026.mjs` (K12→tot_nghiep, khác khoi+1, lớp đổi tên 8A1→9A1; **1 lần/đầu năm, guard chống chạy lại**). Scripts idempotent.
- **Ghi danh chuẩn (§1.5+§4):** `hoc_sinh_lop.ngay_vao/ngay_roi` = cổng thời gian data học tập. **TRIGGER `hoc_sinh_lop_log`** tự ghi vết (actor+ts+cũ/mới) mọi ghi_danh/rời/đổi band. Add lớp **chỉ HS chưa có lớp môn đó** (`listHSChuaCoLopMon`); đã có → **chuyển lớp** (`chuyenLop`=rời+vào, log 2 sự kiện).
- **Khai giảng = `lop.ngay_khai_giang`** (thuộc tính LỚP, KHÁC `tkb.hieu_luc_tu`). **Luật suy buổi: `ngày ≥ lop.ngay_khai_giang AND slot TKB hiệu lực tại ngày`.** Lớp chưa khai giảng → session pure-derive tự ko sinh, KHÔNG cần hủy tay. (K9/K12=16/6, khác=1/7.)
- **Màn TKB** (`TKBScreen`, leaf `tkb`): lịch tuần KHUNG-LỚN-cố-định (7 khung, ẩn 12-14 khi rỗng), ca xếp theo GIỜ BẮT ĐẦU, mỗi ô lưới 6 phòng cố định, gọn 1 màn. Sửa giờ/phòng/hiệu-lực + ngừng ca (đóng hieu_luc_den).
- **Màn Lớp:** 4 KHU theo môn (Toán→Văn→Anh→KHTN), sort S→A→B→C, chip màu = HỆ.
- **Tài khoản & login:** RLS member-gate (mig 0026 — chỉ thành viên vào) · cấp TK trên web (`capTaiKhoan` client phụ) · `HoSoModal` (👤, NS tự sửa ảnh/SĐT/email) · **dev quick-login** (`VITE_DEV_ACCOUNTS` trong `.env.local`, chỉ hiện DEV). Avatar HS (mig 0023). Mã NS/HS/PH = đề-xuất-max+1-sửa-được.
- **⭐ SCOPE ENGINE `getMyScope` — gốc rễ "ai thấy task nào" (ABAC):** task mang nhãn (loại việc×lớp); khớp **① OWNER** (phan_cong_lop: gv→đánh giá/nội dung·tg→chấm·OPS→điểm danh toàn hệ) + **② GIÁM SÁT** (cây vị trí, **2 tầng span-of-control**: trực tiếp=view mặc định · gián tiếp=passive). **Quyền QL từ GHẾ, KHÔNG từ vai** (GV "đến dạy rồi về" quản lý 0 người). **2 trục tách:** A=task-scope (engine này) · B=data-scope (GV xem dashboard lớp mình — độc lập, dựng cùng dashboard). Panel "Phạm vi việc của tôi" trong HoSoModal.
- **Màn PHÂN CÔNG (`PhanCongScreen`, leaf `phancong`):** ma trận hàng=lớp, cột=GV chính/phụ·TG·điểm danh. Gán theo VAI (**TG ôm TOÀN BỘ chấm 1 lớp**, ko tách task). Ghi `phan_cong_lop` (cùng seam màn Lớp — 1 sự thật 2 cửa). 1 GV chính+≤1 phụ; thiếu→ô đỏ; ( )=tải.

### Chưa làm
- **⚠ NGAY:** bucket `avatars` **chưa tạo** — paste `supabase/migrations/0020_storage_avatars.sql` vào Dashboard → SQL Editor (claude_build không đụng storage). Chưa chạy thì upload ảnh NS lỗi "bucket not found".
- **Nợ khối nhân sự (trước khi vận hành thật):** trigger ghi-log lịch sử §4 (đổi band/phân công/TKB/membership chưa có vết — timeline tiến bộ HS cần nó) · màn Phụ huynh riêng (list PH + các con) · hiện tên người tạo tài liệu (map `tai_khoan`→`nhan_su`) · import HS/NS từ V1 · siết RLS theo phạm vi (cách A).
- **Làm tài liệu — còn lại**: header/footer/watermark **chọn nhiều mẫu** (mới 1 dải sóng — muốn thêm: Thùy gửi ảnh mẫu, code thành 1 option; nên tách registry khi có mẫu #2) · reorder câu trong dạng · áp `cau_hinh.mau` cho dải sóng · gu B (học thuật)/C (SaaS) · custom block · BTVN số-câu-theo-loại · nút "✎ Sửa lý thuyết" ngay trong Builder (Thùy chưa chốt).
- Nhánh **Hình** (tab stub "dựng sau"): cây Mảng→Loại→Dạng-hình + Bài/Ý/mô hình/bổ đề (spec §4).
- Quản lý 4 danh mục (thuộc tính/bổ đề Đại, mô hình/bổ đề Hình); gắn thuộc tính cho Dạng.
- `countCauByDang` đếm ở client → chuyển **view Postgres** khi data lớn.
- **Kho tài liệu** (video/pdf/slide tag dạng — resource library, KHÁC "Làm tài liệu"). Theme **Classroom** cho màn Nhân sự.

### 🔜 Bài tập hàng ngày (V2) — ĐANG THIẾT KẾ (chưa code, chưa đụng DB)
- **Mục tiêu**: port + nâng cấp "Daily 5T" của V1 (đọc `bkdemy-erp/src/components/student/TabDaily*`, `pages/admin/TabDaily5T`). Engine **cho MỌI khối** (không riêng 5T).
- **Chặn đã GIẢM (06-11): nền HS + lớp + band ĐÃ CÓ** (khối static). Còn thiếu: nền Đo (phép-đo HS×dạng) + bảng daily + "đã học tới dạng nào".
- **Logic Thùy chốt**: bộ câu/ngày = **50% rà-soát ngẫu nhiên + 50% luyện điểm-yếu**.
- **Logic T đã phản biện & sửa lại** (Thùy chưa duyệt bản sửa): rà-soát giới hạn **dạng ĐÃ HỌC**; "điểm yếu" = mastery thấp **+ đủ mẫu** (ít data→đẩy sang rà-soát, §5 độ tin); mỗi câu→**1 phép đo bất biến** gắn `nguon=daily`+`cham_boi`, **trust THẤP** (home/không giám sát/AI chấm — triangulate với test, đừng để "thạo giả"); rà-soát nên **spaced-repetition + uncertainty-sampling** (hơn random thuần); luyện điểm-yếu lấy **CÂU KHÁC** (chống học vẹt); 50/50 là **mục tiêu mềm**; không phát lại câu trong N ngày; cờ **daily-ready** theo dạng đủ câu.
- **⏳ ĐANG CHỜ Thùy quyết** trước khi đụng DB: "đã học tới dạng nào" lấy ở đâu — **(a)** theo lớp (lộ trình GV nhập) / **(b)** theo HS (suy từ data đo — cold-start rỗng) / **(c)** mở hết khối (T không khuyến nghị).
- **Plan 4 lớp**: ① nền HS (`hoc_sinh`+lớp/khối, import từ V1) ② nền Đo (phép-đo bất biến, mastery **suy động**, anti-NULL: chưa làm=không có dòng) ③ engine Daily (chọn 50/50 từ `dai_cau_hoi`, **chấm 3 tầng** luật→cache→AI **qua proxy**, streak) ④ báo cáo + dashboard GV (HS báo sai→GV duyệt→backfill).
- **Tái dùng từ V1** (thiết kế tốt): chấm 3 tầng + cache `accepted_answers` (unique theo đáp-án-chuẩn-hoá, càng dùng càng ít gọi AI) · `smartNormalize` (bỏ đơn vị, `1,5`→`1.5`, `1/2`→`.5`, hoán vị) · báo-sai→duyệt→backfill · streak.

### Quyết định & quy ước (đừng vô tình phá)
- **3 tầng, BỎ Chương** (Chủ đề→Chuyên đề→Dạng).
- **Bậc lớp S>A>B>C** (`bac_toi_thieu` FK `lop_bac`, thu_tu S=4…C=1): bậc THẤP NHẤT còn học dạng; lớp T học D ⟺ thu_tu(T)≥thu_tu(D). **ĐỘC LẬP `muc_do`(1–5)**. ⚠ Đừng nhầm `bac_toi_thieu` với `khoi`.
- **Mã vị trí**: Chủ đề `0701` · Chuyên đề `070101` · Dạng `07010103` · Câu `07010103001` (STT 3 số, client max+1, append-only). **Chỉ `ma_dang` là FK-target ổn định** → sửa dạng KHOÁ mã. `ma_chu_de`/`ma_chuyen_de` là denormalize — nhưng `dai_chuyen_de_ly_thuyet` GIỜ khoá theo `ma_chuyen_de` → tránh đổi mã chuyên đề đã có lý thuyết.
- **Gu UI**: Admin = SaaS/Linear (indigo, segmented, card). Nhân sự = Classroom (chưa làm). Chọn bậc/độ khó = segmented 1-click.
- **⭐ RBAC (gốc rễ "ai thấy task nào"):** task pure-derive mang nhãn (loại việc × lớp) → lọc qua `getMyScope`. **2 trục TÁCH:** (A) task-scope = ai LÀM (phan_cong_lop) / NẮM (cây vị trí, span-of-control 2 tầng) · (B) data-scope = ai XEM data (GV xem dashboard lớp mình). **Quyền quản lý đến từ GHẾ (vị trí Trưởng/Phó), KHÔNG từ vai** (GV chỉ phối hợp, quản 0 người). Loại việc gắn `phan_cong_lop.vai_tro` (gv→đánh giá/nội dung·tg→chấm·ops→điểm danh toàn hệ). **TG ôm TOÀN BỘ chấm 1 lớp** (ko tách task). Mọi màn LỌC qua engine này, KHÔNG viết lại quyền mỗi nơi.
- **Mọi hành vi HS phải ghi vết:** bảng dính HS thỏa 1 trong 2 — (a) sự-kiện append-only có hoc_sinh_id+thời điểm, HOẶC (b) trạng-thái mutable + TRIGGER log §4 (như `hoc_sinh_lop_log`). Lịch sử học tập HS = UNION các bảng sự kiện theo thời gian (KHÔNG đẻ bảng "lịch sử" riêng).
- **AI import**: 1 prompt/loại câu format-tolerant (KHÔNG multi-prompt-select). **Gemini input ưu tiên PDF** (đa trang + text layer); ảnh chỉ khi 1 trang & nét ≥300DPI; khó đọc → model Pro.

### Schema (DB live — `npm run schema` ghi `schema.md`, KHÔNG sửa tay)
- `lop_bac` (S/A/B/C, thu_tu) seeded.
- `dai_ban_do`: ma_dang(PK)·khoi·ma_chu_de/ten·ma_chuyen_de/ten·ten_dang·muc_do·bac_toi_thieu(FK)·created_at. (DROP ma_chuong.)
- `dai_cau_hoi`: ma_cau(PK)·dang_chinh·loai_cau·noi_dung·dap_an·loi_giai·lua_chon(jsonb)·anh_de·anh_dap_an·nguon·parent_ma_cau·clone_method.
- `dai_dang_ly_thuyet`: ma_dang(PK)·noi_dung·file_url?·ten_file?. `dai_chuyen_de_ly_thuyet`: ma_chuyen_de(PK)·noi_dung·file_url?·ten_file?·**khong_can**.
- **Tài liệu**: `tai_lieu`(id·loai·ten·khoi·ma_chuyen_de?·theme·**cau_hinh** jsonb) · `tai_lieu_phan`(tai_lieu_id·thu_tu·loai_phan[lt_chuyen_de|dang|btvn|custom]·ref_ma·tieu_de·noi_dung) · `tai_lieu_cau`(phan_id·ma_cau·thu_tu).
- `hinh_ban_do` (+bac_toi_thieu) + bảng Hình/danh mục như `spec-kho-v2.md`.
- **Khối static:** `nhan_su`(+ma_ns·anh_url) · `tai_khoan`(id=auth.uid→nhan_su) · `team`(seed 6) · `nhan_su_team`(biên chế n-n) · **`vi_tri`**(team_id·ten=chức vụ·cap·**cha_id→vi_tri**·nhan_su_id NULL=trống) · `lop`(ten_lop·mon·khoi·bac·co_so·**ngay_khai_giang**) · `phan_cong_lop`(ns×lop×vai_tro gv/tg·la_chinh) · `hoc_sinh`(ma_hs·khoi·dia_chi·truong_hoc·phu_huynh_id·anh_url·trang_thai+`tot_nghiep`) · `phu_huynh`(ma_ph) · `hoc_sinh_lop`(hs×lop·**muc_nang_luc_id**·**ngay_vao/ngay_roi**·trang_thai) · `hoc_sinh_lop_log`(TRIGGER ghi vết §4) · `thoi_khoa_bieu`(lop·thu·giờ·hieu_luc_tu/den) · `muc_nang_luc`(12 mức). (`thanh_vien_team` DROP ở 0022.)
- **Migrations áp DB live (ĐỪNG chạy lại):** 0001–0019, 0021–0029. **0020 (bucket avatars) CHƯA chạy — Dashboard SQL Editor** (chưa chạy thì upload ảnh NS/HS lỗi). Bucket đã có: `kho-anh`, `kho-tailieu`.
- **Functions/trigger (mig 0026/0028):** `jwt_uid()/jwt_email()/la_thanh_vien()/self_link_account()` (RLS member-gate) · trigger `log_hoc_sinh_lop` trên `hoc_sinh_lop`.
- **Data đã import (V1→V2, 2026-27):** 327 HS · ~46 lớp (đã lên lớp +1 khối) · 277 PH · ghi danh + 76 ca TKB. Scripts `import_v1*.mjs` + `len_lop_2026.mjs` (idempotent/guard).
- **V2 hiện CHƯA có bảng:** phép-đo mastery (HS×dạng) / session / điểm danh / daily — dữ liệu ĐỘNG, dựng khi làm Bài tập hàng ngày.

### Khởi động ở máy MỚI (về nhà)
1. `git pull`.
2. **Copy tay `.env` + `.env.local`** (gitignored → git KHÔNG có). `.env`: `DATABASE_URL`(claude_build, DDL) + `DATABASE_URL_RO`(claude_ro). `.env.local`: `VITE_SUPABASE_URL/KEY` + `VITE_GEMINI_KEY`. Thiếu = không kết nối DB.
3. `npm install` → `npm run dev` → http://localhost:5173.
4. **Đăng nhập** (app cần auth; tài khoản đã tạo, hoặc Dashboard → Authentication → Add user + Auto-confirm) → đổi vai TopBar sang **Founder** → tab **Admin** → **Danh mục → Bản đồ kiến thức** → tab Đại số.
5. **ĐỪNG chạy lại migration / tạo lại bucket** — DB cloud dùng chung đã đúng.

### Nguồn intent (Notion)
- Quyết định Kho chốt ở trang **"Kho — Bản đồ kiến thức · Quyết định build (ADR)"** (con của ERP V2). Notion = source of truth cho *intent*.

---

## ② BÀI HỌC CÒN HIỆU LỰC (đừng đạp lại)

- **`zoom:1.15` (#root) + `100vh`**: mọi `100vh`/`min-h-screen` painted ×1.15 → body scrollbar thừa. Chặn chiều cao 1 lần ở App = `h-[calc(100vh/1.15)]`, dưới dùng `h-full`.
- **`grid h-full` KHÔNG đủ cuộn**: hàng grid mặc định `auto` → ô con tràn bị `overflow-hidden` cắt. Phải `grid-rows-[minmax(0,1fr)]` thì inner `overflow-auto` mới ăn. `min-h-0` một mình không cứu grid.
- **MathText `\n` vs lệnh LaTeX (`\neq`/`\nVì`)** — đã SAI 2 lần: cùng dạng `\n`+chữ, regex không phân biệt nổi. **Fix gốc: tách `$…$` TRƯỚC**, chỉ xử lý xuống dòng ở text NGOÀI `$`; trong text đổi ký hiệu Unicode trước rồi cắt dòng. **Bài học to: 2 thứ cùng pattern → TÁCH NGỮ CẢNH, đừng vá lookahead.** KaTeX dùng `\dfrac` (không `\frac`).
- **Mã/STT per-nhóm KHÔNG dùng trigger BEFORE INSERT**: multi-row insert 1 statement không thấy nhau → trùng. Tính **client-side max+1**.
- **Paste ảnh nhân đôi**: window paste-listener + slot `onPaste` cùng nổ → `e.stopPropagation()` ở slot.
- **Lưu phải ĐỦ cột**: patch thiếu `lua_chon`/`anh_*` → rớt data. Tái dùng editor + mapper đủ cột.
- **claude_build KHÔNG đụng schema `auth`/`storage`**: tạo user + bucket/policy phải qua **Dashboard** (SQL Editor cho storage). Bảng `public` thì áp migration bình thường.
- **Auth không vướng RLS**: login đi endpoint `/auth` riêng → bật RLS KHÔNG khoá đăng nhập (chỉ khoá đọc/ghi bảng).
- **Render phải CHỊU output AI ẩu**: AI hay quên bọc `$` (để `\dfrac{6}{5}` trần) + dùng `<br>`. Renderer phải tự render lệnh-CÓ-NGOẶC trần + đổi `<br>`→xuống dòng. ĐỪNG tin AI bọc `$` chuẩn.
- **AI hay LỜ số lượng yêu cầu** (xin 20 biến thể, trả 41) → **luôn CAP cứng ở CODE**, đừng tin prompt. `maxOutputTokens` thấp CHE lỗi này (output bị cắt) → nâng 65536 + bắt `finishReason==='MAX_TOKENS'`.
- **Completeness phải có trạng thái "KHÔNG áp dụng" TƯỜNG MINH** (vd chuyên đề "không cần LT" → loại khỏi mẫu số %) — đừng tính ngầm/đoán, sẽ ra % sai.
- **Op**: migration áp RIÊNG từng file (0001 không idempotent). Test regex/chuỗi bằng **file `.mjs` chạy `node`** — ĐỪNG `node -e` qua bash heredoc (nuốt backslash). Vercel env nằm TRONG từng Environment (click Production), thêm xong phải **Redeploy**. Gemini key public → giới hạn HTTP referrer + budget alert.
- **Gemini `CONSUMER_SUSPENDED` (403) = CHẠM spend cap, KHÔNG mặc định là leak key.** Đoán "key bị trảm vì lộ" là SAI (đã sai 1 lần). Check **Console → Spend cap + email Google** trước. Nâng cap có **~10 phút latency** (F5 vô ích, không phải lỗi client). Cache `accepted_answers` + (sau) proxy server-side để giảm gọi/né cap.
- **Preview-phải-bằng-bản-in → dùng paged.js, ĐỪNG tự cuộn 1 mạch.** Tự phân trang HTML là vô vọng: **flex chặn page-break**; `@page` counter (số trang) **cần có margin** mới hiện. paged.js cho A4 thật + header/footer mỗi trang + đếm trang, **1 engine cho cả preview lẫn in** nên khớp.
- **paged.js rewrite mọi `url()` (trừ `data:`) theo base = blob URL của stylesheet** (`sheet.js`): `url("/x.png")` tương đối → `new URL('/x','blob:…')` **THROW → preview TRẮNG**. Trong CSS nạp vào paged.js phải dùng **URL tuyệt đối** (`location.origin+'/x'`) hoặc `data:`. Luôn để paged.js `.preview().catch()` **hiện lỗi**, đừng nuốt → trắng trơn khó mò.

---

## ③ Nhật ký
→ Chuyển sang **`DEVLOG.md`** (log thô append-only, theo ngày, KHÔNG load khi làm). Là nguồn bất biến để truy lại / tổng hợp lại HANDOFF nếu bản này sai logic.
