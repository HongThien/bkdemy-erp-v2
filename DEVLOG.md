# DEVLOG — Kho (BKdemy ERP v2) · nhật ký THÔ

> Log thô, **append-only**, theo ngày: *làm gì / sai gì / sửa sao / quyết định gì*.
> **KHÔNG load file này khi làm việc** — chỉ `HANDOFF.md` được đọc đầu phiên.
> File này = **NGUỒN bất biến** để sau truy lại, hoặc tổng hợp lại HANDOFF nếu thấy bản cũ sai logic.
> Quy tắc: trong ngày chỉ THÊM vào đây; **cuối ngày** mới distill các mục durable → cập nhật HANDOFF (① trạng thái ② bài học).
> ⚠ ĐỪNG sửa/xoá mục cũ — chỉ thêm mới (giữ nguyên nguồn).

---

## 2026-06-17

**THÀNH TÍCH — Thùy nắn model lần 2 + style (đè giả định cũ):**
- **EXP = lương THÁNG → xu, reset hằng tháng, KHÔNG phải thành tựu** → BỎ EXP khỏi bảng khoe. **Level = pool "điểm tiến trình" RIÊNG (≠ EXP), define sau** → Level + avatar = PLACEHOLDER ("cấp độ sắp ra mắt"). (`level.js`/`season.js` giữ dormant.)
- **Rank = THỨ HẠNG leaderboard** (KHÁC tier). "Hạng cao nhất từng đạt" cần snapshot → giờ hiện hạng HIỆN TẠI.
- **Phần C "Lịch sử thi đấu" (Thùy chốt nội dung):** số lần **Top 1 · Lớp / ET / MT** (tách theo phase) + **chuỗi đi học** (+ chuỗi làm bài: chờ track BTVN) + tổng buổi. Danh hiệu (HS xuất sắc/tiến bộ/chăm chỉ) = zone E placeholder.
- **STYLE: KHÔNG sci-fi, KHÔNG SaaS — GAME vui nhộn** (như reference Squad Busters Thùy gửi). ĐÃ NHẦM: tự với skill `bkdemy-scifi-ui` làm bản sci-fi → bị bác "t nói bỏ scifi". **Workflow chốt: mockup chỉ để CHỐT LOGIC/bố cục; SKIN đẹp làm SAU bằng claude design.** → giờ build logic/data số-thật, skin để tạm. (Memory: [[thanhtich-style-game-khong-scifi]].)

**BUILD logic/data (skin tạm):**
- **Mig 0042** `gami_elo_history` +`rank`+`rank_total` (nullable; dòng cũ + bù/bổ trợ = NULL). Áp riêng (`_apply_one.mjs`) + `npm run schema`. `closePhase`: tính `ranks` SỚM rồi LƯU vào history insert (đếm Top-1 + hạng cao nhất sau này).
- `getThanhTich` refactor: query riêng gami_elo + gami_elo_history(rank/phase/buoi) + buoi_hoc_hs(điểm danh) → per môn {elo, eloPeak, rankNow/Total, top1{lop,et,mt}, tongBuoi, chuoiDiHoc}. `listThanhTich` lean (elo+rankNow theo môn).
- `BangThanhTich` rebuild 4 zone (skin tạm indigo): A danh tính + B chỉ số (Elo/Hạng/Elo đỉnh + Level placeholder) · C lịch sử thi đấu (Top1 lớp/et/mt + chuỗi + tổng) · E danh hiệu placeholder. `ThanhTichScreen` click HS → FULL-SCREEN (bỏ modal). ✓ tsc+test+build sạch. CHƯA test e2e (cần buổi đóng + sinh rank).
- **CÒN placeholder chờ Thùy:** nguồn điểm tiến trình→Level · điều kiện danh hiệu + % · track BTVN cho chuỗi làm bài · phiên design "đẹp" (claude design).

**ADR THÀNH TÍCH CHỐT (Thùy duyệt, đẩy Notion):** [ADR — Bảng thành tích HS & 3 hệ điểm](https://app.notion.com/p/381d4530bcdb819fb151c32f81007117) (con của ERP V2). Chốt:
- **3 tiền tệ tách bạch:** Level (tích luỹ thành tựu, khó nhất, nổi nhất) · Elo+Hạng (phong độ) · **EXP→Xu (LƯƠNG tháng, reset THÁNG)** — EXP KHÔNG nuôi Level, chỉ ra xu (vd 10k EXP=60xu). Thanh exp ở profile = tiến tới mốc XU kế (2 đầu là xu, không phải level).
- **LEVEL = Σ điểm sát hạch, max 21/mùa/môn** (khớp LEVEL.MAX_POINTS=21). 13 lần: 4 thi trường(×2) + 4 BK sát hạch(×2, = MT nghiêm túc) + 5 khảo sát tháng(×1). Verdict đạt/gần/không → điểm (gần đạt: hệ2=1, hệ1=0.5). Verdict so **band TẠI THỜI ĐIỂM thi** (snapshot `band_luc_thi`; band có `diem_ky_vong`). Suy động. Cần **tab quản lý Level** (staff, bảng HS×13 kì thi).
- **Entity điểm thi:** `ky_thi`(loai truong/mt_sat_hach/khao_sat_thang · he_so · `dot` ghép cặp trường↔BK · `buoi_hoc_id?` nối MT — KHÔNG tách "ST") + `diem_thi`(verdict + `vuot_band`) + `muc_nang_luc.diem_ky_vong`. 4 kì trường = 4 INSTANCE cùng loai (không tách 4 entity).
- **MT = 1 sự kiện 3 vai:** Elo (buổi) + Level (sát hạch verdict) + vượt-band.
- **Thành tích thi đấu** (đổi tên từ lịch sử): catalog canonical `thanh_tich_loai` pure-derive + `hoc_sinh_thanh_tich_ghim` (HS chọn khoe / hệ gợi ý top). Phổ nhóm: giỏi/thi/tiến bộ/chăm/cột mốc → ai cũng có cái khoe.
- **Schema mới (additive):** ky_thi · diem_thi · muc_nang_luc.diem_ky_vong · thanh_tich_loai · hoc_sinh_thanh_tich_ghim · luong_bac · btvn_ket_qua. Level/Xu/thành tích = suy động.
- **NEXT:** migration + service khung (chưa làm). Chờ define: số xu/bậc · kì vọng từng band · trọng số "độ hiếm" · điều kiện danh hiệu · luồng nộp BTVN · art nhân vật · skin game (claude design).

**BUILD migration + service khung (Thùy: làm luôn):**
- **Mig 0043** (áp riêng + `npm run schema`, 43→49 bảng): `ky_thi`(loai·he_so·dot·buoi_hoc_id?·mua) · `diem_thi`(verdict·band_luc_thi·vuot_band; PK ky_thi+hs) · `muc_nang_luc.diem_ky_vong` · `thanh_tich_loai`(catalog, **seed 12 loại**) · `hoc_sinh_thanh_tich_ghim` · `luong_bac`(**seed 7 bậc PROVISIONAL** 0→0…20k→110) · `btvn_ket_qua`. RLS member-gate khai TAY cho cả 6 bảng (`la_thanh_vien()`).
- **Service `src/lib/thanhtich.ts`** (seam): `getLevelXu(hsId,mon)` = Level (Σ verdict→điểm: đạt=hệ số·gần=½·ko=0, lọc mùa+môn) + Xu (EXP THÁNG này tra `luong_bac`) · `listThanhTichLoai` · khung quản lý điểm thi `listKyThi`/`createKyThi`/`getDiemThi`/`upsertDiemThi`.
- **`BangThanhTich`**: Level thật nổi bật (Lv badge + "Cấp độ X/21") + thanh **EXP→Xu** (lương tháng) thay placeholder. ✓ tsc+test+build sạch.
- **CÒN:** tab quản lý Level (staff nhập điểm 13 kì thi) · compute catalog thành tích còn lại (vượt band/điểm 10/chuỗi BTVN…) · gợi ý+ghim · skin game. Số hiện 0 tới khi có diem_thi/exp thật (đúng anti-NULL).

**ÁP DESIGN GAME (Mythwings) cho profile (Thùy down từ claude design):** zip `Student badge design.zip` (BKdemy_Profile.html style chuẩn + 3 chim phoenix PNG + Mythwings_Badges). Port vào `BangThanhTich`: nền tối + Baloo 2, gem **LV**(Level)+**HẠNG**(#rankNow) + thanh **EXP→Xu** (lương) + 🏆 **Elo**; panel "Thành tích thi đấu" (Top1 lớp/ET/MT·Elo đỉnh·chuỗi·tổng); **3 danh hiệu** Thunder/Fire/Frost (chim + nền nguyên tố SVG `backdrop()` + sao + %). CSS scope `.bkprofile` (prefix `bp-` chống đụng Tailwind). Ảnh→`public/mythwings/`, font Baloo 2→index.html. Props +`maHs`/`khoi` (truyền từ ThanhTich list + HocSinh tab). **Danh hiệu cấp/% = PLACEHOLDER** (cấp 1, 0%) chờ define điều kiện. Zip + `_design_thanhtich/` đã gitignore (chỉ commit 3 PNG). ✓ tsc+build. **Xem thử cần HS có Elo** (buổi đã đóng); chưa có → trống.

**TAB QUẢN LÝ LEVEL (Thùy: làm luôn):** `QuanLyLevelScreen` (leaf `quanlylevel`, Vận hành, gu SaaS). Chọn LỚP (SearchSelect) → môn+roster (`listHSCuaLop`) + kì thi mùa (`listKyThi`, lọc khối). **Tạo kì thi** (CreateModal: loại→hệ số auto 2/2/1, đợt ghép cặp, ngày). **Nhập điểm** 1 kì thi: bảng HS × [điểm/10 · verdict đạt/gần/không · vượt band] → `upsertDiemThi` (snapshot `band_luc_thi`=muc_nang_luc_id). **Ma trận Level**: HS × kì thi (verdict màu + điểm + ↑vượt) + cột Level=Σ verdictDiem (max = Σ hệ số kì thi đã tạo, đích 21). Helper thanhtich: `currentMua`/`verdictDiem`(export)/`listDiemThiByKyThi`. ✓ tsc+build sạch.

**KHO TÀI LIỆU — đổi tên file "ko đổi" (Thùy, nối tiếp):** đổi tên giáo trình buổi 9S → indicator báo ✓ nhưng Kho không đổi. Điều tra DB (claude_ro): RLS `tai_lieu_member_all` cho phép UPDATE, KHÔNG trigger, và `tai_lieu` UPDATE CÓ landing (master 9S/9B2 + ET `edited=true`). Riêng "GT 9S1…Buổi 1" `updated_at==created_at` → user sửa **ô tiêu đề BUỔI trong thẻ** (`updatePhan`→`tai_lieu_phan.tieu_de`) chứ không phải ô "Tên giáo trình" trên cùng (`tai_lieu.ten` = cột Kho). 2 ô tên gây nhầm. Fix: cho **đổi tên ngay tại bảng Kho** (`KhoTaiLieuScreen`: bấm tên → prompt → `updateTaiLieu(ten)` → reload), khỏi vào builder. Áp mọi loại. ✓ tsc. (Bài học: Supabase `.update()` resolve im lặng kể cả 0 dòng — indicator "đã lưu" KHÔNG chứng minh đúng cột/đúng bảng; phải verify DB.)

**KHO TÀI LIỆU — sửa builder "ko thấy chỗ lưu" (Thùy):** `TaiLieuBuilder` (sửa giáo trình/BTVN từ Kho) LƯU TỰ ĐỘNG mỗi thao tác (saveTen on-blur · saveCh · applyCaus · setDangOfBuoi · updatePhan/addBuoi/deleteBuoi) → KHÔNG có nút Lưu → CEO tưởng mất. Theo §6 (feedback ~2s, không alert success): thêm **chỉ báo "↻ Tự động lưu" / "✓ Đã lưu"** (flash xanh 2s) ở header + tooltip "không cần nút Lưu". Wire `markSaved()` vào mọi điểm ghi. (ET đã có nút "💾 Lưu ET" rồi — chỉ builder thiếu.) ✓ tsc.

**ĐO TOKEN + QUY RA TIỀN (Thùy: cần check token / ra ₫ để điều chỉnh):** mọi call Gemini (`callGeminiJson`+`callGeminiRich`) gom vào meter PHIÊN (`recordUsage`); bảng giá **sửa được** `GEMINI_GIA` (USD/1tr token, thinking=output) + `USD_VND` ở api.ts; `geminiCostVND(usage,model)`. **Badge nổi** `GeminiMeterBadge` (góc dưới-phải, mount App): "X lần · Y token ≈ Z₫" realtime (subscribe `onGeminiMeter`), nút ↺ reset, ẩn khi chưa gọi. IngestSpike panel token thêm ≈₫. Giá PROVISIONAL → chỉnh theo ai.google.dev/pricing. ✓ tsc+build.

**CLONE GIẢI SAI TOÁN (#3) — bật suy luận (Thùy phát hiện lập-phương-trình sai nhiều):** gốc đúng như chẩn: `callGeminiJson` đặt `thinkingBudget=0` cho Flash + clone bị ép Flash → clone SINH toán KHÔNG suy luận → dựng/giải sai dù bài dễ. Fix: `callGeminiJson` nhận `opts.think`; DangHub truyền `think: isClone ? 8192 : 0` (CLONE=generation cần nghĩ; NHẬP-CHUỖI=extraction giữ 0). KB4 (lý thuyết) ổn theo Thùy. ✓ tsc+build. **CÒN #3:** call tự-kiểm độc lập (giải lại + số đẹp → cờ đỏ) — làm tiếp nếu vẫn sai sau khi bật thinking. (#1 bảng · #2 ⋮ vẫn chờ.)

**PHASE 2 FULL — ADR + KB2 (Thùy: build full Phase 2 rồi sửa Phase 0 1 thể, tránh vá xong lại vỡ):** 4 kịch bản chứa hình: (1) cắt 1 bài→kho [đã có] · (2) 1 PDF của 1 dạng→kho · (3) file tổng hợp nhiều dạng→người điền dạng→route về kho · (4) lý thuyết có hình→đặt hình đúng vị trí. **Chốt: KB3 người điền dạng TAY 100%** (AI xếp dạng = tương lai khi kho đủ bài chuẩn làm mốc — xếp sớm lúc kho loãng sẽ sai). Thứ tự build 2→3→4. **ADR đẩy Notion:** [ADR — Bộ xử lý tài liệu](https://app.notion.com/p/384d4530bcdb815093a1d601c29c7bab) (con ERP V2).
- **[DONE] KB2** — `IngestSpike` thêm nút **"📚 Cả tài liệu"** (`analyzeAll`: loop mọi trang PDF, mỗi trang 1 call, gộp câu + cộng dồn token; refactor `readCanvas`/`raster`) bên cạnh "🔍 Trang này". Lưu hết vào dạng đang mở. ✓ tsc+build.
- **CÒN (Thùy đổi thứ tự → 2→4→3):** KB4 TIẾP THEO · rồi KB3. Rồi Phase 0 #1/#2/#3 cùng đợt.
- **[DONE] KB4 — lý thuyết kèm hình:** editor lý thuyết (BanDo) thêm nút **"🖼 Bóc + hình"** (cạnh "🪄 Bóc chữ"). `runAutoHinh`: mỗi file/trang → render canvas DPI cao (`fileToCanvases`) → `callGeminiRich(buildTheoryIngestPrompt, THEORY_SCHEMA)` trả `{noi_dung có [[Hn]], hinh:[{box}]}` → cắt từng hình (`cropCanvasBox`) → upload → thay `[[Hn]]` bằng `![](url)` đúng vị trí → gộp các trang vào `noi_dung`. Xử lý TỪNG canvas (bbox không lẫn). Util mới `src/lib/pdfRender.ts` (`fileToCanvases`/`canvasToJpegBase64`/`cropCanvasBox`) dùng chung. lib `buildTheoryIngestPrompt`/`parseTheoryIngest`/`THEORY_SCHEMA`. ✓ tsc+build. CHƯA test e2e (cần tài liệu lý thuyết có hình thật).

**FIX JSON lỗi #2 "Expected , or }" → bật responseSchema (constrained decoding):** sau khi vá backslash vẫn lỗi kiểu khác (dấu `"` chưa escape giữa chuỗi LaTeX/lời giải). Vá-tay từng kiểu = đuổi mãi → gốc: thêm `responseSchema` vào `callGeminiRich` (opts.schema → `generationConfig.responseSchema`) ép Gemini xuất JSON đúng cấu trúc + tự escape. `INGEST_SCHEMA` (Type enum UPPERCASE, required tối thiểu de_bai). `lenientJsonParse` giữ làm lưới. Spike output trang dày = ~13k token (vẫn ~cent/trang). ✓ tsc+build. (Cân nhắc áp responseSchema cho clone/batch luôn nếu còn lỗi JSON.)

**FIX JSON "Bad escaped character" (spike + clone/batch):** Gemini trả LaTeX 1 backslash (`\dfrac`) trong chuỗi JSON → `JSON.parse` ném. Thêm `lenientJsonParse`: parse thẳng trước, lỗi thì nhân đôi mọi backslash KHÔNG thuộc escape hợp lệ (regex `/\\(["\\/bfnrtu])|\\/g` — consume cặp escape hợp lệ nguyên vẹn, chỉ double backslash lẻ) rồi parse lại. Áp cho **cả 4** parser (clone/batch/ingest/+1). Spike đo thật: **~9.7k token/trang** (input 1.2k + output 8.6k, Flash, think 0) → đúng ước tính ~cent/trang. ✓ tsc+build.

**PHASE 2 — SPIKE ingest (Thùy: nhiều bài có hình, cần đo khó/tốn trước khi cam kết):** đánh giá CTO: khó = TRUNG BÌNH (phần lớn tái dùng pdf.js/crop/upload/saveCauBatch/Gemini; chỉ mới = prompt segmentation + màn duyệt); tốn = token KHÔNG phải bottleneck (~cent/tài liệu trên Flash; vụ cháy 1.3tr là bất thường do uncapped); chính xác = "đủ tốt + người duyệt nudge". Thùy chốt **làm spike đo thật**.
- **Build spike:** `src/screens/kho/IngestSpike.tsx` (nút "🧪 Nhập tự động (thử)" trong DangHub, leaf dạng). Nạp PDF/ảnh → render trang DPI cao → gửi ảnh downscale (~1300px JPEG) cho Gemini → `buildIngestPrompt` (dò câu + `co_hinh` + `box_hinh` [ymin,xmin,ymax,xmax] 0–1000) → `parseIngestJson` → tự cắt hình từ bản DPI cao → hiện **token usage (in/out/think)** + danh sách câu (đề + ảnh cắt) để duyệt → `saveCauBatch` (upload ảnh→anh_de). lib mới `callGeminiRich` (trả `{text, usage}` đo token) · `buildIngestPrompt`/`parseIngestJson`/`IngestCau`. Model chọn được (flash-lite/flash/pro) + toggle suy luận để so. ✓ tsc+build. **Cần Thùy chạy 1 tài liệu THẬT** → đọc token/trang (×giá Google) + đếm AI dò đúng mấy %, hình cắt có ôm đúng không → quyết build full Phase 2 hay không.

**PdfCropper — nhớ PDF giữa các lần cắt (Thùy chọn, giảm thao tác nhiều ảnh):** 1 file nhiều hình cho nhiều câu → trước phải upload lại PDF mỗi câu. Thêm cache module-level `cachedPdf {doc,name,page}` (sống theo phiên, pdfjs doc proxy không destroy nên tái dùng được): mở cropper → useEffect khôi phục PDF + trang vừa rồi, header hiện 📄 tên file + nút "Đổi PDF/ảnh". Vẫn thủ công chọn câu (AI tự gắn ảnh↔bài = Phase 2). ✓ tsc+build.

**PdfCropper — fix vị trí cắt lệch con trỏ (Thùy):** `zoom:1.15` ở #root → `clientX` (hệ viewport) vs `getBoundingClientRect()` (đã zoom) lệch hệ → `clientX - rect.left` sai 1.15×. Fix: map bằng TỈ LỆ `((clientX-rect.left)/rect.width)*canvas.width` (chống mọi zoom/scale). Overlay box vẫn đúng (cùng wrapper zoom). ✓ tsc. (Bài học chung: mọi pixel-math trên element trong #root phải chia rect.width, KHÔNG trừ thẳng — do zoom:1.15.) **Còn chờ Thùy:** nhiều ảnh/bài = AI tự gắn ảnh↔bài (Phase 2 ingest, chưa làm) — hiện thủ công 1 crop/ô-ảnh-mỗi-câu.

**LÝ THUYẾT — chèn ảnh inline (Phase 0 nối tiếp, Thùy: lý thuyết ko thấy chỗ cắt):** crop mới wire ở câu hỏi (ImageSlot), lý thuyết chưa. Bổ sung: (1) `MathText` (kho/ui.tsx) hỗ trợ `![alt](url)` → `<img class="mt-img">` (tách `renderText`→`renderBold` + lớp ảnh trước) → hiện ở MỌI nơi render lý thuyết (màn + PrintView). CSS `.mt-img` ở index.css (màn, max-h 360px) + PrintView CONTENT_CSS (in, max-h 60mm, break-inside avoid). (2) Modal lý thuyết (BanDo) thêm nút **"✂️ Cắt hình chèn"** → PdfCropper → `uploadKhoImage` → chèn `![](url)` tại vị trí con trỏ (taRef). KHÔNG migration (ảnh = markdown trong noi_dung). ✓ tsc+build.

**CLONE/TÀI LIỆU — Phase 0 (Thùy chốt phương án, bàn kỹ trước):** vấn đề clone gom 3 + 1 tầng trên. **Reframe gốc: tách EXTRACTION (đọc cái có sẵn — #1 hình/bảng, #2 chia hết) vs GENERATION (tạo mới đúng — #3 hệ pt).** Quyết: #3 bật suy luận cho clone + 1 call kiểm độc lập (chưa scale) · dạng tính toán đi LLM+tự-kiểm (chưa template) · hình = **CHỤP/CẮT ảnh gốc** (LLM không vẽ lại được), dạng có hình KHÔNG clone-đổi-số · hình áp ở: nhập-chuỗi-câu (cột anh_de/anh_dap_an sẵn) + lý thuyết dạng/chuyên đề (chèn markdown `![](url)`, KHÔNG migration). Thứ tự: vá 3 bug trước (Phase 0), ingest cả tài liệu để Phase 2.
- **[DONE] Công cụ CẮT HÌNH dùng chung** `src/components/PdfCropper.tsx` (cài `pdfjs-dist@4`): nạp PDF/ảnh → render trang ở **300 DPI** (hình vector nét) → kéo chuột khoanh vùng → cắt đúng vùng ở DPI cao → trả File PNG (caller tự upload). Hiển thị downscale ≤860px, map toạ độ về nguồn DPI cao khi cắt. Scan thì cap theo DPI gốc. Worker Vite: `pdf.worker.min.mjs?url`.
- **[DONE] Wire vào `ImageSlot` (DangHub)** — thêm nút "✂️ Cắt PDF" cạnh 🖼/📋 → PdfCropper → `uploadKhoImage` → onChange(url). Phủ ngay ảnh đề/đáp án per-câu (nhập chuỗi câu) + ảnh chung clone. ✓ tsc + vite build (worker = asset riêng 1.37MB).
- **[CÒN] Phase 0:** chèn ảnh lý thuyết (markdown render) · #2 chuẩn hoá ⋮→\vdots · #1 cho phép bảng `array` · #3 bật thinking clone + call kiểm + chặn clone khi có hình.

**PHIẾU BTVN TRÍCH XUẤT — bỏ trang bìa thừa (Thùy):** doc `loai='btvn'` (scope btvn) vẫn render `.pv-cover` ở đầu → bìa chiếm trang 1, `BtvnSheet` (`break-before:page`) đẩy nội dung sang trang 2 = trang 1 thừa. Phiếu BTVN đã có header riêng (tên tài liệu + Họ tên/Lớp/Điểm) nên bìa dư. Sửa (`PrintView.tsx`): (1) `scope!=='btvn'` mới render `.pv-cover`; (2) class `pv-doc-btvn` trên pv-doc + CSS `.pv-doc-btvn > .pv-btvn:first-of-type{break-before:auto}` → phiếu đầu bắt đầu ngay trang 1. ⚠ Dùng `>` + gate class vì scope `all` BtvnSheet là `<section>` DUY NHẤT trong BuoiBlock → `:first-of-type` trần sẽ áp nhầm (mất ngắt trang BTVN trong giáo trình). ✓ tsc.

**PROFILE THÀNH TÍCH — sửa khớp ADR §6 + bố cục lại (Thùy: lệch logic chốt + to quá):**
- **Lệch chốt:** zone "Thành tích thi đấu" đang là 6 DÒNG CỐ ĐỊNH (Top1 lớp/et/mt·Elo đỉnh·chuỗi·tổng). ADR §6 = **catalog + showcase TUỲ CHỌN: hệ gợi ý, HS tự ghim cái khoe** (`hoc_sinh_thanh_tich_ghim`). Sửa: → **4 ô showcase**, HS ghim ≤4 (nút ✎ Tuỳ chọn → chips chọn), chưa ghim → gợi ý 4 theo thu_tu, bù cho đủ 4. lib `getThanhTichGhim/setThanhTichGhim` (gami.ts, delete+insert theo thu_tu). Pool hiện chỉ 6 loại TÍNH ĐƯỢC (top1_lop/et/mt·elo_dinh·chuoi_di_hoc·tong_buoi); 6 loại kia (diem_10/9+/vượt-band/lên-band/chuỗi-btvn/chuyên-cần) chờ diem_thi/log/btvn.
- **Bố cục (ngang thừa/cao thiếu):** DESIGN_W 920→**1160** (landscape, fit dùng hết ngang); thu nhỏ phần trên (avatar 110→84, tên 24→20, gem 74→58, xpbar 30→24, padding panel 18→14); thẻ danh hiệu thấp lại (chim 140→100, hname 20→17, divider/hcards gap nhỏ). → fit scale gần 1, hết cuộn + bớt khoảng trống 2 bên.
- Style game Mythwings + 3 hệ điểm (Level/Elo/EXP-Xu) GIỮ NGUYÊN (khớp ADR §1). EXP→Xu bar vẫn ở (1 trong 3 tiền tệ).

**CHẤM BÀI TRÊN LỚP — VIEW MOBILE (Thùy: GV chấm trên điện thoại):** màn hẹp tự hiện view 1-bài-mỗi-màn (desktop giữ bảng cũ). Hook `src/hooks/useIsMobile.ts` (matchMedia `max-width:767`; KHÔNG bị zoom:1.15 ở #root tác động vì đọc viewport). `ChamTab` rẽ nhánh `isMobile` → component **`ChamMobile`** (cùng file): thanh chuyển bài ‹ Bài N/total › + dải pill cuộn ngang (pill xanh=đã chấm đủ cả lớp) + danh sách HS thẻ dọc, mỗi HS hàng 5 nút mức 1→5 to (h-12 grid-cols-5, thumb-friendly). Tái dùng nguyên handler desktop (`setMuc`/`gradeOf`/`addProblem`/`closePhase`/`DangPickerOne`) — chỉ đổi bố cục. Lý do per-bài: HS làm các bài khác nhau, GV đi quanh lớp chọn đúng bài đang xem rồi chấm. CHỈ tab ingame (ET/đánh giá chưa làm mobile). Bỏ "In phiếu" trên mobile (vô dụng). ✓ tsc sạch. CHƯA test e2e trên thiết bị thật.

## 2026-06-16

**IA sửa (Thùy): "Làm tài liệu" = HUB nhiều loại con** (Giáo trình·ET·Đề thi·Bổ trợ), KHÔNG để ET thành leaf riêng. → bỏ leaf `lamet`; thêm `LamTaiLieuHub` (tab con) render TaiLieuScreen/ETScreen; leaf `lamtailieu` → hub. (Đè điểm "leaf mới lamet" ở mục TẠO ET ngay dưới.)
**Trích xuất REDESIGN — cấp giáo trình + trạng thái gán (Thùy):** bỏ nút per-buổi; 1 nút "⬇ Trích xuất / Gán lớp" ở thanh giáo trình → `TrichPanel`: chọn LỚP → hiện DANH SÁCH BUỔI + TRẠNG THÁI đã gán cho lớp đó (buổi nào → ngày nào). Mig 0036: `tai_lieu.nguon_id`(master)+`nguon_buoi`(buổi phan-id) lưu trên doc trích → `listTrichXuat(masterId,lopId)` gom theo buổi nguồn → state {ngay,hasGT,hasBTVN}. Mỗi buổi: đã-gán hiện "✓ ngày"+gán-lại / chưa-gán hiện date+tick GT/BTVN+Gán. Đổi lớp → state riêng từng lớp.

**TRÍCH XUẤT BUỔI — master → doc con bám buổi (Thùy chốt model):** giáo trình master = chuỗi buổi (PHÁT TRIỂN, không gắn buổi); mỗi buổi = thực thể lý-thuyết + BTVN. **Trích xuất 1 buổi** → chọn lớp+ngày + tick [GT buổi][BTVN] → `trichXuatBuoi(masterId, buoiPhanId, {lopId,ngay,...,giaoTrinh,btvn})` copy phần của buổi (marker+dang cho GT buổi · marker+btvn cho BTVN) sang doc MỚI bám (lop_id+ngay): `loai='giao_trinh_buoi'` + `loai='btvn'` (VẬN HÀNH). Master giữ nguyên. **Kho hiện cả 3** (master phát-triển + 2 con vận-hành, phân biệt Loại + Gắn-buổi). Nút "⬇ Trích xuất" mỗi buổi trong TaiLieuBuilder + TrichModal (lớp+ngày+checkbox). PrintView: doc 'btvn' tự scope='btvn'; 'giao_trinh_buoi' render như giáo trình 1 buổi (buildBuois có `ensure()` nên phần lẻ vẫn gói vào buổi ngầm). → in "BTVN ngày 20/6" = vào Kho tìm thẳng, khỏi lục sách. (Bổ sung cho scope-toggle: toggle in từ master; trích xuất tạo doc riêng tìm được trong kho.)

**Tách quyển BTVN riêng (Thùy — tầm nhìn 2 quyển: lý thuyết/ví dụ vs bài tập):** PrintView thêm scope `all|giaotrinh|btvn` (segmented toolbar). Doc: 'giaotrinh' → BuoiBlock bỏ BtvnSheet · 'btvn' → CHỈ các BtvnSheet (mỗi buổi), bìa "Quyển bài tập". → in 2 lần ra 2 file PDF (giáo trình + BTVN). Lưu ý: trình duyệt 1 PDF/lần in, KHÔNG 1-click-2-file (muốn auto thì xuất server-side — sau).

**Fix BTVN: số câu reset mỗi dạng (Thùy):** `BtvnSheet` dùng `no={i+1}` (index trong dạng) → mỗi dạng đếm lại từ 1. Sửa: đếm LIÊN TỤC xuyên các dạng (counter `bno` chạy qua nested map) → Dạng 1: 1,2 → Dạng 2: 3,4,5.

**KHO TÀI LIỆU — bảng tổng mọi tài liệu (Thùy nắn: kho = nơi hiện TẤT CẢ để tái dùng):** leaf con `lamtailieu:kho` "📦 Kho tài liệu" → `KhoTaiLieuScreen`: BẢNG mọi `tai_lieu` (`listAllTaiLieu`, mọi loại) — cột Tên·Loại·Khối·Gắn-buổi(ET: lớp·ngày / "mẫu")·Ngày-tạo·Thao-tác. Cột cuối: **🖨 In** (loai='et'→ETPrintView, else PrintView) · Nhân bản (duplicateTaiLieu lop_id/ngay=null) · Xoá. Lọc theo loại + tìm tên. Loại mới (MT/đề thi/chuyên đề) tự hiện khi có. (Khác "Làm tài liệu" = nơi SOẠN; Kho = nơi TRA/TÁI DÙNG.)

**ET lưu trữ — LƯU MẪU để tái sử dụng (Thùy chốt):** `duplicateTaiLieu(srcId, {ten, lop_id?, ngay?})` copy tai_lieu+phần+câu+cau_hinh. Nút "💾 Lưu vào kho" trong ETBuilder → mẫu (lop_id/ngay=null). Danh sách ET tách **📦 Kho mẫu** (lop_id=null, nút "Dùng cho buổi" → duplicate gán lớp+ngày mới · "Sửa mẫu") + **ET theo buổi**. CreateETModal nhận `templateId` → nhân bản thay vì tạo rỗng. (Mẫu = tai_lieu loai='et' không gắn buổi; phân biệt bằng lop_id null.)

**Header/footer dải sóng: text rơi vào khoảng trắng trên sóng (Thùy — mọi tài liệu):** path sóng cũ phần MÀU chỉ phủ ~60% dải (footer V40 / header V68) → text canh-giữa nằm trên mép trắng phía trên sóng. Fix ở `buildPagedCss` (dùng chung): nâng path để dải MÀU cao gần hết dải (footer V14, header V84) → text nằm trọn trên màu. Áp mọi tài liệu (giáo trình + ET).

**ET phiếu — chấm THEO CÂU (Thùy):** ET khác BTVN ở phần điểm. (1) Họ tên + Lớp CÙNG 1 dòng (`pv-et-info` flex, Họ-tên co giãn / Lớp 42mm). (2) Thay ô ĐIỂM bằng **bảng ngang 2 hàng**: hàng trên `Câu i`, hàng dưới ô trống điền Đ/S; số cột = số câu (`pv-et-score` table-layout fixed). Chỉ bản HS.

**ET print — TÁI PHẠM lỗi đã fix + header lặp (Thùy bắt):** reuse PrintView nhưng QUÊN áp các override đã làm cho BTVN hôm trước → 2 lỗi quay lại: (a) gạch chân dưới heading "Phần …" (trông như dòng kẻ lạc) · (b) câu nhảy sang trang mới khi trang cũ còn chỗ (do `.pv-cau{break-inside:avoid}` mặc định). Fix: scope `.pv-et` → `.pv-h-dang{border-bottom:none}` + `.pv-cau{break-inside:auto}` + `.pv-math:first-child{break-after:avoid}` (mirror `.pv-btvn`). + Header phiếu bớt LẶP: bỏ eyebrow "ET·LỚP·ngày" + dòng mã (tên ET đã có lớp+ngày) → chỉ "Đề ET" + tên. **BÀI HỌC: reuse layout in PHẢI mang theo MỌI override page-break/CSS đã sửa, không chỉ component — nếu không tái phạm.**

**ET: in được + FORM hiển thị ≠ loại kho (Thùy):** `ETPrintView` (paged.js tái dùng `CauItem`/`buildPagedCss`/`CHROME_CSS` export từ PrintView): phiếu Họ-tên/Lớp/ĐIỂM + mã, 3 phần. **Form hiển thị là lựa chọn PER-CÂU trong ET (`cau_hinh.etFormByCau`), KHÁC `loai_cau` kho** — câu kho "trả lời ngắn" vẫn in dạng "tự luận" được. `etFormOf(c, ch)` (default: có phương án→trắc nghiệm · tu_luan→tự luận · còn lại→trả lời ngắn). In gom theo FORM: trắc nghiệm (phương án) · **trả lời ngắn = BẢNG** (đề trái/ô điền phải, GV hiện đáp án) · **tự luận = dòng kẻ** (bỏ phương án dù câu có, số dòng `btvnLinesByCau`). ETBuilder: nút "🖨 Xem/In" + mỗi câu segmented chọn form + ô "dòng" khi form=tự luận. Bản HS/GV.

**ET: chọn dạng = popup TO (Thùy):** SearchSelect dropdown bé → thay bằng `DangPickerOne` (modal inset-8%, full cao, duyệt chủ đề→chuyên đề→dạng + ô tìm, click 1 dạng = chọn+đóng). Nút hàng "+ chọn dạng…" mở nó. (SearchSelect vẫn dùng cho chọn LỚP lúc tạo — list ngắn.)

**ET đổi sang CÂU-CENTRIC + chống lạm dụng câu (Thùy):** luồng cũ (dạng-gom) sai → viết lại: ET = N hàng (mặc định 5), mỗi hàng chọn DẠNG → hệ gợi ý 1 câu → đổi/chọn được → "+ thêm câu". Lib: bỏ `setDangOfET`; ET = 1 phan `custom` chứa câu THEO THỨ TỰ (`getETCaus/setETCaus/etPhanId`); `suggestCauForDang(maDang, exclude)` trả 1 câu. **Chống xài-đi-xài-lại (least-used-first):** `cauUsage` đếm số lần câu xuất hiện trong `tai_lieu_cau` → mọi gợi ý (ET + autoSuggestByLoai/autoSuggestBtvn của giáo trình) xếp theo (ít-dùng-nhất, rồi gốc 'le') qua `cmpUsageLe`. 2 tầng (Thùy chốt): CỨNG trong buổi/đề không trùng (luyện⊥BTVN + ET nội bộ dedup); MỀM xuyên thời điểm = least-used (khác buổi dùng lại OK, đều tay). UI ETBuilder câu-centric: hàng = SearchSelect dạng + preview câu + ↻Đổi/✎Chọn(KhoPicker)/✕ + "+ Thêm câu". tsc+build pass.

**IA sửa LẠI (Thùy): con hiện THẲNG trong TREE, không hub-tab** — "tree để 1 click tới nơi; cái dùng mở ra, ko dùng tự đóng". → bỏ `LamTaiLieuHub`; `adminNavFromQuyen` gắn `LAMTAILIEU_CHILDREN` (lamtailieu:giao_trinh|et|de_thi|bo_tro) làm node con của `lamtailieu`; NhanSuHome route theo id con (TaiLieuScreen/ETScreen/placeholder). **NavTree auto-mở branch chứa mục đang chọn** (`chuaSelected` đệ quy) → branch khác tự gấp; vẫn toggle tay được.

**TẠO ET (#3) — màn RIÊNG, gắn buổi qua (lớp+ngày):** Thùy chốt: ET build riêng + pick dạng/câu ĐỘC LẬP giáo trình (buổi thực tế lệch tài liệu nên ET linh hoạt). **Mig 0035:** `tai_lieu.lop_id` + `tai_lieu.ngay` (nullable, chỉ ET) + index (lop_id,ngay) where loai='et'. Nối buổi = **match (lop_id, ngay)** KHÔNG FK buoi_hoc.id (lúc tạo buổi còn ẢO) — khi OPS mở buổi cùng lớp+ngày thì tab Chấm ET load (làm sau #4). **lib/tailieu:** ET = loai='et', nội dung tái dùng `tai_lieu_phan(loai='dang')`+`tai_lieu_cau` (KHÔNG buổi/BTVN); `createET/listET/getETByBuoi/setDangOfET/maET` (mã = ma_buoi+'.ET'); resolver dùng lại `getTaiLieuFull` (resolve cả phần dang). **UI:** leaf mới `lamet` "Tạo ET" → `ETScreen` (thư viện ET + CreateETModal chọn lớp[SearchSelect]+ngày+mã auto) + `ETBuilder` riêng (chọn dạng DangPicker → mỗi dạng Gợi-ý/Chọn-câu KhoPicker). **Export `DangPicker`/`KhoPicker`** từ TaiLieuBuilder để tái dùng. tsc+build pass. CÒN: #4 tab Chấm ET tự load câu từ ET (getETByBuoi sẵn).

**GỘP 1 MÀN (đúng spec gốc — Thùy nhắc):** spec từ đầu = 1 màn (vận hành ở "Việc của tôi" · phát triển = phần còn lại), KHÔNG tách 2 tab Nhân sự/Admin. Bỏ 2 tab top: `NhanSuHome` thành MÀN DUY NHẤT — 1 cây nav = `staffNavFromScope` (Việc của tôi + tra cứu lớp) ++ `adminNavFromQuyen` (leaf màn role cấp). 1 selection `staffLeaf`; content router gồm viec/class + mọi màn (Kho/Làm tài liệu/NS/Lớp/HS/TKB/Phân công/Sơ đồ/Buổi học/Phân quyền). Xóa `AdminScreen.tsx`; App bỏ `screen` toggle; TopBar bỏ tab + bỏ DEV "xem với vai trò" (mock, inert vì content theo me/scope/quyen thật). → Người đội nhiều vai (Cường = Học thuật + GV/TG) thấy 1 màn, nav = Việc của tôi · Kho · Làm tài liệu… Hết "2 chế độ". (Bài học xuyên buổi RBAC: **team ≠ ghế** — role bám VỊ TRÍ, gán ở Phân quyền tab "Gán role cho vị trí"; ghế trống tên khó bind → nên bắt buộc tên vị trí.)

**LÀM TÀI LIỆU — đại tu sang model BUỔI (tầng 1) + sửa loạt bản in (Thùy review từng bước):**
- **Bố cục bản in (trước khi đổi model):** bỏ logo bìa (giữ 1 logo ở header mọi trang) · footer dải sóng full-width (path cũ chỉ vẽ tới x≈520 → nửa phải trắng, chữ trắng mất hút) cao 15mm + lề dưới 22mm (hết đè chữ) · số trang đậm (#1f2937/800/12px) · header con to hơn body 17px (Lý thuyết·Ví dụ 18, Bài luyện 18, Dạng 20, LT-chuyên-đề 21).
- **In đậm (boldify trong MathText, `ui.tsx`, chỉ text NGOÀI $…$):** cụm "Dấu hiệu(/nhận biết)" + MỌI TỪ VIẾT HOA (≥2 ký tự, `\p{Lu}`+`\p{Nd}`; áp toàn app — nhất quán autoBold nhãn cũ).
- **MODEL BUỔI (Thùy chốt kiến trúc):** Giáo trình → **Buổi (tầng 1)** → Dạng (chọn từ mọi chuyên đề, kể cả 1 phần chuyên đề). Mỗi buổi: trên lớp + BTVN. **LT chuyên đề DERIVE** từ chuyên đề của dạng (chuyên đề tách 2 buổi → cả 2 buổi đều hiện LT của nó). BTVN setup Y HỆT trên lớp (per-dạng, số câu mỗi loại), né câu đã dùng ở luyện.
- **Storage (KHÔNG migration — `loai_phan` TEXT, `cau_hinh` jsonb):** thêm `loai_phan='buoi'` (mốc) + `btvn` đổi thành per-dạng (`ref_ma=ma_dang`). BỎ `themChuyenDe`/`ensureBtvnPhan` (rổ BTVN phẳng cuối). Hàm mới: `addBuoi`/`deleteBuoi`/`setDangOfBuoi` (tạo-xoá cặp dang+btvn + reorder toàn doc, sort theo `ma_dang` → dạng cùng chuyên đề liền nhau). Resolver thêm `ltChuyenDe`/`tenChuyenDe` map (derive). DangRow +`ma_chuyen_de`/`ten_chuyen_de`.
- **Builder viết lại quanh buổi:** "+ Thêm buổi" → "+ Chọn dạng" (DangPicker đa chọn) → mỗi dạng card 2 khối: 📘 Bài luyện + 📝 BTVN (counts riêng + Gợi ý + Chọn câu + ô số-dòng-kẻ/câu). Cây trái Buổi→Dạng→BTVN. (Bỏ select Watermark khỏi chrome — chưa render bao giờ.)
- **In theo buổi:** mỗi buổi sang trang + dải tiêu đề "Buổi N"; dạng đánh số LIÊN TỤC toàn giáo trình. BTVN = phiếu riêng/buổi (header Họ-tên/Lớp/ô-ĐIỂM, nhóm theo dạng), câu TỰ-LUẬN/TRẢ-LỜI-NGẮN có dòng kẻ chấm (số dòng/câu = `cau_hinh.btvnLinesByCau`, default 5); **trắc nghiệm KHÔNG kẻ**.
- **Sai→sửa (Thùy soi từng cái):**
  - BTVN "rổ phẳng + chỉ 1 dạng" → per-dạng theo model buổi.
  - Câu/khối nhảy nguyên sang trang để TRỐNG cuối trang → bỏ `break-inside:avoid` ở `.pv-blk` (lý thuyết) + `.pv-btvn .pv-cau` (BTVN) → CHẢY liên tục; chỉ công thức `.mline` giữ atomic.
  - "Dòng kẻ lạ giữa Dạng N và Câu 1" = **`border-bottom` full-width của `.pv-h-dang`** (KHÔNG phải wline) → bỏ gạch chân tiêu đề dạng trong BTVN.
- ✓ tsc sạch. Thùy review "trông ổn". CHƯA tự test e2e tạo doc mới trên app (Thùy tự test). Tài liệu CŨ (chưa có buổi) builder mới không hiện nội dung → tạo doc mới.

**Kho tài liệu BỊ NHÂN ĐÔI (Thùy bắt):** nav có 2 "Kho tài liệu" — leaf ngoài `tl` (Danh mục) + leaf con `lamtailieu:kho` ("📦 Kho tài liệu" trong Làm tài liệu). Tệ hơn: `tl` chưa được route ở `NhanSuHome` → bấm ra "Chọn một mục bên trái" (chết); chỉ `lamtailieu:kho` chạy. **Thùy chốt: kho = nơi TRA/TÌM tài liệu, KHÔNG phải nơi làm → đẩy ra ngoài.** Fix: route `tl`→`KhoTaiLieuScreen` (NhanSuHome:206) + bỏ `lamtailieu:kho` khỏi `LAMTAILIEU_CHILDREN` (useStore). `KhoTaiLieuScreen` tự xử lý sửa ET/giáo trình nội bộ (state editEt/editGt) nên bỏ leaf con không vỡ luồng "sửa từ Kho". → còn 1 kho duy nhất ngoài Danh mục. (Đè điểm "leaf con lamtailieu:kho" ở mục KHO TÀI LIỆU phía trên.)

**BẢNG THÀNH TÍCH HS — seasonal (Thùy chốt qua ADR):** "profile HS" = bảng thành tích, thông tin cá nhân là phụ. **Quyết định CEO:** per-môn (KHÔNG tổng hợp) · **Season = 1 NĂM (niên khóa, START 1/7)**, hết mùa **EXP+Level reset** nhưng **huy hiệu/thành tựu giữ** (giống ranked game) · huy hiệu HOÃN · GĐ này: Elo·EXP·Level·Avatar-theo-level · **2 luồng 1 component**: màn Thành tích riêng (mọi HS, showcase) + tab trong Học sinh · màn Thành tích TÁCH khỏi GamiDiemScreen (staff tool), chung query khác trình bày.
- **CTO chốt 2 điểm:** Elo **KHÔNG reset** (Elo=giỏi tới đâu/dài hạn; Level=cày bao nhiêu/mùa — tách vai) · mốc mùa = **niên khóa** (khớp lên lớp+khai giảng).
- **Cơ chế đẹp:** "reset EXP mùa" = **WINDOWING theo created_at**, KHÔNG xoá data (`gami_exp_ledger` append-only) → mùa cũ truy lại được; Level=hàm thuần của EXP-mùa → tự reset. **GẦN NHƯ 0 SCHEMA MỚI.**
- **Build:** engine thuần `src/gami/season.js` (seasonOf/seasonStartUtc/seasonEndUtc, START 1/7 giờ VN qua Date.UTC -7h) + `level.js` (stepCost tuyến tính·cumExpFor·expToLevel·avatarTier·avatarStage emoji PLACEHOLDER 7 bậc; LEVEL.MAX=21, ngưỡng PROVISIONAL chờ calibrate sau mùa 1). Config `SEASON`+`LEVEL` mới. Fixture test thêm vào verify_gami.mjs (✓ pass). Service `gami.ts`: `getThanhTich(hsId)` (per-môn: Elo+EXP-mùa windowed+level+avatar+hist) · `listThanhTich(mon?)` (leaderboard EXP-mùa, windowed ở DB `.gte('created_at',start)`) + helper `vnToday()`. UI: `BangThanhTich` (showcase: HeroCard avatar+level-progress+3 stat, EloHistory, BadgesPlaceholder) dùng chung · `ThanhTichScreen` (grid card mọi HS→modal) leaf `thanhtich` (Vận hành) · tab "Hồ sơ|Thành tích" trong HocSinhScreen EditModal. ✓ tsc + vite build sạch. CHƯA test e2e với data thật (cần buổi đã đóng sinh EXP).

**THÀNH TÍCH — Thùy nắn lại model (QUAN TRỌNG, đè phần trên):** "logic gần chuẩn, UI sửa nhiều".
- **EXP ≠ nguồn Level** (đè giả định cũ "Level=f(EXP-mùa)"). **EXP = lương THÁNG → xu, reset hằng tháng, KHÔNG phải thành tựu** → BỎ EXP khỏi bảng khoe (EXP/xu thuộc màn lương sau).
- **Level = pool "điểm tiến trình" RIÊNG (Thùy: define sau)** → Level + avatar dựng PLACEHOLDER ("cấp độ sắp ra mắt"), nối nguồn thật khi define. (level.js/expToLevel giữ DORMANT, chưa wire.)
- **Bảng khoe gồm:** ① Elo: **Elo cao nhất** (peak từ history) + **Rank** · ② Level (placeholder) · ③ **3 huy hiệu/mùa** chưa đạt = **bóng đen + thanh %** + click→nhiệm vụ (define sau). Avatar theo level. **BỎ lịch sử Elo** (khoe, không phải log). Màn **FULL-SCREEN, không popup**.
- **Rank = THỨ HẠNG leaderboard (Thùy chọn, KHÁC tier).** "Hạng CAO NHẤT từng đạt" cần snapshot hạng theo thời gian (CHƯA có cơ chế — hạng phụ thuộc Elo người khác, ko suy ngược) → giờ hiện **hạng HIỆN TẠI** (đếm elo cao hơn trong môn). TODO: ghi best_rank mỗi buổi đóng (đề xuất, chờ Thùy).
- **Refactor:** `getThanhTich` bỏ EXP/level/history → trả {elo, eloPeak, rankNow/rankTotal} per môn. `listThanhTich` lean (elo+rankNow theo môn, bỏ exp/level). `BangThanhTich` rebuild (Hero placeholder + EloPanel 3 ô + Badges 3 bóng đen). `ThanhTichScreen` click HS → board FULL-SCREEN (bỏ modal). ✓ tsc+test+build sạch.

---

## 2026-06-15

**RBAC FEATURE-ACCESS lớp ① (Thùy chốt: role-based + bật/tắt MÀN):** trước đây access hardcode 2 lớp — cờ `founderOnly` trong `mock/fixtures.ts` + cây menu đọc từ **mock `users`**, chưa nối auth thật → "chung hết". Giờ:
- **Tách 3 lớp quyền, đừng lẫn:** ① feature-access (mở được màn nào — LÀM cái này) · ② task-scope `getMyScope` (đã có) · ③ data-scope (đã có 1 phần). Lớp ① = cổng thô menu/route, KHÔNG đụng ②③.
- **Mô hình:** "vai trò" (role) = bó chức năng đặt tên → gán cho VỊ TRÍ (không gắn thẳng từng ghế = nổ số lượng). Quyền 1 người = UNION role các ghế (khớp "quyền đến từ GHẾ", đa-ghế cộng dồn). Founder = `tai_khoan.la_admin_he_thong` bypass (tự gồm leaf mới). Anti-NULL §1.5: không cấp = KHÔNG có dòng (không lưu cờ false).
- **Migration `0032_rbac_feature_access`** (⚠ ĐÃ trùng số 0030 lúc tạo — folder đã có 0030_khoi_text + 0031_gami; đổi tên → 0032; DB apply riêng nội dung idempotent rồi): bảng `vai_tro` · `vai_tro_chuc_nang`(role→leaf-id) · `vi_tri.vai_tro_id` FK · `tai_khoan.la_admin_he_thong` bool. RLS member_all cho 2 bảng mới (0026 chỉ phủ bảng cũ — phải khai tay). RPC `my_quyen()` security-definer trả {la_admin, chuc_nang[]} 1 dòng/login.
- **Code:** `src/lib/quyen.ts` (seam: myQuyen + CRUD role + setRoleChucNang diff + setViTriRole + listViTriGan) · store thêm `quyen` + `loadQuyen` + selector `accessibleLeaves/canAccessAdmin/adminNavFromQuyen` (gate THẬT, bỏ founderOnly mock) · App load quyền theo session + màn "Đang tải quyền…" · TopBar tab Admin theo quyền thật, **dropdown DEV "xem với vai trò" giờ chỉ Founder thấy** · AdminScreen nav từ quyền thật + route-guard (lá ngoài quyền → nhảy lá đầu / "không có quyền") · leaf mới `phanquyen` (nhóm Hệ thống, founderOnly).
- **Màn `src/screens/phanquyen/PhanQuyenScreen.tsx`** (Founder): tab "Vai trò & chức năng" (list role + tick chức năng từ `adminLeaves` group theo nhóm + lưu diff) · tab "Gán role cho vị trí" (bảng vị trí × select role).
- **Bootstrap:** set `la_admin_he_thong=true` cho Thùy (tronbeolam@gmail.com, NS002) để khỏi tự khóa. Lộc (gtran19523/NS003) CHƯA set — cấp qua màn Phân quyền hoặc set tay sau.
- ✓ tsc sạch + vite build pass. CHƯA test e2e trên app (cần login Thùy → tạo role → gán ghế → login người khác kiểm menu). **Mock-bridge còn hở:** nội dung màn Nhân sự vẫn render theo mock `users[0]` — gate quyền thì THẬT, nội dung chưa nối account thật (gỡ dần).

**Phân quyền — tab 1 đổi sang MA TRẬN (Thùy chốt: set theo ROLE, dạng bảng tao in ra):** trước là sửa-từng-role (card + checkbox); đổi thành **ma trận hàng=role × cột=màn** (cột group theo nhóm, tên màn xoay dọc, sticky cột role), tick ô = lưu ngay (optimistic + setRoleChucNang diff). + Tạo/đổi-tên/xóa role inline, cột hiện số ghế đang gán (👤). Cột founderOnly đánh ⚠. Tab 2 (gán role cho vị trí) giữ nguyên.
**Seed bản nháp role** (`scripts/seed_default_roles.mjs`, idempotent): 6 role theo team (GV thường / Trợ giảng / Vận hành Ops / Học thuật / Media / Marketing) + bộ màn hợp lý mỗi role, gán cho MỌI ghế (20 ghế, 0 orphan). Là DRAFT để Thùy chỉnh trong ma trận — role→màn là CHÍNH SÁCH của CEO, không hardcode. Lộc (NS003) chưa có ghế nào → login Lộc vẫn menu rỗng tới khi gán ghế+role (tab 2).

**BUILD #1+#2 (theo ADR đo lường) — chấm bài map dạng + đánh giá sau buổi:**
- **Mig 0034:** `gami_session_problems.ma_dang` (TEXT, KHÔNG FK — dạng đa hình theo môn) · bảng `buoi_danh_gia`(per-HS nhận xét) · `buoi_danh_gia_dang`(per HS×dạng, `diem` ∈{0,0.5,1}, check constraint; KHÔNG dòng=chưa đánh giá, anti-NULL §1.5). RLS member-gate cho 2 bảng mới.
- **Service `gami.ts`:** Problem +`ma_dang`; `addProblem(…, maDang?)` + `setProblemDang`; getBuoi thêm `lop.khoi`; `dangCuaBuoi`(distinct ma_dang bài ingame) · `getDanhGia` · `setDanhGiaDang`(upsert/xoá khi null) · `setNhanXet`(upsert/xoá khi rỗng).
- **UI `BuoiHocScreen`:** đổi tab "Buổi học (chấm)"→**"Chấm bài trên lớp"** + thêm tab **"Đánh giá sau buổi"**. ChamTab(ingame): mỗi cột Bài có **SearchSelect gắn dạng** (options=listDaiDang theo khối lớp). DanhGiaTab: card mỗi HS có-mặt → mỗi dạng-của-buổi 1 thang {Chưa0/Một phần0.5/Hiểu1} (bấm lại=bỏ) + ô nhận xét (lưu onBlur). Dạng đánh giá = derive từ bài ingame (chưa gắn dạng→nhắc sang tab Chấm bài trước).
- Note: Elo (closePhase ingame) GIỮ NGUYÊN — chấm bài trên lớp vẫn ra điểm→Elo (đua); mastery thì lấy từ đánh-giá (đo) + (sau) raw bài cho AI. tsc+build pass. CHƯA test e2e trên app.
- **Gate header buổi + GV mặc định (Thùy test TA):** TA mở buổi từ Việc-của-tôi KHÔNG được hủy buổi / đổi GV → thêm prop `BuoiDetail.canManage` (OPS/admin=true, GV/TA=false): canManage=false ẩn nút Hủy + GV thành chữ read-only. GV trống do buổi mở TRƯỚC khi gán GV chính (snapshot nguoi_day=null) → `getBuoi` trả thêm `gv_chinh_id` (phan_cong gv la_chinh); header hiển thị `nguoi_day ?? gv_chinh_id` (mặc định = GV chính, "(chính)"; đổi mới ghi nguoi_day = dạy thay). NhanSuHome: OpenBuoi thêm canManage (OPS true, GV/TA false). (⚠ build đang vỡ vì Thùy sửa dở lib/tailieu.ts+TaiLieuBuilder — KHÔNG phải code buổi học; gami/nhansuhome/buoihoc type-clean.)
- **REVERT gate Admin về role-based (sửa quá tay):** đặt "Admin = la_admin only" là SAI — chặn luôn Học thuật (taquoccuong) vào Kho/Làm tài liệu. Mô hình ĐÚNG: **Admin tab = role→màn** (Học thuật thấy bdkt/lamtailieu; la_admin thấy hết); **việc vận hành (điểm danh/chấm) ở Việc-của-tôi** (theo phân công/team, không role-gated). "OPS = 1 màn" đạt bằng cách **role OPS không có màn Admin** (KHÔNG phải chặn cứng gate). App.showAdmin + TopBar về `canAccessAdmin`. ⚠ team≠ghế vẫn cắn: ghế "Học thuật" của Cường role=null (gán team không bám ghế), nhưng Cường vẫn có bdkt/lamtailieu qua role "GV thường" của ghế Giáo viên (union).
- **(ĐÃ REVERT) 2 tầng:** Tab Admin từng thử chỉ `la_admin` (App.showAdmin + TopBar đổi `canAccessAdmin`→`quyen.laAdmin`). Staff (kể cả OPS/GV/TA) KHÔNG còn thấy Admin — chỉ "Việc của tôi". → Phải đưa OPS vào work view: VietCuaToi nếu `opsToanHe` (biên chế ops) → `buoiAoCuaNgay(today)` → card "Mở buổi"(ảo)/"Điểm danh"(đã mở) → moBuoi rồi mở BuoiDetail tab điểm danh. NhanSuHome dùng state `openBuoi{id,tabs,initialTab}` chung cho OPS + GV/TA. (Phân quyền role→màn giữ hạ tầng — dùng khi sau có cấp quản lý không-founder; hiện Admin = la_admin.)
- **#2 — Định tuyến task ra màn GV/TA (luồng thật, Thùy chốt):** admin Buổi học = màn OPS; GV/TA nhận việc ở "Việc của tôi". `getMyTasks()` (gami.ts) pure-derive: buổi đang mở (trang_thai='mo', loai='thuong') của lớp tôi phân công (prof.phanCong) → task theo vai — **GV: đánh giá + chấm bài trên lớp · TG: chấm bài trên lớp + chấm ET** (Thùy chốt: chấm-bài-trên-lớp CẢ GV+TG vì lớp đông cùng chấm; graded_by ghi ai). `BuoiDetail` **export + prop `tabs`/`initialTab`** (gate tab theo vai; OPS/admin = đủ 4). `NhanSuHome` "Việc của tôi" hiện task card → bấm → mở BuoiDetail chỉ tab thuộc vai. ⚠ getMyTasks đọc **phan_cong_lop** (phân công dạy), KHÁC vi_tri (ghế/quyền) — test cần: lớp có buổi MỞ + người có phan_cong_lop. tsc+build pass. CHƯA test e2e.
- **Đánh giá sau buổi → BẢNG (Thùy):** mỗi HS 1 dòng; cột = tên HS · từng dạng-của-buổi (chip nhỏ kết quả mỗi bài LẤY TỪ chấm-bài để GV tham khảo + nút chốt mức {0/0.5/1}) · cột cuối nhận xét. Bao nhiêu dạng bấy nhiêu cột; dạng/câu thiếu để trống.
- **Nắn (Thùy):** giáo trình KHÔNG link cứng như ET — chấm-bài-trên-lớp KHÔNG auto được (không ai biết trước số bài / khi nào HS hiểu) → **GV tự thêm bài + chọn dạng trong/sau buổi = ĐÚNG**. Chỉ **ET cố định** mới auto-load từ tài liệu (#3). PA generation = **PA1 (live/pure-derive)**, KHÔNG có nút-chốt-spawn (ngược §4). Bảng phải **hiện SẴN**: `ensureProblems(buoiId,'ingame',10)` seed 10 bài-slot khi mở tab (bài=slot/cấu trúc, anti-NULL áp ở GRADE); ET KHÔNG seed (chờ #3). ChamTab/DanhGiaTab bỏ empty-state → luôn render bảng, dạng/câu thiếu để trống.

**ADR ĐO LƯỜNG buổi học & Mastery (Thùy chốt — đã ghi Notion con của "NS·Tổ chức·Vận hành — Quyết định LOGIC"):** bàn kỹ luồng sư phạm. Chốt:
- **1 buổi = 4 phần:** điểm danh (OPS) · **đánh giá sau buổi** (GV, nhận xét per-HS + verdict per-dạng, MANUAL không auto) · **chấm bài trên lớp** (ingame, mỗi bài map `ma_dang`, = dữ liệu QUÁ TRÌNH/phụ, KHÔNG feed mastery) · **chấm ET** (câu load từ tài liệu ET).
- **ET = tài liệu làm TRƯỚC** (đảo luồng): loại tài liệu mới trong "Làm tài liệu", chọn "của buổi nào" → sinh mã. Buổi lúc đó còn ẢO → ET gắn theo **(lớp+ngày)** = danh tính sinh ma_buoi, KHÔNG FK. Buổi materialize → match → load câu. Điểm danh↔ET chéo (triangulation): thiếu thì bổ sung, thừa vô hại.
- **Đơn vị đo (occasion):** test/ET = **mỗi bài 1 lần** (bài độc lập, năng lực tĩnh); buổi in-class = **1 verdict GV/dạng** (formative→summative, KHÔNG đếm từng bài vì là đường học đi lên — đếm bài sẽ thổi mẫu + kéo mastery oan). R7: lấy buổi làm đơn vị quan sát = chuẩn thống kê.
- **Thang điểm mỗi lần đo = {0, 0.5, 1}** (partial credit): đúng=1/một phần=0.5/sai=0; trắc nghiệm chỉ 0/1; tự luận+đánh giá có 0.5. Mastery **chỉ ăn KẾT QUẢ**, bỏ trình bày+tốc độ (2 cái đó cho Elo). Data sẵn: `gami_grades.result`=correct/partial/wrong=1/0.5/0.
- **Mastery = TB điểm X lần gần nhất trong Y → 3 mức** (≥0.8 mức1·≥0.5 mức2·<0.5 mức3·0 lần=chưa-đo). X=5 default, X/Y config. **Suy động KHÔNG lưu** (tránh bẫy HS×buổi/total_lich v1). Độ tin theo cỡ mẫu (§5). 2 cấp gom: trong-buổi (GV collapse) + toàn-cục (mọi occasion qua cửa sổ).
- **Trend = view derive, không lưu** (lưu raw event nên mọi cửa sổ tính lại được): 1 con số mastery chính thức = cửa sổ ngắn last-X; trend = so 5-gần-nhất vs 5-trước (không chồng) hoặc sparkline, bật khi đủ ~6-8 điểm.
- **Việc phải làm:** sửa tab ingame→"Chấm bài trên lớp" + thêm `gami_session_problems.ma_dang` · thêm tab "Đánh giá sau buổi" (bảng mới) · ET loại tài liệu mới gắn (lớp+ngày) · mastery engine suy động. CHƯA build (đang chốt model).

**Nối màn Nhân sự vào NGƯỜI THẬT (hết persona mock "Lộc TA"):** trước app vẽ mọi thứ theo mock `users[0]` → login ai cũng ra Lộc TA. Fix: (1) store thêm `me` (getMyProfile) + `loadMe` cùng `loadQuyen` lúc login, reset khi logout. (2) `PersonalCard` hiện tên/mã NS/ảnh/vị trí THẬT + badge Founder (theo quyen.laAdmin), fallback mock nếu account chưa link nhân sự. (3) `NhanSuHome` viết lại: nav từ `staffNavFromScope(getMyScope)` (lớp tôi phụ trách → loại việc, THẬT), bỏ `staffNavForUser` mock; "Việc của tôi" = placeholder THẬT (phạm vi từ scope: lớp phụ trách + OPS toàn hệ + giám sát) + ghi rõ "hàng đợi việc tự động chờ engine Vận hành" — KHÔNG bịa task mock. QueueHome/ChamETSheet mock giờ dead (chưa xóa). tsc + build pass. CÒN MOCK: hàng đợi việc derive (lớp Vận hành pure-derive) chưa dựng — độc lập identity.

**Khóa cứng CLONE không dùng Pro (fix gốc vụ cháy 920k):** Thùy báo hôm trước cháy 1tr2, trong đó 920k vì clone lỡ chạy Pro (đúng ra Flash 2.5 ~200k). Default đã là Flash từ trước, nhưng dropdown vẫn cho chọn Pro khi clone. Fix theo bài học "CAP cứng ở CODE, đừng tin UI": `DangHub` (1) ẩn Pro khỏi dropdown khi `isClone` · (2) `runAuto` ép `safeModel = isClone && pro → flash`. `BanDo` (bóc lý thuyết = OCR) GIỮ Pro làm tùy chọn (đôi khi cần đọc ảnh khó), default Flash. Lưu ý: code hiện CHỈ có gemini-2.5-* (flash/flash-lite/pro), KHÔNG có 3.1 — đường "3.1 pro" là code cũ. ⏳ Còn nợ: 429 "prepayment depleted" = hết tiền (Thùy nạp/đổi billing) + key đang PUBLIC trong bundle client (VITE_GEMINI_KEY → lộ → có thể bị gọi chùa) → cần proxy server-side (chưa code, chờ chốt).

**Sửa GỐC: cờ Founder chuyển tai_khoan → nhan_su (mig 0033):** lỗi tao gán nhầm admin cho Trang (tronbeolam/NS002), tưởng là Thùy. Thùy thật = **Đào Xuân Thùy NS001 daothuybk@gmail.com**, mà chưa có dòng `tai_khoan` → cờ admin để trên tai_khoan (=auth uid) thì Thùy login KHÔNG có gì. Lỗi thiết kế: member-gate (0026) nhận diện theo EMAIL khớp nhân sự (không cần tai_khoan), nhưng tao để cờ admin ở tai_khoan → không bootstrap được người chưa login. **Fix:** đưa `la_admin_he_thong` về `nhan_su` (thuộc tính NGƯỜI, set bằng ma_ns ngay), drop khỏi tai_khoan (mất luôn giá trị nhầm ở Trang). `my_quyen()` resolve nhan_su qua **tai_khoan HOẶC email** (CTE `me`, giống la_thanh_vien) → admin đọc từ nhan_su, chuc_nang từ ghế. Set NS001=admin. Verify: Thùy (chưa tai_khoan) → la_admin=true qua email-bootstrap ✓. **Bài học: cờ quyền gắn theo NGƯỜI/email-bootstrap, đừng theo auth-uid (chưa login = chưa có uid).**

**Fix khối = TEXT (mig 0030):** 4T/5T là KHỐI riêng (không phải hệ). `lop.khoi`/`hoc_sinh.khoi` smallint→text; re-derive lớp từ tên (`5T1`→'5T', `8A1`→'8'), HS từ lớp Toán. Quy tắc tên: số+T (chỉ 4T/5T) = khối; S/A/B/C = hệ; ≥6 không có T. Bỏ `Number(khoi)` + revert KHOI_LOP → screens dùng lại KHOI_OPTIONS đầy đủ.

**Dọn data cơ cấu lại:** xóa ghi danh `hoc_sinh_lop` của HS khối 6-10 (289 dòng — Thùy xếp lại tay; giữ HS+lớp). Xóa 5 lớp T sai khối≥6 (6T1/6T2/6T3/7T1/8T1, cascade). Giữ 4T1/5T1 (khối hợp lệ).

**THIẾT KẾ LUỒNG SESSION (bàn kỹ — mảnh khó nhất, cầu static→động):**
- Mâu thuẫn lõi: "buổi pure-derive không đẻ dòng" vs "gami cần id buổi để FK". Giải: buổi **2 trạng thái** — ẢO (suy từ TKB×ngày, chưa dòng) → **THẬT** khi OPS bấm "Mở buổi" (đông cứng snapshot).
- Mã buổi: `id`(uuid)+`lop_id` là khóa thật; `ma_buoi` text đọc = `8A1.T2.15062026` (snapshot). Bù: hậu tố `.B`.
- Vòng đời: Ảo → Mở → điểm danh → chấm ingame → đóng → (HS về) chấm ET → đóng → Hoàn tất. "Hủy buổi" = lật trạng thái (không xóa con) → task tự ngừng (pure-derive). Nghỉ/hủy cả lớp = KHÔNG bù; HS lẻ vắng = bù cá nhân.
- **Taxonomy buổi:** thường / bù (con-của-buổi-gốc, link bù gắn PER-HS trên `buoi_hoc_hs` — 1 buổi bù phục vụ HS nhiều buổi gốc/lớp khác nhau) / bổ trợ yếu (từ data đo, quan trọng nhất) / bổ trợ đuổi (kiến thức thiếu để vào lớp) / MT. Bổ trợ ad-hoc, tool xếp lịch riêng sau.
- **Dạy thay:** `buoi_hoc.nguoi_day` = GV THỰC TẾ (mặc định = phân công); việc buổi theo người dạy thực tế.
- **Elo/EXP/mastery theo loại:** thường+MT → Elo + EXP-theo-hạng + mastery; bù/bổ trợ → KHÔNG Elo (nhóm nhỏ), EXP = sàn (`attend_floor`, đi học là có), vẫn đo mastery. ET buổi thường VẪN tính Elo (cả lớp). Bổ trợ yếu/đuổi = luồng riêng, bàn sau.

**GAMI GĐ A — code:**
- **Schema (mig 0031):** `buoi_hoc` + `buoi_hoc_hs`(điểm danh+bu_cho_buoi_id per-HS) + 5 bảng gami (`gami_elo / session_problems / grades / elo_history / exp_ledger`). member-gate RLS (KHÔNG disable như spec gốc — chuẩn V2). Map students→hoc_sinh, sessions→buoi_hoc.
- **Engine PURE** `src/gami/*.js` (spec ghi .js → JS thuần, test bằng `node scripts/verify_gami.mjs`, KHỎI cài vitest): `config.js · elo.js · exp.js`. Test PASS — fixture Elo khớp TUYỆT ĐỐI (An−28→1172…), ΣE=10 ΣΔ=0, expForRank đơn điệu mọi N 5-15. (tsconfig thêm allowJs để .ts import .js.)
- **Service** `src/lib/gami.ts` (seam): buoiAoCuaNgay · moBuoi(snapshot+seed sĩ số) · huyBuoi · getRoster/diemDanh · addProblem/gradeProblem · **closePhase** (Elo cho thường/MT, EXP sàn cho bù/bổ trợ, idempotent qua cờ *_dong_at, 2 event ingame→et).
- **UI** `src/screens/gami/BuoiHocScreen.tsx` (Admin→Vận hành→Buổi học): ngày→list buổi ảo→Mở buổi→detail 3 tab (Điểm danh / Buổi học chấm / ET) + ma trận chấm + popup 3 thang + Đóng phase→reveal hạng/EXP/Elo + đổi GV dạy thay + Hủy buổi. ⚠ CHƯA test e2e (cần login + lớp có TKB+khai giảng≤ngày+HS ghi danh). Màn TIVI (đường đua animation) CHƯA làm — reveal đang bảng tĩnh.

**SearchSelect (Thùy chốt quy tắc cố định):** CẤM dropdown cho list dài → component `src/components/SearchSelect.tsx` (combobox, lọc bỏ-dấu tiếng Việt, prop `invalid`). Sweep: HS ghi danh(300)/nhân sự(40,×2)/lớp(46 TKB)/người+vị-trí-cha(Sơ đồ) → search. Giữ dropdown enum ngắn (vai/thứ/band/khối/lớp-theo-môn-đã-lọc). Memory rule đã lưu.

**Card lớp** (LopScreen): thêm sĩ số + GV/TG + badge "✓ Đủ thông tin / Thiếu: GV chính·TG·TKB·band x/y" (`thongKeLop`).

**Notion:** trang "Nhân sự·Tổ chức·Vận hành — Quyết định LOGIC" (con ERP V2) + đã có trang Gamification.

---

## 2026-06-12

**(Gồm cả phần 06-11 tối ở cơ quan — commit `05a0d17 "dx"` chưa kịp log):**
- **Biên chế team n-n** (mig 0024→0025): `nhan_su_team`. Form NS chọn team biên chế (để org chart LỌC picker người theo team). 0024 lỡ thêm `nhan_su.team_id` (1 team) → sai → 0025 thay bảng nối + drop cột.
- **🔒 RLS member-gate (mig 0026):** bỏ "cứ authenticated là vào" → chỉ THÀNH VIÊN (có `tai_khoan` link nhân sự HOẶC email login trùng email 1 nhân sự). Người lạ signUp = tài khoản rỗng, mọi bảng từ chối. Functions `jwt_uid()/jwt_email()/la_thanh_vien()/self_link_account()` (security definer, KHÔNG dùng auth.uid() vì claude_build cấm schema auth — đọc `current_setting('request.jwt.claims')`).
- **Cấp tài khoản trên web** (`capTaiKhoan`): signUp bằng CLIENT PHỤ (persistSession:false) → admin không bị đá session. Cột "Tài khoản" ở bảng NS: ✓ có TK (click = gỡ link) / + Cấp TK. ⚠ cần Dashboard tắt "Confirm email" 1 lần. `goTaiKhoan` gỡ dòng nối mồ côi (xóa user Auth không tự xóa `tai_khoan`).
- **Hồ sơ của tôi** (`HoSoModal`, nút 👤 TopBar): NS tự sửa ảnh/SĐT/email; team/vị trí/phân công CHỈ XEM.

**IMPORT V1 → V2 (data thật 2025-26):**
- `scripts/import_v1.mjs` (idempotent): 327 HS (299 đang học/1 bảo lưu/28 nghỉ — nghỉ giữ hồ sơ ko ghi danh) · 46 lớp (bậc đoán từ tên: 8A1→A, 5T1→S) · 277 PH (dedup ma_ph → anh em chung PH) · 369 lượt ghi danh (4 cột lop_*→hoc_sinh_lop). Band V1 "Upper/Inter/Lower - X" → X1/X2/X3 (Upper=1 xịn nhất); band "T" → S1. Band gắn lớp TOÁN (per-môn).
- `scripts/import_v1_tkb.mjs`: 76 ca/tuần từ V1 `timetable`+`ca_hoc` → `thoi_khoa_bieu`.
- **LÊN LỚP 2026-27** `scripts/len_lop_2026.mjs` (1 transaction, guard chống chạy lại): K12→`tot_nghiep` (mig 0027 thêm trạng thái) + rời lớp; HS khác khoi+1 (314); lớp khoi+1 & đổi tên (8A1→9A1, K6→K7); lớp 12 đóng + ngừng TKB.

**TKB — màn lịch tuần (lặp NHIỀU vòng, Thùy phản biện gắt):**
- Tiến hóa: bảng-ca → calendar-tỷ-lệ (dị, phình khung tối) → **chốt: KHUNG LỚN cố định** (7:30-10 / 10-12 / 12-14 ẩn khi rỗng / 14-16 / 16-18 / 18-19:30 / 19:30-21:30). Ca xếp vào khung theo **giờ BẮT ĐẦU** (bỏ giờ kết thúc → 19:30-21:00 & 19:30-21:30 chung khung). 6-7 hàng cố định → LỌT 1 MÀN. Mỗi ô = lưới phòng 3×2 CỐ ĐỊNH (P101..P302), trống chừa trống. Card: tên lớp 13px đậm / giờ thật / phòng. Header thứ freeze.
- **Bài học:** TKB trường học là CATEGORICAL (ca×phòng×lớp), KHÔNG phải calendar liên tục → đừng map tỷ lệ pixel theo giờ (vô nghĩa + phình). Mọi TKB giấy đều vẽ rời rạc vì lý do này.

**Lớp — màu & khu vực:** chia 4 KHU theo môn (Toán→Văn→Anh→KHTN), trong khu sort S→A→B→C; chip màu = HỆ (BacChip S tím/A xanh/B teal/C vàng). Bỏ ý "màu theo môn" (lẫn) → môn phân bằng KHU, hệ bằng màu.

**Ghi danh chuẩn §1.5 + §4 (Thùy chốt — đau V1):**
- `ngay_vao`/`ngay_roi` (mig 0028) = cổng thời gian data học tập (BTVN/ET chỉ tính từ ngày vào). Viền vàng nếu trống.
- **TRIGGER log §4**: `hoc_sinh_lop_log` + trigger tự đẻ dòng (actor jwt_uid + ts + cũ/mới jsonb) mọi ghi_danh/roi_lop/doi_band. App không phải nhớ.
- **Add vào lớp chỉ HS CHƯA có lớp môn đó** (`listHSChuaCoLopMon`); HS có rồi → **CHUYỂN LỚP** (`chuyenLop` = rời cũ+vào mới, log 2 sự kiện).
- **Khai giảng = thuộc tính LỚP** (mig 0029 `lop.ngay_khai_giang`, K9/K12=16/6, khác=1/7) — KHÁC `tkb.hieu_luc_tu` (cơ chế đổi-khung-giữa-năm). Luật suy buổi: `ngày ≥ lop.ngay_khai_giang AND slot TKB hiệu lực`. Sửa được trong form Lớp. Session pure-derive nên lớp chưa khai giảng tự ko sinh buổi — KHÔNG cần hủy tay.

**Avatar HS (mig 0023 `hoc_sinh.anh_url`)** chung bucket `avatars`. Mã NS/HS/PH: đổi từ "tự sinh" → **ĐỀ XUẤT max+1 hiện sẵn form, sửa được** (`suggestMaNS/HS`); DB default sequence làm lưới (đẩy seq vượt max sau khi nhập tay).

**Dev quick-login** (`Login.tsx`): nút vàng đăng-nhập-nhanh, CHỈ hiện `import.meta.env.DEV`, đọc `VITE_DEV_ACCOUNTS=Tên|email|pass,...` từ `.env.local`. Build production không bao giờ hiện.

**Gamification:** đọc `bkdemy_gamification_tong_ket.md` (Thùy chốt 12/6) → tạo trang Notion con của ERP V2 (`37cd4530bcdb81f792fcf50e8c41e9d1`). 3 thước Elo/EXP/Level + xu, 4 món. CHƯA code.

**⭐ SCOPE ENGINE — gốc rễ "ai thấy task nào" (`getMyScope`):**
- ABAC: task mang nhãn (loại việc × lớp); người thấy nếu khớp 3 chiều. **① OWNER** = phan_cong_lop (vai gv→đánh giá/nội dung, tg→chấm ET/BTVN; OPS→điểm danh toàn hệ). **② GIÁM SÁT** = người dưới trong CÂY VỊ TRÍ.
- **Sai → Thùy sửa 2 lần:** (a) T gắn "GV theo dõi lớp mình" theo VAI → SAI: GV chỉ phối hợp, không quản TA. Quản lý là CHỨC VỤ (ghế Trưởng/Phó), KHÔNG từ vai GV. GV "đến dạy rồi về" quản lý 0 người. → bỏ `theoDoiLop`. (b) Giám sát phải 2 TẦNG span-of-control: **trực tiếp** (cha_id = ghế tôi, view mặc định) vs **gián tiếp** (sâu hơn, passive drill).
- **2 TRỤC QUYỀN tách:** A=task-scope (ai LÀM/NẮM, engine này) · B=data-scope (ai XEM data lớp — GV xem dashboard lớp mình, độc lập, dựng cùng dashboard). Trộn = lỗi V1.
- Panel "Phạm vi việc của tôi" trong HoSoModal (test bằng dev login).

**Màn PHÂN CÔNG (ma trận, leaf `phancong`):** hàng=lớp (nhóm môn, sort S→A→B→C), cột = GV chính(đánh giá+nội dung)/GV phụ/TG(chấm ET+BTVN)/Điểm danh(OPS toàn hệ). Gán theo VAI (TG ôm TOÀN BỘ chấm 1 lớp — ko tách task, Thùy chốt). Ghi `phan_cong_lop` (cùng seam màn Lớp — 1 sự thật 2 cửa, vô hại). `setPhanCongSlot`. Dropdown hiện (tải = số lớp); GV chính/TG thiếu → ô đỏ. 1 GV chính + ≤1 phụ; chính≠phụ.

---

## 2026-06-11

**Setup máy nhà (sáng):** pull về thiếu `katex` (npm install lại) + thiếu env. File env Thùy tải về sai tên: `env.local` (thiếu chấm đầu) + `d41d8cd9.env` → đổi tên `.env.local` / `.env` là chạy. Bài học: file env KHÔNG có đuôi, Windows hay giấu/lệch tên.

**PrintView tinh chỉnh:** chốt font in **17px ≈ 13pt Times New Roman** (như sách), KaTeX `.katex{font-size:0.95em}` cho phân số cân chữ. `pv-box-label` (nhãn LÝ THUYẾT/VÍ DỤ) 10.5→12.5px.

**Kho tài liệu (Mức 1):** màn Làm-tài-liệu thêm nút khối "Tất cả" + search tên + sort (mới nhất/A-Z) + hiện ngày tạo/sửa (giờ VN) + đếm. Migration **0014** `tai_lieu.created_by uuid` — app set từ `session.user.id` lúc tạo (KHÔNG default `auth.uid()` — claude_build không đụng schema auth, đã FAIL 1 lần). "Ai tạo" hiển thị tên → chờ nền nhân sự, đã chừa cột.

**NHÂN SỰ + LỚP + HỌC SINH (khối STATIC — bàn xong mới code):**
- **Bàn & chốt với Thùy:** 2 trục độc lập — NGHIỆP VỤ (6 team: GV/TA/OPS/Học thuật/Media/Marketing, mỗi team 1 cây riêng, 1 người nhiều team) × PHẠM VI (GV/TA theo lớp; 4 team kia phase này KHÔNG chia). Sơ đồ dùng THẬT (luồng đánh giá/báo cáo sau). Lọc quyền đi **cách B** (filter query như V1) nhưng schema chừa đường siết RLS. Static (HS/NS/lớp/TKB/phân công) = dữ liệu GỐC làm trước; động (session/điểm danh) để sau. **TKB = khung lặp tuần effective-dated** (sửa = đóng `hieu_luc_den` + mở dòng mới, KHÔNG đè) → session **pure-derive** từ TKB-đang-hiệu-lực, không cron đẻ dòng, đổi TKB tự lan; buổi có hoạt động mới thành dòng thật (bất biến).
- **Band năng lực:** Thùy yêu cầu thang MỊN hơn S/A/B/C (1 band to đi cả năm) → bảng `muc_nang_luc` 12 mức = bậc×3, **mức 1 = XỊN NHẤT trong bậc** (S1 đỉnh, thu_tu 12→1), roll-up cột `bac` về `lop_bac` nên Kho không đổi gì. Band per-MÔN: sống ở `hoc_sinh_lop.muc_nang_luc_id` (HS giỏi Toán yếu Văn). `lop.bac` = bậc thô của lớp.
- **Migration 0015** (10 bảng + RLS authenticated + seed team/mức): `nhan_su` `tai_khoan` `team` `thanh_vien_team`(vai_tro+quan_ly_id per-team) `lop`(1 lớp=1 môn) `phan_cong_lop`(gv/tg+la_chinh — thay gv1/gv2/tg1/tg2 V1) `hoc_sinh` `hoc_sinh_lop`(thay 4 cột lop_toan/van/anh/khtn V1 — đa lớp sạch) `thoi_khoa_bieu` `muc_nang_luc`. **0016** HS +dia_chi+truong_hoc. **0017** `phu_huynh` thực thể (ma_ph PH0001 tự sinh, 1 PH nhiều con, `hoc_sinh.phu_huynh_id`, DROP 3 cột PH text). **0018** mã tự sinh NS001/HS0001 (sequence default + backfill). **0019** `nhan_su.anh_url`. **0021** `thanh_vien_team.chuc_vu`. **0020 storage bucket `avatars` — CHƯA CHẠY, phải paste Dashboard SQL Editor.**
- **Code:** `src/lib/nhansu.ts` (seam đầy đủ + `suggestMaNS/HS` đề xuất mã max+1 hiện sẵn form, sửa được) · `src/screens/nhansu/`: **NhanSuScreen** (bảng + form: ảnh đại diện upload bucket avatars, mã đề xuất, tick team — KHÔNG phân cấp ở đây) · **LopScreen** (card khối → detail hub: phân công GV/TA + TKB + sĩ số/band) · **HocSinhScreen** (form 2 cột 1040px: trái thông tin + PhuHuynhPicker tìm/tạo PH, phải bảng **Lớp & band THEO MÔN** kiểu V1 — môn data-driven từ lớp, chọn lớp + band 1 dòng/môn, "không học"=rời giữ lịch sử) · **OrgChartScreen** (org chart thẻ bài DỌC có ảnh + dây nối CSS family-tree, tab 6 team, click thẻ → popup vai trò/chức vụ/cấp trên, chặn vòng descendant). Leaf mới `lop`; wire ns/lop/hs/orgchart vào AdminScreen. NavTree: nhóm thu/mở kiểu Explorer.
- **UX sửa theo phản hồi Thùy:** form NS lúc đầu bắt "lưu rồi mở lại mới gán team" → gom draft, Tạo 1 mạch. Phân cấp bỏ khỏi form NS → chỉnh ở org chart trực quan. Modal HS thiếu chỗ → Shell thêm max-h+scroll, rồi làm hẳn modal to 2 cột. **Chức vụ ≠ level**: cùng level QL nhưng khác scope (QL khối THCS vs tiểu học) → cột `chuc_vu` text hiện trên thẻ.
- **Luồng nhập:** HS mới → màn Học sinh (Tạo & xếp lớp 1 nhịp); dựng sĩ số đầu kỳ → màn Lớp; 2 lối cùng ghi `hoc_sinh_lop` idempotent.

**CHƯA làm (nợ):** trigger ghi-log lịch sử (§4 CLAUDE.md — đổi band/phân công/TKB chưa có vết; PHẢI làm trước vận hành thật, timeline tiến bộ HS dựa vào nó) · bucket avatars chưa chạy (0020) · màn Phụ huynh riêng · phân công xem từ phía NS · import HS từ V1.

**(Chiều, máy cơ quan) ĐẢO MODEL TỔ CHỨC — Thùy chốt "VỊ TRÍ là xương sống":**
- Lý do: 1 người kiêm nhiều vị trí NGAY TRONG 1 team (Trang = Trưởng khối THCS + Trưởng khối THPT). Model membership (người×team, unique) không tả nổi. Nguyên tắc Thùy: **"quản vị trí chứ không quản người — người chỉ là cái đặt lên; người đi, vị trí vẫn còn"**. Luồng: **vị trí sinh vị trí** (dựng cây trước) → mới chọn ai ngồi vào. (= position-based org của SAP/Workday.)
- **Migration 0022**: bảng `vi_tri` (team_id · ten=chức vụ/scope · cap truong/pho/thanh_vien · **cha_id trỏ VỊ TRÍ cha** · nhan_su_id NULL=trống) — migrate data từ `thanh_vien_team` (giữ id để map cha qua quan_ly) rồi **DROP thanh_vien_team**. Xoá NS → vị trí thành trống (set null), cây không sập. Xoá vị trí → con nối lên ông.
- **0023**: `hoc_sinh.anh_url` — avatar HS, chung bucket `avatars`.
- Code: lib bỏ membership → `listViTri/createViTri/updateViTri/deleteViTri`. NhanSuScreen bỏ tick team (team suy từ vị trí đang ngồi). OrgChartScreen xoay quanh vị trí: + Vị trí gốc → click thẻ → tên/cấp/cha/+Vị trí con/Người đảm nhiệm; thẻ trống = viền đứt + "Vị trí trống" vàng. Thẻ lấy CHỨC VỤ làm chính, người là dòng phụ. Thẻ nới 128px, tên không truncate (tên dài bị cắt). Form HS thêm upload ảnh + avatar trong bảng.
- **Wording (Thùy):** UI dùng "VỊ TRÍ", cấm "ghế". Level giữ "Trưởng/Phó" (T phản biện: đi cặp tự nhiên, "Quản lý" sống ở TÊN vị trí — Thùy chưa phản đối).

---

## 2026-06-10

**Làm tài liệu — sửa Builder (theo phản hồi):**
- Câu lúc thêm chuyên đề KHÔNG khớp setting (lấp 6 câu bất kể loại). Fix: `themChuyenDe` dùng `autoSuggestByLoai(DEFAULT_LUYEN_COUNTS)` (3 trắc nghiệm·2 trả lời ngắn·1 tự luận) → câu khớp số/loại; DangCard default cùng const. *(Giáo trình CŨ giữ câu cũ — bấm Gợi-ý-lại để theo logic mới.)*
- KhoPicker: thêm **filter loại theo toggle** (không dropdown) + "Xoá lọc".
- Dạng: thêm **✕ Xoá dạng** (đã có ↑↓ reorder). Hết "khoá cứng".
- **Cây cấu trúc bên trái** (`StructureTree`): Chuyên đề → Dạng (số câu) → BTVN, click nhảy tới thẻ (id `p-${phan.id}` + scroll-mt). Thêm `tenChuyenDe` vào resolver (query `dai_ban_do`).

**Làm tài liệu — PrintView (xuất PDF), nhiều vòng:**
- Phân trang HỎNG (flex chặn page-break) → đè header/footer. Vòng 1: bỏ flex sang **`<table>` thead/tfoot + `@page margin:0`** (header/footer dán SÁT mép, lặp mọi trang; chữ overlay TRONG dải sóng).
- Thùy: preview phải = bản in (chia trang A4, **số trang**, header/footer mỗi trang). Bản table cuộn 1 mạch → vô dụng. → **VIẾT LẠI trên paged.js** (`new Previewer().preview(html, [cssBlobUrl], dst)`): Doc render ẩn (`pv-src`) → paged.js phân trang vào `pv-pages`. Dải sóng **full-bleed qua `::before/::after` của `.pagedjs_pagebox`** (data-URI SVG); **số trang** qua `@page{@bottom-right{content:counter(page) " / " counter(pages)}}`. Cài `pagedjs` + `src/pagedjs.d.ts`.
- Ngắt trang nội dung: lý thuyết render thành **KHỐI tách bởi dòng trống** (`LyThuyetBody`, `.pv-blk{break-inside:avoid}`) + tiêu đề `break-after:avoid` (không mồ côi cuối trang). Câu vốn `break-inside:avoid`.
- **In đậm nhãn**: `MathText` thêm `**đậm**` (markdown) + auto-bold nhãn đầu dòng (Ví dụ/Quy tắc/Lưu ý/Định lý…) qua `LABEL_RE`+`autoBold` (chỉ khi đầu dòng thật). Prompt `buildLyThuyetPrompt` thêm: tách khối bằng dòng trống + bọc `**nhãn**`.
- **Logo trong header góc trái**: nền chip trắng bo góc+viền (SVG data-URI) dưới logo, trên dải sóng — 3 lớp background trên `::before`; chữ "tên·Khối" dời sang phải (letterhead). **Font → Times New Roman** (Tinos fallback), body 15→**16px** (font sách in chuẩn; KaTeX vốn serif → khớp).

**Sai → sửa (PrintView):**
- **Preview TRẮNG** sau khi thêm logo. Nguyên nhân: paged.js (`sheet.js:176`) rewrite mọi `url()` không-phải-`data:` bằng `new URL(href, this.url)` với `this.url` = **blob URL** của stylesheet → `new URL('/Logo.png','blob:…')` **THROW "Invalid URL"** → preview reject → trắng. (Dải sóng `data:` được skip nên trước OK.) **Fix: logo dùng URL TUYỆT ĐỐI** `location.origin+'/Logo.png'` (absolute thì bỏ qua base). Thêm hiển thị `renderErr` thay vì trắng trơn.

**Gemini "CONSUMER_SUSPENDED" — KHÔNG phải leak:**
- Lỗi 403 lúc gọi AI lý thuyết. T đoán đầu (có hedge) là key lộ bị Google trảm — **SAI**. Thật ra là **chạm Monthly spend cap** (1.000.000đ) của project SolutionBank (đã dùng 1.299.015đ; spike Jun 8–9 do test nặng). Fix: **Edit spend cap** nâng lên, **~10 phút latency** mới mở (không phải lỗi client, F5 vô ích). Bài học: `CONSUMER_SUSPENDED` = chạm cap chứ không mặc định là leak; check **email Google + Console** trước khi đoán. (Proxy server-side cho key vẫn nên làm sau, nhưng KHÔNG gấp vì đây là tự tiêu chạm trần, không bị abuse.)

**Bắt đầu tính năng BÀI TẬP HÀNG NGÀY (V2):**
- Đọc kỹ V1 "Daily 5T" (`bkdemy-erp/src/components/student/TabDaily5T|TabDailyPractice|TabDailyReports|ReportModal`, `pages/admin/TabDaily5T`, `utils/studentData`). Bản chất: sinh ~10 câu/ngày nhắm điểm yếu → **chấm 3 tầng** (luật→cache `accepted_answers` unique theo đáp-án-chuẩn-hoá→Gemini fallback) → streak/ranking → HS "báo chấm sai"→GV duyệt (thêm-accepted/sửa-đáp-án/từ-chối)+**backfill** bài cũ → dashboard GV (ai làm/bỏ, dạng sai nhiều, Zalo PH). Bảng V1: `daily_practice_sessions`·`daily_practice_streaks`·`question_accepted_answers`·`daily_answer_reports`·`daily_ai_check_log`·`question_bank`·`students`.
- **PHÁT HIỆN TO**: schema V2 hiện CHỈ có Kho (`dai_*`/`hinh_*`) + `lop_bac` + `tai_lieu`. **KHÔNG có học sinh, KHÔNG có lớp đo mastery (HS×dạng), KHÔNG có bảng daily.** → Làm daily = phải dựng luôn **nền HS + nền Đo** của V2 (V1 có sẵn nên daily chỉ là 1 lá). Tin tốt: daily chính là **kênh đo đầu tiên** đổ data vào (HS×dạng) — đúng model lõi V2.
- **Thùy chốt logic**: engine cho **MỌI khối** (5T chỉ là V1 vì hồi đó chỉ 5T có kho chuẩn). Bộ câu = **50% rà-soát ngẫu nhiên + 50% luyện điểm-yếu**.
- T **phản biện 6 lỗ** của 50/50: ① "rà soát" phải giới hạn **dạng ĐÃ HỌC** (cần lộ-trình — dependency bị giấu) ② "điểm yếu" ≠ %sai cao, phải **mastery thấp + ĐỦ MẪU** (§5 độ tin), ít data→đẩy sang rà-soát ③ đo từ daily = **tín hiệu YẾU** (home/không giám sát/AI chấm) → phải gắn nguồn+trust, weight nhẹ, triangulate với test ④ "ngẫu nhiên" thô → nên **spaced-repetition + uncertainty-sampling**; luyện điểm-yếu lấy **CÂU KHÁC** (chống học vẹt) ⑤ **streak ↔ chất lượng data** xung đột (bấm bừa giữ chuỗi) ⑥ "mọi khối" chỉ chạy ở dạng đủ câu → cờ **daily-ready**.
- **ĐANG CHỜ Thùy quyết**: "đã học tới dạng nào" lấy ở đâu — (a) theo lớp (lộ trình GV nhập) / (b) theo HS (suy từ data đo — cold-start rỗng) / (c) mở hết khối (không khuyến nghị).
- **Plan 4 lớp** (chưa đụng DB): ① nền HS (`hoc_sinh` + lớp/khối, import từ V1) ② nền Đo (bảng phép-đo bất biến (HS,dạng,đúng/sai,nguồn,lúc), mastery suy động) ③ engine Daily (chọn 50/50 từ `dai_cau_hoi`, chấm 3 tầng qua proxy, streak) ④ báo cáo + dashboard GV.

**Migrations áp hôm nay:** KHÔNG (thuần frontend + thêm dep `pagedjs`). DB không đổi.

---

## 2026-06-09

**Làm:**
- **Lý thuyết DẠNG** đổi từ upload-file → **NỘI DUNG text+LaTeX** (render như bài tập). Migration **0009** thêm cột `noi_dung`, `file_url`→nullable. Editor popup to: upload ảnh/PDF → **AI bóc LaTeX** (`buildLyThuyetPrompt`/`parseLyThuyetJson`), trái code · phải preview live. Card hiện "✓ Có · xem/sửa".
- **Lý thuyết CHUYÊN ĐỀ** (lý thuyết chung, tuỳ chọn): bảng `dai_chuyen_de_ly_thuyet` (migration **0010**), khoá `ma_chuyen_de`. Dùng CHUNG `LyThuyetModal` (generic props `ma`/`ten`). branch config thêm `lyThuyetT2`.
- **3 trạng thái lý thuyết chuyên đề: Có / Chưa / Không cần.** Migration **0011** thêm cờ `khong_can`. Checkbox "không cần" trong modal (allowKhongCan). % tính cả trục LT chuyên đề: **Có→1 · Chưa→0 · Không-cần→LOẠI khỏi mẫu số**.
- **Badge % hoàn thành**: pill ở chủ đề (cột trái + header) · **VÒNG TRÒN tiến độ SVG** ở góc phải card chuyên đề. **5 thang màu**: <20 đỏ · 20 cam · 40 nõn chuối · 60 xanh · 80 xanh đậm. Công thức: dạng = câu(cap chuẩn) 70% + lý thuyết dạng 30%; chuyên đề = TB(dạng) + trục LT chuyên đề; chủ đề = TB tất cả.
- **Paste clipboard mọi nơi**: `readClipboardImageFile()` + nút 📋 Dán ở lý thuyết / nhập câu Auto / ô ảnh đề-đáp án.
- Chốt **Gemini input ưu tiên PDF** (đa trang + text layer); ảnh chỉ khi 1 trang & nét ≥300DPI; tài liệu khó → model Pro.

**Sai → sửa (clone):**
- AI trả `\dfrac` **TRẦN (quên `$`)** + dùng `<br>` → render thô. ⚠ KHÔNG phải regression — `git diff` chứng minh render/prompt clone KHÔNG đổi hôm nay; AI làm ẩu cho câu nhiều phân số. Fix bền: `renderText()` katex-render lệnh-CÓ-NGOẶC trần (`\dfrac{6}{5}`); `<br>`→xuống dòng; bỏ `\sqrt` khỏi map Unicode (để katex lo). + prompt ép "mỗi công thức bọc `$` RIÊNG, CẤM `<br>`".
- PDF → "lỗi json" = **output bị CẮT** (maxOutputTokens default thấp). Fix: `maxOutputTokens: 65536` + bắt `finishReason==='MAX_TOKENS'` báo rõ "AI bị CẮT → giảm số biến thể".
- **Chọn 20 biến thể → AI trả 41** (lờ số lượng yêu cầu). Vụ nâng maxtoken vừa nãy LÀM LỘ ra (trước bị cắt nên trông như ~20). Fix: **CAP cứng** `variants.slice(0, soBienThe)` ở client + prompt "sinh ĐÚNG N" + note "AI sinh 41 → đã lấy 20".
- Badge vòng tròn **rớt góc TRÁI** dù để `right-3`: hardcode `relative` ở wrapper đè `absolute` truyền vào (cùng thuộc tính `position`, CSS order quyết định → `relative` thắng). Fix: bỏ hardcode `relative`, để className tự lo. Viền mỏng → stroke 4→7, ring 48→50.

**Quyết định:**
- **Cơ chế log = 2 file** (Thùy chốt): `DEVLOG.md` (thô, không load, nguồn bất biến) + `HANDOFF.md` (tổng kết từ log, load đầu phiên). Distill **CHỈ cuối ngày**. Giữ log thô để re-derive nếu bản tổng hợp sai logic.
- **Completeness phải có trạng thái "KHÔNG áp dụng" tường minh** (vd chuyên đề "không cần LT") — đừng tính ngầm/đoán, sẽ ra % sai.

**"LÀM TÀI LIỆU" (giáo trình) — đã build vertical slice + builder (đang dở):**
- **Kiến trúc** (Thùy chốt): tài liệu = **THAM CHIẾU** vào kho (transclusion), xuất mới snapshot; engine dùng chung mọi loại (`loai`: giao_trinh|mt|et|bo_tro|daily); **HTML→`window.print()`→PDF**; **2 bản HS/GV** (GV kèm lời giải); **thư viện** (lưu/mở lại). **Content khoá (từ kho) · chrome custom (header/footer/watermark/màu)**.
- **Schema**: `0012` `tai_lieu` + `tai_lieu_phan`(lt_chuyen_de|dang|btvn|custom, ref_ma) + `tai_lieu_cau`. `0013` thêm `tai_lieu.cau_hinh` jsonb (header/footer/watermark/màu).
- **Data layer** `src/lib/tailieu.ts`: CRUD thư viện · `themChuyenDe` (nối 1 chuyên đề: LT chuyên đề + dạng + câu luyện, giữ BTVN cuối) · `ensureBtvnPhan` · `autoSuggestCau`/`autoSuggestByLoai` (theo số câu mỗi loại, ưu tiên gốc>clone) · `setCauOfPhan` · `getTaiLieuFull` (resolver gom nội dung sống từ kho).
- **UI** `src/screens/tailieu/`: `TaiLieuScreen` (thư viện + Tạo[tên+khối] → Builder) · `TaiLieuBuilder` (setting chrome + **+ Thêm chuyên đề** [nhiều cái gộp] + mỗi Dạng: số câu/loại + Gợi ý lại + ✎ chọn câu từ kho [KhoPicker] + ↑↓ + Xoá chuyên đề; BTVN luôn cuối) · `PrintView` (render gu "workbook" 4 màu brand: cover logo + dải sóng header/footer + LT/Dạng/BTVN, đọc `cau_hinh`). Lá Admin mới **`lamtailieu`**.
- **QUAN TRỌNG (Thùy sửa luồng)**: tài liệu là **NHIỀU chuyên đề gộp** → tạo tài liệu TRƯỚC (tên+khối), rồi vào Builder **+ Thêm chuyên đề** (nhiều lần). KHÔNG chọn 1 chuyên đề lúc tạo.
- **Sửa PDF theo phản hồi**: font **Be Vietnam Pro** + cỡ 15px (≥ công thức); **đáp án tự xếp 4/2/1 cột theo độ dài** (hết đè — fraction ngắn → 4 cùng dòng); dải sóng header (bìa) + footer (lặp mỗi trang, print-only); watermark logo mờ (print). `index.html` load Google Fonts (Be Vietnam Pro + Lora).
- **CÒN LÀM** (mai): header/footer **chọn nhiều mẫu** (mới có 1 mẫu dải sóng) · running header slim trang ruột · reorder câu trong dạng · BTVN số-câu-theo-loại · gu khác (B học thuật / C SaaS) · áp `cau_hinh.mau` cho cả dải sóng · custom block.

**Migrations áp hôm nay (DB live):** 0008 bucket `kho-tailieu`, 0009 lý thuyết `noi_dung`, 0010 chuyên đề LT, 0011 cờ `khong_can`, 0012 tài liệu, 0013 `tai_lieu.cau_hinh`.

---

## 2026-06-08

**Làm:** Auth gate (Supabase Auth email/pass) + RLS toàn bộ bảng chỉ `authenticated` (migration 0006). Kho câu hỏi per-dạng (`DangHub`): Clone biến thể + Nhập chuỗi câu; method Auto(ảnh/PDF→Gemini)/Manual(JSON)/Văn-bản(parser); trắc nghiệm 4 PA; review 1-câu. Mã câu `ma_cau = {ma_dang}+STT 3 số` (client max+1). Ảnh đề/đáp án → Supabase Storage bucket `kho-anh` (`uploadKhoImage`), bỏ base64. Deploy Vercel (project v2, main → bkdemy-erp-v2.vercel.app). Chốt quyết định lên Notion (trang ADR con của ERP V2).

**Sai → sửa:**
- `zoom:1.15` (#root) + `100vh` → mọi `100vh`/`min-h-screen` tràn ×1.15 → body scrollbar thừa. Fix: chặn chiều cao 1 lần ở App `h-[calc(100vh/1.15)]`, dưới `h-full`.
- `grid h-full` không cuộn — hàng grid mặc định `auto`, tràn bị cắt. Fix: `grid-rows-[minmax(0,1fr)]`.
- MathText nuốt `\neq` (lần 1) rồi "fix" `(?![a-zA-Z])` lại nuốt xuống-dòng-thật `\nVì` (lần 2) → Thùy sửa tay 20 câu. Fix gốc: **tách `$…$` TRƯỚC**, chỉ xử lý xuống dòng ở text NGOÀI `$`.
- CauModal đơn lẻ rớt cột `lua_chon`/`anh_*` khi lưu → tái dùng `CauEditor` + mapper đủ cột.
- Paste ảnh nhân đôi (window listener + slot onPaste) → `stopPropagation` ở slot.

**Migrations:** 0004 lý thuyết dạng, 0005 provenance câu, 0006 RLS, 0007 bucket `kho-anh`.

---

## 2026-06-06

**Làm:** Dựng nhánh ĐẠI của Kho (build THẬT wire Supabase, seam `api.ts`): bản đồ 3 tầng Chủ đề→Chuyên đề→Dạng, CRUD dạng, mã vị trí gợi ý sửa được, filter bậc/độ khó toggle, card UI gu SaaS.

**Quyết định schema (migration 0002, Thùy duyệt):** BỎ tầng Chương (3 tầng). Thêm bậc lớp S>A>B>C (`bac_toi_thieu` FK `lop_bac`, độc lập độ khó `muc_do`). Mã: chủ đề `0701` · chuyên đề `070101` · dạng `07010103`; chỉ `ma_dang` là FK-target ổn định. Migration 0003 grants (ALTER DEFAULT PRIVILEGES claude_build).

**Gotcha:** migration áp RIÊNG từng file (0001 không idempotent). claude_build có DDL (khác claude_ro trong CLAUDE.md §2.1).

---

## 2026-06-16 (phiên 2) — Khép ET, chấm bài/ET, mốc hoàn thành, Elo per-môn + màn Điểm số

**Làm (đã distill lên HANDOFF ①②, đây là log thô):**
- Khép vòng ET: tab Chấm ET tự load câu từ ET (lớp+ngày) → seed gami_session_problems. ET = form tạo trực tiếp (bỏ list/popup gate), Lưu→Kho→reset; sửa từ Kho tài liệu.
- Chấm bài trên lớp = 5 mức 1-5 (gradeMuc, points=muc×20, mig 0038). Chấm ET = Đ/C/S + 6 ô lỗi E01-E06 (gradeET, cột loi jsonb mig 0037). Click lại = bỏ chấm (deleteGrade). Đánh giá sau buổi = Đ/C/S + nút Hoàn thành (danh_gia_xong_at mig 0040).
- Mốc hoàn thành từng task; buổi hoan_tat khi CẢ ingame+et đóng (sửa bug ET-đóng-là-mất-task-GV). Task xong→nhóm "Đã xong" mở lại sửa. reopenPhase rollback.
- getMyTasks: gom MỌI vai (gv-phụ+tg) — sửa bug rụng task ET. Buổi học: filter Chưa mở/Đã mở/Đã hủy + hủy tách khỏi mở + bấm cả thẻ vào buổi + dongBoSiSo (vá sĩ số ghi-danh-sau).
- closePhase atomic claim (chống đóng 2 lần → Elo×2; đã dính 9A2). Nút đóng busy.
- Elo/EXP per-môn (mig 0041 unique hs+mon, backfill Toán). 2 Elo độc lập/buổi tính từ Elo TRƯỚC buổi (pre = elo − Σ delta buổi này), cộng dồn; reopen=trừ delta. Config K_calib 48→32, cap 60→40. EXP hoà = TB bậc nhóm. Replay toàn bộ (_replay_elo.mjs).
- Màn Điểm số (leaf diemso): Bảng xếp hạng per-môn + Theo ca (2 bảng Elo lớp/ET) + hồ sơ HS (lịch sử Elo bấm→bảng ca). getEloBreakdown hiện E/A/Δ kiểm tra công thức.
- Sửa/xoá chủ đề-chuyên đề (rename giữ mã, deleteDaiCum cascade câu). Bug tràn bảng (min-w-0). Seed trùng StrictMode (unique 0039 + upsert ignoreDup). HS tab Tất cả + đếm Đang học/Nghỉ. PH mã sửa-được + sửa info. Prompt clone siết + \vdots/\not\vdots + ảnh đề chung.

**Migrations áp: 0037 loi · 0038 muc · 0039 unique problems+dedup · 0040 danh_gia_xong_at · 0041 per-mon.**

**Đang dở/treo:** màn TIVI (chờ Thùy: theo lớp/buổi hay toàn khối). Verify cuối: 9A2 buổi1 ingame Δ=0 đều, EXP hoà 333 — ĐÚNG.

**Gotcha then chốt (chi tiết ở HANDOFF ②):** atomic-claim chống double-close · Elo nhiều phase = snapshot trước-buổi không nối tiếp · EXP hoà = TB nhóm · min-w-0 mọi tầng flex/grid · unique+upsert chống StrictMode seed đôi.
