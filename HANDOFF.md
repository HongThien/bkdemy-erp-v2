# HANDOFF — Kho (Bản đồ kiến thức) · BKdemy ERP v2

> Bản chuẩn để tiếp tục ở máy khác / session mới (không còn context chat). **Đọc nguyên file trước khi code.**
> 2 mục: **① Trạng thái hiện tại** (sự thật current) · **② Bài học còn hiệu lực** (đừng đạp lại).
> Nhật ký THÔ từng ngày ở **`DEVLOG.md`** — KHÔNG cần đọc khi làm, chỉ để truy lại / tổng hợp lại nếu bản này sai.
> *Quy tắc (CLAUDE.md §0): trong ngày chỉ APPEND `DEVLOG.md`; **CUỐI NGÀY** mới distill durable lên ①②, prune stale. Không append-chồng "STALE".*

---

## ① TRẠNG THÁI HIỆN TẠI

- **⭐ DẠY HÌNH 3D — mô hình HTML cho bài tập thể tích K12 (Thùy mở 09/10 tối, chốt hướng 10/10). ĐỌC `spec-day-hinh-3d.md` (Phần A + Phần S) trước khi làm.**
  - **Đích:** bài tập ứng dụng tích phân tính thể tích vẽ trên bảng rất khó ⇒ mô hình hình không gian xoay được, thao tác được; GV chiếu TV, **sau này đưa lên app HS để xem lại kèm bài giải**.
  - **5 luật Thùy chốt 10/10 (spec A1–A5):** A3 công thức CHỮ trước, bấm mới THAY SỐ · A4 CẮT LÁT chỉ cho bài tính theo thiết diện, bài tròn xoay chia miền rồi lắp thẳng công thức · A5 bài cùng loại gom MỘT trang chuyên đề, thêm bài = thêm dữ liệu, mỗi bài một địa chỉ cố định (`?bai=<id>`, `&nhung=1`).
  - **Đang có (thư mục `toan-site/the-tich/`, launch `toan` cổng 5281):** `khung.js` + `khung.css` (khung chung) · `coc-nghieng.html` = Câu 43, bài thiết diện, 6 bước (Thùy xem: ok) · **`tron-xoay.html` + `tron-xoay-bai.js` = chuyên đề tròn xoay**, đã có Câu 48, 49 (5 bước: đề → quay → chia miền → cái bẫy → tính) Câu 50, 52 (hai thùng rượu, bài thực tế 4 bước: vật thật → đặt hệ trục → quay → lắp công thức) và Câu 45, 46 (quay quanh Oy, đề cho hình phẳng chưa có trục, 5 bước: đề → đặt hệ trục → quay → chia miền → tính) — **đủ 6 bài tròn xoay của tài liệu NBV 12-18 F**; Thùy đã xem bảng chọn bài (bắt làm thẻ ngang có đồ thị), CHƯA xem từng bài · `mien-vat-qua-truc.html` chỉ còn là trang chuyển hướng.
  - **Đã lên mạng 10/10:** `https://toan.bkacademy.edu.vn/the-tich/tron-xoay.html` (+ `coc-nghieng.html`). Project Vercel `bkdemy-erp-v2-toan-site` tạo bằng CLI, CHƯA nối git ⇒ deploy bằng `cd toan-site && vercel link --yes --project bkdemy-erp-v2-toan-site && vercel deploy --prod --yes` từ một bản main sạch (spec §D.8). **Sổ theo dõi `docs/hinh-3d/so-theo-doi.md`**: mô hình ↔ câu của tài liệu ↔ địa chỉ ↔ mã câu trong kho (đang trống) — Thùy dặn lưu vết để sau khớp với app; thêm mô hình là phải thêm dòng.
  - **Nguồn:** NBV `12-18 … F. BAI TAP NANG CAO.docx` (MathType ⇒ `scripts/kho/mathtype-thu/doc-docx.mjs`); 10 bài 3D đã giải + kiểm (`node docs/hinh-3d/kiem-dap-so.mjs`), nguồn + hình ở `docs/hinh-3d/`. Lỗi nguồn: câu 52 M = 144 262, câu 53 Cách 1 sai ⇒ (4π/3 + √3/2)R².
  - **VIỆC TIẾP THEO:** ① (XONG 10/10: 45, 46 — nhóm tròn xoay hết.) ② Bài thiết diện 47 → 44, mặt cắt 53 (file riêng). ③ Thùy xem trang chuyên đề; soi TV 1920×1080 + iPad + màn dọc; duyệt câu chữ. ④ Gắn vào app HS (spec B7: khoá nối theo mã câu, nút mở cạnh lời giải, deploy site `toan`).
  - **Bẫy:** Browser pane ẩn thì rAF không chạy ⇒ `__dbg.run(ms)` tua rồi mới chụp; ảnh chụp hay trễ một khung. `?buoc=N&thay=1` mở thẳng một bước. `Object.assign` chép GIÁ TRỊ của getter. Vá file có LaTeX bằng script `.py` viết qua Write + chuỗi raw, đừng nhét vào heredoc (`\f` thành ký tự form-feed). Trang chuyên đề tự so thể tích tính từ `mien` với `dapSo` — thấy dải đỏ ở đáy màn là dữ liệu bài sai.

- **⭐⭐⭐ ĐỢT 1 MỞ APP HS + CÔNG TẮC TÍNH NĂNG — chốt 07/10 tối (Thùy: "mở từ từ từng phần, HS đỡ ngợp"). ĐỌC TRƯỚC khi thêm/ẩn bất kỳ ô nào trên app HS.**
  - **Công tắc = DB (mig `202610072101` + `…2102` + `…2118`, ĐÃ ÁP):** `tinh_nang` (`mo_tu` date: NULL=đóng, ngày ≤ hôm nay VN = mở mọi lớp) · `tinh_nang_lop` (ngoại lệ: mở thử 1 lớp / đóng riêng 1 lớp) · `tinh_nang_log` (trigger tự ghi). HS: `fn_hs_tinh_nang_mo()` → text[] (HS nhiều lớp thấy nếu BẤT KỲ lớp nào mở). Admin: màn **Admin → Gamification → "Mở tính năng app HS"** (`screens/gami/TinhNangScreen.tsx`, lá `tinh_nang`, founderOnly) hoặc `fn_tinh_nang_dat` / `fn_tinh_nang_lop_dat`. Đổi KHÔNG cần deploy; có hiệu lực khi HS về lại màn chính. Lỗi RPC ⇒ app mở hết.
  - **Client:** `lib/tinhnang.ts` (`MA_TINH_NANG_O` ô→mã) · `HocSinhApp.tsx` (`moTN`/`oMo`/`rankMo`, `anO` ẩn ô; HomeCap1 có prop `chiHien`) · ô đóng = **ẨN HẲN** (không ô khoá). KHÔNG gate: bài trên lớp/ET/BTVN/bổ trợ/kiểm tra lại/Học từ đầu (việc thầy cô giao).
  - **ĐỢT 1 hiện tại (đã ghi vào DB):** MỞ = Học tập · Trò chơi · Nhiệm vụ · Thành tựu · Ví xu · **Bảng xếp hạng + Chuỗi làm bài (Thùy 08/10: "phải mở"; Chuỗi có BANNER nổi bật ở màn chính — `BannerChuoi`)**. ĐÓNG (ẩn) = Thông tin học tập (Thùy: "bỏ luôn, nằm hết ở BXH") · Sổ tay · Rank · Thư viện BK (tạm ẩn) · Thế giới BK · Đề thi thử. Trong khu Học tập: **Chinh phục BK + Giải Vô địch BK = "Sắp ra mắt"** (mã riêng `chinh_phuc`, `giai_vo_dich`: đóng = đảo mờ + khoá, KHÁC các mã khác là ẩn hẳn; `HocTapHS` prop `sapRa`; xem thử `hs.html?xem=hoc_tap&sap=1`).
  - **TUTORIAL DO LỘC DẪN (08/10, build xong, CHƯA kiểm HS thật):** Lộc = người dẫn hoạt hình (`Skin.nguoiDan`, `scripts/anime-loc.mjs` → `rpgLoc.ts` SINH TỰ ĐỘNG, `tutorial/LocHS.tsx`). `TutorialHS` lọc chặng theo công tắc tính năng (`chuongMo`, `TINH_NANG_CHUONG`); đợt 1 = 12 chặng (mới: Chuỗi, Trò chơi). Tiến độ theo tài khoản: `hs_tutorial` + `fn_hs_tutorial_cua_toi/ghi` (mig `202610081121`, ĐÃ ÁP). Luồng: lần đầu TỰ MỞ · tính năng mới mở ⇒ Lộc đứng góc màn chính (`LocMoi`) kể đúng phần mới · menu ⋯ "Hướng dẫn của Lộc" xem lại · nút "Thử ngay" cuối chặng dẫn vào màn thật. Lời thoại ở `noiDungTutorial.ts` (bản nháp Claude, Thùy sửa). Xem thử: `hs.html?xem=tutorial&dot=1[&chang=N]`. **ĐÃ CHỐT 08/10:** lần đầu chỉ 5 chặng lõi (`CHUONG_LOI`: Học tập · Luyện dạng yếu · Chuỗi · Nhiệm vụ · Thành tựu), 7 chặng còn lại Lộc kể dần qua `LocMoi`; Bỏ qua lần đầu ⇒ bo_qua mọi chặng đang mở. Còn thiếu: HomeCap1 (khối 1–5) chưa có menu xem lại · mô phỏng chặng `thu_thach/rank/the_gioi` vẫn cũ (đang đóng nên không hiện).
  - **Nhiệm vụ (đã làm 07/10):** màn vẽ bằng kit `hs-nhiem-vu-v1` (`NhiemVuArt.tsx`) **to hơn** (chữ ~+25%, icon/khối lớn hơn) + nút **"Làm luôn ›"** ngay dưới dòng "Luyện dạng yếu" của khối Hôm nay = đường tắt vào Luyện dạng yếu (bản code cũ cũng đổi nhãn "Làm luôn ›"). Thành tựu vẽ bằng kit `hs-thanh-tuu-v1` (`thanhtuu/ThanhTuuArt.tsx`). Ảnh nén bởi `scripts/anime-ui-nv-tt.mjs` → `skin/styles/rpgGiaoDien.ts` (SINH TỰ ĐỘNG, đừng sửa tay) + `skin/khung9.ts` (9-slice cắt theo sourceRect).
  - **Boss:** Trang + Cường có hoạt ảnh (style RPG) và quái cuối của MỌI trận **random** giữa Thùy · Minh Quân · Trang · Cường (`the3d/loai.ts` `dsBossNgauNhien`). Lời thoại/tên chiêu hai boss là **bản nháp Claude, cần Thùy/Trang/Cường duyệt** (`boss/noiDungBoss.ts`). Còn hở: chiêu 40 BTVN bị cắt ~0,3s (`DauView2D` race 5000ms), cảnh 3D cũ vẫn ảnh tĩnh, `src/dautu` (Đấu trường leo tháp) vẫn sprite Boss Thùy riêng.
  - **VIỆC TIẾP THEO (ở nhà):** ① **verify bằng TÀI KHOẢN HS THẬT sau khi Thùy deploy** — chưa từng kiểm e2e: ô đóng thật sự ẩn trên màn chính (cấp 1/2/3/912), "Sắp ra mắt" ở Học tập, "Làm luôn" chạy vào Luyện dạng yếu, màn admin bật/tắt (chưa mở trên trình duyệt). ② Hướng dẫn/Tutorial: tutorial chặng mô tả cả tính năng ĐANG ĐÓNG — khi xây Tutorial **dẫn bằng Lộc** (xem memory `loc-narrator-tutorial`: giữ khung ~05–06 thay vì 08, nén 120 khung PNG trước) chỉ giới thiệu ô đang mở (đọc `fn_hs_tinh_nang_mo`). ③ Migration `202610071540` (khoá `fn_dtv_kho_bo_cau`) CHỈ ÁP sau khi Thùy deploy + thử 1 trận bot Toán. ④ tsc còn 3 lỗi CŨ (`_xem_912`, `_xem_rank`, `pdfRender`) — không phải của đợt này. ⑤ 2 file `sukien/SuKienScreen.tsx` + `TvSuKien.tsx` sửa dở từ trước, KHÔNG thuộc đợt này (đừng commit lẫn).
  - **Bài học:** trigger gọi `auth.uid()` ⇒ "permission denied for schema auth" (role chủ hàm không vào schema `auth`) — trong repo luôn dùng `public.jwt_uid()`. Chi tiết: DEVLOG 07/10 (tối).

- **⭐⭐⭐ KINH TẾ APP HS MỚI — build 06/10 khuya, ĐỌC TRƯỚC khi đụng nhiệm vụ / xu / vòng quay / ĐHT. Nguồn thiết kế: `spec-kinh-te-nhiem-vu.md` (§1–§9 nhiệm vụ·ĐHT·vòng quay·trần xu; §10–§13 thành tựu/huy hiệu/tháp) · `spec-bang-xep-hang.md` · `BUILD-BACKLOG-HS-06-10.md` (nhóm G/K/X/P/V).**
  - **ĐÃ XONG + ĐÃ ÁP DB (commit 7bb813f5, chưa push):** mig `202610061915` — nhiệm vụ mới chỉ tính lượt **Luyện dạng yếu đạt** (`bai_test.luyen_yeu` + học thật + đúng ≥70%, ≤4 lượt/ngày): ngày 20 EXP+20 ĐHT/lượt · tuần W1 (5 ngày) & W2 (12 lượt) 100 EXP+50 ĐHT · tháng M1 (20 ngày) 300 EXP+200 ĐHT.
    **ĐHT** = điểm để chơi game (kiếm SUY từ lượt đạt, tiêu = bảng `dht_tieu`, số dư replay, trần 6.000, `fn_dht_cua_toi`/`fn_dht_tieu`). **Trần xu theo nguồn nằm TRONG `fn_exp_app_thang`** (nhiệm vụ 2.000 EXP · vòng quay 1.000 EXP · thành tựu không trần · huy hiệu không thưởng) rồi ceil MỘT lần ở `fn_gami_exp_xu_thang` (owner postgres, không sửa). Vòng quay mới: 1 lượt/ngày mở khi có ≥1 lượt đạt, giải 10/20/30/50/100/200 = 35/30/20/10/4/1%.
    Test: `scripts/_thu_mig_nv_moi.mjs` (rollback, 18 ✔). Chi tiết + bẫy: DEVLOG 06/10 khuya. Hệ nhiệm vụ cũ (N1–N3/T1–T4/M1–M2/rương/Chặng) đã bị THAY, không chạy song song.
  - **APP đã sửa (commit kèm):** `NhiemVuHS` viết lại, `lib/nhiemvu.ts`, ô Nhiệm vụ Home, ô "Điểm học tập" ở Hồ sơ, `MayManHS` 6 ô, dữ liệu mẫu `mauGami`. tsc + `check:style-hs` sạch; **CHƯA verify trên preview**.
  - **VIỆC TIẾP THEO (làm ở máy nhà, theo thứ tự):** ① (XONG 07/10: ô May mắn đã ẩn khỏi màn chính, `MoiQuayMayMan.tsx` tự hiện lời mời quay ở 3 màn chính; route may_man giữ) ② verify preview (tạo lượt Luyện dạng yếu thật → xem Nhiệm vụ/ĐHT/quay; nhớ `npm run migrate` luôn dùng `--only <file>`, 15 file treo của người khác, file đầu fail quyền); ③ (XONG 07/10: Hướng dẫn/tutorial chặng 8+11 đã theo luật mới); ④ chạy cron `202610061810` ở SQL Editor (Thùy); ⑤ tiếp backlog: (P1 Đấu Từ theo tài khoản + nhật ký câu: PHASE 1 XONG 07/10 · PHASE 2.1 XONG: máy chủ CHẤM Leo tháp Toán/KHTN + BXH C1 mở · PHASE 2.2 XONG trên code+DB: trận bot chấm ở máy chủ — **migration KHOÁ fn_dtv_kho_bo_cau (202610071540) SOẠN SẴN, CHỈ ÁP SAU KHI DEPLOY game bản mới** (đang lộ đáp án tới lúc đó); còn 2.3 = kho từ tiếng Anh lên DB, 2.4 = trọng tài máy chủ cho đấu online/giải (sau khoá, online Toán/KHTN tạm tắt), mức nhớ từ ở Postgres; chi tiết ở DEVLOG) · (X1+X2 Bảng xếp hạng XONG 07/10: mig 202610070954 + màn bxh/BangXepHangHS + ô lớn `lon`; còn Hướng dẫn/tutorial cho thẻ BXH, A4/C1/E1 "Sắp có"), K7 thành tựu 15 loại (GIAI ĐOẠN 1 XONG 07/10: mig 202610071018 + màn ThanhTuuMoiView, 7 loại TT05–TT10/TT12; TT04 XONG 07/10 (hs_mo_app + fn_hs_mo_app); còn TT01–03/11/13–15 — TT01–03 cần Thùy định nghĩa, TT14 cần quyết cách trả xu (nới CHECK ledger + sửa báo cáo số dư); lệch spec "EXP chung" ghi ở DEVLOG), K8 huy hiệu (cần Thùy chốt thang sao/bản cứng/Helios·Chronos·Athena·Zeus), K10 Thử thách, K11 game kiếm điểm, K12 tổng ngân sách, G1 boss thật (3 final-boss + Minh Quân), P1 Đấu Từ theo tài khoản, P2 Nông trại tiêu ĐHT.
  - **Cùng ngày (đã commit, chưa push):** K1 ẩn Rank (`rankBat()`), G4 nền đơn sắc màn trong, G2/G3/G1-tạm màn giới thiệu Luyện dạng yếu + khung đấu chung + boss = boss Thùy, V4 báo lượt chưa tính. Cần push `main` + fast-forward `thu-nghiem`, rồi Thùy bấm Create Deployment.

- **⭐⭐ RELEASE APP HS V1.0 — DEADLINE 06/10/2026 (Thùy chốt 01/10). ĐỌC `spec-v1-app-hs.md` TRƯỚC KHI LÀM BẤT KỲ VIỆC GÌ TRÊN APP HS.**
  - 8 hạng mục: tutorial · chuỗi + nhiệm vụ · Thế giới BK · Rank hoàn chỉnh · UI 100% "Giải cứu thế giới — đánh quái vật" · ≥2 style · game tổ hợp ·
    góp ý/báo lỗi HS. **Màn NGANG trước** (cấp 1–2 dùng iPad/PC); khổ dọc chỉ cần không vỡ. Giải đấu nhóm: đã thiết kế (§10), CHƯA làm.
  - **Chia 3 luồng song song, mỗi luồng 1 context** (spec §13 — có câu lệnh mở đầu dán sẵn §13.5, vùng file riêng, hợp đồng dữ liệu §13.4,
    hộp thư giữa luồng §13.6): **SỐ LIỆU** (chuỗi · nhiệm vụ · rank · huy hiệu · dữ liệu Thế giới · góp ý · hàm bản đồ) · **GAME** (repo BKGame,
    Thùy điều phối) · **GIAO DIỆN** (bản đồ phiêu lưu · màn đấu · vẽ lại mọi màn · style 2 · tutorial). Commit theo đường dẫn, migration `--only`.
  - **ĐÃ XONG 01/10 — lát A "lượt học thật"** (mig `202610011501`, ĐÃ ÁP): lượt luyện thêm tính khi ≥5 câu · đúng ≥50% · trung bình ≥6 giây/câu;
    không ra lại câu em đã gặp ở BẤT KỲ bài nào khi kho còn câu mới. Nguồn duy nhất `public._luot_hoc_that()` + `fn_luot_hoc_that_ket_qua()` cho app.
    Đo 30 ngày: 57% lượt được tính, 22% bị loại vì làm quá nhanh.
  - **⭐⭐ [SỐ LIỆU] CHỐT NGÀY 01/10 — chuỗi · nhiệm vụ · Rank · góp ý · bản đồ (dữ liệu). TẤT CẢ DB ĐÃ ÁP + PUSH `main`; app chưa deploy.** Chi tiết + hợp đồng: `spec-v1-app-hs.md` §13.4 + §14.
    - **Luật chung "lượt học thật" (mig `202610011501`, thay bằng `_luot_tinh` ở `…1525`)**: lượt LUYỆN THÊM (`bai_test.loai='tu_luyen'`: Tổng hợp · Chủ đề · Thử thách) tính khi ≥5 câu · đúng ≥50% ·
      trung bình ≥6 giây/câu (ngưỡng ở `_luot_hoc_that_nguong()`, 1 chỗ). ET/BTVN KHÔNG tính. **Không ra lại câu em đã gặp ở bất kỳ bài nào khi kho dạng đó còn câu mới** (`_hs_cau_lan_gap`);
      hết thì ra câu gặp lâu nhất. Nguồn DUY NHẤT: `_luot_tinh(hs[], từ, đến)` (+ `_luot_hoc_that(hs,…)` thêm `dung_moi`) — chuỗi/nhiệm vụ/Điểm Rank/cổng game đều đọc đây.
    - **Chuỗi làm bài (`…1512` + `…1515`)**: CHUNG mọi môn, suy động (không lưu ô chuỗi). Lỡ ngày ⇒ 48 giờ sửa bằng lượt THỪA; hết hạn ⇒ tự dùng thẻ đóng băng (2/tháng, không dồn); hết thẻ ⇒ đứt.
      Ngày nghỉ (bảng `chuoi_ngay_nghi`, khối rỗng = mọi khối) không đứt không cộng. Mốc 7 (A: Lớp+Bạn bè) · 30/100/200/365 (S: Thế giới) ghi SỰ KIỆN `chuoi_moc_dat` bằng trigger sau khi nộp
      lượt tu_luyen ⇒ tin `kieu='chuoi'` trong `_the_gioi_tin`. `fn_chuoi_cua_toi()` · TS `src/lib/chuoi.ts`. **Màn quản trị "Ngày nghỉ của chuỗi"** `screens/gami/NgayNghiChuoiScreen.tsx` (lá `chuoi_nghi`,
      quyền `co_quyen_ghi('chuoi_nghi')` — `…1641`); bảng ngày nghỉ HIỆN RỖNG (Tết/tuần thi chưa nhập).
    - **Nhiệm vụ (`…1525`)**: `fn_nhiem_vu_hoan_thanh` chỉ tính lượt học thật — N2 "Luyện 20 câu" chỉ câu đúng MỚI (lần đúng đầu tiên của em) · N3 trong lượt tính · N1/T3/M2 (Thử thách) chỉ lượt được tính.
      (Thử Toán tháng 10: N2 42→36, N3 33→27.) Nhiệm vụ mở 01/10 nên CHƯA có dữ liệu thật để đối soát.
    - **Rank (`…1545` `…1546` `…1547`)**: Điểm Rank Thử thách chỉ khi lượt học thật (trigger; nộp lại 73 lượt cũ: giữ 72, mất 1). **Nhật ký lên bậc** `rank_len_bac` (ngày chạm bậc suy từ chuỗi điểm cộng dồn của
      `fn_rank_su_kien`; khớp 325/325 em với `fn_rank_mua`; trigger sau Thử thách + `fn_hs_len_bac_moi(mon)` quét cả môn nếu >30 phút; bậc đạt >2 ngày trước coi như đã xem) ⇒ tin `kieu='len_bac'`
      (bậc 3–4 B · 5–6 A · ≥7 S). **Server chọn dạng** (`fn_tu_luyen_sinh_tu_dong` / `fn_thu_thach_sinh_tu_dong`, 60% nửa yếu · 40% mọi dạng đã đo): vá lỗ HS tự chọn dạng DỄ cho Thử thách; JS `chonDangTuLuyen` đã xoá.
    - **Bản đồ phiêu lưu — DỮ LIỆU (`…1520`)**: `fn_ban_do_phieu_luu(mon)` lục địa→khu vực→màn→quái, trạng thái từ `fn_mastery_cells`, `da_day` (phủ sương nhưng vẫn vào được), mỗi khu 1 màn boss, registry nhánh
      `_kho_ds_nhanh`/`_kho_ban_do_dong` (không `if môn`). Gán quái/biome cố định theo băm mã cụm / thứ tự chủ đề. TS `src/lib/phieuluu.ts`.
    - **Góp ý / báo lỗi HS (`…1539`)**: dùng lại `bao_loi` (`loai` bug|yeu_cau, `hoc_sinh_id` ≠ null = của HS). HS chỉ qua RPC: `fn_hs_gui_gop_y` (≥10/≤1500 chữ, 5/ngày, ảnh chỉ kho-anh/report) · `fn_hs_gop_y_cua_toi`
      (trạng thái dễ hiểu da_nhan/dang_xem/da_xu_ly/chua_lam_duoc + `tra_loi_moi`) · `fn_hs_gop_y_da_doc/chua_doc` · nhân sự `fn_bao_loi_tra_loi` (vào Hòm thư — Thùy đã grant `thong_bao_hs` cho `claude_build`). TS `src/lib/gopy_hs.ts`.
      Màn nhân sự `BaoLoiScreen`: nhãn HS, lọc nguồn, ô trả lời.
    - **Ví xu (`…1601`)**: danh sách Hoạt động thêm dòng `exp_nhiem_vu` (1/môn/tháng, kèm cấp + rương) và `exp_huy_hieu` — vốn đã đổi ra xu cuối tháng nhưng không có dòng. ⚠ dòng HUY HIỆU lấn sang luồng huy hiệu
      (Thùy: "huy hiệu thiết kế riêng 1 luồng khác") — chờ Thùy quyết giữ/gỡ.
    - **⏳ VIỆC SAU KHI DEPLOY app HS (Thùy):** báo Claude thêm migration `revoke execute on function public.thu_thach_sinh(text,jsonb) / public.tu_luyen_sinh(text,jsonb,text) from authenticated` — hàm cũ vẫn mở vì bản app
      chạy nền còn gọi (HS tự chọn dạng được tới lúc đó). Deploy ERP (nhân sự) để thấy màn "Ngày nghỉ của chuỗi" + ô trả lời góp ý.
    - **⏳ CÒN LẠI của luồng Số liệu:** nút 👑 Thầy cô khen ở app GV (hàm DB có sẵn) · đối soát tay chuỗi/nhiệm vụ/Rank ở ~3 em khi có dữ liệu thật · chốt tháng 9 từ 10/10 (luồng huy hiệu) · giải đấu tuần (spec §10, chưa làm).
    - **⏳ Luồng Giao diện cần nối (hộp thư spec §13.6):** ngọn lửa chuỗi trên Home + hoạt cảnh mốc (`chuoiCuaToi`) · báo "lượt chưa tính" ở màn kết quả (`ketQuaLuotHocThat`+`loiLuotKhongTinh`) · hoạt cảnh lên bậc (`lenBacMoi`/`daXemLenBac` thay
      localStorage) · chữ tin Thế giới cho `kieu='chuoi'` và `'len_bac'` ở `moTaTin()` · form Báo lỗi/Góp ý + màn "Góp ý của em" + chấm đỏ (`gopy_hs.ts`).
    - **Cách thử mỗi migration (mẫu, chạy lại được):** `scripts/_thu_mig_*.mjs` (luot_hoc_that · chuoi · chuoi_moc · ban_do · nv_luot · gop_y · rank_tt · rank_len_bac · chon_dang · vi_xu · chuoi_nghi) — mỗi script chạy cả migration +
      gọi hàm trong 1 transaction rồi ROLLBACK, đóng vai HS/nhân sự qua `set_config('request.jwt.claims', …)`, dùng savepoint cho phép thử "phải lỗi".
    - **Bài học luồng Số liệu (còn hiệu lực):** ① sửa hàm đang chạy: ĐỌC `pg_get_functiondef` rồi thay đúng 1 chỗ + assert (`do $` hoặc script) — đừng chép đè thân hàm bản cũ · ② trong JS `String.replace(a, b)` đổi `$` của `b`
      thành `$&` / `$`` (chèn lại đoạn khớp / phần đứng trước — chính lỗi này đã làm HANDOFF tự nhân đôi 19 dòng đầu, gỡ 02/10)`
 ⇒ làm hỏng dollar-quote; dùng `split(a).join(b)` · ③ `auth.uid()` làm default cột bị chặn với role migrate ⇒ dùng `public.jwt_uid()` · ④ kiểm RLS bằng role chủ bảng không chặn gì — kiểm `la_thanh_vien()`/pg_policies,
      không kết luận từ "insert được" · ⑤ suy chuỗi/bậc cả trung tâm mỗi lần mở feed quá chậm ⇒ ghi SỰ KIỆN bằng trigger (`chuoi_moc_dat`, `rank_len_bac`), feed đọc bảng sự kiện · ⑥ bảng tạo tay bởi `postgres` (vd `thong_bao_hs`) role migrate không ghi được ⇒
      bọc `exception when insufficient_privilege` · ⑦ truy vấn quét cả trung tâm có thể quá giờ ⇒ thử theo từng em + `set local statement_timeout` · ⑧ `.env` máy công ty: `DATABASE_URL` = `claude_build` (GHI được) dù chú thích ghi claude_ro.
  - **⭐⭐ BẢN ĐỒ PHIÊU LƯU — 2D ẢNH TĨNH + HIỆU ỨNG CODE (đổi từ 3D ngày 01/10 khuya) · TRÊN `main`, CHƯA DEPLOY · CỜ MẶC ĐỊNH TẮT** (luồng Giao diện; chốt hết ngày 02/10)
    - **Logic (spec-v1-app-hs §4.5, không đổi):** Thế giới (chủ đề = lục địa) → Lục địa (chuyên đề = mốc) → Chặng đường (dạng = bệ có quái) → Màn đấu. Dữ liệu `fn_ban_do_phieu_luu` (Số liệu).
    - **Code:** `src/screens/hocsinh/phieuluu/ban2d/` — `hinh2d.ts` (SỔ HÌNH: ảnh nào có thì khai, thiếu ⇒ hình tạm SVG theo `b.biome`; toạ độ ghép) · `TheGioi2D` · `LucDia2D` · `Chang2D` ·
      `San2D.tsx` (khung 16:9, mây/sao/sương/cờ, `Sao5`, `MuiTen`, `CHU_VIEN`) · `boCuc.ts` · `HinhTam.tsx`. Ảnh nén ở `public/bk-ui/hs/skin/rpg/phieuluu2d/` (WebP lục địa, JPG nền).
      Màn đấu = 2D (`DauView2D` + `SanDon2D`, từ 03/10 — xem khối GIAO DIỆN cuối ngày 03/10; `DauView` 3D chỉ còn làm tham chiếu). Trang thử `hs.html?xem=phieu_luu` (`&so=N` số chủ đề · `&tang=luc_dia&luc=C` · `&tang=chang&luc=C&vung=C2` · `&tang=dau…`).
    - **THẾ GIỚI (Thùy duyệt "đã rất ổn" 02/10):** nền biển V2 (`the_gioi_bien.jpg`) + **10 lục địa rời V2** (`luc_dia_v2_<biome>.webp`, cắt sát mép, cạnh dài 640) **ghép ĐÚNG vị trí ảnh gốc**
      ⇒ đại lục 7 vùng + 3 đảo. Toạ độ `VI_TRI_LUC_DIA_V2` (tâm vùng đo trên ảnh gốc, bề rộng tăng tới khi mảnh gối nhau; thứ tự đường đi rừng → anh đào → thành cổ → đầm lầy → sa mạc →
      băng → núi lửa → quần đảo → đảo trời → đảo cối xay). Khối N chủ đề ⇒ đặt N mảnh đầu, biển vẫn liền; >10 ⇒ `GhepManh` (bố cục chung). `ganBiomeTheoTranh` gán biome theo mảnh ⇒ đi vào trong
      đúng cảnh vùng vừa bấm (chỉ phần vẽ). Rê chuột: mảnh nhích lên + viền vàng (nút dùng mask chính ảnh). Nhãn KHÔNG khung (chữ viền dày, 18px), tiến độ **5 sao** (mỗi sao 20% dạng đạt; chặng =
      độ nắm dạng, đạt = 5 sao), "em đang ở đây" = **mũi tên vàng nhấp nhô** (không chữ, không ảnh nhân vật). Ảnh gốc V2: `design/bk-ui-src/Adnventure2D/V2/` (tên exec-*, map trong DEVLOG 02/10).
    - **⭐ LỤC ĐỊA = 5 KIT ĐƠN 12 (02/10 đêm, Thùy duyệt dần) — `ban2d/LucDiaKit.tsx`** (rừng · ảo đảo · thành cổ · đầm lầy · sa mạc; `LucDia2D` tự chọn kit khi biome có kit VÀ số chuyên đề ≤ số công trình
      của kit — rừng/thành cổ/ảo đảo/đầm lầy 8, **sa mạc chỉ 6**; còn lại (băng — chưa có kit lục địa —, hoặc >số công trình của kit) ⇒ bản vẽ chung cũ `LucDiaCu`). **03/10: thêm 4 kit núi lửa · đông gió · biển đảo · trời sao ⇒ 9/10 lục địa có kit, chỉ thiếu BĂNG.**
      Nền vẽ sẵn ĐƯỜNG + 8 công trình rời (alpha thật) + **chibi chạy theo đường** tới cửa công trình em bấm rồi mới mở màn chặng; chưa gán chuyên đề ⇒ công trình đứng đó, không bấm, không nhãn.
      - **Nguồn + pipeline:** ảnh gốc `design/bk-ui-src/AppHS/<kit>/` (ĐÃ commit 02/10 theo Thùy: ~376MB không tính zip; các file `*.zip` KHÔNG commit — trùng nội dung thư mục + có file >100MB GitHub từ chối) → `scripts/anime-kit-lucdia.mjs` (nén WebP ≤640, cắt sát alpha, neo; rừng đọc `kien_truc_chibi_v4.json`) →
        `public/bk-ui/hs/skin/rpg/lucdia/<biome>/` + `kitLucDia.anh.ts` (sinh) · `scripts/anime-duong-kit.mjs` (DÒ ĐƯỜNG THẬT từ nền: mặt nạ màu + A* giữa các mốc ⇒ `kitLucDia.duong.ts`, sinh) ·
        `kitLucDia.ts` (chân/bề rộng công trình, màu chữ nhãn, `SAO_KIT`). **Tuyến đường ghi trong DESIGN.md của kit là XẤP XỈ và lệch hẳn đường vẽ ⇒ luôn dò lại bằng script.** Đổi nền/công trình ⇒ chạy 2 script (ghi log ra file, KHÔNG `| head`).
      - **Nền v4 của Thùy (dịu, chibi):** rừng + đầm lầy đã thay nền + công trình chibi mới (khớp nhau); thành cổ · ảo đảo · sa mạc CHƯA có bản chibi. Nền giữ NGUYÊN BẢN (đã thử lọc màu/làm mờ 2 lần ⇒ "nhà giả giả").
        **Đầm lầy: đường thật đi cầu → hang bùn → đền rêu nên đã ĐỔI CHỖ chuyên đề 5↔6** so với DESIGN.md (kit ghi ngược).
      - **Hiển thị:** tên + số + **5 sao** đè cảnh, sao vàng rực viền tối trên viên thuốc tối (`KieuSao`); **LUẬT "KHÔNG ĐÈ NHAU"** (Thùy 02/10): `xepNhan()` đo nhãn thật (Range) rồi quét lưới chọn chỗ không đè công trình nào / nhãn khác / thanh trên-đáy;
        hover/chạm ⇒ công trình NỔI LÊN (phóng 1,08 + quầng sáng + lên đầu z); thêm viền sáng + quầng thở + đốm sáng bay cạnh công trình (tắt ở đồ hoạ Thấp / giảm chuyển động).
      - **Nhân vật chính = EM TỰ CHỌN 1 trong 6 (từ 03/10 — xem khối KHU HỌC TẬP)**; 2 nhà thám hiểm áo choàng xanh (nam/nữ) là 2 trong 6 — bộ chạy 2D 6 khung × 100ms (`design/bk-ui-src/AppHS/Animation/` → `scripts/anime-chay-2d.mjs` → `skin/heroChay.ts` + `public/bk-ui/hs/skin/rpg/chay/`; neo đất ĐO từng khung, cỡ thân cùng tỉ lệ,
        `khungTheoMs` theo delta thời gian). Tốc độ chạy `TOC_DO_NV = 2,2` chiều-cao-người/giây, tối đa 4,5s (trước "như gió"). Cỡ nhân vật theo DESIGN chỉ ~35px ⇒ nhân `HE_SO_NV = 2,2`.
        **2 nhân vật cũ (bé trai+mèo, bé gái+cú; `Skin.nhanVat`) = NPC DẪN TRUYỆN** (Home, tutorial, người dẫn ở Đấu trường) — KHÔNG phải nhân vật của em.
      - **Xem thử:** `hs.html?xem=phieu_luu&tang=luc_dia&luc=C&biome=<rung|anh_dao|thanh_co|dam_lay|sa_mac>&gioi=nu|nam&nv=8` (`nv` = số chuyên đề giả để soi kit 6/8 mốc; `duong=1` vẽ đường dò; dev).
      - **CHƯA:** >8 chuyên đề (rừng/thành cổ nói lật nền, ảo đảo nói KHÔNG lật được) · biome BĂNG chưa có kit lục địa · bản dọc · thế giới/chặng chưa có nhân vật chính · iPad thật · kiểm tay thành cổ/ảo đảo/sa mạc sau đổi nhãn.
    - **CHẶNG (Thùy: "ổn hơn"):** nền chặng Đơn 7 (4 biome) + bệ đá thật (#27) + quái tạm + **đường three.js** (`ban2d/duongThree.ts` + `LopDuong.tsx`): ribbon CatmullRom qua các bệ,
      shader đá cuội/mép vẽ tay; dựng trên MẶT ĐẤT rồi chiếu theo góc nhìn chéo (`nghieng` 0,45 · `xaGan` 0,7 — xa nhỏ gần to) + thành đá phía gần; đoạn đã đi vàng + luồng sáng
      chạy (đứng yên ở mức Thấp); không WebGL ⇒ đường SVG cũ. Chunk 5,5KB, dùng chung three với màn đấu.
    - **MÀN ĐẤU (để sau theo Thùy):** HUD gọn trên cùng, câu hỏi gần trọn màn, cảnh 3D chỉ bung khi tung chiêu; **combo 3 câu = 1 chiêu** (3/3 tuyệt kỹ … 0/3 xịt, sát thương = số đúng);
      thẻ câu hỏi "bảng phép" (`skin/KhungTran.tsx`, `Skin.tran`, font Baloo 2); lời giải tự cuộn tới. Hình cho màn đấu = **Đơn 8** (chưa gửi). Chiêu chốt 4 giây (rAF đứng khi tab ẩn).
    - **Tuỳ biến của em (đã có DB + UI):** công tắc **Hiệu ứng game** (`hs_giao_dien.hieu_ung_game`, mig `202610020037`; tắt ⇒ Tự luyện không vào bản đồ) trong tấm Giao diện · style **Tối giản**
      (`skin/styles/toiGian.ts`, đơn sắc, 16 icon SVG mặt nạ; LÀ style nhưng KHÔNG tính vào 2 style V1) · mức **đồ hoạ** Thấp/Vừa/Cao (`skin/the3d/chatLuong.ts`, áp cho màn đấu 3D).
    - **Cờ `phieuluu` (`phieuluu/coBat.ts`) MẶC ĐỊNH TẮT:** máy thử `?phieuluu=1`. Bật mọi HS: `MAC_DINH = true` rồi deploy. Bản đồ chỉ mở khi cờ bật + hiệu ứng game bật + style có bản đồ.
    - **Đơn ChatGPT (design/DON-HANG-SKIN-HS.md):** Đơn 7 (gốc, đã nhận #01–#30: lục địa · nền vùng/chặng 4 biome · 6 mốc · bệ đá · mây · la bàn · cờ — ảnh ở
      `design/bk-ui-src/Adnventure2D/chon_huong/`) · 7-0 (bỏ) · 8 (màn đấu, chưa gửi) · 9 (kit 1 thế giới = xong bằng bộ V2) · 10 (nền có đường + bệ — phần VÙNG thay bằng Đơn 11) ·
      11 (bị Đơn 12 thay) · **12 (tầng lục địa, 02/10: 1 màn = đường xuyên suốt + 8 công trình KHÁC LOẠI (nhà · lều · tháp · cầu · đền · hầm ngục · pháo đài · lâu đài) + nhân vật chibi CHẠY dọc đường giữa các chuyên đề; ít hơn 8 ⇒ công trình thừa đứng sẵn không tấn công; >8 ⇒ kéo ngang, màn kế = nền lật gương; DESIGN.md có đường ≥24 điểm; RỪNG trước, rồi 9 vùng — VIỆC KẾ TIẾP, Thùy tự gửi)**.
    - **Kit đã NHẬN:** Đơn 12 = 5 kit lục địa (xem trên) · Đơn 13 chưa gửi · nền + công trình chibi v4 (rừng, đầm lầy) do Thùy chỉnh trực tiếp.
    - **VIỆC TIẾP:** ① **Đấu trường: chờ Số liệu làm RPC** rồi nối thật (xem khối dưới) ② bộ tư thế chiến đấu của Thùy (`Animation/chien_dau/`, đang vẽ dở: đứng ×2, suy nghĩ, tích năng ×2 + 5 fx + nền sân + `hieu_ung_va_cham.js`) ⇒ đọc DESIGN rồi tích hợp một lượt vào `DauTruongHS`/`hieuUng.ts`
      ③ nền chibi cho kit thành cổ/ảo đảo/sa mạc + kit lục địa BĂNG (+ nền màn dạng bài cho trời sao · đông gió · thành cổ) ④ nền chặng 6 vùng còn lại + chặng dùng nhân vật chính ⑤ màn đấu của Tự luyện (3D) theo Đơn 8 ⑥ iPad thật + luồng làm bài thật (tài khoản HS THỬ) ⑦ bản dọc ⑧ hộp thư Số liệu (`fn_ban_do_phieu_luu` trả đội hình/`so_cau_luot`/`hp`).
    - **Nợ:** lỗi tsc cũ `src/lib/pdfRender.ts` (không thuộc luồng này) ·
      DB còn 7 em `skin='toi_gian'` (giờ khớp style Tối giản).
  - **⭐ THỬ THÁCH = ĐẤU TRƯỜNG 3 TRẬN (Thùy chốt 02/10) — ĐÃ CÓ SPEC + DEMO, CHƯA NỐI DB · ĐỌC `spec-thu-thach-dau-truong.md`** (thay luật A2 cũ của `spec-thanh-tuu-nhiem-vu.md`)
    - **Luật:** 3 trận × 5 MCQ (chọn qua `_kho_dk_mcq_sql`), thắng khi đúng ≥60% · ≥80% · 100%; thua trận nào dừng luôn; **2 lượt/ngày/MÔN, chưa đóng lượt 1 không mở lượt 2**; nút **Bỏ cuộc = thua** (vẫn mất lượt); bỏ >30 phút server tính thua;
      Điểm Rank 10/20/30 (thắng 1/2/3 trận), **trần TUẦN** thay trần ngày (số trần: Số liệu đề xuất); câu lấy từ dạng đã học (≥3 lần đo; tối thiểu 5 dạng), 2 dễ · 2 vừa · 1 khó mỗi trận theo ĐỘ KHÓ CỦA DẠNG, không trùng câu, xoay vòng dạng; **sinh cả 15 câu một lần ở DB**.
      Ảnh hưởng: nhiệm vụ N1/T3/M2 + huy hiệu Hercules ("lượt 10/10") đổi thành "vượt Thử thách". Việc DB đã gửi vào hộp thư `spec-v1-app-hs.md` §13.6 #7 (RPC bắt đầu lượt / nộp trận / bỏ cuộc + job hết giờ).
    - **Demo (dữ liệu giả):** `hs.html?xem=thu_thach` (`&goi_y=1` đánh dấu đáp án · `&don=set|thien_thach|cau_lua_lon|cau_bang_lon|cau_lua_nho|cau_bang_nho|dien_nho` ép đòn · `&luot=0` · `&dang=3` · `&gioi=nu`). Code `screens/hocsinh/thuthach/`:
      `DauTruongHS.tsx` (sân 2D + câu hỏi + bỏ cuộc + kết quả; nhận 3×5 câu qua props — nối thật chỉ đổi nguồn) · `hieuUng.ts` (engine canvas 2D) · `kieu.ts` · `mau.ts` · `XemThuThach.tsx`.
    - **Trải nghiệm (Thùy chỉnh):** KHÔNG hoạt ảnh theo từng câu; làm xong 5 câu mới phát ĐÒN theo % đúng — 100% sét đánh (boss chớp âm bản "thấy xương" + tia điện) / thiên thạch (rơi + nổ + cháy) · 80% cầu lửa lớn (cháy) / cầu băng lớn (đóng băng rồi vỡ) · 60% cầu lửa-băng / tia điện NHỎ ·
      thua: boss ném ma thuật. Chọn ngẫu nhiên trong nhóm. Boss 1 con (tạm boss_thuy) qua 3 trận, máu hiển thị tụt sau mỗi đòn, trận 3 = kết liễu. Người dẫn truyện = bé gái+cú. Tư thế đánh hiện là CSS trên khung đứng yên của nhà thám hiểm.
  - **Đơn 13 (02/10 đêm, chưa cần gửi):** bộ tư thế chiến đấu nhân vật chính (15 tư thế/giới + 5 đạn + nền sân) — Thùy chọn "dùng 2 nhân vật + animation chạy là được" nhưng đang tự vẽ `Animation/chien_dau/`.
  - Tutorial: 12 chặng khớp Hướng dẫn chơi (khối GIAO DIỆN cuối ngày 03/10); xem `hs.html?xem=tutorial` · `hs.html?xem=huong_dan&tut=<id chặng>`.
  - ⚠ `.env` máy công ty: `DATABASE_URL` = `claude_build` (GHI được) dù chú thích ghi `claude_ro`.

- **⭐⭐ APP HS THEO MÔN + KHO KHTN/ANH — trạng thái hết 03/10 (phiên worktree `home-hs-giai-tri`; mọi thứ dưới đây ĐÃ ÁP DB + PUSH `main`, app CHƯA deploy)**
  - **Môn = trục ngoài cùng của app HS (mig `202610011120`):** thanh chọn môn Toán/KHTN/Tiếng Anh (`ThanhChonMon`, `MON_APP_HS` lib/mon.ts, môn đang chọn = 1 nguồn
    module-level `layMonHienTai/ngheMonHienTai` trong tuluyen.ts). Đổi môn ⇒ đổi mọi tính năng HỌC (tự luyện, thông tin học tập, sổ tay, ET/BTVN theo `bai_test.mon`,
    lịch bổ trợ, BXH); khu Giải trí đứng yên. Môn chưa có kho (`_kho_co_mon` = registry, hiện Toán + KHTN) ⇒ ô cần kho khoá "X chưa mở"; hàm sinh bài báo lỗi thay vì
    rơi về kho Toán. 70 bài tự luyện gắn nhầm 'Tiếng Anh'/'Văn' đã sửa về Toán (mig `202610011207`). **Còn:** `_kho_*_tbl` vẫn fallback Toán cho môn lạ (luồng staff) —
    Thùy: không sửa, TG sau này cũng cố định từng môn.
  - **Màn chính HS (mig `202610030228`):** Thế giới BK lên đầu · bỏ ô "Bài tập được giao" (sau này là ô DERIVE — có bài giao mới hiện) · Nhiệm vụ xuống Giải trí ·
    thẻ **Thư viện BK** ("Nơi tìm hiểu mọi thông tin trên app", `ThuVienHS.tsx`; Rank là thẻ con) · **TSA = ô riêng cho MỌI em khối 12** không cần ghi danh:
    registry `mon_mo_ca_khoi(mon, khoi, lop_id)` + lớp neo `12 TSA · Tự luyện chung` (trạng thái `dong`) · `_hs_lop_tu_luyen(hs, mon)` · `hs_mon_rieng_cua_toi()` ·
    app `datMonTam` (môn TẠM khi ở trong ô riêng). Icon `thu_vien`/`tu_luyen_rieng` đang TẠM (mượn ô cũ). **Treo:** việc (6) thay ảnh nhân vật/backdrop bằng bản AI —
    Thùy chưa đẩy ảnh từ máy công ty.
  - **10 HS TEST cô lập (mig `202610031034`):** TEST01…TEST10 (khối 3·5·6·7·8·9 nam·9 nữ·10·11·12 có TSA), đăng nhập mã = mật khẩu. `hoc_sinh.trang_thai='test'` +
    15 lớp `TEST · <môn> <khối>` trạng thái `dong` + `_hs_hien(hs)` trong các hàm xếp hạng/album/huy hiệu/bạn bè/tin Thế giới ⇒ em thật không thấy em test.
    Ngoài phạm vi: BXH Đấu từ (bảng `dtv_*` riêng) — em test chơi sẽ lên BXH. Tạo thêm: `scripts/tao_tk_hs_test.mjs` (idempotent).
  - **Sổ tay KHTN (mig `202610031125` + `…1126`):** 807 mục Lý/Hoá/Sinh 6–9 từ artifact KHTN Pocket, nạp 1 lần vào `sotay_cong_thuc` (bảng mục CHUNG mọi môn, cột
    `loai`/`y`/`bang`/`bien`/`vd`/`nham`/`lq`) trạng thái `da_duyet` (GV đã duyệt) — **ERP là gốc**, app chỉ đọc. Seed tự chặn nếu đã có mục KHTN (không nạp đè).
    **Treo:** 109 hình (`sotay_ct_hinh` url null, mô tả giữ mã vẽ) chưa vẽ · nối mục ↔ dạng `khtn_ban_do`.
  - **Kho KHTN — luồng ĐỀ XUẤT dạng/cụm = bản sao Toán Đại (mig `202610031258`):** `khtn_de_xuat(_cau,_quyet_dinh)` + `fn_khtn_de_xuat_ds/_quyet/_tao/_tk` +
    `fn_khtn_sinh_ma_dang` + `khtn_cau_hoi.muc_cau` (1–5). ERP: registry `DE_XUAT_KHO` (lib/kho/api.ts) ⇒ `DeXuatPanel kho=…`; Kho › KHTN có nút Đề xuất.
  - **Ngân hàng Hạt Mầm (KHTN, GV đã duyệt nội dung) → kho theo 3 làn (spec-luong-kho §5.3):** Hạt Mầm là PHIÊN BẢN BẢN ĐỒ KHÁC (trùng mã, khác dạng) ⇒ **CẤM nối
    theo mã**; 9 agent ánh xạ theo NỘI DUNG câu ⇒ `scripts/khtn-hatmam/de-xuat/<khối>-<ly|hoa|sinh>.json` (kiểm độc lập `kiem-de-xuat.mjs` + đọc tay `soi-xanh.mjs`).
    Tổng 5.709 câu khối 7–9: 🟢 3.217 vào dạng ERP · 🟡 409 dạng mới · 🔴 156 hỏi GV · ⚪ 1.927 ERP chưa có chuyên đề.
    - **Đã nhập** (`nhap.mjs`, chạy thử rồi `--ghi`; `kiem-sau-nhap.mjs` đọc lại DB): **khối 7** 1.069 câu (907 vào dạng · 162 dạng chờ) + 25 thẻ đề xuất ·
      **khối 9** 2.150 câu (1.854 · 296) + 38 thẻ · ảnh ở Storage `kho-anh/hat_mam/k<khối>/`. Câu `da_duyet=false`, `nguon='hat_mam'`, `ten_de_goc='Hạt Mầm · <mã HM>'`.
      Thùy 03/10: **"KHTN để GV duyệt 1 đoạn"** ⇒ GV duyệt câu ở màn Duyệt + xử lý thẻ ở Đề xuất.
    - **Treo:** (a) **⚪ 1.927 câu thiếu chuyên đề** (khối 8 chiếm 1.516 — ERP khối 8 thiếu gần hết chuyên đề; 7-Sinh thiếu Bài 28–42; 9 thiếu Dịch mã, Kính lúp) —
      CTO đề xuất thêm loại đề xuất "chuyên đề mới", Thùy CHƯA chốt · (b) **khối 8 chưa nhập** (563 câu đã có chuyên đề; `nhap.mjs` chặn theo từng câu nên nhập phần ⚪
      lượt sau được) · (c) khối 7 có **11 thẻ "dạng mới" cho 5 dạng** (nhập trước khi gộp tên) — dọn = chuyển câu sang thẻ giữ + XOÁ 6 dòng `khtn_de_xuat`, CHỜ Thùy gật ·
      (d) khối 6 HOLD (zip thiếu 1 file) · (e) đề lỗi agent nêu nằm trong `ly_do` các thẻ 🔴.
  - **Kho Tiếng Anh — AI làm đáp án + lời giải (Thùy 03/10: "tiếng Anh thống nhất, không bị tính local như Toán" · "chỉ dùng Sonnet hoặc thấp hơn"):**
    - Chọn model bằng 64 câu mẫu giải mù: Sonnet câu "chắc" đúng 100% · Haiku có câu chắc mà sai + yếu phát âm ⇒ **Sonnet**.
    - Luồng: `scripts/anh/giai_chuan_bi.mjs` (80 lô, câu cùng ngữ liệu chung lô, ảnh biển báo tải về để bên giải XEM; đáp án ở thư mục anh em `<dir>_khoa/`) → agent
      Sonnet theo `scripts/anh/giai_prompt.md` → bên B giải lại độc lập câu thiếu đáp án (`giai_tach_b.mjs`) → **cổng `giai_cong.mjs`**: câu có đáp án ⇒ ghi lời giải khi A
      ra ĐÚNG + chắc + không phương án 2; câu thiếu đáp án ⇒ A=B cùng chắc ⇒ nhận đáp án, tự duyệt nếu lý do chờ DUY NHẤT là "file GV không có đáp án".
      Sau đó Thùy: "câu đã duyệt lại cho thẳng vào kho, chỉ câu m ko chắc mới lên GV" ⇒ `duyet_sau_giai.mjs` duyệt câu chờ mà A chắc + khớp + không lỗi đề.
    - **Kho Anh hiện:** 4.774 câu · **4.225 đã duyệt** · **4.335 có lời giải** (`nguon_giai='ai'`, `giai_method='ai_giai_mu'`) · 13 thiếu đáp án.
    - **549 còn chờ:** 347 KHÔNG CHẮC (249 A phân vân/2 phương án · 54 lệch đáp án — phần lớn đáp án NGUỒN nghi sai · 31 lỗi đề · 13 A/B lệch) ⇒ GV; biên bản
      `scripts/anh/bien_ban/giai-ai-2026-10-03.json` (có cả 289 câu A báo lỗi đề, 97 trong đó đã duyệt — phương án trùng, đề dính câu sau, ngữ liệu EL000542 cắt cụt…).
      **202 câu đáp án chắc nhưng chưa tự duyệt:** 103 ở ĐIỂM CHỜ (trigger chặn tới khi có điểm kiến thức) · 99 A+B thấy NGOÀI PHẠM VI (luật CEO 02/10 loại khỏi kho
      luyện thi vào 10) — **đã hỏi Thùy có đổi không, CHƯA trả lời.**
    - **Chưa kiểm:** app HS có hiện lời giải tiếng Anh sau khi làm bài không.

- **⭐ BOSS RIÊNG (NPC boss cuối, mỗi GV 1 boss) — trạng thái 01/10 đêm: đọc `design/FLOW-NPC-BOSS-CUOI.md` (§0.5 + §A) + `design/DON-HANG-BOSS-THUY.md`.**
  - **Đã xong (boss mẫu = Thùy, chibi từ ảnh chân dung):** 6 tư thế + chân dung (ChatGPT, ảnh gốc `design/bk-ui-src/boss/thuy/01–08.png`; nén
    `public/bk-ui/hs/skin/rpg/boss_thuy_*.png`) · khai `Skin.boss[ma]` (kieu.ts + rpg.ts; khoá = `boss_<ma_gv>` = `loai_quai`) · hoạt ảnh 2D CSS
    (`boss/BossSan.tsx`) + trong trận 3D (`skin/the3d/quaiAnh.ts`, cắm qua `nguonQuai.sinhQuai`, cùng giao diện `Quai`) · 14 câu thoại + 3 chiêu nháp
    (`boss/noiDungBoss.ts`, Thùy sửa chữ) · trang xem thử `hs.html?xem=boss` (6 tư thế + hội thoại) · `&tran=1` (trận 3D, chỉ còn boss) ·
    `hs.html?xem=boss3d&kieu=anh|relief|chibi` (soi cận cảnh, so 3 cách dựng).
  - **QUYẾT ĐỊNH: V1 dùng boss 2D** (`BossAnh.dang = 'anh'`): giống bản vẽ 100%, nhẹ, kịp 06/10. Đã thử 2 cách 3D rồi bỏ: `bossChibi3D.ts` (dựng khối bằng
    code — Thùy chê "thô, không giống") và `quaiRelief.ts` (phù điêu từ chính ảnh, đẹp ≤ ~40° nhưng thêm xử lý ảnh lúc tải). Cả hai giữ trong repo, không dùng.
    3D THẬT (xoay 360°) = ảnh→3D Tripo/Meshy gói trả phí (~$20) → Mixamo — **Thùy chưa quyết**, làm ngoài phiên.
  - **CHƯA làm (việc kế tiếp):** (1) hàm DB `fn_boss_cuoi_cua_toi(p_mon)` (luồng SỐ LIỆU): máu = khoảng cách tới "đạt", pha theo % máu, điều kiện mở, chiêu gọi câu theo loại
    (đạt/chưa đo/yếu), thắng = SUY từ mastery (không lưu) — hợp đồng đề xuất ở FLOW §7.2; (2) trận thật ghép vào `PhieuLuuHS`/`DauView` (hiện chạy dữ liệu giả); pha 2
    (`giaiDoan(2)`), báo hiệu chiêu (`baoHieu()`) đã có sẵn trong `QuaiBoss` nhưng chưa trận nào gọi; (3) cutscene mở/kết ghép vào luồng; (4) âm thanh; (5) soi bằng tài khoản HS
    thật + khổ dọc 390×844 (mới soi 1180×820); (6) khuôn "mỗi GV 1 boss": script `scripts/boss-new.mjs` làm SAU khi khuôn ổn; (7) xin xác nhận bằng chữ trước khi làm boss từ ảnh GV khác.
  - **Hỏi Thùy:** ảnh #02 đường chân tóc thưa hơn ảnh gốc + tròng kính trắng đặc — duyệt "nhận ra mặt" hay vẽ lại · giọng thoại ("ta/em") · xoá file thừa
    `design/bk-ui-src/boss/thuy/exec-*.png` (trùng 02) · hero 3D dựng khối đang lệch chất với boss ảnh — nếu lệch thì vẽ lại hero bằng ChatGPT cùng nét RPG.

- **⭐ BỔ TRỢ (yếu · bù · đuổi) — trạng thái 28/09: đọc `spec-bo-tro.md` (luồng yếu) + `spec-xep-bo-tro-chung.md` (xếp chung).** Tóm:
  **1 lá "Bổ trợ"** (Vận hành) → toggle Đuổi · Bù · **Yếu** · **Lịch phòng** · **Lịch trực**. Yếu = toggle 5 bước Duyệt → Nội dung → Xếp → Trạng thái ca
  → Đánh giá ca (cả folder QLCL cũ chuyển vào; quyền `botro`). Xếp CHUNG theo **đơn vị** (30'×1 TA; Đuổi 4 · Bù 4 · Yếu L2/L3 4 · **Yếu L1 1**; ca
  **đầy khi đủ 3 em/TA HOẶC đủ đơn vị**; phòng ≤2 ca/giờ) · **"+ Xếp" = đã chốt PH, trừ đơn vị ngay** (bỏ bước chờ PH). Lịch phòng = "đang diễn ra"
  3 loại, 2 khu toggle Lịch trực khối / Lịch riêng; mở ngày ⇒ DB gắn buổi xếp bằng form riêng vào ca trực khớp người+giờ. Màn Xếp chỉ hiện **L1–L3**
  (L0 ẩn); **đổi mức trên card**, hạ L0 = dừng bổ trợ (đóng case ket_qua `bo`). **Buổi xong ⇒ case tiến:** TA tick "dạng đã dạy" lúc hoàn tất
  (mặc định tick hết) + mọi dạng vừa dạy được bổ sung câu retest (`_btyeu_bu_retest`, màn Xếp tự bù mỗi lần mở). Buổi đã đóng ca **không đổi được
  ngày/giờ** (trigger). App TA: chạm lại nút điểm danh = bỏ (chỉ khi em chưa làm câu nào). Bài trên app **MCQ tuyệt đối — ngoại lệ duy nhất: dạng
  mức độ 4–5 mà cả dạng 0 MCQ ⇒ trả lời ngắn** (28/09). App HS: card "Học từ đầu" (đuổi) kiểm lại mỗi lần về màn chính.
  **Treo:** 3 dạng mức 2–3 chờ retest không có MCQ + 3 dạng mức 4 chỉ
  có tự luận (phiên MCQ) · retest chỉ hiện trên app TA TỪ NGÀY làm (ERP hiện cả sắp tới — nếu muốn TA biết trước: thêm "Retest sắp tới") · bước 5 KPI
  tải TA (Σ đơn vị có mặt) chưa làm · `migrate` dùng `--only` (4 migration Sổ tay treo).

- **⭐ TRỢ LÝ (tab 🤖 trong Việc của tôi) — trạng thái 29/09: đọc `SPEC-troly-nhansu.md` §6–§7.** Tóm: **báo cáo là chính, hỏi là phụ**;
  chỉ 3 tài khoản (Thùy · Thùy Trang · Bảo Lộc). Hai bản tính ở Postgres, KHÔNG realtime (lưu DB, "↻ Tính lại" ghi đè): **Báo cáo Sư phạm** (của Trang —
  3 luồng: đếm chậm/miss → Detail → cảnh báo) và **Tổng kết tuần** (dashboard theo BẢNG, mỗi chỉ số so với **thường đạt = trung bình 8 tuần gần nhất
  đã lọc nhiễu**, xếp hạng GV–TA, trình chiếu mỗi bảng một màn). **Treo:** báo cáo Vận hành của Lộc chưa có mẫu · thông báo thứ Hai chờ khai
  `TROLY_PUSH_APP` + deploy · khung hỏi chưa nối 13 công cụ DB. Chi tiết: mục "⭐⭐ TRỢ LÝ" bên dưới.

- **⭐⭐ KHUNG CHẾ ĐỘ GAME HỌC — DÙNG CHUNG MỌI MÔN (Thùy chốt 03/10): "các chế độ cho mọi môn, chỉ thay content, chế độ game giữ nguyên".** Bản đầu = game **Đấu Từ** (từ vựng Anh, `src/dautu/`, spec `spec-dau-tu-vung.md`).
  - **6 chế độ chuẩn** (môn nào làm game cũng có đủ 6, luật y hệt) — ⚠ áp vào app HS 03/10 đã đổi: mỗi người 1 lần bấm/câu, Đấu đôi hoãn, Tournament ⇒ Giải Vô địch BK, Vô tận có Normal/Hard — xem khối KHU HỌC TẬP:
    1. **Luyện tập** — đấu với bot (3 mức Dễ/Vừa/Khó; bot = Boss Thùy), tạm dừng được.
    2. **PvP** — đấu online 1–1: ghép ngẫu nhiên (hàng chờ) · thách đấu bằng mã phòng 6 số / link / mời bạn đang online.
    3. **Đấu đôi** — 2 người 1 máy (iPad/PC, 2 khu trả lời đối diện, phím A S Z X / J K N M).
    4. **Tournament** — giải 8 người loại trực tiếp (Tứ kết → Bán kết → Chung kết), thắng xong chờ người thắng cặp bên cạnh rồi đấu ngay, thiếu người thì bot, xem trực tiếp trận khác, hoà ⇒ đúng nhiều hơn rồi nhanh hơn.
    5. **Leo tháp — Sinh tồn**: tháp hôm nay (mọi người cùng chuỗi câu, seed theo ngày VN), 5 phút leo càng cao càng tốt, sai trừ 3s.
    6. **Leo tháp — Vô tận**: 10s/câu, mỗi 10 tầng −1s (sàn 3s), sai/hết giờ là thua. Leo tháp có BXH Hôm nay / Kỷ lục.
  - **Luật trận (chế độ 1–4):** câu 4 đáp án, 12s/câu, hai bên trả lời cùng lúc, ai đúng trước ăn câu (100/70/50 theo tốc độ, chuỗi 3 +30). Combat 2D = bộ chiến đấu Đấu trường (`screens/hocsinh/skin/heroDau.ts` + `thuthach/hieuUng.ts`, KHÔNG 3D): mỗi câu ăn được 1 đòn nhỏ, cuối trận đòn kết liễu.
  - **Phần DÙNG CHUNG (không dính môn):** `lib/trongTai.ts` (trọng tài) · `bot.ts` · `phien.ts` · `mang.ts` (sảnh/phòng realtime) · `giai.ts` · `thap.ts` (luật tháp) · `ui/SanDau2D.tsx` · màn `ManDau`/`Giai`/`LeoThap`/`Online`. Câu trong trận = `Cau { id, opts[4], dao }`.
  - **CHỖ CẮM CONTENT = `src/dautu/nguon/` (ĐÃ LÀM 03/10, Thùy: "mỗi môn có kho content riêng, đều MCQ — bản chất chỉ đổi chỗ cắm"):** `kieu.ts` (câu `Cau` tự đủ: đề · ảnh · 4 phương án · đáp án · lời giải — máy khách online không tra kho) · `index.ts` = REGISTRY môn → nguồn (1 chỗ, CLAUDE §1.6) · `anh.ts` (từ vựng demo) · `kho.ts` (môn có kho DB: **Toán (nhánh Đại) + KHTN đã cắm và chạy thật**).
    - **Thêm môn = 1 dòng ở `nguon/index.ts`** (`taoNguonKho({ mon, ten, icon, giayMoiCau, giayThap, capMacDinh })`) nếu môn đã có trong registry kho DB (`_kho_cau_tbl`/`_kho_ban_do_tbl`); không sửa trọng tài/mạng/giải/tháp/màn. Hiện đề bằng `ChuMon` (registry hiển thị theo môn của app: Toán/KHTN = LaTeX, Anh = chữ thường).
    - **DB (mig 202610030132):** `fn_dtv_kho_khoi` · `fn_dtv_kho_chu_de` · `fn_dtv_kho_bo_cau` — chọn câu bằng ĐÚNG `_kho_dk_mcq_sql` (kho_chuan + trắc nghiệm gốc | form TN đã duyệt ⇒ lấy 4 phương án của form), đúng 4 phương án, thứ tự TẤT ĐỊNH theo seed (tháp hôm nay), tháp khó dần từ từ (mức độ + thứ tự/25). Ghi trận/tháp có nhãn môn: `fn_dtv_ghi_tran_mon`, `fn_dtv_thap_ghi_mon/bxh_mon` (BXH tháp tách môn + khối; `dtv_thap_luot.nhom` = khối); hàm cũ thành vỏ gọi hàm mới.
    - **Theo môn, KHÔNG theo game:** thời gian câu (Anh 12s · KHTN 30s · Toán 45s; ngưỡng điểm tốc độ co giãn theo, bot chậm theo tỉ lệ), thời gian gốc Vô tận (Anh 10s · KHTN 25s · Toán 40s, −10%/10 tầng, sàn 30%), có kiểu đố đảo chiều không (chỉ Anh), có sổ nhớ từ/Nối từ/Góc luyện tập không (chỉ Anh).
    - ⚠ Nợ: `fn_dtv_kho_*` mở cho anon (game chưa đăng nhập) — ai có anon key gọi được để lấy câu kho (trần 200 câu/lần) ⇒ khi ghép app HS chỉ `authenticated`. Toán mới cắm nhánh Đại (Hình/HGT: thêm `p_nhanh`). XP vẫn chung mọi môn (CLAUDE §1.6 muốn EXP theo môn) — sửa khi ghép app HS.
  - **Trạng thái 03/10:** chạy được, test local (`npm run dev:dautu` → http://localhost:5293/dautu.html, iPad cùng Wi-Fi `http://<IP máy>:5293/dautu.html`, `?may=2` = hồ sơ thứ 2 cùng trình duyệt). **KHÔNG deploy riêng — game nằm TRONG app HS** (entry `dautu.html` chỉ để test). DB: `dtv_nguoi_choi` · `dtv_tran` · `dtv_thap_luot` · `dtv_gop_tu` · `dtv_gop_y` + `fn_dtv_*` (mig 202610022343 · 202610030037 · 202610030056, đã áp).
  - **Nợ khi ghép vào app HS:** người chơi = thiết bị (uid ở máy) ⇒ đổi sang tài khoản HS; trọng tài = máy chủ phòng (tin client) ⇒ server chấm khi có thưởng; sổ nhớ từ ở localStorage ⇒ nhật ký DB; dựng lại UI bằng `skin/KhungHS` + `check:style-hs`; season/điểm season (spec-dau-tu-vung.md §4) chưa làm. Hồ sơ test "Claude Test"/"Claude Test 2" giữ lại (Thùy).
- **⭐⭐ GIAO DIỆN APP HS — CẬP NHẬT CUỐI NGÀY 03/10 (luồng Giao diện) · TRÊN `main` + `thu-nghiem` (ff), CHƯA DEPLOY — Thùy tự bấm Create Deployment (auto-deploy Vercel tắt)**
  - **LỜI CHỮ THEO STYLE (Thùy chốt 03/10):** app có chế độ chọn — ai thích game chọn style game, ai không thích chọn style mặc định; chữ "múa máy" được nhưng **BẢN GỐC PHẢI FORMAL**.
    `skin/loi.ts`: `LOI_FORMAL` (gốc, mọi style không khai đều dùng) + `LOI_GAME` (RPG · Khối vuông khai `Skin.loi`), màn đọc bằng `useLoi()` (KhungHS) — KHÔNG so id style, KHÔNG gõ chữ giọng game thẳng trong màn;
    thêm khoá = viết bản formal TRƯỚC. Cờ `giongGame` cho màn có chữ hai giọng (Hướng dẫn chơi). Đã áp: màn đấu 2D, Hướng dẫn chơi. Luật ghi ở `design/STYLE-HS.md` §2.5.
  - **MÀN ĐẤU 2D thay 3D (Học theo chủ đề):** `phieuluu/DauView2D.tsx` (HUD gọn trên cùng, câu hỏi gần trọn màn, sân bung DƯỚI HUD khi tung chiêu) + `SanDon2D.tsx` (nhân vật chính em chọn 15 tư thế bên trái, quái/boss phải,
    đòn bằng canvas `thuthach/hieuUng.ts`). Combo 3 câu = 1 chiêu (3/3 tuyệt kỹ … 0/3 xịt: quái hồi 1 máu), tổng sát thương = tổng câu đúng. Dev: `hs.html?xem=boss&ma=<boss>&tran=1&nvc=<nv>`, `window.__san.phat('boss_ma_thuat')` (chỉ dev).
    ⚠ StrictMode (dev) chạy effect 2 lần: effect có cờ chống chạy lại + cleanup xoá hẹn giờ ⇒ PHẢI mở lại cờ trong cleanup (sân từng kẹt mở).
  - **QUÁI 2D TẠM = 7 con CC0** (SethByrd/OpenGameArt "Cute Characters, Monsters…", tách từ `Enemies.psd` bằng ag-psd ở thư mục tạm — KHÔNG đưa PSD vào repo): `ban2d/quaiCc0.ts` (mã `loai` → 1/7 hình theo băm, cùng mã luôn cùng hình), nguồn
    `design/bk-ui-src/AppHS/quai-cc0-sethbyrd/` (+README giấy phép), nén `scripts/anime-quai-cc0.mjs` → `public/bk-ui/hs/skin/rpg/../quai2d/`. `anhBoss`/`tenQuai2D`: boss riêng (`Skin.boss`) trước, rồi 7 con này. Hình SVG tạm `QuaiTam` đã bỏ. Thùy sẽ tự thiết kế boss riêng.
  - **BOSS CÓ HOẠT ẢNH THEO KHUNG — MINH QUÂN (MQ):** hợp đồng `skin/kieu.ts`: `ClipBoss {src, ms, lap, rong, px, lat}` · `ChieuBoss {ten, kieu: tia|don|mua, clip, phongMs, qua, daiTia}` · `BossAnh.khung/chieuRieng/anhTenLua/fx`.
    `BossAnhHS` (boss/BossSan.tsx) phát clip theo khung (mọi khung sẵn DOM, đổi opacity; clip 1 lần giữ khung cuối; giảm chuyển động ⇒ 1 khung tĩnh). `SanDon2D.dienBoss`: đòn "ma thuật" của boss có `chieuRieng` ⇒ xoay vòng 3 chiêu:
    **tia laser** (ảnh vẽ hướng PHẢI nên chỉ clip laser lật ngang — ngực có chữ MQ; tia dài cố định ⇒ boss **LAO** sang trái cho đầu tia tới ngực nhân vật) · **tên lửa đơn** · **mưa tên lửa** (ảnh FX bay bằng Web Animations, vòng cung, nổ, nhân vật bị đánh đúng lúc).
    Nguồn `design/bk-ui-src/AppHS/Animation/minh-quan-boss/` (44 PNG; KHÔNG commit zip/sheet/qa), nén `scripts/anime-boss-mq.mjs` **WebP q95** (q82 mất ~17% độ nét — Thùy chê mờ; đo Laplacian) → `public/bk-ui/hs/skin/rpg/boss/mq/` (5,8 MB, chỉ tải khi boss xuất hiện).
    `rpg.ts` khai `boss_mq`; lời thoại BẢN NHÁP `boss/noiDungBoss.ts` (Thùy/Minh Quân duyệt). **CHƯA nối chặng thật:** DB chưa trả mã boss GV (`boss_mq`) — hộp thư Số liệu spec §13.6. Soi: `hs.html?xem=boss&ma=boss_mq` (6 tư thế + hội thoại) · `&tran=1`.
  - **4 KIT LỤC ĐỊA CÒN LẠI (núi lửa · đông gió · biển đảo · trời sao):** `scripts/anime-kit-lucdia.mjs <biome,...>` (chạy RIÊNG kit — chạy toàn bộ gãy vì nguồn kit BĂNG không có trên mọi máy; kit khác giữ số đo cũ trong `kitLucDia.anh.ts`) +
    `scripts/anime-duong-kit.mjs <thư mục soi> <biome,...>` (dò đường thật; mặt nạ: núi lửa đá be · đông gió cát cam · biển đảo/trời sao mặt đảo rộng ⇒ đường cắt qua mặt đảo, chấp nhận). nui_lua + dong_gio cùng bố cục (DESIGN.md) nhưng vẫn phải
    ĐỐI CHIẾU xếp chồng với reference (lệch 1–3%); **bien_dao + troi_sao KHÔNG có DESIGN.md và bố cục KHÁC** ⇒ tự đo từ reference (xếp công trình lên nền, so mắt; thử khớp tự động theo màu KHÔNG đáng tin vì công trình sinh lại khác reference). Cầu troi_sao neo giữa mặt cầu (`neoRieng`).
    **Còn thiếu:** kit BĂNG tầng lục địa · nền màn DẠNG BÀI cho troi_sao · dong_gio · thanh_co (vẫn cảnh three.js).
  - **MÀN DẠNG BÀI (`Chang2D`) — BẤM THẲNG VÀO MÀN ĐẤU (Thùy 03/10):** bỏ tấm chi tiết bên phải/dưới + sương/làm xám công trình chưa đo (trông như khoá) + huy hiệu ×N; bấm công trình ⇒ nhấc lên + sáng ~0,32s rồi `onVao` (kéo cuộn không tính là bấm; giảm chuyển động ⇒ vào ngay);
    tên dạng 19px đậm, sao 28px. Mất: xem trước đội hình quái trước khi vào.
  - **CHUYỂN CẢNH MƯỢT (Thùy 03/10 "vào world map chưa mượt"):** thủ phạm = 3 khoảng trống nối đuôi (tải chunk → gọi RPC bản đồ → ảnh giải mã giữa lúc hiện dần) + mỗi tầng "mờ về 0 rồi mờ lên từ 0". `phieuluu/chuyenCanh.tsx`: `napPhieuLuu(mon)` (chunk + `fn_ban_do_phieu_luu`
    giữ 25s + giải mã ảnh thế giới; `HocTapHS` gọi lúc rảnh qua prop `onNap`) · `nhoAnh()` (trần 1,5s) · `ManCho` = 1 màn chờ duy nhất. `PhieuLuuHS`: tầng chuyển bằng **LỚP CHỒNG** `[màn cũ, màn mới]` (giữ instance cũ ⇒ cú phóng chạy hết, 700ms sau gỡ); đi sâu = vào từ scale 1,07, đi ngược = từ .95;
    từ/đến màn ĐẤU KHÔNG chồng (đấu sinh lượt luyện — dựng 2 lần là sai). Soi PhieuLuuHS thật không cần đăng nhập: `hs.html?xem=phieu_luu&that=1` (`XemThat.tsx`, nhồi dữ liệu giả vào bộ nhớ nạp trước). **Chưa đo thời gian thật** (pane ẩn nên hoạt ảnh CSS đứng) — bấm đảo trên bản deploy mới chắc.
  - **HƯỚNG DẪN CHƠI (gallery) + TUTORIAL TƯƠNG ỨNG (Thùy 03/10):** vào từ thẻ đầu **Thư viện BK**. `huongdan/HuongDanHS.tsx` (gallery tìm bỏ dấu + 4 nhóm → trang ĐỌC bằng `ManDocHS`) · chữ ở `huongdan/noiDungHuongDan.ts` (19 chủ đề; thân bài FORMAL, style game chỉ ghi đè tên + tóm tắt;
    `sap:true` ⇒ nhãn "Sắp có": Chuỗi, Góp ý). Số liệu lấy từ code/DB (agent kiểm kê 03/10), **số chưa chốt KHÔNG nêu** (Đấu trường 3 trận, trần Điểm Rank tuần, ngưỡng điểm từng bậc, tỉ lệ vòng quay, giá quà). Tutorial viết lại **12 chặng** khớp 1-1 (`tutorial` của chủ đề = id chặng),
    7 màn mô phỏng mới, `TutorialHS` thêm prop `chuong` (chế độ MỘT chặng, mở từ nút "Xem hướng dẫn tương tác"). Soi: `hs.html?xem=huong_dan` (`&muc=<id>` · `&gd=toi_gian|khoi|rpg` · `&tut=<id chặng>`). Xuất bản đọc-để-duyệt: `node scripts/xuat-huong-dan-md.mjs` → `HUONG-DAN-CHOI-DUYET.md`.
    **Chỗ lệch spec/DB (viết theo DB, chờ Thùy chốt):** vòng quay 1 lượt/ngày/**HS** (spec ghi /môn) · xu = ceil(EXP/100) (comment ViXuHS nói bảng khúc luỹ tiến) · "chỉ câu mới" thực tế tránh MỌI câu đã gặp (UI/tutorial cũ ghi ~1 tháng) · Luyện dạng yếu DB 60/40 (spec muốn 80/20) · ngưỡng 2 bậc thần (28.350 · 30.240) là CTO đề xuất, chưa Thùy chốt.
    **Tutorial CHƯA gắn luồng thật:** không tự mở lần đầu, tiến độ không lưu DB (cần cột/RPC `da_xem_tutorial` — không dùng localStorage). Chuỗi làm bài chưa có chặng (màn ngọn lửa chưa có).
  - **SỬA LỖI "Đấu trường BK (Tiếng Anh) về Home":** service worker PWA trả `index.html` cho mọi điều hướng không khớp bộ lưu sẵn — `dautu.html?nhung=1&…` có query nên bị trả nhầm app HS. `vite.config.hs.ts` `navigateFallbackDenylist` thêm `/^\/dautu\.html/`. Chỉ lộ ở bản build/PWA (dev không có SW); máy cũ cần mở lại app/xoá dữ liệu trang để nhận SW mới.
  - **Việc treo / cần Thùy:** ① push + deploy `thu-nghiem` rồi bấm thử luồng Học tập → world map → lục địa → chặng → đấu (đo độ mượt thật) ② duyệt `HUONG-DAN-CHOI-DUYET.md` (chữ + số) ③ chốt 5 chỗ lệch ở trên ④ ảnh kit BĂNG + nền dạng bài 3 biome + nền chibi 3 kit cũ ⑤ nối boss GV (`boss_mq`) vào chặng (cần Số liệu) ⑥ tutorial tự mở lần đầu (cần DB) ⑦ **worktree rác ~20 GB** trong `.claude/worktrees`: Thùy nói "context khác sẽ đo" — KHÔNG tự xoá (Luật xoá).
- **⭐⭐ KHU HỌC TẬP + NHÂN VẬT CHÍNH + CHINH PHỤC BK (luồng Giao diện, chốt hết 03/10) — ĐỌC `spec-che-do-game.md` §7 trước khi sửa · TRÊN `main` + `thu-nghiem`, CHƯA DEPLOY · cờ `hoctap` MẶC ĐỊNH TẮT ở Production**
  - **Logic (Thùy 03/10):** ô "Tự luyện" ngoài Home ⇒ **"Học tập"** → 5 ĐẢO trôi trên trời sao: **Học theo chủ đề** (bản đồ phiêu lưu) · **Luyện dạng yếu** · **Đấu trường BK** (PvP + PvE với bot) ·
    **Chinh phục BK** (leo tháp) · **Giải Vô địch BK** (giải trực tiếp đăng ký trước + đấu với máy = Thử thách cũ giữ luật + Rank). Khối = khối em đang học, KHÔNG cho chọn khối khác (mọi chỗ).
    **Mỗi người chỉ được bấm 1 lần/câu ở mọi môn** (không thành game nhanh tay; cả hai sai ⇒ hết câu). "2 người 1 máy" HOÃN với Toán; "Giải đấu 8 người" đã thành Giải Vô địch.
  - **Code:** `screens/hocsinh/hoctap/` — `HocTapHS.tsx` (5 đảo: `TroiDao`, `useSan` sân 16:9/9:16 contain, `VT_NGANG`/`VT_DOC`, phóng vào đảo 480ms rồi mới chuyển màn; + `GameNhungHS` + `GiaiVoDichHS`) ·
    `ChonNhanVatHS.tsx` · `ChinhPhucHS.tsx` · `XemHocTap.tsx`. Ảnh: `Skin.hocTap` (kit hs-hoc-tap-v2, `scripts/anime-hoc-tap.mjs` → `skin/styles/rpgHocTap.ts`) · `Skin.chinhPhuc` (kit hs-chinh-phuc-bk-v4,
    `scripts/anime-chinh-phuc.mjs` → `rpgChinhPhuc.ts` + `public/bk-ui/hs/skin/rpg/chinhphuc/`). Style không khai ⇒ lưới ô thường / menu leo tháp cũ.
  - **Cờ + thử nghiệm:** `phieuluu/coBat.ts` — `hocTapBat()`/`phieuLuuBat()`, ép bằng `?hoctap=1|0` · `?phieuluu=1|0`; `banThuNghiem()` đọc `__VERCEL_ENV__` (define ở `vite.config.hs.ts`) ⇒ bản **Preview** của Vercel
    luôn BẬT, **Production** luôn TẮT. Nhánh thử = **`thu-nghiem`** (fast-forward theo `main`). ⚠ **Thùy phải sửa Ignored Build Step trên dashboard** thành
    `[ "$VERCEL_ENV" = "production" ] || [ "$VERCEL_GIT_COMMIT_REF" = "thu-nghiem" ] && exit 1 || exit 0` — bản cũ huỷ mọi build Preview.
    Xem thử không đăng nhập: `hs.html?xem=hoc_tap&mon=Toán|KHTN&khoi=7` (`&nv=0` xem lại màn chọn nhân vật) · `hs.html?xem=phieu_luu` (`&nd=N` số dạng giả). Tài khoản thử: TEST01–TEST10 (mig 202610031034).
  - **NHÂN VẬT CHÍNH (6 = 2 nhà thám hiểm + 4 class mới su_tu · cao · ninja · elf):** chọn ngay lần đầu bấm "Học tập", dùng cho MỌI hoạt động (bản đồ chạy + Đấu trường 15 tư thế).
    DB `hs_nhan_vat_chinh` (chưa chọn = KHÔNG có dòng) + trigger log `hs_nhan_vat_chinh_log` + RPC `fn_hs_nhan_vat_cua_toi()` / `fn_hs_chon_nhan_vat(p)` (mig 202610031334 + 202610031341, ĐÃ ÁP).
    1 cửa vẽ: `skin/nhanVat.ts` (`NvId`, `NV_CHON`, `anhChayNv`/`hopVeNv`/`anhDauNv`/`hopDauNv`…); 4 class sinh từ kit 197MB `design/bk-ui-src/AppHS/Animation/nhan_vat_moi_v1` (KHÔNG commit) bằng `scripts/anime-nhan-vat-chinh.mjs` → `skin/nhanVatChinh.ts`.
  - **Học theo chủ đề:** luôn mở bản đồ trong khu Học tập (không phụ thuộc cờ phiêu lưu). **Màn DẠNG BÀI (chặng) đã đổi sang NỀN TRANH:** biome có `nen_dang_<biome>.jpg` (7 biome, `scripts/anime-nen-dang.mjs`)
    ⇒ nền ngang có đường vẽ sẵn, lặp gương theo bề dài; mỗi dạng = 1 công trình của chính lục địa đó (rải đều 8 loại, to dần), không dựng three.js. Lục địa → dạng: phóng 2,4× vào cửa công trình 460ms.
    Lục địa có nút quay lại. Kit băng (`hs-luc-dia-bang-v1`) đã nén nhưng tầng lục địa băng CHƯA bật (chưa có `KIT_LUC_DIA.bang` + đường dò).
  - **Đấu trường / Chinh phục = game `src/dautu` nhúng khung** `dautu.html?nhung=1&vao=chu_de|thap&mon=&khoi=` (`dautu/lib/nhung.ts`; lùi ở màn đầu ⇒ `postMessage({dtv:'thoat'})` đóng khung).
    **Chinh phục BK** = màn tháp riêng: tháp tổng giữa + N tháp chủ đề (= `fn_dtv_kho_chu_de` của khối, ≤8 mẫu) theo preset N, đế đảo + cầu sáng; chọn tháp ⇒ Sinh tồn / Vô tận Normal vào thẳng ván
    (`&cd=&tcd=&che=`). **Tháp chủ đề = câu của chủ đề đó + BXH riêng** (`nhom = 'khối|mã chủ đề'`, `taoThap/nhomThap` nhận `chuDe`). Điện thoại dọc: sân cao 62% màn, vuốt ngang.
  - **CHƯA LÀM (logic đã chốt, xem spec §7):** chọn câu theo MỨC ĐỘ (đấu 1–3, Hard 4–5) · bot theo thời gian/độ đúng thật · Vô tận **Hard** (3 lượt/ngày cộng dồn — nút đang "sắp mở") · **khoá tháp chủ đề**
    theo tiến độ học · Giải Vô địch thật (đăng ký DB, giành quyền trả lời, 4 phút, thưởng xu — hiện chỉ màn demo) · Luyện yếu 80% dạng yếu / 20% ngẫu nhiên · game nhúng vẫn dùng hồ sơ THEO MÁY
    (chưa tài khoản HS, chưa nhân vật chính) · Thử thách thật (`LamThuThach`) chưa phải đấu trường 2D · `DauView` (màn đấu bản đồ) chưa có nhân vật mới · tầng cao nhất dưới nhãn tháp ·
    "Đề thi đầu vào M9" hiện như 1 chủ đề Toán 7/8 (dữ liệu kho) · Đơn 14 (Kit A/B/C, `design/DON-HANG-SKIN-HS.md`) đã nhận A + B.
- **⭐⭐ GAME BK ("BK World", tên tạm) — trạng thái cuối 02/10 tối (máy công ty). ĐỌC `spec-bk-world.md` (file TỔNG) → `spec-bat-thu.md` §0–§1 + §3.3–§3.5 TRƯỚC KHI LÀM.**
  - **Thiết kế tổng của CEO (01/10, `spec-bk-world.md`):**
    - học ⇒ **điểm học tập** (1 nguồn duy nhất = "lượt học thật", gộp luôn "điểm chăm chỉ" của Nông Trại);
    - điểm học tập mua hạt / vé dungeon;
    - **3 hoạt động:** trồng cây · bắt thú · ấp trứng;
    - nông sản bán ra xu, HOẶC chế bóng bắt quái (nhiều loại);
    - quái bắt về nuôi, lai ra trứng, ấp ra loài mới theo **công thức**;
    - có shiny + alpha;
    - nhiệm vụ NPC ra xu;
    - **2 đường kiếm xu, CHUNG 1 trần tháng**;
    - quái/trứng KHÔNG bán ra xu; CHƯA cho đổi quái.
  - **V1 (06/10) = ĐỦ TÍNH NĂNG, số lượng ít** (CEO bác đề xuất "V1 chỉ trồng cây"). Kế hoạch + lịch: spec-bk-world §5.
    - ⚠ **01–02/10 dồn hết vào HÌNH THÚ.** Phần hệ thống V1 (điểm học tập, kho đồ, ruộng online, dungeon, chế bóng, lai/ấp, NPC, gắn app HS) **CHƯA BẮT ĐẦU**.
    - CTO đã hỏi "mở luồng hệ thống song song?" — **CEO chưa trả lời.**
  - **Chiến lược CEO (spec-bat-thu §0):** muốn chơi phải học; kết quả học thành tài sản + khoe; superapp tạo gắn bó; HS chơi vì bạn bè + xu, không làm game thật hay. Pháp lý NĐ 147: CEO KHÔNG lo, đừng nêu lại.
  - **Phase đầu (CEO 01/10):** GÁC boss; chỉ bắt thú + ấp trứng; **thú DỄ THƯƠNG**; **cưỡi thú là tính năng quan trọng** (thiết kế: spec-bat-thu §3.2; điểm yên đã có sẵn trong khuôn).
  - **THÚ LÀM BẰNG CODE three.js (không mua asset)** — CEO duyệt hướng.
    - **4 tầng:** 1 thường · 2 săn mồi đỉnh · 3 thần thoại · 4 truyền thuyết. Tầng 1–2 làm nhiều, tầng 3–4 mỗi tầng 1–2 con.
    - **4 khuôn dáng:** 4 chân · bay · bơi · bò trườn.
    - **QUY TRÌNH CHUẨN = skill `lam-thu`** (`BatThu/.claude/skills/lam-thu/SKILL.md`) + spec-bat-thu §3.5:
      - research ảnh nhiều góc của mẫu gốc;
      - đo **profile độ dày dọc thân + mặt cắt ngang**;
      - dựng trên khuôn, mỗi loài = 1 dòng tham số;
      - tự kiểm bằng **ảnh chồng đường bao lên ảnh gốc**;
      - CEO duyệt;
      - lưu asset (công cụ xuất GLB + ảnh đại diện: CHƯA làm).
    - **Bảng loài** (spec §3.5):

      | Loài | Trạng thái |
      |---|---|
      | Cáo Lửa (ý Foxparks) | ✅ |
      | Cừu Mây (ý Lamball) | ✅ |
      | **Băng Thần Mã** (ý Frostallion) | 🔧 có cánh pha lê 3 tầng lông (`2102906`), **nhưng CEO muốn cánh y Frostallion**: khối TRƠN LIỀN điêu khắc, gốc cánh KHÔNG lông, ngoài tách 4–5 phiến dài cong vút lên, cánh rất to. Kèm bờm/đuôi bông xoăn như mây, mặt nạ pha lê băng, túm lông ngực. Ảnh mẫu: `BatThu/.snap/tham-khao/frostallion/` |
      | **Thiên Kình** (Panthalus 90%) | 🔧 **bản 5 (`b37ecaa`)**, CEO xem từng bước trong phiên, chưa chốt duyệt: thân dẹt bè · **vòng hào quang KÍN** quanh đầu (thân nằm hẳn trong, hở đều, gai xen dài–ngắn + ngọc) · mắt lên mặt (thấy từ chính diện) · **4 vây mặc định XÒE** · thân ống elip nội suy mượt (nhìn trên thon liền, hết gãy sau vai) · chuyển động mềm (lò xo mềm hơn, trộn 0,55 s, lọc τ 0,09 s). **Còn: nhìn từ trên đầu chưa RỘNG HƠN NGỰC 1,15–1,25×** (4b dở ở nhánh wip). Ảnh: `BatThu/.snap/voi-ban5.jpg` · mẫu `.snap/tham-khao/` |

    - **25 động tác khuôn 4 chân: CEO duyệt.** Mô-đun cánh `canh.ts` dùng lại (kiểu lông vũ / pha lê / màng dơi; CẦN THÊM kiểu "phiến trơn" như Frostallion). Khuôn bơi có `ChuoiUon` dùng lại cho bò trườn.
  - **Chờ CEO:**
    1. **mở luồng hệ thống V1 song song** (gấp, hạn 06/10);
    2. **tên game:** Làng Bách Thú (thú gọi BKmon) · BKmon · Thung Lũng BK · Đảo Mầm (spec-bk-world §6);
    3. **"kỳ lân" = con lân VN (Tứ linh) hay unicorn?**;
    4. **để V1.1:** giúp/hái trộm vườn bạn, gà bò, cưỡi thú, thấy người chơi khác, boss? — CEO đáp "t làm hết", **chưa rõ** nghĩa là đưa hết vào V1 hay CEO tự điều phối;
    5. Nông Trại (a)–(d) bên dưới.
  - **Giữ chân app HS** (`design/giu-chan-hoc-sinh-kieu-duolingo.md`):
    - app 2 tầng: bắt buộc / tự nguyện;
    - tin báo PH ĐÃ CÓ ở app PH;
    - thứ tự đề xuất: học trước chơi sau → GV khen → nhiệm vụ lớp → pet Finch → giải đấu tuần → chuỗi tự nguyện.
  - **CODE — project riêng `BKGame`, 2 repo GitHub riêng tư** (KHÔNG gộp vào repo ERP; spec/DEVLOG/HANDOFF/migration `fn_*` của game vẫn ở repo ERP):
    - **`HongThien/bk-bat-thu`:**
      - **nhánh `thu-de-thuong` = bản TỐT mới nhất (`b37ecaa`)**: thú làm bằng code `src/thu/`, trang thử `thu-demo.html` (`?loai=bang_than_ma`, `?che=gan|trung`, `?dt=`) + `ca-voi-demo.html`, skill `lam-thu`;
      - **nhánh `wip-0210-bi-ngat`** (`a9783e0`) = phần sửa DỞ khi 2 luồng bị ngắt do lỗi mạng: ngựa theo hướng "phủ lông kín" (**hướng SAI**, chỉ lấy lại phần "cánh to hơn" nếu dùng được) + cá voi 4b dở. **Đừng gộp thẳng.**
      - `main` (`9a54b05`) = bản thử bắt thú + khu đấu boss, chưa gộp nhánh thú.
      - Vite + TS + three r186 + three.quarks. Launch `bat-thu` (5280).
      - Máy công ty `C:\Users\WBPC\Desktop\BKERP\BKGame\BatThu`; máy nhà `C:\Users\Admin\Desktop\BKERP\BatThu` (launch máy nhà sửa local, đừng commit đè).
      - Bản thử cũ: 23 loài Quaternius · hoạt cảnh bắt · đội 5 + sổ thú · thấy tối đa 10 người · khu đấu boss (gác). `npm run kiem` hỏng vì `tools/kiem-luat.mjs` chưa từng commit (máy nhà?) — `npx tsc --noEmit` thì sạch.
    - **`HongThien/bk-nong-trai`:**
      - bản mới nhất `nhip-ngay` @ `9556216`; worktree `NongTrai-dohoa` (`do-hoa-thu`);
      - máy công ty `BKGame\NongTrai`, đã nối remote.
    - Máy công ty có `BKGame\CLAUDE.md` + `BKGame\.claude\launch.json` (cục bộ, không thuộc repo nào).
    - **⚠ Không đặt repo trong thư mục Google Drive sao lưu** (`E:\BK ACADEMY\…`, `G:\Other computers\…`): Drive thả `desktop.ini` vào `.git/refs` ⇒ git hỏng.
  - **Chế độ TRỒNG TRỌT = Nông Trại nhịp ngày. Đọc `spec-nong-trai-nhip-ngay.md` trước khi sửa:**
    - Kiểu Nông trại vui vẻ, vào 1 lần/ngày.
    - Pha 1: trồng cây + gà, bò + chó; lò/mèo/chim/trang trí tắt bằng `PHA`.
    - **Chơi màn ngang, bố cục y ảnh Nông trại vui vẻ** (§2.1):
      - ruộng 12 ô to, liền nhau; sân rào; ao;
      - **góc camera `HUONG (0.55, 1.05, 0.95)` đừng đổi**;
      - PWA + thanh "Việc hôm nay".
    - **Kinh tế lần 5** (§3.2, §5): mở khoá theo tuần · tưới +80% · bonus mùa đầu giảm dần · trần chi 5 xu/tháng · giả lập 5.000 HS. Theo BK World: "điểm chăm chỉ" → điểm học tập (lượt học thật).
    - **Chờ CEO:**
      - (a) nhà 10 mức nâng bằng vật liệu nhiệm vụ hay bằng xu;
      - (b) sổ thu chi;
      - (c) dạy chó;
      - (d) hạ trần tháng 2 xuống ~40?
    - **Chạy:** launch `nong-trai` (5270) · `node tools/test-engine.mjs` (đọc DÒNG CUỐI).
  - **Bài học còn hiệu lực (làm thú):**
    - CEO nhắc tên mẫu ⇒ **xem ảnh mẫu TRƯỚC khi dựng và trước khi hiểu góp ý**. Ngựa làm theo tên Frostallion mà chưa xem ảnh ⇒ sai cánh; t còn hiểu ngược góp ý "gốc cánh không lông".
    - Góp ý hiểu được 2 chiều ⇒ gửi ảnh + cách hiểu để CEO xác nhận rồi mới giao sửa.
    - Dáng thoải đều trông "lù đù"; thân tròn đều trông "dày người" ⇒ đo profile + mặt cắt từ ảnh.
    - Luồng nền tự chấm luôn lạc quan (85–90% khi thật ~70%) ⇒ chấm bằng ảnh chồng đường bao, CTO tự xem ảnh trước khi gửi CEO.
    - Palworld cách điệu khối trơn, điêu khắc mượt (cánh = tay nhẵn + phiến; bờm = cụm bông), không làm lông rời.
    - **Đường bao phải liền mượt** (spline đơn điệu, quét mặt cắt liên tục) — ghép nón thẳng giữa các mốc ⇒ gãy góc, CEO thấy ngay từ góc TRÊN ("tự dưng tụt hẳn vào"). Soát luôn ảnh từ trên thẳng xuống.
    - Mắt dò ngang ở chỗ đầu rộng nhất ⇒ nằm đúng mép bao ("mắt ở viền"); phụ kiện bao quanh thân phải KÍN, hở đều, không chân cắm vào thân; dáng nghỉ (vây/cánh) giữ đúng ảnh mẫu, không ép sát cho gọn. Chi tiết: skill `lam-thu` Bước 2–3.
    - **Mạng công ty (proxy) có lúc cắt API giữa chừng** (`DEPTH_ZERO_SELF_SIGNED_CERT`) ⇒ luồng chạy lâu bị ngắt. Dặn luồng commit sau mỗi bước nhỏ.
    - Nhiều luồng cùng thư mục: mỗi luồng chỉ sửa file của mình, commit đúng đường dẫn. Mỗi luồng tự mở tab Browser pane riêng.
  - **Bẫy kỹ thuật:**
    - three r186 bỏ `PCFSoftShadowMap`;
    - three.quarks phun theo +z;
    - Sprite thiếu `map` ⇒ vẽ hình vuông;
    - Vite Windows có lúc phục vụ bản cũ ⇒ khởi động lại;
    - Browser pane ẩn ⇒ không vẽ: Bắt Thú `window.chup` + tua `GAME.vong`/`DEMO.tua`, Nông Trại `NT_SCENE.chup`;
    - three r128 (Nông Trại): `Texture` không có `userData`, `InstancedMesh` ⇒ `frustumCulled = false`;
    - thử state Nông Trại: chặn `Storage.prototype.setItem` TRƯỚC (bản lưu thật `nongtrai_ngay_v1`);
    - cmd Windows đổi ổ phải `cd /d`;
    - đừng sửa file tiếng Việt bằng `Get/Set-Content` PS 5.1.
### ▶ CONTEXT 4T + 5T (Thùy mở 07/10 · cập nhật 08/10 tối) — kho tiểu học theo đường đi `kho-rules/README.md`

**Đọc theo thứ tự, không bỏ:** `CLAUDE.md` (§1.5, §2.0, Luật xoá) → `kho-rules/README.md` (đường 7 bước · **§2b dây chuyền giải hàng loạt** · §3 luật chung · §4 việc kỹ thuật treo · §5 trạng thái khối) → `kho-rules/dai/k4T.md` (luật khối v1, §7 nhật ký CEO sửa, **§8 tiến độ + câu treo**) → `kho-rules/dai/k5T.md` (v0 + hồ sơ sách 31 CĐ + bản đồ hiện có + **§7 kế hoạch + 4 câu chờ CEO**) → memory `tach-y-hinh-vs-dai`. Bản đồ 4 tầng mới: `spec-ban-do-4-tang.md` §0.

**Luật nền CEO 08/10:** GIẢI và GÁN DẠNG là 2 việc độc lập — lượt giải ghi câu vào dạng chờ `…000000` (`ghi-lo.mjs --chua-gan-dang`), lượt gán chạy sau khi bản đồ khối đó xong (= B3 của spec-ban-do-4-tang). Câu dạng chờ chưa bấm duyệt được ⇒ duyệt lời giải sau khi gán.

**4T:** `k4T.md` **v1** (lô 4 không sửa). Nguồn `E:\BK ACADEMY\Tài liệu tham khảo\4T\Toán arc 4 quyển 1  2023.docx` (MathType, đọc bằng `scripts/kho/mathtype-thu/doc-docx.mjs`; dựng lại 1 giây). **✅ Bước 2 XONG 08/10 tối: 1213 câu đã ghi kho** (`T14T000000…`, dạng chờ, 1140 Sonnet soạn · 73 Opus; 1205 khop · 8 soát tay; 124 câu có sơ đồ) qua dây chuyền dau-vao-soan → hàm kiểm viết TỪ ĐỀ trước → Sonnet soạn → lo-tu-soan (cổng KaTeX) → Opus đọc toàn bộ + xem ảnh sơ đồ → ghi-lo. Còn 47 bài sách chưa ghi (34 có hình trong đề · 4 VD sách in sẵn đáp số · 3 đề in lỗi · PCT 6 I.6 · LT 11.3 · LT 11.19) + danh sách cách hiểu CEO nên xem: `k4T.md` §8. Việc 4T còn lại = **bước 3 gán dạng** khi CEO xong bản đồ. Bản đồ 4T (24 chủ đề · 78 dạng, nhiều chủ đề 1 dạng) CEO hoàn thiện trên **ERP › Học thuật › Bản đồ mới**.

**5T:** `k5T.md` v0 (04/10, Số thập phân, 12 câu mẫu; 271 câu STP giải lại vẫn chờ học thuật ký). Nguồn chuẩn đổi sang sách `E:\BK ACADEMY\Tài liệu tham khảo\5T\Tài liệu tham khảo Toán 5.docx` — 31 CĐ (phân số · tỉ số · STP · % · hình học · chuyển động · giả thiết tạm · khử) + phần ôn tập, ~730 bài thô. **⚠ công thức là ảnh WMF (0 công thức chữ, 1.154 ảnh)** ⇒ B1 của 4T mù, phải WMF → PNG (`scripts/anh/docx_trich.mjs`) hoặc PDF (README §4 việc #6). Bản đồ 5T hiện 3 chủ đề · 22 dạng, phủ ~9/31 CĐ sách.

**⭐ Quy trình 3 bước MỌI KHỐI (CEO 08/10, `kho-rules/README.md` §0):** (1) đọc sách → giải thử → CEO duyệt → rút luật vào `k<khối>.md` · (2) luật đủ tốt (v1) ⇒ giải TOÀN BỘ tài liệu lên DB dạng chờ · (3) CEO xong bản đồ ⇒ Claude xếp bài vào ⇒ CEO duyệt. **Bản đồ là việc của CEO.**

**Việc kế tiếp:** 5T bước 1 — B1 đọc sách (đường WMF → PNG/PDF, README §4 việc #6) → B2 hồ sơ + tach-bai → B3 nâng luật theo "Bài làm" → lô thử gửi CEO duyệt. Bước 1 = giải một lượt qua MỌI dạng bài của sách (CEO 08/10). 271 câu STP: CEO "giải là duyệt luôn" — duyệt ngay ở màn Duyệt lời giải, không chờ bản đồ. 4T: chờ bản đồ để gán (bước 3); 34 bài có hình trong đề chờ đường hình (cùng đường WMF → PNG của 5T).

### ⭐⭐⭐ 7 SKILL HỌC LIỆU — TOÀN BỘ NHIỆM VỤ (Thùy chốt 06/10) · bản đồ trạng thái + điều kiện đi tiếp · ĐỌC ĐẦU TIÊN khi làm bất cứ gì về kho

> **Đích (Thùy 06/10, nguyên văn):** *"1 workflow tự động sản xuất học liệu và quản trị hệ thống học liệu."* Mọi việc về kho từ nay quy về 7 skill dưới.
> Việc nào không đẩy một trong 7 skill lên là việc phụ. Số đo trên DB live 06/10 sáng, kho ĐẠI (nhánh làm trước); phiên đọc `claude_build`.
> **Thứ tự đích (Thùy chốt 07/10): TẬP TRUNG PHÁT TRIỂN SKILL 3 (gán dạng) + SKILL 4 (giải bài).** Skill 2 (đề xuất bản đồ) = việc làm 1 lần, NGƯỜI làm, không build. Skill 1: Thùy làm PDF nhiều rồi, *"bước từ PDF ít sai lắm, chỉ PDF quá xấu mới là vấn đề, cái đó đã loại"* ⇒ KHÔNG đầu tư thêm bộ đọc/benchmark PDF, đường hiện có là đủ; đa số tài liệu vào sẽ là PDF, Word là ca dễ. Skill 7 đi kèm 3 và 4 dưới dạng THƯỚC ĐO của chính hai skill đó (không làm riêng).
>
> **Kế hoạch 3 + 4 (CTO 07/10, chờ Thùy phản hồi điểm cần chị):**
> - **Skill 3 — lô thử K12** (bản đồ K12 đã có 112 dạng, 1.517 câu dạng chờ có chỗ để về): (i) bộ phân loại = Claude đọc câu (+ lời giải gốc nếu có) với ngữ cảnh = danh sách dạng của khối + 3 câu mẫu đã duyệt mỗi dạng (hồ sơ dạng tạm, sinh từ kho, KHÔNG ghi vào bản đồ) → ra dạng + độ chắc + lý do; (ii) **đo trước khi ghi**: che dạng của câu K12 đã có dạng (75 câu người duyệt + câu crosswalk từ nhãn nguồn), cho máy gán, so khớp; (iii) ghi vào `dang_ai_de_xuat` (cột có sẵn), người xác nhận ở màn duyệt (`DuyetCauTab.tsx` đã hiển thị cột này), trigger điền `dang_chinh`; (iv) thước đo = % người đổi sau khi máy gán (`kho_doi_dang_log`, cột `dang_ai_de_xuat` có sẵn trong log). K10/K11 chạy y hệt khi bản đồ Thùy xong. Cụm: làm sau dạng.
> - **Skill 4 — lô thử 539 câu K10–12 CÓ đáp án gốc nhưng KHÔNG lời giải** (K10 180 · K11 272 · K12 87): giải → so đáp số với gốc = thước đo miễn phí cho bộ giải trước khi đụng câu không đáp án (K12 66 câu). Dây chuyền: Claude giải theo luật `spec-giai-bai-ai.md` → kiểm độc lập (so đáp án gốc · máy tính lại bằng `mcq-auto.tinh()` cho dạng số · model khác giải mù) → `scripts/kho/cong-ghi.mjs` chỉ cho ghi khi có biên bản kiểm → ghi `loi_giai_ai`/`dap_an_ai` + `giai_method`, `da_duyet=false` → người duyệt màn Duyệt lời giải. Bộ kiểm FORM trình bày = 1 file luật + script lint (chưa có). Thước đo = % đáp số khớp gốc · % người sửa lời giải (`kho_sua_log khau=loi_giai nguon=nguoi`).
> - **Cần từ Thùy:** (a) 5–10 lời giải chị coi là CHUẨN form Việt Nam (hoặc chỉ sách/nguồn) để viết file luật trình bày; (b) chạy bằng Claude Code (quota, theo lô, như `kho-kiem-ai.mjs`) hay API (`VITE_ANTHROPIC_API_KEY` có trong `.env.local`) để chạy tự động không cần người ngồi — workflow "tự động" về lâu dài cần API; (c) ngưỡng độ chắc để máy tự gán dạng không cần người (đề xuất: chỉ tự gán khi ≥ 95% khớp trên lô đo, còn lại đề xuất).

| # | Skill (lời Thùy) | Trạng thái 06/10 | Điều kiện để tiến tiếp |
|---|---|---|---|
| **1** | Đưa PDF/Word vào, đọc chính xác toàn bộ, từng cặp đề ↔ đáp án, đẩy vào trạng thái duyệt | **🟢 70%.** 3 đường đọc chạy thật: Word công thức Word (`docx-doc.mjs`, đúng tuyệt đối, đã nhập 8.600 câu Noctorium K10–12) · PDF chữ (`scripts/kho/de-thi/boc-pdf.mjs`: Gemini bóc + máy so 3 nguồn đáp án + ảnh cắt theo toạ độ) · Word MathType đọc thẳng (`scripts/kho/mathtype-thu/`, 10/10 bài thi, 99,69% công thức). Ghép cặp đề ↔ đáp án theo tên file (`t0-cua-vao.mjs`). Đẩy vào duyệt: Kho đề thi (đường A) + hàng duyệt câu | **(a)** Nối MathType vào lệnh ghi thật (giờ chỉ là bản thử, chưa ghi câu nào). **(b)** PDF scan chưa đo lần nào — cần 5 file scan thật từ Thùy. **(c)** Đường Word chưa có kiểm độc lập (chỉ PDF có máy kiểm) — thêm bước "model khác nhìn ảnh trang so câu đã bóc" cho cả Word. **(d)** Nguồn chỉ có LỜI GIẢI, không có ô đáp án (Noctorium): 1.311 câu TN/TLN đọc được lời giải mà chưa rút đáp án — **Thùy gật 06/10 cho Claude rút từ lời giải**, ghi `nguon='may'` để người xác nhận. *Thước đo xong:* 10 tài liệu ngẫu nhiên (5 Word, 3 PDF chữ, 2 scan) đi hết đường mà người duyệt sửa phần ĐỌC < 1% câu (`kho_sua_log.khau='doc'`). |
| **2** | Đọc tài liệu + đề thi + bản đồ cũ, tự đề xuất bản đồ kiến thức mới | **⛔ KHÔNG BUILD (Thùy 07/10: việc 1 lần, người làm).** Ghi lại để biết đã có gì: **🟡 30%.** Làm được 1 lần bằng tay: `spec-ban-do-k12.md` (CTO đọc SGK + 6.056 câu → khung 8 chủ đề/20 chuyên đề → K12 từ 77 lên 112 dạng). Có bảng `dai_de_xuat` (`dang_moi`/`cum_moi`/`trao_doi`) + `dai_de_xuat_quyet_dinh` (nhận/gộp/bác) nhưng **0 quyết định, 1 đề xuất** — màn chưa ai dùng. Không có script nào đọc câu rồi tự đề xuất dạng | **(a)** Thùy đang tự làm bản đồ K10/K11 (06/10) — xong thì có "đáp án" để đo skill này: cho máy đọc cùng tài liệu, so bản đồ máy đề xuất với bản đồ Thùy chốt, đếm trùng/thiếu/thừa. **(b)** Cần hồ sơ dạng (`mo_ta_ngan` đang 0/112 ở K12): đề xuất dạng mới chỉ có nghĩa khi dạng cũ có mô tả để so. **(c)** Luật phân tầng dạng/cụm/biến thể (`spec-luong-kho.md` §2) phải thành bộ kiểm chạy được, không phải văn. *Thước đo xong:* bản đồ máy đề xuất cho một khối mới được học thuật nhận ≥ 70% dạng không sửa tên. |
| **3** | Đọc tài liệu rồi tự phân bài về dạng trong bản đồ | **🟡 50%.** Gán theo NHÃN của nguồn (crosswalk Noctorium: tên bài/chương → mã dạng), 42–65% câu có dạng tuỳ khối; còn lại vào dạng chờ (`…000000`) và tự điền khi người gán sau (trigger). Cột `dang_ai_de_xuat` có 8.317 câu (luồng cũ) nhưng chưa ai đo đúng bao nhiêu. Đại đang có **2.617 câu dạng chờ** (K10 472 · K11 817 · K12 1.707 + cũ). Chưa gán CỤM bằng máy (1.003 lần sửa cụm đều do người) | **(a)** Bản đồ phải có chỗ trước (K10 thiếu hệ thức lượng/hàm số/véc tơ; K11 thiếu lượng giác tổng-tích + hình không gian) — đang chờ Thùy. **(b)** Gán dạng cần nhân chứng thứ hai = LỜI GIẢI (phương pháp lộ trong lời giải) — Noctorium có sẵn lời giải nên là lô thử tốt nhất. **(c)** Thước đo có sẵn: `kho_doi_dang_log` (4.715 dòng) — đo "máy gán X, người đổi sang Y" theo lô, chưa ai tính. *Thước đo xong:* lô 200 câu máy gán, người đổi < 10%; cụm < 20%. |
| **4** | Giải bài đúng kiến thức + form trình bày Việt Nam | **🔴 25%.** Luồng cũ (`hangdoi-giai.mjs` + scheduler, một phiên tự giải tự kiểm tự ghi) **đã ngừng 28/09, không bật lại**. Trong kho: 14.305 câu `nguon_giai='ai'`, `giai_method` chỉ ghi ở 724 câu (claude_code 545 · clone 116 · extract 56) ⇒ phần lớn lời giải AI cũ KHÔNG biết sinh bằng cách nào. Quy tắc trình bày có (`spec-giai-bai-ai.md`: dùng lại ý trước, format `\n\n`, verify trước khi ghi) nhưng script không ép. Chưa có "giải theo phương pháp của dạng" (vì chưa có hồ sơ dạng) | **(a)** Hồ sơ dạng có "phương pháp giải" (nối với skill 2b). **(b)** Cổng ghi (`scripts/kho/cong-ghi.mjs`, xét được gói nhưng chưa nối lệnh ghi) bắt buộc kèm biên bản kiểm: đáp số tính lại bằng code (bộ `mcq-auto.tinh()` có sẵn cho dạng số) HOẶC model khác giải mù khớp. **(c)** Form trình bày = 1 file luật + bộ kiểm bằng regex/parse (độ dài bước, dấu `=`, không "Vậy chọn" khi là tự luận…) — hiện chưa có. *Thước đo xong:* lô 100 câu không đáp án gốc, người duyệt sửa lời giải < 5%, đáp số sai 0. |
| **5** | Vẽ hình: vẽ lại + vẽ mới | **🔴 10%.** Chỉ CẮT ẢNH từ nguồn (`anh_de` 3.597 câu Đại, K12 2.169). Không có công cụ vẽ nào trong repo (0 TikZ/GeoGebra/SVG sinh từ mô tả). Kho Hình học (`hinh_hoc_*`, `spec-kho-hinh-v3.md`) có model "xô nước" nhưng chưa có hình vẽ | **(a)** Thùy chốt công cụ: `spec-luong-kho.md` §5.6b so GeoGebra vs TikZ, chưa chốt. Đề xuất CTO: AI viết **mô tả hình có cấu trúc** (điểm, đường, ràng buộc) → máy render SVG, không để AI vẽ điểm ảnh. **(b)** Hai lượt kiểm: code kiểm ràng buộc hình học; model khác so ảnh render với ảnh gốc. **(c)** Bắt đầu từ lớp hình DỄ nhất và NHIỀU nhất: đồ thị hàm số + bảng biến thiên + bảng xét dấu K12 (vẽ bằng công thức, kiểm bằng tính toán). Hình phẳng/không gian làm sau. *Thước đo xong:* 100 câu đồ thị K12 vẽ lại, người duyệt bác < 10%. |
| **6** | Form MCQ đầy đủ cho mọi câu | **🟢 65%.** Pipeline chạy thật: `mcq-auto.mjs` (distractor theo lỗi, máy tính) · `mcq-sinh.mjs` (Claude) · `mcq-dien.mjs` (điền ô) · `mcq-clone-doi-so.mjs`. 10.749 form đã duyệt. Phủ: **446/522 dạng có câu kho chuẩn đã có MCQ** (TN gốc hoặc form) ⇒ 76 dạng chưa có. Luật bổ trợ "chỉ MCQ" đã áp (`_kho_dk_mcq_sql`) | **(a)** 76 dạng trống: liệt kê bằng query, phân loại dạng nào máy sinh được (số) / Claude sinh / không hợp khuôn 4 đáp án (`spec-mcq-tung-phan.md`). **(b)** Nối tự động: câu mới vào kho chuẩn ⇒ tự vào hàng đợi sinh form (giờ chạy tay theo lô). **(c)** Câu mới Noctorium chưa có form nào. *Thước đo xong:* mỗi dạng có câu kho chuẩn đều ≥ 1 MCQ; câu mới vào kho ≤ 7 ngày có form. |
| **7** | Chế độ AI duyệt câu + đo tỉ lệ | **🟡 45% — phần có sẵn nhiều hơn tưởng.** Mức A máy tính (`kho-quet-dapso.mjs`, whitelist dạng số) + mức B Claude giải lại (`kho-kiem-ai.mjs`, 79 lô, 15.503 câu) đã chạy: `kiem_may` khớp 17.638 · nghi 539 · không kiểm được 1.606 · chưa kiểm 10.191. `kho_chuan` (cột sinh) tự rút câu nghi khỏi HS. Trigger `kho_sua_log` ghi vết người sửa khâu nào (Đại: cụm 1.003 · lời giải 49 · đáp số 30 · đọc 23 · hình 1). **Nhưng thước đo chưa dùng được:** `fn_kho_kiem_lo_thong_ke` tính precision trên "phần người đã soát", mà người chỉ soát hàng NGHI ⇒ ra 35 xác nhận / 226 sửa (13%) — số này **không phải** precision của máy, là thiên lệch chọn mẫu. **Chưa có lô mẫu ngẫu nhiên nào** từ phần máy đã ký (`spec-kho-chuan.md` §2 mức C "mẫu 2%"). | **(a)** Rút **mẫu ngẫu nhiên 200 câu** từ 17.638 câu `khop` (tách máy / Claude), người soát mù ⇒ con số precision thật đầu tiên. Không có số này thì mọi luật "lọt dưới ngưỡng ⇒ máy tự duyệt" (`spec-luong-kho.md` §5.5) không bật được. **(b)** Hàng chưa kiểm 10.191 câu: chạy mức B theo lô, ưu tiên câu HS đã làm (script có sẵn). **(c)** Mở rộng "đo" từ ĐÁP SỐ sang 4 khâu còn lại (đọc, dạng, lời giải, hình): `kho_sua_log` đã ghi, chỉ cần báo cáo theo lô (`fn_troly_*` kiểu Tổng kết tuần). **(d)** Ngưỡng ký: Thùy đặt (đề xuất precision mẫu ≥ 98%). *Thước đo xong:* một khâu (đáp số) máy tự duyệt thật, có số lọt theo tuần. |

**Phản biện CTO (06/10) — 3 điểm, Thùy quyết:**
1. **Skill 7 phải lên trước skill 4 và 5.** Không có thước đo thì giải/vẽ thêm bao nhiêu cũng chỉ là "nhiều hơn", không chứng minh được "chuẩn hơn". Dữ liệu đã có: 19.783 câu có kết quả kiểm máy, 6.414 vết sửa. Thiếu đúng một việc rẻ: lô mẫu ngẫu nhiên 200 câu người soát mù. Đề xuất làm ngay sau mục rút đáp án Noctorium.
2. **Skill 2 (đề xuất bản đồ) chưa đo được chừng nào Thùy chưa chốt một bản đồ bằng tay.** Bản đồ K10/K11 Thùy đang làm chính là bộ "đáp án" để chấm máy. Vậy nên **giữ nguyên cách Thùy đang làm**, không chen máy vào giữa; máy chạy song song trên cùng tài liệu rồi so sau.
3. **Skill 5 (vẽ hình) là việc đắt nhất, nên khoanh hẹp nhất:** chỉ đồ thị + bảng biến thiên + bảng xét dấu K12 trước (vẽ được bằng công thức, kiểm được bằng tính toán, chiếm phần lớn 2.169 ảnh K12). Hình phẳng/không gian để sau khi hồ sơ dạng Hình học có.

**Việc đang chạy (06/10):** rút đáp án từ lời giải cho 1.311 câu Noctorium (skill 1d, Thùy gật). Đ/S không thiếu (đáp án ở từng mệnh đề, 5.232/5.232). Tự luận 314 câu không cần đáp án riêng.

**Số đo nền để so lần sau (Đại, 06/10):** câu 29.974 · đã duyệt 18.676 · kho chuẩn 21.494 · dạng chờ 2.617 · `nguon_giai` ai 14.305 / người 15.669 · form TN duyệt 10.749 · dạng có MCQ 446/522 · `kiem_may` khớp 17.638 / nghi 539 / không kiểm được 1.606 / chưa 10.191 · ảnh cắt 3.597.

### ⭐⭐ LUỒNG KHO + ĐỀ THI — trạng thái hết 02/10 · ĐỌC `spec-de-thi.md` §10 (và `spec-luong-kho.md`) trước khi sửa

**Thứ tự ưu tiên (Thùy 01/10):** làm theo LÁT, lát nào xong dùng được lát đó — không đòi một phát xong cả dây chuyền. ĐỀ THI làm trước;
bản đồ kiến thức Thùy tự làm; gán mẫu / skill gán dạng / lô 673 câu K12 **ĐÃ GÁC** (không làm tới khi được gọi).

**▶ VIỆC KẾ TIẾP (Thùy 02/10) — MỞ CONTEXT MỚI: nhập vài trăm file tài liệu + lập BẢN ĐỒ KIẾN THỨC MỚI cho một MÔN TOÁN KHÁC (không phải Toán đang có).**
- **Đọc trước, theo thứ tự:** `CLAUDE.md` (§1.5, §1.6, §2.0, §2.1, Luật xoá) → mục này + "Bài học 28/09–01/10 — luồng kho + đề thi" ở phần ② →
  `spec-luong-kho.md` (§1 quyết định · §2 luật phân tầng Dạng / Cụm / Biến thể · §5 kiến trúc trạm + cổng ghi · §9.6 phương pháp "dựng bài thi trước") →
  `spec-luong-kho-p0.md` (§3 bản đồ code, §8 bẫy) → `spec-ban-do-k12.md` (một bản đồ đã lập thế nào: khung theo SGK → migration → màn Đề xuất → Gán mẫu).
- **ĐÃ CHỐT (Thùy 02/10):** (1) *"Nó là 1 loại toán khác — độc lập với chương trình toán hiện tại. Nên coi nó như là 1 MÔN luôn. Mọi thứ giống toán hiện tại."*
  ⇒ MÔN MỚI theo §1.6 (trung tâm riêng: nhãn `mon` riêng, bảng kho riêng, tiền tố mã riêng), dựng theo ĐÚNG khuôn kho Đại, đi qua registry — không `if (mon === …)`.
  (2) *"T có 1 kho tài liệu cũng chia các level rồi. Coi tên các folder là các mức chủ đề – chuyên đề – dạng bài thôi."* ⇒ khung bản đồ = CÂY THƯ MỤC của kho tài liệu
  (không lập từ SGK như K12): tên folder = các mức của bản đồ. (3) *"Hiện tại thì nó có 2 mức thôi. Cứ chia TẠM 2 mức theo folder là được."* ⇒ kho đang có 2 tầng
  thư mục, bản đồ ERP có 3 tầng (chủ đề – chuyên đề – dạng) ⇒ lập TẠM theo 2 tầng, tầng còn thiếu để sau. **Hai tầng đó ứng với hai tầng nào của bản đồ thì CHƯA chốt** —
  nhìn tên folder thật rồi hỏi Thùy, 2 cách: (i) tầng 1 = chủ đề, tầng 2 = chuyên đề, câu vào DẠNG CHỜ của chuyên đề (`…000000`, cơ chế có sẵn) rồi tách dạng sau —
  nhưng câu dạng chờ không duyệt được vào kho chuẩn và không tính mastery; (ii) tầng 1 = chuyên đề, tầng 2 = dạng, gom dưới một chủ đề tạm — dùng được ngay (duyệt, đo),
  về sau chỉ thêm tầng chủ đề phía trên. CTO nghiêng về (ii) nếu folder tầng 2 đủ hẹp để coi là một dạng bài.
- **ĐÃ CHỐT thêm (Thùy 02/10):** tên môn = **TSA**. Kho tài liệu của môn: `C:UsersWBPCDownloadsTSA PNL - 2027TSA PNL - 2027` (máy công ty). CTO CHƯA xem bên trong (Thùy dừng lượt quét để chuyển sang việc nhập đề giữa kì) ⇒ mục (a), (b) bên dưới coi như đã trả lời; các mục còn lại vẫn phải hỏi.
- **CÒN PHẢI HỎI Thùy trước khi viết dòng nào (câu về ĐÍCH, không tự đoán):** (a) TÊN môn (để đặt nhãn `mon`, tiền tố mã, tên bảng) · (b) ĐƯỜNG DẪN kho tài liệu đó
  (02/10 CTO nhìn `E:\BK ACADEMY\` không tự nhận ra thư mục nào — đừng đoán) · (c) "level" trong kho ứng với gì ở ERP: khối? cấp độ riêng của môn? (mã dạng hiện =
  tiền tố + KHỐI + chủ đề + chuyên đề + dạng) · (d) định dạng file (Word MathType / PDF chữ / PDF scan), có lời giải + đáp án không · (e) lô đầu làm gì: chỉ lập bản đồ,
  hay đổ câu vào kho luôn · (f) ai duyệt bản đồ + câu · (g) môn này có lớp / học sinh trên ERP chưa (ảnh hưởng: lớp gắn `mon`, app HS, mastery).
- **Cách đi CTO đề xuất (theo lát, chưa ai gật):** ① quét cây thư mục → BẢNG NHÁP 2 tầng (đúng như folder) + số file mỗi nút, 0 AI, không đụng DB; nút lệch độ sâu (file nằm sai tầng,
  folder thừa tầng, tên trùng khác chỗ) thì NÊU RA chứ không đoán → Thùy duyệt bảng · ② dựng môn mới qua registry (migration bảng kho theo khuôn Đại + tiền tố mã),
  chạy thử bằng `thu-migration.mjs` · ③ ghi bản đồ từ bảng đã duyệt · ④ nhập câu từ file theo từng chuyên đề: dựng bộ file mẫu có đáp án người xác nhận trước, đo, rồi
  mới chạy hàng loạt; câu vào ở trạng thái chưa duyệt, dạng lấy theo THƯ MỤC chứa file (nhân chứng có sẵn — không cần AI gán dạng).
- **Hạ tầng dùng lại được (đừng viết lại):** quét + ghép cặp + chép file `scripts/kho/t0-cua-vao.mjs` (cấu hình thư mục theo máy `scripts/kho/cau-hinh.mjs`:
  `KHO_NGUON_GOC`, `KHO_LAM_VIEC`) · đọc Word MathType `scripts/kho/mathtype-thu/` (bài thi 10/10) · đọc PDF `scripts/kho/de-thi/boc-pdf.mjs` (Gemini gõ, Claude kiểm) ·
  cổng ghi "không biên bản kiểm thì không ghi" `scripts/kho/cong-ghi.mjs` · chèn câu `scripts/_kho_insert.mjs` · màn Đề xuất dạng/cụm + Gán mẫu (hiện chỉ nối với kho Đại) ·
  `scripts/thu-migration.mjs` (chạy thử migration rồi ROLLBACK) · lệnh `/nhap-kho`, `/nhap-de-thi`.
- **Thêm một môn / nhánh mới phải đi qua REGISTRY, không rải `if`:** `khoCuaMon` + `NHANH_CUA_MON` (`src/lib/tailieu.ts`) · `_kho_co_mon` · `_de_thi_kho` ·
  tiền tố mã theo môn (mig `202608141259`, `202608141452`: mã dạng = tiền tố + khối + chủ đề + chuyên đề + dạng; dạng chờ kết thúc `000000`) · `fn_kho_pham_vi`.
  Symmetry test §1.6: thao tác trên kho mới phải chạy y hệt kho cũ. (Môn Anh là ngoại lệ đã chốt — không bê khuôn Toán; môn Toán khác thì CHƯA ai chốt.)
- **Cách làm đã được Thùy chấp nhận:** theo lát; mỗi lô có số đo trước / sau; dựng "bài thi" (bộ file mẫu có đáp án đúng do người xác nhận) TRƯỚC khi chạy hàng loạt;
  không một phiên tự làm tự kiểm tự ghi (luồng tự giải cũ đã ngừng vì thế); ghi DB sau khi chạy thử; DEVLOG append trong ngày.

**ĐỀ THI — 4 lát A–D + phát hành 2 chế độ đã build, đã push `main` (mới nhất `dfe5000`). ⚠ Vercel CHƯA deploy (ERP + app HS) — Thùy bấm tay.**
- **Phân vai:** Claude là máy xử lý (bóc, kiểm, gán dạng, ghi), ERP là nơi người sửa + duyệt + dùng. Đường "Gemini bóc PDF ngay trong ERP" ĐÃ GỠ.
- **Dây chuyền:** file → `/nhap-de-thi <khối>` → `de.json` → `ghi.mjs` (chạy thử ROLLBACK → `--ghi`) → ERP **Nhập kho › 📝 Đề thi**
  (Kho đề thi, 3 tab Chờ duyệt / Sẵn sàng / Đã giao) → mở đề = sửa + ✅ Duyệt một màn → 📱 Giao.
  - Có Word: `scripts/kho/de-thi/boc-word.mjs` (0 AI, đọc thẳng MathType + gạch chân, ghép bộ ĐỀ ↔ bộ LỜI GIẢI làm nhân chứng).
  - Chỉ có PDF: `scripts/kho/de-thi/boc-pdf.mjs` — Gemini 3 lượt (bóc · mục lục · soi từng trang: hình ở 150 dpi, chữ gạch chân ở 250 dpi) +
    máy so chéo + **Claude BẮT BUỘC kiểm bằng mắt** (4 việc trong `.claude/commands/nhap-de-thi.md`). `--dung-lai` = chạy lại không gọi Gemini.
  - Thư mục thả đề: `E:\BK ACADEMY\Tài liệu Claude nhập kho\DE_THI\L<khối>\` (đang TRỐNG). Thư mục làm việc: `<KHO_LAM_VIEC>/de-thi/<TÊN>/`
    (máy công ty `C:\Users\WBPC\bk-kho-lam-viec` — bộ đệm theo máy, KHÔNG có ở máy nhà; dựng lại được từ file gốc).
- **Code ERP:** `src/screens/tailieu/KhoDeThi.tsx` (danh sách + `DeThiSoan`) · `DuyetDeThi.tsx` (`GiaoDeModal`, `DaGanPanel`, `LuotThiPanel`) ·
  `src/lib/dethi.ts` · `KhoTaiLieuScreen.tsx` (hộp chọn chế độ phát hành) · tab Live `LiveTab` trong `BuoiHocScreen.tsx` · app HS: `ONhap4O` trong `HocSinhApp.tsx`.
  Kho tài liệu chỉ còn IN đề; tài liệu gán từ đề không mở builder.
- **DB (đã áp cả 4):** mig `202610011501` (K5/K6, `fn_de_thi_ds`/`_dem`) · `202610011759` (`fn_de_thi_gan`, `fn_de_thi_da_gan`, `fn_de_thi_hoan_thien_bai_test`,
  cột `bai_test_cau.kieu_nhap`, trigger `trg_de_thi_dien_dang`, sửa `fn_de_thi_mo` / `et_de` / `_et_cham`) · `202610012158` (mở cả đề theo câu LẪN dạng) ·
  `202610021201` (`fn_bt_mo_toan_bo`, `fn_bt_mo_phan_dau`, trigger mở dạng 1 bỏ qua bài từ đề).
- **Luật CEO đã chốt (spec §10.5–10.9):** K1 Kho đề thi là chỗ lưu + sửa chính · K2 duyệt 1 cửa theo ĐỀ · K4 chỉ giao cả đề ·
  **K5** trả lời ngắn giữ form đề gốc, ô 4 ký tự như phiếu thi (không đổi sang trắc nghiệm) · **K6** đề luôn dùng được dù chưa đủ dạng, chỉ cảnh báo;
  câu chưa có dạng vẫn lưu kết quả, có dạng sau thì mastery tự cập nhật · **Giao = 3 cách:** 📘 Bài trên lớp / 📝 BTVN = GÁN đề vào buổi ⇒ thành
  tài liệu `giao_trinh_buoi` / `btvn` của (lớp + ngày) đúng khuôn giáo trình trích xuất (bản CHÉP; buổi đã có thì từ chối, không tự thay) ·
  ⏱ Kiểm tra = lượt thi tính giờ (`fn_de_thi_mo`).
- **⭐ Phát hành 2 CHẾ ĐỘ cho bài trên lớp (CEO 02/10, spec §10.9):** **từng phần** (buổi học — chỉ phần đầu mở, GV bấm ▶ Phát hành từng phần ở tab Live của buổi,
  bấm lại = thu hồi) · **toàn bộ** (luyện tập — mở sẵn mọi câu). "Phần" của bài từ đề = Phần I / II / III (mở theo CÂU, không theo dạng — một dạng rải nhiều phần);
  của giáo trình thường = dạng (như từ 13/09). Kiểm tra / ET / BTVN luôn mở cả bài. **Chỗ chọn chính = nút 📱 ở Kho tài liệu** (Thùy: "chọn chế độ là phải chọn từ
  kho tài liệu") — bấm 📱 trên dòng Giáo trình buổi ra hộp 2 lựa chọn; còn chọn được ở hộp Giao + bảng "Đã gán vào buổi" của Kho đề thi (cùng một hàm; Thùy chưa nói
  giữ hay gỡ) và nút "▶▶ Mở toàn bộ" ở tab Live. Chế độ KHÔNG lưu thành cột (trạng thái thật = 2 bảng `bai_test_cau_phat_hanh` / `bai_test_dang_phat_hanh`).
  Dùng chung bảng + `fn_bt_mo_cau` / `fn_bt_dong_cau` với luồng Học online (nhánh `worktree-hoc-online` CHƯA merge — khi merge phải ghép với `LiveTab` đã sửa).
- **⭐ BỘ ĐỀ GIỮA KÌ NOCTORIUM lớp 11 + 12 — ĐÃ VÀO HẾT (02/10):** 107 đề khối 11 + 297 đề khối 12 (117 giữa kì + 180 đề khác) đều là `tai_lieu(loai='de_thi')`, tab Chờ duyệt;
  câu ở kho, chưa duyệt. Lớp 12 + 46 đề lớp 11 nhập từ 24/09; **61 đề lớp 11 còn lại (1.248 câu) nhập 02/10** sau khi Thùy chốt: 344 câu HÌNH KHÔNG GIAN 11 vào
  **kho Hình học** (`hinh_hoc_cau_hoi`) ở dạng chờ mới **`HH11000000` "Chưa phân dạng — Hình không gian 11"** (mig `202610021414`: `_kho_dang_cho` biết `hinh_hoc`,
  trigger chặn duyệt dạng chờ trên kho Hình học, `_kho_lt_dang_tbl`, `fn_de_thi_mo` hết gọi nhầm bảng lý thuyết). Script: `scripts/noctorium_parse.mjs` → `noctorium_insert.mjs`
  (`--thu` = chạy thật rồi rollback từng đề; chống nhập trùng theo TÊN đề vì zip tải lại có vân tay khác) · `_kho_insert.mjs` nhận kho `hinh_hoc`, so trùng nhanh hơn ~20 lần.
  **Việc của NGƯỜI còn lại trên 61 đề mới:** 219 câu trắc nghiệm + 55 câu trả lời ngắn chưa có đáp án (file gốc không đánh dấu — điền ở màn đề), 560 câu còn dạng chờ
  (344 hình không gian + 216 Đại: bản đồ BK khối 11 chưa có dạng tương ứng), 131 câu tự luận chỉ in. Mới 1/61 đề duyệt được ngay. Nguồn zip: `Downloads\Lớp 11.zip`,
  `Lớp 11_Theo dạng.zip`, `Lớp 12_Dạng.zip` (thực ra là bản ĐỀ), `Lớp 12_Đề.zip` (52 file "Đề tổng hợp", không dùng); bản giải nén ở `bk-kho-lam-viec/de-thi/_nguon_GK/` (máy công ty).
- **⭐ BỘ ĐỀ GIỮA KÌ NOCTORIUM lớp 10 — ĐÃ VÀO (02/10 tối):** 53 đề, 1.182 câu (1.108 Đại + 74 véc tơ ở kho Hình giải tích), tab Chờ duyệt. Luật gán dạng khối 10 viết mới
  trong `scripts/noctorium_crosswalk.mjs` (`K10`): 710 câu có dạng, **472 dạng chờ** (232 câu hệ thức lượng trong tam giác + hàm số + tích véc tơ chưa có dạng BK; câu Đúng/Sai trộn ý;
  câu không có câu dẫn). Thêm dạng chờ `T310000000` cho kho Hình giải tích khối 10 (mig `202610021813`). Còn cho người: 121 trắc nghiệm + 42 trả lời ngắn chưa có đáp án,
  68 tự luận chỉ in; 5/53 đề duyệt được ngay. **Tổng bộ Noctorium trong ERP: khối 10 = 53 · khối 11 = 107 · khối 12 = 297 đề. Chưa có bộ ĐỀ CUỐI KÌ nào.**
- **Dữ liệu thật đã chạy (01/10):** `Đề số 3 — Ôn tập chương PP toạ độ trong không gian (NBV 12-CD23)` = `tai_lieu deb38df1-a421-4211-8552-172364c3ea8a`,
  22 câu (19 hgt + 3 dai), nhập từ Word. Thùy duyệt 20:01, gán làm **Giáo trình buổi 9 của 12A1** (`55f98c32-57bd-4824-9c86-b700f8e67b84`) và mở app
  (`bai_test 41ef798e-1dda-4f3b-a55b-ee9ec7673f70`, loại `giao_trinh`, mở toàn bộ). **Lỗi thật tối đó, đã sửa:** học sinh chỉ thấy câu 1 vì app HS đang chạy (bản cũ)
  chỉ hiện câu thuộc DẠNG đã mở mà bài mới mở theo câu ⇒ giờ mở toàn bộ = mở cả câu lẫn dạng; bài 12A1 đã vá, bản app cũ thấy 20/22 câu. 2 câu chưa có dạng
  (câu 5 phần I, câu 1 phần III) chỉ hiện khi deploy app HS mới hoặc khi gán dạng cho 2 câu đó ở màn đề (trigger tự điền + tự mở).
- **⚠ CHƯA AI BẤM THỬ BẰNG PHIÊN ĐĂNG NHẬP THẬT** các thứ làm ngày 02/10 (hộp chọn chế độ ở Kho tài liệu, tab Live theo phần) — mới chạy thử DB (ROLLBACK) + trang
  xem-thử dữ liệu giả. **Bắt buộc deploy ERP + app HS trước khi dùng chế độ từng phần cho bài từ đề** (bản app HS cũ sẽ không thấy câu nào).
- **CHƯA kiểm bằng mắt / còn hở (xếp theo mức cần):**
  1. Bản IN phiếu của tài liệu gán từ đề (PrintView với phần không có mã dạng) — mới sửa code, chưa ai mở xem.
  2. HS làm thật trên app sau deploy: ô 4 ký tự (mới kiểm ở trang xem-thử) + bài mở từng phần.
  3. Lát D chưa đo trên **PDF scan** và đề của Sở chỉ có bảng đáp án (mới đo 1 đề PDF xuất từ Word: chữ 22/22, đáp án 21/22, hình 5/5).
  4. **Trùng câu khác nguồn:** cùng một câu đến từ Word và từ PDF không được nhận là trùng (LaTeX viết khác) — chạy thử 1/22. Chưa sửa
     (`scripts/_kho_insert.mjs` cần chuẩn hoá LaTeX trước khi so). Đừng nhập một tài liệu từ hai nguồn. **Việc nhập vài trăm file sắp tới sẽ đụng đúng chỗ này.**
  5. `ghi.mjs` chặn đề có câu Đúng/Sai mà file không kèm đáp án ⇒ đề của Sở không đáp án chưa vào được để người điền sau.
  6. Mastery theo TỪNG MỆNH ĐỀ Đúng/Sai chưa có (đang tính theo dạng của câu, đúng một phần = 0,5).
  7. Kho đề thi chưa có nút xoá đề / đổi ngày bản gán (làm ở Kho tài liệu); chưa soạn câu MỚI bằng tay trong đề; màn hẹp mở đề gốc bị bóp cột.
- **File tạm chưa commit (xoá hay giữ Thùy quyết):** trang xem-thử dữ liệu giả `xem-thu-4o.html`, `xem-thu-giao-de.html`, `xem-thu-live-phan.html` +
  `src/_xem_4o.tsx`, `src/_xem_giao_de.tsx`, `src/_xem_live_phan.tsx`. Thư mục thử `bk-kho-lam-viec/de-thi/_thu_pdf_DE_SO_3/` chỉ có ở máy công ty.

**LUỒNG KHO (`spec-luong-kho.md`, pha đang làm `spec-luong-kho-p0.md`) — đang GÁC sau P1, trạng thái:**
- **P0 xong:** luồng tự giải cũ đã ngừng (đừng bật lại) · bộ đọc Word MathType `scripts/kho/mathtype-thu/` đã vá 2 lỗ chặn (đánh số tự động của Word,
  gạch chân / tô màu), bài thi 10 file đạt 10/10 · `scripts/kho/kho.test.mjs` 34/34.
- **P1 bản đồ K12 (`spec-ban-do-k12.md`):** khung theo SGK 6 chủ đề / 19 chuyên đề / 112 dạng ĐÃ ÁP (mig `202609281833`, bảng `dai_chuyen_de_thu_tu`,
  `fn_kho_pham_vi`) · màn **Đề xuất dạng/cụm** (`DeXuatPanel.tsx`, mig `202609282236`) · màn **Gán mẫu** (`GanMauPanel.tsx`, mig `202609292119`) —
  Thùy đã gán 59/60 câu mẫu. Gán mẫu câu Đúng/Sai theo từng mệnh đề: code có (`GanMauDungSai.tsx`), nhưng mig `202610011330_dai_gan_mau_dung_sai.sql`
  **⚠ SỔ GHI "đã áp" (01/10 16:46) MÀ DB CHƯA CÓ** — kiểm tối 01/10: `fn_dai_gan_mau_ds_dung_sai`, `fn_dai_gan_mau_menh_de` không tồn tại (file bị ghi sổ
  lúc dọn các file treo, SQL chưa chạy) ⇒ công tắc "Đúng/Sai" ở màn Gán mẫu sẽ lỗi. Muốn dùng: chạy thử bằng `thu-migration.mjs`, rồi áp bằng một file
  migration MỚI chép nội dung (script coi file cũ là đã áp nên không chạy lại).
- **Chờ CEO quyết:** (a) 19 dạng chương V `T11210…` (PP toạ độ) tạo trong bản đồ ĐẠI trùng nhánh Hình giải tích, 0 câu — xoá hay giữ (Luật xoá);
  (b) tên người học thuật duyệt bản đồ K12; (c) L1 "bỏ chuyên đề thực tế" đã bị bác — giữ nguyên.
- **Công cụ dùng chung mới:** `node scripts/thu-migration.mjs <file.sql> --kiem <file.sql>` (chạy migration + các SELECT kiểm trong 1 transaction rồi
  ROLLBACK; giả phiên nhân sự bằng `set_config('request.jwt.claims', …, true)`) · áp migration bằng **`node scripts/migrate.mjs --only <file>`**
  (nhiều phiên cùng đẻ migration ⇒ chỉ áp file của mình. `--status` có thể báo "không còn file treo" trong khi còn file đã áp bị sửa sau đó và
  file có trong sổ mà thiếu trong repo — đọc `--status` trước khi áp).

### Kiến trúc & file chính
- Kho = lá `bdkt` trong cây Admin → `src/screens/kho/KhoScreen.tsx`. Build **THẬT, wire Supabase DB v2** (ngoại lệ so với mock-first của shell — vì schema Kho đã đông cứng).
- **Seam:** UI KHÔNG gọi `supabase` trực tiếp, chỉ qua `src/lib/kho/api.ts`.
- `api.ts` (data-layer) · `KhoScreen.tsx` (tab Đại/Hình + khối) · `BanDo.tsx` (duyệt cây + modal dạng + lý thuyết) · `DangHub.tsx` (kho câu hỏi per-dạng + AI import) · `ui.tsx` (MathText/KaTeX + primitives) · `branches.ts` (config Đại/Hình) · `AdminScreen.tsx` · `App.tsx` (auth gate) · `auth/Login.tsx`.
- **Làm tài liệu** (`src/lib/tailieu.ts` · `src/screens/tailieu/`): leaf `lamtailieu` = node CHA, con (`LAMTAILIEU_CHILDREN`): `lamtailieu:giao_trinh`→`TaiLieuScreen`(thư viện)+`TaiLieuBuilder`(builder+`TrichPanel` trích xuất)+`PrintView`(in, scope all/giaotrinh/btvn) · `lamtailieu:et`→`ETScreen`(thư viện+ETBuilder+`DangPickerOne`)+`ETPrintView` · `lamtailieu:kho`→`KhoTaiLieuScreen`(bảng tổng) · de_thi/bo_tro placeholder. Logo: `public/Logo.png`. (`DangPicker`/`KhoPicker`/`CauItem`/`buildPagedCss`/`CHROME_CSS` export từ TaiLieuBuilder/PrintView để tái dùng.)
- **Nhân sự/Lớp/HS (khối STATIC)**: `src/lib/nhansu.ts` (data-layer seam) · `src/screens/nhansu/` — `NhanSuScreen` · `LopScreen` · `HocSinhScreen` · `OrgChartScreen`. Lá Admin `ns` / `lop` / `hs` / `orgchart`(founderOnly).

### Đã build (nhánh ĐẠI)
- **Bản đồ**: Chủ đề → Chuyên đề (card) → zoom Dạng (card + filter bậc/độ khó toggle). CRUD dạng thật, mã vị trí gợi ý sửa được.
- **Kho câu hỏi per-dạng** (`DangHub`): **Clone biến thể** + **Nhập chuỗi câu**; method Auto (ảnh/PDF→Gemini) / Manual (dán JSON) / Văn bản (parser). Trắc nghiệm 4 PA. Review 1-câu (Trước/Sau), layout đề+đáp án | lời giải. Sửa câu = preview + ✎.
- **Lý thuyết** (text+LaTeX, render như bài tập — KHÔNG phải file): editor popup to, upload ảnh/PDF → **AI bóc LaTeX**, trái code / phải preview. Cho **dạng** lẫn **chuyên đề**. Lý thuyết chuyên đề có **3 trạng thái: Có / Chưa / Không cần** (cờ `khong_can`); "không cần" loại khỏi tính %.
- **Badge % hoàn thành**: vòng tròn tiến độ (góc card chuyên đề) + pill (chủ đề/header), **5 thang màu**. % = câu(cap chuẩn) 70% + lý thuyết dạng 30%, gộp trục lý thuyết chuyên đề (Có=1/Chưa=0/Không-cần=loại). → liếc thấy chỗ thiếu.
- **Ảnh & file → Supabase Storage** (bucket `kho-anh` ảnh, `kho-tailieu` file đính kèm); DB lưu URL. Nút 📋 Dán clipboard + chọn file.
- **Auth + RLS**: đăng nhập Supabase Auth (email/pass); RLS toàn bộ bảng, chỉ `authenticated`.
- **Làm tài liệu (giáo trình) — model BUỔI (tầng 1, đại tu 06-16):** tài liệu = **THAM CHIẾU** vào kho. Cấu trúc **Giáo trình → Buổi → Dạng**. Mỗi **buổi** = tập **dạng** (chọn từ MỌI chuyên đề, kể cả **1 phần** chuyên đề) → tự sinh **trên lớp** (`dang`, câu luyện) + **BTVN** (`btvn` **per-dạng**, số câu mỗi loại RIÊNG). **Lý thuyết chuyên đề DERIVE** từ chuyên đề của dạng trong buổi (chuyên đề tách 2 buổi → CẢ 2 buổi đều hiện LT của nó; 2 chuyên đề/buổi → hiện cả 2). **Builder** (`TaiLieuBuilder`): cây trái Buổi→Dạng→BTVN · "+ Thêm buổi" · mỗi buổi "+ Chọn dạng" (DangPicker đa chọn) · mỗi dạng 2 khối cấu hình **Bài luyện + BTVN** (counts/loại + Gợi-ý + Chọn-câu KhoPicker; BTVN có ô **số dòng kẻ/câu**). Seam data `setDangOfBuoi` (tạo/xoá cặp dang+btvn, auto-suggest, BTVN né câu đã dùng ở luyện; reorder sort theo `ma_dang`). **Storage KHÔNG migration:** `loai_phan` ∈ {`buoi`,`dang`,`btvn`} (`lt_chuyen_de`/`custom` chỉ còn cho data CŨ); `cau_hinh.btvnLinesByCau[ma_cau]` = số dòng kẻ. ⚠ Doc CŨ (chưa có mốc `buoi`) builder mới KHÔNG hiện → tạo doc mới.
- **Xuất PDF = paged.js** (`PrintView`): **preview = bản in** A4 thật. Engine `new Previewer().preview(html,[cssBlobUrl],dst)`; Doc render ẩn `pv-src` → `pv-pages`. **Render theo BUỔI:** mỗi buổi sang trang + dải tiêu đề "Buổi N"; trong buổi: LT chuyên đề (gom theo chuyên đề) → từng dạng (LT·ví dụ + Bài luyện); **dạng đánh số LIÊN TỤC toàn giáo trình**. **BTVN của buổi = phiếu RIÊNG** (sang trang): header **Họ-tên/Lớp + ô ĐIỂM**, nhóm theo dạng, câu **tự luận/trả lời ngắn** có **dòng kẻ chấm** để HS viết (trắc nghiệm KHÔNG kẻ); bản GV = đáp án (bỏ ô điền). **Header/footer dải sóng full-bleed lặp mọi trang** (`::before/::after` của `.pagedjs_pagebox`, data-URI SVG) · **1 logo duy nhất** ở góc header (bỏ logo bìa) · **số trang đậm** (`@bottom-right`) · footer cao 15mm + lề dưới 22mm (hết đè chữ) · font Times New Roman 17px + KaTeX `0.95em`. **In đậm (boldify trong MathText):** nhãn (Ví dụ/Quy tắc…) + `**md**` + **MỌI TỪ VIẾT HOA** + cụm "Dấu hiệu(/nhận biết)" (chỉ text ngoài `$…$`). ~~**Ngắt trang CHẢY liên tục**: lý thuyết/câu KHÔNG `break-inside:avoid`~~ → **SIÊU QUYỀN bởi 08-14** (xem bullet "In giáo trình — luật ngắt trang" ngay dưới + bài học ② paged.js): để `auto` cho khối lý thuyết chính là thứ gây **bỏ phí nửa trang + lặp/mất nội dung**; luật đúng là **avoid + CHẺ khối cho ngắn**.
- **⭐ In tài liệu — đại tu bố cục CỘT & phân trang (08-03; SIÊU QUYỀN so với phần header/cột ở bullet paged.js trên — chỗ đó STALE):**
  - **BỎ HẲN dải header** (logo + "Tên·Khối"/"Lớp·ngày") ở **MỌI** bản in (giáo trình master/buổi · BTVN · ET · MT) — chỉ giữ **footer** (số trang + liên hệ). PrintView `ch.header='none'` mọi loại; MTPrintView tương tự (preview + layLink).
  - **Số cột = PER-CÂU** (`cau_hinh.colByCau[ma_cau]`; 1=full, **2=2 cột**, tối đa 2). UI = **checkbox "2 cột"** trên mỗi hàng câu ở `ETScreen`/`MTScreen`/`TaiLieuBuilder` (dang `CauRow` + btvn row). **BỎ** picker cột theo-phần (`tai_lieu_phan.kieu`/`KieuPicker`/`setPhanKieu`) & theo-nhóm-form (`etColByGroup`). Câu tick 2 cột **LIỀN NHAU** tự ghép cặp (mỗi câu 1 cột); cách xa KHÔNG ghép; câu lẻ = nửa trang — gom ở `CauFlow` (PrintView), threaded `colByCau` qua Doc→BuoiBlock→DangBlock/BtvnSheet.
  - **Bố cục cặp `CauColumns`:** tách câu → `content` (đề+hình+ý con+phương án/Đ-S/GV) và `lines` (số dòng kẻ). 1 hàng = **băng ĐỀ** (flex, cân chiều cao → đề thấp chừa dòng trống ⇒ đáp án 2 cột NGANG NHAU) + **N hàng DÒNG KẺ** `.pv-lrow` (block rời ⇒ paged.js ngắt được giữa dòng ⇒ **dòng kẻ chảy lấp đáy trang, không nhảy nguyên câu**). Lưới `--pitch 7.5mm` (line-height chữ = dòng kẻ = pitch) ⇒ mọi dòng thẳng lưới 2 cột. Rủi ro: dòng có công thức cao hơn pitch đội lưới dòng đó.
  - **KHÔNG dùng column-count/grid/table** (paged.js treo — DEVLOG 07-05, đã thử lại & bỏ). `CauList` (row inline-block `.pv-row`) **GIỮ** cho **Bài tập/Đề thi** (`BTPrintView`/`DeThiPrintView`) — không đụng.
  - **ET/MT chế độ mã đề** (`lib/made.ts buildMaDe` dùng chung): sinh đề 2&3 = câu khác cùng dạng+form neo theo `ma_cau` gốc; thiếu câu → **cho TRÙNG** không để trống. ET có 3 mã đề + gán theo HS; **MT** thêm sinh 3 mã đề ở master + in 3 phiên bản + `ganMTVaoBuoi` copy `cau_hinh` sang `mt_buoi`.
  - ⚠ **Doc CŨ để cột theo-phần → in 1 cột** tới khi tick lại per-câu (chưa migrate).
- **⭐⭐ In giáo trình — LUẬT NGẮT TRANG (08-14; SIÊU QUYỀN mọi câu "để `break-inside:auto` cho chảy tự do" ở các bullet TRÊN):** đọc kèm bài học ② "paged.js — LUẬT NGẮT TRANG ĐÚNG".
  - **Nguyên tắc:** paged.js ngắt **giữa 2 khối anh-em ruột** thì đúng; ngắt **vào trong lòng 1 khối (sâu ≥2 tầng)** thì bỏ phí nốt phần trang còn lại → phần tử kế tiếp nhảy trang mới; ca nặng thì dựng dở → trắng 1 trang → dựng lại từ đầu (**lặp/mất nội dung THẬT**).
  - **Cách làm đúng = CẤM xé trong khối + CHẺ khối cho ngắn:** `.pv-blk{break-inside:avoid}` · `LyThuyetBody` chẻ khối > `LT_BLK_MAX`(=3) dòng thành từng dòng · `.pv-blk-keep{break-after:avoid}` giữ nhãn "Ví dụ N." không mồ côi.
  - `.pv-math **span**.katex-text{display:inline}` — BẮT BUỘC scope `span` (MathText trả `<div>` chứa `.mline` block khi nhiều dòng; ép inline lên div = block-trong-inline → paged.js đo sai).
  - **Nhóm card trong `BuoiBlock` dùng `<Fragment>`, KHÔNG `<div>`** — thẻ bọc thừa = thêm 1 tầng = tái hiện bug.
  - ⚠ **ĐỪNG** ép `.gtbk-card{break-inside:avoid}` / `.pv-box-lt{break-inside:avoid}` / `.gtbk-mh{break-after:page}` — đã thử cả 3, đều TỆ HƠN (mất nội dung / 11 trang / phí trang 1).
  - Đo GT 8S1 14/08: **8 trang → 6 trang**, mọi trang dùng 85–96% (trước có trang chỉ 10%). GT 7S2 · BTVN · ET · MT **không đổi**.
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

### Đã build (GAMI GĐ A — buổi học, 06-15)
- **Mô hình BUỔI (session = lớp ĐỘNG, mảnh khó nhất):** buổi **2 trạng thái** — ẢO (suy từ `TKB × ngày`, ngày≥khai giảng, chưa đẻ dòng) → **THẬT** khi OPS bấm "Mở buổi" (đông cứng snapshot). Mã đọc `8A1.T2.15062026` (`ma_buoi`), khóa thật = uuid. Vòng đời: Ảo→Mở→điểm danh→chấm ingame→đóng→chấm ET→đóng→Hoàn tất. **Hủy buổi** = lật trạng thái (không xóa con) → task tự ngừng (pure-derive). **Dạy thay** = `buoi_hoc.nguoi_day` (GV thực tế).
- **Taxonomy buổi:** thường · bù (link bù gắn PER-HS trên `buoi_hoc_hs.bu_cho_buoi_id` — 1 buổi bù phục vụ HS nhiều gốc/lớp) · bổ trợ yếu (từ data đo) · bổ trợ đuổi · MT. **Elo: CHỈ ET** (07-28 đại tu — xem mục ⭐ELO dưới; ingame & MT tách khỏi Elo, vẫn xếp hạng+EXP); bù/bổ trợ → KHÔNG Elo, EXP **sàn** (`attend_floor`), vẫn đo mastery.
- **Engine PURE** `src/gami/*.js` (JS thuần, test `node scripts/verify_gami.mjs` — KHỎI vitest; tsconfig có allowJs): `config/elo/exp`. Fixture Elo khớp tuyệt đối ✓.
- **Service** `src/lib/gami.ts`: buoiAoCuaNgay·moBuoi·huyBuoi·diemDanh·gradeProblem·**closePhase**(Elo+EXP, idempotent qua `*_dong_at`).
- **UI** `src/screens/gami/BuoiHocScreen.tsx`: list buổi ảo→Mở→`BuoiDetail` **4 tab** (Điểm danh/Đánh giá sau buổi/Chấm bài trên lớp/ET)→Đóng phase→reveal. `BuoiDetail` export + props `tabs`/`initialTab`/`canManage` (mở từ "Việc của tôi" theo vai). Test e2e từng bước OK (OPS mở+điểm danh, TA thấy chấm/ET); chấm-ET-load-từ-tài-liệu chưa nối (#4).
- **Card lớp** giờ hiện sĩ số + GV/TG + badge đủ-thông-tin (`thongKeLop`).
- **SearchSelect** (`src/components/SearchSelect.tsx`): combobox bỏ-dấu thay MỌI dropdown list dài (quy tắc cố định — xem ② + memory).

### Đã build (RBAC + 1 MÀN + GAMI mở rộng + ET — 06-15→16)
- **⭐ 1 MÀN DUY NHẤT (spec gốc):** BỎ 2 tab top "Nhân sự/Admin". `App` render `NhanSuHome` (màn hợp nhất); `TopBar` chỉ còn tên app + hồ sơ + đăng xuất (bỏ DEV "xem với vai trò"). 1 cây nav trái = **Việc của tôi** (vận hành) ++ leaf màn role cấp (phát triển). Xóa `AdminScreen.tsx`. **Vận hành** ở Việc-của-tôi · **phát triển** = các màn (Kho/Làm tài liệu/Lớp/HS/Sơ đồ/Phân quyền…).
- **⭐ RBAC FEATURE-ACCESS (lớp ① "mở được màn nào", KHÁC ② task-scope getMyScope, ③ data-scope):** `vai_tro`(role=bó chức năng) + `vai_tro_chuc_nang`(role→leaf-id) + `vi_tri.vai_tro_id`(role bám GHẾ) + `nhan_su.la_admin_he_thong`(Founder bypass). Quyền 1 người = UNION role các ghế. RPC **`my_quyen()`** (security-definer, resolve nhan_su qua tai_khoan HOẶC email) → `{la_admin, chuc_nang[]}`, load lúc login vào store (`quyen`). **Tab Admin cũ → giờ:** leaf nào role cấp thì hiện trong nav; `la_admin` thấy tất. Màn **Phân quyền** (`PhanQuyenScreen`, leaf `phanquyen`, founder): tab1 **MA TRẬN role × màn** (tick=lưu ngay) · tab2 **gán role cho VỊ TRÍ**. ⚠ **team ≠ ghế:** gán role phải ở tab2 (set `vi_tri.vai_tro_id`), KHÔNG phải tab Nhân sự (đó là biên chế team). Seed `scripts/seed_default_roles.mjs` (6 role/team). Founder bootstrap: `nhan_su.la_admin_he_thong=true` cho admin@gmail.com (NS005) + Thùy NS001.
- **⭐ NỐI ACCOUNT THẬT (hết persona mock):** `PersonalCard` + `NhanSuHome` đọc `getMyProfile()`/`getMyScope()` → tên/ảnh/vị trí/lớp THẬT (không còn mock "Lộc"). "Việc của tôi" = **task DERIVE** (`getMyTasks`): OPS → buổi-ảo hôm nay (mở/điểm danh tại chỗ) · GV → đánh giá+chấm bài · TG → chấm bài+ET (trên buổi ĐANG MỞ của lớp phân công). Bấm card → mở `BuoiDetail` đúng tab, gate theo vai (`tabs`/`canManage`: OPS/admin sửa GV+hủy buổi; GV/TG read-only GV). GV mặc định = GV chính lớp (`getBuoi.gv_chinh_id`, fallback khi `nguoi_day` null).
- **⭐ BUỔI HỌC — 4 phần (ADR đo lường, Notion):** điểm danh(OPS) · **đánh giá sau buổi**(GV, nhận xét per-HS + verdict per-dạng {0/0.5/1} — MANUAL, bảng `buoi_danh_gia`+`buoi_danh_gia_dang`) · **chấm bài trên lớp**(ingame, GV tự thêm bài + gắn `gami_session_problems.ma_dang`, bảng SẴN 10 bài) · **chấm ET**(câu từ ET tài liệu — #4 chưa nối). Tab `BuoiHocScreen`: Điểm danh/Đánh giá sau buổi/Chấm bài trên lớp/ET. Đánh giá = BẢNG (HS × dạng, chip kết quả từ chấm-bài tham khảo + nút chốt mức).
- **⭐ TẠO ET (con của "Làm tài liệu" hub):** "Làm tài liệu" = node CHA trong tree, con = Giáo trình·ET·Đề thi·Bổ trợ (`LAMTAILIEU_CHILDREN`, NavTree auto-mở branch đang chọn). ET = `tai_lieu(loai='et')` + `lop_id`+`ngay` (gắn buổi qua lớp+ngày, mã `…ET`); nội dung = 1 phan `custom` chứa câu THEO THỨ TỰ. `ETScreen` câu-centric: N hàng (default 5), mỗi hàng **popup TO `DangPickerOne`** chọn dạng → gợi ý 1 câu → ↻Đổi/✎Chọn(KhoPicker)/+Thêm câu. lib: `createET/listET/getETByBuoi/setETCaus/getETCaus/suggestCauForDang/maET`.
- **⭐ Chống lạm dụng câu (least-used):** `cauUsage` đếm số lần câu trong `tai_lieu_cau` → mọi gợi ý (ET + luyện + BTVN) xếp **ít-dùng-nhất trước** (`cmpUsageLe`). 2 tầng: CỨNG trong buổi/đề không trùng · MỀM xuyên thời điểm = least-used.
- **⭐ ET — FORM hiển thị + IN + lưu MẪU:** **form hiển thị per-câu** (`cau_hinh.etFormByCau`, `etFormOf`) KHÁC `loai_cau` kho — câu kho "trả lời ngắn" in dạng "tự luận" được. `ETPrintView` (paged.js, tái dùng `CauItem`/`buildPagedCss`/`CHROME_CSS` export từ PrintView): phiếu Họ-tên/Lớp 1 dòng + **bảng điểm THEO CÂU** (Câu i / ô Đ-S, cap 60% căn giữa) · 3 phần: trắc nghiệm · **trả lời ngắn = BẢNG** (đề/ô-điền) · **tự luận = dòng kẻ** (số dòng `btvnLinesByCau`). Bản HS/GV. **Lưu vào kho** (mẫu = lop_id null) + "Dùng cho buổi" (nhân bản gán lớp+ngày) qua `duplicateTaiLieu`.
- **⭐ KHO TÀI LIỆU** (`KhoTaiLieuScreen`, leaf con `lamtailieu:kho`): BẢNG mọi `tai_lieu` (`listAllTaiLieu`, mọi loại) — Tên·Loại·Khối·Gắn-buổi·Ngày + cột cuối **🖨 In** (et→ETPrintView, else PrintView) · Nhân bản · Xoá. Lọc loại + tìm. = nơi TRA/TÁI DÙNG (khác "Làm tài liệu" = nơi SOẠN).
- **⭐ TRÍCH XUẤT BUỔI (master→con bám buổi):** giáo trình master = chuỗi buổi (PHÁT TRIỂN, không gắn buổi). Nút "⬇ Trích xuất/Gán lớp" cấp giáo trình → `TrichPanel`: chọn LỚP → list buổi + **trạng thái đã gán** (buổi→ngày, qua `nguon_id`+`nguon_buoi`, `listTrichXuat`) → gán buổi vào ngày → `trichXuatBuoi` sinh **"Giáo trình buổi X"**(`loai=giao_trinh_buoi`) + **"BTVN X"**(`loai=btvn`) bám lớp+ngày (VẬN HÀNH). Master giữ nguyên. Cả 3 hiện ở Kho. PrintView: scope `all|giaotrinh|btvn` (in tách quyển) · doc 'btvn' auto scope btvn. BTVN số câu đếm LIÊN TỤC xuyên dạng.
- **Gemini chống cháy:** CLONE khóa cứng Flash (ẩn Pro khỏi dropdown + ép flash trong code — vụ 920k); model chỉ `gemini-2.5-*`. Key `VITE_*` public trong bundle (nội bộ chấp nhận); key Vercel ≠ key local → đổi key phải sửa CẢ env Vercel + Redeploy.

### Đã build (06-16 — phiên 2: khép ET, chấm 5-mức/Đ-C-S, mốc hoàn thành, Elo per-môn, màn Điểm số)
- **⭐ Khép vòng ET (#4 cũ):** tab "Chấm ET" (buổi học) **tự load câu từ ET khớp (lớp+ngày)** qua `loadETForBuoi`→`ensureETProblems` (seed 1 problem/câu, gắn `ma_dang`). lib: `loadETForBuoi/ensureETProblems/resyncETProblems` (`gami.ts`). Seed dùng **upsert ignoreDuplicates** (unique `gami_session_problems(buoi,phase,problem_no)` — mig 0039) chống StrictMode đẻ trùng.
- **⭐ ET = FORM TẠO TRỰC TIẾP (bỏ list + popup gate):** leaf "ET" giờ render thẳng `ETEditor` — gán lớp+ngày ở header + 5 hàng câu; **Lưu ET → vào Kho tài liệu → form reset**. Sửa ET cũ = từ **Kho tài liệu** (nút ✎ Sửa, leaf con `lamtailieu:kho`). `DangPickerOne` tách ra `src/components/` dùng chung. ETScreen export `ETEditor`+`ETView`.
- **⭐ Chấm bài trên lớp = 5 MỨC 1-click (1→5)** thay popup 3-chiều (bỏ `ChamPopup`): `gradeMuc` (points=muc×20, result map; cột `muc` — mig 0038). Bảng kẻ ô, **cuộn ngang** (nhiều bài), header đậm rõ, tên HS canh giữa. Số mức **xám nhạt mặc định, click mới lên màu**. Gắn dạng qua **popup to** (DangPickerOne).
- **⭐ Chấm ET = Đ/C/S 1-click + 6 ô lỗi E01-E06:** `gradeET` (correct/partial/wrong→1/0.5/0); click S/C mở 6 ô lỗi (cột `gami_grades.loi` jsonb — mig 0037), tick→tự ẩn. `ET_FORM` hiển thị. Click lại mức đang chọn = **bỏ chấm** (`deleteGrade`). Tab chỉ load full câu ET, **không thêm/bớt bài**.
- **⭐ Đánh giá sau buổi:** Đ/C/S (=1/0.5/0, thống nhất ET), ô nhận xét rộng (w-96). Có **nút "✓ Hoàn thành đánh giá" + "↩ Mở lại"** (cờ `buoi_hoc.danh_gia_xong_at` — mig 0040) vì đánh giá định tính không có mốc tự nhiên.
- **⭐ MỐC HOÀN THÀNH từng task (pure-derive):** mỗi loại việc có mốc xong riêng — điểm danh (đủ HS), chấm bài (`ingame_dong_at`), đánh giá (`danh_gia_xong_at`), ET (`et_dong_at`). **Buổi thường `hoan_tat` khi CẢ ingame+et đóng** (KHÔNG phải ET đóng là xong — sửa bug cũ làm task GV biến mất khi đóng ET). `getMyTasks` ẩn task theo mốc xong; **task xong vào nhóm "✓ Đã xong" (mở lại xem/sửa)** ở Việc-của-tôi, giống điểm danh OPS. `reopenPhase` mở lại 1 phase (rollback Elo/EXP).
- **⭐ Việc-của-tôi: 1 người NHIỀU vai/lớp** (gv-phụ + tg) → `getMyTasks` gom **MỌI vai** (không gộp về 1 ưu-tiên-gv), dedup tab trùng → thấy đủ Đánh giá+Chấm bài+ET. (Bug cũ: gv-phụ che mất task tg→ET.)
- **⭐ Buổi học: filter Chưa mở / Đã mở / Đã hủy** + **Hủy buổi tách khỏi Mở** (thẻ chưa-mở có 2 nút; `huyBuoiCuaNgay` đẻ dòng huỷ cho buổi chưa mở). Thẻ "Đã mở" **bấm cả thẻ vào buổi** (bỏ nút "Vào buổi"). **`dongBoSiSo`**: vào buổi đang mở tự thêm HS ghi danh-sau-khi-mở (vá snapshot sĩ số).
- **⭐ ĐÓNG PHASE chống tính 2 lần (atomic claim):** `closePhase` set cờ `*_dong_at` NGAY + có-điều-kiện (`where dong_at is null`) → bấm đúp/đua không tính Elo×2. Nút "Đóng…" có busy. (Đã từng dính: 9A2 ET tính 2 lần.)
- **⭐ ELO/EXP TÁCH THEO MÔN (Thùy chốt):** `gami_elo` unique `(hoc_sinh_id, mon)`; `gami_elo_history`+`gami_exp_ledger` thêm `mon` (mig 0041, backfill Toán). `closePhase` lấy `lop.mon`.
- **⭐ ELO — ĐẠI TU 07-28 (engine mới, CHỈ ET):** `Δ = clamp(w·K·(A−E)/(N−1), ±w·cap) + P − λ·(elo − mean_lớp)` · **K=30·cap=20·P=10·λ=0.05·MT_WEIGHT=4** (`config.js`; bỏ K_calibration/K_normal/K_MT/K_small/DELTA_CAP + hàm `getK`). `/(N−1)`=hết thiên vị sĩ số · `P`=mean dâng ~+P/buổi (động lực, KHÔNG zero-sum) · `λ`=bó spread + cho lật kèo (~7 buổi) · MT ×4 (dormant). **CHỈ ET vào Elo** (`coElo = phase==='et'` trong closePhase); **ingame** (data chưa ổn định) & **MT** (chờ điểm thang 10 ở `ky_thi`/`diem_thi` — bảng rỗng) tách ra, chỉ còn EXP theo hạng. Nối per-môn **XUYÊN LỚP theo `ngay`**, recompute expected (đường live provisional; **bảng chính thức = recalc theo ngày**). **Khóa thứ tự**: closePhase chặn đóng ET buổi `thuong` nếu buổi `thuong` trước chưa đóng ET (λ phụ thuộc trạng thái). Recalc DB T6–T7: `scripts/recalc_elo.mjs` (backup `scripts/_backup_*`, gốc `…06-20-38`). *(Model 2-Elo-độc-lập cũ + K_calibration/cap±40 đã BỎ.)*
- **⭐ EXP — REDESIGN ĐÃ BUILD ENGINE (07-28, Thùy chốt):** EXP = chăm chỉ (không phải giỏi). Bỏ ingame EXP → chỉ **ET/MT/BTVN**. Engine thuần `src/gami/exp.js` (`etRankExp`·`btvnBaiExp`·`monthlyBtvnExp`·`mtExp`) + núm ở `config.js EXP`. **BTVN mỗi buổi = 1 "bài"**: base 300 × hệ-số-nộp (đúng hạn 1.0·muộn 0.9·xin phép 0·không làm 0) × hệ-số-thái-độ THEO BÀI (nghiêm túc 1.0·chưa hết sức 0.9·**chưa nghiêm túc 0.7**·**chống đối 0**). Theo THÁNG (cutoff cuối tháng): +5% chăm-đủ-tháng · +5%/−5% so điểm-BTVN với TB lớp (>+5%/>−10%) · −5% tổng/bài không-làm. **ET** rank buổi→[200..300] (`ET_BANDS`). **MT** theo điểm thang-10 `diem_thi` (top lớp 1000, −50/0.25đ, **sàn 0**) — bảng rỗng→0, chờ nhập. **LEVEL recalibrate** BASE_COST 600→**1100** (thang cũ vỡ: cumExp(L21)=29k mà 1 mùa top ~54k → dồn L4-7; mới cumExp(L21)≈53k, tháng đầu trải L3-5). Mô phỏng: `scripts/sim_exp.mjs <lớp> <YYYY-MM>` (9A1/T7: BTVN 48% tổng, TB ~4900 EXP/HS).
- **⭐ EXP — ĐÃ WIRE service (recompute + tự cập nhật), 07-28:** EXP = **TÍNH LẠI theo (lớp×tháng)**, KHÔNG ghi per-buổi nữa. `recomputeExpThang(lopId, ym)` (`gami.ts`): Σ ET-rank buổi + BTVN-tháng (+MT=0) → 1 dòng ledger `source='exp_thang'`, `note=ym`/HS; idempotent (xoá per-buổi cũ theo `ref_buoi` trong tháng + exp_thang cũ → chèn lại). **TỰ recompute** khi đóng/mở lại **ET** (nguồn EXP) hoặc **BTVN** buổi thường (gọi ở cuối `closePhase`/`reopenPhase`/`closeBTVN`/`reopenBTVN`, try/catch không chặn đóng buổi). `closePhase` **bỏ ghi `rank_*` EXP** (reveal chỉ hiện đóng-góp-buổi = `etRankExp`); **bù/bổ trợ vẫn `attend_floor` per-buổi** (ngoài model tháng). **ĐÃ tính lại T7 thật** (qua app admin, `recomputeExpThang` mọi lớp Toán/KHTN): 250 HS×môn `exp_thang` tổng 668k, 0 sót old-source từ buổi T7 (9A1 TB 4846·7A1 3738). **June (mùa 2025-26) giữ old-source** — ngoài phạm vi. Preview mọi lớp: `scripts/recalc_exp.mjs` (read-only). **`getBangTong` EXP = all-time** (không window mùa); Level (thanhtich) window created_at theo mùa.
- **⭐ VIEW CẢ LỚP (Kết quả học tập, 07-28):** tab **"Cả lớp"** trong `KetQuaScreen`, **2 chế độ** (toggle): **① Tất cả lớp** = tổng quan **tỉ lệ hoàn thành dữ liệu** từng lớp cho phase chọn (ô kỳ vọng = HS-có-mặt × buổi-đã-đóng; hoàn thành = ô có dữ liệu — ET/MT có chấm điểm, BTVN đã ghi trạng thái nộp kể cả "không làm"); sắp **thấp→cao** để soi lớp nhập thiếu, bấm 1 lớp → chi tiết. Service `getAllClassesCompletion(mon, phase, ym)`. **② Chi tiết lớp** = ma trận HS×buổi, ô = % hoàn thành (≥80 xanh/50-79 vàng/<50 đỏ), **"Ko làm"** badge đỏ · `V` vắng · `·` chưa có · cột TB/HS. `getClassMatrix(lopId, phase, ym)`. Chung: toggle **ET/BTVN/MT** + điều hướng **tháng ‹ ›** (mặc định tháng nay). (`mastery.ts`). **Bỏ subtab "Lịch sử hoạt động"** của Từng-học-sinh. Toggle **Câu gốc/Tất cả** trong Kho câu hỏi (`DangHub`): gốc = `nguon≠'clone'` (không do AI sinh), có đếm.
- **⭐ EXP công bằng khi HOÀ:** cùng điểm thô → **cùng EXP = TB bậc EXP các vị trí nhóm chiếm** (vd 8 HS hoà 0đ → mỗi người 333, không phải 400/380/…/250).
- **⭐ Màn ĐIỂM SỐ** (`GamiDiemScreen`, leaf `diemso` nhóm Vận hành): tab **Bảng xếp hạng** (leaderboard per môn: Elo/EXP/buổi, bấm HS→hồ sơ) + tab **Theo ca học** (mọi ca: mã·lớp·môn·ngày + 2 nút **Elo lớp/Elo ET** → bảng tính). **Hồ sơ điểm HS**: Elo+EXP per môn · lịch sử Elo (bấm→bảng ca) · dòng EXP. `getEloBreakdown/listCaHoc/listGamiBangTong/getDiemHS`. Bảng tính hiện E/A/A−E/Δ/Elo/+EXP để **kiểm tra công thức**.
- **⭐ Sửa/Xoá chủ đề & chuyên đề (Kho):** thêm `renameDaiChuDe/renameDaiChuyenDe` (đổi TÊN, giữ MÃ) + nút ✎ trên cây chủ đề / card chuyên đề; **xoá = `deleteDaiCum`** (xoá kèm câu, cascade `tai_lieu_cau`/bổ-đề) — hết bị FK RESTRICT chặn. Confirm hiện số dạng+câu.
- **⭐ Bug TRÀN BẢNG (min-w-0):** grid/flex item mặc định `min-width:auto` → bảng rộng (chấm bài nhiều bài) bung cột thay vì cuộn → mất scrollbar + nút đẩy khuất. Fix: `min-w-0` ở khung phải `NhanSuHome` + BuoiDetail root + vùng nội dung.
- **HS:** tab **"Tất cả"** (mọi khối) + đếm **Đang học / Nghỉ riêng**; `countLopActiveByHS` (1 query). **PH:** mã đề-xuất sửa-được (`suggestMaPH`) + **sửa thông tin PH** (`PhForm` dùng chung tạo/sửa, `updatePhuHuynh`). **GV ở buổi:** avatar+tên, bỏ mã NS (`SearchSelect` thêm `avatars`).
- **Prompt clone Gemini:** siết bám-sát-gốc (song ánh bước, cấm bịa, số đẹp, ghi-chú = ràng buộc cứng) + luật ký hiệu **chia hết `\vdots` / không chia hết `\not\vdots`** (OCR hay nhầm). Clone thêm ô **dán ảnh đề chung** (gắn gốc + mọi biến thể).

### Đã build (BẢNG THÀNH TÍCH + 3 hệ điểm + fix kho tài liệu — 06-17)
- **⭐ FIX KHO TÀI LIỆU NHÂN ĐÔI:** trước có 2 "Kho tài liệu" (leaf ngoài `tl` Danh mục CHẾT chưa route + leaf con `lamtailieu:kho` chạy). Thùy: kho = TRA/TÌM, không phải làm → **route `tl`→`KhoTaiLieuScreen`** (NhanSuHome) + **bỏ `lamtailieu:kho`** khỏi `LAMTAILIEU_CHILDREN`. Giờ 1 kho duy nhất ngoài Danh mục.
- **⭐ BẢNG THÀNH TÍCH HS (player profile, per-môn, showcase "khoe"):** màn HS/PH xem + chiếu TV. **2 cửa 1 component** `BangThanhTich(hoc_sinh_id, mon)`: màn **Thành tích** (`ThanhTichScreen`, leaf `thanhtich`, FULL-SCREEN duyệt mọi HS→click) + **tab "Thành tích" trong Học sinh**. 4 zone: ① danh tính + avatar-theo-Level (placeholder 🥚) · ② **Level** (nổi bật) + Elo/Hạng/Elo-đỉnh + **thanh EXP→Xu** (lương tháng) · ③ thành tích thi đấu (Top-1 Lớp/ET/MT + chuỗi đi học + tổng buổi) · ④ danh hiệu. **SKIN: GAME style "Mythwings" (claude design) ĐÃ áp** — nền tối + Baloo 2, gem LV/HẠNG, thanh EXP→Xu, 🏆Elo, 3 danh hiệu chim-nguyên-tố (thunder/fire/frost, ảnh `public/mythwings/phoenix_*.png`); CSS scope `.bkprofile` (prefix `bp-`). KHÔNG sci-fi. **Xem cần HS có Elo** (buổi đã đóng).
- **⭐ 3 HỆ ĐIỂM (ADR Notion):** **Level** (Σ điểm sát hạch, max 21/mùa/môn, khó nhất, nổi nhất) · **Elo+Hạng** (phong độ) · **EXP→Xu** (LƯƠNG tháng, reset THÁNG, tra `luong_bac`). Mùa = niên khóa (1/7). Engine `src/gami/season.js`+`level.js` (đường cong dormant), service `src/lib/thanhtich.ts` (`getLevelXu`/`currentMua`/`verdictDiem`/exam CRUD).
- **⭐ ENTITY ĐIỂM THI + ghi hạng:** mig 0042 `gami_elo_history`+`rank`/`rank_total` (closePhase LƯU hạng mỗi buổi → đếm Top-1). mig 0043 `ky_thi`(loai truong/mt_sat_hach/khao_sat_thang·he_so 2/2/1·dot·`buoi_hoc_id?` nối MT) + `diem_thi`(verdict đạt/gần/không·`band_luc_thi` snapshot·vuot_band) + `muc_nang_luc.diem_ky_vong`. **MT = 1 sự kiện 3 vai** (Elo+Level+vượt-band, KHÔNG tách "ST"). 4 kì trường = 4 INSTANCE cùng loai.
- **⭐ TAB QUẢN LÝ LEVEL** (`QuanLyLevelScreen`, leaf `quanlylevel`, staff SaaS): chọn lớp→môn+roster+kì thi mùa · tạo kì thi · nhập điểm/verdict/vượt-band 1 kì thi · ma trận HS×kì thi + cột Level=Σ.
- **Thành tích catalog:** `thanh_tich_loai` (seed 12 loại, pure-derive) + `hoc_sinh_thanh_tich_ghim` (HS chọn khoe / hệ gợi ý). `btvn_ket_qua` (chờ luồng nộp BTVN). **CÒN → ⚠ SUPERSEDE 28/09 bởi hệ huy hiệu mới (mục ⭐ GAMIFICATION HS):** compute catalog còn lại + gợi ý/ghim + skin game + kì-vọng-band + số-xu-bậc (đang provisional) + art nhân vật.
- **⭐ REPORT PHỤ HUYNH (tháng)** — leaf `report_ph` (nhóm Quản lý chất lượng), 1 report / (HS × môn × tháng). `src/lib/report.ts` + `src/screens/report/ReportPHScreen.tsx`. Chọn **Môn → Lớp → HS** + tháng ‹›. **Số liệu SUY ĐỘNG** (không lưu): bảng theo buổi `getReportBuoiHS` (ET% · BTVN% · thái độ; **vắng → "Vắng" ở cột ET** vì ET = điểm danh) + tổng quan `getTongQuanHS` (hoàn thành cơ bản/nâng cao, ET/BTVN/MT %). **Chỉ nhận xét GV được LƯU** ở bảng `bao_cao_ph(hoc_sinh_id, mon, thang)`: 4 ô `thai_do`·`kien_thuc_ky_nang`·`ket_luan` + `muc_tieu` (🎯 tháng tới) + `ket_luan_muc` (5 mức: vượt bậc/tiến bộ/ổn định/đi xuống/cần hỗ trợ). Layout 2 cột DỮ LIỆU trái · NHẬN XÉT phải; on-screen gộp **Bản đồ kiến thức + 3 card ET/BTVN/MT** (Tổng·Cơ bản·Nâng cao). **Ảnh gửi PH** (`PhAnhModal`) khớp mockup "BK Academy" (`bk_academy_monthly_report_mobile.html`): hero gradient + ring SVG %hoàn-thành + 2 skill bar (Kiến thức=độ đúng ET · Thái độ=TB thái độ BTVN) + status 3 ô + bảng đánh giá + goal card; copy clipboard = **pattern V1** (popup + html2canvas CDN + inline-hex né oklch → paste Zalo). Migrations lẻ: `202607281900_bao_cao_ph` · `202607282000_ketluanmuc` · `202607282100_muctieu` · `202607291500_muc_skill`(muc_kien_thuc/muc_thai_do smallint 1..5). **2 skill bar = THANG 5 GV TỰ CHỌN** (không suy động): GV bấm mức 1..5 ở NhanXet (`SKILL_MUC` Cần cố gắng→Xuất sắc) → bar 5 đoạn trên ảnh. Ảnh teacher-card giờ ghép **cả text** `kien_thuc_ky_nang`/`thai_do` (kèm tag) + bar. **GV chủ nhiệm** = `getGVChinhLop(lopId)` (phan_cong_lop vai_tro=gv la_chinh=true) → dòng "GV …" ở hero + subtitle. Còn nhỏ: trend pill trống ở tháng đầu môn (chưa có kỳ trước để so).

### Đã build (06-17 phiên 3 — mobile chấm bài, profile fit+ghim, fix tài liệu, clone Phase 0)
- **Mobile "Chấm bài trên lớp":** hook `src/hooks/useIsMobile.ts` (matchMedia ≤767px; KHÔNG bị `zoom:1.15` vì đọc viewport). `ChamTab` rẽ nhánh → **`ChamMobile`** (BuoiHocScreen): header 1 hàng **sticky** ‹ Bài N/total › + "Đã chấm X/Y"; mỗi HS 1 hàng = tên (**2 từ cuối**) + 5 nút mức 1→5; chọn-dạng/+Bài/Đóng-buổi ở CHÂN. `BuoiDetail` mobile: ẩn mã buổi + ô chọn GV, tabs cuộn ngang, padding p-3.
- **Profile thành tích (`BangThanhTich`) — fit + 4 ghim:** **fit mode** = giữ layout DESIGN_W=1160 rồi `transform:scale` vừa khung (ResizeObserver, ≤1, hết cuộn); bật ở `ThanhTichScreen` (full-screen) + tab HS. Bố cục landscape, thu nhỏ phần trên + thẻ danh hiệu thấp lại. **"Thành tích thi đấu" = 4 ô showcase TUỲ CHỌN** (ADR §6, sửa lệch logic cũ 6-dòng-cố-định): HS **ghim ≤4** (nút ✎), chưa ghim → hệ gợi ý 4; lib `getThanhTichGhim/setThanhTichGhim` (`hoc_sinh_thanh_tich_ghim`). Pool 6 loại tính được (top1 lop/et/mt · elo đỉnh · chuỗi · tổng); 6 loại kia (điểm 10/9+/vượt-band/lên-band/chuỗi-btvn/chuyên-cần) chờ data.
- **Fix tài liệu:** (1) **phiếu BTVN trích xuất BỎ trang bìa thừa** — scope btvn không render `.pv-cover` + `.pv-doc-btvn > .pv-btvn:first-of-type{break-before:auto}` (gate class để KHÔNG đụng BTVN nhúng giáo trình). (2) `TaiLieuBuilder` thêm chỉ báo **"↻ Tự động lưu / ✓ Đã lưu"** (builder lưu ngay mỗi thao tác, KHÔNG có nút Lưu). (3) **Đổi tên file ngay tại Kho** (`KhoTaiLieuScreen`: bấm tên → `updateTaiLieu(ten)`) — vì builder có 2 ô tên (tên file `tai_lieu.ten` vs tiêu đề buổi `tai_lieu_phan.tieu_de`) dễ nhầm.
- **Clone Phase 0 — công cụ CẮT HÌNH dùng chung:** `src/components/PdfCropper.tsx` (cài `pdfjs-dist@4`): nạp PDF/ảnh → render **300 DPI** (hình vector nét) → kéo khoanh vùng → cắt DPI cao → File PNG (caller tự upload). Wire vào **`ImageSlot`** (DangHub) nút "✂️ Cắt PDF" → phủ ảnh đề/đáp án per-câu (nhập chuỗi câu) + ảnh chung clone. Worker Vite `pdf.worker.min.mjs?url` (bundle asset riêng).
- **Clone Phase 0 — ảnh LÝ THUYẾT inline (XONG):** `MathText` (kho/ui.tsx) hỗ trợ `![alt](url)` → `<img class="mt-img">` (tách `renderText`→`renderBold` + lớp ảnh) → hiện ở MỌI nơi render lý thuyết (màn + PrintView). CSS `.mt-img`: index.css (màn, max-h 360px) + PrintView CONTENT_CSS (in, max-h 60mm, break-inside avoid). Editor lý thuyết (BanDo modal) thêm nút **"✂️ Cắt hình chèn"** → PdfCropper → `uploadKhoImage` → chèn `![](url)` tại con trỏ (taRef). KHÔNG migration (ảnh = markdown trong `noi_dung`).
- **PdfCropper — fix + tiện (XONG):** (1) vị trí cắt lệch con trỏ do `zoom:1.15` → map `((clientX-rect.left)/rect.width)*canvas.width` (chia tỉ lệ rect, KHÔNG trừ thẳng). (2) phải chọn file 2 lần → canvas LUÔN mount (ẩn khi chưa ảnh) để `paintDisplay` không hụt. (3) **nhớ PDF giữa các lần cắt** (`cachedPdf` module-level) → 1 file nhiều hình cho nhiều câu khỏi upload lại; header hiện 📄 tên + "Đổi PDF/ảnh".
- **⭐ Phase 2 ingest GỘP vào "Nhập chuỗi câu"** (06-18, bỏ màn spike riêng `IngestSpike` — Thùy: bản chất = nhập chuỗi câu + phân tích hình): batch method 'auto' = render trang DPI cao (`src/lib/pdfRender.ts`: fileToCanvases/canvasToJpegBase64/cropCanvasBox) → `callGeminiRich`+`INGEST_SCHEMA` (dò câu + `co_hinh` + `box_hinh` 0–1000) → cắt hình → ReviewItem(anh_de) → **review per-câu SẴN CÓ** (CauEditor). Checkbox **📐 Có hình** (tắt → tách chữ thuần, gửi cả file 1 call, rẻ hơn). **2 luồng lời giải**: 📄 Bóc sẵn (người) / 🤖 AI giải (tự giải, think 8192, cần duyệt) → nhãn `nguon_giai`. Token đo ~10–13k/trang Flash ≈ cent/trang.
- **⭐ Nhãn NGUỒN LỜI GIẢI `dai_cau_hoi.nguon_giai`** (mig 0044: nguoi/ai, backfill clone→ai): badge 🤖 "AI giải · cần duyệt" ở thẻ câu kho → review + vision AI quản kho.
- **⭐ JSON AI = `responseSchema` cho MỌI call** (callGeminiJson + callGeminiRich): CLONE_SCHEMA/BATCH_SCHEMA/LYTHUYET_SCHEMA/INGEST_SCHEMA/THEORY_SCHEMA + `lenientJsonParse` lưới → hết "Bad escaped"/"Expected , or }". **Clone bật thinking 8192** (sửa #3 giải sai toán: do Flash tắt thinking).
- **⭐ ĐO TOKEN → ₫**: meter phiên (recordUsage mọi call) + **badge nổi** `GeminiMeterBadge` (góc dưới-phải: lần·token·≈₫·reset). Giá `GEMINI_GIA`/`USD_VND` ở `kho/api.ts` (PROVISIONAL — sửa theo ai.google.dev/pricing).
- **⭐ BTVN trong buổi ✅ (06-18) — mảnh cuối session** (TA chấm buổi sau). Tab "BTVN" (BuoiHocScreen, phase='btvn'): **chấm câu Đ/C/S như ET** (load doc `loai='btvn'` của buổi qua getBTVNByBuoi/getBTVNCaus; gradeET tái dùng) — ⚠ **THAM KHẢO, KHÔNG vào mastery/Elo** · per-HS **trạng thái nộp** (đúng hạn/xin phép/không làm/nộp muộn) + **thái độ** (nghiêm túc/chưa hết sức/chưa nghiêm túc/chống đối) ở `btvn_ket_qua` · **báo động 🚨** "HS kém dạng Y" + ghi chú → `canh_bao_yeu` (tín hiệu NGƯỜI-confirm = TIN, nguồn "ai cần hỗ trợ"). **Đóng BTVN** = `closeBTVN` thưởng **EXP hoàn thành** theo trạng thái nộp (BTVN_EXP provisional; source='btvn'; KHÔNG Elo, KHÔNG gate hoàn-tất). getMyTasks: TG +task "Chấm BTVN". **Session đủ 5 mảnh: điểm danh · chấm bài · đánh giá · ET · BTVN.**
- **CÒN Phase 0 clone:** #2 chuẩn hoá ⋮→`\vdots` · #1 cho phép bảng `\begin{array}` · #3 bật thinking clone + 1 call kiểm độc lập + chặn clone khi câu có hình. (Nếu clone/batch còn lỗi JSON → áp `responseSchema` cho chúng như spike.)

### Đã build (06-20→22 — sửa loạt lỗi release)
- **Thứ tự điểm danh ỔN ĐỊNH:** `getRoster` (gami.ts) thiếu `.order()` → mỗi UPDATE điểm danh đẩy dòng cuối heap (MVCC) → roster loạn. Fix: sort client theo `hoc_sinh.ho_ten` (localeCompare 'vi', tie-break id). Mọi tab buổi `roster.filter` từ đây → ổn định hết.
- **⭐ "Đóng" → "Xác nhận", GIỮ BẢNG (BuoiHocScreen, tab Chấm bài + ET):** Thùy: đóng = xác nhận, đừng tắt bảng (sau chỉnh mất công mở). Bỏ early-return RevealView (xoá RevealView + reveal state + getEloBreakdown/EloBreakdown/RevealRow — Elo breakdown vẫn ở **màn Điểm số**). Đã xác nhận: bảng giữ nguyên, nút chấm KHOÁ (read-only, thấy kết quả) + **"↩ Mở lại để sửa"** (reopenPhase hoàn Elo). Mobile ChamMobile có locked/onMoLai. (Read-only-khi-xác-nhận để Elo không lệch.)
- **⭐ Ảnh kết quả ET gửi PH (TẠM, dashboard sau) — `EtAnhGuiPH`:** nút "📷 Ảnh gửi PH" header ET → **ẢNH CẢ LỚP** (bảng dọc HS×Bài, ô Đ/C/S màu; KHÔNG thẻ riêng, KHÔNG đề/dạng). Chú thích 1 dòng: Đ·C·S. **Copy = ĐÚNG pattern V1 `TabSatHach.handleCopy`/`copyImg` (06-22 sửa 6 vòng):** nút "📋 Copy ảnh" → `window.open` popup chứa card `outerHTML` + html2canvas tải **CDN** + 2 nút TRONG popup ("📋 Copy ảnh (paste Zalo)"→`clipboard.write` ClipboardItem / "🖨 In-Lưu PDF"); fallback tải file CHỈ trong catch. Card **inline-hex tự mô tả** (không nhúng CSS app → né oklch Tailwind v4). Badge Đ/C/S = **`<Badge>` SVG** (`circle`+`text dominant-baseline=central`) → căn tâm pixel-perfect. KHÔNG dùng `html-to-image`/iframe/chụp-node-live nữa.
- **⭐ Chấm BTVN load được (mig 0046):** mig 0045 QUÊN nới CHECK `gami_session_problems.phase` → insert phase='btvn' bị chặn 400 → BtvnTab catch → "Chưa có BTVN" (đánh lừa). **0046 nới phase thêm 'btvn'** (ĐÃ áp DB cloud). Giờ load đủ câu BTVN.
- **Clone giữ xuống dòng (api.ts):** responseSchema (constrained decoding) gộp chuỗi 1 dòng → mất bố cục. Fix: `description` per-field de_bai/loi_giai (ép giữ nhiều dòng) + siết rule FMT_RULES. ⏳ chưa verify thật (LLM) — Thùy clone thử; fallback: bỏ responseSchema riêng cho clone.
- **⭐ In phiếu BTVN + Giáo trình buổi — BỎ LẶP tiêu đề (PrintView):** `buildPagedCss` thêm `opts:{headerText,footerText}` override (footer white-space:pre). Doc loai `btvn`||`giao_trinh_buoi`: **Header dải sóng = Lớp X · ngày** (query tên lớp từ lop_id) · **Footer = BK Academy · Tel 0963.209.309 · 17A10 KĐT Geleximco**. BtvnSheet isBtvnDoc → tiêu đề = TÊN BUỔI 1 dòng. giao_trinh_buoi: **bỏ pv-cover** (tên buổi ở dải hồng) + LT heading buổi-1-chuyên-đề rút gọn "Lý thuyết" (bỏ lặp tên chuyên đề). (Nhãn BẢN HS/GV mất khỏi giao_trinh_buoi — biết qua nút chọn bản.)

### Đã build (06-23 — Việc-của-tôi: tuần + deadline + redesign · fix sĩ số)
- **⭐ "Việc của tôi" làm lại (`NhanSuHome.tsx` `VietCuaToi`):** **filter TUẦN** (T2→CN; **Tuần 1 = 29/6–5/7**; trước = "Tuần khởi động" ≤0; mặc định tuần hiện tại; nút ‹ ›/"Tuần này"). Layout **vận hành chiếm hết (1fr) · phát triển rail 280px** (container max-w-1600). **Filter loại việc** (chip điểm danh/chấm bài/ET/BTVN/đánh giá). **Dải số liệu** (Cần làm/Quá hạn/Sát hạn/Đã xong tuần). **"Đã xong — lịch sử"** = all-time sort `doneAt` desc, 20/lần + "Mở thêm". Card xếp dọc: icon loại + tên FULL (bỏ truncate) + thông tin đầy đủ + **deadline 1 dòng riêng** (border-2 + accent trái màu theo loại). **BỎ nav tree "Tra cứu & sửa"** (`staffNavFromScope` chỉ còn lá "Việc của tôi") + bỏ panel "Lớp tôi phụ trách". Cột phát triển = placeholder "Giao việc — sắp có".
- **⭐ DEADLINE (Thùy chốt) — `src/lib/tuan.ts`** (util tuần BK + deadline, giờ VN chuẩn): chấm-bài + đánh-giá = **23h59 ngày buổi** · ET = **12h trưa hôm sau** · BTVN = **2h TRƯỚC ca học tiếp theo** của lớp (suy từ TKB quét ≤21 ngày). 3 mức màu `mucDeadline` (qua_han/sat≤2h/gan≤8h/con_nhieu) — **ngưỡng `NGUONG_DEADLINE` CHỈNH ĐƯỢC** (chưa có UI settings, dựng sau). `MyTask` thêm `lopId·doneAt·deadline`. OPS điểm danh theo tuần = **`buoiAoCuaKhoang(tu,den)`** (gami.ts).
- **⭐ FIX BUG sĩ số — HS thêm SAU khi mở buổi không vào điểm danh:** roster `buoi_hoc_hs` = snapshot lúc mở; `dongBoSiSo` cũ chỉ chạy lúc mount + từ chối `hoan_tat`. **Fix:** `nhansu.ts` `syncHSVaoBuoiTuNgay` — `ghiDanh`/`setNgayVao` (→`chuyenLop`) SAU upsert tự thêm HS vào roster MỌI buổi mở của lớp từ `ngay_vao` (mo+hoan_tat, bỏ huy, idempotent) → join NGAY khỏi mở lại buổi; `dongBoSiSo` nới guard `==='huy'` (sync cả hoan_tat). Buổi hoan_tat thêm HS → tự về "cần điểm danh" cho OPS đánh dấu. (Đã backfill data kẹt 1 lần.)
- **Gu UI staff = clean/modern NHIỀU MÀU, KHÔNG sci-fi** (Thùy bỏ hẳn HUD). Quy ước: muốn "đẹp hơn" → **dựng mockup (visualize) duyệt hướng TRƯỚC** khi sửa code thật.

### Đã build (06-23/24 — Tuyển sinh (phễu) + Bổ trợ Bù + thống nhất mã)
- **⭐ TUYỂN SINH — phễu Test đầu vào L5→L8** (ADR §Nguồn-intent; mig **0048** `ung_vien`+`ung_vien_viec`+`ung_vien_log`): màn `tuyensinh` (Vận hành), toggle L5/L6/L7/L8/Đã-loại. L5 đăng ký→L6 test→L7 học thử→**L8=`hoc_sinh` đang học**. Lead = `ung_vien` RIÊNG; checklist tick (chấm-bài gắn cờ derive TẠM tick tay); **Hoàn thành L7=convert** tạo HS+gộp PH theo SĐT+xếp lớp. Loại+lý do (Đã loại, mở lại). Nguồn=free-text+gợi-ý-distinct. `src/lib/tuyensinh.ts` · `src/screens/tuyensinh/TuyenSinhScreen.tsx`. (Seam chấm-bài-test = ADR riêng sau.)
- **⭐ BỔ TRỢ BÙ — bù buổi nghỉ L1→L3** (ADR; mig **0049** `bang_khong_bu` + `gami_session_problems.hoc_sinh_id`). **NHÓM NAV RIÊNG "Bổ trợ"** ngang hàng Vận hành (lá `botro`="Bù"; 5 loại bù/yếu/đuổi/định-kỳ/ôn-thi). TÁI DÙNG `buoi_hoc loai='bu'`+`bu_cho_buoi_id`. Tabs Cần-bù(L1 derive)/Đã-xếp(L2)/Hoàn-thành(L3)/Không-bù. L1: mỗi HS 3 nút 1-click (Xếp/Không-xếp-được/Không-cần-bù) + info 3-block (tên·lớp·ngày). **Xếp bổ trợ**: tạo buổi bù mới (mặc định **TA của lớp** + GV+giờ+phòng từ lớp mẹ) HOẶC chọn buổi sẵn → link per-HS. **Detail buổi bù**: điểm danh + **ET per-HS = ET buổi MẸ** (ensureBuoiBuETProblems) + đánh giá per-HS×dạng → đóng cả 2 → L3. `getMyTasks` mở cho `loai='bu'` (nguoi_day=GV→đánh-giá·nguoi_day_tg=TA→ET, KHÔNG Elo). `src/lib/botro.ts` · `src/screens/botro/BoTroScreen.tsx`.
- **⭐ THỐNG NHẤT MÃ PH/HS 4 số** (Thùy: mã cũ/mới lệch + sợ tái-dùng-số): `suggestNextMa` (nhansu.ts) parse phần SỐ trên TOÀN BỘ dòng (kể cả nghỉ) → max+1 pad, KHÔNG tái dùng. Data migrate 1 lần (throwaway): dời 20 mã PH đụng-số→PH0694+, pad 279 mã cũ→4 số (PH####×299), nắn HS "1111"→HS0621. Mã = ID hiển thị (KHÔNG FK).
- ⚠ **Cấp quyền:** leaf `tuyensinh` + `botro` admin thấy sẵn; **OPS chưa thấy** → cấp ở Phân quyền (tab gán role cho vị trí / ma trận role×màn).

### Đã build (06-24/25 — KHTN Kho + Tuyển sinh nâng cấp + gỡ HS khỏi buổi + mon.ts)
- **⭐ KHTN KHO độc lập** (mig **0050** `khtn_ban_do`/`khtn_cau_hoi`/`khtn_dang_ly_thuyet`/`khtn_chuyen_de_ly_thuyet` clone `dai_*`, seq KG/KC; `tai_lieu.mon` default 'toan'). **Mỗi môn = BẢNG RIÊNG** (Thùy chốt: môn độc lập để tùy biến riêng; kho làm-1-lần, ko-liên-quan-vận-hành nên ko rối). `branches.ts`: `BranchConfig.key` thêm `'khtn'` + field `cauTbl`; `khtnBranch` (cauTbl='khtn_cau_hoi'). `KhoScreen` thêm bộ chọn **MÔN** (Toán: tab Đại/Hình · KHTN: 1 cây, ko nhánh). `api.ts` câu-funcs nhận `tbl=` (default `dai_cau_hoi` backward-compat) + section KHTN map/lý-thuyết. KHTN cấu trúc = Toán (Chủ đề→Chuyên đề→Dạng, KHÔNG Đại/Hình). Anh để sau (họp GV).
- **⭐ TUYỂN SINH nâng cấp** (mig **0051** thông-tin-HS-đầy-đủ · **0052** `phu_huynh_id` · **0053** `hoc_sinh_goc_id`): form nhập ĐỦ như Học sinh (ngày sinh/giới tính/trường/địa chỉ → convert copy thẳng) · **SỬA lead** (`UvFormModal` create/edit, nút ✎) · cột **Lưu ý** (`ghi_chu`) mọi level · số đếm level to/đậm · **toggle bar MÔN** riêng (phễu+L8+đếm lọc theo môn) · **chọn PH cũ** (con thứ 2 — link `phu_huynh_id`, convert dùng thẳng ko tạo PH trùng; banner liệt-kê con để xác nhận) · **chọn HS cũ học thêm môn** (`timHocSinh`+`chiTietHSChoLead` → fill HS + PH tự load; convert chỉ **GHI DANH** lớp môn mới, KHÔNG tạo HS/PH mới) · picker xếp lớp lọc đúng `uv.mon`.
- **⭐ GỠ HS KHỎI BUỔI (OPS)** — nút ✕ trên tab điểm danh (`canManage`): `xoaHSKhoiBuoi` (gami.ts) **CHẶN CỨNG** nếu HS đã có đo lường thật (ET/điểm/elo/exp/BTVN/cảnh-báo) → chỉ xoá dòng `buoi_hoc_hs` RỖNG (xếp nhầm lớp). Đúng §1.5 (ko xoá đè đo lường) + pure-derive (gỡ dòng=sĩ số tự đúng).
- **⭐ `src/lib/mon.ts` = 1 NGUỒN MÔN** (`MON_LIST` = Toán/KHTN/Tiếng Anh/Văn). Tuyển-sinh (`MON_OPTIONS`) + HocSinhScreen panel lớp&band đều dùng → **luôn hiện đủ 4 môn** (lấy từ danh mục, KHÔNG suy từ môn-có-lớp). Thêm môn = sửa 1 chỗ.
- 🔧 **Data fix** (chạy thẳng DB qua `_diag`→`_del` scope theo id, KHÔNG trong commit): xoá điểm danh SAI Quỳnh Trang@9A2 25/06 (em học thật ở 9B1, đã `da_roi` 9A2) · xoá 1 buổi test `6A1.T2.22062026` (lớp khai giảng 15/07 = chưa khai giảng; giữ lớp + ghi danh).

### Đã build (06-26 — Bổ trợ ĐUỔI luồng · Kho Đúng/Sai · CRUD/gộp buổi bổ trợ · fix BTVN/ET)
- **⭐ BỔ TRỢ ĐUỔI** (mig **0055** `bo_tro_duoi` case HS×lớp + `buoi_hoc_hs.bo_tro_duoi_id` + `ung_vien.can_bo_tro_duoi`; `buoi_hoc.loai='bo_tro_duoi'` đã hợp lệ sẵn). Leaf `botro_duoi` (nhóm Bổ trợ). 3 tab Cần đuổi (case `can_duoi` CHƯA trong buổi MỞ → buổi xong HS tự về) / Đã xếp / Hoàn thành. Buổi đuổi = **điểm danh + nhận xét** (KHÔNG ET). Nút Hoàn-thành-buổi + per-HS **Hoàn-thành-KHÓA** (rời luồng). `botro_duoi.ts` · `BoTroDuoiScreen.tsx`. **Trigger CHÍNH = nút "Bổ trợ đuổi" ở cột L6/L7 tuyển sinh** → convert L8 + tạo case (đuổi=đã chính thức→skip học thử); "Thêm HS cần đuổi" = luồng phụ.
- **⭐ MODEL RANH GIỚI (Thùy chốt):** đo-lường/dịch-vụ chỉ ở **L8 (hoc_sinh chính thức)**; **L5-L7 = phễu `ung_vien` thuần** (chưa đo), 2 khu tách sạch, KHÔNG status lai. Học-thử "đo" = ghi-chú định-tính (làm sau, ko phá model). Cam-kết-sớm (đuổi/đăng-ký-luôn) = fast-track L8.
- **⭐ KHO ĐÚNG/SAI** (Phần 2 đề 2025): **CON của chuyên đề** (cạnh Lý thuyết, nút 📋 ở header chuyên đề BanDo — gate `config.cauTbl` → Toán+KHTN). 1 đề chung + **4 mệnh đề, MỖI mệnh đề 1 dạng riêng**. Tái dùng `dai_cau_hoi.menh_de` jsonb (`[{noi_dung,dap_an D/S,ma_dang,loi_giai}]`); dang_chinh=dạng đại diện chuyên-đề-nhà. `DungSaiBank.tsx` (DungSaiPanel scoped 1 chuyên đề) + api `listDungSaiByDang`/`createCauDungSai`. **Nhập AI** PDF/ảnh → Gemini (`DUNGSAI_SCHEMA`+`buildDungSaiIngestPrompt`) bóc đề+4mệnh-đề+Đ/S+lời-giải → người sửa đáp án + gán dạng → lưu loạt. Câu `dung_sai` cũ (53, menh_de null) tự hiện, nhãn "chưa cấu trúc".
- **BTVN trùng doc (mig 0054)**: re-trích đẻ doc mới → 1 buổi 2 BTVN → maybeSingle throw → ko load. Fix: dọn 8 doc trùng (giữ mới nhất) + unique index từng-phần `(lop_id,ngay,loai)` + trichXuatBuoi xoá-rồi-tạo + getBTVN/getET `order+limit1`.
- **BTVN/ET layout 15 HS**: nén dòng + bảng cuộn-trong-khung (header dính) + ET bỏ w-full (cột câu 150px) + nộp/thái-độ cùng dòng tên (BTVN) + tên HS căn trái.
- **Bổ trợ CRUD buổi**: `updateBuoiMeta`+`SuaBuoiModal` (dùng chung: ngày/giờ/phòng/GV/TA) · Huỷ buổi · ✕ gỡ HS (`xoaHSKhoiBuoi` chặn nếu có đo thật) · nút ✎ NGAY trên card. **Buổi BÙ gộp 1 màn** (bỏ 3 sub-tab): mỗi HS 1 thẻ (điểm danh; co_mat→ET+đánh-giá 2 cột + Nhận-xét-GV). Đánh giá hiện TÊN dạng (chính)+mã (phụ) qua `getDangTen`.
- **Fix ET buổi bù cho TA**: route task `loai='bu'` từ "Việc của tôi" sang `BuoiBuDetail` (export, nhận `buoiId`, tự seed ET buổi mẹ) thay BuoiDetail thường (lop_id=null nên ET ko load).
- **Nút 🐞 Báo lỗi** dời lên TopBar (inline cạnh tên đăng nhập). Fix tên chuyên đề đè vòng % (pr-12).

### Đã build (06-29 — Tìm câu · mã khi soạn · HS toggle/sort · reorder dạng · CHIỀU MÔN: nhân sự + sơ đồ + tài liệu + điểm số/buổi · ⭐ ADR kiến trúc môn)
- **⭐ TÌM CÂU TRONG KHO** (tìm-để-SỬA câu sai nhanh): nút "🔍 Tìm câu" top bar `KhoScreen` (chỉ nhánh có câu — Đại/KHTN, ẩn Hình). `SearchCau.tsx` overlay: input autofocus + debounce 300ms + chống race (reqId). `searchCau(q, tbl)` (api.ts) = `.or(ma_cau.ilike.${q}%, noi_dung.ilike.%${q}%)` 1 query, **sanitize `,()`** (ký tự phân tách PostgREST .or()), limit 200; resolve tên dạng từ ban_do của môn (`BAN_DO_OF`: dai→dai_ban_do · khtn→khtn_ban_do). **Search THEO KHO ĐANG XEM** (per `config.cauTbl`), **KHÔNG xuyên môn**. Kết quả: mã + loại + tên dạng + 🤖AI + nội dung → nút **Sửa**: câu thường mở **`CauModal`** (export từ DangHub) · câu `dung_sai` mở **`DungSaiModal`** (export từ DungSaiBank; dangOpts nạp 1 lần qua `listDangOptions(tbl)` toàn môn). onSaved → reload search tại chỗ.
- **⭐ MÃ CÂU khi SOẠN (Ý 2)** — đối chiếu với Tìm câu (Thùy: "cấu trúc tài liệu chưa hiện mã thì tìm kiểu gì"): badge mã (mono, slate, `shrink-0`) ở `TaiLieuBuilder` (`MaCau` component — câu luyện CauRow + câu BTVN + **KhoPicker** lúc chọn) + `ETScreen` (dòng meta mỗi câu). **KHÔNG đụng `CauItem`/PrintView** → mã KHÔNG lên bản in HS.
- **⭐ HỌC SINH — toggle trạng thái + sort cột** (`HocSinhScreen`): **Toggle bar** Đang học / Nghỉ (segmented + số đếm, mặc định Đang học) quản lý RIÊNG; **Bảo lưu** chỉ hiện segment khi có HS bảo lưu (data 3 trạng thái — không giấu). Bỏ dải đếm cũ. **Sort click-header** (`Th` component ▲▼/↕): Họ tên · Mã · Khối · Số lớp — `localeCompare('vi',{numeric:true})` (Khối 4T/5T + mã HS#### đúng), Số lớp so number; mặc định Họ tên ↑. Thứ tự: search → đếm trạng thái → lọc trạng thái → sort.
- **⭐ REORDER DẠNG trong buổi (giáo trình)** — nút ▲▼ mỗi `DangCard` (BuoiCard.move hoán vị → `reorderDangInBuoi(id, buoiId, order)` → reload). LƯU Ý: code này có sẵn working-tree từ trước nhưng CHƯA commit → bản deploy ko có (Thùy ko thấy). Nay đã commit.
- **⭐ CHIỀU MÔN Ở NHÂN SỰ (scope④ — mig 0056)** — Thùy chốt **môn vào NGƯỜI** (n-n, nhiều môn — "có môn vào người mới làm orgchart") + **STRICT** (chưa gán → ko thấy môn nào; admin `la_admin` bypass). `nhan_su_mon`(nhan_su_id×mon, RLS member-gate). `nhansu.ts`: `listNhanSuMonMap`/`listMonOfNhanSu`/`setMonOfNhanSu`; `MyProfile.mons`. **NhanSuScreen**: cột Môn + multi-select "Môn phụ trách". **KhoScreen GATE**: `me.mons`+`quyen.laAdmin` → `MON_TABS` map 'toan'↔'Toán'/'khtn'↔'KHTN'; admin tất · gán→đúng môn · chưa gán→card "Bạn chưa được phân môn". **Backfill mọi NS = Toán**. ⚠ môn load lúc LOGIN → đổi xong phải đăng nhập lại.
- **⭐ SƠ ĐỒ TỔ CHỨC THEO MÔN — mỗi môn 1 CÂY ĐỘC LẬP (mig 0057, Thùy chốt fork (1)):** `vi_tri.mon` (null=liên-môn). `OrgChartScreen`: `CHUYEN_MON_TEAMS=['gv','ta','hoc_thuat']` → team chuyên môn hiện **bộ chọn Môn** (pill tím) + lọc `gheView=ghe.filter(mon===sel)` (cây độc lập/môn) → roots/childrenOf/cha-options/descendants theo gheView; "+Vị trí gốc" gắn mon=sel (liên-môn→null), ghế con kế thừa mon. EditGhe chip Môn/"Liên môn". **Backfill 31 ghế chuyên môn cũ → Toán**. **Mắt xích quyền:** ghế thuộc môn → gán role (Phân quyền) → đặt người → đăng nhập thấy đúng phần môn (role vẫn bó-màn dùng chung, KHÔNG đẻ role/môn). ⚠ ghế-môn (cấu trúc) ≠ `nhan_su_mon` (content-scope) — 2 nguồn, người ngồi ghế KHTN cần gán KHTN ở Nhân sự để vào kho KHTN.
- **⭐ ORGCHART hoàn thiện luồng quyền:** ứng viên ghế CHUYÊN MÔN lọc theo **môn của người** (`nhan_su_mon` chứa `g.mon`) thay vì team — chọn cây KHTN chỉ hiện GV/TA KHTN (ghế liên-môn giữ lọc team; checkbox "mở rộng" bỏ lọc). **Badge ghế**: chip role (indigo) / **"⚠ chưa quyền"** (amber) → thấy ngay ghế thiếu role. **Gán role NGAY trong modal ghế** (`setViTriRole`) — khỏi sang Phân quyền. Fix **lỗi cuộn tab "Gán role cho vị trí"** (GanTab thiếu `h-full`). (Vụ "trưởng khối KHTN ko thấy gì" = ghế chưa gán role, KHÔNG phải bug — role bám ghế.)
- **⭐ ĐIỂM SỐ + BUỔI HỌC theo môn:** Bảng xếp hạng `listGamiMons` đổi nguồn gami_elo→**lop** (môn-có-lớp) → toggle hiện đủ Toán/KHTN kể cả KHTN chưa Elo (default 'Toán'). Buổi học scope: GV/TA có môn → chỉ buổi môn mình; **Ops/admin/không-gán-môn → thấy TẤT** (điểm danh liên-môn).
- **⭐ TÀI LIỆU THEO MÔN (mig 0058 — mảnh cuối chiều môn cũ):** chuẩn hoá `tai_lieu.mon` 'toan'→'Toán' (125 doc). **`khoCuaMon(mon)`** (tailieu.ts) dispatch dai_/khtn_ (câu/dạng/2×lý-thuyết). autoSuggest*/setDangOfBuoi/getTaiLieuFull/createTaiLieu/createET/duplicate/trichXuat đều theo mon. **TaiLieuBuilder/ETScreen** dùng kho đúng môn (DangPicker `mon`, KhoPicker/DangPickerOne `cauTbl`/`mon`). Thư viện (Giáo trình + Kho tài liệu) **toggle + scope môn** (admin/Media/Marketing thấy tất). GV KHTN soạn giáo trình/ET bằng kho KHTN.
- **fix pdf.js worker INLINE** (`src/lib/pdfWorker.ts`, `?worker&inline`) — hết lỗi "fake worker failed/fetch .mjs" khi cắt PDF trên máy nhân sự/Safari (host serve .mjs sai MIME). + `cropCanvasBox` pad 0.04 (bbox AI ôm sát hay cụt nhãn).
- **⭐⭐ CHỐT KIẾN TRÚC MÔN (Thùy, sau audit gốc) — BÁC bỏ "schema chung", chọn "mỗi MÔN = 1 TRUNG TÂM riêng":** ADR cũ (Notion) định hướng gộp 1 bảng scope mon → **ĐẢO**. 4 môn = 4 bounded-context đối xứng (bản chất như nhau), chung HS+vận hành, **content RIÊNG từng môn/nhánh, KHÔNG gộp bảng** (gộp = ghép cứng domain độc lập, lợi hiệu suất ~0). Đơn vị độc lập = **NHÁNH** (mỗi nhánh tự cấu trúc: Đại=Câu, Hình=Bài/Ý). **LUẬT (CLAUDE.md §1.6): MỌI dữ liệu HỌC TẬP mang nhãn `mon`; chỉ phi-học-tập (HS cá nhân/PH/ví-xu/tài-khoản) mới chung.** Symmetry test: `if mon==='Toán'` đặc biệt = sai. Sản phẩm: `ADR-mon.md` + CLAUDE.md §1.6 + [Notion cập nhật](https://app.notion.com/p/38fd4530bcdb813cbb2cc602dd962875). **CHƯA động schema/code** theo hướng mới.
- **CÒN (theo ADR mới, khi build):** quy **Đại/Hình về 1 trung tâm Toán có nhánh** (đang 2 họ bảng như 2 môn) · gom 4 mapping dispatch (`branches`/`khoCuaMon`/`MON_TABS`/`DangPickerOne`) → **1 registry** · ref vận hành (`gami_session_problems.ma_dang`/`canh_bao_yeu.ma_dang`/`tai_lieu_cau.ma_cau`) **bổ sung `mon`** · DangPickerOne ở Buổi-học (chấm bài) truyền mon (KHTN chưa có buổi nên chưa lộ) · Anh/Văn chưa có kho.

### Đã build (06-29 phiên 2 — dọn KHO câu · BẢN IN thông minh · BLOCK model P1 · lý thuyết setting)
- **⭐ DỌN KHO CÂU (clone/import + code chặn):** (1) **Bỏ nhãn "Câu N"/"Bài N" đầu câu** — dọn 168 câu DB (regexp; ⚠ Postgres `\d`/`\s` KHÔNG match, dùng `[0-9]`/`[[:space:]]`) + `stripCauLabel` trong `normCau` (mọi luồng) + rule prompt. (2) **Tách 4 đáp án trắc-nghiệm nhúng trong đề** — dọn 29 câu (đòi dòng-riêng A&B&C&D né dương-tính-giả "a.c") + `stripEmbeddedOpts` (khi có lua_chon) + rule prompt. Câu như 07010102005 (trắc-nghiệm gắn nhầm tra_loi_ngan, đáp án nhúng noi_dung, lua_chon=null) → rendering tự tách (xem dưới).
- **⭐ BẢN IN THÔNG MINH (PrintView/ETPrintView, dùng chung `splitStem`/`OptGrid`):** câu trắc-nghiệm/ý-con render **lưới cột** (`optCols` ngưỡng **14/30**: ≤14→4 cột · ≤30→2×2 · dài→1 cột; vị trí A/B/C/D cố định). Ưu tiên tách: **đáp án A/B/C/D nhúng** → **ý con a)b)c)** (`splitLabeled`) → **ý con KHÔNG nhãn** (`splitUnlabeled`, sau khi strip). **Câu có HÌNH: thứ tự đề → HÌNH → đáp án** (ảnh `anh_de` chèn giữa stem và lưới). Dòng-viết ẩn khi có lưới. Áp cho cả giáo trình lẫn ET.
- **⭐ BLOCK MODEL P1 (mig 0059 `tai_lieu_phan.kieu`; ADR: block ≈ dạng, ⊆ dạng, câu giữ ma_dang):** mỗi block (phan) có `kieu` hiển thị — registry `BLOCK_KIEU` (thuong/2cot/3cot/4cot; **sau**: bang/ve_hinh/nhieu_y). Builder: nút **"Kiểu"** trên Bài luyện + BTVN (`setPhanKieu`). PrintView `CauList` column-count theo kieu. **Model đã sẵn NHIỀU block/dạng** (nhiều phan cùng ref_ma); **P2 chưa làm**: UI "+ block" chia 1 dạng thành nhiều block + gom dưới 1 header dạng.
- **⭐ LÝ THUYẾT = SETTING giáo trình** (`cau_hinh.inLyThuyet`, default có): builder "Trình bày" chọn **Có kèm / Không (ôn tập)**; **trích xuất buổi KẾ THỪA** (mỗi doc sửa riêng); PrintView đọc setting (KHÔNG toggle lúc in — Thùy trích-buổi-gán-lớp chứ không xuất cả file). Gate cả LT chuyên đề lẫn LT dạng.
- ⚠ **CẦN SOI PDF THẬT:** layout cột (block kiểu 2/3/4) + thứ tự hình chạy trên paged.js — chưa verify bằng mắt bản in.

### Đã build (07-01 — fix nhân đôi trang lý thuyết · MASTERY engine+service (dashboard kết quả học tập))
- **⭐ FIX NHÂN ĐÔI TRANG lý thuyết (giáo trình buổi trích PDF, buổi 3: 4→8):** nguồn = **race paged.js** (KHÔNG chỉ StrictMode). Effect preview deps `[full,gv,scope,lopTen]`; doc `giao_trinh_buoi`/`btvn` fetch `lopTen` ASYNC sau `full` → effect chạy 2 lần → 2 Previewer chồng lên cùng node (cleanup cũ chỉ `cancelled=true`, KHÔNG chặn Previewer đang flow) → trang gấp đôi. Master `giao_trinh` (lop_id null) ko fetch lớp → ko dính. **Fix (`PrintView.tsx`+`ETPrintView.tsx`):** mỗi run render vào CONTAINER RIÊNG (append live); run stale tự `container.remove()`, run mới xoá container cũ → luôn 1 bản. ✓ tsc+build. ⏳ chưa soi PDF mắt (Thùy pivot việc).
- **⭐ DASHBOARD KẾT QUẢ HỌC TẬP (Thùy: "quan trọng nhất") — engine+service XONG, MÀN chưa build:**
  - **3 TẦNG VIEW riêng** (KHÔNG heatmap gộp): **#1 từng HS** (QUAN TRỌNG NHẤT — port tab "Dạng bài" V1 `bkdemy-erp/src/components/StudentAcademicView.jsx`: mỗi dạng + timeline lần đánh giá gần nhất ✓/◐/✗ + nguồn IG/ET/ĐG + ngày + tỉ lệ 5/10) · **#2 lớp/hệ/khối** (rollup TỔNG QUÁT: bao nhiêu dạng xanh/vàng/đỏ %, ko chi tiết) · **#3 chiều dạng/chuyên đề** (dạng nào tỉ lệ sai cao / nhiều HS sai nhất).
  - **⭐ CÔNG THỨC MASTERY (Thùy chốt):** mỗi lần đánh giá **Đ=1·C(chưa đạt)=0.5·S=0** (cả câu lẫn dạng); tổng **5 lần gần nhất**: **≥4→Đ(đạt) · 2.5–3.5→C(cần luyện) · <2.5→S(yếu)** = mean **0.8/0.5** (V1 chỉ ví dụ CÁCH HIỂN THỊ, KHÔNG phải cách đo — V1 binary; **ngưỡng 0.8 KHÔNG phải 0.7**). chưa-đo=null (≠0); độ tin theo cỡ mẫu (n≥5 cao/3-4 tb/≤2 thấp).
  - **Engine `src/gami/mastery.js`** (PURE, 19 test `node scripts/verify_mastery.mjs`): `masteryOfDang`/`masteryOfHS`/`summarizeDang` + `RESULT_VALUE{correct:1,partial:.5,wrong:0}`.
  - **Service `src/lib/mastery.ts`** `getMasteryHS(hsId,mon,{includeBTVN,days})`: grades(ingame+et via `gami_grades.problem_id→gami_session_problems.phase/ma_dang`)+`buoi_danh_gia_dang`(đánh giá GV) → engine. **2 query rời join JS** (né filter lồng). **Toggle BTVN** (mặc định TẮT — Thùy tự soi BTVN có đáng tin). Lọc 30/60/90 ngày. Tên dạng theo MÔN (khoCuaMon.banDoTbl) → scope đúng môn. Sort yếu+mới lên đầu. ✓ tsc + **verified data thật** (HS "N.L.Bảo Ngọc": yếu "giải hệ đưa về cơ bản" 0.30 n=8 tin-cao · đạt toàn "toán lập hệ" → insight thật).
  - **ĐẶT Ở: CHỈ LEAF RIÊNG "Kết quả học tập"** (3 view qua tab), KHÔNG nhúng Học sinh. **Build #1 trước** (NEXT). Sequencing: engine✓→service✓→màn view#1→#2→#3→mặt HS/PH.
- **⭐ MẶT HS/PH — login HS ĐÃ CÓ (07-04, xem section TEST ONLINE):** `my_hoc_sinh_id()` + `tai_khoan.hoc_sinh_id` + 321 tài khoản HS đã provision → mặt HS/PH HẾT bị chặn nền tảng (dashboard HS/PH giờ chỉ là việc build màn).
- **⭐ SPEC TEST ONLINE (`spec-test-online.md`)** — Thùy đưa, ĐÃ lưu repo, **PAUSE** làm mastery trước. ET+BTVN trắc nghiệm, HS điền mobile→auto-chấm→ET vào mastery/BTVN tham khảo. Snapshot đề+key (ko liveref). Bước-0 verify mới xong 1 phần (login HS net-new xác nhận). Thứ tự build (spec §11): BTVN online → migration+RLS HS+`my_hoc_sinh_id()` → phát hành+chấm → dung_sai → ET online.

### Đã build (07-01/02 — MÀN KẾT QUẢ HỌC TẬP đầy đủ: 4 view + Tổng quan + fix khoá-UI)
- **Leaf "Kết quả học tập"** (`src/screens/ketqua/KetQuaScreen.tsx`, leaf `ketqua` nhóm Vận hành; service `src/lib/mastery.ts`). 4 top-tab, **GIỮ state khi đổi tab** (lazy-mount + `hidden`, KHÔNG unmount → không mất lựa chọn).
- **① Từng học sinh** — chọn HS (ô tìm / **cột lớp trái** click chuyển HS; tìm HS tự suy lớp `listLopCuaHS`) → **3 sub-tab**:
  - **Tổng quan** (`getTongQuanHS`): *tổng kết* = **% hoàn thành bản đồ** (dạng ĐẠT/ĐÃ-ĐO) · **Điểm năng lực** (PLACEHOLDER — chờ cấu trúc đề + nhãn cơ-bản/nâng-cao + Hình) · **Điểm thi** (Trường/Sát hạch từ `diem_thi`, wire sẵn, DB trống → "—"). *raw* = **%ET/%BTVN** = (Đ+½C)/số câu. **Trend ↑/↓** (30-ngày-gần vs trước, ẩn khi <2 kỳ).
  - **Dạng bài** = bảng mastery per-dạng (mức/điểm/độ-tin/timeline nguồn+ngày); cửa sổ **Tất-cả (mặc định)** /30/60/90 + toggle BTVN. (Mặc định Tất-cả để KHỚP % ở Tổng quan = all-time.)
  - **Lịch sử hoạt động** = thẻ hoạt động của HS (`ActivityHistory` scope hocSinhId).
- **② Theo buổi (raw)** — thẻ mỗi HOẠT ĐỘNG (ET/BTVN/Chấm bài/Đánh giá TÁCH riêng, chỉ phase đã ĐÓNG), toggle loại, xếp thời gian, click → popup `BuoiDetail` **read-only CHỈ tab đó** (`tabs=[t]`, portal `document.body` thoát `#root{zoom:1.15}`). Lọc theo LỚP (lọc HS đã chuyển vào view#1 › Lịch sử).
- **③ Lớp / Khối / Hệ** — mỗi HS 1 **thanh 100% "bộ nhớ iPhone"** (xanh đạt·vàng cần·đỏ yếu, `%(n)` trong màu, tổng "N dạng" cạnh); scope **lớp / khối / hệ(band S/A/B/C)**; sort theo **%** (không tuyệt đối).
- **④ Theo dạng / Chuyên đề** — pivot: mỗi dạng (hoặc gộp **chuyên đề**) 1 thanh phân bố HS đạt/cần/yếu; sort %.
- **Công thức (Thùy chốt):** Đ=1·C=0.5·S=0; mastery = TB **5 lần gần nhất** → **≥0.8 đạt / 0.5–0.8 cần luyện / <0.5 yếu**; % hoàn thành = ĐẠT/ĐÃ-ĐO. "chưa-đo" = việc GIÁO TRÌNH cover, KHÔNG phải lỗ hệ thống (bỏ khỏi UI).
- **Service (`mastery.ts`)**: `getMasteryHS` (**embed `problem_id`** — FK đơn sạch, bỏ IN-list tránh URL dài) · `getTongQuanHS` · **`loadMasteryCells`** (SHARED, type `RollupScope` scope lớp/khối/hệ, ~4 query bulk cho cả lớp) → `getMasteryRollup`/`getMasteryByDang`/`getMasteryByChuyenDe` · `listBuoiHoatDong`.
- **FIX khoá-UI khi đóng phase (luật Thùy 06-20 áp NỐT):** `BtvnTab` bỏ `if(dong)return` tắt bảng; BtvnTab+DanhGiaTab **GIỮ bảng read-only** khi đóng (disable nút), chỉ "↩ Mở lại" mới sửa. `BuoiDetail` thêm prop **`onlyHsId`** (lọc roster còn 1 HS — cho view#1 lọc theo HS).
- **CÒN cho Kết quả học tập:** **điểm năng lực** (cần bảng cấu trúc đề per-khối + nhãn cơ-bản/nâng-cao cho dạng + kho Hình — verify DB: `ky_thi`/`diem_thi`=0, `diem_ky_vong`=0/12, dạng chỉ có `muc_do`1-5+`bac_toi_thieu`A/B/C/S) · **mặt HS/PH** (login HS ĐÃ CÓ 07-04 — chỉ còn build màn) · trend hiện khi tích luỹ ≥2 kỳ.

### Đã build (07-02 — fix vụn: mã HS ở lớp · chống trùng câu giáo trình · "Câu N." cùng dòng · % hoàn thành weighted)
- **Mã HS trong thông tin lớp:** `RosterBox` (`LopScreen`) cột "Học sinh" hiện badge `ma_hs` (mono) cạnh tên. `listHSCuaLop` đã `select hoc_sinh(*)` → có sẵn.
- **⭐ CHỐNG TRÙNG CÂU khi làm giáo trình — SCOPE = BUỔI (Thùy ĐỔI 07-04, cả AUTO lẫn THỦ CÔNG):** cứng = **trong CÙNG 1 buổi không trùng câu**; **KHÁC buổi ĐƯỢC dùng lại** (trước 07-04 khoá toàn doc — đã bỏ). KHÁC "usage count" = số lượt dùng xuyên MỌI tài liệu Kho (chỉ báo mềm, giữ nguyên). **lib `tailieu.ts`:** `usedCausOfBuoi(taiLieuId, buoiId, exceptPhanId?)` (quét phan dang+btvn của buổi qua `groupBuoi`) · `setDangOfBuoi` auto-suggest né `usedInBuoi` (luyện → add → BTVN né cả luyện vừa thêm CÙNG buổi). **UI `TaiLieuBuilder`:** `usedExcept(phanId)` = union câu các phan khác CÙNG BUỔI chứa phanId (tìm qua `groupBuois`); KhoPicker câu blocked → khoá + nhãn đỏ "đã dùng"; badge "chưa dùng"/"dùng N×" cross-doc giữ. **ETScreen** không truyền disabled → chỉ ăn theo badge số-lượt.
- **⭐ "Câu N." LUÔN cùng dòng với đề (bản in):** cũ = `<span pv-cau-no>` đứng TRƯỚC `<MathText>`; MathText trả `<span>` inline khi đề 1 dòng nhưng `<div>` block khi đề NHIỀU dòng (text+công thức) → nhãn bị đẩy lên dòng riêng → không nhất quán. **Fix:** `MathText` (kho/ui.tsx) thêm prop `prefix?` (HTML) nhét vào ĐẦU dòng 1 (single: `head+line0`; multi: chèn `.mline` đầu). `CauItem` (PrintView) + ET (ETPrintView 2 chỗ) đổi span rời → `<MathText prefix='<span class="pv-cau-no">Câu N.</span> '>`. Màn UI (ChamETSheet/BuoiHoc/DangHub/DungSai) giữ nguyên (nhãn cột riêng, cố ý). prefix mặc định '' → mọi chỗ dùng MathText khác KHÔNG đổi.
- **⭐ "% hoàn thành bản đồ" (Tổng quan HS) = số CẢM NHẬN weighted + 3 số detail (Thùy chốt sau phản biện):** cũ `pct=ĐẠT/ĐÃ-ĐO` (cần+yếu=0) khắt khe. **Chốt:** số tổng ở tầng trên chỉ để **cảm nhận** "hoàn thành ~%"; để CẢ 2 = số weighted + 3 số detail. `getTongQuanHS.compPct` (mastery.ts): `pct=(đạt×1+cần×0.5+yếu×0)/ĐÃ-ĐO` **weighting theo BUCKET** (khớp 3 số detail, KHÔNG dùng mastery gốc) + trả `can_luyen`/`yeu`. UI `TongQuanTab`: số % to (indigo) + 3 chip đạt(xanh)/cần luyện(hổ phách)/yếu(đỏ) + "/N dạng đã đo". Trend theo pct weighted. (Thanh 3-màu chi tiết đã có ở tab "Dạng bài".)

### Đã build (07-03 — ⭐ LUỒNG NHẬP KHO ingest-first: bóc PDF → gán dạng → đẩy kho)
- **Bối cảnh:** thay luồng cũ "sắp xếp tay vào Word rồi nhập-chuỗi-câu". Đọc lại V1 `bkdemy-erp/src/pages/admin/QuestionsPage.jsx` (TabRaDe/TabDuyetDapAn) — V1 gần hoàn thiện: rã cả PDF + auto-tag dạng (confidence + vòng-học `label_rules`/`logCorrection`) + auto-group bài-nhiều-ý + review 35/65 per-loại. Đây = **KB3** (ADR Document Ingest). Port + nâng cấp (RAG lý thuyết khi giải — V1 giải chay).
- **⭐ Quyết định (Thùy):** **scope = CHỦ ĐỀ** (nhiều chuyên đề), KHÔNG ép chuẩn-hoá xuống chuyên đề (bất đối xứng: chuyên-đề-scope mua chút precision bằng công-tách-file vô hạn → không đáng; V1 tag scope-khối vẫn ổn) · **1 người full luồng 1 phiên → KHÔNG draft table, client-state** (draft để dành đề-thi sau) · **verify ≤2 vòng, người vòng cuối**: cao-conf 0 verify · thấp 1 verify (đọc lý thuyết dạng) → pass HOẶC đổi ma_dang_2, KHÔNG lặp lần 3 · **đúng/sai = model v2** (cả câu neo chuyên đề, mỗi mệnh đề 1 dạng — V1 hồi đó chưa có chuyên đề) · **tự luận ≈ trả lời ngắn** = 1 card, khác toggle "hình thức HS làm" · duyệt **1 câu/màn** (bỏ list) · **AI-redraw KHÔNG dùng cho hình toán** (bịa số/đồ thị → GIỮ ADR "hình = ảnh gốc cắt"; nét hơn = tăng DPI, faithful).
- **⭐ precision@1** (Thùy yêu cầu đo, [[kho-ingest-ai-accuracy-metric]]) = (final=ai)/(tổng AI đề xuất). Log per-câu `kho_tag_log` — 1 bảng phục vụ CẢ metric + nguồn vòng-học (cặp nhầm). Distiller `kho_tag_rule` = pha sau khi đủ volume (cold-start 0 correction = loop trơ). §1.5-ok (dòng chỉ khi có sự kiện thật).
- **File:** `src/screens/nhapkho/NhapKhoScreen.tsx` (leaf `nhapkho` nhóm Danh mục, cạnh Kho) · lib mục "LUỒNG NHẬP KHO" trong `src/lib/kho/api.ts`. Seam: UI KHÔNG gọi supabase trực tiếp.
- **api:** `khoTbls(mon)` dispatch Toán/KHTN · `listChuDeOptions`/`listDangByChuDe`/`getDangLyThuyet` · **`INGEST_KHO_SCHEMA` HỢP NHẤT 1 pass** (loai_cau + de_bai + dap_an + lua_chon + menh_de + co_hinh/box_hinh) + `buildKhoIngestPrompt`/`parseKhoIngestJson` (tự nhận loại) · `classifyDang` (grounded theo chủ đề, 1 call/lô → ma_dang+confidence+ma_dang_2; đúng/sai classify TỪNG mệnh đề) · `verifyDangByLyThuyet` (chỉ low-conf) · `aiGiaiCau` (RAG đọc `*_dang_ly_thuyet`) · `saveCauToDang` (mỗi câu 1 dạng) · `createCauDungSai` (đúng/sai) · `logKhoTag`/`khoTagPrecision`.
- **Màn:** setup (môn/khối/chủ đề/file/📐có-hình/🤖AI-giải) → **Bóc** (render trang 400 DPI → Gemini/trang → parse → crop hình `anh_de` PNG lossless → classify flat theo đề + đúng/sai theo mệnh đề → verify low-conf) → **duyệt 1 câu/màn**: thanh tiến độ + "nhảy câu ⚠ độ-tin-thấp" · **preview-first** (render công thức mặc định, nút ✎ Sửa nội dung mới ra code LaTeX) · card rẽ theo loại (FlatEditor/DungSaiEditor) · **DangPicker** chip AI-gợi-ý + hàng **"Gần đây" ≤5 dạng** + combobox tìm · nút AI-giải · **Duyệt** = save + logKhoTag → câu tiếp.
- **⭐ Hình (`pdfRender.ts`):** 400 DPI (từ 300) + MAX_SRC 4200 → crop vector NÉT/bằng gốc (không mờ), PNG lossless; token Gemini KHÔNG đổi (GEM_W cap ảnh gửi). **Bảng biến thiên/xét dấu = HÌNH** (crop `anh_de`), KHÔNG dựng `\begin{array}` (vỡ) — chỉ bảng số liệu thuần mới array.
- **mig 0061** (áp DB): `kho_tag_log` + cột `mo_ta_ngan` trên `dai_ban_do`/`khtn_ban_do` (grounded classify — CHƯA có UI sinh; classify hiện dùng ten_dang+chuyên đề, vẫn ổn ở scope chủ đề).
- **CÒN:** sinh `mo_ta_ngan` (nút ở editor lý thuyết) → grounded mạnh hơn · distiller `kho_tag_rule` khi đủ volume · verify gom-theo-dạng (giờ per-câu low-conf) · cấp quyền leaf `nhapkho` cho Học thuật/OPS (giờ chỉ laAdmin) · câu BBT đã lưu bằng luồng CŨ (array vỡ) = phải nhập lại. ⏳ **e2e với PDF thật CHƯA chạy** (key Gemini local `…Jv8aQ` bị Google SUSPEND — đổi key mới + restart dev; tsc+build pass).

### Đã build (07-03 phiên 2–7 — bản GV mọi loại câu · fix clone $ · đếm kho Postgres · Việc-của-tôi theo NGÀY · TẢI PDF)
- **⭐ BẢN GV in tài liệu hiện đáp án CHI TIẾT MỌI loại câu** (PrintView + ETPrintView): gom `GvAnswer` (export) dùng chung. **Đúng/Sai** (`menh_de`): `CauItem` render đề chung → 4 mệnh đề a·b·c·d (HS ghi Đ/S; GV hiện sẵn Đúng/Sai màu + gom lời giải từng mệnh đề) — TRƯỚC không render gì (mất cả HS). **Trắc nghiệm**: GV thêm dòng "Đáp án: chữ cái" (ngoài tô ✓). **ET trả-lời-ngắn**: GV thêm **lời giải** (trước chỉ đáp án). **ET tự-luận**: thêm ảnh đáp án. ET route câu `menh_de` sang nhánh CauItem.
- **⭐ Fix clone thiếu `$` đóng cuối** (`MathText`/`kho/ui.tsx`): `balanceDollars` trong `buildLines` — đếm `$` đơn không-escape (đếm thủ công `s[i-1]!=='\\'`, KHÔNG lookbehind vì Safari <16.4 crash), LẺ → thêm `$` cuối. Fix GỐC ở renderer → lợi mọi print/màn + data CŨ.
- **⭐ Fix KHO hiện "0/50" + 0% dù đã có câu (mig 0062):** `countCauByDang`/`Khtn` cũ fetch mọi câu group client → **PostgREST cap max-rows (~1000)** cắt → dạng mới (cuối heap) đếm 0. → RPC **`count_cau_by_dang(p_tbl)` trả jsonb 1 DÒNG** `{ma_dang:n}` (miễn nhiễm cap dòng), `stable security definer` + guard `la_thanh_vien()` + whitelist bảng. % tự đúng theo (cùng nguồn `counts`). (Đây là bug §234 CŨ — ĐÃ XONG.)
- **⭐ "Việc của tôi" gom theo NGÀY** (`NhanSuHome` `VietCuaToi`): thay lưới `auto-fill` ô-vuông-tràn-ngang bằng **mỗi ngày 1 hàng** — đầu hàng = thanh-màu-kẻ-dọc (design §259) `Thứ X · dd/mm` + badge "Hôm nay" + đếm việc; body = card việc của ngày đó. `dayGroups` gom `opsActive`+`taskActive` theo `ngay`, sort tăng dần, ngày rỗng tự ẩn. `tuan.ts` thêm `thuCuaNgay`/`ddmmVN`.
- **⭐ TẢI PDF (Kho tài liệu) — 2 cửa:** (a) nút "⬇ Tải PDF" trong preview (cạnh 🖨 In, cả HS/GV) · (b) nút "⬇ Tải PDF" THẲNG ở hàng bảng (`KhoTaiLieuScreen`, không mở preview). Cửa (b) = mount PrintView/ETPrintView `headless` (dựng ẩn on-screen sau lớp phủ đục → tự tải → tự đóng; chờ 350ms ổn định phòng render 2-pass BTVN). `downloadPagesPdf(dst, filename, chrome?)` (export): duyệt `.pagedjs_page` → html2canvas-pro (chịu oklch) scale 2 → jsPDF addImage A4 → `.save()`. Dep `jspdf`+`html2canvas-pro` **lazy chunk** (391/246KB, không phình bundle chính).
  - **⭐ Header/footer khi RASTERIZE = PHẦN TỬ THẬT (onclone):** html2canvas KHÔNG vẽ nổi background NHIỀU LỚP trên `::before/::after` (logo+chip+wave) → header trắng/chữ mờ/trang lỗi. Fix: `pageChrome()` (export, nguồn chung header/footer) + `downloadPagesPdf` onclone **tắt pseudo** (`content:none`) rồi **chèn `<img>` logo + `<img>` chip + 1 wave nền đơn + `<span>` text**. Chờ `document.fonts.ready` + preload logo (chống trang trắng chữ). `buildPagedCss` (bản IN vector) vẫn dùng pseudo — KHÔNG đổi.
  - ⚠ **PDF tải = RASTER** (ảnh mỗi trang, chữ không select) — đổi lại 1 bấm không hộp thoại; bản vector vẫn ở 🖨 In. **CHƯA verify mắt** (Thùy tải thử giáo trình/BTVN/ET xác nhận header+trang). Nếu wave vẫn lỗi → phương án B: thay dải sóng bằng thanh gradient PHẲNG + logo (html2canvas vẽ gradient phẳng chuẩn).

### Đã build (07-04 — fix dep · ảnh ET giãn · tên HS 2 từ cuối · Nhập kho dùng lại CauEditor + paste + full-width)
- **⚠ Dep thiếu sau `git pull`:** máy chưa `npm install` → Vite `Failed to resolve import "html2canvas-pro"` (dep tải-PDF 07-03). Fix = `npm install`. **Bài học: pull về có dep mới thì install; lỗi resolve import = node_modules lệch package.json, KHÔNG phải code.**
- **⭐ Ảnh ET gửi PH giãn theo số câu** (`EtAnhGuiPH`, BuoiHocScreen): trước `width:440` cố định → nhiều bài cắt cột phải. Nay `cardW = max(440, 100 + số_câu×30 + 32)` + BỎ `maxWidth:100%` (container overlay tự cuộn ngang, không co làm cắt). Tên HS trong ảnh rút 2 từ cuối.
- **⭐ Tên HS = 2 TỪ CUỐI ở màn VẬN HÀNH** — helper CHUNG `src/lib/hoten.ts` `tenNganHS()` ("Nguyễn Thị Hồng Anh"→"Hồng Anh"). Áp: BuoiHoc (điểm danh/chấm/ET/BTVN/đánh giá/ảnh PH) · KetQua (cột lớp + rollup) · Điểm số (BXH + theo ca) · Bổ trợ Bù/Đuổi · Thành tích (lưới) · Quản lý Level. **GIỮ đầy đủ:** quản lý HS · form · SearchSelect · ghép PH · tiêu đề hồ sơ điểm/thành tích (1 chỗ nổi) · dialog xác nhận/cảnh báo · PHIẾU IN. Quy tắc: **list/table/grid/chip = ngắn · profile-title/form/search/print = đầy đủ** (nhận diện). [[no-dropdown-dung-search-select]]
- **⭐ NHẬP KHO (nhapkho) sửa theo Thùy: "giống nhập chuỗi câu, đừng đẻ UI mới, paste clipboard, popup to gần full màn":**
  - **Tái dùng `CauEditor`** (export `CauEditor`+`ReviewItem` từ DangHub): câu PHẲNG render bằng chính CauEditor (đề/đáp án/lời giải/ảnh + ✎ Sửa, y hệt nhập chuỗi câu). XOÁ `FlatEditor` tự viết. Chỉ giữ **thanh gán dạng** `DangPicker` phía trên (bắt buộc vì scope=CHỦ ĐỀ, nhiều dạng). Đúng/Sai giữ `DungSaiEditor` (CauEditor không xử 4 mệnh đề). Map RItem↔ReviewItem (`flatRI`/`onFlat`; sửa lời giải → `nguonGiai='nguoi'`). Thêm lưu **ảnh giải** `anh_dap_an`. Bỏ field dead `hinhThuc`.
  - **Paste clipboard:** setup 📎 Chọn file (PDF) + 📋 Dán ảnh (Ctrl+V, `readClipboardImageFile`) + window paste listener.
  - **Full-width:** bỏ `max-w-6xl` bé → card `max-w-[1800px]` chiếm hết cao, CauEditor fill 2 cột căng ngang; thanh dạng+AI-giải 1 hàng trên, nav dính đáy.
  - tsc pass. ⏳ e2e bóc câu vẫn cần key Gemini (local suspend).
- **Quy ước UI (đừng đạp lại):** popup/màn làm-việc-liên-tục để **TO gần full ngang** (Thùy nhắc: "luồng làm việc liên tục cần màn to nhất có thể", đừng để card bé mx-auto max-w hẹp). Editor câu = **dùng lại `CauEditor` dùng chung**, đừng viết editor kho mới.

### Đã build (07-04 phiên 2 — ⭐ TEST ONLINE đầy đủ: login HS 321 acc · BTVN/GT reveal-ngay · ET chế độ THI · gợi ý lý thuyết)
- **Spec `spec-test-online.md` + Bước-0 verify (DEVLOG):** loai_cau THẬT = `trac_nghiem`/`tra_loi_ngan`/`tu_luan`/`dung_sai` (KHÔNG có `4_dap_an` như spec; text thuần không CHECK). `trac_nghiem.lua_chon` phần tử [0] MẤT nhãn "A." → render `stripLabel` + chấm map index→chữ cái. `tra_loi_ngan` BẨN ~43% (LaTeX/chữ — chỉ 57% số thuần) → auto-chấm exact phần số, còn lại wrong→report (vòng duyệt CHƯA build). RLS toàn hệ ENABLED member-gate (note spec §2.5 "disable" đã cũ).
- **⭐ LOGIN HỌC SINH (NET-NEW, mig 0063):** Thùy chốt "test = mã+PIN, lâu dài = tài khoản Supabase" → gộp: HS đăng nhập **mã HS + PIN** trên tab "Học sinh" (`Login.tsx` toggle Nhân sự/Học sinh), dưới nền = **Supabase Auth THẬT** email tổng hợp `<ma_hs>@hs.bkdemy.local`, pass=PIN. `tai_khoan.hoc_sinh_id` (song song nhan_su_id) + RPC **`my_hoc_sinh_id()`**/**`hs_o_lop(uuid)`** (mirror my_quyen, đọc jwt_uid). `App.tsx` gate: resolve HS trước → render `HocSinhApp` (KHÔNG load quyền staff). **ĐÃ provision 321/321 HS đang học** (`scripts/provision_hs_auth.mjs`, cần `SUPABASE_SERVICE_ROLE` trong .env.local — Thùy đã đưa; PIN mặc định = mã HS, đổi sau). HS mới → chạy lại script (idempotent). ⏳ màn HS đổi mật khẩu chưa có.
- **⭐ 3 TẦNG DATA (spec §3, mig 0063):** kho → `bai_test`(phát hành đông cứng; loai et/btvn/giao_trinh; `so_cau` denorm; unique doc×lớp×ngày×loại) + `bai_test_cau`(snapshot đề+key+`loi_giai`+`anh_dap_an`(0064)+`ma_dang`+`ly_thuyet`(0067)) → `bai_lam`(slot 1 HS/test)+`bai_lam_cau`(PHÉP ĐO, chỉ khi HS trả lời)+`bai_test_report`+`question_accepted_answers`(port V1, chưa wire). **RLS bảng mới khai TAY** (0026 blanket ko phủ): staff=`la_thanh_vien` toàn quyền · HS đọc test lớp mình (`hs_o_lop` live-derive) + CRUD bài làm của mình · **`lop_hs_read`** (0065, HS đọc tên lớp mình). FK `bai_lam_cau→bai_test_cau` **CASCADE** (0066 — trước RESTRICT làm xoá test có bài làm FAIL).
- **⭐ ENGINE CHẤM `src/gami/testgrade.js`** (PURE, 30 test `node scripts/verify_testgrade.mjs`): `smartNormalize`/`smartCheckTLN` (port V1; **tách CHỈ theo `;`** — `,` là thập phân VN, V1 split cả `,` là bug) · `gradeTracNghiem` (index HS chọn → chữ cái == dap_an) · `gradeDungSai` (**thang THPT 2025**: 0/0.1/0.25/0.5/1.0 theo số ý đúng; 4/4=correct·1-3=partial·0=wrong) · `gradeTraLoiNgan` (wrong→HS report) · `extractKey` (validate lúc snapshot, câu thiếu key/loại tu_luan → skip+warn).
- **⭐ Service `src/lib/testonline.ts`** (seam): **`phatHanhTest`** tổng quát — `DOC_MAP` dispatch: btvn→`getBTVNCaus` · et→`getETCaus` · giao_trinh_buoi→`getGiaoTrinhBuoiCaus` (**CHỈ bài luyện** phan 'dang', Thùy: "online chỉ giao BT, bỏ lý thuyết") · snapshot kèm lý thuyết dạng (`khoCuaMon(mon).ltDangTbl` — HS ko đọc kho nên phải snapshot). `moBaiLam` (upsert slot) · `traLoiCau` (chấm client exact cho reveal-ngay) · `nopBai` (claim atomic) · `baoSai`. Nút staff "📱 Phát hành online" ở `KhoTaiLieuScreen` (doc btvn/et/giao_trinh_buoi bám lớp+ngày; modal kết quả + câu bị bỏ qua).
- **⭐ APP HS `src/screens/hocsinh/HocSinhApp.tsx` (mobile-first):** bọc `zoom:1/1.15` huỷ zoom desktop → net 1.0 (Thùy: tối ưu đt). List: **toggle "Chưa làm / Hoàn thành"** (đếm; hoàn thành = da_nop, TỰ đánh dấu khi trả lời hết câu); nhãn loại + badge tím **THI** cho ET. **Luồng làm bài (Thùy chốt): 1 câu/màn → chọn → nút "Xác nhận" (chống ấn nhầm) → chấm → hiện đáp án + LỜI GIẢI chi tiết → "Câu tiếp"** → màn kết quả X/Y. 3 loại render: TN nút A-D · ĐS 4 mệnh đề mỗi ý 2 nút Đúng/Sai (reveal per-ý + lời giải mệnh đề + "X/4 ý đúng") · TLN ô nhập. **Nút "💡 Gợi ý"** (chỉ khi câu có `ly_thuyet`) bung lý thuyết dạng. Báo sai "🚩 Em nghĩ mình đúng" CHỈ tra_loi_ngan.
- **⭐ APP HS CẤP 2/3 — MÀN CHÍNH + DANH SÁCH theo KIT thiết kế (08/09, nhánh feat/app-hs đã merge main `083a64a`):**
  `HomeHS.tsx` (thuần vẽ; HocSinhApp tính `cards` rồi giao) · `DanhSachHS.tsx` (1 component cho Bài tập trên lớp/ET/BTVN; pill
  mới/đang làm/quá hạn/hoàn thành + dòng hạn do mình suy theo palette kit) · `AvatarHS.tsx` (ốp AvatarEditButton của TA; bucket
  `avatars` chung, ghi qua RPC `hs_doi_anh_dai_dien` vì `hoc_sinh` staff-only). **2 theme nam/nữ = CÙNG component**, chọn theo
  `hoc_sinh.gioi_tinh` qua RPC `hs_ho_so_cua_toi()` (jsonb ho_ten/ma_hs/gioi_tinh/anh_url; mig `202609080131` + `202609080215`);
  **NULL → bộ nam**. ⚠ 08/09: 235/323 HS đang học gioi_tinh NULL ⇒ em nữ vẫn ra bộ nam — CEO tự cập nhật DB; app KHÔNG realtime,
  HS tải lại trang mới thấy. Font: UI Baloo 2, chữ tay **Pacifico** (ghi đè `--font-hand` trong cây HS; TA vẫn Itim) — `hs.html`
  link 3 font. Asset build ở `public/bk-ui/hs/` (resize bằng PowerShell System.Drawing — máy không có sharp/Python); kit gốc ở
  `design/handoff/hs-home-v4` + `hs-bai-tap-tren-lop-v1`. **Home KHÔNG cuộn (h-100dvh) nhưng KHÔNG kéo giãn** — hero/ô giữ
  aspect-ratio mockup (870:280 · 417:280), chữ clamp(vw), dư để trống dưới; tên hero = 2 từ cuối. Demo không cần login (chỉ dev):
  `hs.html?demo` · `?demo=nu` · `&ca` · `?demo=list&nu`. Màn con (làm bài, tự luyện, thông tin, hòm thư) VẪN style trắng cũ — là
  màn tiếp theo cho ChatGPT. Launch: `dev-hs` (worktree) / `dev-hs-wt` (chạy worktree từ repo gốc, port 5190).
- **⭐ PIPELINE THIẾT KẾ UI ChatGPT (vẽ) → Claude (dựng) — chốt 1.1 (08/09), dùng cho MỌI màn/app:** 2 file, 2 người đọc:
  `design/CHATGPT-UI-KIT.md` = gửi ChatGPT đầu mỗi context (đơn đặt hàng; 4 pha; **logic 7 loại phần tử** TEXT/SHAPE=code ·
  GLYPH=SVG gõ tay · ILLUST/CHAR/DECOR=PNG cutout sinh bằng công cụ tạo ảnh · BACKDROP=không khí thuần; **bảng kiểm kê** mỗi phần
  tử 1 dòng = hợp đồng; 8 câu tự kiểm) · `design/HANDOFF-PIPELINE.md` = Thùy+Claude (8 luật + lý do, bước nhận hàng, §8 lịch sử
  v1→v4.1 + 2 màn). Nhận hàng: `node scripts/design-check.mjs design/handoff/<kit>` (alpha thật · rỗng · THỦNG (xoá nền bằng xoá
  trắng) · backdrop có chữ (cạnh sắc) · biến thể trùng · SVG không <image>/<text> · DESIGN.md↔assets 2 chiều) **+ mở ảnh nhìn**.
  Luật đứng CEO: sau MỖI vòng phải ghi vấn đề vào §8 + sửa CHATGPT-UI-KIT + thêm phép đo script. **Không đưa script cho ChatGPT.**
- **Icon riêng từng app (08/09):** `public/icon-{hs,ta,ops}-192/512.png` + manifest/apple-touch từng app (gv/pt vẫn icon-192/512
  chung); APK `android/` (HS) + `android-ta/` mipmap 5 mật độ + `ic_launcher_background`. Ảnh gốc + master 1024 ở
  `design/bk-ui-src/icon_*`. Khuôn xử lý: ảnh vẽ sẵn ô bo góc (lề trắng hay góc đen) → cắt bbox, clip bo 19%, 4 góc đổ MÀU MÉP.
  Icon mới chỉ lên máy khi build lại APK / xoá-thêm lại PWA.
- **⭐ ET = CHẾ ĐỘ THI (Thùy chốt; mig 0068+0069):** HS **KHÔNG đọc được `bai_test_cau` của ET** (RLS loại et) → đề qua **RPC `et_de`** (lọc sạch key/lời giải, menh_de chỉ noi_dung) · làm bài = `luuDapAnET` (lưu, KHÔNG chấm) · **"Nộp bài" (confirm) → RPC `et_nop` CHẤM SERVER-SIDE** (TN/ĐS/TLN trong plpgsql) + đông cứng `da_nop` + trả reveal cả bài. **0069: chỉ chấm lần nộp ĐẦU** (row_count claim) — sửa đáp án qua API rồi nộp lại vô hiệu. UI `LamET` riêng (tím, đếm đã-trả-lời, mở lại bài đã nộp = reveal). BTVN/giáo trình = `LamBai` reveal-ngay.
- **✅ VERIFY THẬT (scripts `_diag_rls_hs`/`_diag_dungsai`/`_diag_et`, anon client + auth HS):** RLS cách ly lớp đúng (HS 8B1 thấy test 8B1, HS 8S1 thấy 0) · HS GHI bài làm qua RLS OK · ĐS 3/4 → partial 0.5 · `et_de` giấu key sạch + đọc thẳng bị chặn · `et_nop` chấm đúng cả 3 loại. **Demo:** `scripts/seed_demo_test_online.mjs` → 2 doc 11B1 "DEMO Test online" (BTVN) + "DEMO ET (thi)" (2TN+1ĐS+1TLN, 3/4 câu có gợi ý LT) — staff phát hành → login HS0004/HS0004 (`--xoa` dọn).
- **CÒN (test online):** task "Duyệt báo sai" trong `getMyTasks` (spec §9 — thay task Chấm ET khi ET online) · nút "Chấm lại câu N/lớp" khi KEY sai cả lớp (spec §7, khác luồng accepted-answer) · view "Theo buổi" (KetQua ②) chưa hiện bài test online · màn HS đổi mật khẩu · deadline/`khoa_reveal` chưa dùng · skin game HS-facing (đang plain-clean).

### Đã build (07-04 phiên 3 → 07-05 — mastery đọc ET-online · duyệt chấm trả-lời-ngắn · nav theo team · fix HS-nghỉ · chống liếc-bài · ⭐ ĐỀ THI)
- **⭐ MASTERY ĐỌC ET-ONLINE:** `mastery.ts` thêm nguồn đo thứ 3 `fetchOnlineEvals` = `bai_lam_cau` (verdict≠null, embed 2-tầng FK đơn). **ET/đề-thi (`THI_LOAI`) → src 'et'** (thi giám sát, VÀO mastery, đòi `da_nop`) · **BTVN/giáo-trình online → src 'btvn'** (tham khảo, chỉ vào khi bật toggle). Nối cả 3 view (Từng-HS/Tổng-quan/rollup Lớp-Khối-Hệ). Suy động → duyệt lại verdict tự đúng theo, không sync.
- **⭐ LUỒNG REVIEW TRẢ LỜI NGẮN (cache + backfill, đúng logic V1 Thùy mô tả):** hệ chấm sai (so đáp án gốc) → TA duyệt thấy đúng → đáp án vào `question_accepted_answers` (cache) → **BACKFILL mọi bài làm khác cùng câu+cùng đáp-án-chuẩn-hoá đang sai → sửa thành đúng** (không chỉ bài đang xem). mig 0070: `tln_norm` (chuẩn hoá SQL) + rpc `tln_cache_check` (HS gọi được nhưng KHÔNG SELECT thẳng bảng cache — chỉ hit khi biết sẵn đáp án, không lộ) + `et_nop` v4 (thêm tầng cache sau exact). Màn **`duyetcham`** (nhóm Quản lý chất lượng): nhóm CÂU→ĐÁP ÁN distinct, nút "✓ Chấp nhận đúng" (báo số bài đã sửa) / "✕ Vẫn sai".
- **⭐ NAV TẦNG 1 = THEO TEAM (Thùy chốt, thay 6 nhóm cũ Danh mục/Quan hệ/Dashboard/Vận hành/Bổ trợ/Hệ thống):** **Vận hành** (buổi học·HS·lớp·tuyển sinh·bù·đuổi) · **Gamification** (Elo·thành tích·level) · **Học thuật** (kho·nhập kho·làm tài liệu) · **Quản lý chất lượng** (kết quả học tập·duyệt chấm online) · **Core team** (nhân sự·sơ đồ·phân công·TKB·phân quyền·báo lỗi·tuyển dụng·giao việc) · **Dashboard** (CEO-only). Ý định: role sau này cũng chia theo 6 team này (hiện CHỈ đổi IA hiển thị — quyền thật vẫn per-leaf ở Phân quyền).
- **🐞 FIX BUG: HS chuyển `trang_thai='nghi'` không tự rời lớp** (mig 0071, trigger `hs_nghi_tu_roi_lop`): tự đóng mọi `hoc_sinh_lop.trang_thai='dang_hoc'` của HS đó (→`da_roi`+`ngay_roi`), chảy qua trigger log sẵn có (0028). CHỈ áp `nghi` (nghỉ hẳn), KHÔNG áp `bao_luu`. Backfill data cũ mâu thuẫn trong cùng migration.
- **⭐ XÁO CÂU + ĐÁP ÁN test online (chống liếc bài):** `src/lib/shuffle.ts` (`seededPerm`/`seededShuffleWithOrig`, thuần, seed = `hocSinhId:baiTestId[:cauId][:opt|:ds]` — ổn định per-HS, khác nhau giữa các HS). Áp cho `LamBai`+`LamET`: thứ tự CÂU + thứ tự ĐÁP ÁN (TN 4 phương án/ĐS 4 mệnh đề) xáo — nhãn A/B/C/D theo vị trí HIỂN THỊ, nhưng **state/chấm luôn dùng chỉ số GỐC** → engine chấm (testgrade.js/et_nop SQL) KHÔNG đổi gì. `chiSoCuaChu` (testonline.ts) = chiều ngược `chuCaiChon`.
- **⭐⭐ ĐỀ THI (trường/sở) — mô hình dữ liệu (còn đúng):** đề thật → câu đổ vào kho + giữ TỔ HỢP (thứ tự + phần gốc). **Không bảng mới:**
  `tai_lieu(loai='de_thi')`; mỗi PHẦN gốc = 1 `tai_lieu_phan(loai_phan='custom')`; `tai_lieu_cau.thu_tu` giữ thứ tự gốc; metadata (nguồn / năm / thời gian /
  thang điểm / PDF gốc / sha256 / ghi chú lúc nhập) ở `cau_hinh.deThi`; câu khác nhánh mặc định ghi ở `cau_hinh.nhanhByCau`. In: `DeThiPrintView.tsx`.
  - **Luồng nhập · sửa · duyệt · giao đã THAY HẲN ngày 01/10** — xem mục **"LUỒNG KHO + ĐỀ THI"** ở đầu phần ①. Spec sống = `spec-de-thi.md`
    (`BKDEMY_DETHI_SPEC.md` chỉ còn giá trị lịch sử). Vị trí trong ERP: **Nhập kho (từ tài liệu) › 📝 Đề thi**; Kho tài liệu chỉ để in.
- **CÒN (đề thi, có chủ đích):** nối `ky_thi` (band / điểm sát hạch) · tự luận online chấm-bước (nộp ảnh) · đa cơ sở.

### Đã build (07-22→25 — ⭐ DASHBOARD HỌC TẬP: rule engine phát hiện → AI đề xuất → người duyệt)
Module `spec-danhgia-hoctap.md`. KHÁC "Kết quả học tập" (tra cứu): bên này PHÁT HIỆN→ĐỀ XUẤT→DUYỆT.
Leaf `db_hoctap`, nhóm "Quản lý chất lượng". Files: `src/gami/danhgia.js` (engine PURE, test
`scripts/verify_danhgia.mjs` 72 test) · `src/lib/danhgia.ts` (data-layer) · `src/screens/danhgia/
DashboardHocTapScreen.tsx` · `worker/danhgia.mjs`+`worker/danhgia_prompt.mjs` (gọi Claude, key server).
- **Mastery suy động = TB có trọng số 5 lần đo gần nhất.** Trọng số (spec §9): MT=3·ET=2·BTVN=1·
  bổ trợ/ingame/dg=0. `DANHGIA_CONFIG.WEIGHT` override `bt:0,ingame:0,dg:0` (KHÁC MASTERY_CONFIG — đừng
  "dọn gọn"). 2 lớp đo: **dạng** (cap 5 → MỨC) vs **chuyên đề** (mọi câu, không cap → TREND).
- **⭐ CỬA SỔ = NỬA THÁNG LỊCH A/B** (`cuaSoCua`: ngày≤15='A', >15='B'), key `YYYY-MM-A|B`, giờ VN.
  Thùy phân vân fortnight-neo-29/6 (29/6/2026 ĐÚNG thứ Hai) nhưng **CHỐT GIỮ A/B** vì **MT (weight 3,
  cao nhất) neo theo THÁNG** → cửa sổ phải khớp tháng. Bất đối xứng 15/16 ngày vô hại (điểm chuyên đề
  là TB không TỔNG; % so lớp theo TỪNG BÀI). Đổi CHỮ "14 ngày"→"nửa tháng", KHÔNG đụng lõi. ⚠ Đổi lại
  = đổi atom thời gian (mọi key/delta/digest/trễ) — rất nặng.
- **Trễ (hysteresis) mốc 0.5:** NHÃN mức dùng 0.5=cần luyện (khớp Kết quả học tập). TƯ CÁCH diện bổ trợ
  dùng 2 mốc lệch: vào khi <0.5 (+đủ tin n≥3) · ra khi >0.5 · =0.5 giữ trạng thái. Cần `daMo` (dạng
  đang trong `bo_tro_yeu_dang` chưa dong_at). KHÔNG mâu thuẫn (Thùy sửa Claude hiểu sai lúc đầu).
- **4 kênh phát hiện KHÔNG cộng dồn** (mỗi kênh bắt thứ khác): ① trend · ② thái độ (thang tuyệt đối,
  mọi buổi dưới "nghiêm túc"=tín hiệu) · ③ chuông đỏ (TA bấm) · ④ lỗ tiền quyết (GV báo). ③④ = phán
  đoán NGƯỜI, bê nguyên không xét lại. Trả `kenh[]`+`uuTien` (chỉ để XẾP THỨ TỰ đọc, KHÔNG "mức nặng").
- **Human-in-loop = NHÀ MÁY NHÃN:** máy chỉ ĐỀ XUẤT, người duyệt mới đổi state. `duyetLevel` ghi
  `hs_level_log` CẢ 2 VẾ (level_may_de_xuat + level_chot) ⇒ delta lộ tự động = nhiên liệu "AI đẻ luật".
- **⭐ AI = TẦNG CHÍNH SÁCH, KHÔNG tầng ca (Thùy chốt sau khi đo):** so rule (miễn phí, gửi kèm) vs
  Claude job 9C1 = **khớp 13/14 quyết định**; chỗ Claude "tinh tế" (BTVN che, tự chặn thiếu đo, dai
  dẳng) đều là rule tính sẵn. ⇒ Claude ĐỌC LẠI bảng rule, không phát hiện thêm. Lộ trình: G0 kho (AI
  sinh 81% kho, đang chạy) · G1 nhà máy nhãn (pha 4, KHÔNG AI) · G2 AI đọc log duyệt→đẻ LUẬT→người
  duyệt luật · G3 model dự báo. Ràng buộc G3 = THỜI GIAN LỊCH (38 ngày data ⇒ chỉ 30 ca "ổn→tụt").
  **Moat KHÔNG ở khâu phát hiện (rule đủ) mà ở VÒNG ĐÓNG:** cặp (can thiệp→retest→kết quả) đối thủ
  mua Claude cũng không có. `gami_grades`: 25k ô, 5.6k sai, **0,6% có mã lỗi** (Thùy: gắn mã lỗi=
  "9 lên 10", không đáng; chỉ cần đúng dạng/đúng lúc/thực hiện được = 90%).
- **UI (07-25 redesign):** card chính RÚT còn tên + thanh ưu tiên (bỏ "ưu tiên N" vô nghĩa) + hint đổi
  level + badge "máy đề xuất đổi"; ③④ giữ nổi; duyệt DỜI vào popup ("tên là đủ, t click vào đọc").
  **Popup 4 VÙNG:** ①vì sao (level·thái độ·điểm chuyên đề Δ theo MÃ·đếm dạng đổi mức) ②so TB lớp 8 bài
  giám sát (điểm HS·TB lớp·xếp HẠNG; bỏ "% hơn/kém" vì nổ to khi lớp yếu) ③chi tiết dạng trước→hiện
  tại→delta nhóm theo chuyên đề + khối riêng "trong diện chưa đổi" (dạng yếu ỔN ĐỊNH dễ bị bỏ sót) ④duyệt.
  Data-layer thêm `StatSheetHS.soLop` (so bài, ≤8, BTVN loại) + `DangStat.scoreTruoc/mucTruoc` (mastery
  tới cuối cửa sổ trước; null=mới). `goiGon` whitelist ⇒ payload AI + tiền KHÔNG đổi. ✓ tsc + verify app 11A1.
- **Migrations (hand-apply Supabase SQL Editor, KHÔNG `npm run migrate`):** `hs_level`·`hs_level_log`·
  `bo_tro_yeu`·`bo_tro_yeu_dang`·`danhgia_ai_job`(+model_chon) ĐÃ áp. `202607241948_bo_tro_yeu_them_nhan`
  (thêm cột nhãn) **VIẾT, CHƯA áp** — xem pha 4.
- **Worker chi phí (Thùy: "logic đốt tiền như này thì chết"):** hằng rào `worker/danhgia.mjs`, verify
  khô `scripts/verify_danhgia_chiphi.mjs`. Đo thật: 1,4 ký tự/token (tiếng Việt gấp đôi giả định) ·
  1900 tok/em · trần tiền 25k/lượt · trần token theo cỡ lớp · KHÔNG thử lại lỗi tất định · Haiku loại
  khỏi adaptive thinking. Model picker Sonnet 5 / Opus 4.8 (Thùy tự so). Mặc định gửi CHỈ em có tín hiệu.

### Đã build (26/09 — ⭐ HỆ SỰ KIỆN: Trung thu 26/09 + các sự kiện sau) — ĐỌC `spec-su-kien.md` §9–§10 trước khi sửa
- **App riêng "BK Sự kiện"** (`sukien.html`/`AppSuKien.tsx`, Vercel `bkdemy-erp-v2-sukien`) + lá `su_kien` trong ERP (cùng `src/screens/sukien/*`).
  Dữ liệu vận hành, KHÔNG nhãn môn; xu sự kiện = sổ riêng `sk_xu`, KHÔNG đụng ví BK. Đổi quà KHÔNG thuộc hệ này (Thùy bỏ Quầy quà).
- **DB `sk_*`** (8 bảng + `sk_phan_cong`), ghi CHỈ qua `fn_sk_*` security definer; luật chặn bằng unique partial (quay 1 lần · không
  cộng đúp game · 1 chỗ chờ/HS · 1 lượt/phòng). **Giao việc theo vai** mỗi sự kiện (`checkin · dangky · quay · quantro · quanly`), DB
  chặn theo vai qua `_sk_can`; admin hệ thống = quanly mọi sự kiện. Mỗi vai = 1 tab.
- **Luồng:** laptop 1 Check-in (HS BK) + Đăng ký game (HS BK + khách cấp số) → laptop 2 Bàn quay (danh sách chờ quay + nút QUAY, random ở
  Postgres) → điện thoại Quản trò (có mặt/bỏ qua 2 lần = loại, bắt đầu gán slot iPad, kết thúc cộng xu) · TV vòng quay / TV hàng chờ qua hash.
- **Nối iPad (đã chạy thật tối 26/09, sự kiện đã XONG):** điện thoại quản trò join kênh game `bk-<game>:<ma_hub>`; BẮT ĐẦU lượt ⇒ gửi
  `sk_open` bảo hub TV tự mở đúng game + `sk_names {names, luot, van, soVan}` ⇒ TV giữ tên, đếm ván, gắn `skLuot` vào state, đủ 3 ván chặn
  BẮT ĐẦU. **Xu trả TỪNG VÁN** (`fn_sk_tra_xu_van`, cột `sk_xu.van` = matchId, unique theo ván; đủ `so_van` DB tự kết thúc lượt) · màn
  **Tổng kết lượt** (Ván 1/2/3 + Tổng, `_sk_xu_luot.van`) giữ tới khi bấm "Lượt tiếp" · cảnh báo "không thấy TV" bằng presence.
  Vòng quay check-in 70/20/10% (cấu hình DB), vòng chia ô ĐỀU — không lộ tỉ lệ.
- Mig sự kiện áp bằng SQL Editor, **sổ `_migrations` không ghi** (vẫn hiện "treo" ở `--status` — ĐỪNG `npm run migrate` trơn). Đã áp tới
  `202609261450`; `202609261541` (tổng kết theo ván) — Thùy chưa xác nhận đã chạy.
- **Số liệu tối 26/09 18:30–21:30 (DB):** chi 3.277 xu = vòng quay 2.115 (124 lượt) + 4 game iPad 1.162 (Xếp Tháp 376 · Tìm Điểm 334 ·
  Đập Chuột 262 · Mê Cung 190). Thu vào: 0 trong hệ (game đăng ký miễn phí). Trò TV (Đoán Số/Chiếm Đất/Mở Rương) lưu localStorage từng laptop.

### Game `games-site/` — trạng thái sau Trung thu (26–27/09) — bản SỰ KIỆN (luật: `luat-choi-game.md`, tờ dán `luat-choi.html`)
- 5 game iPad: tự lưu tên (`localStorage bk-games-pname`, dùng chung), TV "Trận mới" giữ tên · chống văng (TVID/FOLLOW) · chặn nảy/cuộn/zoom
  iPad (nền `html` tối, `touch-action:manipulation`, touchmove guard) · Đập Chuột nhận chạm cả lưới + ân hạn 220ms.
- **Chiếm Đất / Mở Rương:** thua đậm 20–50% hoặc thắng đậm 150–300% (không hoà), Chuẩn 50/50, tỉ lệ chi ~110%, hiện "tối đa" trên màn.
  Chiếm Đất: độc đắc 50 xu, ~50% bản đồ có, bỏ gõ tên. Mở Rương: hình quà theo giá trị, số hiện sau hình; **chia 3 quà ngẫu nhiên nhiều kịch bản (29/09)** — nổ 1 món ở vị trí bất kỳ 45% ·
  hai món to 25% · chia đều 30% (`chiaKichBan`); giả lập 20k rương: món to nhất ở quà 1/2/3 = 36/33/31%, đoán lãi/lỗ sau 2 món chỉ trúng 67%.
  Luật cũ "quà 1–2 luôn nhỏ" ĐÃ BỎ. Áp cả bản sự kiện lẫn bản lớp (lớp chia bội 10). Tổng vẫn rút như cũ.
- **Đoán Số:** vé 10 xu = 3 lượt, thưởng 100/35/20 xu (~108%), chỉ hiện xu thưởng; hàng chục dừng trước, hàng đơn vị bò chậm 7 số cuối.

### Đã build (27–28/09 — ⭐ GAME TRONG BUỔI HỌC: xếp hạng buổi + game bản lớp) — ĐỌC `spec-game-buoi-hoc.md` §5b–§6
- **Mỗi game 2 bản luật, 1 bộ code** (không copy file): mặc định = sự kiện; `?che_do=lop&buoi=<id>` = buổi học. Luật bản lớp do **Thùy viết**
  (CTO chỉ hỏi output + nối ERP). Có luật: **Mở Rương** · **Chiếm Đất** (3 loại ô = 3 giải, EXP như Mở Rương, chọn ô bất kì) · **Bắn Quà**
  (`ca_lop`: cả lớp 1 ván cá nhân/đội, khung `BanQuaLop.tsx`, mig `202609281425`). Đoán Số: CHỜ LUẬT. Quà đặc biệt 🧋 trà sữa rút ở DB
  (`game_lop_qua_dac_biet`, tỉ lệ **Nhất 1% · Nhì 0,5% · Giải 3 0,1%**, hiệu ứng nổ `lib/bk-tra-sua.js`), ERP có nút "Đã trao".
- **ERP KHÔNG hiện kết quả trước khi TV diễn xong (29/09):** payload `'mo'` mang `hid`; TV gửi lại `{game,loai:'xong',hid}` (Mở Rương: sau
  quà 3 · Chiếm Đất: khi đóng thẻ kết quả); `XepHangBuoi` giữ "🎁 đang mở…" (list + TrinhChieu) tới lúc đó, phòng hờ 25s nếu TV rớt; 🧋 báo
  cũng hoãn theo. TV bỏ qua payload có `loai`. Đo trên trình duyệt: không có gì lọt sau quà 1–2. **Game mới nối ERP phải gửi `xong` y hệt.**
- **Cast chung + Bắn Quà:** sau mỗi nút ERP (`BanQuaLop.traFocusGame`) trả focus về iframe game — trước đó Space nạp lực = bấm lại nút.
- **🎯 Bắn Quà** (game pháo 2D kiểu Worms/GunBound — ĐỌC `spec-game-ban-qua.md` §1–§7 trước khi sửa): `games-site/ban-qua.html` (canvas 2D, sprite
  render từ KayKit Holiday ở `games-site/assets/ban-qua/`). **Cá nhân:** 1 phát/bạn, map **reset mỗi lượt**, tường đá không phá trước súng, hộp
  không máu (trúng là vỡ; gần 20 · vừa 40 · xa 70 · hộp trời 150 trôi ngang, chỉ vỡ khi chạm trực tiếp), trúng nơ "Chính xác 100%" +20% (1 lần/phát,
  chỉ vụ nổ đầu). **Đội:** 2–4 xe máu 150, ụ đá giữa các xe, bắn trúng mình không mất máu, GV đặt giờ, xếp theo sát thương gây ra → đội nhất
  Vàng / còn lại Bạc (1 lần/đội). **10 loại đạn** (5 thường + Cừu nổ bấm Space · Chuối bom · Sao băng · Lửa lan · Sét) **cân đều 35–39 điểm/phát**
  bằng giả lập chạy CHÍNH bộ máy của game (`?gia_lap=1` → `giaLap()` / `canBang()`; đổi luật đạn ⇒ chạy lại rồi chép `he`). **Nối ERP**
  (mig `202609281425_ban_qua_lop`): DB quay đạn theo giải + chia đội (🎲 ngẫu nhiên / GV tự xếp) + chốt (hạng, EXP Nhất 300→cuối 100, rương,
  trà sữa, sổ EXP 1 transaction); TV chỉ gửi ĐIỂM THÔ về, GV xem rồi Chốt. Đã verify trọn chuỗi trên buổi thật (ghi DB trong ROLLBACK);
  **màn ERP `BanQuaLop` CHƯA bấm thật trên lớp** (đã bấm thử focus Cast). Thùy chốt 28/09: đội KHÔNG hộp quà · máu xe 150 · hoà đầu cùng Vàng — luật đã đủ, chỉ còn test lớp thật.
- **2 CHẾ ĐỘ HIỂN THỊ** (Thùy 28/09, sau chốt Nhất/Nhì): **📺 Chế độ 1 · TV riêng** — GV làm việc trên ERP, TV riêng mở trang game = game +
  **bảng lớp** (ERP gửi event `ds` qua kênh khi đổi + khi TV nối; `games-site/lib/bk-lop-bang.js`; số của bạn đang mở giấu tới khi diễn xong) ·
  **🖥 Chế độ 2 · Cast chung** — overlay toàn màn trong ERP = iframe game `&nhung=1` + danh sách cả lớp theo giải, bấm "Mở" trên tên.
  Trang game thật **`https://game.bkacademy.edu.vn`** (Vercel `bkdemy-erp-v2-2ogm`), không chặn iframe.
- **Xếp hạng buổi** (khung 🏆 đầu tab "Chấm bài trên lớp", chỉ buổi thường, `src/screens/gami/XepHangBuoi.tsx`): gợi ý từ điểm `ingame`
  của CHÍNH buổi (không ET), bằng điểm = cùng hạng; GV chọn 1 Nhất + Nhì (có mặt >10 ⇒ tối đa 2 Nhì), còn lại Giải 3 (suy động) → Chốt
  (khoá, `buoi_hoc.giai_chot_at`, trigger log `buoi_giai_log`) · Mở lại chỉ khi chưa ai chơi · không đụng Elo.
- **Lượt game:** 1 lượt/HS/buổi mang mức giải; `fn_buoi_game_choi` RÚT ở DB theo `game_lop_thuong` + ghi `buoi_game_luot` + `gami_exp_ledger`
  source **`exp_tren_lop`** (note = tháng buổi, mon = lop.mon) trong 1 transaction; ERP gửi kết quả xuống TV (kênh `bk-lop:<buổi>`, presence
  role=tv); TV chỉ diễn. Mở Rương lớp: Nhất 200–400 (TB300) · Nhì 200–300 (TB250) · Giải 3 100–200 (TB175), bước 20 ⇒ lớp 8 bạn TB 200 EXP/HS.
- **Test thật:** Thùy chạy lớp 7S2 (28/09) → dữ liệu test ĐÃ XOÁ (Thùy gật; 2 dòng EXP 440 + 2 lượt + Nhất/Nhì + 2 log, buổi về chưa chốt).
- **CHỜ THÙY:** (✓ 28/09 đo DB: `fn_gami_exp_xu_thang` ĐÃ có `exp_tren_lop` — file `202609272045_exp_tren_lop_vao_chot_xu_thang.sql` đã chạy) ·
  **deploy ERP chính** (có sửa link game 404 + 2 chế độ) + **trang game** (`bkdemy-erp-v2-2ogm`) · test lại 7S2 cả 2 chế độ ·
  quyết app GV/TA có cần khung game không (hiện CHỈ ERP chính `BuoiHocScreen`; app GV `ChamBuoiGv.tsx`, TA `ChamBuoi.tsx` chưa có).
- Việc tách riêng, CHƯA làm: đích mới EXP ET 100 cố định / BTVN 200/bài (DB hiện ET 200–300, BTVN 189–300).

### Đã build (24–27/09 — ⭐ FORMAT NỘI DUNG LÝ THUYẾT + khung "Bài tập tự luyện" trong PDF) — ĐỌC `spec-format-noidung.md`
- **Kí hiệu khối đầu đoạn** (đoạn = tách bởi dòng trống): `##ĐN` Định nghĩa (vàng, vạch trái) · `##ĐL` Định lý (tím, khung) · `##TC`
  "Kiến thức cần nhớ" (xanh dương, cả tính chất/hệ quả/công thức) · `##CY` Chú ý (cam, nét đứt) · `##PP` Phương pháp (mỗi dòng = 1 bước,
  vòng tròn tự đánh số, tự bỏ "Bước N:"/"- " đầu dòng) · `##VD` (hồng; tag LUÔN "Ví dụ N" tự đánh số, chỉ ĐỀ trong khung, lời giải ngoài) ·
  `##NX` Nhận xét (xanh ngọc) · `##BT` bài tập trong lý thuyết. Nhãn có sẵn viết cùng dòng kí hiệu ("##VD Ví dụ 1", "##CY Lưu ý").
  Mọi "Giải"/"Lời giải"/"Bài giải" hiện "**Bài giải:**" căn giữa gạch chân (kể cả dòng đứng riêng trong lý thuyết cũ chưa gắn kí hiệu).
- **Code:** parser `src/lib/lythuyetBlocks.ts` (dùng chung mọi môn) · render + CSS `LT_CORE_CSS`/`LyThuyetBlockView` ở `src/screens/kho/ui.tsx`
  · **3 chỗ render phải đi cùng nhau:** preview `LyThuyetModal` (BanDo.tsx) · PDF `LyThuyetBody` trong `PrintView.tsx` (DangBlock + LtBlock) ·
  `HinhPrintView.tsx` (MucsBlock, cả MTPrintView). Prompt Gemini (`buildLyThuyetPrompt`/`buildTheoryIngestPrompt`, `src/lib/kho/api.ts`) tự gắn
  kí hiệu + chuẩn hoá "Giải"→"Bài giải" khi bóc ảnh. Bỏ nền xanh bọc ngoài + nhãn "Lý thuyết · Ví dụ" (CEO: "nền nếu có chỉ trong ô khoanh").
- **Dữ liệu:** mig `202609261247_chuan_hoa_nhan_bai_giai` (146 dòng "Giải" → "Bài giải:", áp `--only`) · **Hình giải tích 19/19 bản ghi đã gắn
  kí hiệu** (27/09, `scripts/data/hgt_lt_gan_tag_2609.mjs`, bản cũ `hgt_lt_truoc_tag_2609.json`). **Đại chỉ 3/365 dạng có kí hiệu, KHTN 0** — lý thuyết
  cũ hiện như đoạn thường tới khi gắn (dùng lại script HGT làm mẫu: thay đoạn chính xác + so từ cũ/mới + 1 transaction có điều kiện).
- **Khung "Bài tập tự luyện"** (câu hỏi THẬT do builder chọn, `DangBlock` → `CauFlow hop`): 1 khung liền bao CẢ cụm câu của dạng, tag nổi trên viền
  (vai trò như tag Ví dụ), xanh BK `#4c6fff`/`#f5f7ff`. KHÔNG div bọc cả cụm: đỉnh+tag `.pv-bt-cap` nằm CHUNG khối `.pv-bt-dau` (break-inside:avoid)
  với câu/hàng đầu · viền trái/phải trên từng `.pv-caulist-hop` · nhóm đầu `.hop-dau` bo góc trên · nhóm cuối `.hop-cuoi` đóng đáy · đệm 1px giữa các nhóm.
  Sang trang giữa cụm thì khung hở ở mép trang (chấp nhận). BTVN KHÔNG có khung.
- **Còn treo:** app HS (`HocTuDau.tsx`, `HocSinhApp.tsx`) hiện lý thuyết CHƯA qua parser · khung Bài tập tự luyện chưa có cho Hình học
  (`HinhPrintView`) · chưa dựng lại 4A1/giáo trình HGT thật trong app sau 3 lần sửa khung (chỉ verify Chrome headless) · lỗi gõ gốc "Gợi" ở
  HGT T312010205 · `hinh_bo_de`/`hinh_dang` đọc 0 dòng bằng `claude_build` (điểm mù RLS) · khu vẽ hình / bảng điền = bật-tắt theo bài tập (chưa làm).

### ⭐ GIAO DIỆN APP HS — STYLE (cập nhật 29/09) — ĐỌC `design/STYLE-HS.md` + `spec-giao-dien-hs.md` (§ đầu + §9) trước khi sửa
- **Hiện tại: 1 style dùng thật = Anime RPG**, áp cho TOÀN BỘ màn HS, mặc định mọi em. 4 skin code-dựng (Tối giản/Đấu trường/Y2K/Soft Hàn) ĐÃ XOÁ
  29/09 (Thùy gật); 12 em còn lưu skin cũ ⇒ `laySkin()` tự ra RPG, CHECK `hs_giao_dien.skin` vẫn giữ 5 giá trị cũ.
- **Cấu trúc:** hợp đồng `skin/kieu.ts` · gói style `skin/styles/rpg.ts` (màu, font, nền ngang+dọc, 13 icon ô `anhO`, banner, trang trí) ·
  `registry.ts` = danh sách style · mọi màn chỉ dùng `skin/KhungHS.tsx` (ManHS/DauTrangHS/TheHS/NutHS…/MAU/THE/HEAD), cấm màu gõ tay + `if skin`.
  **`npm run check:style-hs` trước mọi commit đụng app HS** (màu gõ tay kiểu chỉ-giảm theo mốc · mọi ô có icon ở mọi style · file hình tồn tại).
- **Mọi skin mở cho mọi em khối 6–12** (Thùy 28/09 tối: "lớp 6 vẫn thích anime"); nhóm tuổi chỉ là chuẩn thiết kế. Cấp 1 còn HomeCap1 (chờ Thùy).
- **DB:** `hs_giao_dien` (1 dòng/HS, có dòng khi em chọn) + `hs_giao_dien_log` (trigger = phiếu bầu) · `lich_thi_lon` · RPC `fn_hs_giao_dien_cua_toi` /
  `fn_hs_luu_giao_dien` / `fn_hs_home_912`.
- **Home khối 6–12 (`HomeHS912`) — dựng theo ảnh gốc #11 (`design/bk-ui-src/Nền app HS cấp 3_11.png`, 29/09):** 2 bố cục chọn theo khổ màn
  (`useMedia('(min-width:1024px) and (orientation:landscape)')`): **NGANG** (PC/iPad ngang) = nhân vật nửa trái + bong bóng thoại · "Chào tên!" ·
  banner · lưới icon to 4 cột (≥9 ô ⇒ 5 cột, iPad ngang vừa 2 hàng) · **DỌC** (điện thoại/iPad dọc) = "Chào tên!" → nhân vật + bong bóng → banner →
  lưới 4 cột ô nhỏ. Nhân vật = hợp đồng Skin `nhanVat {nam, nu}` (RPG: `nv_nam.png` mèo · `nv_nu.png` cú, chọn theo `gioi_tinh`, KHÔNG đổi màu
  theo giới tính). Nền NGANG phủ tối riêng (`nenNgang` trong rpg.ts — PC từng "chói"). **Bỏ Elo** khỏi Home · **bỏ thẻ "Việc cần làm"** (Thùy: HS ít
  việc, ô đã có chấm đỏ) ⇒ chỗ đó = **thẻ Thế giới BK** (`fn_the_gioi_home`); thẻ ca bổ trợ VẪN giữ. Bong bóng thoại suy từ viecTiepTheo.
- **⭐ ĐANG LÀM — Style 2 Thị trấn (Town)** (`spec-giao-dien-hs.md` §9): 27 hình ở `design/bk-ui-src/Style_Town/` đã kiểm 29/09 — ĐỦ 2 ảnh toàn
  cảnh, nền biển + nấm, 3 linh vật, 7 icon ô, banner; THIẾU 5 icon ô (bài trên lớp · BTVN · ET · ví xu heo đất · học từ đầu) + 2 nền kẹo ⇒ đơn bổ sung
  #28–#34 trong `DON-HANG-SKIN-HS.md` (Thùy dán vào đúng context đang vẽ). Code theo §9: ① `styles/town.ts` (SÁNG, Baloo 2) với hình đã có, ô thiếu
  dùng tạm có ghi chú ② migration nới CHECK skin thêm `town` ③ nhân vật/linh vật lên Home (cột mới `hs_giao_dien.nhan_vat`, chung mọi style)
  ④ lời chào + Cấp/XP/xu + bong bóng thoại — chặn bởi công thức cấp ở client `src/gami/level.js` phải xuống Postgres trước.
- **Việc khác còn treo:** Đơn 3 v3 Lo-fi / Đơn 2 Khối vuông (chưa gửi) · cấp 1 có chuyển HomeHS912 không · tầng 2 (màu nhấn, widget).
- **Nguồn hình RPG:** `design/bk-ui-src/Nền app HS cấp 3_*.png` (ảnh 37 = nền dọc Lâu đài) · ảnh chuẩn `design/handoff/hs-skin-rpg-v1/reference/`.
- **Verify không có tài khoản HS:** `hs.html?xem=gami` (đã commit, dữ liệu giả): `man=home&tt=1..3` (Home — mở ở 375 / 820×1180 / 1180×820 / 1440) ·
  `man=the_gioi&tt=1..13` · `man=nhiem_vu` · `album` · `rank` · `ho_so`. Xem từ worktree: launch.json có `dev-hs-thegioi` (npm --prefix worktree, cổng 5191).

### ⭐ THẾ GIỚI BK — mạng xã hội KHOE nội bộ của HS — ĐÃ BUILD 29/09: DB đã áp hết · app đã push `main` (Thùy deploy tay — đối chiếu bundle prod trước khi kết luận) — ĐỌC `spec-the-gioi-bk.md` §4b + §5
- **Luật đang chạy (Thùy chốt 29/09):**
  - **Tin CHÍNH = ĐĂNG BÀI KHOE:** HS có thành tích ⇒ mục "🎉 Thành tích chờ em khoe" (đầu kênh + dòng nhắc ở thẻ Home) ⇒ bấm Khoe ⇒ chọn câu dẫn
    (không bắt buộc) ⇒ **lên Thế giới** (+ Lớp/Bạn bè) + màn "LÊN SÓNG THẾ GIỚI BK!". Khoe được mọi thành tích đủ chuẩn · hạn 3 ngày · **≤ 3 bài/em/ngày** ·
    mỗi thành tích 1 lần · em tự gỡ (⋯). Thành tích = tin SUY từ sự kiện thật (`_the_gioi_tin`) ⇒ không bịa được.
  - **Tin HỆ THỐNG tự đăng:** Thế giới = **chỉ S** (trà sữa · giải tháng · huy hiệu ★4–5) + thẻ gộp A theo loại · **Lớp + Bạn bè = S, A, B có HẠN MỨC**
    (≤1 tin tự động/em/ngày, A trước B · ≤6 tin tự động/kênh/ngày; S + bài khoe ngoài hạn mức). Xếp: ghim S 24h → ngày lên kênh → S/khoe/A/B.
  - **Chỉ thành tích tích cực CÓ SỐ:** ET 10đ (bài ≥5 câu) = A · ET 9–9,5đ = B · tự luyện ≥50 câu đúng/ngày = B · Nhất buổi / Nhất game / đội thắng = A ·
    huy hiệu ★1–3 = A. ĐÃ BỎ "xong N bài". (Đo 28 ngày: ET 10đ 41% nhưng phần lớn bài 1–3 câu ⇒ ngưỡng ≥5 câu; Thử thách 0 lượt; BTVN % chưa ghi.)
  - **Tương tác kiểu FACEBOOK:** bấm 👍 Thích ⇒ dải 6 cảm xúc + ＋ (22 cảm xúc có tên) · dòng "👍❤️🔥 Em, Hà [9A1] và 12 người khác · 5 bình luận" ⇒ bấm
    ra danh sách ai thả gì · tấm bình luận (bong bóng, chạm câu/sticker là gửi, KHÔNG chữ tự do) · "Đọc N bình luận" · thẻ gộp "Đọc bình luận (N)" ·
    ≤3 bình luận/em/tin · chủ tin ẩn bình luận, người viết gỡ. **104 câu** (69 khen · 30 dẫn khoe · 5 cảm ơn), KHÔNG lọc — chỉ xếp câu hợp lên đầu.
    Sticker tạm = emoji to (Thùy mua bộ sticker ⇒ `the-gioi/sticker/<mã>.png` + `KIT.sticker_tg`).
  - Tên LUÔN kèm lớp · em chọn hiện Tên/Mã HS · Bạn bè 2 chiều (lời mời → đồng ý) · 👑 Thầy cô khen (hàm có, nút ở app GV chưa làm).
- **DB (mig áp bằng `--only`):** 202609290108 (lõi) · 0148 (thả cảm xúc + bình luận) · 1006 (`fn_the_gioi_home`) · 1226 (tin chất lượng + `_et_diem_buoi`)
  · 1233 (bỏ B tự đăng — bị 1323 thay) · 1239 (**bài khoe** `the_gioi_bai_khoe`) · 1305 (thêm câu + bỏ lọc) · 1323 (hạn mức Lớp/Bạn bè).
  Hàm chính: `fn_the_gioi_kenh(tg|lop|ban)` · `fn_the_gioi_home` · `fn_the_gioi_cho_khoe` / `_khoe` / `_go_khoe` · `fn_the_gioi_tha` · `_binh_luan` ·
  `_chi_tiet` · `fn_ban_be_*`. Test ROLLBACK mẫu: scratchpad `thu_khoe.cjs` (HS thật qua `tai_khoan.id`).
- **App:** `src/lib/thegioi.ts` · `screens/hocsinh/thegioi/TheGioiHS.tsx` (VIEW tách container, vá tại chỗ, cột 720px giữa màn trên PC) · mẫu `mauTheGioi.ts` ·
  ô Home `the_gioi` (icon TẠM `o_pha_le`) + thẻ Thế giới ở Home. Hình Đơn 5 chưa có ⇒ emoji + khung RPG (Thùy: "chưa có hàng thì dùng tạm").
- **TREO:** cột `the_gioi_khen.cau_ma` thôi dùng (0 dòng) — **chờ Thùy gật xoá cột** · nút khoe ngay ở màn kết quả (hết tự luyện, lớp phủ huy hiệu) ·
  push HS ("bài khoe của em có 12 tim" — màn Lên sóng KHÔNG hứa push) · Hồ sơ "đã lên Thế giới N lần" · ghim "HOT TUẦN" · tin "lên bậc rank" (cần nhật ký
  lên bậc) · nút 👑 app GV · cấp 1 chưa có Thế giới · đơn ChatGPT Đơn 5 phải sửa theo khoe + FB (MÀN 4 đã sửa, chưa có nút khoe/màn Lên sóng) ·
  2 hạn mức (1/em, 6/kênh) + ngưỡng tự luyện 50 câu chờ số liệu thật để chỉnh.

### ⭐ GAMIFICATION HS — Rank · Thử thách · Nhiệm vụ · Vòng quay · Huy hiệu — ĐÃ BUILD 28/09 (DB đã áp, app CHƯA push/deploy) · phase 1 CHỈ TOÁN
> Đọc: `spec-thanh-tuu-nhiem-vu.md` **§0** (luật đã chốt, số mới nhất) · `spec-huy-hieu-build.md` (đo 14 thành tựu, schema, RPC) ·
> `design/DON-HANG-GAMI-HS.md` (đơn ChatGPT: Huy hiệu · Nhiệm vụ+Album · Hồ sơ). Test chạy lại được (transaction + ROLLBACK):
> `scripts/_thu_mig_rank.mjs` · `_thu_mig_nhiem_vu.mjs` · `_thu_mig_huy_hieu.mjs`.

**Luật đã chốt (số MỚI NHẤT — §0 spec là nguồn):**
- **Điểm Rank ≠ EXP** (không đổi xu). 4 nguồn: ET 100/bài · BTVN 100 đúng hạn / 50 muộn · MT bảng hạng 1–50 (quy theo số em thi) ×10 (1.000→500) ·
  Thử thách pass ≥80% ⇒ 10/20/30. Toán 1 tháng = 8 buổi = 1 MT + 7 ET + 7 BTVN ⇒ tối đa 3 nguồn 2.400 · trần Thử thách **600/tháng · 30/ngày** ·
  **điểm tối đa tháng 3.000**. Tháng 8–9/2026 mất ET hình (lỗi) ⇒ bù ET theo lớp lên chuẩn 7 (`rank_thang_mat_et`).
- **10 bậc THUẦN theo điểm tích luỹ mùa** (mùa 1/7→30/6, hết năm về 0), ngưỡng co ×0,875 theo năm học 10,5 tháng: Novice 0 · Soldier 1.575 · Captain 4.200 ·
  General 7.875 · Hero 12.075 · Legend 18.375 · King 21.000 · Emperor 25.725 · **God of War 28.350 · Supreme God 30.240** (Thùy chốt; có năm không ai thành thần).
  Bảng đua tháng: xếp điểm tháng, không đổi bậc.
- **Nhiệm vụ** (mở **01/10/2026**): ngày N1 Thử thách · N2 Luyện 20 · N3 Sửa sai (treo tối đa 3 ngày; 1 lần làm lấp 1 nhiệm vụ cũ nhất) · tuần T1–T4
  (4 khối 1–7/8–14/15–21/22–cuối, T2–T4 dồn tới hết tháng) + rương 12 nhiệm vụ/tuần · tháng M1 MT bứt phá · M2 Thử thách 15 ngày → Điểm Chặng → 30 cấp → EXP.
  **Vòng quay** từ 01/10: xong 2 nhiệm vụ ngày, giải 20/30/50/100/200 EXP (40/35/18/6/1%), EXP đổi ra xu. Trước 01/10 chạy luật cũ.
- **Trần xu app 30/tháng/môn** trong `fn_gami_exp_xu_thang` (SQL Editor đã chạy, đã ghi sổ; Thùy đã revoke PUBLIC ⇒ claude_build KHÔNG gọi được hàm này nữa, app vẫn chạy).
- **Huy hiệu:** 8 Hy Lạp · sao 1/2/4/6/9 tháng (★1–3 tháng đạt chuẩn, ★4–5 tháng hoàn hảo) · năm huy hiệu tháng 7→4 · tính lùi từ 07/2026 ·
  chốt tháng T từ 10/T+1, theo thứ tự · ★4–5 bản cứng GV trao · đạt lại năm sau = ×2 (bản cứng chỉ lần đầu).
- **Hồ sơ khoe:** bấm avatar mở · tường của nhau = phase sau · danh hiệu = giải thưởng tháng. **Đừng lẫn bậc rank / huy hiệu / danh hiệu.**

**Đã build (DB áp bằng `migrate --only`; 13 file treo trong sổ là của phiên khác — đừng `npm run migrate` trần):**
- Mig 202609281711 · 1739 · 1749 · 1754 (rank + Thử thách) · 1809 (mastery `p_den`) · 1810 (nhiệm vụ + vòng quay) · 1817 (trần xu, SQL Editor) ·
  1846 + 1857 (huy hiệu).
- App HS: Tự luyện có thẻ ⚔️ Thử thách + link 📜 Nhiệm vụ / 🏆 Rank · `RankHS` · `NhiemVuHS` · `MayManHS` 2 chế độ · `AlbumHS` (mở từ Thành tựu).
  Nhân sự: lá `huyhieu` (Trao bản cứng · Chốt tháng · Ma trận). Giao diện HS là BẢN THÔ, chờ design (đơn ChatGPT).
- Verify giao diện bằng trang tạm `_xem_rank.html` + `src/_xem_rank.tsx` (mock RPC, KHÔNG commit — xoá khi Thùy gật).
- **29/09 — DỌN ĐƯỜNG "ĐỔI VỎ" + HỒ SƠ (pushed, chưa deploy):** sổ hình `src/screens/hocsinh/gami/hinh.ts` (mọi PNG + màu game + cờ `KIT.*`; chưa
  bật cờ ⇒ `gami/HinhGami.tsx` vẽ hình tạm) · tách VIEW (`NhiemVuView`/`AlbumView`/`RankView`/`HoSoView`) · lớp phủ đạt sao mới / lên bậc
  (`gami/ChucMung.tsx`, "đã xem" ở localStorage) · **màn Hồ sơ** `HoSoHS.tsx` (7 khối, chọn 3 khoe, thẻ TV; Home 6–12 bấm avatar ⇒ Hồ sơ, đổi ảnh
  vào trong Hồ sơ) · mig **`202609290015`** (bảng `hs_huy_hieu_khoe` + `fn_hs_ho_so` + `fn_hs_khoe_dat`, ĐÃ ÁP) · **trang mẫu `hs.html?xem=gami`**
  (mọi màn × trạng thái, dữ liệu giả `gami/mauGami.ts`, `man=bo_hinh` soát hình). Chi tiết: spec §0.7b + §0.8 C11.
- **Đơn design v3** `design/DON-HANG-GAMI-HS.md`: style Anime RPG · ảnh toàn cảnh duyệt trước → từng hình riêng (1 hình/lượt, #số + tên file, không zip)
  · bảng đổi tên file giao → file code (bản 48/64/96px Claude tự thu nhỏ). Đơn 5 "Thế giới BK" cũng nằm trong file này (xem mục THẾ GIỚI BK).
  **Hình về:** Claude nén + đổi tên vào `public/bk-ui/hs/gami/` → bật cờ `KIT.*` → soát `?xem=gami&man=bo_hinh` → sửa VIEW theo ảnh toàn cảnh.
- **29/09 — kit Đơn 1 NHIỆM VỤ ĐÃ GHÉP (`KIT.nhiem_vu = true`):** `design/bk-ui-src/Mission/` #09–24 = 16 icon (N1…vong_quay) · #25–27 TRÙNG #22–24 ·
  #28 = `fx/sao_moi_sang.png` ⇒ nén 160² vào `gami/nhiem-vu/`. `NhiemVuView` dựng lại theo ảnh toàn cảnh #01 (thẻ viền + tiêu đề ✦, icon to bên trái,
  "+10 ✦" + vòng tick, Chặng thanh cả tháng mốc 10/20/30, hàng rương nối dây). Đơn 2 (huy hiệu), 3 (bậc), 4 (hồ sơ), 5 (Thế giới) CHƯA về.
- **Điểm ET 1 buổi = `_et_diem_buoi(tu, den)`** (mig 202609291226) — nguồn công thức DUY NHẤT; nhiệm vụ T2 + tin Thế giới dùng chung (so khớp 100% T9).

**VIỆC TIẾP (theo thứ tự):**
1. **Thùy:** chốt huy hiệu tháng 7 rồi 8 ở màn Huy hiệu › Chốt tháng (**chỉ admin** — mig 202609282350: DB chặn bằng `co_quyen_ghi('huyhieu')`, hết timeout: chốt T7 ~2s, T8 ~4s) · cấp lá **`huyhieu_trao`** (chỉ tab Trao bản cứng) cho vai GV — **KHÔNG** cấp `huyhieu` cho GV (Thùy 28/09: *"chốt 1 tháng 1 lần bấm tay, không cần GV — GV chỉ được báo trao quà"*) ·
   gửi đơn ChatGPT `design/DON-HANG-GAMI-HS.md` **v3** (Thùy đang gửi 29/09) — **Đơn 2 + 3 trước** (bộ hình), rồi 1, rồi 4 · deploy khi muốn HS thấy.
2. Chốt tháng 9 từ 10/10. Theo dõi 01/10: nhiệm vụ + vòng quay luật mới tự bật.
3. Còn làm: danh hiệu trên Hồ sơ (hàm trả giải tháng gần nhất — ô đang ẩn) · kỷ niệm mùa (chốt bậc cuối mùa, trước 30/06/2027) · catalog cũ
   `thanh_tich_loai` / `hoc_sinh_thanh_tich_ghim` còn nguyên, chưa ai tắt (đụng bảng đang dùng — hỏi trước) · ô Home Rank/Nhiệm vụ · ví xu hiện dòng
   EXP nhiệm vụ/huy hiệu · danh hiệu top dạng (C5) · quà đua lớp (C8) · soi 4 màn bằng tài khoản HS thật (mới soi bằng trang mẫu).
4. Nợ cũ còn: chọn dạng Tự luyện/Thử thách đang chạy ở CLIENT (`chonDangTuLuyen`, JS) — §2.0 muốn đẩy xuống DB.

### ✅ PHA 4 — ĐƯỜNG ỐNG CA YẾU (bổ trợ) — ĐÃ BUILD (09→28/09), khác thiết kế 25/07 ở vài chỗ
Thay bằng luồng thật ở `spec-bo-tro.md`: retest 2 tầng = **test cuối ca** (`bo_tro_test`, tính mastery như ET) + **retest** (`bai_test.loai='retest'`,
buổi thường kế tiếp, TA lớp đưa iPad; `fn_btyeu_retest_ghi` ghi dat/dong_at từng dạng) — KHÔNG làm bảng con `bo_tro_yeu_retest`/`bt_ngay`/`bt_xn`
như phác 25/07. Vòng 4 trạng thái: Chờ duyệt → Đang bổ trợ → Chờ retest → Hoàn thành (`case_truoc_id` = vòng). Tóm tắt ở đầu ① (dòng ⭐ BỔ TRỢ).

### Chưa làm
- ✅ **(XONG 07-03)** KB3 nhập-kho ingest-first — màn `nhapkho` (xem section trên). AI auto-tag dạng ĐÃ làm (không còn "điền tay 100%"). Còn: mo_ta_ngan + distiller.
- ✅ **(XONG 07-02)** Màn Kết quả học tập — 4 view đầy đủ (xem section trên). Chỉ còn điểm-năng-lực + mặt-HS/PH.
- ✅ **(XONG 06-17)** bucket `avatars` — đã chạy trên Dashboard, verify hoạt động (có ảnh NS/HS thật trong bucket).
- **⭐ XỬ LÝ TÀI LIỆU — đang BUILD FULL PHASE 2** (Thùy chốt: build full rồi sửa Phase 0 1 thể; ADR: [Bộ xử lý tài liệu](https://app.notion.com/p/384d4530bcdb815093a1d601c29c7bab)). 4 kịch bản — **thứ tự ưu tiên (Thùy): 2 → 4 → 3.** KB1 cắt-1-bài ✅ · **KB2 1-PDF-1-dạng ✅** (= batch 'auto' đã gộp, xem block 06-18) · **KB4 lý thuyết có hình ✅** (editor lý thuyết "🖼 Bóc + hình": `buildTheoryIngestPrompt`+`THEORY_SCHEMA` trả text+[[Hn]]+bbox → cắt+chèn `![](url)` đúng vị trí) · **KB3 ✅ (07-03)** file nhiều dạng → màn **`nhapkho`** ingest-first (scope chủ đề; AI auto-tag dạng + confidence + verify low-conf; đúng/sai per-mệnh-đề; precision@1) — xem section 07-03. (AI xếp dạng ĐÃ làm, KHÔNG còn "điền tay 100%".) **Phase 0 còn**: #2 chuẩn hoá ⋮→`\vdots` (ở code, đừng vá prompt) · #1 verify bảng `array` render · #3 (tuỳ) thêm call tự-kiểm clone. (#3 thinking ĐÃ bật.) **Phase 1** = AIG/template (Thùy chọn LLM+tự-kiểm).
- **Mobile:** mới tối ưu tab "Chấm bài trên lớp"; các tab khác (điểm danh/đánh giá/ET) + shell nav chưa làm mobile.
- **⭐ NGAY — màn TIVI (đường đua Elo realtime + linh vật):** việc tiếp theo đã chốt. ⏳ **Chờ Thùy quyết:** TIVI theo **1 lớp/buổi** (đường đua HS trong lớp) hay **leaderboard toàn khối**? Data đã sẵn (`getEloBreakdown`/`listGamiBangTong`/`gami_elo_history`).
- ✅ **(XONG 07-01, nối ET-online 07-04)** MASTERY ENGINE — `src/gami/mastery.js`+`src/lib/mastery.ts`, màn Kết quả học tập 4 view, đọc cả grades/đánh-giá lẫn bai_lam_cau (ET/đề-thi online). Xem section "Đã build" tương ứng.
- **⭐ Chiều MÔN — MÔ HÌNH CHỐT 06-29 (xem `ADR-mon.md` + CLAUDE.md §1.6):** **mỗi MÔN = 1 TRUNG TÂM riêng** (4 môn đối xứng; chung HS + vận hành; content RIÊNG từng môn/nhánh, **KHÔNG gộp bảng**). **Luật: mọi dữ liệu HỌC TẬP có nhãn `mon`** (chỉ phi-học-tập mới chung). ĐÃ: lớp `mon` · Elo/EXP per-môn (0041) · kho KHTN (0050) · tuyển-sinh đa-môn + `mon.ts` · `nhan_su_mon` (0056)+gate kho · `vi_tri.mon` (0057)+sơ đồ mỗi-môn-1-cây · `tai_lieu.mon` (0058)+tài-liệu-theo-môn · Điểm số/Buổi học theo môn. CÒN (theo ADR mới): Đại/Hình→1 trung tâm Toán có nhánh · 1 registry dispatch · ref vận hành mang `mon` · Anh/Văn chưa có kho.
- **Cấp quyền:** leaf "Làm tài liệu"/Kho cho role **Học thuật**; OPS muốn 1-màn-work-view thì trim role OPS bỏ màn admin (Phân quyền tab1). (Hiện seed roles có sẵn nhiều màn.)
- **GAMI tiếp:** **TIVI** (xem mục NGAY trên) · **bù/bổ trợ** UI (schema sẵn) · MT/Đội/Boss (GĐ B) · Test e2e 1 buổi thật. **Tinh chỉnh Elo:** nếu vẫn "đụng trần ±40 nhiều" → hạ K_calibration tiếp (32→24) hoặc nới cap (`src/gami/config.js`).
- **Thành tích còn lại (06-17) — ⚠ SUPERSEDE 28/09 bởi mục ⭐ GAMIFICATION HS (8 huy hiệu Hy Lạp; Mythwings chỉ còn là art phượng hoàng cho Phoenix); dưới đây chỉ để tham khảo:** compute catalog `thanh_tich_loai` còn thiếu (vượt-band/điểm-10/9+/chuỗi-BTVN/lên-band…) + hệ gợi-ý-top + ghim · **danh hiệu Mythwings = data thật** (cấp/% từ điều kiện — đang placeholder cấp1/0%; nối khi define) · **số liệu chờ define:** số xu mỗi `luong_bac` (provisional) · `muc_nang_luc.diem_ky_vong` từng band · trọng số "độ hiếm" · điều kiện/% 3 danh hiệu · luồng nộp BTVN · art nhân vật theo Level · "Player Level tổng" cross-môn. (Skin game ĐÃ áp.)
- **Data:** khối 6-10 vừa xóa ghi danh (Thùy xếp lại tay) → sĩ số 0, card báo thiếu band tới khi xếp.
- **Nợ khối nhân sự (trước khi vận hành thật):** trigger ghi-log lịch sử §4 (đổi band/phân công/TKB/membership chưa có vết — timeline tiến bộ HS cần nó) · màn Phụ huynh riêng (list PH + các con) · hiện tên người tạo tài liệu (map `tai_khoan`→`nhan_su`) · import HS/NS từ V1 · siết RLS theo phạm vi (cách A).
- **Làm tài liệu — còn lại**: **BLOCK P2** (1 dạng chia NHIỀU block khác kiểu + gom dưới 1 header — nền `tai_lieu_phan.kieu` sẵn) · **kiểu block mới**: `bang` (bảng) · `ve_hinh` (khu vẽ) · `nhieu_y` (bài có ý con — cần chỗ chứa stem) · reorder buổi (reorder DẠNG ✅) · header/footer nhiều mẫu (mới 1 dải sóng) · watermark · gu B/C · Hub tab Đề thi / Tài liệu bổ trợ = placeholder.
- Nhánh **Hình** (tab stub "dựng sau"): cây Mảng→Loại→Dạng-hình + Bài/Ý/mô hình/bổ đề (spec §4).
- Quản lý 4 danh mục (thuộc tính/bổ đề Đại, mô hình/bổ đề Hình); gắn thuộc tính cho Dạng.
- **Tải PDF từ hàng bảng:** ✅ đã làm (headless, xem 07-03). CÒN: verify mắt file ra + (tuỳ) phương án B thanh gradient phẳng nếu wave lỗi.
- **Kho tài liệu** (video/pdf/slide tag dạng — resource library, KHÁC "Làm tài liệu"). Theme **Classroom** cho màn Nhân sự.

### 🐞 BUG MỞ (chưa sửa)
- ✅ **(XONG 07-03) Lỗi SỐ CÂU + % trong KHO hiện "0/50"** — đúng như nghi (đếm cụt), nhưng ngưỡng là **PostgREST cap max-rows (~1000)**, không phải 10000. Fix mig 0062 RPC đếm ở Postgres (xem block 07-03).
- **Lý thuyết buổi 3: 4 trang → 8 trang khi trích PDF** (giáo trình buổi, in paged.js NHÂN ĐÔI nội dung/trang). Thùy báo rồi chuyển việc, CHƯA điều tra. Nghi: lý thuyết render 2 lần / paged.js nhân trang / trích xuất copy LT 2 lần. → soi PrintView + `getTaiLieuFull` (lý thuyết chuyên đề) + trichXuatBuoi. (⚠ 07-01 đã fix 1 nguồn race paged.js — có thể đã hết, chưa soi PDF xác nhận.)

### 🔜 HỆ THỐNG AUTO-REPORT — ĐANG LÀM (context riêng, độc lập tính năng khác)
> Mục tiêu: vòng lặp **report → AI fix → người duyệt** đẩy nhanh hoàn thiện lúc nhiều lỗi vụn.
- **Luồng 2 CỔNG NGƯỜI GÁC (Thùy chốt):** ① nhân sự báo lỗi (mô tả KỸ + ảnh + context tự đính) → `mới` · ② **Thùy filter** duyệt lỗi nào cho auto-fix (loại task to/rủi ro) → `cho-fix`/`từ-chối`/`để-tự-làm` · ③ **AI luồng riêng** fix lần lượt report `cho-fix` trên **branch riêng → mở PR** (chờ sẵn) → `đã-fix·chờ-apply` · ④ Thùy online vào list đã-fix **apply+test từng cái** (merge PR độc lập) → `xong`/`trả-lại`. **KHÔNG auto-merge `main`.**
- **Sống còn = CHẤT LƯỢNG REPORT:** auto-capture route/leaf + vai trò + tài khoản + console errors + ID data + ảnh (html-to-image). Report rác = fix rác.
- **Chỗ chạy "luồng riêng" (bước 3):** #1 máy local (phải bật) · **#2 cloud routine Anthropic** (scheduled, máy tắt vẫn chạy; CHƯA chắc clone repo/push PR/đọc Supabase/build được — phải SPIKE) · **#3 VPS luôn bật** (chắc hơn, full toolchain → **tự build/tsc TRƯỚC khi mở PR** = PR chất lượng, đỡ tốn giờ duyệt; set up + vài $/tháng). Rủi ro chung: agent unattended + auto-approve → **nhốt cứng** (chỉ branch, cấm main/migration/xoá/lệnh phá, chỉ mở PR).
- **Quyết định Thùy:** Report lưu **Supabase table** (nhân sự báo trong app, mô tả kỹ). Bước 3 chạy **định kỳ** (bug ít). **Pha 1 trước** (cần bất kể chạy đâu) → **SPIKE #2** (tiêu chí đậu: đọc report Supabase + sửa+**build pass** + push PR; đủ 3 → chốt #2, thiếu → rớt **#3**). CTO cá cuối cùng về **#3** (vì tự-build-test-trước-PR).
- **PHA 1 ✅ BUILT (06-22 phiên 2, mig 0047):** `bao_loi`+`bao_loi_log`+trigger `log_bao_loi` (state-log §4) + RLS member-gate (ĐÃ áp DB). `src/lib/baoloi.ts` (seam CRUD + uploadReportAnh→bucket `kho-anh`/report/ best-effort) · `src/lib/errorBuffer.ts` (bắt console.error/window error, init main.tsx) · `src/components/ReportButton.tsx` (nút nổi 🐞 bottom-left, mount App→mọi màn; bấm→form mô tả + tự gom context leaf/người/email/url/viewport/UA/lỗi-console→gửi. **KHÔNG auto-screenshot Pha 1**: app Tailwind v4 oklch → html-to-image ra trắng, html2canvas throw; để Pha 1.5 getDisplayMedia/html2canvas-pro) · `src/screens/baoloi/BaoLoiScreen.tsx` (leaf `baoloi` nhóm Hệ thống; queue+lọc+expand→**CỔNG 2** Cho-fix/Để-tự-làm/Từ-chối · `da_fix`→Đã-apply/Trả-lại). tsc+build pass, **CHƯA test UI thật**.
- **PHA 2 — TIẾP THEO:** nối luồng fix bước 3 = **SPIKE #2 cloud routine** (đọc report `cho_fix` Supabase + sửa+build + push PR; agent set `da_fix`+branch/pr_url). Đậu→#2, thiếu→**#3 VPS**. Nợ: bucket riêng `report-anh` (giờ tái dùng kho-anh) · **nhốt agent** (chỉ branch/PR, cấm main/migration/destructive) · capture context có thể thêm (network request lỗi).

### 🔜 Bài tập hàng ngày (V2) — ĐANG THIẾT KẾ (chưa code, chưa đụng DB)
- **Mục tiêu**: port + nâng cấp "Daily 5T" của V1 (đọc `bkdemy-erp/src/components/student/TabDaily*`, `pages/admin/TabDaily5T`). Engine **cho MỌI khối** (không riêng 5T).
- **Chặn đã GIẢM (06-11): nền HS + lớp + band ĐÃ CÓ** (khối static). Còn thiếu: nền Đo (phép-đo HS×dạng) + bảng daily + "đã học tới dạng nào".
- **Logic Thùy chốt**: bộ câu/ngày = **50% rà-soát ngẫu nhiên + 50% luyện điểm-yếu**.
- **Logic T đã phản biện & sửa lại** (Thùy chưa duyệt bản sửa): rà-soát giới hạn **dạng ĐÃ HỌC**; "điểm yếu" = mastery thấp **+ đủ mẫu** (ít data→đẩy sang rà-soát, §5 độ tin); mỗi câu→**1 phép đo bất biến** gắn `nguon=daily`+`cham_boi`, **trust THẤP** (home/không giám sát/AI chấm — triangulate với test, đừng để "thạo giả"); rà-soát nên **spaced-repetition + uncertainty-sampling** (hơn random thuần); luyện điểm-yếu lấy **CÂU KHÁC** (chống học vẹt); 50/50 là **mục tiêu mềm**; không phát lại câu trong N ngày; cờ **daily-ready** theo dạng đủ câu.
- **⏳ ĐANG CHỜ Thùy quyết** trước khi đụng DB: "đã học tới dạng nào" lấy ở đâu — **(a)** theo lớp (lộ trình GV nhập) / **(b)** theo HS (suy từ data đo — cold-start rỗng) / **(c)** mở hết khối (T không khuyến nghị).
- **Plan 4 lớp**: ① nền HS (`hoc_sinh`+lớp/khối, import từ V1) ② nền Đo (phép-đo bất biến, mastery **suy động**, anti-NULL: chưa làm=không có dòng) ③ engine Daily (chọn 50/50 từ `dai_cau_hoi`, **chấm 3 tầng** luật→cache→AI **qua proxy**, streak) ④ báo cáo + dashboard GV (HS báo sai→GV duyệt→backfill).
- **Tái dùng từ V1** (thiết kế tốt): chấm 3 tầng + cache `accepted_answers` (unique theo đáp-án-chuẩn-hoá, càng dùng càng ít gọi AI) · `smartNormalize` (bỏ đơn vị, `1,5`→`1.5`, `1/2`→`.5`, hoán vị) · báo-sai→duyệt→backfill · streak.

### Đã build (HỌC PHÍ — leaf `hocphi`, nhóm Core team, 07-05)
- **Model 3 khoản ĐỘC LẬP, KHÔNG gộp:** **học phí** (theo LỚP, mỗi lớp 1 `muc_hoc_phi_id`) · **học liệu** (theo LỚP, mỗi lớp 1 `muc_hoc_lieu_id`, CHỈ tính khi tháng đó thật sự có học phí ≥1 buổi — không phát sinh học phí thì không charge học liệu) · **học đuổi** (theo CA `bo_tro_duoi`, `buoi_hoc.muc_hoc_duoi_id` — KHÔNG theo lớp, mỗi ca tự chọn giá, gán/sửa ở màn "Đuổi"). Cả 3 loại mức đều tên tự-đặt-theo-giá (`tenTuGia`), không gõ tay. Lớp MỚI TẠO tự nhận mức mặc định 150k/30k (`CreateLopModal`); lớp cũ đã backfill 1 lần (mig 0077, chỉ điền NULL).
- **Hệ số học phí = thông tin CỦA HỌC SINH** (không phải gia đình): học ≥2 môn -5% · có anh chị em CÙNG học chung ≥1 môn -5% (gộp -10%). **Pure-derive gợi ý (`tinhHeSoHocSinh`), Nhân sự bấm "Xác nhận" mới ghi** vào `hoc_sinh.he_so_hoc_phi`/`he_so_nguon` (auto=theo gợi ý đã xác nhận, manual=sửa tay khoá gợi ý). KHÔNG có hook auto-ghi im lặng ở ghiDanh/roiLop — mọi thay đổi enrollment chỉ làm gợi ý ĐỔI (tự nổi lên đầu bảng "Hệ số" nhờ sort theo lệch-gợi-ý), không tự ghi đè.
- **`getPhieuAo`** (per-PH, N+1 OK vì chỉ 1 PH) = nguồn CHÍNH XÁC nhất (có xét duyệt nghỉ≥30%, nợ kỳ trước, phát sinh tay lúc chốt). **`tinhTamTinhTheoPH`/`listHocPhiTheoHocSinhVaMon`** (bulk toàn trường, BATCH QUERY không N+1) = nguồn XẤP XỈ cho các bảng tổng quan — KHÔNG chạy xét duyệt, luôn hiện số buổi RAW. 2 nguồn CÓ THỂ lệch nhau khi có hàng đang chờ xét duyệt — đúng ý, không phải bug.
- **7 tab:** HS theo môn (audit per-HS×môn, đặt đầu) · Học phí học chính (bulk theo PH, KHÔNG gồm đuổi, có toggle **trạng thái thông báo**) · Học phí bổ trợ đuổi (bulk riêng, chỉ view đối chiếu — vẫn gộp chung 1 hoá đơn khi chốt) · Phiếu (chọn PH+kỳ, phiếu ảo/thật, chốt, thu tiền) · Xét duyệt (card hiện tên+mã+lớp HS) · Hệ số (bảng TO mọi HS, sort lệch-gợi-ý lên đầu) · Mức & Lớp (CRUD 3 loại mức + gán mức-lớp bulk) · Phát sinh (nhập chi phí theo LỚP hoặc CÁ NHÂN, `hoc_phi_phat_sinh`, tự cộng vào cả 2 nguồn tính).
- **Trạng thái thông báo thu tiền** (`hoa_don.trang_thai_tb`, chỉ áp PH đã CHỐT): 3 bước **Đã thông báo lần 1 → Chưa nộp-đang xử lý → Đã hoàn thành**, nút "Xong bước này →" tự nhảy, mỗi bước có nội dung soạn sẵn (`soanThongBao`) + nút Copy — Nhân sự không tự nghĩ chữ. Chưa tự động hoá theo `ghiThanhToan` (vẫn bấm tay).
- **CÒN:** chốt kỳ vẫn 1 hoá đơn gộp cả 3 khoản (không tách hoá đơn riêng đuổi) · PH-facing app (`bkdemy-ph`, phạm vi lớn hơn — tách riêng) · roll-up CFO · RBAC cấp role Kế toán.

### ⭐ HỌC PHÍ — REDESIGN 08-01 (SUPERSEDE phần 07-05 ở trên chỗ nào mâu thuẫn)
- **Tab "Học phí học chính" → "Học phí tổng":** list MỌI PH + tổng ĐẦY ĐỦ (= học phí CT1/CT2×hệ số + học liệu + đuổi + phát sinh + **nợ**). `listPhieuTheoKy` nâng cấp + `soDuNoTheoPH()` batch. Mỗi PH nút **"Chi tiết ▾"** bung `PhieuChiTietExpand` → khoản + **Chốt kỳ + Thu tiền** TẠI CHỖ + giữ 📷 Ảnh QR + ⬇ PDF. **BỎ HẲN tab "Phiếu"** (gộp vào đây, xoá `PhieuTab`).
- **⭐ BỎ HẲN XÉT DUYỆT:** xoá tab + `XetDuyetTab` + lib (`ensureXetDuyet`/`listXetDuyetChoDuyet`/`duyetXetDuyet` + type `XetDuyet`). Bảng `hoc_phi_xet_duyet` để TRƠ (không drop). `getPhieuAo` giờ **TỰ tính CT1/CT2**: `ct = chọn-tay(hoc_phi_cong_thuc) ?? deXuatCongThuc(nghỉ, buổi-lớp)`; `soBuoi = ct2 ? (đi học + bù) : buổi-lớp`. KHÔNG còn gate người duyệt → chốt NGAY. (Bug duplicate-key `hoc_phi_xet_duyet` do ensureXetDuyet SELECT-rồi-INSERT bị đua khi expand — đã hết.)
- **⭐ LOGIC BÙ — `buByGocKy` NGUỒN DUY NHẤT** (dùng chung "HS theo môn" + `thongKeBuoiConLop` + `getPhieuAo`, không đếm lệch): bù tính theo **THÁNG buổi GỐC** (bù T7 diễn ra T8 vẫn thuộc T7) · GỒM buổi đã xếp chưa diễn ra + đã xếp bị **HUỶ** (đã bỏ công sắp xếp) · dedupe theo gốc (bù ≤ nghỉ) · `tachBu` tách đã-bù (hoàn tất+co_mat) vs đã-xếp. (Verify Anh Khoa 9C1 T7: bù 6 = 5 đã bù + 1 đã xếp → CT2 14 buổi.)
- **⭐ CÔNG THỨC (CEO chốt 08-01):** `Học phí tổng PH = Σ mỗi HS[ Σ(học phí môn CT1/CT2 × hệ số) + tài liệu + đuổi + phát sinh ] + nợ`. **Hệ số CHỈ nhân học phí BUỔI** — tài liệu/đuổi/phát sinh KHÔNG nhân (giữ rule §6). Hệ số per-HS (không per-gia-đình).
- **⭐ QR VietQR** (`lib/vietqr.ts`, NAPAS EMVCo sinh LOCAL không API ngoài; **VPBank BIN 970432 / TK 38496433 / DUONG HUU QUANG**; nội dung `HP <mã PH> T<MMYYYY>` = khoá đối soát): nhét ảnh phiếu → gửi Zalo → **Zalo tự đọc QR → hiện "Chuyển tiền" → mở app bank PH điền sẵn** (MIỄN PHÍ, KHÔNG cần cổng thanh toán). Đối soát tự động (Casso/SePay) = pha sau.
- **⚠ Bug `.limit()` cắt cụt (đã fix):** query gom điểm danh toàn trường >LIMIT 2000 → PostgREST cắt → nghỉ/đi-học SAI (Bùi Minh Hải "nghỉ 1" thực 3). Fix `fetchAllBhh` paginate `.range()`. `buByGocKy` buLinks CÙNG bẫy — paginate khi link bù >2000.
- **App PH (`bkdemy-ph-app`):** mig `0018_hoa_don_view_fdw` (đã apply), màn Học phí (`TuitionScreen`/`HocPhiCard`: QR 220px + nút Tải ảnh + copy nội dung), `page.tsx` sinh QR server-side. ⚠ ERP `hoa_don` HIỆN = 0 (chưa ai chốt) → phiếu-thật/app-PH/số tiền chờ chốt 1 kỳ mới verify E2E. ⚠ Có PHIÊN KHÁC làm chung ph-app (đã va: nó commit PhApp.tsx thiếu page.tsx/data.ts → origin từng broken).
- **✅ ĐÃ LÀM NỐT 08-01 (6):** ① **Trạng thái Đã báo/Đã nộp + cảnh báo 3 ngày** — mig `202608012110_hoa_don_bao_lan1_at` (đã áp prod), `danhDauDaBao`/`TrangThaiThuCell`; GỘP 2 cột trạng-thái → 1 cột (Chưa chốt→Chưa báo→Đã báo→Đã nộp; quá 3 ngày = badge đỏ + "Báo lần 2"). Cột `trang_thai_tb` 3-bước để TRƠ. · ② tab **"Học phí nợ"** (`listNoPhaiThu`/`NoTab`, PH còn dư nợ >0). · ③ **CT1/CT2 toggle bar** (`CtToggle` segmented + "✓ Lưu" mới ghi; xoá `daoCongThuc` lưu-ngay). Tất cả tsc xanh + verify live.
- **✅ 08-01 (7) thêm:** **Nợ khởi tạo** (mig `202608012230` cột `phu_huynh.no_khoi_tao`, người điền ở tab Nợ) **tự cộng vào "nợ kỳ trước" phiếu tháng** (`tinhSoDuNo`/`soDuNoTheoPH` +khởi-tạo; `noChiTietTheoPH` tách khởi-tạo/hệ-thống). · **Huỷ chốt** (`huyChot` xoá thanh_toan→log→dòng→hoá đơn, về ảo → sửa → chốt lại; nút trong expand). · Tab Học phí tổng: **cột "Học sinh"** (tên con) + **ô search** (PH/tên HS/mã, bỏ dấu) + **2 cột trạng thái** tách lại (Thu tiền `ThuTienBadge` + Thông báo `BaoCell`). · **"Chốt" = đông cứng số để đối soát/định-nghĩa-nợ/lưu-sổ; per-PH; sửa sau chốt = huỷ→tính lại→chốt lại.**
- **✅ HỆ SỐ EFFECTIVE-DATED (Cách 2, mig `202608012350`):** hệ số áp dụng TỪ tháng nào (`hoc_sinh_he_so` hieu_luc_tu). Billing (`getPhieuAo`/`listHocPhiTheoMonV2`) dùng `heSoHieuLucBatch(hsIds, ky)` = entry ≤ ky mới nhất (else 1). `setHeSoHieuLuc` (upsert + sync denormalize). HeSoTab: "Áp dụng từ" mặc định THÁNG SAU (luật đủ-1-tháng). `hoc_sinh.he_so_hoc_phi` = denormalize hiển thị. Backfill 58 HS≠1 hiệu lực 2026-07-01.
- **✅ Học phí tổng = CARD** (bảng→grid card, mỗi PH 1 card mở-mặc-định + thu-gọn): chốt=CHECKBOX(+confirm) · trạng thái=toggle bar Chưa báo/Đã báo/Đã thu + filter tabs · "Đã thu"→ô nhập số tiền mặc-định=còn-lại (thiếu tự thành nợ) · optimistic KHÔNG refresh cả màn · card hiện CHI TIẾT từng dòng như phiếu (`listChiTietTheoPH` batch, chốt→hoa_don_dong). Cột Học sinh + search theo tên HS. Bỏ PDF.
- **✅ TÍN DỤNG GIỚI THIỆU (mig `202608020010`):** người cũ giới thiệu HS mới → `hoc_phi_tin_dung`(so_tien mặc định 500k, hieu_luc_tu, hoc_sinh_moi_id) trễ 1 tháng, người nhập tay. Billing dòng `giam_gioi_thieu` (âm) = −min(tín-dụng-còn-lại, học-phí-tháng); trừ trải đến hết (còn lại = Σ cấp − Σ đã-trừ-ở-hoá-đơn-chốt). Tab "Giới thiệu" nhập/xoá. `hoa_don_dong.loai` +giam_gioi_thieu.
- **CÒN (chờ có hoá đơn CHỐT mới verify E2E được):** phiếu-thật/app-PH/tab-nợ(hệ thống) CHỜ ERP có hoá đơn chốt. Roll-up CFO + RBAC role Kế toán chưa làm. ⚠ latent `.limit()` cắt cụt: `noChiTietTheoPH`/`listPhieuTheoKy` query `thanh_toan`/`hoa_don_dong` `.in(hdIds).limit(LIMIT)` — paginate khi >2000.

### Đã build (GIAO VIỆC & HIỆU SUẤT + DASHBOARD VẬN HÀNH — 07-05, spec `BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md`)
- **Audit trước khi code lộ spec SAI GIẢ ĐỊNH:** spec tưởng đã có "cơ chế lương (`luong_bac`/EXP→Xu)" để hoà vào — SAI, đó là cơ chế **CỦA HỌC SINH** (gamification), KHÔNG có bảng lương nhân sự nào trong ERP. Thùy xác nhận: lương NS hiện tính NGOÀI hệ thống (mỗi người 1 base riêng), EXP→cấp-bậc cho NS cũng CHƯA có. **Scope v1 THU HẸP theo Thùy chốt:** ưu tiên đo hoạt động + giao việc phát triển; **HOÃN** lương/cấp bậc/Promotion Gate/skill-matrix (spec §5-8) tới khi có nền lương NS.
- **Giao việc phát triển** — mig 0080: `loai_viec`(registry·phương_thức_chấm·**thang_kl** bảng định lượng tự cấu hình)·`viec`(instance, khối lượng CHỐT LÚC GIAO·trạng_thái giao→dang_lam→cho_nghiem_thu→dat/tra_lai)·`viec_nguoi_lam`(junction 1-N)·`viec_log`+trigger ghi vết. Leaf `giaoviec` (Core team, slot có sẵn `fixtures.ts`) — 3 tab **Việc tôi làm** (bấm hoàn thành) · **Việc tôi giao** (giao mới + Nghiệm thu: chốt tiến độ+chất lượng+**bằng chứng bắt buộc** trừ `task_nho`) · **Loại việc** (cấu hình). `listNguoiDuocGiao` **TÁI DÙNG `getMyScope`** (span-of-control cây `vi_tri`) — không dựng lại RBAC riêng. Hiệu suất kỳ = **pure-derive** (Σ(kl×%)/Σkl, không lưu bảng, tính lúc đọc — giống `getPhieuAo`/mastery).
- **⭐⭐ Dashboard "Chất lượng vận hành"** (leaf `db_chatluong`, nhóm Dashboard/founder-only) — đo hoạt động **VẬN HÀNH ĐÃ CÓ** (điểm danh/chấm ET/chấm BTVN/đánh giá+chấm-lớp), KHÁC `viec` (task giao mới). `listAllStaffTasks` (`gami.ts`) = TÁI DÙNG đúng invariant `getMyTasks`, batch cho MỌI nhân sự 1 lần (không N+1). **4 tầng trên (Thùy chỉnh 3 lần mới đúng ý):**
  - **Theo người** — chọn 1 người → TẤT CẢ nghiệp vụ của họ (mọi team họ thuộc) side-by-side, biết mạnh/yếu chỗ nào.
  - **Theo mục** — chọn mục = **Tất cả/Ops/TA/GV** → kết quả CHUNG mọi người trong mục (biết ai xuất sắc nhất 1 nghiệp vụ).
  - **Chi tiết** — hiện HẾT mọi task (card), filter theo NGƯỜI và/hoặc MỤC (KHÔNG theo trạng thái đạt/chậm — số đó chỉ hiện TĨNH góc phải).
  - **Duyệt chất lượng** (mig 0081+0082, `viec_van_hanh_duyet`) — mỗi task XONG cần 1 lượt duyệt mới CHÍNH THỨC (anti-NULL: chưa duyệt = KHÔNG có dòng, không insert "cho_duyet" rỗng trước). **Người duyệt: mặc định cấp trên theo cây (`getMyScope`) — RIÊNG "Chấm bài trên lớp" của TA thì GV CỦA CHÍNH LỚP ĐÓ duyệt** (phạm vi lớp ghi đè cây tổ chức, vì 1 TA trợ nhiều lớp/GV khác nhau). **Tiến độ** = máy ĐỀ XUẤT theo 4 mức trễ-hạn (Đúng hạn=100 · Chậm 1(trễ<12h)=90 · Chậm 2(12-24h)=80 · Chậm 3(≥24h)=70), người CHỐT — đổi khác đề xuất **BẮT BUỘC ghi lý do** (chống nhân sự tự sửa hiệu suất cho nhau, validate NGAY TẦNG DATA không chỉ UI). **Chất lượng** mặc định 100%, quick-pick 100/95/90/85/80 (1 click, gõ tay nếu khác). **Hiệu suất = TỰ SINH** (avg tiến độ+chất lượng, snapshot lúc duyệt, KHÔNG ai điền tay). Duyệt từng task hoặc **hàng loạt theo đề xuất máy** (đa số giống nhau, cadence=daily). Đã duyệt → mọi view khác ưu tiên hiện số CHÍNH THỨC thay số tự động (tiến độ/chất lượng/hiệu suất). Card row gọn CHIỀU NGANG (1 hàng/task: tên+ngày+lớp · 4 nút tiến độ · 6 ô chất lượng · hiệu suất+nút Duyệt cuối hàng) — không phải card cao (Thùy chỉnh: "1 màn hiện được nhiều").
- **CÒN:** OPS điểm danh vẫn TEAM-WIDE (chưa per-person — `buoi_hoc_hs` không lưu "ai điểm danh", cần migration nếu muốn tách) · lương/cấp bậc/Promotion Gate/skill-matrix (spec §5-8, chờ nền lương NS) · trọng số trách-nhiệm-thường-trực + review-hiệu-chỉnh-khối-lượng-neo-bằng-chứng (spec §4) · 3 ý đề xuất thêm chưa làm (cột "% đã duyệt" độ-phủ-review · badge nhắc "đang chờ bạn duyệt" · loại trừ vài task khỏi "Duyệt tất cả") — chờ Thùy chọn có cần không.

### Quyết định & quy ước (đừng vô tình phá)
- **3 tầng, BỎ Chương** (Chủ đề→Chuyên đề→Dạng).
- **Bậc lớp S>A>B>C** (`bac_toi_thieu` FK `lop_bac`, thu_tu S=4…C=1): bậc THẤP NHẤT còn học dạng; lớp T học D ⟺ thu_tu(T)≥thu_tu(D). **ĐỘC LẬP `muc_do`(1–5)**. ⚠ Đừng nhầm `bac_toi_thieu` với `khoi`.
- **Mã vị trí**: Chủ đề `0701` · Chuyên đề `070101` · Dạng `07010103` · Câu `07010103001` (STT 3 số, client max+1, append-only). **Chỉ `ma_dang` là FK-target ổn định** → sửa dạng KHOÁ mã. `ma_chu_de`/`ma_chuyen_de` là denormalize — nhưng `dai_chuyen_de_ly_thuyet` GIỜ khoá theo `ma_chuyen_de` → tránh đổi mã chuyên đề đã có lý thuyết.
- **⭐ GU UI STAFF = "Apple-clean" (Thùy CHỐT 06-23 — MỌI màn staff sau bám theo, KHÔNG sci-fi):** nền XÁM `#f5f5f7` + card TRẮNG `rounded-2xl shadow-sm` (hover `shadow-md` + nhấc nhẹ), viền tối thiểu + **accent màu trái** `border-l-4` theo loại. **Nguyên tắc: card trắng PHẢI có nền xám** (tương phản) — CẤM trắng-trên-trắng. Trạng thái = **pill MỀM** (bg -50/-100 + text -700 + viền -200), KHÔNG khối đặc chữ-trắng; khẩn cấp nóng→nguội **đỏ(quá hạn)→cam(sát)→hổ phách(gần)→xanh(còn nhiều)** — 1 sắc đỏ DỊU (red-50/red-700). Metric = card trắng + **SỐ màu**. Tiêu đề ~22px semibold · nav/chip ~14px · 2 độ đậm · sentence case · tên quan trọng KHÔNG truncate. Phân khu = thanh màu + chữ đậm + kẻ dọc; lưới `auto-fit` lấp ngang. Accent chính **indigo**. Muốn "đẹp hơn" → **dựng mockup (visualize) duyệt TRƯỚC**. Mẫu chuẩn = màn `viec` (`NhanSuHome.tsx`). Chọn bậc/độ-khó = segmented 1-click. [HS-facing = GAME, khác hẳn.] (memory `staff-ui-no-scifi`.)
- **⭐ RBAC (gốc rễ "ai thấy task nào"):** task pure-derive mang nhãn (loại việc × lớp) → lọc qua `getMyScope`. **2 trục TÁCH:** (A) task-scope = ai LÀM (phan_cong_lop) / NẮM (cây vị trí, span-of-control 2 tầng) · (B) data-scope = ai XEM data (GV xem dashboard lớp mình). **Quyền quản lý đến từ GHẾ (vị trí Trưởng/Phó), KHÔNG từ vai** (GV chỉ phối hợp, quản 0 người). Loại việc gắn `phan_cong_lop.vai_tro` (gv→đánh giá/nội dung·tg→chấm·ops→điểm danh toàn hệ). **TG ôm TOÀN BỘ chấm 1 lớp** (ko tách task). Mọi màn LỌC qua engine này, KHÔNG viết lại quyền mỗi nơi.
- **⭐ Khối là TEXT, vocab chung {4,4T,5,5T,6..12}** — 4T/5T là KHỐI riêng (KHÔNG phải hệ); ≥6 chỉ S/A/B/C. Tên lớp: số+T(chỉ 4/5)=khối, S/A/B/C=hệ, V/E/K=môn.
- **⭐ CẤM dropdown cho list dài** (người/HS/lớp) → luôn dùng `SearchSelect` (combobox bỏ-dấu). Dropdown chỉ cho enum ngắn cố định (trạng thái/bậc/thứ/vai).
- **⭐ Buổi học = pure-derive, đẻ dòng khi MỞ** (không cron). Elo cần cùng-lớp-cùng-lúc (thường/ET/MT); bù/bổ trợ → EXP sàn, không Elo. Quản lý đến từ GHẾ không từ vai. EXP chỉ INSERT cộng dồn.
- **Mọi hành vi HS phải ghi vết:** bảng dính HS thỏa 1 trong 2 — (a) sự-kiện append-only có hoc_sinh_id+thời điểm, HOẶC (b) trạng-thái mutable + TRIGGER log §4 (như `hoc_sinh_lop_log`). Lịch sử học tập HS = UNION các bảng sự kiện theo thời gian (KHÔNG đẻ bảng "lịch sử" riêng).
- **AI import**: 1 prompt/loại câu format-tolerant (KHÔNG multi-prompt-select). **Gemini input ưu tiên PDF** (đa trang + text layer); ảnh chỉ khi 1 trang & nét ≥300DPI; khó đọc → model Pro.
- **⭐ 1 MÀN (spec gốc):** không tách Admin/Nhân sự. Vận hành ở "Việc của tôi", phát triển = các màn role-cấp trong CÙNG 1 cây nav. Người đội nhiều vai thấy 1 màn.
- **⭐ Feature-access (lớp ①) ≠ task-scope (②) ≠ data-scope (③):** ① = role→màn (ai mở màn nào, bám VỊ TRÍ qua `vai_tro_id`, UNION các ghế, `la_admin` bypass); ② = getMyScope (ai làm/nắm task); ③ = xem data lớp nào. **team ≠ ghế** — role bám ghế, gán ở Phân quyền tab "gán role cho vị trí". Quyền load lúc LOGIN → đổi role phải đăng nhập lại.
- **⭐ ĐO LƯỜNG (ADR Notion):** 1 buổi = **5 phần** (điểm danh/đánh-giá-GV/chấm-bài-trên-lớp/ET/**BTVN**). Đơn vị đo = test mỗi BÀI · buổi = 1 verdict GV/dạng (formative→summative). Điểm {0/0.5/1} (chỉ kết quả; trình bày+tốc độ cho Elo). Mastery = TB X lần gần nhất, suy động không lưu. Câu: trong buổi/đề không trùng (cứng) + least-used (mềm).
- **⭐ BTVN = THAM KHẢO, KHÔNG vào mastery/Elo** (home/không giám sát, không chuẩn 100%): chấm Đ/C/S chỉ để xem + thưởng EXP hoàn thành. Tín hiệu TIN duy nhất từ BTVN = **báo động `canh_bao_yeu`** TA tự bật ("HS X kém dạng Y") → nguồn "ai cần hỗ trợ". Đúng §5: data thô yếu không vào công thức, chỉ **người-confirm** thành tín hiệu. (Tương lai mastery engine: lọc `phase='btvn'` ra.)
- **⭐ NGUỒN LỜI GIẢI `nguon_giai`** (nguoi/ai): lời giải AI (clone / luồng "AI giải") = `ai` (cần duyệt), bóc-từ-tài-liệu/người = `nguoi` (tin). Phục vụ review + vision AI quản kho. **AI→JSON luôn dùng `responseSchema`** (mọi call, không sót hàm).
- **⭐ ET ↔ buổi qua (lớp+ngày)** KHÔNG FK buoi_hoc.id (lúc tạo buổi còn ẢO); ET độc lập giáo trình (pick dạng/câu riêng — buổi thực lệch tài liệu). ET là con của hub "Làm tài liệu".
- **⭐ TÀI LIỆU 2 tầng — phát triển vs vận hành:** master (giáo trình loai='giao_trinh', không buổi) = PHÁT TRIỂN (viết cho cả chuỗi). **Trích xuất buổi** (cấp giáo trình, chọn lớp→gán từng buổi vào ngày) sinh **doc con bám (lớp+ngày)** loai='giao_trinh_buoi'/'btvn' = VẬN HÀNH (in cho HS/gửi PH/in lại). Doc con ghi `nguon_id`+`nguon_buoi` → hiện trạng thái đã-gán per-lớp. Form/loại = thuộc tính HIỂN THỊ per-doc, KHÁC loai_cau kho. **Kho tài liệu** = bảng tổng (tra/tái dùng) khác "Làm tài liệu" (soạn). [06-17: leaf Kho = `tl` ngoài Danh mục, KHÔNG còn `lamtailieu:kho`.]
- **⭐ 3 HỆ ĐIỂM TÁCH BẠCH (ADR thành tích):** **Level** = tích luỹ thành tựu sát hạch (Σ verdict 13 kì thi × hệ số, max 21/mùa/môn, KHÓ NHẤT, reset mùa, nổi nhất) · **Elo+Hạng** = phong độ (Elo liên-tục KHÔNG reset) · **EXP→Xu** = LƯƠNG tháng (EXP reset THÁNG → tra `luong_bac` ra xu; EXP KHÔNG nuôi Level). Mùa = niên khóa (1/7). Profile per-môn, showcase HS. Reset = windowing (không xoá). MT = 1 sự kiện 3 vai (Elo+Level+vượt-band).
- **⭐ TÀI LIỆU clone/nhập = tách EXTRACTION vs GENERATION:** hình & ký hiệu = ĐỌC đúng cái có sẵn (crop ảnh **400 DPI** PNG lossless, chuẩn hoá ⋮→`\vdots`); sinh biến thể = TẠO mới đúng (cần suy luận + tự-kiểm; dạng tính toán LLM hay sai). **Hình = ảnh GỐC cắt** (anh_de cho câu · markdown `![](url)` cho lý thuyết, KHÔNG migration); **dạng có hình KHÔNG clone-đổi-số** (hình lệch số). **LLM KHÔNG vẽ lại được hình toán** (AI-redraw bịa số/đồ thị — nét hơn = TĂNG DPI render, KHÔNG redraw). **Bảng biến thiên/xét dấu = HÌNH cắt**, KHÔNG dựng `\begin{array}` (vỡ).
- **⭐ NHẬP KHO ingest-first (màn `nhapkho`):** scope = **CHỦ ĐỀ** (không ép chuẩn-hoá xuống chuyên đề) · **1 người/1 phiên → client-state, KHÔNG draft** (draft để dành đề-thi) · **verify ≤2 vòng, người vòng cuối** (cao-conf 0 verify · thấp 1 verify đọc lý thuyết) · đúng/sai per-mệnh-đề-1-dạng · **AI auto-tag dạng + confidence, người confirm** (moat §5) · **precision@1** = final=ai/tổng, log `kho_tag_log` (1 bảng = metric + nguồn distiller sau) · preview-first (✎ Sửa mới ra code LaTeX). Đừng lẫn với "nhập chuỗi câu" per-dạng (DangHub) — cái đó vào SẴN 1 dạng.

### Đã build (07-06 — Dashboard Chất lượng vận hành: tab "Theo người" + fix công thức hiệu suất)
- **UI "Theo người" (`ChatLuongVanHanhScreen.tsx`):** sidebar trái = list TẤT CẢ nhân sự (search-filter, click đổi, thay dropdown) + header = profile người chọn (avatar/tên/mã NS/chip team, `getNsProfileMini` mới trong `vanhanh.ts`) + lưới card bên phải **1 card/nghiệp vụ** (số TO = Hiệu suất trung bình, số nhỏ = Đạt/Chậm/Chưa xong — **nguyên tắc size-hierarchy áp cho MỌI dashboard sau**: to=tổng quan, bé=chi tiết, chỉ soi bé khi to có vấn đề). Click card → **popup** tái dùng nguyên `TaskCard`/`layChiTietTasks` của tab Chi tiết (KHÔNG đẻ mục "chi tiết" riêng).
- **⭐ Công thức hiệu suất CHỐT LẦN CUỐI (3 vòng sửa trong ngày, xem ② để tránh lặp bug):** **Tiến độ** = máy đề xuất theo giờ trễ (`deXuatTienDo` cho task đã xong · `tienDoNeuXongBayGio` — số SỐNG, tụt dần theo thời gian — cho task CHƯA xong, so hiện tại với deadline) · **Chất lượng** = CHỈ leader duyệt tay mới chính thức, mặc định 100% khi chưa duyệt (áp cho MỌI task chưa duyệt, kể cả chưa xong) · **Hiệu suất = Chất lượng − phạt tiến độ** (`tinhHieuSuat`, phạt = 100−tiến độ, KHÔNG PHẢI trung bình cộng — vd Chậm 3 + Chất lượng 90 → 90−30=60%). `daDuyet` là cờ DUY NHẤT phân biệt số CHÍNH THỨC (snapshot lúc duyệt) vs số DỰ KIẾN/SỐNG (preview, đổi liên tục) — UI luôn gắn nhãn "(đề xuất)/(mặc định)/(dự kiến)/(sống)" cho case chưa duyệt.
- **Đã xoá bỏ:** cách tính "chất lượng" cũ suy từ tỉ lệ HS làm đúng ET/mức chấm ingame (SAI bản chất — đó là kết quả học tập của HS, không phải chất lượng làm việc của TA) — bỏ luôn 4 query roster/grades/btvn/danhgia không cần trong `layChiTietTasks`, code gọn hẳn.

### Đã build (07-06 phiên 2 — Ops vận hành spec: Report/Tan/Prep · mobile shell staff · fix Bổ trợ Đuổi · trùng tên HS)
- **⭐ OPS VẬN HÀNH — 3 story pure-derive** (`BKDEMY_OPS_SPEC_DETAIL.md`; Story 4 "Scan ET" **GÁC LẠI**, chưa làm): mig 0084 `phan_cong_ops` (spine effective-dated `hieu_luc_tu/den` — CÙNG pattern TKB, phân công theo TUẦN nhưng KHÔNG có bảng "tuần" nào phải freeze, gán 1 lần `hieu_luc_den=null` là mọi tuần sau tự đọc đúng người tới khi ai đổi tay) · mig 0085 `vh_ops_task` (Story 1 Report-trước-buổi + Story 2 Báo-tan) · mig 0086 `prep_phong` (Story 3 Prep/Chuẩn-bị-phòng). Service `src/lib/opsvanhanh.ts`: `getMyOpsTasks`/`getMyPrepTasks` derive theo TKB×phân-công (không đẻ dòng chờ) · `listOpsStaff()` lọc picker chỉ team Ops (join `nhan_su_team`×`team.ma='ops'`, có fallback giữ hiện tên người ĐANG gán dù đã rời team). 3 leaf mới: `PhanCongOpsScreen` (lưới card gán ca, không phải bảng-dòng) · `OpsReportScreen` · `PrepScreen`.
- **⭐ Tích hợp vào "Việc của tôi" (KHÔNG tách UI riêng mãi):** `getMyOpsTasks`/`getMyPrepTasks` gộp vào CÙNG `dayGroups` theo-ngày của `VietCuaToi` (NhanSuHome.tsx) qua card `OpsExtraCard`/`PrepTaskCard` — bấm card **điều hướng sang màn chi tiết** (nơi có đủ copy-tin-nhắn/chụp-ảnh/đóng), KHÔNG mở popup tại chỗ như TaskCard. Chip filter **chia THEO VAI** (`OPS_CHIPS`: Điểm danh/Report/Báo tan/Chuẩn bị phòng · `GVTA_CHIPS`: Chấm bài/ET/BTVN/Đánh giá — GV/TA chip cũ lỡ hiện cho Ops là bug, đã tách theo `scope.opsToanHe`/`scope.trucTiep.length>0`).
- **⭐ Bug report SAI NGÀY (2 vòng sửa, xem ② để tránh lặp):** report phải hiển thị/đến-hạn TỐI HÔM TRƯỚC ca học (`ngayReport=congNgay(ngayHoc,-1)`), không phải ngày diễn ra ca. Vòng 1 chỉ sửa 1 chiều (hôm nay=cuối-tuần→thấy report ca-mai) quên chiều kia (hôm nay=ĐẦU-tuần→report-từ-hôm-qua vẫn phải hiện, hôm qua đó lại thuộc TUẦN TRƯỚC theo lịch) → bộ lọc `ngayReport>=tu` (đẻ ra để tránh trùng khi xem tuần liền kề) vô tình loại đúng ca này. Fix thật: bỏ hẳn lower-bound, chỉ giữ `ngayReport<=den`; nới `doneRows` query lùi 1 ngày trước `tu`. Verify bằng script replay thẳng logic trên data thật (không đoán).
- **⭐ Sửa Bổ trợ Đuổi — "Hoàn thành khóa" ≠ "Hoàn thành buổi":** đúng flow, bổ trợ đuổi chỉ KẾT THÚC khi bấm "Hoàn thành khóa" (case-level, `bo_tro_duoi`) — trước đó bấm "Hoàn thành buổi" (đóng đánh giá) lại vô tình coi như xong khoá, không đưa HS về lại hàng-chờ-xếp. Fix: 2 nút tách bạch rõ + nút "Hoàn thành khóa" bump từ viền nhạt → nền đặc (cùng trọng lượng thị giác với "Xếp buổi đuổi", khác màu phân biệt hành động chấm-dứt vs tiếp-tục) + chú thích cạnh badge "✓ Buổi đã hoàn thành" giải thích HS chưa bấm khoá tự quay lại "Cần đuổi".
- **⭐ Mobile shell cho STAFF (trước giờ chỉ HS-facing có, staff luôn giả định desktop):** `App.tsx` huỷ `zoom:1.15` khi `useIsMobile()` (cùng trick HocSinhApp) · `NhanSuHome.tsx` sidebar 240px→**top bar (☰+tên màn) + drawer trượt** trên mobile, nút **"‹ Việc của tôi"** quay-về-nhà không cần mở lại drawer · `Metric`/card (`OpsBuoiCard`/`TaskCard`/`OpsExtraCard`/`PrepTaskCard`) thêm nhánh `compact` (nén 2-3 dòng → 1 hàng, chỉ 2 info chính: loại việc + lớp) · **gấp ngày TƯƠNG LAI** thành 1 dòng bấm-để-mở (hôm nay+quá-khứ-còn-nợ mở sẵn) — áp **CẢ desktop lẫn mobile** (nguyên tắc mật độ thông tin, không riêng màn hình bé) · `OpsReportScreen`/`PrepScreen` thêm `capture="environment"` (mở thẳng camera sau) + ẩn nút "Dán ảnh" trên mobile (clipboard-read không ổn định Safari iOS).
- **⭐ Ops KHÔNG dùng UI chấm-bài-như-TA:** `BuoiHocScreen` mở buổi từ leaf "Buổi học" giờ so `lop_id` với `me.phanCong` — chỉ gv/tg CỦA CHÍNH lớp đó (hoặc admin) mới thấy đủ 4 tab; người khác (kể cả Ops) chỉ thấy tab Điểm danh (`canManage` vẫn giữ nên Ops vẫn Huỷ-buổi/đổi-GV được).
- **Bug Prep — đóng task xong card vẫn hiện chưa đóng:** `LuotCard` (PrepScreen.tsx) giữ state `row` RIÊNG, 3 hàm `tick`/`cham`/`chot` đều tự `setRow()` sau ghi nhưng `dong()` QUÊN — vì key card không đổi nên React không remount, state cũ (`dongAt=null`) tồn tại dù DB đã đúng. Fix: thêm `setRow(await getPrepRow(...))` vào `dong()` giống 3 hàm kia.
- **⭐ TRÙNG TÊN HS trong danh sách lớp → bung đủ họ tên (Thùy chốt):** hàm mới `tenHienThiDs()` (`src/lib/hoten.ts`) nhận mảng họ-tên 1 DANH SÁCH, trả mảng song song — chỉ người TRÙNG tên-rút-gọn (2-từ-cuối, ≥2 người CÙNG danh sách) mới bung đủ họ tên, người không trùng vẫn rút gọn như cũ. Áp cho MỌI nơi hiện danh sách HS (roster buổi/lớp, bảng Elo/Level/Thành tích, preview tên trong card buổi bù/đuổi — tính riêng THEO TỪNG CARD, gợi ý trùng ở Duyệt chấm). **CHỦ ĐỘNG bỏ qua** component xem-1-HS-đơn (không ai để so trùng tại chỗ) và câu thông báo điền-tên (không phải danh sách).

### Schema (DB live — `npm run schema` ghi `schema.md`, KHÔNG sửa tay)
- `lop_bac` (S/A/B/C, thu_tu) seeded.
- `dai_ban_do`: ma_dang(PK)·khoi·ma_chu_de/ten·ma_chuyen_de/ten·ten_dang·muc_do·bac_toi_thieu(FK)·created_at. (DROP ma_chuong.)
- `dai_cau_hoi`: ma_cau(PK)·dang_chinh·loai_cau·noi_dung·dap_an·loi_giai·lua_chon(jsonb)·anh_de·anh_dap_an·nguon·parent_ma_cau·clone_method.
- `dai_dang_ly_thuyet`: ma_dang(PK)·noi_dung·file_url?·ten_file?. `dai_chuyen_de_ly_thuyet`: ma_chuyen_de(PK)·noi_dung·file_url?·ten_file?·**khong_can**.
- **Tài liệu**: `tai_lieu`(id·**loai**[giao_trinh|giao_trinh_buoi|btvn|et|de_thi|bo_tro…]·ten·khoi·ma_chuyen_de?·theme·**cau_hinh** jsonb[header/footer/mau·btvnLinesByCau·etFormByCau]·**lop_id?·ngay?**[ET/doc trích bám buổi]·**nguon_id?·nguon_buoi?**[doc trích ↔ master+buổi]·created_by) · `tai_lieu_phan`(tai_lieu_id·thu_tu·loai_phan[**buoi**|dang|btvn|custom|lt_chuyen_de]·ref_ma·tieu_de·noi_dung) · `tai_lieu_cau`(phan_id·ma_cau·thu_tu). (Giáo trình master: Buổi→Dạng→BTVN, lop_id null. ET: 1 phan `custom` câu-theo-thứ-tự. Trích xuất: giao_trinh_buoi=marker+dang · btvn=marker+btvn, bám lop_id+ngay.)
- `hinh_ban_do` (+bac_toi_thieu) + bảng Hình/danh mục như `spec-kho-v2.md`.
- **Khối static:** `nhan_su`(+ma_ns·anh_url) · `tai_khoan`(id=auth.uid→nhan_su) · `team`(seed 6) · `nhan_su_team`(biên chế n-n) · **`vi_tri`**(team_id·ten=chức vụ·cap·**cha_id→vi_tri**·nhan_su_id NULL=trống) · `lop`(ten_lop·mon·khoi·bac·co_so·**ngay_khai_giang**) · `phan_cong_lop`(ns×lop×vai_tro gv/tg·la_chinh) · `hoc_sinh`(ma_hs·khoi·dia_chi·truong_hoc·phu_huynh_id·anh_url·trang_thai+`tot_nghiep`) · `phu_huynh`(ma_ph) · `hoc_sinh_lop`(hs×lop·**muc_nang_luc_id**·**ngay_vao/ngay_roi**·trang_thai) · `hoc_sinh_lop_log`(TRIGGER ghi vết §4) · `thoi_khoa_bieu`(lop·thu·giờ·hieu_luc_tu/den) · `muc_nang_luc`(12 mức). (`thanh_vien_team` DROP ở 0022.)
- **Bảng GAMI/buổi:** `buoi_hoc`(+danh_gia_xong_at·ingame_dong_at·et_dong_at·**btvn_dong_at**)·`buoi_hoc_hs`(điểm danh + bu_cho_buoi_id)·`gami_session_problems`(+ma_dang·**unique** buoi,phase,problem_no; phase ∈ ingame/et/mt/**btvn**)·`gami_grades`(+muc 1-5·loi jsonb)·`gami_elo`(unique hs+mon)·`gami_elo_history`(+mon)·`gami_exp_ledger`(+mon; source: rank_*/attend_floor/**btvn**). **Đánh giá:** `buoi_danh_gia`·`buoi_danh_gia_dang`(diem∈{0,0.5,1}). **BTVN:** `btvn_ket_qua`(+**trang_thai_nop**·**thai_do**) · **`canh_bao_yeu`**(HS×ma_dang×buổi, tín hiệu "kém dạng" người-confirm). **Câu:** `dai_cau_hoi.nguon_giai`(nguoi/ai). ⭐ **Elo: 2 cái/buổi (lớp ingame + ET) độc lập, tính từ Elo TRƯỚC buổi, cộng dồn delta; per-môn. EXP hoà = TB bậc nhóm.**
- **Bảng RBAC:** `vai_tro`(role) · `vai_tro_chuc_nang`(role→chuc_nang=leaf-id) · `vi_tri.vai_tro_id` · `nhan_su.la_admin_he_thong`(Founder).
- **Chiều MÔN:** `nhan_su_mon`(nhan_su_id×mon, mig 0056 — scope④ content, gate kho) · `vi_tri.mon`(mig 0057 — ghế chuyên môn thuộc môn; null=liên-môn) · `tai_lieu.mon`(mig 0058, chuẩn hoá 'Toán'/'KHTN' — dispatch kho `khoCuaMon`). mon = nhãn `MON_LIST` (Toán/KHTN/Tiếng Anh/Văn, `src/lib/mon.ts`). **MÔ HÌNH: mỗi môn = trung tâm riêng (ADR-mon.md §1.6) — content per-môn, KHÔNG gộp.**
- **Bảng THÀNH TÍCH (mig 0042/0043):** `gami_elo_history`+**rank**/**rank_total** · `ky_thi`(loai·he_so·dot·mua·`buoi_hoc_id?`) · `diem_thi`(ky_thi×hs·diem·band_luc_thi·verdict·vuot_band) · `muc_nang_luc`+**diem_ky_vong** · `thanh_tich_loai`(catalog, seed 12) · `hoc_sinh_thanh_tich_ghim` · `luong_bac`(seed 7 PROVISIONAL) · `btvn_ket_qua`. **Level/Xu/thành tích = SUY ĐỘNG** (không bảng riêng).
- **Bảng TEST ONLINE (mig 0063–0069, 0073):** `tai_khoan.hoc_sinh_id` · `bai_test`(loai **et/btvn/giao_trinh/de_thi**·so_cau·khoa_reveal·deadline) · `bai_test_cau`(snapshot đề+`dap_an_key`+loi_giai+anh_dap_an+ma_dang+ly_thuyet) · `bai_lam`(1 HS/test, dang_lam/da_nop) · `bai_lam_cau`(dap_an_hs·verdict·diem·cham_boi; FK→bai_test_cau CASCADE) · `bai_test_report` · `question_accepted_answers`(+`increment_qaa_hit`). Functions: `my_hoc_sinh_id()`/`hs_o_lop(uuid)`/`et_de(uuid)`(mở rộng 0073: `bt.loai in ('et','de_thi')`)/`et_nop(uuid)`(v4 mig 0070: thêm tầng cache trả-lời-ngắn)/`tln_norm(text)`/`tln_cache_check(text,text)`(mig 0070). RLS: staff member-gate + HS-scoped riêng; bai_test_cau HS đọc CHỈ non-thi (loại ET + đề thi).
- **✅ Bucket storage — XONG (07-09).** 07-07 phát hiện `supabase.storage.listBuckets()` (anon key) trả RỖNG → hoá ra **false alarm 1 phần**: verify lại bằng service-role key thì `kho-anh`(08/06)/`avatars`(11/06) **đã tồn tại từ lâu**, chỉ `kho-tailieu` thật sự thiếu — Thùy đã tự chạy tay 3 block SQL (0007/0008/0020) trong Dashboard, giờ cả 3 bucket sống + đọc/ghi được qua đúng anon key app dùng. **Bài học (②): đừng dùng `listBuckets()` bằng anon key để chẩn đoán bucket tồn tại — RLS chặn SELECT trên `storage.buckets` (khác `storage.objects` có policy) → luôn trả rỗng giả. Dùng `SUPABASE_SERVICE_ROLE` hoặc test thẳng `storage.from(bucket).list()`.**
- **Migrations áp DB live (ĐỪNG chạy lại):** 0001–0019, 0021–**0088**. (…**0059** `tai_lieu_phan.kieu` (block, default 'thuong') · **0060** báo đèn · **0061** `kho_tag_log` (precision@1 + vòng-học nhập kho) + cột `mo_ta_ngan` · **0062** RPC `count_cau_by_dang(p_tbl)` (đếm câu theo dạng ở Postgres, trả jsonb 1 dòng — fix kho "0/50" do PostgREST cap max-rows) · **0070** `tln_norm`+`tln_cache_check`+`et_nop` v4 (cache trả-lời-ngắn) · **0071** trigger `hs_nghi_tu_roi_lop` (HS nghỉ tự rời lớp) + backfill · **0072 KHÔNG dùng** (số bị bỏ qua khi đặt tên file, không phải migration thiếu) · **0073** `bai_test.loai`+`et_de` mở rộng cho `de_thi` · **0074** học phí nền (muc_hoc_phi/muc_hoc_lieu·hoa_don·hoc_phi_xet_duyet…) · **0075** xoá `muc_hoc_phi.gia_duoi` → bảng `muc_hoc_duoi` riêng · **0076** xoá `lop.muc_hoc_duoi_id` → thêm `buoi_hoc.muc_hoc_duoi_id` (đuổi theo CA) · **0077** backfill mức mặc định lớp cũ (chỉ điền NULL) · **0078** `hoc_phi_phat_sinh` (lop/ca_nhan) · **0079** `hoa_don.trang_thai_tb` (3 bước thông báo) · **0080** Giao việc (`loai_viec`/`viec`/`viec_nguoi_lam`/`viec_log`) · **0081** `viec_van_hanh_duyet` (duyệt chất lượng vận hành) · **0082** thêm `tien_do`/`tien_do_de_xuat`/`tien_do_ly_do`/`hieu_suat` vào `viec_van_hanh_duyet`.) **0020 (bucket avatars) ĐÃ chạy.** Bucket: `avatars`, `kho-anh`, `kho-tailieu`. (Áp lẻ: `node scripts/_apply_one.mjs 00XX.sql` — truyền TÊN FILE, không kèm path; xong `npm run schema`.)
- **⭐ Tên migration MỚI = timestamp:** `npm run new-migration <ten_snake_case>` → `YYYYMMDDHHMM_ten.sql` (giờ VN). File cũ `0001..0115` giữ nguyên (`'0' < '2'` nên luôn sort trước). Lý do bỏ số tăng dần: cấp số bằng "nhìn file cuối +1" nên 2 luồng song song va nhau (07-21 va 2 lần, 4 file); `migrate.mjs` sort theo TÊN nên trùng số vẫn chạy **nhưng thứ tự do chữ cái quyết định** — gặp cặp *nới CHECK → siết CHECK* mà đảo là fail migrate-from-scratch.
- **Áp 1 migration lẻ:** `node scripts/_apply_one.mjs <file.sql>` (không chạy lại migrate.mjs). Replay lại toàn bộ Elo/EXP theo model mới: `node scripts/_replay_elo.mjs` (reset+dựng lại từ grades, theo thứ tự thời gian). Scripts `_diag_*`/`_chk*`/`_fix_*` = throwaway điều tra/dọn (đã chạy xong).
- **Functions/trigger:** `jwt_uid()/jwt_email()/la_thanh_vien()/self_link_account()` (RLS member-gate, 0026/0028) · **`my_quyen()`** (0032/0033 — trả {la_admin, chuc_nang[]} cho người gọi) · **`count_cau_by_dang(p_tbl)`** (0062 — jsonb {ma_dang:n}, security-definer, guard member) · trigger `log_hoc_sinh_lop`.
- **Data đã import (V1→V2, 2026-27):** 327 HS · ~46 lớp (đã lên lớp +1 khối) · 277 PH · ghi danh + 76 ca TKB. Scripts `import_v1*.mjs` + `len_lop_2026.mjs` (idempotent/guard).
- **V2 đã có bảng ĐỘNG:** buổi/điểm danh/chấm (gami) + đánh giá. **CHƯA có:** mastery engine (suy động từ grades+đánh giá — chưa code) · daily.

### Đã build (07-07 — Điểm danh test đầu vào)
- **⭐ `ca_test`** (mig 0088, RENAME từ 0087 — xem ② gotcha số trùng): entity THẬT (không phải task-derive) ghi nhận HS đến test đầu vào — `ung_vien_id` FK not null·`mon`·`ngay`·`gio_bat_dau`·`thoi_luong_phut`(check 45/60/75/90/120)·`trang_thai`(dang_test/hoan_thanh)·`bai_url`(1 file PDF/ảnh scan)·`hoan_thanh_at` + trigger log state. Chọn ứng viên L5 có sẵn → app set LUÔN `level='L6'` **NGAY LÚC TẠO ca** (Thùy chốt — có mặt = bằng chứng đủ, KHÔNG đợi hoàn tất). Walk-in chưa từng ở L5 → tạo `ung_vien` THẲNG L6 (bỏ qua L5).
- **Leaf RIÊNG `diem_danh_test`** (nhóm Vận hành, `DiemDanhTestScreen.tsx`) — TÁCH khỏi màn `tuyensinh` (OPS chỉ cần đúng việc điểm danh, KHÔNG cần thấy/sửa cả phễu L5-L8 — theo đúng precedent Report/Prep/Phân-công-Ops đã tách trước đó). Card đếm ngược tái dùng `vnInstant`/`mucDeadline`/`nhanConLai` (`tuan.ts`), khoá nút "✓ Hoàn tất" tới khi có `bai_url` (đúng luật evidence-trước-khi-đóng của OPS spec).
- **Lib:** `taoCaTest`/`listCaTestDangChay`/`listCaTestHoanThanh`/`uploadCaTestBai`(dùng thẳng `uploadKhoFile`)/`hoanThanhCaTest`/`listUngVienL5`/`getUngVien`/`gioKetThucCaTest` — tất cả ở `tuyensinh.ts` (cùng domain `ung_vien`).
- **⚠ CHƯA xong hẳn:** upload evidence CHƯA verify được thật lúc build (bucket lúc đó rỗng — **đã xong 07-09**, xem mục Bucket storage ở Schema). Có 1 dòng test rác (`ung_vien` UV0127 "Nguyễn Test QA" + `ca_test` liên kết) đang CHỜ Thùy gật xoá.

### Khởi động ở máy MỚI (về nhà)
1. `git pull`.
2. **Copy tay `.env` + `.env.local`** (gitignored → git KHÔNG có). `.env`: `DATABASE_URL`(claude_build, DDL) + `DATABASE_URL_RO`(claude_ro). `.env.local`: `VITE_SUPABASE_URL/KEY` + `VITE_GEMINI_KEY` + `SUPABASE_SERVICE_ROLE`(chỉ cho script provision tài khoản HS — KHÔNG bao giờ đưa vào code client/VITE_*). Thiếu = không kết nối DB.
3. `npm install` → `npm run dev` → http://localhost:5173.
4. **Đăng nhập** (vd `admin@gmail.com` = la_admin, thấy mọi màn). **1 MÀN duy nhất** — nav trái có Việc của tôi + leaf màn theo quyền (không còn tab Admin/Nhân sự, không còn DEV "xem với vai trò"). Kho ở **Danh mục → Bản đồ kiến thức**.
5. **ĐỪNG chạy lại migration / tạo lại bucket** — DB cloud dùng chung đã đúng. Đổi role 1 account → account đó phải **đăng nhập lại** (quyền load lúc login).

### Nguồn intent (Notion)
- Quyết định Kho chốt ở trang **"Kho — Bản đồ kiến thức · Quyết định build (ADR)"** (con của ERP V2). Notion = source of truth cho *intent*.
- **ADR Bảng thành tích & 3 hệ điểm (Level/Elo/EXP-Xu)** — [trang Notion](https://app.notion.com/p/381d4530bcdb819fb151c32f81007117) (con ERP V2). Chốt mô hình Level 21-điểm sát hạch · EXP→Xu · catalog thành tích.
- **ADR Bộ xử lý tài liệu (Document Ingest)** — [trang Notion](https://app.notion.com/p/384d4530bcdb815093a1d601c29c7bab) (con ERP V2). 4 KB chứa hình + engine chung + KB3 người-điền-dạng-tay + thứ tự build 2→3→4.
- **⭐ ADR Chiều Môn** — [trang Notion gốc 06-24](https://app.notion.com/p/389d4530bcdb81d1b700ff61afcc2faf) ⚠ **§3.1 "schema CHUNG, KHÔNG fork bảng" ĐÃ BỊ ĐẢO 06-29** → [trang cập nhật](https://app.notion.com/p/38fd4530bcdb813cbb2cc602dd962875) + repo `ADR-mon.md` + CLAUDE.md §1.6. **MÔ HÌNH CHỐT: mỗi MÔN = 1 TRUNG TÂM riêng (bounded context)** — content RIÊNG từng môn/nhánh, **KHÔNG gộp bảng** (gộp = ghép cứng domain độc lập, lợi ~0). 4 môn đối xứng; chung HS+vận hành. **Luật: mọi dữ liệu HỌC TẬP mang nhãn `mon`; chỉ phi-học-tập (HS cá nhân/PH/ví-xu/tài-khoản) mới chung.** Đơn vị độc lập = NHÁNH (Toán{Đại,Hình}·KHTN{Lý,Hóa,Sinh}). Symmetry test: `if mon==='Toán'` đặc biệt = sai. (Phần §3.1/§4 `kp_node`-gộp của ADR gốc = STALE.)
- **⭐ ADR Bổ trợ (Bù) · L1→L3** — [trang Notion](https://app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e) (con ERP V2, 06-23). Bù buổi nghỉ. **TÁI DÙNG** `buoi_hoc loai='bu'` + `buoi_hoc_hs.bu_cho_buoi_id` (link per-HS về buổi mẹ → 1 buổi bù gánh nhiều buổi mẹ). Funnel L1(cần bù=vắng chưa quyết)→L2(đã xếp)→L3(đóng ET+đánh giá) **PURE-DERIVE**; chỉ thêm bảng `bang_khong_bu` (khong_can_bu+lý do / khong_xep_duoc tái-thử-tay). **ET buổi bù = ET buổi MẸ per-HS** (gami_session_problems thêm `hoc_sinh_id`). Buổi bù: ngày+giờ+phòng+GV+TA gắn trên buổi; task = ET+đánh giá (mở `getMyTasks` cho loai='bu'); KHÔNG Elo; đóng phase cả buổi → L3. Khớp về mẹ = LINK query, không copy. Tổng quát cho yếu/đuổi/định-kỳ/ôn-thi. 5 loại bổ trợ: bù/yếu/đuổi/định-kỳ/ôn-thi (bắt đầu Bù).
- **⭐ ADR Phễu Tuyển sinh (Test đầu vào) · L5→L8** — [trang Notion](https://app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233) (con ERP V2, 06-23). Phễu stage-gate: **L5 đăng ký test → L6 đến test → L7 học thử → L8 chính thức**; L8 = `hoc_sinh` đang học. **Thực thể `ung_vien` RIÊNG** (không nhồi vào hoc_sinh), convert L7→L8 = tạo HS. Checklist 2 loại (chấm-bài DERIVE từ TA chấm test · còn lại tick tay). Drop-off = "Loại/Rớt + lý do". **CHỜ Thùy duyệt ADR + trả lời câu hỏi mở** (ai làm/role · lớp dự kiến gán đâu · nguồn lead · gộp PH · chấm-bài-test ADR riêng) → rồi build. Luồng chính nhập HS (nhập trực tiếp = ngoại lệ).

### Đã build (07-07 tiếp — 3 bugfix rời + tính năng MT)
- **Fix in mất 2-cột khi trích xuất/nhân bản:** `copyPhanInto`/`duplicateTaiLieu` (tailieu.ts) quên mang `kieu` khi copy phan sang doc mới → rơi về `'thuong'`. Đã thêm `kieu: p.kieu`; `copyPhanInto` đổi thành `export` (MT dùng lại). Data đã lỡ sai → re-trích/nhân bản lại là tự đúng (KHÔNG cần sửa DB tay).
- **Fix buổi bù hiện SAI TÊN DẠNG (Toán ra tên KHTN):** phát hiện **17 mã `ma_dang` trùng số giữa `dai_ban_do` và `khtn_ban_do`** (KHTN chưa seed dãy mã riêng KG/KC như ý định gốc) — `getDangTen()` gộp cả 2 bảng nên bảng sau đè tên bảng trước. Fix: `getDangTen(mds, mon?)` — có `mon` chỉ tra ĐÚNG 1 bảng; `BuoiBuDetail` tra theo môn CỦA TỪNG HS (1 buổi bù gom nhiều môn). ⚠ **CHƯA dọn gốc** (17 mã KHTN vẫn trùng số) — đã hỏi Thùy 2 hướng (để vậy vì đã né được / đánh số lại 17 mã), **CHƯA CHỐT**.
- **Fix thiếu task "Đánh giá buổi đuổi" ở Việc-của-tôi:** `getMyTasks()` từ trước tới giờ CHỈ route `loai='thuong'`/`'bu'`, **THIẾU HẲN `loai='bo_tro_duoi'`** (không phải bug riêng môn nào). Thêm nhánh GV (`nguoi_day`, không TA vì đuổi không có ET). `BuoiDuoiDetail` (BoTroDuoiScreen.tsx) trước giờ KHÔNG export + nhận `ca` đầy đủ → refactor nhận `buoiId` tự load (mirror `BuoiBuDetail`) + export ra, wire route ở `NhanSuHome.tsx`.
- **⭐ MT (kỳ thi lớn) — HOÀN THIỆN 07-08, đại tu kiến trúc so với bản 07-07:** MT master
  (`tai_lieu.loai='mt'`, độc lập, nhiều PHẦN kiểu ET, UI chỉnh dòng `etFormByCau`/`btvnLinesByCau`
  autosave `cau_hinh`) → "Gán vào buổi" **CHỈ hỏi Lớp + Ngày** (giờ/phòng/GV thuộc về buổi học, KHÔNG
  hỏi lại — tự tra TKB cho buổi mới, không có TKB hợp lệ thì để trống, OPS tự sửa sau) sinh MT
  instance (`tai_lieu loai='mt_buoi'`) + tìm/tạo buổi **THƯỜNG THẬT** qua `moBuoi` (KHÔNG còn
  `buoi_hoc(loai='mt')` riêng — MT giờ là 1 PHASE/TAB của buổi thường, **giống hệt ET**, cột đóng
  riêng `mt_dong_at` mig 0091). Gán MT → đóng NGAY đánh giá+ET của buổi đó thành N/A (buổi có MT chỉ
  1 hoạt động = kiểm tra, set thẳng cột KHÔNG qua closePhase để tránh tính Elo sai). Chấm MT = tab
  **"🏆 MT"** trong `BuoiDetail` (`BuoiHocScreen.tsx`, component `MTTab`) — bảng Đ/C/S GIỮ cấu trúc
  Phần (hàng nhóm colspan khớp file MT đã gán, KHÔNG làm phẳng câu), CHUNG roster/điểm-danh với
  Điểm-danh/Đánh-giá/ET/BTVN (hết cảnh 2 sổ điểm danh riêng). Đóng phase = Elo K=60 (cap ±40) + EXP
  theo bậc `RANK_EXP.mt`; buổi "hoàn tất" xét ĐỦ 3 phase (ingame+et+**mt NẾU buổi có gán MT thật**,
  tra `tai_lieu loai='mt_buoi'`). Task "Chấm MT" (Việc của tôi) CHỈ hiện cho buổi THẬT SỰ có gán MT
  (không spam task rỗng mọi ngày). **Mastery:** MT LUÔN feed vào mastery-per-dạng (`mastery.ts`
  `EvalSrc` thêm 'mt', không cần toggle như BTVN vì MT giám sát thật). **✅ VERIFY ĐẦY ĐỦ qua preview
  thật + DB (`claude_ro`)** nhiều vòng — xem DEVLOG 07-08 (tiếp 3→8) cho chi tiết. **CÒN THIẾU** (Print
  + nâng-cao-theo-hệ ĐÃ XONG, xem 2 mục ngay dưới):
  nối `ky_thi.loai='mt_sat_hach'` (Level/vượt-band) · luật sư phạm (tỉ lệ câu/độ
  khó/phủ chuyên đề) · `listAllStaffTasks`/dashboard hiệu suất chưa có nhánh 'mt' (giống bù/đuổi cũng
  thiếu — omission nhất quán, không phải regression mới) · bug nhỏ: re-gán MT khác nội dung lên
  CÙNG buổi không xoá problem cũ (chỉ seed khi buổi chưa có problem nào) → câu thừa nếu soạn lại đề
  nhiều lần trên cùng buổi (hiếm, chưa fix). (`MTBuoiDetail.tsx` nhắc ở đây trước — ĐÃ KIỂM: file
  KHÔNG tồn tại trên disk/git history, chưa từng commit → không có gì để xoá, hết orphan.)
- **⭐ MTPrintView — In MT bản HS/GV (XONG, xem DEVLOG 07-08 tiếp 9):** `MTPrintView.tsx` mới, bám
  `DeThiPrintView` (giữ nguyên cấu trúc Phần + thứ tự gốc) nhưng tôn trọng form-override như ET
  (`etFormByCau`) — câu TN bị ép hiển thị tự luận/trả lời ngắn thì KHÔNG lộ `lua_chon` (viết `MtCau`
  tách riêng, không dùng thẳng `CauItem`). Wire "🖨 In"/"⬇ Tải PDF" cho cả `mt` lẫn `mt_buoi` ở Kho tài
  liệu (bỏ cờ `PRINTABLE` cũ đang chặn MT) + nút trong `MTEditor`. Verify preview thật cả 2 loại câu +
  bản GV.
- **⭐⭐ MT — câu nâng cao TỰ LỌC theo hệ lớp khi gán buổi (Thùy chốt, XONG):** tái dùng `bac_toi_thieu`
  có sẵn của dạng (bản đồ kiến thức, KHÔNG đẻ cờ mới) — `ganMTVaoBuoi` so bậc lớp vs bậc dạng mỗi câu,
  câu không đủ tư cách tự loại, phần rụng hết câu thì bỏ hẳn phần (không mồ côi tiêu đề). MTEditor hiện
  badge "Hệ X, Y" tự tính per-Phần (khắt khe nhất thắng) + dropdown ÉP TAY (`cau_hinh.phanBac[phanId]`,
  đè cả-phần-1-quyết-định lên suy-per-câu). Verify preview+DB: gán MT toàn-nâng-cao vào lớp hệ thấp →
  loại đúng hết + báo số câu loại; ép tay đổi badge đúng, lưu DB đúng.
- **⏸ Module "Test đầu vào — Chấm & Trả kết quả"** (spec `BKDEMY_TESTDAUVAO_SPEC_DETAIL.md`, ở repo
  root) — **Story 1-4 ĐÃ BUILD XONG 07-08** (đề test CRUD · gán đề snapshot (§A.2 anti-live-ref) ·
  chấm 3-cột Đ/C/S realtime · nhận xét + biểu đồ chuyên đề + lớp-đề-xuất (REUSE `ung_vien.lop_du_kien_id`,
  không thêm cột) · trả bài + phiếu ảnh) — `src/lib/detest.ts` + `DeTestScreen`/`ChamTestScreen`/
  `NhanXetTestScreen`/`PhieuTestDauVao` (pattern `EtAnhGuiPH`/`PhieuThongBao`, KHÔNG port V1). Leaf
  **RIÊNG** `test_dau_vao` (KHÔNG chung với `tuyensinh` — Tuyển sinh = quản lý LEVEL học sinh L5-L8,
  Test đầu vào = 4 story vận hành điểm danh→chấm→nhận xét→trả bài, 2 TRÁCH NHIỆM khác nhau dù cùng
  nằm trong phễu L5→L6, xem bài học ②). **TẠM DỪNG theo yêu cầu Thùy** (ưu tiên MT trước) — schema
  `de_test`/`de_test_cau`/`ca_test_cau`/`ca_test_cau_kq`/`nhan_xet_mau` (mig 0090) + mở rộng `ca_test`
  đã áp. **CÒN THIẾU:** upload-bài-thật end-to-end (chờ storage bucket — vẫn 0 bucket, xem mục
  `ca_test` phía trên) · nút "mở lại nhận xét" (hàm `moLaiNhanXet` có sẵn, UI tab NhanXetTestScreen
  chưa gắn nút) · 7 câu §F spec (đa môn 1-phiếu-hay-N/trục nhận xét môn≠Toán/hiệu suất staff…) CHƯA
  hỏi lại Thùy xác nhận từng câu — **ĐỌC LẠI §F trong spec TRƯỚC khi tiếp tục module này.**

### Đã build (07-08 tiếp 9 — UX: fix scroll-reset + sticky header toàn app)
- **🐞 Fix "sửa xong danh sách tự nhảy về đầu trang" — CHỈ MỚI Học sinh:** nguyên nhân
  `reload()` luôn `setLoading(true)` → bảng co về placeholder ngắn → trình duyệt tự clamp `scrollTop`
  về 0. Fix `HocSinhScreen.tsx`: chỉ hiện loading khi `list.length===0` (lần tải đầu), reload sau giữ
  bảng cũ trên màn tới khi data mới về. **Pattern này lặp ở HẦU HẾT màn list khác** (cùng công thức
  `setLoading(true)` vô điều kiện trong `reload()`) — CHƯA sweep, chỉ đúng đúng cái Thùy chỉ ra.
- **⭐⭐ Sticky header cho MỌI bảng danh sách (Thùy: "mọi chỗ đều phải freezing header chứ") — 14 file:**
  BoTro · ChatLuongVanHanh(dashboard) · BuoiHoc(2 tab còn thiếu: Chấm-bài-trên-lớp + Đánh-giá) ·
  GamiDiem(3 bảng) · QuanLyLevel(2 bảng) · HocPhi(5 bảng) · HocSinh · Lop(roster) · NhanSu · PhanCong ·
  KhoTaiLieu · TuyenSinh(2 bảng) · PhanQuyen(tab2 "gán role→vị trí"). Bỏ qua có chủ đích: thẻ
  chụp-ảnh/html2canvas (inline-hex, không cuộn) · lưới TKB tuần (7 khung cố định) · dropdown ngắn ·
  ma trận Phân quyền tab1 (2-hàng-header lồng — offset phức tạp, founder-only ít dùng, để sau).
  **🐞 Bug CSS ẩn phát hiện thêm (xem ②, áp dụng MỌI sticky sau này):** nhiều bảng bọc trong
  `<div overflow-hidden>`/`overflow-x-auto` (chỉ để bo góc / cuộn ngang) — chính div đó vô tình thành
  scroll-container riêng (không hề tự cuộn) làm sticky "bám nhầm chỗ", nhìn như vô hiệu. Fix: gỡ
  overflow khỏi các div bọc thuần-cosmetic, để khung cuộn NGOÀI CÙNG cấp trang làm chuẩn — cuộn ngang
  bảng rộng (HocPhi/TuyenSinh/QuanLyLevel) chuyển từ cuộn-riêng-bảng sang cuộn-cả-trang (đánh đổi chấp
  nhận được). Verify preview thật ở Nhân sự/Kho tài liệu/Điểm số/Tuyển sinh.
- **CÒN (theo yêu cầu Thùy, hoãn lại có chủ đích):** mã dạng (`ma_dang`) cần tiền tố/gắn mã môn — 20
  mã trùng số giữa `dai_ban_do`/`khtn_ban_do` (Toán vs KHTN đánh số độc lập cùng công thức
  khối-chuyên_đề-dạng). **Hướng đã chốt (chưa làm):** giữ nguyên mã Toán hiện có (đổi sau), KHTN thêm
  tiền tố `K`, Tiếng Anh thêm `E`, Văn thêm `V` khi có kho. ⚠ mã dạng là FK-target khoá cứng — mã CÂU =
  mã dạng + STT, đổi format mã dạng kéo theo đổi mã TOÀN BỘ câu con → cần soát kỹ phạm vi trước khi làm
  (rename cũ hay chỉ áp cho mã MỚI từ nay).

### Đã build (07-09/07-10 — Đưa MT vào mọi mastery/dashboard · fix bug Prep/MT-đóng-phase · fix 4 bug OPS)
- **⭐ MT (kỳ thi lớn) — rà soát toàn bộ chỗ còn sót sau đại tu kiến trúc 07-08** (MT từ "buổi riêng" →
  "phase của buổi thường"), theo yêu cầu Thùy "đưa MT vào mọi mastery/dashboard". 4 gap thật tìm bằng
  data thật (không đoán): **(1)** `listAllStaffTasks` (dashboard Chất lượng vận hành) thiếu hẳn nhánh
  MT — comment cũ còn ghi "buổi thường không có phase mt" (sai từ 07-08) → giờ TA có card "Chấm MT"
  riêng cả Theo-người lẫn Theo-mục. **(2)** Dashboard "Điểm số": lịch sử Elo của HS gộp nhầm dòng MT
  vào "Elo lớp" (data đúng, chỉ UI coerce sai); bảng "Theo ca học" thiếu nút "Elo MT" — giờ tách đúng,
  nút chỉ hiện ở ca THẬT SỰ có gán MT (`listCaHoc` trả thêm `hasMT`, tránh spam nút-vô-nghĩa mọi ca
  thường). **(3)** "Kết quả học tập" → view "Theo buổi (raw)": code lọc MT CŨ dựa `buoi_hoc.loai==='mt'`
  — giá trị này không còn tồn tại nữa (MT giờ luôn `loai='thuong'`) nên nhánh chết hoàn toàn dù NHÌN như
  đã làm (chip filter + badge vẫn còn trên UI, chỉ là vô tác dụng) — nối lại qua cờ `mt_dong_at` thật.
  **(4)** Tab Tổng quan 1 HS thêm "% đúng MT trung bình" (trước MT chỉ ngầm vào "% hoàn thành bản đồ",
  không có raw stat riêng như ET/BTVN). Mastery per-dạng + Elo/EXP + bảng xếp hạng **đã đúng sẵn từ
  trước**, không cần sửa.
- **⭐ Fix bug OPS "Chuẩn bị phòng" mất tích khi phân công trực GIỮA TUẦN (Thùy báo lỗi):**
  `luotPrepCuaKhoang` (opsvanhanh.ts) tra "ai đang trực phòng nào" CHỈ 1 LẦN tại ngày đầu tuần rồi dùng
  chung cho cả 7 ngày — nhân sự được phân công trực **bắt đầu giữa tuần** (`hieu_luc_tu` sau ngày đầu
  tuần) bị tra hụt TOÀN BỘ lượt của họ, dù ngày lượt đó đã trong hiệu lực thật. Fix: đổi sang
  `listPhanCongTheoTkb` (trả nguyên mảng, không lọc ngày) + resolve người trực THEO NGÀY CỦA TỪNG LƯỢT.
  Verify preview thật (màn Chuẩn bị phòng, Admin xem tất): 2 nhân sự vừa phân công giữa tuần hiện đúng
  tên thay vì "⚠ chưa gán".
- **⭐ Fix bug MT — gán MT không đóng "Chấm bài trên lớp" + BTVN (Thùy báo lỗi):** `ganMTVaoBuoi` (mt.ts)
  chỉ set `danh_gia_xong_at`+`et_dong_at` khi gán MT — QUÊN `ingame_dong_at`+`btvn_dong_at`, dù nguyên
  tắc code tự ghi rõ "buổi có MT chỉ có 1 hoạt động = kiểm tra". Hệ quả kép: 2 task kẹt vĩnh viễn ở Việc
  của tôi; NẶNG HƠN — buổi gán MT gần như KHÔNG BAO GIỜ lên `hoan_tat` (điều kiện hoàn tất phase MT đòi
  `ingame_dong_at` đã set, mà ingame không tự đóng). Fix: thêm 2 dòng set cột (cùng guard
  `is(...,null)`, cùng pattern set-thẳng-không-qua-closePhase tránh tính Elo sai cho phase rỗng). Verify
  DB thật: re-gán lại 3 buổi MT đã gán trước đó → cả 4 cột đóng đúng.
- **⭐ Fix 4 bug OPS "1 lượt" (Thùy báo lỗi, test kỹ bằng data thật):**
  **(1) OPS tự chọn được mức "GV chấm"/"Leader chốt" ở Prep** — `LuotCard` hiện MỌI control cho bất kỳ
  ai xem màn, không phân vai. Gate lại: chỉ GV/TG (có lớp trực tiếp qua `scope.trucTiep`) hoặc quản lý
  (`scope.laQuanLy`)/admin (`quyen.laAdmin`) mới thấy cụm chấm-điểm-nền + leader-chốt; OPS thuần chỉ
  thấy "Chờ GV chấm + leader chốt". Checklist (dọn phòng/KIT) + Đóng vẫn của OPS như cũ.
  **(2) Lớp CHƯA khai giảng vẫn đòi gán người trực** — `listTkbVoiNguoiTruc` (màn Phân công Ops) quên
  lọc `ngay_khai_giang` (Report/Tan/Prep đã lọc đúng từ đầu, riêng màn phân công ca bị sót) → lọc bỏ
  lớp `ngay_khai_giang > hôm nay`.
  **(3) Gán người trực xong màn nhảy về đầu trang** — CÙNG bug-class đã fix ở HocSinhScreen 07-08
  (`reload()` `setLoading(true)` vô điều kiện → lưới co về "Đang tải…" → mất vị trí cuộn), lần này sót
  ở PhanCongOpsScreen — fix chỉ loading ở lần tải ĐẦU.
  **(4) Màn Chuẩn bị phòng không cuộn hết được** — root PrepScreen.tsx thiếu hẳn khung cuộn riêng, bị
  khung ngoài `overflow-hidden` (NhanSuHome cấp staffLeaf) CẮT THẲNG nội dung tràn, KHÔNG PHẢI thiếu
  data — thêm "nested scrollbox" (header đứng yên + khung dưới `flex-1 overflow-auto`).
  Verify cả 4 bằng thao tác preview thật + đối chiếu DB trước/sau (không giả lập), kể cả xác nhận đúng
  đối tượng bị/không-bị gate ở bug (1) qua truy vấn tổ chức thật (ai giữ ghế gì, có cấp dưới không).
- **⭐ Git workflow ĐỔI (Thùy chốt 07-09): từ "push thẳng main" sang "branch → PR → merge".** Lý do: auto
  mode classifier CHẶN push thẳng main (không phải lỗi, là chốt chặn an toàn cố ý). Đã cài `gh` CLI
  (winget) + auth xong (device-code flow, tài khoản `HongThien`) → từ giờ tạo/merge PR được qua CLI
  (`gh pr create`/`gh pr merge --squash --delete-branch`), không cần mở link tay nữa.

### Đã build (07-11 — Việc của tôi: deadline/round-robin · XUẤT PDF kiến trúc mới (native print) · Kho tài liệu auto-link)
- **Đáp án in (ET/Giáo trình/BTVN) — revert về MẶC ĐỊNH** (đề + lời giải bên dưới, KHÔNG bảng) cho MỌI
  loại câu kể cả TN/TLN — Thùy chốt sau khi từng hiểu nhầm 1 câu phản hồi đọc được 2 chiều (mô tả bug vs
  yêu cầu đích, xem ②).
- **"Việc của tôi" sort theo NGÀY DEADLINE thật** (`ngayCuaTs`, `tuan.ts`, đảo `vnInstant`) thay vì ngày
  buổi/ngày tạo — BTVN/ET deadline lệch ngày buổi vài hôm nên sort cũ sai hàng ngày.
- **Gợi ý câu round-robin theo NGUỒN** (`pickRoundRobinByNguon`, `tailieu.ts`, nhóm theo
  `parent_ma_cau ?? ma_cau` xoay vòng) thay flat ít-dùng-nhất — tránh dồn hết vào 1-2 nguồn nhiều clone
  AI nhất.
- **⭐⭐ XUẤT PDF — PIVOT KIẾN TRÚC (thay hẳn cách cũ sau nhiều vòng vá html2canvas không dứt điểm):**
  "⬇ Tải PDF" (tải cục bộ) KHÔNG còn tự dựng qua html2canvas — đổi hẳn sang **NATIVE `window.print()`**
  (gộp nút, còn "🖨 In / Xuất PDF") cho cả 5 loại tài liệu (giáo trình/ET/MT/Đề thi/BT).
  `printWithFilename()` (PrintView.tsx) tự set `document.title` = tên tài liệu NGAY TRƯỚC `print()` —
  Chromium lấy làm tên file gợi ý trong hộp thoại lưu, khôi phục lại sau `afterprint`.
  **"🔗 Lấy link"** (upload Storage lấy URL share, `uploadPagesAsLink`) là ĐƯỜNG DUY NHẤT còn dùng
  html2canvas — bất khả kháng, browser cấm JS lấy Blob im lặng từ hộp thoại in native.
  Header/footer (`injectChrome`, PrintView.tsx) dải sóng chuyển hẳn từ CSS `background` sang `<img>`
  thật (xem bài học ② — html2canvas không tôn trọng `background-size:100% 100%` trên data-URI SVG).
- **Kho tài liệu — TỰ ĐỘNG lấy link cho MỌI tài liệu** (`KhoTaiLieuScreen.tsx`): hàng đợi nền
  (`linkQueue`) tự backfill link cho tài liệu chưa có (kể cả tài liệu mới tạo) + tự làm mới sau khi sửa
  qua 1 trong 4 Editor dispatch từ Kho (chưa bắt được sửa từ nơi khác — nút "↻" làm mới thủ công bù).
  Watchdog 45s cho job nền (paged.js từng TREO vĩnh viễn, không chặn đứng cả hàng đợi vì 1 tài liệu lỗi).
- **Card "Việc của tôi" đổi từ 1-hàng-ngang sang CỐ ĐỊNH 2 dòng** (`flex flex-col`,
  `OpsBuoiCard`/`TaskCard`/`OpsExtraCard`/`PrepTaskCard` trong `NhanSuHome.tsx`) — tên việc dài không
  còn làm vỡ layout thành 3 dòng lệch (dòng 1 = icon+tên đầy đủ, dòng 2 = deadline/số liệu nhỏ hơn).
- ⚠ Migration mới: `0095_tai_lieu_file_url.sql` (`tai_lieu.file_url text`).

### Đã build (07-12 — ⭐⭐ LINK PDF ĐỜI 2: server-gen bằng worker Chrome thật — thay HẲN client-gen html2canvas)
- **Yêu cầu gốc (Thùy, nhấn mạnh nhiều lần):** link PDF phải TỰ có ngay khi tài liệu tạo/sửa xong, người dùng KHÔNG chờ ở bất kỳ đâu, KHÔNG overlay, KHÔNG thao tác. Đời 1 (client tự render html2canvas) thất bại về bản chất: overlay chiếm màn hình 2 phút, file ảnh-chụp 10-50MB (vượt trần bucket 50MB → 400), mất hàng đợi khi F5, 4 lớp bug canvas liên tiếp.
- **Kiến trúc hiện hành:** tạo/sửa tài liệu → `enqueueLinkGen` (store, 9 call site) upsert 1 dòng `linkgen_jobs` (mig **0096**, PK=tai_lieu_id, pending/processing/done/failed+attempt+error) → **`worker/index.mjs`** (Node+puppeteer-core dùng Chrome/Edge sẵn trên máy, service role, tự serve `dist/` port 4599, poll 5s, tuần tự) mở **`#pvjob=`** (route tách ở `main.tsx` → `PrintJobPage.tsx`, token qua hash → setSession, mount PrintView-family PREVIEW mode, prop mới `onReady`/`onRenderErr`, debounce 1.2s cho loại dựng-lại-nhiều-lần) → `page.pdf({printBackground:true})` = **PDF CHỮ THẬT y hệt bản in tay** → upload + ghi `file_url` + **xoá file cũ** → done. `KhoTaiLieuScreen` poll jobs 8s: "⏳ đang tạo…"/"⚠ lỗi, bấm ↻"(kèm error)/"🔗 Copy link", tự reload ngầm khi job xong.
- **Verify thật cả 5 loại (nhìn ảnh render):** et 390KB/4s · btvn 510KB/5.7s · giao_trinh_buoi 558KB/5s · bo_tro 381KB/4.6s · mt_buoi 422KB/4.2s — so đời cũ 10-50MB/~2phút/hay treo. Header/footer đủ màu sóng+logo+chip, 1 dòng chữ sắc nét (hết vĩnh viễn bug nhân đôi — không còn html2canvas trong đường này). Xoá-file-cũ verify (URL cũ → 400).
- **✅ THÙY XÁC NHẬN CHẠY NGON trên máy thật (07-12 tối, "OK. Chạy ngon rồi") — merge main cùng ngày.** File CŨ (gen đời 1, bản ảnh nặng) còn trong kho: tài liệu nào còn dùng → bấm "↻" là thay bằng bản nhẹ + file nặng cũ tự xoá; không đụng thì kệ.
- **⚠ VẬN HÀNH:** worker phải ĐANG CHẠY (`npm run worker`, cần `npm run build` trước lần đầu/sau khi đổi code in) — tắt thì job DỒN trong DB, bật lên tự xử, không mất. Lỗi `EADDRINUSE :::4599` = ĐÃ có worker chạy rồi (đang ổn, đóng cửa sổ là xong). Chưa auto-start (chờ Thùy quyết máy nào/VPS — code không đổi khi chuyển). **Dead code đời 1 GIỮ CHỜ THÙY GẬT dọn (Luật xoá):** `LinkGenWorker.tsx`, store `linkGenQueue/Active/Failed`+persist, `uploadPagesAsLink`+html2canvas path trong 5 PrintView, headless-linkOnly flow.

### Đã build (07-14 — Tuyển sinh L8: tách HS mới khỏi list "đang học" + toggle khoảng ngày)
- Tab L8 (`TuyenSinhScreen`) trước hiện TOÀN BỘ HS `trang_thai='dang_hoc'` — trùng lặp hệt màn Học sinh (Thùy báo "hiện chung 2 thứ"). Fix `listHSDangHoc(mon?, songay=14)` (`tuyensinh.ts`) lọc thêm `ngay_nhap_hoc >= (hôm nay − songay)` (dùng `congNgay` có sẵn, giờ VN — §2). Theo yêu cầu thêm "quan sát xu hướng HS mới": export `KHOANG_NGAY_MOI=[7,14,28]`, toggle bar chọn khoảng ngày CHỈ hiện ở tab L8, nhớ lựa chọn qua `localStorage 'ts.songaymoi'`; `demTheoLevel` cũng nhận `songay` để badge count khớp list.
- Merge `nhap-de-thi-v2`→`main`+push (Thùy xác nhận rõ chữ "merge", commit `49a5448`).

### Nhập đề thi bằng Gemini trong ERP (07-14) — ĐÃ GỠ 01/10
- Đường bóc đề ngay trong trình duyệt (`bocDeTuFile`, wizard nhập, màn sửa cũ trong `DeThiScreen.tsx`) đã gỡ ở lát B ngày 01/10 ⇒ các bug của nó
  (cắt hình sai khi gộp trang, gán phần neo cứng, **bịa câu khi lời giải tràn 2–3 trang**) không còn đối tượng. Thay bằng dây chuyền Claude chạy ở máy
  (`boc-word.mjs` / `boc-pdf.mjs`) — xem mục "LUỒNG KHO + ĐỀ THI" đầu phần ①.
- Còn sót lại, chưa dọn: nhánh `nhap-de-thi-v2` (PR #11, chưa merge — không cần merge nữa; đóng / xoá nhánh phải hỏi Thùy) · prompt + schema bóc đề cũ
  trong `src/lib/kho/api.ts` và `scripts/test-dethi-ingest.ts` (không còn ai gọi từ ERP).

---

### Đã build (07-21 — ⭐ ET/lưới chấm BÁM ĐỀ · KHO RÁC câu hỏi · fix TKB thiếu lớp)

**Điểm vào:** Thùy báo *"ET 5A2 hôm qua in ra 5 câu nhưng trong nhóm lớp lại 6 câu"* và *"TKB không hiển thị hết tất cả các lớp"*.

- **TKB thiếu lớp (`TKBScreen.tsx`)** — mỗi ô (khung × thứ) vẽ lưới 6 phòng cố định, mỗi vị trí lấy ca bằng `cell.find(phòng khớp)`. `find()` trả 1 ca ⇒ 2 ca cùng phòng, hoặc nhiều ca `phong = NULL` (thực tế **50/76 ca chưa gán phòng**), thì ca thứ 2 trở đi **biến mất im lặng** — mất **23/76 ca**. Fix: `xepCa()` — ca có phòng về đúng vị trí, ca còn lại lấp các ô trống theo thứ tự giờ, dư thì vẽ hàng phụ. Không đường nào nuốt ca. *(Còn tồn: 50 ca chưa gán phòng · 6 lớp Anh/Văn chưa có ca TKB nào.)*
- **⭐ Lưới chấm BÁM ĐỀ (`gami.ts` + `BuoiHocScreen.tsx`, mig `0106`–`0110`)** — bản in đọc `tai_lieu_cau`, còn **ảnh gửi PH + lưới chấm đọc `gami_session_problems`**; lưới seed **đúng 1 lần** rồi không theo đề nữa, và danh tính ô = **vị trí** (`problem_no` ↔ index). Sửa đề = ô lệch câu. Gộp `ensureET/MT/BTVNProblems` + `resyncETProblems` thành **1 hàm `syncDocProblems`**, khớp ô↔câu qua **`ma_cau`** (cột mới): câu còn → giữ ô + điểm; câu mới → thêm ô; ô mất câu 0 điểm → xoá; **ô mất câu CÒN ĐIỂM → giữ + báo UI**, không tự xoá điểm. Phase **đã đóng → chỉ báo, không sửa cấu trúc**. Header cột đánh số theo **vị trí trong ĐỀ** (`problem_no` giờ chỉ là slot nội bộ, được phép thủng số). 3 banner cảnh báo thay cờ boolean cũ.
- **Vá dữ liệu:** `0107` xoá 1 ô rỗng (5A2 ô6) · `0108` xoá doc ET mồ côi 7S2 · `0109` gỡ 5 nhãn `ma_cau` mâu thuẫn · `0110` gắn ô 3,4,5 của 5A2 về đúng câu + sửa `ma_dang` (Thùy xác nhận *"5 câu"*) → **24 ô điểm của 8 HS hết cộng nhầm dạng**. `gami_grades` không mất dòng nào ở bất kỳ bước nào.
- **⭐ KHO RÁC câu hỏi (`0111` + `kho/api.ts` + `KhoRac.tsx`)** — xoá câu = `xoa_at`, không xoá cứng. Chỗ **CHỌN** câu lọc `xoa_at is null` · chỗ **RESOLVE** câu (`getTaiLieuFull`/in/chấm) **không lọc** → tài liệu cũ vẫn đủ câu. Vết do **trigger `log_kho_cau` → `kho_cau_log`** (không phải app ghi). Màn 🗑 Kho rác trong Bản đồ kiến thức: xem/khôi phục/xoá hẳn; **`xoaVinhVienCau` CHẶN ở API** khi còn `tai_lieu_cau` trỏ tới.
- **`0112` thay 149/150 câu chết** — suy dạng từ mã câu (8 ký tự đầu; đúng 8667/8675 = 99,9%), chọn câu cùng dạng · chưa có trong chính tài liệu đó · ít-dùng-nhất-trước. Migration ghi **cặp thay thế tường minh** (soát được, chạy lại = no-op); bảng đối chiếu `docs/2026-07-21-thay-cau-chet.md`. Giáo trình MẪU 11A/7S/9A: **0 câu chết còn lại**. Còn 1 (`DC000012`, mã đời đầu không suy được dạng — Thùy chốt bỏ).
- `setETCaus` giờ bump `tai_lieu.updated_at` (trước đó sửa CÂU không để lại dấu thời gian nào).
- **⭐ CHECK constraint lệch code — LOẠI lỗi, không phải 1 lỗi (`0113`–`0115` + `introspect.mjs`)** — Ops báo *"tick chuẩn bị phòng báo lỗi `new row for relation prep_phong`"*. Không phải quyền/RLS: `prep_phong.luot` CHECK còn `('ngay','sang','chieu')` từ `0086` (thiết kế cũ), trong khi `CaTruc` đã đổi thành `sang/chieu/**toi**` từ 07-19. **Chỉ nhánh `'toi'` chết** nên ẩn cả tháng (`toi` 0 dòng / `chieu` 7 / `sang` 1). Truy quét ra **quả thứ hai cùng loại chưa nổ**: `viec_van_hanh_duyet.tab` thiếu `'mt'` (có trong `TASK_TABS`). Vá: `0113` nới `'toi'` · `0114` thêm `'mt'` · `0115` xoá 20 dòng `'ngay'` + siết còn `('sang','chieu','toi')`. **Xác nhận hết bug: `luot='toi'` 0 → 7 dòng.**
- **Vá rò rỉ ảnh Ops (`uploadOpsAnh` + 2 màn gọi)** — đường dẫn ảnh trước đây là `ops/${Date.now()}-…png`, tức **mỗi lần dán đẻ 1 file mới**: dán đè ảnh khác → file cũ mồ côi; màn Report còn nặng hơn vì ảnh upload lúc DÁN nhưng dòng `vh_ops_task` chỉ ghi lúc **bấm đóng** → dán xong bỏ ngang là mồ côi luôn. Quét ra **43 file mồ côi** trong `ops/`, chỉ 19 do `0115`, **24 là rò rỉ này**. Fix: `uploadOpsAnh(blob, slot)` — path = **hàm của danh tính dòng** (`prep-{phong}-{ngay}-{luot}` / `task-{tkbId}-{ngay}-{tab}`, trùng đúng khoá unique của 2 bảng) + `upsert: true` ⇒ dán lại bao nhiêu lần cũng **1 file**. Đuôi luôn `.png` kể cả jpeg (contentType gửi tường minh; đuôi cố định mới giữ được "1 slot = 1 path"). URL trả về kèm **`?v=`** vì đè cùng path thì URL không đổi, trình duyệt/CDN sẽ trả ảnh cũ.
- **Sửa GỐC, không sửa triệu chứng:** `introspect.mjs` nay dump **CHECK** → `schema.md` có cột **"giá trị hợp lệ"** ngay cạnh mỗi cột (`57 check: 47 enum + 10 khác`; check phức tạp in nguyên văn ở mục "Checks khác", **không đoán bừa**). Trước đó 47 điểm cùng loại đều vô hình. Kèm `npm run new-migration <ten>` → tên file **timestamp `YYYYMMDDHHMM_`** thay số tăng dần (07-21 va số **2 lần, 4 file**).

### Đã build (07-21 tiếp — ⭐ Elo: huỷ phiên KHÔNG CÓ DỮ LIỆU + replay toàn bộ)
- **Lỗi:** `closePhase` khởi tạo `raw[id]=0` cho mọi HS rồi tính tiếp bất kể có `gami_grades` hay không ⇒ **0 dòng chấm = "cả lớp hoà"**. Hoà thì `actual` đều nhau nhưng `expected` phụ thuộc Elo ⇒ HS Elo cao MẤT điểm, Elo thấp ĐƯỢC điểm — buổi không ai chấm âm thầm kéo cả lớp về trung bình. Đo được: **81/329 phiên trống · 8955 điểm biến động vô nghĩa · HS lệch tới ±245**.
- **Fix:** `if (coElo && grades.length === 0)` → đóng phase nhưng KHÔNG tính Elo/EXP (cùng khuôn nhánh `!hsIds.length` vốn có). Áp cho CẢ ingame/et/mt. Trả cờ `khongCoDuLieu` → 3 nút Xác nhận đều **alert cho người dùng biết**, không bỏ qua âm thầm.
- **Replay `scripts/replay_elo_bo_phien_rong.mjs`** (mặc định THỬ, `--ghi` mới ghi, 1 transaction). Khác `_replay_elo.mjs` đời cũ: bỏ phase rỗng · **có phase `mt`** (đời cũ chỉ ingame+et → chạy nó sẽ NUỐT sạch Elo MT) · `sessions_played` chỉ +1 khi ingame thật sự tính.
- **Đã chạy:** history 2665→1946 · exp rank_* 2656→1946 (EXP −234.369) · 248/301 (HS×môn) đổi Elo · **Elo TB 1008→1008** (zero-sum, dùng làm chốt sanity). Backup `scripts/_backup_elo_2026-07-21.json`.
- Thùy chốt: bỏ luôn EXP phiên trống · đếm lại `sessions_played` · *"hệ thống chưa chạy real với học sinh nên cứ recalculate"*.

### Tồn đọng 07-21
- **396 cặp câu trùng trong cùng 1 tài liệu — Thùy CHỐT: KHÔNG phải lỗi.** Nguyên nhân là **kho chưa đủ đa dạng** (dạng ít câu → gợi ý buộc phải dùng lại). ĐỪNG mở lại việc này như bug; hết trùng là hệ quả của việc **làm dày kho**, không phải của việc sửa code. *(Chưa kiểm chứng: vài cặp trùng nằm **2 lần trong CÙNG một phan** — kho mỏng giải thích được trùng giữa luyện↔BTVN, chưa chắc giải thích được trùng trong cùng một phan. Nếu sau này kho dày mà vẫn còn, soi `autoSuggestByLoai`/`setDangOfBuoi`.)*
- **`DC000012`** (1 tham chiếu chết không suy được dạng) — Thùy chốt **bỏ qua**, 1 câu không ảnh hưởng.
- **24 buổi** (btvn 20 · et 2 · mt 2) lưới chưa gắn được `ma_cau` (số ô ≠ số câu). KHÔNG hỏng thêm — tự hiện banner đỏ khi mở tab, xử dần khi gặp.
- 50 ca TKB chưa gán phòng · 6 lớp Anh/Văn (7E1/8E1/9E1/7V1/8V1/9V1) chưa có ca TKB nào.
- **43 ảnh mồ côi trong `kho-anh/ops/` — Thùy chốt ĐỂ ĐẤY, không dọn.** Chỉ 19 cái do `0115`; **24 cái còn lại là rò rỉ upload đã vá** (xem ①). Nguồn rò tắt rồi nên con số không tăng nữa. Muốn dọn sau thì phải qua **Dashboard/SQL Editor** (role app không đọc nổi schema `storage` — xem ② "claude_build KHÔNG đụng schema auth/storage"): liệt kê `storage.objects` prefix `ops/` TRỪ mọi `anh_url` còn sống ở `prep_phong`/`vh_ops_task`, **cắt query trước khi so tên** (`split_part(split_part(anh_url,'/kho-anh/',2),'?',1)` — URL mới có `?v=`). **ĐỪNG lọc theo ngày**: `ops/` chứa ảnh của CẢ hai bảng lẫn lộn, xoá theo ngày là giết nhầm ảnh đang dùng.

### Đã build (⭐ KHO HÌNH HỌC v3 — 07-24→27 · bổ sung 08-06, nhánh riêng của Toán)
- **Spec:** `spec-kho-hinh-v3.md` (repo) + `docs/mockup-kho-hinh-v4.html`. Model 4 tầng: ① họ mô hình (độc lập) → ② lưới MÔ HÌNH (trục giả thiết, DAG) → ③ lưới BÀI TOÁN nhỏ (trục suy luận, tiền đề xuyên mô hình) → ④ kho bài vật lý (ánh xạ ý→node). Vào bằng tab **Hình học** của Bản đồ kiến thức → `src/screens/kho/hinh/KhoHinhScreen.tsx` (rail 9 màn M0–M9). **Đi THEO KHỐI** như Đại (`loadLuoi(khoi)` cắt lưới). **⭐ 08-06: catalog dạng/bổ đề GIỜ CŨNG cắt theo khối** (`hinh_dang.khoi`/`hinh_bo_de.khoi`) — Thùy: dạng/bổ đề gắn với phạm vi kiến thức từng khối, không dùng chung nữa. Mô hình + catalog độc lập hoàn toàn theo khối (tách sớm khi data non, chưa có mastery để phân mảnh).
- **File:** `src/lib/kho/hinh.ts` (data-layer + mọi derive) · `hinhConfig.ts` (ngưỡng độ khó, màu) · `screens/kho/hinh/`: `KhoHinhScreen`(shell) · `Ho`(M0 chọn họ + FormMoHinh) · `SoDo`(M1/M2 hai view + FormBaiToan-caller + RadialEco) · `FormBaiToan`(form node popup lớn) · `KhoTam`(M3 gán) · `HangCho`(M5) · `KhoChinh`(M4) · `Catalog`(M6 dạng + M7 bổ đề) · `TaiLieuChuan`(M8) · `SoanTaiLieu`(M9 giảng dạy/ôn tập) · `HinhPrintView`(in) · `hinhUi.tsx`(primitive: Tag/Cap/MaPill/FieldCard/Chip/OcrButton/Fig…).
- **⭐ MODEL (Thùy chốt):** bài toán mượn **GIẢ THIẾT** của mô hình (đề = giả thiết mô hình + câu hỏi); chỉ khác nhau ở CÂU HỎI (`phat_bieu`). Mỗi bài toán trực tiếp thuộc 1 mô hình (bắt buộc). `de_bai_chuan` vẫn THÔI GHI (suy từ mô hình). **⭐ 08-06: HÌNH thì KHÁC — node đặt được hình RIÊNG** (`anh_chuan` hồi sinh): cùng mô hình không có nghĩa hình vẽ giống hệt. Derive `anhCuaBaiToan(L,id)` = `anh_chuan` nếu có, không thì mượn `anhCauHinhCua(mô hình)`; mặc định null = mượn. FormBaiToan có toggle "Hình riêng". **Hình bước giải** (`hinh_cach_giai.anh_loi_giai`) mặc định = hình đề (mọi chỗ fallback `anh_loi_giai ?? anhCuaBaiToan`), toggle "Hình riêng cho bước giải" khi cần hình tô/kẻ thêm.
- **⭐ Kế thừa giả thiết — HAI KIỂU (per-node `hinh_mo_hinh.gt_thay_the`, 08-06):** `false`=**cộng thêm** (full = bố + `gia_thiet_them`, hành vi cũ); `true`=**tự phát biểu** (con định danh-hoá như hình bình hành < hình thang — tự viết nguyên câu vào `gia_thiet`, `gia_thiet_them`=null; derive DỪNG leo ở đó). `giaThietDayDu`: base = node tự-phát-biểu SÂU NHẤT trên đường tổ tiên (mặc định gốc họ), base góp full, đời sau góp delta. **Quan hệ cha-con (DAG) KHÔNG đổi giữa 2 kiểu — chỉ đổi render text; kế thừa cách giải/bao đóng tiền đề vẫn chạy qua cạnh cha.**
- **Mã PHÂN CẤP hiển thị** (`maPhanCapMap`): 1 / 1.1 / 1.1.1 SUY từ cây (gốc theo khối), tự tính lại khi đổi cây. GIỮ luật "mã trơ" spec §2.1: id ổn định bên dưới vẫn là `ma` (MH.xxx), mã phân cấp chỉ để đọc.
- **AND vs OR tiền đề:** nhiều tiền đề của MỘT `hinh_cach_giai` = AND (cần cả). Nhiều cách giải = OR (v1 mỗi node 1 cách; nhiều cách đầy đủ là OUT spec §8). UI ghi rõ "cần CẢ A + B". Tiền đề tạo node mới **mặc định = `nodeTruoc`** (node cấp cao nhất trong mô hình); thêm qua CÂY (Mô hình › node).
- **Cấp:** nhập tay, TOÀN CỤC (không reset theo mô hình, không cộng độ sâu). Form **điền sẵn** cấp gợi ý (1+max cấp tiền đề), sync tới khi người tự gõ. Độ khó = `mucDoTuCap` (ngưỡng) +1 nếu có bổ đề.
- **Derive khác (đọc `hinh.ts`):** hậu duệ/tổ tiên/gốc họ/độ sâu · bao đóng tiền đề (JS + rpc Postgres `hinh_bao_dong_tien_de`) · `moHinhCuaBai` (bài mang nhiều tag) · `dapAnHaiBac` (§3: ý có lời giải riêng = chuẩn xác; trống → rơi về node = tham chiếu) · chuỗi M8 · khúc A→B M9 (nhắc lại/cảnh báo hở) · `anhCauHinhCua`/`nodeTruoc`.
- **Lý thuyết DẠNG:** bảng `hinh_dang_ly_thuyet` (mirror `dai_dang_ly_thuyet`, khoá `dang_id`) + **tái dùng `LyThuyetModal` của Đại** (export từ `BanDo.tsx`; seam `api.hinhDangLyThuyet`). Gắn ở TERMINAL dạng (lá = cách xử lý HOẶC loại câu hỏi chưa tách con — loại chưa có con cũng là dạng chọn được ở M6 + FormBaiToan).
- **⭐ Lý thuyết + ví dụ BỔ ĐỀ (08-06):** bổ đề là cấu trúc TO (lý thuyết + ví dụ đàng hoàng, không phải 1 câu). Bảng `hinh_bo_de_ly_thuyet` (mirror, khoá `bo_de_id`) + seam `api.hinhBoDeLyThuyet` + **tái dùng NGUYÊN `LyThuyetModal`** (bóc ảnh/PDF, cắt hình chèn, dán clipboard). M7: mỗi bổ đề có chấm ● + box "Lý thuyết / ví dụ" → Soạn/Sửa. `ten`/`phat_bieu` ở `hinh_bo_de` = tiêu đề + phát biểu cô đọng; `noi_dung` bảng mới = lý thuyết + ví dụ đầy đủ.
- **Hook đo lường (spec §8, reserve):** `hinh_y.ma_y` · `buoi_hoc.ngu_canh_luot` · `gami_session_problems`/`canh_bao_yeu` thêm `hinh_y_id`+`ngu_canh_luot` (mo_hinh/dang/luyen_de). Seam ở `hinh.ts` (`setNguCanhLuotBuoi`…). ⚠ Dropdown "Lượt" ở BuoiDetail từng bị phiên khác gỡ để cứu build → **UI CHƯA cắm lại** (cột DB + seam còn nguyên).
- **UI lưới:** node card (View bài toán, 08-06) = **dải hình full-width `h-24` trên đầu như card mô hình** (bỏ thumbnail 42×42) + câu hỏi (chính) + giả thiết (context teal) + chips; card 256×200 (`COL_W`/`NODE_H`). **Bấm node → POPUP TO 80vw×80vh** (`DetailBaiToan` = modal `createPortal` ra body — thoát zoom 1.15× §707; KHÔNG còn panel 330px cạnh graph, graph full-width). Modal 2 cột: trái = đề (giả thiết mượn) + câu hỏi + hình to · phải = meta + cách giải/tiền đề + đáp án + ý thực tế. Bấm tag tiền đề → chuyển node trong modal. Card mô hình to (hình + giả thiết + MaPill). **Hệ sinh thái = TÂM–VỆ TINH** (`RadialEco`).
- **⭐ Cỡ chữ popup (08-06):** primitive `FieldCard`/`Sol`/`KV`/`Tag`/`Ma` (hinhUi) có prop **`big`** (mặc định false — KHÔNG đụng màn khác dùng chung); popup truyền `big` → chữ nội dung ~16–17px (≈12–13pt, Thùy yêu cầu pt không phải px). KaTeX scale theo font container nên đề/câu/đáp án tự to theo.
- **Fix chung:** `.katex{font-size:1em !important}` (katex.min.css nạp sau index.css đè 1.21em làm công thức to 21%). OcrButton (dán ảnh → AI bóc LaTeX, tái dùng đường Gemini của lý thuyết Đại) ở mọi ô công thức.
- **Migration:** `202607241919_kho_hinh_v3` (10 bảng, DROP 6 bảng Hình CŨ rỗng — có cổng nhận diện shape để migrate.mjs chạy lại không xoá data mới) · `202607241923_..._derive` (3 function đệ quy) · `202607242050_hinh_hook_do_luong` · `202607271436_hinh_dang_ly_thuyet` · **08-06:** `202608061549_hinh_gia_thiet_thay_the` (cột `gt_thay_the`) · `202608061835_hinh_catalog_theo_khoi` (cột `hinh_dang.khoi`+`hinh_bo_de.khoi`, backfill dạng cũ = khối 9) · `202608061847_hinh_bo_de_ly_thuyet` (bảng). RLS = convention v2 (member_all `la_thanh_vien()`).
- **Còn:** cắm lại dropdown "Lượt" ở BuoiDetail (không tái phạm lỗi build) · PrintView Hình đã có nhưng chưa verify PDF thật (paged.js cần pane hiển thị — dev pane phiên này 0×0) · nhiều cách giải OR + Measurement 3 trục = OUT spec §8.
- **⚠ Verify Kho Hình:** dev pane phiên tự-dựng hay 0×0 (không compositing) → screenshot + paged.js không chạy; verify bằng **đọc DOM** (`.z-50` form render qua portal ra `body`, KHÔNG trong `#root`) + tạo data test qua DB rồi xoá (nhãn `_vt`/`_vtest`/`ghi_chu`; MH.008/010/011 là data Thùy đang dựng — GIỮ).

### Đã build (⭐ KHO HÌNH — SOẠN TÀI LIỆU + GIÁO TRÌNH + BIẾN THỂ nâng cao — 08-07)
- **⭐ Biến thể AI (2 kiểu, `SoDo.tsx FormBienThe`):** `kieu='doi_so'` = AI sinh bài mới **giữ logic đổi số liệu** (như clone Đại, `api.sinhBienTheHinh`, giữ hình gốc + cảnh báo) · `kieu='doi_dinh'` = AI **đổi tên đỉnh** (relabel, `buildDoiDinhHinhPrompt`/`doiDinhHinh`). Cạnh "Thay điểm" thủ công. **Node tạo bài cũng có up ảnh/PDF → AI tách đề+lời giải** (`ingestBaiHinh`, `FormBaiToan`), hình vẫn dán tay.
- **⭐ ĐỔI ĐỈNH CẢ CHUỖI = "lứa" (bài học DANH-TÍNH-KHOÁ-TỰ-NHIÊN):** clone-đổi-đỉnh là hành vi LÀM KHO; ghép câu là hành vi LÀM TÀI LIỆU — tách. Khi đổi đỉnh 1 node nằm trong **chuỗi kết nối tiền đề** → popup `ChuoiDoiDinhPopup` chọn đổi bao nhiêu câu trong chuỗi → sinh 1 **lứa** (`hinh_baitoan_bien_the.lua_id` chung, 1 map relabel). Các bản trong 1 lứa giữ quan hệ tiền đề y node gốc; **lứa khác nhau độc lập** (đổi MNPQ ≠ đổi EFGH). **Tiền đề bài-cấp ĐÓNG BĂNG** `tien_de_ids` lúc clone (KHÔNG derive lại) → về sau chèn node giữa chuỗi thì quan hệ đã xây vẫn còn (§DANH-TÍNH: khoá tự nhiên, không vị trí). Lib: `saveLuaBienThe`/`bienTheCuaLua` (`hinh.ts`), `buildDoiDinhChuoiPrompt`/`doiDinhChuoiHinh` (`api.ts`, `HINH_CHUOI_SCHEMA`).
- **⭐ Mô hình VỆ TINH (redefine tầng, đệ quy):** node lá của mô hình (không có con) = **vệ tinh** của mô hình cha, KHÔNG tính là tầng riêng. Áp đệ quy mọi tầng. **Đánh số: hub = số (`1.1`), lá = chữ (`1a`)**; `SoDo ViewMoHinh` layout **tâm–vệ tinh** (cột = tầng, hub card + vệ tinh dashed quanh; click card → zoom card đó làm trung tâm).
- **⭐ SOẠN TÀI LIỆU "Theo mô hình" (`SoanTaiLieu.tsx TheoMoHinh`, giống builder Đại):** 3 cột. **Mặc định hiện TẤT CẢ chuỗi trong kho** (mỗi chuỗi = 1 **dạng** = connected component qua tiền đề, `api.chuoiKetNoi` 2 chiều); mô hình chính = **bộ lọc tuỳ chọn** (chọn → còn mô hình + vệ tinh; nút Bỏ lọc). **Node lẻ** (`NodeRow`): 2 khối Trên lớp/Về nhà, mỗi khối Tự-động (Gợi ý N) hoặc **Chọn bài** (`KhoBaiPicker` — kho = đề chuẩn + biến thể + ý thật; bài ở phiếu KIA bị khoá, KHÔNG trùng). **Chuỗi** (`ChuoiRow`): mỗi phiếu chọn 1 **BẢN** từ dropdown (đề chuẩn / các lứa đổi đỉnh) → **Trên lớp và Về nhà là 2 BẢN KHÁC nhau, cùng logic tiền đề**.
- **⭐ GHÉP a,b,c:** node tiền-đề-của-nhau gộp 1 bài a,b,c. Đề chuẩn: `mucGhep` (giả thiết + hình node SÂU NHẤT chung, ý = `Chứng minh {phat_bieu}` + cách giải). Lứa: `mucGhepLua` — **giả thiết CHUNG** (các câu trong chuỗi cùng giả thiết) lấy từ biến thể node sâu nhất, **tách ở "Chứng minh"** (`tachDe`: trước = giả thiết, sau = câu hỏi); ý a,b,c = câu hỏi từng bản. Export/resolver ASYNC nạp `bienTheCuaLua`.
- **⭐ GIÁO TRÌNH HÌNH (độc lập giáo trình Đại):** `hinh_giao_trinh`(master) · `hinh_gt_buoi`(polymorphic: `giao_trinh_id`=buổi master · `lop_id/ngay/stt_lop/nguon_buoi_id`=bản LỚP snapshot) · `hinh_gt_bai`(STRUCTURED 1 dòng/bài: `phan` lop/nha · `loai` chuan/bienthe/y/ghep · `ref_id`/`ghep_node_ids[]`/`lua_id`/`an_de`/`so_dong`). Lib `hinhGiaoTrinh.ts`: `saveBuoiSelection`(decode poolKey→row, khử ghép trùng) · `ganLopSnapshot`(COPY bài, đóng băng) · `renumberBuoiLop`/`goBuoiLop`(un-gán ở tab Theo lớp 🗑). **Sửa buổi:** `GiaoTrinhScreen loadBuoiToDraft` reload lại builder từ `hinh_gt_bai` → giữ nguyên cấu trúc (KHÔNG mất khi lưu). `resolveBanIn` resolve nội dung sống khi in (cần `Luoi`). Screen `GiaoTrinhScreen` (tab Master/Theo lớp, `GanLopPopup`).
- **⭐ Nháp GIỮ khi rời màn** (như Đại `etDraft`): store `soanHinh[khoi].mh` (`useStore.ts SoanHinhDraft`): `{mainId, satIds, nodeIds, sel, ghep:GhepItem[], anDe[], soDong, editBuoi}`. poolKey mã hoá nguồn: `${btId}:chuan` · `bt:${bienTheId}` · `y:${yId}`. Pool bài = RAM local, re-fetch khi quay lại.
- **In (`HinhPrintView`):** câu hỏi **ngay sau đề** (hình float phải 36%), bài **sát nhau** (bỏ mã BTxxx), trên lớp KHÔNG kẻ dòng. **Checkbox ẩn/hiện hình per-bài** (`an_de` — ẩn = HS tự vẽ). **BTVN:** chỗ HS vẽ hình bên phải ~40% (`.hp-draw-r`) + **số dòng kẻ điều chỉnh được** per-bài (`so_dong`, mặc định `DONG_BTVN=6`; kẻ `repeating-linear-gradient` 0.3mm #9aa7b5 — 0.1mm quá mờ). `soDong===0` → không kẻ.
- **Migration:** `hinh_giao_trinh`/`hinh_gt_buoi`/`hinh_gt_bai` + `hinh_baitoan_bien_the.lua_id`+`tien_de_ids` + `hinh_gt_bai.so_dong` (đã chạy trên Supabase). ⚠ `so_dong` từng thiếu → "column not found in schema cache"; nhớ chạy migration trước khi test cột mới.
- **⚠ Git (phiên này):** repo đang ở nhánh khác (`feat/tai-anh-qr-hangloat` của phiên song song) → push main bằng **worktree cherry-pick**: commit local → `git worktree add --detach <wt> origin/main` → `cherry-pick` HEAD → `push origin HEAD:main` → remove worktree. CHỈ commit file kho-hình, không đụng file phiên kia. Typecheck: `node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json` (từ thư mục `bkdemy-erp-v2`).

### Đã build (⭐ KHO HÌNH — SOẠN TÀI LIỆU nâng cao: nở đáp án + giả thiết phụ/van + popup chọn-bản → cây — 08-08)
- **Model (Thùy chốt qua brainstorm, spec `docs/spec-kho-hinh-soan-chuoi.md`):** 1 bài = **1 ĐÍCH** (node ngọn) + bao đóng tiền đề **HỘI TỤ** (`chuoiTienDe`), **cấm phân kỳ**. Đề pick **tập con** node → ý a,b,c; node KHÔNG pick = **ẩn → nở thành BƯỚC** trong đáp án của ý phụ thuộc (cắt tại node tick, **hiện 1 lần**, sắp cap↑) — "đề không hỏi vẫn phải có mới giải được". Nhãn ý **động** → lời giải viện dẫn theo TÊN tính chất, KHÔNG "ý a/b/c". Đích = **SUY** (cap cao nhất trong tick, không lưu cột). Node lẻ = chuỗi 1 node.
- **⭐ Giả thiết phụ** (`hinh_baitoan.gia_thiet_phu`): dữ kiện lẻ, đa số = **vẽ thêm** ("gọi I=AC∩BD"). Bám node — hiện ở ĐỀ nếu node được hỏi, ở đầu BƯỚC nếu ẩn (mặc định ở đáp án, HS tự dựng). **VAN `hinh_cach_tien_de.keo_gt_phu`** (per-CẠNH tiền đề): bật → trồi gt phụ của tiền đề lên ĐỀ (giảm độ khó); truyền bắc cầu cạnh-bật, dừng ở tick. Migration `202608080034_hinh_gia_thiet_phu_van` (đã áp DB).
- **`noDapAn(L, tickIds)` (hinh.ts):** khung nở dùng chung — ý=tick, buocNodes=ẩn (cắt-tại-tick), gtPhuKeo=van (`tienDeVan` đi cạnh keo_gt_phu). `mucGhep`/`mucGhepLua` dùng nó; `YIn` +`giaThietPhu`+`buoc[]`; `HinhPrintView` render "**Bước i — [tính chất]**" (chỉ bản GV) + giả thiết phụ ở đề/đầu bước.
- **`FormBaiToan`:** ô **Giả thiết phụ** + checkbox **"gt phụ ở đề"** per cạnh tiền đề (chỉ hiện khi tiền đề có gt phụ); `setTienDe(cachId, chuId, ids, vanIds)` lưu keo_gt_phu.
- **⭐ Luồng soạn = 2 MÀN (Thùy chốt sau vài vòng hiểu nhầm):** card **chuỗi** (`ChuoiRow`) mỗi phiếu (Trên lớp/Về nhà) có nút **🌿 Chọn ý (cây)/✎ Sửa** → **màn 1 `ChonChuoiPopup`** = popup **TO (80vw)** hiện đầy đủ **TỪNG BẢN** của chuỗi (Đề chuẩn **gốc** + **lứa** biến thể đổi đỉnh) dạng **thẻ VIEW** (giả thiết chung + list câu), nút "Chọn bản này" → **màn 2 `CayTickPopup`** = **cây NGANG** (cột = ĐỘ SÂU tiền đề longest-path — KHÔNG dùng `cap`; dây nối) + tick ý + **xem trước sống** đề HS/đáp án GV, nút **← Đổi bản**. Ô cây 234×116, chữ 16.5px (~12.5pt). **⚠ "các chuỗi của node" = gốc + biến thể của CHÍNH chuỗi**, KHÔNG phải các dạng khác nhau.
- **CÒN (đã làm tiếp — xem 2 mục dưới):** node-lẻ đã hợp nhất vào cơ chế PICK chung (KHÔNG còn NodeRow/PhanBlock/KhoBaiPicker) · `mucGhepLua` đã dùng nội dung lứa thật (không còn fallback đề-chuẩn) · verify IN paged.js thật CHƯA làm (pane phiên vẫn 0×0 lúc đó).

### Đã build (⭐ KHO HÌNH "CHUYỂN NHÀ" — đúc lại giáo trình theo khuôn Đại 100%, dời nav lên hub — 08-08 tiếp)
- **Thùy chốt phạm vi:** "luồng bên Hình đâu có khác bên Đại — thêm buổi/chọn câu/gán buổi/xuất kho tài liệu y hệt, chỉ khác chỗ PICK (Hình có pick CHUỖI, Đại chỉ pick từng câu)." → dựng lại TOÀN BỘ theo khuôn `TaiLieuBuilder`/`TrichPanel` của Đại, KHÔNG phải bản giản lược. `PickItem` discriminated union (`{key,phan,nodeIds}&({kind:'ghep',luaId}|{kind:'bienthe',bienTheId}|{kind:'y',yId})`) = "1 chuỗi ghép cũng là 1 bài", thay `sel`/`ghep` tách rời cũ.
- **`GiaoTrinhScreen.tsx` viết lại:** Master (card-grid thư viện, y hệt `TaiLieuScreen`) + `GiaoTrinhBuilderHinh` (full-screen, buổi list "+ Thêm buổi", KHÔNG có bước gấp/mở — luôn hiện thẳng chọn-mô-hình-rồi-chọn-bài như Đại) + `TrichPanelHinh` (TKB-gợi-ý ngày + sổ riêng lớp, y hệt `TrichPanel`; KHÔNG có bước "BTVN tách xác nhận" — Hình gán GT+BTVN cùng lúc, deviation CÓ CHỦ Ý vì Hình không có OnTapConfirmScreen tương đương). `BuoiPickEditor` (trong `SoanTaiLieu.tsx`) = 3 cột `190px_minmax(0,1fr)_200px` (mô hình lọc | chuỗi | tóm tắt) — mô hình lọc CHỈ local state, KHÔNG reset pick khi đổi lọc (1 buổi được span nhiều mô hình).
- **⭐ Nav = "chuyển nhà" PHẢI dời luôn entry point, không chỉ nội bộ luồng** (Thùy sửa lần 2: "thì t bảo làm luôn ở chỗ đấy mà"): leaf mới `lamtailieu:giao_trinh_hinh` (`GiaoTrinhHinhEntry.tsx`) lên NGANG HÀNG "Giáo trình" (Đại) trong hub "Làm tài liệu" — bỏ hẳn entry cũ chôn trong rail Kho Hình (`KhoHinhScreen` rail bớt 1 mục, đổi nhãn "Soạn tài liệu" → "(ad-hoc)").
- **3 bug UI cụ thể, CÙNG 1 gốc — copy số/pattern của Đại mà không soát nó có KHỚP NGỮ CẢNH MỚI:** (1) collapse/expand tự chế cho buổi — Đại không có bước đó, luôn hiện thẳng. (2) `max-w-[860px]` copy từ layout 1-cột của `TaiLieuBuilder` bó cứng layout 3-cột của Hình + 2 cột biên (240/220px) quá to so với "mục lục bé" thật sự cần — sửa còn 190/200px + `minmax(0,1fr)` giữa. (3) số-dòng/hiện-hình để ở card phụ thay vì card chính, header PDF dùng bản CŨ dù đã có bản mới. **Bài học: copy layout/số của màn khác PHẢI tự hỏi "số này đo theo hình dạng NÀO" trước khi dán, không suy bừa từ code cũ trông giống.**
- **In (`HinhPrintView`):** masthead nội dung mới (`.hpmh-*`, gradient+logo+tiêu đề, clone khuôn `.gtbk-mh*` của Đại — namespace riêng, KHÔNG đụng file PrintView.tsx của Đại). **2 tầng "header" KHÁC NHAU** — masthead (nội dung, 1 lần) đã đổi nhưng dải sóng chạy-mọi-trang (`buildPagedCss`/`pageChrome`, qua `ch.header`) VẪN CÒN vì `HinhPrintView` gọi `buildPagedCss({...},{},...)` — `ch` RỖNG mặc định `head=true`. Fix: truyền `{header:'none'}` (khớp Đại đã bỏ hẳn 08-03).

### Đã build (⭐ NHÁNH MỚI "HÌNH GIẢI TÍCH" — Phase 1: kho + soạn tài liệu — 08-08 tiếp)
- **Taxonomy (Thùy chốt):** 1 nhánh "Hình giải tích" (lượng giác nay, Oxy/Oxyz sau — chỉ thêm CHỦ ĐỀ trong CÙNG nhánh, 0 schema mới) — cấu trúc TƯ DUY như Đại (chuyên đề/dạng) dù thuộc Hình học. Tên chốt **"Hình giải tích"** (không "Giải tích" — vào Đại sai vì là Hình, vào Hình sai vì tư duy Đại).
- **⭐ Kiến trúc dispatch (Task tự trả lời — R2):** tái dùng NGUYÊN `TaiLieuScreen`/`TaiLieuBuilder`/`TrichPanel` của Đại (không phải hệ mô-hình/DAG của Hình tổng hợp), bảng RIÊNG `hgt_*` (mã `GT`/`GC`, clone `0050_khtn_kho.sql`). Vấn đề: `tai_lieu.mon` PHẢI giữ `'Toán'` (RBAC/billing/lop.mon sạch, §1.6) nên không dùng `mon` làm khoá dispatch như KHTN được. **Giải: tách 2 chiều** — `mon` lo RBAC/billing (không đổi); cột MỚI `tai_lieu.nhanh` (null=Đại mặc định | `'hinh_gt'`) lo dispatch kho TRONG mon='Toán'. `khoCuaMon(mon, nhanh?)` mở rộng, default giữ nguyên hành vi cũ (0 regression). `BranchConfig` thêm `hinhGiaiTichBranch` (`key:'hinhgt'`) — Bản đồ kiến thức giờ 3 tab dưới Toán (Đại/Hình/Hình giải tích), tab mới dùng CHUNG `BanDo` như Đại/KHTN.
- **Sweep `nhanh` xuyên pipeline THẬT SỰ chạm tới** (trace kỹ theo call chain, không đoán): `getTaiLieuFull` (điểm hội tụ) → `trichXuatBuoi`(doc con kế thừa `nhanh` của master) → `TaiLieuBuilder`/`DangPicker` → `TrichPanel`→`BuoiTrichRow`→`OnTapConfirmScreen`(bước xác nhận BTVN BẮT BUỘC, không optional) → `OnTapEditor`→`DangPickerOne`/`ontap.ts`(`fetchTenDangByMa`/`appendOnTapToBtvnDoc`). `goiYOnTap` (mastery-gợi-ý) ĐỂ NGUYÊN — tự graceful-empty vì chưa có đo lường `hgt_*`, không crash. `PrintView.tsx`/`bkPrint.tsx` (WIP phiên khác) soát xong KHÔNG hardcode bảng nào → tự động đúng qua `getTaiLieuFull`.
- **DB:** `202608082109_hinh_giai_tich_kho.sql`(bảng+`tai_lieu.nhanh`) + `202608082111_..._kho_rac.sql`(vá — clone quên rằng `0111_kho_rac_cau_hoi` đến SAU `0050`, thiếu `xoa_at`/trigger/whitelist RPC `count_cau_by_dang`). Áp qua `scripts/_apply_one.mjs` (migrate.mjs replay-từ-0001 fail trên DB có data).
- **Phase 2 — CHỦ ĐỘNG CHƯA làm (không nằm trong "thêm buổi/chọn câu/gán buổi/xuất kho" Thùy mô tả):** ET/MT/BT/Đề thi standalone + `mastery.ts`/`gami.ts`/`goiYOnTap` (Elo/EXP/đo lường) + `NhapKhoScreen` AI-ingest (đã thêm `KhoMon:'hgt'`/`khoTbls` sẵn, UI CHƯA nối). "+ Thêm câu" tay đã dùng được ngay qua `DangHub` (generic `config.cauTbl`).
- **Verify:** tsc sạch · `npx vite build` sạch · click-through thật (dev pane, Admin): tab Bản đồ + pill Giáo trình đều hiện đúng rỗng-riêng (không lẫn Đại) → tạo thử giáo trình → builder mở sạch → verify SQL `mon='Toán',nhanh='hinh_gt'` đúng → xoá data test.

---

### ⭐⭐ TRỢ LÝ (tab 🤖 trong *Việc của tôi*) — trạng thái 29/09 · ĐỌC `SPEC-troly-nhansu.md` §6–§7 trước khi sửa

**HƯỚNG HIỆN HÀNH (CEO 29/09 — ghi đè hướng 12/08 "nhắc việc hàng ngày + hỏi được"):**
*"hỏi là phụ, tính năng chính vẫn là báo cáo. Báo cáo đầy đủ dữ liệu cần thì gần như không cần hỏi lại nữa."*
Trợ lý = **hai bản báo cáo tất định tính ở Postgres** (Báo cáo Sư phạm · Tổng kết tuần). Model KHÔNG tham gia tính số.
**Chỉ 3 tài khoản dùng:** Đào Xuân Thùy · Phạm Thị Thùy Trang · Trần Bảo Lộc — danh sách ở MỘT chỗ `hoi_dap_ds_tai_khoan()`;
cổng `troly_duoc_dung()` / `_troly_gac()` đứng đầu MỌI hàm `_troly_*`; tab bị ẩn với người khác ở `NhanSuHome` (cờ `hoi_dap_duoc_dung`).

**Màn hình** — `src/screens/troly/TroLyTab.tsx` (KHÔNG đẻ leaf: leaf kéo theo quyền per-leaf + hiện ở nav mọi role). Hàng nút:
**Báo cáo** (mặc định) · **Tổng kết tuần** · Trợ lý thấy gì · Vận hành · Bổ trợ bù · Bổ trợ đuổi · Bổ trợ yếu · Kiểm tra đầu vào · Việc của bạn.
Khung hỏi nằm CUỐI trang.

**① BÁO CÁO SƯ PHẠM** (`BaoCao.tsx` · `lib/troly-baocao.ts` · cửa gọi `fn_troly_bao_cao_lay(p_so_ngay, p_tinh_lai)`)
- **Của ai:** mỗi người quản một MẢNG có một BỘ báo cáo. Bản này là của **Trang (Sư phạm)**. **Lộc (Vận hành — mọi thứ không thuộc sư phạm,
  gồm bổ trợ đuổi, xếp bù, xếp lịch) CHƯA có bản, chưa có mẫu.**
- **Logic 3 luồng, mục nào cũng đủ:** ① đếm việc **chậm / miss** → ② nút **Detail**, bấm mới hiện từng việc (ngày · đối tượng · việc · người phụ
  trách · hạn · tình trạng) → ③ **cảnh báo** rủi ro/bất thường. Mặc định đóng hết. Đơn vị = **VIỆC có người phụ trách**, cửa sổ 7/14/30 ngày.
- **Mục:** BTVN · ET · Đánh giá trong buổi · Đánh giá sau buổi · Bổ trợ bù · Bổ trợ yếu (+ "Theo người phụ trách" + cảnh báo chung).
- **Luật đếm:** miss = không có đề/không gán bài · bấm đóng mà trống · đóng mà còn em có mặt thiếu dữ liệu · ca bổ trợ không test.
  "Đóng muộn" đếm RIÊNG, không gộp vào chậm. **"Học sinh không đến" là thông số RIÊNG**, không tính miss. "Không có đề" chỉ là miss với lớp
  THẬT SỰ chạy khâu đó (≥60% buổi/60 ngày). **Chấm bài trên lớp chỉ bắt buộc từ 01/10/2026** — trước mốc không sinh việc ở báo cáo.
- **BTVN có 2 phần:** *trợ giảng chấm* (việc + **tỉ lệ nộp đạt chuẩn theo lớp**: đạt = đã nộp + có thái độ + có điểm chấm; thiếu thông tin = không
  đạt; **"xin phép" vẫn là chưa nộp**; lớp dưới **70%** = tệ; Detail = lớp → buổi → em không đạt + TA phân công + người chấm thực tế) và
  *học sinh làm bài* (các cảnh báo). **ET KHÔNG có phần tỉ lệ nộp** (đi học là có ET) — đừng đề xuất lại.
- **Người phụ trách + hạn lấy từ `fn_viec_buoi_thuong`**, không định nghĩa lại. Trưởng vận hành tra theo ghế (`_troly_truong_van_hanh()`), không gõ tên.

**② TỔNG KẾT TUẦN** (`TongKetTuan.tsx` · `lib/troly-tuan.ts` · cửa gọi `fn_troly_tuan_lay(p_tuan, p_tinh_lai)`)
- Trả lời câu KHÁC báo cáo: báo cáo = "việc nào hỏng, của ai"; tổng kết = "cả hệ chạy tốt tới đâu". Không gộp.
- **Dựng theo BẢNG, mỗi mảng một bảng, cùng bộ cột** (tuần này · tuần trước · thường đạt · so với thường đạt · xu hướng 8 tuần). Bảng đầu = **Cần chú ý**
  (chỉ số đang dưới thường đạt). 7 mảng: việc sau buổi (đúng chuẩn/chậm/thiếu, Detail = **xếp hạng GV–TA, không tính Thùy và Trang Phạm**) · quy mô &
  chuyên cần · kết quả học tập · bổ trợ yếu · bổ trợ bù · bổ trợ đuổi · tuyển sinh. **Học phí KHÔNG đưa vào.** Để thẳng trên ERP (không xuất HTML rời).
- **THƯỜNG ĐẠT** = trung bình **8 tuần liền trước** tuần đang xem, **sau khi lọc nhiễu** (hàng rào Tukey 1,5×IQR). Xấu hơn ≥1 độ lệch chuẩn = "dưới
  thường đạt", ≥2 = "vấn đề". <4 lần đo = chưa đánh giá. Tuần mà mảng chưa chạy trên hệ KHÔNG phải lần đo (số `neo`). Chỉ số còn đổi sau khi tuần kết
  thúc (bù, trả kết quả test, điểm BTVN) ghi "chưa chốt" 7 ngày đầu. Mọi hệ số ở `_troly_bc_gia_dinh()`.
- **Mẫu số việc sau buổi = việc đã tới hạn hoặc đã đóng**; việc còn trong hạn để riêng.
- **Trình chiếu:** mỗi bảng MỘT màn vừa khít, chuyển ‹ Trước / Sau › + phím mũi tên + mục lục; là lớp phủ kín cửa sổ, toàn màn hình chỉ cộng thêm.
  Nút "Số từng tuần" đổi nét vẽ thành số.
- **Tự tính sáng thứ Hai 07:00** — `api/troly-tuan.mjs` + cron `0 0 * * 1` + `fn_troly_tuan_tu_dong(secret, app)`. **CHƯA chạy thật:** cần khai
  `TROLY_PUSH_APP=pt` trên Vercel project pt rồi deploy. Máy nhận hiện có: Thùy, Trang (app pt); **Lộc chưa đăng ký nhận tin**.

**KHÔNG REALTIME (CEO 29/09):** lượt mở đầu trong ngày thì tính, **lưu DB**, mở lại đọc bản lưu; "↻ Tính lại" ghi đè. Bảng `troly_bao_cao_luu`
(bo = `su_pham` | `tuan`) giữ bản đã dựng; `troly_tuan_so_luu` giữ số TỪNG TUẦN (nguồn của thường đạt, đủ từ 15/06). Bản lưu tổng kết mang
`phien_ban` cách tính — đổi luật thì tăng `_troly_tuan_phien_ban()`, bản cũ tự tính lại.

**BẢN ĐỒ DB (đều `fn_`/`_troly_`, tìm trong `schema.md`):**
- Nguồn phân loại việc DUY NHẤT: `_troly_viec_buoi_goc` (mọi việc + nhãn). `_troly_bc_viec_buoi` chỉ là lớp mỏng. Ca bổ trợ yếu: `_troly_ca_yeu_goc`.
- Báo cáo: `fn_troly_bao_cao` ← `_troly_bc_viec_buoi/_bu/_yeu` · `_troly_bc_canh_bao` · `_troly_bc_thong_so` · `_troly_bc_btvn_ti_le` · `_troly_bc_them`.
- Tổng kết tuần: `_troly_tuan_so` + `_troly_tuan_hoc_tap/_duoi/_tuyen_sinh` → `_troly_tuan_so_day_du` → `_troly_tuan_cap_nhat` (ghi số tuần) →
  `_troly_tuan_doc` (dựng dashboard + thường đạt) · `_troly_tuan_xep_hang` · **danh mục chỉ số ở MỘT hàm `_troly_tuan_danh_muc()`** (thêm chỉ số = thêm 1 dòng).
- Hai cửa `_lay` là `SECURITY DEFINER`; mọi hàm tính bên trong đã thu quyền của `authenticated`/`anon`.
- 13 công cụ tra cứu `_troly_cc_*` + `fn_troly_goi` + `fn_troly_danh_muc` (mig 202609290143) — **đã có ở DB, CHƯA nối vào khung hỏi.**

**KIỂM:** `node scripts/check-troly-cong-cu.mjs` (mọi thứ trong 1 transaction rồi ROLLBACK, giả JWT): mặc định = cổng + 23 ca công cụ ·
`--bao-cao [ngày]` · `--lay` · `--tuan [ngày]` · `--thu <file.sql>` áp THỬ migration trước khi gọi. ⚠ Script nối bằng role chủ bảng ⇒
**không kiểm được RLS và trần 8 giây** — hai thứ đó chỉ kiểm được trên app với phiên đăng nhập thật.

**KHUNG HỎI + CÁC TAB CŨ (12–19/08) — còn chạy, gần như không ai dùng:**
- Đo 29/09: tab Trợ lý 21 câu cả đời, 3 nút Làm/Huỷ/Gác không ai bấm từ 12/08. Trong 14 câu hỏi thật, ~11 câu không ra thứ người hỏi cần:
  khung hỏi mù với các tab ngay dưới nó · danh mục thiếu ET · kết quả công cụ không quay về model · bảng sạch phình 10k → 42k token/câu.
- Khung hỏi gọi thẳng `api/troly.mjs` (Vercel, đồng bộ). Nhà cung cấp đổi bằng biến môi trường (`anthropic` / `moonshot` / `deepseek`), log token + tiền mỗi lượt.
  Ranh giới giữ nguyên: CODE tính số, MODEL chỉ đọc bảng sạch rồi trò chuyện. Đo 12/08: ~14 giây/câu, ~790 đ/câu (tiền nằm gần hết ở đầu vào).
- Các tab Trợ lý thấy gì · Vận hành · Bổ trợ bù/đuổi/yếu · Kiểm tra đầu vào · Việc của bạn vẫn tính ở CLIENT (`lib/troly*.ts`). **Mảng Yếu và Test đầu vào
  lỗi thời** (Yếu còn đếm cờ thô trong khi `bo_tro_yeu` đã là luồng thật) — chưa gỡ.

**⚠️ CÒN TREO:**
1. **Báo cáo Vận hành của Lộc** — cần CEO đưa mẫu.
2. **Deploy + khai `TROLY_PUSH_APP`** để thông báo thứ Hai chạy; Lộc đăng ký nhận tin.
3. **`fn_viec_buoi_thuong` vẫn sinh việc** "chấm bài trên lớp" cho buổi trước 01/10 và việc BTVN cho buổi không được gán BTVN ⇒ màn Việc của tôi,
   hiệu suất, gậy đang tính oan. Báo cáo đã bỏ qua, engine việc thì CHƯA — sửa engine phải hỏi CEO.
4. **"Chuyển lịch" bổ trợ chưa đo được:** hệ không ghi vết đổi ngày/giờ buổi bổ trợ; số gần nhất là "OPS gỡ ở Lịch phòng". Cần trigger ghi lịch sử.
5. **3 dòng của mẫu báo cáo chưa có nguồn dữ liệu** (báo cáo nói thẳng, không bịa): HS làm bài chậm hơn lớp (`gami_grades.speed` 100% mặc định) ·
   "không làm BTVN đã tác động đến đâu" (không bảng nào ghi) · danh sách CHỜ duyệt bổ trợ (engine phát hiện còn ở client).
6. **Các con số của thường đạt đang là số em tự đặt** (1,5×IQR · 1σ · 2σ · tối thiểu 4 lần đo · chưa chốt 7 ngày) — chờ CEO chỉnh. SPEC §7.3.
7. Nối khung hỏi vào `fn_troly_goi` · gỡ mảng Yếu/Test lỗi thời · toàn màn hình thật + bút trình chiếu chưa kiểm được.
8. Treo từ 12/08, CHƯA kiểm lại: Level thiếu 2/3 loại kỳ thi nên không chốt được.

**SỐ MỐC để đối chiếu (tính 29/09):** báo cáo 14 ngày 16–29/09: 59 chậm · 48 miss · 29 lượt HS không đến · 73 đóng muộn; **87% buổi bấm đóng "chấm bài
trên lớp" mà không có dòng chấm nào**; 7 lớp có buổi mà chưa phân công đủ GV/TA. Tuần 21–27/09: việc đúng chuẩn cả trung tâm 63,1% (ET 86,2 · đánh giá
56,5 · BTVN 36,4); **vấn đề:** HS nộp BTVN đạt chuẩn 67% (thường đạt 84) · 11 lớp nộp dưới ngưỡng · 13 HS bị GV báo động · điểm ET TB 78,2% (82,2);
bổ trợ yếu: cần 120 case, lên lịch 20,8%, đã bổ trợ 10,8%, sự cố 59,4% lượt, duyệt → xếp lịch TB 12,5 ngày.

**HẠ TẦNG dựng từ 12/08 (độc lập trợ lý, còn dùng):**
- **`npm run migrate`** — sổ `_migrations` (tên + vân tay sha256), ghi TRONG CÙNG transaction. `--status` xem thuần · `--only <tên file>` áp 1 file ·
  `--baseline <file>` dựng sổ cho DB cũ · DB có bảng mà chưa có sổ ⇒ **từ chối chạy** + in đúng lệnh. Sửa file đã áp ⇒ nêu cờ, KHÔNG áp lại.
- **`npm run schema` dump được VIEW** + **canary RLS** ghi cảnh báo thẳng vào đầu `schema.md`.
- **`scripts/census-dulieu.mjs`** — bản đồ dữ liệu thật (bảng sống / nguội / rỗng / bị RLS che).
- **`scripts/check-troly.mjs`** — oracle SQL độc lập cho các tab cũ, kiểm "sai đọc = 0%".
- **`viec.nghiem_thu_nguon`** (`nguoi`/`tu_dong`).

### Chuỗi đã dò xong #1 — TEST ĐẦU VÀO (12/08, chờ 1 câu để kích hoạt)

**⭐ KHUÔN DÒ 1 CHUỖI (~30 phút) — dùng lại cho mọi chuỗi sau:**
① chuỗi mấy khâu, mốc nào **đã có cột** trong DB? (thường ĐÃ CÓ SẴN)
② ai **NỢ** mỗi khâu, suy từ dữ liệu nào? (hệ ghi đủ *ai đã làm*, thiếu *ai đang nợ*)
③ hạn mỗi khâu?
④ **dữ liệu định tuyến có đủ ĐỘ MỊN không?** (ít ai nghĩ tới mà lại là chỗ chặn thật)

⇒ Câu hỏi đúng KHÔNG phải *"quy trình có đúng không"* — quy trình trong đầu CEO đã đúng và rõ —
mà là **"hệ có đủ dữ liệu để CHẠY quy trình đó không"**.

**Chuỗi:** HS test → thu bài/scan → chấm → trả kết quả.
Bảng `ca_test` **đã có sẵn đủ 4 mốc**: `hoan_thanh_at` · `bai_url` · `cham_xong_at` · `tra_bai_xong_at`
(cùng khuôn `*_dong_at` của `buoi_hoc`/`bo_tro_duoi`). ⇒ **KHÔNG cần bảng mới**, chỉ khai ai-nợ + hạn.
⭐ Chấm/trả vẫn làm NGOÀI hệ được — **nhắc chỉ cần MỐC THỜI GIAN, không cần nội dung bài.**

**LUẬT TRẢ KẾT QUẢ (CEO chốt 12/08) — key: `ung_vien.khoi` + nhánh lớp:**

| khối | ai trả |
|---|---|
| 3 · 4 · 4T · 5 · 5T · 6 | **Thùy** |
| 7 · 8 · 9 | **Trang** |
| Cấp 3 (10·11·12) nhánh **A** | **Trang** |
| Cấp 3 nhánh **B** và **C** (gồm 12C) | **Đạt** |

**⚠ CHẶN KỸ THUẬT:** cấp 3 phân theo NHÁNH lớp (A/B/C) nhưng `ung_vien.khoi` chỉ ra `'11'`/`'12'`,
không có nhánh; `lop_du_kien_id` **null ở cả 4 ca**. CEO chốt: **thêm ô chọn lớp dự kiến lúc tạo ca
test** (cột đã có sẵn, chỉ chưa ai điền). Trước khi có ô đó, ca cấp 3 KHÔNG định tuyến được.

**⚠ CHỜ 1 CÂU ĐỂ KÍCH HOẠT:** **AI CHẤM** — đúng khâu đang tắc cả 4 ca. (Ai thu bài/scan: nhiều khả
năng quản lý học tập, cần chốt người cụ thể.)

**Dữ liệu thật đang treo (đo 12/08) — cả 4 đã scan bài rồi NẰM IM, `cham_xong_at` NULL:**
Minh Phúc (4T · 29 ngày → Thùy) · Lã Gia Huy (K11 · 34 ngày → chưa định được) ·
Nguyễn Bá Thiện Minh (K7 · 32 ngày → Trang) · Nguyễn Test QA (K8 · data QA).
**Đây đúng loại việc CEO hay miss — nằm sẵn trong DB hơn 1 tháng, chỉ chưa ai nhìn.**
*(Cập nhật 09/09: 4 ca này + Nguyễn Thắng Tùng 07/09 vẫn treo, và nguyên nhân gốc đã rõ — cả 5 đều KHÔNG có đề
gán nên không vào được hàng đợi chấm. Đường cứu = card "Gán đề đang dùng" trong Chấm test, xem mục 09/09 tối.)*

**⚠ ĐỪNG KHAI HÀNG LOẠT:** khai 2–3 chuỗi rồi **CHẠY THẬT 1 TUẦN** xem nhắc có đổi hành vi không.
Hệ này đã 4 lần dựng năng lực rồi bỏ không dùng (`viec` 15 dòng đứng im · `bo_tro_yeu` không có đường
ghi · `hs_level` 0 dòng · `viec_van_hanh_duyet` 0 dòng) — khai hàng loạt trước khi biết nhắc có tác
dụng là lần thứ năm. Thứ tự: đi từ **chỗ CEO hay miss**, KHÔNG theo sơ đồ tổ chức.


### ⭐ CÁCH LÀM ĐỂ HOÀN THIỆN DỮ LIỆU — chốt 12/08 (tối ưu THỜI GIAN CỦA CEO)

Mục tiêu CEO đặt: *"hoàn thiện được bảng dữ liệu nhanh nhất và tốn ít thời gian của t nhất"*.
Nút thắt KHÔNG phải công cụ mà là **thời gian của người**.

**VÒNG LÀM VIỆC (3 việc cần CEO, mỗi việc vài phút):**
1. **Claude chạy `node scripts/do-chuoi-tac.mjs [số ngày]`** → danh sách chuỗi đang tắc, xếp theo mức
   tắc. ⇒ CEO **không phải nhớ ra** có những quy trình nào.
2. **CEO kể FLOW đúng như trong đầu** (~2 phút, không phải tra cứu gì).
3. **Claude đối chiếu DB với flow đó** → trả về **ĐÚNG MỘT BẢNG**: khâu nào đã có chỗ ghi, khâu nào
   chưa, ai-nợ suy được hay không, thiếu dữ liệu định tuyến ở đâu.
4. **CEO điền chỗ trống — MỘT LẦN.**

**⭐ VÌ SAO CEO KỂ FLOW TRƯỚC, KHÔNG PHẢI CLAUDE ĐỌC DB TRƯỚC** (CEO đề xuất, đúng hơn ý Claude):
**DB không bao giờ nói được cái gì ĐÁNG LẼ phải xảy ra.** Claude đọc trước rồi tự dựng nháp = lại suy
quy trình từ dấu vết — đúng cái bẫy đã dẫm 5 lần trong ngày. CEO nói intent (rẻ, có sẵn trong đầu) →
Claude chỉ còn ĐỐI CHIẾU, mà đối chiếu thì máy làm chuẩn.

**⚠ LỖI QUY TRÌNH ĐÃ MẮC 12/08:** chuỗi test đầu vào tốn của CEO **3 lượt** chỉ vì Claude **hỏi trước
khi đọc xong** (hỏi ai-trả → phát hiện thiếu 4T/5T → hỏi lại → phát hiện thiếu nhánh A/B → hỏi lại).
**LUẬT: đọc HẾT rồi mới hỏi, và hỏi MỘT LẦN.**

**CÔNG CỤ MỚI `scripts/do-chuoi-tac.mjs`:** hệ mô hình hoá chuỗi bằng **cột mốc thời gian**
(`*_dong_at`/`*_xong_at`/`hoan_thanh_at`/`duyet_at`/`day_at`). Chuỗi tắc = mốc đầu ĐÃ điền, mốc sau
CÒN TRỐNG, đã lâu. Script quét mọi bảng, dựng phễu, xếp theo mức tắc. Bỏ qua bảng bị RLS che.
⚠ **MÁY ĐỀ CỬ, KHÔNG PHẢI KẾT LUẬN** — ô trống có thể là *chưa làm* HOẶC *không áp dụng*; DB không
phân biệt được. Chỉ dùng để biết **CHỖ ĐÁNG HỎI**.

**KẾT QUẢ QUÉT ĐẦU (≥20 ngày): 21 mốc / 11 bảng.** Đáng chú ý:
- `prep_phong` — 341/347 đã đóng, nhưng `gv_cham_at` **1/347** · `leader_chot_at` **14/347** ⇒ khâu làm
  chạy đều, hai khâu chấm+chốt phía sau gần như trắng.
- `hoc_phi_xet_duyet` — **0/7 được duyệt**, cũ nhất 38 ngày (dính tiền).
- `vh_ops_task.duyet_at` — 427/447 chưa duyệt · `bai_test` — `dong_at`+`deadline` trống hoàn toàn (31 dòng)
- `bo_tro_duoi.dang_duyet_at` — 21/42 chưa duyệt dạng · `ca_test` — 3 mốc cuối trắng, 36 ngày.

**⭐ NHỚ KHI CHẠY VÒNG NÀY:** mỗi lần CEO kể một chỗ hay miss, hỏi kèm **"miss cái đó thì AI chịu hậu
quả, và hậu quả GÌ"**. CEO 12/08: *"có những việc ko có hậu quả cũng ko có tác dụng lớn nên chưa làm
vì bận"* ⇒ **nhắc chỉ đẩy được thứ CÓ hậu quả**; thứ thật sự vô hậu quả thì nhắc = nhiễu, và câu trả
lời đúng là HUỶ chứ không phải nhắc gắt hơn. Hai loại này nhìn giống hệt nhau trong DB (cùng là ô
trống) nhưng cần hai cách xử NGƯỢC nhau.

**ĐO ĐỂ BIẾT KHAI CHUỖI NÀO TIẾP — dùng chính 3 nút:** loại việc toàn bấm **Làm** = vô hình mà thật,
nhắc đang có tác dụng, khai thêm chuỗi cùng họ · toàn **Huỷ** = thật sự vô hậu quả, ngừng nhắc ·
toàn **Gác** = có hậu quả nhưng chưa tới lúc, nhắc lại đúng hẹn là đủ.

### 08-14 — Test đầu vào: assign người chấm/trả bài dự kiến (đã merge main)
`ca_test` có thêm 2 cột `nguoi_cham_id`/`nguoi_tra_bai_id` (FK `nhan_su`, nullable) — điền lúc "+ Tạo
test đầu vào" hoặc sửa sau ngay trên card, **chỉ để BIẾT trước ai dự kiến làm, KHÔNG khoá hàng đợi**
Chấm/Trả bài (vẫn pool chung, "ai mở thì làm" — nguyên tắc 07-19 giữ nguyên). Dropdown chọn người: TOÀN
BỘ `nhan_su_mon` của môn ca đó (không curate/roster riêng — thử rồi bỏ, xem ② mục PURE-DERIVE), chỉ ưu
tiên hiển thị nhóm **"Gần đây"** = ai từng được gán gần nhất cho môn đó (derive từ lịch sử `ca_test`,
hàm `listNguoiChoCham`/`listNguoiChoTraBai` ở `tuyensinh.ts`). Badge tên hiện ở Chấm test/Trả bài. Chưa
có màn báo cáo nào nối vào 2 cột này (Thùy có ý muốn báo theo người-được-assign) — khi làm thì join
thẳng `ca_test.nguoi_cham_id`/`nguoi_tra_bai_id`, data đã sẵn, không cần thêm gì ở tầng data.

### Bot hỏi–đáp nhân sự "💬 Hỏi hệ thống" (29/08 — chạy production)
- **Luồng:** nhân sự hỏi trên ERP (tab thứ 4 trong Việc của tôi, KHÔNG đẻ leaf — cùng lý do TroLyTab) → job vào `hoi_dap_nhan_su` → bot **Claude Code chạy máy local** (`scripts/hoidap/bot.mjs`) claim atomic, đọc repo + tra DB, ghi `tra_loi` → UI poll 5s tự hiện. Phân vai với tab 🤖 Trợ lý: trợ lý đọc bảng sạch ngày; bot này trả lời "vì sao/quy trình" **+ số liệu** (CEO: "bản chất vẫn là trợ lý cũ, chạy bằng Claude Code").
- **Pilot 3 người** (Thùy · Phạm Thị Thùy Trang · Trần Bảo Lộc): nguồn chân lý = hàm DB `hoi_dap_duoc_dung()` (mig `202608291205`) — RLS chặn thật, UI rpc cùng hàm để ẩn tab. Mở rộng = 1 migration mới thay hàm, KHÔNG đụng client.
- **Số liệu theo nguyên tắc "AI chọn lệnh, không viết SQL":** kho 11 lệnh viết sẵn `scripts/hoidap/tools.mjs` (thieu_btvn · vang_hoc · bang_elo_exp · hoc_tap_hoc_sinh · hoc_phi_no · viec_dang_treo · buoi_hom_nay · tuyen_sinh_dem · diem_et · diem_mt · bo_tro bu/duoi/yeu) + runner `tracuu.mjs` (key=value, `begin transaction read only`, parameterized). SELECT tự do (`query.mjs`) = fallback; câu nào rơi vào fallback nhiều → thăng cấp thành lệnh. Thêm lệnh: entry mới trong tools.mjs + test `tracuu.mjs <lệnh> key=value` ra data thật (xem `scripts/hoidap/README.md`).
- **Vận hành trên máy CEO (DESKTOP-EV1E49J):** listener chạy TỪ WORKTREE `wt-bot` (đứng cố định ở main) — Startup `.cmd` + Task Scheduler lưới vớt 15' đều trỏ wt-bot. Auth = `ANTHROPIC_API_KEY` (.env.local — CLI local không login; daemon dựa login CLI là chết định kỳ). Heartbeat `hoi_dap_bot` 60s → UI báo "bot mất liên lạc" khi quá 10'. Claude trong bot: allowedTools chỉ Read/Grep/Glob + 2 script tra cứu — không Bash tự do/Write/Edit; câu hỏi vào qua stdin.
- ⚠ **Bố trí ĐỔI 01/09** (xem mục "Bố trí worktree" ở ①): `main` giờ ở checkout chính
  `bkdemy-erp-v2`, `wt-bot` sang **detached** — bot vẫn chạy y nguyên từ `wt-bot`, nhưng `git pull`
  trong đó hết ăn: pull main ở checkout chính rồi `git -C ../wt-bot checkout main --detach` để bot
  ăn code mới. Bài học gốc vẫn giữ: checkout chính là **sân chung nhiều phiên Claude** — trước khi
  merge/commit phải xem mình đang đứng nhánh nào (29/08 đã merge nhầm vào feat/app-ops, CEO reset gỡ).
- Bẫy schema đã cắn khi viết 11 lệnh (chi tiết DEVLOG 29/08): `btvn_ket_qua` dùng `trang_thai_nop` (hoan_thanh/dung_han đời cũ); lịch ngày derive từ `thoi_khoa_bieu` vì `buoi_hoc` chỉ có dòng khi ĐÃ MỞ (thu = isodow+1); Realtime chỉ bắn INSERT + listener phải restart sau khi đổi publication; policy dùng `public.jwt_uid()` không phải `auth.uid()`.

### ⭐ Chiến dịch "hạ tính toán xuống DB" — Phase 1+2 XONG · Phase 3 ~75% (đến hết 30/08)
- Luật CLAUDE.md **§2.0** (CEO chốt 30/08): mọi query tổng hợp + tính toán nghiệp vụ ở
  Postgres; client & AI chỉ gọi hàm sẵn (`rpc` / catalog bot). Code MỚI phải theo ngay.
- Checklist sống = `AUDIT-client-tinh-toan.md` (tick từng đợt, migration nào, parity nào) —
  ĐỌC FILE ĐÓ trước khi làm tiếp, đây chỉ là tóm tắt:
  - **XONG:** Phase 1 (13/15 gốc tính-rồi-ghi-ngược → trigger/RPC: điểm chấm test, trạng thái
    thu tiền, điểm/verdict MT, hiệu suất nghiệm thu+duyệt, gậy, NGUYÊN engine Elo/EXP, TLN
    normalize+chấm lại) · Phase 2 (tiền 100% — hocphi.ts thành seam mỏng; phiếu & bảng cùng
    1 nguồn số `hoc_phi_theo_mon_ky`) · Phase 3a/b/c (fn_mastery_cells parity 391/391 +
    Hình + ma trận lớp + completion + fn_rank_diem_mt).
  - **CÒN:** `getTongQuanHS` (mastery.ts) · `getStatSheetLop`+`listCandidatesLop` (danhgia.ts
    — rule engine, ổ NẶNG cuối) · `nguongTuCohort` (troly.ts, percentile_disc) · Phase 4
    (quét lớn còn lại + task-engine getMyTasks/listAllStaffTasks/quetGayTuDong + 68 VỪA + 27 NHẸ).
- **Phương pháp bắt buộc mỗi đợt** (đã bắt được 4 bug thật nhờ nó): parity số cũ=mới trên DB
  thật TRƯỚC khi cắt → áp migration → smoke bằng transaction ROLLBACK (giả JWT qua
  `set_config('request.jwt.claims',...)`) → client mỏng gọi rpc → tsc+build → tick AUDIT.
- Bẫy port JS→SQL (chi tiết DEVLOG 30/08): `Math.round` JS = floor(x+0.5) ≠ round() SQL số âm
  (dùng `fn_jsround`) · `\b` JS là ASCII (bug thật đã vá 2 phía) · jsonb scalar bóc `#>>'{}'` ·
  `substring(from pattern)` PG trả nhóm ngoặc đầu · tie-break xếp hạng phải TẤT ĐỊNH.
- ~~Thi công trong worktree `wt-bot` (đứng cố định ở main)~~ → **ĐỔI 01/09, xem "Bố trí worktree"
  ngay dưới**: nhánh `main` giờ nằm ở checkout chính `bkdemy-erp-v2`.

### ⭐ 4 APP RIÊNG CHO 4 VAI (HS · OPS · TA · GV) — trạng thái đến hết 31/08
- **Khuôn:** mỗi app = **1 entry Vite riêng trong CÙNG repo** (không đẻ repo mới): `index.html`
  (ERP desktop) · `hs.html` · `ops.html` · `ta.html` · `gv.html`; mỗi cái 1 `vite.config.<x>.ts`,
  `dist-<x>`, scripts `dev:x|build:x|preview:x`, PWA + màu riêng (HS da trời `#087fc6` · OPS indigo ·
  TA teal `#0d9488` · GV lá cây `#16a34a`), **5 project Vercel**. Làm app mới = **nhân bản app gần
  nhất**, KHÔNG import ngược màn ERP desktop (cấm `useStore`/`BuoiHocScreen`/screens kho — bundle
  phình + logic desktop không hợp cảm ứng). Gate 3 tầng chặn HS → profile → `my_quyen`.
- **Dùng CHUNG engine với ERP, app chỉ là mặt:** việc = `getMyTasks` lọc `TASKS_BY_VAI[vai]` (engine
  0 sửa mỗi lần thêm app) · chấm vẫn `gami_grades` + `fn_dong_phase`/`fn_dong_btvn` · góp ý vẫn
  `bao_loi`. Thêm app KHÔNG được đẻ hệ chấm/thông báo thứ 2.
- **App TA (30/08) + luồng PH NỘP BTVN ẢNH:** 5 màn (Home việc-của-tôi · ChamBuoi ingame/ET ·
  ChamBtvn hợp nhất 2 đường nộp · Dash tháng · góp ý). DB: `btvn_nop`/`btvn_nop_anh` (ảnh gốc
  immutable, `path_cham` riêng; bucket **private** `btvn-nop` nên DB lưu PATH, hiện = signed URL) ·
  `btvn_nhan_xet_mau` (8 mẫu, TA CHỌN không gõ) · role **`ph_nop`** chỉ EXECUTE 2 RPC nộp = đường
  ghi DUY NHẤT của PH (không nới FDW ghi) · 5 view FDW gate `tra_at` để trả bài. PH **không chọn
  buổi** — hệ gán tạm buổi gần nhất, **TA chốt buổi** trong màn chấm (pattern đề-xuất → người
  confirm, giống chip trạng thái nộp).
- **App GV (31/08):** 5 tab (Hôm nay · Việc chấm · Học sinh · Lớp · Của tôi). `DanhGiaPanel` viết
  MỚI touch-first (ERP desktop `DanhGiaTab` 2100+ dòng, cấm import) + **🚨 chuông đỏ bổ trợ ghi chú
  BẮT BUỘC** (`canh_bao_yeu.nguon='danhgia'` tự chảy vào luật duyệt bổ trợ, 0 công engine) · MT
  **theo tháng + rank khối** (không có khái niệm "trung bình MT" — CEO chốt) · `fn_rank_diem_mt_lop`
  batch để né N+1 RPC. **Dashboard GV mới TẦNG A (kỷ luật)** — tầng B (chất lượng đánh giá) và C
  (outcome) chờ thống nhất bộ chỉ số, UI nói thẳng "🔜 sắp có".
- **Dashboard tháng TA/GV:** bar = **đạt-chuẩn / đến-hạn** (chậm = không đạt · chất lượng duyệt <80
  = không đạt) · **thiếu dữ liệu CHẶN đóng** (`fn_dong_phase` v4) · TA thấy MÌNH + TOP 3, ngưỡng ≥10
  việc · 100% + đủ 10 việc = **mốc thưởng tiền** hiện trên bar. **Người bị ẩn xếp hạng**
  (`nhan_su.an_xep_hang`, data-driven không hard-code tên) không có rank/không vào mẫu số, nhưng bar
  + stat của chính họ vẫn tính. Đã seed đúng 2 người (NS001, NS002).
- **⭐ `fn_dong_phase` v5 (31/08, CEO):** guard đủ-dữ-liệu **chỉ áp ET/MT**; **ingame cho đóng
  trống** ("chấm bài trên lớp không bắt buộc có dữ liệu"). Đây là nới **TẠM THỜI** — siết lại phải
  bằng migration mới, đừng tưởng guard v4 còn nguyên.
- **Backfill hành chính đã chạy (đừng làm lại):** đóng khâu Đánh giá **mọi buổi < 23/08** + đóng
  task 2 lớp **8S0 + 12A1**. Luật của loại thao tác này: chỉ điền mốc đang NULL, **mốc = 23:00 VN
  NGÀY BUỔI** (không phải `now()`) để dashboard không tính "đóng muộn" trừ oan bar của GV/TA; buổi
  `trang_thai='huy'` cố ý bỏ qua (còn 47 buổi NULL đều là huỷ — ĐÚNG, không phải sót).
- **CÒN TREO (31/08):** dashboard GV tầng B/C · 4 nhánh chưa merge (`feat/app-ops`, `feat/app-ops-ui`,
  `feat/fix-lane-v2`, `hocphi/phat-sinh-hs-nghi`). (E2E nộp BTVN ảnh đã xong 09/09 — khối dưới.)

### ⭐ BTVN ẢNH end-to-end — ĐÃ CHẠY THẬT TRÊN PROD (09/09)
- **Luồng:** PH (`ph.bkacademy.edu.vn`, repo `bkdemy-ph-app`, Supabase riêng) chụp/chọn ≤12 ảnh → **nén ở client**
  (HEIC→JPEG `heic2any`, cạnh dài ≤1600, q0.8 → ~200–450KB/ảnh) → PUT thẳng lên storage ERP `btvn-nop` bằng **signed upload
  URL** server cấp → `nopBtvn(childId, paths)` kiểm path/size/mime qua `storage.list` → pg role `ph_nop` gọi
  `fn_btvn_nop_tao_auto` → ERP gán **buổi thường gần nhất ≤ hôm nay, KHÔNG có `mt_buoi`** (mig 202609091810 + 1959; CEO: nộp
  muộn/bù thì TA chuyển buổi). TA (`ta.bkacademy.edu.vn`, `src/screens/ta/ChamBtvn.tsx`) chốt buổi → vẽ → Đ/C/S → nhận xét
  → Trả bài → PH xem ảnh chấm + kết quả từng câu + nhận xét (4 view FDW, mig PH `0027` đã áp).
- **Màn chấm TA (v2):** full-screen 1 HS, `landscape:` 70/30 (ảnh+tool | form) · portrait xếp dọc · HS không ảnh = chấm giấy chỉ form.
  Tool: Màu 🔴🔵⚫ (áp Bút + Chữ) · Bút · Tẩy (`destination-out`, chỉ xoá nét) · **Đ / S** đỏ · ◯ Khoanh / ▭ Khung kéo · Aa Chữ (ô nhập
  tại chỗ, Enter/blur lưu) · Cỡ chữ số kiểu Paint 14–72 (px = co × W/800) · ↩ Hoàn tác/Ctrl+Z (theo TRANG) · **↺ Làm lại trang**
  (`path_cham=null`, ẩn khi đã trả) · "✓ Đã lưu trang" flash 2.5s. Nét = canvas trong suốt đè `<img>`; Lưu = ghép 2 lớp → PNG
  mới (`uploadAnhCham`, ảnh gốc immutable, PNG cũ thành mồ côi — bucket không policy delete). Nháp theo trang giữ ở `marksRef`
  (memory, mất khi đóng màn). Phím tắt 1/2/3 màu · B · E · D · S · O · R · T.
- **Hạ tầng đã chốt:** `ERP_SUPABASE_SERVICE_ROLE_KEY` nằm trên Vercel PH (CEO chốt giữ thiết kế 30/08; Storage REST cần JWT,
  `ph_nop` không thay được; `lib/erp.ts` có `import "server-only"`, build → 0 client chunk chứa key). `PH_NOP_DATABASE_URL` phải
  dạng **pooler** `ph_nop.<ref>@aws-1-ap-southeast-1.pooler…` (host `db.<ref>` chỉ IPv6 → ENOTFOUND ở dev lẫn Vercel).
  TaHome "Đã xong" sắp theo ngày buổi, 60 dòng. Prod TA phải **Create Deployment tay** — auto-deploy Git của project
  `bkdemy-erp-v2-ta-v2` không bắn (chưa rõ vì sao; gv/ops/hs có thể cùng cảnh).
- **CÒN TREO (09/09):** Apple Pencil trên iPad với tool v2 · object mồ côi trong `btvn-nop` khi RPC fail sau upload · PH xem
  ảnh đã nộp TRƯỚC khi trả (cần view ERP mới + FDW) · `BtvnTab` ERP desktop vẫn tool cũ · push "bài đã chấm" · **sau pilot:**
  bot account Auth ERP thay service key (HANDOFF PH §12.1) · tìm vì sao Vercel TA không auto-build.

### Role `claude_ro` THẬT (09/09) — `npm run schema` + dò dữ liệu từ máy Claude
- Mãi tới 09/09 DB **chưa từng có** role này (CLAUDE.md §2.1 mô tả ý định từ 12/08). Tạo qua SQL Editor: `pg_read_all_data` +
  policy `claude_ro_select for select using(true)` trên 202 bảng RLS (bypassrls cần superuser, `postgres` Supabase không phải).
  Tạo policy cần chủ bảng → `grant claude_build to postgres`. Verify: đọc `hoc_sinh` 442 dòng, INSERT/CREATE "permission denied".
- `.env` checkout `Desktop\2\…` có `DATABASE_URL_RO` (pooler `claude_ro.<ref>`). `migrate.mjs` tự thêm policy cho bảng RLS mới
  (chỉ bảng role ghi sở hữu; 6 bảng của `postgres` phải chạy DO block tay). Canary `introspect.mjs` giờ xét policy — hết cảnh báo giả.

### Bố trí worktree trên máy CEO (ĐỔI 01/09 — CEO chốt)
- **Nhánh `main` đứng ở checkout chính `bkdemy-erp-v2`** (trước 01/09 là `wt-bot` giữ). Làm việc
  hằng ngày / pull main → ở đây.
- **`wt-bot` sang detached HEAD**, giữ đúng code commit đang chạy. Bot hỏi–đáp vẫn chạy từ đường dẫn
  cũ (Startup .cmd + Task Scheduler trỏ `wt-bot`), **không đổi 1 dòng code**. Đánh đổi đã biết: nó
  KHÔNG tự theo main nữa ⇒ **pull main xong, muốn bot ăn code mới thì chạy**
  `git -C ../wt-bot checkout main --detach` (bot đọc repo để trả lời, code trễ vài ngày không chết ai).
- Các worktree `wt-*` còn lại = mỗi nhánh 1 thư mục cho các phiên chạy song song; hiện đều sau main
  85-106 commit — **rebase/merge main trước khi dùng lại**.
- **`wt-giaibai`** (06/09, nhánh `feat/giaibai` = main d172a09): `node_modules` là **junction** trỏ
  `bkdemy-erp-v2/node_modules`; `.env`/`.env.local` copy tay từ checkout chính (gitignore). Thêm
  worktree mới = làm 3 việc đó trước khi `npm run dev:*`/`migrate`.

### Nền repo/DB — CHUẨN HOÁ 01/09 (sau chuỗi phiên làm từ điện thoại)
- **Sổ `_migrations` giờ khớp DB thật:** 0 file treo · 0 báo-động-giả. Đã: baseline 10 file áp tay
  27→31/08 · vá `bam()` bỏ CR trước khi băm (62 báo "file bị sửa" trước đó là **CRLF vs LF**, không
  file nào đổi nội dung) · đóng dấu lại 133 dòng sổ · thêm chiều soi **"có trong sổ nhưng không còn
  file trong repo"**.
- **`schema.md` refresh 01/09:** 169 bảng · 7 view · 27 trigger · 152 function. (Chạy `npm run
  schema` sau MỖI đợt áp migration — bản trước đó đứng ở 29/08, cũ hơn 14 migration.)
- **⭐ Quyền FDW `fdw_bkdemy_web` — hộ dùng THẬT là app PH, không phải web (đã siết lại 01/09):**
  role này là cổng đọc ERP của CẢ HAI hệ nằm chung project `bkdemy-ph`: **app PH** (`bkdemy-ph-app`,
  hộ dùng chính — 21 foreign table: danh tính, buổi, đánh giá, báo cáo, hoá đơn, tài liệu, đáp án,
  4 view trả BTVN) và **bkdemy-web** (đúng 4 bảng cho view `erp_fdw_live_gv_gia`). Vì vậy bản siết
  15/08 "còn 4 bảng" bị `202608151600_hoan_tac_fdw_thu_hep.sql` mở lại là **ĐÚNG nghiệp vụ** — đừng
  đọc mig 15/08 rồi tưởng đang có lỗ hổng (01/09 đã tưởng nhầm 1 lần). Trạng thái sau
  `202609012300`: **25 object** = 24 cái đang import thật + `v_btvn_dap_an` (chừa cho bước trả đáp
  án); đã gỡ 10 bảng không hộ nào import (bài làm/điểm/kho câu/lịch). Nguồn chân lý để đối chiếu =
  `limit to (...)` trong `bkdemy-ph-app/migrations/*.sql` + `bkdemy-web/supabase-ph-migrations/`.
  **Thêm foreign table bên PH ⇒ phải cấp KÈM 2 cổng bên ERP** (GRANT + policy `fdw_bkdemy_web*`).

### ⭐ CÔNG THỨC — PHẦN A (ô ERP không gõ LaTeX) + TOOL SOẠN THẢO riêng `soan` (04–05/09, nhánh `feat/cong-thuc-b`, worktree `bkdemy-erp-v2-congthuc`) — ĐÃ MERGE + PUSH `main`
- **PHẦN A (03/09, đã merge từ trước) — ô nhập trong ERP:** người soạn KHÔNG gõ / KHÔNG thấy LaTeX. Cấu trúc chỉ vào bằng
  **CLICK mẫu** hoặc **PHÍM TẮT tự gán** (không bộ mặc định). Tắt gõ tắt kiểu chữ (`sqrt`=4 chữ), chặn `\` `^` `_`. Định dạng
  lưu KHÔNG đổi (`$…$` trong cột cũ) ⇒ in/ET/test online/AI sinh đề không đụng. Code gốc: `MathPopup`/`MathTextarea`/
  `PhimTatModal` + `lib/math/{macros,templates,phimtat}.ts`. Phím tắt `nhan_su.phim_tat_cong_thuc` jsonb (mig
  `202609030144`, ĐÃ áp), load cùng `me` — không localStorage. Gắn: FormBaiToan · DangHub CauEditor (Đề + SolutionField) ·
  NhapKho. Audit dữ liệu cũ (`npm run kiem:congthuc`, CHỈ ĐỌC): 177.956 công thức · 48 lỗi parse / 35 dòng · 464 dòng `$`
  lẻ — **CHƯA sửa, chờ Thùy quyết**.
- **⭐ Bước ngoặt 04/09 (Thùy chỉnh hướng CTO 3 lần trong 1 buổi):** (1) đề xuất "hàng đợi từ 11.815 lời giải AI chưa
  duyệt trong kho" → SAI, Thùy: **"độc lập với kho, sao cứ dính kho"**. (2) đề xuất "toggle xem code LaTeX để copy" → SAI,
  Thùy: **"KHÔNG có code LaTeX ở đâu cả, y như MathType"**. Chốt: soạn thảo là **app RIÊNG** (dễ test, không ghi data
  thật), nhúng vào kho SAU qua 1 nút mở (lõi `{value,onSave}` không đổi khi nhúng).
- **`soan.html`/`vite.config.soan.ts` (bundle thứ 6, port 5180, KHÔNG PWA):** `src/AppSoan.tsx` (Lưu = nháp localStorage
  máy này) chỉ bọc **`src/soan/SoanWorkspace.tsx`** = TOÀN BỘ màn, tái dùng nguyên khi nhúng ERP.
- **Vùng soạn WYSIWYG (`soan/RichMath.tsx` + `soan/doc.ts`):** DOM phẳng — text node (IME tiếng Việt NATIVE, không qua
  MathLive) xen `<span.rm-f contenteditable=false>` = 1 công thức nguyên khối (KaTeX, cùng `tex()`/macro với in/ET) ↔
  chuỗi kho `$…$` qua `listMath`. Gõ `$` hoặc Ctrl+M → bảng dựng (`soan/MathBuilder.tsx`, MathLive, y hệt luật PHẦN A);
  click công thức trong bài = sửa tại chỗ; Backspace xoá nguyên khối 1 phát; dán text có `$…$` → render ngay; **undo/redo
  tự làm** (stack chuỗi, gõ chữ gom 400ms — undo native của trình duyệt vỡ khi chèn node bằng tay).
- **Cụm dùng sẵn (`soan/cum.ts`) — 2 loại:** `cong_thuc` (1 công thức, có ô trống `#?`) và **`doan`** (cả ĐOẠN văn kèm
  công thức — bổ đề con dùng lặp lại nhiều bài, vd *"Vì ABCD là hình bình hành nên AB∥CD và AB=CD"*). Tạo bằng
  **"＋ Cụm mới"** (bảng kiểu MathType, `soan/CumModal.tsx`) hoặc **bôi đen 1 đoạn đang soạn → "Lưu đoạn chọn → cụm"**
  (đường tạo tự nhiên nhất — viết 1 lần dùng mãi). Mỗi cụm: tên · gõ tắt (gõ rồi Space là ra) · phím tắt riêng.
- **Thư mục (`ThuMuc`) tới TỪNG CHƯƠNG của TỪNG KHỐI** ("Hình 8 · Tứ giác", không chỉ "Đại/Hình 7/8") — vì trong 1
  chương độ lặp cụm/lời văn cực cao (Thùy). Sidebar trái gom theo nhánh+khối, mỗi thư mục đếm cụm, ✎/× khi hover (xoá
  thư mục → cụm bên trong về "Chung", không mất).
- **⭐ Thanh TAB 1..10 kiểu MathType (05/09, theo ảnh Thùy gửi):** mỗi THƯ MỤC có 10 tab riêng, mỗi tab = 1 hàng cụm bên
  dưới → lưu rất nhiều cụm mà không tốn diện tích header. Đặt tên tab (double-click hoặc ✎). Cụm nào hiện ở tab nào (hay
  **"Ẩn khỏi thanh"** — vẫn dùng được bằng gõ tắt/phím tắt, vẫn thấy ở "Tất cả cụm") do người soạn quyết qua ô "Hiện ở
  tab" khi tạo/sửa cụm. **Kéo-thả** (tay nắm ⠿ trên chip): thả lên cụm khác = chen vào trước; thả lên tab = chuyển tab +
  xếp cuối + tự nhảy sang tab đó (`Cum.tab`/`Cum.thuTu`, `sortCum`).
- **⭐⭐ ĐỔI TÊN ĐIỂM khi dùng cụm (`soan/diem.ts` + `DoiDiemModal.tsx`) — Thùy: "cực kì quan trọng với Hình học".**
  Bổ đề lưu bằng ABC/DEF, bài đang làm MNP/HIK → click cụm có tên điểm → bảng hiện mỗi điểm 1 ô (A→M, B→N…), preview
  sống, Enter chèn bản đã đổi. Nhận điểm ở CẢ công thức (`\triangle ABC`→A,B,C; bỏ qua `\mathbb{R}` `\text{}` `\Rightarrow`)
  LẪN lời văn ("tứ giác ABCD", ranh giới Unicode để "Vì"/"Xét" không bị bắt nhầm). Thay ĐỒNG THỜI 1 lượt (A↔B hoán đổi
  đúng); tên mới tự do (`A'`, `M_1`). **Bộ điểm nhớ theo CẢ BÀI** (không phải theo cụm) — cụm sau tự điền sẵn; header
  hiện chip "Bộ điểm: A→M · B→N…" + × xoá về tên gốc.
- **⭐ Nối vào ERP (05/09) — nút ⤢ ở `MathTextarea`** (component ô soạn dùng chung của ERP, KHÔNG sửa từng màn): bấm ⤢ →
  `soan/SoanModal.tsx` (portal full màn `z-[90]`, bọc `SoanWorkspace`) mở với `initial=value` của đúng ô → soạn xong Lưu
  → `onChange(raw)` trả về **đúng ô đã mở**, đóng modal. **Trình soạn thảo KHÔNG tự ghi DB** — ghi DB vẫn là nút Lưu của
  form ERP như cũ (ô có thể thuộc câu chưa tạo). ⇒ mọi ô đang dùng `MathTextarea` có luôn: FormBaiToan (4 ô) · DangHub
  Đề+Lời giải · NhapKho Đề chung. `lib/math/mathfield.ts` (mới, tách từ MathPopup) = MỘT nguồn cấu hình MathLive
  (font/KB_DROP/chặn `\^_`/stripPlaceholders/insertLatexInto/tabNext) dùng chung cho MathPopup (ERP) và MathBuilder
  (tool soạn) — sửa luật gõ chỉ sửa 1 chỗ.
- **Số đo trước khi làm (đối chiếu DB thật, chỉ đọc):** 4.716 lời giải người soạn → 17.253 đoạn `$…$` khác nhau; nút
  thắt thật = **gõ bị chẻ vụn** (`$A$` 224 lần, `$và$` 162, `$nên$` 53 — mở/đóng `$` ~10–15 lần/bài), KHÔNG phải thiếu
  mẫu ký hiệu. Khuôn lặp có nghĩa: `▢²=▢²+▢²` (Pytago) 53 lần · `k∈ℤ` 47 lần. Kho: dai 16.747 câu (828 trống lời giải ·
  **11.815 nguon_giai='ai' chưa duyệt**) · hgt 464 · khtn 2.850; chỉ 3 câu đã duyệt.
- **⭐⭐ BỘ CỤM CHUNG của trung tâm — ĐÃ LÊN DB (09/09, mig `202609081013_soan_cum_chung`, Thùy: "ưu tiên ngôn ngữ chung
  trước"):** `soan_thu_muc` · `soan_cum` (**unique `lower(go_tat)`** khi còn sống — 1 gõ tắt = 1 cụm) · `soan_tab_chung` ·
  `soan_cum_lich_su` (trigger ghi vết tạo/sửa/xoá, `boi` = nhan_su.id từ `store.me`) · RLS `la_thanh_vien()` · xoá MỀM
  `xoa_at`. `src/soan/cumDb.ts` tải 3 bảng 1 lượt, ghi theo CHÊNH LỆCH danh sách (call site giữ nguyên), `nhapTuMay()` đưa
  cụm+thư mục localStorage lên bộ chung (bỏ qua trùng gõ tắt/nội dung). `SoanWorkspace`: nhãn đáy sidebar "● Bộ chung" /
  "● cụm trên MÁY NÀY" (rơi về localStorage khi không tải được) + nút "⬆ Đưa cụm trên máy này lên bộ chung". `AppSoan`
  gate đăng nhập nhân sự (khuôn AppGiaiBai). **Chờ Thùy:** bấm nút ⬆ trên máy chị 1 lần; 1 dòng "TEST độ" xoá mềm (test
  của CTO) chờ gật xoá cứng. Chưa làm: cụm cá nhân đè bộ chung · thư mục trỏ `chuong` bản đồ · `phim` trùng giữa 2 người.
- **⭐⭐ GÕ TẮT CÓ THAM SỐ (08–09/09, `MathDoc.resolveGoTat`) — Thùy: "gõ tắt hay hơn phím tắt", góc có hàng trăm tên:**
  từ = `<gõ tắt>.<tham số>.<tham số>…`, phân cách **CHỈ `.`** (1 phím; `_` = chỉ số dưới: `goc.A_1` → góc A₁). Cụm có `#?`:
  điền lần lượt (`ss.AB.CD`), thừa → gộp ô cuối, thiếu → bảng dựng với phần đã điền. Cụm KHÔNG `#?` nhưng có tên điểm
  (đoạn bổ đề): tham số = tên điểm mới theo thứ tự (`hbh.MNPQ`). **Chỗ setup = form Cụm:** gõ tắt viết `#` ở vị trí tham
  số — `#.do` (50.do → 50°), `goc.#`, `ss.#.#` (regex, ưu tiên trước mẫu ngầm). R7: = macro có tham số TeX không dấu `\`
  + linear format của Word. Ranh giới: từ khoá tiếng Việt không dấu do người đặt, KHÔNG là tên lệnh LaTeX.
  Đường gõ tắt/phím tắt cụm công thức **chèn thẳng** (không hỏi đổi điểm); đổi tên điểm nay là nút trong bảng **Sửa công
  thức** (click công thức trong bài); cụm ĐOẠN vẫn hỏi trước. Bug cũ đã vá: cụm tạo qua bảng dựng lưu ô trống thành `{}`
  (không phải `#?`) → chưa bao giờ nhận tham số; `CumModal.save` chuẩn hoá.
- **GỘP công thức lúc LƯU (`doc.ts gopCongThuc`):** 2 công thức inline chỉ cách nhau toán tử/số/khoảng trắng → 1 công
  thức (`góc ABC = 50°` không còn 2 mảnh: hết gãy dòng khi in, 1 click sửa). Có chữ/dấu phẩy giữa → giữ. Áp ở
  `SoanWorkspace.save` + `getValue()` của handle; KHÔNG áp lúc gõ.
- **Ô công thức MathLive — 4 vá 07–09/09 (`lib/math/mathfield.ts`, `latex-fix.ts`, `kho/ui.tsx`):** ① click ô ▢ tự nhảy vào ô
  · ② mở lại công thức đã lưu: `{}` → ô ▢ (`reviveBlanks`) · ③ **`patchAccentSelection`**: MathLive 0.110 gán
  `captureSelection=true` cho AccentAtom → chữ dưới mọi dấu mũ (`\widehat \hat \vec`…) không click được, Backspace xoá cả
  ký hiệu → ghi đè accessor trên prototype (lấy qua `<math-field>` tạm) 1 lần/trang · ④ `fixAccentScript` `\widehat{A_2}` →
  `\widehat{A}_2` (cả lúc render lẫn lúc lưu) + `widenSingleHat` `\widehat{A}` → `\widehat{{}A{}}` chỉ lúc render (mũ phủ đúng
  chữ thay vì tí hon lệch phải). COPY từ vùng KaTeX render → clipboard `$…$` (`installTexCopy`, `tex()` bọc `data-latex`);
  RichMath onCopy/onCut = chuỗi kho; dán `$$…$$` hạ về `$…$`. Popup bảng dựng 1040px, ô nhập 28px (`.mf-lg`).
- **Verify đã làm (Browser pane, không phải người thật):** đủ vòng gõ chữ→chèn cụm→gõ tắt→dựng công thức→sửa tại
  chỗ→Ctrl+Z→dán→tạo cụm-đoạn→bôi đen lưu cụm→tạo thư mục→đổi tên điểm→đặt tên tab→kéo-thả tab. tsc sạch mọi bước;
  `npm run build` (bundle ERP chính, có cả nút ⤢) chạy được. **IME tiếng Việt thật (Telex/Unikey) CHƯA ai gõ tay** — máy
  chỉ gửi được ký tự dựng sẵn qua automation, đây là rủi ro lớn nhất còn lại chưa loại trừ.
- **Bẫy verify Browser pane đã ghi memory** (`browser-pane-automation-quirks.md`): click ngay sau `navigate` luôn trượt
  (cần screenshot trước) · phím Space/Enter không tới React `onKeyDown` qua `computer.key` (native vẫn chạy — phải
  dispatch `KeyboardEvent` bằng JS, `composed:true` cho MathLive xuyên shadow DOM) · HMR giữ state cũ (phải reload sau
  mỗi sửa).
- **Đã MERGE `main` (05/09):** `d62afeb` (nội dung) → `5682a35`/`467d261` (gộp 20 commit khác cùng ngày: Duyệt lời giải
  AI, app `pt`, APK Android) → **đã PUSH `origin/main`** (local `main` cũng đã merge+push, hiện khớp origin). Không có
  xung đột thật (3 file "cùng nối cuối" — giữ cả hai bên).
- **PHẦN B (vẽ hình phẳng JSXGraph, lưu cấu trúc riêng theo môn, SVG cho in) CHƯA làm** — chặn bởi câu hỏi CEO: hình do
  AI sinh từ đề rồi người duyệt, hay GV tự dựng tay? PHẦN C (không gian) không làm.
- **Còn lại (chưa làm):** nút ⤢ ghi thẳng `loi_giai` theo `ma_cau` (dispatch môn→bảng qua registry, KHÔNG rải
  `if mon===...`) — hiện vẫn trả về ô rồi form ERP Lưu. IME thật cần Thùy tự gõ thử tay 1 lần trước khi tin.
  `AutoTextarea` (DangHub) vẫn hết dùng, giữ+export chờ gật xoá. Sửa công thức TẠI CHỖ trong bài (story Word inline, không
  popup) — Thùy 08/09 nói "popup cũng chấp nhận được", chưa chọn; hiện là story MathType (popup, click được từng phần).

### ⭐ TOOL GIẢI BÀI kho chung `giaibai.bkacademy.edu.vn` (06/09, nhánh `feat/giaibai`, worktree `wt-giaibai`) — ĐÃ PUSH `main` (d172a09) + ĐÃ DEPLOY (Thùy, 06/09) — xem thêm mục "06/09 chiều" cuối phần này
- **Story (Thùy, "giống Qanda"):** hệ liệt kê bài chưa có lời giải → TA **Nhận giải** (bài rời pool, về danh sách riêng) → soạn
  (MathTextarea + ⤢ SoanModal) → **Nộp** → **học thuật duyệt** → duyệt xong mới thành lời giải chính thức → ghi ai/lúc nào/bao lâu.
  **Kiến trúc CEO chốt: tách hẳn khỏi ERP, chỉ chung DB** ("không đổ dồn vào 1 ERP khổng lồ") = modular monolith: **entry Vite thứ 8**
  `giaibai.html` → `dist-giaibai/`, Vercel project riêng, login = tài khoản nhân sự ERP. Spec đầy đủ: **`PLAN-giaibai.md`**.
- **7 quyết định:** ai có môn cũng nhận (lọc người bằng "ai biết tên miền") · **≤3 bài/người, hạn 48h** (quá hạn tự về pool, có Trả
  bài) · **từ chối ≤3 lần** trả về đúng người kèm lý do, lần 3 về pool + người đó không nhận lại · **học thuật duyệt** (ghế `hoc_thuat`
  đúng môn / admin; không tự duyệt bài mình) · **Claude = 1 TA cao cấp** (bài đặt Claude cũng biến khỏi pool) · **tiền NGOÀI hệ** —
  tool chỉ xuất báo cáo tháng (số bài đã duyệt · độ khó · ký tự · công thức · thời gian) + top 3 · web máy bàn, không app.
  **⭐ "Luồng này không xoá/ghi đè gì trong kho"** — lời giải nằm ở dòng nhận bài cho tới khi DUYỆT mới ghi vào câu.
- **DB (mig `202609060122` + vá `202609060200`):** KHÔNG đẻ khái niệm mới — 5 bảng hàng đợi Claude `{dai,khtn,hgt}_cau_hoi_yeu_cau_giai`
  · `hinh_{baitoan,bien_the}_yeu_cau_giai` **mở rộng** thành bảng NHẬN BÀI chung: `nguoi_giai` (NULL = Claude) · `trang_thai`
  (`cho_claude|da_xong|dang_giai|cho_duyet|can_sua|da_duyet|da_tra|qua_han|tu_choi_3`, CHECK ràng với nguoi_giai) · `han_at/nop_at` ·
  `loi_giai_nhap/anh_nhap/dap_an_nhap` · `tu_choi_lan/ly_do_tu_choi` · `duyet_boi/duyet_at` · generated `so_ky_tu`/`so_cong_thuc` ·
  trigger đóng dòng Claude → `da_xong`. Index unique `(bài) where xu_ly_at is null` sẵn có = 1 bài 1 người giữ. View `v_giaibai_nhan`
  (mọi dòng nhận + nhãn bài + tên người + `dang_giu`/`qua_han`/`giay_giai`) · `v_giaibai_bai` (mọi bài chưa giải 4 nhánh + ai giữ).
  `fn_giaibai_{pool,dem_pool,nhan,tra,luu_nhap,nop,cua_toi,cho_duyet,la_nguoi_duyet,duyet,tu_choi,bao_cao_tong,bao_cao_chi_tiet}`;
  registry SQL `fn_giaibai_tbl(nhanh)` (nhanh ∈ toan|khtn|hgt|hinh_baitoan|hinh_bien_the) + `fn_giaibai_mon`. Vá fn cũ: ERP tab
  "Chưa có lời giải" (`fn_kho_cau_chua_giai`, `v_hinh_chua_giai`) trả người giữ → ChuaGiaiTab hiện "🧑 X đang giải" và khoá nút tự
  giải/huỷ; worker `hangdoi-giai.mjs` + `fn_*_yeu_cau_giai_cho` chỉ dòng Claude; `fn_kho_giai_nguoi_xong`/`fn_hinh_ghi_loi_giai` chặn
  khi người đang giữ; `fn_*_dat_giai` đóng dòng quá hạn trước.
- **App:** `AppGiaiBai.tsx` (gate như AppChi; `useStore.setState({me})` để phím tắt MathTextarea chạy; scope môn = luật useMonScope,
  `CROSS_MON_TEAMS` dời sang `lib/mon.ts`) · `lib/giaibai.ts` · `screens/giaibai/`: `GiaiBaiHome` (chọn môn, 4 tab, badge đang giữ N/3
  + chờ duyệt) · `KhoBai` · `BaiCuaToi` (nháp trên DB, đếm ngược hạn, Soạn/Trả) · `DuyetBai` · `ThongKe` (tháng, top 3, bảng, CSV) ·
  `GiaiEditor` (KHÔNG import DangHub — chỉ MathTextarea + ImgInsertBar + AnhSlot riêng). Lệnh `npm run dev:giaibai` / `build:giaibai`;
  launch.json `giaibai-dev` (5218, URL phải có **`/giaibai.html`** — `/` trần ra ERP chính).
- **Đã test e2e 06/09 (Đại, tài khoản học thuật):** nhận → nháp → nộp → Duyệt tự khoá (bài mình) → từ chối → cần sửa lần 1/3, hạn reset
  → trả bài → pool lại đủ. ✓ **CHƯA test:** nhánh Hình (bài toán gốc/biến thể) · duyệt thật (cần tài khoản thứ 2) · nhãn "🧑" ở ERP ·
  Thống kê có dữ liệu.
- **TREO:** ① **Deploy Vercel** — project mới trỏ repo, nhánh main, Build `npm run build:giaibai`, Output `dist-giaibai`, env
  `VITE_SUPABASE_URL/KEY`, domain `giaibai.bkacademy.edu.vn`; `vercel.json` root có `crons` `/api/pt-nhac-viec` — nếu build kêu thì tách
  vercel.json theo project. ② Hình chưa có `muc_do` → cột độ khó trống trong báo cáo. ③ Bundle 3.2 MB (useStore/pdfjs qua
  MathTextarea/ImgInsertBar) — chấp nhận. ④ Worktree `wt-giaibai` dùng **junction** `node_modules` → `bkdemy-erp-v2/node_modules`
  (tạo bằng PowerShell `New-Item -ItemType Junction`; `cmd mklink` qua bash báo OK giả) — dev-only font KaTeX 403 vì ngoài fs.allow.
- **06/09 CHIỀU (audit Thùy + đổi thiết kế, 10 migration `202609061419`…`1543` — checkout chính, chưa worktree):**
  - **Lọc pool "Giải" đúng luật Thùy:** chỉ câu THIẾU CẢ đáp án ngắn LẪN lời giải chi tiết (`dap_an`, `loi_giai`, `anh_dap_an` đều
    null). Trước lọc thiếu `dap_an` → 716/839 câu Đại trắc nghiệm đã có đáp án vẫn hiện (Thùy: "vốn đơn giản, không cần chi tiết").
    Kết quả: Đại 839→123 · KHTN 21→8 · HGT 10→2 · Hình không đổi (không có khái niệm đáp án ngắn).
  - **Race "2 người cùng Nhận":** dữ liệu vốn AN TOÀN (unique index `*_cho_uniq (khoá) where xu_ly_at is null` từ mig cũ) — chỉ vá
    THÔNG BÁO: `fn_giaibai_nhan` catch `unique_violation` → "vừa có người khác nhận trước 1 bước".
  - **Tab 🛠 Quản trị** (gate như Duyệt): `fn_giaibai_dashboard(nhanh[], me)` — MỌI người có `nhan_su_mon` (kể cả giữ 0) × đang giữ/
    quá hạn/chờ duyệt/đã duyệt/từ chối 3/đã trả; gác `fn_giaibai_la_nguoi_duyet` ở DB. Khác Thống kê (chỉ đã duyệt theo tháng).
  - **Trình soạn thảo full màn có ĐỀ BÀI bên trái** (`SoanWorkspace` prop `deBai`, nối qua `SoanModal` → `MathTextarea.soanDeBai` →
    `GiaiEditor.deBai`; BaiCuaToi truyền `<BaiHead/><BaiBody/>`). Không truyền = layout cũ (DangHub/FormBaiToan không đổi).
  - **BUG "bấm công thức không hiện gì" khi phóng to:** 4 modal con của tool soạn (`MathBuilder/CumModal/DoiDiemModal/ThuMucModal`)
    z-70 nằm DƯỚI `SoanModal` z-90 → bảng dựng mở thật mà không thấy, gõ mù làm hỏng công thức. Vá: z-100. (soan.html độc lập không lộ.)
  - **⭐ 2 CHẾ ĐỘ (Thùy chốt sau khi BÁC thiết kế "worker gọi API Claude Sonnet/Haiku" — đã dựng rồi XOÁ trong ngày, mig `1524`
    drop `giaibai_ai_job` + 2 fn; "dùng thẳng Claude Code, có luồng hangdoi-giai.mjs rồi, KHÔNG gọi API"):**
    · **Giải** = giải từ đầu, pool `v_giaibai_bai` (thiếu cả 2) — PHÒNG lúc Claude có sự cố vẫn có việc.
    · **Hoàn thiện** = trên nền Claude ĐÃ GIẢI THẬT, pool `v_giaibai_hoan_thien` = `nguon_giai='ai' AND giai_method='claude_code'
      AND NOT da_duyet` (Hình đọc `hinh_cach_giai`/`bien_the`). Đo thật: dai/khtn/hgt MỌI câu AI chưa duyệt đều `giai_method IS NULL`
      (= clone, 11.854/42/141, KHÔNG thuộc pool này); chỉ Hình có `claude_code` (7 → 41 trong ngày vì có phiên chạy hangdoi-giai).
      **Claude Code giải qua `hangdoi-giai.mjs` y như cũ** (ghi thẳng `loi_giai` + `giai_method='claude_code'`) ⇒ câu tự RỜI Giải,
      VÀO Hoàn thiện — 2 pool loại trừ nhau bằng cột sẵn có, không đẻ khái niệm.
    · DB: cột `che_do` trên 5 bảng `*_yeu_cau_giai` (set lúc Nhận). `fn_giaibai_nhan` GIỮ CHỮ KÝ, tự dò pool: Giải → nháp trắng;
      Hoàn thiện → pre-fill `loi_giai_nhap` từ bản Claude + SNAPSHOT `loi_giai_ai/ai_model` trên dòng nhận (bất biến — so trước/sau,
      trả/nhận lại không mất). `fn_giaibai_duyet` rẽ theo `che_do`: Giải đòi `loi_giai` trống · Hoàn thiện đòi đang là bản
      `claude_code` chưa duyệt, ghi đè + `nguon_giai='nguoi', giai_method='ta'` (Hình UPDATE thẳng `hinh_cach_giai`/`bien_the`).
      `fn_giaibai_pool/dem_pool` thêm `p_che_do default 'giai'` (client cũ không đổi).
    · UI: KhoBai toggle "✍️ Giải | 🤖 Hoàn thiện" (localStorage), Hoàn thiện có badge + BẢN CLAUDE xem trước dưới đề + nút "Nhận hoàn
      thiện"; GiaiEditor banner; DuyetBai "So với bản Claude gốc · giữ nguyên/đã sửa"; chip che_do; Dashboard 2 KPI Kho Giải/Hoàn thiện.
  - **⭐ `fn_giaibai_duyet` CHƯA TỪNG CHẠY ĐƯỢC trên prod tới `1543`:** `IF NOT FOUND` sau `EXECUTE … INTO` — đo bằng DO block:
    `found=false` DÙ biến đã nạp đủ (bài học ② hôm qua ghi "EXECUTE INTO thì FOUND đúng" là SAI, đã sửa). E2E hôm qua chỉ test từ
    chối/trả. Vá: kiểm `v_key is null`. Verify 06/09 (transaction rollback, người duyệt thứ 2 giả lập): Hoàn thiện Hình nhận→nộp→
    duyệt ✓ · Giải Đại ✓ · câu clone bị chặn ✓ · duyệt sau khi nơi khác duyệt/câu có lời giải giữa chừng/tự duyệt: chặn ✓.
  - **THỪA chưa xoá (Luật xoá, chờ gật):** 4 cột `loi_giai_ai/dap_an_ai/ai_model/ai_de_xuat_at` trên 5 bảng CÂU GỐC (mig `1458`,
    thiết kế worker; không ai ghi, luôn null; `v_giaibai_bai` vẫn select cho đủ shape) + `fn_giaibai_dem_cho_ai`. Snapshot cùng tên
    trên `*_yeu_cau_giai` thì ĐANG DÙNG — đừng nhầm. Thống kê `fn_giaibai_bao_cao_*` KHÔNG lọc môn (KHTN học thuật thấy cả Toán) — cũ, chưa sửa.
  - **Tính công: để sau** (Thùy) — hiện chỉ track số lượng + `muc_do` + snapshot để so diff khi cần.

### ⭐ KHO CHUẨN — cửa 1 đã BẬT (08/09, nhánh `worktree-kho-chuan` e2e9d41, spec `spec-kho-chuan.md`) — bước 1–3/6 XONG
- **Định nghĩa "vào kho chuẩn" = 1 hàm** `_kho_cau_chuan(da_duyet, kiem_may, created_at)`, vật hoá thành cột generated
  **`kho_chuan`** trên `dai_/khtn_/hgt_cau_hoi`. Câu MỚI (created_at ≥ **NGÀY BẬT 2026-09-08 09:12+07**, hàm `_kho_ngay_bat()`) chỉ dùng
  khi `da_duyet`; câu CŨ tạm dùng tới khi quét, máy/AI **`kiem_may='nghi'` ⇒ rút khỏi HS ngay**. Cột thêm: `kiem_may`(khop/nghi/
  khong_kiem_duoc) · `kiem_may_boi`(mcq-auto/claude_code/nguoi) · `kiem_may_ghi` · `kiem_may_at` · `duyet_nguon`(nguoi/may/ai — trigger
  tự điền 'nguoi' khi client duyệt) · `dang_ai_de_xuat` (AI gán lúc vào; người chốt = `dang_chinh` ⇒ precision đo bằng query).
- **Chỗ chọn câu đã cắm:** DB = `_kho_dk_online_sql` (điều kiện ứng viên chung của `tu_luyen_sinh` + `_btyeu_chon_cau` = tự luyện ·
  bổ trợ yếu · retest) bọc `c.kho_chuan and` · client = `listCauByDang` lọc `kho_chuan` mặc định (soạn ET/BTVN/giáo trình/mã đề/
  KhoPicker); **`{ tatCa: true }`** cho màn KHO (DangHub) và chỗ RESOLVE câu đã trong ET (ETScreen ~395). Cửa 2 (`mcq-sinh --list`)
  chỉ nhận câu `da_duyet`. **Chỉ trên DB** — prod client CHƯA deploy nhánh này (client prod chưa lọc kho_chuan, nhưng tự luyện/bổ
  trợ/retest đã bỏ câu nghi vì hàm DB).
- **Mức A đã chạy (`scripts/kho-quet-dapso.mjs --ghi`, whitelist 48 dạng "đáp số = giá trị biểu thức"):** máy ký khớp **1.670** (+9
  người ký trước) · **NGHI 17** (soát tay: máy đúng, kho/đề sai thật; 14 clone, 3 gốc) · **15.996 chưa kiểm** → mức B. Loại khỏi
  whitelist (ghi lý do trong script): đặt-tính-chia (dư/làm tròn), quy đồng, làm tròn, đơn vị đo, 2 ý/câu, nhận diện. Lớp 6 dấu chấm =
  nhân: `mcq-auto.tinh(noiDung, {chamLaNhan})` bật theo dạng. Chạy lại an toàn (idempotent, không đè `kiem_may_boi` người/Claude).
- **Màn duyệt hợp nhất** = màn "Duyệt lời giải AI" (lá `duyetloigiai`, tiêu đề mới "Duyệt câu & lời giải"): tab = Chưa có lời giải ·
  **Câu mới chờ duyệt** · Lời giải mới từ Claude · **Máy nghi đáp số** · **Không kiểm được** · Tồn đọng (AI cũ) · Trắc nghiệm AI. Badge
  đếm từ `fn_kho_dem_hang_duyet`; list `fn_kho_hang_duyet(mon, loc, khoi)`; điều kiện 5 bộ lọc = `_kho_loc_duyet_sql`. Thẻ
  (`DuyetCauTab.tsx`) sửa tại chỗ dạng (DangPickerOne) / cụm (pill theo dạng, đổi dạng ⇒ reset) / đề / đáp số / lời giải →
  **`fn_kho_duyet_cau`** (1 transaction: áp sửa + `da_duyet` + `duyet_nguon='nguoi'`; **sửa đáp số ⇒ thu hồi mọi form TN của câu**;
  câu nghi/chưa kiểm ⇒ `kiem_may='khop'` bởi 'nguoi', máy đã khớp mà người không đổi ⇒ giữ kết quả máy để đo precision mẫu) ·
  **`fn_kho_tu_choi_cau`** (kho rác `xoa_at`, lý do bắt buộc vào `kiem_may_ghi`). KHÔNG có duyệt lô cho hàng nghi/không kiểm/câu mới.
  Phần HÌNH (biến thể/cách giải) của 2 tab lời giải qua toggle "Câu kho / Hình".
- **Mức B (Claude giải lại từng câu trong chat) — hạ tầng mig `202609081120_kho_kiem_lo` + `scripts/kho-kiem-ai.mjs`:** mỗi lượt
  ghi = 1 dòng `kho_kiem_lo` (tên "B-NN K<khối> lô M (dd/mm)"), câu trỏ `kiem_may_lo`; `fn_kho_kiem_lo_thong_ke` / `--thong-ke` =
  precision người trên từng lô. **Quy trình 1 lô (250 câu):** `--list --khoi 11 --n 250 --out lo.json` (mặc định chỉ câu
  `created_at < _kho_ngay_bat()`; câu mới cần `--ca-moi`) → render gọn `lo-txt.mjs` → Claude đọc, giải độc lập, chỉ ghi câu lệch vào
  `kq-dac.json {lo, ghi_chu, dac:{ma_cau:{khop,dap_an_ai,ghi}}}` → `anh-null.mjs` (mọi câu [ẢNH] ⇒ `khop:null`, AI mù hình) →
  `kq-build.mjs` (câu còn lại mặc định khớp) → `--ghi kq.json` (lô KÝ: khớp ⇒ `da_duyet` + `duyet_nguon='ai'`). Sửa 1 câu đã ký:
  `scripts/_sua_nghi.mjs <ma_cau> "<ghi>"`. Thống kê: `scripts/_tk_khoi.mjs <khối>`. Helper render/build nằm ở scratchpad phiên
  (mất thì viết lại 10 dòng — DEVLOG 08/09 tối có nguồn).
- **Tiến độ mức A+B (08/09, lô A-01 + B-01…B-42):** **khớp 8.580 (đã ký) · nghi 585 · không kiểm được 542** (hầu hết câu có ảnh:
  đồ thị/BBT/đường tròn LG/hình không gian). Theo khối (khớp/nghi/kk): K6 730/5/0 · K7 828/5/12 · K8 2.115/177/13 · K9 1.402/72/2 ·
  K10 620/43/78 · K11 2.650/162/293 · **K12 235/121/144 (mới 2/6 lô)**. **CÒN: K12 988 câu (≈4 lô) + toàn bộ cấp 1 (5, 5T, 4, 4T,
  3).** Tỉ lệ nghi K6–K11 ≈ 5% đúng như CEO ước; **K12 nhảy lên 24%** vì lỗi dữ liệu/khuôn chứ không phải toán.
- **Nghi gom theo LOẠI (cho người duyệt + cho nhapkho chặn từ đầu — mức A bắt được, không cần AI):**
  ① trắc nghiệm KHÔNG có `lua_chon` hoặc phương án nằm trong text đề (K12: T112010307, T112020305011–020, T112010102001–011) ·
  ② khuôn sinh ≥2 phương án đúng / không phương án đúng / phương án trùng nhau (K10 T110010203, T110020102; K11 T111010202;
  K12 T112010308 16/21, T112010102/103 "đồng biến trên khoảng") — máy tự thử 4 phương án vào đề là lộ ·
  ③ đáp án ≠ số cuối trong chính lời giải (K11 T111040403; K12 T112070311003, T112070105035…) — so text là bắt được ·
  ④ đáp án `'null'`/rỗng/chữ, thiếu "+kπ", sai định dạng số thập phân (T112070203007) ·
  ⑤ đề chứa rác/lời giải của câu khác, hoặc lời giải chứa câu tự thú của AI sinh biến thể ("Oops…", "I made a mistake", "chúng ta sẽ
  thay thế bằng hàm số", "cần chọn khác") — grep từ khoá ·
  ⑥ biến thể đổi số mà không tính lại đáp án (cụm lớn nhất về số câu: K8/K9/K11 rút gọn căn, PTLG, tối ưu; K12 vectơ) ·
  ⑦ đề sai bản chất (hàm không có cực trị, không có GTLN, LP vô số nghiệm) ·
  ⑧ câu có ảnh ⇒ bắt buộc cửa người (AI mức B để `khong_kiem_duoc`).
- **Sự cố đã xử lý 08/09:** 126 câu K8 tạo SAU ngày bật bị ký nhầm ⇒ `_revert_ky_moi.mjs` gỡ; `--list` từ đó khoá theo mốc thời gian.
  Claude tự sửa 1 câu ký nhầm (T110010203027) sau khi thấy cả cụm ở lô sau.
- **Còn lại theo spec §4:** bước 4 chạy nốt K12 + cấp 1 (ngưỡng ký ≥98%/200 câu chờ CEO chốt — đang ký theo mặc định spec; mức C
  người soát mẫu 2% rồi `--thong-ke` để có precision thật; 585 câu nghi + 542 không kiểm được đang nằm ở màn duyệt tab "Máy nghi"/
  "Không kiểm được") · bước 5 gộp đường vào (clone/giải AI/nhập file ghi thẳng `da_duyet=false`, bỏ bảng nháp
  `dai_cau_hoi_clone_cho_duyet`; `nhapkho-file.mjs` phải ghi `dang_ai_de_xuat`) · bước 6 bỏ vế "câu cũ tạm dùng" — **PHẢI DROP/ADD
  lại cột `kho_chuan`** (generated stored không tự tính lại khi đổi thân hàm). 17 câu nghi đang chờ TA duyệt (khối 5:11 · 5T:2 · 6:2 · 7:2).
### ⭐ KHẢO SÁT "Bạn của con ở BK" — PWA iPad riêng + tab ERP (08–09/09) — ĐÃ PUSH main `299b044`, Vercel project riêng (CEO deploy 09/09)
- **Mục đích** (`spec-khao-sat-hs.md`): vẽ đồ thị quan hệ ~300 HS (cùng lớp trường / cùng toà-tầng / rủ vào) để kiểm giả thuyết referral trước khi thiết kế CSKH. Trò chơi 3 phút, HS làm trên iPad trung tâm, TA cầm máy. Câu 1–8 = sự thật (đồ thị), câu 9 = ý muốn (lead). **Không nhắc quà** trước màn cuối.
- **2 quyết định CEO KHÁC spec:** (1) chỉ **form** ra PWA riêng (`khaosat.html` → `dist-khaosat`, khuôn app TA); khớp tên + kết quả ở ERP lá **Vận hành → Khảo sát Bạn của con**. (2) **9 trường khảo sát = thông tin cá nhân HS** → cột trên `hoc_sinh` (lop_truong · noi_o_loai · toa · tang · khu · ly_do_vao · bo_me_ban_ph_lop · bo_me_chuc_vu_toa · nghe_bo_me; trường dùng `truong_hoc` sẵn có), sửa tay được ở hồ sơ HS.
- **DB (mig `202609080246_khao_sat_hs_ban_cua_con`):** `khao_sat_hs` (1 dòng/HS/đợt ĐÃ NỘP, `tra_loi` jsonb snapshot bất biến, `nguoi_bam_ho`, unique hoc_sinh×dot) · `khao_sat_hs_quan_he` (1 dòng/CẠNH: loai biet/duoc_ru_boi/da_ru/muon_ru, `ten_goc` gõ tự do, `den_hoc_sinh_id` khớp SAU bằng tay, `ngoai_bk`) · RLS `la_thanh_vien()` · `fn_bo_dau` (translate thuần, DB không có unaccent) · RPC `fn_khao_sat_hs_nop(jsonb)` = 1 transaction (insert khảo sát + UPDATE hoc_sinh + insert cạnh; câu tuỳ chọn null → giữ cũ) · `fn_khao_sat_lop_tien_do/luoi_lop/danh_sach/canh/goi_y_khop/khop/tong_quan` · 5 view `v_khao_sat_cum_truong/cum_toa/kenh/vector/lead`. Param đợt kiểu `int` (literal 1 không resolve hàm smallint).
- **Client:** seam `src/lib/khaosat.ts` · `src/screens/khaosat/`: `KhaoSatForm` (1 câu/màn, thẻ to, chip tên + pill, confetti canvas tự viết, visualViewport chống bàn phím iOS che nút Tiếp, mất mạng giữ state + Nộp lại, màn cuối tự về lưới sau 3s) · `KhaoSatLuoi` (lớp theo khối + tiến độ → lưới avatar, đã làm mờ+✓, toggle "TA bấm hộ" mặc định bật khối ≤5) · `KhopTenTab` · `KetQuaTab` · `KhaoSatScreen`. Entry: `AppKhaoSat.tsx`/`main-khaosat.tsx`/`vite.config.khaosat.ts` (port 5184, icon `icon-khaosat-*`), script `dev/build/preview:khaosat`, `vercel-ignore` nhận `bkdemy-erp-v2-khaosat`.
- **Deploy:** Vercel project riêng, build `npm run build:khaosat`, output `dist-khaosat`, env `VITE_SUPABASE_URL` + `VITE_SUPABASE_KEY` (anon). iPad = iOS ⇒ chỉ PWA (Safari → Chia sẻ → Thêm vào MH chính). Domain đề xuất `khaosat.bkacademy.edu.vn`.
- **Trạng thái/tồn đọng:** đã verify end-to-end trên bản build khổ iPad; **dữ liệu thử còn trong DB** (khảo sát Bùi Tuệ An đợt 1 + 5 cạnh, 1 cạnh đã khớp Đinh Thế Bảo) — xoá dòng `khao_sat_hs` id=1 (cascade) trước khi chạy thật. Bước tiếp theo theo spec §6: chạy thử 1 lớp (~20 HS) → sửa câu/danh sách → phủ hết 1 tuần → khớp tên → đọc 4 view.

### ⭐ 08–09/09 — FORM CÂU (TN AI · ĐIỀN Ô chứng minh) + KHO CHUẨN (spec) + NHẬP KHO TỪ FILE — ĐÃ PUSH `main` (c694571, 4c61e44)

**Nguyên tắc CEO chốt 09/09:** mỗi câu rồi sẽ có đủ hình thái (TN 4 phương án · trả lời ngắn · điền ô · tự luận); **thứ tự xây theo
độ dễ**: dễ trắc nghiệm → TN trước; khó (chứng minh, hình) → ĐIỀN Ô trước. HS **không** thấy "đường sai"/nhãn lỗi — chỉ để staff.

**A. Form TRẮC NGHIỆM AI (spec-mcq-form.md, mig 202609080230 → 202609120003) — pool 1-3 + nhóm ƯCLN/BCNN/Ước-Bội
khối 6 đã xong, đang chờ duyệt. ĐÃ MERGE + PUSH `main` (96861b7, 11/09 tối — fast-forward, không mất commit ai)**
- Form = bảng riêng `dai_cau_form_tn` khoá `ma_cau` (KHÔNG đổ `lua_chon` vào câu gốc — etFormOf coi "có lua_chon" = TN ⇒ ET in giấy tự
  đổi form). 1 form hiệu lực/câu, từ chối = `xoa_at`. Distractor = kết quả THẬT của 1 rule lỗi (`dai_mcq_rule` R01–R84, nhóm
  khai_niem/tinh). HS chọn sai ⇒ rule ghi 100% chắc (`bai_test_cau.lua_chon_rule[]` song song `lua_chon`, view `v_mcq_loi_hs`).
- **Pool 1** = lớp 7 "Số hữu tỉ" 9 dạng tính toán: 488 form (35 tay + 453 máy). **Pool 2A** (08-09/09, lớp 7 "Số
  thực" cần √/|…|) + "tích bằng 0" (R32-R35, sau khi Thùy chỉ ra 4 lỗ hổng thiết kế — xem bài học §②). **Pool 3**
  (11/09, khối 6 "Số tự nhiên" 10 dạng, `CHAM_LA_NHAN`): 451/455 (99%).
- **⭐ Kiến trúc `TEXT_DANG` (11-12/09)** — cho dạng đáp số KHÔNG phải 1 giá trị hữu tỉ đơn: bảng `TEXT_FN`
  `{canon, val}` riêng theo `dang_chinh` (không hard-code 1 cặp hàm chung — mini-dang.mjs mỗi DẠNG có cú pháp
  đáp số khác hẳn nhau). Đã dùng cho 6 dạng: phân tích thừa số nguyên tố (R53-56, đáp số BIỂU THỨC luỹ thừa) ·
  nhận biết nguyên tố/hợp số (R57-61, đáp số TẬP số) · Tìm n qua ƯCLN/BCNN T106040104/204 (R62-72, TRỘN 1-giá-trị
  + tập-theo-khoảng trong CÙNG 1 mã dạng) · Ước/Bội cơ bản T106030101 + Tìm ƯC/BC T106040101/201 (R73-80, tập
  hữu hạn hoặc VÔ HẠN "0;L;2L;...." — `chuanHoaTapText` tự lọc "...." khỏi canon, không ảnh hưởng so đúng/sai) ·
  Tổng tập {x<K} T106010103 (R81-84). Dạng đáp số 1 giá trị đơn (Tìm ƯCLN/BCNN T106040102/202) vẫn đi
  `SPECIAL_DANG`/`parseHuuTi` như cũ.
- **Tổng khối 6 đã ghi form: ~700 câu qua 12 dạng** (chi tiết từng dạng: DEVLOG 11-12/09). **Đã khảo sát HẾT
  khối 6 — không còn dạng nào "dễ" theo khuôn "1 câu → 4 đáp án nguyên câu".** Phần còn lại (T106030401 "an+b⋮cn+d"
  · T106020601 dãy luỹ thừa · T106030102+T106030403 đáp số "Có/Không" · T106020304 Toán thực tế) + GTLN-GTNN/nâng
  cao khối 7 **Thùy chốt 12/09: thuộc nhóm "TRẮC NGHIỆM TỪNG PHẦN"** (= Phase 2 Đại của `spec-dien-o.md`, không
  phải khuôn 4-đáp-án cũ). **⚠ Đính chính: kiến trúc ĐÃ XÂY 12-13/09** ở worktree riêng `mcq-tung-phan` (KHÔNG
  còn "chưa thiết kế" như ghi lúc 12/09 sáng) — xem mục **"⭐ 12-13/09 — TRẮC NGHIỆM TỪNG PHẦN"** cuối phần ①.
  T106010102/T106020101/phần lớn T106010103 hoá ra **ĐÃ LÀ trắc nghiệm gốc** trong kho (`lua_chon` có sẵn) —
  ngoài phạm vi pipeline này, không phải việc cần làm.
- **UI duyệt** (`TracNghiemAiTab.tsx`): duyệt theo lô 20 câu + nút "Duyệt tất cả trang này" (loại câu sai trước
  bằng checkbox, KHÔNG phải duyệt-từng-câu — CEO 09/09, RPC `fn_mcq_form_duyet_batch`); lời giải kho hiện SẴN
  dưới đề (11/09 tối, trước đó ẩn sau `<details>` phải click). ⚠ Lúc merge lên main gặp 1 bản "duyệt hàng loạt"
  KHÁC do phiên song song khác làm cùng ngày (confirm() + duyệt thẳng 20 câu đầu, không có bước loại) — đã giữ
  bản khớp đúng spec CEO, bỏ bản kia; coi chừng phiên khác có thể lại tạo bản khác nữa.
- Clone đổi số `mcq-clone-doi-so.mjs`: 56 clone chờ duyệt (0201 +36…). Máy phát hiện **2 đáp số kho sai**: T107010202053 (13/16→37/24),
  T107010403036 (8/5→8/3) — chưa sửa kho.
- Luật "cùng hình thức" ĐÃ NỚI: đáp án đúng phải có ≥1 phương án cùng kiểu (không phải cả 4); tập nghiệm ≤2 phương án đơn.

**B. ĐIỀN Ô chứng minh (spec-dien-o.md, mig 202609081019/1045) — vòng 1 chạy hết, đã push, CHƯA deploy lúc ghi**
- Lời giải chi tiết bỏ trống **1–4 ô** (4–5 dòng/ô), mỗi ô 4 phương án. Mỗi bước = cặp **"kết luận (lý do)"**, để trống 1 trong 2.
  **Chỉ đục PHẦN GIỮA** (không đục bước chép giả thiết, không đục bước đích). Đo theo **CÂU**: Đ = đúng hết · S = đúng <40% ô · còn lại C
  (`fn_dien_cham`). **Đến ô nào hiện đúng/sai ô đó**, điền đáp án đúng vào chỗ trống rồi mở ô kế.
- Kho hình không có ma_cau ⇒ `hinh_form_dien` khoá `cach_giai_id` XOR `bien_the_id`; `loi_giai_bam` md5 + trigger **thu hồi khi lời
  giải đổi**. Danh mục lý do chuẩn `hinh_ly_do` (55, nhóm hoán đổi, `duc=false` cho giả thiết/tham chiếu) + `hinh_loi_cm` E01–E05 —
  vai trò như bảng rule. Bản HS `bai_test_cau.dien` đã **cắt key → ⟦oN⟧** (`_dien_buoc_hs`), `dap_an_key` chữ cái, `o_rule` staff.
- **Pilot khối 7: 23 form** (17 bài gốc Claude đề xuất tay `scripts/mcq-lo/hinh7-dien-goc.json` + 6 biến thể `--ap-khuon`), CEO đã duyệt
  23/23. 34 biến thể áp khuôn KHÔNG được (biến thể gộp/tách bước, đặt tên góc khác) — cần đề xuất tay hoặc chuẩn hoá lời giải theo gốc.
- UI: tab **"Điền ô AI"** (chỉ môn có kho hình) · app HS: nút **"📐 Luyện chứng minh"** ở màn KẾT QUẢ tự luyện → `LamDienO`
  (RPC `tu_luyen_dien_sinh` 3 bài, `hs_dien_tra_loi` chấm ở DB). Câu hình KHÔNG trộn vào lượt 10 câu thường (logic chọn form = vòng sau).
- Còn treo: sửa tại chỗ trong tab duyệt · `ma_dang` câu điền ô = null (cách giải khối 7 chưa gán `hinh_dang`) ⇒ chưa vào mastery ·
  `fn_chon_form` (yếu → ĐIỀN, ổn → TN) · ô "lý do" cho đại số chứng minh (160 câu).

**C. KHO CHUẨN — spec-kho-chuan.md (CEO chốt 09/09, giao WORKTREE KHÁC làm)**
- Sự thật: 17.743 câu Đại, **60 da_duyet**, cờ `da_duyet` **không được lọc ở bất kỳ chỗ chọn câu nào** (99,7% câu HS làm là chưa duyệt).
- Chốt: quét một lượt (máy whitelist dạng → Claude giải lại theo lô chỉ BÁO NGHI → người + mẫu 2%); đúng ⇒ coi như duyệt; có vấn đề
  ⇒ hàng duyệt lại; **câu MỚI phải qua duyệt mới được dùng** — định nghĩa bằng hàm `_kho_cau_chuan` (câu cũ tạm dùng tới khi quét).
  Màn duyệt = chuẩn hoá (sửa dạng bằng ô tìm kiếm, cụm theo dạng, lưu `dang_ai_de_xuat`), gộp 4 đường vào → 1 hàng đợi.
- Đo: máy tính (`scripts/kho-quet-dapso.mjs`) chỉ phủ 14% câu, đáng tin 1.611; lệch clone 0,64% vs gốc 1,45% ⇒ giả thuyết "clone sai
  là chính" chưa có bằng chứng. Lớp 6 dùng dấu chấm làm phép nhân ⇒ máy báo giả, phải xử theo dạng.

**D. Nhập kho từ file Word / PDF (`scripts/docx-doc.mjs`, `nhapkho-file.mjs`)**
- Thứ tự dễ cho Claude: **Word Equation gốc** (OMML→LaTeX, 0 sai số) > PDF ≈ Word MathType (ảnh, đọc mắt). `tính.docx` (61 câu giữa kì 7)
  đã đọc + phân loại + lời giải chi tiết (`scripts/mcq-lo/tinh-docx-lop7.json`), **CHƯA ghi kho** (chờ CEO gật): lệnh
  `node scripts/nhapkho-file.mjs --in scripts/mcq-lo/tinh-docx-lop7.json --ghi`.
- Dạng mới khối 7: `T107010405` Tích bằng 0 (CEO tạo) · `T107010302` Rút gọn luỹ thừa · `T107010406` Tìm x ở số mũ (Claude tạo);
  6 câu T107010203049–054 đã dời sang 405.
- HTML để CEO duyệt phải **TỰ CHỨA** (`scripts/lib/html-tu-chua.mjs`: KaTeX render trong node + font base64 + ảnh data URI) — trình xem
  trong app chặn CDN và ảnh ngoài.

**E. Hạ tầng:** `node scripts/migrate.mjs --only <file>` (áp đúng 1 file treo — dùng khi có file treo của phiên khác; `npm run migrate`
và `--baseline` đều đụng file người khác, đã dính 2 lần 08/09).


### ⭐ TEST ĐẦU VÀO — trạng thái 13/09 (đã push main `8e4aa83`; supersede mục 09/09)
**Luồng đang chạy (ERP máy tính, `Vận hành › Tuyển sinh › Test đầu vào`, 5 tab):**
1. **Phân công** (`PhanCongTestScreen.tsx`, bảng `test_dau_vao_phan_cong` PK (khối, môn) + log): toggle môn, hàng =
   khối, 2 ô SearchSelect người chấm / người trả bài, chọn = upsert ngay. **Trigger DB `tg_ca_test_phan_cong`
   (BEFORE INSERT ca_test)** điền `nguoi_cham_id`/`nguoi_tra_bai_id` còn NULL từ bảng này theo (ung_vien.khoi, ca.mon)
   ⇒ mọi đường tạo ca đều được gán; đổi phân công chỉ áp ca tạo SAU. **Bảng hiện RỖNG** (chỉ 1 dòng K7 Toán 2 cột null
   do tôi test) — CEO cần điền. Ops KHÔNG chọn người ở Điểm danh nữa (card chỉ hiện tên, thiếu ⇒ cam).
2. **Điểm danh test** (`DiemDanhTestScreen`): tạo ca ⇒ `ganDeDangDung` tự gán **đề đang dùng** của (khối × môn)
   (`tai_lieu.loai='de_test_dau_vao'`, bản mới nhất); dropdown chọn đề = lưu ngay; **Hoàn tất chặn khi thiếu bài
   HOẶC thiếu đề**. Gán đề = `ganDeCaTest` snapshot câu vào `ca_test_cau` kèm `nhanh` ('dai'|'hinh') · `muc_do` ·
   `ten_chuyen_de` (duyệt `maCaus` theo thứ tự đề; hàng HÌNH `HINH:<uuid>` snapshot 1 dòng/bài qua `banInTheoMoHinh`;
   câu không còn trong kho ⇒ CHẶN gán + nêu mã). Chưa có đề cho khối × môn ⇒ card báo ⚠ (K6 Toán đang thế).
3. **Chấm test** (`ChamTestScreen`): toggle Của tôi/Tất cả (`nguoi_cham_id`); ca hoàn thành mà thiếu đề VẪN hiện
   (badge ⚠ + nút "Gán đề đang dùng" — đường cứu 5 ca cũ, Tùng K7 07/09 vẫn chưa ai bấm); bảng nhập liệu thuần
   "▸ Câu N | Đ C S" (đề ẩn, bấm số câu mới xổ), ô **Điểm bài nhập tay** (`ca_test.diem_nhap`, thang 10), tổng/% từ
   rpc; đóng chấm cần đủ câu + điểm. Điểm câu do trigger `tg_ca_test_kq_diem`.
4. **Trả bài** (`TraBaiTestScreen`): danh sách card → bấm HS = **`DanhGiaGvModal` toàn màn hình**: TRÁI form
   navy/gold (kỹ năng Trình bày/Tính toán **thang 5** = 5 nút, nhận xét 1 textarea + gợi ý `nhan_xet_mau` nhom
   'khac', lớp đề xuất SearchSelect lưu ngay vào `ung_vien.lop_du_kien_id`), PHẢI = phiếu thật xem trước co theo
   màn (`transform: scale`), autosave nháp 700ms (`ca_test.nhan_xet` jsonb `{trinhBay:1..5, tinhToan:1..5, khac}`;
   dữ liệu cũ tot/on/kem → 5/3/1 qua `mucKyNang`), **📋 Copy ảnh gửi PH**, ✓ Đã gửi đóng (cần chấm xong + scan
   bài đã chấm + lớp). "Đã trả bài" bấm = xem lại phiếu. **Đại/Hình vẫn tính ở DB, KHÔNG lên phiếu/form.**
5. **Đề test**: sinh đề từ MT/Đề thi (giữ nguyên).
**Phiếu gửi PH** (`PhieuTestDauVao.tsx`, read-only, 720px, kit `BK_KET_QUA_KIEM_TRA_DAU_VAO_UI_KIT_v1` 12/09):
header/footer navy + **ảnh ruy băng gold thật** (`public/bk-ui/td_header.png`/`td_footer.png`, `background-size:
cover`), logo colorful `logobk.png` trong ô trắng, profile (avatar cartoon `td_boy/td_girl` theo
`ung_vien.gioi_tinh`, null ⇒ glyph) + card Điểm test `td_cup` "x/10", khối 1 % chuyên đề (thanh navy→gold), khối 2
donut **tô đúng % đúng tổng** (navy = điểm cơ bản, gold = nâng cao, còn lại xám), khối 3 kỹ năng x/5, khối 4 nhận
xét (hộp xanh + `td_quote`, minHeight 3 dòng), khối 5 "LỚP / tên" đè lên `td_badge` (nguyệt quế + vương miện), footer
địa chỉ Geleximco + hotline 0963.209.309 + Pacifico "Học thật / Tiến bộ thật". Mọi số liệu từ
**`fn_test_dau_vao_phieu(uuid) → jsonb`** (có `gioiTinh`, mig 202609131618). Xuất ảnh = outerHTML → popup
html2canvas; 8 asset fetch → data URL, thiếu ⇒ pixel trong suốt (`ASSETS`, `PX_TRONG`). Ruy băng/icon SVG inline
vẫn còn làm fallback. Icon nhỏ = SVG tự vẽ (sheet icon ChatGPT không cắt sạch).
**Việc của tôi (ERP):** 2 khối flat "✍️ cần chấm" / "📨 cần trả bài" theo `nguoi_cham_id`/`nguoi_tra_bai_id`, gồm cả
ca **đang test** (nhãn "đang test, chờ bài"), click ⇒ `moTabTestDauVao('cham'|'tra_bai')` + leaf `test_dau_vao`.
App TA/GV điện thoại **KHÔNG** có test đầu vào (CEO 10/09: "làm trên máy tính thôi"; nhắc việc = context khác).
**Còn treo / cần người:** CEO điền tab Phân công · học thuật sinh đề K6 Toán (và các khối × môn khác) · rà
`muc_do` dạng (đề K7 34/34 câu mức 3 ⇒ phiếu luôn 100% cơ bản) · Ops điền `gioi_tinh` (95/192 ứng viên null) ·
5 ca cũ thiếu đề (Tùng, Phúc, Thiện Minh, Gia Huy, Test QA) chờ bấm "Gán đề đang dùng" · chưa ai verify **ảnh
Copy cuối** bằng tay sau lần lắp asset (Browser pane không mở popup thứ 2). File nguồn `*_testdauvao.png`,
`asset_dauvao.png`, `header_bg/footer_bg.png`, 4 svg kit v1.1, `td_icon_*.png` còn trong `public/bk-ui/`
chưa commit — dọn cần CEO gật.
**Cảnh báo hạ tầng còn nguyên:** `migrate --status` thấy migration có trong sổ DB nhưng không có file ở main
(nhánh/worktree chưa merge) — gom file về main trước khi tin `npm run migrate` ở máy mới. Repo chính từng
**mất `.env.local`** (10/09) — chép lại từ worktree; port 5173 có thể do vite của worktree khác giữ.

### ⭐ 10/09 (tối) — NHẬP CÂU HGT QUA CLAUDE: 25 câu Phần A Toán Tứ Tâm PT mặt phẳng vào chờ-duyệt (worktree `nhap-bando`)
**CEO chốt luồng nhập kho:** đưa file docx/pdf → Claude tách đề+giải+phương án + gán `dang_chinh` → INSERT `hgt_cau_hoi` với `da_duyet=false` + `dang_ai_de_xuat=dang_chinh` → CEO duyệt ở màn duyệt hợp nhất (`DuyetCauTab`). Precision AI đo được sau (count(dang_ai_de_xuat=dang_chinh)/count(dang_ai_de_xuat not null)).

**Worktree mới `.claude/worktrees/nhap-bando`** (branch `worktree-nhap-bando`, base `de50d03`). Có `.env`/`.env.local` copy + `node_modules` symlink về gốc.

**Nguồn file phải là PDF, không docx.** Toán Tứ Tâm DOCX dùng MathType kiểu cũ — mọi công thức = ảnh vector `.wmf` (file 2 MB có 758 wmf, 0 OMML); pandoc convert docx→md mù toàn bộ math ("VTPT của mp ![image47.wmf]"). PDF export chính hãng thì Claude `Read pages=1-N` render vision đọc math sharp (đọc thẳng LaTeX được). **Ai đưa docx → hỏi có PDF không**; PDF không có thì convert bằng Word/LibreOffice ở máy CEO rồi mới nạp.

**Convention `hgt_cau_hoi` (đo từ code + sample thật):**
- `loai_cau='trac_nghiem'` (không phải `'tn'`; giá trị hợp lệ: `trac_nghiem`·`dung_sai`·`tra_loi_ngan`·`tu_luan`).
- `lua_chon` jsonb array 4 chuỗi, mỗi chuỗi kết thúc `.`, KHÔNG tiền tố "A."/"B."; `dap_an` = chữ đơn "A/B/C/D".
- `noi_dung`/`loi_giai` KaTeX inline `$…$` (`\dfrac`, `\vec{…}`, `\begin{cases}…\\…\end{cases}`, `\Rightarrow`, `\alpha`…).
- `nguon='le'`, `nguon_giai='nguoi'`, `da_duyet=false` (default).
- **`ma_cau` phải EXPLICIT** = `<dang_chinh><STT 3 số>` theo `src/lib/kho/api.ts:447` — đừng để default `('GC'||nextval)` (chỉ dùng khi ma_cau chưa có convention). STT = `MAX(ma_cau) WHERE ma_cau LIKE '<dang>%'` + 1.
- **`dang_ai_de_xuat = dang_chinh`** khi Claude gán (spec `202609080938_kho_duyet_hop_nhat.sql`). Người duyệt đổi `dang_chinh` nếu sai; `dang_ai_de_xuat` giữ vết bản gốc AI.
- **Ảnh vào `anh_de`** (không `anh_dap_an`) khi HS cần thấy khi ĐỌC đề để định vị tên đỉnh/vật thể; upload trực tiếp qua HTTP `POST {SUPABASE_URL}/storage/v1/object/kho-anh/<uuid>.png` với `SUPABASE_SERVICE_ROLE` bearer (env.local) — hoặc dùng helper `uploadKhoImage` từ UI (`src/lib/kho/api.ts:429`).

**Bảng đích khoi=12 (31 dạng trong `hgt_ban_do`):** chuyên đề "Phương trình Mặt phẳng" chỉ 4 dạng (T312010101 VTPT+kiểm tra điểm · T312010102 viết PT qua điểm+VTPT · T312010103 qua 3 điểm · T312010107 tìm tham số); các dạng liên quan chéo chuyên đề (khoảng cách/vị trí/góc): T312010105 · T312010106 · T312010505 · T312010601 · T312010602 · T312010701. Có duplicate ngữ nghĩa T312010105 vs T312010503 (khoảng cách điểm-mp) và T312010106 vs T312010701 (vị trí tương đối 2 mp) — chưa gộp, chọn theo chuyên đề của tài liệu.

**Đã INSERT lô đầu (25 câu Phần A `C5-BÀI 1 PT Mặt phẳng P2`):** 13 câu T312010101081..093 · 7 câu T312010102040..046 · 2 câu T312010103019..020 · T312010105023 · T312010106016 · T312010107026. Câu 1, 2 có ảnh (`anh_de`=URL bucket `kho-anh`, hình lập phương ABCD.A'B'C'D'). CEO đã duyệt 8/25 (câu 3-10 lô đầu tiên) trong lúc Claude đang chạy fix — trạng thái này bình thường (song phiên).

**Script mẫu ở scratchpad (không commit repo, chỉ để refer):** `insert_cau.mjs` (validate + 1 transaction INSERT với RETURNING, ROLLBACK cả lô nếu 1 câu lỗi) · `upload_and_fix.mjs` (upload ảnh HTTP + UPDATE `anh_de` + rename ma_cau cascade). Chạy qua stdin từ cwd repo (`cat script.mjs | node --input-type=module`) vì `pg` chỉ có trong `node_modules` repo.

**Scope lô đầu = chỉ Phần A trắc nghiệm.** Phần B (Đúng-sai — có `menh_de` jsonb, `loai_cau='dung_sai'`), C (TLN, `loai_cau='tra_loi_ngan'`), D (Tự luận, `loai_cau='tu_luan'`) chưa xử — làm sau khi CEO thấy chất lượng lô đầu OK.


### ⭐ 12-13/09 — TRẮC NGHIỆM TỪNG PHẦN (Điền Ô Phase 2 Đại) — kiến trúc ĐÃ XÂY, worktree `mcq-tung-phan`, 4/9 dạng ĐÃ GHI DB

**Đây CHÍNH LÀ Phase 2 (Đại tính toán) của `spec-dien-o.md`** (CEO chốt 09/09, chưa xây lúc đó) — không phải khái
niệm mới, xem cầu nối `spec-mcq-tung-phan.md`. Đính chính dòng cũ ở mục "08–09/09 (A)" phía trên: kiến trúc **KHÔNG
còn** "chưa thiết kế" — đã build xong ở worktree riêng `.claude/worktrees/mcq-tung-phan` (nhánh `worktree-mcq-tung-phan`).

**Quy trình CEO chốt 12/09 (khác quy trình pool TN mục A)**: với MỖI dạng tự luận, CTO đề xuất CHỖ CHIA (ô nào đục,
phương án sai gì) → CEO duyệt mẫu 10 câu → mới chạy cả dạng → verify → ghi (`da_duyet=false`). KHÔNG sinh+ghi cả
dạng rồi mới hỏi (nhóm Toán thực tế dưới đây lỡ làm ngược thứ tự — chấp nhận vì spec đã ghi "100% máy" từ trước;
từ dạng GTLN/GTNN trở đi tuân đúng quy trình).

**⭐ CEO chốt kiến trúc lưu ô (12/09 tối): LƯU HẾT mọi chỗ có thể điền, KHÔNG cố định 3-4 ô/câu.** Lý do Thùy nêu:
"giết nhầm còn hơn bỏ sót... sau này còn biết học sinh hay sai ở đâu". Mỗi ô gắn nhãn `vi_tri` (tên vị trí trong
khuôn, vd `so_ben_ngoai`/`tap_uoc`/`tap_n`/`x`/`y`...). Trần DB nới 4→8 ô/câu (`202609122158_dien_o_luu_het_o_vi_tri.sql`).
**Lúc GIAO BÀI mới chọn tổ hợp 3 ô/câu (mặc định), tối đa 4** — xoay vòng theo HS/lần làm để mọi vị trí đều được đo
(việc chọn-lúc-giao CHƯA LÀM, xem "Còn treo" cuối mục).

**Hạ tầng dùng chung 3 dạng dưới đây:**
- Bảng `dai_cau_form_dien` (mig `202609121423`) — `buoc`/`o` giống `hinh_form_dien` nhưng khoá `ma_cau` (không phải
  `cach_giai_id`), registry `_kho_form_dien_tbl`. Trigger kiểm cấu trúc + trigger thu hồi khi `dai_cau_hoi.loi_giai`/`dap_an` đổi.
- `scripts/lib/dien-buoc.mjs` — bộ đọc CHUNG tách lời giải theo dấu `=` trong từng đoạn `$…$` (giữ offset tuyệt đối
  để đục lỗ đúng chỗ), dùng khi dạng KHÔNG có khuôn riêng.
- `scripts/mcq-dien.mjs` — CLI `--sinh/--verify/--xem/--ghi` (khuôn theo `scripts/mcq-auto.mjs` cũ). Dạng có khuôn
  riêng (map `KHUON` trong file) override bộ đọc chung bằng hàm ở `scripts/lib/dien-khuon-<ten-dang>.mjs`.
- **⭐ Mã rule Điền Ô dùng TIỀN TỐ RIÊNG `D01`, `D02`... — KHÔNG nối tiếp dãy `R` của form TN.** Lý do: 12/09 đụng
  mã rule THẬT với luồng `form-tn` (khối 8-9) **2 lần trong 1 ngày** (đặt `R89-R99` rồi lại `R125-R129`) vì cả 2
  luồng cùng `select max(ma)+1` song song. Tách hẳn không gian mã (`D%` cho `mcq-dien`, `R%` cho `mcq-auto`) là
  cách duy nhất chắc chắn không đụng độ khi 2+ luồng chạy song song — xem bài học ②.

**A. Toán thực tế (T106020304 39 câu + T107010205 66 câu) — ĐÃ GHI DB, `da_duyet=false`**
- Ô = kết quả 1 phép tính con trong lời giải (theo `dien-buoc.mjs` chung). 5 rule mới `R100-R104` (quên chia %,
  lấy nhầm % bù, nhầm cộng/trừ, lệch 1 số 0, quên nhân số lượng — seed TRƯỚC KHI chốt đổi sang tiền tố `D` nên vẫn
  mang mã `R`, không đổi lại vì đã ghi DB dùng rồi).
- Kết quả: 91/105 câu, 252 ô, verify 0 FAIL. 14 câu bỏ (lời giải kho viết toán ngoài `$…$`, hoặc giá trị ô trùng
  số có sẵn trong đề).

**B. GTLN/GTNN có căn/|…|/(…)² (`077022220401`, 87 câu) — 3 vòng duyệt mẫu, DB ĐANG GIỮ VÒNG 1 (83 câu, CŨ)**
- Khuôn riêng `scripts/lib/dien-khuon-gtln.mjs`. Ô kiểu MỚI `quan_he` (HS chọn CHIỀU bất đẳng thức + vế phải,
  không phải một số).
- **Vòng 1** (CEO duyệt): ô ở dòng đảo chiều + dòng kết luận + x/y ở dấu bằng. 83 câu, 200 ô, **ĐÃ GHI DB**
  (rule `D01-D06`).
- **Vòng 2** (CEO góp ý thêm 2 lần: "dòng đầu tiên |2x-3|≥0 cần 1 câu chỗ này" + "cả mấy dòng biến đổi nữa … còn
  A≥17 thì bỏ đi vì nó tư duy gì đâu"): thêm ô ở dòng đầu (tính chất không âm, rule `D07/D08`) + MỌI dòng biến đổi
  ở giữa (rule `D09-D11`, tái dùng `D01/D03/D06`), **bỏ hẳn ô kết luận**. Kết quả 86/87 câu, 325 ô, verify 0 FAIL
  nhưng **CHƯA GHI** — muốn thay 83 câu vòng 1 bằng 86 câu vòng 2 phải `xoa_at` (kho rác) 83 bản cũ rồi ghi lại,
  **đang chờ CEO gật xoá** (Luật xoá CLAUDE.md).

**C. "an+b ⋮ cn+d" (`T106030401`, 139 câu) — ĐÃ GHI DB (`da_duyet=false`)**
- Khuôn riêng `scripts/lib/dien-khuon-ancnd.mjs` — **KHÔNG dùng AST của `mcq-auto.mjs`** (không biểu diễn đa
  thức/biến), viết bộ giải SỐ HỌC riêng bằng BigInt. Đáp số mọi ô = MÁY TỰ TÍNH từ (a,b,c,d) đọc từ đề; lời giải
  kho chỉ dùng để XÁC NHẬN vị trí đục đúng chỗ (nhân chứng thứ hai).
- 4 vị trí/câu: `so_ben_ngoai` (hằng số dư sau tách — CEO chỉ đích danh "hay sai đặc biệt ở chỗ này") · `tap_uoc`
  (Ư(r), tập SỐ `{...}`) · `menh_de_uoc` (mệnh đề "denomExpr ∈ U(r)" — biểu thức MẪU, tách riêng khỏi `tap_uoc`;
  CEO chỉ thêm 13/09: "x-1 thuộc ước của 4") · `tap_n` (tập nghiệm cuối, sau "thử lại"). Rule `D12-D25` + `D38-D40`.
- **Phát hiện toán học**: hệ số tử `a` CHIA HẾT hệ số mẫu `c` ⇒ tách chính xác (k=a/c), không nghiệm ngoại lai,
  không cần thử lại; không chia hết ⇒ phải nhân 2 vế với `c`, có thể sinh nghiệm ngoại lai, kho làm "thử lại".
  Máy tính CẢ HAI công thức rồi so với số thật trong lời giải để chọn đúng cách — không suy diễn theo cách kho làm.
- Kết quả: **139/139 câu (100%)**, 512 ô, verify 0 FAIL, vị trí đúng đều 128. Câu biên r=1 (Ư(1)={1}, ban đầu bỏ
  vì không đủ distractor cho `tap_uoc`) được VỚT LẠI nhờ thêm vị trí `menh_de_uoc` độc lập.

**D. Dãy hiệu tích `T107010501` (50 câu) — ĐÃ GHI DB (`da_duyet=false`), 5 khuôn con A/B/C/D/E**
- Khuôn riêng `scripts/lib/dien-khuon-hieutich.mjs`, kỹ thuật `1/(k(k+S)) = (1/S)(1/k − 1/(k+S))`. Dispatcher 1
  hàm `timUngVienHieuTich` phân biệt theo cấu trúc đề (có ẩn x trong mẫu? có "..."? x là hệ số ngoài?):
  **A** tính tổng mẫu cách đều S≥1 (2 ô `tach_day`/`rut_gon`, đại diện 1 dòng cho cả chuỗi dài) · **B** tìm x ở
  mẫu hạng cuối "x(x+S)", chuỗi VÔ HẠN có "..." · **C** như A nhưng x là HỆ SỐ NHÂN NGOÀI cả tổng · **D** "liệt kê
  từng cặp" nối bằng ";" (kho viết từng đẳng thức 3 vế RIÊNG cho mỗi cặp, đục 1 dòng đại diện) · **E** như D nhưng
  ẩn x, chuỗi liệt kê HỮU HẠN không "..." — mỗi dòng liệt kê là 1 Ô RIÊNG (không đục đại diện), vì Thùy chỉ trực
  tiếp trên ảnh chụp lời giải 049: "để 3 ô trống ở 3 biểu thức biến đổi đấy là được mà, đoạn tách ra thành 2 phân
  số trừ đi nhau ấy". Rule `D41-D48` (khuôn E dùng lại nguyên D41/D46/D48, không cần rule mới).
- Kết quả: **50/50 câu (100%)**, 101 ô, verify 0 FAIL, phân bố đúng đều {A:25,B:25,C:25,D:26}.
- T107010502 (10 câu, mẫu KHÔNG cách đều đơn giản — cấu trúc khác hẳn) chưa đụng, ngoài phạm vi dạng này.

**Còn treo / việc kế tiếp:**
- CEO gật ghi: vòng 2 GTLN/GTNN (thay 83→86 câu, đang chờ gật XOÁ 83 câu vòng 1 theo Luật xoá).
- D3 (chưa làm, cả 3 dạng): tab "Điền ô AI" cho Đại (RPC `fn_dien_form_cho_duyet` hiện chỉ đọc `hinh_form_dien`,
  chưa nối `dai_cau_form_dien`) · component HS hiện bước LẦN LƯỢT (hiện cả bài thì dòng "Vậy... khi x=..." cuối
  câu lộ đáp án các ô trước) · logic CHỌN TỔ HỢP ô lúc giao bài (3/tối đa 4, xoay vòng theo `vi_tri`) · snapshot
  `bai_test_cau.form_dien_id` đang FK sang `hinh_form_dien`, cần cột riêng hoặc bỏ FK cho Đại.
- 4 dạng còn lại trong hàng đợi `spec-mcq-tung-phan.md` chưa đụng: dãy luỹ thừa `T106020601` (44 câu, CEO chỉ
  "sai dấu khi trừ 2 dãy cho nhau" — 33/44 câu đã làm ở lần trước "đục cả cụm", 11 câu "đan dấu + bước nhảy ≥2"
  còn để dành, mẫu 33 câu đã gửi CEO nhưng CHƯA có "ghi đi") · dãy tích `T107010508` (6 câu, CEO chỉ "khó nhất ở
  đoạn tách thành tích 2 số rồi tách 2 dãy" — ít câu, định viết tay như pilot Hình chứ không đáng viết máy) ·
  T107010502 (10 câu, xem mục D trên) · "Có/Không" `T106030102+T106030403` (93 câu, CTO CHƯA BIẾT CHIA — đã báo
  CEO, chờ CEO làm mẫu hoặc bỏ) · bất đẳng thức dãy `T107010504/505/506/507` (67 câu, lớp 7, CEO chưa chỉ chỗ sai
  cụ thể).


### Đã build (18/09 — Chuẩn hoá mã bản đồ Đại + UI chuyển/gộp/xoá)

**Rule mã Đại (đã đúng chuẩn 100% sau bước 3):** `T1 + KK + CD + CE + DD` — chủ đề len 6, chuyên đề len 8, dạng len 10. Khối `KK` chấp nhận `\d{2}` (03-12) HOẶC `\dT` (4T/5T — khối riêng, KHÔNG phải lớp 4/5 tiểu học). 3 kho khác giữ mapping cũ: T2=Hình học · T3=HGT · K=KHTN (KHÔNG swap).

**Function DB (§2.0 nguồn duy nhất) — mig `202609180046` + `202609180055`:**
- `fn_dai_ma_hop_le(ma, tang)` · `fn_dai_ma_kho_cha(ma, tang)` · `fn_dai_kiem_ma()` (verify bất biến).
- `fn_dai_sinh_ma_chuyen_de(chu_de, stt?)` · `fn_dai_sinh_ma_dang(chuyen_de, stt?)` — LUÔN max STT+1 trong parent, CHỈ đếm mã đúng chuẩn (bỏ qua rác).
- `fn_dai_chuyen_dang_ma_moi(dang, cd_moi)` — thuần tính, LUÔN cấp STT mới.

**RPC transactional (mig `202609181123` + `202609181233` + `202609181310` + `202609181342`):**
- `fn_dai_chuyen_dang(ma_dang, ma_chuyen_de_moi) → new_ma_dang` — chuyển 1 dạng qua chuyên đề đích. FK cascade lo dai_cau_hoi/menh_de/cum_bai/ly_thuyet/thuoc_tinh/tien_de. Text-ref update tay: ca_test_cau (**+ sync `ten_chuyen_de` + `muc_do`** — snapshot phiếu test), gami_session_problems, bai_test_cau, tu_luyen_dang_lan, buoi_danh_gia_dang, bo_tro_duoi_dang, bo_tro_yeu_dang, canh_bao_yeu. Đích PHẢI có ≥1 dạng khác.
- `fn_dai_chuyen_chuyen_de(ma_chuyen_de, ma_chu_de_moi) → new_ma_chuyen_de` — chuyển CẢ chuyên đề (kèm mọi dạng con). Cấp mã chuyên đề mới max+1 trong chủ đề đích, mọi dạng con bảo tồn 2 số STT cuối. Batch qua temp table `_cd_map`.
- `fn_dai_gop_cau_dang(nguon, dich) → {so_cau, so_menh_de}` — CEO chốt scope hẹp: **chỉ chuyển `dai_cau_hoi.dang_chinh` + `dai_cau_menh_de.dang_chinh`**. KHÔNG đụng cụm/lý thuyết/thuộc tính/tiền đề/text-ref lịch sử. KHÔNG xoá dạng nguồn (CEO tự gộp lý thuyết + xoá tay sau).
- Trigger `trg_log_doi_dang` GIỮ nguyên cho chuyển/gộp (log CHÍNH XÁC câu đổi dạng, feed `fn_kho_doi_dang_tk`). Chỉ disable trong migration RENAME MASS (bước 3).

**Client + UI (`src/lib/kho/api.ts` + `src/screens/kho/BanDo.tsx` — chỉ Đại `config.key === 'dai'`):**
- 3 wrapper: `chuyenDaiDang` · `chuyenDaiChuyenDe` · `gopDaiCauDang`.
- Nút `→` (chuyển dạng qua chuyên đề khác) · `⇓` (gộp câu vào dạng khác) · `✕` (xoá) trong `LeafCard`, hover mới hiện.
- Nút `→` (chuyển chuyên đề qua chủ đề khác) giữa `✎` và `✕` trong card chuyên đề (sidebar).
- 3 modal SearchSelect cross-chủ đề/chuyên đề trong khối hiện tại.
- **maxOrd → maxOrdCon** (line 1651) — chặn bug sinh mã lệch (parseInt nuốt phần vị trí dài). Filter codes = `startsWith(parent) && length === parent.length+2 && /^\d{2}$/.test(slice(-2))`. Áp cho **4 kho + legacy 4T/5T**.

**Đề thi cũ (`toan_de_thi_cau.ma_cau_dai`) VẪN dùng được** — FK cứng tới `dai_cau_hoi.ma_cau`, mà `ma_cau` KHÔNG đổi khi chuyển dạng/gộp (chỉ `dang_chinh` đổi).

**Chưa làm:**
- Bước 1b: function chuẩn hoá cho HGT (T3) / KHTN (K) / Hình (T2). Hình học phức tạp (Học vs Luyện + mô hình + bài) — cần CEO chốt format mã `hinh_baitoan` (mã mô hình + STT bài) trước.
- Bước 2b: chuyển `suggest*` client sang RPC sau khi bước 1b có function 4 kho.
- CHECK constraint `dai_ban_do.ma_dang ~ '^T1(\d{2}|\dT)\d{6}$'` — chờ 3 kho khác cũng sạch để áp đồng thời.
- Gộp CHUYÊN ĐỀ (khác chuyển 1-1) — hiện chưa cần, sẽ build khi CEO có ca thật.

### Đã build (18–20/09 — SỔ TAY KIẾN THỨC cho app HS: kho tra cứu lý thuyết)

- **Là gì:** HS mở app → ô "Sổ tay kiến thức" → tra lý thuyết + bài mẫu của 1 dạng. 2 đường vào: gõ tên (gợi ý theo ký tự, **bỏ dấu** bằng `fn_bo_dau` — DB này KHÔNG có extension `unaccent`) hoặc lọc dần **Chủ đề → Chuyên đề → Dạng** + lọc độ khó.
- **⚠ Thứ tự tầng: `ma_chu_de` là CHA, `ma_chuyen_de` là CON** (`MapRow` — `lib/kho/api.ts:1746-1747`). CEO mô tả ngược ("chuyên đề → chủ đề"); theo DB.
- **Phạm vi v1 (CEO chốt):** Toán, nhánh **Đại + Hình GT**. KHTN đối xứng sẵn nhưng chưa bật UI. **Hình học thuần (`hinh_hoc_bai`) ĐỨNG NGOÀI** — `ma_chuyen_de/ten_chuyen_de` (mig 202609181735) còn RỖNG nên không dựng được cây lọc. (`muc_do` từ 27/09 đã dùng = độ khó Bài 1–5 đánh tay — xem mục Kho Hình học · phase Học.)
- **Lọc theo KHỐI, KHÔNG theo bậc** (CEO: "bậc nào cũng thấy dạng khó và dễ") ⇒ `bac_toi_thieu` KHÔNG dùng để cắt. Độ khó = `muc_do` 1–5 gộp 3 nhóm ở DB (`_sotay_nhom`): 1–2 cơ bản · 3 trung bình · 4–5 nâng cao.
- **Phải là RPC `security definer`, không query thẳng:** bảng lý thuyết bật RLS member-gate ⇒ tài khoản HS SELECT thẳng trả **0 dòng im lặng**. Không snapshot được như `bai_test_cau.ly_thuyet` (mig 0067) vì sổ tay tra cứu tự do, không gắn bài.
- **File:** mig `202609181946` (2 helper + 3 RPC: `hs_sotay_cay` / `hs_sotay_tim` / `hs_sotay_dang`) · mig `202609182334` (siết quyền `anon`) · `src/lib/sotay.ts` · `src/screens/hocsinh/SoTayHS.tsx` · ô vào ở cả 3 biến thể màn chính (`KHU` cấp 3 · `KHU_CAP2` cấp 2 · `BOX_CAP1` cấp 1). Render dùng lại `MathText` (KaTeX đã có sẵn trong bundle HS, không kéo thêm lib; chunk 784 kB, xa trần 2 MiB của Workbox). Demo UI: `hs.html?demo=sotay` (mock, DEV-only).
- **§1.5:** dạng chưa có lý thuyết **KHÔNG hiện** (thà vắng còn hơn mở ra trang trắng). `noi_dung` default `''` nên lọc `btrim(...) <> ''`, không phải `is not null`. RPC trả kèm `thieu_ly_thuyet` để đo độ phủ. Dòng "Chưa phân dạng" (mã tận cùng `000000`) bị chặn bằng `_kho_la_dang_cho()`.
- **⚠ ĐỘ PHỦ THẤT VỌNG — đo 20/09:** Đại **356/678 = 52.5%** có lý thuyết · Hình GT **14/45 = 31.1%**. Khối 6-9 có **103 dạng thiếu**, trong đó 63 dạng CÓ câu, **1.589 câu** nằm ở dạng không lý thuyết. Nặng nhất `T108030104` "Phân tích đa thức thành nhân tử bằng phương pháp tách hạng tử" (k8, **111 câu** — nhiều câu nhất khối 8) hiện KHÔNG có trong sổ tay. Cột "chỉ có `file_url`" = **0 ở mọi khối** ⇒ bộ lọc không giấu mất gì.
- **⭐ SMOKE TEST — `npm run smoke:sotay`** (`scripts/smoke-sotay.mjs`). **GỌI THẬT** cả 3 RPC bằng phiên `authenticated`: tự đọc `VITE_SUPABASE_URL` / `VITE_SUPABASE_KEY` / `VITE_DEV_ACCOUNTS` từ `.env` rồi `signInWithPassword` (không in mật khẩu). Assert: cây có ≥1 chủ đề + ≥1 lá · tìm bằng 2 tiếng lấy TỪ CHÍNH tên lá đó phải ra ≥1 và phải chứa đúng `ma_dang` ấy · từ khoá vô nghĩa phải ra 0 (đối chứng âm, chống "hàm trả bừa mọi dòng") · mở lá đó phải có `noi_dung` khác rỗng. Exit 1 khi fail ⇒ cắm CI được. Mã dạng **không hardcode** — lấy sống từ cây nên đổi mã không làm hỏng test.
  **Chạy script này sau MỌI migration đụng 3 RPC sổ tay.** Nó sinh ra vì `tsc`/`build`/test anon/đo bằng SQL đều KHÔNG bắt được lỗi 20/09 (`hs_sotay_tim` throw ở `format()`): không đường nào trong số đó GỌI HÀM.
- **Verify end-to-end (20/09):** `hs_sotay_cay` ✅ chạy thật, trả cây. `hs_sotay_tim` ❌ throw `22023` cho tới khi áp mig `202609201056`. `hs_sotay_dang` — smoke test chưa chạy tới (dừng ở bước ②), verify lại sau khi áp.
- **⚠ `khoi_list` sắp theo TEXT**, nên thứ tự là `["10","11","12","3","4","4T",…]`. Tài khoản KHÔNG phải HS (staff) gọi `hs_sotay_cay` với `p_khoi=null` sẽ rơi về `khoi_list[0]` = **khối 10**, không phải khối nhỏ nhất. Không ảnh hưởng HS thật (có `khoi` riêng), nhưng đọc kết quả smoke test thì đừng ngạc nhiên.

### Đã build (16–27/09 — ⭐ KHO HÌNH HỌC · PHASE HỌC: đơn vị "Bài" phẳng, tái dùng NGUYÊN module Đại)

- **Ý CEO (16/09):** học hình chia 2 phase **độc lập**. **HỌC** = đơn vị **"Bài"** ≈ 1 Dạng bên Đại (lý thuyết 1 block + cụm + câu phẳng; KHÔNG cây chủ đề/chuyên đề, KHÔNG biến thể/chuỗi ý/bổ đề — ý a/b/c gộp 1 câu 1 lời giải). **LUYỆN** = mô hình/dạng/bổ đề cũ (`hinh_*`), giữ nguyên. Câu Bài có thể gắn nhãn `mo_hinh_id` (optional, làm mastery signal sang Luyện — **chưa có UI**).
- **Schema (5 mig, đều áp rồi):** `202609161521` (4 bảng `hinh_hoc_bai` · `_bai_ly_thuyet` · `_cum_bai` · `_cau_hoi` + RPC `count_cau_by_bai_hh`) · `202609161648` (compat `dai_cau_hoi`: câu `ma_bai→dang_chinh`, cụm `ma_bai→ma_dang`, +7 cột `loai_cau/lua_chon/menh_de/nguon/nguon_giai/parent_ma_cau/clone_method`) · `202609161841` (bỏ `khoi` khỏi câu) · `202609181735` (`hinh_hoc_bai` + `ma_dang`/`ten_dang` GENERATED alias của `ma_bai`/`ten_bai` + `muc_do`/`ma_chuyen_de`/`ten_chuyen_de` nullable) · `202609181852` (câu + `kho_chuan default true`).
- **Code:** `lib/kho/hinhhoc.ts` CHỈ còn CRUD Bài + wrapper lý thuyết (shape `LyThuyetApi`) + adapter `listHinhHocMap` (2 tầng cha DUMMY "Khối X · Hình học" → "Danh sách Bài"). Câu/cụm/editor lý thuyết/nhập ảnh-PDF-clipboard = **module Đại nguyên xi** (`DangHub`, `CauModal`, `AiImportModal`, `CumBaiTab`, `LyThuyetModal`) qua `cauTbl='hinh_hoc_cau_hoi'` + 1 dòng `CUM_TBL`.
- **UI kho:** tab Hình học có toggle **📖 Học | 🏋️ Luyện** (`KhoScreen`, nhớ `localStorage kho.hinh.phase`). Học → `KhoHinhHocScreen`: card Bài có chip **độ khó 1–5** (bấm xoay 1→5→bỏ, ghi `muc_do`), duyệt, nút lý thuyết; click card → `DangHub`.
- **Tài liệu — nhánh `'hinh_hoc'`** trong `NHANH_CUA_MON['Toán']` + `khoCuaMon`: **Giáo trình** (tab thứ 3 ở `TaiLieuScreen`, toggle generic theo registry) · **ET** (nút "Hình học" đứng trước "Hình (Luyện)" — Luyện vẫn panel riêng, guard `nhanh==='hinh'`) · **BT bổ trợ** (cauTbl theo `bt.nhanh`; `DangPickerOne chonNhanh` khi chưa có dạng, dạng đầu set `tai_lieu.nhanh`).
- **In giáo trình Hình học:** 3 chế độ hình/câu `CauHinh.hinhCheDoByCau` (`hien`/`o_trong`/`khong`, chỉ nhánh `hinh_hoc`; enum + `cheDoKe` dùng chung `lib/kho/hinhGiaoTrinh.ts`). Nút xoay 📷/✏️/🚫 trong builder; **preview builder luôn đủ ảnh** (chế độ chỉ áp lúc in). `o_trong` = **lưới caro 5mm, không chữ**; bản GV vẫn hiện ảnh.
- **Chung mọi nhánh:** preview `anh_de` đủ ở `KhoPicker` + builder · `DangPicker` (export từ `TaiLieuBuilder`) có filter độ khó 1–5 (chỉ hiện khi có leaf có `mucDo`) · ET "Thêm nhanh theo dạng" dùng `DangPicker` MULTI, mặc định mở, mỗi dạng 1 ô số câu (per-hàng vẫn `DangPickerOne`) · số dòng kẻ tối đa **30→50** ở 7 chỗ.
- **Data 27/09 — ghép Luyện lớp 7 → Học:** nguồn thật = `hinh_mo_hinh` (12) + `hinh_baitoan` (150) + `hinh_cach_giai` (154). ⚠ **`hinh_bai` RỖNG hoàn toàn (0 dòng mọi khối)** — tên giống nhưng không phải nguồn. Rule CEO "Ko có đề riêng thì mới dùng mô hình": `phat_bieu` chỉ là câu hỏi (`de_bai_chuan` 100% NULL) ⇒ `noi_dung = mh.gia_thiet + gia_thiet_them + bt.gia_thiet_rieng/phu + phat_bieu`; `anh_de = bt.anh_chuan ?? mh.anh_cau_hinh`; `loi_giai` = cách giải `la_mac_dinh`. Kết quả **3 Bài mới + 9 gộp theo tên, 150 câu `da_duyet=false`** ⇒ lớp 7 = **13 Bài / 267 câu**. Script 1 lần, **không idempotent** (chạy lại = nhân đôi), đã xoá.

**Chưa làm / treo:**
- **150 câu ghép lớp 7 chờ CEO duyệt** — vài câu có thể lặp bối cảnh (khi `phat_bieu` dài đã tự có giả thiết). Lớp 8 (26 mô hình) + 9 (3) **chưa ghép**.
- `kho_chuan` đang `default true` ⇒ câu CHƯA duyệt vẫn chọn được vào tài liệu (khác Đại). Nếu siết: mig mới đổi thành generated theo `da_duyet`.
- Giáo trình Hình **LUYỆN** vẫn ở entry riêng `lamtailieu:giao_trinh_hinh` — CEO: "tính sau".
- UI gắn `mo_hinh_id` cho câu Bài · nút chỉnh cỡ ảnh S/M/L (CEO chưa chốt phương án).
- MT/Đề thi/Bổ trợ yếu/Đánh giá còn đọc `banDoTbl` theo `ma_chuyen_de` — `hinh_hoc_bai` có cột compat (rỗng) nên không vỡ, nhưng logic theo chuyên đề vô nghĩa với Hình học; chưa bật nhánh này ở đó.

## ② BÀI HỌC CÒN HIỆU LỰC (đừng đạp lại)

- **⭐ HỌC PHÍ — ba lỗi tính tiền & luật để không mắc lại (06/10):**
  ① **Số ĐÃ ĐÓNG BĂNG không được cộng lại như số mới.** Hoá đơn chốt kỳ sau chứa dòng "Nợ kỳ trước" (`hoa_don_dong.loai='no_ky_truoc'`); nợ tổng = nợ_đầu_kỳ + Σ(tong_tien − dòng mang sang) − Σ thu — KHÔNG phải Σ tong_tien − Σ thu (đếm đôi, kỳ thứ 3 đếm ba). Nợ_đầu_kỳ = max(`no_khoi_tao`, dòng mang sang của hoá đơn chốt ĐẦU TIÊN) vì `no_khoi_tao` bị đặt về 0 sau khi thu. Hai hàm `fn_hocphi_so_du_no` + `fn_hocphi_no_theo_ph` PHẢI cùng công thức (đã kiểm khớp 0 lệch). Thêm loại dòng "mang sang" nào vào hoá đơn ⇒ sửa cả hai hàm.
  ② **Quan hệ (HS × lớp) có LỊCH SỬ — đừng ghi đè.** `hoc_sinh_lop` unique (hoc_sinh_id, lop_id) + upsert `nhansu.ts:588` đặt lại ngày vào/rời trên dòng cũ ⇒ buổi đã học rụng khỏi học phí, hỏng ÂM THẦM. `hoc_phi_theo_mon_ky` giờ tính buổi nếu trong khoảng ghi danh HOẶC có điểm danh thật (nhân chứng độc lập, §2 "map lại quan hệ đã mất"); dòng đã rời: buổi chưa điểm danh KHÔNG tính (§1.5). Gốc chưa sửa — thêm tính năng đụng ghi danh thì nhớ nó vẫn ghi đè.
  ③ **"Đã bù" = có mặt (điểm danh) ở buổi bù chưa huỷ, KHÔNG phải buổi bù đã `hoan_tat`.** Buổi bù huỷ / HS vắng ở buổi bù = không tính là bù; "đã xếp" = còn hiệu lực chưa học. Tab Bổ trợ bù "Đã xếp" tách 2 nhóm theo cùng luật.
  ④ **Sửa số tiền đã chốt (hoá đơn) = việc có người nhận:** luôn (a) dry-run đọc-thuần in từng PH trước→sau, (b) tìm "trả thừa" (thu > tổng mới) và ca bất thường (mới > cũ) — dry-run đầu từng ra 5,3M trả thừa vì thiếu nợ_đầu_kỳ, (c) giữ bảng sao lưu giá trị cũ trong CÙNG migration, (d) tính lại `trang_thai` theo luật `fn_hoa_don_cap_nhat_trang_thai` (trigger chỉ chạy khi `thanh_toan` đổi), (e) báo Thùy gửi lại phiếu/QR cho PH bị đổi. Dòng về 0đ: để 0 + UI ẩn, không xoá (luật xoá).
  ⑤ Áp migration khi có file treo của người khác: `node scripts/migrate.mjs --only <file>` — `npm run migrate` áp hết (đã thấy 13 file treo). Nhật ký chi tiết: DEVLOG 06/10.
- **⭐ Giao diện game app HS (03/10):** ① khung đo kích thước phải là **ref dạng hàm** (`useState` làm ref + effect theo phần tử) — `useRef` + effect `[]` thì khung bị gỡ rồi gắn lại (vào game nhúng rồi lùi) không được đo lại,
  ResizeObserver của khung cũ còn bắn 0 ⇒ màn trống (đã dính Chinh phục BK) · ② Tailwind v4 `-translate-x-1/2` dùng thuộc tính CSS `translate` riêng — thêm `transform: translateX(-50%)` là dịch 2 lần ·
  ③ ảnh `absolute` vẽ đè chữ tĩnh đứng trước nó ⇒ nhãn để lớp riêng sau cùng (`relative z-10`) · ④ style ảnh truyền đúng `width/height`, không phải `w/h` (ảnh hiện cỡ gốc phủ màn) ·
  ⑤ cờ Preview/Production đọc `VERCEL_ENV` lúc build (define), đừng đoán bằng hostname · ⑥ pane trình duyệt bị ẩn thì rAF/timer chậm ⇒ không kiểm hoạt cảnh chuyển màn bằng ảnh chụp được — kiểm bằng logic + để Thùy xem máy thật ·
  ⑦ Bash: `cat > file` thiếu heredoc là treo chờ stdin; script vá nhiều dòng thì Write file `.cjs` vào scratchpad rồi `node` (xử CRLF bằng split/join).
- **⭐ Giao diện app HS — bài học bổ sung cuối ngày 03/10:** ① **hiệu ứng "giật" thường là KHOẢNG TRỐNG chứ không phải hiệu ứng** — đo chuỗi chunk → RPC → giải mã ảnh trước khi chỉnh easing; nạp trước + 1 màn chờ chung + lớp chồng màn cũ/mới · ② effect có cờ chống chạy lại thì cleanup PHẢI mở cờ (StrictMode) ·
  ③ nén ảnh nhân vật/boss: **ĐO độ nét (Laplacian) trước khi chọn chất lượng WebP** — q82 mất 17% ⇒ "mờ"; q95 giữ 96% · ④ ảnh vẽ cố định chiều dài (tia laser) không co giãn được ⇒ dời diễn viên (boss lao tới), đừng kéo ảnh · ⑤ vị trí công trình trên nền: **xếp chồng lên nền rồi so với reference bằng mắt** (khớp tự động theo màu sai vì công trình sinh lại khác reference);
  tuyến đường trong DESIGN.md chỉ xấp xỉ ⇒ dò lại · ⑥ pane trình duyệt ẩn thì hoạt ảnh CSS/WAAPI đứng ⇒ xác nhận bằng TRẠNG THÁI (data-attr, toạ độ, số phần tử) và chụp sau khi ép `currentTime`; đừng kết luận "không chạy" · ⑦ `vite-plugin-pwa`: URL có query + `navigateFallback` ⇒ iframe trả app shell, phải `navigateFallbackDenylist` ·
  ⑧ script vá file CRLF: normalize rồi ghi lại đúng kiểu; **heredoc >~120 dòng bị cắt ⇒ dùng Write tool**; `String.replace` có `$&` ⇒ `split/join` · ⑨ gói CC0 chỉ có PSD: `ag-psd` + `@napi-rs/canvas` (chạy qua stdin từ cwd repo) · ⑩ nội dung hướng dẫn: số chưa chốt thì KHÔNG nêu, chức năng chưa có màn thì gắn "Sắp có" — đừng hứa trong tài liệu.

- **⭐ AI LÀM ĐÁP ÁN / ÁNH XẠ HÀNG LOẠT (chốt 03/10, kho Anh + Hạt Mầm KHTN):**
  - **Bên giải phải MÙ thật:** đáp án để ngoài thư mục bên giải đọc (thư mục anh em `<dir>_khoa/`), cổng là MÁY so — không phải agent tự so.
  - **Model tự khai "chắc" vẫn sai ~0,3%** (Sonnet: "the chair of ___ one leg" chọn whose thay which). Câu CÓ đáp án đối chứng ⇒ một bên giải + cổng so là đủ;
    câu KHÔNG có đáp án ⇒ phải 2 bên độc lập trùng nhau mới nhận. Chọn model bằng đo trên mẫu có đáp án (Haiku: câu chắc mà sai ⇒ loại), không theo cảm giác.
  - **Agent đặt CÙNG TÊN cho nhiều nhóm = ý muốn gom 1 dạng** ⇒ script nhập phải gộp theo (chuyên đề, tên) trước khi tạo thẻ, không thì học thuật thấy N thẻ cho 1 dạng.
  - **Chặn nhập đè theo TỪNG CÂU (khoá tự nhiên `ten_de_goc`), không theo cả lô** ⇒ lượt sau vẫn nhập được phần còn treo mà không nhân bản.
  - Ghi hàng nghìn dòng qua mạng: gom 1 lệnh `unnest(...)` — từng câu một ⇒ >5 phút cho ~1.000 dòng.
  - Bên giải mù bắt được LỖI DỮ LIỆU người đọc code không thấy (phương án dính câu sau, ngữ liệu cắt cụt, cau_so lệch) ⇒ luôn gom `de_loi` thành danh sách cho GV.

- **⭐ ĐỒ HOẠ APP HS / ĐƠN CHATGPT (chốt 02/10, luồng Giao diện — bản đồ phiêu lưu):**
  - **Đơn ChatGPT LUÔN theo giao thức kit** (`design/CHATGPT-UI-KIT.md`): ① 1 ảnh toàn cảnh chi tiết ② vẽ lại TỪNG thành phần của chính ảnh đó ③ file mô tả vị trí. Đơn 7 tự ghi "không DESIGN.md, không zip"
    ⇒ mảnh vẽ độc lập không khớp nhau, phải làm lại. ChatGPT hết lượt / không giao file vị trí ⇒ Claude tự đo (lưới % trên ảnh), nhưng phải ghép thử ra ảnh để soi trước khi đưa vào app.
  - **Chọn giữa "giống ảnh mẫu" và "nhu cầu sản phẩm" thì HỎI Thùy** — CTO từng chọn tấm đất liền 1 lớp cho giống ảnh gốc, bỏ qua bộ mảnh rời Thùy đã đặt vẽ (để bỏ bớt lục địa theo số chủ đề).
    Đúng: mảnh rời + toạ độ theo ảnh gốc. "Ghép rời" KHÔNG có nghĩa là xếp lưới.
  - **Ảnh ChatGPT vẽ lại KHÔNG trùng dáng ảnh gốc** ⇒ dò toạ độ tự động bằng so màu ra sai cỡ. Dùng tâm vùng đo trên ảnh gốc + nới bề rộng tới khi khớp, ghép thử 1–2 vòng.
  - **Đặt vật lên tranh: tranh và toạ độ phải cùng 1 khung.** Nền `object-cover` (cắt mép theo ô) + mốc đặt theo khung 16:9 ⇒ lệch dù đo đúng. Vẽ tranh TRONG khung 16:9, phần thừa = chính tranh phóng to mờ.
  - **Toạ độ đo bằng mắt trên tranh trơn không đủ chính xác để đặt công trình vào bãi đất** ⇒ đặt vẽ SẴN đường + bệ trong tranh (Đơn 10), code chỉ gắn đồ lên bệ.
  - **Nén ảnh về cỡ hiển thị trước khi dùng:** ảnh gốc 1536×1024 giải nén ≈6MB/ảnh (10 ảnh ≈60MB ⇒ Safari iPad cũ giật/tự tải lại); WebP cạnh dài 640 ≈1MB giải nén. Công cụ: `@napi-rs/canvas` có sẵn trong node_modules.
  - **Hoạt ảnh chạy theo requestAnimationFrame dừng hẳn khi tab/khung ẩn** ⇒ thứ gì CHẶN nút (vd chiêu ở màn đấu) phải có chốt thời gian (`Promise.race` 4 giây).
  - **Tailwind v4: `-translate-x-1/2` dùng thuộc tính `translate` riêng** ⇒ thêm `style.transform` chỉ để scale; viết lại translateX(-50%) là lệch đôi.
  - **Cảnh bản đồ phải do HOẠ SĨ vẽ liền 1 tranh rồi tách thành phần** (ảnh to → thành phần → bố cục). Nền trơn + đường code + công trình dán rời = 3 nguồn khác góc nhìn/ánh sáng
    ⇒ "không thật" dù toạ độ đúng (Thùy chê tầng lục địa 02/10). Code chỉ vẽ thứ ĐỘNG (nhãn, sao, mũi tên, cờ, sương, đoạn đã đi).
  - Dò vị trí trên tranh: vùng màu phẳng liên thông (ô 8px, chênh màu + nhiễu thấp) chính xác hơn đo mắt — nhưng cỏ/lá nhiều vân phải nới ngưỡng + loại tay vệt bóng; luôn soi ảnh đánh dấu.
  - Đường vẽ bằng code trên tranh nhìn chéo phải dựng trên MẶT ĐẤT rồi chiếu (y × độ nghiêng, xa nhỏ gần to, thành phía gần) — dải đều bề ngang trông như nhìn thẳng từ trên trời.
  - Windows không phân biệt hoa thường tên file: `DuongThree.tsx` đụng `duongThree.ts` (tsc TS1261, Vite lỗi export) ⇒ đặt tên khác hẳn.
  - Nhãn trên tranh: chữ KHÔNG khung + viền dày màu nền (`San2D.CHU_VIEN`) đọc rõ mọi nền; sao tiến độ chưa đạt phải RỖNG (tô nhạt nhìn như đầy).
  - **Kit ghi tuyến đường "xấp xỉ" ⇒ luôn DÒ LẠI từ nền:** mặt nạ màu đường + A* (rẻ trên lòng đường, đắt khi băng rừng/nước) giữa các mốc. Mỗi nền một mặt nạ riêng (sa mạc: đường lát đá nhạt s .26–.39 khác cát s ≥ .43; đầm lầy đổi màu khi Thùy đổi nền ⇒ mặt nạ cũ chỉ bắt 0,5% — kiểm % mặt nạ + soi ảnh).
    **Thứ tự công trình phải theo ĐƯỜNG THẬT** (đầm lầy kit ghi đền 5/hang 6, đường đi qua hang trước ⇒ đổi chỗ), nếu không nhân vật băng nước/quay lại.
  - **Làm mờ/lọc màu nền ⇒ công trình nét trông "dán" (giả)** — Thùy chê 2 lần; để nền NGUYÊN BẢN, chỉ thêm ánh sáng cạnh công trình. Muốn nền dịu ⇒ nhờ hoạ sĩ vẽ nền mới (v4).
  - **Chữ/sao đè tranh: LUẬT KHÔNG ĐÈ NHAU** — đừng đặt nhãn cố định dưới chân; đo nhãn thật (hộp nhãn rộng tới maxWidth dù chữ ngắn ⇒ đo bằng `Range`) rồi quét lưới tránh công trình/nhãn khác. Sao trùng màu nền ⇒ vàng rực + viền tối dày + viên thuốc tối phía sau.
  - **Sprite chạy: neo ĐẤT đo từng khung (đáy hộp alpha), cỡ thân CÙNG một tỉ lệ cho cả chu kỳ** (neo riêng từng khung dùng để đặt chân, không đổi cỡ) + delta thời gian. Tài liệu kit hay lỗi thời (Thùy đổi tên file/khung giữa chừng) ⇒ bám file thật. Tốc độ chạy tính theo CHIỀU CAO NGƯỜI, không theo bề ngang màn (490px/s ≈ 6 người/s = "như gió").
  - **Z-order nhân vật cộng ~3,5% độ sâu** để luôn đứng TRƯỚC cửa công trình đang tới (không thì tháp che mất người); sương phải z ngay trên công trình của nó, dưới nhân vật.
  - **Soi hiệu ứng canvas/rAF trong pane Browser:** pane ẩn ⇒ `requestAnimationFrame` đứng (canvas im, tư thế kẹt) ⇒ thay rAF bằng `setTimeout` khi test, và đóng băng đúng khung bằng `window.__dtDung=<ms>` (dev, trong `hieuUng.ts`); canvas chỉ hiện trong ảnh chụp sau khi `getImageData` đọc lại. Script `| head` ⇒ EPIPE cắt ngang (kit nén dở, file sinh chưa ghi) — ghi log ra file.
  - **Nhân vật chính ≠ NPC dẫn truyện** (Thùy 02/10): chính = nhà thám hiểm (`heroChay.ts`), NPC = bé trai+mèo / bé gái+cú (`Skin.nhanVat`). Đừng dùng NPC làm nhân vật của em.

### Bài học 28/09–02/10 — luồng kho + đề thi (nhập, gán vào buổi, đọc PDF)

- **⭐ Làm theo LÁT dùng được ngay, không dựng cả dây chuyền rồi mới chạy.** Thùy chê thẳng khi bản đồ + gán mẫu + skill gán dạng chồng lên nhau mà thứ
  cần gấp (1 đề PDF → 1 đề trên ERP) chưa có. Mỗi lát phải có "xong khi" là một việc người dùng làm được.
- **⭐ Tính năng mới phải KHỚP KHUÔN CŨ trước, dạy thêm sau.** Gán đề vào buổi: chép phần của đề thành phần `dang` / `btvn` (mã dạng trống) đúng khuôn
  giáo trình trích xuất ⇒ in, chấm BTVN, mở app, đánh số buổi chạy ngay; chỉ phải dạy thêm 3 chỗ. Phương án "giữ phần `custom`" đòi dạy lại ~10 chỗ
  đọc, mỗi chỗ quên là một lỗi im lặng. Trước khi viết: đọc hết các nơi đang lọc theo `loai_phan`.
- **⭐ Dạng chờ (`…000000`) không được lọt vào `bai_test_cau.ma_dang`.** `fn_mastery_cells` chỉ loại `ma_dang is null` ⇒ ghi mã chờ là đẻ một "dạng yếu"
  giả trên bản đồ và kéo cả bổ trợ. Để trống lúc chụp, trigger điền khi câu có dạng thật.
- **App HS có HAI lớp lọc câu của giáo trình online:** RLS `_btc_trang_thai` (mở theo câu hoặc theo dạng) và một lớp lọc nữa ở client
  `getBaiTestFull` (trước 01/10 chỉ nhận mở theo dạng). Đổi luật mở câu phải sửa cả hai, không thì DB cho mà app vẫn giấu.
- **⭐ Deploy tay ⇒ bản app đang chạy là bản CŨ; thay đổi phía DB phải đúng với CẢ client cũ.** 01/10: sửa lớp lọc client trong repo (nhận câu mở lẻ) rồi coi
  như xong, trong khi học sinh dùng bản Vercel chưa deploy ⇒ lớp chỉ thấy câu 1. "Đọc DB thấy 22/22 câu đã mở" KHÔNG phải bằng chứng học sinh thấy 22 câu —
  dấu hiệu có sẵn mà CTO bỏ qua: 3 em vào làm, cả 3 chỉ có đúng 1 câu trả lời. Kiểm đường của người dùng thật (bản đang chạy), không chỉ đường của code mới.
- **⭐ Tính năng mới phải gắn vào CHỖ THAO TÁC ĐANG DIỄN RA, không phải chỗ CTO vừa dựng.** 02/10: làm 2 chế độ phát hành nhưng đặt chỗ chọn ở Kho đề thi + tab Live,
  còn nút 📱 ở Kho tài liệu — nơi mọi người vẫn bấm phát hành — lại để mặc định im lặng. Thùy: "chọn chế độ phát hành là phải chọn từ kho tài liệu chứ."
  Trước khi đặt một nút: hỏi "hôm nay người ta làm việc này ở màn nào?".
- **Hạ tầng "mở dần" có sẵn 2 tầng (theo dạng 13/09 · theo câu 19/09 của luồng Học online, DB đã áp, màn ở nhánh chưa merge).** Trước khi thêm cơ chế, dò `pg_proc` +
  `git branch -a` + sổ `_migrations` xem luồng khác đã dựng gì — 02/10 nhờ vậy chỉ thêm 2 hàm thay vì một bảng mới.
- **Hàm `security definer` do `claude_build` sở hữu không gọi được `auth.uid()`** ("permission denied for schema auth") — dùng `public.jwt_uid()`.
  Bản chạy thử có giả phiên mới bắt được; `create function` thì trót lọt.
- **⭐ Chạy thử migration trước khi áp:** `thu-migration.mjs --kiem` (transaction + SAVEPOINT từng câu + ROLLBACK) cho phép duyệt đề, gán, mở thi,
  đổi dạng… trên dữ liệu thật mà không để lại gì. Ca "phải bị chặn" cũng viết vào file kiểm (kỳ vọng lỗi).
- **Không đăng nhập được thì dựng trang xem-thử dữ liệu giả** (`xem-thu-*.html` + `src/_xem_*.tsx`, gán đè `supabase.from/rpc`) để bấm thử giao diện —
  bắt được lỗi bố cục + luồng báo lỗi mà không ghi DB. Không thay được bước bấm thật bằng phiên đăng nhập thật.
- **⭐ Máy đọc (Gemini): "dặn kỹ hơn trong prompt" KHÔNG thay được "tách việc + đo".** Đo trên 1 đề có bản chuẩn:
  - đọc cả file PDF thì chữ đúng (22/22) nhưng **bịa vị trí hình** và khung lệch ⇒ hình chỉ lấy từ lượt đọc ẢNH từng trang;
  - hỏi "hình này của câu nào" là sai ⇒ chỉ hỏi TOẠ ĐỘ (khung hình, nhãn "Câu N"), còn thuộc câu nào để máy TÍNH. Thứ gì tính được thì đừng hỏi model;
  - gộp nhiều việc vào một lượt soi trang làm việc khó nhất (chữ gạch chân) trả về rỗng; tách riêng một việc + ảnh 250 dpi thì đúng, 150 dpi thì sai;
  - kể cả vậy lượt gạch chân vẫn sót (7/12) ⇒ là nhân chứng thêm, **mắt Claude trên ảnh trang vẫn bắt buộc**; script phải in ra câu nào máy CHƯA soi được.
- **⭐ Đáp án có hai nguồn trong tài liệu luyện thi: chữ cái GẠCH CHÂN và dòng "Chọn X" của lời giải — gạch chân đúng, "Chọn X" hay sai** (đo 28/09 + 01/10).
  Hai nguồn lệch ⇒ không tự chọn im lặng: ghi cảnh báo vào câu cho người duyệt, soi được thì ghi lý do.
- **So trùng câu bằng chuỗi sẽ trượt khi hai nguồn viết LaTeX khác nhau** (`(S)` ↔ `\left( S \right)`, `\vec` ↔ `\overrightarrow`): bản PDF của đề đã nhập
  từ Word chỉ được nhận trùng 1/22. Chưa chuẩn hoá ⇒ một đề chỉ nhập từ MỘT nguồn.
- **Vá file trên máy công ty:** file nguồn cũ là CRLF, file mới tạo bằng Write là LF, và `grep -c $'\r'` của Git Bash trả 0 cho cả hai ⇒ đừng tin nó.
  Chuỗi nhiều dòng hoặc có dấu `\` (regex, LaTeX) ⇒ Edit tool; khối dài ⇒ Write ra file rồi cho script đọc file đó mà ghép. `node - <<EOF` nuốt dấu `\`.
  Script vá phải `throw` khi không thấy chuỗi cần thay (01/10: nhờ vậy vá trượt mà không hỏng file).
- **Báo số cho CEO phải lấy từ query, không nhẩm:** CTO nói "19 câu lên app" (trừ nhầm câu Đúng/Sai), thực tế 22/22.
- **Nhiều phiên Claude cùng một checkout:** `git add <file cụ thể> && git commit` trong MỘT lệnh, không `git add -A`; `git pull --no-rebase`; DEVLOG conflict
  thì giữ cả hai bên; không đụng file phiên khác đang sửa (`SuKienScreen.tsx`, `TvSuKien.tsx`, `scripts/_q_*`, `_xem_*` không phải của mình).

- **⭐ Cảnh three.js phải dựng lại khung camera mỗi khi ô chứa đổi cỡ (01/10).** Ô chưa có kích thước lúc tạo (flex/grid chưa layout) ⇒ aspect = 0 ⇒ khoảng cách camera vô hạn ⇒ cảnh TRẮNG hoàn toàn, không báo lỗi. Cảnh thế giới may chưa dính, cảnh lục địa dính.
  Sửa: `sanKhau.vuaKhung` lưu hàm dựng lại và gọi trong `doiCo`; cảnh có chuyển động camera đọc `sk.khung` MỖI KHUNG, không giữ bản chụp lúc tạo. Cách bắt: expose tạm `window.__sk`, đọc `camera.position` (10538 ⇒ lộ ngay) rồi gỡ.
- **⭐ Voronoi/cắt nửa mặt phẳng: kiểm dấu bằng MÀU, không bằng mắt (01/10).** `a·x+b·y ≤ c` giữ nửa XA hạt hay nửa GẦN tùy dấu; sai dấu thì mỗi vùng chiếm phần của vùng khác nhưng nhãn vẫn nằm đúng hạt ⇒ chỉ lộ khi màu vùng ngược với danh sách bên cạnh. Đã dính 2 lần (mockup + 3D). Sau khi đổi trọng số nhớ lấy nhãn ở trọng tâm vùng thật, không ở hạt.
- **⭐ Sương mù cố định nuốt cảnh khi camera ra xa (màn dọc) (01/10).** `Fog(near, far)` tuyệt đối + `vuaKhung` kéo camera ra theo bề ngang ⇒ màn dọc ra xa quá `far` ⇒ cả cảnh chỉ còn màu sương. Sương phải co giãn theo khoảng cách camera (`datNen(..., theoXa)`).
- **`mergeGeometries` (three) fail im lặng khi trộn primitive có index và không index (01/10).** `PolyhedronGeometry` (Octahedron/Icosahedron) KHÔNG index, Sphere/Cylinder/Box có index ⇒ trả null. Chuyển hết về `toNonIndexed()` trước khi gộp.
- **Code mới đã nằm trên `main` mà deploy là thủ công ⇒ cờ TẮT mặc định (01/10).** Push `main` KHÔNG có nghĩa học sinh chưa thấy: lần deploy kế tiếp (vì lý do khác) cuốn theo mọi thứ. Tính năng chưa duyệt phải đi sau cờ theo máy (`?cờ=1` → localStorage), mặc định tắt, bật cho mọi người là 1 dòng + 1 lần deploy có chủ đích.
- **Thử app trên iPad cùng Wi-Fi: `http://` (không https), đúng thư mục, bản build cho độ mượt (01/10).** Safari "không thể thiết lập kết nối bảo mật" = nó đang đi https tới server http (mạng vẫn thông). `npm run` sai thư mục v1/v2 ⇒ "Missing script". Server dev (Vite) nạp three chưa nén nên chậm hàng chục giây trên iPad ⇒ muốn đo FPS dùng `vite preview` bản build. Windows: kiểm quy tắc tường lửa Node.js (Public) trước khi đổ lỗi cho mạng; KHÔNG tự sửa tường lửa. Pane trình duyệt ẩn ⇒ `requestAnimationFrame` dừng, chỉ vẽ khi chụp màn hình ⇒ không đo được FPS bằng pane.
- **Quái/boss là phần Thùy tự thiết kế; ChatGPT chỉ làm icon (01/10).** Đừng soạn đơn ChatGPT cho bản đồ/địa hình, đừng trau chuốt quái dựng bằng code — chỉ giữ giao diện `Quai` + điểm cắm `nguonQuai.ts`.
- **⭐ Màn nhiều dòng nhỏ phải soi CẢ khổ PC, không chỉ 375px (29/09).** Nút bản nhỏ mang `w-full` trong hàng flex giành hết bề ngang ⇒ cột chữ còn
  vài px, rụng từng chữ (Thế giới BK lọt lên prod). Nút phụ trong hàng = `flex-none`; `w-full` chỉ cho nút thanh hành động. Tương tự: `grid-cols-2`
  mặc định `minmax(auto,1fr)` ⇒ dòng `truncate` đẩy thẻ tràn/đè thẻ bên ⇒ dùng `grid-cols-[minmax(0,1fr)_minmax(0,1fr)]`.
- **Sửa hàm DB đang chạy: lấy `pg_get_functiondef` từ DB, KHÔNG từ file migration (29/09).** Hàm có thể đã bị migration sau đè. Thay đúng khúc bằng
  mốc chữ, ghi migration mới. Tách công thức ra hàm chung ⇒ so kết quả cũ vs mới trên DỮ LIỆU THẬT với ĐÚNG điều kiện gốc (lần so đầu t lệch vì chính
  câu so thiếu join lớp — không phải hàm sai). Hàm đang chưa có dữ liệu (nhiệm vụ mở 01/10) ⇒ so khúc con, đừng tin "0 = 0".
- **Script vá file: `replace(/\r\n/g,'\n')` TRƯỚC khi tìm mốc nhiều dòng (29/09).** Repo có file CRLF; mốc `'\n}\n'` không khớp ⇒ `indexOf` = -1 ⇒ dán
  lặp cả file. Lệnh `node -e "…"` trong bash: backtick trong chuỗi = chạy lệnh (mất chữ im lặng) ⇒ script dài viết ra file .cjs.
- **Chữ trên màn không hứa tính năng chưa có (29/09).** Màn Lên sóng từng ghi "em nhận thông báo ngay" trong khi push HS chưa làm — soát câu chữ theo
  những gì ĐANG chạy.
- **Prod "vẫn lỗi" ⇒ soi bundle đang chạy trước (29/09).** `curl hs.bkacademy.edu.vn` → lấy `/assets/hs-*.js` → grep chuỗi của bản sửa: 2 lần Thùy báo lỗi
  là do deploy bản trước bản sửa. Main checkout cũng hay chậm commit so với worktree ⇒ `git -C <main> merge --ff-only origin/main` sau mỗi push.

- **⭐⭐ Đơn ChatGPT = ẢNH CHUNG trước + TỪNG HÌNH riêng, và kiểm hàng bằng MẮT (29/09).** Đơn chỉ có mô tả + "nhận zip" là thiếu (Thùy trả).
  Khuôn đúng: A ảnh toàn cảnh/bảng duyệt → DỪNG chờ duyệt → B, C… mỗi lượt 1 hình có "#số tên_file", hình cùng họ vẽ dựa trên hình đã duyệt,
  bản nhỏ Claude tự thu nhỏ. Kiểm hàng: số đo (cỡ, % trong suốt) KHÔNG đủ — Town 29/09: 19 hình đều nền trong chuẩn nhưng từ #19 ChatGPT vẽ
  lệch danh sách (rương/bản đồ/cúp lặp). Luôn ghép tờ liên hoàn (nền hồng cánh sen lộ chỗ trong suốt) + xem từng hình đối chiếu đơn.
- **⭐ Màu game trong màn HS phải nằm ở sổ riêng, không gõ trong màn (29/09).** `check:style-hs` đếm hex + `bg/text-white` trong `*.tsx` theo mốc
  chỉ-giảm (file mới mốc 0). Màu có nghĩa (màu huy hiệu, chương rank, vàng sao) ⇒ khai 1 lần ở `gami/hinh.ts` (`MAU_GAMI`), màn chỉ tham chiếu.
- **Worktree + xem app (29/09):** `preview_start` đọc `.claude/launch.json` của repo CHÍNH ⇒ `dev-hs` chạy code main, KHÔNG phải worktree (kiểm:
  `fetch('/src/…')` có chuỗi mới không); phiên worktree không sửa được file đó ⇒ chạy vite nền từ worktree cổng riêng, xong nhớ tắt tiến trình
  (TaskStop không giết con vite ⇒ tìm PID theo cổng). Worktree cần copy `.env.local` (VITE_SUPABASE_URL), không chỉ `.env`.
- **Giả lập HS khi test RPC trong transaction:** `my_hoc_sinh_id()` đọc `jwt_uid()` = claim `sub` → `tai_khoan.id` (không phải email, không phải
  `hoc_sinh.id`). `set_config('request.jwt.claims', {"sub": <tai_khoan.id>}, true)`.

- **⭐⭐ Bổ trợ: "xếp mãi vẫn Cần xếp" có 2 gốc — đừng vá triệu chứng (24/09).** (1) Form xếp mở buổi 'mo' ĐÃ ĐÓNG CA ở chế độ SỬA ⇒ "xếp" chỉ dời
  ngày buổi cũ (dữ liệu học bị đẩy sang tương lai) — giờ chặn cứng bằng trigger `trg_buoi_bo_tro_khoa_ngay`. (2) Đóng ca chỉ ghi "đã dạy" cho dạng em
  luyện APP ⇒ em học giấy đóng xong 0 dạng tiến ⇒ case trông như chưa học ⇒ OPS đi sửa buổi cũ (10/14 buổi dính) — giờ TA tick dạng lúc hoàn tất.
  **Áp dụng:** "trạng thái không chuyển" ⇒ tra DB từng buổi (danh_gia_xong_at, day_buoi_id, updated_at) trước khi sửa UI; trả ngày thật chỉ khi ≥2
  nhân chứng độc lập trùng nhau (đóng ca · làm bài · nhận xét · sinh bài).
- **⭐ Retest chỉ chấm dạng CÓ câu trong bài retest** (`fn_btyeu_retest_ghi`) ⇒ mọi đường làm dạng sang "chờ retest" PHẢI đảm bảo có câu retest cho
  dạng đó, không thì kẹt vĩnh viễn (bài cũ chỉ lấy ≤3 dạng). Dạng 0 MCQ vẫn kẹt tới khi có câu — `fn_btyeu_bu_retest_ton` tự thông khi mở màn Xếp.
- **⭐ Sửa hàm SQL mà phiên khác cũng sửa ⇒ dựng từ bản ĐANG CHẠY (`pg_get_functiondef`), không từ file migration cũ** — `fn_ca_bo_tro_ung_vien`
  bị phiên khác thêm nhãn "cùng lớp" sau file gốc; dựng từ file cũ là đè mất. Hàm mình viết cũng có thể bị phiên khác sửa lỗi (vd `fn_btyeu_hoan_tat`
  thiếu cột `buoi_danh_gia.muc` ⇒ CHECK nổ khi TA chọn mức) — pull main trước khi đụng lại.
- **⭐ Vercel: auto-deploy TẮT, deploy TAY ⇒ `ignoreCommand` lọc theo diff là vô nghĩa và nguy hiểm** (không có PREVIOUS_SHA, hoặc PREVIOUS_SHA =
  deployment vừa bị cancel ⇒ "đang build thì biến mất"). Đã gỡ khỏi vercel.json (24/09). "Push rồi mà prod không đổi" ⇒ kiểm bundle prod có chuỗi mới
  không trước khi nghi code.
- **Luật CEO đổi thì sửa CẢ spec + CLAUDE.md** (MCQ tuyệt đối 20/09 → ngoại lệ mức 4–5 ngày 28/09): 1 dòng "tuyệt đối" còn sót trong CLAUDE.md sẽ
  khiến phiên sau "sửa lại cho đúng luật" và phá quyết định mới.

- **⭐⭐ Kit ChatGPT PHẢI đủ 3 phần — không bao giờ đặt "đơn chỉ sinh asset" (28/09, skin RPG).** Đơn chỉ-asset (bỏ vẽ mockup) ⇒ ChatGPT vẫn vẽ
  ảnh toàn cảnh (nhân vật + 8 icon khác) nhưng không đóng vào zip, và chỉ sinh 7 mảnh rời theo danh sách ⇒ Claude dựng ra màn khác hẳn ảnh Thùy
  đã xem, còn tự ghi "đạt v1". **Áp dụng:** mọi kit = `reference/` ảnh toàn cảnh mọi khổ màn + bảng kiểm kê có cột **Vị trí & cỡ** + đủ asset thấy
  trong ảnh (kit §2/§4/§8 câu 9–11, `design-check` tự rớt). "Đạt" = khớp ẢNH TOÀN CẢNH, không phải khớp danh sách file mình tự liệt kê.
  Thùy thả file vào `public/` là bị đóng vào bản build ⇒ luôn chuyển sang `design/handoff/`. Kiểm kit cũng phải nhìn "được sinh bằng
  công cụ tạo ảnh hay ghép khối bằng code" (Lo-fi v1 là khối hình phẳng — script đo cạnh sắc vẫn ĐẠT).

- **⭐⭐ Snapshot text-ref phải sync khi RPC đổi mã cha (bug 18/09 Test đầu vào không load chuyên đề mới).** `ca_test_cau` lưu SNAPSHOT `ten_chuyen_de` + `muc_do` tại thời điểm tạo ca test (phiếu `fn_test_dau_vao_phieu` đọc thẳng, KHÔNG JOIN dai_ban_do runtime — có ý đồ giữ lịch sử "HS làm câu này khi câu thuộc chuyên đề X"). RPC `fn_dai_chuyen_dang` lượt đầu chỉ update `ma_dang`, quên sync 2 cột snapshot → sau khi CEO chuyển 1 đống dạng, phiếu hiện chuyên đề CŨ. Fix mig `202609181342`: sync retroactive + tách `ca_test_cau` ra update riêng trong RPC (không lẫn với 7 bảng text-ref khác chỉ có `ma_dang`). **Áp dụng:** viết RPC đổi mã nào (`fn_*_chuyen_*`, `fn_*_gop_*`) → grep `schema.md` cột `ten_chuyen_de|ten_chu_de|muc_do|ten_dang` để tìm mọi snapshot cần sync, KHÔNG chỉ update PK/FK. Snapshot là "ý đồ giữ lịch sử" ở CHỖ ĐÚNG (đo lường) nhưng "ý đồ giữ lịch sử" ở CHỖ SAI (đổi tên/rename) là bug.

- **⭐⭐ Bug sinh mã "nối chuỗi" — `parseInt(soThuTuCua(c, from))` nuốt CẢ phần còn lại (18/09 fix `maxOrd → maxOrdCon`).** Bản cũ `parseInt(c.slice(from))` với `c = 'T10701012203'` (rác) và `from=6` → `parseInt('01012203') = 1012203`, `pad2` giữ nguyên (không cắt về 2 digit) → mã mới = `parent + 1012204` = len 15 vô nghĩa. Bug ÂM THẦM khi tồn tại mã anh em lệch chuẩn — mã hợp lệ khác vẫn có nhưng bị max che khuất. **Áp dụng:** khi tính max STT anh em, filter STRICT trước (cùng parent + đúng length + đúng 2 digit cuối), KHÔNG parseInt phần dài không cắt được. Cách chống bug tổng quát: "1 lần sinh mã sai → mọi lần sinh sau đều lây" — luôn có bước validate format anh em trước khi cấp mã mới.

- **⭐ Rule mã bản đồ có ngoại lệ historic (K4T/K5T tồn tại thật trong `lop.khoi`, KHÔNG phải typo).** Regex khối phải là `(\d{2}|\dT)` chứ không phải `\d{2}` — nếu strict `\d{2}` sẽ báo 88 dòng K4+K5 legacy (1215 câu, 3170 rows tự luyện, 2 lớp đang dạy) là RÁC → không thể xoá. **Áp dụng:** luôn đo shape data thật trước khi viết CHECK constraint (`scripts/_check_shape_4kho.mjs`, `_check_khoi_dac_biet.mjs`); rule "đúng" trong tài liệu chưa chắc đúng với data lịch sử.

- **⭐ UI chia cấp 1/2/3 mà cùng feature — refetch state phải mở cho MỌI cấp có feature đó (bug 18/09 vòng quay may mắn).**
  `HocSinhApp.tsx` fetch `maymanCoLuot` với guard `if (!cap2) return` — nhưng ô "May mắn" hiện trong CẢ `HomeCap1`
  (BOX_CAP1) LẪN `KHU_CAP2`. Kết quả: 14 HS cấp 1 đủ điều kiện quay ngày 17/09 nhưng badge tắt câm → không ai vào
  bấm quay → qua đêm `bt.ngay < v_today` (đúng intent CEO "làm ngày nào quay ngày đấy") → mất lượt. RPC không cấm
  cấp 1 — chỉ FE thiếu tín hiệu. **Áp dụng:** khi feature hiện ở nhiều cấp, list các cấp CÓ UI của nó rồi mở guard
  cho tất cả (ở đây: `if (!cap1 && !cap2) return`), không dựa vào cấp mặc định.
- **⭐⭐ QUY TRÌNH thiết kế RULE LỖI cho form trắc nghiệm (Thùy chốt 09/09, sau khi CTO code trước-hỏi-sau 1 lần) —
  áp cho MỌI dạng mới đưa vào MCQ (`scripts/mcq-auto.mjs`/`mcq-sinh.mjs`, spec-mcq-form.md), không riêng "tích bằng 0":**
  **(1) Đọc `loi_giai` (lời giải chi tiết) THẬT trong kho của vài câu mẫu dạng đó trước** — không suy luận rule lỗi từ
  cấu trúc AST trong đầu. Kho thường tự trình bày đúng khuôn TH1/TH2/các bước, đọc ra ngay chỗ HS hay trượt.
  **(2) Từ lời giải, liệt kê các ĐIỂM RẼ có thể sai** (mỗi bước-giải-đúng ứng với 1+ cách hiểu-sai-hợp-lý) — đối
  chiếu với rule đã có trong `dai_mcq_rule` xem trùng/thiếu/**đã có nhưng SAI NGỮ CẢNH** (case thật: R21 "chỉ lấy
  nghiệm dương" đúng cho dạng KHÔNG ràng buộc miền, nhưng với dạng CÓ "x≥0" tường minh thì "chỉ lấy dương" lại là
  quy trình ĐÚNG — rule cũ vô dụng ở ngữ cảnh mới, cần rule NGƯỢC LẠI "quên áp miền, giữ dư nghiệm"). Đừng gán 1 rule
  cũ vào ngữ cảnh mới chỉ vì tên nghe giống.
  **(3) Đề xuất bảng rule (tên/mô tả/ví dụ) cho CEO — CEO CHỐT rồi mới viết code.** Việc chọn "lỗi nào đáng mô hình
  hoá" là quyết định SẢN PHẨM (ảnh hưởng chất lượng chẩn đoán lỗi của HS thật), không phải chi tiết kỹ thuật tự
  quyết được (khác §0 R2 — đây không phải "câu kỹ thuật").
  **(4) CHỈ SAU KHI CHỐT mới sinh lô + verify + ghi.** Case cụ thể (09/09): pool tích-bằng-0 khối 7 (`077022022203`,
  spec-mcq-form.md), CTO tự code `solveProduct` (chứng minh 1 thừa số vô nghiệm rồi loại) VÀ ĐÃ GHI 12 form vào DB
  trước khi hỏi — chạy đúng, verify sạch, nhưng CEO chỉ ra ngay 4 lỗ hổng rule (R21 sai ngữ cảnh + 3 lỗi chưa mô
  hình: giải nhầm nhân tử vô nghiệm ra nghiệm ảo · quên khai căn khi x²=k · quên bình phương khi √x=k) mà lẽ ra
  phải bàn TRƯỚC. 12 form đã ghi (chưa duyệt) phải sinh lại sau khi rule mới xong — làm 2 lần vì bỏ qua bước (3).
  **⭐ NỚI bước (3) — 11/09, sau khi pool khối 6 tái dùng ~90% rule cũ trót lọt:** dạng MỚI mà lỗi khả dĩ ĐÃ RÕ
  RÀNG/TÁI DÙNG được (giống hệt 1 dạng đã CEO duyệt trước đó, khác chỉ ở miền số — vd R52 "nhầm phép tính" cho
  Số tự nhiên khối 6, sinh từ chính lỗ hổng đo được lúc chạy, không phải suy đoán) → **CTO tự quyết luôn, không hỏi**
  (đúng tinh thần §0 R2). **CHỈ mang ra hỏi CEO khi dạng đó bản thân THIẾU RÕ hoặc MƠ HỒ** (đáp số không phải 1 giá
  trị đơn — vd "Phân tích ra thừa số nguyên tố" đáp số là biểu thức luỹ thừa, "Nhận biết nguyên tố/hợp số" đáp số
  kiểu chọn-tất-cả-trong-danh-sách — những ca này CẦN bàn TRƯỚC vì bản chất "câu hỏi trắc nghiệm 4 đáp án cho nó"
  còn chưa rõ, không phải vì thiếu rule lỗi). Không đổi (1)(2)(4) — vẫn đọc lời giải trước, vẫn liệt kê điểm rẽ,
  vẫn chỉ ghi sau khi tính đúng+verify sạch — chỉ đổi AI QUYẾT rule cho dạng RÕ RÀNG.
- **⭐⭐ Quy trình cho ĐIỀN Ô/"trắc nghiệm từng phần" (Thùy chốt 12/09, khác quy trình rule-form-TN ở trên):** với
  MỖI dạng tự luận mới, CTO đề xuất CHỖ CHIA (ô nào đục, đục theo cách nào) TRƯỚC → làm mẫu 10 câu → CEO duyệt →
  MỚI chạy cả dạng → verify → ghi. Đã có 1 lần làm ngược (nhóm Toán thực tế, sinh+ghi 91 câu trước rồi mới hỏi) —
  không sai kỹ thuật (spec đã ghi rõ "100% máy" nên không cần hỏi cách làm) nhưng đi trước quy trình; từ dạng sau
  (GTLN/GTNN) làm đúng thứ tự thì CEO góp ý 2-3 vòng NHỎ trên MẪU (rẻ, sửa code rồi làm mẫu lại) thay vì phải xoá-ghi-
  lại cả trăm câu đã vào DB (đắt, dính Luật xoá). **Mẫu 10 câu phải TRẢI ĐỦ các khuôn con** (khảo sát trước để biết
  có mấy khuôn) — mẫu ngẫu nhiên 10 câu cùng 1 khuôn thì CEO không thấy được ca khó.
- **⭐ Mã rule PHẢI TÁCH KHÔNG GIAN theo pipeline khi 2+ luồng chạy song song — đừng đua `select max(ma)+1`.**
  12/09: luồng Điền Ô (`mcq-dien.mjs`) và luồng form-TN (`mcq-auto.mjs`, khối 8-9) CÙNG ghi vào 1 bảng
  `dai_mcq_rule`, cùng ngày, đụng mã rule THẬT **2 LẦN TRONG 1 GIỜ** (đặt `R89-R93` lúc max là `R88` thì 25 phút
  sau luồng kia đã chiếm tới `R99`; đặt tiếp `R125-R130` thì cũng bị chiếm gần hết trong giờ tiếp theo) — vì cả 2
  luồng đều query `max(ma)` NGAY LÚC ĐỊNH ĐẶT, không có khoá/đồng bộ giữa 2 phiên. **Chỉ 1 cách chắc chắn: mỗi
  pipeline độc lập dùng 1 TIỀN TỐ CHỮ CÁI riêng** (đã đổi Điền Ô sang `D%`, form-TN giữ `R%`) — không phải khoảng
  số riêng (khoảng số vẫn đụng nếu 2 luồng cùng nhảy tới đó), không phải "hỏi nhau trước khi đặt" (chậm, dễ quên).
  Tác dụng phụ: mã 3 chữ số (`R100+`) làm `select max(ma)` (so CHUỖI) trả sai — `order by length(ma) desc, ma desc`.
- **⭐ Khoanh VỊ TRÍ đục ô trong lời giải phải lấy ĐÚNG TOKEN, không phải cả câu chứa token đó.** Bug thật (khuôn
  `an+b⋮cn+d`, 12/09): quy tắc "tìm dòng chứa số r rồi đục" match theo REGEX TRÊN CẢ ĐOẠN (`"3 \vdots (x-1)"`) rồi
  gán biến `seg` = TOÀN BỘ đoạn khớp thay vì tách riêng con số bên trong — HS sẽ thấy cả câu bị đục thay vì đúng 1
  chữ số. Verify KHÔNG bắt được lỗi này (vì "ghép lại ra đúng nguyên văn" vẫn đúng — ghép cả câu vào chỗ trống thì
  vẫn ra đúng câu gốc!) — chỉ lộ ra khi ĐỌC BẢN IN. Bài học: verify kiểm được "khớp lại đúng nguyên văn" nhưng
  KHÔNG kiểm được "đục đúng CHỖ nên đục" — việc đó phải tự đọc lại bản `--xem` trước khi tin.
- **⭐ Quy trình chạy pool MCQ mới (đúc kết 11-12/09, lặp lại ~10 lần): list → auto (debug 1 câu mẫu) → nếu tỉ lệ
  "chỉ tìm được N<3 distractor" cao (>20-30%) → debug câu bỏ cụ thể xem THIẾU RULE GÌ (không phải bug) → thêm 1-2
  rule "dự phòng" (luôn tính được, không phụ thuộc đặc điểm số cụ thể — vd R61/R71/R72/R84) qua MIGRATION MỚI
  (không sửa migration rule cũ đã áp) → chạy lại → verify → ghi. Coverage 85-100% là bình thường, phần dư bỏ vì
  đặc thù số (vd chỉ 1 thừa số chung, dữ liệu quá nhỏ) — KHÔNG cần cố vét 100%.
- **⭐ Bẫy regex lặp lại 3 lần (T106040104, T106030101, T106040101) — kho bọc `$…$` quanh TỪNG PHẦN so sánh/biểu
  thức, KHÔNG bọc quanh cả câu:** `"...biết rằng $36 \vdots n$ và $n<15$."` — dấu `$` xen giữa các cụm điều kiện.
  Regex nối 2 cụm bằng `\s*và\s*` mà không cho phép `\$?` ở ranh giới sẽ FAIL SILENT (trả `null`, không lỗi) —
  luôn test regex bằng `.match()` trên CHUỖI THẬT lấy từ DB trước khi tin, đừng suy từ cách kho hiển thị.
- **⭐ 2 rule tưởng khác nhau có thể LUÔN RA CÙNG GIÁ TRỊ về mặt toán học** (T106010103 R81 "cộng thêm K" vs R82
  gốc "công thức 1..K" — `K(K−1)/2+K ≡ K(K+1)/2` luôn đúng, không phải trùng ngẫu nhiên) — trước khi đăng ký 1
  rule mới, thử vài giá trị xem có suy ra CÙNG CÔNG THỨC ĐẠI SỐ với rule đã có không, đừng chỉ nhìn "tên nghe
  khác nhau" rồi coi là đủ đa dạng.
- **⭐ Trước khi thiết kế rule cho dạng "mới" — kiểm `lua_chon`/`menh_de` có NULL không trước.** 2 lần hụt (khối
  6, 12/09): T106010102/T106020101/phần lớn T106010103 tưởng là câu tự luận cần convert, khảo sát ra mới biết
  ĐÃ LÀ trắc nghiệm gốc trong kho — pipeline form-tn tự động loại (`q.lua_chon is null`) nên không sao, nhưng
  tốn công khảo sát/thiết kế nhầm nếu không kiểm trước.
- **⭐⭐ Đưa script kiểm cho bên bị kiểm = Goodhart (hs-home v3, 08/09):** ChatGPT cầm `design-check.mjs` trong tay → sinh asset để
  QUA script (ảnh rỗng 100% trong suốt tự chấm PASS), không để ĐÚNG. Script là của bên nhận; bên giao chỉ nhận câu hỏi tự kiểm.
  Kèm theo: **script chỉ là lưới thô — vẫn phải MỞ ẢNH nhìn** (v3 qua 100% mà mắt thấy hỏng ngay).
- **⭐⭐ ChatGPT sinh ảnh PHẲNG, không layer:** mọi "asset" nó xuất từ ảnh tổng = crop + phóng to + xoá màu trắng (áo/giấy/cốc thủng
  lỗ, icon xám rỗng). Chỉ chấp nhận asset **sinh mới bằng công cụ tạo ảnh**, từng cái, nền trong suốt; spec/JSX/layout.json của nó
  bỏ hết — nó không nhìn thấy asset của chính nó nên spec tự lệch ảnh. Chữ (kể cả viết tay) LUÔN là code + font.
- **⭐ `migrate.mjs --baseline <file>` đánh dấu MỌI file tới-và-gồm file đó, không chỉ 1 file (cắn 08/09):** áp 1 file bằng
  `_apply_one` rồi baseline ⇒ file khác đang FAIL cũng bị ghi "đã áp". Lần đó vô tình đúng ý (file luỹ tiến xu đã bị thay bằng
  EXP:100 áp tay) — lần sau kiểm `--status` TRƯỚC khi baseline, hoặc sửa nguyên nhân fail rồi `npm run migrate` bình thường.
- **⭐ Màn Home mobile: không cuộn NHƯNG không kéo giãn cho đầy màn** (CEO 08/09: "tỉ lệ phải như gốc mới đẹp, scale sai tỉ lệ xấu").
  `flex-1`/`grid-rows` chia đều → SE bẹp, Pro Max phình. Đúng: aspect-ratio đo từ mockup + chữ clamp(vw) + dư để trống dưới; kiểm
  `scrollHeight === innerHeight` ở 390×844 và 430×932 kể cả trạng thái có banner.
- **⭐ File chưa theo dõi trong `public/` VẪN vào build + precache PWA:** zip/kit thả vào `public/bk-ui` làm `build:hs` fail
  ("asset > 2 MiB won't be precached") dù Vercel (checkout sạch) không sao. File gốc → `design/`, đúng `design/README.md`.
- **⭐ Font chữ tay: thử font trước khi xuất doodle ảnh.** Đổi 5 font qua `?font=` trên demo trong 5 phút → CEO chọn Pacifico;
  doodle ảnh là mỗi câu 1 vòng ảnh, không sửa được chữ, dễ sai dấu — chỉ là ngoại lệ.
- **⭐ plpgsql: sau `EXECUTE` (bất kỳ dạng nào) ĐỪNG TIN `FOUND` (cắn 06/09 hai lần).** `EXECUTE 'update …'` không RETURNING
  ⇒ FOUND false dù đã sửa dòng. **`EXECUTE 'select …' INTO` cũng vậy: đo bằng DO block 06/09 chiều → `found=false` DÙ biến đã nạp
  đủ giá trị** (bản đầu của mục này ghi "EXECUTE INTO thì FOUND đúng" — sai, khiến `fn_giaibai_duyet` chưa từng chạy được tới mig
  `202609061543`). Luật: SQL động kiểm kết quả bằng `GET DIAGNOSTICS n = ROW_COUNT` (ghi) hoặc **kiểm biến INTO có null không** (đọc).
  3 fn `fn_giaibai_tra/luu_nhap/nop` ném "Không lưu được" dù DB đã ghi — phải vá bằng migration MỚI.
- **⭐ `CREATE OR REPLACE VIEW`: cột MỚI PHẢI đứng SAU CÙNG — mọi cột cũ giữ nguyên vị trí/tên/kiểu (cắn 06/09 hai lần).** Đặt cột
  mới trước cột cũ (kể cả ẩn qua `k.*`) ⇒ "cannot change name of view column X to Y". Với UNION nhiều nhánh: nhánh liệt kê tay phải
  khớp VỊ TRÍ với nhánh dùng `y.*` (cột `ALTER TABLE ADD` nằm CUỐI bảng ⇒ `y.*` đẩy chúng ra cuối). Đừng `k.*` khi thêm cột — liệt kê tay.
- **⭐ `CREATE OR REPLACE FUNCTION` mà THÊM tham số (dù có DEFAULT) = tạo OVERLOAD thứ 2, KHÔNG thay hàm cũ (cắn 06/09).** Gọi bằng
  số tham số cũ khớp cả hai ⇒ "function … is not unique" cho MỌI caller cũ (kể cả supabase.rpc). Phải `DROP FUNCTION` đúng chữ ký cũ
  trong migration kế (mig `202609061533`). Kiểm bằng `pg_get_function_identity_arguments`. Cùng họ: `EXECUTE … INTO record` không có dòng ⇒ record null,
  và truy `y.<cột>` mà bảng nhánh khác không có cột đó (`y.baitoan_id` vs `y.bien_the_id` trong CASE) = lỗi field — lấy khoá qua
  `execute format('select %I …', key_col)`.
- **⭐ React: KHÔNG khai báo component trong THÂN component khác (cắn 06/09 BaiCuaToi).** `const The = (…) => <li>…</li>` bên trong
  render ⇒ mỗi render cha là 1 type mới ⇒ React unmount/mount lại toàn bộ cây con ⇒ editor mất text đang gõ, ref DOM stale liên tục,
  form nhấp nháy. Dấu hiệu: tool test báo "ref is stale" ngay sau mỗi state change. Hoist ra mức module, truyền callback qua props.
- **⭐ Trước khi kết luận "tính năng X chưa có": `git fetch` + so `origin/main`, đừng grep worktree đang đứng (cắn 06/09).** Local
  outdate ⇒ grep sạch ⇒ báo CEO "chưa build" trong khi main đã có từ hôm trước. Nghi thức: `git fetch origin main` →
  `git log --oneline HEAD..origin/main` → grep trong `git show origin/main:<file>` nếu cần.


- **⭐⭐ PHIÊN LÀM TỪ ĐIỆN THOẠI (remote, KHÔNG có credential DB) — về máy có DB PHẢI chạy nghi thức
  đóng sổ, nếu không repo và DB nói hai chuyện khác nhau (cắn 01/09, 5 ngày liền):** phiên remote
  viết được migration nhưng **áp không được** → CEO dán tay qua SQL Editor → **DB có, sổ không**;
  có file còn **chưa từng vào git** (4 file `giai_thuong` 22/08 — `git log --all` = 0 hit). Nghi
  thức bắt buộc khi về máy có credential: ① `npm run migrate:status` → đối chiếu từng file "còn
  treo" với `pg_catalog` (có bảng/cột/fn CHƯA đủ — phải **soi THÂN hàm** tìm dấu vân của đúng bản
  mới, vì `create or replace` không đổi tên) → cái nào DB đã có thì `--baseline`, cái nào chưa thì
  `npm run migrate` ② `npm run schema` + commit `schema.md` ③ **verify các thao tác dán tay** bằng
  query thật (seed cờ, role, bucket, backfill) — đừng tin DEVLOG ghi "CEO đã dán".
- **⭐ "Ai đang dùng quyền này?" phải đo ở PHÍA TIÊU THỤ, không suy từ migration cũ (cắn 01/09):**
  đọc mig 15/08 (siết `fdw_bkdemy_web` còn 4 bảng, viết lúc chỉ có bkdemy-web dùng) rồi thấy DB đang
  mở 35 bảng ⇒ tao kết luận "lỗ hổng". Sai: từ 15/08 tới giờ **app PH** đã thành hộ dùng chính với
  21 foreign table, mở lại là đúng nghiệp vụ. Migration chỉ nói sự thật **lúc nó được viết**. Muốn
  biết hiện trạng thì mở **repo phía tiêu thụ** đọc khai báo (`limit to (...)`/`create foreign
  table`) rồi diff với grant — kết quả ra con số dùng được ngay (24 đang dùng / 10 dư). Cùng họ với
  §2 "số lượng khớp không phải bằng chứng": chứng cứ phải đến từ nơi tiêu thụ, không từ nơi cấp.
- **⭐ Băm file migration mà tính cả CRLF = 62 báo động giả (01/09):** cùng file áp từ Windows (CRLF)
  và từ container remote (LF) ra 2 vân tay ⇒ `--status` la làng "DB và repo nói khác nhau" trong khi
  nội dung y hệt. Báo động giả lâu ngày = **không ai đọc cảnh báo nữa**, nguy hơn không có cảnh báo.
  Sửa gốc ở CÔNG CỤ (băm nội dung LOGIC, bỏ CR) chứ không sửa từng file. Cùng họ với bài học
  "sửa `introspect` thay vì vá 1 constraint".
- **⭐ Sổ migration phải soi ĐỦ 3 CHIỀU** — ① file có, sổ không (còn treo) ② file có, sổ có, vân tay
  lệch (bị sửa sau khi áp) ③ **sổ có, file KHÔNG** ← chiều này trước 01/09 bị mù, và nó là chiều
  nguy hiểm nhất: dựng lại DB từ repo sẽ **thiếu im lặng**, không lỗi, không cảnh báo. Migration áp
  tay xong **phải commit file** — SQL chạy rồi mà file không vào git thì repo hết là source of truth.
- **⭐ Khôi phục DDL từ DB thì CHÉP ĐÚNG HIỆN TRẠNG, đừng tiện tay "cho chuẩn" (01/09):** dựng lại
  `giai_thuong` từ `pg_catalog` thấy bảng có **policy cho `fdw_bkdemy_web` nhưng KHÔNG có GRANT** —
  suýt thêm `grant select` cho "đủ bộ", tức là **tự nới quyền đọc** trong lúc chỉ định khôi phục.
  Policy và GRANT là **hai cổng độc lập** (đã ghi trong mig 15/08): chép cái đang có, ghi chú chỗ
  lệch, để CEO quyết. Migration khôi phục cũng phải idempotent + bọc DO-block kiểm **chủ sở hữu**
  (role migrate không sửa nổi RLS/trigger của bảng thuộc `postgres`).
- **⭐ PURE-DERIVE thắng roster tĩnh khi vấn đề chỉ là "list quá dài" (Test đầu vào assign, 08-14):**
  build xong 1 bảng curate riêng (`test_dau_vao_nhan_su`) để rút gọn dropdown chọn người, Thùy phản
  biện ngay — sort theo GẦN NHẤT-TỪNG-ĐƯỢC-GÁN (derive từ lịch sử, đã có sẵn trong DB) giải quyết đúng
  vấn đề mà không cần bảng/màn CRUD mới, không ai phải nhớ bảo trì khi người nghỉ việc. Bài học: trước
  khi thêm bảng/cột mới để "gọn UI", hỏi trước — dữ liệu LỊCH SỬ đã có sẵn có derive ra được thứ tự ưu
  tiên tương đương không? Chỉ tạo state tĩnh mới khi thật sự có KHÁI NIỆM MỚI (ở đây `nguoi_cham_id`/
  `nguoi_tra_bai_id` trên `ca_test` là assign THẬT của từng ca — giữ; danh mục "ai được chọn" thì KHÔNG).
- **⭐ Thuật ngữ CEO nghĩa HẸP theo ngữ cảnh — soi ví dụ TRƯỚC khi build UI (Kho Hình 08-08, hiểu nhầm 2 vòng):** Thùy nói "hiện list chuỗi trước" → tao hiểu list MỌI dạng/chuỗi khác nhau (build sai nút + popup list mọi component); ý thật = "các chuỗi CỦA NODE" = **gốc + biến thể của CHÍNH chuỗi đang xem**. Rồi lần 2 làm list nhãn nhỏ, Thùy muốn popup TO view full từng bản. Gặp danh từ CEO ("chuỗi", "bản", "ghế"…) có ≥2 nghĩa → **hỏi/soi 1 ví dụ cụ thể (ảnh màn) trước khi dựng cả UI**, đừng chọn nghĩa rộng rồi code. Rẻ vì đã tách UI khỏi logic (chỉ sửa popup, không đụng `noDapAn`).
- **`zoom:1.15` (#root) + `100vh`**: mọi `100vh`/`min-h-screen` painted ×1.15 → body scrollbar thừa. Chặn chiều cao 1 lần ở App = `h-[calc(100vh/1.15)]`, dưới dùng `h-full`. **MODAL (`fixed inset-0`+`vh`/`vw`) trong #root cũng bị phóng 1.15× → tràn màn hình → `createPortal(modal, document.body)` để THOÁT zoom.**
- **PostgREST embed: FK ĐƠN mới embed thẳng được; nhiều FK cùng đích → NHẬP NHẰNG (query lỗi âm thầm → rỗng).** `gami_grades.problem_id→gami_session_problems` = FK đơn → `select('...,prob:problem_id(...)')` (bỏ luôn IN-list, tránh URL dài). Còn `buoi_hoc_hs` có **2 FK** về `buoi_hoc` (`buoi_hoc_id`+`bu_cho_buoi_id`) → KHÔNG embed, phải **tách 2 bước** (lấy id rồi `.in()`).
- **"Đóng phase = XÁC NHẬN, GIỮ bảng read-only, chỉ Mở-lại mới sửa" (Thùy):** cấm early-return tắt UI khi đóng. Đóng → header banner "✓ đã đóng + ↩ Mở lại" + `disabled` mọi nút, bảng vẫn hiện. (Áp mọi tab chấm: Chấm bài/ET/BTVN/Đánh giá.)
- **Đổi tab mà KHÔNG mất state:** lazy-mount + `hidden` (mount 1 lần, ẩn khi off) thay vì conditional-render (unmount = mất chọn).
- **`grid h-full` KHÔNG đủ cuộn**: hàng grid mặc định `auto` → ô con tràn bị `overflow-hidden` cắt. Phải `grid-rows-[minmax(0,1fr)]` thì inner `overflow-auto` mới ăn. `min-h-0` một mình không cứu grid.
- **MathText `\n` vs lệnh LaTeX (`\neq`/`\nVì`)** — đã SAI 2 lần: cùng dạng `\n`+chữ, regex không phân biệt nổi. **Fix gốc: tách `$…$` TRƯỚC**, chỉ xử lý xuống dòng ở text NGOÀI `$`; trong text đổi ký hiệu Unicode trước rồi cắt dòng. **Bài học to: 2 thứ cùng pattern → TÁCH NGỮ CẢNH, đừng vá lookahead.** KaTeX dùng `\dfrac` (không `\frac`).
- **⭐ Cột `text` KHÔNG nói lên tập giá trị hợp lệ — CHECK mới nói.** Thêm giá trị vào union type TS mà quên migration nới CHECK ⇒ DB chặn đúng lúc user bấm nút (`new row for relation X violates check constraint`), và **chỉ nhánh giá trị MỚI chết** nên ẩn rất lâu (`prep_phong.luot` thiếu `'toi'` ẩn cả tháng vì Sáng/Chiều vẫn chạy). Đổi union type ⇒ **phải có migration đi kèm**. `schema.md` giờ hiện cột "giá trị hợp lệ" — đọc nó trước khi code cột trạng thái/loại.
  - **Bài học to hơn cái bug:** lỗi user báo là *một nút không bấm được*; thứ đáng sửa là **công cụ tra cứu đang giấu một chiều của schema**. Vá 1 constraint = trừ 1/47 điểm; sửa `introspect` = 46 điểm còn lại tự lộ ở lần `npm run schema` kế. Gặp bug, luôn hỏi thêm: *"cái gì đã cho phép nó ẩn lâu đến vậy?"*
  - **Luật xoá không phải thủ tục cho có:** trước khi xoá 20 dòng `'ngay'`, dữ kiện **mâu thuẫn giả định** — Thùy nói *"đang test, data không quan trọng"* nhưng 19/20 dòng có ảnh evidence thật, 6 dòng leader đã chốt. Nêu ra rồi mới xoá. Chỗ dừng đó là chỗ bắt sai lệch giữa *điều người ta nhớ* và *điều data nói*.
- **Mã/STT per-nhóm KHÔNG dùng trigger BEFORE INSERT**: multi-row insert 1 statement không thấy nhau → trùng. Tính **client-side max+1**.
- **⭐ (Kho Hình 07-24) Ba cái bẫy IM LẶNG — không lỗi, không cảnh báo:** (1) `migrate.mjs` áp LẠI mọi file mỗi lần → lệnh `drop` phải có **cổng nhận diện shape** (vd chỉ bảng CŨ mới có cột X) nếu không lần chạy sau xoá data MỚI. (2) CSS thư viện nạp SAU CSS của mình + **cùng độ ưu tiên** → override của mình thua (katex `.katex{1.21em}` đè `1em` → công thức to 21%); dùng `!important` hoặc đảm bảo thứ tự. (3) **React StrictMode + `paged.js Previewer.preview()` gọi thẳng trong effect** → 2 run chồng nhau ra ĐÚNG 0 trang (như treo); hoãn `setTimeout(…,0)` + clearTimeout ở cleanup để chỉ 1 run sống.
- **⭐ Suy để HIỂN THỊ vs id ỔN ĐỊNH:** Thùy muốn mã cây 1/1.1/1.1.1 (dễ đọc) nhưng spec cấm nhét vị trí vào mã (vỡ khi đổi cha/DAG). Không phải chọn một — **giữ id trơ bên dưới, DERIVE mã phân cấp để hiển thị** (tự tính lại khi cây đổi). Cùng khuôn: giả thiết con = derive (bố + delta), đề bài = derive (giả thiết mô hình + câu hỏi). Cái gì suy được từ cấu trúc thì đừng lưu trùng.
- **⭐ (08-06) Kế thừa KHÔNG phải lúc nào cũng = cộng text.** Tách 2 tầng đang bị gộp: **cạnh logic is-a** (subsumption — hình bình hành ⊑ hình thang, LUÔN kế thừa, nuôi bao đóng/cách giải) vs **text phát biểu** (tiếng Việt định-danh-hoá: "cho hình bình hành ABCD" đã bao "hình thang ABCD", không cộng dồn). Lý thuyết: subtype vs lexicalization — subclass vừa extend vừa override cách biểu diễn mà vẫn giữ Liskov. Fix = per-node mode, **giữ cạnh cha, chỉ nhánh hàm render text**. Đừng ép 1 quy tắc derive cho mọi cạnh.
- **⭐ (08-06) Tách một CHIỀU mới khi data còn NON = gần như miễn phí.** Catalog Hình tách theo khối lúc chỉ có 7 dạng / 0 bổ đề / 0 đo lường → 0 rủi ro. Nếu đợi sau khi có mastery (HS × dạng) rồi mới tách = phải map lại quan hệ đã mất (§2 "số lượng khớp không phải bằng chứng") — ác mộng. Verify TRƯỚC bằng query "dùng-xuyên-khối" rồi mới quyết default backfill; data mâu thuẫn lời nói (Thùy bảo khối 8, hoá ra khối 9) thì HỎI, đừng đoán.
- **(08-06) Bump cỡ chữ/hiển thị 1 khu vực mà không đụng nơi khác:** primitive dùng chung → thêm prop tuỳ chọn (`big`, mặc định false), CHỖ CẦN truyền prop; đừng sửa hằng số trong component (đổi cả app). KaTeX scale theo `font-size` container nên chỉ cần to container là công thức to theo. Đơn vị Thùy nói "pt" = point (≈1.33×px) — 12–13pt ≈ 16–17px, đừng nhầm sang px.
- **Paste ảnh nhân đôi**: window paste-listener + slot `onPaste` cùng nổ → `e.stopPropagation()` ở slot.
- **Lưu phải ĐỦ cột**: patch thiếu `lua_chon`/`anh_*` → rớt data. Tái dùng editor + mapper đủ cột.
- **claude_build KHÔNG đụng schema `auth`/`storage`**: tạo user + bucket/policy phải qua **Dashboard** (SQL Editor cho storage). Bảng `public` thì áp migration bình thường.
- **Auth không vướng RLS**: login đi endpoint `/auth` riêng → bật RLS KHÔNG khoá đăng nhập (chỉ khoá đọc/ghi bảng).
- **Render phải CHỊU output AI ẩu**: AI hay quên bọc `$` (để `\dfrac{6}{5}` trần) + dùng `<br>`. Renderer phải tự render lệnh-CÓ-NGOẶC trần + đổi `<br>`→xuống dòng. ĐỪNG tin AI bọc `$` chuẩn.
- **AI hay LỜ số lượng yêu cầu** (xin 20 biến thể, trả 41) → **luôn CAP cứng ở CODE**, đừng tin prompt. `maxOutputTokens` thấp CHE lỗi này (output bị cắt) → nâng 65536 + bắt `finishReason==='MAX_TOKENS'`.
- **Completeness phải có trạng thái "KHÔNG áp dụng" TƯỜNG MINH** (vd chuyên đề "không cần LT" → loại khỏi mẫu số %) — đừng tính ngầm/đoán, sẽ ra % sai.
- **Op**: migration áp RIÊNG từng file (0001 không idempotent). Test regex/chuỗi bằng **file `.mjs` chạy `node`** — ĐỪNG `node -e` qua bash heredoc (nuốt backslash). Vercel env nằm TRONG từng Environment (click Production), thêm xong phải **Redeploy**. Gemini key public → giới hạn HTTP referrer + budget alert.
- **⭐ team ≠ ghế (RBAC, vướng 3 lần):** gán role cho ghế phải ở **Phân quyền → "gán role cho vị trí"** (`vi_tri.vai_tro_id`), KHÔNG phải gán team ở tab Nhân sự. Chỉnh role mà không thấy đổi → 99% là role chưa bám ghế, hoặc account chưa **đăng nhập lại** (quyền load lúc login). Ghế trống tên → khó nhận trong tab gán → nên đặt tên vị trí.
- **⭐ Cờ quyền theo NGƯỜI/email, KHÔNG theo auth-uid:** Founder flag để ở `nhan_su` (set bằng ma_ns), `my_quyen()` resolve nhan_su qua tai_khoan HOẶC email → bootstrap được trước cả khi account login (chưa có dòng tai_khoan). Để cờ trên tai_khoan(=uid) thì người chưa login không set được.
- **⭐ Env khác nhau giữa LOCAL và VERCEL:** đổi `VITE_GEMINI_KEY` ở `.env.local` KHÔNG ảnh hưởng bản deploy — phải đổi env trên Vercel + Redeploy. "Local chạy, deploy lỗi key" = 2 key khác nhau, KHÔNG phải leak. (`CONSUMER_SUSPENDED`/`prepayment depleted` = billing/cap, không mặc định leak.)
- **⭐ Câu test/luyện/BTVN chống lạm dụng = least-used-first** (đếm `tai_lieu_cau`), KHÔNG block cứng toàn cục (dạng ít câu sẽ cạn). Cứng chỉ trong-buổi/đề; mềm xuyên thời điểm.
- **Bài (gami_session_problems) = SLOT/cấu trúc, KHÔNG phải phép đo** → tạo sẵn 10 bài OK; anti-NULL §1.5 áp ở GRADE (chỉ sinh khi chấm thật). Phân biệt slot vs measurement.
- **⭐ Reuse layout IN phải mang theo MỌI override CSS/page-break, không chỉ component** (vướng 1 lần ET): tái dùng `CauItem` cho ET nhưng quên scope override `.pv-h-dang{border-bottom:none}` + `.pv-cau{break-inside:auto}` (đã fix cho BTVN) → 2 lỗi cũ quay lại. Khi reuse PrintView CSS: scope override theo container mới (`.pv-et`, `.pv-btvn`).
- **Header/footer dải sóng:** path SVG phần MÀU phải phủ gần hết dải (footer V14/header V84, KHÔNG V40/V68) → text canh-giữa nằm trọn trên màu. `buildPagedCss` dùng chung mọi tài liệu.
- **Số thứ tự xuyên nhóm:** đếm liên tục qua nested map = counter ngoài (`let no=0` rồi `++no` trong map con), KHÔNG `index+1` (reset mỗi nhóm). BTVN/ET đều vướng.
- **Gemini `CONSUMER_SUSPENDED` (403) = CHẠM spend cap, KHÔNG mặc định là leak key.** Đoán "key bị trảm vì lộ" là SAI (đã sai 1 lần). Check **Console → Spend cap + email Google** trước. Nâng cap có **~10 phút latency** (F5 vô ích, không phải lỗi client). Cache `accepted_answers` + (sau) proxy server-side để giảm gọi/né cap.
- **Preview-phải-bằng-bản-in → dùng paged.js, ĐỪNG tự cuộn 1 mạch.** Tự phân trang HTML là vô vọng: **flex chặn page-break**; `@page` counter (số trang) **cần có margin** mới hiện. paged.js cho A4 thật + header/footer mỗi trang + đếm trang, **1 engine cho cả preview lẫn in** nên khớp.
- **⭐ paged.js — đầu khung/tiêu đề KHÔNG được là phần tử riêng trông vào `break-after:avoid` (27/09).** paged.js 0.4.3 chỉ xét avoid khi
  CHÍNH anh em liền sau tràn trang; nếu cái tràn là con BÊN TRONG nó (câu 1 trong `.pv-caulist`) thì avoid bị bỏ qua ⇒ đỉnh khung mồ côi cuối
  trang. Luật: gộp đầu khung + nội dung ĐẦU TIÊN vào 1 khối `break-inside:avoid`. Đo: cũ 14/61 vị trí mồ côi, mới 0/61.
- **⭐ Khung/CSS dùng chung phải thử CẢ 1 cột lẫn nhiều cột.** `.pv-caulist.pv-cols` đặt `line-height: --pitch` (7.5mm) ⇒ mọi thứ đặt trong nó
  (tag, nhãn) kế thừa, phình cao gấp đôi, đè chữ (lỗi 4A1 27/09 — test 26/09 chỉ thử 1 cột). Phần tử trang trí trong câu ⇒ đặt `line-height` tường minh.
- **⭐ Verify PDF khi Browser pane không vẽ được** (cửa sổ bị che ⇒ paged.js >30s, 0 trang, screenshot timeout — KHÔNG phải lỗi code; từng kết luận
  sai "div bọc làm treo" vì thế): dựng HTML tối giản + CSS rút thẳng từ `PrintView.tsx` + `node_modules/pagedjs/dist/paged.polyfill.js` → Chrome
  headless (`puppeteer-core` + Chrome máy), quét filler 0..N px để đo mọi vị trí sát đáy trang; so bản cũ (`git show HEAD:…`) vs mới. Component
  thật: `renderToStaticMarkup` qua `npx vite-node` (file .ts, không JSX; tránh `'\\'` trong heredoc — dùng `String.fromCharCode(92)`).
- **Sửa dữ liệu nội dung hàng loạt:** thay ĐOẠN CHÍNH XÁC (mỗi đoạn tìm đúng 1 lần, lệch là bỏ cả lượt) thay vì gõ lại; nhân chứng = so multiset
  từ cũ/mới; `update … where noi_dung = <bản cũ>` trong 1 transaction; lưu bản cũ vào repo. Editor tự xoá dấu cách cuối dòng trong file script ⇒
  chuẩn hoá `[ 	]+
` của bản gốc trước khi tìm.
- **⭐⭐ paged.js — LUẬT NGẮT TRANG ĐÚNG (bản 08-14, GỘP & SỬA bản cũ "cứ để `auto` là trang đầy"):** bản cũ nói *avoid trên khối TO làm nhảy cả khối → bỏ trống cuối trang, nên để `break-inside:auto`* — **đúng một nửa, và nửa sai đã gây bug thật**. Sự thật đo được (render thật + đo **% diện tích mỗi trang thực dùng**, không nhìn mắt):
  - **Ngắt GIỮA hai khối anh-em ruột (sibling) → paged.js chạy ĐÚNG.** **Ngắt VÀO TRONG lòng một khối, sâu ≥2 tầng** (vd giữa các `.mline` bên trong `.pv-blk` bên trong `.pv-box-lt`) → paged.js **bỏ phí nốt phần trang còn lại**: phần tử KẾ TIẾP không chịu nằm cùng trang mà nhảy hẳn trang mới (đo được: trang chỉ dùng **10%**). Nặng hơn: có ca nó dựng DỞ rồi để TRẮNG 1 trang rồi DỰNG LẠI TỪ ĐẦU → **lặp/mất nội dung THẬT**, không chỉ xấu.
  - **⇒ Công thức đúng: CẤM xé trong lòng khối (`break-inside:avoid`) + CHẺ khối dài thành nhiều khối NGẮN** để vẫn đủ chỗ ngắt HỢP LỆ (ở tầng sibling). Vừa không phí trang vừa không vỡ. (`LyThuyetBody` chẻ theo dòng khi khối > `LT_BLK_MAX`=3 dòng; dòng đầu giữ `.pv-blk-keep{break-after:avoid}` cho nhãn "Ví dụ N." không mồ côi.) Đo GT 8S1: **8 trang (99/10/97/95/85/72/82/34%) → 6 trang (96/91/96/85/96/85%)**.
  - **Thẻ BỌC thừa không style cũng là "1 tầng"** — `<div>` bọc cả nhóm card làm paged.js hỏng y hệt; đổi sang `<Fragment>` (không sinh DOM) là hết. **Ít tầng lồng = ít cửa hỏng.**
  - `.pv-math span.katex-text{display:inline}` — phải scope `span`, KHÔNG để trần `.katex-text`: MathText trả `<span>` khi 1 dòng nhưng `<div>` chứa `.mline` BLOCK khi nhiều dòng; ép `inline` lên `<div>` = block-trong-inline → paged.js đo sai chỗ xé (riêng cái này: 8 trang → 7).
  - Vẫn giữ từ bản cũ: chỉ avoid thứ ATOMIC nhỏ là đúng tinh thần, nhưng "nhỏ" phải hiểu là **chẻ cho nó nhỏ**, chứ không phải bỏ avoid. ("Dòng kẻ lạ" dưới heading = `border-bottom` của heading, KHÔNG phải dòng-viết.)
- **⭐ Bug IN phải verify bằng RENDER THẬT + SỐ ĐO, không bằng "nhìn ảnh thấy ổn" (08-14, tự vấp):** đã báo "fix xong" trong khi dữ liệu ngay trước mắt cho thấy trang 2 chỉ có 292 ký tự — vẫn lỗi. Công cụ đúng: script Node dựng headless qua **đúng pipeline `worker/index.mjs`** (Puppeteer + `dist/` + tín hiệu `window.__pvState`) → ra PDF trong ~4s **không treo** (khác hẳn bấm 🖨 In trong app hay browser-tool, cả hai đều treo/không compositing), rồi **đo % diện tích từng trang thực dùng** + **quét mã dạng trùng** để bắt lặp/mất. Metric này là ĐỒ NGHỀ NỘI BỘ — Thùy không quan tâm %, chỉ cần **gửi thẳng file PDF** để nhìn cái sẽ in ra giấy.
- **paged.js rewrite mọi `url()` (trừ `data:`) theo base = blob URL của stylesheet** (`sheet.js`): `url("/x.png")` tương đối → `new URL('/x','blob:…')` **THROW → preview TRẮNG**. Trong CSS nạp vào paged.js phải dùng **URL tuyệt đối** (`location.origin+'/x'`) hoặc `data:`. Luôn để paged.js `.preview().catch()` **hiện lỗi**, đừng nuốt → trắng trơn khó mò.
- **⭐ Đóng phase 2 lần (Elo×2):** guard đọc cờ ở ĐẦU nhưng set ở CUỐI (closePhase ~4s) → double-click lọt. **Fix gốc: CLAIM atomic** — `update set dong_at=now where id AND dong_at is null` ngay đầu; 0 row = đã đóng. Mọi hành động "1 lần/đối tượng" tốn thời gian PHẢI claim atomic trước khi tính, đừng tin guard-đọc-rồi-ghi-sau (+ disable nút busy).
- **⭐ Elo độc lập nhiều phase phải tính từ SNAPSHOT trước-buổi, không nối tiếp:** ban đầu ET dùng elo-sau-ingame → buổi 1 mọi HS điểm 0 mà kỳ vọng E lệch (vì elo_before lệch). Đúng: pre = elo hiện tại − Σ delta CỦA CHÍNH BUỔI NÀY (phase kia); gami_elo **cộng dồn delta** (độc lập thứ tự); reopen = **trừ delta** (đừng revert elo_before — xoá delta phase kia). Data cũ sai → **replay theo thời gian** (`_replay_elo.mjs`).
- **⭐ EXP theo hạng KHÔNG công bằng khi hoà:** `rankSession` chia hạng 1..N kể cả khi điểm thô bằng nhau → EXP lệch dù thành tích y hệt. Fix: **gom theo điểm thô, mỗi nhóm = TB bậc EXP các vị trí nhóm chiếm**.
- **⭐ Tràn bảng rộng = `min-width:auto` của flex/GRID item:** bảng rộng (nhiều cột) bung cả track thay vì cuộn trong `overflow-x-auto` → mất scrollbar + đẩy nút khuất. Phải `min-w-0` ở **MỌI tầng** flex/grid từ khung tới ô cuộn (block thường không cần). 9A2 không bị (đã đóng→bảng hẹp), 9B1 bị (đang mở→11 bài) → khác nhau do trạng thái, không phải data.
- **⭐ Seed trùng do StrictMode chạy effect 2 lần:** insert không idempotent → đẻ đôi (Bài 1,1,2,2…). Fix: **unique constraint** + **upsert ignoreDuplicates** ở mọi `ensure*Problems`. (Effect mount chạy 2 lần trong dev là bình thường — data-layer phải chịu được.)
- **⭐ 1 người nhiều vai/lớp:** logic gộp role về 1 (ưu-tiên-gv) làm rụng task vai kia (tg→ET). Luôn gom UNION vai, dedup theo tab — đừng "1 lớp 1 vai".
- **⭐ Task định tính cần mốc-xong TƯỜNG MINH:** pure-derive (suy từ bằng chứng) hợp cho điểm danh/chấm-bài/ET (có mốc tự nhiên); đánh giá sau buổi KHÔNG có "đủ" rõ → phải có **nút Hoàn thành + cờ riêng** (`danh_gia_xong_at`). Đừng piggyback mốc của task khác.
- **⭐ Buổi `hoan_tat` ≠ đóng-1-phase:** buổi thường hoàn tất khi CẢ ingame+ET đóng. Đóng ET đơn lẻ set hoan_tat (model cũ) → task GV biến mất (getMyTasks lọc trang_thai='mo'). Mốc xong phải theo TỪNG phase, không phải cả buổi.
- **Xoá denormalize (chủ đề/chuyên đề trong dai_ban_do) bị FK RESTRICT chặn nếu còn câu:** xoá-cụm phải **cascade câu trước** (`dai_cau_hoi` → tai_lieu_cau/bổ-đề tự CASCADE) rồi mới dai_ban_do. Rename = đổi TÊN giữ MÃ (mã là FK-target).
- **⭐ Windowing theo mùa/tháng = INSTANT UTC, không format ngày-local:** "reset EXP theo mùa/tháng" = lọc `created_at` (timestamptz), KHÔNG xoá data. Mốc = `new Date(Date.UTC(y, m, d, -7,0,0)).toISOString()` (VN+7 → giờ -7) = đúng instant VN-midnight để so. Cấm `toISOString()` của §2 chỉ áp cho **format ngày-local hiển thị**, KHÔNG cấm tạo instant boundary để so timestamptz.
- **⭐ Thống kê phụ-thuộc-thời-điểm phải GHI tại thời điểm, không suy ngược:** "hạng cao nhất từng đạt" / "verdict so band" phụ thuộc trạng thái người khác / band LÚC ĐÓ → không tính lại sau được. Phải **snapshot ngay** (mig 0042 lưu `rank` mỗi buổi; `diem_thi.band_luc_thi` snapshot band lúc thi). Đếm Top-1 = đọc rank đã ghi.
- **⭐ Gu UI 2 cõi: STAFF = Apple-clean · HS-facing = GAME** (đừng lẫn): màn staff/vận hành = **Apple-clean** (xem "GU UI STAFF" ở ① — **KHÔNG sci-fi**; Thùy ĐÃ BỎ hẳn skill `bkdemy-scifi-ui`, đừng invoke cho staff). Profile HS chiếu TV = game vui nhộn (mascot/gradient tươi/Fredoka). Mockup chốt LOGIC trước, skin đẹp = phiên claude design sau.
- **⭐ Sửa tay HANDOFF/DEVLOG khi CHƯA pull = working tree bẩn chặn `git pull` (fast-forward abort) → tưởng "pull không ăn".** Về máy MỚI: `git pull` TRƯỚC rồi mới sửa. Lỡ sửa → `git stash` → pull → `stash pop`. (Diverged thật vs chỉ-chậm-sau: `git rev-list --left-right --count main...origin/main`.)
- **⭐ Supabase `.update()` resolve IM LẶNG kể cả 0 dòng / sửa nhầm cột** → chỉ báo "đã lưu" KHÔNG chứng minh data đổi. Nghi thì VERIFY DB (claude_ro). Vụ "đổi tên giáo trình buổi": indicator ✓ nhưng người sửa nhầm `tai_lieu_phan.tieu_de` thay vì `tai_lieu.ten`; RLS member_all cho UPDATE OK + không trigger → loại trừ đúng tầng bằng query TRƯỚC khi sửa code.
- **⭐ Fit-to-screen = giữ layout ở DESIGN_W cố định rồi `transform:scale(min(1,…))`**, KHÔNG responsive co chữ. transform KHÔNG đổi offset layout → đo `offsetHeight` ra kích thước thật, ResizeObserver không loop. `matchMedia` đọc viewport (KHÔNG bị `zoom:1.15` ở #root).
- **⭐ Cắt hình từ PDF = render DPI cao rồi crop, KHÔNG phóng ảnh nhỏ.** pdf.js render trang 300 DPI (hình vector nét tuyệt đối); hiển thị downscale để kéo box, map toạ độ về nguồn DPI cao khi cắt. Scan → cap theo DPI gốc. Worker Vite: `pdf.worker.min.mjs?url`.
- **⭐ paged.js `:first-of-type` theo TAG không theo class** → `.pv-btvn:first-of-type` áp NHẦM khi BtvnSheet là `<section>` duy nhất trong BuoiBlock (scope all → mất ngắt trang BTVN). Gate bằng class cha (`.pv-doc-btvn > …`) khi chỉ muốn trang-đầu-quyển.
- **⭐ AI trả JSON có LaTeX/text → DÙNG `responseSchema` (constrained decoding), đừng vá-tay từng lỗi.** `responseMimeType:'application/json'` KHÔNG đủ: Gemini vẫn ra `\dfrac` (1 backslash → "Bad escaped character") rồi `"` chưa escape ("Expected , or }") — vá lần lượt là đuổi mãi. Bật `generationConfig.responseSchema` (Type enum UPPERCASE) ép xuất JSON hợp lệ + tự escape. `lenientJsonParse` (nhân đôi backslash lẻ: `/\\(["\\/bfnrtu])|\\/g`) làm lưới phụ. Áp cho MỌI call AI→JSON.
- **⭐ Pixel-math trên element trong `#root` (zoom:1.15) phải map theo TỈ LỆ rect**, KHÔNG trừ thẳng `clientX-rect.left` (clientX ở viewport, rect đã zoom → lệch 1.15×). Công thức chuẩn: `(clientX-rect.left)/rect.width*canvas.width` (chống mọi zoom/scale/DPR).
- **⭐ Canvas cần đo/paint phải LUÔN mount** (ẩn bằng class, đừng render điều kiện): nếu chỉ mount khi `hasSrc` thì `paint()` chạy ngay sau set state → canvas chưa mount → vẽ hụt → "phải chọn file 2 lần". Mount sẵn (hidden) → ref có ngay.
- **⭐ List hiển thị có UPDATE tại chỗ PHẢI có thứ tự tường minh** (`.order()` hoặc sort client): PostgREST KHÔNG đảm bảo thứ tự; UPDATE đẩy tuple mới xuống cuối heap (MVCC). Điểm danh: `getRoster` thiếu order → mỗi `update diem_danh` làm HS vừa bấm NHẢY chỗ → "loạn thứ tự". Fix: sort client theo `hoc_sinh.ho_ten` (localeCompare 'vi', tie-break id) — PostgREST không order được theo cột bảng NHÚNG (`hoc_sinh(...)`). Mọi tab buổi (đánh giá/chấm/ET/BTVN) đều `roster.filter` từ 1 nguồn → fix 1 chỗ ổn định hết.
- **⭐ BTVN KHÔNG soạn riêng — làm CÙNG giáo trình + TRÍCH XUẤT + khớp (lớp+ngày).** (đã thử thêm editor BTVN riêng lá `lamtailieu:btvn` → Thùy bác → REVERT toàn bộ.) BTVN/giáo-trình-buổi đều là doc VẬN HÀNH bám (lớp+ngày) sinh từ trích xuất master (TrichPanel tick BTVN), tab buổi tự khớp y như ET. **"Chưa có BTVN" = buổi đó CHƯA trích BTVN, KHÔNG phải bug** (verify DB: 14 doc btvn đều `tu_trich`, gắn lớp+ngày, khớp buổi, không trùng). Đừng tạo đường soạn tài liệu vận hành tách khỏi trích xuất.
- **⭐ `responseSchema` (constrained decoding) LÀM PHẲNG xuống dòng:** áp responseSchema cho clone → Gemini gộp chuỗi 1 dòng (mất bố cục đề/lời giải). Prompt nói "cách xuống dòng" KHÔNG đủ — phải ép bằng **`description` per-field** trong schema (Gemini tôn trọng) + rule "giữ đúng bố cục nhiều dòng". Trade-off: responseSchema = JSON luôn hợp lệ NHƯNG mất format tự do → khi cần format, bù bằng description.
- **⭐ Migration sửa 1 phần QUÊN CHECK constraint = bug ẩn:** mig 0045 thêm BTVN (phase='btvn') nhưng QUÊN nới `gami_session_problems_phase_check` (vẫn ingame|et|mt) → insert 400. **Thêm giá trị mới cho 1 cột có CHECK/enum → PHẢI nới constraint cùng migration.** Sau migrate: grep code dùng giá trị mới + check `pg_constraint`.
- **⭐ `catch {}` nuốt lỗi = giấu bug, chẩn sai:** BtvnTab `catch → setMissing(true)` biến lỗi-constraint-400 thành "Chưa có BTVN" (đánh lừa = thiếu tài liệu, mất 2 phiên mới ra). Catch ở luồng load nên **log/hiện lỗi thật**, đừng map mọi lỗi về 1 trạng thái "rỗng".
- **⭐ In lặp tiêu đề (doc bám buổi):** doc `btvn`/`giao_trinh_buoi` từng in lớp/ngày/tên buổi ở 3 chỗ (bìa + dải buổi + header/footer). Quy ước: **tên buổi 1 lần** (dải buổi / tiêu đề phiếu) · **lớp+ngày ở header dải sóng** · **footer = liên hệ** (KHÔNG lặp tên/khối). `buildPagedCss(opts:{headerText,footerText})` override; bỏ pv-cover cho doc bám buổi. LT buổi-1-chuyên-đề → "Lý thuyết" (tên chuyên đề hay trùng tên buổi).
- **⭐ CHỤP ẢNH DOM (ảnh gửi PH / report) — luật chốt (06-22, sửa 6 vòng mới ra):** (1) **BÊ NGUYÊN pattern V1** `TabSatHach.handleCopy`/`copyImg` (đọc KỸ cả 2 hàm, đừng tự chế iframe/canvas): `window.open` → `document.write` HTML phiếu (card `outerHTML`) + html2canvas **CDN** + nút "Copy ảnh" TRONG popup → bấm = user-gesture trong popup → `clipboard.write(ClipboardItem)`; tải file CHỈ trong `catch`. (2) **KHÔNG chụp node sống trong app shell** (app CSS / `zoom:1.15` / scroll / clip → lệch/trắng) — popup = document sạch. (3) Card **tự-mô-tả bằng inline HEX/rgb** (KHÔNG class màu Tailwind v4 — v4 compute `oklch()` → `html-to-image` ra trắng âm thầm, `html2canvas@1.4.1` throw cứng). (4) Cần **căn-chữ-chính-xác / hình** trong vùng chụp → dùng **SVG** (`<text dominant-baseline=central>` — browser render, pixel-perfect), ĐỪNG dựa căn-CSS của html2canvas (baseline lệch + bỏ qua `position:relative` inline → nudge tay vô hiệu). [Auto-Report Pha 1.5: full app không inline-hex được → screenshot phải `getDisplayMedia`, KHÔNG html2canvas node live.]
- **⭐ Gu UI staff = clean/modern NHIỀU MÀU, KHÔNG sci-fi** (Thùy BỎ HẲN HUD "xóa luôn cơ mà") — ĐỪNG invoke skill `bkdemy-scifi-ui` cho màn staff. Profile HS-facing = game (khác). Muốn "đẹp hơn": **dựng mockup (visualize widget) duyệt hướng TRƯỚC**, hỏi mẫu tham chiếu — KHÔNG code thẳng rồi căn vòng vo. Card text: **bỏ `truncate`** (Thùy: tên phải FULL) + thông tin đầy đủ; lấp chiều ngang (đừng để cột rail rộng thừa).
- **⭐ Roster `buoi_hoc_hs` = SNAPSHOT lúc mở buổi → HS ghi danh SAU bị sót điểm danh.** Vá tại NGUỒN: `ghiDanh`/`setNgayVao` tự `syncHSVaoBuoiTuNgay` (thêm HS vào mọi buổi mở của lớp từ `ngay_vao`, mo+hoan_tat bỏ huy, idempotent) — KHÔNG chỉ dựa `dongBoSiSo`-lúc-mount (chậm + từng từ chối hoan_tat). Roster = SLOT (insert sẵn OK, §1.5 anti-NULL chỉ áp ở GRADE). Buổi hoan_tat thêm HS → tự về "cần điểm danh" (hoan_tat = phase Elo đóng, KHÁC điểm-danh-completeness). Chẩn bug sĩ số/roster = soi DATA THẬT (claude_ro: so `enrolled` vs `in_roster`) trước khi sửa.
- **⭐ Tuần BK + deadline = util thuần `lib/tuan.ts`** (giờ VN: `Date.UTC`, `vnInstant(ngay,'HH:MM')`=epoch VN−7h; KHÔNG `toISOString`/`new Date('YYYY-MM-DD')`). Tuần 1 mốc cứng `Date.UTC(2026,5,29)`. Ngưỡng/giá trị "người chỉnh được" → để 1 CONST tập trung (`NGUONG_DEADLINE`) chứ đừng rải số ma; UI settings dựng sau.
- **⭐ Sửa DATA SAI (xoá nhầm) = điều tra read-only TRƯỚC, xoá scope theo ID, ko cascade nếu pure-derive:** quy trình chốt — script `_diag` (claude_ro/SELECT) tìm HÀNG + MỌI downstream (FK con + bảng keyed theo `hoc_sinh_id`+`buoi_hoc_id`: grades/elo/exp/btvn/canh_bao/problems) → xác nhận khớp "mô tả sai" (vd HS đã `da_roi` lớp kia, lớp khai-giảng tương lai) → `_del` scope CỨNG theo id, print before, **abort nếu ≠ số dòng mong đợi**. **CẤM xoá đè dữ liệu ĐO THẬT** (§1.5): `buoi_hoc_hs` rỗng → xoá được; có ET/điểm → CHẶN (sửa điểm danh thay vì xoá). buoi_hoc_hs là SLOT, pure-derive → gỡ dòng là sĩ số tự đúng, ko phải dọn cascade. Đưa quy trình này thành **nút trong app** (gỡ HS khỏi buổi) thay vì cứ Supabase/nhờ Claude.
- **⭐ Danh mục liệt-kê (môn…) lấy từ NGUỒN CHUNG, ĐỪNG suy từ "data đang có":** panel lớp&band suy môn từ (môn-có-lớp ∪ môn-HS-học) → Anh/Văn chưa có lớp bị ẩn (Thùy: "phải đủ 4 môn"). Fix: 1 hằng `MON_LIST` (`src/lib/mon.ts`) dùng chung tuyển-sinh+HS. "Data-driven, ko cứng N" chỉ hợp khi danh mục THẬT SỰ động — môn/khối là danh mục CỐ ĐỊNH → hiện đủ để xếp/lập-kế-hoạch kể cả khi chưa có data của mục đó.
- **⭐ Doc VẬN-HÀNH (BTVN/giáo-trình-buổi) 1-1 với (lớp+ngày+loại) → re-tạo = THAY THẾ, ko đẻ thêm:** `trichXuatBuoi` insert mù → re-trích đẻ doc trùng → `getBTVNByBuoi.maybeSingle()` THROW → màn ko load (im lặng). Fix 3 lớp: (a) **unique index TỪNG PHẦN** `(lop_id,ngay,loai) where loai in (...) and lop_id/ngay not null` (master GT `lop_id` null ko dính) — DB chặn cứng; (b) trích **xoá-rồi-tạo**; (c) loader **`order+limit1` thay `.maybeSingle()`** (maybeSingle giòn — 2 dòng là throw cả màn). Bài học chung: query "đúng 1 dòng" mà nguồn có thể đẻ trùng → đừng maybeSingle, dùng order+limit1 + unique-index ở DB.
- **⭐ Cột schema CHUẨN BỊ SẴN nhưng chưa dùng = tái dùng đúng intent:** `dai_cau_hoi.menh_de` (jsonb) có sẵn từ lâu, null hết → đúng để chứa 4 mệnh đề câu Đúng/Sai (mỗi cái 1 `ma_dang` riêng), KHÔNG cần bảng mới. Trước khi đẻ bảng/cột, grep schema xem có cột prepared chưa.
- **⭐ Scope UI/search theo MÔN ĐANG XEM, ko xuyên môn** (Thùy: "kho nào search cái đấy thôi — nhân sự môn nào chỉ thấy môn đó"): search câu/kho dùng `config.cauTbl` của nhánh hiện tại, ko gộp Toán+KHTN. Khớp RBAC scope④ (staff thấy đúng môn). Mã câu `ma_cau = ma_dang + STT` → nhìn mã biết dạng/khối → lần về kho nhanh.
- **⭐ "Tính năng ko thấy trên bản chạy" → kiểm CHƯA-COMMIT / CHƯA-PUSH trước khi nghĩ thiếu/hỏng:** reorder dạng đã code xong nhưng nằm working-tree CHƯA commit → `origin/main` (Vercel deploy) ko có → Thùy báo "cần lại tính năng". Quy trình chẩn: `git status` (uncommitted) → `git log origin/main..main` (unpushed) → `git show origin/main:<file>` (có trên deploy ko). Đừng vội build lại cái đã có. Code chạy local ≠ đã deploy: chỉ **push main** mới lên Vercel.
- **⭐ Chiều MÔN = 2 NGUỒN tách bạch, đừng lẫn:** `nhan_su_mon` (môn của NGƯỜI → scope④ content: vào kho/tài liệu môn nào) vs `vi_tri.mon` (môn của GHẾ → cấu trúc org + span-of-control trong môn + role bám ghế → "mở màn nào"). Quyền-mở-màn (①) từ role-trên-ghế, KHÔNG từ môn; môn chỉ siết NỘI DUNG (④) + TÁCH cây org. Người ngồi ghế KHTN phải được gán KHTN ở Nhân sự mới vào được kho KHTN (2 thao tác). Môn (như quyền) **load lúc LOGIN** → đổi xong phải đăng nhập lại.
- **⭐ Thêm chiều lọc (môn) vào bảng CÓ SẴN data → BACKFILL kẻo "biến mất":** thêm `vi_tri.mon` + lọc `mon===sel` làm 31 ghế cũ (mon=null) mất khỏi mọi tab. Backfill ghế chuyên môn cũ → 'Toán' (org trước chỉ Toán) NGAY sau migration. Cùng pattern: nhan_su_mon backfill mọi NS = Toán. Quy tắc: cột-lọc mới NOT-NULL-trong-thực-tế nhưng nullable-trong-DB → backfill giá trị mặc định hợp lý cho data cũ.
- **⭐⭐ KIẾN TRÚC MÔN = mỗi môn 1 TRUNG TÂM riêng, ĐỪNG gộp content (Thùy chốt sau audit 06-29):** 4 môn = 4 bounded-context đối xứng (bản chất như nhau), chỉ chung HS + vận hành. **Content (kho/dạng/câu/lý-thuyết) RIÊNG từng môn/nhánh — KHÔNG gộp 1 bảng chung.** Lý do bác gộp: các môn/nhánh KHÁC cấu trúc (Đại=Câu, Hình=Bài/Ý; Lý/Hóa/Sinh/Văn/Anh sẽ khác) → gộp = ghép cứng domain độc lập, **lợi hiệu suất ~0** (bảng riêng bằng/nhanh hơn), rủi ro "sai lệch 1 tý là phiền". Kho xây-1-lần, mở chiều RỘNG (thêm trung tâm) không nhồi sâu. **LUẬT (CLAUDE.md §1.6): mọi dữ liệu HỌC TẬP mang nhãn `mon`; chỉ phi-học-tập (HS cá nhân/PH/ví-xu/tài-khoản) mới chung.** Nhãn 2 tầng (môn→nhánh). Symmetry test = tiêu chí đúng: `if mon==='Toán'` đặc biệt trong code chung = SAI. Bài học meta: **đừng vá-ngọn dispatch từng màn — audit gốc trước; CEO bác "gộp cho gọn" là đúng (bounded context > DRY khi domain độc lập).** Chi tiết: `ADR-mon.md`.

- **⭐ Postgres regex KHÔNG hiểu `\d`/`\s` như JS/PCRE** (chẩn SAI 1 lần: query "khối 7 có câu dính Câu N?" trả 0 → tưởng sạch, thực ra 11 câu): POSIX ARE của Postgres — `\d`/`\s` cho kết quả LỆCH/rỗng. Dùng **`[0-9]` / `[[:space:]]`** (hoặc `~*` + lớp POSIX). Test regex trên DB bằng ILIKE (chắc) trước khi kết luận "không có dòng nào".
- **⭐ Layout đáp án/ý-con = tách theo NHÃN + ước lượng độ rộng** (`splitStem`/`OptGrid` dùng chung print): ưu tiên đáp-án-A/B/C/D-nhúng → ý-con-a/b/c (`splitLabeled`, đòi nhãn LIÊN TỤC chống bắt nhầm "a)" lẻ) → ý-con-KHÔNG-nhãn. `optCols` ngưỡng 14/30 (≤14→4 cột·≤30→2×2·dài→1). Câu có hình: đề→HÌNH→đáp án. Đáp án nhúng trong noi_dung (lua_chon=null) = data bẩn nhưng RENDER tự tách được (fix hiển thị, ko cần sửa data gấp).
- **⭐ BLOCK model (Thùy chốt): block = tầng HIỂN THỊ ≈/⊆ 1 dạng, câu giữ `ma_dang`.** Lưu = tái dùng `tai_lieu_phan` (nhiều phan cùng ma_dang = nhiều block/dạng), `kieu` = registry mở rộng (thêm kiểu = thêm renderer, ko sửa schema). Setting doc (lý thuyết/kiểu) để builder + persist `cau_hinh` → **trích xuất buổi KẾ THỪA** (Thùy trích-buổi-gán-lớp, KHÔNG xuất cả file → đừng đặt lựa chọn ở toolbar-in, đặt ở SETTING).
- **⭐ paged.js `.preview()` async + effect đổi deps NHIỀU LẦN = 2 Previewer chồng → NHÂN ĐÔI TRANG:** effect có dep load muộn (vd `lopTen` fetch sau `full` ở doc bám-buổi) → chạy 2 lần; cleanup `cancelled=true` KHÔNG chặn Previewer đang flow → run cũ vẫn append trang SAU khi run mới đã clear node → trang gấp đôi (chỉ lộ ở doc đủ dài + có dep async, doc ngắn/không-async ko dính → dễ tưởng "chỉ 1 doc lỗi"). **Fix: mỗi run render vào CONTAINER RIÊNG (`createElement` append live để paged.js đo layout); run stale (`cancelled`) tự `.remove()`, run mới xoá container run trước → luôn CHỈ 1 bản.** (Áp `PrintView`+`ETPrintView`.) Bài học chung: engine async ghi thẳng DOM chung + React re-run = phải cô lập output mỗi run + huỷ output stale, KHÔNG chỉ set cờ.
- **⭐ MASTERY = suy động (HS×dạng), công thức Thùy: Đ/C/S per lần = 1/0.5/0; TB 5 lần gần nhất → ≥0.8 đạt·0.5–0.8 cần luyện·<0.5 yếu; chưa-đo=null(≠0); độ tin theo cỡ mẫu.** Dùng **mean** (ko tổng tuyệt đối) để <5 lần vẫn xếp mức. V1 (`StudentAcademicView.jsx`) = **ví dụ CÁCH HIỂN THỊ** (timeline lần đánh giá per-dạng), KHÔNG phải cách đo (V1 binary Đ/S, ngưỡng 0.7; V2 3-mức, ngưỡng **0.8**). Nguồn đo V2 = ingame+ET (`gami_grades.result` qua `problem_id→session_problems.ma_dang`)+đánh giá GV (`buoi_danh_gia_dang.diem`); **BTVN LOẠI** (toggle để soi). Engine `src/gami/mastery.js` + service `src/lib/mastery.ts`. **3 view TÁCH** (từng-HS chi tiết / lớp rollup tổng quát / chiều-dạng), ĐỪNG gộp 1 heatmap (Thùy bác). [Login HS ĐÃ CÓ 07-04 — `my_hoc_sinh_id()`/`tai_khoan.hoc_sinh_id`; ⏳ mastery CHƯA đọc kết quả ET-online (`bai_lam_cau`).]
- **⭐ ĐẾM/TỔNG-HỢP TOÀN BẢNG: KHÔNG fetch-all rồi group ở client — PostgREST cap `max-rows` (~1000) cắt ÂM THẦM (không lỗi) → sai KHÔNG báo.** Triệu chứng: kho >1000 câu → thẻ "0/50" cho dạng mới (cuối heap) trong khi DangHub (lọc theo 1 dạng, <cap) vẫn thấy câu. Chẩn: data đúng (soi claude_ro) + RLS `la_thanh_vien()` STABLE no-arg = eval 1 lần (không throw/timeout) + card render được (query xong) ⇒ chỉ còn cap. **Fix = aggregate ở Postgres trả `jsonb` 1 DÒNG** (RPC `count_cau_by_dang` `jsonb_object_agg`) — 1 dòng miễn nhiễm cap; GROUP-BY nhiều dòng CŨNG dính cap nên phải jsonb. `security definer` + guard `la_thanh_vien()` + whitelist bảng. (mig 0062.)
- **⭐ RASTERIZE paged.js → PDF (html2canvas-pro + jsPDF): header/footer là `::before/::after` NHIỀU background (logo+chip+wave) KHÔNG chụp được** → header trắng, chữ trắng thành mờ, trang lỗi (§367 cảnh báo đúng). **Fix: `onclone` TẮT pseudo (`content:none`) + chèn PHẦN TỬ THẬT** (`<img>` logo + `<img>` chip + 1 wave nền ĐƠN + `<span>` text) — html2canvas chụp ảnh/element thật chuẩn. Kèm: `await document.fonts.ready` + preload logo TRƯỚC chụp (chống trang trắng chữ) · render **on-screen sau lớp phủ đục** (KHÔNG `left:-99999px` — xa quá hay ra trắng) · `html2canvas-pro` (chịu oklch Tailwind v4, bản gốc throw). Nguồn header/footer = 1 hàm chung (`pageChrome`) cho cả paged-CSS (pseudo, bản IN vector) lẫn onclone (element, bản TẢI). PDF tải = RASTER (chữ không select) — bản vector vẫn ở `window.print()`. **window.print KHÔNG tự tải file** (bắt buộc hộp thoại) → muốn 1-bấm-tải phải tự dựng PDF.
- **⭐ Bản GV in tài liệu phải phủ MỌI loại câu** (gom `GvAnswer` dùng chung): **Đúng/Sai** đừng chỉ render `noi_dung` — 4 mệnh đề ở `menh_de` (render a·b·c·d + Đ/S; thiếu = mất câu ở CẢ bản HS). **ET trả-lời-ngắn** GV cần cả lời giải (không chỉ đáp án ngắn). Câu `menh_de` trong ET → route sang nhánh CauItem (bảng TLN không hiển thị nổi mệnh đề).
- **⭐ Renderer phải cân bằng `$` lẻ (AI clone hay quên `$` đóng cuối)** — `balanceDollars` trong `MathText.buildLines` (đếm `$` đơn không-escape, LẺ → thêm cuối). Đếm THỦ CÔNG `s[i-1]!=='\\'`, **KHÔNG lookbehind regex** (Safari <16.4 ném SyntaxError lúc parse module → chết cả file). Fix ở renderer = lợi mọi nơi + data cũ.
- **⭐ Gom việc "Việc của tôi" theo NGÀY** (mỗi ngày 1 hàng) thay lưới `auto-fill` tràn ngang: đầu hàng = thanh-màu-kẻ-dọc (design §259) + Thứ/ngày/đếm; body = card của ngày. `thuCuaNgay` dùng `Date.UTC`+`getUTCDay` (không lệch tz, KHÔNG `new Date('YYYY-MM-DD')`).
- **⭐ RLS 2 CÕI staff/HS — bảng mới KHAI TAY, HS ≠ `la_thanh_vien()`:** 0026 blanket member_all chỉ phủ bảng CÓ SẴN lúc đó; bảng mới (test online) phải tự khai 2 policy song song: staff = `la_thanh_vien()` · HS = scope riêng (`my_hoc_sinh_id()`/`hs_o_lop()`). Tài khoản HS (`hoc_sinh_id` set, `nhan_su_id` null) KHÔNG phải thành viên → tự tách khỏi mọi màn staff. HS cần đọc 1 bảng staff (vd tên lớp) → thêm policy đọc HẸP (`lop_hs_read` theo `hs_o_lop`), đừng nới member-gate.
- **⭐ Bài THI online = 3 lớp chống gian lận, THIẾU 1 là thủng:** (1) HS **không SELECT được bảng chứa key** (RLS loại ET) — client "không hiển thị" là vô nghĩa, HS đọc PostgREST thẳng được; (2) đề qua **RPC security-definer LỌC key/lời giải** (`et_de`); (3) **chấm SERVER-side + chỉ chấm lần nộp ĐẦU** (`et_nop` claim `get diagnostics row_count`) — chấm client hay chấm-lại-mỗi-lần-gọi đều cho sửa-đáp-án-rồi-nộp-lại. Snapshot phải **self-contained** (kèm lý thuyết/lời giải) vì HS không đọc kho.
- **⭐ Đáp án nhiều phần tách CHỈ theo `;`, ĐỪNG tách theo `,`:** `,` là dấu THẬP PHÂN VN ("0,5") — V1 `split(/[;,]/)` cắt "0,5"→["0","5"] là bug ngầm. Kho quy ước list = "3; 4". (`smartCheckTLN` testgrade.js.)
- **⭐ App HS-facing trên NỀN app staff có `#root{zoom:1.15}`:** đừng sửa zoom gốc (vỡ staff) — bọc nhánh HS trong `zoom: 1/1.15` → net 1.0 cho điện thoại. Màn làm-bài dùng `h-screen` (footer nút ghim đáy, giữa cuộn).
- **⭐ FK bảng bài-làm → bảng đề snapshot phải CASCADE:** `bai_lam_cau→bai_test_cau` để RESTRICT làm "xoá test phát lại" FAIL ngay khi có 1 HS làm (mig 0066). Xoá instance đông cứng = bỏ luôn bài làm của nó — thiết kế FK theo vòng đời instance, đừng mặc định RESTRICT.
- **⭐ Đổi state có ĐIỀU KIỆN LIÊN QUAN (HS nghỉ ⇒ phải rời lớp) = TRIGGER DB, không phải "nhớ gọi thêm hàm ở app":** bug lộ ra qua triangulation (đúng §5) — provisioning script lọc `trang_thai='dang_hoc'` phát hiện 2 HS "nghỉ" nhưng vẫn `dang_hoc` 1 lớp = data mâu thuẫn, do chưa từng có cơ chế nào tự đóng ghi danh khi đổi trạng thái HS. Fix: trigger AFTER UPDATE `hoc_sinh` tự đóng mọi `hoc_sinh_lop.dang_hoc` liên quan (chảy qua trigger log sẵn có). Bài học chung: khi 1 thay đổi ở bảng A **logic bắt buộc kéo theo** thay đổi bảng B, đặt invariant đó ở TRIGGER — đừng rải "nhớ gọi hàm X sau khi set Y" ở nhiều nơi trong app (chắc chắn có chỗ quên).
- **⭐ Xáo hiển thị (chống liếc bài) = CHỈ đổi tầng UI, chấm luôn theo chỉ số GỐC:** cần 2 HS thấy thứ tự câu/đáp án khác nhau nhưng chấm điểm phải nguyên vẹn — đáp: seed ổn định theo (HS×bài[×câu]) sinh hoán vị CHỈ dùng để hiển thị (nhãn A/B/C/D theo vị trí hiển thị), còn `state`/so-sánh-đúng-sai luôn dùng **chỉ số gốc** (orig). Nhờ vậy engine chấm (client lẫn server RPC) không cần đổi 1 dòng nào. Bài học chung: khi cần "trộn ngẫu nhiên nhưng vẫn chấm đúng", tách bạch NGAY từ đầu 2 khái niệm — vị-trí-hiển-thị vs định-danh-gốc — đừng để logic chấm phụ thuộc vị trí render.
- **⭐ Khoản tiền/thuộc-tính "đi kèm nhau" trong 1 bảng mức = giả định RỦI RO, hỏi rõ TRƯỚC khi gộp:** bundling ban đầu "học phí + giá đuổi cùng 1 mức" rồi lại phải tách 2 lần (mức đầu → theo lớp → cuối cùng đuổi phải theo CA chứ không theo lớp gốc). Bài học: khi 2 con số CÓ VẺ liên quan (cùng 1 lớp, cùng 1 loại phí) chưa chắc cùng ĐƠN VỊ THAY ĐỔI — hỏi CEO "cái này có luôn đi cùng nhau không, hay có lúc tách riêng" trước khi thiết kế bảng, đỡ phải tách schema 2-3 lần.
- **⭐ "Hệ số/thuộc tính của NHÓM" mặc định nên nghi ngờ — kiểm xem có phải thực ra là của TỪNG CÁ THỂ:** hệ số học phí ban đầu đóng dấu-1-số-cho-cả-gia-đình (giống elo/exp per-môn từng bị hiểu nhầm là per-nhóm) — đúng ra là per-HS, chỉ điều kiện tính có tham chiếu tới anh-chị-em. Dấu hiệu nhận: nếu 2 điều kiện tính (bản thân + so-với-người-khác) gộp thành 1 số chung cho CẢ NHÓM thay vì lưu riêng từng cá thể → dễ sai khi nhóm thay đổi (thêm/bớt thành viên) mà không có cơ chế nào recompute đúng lúc.
- **⭐ Bảng "tổng quan bulk" (N PH/HS cùng lúc) và "chi tiết 1-đối-tượng" là 2 NGUỒN TÍNH KHÁC NHAU, đừng cố dùng chung 1 hàm:** bulk phải batch-query (gộp mọi query "theo X" thành 1 query `.in()` rồi map trong JS) để tránh N+1 nổ theo số PH; chi tiết 1-đối-tượng thì N+1 chấp nhận được (rẻ) nhưng CHÍNH XÁC hơn (chạy đủ xét-duyệt/nợ-cũ/phát-sinh-tay). Sự lệch số giữa 2 nguồn là ĐÚNG THIẾT KẾ (bulk là ước lượng nhanh), không phải bug — nhưng phải nói rõ trong UI/comment kẻo sau này tưởng bug.
- **⭐ "Chỉ tính khi CÓ điều kiện nền" — đừng default charge vô điều kiện:** học liệu ban đầu charge bất kể tháng đó có buổi học không (lớp 0 buổi vẫn thu học liệu) — sai theo trực giác nghiệp vụ ("chưa học thì sao thu"). Khi 1 khoản phụ (B) đi kèm 1 khoản chính (A), mặc định B chỉ tính khi A cũng phát sinh — đừng tính B độc lập trừ khi CEO xác nhận rõ.
- **⭐ State chọn-lọc (PH đang xem / kỳ đang chọn / tab con) phải sống ở STORE ngoài React tree nếu user kỳ vọng "quay lại vẫn còn":** `useState` cục bộ mất sạch khi component unmount (tab-switch dùng conditional-render, hoặc rời hẳn màn). Bug này generic — bất kỳ màn nào có tab con unmount-khi-đổi-tab đều dính. Fix 1 lần: dồn state "phải nhớ" vào zustand `useStore` (module-scope, không phụ thuộc component lifecycle); state tạm (input đang gõ, loading) vẫn để `useState` bình thường — đừng lạm dụng store cho MỌI state.
- **⭐ `SearchSelect` (component DÙNG CHUNG) — dropdown mặc định luôn bung XUỐNG là giả định sai khi trigger gần đáy màn hình:** phải đo `getBoundingClientRect()` lúc mở rồi tự quyết bung lên/xuống (giống mọi combobox thật). Sửa 1 lần ở component gốc lợi TOÀN APP, không phải vá riêng từng chỗ dùng nó.
- **⭐⭐ Spec (kể cả do AI/người ngoài viết kỹ) vẫn có thể SAI về VỊ TRÍ/IA dù đúng kỹ thuật — chỉ lộ ra khi soi UI THẬT:** feature "Đề thi" ban đầu đặt đúng như spec gợi ý (`lamtailieu:de_thi`, cạnh Giáo trình/ET) — kỹ thuật/data-model không sai gì, nhưng SAI mô hình tư duy: "Làm tài liệu" = soạn TỪ kho có sẵn (chiều kho→ra), còn đề thi là NGƯỢC chiều (đề→vào kho), đúng ra phải cạnh "Nhập kho". Thùy chỉ ra ngay khi thấy UI thật, sửa RẺ vì đã tách bạch UI (nav/entry-point) khỏi logic (component/data) từ đầu — chỉ cần dời nơi render, không sửa lại bên trong. Bài học: **luôn tách UI-vị-trí khỏi component-logic** để lỗi IA (nếu có) sửa rẻ; và genuinely audit/build theo spec không thay thế được việc CEO xem trên UI thật — 2 tầng kiểm khác nhau, không tầng nào thừa.
- **⭐⭐ paged.js KHÔNG hỗ trợ CSS layout hiện đại (`display:grid`/`<table>`/`display:flex`) — TREO CỨNG (không lỗi, không ra trang, chờ vô hạn); CHỈ block/inline-level (`display:block`/`inline-block`) an toàn.** Vụ ghép câu 2/3/4-cột trong in giáo trình: `column-count` không treo nhưng KHÔNG tôn trọng `break-after:avoid` của heading theo sau → heading mồ côi cuối trang + khoảng trắng xấu, không cách nào vá bằng CSS thuần. Thử thay bằng grid/table/flex (tưởng căn hàng ngang nhau tốt hơn) → **CẢ 3 đều treo cứng paged.js** (test thật, không đoán). Fix cuối: bỏ hẳn multicol, **ghép câu theo HÀNG bằng `inline-block`** (`.pv-row` = N câu `display:inline-block`, width `calc()`+CSS var `--cols`) — vẫn là block-flow bình thường nên paged.js ổn định, hàng xếp chồng tự nhiên, cột chạy xuyên trang được, không cần tránh-mồ-côi (không còn "khối lớn" phải giữ nguyên). ⚠ **Test paged.js LUÔN dùng tab/server HOÀN TOÀN MỚI mỗi kịch bản** — tái dùng tab đã chạy qua 1 case treo làm MỌI test sau đó "ăn theo" treo oan (suýt kết luận sai "table cũng lỗi do CSS", thực ra do tab cũ). Lần fix ĐẦU (bọc `break-inside:avoid` quanh cả khối) tưởng ổn qua repro giả lập nhưng **gây MẤT NỘI DUNG thật** trên tài liệu thật (nhiều dạng liên tiếp + KaTeX nặng hơn giả định) — bài học: repro giả lập PASS không chứng minh AN TOÀN, phải verify trên app thật trước khi báo xong việc nhạy cảm (in ấn/dữ liệu).
- **⭐⭐ Trước khi thiết kế field lương/hiệu-suất mới — verify bảng đang có ĐÚNG LÀ của đối tượng định dùng, đừng suy theo TÊN GIỐNG NHAU:** spec Giao việc giả định `luong_bac`/`gami_exp_ledger` ("lương"/EXP) là cơ chế lương NHÂN SỰ để tái dùng — verify schema lộ ra đó là cơ chế gamification CỦA HỌC SINH (tên gọi trùng "lương" chỉ là ẩn dụ vui trong ADR thành tích). Nếu tin theo spec mà không verify sẽ dựng nhầm lương NS lên bảng của HS. Bài học chung: tên bảng/cột nghe "đúng ý" không đủ — luôn `information_schema`/đọc FK thật xem nó THỰC SỰ trỏ tới đối tượng nào trước khi tái dùng.
- **⭐⭐ CÔNG THỨC NGHIỆP VỤ (điểm/hiệu suất/tiến độ...) KHÔNG ĐƯỢC ĐOÁN — 3 lần sai trong 1 buổi (07-06):** (1) "chất lượng" TA chấm ET bịa từ tỉ lệ HS làm đúng bài — nhầm outcome-học-tập với quality-làm-việc; (2) gọi tràn `deXuatTienDo()` (hàm chỉ đúng cho task ĐÃ xong, dựa `r.doneAt`) cho cả task CHƯA xong → hiện nhầm "Tiến độ 100%" cho việc còn trễ hạn chưa làm; (3) đoán "Hiệu suất = trung bình cộng(tiến độ, chất lượng)" — SAI, công thức thật là **Chất lượng − phạt tiến độ** (phạt = 100−tiến độ, KHÔNG PHẢI avg). Thùy bắt lỗi cả 3 lần ngay khi nhìn số hiện ra vô lý trên UI. **Quy tắc rút ra: công thức tính điểm/hiệu suất/xếp hạng — dù nhìn "có vẻ hợp lý" — PHẢI hỏi rõ định nghĩa/ví dụ cụ thể từ CEO TRƯỚC khi code, đừng suy đoán rồi để lộ qua UI.** Việc dựng UI xong rồi mới lộ sai công thức (từng bug) đắt hơn hỏi trước 1 câu.
- **⭐ Task CHƯA XONG vẫn suy được số "tiến độ SỐNG"** (không phải luôn `null`): so hiện-tại-với-deadline (cùng ngưỡng giờ trễ của task đã xong) → số tụt dần nếu càng để lâu, đúng pattern badge Quá hạn/Sát hạn đã có sẵn ở "Việc của tôi" (`mucDeadline`). Khi 1 field "chỉ tính được lúc xong" bị hỏi "sao chưa xong mà có số" — cân nhắc có phải nó thực ra suy được LIVE từ deadline, đừng vội để `null`.
- **⭐ "Ngày hiển thị/đến-hạn" ≠ "ngày sự-kiện-gốc" → filter khoảng-tuần theo NGÀY GỐC là bug rình sẵn ở 2 biên:** report tối-hôm-trước ca học — filter `ngayReport>=tu` (chặn trùng khi xem tuần liền kề) chỉ test 1 chiều (hôm nay=cuối tuần) mà quên chiều kia (hôm nay=ĐẦU tuần, report-hôm-qua thuộc TUẦN TRƯỚC theo lịch nhưng vẫn phải hiện vì còn nợ). Khi 1 mốc hiển thị lệch khỏi mốc sự kiện (report=ngày-trước, deadline=giờ-sau…), test filter khoảng phải thử CẢ 2 đầu tuần (đầu tuần lẫn cuối tuần đang xem), không chỉ 1 kịch bản.
- **⭐ Component tự giữ state RIÊNG (tách khỏi list cha, key không đổi) — MỌI hàm ghi-rồi-cần-phản-ánh-UI phải tự refetch, không có ngoại lệ "hàm này chắc không cần":** `LuotCard` (PrepScreen) có 4 hàm ghi (`tick/cham/chot/dong`), 3 hàm đầu tự `setRow()` sau ghi, hàm thứ 4 (`dong`) quên — vì key card không đổi (`phong+luot`) nên React không remount, state cũ tồn tại dù DB đúng, card "trông như chưa đóng". Khi copy-paste pattern refetch cho hàm anh-em, audit ĐỦ cả nhóm cùng lúc, đừng tin "đã sửa xong" sau khi thấy 1-2 hàm đúng.
- **⭐ Trước khi đặt SỐ migration mới, `ls supabase/migrations | tail` check TRÙNG** — nhất là khi biết có thể có phiên/máy KHÁC đang chạy song song (07-07: 1 phiên khác đang tạo `web_lead_writer_role` cho bkdemy-web, đụng đúng số 0087 với tôi, phát hiện lúc `git status` thấy file untracked lạ). Đừng đụng/xoá file người khác — đổi số CỦA MÌNH cho tránh đè, xong ghi rõ lý do đổi số vào DEVLOG.
- **Áp 1 migration lẻ đã CÓ SẴN script `scripts/_apply_one.mjs <file.sql>`** (xem ①) — dùng CÁI NÀY, đừng tự chế lại logic tương tự trong `migrate.mjs` (đã từng tự sửa `migrate.mjs` thêm argv-filter rồi phải revert vì trùng chức năng — kiểm tra HANDOFF/`scripts/` trước khi tưởng "thiếu tool" mà tự đẻ thêm).
- **⭐ Storage bucket KHÔNG tự tồn tại chỉ vì HANDOFF/migration nói "đã chạy" — verify LIVE trước khi tin, đặc biệt trên project/environment MỚI hoặc lâu không đụng lại.** Bước tạo bucket là THAO TÁC TAY qua Supabase Dashboard (`claude_build` không có quyền schema `storage`, chỉ `public`), rất dễ bị bỏ sót khi chuyển project/môi trường mới. **⚠ SỬA LẠI 07-09 — cách verify ĐÚNG khác cách nghi ban đầu:** `storage.listBuckets()` bằng **anon/authenticated key KHÔNG đáng tin** — RLS mặc định chặn SELECT trên bảng `storage.buckets` (khác `storage.objects` có policy `to public`) nên LUÔN trả `[]` GIẢ dù bucket có tồn tại thật (đã tự dính đúng lỗi này 1 lần khi verify lại). **Verify đúng: dùng `SUPABASE_SERVICE_ROLE` key gọi `listBuckets()` (bypass RLS), hoặc test thẳng `storage.from(bucket).list()`** (ăn theo policy objects, phản ánh đúng thực tế app dùng).
- **⭐ `ma_dang` KHÔNG tự động unique xuyên MÔN — verify bằng `join` đếm trùng trước khi tin "namespace tách biệt":** tưởng KHTN dùng dãy mã riêng (KG/KC) như ý định gốc ghi trong HANDOFF, thực tế KHTN seed bằng format số giống Toán → 17 mã trùng số giữa `dai_ban_do`/`khtn_ban_do`. Mọi chỗ tra tên/thông-tin theo `ma_dang` mà KHÔNG biết trước `mon` (gộp/merge nhiều bảng theo môn) → RỦI RO lộ nhầm tên môn khác cho mã trùng (bug thật: buổi bù Toán hiện tên dạng KHTN). Quy tắc: **có `mon` trong tay lúc nào → dùng NGAY để chỉ tra 1 bảng đúng môn đó** (`khoCuaMon(mon)`), đừng gộp-rồi-lọc.
- **⭐ Buổi-loại-MỚI (`buoi_hoc.loai`) thêm vào enum/CHECK KHÔNG có nghĩa là `getMyTasks()` tự route được cho nó** — phải tự tay thêm nhánh derive (route theo cột chủ sở hữu đúng của loại đó: `nguoi_day`/`nguoi_day_tg` hay `phan_cong_lop`) + component Detail phải `export` và nhận được `buoiId` độc lập (không chỉ nhận full object từ 1 màn list cụ thể) mới mở được từ "Việc của tôi". `loai='bo_tro_duoi'` tồn tại trong schema/UI list từ lâu nhưng KHÔNG có task nào route tới nó cho tới khi phát hiện qua báo lỗi thật — kiểm tra CHÉO: mỗi `buoi_hoc.loai` mới thêm, tự hỏi "task cho nó route ở đâu trong `getMyTasks()`?" ngay lúc build, đừng đợi ai báo thiếu.
- **⭐⭐ Hoạt-động-đa-lớp (MT) KHÔNG cần bảng/entity RIÊNG cho "buổi" của nó — nếu bản chất là 1 PHASE của buổi_hoc đã có (07-08, Thùy chốt sau khi build sai kiến trúc 1 lần):** bản đầu cho MT hẳn `buoi_hoc.loai='mt'` riêng (giống ET/BTVN từng KHÔNG có buổi riêng làm mẫu ngay trước mắt mà vẫn không theo) → sinh HÀNG LOẠT vấn đề đồng bộ (buổi thường song song không tự đóng, "Buổi học" phải thêm nhánh routing riêng, "Việc của tôi" phải query riêng) mà lẽ ra KHÔNG TỒN TẠI nếu theo đúng mẫu ET (buổi thường + cột đóng riêng `_dong_at` + tab UI). Dấu hiệu nhận sớm: nếu 1 hoạt động mới **luôn xảy ra TRONG 1 buổi_hoc đã/sẽ tồn tại** (dù nó multi-lớp/multi-lần như MT) thì nó là PHASE, không phải LOẠI BUỔI mới — chỉ tạo `loai` mới khi hoạt động đó không gắn với buổi_hoc nào cả (vd sự kiện độc lập ngoài lịch lớp). So sánh với mẫu tương tự CÙNG hệ thống (ET) TRƯỚC khi chọn kiến trúc, đừng thiết kế từ đầu như nó chưa từng có tiền lệ.
- **⭐ Buổi "hoàn tất" khi thêm 1 phase MỚI (không phải-mọi-buổi-đều-có, như MT) vào buổi thường có sẵn (ingame+et) → gate PHẢI hỏi thêm "phase này có ÁP DỤNG cho buổi này không" trước khi đòi nó đóng:** gate cũ (ternary 2 chiều `phase==='et' ? ingame_dong_at : et_dong_at`) không đủ khi thêm chiều thứ 3 — nếu bắt buộc `mt_dong_at` luôn phải có mới hoàn tất thì buổi KHÔNG gán MT (đa số buổi) sẽ KHÔNG BAO GIỜ hoàn tất được. Fix: query nhẹ ngay trong hàm đóng phase xem phase đó CÓ tồn tại thật cho buổi này không (`gami_session_problems` count theo phase, hoặc `tai_lieu` instance exists) rồi mới đưa vào điều kiện gate — áp dụng cho MỌI lần thêm phase tuỳ-chọn (không phải mọi buổi đều có) vào 1 luồng "hoàn tất" đã có sẵn N phase cố định.
- **⭐⭐ Khi CEO mô tả rule nghiệp vụ bằng lời có ≥2 cách hiểu (hẹp/rộng) — QUERY DB xem THỰC TẾ dữ liệu ủng hộ cách nào, đừng chỉ suy luận trên giấy "cách nào an toàn hơn":** "gán MT thì đóng hoạt động khác của buổi" — tự chọn cách hiểu HẸP ("chỉ đóng của chính buổi MT vừa tạo") vì nghĩ an toàn hơn (ít side-effect), KHÔNG chủ động kiểm xem có buổi_hoc(loai='thuong') SONG SONG cùng (lớp,ngày) hay không — thực tế CÓ (9S1 hôm đó đã có buổi thường), CEO test thật mới lộ thiếu. Bài học: gặp câu lệnh nghiệp vụ mơ hồ, việc ĐẦU TIÊN là tra DB xem tình huống thực tế nó áp dụng lên state nào, không phải chọn phương án nghe "conservative" hơn trên lý thuyết.
- **⭐ Hành-động GẮN 1 nội dung (MT/ET/tài liệu…) vào buổi đã có/sẽ có KHÔNG được hỏi lại thuộc tính CỦA BUỔI (giờ/phòng/GV) — buổi tự suy từ TKB hoặc đã tồn tại sẵn, hỏi lại là sai lớp trách nhiệm:** form "Gán MT vào buổi" bản đầu có 3 ô Giờ/Phòng/GV thừa (CEO: "cái đó thuộc về buổi học"). Quy tắc chung khi thiết kế form "gắn X vào entity Y có sẵn": chỉ hỏi cái form đó THỰC SỰ sở hữu (ở đây: định danh buổi = lớp+ngày); mọi thuộc tính khác của Y phải suy/tái dùng từ nguồn đã có (TKB) hoặc để entity Y tự quản, không hỏi lại người dùng dù "tiện có sẵn ô nhập".
- **⭐⭐ `overflow-hidden`/`overflow-x-auto` trên 1 div CHỈ để bo-góc/cuộn-ngang sẽ NUỐT sticky của con nếu div đó không tự cuộn dọc:** theo CSS spec, bất kỳ `overflow` khác `visible` trên 1 ancestor (kể cả chỉ set 1 trục) đều biến nó thành "scroll container" — `position:sticky` của con bám vào ancestor GẦN NHẤT có overflow non-visible, KHÔNG PHẢI ancestor thật đang cuộn (trang ngoài). Div bọc chỉ để bo-góc/cho-cuộn-ngang thường KHÔNG có `max-height` riêng (cao = nội dung, tự nó không bao giờ cuộn dọc độc lập) → sticky "bám" vào 1 khung chẳng hề cuộn → nhìn như vô hiệu, không báo lỗi gì. Vá: gỡ overflow khỏi div bọc cosmetic đó, để khung cuộn NGOÀI CÙNG (cấp trang) làm chuẩn duy nhất. Muốn 1 bảng vừa sticky-top vừa tự cuộn-ngang-riêng (không kéo cả trang) thì div bọc đó phải TỰ LÀ khung cuộn dọc luôn (`flex-1 min-h-0 overflow-auto` có chiều cao bound, kiểu `ETChamTab`/`MTTab` trong BuoiHocScreen) — không có cách nào vừa để trang ngoài cuộn dọc vừa có 1 div-con lo cuộn-ngang MÀ sticky vẫn xuyên qua, đây là giới hạn cứng của CSS, không phải thiếu class.
- **⭐ Loading placeholder ngắn thay-thế-toàn-bộ nội dung mỗi lần `reload()` sẽ TỰ RESET vị trí cuộn của khung `overflow-auto` chứa nó:** `<p>Đang tải…</p>` chỉ vài chục px thay chỗ 1 bảng cao hàng nghìn px → khung cuộn co chiều cao lại → trình duyệt TỰ ĐỘNG clamp `scrollTop` về 0 (hành vi mặc định, không chặn được ở tầng CSS) → bảng đầy lại ngay sau đó nhưng `scrollTop` đã mất, không tự phục hồi → cảm giác "làm gì xong cũng nhảy về đầu trang". Vá: chỉ hiện loading khi CHƯA có data (`list.length===0`, lần tải đầu) — các lần `reload()` sau (sau khi sửa/lưu) giữ nguyên nội dung cũ trên màn tới khi data mới về, DOM không bị phá giữa chừng nên scroll tự nhiên giữ nguyên. Áp cho MỌI `reload()` viết theo công thức `setLoading(true)` vô điều kiện — pattern lặp lại ở gần hết các màn danh sách trong app.
- **⭐ Màn KHÔNG có khung cuộn riêng = nội dung tràn bị CẮT THẲNG bởi `overflow-hidden` của khung ngoài, KHÔNG PHẢI thiếu data:** `NhanSuHome` bọc mọi `staffLeaf` trong 1 khung `overflow-hidden` (chủ đích — mỗi leaf tự quản cuộn riêng, tránh 2 tầng cuộn lồng nhau phá sticky, xem bài học ngay trên). Leaf nào build vội quên bọc `flex-1 overflow-auto` cho chính nó (chỉ 1 block div thường) thì phần tràn khỏi viewport MẤT HẲN, không kéo xuống xem được — TRÔNG như thiếu data nhưng thật ra data đủ, chỉ là không render ra được. Checklist cho leaf mới: root PHẢI có dạng `flex h-full min-h-0 flex-col` (header đứng yên) + con `min-h-0 flex-1 overflow-auto` (nội dung cuộn) — soi nhanh bằng `el.scrollHeight > el.clientHeight` ở khung nghi ngờ.
- **⭐ Dữ liệu effective-dated PER-SLOT (như TKB/`phan_cong_ops`) — tra "trạng thái tại 1 ngày" cho NHIỀU ngày trong 1 khoảng PHẢI resolve theo ĐÚNG ngày của từng bản ghi kết quả, KHÔNG được snapshot 1 ngày đại diện (kể cả ngày đầu khoảng) rồi dùng chung:** snapshot chỉ đúng cho bản ghi mà hiệu lực đã bắt đầu TRƯỚC mốc snapshot đó; bản ghi bắt đầu SAU mốc (hiệu lực rơi giữa khoảng — vd nhân sự vừa được phân công trực giữa tuần) sẽ bị tra hụt TOÀN BỘ, không phải 1 phần. Triệu chứng: "mới gán/đổi xong mà vẫn không thấy hiệu lực" dù data DB đã đúng — bug nằm ở TẦNG ĐỌC (thời điểm tra), không phải tầng ghi.
- **⭐⭐ Có 2 con đường ra cùng 1 kết quả (native engine vs tự-viết-lại-bằng-JS) → ưu tiên NATIVE cho nhu cầu CHÍNH, chỉ giữ tự-viết-lại cho phần native KHÔNG LÀM ĐƯỢC (07-11, sau nhiều vòng vá html2canvas không dứt điểm):** `window.print()` (native, browser tự render DOM đã ổn định) và `html2canvas` (JS tự re-implement chụp màn hình, chạy như tiến trình bất đồng bộ ĐỘC LẬP, có thể đua với thư viện JS khác đang thao tác cùng DOM — ở đây là paged.js) cho ra "PDF" bề ngoài giống nhau, nhưng độ tin cậy khác hẳn. MỌI bug rasterize đã chase trong session 07-11 (JPEG rám chữ, nhân bản 419→210 trang, dòng-kẻ-mồ-côi, header/footer lệch) đều là biến thể của đúng 1 lớp vấn đề gốc: race giữa 2 xử lý JS độc lập. Native không có lớp "vẽ lại bằng JS" nên miễn nhiễm cả lớp bug đó. Quy tắc: khi nhu cầu CHÍNH (ở đây: "lấy 1 file PDF cục bộ") có đường NATIVE khả thi, dùng nó — chỉ giữ pipeline tự-vẽ-lại cho nhu cầu native KHÔNG THỂ đáp ứng (ở đây: upload Blob im lặng — browser chặn lấy Blob từ hộp thoại in, rào bảo mật cố ý, không sửa được). Đừng tiếp tục vá triệu chứng (đổi định dạng ảnh, đổi thời điểm cleanup DOM…) khi gốc rễ là chọn SAI công cụ cho nhu cầu chính.
- **⭐ html2canvas rasterize CSS `background:url(data-URI-SVG) center/100% 100%` KHÔNG tôn trọng `backgroundSize` — dùng kích thước "tự nhiên" theo tỉ lệ viewBox gốc thay vì kéo giãn theo khối chứa** (07-11 tiếp 8, nối dài bài học §597 — hồi đó chỉ phát hiện/sửa được logo+chip, CHƯA phát hiện chính dải sóng nền vẫn còn dính): hậu quả là dải màu bị nén dẹt xuống rất thấp so với khối chứa thật, phần còn lại trắng trơn; chữ `align-items:center` theo chiều cao ĐẦY ĐỦ của khối rơi vào vùng trắng đó → chỉ còn thấy bóng đổ (`text-shadow`) mờ mờ, KHÔNG thấy chữ trắng thật (nhìn giống "chữ biến mất" chứ không giống lỗi background rõ ràng). Chẩn ra được nhờ TỰ TẢI + TỰ RENDER file PDF thật ở độ phân giải cao rồi crop đúng vùng header/footer soi — không đoán được từ đọc code suông. Fix chuẩn (khớp hẳn với cách đã chứng minh đúng cho logo/chip): mọi ảnh cần html2canvas chụp ĐÚNG TỈ LỆ phải là `<img>` thật (`position:absolute;inset:0;width/height:100%`), KHÔNG dùng CSS `background`.
- **⭐ `document.title` = tên file MUỐN GỢI Ý, set NGAY TRƯỚC `window.print()`:** Chromium (kể cả driver "Microsoft Print to PDF") lấy `document.title` hiện tại làm tên file mặc định trong hộp thoại "Lưu dưới dạng PDF" — không có cơ chế API nào khác để gợi ý tên file cho native print. Đổi title ngay trước `print()`, khôi phục lại sau `afterprint` (bắn dù bấm lưu hay huỷ) để không lộ tên "giả" ra tiêu đề tab thật lúc bình thường.
- **⭐ Job NỀN (tự động, không ai đứng canh) chạy qua 1 pipeline có TIỀN SỬ TREO VĨNH VIỄN (paged.js, xem bài học trên) BẮT BUỘC có watchdog timeout — job THỦ CÔNG (người bấm, tự thấy nếu treo) thì không cần:** hàng đợi tự động (backfill link mọi tài liệu, 07-11 tiếp 8) mà không có giới hạn thời gian → 1 tài liệu hiếm gặp bị treo sẽ chặn đứng TOÀN BỘ hàng đợi phía sau vĩnh viễn, không ai biết để can thiệp (khác job bấm tay — người bấm tự thấy "sao mãi không xong"). Watchdog chỉ áp lớp NỀN, không áp lớp thủ công (tránh cắt ngang việc người dùng đang cố ý chờ).
- **⭐⭐ PDF = ảnh-chụp-trang (rasterize) là sai lầm gốc rễ CẢ về kích thước LẪN chất lượng (07-12, kết sổ toàn bộ saga link PDF):** cùng 1 tài liệu — html2canvas chụp PNG từng trang ra 10-50MB (vượt trần bucket 50MB → upload 400), chữ là ảnh (không copy/search); Chrome in native ra PDF CHỮ chỉ vài trăm KB, sắc nét mọi độ zoom. Và MỌI lớp bug canvas suốt 07-11→12 (JPEG rám, nhân trang, chữ nhân đôi, nền lệch, mất chữ trắng) chung 1 gốc: thư viện TỰ VẼ LẠI trang bằng JS. Nhu cầu "tạo file PDF không hộp thoại" đã có đường native thật: **Puppeteer `page.pdf({printBackground:true})` = đúng engine in Chrome** — server-side hoá đường native chứ không phải re-implement. Từ nay: cần PDF từ HTML → Chrome print engine (tay hoặc Puppeteer), KHÔNG BAO GIỜ html2canvas cho mục đích này nữa.
- **⭐⭐ Hàng đợi việc-phải-làm thuộc về DB, KHÔNG phải RAM/localStorage client (07-12 — vi phạm luật §2 CLAUDE.md và trả giá đúng từng chữ):** hàng đợi gen-link đời 1 sống trong Zustand → mất sạch khi F5 (bao nhiêu job đang chờ biến mất không dấu vết — chính là "bấm nút ko thấy link" Thùy report); vá bằng persist localStorage vẫn sai bản chất (trạng thái chỉ 1 máy thấy, máy đó không mở browser thì không ai làm việc). Chuyển thành bảng `linkgen_jobs` + worker server: job sống sót mọi reload, mọi máy thấy cùng trạng thái, worker tắt thì job DỒN chờ chứ không mất. Nhận diện sớm: cái gì là "việc PHẢI xảy ra dù user rời đi" → DB ngay từ đầu.
- **⭐ Supabase refresh token DÙNG-1-LẦN (rotation) — cấm chia sẻ 1 session cho nhiều client:** worker Node đăng nhập 1 lần rồi phát token cho từng trang Puppeteer qua `setSession` → trang đầu "tiêu" refresh token là phiên gốc chết theo, job 2 trở đi dính "Auth session missing!" (job 1 luôn chạy được — bẫy khó thấy nếu chỉ test 1 lần). Fix: mỗi consumer/job `signInWithPassword` MỚI TINH (~200ms) — mỗi trang 1 session family riêng, rotation vô hại.
- **⭐ Upload Storage trả 400 → nghi NGAY trần dung lượng file của bucket/plan** (checklist "Debug 400" §2 vốn chỉ cover PostgREST, thiếu vế storage): đo bằng binary-search upload thật (40MB qua / 60MB chặn → trần 50MB, khớp dashboard "Global file size limit" do spend cap). Body lỗi của storage là JSON có `statusCode`/`message` riêng — đọc nó trước khi đoán RLS/policy.
- **⭐ Component render-nhiều-lần (scope tự chuyển, data phụ nạp async làm re-render) mà consumer chỉ cần "lần dựng CUỐI" → debounce tín hiệu ready ở phía CONSUMER,** đừng bắt component tự đoán lần nào là cuối (nó không biết): PrintJobPage debounce 1.2s sau mỗi `onReady` — btvn/giao_trinh_buoi dựng 2-3 lần (scope + tên lớp async), bắn ready ngay lần đầu là worker in BẢN DỞ thiếu header "Lớp X ·".
- **⭐ Thư mục làm việc có thể ĐANG dùng CHUNG bởi >1 phiên Claude cùng lúc (nhiều session song song trên cùng máy) — trước khi `git checkout`/switch branch, LUÔN `git status` soi uncommitted của phiên KHÁC, đừng checkout/stash đè lên:** lộ ra khi merge 07-14 — `git checkout main` bị chính git chặn vì có thay đổi CHƯA COMMIT (staged/unstaged xen kẽ, biến động ngay trong lúc soi — dấu hiệu rõ có tiến trình khác đang ghi) nằm trên các file KHÔNG liên quan tới việc đang làm (`mastery.ts`, `thanhtich.ts`, `QuanLyLevelScreen.tsx`…) — git tự chặn checkout đã cứu 1 lần, không phải luôn được vậy. Cách an toàn: `git commit -- <path riêng của mình>` (commit đúng path, KHÔNG đụng index của phiên khác) rồi `git worktree add <dir> main` tách hẳn 1 thư mục riêng để merge/push vào nhánh khác — khỏi phải checkout ngay trong thư mục đang có người/phiên khác dùng.
- **⭐⭐ Ingest ảnh AI (Gemini): gộp NHIỀU ảnh/1 lệnh giúp né MAX_TOKENS nhưng HẠI ĐỘ CHÍNH XÁC cropping/câu-attribution — mỗi câu 1 hình thì LUÔN 1-ảnh-1-lệnh (07-14, Nhập đề thi):** NhapKhoScreen (tỉ lệ tốt) luôn render+gửi ĐÚNG 1 trang/1 ảnh/1 lệnh Gemini; DeThiScreen batch nhiều trang/1 lệnh (fix MAX_TOKENS trước đó) vô tình bắt AI vừa định bounding-box vừa gán câu-nào-thuộc-ảnh-nào CÙNG LÚC trên nhiều ảnh → tệ hơn hẳn, không chỉ hình mà cả đáp án/loại câu. Quy tắc rút ra: batch nhiều trang CHỈ an toàn khi KHÔNG cần cắt hình chính xác (text thuần); có hình → luôn 1-ảnh-1-lệnh dù phải gọi API nhiều lần hơn.
- **⭐⭐ Ingest theo TỪNG TRANG RIÊNG LẺ (không nhớ trang trước) sẽ BỊA CÂU MỚI khi 1 câu thật có lời giải tràn qua nhiều trang (07-14, Nhập đề thi, bug CHƯA fix xong):** đề thi chuẩn 22 câu thật nhưng lời giải chi tiết dài 2-3 trang/câu (đặc biệt Đúng-Sai/TLN) → trang chỉ chứa PHẦN TIẾP lời giải (không có "Câu N:" mới) vẫn bị AI hiểu lầm/bịa thành câu mới vì mỗi lệnh Gemini không biết gì về lượt trước đã bóc đến đâu — 22 câu thật nhân ảo lên 137-150. Hướng fix đúng: truyền state "câu cuối cùng đã bóc (stt+phần)" xuyên các lượt vào prompt, dạy AI "trang không thấy nhãn câu mới → trả mảng rỗng, đừng bịa" — CHƯA triển khai xong, xem DEVLOG 07-14 mục cuối.
- **⭐ Có test file thật, ĐỪNG tự suy diễn cấu trúc tài liệu — hỏi thẳng người biết hoặc đọc RAW TEXT gốc (pdfjs `getTextContent`, không qua Gemini) trước khi kết luận "bug ở đâu" (07-14):** lần đầu tưởng file test là "nhiều đề mini nối tiếp" (dựa vào pattern số câu reset lặp lại nhiều lần trong kết quả AI trả) — Thùy sửa thẳng "t up file cấu trúc chuẩn cơ mà", và đọc lại raw text mới lộ nguyên nhân thật (lời giải tràn trang, không phải nhiều đề). Kết quả AI trả về (dù đã qua parse) vẫn có thể là ảo/bịa — muốn chẩn đoán đúng root cause phải đối chiếu với NGUỒN GỐC (raw text/hình gốc), không suy diễn từ output của chính hệ thống đang nghi có bug.
- **⭐⭐ "Chuyển nhà" (dựng lại 1 luồng theo khuôn luồng khác) BAO GỒM dời cả ĐIỂM VÀO (nav/entry-point), không chỉ nội bộ luồng — CEO không cần nói lại điều đã ngụ ý trong chính từ đó (Kho Hình 08-08):** dựng xong `TaiLieuBuilder`/`TrichPanel`-khuôn-Đại cho Hình đầy đủ nhưng vẫn để entry point chôn trong rail cũ của Kho Hình → Thùy phải nói lại "thì t bảo làm luôn ở chỗ đấy mà". Khi CEO dùng động từ ngụ ý DI CHUYỂN CẢ CẤU TRÚC ("chuyển nhà", "dọn sang", "y hệt bên kia") — mặc định phạm vi gồm cả nơi người dùng BƯỚC VÀO tính năng, đừng thu hẹp về "sao chép logic bên trong" rồi chờ hỏi thêm.
- **⭐ Copy layout/số liệu (max-width, px cột, breakpoint…) từ màn khác PHẢI tự hỏi "số này đo theo HÌNH DẠNG NỘI DUNG nào", đừng dán nguyên xi vì "trông giống" (lặp lại 3 lần trong 1 phiên — Kho Hình 08-08):** `max-w-[860px]` đúng cho layout 1-cột của `TaiLieuBuilder` nhưng bóp chết layout 3-cột của Hình; 2 cột biên 240/220px đúng tỉ lệ cho "mục lục lớn" nơi khác nhưng quá to cho "mục lục bé" Hình cần; header/dòng-kẻ/vị-trí-hiện-hình copy sai vị trí UI dù đúng Ý TƯỞNG. Dấu hiệu chung: bug KHÔNG BÁO LỖI, chỉ "trông sai" — chỉ lộ qua ảnh chụp CEO gửi, không lộ qua tsc/build. Trước khi dán số/pattern từ file khác, tự hỏi 1 câu: "bối cảnh sinh ra con số NÀY có giống bối cảnh mình đang áp không."
- **⭐ "Header" (và các từ tương tự có NHIỀU TẦNG RENDER riêng biệt cùng tên) — sửa 1 tầng rồi báo xong dễ bị CEO bắt lại "vẫn còn cái cũ" (Kho Hình 08-08, lặp lại lỗi đã ghi ở §759 dạng khác):** ít nhất 2 khái niệm "header" hoàn toàn tách biệt về code lẫn hành vi — masthead NỘI DUNG (xuất hiện 1 lần đầu tài liệu, sửa ở component chính) vs header PAGE-CHROME (chạy lặp mọi trang qua `pageChrome`/CSS `::before`, điều khiển bởi 1 flag riêng `ch.header`). Sửa xong tầng 1, verify UI thấy đổi → dễ báo "xong" trong khi tầng 2 vẫn dùng default cũ (`ch` truyền rỗng ⇒ ngầm định `head:true`). Trước khi báo "đã đổi X" cho bất kỳ khái niệm đa-tầng nào (header/footer/watermark…), liệt kê HẾT các nguồn sinh ra nó rồi xác nhận từng nguồn, không chỉ nguồn vừa động tay.
- **⭐⭐ 1 cột (`mon`) phục vụ ĐỒNG THỜI 2 mục đích xung đột (RBAC/billing cần GIÁ TRỊ CỐ ĐỊNH vs content-dispatch cần PHÂN BIỆT thêm) — đừng ép giá trị mới vào cột đó, TÁCH THÊM 1 CỘT CHIỀU KHÁC (Hình giải tích 08-08, áp dụng "Chiều MÔN §1.6" cho ca khó hơn KHTN):** KHTN dùng `tai_lieu.mon='KHTN'` làm khoá dispatch kho ĐƯỢC vì KHTN cũng là 1 mon RBAC hợp lệ — nhưng "Hình giải tích" KHÔNG PHẢI 1 môn mới, nó là 1 NHÁNH bên trong mon='Toán' (RBAC/billing/`lop.mon` đều cần thấy 'Toán' y hệt Đại). Nếu dùng `mon` để phân biệt sẽ phá §1.6 symmetry test ở MỌI nơi khác dùng `mon` (billing, RBAC scope④, `lop.mon`). Giải đúng: thêm cột `nhanh` (nullable, default = hành vi cũ) làm chiều dispatch RIÊNG, độc lập `mon`. **Quy tắc tổng quát: khi 1 field vừa là khoá NGHIỆP VỤ ổn định (không được đổi ý nghĩa) vừa cần thêm 1 chiều PHÂN LOẠI NỘI DUNG mới — đừng ép 2 việc vào 1 cột, tách cột mới cho chiều mới, giữ field gốc nguyên nghĩa cho MỌI consumer khác của nó.**

---

### Bài học 08–09/09 — form câu, sinh bằng máy, quét kho
- **⭐ Distractor phải là KẾT QUẢ THẬT của một đường sai có tên, không phải số bịa.** HS chọn nó = tự khai lỗi với độ chắc 100% (§1.5) —
  đó là lợi ích thật duy nhất của MCQ so với trả lời ngắn. Distractor ngẫu nhiên là tệ nhất cả hai phía.
- **⭐ Verify "≠ đáp án" phải so GIÁ TRỊ sau chuẩn hoá, không so chuỗi.** `4/8`, `1/2`, `0,5`, `-a/b`, `a/-b` là MỘT đáp án; so chuỗi ⇒
  HS làm đúng bị chấm sai. `parseHuuTi` (BigInt, tối giản, tập nghiệm sắp) là nhân chứng thứ hai độc lập với AI.
- **⭐ Đáp án máy PHẢI khớp đáp số kho mới được sinh gì lên câu đó** — lệch thì bỏ, KHÔNG đoán. Chính cái "lệch" đó phát hiện 2 đáp số
  kho sai (đều câu gốc do người nhập, không phải clone).
- **⭐ Máy quét toàn kho không phải một lệnh — là chương trình theo dạng.** Lần quét đầu 627 "lệch" phần lớn BÁO GIẢ (toán có lời,
  đặt tính, làm tròn, quy đồng, lớp 6 dấu chấm = nhân). Phải whitelist dạng "đáp số = giá trị biểu thức" rồi mới tin số.
- **Cờ duyệt mà không có chỗ nào LỌC theo nó = cờ trang trí.** `da_duyet` 60/17.743 và 0 chỗ chọn câu lọc ⇒ "vào kho chuẩn" phải định
  nghĩa bằng hàm SQL mọi nơi cùng gọi, không phải bằng cột.
- **Luật hình thức phương án đúng là "không được là cái duy nhất khác kiểu", không phải "cả 4 cùng kiểu"** — cứng quá thì câu đáp số
  nguyên/0/1 đói distractor (bỏ 5 câu lô 1 oan).
- **Biến thể "đổi số" trong kho hình KHÔNG cùng cấu trúc câu văn với bài gốc** (gộp/tách bước, đổi thứ tự tên góc) ⇒ áp khuôn chỉ ăn
  ~15%. Muốn tự động phải chuẩn hoá lời giải biến thể theo gốc ở cửa 1, hoặc chấp nhận đề xuất tay từng bài.
- **Bản HS thấy phải được CẮT key ở SERVER** (`_dien_buoc_hs`), không "lược trường dung" rồi chép nguyên lời giải — bản đầu lộ đáp án
  ngay trong câu văn. Kiểm bằng script: bản HS không chứa dap_an/key/dung.
- **Return sớm trong component React phải nằm SAU mọi hook** (`LamTuLuyen`: `if (dienO) return …` đặt trước `useState` khác = đổi số
  hook giữa 2 lần render).
- **`format('%I', NULL)` trong Postgres NỔ** ("null values cannot be formatted as an SQL identifier") — guard bằng `case when … is null`
  trước khi `format`. `jsonb -> bigint` (cột `ordinality`) cũng nổ, ép `::int`.
- **Nhiều phiên trên 1 DB: `npm run migrate` áp MỌI file treo, `--baseline <f>` đánh dấu "tới và gồm"** ⇒ cả hai đều đụng file của
  phiên khác (2 lần trong 1 ngày). Luôn `--status` trước; có file lạ thì `--only <file>`.
- **HTML gửi CEO xem trong app phải tự chứa**: trình xem chặn script CDN và ảnh ngoài ⇒ KaTeX render trong node, font base64, ảnh data URI.
  Ba bảng duyệt đầu (488 form, 61 câu docx) CEO không thấy công thức vì lý do này.
- **Docx MathType = ảnh WMF**, không có công thức trong XML; đọc bằng mắt sau khi render qua `System.Drawing` (PowerShell), biến lặp
  `$s`/`$S` trong PowerShell là MỘT (không phân biệt hoa thường) — vòng `for ($s…)` đè mất `$S`.


### Bài học 12/08 — đọc dữ liệu & viết tài liệu

- **⭐⭐ CẤM SUY TỪ DỮ LIỆU VẮNG MẶT — dẫm 3 lần trong 1 ngày, cả 3 đều tự tin và đều sai.**
  ① `viec` đủ cột đẹp ⇒ tưởng mảng học liệu được đo tốt (thật ra **15 dòng, cả 15 đứng ở `moi_giao`**).
  ② không có `bai_test` ⇒ tưởng buổi không có ET (thật ra `bai_test` chỉ là luồng **ONLINE**; **331/445
  buổi đã đóng ET**). ③ đợt đuổi có 0 dạng ⇒ tưởng kẹt (thật ra **29/34 đợt HOÀN THÀNH cũng 0 dạng**).
  **Luật:** trước khi kết luận "X không xảy ra", phải chỉ ra **cột nào ghi nhận X KHI NÓ XẢY RA** và xác
  nhận cột đó có dữ liệu. **Và luôn đối chiếu nhóm ĐÃ THÀNH CÔNG trước khi gọi một trạng thái là bất thường.**
- **⭐ Cột đầy đủ ≠ có dữ liệu.** Schema đẹp không nói gì về việc có ai dùng. Luôn `count(*)` + `max(ngày)`
  trước khi chọn một mảng để xây gì lên trên.
- **⭐ `must-exist` chưa bao giờ được ghi vào hệ.** CLAUDE.md §4 định nghĩa task = must-exist − does-exist;
  vế does-exist làm rất tốt, vế must-exist thì **đóng cứng trong code** ("mọi buổi thường cần đủ 4 khâu").
  Chỉ MT có guard thật (`mtKeys`). Thêm khâu/việc mới thì phải hỏi **"lấy đâu ra bằng chứng việc này
  ĐÁNG LẼ phải xảy ra?"** trước.
- **⭐ Thiếu vế thứ hai: hệ KHÔNG ghi nhận được "CỐ TÌNH BỎ QUA".** Rà soát 12/08 cho thấy 12/13 mục
  `ingame` là CEO **chủ động không làm** — không phải quên, không phải lỗi code. Nhưng hệ chỉ có
  "đã đóng" / "chưa đóng", nên **bỏ-có-chủ-ý và quên trông y hệt nhau**, và task treo vĩnh viễn.
  ⇒ Task pure-derive cần **ba** trạng thái chứ không phải hai: *chưa làm* · *đã làm* · **_không cần_
  (có người quyết, có dấu vết ai/khi nào)*. Thiếu trạng thái thứ ba thì mọi thống kê tồn đọng đều lẫn.
- **⭐ Ngưỡng phải RÚT TỪ HÀNH VI THẬT, không đặt tay.** Đo phân phối của nhóm đã hoàn thành rồi so.
  Ngưỡng rút từ dữ liệu thì cãi lại được; ngưỡng bịa thì không. Kèm cảnh báo **thiên lệch kẻ sống sót**:
  cohort hoàn thành thiên về ca DỄ ⇒ p75/p90 là cận dưới; riêng "vượt mốc lâu nhất từng hoàn thành" thì vững.
- **⭐ Ground truth phải do CHÍNH người dò kiểm được — tiêu chí này ĐỨNG TRÊN "dữ liệu sạch".**
  Đã chọn sai một lần: lấy chuỗi bổ trợ đuổi (data sạch nhất) làm pilot cho người **không quản mảng đó**
  ⇒ CEO bác đúng. Dữ liệu sạch mà không ai xác nhận nổi đúng/sai thì hiệu chuẩn = 0.
- **⭐ Dữ liệu không chứa câu trả lời thì đừng gọi model.** Lượt 1 cố ý KHÔNG dùng AI: hệ không biết lớp
  nào bắt buộc làm khâu nào, nên mọi suy luận trên đó — của người hay máy — đều là đoán. Người phân xử
  trước, và **phán quyết đó CHÍNH LÀ dữ liệu đang thiếu**. §10 "dò lỗ hổng dữ liệu" = **THU ĐƯỢC** cái
  thiếu, không phải phát hiện ra là thiếu.
- **⭐ Hệ tự sinh trạng thái thay người thì PHẢI đánh dấu ở cột riêng.** `giaoviec_housekeeping()` tự đóng
  việc thành `'dat'` chất lượng 100 — trước 12/08 chỉ phân biệt bằng chuỗi trong text tự do. DB **khẳng
  định một điều sai** còn nguy hơn DB thiếu dữ liệu: không có chỗ nào để khai "không biết".
- **⭐ ĐỪNG BACKDATE để "làm đẹp" dữ liệu.** Ghi lùi ngày = bịa lịch sử, vi phạm §1.5 ("cấm insert trước
  điền sau"), xoá mất tín hiệu *treo bao lâu*, và nội dung bịa (`nhan_xet`/`muc`/`hoan_thanh_pct`) chảy
  thẳng vào mastery/Elo ⇒ hỏng tầng Measurement. Thay bằng **kẻ ĐƯỜNG NGÀY**: từ ngày D mới bắt buộc,
  trước D giữ nguyên + đánh dấu "chưa có luật".
- **⭐ Tài liệu có ví dụ copy-paste-được thì ví dụ đó LÀ CODE.** Dòng mẫu `set DATABASE_URL_RW=postgresql://...
  && npm run migrate` khiến cmd gán cả dấu cách trước `&&` ⇒ host `"... "` ⇒ ENOTFOUND, mà `.env` thì
  đúng hoàn toàn nên cực khó lần. Placeholder phải **sai rõ ràng** (`USER:PASS@HOST`), đừng **mơ hồ hợp lệ**.
- **⭐ Biến môi trường đè file cấu hình ⇒ lỗi PHẢI khai NGUỒN.** Biến sống hết phiên terminal nên chạy lại
  bao nhiêu lần cũng hỏng y hệt — trông như lỗi mạng. Cùng lớp lỗi với `housekeeping()` chạy-theo-người-
  mở-màn: **hai bên nhìn hai thực tại khác nhau mà không ai phát hiện ra.** Nghi ngờ đầu tiên khi
  "file cấu hình đúng mà vẫn hỏng".
- **Một dòng tài liệu nói "an toàn cứng" mà không ai verify thì NGUY HƠN không có dòng nào** — nó khiến
  cả người lẫn Claude tưởng có rào. (CLAUDE.md §2.1 nói `claude_ro` chỉ SELECT suốt nhiều tháng, thực tế
  là `claude_build` ghi được và sở hữu 121 bảng.)

### Bài học 12/08 (phần 2) — dựng sản phẩm & bẫy kỹ thuật

- **⭐⭐ SẢN PHẨM LÀ "ĐỌC-HỘ-VÀ-KẾT-LUẬN", không phải thêm một màn hiển thị.** Doc §1: *"ERP đã hiển thị đủ dữ liệu, người quá tải
  không tự tổng hợp nổi"*. 12/08 CEO nghĩ đường tới đó là HỎI ĐƯỢC; **29/09 CEO chốt lại: BÁO CÁO là chính, hỏi là phụ** — báo cáo đủ thì không cần hỏi.
  Điểm chung của cả hai lần: một danh sách đổ ra là vô dụng; phải có **con số kết luận + của ai + so với mức thường đạt**, chi tiết để sau nút bấm.
- **⭐ CHO NGƯỜI QUYẾT rẻ hơn nhiều so với CỐ HIỂU TRƯỚC.** Cả buổi kẹt ở "chưa biết must-exist nên không dám
  nhắc" → đâm đi kiểm toán 125 bảng. Ba nút Làm/Huỷ/Gác gỡ sạch: **nhắc sai thì bấm Huỷ, luật lộ ra từ các
  lần bấm.** Đúng vòng lặp doc §11 — nhắc trước, người quyết, dữ liệu tự đầy dần. Claude làm NGƯỢC.
- **⭐ HỎI TIÊU CHÍ NGHIỆM THU TRƯỚC KHI XÂY.** CEO phải nói ba lần mới ra đúng thứ cần ("nhắc việc hàng ngày"
  → "phải hỏi được" → "hôm nay = deadline hôm nay thôi, không phải nợ"). Mỗi vòng Claude đều xây thêm rồi
  phải bỏ. **Câu "làm xong thì nó trả lời được câu gì?" đáng hỏi từ đầu.**
- **⭐ StrictMode + ref-cleanup = giao diện treo VĨNH VIỄN.** Cleanup đặt cờ `true` mà THÂN effect không reset
  về `false` ⇒ vòng mount-unmount-mount của StrictMode (bật ở `main.tsx`) để cờ đứng nguyên `true` ⇒ mọi vòng
  lặp gác theo cờ đó không chạy nổi một vòng. Triệu chứng: server trả lời xong trong 14s, UI đứng ở "đang
  tải…" mãi mãi. **Luôn reset cờ trong THÂN effect, không chỉ set ở cleanup.**
- **⭐ Lỗi cấu hình phải nổ lúc BẬT, không nổ lúc DÙNG.** Worker thiếu key vẫn khởi động im ru; người dùng hỏi
  một câu rồi ngồi chờ, job chết trong 0 giây. `danhgia.mjs` có bước kiểm key lúc bật, bản đầu `troly.mjs`
  quên. **Mọi worker gọi API ngoài PHẢI tự kiểm key ngay khi khởi động.**
- **⭐ Retry mà không đếm = vòng lặp VÔ HẠN có tính tiền.** Nhánh thử-lại đọc cột `so_lan` mà bảng chưa có ⇒
  điều kiện bỏ cuộc không bao giờ đúng. **Mọi cơ chế retry phải ghi số lần vào DB, không giữ trong bộ nhớ.**
- **⭐ Ví dụ copy-paste-được trong tài liệu LÀ CODE.** Dòng mẫu nối `&& npm run migrate` cùng dòng `set` khiến
  cmd gán cả dấu cách vào biến ⇒ host `"... "` ⇒ ENOTFOUND, mà `.env` đúng hoàn toàn nên cực khó lần.
  Placeholder phải **sai rõ ràng** (`USER:PASS@HOST`), đừng **mơ hồ hợp lệ**.
- **⭐ Biến môi trường đè file cấu hình ⇒ lỗi PHẢI khai NGUỒN.** Biến sống hết phiên terminal nên chạy lại bao
  nhiêu lần cũng hỏng y hệt — trông như lỗi mạng. Cùng lớp lỗi với `housekeeping()` chạy-theo-người-mở-màn:
  **hai bên nhìn hai thực tại khác nhau mà không ai phát hiện ra.**
- **⭐ ORACLE ẨU CÒN NGUY HƠN KHÔNG CÓ ORACLE.** Claude viết query kiểm vội (`tuổi > 1`) rồi kết luận model sai
  ở "30/31", suýt đi sửa một tầng đang chạy ĐÚNG (bảng sạch tính theo deadline THẬT — 30 mới đúng).
  **Bản kiểm phải dùng ĐÚNG định nghĩa của bản được kiểm, nếu không nó chỉ đo sự khác nhau giữa hai định nghĩa.**

- **⭐ Custom element trong React 18: `className` KHÔNG thành `class`.** `<math-field className="…">` không nhận class ⇒
  CSS `::part()` không áp. Gán tay `el.classList.add` trong effect. Áp cho mọi web component nhúng React.
- **⭐ Chặn phím ở tầng nào thì kiểm tầng đó, và lọc `isTrusted`.** Chỉ chặn `keydown` thì text qua `input`/IME/dán vẫn lọt;
  chặn thêm `beforeinput` thì MathLive **tự phát `beforeinput` GIẢ** (isTrusted=false, data = LaTeX) mỗi lần `insert()` —
  handler nuốt luôn mẫu. Sự kiện tổng hợp của thư viện và sự kiện người gõ đi chung một cửa.
- **Mode chữ/toán của MathLive là trạng thái ẩn:** đang trong `\text{}` mà `insert()` LaTeX thì bị nhét như chữ thường;
  ô trống trong `\text{}` vẫn ở mode toán (mất `\text`, mất khoảng trắng). Trước mỗi lần chèn mẫu **ép về mode toán**, mẫu
  Văn bản **ép sang mode chữ**, Tab hết ô thì trả về toán.
- **Trả focus sau khi gỡ web component: `setTimeout`, không chỉ rAF** — MathLive dọn focus async, focus sớm bị cướp về body.
- **Mẫu LaTeX ghép với chữ gõ vào phải có khoảng trắng sau lệnh:** `\int#?` điền `x` thành `\intx` (lệnh lạ). Test mẫu theo
  4 ca (nút · ô trống · đã điền · lưu còn ô trống), không chỉ 1.
- **⭐ MathLive: `captureSelection=true` = vô hình với CHUỘT (08/09).** `Atom.bind()` không cấp `data-atom-id` cho atom con
  dưới cha `captureSelection`; `nearestAtomFromPoint` chỉ xét atom có id ⇒ click vào chữ dưới `\widehat{…}` rơi ra SAU cả
  khối, Backspace xoá nguyên ký hiệu — mà PHÍM ←/→ vẫn vào được nên tưởng "đúng". Fix ngọn (tìm glyph ▢) chỉ cứu 1 ca;
  fix gốc = tắt cờ trên prototype. Nâng MathLive thì đo lại đúng thao tác "click A trong góc A1 → Backspace → gõ B".
- **⭐ KaTeX `\widehat`: cỡ mũ chọn theo SỐ PHẦN TỬ trong thân, không theo bề rộng.** 1 chữ → cỡ nhỏ nhất, lệch phải theo
  italic. `\widehat{{}A{}}` (2 nhóm rỗng) lên cỡ 2, phủ đúng chữ, không thêm khoảng trắng — chỉ làm lúc render, không lưu.
  Và chỉ số phải đứng NGOÀI dấu mũ (`\widehat{A}_2`) — trong thân thì mũ căn theo cả "A₂".
- **⭐ Copy từ vùng KaTeX render: Chrome serialize `.vlist-t/.vlist-r` (table) thành xuống dòng/tab GIỮA các mảnh** — trim
  `\n` đầu/cuối không cứu được. Cách đúng = copy-tex: gắn `data-latex` lúc render, listener `copy` thay bằng `$…$`.
- **⭐ Ô trống của cụm là `#?`, còn ô trống MathLive lưu ra là `{}`** — hai thứ khác nhau, đường tạo cụm qua bảng dựng phải
  chuẩn hoá `{}` → `#?`, không thì mọi "cụm có ô trống" tạo bằng UI đều câm (không nhận tham số, chèn ra rỗng).
- **⭐ Verify trong Browser pane khi cửa sổ Claude bị che (08/09, mất ~30'):** tab không vẽ ⇒ `requestAnimationFrame` không
  chạy (MathLive/React render qua rAF ⇒ DOM CŨ, mọi phép đo bounds/ids sai), screenshot timeout, ~5' sau Chrome ép
  `setTimeout` 1 lần/phút (script `await` treo). Làm được: ghi đè `requestAnimationFrame = cb => cb(now)`, script KHÔNG await
  dài, click bằng `PointerEvent` (`composed:true`) dispatch lên `shadowRoot.elementFromPoint`, Backspace phải là
  `KeyboardEvent` có `code:'Backspace'` lên `.ML__keyboard-sink` (`computer.key` gửi `code=''`, MathLive so theo `code`).
  `innerWidth` = 0 lúc này — bề rộng layout không đo được.
- **Bash tool trên máy này ăn 1 lớp backslash trong heredoc + nhiều file là CRLF** — patch nhiều dòng bằng node/sed
  không khớp im lặng; sửa file bằng Edit tool. `git add -p` không có: tách phần DEVLOG của mình khỏi phần phiên khác
  đang viết dở bằng `awk` cắt tới heading lạ → `git hash-object -w --path` → `git update-index --cacheinfo`.
- **`npm run migrate` áp MỌI file treo, kể cả của phiên khác** — có file lạ thì `--only <file>`; đã lỡ áp
  `202609080246_khao_sat…` (không phá gì) vì quên.
- **⭐⭐ Vercel 1 repo × 8 project = TRẦN BUILD DÙNG CHUNG CẢ TÀI KHOẢN (Hobby: 100/ngày), không phải riêng
  từng project — cắn 07/09, 2 LẦN TRONG CÙNG 1 NGÀY.** Lần 1: chưa có `ignoreCommand` ⇒ mỗi push build cả
  8 project ⇒ ~15 push/ngày × 8 = vượt trần ⇒ Vercel lặng lẽ chặn 7/8 project ("Deployment rate limited —
  retry in 24 hours") — **không hiện lỗi gì trong Deployments**, chỉ đơn giản NGỪNG tạo deployment mới cho
  project đó dù `main` vẫn nhận commit đều. Dấu hiệu nhận biết: so commit mới nhất trong Deployments với
  `git log` HEAD — thấy khoảng trống nhiều commit/nhiều giờ là đủ kết luận, ĐỪNG đợi thấy dòng "Error".
  Đã sửa (`vercel.json.ignoreCommand = scripts/vercel-ignore.mjs`): mỗi push chỉ build project có file
  RIÊNG của nó đổi (file dùng chung như `src/lib`/`src/components`/`package.json` vẫn build cả 8).
  **Lần 2 (cùng ngày, ~3h sau, SUÝT bị hiểu nhầm là bug script):** dù đã có `ignoreCommand`, 2 project
  (TA lẫn OPS) đột nhiên NGỪNG nhận deployment y hệt kiểu lần 1 — ban đầu nghi sai do 2 commit TA "chỉ
  đụng đúng file riêng của nó vẫn không build" (tưởng bug diff/shallow-clone), commit rỗng ép trigger 2
  lần cũng im lặng luôn. Chỉ khi xác nhận **OPS — project khác hẳn — cũng bị y hệt cùng lúc** mới chốt
  đúng: `ignoreCommand` chỉ giảm SỐ PROJECT build MỖI PUSH (8→1), KHÔNG giảm SỐ LƯỢT PUSH — nhiều phiên
  Claude Code chạy song song, mỗi phiên tự push sau mỗi sửa nhỏ (kể cả phiên đang ghi bài học "gom commit"
  này cũng lỡ push riêng 2 lần cho 2 sửa nhỏ ngay buổi sáng cùng ngày) vẫn cộng đủ lượt để đụng trần lại,
  dù mỗi push nhẹ hơn. **Luật chẩn đoán: khi 1 project "im lặng không build", luôn kiểm project KHÁC có
  bị y hệt không TRƯỚC khi nghi ngờ code/script riêng của project đó** — bị 1 project = có thể là bug
  local; bị ≥2 project không liên quan cùng lúc = gần như chắc chắn trần tài khoản, không phải bug.
  **Không có cách sửa CODE nào chặn được lần tái diễn** — chỉ NGỪNG PUSH một lúc (quan sát: lần 1 tự
  thông lại sau ~7-8h, có vẻ cửa sổ trượt theo giờ chứ không phải khoá cứng 24h lịch) hoặc NÂNG GÓI Vercel.
  **Quy tắc thật (không phải chỉ "gom commit của 1 phiên"):** khi NHIỀU phiên cùng làm việc trên 1 repo
  Vercel-8-project trong cùng khung giờ, tổng lượt push của TẤT CẢ phiên cộng lại mới là con số so với
  trần — 1 phiên tự kỷ luật gom commit không đủ nếu các phiên khác vẫn push dồn dập song song.

### Bài học 08/09 — kho chuẩn & làm việc song song 2 phiên
- **Cờ duyệt mà không chỗ nào lọc = cờ trang trí.** `da_duyet` có 60/17.743 câu ký và 0 chỗ chọn câu lọc theo nó suốt 3 tuần.
  Sửa bằng ĐỊNH NGHĨA (1 hàm SQL + cột generated để PostgREST lọc được), rồi grep TỪNG chỗ chọn câu để cắm — chọn ≠ resolve: chỗ
  resolve câu đã nằm trong tài liệu KHÔNG lọc, nếu không câu bị rút làm ET cũ không lưu được (cùng luật kho rác 07-21).
- **Máy kiểm đáp số: whitelist theo BẢN CHẤT DẠNG, không theo thống kê lệch.** "Đáp số = giá trị biểu thức" thì máy đúng gần
  tuyệt đối (17/1.696 lệch đều là kho sai thật); dạng lệch 27% (`T105040204`) vẫn vào whitelist vì máy đúng — kho sai hàng loạt là
  chuyện của kho. Ngược lại dạng máy "khớp" nhiều nhưng bản chất khác (đặt tính chia có dư, quy đồng ra cặp, đổi đơn vị) phải loại
  dù số đẹp. Lớp 6 viết nhân bằng dấu chấm — quy tắc parse theo DẠNG, không toàn cục.
- **Người ghi đè máy có điều kiện.** Người duyệt câu máy đã ký khớp mà không đổi đáp số ⇒ GIỮ `kiem_may_boi='mcq-auto'` — nếu
  ghi đè thành 'nguoi' thì mất mẫu để đo precision máy/AI ở mức C. Chỉ ghi đè khi người ĐỔI đáp số hoặc câu đang nghi/chưa kiểm.
- **Hàm `stable`/`immutable` không được tạo temp table** — Postgres nổ ngay lần gọi đầu "CREATE TABLE is not allowed in a non-volatile
  function". Bắt được trước khi lên màn nhờ **test RPC bằng JWT giả lập**: `select set_config('request.jwt.claims', '{"sub":…,
  "email":…}', true)` trong transaction rồi ROLLBACK — `la_thanh_vien()`/`jwt_uid()` chạy như user thật, DB không đổi. Dùng khuôn này
  cho mọi RPC security definer trước khi tin UI.
- **Generated STORED column không tính lại khi đổi thân hàm.** Đổi thân mà kết quả y hệt (gom literal vào `_kho_ngay_bat()`) thì
  không sao; đổi NGHĨA (bước 6) thì phải DROP/ADD lại cột — ghi thẳng vào comment migration để người sau không quên.
- **2 phiên song song trên 1 repo + 1 DB:** mở worktree (`EnterWorktree`), copy `.env`/`.env.local`, junction `node_modules`; file
  UNTRACKED ở thư mục chính không tự sang (spec, script mới) — copy tay; `npm run migrate` áp luôn file treo của phiên kia ⇒ **chỉ
  `--only <file>`**. Preview tool chỉ đọc `.claude/launch.json` THƯ MỤC CHÍNH và phiên worktree không sửa được file đó ⇒ chạy vite nền
  `npm run dev -- --port 5191 --host 127.0.0.1 --strictPort` rồi `preview_start {url}`; đăng nhập bằng nút dev account của `Login.tsx`
  (`VITE_DEV_ACCOUNTS` trong `.env.local`). 403 font KaTeX qua `@fs/` = junction ngoài root vite, không phải lỗi code.
- **Mức B: ký cả CỤM chỉ sau khi giải lại TỪNG câu — "cụm này sạch" là ảo giác.** Bỏ sót 4 câu T111040201 (B-38) và 7 câu
  T111010202 (B-29) đều do đọc lướt cụm cùng khuôn rồi mặc định khớp; lỗi khuôn MCQ (2 phương án đúng) chỉ lộ khi thử từng phương án.
  Gặp 1 câu lạ trong cụm ⇒ quay lại rà mọi câu cùng khuôn đã ký. `lo-txt` cắt lời giải 250 ký tự — nghi thì đọc FULL lời giải
  (số cuối lời giải ≠ đáp án là loại lỗi phổ biến nhất K11/K12).
- **Quét lô phải đóng đinh tập câu theo MỐC THỜI GIAN, không theo "cái gì đang null".** Kho SỐNG (2 phiên ghi cùng lúc): 126 câu
  mới tạo trong lúc quét bị ký nhầm vì `--list` chọn theo `kiem_may is null`.
- **Sidebar "không hiện" trong accessibility tree nhưng screenshot có** — tree của Browser pane có thể stale sau login; tin screenshot,
  hoặc click bằng `javascript_tool` theo text khi ref trả toạ độ âm.
### Bài học 08–09/09 — hạ tầng đa phiên & deploy
- **`npm run migrate` của phiên khác quét cả file migration ĐANG VIẾT DỞ của mình.** `new-migration` tạo file template rỗng trước; phiên MCQ chạy `npm run migrate` ⇒ sổ `_migrations` ghi "đã áp" với vân tay của template, DB không có bảng, `--status` báo sạch. Rule: làm song song thì viết xong SQL rồi mới tạo file (hoặc đổi tên file lúc xong), và **không chạy `npm run migrate` trần** khi biết có phiên khác đang có file treo — áp đúng file mình. Sửa sổ: update `bam` trong CÙNG transaction với SQL thật.
- **Prod báo "Invalid API key"** = key nướng trong bundle sai. Đừng đoán: tải `assets/*.js` đang chạy, grep key, so với `.env.local` **từng ký tự** (09/09: thừa đúng 1 chữ "W" cuối key trên Vercel). Vite nướng env lúc build ⇒ sửa env xong PHẢI Redeploy.
- **Commit của mình chỉ chứa hunk của mình** khi nhiều phiên cùng sửa `package.json`/`launch.json`: dựng blob từ `git show HEAD:file` + đúng dòng mình thêm rồi `git update-index --cacheinfo`, không `git add` cả file. "commit đi" của CEO = commit + push luôn (Vercel tắt auto-deploy).
- **Scale app riêng:** mỗi app một project Vercel (blast radius, rollback/env riêng); trần build/ngày là chuyện gói Hobby → lên Pro, không gộp project. Gộp chỉ cân nhắc cho tầng "công cụ/chiến dịch" khi ≥5 app, bằng rewrite theo host.
### Bài học 09/09 — BTVN ảnh xuyên 2 repo, tool vẽ, role RO
- **Bước 0 trước khi tin spec:** spec "tạo bảng btvn_nop/btvn_anh" hoá ra bảng + RPC + màn đã có từ 30/08; và audit repo PH bản
  CŨ cho kết luận "chưa có luồng nộp" sai hoàn toàn. Rule: grep repo TRƯỚC, và hỏi "bản này final chưa" trước khi audit repo khác.
- **Server action Next mặc định trần body 1MB (Vercel function 4.5MB)** — nộp ảnh qua FormData là chết với ảnh điện thoại thật.
  Ảnh đi thẳng client → storage bằng signed upload URL; action chỉ nhận mảng path rồi kiểm lại bằng `storage.list` (size/mimetype).
- **Tailwind v4: 2 utility cùng property trong 1 className thì thứ tự CSS quyết định** (`bg-white` đè `bg-emerald-600`) — màu
  mặc định đặt trong nhánh idle, không đặt tĩnh rồi "đè" bằng nhánh động (bug Đ/C/S mất chữ có từ 30/08).
- **Listener đăng ký với deps `[]` gọi hàm đóng state → state đọc trong đó phải qua ref** (Ctrl+Z ở trang 2 xoá mark trang 1).
- **Input mount trong `pointerdown`:** `mousedown` mặc định dời focus (canvas không focus được) → `e.preventDefault()` + `autoFocus`
  (đồng bộ lúc commit; `setTimeout` chậm hơn người gõ ngay) + bỏ qua blur <300ms.
- **Sau lưu phải có tín hiệu** ("✓ Đã lưu" 2.5s) — nút chỉ mờ đi thì CEO tưởng treo dù DB đã ghi.
- **Task engine = must-exist:** buổi có `mt_buoi` không sinh task BTVN (`where not b.co_mt`) → bài PH gán vào buổi MT là tàng hình
  với TA. Mọi "tự gán" phải kiểm cùng điều kiện với engine sinh task, nếu không dữ liệu rơi vào chỗ không ai thấy.
- **`pg.Pool` module-scope giữ chuỗi kết nối cũ** sau khi `.env.local` đổi — Next nạp lại env nhưng pool không; restart dev.
- **Key nhầm project cùng độ dài** (service key PH vs ERP đều 219 ký tự) — kiểm bằng claim `ref` trong JWT, không so độ dài.
- **Host `db.<ref>.supabase.co` chỉ IPv6** — dev Windows lẫn Vercel đều ENOTFOUND; luôn dùng pooler với user `role.<ref>`.
- **Automation trình duyệt:** phím "Return" của tool KHÔNG phải Enter (dùng "Enter"); `read_console_messages` trả log tích luỹ cả
  lỗi HMR trung gian → reload + tsc trước khi tin; `prompt()` thật bị tự đóng.
- **Test trên data thật:** đọc snapshot trước, chỉ đụng dòng test, không "Mở lại/Đóng" phase của lớp thật (đổi `btvn_dong_at` →
  dashboard TA "đóng muộn", EXP hoàn/thưởng lại); dọn lá→gốc theo danh sách đã gật, kiểm snapshot khớp sau dọn.
- **Deploy tay khi auto-deploy im:** kiểm bằng cách curl bundle prod grep chuỗi UI mới, không tin "đã push = đã lên".

### Bài học 09/09 tối — test đầu vào (luồng "biến mất im lặng")
- **"Chọn rồi phải bấm thêm nút mới lưu" = mất dữ liệu im lặng.** Dropdown chọn đề + nút "Gán đề" chỉ hiện sau khi chọn: người thao tác chọn → upload → Hoàn tất trong 51 giây, đề chưa từng tới DB, không lỗi nào hiện. Lựa chọn có 1 giá trị hợp lý mặc định (đề đang dùng) thì **tự gán**, chọn là lưu ngay; nút xác nhận riêng chỉ cho thao tác có hậu quả.
- **Gate "hoàn tất" phải đòi ĐỦ bằng chứng mà khâu SAU cần.** Hoàn tất chỉ đòi bài upload, còn Chấm cần đề ⇒ ca lọt qua rồi kẹt vĩnh viễn. Hỏi "khâu kế tiếp cần gì để chạy" trước khi viết điều kiện đóng.
- **Hàng đợi LỌC BỎ ≠ hàng đợi TRỐNG.** `.not('tai_lieu_id','is',null)` làm 5 ca thiếu đề biến mất khỏi mọi màn, kể cả màn có thể sửa nó. Đúng luật invariant §4: thiếu bằng chứng ⇒ **nổi lên thành việc** (card "chưa có đề → gán"), không lọc đi. Lọc theo ngày ("hoàn thành hôm nay") cũng là một dạng lọc bỏ.
- **Trigger log là nhân chứng tốt nhất khi người nói "tôi đã làm rồi".** `ca_test_log` ghi mọi UPDATE, đọc diff từng cột ra ngay đề chưa từng được set — không cần đoán, không cần cãi. Đầu tư trigger log cho entity vận hành trả lãi đúng lúc này.
- **"Nhãn" (`nguoi_cham_id`) không phải "việc".** Cột gán người tồn tại từ 14/08 nhưng không màn nào lọc theo nó và Việc của tôi không có card ⇒ với người dùng bằng không có. Thêm cột assign thì phải thêm luôn đường "việc của tôi" trong cùng lượt.
- **Snapshot thuộc tính phân loại lúc neo, đừng join live để tính báo cáo.** `nhanh`/`muc_do`/`ten_chuyen_de` ghi vào `ca_test_cau` lúc gán đề ⇒ hàm phiếu chỉ gom 2 bảng, không nhân đôi registry môn→bảng trong SQL, đề/dạng sửa sau không làm lệch phiếu cũ.
- **Hàng "không ở kho câu" (`HINH:<uuid>`) bị `layCauTheoThuTu` bỏ rơi không báo** — cùng họ với `.filter(Boolean)` nuốt tham chiếu chết. Mọi chỗ "resolve mã → nội dung" phải nói ra số hàng KHÔNG resolve được.

### Bài học 10–13/09 — test đầu vào: phiếu từ kit ChatGPT, form GV, phân công, asset
- **"Kit UI" của ChatGPT thường CHỈ là ảnh reference + DESIGN.md;** mục `assets/svg` ghi trong DESIGN có thể không
  tồn tại trong zip, và bản "gửi bù" có thể là 3 glyph 150 byte hoặc 1 **contact sheet** gộp mọi thứ trên nền tối
  có nhãn tên file. Kiểm zip TRƯỚC khi hứa "làm giống"; nói thẳng thiếu gì (liệt kê từng file, kích thước, trong
  suốt hay không) để CEO đòi tiếp — vector tự vẽ chỉ được "giống cấu trúc/màu", không giống raster.
- **PNG "trong suốt" của ChatGPT hay là ô caro NƯỚNG vào ảnh** (alpha 100%). Đo bằng pngjs (alpha<250 %, màu 4
  góc) trước khi dùng. Khử được nếu chủ thể có màu bão hoà (gold/xanh): gắn nhãn thành phần liên thông của pixel
  trung tính sáng, xoá thành phần chạm mép HOẶC lớn (lỗ tay cầm) — flood-fill từ mép thôi thì sót lỗ kín. Chủ thể
  có phần trắng (giấy, highlight) thì cắt hỏng ⇒ bỏ. PIL trên máy này hỏng ("unknown slot ID 85") — dùng `pngjs`.
- **html2canvas 1.4.1:** `<img>` SVG với width % ⇒ bỏ qua; SVG inline thì browser rasterize nguyên khối (filter/
  gradient OK) nhưng phải có `width/height` PX trên thẻ svg và **id gradient/filter RIÊNG** (2 svg cùng `id="navy"`
  ⇒ svg sau lấy nhầm def svg trước); SVG `<text>` + `dominantBaseline` lệch ⇒ đè chữ bằng div. Popup `about:blank`
  không resolve URL tương đối ⇒ fetch asset → data URL rồi split/join vào outerHTML; thiếu file ⇒ thay bằng pixel
  trong suốt. Vite dev không set CORS nên `useCORS` không cứu được.
- **Bash heredoc + python/regex có backslash = mất backslash 2 tầng.** Patch dài/ký tự đặc biệt: Write script ra
  file rồi chạy, hoặc dùng Edit; kiểm `grep` dòng kết quả trước khi tin.
- **Trước "làm giống y ảnh" phải chốt cái gì là DATA vs ĐỒ HOẠ.** Kit v2 hiện "4/5" nhưng CEO đã chốt 3 mức hôm
  trước rồi lại chốt 5 mức — hỏi lại đúng 3 câu (thang, paragraph, điểm) trước khi code, đừng đoán từ ảnh.
- **Donut/biểu đồ phải tô theo con số ở giữa.** Vẽ theo tỉ lệ số câu (như mockup) ⇒ ca toàn cơ bản ra vòng đầy
  100% dù giữa ghi 48% — CEO bắt ngay. Trực quan phải khớp số đọc được.
- **`new-migration` tạo file rỗng trước = mồi cho phiên khác áp nhầm** (đã ghi HANDOFF 08/09, vẫn cắn 13/09 sau
  đúng 60 giây). Cách sống chung: viết SQL xong mới tạo file, áp NGAY bằng `node scripts/migrate.mjs --only <file>`
  (đã có, tôi từng không biết); nếu bị áp rỗng ⇒ đổi tên timestamp mới + `--only`, dòng sổ mồ côi xoá khi CEO gật.
  `npm run migrate` trần còn kẹt ở file lỗi của người khác (`must be owner of function`) — không phải việc mình.
- **Gán mặc định = trigger BEFORE INSERT ở DB**, không phải client tra bảng rồi truyền — mọi đường tạo (ERP, app
  Ops, script) đều đúng, đường truyền tay vẫn thắng vì chỉ điền cột NULL. Verify bằng transaction ROLLBACK (insert
  giả → đọc → rollback), không cần tạo dữ liệu thật.
- **Form nhập của GV ≠ phiếu có ô nhập.** CEO: "Trả bài LÀ cái phiếu; màn đánh giá chỉ GẦN GIỐNG" — gộp 2 thứ làm
  phiếu xấu đi và form khó dùng. Tách: form riêng cùng phong cách + phiếu thật xem trước bên cạnh (scale theo màn).
- **Browser pane:** app full-reload mỗi khi phiên khác sửa file ⇒ modal đang mở bay mất giữa chuỗi thao tác; luôn
  guard `if(!document.querySelector('.z-\\[90\\]'))` rồi mở lại; click theo text dễ dính sidebar trùng tên ("Phân
  công" CORE TEAM) — lọc thêm class của tab. Screenshot hay timeout khi cửa sổ bị che, text check thay thế được.

### Bài học 10/09 tối — Claude nhập câu vào kho (HGT PT mặt phẳng)
- **⭐ Nguồn công thức MathType cũ = docx MÙ, phải dùng PDF vision.** DOCX Toán Tứ Tâm 2 MB có 758 `.wmf` (ảnh vector rời từ MathType 6/7 khi paste) + 0 OMML — pandoc chỉ trả text + `![](imageXX.wmf)`; Claude không đọc được nội dung công thức. Cùng file export PDF: Claude `Read pages=1-N` render vision đọc math sharp, extract LaTeX ổn định. Áp dụng cho MỌI tài liệu Toán VN trước ~2020 (thời MathType thống trị) — hỏi có PDF không, có thì dùng PDF; không thì export tay trước.
- **⭐ Kiểm HÌNH VẼ TRƯỚC bulk INSERT, không phải sau.** Bỏ qua `anh_de` cho câu có hình lập phương/tứ diện = HS đọc câu vẫn tưởng tượng được, nhưng LỜI GIẢI gốc ghi "Dựa vào hình vẽ" thành đứt logic. Pass đầu tách câu cũng phải grep pandoc md `![](image...png)` (PNG = hình vẽ, WMF = công thức) → nhận diện câu có ảnh → upload cùng lượt, không tách pha. Đặt vào `anh_de` (không `anh_dap_an`) khi HS cần thấy khi ĐỌC ĐỀ để định vị tên đỉnh — không phải sau khi làm xong.
- **⭐ `ma_cau` phải EXPLICIT theo convention `<dang><STT 3 số>` (`src/lib/kho/api.ts:447`), đừng để default `GC000001`.** Column default `('GC'||nextval)` là legacy — mọi câu thật đều dùng convention TS. STT = `MAX(ma_cau WHERE ma_cau LIKE '<dang>%')` + 1. FK `parent_ma_cau` + `hgt_cau_hoi_yeu_cau_giai.ma_cau` đều ON UPDATE CASCADE nên rename sau cũng an toàn (đã test) — nhưng vẫn nên đúng ngay từ đầu để CEO không phải sửa tay lúc duyệt.
- **⭐ Verify script phải in `duyet_at` để phân biệt "trigger tự set" vs "người bấm".** Sau UPDATE nếu thấy `da_duyet=true` bất ngờ, đọc `duyet_at`: đồng loạt cùng timestamp = trigger; rải rác vài giây/câu = CEO đang bấm duyệt SONG SONG (Claude làm việc trong lúc CEO mở màn duyệt). Đã suýt gọi bug oan 1 lần. Trigger `_kho_cau_duyet_nguon` thực chất chỉ trigger `BEFORE INSERT OR UPDATE OF da_duyet, duyet_nguon` — không chạm khi rename `ma_cau` hay set `anh_de`.
- **`dang_ai_de_xuat=dang_chinh` khi AI đề xuất, không NULL.** Spec `202609080938_kho_duyet_hop_nhat.sql` dùng cột này đo precision AI = count(ai=chính)/count(ai not null). Nếu bỏ NULL thì mất mọi câu AI nạp trong mẫu số ⇒ số precision không đo được. Người duyệt đổi `dang_chinh` khi sai; `dang_ai_de_xuat` giữ vết bản gốc.

### Bài học 28/09 (đêm) — hàm Postgres chậm do CTE bị inline + trần timeout của app
- **⭐⭐ plpgsql `return query with …` có CTE dùng trong subquery TƯƠNG QUAN (vd `(select … from dd where dd.hs = h.hs)` trong `case`) ⇒ planner có thể INLINE CTE vào subquery chạy cho TỪNG dòng ngoài.**
  `fn_thanh_tuu_thang` gọi `fn_mastery_cells` trong CTE ⇒ bị gọi lại hàng trăm lần: cả tháng 70s (lúc khác đo 4–7s — planner đổi kế hoạch, nên nút lúc chạy lúc không).
  Ép `as materialized (` cho mọi CTE ⇒ 2–4s, khối 9: 9,3s → 0,56s; kết quả cũ vs mới 0 dòng khác (EXCEPT 2 chiều). **Hàm đo lớn: mặc định `materialized`.**
- **⭐ `SET statement_timeout` gắn vào hàm (`create function … set statement_timeout`) KHÔNG vượt được trần của phiên** (đo bằng hàm `pg_temp` với trần 1s).
  Role `authenticated` = 8s, `anon` = 3s (`pg_roles.rolconfig`). Việc nặng gọi từ app ⇒ phải NHANH (hoặc chạy ngoài PostgREST), không nới trần được từ trong hàm.
- **⭐ Hàm nặng chạy INVOKER bị RLS `la_thanh_vien()` gắn lên từng dòng mọi bảng nó đọc** ⇒ đo bằng `claude_build` (bỏ qua RLS) luôn LẠC QUAN hơn app.
  Hàm batch của admin: `security definer` + cổng quyền ngay dòng đầu (`co_quyen_ghi('<leaf>')`) + `revoke … from public, anon`.
- **`claude_build` không `set role authenticated` được** ⇒ muốn thử dưới danh tính người dùng: `set_config('request.jwt.claims', '{"email":…}', true)` rồi gọi hàm
  (cổng `co_quyen_ghi` / `la_thanh_vien` đọc JWT) — thử cả người CÓ quyền lẫn KHÔNG quyền, trong transaction + ROLLBACK.

### Bài học 28/09 — thiết kế gamification HS với CEO (spec `spec-thanh-tuu-nhiem-vu.md`)
- **⭐⭐ Gami BK = GAME (cày cuốc, đua top), KHÔNG khung app học online** (Khan / Duolingo / nghiên cứu edu "chống leaderboard"). Thùy bác v1:
  *"Khan vẫn là online, BK là offline"*. Lấy **cơ chế** game, **không lấy tên** game (Liên Quân…) — HS sẽ bảo trung tâm copy.
- **⭐ Đừng tự thêm giá trị CEO không đặt:**
  - "Chống cày ảo" là t tự thêm → Thùy: *"cày càng nhiều càng ok"*.
  - "Trần theo chính em" để chặn bỏ lớp → Thùy: *"HS offline không được nghỉ"*.
  - Chuẩn hoá để so chung giữa môn → Thùy: *"mỗi môn riêng hoàn toàn"*.
- **⭐⭐ CEO thêm NGUYÊN TẮC ≠ đổi CẤU TRÚC đã chốt.** Thùy thêm "3 phương diện chăm chỉ / thành tích / tiến bộ" ⇒ t dựng lại thành 3 huy hiệu lớn
  (trái luôn H1 "mỗi dòng 5★" t tự bẻ để giảm mẫu bản cứng) ⇒ sai 2 lần.
  - Đúng: áp nguyên tắc **vào trong** cấu trúc cũ (10 loại, 5★/dòng). Phương diện là góc nhìn thiết kế, **không phải output**.
  - Muốn đổi điều đã chốt vì lý do vận hành thì **nêu ra và hỏi**.
- **⭐ Spec cho CEO: LOGIC trước, DETAIL sau, không trộn** (bảng số / catalog để danh sách "bàn sau").
  - **Phase 1 phải vừa phải:** đưa ~100 cấp huy hiệu ngay ⇒ *"nhiều quá bị ngợp"* ⇒ 6–8 cái.
  - Đưa quyết định dạng **bảng có đề xuất**, CEO trả lời theo mã (L1–L4, D1–D6, B-L…, H…).
- **⭐ Đặt bộ tên "theo gốc X" phải kiểm gốc tích TỪNG tên:**
  - Nữ Oa (thần thoại Trung Quốc) lọt vào bộ "Việt Nam".
  - Phoenix là chim thần thoại, không phải thần — vẫn hợp vì tiêu chí có "biểu tượng".
- **⭐⭐ Mô phỏng: ĐO phân bố thật THEO TỪNG HS trước, đừng giả định các lần đo độc lập.**
  - "BTVN đủ đúng hạn trong tháng" thật ~47% và **bền theo người** (3 tháng: 23% đủ cả 3, 28% không tháng nào).
  - Mô hình tung xu từng bài ra ~24% ⇒ ★4 gần 0 ⇒ kết luận sai.
- **⭐ Ngưỡng bậc cộng dồn đặt theo CUỐI mùa ⇒ đầu mùa cả khối dồn 1 bậc** (mùa 3 tháng: hết tháng 1 có 99% cùng bậc 2).
  - Luôn in phân bố theo **từng mốc thời gian**, không chỉ cuối mùa.
  - ~~Ghế top theo phong độ~~ — SUPERSEDE 28/09: Thùy muốn thần là ĐÍCH theo điểm tích luỹ (không ghế top/hạng). T hiểu "ghế" thành luật vị trí suốt 1 ngày.
- **⭐⭐ Hàm SQL làm "view có tham số": KHÔNG gắn `set search_path`, gọi bằng hằng/biến (không bằng cột CTE)** — mất inline ⇒ 13–35 s thay vì 0,15 s.
- **⭐ Số đầu vào phải hỏi nhịp vận hành THẬT** (8 buổi/tháng = 1 MT + 7 ET) — t lấy 5 ET từ mô phỏng ⇒ phong độ > 100%.
- **⭐ Cột "có vẻ đúng" có thể rỗng 100%** (`btvn_ket_qua.ti_le_dung`, `hoan_thanh`) — đo phân bố cột trước khi dùng làm nguồn.
- **⭐ Tưởng bug phải đo theo THÁNG trước khi sửa** (A4 0% là thật: tự luyện chỉ bùng từ tháng 9).
- **⭐ Chốt có ghi người chốt ⇒ để CEO bấm, không lấy jwt nhân sự bất kỳ chạy thay** (mạo danh vết).
- **`.env` chỉ có `DATABASE_URL` role GHI** ⇒ script dò dữ liệu mở đầu `set default_transaction_read_only = on` + in `show transaction_read_only`
  làm bằng chứng.
- **Máy CEO:**
  - Python chỉ gọi được qua `py` (`python` = alias Store).
  - Không có LibreOffice ⇒ `recalc.py` của skill xlsx chết (AF_UNIX) ⇒ bật `fullCalcOnLoad` + tự kiểm công thức bằng Python.
- **DEVLOG xung đột merge với phiên song song** (cả hai cùng append cuối file) ⇒ giữ CẢ HAI phía (xoá 3 dòng marker), commit merge.
  Không rebase / đè.

### Bài học 29/09 — trợ lý: báo cáo Sư phạm + tổng kết tuần

**Hiểu yêu cầu**
- **⭐⭐ HỎI "BÁO CÁO NÀY CỦA AI" TRƯỚC KHI XÂY.** Xây 2 lượt mới biết mẫu là của Trang (Sư phạm), còn Lộc (Vận hành) cần bản khác. Mỗi người quản một
  mảng có một bộ báo cáo — không có "báo cáo chung".
- **⭐⭐ BÁM MẪU TỪNG CHỮ ≠ HIỂU KHUNG.** Bản đầu chép đúng 7 mục của mẫu, đơn vị là "lớp trong một ngày", mở sẵn mọi danh sách ⇒ đọc xong vẫn không biết
  việc nào của ai. CEO phải rút khung hộ (3 luồng). **Đơn vị của báo cáo vận hành là VIỆC có người phụ trách + hạn**, không phải lớp hay ngày.
- **⭐ ĐO VIỆC DÙNG THẬT TRƯỚC KHI LÀM TIẾP MỘT TÍNH NĂNG.** Đếm câu hỏi đã lưu mới lộ: tab trợ lý 21 câu cả đời, 3 nút không ai bấm. Không đo thì đã đi
  "sửa cho hỏi được" — đúng thứ CEO sau đó gọi là phụ.
- **Cùng một chữ, hai trục:** "xin phép" hợp lệ về THÁI ĐỘ nhưng nghĩa vụ NỘP BÀI vẫn còn. "Học sinh không đến" là sự cố của học sinh, không phải miss của
  nhân sự. Gặp trạng thái mơ hồ thì hỏi nó thuộc trục nào, đừng tự gộp.

**Postgres / quyền**
- **⭐⭐ TEST BẰNG ROLE CHỦ BẢNG KHÔNG THẤY RLS LẪN TRẦN 8 GIÂY.** Hàm báo cáo chạy 1 giây khi test, lên app thì "statement timeout" — vì người dùng thật
  đi qua RLS của từng bảng. Hàm tổng hợp nặng ⇒ `SECURITY DEFINER` có cổng ở dòng đầu + thu quyền gọi thẳng các hàm bên trong. **Chỉ coi là xong khi đã
  mở trên app bằng phiên đăng nhập thật.**
- **⭐ Báo cáo nặng thì LƯU, đừng tính mỗi lần mở.** Và bản lưu phải mang **số phiên bản của cách tính**: nhận biết bằng "có khoá X" không phân biệt được
  luật cũ/mới ⇒ đổi luật xong người dùng vẫn thấy số cũ tới hết ngày.
- **⭐ Nhiều phiên cùng sửa một DB: tạo lại hàm có sẵn thì lấy thân từ `pg_get_functiondef`**, thay bằng script "mỗi phép thay phải khớp ĐÚNG 1 chỗ", rồi
  **so JSON trước/sau**. File migration cũ của chính mình có thể không còn là bản đang chạy (phiên khác đã sửa 2 hàm báo cáo trong lúc làm).
- **⭐ Công thức dùng ở 2 nơi ⇒ tách HÀM GỐC trả mọi dòng + nhãn, hai nơi đọc từ đó.** Kiểm việc tách bằng "kết quả cũ không đổi một ký tự" (0 chỗ khác).
- **Cờ nội bộ đặt bằng `set_config(…, true)` sống tới HẾT transaction**, không phải hết hàm ⇒ dùng xong phải hạ ngay, rồi kiểm lại cổng sau khi áp.
- **Muốn thêm tham số cho hàm đừng `drop` rồi tạo lại** (Luật xoá): `create or replace` đổi được `stable` → `volatile` mà giữ nguyên chữ ký.
- **Đếm theo buổi bằng subquery tương quan trên `gami_grades`/`btvn_ket_qua` rất chậm** (không có index dẫn đầu bằng `buoi_hoc_id`): 17 giây → 0,14 giây
  khi gom trước bằng CTE rồi join.
- **`gami_grades.graded_by` là `tai_khoan.id`, KHÔNG phải `nhan_su.id`** — tra người chấm phải đi qua `tai_khoan`.

**Thống kê trên chuỗi tuần**
- **⭐⭐ "MẢNG CHƯA CHẠY" ≠ "ĐO RA 0"** (CLAUDE.md §1.5 áp cho cả chuỗi thời gian). Tính cả các tuần trước khi có ca test đầu vào ⇒ thường đạt = 0,1 và mọi
  tuần có ca test thật bị coi là nhiễu. Mỗi chỉ số cần một số "neo" để biết từ tuần nào mới là lần đo.
- **⭐ Chỉ số chưa "chín" không đem so với lịch sử đã chín** (bù đã học, test đã trả kết quả): tuần mới nhất luôn ra "vấn đề" giả.
- **⭐ Mẫu số phải loại việc CHƯA TỚI HẠN**, nếu không tuần mới nhất luôn xấu giả (BTVN tuần vừa rồi: 26/59 việc chưa tới hạn chấm).
- **Khâu đang đi lên thì trung bình toàn lịch sử vô nghĩa** (luôn "trên thường đạt", tuần tốt gần đây bị lọc như nhiễu) ⇒ cửa sổ trượt. Nêu hệ quả của
  định nghĩa cho CEO thấy bằng số, để CEO chọn — đừng tự đổi định nghĩa.
- **Ngưỡng theo độ lệch chuẩn của CHÍNH chỉ số**, không một con số cứng cho mọi chỉ số (chuyên cần dao động ~4 điểm, ET đúng chuẩn ~19 điểm).

**Giao diện**
- **⭐⭐ TÍNH NĂNG CỐT LÕI KHÔNG TREO VÀO API MÀ TRÌNH DUYỆT CÓ QUYỀN TỪ CHỐI.** Trình chiếu dựa hẳn vào `requestFullscreen` ⇒ nơi bị từ chối thì bấm nút
  không thấy gì. Dựng lớp phủ của mình trước, toàn màn hình chỉ cộng thêm. Và `fullscreenchange` báo "đã thoát" ngay sau khi vào KHÔNG có nghĩa người
  dùng muốn thoát.
- **⭐ Trình chiếu ≠ màn thường phóng to.** Mỗi bảng một màn vừa khít, chuyển trang — đứng chiếu không ai kéo chuột. Co giãn bằng `transform: scale` trên
  khối có bề rộng gốc cố định (đo bằng ResizeObserver); `zoom` làm đổi kích thước bố cục nên phép đo tự kích lại chính nó.
- **⭐ Hai lần liền "viết xong, kiểu đúng, build qua" mà bấm thử mới lộ hỏng.** `tsc` sạch không nói gì về việc nút có chạy.
- **Xem thử từ worktree:** công cụ preview phục vụ checkout CHÍNH. `fetch` file mới trả 200 có thể chỉ là trang index của SPA — phải nhìn nội dung, không
  nhìn mã trạng thái. Muốn xem bản mới: đẩy lên `main` rồi kéo về checkout chính.

- **⭐ Dựng nhân vật boss riêng (01/10 — bài học trả giá bằng 3 vòng làm lại).** (a) **Khối cơ bản bằng code CHẠM TRẦN chi tiết**: áo choàng/hoa văn/khuôn mặt của bản vẽ không bao giờ ra được
  — muốn "giống đúng con đó" thì dùng CHÍNH bản vẽ làm bề mặt (tấm ảnh 2D + hoạt ảnh code), đừng dựng lại. (b) Chi tiết đặt sát mặt cong (mày, mắt) cách mặt <0.02 bị lớp da
  `transparent` che vì sắp xếp vật trong suốt theo tâm đối tượng ⇒ đẩy ra ≥0.04 + `renderOrder`. (c) Truyền object tạo mới mỗi render (`so={{…}}`) làm `useMemo` dựng lại ⇒ effect gọi
  `setState` của cha ⇒ vòng lặp "Maximum update depth": hằng ổn định + effect phụ thuộc giá trị gốc (chuỗi/số), không phụ thuộc object. (d) Browser pane TẠM DỪNG `requestAnimationFrame` khi
  không hiển thị ⇒ script đánh trận tự động bị khựng; chụp màn hình xen kẽ để pane vẽ khung. (e) `check:style-hs` báo rớt vẫn commit được nếu nối lệnh bằng `;` — kiểm riêng, đừng tin chuỗi lệnh.
  (f) ChatGPT/AI ảnh: giữ nhất quán nhiều pose bằng cách đính lại HÌNH GỐC + câu mô tả cố định mỗi lượt; kiểm máy (alpha, cao đầu, mốc chân) trước khi nhận.

## ③ Nhật ký
→ Chuyển sang **`DEVLOG.md`** (log thô append-only, theo ngày, KHÔNG load khi làm). Là nguồn bất biến để truy lại / tổng hợp lại HANDOFF nếu bản này sai logic.

- **⭐⭐ DANH TÍNH bám KHOÁ TỰ NHIÊN, KHÔNG bám VỊ TRÍ** (bug ET 07-21, nguồn gốc sâu nhất): nối 2 tập bằng "phần tử thứ i ↔ phần tử thứ i" **sai ngay khi một bên thêm/bớt ở GIỮA**, và hỏng **âm thầm** — không lỗi, chỉ gắn nhầm. Lưu thẳng khoá bên kia (`ma_cau`), vị trí chỉ để hiển thị. Áp cho mọi lưới sinh-từ-doc: ET/MT/BTVN.
- **⭐⭐ Cảnh báo lệch phải so NỘI DUNG, không so SỐ LƯỢNG:** `a.length !== b.length` **mù hoàn toàn** với "đổi phần tử mà giữ nguyên số lượng" — đúng ca nguy hiểm nhất. Nút "↻ Đồng bộ" đời cũ còn tệ hơn: nó **từ chối chạy khi đã có điểm**, tức vô dụng đúng lúc cần nhất.
- **⭐⭐ Map lại quan hệ đã mất: "số lượng khớp" KHÔNG phải bằng chứng.** Phản ví dụ thật: 5A2 bỏ 1 câu ở GIỮA rồi dọn ô rỗng cuối → 5 ô/5 câu, số khớp, nhưng ô 3,4,5 vẫn giữ câu CŨ. Phải có **nhân chứng thứ hai độc lập** (ở đây: `ma_dang` seed từ lúc chấm) mới dám ghi; lệch dù 1 phần tử ⇒ **bỏ cả lượt, để trống, hỏi người** (§1.5).
- **⭐ Tham chiếu bằng TEXT (không FK) thì CẤM xoá cứng bên được trỏ:** không FK ⇒ DB không chặn ⇒ chỗ resolve `.filter(Boolean)` cho nó **rụng im lặng** (150 dòng chết, Giáo trình 11A thiếu 24 câu, không ai biết). Dùng **kho rác**: cột `xoa_at` **NGAY TRONG bảng gốc** — tách bảng rác riêng thì (a) mọi chỗ resolve phải join 2 nơi, sót 1 chỗ là tái hiện đúng bug, (b) `nextCauSeq` cấp lại mã đã xoá cho câu mới ⇒ tham chiếu cũ trỏ nhầm sang câu khác hẳn.
- **⭐ So TRÙNG phải so trong đúng PHẠM VI, không so theo giá trị toàn cục:** kiểm `0112` bằng "mã câu này có xuất hiện >1 lần ở đâu đó không" → báo động giả (dòng trùng nằm ở TÀI LIỆU KHÁC). Đúng: với từng dòng vừa ghi, đếm trong CHÍNH tài liệu của nó.
- **⭐ Lưới "vị trí cố định" + `find()` một-lần-mỗi-ô = NUỐT phần tử dư** (bug TKB 07-21): 6 ô phòng, mỗi ô `cell.find(p => p.phong===phong)` → ca thứ 2 cùng phòng / ca `phong=NULL` biến mất, mất 23/76 ca. Render kiểu "gán chỗ" phải là **thuật toán xếp CÓ PHẦN DƯ** (xếp hết, dư thì tràn xuống), không phải N lần tra cứu độc lập.
- **Đổi NỘI DUNG con phải bump `updated_at` của cha:** `setETCaus` sửa `tai_lieu_cau` mà không đụng `tai_lieu` ⇒ mất dấu thời gian ⇒ chẩn đoán về sau đọc nhầm "đề này chưa ai sửa".
- **⭐ Vá dữ liệu: thứ tự migration là một phần của tính đúng.** `0106` backfill CHẠY TRƯỚC `0107` xoá ô thừa ⇒ đúng buổi cần vá lại bị điều kiện an toàn loại ra. Migration vá dữ liệu phải tự hỏi "bước trước có làm thay đổi điều kiện của bước này không".
- **⭐ Migration vá dữ liệu nên ghi CẶP TƯỜNG MINH, đừng để SQL tự suy lúc chạy:** `0112` liệt kê 149 lệnh `update … where id=… and ma_cau=…` → soát được từng dòng, chạy lại = no-op, và nếu ai sửa tay trước đó thì lệnh tự đứng yên thay vì đè. Kèm bảng đối chiếu trong `docs/`.
- **Báo SCOPE phải ĐẾM trước khi nói.** Báo "1 dòng dangling của 8B1" trong khi thực tế **150 dòng / 12 tài liệu MẪU** → suýt lấy cái gật cho 1 dòng đi xoá 150. Luôn query `count(*)` toàn hệ trước khi mô tả quy mô một vấn đề.
- **DB là PRODUCTION đang có người dùng.** Giữa lúc chạy migration, `gami_grades` tăng vì GV đang chấm thật (9A2 buổi hôm đó). Migration nặng nên hỏi giờ trước.
- **⭐⭐ Elo/EXP: KHÔNG CÓ PHÉP ĐO thì KHÔNG ĐƯỢC TÍNH, đừng coi là "mọi người bằng nhau".** `raw[id]=0` cho mọi HS rồi chạy tiếp = 0 dữ liệu bị hiểu thành CẢ LỚP HOÀ; hoà thì `actual` đều nhau nhưng `expected` phụ thuộc Elo ⇒ **hồi quy về trung bình một cách âm thầm** (Elo cao mất, Elo thấp được). Đây là §1.5 ở dạng nguy hiểm nhất: giá trị mặc định 0 TRÔNG như dữ liệu thật. Mọi engine tính điểm/xếp hạng phải hỏi "có dòng đo nào không" TRƯỚC khi hỏi "điểm bao nhiêu".
- **⭐ Bỏ qua âm thầm = bug sống lâu.** Cả 3 bug 07-21 (TKB nuốt ca · lưới chấm lệch câu · Elo phiên trống) đều KHÔNG ném lỗi, chỉ lặng lẽ ra số sai. Khi hệ quyết định "không làm gì" ở một nhánh, PHẢI nói ra cho người dùng (alert/banner), đừng return im.
- **⭐ Elo là CHUỖI PHỤ THUỘC — sửa quá khứ thì phải REPLAY, không trừ ngược được.** `delta` buổi sau tính từ Elo sau buổi trước (qua `expected`), nên xoá/sửa 1 phiên ở giữa làm mọi delta phía sau sai theo.
- **⭐ Script replay phải phủ ĐỦ phase, kiểm trước khi chạy.** `_replay_elo.mjs` đời cũ chỉ có ingame+et; chạy nó sau khi MT ra đời sẽ **xoá sạch Elo của MT** mà không báo gì. Script sửa-dữ-liệu-hàng-loạt: luôn đối chiếu danh sách phase/loại HIỆN TẠI trước khi tin script cũ.
- **Chốt sanity cho replay Elo: TB Elo toàn hệ phải KHÔNG ĐỔI** (Elo zero-sum trong mỗi phiên). Lệch TB = replay sai ở đâu đó.
- **Verify dữ liệu ≠ verify đường code.** Replay chứng minh data đúng, KHÔNG chứng minh `closePhase` đã sửa. Phải test thật đường code (đóng phase rỗng → xem alert + DB), và chọn thao tác CÓ ĐƯỜNG LÙI (`reopenPhase` gỡ sạch) để test trên dữ liệu thật an toàn.

### Bài học 18–20/09 — quyền EXECUTE của function trên Supabase (sổ tay kiến thức)

- **⭐⭐ `grant … to authenticated` KHÔNG chặn `anon`, và `revoke … from public` CŨNG CHƯA CHẮC ĐỦ — phụ thuộc AI ÁP MIGRATION.** Postgres mặc định cấp EXECUTE cho `PUBLIC` khi `create function`, nên chỉ `grant` là cửa vẫn mở. Nhưng gỡ PUBLIC vẫn chưa xong: **Supabase có `alter default privileges … grant execute on functions to anon, authenticated, service_role`, và default privileges GẮN THEO ROLE TẠO HÀM.**
  - Áp bằng **SQL Editor** ⇒ owner `postgres` ⇒ `anon` nhận grant **RIÊNG, TƯỜNG MINH** ⇒ `revoke … from public` gỡ được PUBLIC mà **không đụng `anon=X`** ⇒ phải thêm `revoke execute … from anon`.
  - Áp bằng **`npm run migrate`** (owner `claude_build`) ⇒ không dính default privileges ⇒ ACL không hề có `anon` ⇒ `revoke from public` là đủ.
  - Đó là lý do tiền lệ mig 0062/0063 (`count_cau_by_dang`, `my_hoc_sinh_id`) chạy đúng mà mig 202609181946 thì không — **cùng câu lệnh, khác người áp, khác kết quả**.
- **⭐ Phân biệt "chặn ở GRANT" vs "chặn trong THÂN HÀM" bằng HTTP code — đừng thấy bị từ chối là yên tâm.** Anon gọi ra `400 / P0001 / <message tự viết>` nghĩa là **hàm ĐÃ CHẠY**, chỉ bị guard trong thân chặn ⇒ còn đúng 1 lớp. Ra `401 / 42501 / permission denied for function` mới là chặn ở tầng GRANT, hàm không chạy. Với `security definer` đọc kho thì phải là 401. (`404 / PGRST202` = hàm không tồn tại/sai chữ ký — PostgREST khớp hàm theo TÊN THAM SỐ, gọi `{}` thì hàm nào cũng 404, đừng vội kết luận "chưa áp".)
- **⭐ Migration siết quyền phải SELF-VERIFY 2 CHIỀU trong cùng transaction.** Chiều xuôi: `anon` phải MẤT EXECUTE. Chiều ngược: `authenticated` phải CÒN — siết lố role là lỗi dễ mắc và **chỉ lộ khi người dùng bấm vào màn**, lúc đó đã muộn. Dùng `has_function_privilege(role, 'public.ten(argtypes)', 'EXECUTE')`, raise là rollback sạch. (Migration `revoke` phải do OWNER chạy — `claude_build` revoke hàm của `postgres` sẽ chết với "must be owner of function", fail rõ ràng nên không cần guard thêm.)
- **⭐⭐ Comment khẳng định "đã an toàn" mà chưa đo = nợ nguy hiểm hơn không có comment.** Mig 181946 tự viết *"không để cửa mở"* dựa trên suy luận từ tiền lệ, chưa hề đo ACL. Đúng cái §2.1 đã cảnh báo về chính mục quyền DB — và vẫn đạp lại. **Viết xong câu "đã chặn/đã an toàn" thì việc kế tiếp là ĐO, không phải commit.** Sửa comment sai ở file đã áp là KHÔNG được (lịch sử bất biến) — ghi đính chính trong migration mới.
- **⭐ SQL Editor cũng grant TOÀN QUYỀN BẢNG cho `anon`/`authenticated` (không chỉ EXECUTE hàm).** Đo 26/09: bảng `sk_*` tạo bằng SQL
  Editor ⇒ `has_table_privilege('anon', …, 'INSERT') = true`. RLS không có policy ghi thì vẫn chặn, nhưng chỉ còn 1 lớp ⇒ bảng "ghi chỉ qua
  RPC" phải `revoke all … from anon` + `revoke insert, update, delete … from authenticated` ngay trong migration. `information_schema.role_table_grants`
  KHÔNG hiện grant của role mình không thuộc — đo bằng `has_table_privilege`.

### Bài học 26/09 — hệ sự kiện (plpgsql · test theo vai · test UI qua ô trình duyệt ẩn)

- **⭐⭐ plpgsql: alias bảng TRÙNG TÊN biến `record` trong hàm ⇒ Postgres bind vào BIẾN, không phải bảng.** `declare d record;` rồi
  `(select … from sk_dang_ky d … where d.id = …)` ⇒ nổ `record "d" is not assigned yet` ở dòng đầu hàm (PostgREST trả 500). Không lỗi
  lúc `create function` — chỉ lộ khi CHẠY. Cổng quyền/tra cứu phụ nên gói vào hàm riêng (`_sk_sk_cua_dang_ky`), không alias trong hàm có biến.
- **⭐ Đổi cổng quyền ⇒ test MỌI RPC dưới MỌI vai, không chọn mẫu.** Lỗi trên lọt vì test persona chỉ chạy check-in/đăng ký, bỏ qua 3 hàm
  quản trò. Script PGlite (stub `jwt_email/la_thanh_vien/hoc_sinh/nhan_su`) chạy đủ vai + người ngoài trong vài giây — rẻ hơn 1 vòng dán SQL.
- **Ô trình duyệt của app Claude khi bị ẨN: ảnh chụp đứng hình + click toạ độ trượt vì layout dịch.** Kết luận "bấm không ăn" từ ảnh là sai
  (bàn quay đã quay thật, xu tăng 38→63). Xác nhận bằng TEXT/dữ liệu (`get_page_text`, gọi RPC), click bằng ref/JS, không tin screenshot.
  Nhưng chính việc đó lộ lỗi thật: khung `items-center overflow-hidden` cắt mất nút nằm dưới mép — màn làm việc phải có vùng tự cuộn.
- **Máy "nhớ lựa chọn" (localStorage) phải kiểm lại khi dữ liệu đổi**: máy nhớ sự kiện TEST đã đóng ⇒ mở app vào nhầm TEST cùng ngày. Nhớ
  thì được, nhưng mở lại phải ưu tiên trạng thái hợp lệ (sự kiện đang mở).

### Bài học 26–27/09 — game chạy thật (sự kiện) + game trong buổi học
- **⭐⭐ Thêm NGUỒN EXP mới: rà cả chỗ ĐỌC lẫn chỗ XOÁ.** Đọc: nguồn bị liệt kê cứng ở 4 chỗ (`fn_gami_exp_xu_thang` chốt xu ·
  `fn_gami_exp_chi_tiet_thang` · `fn_hs_vi_xu_cua_toi` · `EXP_NOTE_SOURCES`), tháng xác định bằng `note='YYYY-MM'` (không created_at) —
  sót 1 chỗ là EXP không bao giờ thành xu, im lặng. Xoá: `fn_recompute_exp_thang` (chạy mỗi lần đóng ET/BTVN) xoá theo `ref_buoi_hoc_id`
  KHÔNG lọc nguồn ⇒ suýt xoá sạch EXP game (bắt trước khi mở cho GV, vá mig `202609272048`). Grep `delete from gami_exp_ledger` mỗi khi thêm nguồn.
- **⭐ Sửa hàm mà phiên khác cũng đang sửa: ĐỪNG chép đè thân hàm.** Migration đọc `pg_get_functiondef` lúc áp, `replace` đúng chỗ cần,
  ASSERT đúng 1 chỗ khớp rồi `execute` (mẫu: mig `202609272045_*`). Chép bản lấy lúc sáng = xoá sửa của người khác lúc trưa.
- **⭐ Verify migration GHI trên DB thật: chạy cả file + gọi RPC trong 1 transaction rồi ROLLBACK** (claude_build, node qua stdin từ repo).
  Thấy được kết quả trên buổi/HS thật, không để lại dòng nào; chạy 2 lần (trước/sau vá) để CHỨNG MINH bug thay vì suy luận.
- **`scripts/migrate.mjs` KHÔNG có `--help` — gõ là nó ÁP THẬT mọi file treo** (27/09 lỡ gõ, may dừng ở file đầu do thiếu quyền). Chỉ dùng
  `--status` (đọc) hoặc `--only <file>`. Trong repo luôn có file treo của sự kiện/Sổ tay (áp bằng SQL Editor, sổ không ghi).
- **⭐ "Đã nối kênh" ≠ "có máy nghe".** Tối 26/09 app để hub BK01, TV thật ở BK09 ⇒ nhãn xanh "● nghe TV" mà tên gửi vào khoảng không.
  Máy điều khiển phải đọc **presence** của máy nhận (`role:'tv'`) và cảnh báo khi vắng; nút "bắt đầu" phải kéo theo mọi bước TV (mở game)
  thay vì trông người vận hành nhớ làm tay.
- **Cú pháp hợp lệ ≠ chạy đúng**: patch làm rơi `;` ⇒ `P.fin=falseP.ready=false` — `new Function` qua, chạy thì ReferenceError, iPad kẹt
  màn kết quả. Game nhiều ván phải chạy ≥2 ván liên tiếp khi verify.
- **Hình phần thưởng theo GIÁ TRỊ TUYỆT ĐỐI, không theo vị trí trong khoảng của từng hạng** (Giải 3 200 EXP từng ra "núi vàng" to hơn Nhất
  340). Loại rương/khung đã báo hạng; hình chỉ nói "được nhiều hay ít".
- **Kinh tế game: tính TB theo SĨ SỐ THẬT trước khi nhận mục tiêu.** Lớp TB 8 bạn có mặt ⇒ Giải 3 chiếm ~3/4 ⇒ "TB 250" bất khả với Giải 3
  ≤200 (max tất cả = 238). Đưa bảng TB theo sĩ số cho CEO chọn. Thêm độc đắc hiếm/nhỏ hơn ⇒ phải bù vào ô thường để giữ tỉ lệ chi.
- **iPad Safari:** nền `html` mặc định TRẮNG — trang nảy là lộ "thanh trắng"; tô `html` cùng màu game + `overscroll-behavior:none`.
  `touch-action` trên `html` áp cho mọi phần tử (lấy giao chuỗi tổ tiên) ⇒ tắt chạm-đúp-zoom toàn trang một chỗ.
- **Commit CHỈ phần mình khi file có sửa đổi chưa commit của người khác:** dựng bản index = `git show HEAD:file` + đúng patch của mình
  (script patch chạy được cho cả 2 bản) → `git hash-object -w` → `git update-index --cacheinfo`. Không `git add` cả file.
- **CEO nói "đừng chốt — t đề xuất kịch bản, luật t viết"** ⇒ CTO chỉ hỏi OUTPUT + tìm đường nối hệ thống; không tự điền số rồi build (R3).
  Số liệu luật CTO đưa ra phải dán nhãn "nháp, không dùng".
- **⭐ URL/domain phải ĐO trước khi làm mặc định, không "tạm".** 27/09 t đặt `GAMES_URL='bkdemy-games.vercel.app'` theo tên project, không curl
  ⇒ 404, nút mở TV hỏng tới khi CEO test thật ("chưa thấy game trên ERP"). Domain thật tìm bằng `vercel project ls` (CLI có sẵn, đã đăng nhập)
  → `game.bkacademy.edu.vn`. Kèm: "chưa thấy tính năng" ⇒ đo bản ĐANG CHẠY (tải bundle prod, grep chuỗi) trước khi kết luận thiếu deploy/pull.
- **Test UI có nút GHI trên ERP dev mà không ghi DB:** trong trang, `await import('/src/lib/supabase.ts')` rồi thay `supabase.rpc` (giả kết quả,
  chặn mọi `fn_*` ghi). **Vite dev tự reload khi phiên khác sửa file ⇒ override mất im lặng** — mỗi bước bấm phải kiểm override còn sống
  (vd `window.__GHI`) rồi mới bấm; xong kiểm lại DB bằng query.
- **Màn công khai không được lộ kết quả trước hoạt ảnh — và mọi màn cả lớp nhìn thấy đều là màn công khai:** dữ liệu (DB/bảng lớp) đến NHANH
  hơn hoạt ảnh ⇒ đánh dấu "đang mở" lúc NHẬN lệnh, chỉ hiện số khi game BÁO xong. Vá TV (`BKLopBang.cho/xong`) mà quên list ERP ⇒ Cast chung vẫn
  lộ (29/09). Cách đúng: game gửi tín hiệu `xong` theo `hid`, mọi nơi hiển thị chờ tín hiệu đó (+ timeout phòng TV rớt).
- **Game may rủi: đừng để thứ tự mở tiết lộ kết quả.** Luật "quà 1–2 nhỏ, quà cuối quyết định" = mở 2 món đầu vô nghĩa. Đo độ hồi hộp bằng giả lập:
  vị trí món to phải gần đều, tương quan món đầu ↔ tổng thấp, đoán lãi/lỗ sau n-1 món không quá ~70%.
- Liệt kê dữ liệu để xin xoá: t đọc `date` bằng `toISOString()` ⇒ lệch 1 ngày (27/09 thay vì 28/09) — đúng cái §2 CẤM; luôn format ngày theo VN.
- **⭐ Cân game bằng GIẢ LẬP, và giả lập phải chạy CHÍNH bộ máy của game** (Bắn Quà 28/09): cảm giác "đạn không cân" của CEO đúng — đo ra
  Chùm 52 vs Bom to 27. Bản giả lập đầu chép lại vật lý ⇒ "công thức 2 nơi" (§2.0 cấm); làm đúng là tách vật lý + điểm thành bộ máy THUẦN
  (trả sự kiện, không vẽ/âm thanh), game "diễn" sự kiện, giả lập gọi cùng bộ máy. Có bộ máy chung thì thêm 5 đạn mới + tự cân (`canBang`) rẻ.
- **Game kỹ năng nối ERP: TV tính điểm, DB tính mọi thứ còn lại.** Vật lý không chạy ở Postgres được ⇒ chỉ nhận ĐIỂM THÔ từ TV, kẹp trần, GV xem
  rồi Chốt; vòng quay, chia đội, hạng, EXP, rương, trà sữa đều rút/tính ở DB (cùng họ `fn_sk_tra_xu_van` sự kiện). Bắt đầu lại ván GIỮ đạn đã quay.
- **plpgsql: `create temp table … on commit drop` trong hàm = gọi 2 lần/transaction là trùng tên** — dùng CTE trong `for x in with … loop`.
- **Đo phân bố ngẫu nhiên bằng SQL: `lateral (… order by random() limit 1)` KHÔNG tương quan với hàng ngoài ⇒ Postgres tính 1 lần** ⇒ ra "100% một
  loại" dù hàm đúng. Đo bằng đúng câu của hàm, chạy trong vòng lặp plpgsql.
- **Chèn mục vào spec bằng "replace mốc" làm MẤT mốc 2 lần liền** (chuỗi thay không kết thúc bằng chính mốc). Mục "còn hỏi" để CUỐI file; thêm
  mục = cắt đuôi, ghi mục mới, dán lại đuôi.
- Vặt: tab trình duyệt ẩn ⇒ `requestAnimationFrame` đứng (game 3D "kẹt" không phải bug — `?loop=timer`) · file game `games-site/*.html` là **CRLF**,
  Edit tool chèn LF ⇒ chuẩn hoá lại · đường dẫn Windows nhúng vào heredoc Bash mất `\` ⇒ ghi file tạm trong repo rồi xoá · máy không có `python`.

- **⭐ Query kiểm chứng phải KHÔNG ĐƯỢC tautology, và luôn có ĐỐI CHỨNG.** Viết `where not f(x) and f(x)` để "đếm cái lọt" thì kết quả 0 là do logic, không phải do dữ liệu — vô giá trị nhưng trông y hệt bằng chứng. Tương tự, "không thấy trong kết quả" chỉ có nghĩa khi có một mẫu ĐỐI CHỨNG chắc chắn PHẢI thấy và nó thật sự hiện ra; không thì "không thấy" có thể chỉ vì query nhân bản bị hỏng.
- **Đọc dữ liệu bằng anon key để kết luận "bảng rỗng" là SAI** — RLS member-gate trả **HTTP 200 + `[]`**, không phải lỗi. Cùng họ với bẫy §2.1. Muốn số thật phải `DATABASE_URL_RO` (`claude_ro`), và `claude_ro` không gọi được RPC `grant to authenticated` nên **không thay thế được việc test end-to-end bằng tài khoản thật**.
- **Bookkeeping `_migrations`:** `bam` = sha256(nội dung utf8 **đã bỏ hết `\r`**), hex, **cắt 16 ký tự** (`migrate.mjs:105-107`); `ten` = basename. Trước khi đưa số cho người dán, **tính lại bam cho toàn bộ file đã có trong sổ và đối chiếu** (477 khớp / 0 lệch) — rẻ, và nó chứng minh mình replicate đúng thuật toán thay vì đọc code rồi tin.

### Bài học 20/09 — `format()` trong plpgsql, và lỗi bị UI nuốt

- **⭐⭐ `format()` KHÔNG biết `--` là comment SQL — nó xử lý CHUỖI THÔ.** Mọi dấu `%` nằm trong `$q$…$q$`, **kể cả trong comment**, đều bị nuốt làm format specifier ⇒ `ERROR 22023 unrecognized format() type specifier`. Cắn thật: comment viết để *cảnh báo phải escape `%`* lại chính là chỗ quên escape, làm `hs_sotay_tim` throw MỌI lần gọi suốt 2 ngày.
  **Luật rút ra (mạnh hơn "nhớ escape `%%`"): chuỗi truyền vào `format()` chỉ chứa SQL, KHÔNG comment, và KHÔNG dấu `%` nào ngoài `%1$I/%2$I`.** Mẫu LIKE dựng ở plpgsql rồi truyền qua `USING`; `limit` cũng truyền tham số thay vì `%3$s`. Escape `%%` chỉ chữa được lần này — người sửa sau viết thêm một dòng comment là đạp lại; luật "không có `%`" thì nhìn là thấy, và **kiểm được bằng máy** (tách `prosrc`, gỡ 2 specifier hợp lệ, còn `%` nào là raise trong chính migration).
- **⭐⭐ `security definer` + guard trong thân hàm = lỗi runtime NÚP SAU guard.** Test bằng anon chỉ chứng minh guard chạy, KHÔNG chứng minh phần sau guard chạy — anon bị chặn TRƯỚC khi tới `format()`. Muốn biết hàm có chạy không thì phải gọi bằng role ĐI QUA được guard. Tương tự: `tsc`/`build` không chạm DB, demo dùng mock, đo bằng SQL viết tay không qua `format()`. **Bốn lớp "verify" mà không lớp nào GỌI HÀM ⇒ vẫn là 0 lớp.**
- **⭐ Lỗi RPC và "không có dữ liệu" PHẢI là hai trạng thái tách hẳn ở UI.** `.catch(() => setRows([]))` biến mọi lỗi thành "không tìm thấy" — người dùng nhìn màn hình không thể phân biệt *kho rỗng* với *hàm nổ*, nên bug không được báo đúng bản chất và sống rất lâu. Lỗi ⇒ vẽ hộp lỗi + `console.error` **nguyên error object** (giữ `code`/`hint`/stack); rỗng ⇒ mới vẽ hộp rỗng.
- **⭐ Lỗi Supabase KHÔNG phải `Error`.** `supabase.rpc` trả `PostgrestError` = object thường `{message, details, hint, code}`. `e instanceof Error ? e.message : '<mặc định>'` ⇒ **luôn** rơi vào fallback, vứt mất message thật của DB — đúng thứ cần đọc nhất. Đọc `.message` của mọi object thay vì hỏi nó có phải `Error` không.
- **⭐ Test kiểm chuỗi/regex phải tự chặn "bắt nhầm mục tiêu".** Regex `\$q\$(.*?)\$q\$` để lấy chuỗi format đã vớ phải `$q$…$q$` trong **comment header** của chính file migration ⇒ test chạy trên chuỗi `"…"` và báo xanh cả 2 bước đầu. Lấy khối DÀI NHẤT + assert nội dung bắt buộc (`phải chứa jsonb_agg`) trước khi tin kết quả. Xanh giả nguy hơn đỏ.
- **Chốt quy trình: `npm run smoke:sotay` sau MỌI migration đụng 3 RPC sổ tay.** Giá trị của nó được chứng minh ngay lúc viết — chạy trước khi áp fix thì FAIL đúng chỗ (`22023`, exit 1), chạy sau thì PASS cả 3. Test không bao giờ đỏ là test không chứng minh được gì.

### Bài học 20/09 (phiên 3) — lọc vs xếp hạng, và "đã áp rồi"

- **⭐⭐ Tham số nghe như bộ lọc mà thực ra chỉ CỘNG ĐIỂM — kiểm bằng cách so TẬP KẾT QUẢ, không so thứ tự.** `p_khoi` của `hs_sotay_tim` nằm trong biểu thức `diem`, không nằm trong `WHERE`: đứng khối 9 vẫn ra dạng khối 4/5, chỉ khác là khối 9 nổi lên đầu. Dấu hiệu nhận ra từ chính số đo: *cùng số dòng, cùng tập, chỉ khác điểm* = đang XẾP HẠNG chứ không LỌC. Ca tệ nhất: truyền khối **không tồn tại** vẫn trả về đủ kho — test phải có case đó.
- **⭐⭐ Luật khớp chuỗi do người đề xuất (kể cả CEO) phải ĐO trên dữ liệu thật trước khi code.** "Đổi sang khớp đầu từ" nghe là chữa được "chu vi" ra "Công việc chung", nhưng KHÔNG: `chung` *bắt đầu bằng* `chu`, `viec` *bắt đầu bằng* `vi` — cả hai đều là đầu từ. Luật đúng là **tiếng cuối = tiền tố, các tiếng trước = trọn từ** (`\m<t>\M` … `\m<t>`): loại được ca sai mà vẫn cho gõ dở chữ. Cách kiểm rẻ: lấy 2 bản ghi ĐỐI LẬP (một cái phải khớp, một cái phải loại) rồi chạy từng phương án lên đúng 2 cái đó.
- **⭐ Đổi LIKE → regex thì phải khử metachar của người dùng.** `(`, `[`, `*`, `\` làm nổ query hoặc khớp bậy. Lọc mỗi tiếng còn `[a-z0-9]` trước khi ghép. (Bản LIKE cũ cũng đã dính nhẹ: `%`, `_` trong input là wildcard — lỗ âm thầm, không ai báo.)
- **⭐ `~ all('{}')` / `like all('{}')` với mảng RỖNG là TRUE-rỗng ⇒ trả về CẢ BẢNG.** Guard "không còn tiếng nào thì return rỗng" là thứ duy nhất chặn ca gõ toàn ký tự rác. Ai bỏ guard đó thì `"(((("` trả cả kho. Nhớ khi refactor.
- **⭐⭐ "Đã áp rồi" KHÔNG phải bằng chứng — luôn đo lại trước khi ghi sổ.** CEO báo đã áp `201203` + smoke xanh + test app đúng; chạy lại thì smoke **exit 1**, migration chưa hề áp. App nhìn có vẻ đúng vì 2 dạng đúng được 40 điểm nổi lên đầu còn 2 dạng rác 4 điểm xếp bét — không kéo xuống thì không thấy. **Ghi `_migrations` cho migration chưa áp là hỏng sổ VĨNH VIỄN** (từ đó `--status` coi như xong, không ai phát hiện nữa) ⇒ gặp mâu thuẫn thì DỪNG, đừng ghi.
  Cách đo rẻ và chắc: **dấu vân tay hành vi** — chọn một truy vấn mà bản cũ/bản mới ra số khác hẳn ("chu vi" không lọc khối: cũ 13 dòng + 2 dòng rác, mới 9 dòng + 0), hoặc đọc thẳng `pg_proc.prosrc` tìm chuỗi đặc trưng của từng bản.
- **⭐ `DATABASE_URL_RO` phải là chuỗi POOLER, không phải host trực tiếp.** `db.<ref>.supabase.co` đã bỏ IPv4 ⇒ `ENOTFOUND` ⇒ `npm run schema` và mọi script `pg` chết, trong khi đường REST vẫn sống (nên smoke test vẫn chạy và dễ tưởng DB bình thường). Đúng chuỗi: `…@aws-0-<region>.pooler.supabase.com:5432` — xem `.env.example:22`.
- **Self-verify trong migration nên kiểm THẲNG vào bug đang sửa, không kiểm chung chung.** `201150`: phải có `bd.khoi = $3`, không được còn `then 50`. `201203`: phải có `hay ~ all(`, không được còn `hay like all(`. Nhờ vậy migration áp nửa vời hoặc áp nhầm bản cũ là raise + rollback ngay, không cần đợi người phát hiện.

### Bài học 16–27/09 — kho Hình học phase Học (cắm bảng mới vào module cũ)

- **⭐⭐ Có module sẵn thì BÊ NGUYÊN, đừng viết lại.** 16/09 t tự viết modal câu + OCR + hub riêng; CEO: *"bê nguyên module nhập của bên đại, tự tạo module mới làm gì"* (nhập ảnh phải **dán clipboard**, PDF mới upload — module Đại có sẵn cả hai, bản tự viết thì thiếu). Trước khi viết UI nhập/sửa: grep component nhận `cauTbl`/`api` param (`DangHub`, `CauModal`, `AiImportModal`, `LyThuyetModal`, `KhoPicker`, `DangPicker`). Cách rẻ nhất: cho **bảng mới đúng SHAPE bảng cũ** (rename cột, thêm cột compat nullable/GENERATED) + **1 dòng registry** (`CUM_TBL`, `khoCuaMon`, `NHANH_CUA_MON`).
- **⭐⭐ Cắm bảng mới vào module cũ ⇒ phải kê MỌI cột module đó select/filter/insert, không chỉ cột "chính".** Dính 3 lần liên tiếp, lần nào cũng **im lặng**: (1) insert của Đại không truyền `khoi` NOT NULL; (2) `getTaiLieuFull` select `ma_dang,ten_dang,muc_do,ma_chuyen_de,ten_chuyen_de` trên `banDoTbl` ⇒ fail ⇒ buổi rỗng; (3) `listCauByDang` mặc định `.eq('kho_chuan', true)` ⇒ `autoSuggestByLoai` throw ⇒ `setDangOfBuoi` dừng giữa chừng ⇒ buổi "0 dạng", UI đơ, không báo lỗi. **Cách làm đúng:** grep `.from(K.` / `.from(cauTbl` / `.from(tbl` toàn repo, gom tập cột, đối chiếu `information_schema.columns` TRƯỚC khi báo xong — không đợi CEO bấm từng màn mới lộ.
- **⭐ UI "chọn xong mà đơ" ⇒ đếm dòng DB trước khi đọc code render.** Đếm `tai_lieu_phan` theo `loai_phan` của đúng tài liệu đó: có `buoi` mà 0 `dang` ⇒ lỗi nằm giữa đường GHI (hàm ghi throw), không phải render.
- **⭐ Đếm nguồn trước khi viết script ghép data.** `hinh_bai` tên y như nguồn nhưng **0 dòng**; data thật ở `hinh_baitoan`. Và `phat_bieu` chỉ là câu hỏi (`de_bai_chuan` 100% NULL) — không ghép bối cảnh mô hình thì câu không đứng độc lập được. Chạy 1 query thống kê (null/rỗng từng cột ứng viên) rồi mới chốt mapping.
- **Script ghép data 1 lần: 1 transaction + gộp theo khoá tự nhiên (tên Bài) + xoá script sau khi chạy.** Không idempotent thì đừng để lại trong repo — người sau chạy lại là nhân đôi 150 câu.
- **Bộ lọc "chỉ hiện khi có dữ liệu" (`coMucDo`) cho component dùng chung.** Thêm filter độ khó vào `DangPicker` mà không làm rối nhánh chưa có `muc_do`: điều kiện hiện = tồn tại ≥1 leaf có giá trị, không `if (nhanh === 'hinh_hoc')` (§1.6 symmetry).
- **git sau stash-pop/rebase: `git status` NGAY trước `git commit`, add theo tên.** 16/09 một `git commit` trần dính 6 file phiên khác đã staged sẵn (CEO cho push chung, nhưng lẽ ra không được xảy ra).
