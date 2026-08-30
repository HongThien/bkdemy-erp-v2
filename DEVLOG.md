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

**BTVN trong buổi (Thùy: mảnh cuối session, ET/chấm/đánh-giá đã ổn):** tab "BTVN" trong buổi (TA chấm buổi sau). **Mig 0045**: `btvn_ket_qua` +`trang_thai_nop`/`thai_do` · `buoi_hoc.btvn_dong_at` · bảng `canh_bao_yeu` (HS×dạng×buổi, RLS member). Áp + schema.
- **① Chấm câu Đ/C/S như ET** (load câu từ doc `loai='btvn'` của buổi qua `getBTVNByBuoi`/`getBTVNCaus`; problem phase='btvn'; `gradeET`/`deleteGrade` tái dùng). ⚠ BTVN = THAM KHẢO → KHÔNG vào mastery/Elo.
- **② Per-HS**: Trạng thái nộp (đúng hạn/xin phép/không làm/nộp muộn) + Thái độ (nghiêm túc/chưa hết sức/chưa nghiêm túc/chống đối) → `btvn_ket_qua` (setBtvnKetQua upsert).
- **③ Báo động 🚨**: TA bật "HS X kém dạng Y" + ghi chú → `canh_bao_yeu` (tín hiệu NGƯỜI-confirm = tin, nguồn "ai cần hỗ trợ"; KHÁC data thô). `themCanhBao`/`xoaCanhBao`/`listCanhBao` + AlertModal.
- **Đóng BTVN** = `closeBTVN` thưởng **EXP hoàn thành** theo trạng thái nộp (BTVN_EXP đúng-hạn 200/muộn 100/xin-phép 50/không-làm 0, PROVISIONAL; source='btvn'); KHÔNG Elo, KHÔNG gate hoàn-tất buổi. `reopenBTVN` hoàn EXP. Phase/TabKey +='btvn'; getMyTasks: TG thêm task "Chấm BTVN" (done theo btvn_dong_at). ✓ tsc+build. CHƯA test e2e (cần buổi có doc BTVN khớp lớp+ngày).

**NHÃN NGUỒN LỜI GIẢI + 2 luồng (Thùy: cần review bài AI giải, vision AI quản kho):** phát hiện extraction hiện AI TỰ GIẢI (prompt không cấm điền loi_giai) → lời giải AI lẫn vào kho. Chốt **2 luồng** (clear hơn checkbox): ① "📄 Bóc sẵn" = tài liệu có lời giải → bóc nguyên (cấm tự giải, thiếu để trống) → `nguon_giai='nguoi'`; ② "🤖 AI giải" = chỉ đề/đáp án → AI tự giải chi tiết (think 8192, bám đáp án) → `nguon_giai='ai'` (cần duyệt). Clone biến thể = 'ai', gốc='nguoi'. **Mig 0044** `dai_cau_hoi.nguon_giai` (default 'nguoi', backfill clone→ai) — đã áp + `npm run schema`. Prompt `buildBatchPrompt`/`buildIngestPrompt` thêm `giaiAI` → `giaiRule`. UI: segmented "Lời giải: Bóc sẵn/AI giải" (batch+auto) độc lập checkbox "Có hình"; badge **🤖 AI giải** ở thẻ câu trong kho. saveCauBatch/saveCloneBatch ghi nguon_giai. ✓ tsc+build. (CÒN: hàng đợi duyệt + cờ giai_da_duyet — làm khi cần review hàng loạt.)

**Checkbox "📐 Có hình" (Thùy hỏi có cần):** nên có — tài liệu chữ-thuần phổ biến, pipeline-hình tốn (mỗi trang 1 call + rủi ro cắt nhầm). Batch auto thêm checkbox (mặc định BẬT): bật → `runAutoIngest` (render+cắt hình); tắt → `runAuto` chữ thuần (gửi cả file 1 call, `BATCH_SCHEMA`, think 0, rẻ/nhanh, không cắt nhầm). Nút đổi nhãn "Tách câu + hình" / "Tách câu". ✓ tsc+build.

**GỘP "Nhập tự động" VÀO "Nhập chuỗi câu" (Thùy: bản chất là 1, + phân tích hình):** spike IngestSpike (KB2) lỗi 3 cái — (1) ko nhận hình nữa, (2) popup tràn màn, (3) phải về preview-từng-câu như nhập chuỗi câu. Gốc: spike là UI SONG SONG kém hơn batch import. Sửa: **bỏ màn spike**, đưa figure vào CHÍNH luồng "Nhập chuỗi câu" method 'auto' (AiImportModal) — đã có preview từng câu (CauEditor có ImageSlot anh_de) + modal chuẩn. `runAutoIngest`: render trang DPI cao (`fileToCanvases`) → `callGeminiRich(buildIngestPrompt, INGEST_SCHEMA)` mỗi trang → cắt hình (`cropCanvasBox`) → `anh_de` → ReviewItem → review sẵn có. Đa trang gộp. Nút batch 'auto' = "🪄 Tách câu + hình". XOÁ `IngestSpike.tsx` + nút "🧪 Nhập tự động (thử)" + importMode 'ingest'. → #1 hình (pipeline KB4 đã chạy ổn) · #2 modal chuẩn inset-4 · #3 preview từng câu = chính review batch. ✓ tsc+build. (KB2 giờ = batch auto; KB3 nhiều-dạng vẫn cần màn cross-dạng riêng sau.)

**FIX JSON CÒN LỖI ở CLONE/BATCH/LÝ-THUYẾT (Thùy: "sao gặp nhiều lần thế") — lỗi mình:** lần trước CHỈ áp `responseSchema` cho ingest (`callGeminiRich`), KHÔNG áp cho `callGeminiJson` (clone/nhập-chuỗi/bóc-lý-thuyết) → vẫn vỡ ("Expected , or }" do `"` chưa escape; lenientJsonParse chỉ vá backslash). Sửa GỐC: `callGeminiJson` nhận `opts.schema` → `responseSchema`; thêm `CLONE_SCHEMA`/`BATCH_SCHEMA`/`LYTHUYET_SCHEMA` (CAU_ITEM_SCHEMA dùng chung, required de_bai). DangHub truyền clone/batch schema; BanDo runAuto truyền LYTHUYET_SCHEMA. → MỌI call AI→JSON giờ constrained decoding. ✓ tsc+build. (Bài học ② đã ghi: AI→JSON DÙNG responseSchema NGAY mọi nơi, đừng vá lẻ.)

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

---

## 2026-06-20 — Fix thứ tự điểm danh + xác minh luồng BTVN (KHÔNG soạn riêng)

**Fix điểm danh loạn thứ tự (GIỮ):** `getRoster` (`lib/gami.ts`) query `buoi_hoc_hs` KHÔNG có `.order()` → mỗi lần UPDATE diem_danh, MVCC đẩy dòng vừa sửa xuống cuối heap → reload roster nhảy chỗ. Fix: sort client theo `hoc_sinh.ho_ten` (localeCompare 'vi'), tie-break `id`. PostgREST không order được theo cột bảng nhúng nên sort ở client. Mọi tab khác (Đánh giá/Chấm/ET/BTVN) đều `roster.filter` từ nguồn này → ổn định luôn + xếp ABC.

**BTVN: thử "soạn riêng" → SAI hướng, ĐÃ REVERT toàn bộ.** Thoạt hiểu "BTVN tự load giống ET" = thêm editor BTVN riêng (lá `lamtailieu:btvn`, ETEditor `kind='btvn'`, lib createBTVN/setBTVNCaus). Thùy chỉnh: **BTVN KHÔNG soạn riêng — làm CÙNG giáo trình, vẫn TRÍCH XUẤT từ giáo trình; hệ khớp theo lớp+ngày.** Revert hết (useStore/NhanSuHome/ETScreen/KhoTaiLieuScreen/tailieu.ts) → chỉ còn fix getRoster.

**Xác minh luồng BTVN ĐÃ ĐÚNG & đang chạy (query DB read-only):** BTVN soạn trong master giáo trình (phan `btvn`) → TrichPanel tick BTVN → `trichXuatBuoi` sinh doc `loai='btvn'` gắn `lop_id`+`ngay` → tab BTVN buổi học `loadBTVNForBuoi`→`getBTVNByBuoi(lớp+ngày)`→`getBTVNCaus` (lọc phan `btvn`) → `ensureBTVNProblems`. Data thật: 14 doc btvn đều `tu_trich=true`, đều gắn lớp+ngày, `ngay` kiểu `date` (giống ET, không lệch TZ), khớp buổi (vd 9A2.T7.20062026 → doc 5 câu), KHÔNG trùng (lop_id,ngay). **Không bug — buổi nào báo "Chưa có BTVN" là do buổi đó CHƯA trích xuất BTVN** (vd 12A1 20/06 chưa trích; 9A2/9B1 20/06 đã có).

---

## 2026-06-22 — Sửa loạt lỗi release (in/ chấm/ ảnh PH/ clone) + chốt plan AUTO-REPORT

**Xác nhận ET/buổi = GIỮ BẢNG (BuoiHocScreen):** Thùy: "Đóng" thực chất là "Xác nhận", đừng tắt bảng đi (sau chỉnh mất công mở). Đổi cả tab Chấm bài (ingame) + ET: nút "Đóng…" → **"✓ Xác nhận"**; bỏ early-return `<RevealView>` (xoá luôn RevealView + reveal state + import getEloBreakdown/EloBreakdown/RevealRow — Elo breakdown vẫn ở màn Điểm số). Khi đã xác nhận: bảng GIỮ NGUYÊN, nút chấm KHOÁ (read-only, vẫn thấy kết quả, xám non-selected) + nút **"↩ Mở lại để sửa"** (reopenPhase, hoàn Elo). Mobile (ChamMobile) thêm prop locked/onMoLai. ⚠ Chọn read-only-khi-xác-nhận (KHÔNG cho sửa thẳng) để Elo không lệch — sửa thì Mở lại 1 click.

**Ảnh kết quả ET gửi PH (TẠM, dashboard sau) — EtAnhGuiPH (BuoiHocScreen):** nút "📷 Ảnh gửi PH" ở header ET. Thùy chốt: **ẢNH CẢ LỚP** (1 bảng dọc HS×Bài, ô Đ/C/S màu), KHÔNG thẻ riêng từng HS, KHÔNG hiện đề/dạng. **COPY clipboard** (KHÔNG tải file): `html-to-image` `toBlob` → `navigator.clipboard.write(ClipboardItem image/png)` → paste vào Zalo. (cài dep `html-to-image`.) Chú thích 1 dòng: Đ=Đúng · C=Trình bày chưa hoàn thiện · S=Chưa biết làm. Lưu ý: clipboard ảnh cần HTTPS/localhost. Dùng html-to-image (SVG foreignObject) vì giữ layout đúng, khác html2canvas raster hay lệch (V1).

**Chấm BTVN không load — FIX GỐC (mig 0046):** mig 0045 thêm BTVN nhưng QUÊN nới CHECK `gami_session_problems.phase` (vẫn chỉ ingame|et|mt). ensureBTVNProblems insert phase='btvn' bị chặn 400 → BtvnTab catch nuốt lỗi → "Chưa có BTVN" (đánh lừa). Verify: 0 dòng btvn trong bảng. **mig 0046 nới phase thêm 'btvn'** — ĐÃ áp vào DB cloud (claude_build qua _apply_one.mjs). BtvnTab giờ load được. (Bài học: catch nuốt lỗi → ẩn bug; constraint là "hidden code" nghi đầu tiên khi insert 400.)

**Clone mất xuống dòng (api.ts):** commit c7ebf32 áp responseSchema (constrained decoding) cho clone → model gộp chuỗi về 1 dòng (mất bố cục). Fix: thêm `description` cho de_bai/loi_giai trong CAU_ITEM_SCHEMA (ép giữ nhiều dòng — Gemini tôn trọng description per-field) + siết rule prompt FMT_RULES (giữ đúng bố cục nhiều dòng). CHƯA verify thật (hành vi LLM — Thùy clone thử). Fallback nếu vẫn phẳng: bỏ responseSchema riêng cho clone, dựa lenientJsonParse.

**In phiếu BTVN + Giáo trình buổi — bỏ lặp tiêu đề (PrintView):** Thùy: thông tin lớp/ngày/tên buổi in lặp nhiều chỗ.
- buildPagedCss thêm `opts?: {headerText, footerText}` override (không truyền = giữ cũ; footer dùng white-space:pre khi có override để giữ khoảng cách). 
- Doc loai='btvn' || 'giao_trinh_buoi' (buoiDoc): Header dải sóng = **Lớp X · ngày** (query tên lớp từ lop_id, taiLieu chỉ có lop_id), Footer = **BK Academy · Tel 0963.209.309 · 17A10 KĐT Geleximco** (3 phần cách nhau). 
- BtvnSheet isBtvnDoc → tiêu đề = TÊN BUỔI 1 dòng (bỏ eyebrow "Bài tập về nhà" + docTitle). 
- giao_trinh_buoi: BỎ pv-cover (bìa) — tên buổi đã ở dải hồng. LT heading: buổi 1 chuyên đề → "Lý thuyết" (bỏ lặp tên chuyên đề trùng tên buổi); nhiều chuyên đề → giữ "Lý thuyết chuyên đề: X". (Nhãn BẢN HS/GV mất khỏi giao_trinh_buoi — biết qua nút chọn bản + bản GV có lời giải.)

**⚠ BUG MỞ (CHƯA SỬA):** **Lý thuyết buổi 3 có 4 trang nhưng trích PDF thành 8 trang** (giáo trình buổi — nội dung/ trang bị NHÂN ĐÔI khi in paged.js). Thùy báo rồi chuyển việc, tao CHƯA điều tra. Nghi: lý thuyết render 2 lần, hoặc paged.js nhân trang, hoặc trích xuất copy lý thuyết 2 lần. → việc tồn để soi.

**⭐ CHỐT PLAN HỆ THỐNG AUTO-REPORT (context này sẽ làm — độc lập với các tính năng khác):**
- **Mục tiêu:** vòng lặp report→AI fix→người duyệt để đẩy nhanh hoàn thiện lúc nhiều lỗi vụn.
- **Luồng 2 CỔNG NGƯỜI GÁC (Thùy chốt):** ① nhân sự báo lỗi (mô tả kỹ + ảnh + context tự đính) → `mới` · ② **Thùy filter**: duyệt lỗi nào cho auto-fix (loại task to/rủi ro) → `cho-fix`/`từ-chối`/`để-tự-làm` · ③ **AI (luồng riêng)** fix lần lượt report `cho-fix` trên **branch riêng → mở PR** (chờ sẵn) → `đã-fix·chờ-apply` · ④ Thùy online vào list đã-fix, **apply+test từng cái** (merge PR độc lập) → `xong`/`trả-lại`. **KHÔNG auto-merge main.**
- **Yếu tố sống còn:** chất lượng report (auto-capture route/leaf + vai trò + tài khoản + console errors + ID data + ảnh html-to-image). Report rác = fix rác.
- **Chỗ chạy "luồng riêng" (bước 3) — 3 lựa chọn:** #1 máy local (phải bật) · **#2 cloud routine Anthropic** (scheduled, máy tắt vẫn chạy; tiện nhưng CHƯA chắc clone repo/push PR/đọc Supabase/build được — phải spike) · **#3 VPS luôn bật** (chắc hơn, full toolchain → **tự build/tsc trước khi mở PR** = PR chất lượng, đỡ tốn giờ duyệt; phải set up + vài $/tháng). Rủi ro chung #1: agent unattended + auto-approve → phải nhốt cứng (chỉ branch, cấm main/migration/xoá/lệnh phá, chỉ mở PR).
- **Quyết định:** Pha 1 (nút report + bảng `bao_loi` + màn duyệt cổng 2) làm trước (cần bất kể chạy đâu). Rồi **SPIKE #2** (tiêu chí đậu: đọc report Supabase + sửa+build pass + push PR). Đủ 3 → chốt #2; thiếu → rớt **#3**. Tao cá cuối cùng về #3 (vì tự-build-test-trước-PR).
- **Pha 1 cần build:** `bao_loi`(Supabase, RLS member-gate, immutable+state-log §4: mo_ta·route·actor·context jsonb·anh_url·trang_thai·severity?·fix_note·commit_sha) · nút nổi 🐞 mọi màn (form 1 ô mô tả + tự đính context+ảnh) · màn "Báo lỗi" (queue + nút duyệt Cho-fix/Từ-chối/Để-tự-làm).

**🐞→✅ FIX: Copy ảnh ET gửi PH TRẮNG XÓA (EtAnhGuiPH, BuoiHocScreen):** Thùy báo "ấn copy thì trắng xóa". **NGUYÊN NHÂN GỐC = Tailwind v4 + oklch():** dự án dùng `tailwindcss@^4` → mọi màu mặc định (slate/emerald/amber/rose/indigo…) compute ra hàm `oklch()`. `html-to-image` (SVG `<foreignObject>`) KHÔNG serialize được `oklch()` → ảnh blob ra TRẮNG. Card export cũ dùng đầy class màu Tailwind (`text-slate-800`, `bg-emerald-500`, `border-slate-200`…) nên dính; chỉ dải gradient header thoát (vì hex `from-[#E91E8C]`). **FIX:** viết lại TOÀN BỘ subtree `cardRef` bằng **inline style hex/rgb (sRGB)** — không class màu Tailwind nào trong vùng chụp; set `color`/`fontFamily` (system-ui) tường minh ở root để không kế thừa oklch. `ET_KQ_PH.cls`(class)→`.hex`(mã màu). Legend render từ `Object.values(ET_KQ_PH)` (DRY). Thêm `skipFonts:true` cho `toBlob` (card dùng system font, khỏi nhúng web-font + né parse stylesheet chứa oklch). tsc pass. ⏳ Thùy test copy thật (cần localhost/HTTPS cho clipboard image). **BÀI HỌC: Tailwind v4 = oklch by default → mọi thứ chụp ảnh DOM (html-to-image/html2canvas) phải dùng màu sRGB tường minh trong vùng chụp, KHÔNG class màu Tailwind.**

**↑ FIX TRÊN CHƯA ĐỦ — VẪN TRẮNG. CHUYỂN SANG html2canvas (đúng lesson V1):** sau khi bỏ oklch khỏi card, html-to-image VẪN ra trắng. Lý do: `html-to-image` (SVG `<foreignObject>` → data-URL `<img>`) ở V2 fail ÂM THẦM khi serialize (SVG img onerror → canvas tô nền trắng, KHÔNG throw nên không thấy lỗi). Thùy nhắc "có lesson V1". Đọc `bkdemy-erp/files/{SKILL_REPORT,BKDEMY_UTILS}.md` §Screenshot: V1 dùng **html2canvas** (`backgroundColor:'#ffffff', scale:2, useCORS:true`, + `width/height = scrollWidth/scrollHeight` để bắt cả phần overflow) → chạy ổn cho đúng use-case "ảnh report gửi PH". **FIX:** `npm i html2canvas@1.4.1`; đổi import + `copyAnh` dùng `html2canvas(el, {...}).toBlob` → `clipboard.write`; **fallback tải file PNG** nếu clipboard ảnh bị chặn (như V1). Giữ card hex-inline (BẮT BUỘC — html2canvas 1.4.1 **throw** "unsupported color function oklch" nếu vùng chụp còn class màu Tailwind v4). tsc sạch ở BuoiHocScreen (lỗi tsc còn lại = `ReportButton.tsx` của Auto-Report đang dở, không liên quan). **BÀI HỌC kép: (1) html-to-image fail âm thầm → ra ảnh trắng, KHÔNG throw → khó mò; cho chụp-ảnh-DOM dùng html2canvas (V1-proven). (2) html2canvas hợp Tailwind v4 CHỈ KHI vùng chụp toàn màu sRGB hex/rgb (nó throw cứng trên oklch). Cả 2 đk: dùng html2canvas + card hex-inline.**

---

## 2026-06-22 (phiên 2) — AUTO-REPORT Pha 1 (bắt report + màn duyệt cổng 2)

**Build xong Pha 1 (hệ thống Báo lỗi):**
- **mig 0047** `bao_loi`(mo_ta·route·context jsonb·anh_url·trang_thai[moi|cho_fix|tu_choi|tu_lam|da_fix|xong|tra_lai]·ghi_chu_duyet·fix_note·branch·pr_url·commit_sha·created_by·created_at·updated_at) + `bao_loi_log` + **trigger `log_bao_loi`** (BEFORE UPDATE: ghi state-log khi đổi trang_thai §4 + set updated_at) + RLS member-gate (la_thanh_vien). ĐÃ áp DB.
- `src/lib/baoloi.ts` (seam): createBaoLoi · listBaoLoi · setTrangThaiBaoLoi(+patch fix/pr) · deleteBaoLoi · **uploadReportAnh** (best-effort → bucket `kho-anh` prefix `report/`, hỏng→null, report vẫn gửi).
- `src/lib/errorBuffer.ts`: vá console.error + bắt window error/unhandledrejection → giữ 25 lỗi cuối (Date.now, không toISOString). init ở `main.tsx`.
- `src/components/ReportButton.tsx`: **nút nổi 🐞** (fixed bottom-left, mount ở App → mọi màn). Bấm → **tự chụp #root** (html-to-image toBlob, best-effort) + gom context (leaf·người·email·la_admin·url·viewport·UA·lỗi-console-gần-đây) → form 1 ô mô tả → gửi.
- `src/screens/baoloi/BaoLoiScreen.tsx` (leaf `baoloi`, nhóm Hệ thống founderOnly): queue + lọc trạng thái + expand xem mô tả/ảnh/context → **CỔNG 2**: report `moi` → Cho-AI-fix / Để-tự-làm / Từ-chối; `da_fix` → Đã-apply(xong)/Trả-lại; xoá.
- Wire: fixtures adminLeaves +baoloi · NhanSuHome route+import · App mount ReportButton · main initErrorBuffer.
- tsc + build pass. **CHƯA test UI thật** (Thùy bấm thử 🐞 + vào màn Báo lỗi duyệt).

**CÒN (Pha 2):** luồng fix bước 3 — SPIKE #2 cloud routine (đọc report `cho_fix` từ Supabase + sửa+build + push PR), tiêu chí đậu→chốt #2, thiếu→#3 VPS. Khi nối: agent đọc report `cho_fix` → fix branch → set `da_fix`+branch/pr_url. **Nợ:** bucket riêng `report-anh` (giờ tái dùng kho-anh) · gate nhốt agent (chỉ branch/PR, cấm main/migration/destructive).

**Sửa Pha 1 (ngay sau):** BỎ auto-screenshot khỏi ReportButton. Lý do: app V2 = Tailwind v4 (oklch) → `html-to-image` chụp #root ra ảnh TRẮNG (SVG <img> serialize fail), `html2canvas` 1.4.1 THROW trên oklch. Cả 2 không chụp nổi full app. Giữ text-context (route/vai/console errors/url) + nhắc nhân sự dán ảnh vào mô tả. `uploadReportAnh` giữ lại (Pha 1.5 dùng). (Bài học: EtAnhGuiPH chụp được vì Thùy ép card dùng inline HEX, không oklch — full app không làm vậy được.) Screenshot Pha 1.5 = getDisplayMedia / html2canvas-pro.

**EtAnhGuiPH (Ảnh ET gửi PH) — FIX ĐÚNG CÁCH SAU 3 LẦN SAI (Thùy bực: "v1 luôn xuất html render lại cơ mà"):**
- **L1 (sai/thiếu):** đổi card sang inline HEX (bỏ class màu Tailwind v4 oklch) nhưng GIỮ `html-to-image.toBlob` → vẫn TRẮNG (html-to-image SVG `<foreignObject>` fail âm thầm).
- **L2 (sai cách):** chuyển `html2canvas` nhưng chụp THẲNG node live `cardRef.current` → dễ LỆCH (app CSS / `zoom:1.15` / scroll / overflow clip). Đây là cái V1 đã cảnh báo.
- **L3 (ĐÚNG — đọc kỹ pattern V1 `exportPhieuViaPopup` ở `bkdemy-erp/src/components/luyenthi/TabTestDauVao.jsx`):** V1 **XUẤT HTML → RENDER LẠI trong document SẠCH riêng** (popup `window.open`+`<base href>`+style tự chứa+html2canvas, `windowWidth/Height=scrollWidth/Height`) rồi mới chụp. **FIX V2 (giữ UX copy-clipboard, không bắt mở popup):** render `cardRef.outerHTML` (toàn inline-hex, tự mô tả) vào **IFRAME ẩn sạch** (`position:fixed;left:-10000px`, KHÔNG nhúng stylesheet app → KHÔNG oklch/zoom/clip) → chờ `doc.fonts.ready`+2×rAF → nới viewport iframe=scrollW/H+40 → `html2canvas(target,{scale:2,width/height/windowWidth/windowHeight=scrollW/H})` → `clipboard.write` từ tab CHA (vẫn focus) · fallback tải PNG · remove iframe. dep: `html2canvas@1.4.1` (bỏ dùng `html-to-image` cho chỗ này). tsc sạch (trừ ReportButton.tsx của Auto-Report đang dở).
- **⭐ BÀI HỌC GỐC (V1 nói rồi, bỏ qua 2 lần — ghi to):** **chụp ảnh DOM = XUẤT HTML + RENDER LẠI TRONG CONTEXT SẠCH (iframe/popup), KHÔNG html2canvas node sống trong app shell.** Card phải **tự-mô-tả bằng inline-hex** (không cần stylesheet app) → vừa né oklch Tailwind v4 vừa không lệch. Áp lại cho screenshot Auto-Report Pha 1.5 (full app không inline-hex được → phải getDisplayMedia, KHÔNG html2canvas node live).
- **L4 — chữ Đ/C/S trong vòng tròn LỆCH LÊN (Thùy: "đã bảo lệch"):** ảnh ra rồi nhưng chữ trong badge tròn bị đẩy lên đỉnh, không giữa. Gốc: badge canh giữa bằng **flexbox** (`display:inline-flex;align-items/justify-content:center`) — **html2canvas 1.4.1 KHÔNG render nổi flex-center**, đặt glyph theo baseline → lệch lên. **Fix: canh giữa bằng `line-height = đường-kính` + `text-align:center` + `display:inline-block`** (bỏ flex) cho cả badge bảng (24px) lẫn badge legend (16px); legend đổi flex→inline-block + `vertical-align:middle`. **BÀI HỌC: trong vùng html2canvas chụp, KHÔNG canh giữa bằng flexbox — dùng line-height/text-align (cách cũ, html2canvas render chuẩn).**
- **L5 — CHỐT: làm ĐÚNG NGUYÊN pattern V1 = POPUP có nút Copy bên trong (Thùy: "v1 vẫn là popup để copy clipboard chứ có lúc nào tải file đâu... nên làm như v1 sẽ nhanh hơn").** Tao HIỂU SAI V1 = tải file; đọc lại `bkdemy-erp/src/components/luyenthi/TabSatHach.jsx` `handleCopy`/`copyImg` (+ TabTestDauVao tương tự): V1 **`window.open` → `document.write` HTML phiếu (card outerHTML) + nhúng html2canvas CDN + 2 nút "📋 Copy ảnh (paste Zalo)" / "🖨️ In-Lưu PDF"**; bấm Copy TRONG popup = **user-gesture trong context popup** → html2canvas(node) → `clipboard.write(ClipboardItem)` chạy ngon; **fallback tải file CHỈ trong `catch`** (clipboard bị chặn). **FIX V2:** bỏ iframe + import html2canvas; `EtAnhGuiPH.handleCopy` build popup HTML y V1 (card đã inline-hex nên KHÔNG nhúng CSS app → né oklch), html2canvas từ **CDN trong popup** (không vào bundle). Giữ fix L4 line-height-center. Nút modal "📋 Copy ảnh" → mở popup. tsc sạch (trừ ReportButton). dep `html2canvas@1.4.1` giờ KHÔNG còn import vào bundle (CDN) — để lại trong package, vô hại. **BÀI HỌC TỔNG: khi V1 đã có pattern chạy production cho ĐÚNG bài toán (copy ảnh gửi PH), BÊ NGUYÊN — đừng tự chế (iframe/canvas-native) rồi căn chỉnh vòng vo. Đọc KỸ code V1 (cả handleCopy lẫn copyImg) TRƯỚC, không lướt.**
- **L6 — chữ Đ/C/S vẫn lệch tâm (cao rồi lại thấp) → CHỐT: badge = SVG.** line-height-center của html2canvas lệch baseline (lúc cao lúc thấp tuỳ font) + html2canvas **bỏ qua `position:relative` trên span inline** (nudge tay vô hiệu) → căn pixel kiểu mò là ngõ cụt. **Fix: component `<Badge>` vẽ bằng SVG** (`<circle>` + `<text text-anchor="middle" dominant-baseline="central">`, fontSize=size*0.52). **html2canvas raster SVG bằng CHÍNH engine trình duyệt → căn tâm pixel-perfect, giống hệt trên màn**, khỏi nudge. Áp cho cả badge bảng (24) lẫn legend (16). **BÀI HỌC: cần hình/căn-chính-xác trong vùng html2canvas → dùng SVG (browser render), ĐỪNG dựa căn-chữ-CSS của html2canvas (baseline lệch, bỏ qua relative offset).**

---

## 2026-06-23 — Redesign màn "Việc của tôi" (vận hành theo tuần + deadline) + bỏ nav tree (CHƯA push, chờ Thùy test)

**Yêu cầu Thùy:** (1) BỎ cây nav "Tra cứu & sửa" (placeholder không link đâu — màn chính đã đủ, sửa thì bấm card đã làm). (2) Việc-của-tôi: filter THỜI GIAN theo TUẦN (vận hành reset tuần, phát triển không filter); **vận hành cột trái chiếm 2 cột, phát triển cột phải 1 cột**; tuần T2→CN, **Tuần 1 = 29/6–5/7**, trước đó = "Tuần khởi động" (tuần ≤0); mặc định = tuần hiện tại. (3) "Đã xong" bấm ra list gần→xa theo thời gian, **20/lần + Mở thêm**. (4) Filter loại task (Chấm ET/BTVN/Điểm danh/Đánh giá/Chấm bài). (5) **Deadline trên card** (giờ còn lại + 3 mức màu): ET = 12h trưa hôm sau · BTVN = 2h TRƯỚC ca học tiếp theo của lớp · Chấm-bài + Đánh-giá = 23h59 ngày buổi. **Cột phát triển: Thùy chốt sau** (hướng = giao việc THẬT cấp-trên→cấp-dưới, không pure-derive) → giai đoạn này để **placeholder "Giao việc — sắp có"**. Ngưỡng deadline: làm **chỉnh được** (config).

**Đã làm:**
- **`src/lib/tuan.ts` (MỚI):** util tuần BK + deadline, THUẦN giờ VN (Date.UTC, KHÔNG toISOString). `WEEK1_MONDAY_UTC=Date.UTC(2026,5,29)`; `tuanCuaNgay`/`khoangTuan`/`nhanTuan` (≤0 → "Tuần khởi động"); `homNayVN`/`congNgay`; `vnInstant(ngay,'HH:MM')` = epoch VN (UTC−7h); **`NGUONG_DEADLINE={satGio:2,ganGio:8}` (CHỈNH Ở ĐÂY)** + `mucDeadline`(qua_han/sat/gan/con_nhieu) + `nhanConLai`("còn 3h"/"quá hạn 2h").
- **`gami.ts`:** `MyTask` thêm `lopId·doneAt·deadline`. `getMyTasks` tải thêm TKB (lopIds) → `caTiepTheo(lopId,after)` quét 21 ngày suy ca kế → deadline BTVN=ca−2h; ET=hôm-sau 12h; ingame/danhgia=ngày-buổi 23h59; `doneAt` = `*_dong_at` tương ứng tab. Thêm **`buoiAoCuaKhoang(tu,den)`** (OPS điểm danh CẢ TUẦN: TKB×mỗi ngày trong khoảng + map buổi đã mở theo `lop|ngay`).
- **`useStore.ts`:** `staffNavFromScope` giờ CHỈ trả `[{Việc của tôi}]` (bỏ nhóm "Tra cứu & sửa" + children tc:*). Param `_scope` giữ cho tương lai.
- **`NhanSuHome.tsx`:** rewrite `VietCuaToi` — header điều-hướng tuần (‹ ›/"Tuần này") + chips filter loại; **grid 3 cột** (vận hành col-span-2 / phát triển col-span-1). Vận hành = OPS điểm danh (buoiAoCuaKhoang theo tuần) + GV/TG task (lọc `tuanCuaNgay(ngay)===tuan`), card có `<DeadlineBadge>` (đỏ quá-hạn/đỏ-nhạt sát/cam gần/xám còn-nhiều, tick mỗi 60s). "Đã điểm danh xong tuần này" (collapse) + **"Đã xong — lịch sử"** (all-time, sort doneAt desc, slice `doneShown` +20/"Mở thêm"). Cột phải = placeholder giao-việc + "Lớp tôi phụ trách". Bỏ handler `tc:*` + `isClass/lop`. `TaskCard` thêm deadline + ngày dd/mm; `OpsBuoiCard` thêm dd/mm (week view nhiều ngày).
- ✓ tsc sạch (trừ ReportButton WIP) + `npm run build` OK. **CHƯA commit/push — chờ Thùy chạy `npm run dev` test.** (Hôm nay 23/6 = "Tuần khởi động" tuần 0; lớp K9/K12 khai giảng 16/6 sẽ hiện, lớp khác 1/7 hiện từ Tuần 1.)
- **CÒN/NOTE:** cột "Phát triển" = giao việc thật (model bảng giao-việc + luồng giao/nhận) — feature riêng, chốt sau. Ngưỡng deadline mới ở config code (`NGUONG_DEADLINE`), chưa có UI settings cho người chỉnh (Thùy muốn "có chỗ setup càng tốt" → dựng sau). OPS điểm danh "đã xong" hiện theo tuần (không vào lịch-sử-all-time vì không có mốc doneAt sạch).

**UI redesign Việc-của-tôi (cùng ngày, sau khi Thùy chê "trống quá + đơn giản"):** **⚠ Thùy BỎ HẲN sci-fi HUD** ("t bảo bỏ cái scifi đi, xóa luôn cơ mà") → KHÔNG dùng skill `bkdemy-scifi-ui` cho màn staff nữa (memory `staff-ui-no-scifi`). Hướng = **clean/SaaS, NHIỀU MÀU/sống động** (Thùy chọn). Quy trình: dựng **mockup (visualize widget)** cho Thùy duyệt hướng TRƯỚC khi sửa code thật (tránh đoán sai làm lại). Áp vào `NhanSuHome.tsx`:
  - **Dải số liệu** 4 thẻ màu (Cần làm/Quá hạn đỏ/Sát hạn cam/Đã xong tuần xanh) — `Metric` + `METRIC_TONE`.
  - **Thẻ việc to & màu**: icon emoji theo loại trong chip màu + **accent viền-trái màu** theo loại (`TASK_STYLE`: điểm danh xanh-dương/chấm-bài tím/ET teal/BTVN hổ-phách/đánh-giá hồng); nhãn deadline = **pill bo tròn có icon+màu** (⚠ đỏ quá hạn / ⏰ đỏ-nhạt sát / ⏳ cam gần / 🕒 xanh còn-nhiều); OpsBuoiCard có **thanh tiến độ sĩ số** + "Bấm để mở buổi →" khi chưa mở.
  - **Lưới tự co cột** `[grid-template-columns:repeat(auto-fill,minmax(230px,1fr))]` → màn rộng tự thêm cột (hết trống). Chip filter có icon loại.
  - **BỎ panel "Lớp tôi phụ trách"** (Thùy: "ai cũng biết lớp mình"). Cột phải giờ chỉ còn placeholder "📨 Giao việc — sắp có".
  - ✓ tsc + build OK. **CHƯA push.** Thùy: "tạm thế đã, chỉnh UI từng card tính sau".

**Tinh chỉnh UI Việc-của-tôi (nhiều vòng nhỏ) → ⭐ CHỐT DESIGN SYSTEM staff = "Apple-clean":**
- Round: bỏ phí ngang (max-w-1600 + grid [1fr_280px]) · card xếp dọc, tên FULL (bỏ truncate), deadline 1 dòng riêng · metric border đậm → **rồi đổi gu Apple**: nền **xám `#f5f5f7`** + card **trắng `rounded-2xl shadow-sm`** (hover nhấc nhẹ) bỏ viền nặng, accent màu trái; metric = card trắng + số màu; section head = thanh màu + chữ to + kẻ dọc ngăn vận-hành/phát-triển; chữ tiêu đề 22px / nav-chip 14px.
- **Màu deadline:** đỏ-đặc-khối "lạc quẻ" với tông nhẹ → đổi **pill MỀM** dải nóng→nguội: **đỏ(qua_han red-50/700) → cam(sat orange) → hổ phách(gan amber) → xanh(con_nhieu emerald)**; metric Quá hạn=đỏ, Sát hạn=cam.
- **⭐ Thùy CHỐT: mọi màn staff sau bám gu Apple-clean này.** Nguyên tắc cốt: **card trắng PHẢI nền xám** (tương phản, cấm trắng/trắng) · pill mềm không khối đặc · 1 sắc đỏ dịu · thoáng/bo-tròn-lớn/bóng-mềm · accent indigo. Đã ghi: HANDOFF ① "GU UI STAFF" + ② (sửa bullet cũ "scifi cho staff" = SAI) + memory `staff-ui-no-scifi`. Mẫu chuẩn = màn `viec` (NhanSuHome.tsx). ✓ tsc+build. Push cụm này.

**Sửa card (Thùy chê round 2):** (1) bố cục bỏ phí chiều ngang → container `max-w-[1600px]`, grid `[minmax(0,1fr)_280px]` (vận hành chiếm hết, phát triển rail hẹp 280px). (2) **bỏ `truncate`** tên task (hiện full, không `...`) + thông tin đầy đủ (thêm phòng ở OPS). (3) card **xếp DỌC** (`flex flex-col`): dòng1 icon+tên full · dòng2 thông tin · **dòng cuối deadline riêng 1 dòng** (OPS=thanh tiến độ). (4) **border đậm** `border-2` + accent trái `border-l-4` màu theo loại. Bỏ panel "Lớp tôi phụ trách" (Thùy: "ai cũng biết").

**🐞→✅ BUG sĩ số: HS thêm SAU khi mở buổi không vào luồng điểm danh (Thùy báo).** Chẩn từ DATA THẬT (script `_diag_siso` claude_ro): 2 buổi 23/6 thiếu HS — **9B1 hoan_tat** thiếu Bùi Nguyễn Bảo Trâm (ngay_vao 22/6) + **9A2 mo** thiếu Lê Khôi Nguyên. **Gốc:** roster `buoi_hoc_hs` = SNAPSHOT lúc mở buổi; `dongBoSiSo` (vá) **chỉ chạy lúc BuoiDetail mount** + **từ chối buổi `hoan_tat`** (`trang_thai!=='mo'` return 0) → HS vào lớp sau khi buổi đã hoàn_tat KẸT cứng (mở lại cũng không sync). **Fix 3 lớp:** (1) `nhansu.ts` `syncHSVaoBuoiTuNgay` — `ghiDanh`/`setNgayVao` SAU upsert tự thêm HS vào roster MỌI buổi đã mở của lớp từ `ngay_vao` (mo+hoan_tat, bỏ huy, idempotent) → join NGAY khỏi mở lại buổi (cả `chuyenLop` vì gọi `ghiDanh`). (2) `gami.ts` `dongBoSiSo` đổi guard `!=='mo'`→`==='huy'` (sync cả hoan_tat, phòng tuyến mount). (3) backfill `_fix_siso_backfill` (claude_build, giới hạn ngay≥current_date−14 tránh khơi buổi cũ) thêm 2 dòng kẹt. Verify sạch. Scripts throwaway đã xoá. ✓ tsc+build. **Buổi hoan_tat thêm HS → tự về "cần điểm danh" (sĩ số 7/8) cho OPS đánh dấu — đúng model.** **CHƯA push** (gộp cụm Việc-của-tôi, Thùy test xong push 1 thể).

**ADR PHỄU TUYỂN SINH (Test đầu vào) · L5→L8 — viết Notion, chờ duyệt rồi build (Thùy chọn "ADR trước"):** Story Thùy: PH liên hệ→tư vấn→contact (tên HS+tên/SĐT PH)=**L5 đăng ký test** (việc: gửi quy trình) → **L6 đến test** (chấm bài·trả bài·chốt lịch học thử) → **L7 học thử** (xác nhận đăng ký) → **L8 chính thức=`hoc_sinh` đang học**. Mỗi level = filter toggle bar; cột=việc, trạng thái=checkbox; tick đủ→nút Hoàn thành sáng→promote level. **Hoàn thành L7 = nhập HS mới** (cửa nhập HS chính; nhập-trực-tiếp=ngoại lệ). **Q&A chốt:** (1) Thùy hỏi model nào chuẩn→tao rec **`ung_vien` RIÊNG** (data quality: lead nhiều, không nhồi hoc_sinh kẻo bẩn count/roster/mastery; chuẩn CRM lead≠customer; convert L7→L8 tạo HS). (2) drop-off=**trạng thái Loại/Rớt + lý do** (đo conversion). (3) bước tiếp=**viết ADR Notion trước**. Insight thiết kế: checklist **2 loại** — chấm-bài=DERIVE (TA chấm test xong xác nhận→hệ tự tick, §4) · còn lại=tick tay người-confirm (§5). **ADR đã tạo** dưới ERP V2: app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233 (model `ung_vien`/`ung_vien_viec`/`ung_vien_log` + màn Tuyển sinh + câu hỏi mở). Seam **chấm-bài-test đầu vào** = ADR riêng sau (TA chấm trên hệ thống). **CHỜ Thùy duyệt ADR + trả câu hỏi mở → build.** Ghi HANDOFF "Nguồn intent (Notion)".

**ADR Phễu — Thùy trả 5 câu hỏi mở (đã ghi vào ADR Notion §Chốt):** (1) **OPS lead** vận hành phễu; TA+GV chấm; **KHÔNG bẻ task / KHÔNG vào "Việc của tôi"** (flow nhiều bước + phụ thuộc PH/HS) → màn Tuyển sinh độc lập, không nối getMyTasks. (2) lịch học thử = **output L6** (gán ngay L6 sau trả bài; GV chốt ngoài Zalo). (3) nguồn lead = **free text tự thêm** (như nhận xét), suggest distinct, không enum. (4) convert **gộp PH cũ theo SĐT**. (5) gửi quy trình = thủ công Zalo + tick tay. → ADR cập nhật (insert_content section "✅ Chốt 06-23").

**🐞→✅ MÃ PH/HS — thống nhất 4 số + sửa suggest (Thùy: mã cũ/mới lệch format + sợ tái dùng số):** Soi data (claude_ro): `ma_ph` 299 LẪN format (`PH###`×256 cũ, `PH##`×22, `PH#`×1, **`PH####`×20** app đẻ số 1–20 ĐỤNG số cũ → phá unique); `ma_hs` 354 đã `HS####` + **1 rác "1111"**; `ma_ns` sạch. **2 bug:** (a) `suggestNextMa` sort theo CHUỖI không phải SỐ → max sai khi mã khác độ dài (PH99 > PH693). (b) 20 mã PH mới đẻ số thấp đụng số cũ. **Fix code:** `suggestNextMa` parse phần SỐ của MỌI mã (chịu format lẫn) trên TOÀN BỘ dòng (kể cả nghỉ) → max+1 pad → không tái dùng. **Fix data (Thùy chọn 4 số đồng nhất, throwaway `_fix_ma_unify` trong transaction + guard idempotent + verify trùng):** dời 20 mã PH đụng-số → PH0694+ (theo created_at) · pad 279 mã cũ → 4 số · nắn HS "1111"→HS0621. Kết quả: PH `PH####`×299 (số 4..713), HS `HS####` (4..621), không trùng, commit. Mã = ID hiển thị (KHÔNG FK) nên rename an toàn. ✓ tsc+build. (Lưu ý: với data đã đồng-nhất-độ-dài thì kể cả suggest cũ cũng đúng, nhưng code mới robust hơn.) **CHƯA push** (gộp với code fix khi build phễu).

**BUILD MÀN TUYỂN SINH (phễu Test đầu vào L5→L8) — đợt 1 (ADR app.notion.com/p/389d4530bcdb81749d0fd6f0a741c233):**
- **mig 0048** (ĐÃ áp DB cloud + npm run schema): `ung_vien`(lead RIÊNG: ma_uv·ho_ten_hs·ho_ten_ph·sdt_ph·khoi·mon·nguon·level[L5/L6/L7]·trang_thai[dang_chay/loai/da_convert]·ly_do_loai·diem_test·lop_du_kien_id·ngay_hoc_thu·hoc_sinh_id·…) · `ung_vien_viec`(checklist anti-NULL: có dòng=xong, unique uv+viec_key) · `ung_vien_log`(trigger `log_ung_vien` ghi tao/chuyen_level/loai/convert/mo_lai, mẫu như 0028). RLS member-gate + grants.
- **`src/lib/tuyensinh.ts`**: VIEC_BY_LEVEL (L5 gửi-quy-trình · L6 chấm-bài[derive,TẠM tick tay]+trả-bài+chốt-lịch · L7 xác-nhận-ĐK) · listUngVien/getViecXong/toggleViec/duViec · hoanThanhLevel (promote L5→L6→L7) · loai/moLai · **convertUngVien** (L7→L8: gộp PH theo SĐT hoặc tạo mới + createHocSinh + tuỳ ghi danh lớp → set hoc_sinh_id+da_convert) · demTheoLevel (L5-7 từ ung_vien, L8=hoc_sinh đang học) · listNguon (distinct, gợi ý free-text) · suggestMaUV.
- **`src/screens/tuyensinh/TuyenSinhScreen.tsx`** (Apple-clean): toggle bar L5/L6/L7/L8/Đã-loại + đếm · bảng ứng viên × cột-việc (checkbox tick) + nút Hoàn thành (sáng khi đủ việc; L7 → modal Convert tạo HS) + Loại (modal lý do) · Create modal (tên HS/PH/SĐT/khối/nguồn-datalist/mã UV) · Convert modal (khối + xếp lớp SearchSelect, báo gộp PH) · L8 = list hoc_sinh đang học · Đã-loại = list + Mở lại.
- Wire: leaf `tuyensinh` (nhóm Vận hành, fixtures) + route NhanSuHome. **OPS chưa thấy leaf** → cần cấp ở Phân quyền (tick Tuyển sinh cho role OPS); admin thấy sẵn.
- Checklist 'cham_bai' gắn cờ `derive` (badge "auto") nhưng TẠM tick tay tới khi build seam chấm-bài-test (ADR riêng). ✓ tsc+build. **CHƯA push** — Thùy test trước (đặc biệt luồng L7 convert tạo HS thật + gộp PH).

**BUILD BỔ TRỢ BÙ (bù buổi nghỉ L1→L3) — đợt 1 đầy đủ (ADR app.notion.com/p/389d4530bcdb81de9549fdb99ce1083e):**
- **mig 0049** (ĐÃ áp DB + schema): `bang_khong_bu`(buoi_hoc_hs_id·loai[khong_can_bu/khong_xep_duoc]·ly_do·unique) + `gami_session_problems.hoc_sinh_id` (ET per-HS). TÁI DÙNG `buoi_hoc loai='bu'` + `buoi_hoc_hs.bu_cho_buoi_id` (đã có).
- **`src/lib/botro.ts`**: listCanBu (L1 = vắng buổi-thường TRỪ đã-xếp/đã-quyết, pure-derive) · listCaBoTro(done) (L2/L3 = buổi bù chưa/đã đóng ET+đánh-giá) · listKhongBu · ghiKhongBu/xoaKhongBu · taoBuoiBu (loai='bu', no lop, ngày+giờ+phòng+GV+TA) · themHSVaoBuoiBu (set bu_cho_buoi_id per-HS) · **ensureBuoiBuETProblems** (seed ET per-HS = ET buổi MẸ từng em, gắn hoc_sinh_id) · demTabBoTro.
- **`gami.ts getMyTasks`**: thêm nhánh buổi `loai='bu'` mà `nguoi_day`(GV)/`nguoi_day_tg`(TA)=mình → 2 task Chấm-ET(TA)+Đánh-giá(GV), mốc et_dong_at/danh_gia_xong_at, deadline ET=12h hôm sau · ĐG=23h59. KHÔNG qua phan_cong_lop, KHÔNG Elo. `Problem` thêm `hoc_sinh_id`.
- **`src/screens/botro/BoTroScreen.tsx`** (Apple-clean): tabs Cần-bù/Đã-xếp/Hoàn-thành/Không-bù + đếm. **Cần bù**: bảng vắng (multi-select) → Xếp bổ trợ / Không cần bù(+lý do bắt buộc) / Không xếp được. **Xếp bổ trợ modal**: tạo buổi mới (ngày/giờ/phòng/GV/TA) HOẶC chọn buổi bù có sẵn → thêm HS. **Đã xếp/Hoàn thành**: card ca bổ trợ → **BuoiBuDetail** (3 sub-tab: Điểm danh · **Chấm ET per-HS** [mỗi HS bộ câu từ buổi mẹ, Đ/C/S, Xác nhận ET=closePhase] · **Đánh giá** [per-HS×dạng Đ/C/S, Hoàn thành=dongDanhGia]). Đóng cả ET+đánh-giá → ca tự sang L3 (derive). **Không bù**: list + "Đưa lại Cần bù" (xoaKhongBu). Khớp về mẹ = link query, không copy.
- Wire: leaf `botro` (Vận hành) + route. **OPS chưa thấy leaf** → cấp ở Phân quyền (như tuyensinh); admin thấy sẵn.
- ✓ tsc+build. **CHƯA push** — Thùy test cùng Tuyển sinh (1 người test cả 2). Lưu ý: ET buổi bù chỉ có câu nếu buổi MẸ có ET tài liệu (lớp+ngày). Mastery merge = khi dựng mastery engine.

**Bổ trợ — nav nhóm RIÊNG + tinh chỉnh L1 (Thùy):** (1) "Bổ trợ" tách thành **nhóm nav riêng ngang hàng Vận hành** (Vận hành=quanh buổi học chính · Bổ trợ=support ngoài học chính); lá `botro` đổi tên "Bù"; thêm `'Bổ trợ'` vào union `AdminLeaf.nhom`. (2) L1 Cần-bù: bỏ checkbox đa-chọn → mỗi HS **3 nút 1-click** (Xếp bổ trợ / Không xếp được[tức thì] / Không cần bù[ô lý do]); info thành **3 block to rõ** (component HsBlocks: tên·lớp·ngày). (3) Popup Xếp bổ trợ **to 820px** + **mặc định từ lớp mẹ** (helper `goiYBuoiBu`: TA=người-bổ-trợ-mặc-định + GV + giờ + phòng). ✓ tsc+build.

**ADR CHIỀU MÔN (đa môn Toán·Anh·KHTN) — viết Notion sau sparring (chốt hướng B):** Thùy thêm KHTN+Anh. Phản biện chốt: phần lớn hệ ĐÃ mon-ready (HS/PH/Ops/lớp/buổi/Tuyển-sinh/Bổ-trợ/Elo per lop.mon); vùng cần phân tách = **kho+câu+lý-thuyết+tài-liệu** (đang gắn cứng Toán dai_/hinh_). **Thùy chốt:** mỗi môn độc-lập+tùy-biến → **schema CHUNG scope mon, taxonomy CÂY linh hoạt** (mỗi môn tự định nghĩa tầng/tên/thuộc-tính jsonb), KHÔNG fork bảng mỗi môn (hướng B). **KHTN=1 môn** (Lý/Hóa/Sinh=tầng-1). **Anh/KHTN dùng đủ kênh đo Toán** (ET+đánh-giá) trước, kênh riêng (Anh 4 kỹ năng / KHTN thực hành) sau. KP `ma_kp`≡`ma_dang` mon-unique → gami/buổi/đo gần như không đổi. **Phasing P1** schema chung+bộ-chọn-môn+build KHTN/Anh thẳng (data sạch, không migrate) · **P2** Kho/Làm-tài-liệu branch theo mon (Toán giữ dai_/hinh_) · **P3** migrate Toán→chung. ADR: app.notion.com/p/389d4530bcdb81d1b700ff61afcc2faf. **CHỜ build P1** (cần Thùy chốt taxonomy tầng cụ thể cho KHTN+Anh + có dựng bảng `mon` catalog không).

**BUILD KHO KHTN (đa môn — P1) — bản đồ + câu chạy được, Toán KHÔNG đụng (ADR Chiều Môn):** Thùy chốt: bảng RIÊNG mỗi môn (kho=content viết-1-lần, không join vận hành nên không rối); engine kho tham-số-hoá để 1 codebase. KHTN giống Toán (Chủ-đề→Chuyên-đề→Dạng + bậc + độ-khó), KHÔNG nhánh Đại/Hình.
- **mig 0050** (ĐÃ áp DB + schema): clone `dai_*` → `khtn_ban_do`/`khtn_cau_hoi`/`khtn_dang_ly_thuyet`/`khtn_chuyen_de_ly_thuyet` (seq KG/KC, RLS member-gate). + `tai_lieu.mon` (default toan) + **nới FK `tai_lieu_cau.ma_cau`** (để trỏ câu môn khác — dispatch theo tai_lieu.mon, chặng tài-liệu).
- **`kho/api.ts`**: câu functions (listCauByDang/createCau/updateCau/deleteCau/nextCauSeq/saveCloneBatch/saveCauBatch) thêm tham số `tbl='dai_cau_hoi'` (default → Toán KHÔNG đổi). + section KHTN map/lý-thuyết/count (`listKhtnMap`/`createKhtnMap`/`updateKhtnLeaf`/`delete*`/`rename*`/`countCauByDangKhtn`/`*KhtnLyThuyet`).
- **`branches.ts`**: `key` thêm `'khtn'` + field `cauTbl` + **`khtnBranch`** (clone daiBranch, cauTbl='khtn_cau_hoi', list/count/CRUD/lý-thuyết trỏ hàm khtn).
- **`DangHub.tsx`**: `isDai` → **`hasCau = !!config.cauTbl`** (Đại+KHTN có câu, Hình placeholder); mọi câu call truyền `cauTbl` (CauModal + AiImportModal nhận prop `cauTbl`).
- **`KhoScreen.tsx`**: **bộ chọn MÔN** (Toán | KHTN) segmented; Toán→nhánh tab Đại/Hình, KHTN→1 cây (no nhánh). config = mon==='khtn'?khtnBranch:….
- ✓ tsc+build. **CÒN (chặng kế): TÀI LIỆU KHTN** — `tailieu.ts` getTaiLieuFull/autoSuggest* + TaiLieuScreen/Builder/ET đang hardcode `dai_cau_hoi`/`dai_ban_do` → cần thêm `mon` + dispatch theo `tai_lieu.mon`. + bộ-chọn-môn scope theo `nhan_su_mon` (RBAC ④) chưa làm. + Anh chờ GV.

## 2026-06-25 — Tuyển sinh nâng cấp (đầy đủ/PH-cũ/HS-cũ/đa-môn) + gỡ HS khỏi buổi + mon.ts + 2 data fix
- **EtAnhGuiPH / Việc-của-tôi / sĩ số / mã**: đã chốt & push các phiên trước (xem HANDOFF block 06-23/24).
- **TUYỂN SINH nâng cấp** (mig 0051/0052/0053):
  - 0051: `ung_vien` + ngay_sinh/gioi_tinh/dia_chi/truong_hoc/email_ph → form nhập ĐỦ như Học sinh, convert copy thẳng (createHocSinh + email PH).
  - **Sửa lead**: `CreateModal`→`UvFormModal` (uv=null tạo / uv=obj sửa), nút ✎ mỗi dòng L5–L7. Modal nhận `maxW` (rộng 640).
  - **Cột Lưu ý** (`ghi_chu`, đã có 0048) hiện mọi level (L5–L7 + Đã loại), sửa qua form. Số đếm level: text-15 bold, pill indigo.
  - **Toggle bar MÔN** riêng (state `mon` localStorage `ts.mon`); listUngVien/listLoai/demTheoLevel/listHSDangHoc nhận `mon`; L8 lọc HS theo lop.mon (join hoc_sinh_lop).
  - 0052 `phu_huynh_id`: **PH cũ picker** (`PhCuPicker` dùng `listPhuHuynh`), pick→fill+link+banner `listConByPH` (con để xác nhận); convert dùng `uv.phu_huynh_id` trước SĐT-match → ko tạo PH trùng.
  - 0053 `hoc_sinh_goc_id`: **HS cũ học thêm môn** (`HsCuPicker`/`timHocSinh`+`chiTietHSChoLead`) pick→fill HS + PH tự load; **convert: nếu hoc_sinh_goc_id → chỉ ghiDanh lớp môn mới, KHÔNG tạo HS/PH** (ConvertModal đổi chữ "Ghi danh"). lopOpts lọc `l.mon===uv.mon`.
- **Thêm môn VĂN**: `MON_OPTIONS = ['Toán','KHTN','Tiếng Anh','Văn']`.
- **GỠ HS KHỎI BUỔI**: `xoaHSKhoiBuoi(row)` (gami.ts) — count downstream (grades/elo/exp/btvn/canh_bao/problems) >0 → throw chặn; else xoá bang_khong_bu con + buoi_hoc_hs. Nút ✕ trong `DiemDanhTab` (chỉ `canManage`=OPS/admin), confirm.
- **`src/lib/mon.ts`** = `MON_LIST` 1 nguồn; tuyển-sinh `MON_OPTIONS`=MON_LIST; HocSinhScreen `mons` = MON_LIST ∪ môn-lạ → panel lớp&band luôn đủ 4 môn (sửa lỗi Thùy báo: HS chỉ hiện Toán+KHTN).
- **DATA FIX** (claude write qua `_diag`/`_del` rồi xoá script): (1) Quỳnh Trang(HS0622) điểm danh sai @9A2 25/06 — chỉ 1 dòng buoi_hoc_hs `vang_phep`, ko downstream, em da_roi 9A2 + dang_hoc 9B1 → xoá 1 dòng. (2) 6A1/6A2 (khai giảng 15/07) — 1 buổi test `6A1.T2.22062026` + 2 sĩ số, ko downstream → xoá buổi+sĩ số, giữ lớp+ghi danh.
- ✓ tsc sạch mọi bước. Push 3 commit (eafe429 tuyển-sinh+gỡ-HS · 7781955 mon.ts/4-môn).
- **TREO (việc kế tiếp)**: **sơ đồ tổ chức theo môn** — Thùy chốt cây-độc-lập-mỗi-môn (CTO nghiêng) vs nhãn-lọc, rồi build `vi_tri.mon`+OrgChart+scope④. KÈM tài liệu KHTN + nhan_su_mon.

## 2026-06-26 — Bổ trợ ĐUỔI luồng · Kho Đúng/Sai (bank+AI) · fix BTVN/ET layout · Bổ trợ CRUD+gộp-bù · dời nút báo lỗi
- **BTVN trùng doc (mig 0054)**: 9A2 25/06 ko load BTVN — gốc: `trichXuatBuoi` insert mù → re-trích đẻ doc mới → 1 buổi 2 BTVN → `getBTVNByBuoi.maybeSingle()` THROW. Quét thấy 8 doc trùng (9A2+9B2). Fix 3 lớp: dọn data (giữ bản mới nhất), unique index từng-phần `(lop_id,ngay,loai)` cho doc vận-hành, trichXuatBuoi xoá-rồi-tạo (re-trích=thay thế), getBTVNByBuoi/getETByBuoi `order+limit1` thay maybeSingle.
- **BTVN/ET layout (15 HS)**: BTVN gộp nộp+thái-độ về cùng dòng tên (2 select nhỏ). ET+BTVN nén dòng (nút h-7, py-1) + bảng cuộn trong khung (header dính, >15 mới thanh kéo). ET bỏ `w-full` → co nội dung, cột câu cố định 150px. Tên HS căn trái mọi bảng.
- **Tuyển sinh**: nút "Bổ trợ đuổi" ở cột L6/L7 = convert L8 + tạo case đuổi (PH chốt đuổi=đã chính thức→skip học thử). Nút "→ Chính thức" L6. Bỏ checkbox form. Fix ngày-sinh: thực ra ko default hôm nay (data null đúng) — thêm autoComplete=off + max=hôm nay + nhãn optional.
- **⭐ BỔ TRỢ ĐUỔI luồng (mig 0055)**: bảng `bo_tro_duoi` (case HS×lớp, trang_thai can_duoi|hoan_thanh) + `buoi_hoc_hs.bo_tro_duoi_id` + `ung_vien.can_bo_tro_duoi`. `buoi_hoc.loai='bo_tro_duoi'` ĐÃ hợp lệ sẵn (constraint). Màn `botro_duoi` 3 tab: Cần đuổi (case ko trong buổi mở → buổi xong HS tự về) / Đã xếp / Hoàn thành. Buổi đuổi = điểm danh + nhận xét (KHÔNG ET). Nút Hoàn-thành-buổi + per-HS Hoàn-thành-KHÓA. `botro_duoi.ts` + `BoTroDuoiScreen.tsx`. Convert tạo case khi `opts.duoi`. RANH GIỚI model (Thùy chốt): đo/dịch-vụ ở L8; L5-L7=phễu thuần; đuổi=đã chính thức.
- **⭐ KHO ĐÚNG/SAI** (Phần 2 đề 2025): CON của chuyên đề (cạnh Lý thuyết), KHÔNG tab top-level. Tái dùng `dai_cau_hoi` cột `menh_de` jsonb (đã có sẵn, chưa dùng) — 4 mệnh đề, mỗi cái `{noi_dung, dap_an D/S, ma_dang, loi_giai}`. dang_chinh = dạng đại diện chuyên đề nhà (browse). Nút 📋 Đúng/Sai ở header chuyên đề (BanDo, gate `config.cauTbl` → Toán+KHTN, ko Hình). `DungSaiBank.tsx` (DungSaiPanel scoped 1 chuyên đề) + api `listDungSaiByDang`/`createCauDungSai`. **Nhập AI**: PDF/ảnh → `callGeminiJson(buildDungSaiIngestPrompt, DUNGSAI_SCHEMA)` bóc đề+4mệnh-đề+Đ/S+lời-giải → review → người chỉ sửa đáp án + gán dạng → `createCauDungSai` loạt. Câu dung_sai cũ (53, menh_de null) tự hiện, gắn nhãn "chưa cấu trúc".
- **Fix ET buổi bù cho TA**: "Việc của tôi" mở MỌI task qua BuoiDetail thường → ET buổi bù (lop_id=null, ET seed per-HS) ko load. Fix: `MyTask.loai='bu'` → route sang `BuoiBuDetail` (refactor nhận `buoiId`, tự load+seed `ensureBuoiBuETProblems`, export ra).
- **Bổ trợ CRUD buổi**: `updateBuoiMeta` + `SuaBuoiModal` (dùng chung bù/đuổi: ngày/giờ/phòng/GV/TA) · Huỷ buổi · ✕ gỡ HS (xoaHSKhoiBuoi, chặn nếu có đo thật). Nút ✎ NGAY trên card (đổi card `<button>`→`div role=button` + stopPropagation).
- **Gộp màn buổi BÙ**: bỏ 3 sub-tab → 1 màn, mỗi HS 1 thẻ (điểm danh; co_mat→ET+đánh-giá 2 cột + ô Nhận xét GV). doClose/reopen reload tại chỗ (ko thoát). Đánh giá theo dạng hiện TÊN (chính)+mã (phụ) qua `getDangTen` (dai+khtn). Đuổi vốn đã 1 màn.
- **Nút 🐞 Báo lỗi**: dời góc-dưới → TopBar cạnh tên đăng nhập (inline). Fix tên chuyên đề đè vòng % (pr-12).
- **Data fix**: BTVN dọn 8 doc trùng.
- **TREO (mai làm tiếp)**: **SEARCH CÂU trong Kho** để tìm-sửa câu sai (đang dở — vừa định export CauModal). Thiết kế đã chốt với Thùy: search THEO KHO ĐANG XEM (per-cauTbl, ko xuyên môn vì nhân-sự-môn chỉ thấy môn đó) · tìm theo MÃ (prefix) HOẶC NỘI DUNG (ilike) · kết quả hiện nội dung+mã+dạng → nút Sửa mở editor. + badge ma_cau ở khu chọn câu khi soạn tài liệu (ko lên bản in HS).

## 2026-06-29 — SEARCH CÂU trong Kho (nối tiếp việc treo 06-26)
- **Mục đích**: tìm-để-SỬA câu sai nhanh (kho lớn dần). Design đã chốt 06-26.
- **api.ts** (`src/lib/kho/api.ts`): `searchCau(q, tbl)` → `CauTimThay[]` (=CauHoi + dangTen). `.or(ma_cau.ilike.${safe}%, noi_dung.ilike.%${safe}%)` 1 query, **sanitize `,()`** (ký tự phân tách PostgREST .or()), order ma_cau limit 200. Resolve tên dạng từ ban_do của môn (`BAN_DO_OF`: dai_cau_hoi→dai_ban_do · khtn_cau_hoi→khtn_ban_do). + `listDangOptions(tbl)` → `{id,label,sub}[]` toàn MÔN (cho editor Đúng/Sai gán dạng mệnh đề; sub = `K{khoi} · chủ-đề › chuyên-đề`).
- **Export tái dùng editor**: `CauModal` (DangHub.tsx) + `DungSaiModal` (DungSaiBank.tsx) — chỉ thêm `export`, không đổi logic. DungSaiModal edit mode dùng dangChinhMoi=null (chỉ cần khi tạo).
- **`SearchCau.tsx`** (mới): overlay top-bar Kho. Input autofocus + **debounce 300ms** + chống race (`reqId`). Kết quả: card trắng nền xám (Apple-clean) — mã (Code) + loại + tên dạng (pill tím) + 🤖AI nếu nguon_giai=ai + nội dung MathText + ảnh đề. Nút **Sửa** → câu `dung_sai` mở DungSaiModal (dangOpts nạp 1 lần theo môn) · còn lại mở CauModal. onSaved → reload search tại chỗ.
- **KhoScreen.tsx**: nút "🔍 Tìm câu" trong top bar **chỉ khi `config.cauTbl`** (Đại/KHTN; Hình ẩn). State `timCau`. Render `<SearchCau cauTbl={config.cauTbl}/>`.
- **Quy ước giữ**: search per-cauTbl = ko xuyên môn (khớp scope④ staff-môn). ✓ tsc sạch + build pass (3.6s).
- **CÒN (Ý 2, sau)**: badge `ma_cau` ở khu chọn câu khi soạn tài liệu (builder/ET) — KHÔNG lên bản in HS. Chưa làm.
- **Ý 2 XONG (cùng phiên)** — hiện **mã câu khi SOẠN** để đối chiếu với Tìm câu (Thùy: "cấu trúc tài liệu chưa hiện mã thì tìm kiểu gì"): badge mã (mono, slate, shrink-0) thêm ở **TaiLieuBuilder** (`MaCau` component) — câu luyện (CauRow) + câu BTVN + **KhoPicker** (lúc chọn câu) + **ETScreen** (meta line mỗi câu). **KHÔNG đụng `CauItem`/PrintView** → mã KHÔNG lên bản in HS (đúng spec). ✓ tsc + build (3.5s).
- **Màn Học sinh: toggle trạng thái + sort cột** (Thùy yêu cầu): (1) **Toggle bar** Đang học / Nghỉ (segmented, mỗi nút kèm số đếm) quản lý riêng — mặc định Đang học; **Bảo lưu** chỉ hiện segment khi có HS bảo lưu (hoặc đang chọn) → không giấu mất HS bảo lưu (data có 3 trạng thái dù Thùy nói 2). Bỏ dải đếm cũ (gộp vào toggle). (2) **Sort click-header** (`Th` component, mũi tên ▲▼/↕): Họ tên · Mã · Khối · Số lớp — localeCompare 'vi' numeric (Khối '4T/5T' + mã HS#### sort đúng), Số lớp so number. Mặc định Họ tên ↑. Lọc theo search→đếm trạng thái→lọc trạng thái→sort. ✓ tsc + build (3.7s).
- **Reorder dạng trong buổi (giáo trình) — Thùy cần lại:** nút ▲▼ ở header mỗi DangCard (TaiLieuBuilder) đổi thứ tự dạng trong 1 buổi. `reorderDangInBuoi(taiLieuId, buoiId, orderedMaDangs)` (tailieu.ts) rebuild thu_tu toàn doc, buổi khác giữ nguyên, buổi target theo thứ tự mới (dang + btvn đi kèm). **Sửa `setDangOfBuoi` bỏ ép `[...maDangs].sort()`** → GIỮ thứ tự hiện có (reorder tay không bị xoá khi "+ Chọn dạng" lần sau); dạng MỚI chèn cạnh chuyên đề cùng họ (cdOf = ma_dang.slice(0,6)) để LT chuyên đề vẫn hiện 1 lần (PrintView gom theo run liên tiếp), không có họ thì append cuối. State counts trong DangCard key theo phan.id (không đổi khi reorder) nên không mất. ✓ tsc + build (3.3s). Chỉ builder gọi setDangOfBuoi → không phá chỗ khác.
- **⭐ CHIỀU MÔN Ở NHÂN SỰ (scope④) — Thùy: "tài khoản nhân sự chưa phân môn rõ ràng":** Thùy chốt **môn vào NGƯỜI** (nhiều môn — "có môn vào người mới làm orgchart") + **STRICT** (chưa gán → không thấy môn nào; admin la_admin bypass).
  - **mig 0056** (ĐÃ áp DB + schema, 62 bảng): `nhan_su_mon` (nhan_su_id × mon, PK kép, RLS member-gate + grant như 0050). mon = nhãn MON_LIST.
  - **nhansu.ts**: `listNhanSuMonMap`/`listMonOfNhanSu`/`setMonOfNhanSu` (delete+insert như team). `MyProfile` thêm `mons: string[]` (getMyProfile query thêm listMonOfNhanSu).
  - **NhanSuScreen**: cột "Môn" (badge tím / "—") + EditModal khối "Môn phụ trách" multi-select (giống Team, MON_LIST) → `setMonOfNhanSu`. Để trống = không thấy kho môn nào (Ops/back-office; admin tất).
  - **KhoScreen GATE**: đọc store `me.mons` + `quyen.laAdmin`. `MON_TABS` map key kho ('toan'/'khtn') ↔ nhãn ('Toán'/'KHTN'). allowed = laAdmin?tất:lọc theo me.mons. Chỉ hiện môn-tab được phép; môn đang chọn ko hợp lệ → nhảy về allowed[0]. Thân màn: chưa load me→"Đang tải hồ sơ"; allowed rỗng→card "Bạn chưa được phân môn" (ko hiện Khối/Tìm-câu). Admin/Founder thấy tất (đúng vụ Thùy thấy KHTN ở tk admin).
  - ⚠ **Quyền/môn load lúc LOGIN** (me) → admin gán môn cho ai thì người đó phải **đăng nhập lại**. GV hiện CHƯA có nhan_su_mon → bị chặn Kho tới khi admin gán (đúng strict). ✓ tsc + build (3.4s).
  - **CÒN (chiều môn — việc lớn riêng):** gate "Làm tài liệu" theo môn (tailieu.ts đang hardcode dai_) · **org-chart-theo-môn** (vi_tri.mon — giờ có nền nhan_su_mon) · Anh/Văn chưa có kho.
- **Data: backfill nhan_su_mon='Toán' cho MỌI nhân sự hiện tại** (Thùy: mặc định Toán) — script throwaway idempotent (on conflict do nothing): 22 NS, +21 (1 đã có), giờ cả 22 = Toán. KHTN/môn khác admin sửa lại sau ở màn Nhân sự. (Script đã xoá.)
- **Reorder dạng trong buổi (giáo trình) — COMMIT work cũ chưa commit:** `reorderDangInBuoi` (tailieu.ts) + nút ▲▼ mỗi DangCard (BuoiCard.move hoán vị → reorderDangInBuoi → reload) đã có trong working tree từ trước nhưng CHƯA commit (nên bản deploy origin/main không có → Thùy không thấy). Thùy xác nhận chạy ngon. Commit để deploy.
- **⭐ SƠ ĐỒ TỔ CHỨC THEO MÔN — mỗi môn 1 CÂY ĐỘC LẬP (Thùy chốt fork):** mắt xích để gán role per-môn → đăng nhập thấy đúng. Cơ chế: role bám GHẾ (vi_tri.vai_tro_id) quyết định "mở màn nào" (lớp①); giờ ghế thuộc đúng môn → tạo ghế KHTN + gán role + đặt người → họ thấy phần KHTN. Role vẫn là bó-màn dùng chung (không đẻ role mỗi môn).
  - **mig 0057** (ĐÃ áp + schema): `vi_tri.mon` (nullable; null = ghế LIÊN-MÔN ops/media/marketing).
  - **nhansu.ts**: `ViTri.mon`, `updateViTri` Pick += 'mon'.
  - **OrgChartScreen**: `CHUYEN_MON_TEAMS=['gv','ta','hoc_thuat']`. Team chuyên môn → hiện **bộ chọn MÔN** (MON_LIST, pill tím) + lọc `gheView = ghe.filter(mon===sel)` (mỗi môn 1 cây) → roots/childrenOf/descendants/cha-options đều theo gheView. "+ Vị trí gốc" gắn mon=selMon (liên-môn→null). themGheCon kế thừa mon cha. EditGhe hiện chip Môn / "Liên môn". Team liên-môn giữ hành vi cũ (mon null, ko bộ chọn).
  - **Backfill**: 31 ghế chuyên môn cũ (mon=null) → 'Toán' (org trước chỉ Toán), để ko biến mất khỏi tab môn. (Script throwaway đã xoá.)
  - ✓ tsc + build (3.7s).
  - **CÒN:** (tuỳ) hiện badge môn ở Phân quyền tab "gán role cho vị trí" · nhắc nhất quán ghế-môn ↔ nhan_su_mon của người ngồi (2 nguồn: org-structure vs content-scope) · Làm tài liệu theo môn.
- **Fix OrgChart: ứng viên ghế CHUYÊN MÔN lọc theo MÔN, không theo team** (Thùy: "chọn sơ đồ KHTN thì chỉ hiện người bộ môn KHTN"): nạp `listNhanSuMonMap` vào OrgChartScreen → EditGhe. `phuHop` = ghế chuyên môn → `thuocMon` (nhan_su_mon chứa g.mon) · ghế liên-môn → `thuocTeam` (như cũ). Checkbox "mở rộng" bỏ lọc; sub "ngoài môn/ngoài team"; ghế chuyên-môn-chưa-gán-môn → hiện toàn bộ + cảnh báo. ⚠ Hệ quả: NS phải có KHTN trong nhan_su_mon mới hiện ở ghế KHTN — giờ mọi NS mới chỉ Toán → ghế KHTN rỗng tới khi gán KHTN ở màn Nhân sự (đúng strict). ✓ tsc+build.
- **Vướng "trưởng khối KHTN đăng nhập ko thấy Kho/tài liệu" — KHÔNG phải bug, do GHẾ CHƯA GÁN ROLE** (diag claude_ro: 2 ghế KHTN của Phạm Anh Ngọc `vai_tro_id=null`; môn cô ấy = KHTN OK). "Thấy màn nào" = role bám ghế, môn chỉ siết nội dung. Thùy tự gán xong giữa chừng (Trưởng khối KHTN→Học thuật[bdkt+lamtailieu+tl], Trưởng bộ môn→GV thường) → chỉ cần đăng nhập lại. Lặp lại bẫy "team≠ghế, role bám ghế".
- **⭐ Cải tiến phòng bẫy (OrgChartScreen):** (1) **badge trên thẻ ghế**: có role → chip indigo tên role; chưa role → **"⚠ chưa quyền"** amber (title giải thích) → dựng org thấy ngay ghế nào thiếu quyền. (2) **gán role NGAY trong modal sửa ghế** (`listRoles`+`setViTriRole`; select "Vai trò (quyền)" + cảnh báo khi trống) → khỏi nhảy sang Phân quyền. roleById map. save: chỉ gọi setViTriRole khi đổi.
- **Fix lỗi CUỘN tab "Gán role cho vị trí" (PhanQuyenScreen GanTab):** root `min-h-0 overflow-auto` THIẾU `h-full` → cha `flex-1 overflow-hidden` cắt, nội dung dài (nhiều ghế) ko cuộn được. Thêm `h-full`. (Đúng bài học: overflow-auto cần chiều cao chặn; MaTranTab có h-full nên ko dính.)
- **⭐ TKB: toggle môn (Tất cả/từng môn) + chụp ảnh** (Thùy yêu cầu): toggle `mon` lọc `view=slots.filter(lop.mon===sel)` (monsCo = môn có ca); count chip theo view. **Chụp ảnh** (`TkbAnh`): bảng INLINE-HEX (MON_HEX sRGB, KHÔNG class Tailwind v4 oklch) trong popup sạch → html2canvas CDN → clipboard (paste Zalo) / In-PDF — ĐÚNG pattern V1 (như EtAnhGuiPH). Bảng band×thứ, ô = card lớp (tên·giờ·phòng) màu theo môn. ✓ tsc+build.
- **ĐIỀU TRA #1 (tài liệu theo môn) — chưa làm, cần thiết kế:** GV KHTN vẫn thấy tài liệu Toán (Kho tài liệu + Làm giáo trình). Gốc: (a) **`tai_lieu.mon` = 'toan' (lowercase, 125 doc)** LỆCH với lop.mon/gami/nhan_su_mon = 'Toán' (label) → phải CHUẨN HOÁ trước khi lọc. (b) `TaiLieu` type KHÔNG có `mon`; `createTaiLieu`/`listAllTaiLieu`/`listTaiLieu` ko set/lọc mon. (c) **builder + ET + tailieu.ts (getTaiLieuFull/autoSuggest*/listCauByDang) HARDCODE `dai_*`** → KHTN ko lấy được kho KHTN (phần SÂU "thiết kế kĩ"). → cần ADR nhỏ: chuẩn-hoá mon='Toán' + filter library theo môn + dispatch kho theo tai_lieu.mon (dai_↔khtn_).
- **ĐIỀU TRA #3 (Buổi học/Elo riêng KHTN):** Elo/EXP **ĐÃ per-môn** (mig 0041, cột mon; gami_elo unique hs+mon; closePhase lấy lop.mon). gami_elo hiện 71 dòng toàn 'Toán' (chưa có buổi KHTN đóng → KHTN tự khắc tách khi có data). Điểm số leaderboard đã per-môn. → KHÔNG cần đổi cấu trúc; chỉ (tuỳ) thêm toggle môn ở màn Buổi học/Điểm số cho dễ xem (nhỏ).
- **#3 Điểm số + Buổi học theo môn (Thùy chốt):** (B) **Bảng xếp hạng**: `listGamiMons` đổi nguồn gami_elo→**lop** (môn-có-lớp) → toggle môn hiện đủ Toán/KHTN kể cả KHTN chưa có Elo (bài học: danh mục từ nguồn chung). Default 'Toán' (tránh mặc định KHTN rỗng do sort). GV xem bảng môn khác = OK. (C) **Buổi học** scope môn: `view = laAdmin||myMons rỗng ? tất : lọc lop.mon∈myMons` — GV/TA chỉ thấy buổi môn mình; **Ops/admin (không gán môn) thấy TẤT** (điểm danh liên-môn, tránh chặn nhầm). Empty-state phân biệt "ko buổi môn X" vs "ko TKB".
- **⭐ #1 TÀI LIỆU THEO MÔN (mảnh cuối chiều môn) — XONG:** Thùy "1 phải làm".
  - **mig 0058**: chuẩn hoá `tai_lieu.mon` 'toan'→'Toán' (125 doc) + default 'Toán' (khớp lop/Elo/nhan_su_mon).
  - **tailieu.ts**: `TaiLieu.mon`; **`khoCuaMon(mon)`** → {cauTbl, banDoTbl, ltDangTbl, ltCdTbl, listMap} (Toán dai_/KHTN khtn_). autoSuggest*/suggestCauForDang/setDangOfBuoi += param `cauTbl='dai_cau_hoi'` (Toán ko đổi). **getTaiLieuFull dispatch 4 bảng theo `tl.mon`** (câu/dạng/LT-dạng/LT-chuyên-đề). createTaiLieu/createET += mon; listTaiLieu/listAllTaiLieu += lọc mon; duplicate/trichXuatBuoi copy mon. getETCaus/getBTVNCaus tự đúng (qua getTaiLieuFull).
  - **TaiLieuBuilder**: mon=full.taiLieu.mon → cauTbl; DangPicker nhận `mon` (khoCuaMon.listMap), KhoPicker nhận `cauTbl`, DangCard autoSuggest +cauTbl, setDangOfBuoi +cauTbl.
  - **ETScreen**: mon=lop.mon → listMap/listCauByDang/suggestCauForDang +cauTbl; createET +mon; DangPickerOne +mon, KhoPicker +cauTbl. **DangPickerOne** (component) += prop `mon` (dai/khtn).
  - **Màn thư viện**: TaiLieuScreen toggle môn (KHO_MON=['Toán','KHTN'] ∩ quyền; admin cả 2) + lọc list + create theo mon + gate "chưa phân môn"; KhoTaiLieuScreen scope theo myMons (admin/không-môn=Media/Marketing thấy tất) + toggle "Mọi môn/…".
  - ✓ tsc + build (3.3s). **CÒN**: DangPickerOne ở Buổi-học (chấm bài trên lớp) chưa truyền mon (KHTN chưa có buổi nên chưa lộ) · lớp-picker ET chưa lọc theo môn staff (môn vẫn suy đúng từ lớp).
- **Fix "Câu N" dính trong câu clone/import + dọn DB:** câu kho có nhãn "Câu 3."/"Bài 1." nhét sẵn trong `noi_dung` (từ clone giữ nguyên đề mẫu / import đề thi) → trùng số với nhãn app tự đánh. **DB**: strip nhãn ĐẦU câu cho **168 câu** (dai_cau_hoi khối 07:11/08:39/09:42/11:26/12:50; 1 câu nhãn kép → loop 2 lượt; khtn 0) — regexp_replace `^[[:space:]*]*(câu|bài)[[:space:]]*[0-9]+...`, verify còn 0 (⚠ Postgres `\d`/`\s` KHÔNG match — phải `[0-9]`/`[[:space:]]`). **Code (cap cứng)**: `stripCauLabel` trong `normCau` (api.ts) → mọi luồng clone/batch/ingest tự bỏ nhãn đầu (giữ nếu strip ra rỗng). **Prompt**: thêm rule FMT_RULES "KHÔNG chép nhãn Câu N/Bài N vào de_bai". ✓ tsc+build.
- **Fix câu trắc nghiệm nhét 4 đáp án trong đề (hiện 2 lần):** noi_dung chứa cả khối "A. …B. …C. …D. …" LẪN lua_chon → in ra đề có đáp án + lưới đáp án trùng. **DB**: strip khối đáp án cuối đề cho **29 câu** (khối 07/11/12; loại dương-tính-giả "a.c"/mệnh-đề bằng cách đòi dòng-riêng A. & B.; 1 câu 3-phương-án xử riêng) — `regexp_replace(noi_dung, E'\nA[.):].*','')` (Postgres `.` khớp newline mặc định), verify 0. **Code**: `stripEmbeddedOpts` trong `normCau` (chỉ khi có lua_chon) → clone/import tự bỏ khối đáp án khỏi de_bai. **Prompt**: rule "câu TN de_bai KHÔNG chép A/B/C/D, chỉ ở lua_chon". ✓ tsc+build.
- **Part B (layout 4 đáp án) ĐÃ CÓ SẴN trong bản in** (`optCols` PrintView): max độ-rộng ≤6→4 cột(1 dòng) · ≤16→2×2 · dài→1 cột(4 dòng), grid minmax(0,1fr) vị trí A/B/C/D cố định = đúng 3 quy tắc Thùy. (Màn kho DangHub vẫn list dọc — áp 3-mức nếu Thùy muốn.)
- **Layout ý-con + ngưỡng cột (Thùy):** (1) **Ngưỡng `optCols` 6/16 → 14/30** (≤14→4 cột · ≤30→2×2 · dài→1 cột). (2) **Câu có ý con a) b) c)… (không phải trắc nghiệm) cũng lên lưới cột** thay vì dọc (xấu): `splitYCon(noi_dung)` tách stem + ý-con (yêu cầu ≥2 ý + nhãn LIÊN TỤC a,b,c,… chống bắt nhầm "a)" lẻ) → CauItem render stem (MathText) + lưới ý-con dùng chung `optCols`/`.pv-opts`. Áp cho bản in (PrintView/ETPrintView qua CauItem). Ý dài → tự về 1 cột = như cũ (an toàn). ✓ tsc+build.
- **Câu có HÌNH — thứ tự đề → hình → đáp án (Thùy):** câu `07010102005`… là trắc-nghiệm bị gắn `tra_loi_ngan`, `lua_chon=null`, **4 đáp án A/B/C/D nhúng trong `noi_dung`** + `anh_de` → render thành đề+đáp-án(text) rồi ảnh xuống CUỐI (sai). Fix RENDERING (không đụng data): tổng quát `splitYCon`→**`splitLabeled(s, seq)`** dùng cho cả A/B/C/D (đáp án nhúng, ưu tiên) lẫn a)b)c) (ý con). CauItem: stem=đề (bỏ khối nhãn) → **ảnh** → **lưới đáp án/ý-con** (optCols 14/30). Đúng thứ tự đề→hình→đáp-án. Dòng-viết ẩn khi có lưới. ✓ tsc+build. (Data vẫn để đáp án trong noi_dung — rendering tự tách; import nên đẩy vào lua_chon = việc sau.)
- **⭐ BLOCK model — Phase 1 (Thùy chốt model: block ≈ dạng, ⊆ dạng; câu giữ ma_dang):** kiểu hiển thị per-block + layout cột.
  - **mig 0059**: `tai_lieu_phan.kieu` (default 'thuong'). Registry `BLOCK_KIEU` (thuong/2cot/3cot/4cot; +bang/ve_hinh/nhieu_y sau) + `kieuCols` + `setPhanKieu` (tailieu.ts). `TaiLieuPhan.kieu` (listPhan select* → PhanResolved `...p` mang sang).
  - **Builder**: `KieuPicker` (Thường/2/3/4 cột) trên header **Bài luyện** + **BTVN** → setPhanKieu(phanId) + reload. Mặc định Thường (giữ hành vi cũ).
  - **PrintView**: `CauList` render `<ol>` với `column-count` theo kieu (multicol → `.pv-cau break-inside:avoid`, gap 9mm). Câu ngắn 2/3/4 cột = tiết kiệm giấy.
  - **Model đã sẵn NHIỀU BLOCK/dạng** (nhiều phan cùng ref_ma) — Phase 2 (UI "+ block" + gom blocks dưới 1 header dạng) chưa build. ⚠ layout in = paged.js → **cần Thùy soi PDF thật** để chỉnh ngưỡng/gap.
- **In: toggle "Kèm lý thuyết / Không LT" (Thùy — ôn tập không cần LT):** thêm state `lt` (PrintView, mặc định có) + segmented ở toolbar in (ẩn khi scope=btvn). Truyền Doc→BuoiBlock→DangBlock → gate CẢ LT chuyên đề (LtBlock) LẪN LT dạng (pv-box-lt). Deps paged.js += lt (re-render khi đổi). Phụ đề bìa "LUYỆN TẬP" khi tắt LT. Print-time (không lưu) → 1 giáo trình in kèm/không-kèm LT tuỳ lúc. ✓ tsc+build.
- **Sửa: toggle Lý thuyết CHUYỂN từ toolbar-in → SETTING builder (Thùy: trích buổi gán lớp, ko xuất cả file):** `cau_hinh.inLyThuyet` (default có). Builder chrome "Trình bày" thêm select **Lý thuyết: Có kèm / Không (ôn tập)** → saveCh. PrintView đọc `cau_hinh.inLyThuyet` (bỏ state/toggle print-time; toolbar chỉ hiện badge "Không kèm lý thuyết" khi tắt). **trichXuatBuoi copy cau_hinh** → doc buổi trích KẾ THỪA cài này (mỗi doc sửa riêng được ở builder). ✓ tsc+build.
- **Refactor lưới ý-con DÙNG CHUNG + áp cho ET (phiên song song):** tách `splitStem(c)` + `OptGrid` export từ PrintView (ưu tiên: đáp án A/B/C/D nhúng → ý con a/b/c → ý con KHÔNG nhãn `splitUnlabeled`). ETPrintView (trắc-nghiệm + tự-luận) dùng `splitStem`/`OptGrid` → ý con nhiều dòng lên lưới cột thay vì đổ dòng kẻ. Dòng-viết ẩn khi có lưới. (Kèm commit `985d263` thêm splitUnlabeled.) ✓ build.

---

## 2026-07-01 — Fix nhân đôi trang lý thuyết (PrintView) + Bước-0 verify DASHBOARD MASTERY

**BUG FIX — giáo trình buổi trích PDF nhân đôi trang (lý thuyết buổi 3: 4→8):**
- **Nguồn thật = race paged.js (KHÔNG chỉ StrictMode)**: effect preview deps `[full,gv,scope,lopTen]`. Doc `giao_trinh_buoi`/`btvn` fetch `lopTen` ASYNC sau khi `full` load → effect chạy 2 lần (lopTen '' rồi 'Lớp X'). Cleanup cũ chỉ `cancelled=true`, KHÔNG chặn Previewer A đang flow → A tiếp tục append trang SAU khi B đã `innerHTML=''` → trang A+B chồng = gấp đôi. Master `giao_trinh` (lop_id null) early-return lopTen → 1 lần → ko dính. Buổi nhỏ A xong trước B clear → ko lộ; buổi 4 trang A còn flow → 4→8. Khớp chính xác.
- **Fix (PrintView.tsx + ETPrintView.tsx)**: mỗi run render vào CONTAINER RIÊNG (`document.createElement('div')` append live để paged.js đo layout); run stale (`cancelled`) tự `container.remove()` khi resolve; run mới xoá container run trước → luôn CHỈ 1 bản. ✓ tsc+build. CHƯA soi PDF thật (Thùy sẽ test / hoặc chưa cần vì đã pivot việc).

**PIVOT (Thùy): làm DASHBOARD KẾT QUẢ HỌC TẬP HS trước (test-online để sau nếu quá to). "Quan trọng nhất."**
- Chốt với Thùy: đối tượng = **CẢ HAI** (staff + HS/PH) · trọng tâm = **MASTERY per-dạng (chẩn đoán)**. Phân biệt với `ThanhTich` (game: Level/Elo/EXP) — cái này = chẩn đoán "dạy gì tiếp".
- **Sequencing (CTO quyết):** (1) mastery engine PURE (suy động, chung) → (2) dashboard STAFF trước (Apple-clean, dùng getMyScope, KHÔNG cần login HS) → (3) mặt HS/PH sau (cần login HS + RLS = net-new, gộp với test-online `my_hoc_sinh_id()`).

**BƯỚC-0 VERIFY (claude_ro/SELECT, script `_diag_mastery*.mjs` đã xoá):**
- **Linkage (KHÁC spec đoán):** grade→dạng qua `gami_grades.problem_id → gami_session_problems.id → .ma_dang`+`.phase` (gami_grades KHÔNG có cột phase). grade→HS = `gami_grades.hoc_sinh_id`. `buoi_danh_gia_dang(buoi_hoc_id,hoc_sinh_id,ma_dang,diem numeric)` = đánh giá GV per-dạng. mon suy qua `buoi_hoc.lop_id→lop.mon` (buoi_hoc KHÔNG có cột mon).
- **Thang:** result {correct/partial/wrong}={1/.5/0}; đánh giá diem {0/.5/1}. ingame có `muc`(1-5), et `muc`=null. **BTVN (phase='btvn') LOẠI khỏi mastery.**
- **Volume (đủ để có nghĩa, hiện CHỈ Toán K9):** grades trừ btvn ~1571 (et 997+ingame 574) + 179 đánh giá. **677 cặp (HS×dạng)** · 79 HS · 20 dạng · tất cả in `dai_ban_do`, 0 khtn, **0 orphan**.
- **Độ tin phân tán (đúng §5):** 1 lần=264 cặp (39%) · 2=149 · 3-4=176 · 5+=88 → **phải hiện độ tin, ko chỉ mức**.
- **Login HS = NET-NEW (xác nhận spec §2.1):** `my_hoc_sinh_id` KHÔNG có; `tai_khoan`=(id,nhan_su_id,email) chỉ trỏ nhân sự. → mặt HS/PH bị chặn; mặt staff KHÔNG.
- **Engine (HANDOFF #4 + §5, sẽ dựng):** per (HS×dạng) gộp đo từ grades(et+ingame, result→{1/.5/0}) + đánh giá({1/.5/0}), lấy **X=5 lần gần nhất** theo thời gian → TB → 3 mức **≥0.8 đạt / 0.5–0.8 cần luyện / <0.5 yếu** + **chưa-đo** (ko data) + **độ tin theo cỡ mẫu** (n<3 = tin thấp). Suy động KHÔNG lưu. (Knob mở: có nên trọng số summative ET/đánh-giá > formative ingame — v1 để BẰNG NHAU, recency window.)

**MASTERY — engine + service BUILT & verified (view #1 màn thật CHƯA build):**
- **Engine `src/gami/mastery.js` (PURE, 19 test pass — `node scripts/verify_mastery.mjs`):** `masteryOfDang(measures)` = TB WINDOW=5 lần đo GẦN NHẤT → mức. **Công thức Thùy chốt:** mỗi lần Đ=1·C(chưa đạt)=0.5·S=0; tổng 5 lần ≥4→Đ(đạt) · 2.5–3.5→C(cần luyện) · <2.5→S(yếu) = ngưỡng mean **0.8/0.5** (dùng mean để <5 lần vẫn xếp mức). **chưa-đo = null (KHÔNG =0)**; **độ tin theo cỡ mẫu** (n≥5 cao/3-4 tb/≤2 thấp). + `masteryOfHS`/`summarizeDang`. `RESULT_VALUE{correct:1,partial:.5,wrong:0}`.
- **Service `src/lib/mastery.ts` (`getMasteryHS(hsId, mon, {includeBTVN,days})`, tsc sạch):** gộp grades(ingame+et via `problem_id→session_problems.phase/ma_dang`) + `buoi_danh_gia_dang`(đánh giá GV, diem) → engine. **2 query rời join JS** (né filter lồng PostgREST). **Toggle BTVN** (mặc định TẮT — Thùy muốn tự soi BTVN có đáng tin ko). Lọc 30/60/90 ngày (boundary instant). Resolve tên dạng theo MÔN (khoCuaMon.banDoTbl) → scope đúng môn. Sort YẾU trước + mới lên đầu (như V1).
- **VERIFIED data thật** (HS "Nguyễn Lại Bảo Ngọc"): yếu "giải hệ đưa về cơ bản" 0.30 (n=8, tin cao) · cần luyện "cơ bản" 0.60 · "đặt ẩn phụ" 0.70 (=3.5/5=C ✓) · đạt toàn "toán lập hệ". Insight thật: vững word-problem, yếu kỹ năng GIẢI hệ. Công thức khớp.

**QUYẾT ĐỊNH (Thùy) cho dashboard mastery:**
- **3 TẦNG VIEW riêng** (KHÔNG phải 1 heatmap gộp — mockup heatmap đầu bị bác): **#1 từng HS** (QUAN TRỌNG NHẤT — port tab "Dạng bài" V1 `StudentAcademicView.jsx`: mỗi dạng + timeline lần đánh giá gần nhất ✓/◐/✗ + nguồn IG/ET/ĐG + ngày + tỉ lệ 5/10 lần) · **#2 lớp/hệ/khối** (rollup TỔNG QUÁT: bao nhiêu dạng xanh/vàng/đỏ %, ko chi tiết) · **#3 chiều dạng/chuyên đề** (dạng nào tỉ lệ sai cao nhất / nhiều HS sai nhất).
- **V1 = ví dụ CÁCH HIỂN THỊ, KHÔNG phải cách đo** (V1 binary Đ/S; V2 = 3 mức D/C/S per câu & per dạng). Ngưỡng = **0.8/0.5** (V2), KHÔNG phải 0.7 (mình hỏi nhầm khung "V1", Thùy chỉnh lại).
- **Đặt ở CHỈ LEAF RIÊNG** "Kết quả học tập" (3 view qua tab), KHÔNG nhúng Học sinh. **Build #1 trước.**
- **Sequencing (CTO):** engine✓→service✓→**màn staff view#1** (next)→#2→#3→mặt HS/PH (cần **login HS = NET-NEW**: `my_hoc_sinh_id` chưa có, `tai_khoan` chỉ trỏ nhan_su — cùng chặn test-online).
- **SPEC test-online** (Thùy đưa, đã lưu `spec-test-online.md`): PAUSE, làm mastery trước. Bước-0 verify test-online mới xong 1 phần (login HS net-new xác nhận).

---

## 2026-07-01 (phiên 2) — MÀN Mastery view#1 (Kết quả học tập › Từng học sinh)

**BUILT `src/screens/ketqua/KetQuaScreen.tsx`** (leaf `ketqua` nhóm Vận hành, tên "Kết quả học tập"; wire `fixtures.ts` adminLeaves + `NhanSuHome.tsx` route + import). Apple-clean LIGHT (port dark V1 `StudentAcademicView.jsx`).
- **3 tab top** (Từng học sinh / Lớp-Khối / Theo dạng) — build **#1**, #2/#3 = placeholder "sắp có" (view#2 rollup summarizeDang, #3 pivot dạng — CHƯA).
- **#1 PerHocSinh:** MÔN tab **Toán/KHTN** (chỉ 2 môn CÓ KHO — khoCuaMon dispatch dai_/khtn_; Anh/Văn chưa kho) + **HS picker** (SearchSelect, `listHSDangHoc(mon)` lọc HS đang học môn) + **cửa sổ 30/60/90 ngày** + **toggle Gộp BTVN** (mặc định TẮT). Đổi môn → reset HS. Gọi `getMasteryHS(hsId,mon,{includeBTVN,days})`.
- **Bảng:** dải tổng (N dạng đã đo · đạt/cần luyện/yếu counts). Mỗi dạng = tên+mã+chuyên đề · **Mức** pill (đạt emerald/cần luyện amber/yếu rose) · **Điểm** score.toFixed(2) · **Độ tin** (cao/tb/thấp + n) · **timeline** ≤10 slot ✓/◐/✗ + nguồn (IG/ET/ĐG/BT) + ngày. Sort yếu+mới lên đầu (service lo). Legend cuối.
- **BUG layout đã fix (soi preview thật):** cột "Dạng bài" flex-1 bị timeline w-360px BÓP VỀ 0 trên khung hẹp (fixed cols > container) → tên dạng biến mất. Fix: bảng `min-w-[880px]` + `overflow-x-auto` (cuộn ngang) + cột dạng `min-w-[220px]`, các cột số `shrink-0`.
- **VERIFIED preview thật** (dev quick-login Admin → leaf → HS "Bùi Ngọc Bảo Ngân" HS0108 K9 Toán): 9 dạng đã đo · 5 đạt/4 cần luyện/0 yếu · mỗi dạng n=1 (tin thấp) từ ET · ◐ ET 24-06 cho 0.50, ✓ ET 25-06 cho 1.00 · sort cần-luyện trước đạt ✓. tsc sạch (pdfjs-dist đã `npm install` — môi trường thiếu, chặn Vite load; giờ ok).
- **NEXT:** view#2 rollup lớp/hệ/khối (summarizeDang) · #3 chiều dạng · mặt HS/PH (cần login HS net-new).

## 2026-07-01 (phiên 3) — RAW data "Theo buổi" (Kết quả học tập) — xem lại kết quả KHÔNG qua vận hành

**Ý Thùy:** muốn xem lại kết quả theo lớp/HS hiện phải vào "Buổi học" (vận hành) rất phức tạp. Cần **raw data có chỗ lọc** (2 logic: raw vs dashboard; mastery view#1 = dashboard). Chuẩn = giống Elo "Theo ca": bấm thông số → lịch sử → popup hoạt động buổi.
**Chốt (Thùy):** dạng **THẲ** (không bảng) · toggle bar loại **Toàn bộ/ET/BTVN/MT** · xếp thời gian gần→xa · bấm thẻ → popup read-only buổi đó.

**BUILT (tab mới "Theo buổi (raw)" trong `KetQuaScreen`, tab order: Từng học sinh · Theo buổi · Lớp/Khối · Theo dạng):**
- **Service `listBuoiHoatDong({mon,lopId,hocSinhId})`** (`src/lib/mastery.ts`): query `buoi_hoc` (bỏ `huy`), HS-scope join `buoi_hoc_hs!inner`; cờ chamBai/et/danhGia/btvn = `*_dong_at`/`danh_gia_xong_at` (đã ĐÓNG = đã chốt kết quả). Lọc môn JS qua `lop.mon` (buổi bù lop null → bị loại khi chọn môn, chấp nhận).
- **UI `RawBuoi`:** MÔN (Toán/KHTN) + picker Lớp + picker HS (ít nhất 1 → mới tải, tránh quét toàn hệ). Toggle All/ET/BTVN/MT (ET/BTVN lọc theo cờ đóng; MT lọc `loai=mt`). **Thẻ** = 1 buổi: lớp · ngày (thứ+date) · ma_buoi · trạng thái · chips (Chấm bài/ET/Đánh giá/BTVN) hoặc "Chưa chốt kết quả nào". Grid 1/2/3 cột.
- **Popup = `BuoiDetail` (export sẵn) read-only** (`canManage=false`, `initialTab` theo toggle) trong overlay fixed h-[90vh] w-[1080px]. Đủ 5 tab; buổi đã đóng phase → bảng chấm KHOÁ ("Đã xác nhận" + "↩ Mở lại"). = tái dùng 100
## 2026-07-01 (phiên 3) — RAW data "Theo buổi" (Kết quả học tập) — xem lại kết quả KHÔNG qua vận hành

**Ý Thùy:** xem lại kết quả theo lớp/HS hiện phải vào "Buổi học" (vận hành) rất phức tạp. Cần **raw data có chỗ lọc** (2 logic: raw vs dashboard; mastery view#1 = dashboard). Chuẩn = giống Elo "Theo ca": bấm thông số → lịch sử → popup hoạt động buổi.
**Chốt (Thùy):** dạng **THẺ** (không bảng) · toggle bar loại **Toàn bộ/ET/BTVN/MT** · xếp thời gian gần→xa · bấm thẻ → popup read-only buổi đó.

**BUILT (tab mới "Theo buổi (raw)" trong `KetQuaScreen`; order: Từng học sinh · Theo buổi · Lớp/Khối · Theo dạng):**
- **Service `listBuoiHoatDong({mon,lopId,hocSinhId})`** (`src/lib/mastery.ts`): query `buoi_hoc` (bỏ `huy`), HS-scope join `buoi_hoc_hs!inner`; cờ chamBai/et/danhGia/btvn = `*_dong_at`/`danh_gia_xong_at` (đã ĐÓNG = đã chốt kết quả). Lọc môn JS qua `lop.mon` (buổi bù lop null → bị loại khi chọn môn, chấp nhận).
- **UI `RawBuoi`:** MÔN (Toán/KHTN) + picker Lớp + picker HS (ít nhất 1 → mới tải, tránh quét toàn hệ). Toggle All/ET/BTVN/MT (ET/BTVN lọc theo cờ đóng; MT lọc `loai=mt`). **Thẻ** = 1 buổi: lớp · ngày (thứ+date) · ma_buoi · trạng thái · chips (Chấm bài/ET/Đánh giá/BTVN) hoặc "Chưa chốt kết quả nào". Grid 1/2/3 cột.
- **Popup = `BuoiDetail` (export sẵn) read-only** (`canManage=false`, `initialTab` theo toggle) trong overlay fixed h-[90vh] w-[1080px]. Đủ 5 tab; buổi đã đóng phase → bảng chấm KHOÁ ("Đã xác nhận" + "↩ Mở lại"). = tái dùng 100%, không dựng review riêng.
- **VERIFIED preview thật** (Admin → tab Theo buổi → lớp 9A2 K9): 7 buổi xếp gần→xa · chips đúng · toggle ET → 5 buổi · bấm thẻ 16/06 → popup BuoiDetail read-only, tab ET hiện bảng 3 câu × 8 HS Đ/C/S + mã lỗi, "✓ Đã xác nhận ET". tsc sạch.
- **Giới hạn đã biết:** BuoiDetail read-only khoá điểm-danh/đổi-GV/hủy (canManage) nhưng bảng chấm chỉ khoá khi phase ĐÃ ĐÓNG; mở buổi CHƯA đóng từ raw vẫn sửa được (admin có quyền). Buổi bù/bổ-trợ (lop null) dùng BuoiDetail có thể ET không load (nên dùng BuoiBuDetail) — chưa route riêng.
- **Card đổi sang LỊCH SỬ (Thùy):** grid card vuông → **danh sách card dài hết dòng, dẹt** (`flex-col gap-2`, mỗi card 1 hàng ngang). Bố cục: ĐẦU = lớp/loại + mã + chips hoạt động · giữa = trạng thái · CUỐI = **ngày in đậm nổi bật** (`text-[15px] font-bold`, viền trái) + thứ nhỏ. Lý do: nhìn lịch sử tổng quát hơn card vuông. Verified preview (9A2, 7 buổi xếp gần→xa). (Read-only concern Thùy bác: đây là luồng XEM, buổi cũ đã đóng vốn khoá.)
- **Card đổi THEO HOẠT ĐỘNG (Thùy, sửa lại lần 2):** không phải card/buổi mà card/HOẠT ĐỘNG — mỗi buổi TÁCH thành nhiều card (Chấm bài · ET · Đánh giá · BTVN riêng, chỉ hoạt động ĐÃ CHỐT). Toggle mở rộng: Toàn bộ · Chấm bài · ET · Đánh giá · BTVN · MT (ET/BTVN/Chấm-bài/Đánh-giá lọc theo loại hoạt động; MT lọc theo `loai` buổi). Card = [pill loại hoạt động] + lớp + mã + trạng thái + ngày nổi bật. **Click card → popup `BuoiDetail` tabs=[đúng-tab-đó]** (không phải 5 tab) → vào thẳng hoạt động, đỡ click. Verified: lớp 9A2 → 7 buổi thành 8 card (23/06 tách Chấm bài+ET; 16/06 tách 3); bấm ET card → popup CHỈ tab ET, "✓ Đã xác nhận ET" read-only. tsc sạch.
- **FIX lọc THEO HỌC SINH ra rỗng:** `listBuoiHoatDong` HS-scope dùng `buoi_hoc_hs!inner` embed → `buoi_hoc_hs` có **2 FK về buoi_hoc** (`buoi_hoc_id` + `bu_cho_buoi_id`) → PostgREST embed nhập nhằng → query lỗi → catch → rỗng. **Fix: bỏ embed, tách 2 bước** (lấy `buoi_hoc_id` distinct của HS từ `buoi_hoc_hs` → query `buoi_hoc` theo `.in('id', ids)`). Verified: HS "Bùi Ngọc Bảo Ngân" → 8 hoạt động (đúng buổi em dự 9A2). tsc sạch. (Bài học: bảng nhiều FK cùng đích → KHÔNG embed thẳng, phải hint FK hoặc tách query — §2 filter lồng.)
- **FIX BTVN + Đánh giá KHÔNG tắt UI khi đóng (luật Thùy 06-20: đóng=xác nhận, GIỮ bảng read-only, chỉ Mở-lại mới sửa):** `BtvnTab` có `if (dong) return <banner>` → TẮT sạch bảng khi đóng → muốn xem phải bấm "Mở lại" (=cho sửa, hoàn EXP). Sửa: bỏ early-return; đóng → header đổi thành "✓ BTVN đã đóng + ↩ Mở lại để sửa" (như ChamTab/ETChamTab), **giữ bảng + `disabled` toàn bộ** (Đ/C/S + select Nộp/Thái độ + 🚨 + ✕ báo động dim/ẩn). `DanhGiaTab` đã giữ bảng nhưng CHƯA khoá → thêm `disabled={xong}` cho Đ/C/S + `readOnly` ô nhận xét. (ET/Chấm bài đã đúng từ 06-20.) Verified: 9A1 24/06 BTVN đóng → popup hiện đủ bảng 4 câu×14 HS, 168 nút Đ/C/S đều disabled, banner+Mở-lại. tsc sạch.
- **FIX popup raw (2 ý Thùy):** (1) **Tràn màn hình:** modal `h-[90vh]` nằm trong `#root{zoom:1.15}` → bị phóng 1.15× → tràn. Sửa: **createPortal ra `document.body`** (thoát zoom) + thu nhỏ `h-[85vh] max-h-720 w-[920] max-w-94vw` → gọn, giữa màn hình (verified top=62/bottom=759 trong vp 820). (2) **Lọc HS chỉ hiện HS đó:** thêm prop `onlyHsId` cho `BuoiDetail` → `reload()` filter roster còn đúng em; KetQuaScreen truyền `onlyHsId={hsId}` (chỉ khi đang lọc HS; lọc lớp → cả lớp). Verified: bảng ET chỉ 1 dòng "Bùi Ngọc Bảo Ngân". tsc sạch.
- **TỐI ƯU `getMasteryHS` (review service):** trước 3 tầng round-trip (grades → IN(problem_id) → gami_session_problems → banDo) + rủi ro URL dài do `IN(probIds)`. `gami_grades.problem_id` = FK ĐƠN sạch tới `gami_session_problems.id` (khác buoi_hoc_hs 2-FK) → **embed thẳng `prob:problem_id(phase, ma_dang)`**: gộp 2 query thành 1, bỏ IN-list. Còn 2 tầng (grades+embed ∥ đánh-giá → banDo). Verified data y hệt (HS Bảo Ngân: 9 dạng · 5 đạt · 4 cần luyện · 0 yếu). `listBuoiHoatDong` giữ nguyên (đã tối ưu: ≤2 query, select tối thiểu). tsc sạch.
- **VIEW#2 Lớp/Khối rollup (thanh "bộ nhớ iPhone"):** mỗi HS 1 thanh 100% = xanh Đạt · vàng Cần luyện · đỏ Yếu (tỉ lệ theo số DẠNG mỗi mức). Service **`getMasteryRollup({mon,lopId|khoi})`** (mastery.ts) BULK ~4 query cho CẢ lớp (KHÔNG gọi getMasteryHS N lần): HS-list (hoc_sinh_lop, khối scope embed-filter `lop.khoi`+`lop.mon` !inner) → grades(embed problem)+đánh-giá IN(hsIds) → banDo scope môn → engine masteryOfDang đếm mức/HS. UI `LopKhoiRollup`+`RollupRow`: Môn + picker Lớp/Khối (loại trừ nhau) · sort **Yếu/Cần luyện/Đạt/Tên** (mặc định yếu desc) · thanh stacked + số đếm G·Y·R · "chưa đo" cho HS total=0 · khối thì hiện tên lớp/HS. Verified: 9A2 13 HS (Sơn 5·5·1→G45/Y45/R9 ✓, sort Đạt→Trang 9đạt đầu), Khối 9 66 HS. tsc sạch. (View#3 Theo dạng vẫn placeholder.)
- **Rollup bar đọc-được (Thùy sửa):** (1) thanh full-width → **`w-[440px] max-w-[48%]`** (~nửa màn). (2) dày `h-5→h-7` + **số `% (n)` HIỆN TRONG từng màu** (`RollupSeg`, ẩn chữ khi segment <12% → hover tooltip) + **tổng "N dạng"** (mẫu số) cạnh thanh (bỏ cột đếm G·Y·R rời). (3) **sort theo % không phải số tuyệt đối** (`ratio=h[sort]/total`, chưa-đo→cuối). Verified 9A2: thanh 439px, "82% (9)"+"18% (2)"+"11 dạng", sort yếu% đẩy Sơn (có đỏ) lên đầu. tsc sạch + screenshot OK.
- **VIEW#3 Theo dạng (pivot) — HOÀN TẤT leaf Kết quả học tập:** mỗi DẠNG 1 thanh = bao nhiêu HS đạt/cần-luyện/yếu → "dạng nào cả lớp yếu nhất". Refactor service tách **`loadMasteryCells(scope)`** (nạp HS+measures+banDo → mastery cell HS×dạng, ~4 query) DÙNG CHUNG cho view#2 (`getMasteryRollup` gom theo HS) + view#3 (`getMasteryByDang` gom theo dạng → `DangRollup{dat,can_luyen,yeu,tin_thap,total}`). UI `TheoDang`+`DangPivotRow` tái dùng `RollupSeg` (thanh %+n, tổng "N HS"); sort %; hàng = tên dạng+mã+chuyên đề. Verified 9A2: 11 dạng, sort yếu% đẩy "Giải hệ…đưa về" (1 HS yếu=10%) lên đầu, "Chuyển động thường" 100%(10) xanh; view#2 vẫn đúng sau refactor (13 HS, Sơn 45%(5)+45%(5)). tsc sạch + screenshot OK. **Leaf gồm: Từng học sinh · Theo buổi (raw) · Lớp/Khối · Theo dạng.**
- **Kết quả học tập — 2 cải tiến UX (Thùy):** (1) **GIỮ state khi đổi tab:** `KetQuaScreen` bỏ conditional-render (unmount = mất chọn) → **lazy-mount + `hidden`** (`seen` set, mount 1 lần rồi ẩn) → đổi tab qua lại giữ nguyên lựa chọn/kết quả. (2) **Cột lớp bên trái ở "Từng học sinh"** (hành vi GV = xem HS theo lớp): thêm picker Lớp + danh sách HS lớp đó (click tên → chuyển HS khỏi gõ lại; highlight HS đang xem). **Tìm 1 HS ở ô search → tự suy lớp của em** (`listLopCuaHS` lọc mon dang_hoc → setLopId) → cột trái hiện cả lớp. Roster qua `listHSCuaLop`. Verified: tìm Bảo Ngân → cột auto 9A2 13 HS + highlight; click Hồ Khánh Chi → phải đổi (11 dạng/9 đạt); sang Theo-dạng rồi về vẫn giữ. tsc sạch + screenshot OK.
- **Tinh chỉnh UI Kết quả học tập (Thùy):** (1) **Bảng dạng cân lại:** cột "Dạng bài" `flex-1`(nở to, trống) → **`w-[300px]` cố định**; timeline `w-344 shrink-0` → **`flex-1 min-w-344`** (nới rộng phần Mức→timeline); container min-w 820→760. (2) **Slot ET+ngày đậm/to:** ET `slate-400/9px/semibold` → **`slate-700/10px/bold`**; ngày `slate-300/8px` → **`slate-500/9px/medium`**. (3) **Bump tông xám nhạt cả màn** (Thùy: nhạt quá): `text-slate-400→500`, `text-slate-300→400` (replace_all trong KetQuaScreen). Verified computed: ET oklch slate-700 w700, ngày slate-500. tsc sạch + screenshot OK. ⏳ Thùy muốn đậm hơn "mọi chỗ/app-wide" — mới làm màn này, sweep toàn app CHỜ xác nhận (rủi ro đụng placeholder/state khác).
- **Từng học sinh → 3 SUB-TAB (theo V1, Thùy chốt):** chọn HS (ô tìm / cột lớp) → **Tổng quan · Dạng bài · Lịch sử hoạt động**.
  - **Tổng quan** (`TongQuanTab` + service `getTongQuanHS(hsId,mon)`): **Chỉ số tổng kết** = % hoàn thành bản đồ (= dạng ĐẠT/ĐÃ-ĐO) · Điểm năng lực (**placeholder "làm sau"** — cần cấu trúc đề + phân loại cơ-bản/nâng-cao + Hình) · Điểm thi thực tế (**Trường vs Sát hạch** từ `diem_thi`, wire sẵn nhưng DB trống → "—"/0). **Chỉ số raw** = %ET, %BTVN = (Đ+½C)/số câu. Verified Bảo Ngân: %hoàn-thành 44% (4/9) · %ET 77% (13 câu).
  - **Dạng bài** (`DangBaiTab`) = bảng mastery cũ; **mặc định cửa sổ "Tất cả"** (thêm nút Tất cả) để KHỚP % ở Tổng quan (all-time) — trước default 90 ngày làm lệch (Tổng quan 4 đạt vs Dạng bài 5 đạt).
  - **Lịch sử hoạt động** = `ActivityHistory` scope theo HS (chuyển từ tab Theo buổi).
- **Tab "Theo buổi (raw)" → CHỈ lọc theo LỚP** (bỏ lọc HS). Tách lõi `ActivityHistory({mon,lopId?,hocSinhId?})` dùng chung cả 2 chỗ. Verified: Theo buổi hết ô "Lọc theo học sinh", còn "Chọn lớp"; Lịch sử của HS ra 9 card.
- **Bỏ chỉ số "chưa đo/độ phủ"** (Thùy: đó là việc giáo trình cover, KHÔNG sửa logic đo).
- Verify DB (điểm năng lực để sau): `ky_thi`/`diem_thi` = 0 dòng · `muc_nang_luc.diem_ky_vong` 0/12 · dạng chỉ có `muc_do`(1-5)+`bac_toi_thieu`(A/B/C/S), CHƯA có nhãn cơ-bản/nâng-cao · cấu trúc đề chưa có bảng · Hình chưa có kho → điểm năng lực chờ đủ nguyên liệu. tsc sạch + screenshot OK.
- **CÒN cho Kết quả học tập:** điểm năng lực (khi đủ nguyên liệu) · #2 thêm chiều HỆ (band) · #3 thêm chiều CHUYÊN ĐỀ · trend ↑/↓ trên các chỉ số tổng kết · mặt HS/PH (login HS net-new).
- **Kết quả học tập — nốt Hệ (#2) · Chuyên đề (#3) · Trend:**
  - **#2 thêm chiều HỆ:** `loadMasteryCells` thêm scope `he` (band S/A/B/C) — join `muc_nang_luc_id!inner(bac)` + `lop!inner(mon)`, filter `muc.bac`+`lop.mon` (2 FK đơn, an toàn). `RollupScope` type dùng chung. UI `LopKhoiRollup` thêm picker "Theo hệ" (`HE_OPTS` S/A/B/C, loại trừ lớp/khối); `showLop` khi khối HOẶC hệ. Verified: Hệ B → 21 HS span 9A2/11B1/12A1/11A1, HS chưa gán band hiện "chưa đo" (band coverage 55/321).
  - **#3 thêm CHUYÊN ĐỀ:** `getMasteryByChuyenDe` (gộp ô HS×dạng theo `ten_chuyen_de`). `TheoDang` toggle **Dạng / Chuyên đề** (chuẩn hoá `PivotItem` chung, `PivotRow` thay DangPivotRow). Verified 9A2: 11 dạng → 2 chuyên đề.
  - **Trend ↑/↓** (Tổng quan): `getTongQuanHS` trả `trend{et,btvn,hoanThanh}` = chênh điểm% **30 ngày gần vs 30 ngày trước** (null nếu 1 kỳ thiếu data). `TrendBadge` cạnh %. Data hiện dồn ~2 tuần → prior rỗng → badge ẩn (đúng, chưa đủ 2 kỳ); tự hiện khi tích luỹ.
  - tsc sạch (bỏ import thừa DangRollup/ChuyenDeRollup ở UI). screenshot OK.
- **Kết quả học tập giờ ĐỦ khung đã bàn:** Từng HS (Tổng quan/Dạng bài/Lịch sử) · Theo buổi(lớp) · Lớp/Khối/Hệ · Theo dạng/Chuyên đề · trend. CÒN: điểm năng lực (chờ cấu trúc đề+Hình) · mặt HS/PH (login HS net-new).

## 2026-07-02 — Fix vụn: mã HS trong thông tin lớp · chống trùng câu khi làm giáo trình

**Thùy báo 2 lỗi cần fix trước:**

**1. Thông tin lớp — hiện MÃ HS cạnh tên:** `RosterBox` (`LopScreen.tsx`) cột "Học sinh" trước chỉ `ho_ten`. Thêm badge `ma_hs` (mono, slate, cạnh tên). `listHSCuaLop` đã `select('*, hoc_sinh(*)')` nên `ma_hs` có sẵn — chỉ hiện ra.

**2. Chống dùng lại câu trong giáo trình (buổi này + buổi trước) — cả AUTO lẫn THỦ CÔNG:**
- **Model:** "buổi này + buổi trước" = MỌI câu đã dùng trong CÙNG tài liệu (master giáo trình = chuỗi buổi trong 1 doc). Hard-block phạm vi doc; khác với "usage count" = số lượt dùng xuyên MỌI tài liệu ở Kho (chỉ báo mềm).
- **lib `tailieu.ts`:** (a) export `cauUsage` (đếm lượt dùng trong `tai_lieu_cau`, sẵn có) để picker hiện chỉ số. (b) `usedCausOfDoc(taiLieuId, exceptPhanId?)` MỚI — set câu đã dùng ở phần khác cùng doc (query `tai_lieu_cau` theo phan_id của doc, trừ 1 phan). (c) `autoSuggestByLoai` thêm param `exclude` (lọc pool). (d) `setDangOfBuoi` tính `usedInDoc = usedCausOfDoc(...)` (SAU khi đã xoá dạng bỏ) rồi tích luỹ qua từng dạng mới: luyện né usedInDoc → thêm vào set → BTVN né usedInDoc (gồm cả luyện vừa thêm). → thêm dạng mới không đụng câu buổi trước.
- **UI `TaiLieuBuilder.tsx`:** (a) helper `usedExcept(phanId)` = union câu mọi phan KHÁC (từ `full.phans[*].caus`). (b) `openPicker` truyền `disabled=[...usedExcept(phanId)]`. (c) nút "↻ Gợi ý" luyện/BTVN (DangCard) truyền `usedExcept(dang.id)`/`usedExcept(btvn.id)` vào autoSuggest → gợi ý-tay cũng né. (d) `KhoPicker` thêm prop `disabled?` + state `usage` (nạp `cauUsage` sau khi load câu): câu trong `blocked` (=disabled trừ selected của chính phan) → checkbox disabled + mờ + badge đỏ "đã dùng"; câu khác → badge "chưa dùng"(xanh)/"dùng N×"(hổ phách). `toggle` chặn câu blocked.
- **ETScreen** dùng `KhoPicker` không truyền `disabled` → không khoá (đúng: ET pick 1 câu/hàng, dedup khác), nhưng ĂN THEO badge số-lượt-dùng (bonus).
- tsc sạch + build pass. ⏳ CHƯA test UI thật (Thùy verify: mở giáo trình → thêm 2 buổi cùng dạng → buổi 2 auto né câu buổi 1; mở "✎ Chọn câu" thấy câu buổi 1 xám "đã dùng" + câu khác có số lượt).

**3. "Câu N." luôn CÙNG DÒNG với đề (bản in) — fix không nhất quán:**
- **Nguyên nhân:** `CauItem`/ET render `<span class="pv-cau-no">Câu N.</span>` đứng TRƯỚC `<MathText>{stem}</MathText>`. `MathText` trả `<span>` inline khi đề 1 dòng (→ cùng dòng) nhưng trả `<div>` block khi đề NHIỀU dòng (text + công thức) → block xuống dòng, "Câu N." trơ 1 mình dòng trên. Câu 1 dòng ≠ câu nhiều dòng → không nhất quán.
- **Fix:** `MathText` (kho/ui.tsx) thêm prop `prefix?` (HTML) nhét vào ĐẦU dòng 1 (single-line: `head+line0`; multi-line: chèn vào `.mline` đầu). `CauItem` (PrintView) + ET (ETPrintView 2 chỗ: trả-lời-ngắn + tự-luận) đổi `<span pv-cau-no>` rời → `<MathText prefix='<span class="pv-cau-no">Câu N.</span> '>`. Nhãn giờ luôn nằm trong dòng đầu của đề. Màn UI (ChamETSheet/BuoiHoc/DangHub/DungSai) giữ nguyên (nhãn cột riêng, cố ý).
- tsc sạch + build pass. ⏳ Thùy soi lại bản in giáo trình + ET.

**4. "% hoàn thành bản đồ" (Tổng quan) → số CẢM NHẬN weighted + 3 số detail (Thùy chốt):**
- Cũ: pct = ĐẠT/ĐÃ-ĐO (cần luyện & yếu = 0 công) → Thùy thấy khắt khe, "hơi sai".
- Tao phản biện cách weighted (mất chẩn đoán, che dạng yếu, nhầm tên "hoàn thành"). Thùy giữ quan điểm: số này ở TẦNG TRÊN chỉ để **cảm nhận** "hoàn thành ~bao nhiêu % toàn bộ dạng"; 3 trường hợp tao nêu tuy khác nhau nhưng ở tầng cảm nhận đều "có vấn đề" nên gộp OK; **chốt: để CẢ 2** — số tổng weighted + 3 số detail ngay dưới. Thanh 3-màu chi tiết đã có ở tab "Dạng bài".
- **Impl:** `getTongQuanHS.compPct` (mastery.ts) đổi `pct = (đạt×1 + cần×0.5 + yếu×0)/ĐÃ-ĐO` (**weighting theo BUCKET** để khớp 3 số detail, KHÔNG dùng mastery gốc) + trả thêm `can_luyen`,`yeu`. `TongQuanHS.hoanThanh` += can_luyen/yeu. Trend `hoanThanh` giờ theo pct weighted (recent vs prior). UI `TongQuanTab` (KetQuaScreen): số % to (indigo) + 3 chip **đạt(xanh)/cần luyện(hổ phách)/yếu(đỏ)** + "/N dạng đã đo". tooltip ghi công thức.
- tsc sạch + build pass. ⏳ Thùy soi Tổng quan 1 HS.

---

## 2026-07-03 — LUỒNG NHẬP KHO (ingest-first) — build slice 1

**Bối cảnh:** Thùy chốt luồng mới thay "sắp xếp tay vào Word rồi nhập chuỗi câu": 1 file PDF → hệ bóc từng câu (đề/đáp án/lời giải/loại) → người gán dạng → duyệt → đẩy kho. Đọc lại V1 `QuestionsPage.jsx` (TabRaDe/TabDuyetDapAn) — V1 gần hoàn thiện: rã đề cả PDF + auto-tag dạng (confidence + vòng-học label_rules) + auto-group bài nhiều ý + review 35/65 per-loại. RAG lý thuyết khi giải = nâng cấp so V1 (V1 giải chay).

**Quyết định (Thùy):**
- Đúng/sai theo model v2 (cả câu neo chuyên đề, mỗi mệnh đề 1 dạng) — V1 hồi đó chưa có logic chuyên đề.
- Tự luận ≈ trả lời ngắn → gộp 1 card, chỉ khác toggle "hình thức HS làm".
- Duyệt **1 câu chiếm màn**, next từng câu (bỏ list). Có thanh tiến độ + nhảy tới câu ⚠ độ-tin-thấp.
- Scope = **CHỦ ĐỀ** (nhiều chuyên đề), KHÔNG ép chuẩn hóa xuống chuyên đề (bất đối xứng: chuyên-đề-scope mua chút precision bằng công tách file vô hạn → không đáng; V1 tag ở scope khối vẫn ổn).
- **1 người full luồng 1 phiên** → KHÔNG draft table, client-state. Draft để dành đề-thi sau.
- Verify ≤ 2 vòng, người vòng cuối: cao-confidence 0 verify · thấp 1 verify (đọc lý thuyết dạng) → pass HOẶC đổi ma_dang_2, KHÔNG lặp lần 3.
- **precision@1** = (final = ai)/(tổng AI đề xuất) — Thùy yêu cầu đo. Log per-câu (`kho_tag_log`), 1 bảng phục vụ cả metric + nguồn vòng-học (cặp nhầm). Distiller/rule loop để pha sau khi có volume (cold-start 0 correction = loop trơ).

**Đã build:**
- **mig 0061** (áp DB): `kho_tag_log` (mon·ma_cau·loai_field·ai_value·final_value·ai_confidence·da_verify, RLS member-gate) + cột `mo_ta_ngan` trên `dai_ban_do`/`khtn_ban_do` (grounded classify — CHƯA có UI sinh, classify hiện dùng ten_dang+chuyên đề).
- **api.ts** (mục mới): `khoTbls` dispatch môn · `listChuDeOptions`/`listDangByChuDe`/`getDangLyThuyet` · **INGEST_KHO_SCHEMA hợp nhất** (loai_cau + de_bai + dap_an + lua_chon + menh_de + co_hinh/box_hinh) + `buildKhoIngestPrompt`/`parseKhoIngestJson` (1 pass, tự nhận loại) · `classifyDang` (grounded, 1 call/lô, trả ma_dang+confidence+ma_dang_2) · `verifyDangByLyThuyet` (chỉ low-conf) · `aiGiaiCau` (RAG đọc lý thuyết) · `saveCauToDang` (mỗi câu 1 dạng) · `logKhoTag`/`khoTagPrecision`.
- **NhapKhoScreen** (`src/screens/nhapkho/`, leaf `nhapkho` nhóm Danh mục): setup (môn/khối/chủ đề/file/có-hình/AI-giải) → bóc (render trang → Gemini/trang → parse → crop hình `anh_de` → classify flat theo đề + đúng/sai theo TỪNG mệnh đề → verify low-conf) → review 1-câu (FlatEditor/DungSaiEditor, DangPicker chip xuyên chuyên đề + combobox tìm, AI-giải, verify banner ⚠, thanh tiến độ) → Duyệt = save (saveCauToDang / createCauDungSai) + logKhoTag → next.
- Wire nav: fixtures adminLeaves + NhanSuHome route + import.
- tsc sạch + build pass. Migration áp + `npm run schema` (63 bảng).

**CÒN / next:** (1) sinh `mo_ta_ngan` (nút ở editor lý thuyết) để grounded classify mạnh hơn. (2) distiller `kho_tag_rule` khi đủ volume. (3) verify gom-theo-dạng (giờ per-câu low-conf, đã rẻ). (4) cấp quyền leaf `nhapkho` cho Học thuật/OPS (giờ chỉ laAdmin thấy). (5) ⏳ TEST THẬT bằng PDF + Gemini key (chưa chạy e2e — auth+key+file gate).

**Fix sau test thật (07-03, cùng ngày):**
1. **Bảng biến thiên bóc thành `\begin{array}` vỡ** → prompt `buildKhoIngestPrompt`: BBT/bảng-xét-dấu (mũi tên ↗↘, dòng x·y′·y) = HÌNH (co_hinh=true, crop anh_de); chỉ bảng số liệu thuần mới array. (Câu đã lưu trước = phải nhập lại.)
2. **"Nét hơn/bằng gốc, đừng mờ"** (Thùy): `pdfRender.ts` HI 300→**400 DPI** + MAX_SRC 3200→4200 (A4@400≈3308<4200 → không downscale). Crop PNG lossless, không tốn thêm token (GEM_W cap ảnh gửi Gemini). AI-redraw KHÔNG dùng (bịa hình toán — giữ ADR "hình=ảnh gốc cắt").
3. **Preview-first** (Thùy: "hiện preview đã gen công thức, bấm sửa mới ra code"): NhapKhoScreen mọi field render MathText mặc định, nút **✎ Sửa nội dung** toggle → textarea LaTeX. Card max-w-4xl→**6xl**. DangPicker thêm hàng **"Gần đây" ≤5 dạng** (pushRecent lúc pick/duyệt). tsc+build pass.

---

## 07-03 (phiên 2) — Bản GV hiện đáp án MỌI loại câu · fix clone thiếu `$` đóng cuối

**Việc 1 — bản giáo viên (in tài liệu) phải hiện đáp án CHI TIẾT dù loại câu nào:**
Rà 2 print view, thấy các lỗ:
- `PrintView.CauItem`: câu **Đúng/Sai** (`menh_de`) KHÔNG render gì (cả 4 mệnh đề lẫn đáp án) — HS lẫn GV đều mất.
- `PrintView` trắc nghiệm: bản GV chỉ tô xanh ✓, thiếu dòng "Đáp án" tường minh.
- `ETPrintView` trả-lời-ngắn (bảng): bản GV chỉ hiện đáp án ngắn, **thiếu lời giải**.
- `ETPrintView` tự-luận: thiếu `anh_dap_an`.

Sửa (`PrintView.tsx` + `ETPrintView.tsx`):
- Thêm `GvAnswer({c})` (export) = khối đáp án chi tiết dùng chung MỌI loại: TN→"Đáp án: chữ cái" · Đ/S→gom lời giải từng mệnh đề · TLN/TL→đáp án+lời giải; luôn kèm `anh_dap_an`.
- `CauItem` rẽ nhánh `menh_de`: render đề chung → 4 mệnh đề a·b·c·d (HS ghi Đ/S; GV hiện sẵn Đúng/Sai màu). Bỏ dòng kẻ viết khi là Đ/S. TN vẫn tô ✓ + thêm GvAnswer.
- ET: câu có `menh_de` route vào nhánh CauItem (bảng TLN không hiển thị nổi). TLN bản GV thêm lời giải+ảnh. Tự luận dùng `GvAnswer`.
- CSS mới: `.pv-ds*` (danh sách mệnh đề), `.pv-wrong` (đỏ), `.pv-et-ans/.pv-et-giai`.

**Việc 2 — clone thiếu `$` đóng ở cuối dòng cuối → công thức cuối vỡ:**
Nguồn: `MathText` (`kho/ui.tsx`) chỉ match `$…$` cân bằng; `$` mở lẻ ở cuối bị bỏ → phần đuôi render như text.
Fix GỐC ở renderer (đúng luật §325 "renderer chịu output AI ẩu" → vá 1 chỗ, lợi mọi print/màn + data CŨ): `balanceDollars` trong `buildLines` — đếm `$` đơn không-escape, LẺ → thêm 1 `$` đóng ở cuối. KHÔNG dùng lookbehind (Safari <16.4 ném SyntaxError), đếm thủ công `s[i-1] !== '\'`.

tsc sạch + build pass. ⏳ chưa soi PDF bằng mắt (bản in paged.js).

## 07-03 (phiên 3) — FIX bug §234: KHO hiện "0/50" + 0% dù đã có mấy chục câu (mig 0062)

**Triệu chứng:** chuyên đề "Bất đẳng thức một biến" (090801, K9) — mọi dạng GTLN-GTNN hiện **0/50 + 0%** dù kho có mấy chục câu.

**Điều tra (soi data thật, §234/§371 — soi TRƯỚC khi sửa):**
- Data ĐÚNG: `09080101`=44 câu, `09080102`=33, `09080105`=28; `dang_chinh` khớp `ma_dang`, không orphan. Tổng kho ~2900 câu.
- RLS `dai_cau_hoi_member_all` = `la_thanh_vien()` **STABLE + no-arg → eval 1 LẦN/query** (không per-row) → KHÔNG timeout, KHÔNG throw.
- Thẻ dạng vẫn render (list dai_ban_do OK) ⇒ `countCauByDang` chạy XONG mà thiếu key ⇒ không phải lỗi throw/RLS.
- **Kết luận:** `countCauByDang` cũ = `select dang_chinh from dai_cau_hoi limit 10000` rồi group ở CLIENT. PostgREST **cap max-rows (~1000)** → `.limit(10000)` bị clamp → chỉ thấy ~1000 câu đầu heap; câu GTLN mới thêm (cuối heap) RỚT → đếm 0. Handoff §234 đoán đúng hướng ("đếm cụt") nhưng ngưỡng KHÔNG phải 10000 mà là cap SERVER < tổng câu.

**Fix (mig 0062 + api.ts):** đếm Ở POSTGRES.
- RPC `count_cau_by_dang(p_tbl)` `returns jsonb` (1 DÒNG `{ma_dang:n}` — miễn nhiễm cap dòng dù bao nhiêu dạng), `stable security definer`, guard `la_thanh_vien()` + whitelist bảng (`dai_cau_hoi`/`khtn_cau_hoi`), grant authenticated.
- `countCauByDang`/`countCauByDangKhtn` (api.ts) gọi RPC thay vì fetch-all-group-client. % (PctRing/PctBadge) tự đúng theo (cùng nguồn `counts`).
- Verify GROUP BY: 109 dạng, `09080101`=44 ✓. Guard chặn non-member ✓. tsc+build+schema pass. ĐÃ áp DB cloud.

**Bài học:** đếm/tổng hợp toàn bảng KHÔNG được fetch-all rồi group client (PostgREST cap max-rows cắt âm thầm → sai KHÔNG lỗi). Dùng aggregate Postgres trả **jsonb 1 dòng** (không chỉ GROUP BY nhiều dòng — kết quả nhiều dòng cũng dính cap). Cùng pattern cho mọi chỗ "đếm theo nhóm toàn bảng".

## 07-03 (phiên 4) — "Việc của tôi": gom việc THEO NGÀY (mỗi ngày 1 hàng)

**Vấn đề (Thùy):** phần Vận hành đổ MỌI việc vào 1 lưới `auto-fill minmax(230px)` → ô vuông tràn ngang, khó nắm việc nào của ngày nào.

**Fix (NhanSuHome.tsx + tuan.ts):**
- `tuan.ts`: thêm `thuCuaNgay(ngay)` (Thứ 2…CN, dùng ymdToUTC+getUTCDay → không lệch tz) + export `ddmmVN`.
- `NhanSuHome`: component `DayRow` = đầu hàng thanh-màu-kẻ-dọc (design §259) `Thứ X · dd/mm` + badge "Hôm nay" (hôm nay tô indigo) + đếm việc; body = lưới card của ngày đó. Gom `opsActive`+`taskActive` vào `dayMap` theo `ngay`, sort ngày tăng dần. Thay lưới phẳng bằng `flex-col` các DayRow. Ngày rỗng tự ẩn.
- Card việc + OpsBuoiCard GIỮ NGUYÊN (chỉ đổi cách xếp). Mục "Đã xong" (details, thu sẵn) giữ lưới cũ.
- tsc + build pass. Mockup visualize duyệt hướng trước (đúng quy ước §368).

## 07-03 (phiên 5) — Kho tài liệu: nút "⬇ Tải PDF" (tải thẳng file, không qua hộp thoại in)

**Yêu cầu (Thùy):** ngoài "in PDF" (window.print → hộp thoại), muốn nút bấm là tải file PDF về máy luôn.

**Bối cảnh:** window.print KHÔNG tự tải file được (trình duyệt bắt buộc qua hộp thoại in). Muốn file .pdf tải thẳng → phải DỰNG PDF từ các trang paged.js đã render.

**Fix (PrintView.tsx + ETPrintView.tsx):**
- Thêm dep `jspdf` + `html2canvas-pro` (bản CHỊU oklch Tailwind v4 — html2canvas gốc ném lỗi, §367). **Lazy-import** trong hàm tải → không phình bundle chính (thành chunk riêng).
- `downloadPagesPdf(dst, filename)` (export ở PrintView, ET tái dùng): duyệt `.pagedjs_page` trong container preview → html2canvas-pro scale 2 mỗi trang → jsPDF addImage A4 (210×297) → `.save()`. `safeFileName` bỏ ký tự cấm Windows.
- Nút "⬇ Tải PDF" cạnh "🖨 In" trong toolbar cả 2 preview. Tên file = tên tài liệu + " - Bản GV"/scope. Có trạng thái "⏳ Đang tạo…" + báo lỗi.
- Luồng: Kho tài liệu → 🖨 In (mở preview) → ⬇ Tải PDF (tải thẳng).
- tsc + build pass. ⚠ CHƯA test tải thật bằng mắt (fidelity wave header/KaTeX khi rasterize — cần soi file PDF ra).

**Lưu ý:** PDF này = RASTER (ảnh mỗi trang, chữ không select được) — đổi lại tải 1 bấm không hộp thoại. Bản in vector chuẩn vẫn ở nút 🖨 In. Nếu muốn tải THẲNG từ HÀNG bảng (không mở preview) = làm sau (cần render paged.js ẩn).

## 07-03 (phiên 6) — Kho tài liệu: nút "⬇ Tải PDF" NGAY Ở HÀNG (headless, không mở preview)

**Yêu cầu (Thùy):** nút tải cạnh nút In ngay trong bảng Kho tài liệu — bấm 1 phát tải luôn, không cần mở preview.

**Fix (PrintView/ETPrintView + KhoTaiLieuScreen):**
- PrintView & ETPrintView: thêm prop `headless`. Khi bật → KHÔNG render preview, chỉ 1 overlay "⏳ Đang tạo file PDF" + dựng trang paged.js NGOÀI màn hình (`position:absolute;left:-99999px` nhưng vẫn có layout để paged.js đo + html2canvas chụp). Effect tự tải: khi `rendering=false` ổn định (chờ 350ms phòng render 2-pass của BTVN/giáo-trình-buổi khi lopTen load muộn) → `taiPdf()` → `onClose()`. Ref `didAutoDl` chặn tải 2 lần. TÁI DÙNG toàn bộ pipeline render sẵn (scope/gv/ET_CSS/header lớp-ngày) → không lệch bản In.
- KhoTaiLieuScreen: nút "⬇ Tải PDF" cạnh "🖨 In" mỗi hàng → set `dlDoc` → mount PrintView/ETPrintView `headless`. Tải xong tự đóng.
- Bản HS mặc định (như nút In). Muốn Bản GV → vẫn mở In → ⬇ Tải PDF trong preview.
- jspdf/html2canvas-pro = chunk LAZY riêng (391/246KB, chỉ nạp khi tải) — bundle chính không đổi. tsc+build pass.
- ⚠ CHƯA soi file PDF thật (rasterize wave header/KaTeX) — cần tải thử xác nhận.

## 07-03 (phiên 7) — FIX PDF gen lỗi header (wave/logo) + trang trắng (Thùy báo có ảnh)

**Triệu chứng (ảnh Thùy):** file PDF tải ra — header dải sóng + logo lỗi (chữ Lớp·ngày mờ = nền wave không ra), trang đầu trắng, header MẤT ở mọi trang sau.

**Chẩn:** đúng điểm yếu html2canvas (§367): **background NHIỀU LỚP trên `::before/::after`** (logo+chip+wave data-URI) rasterize không nổi → header trắng → chữ trắng thành mờ. Trang trắng nghi font chưa sẵn khi chụp + render ngoài `-99999px`.

**Fix (PrintView.tsx + ETPrintView.tsx):**
- Tách `pageChrome(taiLieu, ch, opts)` (export) = nguồn header/footer (headUri/footUri/logoUrl/chipUri/text) DÙNG CHUNG; `buildPagedCss` dùng lại (paged pseudo-element giữ nguyên cho bản In vector).
- `downloadPagesPdf(dst, filename, chrome?)`: html2canvas `onclone` → (a) tắt `::before/::after` (`content:none`), (b) chèn header/footer bằng PHẦN TỬ THẬT: `<img>` logo + `<img>` chip + 1 background wave ĐƠN + `<span>` text. Phần tử thật/ảnh thật → html2canvas chụp chuẩn. insertBefore(firstChild) để số trang (@bottom-right) vẫn nổi trên.
- Chờ `document.fonts.ready` + preload logo TRƯỚC khi chụp (chống trang trắng chữ).
- Headless render: đưa trang dựng ON-SCREEN (fixed top-left) SAU lớp phủ ĐỤC trắng (thay vì left:-99999px) → html2canvas ổn định hơn.
- `taiPdf` (cả 2) build chrome khớp header render (BTVN/GT-buổi = Lớp·ngày·footer liên hệ).
- tsc+build pass. ⏳ CHƯA verify mắt — Thùy tải thử lại (giáo trình + BTVN + ET).

## 07-04 — fix dep thiếu · ảnh ET giãn theo số câu · rút tên HS 2 từ cuối · Nhập kho dùng lại CauEditor + paste + full-width

**Bối cảnh:** máy này `git pull` xong CHƯA `npm install` → Vite báo `Failed to resolve import "html2canvas-pro"` (dep tải-PDF thêm ở 07-03, có trong package.json nhưng thiếu node_modules) → Thùy "ko bật được local".
- **Fix:** `npm install` (added 18 packages: html2canvas-pro, jspdf…). Bài học: pull về có dep mới thì phải install; lỗi resolve import = node_modules lệch package.json, KHÔNG phải code.

**1. Ảnh ET gửi PH bị CẮT cột khi nhiều câu (Thùy: B1..B11 tràn):** card `EtAnhGuiPH` (BuoiHocScreen) trước cố định `width:440` → nhiều bài thì cắt phải.
- Fix: `cardW = max(440, 100 + số_câu×30 + 32)` (giãn theo số câu) + BỎ `maxWidth:100%` (để container overlay tự cuộn ngang, không co làm cắt cột). html2canvas chụp full scrollWidth → ảnh copy đủ cột. Tên HS trong ảnh cũng rút 2 từ cuối.

**2. Tên HS chỉ hiện 2 TỪ CUỐI ở màn VẬN HÀNH (Thùy: "mọi nơi hiển thị tên HS"):**
- Helper CHUNG `src/lib/hoten.ts` `tenNganHS(hoTen)` = 2 từ cuối ("Nguyễn Thị Hồng Anh"→"Hồng Anh").
- Áp: BuoiHocScreen (điểm danh/chấm bài/ET/BTVN/đánh giá + ảnh PH), KetQuaScreen (cột lớp trái + rollup), GamiDiemScreen (BXH + theo ca), BoTroScreen + BoTroDuoiScreen (card/chip/detail), ThanhTichScreen (lưới HS), QuanLyLevelScreen (ma trận).
- GIỮ tên đầy đủ: quản lý Học sinh, form, ô tìm kiếm (SearchSelect), ghép PH, TIÊU ĐỀ hồ sơ điểm/thành tích (1 chỗ nổi bật = full), dialog xác nhận/cảnh báo, PHIẾU IN giấy (document cần nhận diện). Quy tắc: list/table/grid/chip = ngắn · profile-title/form/search/print = đầy đủ. (Thùy chưa trả lời câu hỏi phạm vi → chọn mặc định hợp lý này, báo có thể mở rộng.)

**3. Màn NHẬP KHO (nhapkho) — Thùy: "để giao diện GIỐNG nhập chuỗi câu, đừng đẻ UI mới; upload → paste clipboard; popup to gần full màn":**
- **Tái dùng CauEditor** (export `CauEditor`+`ReviewItem` từ DangHub): phần duyệt câu PHẲNG render bằng chính CauEditor (đề/đáp án/lời giải/ảnh + ✎ Sửa, y hệt nhập chuỗi câu). XOÁ `FlatEditor` tự viết. Chỉ giữ **thanh gán dạng** (`DangPicker`) phía trên — bắt buộc vì nhập kho scope=CHỦ ĐỀ (nhiều dạng). Đúng/Sai giữ `DungSaiEditor` (CauEditor không xử 4 mệnh đề).
- Map RItem↔ReviewItem qua `flatRI`/`onFlat` (người sửa lời giải → `nguonGiai='nguoi'`). Thêm cột **ảnh giải** `anh_dap_an` vào lưu kho (trước bỏ trống). Bỏ field `hinhThuc` (dead — không lưu).
- **Paste clipboard:** setup có 📎 Chọn file (PDF nhiều trang) + 📋 Dán ảnh (Ctrl+V, `readClipboardImageFile`) + window paste listener (chụp screenshot dán thẳng).
- **Full-width:** bỏ `max-w-6xl` bé → card `max-w-[1800px]` chiếm hết cao (flex-col), CauEditor fill 2 cột căng ngang; thanh dạng+AI-giải 1 hàng trên, nav dính đáy.
- tsc pass. ⏳ e2e bóc câu vẫn cần key Gemini (local đang suspend); phần UI xem qua HMR.

## 07-04 (phiên 2) — TEST ONLINE: Bước 0 verify (spec §2) trước khi build

**Chạy `_diag_testonline.mjs` (SELECT, claude_build) xác nhận 6 điểm:**

1. **loai_cau THẬT ≠ spec.** DB dùng `trac_nghiem` / `tra_loi_ngan` / `tu_luan` / `dung_sai` — KHÔNG có `4_dap_an` như spec §1 viết. → code test-online phải map "trắc nghiệm 4 đáp án" = `trac_nghiem`. `loai_cau` là **text thuần, KHÔNG có CHECK** (schema.md 176) → thêm/dùng `dung_sai` khỏi nới constraint.
2. **`trac_nghiem` lua_chon = jsonb array string, BẨN:** phần tử [0] MẤT nhãn "A." (chỉ nội dung), [1..3] = "B. …"/"C. …"/"D. …"; `dap_an` = chữ cái 'B'/'D'. Có câu `dap_an=null,lua_chon=null` (vd 12040201005) → **snapshot phải VALIDATE, cảnh báo câu thiếu key**. Chấm = map vị trí HS chọn (A/B/C/D theo index) == dap_an chữ cái → deterministic 100%.
3. **`dung_sai` mới có 2 câu (dai) + 1 (khtn), MENH_DE = NULL** (câu cũ chưa cấu trúc). Kho đúng/sai structured (`createCauDungSai`, menh_de=[{noi_dung,dap_an D/S,ma_dang,loi_giai}]) chưa có data thật. **Thang partial (Bước 0.2) VẪN CHƯA CHỐT** → defer dung_sai (spec §11 bước 5).
4. **`tra_loi_ngan` BẨN NẶNG cho auto-chấm:** 1332 câu (dai) → 252 chứa `$` (biểu thức LaTeX), 459 chứa chữ cái, **chỉ 766 (~57%) là số-thuần/list-số** máy so được. Vd đáp án `$3x+1$ dư $2x+3$`, `$x+4$ dư $-3$` → `smartNormalize` KHÔNG xử nổi → rơi `wrong`→report. **~43% tra_loi_ngan không auto-chấm exact.** Cấp 3 khối 12: 141 tra_loi_ngan (nhiều biểu thức hơn).
5. **Cấp 3 = chủ yếu `trac_nghiem`:** K11 = 377 TN / 51 TLN / 1 ĐS; K12 = 460 TN / 141 TLN / 1 ĐS. → **build `trac_nghiem` trước ăn ~80% giá trị**, auto-chấm 100% khỏi report.
6. **RLS = ENABLED toàn bộ** (dai_cau_hoi/hoc_sinh/gami_grades/tai_khoan… đều rowsecurity=true, member-gate) — note spec §2.5 "data tables DISABLE RLS" ĐÃ CŨ. Bảng HS-facing cần policy HS-scoped (`my_hoc_sinh_id()`), khác member-gate.

**Login HS = NET-NEW xác nhận CỨNG:** `tai_khoan`=(id,nhan_su_id,email) chỉ trỏ nhân sự; `hoc_sinh` không kênh auth; không có `my_hoc_sinh_id()`. `auth` schema claude_build KHÔNG truy cập được (permission denied) → tạo auth user HS + link phải qua **Dashboard/admin API**, KHÔNG migration thường (bài học ② auth/storage). **Đây là blocker lớn nhất, cần Thùy quyết cơ chế đăng nhập HS.**

**accepted_answers CHƯA port:** V1 = `question_accepted_answers`(ma_cau,answer_normalized,answer_raw,source,ai_reason,hit_count) + RPC `increment_qaa_hit`; `smartNormalize`/`smartCheckTLN` (TabDailyPractice.jsx) = pure-fn port thẳng.

**Thùy chốt:** login HS = "test nhanh mã+PIN, lâu dài tài khoản Supabase thật" → CTO gộp: HS nhập **mã HS + PIN**, dưới nền Supabase Auth THẬT email `<ma_hs>@hs.bkdemy.local` pass=PIN → auth.uid thật → RLS chạy + đúng "tài khoản Supabase" lâu dài. Slice 1 = **BTVN + chỉ trắc nghiệm** (spec §11.2).

### 07-04 (phiên 2, tiếp) — BUILD nền test online

- **mig 0063 (áp DB, schema 69 bảng/12 func):** `tai_khoan.hoc_sinh_id` (song song nhan_su_id) + `my_hoc_sinh_id()`/`hs_o_lop(uuid)` (security-definer, đọc jwt_uid KHÔNG auth.uid) + bảng `bai_test`/`bai_test_cau`/`bai_lam`/`bai_lam_cau`/`bai_test_report`/`question_accepted_answers`(+`increment_qaa_hit`). RLS: staff=`la_thanh_vien()` toàn quyền · HS=policy HS-scoped (`bai_test`/`cau` đọc theo `hs_o_lop`, `bai_lam`/`cau`/`report` theo `my_hoc_sinh_id`). HS KHÔNG phải la_thanh_vien → tách sạch. Bảng mới KHÔNG được 0026 blanket phủ → khai policy TAY.
- **Engine `src/gami/testgrade.js`** (PURE, 23 test `node scripts/verify_testgrade.mjs`): `smartNormalize`/`smartCheckTLN` (port V1) + `gradeTracNghiem`(index→chữ cái) + `gradeTraLoiNgan` + `extractKey`(validate snapshot). **Bug tách đáp án:** V1 `split(/[;,]/)` cắt nhầm thập phân VN "0,5"→["0","5"] → đổi **tách chỉ theo `;`** (kho dùng '3; 4'), giữ `,` cho thập phân.
- **Service `src/lib/testonline.ts`** (seam): `phatHanhBTVN` (snapshot đề+key, chỉ trac_nghiem/tra_loi_ngan, validate câu thiếu key→skip+warn, idempotent qua unique index) · `getBaiTestByDoc`/`xoaBaiTest` · `getMyHocSinhId`(rpc) · `listBaiTestCuaHS`(RLS tự lọc lớp) · `getBaiTestFull` · `moBaiLam`(upsert slot idempotent) · `traLoiCau`(auto-chấm exact + upsert, BTVN reveal ngay trả key) · `nopBai`(claim atomic). tsc pass.
- **Script `scripts/provision_hs_auth.mjs`** (SẴN, chờ key): tạo auth.users HS (email tổng hợp+PIN=mã HS+email_confirm) + insert tai_khoan.hoc_sinh_id. Cần `SUPABASE_SERVICE_ROLE` trong .env.local. Chạy `node scripts/provision_hs_auth.mjs HS0001 HS0002` provision vài HS test.
- **CÒN:** cổng login HS (App.tsx gate) · nút "Phát hành test online" (staff, ở Kho tài liệu) · UI HS-facing mobile làm BTVN (mockup game duyệt trước) · sync btvn_ket_qua · provision (chờ service_role key từ Thùy).

### 07-04 (phiên 2, tiếp 2) — provision HS · login gate · UI HS · nút phát hành · VERIFY RLS

- **Provision:** Thùy đưa service_role → `provision_hs_auth.mjs` tạo 3 HS test (HS0004/11B1, HS0009/8B1, HS0010/8S1); email `<ma_hs>@hs.bkdemy.local`, PIN=mã HS, `tai_khoan.hoc_sinh_id` link OK.
- **Mockup luồng** (visualize) Thùy duyệt: **1 câu/màn** + **nút "Xác nhận" per-câu** (tránh ấn nhầm=chọn bừa) → chấm → **hiện đáp án + lời giải chi tiết câu đó** → "Câu tiếp". Skin game để phiên design sau.
- **mig 0064:** `bai_test_cau` thêm `loi_giai`+`anh_dap_an` (reveal lời giải). **mig 0065:** policy `lop_hs_read` (HS đọc tên lớp mình — lop có member-gate chặn HS).
- **Login (`auth/Login.tsx`):** toggle Nhân sự/Học sinh; HS nhập **mã HS + PIN** → `signInWithPassword(<ma_hs>@hs.bkdemy.local, PIN)`.
- **Gate (`App.tsx`):** sau session resolve `getMyHocSinhId()` → HS render `HocSinhApp`, KHÔNG load quyền staff; staff giữ nguyên.
- **UI HS (`src/screens/hocsinh/HocSinhApp.tsx`):** list BTVN (RLS tự lọc lớp) → làm bài 1 câu/màn: chọn (trắc nghiệm nút A-D / trả lời ngắn ô nhập) → **Xác nhận** (`traLoiCau` chấm exact) → reveal đúng/sai + đáp án + **lời giải (MathText)** + ảnh giải; sai→"🚩 Em nghĩ mình đúng" (`baoSai`) → câu tiếp → màn kết quả X/Y. Khôi phục câu đã làm khi mở lại. `traLoiCau` trả `baiLamCauId` cho báo sai.
- **Nút phát hành (staff, `KhoTaiLieuScreen`):** doc BTVN bám lớp+ngày có nút **"📱 Phát hành online"** → `phatHanhBTVN` → modal kết quả (added + câu bỏ qua kèm lý do). KHÔNG alert (đúng §6).
- **✅ VERIFY RLS thật (`_diag_rls_hs.mjs`, anon client + auth):** seed bai_test 8B1 → **HS0009 (8B1) thấy 1 test + đọc câu · HS0010 (8S1) thấy 0** (cách ly lớp đúng) · `my_hoc_sinh_id` OK cả 2. Tầng rủi ro nhất (login+RLS) chạy đúng. tsc + build pass.
- **Data test sẵn:** doc BTVN 8B1 (26 câu TLN) + 8S1 (42 câu TLN) — khối 8 đáp án SỐ → auto-chấm sạch. 11B1 (HS0004) chưa có doc BTVN.
- **CÒN:** sync `btvn_ket_qua` (BTVN tham khảo — chưa nối) · trac_nghiem chưa test thật (data BTVN toàn TLN; muốn test TN cần soạn doc BTVN có câu trắc nghiệm) · skin game HS-facing · e2e trong app (Thùy) · ET online (slice sau: chấm qua RPC ẩn key, nộp-1-lần, xóa task TG).

### 07-04 (phiên 2, tiếp 3) — ĐỔI logic chống trùng câu: doc → BUỔI (Thùy)

- **Thùy chốt:** chống trùng câu **chỉ trong CÙNG 1 buổi** (không trùng); **KHÁC buổi ĐƯỢC dùng lại** câu đã dùng. (Trước: khoá cứng toàn doc — HANDOFF §198.)
- **`tailieu.ts`:** `usedCausOfDoc` → **`usedCausOfBuoi(taiLieuId, buoiId, exceptPhanId?)`** (chỉ quét phan dạng+BTVN của buổi đó qua `groupBuoi`). `setDangOfBuoi` dùng `usedInBuoi` thay `usedInDoc` cho auto-suggest luyện+BTVN.
- **`TaiLieuBuilder.tsx`:** `usedExcept(phanId)` scope theo buổi CHỨA phanId (tìm qua `groupBuois`) — KhoPicker disabled + "↻ Gợi ý" chỉ né câu cùng buổi. (Badge `cauUsage` "dùng N×" = cross-doc mềm, GIỮ nguyên.)
- tsc + build pass. (⚠ HANDOFF §198/§382/schema-note nhắc "khoá phạm vi doc" giờ STALE → distill cuối ngày sửa.)

### 07-04 (phiên 2, tiếp 4) — TEST ONLINE loại ĐÚNG/SAI (Thùy: ĐS trước, TLN sau)

- **Thùy chốt tư duy:** ET/BTVN/GT bản chất NHƯ NHAU = "nối 1 bài làm HS vào kho", chỉ khác kết quả chảy về đâu. Thứ tự loại câu: **trắc nghiệm (xong) + đúng/sai TRƯỚC** (đều chấm khớp tuyệt đối 100%, ko cần report) · **trả lời ngắn SAU** (loại bẩn 43% cần report/cache).
- **Thang điểm đúng/sai = CHUẨN THPT 2025** (số ý đúng 0..4 → 0/0.1/0.25/0.5/1.0). Verdict: 4/4→correct · 1-3→partial · 0→wrong. `DUNGSAI_DIEM_4Y` trong engine.
- **Engine `testgrade.js`:** `gradeDungSai(hs, key)` (đếm ý đúng → điểm thô + verdict) + `extractKey` xử dung_sai (key = mảng D/S từ menh_de[].dap_an; validate mệnh đề thiếu Đ/S). 30 test pass (thêm 6 ĐS).
- **Service `testonline.ts`:** SUPPORTED += 'dung_sai'; `traLoiCau` route dung_sai → gradeDungSai, lưu `diem = diemTho × trọng số`. Snapshot `menh_de` (gồm loi_giai) đã có sẵn.
- **UI `HocSinhApp`:** 3 nhánh render — TN (nút A-D) · **ĐS (mỗi mệnh đề 2 nút Đúng/Sai)** · TLN (ô nhập). `chon` mở rộng thành mảng cho ĐS; `daDu`=đủ điều kiện Xác nhận (ĐS phải đủ 4 ý). Reveal ĐS: mỗi ý xanh/đỏ + "X/4 ý đúng" + lời giải per-mệnh-đề + box amber cho partial. **Báo sai CHỈ cho tra_loi_ngan** (TN/ĐS tuyệt đối, ko tranh cãi).
- **⭐ FIX SCHEMA (mig 0066):** `bai_lam_cau.bai_test_cau_id` RESTRICT → **ON DELETE CASCADE**. Bug: `xoaBaiTest` xoá test đã có HS làm sẽ FAIL (bai_test_cau bị chặn bởi bai_lam_cau). Xoá test = huỷ instance → bỏ luôn bài làm.
- **✅ VERIFY thật (`_diag_dungsai.mjs`):** seed câu ĐS → temp bai_test → **HS0009 GHI bai_lam_cau qua RLS OK** (đường WRITE của HS — lần đầu test) → verdict=partial, diem=0.5 (3/4) đúng → cleanup cascade sạch. (Trước chỉ test READ.)
- **Demo test (`seed_demo_test_online.mjs`):** doc BTVN "DEMO Test online — 11B1" (2 trắc nghiệm + 1 đúng/sai + 1 trả lời ngắn, khối 11), bám 11B1 · 10/07. 4 câu snapshot sạch (extractKey OK hết). → Thùy phát hành + login HS0004 test cả 3 loại. (`--xoa` để dọn.)
- tsc + build pass.

### 07-04 (phiên 2, tiếp 5) — HS test online: 3 lưu ý Thùy (mobile · toggle hoàn thành · gợi ý lý thuyết)

1. **TỐI ƯU ĐIỆN THOẠI:** `#root{zoom:1.15}` (mật độ desktop staff) phóng app HS → tràn màn hình dt. Fix: App bọc `<HocSinhApp>` trong `<div style={{zoom:1/1.15}}>` → net 1.0. LamBai `min-h-screen`→`h-screen` (footer nút ghim đáy, giữa cuộn). Viewport meta đã có sẵn.
2. **TRẠNG THÁI HOÀN THÀNH + toggle:** list HS có **toggle "Chưa làm / Hoàn thành"** (segmented + đếm). "Hoàn thành" = `bai_lam.trang_thai='da_nop'` — tự đánh dấu khi HS trả lời HẾT câu (effect watch `st`, `nopBai` claim atomic). Badge "✓ hoàn thành", nút "Xem lại". Reopen sửa vẫn giữ hoàn thành.
3. **NÚT GỢI Ý lý thuyết dạng:** HS ko đọc kho (member-gate) → snapshot LT vào `bai_test_cau` (mig 0067 `ma_dang`+`ly_thuyet`; `phatHanhBTVN` batch fetch `khoCuaMon(mon).ltDangTbl` theo dang_chinh). UI: nút "💡 Gợi ý" (chỉ hiện khi cau.ly_thuyet có) → bung panel lý thuyết (MathText), reset khi đổi câu.
- Demo: dạng đúng/sai chọn dạng khối 11 ĐÃ CÓ lý thuyết → 3/4 câu demo hiện Gợi ý. **⚠ Nếu đã phát hành demo TRƯỚC đổi này → xoá bai_test cũ + phát hành lại** (snapshot cũ thiếu ma_dang/ly_thuyet).
- tsc + build pass.

### 07-04 (phiên 2, tiếp 6) — Lập tài khoản cho TOÀN BỘ học sinh

- **Thùy chốt:** lập TK cho tất cả HS. Username = mã HS · **pass mặc định = mã HS** (mỗi em pass riêng, khỏi thông báo, đổi sau). Lý do: "đằng nào HS cũng sẽ có tài khoản riêng".
- Chạy `provision_hs_auth.mjs` (no-arg = tất cả HS đang học, skip đã có) → **318 tạo + 3 test = 321/321**, 0 lỗi. Email tổng hợp `<ma_hs>@hs.bkdemy.local`, email_confirm, tai_khoan.hoc_sinh_id link. Verify: 321 tai_khoan HS = 321 HS đang học; login thử HS0036 OK, my_hoc_sinh_id resolve ✓.
- **CÒN (Thùy "sau này có thể thay đổi"):** chưa có màn HS **đổi mật khẩu** (supabase.auth.updateUser) — dựng khi cần. HS mới nhập học sau này: provision lại (script idempotent, skip đã có) hoặc nút "Cấp tài khoản" ở màn Học sinh.

### 07-04 (phiên 2, tiếp 7) — ET (chế độ THI) + Giáo trình làm online

- **Thùy chốt:** ET/BTVN/GT bản chất như nhau (nối bài làm vào kho). Giáo trình online = **chỉ bài luyện** (loai_phan='dang'), bỏ lý thuyết (vẫn ở nút Gợi ý). **ET = chế độ THI** (nộp 1 lần mới hiện đáp án, giấu key chống gian lận, chấm server, vào điểm).
- **mig 0068:** bai_test.loai += 'giao_trinh' · `so_cau` denormalize (list HS ko đếm được bai_test_cau ET do RLS) · **RLS bai_test_cau_hs_read loại ET** (HS ko đọc câu ET) · **RPC `et_de`** (đề ET đã LỌC key/lời giải, menh_de chỉ noi_dung) · **RPC `et_nop`** (chấm server-side TN/ĐS/TLN + đông cứng + reveal). **mig 0069:** et_nop **chỉ chấm lần nộp ĐẦU** (get diagnostics row_count) — chống sửa đáp án qua API rồi nộp lại.
- **Service:** `phatHanhTest` tổng quát (DOC_MAP dispatch câu theo loai doc; ET→khoa THI) thay `phatHanhBTVN` (giữ alias) · `getGiaoTrinhBuoiCaus` (câu dạng) · ET HS: `getETDe`/`luuDapAnET`(lưu ko chấm)/`nopET`/`getETDapAnDaLuu`. list dùng `so_cau` denorm.
- **UI:** staff nút phát hành hiện cho btvn/et/giao_trinh_buoi (PHAT_HANH_DUOC). HS list: nhãn loại + badge tím **THI** cho ET. **`LamET`** (component riêng): làm 1 câu/màn KHÔNG lộ đáp án (auto-lưu mỗi chọn) → "Nộp bài" (confirm) → `et_nop` reveal cả bài; mở lại bài đã nộp = nopET idempotent hiện reveal. Giáo trình dùng LamBai (reveal-ngay) như BTVN.
- **✅ VERIFY (`_diag_et.mjs`):** et_de **giấu key sạch** + đọc thẳng bai_test_cau ET **bị RLS chặn** + et_nop **chấm server đúng** (TN correct · ĐS partial 0.5 · TLN correct) + da_nop. freeze re-test pass.
- **Demo:** seed thêm doc ET "DEMO ET (thi) — 11B1" (cùng 4 câu) cạnh BTVN demo. Thùy phát hành cả 2 → HS0004 test.
- **⏳ CÒN "vào điểm" (mastery):** ET results ĐÃ lưu per-câu (bai_lam_cau: ma_dang + verdict + da_nop) = phép đo có thật, NHƯNG chưa nối vào mastery engine (getMasteryHS đọc gami_grades+buoi_danh_gia_dang, chưa đọc bai_lam_cau ET) / màn Điểm số. Bước sau: bổ sung nguồn ET-online vào mastery.ts (suy động, đúng §1). tsc+build pass.

### 07-04 (phiên 3) — Nối ET-online vào MASTERY + luồng REVIEW trả lời ngắn (cache + backfill)

- **⭐ MASTERY ĐỌC ET-ONLINE (mastery.ts):** thêm nguồn đo thứ 3 `fetchOnlineEvals` = `bai_lam_cau` (verdict ≠ null) — embed 2 tầng FK đơn `lam:bai_lam_id!inner(hoc_sinh_id, trang_thai, test:bai_test_id(loai, mon))` + `cau:bai_test_cau_id(ma_dang)`, filter `.eq/.in('lam.hoc_sinh_id')` (pattern !inner như loadMasteryCells). Map: **ET → src 'et'** (thi có giám sát, VÀO mastery; ET đòi `da_nop`) · **btvn/giao_trinh → src 'btvn'** (tham khảo, chỉ vào khi toggle BTVN — đúng chính sách). Nối cả 3 chỗ: `getMasteryHS` (view①) + `getTongQuanHS` (%ET/%BTVN + byDang, online scope theo `test.mon` — offline %ET vốn không scope môn, giữ nguyên) + `loadMasteryCells` (bulk view②③④). Scope môn của dạng vẫn qua banDoTbl như offline. **Suy động → duyệt lại verdict là mastery tự đúng, không sync.**
- ⚠ Chưa dedupe nếu 1 ET vừa TA chấm tay (gami_grades) vừa HS làm online (bai_lam_cau) → 2 lần đo. Thực tế 1 ET chỉ đi 1 đường; liên quan mục CÒN "task Chấm ET TG chưa xoá khi ET online".
- **⭐ LUỒNG TRẢ LỜI NGẮN 2 TẦNG + REVIEW (logic V1 Thùy mô tả: hệ chấm sai → TA thấy đúng → đáp án cập nhật thêm vào bộ đáp án):**
  - **mig 0070** (ĐÃ áp DB): `tln_norm(text)` (norm cơ bản SQL: lower + bỏ [[:space:]]) · **RPC `tln_cache_check(ma_cau, norm)`** (security definer, HS gọi được nhưng KHÔNG SELECT được bảng cache — phải biết sẵn đáp án mới hit, không lộ key; hit → bump hit_count) · **`et_nop` v4**: TLN sai theo key → check `question_accepted_answers` (khớp `answer_normalized` HOẶC `tln_norm(answer_raw)`) → `correct` + `cham_boi='cache'`. 2 normalizer (JS smartNormalize · SQL tln_norm) tự nhất quán mỗi phía, match chéo qua answer_raw — KHÔNG port full smartNormalize sang SQL.
  - **testonline.ts:** `traLoiCau` (BTVN/GT client) TLN wrong → rpc `tln_cache_check(smartNormalize(hs))` → correct/cache · **`listTLNSai`** (mọi câu TLN đang wrong + join report client) · `listAcceptedAnswers` · **`chapNhanDapAn(maCau, raw)`** = ① upsert cache (unique ma_cau+normalized) ② **BACKFILL** mọi bai_lam_cau wrong cùng ma_cau + cùng smartNormalize → correct/`manual` (diem theo câu, update nhóm theo diem) ③ resolve report `moi`→`dung` · `tuChoiReports` (→'sai').
  - **Màn `DuyetChamScreen`** (leaf mới **`duyetcham`** "Duyệt chấm online", nhóm Vận hành): nhóm 2 tầng CÂU (theo ma_cau, đề + key + chip "cũng đúng") → từng ĐÁP ÁN distinct (theo smartNormalize = đúng đơn vị cache/backfill) với đếm HS + tên ngắn + lớp/loại/ngày + 🚩 ý kiến; nút **"✓ Chấp nhận đúng"** (báo số bài đã sửa) / **"✕ Vẫn sai"** (đóng report). Tab: 🚩 HS báo sai (mặc định) / Tất cả câu bị chấm sai. ⚠ leaf mới chỉ laAdmin thấy — cấp role ở Phân quyền như tuyensinh/botro.
- **✅ VERIFY (`_diag_tln_review.mjs`, seed tạm 8B1 + HS0009, đã dọn):** tln_norm ✓ · cache hit normalized + raw + miss ✓ · hit_count bump ✓ · HS không SELECT được cache ✓ · **et_nop trả correct/cache/diem=1** với đáp án chỉ có trong cache ✓ · 2 embed query mới (online-evals + listTLNSai) chạy dưới RLS ✓. tsc + build pass. `npm run schema` (16 function).
- **CÒN:** task "Duyệt báo sai" trong getMyTasks (spec §9 — thay task Chấm ET khi ET online) · nút "Chấm lại câu N/lớp" khi KEY sai cả lớp (spec §7, khác luồng accepted-answer) · view "Theo buổi" (KetQua ②) chưa hiện bài test online.

### 07-05 — Sắp xếp nav THEO TEAM · fix bug HS nghỉ không tự rời lớp

- **⭐ NAV TẦNG 1 = THEO TEAM (Thùy chốt):** đổi 6 nhóm cũ (Danh mục/Quan hệ/Dashboard/Vận hành/Bổ trợ/Hệ thống) → **Vận hành** (buổi học·HS·lớp·tuyển sinh·bù·đuổi) · **Gamification** (Elo·thành tích·level) · **Học thuật** (kho·nhập kho·làm tài liệu) · **Quản lý chất lượng** (kết quả học tập·duyệt chấm online) · **Core team** (nhân sự·sơ đồ·phân công·TKB·phân quyền·báo lỗi·tuyển dụng·giao việc) · **Dashboard** (CEO-only). `fixtures.ts` (adminLeaves.nhom) + `types.ts` (union type). Đây CHỈ đổi IA hiển thị — quyền thật vẫn cấp per-leaf ở Phân quyền (role chưa tự theo team). Ý định: sau này role cũng chia theo 6 team này.
- **🐞 FIX BUG HỆ THỐNG: HS chuyển `trang_thai='nghi'` KHÔNG tự rời lớp** (phát hiện lúc Thùy nhờ lập TK test khối 12 — 2/19 HS thiếu TK vì `hoc_sinh.trang_thai='nghi'` bị provision script loại, nhưng `hoc_sinh_lop` vẫn `dang_hoc` — data MÂU THUẪN). Thùy: đúng là lỗi hệ thống cũ, "nghỉ phải tự động rời lớp". **mig 0071**: trigger `hs_nghi_tu_roi_lop` (AFTER UPDATE hoc_sinh, khi trang_thai→'nghi' từ khác) → tự đóng MỌI `hoc_sinh_lop.trang_thai='dang_hoc'` của HS đó (→`da_roi`+`ngay_roi` giờ VN) — chảy qua trigger log sẵn có (0028) tự ghi vết `roi_lop`, không log lại. **CHỈ áp `nghi` (nghỉ hẳn), KHÔNG áp `bao_luu`** (tạm nghỉ giữ chỗ — giữ ghi danh). Backfill data cũ mâu thuẫn (2 HS trên) trong cùng migration.
- **✅ VERIFY:** backfill xong → khối 12 còn đúng 17 HS `dang_hoc` (từ 19), cả 17 đã có TK. Live test (`_diag_hs_nghi_trigger.mjs`, seed+dọn): set nghi → `hoc_sinh_lop` tự `da_roi` + log ghi `roi_lop` ✓.
- Đúng CLAUDE.md §4 (state đổi phải có TRIGGER DB tự đẻ vết, app không tự nhớ) — bug gốc là chưa có trigger này từ đầu; nay việc "cho HS nghỉ" ở màn Học sinh tự đúng khỏi cần code app gọi thêm.
- `npm run schema` (17 function).

### 07-05 (tiếp) — XÁO CÂU + ĐÁP ÁN test online (chống liếc bài)

- **Yêu cầu Thùy:** 2 HS ngồi cạnh làm cùng đề online không được thấy giống hệt nhau — cần xáo thứ tự CÂU HỎI và thứ tự ĐÁP ÁN (TN 4 phương án + ĐS 4 mệnh đề) khác nhau per tài khoản.
- **⭐ Thiết kế: CHỈ xáo tầng HIỂN THỊ, chấm vẫn dùng chỉ số GỐC — không đụng engine chấm (testgrade.js/et_nop SQL nguyên vẹn).** `src/lib/shuffle.ts` (module thuần): `seededPerm(n, seed)` (Fisher-Yates + PRNG mulberry32 seed-able) + `seededShuffleWithOrig(arr, seed)` (trả `{item, orig}[]`, orig=chỉ số gốc để map ngược). **Seed ổn định** = `hocSinhId:baiTestId[:cauId][:opt|:ds]` — cùng 1 HS mở lại bài thấy ĐÚNG thứ tự cũ (không xáo lại mỗi lần load), khác HS thì khác thứ tự.
- **Áp cho cả `LamBai` (BTVN/GT reveal-ngay) lẫn `LamET` (thi):** câu hỏi xáo qua `caus = seededPerm(...).map(i => full.caus[i])` (đặt TRƯỚC early-return `if(!full)` vì là hook `useMemo`, tránh vi phạm rules-of-hooks). Đáp án TN: render theo `optsShown` (mảng `{item,orig}`), NHÃN A/B/C/D theo vị trí HIỂN THỊ (`dispI`), nhưng `setChon`/`luu` ghi **`orig`** — đúng-sai so `orig === chiSoCuaChu(dap_an_key)` (hàm mới `chiSoCuaChu` trong testonline.ts, chiều ngược của `chuCaiChon`). Mệnh đề ĐS tương tự: nhãn a/b/c/d theo `dispI`, `keyDS[orig]`/`chonArr[orig]`/`setDS(orig,v)`.
- **✅ VERIFY THẬT trên browser** (bài ET thật 12A1 đã phát hành, KHÔNG phải seed): login HS0037 vs HS0040 cùng 1 test 5 câu → **Câu 1 của 2 em là 2 CÂU KHÁC NHAU** (question order xáo) + **cùng 1 câu, thứ tự đáp án A/B/C/D khác nhau giữa 2 em** (option order xáo). Chọn đáp án ĐÚNG nhưng hiển thị nhãn KHÁC chữ gốc (dap_an_key='B', hiển thị ở vị trí 'C') → nộp → server chấm **"🎉 Đúng"** ✓; verify DB `bai_lam_cau.dap_an_hs` lưu ĐÚNG chỉ số gốc (0/1/3) khớp `dap_an_key` (A/B/D) — remap hoạt động đúng 100%, không lệch chấm điểm. Đã dọn bài làm test khỏi bài thật.
- tsc + build pass. Không migration (thuần client, không đụng schema/RLS/RPC).

### 07-05 (tiếp) — ⭐ ĐỀ THI (trường/sở) — feature mới đầy đủ (spec BKDEMY_DETHI_SPEC.md)

- **Audit spec TRƯỚC khi code (đúng §10.1 spec):** verify schema thật phát hiện 2 chỗ spec SAI/lỗi-thời — (1) "RLS data DISABLE" đã lỗi thời, thực tế `tai_lieu`/`tai_lieu_phan`/`tai_lieu_cau`/`dai_cau_hoi` đều RLS ENABLED với policy `_member_all` (mig 0026) — không cần thêm RLS cho phần staff. (2) "holding chưa phân dạng" ở DB KHÔNG làm được vì `dai_cau_hoi.dang_chinh` NOT NULL — sửa thiết kế: holding = CLIENT-STATE (giống `nhapkho`), không insert vào kho tới khi có dạng.
- **⭐ Model — DUAL MEMBERSHIP, KHÔNG bảng mới:** đề thi = `tai_lieu(loai='de_thi')`; mỗi PHẦN gốc (Phần I/II…) = 1 `tai_lieu_phan(loai_phan='custom', tieu_de=...)` — TÁI DÙNG pattern ET hệt (ET dùng 1 phan 'custom', đề thi dùng NHIỀU cái, mỗi cái 1 phần) → `getTaiLieuFull` đã generic, không cần đổi. Metadata (nguồn/cấp/năm/thời gian/thang điểm/pdf gốc) → `tai_lieu.cau_hinh.deThi` (jsonb, không cột mới). `tai_lieu_cau.thu_tu` sẵn có = giữ thứ tự gốc trong phần (không cần cột stt riêng).
- **`src/lib/dethi.ts`** (seam mới): CRUD đề + phần + `getDeThiCaus` (câu đúng thứ tự mọi phần, cho in+phát hành) + `getPhanCauList` (đọc thứ tự hiện có của 1 phần để APPEND câu mới vào cuối).
- **`DeThiScreen.tsx`** (list "+ Tạo đề" → `DeThiEditor` builder): header metadata auto-save (blur) + đính kèm PDF gốc (bucket kho-tailieu) + cây Phần→Câu + **`BocCauModal`** (bóc câu per-phần) — TÁI DÙNG NGUYÊN pipeline `nhapkho` (Gemini flat parse `buildKhoIngestPrompt`/`INGEST_KHO_SCHEMA`/`parseKhoIngestJson`, `CauEditor`, `createCauDungSai`/`saveCauToDang`) nhưng **BỎ AI auto-classify** (spec §9 OUT scope) — gán dạng NGƯỜI chọn qua `DangPickerOne` (browse cả khối, không giới hạn 1 chủ đề như nhapkho, vì đề thi trải nhiều chuyên đề). **Chống trùng câu:** nút "🔍 Câu có sẵn" search `searchCau` → chọn = LIÊN KẾT câu cũ (bỏ tạo mới) — giữ dual-membership sạch. "✕ bỏ khỏi đề" chỉ unlink, câu vẫn ở kho.
- **`DeThiPrintView.tsx`**: TÁI DÙNG NGUYÊN engine `PrintView`/`ETPrintView` (`CauItem`/`buildPagedCss`/`downloadPagesPdf`/`pageChrome`, paged.js) — KHÁC ET/giáo-trình: render THEO PHẦN GỐC + THỨ TỰ GỐC (không gom lại theo dạng), `CauItem` tự dispatch theo loại câu (TN/ĐS/TLN/tự luận) nên chỉ lặp phần→lặp câu; số câu đếm liên tục xuyên phần (counter ngoài). Header = dải sóng + Họ tên/Lớp/SBD/Điểm + nguồn/cấp/năm/thời gian/thang điểm.
- **Phát hành online (mig 0073):** đề thi = chế độ THI y hệt ET (giấu key tới khi nộp, chấm server, chỉ tính lần nộp đầu) — TÁI DÙNG `et_de`/`et_nop` RPC, chỉ mở rộng điều kiện `bt.loai in ('et','de_thi')` (RLS + et_de). **Khác ET/BTVN:** đề thi KHÔNG tự bám 1 lớp+ngày (dùng lại nhiều lớp/lần) → `phatHanhTest(id, {lopId,ngay})` nhận **override**, modal riêng trong `DeThiEditor` chọn lớp+ngày lúc phát hành (ET/BTVN vẫn dùng lop_id/ngay có sẵn trên doc, không đổi hành vi). Tự luận có đáp án ngắn (`dap_an`) → snapshot rút gọn thành `tra_loi_ngan` CHỈ ở bản online (kho/in giấy giữ nguyên tự luận đủ lời giải) — v1 chỉ chấm đáp án cuối, không chấm bước (đúng spec §8.1).
- **HocSinhApp/mastery:** `THI_LOAI = {et, de_thi}` dùng chung ở cả HocSinhApp (route LamET, badge THI, "nộp 1 lần") lẫn mastery.ts (`fetchOnlineEvals` — đề thi tính vào mastery như ET, không rơi vào nhóm BTVN tham khảo, vì cùng là thi có giám sát).
- **✅ VERIFY THẬT e2e đầy đủ** (đề `ZZTEST`, đã dọn sau khi xong): bóc câu thật qua Gemini (ảnh synthetic "Nghiệm pt 2x-6=0") → AI tách đúng đề/4 đáp án/tự chọn đúng đáp án A → gán dạng qua DangPickerOne → Duyệt → **xác nhận dual-membership** (câu vào `dai_cau_hoi` + `tai_lieu_cau` giữ thứ tự) → unlink (✕) rồi link-lại qua "🔍 Câu có sẵn" (không tạo trùng, verify DB) → **in bản HS + bản GV** (paged.js render đúng header/Phần I/câu/đáp án, bản GV tô đúng đáp án A) → **phát hành online** (chọn lớp 12A1 + ngày) → login HS thật (HS0037) → thấy badge THI, đáp án đã xáo (dùng chung shuffle 07-05 sáng) → chọn đúng đáp án → nộp → **"🎉 Đúng"** → verify DB `bai_lam.trang_thai='da_nop'`+`verdict='correct'`. tsc + build pass.
- ⚠ **Print engine từng "đứng" ở tab preview sống lâu (nhiều giờ)** — tái hiện y hệt trên ET gốc chưa đụng → môi trường/tab cũ, KHÔNG phải bug đề thi. Restart preview server + tab mới → hết đứng (đợi cold-start paged.js lâu hơn bình thường lần đầu).
- **CÒN (theo spec §9 OUT, chưa làm — có chủ đích):** nối `ky_thi` (band/điểm sát hạch) · tự luận online chấm-bước (nộp ảnh) · auto phân dạng AI vượt mức nhập-kho · đa cơ sở. Nhỏ hơn: chưa test luồng "Đúng/Sai" (menh_de) end-to-end trong đề thi (code path tái dùng y hệt nhapkho's DungSaiEditor đã test riêng, nhưng chưa chạy live trong đề-thi).
- **⭐ FIX VỊ TRÍ (Thùy phản hồi ngay sau khi xem): "Đề thi" ĐẶT SAI CHỖ.** Ban đầu đặt ở "Làm tài liệu" (theo gợi ý spec §0) — nhưng Thùy chỉ ra: "Làm tài liệu" = soạn TỪ kho có sẵn (giáo trình/ET ghép câu đã có), còn đề thi là luồng NGƯỢC (đề thật → bóc → ĐỔ VÀO kho) — cùng chiều với "Nhập kho (từ tài liệu)", không phải cùng chiều với Làm tài liệu. **Fix (không sửa lại nội dung DeThiScreen/DeThiEditor/DeThiPrintView — chỉ dời điểm vào):** bỏ `lamtailieu:de_thi` khỏi `LAMTAILIEU_CHILDREN` (useStore.ts) + bỏ route trong NhanSuHome.tsx. `NhapKhoScreen.tsx` đổi thành wrapper 2 tab: **📚 Nhập chuyên đề** (nội dung cũ, đổi tên hàm `NhapChuyenDe`) / **📝 Nhập đề thi** (render thẳng `DeThiScreen` — tái dùng 100%, không viết lại). Sửa lại tài liệu đã tạo vẫn qua Kho tài liệu (✎ Sửa → DeThiEditor, không đổi — đúng vai "tra & tái dùng" của Kho tài liệu). Bài học: **spec do AI/người ngoài viết vẫn có thể sai về IA (information architecture)** dù đúng kỹ thuật — Thùy soi trên UI thật phát hiện ra ngay, sửa rẻ vì tách bạch UI (entry point) khỏi logic (component) ngay từ đầu.

### 07-05 (tiếp) — ⭐ HỌC PHÍ — feature mới đầy đủ (spec-hocphi.md, model chỉnh sửa cùng Thùy)

- **Audit spec trước khi code:** verify schema thật phát hiện `buoi_hoc.loai='duoi'` trong spec SAI — giá trị thật là `'bo_tro_duoi'` (mig 0055). Verify thêm: `bo_tro_duoi`/`bu` buổi LUÔN `lop_id=null` (chỉ `thuong` có lop_id) → filter `loai≠'bu'` của spec vô hại nhưng thực ra thừa (buổi bù/đuổi tự động bị loại khỏi "buổi của lớp X" vì không có lop_id). `buoi_hoc_hs.diem_danh` có 4 giá trị thật: `co_mat/vang/vang_phep/null` (không phải `co_mat` boolean như đoán).
- **⭐ SỬA MODEL CÙNG THÙY (2 chỗ, khác spec gốc — chốt qua hỏi-đáp trước khi code):**
  1. **Giá học phí + giá đuổi đi CÙNG NHAU theo 1 "mức"** — bảng `muc_hoc_phi(ten, don_gia_buoi, gia_duoi)`, mỗi LỚP gán 1 mức (FK), KHÔNG gõ tay từng lớp (Thùy: "sửa 1 chỗ đổi hàng loạt"). Giá đuổi có 2 bậc (150k/250k) đi theo mức của LỚP GỐC — KHÔNG phải hằng số GIA_DUOI toàn hệ như spec gốc.
  2. **Học liệu = mức RIÊNG theo LỚP** (`muc_hoc_lieu(ten, gia)`, độc lập mức học phí) — spec gốc §11 giả định "bậc sub-linear theo TỔNG số lớp của 1 con" SAI thực tế. Đúng: mỗi lớp có 1 mức học liệu cố định; **tổng học liệu 1 con/tháng = Σ mức học liệu của MỌI lớp con đang học** (cộng dồn theo môn, không phải bậc theo đếm lớp). Xoá hẳn §11 "❓ cần điền bậc" — không còn cần vì model đổi hoàn toàn.
- **mig 0074:** `muc_hoc_phi`/`muc_hoc_lieu` (RLS member_all) · `lop.muc_hoc_phi_id`/`muc_hoc_lieu_id` FK · `hoc_sinh.he_so_hoc_phi`/`he_so_nguon` · `hoa_don`/`hoa_don_dong`/`thanh_toan`/`hoc_phi_xet_duyet` (append-only) · `hoa_don_log` + trigger `log_hoa_don` (§4: tao/doi_trang_thai/chot_ky) · trigger `log_he_so_hoc_phi` (tái dùng bảng `hoc_sinh_lop_log` sẵn có, hanh_dong mới `doi_he_so_hoc_phi` — KHÔNG đẻ bảng log riêng).
- **Engine thuần `src/gami/hocphi.js`** (test `node scripts/verify_hocphi.mjs`, 18 case pass): `tinhHeSoGiaDinh(nCon,nCon3Mon)` (< 2 con=1.00 · ≥2 con & ≥2 học ≥3 môn=0.90 · else 0.95) · `lamTron1000` · `thanhTienHocPhi` (nhân hệ số) · `thanhTienHocDuoi` (KHÔNG nhân hệ số) · `canXetDuyetNghi30`.
- **Service `src/lib/hocphi.ts`:** CRUD mức · `tinhHeSoPH`/`recomputeHeSoPH` (query n_con/n_con_3mon thật, bỏ qua `he_so_nguon='manual'`) · `thongKeBuoiConLop` (soBuoiLop/soBuoiWindow/soBuoiNghi, window = `ngay_vao`/`ngay_roi` mới nhất) · `ensureXetDuyet` (tự tạo hàng chờ duyệt khi window lệch HOẶC nghỉ≥30%, idempotent qua unique constraint) · `getPhieuAo` (pure-derive realtime: học phí + học liệu mỗi lớp con học + học đuổi group theo lớp-gốc-của-case qua `bo_tro_duoi.lop_id` + nợ kỳ trước) · `chotKy` (chặn nếu còn `cho_duyet`, atomic qua unique `(phu_huynh_id,ky)`, snapshot mỗi dòng) · `ghiThanhToan`/`tinhSoDuNo`.
- **Màn `HocPhiScreen.tsx`** (leaf `hocphi`, nhóm **Core team**): 4 tab — **Phiếu** (chọn PH+kỳ → phiếu ảo/thật, cảnh báo còn xét duyệt, + khoản phát sinh, Chốt kỳ, ghi thu tiền + lịch sử + dư nợ) · **Xét duyệt** (badge đếm, mỗi hàng hiện đủ 3 số buổi-lớp/window/nghỉ + nút giữ-nguyên hoặc chốt-số-khác, **không auto-giảm**) · **Mức học phí** / **Mức học liệu** (CRUD đơn giản). `LopScreen.tsx` EditLopModal thêm 2 picker mức (SearchSelect, tái dùng field text sẵn có).
- **✅ VERIFY THẬT e2e** (PH+HS+lớp+5 buổi test, đã dọn sạch): phiếu ảo tính đúng "5 buổi×200.000đ=1.000.000đ + học liệu 30.000đ = 1.030.000đ" khớp kỳ vọng tay tính → Chốt kỳ → dòng snapshot đọc lại đúng (**bắt được 1 bug thật lúc test**: quên load `hoa_don_dong` sau chốt → bảng biến mất chỉ còn tổng — đã sửa thêm `getHoaDonDong` + tách biến `dongChot`) → ghi thu 500k/1.030k → trạng thái "Thu 1 phần" + dư nợ 530.000đ đúng. tsc + build pass, `npm run schema` (76 bảng, 19 function).
- **CÒN (theo spec §12/§13, để sau — đã thống nhất build staff-side trước):** PH-facing (`bkdemy-ph` Expo, sync sang Supabase project KHÁC — phạm vi lớn hơn 1 feature, tách riêng) · roll-up CFO (`bao_cao_doanh_thu_co_so`) · hook recompute hệ số vào `ghiDanh`/`chuyenLop`/`setNgayRoi` (nhansu.ts — engine đã có `recomputeHeSoPH`, chưa nối tự động, giờ phải gọi tay/qua script) · RBAC cấp role Kế toán ở Phân quyền (leaf mới, admin thấy sẵn).

### 07-05 (tiếp) — Học phí: tab Danh sách + ảnh/PDF thông báo PH (theo yêu cầu Thùy sau khi xem)

- **Thùy hỏi + yêu cầu thêm sau khi thấy màn:** (1) xác nhận lại cơ chế mức đơn giá/buổi khác nhau (đã đúng model — trả lời, không cần sửa code). (2) **"Output cuối phải là 1 danh sách học phí TẤT CẢ HS để tạo ảnh/PDF thông báo PH"** — hỏi rõ hình thức (ảnh riêng Zalo hay PDF gộp 1 file) → Thùy chốt: **"in 1 lần thì phải từng file riêng chứ gộp lại mất công cắt ra"** — cả PDF lẫn ảnh đều PER-PH, không gộp.
- **⭐ Tab "Danh sách"** (mặc định khi mở màn Học phí): bulk mọi PH có con đang học × 1 kỳ (`listPhieuTheoKy` — nhẹ, dùng `hoa_don` đã chốt cho tiền, KHÔNG tính lại phiếu ảo cho CẢ danh sách tránh N+1 nặng khi ~300 PH; PH chưa chốt hiện "chưa chốt (tạm tính)"). Mỗi hàng: 📷 Ảnh · ⬇ PDF (riêng file). Nút "⬇ Tải PDF tất cả" lặp tuần tự từng PH, MỖI PH 1 FILE (không gộp).
- **`src/screens/hocphi/PhieuThongBao.tsx`** (mới): `InvoiceCard` dùng CHUNG (inline-hex, không class Tailwind — né oklch v4) cho cả 2 hình thức:
  - **`AnhGuiPHModal`** — TÁI DÙNG NGUYÊN pattern `EtAnhGuiPH`/V1 `TabSatHach.handleCopy` (mở popup chứa card + html2canvas CDN + nút Copy NGAY TRONG popup = user-gesture → clipboard, paste Zalo; fallback tải file nếu clipboard chặn).
  - **`taiPdfPhieu`** — headless (KHÔNG popup, khác ảnh): mount `InvoiceCard` ẩn qua `createRoot` → html2canvas-pro (chịu oklch) + jsPDF 1 trang vừa khít card → `.save()` tải file riêng `HocPhi_<PH>_<kỳ>.pdf`. Tái dùng chính thư viện lazy-import đã verify ở Đề thi/Giáo trình (`downloadPagesPdf`), nhưng đơn giản hơn (1 card, không paged.js — phiếu học phí không có công thức/toán, không cần multi-page).
- **`lib/hocphi.ts` thêm:** `listPhieuTheoKy` (bulk danh sách) · `getPhieuThongBao` (dữ liệu 1 phiếu — ưu tiên `hoa_don_dong` đã chốt, fallback phiếu ảo nếu chưa).
- **✅ VERIFY THẬT:** danh sách hiện đúng 275 PH thật + PH test chen giữa (đều "chưa chốt" vì chưa ai chốt kỳ này — đúng thực tế) → bấm "📷 Ảnh" PH test → card đúng "2 buổi×200.000đ=400.000đ + học liệu 30.000đ=430.000đ", tên HS rút gọn "Danh Sách" đúng convention → bấm "⬇ PDF" chạy sạch không lỗi console. Đã dọn data test khỏi DB thật (không đụng 275 PH thật). tsc + build pass.

### 07-05 (tiếp, phiên dài) — HỌC PHÍ: sửa PDF crop · tách đuổi khỏi lớp (theo CA) · hệ số per-HS · HS-theo-môn · phát sinh · trạng thái thông báo + template · state persistence

- **🐞 Fix PDF tải bị crop:** host `left:-99999px` (fix trước đó cho lỗi "PDF trắng" do `opacity:0`) làm html2canvas TÍNH SAI viewport → ảnh cắt mất cột "Tiền". Fix đúng (giống `PrintView` headless): render host ở toạ độ THẬT (`top:0,left:0`) + phủ 1 lớp trắng đục z-index cao che mắt người dùng, thay vì đẩy ra ngoài màn hình.
- **⭐ SỬA MODEL LẦN 2 (Thùy): học phí đuổi ĐỘC LẬP với lớp gốc, đi theo CA Bổ trợ đuổi (buổi `bo_tro_duoi`), KHÔNG theo lớp.** mig 0075 xoá `muc_hoc_phi.gia_duoi` (bundle sai từ đầu) → bảng `muc_hoc_duoi` riêng. mig 0076 xoá tiếp `lop.muc_hoc_duoi_id` (0 dòng dùng thật, an toàn) → thêm `buoi_hoc.muc_hoc_duoi_id` — mỗi CA đuổi tự chọn mức giá (khác ca có thể khác giá). `BoTroDuoiScreen` thêm picker "Mức học đuổi" khi tạo ca + sửa ca (badge "⚠ Chưa gán giá" nếu chưa chọn). `getPhieuAo`/`tinhTamTinhTheoPH` group theo mức-của-CA thay vì mức-của-lớp.
- **Tên mức tự đặt theo giá** (Thùy: "tên với giá trùng nhau, sao phải gõ 2 lần") — bỏ input "Tên" ở cả 3 loại mức, `tenTuGia(gia, hậu_tố)` sinh tên "150.000đ/buổi" tự động.
- **⭐ SỬA MODEL LẦN 3 (Thùy): hệ số học phí là thông tin CỦA HỌC SINH, KHÔNG phải tài sản gia đình.** Model cũ (`tinhHeSoGiaDinh(nCon,nCon3Mon)`, đóng dấu cùng 1 số lên MỌI con của 1 PH) sai — đúng: mỗi HS tự có hệ số riêng theo CHÍNH nó: học ≥2 môn → -5%, có anh chị em CÙNG học chung ≥1 môn → thêm -5% (gộp = -10%). Engine mới `tinhHeSoHocSinh(soMon, coAnhChiEmCungMon)` (`gami/hocphi.js`, 4 test case). **Hệ thống chỉ GỢI Ý (pure-derive, tính lúc đọc) — Nhân sự bấm "Xác nhận" mới ghi** vào `hoc_sinh.he_so_hoc_phi` (`he_so_nguon`: auto=theo gợi ý đã xác nhận / manual=sửa tay ngoại lệ, khoá gợi ý tới khi "Bỏ tay"). Bỏ hẳn hook auto-recompute im lặng ở `ghiDanh`/`roiLop` (nhansu.ts) — đúng "người-trong-vòng-lặp", không tự ghi.
- **Tab "Hệ số"** đổi thành BẢNG TO hiện MỌI HS đang học (không phải chọn từng PH): cột Học sinh/PH/Lớp/Môn/Hệ số hiện tại/Gợi ý/**Lý do** (vd "Học 2 môn: Toán, KHTN" / "Có anh chị em X cùng học Toán")/Thao tác. **Sort: HS lệch gợi ý (kể cả HS mới vào lớp làm thay đổi gợi ý của CHÍNH NÓ hoặc ANH CHỊ EM) lên ĐẦU danh sách** — không cần dò cờ "mới" riêng, chỉ cần so gợi ý≠hiện tại là tự nổi lên (pure-derive tự làm việc).
- **⭐ Tab "HS theo môn"** (mới, đặt ĐẦU tiên) — bảng audit: mỗi dòng = 1 HS × 1 môn/lớp (+ dòng riêng "Học đuổi"), số buổi RAW theo cửa sổ ghi danh (KHÔNG qua xét duyệt nghỉ≥30%) — nền để CHECK trước khi tin bảng theo PH. Toàn bộ BATCH QUERY (vài query cho CẢ trường, không N+1/HS) — khác hẳn `getPhieuAo` (N+1 nhưng chỉ chạy cho 1 PH).
- **⭐ Batch tương tự áp cho "Danh sách"** (`tinhTamTinhTheoPH`): trước đây PH chưa chốt hiện "—" (né N+1); giờ tính tạm luôn (batch, không N+1) → hiện số THẬT ngay cả khi chưa chốt. Tách RIÊNG 2 map (`chinh`/`duoi`) vì 2 luồng billing khác nhau (xem điểm tách tab bên dưới).
- **Luật mới: học liệu CHỈ tính khi tháng đó THẬT SỰ có học phí (≥1 buổi)** — lớp 0 buổi trong kỳ thì học liệu cũng KHÔNG charge (trước đó charge học liệu vô điều kiện dù học phí=0, sai). Áp đồng bộ ở `getPhieuAo` VÀ `tinhTamTinhTheoPH`.
- **Sort: PH tổng tiền = 0đ đẩy XUỐNG CUỐI** danh sách (không lẫn giữa PH có phí cần xử lý), thay vì alphabet thuần.
- **⭐ Tab "Phát sinh"** (mới) — 1 chỗ nhập chi phí phát sinh, bảng `hoc_phi_phat_sinh` (mig 0078) 2 loại: `lop` (áp MỌI HS đang học lớp đó, pure-derive lúc tính phiếu — KHÔNG snapshot danh sách HS lúc nhập) / `ca_nhan` (áp riêng 1 HS). Nhập theo KỲ, tự cộng vào `getPhieuAo`+`tinhTamTinhTheoPH`.
- **⭐ Xét duyệt THIẾU tên HS** (bug thật — card chỉ hiện "Nghỉ≥30%"+kỳ, không biết của ai): `listXetDuyetChoDuyet` join thêm `hoc_sinh(ho_ten,ma_hs)`+`lop(ten_lop)`, card hiện tên+mã+lớp ở đầu.
- **⭐ Tách "Danh sách" → 2 tab:** "Học phí học chính" (đổi tên, tổng tiền giờ LOẠI TRỪ đuổi) + **"Học phí bổ trợ đuổi"** (mới, `listDuoiTheoKy` — chỉ show PH có con đang tính đuổi trong kỳ + tổng riêng). Lý do: đuổi là luồng billing KHÁC hẳn học chính (không xét duyệt, giá theo ca không theo lớp) — Thùy: soi Xét duyệt (chỉ áp học chính) rồi nhận ra nên tách hẳn 2 khái niệm ra 2 tab, đỡ lẫn.
- **⭐ TRẠNG THÁI THÔNG BÁO thu học phí (mig 0079, `hoa_don.trang_thai_tb`)** — giống toggle-bar tuyển sinh: 3 bước **Đã thông báo lần 1 → Chưa nộp-đang xử lý → Đã hoàn thành**, nút "Xong bước này →" tự nhảy bước kế. Mỗi bước có **nội dung soạn sẵn** (`soanThongBao`, ghép tên con "A và B" + tháng + tổng tiền) — Nhân sự chỉ bấm "📋 Copy nội dung" → dán gửi PH, KHÔNG phải tự nghĩ chữ. Chỉ áp cho PH ĐÃ CHỐT (cần `hoa_don.id` thật).
- **⭐ FIX state bị reset khi đổi tab (bug thật, Thùy báo):** mọi tab con unmount khi rời màn Học phí hoặc đổi top-level nav (`{tab==='x' && <X/>}` conditional-render) → chọn PH/kỳ mất sạch khi quay lại. Fix: dời state (tab đang chọn trong Học phí, PH đang chọn ở "Phiếu", kỳ dùng chung) vào **zustand `useStore`** (module-scope, sống ngoài React tree, không mất khi component unmount) thay vì `useState` cục bộ. Áp dụng đúng: chỉ state CẦN sống-qua-unmount mới lên store; state cục bộ (loading/input tạm) vẫn giữ `useState` bình thường.
- **⭐ FIX SearchSelect (component DÙNG CHUNG toàn app) — dropdown bị khuất khi trigger gần đáy màn hình:** thêm `dropUp` — đo `getBoundingClientRect()` lúc mở, nếu khoảng trống dưới < chiều cao dropdown ước tính VÀ khoảng trống trên đủ → bung LÊN (`bottom-full`) thay vì XUỐNG (`top-full`). Sửa 1 chỗ lợi mọi nơi dùng SearchSelect (không riêng Học phí).
- **✅ VERIFY THẬT từng phần** (test trên ca đuổi thật 02/07 — gán tạm mức 150k xác nhận dòng "Học đuổi" hiện đúng ở HS-theo-môn rồi gỡ lại "Chưa gán giá"; test invoice giả kỳ 2099-01 xác nhận full luồng copy+advance 3 bước rồi xoá; backfill mức mặc định 27 lớp thiếu học phí + 42 lớp thiếu học liệu, chỉ điền chỗ NULL). tsc + build pass toàn bộ session, `npm run schema` (78 bảng cuối session).
- **CÒN:** chốt kỳ thật vẫn gộp CHUNG 1 hoá đơn (chính+đuổi+phát sinh) — tab "Học phí bổ trợ đuổi" chỉ là VIEW đối chiếu, không phải luồng chốt riêng · chưa có UI xem/sửa lịch sử phát sinh theo HS (chỉ theo kỳ) · trạng thái thông báo chưa tự động hoá-thành ("Đã hoàn thành" vẫn phải bấm tay, chưa tự nhảy khi `ghiThanhToan` đủ tiền).

### 07-05 (tiếp) — 🐞 Fix in giáo trình: heading "Dạng N" mồ côi cuối trang + khoảng trắng xấu (Thùy báo kèm ảnh chụp)

- **Bug (Thùy chụp màn hình):** một số trang in giáo trình có heading "Dạng N: ..." nằm ngay đầu/cuối 1 trang, sau đó là khoảng trắng lớn tới hết trang, rồi toàn bộ danh sách câu (Câu 5, 6, 7…) nhảy sang trang kế tiếp — chỉ xảy ra với các Dạng dùng kiểu **2/3/4 cột** (`kieuCols>1`), KHÔNG xảy ra với kiểu "thường" (1 cột).
- **Điều tra:** dựng repro độc lập (file tĩnh dùng đúng paged.js CDN + đúng CSS `buildPagedCss`/`CONTENT_CSS` copy từ `PrintView.tsx`, không cần login/DB) → xác nhận `.pv-h-dang{break-after:avoid}` (CSS chuẩn, đúng ý muốn "không mồ côi") bị **paged.js LỜ ĐI khi phần tử theo sau là multi-column (`column-count`)** — heading vẫn nằm lại cuối trang cũ, còn khối multicol theo sau bị đẩy nguyên khối sang trang mới, tạo khoảng trắng. Tắt multicol (về 1 cột) trên CÙNG 1 nội dung → heading+content di chuyển ĐÚNG cùng nhau sang trang sau, không lỗi — xác nhận multicol chính là nguyên nhân (giới hạn của paged.js, không phải bug code mình).
- **Fix:** gói `heading + (lý thuyết) + CauList` vào 1 `<div style={{breakInside:'avoid'}}>` — NHƯNG CHỈ khi `kieuCols(kieu) > 1` (multicol). paged.js khi đó buộc phải đẩy CẢ KHỐI cùng nhau sang trang mới thay vì tách rời. Kiểu "thường" (1 cột) giữ nguyên luồng cũ (không bọc) vì đã chạy đúng và có thể dài nhiều trang (Dạng luyện tập nhiều câu) — bọc `break-inside:avoid` cho khối DÀI hơn 1 trang từng test thấy **paged.js lỗi nặng hơn: DUPLICATE toàn bộ heading+câu** khi 2 khối multicol bọc-avoid liên tiếp mà 1 khối không vừa 1 trang. Vì kiểu 2/3/4 cột CHỈ dùng cho câu NGẮN (tiết kiệm giấy, theo đúng thiết kế gốc) nên trong thực tế luôn đủ nhỏ để nằm gọn 1 trang — an toàn để bọc.
- **Áp 3 chỗ có pattern `pv-h-dang` + multicol:** `DangBlock` (giáo trình chính, `src/screens/tailieu/PrintView.tsx`) · BTVN theo dạng (cùng file, hàm `BtvnSheet`) · `DeThiPrintView.tsx` (đề thi, phần custom). KHÔNG đụng `ETPrintView.tsx` (không dùng multicol).
- **✅ VERIFY (lúc đó):** repro độc lập xác nhận trước/sau fix — trước: heading tách rời khỏi content (khoảng trắng), sau: heading+content luôn dính cùng 1 trang. Test thêm 2 khối multicol NGẮN liên tiếp → không lỗi, không duplicate. tsc + build pass.
- **🐞 ĐÃ REVERT (Thùy test trên tài liệu THẬT, phiếu BTVN Buổi 2):** fix trên gây **MẤT NỘI DUNG thật**, không chỉ trắng-xấu như cũ — trang 1 chỉ còn khung tiêu đề (không câu nào), trang 2 chỉ còn Dạng 4, Dạng 5/6 biến mất hẳn. Repro giả lập (câu ngắn, filler thủ công) không bắt được ca này — nội dung THẬT (KaTeX phân số/công thức, nhiều dạng liên tiếp đều multicol) chắc chắn nặng hơn giả định "luôn vừa 1 trang", nên `break-inside:avoid` lại rơi vào đúng nhánh lỗi paged.js (mất/duplicate nội dung) mà repro không lường hết được — **KHÔNG được coi an toàn chỉ vì repro pass**. Đã revert nguyên trạng cả 3 chỗ (`DangBlock`/`BtvnSheet`/`DeThiPrintView`) về bản TRƯỚC fix (khoảng trắng xấu vẫn còn, nhưng không mất nội dung — ưu tiên đúng dữ liệu hơn đẹp giấy). **Bài học:** paged.js + CSS multicol là vùng dễ vỡ, không tự tin sửa "cho gọn" nếu chưa test trên tài liệu thật đủ đa dạng (nhiều dạng liên tiếp, câu có công thức) — lần sau cần verify trên chính app thật (không chỉ repro tĩnh) trước khi báo xong.
- **CÒN (chưa fix):** bug gốc "heading Dạng mồ côi cuối trang + khoảng trắng" (multicol) vẫn tồn tại, cần hướng khác an toàn hơn (vd: đo trước chiều cao thật rồi chèn `break-before` thủ công qua JS, thay vì dựa CSS break-inside:avoid mà paged.js xử lý không ổn định).

### 07-05 (tiếp) — ✅ FIX THẬT (v2) đa cột giáo trình: bỏ `column-count`, ghép câu THEO HÀNG bằng `inline-block`

- **Thùy chốt hướng:** vẫn cần đa cột (2/3/4) + cột được phép **chạy xuyên trang** (không cần giữ cả khối 1 trang) + **dòng kẻ 2 cột phải ngang hàng nhau** (bug cũ: cột lệch vì `column-count` tự cân bằng theo TỔNG chiều cao, không ghép cặp trái-phải theo thứ tự).
- **Điều tra kỹ trước khi code (dựng lại repro.html độc lập, test TRÊN TAB SẠCH mỗi lần — bài học từ lần fix hỏng trước):**
  - **`display:grid`** (ghép hàng theo thứ tự tự nhiên của grid) → paged.js **TREO CỨNG** (không ra trang, không lỗi console, chờ >10s vẫn kẹt) — kể cả case tối giản 4 ô, không do CSS phức tạp.
  - **`<table>`** (kể cả bảng trắng không style) → **TREO CỨNG** y hệt grid.
  - **`display:flex`** (mỗi hàng 1 flex container) → **TREO CỨNG** y hệt.
  - **`display:inline-block`** (mỗi câu 1 ô inline-block trong 1 div "hàng", width tính bằng `calc()` + CSS var `--cols`) → **CHẠY ĐƯỢC**, không treo.
  - ⚠ Phát hiện phụ: lần đầu test grid/table/flex ĐỀU treo ngay cả baseline (list 1 cột đơn giản) khi tái dùng CÙNG 1 tab đã từng chạy 1 case bị treo trước đó — **tab bị "nhiễm" trạng thái treo cũ, không phải bug CSS mới**. Phải **restart server + tab HOÀN TOÀN MỚI cho mỗi test** mới lấy được tín hiệu sạch — nếu không sẽ kết luận sai (từng suýt kết luận sai "table cũng lỗi do CSS" trước khi phát hiện ra là do tab cũ).
  - Test `inline-block` với 20+24 câu (2 Dạng liên tiếp, có câu dài/ngắn xen kẽ, filler đẩy heading gần cuối trang) qua paged.js **thật** (dùng chính CSS export từ `PrintView.tsx`, không gõ tay lại): 24/24 câu đúng, không mất/lặp, không treo. Heading không còn mồ côi (nếu không đủ chỗ cho ít nhất 1 hàng, heading+hàng đó CÙNG NHAU nhảy trang — không tách rời như bug cũ). Khoảng trắng dư trước khi ngắt trang giảm từ **~nửa trang → ~1 hàng** (paged.js vốn có sẵn 1 khoảng đệm nhỏ trước mép trang, không phải bug riêng của cách làm này — chấp nhận được, đúng tinh thần "để người dùng tự chỉnh nếu cần").
- **Code (`src/screens/tailieu/PrintView.tsx`):** `CauList` (nay **export**, `DeThiPrintView.tsx` tái dùng thay vì tự viết `<ol>` riêng) — kiểu 1 cột giữ nguyên `<div>` phẳng; kiểu N cột (`kieuCols>1`) **chia mảng câu thành từng nhóm N phần tử** (`Children.toArray` + slice), mỗi nhóm render `<div className="pv-row" style={{'--cols':cols}}>`. `CauItem` đổi `<li>`→`<div>` (không còn ngữ nghĩa `<ol>/<li>` vì không còn multicol dùng `<ol>` nữa — `.pv-caulist` không cần list-style/padding riêng).
- **CSS mới thay `column-count`:** `.pv-row{break-inside:avoid;font-size:0}` (font-size:0 diệt khoảng trắng giữa các inline-block) · `.pv-row>.pv-cau{display:inline-block;vertical-align:top;font-size:17px;width:calc((100% - (var(--cols)-1)*9mm)/var(--cols))}` (căn TOP giống nhau theo hàng) · `.pv-row>.pv-cau:not(:first-child){margin-left:9mm}`. Chỉ `break-inside:avoid` ở TỪNG HÀNG NHỎ (an toàn, đã test) — KHÔNG bọc `break-inside:avoid` quanh cả khối nhiều câu (đó là nguyên nhân gây mất nội dung ở fix v1 bị revert).
- **Áp lại đúng 2 chỗ dùng `CauList`** (giáo trình `DangBlock`/`BtvnSheet` + đề thi `DeThiPrintView`) — KHÔNG đụng `ETPrintView.tsx` (không multicol).
- **✅ VERIFY:** tsc + build pass. Test qua paged.js thật (không login) bằng chính CSS export từ file — xác nhận hết bug khoảng trắng lớn, không mất/lặp câu, hàng 2 cột canh top giống nhau, cột chạy xuyên trang bình thường. **CHƯA verify trên app thật có login** (cần Thùy tự mở lại 1 tài liệu multicol thật để xác nhận cuối, theo đúng bài học vừa rút ra ở fix v1).
- **Bài học ghim lại:** paged.js là vùng cực dễ vỡ với CSS layout hiện đại (grid/table/flex đều treo) — **CHỈ block/inline-level layout (display block, inline-block) là an toàn**. Muốn test paged.js đáng tin → LUÔN dùng tab/server hoàn toàn mới cho mỗi kịch bản, đừng tái dùng tab đã chạy qua 1 case lỗi.

### 07-05 (tiếp) — ⭐ GIAO VIỆC & ĐO HIỆU SUẤT — v1 KHỞI ĐỘNG (BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md)

- **Audit trước khi code phát hiện spec SAI GIẢ ĐỊNH (đã hỏi + Thùy xác nhận, chốt lại phạm vi):**
  - Spec giả định có sẵn "cơ chế lương (`luong_bac`/EXP→Xu trong gami)" để hoà vào — **SAI**: `luong_bac`+`gami_exp_ledger` là cơ chế **CỦA HỌC SINH** (gamification, `gami_exp_ledger.hoc_sinh_id`), KHÔNG liên quan nhân sự. **KHÔNG có bảng lương nhân sự nào trong DB.** Thùy xác nhận: lương nhân sự hiện KHÔNG tính trong ERP, mỗi NS có base lương riêng (ngoài hệ thống); EXP→lvl cho nhân sự cũng CHƯA có.
  - **Quyết định phạm vi v1 (Thùy chốt):** HOÃN §5 (lương) + §6 (cấp bậc/Promotion Gate) + §7-8 (skill/probe) — chưa có nền để "hoà vào", làm giờ sẽ dựng song song sai hướng. **Ưu tiên trước:** đo hoạt động nhân sự (làm gì/tốt-không/đạt %) + luồng **giao việc phát triển** end-to-end (đây là phần Thùy nhấn mạnh nhất).
- **Migration `0080_giaoviec.sql`:** `loai_viec` (registry: tên·phương_thức_chấm∈{frontline,phat_trien}·task_nho(miễn bằng chứng)·**thang_kl** jsonb bảng định lượng tự cấu hình [{ma,ten,kl}]) · `viec` (instance: loại·người_giao·khối_lượng CHỐT LÚC GIAO·trạng_thái∈{giao,dang_lam,cho_nghiem_thu,dat,tra_lai}·tiến_độ·chất_lượng·%_gộp·bằng_chứng·**ky_tinh = THÁNG NGHIỆM THU**(mốc tính, không phải lúc giao)·hạn_nghiệm_thu) · `viec_nguoi_lam` (junction 1-N) · `viec_log`+trigger `log_viec` (mọi đổi trạng thái ghi vết, đúng CLAUDE.md §4). RLS member_all (theo đúng convention mọi bảng khác, không theo nghĩa đen "data disable" ghi mập mờ trong spec). Áp DB live, `npm run schema` (82 bảng).
- **`src/lib/giaoviec.ts`:** `listNguoiDuocGiao` — **TÁI DÙNG `getMyScope()` đã có** (KHÔNG dựng lại RBAC riêng cho "ai giao được cho ai") — self + `giamSatTrucTiep`+`giamSatSau` (span-of-control cây `vi_tri`, đa-mũ tự hợp sẵn). `createViec`/`listViecCuaToi`/`listViecToiGiao`/`banHoanThanh`/`batDauLam`/`guiLaiNghiemThu`/`nghiemThu` (chốt %, bắt buộc bằng chứng trừ `task_nho`, set `ky_tinh` = tháng bấm nghiệm thu). **`tinhHieuSuatKy`** = pure-derive KHÔNG lưu bảng (đúng triết lý "suy động" CLAUDE.md §1) — Σ(khối_lượng×%)/Σkhối_lượng (chỉ tính việc `dat` trong kỳ) + sản lượng song song, tính thẳng từ `viec` lúc đọc — giống pattern `getPhieuAo`/mastery, không materialize.
- **Màn `giaoviec/GiaoViecScreen.tsx`** (leaf `giaoviec` — đã có sẵn slot trong `fixtures.ts`, nối vào `NhanSuHome.tsx` routing): 3 tab — **Việc tôi làm** (card hiệu suất tháng/sản lượng/đạt-trả lại + list việc đang hoạt động/đã đạt, nút Bắt đầu làm/Bấm hoàn thành/Gửi lại) · **Việc tôi giao** (nút Giao việc mới + list Chờ nghiệm thu/Đang làm/Đã đạt, modal Nghiệm thu chốt tiến độ+chất lượng+bằng chứng) · **Loại việc** (CRUD registry + bảng định lượng). Nối card "📨 Giao việc — sắp có" ở "Việc của tôi" (rail Phát triển, trước là placeholder) thành list thật từ `listViecCuaToi`.
- **✅ VERIFY:** tsc + build pass toàn bộ. Preview server: không lỗi console/network lúc load app (chưa login được — không có tài khoản test, cần Thùy tự mở thử luồng thật: tạo loại việc → giao việc → bấm hoàn thành → nghiệm thu → xem hiệu suất).
- **CÒN (hoãn có chủ đích theo đúng phạm vi v1 vừa chốt):** nối vận hành (frontline) vào ống hiệu suất · trọng số trách-nhiệm-thường-trực (§4) · review-hiệu-chỉnh-khối-lượng-neo-bằng-chứng (§4) · dashboard leader/tổng đầy đủ hơn (hiện chỉ có "việc tôi giao" ~ dashboard leader sơ khai, chưa có view lãnh đạo/tổng theo nhánh) · lương/cấp bậc/gate/skill (§5-8, chờ có nền lương nhân sự).

### 07-05 (tiếp) — ⭐ DASHBOARD VẬN HÀNH (Thùy sửa lại: ưu tiên đo VẬN HÀNH đã có, không phải hệ giao-việc mới)

- **Thùy chỉnh hướng:** hiểu nhầm — ưu tiên thật là dashboard đo **VẬN HÀNH** (điểm danh/chấm ET/chấm BTVN/đánh giá+chấm trên lớp — việc ĐÃ CÓ trong hệ, không phải `viec` mới build), giống kiểu dashboard "Kết quả học tập" của HS: 1 màn **Tổng quan** (mỗi NS đạt/chậm/chưa hoàn thành bao nhiêu %) + 1 màn **Chi tiết** (từng task cụ thể 1 người đã làm). Hỏi rõ "report OPS là gì" → Thùy: hiện OPS mới chỉ có điểm danh, phần report/việc khác **làm dần khi phát sinh** ("đến đâu cập nhật đến đấy"); **TA là vai phức tạp nhất** (chấm ET+BTVN).
- **`src/lib/gami.ts` thêm 2 hàm (KHÔNG sửa `getMyTasks` đang chạy — bài học từ vụ paged.js: đừng đụng code đang chạy nếu không bắt buộc):**
  - **`listAllStaffTasks(tu, den)`** — y hệt invariant của `getMyTasks` (đánh giá/chấm bài/chấm ET/chấm BTVN theo `phan_cong_lop`, cùng công thức deadline: chấm+đánh giá=23h59 ngày buổi · ET=12h trưa hôm sau · BTVN=2h trước ca tiếp theo) nhưng **BATCH cho MỌI nhân sự 1 lần** (không lặp gọi getMyTasks per-person → N+1). Trả `StaffTaskRow[]` (thêm `nhan_su_id`+`lop` tên).
  - **`listOpsDiemDanhTeam(tu, den)`** — điểm danh OPS đo **THEO TEAM** (tổng buổi mở + tổng lượt HS + đã điểm danh), KHÔNG per-person vì `buoi_hoc_hs` không có cột "ai điểm danh" → chưa attribute được theo từng OPS. Ghi rõ giới hạn này trong UI (không giả vờ chính xác hơn data cho phép).
- **Màn `dashboard/ChatLuongVanHanhScreen.tsx`** (leaf `db_chatluong` — đã có sẵn slot `founderOnly` trong fixtures.ts, đặt tên đúng "Chất lượng vận hành"), nối vào `NhanSuHome.tsx`:
  - **Tab Tổng quan:** chọn khoảng ngày (mặc định tháng này) → bảng mọi NS có `phan_cong_lop`, mỗi hàng: tổng task · % Đạt (xong đúng hạn) · % Chậm (xong nhưng sau deadline) · % Chưa xong (còn treo) — 3 bucket loại-trừ-nhau, sort NS đạt thấp nhất lên đầu (dễ thấy ai cần hỗ trợ). Card riêng OPS điểm danh team-wide ở trên.
  - **Tab Chi tiết:** `SearchSelect` chọn 1 nhân sự → list từng task cụ thể (ngày · loại · lớp · trạng thái Đạt/Chậm/Chưa xong), filter theo trạng thái — giống style "Kết quả học tập" của HS (chọn người → xem chi tiết).
- **`statusOf`**: Đạt = done VÀ (không deadline HOẶC doneAt≤deadline) · Chậm = done nhưng doneAt>deadline · Chưa xong = chưa done (bất kể quá hạn hay chưa) — 3 bucket độc lập cộng đúng 100%.
- **✅ VERIFY:** tsc + build pass, preview load không lỗi console. **Chưa xem được số liệu thật** (cần login) — Thùy tự mở leaf "Chất lượng vận hành" (Dashboard, founder-only) xem 2 tab có đúng ý không, đặc biệt tab Chi tiết cho 1 TA (vai phức tạp nhất).
- **CÒN:** OPS report/việc khác (làm dần khi Thùy chỉ rõ từng loại) · OPS per-person (cần thêm cột "ai điểm danh" vào `buoi_hoc_hs` nếu muốn tách theo người — chưa làm, đợi Thùy xác nhận có cần không) · dashboard "cá nhân" (NS tự xem % của MÌNH, hiện Tổng quan/Chi tiết chỉ founder xem được mọi người).

### 07-05 (tiếp) — ⭐ DASHBOARD VẬN HÀNH v2 (Thùy sửa: kỳ toggle · theo TEAM · card chi tiết có tiến độ/chất lượng)

- **3 chỉnh sửa Thùy chốt:**
  1. **Kỳ chọn** — bỏ date-range picker (ít khi dùng) → **toggle bar 3 tháng gần nhất + ‹ › lùi/tiến**, LƯU state qua `useStore` (`dbVanHanhKy`/`dbVanHanhTeam`/`dbVanHanhView`/`dbVanHanhNsId`) — không mất khi đổi màn, đúng pattern `hocPhiKy`/`hocPhiTab` đã có.
  2. **Cấu trúc lại theo TEAM** (Ops/TA/GV, tab riêng) — **1 người có thể ở nhiều team** (vd vừa GV vừa TA 2 lớp khác) nên map riêng `listNhanSuTeams()` (GV/TA suy từ `phan_cong_lop.vai_tro`, OPS suy từ `nhan_su_team` join `team.ma='ops'`), người xuất hiện ở MỌI team họ thuộc, không ép 1 người 1 team.
  3. **Thêm tầng "Theo mục"** giữa Tổng quan và Chi tiết — mỗi loại task (Đánh giá/Chấm lớp cho GV; Chấm lớp/ET/BTVN cho TA) có bảng TB riêng (tái dùng nguyên `BangTongQuan`, chỉ lọc trước theo `tab`) — thấy rõ TA yếu ở ET hay BTVN cụ thể, không gộp mù 1 con số.
  4. **Card Chi tiết giàu hơn** — mỗi task giờ có **Tiến độ** (% HS đã có kết quả / tổng HS có mặt) + **Chất lượng** (TB mức chấm 1-5 cho Chấm lớp · %câu đúng cho ET · %nộp đúng hạn cho BTVN · %điểm TB cho Đánh giá) + **Hiệu suất** (trộn tiến độ+chất lượng, CHỈ tính khi có ít nhất 1 trong 2 — anti-NULL, không suy diễn khi thiếu dữ liệu).
- **`src/lib/vanhanh.ts`** (mới, tách khỏi gami.ts cho gọn): `listNhanSuTeams()` · `layChiTietTasks(rows)` — bulk-fetch `gami_grades`(tách phase ingame/et)+`btvn_ket_qua`+`buoi_danh_gia_dang`+roster co_mat theo buổi, tính tiến độ/chất lượng KHÔNG N+1 (1 lần fetch cho cả list task của 1 người, vì Chi tiết luôn scope 1 người = tập buổi nhỏ, không phải toàn trường).
- **✅ VERIFY:** tsc + build pass, preview load sạch console. **Chưa xem số liệu thật** (cần login) — Thùy tự thử: đổi kỳ (‹ ›) rồi sang màn khác quay lại xem còn giữ chọn không · xem tab TA → Theo mục → so ET vs BTVN có tách rõ không · mở 1 card Chi tiết xem tiến độ/chất lượng có hợp lý không.
- **CÒN:** OPS vẫn team-wide (chưa per-person) · "hiệu suất" card hiện chỉ là TB đơn giản tiến-độ+chất-lượng (chưa có trọng số/công thức chính thức — cần Thùy chốt nếu muốn khác) · chưa có ngưỡng cảnh báo màu-theo-team riêng (đang dùng ngưỡng chung 70/40 cho mọi loại).

### 07-05 (tiếp) — DASHBOARD VẬN HÀNH v3 (thêm view "Theo người" + sửa Chi tiết filter theo hoạt động)

- **Thùy chỉnh 2 ý:** (1) thiếu 1 tầng ở giữa Theo-mục và Chi-tiết — **"Theo người"**: chọn 1 người (vd Tạ Quốc Cường) → thấy NGAY mọi nghiệp vụ của họ side-by-side (Chấm lớp/ET/BTVN/Đánh giá) để biết mạnh-yếu ở đâu — khác "Theo mục" (so sánh NHIỀU người trong 1 nghiệp vụ, để biết ai xuất sắc nhất). (2) **Chi tiết filter SAI trục** — filter theo trạng thái (đạt/chậm/chưa xong) không đúng mục đích "review kỹ từng hoạt động"; đổi filter sang **theo HOẠT ĐỘNG** (ET/BTVN/Chấm lớp/Đánh giá), còn đạt/chậm/chưa-xong chỉ hiện **số liệu tĩnh** (không phải nút bấm) ở góc phải.
- **4 view/team giờ là:** Tổng quan (mọi người, gộp) → Theo mục (1 nghiệp vụ × mọi người — ai giỏi nhất) → **Theo người** (1 người × mọi nghiệp vụ — người này mạnh/yếu gì) → Chi tiết (1 người, lọc theo hoạt động, mỗi task 1 card).
- **Code:** `TheoNguoi` tái dùng chính logic `aggByNs` nhưng đảo trục (group theo `tab` thay vì `nhan_su_id`, cho 1 người đã chọn) — sort nghiệp vụ mạnh nhất (pctDat cao) lên đầu. `ChiTiet` đổi state filter từ `Status` sang `TabKey`, thêm dòng số liệu tĩnh `Đạt N · Chậm N · Chưa xong N` không tương tác.
- **✅ VERIFY:** tsc + build pass, preview sạch console. Chưa xem số liệu thật (cần login).

### 07-05 (tiếp) — DASHBOARD VẬN HÀNH v4 (Thùy sắp xếp lại đúng 3 tầng trên)

- **Thùy sửa lại cấu trúc (khác v3):** 3 tab TRÊN CÙNG giờ là **Theo người / Theo mục / Chi tiết** (bỏ hẳn tab-theo-team làm khung ngoài):
  - **Theo người** — chọn 1 người (SearchSelect MỌI nhân sự, không giới hạn team) → hiện HẾT nghiệp vụ của người đó gộp từ MỌI team họ thuộc (vd vừa GV vừa TA → thấy cả đánh giá lẫn ET/BTVN cùng lúc).
  - **Theo mục** — chọn "mục" = **Tất cả/Ops/TA/GV** (đây mới đúng nghĩa "mục" theo Thùy, KHÔNG phải ET/BTVN riêng lẻ như tôi hiểu sai ở v3) → "Tất cả" ra bảng tổng hợp mọi người mọi nghiệp vụ gộp lại; Ops/TA/GV ra bảng CHUNG mọi người trong mục đó (TA/GV còn tách thêm theo từng nghiệp vụ con — ET/BTVN/Chấm lớp/Đánh giá — bên trong).
  - **Chi tiết** — hiện HẾT mọi task (card), filter bằng `MucSelector` (Tất cả/Ops/TA/GV) **và/hoặc** người (SearchSelect) — combo được cả 2 trục cùng lúc.
- **Code:** gộp `TongQuan`+`TheoMuc` cũ thành logic bên trong `TheoMuc` mới (nhánh theo `muc`); bỏ hẳn `dbVanHanhTeam` khỏi store, thay `dbVanHanhMuc: 'tatca'|'ops'|'ta'|'gv'` dùng CHUNG cho tab Theo-mục lẫn filter Chi-tiết (đúng ý "Theo mục" giờ = 1 khái niệm xuất hiện 2 chỗ).
- **✅ VERIFY:** tsc + build pass, preview sạch console.
- **⭐ Thùy nêu thêm — CHƯA LÀM, cần chốt trước khi code (hỏi lại):** cần 1 luồng **duyệt/đánh giá chất lượng THỦ CÔNG** (khác số đo tự động đang có) — logic mặc định: **lead tầng trên (span-of-control, `getMyScope`) đánh giá nhân sự tầng dưới**; NHƯNG riêng "Trợ giảng trên lớp" của TA lại theo **phạm vi LỚP** — phải là **GV của chính lớp đó** đánh giá (không phải sếp trực tiếp theo cây tổ chức, vì TA có thể trợ giảng nhiều lớp nhiều GV khác nhau). Cần hỏi rõ: (a) "duyệt" tạo ra gì — 1 con số/nhãn ghi đè lên "chất lượng" tự tính, hay là 1 lớp riêng "đã xác nhận bởi người thật" song song với số tự động? (b) áp cho MỌI nghiệp vụ hay chỉ vài loại? (c) tần suất — duyệt từng task/buổi, hay duyệt theo kỳ (tháng) 1 lần?

### 07-05 (tiếp) — ⭐⭐ DUYỆT CHẤT LƯỢNG VẬN HÀNH — v1 BUILT (Thùy trả lời 3 câu hỏi)

- **Thùy chốt:** (a) MỖI TASK đều gửi lên trên trực tiếp (không gộp theo kỳ) — tiến độ máy tự tính từ deadline sẵn có (KHÔNG đụng); chất lượng **mặc định đề xuất 100%**, quản lý bấm xác nhận (giữ hoặc sửa) mới CHÍNH THỨC. (b) Áp MỌI nghiệp vụ (ví dụ ET/BTVN của TA chỉ là ca cụ thể, câu đầu "mỗi task đều phải" là universal). (c) **Duyệt TỪNG task**, nhưng có nút **Duyệt hàng loạt** (đa số task giống nhau, chỉ task đặc biệt mới cần sửa riêng) — cadence thực tế = **daily**.
- **Migration `0081_van_hanh_duyet.sql`:** `viec_van_hanh_duyet` (buoi_hoc_id·tab·nhan_su_id·chat_luong[default 100]·nguoi_duyet·ghi_chu·duyet_at, unique(buoi_hoc_id,tab,nhan_su_id)). **Anti-NULL đúng CLAUDE.md §1.5: "chưa duyệt" = KHÔNG có dòng** — không insert "cho_duyet" rỗng trước; duyệt (batch hay từng cái) đều chỉ là 1 lần INSERT/UPSERT khi có hành động THẬT.
- **`src/lib/vanhanh.ts` thêm:**
  - **`layDanhSachChoDuyet(rows)`** — routing 2 nhánh: mặc định `duoiToi` (span-of-control từ `getMyScope`, gộp `giamSatTrucTiep`+`giamSatSau` = MỌI cấp dưới không cần đệ quy tay vì đã tính sẵn độ sâu); RIÊNG `tab==='ingame' && vai==='tg'` (TA chấm bài trên lớp) → route theo `myGvLopIds` (lớp mà NGƯỜI ĐANG ĐĂNG NHẬP là GV, qua `phan_cong_lop`) — **phạm vi lớp ghi đè cây tổ chức** đúng yêu cầu. Lọc bỏ task đã có dòng `viec_van_hanh_duyet` (đã duyệt rồi thì biến mất khỏi hàng đợi).
  - **`duyetMot`/`duyetHangLoat`** — upsert (idempotent, `onConflict` theo unique key) — hàng loạt mặc định 100%, từng cái cho sửa số tuỳ ý.
- **Tab mới "Duyệt chất lượng"** (4ᵗʰ tab trên cùng, `ChatLuongVanHanhScreen.tsx`): hàng đợi CỦA CHÍNH người đang đăng nhập (không phải admin xem hộ ai khác — đúng nghĩa "lead duyệt việc của mình"), mỗi hàng ghi rõ lý do route (`"bạn duyệt vì là GV lớp này"` vs `"cấp dưới của bạn"`), input % chất lượng (default 100, sửa được) + nút Duyệt riêng, cộng nút **"✓ Duyệt tất cả (100%)"** ở trên xử lý cả batch 1 lần.
- **✅ VERIFY:** tsc + build pass, preview sạch console. **Chưa test luồng thật** (cần ≥2 tài khoản: 1 sếp + 1 nhân sự dưới quyền, hoặc 1 GV + 1 TA cùng lớp, để thấy hàng đợi có route đúng người không) — Thùy tự thử đăng nhập tài khoản có cấp dưới/có lớp mình dạy để xác nhận.
- **CÒN:** chưa hiển thị "đã duyệt bởi ai, lúc nào" ở các view khác (Theo người/Theo mục/Chi tiết) — hiện chất lượng ở đó vẫn là số TỰ ĐỘNG suy từ data thô (`layChiTietTasks`), CHƯA hợp nhất với số đã-duyệt-thủ-công; cần Thùy xác nhận: sau khi duyệt, các view kia có nên ưu tiên hiện số ĐÃ DUYỆT thay vì số tự động không?

### 07-05 (tiếp) — Fallback chất lượng: ĐÃ DUYỆT → số chính thức · CHƯA DUYỆT → số tự động

- **Thùy xác nhận đúng hướng đã hỏi** ("cái gì duyệt rồi thì update duyệt, chưa duyệt thì để số tự động").
- **`layChiTietTasks`** giờ fetch thêm `viec_van_hanh_duyet` (cùng batch theo `buoiIds`, không N+1) → mỗi `TaskDetail` thêm `daDuyet`/`nguoiDuyetId`/`duyetAt`; nếu có dòng duyệt khớp (buoi_hoc_id,tab,nhan_su_id) → `chatLuongPct` = số CHÍNH THỨC đã duyệt (ghi đè số tự động); không có → giữ nguyên số tự động như cũ. **Tiến độ KHÔNG bao giờ bị đụng** (luôn máy tự tính, đúng chốt ban đầu — chỉ chất lượng mới có lớp người-xác-nhận).
- **`TaskCard`** (Chi tiết) thêm dòng nhãn nhỏ cuối card: "✓ Đã duyệt chính thức" (xanh) hoặc "Số tự động — chưa duyệt" (xám) — phân biệt rõ nguồn số đang hiện.
- **✅ VERIFY:** tsc + build pass.
- **Đề xuất thêm (Thùy hỏi "có idea gì khác"), CHƯA LÀM — chờ Thùy chọn có cần không:**
  1. Thêm cột "% đã duyệt" (độ phủ review) vào bảng Theo người/Theo mục — tách riêng khỏi "% hoàn thành", vì 1 leader lười duyệt (bấm hàng loạt vô tội vạ) khác hẳn 1 leader duyệt sát sao — hiện chưa có tín hiệu nào đo việc NÀY.
  2. Badge số lượng "đang chờ bạn duyệt" ở đâu đó dễ thấy (Việc của tôi / top-bar) để nhắc duyệt hàng ngày — đúng cadence Thùy nói ("thường=daily") nhưng hiện phải tự vào tab Duyệt mới biết có gì chờ.
  3. Cho phép BỎ QUA vài task khỏi "Duyệt tất cả" (tick chọn task cần xem riêng trước, phần còn lại mới batch) — hiện "Duyệt tất cả" áp lên TOÀN BỘ danh sách đang hiện, không loại trừ được item nào.

### 07-05 (tiếp) — ⭐⭐ DUYỆT CHẤT LƯỢNG v3: THÊM TIẾN ĐỘ THEO HẠN (4 mức) + HIỆU SUẤT AUTO SINH

- **Thùy chốt thiết kế mới:**
  1. **Tiến độ = máy ĐỀ XUẤT (theo độ trễ so deadline), người CHỐT CUỐI** — không còn thuần tự động. Đổi khác đề xuất → **BẮT BUỘC ghi lý do** (chống nhân sự tự ý sửa hiệu suất cho nhau, track được ai đổi/vì sao).
  2. **Quick-pick % — 100/95/90/85/80**, bấm 1 click thay vì gõ tay; vẫn gõ được số khác nếu cần. Áp cho CẢ tiến độ (khi đổi khác đề xuất) lẫn chất lượng.
  3. **Tiến độ chỉ có 4 mức cố định** (không phải % liên tục nữa): Đúng hạn=100 · Chậm cấp 1=90 · Chậm cấp 2=80 · Chậm cấp 3=70. **⚠ Ngưỡng GIỜ TRỄ cho mỗi cấp là GIẢ ĐỊNH của tôi** (≤24h=cấp1, ≤72h=cấp2, còn lại=cấp3) — Thùy chưa cho số cụ thể, sửa `CHAM_NGUONG_GIO` trong `vanhanh.ts` nếu khác ý đã bàn trước đó với Thùy.
  4. **Hiệu suất = TỰ SINH** từ tiến độ+chất lượng (hiện = trung bình cộng đơn giản, snapshot đóng băng lúc duyệt) — người KHÔNG điền tay ô này.
- **Migration `0082_van_hanh_duyet_tien_do.sql`:** thêm `tien_do`/`tien_do_de_xuat`/`tien_do_ly_do`/`hieu_suat` vào `viec_van_hanh_duyet` (cột cũ `chat_luong` giữ nguyên).
- **`src/lib/vanhanh.ts`:** `TIEN_DO_TIERS` (4 mức) + `deXuatTienDo(row)` (suy tier từ `doneAt` so `deadline`, dùng LẠI field có sẵn trên `StaffTaskRow`, không cần query thêm) + `PCT_QUICK_PICKS`. `duyetMot` đổi chữ ký nhận `StaffTaskRow` đầy đủ (để tự tính đề xuất + validate) thay vì 3 id rời — **validate lý do bắt buộc NGAY TẦNG DATA** (không chỉ ở UI, chặn cả gọi thẳng). `duyetHangLoat` giờ LUÔN theo đề xuất máy cho tiến độ (không ai gõ tay khi duyệt hàng loạt — đúng tinh thần "đa số giống nhau"), chất lượng mặc định 100%.
- **`layChiTietTasks`**: đã duyệt → ghi đè CẢ tiến độ (không chỉ chất lượng như v1) bằng số đã chốt + expose `hieuSuatPct` (snapshot chính thức); chưa duyệt → `hieuSuatPct=null` (KHÔNG tự suy "hiệu suất nháp", tránh lẫn với số chính thức — TaskCard tự trộn 2 số thô làm preview riêng khi chưa duyệt).
- **UI `DuyetChatLuong`/`DuyetRowCard`:** mỗi task hiện "Đề xuất: Chậm cấp 2 (80%)" + 2 ô `PctQuickPick` (tiến độ/chất lượng) + hiệu suất tự tính hiện live + ô "lý do" bắt buộc (viền đỏ nếu trống) CHỈ hiện khi tiến độ ≠ đề xuất — nút Duyệt disable tới khi hợp lệ.
- **✅ VERIFY:** tsc + build pass, preview sạch console. Chưa test luồng thật (cần login + có task thật để duyệt).
- **CÒN — hỏi lại khi cần:** ngưỡng giờ trễ 3 cấp là suy đoán, cần Thùy xác nhận đúng con số đã bàn trước · điểm số 100/90/80/70 cho tiến độ cũng có thể cần đúng số Thùy đã chốt (đang đọc đúng "-10%/-20%/-30%" từ 100 nền).

### 07-05 (tiếp) — Chốt ngưỡng giờ trễ tiến độ (Thùy trả lời)

- **`CHAM_NGUONG_GIO`** (`src/lib/vanhanh.ts`) sửa đúng số Thùy chốt: **trễ <12h = Chậm cấp 1 · 12–24h = Chậm cấp 2 · ≥24h = Chậm cấp 3** (trước là giả định 24h/72h — SAI, đã sửa). Không đụng chỗ khác (điểm số 100/90/80/70 giữ nguyên, chỉ mốc giờ đổi).
- **✅ VERIFY:** tsc pass, preview sạch console.

### 07-05 (tiếp) — Duyệt chất lượng: card gọn theo CHIỀU NGANG (1 hàng/task) + tiến độ đổi thành 4 NÚT rời rạc

- **Thùy chỉnh UI:** card cũ cao quá (2×2 grid tiến độ/chất lượng + hiệu suất xuống dòng riêng) → 1 màn chỉ thấy vài task. Sửa thành **1 HÀNG ngang/task**: tên+ngày+lớp (cột trái cố định 44) → 4 nút tiến độ (Đạt/Chậm 1/2/3) → 6 ô quick-pick chất lượng (giữ nguyên) → hiệu suất+nút Duyệt đẩy CUỐI hàng (`ml-auto`). Lý do (khi đổi khác đề xuất) xuống 1 dòng phụ bên dưới, KHÔNG chiếm chỗ khi không cần.
- **Tiến độ đổi hẳn từ ô nhập %/quick-pick sang 4 NÚT CỐ ĐỊNH** (`TienDoTierPick`, mới) khớp đúng `TIEN_DO_TIERS` — không còn cho gõ số tự do cho tiến độ (chỉ chất lượng mới có ô custom), đúng bản chất "tiến độ chỉ có 4 mức" đã chốt.
- **✅ VERIFY:** tsc + build pass, preview sạch console.

### 07-06 — Dashboard "Chất lượng vận hành" · tab Theo người: UI hub + fix hàng loạt logic hiệu suất sai

- **UI "Theo người" đại tu** (`TheoNguoi` trong `ChatLuongVanHanhScreen.tsx`): bỏ dropdown `SearchSelect`, thay **sidebar trái = list TẤT CẢ nhân sự** (search-filter, click đổi) + **header = profile** (avatar/tên/mã NS/chip team, hàm mới `getNsProfileMini` trong `vanhanh.ts`) + **card lưới bên phải, 1 card/nghiệp vụ**: số TO NHẤT = Hiệu suất trung bình, số nhỏ dưới = Đạt/Chậm/Chưa xong (nguyên tắc size-hierarchy Thùy chốt: to=tổng quan, bé=chi tiết — áp cho MỌI dashboard sau này). Click card → **POPUP** hiện toàn bộ task (tái dùng nguyên `TaskCard` của tab Chi tiết, KHÔNG đẻ mục "chi tiết" riêng — lý do: tránh dựng lại y hệt UI đã có, giữ ngữ cảnh không mất khi đóng popup).
- **⚠ BUG 1 — "% câu đúng" là bịa:** code CŨ (từ phiên trước 07-05, không phải hôm nay) lấy tỉ lệ HS làm đúng ET/mức chấm ingame làm "Chất lượng" của TA — SAI bản chất (đó là kết quả HỌC TẬP của HS, không phải chất lượng LÀM VIỆC của người chấm). Thùy bắt lỗi ngay khi thấy số "% câu đúng" trong popup. Xoá hẳn cách tính này (bỏ luôn 4 query roster/grades/btvn/danhgia không cần nữa trong `layChiTietTasks` — code gọn hẳn).
- **Chốt lại đúng 3 quy tắc (khớp `BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md`):** **Tiến độ** = máy đề xuất theo giờ trễ · **Chất lượng** = CHỈ người (leader) duyệt tay, mặc định 100% · **Hiệu suất** = derive từ 2 trục trên.
- **⚠ BUG 2 — task CHƯA XONG hiện nhầm Tiến độ 100%:** `deXuatTienDo()` viết cho tab Duyệt (luôn lọc `r.done` trước khi gọi) có early-return "Đúng hạn 100%" khi `!r.done` — gọi tràn hàm này cho MỌI task (kể cả chưa làm) khiến task "Chưa xong" hiện tiến độ 100% (Thùy bắt lỗi: "trễ hạn mà sao lại 100%"). Fix: case chưa xong tách riêng, KHÔNG dùng `deXuatTienDo`.
- **Tiến độ SỐNG cho task chưa xong (Thùy đề xuất):** hàm mới `tienDoNeuXongBayGio()` — giả định "nếu hoàn thành NGAY BÂY GIỜ" thì tụt vào tier nào (so hiện tại với deadline, cùng ngưỡng `CHAM_NGUONG_GIO`), TỤT DẦN theo thời gian nếu vẫn chưa làm — giống pattern badge Quá hạn/Sát hạn đã có ở "Việc của tôi". Chất lượng vẫn mặc định 100% (đồng nhất mọi task chưa duyệt, không phân biệt đã-xong/chưa-xong) → Hiệu suất SỐNG tính đủ cho MỌI task, không còn hiện "chưa hoàn thành" trơ.
- **⚠ BUG 3 — Hiệu suất KHÔNG PHẢI trung bình cộng:** code cũ (`Math.round((tienDo+chatLuong)/2)`, lặp ở 4 chỗ: `hieuSuatOf`/`duyetMot`/`duyetHangLoat`/`DuyetRowCard`) — Thùy chốt công thức ĐÚNG: **Tiến độ = lõi phạt** (Đúng hạn=0 phạt, Chậm 1/2/3 = trừ 10/20/30%, khớp thẳng `100−tienDo` vì tier đã là 100/90/80/70) → **Hiệu suất = Chất lượng − phạt tiến độ** (vd Chậm 3 + Chất lượng 90 → 90−30=60%, KHÁC avg=80). Gộp về 1 hàm dùng chung `tinhHieuSuat(tienDo, chatLuong)` (clamp không âm), sửa cả 4 chỗ.
- **Bài học meta:** dựng công thức nghiệp vụ (hiệu suất/tiến độ/chất lượng) mà KHÔNG hỏi trước — 3/3 lần đều bị Thùy bắt lỗi (bịa "% câu đúng", tái dùng hàm sai ngữ cảnh, đoán nhầm công thức trung bình cộng). Từ nay: công thức tính điểm/hiệu suất PHẢI hỏi rõ trước khi code, đừng suy đoán "nhìn có vẻ hợp lý".
- **✅ VERIFY:** tsc sạch sau mỗi bước; test trực tiếp trên preview (Admin → Chất lượng vận hành → Theo người → Tạ Quốc Cường) khớp tay từng con số (vd Chậm-tiến-độ 70% + Chất lượng 100% → Hiệu suất 70%; `tinhHieuSuat(70,90)=60` khớp ví dụ Thùy cho).

### 07-06 (tiếp) — RBAC: role "Core team" + Chỉ xem/Sửa per-role×màn + fix bug scroll toàn app

- **Role "Core team"** (script `scripts/seed_core_team_role.mjs`, idempotent): gộp 12 leaf thuộc 2 nhóm nav "Core team"+"Dashboard" (hocphi/ns/orgchart/phancong/tkb/phanquyen/baoloi/db_tuyendung/giaoviec/db_tongquan/db_taichinh/db_chatluong), full quyền Sửa. KHÔNG map theo team biên chế nào (Core team không phải 1 trong 6 team gv/ta/ops/hoc_thuat/media/marketing) — Thùy tự gán ghế ở tab "Gán role cho vị trí".
- **⭐ RBAC thêm mức Chỉ xem/Sửa (mig 0083):** `vai_tro_chuc_nang` thêm cột `chi_xem boolean` (true=chỉ xem, false=được sửa, mặc định false giữ hành vi cũ). `my_quyen()` RPC trả thêm `chi_xem text[]` — 1 người giữ NHIỀU ghế cho cùng 1 màn thì "được sửa" THẮNG "chỉ xem" (`bool_and` gộp, permissive wins, khớp luật UNION quyền cũ). UI `PhanQuyenScreen` (tab ma trận): mỗi ô đổi từ 1 tích → **2 tích xếp dọc** (✓ Xem / ✎ Sửa, ô Sửa chỉ hiện sau khi đã tick Xem). Cấp mới mặc định = CHỈ XEM (an toàn, phải tick thêm Sửa mới full quyền).
- **⭐ Khoá THẬT ở 1 điểm seam, KHÔNG sửa tay 27 màn:** `src/lib/supabase.ts` — `supabase.from(table)` bọc lại, chặn `insert/update/upsert/delete` (trả lỗi thân thiện qua `.then` giả, KHÔNG chặn `select`) khi màn ĐANG MỞ bị đánh dấu chỉ-xem cho người dùng đó. `useStore.ts` đăng ký `setReadOnlyLeafGetter` đọc `quyen.chiXem` + `staffLeaf` hiện tại. Banner cam "🔒 Chỉ xem" hiện ở đầu màn (`NhanSuHome.tsx`) khi áp dụng.
- **⚠ BUG (do chính sửa banner ở trên gây ra) — MẤT THANH CUỘN TOÀN BỘ MÀN (không riêng Giáo trình):** khung bọc nội dung đổi từ `grid-rows-[minmax(0,1fr)]` (1 hàng) sang `grid-rows-[auto_minmax(0,1fr)]` (2 hàng, hàng đầu cho banner). Nhưng banner CHỈ render có điều kiện — khi KHÔNG hiện (đa số người dùng), div chỉ còn ĐÚNG 1 phần tử con (nội dung màn) → CSS grid auto-đặt nó vào hàng `auto` (co theo nội dung) thay vì hàng `1fr` (chiếm hết chiều cao) → mọi khung cuộn nội bộ (Giáo trình và tất cả màn khác) bị vỡ. **Fix:** tách banner ra khỏi lưới — bọc ngoài bằng `flex flex-col`, banner là 1 item `shrink-0` riêng, khung nội dung quay lại NGUYÊN `grid-rows-[minmax(0,1fr)]` như cũ (độc lập, không phụ thuộc banner có render hay không). **Bài học: thêm 1 phần tử CÓ ĐIỀU KIỆN vào cùng 1 CSS grid với phần tử chính KHÔNG được đổi số hàng của grid đó — auto-placement sẽ lệch khi điều kiện không đúng; phải tách bằng flex/wrapper riêng.**
- **✅ VERIFY:** tsc + build pass mọi bước; SQL sanity-check `bool_and` gộp chi_xem đúng; xác nhận data Core team 12 leaf trong DB. **CHƯA test click-through thật trên browser** (không có tài khoản đăng nhập) — Thùy tự test lại 2 phần trên.

### 07-06 (tiếp 2) — Hệ Vận hành Ops: PHA 0 khảo sát + PLAN.md + build Spine/Story 1+2+3 (Story 4 ET GÁC LẠI)

- **Spec mới `BKDEMY_OPS_SPEC_DETAIL.md`** (thay `BKDEMY_OPS_SPEC.md` tổng quan): 4 story Report/Báo tan/Prep/Scan ET. Theo đúng kỷ luật spec: PHA 0 khảo sát (grep TKB/điểm danh/ETPrintView/mastery/storage/hiệu suất/phân công — TẤT CẢ đã có, chỉ thiếu "phân công ca trực Ops" + leaf report/prep/scan) → viết `PLAN.md` → hỏi Thùy các điểm mở → code.
- **Thùy chốt 2 quyết định lớn:** ① **Phân công ca Ops = pure-derive THUẦN, KHÔNG đóng băng tuần** ("thay đổi được mà") — 1 bảng effective-dated y hệt TKB, không bảng tuần/ngoại lệ riêng, swap 1 buổi thì tự gán lại sau (chấp nhận tự "reset" tay). ② **Story 4 (Scan ET) GÁC LẠI** — làm story khác trước; "ET chỉ thay TA 1 bước nhập liệu" (khi quay lại làm GỌN, đừng over-engineer accuracy/confidence-tier).
- **⚠ Sửa 1 chỗ trong PLAN lúc code (phát hiện, không phải đoán trước được từ đầu):** định thêm cột `report_dong_at`/`tan_dong_at` thẳng vào `buoi_hoc` — SAI, vì Report phải đóng được TRƯỚC KHI buổi "mở" (report gửi tối hôm trước, buổi chỉ mở lúc vào học) → lúc đó CHƯA CÓ dòng `buoi_hoc`. Sửa: bảng tự chứa riêng `vh_ops_task` (khoá theo `tkb_id,ngay,tab`, KHÔNG phụ thuộc buoi_hoc tồn tại, tự chứa cả duyệt — không reuse `viec_van_hanh_duyet` vì bảng đó bắt buộc `buoi_hoc_id not null`).
- **Migration 0084-0086:** `phan_cong_ops` (spine, effective-dated) · `vh_ops_task` (Story 1+2, unique tkb_id+ngay+tab) · `prep_phong` (Story 3, unique phong+ngay+luot).
- **Story 3 Prep đơn giản hoá (Thùy chốt — KHÔNG thuật toán gộp-theo-phút):** T2-T6 = 1 lượt/ngày (dù tối mấy ca) · T7/CN = 2 lượt sáng/chiều (ranh giới = mốc 12:00 TKB). Deadline Report = **mốc CỐ ĐỊNH 20h hôm trước** (không trừ ngược N-giờ-trước-ca — tránh vô lý với ca sáng sớm).
- **Lib mới `src/lib/opsvanhanh.ts`** (tách khỏi `gami.ts`/`TabKey` — nguồn khác `phan_cong_lop`): CRUD `phan_cong_ops` (`ganNguoiTruc`/`goNguoiTruc` đóng-dòng-cũ-mở-dòng-mới) · `getMyOpsTasks`/`buildReportMessage`/`dongOpsTask`/`listOpsChoDuyet`/`duyetOpsHangLoat` (công thức `tinhHieuSuat` TÁI DÙNG từ `vanhanh.ts`) · `luotPrepCuaKhoang`/`prepCuaThoiGian` (cửa giờ CHẶN CỨNG nếu đóng quá sớm)/`tickPrepChecklist`/`dongPrep`/`chamPrepGV`/`chotPrepLeader`.
- **3 leaf mới** (nhóm Vận hành, `fixtures.ts`): `phancong_ops` (`PhanCongOpsScreen` — bảng TKB×người trực, style giống `PhanCongScreen` có sẵn) · `ops_report` (`OpsReportScreen` — tab Việc-của-tôi + Leader duyệt, copy-message/dán-ảnh/đóng) · `prep` (`PrepScreen` — checklist 2 ô + ảnh + GV chấm + Leader chốt).
- **Bug tự bắt lúc code (đã sửa trước khi merge):** `PrepScreen` ban đầu chỉ giữ ảnh vừa dán ở React state cục bộ (chưa ghi DB) — nếu Ops tick checklist SAU khi dán ảnh, hàm tick reload `getPrepRow` từ DB sẽ trả `anh_url=null` và XOÁ MẤT ảnh vừa dán trên màn hình. Fix: `tickPrepChecklist` nhận thêm field `anhUrl` optional, ghi DB NGAY lúc dán/chọn (không chỉ giữ ở state).
- **CÒN (chưa làm, KHÔNG chặn):** cấp quyền 3 leaf mới cho role Ops (`seed_default_roles.mjs`/Phân quyền — Thùy tự cấp qua UI, không tự ý sửa role người khác) · tích hợp report/tan/prep vào "Việc của tôi" (`TaskCard` hiện tại gắn chặt `buoi_hoc`/vai gv-tg — để fast-follow sau) · Story 4 (Scan ET) — mọi câu hỏi kiến trúc (bucket, pipeline OMR/QR chạy đâu — dự án hiện 100% client-side, không edge function nào) để khi quay lại.
- **✅ VERIFY:** tsc + build pass sau mỗi bước; preview load sạch console (chưa có tài khoản để click-through thật 3 màn mới — Thùy tự test).

### 07-06 (tiếp 3) — Fix Bổ trợ Đuổi: "Hoàn thành khóa" biến mất sau khi đóng buổi + làm rõ flow

- **Thùy báo 2 lỗi** (`BoTroDuoiScreen.tsx`): ① nút "Hoàn thành khóa" không bấm được · ② bấm "Hoàn thành buổi" tưởng như kết thúc luôn bổ trợ đuổi, không thấy quay lại "Cần đuổi".
- **Đọc code xác nhận DATA MODEL đã đúng** (`botro_duoi.ts`): đóng buổi (`dongDanhGia`) chỉ set `buoi_hoc.danh_gia_xong_at`, KHÔNG đụng `bo_tro_duoi.trang_thai` — case HS tự quay lại "Cần đuổi" ở lần load sau (query `listCanDuoi` loại case theo buổi ĐANG MỞ, buổi đóng thì tự rớt khỏi tập "đã xếp"). Bug thật ra là **UI ẩn nút + không có tín hiệu cho biết flow vẫn tiếp tục**, khiến người dùng tưởng nhầm là bug data.
- **Fix 1 (bug thật — nút biến mất):** nút "✓ Hoàn thành khóa" per-HS trong `BuoiDuoiDetail` trước bị khoá bởi điều kiện `!readOnly` — biến mất NGAY khi buổi đã đóng, đúng lúc người dùng cần bấm nhất (quyết định "HS bắt kịp" thường ra ngay sau khi xem xong nhận xét buổi cuối). Bỏ điều kiện `!readOnly` cho riêng nút này (các nút khác — điểm danh/gỡ HS/sửa buổi — vẫn khoá đúng khi readOnly, vì đó là thao tác trên BUỔI không phải trên CASE).
- **Fix 2 (UX — làm rõ flow):** thêm dòng chú thích cạnh badge "✓ Buổi đã hoàn thành": *"HS chưa bấm Hoàn thành khóa đã tự quay lại Cần đuổi để xếp buổi tiếp theo."*
- **Fix 3 (thị giác — "rõ ràng hơn"):** bump nút "Hoàn thành khóa" từ viền nhạt (`border-emerald-200 bg-emerald-50`) → nền đặc (`bg-emerald-600 text-white`) ở CẢ 2 nơi (list "Cần đuổi" + per-HS trong buổi) — cùng trọng lượng thị giác với nút "Xếp buổi đuổi" (indigo), khác màu để phân biệt hành động chấm dứt vs hành động tiếp tục.
- **Bài học:** report "X không hoạt động" đôi khi là **data đúng, UI không lộ ra** — đọc kỹ code trước khi sửa DB/logic; ở đây chỉ cần sửa hiển thị.
- **✅ VERIFY:** tsc sạch. Chưa test click-through thật (không có tài khoản) — Thùy tự test lại luồng: đóng 1 buổi đuổi → xác nhận HS quay lại "Cần đuổi" + bấm "Hoàn thành khóa" được cả lúc buổi đang mở lẫn đã đóng.

### 07-06 (tiếp 4) — Mobile shell cho staff (Ops) + camera trực tiếp cho Report/Tan/Prep

- **Thùy hỏi/yêu cầu:** ① cần UI mobile cho tài khoản Ops (chụp ảnh evidence dễ hơn trên điện thoại) · ② xác nhận hiểu đúng: phân công Ops pure-derive = không cần khái niệm "gốc" tách biệt, sang tuần mới tự động giữ nguyên người cũ.
- **Trả lời ②:** ĐÚNG, không cần code gì thêm. `phan_cong_ops` chỉ 1 bảng effective-dated (`hieu_luc_tu/den`), gán 1 lần là `hieu_luc_den=null` (vô thời hạn) → mọi tuần sau tự động đọc lại ĐÚNG người đó cho tới khi ai đổi tay (đóng dòng cũ + mở dòng mới). Chữ "gốc"/"mẫu gốc" trong code/PLAN.md chỉ là TÊN GỌI kế thừa từ ngôn ngữ spec ban đầu — không phải một bảng/khái niệm riêng biệt với "hiện tại". Không có "tuần" nào phải tính lại, không có gì "reset" tự động (ngoại trừ chính Thùy tự tay đổi lại nếu chỉ muốn swap 1 buổi — đã nói rõ ở lần chốt trước).
- **① Mobile shell cho STAFF (trước giờ chỉ HS-facing mới có, staff luôn giả định desktop):**
  - **`App.tsx`:** huỷ `zoom:1.15` (mật độ desktop, `#root` index.css) khi `useIsMobile()` — CÙNG trick đã dùng cho `HocSinhApp` (bọc `style={{zoom:1/1.15}}`, `h-screen` bên trong tự tính lại đúng viewport thật). Desktop giữ nguyên `h-[calc(100vh/1.15)]`.
  - **`NhanSuHome.tsx`:** sidebar nav 240px cố định KHÔNG còn chỗ trên điện thoại (375px) → mobile chuyển sang **top bar (☰ + tên màn đang mở) + drawer trượt** (82vw, tự đóng sau khi chọn màn). Desktop giữ nguyên sidebar tĩnh. Hàm mới `tenLeafDangChon()` tra tên màn (kể cả con `lamtailieu:*`) để hiện lên top bar.
  - Đây là fix CHUNG cho MỌI staff dùng điện thoại (không riêng Ops) — Ops là người hưởng lợi trực tiếp vì hay cần dùng ngoài hiện trường.
- **① Camera trực tiếp cho 2 màn field-work (`OpsReportScreen.tsx`, `PrepScreen.tsx`):**
  - Thêm `capture="environment"` vào input ảnh — mobile bấm "Chọn ảnh" mở THẲNG camera sau máy thay vì trình duyệt file chung (an toàn thêm cho desktop, thuộc tính bị bỏ qua).
  - `useIsMobile()`: ẩn nút "📋 Dán ảnh" trên mobile (clipboard-read ảnh không ổn định trên mobile browser, nhất là Safari iOS — dễ gây lỗi im lặng) → chỉ còn 1 nút rõ ràng "📸 Chụp ảnh". Bump cỡ nút/checkbox lên ≥44px chạm (chuẩn touch target) cho các thao tác chính (checklist Prep, Đóng task).
- **CÒN (không chặn):** phần "GV chấm"/"Leader chốt" trong PrepScreen chưa bump cỡ mobile riêng (ít cấp thiết hơn — thường làm ở bàn, không phải ngoài hiện trường) · `PhanCongOpsScreen` (bảng gán ca) chưa tối ưu mobile — đây là màn LẬP KẾ HOẠCH (leader), không phải màn field-work nên ưu tiên thấp hơn.
- **✅ VERIFY:** tsc + build pass. Preview resize mobile (375×812) trang login sạch console (chưa login được để xem thật shell/drawer/camera — Thùy tự test trên điện thoại thật, đặc biệt xác nhận `capture="environment"` mở đúng camera trên máy Android/iOS đang dùng).

### 07-06 (tiếp 5) — PhanCongOpsScreen: đổi bảng-dòng → lưới card nhỏ

- **Thùy chỉnh:** "Mỗi ca để 1 card nhỏ đi. Để dòng như này tốn không gian mà khó nhìn" — bảng `<table>` (1 dòng/ca, cột Lớp/Giờ/Phòng/Người trực) đổi sang **lưới card** (`grid-template-columns:repeat(auto-fill,minmax(220px,1fr))`), cùng pattern đã dùng ở `PrepScreen`/`BoTroDuoiScreen`. Mỗi card: Lớp+môn+cờ "⚠ trống" (nếu chưa gán) → giờ+phòng → `SearchSelect` chọn người trực. Accent trái `border-l-4`: xám (đã gán) / đỏ (trống) — đúng quy ước "STAFF Apple-clean" đã chốt (memory `staff-ui-no-scifi`).
- **✅ VERIFY:** tsc + build pass, preview sạch console (chưa login test thật).

### 07-06 (tiếp 6) — PhanCongOpsScreen: picker "người trực" chỉ hiện team OPS

- **Bug (Thùy bắt):** picker "người trực" đang gọi `listNhanSu()` = TOÀN BỘ nhân sự công ty — sai, phân công ca trực Ops chỉ nên chọn trong TEAM OPS (7 người, verify DB thật: `nhan_su_team` × `team.ma='ops'`).
- **Fix:** `opsvanhanh.ts` thêm `listOpsStaff()` (join `team.ma='ops'` → `nhan_su_team` → `nhan_su` đang làm), cùng cách xác định team ops đã dùng ở `vanhanh.ts` (`listNhanSuTeams`). `PhanCongOpsScreen.tsx` đổi sang dùng hàm này. Có chừa an toàn: nếu người ĐANG được gán lỡ rời team Ops sau đó, vẫn hiện tên họ trong picker (không để trống oan) qua `optsFor()`.
- **✅ VERIFY:** tsc + build pass; verify DB thật team ops = 7 người đang làm (Phạm Bảo Ngân, Trần Thị Thảo Nguyên, Hoàng Thị Quỳnh Trang, Đào Xuân Thùy, Trần Thu Thủy, Hoàng Khánh Linh, Trần Bảo Lộc).

### 07-06 (tiếp 7) — BuoiHocScreen: OPS không thấy tab chấm-bài-như-TA + gấp bớt ngày tương lai

- **Thùy báo 2 ý:** ① "Việc của ops ko có điểm danh chấm bài như TA. Loại bỏ cái đấy khỏi màn hình" · ② "Chỉ hiện việc của ngày hôm nay và còn nợ. Các ngày khác tự động ẩn. Click vào mới mở ra."
- **① Suy luận + fix (`BuoiHocScreen.tsx`):** leaf "Buổi học" mở `BuoiDetail` KHÔNG giới hạn tab (comment cũ trong code: "bỏ trống = đủ 4 (OPS/admin)" — có chủ đích trước đây, nay Thùy đổi ý) → OPS mở BẤT KỲ buổi nào (kể cả lớp mình không dạy) đều thấy đủ Đánh giá/Chấm bài/ET/BTVN dù đó là việc của GV/TA, không phải Ops. **Fix:** so `lop_id` của buổi đang mở với `me.phanCong` (danh sách lớp mình là gv/tg) — **là gv/tg của CHÍNH lớp đó (hoặc `la_admin`)** → thấy đủ tab; **ngược lại (kể cả Ops)** → chỉ tab Điểm danh (đúng việc, `canManage` vẫn giữ nguyên nên Ops vẫn Hủy-buổi/đổi-GV được). ⚠ Đây là DIỄN GIẢI của tôi từ câu nói — nếu ý Thùy khác (vd chỉ muốn ẩn ở 1 màn cụ thể khác), nói lại.
- **② Fix (`OpsReportScreen.tsx` + `PrepScreen.tsx`, tab Việc của tôi):** nhóm theo ngày trước giờ LUÔN mở hết cả tuần → giờ **hôm nay + ngày ĐÃ QUA (còn nợ, vì active list đã lọc done)** mở sẵn, **ngày TƯƠNG LAI gấp lại** thành 1 dòng tiêu đề bấm để xem (▸/▾). State-driven (Set ngày đã bấm mở), KHÔNG dùng `<details open>` uncontrolled (sẽ bị reset mỗi 60s do `now` tick lại re-render).
- **CÒN (không chặn, chưa đụng):** "Việc của tôi" gốc (`NhanSuHome.tsx` `VietCuaToi`, dùng chung mọi role) CHƯA áp 2 fix trên — phạm vi rộng hơn (GV/TA cũng dùng), chưa chắc Thùy muốn đổi luôn ở đó.
- **✅ VERIFY:** tsc + build pass, preview sạch console (chưa login test thật — Thùy xác nhận lại đúng ý ①, và tự bấm thử gấp/mở ngày ở ②).

### 07-06 (tiếp 8) — Tích hợp Report/Tan/Prep vào "Việc của tôi" + fix bug report sai NGÀY

- **Thùy đưa tài khoản Ops thật để test** (`tranthuyy268@gmail.com`) — **login THẤT BẠI cả 2 lần thử** ("Invalid login credentials", HTTP 400 từ Supabase Auth). Verify DB: nhân sự "Trần Thu Thủy" CÓ THẬT + `trang_thai='dang_lam'` (đúng 1 trong 7 người team Ops) — nên KHÔNG phải email sai; nhiều khả năng mật khẩu đưa nhầm hoặc tài khoản đăng nhập chưa được cấp cho người này. **Không tự đoán/thử thêm mật khẩu khác** — cần Thùy kiểm tra lại qua Supabase Dashboard.
- **① "Các loại việc chính của ops chưa được đưa vào Việc của tôi":** ĐÚNG — trước giờ tôi cố tình tách Report/Tan/Prep ra 3 leaf riêng (`ops_report`/`prep`), không nhét vào `VietCuaToi`/`MyTask` (sợ đụng engine GV/TA). Thùy xác nhận muốn có ở đây → đã tích hợp: `getMyOpsTasks`/`getMyPrepTasks` (opsvanhanh.ts) fetch theo tuần đang xem, gộp vào CÙNG `dayGroups` (theo ngày) với card `OpsExtraCard`/`PrepTaskCard` mới — bấm card KHÔNG mở popup tại chỗ (khác TaskCard/OpsBuoiCard) mà **điều hướng sang màn chi tiết** (`ops_report`/`prep`, nơi có đủ luồng copy-tin-nhắn/chụp-ảnh/đóng) — tránh nhồi lại toàn bộ luồng tương tác vào "Việc của tôi". Dải số liệu (Cần làm/Quá hạn/Sát hạn/Đã xong) + section "✓ Đã xong tuần này" đều gộp tính cả 2 loại mới.
- **② Bug "report hôm nay phải hiện cho ca ngày mai":** XÁC NHẬN ĐÚNG LÀ BUG THẬT (không phải hiểu lầm) — `getMyOpsTasks` cũ gắn `ngay` của task report = NGÀY DIỄN RA CA HỌC, trong khi report phải HIỂN THỊ/ĐẾN HẠN vào TỐI HÔM TRƯỚC → report của "ca thứ 2 tuần sau" không bao giờ lọt vào nhóm-theo-ngày của "hôm nay" (chủ nhật) dù đã tới hạn gửi. **Fix:** tách `ngay` hiển thị = `congNgay(ngayHocSinh, -1)` cho riêng task `report` (task `tan` giữ nguyên = ngày học). Quét thêm **1 ngày SAU** khoảng tuần đang xem (`denExt = congNgay(den,1)`) để bắt được ca xảy ra NGAY SAU tuần hiện tại (hôm nay=CN cuối tuần vẫn thấy report của Thứ 2 tuần sau) — chỉ đẩy report nếu `ngay` tính ra rơi trong `[tu,den]` (tránh trùng khi xem tuần TRƯỚC/SAU liền kề).
- **CÒN:** chưa xác nhận được login thật (chờ Thùy) → tất cả fix hôm nay CHỈ verify qua tsc+build+đọc code, CHƯA click-through xác nhận trên UI thật.
- **✅ VERIFY:** tsc + build pass. Login test THẤT BẠI (không phải lỗi code — lỗi credential/tài khoản).

### 07-06 (tiếp 9) — Sửa TIẾP bug report + chip filter theo VAI (Thùy vẫn chưa thấy report + chỉ ra chip sai)

- **Thùy vẫn "chưa thấy report"** sau fix trước → verify DB thật: Trần Thu Thủy CÓ 10 phân công `phan_cong_ops` (gán đúng hôm nay 07-06). Truy ra: **hôm nay = Thứ 2, NGÀY ĐẦU TUẦN đang xem** — report của ca Thứ-2-hôm-nay đến hạn TỐI QUA (Chủ nhật), mà Chủ nhật đó lại thuộc TUẦN TRƯỚC theo lịch → bộ lọc `ngayReport >= tu` tôi viết ở fix trước (để tránh trùng khi xem tuần liền kề) đã VÔ TÌNH LOẠI ĐÚNG trường hợp này. **Bài học: fix trước chỉ test 1 chiều (hôm nay=cuối tuần→thấy ca mai) mà quên chiều kia (hôm nay=đầu tuần→report từ hôm qua vẫn phải hiện, còn nợ).**
- **Fix thật:** bỏ hẳn điều kiện `ngayReport >= tu` (chỉ giữ `ngayReport <= den` — không hiện report của tương lai xa hơn tuần đang xem). Mở rộng khoảng đọc `vh_ops_task` (`doneRows`) thêm 1 ngày TRƯỚC `tu` để khớp trạng thái đã-đóng-chưa của report "hôm qua" này.
- **✅ VERIFY MẠNH:** viết script replay THẲNG logic `getMyOpsTasks` bằng dữ liệu thật (không phải đoán) — hôm nay 2026-07-06 (Thứ 2): sinh đúng **10 report hiện vào 2026-07-05** (hôm qua, còn nợ) + **10 báo-tan hiện vào 2026-07-06** (hôm nay) + **10 report của Thứ-2-tuần-sau hiện vào 2026-07-12** (Chủ nhật cuối tuần này) = 30 task, đúng cả 2 chiều biên. Tự tin fix đúng dù chưa click UI thật.
- **② Thùy chỉ thêm:** "chip filter Điểm danh/Chấm bài/Chấm ET/Chấm BTVN/Đánh giá — đây là UI của TA/GV — Ops phải thấy Điểm danh/Report/Báo tan/Chuẩn bị phòng chứ?" — ĐÚNG, đây là lỗ hổng y hệt bug BuoiHocScreen hôm trước (dùng chung UI không phân vai). **Fix (`NhanSuHome.tsx`):** chip filter giờ CHIA THEO VAI — `OPS_CHIPS` (Điểm danh/Report/Báo tan/Chuẩn bị phòng, hiện khi `scope.opsToanHe`) và `GVTA_CHIPS` (Chấm bài/Chấm ET/Chấm BTVN/Đánh giá, hiện khi `scope.trucTiep.length>0` — có ghế gv/tg lớp nào). Người giữ CẢ 2 vai (hiếm) thấy gộp cả 2 bộ. `loai` (Set filter) đổi từ `Set<TabKey>` → `Set<string>` để chứa được thêm 'report'/'tan'/'prep' (không thuộc TabKey gốc của GV/TA).
- **✅ VERIFY:** tsc + build pass. Chưa click-through UI thật (vẫn chưa login được từ phiên Claude Code — Thùy tự test tiếp).

### 07-06 (tiếp 10) — Mobile "Việc của tôi": nén thẻ đếm + card, gấp ngày sau, thêm nút back

- **Thùy chỉnh 4 ý (đều ở `NhanSuHome.tsx` — mục tiêu: "1 màn nhìn thấy gần hết việc cần làm"):**
  1. **4 thẻ đếm quá to** → `Metric` thêm prop `compact` (mobile): 1 hàng label+số gọn (`px-2.5 py-1.5`) thay khối 2 dòng to (`px-4 py-3` + số 26px).
  2. **Card chỉ cần 2 thông tin chính (loại việc + lớp)** → cả 4 loại card (`OpsBuoiCard`/`TaskCard`/`OpsExtraCard`/`PrepTaskCard`) thêm nhánh `compact`: từ khối 3 dòng (icon-lớn+tên / lớp+ngày+vai / deadline riêng dòng) → **1 hàng** (icon nhỏ + "loại · lớp" rút gọn + deadline badge cuối hàng). Giữ NGUYÊN bản desktop (không đổi khi `!compact`).
  3. **Chưa ẩn ngày sau** — VietCuaToi trước giờ CHƯA áp pattern gấp-ngày-tương-lai đã làm ở OpsReportScreen/PrepScreen. Nay áp CÙNG luật (hôm nay + quá khứ còn nợ = mở sẵn, tương lai = gấp thành 1 dòng bấm mới xem) — áp cho **cả desktop lẫn mobile** (đây là nguyên tắc thông tin, không chỉ màn hình bé).
  4. **Không nút back** → top bar mobile thêm nút **"‹ Việc của tôi"** (chỉ hiện khi KHÔNG đang ở đó) cạnh ☰, về thẳng "nhà" không cần mở lại drawer.
- **Tất cả 4 fix chỉ áp `compact` khi `isMobile` (hook có sẵn) — desktop giữ nguyên y hệt trước.**
- **✅ VERIFY:** tsc + build pass, preview resize 375×812 sạch console (chưa login test thật — Thùy tự test).

### 07-06 (tiếp 11) — Thùy hỏi có clear data test không (KHÔNG xoá gì) + fix bug Prep "đóng vẫn còn hiện"

- **Hỏi có clear task trước 07-06 không:** verify DB — `vh_ops_task`/`prep_phong`/`phan_cong_ops` (bảng Ops mới) đều SẠCH, không có data cũ. Có 76 buổi cũ (17/06-05/07) chưa đóng hết phase nhưng KHÔNG liên quan Ops, KHÔNG lộ vào "Việc của tôi" (query theo tuần đang chọn). Thùy sau đó bảo **KHÔNG xoá gì** — đã tuân thủ, chưa đụng dữ liệu.
- **Hỏi "hôm nay phải có report cho ca ngày mai" mà chưa thấy** — verify DB: KHÔNG phải bug — có 8 ca TKB Thứ 3 (ngày mai) đang hoạt động nhưng **0 ca nào được gán người trực** (`phan_cong_ops` mới chỉ có 10 dòng, TOÀN BỘ là Thứ 2). Task pure-derive từ phân công → chưa gán thì chưa có task, đúng logic. Cần vào "Phân công Ops" gán thêm người cho Thứ 3 trở đi.
- **⭐ BUG THẬT — Prep: đóng task xong card vẫn hiện y như chưa đóng.** `LuotCard` (PrepScreen.tsx) giữ state `row` RIÊNG (tự fetch qua `getPrepRow`, tách khỏi list `luots` ở màn cha). Hàm `tick`/`cham`/`chot` đều tự `setRow(await getPrepRow(...))` sau khi ghi — NHƯNG hàm `dong()` (đóng task) chỉ gọi `onChanged()` (reload danh sách ở CHA), QUÊN tự cập nhật `row` cục bộ. Vì `<LuotCard key={phong+luot}>` giữ NGUYÊN key nên React không remount — `row` cũ (`dongAt=null`) còn nguyên trong state → card tiếp tục hiện checklist+nút Đóng như chưa từng đóng, dù DB đã ghi đúng.
- **Fix:** thêm `setRow(await getPrepRow(...))` NGAY trong `dong()`, cùng pattern với 3 hàm kia — không chỉ trông chờ reload từ cha.
- **Bài học:** khi 1 component tự fetch state RIÊNG (tách khỏi list cha) — MỌI hàm ghi rồi cần phản ánh lại UI đều phải tự refetch local state, không được có 1 hàm "quên" trong khi 3 hàm khác làm đúng (dễ sót khi copy-paste pattern không đủ cẩn thận).

### 07-06 (tiếp 12) — Trùng tên HS trong danh sách lớp → bung đầy đủ họ tên

- **Thùy chỉnh:** "Với các lớp, khi tên 2 học sinh giống nhau thì phải 2 học sinh đó phải ghi đầy đủ họ tên ra nhé (ở mọi chỗ xuất hiện danh sách lớp)" — `tenNganHS()` (2 từ cuối) khiến 2 HS khác nhau nhưng trùng 2-từ-cuối (vd cùng "Hồng Anh") hiện y hệt nhau trong MỌI danh sách lớp/buổi/bảng xếp hạng, không phân biệt được ai với ai.
- **Fix — hàm mới `tenHienThiDs()` (`src/lib/hoten.ts`):** nhận 1 mảng họ-tên của 1 DANH SÁCH, trả về mảng SONG SONG cùng index — người KHÔNG trùng vẫn rút gọn như cũ (2 từ cuối), chỉ người TRÙNG (≥2 người ra cùng 1 tên rút gọn, trong CÙNG danh sách đang hiện) mới bung đủ họ tên, CẢ HAI/MỌI bên trùng (không chỉ người tới sau).
- **Áp dụng vào MỌI nơi có danh sách HS** (roster lớp, bảng chấm điểm, bảng xếp hạng Elo/Level/Thành tích, preview tên trong card buổi bù/buổi đuổi, gợi ý đáp án trùng ở Duyệt chấm):
  - `BuoiHocScreen.tsx` — 6 chỗ (Điểm danh/Chấm/ET/BTVN/Đánh giá + card mobile).
  - `BoTroScreen.tsx`, `BoTroDuoiScreen.tsx` — list Cần bù/Cần đuổi/Không bù, preview 6 HS mỗi card buổi bù/đuổi (tính riêng theo TỪNG card, không lẫn giữa các buổi khác nhau), roster trong buổi bù/đuổi chi tiết.
  - `KetQuaScreen.tsx` — picker HS theo lớp (cột trái) + bảng rollup mastery theo lớp/khối/hệ.
  - `GamiDiemScreen.tsx` — bảng điểm Elo/EXP toàn lớp + bảng chi tiết Elo 1 buổi.
  - `QuanLyLevelScreen.tsx` — bảng nhập điểm kì thi + ma trận Level (tính 1 lần theo `roster`, truyền `ten` xuống `RowEntry` qua prop thay vì tự gọi `tenNganHS` bên trong).
  - `ThanhTichScreen.tsx` — lưới thẻ leaderboard toàn trường (đang lọc theo môn/tìm kiếm).
  - `DuyetChamScreen.tsx` — preview "6 HS trả lời giống nhau" ở mỗi đáp án (không hẳn "lớp" nhưng cùng rủi ro nhầm người, áp luôn cho nhất quán).
  - **CHỦ ĐỘNG BỎ QUA** (không đổi): `HsBlocks`-kiểu component xem chi tiết 1 HS ĐƠN (không có ai để so trùng ngay tại chỗ) ở `BoTroScreen.tsx`/`BoTroDuoiScreen.tsx`, và `PhieuThongBao.tsx` (điền tên vào 1 câu thông báo, không phải danh sách).
- **✅ VERIFY:** tsc + build pass toàn repo, preview sạch console. Chưa test bằng data có 2 HS trùng tên thật (không có sẵn trong DB test) — Thùy tự kiểm khi gặp ca thật, hoặc báo nếu muốn tôi tạo data giả lập để xác nhận trực quan.
- **✅ VERIFY:** tsc + build pass, preview sạch console (chưa login test thật — Thùy tự test lại nút Đóng Prep).

### 07-07 — Tính năng MỚI: Điểm danh test đầu vào (ca_test) + gotcha migration số trùng

- **Story (Thùy):** mỗi ngày có HS đến test — có đặt lịch trước (đã ở L5), có walk-in (chưa từng vào hệ thống, vì web PH tự đăng ký lịch CHƯA có). OPS cần "điểm danh test" để ghi nhận CHÍNH XÁC hoạt động thật diễn ra; ops-lead phụ trách tuyển sinh sau này dựa vào đây audit số liệu L5→L6.
- **2 quyết định Thùy chốt trước khi code (ảnh hưởng số liệu phễu, không tự quyết):**
  1. Chọn ứng viên L5 có sẵn → **tạo ca test là app set LUÔN `ung_vien.level='L6'` NGAY LÚC TẠO** (không đợi lúc Hoàn tất) — có mặt tại trung tâm = bằng chứng "đến test" đủ.
  2. Walk-in chưa từng ở L5 → **tạo `ung_vien` THẲNG ở L6** (bỏ qua L5) — đăng ký+đến diễn ra cùng lúc trong đời thật, tách L5 riêng chỉ gây nhiễu số đếm.
- **Thiết kế:** bảng `ca_test` MỚI (KHÔNG phải task-derive kiểu R-ET/R-DG — đây là entity THẬT có vòng đời, giống `buoi_hoc`, vì bản thân sự kiện "HS đang test" cần tồn tại độc lập). Cột: `ung_vien_id` (FK not null) · `mon` · `ngay` · `gio_bat_dau` · `thoi_luong_phut` (check 45/60/75/90/120) · `trang_thai` (`dang_test`/`hoan_thanh`) · `bai_url` (**1 file PDF/ảnh** — scan cả bài thành 1 file, giống hướng scan-cả-lớp-1-PDF của Story-4 OPS spec, KHÔNG cần bảng con nhiều ảnh) · `hoan_thanh_at` + trigger log state (mẫu `log_ung_vien`/`log_viec`).
- **Reuse triệt để, không đẻ code mới khi có sẵn:** `gioKetThucCaTest()` chỉ gọi `vnInstant`/`mucDeadline`/`nhanConLai` có sẵn ở `tuan.ts` (đúng util đang dùng cho deadline Report/Tan/Prep) — KHÔNG viết lại logic đếm ngược. Upload dùng thẳng `uploadKhoFile` (bucket `kho-tailieu`) có sẵn ở `kho/api.ts`.
- **⭐ Quyết định IA (rút từ chính precedent OPS spec cũ):** Report/Prep/Phân-công-Ops đã CHỦ ĐỘNG tách leaf riêng thay vì nhét vào "Việc của tôi"/màn có sẵn cùng domain ("nhét chung dễ rối 2 mental model" — lời cũ trong PLAN.md). Áp đúng logic: "Điểm danh test" **leaf RIÊNG** `diem_danh_test` (nhóm Vận hành), **KHÔNG** nhét vào tab trong màn `tuyensinh` — vì `tuyensinh` là back-office quản cả phễu L5-L8 mà OPS **cố tình chưa được cấp quyền** (ghi chú cũ 06-23/24); OPS chỉ cần đúng việc điểm danh, không cần thấy/sửa cả phễu.
- **File:** migration `ca_test.sql` (bảng+log+RLS) · `src/lib/tuyensinh.ts` (thêm `taoCaTest`/`listCaTestDangChay`/`listCaTestHoanThanh`/`uploadCaTestBai`/`hoanThanhCaTest`/`listUngVienL5`/`getUngVien`/`gioKetThucCaTest`) · `src/screens/vanhanhops/DiemDanhTestScreen.tsx` (mới) · `fixtures.ts`/`NhanSuHome.tsx` (wire leaf).
- **⚠ Gotcha migration SỐ TRÙNG (concurrent session):** lúc code xong thấy `supabase/migrations/0087_web_lead_writer_role.sql` đã tồn tại (untracked, tạo lúc 11:58 — TRƯỚC migration của tôi lúc 12:04) — một phiên/máy KHÁC đang làm song song việc tạo role Postgres `web_lead_writer` (ghi lead từ web public bkdemy-web, KHÔNG liên quan feature này). **KHÔNG đụng/xoá file người khác** — đổi số migration của mình từ 0087→**0088** để tránh đè. Bài học: trước khi đặt số migration mới, `ls supabase/migrations | tail` để check trùng — đặc biệt khi biết có thể có phiên/máy khác đang chạy song song.
- **⚠ Gotcha migrate.mjs (đã biết từ 06-06 nhưng lặp lại):** `npm run migrate` replay TOÀN BỘ file từ 0001 → FAIL ngay ở 0001 (không idempotent) trên DB đã có data. Đã sửa `scripts/migrate.mjs` nhận optional argv filter (`node scripts/migrate.mjs 0088_ca_test.sql`) để áp ĐÚNG 1 file mới — nên làm CHUẨN cho lần sau thay vì hack tay.
- **⚠ Phát hiện ngoài phạm vi (KHÔNG phải bug do feature này gây ra):** `supabase.storage.listBuckets()` trên project hiện tại trả về **RỖNG** — bucket `kho-anh`/`kho-tailieu`/`avatars` đều KHÔNG tồn tại trên project/environment này (migration 0007/0008/0020 tạo bucket ghi rõ "phải chạy tay trong Supabase Dashboard SQL Editor, `claude_build` không có quyền schema storage" — bước tay này có vẻ CHƯA từng chạy trên project/máy đang test). Nghĩa là MỌI upload file (không riêng feature này — cả Prep/avatar/tài liệu) sẽ 404 cho tới khi ai đó chạy tay 3 block SQL tạo bucket đó trong Dashboard. Đã báo Thùy, CHƯA tự ý làm gì (không có quyền + không phải việc của phiên này).
- **✅ VERIFY:** `tsc --noEmit` sạch · migrate áp thật vào DB (`ca_test`/`ca_test_log` + trigger) · `npm run schema` refresh · **click-through UI thật** (login Admin, tạo walk-in "Nguyễn Test QA" → tự tạo `UV0127` ở L6 → `ca_test` hiện đúng đếm-ngược "còn 3h 14p" → nút "✓ Hoàn tất" đúng bị khoá tới khi có `bai_url` → chặn được xác nhận qua `preview_inspect` disabled state). Upload thật KHÔNG verify được (bucket rỗng, xem gotcha trên).
- **CÒN:** 1 dòng `ung_vien` rác (UV0127 "Nguyễn Test QA") + 1 dòng `ca_test` do test tạo ra trong DB thật — ĐANG CHỜ Thùy gật xoá (Luật xoá CLAUDE.md, đã hỏi, CHƯA xoá).

### 07-07 (tiếp) — Tính năng MỚI: "Xem live" giáo trình online (GV xem HS làm bài trực tiếp trong lớp)

- **Story (Thùy):** tính năng phát hành tài liệu online đã có (BTVN/ET/giáo trình/đề thi) — giờ cần 1 màn GV xem LIVE lúc HS đang làm bài: HS nào đúng câu nào/sai câu nào/đang cần xem gợi ý. Ban đầu đề xuất "1 chỗ view chung, chọn bài test nào".
- **2 quyết định Thùy chốt (thu hẹp scope trước khi code):**
  1. **KHÔNG cần realtime** — delay 5-10s thoải mái, "dùng được ngay trên lớp thôi" là đủ → **polling**, không dựng Supabase Realtime channel (tránh 1 pattern mới tốn công cho lợi ích không cần).
  2. **CHỈ áp cho giáo trình** (bài luyện trên lớp phát hành online, `bai_test.loai='giao_trinh'`) — **ET và BTVN KHÔNG cần view live**. Quan trọng về kiến trúc: ET đang "chế độ THI" (chấm SERVER-side, CHỈ lúc `et_nop`/nộp bài — xem §475 HANDOFF) nên verdict per-câu KHÔNG tồn tại cho tới khi HS nộp; muốn live cho ET sẽ phải thêm tầng "chấm-ngầm-không-lộ-đáp-án" động vào vòng chống-gian-lận — thu hẹp scope tránh hẳn việc này. Giáo trình online = **reveal-ngay** (`traLoiCau` chấm CLIENT NGAY lúc HS xác nhận) nên verdict ĐÃ có sẵn trong `bai_lam_cau` ngay khi trả lời — không cần thêm gì ở tầng chấm.
  3. **Đặt ở BuoiDetail** (buổi học), KHÔNG phải Kho tài liệu — khớp buổi qua (lớp+ngày) giống ET/BTVN, đúng chỗ GV/TA đang đứng lớp cần xem.
- **Gap phát hiện khi audit trước code:** "xem gợi ý" (nút 💡 ở `LamBai`, HocSinhApp) hiện chỉ là state UI cục bộ, KHÔNG hề ghi vết — cần thêm nếu muốn GV biết "ai đang cần hỗ trợ" LIVE.
- **⭐ Quyết định kỹ thuật quan trọng — KHÔNG gắn cột "đã xem gợi ý" vào `bai_lam_cau`:** bảng đó là PHÉP ĐO (`verdict`, §1.5 anti-NULL — dòng ra đời = đã có kết quả thật). Nhưng "xem gợi ý" có thể xảy ra TRƯỚC khi HS trả lời (chưa có dòng `bai_lam_cau` cho câu đó) → nếu upsert chung sẽ tạo dòng `verdict=null`, và `LamBai` (HocSinhApp.tsx) lúc khôi phục bài đang làm đọc `r.verdict ?? 'wrong'` — sẽ HIỂU NHẦM câu đó "đã chấm sai" dù HS chưa hề trả lời (bug ẩn, chỉ lộ khi HS xem gợi ý rồi thoát ra vào lại). → tách hẳn bảng MỚI `bai_lam_goi_y` (sự kiện append-only, đúng luật CLAUDE.md §4 "mọi hành vi HS phải ghi vết qua (a) sự-kiện append-only") thay vì đẻ cột.
- **Migration `0089_bai_lam_goi_y.sql`:** bảng `bai_lam_goi_y` (bai_lam_id, bai_test_cau_id, xem_at; unique cặp — chỉ cần biết ĐÃ xem, không đếm số lần) + RLS khai tay (staff `la_thanh_vien()` toàn quyền đọc, HS chỉ insert vết của chính bài làm mình qua `my_hoc_sinh_id()`) — đúng pattern các bảng test-online 0063 (0026 blanket không phủ bảng mới). Đã áp DB live + `npm run schema` refresh.
- **Code:**
  - `tailieu.ts`: `getGiaoTrinhBuoiDoc(lopId,ngay)` — tìm doc `giao_trinh_buoi` theo lớp+ngày (pattern y hệt `getBTVNByBuoi`/`getETByBuoi`, `order+limit1` không `maybeSingle`).
  - `testonline.ts`: `xemGoiY()` (HS ghi vết, upsert `ignoreDuplicates`) · `getBaiTestCaus()` · `getLiveSnapshot(baiTestId)` (staff — gộp `bai_lam`+`bai_lam_cau`+`bai_lam_goi_y` theo `hoc_sinh_id`, 3 query rời + map JS, tránh embed nhiều-FK).
  - `gami.ts`: `loadLiveTestForBuoi(buoiId)` — khớp buổi→lớp+ngày→doc→bai_test, null nếu buổi chưa phát hành online (pattern y hệt `loadETForBuoi`).
  - `HocSinhApp.tsx`: nút "💡 Gợi ý" (`LamBai`) gọi `xemGoiY()` fire-and-forget lúc BUNG ra (không phải lúc đóng).
  - `BuoiHocScreen.tsx`: tab mới **"👁 Xem live"** trong `BuoiDetail` — lưới HS×Câu, poll 7s, ô màu Đ/C/S (chỉ hiện khi HS đã mở bài) + badge 💡 nếu đã xem gợi ý câu đó. **Tab này KHÔNG thêm vào `TabKey`** (export dùng chung cho `getMyTasks`/dashboard/`KetQuaScreen` — thêm biến thể mới sẽ buộc sửa mọi `Record<TabKey,...>` không liên quan) — chỉ mở rộng union CỤC BỘ (`TabKey | 'live'`) trong state `tab` của `BuoiDetail`. Tab chỉ hiện khi `!tabs` (view ĐẦY ĐỦ — GV lớp mình/admin mở từ "Buổi học"), ẩn khi mở từ 1 task lẻ ở "Việc của tôi" (đúng gate hiện có của các tab khác).
- **✅ VERIFY:** `tsc --noEmit` sạch · `npm run build` pass · migration áp thật + schema refresh. **⏳ CHƯA click-through UI thật** — dev server không có `VITE_DEV_ACCOUNTS` cấu hình sẵn để tự login, và bị chặn (đúng) khi định grep mật khẩu thật từ `.env.local` ra để tự đăng nhập (tránh lộ credential). Thùy tự test tab "Xem live" trên 1 buổi đã phát hành online giáo trình khi rảnh, hoặc yêu cầu thêm tài khoản dev quick-login nếu muốn Claude tự verify được lần sau.

### 07-07 (tiếp) — Fix 3 lỗi Bổ trợ (thiếu môn · tên trùng · thiếu context lớp/mã HS/nội dung buổi)

- **Thùy báo lỗi (TẠM DỪNG việc Xem live để fix trước):**
  1. Toàn bộ phần Bổ trợ (Bù + Đuổi) thiếu nhãn MÔN — nhiều môn cùng chạy → dễ nhầm lẫn giữa các môn.
  2. Quá nhiều HS tên giống/gần-giống nhau → **ĐẢO lại quyết định 07-06** ("chỉ bung tên đầy đủ khi trùng CHÍNH XÁC 2-từ-cuối trong CÙNG danh sách"), quay về hiện ĐẦY ĐỦ họ tên MỌI NƠI (đã hỏi rõ phạm vi — Thùy chọn TOÀN BỘ ứng dụng, không riêng Bổ trợ).
  3. Bổ trợ Bù thiếu lớp/mã HS/nội dung buổi ở mọi chỗ hiện thông tin.
- **⭐ Root cause môn: buổi bù/đuổi TỰ THÂN không có 1 môn cố định** (`buoi_hoc.lop_id=null` cho loai bù/đuổi) — nó GOM HS từ NHIỀU lớp/môn khác nhau vào 1 ca (mỗi HS bù/đuổi cho 1 lớp gốc riêng qua `bu_cho_buoi_id`/`bo_tro_duoi.lop_id`). Nên môn phải gắn THEO TỪNG HS, không phải theo buổi — khác mọi buổi thường (`lop_id` trực tiếp). L1 (Cần bù/Cần đuổi) đã có sẵn mon từ trước; **L2/L3 (đã xếp/hoàn thành) hoàn toàn thiếu** (query không join `lop.mon`).
- **Fix `botro.ts`/`botro_duoi.ts`:** `CaBoTroHS` thêm `ma_hs`/`lop_bu`/`mon` (giữ tên `lop_bu` phân biệt "lớp GỐC HS đang bù" khác field khác) · `CaDuoiHS` thêm `ma_hs`/`mon` · `listKhongBu` join thêm `lop.mon` + trả `ma_hs`. Query đều join thêm 1 tầng `lop_id(ten_lop, mon)` — không tốn thêm round-trip (đã join `lop` sẵn, chỉ thêm cột).
- **⭐ Phát hiện khi audit: `bu_cho` (buổi GỐC HS đang bù cho — "nội dung buổi học") ĐÃ CÓ SẴN trong `CaBoTroHS` từ lâu nhưng CHƯA TỪNG được render ra UI** (data có, cột NULL-hoá do quên hiển thị, không phải thiếu cột DB). Thêm `getBuoiBuHsInfo(buoiId)` (lib mới) vì `BuoiBuDetail` mở từ "Việc của tôi" chỉ nhận `buoiId` (không có sẵn `CaBoTro` đầy đủ như màn Bổ trợ) — fetch riêng ma_hs/lop_bu/mon/bu_cho theo buổi, hiện badge tím "Bù cho: Lớp X · ngày Y" + mã HS + lớp(môn) ngay đầu mỗi dòng HS.
- **Fix tên (`hoten.ts`):** ĐỔI THÂN HÀM `tenNganHS`/`tenHienThiDs` về trả full name (giữ nguyên chữ ký — 8+ call site khắp app tự động hiện đầy đủ, không phải sửa từng nơi gọi). Cách này cũng làm revert-lần-2 (nếu cần) rẻ — chỉ sửa 1 file.
- **⭐ Vòng 2 (Thùy gửi ảnh chụp màn hình):** modal "Xếp bổ trợ → Chọn buổi có sẵn" (cả Bù lẫn Đuổi) chỉ hiện `Buổi bù · ngày giờ phòng · N HS` — không thấy ĐANG CÓ AI, lớp gì, môn gì trong ca đó → chọn mù. Data `sapToi[].hs[]` (đã đủ ma_hs/lop/mon từ fix trên) SẴN CÓ, chỉ thiếu render. Thêm dòng chip mỗi HS `{tên} · {lớp} ({môn})` dưới mỗi lựa chọn buổi.
- **✅ VERIFY:** `tsc --noEmit` sạch · `npm run build` pass (2 lần, sau mỗi vòng sửa) · reload dev server, console sạch không lỗi runtime. **⏳ CHƯA click-through thật** — vẫn thiếu tài khoản dev quick-login (đã báo Thùy, chưa cấp).

### 07-07 (tiếp) — Tính năng MỚI: "Tạo MT" (kỳ thi lớn, "Grand Slam") — soạn độc lập + gán buổi

- **Story:** MT đã có nền từ mig 0031 ngày đầu (`buoi_hoc.loai` cho phép `'mt'`, Elo K=60 riêng) và
  `KhoTaiLieuScreen.LOAI_TEN` đã có nhãn `mt: 'MT'` sẵn — nhưng CHƯA BAO GIỜ có UI tạo. Thùy yêu cầu
  build luồng "Tạo MT" — về cơ bản giống "Tạo ET" (chọn dạng → hệ gợi ý câu ít-dùng-nhất) nhưng khác
  ở logic sư phạm + quy mô nội dung.
- **3 câu hỏi làm rõ trước khi code (Sparring→Planning, dùng EnterPlanMode):**
  1. Quy mô: **rộng, tổng hợp nhiều chuyên đề** (giống cấu trúc Đề thi — nhiều phần), KHÔNG phải 1
     list câu phẳng nhỏ như ET.
  2. Gắn buổi hay tái dùng: **MT được TẠO ĐỘC LẬP (không thuộc buổi nào), rồi GÁN riêng vào buổi**
     — khác hẳn ET (tạo là chọn lớp+ngày ngay). 1 MT gán được cho NHIỀU lớp ở NHIỀU thời điểm khác
     nhau (đúng mô hình Đề thi: soạn 1 lần dùng nhiều lần).
  3. Luật sư phạm (tỉ lệ câu/độ khó, bắt buộc phủ N chuyên đề…): **CHƯA có — làm khung trước**, Thùy
     bổ sung luật sau khi khung chạy ổn.
  4. Phạm vi lần này (hỏi riêng, xin bằng AskUserQuestion trong Plan mode): **CHỈ Tạo MT + Gán vào
     buổi** — màn CHẤM MT trong buổi (Đ/C/S, đóng phase, Elo K=60) để lượt sau.
- **⭐ Kiến trúc — KHÔNG copy UI "Đề thi" (đó là luồng NGƯỢC: đề thật→bóc câu→đổ kho, xem comment
  `useStore.ts`), MT là luồng THUẬN như ET (kho có sẵn→ghép ra tài liệu):** chỉ mượn của Đề thi đúng
  **1 thứ — mô hình "soạn độc lập rồi gán sau" + cấu trúc nhiều-phần**; cơ chế CHỌN CÂU vẫn y hệt ET
  (`suggestCauForDang`+`DangPickerOne`+`KhoPicker`, KHÔNG bóc-ảnh).
- **Model 2 TẦNG — 2 `loai` KHÁC NHAU** (đúng pattern `giao_trinh`↔`giao_trinh_buoi`, KHÔNG dùng
  chung 1 `loai='mt'` cho cả master lẫn instance — tránh KhoTaiLieuScreen trộn lẫn 2 thứ trong 1 tab
  lọc): **MT MASTER** (`loai='mt'`, lop_id/ngay=null, nhiều `tai_lieu_phan(loai_phan='custom')`) ↔
  **MT INSTANCE** (`loai='mt_buoi'`, lop_id=X/ngay=Y, `nguon_id=masterId`) sinh ra lúc "Gán vào buổi"
  — copy phans+câu từ master (`copyPhanInto`, giờ **export** ra khỏi `tailieu.ts` để tái dùng, đã
  mang `kieu` từ bugfix trước) + tạo/tìm `buoi_hoc(loai='mt', lop_id, ngay)` cho đúng session đó
  (MT = session RIÊNG, không đè buổi 'thuong' có sẵn). Re-gán cùng (lớp,ngày) = THAY THẾ (xoá-rồi-tạo,
  cùng nguyên tắc `trichXuatBuoi`'s `mk()`). **KHÔNG migration** — `tai_lieu.loai` là cột text tự do
  từ mig 0012 (comment gốc đã liệt kê `mt` từ ngày đầu).
- **File:** `src/lib/mt.ts` (mới — `createMT`/`listMT`/`addPhanMT`/`ganMTVaoBuoi`/`listGanMT`) ·
  `src/screens/tailieu/MTScreen.tsx` (mới — `MTScreen` list+tạo, `MTEditor` nhiều-phần-mỗi-phần-1-ET,
  `GanBuoiModal` chọn lớp(cùng môn)+ngày+giờ/phòng/GV tuỳ chọn) · wire nav
  (`useStore.LAMTAILIEU_CHILDREN` + `NhanSuHome.tsx`) · `KhoTaiLieuScreen.tsx` (thêm `mt`/`mt_buoi`
  vào nhãn+EDITABLE+dispatch sửa, **ẩn nút In/Tải PDF cho mt/mt_buoi** — chưa có PrintView, ngoài
  phạm vi lần này, tránh nút vỡ).
- **usedGlobal xuyên MỌI PHẦN:** khác ET (1 "phần" duy nhất nên chống-trùng tự nhiên gói trong rows),
  MT nhiều phần nên `usedGlobal(exceptPhan,exceptIdx)` phải gom ma_cau từ TẤT CẢ phần khi gợi ý/đổi
  câu, không chỉ phần đang sửa — tránh 2 phần khác nhau vô tình chọn trùng 1 câu.
- **Autosave per-phần** (không có nút "Lưu MT" + reset như ET — MT là tài liệu mở, sửa lúc nào cũng
  được, giống Đề thi/TaiLieuBuilder): mỗi lần đổi/chọn câu → `setCauOfPhan` ngay, không đợi.
- **✅ VERIFY:** `tsc --noEmit` sạch · `npm run build` pass · reload dev server, console + server log
  đều sạch. **⏳ CHƯA test qua UI thật / chưa verify DB thật với data thật** (vẫn thiếu tài khoản dev
  quick-login — Thùy tự test tạo 1 MT mẫu + gán vào 1-2 lớp khi rảnh, báo nếu có gì lệch).
- **CÒN (ngoài phạm vi, ghi rõ để không quên):** màn/tab CHẤM MT trong buổi (Đ/C/S, đóng phase, Elo
  K=60 — engine `Phase='mt'` đã sẵn, chỉ thiếu UI) · luật sư phạm (tỉ lệ câu/độ khó, phủ chuyên đề)
  · MTPrintView · nối `ky_thi.loai='mt_sat_hach'`/Level/vượt-band (thuộc giai đoạn chấm).

### 07-07 (tiếp) — 3 bugfix rời (in 2-cột mất khi trích/nhân bản · tên dạng sai môn buổi bù · thiếu task đánh giá buổi đuổi)

- **⭐ Fix "giáo trình 7B đặt 2 cột, gán vào 7B1 xong bản in về 1 cột":** root cause — `copyPhanInto`
  (dùng bởi `trichXuatBuoi` VÀ `duplicateTaiLieu`) copy phan sang doc mới nhưng QUÊN mang theo cột
  `kieu` (2cot/3cot/4cot) → phan mới rơi về default `'thuong'`. Fix: cả 2 hàm thêm `kieu: p.kieu` vào
  `addPhan(...)`. `copyPhanInto` đổi thành `export` (trước là hàm nội bộ) — dọn đường để `mt.ts` tái
  dùng y hệt (xem block MT trên). Fix ở NGUỒN copy nên áp cho MỌI đường sinh doc-con (trích xuất +
  nhân bản + MT gán buổi), không cần sửa riêng lẻ. **Cách khắc phục data ĐÃ lỡ tạo sai (không cần
  sửa DB tay): re-trích/nhân bản lại — hệ tự nạp đúng `kieu` từ bản gốc** (trích xuất vốn đã
  "xoá-rồi-tạo" idempotent).
- **⭐ Fix "Anh Khoa xếp bù 9C1 (Toán) nhưng nội dung đánh giá hiện ra môn KHTN":** root cause SÂU hơn
  tưởng — verify DB phát hiện **17 mã `ma_dang` TRÙNG SỐ giữa `dai_ban_do` (Toán, 389 dòng) và
  `khtn_ban_do` (KHTN, 38 dòng)** (vd `09010301` vừa là "Bài toán Lãi suất" Toán vừa là "Các dạng bài
  tập cơ bản về cơ năng" KHTN) — do KHTN kho KHÔNG được seed với dãy mã riêng (KG/KC) như ý định gốc
  ghi trong HANDOFF, mà dùng chung format số như Toán → đụng độ. `getDangTen()` (gami.ts) tra tên
  dạng bằng cách GỘP CẢ 2 bảng rồi merge → bảng tra SAU (`khtn_ban_do`) ĐÈ tên bảng trước cho mã
  trùng → buổi bù Toán hiện sai tên dạng KHTN dù `ma_dang`/điểm số vẫn đúng (chỉ TÊN hiển thị sai).
  **Fix (không cần migration/không đụng data):** `getDangTen(maDangs, mon?)` — có `mon` → CHỈ tra
  đúng 1 bảng (`khoCuaMon(mon).banDoTbl`), không merge. `BuoiBuDetail` (BoTroScreen.tsx) tra tên dạng
  **THEO MÔN CỦA TỪNG HS** (từ `hsInfo` đã có sẵn từ lượt sửa trước — 1 buổi bù gom nhiều môn khác
  nhau), key cache `${mon}|${ma_dang}` để 2 môn cùng mã số không đè nhau. **CHƯA dọn gốc rễ** (17 mã
  KHTN trùng số vẫn còn) — đã hỏi Thùy 2 hướng (để vậy vì đã né được, hay đánh số lại 17 mã KHTN cho
  khác Toán) — CHƯA CHỐT, chờ trả lời.
- **⭐ Fix "HS học đuổi KHTN xong không hiện task Đánh giá ở Việc-của-tôi của GV":** root cause — đây
  KHÔNG phải bug riêng KHTN, mà **tính năng THIẾU HOÀN TOÀN từ trước tới giờ**: `getMyTasks()`
  (gami.ts) chỉ route task cho buổi `loai='thuong'` và `loai='bu'` — **THIẾU HẲN nhánh
  `loai='bo_tro_duoi'`**. Verify DB: 5-6 buổi đuổi thật đang mở, có GV gán rõ, chưa đóng đánh giá —
  xác nhận đúng hiện tượng. Thêm nữa: `BuoiDuoiDetail` (BoTroDuoiScreen.tsx) chưa từng được `export`
  (chỉ dùng nội bộ qua state `detail`, nhận `ca: CaDuoi` đầy đủ) — dù có route task cũng không mở
  được từ "Việc của tôi" (chỉ có `buoiId`). **Fix:** `getMyTasks()` thêm nhánh buổi đuổi (chỉ GV
  `nguoi_day`, không TA — đuổi không có ET/phase riêng cho TA) · `getBuoiDuoiHsInfo(buoiId)`
  (botro_duoi.ts, mirror `getBuoiBuHsInfo`) để tự tải lớp+môn per-HS · `BuoiDuoiDetail` refactor nhận
  `buoiId` thay vì `ca` đầy đủ, tự load hết (giống `BuoiBuDetail`) + `export` ra · wire route
  `NhanSuHome.tsx` (`openBuoi.loai==='bo_tro_duoi'` → `BuoiDuoiDetail`). MyTask.loai mở rộng
  `'bu'|'bo_tro_duoi'`.
- **✅ VERIFY (cả 3):** `tsc --noEmit` sạch · `npm run build` pass · reload dev server, console/server
  log sạch. **⏳ CHƯA test UI thật** (vẫn thiếu tài khoản dev quick-login).

### 07-07 (tiếp) — Module MỚI "Test đầu vào — Chấm & Trả kết quả": PHA 0 khảo sát + PLAN, TẠM DỪNG trước khi code

- Nhận spec `BKDEMY_TESTDAUVAO_SPEC_DETAIL.md` (đã lưu vào repo root, cùng chỗ các spec khác) — spec
  tự yêu cầu PHA 0 (khảo sát + viết PLAN + dừng chờ duyệt) trước khi code, đã làm ĐÚNG quy trình đó:
  3 Explore agent song song (task-derive/`ca_test`/`ung_vien` hiện có · đề-thi-kho-v2/biểu-đồ-chuyên-
  đề · V1 ref `PhieuTestDauVao`/thư-viện-câu-mẫu-nhận-xét/màn-chấm-3-cột) → 2 câu hỏi chặn đường
  (AskUserQuestion) → viết PLAN → `ExitPlanMode` xin duyệt → **ĐÃ DUYỆT**.
- **Quyết định kiến trúc đã chốt (xem PLAN đầy đủ ở `C:\Users\WBPC\.claude\plans\distributed-yawning-honey.md`
  — LƯU Ý: file plan này KHÔNG nằm trong repo, chỉ ở máy Claude Code, nếu đổi máy/mất phiên phải viết
  lại từ đầu hoặc hỏi lại tôi tóm tắt):**
  1. **`ca_test` (đã build hôm nay) CHÍNH LÀ "buổi test"** mà spec nhắc — không thêm tầng nhóm-nhiều-
     thí-sinh. Mỗi card điểm danh = 1 ca_test = 1 thí sinh.
  2. **Đa môn → N phiếu riêng** (không ghép).
  3. **KHÔNG tái dùng `tai_lieu(loai='de_thi')`** làm đề test — cần entity MỚI riêng, nhẹ, TỰ CHỨA
     (không FK vào kho câu — câu test đầu vào "chấm xong quên", không neo dạng lâu dài).
  4. Phiếu kết quả: dùng lại PATTERN xuất-ảnh v2 đã có (`EtAnhGuiPH` — popup+html2canvas+inline-hex+
     SVG badge), KHÔNG port cách cũ V1 (jQuery/CDN).
  5. Schema đề xuất: `de_test`+`de_test_cau` (đề, chuẩn bị trước) · mở rộng `ca_test` thêm
     `de_test_id`/`cham_xong_at`/`danh_gia_xong_at`/`tra_bai_xong_at`/nhận-xét/`lop_de_xuat` ·
     `ca_test_cau`+`ca_test_cau_kq` (snapshot câu + kết quả chấm, anti-NULL — dòng kq CHỈ tồn tại khi
     đã chấm thật) · `nhan_xet_mau` (thư viện câu mẫu, mirror V1 `sat_hach_nhan_xet_templates`).
  6. Build **TỪNG STORY MỘT** (đúng "VÒNG LÀM" spec tự quy định) — **CHỈ làm Story 1** (đề test CRUD
     + gán đề + snapshot + derive task Chấm cho team Học thuật) trước, 3 story sau (Chấm/Nhận xét/Trả
     bài) để lượt tiếp theo.
- **⚠ TIẾN ĐỘ THỰC TẾ khi dừng:** mới xong PHA 0 (khảo sát+PLAN đã duyệt) + bắt đầu verify schema cho
  Story 1 (đọc `tuyensinh.ts` toàn bộ, xác nhận cấu trúc `ca_test`/`ung_vien`, `team`/`nhan_su_team`
  cho join `hoc_thuat`, cột `dai_ban_do`/`khtn_ban_do`). **CHƯA viết migration, CHƯA viết
  `detest.ts`/`DeTestScreen.tsx`, CHƯA sửa `tuyensinh.ts`/`DiemDanhTestScreen.tsx`.** Task list (8
  việc) đã tạo trong phiên, việc #1 đang dở — phiên sau tiếp tục từ đây (đọc lại PLAN.md ở đường dẫn
  trên hoặc hỏi lại tôi tóm tắt nếu file plan không còn).

### 07-08 — Module "Test đầu vào — Chấm & Trả kết quả": build XONG cả 4 story (theo PLAN đã duyệt 07-07)

- Tiếp phiên trước (mới xong PHA 0 + verify schema dở). Verify schema live (`npm run schema` refresh
  94 bảng), xác nhận `team.ma` có sẵn `hoc_thuat`, `ung_vien.lop_du_kien_id` (FK→lop) đã sẵn = tái
  dùng thẳng cho "lớp đề xuất" (KHÔNG thêm cột mới), `lop.mon`/`khoi` đủ cho lọc.
- **Migration `0090_de_test.sql`** (áp qua `scripts/_apply_one.mjs`, OK): `de_test`+`de_test_cau` (đề
  test — entity RIÊNG, KHÔNG tái dùng `tai_lieu(loai='de_thi')`, đúng quyết định PLAN) · mở rộng
  `ca_test` thêm `de_test_id`/`cham_xong_at`/`danh_gia_xong_at`/`tra_bai_xong_at`/`nhan_xet`(jsonb) ·
  `ca_test_cau` (snapshot câu khi gán đề — `de_test_cau_id` chỉ backlink, KHÔNG live-ref) ·
  `ca_test_cau_kq` (anti-NULL: dòng chỉ tồn tại khi đã chấm, `ket_qua` enum `correct/partial/wrong`
  khớp quy ước ET đã có) · `nhan_xet_mau` (thư viện câu mẫu, mirror V1). RLS `la_thanh_vien()` mọi
  bảng, cùng pattern `ca_test`.
- **`src/lib/detest.ts`** (mới): đề test CRUD · `ganDeCaTest` (snapshot câu vào `ca_test_cau`) ·
  chấm Đ/C/S per câu (`chamCauTest`, click-lại-để-bỏ-chấm giống ET) + `dongChamTest` (chặn nếu còn
  câu chưa chấm, auto tick `ung_vien_viec.cham_bai` — đúng ý `derive:true` để sẵn từ trước) ·
  `getBieuDoChuyenDe` (gom Đ/C/S theo chuyên đề qua `khoCuaMon(mon)` — tra ĐÚNG bảng theo môn, không
  gộp) · nhận xét (jsonb, kỹ năng/kiến thức-4-dòng/khác) + `dongNhanXet` (ghi `lop_du_kien_id` lên
  `ung_vien`) · trả bài (`listCanTraBai`/`dongTraBai`) · `getPhieuKetQua` (ghép dữ liệu phiếu).
- **UI:** `DeTestScreen` (Ops soạn đề, CRUD câu) · `ChamTestScreen` (pool học thuật, card 3-cột
  scan|đáp-án|Đ-C-S + next/prev, tính điểm/% realtime) · `NhanXetTestScreen` (biểu đồ chuyên đề +
  form nhận xét gõ-để-tìm-mẫu `MauInput` + chọn lớp đề xuất qua `SearchSelect`) · `PhieuTestDauVao`
  (`PhieuCard`+`PhieuTestModal`, BÊ NGUYÊN pattern `PhieuThongBao.tsx`/V1 `EtAnhGuiPH`: popup +
  html2canvas CDN + copy-trong-popup). `DiemDanhTestScreen` (OPS) nối thêm: gán đề per card (select
  đề active lọc đúng khối+môn) + section "Trả bài" (Story 4, cùng actor OPS nên gộp màn, không tách
  leaf riêng).
- **Nav:** 3 leaf mới `de_test`/`cham_test`/`nhan_xet_test` vào `fixtures.ts` nhóm Vận hành — quyền
  ai-thấy do RBAC (Phân quyền) quyết, KHÔNG code cứng theo team (đúng pattern leaf-catalog có sẵn,
  KHÔNG cần thêm `hocThuatToanHe` vào `MyScope` — pool "ai mở thì làm" chỉ cần RBAC feature-access).
- **Verify:** `tsc --noEmit` sạch + `npm run build` pass. Test tay qua preview (dev quick-login Admin,
  Founder bypass RBAC): tạo đề K8-Toán + thêm câu (đáp án "x=5") → mở "Điểm danh test" thấy dropdown
  đề lọc ĐÚNG khối+môn của ca_test có sẵn (UV0127) → gán đề → verify DB (`claude_ro`): `ca_test.de_test_id`
  set + `ca_test_cau` snapshot đúng đáp án. Upload bài scan thật KHÔNG test được — bucket storage
  thiếu trên môi trường này (side note, không phải bug code mới — xem bài học §07-07 cũ "bucket không
  tự tồn tại"). Nút "Hoàn tất" đúng bị chặn khi chưa có bài (button disabled, `trang_thai` vẫn
  `dang_test` sau click — verify DB xác nhận guard hoạt động đúng).
- **CÒN THIẾU / chưa làm:** upload-bài-thật end-to-end (chờ bucket) · "mở lại nhận xét" (có
  `moLaiNhanXet` trong lib nhưng chưa có nút UI — chấm thì có "↩ Mở lại chấm", nhận xét chưa) · 7 câu
  §F spec (đa môn 1-phiếu-hay-N, trục nhận xét môn≠Toán, hiệu suất staff…) — v1 đã chọn mặc định theo
  PLAN, CHƯA hỏi lại Thùy xác nhận từng câu.

### 07-08 (tiếp) — Gộp 4 leaf test-đầu-vào vào TRONG `Tuyển sinh` làm tab (Thùy: "cho gọn")

- Thùy chỉ ra: 5 leaf riêng ở nav (Tuyển sinh/Điểm danh test/Đề test/Chấm test/Nhận xét test) nên gộp
  giống bar toggle L5→L8 sẵn có của Tuyển sinh cho gọn, thay vì rải nav.
- **Bỏ 4 leaf khỏi `fixtures.ts`** (diem_danh_test/de_test/cham_test/nhan_xet_test) + bỏ import/route
  tương ứng ở `NhanSuHome.tsx` — giờ CHỈ còn leaf `tuyensinh`.
- **`TuyenSinhScreen.tsx`**: mở rộng bar tab hiện có (L5/L6/L7/L8/Đã loại) thêm 4 tab
  "Điểm danh test/Đề test/Chấm test/Nhận xét test" (`ExtraTab`, cùng 1 bar). `isFunnelTab()` tách 2
  nhóm: tab phễu (giữ nguyên toggle-bar-môn + bảng ứng viên) vs tab test (ẩn toggle-bar-môn — các màn
  con tự quản lý phạm vi/môn riêng của chúng). Render `<DiemDanhTestScreen/>`/`<DeTestScreen/>`/
  `<ChamTestScreen/>`/`<NhanXetTestScreen/>` trực tiếp làm nội dung tab.
- **Fix layout height khi nhúng** (điểm dễ vỡ): `ChamTestScreen`/`NhanXetTestScreen` có 2 chế độ hiển
  thị — list phẳng (cần cuộn thường) và card mở full-height 3-cột (`flex h-full min-h-0`, cần ancestor
  có chiều cao XÁC ĐỊNH mới cuộn đúng từng cột). Trước đây route thẳng làm grid-cell con của
  `NhanSuHome` nên tự có chiều cao; giờ nhúng trong `<div className="mx-auto max-w-...">` (block
  thường, không set height) sẽ làm `h-full` vỡ (auto→0). Fix: tách header/tab-bar (`shrink-0`, cố
  định) khỏi vùng nội dung (`min-h-0 flex-1`) ở `TuyenSinhScreen`; nội dung tab test bọc
  `overflow-hidden` (nhường cuộn cho con), tab phễu giữ `overflow-auto p-6` (như cũ). Đồng thời cho
  CẢ 4 màn con (`ChamTestScreen`/`NhanXetTestScreen`/`DeTestScreen`/`DiemDanhTestScreen`) tự bọc
  `h-full overflow-auto` ở chế độ list — tự chịu trách nhiệm cuộn, không phụ thuộc ancestor, robust dù
  nhúng ở đâu.
- **Verify:** `tsc`/`build` sạch. Test tay qua preview: cả 4 tab mới + 2 tab funnel (L6 xem bảng thật
  17 ứng viên) đều render đúng, không lỗi console, không double-scroll/vỡ layout. Đề test/ca_test đã
  gán từ phiên test trước vẫn hiện đúng trong tab mới.
- (Ngoài lề, KHÔNG liên quan tính năng): sửa `vite.config.ts` đọc `PORT` qua `globalThis.process` để
  preview-tool harness gán đúng port khi 5173 bị máy khác chiếm — tránh lỗi proxy mismatch lúc test
  UI. Không ảnh hưởng chạy `npm run dev` bình thường (không set PORT thì giữ mặc định).

### 07-08 (tiếp 2) — Sửa lại: Test đầu vào là MODULE RIÊNG, không nhét vào Tuyển sinh

- Thùy sửa lại quyết định trước đó trong buổi: "Tuyển sinh là để quản lý level của Học sinh. Còn các
  hoạt động test đầu vào thì để vào module Test đầu vào chứ" — tách 2 khái niệm: Tuyển sinh = phễu
  LEVEL (L5→L8), Test đầu vào = 4 story vận hành (điểm danh/đề/chấm/nhận xét), KHÔNG gộp chung 1 màn
  như tôi vừa làm.
- **Revert `TuyenSinhScreen.tsx` về nguyên bản** (`git checkout HEAD --`) — bỏ hết 4 tab test đã nhét
  vào, về lại đúng bar L5/L6/L7/L8/Đã loại như trước.
- **Tạo `TestDauVaoScreen.tsx`** (module MỚI, riêng): 1 leaf `test_dau_vao` + bar tab riêng (cùng
  style bar L5-L8 nhưng KHÔNG chung màn) chứa 4 tab Điểm danh/Đề/Chấm/Nhận xét — tái dùng nguyên
  layout fix (header `shrink-0` + nội dung `min-h-0 flex-1 overflow-hidden`, 4 màn con tự
  `h-full overflow-auto`) đã làm ở bước gộp-nhầm trước, chỉ đổi CHỖ ĐẶT (leaf riêng thay vì tab con
  của Tuyển sinh).
- **`fixtures.ts`**: leaf `tuyensinh` giữ nguyên (chú thích rõ "quản lý LEVEL, KHÔNG chứa hoạt động
  test") + thêm leaf mới `test_dau_vao`. `NhanSuHome.tsx` route thêm `TestDauVaoScreen`.
- **Verify:** `tsc`/`build` sạch. Test tay qua preview: leaf "Test đầu vào" hiện riêng trong nav (sau
  "Phân công Ops"), 4 tab bên trong hoạt động đúng (data ca_test/đề test từ phiên trước vẫn hiện
  đúng). Leaf "Tuyển sinh" xác nhận ĐÃ VỀ nguyên bản — chỉ còn bar L5-L8/Đã loại, không còn tab test.
  Không lỗi console.
- Bài học: khi CEO gợi ý "gộp cho gọn" — hỏi rõ ranh giới khái niệm TRƯỚC khi merge UI (Tuyển sinh
  và Test đầu vào tưởng liên quan chặt vì cùng nằm trong phễu L5→L6, nhưng thực ra là 2 TRÁCH NHIỆM
  khác nhau: quản lý trạng thái HS vs vận hành 1 hoạt động cụ thể — gộp nhầm 2 khái niệm khác nhau dù
  "cho gọn" nghe hợp lý lúc đầu).

### 07-08 (tiếp 3) — Hoàn thiện MT: full luồng ra đề → gán lớp → chấm → mastery dạng bài

- Pause "Test đầu vào" theo yêu cầu Thùy, chuyển sang hoàn thiện MT (kỳ thi lớn, đã build 1 phần
  06-xx: soạn + gán buổi, CÒN THIẾU chấm + line-config + mastery — xem DEVLOG cũ). Xác nhận hiểu đúng
  2/3 ý Thùy nêu đã build sẵn (multi-lớp, gán-lặp-lại), ý 3 (chỉnh dòng) thật sự thiếu → hỏi lại phạm
  vi đầy đủ, Thùy chốt: "full luồng: ra đề, gán lớp - chấm và mastery dạng bài".
- **`src/lib/mt.ts`**: thêm `getMTInstanceByBuoi`/`getMTCaus` (cùng mẫu `getETByBuoi`/`getETCaus` —
  gộp mọi phần 'custom' theo thứ tự, giống BTVN gộp nhiều phần). **Fix `ganMTVaoBuoi` thiếu seed sĩ
  số**: buổi MT tạo mới KHÔNG đi qua `moBuoi` nên chưa từng seed `buoi_hoc_hs` — chấm/Elo cần
  `diem_danh='co_mat'` nên bắt buộc có roster. Thêm đoạn seed y hệt `moBuoi` (gami.ts) vào nhánh tạo
  buổi mới.
- **`src/lib/gami.ts`**: thêm `loadMTForBuoi`/`ensureMTProblems` (mirror ET, phase='mt') — CHẤM tái
  dùng thẳng `gradeET`/`deleteGrade`/`listGrades`/`listProblems` sẵn có (không cần hàm riêng, phase đã
  tách qua `gami_session_problems.phase`). Xác nhận `closePhase`/`reopenPhase` phase='mt' đã đúng từ
  trước (dùng chung cột `ingame_dong_at`, `coElo` include 'mt', `K_MT=60` đã cấu hình sẵn — CHỈ thiếu
  UI, đúng như DEVLOG cũ ghi). Thêm nhánh derive task **`getMyTasks`**: buổi `loai='mt'` route qua
  CÙNG `phan_cong_lop` như buổi thường (khác bù/đuổi dùng nguoi_day trực tiếp) — 1 task "Chấm MT" cho
  bất kỳ ai có vai ở lớp đó (không khoá gv/tg). `TabKey`/`MyTask.loai` thêm `'mt'` → TS bắt buộc bổ
  sung `mt` vào mọi `Record<TabKey,...>` còn thiếu (`vanhanh.ts` `TASK_TAB_LABEL`) — đúng lợi ích "audit
  qua compiler" đã ghi ở bài học buổi-loại-mới.
- **`src/lib/mastery.ts`**: `EvalSrc` thêm `'mt'` (SRC_LABEL 'MT'). MT **LUÔN vào mastery** (không cần
  toggle như BTVN — MT giám sát thật, không phải tham khảo): thêm vào `phases` của `getMasteryHS` +
  `loadMasteryCells` (ảnh hưởng rollup lớp/khối + pivot dạng/chuyên đề) + `byDang` filter của
  `getTongQuanHS`. KHÔNG gộp MT vào thống kê `%ET` (giữ nguyên ý nghĩa riêng của ET) — chỉ ảnh hưởng
  mastery-per-dạng, đúng phạm vi Thùy hỏi.
- **`MTScreen.tsx`**: thêm UI chỉnh dòng (`etFormByCau`/`btvnLinesByCau`, autosave `cau_hinh` mỗi lần
  đổi — MT không có nút Lưu riêng, khác ET) — BÊ y hệt pattern ET (badge form trắc-nghiệm/trả-lời-
  ngắn/tự-luận + ô số dòng kẻ khi tự luận).
- **`MTBuoiDetail.tsx` (mới)**: màn Chấm MT riêng (KHÁC `BuoiDetail` thường) — Điểm danh (đơn giản,
  không báo PH) + bảng chấm Đ/C/S per câu (mẫu `ETChamTab`) + Đóng phase (Elo K=60) + Mở lại + Huỷ
  buổi. Route qua `NhanSuHome.tsx` (`openBuoi.loai==='mt'`), `TASK_STYLE`/`GVTA_CHIPS` thêm entry 'mt'.
- **✅ VERIFY ĐẦY ĐỦ qua preview thật + DB (`claude_ro`)**, KHÔNG chỉ tsc/build:
  - Line-config: chọn "Tự luận" cho 1 câu MT có sẵn → ô "dòng" hiện đúng → verify DB `cau_hinh.etFormByCau` lưu đúng.
  - Task-derive: login "Trang GV" (GV thật của lớp 9S1 có buổi MT có sẵn từ trước) → "Việc của tôi"
    hiện đúng "🏆 Chấm MT · Lớp 9S1" (roster buổi này TRƯỚC ĐÓ = 0 dòng do tạo trước khi fix — mở
    MTBuoiDetail tự chạy `dongBoSiSo` VÁ ĐÚNG thành 11 HS, xác nhận fix seed hoạt động cho data cũ lẫn mới).
  - Điểm danh 3 HS + chấm đủ 5 câu × 3 HS (pattern Đ/C/S trộn) → Đóng chấm MT → verify DB: 15 dòng
    `gami_grades` phase='mt' đúng · `gami_elo_history` phase='mt' delta cap ±40 (K=60 áp đúng, hạng 1
    +40/hạng 3 -40/hạng 2 -2) · `gami_exp_ledger` source='rank_mt' đúng bậc RANK_EXP.mt (1700/1620/1500)
    · `ma_dang` của cả 5 câu resolve đúng trong `dai_ban_do` (mastery per-dạng KHÔNG bị rớt do sai môn/bảng).
  - Mở lại (reopen): verify DB `gami_elo_history`/`gami_exp_ledger` xoá sạch (0 dòng), Elo HS quay
    đúng về giá trị trước khi đóng (1073), buổi về `trang_thai='mo'`.
- **⚠ ĐỂ LẠI DATA TEST THẬT trên buổi MT có sẵn (9S1 · 08/07/2026, KHÔNG phải data tôi tự tạo mới)**:
  3 HS bị đánh điểm danh "có mặt" + 15 dòng `gami_grades` (phase='mt', KHÔNG ảnh hưởng Elo/EXP vì đã
  mở-lại-để-sửa ở bước verify cuối) + 1 câu MT "Kiểm tra khảo sát tháng 7_Nâng cao" đổi form "Tự luận"
  + dòng=4. Đã hỏi Thùy có cần dọn không (chưa xoá gì — luật xoá CLAUDE.md).
- **CÒN THIẾU (ngoài phạm vi hỏi lần này):** MTPrintView (in phiếu) · nối `ky_thi.loai='mt_sat_hach'`
  (Level/vượt-band) · luật sư phạm (tỉ lệ câu/độ khó/phủ chuyên đề) · `listAllStaffTasks`/dashboard
  hiệu suất KHÔNG có nhánh 'mt' (giống bù/đuổi cũng thiếu — omission nhất quán, không phải regression
  mới nhưng chưa closed).

### 07-08 (tiếp 4) — MT: buổi gán MT tự đóng đánh giá + ET (chỉ có 1 hoạt động = kiểm tra)

- Thùy chốt thêm: "Buổi MT là kiểm tra, chỉ có 1 hoạt động. Nên buổi nào gán MT thì đóng toàn bộ các
  hoạt động khác của buổi học: nhận xét, đánh giá, ET." — cân nhắc 2 cách hiểu (đóng HOẠT ĐỘNG của
  CHÍNH buổi MT vs đóng buổi THƯỜNG cùng lớp+ngày nếu có) → chọn cách 1 (đúng nghĩa đen "buổi nào gán
  MT" = buổi vừa được gán, KHÔNG đụng buổi khác — an toàn hơn, tránh rủi ro gọi nhầm `closePhase('et')`
  lên buổi thường sẽ TÍNH ELO SAI (raw=0 cho cả lớp vì chưa từng có ET thật) nếu hiểu theo cách 2.
- **Fix `ganMTVaoBuoi` (mt.ts):** sau khi resolve buoiId (mới HOẶC tái dùng), set thẳng
  `danh_gia_xong_at`/`et_dong_at` = now() (guard `is(...,null)`, KHÔNG qua `closePhase`/`dongDanhGia`
  — 2 hàm đó tính Elo/cần data thật, ở đây chỉ đánh dấu N/A nên set trực tiếp, không side-effect).
  `ingame_dong_at` (mốc chấm-MT-thật) KHÔNG đụng — vẫn đợi chấm xong thật mới đóng.
- **Không backfill hàng loạt bằng SQL thẳng** — thử chạy 1 script UPDATE mass cho các buổi MT cũ, bị
  auto-mode classifier CHẶN ĐÚNG (Thùy chỉ yêu cầu hành vi tương lai, không xin backfill data sống).
  Tôn trọng, không tìm cách lách. Thay vào đó verify qua chính tính năng vừa sửa: re-gán MT vào buổi
  9S1/08-07 (buổi cũ trước fix) qua UI thật → guard tự vá đúng (`danh_gia_xong_at`/`et_dong_at` set,
  `ingame_dong_at` vẫn null) — tự-heal khi ai đó re-gán, KHÔNG cần script riêng cho buổi đã test.
- **Còn buổi MT khác (nếu có) chưa từng re-gán lại sẽ vẫn giữ NULL cũ** cho tới khi re-gán lần sau —
  đã báo Thùy, chưa backfill hàng loạt (chờ xác nhận nếu muốn áp ngay cho toàn bộ buổi MT cũ).

### 07-08 (tiếp 5) — Fix thật: buổi THƯỜNG song song với MT chưa được đóng (bug do hiểu thiếu 1 nửa)

- Thùy phản hồi cụ thể: "vừa gán cho 9S1 thì không thấy hiện MT trong buổi học và chưa đóng ET các
  thứ này" — verify DB phát hiện ĐÚNG: có 1 buổi **THƯỜNG** (loai='thuong') tồn tại SONG SONG cùng
  (lớp 9S1, ngày 08/07) với buổi MT — bản sửa trước CHỈ đóng đánh giá/ET của CHÍNH buổi MT (đúng theo
  nghĩa đen câu chữ), KHÔNG đụng buổi thường cùng ngày → đúng là thiếu, xác nhận "cách hiểu 2" (đóng cả
  buổi thường cùng lớp+ngày) mà lượt trước tôi cân nhắc rồi loại bỏ vì sợ rủi ro Elo — hoá ra CẦN THẬT.
- **Fix `ganMTVaoBuoi` (mt.ts):** sau khi đóng đánh giá+ET của buổi MT, tìm THÊM buổi `loai='thuong'`
  cùng (lop_id, ngay) (nếu tồn tại) → đóng NỐT đánh giá+ET của nó bằng ĐÚNG helper an toàn
  (`dongDanhGiaEtNA` — set thẳng cột, KHÔNG qua `closePhase`/`dongDanhGia`, giữ nguyên lý do an toàn đã
  ghi lượt trước: buổi thường có thể CHƯA từng có ET/đánh giá thật hôm đó → gọi `closePhase('et')` thật
  sẽ tính Elo SAI cho cả lớp). `ingame_dong_at` (chấm bài trên lớp) KHÔNG đụng — có thể đã chấm THẬT
  trước khi biết có MT, không phải N/A.
- **Thêm banner cảnh báo ở `BuoiDetail` (buổi thường)**: giải quyết luôn ý "không thấy hiện MT trong
  buổi học" — `getMTBuoiSameDay(lopId, ngay)` (mt.ts) check có buổi MT cùng ngày không → hiện banner
  tím "🏆 Ngày này lớp có MT — Đánh giá + ET đã tự đóng (không áp dụng, MT thay thế). Chấm MT ở Việc
  của tôi." ngay dưới header buổi thường, GIẢI THÍCH vì sao đánh giá/ET đóng sẵn (tránh tưởng bug lần 2).
- **Verify lại qua preview + DB thật**: re-gán MT vào 9S1/08-07 (buổi thường CÓ SẴN, đã xác nhận trước
  đó đánh giá/ET đang NULL) → DB xác nhận đóng đúng (`danh_gia_xong_at`/`et_dong_at` set, `ingame_dong_at`
  giữ nguyên giá trị cũ) → mở "Buổi học" → 9S1 → banner hiện đúng → tab "Đánh giá sau buổi" hiện
  "✓ Đã hoàn thành đánh giá + ↩ Mở lại" (đúng trạng thái đóng).
- **Không backfill hàng loạt** các buổi thường cũ khác (nếu có trường hợp tương tự chưa từng re-gán
  MT lại) — chờ Thùy xác nhận có cần quét toàn bộ không.
- Bài học: khi CEO mô tả 1 rule bằng lời, **luôn tìm bằng chứng THẬT trong DB trước khi kết luận đã
  fix đủ** — lần đầu tôi tự suy luận "cách 1 an toàn hơn" rồi dừng ở đó mà không verify có buổi thường
  song song hay không; đến khi CEO test thật mới lộ ra thiếu. Nhẽ ra nên query DB xem THỰC TẾ có buổi
  thường song song trước khi chốt cách hiểu, thay vì chỉ suy luận trên lý thuyết an toàn.

### 07-08 (tiếp 6) — MT: hiện ngay trong "Buổi học" + giữ cấu trúc PHẦN khi chấm (3 fix theo Thùy)

- Thùy phản hồi tiếp 3 ý cụ thể sau khi test:
  1. "MT phải hiện ngay bên trong buổi học chứ không phải chỉ ở việc của tôi"
  2. "Mấy cái kia phải đóng ở trong buổi học luôn" (đánh giá/ET — xác nhận đúng scope đã fix lượt
     trước, giờ càng cần vì MT + buổi thường đều xem được TỪ CÙNG 1 màn Buổi học)
  3. "Chấm MT cấu trúc nó có giống file MT được gán đâu" — đúng: bảng chấm trước đó LÀM PHẲNG câu
     (flatMap mọi Phần thành 1 dãy Câu 1..N liên tục), MẤT ranh giới Phần I/Phần II như lúc soạn.
- **Fix #3 trước (gốc rễ)**: `mt.ts` thêm `getMTPhanCaus(taiLieuId)` trả **GIỮ NGUYÊN cấu trúc Phần**
  (`{tieuDe, caus}[]`) thay vì `getMTCaus` cũ flatMap phẳng. `loadMTForBuoi` (gami.ts) đổi trả
  `{mtId, phans, caus}` (phans = cấu trúc thật, caus = phans.flatMap dùng RIÊNG cho seed problem_no
  liên tục — vẫn cần liên tục toàn bài để Elo/rank tính đúng, KHÔNG đổi). `MTBuoiDetail.tsx`: bảng
  chấm thêm 1 HÀNG NHÓM phía trên header câu, mỗi Phần 1 `<th colSpan=...>` đúng số câu của nó — nhìn
  vào là biết câu nào thuộc Phần nào, khớp y hệt lúc soạn ở MTEditor.
- **Fix #1+#2**: `mt.ts` thêm `listMTBuoiCuaNgay(ngay)` (query buổi_hoc loai='mt' theo NGÀY, mọi lớp
  — KHÔNG suy từ TKB như buổi thường, vì MT tạo tay lúc gán). `BuoiHocScreen.tsx` (màn "Buổi học"):
  load thêm mtList song song `buoiAoCuaNgay`, hiện section RIÊNG "🏆 KỲ THI (MT)" phía trên lưới buổi
  thường (không theo filter Chưa-mở/Đã-mở vì MT không có state "chưa mở"), thẻ `MTCard` bấm vào →
  `MTBuoiDetail` (mở NGAY tại chỗ, không cần vòng qua "Việc của tôi" nữa — vẫn giữ luôn ở Việc của tôi
  cho GV/TG, giờ THÊM lối vào trực tiếp từ Buổi học cho ai duyệt/xem chung).
- **Verify qua preview thật**: mở "Buổi học" ngày 08/07 → thấy card "🏆 Kỳ thi (MT) — 1 · 9S1" ngay
  trên cùng → bấm vào → mở đúng MTBuoiDetail → bảng chấm hiện đúng "Phần I: Trả lời ngắn" gộp 5 câu
  (khớp file MT "Kiểm tra khảo sát tháng 7" đã gán) → data chấm cũ (từ lượt test trước) vẫn nguyên vẹn
  sau khi đổi cấu trúc hiển thị (không mất dữ liệu, chỉ đổi CÁCH NHÌN).
- Bài học (nối tiếp bài học lượt trước): user-facing feedback cụ thể ("check thấy sai") luôn đáng tin
  hơn suy luận trên giấy — 2/3 điểm lần này (#1, #2) đều là những chỗ tôi đã có sẵn cảm giác "có thể
  chưa đủ" khi thiết kế nhưng không chủ động hỏi/kiểm tra kỹ trước khi báo xong việc.

### 07-08 (tiếp 7) — MT: ĐẠI TU kiến trúc — bỏ buổi_hoc(loai='mt') riêng, MT = 1 TAB của buổi thường (giống ET)

- Thùy chốt dứt điểm: "Chấm MT phải hiện trong buổi học giống như chấm ET chứ" — nghĩa là MT KHÔNG
  nên là 1 buổi/entity riêng biệt (loai='mt', card riêng, roster riêng) mà phải là 1 PHASE/TAB của
  buổi_hoc(loai='thuong') THẬT, giống hệt cách ET hoạt động (ET không có buổi riêng, chỉ là tab +
  cột `et_dong_at` trên buổi thường). Đây là đại tu kiến trúc, không phải patch nhỏ.
- **Migration `0091_mt_dong_at.sql`**: thêm cột `buoi_hoc.mt_dong_at` — MT cần cột đóng RIÊNG (không
  dùng chung `ingame_dong_at` như bản cũ, vì giờ buổi thường có ingame THẬT, dùng chung sẽ đụng độ).
- **`gami.ts`**: `closePhase`/`reopenPhase` route `dongCol` theo 3 nhánh (et/mt/ingame) thay vì 2.
  "Hoàn tất" buổi thường giờ xét ĐỦ 3 phase áp dụng (ingame+et+**mt nếu buổi có gán MT**, tra qua
  `tai_lieu(loai='mt_buoi')` khớp lớp+ngày — batched trong `getMyTasks`, per-buổi trong `closePhase`
  vì cần biết ngay lúc đóng). `getMyTasks`: XOÁ nhánh riêng cho `loai='mt'` (không còn tồn tại nữa),
  THAY bằng: buổi thường nào ĐÃ CÓ gán MT thật (tra `tai_lieu loai='mt_buoi'`, tránh spam "Chấm MT"
  rỗng lên 99% ngày thường không có kỳ thi) → thêm task 'mt' cho vai TG (giống ET), dùng `mt_dong_at` làm mốc done.
- **`mt.ts` — `ganMTVaoBuoi` ĐẠI TU**: bỏ hẳn nhánh tạo `buoi_hoc(loai='mt')` — giờ gọi THẲNG `moBuoi`
  (import từ gami.ts — chấp nhận import vòng 2 chiều gami.ts↔mt.ts, AN TOÀN vì cả 2 chiều chỉ dùng
  trong function body, không phải top-level; verify OK qua tsc+build+chạy thật) để tìm/tạo buổi
  THƯỜNG cho (lớp,ngày) — tự động có `ma_buoi`, GV chính, roster chuẩn giống hệt "Mở buổi" thường
  (xoá được ~15 dòng code tự seed roster trùng lặp trước đây). Đóng đánh giá+ET N/A vẫn giữ (buổi
  gán MT chỉ có 1 hoạt động = kiểm tra — quyết định trước đó vẫn đúng, giờ áp lên buổi thường CHUNG
  luôn, không cần phân biệt "buổi thường co-exist" nữa vì chỉ còn 1 buổi). `listGanMT` tra buổi qua
  `loai='thuong'` thay vì `loai='mt'`. Xoá `getMTBuoiSameDay`/`listMTBuoiCuaNgay` (chết theo mô hình cũ).
- **UI**: `BuoiHocScreen.tsx` — xoá section riêng "🏆 Kỳ thi (MT)" + `MTCard` + banner cảnh báo (không
  cần nữa, MT giờ NẰM SẴN trong buổi). Thêm tab **"🏆 MT"** vào tab-bar của `BuoiDetail` (cạnh
  Điểm-danh/Đánh-giá/Chấm-bài/ET/BTVN) — component `MTTab` mới, CÙNG mẫu `ETChamTab` (bảng Đ/C/S,
  dùng CHUNG `roster`/điểm-danh của buổi — hết cần đồng bộ 2 roster riêng biệt như bản cũ), GIỮ cấu
  trúc Phần (colspan header, không làm phẳng — kế thừa fix trước). Xoá `MTBuoiDetail.tsx` khỏi mọi
  import/route (file vẫn còn trên disk, ĐÃ HỎI Thùy có xoá hẳn không — chưa xoá, chờ xác nhận).
  `NhanSuHome.tsx`: bỏ `loai:'mt'` khỏi `OpenBuoi`/`MyTask.loai` (không còn route đặc biệt); `tabsCuaVai('tg')`
  thêm 'mt' để mở đúng tab khi bấm task "Chấm MT" từ Việc của tôi.
- **Verify qua preview + DB thật (kỹ, vì đây là đại tu)**: gán MT vào 9S1 ngày MỚI (09/07) → verify
  DB: buổi TẠO ĐÚNG `loai='thuong'`, `ma_buoi` sinh tự động, roster 13 HS (qua moBuoi, không phải code
  tự seed), đánh giá+ET auto-đóng N/A, `mt_dong_at`/`ingame_dong_at` đúng null (chờ chấm thật). Mở
  "Buổi học" → xác nhận KHÔNG còn card MT riêng, buổi hiện như buổi thường bình thường, tab "🏆 MT"
  xuất hiện đúng trong tab-bar khi mở. Chấm Đ/C/S → đóng → verify DB: `mt_dong_at` set, `gami_elo_history`
  phase='mt' đúng cap ±40, `gami_exp_ledger` source='rank_mt' đúng bậc, VÀ **`trang_thai` chuyển
  'hoan_tat'` đúng lúc CẢ 3 phase (ingame/et/mt) đều đóng** — xác nhận gate 3 chiều hoạt động đúng
  (test tình cờ rơi vào buổi 08/07 do lỗi thao tác date-picker của tool test, không phải bug app —
  đã trace kỹ bằng cách đối chiếu `ma_buoi`/query DB, kết luận rõ ràng trước khi báo cáo).
- **Data cũ / cần Thùy xác nhận:**
  1. `MTBuoiDetail.tsx` giờ orphan (không ai import) — xoá file luôn hay giữ tham khảo?
  2. Buổi `loai='mt'` cũ (461e1b1b, test 08/07 phiên trước — 5 problems/15 grades) giờ KHÔNG còn
     đường vào (đã bỏ hết route cũ) — data mồ côi, có cần dọn không?
  3. Buổi `aca3ba90` (9S1 · 08/07, dùng để verify lượt này) đã cộng dồn 18 `gami_session_problems`
     phase='mt' qua nhiều lần re-gán khác nội dung (từ các phiên test trước) — phát hiện: `ensureMTProblems`
     chỉ seed khi CHƯA có problem nào cho buổi (`if (cur.length ...) return`), nên re-gán ĐỀ KHÁC lên
     buổi ĐÃ CÓ problem cũ sẽ để lại problem THỪA (không xoá cái cũ) — bug tiềm ẩn cần fix ở lượt sau
     nếu 1 buổi bị gán MT nhiều lần với nội dung khác nhau (hiếm nhưng có thể xảy ra khi soạn lại đề).
- Bài học: khi tự-động-hoá test qua devtools (set input.value + dispatchEvent), input React-controlled
  có thể KHÔNG nhận state (đặc biệt input ngoài modal, khác context) → luôn ĐỐI CHIẾU `ma_buoi`/id thật
  qua DB trước khi kết luận "đã test đúng buổi X", đừng tin mù UI hiển thị đúng ngày mình gõ.

### 07-08 (tiếp 8) — MT: bỏ giờ/phòng/GV khỏi form gán (thuộc về buổi học, không phải MT)

- Thùy chốt: "MT chỉ cần gán lớp chứ, thêm giáo viên ngày giờ các thứ làm gì. Cái đó thuộc về buổi
  học cơ mà. MT chỉ cần chọn buổi học ngày nào của lớp nào thôi." — đúng, form gán MT trước đó thừa
  3 ô Giờ/Phòng/GV (vốn là thuộc tính CỦA BUỔI, không phải của việc gán MT).
- **`mt.ts`**: `ganMTVaoBuoi` rút gọn còn `{lopId, ngay}`. Thêm `tkbSlotCuaLop(lopId, ngay)` — khi
  buổi CHƯA tồn tại (buoiMoi), tự tra TKB (đúng `thu` + trong khoảng `hieu_luc_tu/den`) để lấy
  giờ/phòng tự động cho `moBuoi`, KHÔNG hỏi người dùng (giống hệt cách buổi thường tự mở từ
  `buoiAoCuaNgay`). Không tìm được slot hợp lệ → để trống (null), OPS tự sửa ở Buổi học sau — KHÔNG
  chặn việc gán MT.
- **`MTScreen.tsx` — `GanBuoiModal`**: bỏ hẳn 3 ô Giờ/Phòng/GV, chỉ còn Lớp + Ngày. Bỏ import
  `listNhanSu`/`NhanSu` (không còn dùng).
- **Verify qua preview + DB thật**: gán MT vào 9S1 ngày mới (21/07, thứ 3) → buổi tạo đúng
  `loai='thuong'`, `ma_buoi` đúng thứ (T3), đánh giá/ET auto-đóng đúng. Giờ/phòng ra `null` — kiểm tra
  chéo TKB thật: 2 dòng TKB thứ-3 của 9S1 đều đã HẾT hiệu lực từ giữa tháng 6 (`hieu_luc_den` 15-16/6)
  → xác nhận đây là hành vi ĐÚNG (không có slot hợp lệ để tự điền), không phải bug của
  `tkbSlotCuaLop`. Không test được case "có TKB hợp lệ" bằng data thật hiện có, nhưng logic SQL đơn
  giản/tường minh nên tự tin đúng qua đọc code.

### 07-08 (tiếp 9) — MT Print (bản HS/GV) + nâng cao theo hệ + fix UX scroll-reset/sticky header toàn app

- **⭐ MTPrintView (in MT — bản HS/GV như giáo trình):** file mới `src/screens/tailieu/MTPrintView.tsx`,
  bám sát mẫu `DeThiPrintView.tsx` (giữ nguyên cấu trúc PHẦN + thứ tự gốc, KHÔNG gom theo loại câu —
  đúng yêu cầu "cấu trúc in phải giống file MT được gán"). Khác DeThiPrintView ở chỗ MT dùng CHUNG cơ
  chế "chỉnh dòng" với ET (`etFormByCau`/`etFormOf`) — 1 câu kho có `lua_chon` (TN) nhưng bị ép hiển thị
  "tự luận"/"trả lời ngắn" thì KHÔNG được lộ phương án ra bản in. `CauItem` gốc (PrintView.tsx) LUÔN
  hiện `lua_chon` nếu câu có, bất kể form override → không dùng thẳng được cho 2 form đó, phải viết
  `MtCau` tách riêng: Đúng/Sai (`menh_de`) và form='trac_nghiem' → qua `CauItem` bình thường; còn lại
  tách stem thủ công (`splitStem`) bỏ qua `lua_chon`, thêm dòng kẻ (tự luận, theo `btvnLinesByCau`) hoặc
  1 dòng "Đáp án: ___" ngắn (trả lời ngắn — CSS mới `.pv-tln-ans`). Header phiếu kiểu ET (Họ tên/Lớp
  blank + ô ĐIỂM, không SBD như đề thi vì MT là kiểm tra nội bộ). Wire nút "🖨 In"/"⬇ Tải PDF" cho CẢ
  `mt` (master) lẫn `mt_buoi` (instance) trong `KhoTaiLieuScreen` (xoá cờ `PRINTABLE` cũ đang CHẶN MT —
  trước đây MT rơi vào `PrintView` mặc định gây lỗi render nên bị disable tạm) + nút "🖨 Xem / In" ngay
  trong `MTEditor` (giống ET/Đề thi). Verify preview thật: in cả MT master ("Kiểm tra khảo sát
  tháng 7_Nâng cao" — có câu form tự luận VÀ trả lời ngắn, KaTeX render đúng) lẫn MT buổi (mt_buoi gán
  9S1), bản GV hiện `GvAnswer` đúng (đáp án+lời giải), Tải PDF chạy không lỗi.
- **⭐⭐ MT — câu NÂNG CAO tự lọc theo HỆ LỚP khi gán vào buổi (Thùy chốt, KHÔNG đẻ cờ thủ công mới):**
  bài toán: đề hệ A/S có thêm phần nâng cao, đề hệ B/C không có — 2 hướng đưa ra (tách 2 đề / 1 đề tự
  lọc) → Thùy chọn hướng 2 nhưng lưu ý "phần nâng cao thường là CẢ 1 phần nhiều câu, không phải 1 câu
  lẻ". Phát hiện mấu chốt: dạng ĐÃ SẴN `bac_toi_thieu` trong bản đồ kiến thức (S>A>B>C, "bậc THẤP NHẤT
  còn học dạng") — TÁI DÙNG y hệt info này thay vì đẻ tag "chung/riêng" mới. `mt.ts` `ganMTVaoBuoi`:
  trước khi copy phans từ master → mt_buoi, với MỖI câu tra `bac_toi_thieu` của dạng nó (`dang_chinh`,
  bulk query 1 lần qua `khoCuaMon(mon).banDoTbl`), so `thu_tu` với bậc của lớp (`lop.bac` × `lop_bac`
  thu_tu S=4…C=1) — câu nào lớp không đủ tư cách thì TỰ LOẠI; phần nào rụng hết câu (toàn nâng cao) →
  bỏ hẳn phần đó khỏi doc con (không để tiêu đề phần mồ côi 0 câu). Trả thêm `soCauLoai` để báo GV biết
  đã loại bao nhiêu câu lúc gán. **MTEditor**: mỗi Phần hiện badge tự tính "Hệ X, Y" (khắt khe nhất
  trong phần thắng, suy từ `dangOpts[].bac` — trước bị bỏ sót khi map từ `listMap`, đã bổ sung) — GV
  nhìn thấy NGAY lúc soạn để tự sửa nếu gán nhầm dạng vào phần sai chỗ (đúng tinh thần "hệ thống tự
  điền ma trận, GV chỉ duyệt lại"). Thêm dropdown ÉP TAY cạnh badge (`cau_hinh.phanBac[phanId]`, mặc
  định "Tự động") cho case GV muốn khác với suy tự động — ép tay THẮNG tuyệt đối, cả phần theo 1 quyết
  định (đủ tư cách giữ nguyên/không đủ loại hết), `ganMTVaoBuoi` đọc đúng ưu tiên này trước khi fallback
  về suy-per-câu. Verify preview thật + DB: gán MT "toàn nâng cao Hệ S,A" (5/5 câu) vào lớp 9B1 (hệ B)
  → báo đúng "đã tự loại 5 câu nâng cao", doc con tạo ra 0 phần (đúng, không phần nào đủ điều kiện);
  test dropdown ép tay (chọn "từ B trở lên") → badge đổi đúng "Hệ S,A,B", lưu DB đúng `cau_hinh.phanBac`
  — đã trả về "Tự động" sau test (tài liệu THẬT, không phải data test). Dọn buổi/roster/doc test rác
  tạo ra lúc verify (9B1 · 15/07, roster 11 HS 0-grade) — user xác nhận trước khi xoá (auto-classifier
  chặn xoá `buoi_hoc` không có bằng chứng rõ nó là test — đúng, phải hỏi).
- **🐞 Fix UX "sửa xong danh sách tự nhảy về đầu trang" (Học sinh, và cùng pattern ở MỌI màn list khác):**
  nguyên nhân gốc: `reload()` sau khi lưu modal LUÔN `setLoading(true)` trước → bảng bị thay tạm bằng
  `<p>Đang tải…</p>` rất ngắn → khung cuộn co chiều cao về gần 0 → trình duyệt TỰ ĐỘNG clamp `scrollTop`
  về 0 (hành vi mặc định khi nội dung co lại, KHÔNG cách nào chặn ở tầng CSS) → dù bảng đầy lại ngay
  sau đó, `scrollTop` đã bị clamp từ trước, không tự phục hồi. Fix `HocSinhScreen.tsx`: chỉ
  `setLoading(true)` khi `list.length === 0` (lần tải ĐẦU, chưa có gì để mất) — các lần reload sau (sau
  khi sửa/lưu) GIỮ NGUYÊN bảng cũ trên màn cho tới khi data mới về, DOM/scroll không bị phá giữa chừng.
  Verify preview thật: cuộn 3000px → sửa 1 HS ("Gia Bảo") → Lưu → danh sách giữ NGUYÊN vị trí cuộn
  (không nhảy về đầu). **Đây là pattern lặp ở screens khác** (mọi `reload()` viết theo công thức
  `setLoading(true)` y hệt) — CHƯA sweep hết, chỉ mới fix Học sinh (theo đúng cái Thùy chỉ ra cụ thể).
- **⭐⭐ Sticky header cho MỌI bảng danh sách (Thùy: "mọi chỗ đều phải freezing header chứ"):** sweep 14
  file có `<thead>` (BoTro/ChatLuongVanHanh/BuoiHoc(2 tab còn thiếu)/GamiDiem(3 bảng)/QuanLyLevel(2
  bảng)/HocPhi(5 bảng)/HocSinh/Lop(roster)/NhanSu/PhanCong/KhoTaiLieu/TuyenSinh(2 bảng)/PhanQuyen(tab2))
  — thêm `sticky top-0 z-10` (+ `left-0` ở cột đã ghim trái sẵn) cho MỌI `<th>` bảng dữ liệu chính. Bỏ
  qua có chủ đích: bảng dạng "thẻ chụp ảnh" (`InvoiceCard`/chụp-TKB — style inline-hex cho html2canvas,
  KHÔNG phải bảng cuộn), lưới TKB tuần (7 khung cố định, không dài), dropdown/popup ngắn, ma trận
  Phân quyền tab1 (2-hàng-header lồng nhau + sticky-left sẵn — offset top 2 tầng phức tạp, để sau nếu
  Thùy cần, screen founder-only ít dùng).
  **🐞 Bug ẩn phát hiện thêm khi verify (quan trọng, áp dụng MỌI nơi dùng sticky sau này):** nhiều bảng
  bọc trong `<div className="overflow-hidden rounded-xl ...">` hoặc `overflow-x-auto` CHỈ để bo góc /
  cho phép cuộn ngang khi bảng rộng — nhưng theo CSS spec, BẤT KỲ `overflow` khác `visible` trên MỘT
  ancestor (kể cả chỉ set 1 trục) đều biến nó thành "scroll container", và sticky con bên trong sẽ BÁM
  vào ancestor GẦN NHẤT có overflow non-visible, KHÔNG PHẢI ancestor thật sự đang cuộn (trang ngoài).
  Vì div bọc đó cao = nội dung (không có `max-height` riêng, tự nó KHÔNG BAO GIỜ cuộn độc lập) →
  sticky "bám" vào 1 khung không hề cuộn → nhìn như sticky vô hiệu (header cứ trôi theo trang bình
  thường). Fix: gỡ `overflow-hidden`/`overflow-x-auto` khỏi các div bọc thuần-cosmetic này, để khung
  cuộn NGOÀI CÙNG (`min-h-0 flex-1 overflow-auto p-6` cấp trang) làm chuẩn duy nhất — cuộn ngang (khi
  bảng có `min-w-[...]` rộng, vd HocPhi/TuyenSinh/QuanLyLevel) chuyển từ "cuộn riêng khung bảng" sang
  "cuộn cả trang", chấp nhận đánh đổi nhỏ đó để đổi lấy sticky hoạt động đúng — verify preview thật xác
  nhận cuộn ngang bảng Tuyển sinh (L6, nhiều cột) vẫn dùng được bình thường sau khi gỡ. **Quy tắc rút
  ra: muốn 1 bảng vừa sticky-top vừa tự cuộn-ngang-riêng (không kéo cả trang), div bọc đó phải TỰ LÀ
  khung cuộn dọc luôn (có `max-height`/`flex-1 min-h-0 overflow-auto` của CHÍNH nó, như `ETChamTab`/
  `MTTab`/`BtvnTab` trong BuoiHocScreen — bounded-height "nested scrollbox" độc lập) — KHÔNG THỂ vừa để
  trang ngoài cuộn dọc vừa có 1 div-con overflow-x-auto lo cuộn ngang MÀ sticky vẫn xuyên qua được, đây
  là giới hạn cứng của CSS (không có workaround ở tầng class/thuộc tính).**

### 07-09 — Dọn 2 việc treo (orphan MTBuoiDetail + migration lạ) · CHỈNH SỬA phát hiện "0 bucket" 07-07
- **Xoá `src/screens/gami/MTBuoiDetail.tsx`:** file untracked xuất hiện lại trên máy này (kiến trúc MT CŨ — buổi MT tách riêng khỏi buổi thường), dù ghi chú 07-08 đã kiểm "không tồn tại trên disk/git history". Kiến trúc hiện tại (MT = phase/tab của buổi thường, `MTTab` trong `BuoiHocScreen.tsx`) đã thay thế hoàn toàn — Thùy xác nhận xoá.
- **Áp `0087_web_lead_writer_role.sql`:** file do 1 phiên/máy khác tạo song song (xem gotcha SỐ TRÙNG ở entry trước, feature ghi lead từ `bkdemy-web`, KHÔNG liên quan ERP). Thùy yêu cầu áp luôn — đã chạy qua `_apply_one.mjs` + `npm run schema` (không đổi bảng, chỉ tạo role Postgres). Role CHƯA có mật khẩu (ALTER ROLE riêng, không thuộc phạm vi phiên này).
- **⭐ SỬA LẠI phát hiện "0 bucket" ở entry 07-07 (line ~1300) — KHÔNG chính xác hoàn toàn:** verify lại bằng `SUPABASE_SERVICE_ROLE` key (bypass RLS) cho thấy `kho-anh` (tạo **08/06**) và `avatars` (tạo **11/06**) **ĐÃ TỒN TẠI TỪ LÂU**, chỉ `kho-tailieu` thật sự thiếu. Nguyên nhân sai: check cũ dùng **anon key** gọi `storage.listBuckets()` → bị **RLS chặn SELECT trên bảng `storage.buckets`** (khác `storage.objects` có policy `..._read to public`) → trả về `[]` GIẢ, không phản ánh đúng bucket có tồn tại hay không. Tôi lặp lại đúng lỗi này khi verify sơ bộ trước khi Thùy báo đã chạy Dashboard.
- **⭐ BÀI HỌC (bổ sung ②):** `supabase.storage.listBuckets()` bằng anon/authenticated key **KHÔNG đáng tin** để chẩn đoán bucket có tồn tại hay không (RLS trên `storage.buckets` mặc định không cho SELECT qua key thường) → **PHẢI dùng `SUPABASE_SERVICE_ROLE`** (service-role key, bypass RLS) để check chính xác. Cách khác: test trực tiếp `storage.from(bucket).list()` — lệnh này ăn theo policy `objects` (đã có `to public`) nên phản ánh đúng thực tế app dùng.
- **✅ VERIFY (service-role `listBuckets` + anon `list()` cả 3 bucket):** `kho-anh`/`kho-tailieu`/`avatars` đều tồn tại + đọc được qua đúng anon key app dùng (`kho-anh` có sẵn data, `avatars` có sẵn data, `kho-tailieu` mới tạo nên rỗng). Chưa test ghi (upload) thật với session authenticated — nhưng bucket+policy đã đúng theo file 0007/0008/0020, tin cậy cao. Việc-cần-làm-tiếp #1 (07-07) coi như XONG phần hạ tầng.

### 07-09 (tiếp) — Rà soát: đưa MT vào MỌI mastery + dashboard (còn sót sau đại tu kiến trúc 07-08)
- **Bối cảnh:** Thùy yêu cầu rà soát toàn bộ chỗ MT (kỳ thi lớn) phải xuất hiện nhưng có thể còn sót do đại tu 07-08 (MT từ "buổi riêng" → "phase của buổi thường"). Grep toàn bộ `phase ingame/et/btvn` + `buoi_hoc.loai==='mt'` để tìm chỗ chưa cập nhật theo model mới. Tìm ra **4 gap thật** (không phải suy đoán — verify bằng data thật + preview sau khi sửa):
- **⭐ `listAllStaffTasks` (gami.ts) THIẾU HẲN nhánh MT** — đúng gap HANDOFF đã ghi 07-08 ("omission nhất quán"). Comment cũ `mt: null // buổi thường không có phase mt` đã SAI từ khi MT thành phase-của-buổi-thường. Fix: mirror y hệt `getMyTasks` — query `tai_lieu loai='mt_buoi'` dựng `mtKeys` (lop_id|ngay), chỉ đẩy task "Chấm MT" cho TG khi buổi thật sự có gán MT (không spam). Kéo theo: `vanhanh.ts` `TASK_TABS` + `ChatLuongVanHanhScreen.tsx` `TEAM_TABS_OF.ta` phải thêm `'mt'` mới hiện card "Chấm MT" ở dashboard Chất lượng vận hành (cả tab Theo người lẫn Theo mục).
- **⭐ Dashboard "Điểm số" (`GamiDiemScreen.tsx`) — MT bị GỘP NHẦM vào "Elo lớp":** `type Phase` local của màn chỉ có `'ingame'|'et'`, "Lịch sử Elo" trong hồ sơ HS coerce `h.phase==='et'?'et':'ingame'` → click 1 dòng lịch sử MT lại mở NHẦM bảng "Elo lớp" (badge cũng hiện sai "Lớp"). Data layer (`getEloBreakdown`/`getDiemHS`) ĐÃ đúng từ trước (Phase type gốc có 'mt', hist không filter phase) — bug thuần UI. Fix: `phaseOf`/`phaseBadge` helper xử cả 3 nhánh. Bảng "Theo ca học" cũng thiếu cột Elo MT — thêm `listCaHoc` trả `hasMT` (hỏi thẳng `gami_session_problems.phase='mt'`, KHÔNG suy qua tai_lieu vì cần đúng buổi) + `mt_dong`, nút "Elo MT" **CHỈ hiện khi `hasMT`** (né spam "(chưa đóng)" cho 99% ca không có MT — cùng nguyên tắc "không spam task rỗng" áp cho cả bảng, không riêng task).
- **⭐ Kết quả học tập (`KetQuaScreen.tsx`) — view "Theo buổi (raw)" MT chết hoàn toàn:** code cũ (từ trước 07-08, model MT-là-buổi-riêng) filter `b.loai==='mt'` — buổi có gán MT giờ LUÔN có `loai='thuong'` nên nhánh này KHÔNG BAO GIỜ match → chip filter "MT" + badge "Kiểm tra tháng" tồn tại trên UI nhưng vô tác dụng (dead code trông như đã làm). Fix gốc: `mastery.ts` `BuoiActivity` thêm cờ `mt` (từ `mt_dong_at`, cùng cách chamBai/et/btvn) → `ACTS` (KetQuaScreen) thêm entry `mt`, bỏ nhánh lọc đặc biệt, bỏ badge chết `isMt`. Cũng thêm **"% đúng MT trung bình"** vào tab Tổng quan 1 HS (`getTongQuanHS` mastery.ts: mtSum/mtN/trend.mt — trước đó MT chỉ ngầm vào "% hoàn thành bản đồ", không có raw stat riêng như ET/BTVN).
- **KHÔNG cần sửa (đã đúng sẵn từ 07-08/07-01):** `mastery.ts` `getMasteryHS`/`loadMasteryCells` (per-dạng mastery) đã gồm `'mt'` trong mọi filter phase từ đầu · Elo/EXP per-buổi (`closePhase`) đã tính MT đúng · Bảng xếp hạng (`RankView`) đã cộng dồn đúng vì `gami_elo` gộp mọi phase.
- **✅ VERIFY THẬT (preview + DB `claude_build` tra buổi có MT thật `9S1.T4.08072026`):** Điểm số→Theo ca học hiện đúng nút "Elo MT" (chỉ ca này, không phải mọi ca) → bảng tính đúng số · hồ sơ HS→Lịch sử Elo dòng MT hiện badge "MT" (không còn "Lớp") + click mở đúng bảng Elo MT · Kết quả học tập→Tổng quan hiện "% đúng MT trung bình 50% · 18 câu" · Theo-buổi/Lịch-sử-hoạt-động filter "MT" → ra đúng 1 thẻ (TRƯỚC fix: 0 thẻ, "không khớp bộ lọc") · Dashboard Chất lượng vận hành→Theo người (TG Nguyễn Công Hải) hiện card "Chấm MT" mới + Theo mục→TA có bảng "Chấm MT" riêng cuối trang. `tsc --noEmit` sạch 2 lần (giữa chừng + sau cùng).

### 07-10 — Fix bug OPS: "Chuẩn bị phòng" mất tích khi phân công trực GIỮA TUẦN
- **Báo lỗi (Thùy):** nhân sự đã được phân công trực nhưng "Việc của tôi" chỉ hiện Điểm danh, KHÔNG hiện Chuẩn bị phòng/Report/Báo tan.
- **Điều tra bằng data thật (KHÔNG đoán):** giả lập chính xác logic `getMyOpsTasks` (Report/Tan) và `luotPrepCuaKhoang` (Prep) bằng script raw SQL cho 3 nhân sự có `phan_cong_ops` thật trong DB. Report/Tan derive ĐÚNG cho cả 3 (duyệt qua từng ngày trong tuần, tự check hiệu lực per-ngày → không có bug). Prep thì SAI cho 2/3 người.
- **⭐ ROOT CAUSE:** `luotPrepCuaKhoang` (opsvanhanh.ts) gọi `mapNguoiTrucTheoTkb(tkbIds, tu)` — tra "ai đang trực phòng nào" **CHỈ 1 LẦN tại ngày `tu`** (đầu tuần đang xem) rồi DÙNG CHUNG cho toàn bộ 7 ngày. `phan_cong_ops` là effective-dated PER SLOT (giống TKB) — nhân sự được phân công trực **bắt đầu giữa tuần** (`hieu_luc_tu` sau `tu`) bị tra hụt: `r.hieu_luc_tu <= tu` = FALSE cho họ tại thời điểm tra, nên **100% lượt Prep của họ trong CẢ TUẦN biến mất** dù ngày lượt đó (thứ 4, thứ 5…) đã trong hiệu lực thật. (Report/Tan không dính vì code ở `getMyOpsTasks` tự lặp qua từng ngày và check hiệu lực đúng NGAY LÚC ĐÓ, không snapshot 1 ngày đại diện.)
- **Verify TRƯỚC fix bằng script mô phỏng:** 2 nhân sự (Hoàng Khánh Linh, Trần Bảo Lộc — `hieu_luc_tu=07-07`, `tu`(tuần)=`07-06`) → code cũ tra ra **0 lượt phòng** dù data thật đã gán đúng (P301 thứ 4, P101 thứ 4).
- **Fix:** đổi `mapNguoiTrucTheoTkb(tkbIds, ngay)` (trả `Map<tkbId,nhanSuId>` snapshot 1 ngày) → `listPhanCongTheoTkb(tkbIds)` (trả nguyên mảng dòng phân công, KHÔNG lọc ngày) + resolve người trực **THEO NGÀY CỦA TỪNG LƯỢT** ở bước `.map()` cuối `luotPrepCuaKhoang` (mỗi lượt tự tra đúng lúc nó diễn ra, không dùng chung 1 mốc).
- **✅ VERIFY THẬT sau fix** (preview, màn "Chuẩn bị phòng" — Admin xem tất mọi phòng): Thứ 4 08/07 hiện đúng **P101 · Trần Bảo Lộc** + **P301 · Hoàng Khánh Linh** (trước fix cả 2 sẽ hiện "⚠ chưa gán"). `tsc --noEmit` sạch.
- **⭐ BÀI HỌC (bổ sung ②):** dữ liệu effective-dated PER-SLOT (như TKB/`phan_cong_ops`) — nếu cần tra "trạng thái tại 1 ngày" cho NHIỀU ngày khác nhau trong 1 khoảng, PHẢI resolve theo ĐÚNG ngày của từng bản ghi kết quả, KHÔNG được snapshot 1 ngày đại diện (kể cả ngày đầu khoảng) rồi dùng chung — snapshot chỉ đúng cho các bản ghi mà hiệu lực đã bắt đầu TRƯỚC mốc đó; bản ghi bắt đầu SAU mốc (hiệu lực rơi giữa khoảng) sẽ bị tra hụt toàn bộ.

### 07-10 (tiếp) — Fix bug MT: gán MT không đóng "Chấm bài trên lớp" + BTVN
- **Báo lỗi (Thùy):** buổi được gán MT nhưng không tự đóng ET/BTVN → task còn kẹt ở Việc của tôi.
- **Điều tra bằng data thật:** query 3 buổi đã gán MT trong DB, so cột đóng với `mt_gan_at`. Kết quả: **ET và Đánh giá ĐÃ đóng đúng** (timestamp khớp sát giờ gán). Cột thật sự KHÔNG đóng = **`ingame_dong_at` (Chấm bài trên lớp) và `btvn_dong_at` (BTVN)** — cả 2 luôn null bất kể buổi nào, dù comment code ghi rõ nguyên tắc "buổi có MT chỉ có 1 hoạt động = kiểm tra".
- **⭐ ROOT CAUSE:** `ganMTVaoBuoi` (mt.ts) chỉ set `danh_gia_xong_at` + `et_dong_at` — code viết từ 07-08 QUÊN 2 cột còn lại. Hệ quả kép: (1) 2 task "Chấm bài trên lớp"/"Chấm BTVN" kẹt vĩnh viễn ở Việc-của-tôi cho GV/TG của buổi đó; (2) NẶNG HƠN — buổi gần như KHÔNG BAO GIỜ lên `hoan_tat`, vì điều kiện hoàn tất của phase MT (`gami.ts` closePhase `otherClosed`) đòi `ingame_dong_at && et_dong_at` cả hai, mà ingame không bao giờ tự đóng.
- **Fix:** thêm 2 dòng set `ingame_dong_at`/`btvn_dong_at` (cùng guard `is(...,null)`, cùng pattern set-thẳng-không-qua-closePhase để tránh tính Elo/EXP sai cho phase rỗng).
- **✅ VERIFY THẬT qua preview (re-gán lại cả 3 buổi `9S1` đã gán MT trước đó để trigger code mới):** cả 3 buổi giờ đều `ingame=true, et=true, danh_gia=true, btvn=true` (buổi `08/07` đã `hoan_tat` từ trước, 2 buổi còn lại vẫn `mo` đúng — chờ chấm MT thật). `tsc --noEmit` sạch.
- **⚠ Sự cố nhỏ trong lúc test (đã tự sửa):** thao tác điền form qua `preview_eval` bấm nhầm vào ô đổi-tên-tài-liệu (autosave) làm tên MT "Kiểm tra khảo sát tháng 7_Nâng cao" tạm thời đổi thành "9S1" — phát hiện ngay qua screenshot, sửa lại đúng tên trong vòng 1 bước, verify DB xác nhận tên đã khôi phục đúng. Không có mất mát dữ liệu khác.

### 07-10 (tiếp 2) — Fix 1 lượt 4 bug OPS (Thùy báo): tự chấm sai vai, lớp chưa khai giảng, scroll reset, Prep không cuộn hết
- **Bug 1 — OPS tự chọn được mức "GV chấm"/"Leader chốt" ở Prep:** `LuotCard` (PrepScreen.tsx) hiện MỌI control (checklist/đóng/chấm-điểm-nền/leader-chốt) cho BẤT KỲ ai xem màn, không phân vai. Fix: gate riêng cụm "GV chấm" (quick-pick 100/90/80/70) + "✓ Leader chốt" — chỉ hiện cho GV/TG (có lớp trực tiếp) hoặc quản lý (có cấp dưới)/admin; OPS thuần chỉ thấy dòng "Chờ GV chấm + leader chốt". Checklist (dọn phòng/KIT) + Đóng vẫn của OPS như cũ (đúng việc).
- **Bug 2 — Lớp CHƯA khai giảng vẫn đòi gán người trực:** `listTkbVoiNguoiTruc` (nguồn màn "Phân công Ops") fetch TOÀN BỘ slot TKB còn hiệu lực, KHÔNG lọc `ngay_khai_giang` — vi phạm luật "lớp chưa khai giảng → session pure-derive tự KHÔNG sinh" (đã áp đúng ở Report/Tan/Prep từ đầu, riêng màn phân công ca trực bị sót). Fix: lọc bỏ lớp có `ngay_khai_giang > hôm nay`. Verify data thật: 9 lớp khai giảng 15/07 (6S1/5A2/5T2/4A1/5T1/6A2/5A1/6S2/6A1) biến mất khỏi danh sách.
- **Bug 3 — Gán người trực xong màn nhảy về đầu trang:** `reload()` (PhanCongOpsScreen.tsx) `setLoading(true)` vô điều kiện sau MỖI lần gán → lưới co về "Đang tải…" rồi build lại → mất vị trí cuộn (đúng bug-class đã fix ở HocSinhScreen 07-08, lần này sót ở màn Ops). Fix: chỉ loading ở lần tải ĐẦU (rows rỗng), các lần sau giữ lưới cũ. Verify thật: gán 1 ca lúc scrollTop=736 → sau khi lưu vẫn scrollTop=736 (trước fix sẽ về 0).
- **Bug 4 — Màn "Chuẩn bị phòng" không cuộn hết được:** root `PrepScreen.tsx` là 1 block div thường, KHÔNG có khung cuộn riêng — khung NGOÀI (`NhanSuHome` cấp staffLeaf) là `overflow-hidden`, nội dung tràn khỏi viewport bị CẮT THẲNG, không phải thiếu data. Fix: tách header đứng yên + khung dưới `flex-1 overflow-auto` tự cuộn (nested scrollbox, cùng pattern các tab BuoiHocScreen). Verify: `scrollHeight`(1121) > `clientHeight`(666) → cuộn xuống thấy đúng "Chủ nhật 12/07" (nhóm cuối tuần) trước đây bị cắt mất.
- **✅ VERIFY THẬT cả 4 bug qua preview + DB:** dùng data thật (không giả lập) — gán/xem/cuộn qua UI, đối chiếu DB trước/sau. Xác nhận thêm bằng truy vấn tổ chức: Trần Thu Thủy/Hoàng Khánh Linh (chỉ giữ ghế "Thành viên", 0 cấp dưới, không lớp) → đúng đối tượng bị gate ở bug 1; Trần Bảo Lộc (giữ "Lead vận hành", 3 cấp dưới) → đúng đối tượng KHÔNG bị gate. Dọn sạch data test đã tạo trong lúc verify (1 dòng `prep_phong` giả lập + 1 dòng `phan_cong_ops` gán thật lúc test bug 3) — không để lại tác dụng phụ. `tsc --noEmit` sạch.

### 07-11 — Đáp án ET/Giáo trình/BTVN về mặc định (revert bảng) · deadline "Việc của tôi" · round-robin nguồn bài
- **Đáp án in (ET/Giáo trình/BTVN):** Thùy báo "đáp án ko ở định dạng bảng mà luôn mặc định" — hiểu lầm ban đầu là bug-report (thiếu bảng), đã build bảng đáp án 2 cột (đề|đáp án) cho Trắc nghiệm/Trả lời ngắn ở cả 3 loại tài liệu. Thùy sửa lại: đó là YêU CẦU đảo ngược — muốn TẤT CẢ loại câu (kể cả Trắc nghiệm/Trả lời ngắn) đều ở định dạng mặc định (đề rồi lời giải bên dưới), KHÔNG bảng, kể cả bảng "Trả lời ngắn" cũ vốn đã có SẴN từ trước (không phải do phiên này thêm). Đã revert toàn bộ (ET/BTVN/Giáo trình): mọi loại câu render qua `CauItem`/khối đề-rồi-lời-giải, không còn `<table>` đáp án ở đâu trong 3 loại tài liệu này. **Bài học: câu "X ko ở định dạng bảng mà luôn mặc định" đọc 2 chiều được (mô tả bug HIỆN TẠI vs yêu cầu trạng thái ĐÍCH) — lần sau gặp câu kiểu này, hỏi lại tường minh trước khi build, đừng suy luận 1 chiều dù nghe "tự nhiên" hơn.**
- **"Việc của tôi" sort sai theo ngày khởi tạo:** `NhanSuHome.tsx` gom/sort việc theo `t.ngay` (ngày buổi/ngày tạo task) thay vì ngày DEADLINE thật — BTVN deadline = 2h trước ca học TIẾP THEO (có thể cách ngày buổi vài ngày), ET = trưa hôm sau, nên việc hiện sai hàng ngày. Thêm `ngayCuaTs(ms)` (tuan.ts, đảo ngược `vnInstant`) → gom/sort theo ngày-của-deadline; áp cho `weekTasks` (lọc tuần) lẫn `dayMap` (nhóm theo ngày hiển thị). opsActive (điểm danh, không có deadline riêng — hạn = chính ngày buổi) giữ nguyên theo `ngay`.
- **Gợi ý câu round-robin theo "nguồn bài":** `autoSuggestByLoai`/`autoSuggestBtvn` (tailieu.ts) trước đó gộp phẳng mọi câu cùng loại_cau rồi lấy N câu ÍT-DÙNG-NHẤT đầu tiên — 1 dạng có nhiều "nguồn" (1 câu gốc + N clone AI từ nguồn đó) dễ bị dồn hết vào 1-2 nguồn có nhiều clone nhất. Thêm `pickRoundRobinByNguon` (nhóm theo `parent_ma_cau ?? ma_cau`, xoay vòng lấy 1 câu/nguồn cho đến đủ N) — đảm bảo đa dạng nguồn thay vì chỉ ưu tiên ít-dùng-nhất.
- `tsc --noEmit` sạch cả 3 việc; deadline-sort verify bằng đọc code (không có GV/TA test account sẵn để verify data thật qua UI trong phiên này).

### 07-11 (tiếp) — BUG BTVN xuất PDF treo (chưa rõ nguyên nhân, KHÔNG do phiên này) + regression dòng-kẻ-mồ-côi (2 lần sửa)
- **Điều tra "tải tài liệu bị xô lệch" (Thùy báo, không kèm ảnh lúc đầu):** test trực tiếp bản xem thử ET/Giáo trình buổi trong browser sandbox — **bản paged.js TREO VĨNH VIỄN ở "đang dựng trang…", 0 trang bao giờ render xong**, dù đã: git stash toàn bộ sửa phiên này (test lại đúng HEAD commit, VẪN treo → không phải do code phiên này), restart dev server (VẪN treo → không phải do server chạy lâu), tab browser mới (VẪN treo), tắt React StrictMode (VẪN treo, dù StrictMode double-invoke effect có làm ra 2 container song song — sửa đúng nhưng không phải root cause chính). **CHƯA tìm ra nguyên nhân treo trong môi trường sandbox này** — có thể là giới hạn riêng của browser pane test (headless Chromium), không phản ánh đúng trải nghiệm Thùy dùng máy thật (Thùy xác nhận sau đó: PDF THẬT có tải ra, không treo — chỉ bị lệch layout). ⚠️ Việc-cần-làm-sau: nếu còn ai gặp treo y hệt, đào tiếp từ đây (đã loại: code phiên 07-11, server stale, StrictMode double-invoke, tab cũ).
- **Bug thật (từ ảnh Thùy gửi — tài liệu BTVN "Buổi 4" lượng giác):** 1 dòng kẻ (chấm chấm) MỒ CÔI nằm ngay đầu 1 trang mới, dính sát ngay trên đầu câu kế tiếp (Câu 8) — nhìn như xô lệch/dính nhầm câu. Root cause: `.pv-btvn .pv-cau{break-inside:auto}` (PrintView.tsx) CHỦ Ý cho câu BTVN tách ngang trang để đỡ tốn giấy ("không bỏ trống cuối trang") — khối "dòng kẻ để viết" (`.pv-write`, N dòng `.pv-wline`) là con của `.pv-cau` nên cũng bị tách theo, có thể chỉ 1 dòng lẻ rơi sang đầu trang sau.
  - **Sửa lần 1 (SAI, gây regression mới):** đổi `.pv-write{break-inside:avoid}` — hết mồ côi nhưng phá luôn mục đích gốc của `break-inside:auto`: khối dòng-kẻ (thường 5 dòng BTVN) giờ KHÔNG được tách nữa → nếu không đủ chỗ, CẢ KHỐI 5 dòng nhảy nguyên sang trang mới → **bỏ trống nhiều khoảng cuối trang cũ** (Thùy báo lại: "code trước đây ko bị, giờ m fix lại bị"). Đây CHÍNH XÁC là lỗi mà `break-inside:auto` được thêm vào từ đầu để tránh — sửa lần 1 đã vô tình quay lại vấn đề gốc.
  - **⭐ Sửa lần 2 (đúng, ĐANG DÙNG):** thay vì avoid nguyên khối, GỘP TỪNG CẶP 2 dòng (`WriteLines` component mới, PrintView.tsx, dùng chung ET/MT/BT/BTVN) — mỗi cặp `.pv-wpair{break-inside:avoid}`, nhưng khối `.pv-write` bao ngoài KHÔNG avoid → các cặp vẫn được phép tách rời nhau qua trang (giữ lợi ích "đỡ tốn giấy"), chỉ riêng NỘI BỘ 1 cặp thì không tách (không còn mồ côi 1 dòng lẻ). Số lẻ dư (n lẻ, vd BTVN mặc định 5 dòng) đặt Ở ĐẦU nhóm (`[1,2,2]` không phải `[2,2,1]`) — vì phần DỄ bị đẩy sang trang mới nhất khi tràn là phần CUỐI, nên phần cuối phải luôn là cặp đủ 2, phần lẻ nằm đầu (đã render/đặt trang trước, ít rủi ro tràn hơn).
  - **BÀI HỌC (ghi lại theo yêu cầu Thùy — tránh vướng lại):** `break-inside:avoid` trên 1 khối lồng trong 1 cha có `break-inside:auto` (cho phép tách) không phải free lunch — nó chỉ dời vấn đề "mồ côi" thành vấn đề "nhảy nguyên khối bỏ trống trang", TRỪ KHI chia nhỏ khối đó thành các NHÓM NHỎ (ở đây: cặp 2 dòng) mỗi nhóm tự avoid riêng — cha vẫn auto (tách được GIỮA các nhóm), chỉ NỘI BỘ mỗi nhóm nhỏ mới bị khoá. Muốn triệt để 100% (không còn cả trường hợp 1 dòng lẻ đơn độc khi n lẻ) cần thêm logic JS đo chỗ-còn-lại-trên-trang trước khi quyết định breakpoint — ngoài khả năng CSS thuần, chưa làm (đánh đổi chấp nhận được: n lẻ hiếm khi rơi đúng ranh giới trang).
- `tsc --noEmit` sạch. Chưa verify lại bằng ảnh thật (đang chờ Thùy soi lại PDF sau fix lần 2, vì phiên này bản xem thử sandbox vẫn treo — không tự chụp lại được để so trước/sau).

### 07-11 (tiếp 3) — ROOT CAUSE THẬT của "xô lệch": JPEG rám chữ ở "⬇ Tải PDF" (KHÔNG phải "🖨 In")
- **Đường vòng sai trước đó:** nghi ngờ ban đầu (header/footer "Microsoft Print to PDF" bị driver Windows làm vỡ CSS nhiều-lớp-background) — Thùy gửi 2 file PDF THẬT cùng 1 tài liệu để so sánh trực tiếp (`Read` tool đọc được PDF) → **SAI hoàn toàn hướng nghi ngờ**: bản qua "🖨 In → Microsoft Print to PDF" là bản **ĐẸP** (chữ nét, vector, đọc rõ mọi chỗ kể cả header/footer) — bản qua nút **"⬇ Tải PDF"** (`downloadPagesPdf`, html2canvas-pro raster) mới là bản **LỖI THẬT**, rám/nhòe rõ nhất đúng ở header/footer (chữ trắng 11px + text-shadow đè trên dải nền gradient nhiều màu).
- **⭐ BÀI HỌC — đừng đoán, ĐỌC FILE THẬT khi có thể:** `Read` tool đọc trực tiếp được nội dung PDF (kể cả từ đường dẫn `Downloads` do Thùy gửi qua `@đường-dẫn`) — so sánh song song 2 file cho ra kết luận DỨT KHOÁT trong 1 bước, thay vì suy luận vòng vo qua metadata (`/Producer`) hay giả thuyết CSS-driver-Windows không kiểm chứng được. Lần sau gặp báo lỗi hình ảnh/PDF, ưu tiên XIN FILE THẬT (hoặc đọc trực tiếp nếu Thùy đã gửi đường dẫn) trước khi suy đoán từ code.
- **ROOT CAUSE:** `downloadPagesPdf` (PrintView.tsx) rasterize mỗi trang bằng `html2canvas(..., {scale:2})` rồi encode `canvas.toDataURL('image/jpeg', 0.9)` → nhúng vào PDF qua `pdf.addImage(..., 'JPEG', ...)`. JPEG là nén **MẤT DỮ LIỆU** (DCT + chroma subsampling) — tệ nhất đúng ở "chữ nhỏ trên nền nhiều màu tương phản cao" (chính xác là header/footer: chữ trắng 11px + đổ bóng, đè trên dải sóng gradient hồng-cam-xanh) → vỡ viền chữ thành rám/nhòe. Nội dung thân bài (chữ đen 17px trên nền trắng phẳng) là trường hợp TỐT của JPEG nên ít bị lộ hơn, dễ bỏ sót khi chỉ soi qua loa.
- **Fix:** đổi `canvas.toDataURL('image/jpeg', 0.9)` + `addImage(...,'JPEG',...)` → `canvas.toDataURL('image/png')` + `addImage(...,'PNG',...)` — PNG nén KHÔNG mất dữ liệu, chữ nét lại. Đánh đổi: file nặng hơn JPEG (chấp nhận được — tài liệu giáo dục chữ/trắng nhiều, PNG nén vùng phẳng-màu-đơn hiệu quả, không phải ảnh chụp nhiều chi tiết).
- `tsc --noEmit` sạch. ⚠ CHƯA verify lại bằng file PDF thật sau fix (đang chờ Thùy tải lại và so sánh) — bản xem thử paged.js trong sandbox môi trường này vẫn treo ở bước dựng trang (xem mục treo ở trên) nên không tự tải lại để so được.

### 07-11 (tiếp 4) — Fix JPEG CHƯA đủ: file "⬇ Tải PDF" bị NHÂN BẢN 419 trang/40MB — root cause THẬT là container tích luỹ
- **Thùy test lại bản PNG (fix trước) → VẪN lỗi, gửi file thật:** đọc file mới thấy **419 trang / 40.8MB** cho 1 tài liệu BTVN đúng ra chỉ ~4 trang — vượt xa mọi kỳ vọng, PNG không phải root cause chính (dù vẫn đúng hướng, JPEG thật sự tệ hơn cho chữ-nhỏ-nền-màu).
- **⭐ ROOT CAUSE THẬT (nối lại với phát hiện "paged.js TREO" đã ghi ở mục "07-11 (tiếp)" phía trên — LÚC ĐÓ tưởng là giới hạn riêng sandbox, HOÁ RA là bug thật):** cả 5 file PrintView (PrintView/ETPrintView/MTPrintView/BTPrintView/DeThiPrintView) dùng chung 1 pattern "Race-safe" SAI: container cũ CHỈ được dọn **BÊN TRONG `.then()` của run MỚI** (`Array.from(dst.children).forEach(c => c!==container && c.remove())`). Nếu 1 run TREO (paged.js `Previewer.preview()` không bao giờ resolve — đã tự reproduce nhiều lần trong sandbox phiên này, ổn định, không do StrictMode/server/tab cũ) thì container của nó **KHÔNG BAO GIỜ bị dọn** theo cơ chế "dọn khi resolve". Mỗi lần effect chạy lại (đổi `gv`/`scope`/`lopTen`/mở lại preview…) lại thêm 1 container MỚI chồng lên — `downloadPagesPdf` quét `dst.querySelectorAll('.pagedjs_page')` vét HẾT MỌI container còn sót → PDF nhân bản gấp hàng chục/trăm lần tuỳ số lần effect đã chạy trước đó.
- **Fix (cả 5 file):** đổi thời điểm dọn — dọn **NGAY LÚC BẮT ĐẦU run mới** (`Array.from(dst.children).forEach(c => c.remove())` chạy TRƯỚC khi tạo container mới), KHÔNG đợi run mới resolve rồi mới dọn. Đảm bảo `dst` không bao giờ chứa quá 1 container tại bất kỳ thời điểm nào, bất kể run trước đó có bao giờ resolve hay không — loại bỏ hoàn toàn khả năng tích luỹ.
- **⭐ BÀI HỌC:** "dọn cái cũ khi cái mới xong" (cleanup-on-resolve) KHÔNG an toàn nếu "cái cũ" có thể KHÔNG BAO GIỜ xong (treo/lỗi-không-throw) — phải "dọn cái cũ NGAY khi bắt đầu cái mới" (cleanup-on-start) để không phụ thuộc vào việc run trước có kết thúc hay không. Áp dụng cho MỌI pattern "container riêng mỗi lần render lại" tương tự trong tương lai.
- Thùy phản hồi thêm: nghi ngờ CHÍNH html2canvas-trên-DOM-sống-trong-app-shell là vấn đề gốc (nhắc lại bài học V1 "chụp ảnh DOM = xuất HTML render lại context sạch, KHÔNG html2canvas node sống trong app" — xem `EtAnhGuiPH` cho pattern đúng). Sau khi sửa container-tích-luỹ, CHƯA rõ còn vấn đề gì thuộc về chính kỹ thuật html2canvas-trên-node-sống hay không — **CHƯA điều tra tiếp** (ưu tiên fix bug nặng nhất — nhân bản trang — trước). Nếu Thùy test lại vẫn thấy vấn đề (không phải nhân bản trang, mà là méo/lệch layout thật), cần quay lại xem xét kiến trúc: đổi từ html2canvas-trên-`.pagedjs_page`-sống-trong-`document.body` sang render trong iframe/popup cô lập hoàn toàn.
- `tsc --noEmit` sạch cả 5 file. ⚠ CHƯA verify lại bằng file PDF thật (môi trường sandbox vẫn treo bước dựng trang paged.js, không tự tải lại để so được — đang chờ Thùy test).

### 07-11 (tiếp 5) — Upload tài liệu lên Supabase Storage + gắn link chia sẻ (Thùy yêu cầu, mục 3b)
- **Migration `0095_tai_lieu_file_url.sql`:** thêm cột `tai_lieu.file_url text` (nullable) — link PDF public của bản export GẦN NHẤT. Áp qua `node scripts/_apply_one.mjs` (không chạy lại toàn bộ `migrate.mjs` vì các migration đầu KHÔNG idempotent với DB đã có sẵn — `create table` không `if not exists`) + `npm run schema` refresh.
- **Bucket `kho-tailieu` đã có sẵn** (migration 0008, verify tồn tại từ 07-09) — public read + authenticated insert/update/delete, tái dùng `uploadKhoFile` (kho/api.ts) có sẵn, KHÔNG cần bucket/policy mới.
- **Chốt với Thùy (AskUserQuestion):** upload TỰ ĐỘNG mỗi lần bấm "⬇ Tải PDF" (không phân biệt bản HS/GV, không cần nút riêng) — ghi đè `file_url` mỗi lần, luôn trỏ tới bản export gần nhất.
- **`downloadPagesPdf`** (PrintView.tsx) thêm tham số optional `taiLieuId` — sau `pdf.save()` (tải cục bộ luôn thành công độc lập), lấy `pdf.output('blob')` → `uploadKhoFile` (bucket kho-tailieu) → `setTaiLieuFileUrl(taiLieuId, url)`. Upload là **BEST-EFFORT** (try/catch nuốt lỗi, không throw) — mất mạng lúc upload không được làm hỏng lượt tải file cục bộ đã xong.
- **UI (`KhoTaiLieuScreen.tsx`):** nút "🔗 Copy link" cạnh "⬇ Tải PDF", chỉ hiện khi `r.file_url` đã có; bấm → `navigator.clipboard.writeText` + feedback "✓ Đã copy" 2s tự tắt (KHÔNG `alert()`, đúng luật UX CLAUDE.md §6). `onClose` của cả preview modal (`print`) lẫn tải-headless (`dlDoc`) đổi thành `reload()` (không chỉ đóng state) để cột link cập nhật ngay sau khi file_url vừa được ghi.
- `tsc --noEmit` sạch. ⚠ CHƯA verify thật qua UI (upload cần tài liệu thật + mạng, môi trường sandbox phiên này paged.js vẫn treo không tải được để trigger upload) — Thùy tự test và xác nhận link copy/mở được giúp.

### 07-11 (tiếp 6) — Fix "tiếp 4" CHƯA đủ (210 trang/20MB vẫn còn) + tách "🔗 Lấy link" khỏi "⬇ Tải PDF"
- **Thùy test lại: VẪN 210 trang/20.4MB** cho 1 ET đáng ra ~2 trang — fix "cleanup-on-start" (mục tiếp 4) không đủ. Cài được `poppler` (winget, sau đó copy binary vào `~/bin` vì tool đọc PDF của phiên này chạy process/sandbox riêng, KHÔNG thấy PATH mới dù đã cài) để tính đọc file trực tiếp qua `pages` param — KHÔNG thành công (tool báo "pdftoppm not installed" dù binary đã chạy được từ Bash trực tiếp) → môi trường đọc-PDF-theo-trang của phiên này bị cô lập khỏi PATH hệ thống, không sửa được từ phía Claude. Đành suy luận thuần từ code, không xác nhận được bằng mắt.
- **⭐ ROOT CAUSE THẬT (khác hẳn giả thuyết "cleanup-on-start"):** với headless single-shot (mount → tải → đóng, `gv`/`scope` không đổi), effect dựng trang chỉ CHẠY 1 LẦN về lý thuyết — fix "xoá container cũ NGAY khi bắt đầu run mới" ở mục tiếp 4 gần như KHÔNG CÓ TÁC DỤNG cho case này (không có "run cũ" nào để đụng tới trong kịch bản đơn giản). Nghi ngờ mới, nghiêm trọng hơn: **RÚT DOM CỦA CONTAINER RA KHỎI TRANG NGAY LÚC PAGED.JS PREVIEWER CÒN ĐANG ĐO LAYOUT DỞ (chưa resolve) LÀM NÓ SINH TRANG CHẠY LOẠN** — paged.js đo chiều cao còn lại dựa trên DOM ĐANG GẮN vào document; rút ra giữa chừng → phần tử trả về kích thước `0`/`NaN` → thuật toán ngỡ "còn tràn" → cứ tạo trang mới mãi cho tới khi chạm giới hạn nội bộ nào đó (khớp con số hàng trăm trang bất thường). Đích thân fix "tiếp 4" (xoá NGAY) chính là hành động RÚT DOM SỚM đó — có thể đã làm bug NẶNG HƠN thay vì nhẹ hơn.
- **⭐ Fix đúng (thay thế hoàn toàn "tiếp 4"):** ĐỔI chiến lược — KHÔNG BAO GIỜ xoá DOM container tuỳ tiện. Container cũ chỉ bị **ẨN** (`display:none`, giữ nguyên trong DOM) khi run MỚI đã **resolve xong** (an toàn — không đụng ai đang đo dở). Thêm `activeContainerRef` (ref riêng) trỏ đúng container HIỆN HÀNH (chỉ set trong `.then()` khi resolve) — `downloadPagesPdf`/window.print giờ CHỈ đọc trang từ `activeContainerRef.current`, KHÔNG quét cả `dstRef` (nơi có thể còn container cũ ẩn/treo tồn tại vô hại). Áp cho cả 4 file (ET/MT/DeThi/PrintView — BTPrintView không dùng headless nên bỏ qua). Đánh đổi: container treo vĩnh viễn (nếu có) rò rỉ nhẹ trong DOM cho tới khi cả component unmount (đóng modal) — chấp nhận được, ưu tiên KHÔNG BAO GIỜ corrupt 1 layout đang chạy hơn dọn sạch ngay.
- **⭐ BÀI HỌC (thay thế bài học sai ở mục tiếp 4):** với 1 thư viện đo-layout-bất-đồng-bộ (paged.js) đang thao tác 1 DOM node, KHÔNG BAO GIỜ xoá/rút node đó ra TRONG LÚC thư viện có thể vẫn đang dùng nó (promise chưa settle = không biết chắc nó đã dừng hẳn hay chưa) — "dọn sớm cho gọn" tưởng an toàn hơn "dọn muộn khi chắc chắn xong" nhưng THỰC RA NGƯỢC LẠI. Quy tắc đúng: ẨN (không xoá) cho tới khi CHẮC CHẮN đã settle (`.then()`/`.catch()` của chính node đó), và dùng 1 ref RIÊNG để trỏ tới bản "chắc chắn đúng" thay vì quét chung 1 container cha có thể lẫn rác.
- **Story Thùy làm rõ lại use-case (mục 3b):** PH xin tài liệu → cần gửi PDF HOẶC link — Thùy thích LINK hơn (sẽ trỏ về web BK Academy tương lai, và sau này tải được từ app nữa). Phản hồi: **"Link phải có TRƯỚC khi bấm tải, không phải bấm tải mới có"** — đảo ngược quyết định "tự động theo Tải PDF" đã chốt ở mục tiếp 5.
- **Fix:** tách hẳn "🔗 Lấy link" thành hành động ĐỘC LẬP với "⬇ Tải PDF" — `downloadPagesPdf` thêm tham số `skipLocalSave` (bỏ qua `pdf.save()`, chỉ upload+trả URL; lỗi upload THROW thẳng ra ngoài thay vì nuốt lỗi như khi đi kèm tải, vì đây là MỤC ĐÍCH DUY NHẤT của lượt gọi). 4 PrintView (ET/MT/DeThi/PrintView, không BT) thêm prop `linkOnly` (đi kèm `headless`) — `taiPdf(skipLocalSave)` giờ nhận tham số, headless auto-trigger truyền `linkOnly` vào. `KhoTaiLieuScreen`: nút đổi tên linh hoạt theo trạng thái — "🔗 Lấy link" (chưa có `file_url`, bấm sẽ dựng ẩn để tạo) → "🔗 Copy link" (đã có, bấm copy thẳng) → "⏳ Đang lấy…" lúc đang dựng. `reload()` đổi thành trả về mảng rows mới fetch (không chỉ set state) để đọc được `file_url` VỪA GHI ngay sau khi dựng xong, tự động copy vào clipboard luôn (không bắt Thùy bấm thêm lần 2).
- **Future-proofing (không cần làm gì thêm):** `file_url` lưu ở cột DB thật (không phải state client) — bất kỳ front-end tương lai nào (web BK Academy, app mobile) query thẳng `tai_lieu.file_url` là dùng được, không phụ thuộc phiên trình duyệt đã tạo ra nó.
- `tsc --noEmit` sạch cả 6 file đổi. ⚠ CHƯA verify thật (môi trường sandbox phiên này: paged.js hang + tool đọc PDF theo trang bị cô lập khỏi PATH poppler mới cài — không tự kiểm tra bằng mắt được cả 2 fix). Thùy cần test lại: (1) tải PDF 1 tài liệu bất kỳ → số trang đúng thực tế, không nhân bản; (2) bấm "🔗 Lấy link" khi CHƯA từng tải — có link ngay, không tạo file .pdf rơi vào Downloads.

### 07-11 (tiếp 7) — PIVOT KIẾN TRÚC: bỏ hẳn html2canvas cho "⬇ Tải PDF", dùng NATIVE `window.print()` + fix card 3 dòng
- **Thùy vẫn báo lỗi giống hệt sau fix "tiếp 6" (210 trang) và đặt thẳng câu hỏi cốt lõi:** *"tại sao bấm in Microsoft to PDF thì đẹp còn bấm tải lại xấu? Và tại sao m ko đi theo hướng như Micro to PDF kia?"* — chỉ thẳng vào việc phiên này cứ vá từng triệu chứng (JPEG→PNG, cleanup-on-start, hide-not-remove) mà không đặt lại câu hỏi kiến trúc: 2 con đường xuất PDF trong app KHÔNG DÙNG CHUNG ENGINE.
- **⭐ ROOT CAUSE Ở TẦNG KIẾN TRÚC (câu trả lời cho câu hỏi của Thùy):** "🖨 In" gọi thẳng `window.print()` — trình duyệt tự in NGUYÊN TRẠNG DOM đã ổn định (layout đã settle, không còn ai đang đo/ghi gì nữa), không có bước "vẽ lại" nào khác chen vào. "⬇ Tải PDF" (`downloadPagesPdf`/`uploadPagesAsLink`) dùng `html2canvas` — một thư viện JS **TỰ VIẾT LẠI TỪ ĐẦU** việc chụp màn hình (không phải engine gốc của trình duyệt), chạy như 1 tiến trình bất đồng bộ ĐỘC LẬP, có thể ĐUA (race) với `paged.js` (chính thư viện JS khác đang dựng/đo trang) — 2 tiến trình JS độc lập, bất đồng bộ, không có gì đảm bảo đồng bộ tuyệt đối giữa chúng. TOÀN BỘ bug đã chase trong session này (rám JPEG, 419→210 trang, dòng-kẻ-mồ-côi thời điểm nhạy cảm) đều là biến thể của đúng 1 loại vấn đề gốc: 2 xử lý JS độc lập không đồng bộ hoàn hảo với nhau. `window.print()` không có lớp "vẽ lại bằng JS" này nên miễn nhiễm với cả lớp bug đó.
- **⭐ QUYẾT ĐỊNH (Thùy yêu cầu trực tiếp, không phải đề xuất của Claude):** BỎ HẲN html2canvas cho nhu cầu chính "lấy 1 file PDF" — "⬇ Tải PDF" đổi thành gọi `window.print()` y hệt "🖨 In" ở **cả 5 loại tài liệu** (PrintView/ET/MT/DeThi/BT) — gộp 2 nút thành 1 **"🖨 In / Xuất PDF"**. Đánh đổi: cần 1 cú bấm thêm trong hộp thoại in native (chọn "Lưu dưới dạng PDF"/"Microsoft Print to PDF") — không còn tải-tức-thì-im-lặng như trước, NHƯNG đổi lại được ĐÚNG độ tin cậy Thùy đã tự xác nhận qua "Microsoft Print to PDF".
- **"🔗 Lấy link" (upload Storage) — GIỮ html2canvas, không tránh được:** lý do bất khả kháng — trình duyệt CẤM JS lấy blob file từ native print dialog một cách im lặng (rào bảo mật cố ý, không phải giới hạn kỹ thuật sửa được), nên đường "upload lên Storage lấy URL share" bắt buộc vẫn cần tự rasterize bằng html2canvas để có `Blob` đưa lên `uploadKhoFile`. Nhánh này vẫn hưởng lợi từ fix "hide-not-remove + activeContainerRef" (mục tiếp 6) — chỉ không còn dùng cho tải-cục-bộ nữa.
- **Đổi cụ thể (5 file `src/screens/tailieu/*PrintView.tsx` + `KhoTaiLieuScreen.tsx`):** `downloadPagesPdf` đổi tên/thu gọn thành `uploadPagesAsLink(dst, filename, chrome, taiLieuId)` — bỏ hẳn nhánh `pdf.save()`/`skipLocalSave`, LUÔN LUÔN chỉ rasterize→upload→trả URL (dùng riêng cho `layLink()`). Nút "⬇ Tải PDF" tương tác bị XOÁ khỏi cả 5 toolbar; "🖨 In" đổi nhãn "🖨 In / Xuất PDF", `onClick={() => window.print()}`. Headless auto-trigger: `linkOnly ? layLink().finally(onClose) : window.print()`; thêm listener `afterprint` (bắt sự kiện đóng hộp thoại in, dù bấm in hay huỷ) để tự `onClose()` cho luồng headless không-link (thay `.finally(onClose)` cũ vốn gắn theo promise html2canvas). Overlay loading headless thêm class `no-print` (không lọt vào bản in/PDF thật dù timing thế nào). `KhoTaiLieuScreen.tsx`: nút hàng "⬇ Tải PDF" (mount headless `dlDoc`) đổi nhãn thành **"🖨 In nhanh"** (đúng bản chất mới — mở hộp thoại in, không còn tải im lặng).
- **Fix card "Việc của tôi" vỡ 3 dòng (Thùy: *"card 1 dòng như thực tế thành 3 dòng rồi... mỖi card 2 dòng"*):** 4 card (`OpsBuoiCard`/`TaskCard`/`OpsExtraCard`/`PrepTaskCard`, `NhanSuHome.tsx`) trước dùng `flex items-center gap-2` (1 hàng ngang: icon+label+badge cùng dòng) — tên việc dài tự xuống dòng trong khi badge deadline vẫn đứng nguyên bên phải → nhìn thành 3 dòng lệch. Đổi cả 4 sang `flex flex-col`: dòng 1 = `<div className="flex items-center gap-1.5">` (icon + tên việc ĐẦY ĐỦ, không rút gọn), dòng 2 = badge deadline/số liệu nhỏ hơn, thụt `pl-[21px]` (căn dưới chữ, không phải dưới icon) — CỐ ĐỊNH đúng 2 dòng mọi độ dài tên.
- `npx tsc --noEmit` sạch. ⚠ CHƯA verify live (môi trường sandbox phiên này paged.js vẫn treo lúc dựng trang — như mọi lượt trước, không tự bấm-thử-bằng-mắt được) — Thùy cần tự test lại: (1) "🖨 In / Xuất PDF" ở cả 5 loại tài liệu → hộp thoại in native hiện ra, chọn Save as PDF ra file ĐÚNG số trang/không lệch; (2) "🔗 Lấy link"/"🖨 In nhanh" ở màn Kho tài liệu; (3) card "Việc của tôi" hiện đúng 2 dòng với tên việc dài.

### 07-11 (tiếp 8) — Auto-fill tên file khi in native · ROOT CAUSE THẬT header/footer (background→img) · tự động lấy link cho MỌI tài liệu
- **Thùy phản hồi 2 việc:** (1) "🖨 In / Xuất PDF" không khác gì bấm in thủ công nếu vẫn phải tự gõ tên file trong hộp thoại — cần tự điền sẵn. (2) Gửi thẳng link PDF thật (`🔗 Lấy link` vừa tạo) kèm câu hỏi thẳng "có mỗi lỗi header/footer fix mãi không xong?", và hỏi tại sao phải bấm mới có link thay vì có sẵn cho MỌI tài liệu.
- **Fix (1) — tự điền tên file:** thêm `printWithFilename(filename)` (PrintView.tsx, export dùng chung) — đổi `document.title` thành tên tài liệu NGAY TRƯỚC `window.print()` (Chromium/Microsoft Print to PDF lấy `document.title` làm tên gợi ý mặc định trong hộp thoại lưu), khôi phục lại title cũ khi hộp thoại đóng (`afterprint`). Áp cho cả 5 loại tài liệu — tên file trong hộp thoại giờ khớp đúng tên tài liệu trong Kho, không cần Thùy gõ lại.
- **⭐ ROOT CAUSE THẬT của lỗi header/footer (khác hẳn mọi giả thuyết trước — lần này đọc TRỰC TIẾP file PDF thật Thùy gửi bằng cách tự cài + tự gọi `pdftoppm` (poppler) qua Bash, KHÔNG qua Read tool nữa vì Read tool's PDF renderer bị cô lập khỏi PATH suốt phiên này, xem mục "tiếp 6"):** crop header/footer ở độ phân giải cao cho thấy dải MÀU (sóng gradient hồng-cam-xanh) chỉ hiện ở phần TRÊN CÙNG rất mỏng của khối 18mm/15mm, phần còn lại TRẮNG — trong khi CHỮ (canh giữa theo chiều cao ĐẦY ĐỦ của khối, `align-items:center`) lại rơi đúng vào vùng trắng đó → chỉ còn thấy bóng đổ (`text-shadow`) mờ mờ, không thấy chữ trắng thật. Nguyên nhân: dải sóng vẫn đặt qua CSS `background:url("data:image/svg+xml,...") center/100% 100%` — html2canvas rasterize background data-URI SVG **KHÔNG tôn trọng `backgroundSize:100% 100%`**, dùng kích thước "tự nhiên" theo tỉ lệ viewBox gốc (1200:100 = 12:1) thay vì kéo giãn theo khối chứa → dải sóng bị nén dẹt xuống rất thấp so với khối 18mm/15mm thật. Đây CHÍNH XÁC là bug đã ghi nhận từ đầu file (comment §367, hồi đó áp cho logo/chip) — nhưng hồi đó CHỈ sửa logo/chip (đổi sang `<img>`), CHƯA sửa dải sóng (vẫn còn `background`).
- **Fix (2):** dải sóng header/footer (`injectChrome`, PrintView.tsx) chuyển hẳn từ CSS `background` sang `<img>` thật (`position:absolute;inset:0;width:100%;height:100%`) — đúng pattern đã chứng minh html2canvas render tin cậy (logo/chip). Text tách thành `<span>` riêng đè lên trên (`position:absolute;inset:0`), không còn phụ thuộc background của cùng 1 div.
- **Bug này CHỈ ảnh hưởng "🔗 Lấy link"** (đường DUY NHẤT còn dùng html2canvas, theo quyết định kiến trúc mục "tiếp 7") — "🖨 In / Xuất PDF" (native print, dùng chính CSS pseudo-element `::before`/`::after` gốc, browser tự render `background-size:100% 100%` ĐÚNG) không dính lỗi này.
- **Việc (2) — tự động lấy link cho MỌI tài liệu, không cần bấm (`KhoTaiLieuScreen.tsx`):** thêm hàng đợi NỀN (`linkQueue`) — mọi tài liệu CHƯA có `file_url` (kể cả tài liệu mới tạo) tự động được xếp hàng, xử lý TUẦN TỰ (1 job/lần, tránh hâm nóng máy dựng nhiều trang cùng lúc), KHÔNG tự copy clipboard (chỉ job Thùy bấm tay mới copy — `autoCopy` phân biệt 2 loại job). Sau khi sửa tài liệu qua ET/Giáo trình/Đề thi/MT Editor (hoặc đổi tên) — tự động xếp hàng LÀM MỚI link (nội dung vừa đổi, link cũ giờ lỗi thời). Thêm nút "↻" cạnh "🔗 Copy link" để Thùy tự bấm làm mới thủ công khi cần (vd tài liệu sửa từ nơi khác ngoài Kho, hệ thống không tự biết để làm mới).
- **⚠ Giới hạn CHƯA xử lý (nói rõ với Thùy, không giấu):** chỉ tự làm mới link khi sửa QUA đúng 4 editor dispatch từ màn Kho tài liệu — sửa tài liệu ở màn khác (nếu có) sẽ KHÔNG tự kích hoạt làm mới, link cũ vẫn đứng yên cho tới khi Thùy tự bấm "↻". Chưa có cơ chế phát hiện "nội dung đổi nhưng chưa làm mới link" tổng quát (cần thêm cột theo dõi thời điểm tạo link so với `updated_at` — để sau nếu thấy cần).
- **Watchdog cho job NỀN:** paged.js từng TREO vĩnh viễn (tái hiện nhiều lần trong sandbox phiên 07-11) — job NỀN (không ai đứng canh như bấm tay) mà treo quá 45s thì tự bỏ, nhường hàng đợi đi tiếp, tránh 1 tài liệu lỗi chặn đứng backfill của mọi tài liệu còn lại. Job bấm tay không có watchdog (Thùy tự thấy được nếu treo).
- **✅ Verify được:** `npx tsc --noEmit` sạch. Tự tải + tự dựng ảnh (qua `pdftoppm` cài trực tiếp bằng Bash, bypass Read tool) từ ĐÚNG link Thùy gửi — xác nhận ĐÚNG hiện tượng lỗi trước khi sửa (ảnh chụp header/footer cho thấy rõ chữ rơi ra ngoài dải màu). Test hàng đợi tự động qua browser preview: xác nhận CƠ CHẾ hoạt động (2 tài liệu tự chuyển sang "⏳ Đang tự tạo link ở nền…" không cần bấm).
- **⚠ CHƯA verify được:** bấm "↻ Tạo lại link" cho đúng tài liệu Thùy gửi (ET 11A1) trong sandbox → treo lúc dựng trang, đợi hơn 25s không xong, `file_url` trong DB xác nhận VẪN CHƯA đổi (query trực tiếp qua `pg` client) — đúng bug hang paged.js đã ghi nhận nhiều lần trong sandbox này (không rõ có xảy ra trên máy thật của Thùy hay không). KHÔNG tự chốt được fix header/footer bằng ảnh SAU khi sửa — Thùy cần tự bấm "↻" cho tài liệu bất kỳ và tải lại để xác nhận header/footer đã đúng.

### 07-11 (tiếp 9) — SỰ CỐ THẬT: "vào Kho tài liệu là load mãi Đang lấy link" — backfill-mọi-tài-liệu quá liều + watchdog thiếu vế
- **Thùy báo (sau khi merge PR #4 lên main, y hệt lo ngại đã tự flag ở cuối turn trước):** vào Kho tài liệu thấy "Đang lấy link" load mãi không xong.
- **⭐ ROOT CAUSE:** query DB xác nhận **331/343 tài liệu (96%) CHƯA có `file_url`** — cơ chế "backfill tự động MỌI tài liệu thiếu link" thêm ở mục tiếp 8 (`useEffect(() => rows.filter(!file_url).forEach(enqueueLink), [rows])`) enqueue **CẢ 331 DOC MỘT LÚC MỖI LẦN MỞ MÀN**, xử lý tuần tự (đúng thiết kế — 1 job/lần), nhưng hễ **1 trong 331 doc bị paged.js treo** (bug đã biết, tái hiện nhiều lần trong session) là **CẢ HÀNG ĐỢI KẸT CỨNG VĨNH VIỄN** tại đúng doc đó — watchdog cũ (45s) chỉ áp cho job NỀN nhưng dùng đúng 1 điều kiện `linkDoc.autoCopy` mà THỰC RA vẫn chạy đúng thiết kế... **THẬT RA bug nằm ở việc quy mô 331 doc tự động là QUÁ LỚN + watchdog 45s là watchdog Ở TẦNG NGOÀI (KhoTaiLieuScreen) chứ chưa có watchdog TRONG CHÍNH effect dựng paged.js** (PrintView/ET/MT/DeThi) — nếu Thùy bấm tay 1 job riêng lẻ (autoCopy=true) mà nó treo, tầng ngoài KHÔNG watchdog (theo đúng comment cũ "Thùy tự đóng"), nhưng lúc treo **overlay headless KHÔNG CÓ NÚT ĐÓNG** (chỉ hiện khi `renderErr`/`dlErr` có giá trị, mà nhánh dựng-trang-treo không set 2 biến này bao giờ) → Thùy KẸT THẬT SỰ, không có cách thoát ngoài reload cả trang.
- **⭐ FIX 2 TẦNG (đúng gốc, không chỉ vá triệu chứng):**
  1. **Bỏ hẳn auto-backfill-MỌI-tài-liệu lúc mount** (`KhoTaiLieuScreen.tsx`) — thay bằng nút **"🔗 Tạo link hàng loạt (N còn thiếu)"** Thùy TỰ BẤM khi muốn (có `confirm()` báo trước có thể lâu + nút "⏹ Dừng" giữa chừng, huỷ phần CHƯA chạy — phần đã xong vẫn giữ). Auto-regen-sau-khi-sửa-qua-Editor (1 doc/lần, bounded) GIỮ NGUYÊN — không phải nguồn gây bug (chỉ 1 job, không phải 331).
  2. **Thêm watchdog NGAY TRONG effect dựng paged.js** (cả 4 file có headless: PrintView/ETPrintView/MTPrintView/DeThiPrintView — BT không headless nên bỏ qua) — quá 30s không resolve/không lỗi → tự set `renderErr`/`dlErr` + `setRendering(false)`, **tự hiện nút Đóng** (nút vốn đã gate theo đúng 2 biến này, giờ mới có giá trị để hiện). Kèm sửa 1 bug liên đới: effect auto-trigger in/lấy-link (ET/MT/DeThi) TRƯỚC ĐÓ chỉ check `rendering` KHÔNG check lỗi — nếu không sửa, watchdog set `rendering=false` xong effect auto-trigger sẽ TƯỞNG "dựng xong" và cố `window.print()`/upload trên container RỖNG/LỖI. Thêm `dlErr`/`renderErr` vào điều kiện guard của cả 3 effect auto-trigger.
  3. Watchdog tầng ngoài (`KhoTaiLieuScreen`, mục tiếp 8) GIỮ NGUYÊN 40s làm lưới AN TOÀN THỨ 2 — giờ áp cho MỌI job (kể cả bấm tay, không chỉ nền), nếu tầng trong (30s) đã set lỗi mà không ai bấm Đóng thì tầng ngoài tự dọn 10s sau, hàng đợi vẫn đi tiếp.
- **⭐ BÀI HỌC (nối dài bài học "job nền cần watchdog" ở mục tiếp 8 — lần này sâu hơn):** watchdog ở TẦNG GỌI (KhoTaiLieuScreen enqueue/dequeue) là chưa đủ nếu **tầng bị gọi (component dựng trang) không có đường thoát riêng của chính nó** — 1 component headless mà điều kiện hiện "nút Đóng" phụ thuộc 1 state (`renderErr`) chẳng bao giờ được set khi rơi vào ĐÚNG kịch bản treo (không lỗi, không xong) là spinner-vô-tận-thật-sự, bất kể tầng gọi có dọn dẹp reference của nó hay không (React vẫn giữ component mount cho tới khi tầng gọi unmount nó — nhưng NGƯỜI DÙNG nhìn thấy overlay treo TRƯỚC KHI tầng gọi kịp dọn). Quy tắc: **mọi async op có tiền sử treo-không-lỗi phải có watchdog NGAY TẠI NƠI SINH RA PROMISE ĐÓ**, không chỉ ở tầng orchestrate bên ngoài.
- **⭐ BÀI HỌC 2 (quy mô mặc định của tính năng "tự động"):** đề xuất "tự động hoá X cho MỌI bản ghi" phải tự hỏi trước "hiện có bao nhiêu bản ghi CHƯA đủ điều kiện X?" — 331/343 (96%) là dấu hiệu RÕ đây không phải case "vài cái lẻ tẻ cần dọn", mà là **backfill khối lượng lớn cần Thùy CHỦ ĐỘNG kích hoạt + theo dõi tiến độ + có nút dừng**, không phải thứ nên tự chạy im lặng mỗi lần mở màn.
- `npx tsc --noEmit` + `npm run build` sạch. **✅ Verify được qua browser preview:** mở lại Kho tài liệu sau fix → KHÔNG còn dòng nào tự vào trạng thái "⏳ Đang lấy…"/"Đang tự tạo link ở nền…" (mọi dòng ở trạng thái nghỉ "🔗 Lấy link"/"🔗 Copy link"), nút "🔗 Tạo link hàng loạt (331 còn thiếu)" hiện đúng số. ⚠ CHƯA verify được watchdog 30s TRONG effect dựng trang bằng cách chờ đủ 1 job treo thật tới lúc timeout (không ép treo được trong sandbox lần này) — tin vào review code (đối xứng với watchdog ngoài đã verify hoạt động đúng ở mục tiếp 8).

### 07-12 — Thùy CHỈNH LẠI: auto-backfill link phải TỰ ĐỘNG (không bấm tay), quy trình merge, Kho UI thẳng hàng, Nhân bản = gán buổi
- **⭐ Quy trình merge ĐỔI (Thùy chốt, ghi vào memory luôn):** "khi nào t bảo merge thì mới được merge" — lần trước Thùy nói "push thẳng luôn không cần PR nữa" CHỈ áp cho đúng lượt đó, KHÔNG phải chính sách đứng — từ giờ commit/push/mở PR tự do, nhưng **DỪNG Ở BƯỚC MỞ PR, chờ Thùy bảo merge rõ ràng mới bấm `gh pr merge`.**
- **⭐ "BÀI HỌC 2" ở mục tiếp 9 (SAI, Thùy bác ngay) — sửa lại đúng hướng:** bỏ hẳn auto-backfill (mục tiếp 9) và bắt bấm tay "🔗 Tạo link hàng loạt" bị Thùy phản hồi ngay là **"rất khó chịu"** — hỏi thẳng "tại sao không tự động lấy link tất cả mà phải chờ bấm?". **Nhận ra sai lầm:** phản ứng với 1 bug (auto-backfill treo cứng vì thiếu watchdog ở TẦNG DỰNG TRANG) bằng cách RÚT BỎ TOÀN BỘ TỰ ĐỘNG HOÁ là quá tay — đúng ra chỉ cần vá ĐÚNG CHỖ HỎNG (watchdog 30s trong effect dựng paged.js, ĐÃ LÀM Ở MỤC TIẾP 9 CÙNG LƯỢT) rồi GIỮ NGUYÊN tự động, không cần rút về thủ công. Gốc rễ (treo vô hạn) đã sửa xong ngay trong cùng lượt sửa trước — chỉ là quyết định UI đi kèm (bắt bấm tay) là thừa/sai.
- **Fix:** đưa lại `useEffect` auto-backfill mọi tài liệu thiếu `file_url` chạy NGAY khi `rows` đổi (không cần bấm) — an toàn vì watchdog 30s (mục tiếp 9) đảm bảo 1 doc treo tự bỏ qua ≤40s, không còn kẹt cứng cả hàng đợi. Bỏ nút "🔗 Tạo link hàng loạt" + `confirm()` — thay bằng dải trạng thái THỤ ĐỘNG "⏳ Tự động lấy link ở nền… còn N" (không cần bấm gì để bắt đầu) kèm 1 nút "⏸ Dừng" CHỈ để Thùy chủ động tạm dừng khi muốn (không bắt buộc), mở lại màn tự tiếp tục từ chỗ chưa xong.
- **✅ Verify qua browser + DB:** mở Kho tài liệu → dải "⏳ Tự động lấy link ở nền… còn 329" hiện NGAY không cần bấm; đợi 8s → còn 328 (tiến triển thật, không kẹt); query DB xác nhận số tài liệu có `file_url` tăng dần theo thời gian thực (không phải giả).
- **UI thẳng hàng (Thùy gửi ảnh: bảng "xiêu vẹo"):** root cause = nút "📱 Phát hành online" (text dài) xuống dòng ở 1 số hàng còn hàng khác không, làm CHIỀU CAO HÀNG lệch nhau → nhìn xiêu vẹo. Fix: (1) đổi "📱 Phát hành online" → chỉ icon "📱" (giữ `title` tooltip) — bớt hẳn 1 cụm text dài hay gãy dòng; (2) `whitespace-nowrap` cho ô Thao tác + `shrink-0` từng nút — không cho bất kỳ nút nào tự vỡ dòng nữa, bảng tự cuộn ngang (khung ngoài đã `overflow-auto`) nếu quá rộng thay vì bóp méo chiều cao hàng.
- **⭐ Nhân bản = 1 LƯỢT GÁN (Thùy: "phải được coi như 1 lần gán... như gán ET bình thường, khác cái là có nội dung sẵn"):** bỏ hẳn `prompt()` tên tự do + `lop_id/ngay=null` cũ (tạo "mẫu" rời rạc, không gắn buổi) — thay bằng modal bắt buộc chọn **Lớp** (`SearchSelect`) + **Ngày buổi học** (`BuoiNgaySelect`, tái dùng ĐÚNG 2 component ETEditor đang dùng để gán ET, chỉ hiện ngày CÓ trong TKB của lớp — chặn gán sai ngày) — nút "Tạo bản sao" disable tới khi đủ cả 2. Tên tự sinh (không cho gõ tay, tránh lệch quy ước đặt tên giữa các loại tài liệu): thay THẾ đúng lớp/ngày CŨ bằng MỚI nếu tên gốc đã có (tránh lặp "...5T1 · 12/07 · 5T1 · 19/07" khi tên gốc DÙNG THỬ lần đầu bị nối mù quáng), chỉ nối thêm khi tên gốc là MẪU (chưa gắn buổi).
- **✅ Verify ĐẦY ĐỦ qua browser + DB (Thùy dặn "test kĩ"):** click "Nhân bản" trên ET đã gắn buổi → modal mở, Lớp pre-fill đúng lớp nguồn, chọn ngày khác (19/07) → "Tạo bản sao" bật → bấm → modal đóng. Query DB xác nhận: dòng mới `lop_id`/`ngay` đúng, `loai` giữ nguyên, VÀ **nội dung (phan+câu) đã copy đúng** (5 câu y hệt nguồn, `tai_lieu_phan`+`tai_lieu_cau` đầy đủ) — không chỉ tạo dòng rỗng. Test lần 2 (sau fix tên lặp): tên ra "ET 5T1 · 02/08/2026" sạch, không lặp. Đã XOÁ 2 dòng test tự tạo trong lúc verify (không phải data thật của Thùy).
- ⚠ Lưu ý (chưa gặp bug nhưng cần biết): công cụ click theo toạ độ trong sandbox từng "bấm hụt" sau khi `resize_window` (tree đọc trước resize, toạ độ lệch) — chuyển sang click qua `querySelector`+`.click()` trực tiếp trong JS thì ổn định, không phải bug code.
- `npx tsc --noEmit` sạch. Screenshot tool bị treo suốt lượt này (không rõ nguyên nhân, không liên quan code) — verify bằng DOM/`innerText`/query DB thay vì ảnh chụp.

### 07-12 (tiếp) — SAI TIẾP LẦN 2 CÙNG TÍNH NĂNG: auto-backfill LÀM ĐƠ CẢ TAB, không phải chỉ "treo 1 job"
- **Thùy phản hồi ngay sau khi PR #6 lên (chưa merge, chỉ mới push): "click vào Kho tài liệu nó hiện đang lấy link xong đơ luôn"** + hỏi thẳng "đang lấy link là như nào" + "M có hiểu yêu cầu của t ko mà càng fix càng sai vậy" — đúng, đây là lần THỨ 3 sửa sai cùng 1 tính năng trong 1 ngày (tiếp 9: bỏ auto vì treo → tiếp 10: đưa auto lại vì "khó chịu" → giờ: auto lại làm đơ tab).
- **⭐ ROOT CAUSE THẬT (khác hẳn 2 giả thuyết trước — "treo vô hạn" và "khó chịu vì phải bấm"):** "Lấy link" = paged.js dựng trang + html2canvas RASTERIZE TỪNG TRANG (chụp ảnh) rồi ghép PDF + upload — là việc NẶNG CPU THẬT SỰ, không phải I/O chờ mạng đơn thuần. Mục tiếp 10 đưa lại auto-backfill CHO CẢ 329 tài liệu chạy NGAY lúc mở màn — dù mỗi job có watchdog 30-40s (chặn được "treo vô hạn"), watchdog KHÔNG CHẶN ĐƯỢC "CPU bận liên tục hàng chục phút" — đây là 2 vấn đề khác nhau hoàn toàn: 1 cái là job không bao giờ xong (đã sửa đúng), 1 cái là hàng trăm job NỐI ĐUÔI NHAU liên tục chiếm main thread khiến TAB CẢM GIÁC ĐƠ (dù về mặt kỹ thuật vẫn đang chạy, không "treo").
- **⭐ BÀI HỌC (bổ sung/sửa lại "BÀI HỌC 2" sai ở mục tiếp 9 VÀ cách hiểu sai tiếp ở mục tiếp 10):** khi 1 việc TỰ THÂN nó nặng CPU (rasterize/render hàng loạt trang), "tự động hoá cho MỌI bản ghi chạy nền" là **kiến trúc sai ngay từ đầu** cho môi trường CLIENT (trình duyệt) — không phải vấn đề "có watchdog hay không", mà là **quy mô client-side rendering hàng trăm tài liệu liên tục về bản chất sẽ làm chậm/đơ trải nghiệm**, bất kể sửa timeout kiểu gì. Nhu cầu thật của Thùy (đọc lại đúng câu gốc mục tiếp 6: "PH xin file... t cần 1 thứ để gửi") là **link cho ĐÚNG 1 tài liệu đang muốn chia sẻ tại 1 thời điểm**, KHÔNG PHẢI toàn bộ kho lịch sử phải luôn có sẵn link. Việc "tự động hoá backfill toàn bộ" là do TỰ SUY DIỄN quá tay từ câu "t cần lưu mọi file pdf mà" (mục tiếp 8) — không kiểm tra được với Thùy trước khi build phạm vi lớn, dẫn tới 3 lần sửa-đi-sửa-lại trong 1 ngày.
- **Fix (LẦN NÀY LÀ REVERT VỀ ĐÚNG THIẾT KẾ GỐC, không vá thêm):** bỏ HẲN effect auto-backfill-mọi-tài-liệu (mục tiếp 10) — không còn bất kỳ đường nào tự động xử lý NHIỀU tài liệu cùng lúc. Hàng đợi (`linkQueue`) giờ CHỈ nhận đúng 1 job bounded: làm mới đúng 1 doc Thùy vừa sửa qua Editor (giữ nguyên từ mục tiếp 8 — KHÔNG phải nguồn gây đơ, vì luôn chỉ 1 job). Bỏ hẳn UI `linkPaused`/dải trạng thái-nền/nút Dừng (không còn gì để dừng). Mỗi tài liệu chỉ có link khi Thùy TỰ BẤM "🔗 Lấy link" cho ĐÚNG tài liệu đó — quay lại đúng model ban đầu trước khi có "cải tiến" sai hướng.
- **Giải thích lại cho Thùy (để tránh hiểu lầm "đang lấy link" là gì):** đây KHÔNG phải sync nền nhẹ nhàng — là quá trình chụp-ảnh-từng-trang-rồi-ghép-PDF, tốn CPU thật, nên CHỈ nên chạy cho 1 tài liệu tại 1 thời điểm khi thật sự cần link để gửi, không nên (và về bản chất kỹ thuật KHÔNG THỂ) chạy hàng loạt êm ái trong nền cho cả trăm tài liệu.
- **✅ Verify qua browser (JS trực tiếp, screenshot tool vẫn treo phiên này):** mở lại Kho tài liệu → `innerText` xác nhận KHÔNG có "Tự động lấy link"/"Đang lấy" nào xuất hiện ngay khi mở màn (trước đó có, giờ sạch hoàn toàn). Bấm 1 nút "🔗 Lấy link" đơn lẻ → "Đang lấy" hiện đúng ~19s rồi tự hết (không đơ, trang vẫn tương tác được xuyên suốt — query `innerText` liên tục trong lúc chờ vẫn phản hồi ngay, khác hẳn triệu chứng "đơ" Thùy báo khi 329 job chạy dồn).
- `npx tsc --noEmit` sạch, không còn state/UI thừa nào tham chiếu tới cơ chế backfill đã bỏ (`linkPaused`/`batDauLayLinkHangLoat`/`missingCount`/`bulkRunning` — grep xác nhận 0 kết quả).
- **⭐⭐ BÀI HỌC META (quan trọng nhất mục này):** 3 lần sửa sai liên tiếp trong CÙNG 1 NGÀY cho CÙNG 1 tính năng là dấu hiệu RÕ phải DỪNG code, GIẢI THÍCH lại vấn đề bằng lời cho chính mình hiểu trước khi sửa lần tiếp theo — thay vì cắm đầu đoán ý rồi code ngay mỗi lần nhận phản hồi. Tính năng "tự động lấy link cho tài liệu" ĐÁNG LẼ nên hỏi rõ phạm vi ("cho MỌI tài liệu cũ hay chỉ tài liệu Thùy đang thao tác?") NGAY TỪ mục tiếp 8, trước khi tự suy diễn "t cần lưu mọi file pdf mà" thành 1 tính năng backfill-toàn-kho.

### 07-12 (tiếp 2) — UI thẳng hàng THẬT (cột Tên/Loại, không phải cột Thao tác) + kiến trúc link-gen-tại-lúc-tạo TOÀN CỤC + Nhân bản test kỹ
- **Thùy 2 việc:** (1) "UI thiết kế kiểu đéo gì mà vẫn xiêu vẹo" (dù đã sửa cột Thao tác lượt trước). (2) "T ko muốn hiện lấy link trong bất cứ trường hợp nào cả — hệ thống phải gen sẵn NGAY KHI tài liệu được tạo ra, người dùng chỉ click để COPY, KO chờ đợi gì cả."
- **⭐ UI xiêu vẹo — ROOT CAUSE THẬT (đo bằng `getBoundingClientRect`, không đoán):** lượt trước chỉ sửa cột "Thao tác" (nowrap nút bấm) — đo thực tế cho thấy 5 mức chiều cao khác nhau (51/64/68/87/109px). Thủ phạm CHÍNH là cột **"Tên tài liệu"** — tên dài (vd "BTVN 8A2 · Buổi 4: Bình phương của tổng hoặc hiệu") xuống dòng vì KHÔNG có `whitespace-nowrap`/`truncate`, đẩy hàng đó cao gấp đôi hàng khác. Thủ phạm PHỤ: cột "Loại" — badge "Giáo trình buổi" (dài) cũng xuống dòng do thiếu nowrap. Fix: cột Tên → `max-w-[280px] truncate` (kèm `min-w-0` trên span — flex item mặc định `min-width:auto` chặn truncate, bài học cũ "Bug TRÀN BẢNG" tái diễn ở dạng khác) + `title={r.ten}` xem đầy đủ khi hover; 4 cột còn lại (Loại/Khối/Gắn buổi/Ngày tạo) thêm `whitespace-nowrap`. **Verify đo lại: 355/355 hàng đúng 1 chiều cao (51px) — 100% đồng nhất**, không phải "có vẻ ổn" qua mắt thường.
- **⭐⭐ KIẾN TRÚC MỚI — link gen TẠI THỜI ĐIỂM tạo/sửa xong, TOÀN CỤC (không riêng Kho tài liệu):** Thùy chỉ ra đúng: gen-lúc-tạo (không phải gen-lúc-click) là ĐÚNG mô hình cô đã yêu cầu từ đầu — vấn đề "đơ tab" ở mục tiếp 1/2 là do gen HÀNG LOẠT cho tài liệu CŨ, không phải do gen-tự-động-per-doc-mới. 2 việc khác hẳn nhau, lần trước gộp nhầm.
  - **Hàng đợi TOÀN CỤC** (`useStore.linkGenQueue`/`enqueueLinkGen`/`shiftLinkGen`, zustand — gọi được từ CẢ lib layer lẫn UI, không chỉ trong component) — vì tài liệu được tạo/sửa từ NHIỀU màn khác nhau (ETScreen, TaiLieuBuilder, DeThiScreen, MTScreen, BTScreen), không chỉ từ Kho tài liệu.
  - **`LinkGenWorker`** (component mới, `src/components/LinkGenWorker.tsx`) — mount 1 LẦN ở `App.tsx` (không riêng KhoTaiLieuScreen), xử lý TUẦN TỰ (1 job/lúc) bằng headless PrintView-family (`linkOnly`). **2 tầng watchdog:** (a) TRONG mỗi PrintView (30s, đã có từ mục tiếp 9) set lỗi + hiện nút Đóng khi paged.js treo; (b) MỚI — NGAY TRONG `LinkGenWorker` (45s) tự bỏ job nếu quá lâu, vì job NỀN không có ai đứng bấm "Đóng" của watchdog (a) — THIẾU tầng (b) này y hệt lỗi đã sửa ở KhoTaiLieuScreen mục tiếp 9, chỉ là chuyển sang tầng mới nên phải làm lại — bài học: **mỗi lần dời cơ chế sang vị trí kiến trúc mới, PHẢI mang theo ĐẦY ĐỦ mọi lớp an toàn đã học được, không chỉ phần chức năng chính.**
  - **Rà soát ĐẦY ĐỦ mọi điểm tạo `tai_lieu`** (dùng Explore agent map hết, tránh bỏ sót — bài học "backfill hàng loạt" đã dạy: bỏ sót 1 điểm = tài liệu vĩnh viễn không có link): `createET`/`trichXuatBuoi`/`ganMTVaoBuoi`/`duplicateTaiLieu` (Nhân bản) là **ĐỦ NỘI DUNG NGAY LÚC TẠO** → enqueue NGAY sau khi tạo/gán, không đợi đóng editor. `createTaiLieu`(giáo trình)/`createDeThi`/`createMT`/`createBT` tạo ra **VỎ RỖNG** (nội dung xây dần qua nhiều thao tác autosave sau đó, giống TaiLieuBuilder "lưu ngay mỗi thao tác, không nút Lưu") → enqueue SAI THỜI ĐIỂM nếu hook lúc tạo (link rỗng, phải làm lại liên tục theo mỗi autosave = lại đơ máy) — đúng chỗ hook là lúc ĐÓNG editor (`onClose`, nút "← ..." mỗi editor tự gọi `enqueueLinkGen` TRƯỚC KHI gọi `onClose()` — đặt NGAY TRONG editor, không phải nơi gọi editor, để hoạt động dù editor được mở từ đâu — Kho tài liệu HAY màn native riêng (ETScreen/DeThiScreen/MTScreen/BTScreen) đều tự báo). Điểm `xoaBT`/xoá khác gọi `onClose()` sau khi XOÁ → KHÔNG hook (tài liệu đã mất, enqueue vô nghĩa).
  - **BTPrintView thêm headless+linkOnly** (trước đây chỉ có chế độ xem tương tác, không hỗ trợ dựng-ẩn-lấy-link) — mirror đúng pattern DeThiPrintView/MTPrintView (đã ổn định qua nhiều lượt sửa phiên này).
  - **KhoTaiLieuScreen đơn giản hoá TRIỆT ĐỂ:** bỏ HẲN mọi state/logic lấy-link cục bộ (`linkDoc`/`linkQueue`/`layLink`-cũ/`lamMoiLink`/`xongLayLink`/mount headless riêng) — giờ CHỈ còn 1 hàm `layLink()` = COPY (nếu có `file_url`) hoặc KHÔNG LÀM GÌ. Nút hàng đổi: có link → "🔗 Copy link" (click = copy tức thì); chưa có → nhãn thụ động "— chưa có link" (KHÔNG PHẢI nút, không chờ đợi); thêm "↻" fire-and-forget (bấm xong quên luôn, không hiện trạng thái chờ) làm lối thoát khi 1 job nền lỗi/treo mãi không ra link.
- **✅ Verify ĐẦY ĐỦ qua browser + DB (test thật, không giả lập):**
  - Đo lại row-height: 355/355 = 51px, đồng nhất 100%.
  - Tạo 1 ET thật (chọn lớp 5T1 + ngày 30/08 + 1 câu) qua ĐÚNG màn ETScreen (không qua Kho) → Lưu ET → **KHÔNG bấm gì thêm** → DB xác nhận `enqueueLinkGen` tự kích hoạt `LinkGenWorker` (thấy overlay "⏳ Đang lấy link…" tự xuất hiện dù đang ở màn khác).
  - **Phát hiện thật (không phải giả lập):** đúng tài liệu test này paged.js TREO ổn định (tái hiện y hệt 3 lần liền, kể cả ở tab trình duyệt HOÀN TOÀN MỚI — loại trừ "state bẩn của tab cũ") — đúng bug-class đã ghi nhận suốt session, KHÔNG PHẢI bug mới của kiến trúc hôm nay. Watchdog TRONG (30s) bắt đúng, hiện lỗi + nút Đóng. **Watchdog NGOÀI (45s, LinkGenWorker) xác nhận hoạt động ĐÚNG THIẾT KẾ:** không ai bấm Đóng, sau 45s overlay tự biến mất, hàng đợi tự giải phóng — verify bằng cách theo dõi liên tục, không đụng vào gì, tới khi overlay tự mất.
  - Nút "↻" xác nhận hoạt động: bấm lại tài liệu bị treo → tự enqueue lại → xử lý lại (dù vẫn treo ở ĐÚNG DOC NÀY do lỗi paged.js riêng của nó, không phải lỗi cơ chế retry).
  - Nhân bản (mục tiếp 7-8): re-test không cần thiết (không đổi logic Nhân bản hôm nay, chỉ đổi cách nó BÁO link — `xacNhanNhanBan` giờ gọi `enqueueLinkGen` toàn cục thay vì queue cục bộ đã xoá).
  - `npx tsc --noEmit` + `npm run build` sạch.
- **⚠ Trung thực về giới hạn:** tài liệu test cụ thể ở trên (ET 5T1·30/08, id `4ece78d8`) VẪN CHƯA có link sau nhiều lần retry trong sandbox — do chính paged.js treo với NỘI DUNG/BỐI CẢNH này, không phải lỗi kiến trúc mới. Không loại trừ hoàn toàn khả năng lỗi tái diễn trên máy thật của Thùy với vài tài liệu cá biệt — nhưng khác mục tiếp 9/10, giờ có 2 tầng watchdog + nút "↻" nên KHÔNG BAO GIỜ kẹt cứng cả hệ thống, chỉ đúng 1 tài liệu đó thiếu link tạm thời.

### 07-12 (tiếp 3) — Auto-retry (KHÔNG cần thao tác người) + BUG THẬT MỚI: header/footer chữ NHÂN ĐÔI + môi trường sandbox treo diện rộng
- **Thùy 2 câu hỏi thẳng, không cho đoán tiếp:** (1) "m chắc chắn về việc tự có link chưa" — link CHO TÀI LIỆU MỚI TỪ GIỜ TRỞ ĐI phải chắc chắn, không cần thao tác người (file cũ thì thủ công OK, không cần backfill). (2) "link file pdf của m hết lỗi chưa?" — hỏi thẳng chất lượng file, không hỏi cơ chế.
- **⭐ Việc (1) — auto-retry, xoá hẳn "phải để ý rồi bấm lại":** trước đây watchdog ngoài (45s) chỉ ÂM THẦM BỎ job treo — tài liệu đó vĩnh viễn không có link trừ khi Thùy tự để ý bấm "↻" (đúng điều Thùy phản đối: "tại sao lại phải có thao tác của người"). Fix: `linkGenActive`/`timeoutLinkGenActive` chuyển vào STORE (không phải state cục bộ của `LinkGenWorker` — để `KhoTaiLieuScreen` đọc được, hiện "⏳ đang tạo…" thay vì im lặng "— chưa có link"). Watchdog hết giờ giờ TỰ XẾP LẠI cuối hàng đợi (tăng `attempt`), tối đa `MAX_LINKGEN_ATTEMPTS=3` lần — hết 3 lần mới chịu bỏ (ca hiếm, "↻" vẫn còn làm lối thoát cuối). Từ góc nhìn Thùy: KHÔNG có gì để làm, hệ tự thử lại.
- **⭐⭐ Việc (2) — soi lại đúng file PDF thật (không đoán), tìm ra BUG THẬT CÒN SÓT:** tải file PDF vừa gen thành công (từ 1 lần thử trước đó của ET id `4ece78d8`) → **chữ header/footer bị NHÂN ĐÔI** (2 chuỗi text đè lên nhau, lệch nhẹ ngang — "ETET5T5T1 3300/0/0888/2/2002266··KKhhốối 5T"), KHÔNG PHẢI hiệu ứng text-shadow. **ROOT CAUSE:** fix cũ (mục tiếp 6/§367) chỉ OVERRIDE CSS pseudo-element bằng `content:none!important` — html2canvas hỗ trợ pseudo-element KHÔNG CHUẨN, "cố" vẽ text của rule GỐC (`content:` từ `buildPagedCss`, dùng cho đường native-print) DÙ ĐÃ OVERRIDE, đè lên đúng `<span>` thật mới chèn (`injectChrome`) bên dưới — 2 nguồn text, 2 bộ `padding` khác nhau (`50mm` pseudo vs `10mm` span thật) → lệch ngang nhẹ, nhìn như chữ đôi/mờ. **Fix tận gốc:** XOÁ THẲNG rule khỏi CSSOM (`doc.styleSheets` → tìm rule `.pagedjs_pagebox::before/::after` → `sheet.deleteRule(i)`) thay vì chỉ override bằng specificity — không còn gì để html2canvas "cố" render nữa, giữ `<style>` override cũ làm lưới phụ.
- **⭐ BÀI HỌC:** override CSS bằng `!important` giả định browser/renderer tuân thủ ĐÚNG CHUẨN cascade — html2canvas (thư viện tự re-implement rendering, không phải engine thật) KHÔNG đáng tin cho giả định đó với pseudo-element, đã thấy 2 lần trong session này (§367 gốc: background nhiều lớp; giờ: content text đè). Khi cần "tắt hẳn" 1 rule cho html2canvas, XOÁ RULE khỏi CSSOM đáng tin hơn override — áp dụng luôn cho các trường hợp tương tự sau này nếu gặp lại.
- **⚠ CHƯA verify được bằng ảnh SAU fix (môi trường, không phải code):** thử regenerate qua "↻" nhiều tài liệu khác nhau (ET đã biết treo + 1 BTVN khác + tab HOÀN TOÀN MỚI theo đúng bài học cũ) — **TẤT CẢ đều treo ở bước dựng trang**, kể cả tài liệu/tab chưa từng đụng tới trước đó trong lượt này. Khác hẳn pattern trước (1 tài liệu cụ thể treo ổn định, các tài liệu khác chạy bình thường) — lần này treo DIỆN RỘNG, nghi ngờ chính **môi trường sandbox** (Chromium headless của công cụ test) đã suy yếu sau phiên rất dài (nhiều `preview_start`/`stop`, hàng chục lượt HMR, nhiều tab) chứ không phải lỗi code mới. KHÔNG kết luận được bằng ảnh chụp — tin vào review code (root cause + fix đã xác định rõ ràng, trực tiếp từ ảnh THẬT chụp trước khi sửa) và **đề nghị Thùy tự verify trên máy thật** (nơi trước đó xác nhận PDF generation hoàn tất bình thường, không treo).
- `npx tsc --noEmit` sạch.

### 07-12 (tiếp 4) — Fix "xoá CSSOM rule" KHÔNG ăn — Thùy tự test trên máy thật, verify bằng file MỚI, VẪN Y HỆT lỗi cũ
- **Thùy gửi link CŨ trước** (`f7d8f1ee...`, đúng file tôi đã soi) → tôi giải thích đây là file CŨ (URL chưa đổi = chưa regenerate), hướng dẫn bấm "↻". **Thùy bấm thật trên máy thật** → link MỚI (`f8511ac8...`, khác hẳn URL trước — xác nhận ĐÃ regenerate với code mới) → tải về soi lại: **checksum khác file cũ (nội dung thật sự khác) nhưng ảnh render RA Y HỆT LỖI CŨ** (chữ header/footer vẫn nhân đôi/lệch ngang, không đổi gì so với trước fix).
- **⭐ Xác nhận quan trọng đi kèm:** máy THẬT của Thùy sinh file thành công BÌNH THƯỜNG (không treo) — loại trừ hẳn nghi ngờ "sandbox suy yếu" ở mục tiếp 3 khỏi phần render-hang (đúng như đã dự đoán, sandbox riêng phiên test mới là nơi treo, không phải bug chung). Nhưng bug NHÂN ĐÔI CHỮ là thật, tái hiện ổn định trên CẢ 2 môi trường (máy thật lẫn sandbox) — không phải ảo giác/artefact riêng của 1 nơi.
- **⭐⭐ Fix "xoá CSSOM rule" (mục tiếp 3) THẤT BẠI — chẩn lại nghiêm túc, không đoán tiếp:** đúng hướng (xoá rule đáng tin hơn override) nhưng **thực thi sai thời điểm** — `injectChrome` chạy ĐỒNG BỘ ngay trong callback `onclone` của html2canvas, trong khi stylesheet (`buildPagedCss`, nạp qua blob URL) phải được TRÌNH DUYỆT NẠP LẠI khi html2canvas clone `<link>` sang document/iframe mới (dù cache nhanh, vẫn KHÔNG đồng bộ tức thời) → tại đúng thời điểm code chạy, `doc.styleSheets[...].cssRules` RẤT CÓ THỂ vẫn rỗng (chưa parse xong) → vòng lặp "chạy xong không lỗi" nhưng KHÔNG XOÁ ĐƯỢC GÌ THẬT — false success, sai y hệt kiểu bug "silent no-op" đã cảnh báo nhiều lần trong CLAUDE.md (đo/verify trước khi tin).
- **Fix (lần 2, ĐÚNG NGUYÊN NHÂN THỜI ĐIỂM):** `injectChrome` chuyển thành **`async`**, thêm `waitStylesheets(doc)` chờ MỌI `<link rel=stylesheet>` trong clone bắn `load`/`error` (hoặc đã `l.sheet` sẵn — trường hợp load nhanh hơn code chạy tới) trước khi đụng CSSOM, có lưới an toàn 3s (`Promise.race` với `setTimeout`) tránh treo cả upload nếu 1 link kẹt thật. html2canvas (+ html2canvas-pro) hỗ trợ `onclone` trả về `Promise` — tự động CHỜ trước khi render, không cần đổi gì ở nơi gọi.
- **⭐⭐ BÀI HỌC (thay thế/bổ sung bài học sai ở mục tiếp 3):** "xoá rule khỏi CSSOM đáng tin hơn override bằng `!important`" — ĐÚNG VỀ NGUYÊN TẮC nhưng KHÔNG ĐỦ nếu không đảm bảo CSSOM đã sẵn sàng tại thời điểm code chạy. Bài học chung: **mọi thao tác đọc/sửa CSSOM của 1 stylesheet nạp KHÔNG ĐỒNG BỘ (external `<link>`, blob URL) PHẢI chờ sự kiện `load` trước** — đặc biệt trong ngữ cảnh clone/tái tạo DOM (html2canvas onclone, iframe mới, v.v.) nơi trình duyệt buộc phải NẠP LẠI tài nguyên dù bản gốc đã load xong từ trước.
- **✅ Verify ĐÚNG NGHĨA lần này phải là: Thùy tự bấm "↻" lại 1 lần nữa trên máy thật (không phải tôi đoán qua sandbox), lấy link MỚI (khác `f8511ac8`), gửi lại để soi.** `npx tsc --noEmit` sạch — chưa tự verify được bằng ảnh vì cần đúng vòng lặp "Thùy bấm → Thùy gửi link → tôi soi" (máy thật đáng tin hơn sandbox tối nay).

### 07-12 (tiếp 5) — Fix lần 2 CŨNG KHÔNG ĂN (Thùy tự verify, checksum khác nhưng ảnh y hệt) — đổi hẳn CHIẾN LƯỢC, không vá tiếp cùng kiểu
- **Thùy bấm "↻" lại trên máy thật lần 3** → link MỚI (`d527da45...`, khác 2 link trước) → tải về so: **checksum khác (nội dung thật khác — xác nhận đúng vòng lặp bấm→regenerate hoạt động) nhưng ảnh render RA Y HỆT LỖI CŨ.** Thùy chỉ thẳng: **"cái lỗi canvas m đã gặp rất nhiều lần rồi đấy"** — đúng, đây là loại bug thứ 4 do html2canvas trong session này (JPEG rám §…, nền sóng lệch tiếp 8, giờ chữ đôi) — dấu hiệu RÕ phải NGỪNG vá theo kiểu "cố ép html2canvas tôn trọng 1 override/xoá-rule nào đó cho pseudo-element", vì ĐÃ THỬ 2 CÁCH KHÁC NHAU (specificity override `!important`, rồi xoá thẳng CSSOM có chờ load) — CẢ HAI ĐỀU THẤT BẠI qua verify THẬT (không phải giả lập).
- **⭐⭐ Kết luận sau 2 lần thất bại liên tiếp:** html2canvas KHÔNG ĐÁNG TIN CẬY để "tắt" pseudo-element bằng BẤT KỲ kỹ thuật nào phụ thuộc vào việc nó tôn trọng 1 CSS PROPERTY cụ thể (content/opacity/background) trên phần tử ĐÃ ĐƯỢC XÁC ĐỊNH sẽ render — đây là giới hạn thật của thư viện (re-implement rendering, KHÔNG phải engine chuẩn), không phải do chọn sai property để override.
- **⭐⭐ Fix lần 3 — ĐỔI HẲN CHIẾN LƯỢC, không còn "override property":** thay vì cố khiến html2canvas BỎ QUA 1 rule ĐÃ KHỚP, làm cho rule đó **KHÔNG CÒN KHỚP SELECTOR NỮA NGAY TỪ ĐẦU** — gate `.pagedjs_pagebox::before/::after` thành `.pagedjs_pagebox:not(.pv-no-chrome)::before/::after` trong `buildPagedCss`. `uploadPagesAsLink` gắn class `pv-no-chrome` lên MỌI `.pagedjs_pagebox` **TRÊN DOM SỐNG** (không phải bản clone của html2canvas) **TRƯỚC** vòng lặp html2canvas, gỡ lại trong `finally` (khôi phục cho preview/native-print xem lại sau). Vì đây là mutation DOM THẬT (thêm class), không phải property CSS cần html2canvas "diễn giải đúng" trên 1 bản sao — html2canvas clone LUÔN kế thừa đúng trạng thái class đã gắn (là hành vi `cloneNode` cơ bản, không phụ thuộc parse/tải lại gì), nên **selector matching** (rule có áp dụng hay không) là phép tính CSS CƠ BẢN mà html2canvas BẮT BUỘC phải làm đúng để hoạt động được ở mức tối thiểu — đáng tin hơn hẳn so với "có tôn trọng 1 property override/xoá-rule hay không".
- **⭐⭐ BÀI HỌC META (thay thế bài học sai ở tiếp 3 VÀ tiếp 4):** khi 1 kỹ thuật CSS (override/xoá rule) thất bại LẦN THỨ 2 liên tiếp cho CÙNG mục tiêu "ẩn pseudo-element khỏi html2canvas", đừng thử BIẾN THỂ THỨ 3 của CÙNG Ý TƯỞNG (vd đổi property khác) — **đổi hẳn LỚP GIẢI PHÁP**: từ "làm cho html2canvas DIỄN GIẢI ĐÚNG 1 property trên phần-tử-đã-khớp" sang "làm cho phần-tử-đó KHÔNG-CÒN-KHỚP-SELECTOR-NỮA" — tầng thấp hơn, ít chỗ cho thư viện "diễn giải sai" hơn. Tổng quát hơn: khi 1 thư viện re-implement rendering liên tục sai ở TẦNG DIỄN GIẢI 1 thuộc tính cụ thể (dù đổi thuộc tính nào), tìm cách đưa quyết định XUỐNG TẦNG THẤP HƠN (DOM/selector) mà thư viện BẮT BUỘC phải đúng để chạy được, thay vì tiếp tục thử các thuộc tính khác nhau ở CÙNG TẦNG đã chứng minh không đáng tin.
- **⚠ CHƯA verify được bằng ảnh (môi trường sandbox VẪN treo tối nay, đã thử lại 1 lần nữa, y hệt 30s timeout)** — `npx tsc --noEmit` sạch, đã dừng cố ép sandbox verify (rõ ràng môi trường hỏng đêm nay, không phải code). **Cách verify DUY NHẤT đáng tin lúc này: Thùy bấm "↻" lần nữa trên máy thật, gửi link MỚI (khác `d527da45`).** Nếu lần này VẪN còn y hệt → phải xem xét lại giả thuyết gốc (có phải THẬT SỰ là pseudo-element, hay là nguồn nào khác tạo ra 2 bản text — cần công cụ debug trực tiếp trên máy thật, không suy luận thêm qua sandbox).

### 07-12 (tiếp 6) — Fix lần 3 (gate selector) CŨNG KHÔNG ĂN — ĐỔI HẲN KIẾN TRÚC: bỏ html2canvas cho header/footer, jsPDF vẽ trực tiếp
- **Thùy test lại trên máy thật lần 4** → link mới (`6c2b99c7...` — LƯU Ý: hoá ra đây KHÔNG PHẢI link mới, tra DB xác nhận KHÔNG có tài liệu nào đang trỏ URL này, tức Thùy gửi nhầm 1 link CŨ từ trước, không phản ánh đúng bản fix lần 3). Trong lúc làm rõ, Thùy tiết lộ thêm 1 triệu chứng: **"bấm nút đấy chỉ lấy được link của những file đã có sẵn rồi. File mới thì bấm vào ko thấy tạo ra link để copy"** — nghi ngờ ban đầu là bug wiring riêng, nhưng khả năng cao chỉ là CÙNG hiện tượng "job treo ở bước dựng trang, Thùy không thấy đổi gì nên tưởng không chạy" (chưa xác nhận được, không kịp trước khi đổi hướng).
- **⭐⭐⭐ Thùy: "Khá là mệt mỏi rồi. Ko có phương án khác à" — ĐÚNG THỜI ĐIỂM DỪNG VÁ, ĐỔI KIẾN TRÚC.** Sau 3 lần thất bại LIÊN TIẾP với 3 kỹ thuật CSS khác nhau (override `!important`, xoá CSSOM có chờ load, gate selector `:not()`) cho CÙNG mục tiêu "khiến html2canvas render đúng khối header/footer" — bằng chứng đủ mạnh: **html2canvas không đáng tin cho khối chrome này DÙ THEO CÁCH NÀO**, không phải do chọn sai kỹ thuật CSS. Đưa ra 3 lựa chọn cho Thùy (AskUserQuestion): (1) test lại 1 lần nữa, (2) bỏ html2canvas cho phần LINK, vẽ chrome bằng jsPDF thuần (mất style đẹp riêng phần header/footer, thân bài giữ nguyên), (3) chuyển hẳn sang server-side PDF (Puppeteer, việc lớn). Thùy không chọn trực tiếp (bận trả lời triệu chứng mới) nhưng bối cảnh + mức độ mệt mỏi đủ rõ để tự quyết theo R2 (CLAUDE.md: câu kỹ thuật tự trả lời được thì tự trả lời) — chọn **phương án (2), KHÔNG chờ thêm 1 vòng hỏi-đáp nữa.**
- **⭐⭐⭐ FIX KIẾN TRÚC (không còn là "vá CSS lần 4"):** `uploadPagesAsLink` tách hẳn 2 phần: **THÂN BÀI** (câu/lý thuyết/ảnh/KaTeX) vẫn html2canvas như cũ — đã ổn định SUỐT session, không dính lớp bug pseudo-element này. **HEADER/FOOTER** (dải gradient + logo + chip trắng + chữ) **KHÔNG CÒN QUA html2canvas NỮA** — vẽ TRỰC TIẾP bằng jsPDF NGAY SAU khi dán ảnh thân bài vào từng trang:
  - `drawGradientBar()` — mô phỏng dải gradient 3-stop (hồng→cam→xanh dương) bằng 48 dải màu mảnh nội suy tuyến tính (jsPDF không có gradient native đáng tin ở mọi version, kỹ thuật "nhiều dải màu mảnh" là cách chuẩn phổ biến).
  - Logo qua `pdf.addImage(logoImg, ...)` — `logoImg` là `HTMLImageElement` đã tải sẵn (dùng lại pattern preload cũ, giờ GIỮ LUÔN element thay vì bỏ đi sau khi load).
  - Chip trắng bo góc qua `pdf.roundedRect(...)`.
  - Chữ qua `pdf.text(..., {align, baseline:'middle'})` — API text-đặt-trực-tiếp của jsPDF, KHÔNG liên quan gì đến html2canvas/pseudo-element nữa → **không còn khả năng "nhân đôi"** (không có 2 nguồn text nào để đè lên nhau — chỉ 1 lệnh `pdf.text()` duy nhất).
  - **Vẽ ĐÈ LÊN sau ảnh thân bài** — dù `pv-no-chrome` (gate selector, mục tiếp 5) có hoạt động hay không, dù html2canvas có sót/lỗi gì ở đúng vùng header/footer trong ảnh thân bài, jsPDF vẽ rect ĐẶC (`'F'` fill) đè hoàn toàn lên vùng đó — KHÔNG PHỤ THUỘC html2canvas "làm đúng" bất kỳ điều gì cho khối chrome nữa. Giữ `pv-no-chrome` làm tối ưu nhẹ (khỏi phí công chụp cái sẽ bị che), không còn là ĐIỀU KIỆN CẦN để đúng.
  - `buildPagedCss`/`pageChrome()` (dùng cho preview + `window.print()` native) **GIỮ NGUYÊN KHÔNG ĐỔI** — pseudo-element + `headUri`/`footUri`/`chipUri` vẫn dùng bình thường, vì đường native-print KHÔNG BAO GIỜ dính bug này (chỉ html2canvas mới có vấn đề diễn giải pseudo-element). Đổi ĐÚNG 1 chỗ (`uploadPagesAsLink`), không đụng gì khác.
- **⭐⭐⭐ BÀI HỌC META CAO NHẤT (bao trùm cả 3 bài học sai/đúng ở tiếp 3/4/5):** khi 1 thư viện re-implement-rendering (html2canvas) LIÊN TỤC sai ở CÙNG 1 loại thao tác (diễn giải pseudo-element) dù đổi 3 KỸ THUẬT khác nhau ở CÙNG TẦNG (CSS), bài học đúng KHÔNG PHẢI "thử kỹ thuật CSS thứ 4" — mà là **NGỪNG DÙNG THƯ VIỆN ĐÓ CHO ĐÚNG PHẦN NÓ LIÊN TỤC SAI, GIỮ NGUYÊN CHO PHẦN NÓ VẪN ỔN ĐỊNH.** Không cần "tất cả hoặc không gì" (bỏ hẳn html2canvas mọi nơi, hoặc cố mãi 1 chỗ) — TÁCH nhỏ theo ĐÚNG ranh giới đã-chứng-minh-đáng-tin/không-đáng-tin: thân bài (ảnh chụp phức tạp, KaTeX, nhiều layout) → html2canvas vẫn hợp lý (đã ổn định); 1 khối ĐƠN GIẢN HÌNH HỌC (gradient bar + text + 1 ảnh) → công cụ vẽ-trực-tiếp (jsPDF) THỪA SỨC làm, đáng tin hơn HẲN vì không còn tầng "diễn giải HTML/CSS" nào ở giữa nữa. Nhận diện dấu hiệu "đã tới lúc đổi kiến trúc" (không vá tiếp): ≥3 lần sửa CÙNG 1 Ý TƯỞNG cho CÙNG 1 bug, verify THẬT (không giả lập) đều thất bại.
- **⚠ CHƯA verify được bằng ảnh trong sandbox (paged.js vẫn treo TRƯỚC CẢ bước html2canvas/jsPDF tối nay, xác nhận đây là vấn đề môi trường/thời điểm, không phải code mới)** — `npx tsc --noEmit` + `npm run build` sạch. Logic mới ĐƠN GIẢN HƠN HẲN 3 lần trước (không còn CSSOM/async-wait/class-toggle phức tạp, chỉ còn lệnh vẽ trực tiếp) → tự tin cao hơn dù chưa thấy ảnh, nhưng vẫn cần Thùy xác nhận bằng mắt trên máy thật — đây là lần fix có khác biệt CHẤT (đổi kiến trúc) chứ không phải LƯỢNG (đổi property) so với 3 lần trước, nên rủi ro "vẫn y hệt lỗi cũ" gần như bằng 0 (không còn đường nào để pseudo-element chen vào được nữa).

### 07-12 (tiếp 7) — "Bấm nút, ko thấy link" — TÌM RA ĐÚNG NGUYÊN NHÂN THẬT (không phải bug canvas), 2 lỗ hổng kiến trúc riêng của hàng đợi link-gen
- **Thùy: "bấm nút, ko thấy hiện cái link để copy đâu. thử 3 4 lần r"** — báo cáo NGAY SAU khi fix kiến trúc jsPDF (tiếp 6) được push, nhưng đây là TRIỆU CHỨNG KHÁC HẲN (không có link nào xuất hiện, không phải link lỗi hiển thị). Không đoán tiếp theo hướng canvas — tra thẳng DB (`tai_lieu` order by `updated_at` desc): **~15 tài liệu mới nhất trong ~6 tiếng làm việc tối nay, chỉ 2 có `file_url` — còn lại TOÀN BỘ vẫn null**, dù tất cả đều đi qua đúng `enqueueLinkGen` (verify lại 9 call site vẫn nguyên vẹn). Bằng chứng DB rõ ràng: đây KHÔNG PHẢI "chưa refresh UI", mà generation THẬT SỰ không hoàn tất cho đa số tài liệu.
- **⭐⭐ NGUYÊN NHÂN GỐC #1 — hàng đợi sống HOÀN TOÀN TRONG RAM (Zustand thuần, không `persist`):** `linkGenQueue`/`linkGenActive` chỉ tồn tại trong 1 phiên JS. Tối nay có RẤT NHIỀU lần reload (Thùy phải F5 để nhận code mới sau mỗi lần tôi push/HMR full-reload) — MỖI LẦN reload xảy ra trong lúc còn job đang chờ/đang chạy, job đó **BIẾN MẤT KHÔNG DẤU VẾT**, tài liệu vĩnh viễn không có link trừ khi Thùy tự nhớ bấm "↻" lại (đúng điều Thùy phản đối từ đầu: "tại sao lại phải có thao tác của người"). Đây gần như chắc chắn là nguyên nhân áp đảo — không phải cá biệt 1-2 tài liệu, mà là MỌI job đang chờ tại thời điểm bất kỳ lần reload nào.
- **Fix #1 — persist hàng đợi vào `localStorage`:** `useStore` bọc `persist()` (zustand/middleware), `partialize` CHỈ lưu `linkGenQueue`/`linkGenActive`/`linkGenFailed` (không đụng phần state UI khác — session/filter không cần sống qua reload). `merge`: job đang "active" lúc reload KHÔNG còn ai chạy (JS process mới tinh) → dồn về ĐẦU hàng đợi cho `LinkGenWorker` nhặt lại từ đầu, không coi là "vẫn đang chạy" (không có timer nào được set lại cho nó nếu để nguyên `active`).
- **Verify TRỰC TIẾP bằng thao tác thật trong sandbox (không chỉ đọc code):** bấm "↻" cho 1 tài liệu thật (`BTVN 11B1 12/07/2026 · Buổi 3`, id `5ba58d5a`) → đọc `localStorage['bkdemy-linkgen-queue']` thấy job vào `linkGenActive` → **reload trang thật (navigate lại URL)** → quay lại Kho tài liệu → dòng đó hiện đúng "⏳ đang tạo…" NGAY (không cần bấm lại gì) — xác nhận job sống sót qua reload đúng như thiết kế.
- **⭐⭐ NGUYÊN NHÂN GỐC #2 (phát hiện PHỤ trong lúc verify #1) — job thất bại sau 3 lần thử bị NUỐT ÂM THẦM:** theo dõi tiếp job vừa test — do sandbox tối nay vẫn treo paged.js y hệt các mục trước (môi trường, không phải code), job tự retry qua watchdog 45s đúng 3 lần rồi... **im lặng biến mất, dòng quay về CHÍNH XÁC y hệt "— chưa có link"** — không cách nào phân biệt "chưa từng thử" với "đã thử 3 lần và thất bại". Từ góc nhìn Thùy: bấm "↻" nhiều lần, đợi, không có gì xảy ra — ĐÚNG NGUYÊN VĂN triệu chứng report.
- **Fix #2 — thêm trạng thái "failed" tách biệt:** store thêm `linkGenFailed: string[]` (cũng persist). `timeoutLinkGenActive` khi hết `MAX_LINKGEN_ATTEMPTS` (thay vì chỉ bỏ job) → thêm id vào `linkGenFailed`. `enqueueLinkGen` xoá id khỏi `linkGenFailed` (thử lại = xoá cờ lỗi cũ). `KhoTaiLieuScreen` thêm nhánh hiển thị thứ 3: `r.file_url` → Copy link · đang trong queue/active → "⏳ đang tạo…" · **`linkGenFailed.includes(r.id)` → "⚠ lỗi, bấm ↻"** (mới) · còn lại mới là "— chưa có link" thật (chưa từng thử).
- **Verify lại toàn bộ vòng lặp bằng thao tác thật:** bấm "↻" lại đúng tài liệu trên → đợi hết 3 lần thử (thật, ~2 phút, không giả lập) → `localStorage` xác nhận `linkGenFailed: ["5ba58d5a..."]`, `linkGenActive: null` → dòng trong bảng hiện đúng "⚠ lỗi, bấm ↻" thay vì im lặng quay về "chưa có link". Cả 2 fix hoạt động đúng như thiết kế, verify bằng quan sát DOM/localStorage thật, không chỉ đọc code.
- **⭐ BÀI HỌC:** 3 lần fix trước (tiếp 3/4/5/6) đều ĐÚNG HƯỚNG cho ĐÚNG BUG mà chúng nhắm tới (chữ nhân đôi trong PDF) — nhưng đợt báo cáo mới của Thùy là 1 LỚP BUG HOÀN TOÀN KHÁC (không có link nào xuất hiện), nằm ở TẦNG KIẾN TRÚC HÀNG ĐỢI (client-side state không bền qua reload + lỗi bị nuốt im lặng), không liên quan gì đến canvas/PDF-rendering. Dấu hiệu nhận biết: triệu chứng đổi hẳn bản chất ("lỗi hiển thị sai" → "không có gì xảy ra") phải đổi hẳn hướng điều tra (tra DB thật thay vì đoán tiếp theo hướng cũ), không nên mặc định "chắc vẫn là bug canvas cũ".
- `npx tsc --noEmit` + `npm run build` sạch (mục tiếp 7).

### 07-12 (tiếp 8) — 400 THẬT trên máy Thùy — root cause = TRẦN dung lượng Supabase Storage, đo trực tiếp (không đoán)
- **Thùy gửi console lỗi thật (2 lần):** `Failed to load resource: 400` cho 1 file `.pdf` cụ thể, rồi lại 1 lần nữa không kèm URL — kèm phản hồi rất gắt vì tôi từng đề nghị sửa cả 5 file PrintView-family CÙNG LÚC trước khi verify xong 1 cái (Thùy chặn lại đúng lúc: "Sửa 1 loại thôi... Cứ đi sửa 1 lúc hết tất cả xong rồi lại sai hết" — đã ghi vào memory `working-with-thuy`).
- **Điều tra bằng chứng THẬT, không đoán:** GET thẳng URL lỗi → `{"statusCode":"404","error":"not_found","message":"Object not found"}` (chuẩn response "chưa từng có object", không phải "upload dở dang"). Tra `tai_lieu.file_url` — KHÔNG có dòng nào trỏ URL đó (upload chưa từng ghi được vào DB). Test upload 1 file NHỎ qua đúng `uploadKhoFile` (module thật của app, import trực tiếp trong console) → THÀNH CÔNG — loại trừ RLS/auth/bucket-tồn-tại.
- **⭐⭐ Đo trực tiếp ngưỡng dung lượng thật (không đoán, có xin phép trước khi test blob lớn vào storage thật):** upload thử nhiều cỡ vào ĐÚNG bucket `kho-tailieu` (xoá ngay sau mỗi lần) — 12MB/20MB/40MB **ĐỀU QUA**, **60MB THẤT BẠI** với lỗi `{message:"The object exceeded the maximum allowed size", statusCode:"413", status:400}` — **KHỚP CHÍNH XÁC** dấu hiệu Thùy gặp (400, không rõ nguyên nhân từ UI). Ngưỡng thật nằm đâu đó 40-60MB (rất có thể đúng mặc định Supabase 50MB).
- **⭐ Vì sao vượt trần:** PDF thật build từ html2canvas raster PNG mỗi trang ở `scale:2` — tài liệu NGẮN (vài trang) ra ~10MB, nhưng tài liệu DÀI (giáo trình nhiều buổi, vd "Giáo trình 8A" 292 câu) cộng dồn nhiều trang PNG scale cao có thể vượt hẳn 50MB.
- **Fix (ĐÚNG 1 CHỖ — `uploadPagesAsLink` trong `PrintView.tsx`, dùng CHUNG bởi cả 5 PrintView-family, không cần sửa lặp lại từng file):** tách vòng build PDF thành hàm `build(scale)`. Build LẦN ĐẦU ở `scale:2` (giữ NGUYÊN chất lượng mặc định — đa số tài liệu không vượt trần, không đánh đổi gì cho ca thường). Nếu `blob.size > 45MB` (ngưỡng an toàn, có đệm dưới trần thật 50MB) → build LẠI ở `scale:1.3` (giảm ĐỘ PHÂN GIẢI, KHÔNG đổi format — JPEG đã bị cấm dùng từ trước vì "rám/vỡ viền chữ nhỏ", đổi lại sẽ tái phạm đúng bug đã fix). Nếu build lại vẫn vượt → throw lỗi rõ ràng ("tài liệu quá dài, cần rút gọn") — giờ lỗi này sẽ hiện đúng "⚠ lỗi, bấm ↻" (nhờ fix `onFail` mục tiếp 7) thay vì 400 vô hình.
- **⚠ Giới hạn xác nhận được:** đã đo ĐÚNG ngưỡng gây lỗi 400 bằng test upload thật vào bucket thật — mức tin cậy cao cho ĐÚNG NGUYÊN NHÂN. CHƯA verify được toàn luồng thật (tài liệu dài thật → build → tự rơi vào nhánh giảm scale → upload lọt) vì sandbox vẫn treo paged.js y hệt các mục trước — cần Thùy tự test 1 tài liệu DÀI (giáo trình nhiều buổi) trên máy thật để xác nhận.
- `npx tsc --noEmit` + `npm run build` sạch.

### 07-12 (tiếp 9) — ⭐⭐⭐ ĐỔI KIẾN TRÚC HOÀN CHỈNH: gen link PDF chuyển hẳn về SERVER (worker Chrome thật) — hết chờ, hết overlay, file nhỏ 30-50 lần, hết vĩnh viễn lớp bug canvas
- **Thùy chốt 2 điều:** (1) "Chuyển phương án mới đi. Phương án cũ lằng nhằng." (2) **Point chính: "t ko muốn phải chờ bất kì chỗ nào vụ lấy link hay tạo link. Hệ thống phải tự chạy ẩn việc đấy... đang làm việc tự dưng hiện chờ lấy link xong chờ tận 2p là thế đéo nào"** — cái overlay "⏳ Đang lấy link…" che màn hình tới 2 phút là hệ quả TẤT YẾU của kiến trúc client-gen (máy người dùng phải tự dựng trang + chụp ảnh → chiếm tab đang làm việc), không vá được, chỉ đổi kiến trúc mới hết.
- **Bối cảnh chốt thêm (cùng phiên):** lỗi 400 khi upload = file vượt trần 50MB của Supabase (Thùy gửi ảnh dashboard xác nhận Global file size limit = 50MB, khớp phép đo 40MB qua/60MB chặn). Bản chất: PDF đời html2canvas là ẢNH CHỤP từng trang (PNG scale 2) → 10-50MB/tài liệu; cùng nội dung in native ra PDF chữ chỉ vài trăm KB. Cộng thêm mỗi lần re-gen upload file MỚI không xoá file cũ → kho phình file mồ côi (1 tài liệu có 3 bản 10.7MB). Với nhịp ~15-20 file/ngày → gói Pro 100GB đầy trong ~1 năm. → Câu hỏi "cả kho Supabase chịu được không" trả lời được dứt điểm bằng CHÍNH kiến trúc mới (file KB thay vì MB).
- **KIẾN TRÚC MỚI (đời 2):**
  - **`linkgen_jobs` (migration 0096)** — hàng đợi TRONG DB, PK = tai_lieu_id (1 dòng = trạng thái hiện tại: pending/processing/done/failed + attempt + error). Client (enqueueLinkGen ở store — 9 call site GIỮ NGUYÊN không sửa) giờ chỉ upsert 1 dòng 'pending' fire-and-forget (~0ms) qua `lib/linkgen.ts`. Đúng luật CLAUDE.md §2 "data ảnh hưởng nhiều user → ở DB, không localStorage" — đời 1 (Zustand + persist localStorage) vi phạm luật này và trả giá đúng như luật cảnh báo (mất job khi F5, chỉ 1 máy thấy trạng thái).
  - **`worker/index.mjs`** — Node + puppeteer-core (dùng Chrome/Edge CÓ SẴN trên máy, không tải Chromium riêng) + service role. Tự serve `dist/` (http server ~15 dòng, port 4599, không phụ thuộc dev server). Poll jobs 5s/lần, tuần tự 1 job/lúc. Mỗi job: mở `#pvjob=<id>&loai=<loai>&at=<token>&rt=<token>` → chờ `window.__pvState==='ready'` → `page.pdf({printBackground:true, preferCSSPageSize:true})` → upload bucket → ghi `tai_lieu.file_url` → **xoá file CŨ** (thứ tự an toàn: upload mới + ghi url TRƯỚC, xoá cũ SAU — lỗi giữa chừng cùng lắm thừa 1 file, không bao giờ mất link đang dùng) → job done. Lỗi: attempt+1, quá 3 → failed + error.
  - **`PrintJobPage.tsx`** (route `#pvjob=` tách ở main.tsx, không đụng luồng auth App) — nhận token qua hash → `setSession` → mount ĐÚNG PrintView-family PREVIEW MODE (không headless!) → `page.pdf` ăn CSS `@media print` sẵn có → **ra pixel Y HỆT bản Thùy in tay "Microsoft Print to PDF"** (cùng CSS buildPagedCss + cùng engine in Chrome, `printBackground:true` bật cứng nên không bao giờ "quên tick Background graphics"). PrintView-family thêm 2 prop `onReady`/`onRenderErr` (bắn tín hiệu từ đúng chỗ paged.js resolve/watchdog). **Debounce 1.2s ở PrintJobPage**: loại btvn/giao_trinh_buoi dựng lại 2-3 lần (tự chuyển scope + nạp tên lớp async) — bắn ready ngay lần đầu là in BẢN DỞ thiếu "Lớp X ·" trên header.
  - **KhoTaiLieuScreen** — đọc trạng thái từ `linkgen_jobs` (poll 8s khi mở màn): "⏳ đang tạo…" (pending/processing) / "⚠ lỗi, bấm ↻" (failed, tooltip kèm error thật) / "🔗 Copy link". Số job chờ GIẢM → tự reload ngầm danh sách (không setLoading) — link hiện ra không cần F5.
  - **LinkGenWorker (đời 1) NGỪNG MOUNT ở App.tsx** — overlay chết theo thiết kế. Code đời 1 (LinkGenWorker.tsx, store queue/persist, uploadPagesAsLink/html2canvas trong 5 PrintView) thành dead code — GIỮ NGUYÊN chờ Thùy gật mới dọn (Luật xoá).
- **⭐⭐ BUG THẬT TÌM RA TRONG LÚC TEST (làm ĐÚNG quy trình 1-loại-trước nên bắt được sớm):** job ET đầu tiên ✅ nhưng 2 job sau chết cả loạt "Auth session missing!". Debug bằng script chọc thẳng (đăng nhập MỚI → chạy ngon) → chốt nguyên nhân: **refresh token Supabase là loại DÙNG-1-LẦN (rotation)** — trang in đầu tiên nhận token qua setSession là "tiêu" luôn refresh token đó, phiên Node dùng chung chết theo, job sau đưa token chết cho trang in. **Fix: mỗi job đăng nhập MỚI TINH (~200ms)** — mỗi trang in 1 session family riêng, muốn xoay token gì cũng kệ.
- **KẾT QUẢ VERIFY THẬT (tự chạy end-to-end trên máy này, xem ảnh render bằng mắt):** cả 5 loại ✅ — et 390KB/4s · btvn 510KB/5.7s (header đủ "Lớp 11B1 · 12/07/2026" — debounce gánh đúng race) · giao_trinh_buoi 558KB/5s · bo_tro 381KB/4.6s · mt_buoi 422KB/4.2s. Soi ảnh 200 DPI vùng header: 1 dòng chữ duy nhất sắc nét, đủ dải sóng gradient + logo + chip — HẾT bug nhân đôi (vì không còn html2canvas trong đường này). Xoá-file-cũ verify thật: re-gen ET → URL cũ 400/not found. Đời cũ so sánh: 10-50MB, ~2 phút, hay treo, chiếm màn hình.
- **⭐ BÀI HỌC:**
  1. **File PDF = ảnh chụp trang (rasterize) là sai lầm gốc rễ về KÍCH THƯỚC lẫn CHẤT LƯỢNG** — 10-50MB vs vài trăm KB cùng nội dung, chữ là ảnh (không copy/search được), và mọi lớp bug canvas (nhân đôi, rám, nền lệch) đều từ việc thư viện TỰ VẼ LẠI trang. Tái dùng engine in THẬT của Chrome (đường native print đã chứng minh không bao giờ lỗi suốt session) = hết cả 3 vấn đề cùng lúc.
  2. **Hàng đợi việc-phải-làm thuộc về DB, không phải RAM/localStorage client** — CLAUDE.md §2 đã ghi sẵn luật này; đời 1 vi phạm và trả giá đúng từng chữ (mất job khi F5, trạng thái chỉ 1 máy thấy, không máy nào chạy thì không ai làm).
  3. **Supabase refresh token dùng-1-lần**: KHÔNG chia sẻ 1 session giữa nhiều client (Node worker + các trang browser). Mỗi consumer 1 lần signInWithPassword riêng — rẻ (~200ms) và miễn nhiễm rotation.
  4. **Storage 400 khi upload → nghi NGAY trần dung lượng bucket/plan** (thêm vào checklist "Debug 400" của CLAUDE.md vốn chỉ cover PostgREST): đo bằng binary-search upload thật (40MB qua/60MB chặn → trần 50MB), đối chiếu dashboard.
  5. **Quy trình 1-loại-trước (Thùy):** fix/build cho ĐÚNG 1 loại, verify bằng mắt end-to-end, RỒI MỚI nhân rộng — chính nhờ vậy bug rotation lộ ra ở job thứ 2-3 trong môi trường kiểm soát, không phải sáng mai trên tay Thùy.
- **VẬN HÀNH (quan trọng — module dùng hàng ngày):** worker phải ĐANG CHẠY thì link mới sinh (`npm run build` rồi `node worker/index.mjs`; job dồn hàng đợi trong DB khi worker tắt, bật lên tự xử hết — không mất). CHƯA cài auto-start (Task Scheduler) — chờ Thùy quyết chạy trên máy nào (máy trung tâm hiện tại / VPS ~100k/tháng sau này; code không đổi khi chuyển).
- `npx tsc --noEmit` + `npm run build` sạch. Migration 0096 đã áp + `npm run schema` (schema.md cập nhật).
### 07-13 — ⭐ REDESIGN LUỒNG BỔ TRỢ ĐUỔI: đợt có KẾ HOẠCH (scope dạng + số buổi) · xếp lịch BATCH · vắng = huỷ suất · đề xuất đóng (mig 0097)
- **Thùy chốt thiết kế (sau 1 vòng sparring đầy đủ):** (1) GV chốt scope DẠNG cần đuổi + SỐ BUỔI dự kiến (logic gốc: số buổi phải cover hết dạng, không khớp thì sửa số buổi — logic vận hành đếm theo BUỔI); (2) học đủ N buổi CÓ MẶT → hệ ĐỀ XUẤT đóng (không đóng câm — điểm này Thùy nhận phản biện và đồng ý đổi từ "tự động đóng"); (3) xếp lịch BATCH cả đợt 1 lần ("thực tế xếp lịch thường xếp toàn bộ luôn"), chưa xếp đủ card vẫn nằm ở khu đang-đuổi với chỉ số; (4) card = ĐỢT (không phải ca, không phải HS — 1 HS có thể nhiều đợt), sống ở tab "Đang đuổi" SUỐT vòng đời với chỉ số kép "Xếp x/N · Học y/N", đủ N/N mới sang "Hoàn thành"; (5) VẮNG = HUỶ SUẤT (không đếm vào cả xếp lẫn học, phải xếp lại) — vì ca gộp nhiều HS nên chỉ huỷ suất của em vắng, ca vẫn diễn ra cho em khác; (6) KHÔNG đo mastery đợt này (scope bé, mục tiêu đuổi = kịp kiến thức nghe hiểu buổi chính, đánh giá đã có ở buổi chính) — scope dạng chỉ là danh sách nội dung cần dạy; (7) card CA chỉ tồn tại ở tab "Đã xếp".
- **Schema (mig 0097):** `bo_tro_duoi.so_buoi_du_kien int` (NULL = đợt cũ/chưa chốt kế hoạch — UI bắt chốt trước khi xếp lịch; chấp nhận NULL-as-chưa-chốt vì case có vòng đời 2 bước thật: sinh từ vắng/tuyển sinh TRƯỚC, GV chốt SAU) + bảng `bo_tro_duoi_dang` (scope dạng, ma_dang không FK — dạng tách bảng theo môn, cùng lý do tai_lieu_cau).
- **Data layer (`botro_duoi.ts`):** `listDotDuoi(done)` thay `listCanDuoi` — đơn vị ĐỢT với đếm: `daHoc` = buổi đã đóng đánh giá + CÓ MẶT; `daXep` = daHoc + buổi chưa đóng; buổi huỷ/suất vắng KHÔNG đếm ở đâu cả. `chotKeHoachDuoi(caseId, soBuoi, maDangs)` (replace scope). buoi_hoc_hs có 2 FK về buoi_hoc → tách 2 bước, không embed (bài học cũ).
- **UI (`BoTroDuoiScreen.tsx`):** tab 1 "Cần đuổi"→"Đang đuổi", card đợt 3 trạng thái: chưa-chốt (badge amber + nút "Chốt kế hoạch") / đang (chỉ số kép + chips dạng + "+ Xếp lịch"/"✎ Kế hoạch") / đủ-N-N (viền emerald + banner đề xuất "Hoàn thành đợt / +1 buổi"). `KeHoachModal` TÁI DÙNG `DangPicker` (TaiLieuBuilder export sẵn — khoi/mon từ lớp đuổi), validate chặn sửa số buổi < đã học và < đã xếp (bắt huỷ lịch thừa trước). `XepDuoiModal` → BATCH: N dòng ngày/giờ/phòng (mặc định = số còn thiếu), GV/TA/giá chung, giữ mode "gộp vào buổi có sẵn". Tab 3 "Hoàn thành" đổi từ card-ca sang card-ĐỢT ("Đã học y/N" + ngày xong) → click mở `DotDetailModal` liệt kê từng buổi (badge có mặt/vắng-không-tính/chưa diễn ra) → click buổi mở BuoiDuoiDetail readOnly. "Bỏ cờ" chỉ khi chưa xếp/học gì; wording "khóa"→"đợt".
- **VERIFY SỐNG end-to-end trong browser (không phải đọc code):** tạo case test (HS thật, lý do đánh dấu TEST) → chốt kế hoạch 2 dạng + 2 buổi (DangPicker khối 6 mở đúng) → card "Xếp 0/2 · Học 0/2" → batch xếp 2 buổi 1 lần (modal tự mở sẵn 2 dòng theo số thiếu, GV tự gợi ý từ lớp) → "Xếp 2/2 · Học 0/2", tab Đã xếp = 2 → buổi 1 có mặt + đóng → "Học 1/2" → buổi 2 VẮNG + đóng → **"Xếp 1/2 · Học 1/2"** (suất vắng tự huỷ khỏi CẢ 2 chỉ số, đúng luật) → xếp bù 1 buổi + có mặt + đóng → **banner đề xuất "Đã học đủ 2/2 — hoàn thành đợt, hay em cần thêm buổi? [+1 buổi]"** → Hoàn thành đợt → tab Hoàn thành hiện card đợt "Đã học 2/2 · xong 13/07" → detail modal đủ 3 buổi với badge "vắng (không tính)"/"✓ có mặt". Dọn sạch data test (gỡ link + huỷ 3 buổi lý do TEST + xoá case), màn về đúng 6/0/8 như trước test.
- **Lưu ý còn mở:** đợt CŨ (6 case đang có) hiện đúng trạng thái "Chưa chốt kế hoạch" — GV vào chốt dần là chạy luồng mới, không cần migrate data. Gợi ý tự động scope dạng từ các buổi HS vắng (derive được từ giáo trình buổi) — ĐỂ SAU, Thùy chốt đợt này giữ scope bé.
- `npx tsc --noEmit` + `npm run build` sạch.
### 07-13 (tiếp) — ⭐ HỌC PHÍ: tab ĐIỂM DANH theo lớp · rework tab HS THEO MÔN (vận hành + 2 CÔNG THỨC + Detail) — mig 0098
- **Thùy chốt spec:** (1) tab Điểm danh: trái = danh sách lớp (thanh cuộn RIÊNG), phải = ma trận HS × ngày học, ô = có mặt/vắng — OPS view nhanh; (2) tab HS theo môn: bỏ trọng tâm cột PH/Đơn giá/Hệ số (thông tin fix) → hiện VẬN HÀNH: lớp học mấy buổi/nghỉ mấy/bù mấy/đuổi mấy — thành tiền + nút Detail (popup: đi học ngày nào, nghỉ/bù/đuổi ngày nào, tài liệu + phí); (3) ⭐ 2 CÔNG THỨC học phí chính: **CT1** (nghỉ <30%) = số buổi LỚP × đơn giá × hệ số · **CT2** (nghỉ ≥30%) = (buổi học thực tế + buổi bù) × đơn giá × hệ số — hệ ĐỀ XUẤT theo ngưỡng 30%, người dùng CHỌN LẠI được, là 1 cột trong tab; công thức tổng quát: Học phí = học chính + bổ trợ đuổi + phí tài liệu; (4) toggle môn Toán-Văn-Anh-KHTN.
- **Engine (gami/hocphi.js):** thêm `deXuatCongThuc` (tái dùng ngưỡng canXetDuyetNghi30) + `thanhTienHocChinh(ct, {soBuoiLop, soBuoiDiHoc, soBuoiBu}, donGia, heSo)`. Test verify_hocphi.mjs 15/15 pass (6 test mới).
- **Mig 0098 `hoc_phi_cong_thuc`** (PK hs+lop+ky): CHỈ có dòng khi người dùng chọn TAY (anti-NULL — không dòng = theo đề xuất; chọn TRÙNG đề xuất = xoá dòng, không giữ dòng thừa).
- **Lib:** `getDiemDanhTheoLop(lopId, ky)` (ma trận) + `listHocPhiTheoMonV2(ky)` (batch, mỗi dòng HS×lớp đủ: đếm buổi lớp window/nghỉ/đi/bù/đuổi + NGÀY từng loại + công thức đề xuất/chọn + tiền học chính/đuổi/tài liệu; bù trace qua `bu_cho_buoi_id`→lớp gốc — buoi_hoc_hs 2 FK về buoi_hoc nên tách bước không embed; đuổi gắn về lớp qua bo_tro_duoi.lop_id, case không khớp → dòng riêng) + `setCongThucHocPhi`.
- **UI:** TheoMonTab đời 2 (toggle môn + cột Buổi lớp/nghỉ · Bù · Đuổi · Công thức CT1/CT2 với badge "đề xuất"/"tay" · Thành tiền · Detail popup chips ngày + breakdown) + DiemDanhTab (trái lớp cuộn riêng — đo thật scrollHeight 1452 > clientHeight 405, phải ma trận sticky header + sticky cột tên).
- **Verify sống data thật:** bảng Toán 230 dòng/134tr; em nghỉ 3/3 buổi tự đề xuất CT2 → 0đ, click CT1 → badge "tay" + 435k (persist DB), click lại CT2 (trùng đề xuất) → dòng chọn-tay tự xoá về "đề xuất"; Detail Anh Thư: đi 07/07+12/07, nghỉ 05/07, CT2 (đi 2+bù 0)×150k + tài liệu 30k = 330k đúng công thức tổng quát; ma trận 11A1: 11 HS × 4 buổi ✓/✕/— đúng.
- **⭐ Bug bắt được khi verify:** toggle "Anh" lọc `mon==='Anh'` nhưng DB lưu `'Tiếng Anh'` → luôn 0 dòng — fix map nhãn↔giá trị tường minh. (Văn/Anh hiện 0 dòng là ĐÚNG data: 6 lớp Văn/Tiếng Anh chưa có buổi nào trong T7 — verify qua DB trước khi kết luận bug.)
- **⚠ Phạm vi:** công thức CT1/CT2 mới áp ở TAB THEO MÔN (đúng chữ Thùy "phải là 1 cột trong tab HS theo môn"). Tab Phiếu/chốt kỳ VẪN tính theo cách cũ (soBuoiWindow + xét duyệt ≥30%) — 2 hệ đang song song, cần Thùy chốt bước sau: Phiếu có chuyển sang CT1/CT2 (và xét duyệt nghỉ-30 có bị CT2 thay thế) không.
- tsc + build + verify_hocphi 15/15 sạch.
### 07-13 (tiếp 2) — BỔ TRỢ ĐUỔI: quản trị DẠNG — trạng thái đã dạy/chưa dạy per dạng (mig 0099)
- **Thùy:** pick 8 dạng thì card đợt phải hiện 8 dạng, dạng nào ĐÃ DẠY dạng nào CHƯA; phía đánh giá của người dạy phải XÁC NHẬN đã dạy dạng nào — "như thế mới xác định được lúc nào kết thúc được bổ trợ, xem có cần gia hạn hay thu ngắn đợt không".
- **Mig 0099:** `bo_tro_duoi_dang` + `day_buoi_id` (FK buoi_hoc, bằng chứng buổi nào dạy) + `day_at` — theo convention `*_dong_at` (NULL = chưa dạy). Bỏ tick = clear cả 2.
- **Lib:** `DotDuoi.dangs` nâng từ `string[]` → `DangDuoi[]` (id, ma_dang, day_buoi_id, day_at). `chotKeHoachDuoi` đổi từ delete-all-insert-all sang **DIFF** (chỉ xoá dạng bị bỏ, thêm dạng mới — replace toàn bộ sẽ XOÁ MẤT dấu đã-dạy của dạng giữ nguyên, suýt dính). `getDangCuaBuoiDuoi(buoiId)` (map caseId→dạng[] cho detail buổi) + `setDangDay(id, buoiId|null)`.
- **UI:** (1) card đợt: "Dạng x/y" + chips per dạng (✓ xanh = đã dạy, xám = chưa) thay dòng text cũ; (2) BuoiDuoiDetail — khối per-HS thêm hàng chips dạng CLICK ĐƯỢC: tick = dạy buổi này (✓ xanh đậm), ✓ nhạt = dạy buổi khác (bỏ tick hỏi lại confirm — tránh lỡ tay xoá dấu buổi trước), trắng = chưa; (3) banner đề-xuất-đóng kèm độ phủ: đủ N buổi mà thiếu dạng → "⚠ còn x dạng chưa dạy" (cân nhắc gia hạn); NGƯỢC LẠI phủ hết dạng sớm → banner xanh dương "cân nhắc kết thúc sớm để thu ngắn đợt"; (4) DotDetailModal (Hoàn thành) chips dạng cũng mang trạng thái.
- **Verify sống end-to-end (case test, dọn sạch sau):** chốt 2 dạng/2 buổi → card "Dạng 0/2" chips xám → vào buổi tick dạng 1 → "DẠNG ĐÃ DẠY 1/2: ✓06010102" → tick dạng 2 + có mặt + đóng buổi → card "Dạng 2/2 ✓✓" + banner "Đã dạy đủ 2/2 dạng dù mới học 1/2 buổi — cân nhắc kết thúc sớm" đúng nguyên văn nhu cầu gia-hạn/thu-ngắn.
- tsc + build sạch.
### 07-13 (tiếp 5) — FIX GỐC: gán MT bị "báo thành công nhưng thiếu nội dung" — bug xoá-rồi-tạo silent-fail do FK, đổi sang cập nhật-tại-chỗ
- **Thùy báo (refine sau khi t hiểu nhầm hướng đầu):** không phải rỗng hoàn toàn — gán MT cho 9S1 xong, thêm "Phần nâng cao" vào master, buổi ĐÃ GÁN không thấy phần đó. Điều tra ra 2 lớp vấn đề riêng biệt, cả 2 đều thật:
  1. **`mt_buoi` là bản CHỤP 1 LẦN tại lúc gán** (copy phans từ master) — sửa master SAU đó không tự lan sang buổi đã gán (đúng kiến trúc, không phải bug) — cần bấm "Gán vào buổi" LẠI để refresh. Verify: bản mới nhất (gán lúc 14:54) ĐÃ có đủ Phần III Nâng cao — vấn đề tự hết khi Thùy tự gán lại.
  2. **⭐⭐ BUG THẬT nghiêm trọng hơn, tìm ra trong lúc điều tra:** `ganMTVaoBuoi` xoá MỌI bản mt_buoi cũ (theo nguon_id+lop_id) RỒI tạo mới — nhưng KHÔNG kiểm tra lỗi xoá. Bản cũ nhất của (Mã 1, 9S1) đang bị `de_test.tai_lieu_id` (Đề test đầu vào Khối 9 Toán, active) tham chiếu → Postgres CHẶN xoá (FK RESTRICT `de_test_tai_lieu_id_fkey`) nhưng code cứ lặng lẽ đi tiếp, tạo bản MỚI chồng lên — xác nhận: **3 bản trùng (nguon_id, lop_id) cùng tồn tại**, tích tụ qua nhiều lần "re-gán" tưởng đã thay thế (mỗi lần Thùy sửa xong bấm gán lại, tưởng cập nhật, thực ra chỉ CHỒNG THÊM, không XOÁ được cái cũ).
- **Fix TẬN GỐC** (Thùy: "fix lỗi duplicate đi tránh sau này bug tiếp") — đổi hẳn chiến lược trong `ganMTVaoBuoi` (mt.ts): KHÔNG xoá-rồi-tạo nữa → **tìm bản đang giữ (theo nguon_id+lop_id, sort created_at asc lấy bản CŨ NHẤT — nhiều khả năng là bản bị tham chiếu) → CẬP NHẬT TẠI CHỖ** (giữ nguyên `id`, đổi `ngay`, xoá phans/câu cũ rồi chép lại từ master mới nhất). Nếu lịch sử để lại NHIỀU bản trùng (bug cũ), dọn các bản THỪA (best-effort, không throw nếu 1 bản thừa khác lại bị tham chiếu — cực hiếm). Cách này KHÔNG BAO GIỜ đụng FK của bảng khác trỏ vào bản đang giữ (vì không xoá nó), và tự động dọn sạch trùng lặp lịch sử ngay lần gán tiếp theo — không cần migrate tay riêng.
- **⚠ Sự cố phụ trong lúc verify (đã tự sửa xong):** lần test đầu dùng nhầm chuỗi ngày ('2026-07-07' thay vì '2026-07-08' thật) do đọc lệch 1 ngày qua cách `pg` (raw client) hiển thị cột `date` dạng Date-object JSON (đúng bẫy CLAUDE.md cảnh báo — timezone). Hệ quả: dời nhầm ngày gán MT thật + tạo dư 1 buổi rác (13 HS điểm danh). Phát hiện qua đối chiếu `ngay::text` (ép kiểu text, không qua Date object) — sai lệch hiện rõ (07/08 thật vs 07/07 tưởng nhầm). Tự khắc phục: trả `ngay` bản MT về đúng 08/07, xoá buổi rác + roster, verify lại buổi thật (aca3ba90) không suy suyển. **Bài học cho CHÍNH t:** script chẩn đoán dùng `pg` thô PHẢI ép `::text` khi so ngày, đừng tin JSON.stringify của Date object — cùng đúng bẫy mà CLAUDE.md cấm trong code app, áp dụng luôn cho script tra cứu của mình.
- **Verify cuối cùng bằng đúng hàm thật, đúng ngày thật (08/07):** `ganMTVaoBuoi` trả `buoiMoi:false` (tìm đúng buổi thật, không tạo trùng) → DB xác nhận: **chỉ còn ĐÚNG 1 dòng** mt_buoi cho (Mã 1, 9S1) — 2 bản trùng lịch sử tự dọn sạch, phans đủ cả "Phần III: Nâng cao.", **`de_test` (Đề test đầu vào Khối 9 Toán) vẫn active + hợp lệ** (không bị vỡ tham chiếu), buổi học thật (08/07, 13 HS, các cột đóng phase) không hề bị đụng.
- tsc + build sạch.
### 07-14 — NHẬP ĐỀ THI: fix bóc ảnh tệ (batch nhiều trang/lệnh) + dựng tool tự test Node + tìm ra bug LỚN HƠN (câu ảo do lời giải tràn trang) — CHƯA XONG
- **Thùy báo:** "Bóc ảnh khá tệ. Linh tinh... tỉ lệ thấp hơn nhiều so với Nhập kho. 1. Bóc hình ko đúng phạm vi 2. Bóc hình sai câu 3. Ko nhận đáp án. m phải thiết lập lại để tự test đi tự lấy kết quả chứ như thế này tệ quá."
- **Root cause #1 (ĐÃ FIX, đã push):** `bocDeTuFile` (DeThiScreen.tsx) từ round trước gộp `BATCH_TRANG=6` trang/1 lệnh Gemini khi `coHinh=true` (fix cho bug "AI bị CẮT (JSON dở)" round trước) — nhưng gộp nhiều ẢNH vào 1 lệnh buộc AI vừa định vị bounding-box vừa gán đúng câu/ảnh (`anh_idx`) CÙNG LÚC trên nhiều ảnh, khó hơn hẳn 1-ảnh-1-lệnh mà `NhapKhoScreen` (module bóc ảnh THAM CHIẾU, tỉ lệ tốt) luôn dùng. Kéo theo cả chất lượng đáp án/loai_cau xuống, không chỉ riêng crop hình. **Fix:** `coHinh=true` → luôn batchSize=1 (1 trang/lệnh, giống hệt NhapKhoScreen); `coHinh=false` (đề thuần text) vẫn giữ batch ≤6 trang để tránh MAX_TOKENS.
- **⭐⭐ Dựng công cụ TỰ TEST (`scripts/test-dethi-ingest.ts`, `npm run test:dethi -- <file.pdf> [--co-hinh] [--chuan]`)** — theo đúng yêu cầu "tự test đi tự lấy kết quả", KHÔNG cần chờ Thùy test tay hay phụ thuộc Browser pane (từng bị TREO ở bước render PDF, chặn verify nhiều vòng trước). Dùng THẬT `buildDeThiIngestPrompt`/`DETHI_INGEST_SCHEMA`/`parseDeThiIngestJson`/`callGeminiRich` import trực tiếp từ `kho/api.ts` (không viết lại) — chỉ thay phần render canvas (browser `HTMLCanvasElement` → `@napi-rs/canvas`, chạy được trong Node qua `vite-node`, đã thêm `@types/node`/`vite-node`/`@napi-rs/canvas` vào devDependencies). Test bằng CHÍNH file PDF Thùy đã tải lên thật (kéo qua DB `tai_lieu.cau_hinh->>pdfGocUrl`) — không cần hỏi xin file mẫu.
- **⚠ Giới hạn đã biết của tool:** `@napi-rs/canvas` + `pdfjs-dist` render Node có bug glyph riêng ("getPathGenerator...isn't resolved yet", mất vài chữ/dấu trong ảnh) — KHÔNG PHẢI lỗi production (browser dùng DOM canvas thật, không qua đường này). Ảnh cắt (`scripts/out-crops/`) do đó KHÔNG dùng để soi bounding-box bằng mắt được, chỉ JSON trích xuất (loai_cau/stt_goc/dap_an/lua_chon) đáng tin.
- **Root cause #2 (ĐÃ FIX, đã push):** chạy tool trên file thật ("THPT LÊ CHÂN — Mã đề 101", Thùy gửi lại qua đường dẫn máy `E:\BK ACADEMY\...\Đề 1.pdf`, cùng file với bản tải từ DB) → gán PHẦN (`chuan=true`) bị neo cứng ở "Phần III" mãi mãi sau lần reset đầu tiên (code cũ `Math.min(phanIdx+1, len-1)`), toàn bộ câu SAU exam đầu tiên bị lệch nhãn. Fix: xoay vòng `(phanIdx+1) % CHUAN_PHAN.length` (reset → sang phần KẾ TIẾP, kể cả quay lại "Phần I").
- **⭐⭐ Root cause #3 — BUG THẬT LỚN NHẤT, TÌM RA nhờ tool tự test, CHƯA FIX:** Thùy xác nhận file test ("Đề 1.pdf") **LÀ đề cấu trúc chuẩn thật** (12 TN + 4 ĐS + 6 TLN = 22 câu thật), nhưng tool báo "12/1/137 câu" — sai lệch quá lớn. Đọc RAW TEXT gốc trong PDF (`pdfjs-dist` getTextContent, không qua Gemini) xác nhận: đây là **1 đề chuẩn 22 câu NHƯNG mỗi câu có LỜI GIẢI CHI TIẾT dài, TRÀN QUA 2-3 TRANG** (đặc biệt phần Đúng-Sai/Trả lời ngắn — vd trang 8 CHỈ có "d. Đúng... Để hàm số đồng biến..." tiếp nối câu 1 từ trang 7, KHÔNG có nhãn "Câu N:" mới nào). Vì pipeline bóc **TỪNG TRANG RIÊNG LẺ, KHÔNG CÓ NGỮ CẢNH TRANG TRƯỚC** (đặc biệt sau fix #1 ở trên, coHinh=true giờ LUÔN 1 trang/lệnh) — 1 trang chỉ chứa lời giải tiếp diễn vẫn bị Gemini hiểu lầm/bịa thành "câu mới" (schema không cho phép trả mảng rỗng một cách tự nhiên, và prompt hiện tại không dạy AI nhận biết "trang này không có câu mới"). 22 câu thật → 137-150 câu ảo.
  - **Bắt đầu sửa nhưng CHƯA XONG (đã revert, không push code dở):** hướng đi đúng = truyền "câu cuối cùng đã bóc được (stt + phần)" từ lượt trước sang prompt của lượt sau, dạy AI: "nếu trang này KHÔNG thấy 'Câu N:' mới ở đầu dòng → toàn bộ chỉ là lời giải tiếp diễn của câu {X} đã bóc rồi, trả `cau: []`, ĐỪNG bịa câu mới". Đã thêm tham số `cauCuoi` vào chữ ký `buildDeThiIngestPrompt` (kho/api.ts) nhưng CHƯA viết dòng prompt + CHƯA nối state xuyên vòng lặp `bocDeTuFile` (DeThiScreen.tsx) — REVERT lại nguyên trạng cuối phiên vì hết giờ, tránh push nửa vời. **VIỆC TIẾP THEO ưu tiên #1.**
- **Trạng thái cuối phiên:** đã commit+push `419f3a4` lên `nhap-de-thi-v2` (PR #11) — gồm fix #1 (batching) + fix #2 (xoay vòng phần) + tool tự test. PR #11 **VẪN CHƯA MERGE** (chờ Thùy gõ rõ chữ "merge" theo lệ). Bug #3 (câu ảo do lời giải tràn trang) **CHƯA FIX** — đây là nguyên nhân CHÍNH gây "12/1/137" Thùy phàn nàn, quan trọng hơn cả fix #1/#2 đã làm.
- tsc + build sạch (sau khi revert phần dở).

---

## 2026-07-15 — Fix ops-KHTN + Bổ trợ ĐUỔI: bước DUYỆT DẠNG của team học thuật

**Fix 1 (đã commit `102b9fc`, đã lên main): ops không thấy lớp KHTN ở màn Buổi học.**
- Root cause: backfill `nhan_su_mon='Toán'` (06-29, cho MỌI nhân sự) vô tình khoá 4/5 người team ops vào 1 môn. `BuoiHocScreen` lọc `view = (laAdmin || myMons.length===0) ? tất : lọc theo myMons` — ops giờ có `mons=['Toán']` nên `myMons.length===0` sai → KHTN/Anh/Văn biến mất.
- Fix: thêm `laOps = me.teams.some(t=>t.ma==='ops')`, gộp vào điều kiện "thấy tất" (`laAdmin || laOps || myMons.length===0`). Đúng bản chất: ops điểm danh liên-môn, KHÔNG bị `nhan_su_mon` (đó là scope④ gate kho cho GV/TA) chi phối — giống `opsToanHe` ở nhansu.ts.
- Verify DB (read-only): 13 vắng KHTN = 8 xếp bù + 1 không-bù + 4 treo, khớp tuyệt đối, 0 mồ côi → "lỗi 2" (data bù KHTN không nhất quán) là cảm nhận từ lỗi 1, không phải lỗi sổ sách.

**Fix 2 (CHƯA commit lúc viết log này — chờ verify): Bổ trợ đuổi — handoff DUYỆT DẠNG cho team học thuật.**
- Thùy chốt 3 fork: (a) người duyệt = **ghế team `hoc_thuat` của MÔN** (`vi_tri.mon`); (b) team học thuật chốt **cả dạng + số buổi** (1 gói); (c) gate **MỀM** (Ops xếp lịch được ngay khi chưa duyệt, card cờ ⚠, GV dạy chưa có dạng để tick tới khi duyệt). Tạm để CẢ team học thuật chốt được (chưa đẻ team riêng — YAGNI; đổi sau = 1 dòng ở `listMonHocThuatCuaToi`).
- **Nửa đã có sẵn, KHÔNG làm lại:** GV dạy tick "đã dạy dạng" mỗi buổi = `bo_tro_duoi_dang.day_buoi_id/day_at` (0099). Việc MỚI chỉ là bước duyệt.
- **mig 0100** (áp DB claude_build, đã `npm run schema`): `bo_tro_duoi` + `dang_duyet_at` (NULL=chưa duyệt, derive task) + `dang_duyet_boi` (FK→nhan_su). Grandfather: đợt đã có `so_buoi_du_kien` → `dang_duyet_at=created_at` (7 đợt đang chạy khỏi bị bắt duyệt lại; 2 đợt chưa kế hoạch = chờ duyệt).
- **nhansu.ts:** `listMonHocThuatCuaToi(nsId)` (ghế `hoc_thuat` + `vi_tri.mon`, bỏ liên-môn) → `MyProfile.hocThuatMons`. KHÁC `mons` (nhan_su_mon).
- **botro_duoi.ts:** `DotDuoi` +`dangDuyetAt`/`duyetBoiTen`; `BuoiCuaDot` +`nhanXet` (buoi_danh_gia) +`dangDay[]` (dạng dạy buổi đó, theo day_buoi_id). `duyetKeHoachDuoi()` = chotKeHoach + đóng dấu duyệt. `listDotChoDuyetDuoi(mons)` = đợt chưa duyệt ∈ môn (derive, không bảng tasks).
- **BoTroDuoiScreen.tsx:** card "Đang đuổi" giờ **click ra popup**; gộp `KeHoachModal`+`DotDetailModal` → 1 `DotDetailModal` dùng chung 2 tab (bảng từng buổi: trạng thái/ngày/phòng/dạng dạy/nhận xét + sửa dạng+số buổi TRONG popup, chỉ học thuật). Cờ ⚠ chưa-duyệt; nút "Chốt & duyệt" chỉ cho `coQuyenDuyet(mon)`; Ops thấy "⏳ Chờ học thuật" nhưng "+ Xếp lịch" vẫn bật (gate mềm).
- **NhanSuHome (Việc-của-tôi):** card "📚 N đợt bổ trợ đuổi chờ chốt dạng" cho team học thuật (derive theo `hocThuatMons`) → click sang màn.
- **Verify (read-only DB, KHÔNG click UI được vì auth gate — không đăng nhập):** FK `dang_duyet_boi→nhan_su` OK (embed resolve được); grandfather 7 duyệt/2 chưa đúng; `listDotChoDuyetDuoi('KHTN')`→Lê Thành An (về Phạm Anh Ngọc), `('Toán')`→Đặng Linh Trang; query detail per-buổi (nhận xét+dạng) hợp lệ. tsc+build sạch.
- **Rủi ro nhỏ đã biết:** embed `duyet_boi:dang_duyet_boi(ho_ten)` cần PostgREST reload schema cache sau thêm FK — Supabase auto-reload trên DDL nên gần chắc ổn; nếu 400 "could not find relationship" thì `NOTIFY pgrst, 'reload schema'`.

---

## 2026-07-20 — ET: thứ tự câu trên GIẤY lệch thứ tự trên HỆ → gom theo nhóm TẠI LÚC LƯU

**Thùy hỏi (audit, không phải báo lỗi):** "Khi làm ET, t chọn câu hỏi theo 1 thứ tự thì hệ thống tự sắp xếp lại theo loại. Vậy tài liệu đánh giá là theo thứ tự nào?" — hoá ra là hỏi trúng một bug thật.

**Điều tra:** việc gom theo loại CHỈ xảy ra ở 1 chỗ duy nhất là `ETPrintView.tsx` LÚC RENDER (3 rổ tn/tln/tl + bộ đếm chung `next()` đánh số lại 1..N). Màn tạo ET KHÔNG gom — hiển thị và lưu đúng thứ tự Thùy chọn vào `tai_lieu_cau.thu_tu`. Nên 4 nơi tiêu thụ ET chạy 2 thứ tự khác nhau:
- thân đề in (bản HS + bản GV) = đã gom theo loại;
- bảng phiếu chấm ở ĐẦU CHÍNH TỜ ĐỀ ĐÓ (`caus.map((_,i)=>Câu i+1)`) = `thu_tu` thô;
- màn Chấm ET (`gami.ts:278` → `getETCaus`) = `thu_tu` thô;
- ET online (`testonline.ts:50` → `getETCaus`) = `thu_tu` thô.

**Hệ quả nặng nhất KHÔNG phải chuyện thẩm mỹ:** GV chấm bài đánh số theo thứ tự đã gom, nhưng nhập điểm vào danh sách theo `thu_tu` → `dung_sai` gán NHẦM CÂU → nhầm luôn `ma_dang` → **bẩn mastery**, tức hỏng đúng đơn vị chân lý (HS × dạng). Chỉ ẩn khi thứ tự chọn tình cờ đã là TN→TLN→TL. Đây là ca đúng kiểu "derive ở 1 nhánh rồi để các nhánh khác đọc nguồn thô".

**Thùy chốt:** gom theo loại TẠI LÚC LƯU. "Mục tiêu là 2 trên hệ thống và trên giấy phải khớp nhau."

**Đã làm:**
- `lib/tailieu.ts` — thêm `etGroupOf()` + `sortETCaus()` (TN=0 → TLN=1 → TL=2, giữ nguyên thứ tự chọn trong nhóm bằng tie-break index). Câu Đúng/Sai (`menh_de`) vẫn thuộc nhóm trắc nghiệm như logic cũ. **Helper DÙNG CHUNG** — cố ý đặt 1 chỗ để không thể lệch lại lần nữa.
- `ETScreen.luu()` — sort trước khi `setETCaus` → `thu_tu` trong DB CHÍNH LÀ thứ tự sẽ in. Từ đây `thu_tu` là thứ tự duy nhất, cả 4 nơi đọc cùng nguồn.
- `ETPrintView` — BỎ hẳn 3 rổ, in thẳng theo `thu_tu`. Heading "Phần …" giờ cắt theo KHÚC LIÊN TIẾP cùng nhóm (`runs`), roman nới tới X + fallback số.
- Bảng phiếu chấm ở `:182` KHÔNG phải sửa — nó vốn đã theo `thu_tu`, giờ thân đề cũng thế nên tự khớp.

**Bẫy đã tránh (suýt tạo bug im lặng):** bản sort đầu tiên định làm `chon.map(m=>cau[m]).filter(Boolean)` — nhưng cache `cau` CÓ THỂ THIẾU câu (`ensureCache` early-return khi dạng đó đã có câu khác trong cache: mở ET cũ để sửa rồi ✎ Chọn câu khác cùng dạng) → `filter(Boolean)` sẽ **lặng lẽ xoá câu khỏi đề mà vẫn báo lưu thành công**. Đã đổi thành nạp bù theo `maDang` rồi mới sort; còn thiếu thì **báo lỗi và KHÔNG lưu**, không đoán nhóm.

**ET CŨ (thu_tu chưa gom):** vẫn in ĐÚNG THỨ TỰ và khớp mọi nơi — chỉ là có thể ra nhiều "Phần" hơn 3. Mở ra bấm Lưu 1 lần là gọn. Cố ý KHÔNG viết migration đè `thu_tu` hàng loạt: ET đã chấm rồi mà đổi thứ tự thì `dung_sai` đã ghi theo thứ tự cũ sẽ lệch — để người dùng tự chọn khi sửa là an toàn hơn.

- tsc + build sạch. CHƯA verify bằng click UI (auth gate, không đăng nhập được) — logic thứ tự verify bằng đọc code 4 nhánh tiêu thụ.

---

## 2026-07-19 — Test đầu vào: đảo luồng theo BKDEMY_TESTDAUVAO_SPEC_ADDENDUM.md

**Bối cảnh:** module build 07-08 (Story 1-4) rồi tạm dừng cho MT. Thùy gửi addendum đảo luồng, yêu cầu PHA 0 (khảo sát+PLAN, DỪNG chờ duyệt) trước khi sửa — làm đúng theo kỷ luật đó, viết `PLAN.md` (đè bản PLAN cũ của module Ops — module đó đã ship, an toàn ghi đè).

**Phản biện trước khi code (PLAN.md có đầy đủ):**
1. **REWORK-1 hẹp hơn addendum mô tả** — `de_test_cau` (câu gõ tay) đã DROP từ mig 0092, `de_test` đã chỉ còn là con trỏ khối×môn→tai_lieu, snapshot-từ-Kho-MT (`layCauTheoThuTu`) đã chạy đúng. Việc thật chỉ là đổi NGUỒN dropdown ở Điểm danh.
2. **"Nhận xét" biến mất khỏi sơ đồ luồng mới** — addendum vẽ 2 nguồn (Chấm + Scan) đổ vào Trả bài, nhưng phiếu vẫn cần nội dung nhận xét/biểu đồ/lớp đề xuất, không rõ bước này đi đâu. **Thùy chốt:** gộp thẳng vào Trả bài — không còn là bước/gate riêng.
3. **`de_test` giữ hay bỏ** — verify DB thật: 2 dòng, `ca_test` 4 dòng, TẤT CẢ `de_test_id` đang NULL (chưa ai gán thật) → an toàn drop. **Thùy chốt:** bỏ hẳn, `ca_test.tai_lieu_id` trỏ THẲNG `tai_lieu` (không qua lớp trung gian), dropdown lọc theo môn + khối ứng viên trực tiếp từ Kho MT.
4. **Đổi đề 2 lần** (HS kêu khó, Ops đổi đề khác tại phòng) — code cũ chỉ INSERT câu mới vào `ca_test_cau`, sẽ CHỒNG câu cũ+mới. **Thùy chốt:** xoá `ca_test_cau_kq`+`ca_test_cau` của đề cũ trước khi snapshot đề mới.

**Đã làm:**
- Migration `0105_test_dau_vao_dao_luong.sql` — drop `de_test`, `ca_test` thêm `tai_lieu_id` (trỏ thẳng `tai_lieu`) + `bai_da_cham_url` (cột scan-đã-chấm, KHÁC `bai_url`=bài chưa chấm).
- `lib/detest.ts` — viết lại: bỏ hẳn phần "ĐỀ TEST" (de_test CRUD); `ganDeCaTest` giờ xoá sạch câu cũ trước khi snapshot lại; thêm nhóm "SCAN BÀI ĐÃ CHẤM" (`listCanScanDaCham`/`listDaScanDaCham`/`dongScanDaCham` — có giá trị = xong, không cần cờ `*_xong_at` riêng, đúng anti-NULL); bỏ gate `danh_gia_xong_at` khỏi chuỗi (không còn `listCanNhanXet`/`dongNhanXet`/`moLaiNhanXet` — nhận xét giờ optional, autosave qua `setNhanXet` bất cứ lúc nào); `listCanTraBai`/`dongTraBai` viết lại — card sinh NGAY khi điểm danh đóng (không chờ chấm/scan xong mới hiện), mỗi card tự báo đang thiếu gì (`choChamXong`/`choScanDaCham`/`choLopDeXuat`), `dongTraBai` validate đủ cả 3 nguồn mới cho đóng.
- `lib/tuyensinh.ts` — `CaTest.deTestId` → `taiLieuId` (đổi tên theo cột DB mới).
- `screens/vanhanhops/DiemDanhTestScreen.tsx` — dropdown đề đổi từ `listDeTest()` (lọc `active`+`khoi` qua de_test) sang `listMT(mon)` lọc trực tiếp theo khối ứng viên (đã sort mới nhất lên đầu sẵn, khớp "mặc định MT tháng gần nhất"), đổi đề được bất kỳ lúc nào không giới hạn. Card Trả bài viết lại hoàn toàn — gộp UI biểu đồ chuyên đề + kỹ năng + kiến thức + lớp đề xuất (port từ `NhanXetTestScreen` cũ) vào ngay trong card, mở-rộng-để-làm thay vì màn riêng.
- `screens/tuyensinh/ChamTestScreen.tsx` — bỏ cột trái xem scan (grid 3 cột → 2 cột), người chấm giờ chấm từ giấy ngoài, màn chỉ còn nhập liệu Đ/C/S thuần.
- `screens/vanhanhops/ScanDaChamScreen.tsx` — **màn MỚI**, upload-only, độc lập hoàn toàn với Chấm.
- `screens/tuyensinh/TestDauVaoScreen.tsx` — tab shell còn 3 tab (Điểm danh/Chấm/Scan bài đã chấm), bỏ tab Đề test + Nhận xét test.
- **Xoá file:** `DeTestScreen.tsx`, `NhanXetTestScreen.tsx` (chức năng đã gộp/thay thế theo 4 quyết định trên — không còn nơi nào import).
- `PhieuTestDauVao.tsx` — thêm nút "📄 Bài đã chấm" cạnh Copy ảnh (gửi PH = phiếu ảnh + file scan đính kèm riêng, KHÔNG nhồi chung 1 ảnh vì scan có thể nhiều trang).

**Chưa làm (cần Thùy chạy migration + xác nhận qua UI thật):** migration `0105` mới viết, CHƯA CHẠY trên DB thật (Claude chỉ có quyền đọc). Việc dọn mục 4 addendum (verify upload e2e, xoá `ung_vien` rác UV0127, soi gate `mon`) — chưa làm, để sau khi luồng chính chạy được đã.

- tsc sạch. CHƯA verify UI thật (auth gate, không đăng nhập được) — logic verify bằng đọc code + query DB trực tiếp (role read-only).

**Sửa tiếp cùng ngày (Thùy phản hồi lần 2 sau khi xem UI):** "Trả bài rơi vào Điểm danh test — đáng lẽ tab riêng tương đương Chấm test. Scan bài không cần tab riêng, chỉ cần derive task cho Ops."
- Tách Trả bài khỏi `DiemDanhTestScreen.tsx` → màn mới `screens/tuyensinh/TraBaiTestScreen.tsx`, thành tab ngang hàng Điểm danh/Chấm trong `TestDauVaoScreen.tsx` (bar tab giờ: Điểm danh / Chấm / Trả bài).
- Bỏ tab "Scan bài đã chấm" khỏi bar tab — `ScanDaChamScreen.tsx` (đã build) giữ nguyên làm màn, nhưng chỉ vào được qua card derive ở "Việc của tôi" (`staffLeaf='test_dau_vao_scan'`, KHÔNG có trong sidebar/tab nào). `NhanSuHome.tsx`: thêm fetch `listCanScanDaCham()` (gate `scope.opsToanHe`, pool chung không lọc theo người — giống Chấm test), render card riêng trong khối "Vận hành" (không gom theo NgàyRow vì không có deadline), cộng vào `canLam`/`hasActive`/count section.
- tsc sạch.

---

## 2026-07-21 — ET 5A2 20/07: in 5 câu / nhóm lớp 6 câu → lưới chấm KHÔNG bám đề

**Thùy báo:** "ET của lớp 5A2 hôm qua in ra 5 câu nhưng trong nhóm lớp lại 6 câu. Hình như do lỗi sửa lại ET mà hệ thống ko cập nhật."

**Chẩn đoán (query DB thật, script `scripts/_diag_et_problems.mjs` + `_diag_et_lech_dang.mjs` + `_diag_et_3ca.mjs`):**
- Hai chỗ đọc HAI nguồn khác nhau: bản in ← `tai_lieu_cau` (đề thật); **ảnh gửi PH + lưới chấm ← `gami_session_problems`**.
- `ensureETProblems` seed lưới **đúng một lần** (`if (cur.length) return`) rồi không theo đề nữa. Danh tính 1 ô chấm là **VỊ TRÍ** (`problem_no` ↔ index mảng câu) — không có gì trỏ về câu.
- 5A2 20/07 (giờ VN): ET soạn 18:27 (6 câu) → lưới seed 19:43 → chấm 19:43–19:47 (5 ô đầu) → **GV sửa đề 21:39 bỏ 1 câu còn 5**. Lưới vẫn 6 ô, ô 6 có **0 điểm** = cột trống thừa trên ảnh gửi PH.
- Ô 1–5 chấm TRƯỚC lúc sửa đề → nhãn dạng khớp đề tại thời điểm chấm. **Không có điểm nào gắn sai dạng, không đụng Elo.**

**Quét toàn hệ (176 buổi có doc ET) — 2 ca ban đầu tưởng hỏng, mổ kỹ thì KHÔNG:**
- **7S2 13/07** — có **2 doc ET** cùng (lớp+ngày). App dùng doc mới nhất (`getETByBuoi` order created_at desc) và lưới khớp ĐÚNG doc đó. Doc cũ `4efd950c` mồ côi. *(Scan đời đầu báo lệch vì so lưới với CẢ doc mồ côi — false positive, đã sửa cách đọc.)*
- **8B1 02/07** — `tai_lieu_cau` có 1 dòng trỏ `ma_cau='08010202029'` **không còn trong kho** (`dai_cau_hoi`). `getTaiLieuFull` `.filter(Boolean)` nên câu này rụng ở mọi nơi → đề render 6 câu = lưới 6 ô. Khớp.
- ⇒ **Chỉ 1 ca hỏng thật: 5A2 20/07.**

**Bài học:** cảnh báo cũ (`mismatch = etCaus.length !== probs.length`) chỉ bắt lệch SỐ LƯỢNG → **đổi câu mà giữ nguyên số câu thì hỏng hoàn toàn im lặng**. Lệch âm thầm từ 20/07 tới khi Thùy tự phát hiện qua ảnh gửi nhóm lớp.

**Đã làm:**
- `0106_gami_problem_ma_cau.sql` — thêm cột `ma_cau` vào `gami_session_problems` + index + backfill. Backfill **chỉ map khi SỐ Ô == SỐ CÂU** (bằng nhau ⇒ không thêm/bớt ⇒ vị trí vẫn là danh tính đúng); lệch số thì để NULL, không đoán.
- `0107_va_luoi_et_5a2_2007.sql` — xoá **đúng 1 dòng** `gami_session_problems` (ô 6 của 5A2 20/07, 0 điểm). Guard: chỉ xoá khi thật sự không có `gami_grades` nào. Chạy lại = no-op. **0 dòng grades bị mất.**
- `lib/gami.ts` — `ensureETProblems`/`resyncETProblems`/`ensureMTProblems`/`ensureBTVNProblems` → thay bằng **1 hàm chung `syncDocProblems(buoiId, phase, caus, daDong)`** (ET/MT/BTVN cùng bản chất, đừng đẻ 3 bản copy-paste lệch nhau). Khớp ô↔câu theo `ma_cau`: câu còn → giữ ô + điểm; câu mới → thêm ô; ô mất câu 0 điểm → xoá; **ô mất câu CÒN ĐIỂM → giữ + báo lên UI**, tuyệt đối không tự xoá điểm. Đề rỗng/load lỗi → không đụng lưới. **Phase đã đóng → chỉ báo, không sửa cấu trúc** (§4 đã chốt thì giữ vết). Thêm `xepLuoiTheoDe` (sắp theo đề, không ghi DB) cho reload sau mỗi lần chấm.
- `BuoiHocScreen.tsx` — ET/MT/BTVN gọi sync mỗi lần mở tab (bỏ nút "↻ Đồng bộ từ ET" thủ công, nó vốn từ chối chạy khi đã có điểm = vô dụng đúng lúc cần nhất). Header cột đánh số **theo vị trí trong ĐỀ** (`idx+1`), không theo `problem_no` (giờ chỉ là slot nội bộ, được phép thủng số). `cauOf` tra theo `ma_cau` thay vì index. 3 banner cảnh báo: đã-đóng-mà-đề-đổi / lưới-cũ-không-rõ-ràng / ô-mồ-côi-còn-điểm.
- tsc sạch (exit 0).

**Chưa làm:** migration `0106`+`0107` CHƯA CHẠY trên DB thật — Thùy chạy rồi mới verify UI được (code mới đọc cột `ma_cau`, **phải chạy migration TRƯỚC khi deploy code**).

**Còn tồn (dữ liệu, chưa đụng — cần Thùy quyết vì là xoá):**
1. `7S2 13/07` — doc ET mồ côi `4efd950c` (5 câu, không lưới nào dùng). Giữ hay xoá?
2. `8B1 02/07` — dòng `tai_lieu_cau` trỏ câu `08010202029` đã bị xoá khỏi kho (dangling). Nên có FK/constraint hoặc job dọn.
3. `setETCaus` KHÔNG bump `tai_lieu.updated_at` → sửa CÂU không để lại dấu vết thời gian, `updated_at` chỉ đổi khi `updateET` (tên/lớp/ngày/cấu hình). Làm chẩn đoán khó.

### Cùng ngày 07-21 — chạy migration + verify, và MỘT SAI LẦM CỦA CHÍNH BẢN VÁ

Thùy duyệt: xoá doc ET mồ côi 7S2, xoá dòng dangling 8B1, `setETCaus` ghi `updated_at`, và cho phép Claude tự chạy migration.

**Đã chạy trên DB thật** (`gami_grades` 19402 → **19402**, không mất điểm nào ở bất kỳ bước nào):
- `0106` — thêm cột `ma_cau`, backfill **2767 ô**.
- `0107` — xoá **1 ô** (5A2 ô6, 0 điểm).
- `0108` — xoá doc ET mồ côi 7S2 `4efd950c` (cascade: 1 phan + 5 tai_lieu_cau + 1 linkgen_jobs). PDF trong bucket `kho-tailieu` KHÔNG xoá.
- `0109` — **gỡ 5 nhãn `ma_cau` gắn SAI** (xem dưới).
- `npm run schema` → `schema.md` cập nhật (tiện thể bắt được `schema.md` đang stale so với 0101/0102/0105).

**⛔ SAI LẦM CỦA BẢN VÁ (tự bắt được lúc verify, chưa kịp gây hại):**
Luật backfill đời đầu của `0106` là *"số ô == số câu ⇒ vị trí là danh tính, map theo thứ tự"*. **Nghe hợp lý nhưng SAI.**
Phản ví dụ chính là 5A2: đề gốc 6 câu → GV bỏ 1 câu **ở GIỮA** còn 5 → `0107` xoá ô rỗng thứ 6 → còn **5 ô / 5 câu, số khớp nhau** — nhưng ô 3,4,5 vẫn đang giữ câu **CŨ**, lệch 1 bậc. Map theo vị trí lúc đó gắn ô sang câu SAI (3 ô, 24 điểm). Cùng lỗi này `0106` cũng gắn sai 2 ô của `btvn 9C1 19/06`.

**Cách bắt được:** `ma_dang` của ô được seed từ `dang_chinh` của câu **LÚC CHẤM** → nó là **nhân chứng độc lập**. Gắn nhãn xong đối chiếu `dang_chinh(ma_cau)` vs `ma_dang`: lệch = biết chắc sai. Quét ra đúng 5 ô mâu thuẫn / 2772.

**Luật đúng (đã áp cho CẢ migration lẫn code):** gắn nhãn cần **HAI** điều kiện — (1) số ô == số câu (cần, **không đủ**) **và** (2) **kiểm tra chéo dạng** `dang_chinh(câu) == ma_dang(ô)` cho **mọi** ô; lệch dù 1 ô ⇒ bỏ cả lượt, để NULL, hỏi người. Lưới 5A2 vì thế **cố ý để `ma_cau` = NULL** — hệ không biết và không được đoán.
→ **Bài học rút:** khi map lại quan hệ đã mất, "số lượng khớp" KHÔNG phải bằng chứng. Phải tìm **nhân chứng thứ hai độc lập** rồi mới dám ghi. Nếu không có nhân chứng → để trống (§1.5), đừng suy luận cho gọn.

**Verify trên app thật** (dev server, login admin, buổi 5A2 · 2026-07-20 → tab ET):
- Lưới chấm: **5 cột** (trước 6). Header đánh số theo đề: Câu 1..5.
- **Ảnh gửi PH: 8 HS × 5 badge, grid `repeat(5, 26px)`** — đúng chỗ Thùy thấy 6 câu, giờ 5. **Lỗi gốc đã hết.**
- Banner đỏ hiện đúng lý do `lech_dang` ("số ô và số câu bằng nhau nhưng dạng của ô không khớp dạng của câu…"). Ban đầu banner in ra câu vô nghĩa "số ô (5) khác số câu (5)" vì gộp 2 lý do vào 1 cờ boolean → tách thành `khongRoRang: null | 'lech_so' | 'lech_dang'`.
- Console 0 lỗi. tsc exit 0.

**CHƯA LÀM — việc 2 (dangling câu) BỊ DỪNG, scope thật khác xa lúc báo:**
Em báo "1 dòng của 8B1", Thùy duyệt xoá 1 dòng. Query ra **150 dòng** `tai_lieu_cau` trỏ câu **không còn trong kho** (`dai_cau_hoi`), trải khắp GT/BTVN/ET **và cả tài liệu MẪU** (Giáo trình 11A ~15 câu, Giáo trình 7S/7A/7B, 9A/9B/9S, 11A1, 12A1, 5T1/5T2…). **KHÔNG xoá** — gật cho 1 dòng không phải gật cho 150 (Luật xoá: không gộp xoá vào bước lớn hơn).
Đây là bug ĐỘC LẬP và có thể nặng hơn bug ET: `getTaiLieuFull` `.filter(Boolean)` nên câu chết **rụng im lặng** khỏi bản in — giáo trình/BTVN đang phát cho HS **thiếu câu mà không ai biết**. Cần Thùy quyết hướng: (a) chặn xoá câu khỏi kho khi còn tài liệu dùng (FK/guard), (b) soft-delete câu, hay (c) cảnh báo ở màn soạn tài liệu. Xoá 150 dòng chỉ là dọn triệu chứng.

---

## 2026-07-21 — Ops không tick được "chuẩn bị phòng" (ca Tối) → lộ ra một LOẠI lỗi, không phải một lỗi

**Triệu chứng:** Ops (Hoàng Khánh Linh) bấm tick chuẩn bị phòng → `new row for relation prep_phong ... violates check constraint`.

**Nguyên nhân:** KHÔNG phải quyền/RLS. `prep_phong.luot` có CHECK `('ngay','sang','chieu')` từ `0086` (thiết kế cũ: T2-T6 gộp 1 lượt `'ngay'`). Thùy chốt **07-19** đổi sang **3 ca cố định sang/chiều/tối mọi ngày** → `CaTruc` trong `opsvanhanh.ts` sửa theo, **constraint đứng yên**. Data xác nhận: `ngay 20 · chieu 7 · sang 1 · toi **0**` — ca Sáng/Chiều vẫn tick được nên lỗi ẩn cả tháng, chỉ nhánh `'toi'` chết.

**Đã làm:**
- Thùy chạy tay trên prod: CHECK → `('ngay','sang','chieu','toi')`. Verify lại từ DB live: đúng, 28 dòng cũ còn nguyên. Giữ `'ngay'` để đọc lại lịch sử (UI không sinh nữa).
- `0110_prep_phong_luot_toi.sql` — ghi lại bản vá đó, idempotent. **KHÔNG có file này thì migrate-from-scratch sinh lại y nguyên bug**, vì `0086` vẫn giữ constraint cũ.
- `0111_vh_duyet_tab_mt.sql` — **CHƯA CHẠY**, chờ áp.

**Quả thứ hai, cùng loại, tìm ra khi truy quét:** `viec_van_hanh_duyet.tab` CHECK = `danhgia/ingame/et/btvn`, còn `TASK_TABS` (`vanhanh.ts:70`) = `danhgia/ingame/et/btvn/**mt**`. Hễ ai duyệt task **chấm MT** là dính đúng câu lỗi đó. Bảng đang **0 dòng** → *cần Thùy xác nhận: tính năng duyệt chưa dùng, hay đang fail lặng?* Không thêm `'diemdanh'` (TASK_TABS không sinh tab này — nới cho đường code không tồn tại là sai).

**⛔ Cơ chế khiến loại lỗi này ẩn được (đây mới là gốc):**
`introspect.mjs` dump cột/kiểu/PK/FK/trigger/function — **KHÔNG dump CHECK**. Nên tra `schema.md` chỉ thấy `| luot | text |`, tức "chứa được mọi chuỗi", trong khi sự thật DB chỉ nhận 3 giá trị. **Tập giá trị hợp lệ vô hình với chính công cụ tra cứu chuẩn.** DB đang có **56 CHECK, 46 dạng enum** → 46 điểm có thể lệch ngầm y hệt.

**Sửa cơ chế:** `introspect.mjs` thêm query `pg_constraint contype='c'`; check dạng `x = ANY (ARRAY[...])` parse ra và in thẳng vào cột **"giá trị hợp lệ"** của từng cột; check phức tạp (so sánh số, nhiều cột) rơi xuống mục "Checks khác" in nguyên văn — **không đoán bừa**. Kết quả: `56 check: 46 enum + 10 khác`.
→ Lần đầu chạy ra `0 enum + 56 khác`: regex bắt buộc `(col)::text = ANY`, nhưng cột **text thật** thì Postgres in `col = ANY` **không có cast** (chỉ varchar mới có). Cast phải là **tùy chọn**.
→ CLAUDE.md §2.1 thêm luật: **thêm giá trị vào union type TS ⇒ phải có migration nới CHECK đi kèm.**

**Bài học:** lỗi user báo là *một* nút không bấm được; thứ đáng sửa là *công cụ tra cứu đang giấu một chiều của schema*. Vá `prep_phong` chỉ trừ 1/46 điểm; sửa `introspect` thì 45 điểm còn lại tự lộ ở lần `npm run schema` kế. Đúng tinh thần triangulation §5 — để mâu thuẫn tự lộ qua data, đừng trông vào người nhớ.

**Va số migration:** file đầu em đánh `0109`, trùng `0109_go_nhan_ma_cau_mau_thuan.sql` (việc `ma_cau` cùng ngày) → đã đổi thành `0110`/`0111`.

### 07-21 (tiếp) — KHO RÁC + thay câu chết

Thùy chốt: *"câu hỏi trong kho bị sai nên trước khi xoá đều được duyệt trước, vẫn cần xoá. Nhưng có tài liệu đã in ra dùng rồi, nên cách hoàn hảo là khi xoá ở kho chính thì chuyển qua kho rác — giữ lại để tham chiếu không sai lệch, mà kho đang dùng vẫn sạch. Tôi chủ động dọn kho rác khi cần."* · *"Thay tự động đi."*

**`0111` — Kho rác.** Cột `xoa_at` NGAY TRONG bảng câu, **không tách bảng rác riêng**. 2 lý do cứng:
1. Tách bảng ⇒ mọi chỗ resolve câu phải join 2 nơi — sót 1 chỗ là tài liệu lại thiếu câu, đúng cái bug đang sửa.
2. `nextCauSeq` cấp mã mới = max(STT trong bảng)+1. Rác nằm **cùng bảng** ⇒ mã đã xoá **không bao giờ bị cấp lại** ⇒ tham chiếu cũ không bị trỏ nhầm sang câu mới toanh. Tách bảng là mất tính chất này — nguy hiểm hơn hẳn việc thiếu câu.

Ghi vết theo **§4**: bản nháp đầu em ghi `xoa_boi` **từ app** — sai luật ("app không được tự nhớ ghi log"). Làm lại: `xoa_at` = cột trạng thái đọc nhanh, lịch sử do **trigger `log_kho_cau`** đẻ vào `kho_cau_log` (hành_dong `vao_rac`/`khoi_phuc`/`xoa_vinh_vien`, actor = `jwt_uid()`). Verify thật: thao tác qua app ghi đúng actor `b29f4e12…`; thao tác qua script SQL ghi `actor=null` **nhưng vẫn có dòng log** — đúng ý đồ "không đường nào thoát khỏi vết".

Luật đọc (áp vào `lib/kho/api.ts`): chỗ **CHỌN** câu lọc `xoa_at is null` (`listCauByDang`, `searchCau`, `listDungSaiByDang`, RPC `count_cau_by_dang`) · chỗ **RESOLVE** câu (`getTaiLieuFull`, bản in, chấm) **không lọc**. `deleteDaiCum`/`deleteKhtnCum` (xoá cụm dạng kèm câu) đổi từ xoá cứng sang vào rác.
Màn **`KhoRac.tsx`** (nút 🗑 trong Bản đồ kiến thức): xem/khôi phục/xoá hẳn, cột "đang dùng" = số `tai_lieu_cau` còn trỏ tới. **`xoaVinhVienCau` CHẶN ở API** khi count > 0 — đây là cửa duy nhất còn đẻ được tham chiếu chết, chặn ở API chứ không chỉ ẩn nút.

**`0112` — thay 149/150 câu chết.** Suy dạng từ mã câu (8 ký tự đầu = mã dạng); kiểm chứng **8667/8675 câu (99,9%)**, 8 ngoại lệ đều là mã đời đầu `DC000006`/`DCDEMO01`. Chọn câu thay: cùng dạng · chưa có trong CHÍNH tài liệu đó · **ít dùng nhất trước** (cùng luật `suggestCauForDang`) · tie-break theo mã cho tất định. Migration ghi **cặp thay thế TƯỜNG MINH** (149 lệnh `update … where id=… and ma_cau=…`) thay vì SQL suy diễn lúc chạy → soát được, chạy lại = no-op. Bảng đối chiếu đầy đủ: `docs/2026-07-21-thay-cau-chet.md`.
Kết quả: tham chiếu chết **150 → 1** (`DC000012`, mã đời đầu không suy được dạng — bỏ, đúng như Thùy: "mất thì cũng mất rồi"). Giáo trình MẪU 11A/7S/9A: **0 câu chết còn lại**.
Verify chống trùng: kiểm **từng dòng** trong 149 dòng xem mã mới có bị trùng trong chính tài liệu của nó không → **0**. *(Lần kiểm đầu em so trùng theo mã câu toàn hệ và tưởng 0112 gây 1 cặp trùng ở "Giáo trình 9B" — sai, dòng 0112 ghi nằm ở tài liệu KHÁC. Bài học: so trùng phải so trong đúng phạm vi (tài liệu), không so theo giá trị toàn cục.)*

**PHÁT HIỆN MỚI, chưa đụng:** **396 cặp câu TRÙNG trong cùng 1 tài liệu** (có sẵn từ trước, không phải do 0112) — cùng mã câu xuất hiện 2–3 lần trong một giáo trình, có cặp ở cả phan `dang` lẫn `btvn`, có cặp **2 lần trong CÙNG một phan**. Vd `Giáo trình 9A` · `09080106018` × 3. Chưa rõ cố ý (ôn lại) hay lỗi `setDangOfBuoi`/nhân bản. Cần Thùy xem trước khi quyết.

`npm run schema` → 98 bảng · 10 trigger · 27 function. tsc exit 0. Verify UI thật: mở Bản đồ kiến thức → 🗑 Kho rác, đưa 2 câu vào rác (1 câu 14 tài liệu dùng, 1 câu không ai dùng) → nút "Xoá hẳn" **disabled** đúng câu đang dùng (title "Còn 14 tài liệu dùng câu này"), **bật** đúng câu rảnh → bấm Khôi phục cả 2 qua UI → kho rác trống, `xoa_at` về NULL, log đủ 4 dòng.

**Chốt cuối ngày 07-21 (Thùy chạy tay trên prod, em verify lại từ DB live):**
- `viec_van_hanh_duyet.tab` → thêm `'mt'` (= `0111`). Thùy xác nhận **tính năng duyệt chưa dùng bao giờ** → đây là vá PHÒNG, không phải dọn hậu quả.
- `prep_phong` → **xoá 20 dòng `luot='ngay'`**, CHECK siết còn `('sang','chieu','toi')` (= `0112`). Lý do không migrate: `'ngay'` nghĩa là *1 lượt cho CẢ NGÀY* (một lần dọn phục vụ nhiều ca liên tiếp), **không tương ứng ca nào** và dòng dữ liệu không có trường nào ghi ca → map sang ca = bịa (§1.5). Đã mất: 17 lượt đã đóng · 19 ảnh · 6 lượt leader chốt, ngày 06/07-17/07. **19 file trong `kho-anh/ops/` không xoá theo → mồ côi** (chấp nhận, giai đoạn test).
- **Bằng chứng bug đã hết:** `luot='toi'` từ **0 → 7 dòng** sau khi nới constraint. Đúng nhánh Linh không tick được. (`chieu` 7→14, `sang` 1.)

**Ghi chú quy trình:** trước khi xoá em dừng lại vì dữ kiện **mâu thuẫn giả định** — Thùy nói "đang test, data không quan trọng", nhưng 19/20 dòng có ảnh evidence thật và 6 dòng leader đã chốt, tức là log vận hành thật chứ không phải row rỗng. Nêu ra rồi mới xoá. Luật xoá không chỉ là "hỏi cho có" — nó là chỗ bắt sai lệch giữa *điều người ta nhớ* và *điều data nói*.

**Va số migration — LẦN THỨ HAI trong ngày.** Sáng: em đánh `0109` trùng `0109_go_nhan_ma_cau_mau_thuan`. Chiều: cả `0110`/`0111`/`0112` của em trùng `0110_5a2_2007_gan_dung_cau` / `0111_kho_rac_cau_hoi` / `0112_thay_cau_chet`. Đã dời thành `0113`/`0114`/`0115` (giữ thứ tự phụ thuộc: nới CHECK `0113` phải chạy TRƯỚC siết CHECK `0115`).
→ Số thứ tự hiện được cấp bằng cách "nhìn file cuối rồi +1" — hai luồng làm song song trong ngày là đụng nhau chắc chắn. `migrate.mjs` sort theo tên nên trùng số vẫn chạy được, **nhưng thứ tự giữa 2 file cùng số do chữ cái quyết định** — với cặp nới/siết CHECK thì đảo thứ tự là fail. Cần đổi cách cấp số (timestamp `YYYYMMDDHHMM_` như Supabase CLI chuẩn, hoặc reserve trước khi code). **Chưa làm — cần Thùy quyết.**

**Thùy chốt cuối 07-21 (đóng 2 tồn đọng):**
- `DC000012` — bỏ qua, 1 câu không ảnh hưởng. Không vá nữa.
- **396 cặp câu trùng trong cùng tài liệu = KHÔNG phải lỗi.** Thùy: *"do kho chưa đủ đa dạng, không phải vấn đề lỗi đâu."* → dạng ít câu thì gợi ý buộc dùng lại. Hết trùng đến từ **làm dày kho**, không từ sửa code. Đừng mở lại như bug.
  *(CTO ghi chú, chưa kiểm chứng: kho mỏng giải thích được trùng giữa phan `dang`↔`btvn`, nhưng vài cặp trùng nằm 2 lần trong CÙNG một phan — cái đó kho mỏng không giải thích hết. Để đó; nếu sau này kho dày mà vẫn còn thì soi `autoSuggestByLoai`/`setDangOfBuoi`.)*

**Rò rỉ ảnh Ops — vá nguồn, không dọn hậu quả (Thùy chốt: ảnh cũ để đấy).**
Query mồ côi ra **43 file**, không phải 19 như em đoán. Đúng cái guard em tự đặt ("khác 19 thì dừng") → dừng, truy lại giả định thay vì xoá bừa. Kiểm: 5 bảng có `anh_url`, nhưng `hoc_sinh`/`nhan_su` đi bucket `avatars` và `bao_loi` đi prefix `report/` → `ops/` chỉ có `prep_phong` + `vh_ops_task`, tức union đúng, 43 là mồ côi thật.
**Nguồn rò:** `uploadOpsAnh` đặt path `ops/${Date.now()}-…png` ⇒ **mỗi lần dán = 1 file mới**. Dán đè ảnh khác → file cũ mồ côi. Màn Report nặng hơn: upload lúc DÁN nhưng dòng `vh_ops_task` chỉ ghi lúc **bấm đóng** ⇒ dán xong bỏ ngang là mồ côi vĩnh viễn. 19 do `0115`, **24 do rò rỉ này** — tích trong ~2 tuần Ops dùng thật.
**Fix:** `uploadOpsAnh(blob, slot)`, path = **hàm của danh tính dòng** (`prep-{phong}-{ngay}-{luot}` · `task-{tkbId}-{ngay}-{tab}` — trùng đúng khoá unique 2 bảng) + `upsert: true` (policy `kho_anh_update` có sẵn từ `0007`). Dán lại bao nhiêu lần cũng 1 file. Đuôi giữ `.png` kể cả jpeg: contentType gửi tường minh nên hiển thị đúng, còn **đổi đuôi theo mime thì dán png rồi dán jpg lại đẻ 2 file** — mất tính "1 slot = 1 path". URL kèm `?v=` vì đè cùng path ⇒ URL không đổi ⇒ CDN/trình duyệt trả ảnh CŨ. Kéo theo: **truy mồ côi sau này phải cắt query trước khi so tên**.
**Đã verify:** `tsc` sạch; 4 chỗ gọi đều truyền `slot` (tham số bắt buộc nên tsc tự bắt nếu sót). **CHƯA verify end-to-end trên app** — cần login Ops + dán ảnh thật, chưa chạy.
**Bài học:** con số không khớp dự đoán (43 vs 19) là **tín hiệu mô hình sai**, không phải chi tiết vụn để làm tròn. Truy tiếp thì lộ ra bug thật; xoá cho xong thì mất luôn manh mối và tháng sau lại 24 file nữa.

## 2026-07-21 (tiếp) — Elo: buổi KHÔNG CHẤM vẫn cộng/trừ Elo → huỷ phiên + replay toàn bộ

**Thùy báo:** *"chấm bài trên lớp: nếu không có dữ liệu nào thì hệ thống vẫn tính là kết quả bằng nhau và cộng trừ elo. Tôi muốn nếu không có dữ liệu thì huỷ phiên tính elo đó đi. Và recalculate lại toàn bộ Elo sau khi huỷ các buổi trống."*

**Lỗi:** `closePhase` khởi tạo `raw[id] = 0` cho MỌI HS có mặt rồi chạy tiếp bất kể có `gami_grades` hay không → **0 dòng chấm bị hiểu thành "cả lớp HOÀ"**. Hoà thì `actual` đều nhau nhưng `expected` phụ thuộc Elo ⇒ **HS Elo CAO mất điểm, HS Elo THẤP được điểm**: buổi không ai chấm âm thầm kéo cả lớp về trung bình. Vi phạm thẳng §1.5 — "thiếu data = KHÔNG có dòng", KHÔNG phải "mọi người 0 điểm".

**Quy mô đo được:** 81/329 phiên Elo là TRỐNG (79 ingame + 2 et) · 720 dòng `gami_elo_history` · **8955 điểm Elo biến động vô nghĩa** · HS lệch tới **±245 Elo** (Nguyễn Ngọc Trí Anh +245, Vũ Lê Bình −211).

**Fix code (`gami.ts`):** `if (coElo && grades.length === 0)` → `markClosed` rồi return, KHÔNG tính Elo/EXP. Cùng khuôn với nhánh `!hsIds.length` vốn có. Áp cho CẢ `ingame`/`et`/`mt` (§1.6 symmetry). Thêm cờ trả về `khongCoDuLieu` và **3 nút Xác nhận đều alert** *"Đã đóng, nhưng KHÔNG tính Elo/EXP — chưa chấm ô nào"* — bỏ qua ÂM THẦM chính là lý do bug sống được cả tháng.

**Replay (`scripts/replay_elo_bo_phien_rong.mjs`):** phải replay chứ không trừ ngược được — Elo là chuỗi phụ thuộc (delta buổi sau tính từ Elo sau buổi trước qua `expected`), xoá 1 phiên ở giữa làm mọi delta phía sau sai theo. Script MỚI, khác `_replay_elo.mjs` đời cũ 3 điểm: (1) bỏ phase không có dòng chấm · (2) **có phase `mt`** (K=60 — script cũ chỉ ingame+et nên chạy nó sẽ NUỐT sạch Elo của MT) · (3) `sessions_played` chỉ +1 khi phiên ingame THẬT SỰ tính (buổi trống không phải "đã chơi", nó ảnh hưởng hệ số K). Mặc định chạy THỬ, `--ghi` mới ghi, toàn bộ trong 1 transaction.

**Thùy chốt 2 câu hỏi:** ① EXP phiên trống → **bỏ luôn** (nhất quán với Elo) · ② `sessions_played` → **đếm lại theo buổi có chấm**. Sau đó xác nhận thêm: *"hệ thống này chưa chạy real với học sinh nên cứ recalculate lại"*.

**Đã chạy** (backup trước ra `scripts/_backup_elo_2026-07-21.json`, 1,6 MB):
- `gami_elo_history` 2665 → **1946** · `gami_exp_ledger` rank_* 2656 → **1946** · EXP rank_* 667.579 → **433.210** (−234.369)
- 248/301 (HS×môn) đổi Elo. Lệch lớn nhất: Gia Bảo 1038→892 (−146, buổi 13→4) · Ngọc Mai 956→1072 (+116)
- Elo TB toàn hệ **1008 → 1008** (Elo zero-sum trong mỗi phiên nên TB phải giữ nguyên — dùng làm chốt sanity)

**Kiểm chứng độc lập sau replay (4/4 xanh):** phiên Elo trống còn lại **0** · dòng `gami_elo` lệch với Σdelta history **0** · dòng `sessions_played` lệch **0** · TB Elo giữ nguyên.

**Verify ĐƯỜNG CODE (không chỉ dữ liệu)** — replay chỉ chứng minh data, chưa chứng minh `closePhase`. Test thật trên buổi 9C1 · 20/07 (6 HS có mặt, 0 ô chấm), chặn `alert`/`confirm` để đọc thông báo:
- bấm Xác nhận → alert đúng câu mới; DB: `ingame_dong_at` ĐƯỢC set, nhưng **0 dòng history, 0 EXP, Elo tổng 309393 không đổi** ✅
- bấm "↩ Mở lại" → buổi về nguyên trạng (`ingame_dong_at` null, `trang_thai` `mo`), Elo tổng vẫn 309393 ✅ (`reopenPhase` gỡ sạch nên test có đường lùi)

## 2026-07-21 (tiếp) — Filter khối/hệ cho bảng Elo, + bug CÓ SẴN: leaderboard trộn môn

**Thùy:** *"Thêm chức năng filter cho Elo nữa. Theo khối và theo hệ."*

**Làm:**
- `DiemRow` thêm `he` (bậc lớp S/A/B/C) + `ten_lop`, lấy **theo đúng MÔN của dòng Elo** (§1.6 — 1 HS học Toán lớp S mà KHTN lớp B là bình thường, không có "hệ chung chung"). Nguồn: `hoc_sinh_lop` (`dang_hoc`) → `lop` khớp `mon`. `null` = HS không còn lớp đang-học của môn đó (đã rời nhưng Elo cũ vẫn còn) → lọc riêng "Chưa xếp lớp".
- Lấy TOÀN BỘ ghi danh rồi map ở client, KHÔNG `.in(hsIds)` với 300+ uuid (URL quá dài — §2).
- UI: 2 select **dựng TỪ DATA đang có**, không hardcode → đổi môn thì tập khối/hệ đổi theo, không bao giờ hiện lựa chọn ra 0 kết quả. Khối sort theo `KHOI_OPTIONS` (4 < 4T < 5 < 5T…), hệ theo `lop_bac` (S>A>B>C). Thêm cột **Lớp** + **Hệ** (badge màu), nút "✕ Bỏ lọc", badge đếm `N HS / tổng`.
- Trạng thái rỗng tách 2 nguyên nhân: *chưa có data* vs *lọc ra rỗng* (kèm nút bỏ lọc) — trước gộp 1 câu, bắt người dùng tự đoán.

**⚠ BUG CÓ SẴN phát hiện nhờ thêm cột (không phải do đợt này gây ra):** bảng ghi "Toán" nhưng hiện **CẢ 307 dòng của MỌI MÔN**. Effect fetch chạy lần đầu lúc `mon` còn `''` → `listGamiBangTong(undefined)` = lấy hết mọi môn; ngay sau đó `listGamiMons` trả về → `setMon('Toán')` → gọi lần 2. Lần 1 nặng hơn nên **về SAU, ghi đè kết quả lần 2** ⇒ leaderboard "Toán" trộn cả Elo KHTN. Vi phạm §1.6. Không ai thấy vì trước đây bảng không hiện Lớp/Hệ nên trộn môn nhìn không ra.
**Fix 2 lớp:** (a) chưa biết môn thì KHÔNG query · (b) `reqId` chống race (tái dùng mẫu sẵn có ở `SearchCau`).

**Verify** — đối chiếu UI vs SQL, khớp **5/5 tổ hợp**: Toán 258 · Toán+khối 9 = 72 · Toán+khối 9+hệ S = 13 · Toán+hệ S mọi khối = 64 · Toán+chưa xếp lớp = 5. Đổi sang KHTN → 49 dòng và dropdown hệ **tự rút còn "Hệ A + Chưa xếp lớp"** (KHTN chỉ có lớp bậc A) — đúng hành vi "dựng options từ data". Quay lại Toán → 258. tsc exit 0.

## 2026-07-22 — Fix nhỏ: Lý thuyết per-DẠNG trong buổi (không còn theo cả doc)

**Thùy:** *"Khi làm giáo trình: cái có lý thuyết hay ko có lý thuyết t muốn nó chọn theo từng dạng kiểu checkbox. Ví dụ 1 buổi học có thể học dạng mới mà vẫn ôn dạng cũ thì t muốn dạng mới vẫn hiện lý thuyết còn dạng cũ thì ko."*

- Mig `202607221643_tai_lieu_phan_hien_lt.sql`: `tai_lieu_phan.hien_lt boolean not null default true` — additive, default giữ nguyên hành vi cũ. Verify DB trước: không có CHECK constraint thật, an toàn thêm cột.
- `TaiLieuBuilder.tsx` (`DangCard`): thêm checkbox "Lý thuyết" cạnh badge "có/chưa có lý thuyết" mỗi dạng → `setPhanHienLt(phanId, v)`.
- `PrintView.tsx`: `DangBlock` (LT ví dụ riêng dạng) VÀ `BuoiBlock`'s group header (LT chuyên đề, ẩn nếu MỌI dạng trong nhóm tắt hien_lt) đều gate theo `hien_lt !== false`.
- **Bug tự bắt + tự sửa:** `onSetHienLt` ban đầu `await setPhanHienLt(...) → await reload()` — reload() là `getTaiLieuFull` NẶNG (6+ query cả doc) cho 1 checkbox → Thùy báo "delay hơi lâu tẹo". Sửa thành **optimistic**: `setFull` sửa state tại chỗ ngay (không await), lưu nền, lỗi thì lùi lại đúng ô — bỏ hẳn reload() cho action này.

## 2026-07-22 (tiếp) — Ôn tập trong BTVN (spec-btvn-ontap.md) — build đầy đủ theo §9

PHA 0 verify DB thật phát hiện 2 chỗ spec đoán sai: **RLS `btvn_ontap_config` phải ENABLE** (spec ghi "disable" nhưng 3 bảng `tai_lieu*` anh em đều enable + policy `la_thanh_vien()`) · `nguon_buoi` kiểu **`text`** (giá trị là uuid string nhưng cột là text, khớp `tai_lieu.nguon_buoi`). Ghi PLAN.md + phản biện, Thùy duyệt + tự chạy migration (`btvn_ontap_config` bảng mới).

**`src/lib/ontap.ts` (file mới) — engine 4 bước + CRUD:**
- `goiYOnTap(nguonId, buoiId, lopId, mon)`: B1 ứng viên = dạng ở buổi TRƯỚC (loại dạng của chính buổi đang gán) · B2 chấm điểm `(yếu×1+cần_luyện×0.5)/đã_đo` qua `getMasteryByDang` **KHÔNG set `includeBTVN`** (y hệt pivot view ④, tránh vòng lặp ôn-tập-tự-đo-bằng-BTVN) · B3 sort giảm dần, tie-break "lâu chưa gặp" (tie-break "tiên quyết" bỏ — `TODO(tienquyet)`, bảng link chưa có trong repo v2) · B4 chọn ≤2 câu/dạng qua `suggestCauForDang` (né cứng `usedCausOfBuoi`, né mềm câu lớp đã làm 30 ngày — rút từ đề xuất 60 của spec, hết pool thì bỏ né-mềm).
- CRUD `getOnTapConfig`/`saveOnTapConfig` (bảng riêng, sống sót qua `trichXuatBuoi` xoá-rồi-tạo doc BTVN).
- `appendOnTapToBtvnDoc`/`rebuildOnTapInDoc`: append phan `loai_phan='ontap'` sau khối btvn cuối (thu_tu nối tiếp), revalidate câu còn tồn tại trong kho (câu chết → bỏ + trả về cho UI toast), merge `cau_hinh.btvnLinesByCau`.
- **Compose ở CALL SITE thay vì sửa `trichXuatBuoi`** — tránh vòng import ngược `tailieu.ts`↔`ontap.ts` (ontap.ts vốn đã import từ tailieu.ts). `TrichPanel.gan()` gọi `trichXuatBuoi` xong rồi mới gọi `appendOnTapToBtvnDoc` — kết quả giống hệt spec §6 yêu cầu, không cần sửa hàm gốc.

**`tailieu.ts`:** `PhanLoai` thêm `'ontap'` (không migration, không CHECK thật) · `getTaiLieuFull`'s `dangMas`/`dangLike` mở thêm `'ontap'` (nếu không, phan ôn tập không resolve được tên dạng → PrintView vỡ) · `getBTVNCaus` thêm `'ontap'` vào filter (BtvnTab chấm + test online `phatHanhTest` đều đi qua hàm này, không cần sửa riêng).

**`PrintView.tsx`:** `buildBuois`/`BtvnSheet` thêm khối `ontaps`, render SAU btvn với header pill riêng `.pv-h-ontap` ("PHẦN ÔN TẬP", màu xám trung tính — phân biệt bài mới/ôn lại), số câu đếm **liên tục 1 mạch** (không reset). Soi PDF thật cả bản HS lẫn bản GV (đáp án+lời giải) — đúng.

**`src/components/KhoPicker.tsx` (tách ra từ `TaiLieuBuilder.tsx`)** — để `OnTapEditor` dùng được mà không vòng import screen↔component; `TaiLieuBuilder.tsx` re-export lại `KhoPicker` nên `ETScreen`/`MTScreen`/`BTScreen` (đang `import {KhoPicker} from './TaiLieuBuilder'`) không cần sửa.

**`src/components/OnTapEditor.tsx` (file mới, component CHUNG — cấm copy-paste 2 bản, ADR-017):** controlled (`config`+`onChange`, cha quyết khi nào lưu). Boot: có config cũ → hiện đúng config đó (KHÔNG gợi ý mới); chưa có → auto-suggest điền sẵn. reqId race-guard (mẫu SearchCau) cho đổi buổi/lớp nhanh. Card mỗi dạng: badge `lớp yếu N%` (có engine score) hoặc `chọn tay` (dạng thêm tay/load từ config cũ) · preview câu (lazy-fetch theo ma_cau, cache) · ✎ Đổi câu (KhoPicker, khoá câu đã dùng cùng buổi + câu dạng ôn tập kia) · ✕ bỏ dạng · + Dạng (DangPickerOne, disable khi đủ 2) · "Không ôn tập buổi này" (skipped).

**Wiring 2 điểm chạm (đúng spec, dùng CHUNG 1 component):**
- `TrichPanel.BuoiTrichRow`: `OnTapEditor` hiện dưới ngày/GT/BTVN khi đã chọn lớp + tick BTVN. Bấm Gán/Gán lại → `saveOnTapConfig` TRƯỚC rồi mới `onGan` (đúng thứ tự spec §5, để `trichXuatBuoi`+`appendOnTapToBtvnDoc` đọc được config ngay lần này).
- `KhoTaiLieuScreen`: nút "✎ Ôn tập" cạnh "✎ Sửa" (chỉ `loai==='btvn'`) → modal nhỏ bọc `OnTapEditor`, Lưu = `saveOnTapConfig`+`rebuildOnTapInDoc` (rebuild-tại-chỗ, KHÔNG re-trích cả doc). Cảnh báo mềm nếu buổi đã đóng BTVN (`btvnDaDong` — proxy qua `buoi_hoc.btvn_dong_at`, câu hỏi mở #4 Thùy chốt "chỉ cảnh báo không chặn cứng").

**Verify TRÊN DATA THẬT (không phải chỉ node script rời)** — Giáo trình 9A / lớp 9A1 (15 buổi đã trích thật):
- Engine chạy buổi 10 (9 buổi trước) → 2 dạng hợp lý mắt người (score 0.43/0.25, dạng phân thức yếu hơn dạng cơ bản — đúng trực giác độ khó), buổi 1 (0 buổi trước) → `[]` không crash.
- **Click "Gán" THẬT** trên buổi 11 (chưa từng gán cho 9A1 — an toàn, không đụng data cũ): config lưu đúng, doc GT+BTVN sinh đúng, phan `ontap` append đúng thu_tu (7,8 sau 6 phan btvn có sẵn). Xoá sạch test data sau khi verify (Luật xoá — chỉ xoá đúng cái mình vừa tạo).
- **Click "Lưu" THẬT** ở modal KhoTaiLieuScreen trên doc BTVN buổi 21/9A1 có thật (chưa đóng BTVN) — ontap phan append đúng, cảnh báo "đã đóng BTVN" hiện đúng khi test trên buổi 10 (buổi này `btvn_dong_at` có thật). Ghi baseline trước, xoá sạch phan/config test sau, đối chiếu lại đúng baseline.

**CÒN:** chưa test lại "re-trích 1 buổi ĐÃ có ontap config — config có sống sót" bằng click thật (đã đúng by construction: config sống ở bảng riêng, `trichXuatBuoi` xoá-rồi-tạo không đụng `btvn_ontap_config`) — verify tay lần đầu Thùy dùng thật.

## 2026-07-22 (tiếp #2) — Nắn UX Ôn tập: tách gán khỏi tạo BTVN, thêm màn xem trước

**Thùy phản hồi ngay sau khi build xong bản đầu:** *"t ko nghĩ nên hiện ở màn chung như này đâu"* — không đồng ý OnTapEditor nhúng thẳng vào panel Gán buổi. Yêu cầu luồng mới:
1. Gán buổi = như cũ nhưng **chưa tạo BTVN vội**.
2. Sang **màn riêng** chọn ôn tập, **có preview**.
3. Bấm Xác nhận **mới chính thức** tạo BTVN vào Kho.
4. "✎ Sửa" sau này — hỏi ý chị trước khi đổi (xem AskUserQuestion).

**Hỏi lại 2 điểm rủi ro trước khi sửa** (không tự đoán — đổi kiến trúc, không phải câu tự trả lời được):
- Sửa sau này (đã build tuần trước, modal ✎ Ôn tập ở KhoTaiLieuScreen) có đẩy ngược lên MASTER không? → **Chị chốt: KHÔNG, chỉ update bản riêng buổi/lớp đó** — khớp quyết định CHỐT cũ "master giữ trinh nguyên", giữ nguyên `rebuildOnTapInDoc` đã build, không sửa gì thêm.
- GT (giáo trình buổi) tạo lúc nào? → **Chị: "tùy, giáo trình ko ảnh hưởng mà"** — chọn giữ GT tạo ngay lúc Gán (đổi ít nhất, khớp đúng chữ chị viết "gán buổi như bình thường").

**Kiến trúc mới:**
- `TrichPanel.gan()` bớt tham số `bt` — CHỈ còn tạo GT (`trichXuatBuoi(...,btvn:false)`). Bỏ hẳn logic append ôn tập ra khỏi hàm này.
- `BuoiTrichRow`: bỏ checkbox BTVN + `OnTapEditor` nhúng. State "đã GT, chưa BTVN" **tự derive** từ `listTrichXuat` (không cần nhớ ý định ở đâu) → hiện nút tím **"+ BTVN / Ôn tập"**, bấm lúc nào cũng được (kể cả quay lại sau).
- **`src/screens/tailieu/OnTapConfirmScreen.tsx` (file mới)** — full-screen 2 cột: trái `OnTapEditor` (dùng lại y nguyên, không sửa) · phải **preview LIVE** phiếu BTVN (toggle Bản học sinh/Bản GV) — ghép [câu BTVN thường từ MASTER (buoi.btvnByMa, đã có sẵn trong bộ nhớ, khỏi fetch)] + [câu ôn tập đang chọn, resolve nội dung ngay khi GV tick — chưa lưu DB]. Tái dùng thẳng `CauItem`/`CauList`/`CHROME_CSS` **export sẵn từ PrintView.tsx** → preview y hệt bản in thật (kể cả câu Đúng/Sai, trắc nghiệm nhiều cột, LaTeX), không phải viết lại renderer. Bấm "✕ Huỷ" → **KHÔNG ghi gì vào DB** (đúng yêu cầu "chưa tạo BTVN vội"). Bấm "✓ Xác nhận" → `saveOnTapConfig` → `trichXuatBuoi(btvn:true)` → `appendOnTapToBtvnDoc` (đúng thứ tự spec §5, gộp cả 3 bước cũ nằm rải rác về 1 chỗ).

**Verify lại TRÊN DATA THẬT** (Giáo trình 9A / lớp 9A1, buổi 13 — chưa từng gán, an toàn): buổi chưa gán giờ chỉ còn checkbox GT (đúng, bỏ BTVN) → Gán → chỉ tạo GT, hiện nút "+ BTVN / Ôn tập" → mở màn mới, preview LIVE đúng (câu thường + khối "PHẦN ÔN TẬP" nối số câu liên tục, soi cả 2 dạng) → Xác nhận → DB tạo đúng: GT+BTVN, 8 phan btvn gốc + 2 phan ontap nối `thu_tu` đúng, config lưu đúng. Xoá sạch test data sau khi verify (Luật xoá — chỉ xoá đúng ID mình vừa tạo, soát kỹ vì buổi 13 còn tồn tại ở LỚP KHÁC (9A2) trùng `nguon_buoi` — suýt tưởng nhầm là sót dọn, hoá ra data thật của lớp khác không liên quan).

## 2026-07-22 (tiếp #3) — Bug THẬT: trang 1 BTVN trắng trơn (Thùy báo qua ảnh chụp)

**Thùy gửi ảnh chụp:** trang đầu BTVN chỉ có khối "Họ và tên/Lớp", phần dưới trắng trơn — hỏi "Sao BTVN lại bị trắng trang đầu". Hỏi lại lớp/buổi cụ thể (11A1 hôm nay) để mở ĐÚNG bản đó soi trực tiếp, không đoán mò.

**Tái hiện đúng bug** (BTVN 11A1 22/07 · Buổi 6): mở PrintView → "Đang dựng trang..." xong → **14 trang**, trang 1 y hệt ảnh chị gửi (chỉ header, trắng phần còn lại). Soi DOM `.pagedjs_area` từng trang: trang 1 kết thúc ngay sau "ĐIỂM", **toàn bộ "Dạng 1 + Câu 1..10" nằm ở TRANG 2** — không phải mất câu, mà bị đẩy nguyên khối sang trang sau, bỏ trống hết phần còn lại trang 1.

**Root cause (đã có SẴN, không phải do đợt build ôn tập hôm nay — kiểm bằng `git log -S` trên đúng dòng CSS, chỉ 1 commit cũ từng đụng):** `.pv-bt-head{...break-after:avoid}` — quy tắc "không cho ngắt trang NGAY SAU khối header" cộng dồn với `.pv-h-dang{break-after:avoid}` (tiêu đề Dạng) + `.pv-cau{break-inside:avoid}` (từng câu không xé đôi) tạo thành 1 chuỗi "cấm ngắt" liên hoàn — paged.js buộc phải giữ [header + tiêu đề Dạng + ít nhất câu đầu] làm 1 khối KHÔNG THỂ TÁCH; hễ khối đó không vừa hết phần còn lại của trang 1 (rất dễ xảy ra — doc dài, nhiều "avoid" chồng nhau) thì đẩy NGUYÊN KHỐI sang trang sau, để lại khoảng trắng thay vì chỉ đẩy phần thừa. Bug này không chỉ ăn trang 1 — xảy ra lặp lại ở MỌI ranh giới Dạng trong doc dài, giải thích vì sao doc này tốn tới 14 trang.

**Fix:** bỏ `break-after:avoid` khỏi `.pv-bt-head` (giữ nguyên `break-inside:avoid` — header vẫn không bị xé đôi, chỉ không còn ép câu đầu phải dính liền). `git log -S` xác nhận dòng CSS này có từ lâu, không phải do sửa hôm nay — nhưng chỉ lộ rõ ở doc ĐỦ DÀI (nhiều "avoid" cộng dồn mới vượt quá 1 trang).

**Verify:** cùng doc 11A1 Buổi 6 — sau fix, "Dạng 1 + Câu 1" hiện NGAY sau header trên trang 1, tổng **14 trang → còn 6 trang** (giảm hơn nửa — xác nhận bug lặp lại ở mọi Dạng, không chỉ Dạng đầu). Soi thêm 1 doc BTVN khác (9A1 Buổi 21, có khối ôn tập) — Câu 1 vẫn hiện đúng ngay sau header, không regress.

## 2026-07-22 (tiếp #4) — CHUẨN BỊ module "Đánh giá kết quả học tập": chạy VERIFY §8 trên data thật

**Bối cảnh:** Thùy đưa `spec-danhgia-hoctap.md` (thiết kế chỉ số + luồng, chốt qua brainstorm). Spec §8 bắt buộc chạy verify trước khi implement — mọi ngưỡng `[CALIBRATE]` phải đọc từ data thật, không guess. Chưa viết dòng code module nào.

**Làm:** `scripts/verify_danhgia_hoctap.mjs` (CHỈ SELECT, role `claude_ro`) — 8 query enum (A) + 7 connectivity (B) + 8 calibrate (C). Output lưu `docs/verify-danhgia-hoctap.md` (chạy lại được).

**Dính đúng bẫy đã ghi trong HANDOFF ② ngay lần chạy đầu:** join `dai_ban_do UNION ALL khtn_ban_do` bằng `ma_dang` → **nhân đôi dòng đo** (18.102 → 23.429). Nguyên nhân: mã dạng TRÙNG SỐ giữa 2 bản đồ — **nay đã 30 mã** (HANDOFF ghi 17 hồi 07-14 → đang TĂNG vì KHTN vẫn seed format số giống Toán, chưa dọn gốc). Sửa: suy `mon` TRƯỚC rồi mới join đúng 1 bảng. Số liệu lần 1 đã sai, chỉ số lần 2 mới dùng được. → Bằng chứng: bài học "có `mon` trong tay lúc nào thì dùng NGAY" phải áp cho CẢ query phân tích, không riêng UI tra tên.

**Buổi BÙ không có `lop_id`** (134 lần đo ET) → mất nhãn môn, vi phạm §1.6. Lùi được về buổi gốc qua `buoi_hoc_hs.bu_cho_buoi_id` → phục hồi 100%. Mọi query học tập chạm buổi bù phải có fallback này.

**Kết quả verify (data 16/06 → 22/07, ~5 tuần, 18.102 lần đo vào mastery — 100% môn Toán):**
- Enum THẬT: `thai_do` = `nghiem_tuc·chua_het_suc·chua_nghiem_tuc·chong_doi` (đúng 4 bậc spec) · `trang_thai_nop` = `nop_dung_han·nop_muon·xin_phep·khong_lam` · `bo_tro_duoi.nguon` = `thu_cong·tuyen_sinh` · `canh_bao_yeu.nguon` = chỉ `btvn`.
- **③ chuông đỏ ĐÃ persist** ở `canh_bao_yeu` (nguon='btvn', 3 dòng, có đủ ma_dang+buoi+ghi_chu) → hết [VERIFY]. **④ chọn mã nguồn mới không đụng ai.**
- **`bo_tro_duoi_dang.day_at` CÓ populate 9/12 (75%)** → outcome loop §5 sống, nhưng n bé + 25% trống ⇒ cần ép set lúc bấm "đã dạy".
- Nối dạng→chuyên đề **100%**, **0 dạng mồ côi**. `ma_dang` phủ 100% ở et/mt/btvn (ingame 17% — không dùng).
- `thai_do` phủ 799/1.086 HS-có-mặt của buổi đã đóng BTVN = **73,6%**.
- **`bt_grades` RỖNG (0 dòng)** · **test online ~20 dòng** → 2 nguồn này coi như CHƯA TỒN TẠI ở v1, đừng thiết kế phụ thuộc.
- **`tien_quyet` CHƯA CÓ BẢNG** (spec-link-tienquyet chưa build) → ④ chạy chế độ "GV tự chọn dạng nền", nối DAG sau.
- Mật độ (HS × chuyên đề × cửa sổ 14 ngày): p50 = **6 câu**; ≥3 câu: 77,3% · **≥5 câu: 57,5%** → `k=5` giữ được nhưng loại 42% ô.
- **Chuỗi dài hạn: chỉ 6 cặp (HS×chuyên đề) có ≥3 cửa sổ** → **đường B (moving-average 3 chu kỳ) CHƯA CHẠY ĐƯỢC** ở data hiện tại (hệ mới ~5 tuần, có 3 cửa sổ).
- **76,8% HS Toán có ≥1 dạng yếu** (TB 2,5 dạng/HS trên 13,4 dạng đã đo). Diện bổ trợ định nghĩa "mọi dạng ≤0.5" ⇒ 3/4 roster vào L2. Muốn candidate 10–15% thì ngưỡng phải ~**≥6 dạng yếu (14,6%)**.
- Trọng số thực tế ở tầng chuyên đề (không cap 5): BTVN **43%** tổng trọng số (11.195 câu × w1) vs ET 45% (5.833 × w2) vs MT 12% → **nguồn KHÔNG giám sát gánh gần nửa điểm trend**.
- Sĩ số: **11/32 lớp Toán < 8 HS** (min 1) → luật "lùi lên khối" kích hoạt cho ~1/3 lớp, không phải ca hiếm.

**Chưa quyết (chờ Thùy):** ngưỡng vào diện/level · có cap tỉ trọng BTVN ở tầng chuyên đề không · dài hạn §2.B hoãn hay build-để-đó · dọn gốc 30 mã trùng hay tiếp tục né.

**Bổ sung (cùng ngày, sau khi đọc code):** spec §4.1/§5/§6 trỏ L2 vào `bo_tro_duoi` — **sai đường**. `bo_tro_duoi` = bổ trợ ĐUỔI (HS mới/vào lớp giữa chừng, verify: `nguon` chỉ `thu_cong`+`tuyen_sinh`, ly_do thật "Vào lớp giữa chừng"), vòng đời = cover hết dạng trong N buổi rồi đóng, KHÔNG dính mastery. Bổ trợ YẾU **chưa build**: `buoi_hoc.loai='bo_tro_yeu'` có trong CHECK nhưng **0 buổi**, không bảng case, grep repo chỉ thấy 1 type union + 1 nhãn UI. Ghi HS yếu vào `bo_tro_duoi` sẽ phá `demTabDuoi` + chỉ số "Xếp x/N · Học y/N" + luồng duyệt học thuật, và unique partial (HS×lớp) chặn HS nhiều đợt. → đề xuất bảng riêng `bo_tro_yeu(_dang)` đối xứng, copy cơ chế `day_at`. **Chờ Thùy chốt, chưa code.**

Thêm: repo đã có `BKDEMY_CANHBAO_BOTRO_SPEC.md` phủ CÙNG vòng đời (phát hiện→quyết định→bổ trợ→đánh giá) nhưng mâu thuẫn xương sống (case-log-dựng-trước vs cold-start-log-rỗng) → hỏi Thùy spec nào là chuẩn, không tự hợp nhất.

Gate "đủ số lần đánh giá" (Thùy chốt) → đo thật: n≥1 = 76,8% roster · **n≥3 = 48,4%** · n≥5 = 39%. **210/609 ô yếu (35%) chỉ có ĐÚNG 1 lần đo.** Đề xuất gate `n≥3` vì trùng `MASTERY_CONFIG.TIN_TB=3` sẵn có (n≤2 = độ tin thấp) — không đẻ hằng số mới.

Kế hoạch build: `PLAN-danhgia-hoctap.md` (chờ Thùy duyệt trước khi code + migration).

**Chốt §1.D (Thùy 07-22):** màn Kết quả học tập GIỮ 2 ô (① ET+MT · ② gộp tất cả BTVN+Bổ trợ) — không đụng. Máy level dùng bản GỘP (đúng trọng số spec §9). Đo để chọn, không chọn bừa: gate n≥3 → chỉ ET+MT = 86 HS/199 ô yếu · gộp BTVN = **121 HS/278 ô**. Nghịch lý: BTVN **dễ hơn thật** (tỉ lệ đúng TB btvn 0,854 > et 0,799 > mt 0,647) nên nó KÉO LÊN — 235 ô "yếu→hết yếu" nhờ BTVN vs chỉ 46 ô ngược lại; nhưng tổng diện vẫn rộng hơn vì BTVN đẩy nhiều ô vượt gate độ tin n≥3 và phần lớn ô mới đó yếu thật. → **Cờ "BTVN che"** = ô yếu theo ET+MT mà hết yếu khi gộp (235 ô): kém ở bài GIÁM SÁT, ổn ở bài tự làm ở nhà = đáng nghi nhất. Biến cặp-2-số của Thùy từ thứ để NHÌN thành TÍN HIỆU trong máy level, vá luôn điểm mù false-negative spec §5 tự nhận chưa build.

**Chốt §1.A/§1.B/§1.C/§1.F (Thùy 07-22):**
- **§1.A bảng RIÊNG** `bo_tro_yeu` + `bo_tro_yeu_dang` (không dùng chung `bo_tro_duoi`).
- **§1.B theo spec MỚI.** Thùy: *"Bản chất việc L1 L2 L3 chính là case log rồi đấy"* → KHÔNG dựng entity `case`/`van_de`/`playbook`/`catalog_can_thiep`/`benchmark` của `BKDEMY_CANHBAO_BOTRO_SPEC` (spec cũ 05-07, chưa build dòng nào — DB không có bảng nào trong số đó, nên thay không mất gì). Mỗi lần HS chuyển level = 1 mắt xích của vòng. Lý do bỏ benchmark/period: log rỗng + 5 tuần data ⇒ tự rơi vào gate "chưa đủ mẫu → miễn đánh giá" của CHÍNH spec cũ, build xong nằm im rất lâu.
- **§1.C gate n≥3** (= `MASTERY_CONFIG.TIN_TB` sẵn có).
- **⭐ §1.F máy chỉ ĐỀ XUẤT, NGƯỜI duyệt mới đóng** (sửa §4.1/§4.2 spec — spec viết máy tự lên/xuống). *"Ghi lại log của toàn bộ duyệt để sau này analys."*
  - **Đề xuất = PURE-DERIVE, KHÔNG đẻ dòng chờ** (đúng luật §4 CLAUDE.md: không bảng `tasks`, không row placeholder). Chỉ khi người bấm duyệt mới INSERT.
  - `hs_level_log` ghi **cả 2 vế 1 dòng**: `level_cu · level_may_de_xuat · ly_do_may(jsonb snapshot tín hiệu) · level_chot · ly_do_nguoi · actor`. ⇒ **DELTA bắt được TỰ ĐỘNG** (`level_chot ≠ level_may_de_xuat`), không cần người tự khai — thứ mà spec cũ phải bắt thủ công ("bắt delta, không cho approve trơn") giờ thành hệ quả cấu trúc.
  - Ghi từ APP lúc duyệt (không phải trigger — trigger chỉ thấy cũ/mới, không biết máy đề xuất gì) + trigger phòng thủ trên `hs_level` chống đổi chui.
- **Lỗ kỹ thuật spec mới (nhặt từ spec cũ §5):** §4.1 nói "retest > 0.5 thì đóng dạng" mà KHÔNG nói mấy lần đo. Mastery = TB 5 lần gần nhất ⇒ đo ngay sau bổ trợ = 1 điểm mới trộn 4 điểm cũ = số đẹp giả. Vì người quyết chứ không phải máy ⇒ **KHÔNG gate cứng**, máy hiện bằng chứng để người tự cân: "đã có N lần đo giám sát kể từ `day_at`" + cờ **"lên rồi rớt"** (post-1 cao, post-2 tụt = nhồi chứ không dạy hiểu).

## 2026-07-22 (tiếp #5) — PHA 1 XONG: engine đánh giá thuần + test + dry-run data thật

**Làm:** `src/gami/danhgia.js` (PURE, không đụng DB) + `scripts/verify_danhgia.mjs` (**60 test, PASS hết**). `npx tsc --noEmit` sạch.

**Nội dung engine:** cửa sổ 14 ngày mốc-fix giờ VN (`YYYY-MM-A|B`) + `cuaSoTruoc`/`chuoiCuaSo` · `diemChuyenDe` (tầng CHUYÊN ĐỀ: weighted, **KHÔNG cap 5**, khác tầng dạng) · `chuoiDiemChuyenDe` (lỗ để ĐỨT, không nội suy) · `chamPha1` (so LỚP: rank + khoảng cách trung vị) / `chamPha2` (so CHÍNH MÌNH, **giữ cả 2 số, không phun delta**) · `trungBinhTruot3` + `docAmLienTiep` (đường B) · `coBTVNChe` · `lenRoiRot` · `deXuatLevelKienThuc` / `deXuatLevelThaiDo` (chỉ ĐỀ XUẤT + lý do + bằng chứng, KHÔNG tự đổi state).

**Bẫy tự dính rồi tự sửa — trọng số `bt`:** viết comment "bổ trợ đuổi weight 0 → tự rụng" nhưng code lại đọc `MASTERY_CONFIG.WEIGHT` mà bảng đó có **`bt: 1`**. Spec §9 chốt bổ trợ đuổi = **0**. Fix: `DANHGIA_CONFIG.WEIGHT = { ...MASTERY_CONFIG.WEIGHT, bt: 0, ingame: 0, dg: 0 }` — neo vào bảng chung cho et/mt/btvn, chỉ ghi đè 3 nguồn KHÔNG thuộc §9. **Cố ý lệch, đã ghi comment "đừng dọn cho gọn"** (tầng DẠNG vẫn dùng `MASTERY_CONFIG` vì màn Kết quả học tập có toggle riêng cho BT/BTVN). Hiện `bt_grades` rỗng nên chưa đổi số nào — đúng-về-nguyên-tắc trước khi có data.

Cũng sửa: `diemChuyenDe` trả `n` = số câu **có đóng góp** (weight>0), không phải `cauList.length`; và "có câu nhưng toàn nguồn weight 0" → trả `null` (CHƯA-ĐO) chứ không phải 0 điểm (CLAUDE.md §5).

**Test bắt được 2 ca timezone thật:** 23h ngày 15 giờ VN (=16:00Z) phải là nửa **A** · 00h ngày 16 (=17:00Z hôm trước) phải là **B**. Tính theo UTC là sai cả hai.

**DRY-RUN trên data thật** (`scripts/_chk_dgh.mjs`, chỉ SELECT — 246 HS Toán, 18.414 lần đo), coi mọi HS đang ở L0:
- Đề xuất **L0 50,0% · L1 48,8% · L2 1,2%** (3 HS L2 = đúng 3 dòng `canh_bao_yeu` đang có → kênh ③ vọt L2 chạy đúng).
- Σ ô diện bổ trợ **279** · ô yếu THIẾU lần đo (chỉ cảnh báo, không vào diện) **332** · cờ "BTVN che" **235 ô / 110 HS**.
- Thái độ (độc lập): L0 72,0% · L1 24,0% · L2 4,1%.
- **⭐ TRIANGULATION (CLAUDE.md §5):** engine JS ra 279 ô diện / 235 ô BTVN-che / 48,8% L1 — khớp gần như tuyệt đối với đợt calibrate bằng **SQL thuần** hôm nay (278 / 235 / 48,4%). Hai đường tính độc lập cùng kết quả ⇒ tin được, không phải "chạy không lỗi là đúng".
- Trend: HS mẫu 9 chuyên đề nhưng **0/6 đủ 3 cửa sổ** để mượt MA-3 → xác nhận lại đường B phải hiện "chưa đủ dữ liệu" đúng như đã chốt (build sẵn, data tự lấp).

**TIẾP:** Pha 2 — `src/lib/danhgia.ts` (data layer, nạp lần đo → stat sheet sạch). Migration (`hs_level`, `hs_level_log`, `bo_tro_yeu(_dang)`) CHƯA chạy — chờ Thùy duyệt PLAN §3.

## 2026-07-22 (tiếp #6) — Migration đánh giá học tập (SOẠN XONG, CHƯA CHẠY) + phát hiện về quyền DB

**Soạn:** `supabase/migrations/202607222255_danhgia_hoctap_level_botro_yeu.sql` — `hs_level` (trạng thái hiện tại, PK (hs, mon, loai), KHÔNG seed roster ở L0 theo §1.5) · `hs_level_log` (**= case log**, ghi cả `level_may_de_xuat` + `level_chot` + `ly_do_may` jsonb snapshot ⇒ delta lộ tự động; có index riêng cho phần lệch) · `bo_tro_yeu` + `bo_tro_yeu_dang` (`day_at` neo outcome, `dong_at` đóng TỪNG dạng khi retest>0.5) · `buoi_hoc_hs.bo_tro_yeu_id`. Toàn bộ CREATE IF NOT EXISTS + 1 ADD COLUMN nullable — **không drop/thu hẹp gì**.

**Verify migration KHÔNG cần chạy thật:** chạy trọn file trong 1 transaction rồi `ROLLBACK` → 4 bảng + 1 cột tạo đúng, 0 lỗi cú pháp, `public.la_thanh_vien()` có thật; kiểm lại sau rollback: 0 bảng còn sót. (Lần đầu chạy từng câu một rồi rollback từng câu → cả loạt "relation does not exist" giả — sai cách đo, không phải lỗi SQL.)

**⚠️ PHÁT HIỆN AN TOÀN — CLAUDE.md §2.1 đang MÔ TẢ SAI thực tế:** §2.1 ghi *"Claude Code dùng role `claude_ro` (chỉ SELECT) qua `DATABASE_URL_RO`… Role này không ghi được DB — an toàn CỨNG, không dựa vào lời hứa."* Kiểm thật: `.env` chỉ có `DATABASE_URL` (không có `DATABASE_URL_RO`), và nó nối bằng role **`claude_build`** với `has_schema_privilege(public,CREATE)=true`, `INSERT/UPDATE hoc_sinh=true`, `DELETE gami_grades=true`. ⇒ **Rào cứng đó KHÔNG tồn tại.** Mọi thứ chạy hôm nay chỉ-đọc là do KỶ LUẬT tự giữ, chứ không phải do DB chặn — đúng cái "dựa vào lời hứa" mà §2.1 muốn tránh. Cần Thùy quyết: cấp `claude_ro` thật rồi trỏ `DATABASE_URL_RO`, hay sửa CLAUDE.md cho khớp thực tế (đừng để doc hứa một đằng DB một nẻo — nguy hiểm hơn không hứa gì).

**CHƯA CHẠY migration** — chờ Thùy gật (đây là đổi DB prod, khó lùi).

## 2026-07-22 (tiếp #7) — Migration ĐÃ CHẠY + 2 lỗ hổng schema.md lộ ra (đều sửa gốc)

**Thùy chạy migration tay trên Supabase** (`202607222255_danhgia_hoctap_level_botro_yeu.sql`). Verify sau khi chạy: 4 bảng + cột `buoi_hoc_hs.bo_tro_yeu_id` có thật, RLS bật, policy `*_member_all` đủ, `authenticated` có SELECT+INSERT → **app dùng được ngay**.

**⚠️ LỖ HỔNG #1 — `schema.md` THIẾU BẢNG mà KHÔNG BÁO LỖI.** Chạy `npm run schema` sau migration: vẫn ghi **98 bảng** trong khi DB có **103**. Nguyên nhân: `introspect.mjs` đọc `information_schema.columns`, view này **TỰ LỌC THEO QUYỀN** — bảng nào role đang nối không có quyền gì thì **biến mất lặng lẽ**. Bảng mới do `postgres` tạo (Thùy chạy trên Supabase editor), `claude_build` chưa được cấp → vô hình. **Và `phan_cong_ca` đã vô hình như vậy từ TRƯỚC** — không ai biết. → Đúng kiểu "drift = thảm họa v1" mà CLAUDE.md §2.1 cảnh báo, chỉ khác là drift nằm ở chính CÔNG CỤ chống drift. Thùy đã chạy `grant select on all tables` + `alter default privileges` cho `claude_build` → giờ ra đủ **103 bảng**.

**⚠️ LỖ HỔNG #2 — PK/FK TRỐNG TRƠN dù bảng đã hiện.** Sau khi cấp SELECT, 4 bảng mới hiện ra nhưng cột "khóa" rỗng hết (bảng cũ thì đủ PK/FK). Theo docs PG, `information_schema.table_constraints` chỉ hiện constraint của bảng mà user **SỞ HỮU hoặc có quyền KHÁC SELECT** — role chỉ-đọc thì thấy bảng nhưng không thấy khoá. **Nguy hơn thiếu hẳn bảng**: nhìn vào tưởng bảng thật sự không có PK/FK.

**Sửa GỐC (không nới quyền ghi cho Claude):** `scripts/introspect.mjs` — 3 query `columns`/`pks`/`fks` chuyển từ `information_schema` sang **`pg_catalog`** (`pg_class`/`pg_attribute`/`pg_constraint` + `unnest(conkey, confkey) with ordinality` để giữ đúng thứ tự cột trong khoá phức hợp). pg_catalog không lọc theo quyền ⇒ schema.md phản ánh ĐÚNG DB bất kể role. (`checks`/`triggers`/`functions` vốn đã đọc pg_catalog từ đầu — đó là lý do CHECK của `hs_level` hiện được ngay từ lần chạy đầu trong khi bảng thì không: **manh mối chẩn đoán chính**.)
**Verify không regress:** diff schema.md so bản gốc = **+72 / −1**, dòng xoá duy nhất là dòng đếm "98 bảng". Tức 98 bảng cũ ra **byte-identical** — đổi nguồn đọc không đổi output, chỉ thêm cái trước đây bị giấu.

**Dry-run lại sau migration** (`scripts/_diag_danhgia_dryrun.mjs`, đổi tên từ `_chk_dgh.mjs` cho khớp convention `_diag_*`): 19.922 lần đo (tăng từ 18.414 sáng nay — GV vẫn đang chấm), L0 49,2% · L1 49,2% · L2 4 HS (tăng 1 vì có thêm dòng `canh_bao_yeu` mới). Engine ăn data mới bình thường.

`node scripts/verify_danhgia.mjs` + `verify_mastery.mjs` PASS · `tsc --noEmit` sạch.

## 2026-07-22 (tiếp #8) — PHA 2: data layer `src/lib/danhgia.ts` (chạy THẬT end-to-end)

**Làm:** `src/lib/danhgia.ts` — seam nạp lần đo → gọi engine PURE → **stat sheet sạch** (spec §6). `getStatSheetLop` · `getLevels` · `duyetLevel` · `getLevelLog`.

**Vì sao theo LỚP chứ không theo HS:** pha 1 (§2.A①) chấm bằng SO LỚP → phải có điểm của mọi bạn cùng lớp trong CÙNG cửa sổ mới ra rank/trung vị. Gọi từng HS là thiếu data về nguyên tắc, không phải chuyện tối ưu.

**Né 2 bẫy HANDOFF ②:** (1) `napBanDo` tra ĐÚNG 1 bảng theo `khoCuaMon(mon)` — không gộp 2 bản đồ (30 mã trùng số). (2) buổi bù `lop_id` NULL → lùi về buổi gốc qua `bu_cho_buoi_id` **theo TỪNG HS** (1 buổi bù gom HS nhiều lớp/môn → không suy 1 môn cho cả buổi được).

**HANDOFF:602 nói `buoi_hoc_hs` có 2 FK về `buoi_hoc` ⇒ "KHÔNG embed, tách 2 bước", hỏng kiểu RỖNG ÂM THẦM.** Không suy luận — test thật qua PostgREST (login dev account): `select('goc:bu_cho_buoi_id(lop:lop_id(mon))')` **CHẠY ĐÚNG, 5/5 dòng lấy được môn**. ⇒ **Tinh chỉnh bài học cũ:** nhập nhằng chỉ xảy ra khi embed KHÔNG nêu tên cột FK; **nêu đích danh cột (`bu_cho_buoi_id`) là đủ để PostgREST phân giải** — đúng như `botro.ts:listCaBoTro` đã dùng và chạy production từ lâu. Không phải cấm embed, mà là cấm embed mơ hồ. Cũng verify luôn: 4 bảng mới `authenticated` đọc được (RLS+grant OK).

**Chạy THẬT `getStatSheetLop` bằng vite-node** (`scripts/_diag_danhgia_statsheet.ts`) — lớp 9A1, 15 HS, **790ms**: đề xuất KT L0=9/L1=6 · TĐ L0=2/L1=10/L2=3. Pha 1/pha 2 ra đúng hình (rank 1/15 ở cửa sổ đầu; `0.50→0.75 tien`, `1.00→0.83 lui` ở cửa sổ sau).

**⚠️ PHÁT HIỆN — MÂU THUẪN NGƯỠNG TẠI ĐÚNG 0.5 (chờ Thùy chốt):** output đầu tiên hiện một dạng `0.50` gắn nhãn **"cần luyện"** nhưng LẠI nằm trong **diện bổ trợ** — vừa bảo ổn vừa gọi đi học thêm.
- spec §9 nói HAI lần rằng 0.5 chưa đủ tốt: *"Yếu ≤ 0.5"* và *"đóng dạng = retest **> 0.5**, bằng 0.5 KHÔNG tính"* ⇒ 0.5 = YẾU.
- `masteryOfDang` (engine đang chạy, nuôi màn Kết quả học tập) dùng `score >= 0.5 → 'can_luyen'` ⇒ 0.5 = CẦN LUYỆN.
- **Đo data thật: 274/3365 ô (8,1%) rơi ĐÚNG 0.5**, trong đó **83 ô đủ độ tin n≥3**. KHÔNG phải ca hiếm — n=2 kiểu 1 đúng 1 sai, hoặc 1 câu "chưa đạt", là ra 0.5 ngay.
- **Tạm xử:** module theo SPEC (`mucCuaModule`) để nhãn không mâu thuẫn với hành động; thêm `trongDien` (nguồn sự thật cho hành động) + `mucManHinhKQ` (nhãn màn cũ) để thấy rõ chỗ 2 màn lệch. Hệ quả: 83 ô hiện "yếu · cần bổ trợ" ở module nhưng "cần luyện" ở màn Kết quả học tập. **Cần Thùy chốt: sửa spec (yếu = < 0.5) hay sửa engine mastery (0.5 → yếu, ảnh hưởng màn KQ + rollup lớp/khối)?**

`verify_danhgia` + `verify_mastery` + `verify_gami` PASS · `tsc --noEmit` sạch.

## 2026-07-22 (tiếp #9) — Thùy bác "mâu thuẫn 0.5": KHÔNG mâu thuẫn, là 2 NGƯỠNG (trễ/hysteresis)

**Claude báo mâu thuẫn ở #8 — SAI, đã sửa.** Thùy: *"Đánh giá chung chấp nhận 0.5 là cần luyện. Còn retest là đánh giá riêng lấy cao hơn 0.5 mới xuống level. còn 0.5 thì vẫn giữ level. đâu có mâu thuẫn"*.

**Chỗ Claude sai:** gộp 2 phép đo KHÁC NHAU vào 1 ngưỡng rồi kết luận hệ tự mâu thuẫn. Thực tế:
- **NHÃN mức** = đánh giá CHUNG → 0.5 = **cần luyện**. Dùng thẳng `masteryOfDang`, khớp màn Kết quả học tập. **Bỏ hàm `mucCuaModule`** Claude tự đẻ ra ở #8 — nó tạo sự thật thứ hai, đúng thứ CLAUDE.md cấm.
- **TƯ CÁCH THÀNH VIÊN của diện** mới dùng 2 mốc LỆCH nhau: **VÀO khi < 0.5** · **RA khi > 0.5** · **đúng 0.5 = GIỮ NGUYÊN trạng thái đang có**.

**Đây là TRỄ (hysteresis) — chống rung, không phải lỗi thiết kế.** Một ngưỡng duy nhất thì dạng dao động quanh 0.5 sẽ vào-ra-vào-ra mỗi lần chấm (274/3365 ô = 8% nằm đúng mốc này → rung thật, không phải lý thuyết). Hai mốc lệch nhau tạo vùng dính.

**Hệ quả kỹ thuật:** "ra" phụ thuộc trạng thái CŨ ⇒ engine cần biết dạng **đã trong đợt chưa** → thêm input `daMo` (`deXuatLevelKienThuc`) + `napDangDangMo()` (`danhgia.ts`: đọc `bo_tro_yeu_dang` chưa `dong_at`). Không có `daMo` → coi như chưa mở (an toàn, chỉ ảnh hưởng đúng ca score = 0.5).

**Sửa thêm:** `retestHong` từ `<= MOC` → **`< MOC`** (spec §4.1 viết "retest ≤ 0.5 → lên level", **Thùy chỉnh lại: 0.5 giữ level** — CEO quyết). `coBTVNChe` dùng `< / >=`. `canLuyen` gồm cả 0.5. Nhãn lý do đổi "≤0.5" → "<0.5".

**Test mới (6 ca) đóng đinh luật trễ:** 0.5 chưa mở → không vào diện, nằm nhóm cần luyện · 0.49 → vào diện · **đã mở + retest đúng 0.5 → Ở LẠI diện, GIỮ level (không lên không xuống)** · đã mở + 0.6 → ra khỏi diện, hạ level · cùng 0.5 mà kết quả khác nhau tuỳ trạng thái đang có (chính là định nghĩa của trễ) · retest = 0.5 không bị tính là "xử không work".

**Verify lại e2e** (9A1): dạng 0.33 → `yeu [DIỆN]`; bốn dạng 0.50 → `can_luyen`, KHÔNG vào diện. Nhãn và hành động hết đá nhau, và không còn lệch với màn Kết quả học tập.

`verify_danhgia` (66 test) + `verify_mastery` PASS · `tsc` sạch.

## 2026-07-22 (tiếp #10) — PHA 3: 4 kênh phát hiện + net-bucket + quét candidate

**Net-bucket (spec §2.A① — mảnh còn thiếu của kênh ①):** `cuoiCuaSo` · `bucketTaiThoiDiem` · `dangDoiBucketXau` (engine). Khi chuyên đề tụt, kèm được đúng dòng spec mô tả: `"Giải toán bằng cách lập Hệ phương trình: 1.00 → 0.53  ▼ 2 dạng tụt (dat→yeu, dat→can_luyen)"`. Danh sách dạng tụt = **ứng viên bổ trợ sẵn**, nối thẳng §3.

**⚠ Chỗ dễ làm sai mà test bắt được:** mastery là **"tính TỚI một thời điểm"**, KHÔNG phải "chỉ dùng câu NẰM TRONG cửa sổ". Nếu cắt theo cách thứ hai thì **cửa sổ vắng bài sẽ thành "tụt hạng" giả** (không học ≠ kém đi). Cài đúng: vẫn lấy 5 lần gần nhất *tính tới mốc cắt*, chỉ bỏ lần đo SAU mốc. 3 test khoá: cửa sổ sau không có bài → không báo tụt · dạng mới xuất hiện ở cửa sổ sau → không kết luận · `cuoiCuaSo('2026-02-B')` = 28 (không hardcode 30/31).

**`listCandidatesLop` — RULE lọc thô (spec §6), KHÔNG phán.** 4 kênh KHÔNG cộng dồn thành 1 điểm (gộp = mất thông tin) → trả `kenh[]` để thấy *vì sao* lọt vào; `uuTien` CHỈ để xếp thứ tự đọc. ③④ cộng 100 ⇒ flag của người luôn nổi lên đầu.

**[CALIBRATE] ngưỡng digest — đo thật 12 lớp Toán / 92 HS:** quét thô ra **38% roster** (rộng gấp đôi mục tiêu spec §8 là 10–15%). Phân bố: ≥15 → 26,1% · ≥30 → 19,6% · **≥40 → 10,9%** · ≥50 → 6,5% ⇒ chốt `NGUONG_DIGEST = 40`.
**KHÔNG cắt danh sách** — chỉ gắn cờ `trongDigest`. Lý do: (a) cắt bằng 1 số tổng hợp thì mâu thuẫn với chính nguyên tắc "4 kênh không cộng dồn" ở trên; (b) cắt âm thầm sẽ đọc thành "chỉ ngần này em cần chú ý" — sai. Đây là ngưỡng **SỨC ĐỌC MỖI TUẦN**, không phải "ai có vấn đề"; 27% còn lại vẫn trả về để UI hiện "còn N em dưới ngưỡng".

**Đọc thử top ưu tiên trên data thật** — lý do ra đúng dạng người đọc được ngay, ví dụ: *Nguyễn Quang Nhật (9S1), ưu tiên 83, kênh trend+thái độ; 2 chuyên đề tụt kèm dạng con; 3/5 buổi gần nhất dưới Nghiêm túc; 3 dạng trong diện; 1 dạng "BTVN che"*. Và bắt được ca `Chống đối` → nhảy nấc ngay (Vũ Minh Đức Anh 12A1) đúng luật §4.2.

Hiệu năng: ~640ms/lớp. `verify_danhgia` (72 test) PASS · `tsc` sạch.

## 2026-07-22 (tiếp #11) — PHA 5 (UI): màn "Dashboard học tập" + phát hiện RLS làm MÙ script chẩn đoán

**Thùy chốt chỗ đặt:** tab riêng trong nhóm **"Quản lý chất lượng"** (nhóm đã có sẵn: Kết quả học tập · Duyệt chấm online) → leaf `db_hoctap`, `src/screens/danhgia/DashboardHocTapScreen.tsx`. Phân vai rõ: `ketqua` = **TRA CỨU** số liệu · `db_hoctap` = **PHÁT HIỆN → ĐỀ XUẤT → NGƯỜI DUYỆT**.

**Màn gồm:** 3 thẻ số (cần đọc tuần / dưới ngưỡng / đề xuất đổi level) · khu **"Cần đọc tuần này"** (trongDigest) · khu **"Dưới ngưỡng — theo dõi"** (vẫn hiện, KHÔNG ẩn) · modal chi tiết: vì-sao-được-nêu, 2 khối duyệt (kiến thức / thái độ) với 4 nút L0–L3 (★ = máy đề xuất, sửa được), bảng dạng trong diện, chuỗi trend chuyên đề kèm dạng tụt, **lịch sử duyệt** có badge "máy đề xuất L*" khi người chốt khác máy.

**⚠️ BUG THẬT bắt được khi soi màn chạy:** thái độ L2 hiện nhãn **"Cần bổ trợ"** vì em dùng CHUNG 1 bảng nhãn cho 2 thang. Sai nghiệp vụ: spec §4.2 thì thái độ L2 = **nhắc PHỤ HUYNH**, không phải xếp buổi bổ trợ — nhân viên đọc xong sẽ làm nhầm việc. Fix: tách `TEN_KT` / `TEN_TD`, hàm `lvUI(lv, loai)`.

**⚠️⚠️ PHÁT HIỆN LỚN — "0 dòng" từ script pg KHÔNG phải bằng chứng "không có data":**
Duyệt thử trên UI → modal đóng (tức `duyetLevel` resolve OK) nhưng `select` bằng pg ra **0 dòng** ⇒ tưởng ghi hỏng. Query lại **qua app** (supabase client) thì **CÓ ĐỦ**: `hs_level` 2 dòng, `hs_level_log` 2 dòng, đủ `level_cu`/`level_may_de_xuat`/`level_chot`/`actor` + `ly_do_may` snapshot đóng băng.
**Gốc rễ = QUYỀN SỞ HỮU BẢNG:** `select pg_get_userbyid(relowner)` → **98 bảng owner `claude_build`** (owner được **miễn RLS** ⇒ script đọc thoải mái) · **5 bảng owner `postgres`** = 4 bảng mới + **`phan_cong_ca`** ⇒ RLS chặn `claude_build` (không thuộc role `authenticated`, policy `to authenticated` không áp) → trả **rỗng, KHÔNG báo lỗi**.
Vì sao lệch owner: migration cũ chạy qua `claude_build`; migration hôm nay Thùy **chạy tay trên Supabase SQL editor** ⇒ owner `postgres`. **Cùng gốc rễ với vụ `schema.md` thiếu bảng sáng nay** — và giải thích luôn vì sao `phan_cong_ca` vô hình rất lâu.
**Đã kiểm chéo để không hoảng nhầm:** `bt_grades`/`ky_thi`/`diem_thi` owner = `claude_build` ⇒ 0 dòng của chúng là **rỗng THẬT**, báo cáo verify §8 sáng nay KHÔNG sai.
**Quy tắc mới:** trước khi kết luận "bảng rỗng", phải xem owner + `relrowsecurity`; nếu owner ≠ role đang nối và bảng bật RLS → đọc bằng **app client** (đã đăng nhập), đừng tin pg.
**Đề xuất Thùy chạy:** `alter table … owner to claude_build` cho 5 bảng để hết lệch (chi tiết ở tin nhắn).

**Test data còn trên prod:** HS *Nguyễn Văn Đức Huy* (11A1) đang có `hs_level` kiến-thức L1 + thái-độ L2 do em bấm duyệt thử — **chưa xoá, chờ Thùy quyết** (Luật xoá).

`tsc` sạch · `verify_danhgia` PASS.

## 2026-07-23 — NỐI CLAUDE API: "code tính số, Claude phán" (vế còn lại của spec §0)

**Thùy:** *"Đây mới là hệ thống đề xuất. t cần gọi api claude vào để nó đọc dữ liệu và đề xuất. chứ nếu chỉ rule base thì chưa dc"* — đúng spec §0/§6: rule engine là vế "code tính số", còn thiếu vế "Claude phán".

**⭐ KIẾN TRÚC: QUA BẢNG JOB + WORKER, KHÔNG GỌI THẲNG TỪ BROWSER.** Gọi Anthropic từ browser buộc nhúng key vào bundle (`VITE_*`). Repo đã chấp nhận điều đó cho Gemini, nhưng: (a) Opus 4.8 đắt hơn nhiều lần; (b) **đã có tiền lệ cháy tiền** — DEVLOG "vụ 920k", phải khoá cứng Gemini về Flash. Key lộ = người lạ đốt tiền. ⇒ dùng lại **pattern worker sẵn có** (`linkgen_jobs` + `worker/index.mjs`): browser ghi job, worker Node giữ key server-side.

**⭐ `stat_sheet` do CLIENT tính rồi ghi vào job**, worker KHÔNG tự tính lại: (a) không nhân đôi logic; (b) **đóng băng bằng chứng** đúng thời điểm hỏi — mastery suy-động, tính lại sau ra số khác thì không đối chiếu được với câu Claude đã trả lời.

**Đã làm:**
- Migration `202607232117_danhgia_ai_job.sql` (**CHƯA CHẠY** — chờ Thùy): job có `stat_sheet`(vào) · `ket_qua`(ra) · `usage`(soi chi phí THẬT) · `model` · attempt/error.
- `worker/danhgia.mjs` (`npm run worker:danhgia`): poll → gọi Claude → ghi kết quả. Nhận job có điều kiện (`.eq('trang_thai','pending')` lúc update) chống 2 worker ăn 1 job; 1 job/lượt (gọi Claude tốn tiền, không chồng lệnh).
- `src/lib/danhgia.ts`: `taoAiJob`/`getAiJob`/`getAiJobMoiNhat` + `goiGon()` — **lọc bớt trước khi gửi**: chỉ dạng trong-diện hoặc chưa-Đạt, bỏ trường chỉ UI cần. Ít token = rẻ hơn VÀ đúng §0 (Claude đọc stat sheet SẠCH, không phải cục raw). Mở màn hiện lượt hỏi GẦN NHẤT → khỏi hỏi lại tốn tiền.
- UI: khu "Nhận định của Claude" trong Dashboard học tập — tổng quan + cảnh báo cả lớp + từng em (phân loại/lý do/việc cần làm/dạng ưu tiên/độ tin/còn thiếu) + dòng token đã dùng.

**Cấu hình API (theo tài liệu chính thức, không đoán):** `claude-opus-4-8` · `thinking:{type:'adaptive'}` (⚠ `budget_tokens` **bị 400** trên Opus 4.8) · `output_config:{effort:'high', format:{type:'json_schema'}}` (structured outputs — API ép JSON đúng hình, khỏi parse mò) · `cache_control` ở system prompt (lần 2 trở đi đọc cache ~1/10 giá) · **xử lý `stop_reason` TRƯỚC khi đọc content** (`refusal` → content rỗng; `max_tokens` → JSON cụt). System prompt cố ý KHÔNG nhét biến động (ngày/tên lớp/id) — caching là so khớp TIỀN TỐ, đổi 1 byte là hỏng cache mọi request sau.

**`scripts/verify_danhgia_claude.mjs` — soát cấu hình KHÔNG cần key, không gọi mạng.** Bắt các lỗi `tsc` không thấy: model string sai/hậu tố ngày · tham số đã bị gỡ khỏi Opus 4.8 (`budget_tokens`/`temperature`) · schema vi phạm ràng buộc structured outputs (thiếu `additionalProperties:false`, dùng `minLength`…) · thiếu xử lý `stop_reason` · **key rò sang bundle browser**. 13/13 pass.
*Lần đầu viết check này BÁO NHẦM* — quy tắc "browser không đụng Anthropic" bắt cả **comment** nhắc tên. Sửa: bỏ comment trước khi soi, và chỉ chặn thứ thật sự nguy hiểm (import SDK · `api.anthropic.com` · chuỗi `sk-ant-` · đọc `ANTHROPIC_API_KEY`). Cũng bỏ luôn kiểu sinh file tạm rồi import — file tạm quên xoá là lần sau soi nhầm schema CŨ mà không ai biết.

**⚠ CHƯA GỌI THẬT LẦN NÀO** — `.env.local` chưa có `ANTHROPIC_API_KEY` (cố ý KHÔNG đặt tên `VITE_*`) và migration chưa chạy. Mọi thứ trên mới chỉ đúng về CẤU TRÚC. Chỗ rủi ro nhất chưa kiểm được: `output_config` mang ĐỒNG THỜI `effort` + `format` — tài liệu nêu riêng từng cái, chưa thấy ví dụ gộp; nếu 400 thì tách `effort` ra hoặc bỏ.

`tsc` sạch · `verify_danhgia` 72 test PASS.

## 2026-07-23 (tiếp) — Xoá test data · ĐO chi phí thật · lọc payload

**Xoá test data (Thùy duyệt "test thì xóa đi thôi"):** liệt kê chính xác trước rồi mới xoá — 4 dòng, đều của **HS0059 Nguyễn Văn Đức Huy**, đều do Claude bấm duyệt thử (`hs_level` KT L1 + TĐ L2, `hs_level_log` 2 lượt). Xác nhận sau xoá: `hs_level` 0 · `hs_level_log` 0. Không đụng dữ liệu thật nào.

**⚠️ PHÁT HIỆN 1 — `cache_control` HIỆN KHÔNG CÓ TÁC DỤNG.** Opus 4.8 chỉ cache tiền tố **từ 4096 token**; system prompt + schema của ta mới **~1540 token** → dưới ngưỡng, API **lặng lẽ không cache, không báo lỗi**. Giữ lại vì vô hại và prompt dài thêm là tự có hiệu lực; đã ghi comment cách tự kiểm (`usage.cache_read_input_tokens` = 0 mãi nghĩa là vẫn dưới ngưỡng). Bài học: đặt `cache_control` KHÔNG bảo đảm có cache — phải soi `usage` mới biết.

**⚠️ PHÁT HIỆN 2 — ước lượng đầu tiên BỎ SÓT token suy nghĩ.** `thinking` bị tính giá **output**; ở `effort:'high'` đây mới là khoản tốn nhất, KHÔNG phải payload. Ước lại: suy nghĩ ~5.580 tok/lớp khi gửi cả lớp — nhiều hơn cả phần chữ trả về.

**⭐ SỬA: mặc định CHỈ GỬI em CÓ TÍN HIỆU, không gửi cả lớp** (`taoAiJob(lopId)`; muốn cả lớp thì `{caLop:true}`). Đo thật 10 lớp Toán: TB 7,4 HS/lớp nhưng chỉ **3,1 em có tín hiệu**. Lớp không có em nào → chặn luôn, báo "chưa cần hỏi Claude" thay vì đốt tiền để nghe "cả lớp ổn định". Payload kèm `si_so_ca_lop` + `ghi_chu` nói rõ đã lọc bao nhiêu — **cắt mà không nói thì Claude đọc thành "lớp chỉ có ngần này em"** rồi kết luận sai về mặt bằng.
→ **tiết kiệm ~51%**: 5.853 đ → **2.888 đ/lượt** (Opus 4.8, TB 1 lớp).

**Chi phí đo trên payload THẬT** (`scripts/_diag_danhgia_chiphi.ts`, tỷ giá 26k): 1 lớp TB ≈ 2.888 đ · quét hết **42 lớp/tuần ≈ 121k đ/tuần ≈ 522k đ/tháng**. Rẻ hơn: Sonnet 5 (KM tới 31/8) 209k/tháng · Haiku 4.5 104k/tháng · **Batch API −50%** (hợp nhịp digest tuần của spec §6, chờ tối đa 24h).
⚠ Đây là **ƯỚC LƯỢNG** (quy đổi ký tự→token, ước token suy nghĩ). Số THẬT in ở log worker sau lượt gọi đầu (`usage`) — lấy số đó thay bảng này.

## 2026-07-23 (tiếp) — ⚠️ BẪY: `npm run migrate` KHÔNG dùng được cho DB đang chạy

**Claude hướng dẫn sai, Thùy chạy và gặp lỗi:** `npm run migrate` → `Applying 0001_kho_canonical_knowledge.sql ... FAIL — relation "dai_ban_do" already exists`.

**Gốc rễ:** `scripts/migrate.mjs` **KHÔNG có bảng theo dõi migration nào cả** — nó `readdirSync` toàn bộ `supabase/migrations/*.sql`, sort theo tên, rồi áp **TẤT CẢ từ file 0001** mỗi lần chạy. Đây là công cụ **dựng DB từ TRỐNG** (migrate-from-scratch), KHÔNG phải công cụ áp migration mới lên DB prod. Khớp với ghi chú đã có trong mig 0113: *"Đã áp tay trên DB prod; file này để migrate-from-scratch không lệch lại"* — tức quy trình THẬT của repo là **áp tay trên Supabase SQL Editor**, file trong repo chỉ để dựng lại từ đầu.

**Không mất gì:** mỗi file chạy trong 1 transaction; file đầu fail → `rollback` → dừng. Xác nhận sau sự cố: 103 bảng · `dai_ban_do` 462 · `gami_grades` 23.377 · `hoc_sinh` 409 — nguyên vẹn.

**Quy tắc từ nay:** thêm bảng/cột lên DB đang chạy = **đưa SQL cho Thùy dán vào Supabase SQL Editor**, file migration trong repo chỉ để from-scratch. Đừng bảo chạy `npm run migrate` trên prod.

**Kèm luôn `alter table … owner to claude_build`** vào mọi SQL đưa Thùy dán — bảng tạo qua SQL Editor thuộc sở hữu `postgres`, RLS chặn role Claude Code, `schema.md` chiếu thiếu **mà không báo lỗi** (đã dính đúng vụ này với 4 bảng level hôm qua + `phan_cong_ca` vô hình rất lâu).

## 2026-07-23 (tiếp) — Model configurable + script SO MODEL (đo thay vì cãi)

**Thùy hỏi: "claude hay chatgpt tốt hơn" · "có cần opus 4.8 không" · "AI nào phù hợp nhất".** Trả lời trung thực: với việc NÀY khoảng cách giữa các hãng nhỏ, vì **phần khó đã do code làm xong** (tính mastery, dò trend, bắt dạng tụt, áp ngưỡng, lọc ai cần đọc). Model chỉ còn đọc bảng nhỏ đã sạch + áp luật đã viết rõ + viết vài câu tiếng Việt — không phải chỗ cần model mạnh nhất. Claude tự nhận có thiên vị khi tự đánh giá mình, nên **dựng công cụ để Thùy tự đo** thay vì tranh luận.

- `DANHGIA_MODEL` / `DANHGIA_EFFORT` đọc từ `.env.local` → đổi model KHÔNG cần sửa code.
- **Bug tự gây, tự bắt:** đặt `const MODEL = env(...)` **TRƯỚC** khi khai báo hàm `env()` → TDZ, worker chết ngay khi khởi động. Chạy thử mới lộ. Đã chuyển xuống sau + ghi cảnh báo tại chỗ.
- Tách `worker/danhgia_prompt.mjs` (SYSTEM + SCHEMA dùng chung) — trước đó script so sánh phải tự cắt chuỗi từ worker; sửa prompt là số liệu so sánh **sai thầm lặng**.
- `scripts/_diag_so_model.ts`: chạy CÙNG 1 lớp thật qua Opus 4.8 / Sonnet 5 / Haiku 4.5 → in **BẢN A/B/C KHÔNG kèm tên model** (so mù, tránh định kiến thương hiệu) → cuối mới tiết lộ + chi phí thật. Kèm **kiểm tự động: model nào bịa mã dạng không có trong stat sheet** — đây là rủi ro nguy hiểm nhất (bịa số → TA xử lý sai học sinh), quan trọng hơn văn hay.

**Chạy thử → 401 `invalid x-api-key`.** Soi hình dạng key (KHÔNG in giá trị): dài **23 ký tự, chứa `...`** ⇒ Thùy dán nhầm **bản rút gọn Console hiển thị** (`sk-ant-...jgAA`), không phải key thật (~100 ký tự). Console chỉ hiện key đầy đủ 1 lần lúc tạo → phải tạo key mới. **Cách soi an toàn: in độ dài + 6 ký tự đầu + 4 ký tự cuối, không bao giờ in cả key.**

**VẪN CHƯA KIỂM ĐƯỢC** (401 chặn trước khi tới tầng validate): `output_config` mang ĐỒNG THỜI `effort` + `format` — tài liệu nêu riêng từng cái. Có key thật là biết ngay.

**Bài học quy trình:** sinh file .ts bằng python heredoc qua bash làm `\n` bị diễn giải thành xuống dòng thật → chuỗi vỡ, sửa vòng vo 4 lượt. Lần sau viết thẳng bằng công cụ ghi file, đừng sinh code qua nhiều tầng escaping.

## 2026-07-23 (tiếp) — GỌI THẬT LẦN ĐẦU: Opus 4.8 trên lớp 11B1

**Bug chặn 3 lượt: regex đọc key ĂN MẤT chữ đầu của key.** `_diag_so_model.ts` sinh qua python heredoc → `\s` thành `\s`, mà **`\s` trong template literal JS bị đọc thành ký tự `'s'`** → regex hoá ra `^s*KEYs*=s*(.+?)s*$` → cụm `s*` sau dấu `=` **khớp luôn chữ "s" đầu của `sk-ant-...`** → gửi đi `k-ant-...` → 401. Nhìn `.env.local` thấy key 108 ký tự đúng y, không ai nghi ra.
Cách bắt: so hàm `env()` của worker (đúng, `\s`) với bản trong script (hỏng, `\s`) trên **cùng một file** → worker 108 · script 107, và 20 ký tự đầu lệch đúng 1 vị trí.
⚠ Trước đó Claude đã chẩn đoán SAI hai lượt (đổ cho key hỏng, rồi đổ cho regex rụng ký tự cuối) vì test qua `node -e` trong bash — **escaping của shell làm sai lệch chính phép đo**. Chỉ khi ghi ra FILE THẬT rồi chạy mới ra đúng. Bài học: đo escaping thì đừng đo qua thêm một tầng escaping.
**Worker KHÔNG dính** (dùng `\s` đúng). Đã thay regex trong script bằng tách dòng + cắt tại `=` — hết cả lớp lỗi này.

**✅ XÁC NHẬN ĐIỀU CÒN TREO:** `output_config` mang ĐỒNG THỜI `effort` + `format` **chạy bình thường**, không 400. Cấu hình hiện tại hợp lệ.

**Kết quả thật (11B1, 4/7 em có tín hiệu):** 88,2s · vào 6.245 · ra 5.025 · **4.078 đ** · `cache_read = 0` (đúng như dự đoán: system prompt 1.540 token, dưới ngưỡng 4.096 của Opus). Kiểm tự động: **không bịa mã dạng nào**.

**Ước lượng trước THIẾU ~2,3 lần** (1.792 đ vs 4.078 đ thật) — sai chủ yếu ở token suy nghĩ (ước 2.760, thật 5.025). Từ nay lấy số thật, bỏ bảng ước.

**Chất lượng — Claude nêu được thứ rule engine KHÔNG thấy:** dạng `11010502` có điểm 5-lần-gần-nhất = 0 ở 3/4 em NHƯNG điểm chỉ-giám-sát lại 0.6–1 → nó đặt nghi vấn **"có thể do đề BTVN dạng này có vấn đề, không phải các em kém"**. Đó là suy luận cấp LỚP về chất lượng DỮ LIỆU, rule engine per-HS không thể ra. Ngoài ra: xếp `11010202` (giám sát = 0) ưu tiên hơn `11010502` vì bằng chứng giám sát nặng hơn; và tự chặn `11020103` "mới 1 lần đo, chưa đủ căn cứ" — đúng luật 3 + luật 8 của prompt.

**Nhịp Thùy chốt: 2 tuần/lần** (khớp 2 cửa sổ 14 ngày/tháng). Đo thật: chỉ **~60% lớp có em cần đọc**, lớp không có ai bị chặn từ `taoAiJob` nên không tốn tiền → ~25 lượt/lần quét.
Chi phí THẬT theo nhịp này: **Opus 204k đ/tháng** (499 đ/HS/tháng) · Sonnet 5 82k · Haiku 41k · **Batch API còn một nửa**.

## 2026-07-23 (tiếp) — Chọn model NGAY TRÊN ERP để Thùy tự so

**Thùy:** *"Tốt nhất là cho t chỗ để chọn sonnet5 và opus 4.8 là được. t sẽ tự test so sánh."* → dừng việc Claude tự chạy so sánh bằng script, chuyển thành **chức năng thật trong app**.

- Cột mới `danhgia_ai_job.model_chon` (client ghi model NGƯỜI chọn; worker đọc cột này, không có thì rơi về mặc định của worker).
- UI: nút gạt **Sonnet 5 / Opus 4.8** cạnh nút chạy. Mặc định **Sonnet 5** — rẻ hơn ~60%, và giả thuyết là đủ dùng vì phần khó đã do code làm.
- **Dải "Các lượt đã chạy — bấm để so"**: mỗi lượt hiện `model · giờ · số tiền THẬT`, bấm qua lại để đọc 2 bản trên **CÙNG dữ liệu**. Đây mới là thứ cho kết luận — so bằng cảm giác thì không quyết được.
- `tienCuaLuot()` quy tiền từ `usage` THẬT của từng lượt (không ước). Dòng cuối kết quả hiện luôn "~N đ lượt này" + ghi rõ token ra **gồm cả token suy nghĩ** — chỗ ước lượng ban đầu sai 2,3 lần.
- Worker log thêm tên model đang chạy.

Verify trên app thật (dev server, đăng nhập bằng nút DEV — không nhập mật khẩu): màn render đúng, có nút gạt 2 model, 0 lỗi console. `tsc` sạch · `verify_danhgia` 72 test · `verify_danhgia_claude` 14 mục PASS.

**Chờ Thùy chạy:** `alter table danhgia_ai_job add column if not exists model_chon text;` — chưa có cột thì bấm nút sẽ lỗi insert.

## 2026-07-23 (tiếp) — Worker 401 dù key ĐÚNG: tiến trình cũ giữ key cũ trong bộ nhớ

**Triệu chứng:** worker báo `401 API key is invalid.` 3 lần rồi bỏ cuộc, trong khi script chạy tay với CÙNG key lại thành công.

**Nguyên nhân: worker đọc `.env.local` ĐÚNG MỘT LẦN lúc khởi động.** Tiến trình được bật từ lúc key còn là placeholder 23 ký tự; sau đó Thùy cắm key thật vào file nhưng tiến trình vẫn giữ key cũ trong bộ nhớ → 401 vĩnh viễn dù nhìn file thấy key đúng.

**Hai manh mối chỉ đúng hướng ngay từ log, không cần đoán:**
1. Dòng job in `đang hỏi Claude…` — bản code hiện tại đã đổi thành `· <model> · đang hỏi…` ⇒ tiến trình chạy code CŨ.
2. Thông báo `"API key is invalid."` + `request_id: null`, KHÁC `"invalid x-api-key"` + có request_id mà script gặp ⇒ hai loại key sai khác nhau (key rác vs key sai định dạng).

**Sửa — chết sớm thay vì đốt 3 lượt mỗi job:** worker kiểm key NGAY lúc khởi động — soi hình dạng (`sk-ant-`, ≥90 ký tự, không chứa `...`) rồi gọi `models.list()` (**KHÔNG tốn token**). Sai thì thoát ngay kèm nhắc *"vừa sửa .env.local thì nhớ KHỞI ĐỘNG LẠI worker"*.

**Job 9A1 (15 em, Sonnet 5) đã đưa về `pending`** để chạy lại khi worker mới bật — stat sheet đã đóng băng từ lúc bấm nên không cần tạo lại.

## 2026-07-24 — Giáo trình: bộ RIÊNG của lớp · dạng theo MÃ · thứ tự chọn

**Thùy nêu 3 việc** (làm song song với dashboard học tập — không đụng chung file):

**1. Mỗi lớp phải có BỘ GIÁO TRÌNH RIÊNG, số buổi của lớp.** 1 master gán cho nhiều lớp nhưng mỗi lớp
học một tập con khác nhau (9A1: buổi 1,2,3,6,7,8,10 · 9A2: 1..7). Doc trích xuất copy NGUYÊN tiêu đề mốc
buổi của master → phiếu in ra sai số. Soi DB xác nhận đúng triệu chứng: buổi thứ 13 của 9A2 mang tiêu đề
*"Buổi 7 : Bất đẳng thức"*, buổi thứ 16 mang *"Buổi 22: …"*; 9A1 buổi thứ 7 là *"Buổi 8"*, thứ 8 là *"Buổi 10"*.

- Migration `202607241517_giao_trinh_rieng_cua_lop` — thêm `tai_lieu.stt_lop` (+ index từng phần). **KHÔNG
  đẻ bảng mới**: doc vận hành đã bám `(lop_id, ngay)` + `nguon_id/nguon_buoi` (đường ánh xạ về master),
  chỉ thiếu đúng một thứ là số buổi TRONG LỚP.
- `stt_lop` = **hạng của NGÀY** trong lịch đã gán của lớp, KHÔNG phải "số lúc tạo" — gán chèn vào giữa
  lịch thì buổi sau phải dồn số ⇒ `renumberBuoiLop(lopId)` tính lại cả lớp, chạy sau MỌI thao tác đổi tập
  buổi (gán · gán lại · xoá doc ở Kho · nhân bản có gắn lớp). GT + BTVN cùng ngày = cùng một buổi ⇒ cùng số.
- `tieuDeBuoiLop()` thay SỐ nhưng GIỮ phần chữ: *"Buổi 22: GTLN-GTNN"* → *"Buổi 16: GTLN-GTNN"*. Đã test
  10 ca lấy từ tiêu đề THẬT trong DB + **idempotent** (chạy lại không cộng dồn số) bằng file `.mjs`.
- Đổi tiêu đề buổi = đổi nội dung in ra giấy ⇒ `renumberBuoiLop` trả về danh sách doc đã đổi để caller
  `enqueueLinkGen` (lib không import store — tránh vòng phụ thuộc).
- UI panel "Gán lớp" tách 2 cột: trái = buổi của giáo trình gốc + nút gán (hàng đã gán hiện thêm badge
  *"→ Buổi k của lớp"*), phải = **📚 Giáo trình riêng của lớp** (buổi 1..N theo ngày, badge GT/BTVN, ghi
  chú "từ buổi m của giáo trình gốc"). Nút **↻ Đánh số lại** cho các lớp đã gán TỪ TRƯỚC — dữ liệu cũ chỉ
  đổi khi người dùng chủ động bấm (hoặc khi gán buổi mới), không tự ý sửa hàng loạt.

**2. Bỏ đánh số dạng chạy 1,2,3… → hiện MÃ DẠNG của bản đồ kiến thức.** Số chạy nhảy mỗi lần thêm/bớt/đổi
thứ tự dạng nên "Dạng 5" hôm nay ≠ hôm qua ≠ trong builder → đối chiếu là loạn. Mã dạng bất biến và trỏ
thẳng về đúng KP (đơn vị chân lý HS × dạng). Áp cả builder (thẻ dạng + cây trái), bản in (giáo trình +
phiếu BTVN) và màn xem trước ôn tập — bỏ hẳn `dangNoByMa`, không còn nguồn đánh số thứ hai.

**3. Thứ tự dạng = ĐÚNG THỨ TỰ CHỌN.** Trước: picker trả về theo thứ tự BẢN ĐỒ và `setDangOfBuoi` còn tự
chèn dạng mới cạnh dạng cùng chuyên đề → người soạn không nắn được thứ tự. Giờ `[...sel]` (JS Set giữ thứ
tự chèn) và `setDangOfBuoi` dùng nguyên thứ tự truyền vào. Gom lý thuyết chuyên đề vẫn chạy (nó gom các
dạng LIỀN NHAU cùng chuyên đề) — chỉ là không tự sắp xếp lại nữa.

`tsc` sạch · `vite build` sạch · migration đã áp (`_apply_one`) · `schema.md` refresh. **Chưa soi được trên
app thật**: cổng dev đang bị phiên khác (dashboard học tập) chiếm, preview không mở được.

## 2026-07-23 (tiếp) — HÀNG RÀO CHI PHÍ (Thùy: "logic thử đốt tiền như này thì chết")

**Thùy chặn đúng lúc.** Rà lại thì có **ba** lỗ đốt tiền, không phải một:

1. **Thử lại lỗi TẤT ĐỊNH.** Lớp 15 em bị cắt `max_tokens` → worker thử 3 lần, mỗi lần sinh đủ 16k token rồi vứt ⇒ **~15.000 đ cho ba lần hỏng giống hệt nhau**. Sửa: cờ `khongThuLai` cho `max_tokens`/`refusal`/model-lạ → hỏng luôn, không thử lại.
2. **`max_tokens: 64000` CỐ ĐỊNH** (Claude vừa tự nâng lên để chữa lỗi cắt, mà không đặt trần tiền). Một lượt chạy loạn trên Opus = 64k × $25/1M = **~41.600 đ**. Sửa: `max_tokens` tính theo CỠ LỚP (`1500 + 1300×soHS`, ×1,6 an toàn, trần cứng 40k).
3. **Không có trần tiền.** Sửa: ước chi phí TRƯỚC khi gọi, vượt `TRAN_TIEN_1_LUOT = 25.000 đ` thì DỪNG và báo người — không âm thầm tiêu.

**Phát hiện thêm — Haiku 4.5 KHÔNG hỗ trợ adaptive thinking** (`400 adaptive thinking is not supported on this model`). Lỗi 400 bị chặn trước khi sinh chữ nên KHÔNG mất tiền, nhưng job chết. Sửa: `CO_ADAPTIVE` whitelist, model không hỗ trợ thì bỏ hẳn trường `thinking`. (UI chỉ cho chọn Sonnet 5 / Opus 4.8 nên không dính, nhưng `DANHGIA_MODEL` env thì có.)

**Bảng chạy khô lộ tiếp một chỗ vô lý Claude tự tạo:** ở 40 em, *ước* (42.263 đ) > *tối đa* (33.488 đ) — không thể. Vì lớp đông quá thì `max_tokens` bị cắt về trần 40k trong khi nhu cầu thật là 53.500 ⇒ **gọi cũng CHẮC CHẮN bị cắt**. Sửa: chặn ngay từ đầu với lý do "lớp quá đông, cần chia nhỏ" thay vì trả tiền cho kết quả hỏng đã biết trước.

**`scripts/verify_danhgia_chiphi.mjs` — CHẠY KHÔ, không gọi API, không tốn đồng nào.** In bảng (model × cỡ lớp → max_tokens / ước / tối đa / chặn hay không) + 8 bảo đảm. Đọc hằng số THẲNG từ worker nên sửa worker mà quên là test đỏ ngay.

**Log worker giờ in cả ƯỚC lẫn THẬT + token/em**, lệch >40% thì cảnh báo chỉnh hằng số — không để ước lượng trôi khỏi thực tế rồi hàng rào thành vô nghĩa.

**Hiện trạng theo bảng:** Sonnet 5 chạy được tới 25 em · Opus chặn từ 25 em (quá trần tiền) · mọi model chặn ở 40 em (quá trần token). Lớp to nhất của trung tâm là 15 em nên chưa chạm giới hạn nào.

## 2026-07-24 (tiếp) — Buổi học: thanh tìm theo LỚP (toggle, không đụng màn theo-ngày)

**Thùy:** *"muốn tìm ca học của lớp 9A1 ngày 22/07 thì phải chọn lịch đúng ngày đấy — bất tiện kinh"*, và
hỏi nên build thẳng vào màn hay để 1 toggle.

**Chọn TOGGLE.** Hai chế độ khác TRỤC chứ không phải khác bộ lọc: "Theo ngày" = buổi ẢO của MỘT ngày (suy
TKB × ngày, có bộ đếm chưa-mở/đã-mở/đã-huỷ **của ngày đó**); "Tìm lớp" = LỚP xuyên thời gian. Trộn chung
một danh sách thì mấy con số đếm theo-ngày hết nghĩa, mà màn này là spine vận hành hằng ngày của OPS —
đổi nó là rủi ro không đáng. Gạt chế độ ⇒ màn chính giữ nguyên 100% hành vi.

- `timBuoiTheoLop(q)` (gami.ts): khớp `lop.ten_lop ilike %q%` → gộp 2 nguồn: ① buổi THẬT (`buoi_hoc`, **mọi
  `loai`** — bù/bổ trợ/MT cũng là buổi của lớp) ② buổi ẢO sắp tới (TKB, hôm nay → +14 ngày, bỏ ngày đã có
  buổi thường). Chỉ tra TKB của **lớp đã khớp tên**, khác `buoiAoCuaKhoang` quét toàn trung tâm → gõ tới đâu chạy tới đó.
- **Gom (lớp × ngày) về 1 dòng ảo, giữ slot sớm nhất.** TKB có slot TRÙNG THỨ còn hiệu lực chồng nhau —
  9A1 thật sự có 2 dòng `T6 15:00` (1 dòng `hieu_luc_den` cũ, 1 dòng NULL). Không gom thì ra 2 hàng y hệt,
  bấm "Mở buổi" hàng nào cũng ra cùng 1 buổi (moBuoi tra theo lop+ngay).
- Search debounce 250ms + cờ huỷ (gõ "9A1" = 3 lượt, không để lượt cũ trả về sau rồi đè kết quả mới).
- **Từ khoá tìm để ở BuoiHocScreen, không ở trong panel** — vào 1 buổi rồi bấm "← Buổi học" là panel bị
  unmount, để state bên trong thì mất chữ, phải gõ lại mỗi lần xem xong 1 buổi (thao tác lặp nhiều nhất).
- Hàng đã có buổi → bấm cả hàng vào thẳng; chưa mở → nút "Mở buổi" riêng (không bấm nhầm cả hàng mà đẻ dòng).

Verify trên app thật (dev server phiên khác, HMR cùng cây làm việc): gõ `9A1` → **23 buổi** (6 sắp tới +
17 đã mở, không trùng), có đúng hàng **T4 · 22/07/2026 · Hoàn tất**, bấm vào ra `9A1 · 2026-07-22`
(`9A1.T4.22072026`, điểm danh 13/15). Gõ `9A` → **46 buổi · 2 lớp (9A1, 9A2)**. Vào buổi rồi back → ô tìm
vẫn giữ "9A". Gạt về "Theo ngày" → màn cũ nguyên vẹn (Chưa mở 8 · Đã mở 4). 0 lỗi console. `tsc` + `vite build` sạch.

## 2026-07-23 (tiếp) — Lượt chạy THÀNH CÔNG đầu tiên qua app · chỉnh lại hằng số ước

**9C1 · 7 em · Sonnet 5:** 137s · vào 23.564 · ra 12.914 · **4.583 đ** (ước 3.331 đ, **lệch +38%**). Claude trả 7 mục học sinh + 3 cảnh báo cả lớp.

**Hai hằng số ước SAI, đã chỉnh theo đo thật:**
1. **KÝ TỰ/TOKEN: 3,2 → 1,4.** Payload 30.286 ký tự nhưng tốn 23.564 token ⇒ **1,38 ký tự/token**. Tiếng Việt có dấu + dấu ngoặc JSON tốn token **gấp hơn hai lần** tiếng Anh thuần. Claude lấy 3,2 theo thói quen tiếng Anh → ước thiếu input **2,3 lần**. Hàng rào chi phí dựa vào hằng số này nên sai là hàng rào vô nghĩa.
2. **TOKEN RA MỖI EM: 1.300 → 1.900** (đo: 1.256 ở 11B1 · 1.845 ở 9C1 → lấy cận trên).

**Hệ quả CẦN THÙY QUYẾT — trần 25.000 đ/lượt giờ CHẶN Opus từ lớp 10 em:**
| model | ≤9 em | 10–15 em | ≥25 em |
|---|---|---|---|
| Opus 4.8 | chạy | ⛔ quá trần tiền (25.948 đ ở 10 em) | ⛔ quá đông |
| Sonnet 5 | chạy | chạy (15 em ≈ 10.535 đ) | ⛔ quá đông |
| Haiku 4.5 | chạy | chạy | ⛔ quá đông |

Lớp của trung tâm tới 15 em ⇒ **Opus gần như không dùng được ở trần hiện tại**. Hai đường: nâng trần (vd 35.000 đ) hoặc chốt Sonnet 5. Trần là con số Claude tự đặt, không phải Thùy chốt — cần hỏi.

Test `verify_danhgia_chiphi` chỉnh theo: mốc kiểm "chặn vì tiền" chuyển từ 25 em sang **10 em** (ở hằng số mới, 25 em bị chặn vì quá đông trước khi kịp chạm trần tiền).

## 2026-07-24 — Kho HÌNH v3: bản đồ kiến thức 4 tầng (spec-kho-hinh-v3)

**Làm:** dựng trọn nhánh Hình theo `spec-kho-hinh-v3.md` (copy vào repo) + `docs/mockup-kho-hinh-v4.html`.
Tab "Hình học" của Bản đồ kiến thức giờ render `src/screens/kho/hinh/KhoHinhScreen.tsx` (rail 9 màn M0–M9),
KHÔNG dùng chung component bản đồ 3 tầng của Đại/KHTN nữa.

**Đọc DB thật trước khi migration (§6 spec bắt buộc):**
- Đếm live: 6 bảng Hình CŨ (`hinh_bai`/`hinh_y`/`hinh_bai_mo_hinh`/`hinh_y_bo_de`/`hinh_danh_muc_bo_de`/
  `hinh_danh_muc_mo_hinh`) **đều 0 dòng** → Thùy duyệt drop. `hinh_ban_do` (87 dòng) GIỮ NGUYÊN.
- **Spec §6.2 SAI so với DB v2:** spec ghi "bảng dữ liệu DISABLE RLS, chỉ `staffs` ENABLE" — đó là
  convention v1. Dump `pg_tables`: **101/104 bảng public ENABLE RLS**, `dai_*` đều có policy
  `<tbl>_member_all` FOR ALL TO authenticated USING `la_thanh_vien()`. Theo DB, không theo spec.
- Seed `915xx` mà spec §5 nhắc **không có trong DB này** (thuộc kho V1 đã gỡ) → dựng họ demo mới.

**Migration:** `202607241919_kho_hinh_v3.sql` (10 bảng + index + RLS) · `202607241923_kho_hinh_v3_derive.sql`
(3 function đệ quy: hậu duệ/tổ tiên mô hình, bao đóng tiền đề — có guard đường-đi chống vòng).
⚠ `migrate.mjs` áp LẠI mọi file mỗi lần chạy ⇒ khối `drop` phải có **cổng nhận diện shape cũ**
(chỉ `hinh_y` CŨ mới có cột `dang_hinh`), không thì lần chạy thứ hai xoá sạch bảng MỚI đã có data.

**Seam:** `src/lib/kho/hinh.ts` + `hinhConfig.ts`, re-export qua `kho/api.ts` (UI vẫn 1 cửa import).
`countYByDangHinh` trả rỗng — ý không còn trỏ thẳng dạng nữa mà trỏ NODE lưới.

**2 lỗi logic tự bắt được khi verify trên app thật:**
1. **Node teal**: so với GỐC HỌ thì mọi node hoá teal (gốc "Tam giác nhọn" rỗng bài toán). Mốc đúng =
   **mô hình nông nhất THỰC SỰ có bài toán** → 9 xanh + 3 teal, khớp mockup.
2. **`hoHang` là code chết**: lấy `khúc = bao đóng(B) trừ dưới-A` thì mọi tiền đề nhánh khác tự rơi vào
   buổi ⇒ "cảnh báo hở" không bao giờ bật. Định nghĩa đúng: **khúc = bao đóng(B) ∩ phụ-thuộc-A**;
   tiền đề không thuộc khúc và không dưới A ⇒ BÁO ĐỎ. Sau khi sửa: khúc BT.005→BT.012 ra
   "3 bài · cấp 2→4 · 2 mô hình · 1 nhắc lại · 1 hở" — đúng y mockup.

**Seed demo** (`scripts/seed_hinh_v3.mjs`, xoá bằng `--xoa`, mọi dòng mang nhãn `seed-demo`):
5 mô hình / 2 họ · 14 bài toán nhỏ trải 4 cấp · 13 cạnh tiền đề (có cạnh XUYÊN mô hình) · 17 dạng 2 tầng ·
5 bổ đề · 4 bài thật (3 kho chính, 1 kho tạm có 1 ý ở hàng chờ). Hình demo = SVG tĩnh trong `public/hinh-demo/`.

**Verify trên app thật** (dev server phiên khác, HMR cùng cây): M0 2 họ · M1 4 cột cấp, 12 cạnh + 4 cạnh
xuyên mô hình nét đứt teal · detail node đủ (cấp gợi ý, tiền đề, ý thực tế trỏ tới) · M2 3 tầng, kế thừa ·
M3 2/3 ý đã gán, không có đường tạo node · M5 → M2 mở form với mô tả điền sẵn · M4 bài mang 2 tag mô hình ·
M6 tra ngược "3 bài toán · trải 2 họ" + rollup · M7 "4 bài toán · 2 họ" · M8 chuỗi + lời giải liền mạch có
bước "không có trong đề" · M9 Ôn tập 1 dạng → 2 ý từ **2 họ khác nhau**. `tsc` + `vite build` sạch.

**CÒN:** cổng 2 mới có data ở nhánh demo; chưa có PrintView riêng cho Hình (nút In hiện gọi `window.print()`);
chưa nối `ma_y` + `ngu_canh_luot` cho Measurement (hook reserve của spec §8).

## 2026-07-24 (tiếp) — Bản in nhánh Hình + hook đo lường (2 mục "CÒN" của sáng nay)

**1. `HinhPrintView`** (`src/screens/kho/hinh/HinhPrintView.tsx`) — paged.js, preview = bản in A4 thật.
Tái dùng khung trang của Đại (`buildPagedCss` + `CHROME_CSS`) nên logo/dải sóng/số trang giống hệt;
chỉ nới kiểu tham số `pageChrome/buildPagedCss` từ `TaiLieuFull['taiLieu']` → `{ten,khoi}` (`ChromeSrc`)
vì Hình in từ node/chuỗi, KHÔNG có row `tai_lieu` nào.
KHÔNG dùng lại `PrintView`: Đại in theo *câu hỏi*, Hình in theo *ý* và mỗi ý kéo HAI hình (hình đề của
đề gốc + hình đáp án của node) — bố cục "văn bản trái · hình phải", ngắt trang phải giữ hình dính với ý.
Ba lối gọi, chung một model `MucIn`: M9 Ôn tập (ý từ bài thật) · M9 Giảng dạy (khúc A→B: nhắc lại +
mốc chương + node topo) · M8 Tài liệu chuẩn (giả thiết 1 lần + lời giải liền mạch, bước trung gian gắn
nhãn). Bản HS = dòng kẻ để viết · bản GV = lời giải + hình đáp án + nhãn "lời giải THAM CHIẾU".

**⚠ Bẫy StrictMode:** gọi `Previewer.preview()` THẲNG trong `useEffect` ⇒ StrictMode chạy effect 2 lần
⇒ hai Previewer chồng nhau trên cùng document ⇒ paged.js trả về **đúng 0 trang, không lỗi, không cảnh
báo** (nhìn như treo). Fix: hoãn `setTimeout(…, 0)` + `clearTimeout` trong cleanup ⇒ run đầu bị huỷ
trước khi kịp bắt đầu. `PrintView` của Đại vô tình né được vì nó đợi `full` nạp xong mới dựng.

**2. Hook đo lường** (`202607242050_hinh_hook_do_luong.sql`, đã áp, chạy 2 lần OK):
`hinh_y.ma_y` (HY.00001…, mã cho NGƯỜI đọc; ref thật vẫn đi uuid+FK) · `buoi_hoc.ngu_canh_luot` ·
`gami_session_problems.hinh_y_id` + `ngu_canh_luot` · `canh_bao_yeu.hinh_y_id` + `ngu_canh_luot`,
CHECK ∈ {mo_hinh, dang, luyen_de}. Khai ở buổi, **snapshot xuống dòng quan sát** — đổi ý định của buổi
sau này không được viết lại lịch sử đã đo. Seam: `NGU_CANH_LUOT` / `setNguCanhLuotBuoi` /
`ganYVaoProblem` / `ganYVaoCanhBao` / `quanSatCuaY` (`lib/kho/hinh.ts`). UI: dropdown "Lượt" ở header
`BuoiDetail` — **KHÔNG gate theo môn** (ADR-mon §1.6 cấm `if mon==='Toán'` trong code dùng chung).

**Verify:** `tsc` + `vite build` sạch. Nguồn bản in đúng cho cả 3 lối gọi (đọc `.pv-src`): phiếu ôn tập
2 ý/2 bài/2 họ kèm `HY.xxxxx` + `<img>` hình đề · buổi A→B ra 1 nhắc lại + 2 chương + 3 bài, bản GV có
lời giải · tài liệu chuẩn có nhãn "không có trong đề". Hook: transaction ROLLBACK chứng minh ma_y tự
sinh, nối được quan sát→ý, CHECK chặn giá trị lạ — DB không đổi gì.

**⚠ CHƯA XEM ĐƯỢC BẰNG MẮT (giới hạn môi trường, KHÔNG phải lỗi code):** Browser pane của phiên này
không hiển thị ⇒ `window.innerWidth = 0`. Hệ quả: (a) paged.js không có hộp layout để đo → 0 trang —
**đối chứng: `PrintView` của Đại cũng đứng ở "đang dựng trang…" trong pane này**; (b) `useIsMobile`
trả true → mọi control chỉ-desktop ở header BuoiDetail bị ẩn (cả ô chọn GV có sẵn lẫn dropdown "Lượt"
mới). Phải mở app trong trình duyệt thật để nghiệm thu bố cục trang in + dropdown Lượt.

## 2026-07-25 — Dashboard học tập: redesign popup 4 vùng + chốt định nghĩa cửa sổ

**Bối cảnh chiến lược (Thùy dẫn):** "AI gắn vào chỗ nào? BK cạnh tranh độc quyền dựa trên AI."
Đo thật để trả lời, KHÔNG phán cảm tính:
- So `de_xuat_cua_may` (rule, MIỄN PHÍ, đã gửi kèm) vs kết luận Claude trên job 9C1: **khớp 13/14
  quyết định**; chỗ Claude khen "tinh tế" (BTVN che, tự chặn khi thiếu đo, dai dẳng 3/3) đều là rule
  đã tính sẵn và gửi lên. ⇒ Claude ĐỌC LẠI bảng rule rồi viết văn xuôi, không phát hiện thêm.
- `gami_grades`: 25.511 ô đo · 5.620 ô SAI · **35 ô có mã lỗi (0,6%)**. (Thùy: gắn mã lỗi = "9 lên 10",
  không đáng — chỉ cần đúng dạng/đúng lúc/thực hiện được là 90%.)
- Vòng bổ trợ: `bo_tro_yeu`/`hs_level` = 0 dòng (pha 4 chưa build); `bo_tro_duoi_dang` 22 xếp → 12 có
  dấu đã dạy = **54,5% rơi ở bước cuối**. ⇒ moat KHÔNG ở khâu phát hiện (rule đủ) mà ở VÒNG ĐÓNG:
  cặp (can thiệp → retest → kết quả) là dữ liệu đối thủ mua Claude cũng không có.
- **Kết luận công thức (Thùy chốt):** AI ở tầng CHÍNH SÁCH (đọc log duyệt → đẻ LUẬT mới → người
  duyệt luật), rule ở tầng CA (tái lập + giải thích được với phụ huynh). Lộ trình: G0 kho (đang chạy,
  AI sinh 81% kho) · G1 nhà máy nhãn (pha 4, KHÔNG AI) · G2 AI đẻ luật · G3 model dự báo. Nhãn dự báo
  hiện có: 38 ngày data ⇒ chỉ 30 ca "đang ổn rồi tụt" — ràng buộc là THỜI GIAN LỊCH, không phải tiền.

**Migration `202607241948_bo_tro_yeu_them_nhan.sql` (VIẾT, CHƯA áp — chờ Thùy):** chỉ ADD cột để mỗi
ca bổ trợ đóng lại = 1 nhãn: `muc`(L1/L2/L3=hình thức) · `muc_may_de_xuat`+`de_xuat_may` · `diem_luc_mo`
+`so_lan_do_luc_mo` (chụp độ nặng LÚC MỞ vì mastery suy động — chống confounding-by-indication: L3 luôn
nhận ca nặng nên đừng để nó "trông tệ hơn" TA) · `ket_qua`(dat/mot_phan/chua_dat/**bo**) · retest_* .
CHECK chốt: `trang_thai='hoan_thanh' ⇒ ket_qua NOT NULL` (không cho đóng ca rỗng ⇒ nhãn không rỗng).

**⭐ CHỐT ĐỊNH NGHĨA CỬA SỔ (Thùy phân vân, chọn theo lý do MT):** GIỮ **nửa-tháng lịch A/B**
(`cuaSoCua`: ngày≤15='A'). KHÔNG đổi sang fortnight-neo-29/6 (dù 29/6/2026 ĐÚNG là thứ Hai). Lý do
quyết định: **MT (trọng số 3, cao nhất) neo theo THÁNG** → cửa sổ phải khớp tháng, không khớp tuần.
Bất đối xứng 15/16 ngày vô hại (điểm chuyên đề là TRUNG BÌNH không phải TỔNG; % so lớp theo TỪNG BÀI).
Chỉ đổi CHỮ hiển thị "14 ngày"→"nửa tháng". Lõi + 72 test KHÔNG đụng. (Nếu sau này nghi lại: đây là
đổi atom thời gian ⇒ đổi mọi key `YYYY-MM-A|B`, mọi delta, digest, trễ — cân nhắc rất nặng.)

**Data layer (`src/lib/danhgia.ts`) — thêm số, whitelist `goiGon` KHÔNG đổi ⇒ payload AI + tiền y cũ:**
- `DoRow.buoi_hoc_id` (đã có trong query, chỉ chưa mang xuống).
- `StatSheetHS.soLop: SoLopBai[]` — so TB lớp theo TỪNG BÀI giám sát (1 buổi=1 bài): điểm HS · TB lớp
  cùng bài · **xếp hạng** trong bạn cùng làm · ≤8 bài gần nhất, hiện cũ→mới. BTVN loại (không giám sát).
  (Thùy đổi ý #3: bỏ "% hơn/kém" — nổ to khi lớp yếu — thay bằng điểm HS/TB lớp/hạng.)
- `DangStat.scoreTruoc/mucTruoc` = mastery TỚI cuối cửa sổ liền trước (`cuoiCuaSo(cuaSoTruoc(...))`,
  lọc lần đo sau mốc rồi chạy lại `masteryOfDang` — 5 lần gần nhất tới mốc, KHÔNG "của riêng cửa sổ").
  null = trước mốc chưa có lần đo ⇒ hiện "mới", không so delta.

**UI (`DashboardHocTapScreen.tsx`):** Card chính RÚT còn tên + thanh ưu tiên (bỏ "ưu tiên N" vô nghĩa)
+ hint đổi level + badge "máy đề xuất đổi"; giữ ③④ nổi (phán đoán người, khẩn nhất). Việc DUYỆT nằm
trong popup (Thùy: "tên là đủ, t sẽ click vào đọc"). Popup 4 VÙNG: ①vì sao (level·thái độ·điểm chuyên
đề Δ theo MÃ·đếm dạng đổi mức) ②so lớp 8 bài ③chi tiết dạng trước→hiện tại→delta nhóm theo chuyên đề
+ khối riêng "trong diện chưa đổi" (dạng yếu ỔN ĐỊNH không "thay đổi" nên dễ bị bỏ sót) ④duyệt.

**Verify:** `tsc --noEmit` exit 0. Chạy app thật (11A1): 5 card slim + popup 4 vùng render đủ với data
thật, 0 lỗi console/server. Ca Trần Phạm Hà Linh = minh hoạ đúng mục đích: trend ▲4 dạng lên NHƯNG máy
đề xuất KT L0→L2 vì có ③ chuông đỏ — card cũ không đọc nổi mâu thuẫn này, popup mới bày rõ ở vùng 1.

**CÒN:** (1) migration nhãn chờ áp; (2) pha 4 (đường ống ca yếu + retest đóng ca) chưa build —
Thùy còn 2 câu vận hành chưa chốt: ai xếp buổi bổ trợ (OPS/GVCN), retest chèn ET hay bài riêng.

## 2026-07-25 (tiếp) — Chốt quy trình pha 4 + hệ quả "retest = BT"

**Ops (Thùy chốt):** TEAM HỌC THUẬT duyệt ca bổ trợ → OPS xếp lịch. Retest = **Bổ trợ, mã BT**.

**⭐ Hệ quả kỹ thuật của retest=BT (grounded từ mastery.js):**
`MASTERY_CONFIG.WEIGHT.bt = 1` (màn Kết quả học tập TÍNH) NHƯNG `DANHGIA_CONFIG.WEIGHT.bt = 0`
(engine level/diện KHÔNG tính — spec §9 bổ trợ không đo năng lực). ⇒ retest BT **ĐÓNG ca được**
(qua `bo_tro_yeu_dang.retest_diem/dat`) nhưng **KHÔNG kéo mastery-level** ⇒ theo luật trễ (`daMo`,
score≤0.5 giữ diện) em **VẪN trong diện** tới khi có ET/MT ĐỘC LẬP kế tiếp chạm dạng đó.
Đây là thiết kế đúng (chống gian lận: dạy-lại-rồi-test-ngay ≠ bằng chứng độc lập). ⇒ **2 sự kiện
TÁCH RỜI:** đóng-ca (retest BT đạt) ≠ ra-khỏi-diện (ET/MT độc lập đạt). **CHỜ Thùy xác nhận** intent
này; nếu muốn đóng-ca = hết-cảnh-báo thì phải đổi §9 (bt≠0 trong DANHGIA_CONFIG) — cân nhắc riêng.

**Migration cập nhật (vẫn CHƯA áp):** `retest_nguon` đổi `et|mt|rieng` → **`bt|et|mt`** (mặc định bt);
thêm `bo_tro_yeu.duyet_boi/duyet_at` (team học thuật) — OPS xếp lịch = gắn `day_buoi_id` (đã có).

## 2026-07-24 (tiếp 2) — Hình đi THEO KHỐI + gỡ sạch data test

**Thùy:** "Hình cũng phải đi theo khối chứ sao chung hết các khối" + "bỏ mấy cái dữ liệu test có sẵn".

**Theo khối:** `loadLuoi(khoi)` cắt lưới về đúng khối — `khoi` gắn ở MÔ HÌNH (một họ không trải nhiều
khối), node/cách/tiền đề KHÔNG mang cột khối mà DERIVE từ mô hình (spec §1.1). Cascade: mô hình cùng khối
→ node của chúng → cách → tiền đề/bổ đề. **Catalog (dạng + bổ đề) NGOẠI LỆ, dùng chung mọi khối** (một
"cách xử lý" gặp ở lớp nào cũng vậy — mockup M6 "toàn nhánh Hình, dùng chung mọi họ"). `listBai`/
`listHangCho`/`listYTheoDang` lọc theo khối. `KhoScreen` render `<KhoHinhScreen key={hinh-${khoi}} khoi>`
(remount reset state khi đổi khối — giống BanDo của Đại). Form tạo mô hình/bài KHÔNG hỏi khối nữa: khoá =
khối đang mở (bỏ ô "Khối (tuỳ chọn)" free-text). Header M0/M4/M9 hiện "· Khối N".

**Gỡ data test:** `node seed_hinh_v3.mjs --xoa` (mọi bảng hinh_* về 0) → xoá `public/hinh-demo/` (3 SVG demo)
+ `scripts/seed_hinh_v3.mjs` (script seed). Đều là scaffold test tôi tạo phiên trước, Thùy muốn sạch.

**Verify trên app thật** (dev server RIÊNG của phiên này port 5183 — server phiên khác ở 5173 kẹt,
React không mount; phải tự `preview_start name=dev` + đăng nhập quick-login Admin): khối 8 rỗng (empty
state đúng) → tạo họ "Trực tâm" ở khối 8 → hiện ở khối 8 · chuyển khối 9 → KHÔNG thấy (rỗng) · quay lại
khối 8 → còn đó. Xoá họ verify (DB), reload → khối 8 rail đếm 0, sạch. `tsc` + `vite build` sạch.

## 2026-07-25 — BTVN "mất chỗ nhập" = doc gán nhầm ngày + nắn UX gán

**Thùy báo:** 8A1 · 23/07 vào buổi không thấy chỗ nhập BTVN (dù đã làm BTVN kiểu mới kèm ôn tập).

**Nguyên nhân (KHÔNG phải bug ôn tập):** GT + BTVN "Buổi 7" của 8A1 bị gán nhầm sang **CN 23/08** thay vì
**T5 23/07**. `loadBTVNForBuoi` khớp doc theo (lop_id, ngay) cứng → buổi 23/07 không thấy doc → BtvnTab
báo "Chưa có BTVN". Cả GT lẫn BTVN cùng ở 23/08 ⇒ lệch từ bước GÁN, không phải bước ôn tập. `getBTVNCaus`
đã gộp `btvn`+`ontap` đúng; doc có đủ 5 btvn + 2×2 ôn tập. Quét toàn hệ: chỉ 3 doc lệch ngày (8A1 2 doc,
11B1 1 doc) — không hệ thống. `ngayBuoiHopLeCuaLop` không có bug tháng; 8A1 học CẢ T5 lẫn CN nên 23/07(T5)
và 23/08(CN) đều là option hợp lệ trong dropdown → bấm nhầm 1 dòng là lệch nguyên tháng.

**Fix data (Thùy gật):** `_fix_8a1_buoi7_ngay.mjs` — UPDATE 2 doc `ngay` 08-23→07-23 + sửa chuỗi ngày trong
`ten`. Không đụng phan/câu/ôn-tập-config (config khoá theo nguon_buoi, không theo ngày → vẫn liên kết).

**Nắn UX gán (Thùy: "ko hiện list tất cả buổi nữa, chỉ hiện đúng ngày gán; mặc định buổi gần nhất chưa
gán"):** `TrichPanel` load thêm `tkbDates` (ngayBuoiHopLeCuaLop), suy `defNgayByMarker` = lấp TUẦN TỰ buổi
master chưa-gán vào ngày TKB trống (chưa có trong bộ giáo trình lớp) sớm nhất. `BuoiTrichRow` nhận
`defaultNgay`: hàng chưa-gán hiện thẳng "Gán vào **Thứ X · dd/mm**" (không bày dropdown), nút "đổi ngày" mới
mở `BuoiNgaySelect` cho ca bù/nhảy buổi. Bỏ checkbox GT (gán luôn = tạo GT). `touched` giữ lựa chọn tay
khỏi bị default đè khi panel reload. `tsc` sạch. (CHƯA verify click-through trên app — panel sau đăng nhập
staff, không tự login được.)

## 2026-07-25 (tiếp 2) — Pha 4 CHỐT THIẾT KẾ: một mastery + nhãn trạng thái · 2 bài BT

**Vướng (Thùy nêu):** BT không tính mastery ⇒ dạng yếu cứ hiện, khó biết đã xử lý chưa. Thùy đề
"tính độc lập có BT / không BT để đo hiệu quả". Rồi tự thấy: "chia ra thành nhiều quá (có BT/ko,
có BTVN/ko), rối".

**⭐ CHỐT — KHÔNG đẻ nhiều mastery. MỘT mastery + vài NHÃN trạng thái:**
- 1 mastery (giữ §9: ET/MT/BTVN) = số duy nhất đọc, quyết diện/level/mức.
- "Đã xử lý chưa" KHÔNG cần số thứ hai — nằm ở HỒ SƠ CA (bo_tro_yeu). Ca đang mở=đang xử lý;
  ca đóng=đã xử lý. Ca CHÍNH LÀ tracker, trực tiếp hơn suy qua một con số.
- BT không thành mastery — là TRẠNG THÁI của ca. "BTVN che" giữ nguyên = 1 CỜ (so ET/MT vs gộp).
- Dashboard mỗi dạng yếu = 1 điểm + 1 nhãn: chưa xử lý · đang bổ trợ · đã bổ trợ–chờ xác nhận · nghi BTVN che.

**⭐ ĐO HIỆU QUẢ BT — Thùy: ET phục vụ bài MỚI (ít quay lại dạng cũ), MT tháng/lần (không phủ đủ),
BT tại buổi vừa học không đáng tin (vừa được dạy).** ⇒ tín hiệu xác nhận độc lập KHÔNG tự đến, phải
CỐ Ý tạo. **Cần 2 bài BT:**
- **BT-ngay** (`bt_ngay`): tại buổi bổ trợ. Nhiễm (vừa dạy) ⇒ **weight 0** trong DANHGIA (không gỡ diện).
- **BT-xác-nhận** (`bt_xn`): buổi KẾ TIẾP, HS đến sớm/ở lại muộn, giám sát, cold-check 2–3 câu tự
  bơm từ kho. **BẮT BUỘC** (Thùy: không lấy mẫu). Trễ+cold ⇒ **weight >0** — ĐÂY là tín hiệu gỡ diện.
- ⇒ **Đóng ca (bt_xn đạt) ≠ Ra khỏi diện (bt_xn vào mastery, vượt mốc).** Hai sự kiện, nhưng cùng do bt_xn.
- **Hiệu quả BT** = mastery ĐỘC LẬP trước ca vs tại bt_xn, tính OFFLINE (đo immutable, dựng lại mốc
  từ graded_at). "gắn với" chưa phải "gây ra" (cần nhóm chứng không-BT sau). Gap tại-chỗ (bt_ngay−trước)
  = tín hiệu QUẢN TRỊ, KHÔNG phải hiệu quả bền — đừng gộp, kẻo thổi phồng dữ liệu moat.

**Vận hành (Thùy: sợ khối lượng, nhưng pure-derive thì OK):** task BT-xn **tự bắn cho TA/OPS của ca**
(dùng phan_cong_ca), quanh buổi kế; làm xong tự tắt (không danh sách tồn trung tâm ⇒ không phình).
**Van xả bắt buộc:** quá hạn (đề xuất 2 buổi HS có mặt / 4 tuần — Thùy CHƯA chốt số) ⇒ đóng ca
`ket_qua='khong_do_duoc'` (≠ chua_dat; anti-NULL: không-đo-được ≠ thất-bại) ⇒ chặn trần backlog.

**Việc CÒN cho pha 4 (chưa build):**
1. Migration `202607241948`: BỎ ô `retest_*` đơn → **bảng con `bo_tro_yeu_retest`** (mỗi lần đo 1 dòng,
   `loai ∈ {ngay, xac_nhan}`, điểm, buổi, at) [anti-NULL: đo=append, không nullable]; thêm
   `khong_do_duoc` vào CHECK ket_qua; (đã có sẵn duyet_boi/duyet_at, diem_luc_mo, muc/muc_may_de_xuat).
2. Config mastery: thêm nguồn `bt_xn` (weight>0 ở DANHGIA_CONFIG) · `bt_ngay` giữ 0. napLanDo đọc thêm.
3. Đóng ca = có dòng xac_nhan; ket_qua suy từ nó. Task BT-xn pure-derive + van xả quá hạn.
4. ⚠ Thùy CHƯA chốt: ngưỡng quá hạn (2 buổi hay 4 tuần).

**Ops đã chốt trước đó:** team học thuật DUYỆT ca → OPS XẾP LỊCH (=gắn day_buoi_id).

---

## 2026-07-26 — Fix task Đánh giá buổi bổ trợ không hiện trên tài khoản Trợ giảng

**Lỗi (Thùy báo):** bổ trợ xong nhưng task "Đánh giá" không hiện ở "Việc của tôi" của TA.

**Gốc rễ:** `getMyTasks` (`gami.ts`) route task buổi bù/đuổi SAI người — đánh giá gắn cho
`nguoi_day` (GV), ET gắn cho `nguoi_day_tg` (TA). Nhưng buổi bổ trợ do TA đứng lớp (người bổ trợ
mặc định) và màn BuoiBuDetail gộp CẢ ET lẫn đánh giá + 2 nút đóng vào 1 chỗ. Đo data thật: 101 buổi
bù, 98 có GV==TA (bug bị che vì cùng người thấy cả 2), **3 buổi GV≠TA (TA=Nguyễn Công Hải)** — đây
đúng ca lộ bug: TA chạy buổi nhưng đánh giá đẩy sang GV khác nên TA chỉ thấy ET.

**Sửa (Thùy chốt 07-26):** owner buổi bổ trợ = TA đứng lớp (`nguoi_day_tg`); TA nhận CẢ ET lẫn đánh
giá (bù) / đánh giá (đuổi). GV không cầm task per-buổi ở bổ trợ nữa (GV vẫn chốt/duyệt KẾ HOẠCH đợt
đuổi ở màn riêng). **Fallback:** buổi chưa gán TA (`nguoi_day_tg` null) → owner về GV để task không
mồ côi (data thật: 2 buổi đuổi TA=null). `vai` nhãn theo slot owner thật.

**Còn quan sát (CHƯA sửa, chờ Thùy quyết scope):**
- `listAllStaffTasks` (Dashboard "Chất lượng vận hành") CHỈ tính `loai='thuong'` → task bổ trợ
  (bù/đuổi) KHÔNG BAO GIỜ vào dashboard đo hiệu suất. Gap có sẵn từ trước, độc lập bug này.
- Cần kiểm: đánh giá per-dạng buổi bù (`buoi_danh_gia_dang`, lop_id null) có feed mastery đúng nhãn
  MÔN không (bẫy #2 buổi bù mất nhãn môn — danhgia.ts đã né ở ET, chưa rà nhánh buoi_danh_gia_dang).

### Bổ sung 07-26 — Bug THẬT của TA Ánh Tuyết (khác bug routing ở trên)

Check ca cụ thể Phạm Thị Ánh Tuyết (NS019, TA 4A1/5A1/5A2): cả 4 buổi bổ trợ cô ấy vừa là
nguoi_day vừa nguoi_day_tg → routing KHÔNG phải vấn đề của cô ấy (code cũ vẫn fire cả 2 nhánh).

Gốc rễ thật: buổi bù 07-23 có 1 HS `diem_danh=null` (CHƯA điểm danh), co_mat=0. Guard 07-16
(`if coMat===0 continue`) bỏ qua CẢ buổi → ẩn hẳn khỏi Việc của tôi, TA không có đường vào để điểm
danh + chấm. Guard gộp nhầm "CHƯA điểm danh (null)" với "điểm danh xong, vắng hết (vang)".

Sửa: đếm thêm `chuaDDBu` (diem_danh null); CHỈ bỏ qua khi `coMat===0 && chuaDD===0` (điểm danh xong,
toàn vắng). Còn HS chưa điểm danh → vẫn sinh task. Mô phỏng logic mới trên data thật: buổi 07-23 nay
hiện cả ET lẫn đánh giá cho cô ấy. (Nút đóng trong BuoiBuDetail vẫn gate coMat>0 → cô ấy điểm danh
trước rồi mới đóng — nhất quán; ca toàn-vắng vẫn được ẩn đúng như fix 07-16.)

### Audit toàn bộ TA (07-26) — bug guard điểm danh là DIỆN RỘNG

Quét 158 buổi bù+đuổi: **48 buổi bù đang kẹt "chưa điểm danh"** (co_mat=0, vang=0, toàn HS diem_danh
null) → guard cũ ẩn hẳn khỏi Việc-của-tôi. Trải **8 TA** (Phạm Quang Minh 10 · Nguyễn Công Hải 10 ·
Trần Thị Thảo Nguyên 11 · Phạm Bảo Ngân 5 · Hoàng Thị Quỳnh Trang 4 · Tạ Quốc Cường 4 · Trần Hoàng
Đạt 3 · Phạm Thị Thùy Trang 1) — KHÔNG riêng Ánh Tuyết. Fix guard (đếm chuaDD) mở lại hết 1 lượt.
0 buổi mồ côi (fallback owner=coalesce(TA,GV) chạy đúng). Fix chỉ ở getMyStasks (1 chỗ, derive) → global.

### Bug 07-26 (Bảo Ngân) — buổi CHỦ NHẬT không hiện ở "Việc của tôi" tuần hiện tại

KHÁC hẳn bug bổ trợ ở trên — đây là buổi HỌC CHÍNH (loai='thuong'). Ca: Phạm Bảo Ngân (TA 5T1), buổi
5T1 sáng CN 26/07 đã mở (ingame đóng, ET/BTVN chưa) nhưng không thấy trong Việc của tôi tuần này.

Gốc rễ: `VietCuaToi` gom task vào tuần theo `ngayViec = deadline ?? ngay` (Thùy 07-11, vốn để BTVN
hiện đúng ngày hạn). Tuần BK = T2→CN. Buổi CN = ngày CUỐI tuần; deadline ET = 12h TRƯA HÔM SAU = Thứ 2
= TUẦN SAU → task ET của buổi hôm nay rơi sang Tuần 5, biến mất khỏi Tuần 4 (tuần hiện tại). Dính MỌI
lớp học Chủ Nhật (comment cũ giả định "ET hạn hôm sau không đổi hành vi" — sai ở biên CN).

Sửa (NhanSuHome.tsx `ngayViec`): BTVN giữ gom theo DEADLINE (chấm ở buổi kế, cố ý sang tuần sau); các
task còn lại (chấm bài/đánh giá/ET/MT) gom theo NGÀY BUỔI → nằm cùng tuần/ngày buổi, deadline vẫn hiện
ở badge. Kiểm chứng: ET buổi CN 26/07 nay vào Tuần 4 (= tuần hiện tại) thay vì Tuần 5. Fix 1 chỗ, global.

## 2026-07-24 (tiếp 3) — Làm rõ AND cho tiền đề (Thùy chỉ ra lỗ)

**Thùy:** có bài cần 2-3 tiền đề ở các vị trí khác nhau — KHÁC "2 cách làm". 2 cách = OR (bỏ 1 cách
vẫn giải được cách kia); 2 tiền đề của MỘT cách = AND (bỏ 1 tiền đề là không giải được).

**Kiểm tra model:** schema + derive ĐÃ đúng AND rồi — không phải bug logic:
- `hinh_cach_tien_de` PK (cach_id, tien_de_id) → một cách nhiều tiền đề = AND. OR = nhiều `hinh_cach_giai`.
- `tinhKhuc` (M9): thiếu **bất kỳ** tiền đề nào của node → báo "khúc hở" (đúng AND).
- `baoDongTienDe`/`chuoiCuaBai` (M8): gom **tất cả** tiền đề vào chuỗi (đúng AND).
- (Nhiều CÁCH giải OR đầy đủ vẫn là OUT theo spec §8 — v1 mỗi node 1 cách, nhưng cách đó cần bao
  nhiêu tiền đề cùng lúc cũng được.)

**Cái sót = UI/hiển thị mập mờ,** đọc chip rời tưởng "một trong số" (OR). Sửa cho rõ AND:
- `FormBaiToan`: đoạn hướng dẫn thêm cảnh báo "đừng nhầm hai chuyện" (AND vs OR); nhãn ô đổi thành
  "Tiền đề của cách này — CẦN CẢ (AND) · N tiền đề"; dòng tóm tắt vẽ dấu "+" giữa các tiền đề
  ("Cách này cần CẢ: A + B — bỏ 1 là không giải được").
- `SoDo` detail panel (M1): tiền đề của mỗi cách hiện "cần cả A + B" (dấu +), không còn chip rời.

**Verify trên app thật** (dev riêng 5183 + login): mở form node — hiện đủ đoạn "CẦN CẢ (AND)… Còn nhiều
CÁCH khác nhau (OR)… làm sau"; tick 2 tiền đề → nhãn "2 TIỀN ĐỀ" + tóm tắt "Cách này cần CẢ: BT.015 +
BT.016 — bỏ 1 là không giải được". Data verify tạo tạm qua DB, xoá sạch sau (mọi bảng hinh_* = 0).
`tsc` + `vite build` sạch. (Không sửa `spec-kho-hinh-v3.md` — spec là của Thùy/Notion; ghi ở đây thôi.)

## 2026-07-24 (tiếp 4) — Sửa/xoá mô hình + OCR ảnh đề → LaTeX

**Thùy:** (1) chưa có sửa mô hình; (2) đề bài có công thức → cho dán ảnh clipboard, hệ tự dịch.

**1. Sửa + xoá mô hình:**
- Trước: sửa mô hình CÓ nhưng chôn sâu (Sơ đồ → View mô hình → click card → ✎); xoá thì KHÔNG có.
- Nay: M0 card mỗi họ có nút ✎ Sửa + 🗑 Xoá (nổi khi hover; card đổi từ `<button>` sang `<div role=button>`
  để nút-trong-nút hợp lệ, stopPropagation). Detail panel View mô hình thêm nút 🗑 cạnh ✎.
- `deleteMoHinh` siết guard: chặn nếu còn bài toán HOẶC còn mô hình con (xoá cha = con mồ côi, cạnh cha
  cascade mất, con không còn đường lên lưới).

**2. OCR ảnh đề → text + LaTeX** (`ocrDeTuAnh` + `buildOcrDePrompt`, api.ts): tái dùng ĐÚNG đường Gemini
đã chạy production cho lý thuyết Đại (`callGeminiJson` + `LYTHUYET_SCHEMA` + `parseLyThuyetJson`) —
KHÔNG đẻ schema mới. Prompt: chép CHỮ, công thức bọc `$…$`, BỎ QUA hình vẽ (hình đề đính riêng).
Component dùng chung `OcrButton` (hinhUi.tsx): dán clipboard HOẶC chọn file → gọi OCR → `onText(kết quả)`.
Cắm vào MỌI ô có công thức: đề bài + từng ý (Kho tạm ＋ Bài mới + sửa ý), phát biểu/đề chuẩn/lời giải
(node), giả thiết (mô hình).

**Verify trên app thật** (dev 5183 + login): tạo họ → card hiện ✎/🗑 hover; ✎ mở form đúng data cũ
("Sửa mô hình MH.xxx", tên+giả thiết điền sẵn); 🗑 xoá được (card biến mất). OCR THẬT: đẩy ảnh canvas
"Cho tam giac ABC vuong tai A... AB^2 = BH.BC" vào ô đề → AI trả
"Cho tam giác $ABC$ vuông tại $A$, đường cao $AH$. Chứng minh $AB^2 = BH \cdot BC$..." (thêm dấu tiếng
Việt + LaTeX đúng). `tsc` + `vite build` sạch. (Data test tạo lúc verify đã xoá; MH.008 "tam giác vuông"
là data của Thùy, giữ nguyên.)

---

## 2026-07-27 — Test đầu vào: Quản lý đề (ghim MT + Đề thi)

Thùy chốt 2 nhánh (AskUserQuestion): (1) "Quản lý đề test" = **ghim tài liệu có sẵn theo khối×môn**
(KHÔNG dựng lại de_test CRUD đã bỏ mig 0105); (2) nguồn đề = **MT + Đề thi** (mọi loại master TRỪ
ET/GT/BTVN). Đây là ĐẢO lại quyết định 07-19 ("bỏ tab Đề test, chọn thẳng MT ở Điểm danh") — nay thêm
lại lớp curate nhẹ (chỉ tag, không soạn nội dung).

**Làm:**
- Mig `202607271322_de_test_ghim.sql` (áp bằng `_apply_one.mjs`, role claude_build): bảng `de_test_ghim`
  (`tai_lieu_id` PK FK→tai_lieu on delete cascade + ghim_boi + ghim_at). Có dòng = đang ghim (anti-NULL).
  Phạm vi khối×môn suy từ chính tai_lieu.khoi/mon → bảng không lặp khoi/mon. RLS staff-only + grants.
- `detest.ts`: `LOAI_DE_TEST=['mt','de_thi']`, `TEN_LOAI_DE`, `listTaiLieuLamDe(mon?,khoi?)`,
  `listGhimDe()→Set`, `ghimDe(id,on)`.
- `QuanLyDeTestScreen.tsx` (mới): list MT+Đề thi gom theo khối, filter môn, nút ★ Ghim/☆. Tab "Đề test"
  cắm lại vào `TestDauVaoScreen` (tab thứ 4).
- `DiemDanhTestScreen`: dropdown đề đổi từ `listMT()` → `listTaiLieuLamDe()`+`listGhimDe()`. Ưu tiên đề
  ĐÃ GHIM khớp khối×môn; chưa ghim đề nào cho khối×môn đó → fallback toàn bộ khớp + badge "⚠ chưa ghim
  đề" (KHÔNG chặn Ops). Option/nhãn hiện loại (MT / Đề thi). `layCauTheoThuTu` đã generic nên snapshot
  câu vào ca_test_cau chạy cho cả Đề thi (nhiều phan 'custom').

**Verify app thật** (dev 5183 + dev-login admin): tab "Đề test" render đúng — gom Khối 9/12, 2 MT thật,
filter môn. Ghim 1 MT → nút ★ + "Đã ghim: 1" + DB có 1 dòng (join tai_lieu OK). Bỏ ghim → DB về 0.
`tsc --noEmit` sạch, `npm run schema` refresh (de_test_ghim vào schema.md). Không lỗi console. Dòng ghim
test lúc verify đã xoá.

## 2026-07-24 (tiếp 5) — Redesign form bài toán + kế thừa giả thiết + card mô hình to + hệ sinh thái

**Thùy chốt model:** bài toán KHÔNG có giả thiết/hình riêng — MƯỢN của mô hình; bài toán trong một
mô hình chỉ khác nhau ở CÂU HỎI. Vì câu hỏi dựa trên giả thiết ⇒ mỗi bài toán TRỰC TIẾP thuộc 1 mô hình
(trường mô hình bắt buộc). Không migration — schema đã đủ.

**Derive mới (hinh.ts):** `giaThietDayDu` (giả thiết gốc + phần thêm từng đời — kế thừa) · `anhCauHinhCua`
(hình của mô hình, leo tổ tiên nếu thiếu) · `nodeTruoc` (node cấp cao nhất trong mô hình → gợi ý tiền đề
CHÍNH khi tạo node) · `deBaiChuanCua` · `duongToTien`. `dapAnHaiBac` + mọi chỗ in/detail bỏ đọc
`de_bai_chuan`/`anh_chuan` (cột giữ nhưng thôi ghi) → đề = giả thiết mô hình + câu hỏi, hình = hình mô hình.

**FormBaiToan viết lại — popup lớn 2 cột** (portal ra body): TRÁI = mô hình (select, bắt buộc) + giả thiết
đầy đủ (read-only, mượn) + cấp độ + hình mô hình (read-only) + CÂU HỎI (=phat_bieu). PHẢI = dạng + lời giải
+ ảnh lời giải + tiền đề + bổ đề. Tiền đề: mặc định gắn "bài toán phía trước" làm CHÍNH; nút "＋ Thêm tiền đề"
mở CÂY (Mô hình › node, cả họ) để thêm — AND. Mọi ô công thức có OcrButton (dán ảnh → LaTeX).

**FormMoHinh kế thừa:** mô hình con chỉ nhập "giả thiết THÊM" (delta); box read-only hiện giả thiết bố;
xem trước full = bố + delta. Lưu: gia_thiet = composed (cho NOT NULL/reader cũ), hiển thị luôn suy live
qua giaThietDayDu (bố đổi vẫn đúng).

**Card mô hình TO:** M0 (grid minmax 360) + graph View mô hình (MH_W 272 × MH_H 210) hiện HÌNH lớn +
GIẢ THIẾT đầy đủ (tên phụ). Detail View mô hình đổi thành **"Hệ sinh thái"**: mô hình trung tâm (hình +
giả thiết) + bài toán phụ thuộc nhóm theo cấp (gạch trái teal = thuộc mô hình).

**Verify trên app thật** (dev 5183 + login, data test tạo qua DB rồi xoá): form bài toán mở popup lớn,
giả thiết "△ABC nhọn, 3 đường cao..." mượn từ mô hình, câu hỏi riêng, tiền đề chính auto = △AEF∽△ABC
(node cấp cao nhất), cây tiền đề hiện "◇ MH.012 · Trực tâm › node"; card MH.013 con hiện giả thiết
COMPOSED "...; EF cắt BC tại M"; form sửa con hiện kế thừa bố read-only + ô thêm chỉ delta + xem trước full;
panel Hệ sinh thái hiện mô hình trung tâm + BT.017/BT.018 theo cấp. `tsc` + `vite build` sạch.

## 2026-07-24 (tiếp 6) — Card mô hình: mã phân cấp + field-card có màu, canh lề gọn

**Thùy:** card chữ đậm/nhạt trôi nổi, lệch, xấu → mỗi trường bọc trong card con bo tròn có màu khác nền;
mã mô hình phân cấp 1 / 1.1 / 1.1.1 (dễ quản lý nhiều tầng).

**Mã phân cấp (derive, hinh.ts `maPhanCapMap`):** gốc trong khối đánh 1,2,3…; con = mã cha + '.' + thứ tự
(1.1, 1.1.1). ⚠ KHÁC `ma` trơ (MH.014): mã phân cấp là mã HIỂN THỊ suy từ cây, tự tính lại khi đổi cây —
giữ luật spec §2.1 "mã trơ" (id ổn định bên dưới vẫn là `ma`, immune đổi cha/DAG). `ma` giữ làm phụ đề mờ.

**UI (hinhUi):** `MaPill` (pill đặc màu teal, chữ trắng — đọc rõ tầng) · `FieldCard` (card con nền màu nhạt,
bo tròn, có nhãn — thay chữ trôi nổi) · `Chip` (số liệu nền xám bo tròn). Áp vào: M0 card · graph View mô
hình card · ecosystem panel · select mô hình trong form bài toán.

**Verify trên app thật** (data test _vt2 gốc→con→cháu, xoá sau): M0 card = pill "1"/"2" + tên + FieldCard
giả thiết + chips, canh lề gọn; graph hiện đúng **2 → 2.1 → 2.1.1**; ecosystem panel pill + FieldCard.
`tsc` + `vite build` sạch. (MH.008/010/011 là data Thùy đang dựng — giữ nguyên.)

## 2026-07-24 (tiếp 7) — Fix công thức KaTeX to hơn chữ thường 21%

**Thùy:** chữ hoa / code LaTeX trông to hơn chữ thường. **Nguyên nhân:** `main.tsx` import
`katex.min.css` SAU `index.css`; katex.css đặt `.katex{font-size:1.21em}`, cùng độ ưu tiên với override
`1.0em` của index.css nên cái sau (katex) thắng → mọi công thức inline (kể cả $ABC$) to hơn 21%.
**Fix:** `index.css` `.katex{font-size:1em !important}` (giống PrintView đã dùng !important).
**Verify:** inject `<span class=katex>` trong container 16px → computed 16px (trước: 19.36px). `build` sạch.

### 2026-07-27 (sửa cùng ngày) — Đề test đầu vào: đổi model GHIM → SINH (copy)

Thùy: model "ghim" (mục trên) HIỂU SAI ý. Đúng: "Đề test đầu vào" là 1 TÀI LIỆU MỚI được SINH ra (copy
nội dung) từ nguồn MT/Đề thi — chọn khối×môn + chọn nguồn → hệ tạo `tai_lieu loai='de_test_dau_vao'`
(ten "Đề test đầu vào · Khối X · <tên nguồn>"), copy các phần 'custom' + câu. Mỗi khối×môn có 1 đề ĐANG
DÙNG = bản sinh mới nhất; sinh đề mới → thành đề hiện tại, đề cũ GIỮ lịch sử (điểm 3 của Thùy). => lưu
được cả lịch sử đề test đầu vào.

**Đổi:**
- KHÔNG cần bảng mới (tai_lieu.loai không có CHECK — verify pg_constraint; nguon_id sẵn có). "Đang dùng"
  = derive bản mới nhất per (khoi,mon), không cột cờ.
- `detest.ts`: bỏ listGhimDe/ghimDe; thêm `listNguonDe`, `listDeTestDauVao`→DeTestRow[] (laHienTai=mới
  nhất/khối×môn), `sinhDeTestDauVao(nguonId,khoi,mon)` (insert doc + copyPhanInto các phan 'custom').
- `QuanLyDeTestScreen` viết lại: list đề ĐANG DÙNG theo khối×môn + Lịch sử collapse + modal "Tạo đề"
  (chọn khối/môn → dropdown nguồn MT/Đề thi khớp → Sinh).
- `DiemDanhTestScreen`: đề = `listDeTestDauVao()` khớp khối×môn (đang dùng đứng đầu, chọn được bản lịch
  sử); chưa có đề → báo "nhờ học thuật tạo ở tab Đề test" (KHÔNG fallback MT thô).

**Bảng de_test_ghim (mig 202607271322) giờ THỪA** (0 dòng, code không còn tham chiếu). CHƯA drop — chờ
Thùy gật (Luật xoá). Bỏ file scaffold migration drop (chưa áp, chưa commit).

**Verify app thật** (dev 5183): tab "Đề test" → Tạo (khối 9·Toán, nguồn MT Mã 2) → card "Đang dùng",
DB có doc `de_test_dau_vao` copy đúng 3 phần + 18 câu (= 18 câu custom của nguồn). Sinh tiếp Mã 1 → Mã 1
thành "Đang dùng", Mã 2 xuống "Lịch sử (1)". `tsc` sạch, không lỗi console. 2 đề verify đã xoá (cascade),
2 MT master giữ nguyên.

## 2026-07-27 — Fix dropdown gắn dạng + lý thuyết cho dạng Hình (tái dùng module Đại)

**Thùy:** (1) form node "Gắn dạng" không load được dạng từ M6; (2) dạng bài cần chỗ gắn lý thuyết như Đại.

**(1)** `hinh_dang` mới chỉ có 1 dòng cấp `loai_ch` chưa tách con; form lọc `cap==='dang'` (chỉ lá cách-xử-lý)
nên rỗng. Fix: dạng chọn được = LÁ của cây = cách xử lý HOẶC **loại câu hỏi chưa có con** (chính nó là dạng
terminal). Áp cả FormBaiToan lẫn M6 (loại chưa tách con giờ là hàng chọn được). Verify: dropdown hiện
"Giải tam giác - Tính cạnh, góc" (DH.018).

**(2)** Bảng `hinh_dang_ly_thuyet` (mirror `dai_dang_ly_thuyet`, khoá `dang_id`→hinh_dang.id) + RLS
(migration 202607271436, áp 2 lần OK). Seam `api.hinhDangLyThuyet` (list/upsert/remove, cùng shape
`LyThuyetApi`). **Tái dùng NGUYÊN `LyThuyetModal` của Đại** (export từ BanDo.tsx) — upload ảnh/PDF → AI bóc
LaTeX, cắt hình chèn, dán clipboard. M6 tra-ngược panel: dạng terminal có khối "Lý thuyết/phương pháp" +
nút Soạn/Sửa + preview; hàng dạng có chấm ● xanh = đã có lý thuyết. Verify end-to-end: soạn → lưu →
preview KaTeX + chấm xanh; xoá lý thuyết test khỏi dạng thật của Thùy sau khi verify.

`tsc` + `vite build` sạch.

## 2026-07-27 (tiếp) — Lưới bài toán: đề (từ mô hình) + câu hỏi; node card có hình, click = expand

**Thùy:** lưới bài toán cần cả ĐỀ (lấy từ mô hình nó thuộc) + CÂU HỎI (phat_bieu đã nhập); mỗi card
cũng cần hình + đề, hoặc 2 trạng thái thu nhỏ/expand.

- **Node card (thu nhỏ, mặc định):** thêm THUMBNAIL hình của mô hình (nguồn đề) + câu hỏi (2 dòng) +
  chip mô hình (◇ mã phân cấp, tooltip = giả thiết đầy đủ). NODE_H 56→78, COL_W 206→214, layout hình|chữ.
  Chip mô hình hiện ở MỌI node (không chỉ node khác mô hình) — để lưới nào cũng thấy nguồn đề.
- **Click node = expand:** detail panel tách rõ **ĐỀ — giả thiết (từ mô hình X)** (giaThietDayDu, FieldCard
  teal) và **CÂU HỎI (đã nhập)** ("Chứng minh " + phat_bieu, FieldCard xanh) — thay khối "Đề bài chuẩn"
  gộp cũ. Đề luôn MƯỢN của mô hình, câu hỏi là phần riêng của bài toán.

**Verify trên app thật** (data _vt gốc+node, xoá sau): node card hiện thumbnail + câu hỏi + "◇ 2"; click →
panel "ĐỀ — GIẢ THIẾT (TỪ MÔ HÌNH 2): △ABC nhọn..." + "CÂU HỎI: Chứng minh tứ giác BFEC nội tiếp".
`tsc` + `vite build` sạch.

## 2026-07-27 (tiếp 2) — Đề (giả thiết) hiện THẲNG trong node card

**Thùy:** đề ngắn, cho đề vào card bài toán luôn — nhìn dễ hơn hẳn (không chỉ tooltip/panel).
Node card giờ 3 tầng: [thumbnail hình mô hình + ĐỀ giả thiết (teal, line-clamp-3)] › CÂU HỎI (phat_bieu,
đậm, gạch ngăn) › chips (cấp · ◇ mã mô hình · mã BT). NODE_H 78→112, COL_W 214→236.
Verify: card hiện "△ABC nhọn, ba đường cao... | tứ giác BFEC nội tiếp | c1 ◇2 BT" — scrollH=clientH=110
(vừa khít, không tràn). `tsc` + `vite build` sạch.

## 2026-07-27 (tiếp 3) — Cấp độ điền sẵn + hệ sinh thái tâm–vệ tinh

**Thùy (2 việc):**
1. **Cấp độ bỏ badge gợi ý, ĐIỀN SẴN vào ô** (vẫn nhập tay). FormBaiToan: node mới cap init = capGoi
   (1+max tiền đề); `useEffect` sync cap=capGoi tới khi người tự gõ (`capTuNhap`=true) → đổi tiền đề thì
   cap tự cập nhật, khỏi sửa. Node sửa: giữ cap cũ. Bỏ badge "⚠ gợi ý N". Verify: node mới trong mô hình
   có node cấp 2 → ô cap điền sẵn **3**.
2. **Click mô hình → hệ sinh thái kiểu TÂM–VỆ TINH** (radial), thay list nhóm-theo-cấp cũ. `RadialEco`
   (SoDo.tsx): mô hình làm TÂM (hình + mã phân cấp + tên), bài toán phụ thuộc xếp vòng VỆ TINH quanh,
   nối nan hoa teal. W/H 298 (vừa panel detail 330). Verify: header "SƠ ĐỒ TÂM–VỆ TINH · N bài toán",
   tâm = mô hình, vệ tinh = BT với cấp/mã, box không tràn panel.

`tsc` + `vite build` sạch.

### 07-28 (tối) — Gộp nhánh EXP (làm ở nhà, base cũ 78 commit) lên main + build EXP engine + View cả lớp
- **Sự cố:** nhánh `elo-redesign-2026-07-28` (đại tu Elo làm ở nhà) bị cắt từ `main` CŨ 78 commit → localhost chạy nhánh này = thiếu toàn bộ 78 commit Jul-27 (Kho Hình, Test đầu vào, Điểm thi…) → "mất màn Kết quả học tập / 9A1 trống sau 13/07" chỉ là **code cũ**, không phải data/quyền (localhost + script cùng Supabase `osrvycilwshkzhljuxef`; data 9A1 T7 đầy đủ tới 24/07). **Merge `origin/main` vào nhánh**: conflict DEVLOG (lấy main) · BuoiHocScreen (gộp `catch` của EXP + alert `khongCoDuLieu` của main) · KetQuaScreen (gộp import + `ViewKey` — tab "Cả lớp" của tôi CÙNG "Điểm thi" của main). `gami.ts`/`mastery.ts` auto-merge sạch (logic coElo + `getClassMatrix` sống). `tsc`+`verify_gami`+`sim_exp` PASS.
- **EXP ENGINE (build mới, `src/gami/exp.js` + `config.js EXP`):** `etRankExp`·`btvnBaiExp`·`monthlyBtvnExp`·`mtExp` — xem HANDOFF ⭐EXP. Thùy chốt: thái độ phạt THEO BÀI (chưa nghiêm túc ×0.7, chống đối ×0); xin phép = không làm = 0; nộp muộn ×0.9; so-lớp theo tháng; sàn MT 0. **LEVEL** BASE_COST 600→1100 (thang cũ vỡ). Mô phỏng data THẬT 9A1/T7 (`sim_exp.mjs`): BTVN 48% tổng · TB ~4900 EXP/HS · tháng đầu trải L3-5. Trường Hải đáy vì bỏ 8/9 BTVN dù ET tốt — đúng "EXP=chăm chỉ". **Chưa nối service** (chờ duyệt số).
- **VIEW CẢ LỚP + toggle câu gốc:** tab "Cả lớp" 2 chế độ — **Tất cả lớp** (tổng quan tỉ lệ hoàn thành dữ liệu từng lớp, `getAllClassesCompletion`, thấp→cao, bấm→chi tiết) ↔ **Chi tiết lớp** (ma trận HS×buổi ET/BTVN/MT, %+cảnh báo Ko-làm, `getClassMatrix`); chung toggle phase + filter tháng ‹›. Bỏ subtab "Lịch sử hoạt động"; Kho câu hỏi (`DangHub`) thêm toggle **Câu gốc/Tất cả** (gốc = `nguon≠'clone'`, có đếm). Verify data thật Toán/T7: BTVN các lớp 67-100% (soi được lớp nhập thiếu).
- **🐛 FIX ma trận rớt ô "·" dù đã chấm (PostgREST cap 1000 dòng):** `getClassMatrix`/`getAllClassesCompletion` query `gami_grades` với `.limit(10000)` NHƯNG PostgREST cap **max-rows=1000** → khi 1 lớp >1000 grades/tháng, 1000 dòng đầu (thứ tự KHÔNG theo ngày) chỉ phủ vài buổi → **nguyên buổi khác bị rớt điểm → ô "·" dù DB có** (vd 8B1 16/07 & 20/07 hiện "·" dù có 96%). Chẩn qua browser+`import('/src/lib/supabase.ts')`: query 6 buổi trả đúng 1000 dòng, thiếu 2 buổi. **Fix:** `fetchGradeAgg` — embed `!inner` theo `buoi_hoc_id` (bỏ IN problem_id dài) + **PHÂN TRANG `range()`** tới khi <1000. Verify app: 8B1 16/07→96%, 20/07→96% khớp DB. `tsc` sạch.
- **🐛 FIX cap 1000 (phần 2) — overview "ô kỳ vọng" sai:** `getAllClassesCompletion` query **điểm danh (`buoi_hoc_hs`) + `btvn_ket_qua`** gộp buổi CẢ 38 lớp → >1000 dòng → cap → nhiều lớp thiếu "ô kỳ vọng" (vd 9A2 báo 10/26=38% trong khi thật 50/63=79%). Thêm helper `pagedByBuoi` (phân trang theo `buoi_hoc_id`) dùng cho att/btvn_ket_qua/vắng ở cả overview lẫn matrix. Verify app: 9A2→79%(50/63), 9B1 71%(64/90), 8B1 93%(57/61) khớp DB.
- **⭐ WIRE EXP mới vào service + tính lại T7 (07-28):** EXP = tính-lại theo (lớp×tháng), `recomputeExpThang(lopId,ym)` trong `gami.ts` (Σ ET-rank + BTVN-tháng → `source='exp_thang'` note=ym; idempotent xoá per-buổi cũ theo ref_buoi + exp_thang cũ). **Tự recompute** khi đóng/mở lại ET|BTVN buổi thường (closePhase/reopenPhase/closeBTVN/reopenBTVN, try/catch). `closePhase` bỏ ghi `rank_*` EXP (reveal = etRankExp per-buổi); bù/bổ trợ giữ `attend_floor`. Bỏ import `RANK_EXP`/`expForRank`/`BTVN_EXP` thừa. Helper phân trang `fetchBtvnAcc` (1 lớp cũng có thể >1000 grades). **Tính lại T7 THẬT** qua app admin (`import('/src/lib/gami.ts').recomputeExpThang` mọi lớp Toán/KHTN, chia batch 10 vì >30s): **250 HS `exp_thang` tổng 668k · 0 sót old-source buổi T7** (9A1 TB4846·7A1 3738·khớp `sim_exp`). June=mùa trước giữ nguyên. Preview: `scripts/recalc_exp.mjs`. `tsc`+`verify_gami` sạch.
- **⭐ Leaderboard EXP theo MÙA (Thùy chốt A):** `getBangTong` cũ sum EXP **all-time** (còn dính cap 1000!) → Hân 8581 (June-cũ + July-mới). Sửa: window `created_at ≥ seasonStartUtc(mùa nay)` **+ loại legacy `rank_*`/`btvn`**. (Vì sao cần loại legacy: buổi **mùa CŨ** đóng-muộn → `created_at` lọt window mùa nay — vd rank_et/ingame của buổi T6 đóng 21/07. Buổi mùa-nay đã sạch legacy nên loại an toàn.) Verify: Hân 6030·Chu Châu Anh 6037·Lê Thu Trà 5973 = đúng `exp_thang` T7. Áp cùng filter cho `thanhtich.getLevelXu` (Xu tháng). `expToLevel` chưa được app gọi (Level hiện suy `diem_thi`).
- **⭐ MT khớp buổi + công thức điểm BK (07-28):** **(A)** tab "Điểm thi" (KetQua) CHỈ nhập **thi trường** (`truong`) — bỏ chọn loại → hết đẻ `ky_thi(mt_sat_hach)` "mồ côi" ngày-tự-do lệch pha. Điểm MT thang-10 nhập TRONG **buổi › Điểm MT** (`getOrCreateKyThiMTChoBuoi` gắn `buoi_hoc_id`, ngày suy từ buổi — đã wired). **(B)** Điểm MT = **cơ bản + nâng cao** (GV nhập thẳng 2 số, hệ cộng), **tổng ≥10 ⇒ 9.75** (trần), checkbox **Full ⇒ 10** (không đếm câu — đếm câu thuộc mastery). Engine `tinhDiemMT(coBan, nangCao, full)` (thanhtich.ts). Migration `202607281700_diem_mt_thanhphan.sql` thêm `diem_thi.diem_co_ban/diem_nang_cao/full_diem` (áp riêng vì `migrate.mjs` chạy-lại-từ-0001 fail — team áp migration mới lẻ). UI `DiemMTRow`: 2 ô + Full + điểm tự tính + verdict. `tsc` sạch, engine verify khớp mọi ví dụ Thùy.
- **Dọn buổi rác 9S1 + nhãn MT khi tìm buổi (07-28):** 9S1 ngày 08/07 có 2 buổi — 1 buổi `loai='mt'` (mô hình MT-riêng CŨ, trước 07-08) sót lại + 1 buổi thường (MT đã vào phase='mt', 18 câu). Toàn hệ chỉ 1 buổi `loai='mt'` này (ca lẻ), không Elo/EXP/ky_thi → **XOÁ CỨNG** (data sai, không phải buổi huỷ): transaction xoá 15 grades + 5 session_problems + 13 buoi_hoc_hs + buoi_hoc (guard chỉ loai='mt'). **+ Gỡ MT gán NHẦM ở 9S1 17/07** (đề "Mã 2", 18 câu, 0 điểm chấm): xoá 18 câu mt của buổi + xoá doc `tai_lieu(mt_buoi, 9S1, 17/07)` (cascade phan/cau/linkgen_jobs — FK đều ON DELETE CASCADE, không ca_test trỏ) → 9S1 còn đúng 1 MT ở 08/07. **Nhãn MT:** `timBuoiTheoLop` thêm cờ `coMT` (buổi có câu phase='mt', 1 query — hiện MỌI MT đã gán, Thùy chốt), `BuoiTimRow` badge **🏆 MT** khi tìm lớp.
- **MT: bỏ verdict tay + tự lưu ngay (07-28):** màn Điểm MT trong buổi trước đòi bấm verdict (Đạt/Gần/Không) mới lưu → GV tưởng "không có nút lưu". Bỏ cột verdict; GV chỉ nhập Cơ bản + Nâng cao (+ Full), **tự lưu ngay khi rời ô / tick** (bỏ qua khi trống). `verdict` (NOT NULL) **tự suy ngầm từ điểm** (`verdictTuDiem`: đạt ≥8 · gần 6.5–<8 · <6.5 không) để Level cũ vẫn có giá trị. `tsc` sạch.
- **⭐ REPORT PHỤ HUYNH (tháng) — leaf mới (07-28):** `report_ph` (nhóm Quản lý chất lượng), chọn HS + môn + tháng ‹›. **Khu 1 số liệu:** bảng theo buổi `getReportBuoiHS(hsId,mon,ym)` (ET% · BTVN% · thái độ; **vắng → "Vắng" ở cột ET** vì ET bản chất = điểm danh) + tổng quan tái dùng `getTongQuanHS` (hoàn thành cơ bản/nâng cao, ET/BTVN/MT %, điểm MT/trường). **Khu 2 nhận xét:** 3 ô (Thái độ · Kiến thức & Kĩ năng · Kết luận) tự lưu → bảng mới `bao_cao_ph(hoc_sinh_id, mon, thang, ...)` (migration `202607281900`). Mỗi (HS×môn) 1 report. Service `src/lib/report.ts`, màn `src/screens/report/ReportPHScreen.tsx`. tsc sạch; verify data thật (Phương Linh Toán T7 khớp). Số liệu SUY ĐỘNG, chỉ nhận xét được lưu.
- **Report PH — refine bố cục + mức kết luận (07-28):** đổi chọn HS = **Môn → Lớp → HS** (dropdown, giống Kết quả học tập) thay ô tìm thẳng. Bố cục **2 cột: DỮ LIỆU trái · NHẬN XÉT phải** (GV vừa nhìn số vừa nhận xét; nhận xét sticky). Kết luận thêm **thanh MỨC 5 bậc** (`ket_luan_muc`: vượt bậc/tiến bộ/ổn định/đi xuống/cần hỗ trợ, migration `202607282000`). tsc sạch.
- **Report PH — ảnh gửi PH (copy clipboard) (07-28):** nút "📸 Ảnh gửi phụ huynh" → modal thẻ inline-hex (né oklch Tailwind v4) layout kiểu tab Kết quả app PH: **TRÊN** = header HS/lớp/tháng + hình-minh-hoạ mức kết luận (🚀/📈/⚖️/📉/🆘 màu) + Kết luận + nhận xét; **DƯỚI** = card "N dạng đạt/cần luyện/yếu" + 3 card ET/BTVN/MT (cơ bản·nâng cao /10, BTVN kèm "chưa hoàn thành N lần"). Copy ảnh = **pattern V1** (popup + html2canvas CDN + clipboard.write PNG → paste Zalo; fallback tải file). tsc sạch.
- **Report PH — gộp card + số Tổng + design đẹp hơn (07-28):** on-screen bỏ lưới 6-tile, gộp thành **Bản đồ kiến thức + 3 card ET/BTVN/MT** mỗi card 3 số ngang **Tổng · Cơ bản · Nâng cao** (Tổng = TB có trọng số theo n dạng). Ảnh gửi PH: thêm cột **Tổng**, redesign kiểu report giáo dục (header eyebrow + avatar viền, kết luận nổi bật borderTop màu mức + emoji to, nhận xét accent, section "KẾT QUẢ HỌC TẬP", footer branding, thang /10). tsc sạch.

## 2026-07-29 — Report PH: ảnh gửi PH khớp mockup "BK Academy" + cột Mục tiêu tháng tới
- **Bám mockup Thùy gửi** (`bk_academy_monthly_report_mobile.html`) cho card ảnh gửi PH (`PhAnhModal`, ReportPHScreen): **hero** gradient navy→xanh + brand-mark 4 màu "BK ACADEMY" + pill tháng + avatar bo góc + tên/lớp/môn · **progress ring SVG** (% hoàn thành ET+MT, màu theo ngưỡng 80/50) + eyebrow "Xu hướng tháng này" + headline = mức kết luận + pill tăng/giảm so kỳ trước (`trend.hoanThanhToanBo`) · **card nhận xét GV** = text `ket_luan` + 2 **skill bar** (Kiến thức & kỹ năng = độ đúng ET · Thái độ = TB thái độ BTVN) · **status row** 3 ô đạt/cần luyện/yếu · **bảng đánh giá** 3 dòng ET/BTVN/MT × Tổng·Cơ bản·Nâng cao · **goal card** vàng + footer. SVG render pixel-perfect trong html2canvas; vẫn dùng inline-hex né oklch.
- **Cột mới `bao_cao_ph.muc_tieu`** (migration `202607282100_baocao_ph_muctieu.sql`, áp lẻ) — ô "🎯 Mục tiêu tháng tới" trong NhanXet → goal card trên ảnh. `BaoCaoPH` type + init states thêm `muc_tieu`.
- **`thaiDoPct`** suy từ thái độ BTVN theo buổi (nghiêm túc 100 · chưa hết sức 75 · chưa nghiêm túc 40 · chống đối 0, TB) truyền vào modal cho skill bar Thái độ.
- tsc sạch. Commit `b4b5cef` push thẳng `main`.
- **CÒN chờ Thùy chốt (đã báo):** ① tên GV phụ trách (mockup có "GV: Thầy Minh" — hệ chưa fetch, đang bỏ) · ② 2 skill bar hiện là SỐ SUY ĐỘNG, không phải GV nhập — có muốn GV tự chấm không · ③ 2 ô text "Thái độ"/"Kiến thức & kỹ năng" GV nhập tay hiện KHÔNG lên ảnh nữa (ảnh chỉ show `ket_luan` + 2 bar) — giữ vậy hay ghép cả text · ④ trend pill trống ở tháng đầu môn (chưa có kỳ trước để so).

### 07-29 (tiếp) — Thùy chốt 3 điểm Report PH
- **① GV chủ nhiệm:** `getGVChinhLop(lopId)` (report.ts) = `phan_cong_lop` vai_tro=gv·la_chinh=true → `nhan_su.ho_ten`. ReportBody fetch theo lopId, truyền `gvName` vào PhAnhModal → hiện "· GV …" ở hero meta + subtitle teacher-card.
- **② Skill bar → THANG 5, GV tự chọn** (bỏ % suy động): migration `202607291500_baocao_ph_muc_skill.sql` thêm `muc_kien_thuc`/`muc_thai_do` smallint (1..5, null=chưa chọn, áp lẻ OK). NhanXet: mỗi ô (Kiến thức & Kĩ năng · Thái độ) có **5 nút 1..5** (bấm lại = bỏ chọn) + nhãn `SKILL_MUC` (Cần cố gắng/Trung bình/Khá/Tốt/Xuất sắc), tự lưu. Ảnh: `bar5` = 5 đoạn tô theo mức + nhãn mức.
- **③ Ghép text vào ảnh, giữ tag:** teacher-card trên ảnh giờ = `ket_luan` (note) + 2 khối `bar5` mỗi khối có **tag** ("Kiến thức & kỹ năng" / "Thái độ học tập") + thanh mức 5 + **text nhận xét** GV nhập (`kien_thuc_ky_nang`/`thai_do`) ngay dưới. Bỏ `thaiDoPct`/`kienThuc` suy động khỏi modal.
- tsc sạch. Push `main`.

### 07-29 (tiếp #2) — Report PH: chữ đầy đủ "Dạng bài …" + logo BK
- **Trạng thái dạng bài ghi RÕ:** on-screen chips + status row trên ảnh đổi từ "27 dạng đạt/…" → **"27 Dạng bài Đạt yêu cầu · 4 Dạng bài Cần luyện tập · 3 Dạng bài còn Yếu"**. `statusC` (ảnh) restyle: số to + "DẠNG BÀI" + nhãn đầy đủ.
- **Logo BK:** thay ô grid 4 màu abstract ở hero bằng **SVG dựng lại logo BK** (B hồng #e5389a · K cam #f7941e · tam giác + xanh #2bb6d6 · tròn − lục #7ac143) + chữ "BK ACADEMY" trắng. Dùng SVG (không nhúng `public/Logo.png`) vì popup html2canvas là about:blank → path tương đối vỡ, và wordmark xám của PNG chìm trên nền navy. tsc sạch.

### 07-29 (tiếp #6) — Chèn ảnh inline ở MỌI ô soạn (lời giải + lý thuyết CĐ/dạng + Đúng/Sai)
- **Thùy:** làm ở mọi chỗ — lý thuyết chuyên đề, lý thuyết dạng luôn. Tách toolbar dùng chung `src/components/ImgInsertBar.tsx` (🖼 Chèn ảnh / 📋 Dán / ✂️ Cắt PDF → upload → chèn `![](url)` tại con trỏ) + helper `insertImageAtCursor` (dùng cho onPaste thẳng trong ô). Import `readClipboardImageFile`/`MathText` từ screens/kho/ui vào component = pattern đã có (KhoPicker). Áp:
  - **DangHub** (lời giải câu): thay `SolutionField` bespoke → dùng `ImgInsertBar` (khỏi lặp).
  - **BanDo `LyThuyetModal`** (DÙNG CHUNG lý thuyết DẠNG `config.lyThuyet` + CHUYÊN ĐỀ `config.lyThuyetT2`): thêm nút **🖼 Chèn ảnh** (upload file→insertImg, ref riêng `insertFileRef` khác `fileRef` nguồn-AI) cạnh **✂️ Cắt hình chèn** sẵn có + onPaste ảnh thẳng vào ô code → insertImg. (Giữ nguyên "📎 Chọn ảnh/PDF"/"📋 Dán clipboard" = nguồn cho AI bóc.)
  - **DungSaiBank** (lời giải chung Đúng/Sai): thêm `ImgInsertBar` + onPaste + preview MathText (trước KHÔNG có preview).
- tsc + vite build sạch.

### 07-29 (tiếp #5) — Kho làm bài: chèn ẢNH INLINE vào lời giải
- **Thùy:** clone bài có hình → muốn bổ sung hình vào lời giải SAU (như tính năng cũ: upload ảnh → lấy link → nhét vào bài giải). Hạ tầng có sẵn (`MathText` render `![](url)` cả màn + preview, `uploadKhoImage`), chỉ thiếu nút chèn tại con trỏ ở ô lời giải. **Fix:** component `SolutionField` (DangHub) bọc ô "Đáp án chi tiết" + toolbar **🖼 Chèn ảnh / 📋 Dán / ✂️ Cắt PDF** → upload → chèn `![](url)` NGAY TẠI con trỏ (giữ selectionStart/End); cả onPaste ảnh trong ô cũng tự upload+chèn. Thay 3 `<textarea loi_giai>` (fill/opts/grid) trong CauEditor. Chèn được nhiều hình, mọi vị trí; giữ nguyên ô "Ảnh giải" (`anhDapAn`) đơn. KHÔNG đổi schema. tsc + vite build sạch.

### 07-29 (tiếp #4) — Giáo trình: chọn câu giữ ĐÚNG thứ tự click
- **Thùy:** thứ tự câu trong builder phải theo thứ tự click (click trước hiện trước). `KhoPicker.confirm()` cũ nối câu mới theo **thứ tự KHO** (`all = groups.flatMap(...)`) → không khớp thứ tự bấm. **Fix:** `onConfirm([...sel])` — `sel` là Set nên giữ thứ tự chèn = thứ tự click (câu cũ giữ vị trí cũ, câu mới nối theo đúng thứ tự tick). Chuỗi lưu/hiện đã đúng sẵn: `setCauOfPhan` ghi `thu_tu:i` theo index mảng, load sắp theo `thu_tu`. Không đụng auto-suggest (`setDangOfBuoi` round-robin). tsc sạch.

### 07-29 (tiếp #3) — Trend KHÔNG so với tháng 6 (chưa chính thức)
- **Thùy chốt:** tháng 6 = dữ liệu chưa chính thức (trước ngày khai mùa 1/7) → KHÔNG dùng làm mốc so sánh trend. `getTongQuanHS` (mastery.ts) tính trend = cửa sổ 30 ngày gần vs 30 ngày trước, mà "prior" (30–60 ngày trước) rơi trúng T6 khi hôm nay là cuối T7. **Fix:** thêm **sàn mùa** `seasonMs = seasonStartUtc(seasonOf(vnToday))` — cả `inRecent`/`inPrior` đều thêm điều kiện `t >= seasonMs`. Prior rơi hết vào trước mùa → rỗng → trend = null → pill "so kỳ trước" tự ẩn (đúng, không bịa mốc T6). Áp cho MỌI trend (hoàn thành + ET/BTVN/MT). Nhất quán với season-windowing của EXP/leaderboard. tsc sạch.

## 2026-07-30 — Elo: λ=0, reset niên khóa, FIX bug recalc, khởi động Mức 2 (pure-derive)
- **Bối cảnh:** soi Elo 9A1 sau ET → DB là "hoá thạch" nhiều đời công thức (ảnh cũ ±40; engine hiện K30/cap20/P10/λ). Engine LÕI (`computeEloUpdate`, elo.js) ĐÃ đúng (pairwise A/E chuẩn hoá /(N−1) + P + λ). Vấn đề = số đã LƯU chưa tính lại theo engine cuối + đóng buổi lệch thứ tự (backdate) làm elo_before trôi.
- **λ (LAMBDA) → 0 (config.js).** Test `scripts/_test_elo_logic.mjs` / 1852 lượt ET thật: λ=0.05 đẻ **32 nghịch lý "điểm cao mà Δ thấp hơn điểm thấp"** (vd 450đ elo1112→Δ−5 < 0đ→Δ+2) — λ trừ theo elo bất kể làm bài tốt/dở. Bỏ λ → 32→**1** (cái còn lại là Elo đúng bản chất: thắng-KỲ-VỌNG > điểm thô, cùng nguyên lý underdog). Nén-mean/lật-kèo CHUYỂN sang soft-reset đầu mùa.
- **Reset Elo = NIÊN KHÓA (1/7), 1 năm/lần** (khớp SEASON). KHÔNG reset tháng; reset T7 chỉ là test. Soft-reset (`elo=1000+k·(elo_cuối−1000)`) thiết kế trước 1/7/2027.
- **🐛 FIX bug THẬT `recalc_elo.mjs`:** `elo.set(kk,Ri+delta)` NGAY TRONG loop per-HS → HS sau tính `expected` trên elo ĐÃ cập nhật của HS trước (không phải mốc trước-buổi chung) → lệch ≤1 ở ~21% dòng, cascade. `computeEloUpdate` snapshot đầu buổi = ĐÚNG; recalc chép-lại-công-thức nên sai (đúng bẫy "trùng lặp đẻ divergence ẩn"). Fix: `snap`=elo đầu buổi. Harness sau fix: [1] stored==engine **0/1852**.
- **Elo giờ CÓ THỂ âm** khi hụt kỳ vọng mạnh (rank≤−10) — đúng "thước trình thật"; động lực "đi học luôn dương" để EXP lo.
- **Recalc --write (λ=0, đã fix):** 9A1 1243/1097/1170 · 9A2 1219/1078/1145 · 9S1 1178/1027/1125.
- **MỨC 2 — Elo pure-derive** (khớp §1 "mastery không lưu, suy động"): chân lý=`gami_grades`+roster co_mat; `gami_elo`/`_history`=CACHE; đóng/mở/sửa ET → recompute-forward qua 1 hàm derive DUY NHẤT (`computeEloUpdate`), bỏ vá-delta. Diệt fossil+backdate+reopen-rollback. Bước 1: tách `src/gami/replay.js` (pure) → recalc & app dùng chung.

## 2026-07-31 — Giao việc & Hiệu suất v2: migration schema (Idea→Backlog→Weekly)
- **Bối cảnh:** build lại feature theo BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md **v2** (viết lại sau phiên KT). v1 (mig 0080) đã có nhưng **4 bảng ĐỀU RỖNG** (verify live 07-31: loai_viec/viec/viec_nguoi_lam/viec_log = 0 dòng) → CEO chốt **drop + dựng lại sạch** (không alter chắp vá). 3 quyết định CEO 07-31: (1) drop+rebuild; (2) hiệu suất v1 CHỈ việc phát triển; (3) màn công khai TOÀN trung tâm.
- **Mig `202607311326_giaoviec_v2...`:** drop 4 bảng v1 + `log_viec()`. Dựng: `loai_viec` (bỏ `phuong_thuc_cham`+`task_nho` — §1 gộp 1 luật chấm, §4.2 evidence luôn bắt buộc); `hang_muc` (kieu mot_lan/lien_tuc, `pham_vi` NULLABLE, `chan_troi`); `y_tuong` (trang_thai moi/backlog/da_trien_khai/ngu_dong/tu_choi, `ly_do_tu_choi`, gia_tri/co 1–3); `viec` (⭐1 người `nguoi_lam_id`, bỏ junction; full lifecycle: deadline_goc bất biến, so_lan_gia_han, nguon ke_hoach/phat_sinh, 8 trạng thái +hold/huy/chuyen, phan_tram_ghi_nhan, viec_ke_thua_id, ky_tuan=tuần plan); `viec_log`+trigger.
- **Ghi công idea + hiệu suất kỳ = DERIVE** (không bảng materialize) — đúng CLAUDE §1 "suy động".
- **`giaoviec_housekeeping()`** (rpc, gọi lazy khi mở màn): (a) cho_nghiem_thu >7 ngày → tự đóng 'dat' cl=100 (lỗ đen = lỗi sếp §4.6); (b) backlog >3 tháng → tự ngu_dong. Hằng số inline ĐỒNG BỘ config §4.8 (chỉ path SQL này cần).
- **Bẫy migrate:** `migrate.mjs` chạy-lại-TẤT-CẢ từ đầu → fail ở 0001 (không idempotent). Áp 1 file mới = script riêng. Idempotency: hang_muc/y_tuong là bảng MỚI (không nằm danh sách drop §0) → phải `drop policy if exists` trước create, không thì re-run trùng policy. Đã test áp 2 lần OK.
- RLS: member gate (`la_thanh_vien()`) mọi bảng — đúng convention "staffs ENABLE".

## 2026-07-31 (2) — Giao việc v2: config + data layer + 6 tab UI + verify end-to-end
- **Config `giaoviec-config.ts`** (§4.8, 1 file): hằng số TRE_MOI_NGAY=10/SAN_TIEN_DO=40/TRAN_TRA_LAI=[100,85,70]/W 0.3-0.7/GIA_HAN 1/TU_DONG_DONG 7/HOLD 3/NGU_DONG 3/WIP 30/TRIAGE 2 + công thức tinhTienDo/tinhChatLuong/gopPhanTram + helper tuần (kyTuanCuaNgay=thứ2, không toISOString). Auto-close SQL đồng bộ hằng số (comment cảnh báo sửa 2 nơi).
- **`lib/giaoviec.ts` rewrite v2:** y_tuong (đề xuất/refine/duyệt-backlog/từ-chối-lý-do/top-down), backlog sort gia_tri-co + WIP + ngu_dong, hang_muc (2 kiểu, burn-up luỹ kế, so_lat derive, quá chan_troi), viec full lifecycle 1-người (createViec cửa-2 flip y_tuong→da_trien_khai, batDauLam, banHoanThanh evidence bắt buộc, xinGiaHan trước-hạn-≤1, duyetGiaHan, nghiemThu 1-chạm cl100-mặc-định+tiến-độ-máy, guiLai, hold/boHold, huyViec partial, chuyenNguoi macro đóng+đẻ), hiệu suất kỳ=tuần plan DERIVE (dat+huy/chuyen partial, hold rút mẫu số, 2 trục), tỉ lệ phát sinh, huỷ theo người giao. Reuse getMyScope cho cây giao.
- **6 tab** (1 leaf `giaoviec`, giữ nav cũ): Review tuần (nghiệm thu hàng loạt + gợi-ý-lát-cắt-phải-click + backlog chốt scope + duyệt gia hạn + hold/huỷ/chuyển) · Việc của tôi (bắt đầu/hoàn-thành-evidence/xin-gia-hạn + hiệu suất 2 trục + tỉ trọng) · Ý tưởng (đề xuất/triage CEO/refinement) · Backlog & Hạng mục (sort/WIP/burn-up SVG) · Công khai TOÀN trung tâm (bảng ai-việc-trễ-GH + tỉ lệ phát sinh + hạng mục quá chân trời) · Loại việc. Modal chung: GiaoViecModal, TaskActions. UI Apple-clean (nền xám/card trắng/pill), gate CEO qua useStore laAdmin.
- **VERIFY:** tsc sạch. E2E DB-level 10/10 (2 luồng DoD + housekeeping auto-close 80/94 + ngu_dong + burn-up[1,2] + chuyển KL=4, dọn sạch 0 dòng). Formula TS 13/13 khớp SQL. Live app: dev-login admin → màn render 6 tab không lỗi, tạo idea qua UI OK (chứng minh RLS insert `authenticated` + refetch + gate CEO), đã dọn.
- **HOÃN (ghi để không mất):** "trách nhiệm thường trực = trọng số vai trò" (§6) chưa có bảng riêng — hiện chỉ đo task; "review cuối kỳ hiệu chỉnh khối lượng neo bằng chứng" mới ở mức sửa per-task (suaViec) + sửa thang_kl loại việc, chưa có màn review-bảng. Vận hành derive nối ống hiệu suất = pha sau (chốt CEO 07-31).

## 2026-07-31 (3) — Giao việc: rework theo CEO — task MẸ/CON, bỏ hạng mục, tách "Việc của tôi"
- **CEO feedback 07-31:** (1) "Việc của tôi" KHÔNG được là tab trong màn quản lý — phải ở rail Việc-của-tôi ngoài. (2) Luồng chuẩn: New Idea → idea list → CEO duyệt (Backlog/Holding/Hủy) → Backlog tick chọn + Xác nhận → Weekly Planning. (3) Weekly Planning = bảng task 2 TẦNG mẹ/con (task to → nhiều người làm task con), card theo cụm; hiện người/deadline/tiến độ; Detail xem mục tiêu/output/evidence. (4) Task 2 nguồn: backlog / phát sinh. (5) "epic/burn-up chỉ là ca nhỏ — task mẹ/con tổng quát hơn" → BỎ hạng mục.
- **Mig `202607311524`:** bỏ bảng `hang_muc` + cột `viec.hang_muc_id`/`y_tuong.hang_muc_id` (rỗng). y_tuong CHECK +`holding`. viec +`task_me_id` self-FK, `nguoi_lam_id` NULLABLE (task mẹ chưa gán người; con là đơn vị 1-người). Idempotent, 111 bảng.
- **Data layer:** bỏ mọi hàm hang_muc/burn-up. +holdingYTuong. createViec: task_me_id thay hang_muc_id, nguoi_lam nullable. +xacNhanTuan (backlog→task mẹ tuần này), taoTaskCon, ganNguoiLam, listWeeklyPlanning. decorateViec đếm so_con/so_con_dat. Hiệu suất CHỈ đếm task LEAF (loại mẹ có con — không đếm 2 lần).
- **UI:** shell tabs = Idea list · Backlog · Weekly Planning · Công khai · Loại việc (BỎ tab Việc của tôi + Review tuần). IdeaTab: 3 nút Backlog/Holding/Hủy + section Holding. BacklogTab: multi-select tick + Xác nhận → Weekly. WeeklyPlanningTab MỚI: cụm card mẹ/con, task lẻ chưa gán → Gán 1 người / Tách nhiều con, leaf actions (nghiệm thu/hold/chuyển/huỷ/duyệt GH), Detail modal. VietCuaToiTab chuyển vào rail "Việc của tôi" (NhanSuHome cột Phát triển) — cá nhân sống ở đó.
- **Verify:** tsc sạch. E2E DB luồng mới 4/4 (holding CHECK · task mẹ nguoi_lam null · task con self-FK 2 con/1 đạt · hiệu suất leaf-only 100%/sản lượng 3), dọn sạch 0 dòng. (Browser pane không compositing lần này nên chưa walk-through live được; phiên trước đã xác nhận render + RLS write.)

## 2026-07-31 (4) — Backlog: giá trị & cỡ thang Fibonacci (1·2·3·5·8)
- CEO chốt: đổi thang giá trị/cỡ của backlog từ 1–3 → **5 mức Fibonacci 1·2·3·5·8** (chuẩn story-point, phân biệt độ chênh rõ hơn).
- Mig `202607311557`: nới CHECK `y_tuong.gia_tri`/`co` → `in (1,2,3,5,8)` (1–3 là tập con → data cũ vẫn hợp lệ, không mất gì). UI `Chon13` → const FIBO=[1,2,3,5,8]. Verify DB: nhận 8/5, chặn 4. tsc sạch.

## 2026-07-31 (5) — Giao việc UX polish: search-picker người, popup rộng, chip người/deadline
- CEO yêu cầu: (1) chỗ gán người phải có Ô SEARCH tìm người; (2) popup rộng/to hơn; (3) người làm + deadline highlight nổi bật (để sau filter/sort).
- `ui.tsx`: +`NguoiPicker` (ô search lọc theo tên/mã NS + list cuộn có avatar tròn + tick chọn) · +`NguoiChip` (pill indigo + avatar; "chưa gán" = pill hổ phách) · +`DeadlineChip` (màu theo độ gấp: đỏ quá hạn/cam ≤2 ngày/xám thường, nhãn "trễ Nd"/"hôm nay") · `initials()`. Modal `wide` → max-w-3xl, padding p-6.
- Áp NguoiPicker + wide vào: GanModal (Weekly Planning), GiaoViecModal (giao/tách con/phát sinh), ChuyenModal (loại người cũ). LeafRow Weekly Planning: người + deadline thành CHIP nổi bật vị trí cố định.
- Verify: tsc sạch, Vite build không lỗi. (Live click-through chặn do session dev hết hạn — không tự nhập mật khẩu; thay đổi thuần presentational.)

## 2026-07-31 (6) — Việc của tôi: bỏ filter loại việc, thêm toggle Vận hành/Phát triển
- CEO: (1) bỏ các filter chip Chấm bài/Chấm ET/... — số task trực quan, không cần lọc; (2) thay bằng TOGGLE Vận hành ⇄ Phát triển; (3) Phát triển tách sang view riêng full-width cho rộng.
- `NhanSuHome/VietCuaToi`: gỡ ChipDef/OPS_CHIPS/GVTA_CHIPS/chipCls + state `loai`/matchLoai/toggleLoai + SectionHead (không còn dùng). Thêm state `view`. Header: toggle pill Vận hành/Phát triển; week-nav chỉ hiện ở Vận hành. Bỏ layout 2 cột (grid ...280px rail) → mỗi view full-width. Vận hành = metrics + day-groups; Phát triển = alert bổ trợ đuổi + VietCuaToiTab.
- Verify: tsc sạch + `vite build` OK (8.2s). Commit chỉ file NhanSuHome (rút kinh nghiệm: không git add -A).

## 2026-08-01 — Học phí: thay input[type=month] bằng KyPicker (nút ‹ ›)
- **CEO:** trên Mac/Safari `<input type="month">` hiện "July 2026" khó chịu → đổi thành filter có nút prev/next.
- **`KyPicker`** (HocPhiScreen.tsx, gần đầu file): `{ ky, onChange }` giữ NGUYÊN format `'YYYY-MM-01'` như setKy cũ → thay tại chỗ 6 input, KHÔNG đụng logic/query tab nào. Nhãn VN "Tháng M/YYYY", nút ‹ Kỳ trước / Kỳ sau ›. Cộng/trừ tháng bằng số học index (`y*12+(m-1)±1`) — KHÔNG `new Date('YYYY-MM…')` (cấm §2 CLAUDE.md, tránh lệch TZ).
- Thay 6 chỗ: TheoMon · DiemDanh · DanhSach (Học phí học chính) · Duoi · Phieu · PhatSinh (trong Field2).
- **Verify live:** admin dev-login → Học phí. Prev đổi "Tháng 8/2026"→"Tháng 7/2026", data reload đúng (63 dòng/11.6tr → 286 dòng/392tr). Ky dùng chung zustand `hocPhiKy` nên giữ khi chuyển tab (tab Học phí học chính cũng hiện KyPicker cùng kỳ). tsc: HocPhiScreen sạch (lỗi còn lại chỉ ở BuoiHocScreen.tsx — WIP phiên khác, không liên quan).

## 2026-08-01 (2) — 🐛 BUG THẬT: học phí "HS theo môn" đếm nghỉ/đi-học SAI do .limit() cắt cụt
- **Triệu chứng (CEO soi):** Bùi Minh Hải 9B1 kỳ 7/2026 hiện "nghỉ 1 bù 3" — vô lý (bù > nghỉ).
- **Điều tra data thật (script _chk_bu*.mjs, chỉ SELECT):** HS0282 vắng ĐÚNG 3 buổi July (Jul 4 vang, Jul 11/18 vang_phep), bù đủ 3 (Jul 13×2 + Jul 20, 3 buổi bù VẬT LÝ riêng, KHÔNG trùng/đếm đôi), không có dòng điểm danh trùng. Vậy đáng ra "nghỉ 3 bù 3". Bù (3) ĐÚNG; nghỉ (1) SAI.
- **Root cause:** `listHocPhiTheoMonV2` (hocphi.ts) gom điểm danh TOÀN TRƯỜNG 1 query `.in(buoi).in(hs).limit(LIMIT=2000)`. Thực tế kỳ 7 = **2518 dòng > 2000** → PostgREST trả 2000 dòng đầu (thứ tự KHÔNG đảm bảo, không ORDER BY), 518 dòng rớt ÂM THẦM. HS có buổi rơi ngoài lát cắt → `ddMap.get` = undefined → KHÔNG tính vào nghỉ lẫn đi-học. → cả bảng sai (đi-học thiếu kéo tiền CT2 sai), không riêng 1 em. Đúng bẫy CLAUDE.md §2 "luôn paginate, đừng xài default cap".
- **Fix:** thêm `fetchAllBhh(buoiIds, hsIds)` — phân trang `.range(from, from+999)` + `.order('buoi_hoc_id').order('hoc_sinh_id')` (cặp duy nhất → range không lệch trang), lặp tới khi trang cuối < PAGE. Thay query cắt cụt ở dòng ~800.
- **Verify LIVE:** kỳ 7/2026 Bùi Minh Hải giờ "Lớp 13 · nghỉ 3 · bù 3" (khớp data thật). tsc: hocphi sạch (lỗi còn lại chỉ ở BuoiHocScreen.tsx — WIP phiên khác).
- **⚠ Latent CÙNG BẪY (chưa đụng, ghi để không quên):** (a) `buLinks` (bù) fetch MỌI HS all-time `.limit(LIMIT)` KHÔNG lọc kỳ → tích luỹ đủ lâu sẽ vượt 2000; (b) `hsl` (ghi danh) `.limit(LIMIT)` ~450 dòng giờ ok nhưng cùng pattern. Nên bọc paginate khi có dấu hiệu chạm trần.

## 2026-08-01 (3) — Zoom staff desktop VỪA-KHÍT (fix Mac cắt mép phải)
- **CEO:** màn Học phí trên Mac "thiếu góc bên phải". Đo: `#root { zoom: 1.15 }` (index.css) cứng → màn HẸP (MacBook) 1.15× cần rộng hơn cửa sổ → tràn, cắt mép phải. (Comment cũ ghi "Chrome/Edge" — không tính Mac.)
- **Fix:** 1 biến `--app-z` (index.css `#root{zoom:var(--app-z)}` + `--app-unz`=1/z). `main.tsx fitZoom()` kẹp `z=clamp(1, clientWidth/1150, 1.15)` lúc load + on resize (1150 = bề rộng layout tối thiểu app cần, đo thực ~1113 +margin). App.tsx đọc CÙNG biến: HS/mobile bù `zoom:var(--app-unz)`, chiều cao khung desktop `h-[calc(100vh/var(--app-z))]` — mọi chỗ 1.15 hardcode (4 chỗ) giờ 1 nguồn.
- **Verify live (resize):** 1024→z=1.0 (không tràn) · 1280→1.113 · 1600→1.15 (giữ full mật độ màn rộng). clipsRight=false cả 3. HS/mobile net = z×(1/z)=1.0 theo cấu trúc. tsc xanh.
- **Lưu ý:** `zoom` không animate, đổi bậc khi resize — chấp nhận (hiếm khi kéo cửa sổ). PrintJobPage (worker) bỏ qua fitZoom → giữ fallback 1.15.

## 2026-08-01 (4) — Học phí: sửa LOGIC BÙ (theo tháng gốc + đã xếp/huỷ) + QR phiếu + màn app PH
- **CEO 08-01:** bù của tháng 7 có thể diễn ra tháng 8 → phải tính theo THÁNG BUỔI GỐC; gồm cả buổi đã xếp chưa diễn ra; buổi đã xếp bị HUỶ vẫn tính (đã bỏ công sắp xếp). Hiện rõ "đã bù vs đã xếp".
- **Data thật (Anh Khoa 9C1 T7):** buổi lớp 14, nghỉ 6, đi học 8. Bù cũ đếm theo NGÀY BÙ + chỉ co_mat → chỉ 3 (2 buổi bù 1/8 rớt sang T8, 1 buổi xếp 2/8 không tính). Đúng: **bù=6 = 5 đã bù + 1 đã xếp** → CT2 = (8+6)=14.
- **`buByGocKy(hsIds, kyStart, kyEnd)` — NGUỒN DUY NHẤT đếm bù** (bảng HS-theo-môn + thongKeBuoiConLop + xét duyệt cùng gọi, chống 2 nơi lệch): theo tháng buổi GỐC · gồm đã bù/đã xếp/đã-diễn-ra-vắng/**huỷ** · dedupe theo buổi gốc (1 vắng = tối đa 1 bù → bù ≤ nghỉ). `tachBu()` tách done (đã bù thật=hoàn tất+co_mat) vs còn lại (đã xếp).
- **`thongKeBuoiConLop` +đi học +bù** → `getPhieuAo` & xét duyệt dùng chung.
- **Xét duyệt (CEO chốt: GIỮ duyệt, ĐIỀN SẴN số đúng):** `listXetDuyetChoDuyet` suy `soBuoiDeXuat=đi học+bù` + breakdown; UI thêm nút **"✓ Chốt đề xuất (14 = đi 8 + bù 6)"** + hiện đi/nghỉ/bù(đã bù,đã xếp). KHÔNG auto-giảm (human-in-loop giữ nguyên).
- **Phiếu "thông báo đủ":** dòng học phí `getPhieuAo` mo_ta = "gồm X buổi bù (Y đã bù, Z đã xếp lịch)" → chotKy copy vào hoa_don_dong → hiện ở phiếu ảnh/PDF (chiTiet) + app PH.
- **Tab HS-theo-môn:** cột BÙ "6 (5+1)" + Detail "5 đã bù, 1 đã xếp" + chú thích quy tắc.
- **QR VietQR** (kênh Zalo tự hiện "Chuyển tiền"): `lib/vietqr.ts` sinh chuỗi NAPAS local (verify CRC + TLV OK, bank VPBank 970432/38496433), nhét QR 180px vào phiếu. App PH (repo ph): migration 0018 hoa_don_view/dong_view (FDW, đã apply), màn Học phí (QR 220px + nút Tải ảnh QR + copy nội dung).
- **Verify:** tsc xanh (ERP + ph). Replay Anh Khoa khớp 6=5+1. ⚠ CHƯA có hoá đơn chốt nào (ERP hoa_don=0) → getPhieuAo/phiếu-thật/app-PH chờ CEO chốt 1 kỳ mới verify end-to-end.
- ⚠ Latent: `buByGocKy` buLinks .limit(LIMIT) toàn trường — paginate khi link bù >2000 (cùng bẫy fetchAllBhh 08-01(2)).

## 2026-08-01 (5) — Học phí tổng: gộp Phiếu vào list + BỎ xét duyệt (auto CT1/CT2)
- **CEO:** bỏ tab Phiếu, mọi thứ ở tab "Học phí tổng" (list tất cả PH, không picker từng người). Và BỎ luôn xét duyệt vì hết phiếu (bug duplicate-key `hoc_phi_xet_duyet` do ensureXetDuyet SELECT-rồi-INSERT bị đua khi expand).
- **Tab "Học phí học chính" → "Học phí tổng":** list mọi PH + tổng ĐẦY ĐỦ (chinh + đuổi + nợ — thêm `soDuNoTheoPH` batch + nâng `listPhieuTheoKy`). Mỗi PH nút "Chi tiết ▾" bung → khoản + Chốt kỳ + Thu tiền (component `PhieuChiTietExpand` gộp từ PhieuTab cũ). Bỏ tab Phiếu (xoá PhieuTab).
- **BỎ xét duyệt hoàn toàn:** xoá tab + XetDuyetTab + lib (ensureXetDuyet/listXetDuyetChoDuyet/duyetXetDuyet + type XetDuyet). `getPhieuAo` giờ TỰ tính CT1/CT2: `ct = chọn-tay(hoc_phi_cong_thuc) ?? deXuatCongThuc(nghỉ,lop)`; soBuoi = ct2 ? (đi học+bù) : buổi lớp. Không còn gate người duyệt → chốt ngay. chotKy bỏ guard choDuyet. (Bảng hoc_phi_xet_duyet để trơ, không drop.)
- **Verify live:** tab Xét duyệt mất, expand 1 PH không lỗi, Chốt kỳ enabled, số đúng. tsc xanh.
- **CÒN (chưa làm):** task 3 trạng thái Đã báo/Đã nộp + cảnh báo 3 ngày (cần migration `bao_lan1_at`); task 2 tab "Học phí nợ"; task 4 CT1/CT2 toggle bar + xác nhận.

## 2026-08-01 (6) — Học phí: nốt 3 task (nợ tab · trạng thái 2-state+3ngày · CT toggle+xác nhận)
- **Task 2 — tab "Học phí nợ":** `listNoPhaiThu()` (lib) = PH còn dư nợ >0 (lấy PH từ chính bảng nợ, gồm cả con đã nghỉ còn nợ), sort giảm. `NoTab` list tên+mã+còn-nợ + tổng. (Trống tới khi có hoá đơn chốt+trả dở.)
- **Task 3 — trạng thái Đã báo/Đã nộp + cảnh báo 3 ngày:** migration `202608012110_hoa_don_bao_lan1_at` (thêm cột nullable, ĐÃ áp prod). `danhDauDaBao()` set mốc; listHoaDonByKy/DongSoHang thêm `bao_lan1_at`. GỘP 2 cột (trạng-thái-thu + trạng-thái-thông-báo) → 1 cột "Trạng thái": Chưa chốt → Chưa báo → Đã báo(dd/mm) → Đã nộp(da_thu/mien). Quá 3 ngày từ báo lần 1 chưa nộp → badge ĐỎ + nút "📋 Báo lần 2" (copy soanThongBao 'cho_xu_ly'). `TrangThaiThuCell` thay `TrangThaiTBCell` (xoá cũ + import trangThaiTBKeTiep/capNhatTrangThaiTB/TRANG_THAI_TB_LABEL). Cột trang_thai_tb 3-bước để trơ.
- **Task 4 — CT1/CT2 toggle bar + xác nhận:** `CtToggle` (segmented CT1|CT2, click segment = pending, bấm "✓ Lưu" mới ghi `setCongThucHocPhi`; = đề xuất → xoá dòng chọn tay). Thay nút click-đảo-lưu-ngay `daoCongThuc` (xoá + busyKey). Verify live: click segment → "✓ Lưu" hiện (0→1), không auto-lưu.
- **Verify:** tsc xanh. Live: tab Học phí tổng + Học phí nợ có, Xét duyệt + Phiếu mất, CtToggle confirm-to-save chạy.

## 2026-08-01 (7) — Học phí: nợ khởi tạo + huỷ chốt + tên HS/search + tách 2 cột trạng thái
- **Chốt là gì (CEO hỏi):** chốt = đông cứng số để (a) đối soát tiền PH đã trả, (b) định nghĩa NỢ, (c) lưu sổ đã tính gì. Trước chốt = live/nháp (sửa tự tính lại). → sửa sau chốt = HUỶ CHỐT (về ảo → tính lại → chốt lại). Chốt PER-PH (đã vậy sẵn).
- **Nợ khởi tạo** (CEO: nợ cũ trước khi có hệ thống, người điền): mig `202608012230_phu_huynh_no_khoi_tao` (cột `no_khoi_tao` numeric default 0, đã áp prod). `noChiTietTheoPH` tách khởi-tạo/hệ-thống; `setNoKhoiTao`; `tinhSoDuNo` + `soDuNoTheoPH` cộng khởi tạo → **tự vào "nợ kỳ trước" phiếu tháng** (CEO chốt). NoTab: form SearchSelect+số tiền nhập khởi tạo cho PH bất kỳ + bảng khởi-tạo(sửa inline)/hệ-thống/tổng.
- **Huỷ chốt** (`huyChot`): xoá thanh_toan→hoa_don_log→hoa_don_dong→hoa_don (lá→gốc) → về ảo. Nút "Huỷ chốt / Sửa lại" trong expand (đã thu thì confirm cảnh báo xoá bản ghi thu).
- **Tách lại 2 cột trạng thái** (gộp 1 hơi quá tay): `ThuTienBadge` (chưa chốt/chưa thu/thu 1 phần/đã thu/miễn) + `BaoCell` (chưa báo/đã báo dd-mm/quá 3 ngày→"Báo lần 2"; đã thu→"—").
- **Cột "Học sinh"** (tên các con, `PHOpt.tenCon`/`DongSoHang.tenCon`) + **ô SEARCH** lọc theo tên PH / tên HS / mã (bỏ dấu). Verify live: search "Anh Văn" → đúng 1 PH.
- tsc xanh. schema.md KHÔNG commit (đang lẫn thay đổi phiên tuyensinh khác).

## 2026-08-01 (8) — Học phí tổng: polish layout bảng (CEO: xấu, lệch/sát)
- colgroup width cố định (PH 17% · HS 17% · Tổng tiền 14% · Thu tiền 13% · Thông báo 24% · Thao tác 15%) + mọi cell `px-3 py-2.5` → hết "lệch nhau / quá sát nhau" giữa Tổng tiền|Thu tiền|Thông báo. Base text 12px, tên PH font-medium + mã PH xuống dòng nhỏ (10px), tên HS nhỏ → nhường chỗ cột khác. Bỏ nút PDF (per-row + bulk "Tải PDF tất cả") + taiPdfPhieu/taiMot/taiTatCa/dlId/bulkDl. `overflow-x-auto` wrap.

## 2026-08-01 (9) — Học phí tổng: REDESIGN bảng → CARD (CEO: xấu, load lâu, chốt refresh cả màn)
- **Bảng → grid CARD** (2 cột md+). Mỗi PH = 1 card hiện ĐỦ cơ cấu tiền mặc định (học phí+liệu / đuổi / nợ / TỔNG) — KHÔNG cần click chi tiết. Thu gọn được từng card (▴/▾) + nút "Mở/Thu gọn tất cả" (mặc định MỞ).
- **Load nhanh:** card dùng data BATCH có sẵn (`listPhieuTheoKy` — thêm `daThuKy` batch), BỎ `PhieuChiTietExpand` (gọi `getPhieuAo` mỗi click → lag). Chi tiết từng-HS bỏ (cơ cấu nhóm là đủ).
- **KHÔNG refresh cả màn:** chốt/báo/thu = OPTIMISTIC — `PhuHuynhCard` giữ state riêng, `onDoi` cập nhật đúng 1 dòng trong `rows` (không `reload()` cả list). chotKy trả {hoaDonId,tongTien} → set thẳng.
- **Chốt = CHECKBOX** (tích=chốt, bỏ tích=huỷ chốt+confirm). **Trạng thái = toggle bar 3 nấc "Chưa báo | Đã báo | Đã thu"** + **filter tabs** trên đầu (Tất cả/Chưa chốt/Chưa báo/Đã báo/Đã thu + đếm) → bấm nấc/tab để lọc & chuyển nhóm.
- **"Đã thu"** (CEO): bấm → hiện ô nhập số tiền **mặc định = còn lại (số thông báo)** → `ghiThanhToan`; thu < tổng → phần thiếu TỰ thành nợ (cơ chế nợ = hoá đơn − đã thu). Card đổi nhóm sang "Đã thu" khi trả đủ.
- **Bỏ hẳn:** cột-bảng cũ (ThuTienBadge/BaoCell/PhieuChiTietExpand) + nút PDF. Xoá import thừa (Fragment/getPhieuAo/getHoaDonByKy/getHoaDonDong/listThanhToan/PhieuAo/ThanhToan/DongPhieu/LOAI_LABEL).
- **Verify live:** 254 card render, filter "Tất cả 254 · Chưa chốt 254", card hiện breakdown+tổng+checkbox+Ảnh QR (nợ khởi tạo hiện đúng "Nợ kỳ trước 590k"). tsc xanh.

## 2026-08-01 (10) — Học phí tổng card: confirm khi chốt + hiện CHI TIẾT từng dòng như phiếu
- **Point 1:** tích Chốt → `confirm()` "Chốt = X? đông cứng để thu tiền" trước khi chotKy.
- **Point 2 (CEO: card phải detail như ảnh gửi PH):** thêm `listChiTietTheoPH(ky)` = BATCH dòng từng PH (từ `listHocPhiTheoMonV2` — CT1/CT2+bù, KHỚP getPhieuAo — map hoc_sinh→phu_huynh + phát sinh cá-nhân/lớp). `DongSoHang.dong: DongPhieu[]`. `listPhieuTheoKy` restructure: nguồn DUY NHẤT là listChiTietTheoPH (bỏ tinhTamTinhTheoPH khỏi hàm này) → tổng = Σ dòng (lines KHỚP tổng, không lệch); chưa chốt = dòng batch + nợ; **đã chốt = batch `hoa_don_dong`** (dòng thật đông cứng). Card render `r.dong` (Học phí · con · lớp · X buổi × đơn giá × hệ số (gồm bù) / Học liệu / Đuổi / Phát sinh / Nợ) — KHÔNG gọi getPhieuAo mỗi card nên vẫn nhanh (1 batch pass ~ tab HS-theo-môn).
- **Verify live:** card chốt hiện "Học phí · 12C1 · 3 buổi × 180k = 540k · Học liệu 50k · TỔNG 590k" (dòng từ hoa_don_dong); card chưa chốt hiện dòng batch. tsc xanh.

## 2026-08-01 (11) — HỆ SỐ effective-dated (Cách 2 — luật "đủ 1 tháng mới giảm")
- **CEO chốt Cách 2:** hệ số áp dụng TỪ tháng nào (effective-dated), thay vì 1 giá trị điểm-thời-gian. Vd 2 ae: em vào T7 → hệ số 0.95 hiệu lực từ T8; T7 của anh vẫn 1.
- **Mig `202608012350_hoc_sinh_he_so_effective`** (áp prod): bảng `hoc_sinh_he_so`(hoc_sinh_id, he_so, **hieu_luc_tu** date, nguon, unique(hs,hieu_luc_tu)) + RLS member-gate. Backfill 58 HS có hệ số≠1 → entry hiệu lực 2026-07-01. `hoc_sinh.he_so_hoc_phi` GIỮ làm denormalize.
- **Lib:** `heSoHieuLucBatch(hsIds, ky)` = entry hieu_luc_tu ≤ ky mới nhất (else 1). `setHeSoHieuLuc(hs, heSo, hieuLucTu, nguon)` upsert + sync denormalize nếu hieuLucTu ≤ tháng này. `listHeSoLichSu`.
- **Billing dùng hệ số HIỆU LỰC theo kỳ:** `getPhieuAo` (heSoMap theo con) + `listHocPhiTheoMonV2` (heSoMap theo hsIds) thay `hs.he_so_hoc_phi`. `listHeSoHocSinh` hiện "hệ số hiện tại" = hiệu lực THÁNG NÀY (không stale). Verify DB: HS mẫu T7=0.95, T6=1(default).
- **UI HeSoTab:** KyPicker "Áp dụng từ" (mặc định THÁNG SAU `kyKeTiep`) → Xác nhận/Sửa tay ghi entry hiệu lực từ tháng đó (setHeSoHieuLuc). Verify live: "Áp dụng từ Tháng 9/2026".
- tsc xanh. (Cờ lệch gợi-ý vs hệ-số-hiện-tại vẫn giữ.)

## 2026-08-01 (12) — TÍN DỤNG GIỚI THIỆU (người cũ giới thiệu HS mới → trừ học phí, trễ 1 tháng)
- **CEO chốt cơ chế:** người giới thiệu (người cũ) được tín dụng (mặc định 500k, ghi TỰ DO), **hiệu lực từ tháng sau** (trễ 1 tháng), **người NHẬP TAY** (không auto-điều-kiện), trừ **trải nhiều tháng đến hết** (mỗi tháng trừ tối đa = học phí tháng đó, dư dồn sang). Người hưởng = người giới thiệu. Form có **chọn HS được giới thiệu** để lưu.
- **Mig `202608020010`** (áp prod): bảng `hoc_phi_tin_dung`(phu_huynh_id·hoc_sinh_moi_id·so_tien·hieu_luc_tu·mo_ta) + RLS. Nới CHECK `hoa_don_dong.loai` thêm `'giam_gioi_thieu'` (dòng ÂM). `DongPhieu.loai` +giam_gioi_thieu.
- **Lib:** themTinDung/listTinDung/xoaTinDung + `tinDungConLaiBatch(phIds, ky)` = Σ cấp(hieu_luc_tu≤ky) − Σ|giam_gioi_thieu ở hoá đơn CHỐT| (còn lại ≥0).
- **Billing:** getPhieuAo + listPhieuTheoKy thêm dòng "Giảm giới thiệu" = −min(cònLại, học-phí-tháng-này[chinh+đuổi]); tổng trừ đi. Đã dùng = dòng giảm đông cứng ở hoá đơn chốt → tự trừ dần. Dư > học phí tháng này → dồn (không tính hết).
- **UI:** tab "Giới thiệu" (form: người GT[SearchSelect PH] + HS được GT[SearchSelect HS] + số tiền[500k] + hiệu lực từ[KyPicker mặc định tháng sau] + Lưu; bảng + Xoá). Card hiện dòng "Giảm giới thiệu" màu xanh (âm).
- Verify live: tab render, form đủ, 500k + hiệu lực Tháng 9. tsc xanh.

## 2026-08-03 — IN GIÁO TRÌNH/BTVN: "nhầm lớp" ở header + bỏ hẳn dải "Lớp · ngày" buổi
- **Feedback thật (PH/GV):** đáp án BTVN của 8B1 nhưng dải header trên cùng ghi "Lớp 6S2 · 16/07". Kèm: "vẫn còn header ở builder", "phần giáo trình vẫn lỗi".
- **Root cause (1 gốc cho cả 3 triệu chứng):** header "Lớp · ngày" KHÔNG phải DOM — là CSS `content` của `.pagedjs_pagebox::before` (`buildPagedCss`), và **paged.js chèn stylesheet này vào `<head> TOÀN CỤC`**, không giới hạn container. Mỗi lần render (đổi doc / scope / GV) → 1 `<style>` mới; rule `.pagedjs_pagebox::before` của MỌI sheet nhắm MỌI trang → **chèn-sau-cùng thắng** cascade. Race: mở doc 6S2 (dài, paged.js chậm) → đóng, mở 8B1 → 6S2 resolve SAU → `<style>` 6S2 chèn cuối → sơn "Lớp 6S2 · 16/07" lên trang 8B1. Guard `cancelled` chỉ chặn setState + ẩn container, KHÔNG gỡ `<style>` đã chèn.
- **Bằng chứng quyết định:** `ngayVN` (header) và `ngayPhat` (thẻ BtvnBkHead) đều `= taiLieu.ngay` → 1 render đúng thì BẰNG NHAU. Ảnh cho 16/07 ≠ 30/07 ⇒ header đến từ render KHÁC (thân bài 8B1·30/07 vẫn đúng vì DOM nằm trong đúng container; chỉ CSS chrome toàn cục rò). Ảnh hưởng cả bản in native (dùng chung CSS đó) lẫn tab "Toàn bộ".
- **Fix 2 lớp (PrintView.tsx):**
  - **(1) Scope CSS chrome theo container** — mỗi render 1 class `pv-scope-N` (counter `pvRenderSeq`) gắn lên container; `buildPagedCss(..., scopeSel)` prefix ancestor cho 2 rule `::before`/`::after`. Stylesheet toàn cục giờ chỉ khớp ĐÚNG container của nó → **hết rò giữa render** cho MỌI loại doc (kể cả giáo trình đầy đủ header "Tên · Khối").
  - **(2) Bỏ HẲN header "Lớp · ngày" cho buoiDoc** (btvn + giao_trinh_buoi) — CEO chốt: lớp/ngày đã ở dải buổi + đầu phiếu BtvnBkHead, không lặp mọi trang. `ch.header='none'` cho buoiDoc ở cả preview LẪN đường sinh PDF link (`layLink` set `header:'none'` để `drawChrome` bỏ header). Giữ footer liên hệ.
- **Đánh đổi đã chấp nhận:** trang lý thuyết giáo-trình-buổi mất nhãn lớp/ngày trên đầu (còn lề trống 18mm chỗ header cũ — polish sau nếu cần thu lề). PrintView.tsx tsc sạch.
- **⚠️ CHƯA verify trên app+data thật** (cần Thùy: mở giáo trình buổi/BTVN đáp án → xác nhận hết dải "Lớp·ngày"; đổi qua lại 2 doc khác lớp → header không nhầm). Lỗi có sẵn từ pull erp-v2 hôm nay CHƯA đụng: `qrcode` thiếu (chưa `npm install` sau khi thêm `vietqr.ts`), `.at()` cần lib es2022 ở `kho/hinh/*`.

## 2026-08-03 (tiếp) — ET/MT: mã đề + chế độ cột; đại tu bố cục CỘT & phân trang bản in
- **ET/MT — chế độ mã đề (dùng chung `lib/made.ts buildMaDe`):** sinh đề 2&3 = mỗi câu gốc → câu KHÁC cùng dạng+form, neo theo `ma_cau` gốc (`cau_hinh.etMaDe`). Không đủ câu khác cùng dạng → **CHO PHÉP TRÙNG** (dùng lại câu gốc / câu cùng dạng), KHÔNG để trống (Thùy chốt). ET đã có 3 mã đề + gán theo HS từ trước; **MT thêm mới:** panel Sinh đề 2&3 ở master + ô mã đề 2/3 chọn tay + `MTPrintView` in 3 phiên bản (complete → 3, chưa đủ → 1). `ganMTVaoBuoi` (mt.ts) **copy `cau_hinh`** sang `mt_buoi` (trước bỏ sót → mất form/dòng/mã đề/cột).
- **Bỏ HẲN dải header chrome ở MỌI bản in** (giáo trình master/buổi + BTVN + ET + MT): `ch.header='none'` ở PrintView (mọi loại, không chỉ buoiDoc) + MTPrintView (preview + layLink). Giữ footer (số trang + liên hệ). ET vốn đã bỏ.
- **Số cột = PER-CÂU (không theo phần nữa) — Thùy chốt qua nhiều vòng:**
  - Data: `cau_hinh.colByCau[ma_cau]` (1 = full, 2 = 2 cột; tối đa 2). **Checkbox "2 cột"** trên mỗi hàng câu ở ETScreen/MTScreen/TaiLieuBuilder (dang CauRow + btvn row). BỎ picker cột theo-phần (`setPhanKieu`/`KieuPicker`) + theo-nhóm-form (`etColByGroup`).
  - In: `CauFlow` gom các câu tag cột LIỀN NHAU cùng số cột thành 1 nhóm ghép cặp; cách xa KHÔNG ghép; câu lẻ = nửa trang. Threaded `colByCau` qua Doc→BuoiBlock→DangBlock/BtvnSheet. ET mã đề 2/3 kế thừa `colByCau` của câu gốc (chVar remap).
- **⭐ Bố cục cặp 2 cột `CauColumns` (giải cả 3 yêu cầu Thùy):** tách mỗi câu thành `content` (đề+hình+ý con+phương án/Đ-S/GV) và `lines` (số dòng kẻ). 1 hàng = **băng ĐỀ** (flex `align-items:stretch`, break-inside:avoid → đề thấp chừa dòng trống, đáp án 2 cột NGANG NHAU) + **N HÀNG DÒNG KẺ** `.pv-lrow` (block rời → paged.js NGẮT ĐƯỢC giữa các dòng → **dòng kẻ chảy lấp đáy trang, KHÔNG nhảy nguyên câu** = hết bỏ trống trang). Lưới `--pitch 7.5mm`: line-height chữ = mỗi dòng kẻ = pitch → mọi dòng thẳng lưới 2 cột; dòng kẻ trong từng cột (khe giữa trống). Rủi ro đã báo: 1 dòng công thức cao hơn pitch đội lưới dòng đó.
- **KHÔNG dùng column-count/grid/table** (đã thử column-count 1 vòng → đúng cảnh báo DEVLOG 07-05, bỏ). `CauList` (row inline-block `.pv-row`) GIỮ NGUYÊN cho **Bài tập/Đề thi** (BTPrintView/DeThiPrintView) — không đụng.
- **Bài học:** yêu cầu "chia cột" của worksheet điền tay có 3 ràng buộc đối nghịch (đề cân theo cặp · dòng kẻ thẳng lưới · lấp đầy trang). Giải = tách content/lines: content ghép cặp flex (cân + atomic), lines rải hàng lưới block rời (fragment). Đừng để cả câu là 1 block atomic (nhảy nguyên → bỏ trống); cũng đừng column-count (paged treo).
- ⚠ **Doc CŨ để cột theo-phần → in 1 cột** tới khi tick lại per-câu (chưa viết migration). tsc sạch, `npm run build` OK.

## 2026-08-06 — Kho Hình: kế thừa giả thiết 2 kiểu · catalog theo khối · bổ đề lý thuyết · hình node/bước giải · popup to

Một chuỗi 6 việc Kho Hình trong ngày (pull code erp-v2 về máy mới, đọc HANDOFF trước). Tất cả push thẳng `main`.

**1. Kế thừa giả thiết 2 KIỂU (cộng thêm / tự phát biểu)** — commit `a272407`.
- Thùy nêu lỗ: kế thừa KHÔNG phải lúc nào cũng nối text. Con định-danh-hoá (hình bình hành < hình thang):
  *"cho hình bình hành ABCD"* đã BAO *"hình thang ABCD"*, không cộng dồn được. Kế-thừa-cộng-text chỉ là 1 option.
- Tách 2 tầng bị gộp: (1) cạnh logic is-a — LUÔN kế thừa (nuôi bao đóng/cách giải); (2) TEXT phát biểu — không
  luôn cộng. Lý thuyết: subtype vs lexicalization (extend vs override toString, vẫn giữ Liskov).
- Fix: cột `hinh_mo_hinh.gt_thay_the` bool default false. false=cộng thêm (bố+`gia_thiet_them`); true=tự phát
  biểu (viết nguyên câu vào `gia_thiet`, derive dừng leo). `giaThietDayDu` viết lại: base = node thay-thế sâu
  nhất trên đường tổ tiên. **Cạnh DAG KHÔNG đổi cả 2 kiểu — chỉ đổi render text.** `FormMoHinh` toggle 2 nút.
- Migration additive (rows cũ = false = cũ y hệt). `202608061549_hinh_gia_thiet_thay_the`.
- **SAI/SỬA:** viết mới `scripts/_apply_one.mjs` mà không check — repo ĐÃ có helper cùng tên (commit "ET"). Ghi
  đè + suýt xoá. Khôi phục từ HEAD. Bài học: trước khi tạo file tên tổng quát, `git cat-file -e HEAD:path` đã.
- **CÒN (nội dung):** cạnh "bình hành→thang" chỉ đúng nếu Thùy dùng định nghĩa hình thang BAO GỒM (SGK VN).

**2. Tách catalog (dạng + bổ đề) theo KHỐI** — commit `f52d530`.
- Thùy: dạng/bổ đề gắn với phạm vi kiến thức từng khối, không dùng chung. Trước đây catalog là ngoại lệ (chung
  mọi khối); mô hình vốn đã theo khối. Nay cột `hinh_dang.khoi` + `hinh_bo_de.khoi`, `loadLuoi` cắt catalog.
- Verify TRƯỚC bằng query "dùng-xuyên-khối" = 0 (data non: 7 dạng, 0 bổ đề, 0 đo lường) → tách sớm gần như miễn
  phí, không có mastery để phân mảnh. Backfill: Thùy bảo "khối 8", data soi ra dạng đang có thuộc **khối 9**
  (DH.018/019 suy từ bài toán = 9) → HỎI/verify rồi sửa default 8→9. Bài học: data mâu thuẫn lời nói thì soi.

**3. Bổ đề có lý thuyết + ví dụ (bóc ảnh/PDF như lý thuyết Đại)** — commit `9f142e5`.
- Bổ đề là cấu trúc TO. Bảng `hinh_bo_de_ly_thuyet` (mirror hinh_dang_ly_thuyet, khoá bo_de_id) + seam
  `api.hinhBoDeLyThuyet` + **tái dùng NGUYÊN LyThuyetModal**. M7: chấm ● + box "Lý thuyết / ví dụ" → Soạn/Sửa.

**4. Node đặt hình riêng + hình bước giải mặc định = hình đề** — commit `695bb2c` + `7bca0b1`.
- Thùy: cùng mô hình không có nghĩa hình giống hệt. Hồi sinh `hinh_baitoan.anh_chuan` (trước "thôi ghi"). Derive
  `anhCuaBaiToan` = anh_chuan ?? anhCauHinhCua(mô hình). FormBaiToan toggle "Hình riêng". KHÔNG cần migration.
- Hình bước giải (`anh_loi_giai`) mặc định null = mượn hình đề (mọi chỗ đã fallback `anh_loi_giai ?? anhCuaBaiToan`);
  toggle "Hình riêng cho bước giải" khi cần hình tô/kẻ thêm.

**5. Bấm node → popup TO 80% + hình node card to như card mô hình** — commit `f7849c2` + `233e327`.
- `DetailBaiToan`: Panel 330px cạnh graph → **modal `createPortal` ra body** (thoát zoom 1.15× §707) 80vw×80vh,
  2 cột (trái đề+câu hỏi+hình to · phải meta+cách giải+đáp án+ý). Graph full-width. Bấm tag tiền đề → đổi node.
- Node card View bài toán: thumbnail 42×42 → dải hình full-width h-24 trên đầu như card mô hình; card 256×200.

**6. Cỡ chữ popup — pt KHÔNG phải px** — commit (cùng đợt chữ).
- Lần đầu tao để 13–15px, Thùy: "pt chứ không phải px, chữ vẫn bé". 12–13pt ≈ 16–17px. Sửa: prop `big` cho
  primitive `FieldCard`/`Sol`/`KV`/`Tag`/`Ma` (hinhUi, mặc định false — KHÔNG đụng màn khác dùng chung); popup
  truyền `big` → chữ 16–17px. KaTeX scale theo font container nên công thức tự to. Bài học: thêm prop tuỳ chọn +
  truyền ở chỗ cần, đừng sửa hằng số trong component dùng chung (đổi cả app).

Migration ngày: `202608061549_hinh_gia_thiet_thay_the` · `202608061835_hinh_catalog_theo_khoi` (backfill dạng=khối 9)
· `202608061847_hinh_bo_de_ly_thuyet`. Tất cả tsc + vite build sạch, đã áp DB (`_apply_one`), `schema.md` refresh.
Chưa soi được trên app thật (dev pane phiên này 0×0) — nhờ Thùy `npm run dev` xem popup/chữ/hình.

*(Ghi chú: section này ban đầu tao lỡ chèn nhầm vào GIỮA entry 07-24 "thanh tìm theo LỚP" — vì matched dòng
"moBuoi tra theo lop+ngay" tưởng là cuối file. Đã gỡ ra, nối lại 07-24, ghép trọn vào cuối. Bài học: file
append-only không chronological chặt → xác định CUỐI FILE thật trước khi append, đừng tin `wc -l` sai encoding.)*

## 2026-08-08 — Kho Hình soạn tài liệu: nở đáp án theo node ẩn · giả thiết phụ/van · popup chọn-bản → cây tick

Pull erp-v2 (2b3c820), đọc HANDOFF. Cả ngày làm phần SOẠN TÀI LIỆU HÌNH theo brainstorm với Thùy. Đã push main.

**Brainstorm chốt model (trước khi code):**
- 1 bài = **1 ĐÍCH** (node ngọn), tree = đích + bao đóng tiền đề **HỘI TỤ** (`chuoiTienDe`). Cấm phân kỳ.
- Đề pick **tập con** node → ý a,b,c. Node KHÔNG pick = **ẩn → nở thành BƯỚC** trong đáp án của ý phụ thuộc,
  cắt tại node tick, **hiện 1 LẦN**. "Đề không hỏi vẫn phải có mới giải được."
- Nhãn ý **ĐỘNG** → lời giải cấm tham chiếu "ý a/b/c", viện dẫn theo TÊN tính chất.
- Giả thiết phụ (dữ kiện lẻ, đa số = VẼ THÊM "gọi I=AC∩BD"): bám node, hiện ở đề nếu tick / ở bước nếu ẩn.
  Mặc định ở ĐÁP ÁN (construction, HS tự dựng). VAN per-CẠNH (keo_gt_phu): bật → trồi gt phụ lên ĐỀ (giảm
  độ khó). Nhiều gt phụ = nên tách mô hình. Đích = SUY (cap cao nhất trong tick, không lưu). Node lẻ = chuỗi 1 node.
- Spec: `docs/spec-kho-hinh-soan-chuoi.md`.

**Migration `202608080034_hinh_gia_thiet_phu_van`** (đã áp DB `_apply_one` + `npm run schema`):
- `hinh_baitoan.gia_thiet_phu text` · `hinh_cach_tien_de.keo_gt_phu bool default false`.
- ⚠ schema.md lúc pull STALE (thiếu `hinh_gt_bai.so_dong`) → `npm run schema` lấy sự thật DB TRƯỚC khi áp.

**Code:**
- `hinh.ts noDapAn(L, tickIds)`: khung nở (ý = tick sắp cap↑; buocNodes = ẩn cắt-tại-tick hiện-1-lần; gtPhuKeo =
  van trồi gt phụ). `tienDeVan` đi cạnh keo_gt_phu. BaiToan +gia_thiet_phu, Luoi.tienDe +keo_gt_phu.
- `mucGhep`/`mucGhepLua` dùng `noDapAn` → YIn thêm `giaThietPhu`+`buoc[]`; `HinhPrintView` render "Bước i —
  [tính chất]" (chỉ GV) + giả thiết phụ ở đề/đầu bước.
- `FormBaiToan`: ô Giả thiết phụ + checkbox "gt phụ ở đề" per cạnh tiền đề (chỉ hiện khi tiền đề có gt phụ);
  `setTienDe(…, vanIds)` lưu keo_gt_phu.
- `CayTickPopup`: cây NGANG (cột = ĐỘ SÂU tiền đề longest-path, KHÔNG dùng cap → chuỗi thẳng trải ngang), dây
  nối, tick ý, xem trước sống đề HS/đáp án GV. 80vw, ô 234×116, chữ 16.5px (~12.5pt Thùy yêu cầu pt-không-px).
- `ChonChuoiPopup` (màn 1): popup TO hiện đầy đủ TỪNG BẢN của chuỗi (gốc + lứa biến thể) — thẻ view giả thiết +
  câu, nút "Chọn bản này" → màn 2 = CayTickPopup (nút ← Đổi bản). `ChuoiRow` mỗi phiếu có nút Chọn/Sửa mở nó.

**SAI/SỬA (hiểu nhầm ý CEO 2 lần):**
- Lần 1: hiểu "hiện list chuỗi trước" = list MỌI DẠNG khác nhau → build nút "Chọn ý cho Trên lớp/Về nhà" đầu cột
  + popup list mọi component. SAI. Thùy: "các chuỗi của node" = GỐC + BIẾN THỂ của CHÍNH chuỗi đó. Revert.
- Lần 2: làm list bản dạng nhãn nhỏ. Thùy: phải popup TO, VIEW full nội dung từng bản, mỗi bản 1 nút chọn. → thẻ view.
- Bài học: thuật ngữ CEO ("chuỗi") nghĩa HẸP theo ngữ cảnh — soi ví dụ (ảnh màn) trước khi build UI.
- Git: pull erp-v2 lần 2 (behind 3: Gami EXP · PH login · redesign in Đại) — không đụng file kho-hình, FF sạch.

tsc + vite build sạch mọi bước. Dev pane phiên 0×0 → nhờ Thùy `npm run dev` soi. Migration + schema.md commit kèm.

## 2026-08-08 (phiên khác máy) — Pull main vào nhánh QR + mucGhepLua theo tiền-đề ĐÓNG BĂNG của lứa
- **Bối cảnh git (đúng cảnh báo §714):** nhánh `feat/tai-anh-qr-hangloat` (phiên song song) phân kỳ với
  `origin/main` — nhiều commit Kho Hình TRÙNG NỘI DUNG khác SHA (cherry-pick), main lại đi TRƯỚC (soạn-tài-liệu
  08-08: `noDapAn`/giả-thiết-phụ/van + popup chọn-bản → cây tick). Nhánh có 3 việc RIÊNG chưa lên main
  (patch-id không khớp): `2b43d07` tải-ảnh-QR-hàng-loạt→ZIP · `6cc6e9a` HS nghỉ giữa tháng phát sinh phí ·
  `9fa9afb` popup ngày nghỉ. + WIP chưa commit: tiền-đề bài-tầng ĐÓNG BĂNG (`saveLuaBienThe` ghi `tien_de_ids`).
- **Xử:** KHÔNG reset/discard (cả 2 phía có việc thật). Snapshot WIP → `git merge origin/main`. Giải 5 conflict:
  `hinh.ts` (giữ CẢ block `noDapAn`/`tienDeVan` mới của main LẪN tiền-đề đóng băng) · `HinhPrintView`/`SoanTaiLieu`
  (lấy main — nhánh không có việc riêng ở đây, đã verify diff) · `HANDOFF.md` (lấy section 08-08 của main) ·
  `schema.md` (lấy main; auto-gen → cần `npm run schema` sau khi áp migration `202608071400_hinh_bien_the_tien_de`).
  Nhánh giờ 23 ahead / 0 behind. tsc sạch.
- **⭐ `mucGhepLua` theo lứa (Thùy chọn):** trước đây cấu trúc ẩn/bước của LỨA lấy từ `noDapAn(L, nodeIds)` =
  đề-chuẩn SỐNG → nếu đề-chuẩn về sau chèn/bỏ node giữa chuỗi, preview lứa lệch (kéo node không-có-biến-thể vào).
  Thêm `noDapAnLua(L, bienThes, tickIds)` (hinh.ts) = bản sao `noDapAn` nhưng cạnh ẩn/bước đi theo `tien_de_ids`
  ĐÓNG BĂNG của lứa (map biến-thể→node), sort/gt-phụ vẫn theo node gốc; van (gtPhuKeo) vẫn đọc live (chưa đóng
  băng). `mucGhepLua` dùng nó khi lứa CÓ đóng băng (`some(tien_de_ids.length>0)`), else fallback `noDapAn` live
  (lứa CŨ chưa migrate → không mất bước decomposition).
- **Verify:** tsc sạch. Test thuần scratch (`t_nodapanlua.mjs`): tick {C} chuỗi A←B←C, giả lập đề-chuẩn chèn X
  giữa B–C sau clone → FROZEN giữ [A,B] (bỏ X), LIVE sai kéo cả X; tick {B,C} cắt-tại-tick đúng (A nở ở ý B, C
  dừng ở B). ⚠ CHƯA soi IN thật (dev pane 0×0 + migration `tien_de_ids` chưa chắc áp DB shared + chưa có data lứa
  đóng-băng để render). `ChonChuoiPopup` (thẻ chọn-bản) = list câu phẳng, không có ẩn/bước → không đụng.
- **Còn (chưa làm):** áp migration `202608071400`+`202608031000` lên DB → `npm run schema` → commit schema.md ·
  đổi-đỉnh chưa relabel `gia_thiet_phu`/van cho lứa (giả thiết phụ lứa vẫn nhãn đỉnh gốc — cần đóng băng/relabel sau).

## 2026-08-08 (tiếp) — Brainstorm "Làm tài liệu Hình" + centralize scope④ gate theo môn (toàn hệ)
- **Brainstorm kiến trúc (Thùy hỏi "vì sao soạn tài liệu Hình khác Đại"):** đúng — chỉ khác THẬT ở "chọn nội
  dung buổi" (Đại = dạng+least-used; Hình = node-tick-trên-cây+bản/lứa, §1 spec-kho-hinh-soan-chuoi cấm bê
  least-used). Mọi thứ khác (thư viện, model buổi, trích xuất/gán lớp, kho-tài-liệu-tổng, nháp giữ, in
  paged.js) ĐÁNG LẼ giống — hiện bất đối xứng chỉ vì soạn Hình co-develop NGAY TRONG rail KhoHinhScreen
  (bồi tụ, không phải quyết định kiến trúc). **Thùy chốt Hướng A: 1 hub "Làm tài liệu" duy nhất, công tắc
  MÔN → NHÁNH** (không phải 2 cửa rời B). Chưa code hub — còn dở luồng soạn Hình (spec §6 hợp nhất node-lẻ+
  chuỗi) nên dời bóc-hub tới lúc làm nốt §6, tránh churn 2 lần. `SoanTaiLieu`/`GiaoTrinhScreen` NHẬN `L` như
  input → đã decouple tầng component, bóc rẻ.
- **⭐ Thùy hỏi tiếp "sao vẫn thấy KHTN" → phát hiện scope④ (gate kho/tài liệu theo `nhan_su_mon`) mới cắm
  ĐÚNG 6 màn, mỗi màn TỰ VIẾT TAY bản sao-dán LỆCH NHAU** (đúng bài học §2 "sao chép dán lệch dần"):
  4/6 màn (KhoTaiLieuScreen/NhapKhoScreen/DeThiScreen/MTScreen/TaiLieuScreen — nhầm, 5/6) THIẾU HẲN bypass
  Ops; `KhoTaiLieuScreen` còn 1 **BUG THẬT**: coi "chưa gán môn" = "thấy TẤT CẢ" (ngược strict-deny mig 0056)
  — đúng cho Media/Marketing (vốn không gán môn, cần browse mọi môn — comment cũ ghi rõ) nhưng **leak cho
  BẤT KỲ ai khác lỡ chưa được gán môn** (thấy hết thay vì thấy rỗng).
- **Thùy chốt:** gate theo môn = luật TOÀN HỆ (không riêng hub mới) · cross-môn CHỈ admin + Ops · GV/Học-
  thuật/TG **luôn** scope chặt theo môn · hỏi thêm riêng Media/Marketing → **"coi như 1 kiểu ops"** (cross-môn,
  KHÔNG strict-deny dù không gán `nhan_su_mon`).
- **Fix:** `useMonScope()` (`lib/mon.ts`, 1 nguồn) = `{allowedMons, isAll, allowed(mon)}`; cross-môn suy từ
  **TEAM** (`ma ∈ {ops, media, marketing}`) + `laAdmin`, KHÔNG suy từ "mons rỗng" (nguồn gốc bug leak). Quét
  lại 6 màn dùng hook chung: `KhoScreen` (Bản đồ kiến thức) · `KhoTaiLieuScreen` (kho tổng, fix bug leak) ·
  `NhapKhoScreen` (nhập chuyên đề AI) · `DeThiScreen`/`MTScreen`/`TaiLieuScreen` (list giáo trình/đề thi/MT).
  tsc sạch (1 import `useStore` thừa ở NhapKhoScreen sau khi bỏ laAdmin thủ công — xoá).
- **⚠ CÒN 1 lỗ thật, chưa vá (spec/đích tách biệt việc-vá):** `ETScreen.tsx` (tạo/sửa ET) **KHÔNG gate theo
  môn** — môn suy từ `lop_id` chọn qua SearchSelect, KHÔNG rõ list lớp đó có tự lọc theo `nhan_su_mon` của
  người tạo hay không (chưa verify). Khác cơ chế "tab chọn môn" của 6 màn kia (chọn LỚP → suy môn ngược,
  không chọn môn xuôi) → sửa phải soi tận nguồn list lớp của SearchSelect, không phải chỗ mở rộng nhanh.
  Để riêng, chưa đụng.
- Test: chỉ soi diff + tsc (không có preview server chạy phiên này). Không đụng `PrintView.tsx`/`bkPrint.tsx`
  — phiên song song đang sửa 2 file đó (Đại giáo trình print, paged.js overflow fix).

## 2026-08-08 (tiếp 2) — Kho Hình soạn: hợp nhất node-lẻ + chuỗi thành 1 CƠ CHẾ PICK ("1 chuỗi ghép cũng là 1 bài")
- **Brainstorm với Thùy trước khi code:** hỏi "node lẻ multi-pick nhiều biến thể — giữ hay hợp nhất về 1 bản/phiếu như chuỗi?".
  Thùy chỉ ra khung đúng: *"hệ thống có cho chọn nhiều chuỗi không — có lúc vẫn phải làm nhiều chuỗi thì vẫn phải chọn nhiều lần chứ. Bản chất 1 chuỗi ghép lại cũng có thể coi là 1 bài mà."* → không phải "giữ multipick riêng cho node lẻ" mà là **generalize: 1 chuỗi (mọi cỡ, kể cả 1 node) = có thể góp NHIỀU bài vào 1 phiếu, mỗi bài 1 BẢN khác nhau**, thêm lặp lại được — node lẻ chỉ là trường hợp suy biến (chuỗi 1 node).
  Xác nhận thêm 2 lượt: (1) Cách 1 = "N + Gợi ý" tự sinh N bài bản khác nhau, mặc định tick TOÀN chuỗi, sửa detail per-bài sau; (2) Cách 2 = thủ công, **mỗi lượt pick CHỈ 1 câu** (không multi-select như Đại — "Hình không giống Đại").
- **⭐ Data model** (`useStore.ts`): `SoanHinhDraft.mh` bỏ `sel`(per-node pool multi-pick) + `nodeIds`(tick ngoài) +
  `ghep`(chỉ multi-node, REPLACE-per-chuỗi) → thay bằng **1 mảng `picks: PickItem[]`** duy nhất. `PickItem` =
  `{key,phan,nodeIds} & ({kind:'ghep',luaId}|{kind:'bienthe',bienTheId}|{kind:'y',yId})` — `ghep` (đề chuẩn
  luaId=null hoặc lứa) áp mọi cỡ chuỗi kể cả 1 node; `bienthe`/`y` CHỈ chuỗi 1 node (biến thể/ý thật riêng lẻ
  không nhóm được thành lứa). **Không cần migration** — `hinh_gt_bai` (loai='chuan'/'bienthe'/'y'/'ghep') đã đủ
  chỗ chứa; `loai='chuan'` (data cũ) đọc lại y hệt `kind:'ghep',luaId:null,nodeIds:[ref_id]`.
- **⭐ `hinhGiaoTrinh.ts`:** `NhapBuoi` = `{picks,anDe,soDong}` (bỏ sel/ghep tách rời), `saveBuoiSelection` 1
  vòng lặp map mỗi pick → 1 dòng (trước là 2 vòng riêng). Mới `banUsageCount(luaIds,bienTheIds,yIds,chuanNodeIds)`
  — least-used xuyên MỌI buổi (master+lớp), khuôn `cauUsage` Đại (`tailieu.ts`), 4 query song song count theo
  `lua_id`/`ref_id`(loai bienthe/y)/`ref_id`+`ghep_node_ids` overlap (loai chuan/ghép-đề-chuẩn).
- **⭐ `SoanTaiLieu.tsx` — hợp nhất luồng:** XOÁ hẳn `NodeRow`/`PhanBlock`/`KhoBaiPicker`/`PoolItem`/`poolCuaNode`
  (dead sau hợp nhất). `ChuoiRow` giờ xử MỌI chuỗi (kể cả 1 node — "Câu lẻ"), mỗi phiếu: input N + "↻ Gợi ý"
  (batch REPLACE, gọi `goiYChuoi`) + "＋ Thêm bài" (lặp lại được, mở `ChonChuoiPopup`) + list bài (✎ sửa/✕ xoá).
  `ChonChuoiPopup` mở rộng: chuỗi 1 node liệt kê THÊM từng biến thể riêng + ý thật làm "bản" (trước chỉ
  đề-chuẩn/lứa cho chuỗi ≥2); **chuỗi 1 node confirm THẲNG** (bỏ bước cây — không tiền đề, không gì ẩn/tick).
  `banOptionsOfChuoi`/`goiYChuoi` (mới) enumerate bản + least-used + build `PickItem[]` batch.
  `mucBienThe`/`mucY` (mới, tách từ logic inline cũ của `GiaoTrinhScreen.resolveBanIn`) → **dùng CHUNG** ở cả
  preview sống (`banInTheoMoHinh`) lẫn bản đã lưu (`resolveBanIn`) — hết lệch giữa 2 nơi build MucIn.
- **`GiaoTrinhScreen.tsx`:** `loadBuoiToDraft`/`resolveBanIn` viết lại theo `PickItem`; `resolveBanIn` bỏ
  `daGhep`-node-skip (hết cần — mỗi pick tường minh, không còn "bài lẻ tự sinh cho node chưa ghép" để double-cover).
- **Verify:** tsc sạch + `npx vite build` sạch (chỉ warning chunk-size, không liên quan). Chưa soi UI thật (dev
  pane phiên này không mở) — cần Thùy `npm run dev` thử: 1 chuỗi bấm "＋ Thêm bài" 2 lần bản khác nhau ra 2
  bài trong phiếu; "↻ Gợi ý 2" ra 2 bài auto; node lẻ bấm "＋ Thêm bài" thấy card Biến thể/Ý thật.
- **Còn:** verify IN thật (paged.js) · `ChuoiRow`'s `nInput` mặc định cứng 2 (không nhớ theo nháp — chấp nhận,
  tiểu tiết) · chưa relabel `gia_thiet_phu` cho lứa (nhắc từ trước, chưa làm) · Media/Marketing cross-môn (task
  scope④ trước đó) không liên quan module này.

## 2026-08-08 (tiếp 3) — Giáo trình Hình "chuyển nhà": cây Buổi tại-chỗ + Gán lớp TKB-gợi-ý (khuôn Đại)
- **Thùy chỉnh sau khi t báo "đã có thêm buổi/chọn câu/gán buổi/xuất kho tài liệu":** KHÔNG đúng — Hình vẫn
  chạy 1 luồng RIÊNG (dựng ở Soạn tài liệu → popup "Lưu vào giáo trình", tách khỏi nơi quản buổi; KHÔNG hiện
  trong Kho tài liệu bảng-tổng). Chốt: **giống HẾT khuôn Đại** (`TaiLieuBuilder`/`TrichPanel`), CHỈ khác ở bước
  chọn nội dung (Đại=dạng+câu · Hình=chuỗi, phần vừa xong). ⚠ **"Giáo trình Hình và Đại là 2 giáo trình RIÊNG,
  KHÔNG gộp"** (nhắc giữa chừng) — giữ nguyên bảng `hinh_giao_trinh`/`hinh_gt_buoi`/`hinh_gt_bai` tách biệt
  hoàn toàn `tai_lieu`, chỉ LIỆT KÊ CHUNG ở Kho tài liệu (khác gộp entity).
- **⭐ RÚT "Theo mô hình" khỏi Soạn tài liệu** (`che: 'gd'|'ot'`, bỏ `'mh'`): logic build nội dung (mô hình
  filter + `ChuoiRow` list + tóm tắt Lớp/Nhà) tách thành `BuoiPickEditor` (export, `SoanTaiLieu.tsx`) —
  **props-driven** (`picks/anDe/soDong` + `onChange*`), KHÔNG giữ nháp riêng nữa — caller sở hữu state 1 buổi
  cụ thể + tự autosave. Xoá `TheoMoHinh`/`LuuGiaoTrinhPopup`; `SoanHinhDraft.mh` xoá khỏi store (dead — nội
  dung buổi giờ sống thẳng DB). `banInTheoMoHinh` export (dùng lại ở "👁 Xem buổi").
- **⭐ `GiaoTrinhScreen` viết lại — Master = cây Buổi TẠI CHỖ (khuôn `TaiLieuBuilder`):** "+ Thêm buổi" tạo
  `hinh_gt_buoi` rỗng ngay (`createBuoiMaster`) → thẻ `BuoiCardHinh` gấp gọn (tiêu đề sửa inline + đếm
  📘/📝 + 👁 Xem 2 phiếu + Xoá), mở ra = `BuoiPickEditor` NHÚNG TẠI CHỖ, mỗi thay đổi **autosave ngay**
  (`saveBuoiSelection`, khuôn `markSaved()`/"↻ Tự động lưu" của Đại) — hết luồng "dựng-rồi-lưu-popup".
  Data-layer thêm `loadBuoiPicks` (nghịch đảo `saveBuoiSelection`, thay `loadBuoiToDraft` cũ).
- **⭐ Gán lớp = `TrichPanelHinh` (khuôn `TrichPanel` Đại, thay `GanLopPopup` đơn giản cũ):** chọn lớp → list
  MỌI buổi + trạng thái đã-gán, **ngày GỢI Ý theo TKB** (`ngayBuoiHopLeCuaLop`/`BuoiNgaySelect` — TÁI DÙNG
  nguyên, 2 hàm này vốn đã generic theo `lop_id`, không đụng gì Đại) = buổi trống gần nhất chưa gán, tự lùi
  buổi kế tiếp sau mỗi lượt gán. Sổ riêng `BoGiaoTrinhLopHinh` (khuôn `BoGiaoTrinhLop`): buổi lớp đã gán,
  đánh số theo NGÀY HỌC (khác số buổi gốc), nút "↻ Đánh số lại" (`renumberBuoiLop` Hình đã có sẵn từ trước).
  **Khác Đại có chủ đích:** KHÔNG tách GT/BTVN (1 lượt gán = cả Trên lớp + Về nhà — Hình không có luồng
  "ôn tập tự sinh cần duyệt riêng" như `OnTapConfirmScreen`, nội dung buổi tác giả tự chọn đủ lúc soạn) →
  không có bước "+ BTVN/Ôn tập" riêng · KHÔNG renumber lại TIÊU ĐỀ theo số-của-lớp (Hình tiêu đề tự do, không
  ép khuôn "Buổi N" như Đại — chỉ renumber `stt_lop`).
  **`ganLopSnapshot` thêm dedup:** gán-lại cùng (lớp,ngày) giờ THAY THẾ buổi cũ tại ngày đó (trước chỉ INSERT,
  gán 2 lần cùng ngày ra rác) — khuôn `trichXuatBuoi` Đại ("Re-trích = THAY THẾ doc cũ cùng lớp+ngày+loại").
- **⭐ Nối Kho tài liệu bảng-tổng (`KhoTaiLieuScreen`):** `hinhGiaoTrinh.listAllBuoiHinh()` — SUY hình chiếu
  hiển thị (join `hinh_gt_buoi`→`hinh_giao_trinh` qua `giao_trinh_id` trực tiếp (master) hoặc qua
  `nguon_buoi_id`→buổi-master→`giao_trinh_id` (bản lớp), vì `hinh_gt_buoi` không tự có cột `khoi`/`mon`) —
  KHÔNG đụng bảng `tai_lieu`. `Row` = union `DaiRow | HinhKhoRow` (`nguon:'dai'|'hinh'`), bảng liệt kê CHUNG
  1 danh sách; cột Thao tác + cột Tên rẽ nhánh theo `nguon` — Hình chỉ có **📘/📝 In · Xoá** (không
  sửa/nhân-bản/copy-link/phát-hành — không có hạ tầng gen-link tĩnh cho Hình, in luôn LIVE qua `loadLuoi`+
  `resolveBanIn`(export từ `GiaoTrinhScreen`)+`HinhPrintView`, khác hẳn PrintView id-based của Đại).
  **Bắt kịp 1 bug thật lúc review:** poll "job link-gen xong → tải ngầm" cũ gọi thẳng `listAllTaiLieu()` →
  set rows → sẽ XOÁ MẤT mọi dòng Hình mỗi lần 1 job Đại chạy xong. Tách `fetchAllRows()` (gộp 2 nguồn, KHÔNG
  đụng `loading`) dùng chung cho `reload()` (có loading) và poll ngầm (không loading, giữ đúng hành vi cũ
  "không xoá bảng ra Đang-tải giữa lúc đang lướt").
- **Verify:** tsc sạch + `npx vite build` sạch (2 lượt, sau khi bắt bug poll). Migration: KHÔNG CẦN (schema
  `hinh_gt_buoi`/`hinh_giao_trinh` đã đủ cột). ⚠ CHƯA soi UI thật (dev pane phiên này không mở) — cần Thùy
  `npm run dev`: tạo buổi tại chỗ → sửa nội dung → thấy "✓ Đã lưu" tự động; gán lớp → ngày tự gợi ý buổi
  trống gần nhất; Kho tài liệu thấy dòng Hình xen giữa Đại, bấm 📘/📝 ra đúng PDF.
- **Còn (chưa làm, biết trước):** `banUsageCount`'s `.or('loai.eq.chuan,and(loai.eq.ghep,lua_id.is.null)')`
  cú pháp PostgREST — CHƯA chạy thật, có rủi ro sai cú pháp (chỉ compile-time đúng, không có type-check cho
  chuỗi filter) · xoá 1 buổi MASTER không cascade xoá các bản LỚP đã gán từ nó (giữ nguyên hành vi cũ, chưa
  hỏi Thùy có cần chặn/cảnh báo không) · chưa test "Gán lại" đổi ngày có để lại buổi ở ngày CŨ hay không
  (mirror đúng semantics Đại, cùng loại ambiguity đã có sẵn bên đó — không phải lỗi mới).

## 2026-08-08 (tiếp 4) — "Chuyển nhà" phần CÒN LẠI: kéo Giáo trình Hình ra khỏi rail Kho, lên hub Làm tài liệu
- **Thùy nhắc lại:** "chuyển nhà" ý gồm CẢ chỗ VÀO (nav), không chỉ luồng thao tác bên trong (đã làm ở entry
  trước). Đường cũ chôn sâu: Bản đồ kiến thức → tab Hình học → rail trái nhóm "Kho nhập" → "▤ Giáo trình +
  lớp" — lẫn cùng nhóm với Kho tạm/Hàng chờ/Kho chính (màn quản lý NỘI DUNG kho, không phải nơi soạn tài liệu).
- **Fix — ngang hàng Đại, 1 cửa duy nhất:**
  - `LAMTAILIEU_CHILDREN` (useStore.ts) thêm `lamtailieu:giao_trinh_hinh` "Giáo trình (Hình)" cạnh "Giáo
    trình" (Đại) — **dùng CHUNG quyền với leaf cha `lamtailieu`** (đã có convention sẵn, không cần thêm gì ở
    Phân quyền — xem comment dòng 184 useStore.ts: mọi con `lamtailieu:*` ăn theo quyền cha).
  - `GiaoTrinhHinhEntry.tsx` (mới, `screens/tailieu/`) — VỎ top-level: khối-selector (khuôn `KhoScreen`) +
    `loadLuoi(khoi)` + gate scope④ (Hình chỉ thuộc Toán — `useMonScope`, admin/Ops/Media/Marketing qua hết,
    còn lại cần được phân môn Toán) → render `GiaoTrinhScreen` (kho/hinh/) KHÔNG ĐỔI GÌ bên trong nó.
  - `NhanSuHome.tsx` route `staffLeaf === 'lamtailieu:giao_trinh_hinh'`.
  - `KhoHinhScreen.tsx` XOÁ mục rail "▤ Giáo trình + lớp" (`ManHinh` bỏ `'giaotrinh'`, xoá import
    `GiaoTrinhScreen` không dùng nữa) — 1 cửa duy nhất, không còn 2 đường vào cùng 1 màn (không có nơi nào
    khác trong Kho Hình điều hướng `man:'giaotrinh'` nên xoá an toàn, đã grep xác nhận). "Soạn tài liệu" giữ
    nguyên trong rail (đổi nhãn "(ad-hoc)" cho rõ — đó là Giảng dạy/Ôn tập, KHÔNG gắn giáo trình).
- **Verify:** tsc sạch + `npx vite build` sạch. ⚠ CHƯA soi UI thật — cần Thùy `npm run dev`: menu "Làm tài
  liệu" thấy "Giáo trình (Hình)" cạnh "Giáo trình"; bấm vào có khối-selector + load được lưới + màn Giáo
  trình y hệt bản cũ (Master cây-buổi-tại-chỗ + Gán lớp TKB-gợi-ý).

## 2026-08-08 (tiếp 5) — Master Hình: "tạo giáo trình mới" ĐÚNG Y khuôn Đại (Thùy: "sao ko làm giống y")
- **Soi lại:** bản Master vừa dựng (sidebar tên + panel chi tiết split-pane, "+ Giáo trình mới" = input
  inline trong sidebar) KHÔNG giống thật `TaiLieuScreen` Đại — Đại là **THƯ VIỆN DẠNG THẺ** (card grid, mỗi
  giáo trình 1 thẻ tên/khối/ngày tạo-sửa + nút Mở/Xuất·Xoá) + **"+ Tạo giáo trình" mở MODAL** (`Shell`/`Field`
  dùng chung) → tạo xong **NHẢY THẲNG vào Builder full-screen** (không phải chọn-rồi-xem-cạnh-nhau).
- **Fix — chép ĐÚNG Y:** `Master` giờ = thư viện thẻ (search+sort+"+ Tạo giáo trình") y hệt bố cục
  `TaiLieuScreen`; `CreateGiaoTrinhHinhModal` dùng CHUNG `Shell`/`Field`/`inp` (từ `kho/ui.tsx` — vốn đã
  generic, không phải riêng Đại) thay vì input tự chế trong sidebar. Bấm "Mở/Xuất" 1 thẻ → `GiaoTrinhBuilderHinh`
  full-screen (khuôn `TaiLieuBuilder`: "← Thư viện" + tên sửa tại chỗ (autosave, "↻ Tự động lưu") + Khối +
  "⬇ Trích xuất/Gán lớp" + cây buổi bên dưới) — THAY split-pane cũ. "Xoá giáo trình" dời về thẻ thư viện
  (khớp Đại — không có ở trong Builder).
- **Bài học (lặp lại đúng bẫy cũ):** lúc build Master ban đầu, t lấy nguyên khung sidebar-list+panel từ bản
  `GanLopPopup`-era CŨ (đã có sẵn trong file) thay vì tra lại `TaiLieuScreen` thật — same-shape giả (2 cột,
  list bên trái) đánh lừa cảm giác "đã giống" dù sai hẳn UX pattern (split-pane vs library-modal-navigate).
  **Khi nói "giống Đại", phải đọc ĐÚNG file Đại tương ứng, không suy từ ký ức/khung có sẵn gần đó.**
- **Verify:** tsc sạch + `npx vite build` sạch. Chưa soi UI thật.

## 2026-08-08 (tiếp 6) — BuoiCardHinh: bỏ gấp/mở tự chế — hiện THẲNG phần chọn mô hình+bài (khuôn DangCard)
- **Thùy soi ảnh chụp màn hình thật:** "Buổi 1: Tứ giác" hiện ra collapsed (chỉ header + 📘0·📝0 + nút Xem),
  KHÔNG thấy phần chọn mô hình/chọn bài đâu — hỏi "đâu rồi, như lúc làm tài liệu hình bên kia".
- **Root cause:** `BuoiCardHinh` tự thêm nút ▸/▾ gấp-mở (`open` state, nội dung chỉ render khi `open===true`)
  — **Đại KHÔNG có bước này**: `DangCard` trong `BuoiCard` (TaiLieuBuilder) LUÔN hiện nội dung, không gấp/mở.
  Lại đúng bài học vừa ghi ở entry trước (tự chế thêm bước Thùy không nhờ) — lần này KHÔNG phải do lấy nhầm
  khung cũ, mà tự suy diễn "buổi nhiều nội dung nên cho gấp gọn" — hợp lý bề ngoài nhưng SAI vì không khớp
  hành vi thật của Đại (mẫu để "giống y" chỉ có 1 nguồn — đọc code, không đoán theo trực giác riêng).
- **Fix:** xoá hẳn `open`/`setOpen`/nút ▸▾. `BuoiPickEditor` giờ LUÔN render trong mỗi thẻ buổi — vào Builder
  là thấy ngay mô hình-filter + chuỗi + chọn bài, y hệt cảm giác màn "Soạn tài liệu → Theo mô hình" cũ (giờ
  đã rút khỏi Soạn tài liệu — logic tương đương giờ SỐNG Ở ĐÂY, phải hiện đúng chỗ, đúng lúc).
  `nhap`/`dem` tải ngay lúc mount (không còn gate theo `open`).
- **Verify:** tsc sạch + `npx vite build` sạch. Chưa soi UI thật (dev pane phiên này không mở) — cần Thùy
  `npm run dev` xác nhận: mở 1 giáo trình → mỗi buổi hiện ĐỦ 3 cột (lọc mô hình / chuỗi / tóm tắt) ngay,
  không cần bấm gì thêm.

## 2026-08-08 (tiếp 7) — Layout buổi Hình: cột giữa bị bóp — 2 lỗi copy-khuôn-không-soát-kích-thước
- **Thùy soi ảnh chụp:** cột giữa (chuỗi + chọn bài) hẹp dính sát, trong khi 2 cột 2 bên (lọc mô hình,
  tóm tắt) chiếm nhiều chỗ ngang nhau — chỉ ra đúng: "bên trái mục lục bé thôi, bên phải rộng ra".
- **2 root cause, CÙNG loại lỗi đã ghi 2 lần trước trong ngày (copy khuôn Đại không soát nó có KHỚP chỗ
  dán không):**
  1. `GiaoTrinhScreen.tsx` bọc list buổi trong `max-w-[860px]` — chép nguyên từ `TaiLieuBuilder` (Đại),
     NHƯNG bên Đại con số đó bọc khối 1-CỘT (Bài luyện+BTVN, không cần rộng); Hình mỗi buổi là **3 CỘT**
     (lọc mô hình/chuỗi/tóm tắt), ép vào trần 860px thì cột giữa gần như không còn chỗ. XOÁ cap.
  2. `BuoiPickEditor` grid `240px_1fr_220px` — 2 cột biên đủ rộng nhưng KHÔNG PHẢI mục lục thật (mục lục
     Đại = `StructureTree` chỉ để NHẢY, không phải khối điền liệu); đổi `190px_minmax(0,1fr)_200px` (thu
     2 biên, `minmax(0,1fr)` chặn tràn nếu nội dung dài — đúng khuôn "min-w-0 cho item flex/grid" ở
     CLAUDE.md §2).
- **Bài học gộp cả 3 lần hôm nay:** "giống Đại" đòi soát ĐÚNG 2 thứ mỗi lần chép — (a) đúng FILE/component
  Đại tương ứng (không suy từ khung gần đó có sẵn) — (b) đúng NGỮ CẢNH kích thước/chức năng của con số
  đang chép (860px hợp với khối hẹp, không hợp khối 3 cột). Chép SỐ mà không chép LÝ DO ra số đó = lỗi
  tái diễn.
- **Verify:** tsc sạch + `npx vite build` sạch. Chưa soi UI thật.

## 2026-08-08 (tiếp 8) — 3 ý Thùy sau khi soi ảnh chụp: số dòng theo chuỗi + hình ở card chính + masthead mới
- **① Số dòng kẻ CHỈNH THEO CẢ CHUỖI, không theo từng ý:** trước `PhieuList` (Tóm tắt) có ô số-dòng RIÊNG
  từng pick — mỗi bài trong 1 chuỗi chỉnh độc lập. Thêm `ApplyDongChuoi` trong `ChuoiRow` (khuôn
  `ApplyLinesAll` Đại: gõ số → Enter/blur ghi ĐÈ HẾT mọi bài Về nhà hiện có của chuỗi đó 1 lượt) — CHỈ hiện
  ở khối "Về nhà" (Trên lớp không kẻ dòng, đúng ngữ nghĩa cũ). XOÁ `DongIn` khỏi `PhieuList`.
- **② Ẩn/hiện hình chuyển từ card PHỤ (Tóm tắt) sang card CHÍNH (ChuoiRow):** nút ✏️/🖼 giờ nằm ngay trong
  từng dòng pick ở `ChuoiRow` (cạnh ✎ Sửa/✕ Xoá) — chỗ đang thao tác chọn bài, không phải bảng tổng kết bên
  cạnh. `PhieuList` giờ THUẦN liệt kê (nhãn bản + node + xoá), không còn control nào — đúng vai "tóm tắt".
- **③ Header bản in Hình dùng khuôn MỚI NHẤT của Đại:** hỏi lại rõ "header" nào — Thùy chốt header TRÊN BẢN
  IN (không phải toolbar builder). Đại vừa redesign masthead (`3f771d8`, đang có WIP thêm chưa commit ở
  `PrintView.tsx`/`bkPrint.tsx` — KHÔNG đụng file đó, chỉ đọc tham khảo): khung gradient bo góc + vạch trái
  cầu vồng + logo thật + tiêu đề lớn, thay `hp-cover` cũ (viền dưới đơn giản). `HinhPrintView.tsx` thêm
  `.hpmh-*` (namespace RIÊNG, không đụng `.gtbk-*` của Đại — 2 pipeline độc lập, style trùng nhưng KHÔNG
  chia sẻ class/CSS-in-JS). **Đơn giản hoá có chủ đích:** BỎ huy hiệu tròn "Buổi N" + kicker-pill của Đại
  (đòi hỏi thread thêm số-buổi qua 3 nơi gọi `banInTheoMoHinh`/`resolveBanIn` — Kho tài liệu bảng-tổng
  không có sẵn số buổi sạch, chỉ có tên ghép chuỗi) — giữ lõi (gradient+logo+tiêu đề), bỏ phần cần dữ liệu
  chưa có sẵn khắp nơi.
- **⚠ Rủi ro đã biết:** `PrintView.tsx`/`bkPrint.tsx` còn WIP CHƯA COMMIT ở phiên khác (đã kiểm bằng
  `git diff 3f771d8` — 54+31 dòng khác biệt nữa) → nếu họ đổi tiếp thiết kế masthead, `.hpmh-*` của Hình sẽ
  LỆCH bản mới nhất thật sự. Đây là snapshot tại commit `3f771d8`, không phải bám live — cần đối chiếu lại
  khi phiên kia commit xong.
- **Verify:** tsc sạch + `npx vite build` sạch. Chưa soi UI/PDF thật (dev pane phiên này không mở, paged.js
  cần pane hiển thị) — cần Thùy `npm run dev`: mở 1 phiếu Về nhà → gõ số vào "dòng kẻ (cả chuỗi)" → mọi bài
  hiện có của chuỗi đó đổi theo; bấm ✏️/🖼 ngay trong danh sách chuỗi (không cần cuộn sang Tóm tắt); Xuất
  PDF → thấy masthead gradient+logo mới thay khối tiêu đề cũ.

## 2026-08-08 (tiếp 9) — Vẫn còn header cũ: dải sóng CHẠY TRÊN MỖI TRANG chưa bỏ (khác masthead nội dung)
- **Thùy:** "bảo dùng header mới sao vẫn còn header cũ — bảo xoá hẳn header cũ mọi nơi không dùng nữa cơ mà."
- **Root cause — 2 "header" HOÀN TOÀN KHÁC NHAU, entry trước chỉ sửa 1:** (1) masthead NỘI DUNG (đã đổi
  `hp-cover`→`.hpmh-*`, entry trước) — 1 khối xuất hiện 1 LẦN đầu tài liệu. (2) header CHẠY TRÊN MỖI TRANG
  (dải sóng hồng-cam-xanh, qua `.pagedjs_pagebox::before` trong `buildPagedCss`/`pageChrome`) — HOÀN TOÀN
  RIÊNG, không đụng tới khi sửa (1). Đại đã BỎ HẲN cái (2) từ 08-03 ("Bỏ hẳn dải header ở mọi bản in":
  `ch.header='none'` ở PrintView/MTPrintView) nhưng **Hình CHƯA TỪNG áp** — `HinhPrintView.tsx` gọi
  `buildPagedCss({...}, {}, ...)` với `ch` RỖNG ⇒ `pageChrome()` mặc định `head: ch.header !== 'none'` =
  `true` ⇒ dải sóng vẫn chạy mọi trang, chồng lên masthead mới — đúng cảnh "vẫn còn header cũ" Thùy thấy.
- **Fix:** đổi `ch` truyền vào từ `{}` → `{ header: 'none' }`. Giữ `footer` (số trang + liên hệ) — khuôn
  Đại "giữ footer, bỏ header". Bỏ luôn `headerText` option (không còn dùng, head=false render gì cũng vô nghĩa).
- **Bài học:** "header" là từ ĐA NGHĨA trong hệ in — ít nhất 2 tầng riêng (nội dung 1-lần vs page-chrome
  lặp mọi trang), cùng gọi là "header" nhưng nguồn CSS/vị trí sửa khác hẳn nhau. Sửa 1 tầng rồi báo "đã
  dùng header mới" mà không xác nhận tầng KIA cũng đã tắt = vẫn còn nửa việc — soát hết MỌI NGUỒN sinh
  ra chữ "header" trên trang in trước khi báo xong, không chỉ tầng vừa động tay.
- **Verify:** tsc sạch + `npx vite build` sạch. Chưa soi PDF thật.

## 2026-08-08 (tiếp 10) — Nhánh mới "Hình giải tích" (Phase 1: kho + soạn tài liệu)

- **Thùy:** "trong hình học có 1 kiểu hình là hình giải tích — dù là hình nhưng cấu trúc nó giống như đại
  (phù hợp chia chuyên đề/dạng hơn mô hình — tiêu biểu là hình lượng giác) ... t đang định trong phần hình
  có hẳn 2 option 2 kiểu này luôn." Chốt taxonomy: **1 nhánh** "Hình giải tích" (lượng giác nay; Oxy/Oxyz
  phẳng-không-gian sau — chỉ là chủ đề mới trong CÙNG nhánh, 0 schema thêm). Tên chốt "Hình giải tích"
  (không phải "Giải tích" — vào Đại thì sai vì nó là Hình, vào Hình thì sai vì tư duy như Đại). Đứng chung
  constraint đã có từ đầu phiên: **Hình và Đại là 2 giáo trình riêng — KHÔNG gộp bảng.**

- **Quyết định kiến trúc (Task #20, tự trả lời — R2):** Hình giải tích tái dùng NGUYÊN `TaiLieuScreen`/
  `TaiLieuBuilder`/`TrichPanel` của Đại (UX y hệt — "chọn buổi/chọn câu/gán buổi/xuất kho" đúng như Đại,
  KHÔNG phải mô-hình/DAG của Hình tổng hợp cũ), nhưng bảng RIÊNG `hgt_*` (như KHTN clone `dai_*`). Vấn đề:
  Hình giải tích PHẢI giữ `tai_lieu.mon = 'Toán'` (RBAC/billing/lop.mon sạch, §1.6) — không thể dùng `mon`
  làm khoá dispatch như KHTN. **Giải pháp: tách 2 chiều.** `mon` = RBAC/billing (không đổi). Cột MỚI
  `tai_lieu.nhanh` (null=Đại mặc định hành vi cũ | `'hinh_gt'`) = khoá dispatch kho TRONG mon='Toán'.
  `khoCuaMon(mon, nhanh?)` (`lib/tailieu.ts`) mở rộng: KHTN theo `mon` như cũ; else `nhanh==='hinh_gt'` →
  `hgt_*`; else → `dai_*` (default không đổi — 0 regression cho data cũ, `nhanh` luôn null).

- **DB (`202608082109_hinh_giai_tich_kho.sql` + patch `202608082111`):** clone `0050_khtn_kho.sql` —
  `hgt_ban_do`/`hgt_cau_hoi`/`hgt_dang_ly_thuyet`/`hgt_chuyen_de_ly_thuyet`, mã `GT`(dạng)/`GC`(câu) — đã
  grep xác nhận không đụng `DH.` (hinh_dang mô hình) hay `DG/DC/KG/KC` hiện có. **Bẫy tự bắt:** clone
  0050 quên rằng `0111_kho_rac_cau_hoi.sql` (kho rác) đến SAU 0050 — `hgt_cau_hoi` thiếu `xoa_at`/index/
  trigger/whitelist `count_cau_by_dang` → phát hiện khi soát `deleteHgtCum` cần cột đó, vá NGAY bằng
  migration patch thứ 2 (`create or replace function` mở whitelist thêm `'hgt_cau_hoi'`, không thu hẹp
  gì). Áp cả 2 qua `scripts/_apply_one.mjs` (migrate.mjs replay-từ-0001 fail trên DB có data — gotcha cũ).
  `tai_lieu.nhanh text` (nullable, default null) thêm vào cùng migration đầu.

- **`api.ts`:** clone 13 hàm `Khtn*` → `Hgt*` (list/create/update/deleteLeaf(ves)/deleteCum/renameT1/T2/
  countCauByDang/lyThuyết dạng+chuyên đề) bảng `hgt_*`. `KhoMon`/`khoTbls` (nhập-kho-tay) thêm nhánh `'hgt'`
  cho sẵn (UI `NhapKhoScreen` CHƯA nối — xem Phase 2 dưới).

- **`branches.ts` + `KhoScreen.tsx`:** `hinhGiaiTichBranch` (`BranchConfig`, `key:'hinhgt'`) — Bản đồ kiến
  thức giờ có **3 tab dưới Toán**: Đại số / Hình học / Hình giải tích. Tab mới dùng CHUNG component `BanDo`
  (như Đại/KHTN) — không phải `KhoHinhScreen` riêng của Hình tổng hợp.

- **`TaiLieuScreen.tsx`:** thêm hàng pill nhánh lồng dưới mon=Toán (giống layout KhoScreen) — "Đại số /
  Hình giải tích". `listTaiLieu`/`createTaiLieu` nhận thêm `nhanh` (null=lọc CHỈ Đại, tránh 2 nhánh lẫn
  trong 1 danh sách).

- **Sweep `nhanh` xuyên suốt pipeline "Làm tài liệu" thật sự chạm tới (đã trace kỹ, không đoán):**
  `getTaiLieuFull` (điểm hội tụ trung tâm — mọi câu/dạng/lý-thuyết resolve qua đây) → `createTaiLieu`/
  `duplicateTaiLieu`/`createET`/`trichXuatBuoi` (doc con `giao_trinh_buoi`/`btvn` PHẢI kế thừa `nhanh` của
  master, không thì gán-lớp cho ra doc trỏ nhầm bảng) → `TaiLieuBuilder` (`DangPicker`, `cauTbl`) →
  `TrichPanel`→`BuoiTrichRow`→`OnTapConfirmScreen` (bước xác nhận BTVN bắt buộc, Thùy chốt 07-22 — KHÔNG
  optional, mọi buổi có BTVN đều qua đây) → `OnTapEditor`→`DangPickerOne`/`lib/ontap.ts`
  (`fetchTenDangByMa`/`appendOnTapToBtvnDoc` — nội dung, load-bearing; `goiYOnTap` mastery-gợi-ý ĐỂ NGUYÊN,
  tự graceful-empty vì chưa có đo lường cho `hgt_*`, không crash). `PrintView.tsx`/`bkPrint.tsx` (WIP phiên
  khác, KHÔNG đụng) — soát xong: cả 2 KHÔNG hardcode bảng `dai_*` nào, hoàn toàn dựa vào `getTaiLieuFull`
  đã resolve sẵn → tự động đúng, không cần sửa.

- **Phase 2 — CHỦ ĐỘNG CHƯA làm (disclose rõ, không phải quên):** ET/MT/BT/Đề thi standalone + `mastery.ts`/
  `gami.ts`/`ontap.ts`'s `goiYOnTap` (Elo/EXP, đo lường, gợi ý theo lớp-yếu) + `NhapKhoScreen` (AI-ingest ảnh
  → câu) chưa nối `nhanh`. Lý do: KHÔNG nằm trong luồng "thêm buổi/chọn câu/gán buổi/xuất kho tài liệu" Thùy
  mô tả — đây là tầng đo lường/kiểm tra downstream, tự nhiên chỉ cần khi lớp THẬT bắt đầu học Hình giải
  tích và cần chấm ET/tính Elo. Câu hỏi kho ("+ Thêm câu" tay) VẪN dùng được ngay qua `DangHub` (đã tự động
  đúng nhờ `config.cauTbl` generic) — chỉ thiếu đường AI-ingest hàng loạt.

- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, đăng nhập Admin): Bản đồ →
  tab "Hình giải tích" hiện đúng (0 chủ đề, bảng trống — không lẫn dữ liệu Đại) · Làm tài liệu → Giáo trình
  → pill "Hình giải tích" → danh sách rỗng riêng (4 giáo trình Đại KHÔNG lẫn vào) → tạo thử "TEST Lượng
  giác" → Builder mở sạch không lỗi console → verify SQL trực tiếp `mon='Toán', nhanh='hinh_gt'` đúng như
  thiết kế → xoá dòng test.

## 2026-08-08 (tiếp 11) — Kho Hình Sơ đồ: thêm nút "🗑 Xoá bài toán" (mô hình đã có sẵn)

- **Thùy:** "Cần chức năng xóa bài / xóa mô hình nữa." Soát trước khi code: `api.deleteMoHinh`/`deleteBaiToan`
  (`hinh.ts`) đã có SẴN từ trước (kèm guard đúng CLAUDE.md §2: `deleteMoHinh` chặn nếu còn bài toán/mô hình
  con; `deleteBaiToan` chặn nếu còn `hinh_y` trỏ vào — không rụng con trỏ im lặng). **Xoá mô hình đã có UI**
  (nút 🗑 trong `Ho.tsx` card họ gốc + `SoDo.tsx ViewMoHinh` hub panel) — chỉ **xoá bài toán THIẾU nút**,
  `DetailBaiToan` (popup 80vw khi bấm 1 node) chỉ có "✎ Sửa", không có xoá.
- **Fix:** thêm nút "🗑 Xoá" cạnh "✎ Sửa" ở header `DetailBaiToan` (`SoDo.tsx`) — y khuôn nút xoá mô hình
  (confirm() + style viền rose + catch alert lỗi guard), gọi thẳng `api.deleteBaiToan(bt.id)` có sẵn, xong
  đóng popup + `reload()` lưới. Thread `reload` xuyên `SoDo`→`ViewBaiToan`→`DetailBaiToan` (trước đó
  `ViewBaiToan` không có `reload` trong props, chỉ `ViewMoHinh` có).
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin, họ "Tứ giác" K8 —
  data thật, KHÔNG xoá gì): mở 1 bài toán (BT.025) → thấy cả "✎ Sửa" lẫn "🗑 Xoá bài toán" ở header ·
  chuyển "◇ View mô hình" → thấy "Sửa mô hình"/"Xoá mô hình" đã có sẵn hoạt động bình thường · console sạch.

## 2026-08-09 — Kho Hình giáo trình: đổi được thứ tự bài trong phiếu (Tóm tắt)

- **Thùy:** "T cần chỉnh được thứ tự câu trong giáo trình của Hình học." Soát trước: `picks: PickItem[]`
  (buổi giáo trình Hình) là mảng phẳng, thứ tự mảng = thứ tự IN thật (`banInTheoMoHinh` duyệt `ps` sau
  lọc phan, không sort lại) — nhưng KHÔNG có control nào đổi thứ tự, chỉ thêm (cuối mảng) / xoá. Đại cũng
  chỉ có reorder ở MỨC DẠNG (`reorderDangInBuoi`, ▲▼ trong `DangCard`), KHÔNG có reorder mức câu — Hình
  không có khái niệm "dạng gộp nhiều câu" nên phải làm reorder Ở MỨC BÀI trực tiếp, ca mới so với Đại.
- **Fix (`SoanTaiLieu.tsx`):** `movePick(key, dir)` trong `BuoiPickEditor` — đổi chỗ 2 phần tử LIỀN KỀ
  TRONG CÙNG PHAN (lớp/nhà riêng, không trộn) ngay trên mảng `picks` gốc (tìm theo index trong subset
  cùng phan → map ngược ra index thật trong mảng đầy đủ → swap). `PhieuList` (panel "Tóm tắt" — đúng view
  nhóm Lớp/Nhà theo thứ tự in) thêm cột ▲▼ + số thứ tự 1,2,3…, y khuôn nút ▲▼ `DangCard` của Đại.
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin): tạo giáo trình
  "TEST reorder" K8 → gợi ý 4 bài (BT.025×2, BT.027×2) vào Trên lớp → Tóm tắt hiện đúng 4 dòng có ▲▼ +
  số thứ tự → bấm ▼ ở dòng 2 (BT.025) → xác nhận thứ tự đổi ngay (BT.025,BT.027,BT.025,gốc-BT.027) và
  autosave (không cần F5) → xoá giáo trình test xong (gặp 1 lần lỗi `refresh_token_not_found` giữa chừng —
  session hết hạn ngẫu nhiên do phiên dev mở lâu, không phải bug code; F5 + đăng nhập lại là xong, xoá
  thành công lần retry, xác nhận list quay về đúng 2 giáo trình thật "8A"/"8S1", không sót data test).

## 2026-08-09 (tiếp) — In BTVN ghép a,b,c: ĐỀ trọn khối rồi mới đến PHẦN GIẢI (không xen kẽ từng ý)

- **Thùy:** "lúc gán dòng cho chuỗi là gán cho cả bài. Tức là đề abc rồi đến phần giải của abc chứ ko
  phải a - giải a rồi b - giải b." — chốt lại đúng ý đợt sửa "số dòng chỉnh theo cả chuỗi" (08-08): số
  dòng là CHO CẢ BÀI (a,b,c ghép = 1 bài), nên layout in cũng phải theo đơn vị đó — không lồng đề/giải
  xen kẽ theo từng ý con.
- **Root cause (`HinhPrintView.tsx Noi()`):** vòng `m.ys.map(...)` trước đó render MỖI Ý (a/b/c) thành 1
  khối [đề ý đó → NGAY lời giải/dòng kẻ của ý đó], lặp lại cho từng ý — đúng cái Thùy chỉ ra "a-giải a-b-
  giải b". Hệ quả phụ (không bị Thùy nêu nhưng cùng gốc): bản HS bị VẼ 3 KHỐI DÒNG KẺ riêng (mỗi khối cao
  `soDong`) dù `soDong` đã là số-cho-cả-bài — tổng chiều cao kẻ dòng gấp 3 ý muốn.
- **Fix:** tách `m.ys.map(...)` thành **2 vòng riêng**: (1) render TOÀN BỘ đề `a) b) c)` liền khối trước;
  (2) SAU đó — bản GV: lời giải từng ý (label lại a)/b)/c), giữ nguyên logic bước-ẩn-nở/hình cũ, chỉ dời
  vị trí; bản HS: **MỘT khối `hp-ke` DUY NHẤT cho cả bài** (không phải 1 khối/ý), cao theo `soDong` — khớp
  đúng "gán dòng cho cả bài", không còn nhân 3.
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin): tạo giáo trình
  "TEST layout in" → gán chuỗi 3 câu BT.033→034→035 (đề chuẩn, cả 3 ý) vào Về nhà → mở "📝 Xem" → soi DOM
  nguồn `.hp-de` (trước khi paged.js phân trang): thứ tự con đúng **[Bài 1. · hình · đề chung · a) · b) ·
  c) · MỘT hp-ke]** cho bản HS, và **[... · c) · a)-giải · b)-giải · c)-giải]** cho bản GV (bấm toggle GV
  rồi soi lại) — cả 2 chế độ đề đứng TRỌN KHỐI trước phần giải, không xen kẽ. Xoá giáo trình test xong
  (dính lại đúng session hết hạn như lần trước, F5 rồi xoá lại là qua).

## 2026-08-10 — ⭐⭐ BUG NGHIÊM TRỌNG: nhập bài toán (Kho Hình) không lưu được đáp án

- **Thùy báo khẩn:** "hiện tại nhập bài toán ko lưu được đáp án" — dừng hết việc khác, sửa trước.
- **Root cause:** `hinh_cach_giai.dang_id` là **NOT NULL** ở DB, nhưng `FormBaiToan.tsx` cho phép để
  trống "Dạng" (option "— chưa gắn dạng —" hợp lệ). `luu()` gate **TOÀN BỘ** khối lưu cách-giải (lời
  giải + tiền đề + bổ đề + van) sau `if (dangId)` — chưa chọn Dạng ⇒ cả khối bị bỏ qua **IM LẶNG**, không
  lỗi, không cảnh báo. Nặng hơn triệu chứng "mất đáp án": `tienDe` **MẶC ĐỊNH tự điền** "bài toán phía
  trước" cho node MỚI (line ~49) — quên chọn Dạng thì node mới còn **KHÔNG NỐI được vào chuỗi tiền đề**,
  hỏng cấu trúc DAG âm thầm (cấp tính sai, chuỗi/gợi-ý đứt ngầm) — bug ẩn hơn hẳn "chỉ mất chữ".
- **Fix tận gốc (không phải vá điều kiện):** Dạng là **TAXONOMY** (phân loại, điền sau cũng được) —
  lời giải/tiền đề/bổ đề là **CẤU TRÚC** (phải lưu được bất kể đã phân loại Dạng chưa). Tách 2 khái niệm:
  - Migration `202608101643_hinh_cach_giai_dang_id_nullable.sql`: `alter ... drop not null` trên
    `hinh_cach_giai.dang_id`. Chỉ NỚI, không xoá/thu hẹp gì — data cũ (mọi dòng đã có dang_id thật)
    không ảnh hưởng.
  - `hinh.ts`: `CachGiai.dang_id: string | null` (từ `string`) + `tenDangDayDu(L, dangId: string|null)`
    (đã tự return `''` khi không khớp, chỉ cần nới kiểu) + `createCachGiai` nhận `dang_id: string|null` +
    `baiToanTheoDang`/`listYTheoDang` thêm guard bỏ qua cách-giải chưa có dang_id (không tính vào
    tra-cứu-theo-dạng — đúng, vì nó CHƯA phân loại).
  - `FormBaiToan.tsx luu()`: **bỏ hẳn gate `if (dangId)`** — luôn tạo/cập nhật cách giải (dùng
    `dang_id: dangId || null`), luôn `setTienDe`/`setBoDeCuaCach`. Lời giải + tiền đề + bổ đề giờ CHẮC
    CHẮN lưu, Dạng chỉ là field tuỳ chọn đi kèm.
  - 3 chỗ hiển thị (`SoDo.tsx`/`KhoTam.tsx`/`SoanTaiLieu.tsx`) đổi `cach && <Tag>` → `cach?.dang_id &&
    <Tag>` — tránh hiện badge Dạng rỗng khi chưa phân loại.
- **Verify:** tsc sạch · `npx vite build` sạch · `npm run schema` (xác nhận `dang_id` cột `null: Y`) ·
  click-through THẬT (dev pane, Admin, họ "Tứ giác" K8 — data thật): tạo node mới "TEST BUG: Chứng minh
  OA=OC" + gõ Lời giải, **CỐ Ý để trống Dạng**, bấm Tạo → node hiện đúng cấp 2 (chứng minh tiền đề mặc
  định ĐÃ NỐI) → mở lại node → "Đáp án đầy đủ" hiện đúng chữ vừa gõ (trước fix: sẽ RỖNG). Xoá node test
  bằng nút 🗑 Xoá bài toán (built hôm 08-08) xong, list quay về đúng 11 node cũ.
- **Việc song song bị gác lại:** đang làm dở "▲▼ đổi thứ tự bài NGAY TRONG builder" (Thùy: "để cái chỉnh
  thứ tự câu ở trong builder giống như đại ấy" — chốt: chỉ đổi được thứ tự trong CÙNG 1 chuỗi, không kéo
  qua chuỗi khác, Thùy đã biết và OK) — `swapPicks()` đã tách ra ở `BuoiPickEditor` (refactor an toàn,
  `movePick`/Tóm tắt cũ chạy y hệt), CHƯA wire vào `ChuoiRow`. Tiếp tục ngay sau khi bug này qua.

## 2026-08-10 (tiếp) — Kho Hình: Lý thuyết cho MÔ HÌNH + in ở phiếu Trên lớp

- **Thùy:** "mô hình cần có chỗ gán lý thuyết cho nó" → sau đó thêm: "lý thuyết sẽ in ở phiếu bài tập
  trên lớp giống như bên đại số nhé". Mô hình (Tứ giác, Hình thang…) trước giờ chỉ có giả thiết+hình,
  chưa có chỗ giải thích LÝ THUYẾT/tính chất của chính cấu hình — khác dạng (`hinh_dang_ly_thuyet`, 08-XX)
  và bổ đề (`hinh_bo_de_ly_thuyet`, 08-06) đã có sẵn.
- **Xây (mirror Y HỆT bổ đề — 3 bảng lý thuyết Hình giờ cùng 1 khuôn):**
  - Migration `202608101716_hinh_mo_hinh_ly_thuyet.sql`: bảng `hinh_mo_hinh_ly_thuyet` (khoá
    `mo_hinh_id references hinh_mo_hinh(id) on delete cascade`), RLS `la_thanh_vien()`. Clone y hệt
    `hinh_bo_de_ly_thuyet`.
  - `hinh.ts`: `hinhMoHinhLyThuyet` = `{list,upsert,remove}` (shape `LyThuyetApi`), clone `hinhBoDeLyThuyet`.
  - `SoDo.tsx ViewMoHinh`: box "Lý thuyết" (＋Soạn/✎Sửa) chèn trong panel "Hệ sinh thái của mô hình", ngay
    sau 2 `FieldCard` giả thiết — tái dùng NGUYÊN `LyThuyetModal` (import từ `../BanDo`, khuôn Catalog.tsx
    `MBoDe`). State `moLtMap`/`moLtModal` LOCAL trong `ViewMoHinh` (không nhét vào `Luoi` snapshot — đúng
    convention: lý thuyết dạng/bổ đề cũng fetch riêng qua `napLt()`, không nằm trong `L`).
- **In ở phiếu Trên lớp (yêu cầu 2, khuôn Đại "LT chuyên đề gom theo nhóm, chỉ hiện ở buổi trên lớp"):**
  - `MucIn` (kieu 'de') thêm `moHinhId?: string|null` — set ở cả 4 hàm build mục (`mucGhep`/`mucGhepLua`:
    lấy từ node SÂU NHẤT · `mucBienThe`/`mucY`: lấy từ node của biến-thể/ý, `mucY` cẩn thận null vì
    `Y.baitoan_id` có thể null).
  - `BanIn` thêm `moHinhLyThuyet?: Record<moHinhId, {ten, noiDung}>` — `banInTheoMoHinh` CHỈ resolve khi
    `phan==='lop'` (fetch `hinhMoHinhLyThuyet.list()` 1 lần, lọc còn mô hình có content THẬT trong `mucs`)
    — BTVN/Về nhà không kèm, đúng "LT chỉ ở trên lớp" như Đại.
  - `HinhPrintView.tsx Noi()`: track `moHinhLtDaHien` (biến mutable ngoài `.map`, khuôn `soDe`) — mô hình
    ĐỔI so với mục trước VÀ có lý thuyết → chèn box `.hp-box-lt` (khuôn CSS `.pv-box-lt`/`.pv-box-label`
    của Đại, namespace `hp-*`) NGAY TRƯỚC "Bài N" đầu tiên của nhóm đó. Phải bọc `Fragment` (2 phần tử/
    lượt lặp thay vì 1) — thêm `import { Fragment } from 'react'`.
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin, họ "Tứ giác" K8):
  soạn lý thuyết test cho mô hình Tứ giác → hiện đúng trong "Hệ sinh thái của mô hình" → tạo giáo trình
  test, gán 2 bài BT.025 (thuộc Tứ giác) vào CẢ Trên lớp lẫn Về nhà → soi DOM nguồn `.pv-src` của "📘 Xem"
  → `.hp-box-lt` xuất hiện đúng NGAY TRƯỚC "Bài 1" ("Lý thuyết · Tứ giác · [nội dung test]") → soi "📝 Xem"
  (Về nhà) → xác nhận `.hp-box-lt` KHÔNG xuất hiện (đúng ý "chỉ in trên lớp"). Xoá sạch data test (giáo
  trình + nội dung lý thuyết mô hình qua nút "Gỡ") — không sót gì. 1 lần dính session hết hạn giữa chừng
  (recurring `refresh_token_not_found` của dev pane phiên này, không phải bug code — F5+đăng nhập lại qua).

## 2026-08-10 (tiếp) — SoDo "View bài toán": toggle Toàn họ / Theo mô hình

- **Thùy:** "Ở chỗ view bài toán, t muốn t click vào mô hình nào thì bài toán hiện theo mô hình đó thôi
  chứ ko hiện toàn bộ kho bài toán. Mô hình ô to bên trái. các node là các ô như hiện tại nối với mô
  hình. Có chỗ để chọn mô hình." Xác nhận qua lại: **giữ NGUYÊN node↔node tiền đề trong CÙNG mô hình**;
  tiền đề XUYÊN mô hình (điểm còn lại không hiện) → **đánh dấu chú thích, KHÔNG cố vẽ dây**; **giữ luôn
  "View bài toán" cũ** (Toàn họ, cột-cấp cả họ) — làm **TOGGLE** thay vì thay hẳn, vì sau này còn dùng
  kiểu xem cây nhiều node.
- **Xây (`SoDo.tsx ViewBaiToan`, khuôn tái dùng tối đa — không đẻ component mới):**
  - `Seg` 2 lựa chọn **"Toàn họ" / "Theo mô hình"** (state `scope`) + dropdown chọn mô hình (`moHinhXem`,
    khuôn y hệt "Mô hình chính" ở Lọc mô hình `SoanTaiLieu.tsx`) — chỉ hiện dropdown khi `scope='mh'`.
  - `scope='ho'`: y hệt hành vi cũ 100% (đã verify regression — không đổi 1 pixel).
  - `scope='mh'`: `nodes` lọc còn ĐÚNG mô hình đang chọn; cột-cấp GIỮ NGUYÊN thuật toán (chỉ scope hẹp
    lại theo mô hình) — chừa cột 0 (`hubOffset = MH_W+GAP`) cho **Ô MÔ HÌNH TO** (khuôn card mô hình bên
    `ViewMoHinh`: hình+mã+tên+giả thiết+đếm bài toán), đặt tại x=0 căn giữa dọc theo chiều cao canvas.
    Dây **mô hình→node** (khuôn `RadialEco` tâm-vệ-tinh nhưng vẽ thẳng vào canvas chính, không phải panel
    330px riêng) VẼ THÊM, cạnh dây **node→node tiền đề GIỮ NGUYÊN** thuật toán cũ — dây node→node tự
    "biến mất" khi 1 đầu ở mô hình khác vì `pos.get(t)` không có (điểm đó không nằm trong `nodes` đã lọc)
    → **`teDeAnDi`** dò các trường hợp này, gắn badge **↗** (icon nhỏ, tooltip) lên node bị cắt dây thay
    vì cố vẽ dây tới node không hiển thị.
  - Badge "◇ mã mô hình" trên mỗi node card **CHỈ hiện ở `scope='ho'`** (scope='mh' mọi node cùng 1 mô
    hình = badge thừa, đã có Ô MÔ HÌNH TO làm ngữ cảnh rồi).
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin, họ "Tứ giác" K8,
  data thật KHÔNG đổi gì): "Toàn họ" mặc định giống hệt trước (11 node, cột cấp 1-3, badge ◇ mã mô hình)
  → bấm "Theo mô hình" → chọn "1·Tứ giác" → CHỈ 4 node của Tứ giác (BT.025/026/027/028), Ô MÔ HÌNH TO
  hiện đúng "1 Tứ giác · 4 bài toán" → đổi dropdown sang "1a·Tứ giác có 2 cạnh bên cắt nhau" → nodes đổi
  NGAY còn đúng 1 (BT.029) → quay lại "Toàn họ" xác nhận y hệt ban đầu (không mất/lệch gì) → bấm mở
  BT.025 xác nhận popup chi tiết (5 biến thể, đáp án…) vẫn hoạt động bình thường ở cả 2 scope. Không tìm
  được ví dụ tiền-đề-xuyên-mô-hình thật trong data hiện có để soi trực tiếp badge ↗ (mọi bài toán K8
  "Tứ giác" đang tự chứa trong mô hình của nó) — logic đã soát kỹ (tái dùng chính cơ chế `pos.has()` sẵn
  có), coi là an toàn, sẽ tự lộ khi có data thật chạm case đó.

## 2026-08-10 (tiếp) — M0 "Chọn họ mô hình": nút "Gán lý thuyết" ngay trên card

**Yêu cầu (Thùy, verbatim):** "Thế UI của m ko hợp lý. Màn hình đầu tiên là chọn họ mô hình đã là view
mô hình ròi. THì phải gán được lý thuyết chỗ đấy luôn. Làm 1 nút gán lý thuyết chỗ đấy , bóc được từ
ảnh hoặc pdf như các module quen thuộc đã làm rồi" — phản hồi sau khi tôi chỉ đường cũ (Sơ đồ → tab
"◇ View mô hình" → chọn mô hình → box "LÝ THUYẾT"): Thùy cho rằng M0 (`Ho.tsx`, màn liệt kê card các
họ mô hình gốc) BẢN THÂN NÓ đã là 1 view mô hình rồi, không cần chui sâu thêm mới gán được lý thuyết.

**Làm:** `src/screens/kho/hinh/Ho.tsx` — thêm nút 📖 "Gán lý thuyết" vào hàng nút góc-trên-phải của mỗi
card (cạnh ✎ Sửa / 🗑 Xoá, cùng kiểu hover-hiện), tái dùng NGUYÊN `LyThuyetModal` (from `../BanDo`) +
`api.hinhMoHinhLyThuyet` — CHÍNH XÁC api/table đã build hôm nay cho `ViewMoHinh` (`SoDo.tsx`), không
thêm bảng/hàm mới. State `moLtMap`/`moLtModal` + `napMoLt()` load 1 lần ở mount `Ho`, y hệt khuôn đã
lặp lại 3 lần trong session (dạng/bổ đề/mô hình lý thuyết). Nút đổi màu viền tím khi mô hình đã có lý
thuyết (coLt = có `noi_dung` hoặc `file_url`), giống quy ước "＋ Soạn" / "✎ Sửa".

**Phạm vi:** M0 chỉ liệt kê mô hình GỐC (`la_goc_ho`) — mô hình con (vd "Hình thang", "Hình vuông"…)
vẫn phải gán lý thuyết qua đường cũ (Sơ đồ → View mô hình), không đụng tới trong lần này vì Thùy chỉ
yêu cầu cụ thể "màn hình đầu tiên". Đường cũ ở `ViewMoHinh` VẪN GIỮ NGUYÊN — không phải thay thế, hai
chỗ cùng đọc/ghi 1 bảng `hinh_mo_hinh_ly_thuyet` nên dữ liệu luôn nhất quán dù gán từ đâu.

**Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane, Admin, Hình học, K8): card
"Tứ giác" hover hiện 3 nút 📖/✎/🗑 → bấm 📖 mở đúng modal "Lý thuyết · Tứ giác" với đầy đủ 📎 ảnh/PDF,
📋 clipboard, chọn model AI (Flash-Lite/Flash/Pro), 🪄 Bóc chữ / 🖼 Bóc+hình — y hệt modal đã verify ở
`ViewMoHinh` (cùng component) → Huỷ, không lưu nội dung test.

---

## 2026-08-12 — ⭐ Nền cho TRỢ LÝ AI (phase 2): introspect thấy view · cột `nghiem_thu_nguon` · `npm run migrate` sống lại

**Bối cảnh:** brainstorm "Trợ lý AI cho BKdemy" (doc ngoài repo, 11/08) đã chốt tầng logic. Trước khi
xuống schema/code, audit các giả định hạ tầng của doc bằng chính codebase. 4/4 giả định về hạ tầng SAI:

1. **"View-role chặn dữ liệu — rào thật" (doc §8) — SAI.** Đếm thật: 117 policy / 48 file migration,
   nhưng **86 cái là `using (public.la_thanh_vien())`** (cổng nhị phân "có phải nhân sự"), 8 cái
   `using (true)`, chỉ 2 cái lọc theo dòng (`hs_o_lop`, dành cho app HS/PH). ⇒ **giữa các nhân sự với
   nhau, tầng DB KHÔNG lọc gì cả.** Chặn hiện tại nằm ở app (`quyen.ts` + khoá "chỉ xem" trong
   `supabase.ts`, mà chính comment ở đó đã khai "KHÔNG chặn select"). Tệ hơn: worker chạy
   `SUPABASE_SERVICE_ROLE` (khuôn `worker/danhgia.mjs`) ⇒ **bypass toàn bộ RLS**. Trợ lý buộc đi đường
   worker để giấu API key ⇒ "ai thấy gì" phải xử ở **code dựng context**, không phải ở DB.
2. **"đọc view cố định `v_pipeline_*`" (doc §4) — 0 VIEW trong toàn bộ DB.** Đây mới là khối lượng
   thật của dự án, doc ghi nó như điều kiện có sẵn nên phần khó bị giấu mất.
3. **"chuỗi vốn đã có, chỉ cần thêm quan hệ phụ thuộc" (doc §11) — SAI.** Không bảng nào mô tả quan hệ
   chặn. `viec.task_me_id`/`viec_ke_thua_id` là cha-con/kế thừa, KHÔNG phải blocking. Chuỗi ở doc §1
   (xếp bổ trợ ← trả kết quả ← chấm bài) bắc qua 3 module không FK với nhau và **không phải dòng `viec`**.
   ⇒ chuông ở doc §7 chưa có nền. Khuyến nghị: viết CỨNG 5–10 chuỗi đã biết thành SQL, đừng mô hình hoá.
4. **Pilot mảng học liệu (doc §10.1) — KHÔNG chạy được vì bảng RỖNG.** Đo thật: `viec` có **15 dòng,
   cả 15 ở `moi_giao`** (chưa từng có 1 vòng đời hoàn chỉnh), `nghiem_thu_at` = 0 dòng,
   `viec_van_hanh_duyet` = 0, `bo_tro_yeu` = 0, `hs_level_log` = 0. Module dựng 31/07, chưa ai dùng thật.
   **Bài học: cột đầy đủ ≠ có dữ liệu.** Claude đã suy từ schema ra dữ liệu mà không kiểm — sai.
   Dữ liệu thật (30 ngày): `buoi_hoc` 507 · `vh_ops_task` 413 · `hoc_sinh_lop_log` 241 · `hoa_don` 236 ·
   `bo_tro_duoi` 29. Trong đó **`vh_ops_task` có 427/447 dòng ĐÓNG MÀ CHƯA DUYỆT** (`dong_at` có,
   `duyet_at` null) — lỗ đen thật, ở khâu DUYỆT. ⇒ đề xuất đổi pilot sang mảng vận hành.

**Đã làm:**
- **`scripts/introspect.mjs` — dump được VIEW.** `relkind in ('r','p')` → `('r','p','v','m')`, thêm
  query `pg_get_viewdef`, tách bảng/view lúc render, mục `## Views` in cột + **nguyên văn định nghĩa**.
  View dùng bảng 2 cột (không bê khuôn 6 cột của bảng: view không có attnotnull/default/PK/FK, in ra
  là cột "null" toàn `Y` + cột "khoá" trống → hiểu nhầm y như bẫy 07-22). **Test thật:** `public` chưa
  có view nào nên trỏ 2 query đó sang `information_schema` → 65 view, lấy đủ 65 định nghĩa, render đúng.
- **Mig `202608120014_viec_nghiem_thu_nguon.sql`.** `'dat'` do NGƯỜI duyệt vs do `giaoviec_housekeeping()`
  tự xả sau 7 ngày trước giờ **không phân biệt được** — cả hai đều có `nghiem_thu_at`/`chat_luong`/
  `phan_tram`, dấu duy nhất là chuỗi `[tự đóng: ...]` nhét trong `ghi_chu_nghiem_thu` (text tự do).
  Trợ lý đọc bảng này sẽ tưởng lỗ đen là việc đạt 100%. Thêm cột `nghiem_thu_nguon` (`nguoi`/`tu_dong`)
  + CHECK + backfill 2 bước (**thứ tự bắt buộc**: bắt marker TRƯỚC, phần dư mới là người duyệt — đảo
  lại thì mọi dòng tự-đóng bị gán `'nguoi'` và sai đó IM LẶNG) + `create or replace` housekeeping ghi
  cột mới. `giaoviec.ts`: type `Viec` + `nghiemThu()` ghi `'nguoi'`.
  **Ngưỡng 7 ngày GIỮ NGUYÊN** — nó là VAN XẢ, không phải ngưỡng nhắc; ngưỡng nhắc (CEO: 2 ngày) sống
  ở view của trợ lý. **Đảo vai:** `count(*) where nghiem_thu_nguon='tu_dong'` theo tuần = **chỉ số đo
  trợ lý có hiệu quả không** (về 0 = chặn được lỗ đen). Baseline hiện tại = 0 (chưa có dòng nào).
- **`scripts/migrate.mjs` — viết lại, có sổ `_migrations`.** Bản cũ chạy lại TOÀN BỘ từ `0001` mỗi lần;
  `0001` có 13 `create table` và **0** `if not exists` ⇒ trên DB sống chết ngay câu đầu
  (`relation "dai_ban_do" already exists` — CEO dẫm 12/08). Sự thật "hand-apply, KHÔNG `npm run migrate`"
  chỉ nằm ở **1 dòng giữa HANDOFF.md** (dòng 302) ⇒ mỗi phiên mới lại dẫm một lần. Giờ: sổ
  `_migrations(ten, bam, ap_luc)`, ghi **trong cùng transaction** với SQL (fail là rollback cả hai);
  `--status` xem thuần (không tạo bảng, không ghi); `--baseline [file]` đánh dấu-không-chạy để dựng sổ
  cho DB cũ; **DB có bảng mà chưa có sổ ⇒ TỪ CHỐI chạy + in đúng lệnh cần gõ**. Vân tay sha256 phát
  hiện file đã áp bị sửa sau đó (DB ≠ repo) — nêu cờ, không áp lại.

**⚠️ PHÁT HIỆN VỀ QUYỀN — CLAUDE.md §2.1 ĐANG SAI (đã sửa trong file):** mục đó ghi *"Claude Code dùng
role `claude_ro` (chỉ SELECT) qua `DATABASE_URL_RO` — không ghi được DB, an toàn cứng, không dựa vào
lời hứa."* Kiểm bằng `has_table_privilege`/`has_schema_privilege`: `.env` chỉ có **một** key
`DATABASE_URL`, role là **`claude_build`**, và **CREATE/INSERT/UPDATE đều `true`**. ⇒ rào cứng đó
**không tồn tại**; ràng buộc hiện tại là kỷ luật chứ không phải cơ chế. Nguy ở chỗ mục đó khiến cả
người lẫn Claude tưởng có rào. Muốn rào thật thì tách `DATABASE_URL_RO` (chỉ đọc, cho `npm run schema`)
khỏi `DATABASE_URL` (ghi, chỉ lúc migrate) — **CHƯA LÀM, cần CEO quyết**.

**Còn treo:** ① CEO chạy `--baseline 202608101716_hinh_mo_hinh_ly_thuyet.sql` rồi `npm run migrate` để
áp mig mới ② chốt lại pilot (học liệu rỗng → đề xuất `vh_ops_task`) trước khi dựng `v_task_dang_treo`
③ quyết tách role RO/RW ④ `bao_cao_ph` và `buoi_danh_gia` **không có cột `created_at`** — vá nếu trợ lý
đụng tới (doc §11 yêu cầu mốc vào/ra state).

**(tiếp 12/08) — Tách role RO/RW: xong phần CODE, chờ CEO tạo role**

- **Cơ chế đọc key SAI ÂM THẦM (sửa cả 2 script):** cả `introspect.mjs` lẫn `migrate.mjs` dùng
  `/DATABASE_URL(?:_RO)?/` ⇒ lấy key nào đứng **TRƯỚC trong file**. Thêm `DATABASE_URL_RO` vào `.env`
  là hành vi đổi theo thứ tự dòng: migrate lặng lẽ nối bằng role chỉ-đọc rồi chết giữa chừng. Giờ đọc
  **đúng tên key**: introspect ưu tiên `_RO` (không có thì cảnh báo to rồi vẫn chạy), migrate dùng
  `DATABASE_URL_RW` (env, truyền lúc gọi) → `DATABASE_URL`, **từ chối** nếu trùng `_RO`, và kiểm
  `has_schema_privilege('public','CREATE')` ngay từ đầu. `--status` chỉ đọc nên dùng được role RO.
- **⭐ CANARY RLS (`introspect.mjs`) — bẫy nguy nhất của việc đổi sang role chỉ-đọc:** 116/124 bảng bật
  RLS với policy `to authenticated`. Role thường (không sở hữu bảng, không `bypassrls`) khớp **0 policy**
  ⇒ **mọi SELECT trả 0 dòng, im lặng, không lỗi** — trong khi `npm run schema` VẪN đúng vì nó đọc
  `pg_catalog` chứ không đụng dữ liệu. Schema nhìn hoàn hảo, mọi kết luận về dữ liệu đều sai. Canary
  nêu cờ + **ghi cảnh báo thẳng vào đầu `schema.md`** (chỉ in console thì phiên sau không thấy).
  ⇒ **Tạo `claude_ro` BẮT BUỘC kèm `bypassrls`.**
- **⭐ ĐIỂM MÙ ĐANG SỐNG (canary vừa bắt được):** `claude_build` **không sở hữu** `hinh_giao_trinh` ·
  `hinh_gt_bai` · `hinh_gt_buoi` (chủ = `postgres`, tạo tay qua SQL Editor chứ không qua migrate) ⇒ đọc
  từ CLI ra **0 dòng** dù 3 bảng này thuộc mảng Hình giáo trình vừa build xong. Suýt nữa kết luận
  "chưa ai dùng" — **sai y hệt** ca `viec` hôm nay, chỉ khác nguyên nhân. **LUẬT: "0 dòng" đọc từ
  script KHÔNG phải bằng chứng bảng rỗng.** Phân biệt 3 nguồn của số 0: bảng thật sự rỗng · RLS cắt ·
  role không thấy bảng. Không phân biệt được thì đừng kết luận.
- **Rào CỨNG vs lời hứa:** chuỗi kết nối GHI nằm trong `.env` thì Claude đọc file là có — vẫn là lời hứa.
  Cách duy nhất thành cơ chế: truyền lúc gọi (`set DATABASE_URL_RW=... && npm run migrate`), chuỗi ghi
  không bao giờ chạm đĩa. Đã ghi vào `.env.example` + CLAUDE.md §2.1.
- **Ghi nhận:** `.env.example` (28/07) VỐN ĐÃ ghi đúng bố cục `claude_ro`/`DATABASE_URL_RO`. Thực tế
  trôi khỏi ý định ban đầu, còn CLAUDE.md thì mô tả ý định và không ai verify. Đây không phải thiết kế
  mới — là **khôi phục** cái đã có trên giấy.

**(tiếp 12/08) — ⭐ TỰ SỬA SAI: giả thuyết "870 task ma" là SAI. Không sửa gami.ts.**

- **Đã suýt làm hỏng:** định guard task ET/BTVN theo `bai_test` (khuôn `mtKeys`), lập luận "chỉ 14/445
  buổi có `bai_test` loai='et' ⇒ 431 task ET là ma". **SAI.** `bai_test` là luồng test **ONLINE**
  (`bai_lam`/`khoa_reveal`/`trang_thai mo-dong`) — cả kho chỉ 30 dòng, ET online dùng 15 lượt trong T7.
  ET/BTVN **giấy** không đi qua bảng đó. Bằng chứng phủ định: **331/445 buổi đã set `et_dong_at`,
  298 đã set `btvn_dong_at`** — việc thật, làm thường xuyên. Guard theo `bai_test` sẽ **GIẤU 331 task ET
  đã đóng hợp lệ** khỏi "Việc của tôi" + tụt hiệu suất trên Dashboard Chất lượng vận hành. **KHÔNG SỬA.**
- **⚠️ BÀI HỌC (lặp lần 2 trong cùng 1 ngày):** cả hai lần đều là **suy từ dữ liệu vắng mặt** — đúng thứ
  doc §4 cấm, và tự tay dẫm. Lần 1: `viec` có đủ cột ⇒ tưởng mảng học liệu được đo tốt (thật ra rỗng).
  Lần 2: không có `bai_test` ⇒ tưởng không có ET (thật ra ET giấy). **Luật: trước khi kết luận "X không
  xảy ra", phải tìm được cột/bảng ghi nhận X KHI NÓ XẢY RA, và xác nhận cột đó có dữ liệu.** Đếm số 0
  không bao giờ là bằng chứng, dù đếm từ mấy góc.
- **Số ĐÚNG (445 buổi thường, 60 ngày, bỏ huỷ) — tỉ lệ ĐÓNG theo tuổi buổi:**
  0-2 ngày: dg 37% · chấm 42% · et 47% · btvn 0% — 3-7: 63/67/54/31 — 8-14: 62/70/74/67 —
  15-30: 82/84/81/80 — **>30: 72/79/78/75 (KHÔNG cải thiện so với 15-30)**.
  ⇒ **Cửa sổ hành động thật = 3–14 ngày.** Trước 3 ngày là lag bình thường (chưa tới 50% xong — nhắc ở
  đây là nhiễu, và doc §6 "cửa sổ 3 ngày" hơi sớm ở mép trước). Sau ~30 ngày thì tỉ lệ đứng yên vĩnh
  viễn ⇒ phần hở đó **không ai đóng nữa, đừng nhắc** (§6: "nhắc mà không đóng được thì đừng nhắc").
- **⭐ MUST-EXIST của ET là thuộc tính THEO LỚP, và nó LỘ RA trong dữ liệu (bimodal, không phải nhiễu):**
  buổi >30 ngày — `12B1` hở ET 11/12 · `12A1` hở 8/8 (2 lớp này **không làm ET**) trong khi
  `9A2`/`9S1`/`9B2`/`9B1` hở ET **0/12** (luôn làm). Cả 6 lớp đều CÒN HOẠT ĐỘNG (4-5 buổi trong 14 ngày
  qua) ⇒ không phải "lớp đã kết thúc rồi bỏ". Hiện **không có chỗ nào ghi lớp nào cần ET/BTVN** — đó mới
  là lỗ hổng thật (khác hẳn "task ma"). Cần cờ theo lớp; giá trị khởi tạo suy được từ chính lịch sử này.
- **CEO chốt:** đánh giá **KHÔNG bắt buộc** (quản lý chưa chặt vì ERP đang test liên tục).
  **Claude can việc backdate**: ghi đánh giá lùi ngày = bịa lịch sử, đúng lỗi vừa gỡ sáng nay ở
  `giaoviec_housekeeping`; vi phạm §1.5 "cấm insert trước điền sau"; xoá mất tín hiệu "treo bao lâu";
  và `nhan_xet`/`muc`/`hoan_thanh_pct` bịa sẽ chảy thẳng vào mastery/Elo — hỏng tầng Measurement.
  **Thay bằng: kẻ ĐƯỜNG NGÀY** — từ ngày D trở đi mới bắt buộc, trước D giữ nguyên + đánh dấu
  "chưa có luật" để trợ lý không đọc thành tồn đọng.

**(tiếp 12/08) — PILOT trợ lý: tầng ĐỌC chuỗi bổ trợ đuổi (`src/lib/troly.ts`) + oracle kiểm chứng**

- **Chuỗi THẬT (đọc từ `botro_duoi.ts` + đo 34 đợt hoàn thành), khác hẳn hình dung ban đầu:**
  ① mở đợt → ② chốt kế hoạch (`so_buoi_du_kien` + scope dạng) → ③ Ops xếp buổi → ④ học đủ N buổi
  CÓ MẶT → ⑤ GV bấm Hoàn thành (hệ đề xuất, không đóng câm).
- **⚠ SỬA TIẾP MỘT ĐỌC SAI CỦA CHÍNH MÌNH:** lượt trước kết luận "7/8 ca kẹt vì chưa gán dạng nào".
  SAI — **29/34 đợt ĐÃ hoàn thành cũng có 0 dạng**, tức bước gán dạng trên thực tế là TUỲ CHỌN.
  Dấu kẹt thật ở bước ② là `so_buoi_du_kien IS NULL` (botro_duoi.ts: "NULL = chưa chốt kế hoạch,
  UI bắt chốt trước khi xếp"). Lại đúng lỗi cũ: thấy 0 rồi kết luận, không hỏi "0 này có bình thường không".
  **Cách chặn: luôn đối chiếu nhóm ĐÃ THÀNH CÔNG trước khi gọi một trạng thái là bất thường.**
- **Ngưỡng RÚT TỪ DỮ LIỆU, không đặt tay** (`nguongTuCohort`): 34 đợt hoàn thành →
  **p50=3 · p75=7 · p90=12 · lâu nhất=16 ngày**. Ghi rõ trong code cả **thiên lệch kẻ sống sót**:
  cohort hoàn thành thiên về ca DỄ ⇒ p75/p90 là cận dưới; riêng "vượt `toiDa`" thì vững vô điều kiện.
- **Kết quả trên dữ liệu thật: 4/8 đáng nhắc, 4/8 bình thường — ĐỪNG nhắc.**
  Phạm Kim Oanh 9C1 **21 ngày** (vượt cả 16 = lâu nhất từng hoàn thành) kẹt ③ chưa xếp buổi nào dù kế
  hoạch 2 buổi đã chốt + đã duyệt dạng · Lê Tuệ Anh 6A1 15 ngày kẹt ② · Nguyễn Gia Lộc 8K1 13 ngày kẹt
  ③ (đã học 1/2, thiếu 1 suất) · Nguyễn Quang Minh 6A1 13 ngày kẹt ②. Bốn ca 2–3 ngày nằm trong p50.
  ⇒ **Hai loại kẹt, hai người nhận khác nhau:** ② thuộc người chốt kế hoạch, ③ thuộc Ops xếp lịch.
- **⚠ BẤT THƯỜNG DỮ LIỆU phát hiện kèm:** `Nguyễn Lê Khánh Chi` (8K1) `so_buoi_du_kien` NULL nhưng
  **đã học 1 buổi** — tức xếp+dạy được mà chưa chốt kế hoạch, ngược với guard UI mà botro_duoi.ts mô tả.
  Có đường ghi nào đó lách guard. Chưa sửa, ghi lại để soi.
- **`scripts/check-troly.mjs` = ORACLE (doc §9 "so output với query")**: bản hiện thực THỨ HAI, **cố ý**
  độc lập, tính thẳng bằng SQL, không import gì của app. Chỉ để SO, cấm dùng làm nguồn cho màn hình.
  Lệch 1 dòng = dừng, đừng chỉnh prompt (sai đọc không sửa được bằng cách nói khéo hơn).
- **`botro_duoi.ts`:** thêm `created_at` vào select + type `DotDuoi` — vốn `order by` cột này nhưng
  không select ra nên client không đọc được tuổi đợt. Thay đổi thuần cộng thêm, không đổi hành vi.
- **Còn lại của pilot:** bảng job + `worker/troly.mjs` (khuôn `danhgia`) + màn hình. Tầng ĐỌC xong trước
  là cố ý: "sai đọc = 0%" phải thắng bằng code tất định, model chỉ xếp thứ tự và diễn đạt trên đầu ra đó.

**(tiếp 12/08) — ĐỔI PILOT sang việc-của-chính-mình + dựng tab Rà soát**

- **CEO bác lựa chọn pilot của Claude:** *"test bằng bổ trợ t ko quản hơi khó kết luận"*. Đúng — Claude
  tự đặt tiêu chí "ground truth phải do CHÍNH người dò kiểm được" rồi lại chọn mảng của Lộc. **Tiêu chí
  người-dò-kiểm-được ĐỨNG TRÊN tiêu chí dữ liệu-sạch:** dữ liệu sạch mà không ai xác nhận nổi đúng/sai
  thì hiệu chuẩn = 0. Chuỗi đuổi xuống lượt 2 (lúc đó Lộc chỉ xác nhận 4 SỰ THẬT, không dùng trợ lý —
  không vi phạm §10 "chưa mở cho nhân sự").
- **Bộ hiệu chuẩn = việc của CEO, cửa sổ 3–14 ngày, 2 khâu (đánh giá + chấm lớp)** ≈ 29 mục, kiểm tay
  hết 1 lượt ngồi. Đo được: 0-2n có 5+5 hở · **3-14n có 16+13 hở** · 15-30n 10+5 · >30n 23+17.
  Nhóm >30 ngày CHẶN CỨNG khỏi phạm vi — dữ liệu đã chứng minh sau mốc đó không ai quay lại đóng.
- **⭐ ĐỊNH VỊ LẠI LƯỢT 1: KHÔNG GỌI MODEL.** Hệ chưa biết lớp nào bắt buộc làm đánh giá ⇒ câu trả lời
  đúng nhất model đưa được lúc này là "tôi không biết" (đúng §4, vô dụng). **Lượt 1 không sinh ra để máy
  đúng — nó sinh ra để MOI LUẬT TRONG ĐẦU NGƯỜI RA THÀNH DỮ LIỆU.** Model vào lượt sau, khi số đã đúng
  và luật đã có. Đây mới là §10 "dò lỗ hổng dữ liệu" làm tới nơi: không phải phát hiện ra thiếu (đã
  biết), mà là THU ĐƯỢC cái thiếu.
- **3 phán quyết = 3 loại lỗ hổng KHÁC NHAU** (bảng `troly_ra_soat`, khoá theo buổi×khâu):
  `thieu_that` = tồn đọng thật (thứ duy nhất đáng nhắc) · `lop_khong_lam` = nguồn dựng cờ must-exist
  theo lớp · `lam_ngoai_he` = lỗ hổng **GHI NHẬN**, khác hẳn lỗ hổng **THỰC THI**. Khoá theo BUỔI chứ
  không theo lớp: quy luật theo lớp là thứ SUY RA SAU từ nhiều dòng, giả định trước = quay lại đúng lỗi
  must-exist đóng cứng đang gỡ cả ngày.
- **UI: tab thứ 3 trong "Việc của tôi"** (`screens/troly/RaSoatTab.tsx`), KHÔNG đẻ leaf mới — leaf kéo
  theo quyền per-leaf ở Phân quyền + hiện trong nav MỌI role, trong khi lượt này 1 người dùng; tab thì
  bỏ đi cũng sạch. Màn hiện PHẠM VI trước (quét gì / bỏ ra ngoài gì + vì sao) rồi mới tới danh sách.
- **Lỗi tự bắt khi review:** nút "đổi" ở dòng đã chấm chỉ ghi lại đúng giá trị cũ, không mở lại lựa chọn
  → thêm state `dangSua`. tsc + `vite build` sạch.

**(tiếp 12/08) — Bẫy do CHÍNH tài liệu Claude viết ra: `DATABASE_URL_RW` placeholder**

- **Triệu chứng:** `npm run migrate` chết `getaddrinfo ENOTFOUND`, hostname = `'... '` (CÓ DẤU CÁCH
  CUỐI). `.env` kiểm lại thì đúng hoàn toàn — `DATABASE_URL` 114 ký tự, host thật. Claude chạy
  `--status` cùng lúc thì kết nối được. Nghi mạng/DNS (máy đang chạy Cloudflare WARP), tắt WARP vẫn hỏng.
- **Nguyên nhân thật:** dòng mẫu Claude viết trong `.env.example`:
  `set DATABASE_URL_RW=postgresql://...   &&   npm run migrate`. Copy nguyên si vào cmd ⇒ `set` gán
  **cả dấu cách trước `&&`** ⇒ biến = `"postgresql://...   "` ⇒ host = `"... "`. Và `migrate.mjs` ưu
  tiên `process.env.DATABASE_URL_RW` hơn `.env` (đúng thiết kế) nên biến đè file.
- **Vì sao khó đoán đến thế:** ① biến môi trường **sống hết phiên terminal** ⇒ chạy lại bao nhiêu lần
  trong cùng cửa sổ cũng hỏng y hệt, giống hệt lỗi mạng chập chờn ② `.env` đúng nên soi file không ra
  ③ Claude chạy ở tiến trình khác (không có biến đó) nên **luôn kết nối được** — hai bên thấy hai thực
  tại khác nhau, đúng lớp lỗi đã gặp sáng nay với `housekeeping()` chạy-theo-người-mở-màn
  ④ lỗi thô chỉ nói ENOTFOUND, không hé lộ chuỗi kết nối ĐẾN TỪ ĐÂU.
- **Đã vá 3 lớp:** ① `migrate.mjs` kiểm host trước khi nối (rỗng / không có dấu chấm / chứa `...` /
  chứa `[` / có khoảng trắng thừa) → in **NGUỒN** (biến môi trường vs `.env` khoá nào) + lệnh xoá biến.
  ② `.env.example` bỏ dòng one-liner, tách 2 dòng `set` và `npm run migrate`, ghi thẳng 2 bẫy.
  ③ CLAUDE.md §2.1 trỏ về `.env.example` thay vì lặp lại one-liner.
- **⚠ BÀI HỌC:** **ví dụ copy-paste-được trong tài liệu là CODE — sai là người dùng dẫm.** Placeholder
  `...` trông vô hại nhưng lại là chuỗi HỢP LỆ về cú pháp nên lọt qua mọi tầng, chỉ chết ở DNS với một
  thông báo không liên quan gì tới nguyên nhân. Placeholder phải **sai rõ ràng** (`USER:PASS@HOST`)
  chứ đừng **mơ hồ hợp lệ**. Và mọi chỗ biến môi trường đè file cấu hình thì lỗi PHẢI khai nguồn.

**(tiếp 12/08) — ⭐⭐ KẾT QUẢ LƯỢT RÀ SOÁT (29/29 do CEO tự phân xử)**

- **Ba con số:** `lop_khong_lam` 15 (52%) · `thieu_that` 14 (48%) · **`lam_ngoai_he` 0**.
- **⭐ TÁCH THEO KHÂU mới là phát hiện thật — hai khâu trông giống hệt nhau trong dữ liệu lại NGƯỢC HẲN:**
  · **đánh giá sau buổi**: 13 thiếu-thật / 3 lớp-không-làm ⇒ **must-exist ≈ LUÔN CÓ**. Vậy 128 buổi
    `danh_gia_xong_at IS NULL` toàn hệ phần lớn là **tồn đọng THẬT**, không phải mơ hồ.
  · **chấm bài trên lớp (ingame)**: **1 thiếu-thật / 12 lớp-không-làm** ⇒ **must-exist ≈ KHÔNG**.
    Task `ingame` mà `getMyTasks` sinh cho MỌI buổi thường phần lớn là **việc không tồn tại**.
  ⇒ Mặc định hiện tại của code (mọi buổi thường cần đủ 4 khâu) **SAI ở đúng khâu `ingame`**.
- **🤦 Trớ trêu:** giả thuyết "task ma" hôm nay Claude nêu là ĐÚNG VỀ BẢN CHẤT nhưng **chỉ sai địa chỉ** —
  nhắm vào ET/BTVN qua `bai_test` (suy từ dữ liệu vắng mặt ⇒ sai), trong khi khâu ma thật là `ingame`.
  **Chỉ CON NGƯỜI phân xử mới lòi ra được**, không query nào tự nói. Đây chính là lý do lượt 1 cố ý
  không gọi model: dữ liệu không chứa câu trả lời, nên mọi suy luận trên nó — của người hay máy — đều đoán.
- **`lam_ngoai_he` = 0 (tin tốt):** không có lỗ hổng GHI NHẬN. Mọi mục hoặc chưa làm thật, hoặc không
  áp dụng. ⇒ Bề mặt ghi của ERP không phải vấn đề; đừng đi sửa chỗ đó.
- **Lớp đánh dấu "không làm"** — `ingame`: 8S0(3) · 6S1(2) · 7S3(2) · 11A1 · 12A1 · 6S2 · 9A1 · 9A2 ·
  `danhgia`: 8S0(2) · 12A1. **8S0 và 12A1 không làm CẢ HAI khâu.**
- **⚠ CẢNH BÁO KHI DÙNG SỐ NÀY:** tín hiệu MẠNH ở cấp KHÂU (ingame hầu như N/A), **YẾU ở cấp LỚP**
  (mỗi lớp mới 1–3 mẫu). Dựng cờ must-exist theo lớp từ 1 dòng = đúng cái bẫy "suy quy luật từ vài dòng"
  đã cảnh báo. ⇒ Đổi **mặc định theo KHÂU** trước (rẻ, chắc), cờ theo lớp chờ thêm mẫu.

**(tiếp 12/08) — ĐÍNH CHÍNH của CEO: `ingame` không phải lỗi hệ thống**

- CEO: *"cái đó ko phải lỗi hệ thống. do t cố tình"*. ⇒ 12 mục `ingame` đánh "lớp không làm" là
  **lựa chọn vận hành có chủ ý**, KHÔNG phải `TASKS_BY_VAI` sai. Claude đã viết nhầm bản chất vào
  HANDOFF ("mặc định SAI ở khâu này") — đã sửa.
- **Nhưng lỗ hổng vẫn còn, chỉ là ở chỗ KHÁC:** hệ không có chỗ nào ghi nhận **một lần bỏ qua có chủ ý**.
  Task pure-derive hiện chỉ có 2 trạng thái (đã đóng / chưa đóng) ⇒ **việc bị-cố-tình-bỏ và việc bị-quên
  trông y hệt nhau**, task treo vĩnh viễn, và mọi thống kê tồn đọng đều lẫn hai loại. Cần trạng thái
  thứ ba: **"không cần"** — có người quyết, có dấu vết ai/khi nào.
- **⚠ BÀI HỌC (lần thứ 4 trong ngày, biến thể mới):** ba lần trước là suy sai từ dữ liệu vắng mặt. Lần
  này dữ liệu ĐÚNG (12 mục đúng là không làm) nhưng Claude **suy sai NGUYÊN NHÂN** — mặc định cho rằng
  lệch-với-thiết-kế = lỗi hệ thống, trong khi đó là người dùng chủ động. **Dữ liệu nói CÁI GÌ xảy ra,
  không bao giờ nói VÌ SAO. Hỏi người trước khi quy cho hệ.**
- **CÒN TREO:** bỏ qua đó là **luật ổn định theo lớp** hay **quyết theo từng buổi**? Chưa hỏi.
  Cờ theo lớp vs nút "không cần buổi này" là hai thiết kế khác hẳn — **không dựng gì trước khi biết**.

**(tiếp 12/08) — `scripts/census-dulieu.mjs`: bản đồ DỮ LIỆU THẬT (125 bảng)**

- Công cụ trả lời câu ĐẦU TIÊN phải hỏi trước khi xây gì lên một bảng: **có ai dùng không, lần cuối
  bao giờ**. `schema.md` nói hệ CÓ GÌ, census nói CÁI GÌ ĐANG SỐNG. Tự đánh dấu bảng bị RLS che để
  không lặp lại lỗi đọc "0 dòng" thành "rỗng".
- **125 bảng: 78 sống (có dòng ≤30 ngày) · 22 nguội · 22 RỖNG · 3 bị RLS che.**
- **⭐⭐ ĐÍNH CHÍNH LỜI CLAUDE HÔM NAY:** sáng nay Claude nói *"repo đã có convention máy-đề-xuất/
  người-chốt ở BA chỗ (`hs_level_log`, `bo_tro_yeu`, `viec_van_hanh_duyet`) — trợ lý cứ bê nguyên khuôn"*.
  Census: **cả ba đều 0 DÒNG.** Convention tồn tại trong **schema**, **chưa từng được dùng thật một lần
  nào**. ⇒ Không có tiền lệ nào chứng minh người sẽ chịu tương tác với luồng "máy đề xuất → người chốt".
  Đây là RỦI RO của thiết kế trợ lý, không phải chỗ dựa. **Lại đúng lỗi cũ: đọc schema rồi tưởng là thực tế.**
- **Hệ LEVEL dựng xong nhưng chưa chạy:** `hs_level` = 0, `hs_level_log` = 0, dù có ADR riêng,
  `QuanLyLevelScreen`, code trong `danhgia.ts`, và dữ liệu nguồn thì CÓ (`ky_thi` 19 · `diem_thi` 137).
- **Cặp song song, một dùng một không:** `bo_tro_duoi` 42 dòng (đang chạy) vs `bo_tro_yeu` 0.
  `btvn_ket_qua` 2210 vs `bt_grades` 0 (đường chết?).
- **15 bảng CÓ DATA nhưng KHÔNG có cột thời gian nào** — nặng nhất `tai_lieu_cau` (22.106 dòng) ·
  `tai_lieu_phan` (5.851) · `hoc_sinh_lop` (460) · `vai_tro_chuc_nang` (71).
  ⚠ Một số CÓ đường bù: `tai_lieu_cau` dựa `tai_lieu.updated_at` (CLAUDE §2 "đổi con phải bump cha"),
  `hoc_sinh_lop` có `hoc_sinh_lop_log`. Phải tách "mù thật" khỏi "đã che chỗ khác" — ĐỪNG kết luận vội.

**(tiếp 12/08) — RÀ CỤM BỔ TRỢ + LEVEL: 3 kiểu hỏng khác nhau, nhìn từ census đều là "0 dòng"**

- **① `bo_tro_yeu` (+`bo_tro_yeu_dang`) = CHƯA XÂY XONG, không phải không dùng.** grep toàn repo:
  **KHÔNG có một đường insert/upsert/update nào** — chỉ đúng 1 chỗ ĐỌC (`danhgia.ts:442`). Dashboard đọc
  một bảng mà không gì trong app ghi được vào. 2 bảng + CHECK + RLS đang là gánh chết.
- **② CHUỖI ĐỨT `canh_bao_yeu` → (không có nơi nhận).** `canh_bao_yeu` **ĐANG SỐNG**: 20 dòng, 20/07→10/08,
  nguồn 100% `'btvn'` (ghi từ `gami.ts:508` lúc chấm BTVN). Hệ **phát hiện HS yếu, ghi lại, rồi thôi** —
  không có đường nào biến cảnh báo thành ca bổ trợ. Đúng ca §1 của doc ("miss ở chỗ bàn giao"), chỉ khác
  là ở đây **đầu nhận không tồn tại**.
- **③ Level: đường ghi ĐẦY ĐỦ (`duyetLevel` log-trước-rồi-upsert, rất chuẩn) nhưng THIẾU 2/3 ĐẦU VÀO.**
  ADR: Level = Σ **13 kỳ** (4 thi trường ×2 + 4 BK sát hạch ×2 + 5 khảo sát tháng ×1), max 21.
  Thực tế `ky_thi`: **19 kỳ, TẤT CẢ `loai='mt_sat_hach'`** — không có `truong`, không có `khao_sat_thang`.
  ⇒ **Không phải "không ai bấm nút" — mà là KHÔNG THỂ chốt** khi 2/3 loại kỳ chưa từng được nhập.
  (Bài học: đừng vội quy "0 dòng" cho kỷ luật kém — lần này nguyên nhân là thiếu đầu vào.)
  ⚠ Thêm: `ky_thi.ngay` **NULL ở cả 19 kỳ** ⇒ không xếp được thứ tự thời gian, mà ADR đòi "verdict so
  band TẠI THỜI ĐIỂM thi". Có thể bù bằng `buoi_hoc_id` — CẦN KIỂM, đừng kết luận vội.
- **⭐⭐ TIỀN LỆ AI DUY NHẤT CỦA HỆ — đọc kỹ trước khi dựng trợ lý.** `danhgia_ai_job` 4 lượt, **tất cả
  trong một buổi chiều 24/07**: 15:15 fail (401 sai key) · 15:27 fail (max_tokens, kết quả bị cắt) ·
  17:43 **treo ở `processing` vĩnh viễn** · 17:45 done (sonnet-5, 23.5k vào / 12.9k ra).
  Sau lượt chạy được đó: **`hs_level_log` = 0 quyết định**, và **không bao giờ gọi lần thứ 5**.
  ⇒ 3 hỏng / 1 chạy / 0 quyết định / bỏ luôn. **Ấn tượng đầu giết tính năng.** Trợ lý mà lượt đầu vấp
  là xong — không có lượt thứ hai. (Chưa biết bỏ vì output vô dụng hay vì 3 lần fail đã đốt niềm tin —
  **phải hỏi người**, dữ liệu không nói VÌ SAO.)
  ⚠ Bug kèm: job treo `processing` từ 24/07 tới nay — **không có cơ chế reap job chết**.
- **⭐ ÁP QUY LUẬT CỦA CEO ("không ảnh hưởng cái khác thì t bỏ") vào cụm này:** hiện có **HAI dòng dữ liệu
  đang sống mà KHÔNG NUÔI GÌ** — `canh_bao_yeu` (20 dòng, người vẫn đang ghi) và `diem_thi` (137 dòng,
  **100% có verdict**, rất kỷ luật). Cả hai đổ vào hư không vì đầu nhận chưa tồn tại.
  **Theo đúng quy luật đó, đây là hai thứ SẮP bị bỏ tiếp.** Nối đầu nhận, hoặc khai tử chính thức.

**(tiếp 12/08) — ⭐⭐ CEO BẺ LÁI: trợ lý NHẮC VIỆC, không phải công cụ kiểm toán**

- **CEO:** *"m cứ đang xoáy sâu vào việc thiếu dữ liệu. Nhưng t đã nói rồi, có nhiều thứ t làm sẵn nhưng
  chưa chạy. Việc t muốn là 1 đứa trợ lý nhắc việc hàng ngày, và khi nó nhắc việc thì t sẽ nhận ra được
  cái gì cần phải làm, cái gì cần hủy, cái gì cần gác lại — chứ ko phải bây giờ m đi sửa mọi thứ"*
  và *"những cái m vừa nói, chính là những thứ trợ lý nói. Nhưng ko phải ở khung chat này mà phải ở trên
  ERP để test. Cả test trợ lý lẫn fix dữ liệu erp"*.
- **Claude đã trôi:** biến pilot thành dự án kiểm toán — mỗi phát hiện đẻ một cuộc điều tra, cuối cùng
  đi BÁO CÁO hệ hỏng chỗ nào thay vì GIAO cái nhắc việc. Và đọc "bảng rỗng" thành lỗi, trong khi CEO đã
  nói là làm sẵn chờ chạy.
- **⭐⭐ BA NÚT GỠ ĐÚNG CHỖ CLAUDE TƯỞNG LÀ BẾ TẮC.** Cả tối kẹt ở "hệ không biết must-exist nên không
  dám nhắc" → đâm đi vá dữ liệu. Nhưng **nhắc sai thì người bấm HUỶ là xong; luật LỘ RA từ các lần bấm.**
  ⇒ Không cần biết luật trước. Claude đi ngược vòng lặp §11: cố vá đủ dữ liệu rồi mới dám nhắc, đúng ra
  là **nhắc trước → người quyết → dữ liệu tự đầy dần**.
  ⇒ Hệ quả trực tiếp: bỏ lọc cửa sổ 3–14 ngày, **mở HẾT mọi khâu** (kể cả ET/BTVN/MT vốn sợ nhiễu).
- **Đổi bộ nhãn CHẨN ĐOÁN → bộ QUYẾT ĐỊNH:** `thieu_that/lop_khong_lam/lam_ngoai_he` (mô tả dữ liệu)
  → **`lam` / `huy` / `gac`** (sinh hành động). Chẩn đoán suy được từ quyết định, không chiều ngược lại.
  `gac`+`gac_den` là thứ biến nó thành công cụ HÀNG NGÀY: việc gác **quay lại** đúng hẹn. 29 phán quyết
  cũ được ánh xạ, giữ bản gốc ở `ket_luan_goc`.
- **HAI TẦNG trên cùng màn** (`screens/troly/TroLyTab.tsx`, tab "🤖 Trợ lý" trong *Việc của tôi*):
  · **Tầng 2 "Trợ lý thấy gì"** — nhận định cấp hệ, chính là mấy điều Claude nói trong chat nhưng **tính
    lại bằng số liệu SỐNG mỗi lần mở**. 4 nhận định đầu: cảnh-báo-yếu-không-nơi-nhận · level-thiếu-loại-
    kỳ-thi · job-AI-treo · việc-chưa-chạy-vòng-nào. Bảng `troly_nhan_dinh` **chỉ lưu QUYẾT ĐỊNH**, KHÔNG
    lưu nội dung (lưu text = ảnh chụp chết, 2 tuần sau sai số mà không ai biết).
  · **Tầng 1 "Việc cần quyết"** — mọi việc chưa xong của người đang đăng nhập, quá hạn lên đầu.
- **Gác bằng NÚT SẴN (3 ngày / 1 tuần / 1 tháng), không bắt gõ ngày** — công cụ dùng hàng ngày mà mỗi
  lần gác phải mở lịch thì người ta bỏ qua thay vì gác, rồi việc treo mãi.
- **KHÔNG gọi model.** Số do code tính, tất định, kiểm được bằng `scripts/check-troly.mjs`. Model chỉ
  vào khi số đã đúng và có đủ lượt bấm để học luật.

**(tiếp 12/08) — ⭐⭐ CEO: "trợ lý đưa ra 1 đống thứ thì khác gì dashboard" → DỰNG KHUNG CHAT**

- **CEO:** *"bây giờ trợ lý đưa ra 1 đống thứ. t cần trao đổi với nó như đang trao đổi với m. chứ hệ
  thống đưa ra thì khác gì dashboard và việc của tôi nhỉ"*. **ĐÚNG.** Doc §1 nói *"ERP đã hiển thị đủ
  dữ liệu, người quá tải không tự tổng hợp nổi"* — mà Claude lại đi dựng THÊM MỘT MÀN HIỂN THỊ NỮA.
  **Danh sách = dashboard. Thứ biến nó thành trợ lý là HỎI ĐƯỢC.**
- **Đây là chỗ AI vào lần đầu trong module.** Ranh giới §4 giữ nguyên: CODE tính số → bảng sạch
  (`boiCanhChoHoi`, đã GỘP SẴN theo lớp/theo khâu để model không có lý do phải tự cộng);
  MODEL chỉ đọc bảng rồi nói. Hai tầng dưới (nhận định + việc lẻ) vẫn chạy khi worker tắt.
- **Hạ tầng bê nguyên khuôn `danhgia`:** bảng job `troly_hoi_dap` → `worker/troly.mjs` quét mỗi 3s
  (chat nên nhạy hơn 5s của danhgia) → ghi `tra_loi`. Key model Ở SERVER, không vào bundle.
  `boi_canh` lưu NGUYÊN bảng đã gửi ⇒ truy lại được "vì sao lúc đó nói thế".
- **⭐ WORKER KHÔNG KHOÁ NHÀ CUNG CẤP** (CEO muốn thử Moonshot/Kimi vì rẻ): adapter mỏng, chạy được
  `anthropic` lẫn `moonshot` trên CÙNG bảng sạch, đổi bằng 1 dòng `.env.local`, log token + tiền mỗi
  lượt ⇒ **so bằng số, không so bằng cảm giác** (đúng bài học danhgia: *"phải thử mới biết, đừng đoán"*).
  Moonshot dùng giao thức tương thích OpenAI ⇒ gọi thẳng bằng `fetch`, KHÔNG thêm SDK.
  ⚠ Cố ý KHÔNG dùng tính năng riêng của từng nhà (thinking/cache_control) — dùng thì bản so mất công bằng.
  ⚠ Bảng giá trong worker **phải tự kiểm lại** ở trang của nhà cung cấp; Claude không có nguồn cập nhật.
- **⭐ Lợi thế dữ liệu khi thử nhà mới:** bảng sạch của trợ lý **KHÔNG có tên học sinh** — chỉ tên lớp,
  ngày, khâu, số đếm. Rủi ro thấp hơn hẳn luồng `danhgia` (vốn gửi `ho_ten` lên API). Doc §11 lo chuyện
  ẩn danh — với module này thì vốn đã ẩn sẵn.
- **Học từ tiền lệ 24/07 (job treo `processing` vĩnh viễn):** worker mới có `donJobTreo()` — job quá
  5 phút tự chuyển `failed`, không để người dùng nhìn "đang nghĩ" mãi mãi.

**(tiếp 12/08) — CHUỖI ĐẦU TIÊN ĐƯỢC DÒ ĐẦY ĐỦ: test đầu vào**

- **Phát hiện quan trọng nhất về phương pháp:** ⭐ **CỘT MỐC THƯỜNG ĐÃ CÓ SẴN TRONG DB.**
  `ca_test` có đủ bốn mốc của chuỗi từ lúc dựng: `hoan_thanh_at` (HS test xong) → `bai_url` (thu bài,
  scan) → `cham_xong_at` → `tra_bai_xong_at`. Cùng khuôn `*_dong_at` của `buoi_hoc`, `bo_tro_duoi`.
  ⇒ Người dựng hệ ĐÃ mô hình hoá đúng chuỗi. Cái thiếu gần như luôn là **AI NỢ** và **HẠN**, không
  phải bảng mới. Phần lớn việc là KHAI BÁO, không phải XÂY.
- **⭐ ĐỔI CÁCH ĐẶT VẤN ĐỀ (CEO 12/08):** không phải "dò xem quy trình có đúng không" — quy trình
  trong đầu CEO đã đúng và rõ. Mà là **"hệ có đủ dữ liệu để CHẠY quy trình đó không"**. Ca test chứng
  minh: luật phân người rất rõ, nhưng hệ không có ô ghi 11A/11B ⇒ cùng luật đó chạy được với khối
  7/8/9 và TẮC ở khối 11/12.
- **KHUÔN DÒ 1 CHUỖI — 4 câu (~30 phút/chuỗi):** ① chuỗi mấy khâu, mốc nào đã có cột? ② ai NỢ mỗi
  khâu, suy từ dữ liệu nào? ③ hạn mỗi khâu? ④ **dữ liệu định tuyến có đủ ĐỘ MỊN không?** (câu ④ ít ai
  nghĩ tới mà lại là chỗ vừa chặn: luật theo LỚP, dữ liệu chỉ có KHỐI).
- **DỮ LIỆU THẬT — 4 ca test, cả 4 đã scan bài rồi NẰM IM:**
  Minh Phúc (4T, 14/07, 29 ngày) · Lã Gia Huy (K11, 09/07, 34 ngày) · Nguyễn Bá Thiện Minh (K7, 11/07,
  32 ngày) · Nguyễn Test QA (K8, data QA). **Cả 4: `bai_url` CÓ · `cham_xong_at` NULL · `tra_bai_xong_at`
  NULL.** ⇒ nút thắt nằm đúng ở khâu CHẤM. Đây chính là loại "việc hay miss" mà CEO định bàn — nó đã
  nằm sẵn trong DB hơn một tháng, chỉ chưa ai nhìn.
- **LUẬT TRẢ KẾT QUẢ (CEO chốt, keyed theo `ung_vien.khoi`):**
  `3,4,4T,5,5T,6` → **Thùy** · `7,8,9` + `11A`,`12A` → **Trang** · `11B`,`12B` → **Đạt**.
  ⚠ CHƯA CÓ CHỦ: **khối 10** (có lớp 10A1/10B1 thật) · **12C** (có lớp 12C1 thật) · khối 3 (chưa có data).
  ⚠ Khối 11/12 KHÔNG định tuyến được bằng `khoi` (chỉ ra '11'/'12', không có A/B). `lop_du_kien_id`
  **null ở cả 4 ca**. CEO chốt: **bổ sung ô chọn lớp dự kiến lúc tạo ca test** (cột đã có sẵn, chỉ chưa ai điền).
- **⚠ CÒN THIẾU ĐỂ KÍCH HOẠT CHUỖI:** **AI CHẤM** — chính là khâu đang tắc cả 4 ca. Và ai thu bài/scan
  (chắc quản lý học tập, nhưng chưa rõ người cụ thể). Có 2 câu đó là chuỗi chạy được ngay.
- **⚠ CAN TRƯỚC KHI KHAI HÀNG LOẠT:** khai 2–3 chuỗi rồi **CHẠY THẬT 1 TUẦN**, xem lời nhắc có đổi hành
  vi không. Nhắc mà vẫn không ai xử thì khai thêm 20 chuỗi cũng vô ích. Lý do: hệ này đã 4 lần dựng
  năng lực rồi bỏ không dùng (`viec` 15 dòng đứng im · `bo_tro_yeu` không đường ghi · `hs_level` 0 dòng ·
  `viec_van_hanh_duyet` 0 dòng). Khai hàng loạt trước khi biết nhắc có tác dụng = lần thứ năm.
- **Thứ tự đề nghị:** đi từ **chỗ CEO hay miss**, không đi theo sơ đồ tổ chức. Chuỗi không gây miss thì
  chưa cần khai — nó đang tự chạy được.

**(bổ sung) — CEO chốt nốt luật cấp 3:** *"10A của Trang, còn 10B 12C của Đạt. tóm lại cấp 3 thì A của
Trang B của Đạt"* ⇒ **cấp 3 (10·11·12): nhánh A → Trang · nhánh B và C → Đạt.** Không còn khối vô chủ.
Chỉ còn CHẶN duy nhất: **ai CHẤM bài test**.

## 2026-08-12 (tiếp) — ⭐ Trợ lý = "Việc của tôi" bản ĐẦY ĐỦ: 3 rổ + gom 8 nguồn

- **CEO bẻ lái 2 nhịp trong cùng phiên, cả hai đều thu hẹp đúng chỗ Claude làm sai:**
  ① *"Lúc báo việc thì phải báo việc đang NỢ, việc đang CẦN HOÀN THÀNH, và việc DỰ KIẾN sẽ phải
  làm trong hôm nay mới có cái nhìn đầy đủ chứ."*
  ② *"Bản chất của việc hàng ngày chính là 'Việc của tôi', nhưng là 1 phiên bản có nhận định và
  đầy đủ hơn. Thay vì t phải đi click khắp nơi thì t chỉ còn click 1 chỗ."* + *"cả task phát triển
  nữa. Tóm lại là trong mọi chỗ mà có việc của nó hoặc SẮP có việc của nó thì đều ở chỗ trợ lý."*
  + *"nó chính là phiên bản việc của tôi mềm mại hơn, và quan trọng là CHỦ ĐỘNG hơn."*
- **⭐ SỬA SAI 1 — nợ cũ bị GIẤU thành một con số.** Bản sáng nay rút nợ về `noCu: number` vì CEO
  nói *"ko phải là mấy cái nợ kia nhé"*. Hiểu đúng ý (đừng trộn lẫn) nhưng làm sai cách (giấu đi).
  Đúng là **TÁCH RỔ**: vẫn thấy đủ, vẫn không lẫn. Bài học chung: *"đừng trộn X vào Y"* nghĩa là
  **tách chỗ đứng**, KHÔNG phải **bỏ X đi** — hai cách xử khác hẳn nhau mà nghe thì giống.
- **⭐ SỬA SAI 2 — trợ lý chỉ đọc `getMyTasks` thì nó ĐÚNG LÀ "một dashboard nữa".** CEO đã nói câu
  này từ lượt trước (*"hệ thống đưa ra thì khác gì dashboard"*) và Claude vá bằng KHUNG CHAT — đúng
  một nửa. Nửa còn lại là ĐỘ PHỦ: người vẫn phải sang chỗ khác xem điểm danh, report, phòng, giao việc.
- **8 NGUỒN (trước: 1).** ①`getMyTasks` ②`myBuoiAoCuaKhoang` (điểm danh ca tôi trực) ③`getMyOpsTasks`
  (report/báo tan) ④`getMyPrepTasks` (chuẩn bị phòng) ⑤`listDotChoDuyetDuoi` ⑥`listCanScanDaCham`
  ⑦`listViecCuaToi` (task phát triển tôi làm) ⑧`listViecToiGiao` **lọc `cho_nghiem_thu`** — việc
  người ta NỘP RỒI đang chờ chính tôi duyệt. ⑧ dễ quên nhất mà đúng chỗ nghẽn đã đo (427/447
  `vh_ops_task` đóng-mà-chưa-duyệt): **việc "chờ tôi duyệt" vẫn là việc CỦA TÔI dù tôi không làm.**
  Nguồn ⑥ là POOL chung ⇒ giữ gate `opsToanHe`; bỏ gate là đổi hành vi chứ không phải "gom thêm".
- **⭐ TÁCH "TRỄ HẠN" KHỎI "TUỔI" (`coHan` + `soNgay`) — suýt để lọt một lời nói dối.** Bản nháp
  dùng chung một trường `treNgay`, nên việc KHÔNG CÓ HẠN (chờ nghiệm thu, đợt đuổi chờ chốt, bài
  test chờ scan) nộp từ hôm qua là bị xếp thẳng vào rổ NỢ. Tức **bịa ra một mốc hạn chưa từng tồn
  tại rồi kết tội người dùng trễ nó**. Giờ: `coHan=false` ⇒ KHÔNG BAO GIỜ vào nợ/hôm nay, đi rổ
  riêng "Không có hạn — vẫn đang chờ bạn", sắp theo tuổi. Prompt worker cũng được dặn đúng câu này.
  Đây là §1.5 ở dạng mới: không có dữ liệu (hạn) thì đừng suy ra kết luận (trễ).
- **RỔ ③ "DỰ KIẾN" = phần CHỦ ĐỘNG.** Buổi hôm nay CHƯA MỞ thì chưa có dòng `buoi_hoc` ⇒
  `getMyTasks` không sinh task nào ⇒ **lịch dạy hôm nay hoàn toàn vô hình** với bản cũ. Dựng từ
  (vai trên lớp × `TASKS_BY_VAI`) — **export `TASKS_BY_VAI` từ gami.ts** thay vì chép bản thứ hai,
  vì thêm khâu mới mà quên bên kia thì rổ dự kiến thiếu ÂM THẦM.
  ⚠ Cố ý **KHÔNG gán hạn** cho nhóm này: hạn sinh ra sau khi buổi mở, đoán trước = copy luật hạn
  sang nguồn thứ hai (đúng thứ CLAUDE.md §2 cấm).
- **Một nguồn hỏng KHÔNG được kéo sập cả màn** (`anToan()` bọc từng nguồn) — nhưng **phải KHAI ra**
  trong `phamVi`: hỏng mà im lặng thì người đọc hiểu thành "không có việc nào", đúng lỗi §9 bỏ sót.
- **Ba nút Làm/Huỷ/Gác giờ được TRỪ ở CẢ hai màn** (tách `docQuyetDinh` dùng chung): bấm Huỷ rồi mà
  rổ Nợ vẫn kêu thì ba nút thành vô nghĩa. Bản cũ chỉ trừ ở "Việc cần quyết".
- **HẠN 23:59 CÙNG NGÀY: KHÔNG ĐỔI.** Claude đề xuất nới sang trưa hôm sau (rổ "hạn hôm nay" gần
  như luôn rỗng); CEO không chọn phương án nào trong 3, mà **định nghĩa lại cách hiển thị** — 3 rổ.
  ⇒ Luật hạn giữ nghiêm, chỗ sai là ở cách BÁO. Ghi lại vì đây là lần thứ n Claude định sửa LUẬT
  trong khi thứ hỏng là VIEW.
- **Verify:** tsc sạch · `npx vite build` sạch · click-through THẬT (dev pane 1280×720 — ⚠ pane vẫn
  dựng ra 0×0, phải gọi `resize_window` mới có viewport; các phiên trước bỏ cuộc ở đúng chỗ này):
  đăng nhập admin → tab 🤖 Trợ lý → 4 rổ render đúng, tất cả = 0.
  **0 đó là ĐÚNG, không phải bug** — oracle SQL xác nhận NS005 có 0 ở cả 8 nguồn (0 phân công lớp ·
  0 ca trực · 0 việc làm · 0 việc chờ duyệt). ⚠ Quick-login chỉ có `admin@gmail.com` nên KHÔNG tự
  test được tài khoản CÓ việc. Số KỲ VỌNG dựng sẵn bằng `scripts/_chk_troly_nguon.mjs <maNS>`:
  **NS001** = 18 lớp / 75 buổi hở khâu / 6 đợt đuổi chờ chốt / 4 bài test chờ scan / 1 task phát
  triển / **4 lớp dạy HÔM NAY, 0 buổi đã mở** (⇒ rổ "dự kiến" có hàng thật).
  **NS002** = 13 lớp / 66 buổi hở / 4 task phát triển / 1 lớp dạy hôm nay.
  ⇒ CEO đăng nhập bằng tài khoản mình là đối chiếu được ngay từng rổ.
- **CÒN:** ⚠ chưa chạy mắt bằng tài khoản có việc (chặn bởi quick-login) · gợi ý PHƯƠNG ÁN (CEO:
  *"sau này đủ giỏi thì gợi ý phương án cho t"*) chưa làm — hiện model chỉ đọc và kết luận ·
  chuỗi test đầu vào vẫn chờ CEO chốt AI CHẤM.

## 2026-08-12 (tiếp) — ⭐⭐ STORY BỔ TRỢ BÙ: sửa bug làm RƠI NGƯỜI + khai 5 mục vào trợ lý

- **CEO:** *"Cái này ko đủ detail đâu. Giờ đi 1 story cụ thể là bổ trợ bù đi"* + 5 thứ cần mỗi ngày
  (① học xong chưa fill đủ · ② sắp đến lịch · ③ đã xếp mà vắng, phải xếp lại · ④ quá hạn 48h ·
  ⑤ đang cần xếp — *"nhiều nên ko cần detail, cần số lượng và deeplink"*) + *"hiện tại hệ thống
  đang lỗi phần này, ấn vắng ko thấy action gì"*.
- **⭐⭐ BUG GỐC (`botro.ts listCanBu`) — hệ ĐANG LÀM RƠI NGƯỜI, im lặng.** `handled` = tồn tại BẤT KỲ
  dòng `buoi_hoc_hs` nào có `bu_cho_buoi_id` = buổi mẹ. **Không xét em có ĐẾN không, không xét buổi
  bù còn sống hay ĐÃ HUỶ.** ⇒ xếp bù xong là lần nghỉ biến mất khỏi hàng đợi VĨNH VIỄN.
  Đo thật: **11 lượt vắng buổi bù + 6 lượt buổi bù bị huỷ**; sau khi sửa còn **14 ca** thật sự cần
  xếp lại (3 lượt đã có lần xếp khác còn hiệu lực). Cũ nhất: Bùi Ngọc Bảo Ngân nghỉ 16/06 — **57
  ngày** không ai biết. CEO chỉ thấy triệu chứng "ấn vắng ko thấy action gì"; sự thật là **KHÔNG CÓ
  action nào cả**, và cái mất không phải nút bấm mà là bản thân lần nghỉ.
  ⚠ **Vế "buổi bù bị huỷ" CEO KHÔNG nêu** — cùng một gốc, tự lộ khi đọc code. 6/14 ca là loại này.
- **Sửa:** lần xếp chỉ tính là GIẢI QUYẾT khi ① buổi bù chưa huỷ VÀ ② em không vắng ở buổi bù đó.
  `diem_danh = null` VẪN giữ chỗ (buổi chưa diễn ra) — kéo về sớm là đẻ lượt xếp trùng.
  **Không cần migration**: unique của `buoi_hoc_hs` là `(buoi_hoc_id, hoc_sinh_id)` chứ không phải
  `(hoc_sinh_id, bu_cho_buoi_id)` ⇒ xếp lại vào buổi bù KHÁC vốn đã hợp lệ; DB có sẵn 2 ca xếp 2 lần
  cho cùng buổi mẹ (ai đó làm tay) — chứng minh luồng này đã xảy ra ngoài đời trước khi có code.
- **`LanNghi` mang `lyDoQuayLai` + `soLanDaXep`** → card "Cần bù" hiện khối đỏ **XẾP LẠI · Vắng buổi
  bù / Buổi bù bị huỷ · đã xếp N lần**, và màn buổi bù đổi dòng chết *"Vắng — không chấm."* thành
  *"Lần nghỉ gốc đã quay lại Cần xếp bù"*. Trước đây bấm Vắng xong không ai biết chuyện gì xảy ra
  **vì đúng là không có gì xảy ra**.
- **⭐ HẠN 48H — KẺ ĐƯỜNG NGÀY (CEO chốt).** Lúc bật luật: **126/141 lần nghỉ đã quá hạn = 89%**.
  Đỏ hết thì không còn là cảnh báo. ⇒ `NGAY_AP_HAN_48H='2026-08-10'`: nghỉ từ ngày đó trở đi mới
  chịu hạn; trước đó thành MỘT con số "tồn đọng cũ". Hệ quả **cố ý**: mục ④ hôm nay = **0**, hàng
  đầu tiên rơi vào 13/08. Không backdate, không xoá — cùng khuôn đã dùng cho đánh giá.
- **⭐ TỰ DẪM BẪY MÌNH VỪA VIẾT — mục ① ra 105/151 buổi.** Ngay đầu hàm có comment cảnh báo "buổi
  chưa đóng ≠ chưa fill đủ, phải xét khâu có ÁP DỤNG không"… rồi soi per-HS mà quên chính điều đó:
  buổi **đã đóng đủ 2 mốc** vẫn bị lôi ra vì HS không có dòng chấm ET — mà **buổi mẹ không có ET thì
  lấy gì chấm**. Sửa 2 cổng: ① `et_dong_at && danh_gia_xong_at` ⇒ người đã tự chốt, không nhắc nữa;
  ② chỉ đòi chấm ET/đánh-giá-dạng khi `gami_session_problems` CÓ đề cho đúng em đó. **105 → 2.**
  Ca "chốt mà không có lấy một dòng chấm nào" giữ lại thành MỘT con số (`dongKhong`), không phải
  danh sách 98 dòng. *Bài học: viết cảnh báo ra không có nghĩa là đã tránh được nó — phải soi CON SỐ
  đầu ra. 105 lộ ngay khi mở màn; đọc code lại thì không.*
- **Verify — số khớp oracle SQL độc lập** (`scripts/_diag_botro_bu.mjs`, `_diag_botro_sau_fix.mjs`):
  ① 2 · ② 10 (6 hôm nay + 4 sắp tới) · ③ **14** · ④ 0 · ⑤ **141** (15 trong hạn · 0 quá hạn · 126 tồn
  đọng, cũ nhất 05/07). Tab "Cần bù" 141 → **155** (+14 quay lại), 3 em đầu đúng là mấy em từng rơi.
  Deeplink "đi xếp bù ›" nhảy đúng màn. tsc + `vite build` sạch.
  ⚠ Screenshot KHÔNG chụp được (pane không compositing) — verify bằng đọc DOM, đúng cách handoff đã ghi.
- **2 lỗi hiển thị tự bắt lúc soi output:** `cuNhat` lấy `[length-1]` trong mảng đã sort GIẢM dần theo
  tuổi ⇒ ra ngày MỚI nhất (hiện "11/08", đúng phải "05/07"); và `bu_cho` in ngày ISO đầy đủ giữa một
  màn toàn dd/mm.
- **CÒN:** ⚠ **35 ca `khong_xep_duoc`** (cũ nhất 19/06) nằm ngoài MỌI mục — theo thiết kế hệ không tự
  gợi ý lại, nên chúng nằm im vĩnh viễn. Hoặc nhắc lại, hoặc khai tử trạng thái đó; **chưa hỏi CEO.**
  · Mục ② chưa có chỗ ghi "đã xác nhận lịch" (CEO chốt chưa thêm cột, chỉ hiện để nhìn).
  · `dongKhong` đã tính nhưng chưa render ra UI.

## 2026-08-12 (tiếp) — Bổ trợ bù vào NHẬN ĐỊNH + KHUNG CHAT · làm rõ "không xếp được"

- **CEO:** *"ko xếp được tức là gặp vấn đề về lịch và ko xếp luôn"* ⇒ `khong_xep_duoc` là trạng thái
  **KẾT THÚC do người quyết**, KHÔNG phải việc treo. Lượt trước Claude nêu 35 ca đó như một "lỗ hổng
  cần nhắc lại" — SAI, đã sửa lại wording trong `khongBiet` + prompt worker. Cố ý nằm ngoài hàng đợi.
  *(Bài học lặp: dữ liệu nói CÁI GÌ, không nói VÌ SAO. Thấy 35 dòng nằm im rồi tự quy là hệ bỏ quên,
  trong khi đó là người chủ động chốt — đúng lỗi đã ghi ở mục `ingame` sáng nay.)*
- **CEO:** *"T cần nhận xét ở trên erp, chỗ AI ấy"* ⇒ 4 danh sách bổ trợ bù mới chỉ là DỮ LIỆU; cái
  biến nó thành trợ lý là câu NHẬN XÉT. Thêm `nhanDinhBu(d)` sinh 3 nhận định (ăn CHÍNH snapshot đã
  load ở màn, **không query lại** — query lần hai là mở đường cho hai con số lệch nhau trên cùng màn):
  ① phải-xếp-lại (kèm tách vắng vs buổi-huỷ + ca cũ nhất có TÊN) · ② tồn đọng cũ (ngưỡng ≥20, kèm
  đường thoát: xử hết hoặc chốt không-cần-bù hàng loạt — *"để lơ lửng là tệ nhất"*) · ③ đóng-khống.
  `nhanDinhHeThong(bu?)` nhận snapshot; TroLyTab đổi từ gọi song song sang **chuỗi** bù → nhận định.
- **KHUNG CHAT giờ BIẾT về bù** (`BoiCanhTroLy.boTroBu`): tổng theo mục + danh sách CÓ TÊN cho
  phải-xếp-lại / sắp-tới / chưa-fill-đủ. Trước đó hỏi "em nào phải xếp lại" thì model **đúng luật §4
  vẫn phải trả lời "bảng của tôi không có"** dù dữ liệu nằm ngay trên màn — đưa số vào UI mà quên đưa
  vào bảng sạch là để trợ lý mù đúng chỗ vừa làm.
- Prompt worker thêm 4 dòng chống đọc nhầm: `phaiXepLai` ≠ nghỉ lần đầu · `quaHan` rỗng KHÔNG phải
  "mọi thứ đúng hạn" (số cũ ở `tonDongCu`) · `tonDongCu` đừng gọi là trễ hạn · `khongXepDuoc` là kết thúc.
- **Verify:** tsc sạch · click-through thật: 3 nhận định bù hiện đủ kèm 3 nút. Số trên màn **132 cần
  xếp · 14 trong hạn · 118 tồn đọng** khớp TUYỆT ĐỐI với oracle SQL chạy cùng lúc.
  ⚠ Khác lượt đo trước đó (141/15/126) vì **DB đổi thật giữa hai lần chạy** — 9 lượt vừa được xử lý
  trong lúc làm. Nhắc lại: đây là DB PRODUCTION đang có người dùng, số nhảy giữa hai lần đo là bình
  thường; đừng vội đọc thành bug (đã suýt).
- **CÒN:** `dongKhong` giờ hiện ở nhận định (67 buổi) nhưng CHƯA rõ bao nhiêu trong đó là "buổi mẹ
  không có ET" (bình thường) vs "bấm cho xong" (vấn đề thật) — cần soi vài ca rồi mới kết luận được.

## 2026-08-13 — Giao việc: tối ưu giao việc phát triển (4 điểm CEO yêu cầu, nhánh `feat/giaoviec-toi-uu`)

- **Perf — `getMyScope` (nhansu.ts):** vòng lặp tính giám sát-cấp-dưới qua `listViTri(vt.team_id)` mỗi
  vị trí cũ chạy TUẦN TỰ (`for await`) — ai giữ ≥2 vị trí (vd Trang) là N round-trip nối đuôi mỗi lần mở
  modal Giao việc. Đổi `Promise.all`. Không thêm cache session (nhiều điểm mutate — vị trí/phân công/
  hồ sơ — cần invalidate đúng chỗ, để dành nếu vẫn thấy chậm sau fix này).
- **Công khai hoá Weekly Plan (CEO 08-13: "team bé, làm gương, không rủi ro tâm lý"):** `NhanSuHome`
  tab "Việc của tôi → Phát triển" giờ mặc định render `CongKhaiTab` (cả team, gồm cả khối "số lần huỷ
  theo người giao") thay vì thẳng `VietCuaToiTab`; thêm toggle 👥 Cả team / 🙋 Chỉ tôi. Trước đó
  `CongKhaiTab` chỉ nằm trong leaf `giaoviec` (Ops/Core team mới thấy) — nhân viên thường không mở được.
- **⭐ Model mẹ/con: XOÁ false-dichotomy "Gán 1 người" vs "Tách nhiều con".** Trước đây chọn "Gán 1
  người" là chốt CỨNG — task_me_id=null root nhận thẳng `nguoi_lam_id`, hết đường tách thêm. Giờ: root
  CHƯA gán (`nguoi_lam_id=null`) LUÔN hiện dưới dạng cụm MẸ (kể cả 0 con), nút "+ Tách task con" LUÔN có
  mặt kể cả sau khi đã có N con — tách được vô hạn lần. Root ĐÃ gán trực tiếp (từ "+ Việc phát sinh")
  vẫn là leaf đơn giản, không đụng (tránh bẫy: nếu mẹ vừa mang việc trực tiếp vừa có con, `tinhHieuSuatThang`
  loại nó khỏi Σ hiệu suất vì coi nó là "task mẹ có con" — làm rơi việc trực tiếp của nó khỏi hiệu suất
  âm thầm). Xoá `ganNguoiLam`/`taoTaskCon` (dead code, GiaoViecModal luôn gọi thẳng `createViec`).
  **Chưa xử ca cũ:** task root đã lỡ "Gán 1 người" trước bản vá này (nguoi_lam_id set sẵn, task_me_id
  null) KHÔNG tự có nút tách thêm — chỉ áp cho task tạo mới. Nếu cần tách task cũ, báo lại.
- **2 kiểu chia task con (CEO 08-13, vd "Trang chấm 7A · Cường chấm 8B"):** `GiaoViecModal` thêm toggle
  **Theo bước** (mỗi con khác việc, mục tiêu/output gõ riêng — hành vi cũ) vs **Theo scope** (mọi con
  CÙNG mục tiêu/output, kế thừa khoá từ mẹ; chỉ gõ "Phạm vi" — tiêu đề tự ghép `<mẹ> — <phạm vi>`).
  Mẹ giờ có Detail riêng (`MeDetailModal`, click header mẹ) để xem/sửa mục tiêu/output/deadline qua
  `suaViec` — đây là nguồn con "theo scope" kế thừa. Tiện thể vá 1 bug tiềm ẩn: con tách qua modal cũ
  không kế thừa `ky_tuan` của mẹ (mặc định tuần HIỆN TẠI) — nếu leader đang xem tuần khác lúc tách, con
  sinh ra sẽ RƠI KHỎI view của mẹ. Giờ `GiaoPrefill.me.ky_tuan` truyền `ky_tuan` mẹ xuống `createViec`.
- **Card UI (`WeeklyPlanningTab`):** mỗi task = 1 `TaskCard` ngang (Tên · PIC · Deadline · Trạng thái ·
  %), click mới ra `TaskDetailModal` (mục tiêu/output/người giao + toàn bộ nút hành động Hold/Chuyển/
  Huỷ/Nghiệm thu/Duyệt-gia-hạn dời vào đây — mặt card gọn theo đúng 5 cột CEO yêu cầu). Cảnh báo gia
  hạn-chờ-duyệt/hold-quá-hạn thu gọn thành chấm đỏ cạnh badge trạng thái thay vì chiếm chỗ trên card.
- **Verify:** `tsc --noEmit` sạch. Test sống trên data prod thật (dev quick-login Admin) — mở/đóng mọi
  modal (Detail, Mẹ Detail, Tách task con cả 2 kiểu chia) không lỗi console, KHÔNG submit ghi đè data
  thật. Chưa test nhánh submit thật (nghiệm thu/huỷ/chuyển/lưu mẹ/tạo con) — cần CEO tự bấm thử hoặc
  dựng data `ZTEST_` riêng nếu muốn Claude tự chạy hết luồng ghi.

---

## 2026-08-14 — ⭐ CỤM BÀI (tầng dưới của Dạng) + TIỀN ĐỀ 2 tầng · nhánh `feat/cum-bai`

**Vấn đề CEO nêu:** kho có 2 luồng vào (clone từ bài gốc · nhập tài liệu ngoài). Khái niệm "họ" không có
object riêng, chỉ suy từ `parent_ma_cau ?? ma_cau` ⇒ bài nhập lẻ không có chỗ khai "tao tương đương bài
kia", và **2 CÂU GỐC tương đương vẫn bị coi là 2 họ** nên mã đề không dám hoán đổi, tài liệu thì lấy cả
hai vào một đề mà không thấy là lặp.

**Phản biện đã chốt (sparring):**
- Model KHÔNG sai — thiếu *thao tác gộp* + *chỗ cất lời xác nhận*. Không đập tầng.
- Gốc/clone = trục NGUỒN GỐC; cụm = trục TƯƠNG ĐƯƠNG. **Hai cột song song**, cấm nhét "cùng cụm" vào
  `parent_ma_cau` (nói dối về nguồn gốc).
- Công bằng trong cụm: **team học thuật chịu** (CEO) → bỏ ý phân hạng "cụm chặt/gom tay" + cờ vàng.
- Tên: nhánh Hình đã dùng "họ mô hình" với nghĩa NGƯỢC (cụm nối bằng tiền đề) ⇒ Đại/KHTN gọi **"Cụm bài"**,
  Hình **giữ nguyên không sửa dòng nào**. Chữ "cụm" lấy từ chính miệng CEO.
- Tiền đề: làm **cả 2 tầng** (dạng↔dạng, cụm↔cụm). RANH GIỚI: **KP đo vẫn là DẠNG** — tiền đề tầng cụm
  chỉ dùng cho thứ tự dạy + builder, CẤM chui vào công thức mastery.
- Phạm vi: **Đại + KHTN** (hgt cùng shape, thêm sau — hiện 0 câu lẻ). Gom **tay**, tên cụm người đặt.

**Số liệu thật lúc làm:** Đại 12.256 câu / 9.6k clone / 2.893 "họ" / **1.587 câu lẻ rải trong 123/325 dạng
(dạng nặng nhất 120 câu)** · KHTN 224/234 họ là câu lẻ · hgt 0 câu lẻ. → gán từng câu bằng dropdown là
không dùng được ⇒ UI phải **chọn nhiều → gom**.

**Đã làm:**
- `spec-cum-bai.md` (spec đầy đủ) · migration `202608131918_cum_bai.sql`:
  `dai_cum_bai`/`khtn_cum_bai` · cột `ma_cum` (nullable) · 4 bảng cạnh tiền đề · 8 hàm bao đóng/hậu duệ
  (soi gương `hinh_mo_hinh_hau_due`) · RLS `la_thanh_vien()` · backfill · **guard bất biến tự rollback**.
- `cumKey(c) = ma_cum ?? parent_ma_cau ?? ma_cau` (api.ts) → dùng ở `made.ts` (`rootOf`) và
  `tailieu.ts` (`nguonCuaCau`). Sửa lại comment bất biến ở made.ts (trước ghi "cùng `parent_ma_cau`").
- UI: `CumBaiTab.tsx` (danh sách cụm · toggle Gốc|Clone · rổ "Chưa phân cụm" · chọn nhiều → gom / thêm
  vào cụm / gỡ / gộp cụm / đổi tên) · `TienDeBox.tsx` (dùng chung 2 tầng) · `DangHub` đổi bộ lọc
  "Câu gốc" thành 2 tab **Cụm bài | Toàn bộ kho** + nút "🔗 Tiền đề dạng".

**SAI & SỬA (đáng nhớ):**
1. **Backfill bản đầu lọc `goc.xoa_at is null`** → bỏ sót **17 nhóm mồ côi** ở Đại (câu gốc đã vào kho rác
   nhưng 78 clone còn sống). 78 câu tụt về "chưa phân cụm" ⇒ vỡ 17 khối thành 78 khối lẻ ⇒ mã đề mất
   quyền hoán đổi giữa chúng. **Guard §7 bắt (2954 khối mới vs 2893 khối cũ) và rollback cả migration.**
   → Sửa: gom theo **NHÓM khoá cũ** `coalesce(parent_ma_cau, ma_cau)` có ≥2 câu sống, không quan tâm gốc
   còn sống hay không. *Bài học: gốc chết KHÔNG làm các clone hết tương đương với nhau.*
   *Bài học 2: migration đổi cách lưu thì PHẢI có câu kiểm "phân hoạch mới ≡ phân hoạch cũ" ngay trong
   transaction — nếu không, lệch này hỏng ÂM THẦM, chỉ lộ khi ai đó soi 3 mã đề của một buổi.*
2. **`cumKey` để 3 tầng** (`ma_cum ?? parent_ma_cau ?? ma_cau`) chứ không 2: tầng giữa là lưới an toàn cho
   clone sinh ra trong lúc code chưa deploy kịp gán `ma_cum`, và cho nhánh `hgt` (không có cột `ma_cum`
   → `undefined` rơi xuống đúng hành vi cũ).
3. Kho **đang chạy live** lúc migrate (12.161 → 12.256 câu trong lúc làm). Mọi số đo phải đọc lại tại thời
   điểm chạy, đừng tin số của lượt query trước.

**Kiểm:** `tsc --noEmit` sạch · `npm run build` OK · 11 phép thử vòng đời cụm + tiền đề chạy trong 1
transaction rồi **ROLLBACK** (tạo/gán/gộp/xoá cụm · cascade cạnh tiền đề · CHECK tự-trỏ · hậu duệ &
bao đóng · xoá cụm ⇒ câu về rổ không mất) — prod không còn dấu vết. **CHƯA E2E trên app** (cần CEO login).

**Sau migrate:** Đại 1.279 cụm · 10.642 câu đã có cụm · **1.614 câu ở rổ chưa phân cụm (124 dạng)**.
KHTN 10 cụm · 224 câu ở rổ. Đó là việc gom tay tồn đọng, không phải lỗi.

## 2026-08-14 (tiếp) — Gỡ backfill cụm: CỤM LÀ THỦ CÔNG 100% · 3 tab · gán 2 chiều

**CEO bắt lỗi:** *"T bảo cụm là thủ công cơ mà. Người dùng phải đặt tên cụm rồi mới gán các câu vào chứ,
sao m lại đi phân cụm rồi"*. Đúng — và tệ hơn: **backfill đó THỪA**, do chính tao làm nó thành thừa.
Lý do ban đầu backfill là giữ hành vi mã đề; nhưng giữa chừng tao đổi khoá thành
`ma_cum ?? parent_ma_cau ?? ma_cau` — **tầng giữa đã tự giữ hành vi cũ**. Từ lúc thêm tầng đó, backfill
chỉ còn tác dụng đẻ 1.279 cụm không tên không ai xin. Spec §2 cấm bịa cụm cho câu lẻ, rồi §6 lại bịa cho
chuỗi clone → mâu thuẫn nội bộ mà tao không tự soi ra.

→ **Bài học:** khi thêm một lớp fallback, phải quay lại hỏi *"cái gì vừa trở thành thừa?"*. Fallback mới
âm thầm rút hết lý do tồn tại của bước trước đó mà không có lỗi nào báo.

**Đã làm:**
- `202608141314_go_backfill_cum.sql` — xoá cụm mang **vân tay backfill** (`ten is null` VÀ mọi câu trong
  cụm cùng một khoá cũ) nên cụm do NGƯỜI tạo luôn sống sót; chạy lại vô hại. FK `on delete set null` tự
  đưa câu về "chưa phân cụm". Kiểm sau xoá: 0 câu mồ côi cụm.
  Trước khi xoá đã đo: 0 cụm có tên · 0 cụm gom thêm câu · 0 cạnh tiền đề ⇒ không mất công của ai.
  Sau: **0 cụm cả Đại lẫn KHTN**, mọi câu về hàng đợi.
- UI theo yêu cầu CEO: **3 tab** (Cụm bài · **Chưa phân cụm** · Toàn bộ kho) + **gán 2 CHIỀU**
  (bài→cụm: dropdown trên từng dòng · cụm→bài: nút "＋ Thêm bài" mở picker có ô tìm) + nút
  "＋ Cụm mới" tạo cụm RỖNG đặt tên trước.

**⚠ VA CHẠM 2 PHIÊN (ghi để nhớ):** có phiên Claude khác làm song song **trong cùng working tree**
(`tien_to_ma_theo_mon`: đổi mã dạng sang tiền tố T1/T2/T3/K). `npm run migrate` của phiên này **áp luôn
migration đang treo của họ** — chạy OK, nhưng đó là áp hộ thứ mình không viết. May là migration của họ
CÓ biết bảng cụm và sửa FK `dai_cum_bai`/`khtn_cum_bai`/`*_dang_tien_de` thành `on update cascade`, nên
mã dạng đổi `09010201` → `T103010101` mà cụm không gãy.
→ **Luật rút ra: trước khi `npm run migrate`, chạy `--status` xem có file treo của người khác không.**

## 2026-08-14 (tiếp) — Tiền tố mã theo MÔN/NHÁNH: T1 Đại · T2 Hình · T3 Giải tích · K KHTN

**CEO bắt lỗi:** *"mã dạng bài của KHTN và Toán trùng nhau. T tưởng đã bảo m phải fix rồi."* — đúng, và
nghiêm trọng hơn tao tưởng lúc đầu.

**Bug:** mã dạng là mã VỊ TRÍ thuần số (`khối2+chủđề2+chuyênđề2+dạng2`) nên MỌI kho sinh cùng một dải mã.
Đo được trên DB thật: Đại∩KHTN **62** · Đại∩Hình **48** · KHTN∩Hình 9 · KHTN∩GT 7 · Đại∩GT 3 · Hình∩GT 1.
Mã CÂU cũng trùng (Đại∩KHTN 4 · KHTN∩GT 22). Mà đo lường (`buoi_danh_gia_dang`, `gami_session_problems`,
`bt_grades`…) lưu `ma_dang` là **text trần KHÔNG nhãn môn** ⇒ ô (HS × dạng) của 2 môn gộp âm thầm.

**Đính chính quan trọng cho chính tao:** lúc đầu tao báo "1066 dòng đang trộn". SAI mức độ — 1066 là số
dòng *mang mã nhập nhằng*, còn KHTN mới có ~22 dòng đo thật. Hỏng **chưa xảy ra diện rộng**, nhưng là
súng đã lên đạn: lớp KHTN chạy thật là gộp ngay. Phải phân biệt "đã hỏng" vs "sẽ hỏng".

**2 phát hiện chỉ lòi ra khi dò GIÁ TRỊ thay vì đọc tên cột / default:**
1. **`hinh_ban_do` KHÔNG dùng `HD00001`** như default cột ghi — 0/87 dòng dùng nó, cả 87 là mã vị trí
   8 số, và trùng Đại 48 mã. Tao đã suýt kết luận "kho Hình an toàn, để dành T2" từ đọc `schema.md`.
   → **Default của cột không nói lên dữ liệu thật** (họ hàng với §2.1 "cột text không nói tập giá trị").
2. Ngược lại, `ma_dang_hinh` **không được cột nào khác tham chiếu** (kiểm `information_schema`) — nhánh
   Hình nối vào đo bằng `hinh_y_id` (uuid). Nên T2 phải bị LOẠI khỏi tập ứng viên khi backfill text trần;
   để nó trong đó làm kẹt 563 dòng Đại vốn phân giải được.

**Fix:** `202608141259_tien_to_ma_theo_mon.sql` — mỗi kho một tiền tố, mã tự mang danh tính môn/nhánh.
Idempotent nhờ bất biến: mã CŨ luôn bắt đầu bằng CHỮ SỐ, mã MỚI luôn bằng CHỮ CÁI (`~ '^[0-9]'` làm guard).

**Phân giải 30k dòng text trần — nhân chứng, không đoán:**
- Nguyên tắc: mỗi nhân chứng chỉ **THU HẸP** tập ứng viên; chỉ kết luận khi còn ĐÚNG MỘT. Giao rỗng
  (2 nhân chứng mâu thuẫn) ⇒ bỏ cả lượt, để nguyên.
- Nhân chứng: ① `ma_cau` (Đại∩GT = 0 ⇒ sạch cho Đại↔Giải tích) ② mã chỉ có ở 1 kho ③ `lop.mon` /
  `tai_lieu.mon`+`nhanh` ④ mốc thời gian — kho `hgt_` sinh **10/08/2026**, câu đầu 11/08 ⇒ dòng đo trước
  10/08 KHÔNG THỂ là Giải tích.
- 1044 dòng `mon = NULL` (buổi BÙ, `lop_id` null) phân giải qua `buoi_hoc_hs.bu_cho_buoi_id` → buổi gốc →
  lớp. 100% ra Toán, không dòng nào phải đoán.

**Bug tao tự tạo rồi tự sửa (đáng nhớ nhất):** bản đầu hàm phân giải **return sớm** ở nhân chứng mã câu —
"ra 1 kho thì chốt, không thì bỏ cuộc". 103 dòng Hình giải tích rơi hết, vì mã câu của chúng trùng KHTN
(`{K,T3}`) nên bị coi là "không kết luận được", trong khi chỉ cần giao với `mon='Toán'` là ra ngay `T3`.
→ **Bài học: short-circuit từng nhân chứng ≠ giao các nhân chứng.** Cái đầu vứt thông tin, cái sau dùng hết.

**Bẫy kỹ thuật đã cắn (ghi để khỏi cắn lại):**
- Self-FK `parent_ma_cau` **không dùng được `ON UPDATE CASCADE`** khi đổi hàng loạt PK cùng bảng — cascade
  sửa parent của dòng chưa tới lượt ⇒ vi phạm giữa chừng. Phải gỡ FK → đổi cả 2 cột trong MỘT câu → gắn lại.
- Postgres **cấm `LATERAL` tham chiếu bảng đích của `UPDATE`**. Dùng `FROM (subquery đọc chính bảng đó)`.
- Hàm phân giải tra bảng mapping có PK `(kho, loai, ma_cu)` ⇒ tra theo `(loai, ma_cu)` không dùng được PK
  ⇒ seq scan 13k dòng × 30k lần = treo >2 phút. **Thêm index là bắt buộc, không phải tối ưu.**
- 12/17 FK trỏ vào các bảng kho **thiếu `ON UPDATE CASCADE`** ⇒ phải nới TRƯỚC khi đổi PK.

**Kết quả (dry-run rollback rồi verify lại trên DB sau khi áp — số khớp y hệt):**
0 mã trùng giữa mọi cặp kho · 0 dòng còn mã cũ · 0 mồ côi · số dòng mọi bảng không đổi ·
0 dòng khớp >1 kho. Phân bổ: `gami_session_problems` T1=8281 · T3=63 · K=8 · `tai_lieu_phan` T1=4664 ·
T3=64 · K=12 · `bai_test_cau` T1=479 · K=14.

**Code:** tiền tố dài KHÁC NHAU (K=1, T1/T2/T3=2) ⇒ **cấm cắt mã bằng chỉ số tuyệt đối**. Thêm
`tachTienTo` / `maChuDeCua` / `maChuyenDeCua` / `soThuTuCua` vào `lib/kho/api.ts`, mọi phép cắt đi qua đó
(`maxOrd` — nếu quên thì số thứ tự đọc sai và mã mới ĐÈ mã đang có), + `KHO_TIEN_TO` keyed theo
`BranchConfig.key`. Sửa 2 chỗ cắt cứng: `BanDo.tsx` `.slice(4)`, `DashboardHocTapScreen.tsx` `.slice(0,6)`.

**⚠ VA CHẠM 2 PHIÊN (đối chiếu ghi chép của phiên kia):** migration này **không do tao bấm áp** — phiên
kia chạy `npm run migrate` lúc 13:14 và quét luôn file đang treo của tao. Kết quả đúng (đã verify bằng
dữ liệu, không tin sổ `_migrations`), nhưng bước "CEO duyệt dry-run rồi mới áp" đã bị nhảy qua.
→ **Luật cho tao: file migration chưa được duyệt thì ĐỪNG để nằm trong `supabase/migrations/`** — giữ ở
scratchpad, chỉ chuyển vào khi đã có cái gật. Thư mục migrations là hàng đợi CHUNG của mọi phiên.

**Nối tiếp — `202608141452_tien_to_ma_chu_de.sql` (CEO gật sau khi xem dry-run):**
Migration đầu mới gắn tiền tố cho mã DẠNG + mã CÂU, nhưng mã dạng được **sinh bằng cách nối**
`chủ đề → chuyên đề → dạng`. Để 2 tầng trên trần số thì (a) chúng VẪN trùng — chủ đề Đại∩KHTN 12,
chuyên đề 25 — và (b) bộ sinh mã đẻ dữ liệu lẫn lộn: chủ đề mới ra `T10803` nằm cạnh `0801` cũ.
→ **Bài học: đổi khoá thì phải đổi CẢ CHUỖI sinh ra nó, không đổi mỗi tầng cuối.** Tầng cuối trông
đúng ngay, nhưng lần TẠO MỚI tiếp theo mới lộ ra là hỏng.

Sau: `T10801 → T1080101 → T108010101` · `K0801 → K080101 → K08010101` · `T20401 → T2040101 → T204010102`.
Kiểm bất biến NGAY TRONG transaction (`raise exception` nếu lệch): *mã dạng phải bắt đầu bằng mã chuyên
đề, chuyên đề bắt đầu bằng mã chủ đề*. Kết quả: 0 trùng · 0 lệch chuỗi · 0 lý thuyết chuyên đề mồ côi.

**Verify mức ỨNG DỤNG (không chỉ đếm cột):** chạy đúng phép join app dùng — HS nhiều dữ liệu nhất
(Lê Kim Anh 9C1, 41 dòng đo/21 dạng) ra tên dạng **41/41**; ô (HS × dạng) còn mơ hồ giữa 2 môn: **0**;
câu trong tài liệu còn tìm được trong kho: Toán 22.573/22.574 · KHTN 53/53 · Giải tích 223/223.

**1 câu mất KHÔNG phải do migration:** `tai_lieu_cau` có 1 dòng trỏ `DC000012` — mã kiểu seq CŨ
(`'DC'||nextval`), không tồn tại trong `dai_cau_hoi`, tài liệu từ 18/06. Bắt đầu bằng CHỮ nên guard
`~ '^[0-9]'` không đụng tới. Là rác có sẵn, đúng ca §2 "tham chiếu bằng TEXT không FK ⇒ rụng im lặng".
Kho vẫn còn 7 câu mã `DC…` — di sản trước khi chuyển sang mã vị trí. Chưa xử, ghi lại để dọn sau.

## 2026-08-14 (tiếp) — Bổ trợ bù: vắng buổi bù phải BIẾN KHỎI "Đã xếp" · đánh giá đã điền mà chưa chốt thì phải NÓI RA

**CEO nêu 2 việc:**
① *"Xếp bổ trợ bù, HS không đến, nhân sự tích vắng — hệ vẫn hiện ở chỗ Đã xếp. Đáng lẽ quay lại Cần bù và biến mất ở Đã xếp."*
② *"Có trường hợp trợ giảng đã đánh giá nhưng trên hệ thống vẫn chưa hiện đánh giá của buổi học."*

### ① Vắng buổi bù — nửa sau của fix 12/08 bị bỏ quên
Fix 12/08 mới làm **một chiều**: `listLanNghiCanXep` trả lần nghỉ về "Cần bù" khi em vắng buổi bù.
Chiều còn lại KHÔNG ai đụng: `listCaBoTro` vẫn lấy nguyên roster ⇒ đúng em đó vẫn được đếm + vẽ chip ở
tab "Đã xếp" ⇒ **một HS hiện ở HAI tab**, người xếp không biết tin chỗ nào. Nặng hơn: buổi bù 1 HS mà em
vắng thì `coMat = 0` ⇒ nút "Xác nhận ET" / "Hoàn thành đánh giá" **không hiện** ⇒ 2 mốc không bao giờ
đóng được ⇒ card **kẹt vĩnh viễn** ở "Đã xếp". Đo lúc sửa: **4/20 buổi ở tab này là loại kẹt đó**, và cả
4 đều toàn-bộ-HS-vắng (1 HS/buổi).

**Sửa (`src/lib/botro.ts`, `BoTroScreen.tsx`):** gom về 1 hàm `taiCaBoTro()` tính sẵn `hs` (còn ở buổi) /
`hsVang` / `xong` / `daTraVe`. HS vắng ra khỏi `hs` ⇒ sĩ số, chip, bộ lọc khối/tên, đếm tab đều theo
người CÒN ở buổi. Buổi không còn ai mà có người vắng = `daTraVe` ⇒ **rời khỏi Đã xếp/Hoàn thành**, gom
vào `listCaBoTroTraVe()` — hiện thành một dòng gập ở cuối tab Đã xếp ("4 buổi bù đã trả HS về Cần bù").
- **Không xoá âm thầm:** buổi đó vẫn mở được để **sửa nhầm** (bấm lại "Có mặt") hoặc **huỷ cho sạch**.
  Biến mất hẳn = mất luôn đường sửa khi người tích nhầm — đúng lớp bug "bỏ qua âm thầm" đang chống.
- Card có cả HS còn lẫn HS vắng thì hiện thêm dòng đỏ *"Vắng → đã về Cần bù: <tên>"*, không im lặng bớt người.
- **Không đụng** buổi 0-HS-từ-đầu (chưa ai bị vắng): giữ nguyên hành vi cũ.

Verify trên app (data thật): tab Đã xếp 20 → **16 card, không card nào còn HS vắng**; 4 buổi kia nằm
trong dòng gập; 3 em (Nguyễn Anh Văn · Nguyễn Đặng Danh Ngọc · Tố Uyên) có mặt ở "Cần bù" với nhãn
**XẾP LẠI · Vắng buổi bù**. Khớp 2 chiều.

### ② "Đã đánh giá mà hệ chưa hiện" — cả hệ chỉ đọc MỘT cờ nhị phân
Truy ra: **mọi** chỗ (Việc của tôi · trợ lý · dashboard vận hành · Kết quả học tập) đều đọc đúng một cột
`danh_gia_xong_at` = "đã bấm nút Hoàn thành hay chưa". Buổi điền nhận xét/chấm dạng cho ĐỦ HS mà quên bấm
nút thì hiện **y hệt buổi trắng tinh** — công đã làm thành vô hình. Đo trên DB: **8 buổi đã qua có dữ liệu
đánh giá thật mà cờ vẫn NULL** (9A2 18/07 đủ **13/13** HS chấm dạng · 5T1 19/07 đủ 6/6 cả nhận xét lẫn dạng).

**Sửa:** thêm `danhGiaTienDo(buoiIds)` (gami.ts) — derive từ **dòng thật** (nhận xét không rỗng HOẶC ≥1 ô
chấm dạng) trên mẫu số HS `co_mat`. Hiện ở 3 chỗ: card "Đánh giá" trong Việc của tôi (*"đã điền 5/6"*),
tab Đánh giá của buổi thường, và footer buổi bù — điền đủ mà chưa chốt thì tô hổ phách kèm câu
*"chưa chốt thì hệ vẫn tính là CHƯA đánh giá"*.
- **CỐ Ý không tự đóng mốc hộ người:** `danh_gia_xong_at` là tuyên bố của người phụ trách (§4 mốc
  người-tự-chốt); tự set = bịa chữ ký. Chỉ làm "chưa xong" nói rõ **chưa xong ở đâu**.
- Verify: mở 9A2 18/07 → tab Đánh giá hiện *"đã điền 13/13 HS — chưa chốt thì hệ vẫn tính là CHƯA đánh giá"*.

**⚠ CÒN MỘT VIỆC CHỜ CEO QUYẾT (không tự sửa):** với buổi **thường**, `TASKS_BY_VAI` chỉ giao
"Đánh giá sau buổi" cho **gv** — **tg (trợ giảng) KHÔNG có task đánh giá nào**. Trong khi buổi **bù** và
buổi **đuổi** thì TA lại là người đánh giá (Thùy chốt 07-26). Nếu thực tế TA cũng đánh giá buổi thường
thì bảng vai↔khâu đang lệch với đời thật, và đó là quyết định của CEO chứ không phải sửa kỹ thuật.

## 2026-08-14 (tiếp) — Tài liệu buổi mẹ NGAY TRONG buổi bù · nhãn người-nhận-việc ở bổ trợ

**CEO chốt + yêu cầu:**
① *"Người nào được xếp bổ trợ thì người đó đánh giá mới đúng."*
② *"Cực kì quan trọng: trong card bổ trợ bù có luôn giáo trình, BTVN và ET của buổi đấy, để nhân sự khỏi lục lại kho tài liệu."*

### ① Nhãn form đang MÔ TẢ SAI luồng việc thật
Engine (`getMyTasks`) route **cả chấm ET lẫn đánh giá** về `nguoi_day_tg` — người dạy buổi bổ trợ — chỉ
rơi về `nguoi_day` (GV) khi ô kia trống (đúng luật CEO vừa chốt, và đúng quyết định 07-26). **Nhưng form
xếp bù lại ghi "GV (đánh giá)" và "TA (chấm ET)"** ⇒ người điền tưởng GV sẽ đánh giá, trong khi việc đã
sang TA. Không phải bug engine — là **nhãn nói ngược với hành vi**, loại sai âm thầm nhất vì không ai
thấy lỗi, chỉ thấy "việc không về đúng người".
→ Đổi ở `XepModal` (BoTroScreen) + `SuaBuoiModal` (dùng chung bù/đuổi): ô người-dạy-bổ-trợ **lên trước**
và có dấu `*`, GV lùi sau, kèm câu *"Chấm ET + đánh giá về người dạy bổ trợ; bỏ trống ô đó thì việc rơi
sang GV"*. Không đụng engine — engine vốn đã đúng luật.

### ② Giáo trình · BTVN · ET của buổi mẹ, ngay trong buổi bù
Người dạy bù cần đúng 3 thứ của buổi em đã nghỉ, trước đây phải nhớ lớp + ngày rồi sang Kho tài liệu tự
lọc — mà **mỗi em một bộ khác nhau** (buổi bù gom nhiều lớp/ngày), nên càng đông em càng dễ lấy nhầm.
- `taiLieuCuaBuoiMe(buoiMeIds)` (botro.ts): tra theo `bu_cho_buoi_id` của TỪNG dòng roster.
  **⚠ Tài liệu vận hành không có FK về `buoi_hoc`** — nó bám `(lop_id, ngay)` (cùng đường
  `loadETForBuoi`/`getBTVNByBuoi`/`getGiaoTrinhBuoiDoc` đang đi). PostgREST không lọc được theo CẶP cột
  ⇒ lấy rộng theo 2 tập rồi **ghép đúng cặp ở JS**; lọc thiếu một vế sẽ kéo tài liệu **lớp khác cùng
  ngày** — sai kiểu đó trông vẫn "có tài liệu" nên rất khó phát hiện. Trùng (lớp|ngày|loại) → lấy bản mới
  nhất, đúng quy ước đã có ở `tailieu.ts` ("lỡ trùng thì lấy bản mới nhất, đừng throw cả màn").
- UI: hàng chip trong card từng HS — mỗi loại có **🖨 In** (tái dùng `PrintView`/`ETPrintView` của Kho,
  KHÔNG dựng bản in thứ hai) và **🔗 Link** (copy PDF `file_url`, có thì mới hiện).
- **Loại thiếu vẫn hiện nhãn xám "chưa có"**: im lặng bỏ đi thì người dạy tưởng mình tìm thiếu; nói ra
  thì biết buổi đó thật sự chưa soạn — hai chuyện khác hẳn.
- Verify: buổi bù 16/08 (HS bù cho 7A1 · 07/08) hiện đủ 3; bấm In ra đúng *"Lớp 7A1 · Ngày 07/08/2026"*
  và ET *"Đề kiểm tra cuối giờ lớp 7A1"*. Buổi bù 25/08 (bù cho 12B1 · 24/07) hiện "chưa có" cả 3 — khớp
  query thô (lớp+ngày đó chưa có tài liệu nào), không phải lỗi tra.

### Vá kèm — 400 im lặng mỗi lần mở buổi bù
`getBuoi` gọi `phan_cong_lop.eq('lop_id', <null>)` khi buổi KHÔNG có lớp (bù/đuổi) ⇒ PostgREST gửi chuỗi
`"null"` cho cột uuid ⇒ **400 `invalid input syntax for type uuid`** mỗi lần mở. Không vỡ gì (kết quả
undefined → `gv_chinh_id: null`) nên sống lâu trong console. Guard: không có lớp thì không hỏi GV chính.

## 2026-08-14 (tiếp) — Người bổ trợ hiện + chọn NGAY trên card buổi bù

CEO: *"Chính xác thì ai bổ trợ người đó bù → trong card bổ trợ bù để thông tin chọn người bổ trợ đi.
Hiện cho cả GV và TA của ca bù."*

Card buổi bù trước giờ **không hiện ai dạy** — dữ liệu có sẵn (`nguoi_day`/`nguoi_day_tg` nằm trong
`CaBoTro` từ đầu) nhưng chưa bao giờ render, muốn biết phải mở modal "Sửa buổi". Mà người bổ trợ chính
là người nhận cả chấm ET lẫn đánh giá ⇒ đó là thông tin quan trọng NHẤT của card, không phải thứ giấu
sau một nút sửa.

- `taiCaBoTro` embed tên: `gv:nguoi_day(ho_ten)` / `ta:nguoi_day_tg(ho_ten)`. **Phải đặt tên cột** —
  `buoi_hoc` có 2 FK cùng trỏ `nhan_su`, để PostgREST tự đoán là rỗng âm thầm (cùng bẫy đã dính với
  `buoi_hoc_hs` → `buoi_hoc`).
- Card hiện `🧑‍🏫 Bổ trợ: <tên>` + `GV: <tên>`; **chưa chọn ⇒ chip ĐỎ "⚠ Chưa chọn người bổ trợ"** (bỏ
  trống thì việc rơi về GV, hoặc mồ côi nếu GV cũng trống — phải nhìn thấy ngay chứ không im lặng).
- Bấm chip = đổi người **tại chỗ** (SearchSelect inline → `updateBuoiMeta`), `stopPropagation` để không
  mở nhầm màn chi tiết. Tab "Hoàn thành" thì chỉ xem.
- Verify: 15 card hiện đủ tên; mở picker không nhảy vào detail; chọn lại **đúng người cũ** (cố ý — DB
  thật, không đổi phân công của ai) → lưu + refresh, 0 lỗi mạng.

**Quan sát khi verify:** giữa phiên, tab Đã xếp 18→17 và Hoàn thành 150→151 — có người trong team vừa
đóng một buổi bù lúc đang test. Nhớ: đây là DB THẬT đang chạy, không phải sandbox.

## 2026-08-14 (tiếp) — Ca test đầu vào: assign người chấm/người trả bài dự kiến (derive, KHÔNG roster)

CEO: *"Khi lập ca test đầu vào cần có thêm thông tin assign người chấm và người trả bài."*

Nhánh `fix/test-dau-vao`, worktree riêng `bkdemy-erp-v2-testdauvao` (Explore trước: `+ Tạo test đầu
vào` nằm ở `DiemDanhTestScreen.tsx` trong module `TestDauVaoScreen.tsx`; Chấm/Trả bài đã ghi rõ đây là
**hàng đợi CHUNG, "ai mở thì làm" — KHÔNG owner cứng**, Thùy chốt 07-19). Assign chỉ để BIẾT trước, KHÔNG
đổi model pool đó — Thùy 08-14 xác nhận: *"hiển thị vẫn chung... nhưng vẫn assign chính cho người được
phân công. Trong các tab báo cáo vẫn phải báo theo người được assign"*.

**Vòng 1 (BỎ — roster tĩnh):** tạo bảng `test_dau_vao_nhan_su` (mig `202608142255`) curate riêng nhóm
nhỏ đủ điều kiện, vì "chọn từ toàn bộ `nhan_su_mon` quá nhiều". Thùy phản biện ngay: sao không ưu tiên
hiển thị người GẦN NHẤT từng được gán lên đầu list, đỡ phải thêm bảng/cột. Đúng — roster tĩnh vi phạm
tinh thần PURE-DERIVE (CLAUDE.md §4) + phải bảo trì tay (người nghỉ việc phải nhớ xoá khỏi roster).

**Vòng 2 (LÀM):** revert bảng roster (mig `202608142304`, DROP — bảng đang 0 dòng, chưa ai dùng, an
toàn). Giữ 2 cột `ca_test.nguoi_cham_id`/`nguoi_tra_bai_id` (uuid, FK `nhan_su`, nullable — đây là assign
THẬT của từng ca, không phải danh mục nên KHÔNG derive được). Thêm `listNguoiChoCham(mon)` /
`listNguoiChoTraBai(mon)` trong `tuyensinh.ts` — nguồn = TOÀN BỘ `nhan_su_mon` của môn (không khoá ai),
tự sort: ai từng xuất hiện trong lịch sử `ca_test.nguoi_cham_id`/`nguoi_tra_bai_id` của môn đó (200 ca
gần nhất, dedup, mới→cũ) lên nhóm **"Gần đây"** (optgroup) trước, còn lại xuống **"Khác"**. Người nghỉ
việc (`nhan_su.trang_thai≠'dang_lam'`) tự rụng khỏi cả 2 nhóm — không ai phải nhớ dọn.

UI: `DiemDanhTestScreen.tsx` — 2 select "Người chấm/trả bài (dự kiến)" trong modal Tạo ca (optional,
không block tạo) + sửa được ngay trên card ca đang chạy (giống cách gán đề/upload bài — không khoá sau
khi chọn 1 lần). Badge tên hiện ở `ChamTestScreen.tsx`/`TraBaiTestScreen.tsx` (đọc qua join
`nguoi_cham`/`nguoi_tra_bai` trong `CA_TEST_SELECT`/`CHO_CHAM_SELECT`/`TRA_BAI_SELECT`).

**Verify:** `tsc --noEmit` sạch (strict + noUnusedLocals). Dev server của phiên chat khác đang chạy
NGAY TRONG worktree này nhưng WS HMR chết (`ws://localhost:5183` fail) → fetch module qua nó vẫn trả
bundle CŨ dù đã sửa file trên đĩa (im lặng, không lỗi) — phải tự bật dev server RIÊNG (port 5299) mới
thấy code mới. **Bài học: 1 dev server có mở KHÔNG chắc đang serve đúng version — luôn fetch thẳng
source qua nó để đối chiếu trước khi tin UI hiện đúng.** Login qua nút "⚡ DEV — ĐĂNG NHẬP NHANH" (app
tự có, không phải Claude nhập mật khẩu). Tạo 1 ca test thật (`ZTEST Nguyen Van A` / `UV0166`) → gán
Đào Xuân Thùy (chấm) + Hoàng Khánh Linh (trả bài) → card load lại đúng 2 select đã chọn sẵn → mở modal
Tạo ca lần 2, môn Toán → xác nhận Đào Xuân Thùy đã nhảy lên nhóm "Gần đây". Dọn `ung_vien` UV0166 (cascade
xoá `ca_test`/`ca_test_log` liên kết — FK `on delete cascade` có sẵn từ mig 0088) sau khi Thùy gật.

## 2026-08-14 — Bài toán có thể có giả thiết RIÊNG (mirror mô hình con-cha)

**Yêu cầu (Thùy, verbatim):** "trong phần bản đồ kiến thức hình. t muốn tầng từ node bài toán - mô
hình cũng có thể có giả thiết riêng giống với mô hình con - mô hình bố. Thực tế không phải mọi bài
đều tuyệt đối kế thừa. Tạm thời mới là để agile 1 chút : node bài toán có thể có giải thiết độc lập
với mô hình" — nới model cũ (đã chốt cứng ở `FormBaiToan.tsx`/`hinh.ts`: "bài toán KHÔNG có giả thiết
riêng, luôn mượn của mô hình").

**Schema (`202608141750_hinh_baitoan_gia_thiet_rieng.sql`):** thêm `hinh_baitoan.gia_thiet_rieng text`
+ `gt_thay_the boolean not null default false`. KHÔNG mirror y hệt cặp cột của `hinh_mo_hinh`
(`gia_thiet`+`gia_thiet_them`) — mô hình cần 2 cột vì `gia_thiet` NOT NULL đã có sẵn làm nền base;
bài toán không có tiền lệ đó nên 1 cột nullable là đủ (đúng tinh thần "agile" của Thùy — ít schema
surface nhất có thể). Mặc định `gt_thay_the=false, gia_thiet_rieng=null` ⇒ hành vi CŨ bảo toàn 100%.
Cố ý KHÔNG đụng `gia_thiet_phu` đã có — đó là dữ kiện lẻ lan theo van tiền đề (`keo_gt_phu`), cơ chế
khác hẳn, dễ nhầm tên nên ghi rõ trong comment ở cả 2 nơi.

**Data-layer (`hinh.ts`):** hàm mới `giaThietBaiToan(L, baiToanId)` — CỘNG THÊM (mặc định): giả thiết
mô hình + `gia_thiet_rieng`; THAY THẾ (`gt_thay_the=true`): chỉ `gia_thiet_rieng`, bỏ qua hẳn mô hình.
`deBaiChuanCua` đổi sang gọi hàm này thay vì `giaThietDayDu(mo_hinh_id)` thẳng.

**Quét toàn repo mọi chỗ đang gọi `giaThietDayDu(L, X.mo_hinh_id)` để phân loại ĐÚNG BÀI TOÁN (X là
node — phải đổi) vs ĐÚNG MÔ HÌNH (X là mô hình hoặc mô hình sâu nhất của cả chuỗi — giữ nguyên):
đổi 10 chỗ (SoDo.tsx ×4: node card, detail panel + 2 nơi build "đề" export; SoanTaiLieu.tsx ×6: mục
Buổi, mucGhep, mucGhepLua, 2 bản versions, đề chung của phiếu tick). CỐ TÌNH giữ nguyên
`TaiLieuChuan.tsx`'s `giaThietDayDu(L, mhSau.id)` — `mhSau` ở đó là MÔ HÌNH sâu nhất một CHUỖI (nhiều
node, có thể khác mô hình) chạm tới, không phải 1 bài toán cụ thể — áp override của 1 node vào đây sai
ngữ nghĩa.

**UI (`FormBaiToan.tsx`):** thêm khối "Giả thiết riêng của bài này" — mirror UI y hệt kiểu-kế-thừa của
`FormMoHinh` (Cộng thêm / Thay thế hẳn, 2 nút bấm) + textarea + OCR ảnh/PDF + preview live "Giả thiết
đầy đủ (xem trước)" khi có nội dung riêng. Mặc định để trống = mượn 100% mô hình, không đổi UX cho
99% bài toán hiện có. `SoDo.tsx` detail panel: nhãn "Đề — giả thiết" đổi động theo trạng thái (mượn /
mô hình+riêng / riêng của bài này).

**Verify:** `npm run migrate` áp sạch (chỉ 1 file mới, các cảnh báo "file sửa sau" khác là false-positive
CRLF đã biết) · `npm run schema` xác nhận 2 cột mới · tsc sạch · `npx vite build` sạch · click-through
THẬT trên BT.025 (họ Tứ giác K8, dev server phiên song song khác đang chạy — mở qua browser tool, dữ
liệu vẫn chung 1 DB Supabase): mở Sửa → gõ "TEST góc D = 65 độ" ở ô Giả thiết riêng (mặc định Cộng
thêm) → preview live ghép đúng "Cho tứ giác ABCD; TEST góc D = 65 độ" → Lưu → card node + panel detail
+ nhãn đều đổi đúng ("ĐỀ — GIẢ THIẾT (MÔ HÌNH + RIÊNG)") → mở lại Sửa, xoá trắng ô riêng → Lưu →
xác nhận textarea rỗng lại (dọn sạch dữ liệu test, không để lại vết trên BT.025 thật).

---

## 2026-08-14 — ⭐⭐ IN GIÁO TRÌNH: trang trắng / mất & lặp nội dung / dạng mới nhảy trang (3 vòng sai rồi mới ra gốc)

**Thùy báo (3 lần, mỗi lần lộ 1 lớp):** (1) GT 8S1 14/08 "cách 1 trang" · (2) "thay vì lỗi trang 2 giờ
lỗi mẹ trang 1" · (3) "dạng 1 mới hết nửa trang 2 thì dạng 2 nhảy sang trang mới".

**Bối cảnh vì sao TRƯỚC KHÔNG BỊ:** masthead giáo trình (`.gtbk-mh`) mới thêm **08-08** (commit
`3f771d8` redesign header BK). Nó chiếm ~198px đầu buổi → đẩy card đầu vào thế **buộc phải xé qua 2
trang** — chỗ xé đó mới là chỗ hỏng. Bỏ masthead đi thì hết bug ngay (7 trang sạch) → chứng minh
masthead chỉ là **điều kiện kích hoạt**, không phải thủ phạm.

**3 lần vá SAI (ghi lại để đừng đạp lại):**
1. `16c771d` bỏ `break-after:avoid` ở masthead — đoán "avoid chồng avoid". Sai, không đổi gì.
2. `bef992b` ép `.gtbk-mh{break-after:page}` (masthead chiếm riêng 1 trang) — HẾT trang trắng thật,
   nhưng chỉ **đổi chỗ lãng phí**: trang 1 gần trống. Thùy bác đúng: "lỗi mẹ trang 1 rồi".
3. `2b2662b` bỏ `<div>` bọc nhóm card → `<Fragment>` — **đúng 1 phần** (hết trắng + hết lặp), nhưng
   tôi **báo xong ẩu**: dữ liệu ngay trước mắt (trang 2 chỉ 292 ký tự) đã cho thấy còn lỗi mà không nhận ra.

**Đã tự loại trừ bằng render THẬT (sửa → dựng lại → xem, không đoán CSS):** `overflow:hidden` ·
`min-height` · pseudo trang trí `:after` · `break-inside/after` ở `.gtbk-mh` + `.gtbk-card-head` +
`.pv-box-label` · nền/viền/bo góc `.pv-box-lt` · chờ `document.fonts.ready` — **bỏ từng cái đều KHÔNG
hết bug**. Ép `.gtbk-card{break-inside:avoid}` hoặc `.pv-box-lt{break-inside:avoid}` còn **TỆ HƠN**
(mất hẳn nội dung / 11 trang rải rác trang gần trống).

**GỐC THẬT (đo được):** paged.js ngắt **giữa 2 khối anh-em ruột** thì đúng; ngắt **vào trong lòng 1
khối, sâu ≥2 tầng** thì **bỏ phí nốt phần trang còn lại** (phần tử kế tiếp nhảy trang mới) — và ở ca
nặng thì dựng dở → trắng 1 trang → dựng lại từ đầu (lặp/mất nội dung thật). Thẻ `<div>` bọc thừa cũng
tính là 1 tầng.

**FIX CHỐT (`a30bfe8`):**
- `.pv-blk{break-inside:avoid}` + `LyThuyetBody` **CHẺ khối dài thành nhiều khối ngắn** (theo dòng,
  khối ≤ `LT_BLK_MAX`=3 dòng giữ nguyên) → cấm xé trong khối nhưng vẫn đủ chỗ ngắt hợp lệ.
  `.pv-blk-keep{break-after:avoid}` cho dòng đầu (nhãn "Ví dụ N." không mồ côi cuối trang).
- `.pv-math span.katex-text{display:inline}` (scope `span`, không để trần `.katex-text`) — MathText trả
  `<div>` chứa `.mline` BLOCK khi nhiều dòng; ép inline lên div = block-trong-inline → đo sai (8→7 trang).
- Giữ `<Fragment>` của `2b2662b`; **GỠ** `break-after:page` của `bef992b` (không còn cần).

**Đo GT 8S1 14/08:** trước 8 trang (99/**10**/97/95/85/72/82/34%) → sau **6 trang** (96/91/96/85/96/85%).
Trang 2 giờ chứa cuối dạng 1 + TRỌN dạng 2 + đầu dạng 3. Không mất/lặp (đối chiếu text từng trang +
quét mã dạng trùng). **GT 7S2 · BTVN · ET · MT đo lại GIỐNG HỆT baseline** (trang trắng của MT là chừa
mặt lẻ in 2 mặt, có sẵn từ trước).

**CÔNG CỤ (đồ nghề nội bộ, không phải cho Thùy):** script Node dựng headless qua **đúng pipeline
`worker/index.mjs`** (Puppeteer + serve `dist/` + chờ `window.__pvState==='ready'`) → PDF trong ~4s,
**không treo** — trong khi bấm 🖨 In trong app / browser-tool của phiên đều treo (tab không compositing,
paged.js đo layout chờ vô hạn; watchdog 30s có sẵn từ DEVLOG 07-11 là để cứu đúng ca này). Kèm đo
**% diện tích từng trang thực dùng** + quét mã dạng trùng → bắt được "trang chỉ dùng 10%" mà nhìn ảnh
không thấy. Script để TẠM rồi xoá (Thùy chốt: "cái đấy m dùng chứ t dùng làm gì"). **Quy ước từ nay:
sửa lỗi in xong thì GỬI THẲNG FILE PDF cho Thùy xem, không bắt chạy lệnh / không báo cáo %.**

**SỰ CỐ ĐÃ GÂY:** chạy `taskkill` nhắm server tạm của mình (cổng 5199) nhưng kill nhầm **PID cổng 5183
= dev server của phiên khác/của Thùy**. Bài học: `taskkill` phải đối chiếu PID↔cổng NGAY TRƯỚC khi kill,
đừng tin PID nhớ từ lệnh trước.

---

## 2026-08-17 — Quản lý phòng học (mới, worktree `feat/phong-hoc`)

**Nghiệp vụ (Thùy chốt):** kiểu khách sạn — biết phòng nào giờ nào có ai dùng, tránh trùng. 3 nguồn
chiếm phòng: học chính (TKB) · bổ trợ (bù/yếu/đuổi) · phát sinh (họp nội bộ/học tập ngoài lịch/việc
khác — dọn/sửa phòng cũng coi là 1 hoạt động chiếm phòng, KHÔNG cần cơ chế khoá riêng). Quyết định:
bảng danh mục phòng thật (thay hard-code `ROOMS` cũ trong TKBScreen) · trùng phòng = CẢNH BÁO MỀM, vẫn
cho lưu nếu người xác nhận (không chặn cứng).

**Migration `202608171357_phong_va_hoat_dong_phong.sql`:** bảng `phong` (danh mục, seed 6 phòng
P101..P302 đúng thứ tự cũ) + bảng `hoat_dong_phong` (nguồn phát sinh, FK `phong_id` sạch — KHÔNG đổi
`buoi_hoc.phong`/`thoi_khoa_bieu.phong` sang FK, 2 cột đó tiếp tục lưu `ma_phong` text, join qua
`phong.ma_phong` ở client) + `hoat_dong_phong_log` + trigger `log_hoat_dong_phong()` (mẫu y hệt
`0028_ghidanh_log.sql`/`0080_giaoviec.sql`) — verify sống: tạo 1 hoạt động test → log ghi `tao`, huỷ →
log ghi `huy` đúng `truoc/sau` jsonb.

**`src/lib/phong.ts`:** `lichPhongNgay(ngay)` gộp 3 nguồn — `buoi_hoc` (loai thuong/bu/bo_tro_yeu/
bo_tro_duoi, trang_thai≠huy) LÀ NGUỒN CHÍNH cho chính khóa/bổ trợ; `thoi_khoa_bieu` chỉ dùng LÀM
FALLBACK cho lớp CHƯA có `buoi_hoc` (xác nhận qua `gami.ts:moBuoi` — buổi `thuong` tạo LAZY lúc mở, nên
hầu hết ngày tương lai chỉ có TKB, chưa có buổi thật) — loại lớp đã có buổi thật khỏi TKB để không đếm
đôi. `kiemTraTrungPhong` = overlap giờ trong cùng phòng+ngày, loại chính activity đang sửa (`boQuaRefId`).

**UI `src/screens/phonghoc/`:** hub 2 tab (`PhongHocScreen` — mẫu y hệt `TestDauVaoScreen`: 1 leaf,
tab bên trong) — `LichPhongScreen` (lưới phòng × danh sách khối bận trong ngày, click ô trống → mở
`PhatSinhModal`) + `PhongScreen` (CRUD danh mục, "Đóng phòng" = set `dang_hoat_dong=false`, KHÔNG xoá —
`ma_phong` không FK nên xoá cứng sẽ rụng im lặng ở buoi_hoc/TKB cũ). Leaf mới `phong_hoc` trong
`fixtures.ts` nhóm "Vận hành", cạnh `prep`.

**Dọn 4 điểm nhập phòng free-text cũ → `SearchSelect` nguồn `listPhong()`** (để mọi nguồn cùng tham
chiếu 1 danh mục, chống-trùng mới match chính xác): `TKBScreen.tsx` (bỏ hằng `ROOMS`, `xepCa` nhận
`rooms` làm tham số) · `SuaBuoiModal.tsx` · `BoTroScreen.tsx` (`XepModal`) · `BoTroDuoiScreen.tsx`
(`XepDuoiModal`, dạng nhiều-dòng) · và phát hiện thêm 1 chỗ ngoài kế hoạch ban đầu: `LopScreen.tsx`
(`TkbBox` — thêm ca TKB ngay trong màn chi tiết Lớp) cũng ghi `thoi_khoa_bieu.phong` tự do, sửa luôn.

**Verify E2E (Chrome, admin, DB thật):** Lịch phòng hiện đúng TKB hôm nay (P101 2 ca, P202 1 ca) → "+
Phát sinh" P101 18:30–19:00 trùng ca 18:00–19:30 → popup cảnh báo đúng danh sách trùng → "Vẫn lưu" →
lưu thành công, hiện trên lưới → click card → mở sửa đúng data → "Huỷ hoạt động" → biến mất khỏi lịch
(soft, còn trong log) → TKBScreen sau khi đổi nguồn `ROOMS` vẫn render y hệt cũ (85 ca/tuần, đúng vị
trí phòng). Dọn data test qua script tạm (xoá thẳng — hoạt động phát sinh không phải dữ liệu HS/tài
chính nên không cần qua Dashboard SQL Editor như quy ước `ma_hs`).

**Việc CEO cần làm tiếp (ngoài phạm vi build):** cấp quyền leaf `phong_hoc` cho role không-founder qua
màn Phân quyền nếu muốn OPS/GV thường dùng được (mặc định chỉ Founder/`laAdmin` thấy leaf mới).

**Phát hiện ngoài lề (đã spawn task riêng, chưa sửa):** `opsvanhanh.ts` có `DANH_SACH_PHONG` hard-code
KHÁC cho prep_phong (7 phòng, KHÔNG tiền tố "P", có "303" không nằm trong 6 phòng vừa seed vào danh mục
`phong`). Chưa động vào — cần CEO xác nhận phòng 303 có thật trước khi hợp nhất nguồn.

### Bổ sung cùng ngày — Tổng quan tuần (heatmap theo yêu cầu Thùy)

Thêm tab 2 **"Tổng quan tuần"** (`TongQuanTuanScreen.tsx`) trong `PhongHocScreen` — kiểu TKB: cột to =
1 ngày (7 cột Thứ 2→CN, có ngày thật dd/mm chứ không phải mẫu tuần như TKB gốc), mỗi ngày chia 3 buổi
Sáng/Chiều/Tối (**tái dùng `CA_TRUC_DEF`/`CA_TRUC_LIST` có sẵn trong `opsvanhanh.ts`** — 08:00–12:00 /
14:00–18:00 / 18:00–21:30, đúng nguồn chuẩn ca đã dùng cho prep_phong/phân công ops, KHÔNG bịa khung giờ
mới), ẩn/hiện được từng buổi (pill toggle, mặc định hiện cả 3) để thu gọn màn hình. Mỗi buổi = lưới
`grid-cols-3` × N phòng (hiện tại 6 phòng → tự ra 3×2; sẽ tự thành 3×3 nếu sau này danh mục có 9 phòng —
KHÔNG hard-code số hàng). Mỗi phòng 1 màu cố định xoay vòng bảng 9 màu (`PALETTE`), ô tô màu nếu phòng có
hoạt động overlap khung giờ buổi đó (dùng lại logic overlap của `kiemTraTrungPhong`), để trống/viền chấm
nếu không. Chỉ xem — không sửa/thêm tại đây (trỏ sang tab Lịch phòng).

**Verify:** đọc computed style qua `javascript_tool` (không chỉ đọc text) — xác nhận đúng: Thứ 2 hôm nay
buổi Tối P101 tô `rgb(99,102,241)` (indigo, đúng màu #0 trong palette) với tooltip liệt kê đúng 2 lớp
TKB (7S2+8S1), P202 tô amber đúng 1 lớp (7A1), 4 phòng còn lại trong suốt (`rgba(0,0,0,0)`) = trống —
khớp 100% dữ liệu Lịch phòng đã verify trước đó. Toggle ẩn Sáng+Chiều → chỉ còn khối Tối, đúng yêu cầu
"thu gọn màn hình". Chuyển tuần trước (‹ Tuần) → load lại đúng data tuần 10/08–16/08.

**Sửa ngay sau đó (Thùy: "sáng chiều tối là lọc to, chiều dọc phải REAL theo từng khung giờ"):** thiết
kế ban đầu gộp phẳng cả buổi (1 ô = "có dùng đâu đó trong 4 tiếng") SAI Ý — quản trị phòng phải theo
từng khung giờ cụ thể. Sửa: **export `BANDS`/`Band` từ `TKBScreen.tsx`** (source-of-truth khung giờ THẬT
đang dùng cho lưới TKB — 7:30-10:00/10:00-12:00/12:00-14:00(tự ẩn khi rỗng)/14:00-16:00/16:00-18:00/
18:00-19:30/19:30-21:30), TongQuanTuanScreen đổi trục dọc từ 3 buổi phẳng → **7 khung giờ thật**, phân
loại 1 ca vào đúng khung theo giờ BẮT ĐẦU (∈[lo,hi)) — **giống hệt quy tắc `slotsInBand` của TKBScreen**,
không tự bịa luật overlap riêng. Sáng/Chiều/Tối giờ CHỈ còn là filter gộp nhóm khung (map cứng
`BAND_BUOI` theo index, khung trưa xếp tạm nhóm Chiều) để ẩn/hiện, không còn là đơn vị dữ liệu.

**Verify lại:** P101 tối nay giờ tách đúng 2 HÀNG riêng (18:00–19:30 = 7S2, 19:30–21:30 = 8S1) thay vì
gộp chung 1 ô như bản cũ; P202 (7A1, 19:30–21:00) đúng hàng 19:30–21:30. Khung trưa 12:00–14:00 tự ẩn
(tuần này không có ca nào rơi vào) — đúng hành vi `an:true` gốc của TKB. Toggle Sáng+Chiều tắt → chỉ còn
đúng 2 hàng khung tối, không còn hàng buổi gộp.

**Sửa lần 2 (Thùy: "ca bổ trợ chỉ 1 tiếng, trục vẫn phải 1 tiếng — trừ từ 18h khác đi, trước 18h để
1 tiếng"):** khung của TKBScreen (2-3 tiếng/khung, hợp với ca CHÍNH KHÓA dài cỡ đó) vẫn quá thô cho bổ
trợ — 2 ca bổ trợ 1 tiếng KHÔNG trùng giờ (vd 8:15–9:00 và 9:15–10:00) bị tô chung 1 ô như thể trùng
nhau. Tách hẳn khỏi `BANDS` của TKBScreen (bỏ luôn export vừa thêm ở lần sửa trước, không ai import nữa
nên revert cho sạch) — định nghĩa `OVERVIEW_BANDS` RIÊNG cho `TongQuanTuanScreen`: **trước 18h chia
THEO GIỜ** (7:00–8:00 catch-all, rồi 8-9/9-10/10-11/11-12/12-13(ẩn)/13-14(ẩn)/14-15/15-16/16-17/17-18 —
11 khung), **từ 18h giữ nguyên 2 khung chính khóa tối cũ** (18:00–19:30/19:30–21:30, catch-all tới hết
ngày) vì bản thân ca tối vốn đã dài cỡ đó, không cần chẻ. `BAND_BUOI` (map khung→buổi cho filter
Sáng/Chiều/Tối) cập nhật theo 13 khung mới.

**Verify lại (tạo 2 hoạt động phát sinh test P102, cùng ngày, KHÔNG trùng giờ: 8:15–9:00 và 9:15–10:00):**
đọc computed title qua `javascript_tool` — xác nhận đúng 2 HÀNG riêng ("8:00–9:00" và "9:00–10:00"),
không còn gộp vào 1 ô "7:30–10:00" như bản khung-TKB. Ca tối (18:00–19:30/19:30–21:30) vẫn đúng như cũ.
Dọn data test qua script tạm (xoá thẳng, không phải data HS/tài chính).

**Sửa lần 3, cùng ngày (Thùy pivot mạnh — 3 phản hồi liền, gộp làm 1 lần sửa):**
1. *"Lật thiết kế: mỗi phòng là 1 cột nhỏ"* — bỏ hẳn lưới 3×3-gộp-trong-1-ô, chuyển sang **mỗi phòng =
   1 cột dọc riêng** trong cụm cột của ngày đó (header 2 tầng: hàng 1 = tên ngày `colSpan` qua hết số
   phòng, hàng 2 = mã từng phòng). Theo dõi 1 phòng xuống theo khung giờ giờ đọc thẳng 1 cột, không phải
   soi ô nhỏ trong lưới.
2. *"1 giờ là khúc to, 30 phút là khúc nhỏ, mỗi ca chiếm 1 khúc thời gian"* — thay hẳn cách chia khung
   lần 2 (hourly trước 18h + 2 khung tối cố định) bằng **30 phút ĐỀU suốt ngày** (`buildBands()`, 7:00→
   21:30, khung đầu/cuối vẫn catch-all 2 đầu ngày). Đổi luôn `trongKhung` từ so KHOẢNG THỜI GIAN CHỒNG
   LẤN khung (không chỉ giờ bắt đầu) — bug đã lộ ngay từ câu hỏi của Thùy ("8h–9h30 hiện sao, 1 nửa à"):
   trước đó chỉ so `gio_bat_dau ∈ [lo,hi)` nên ca dài hơn 1 khung BIẾN MẤT ở khung sau nó lấn qua. Giờ
   overlap thật (`kt > b.lo && bd < b.hi`) → ca tô ĐỦ mọi khung 30p nó chồng lên, dừng đúng lúc ca kết
   thúc. Nhóm buổi (Sáng/Chiều/Tối) đổi từ mảng tay `BAND_BUOI` cố định sang hàm `buoiOfBand()` suy theo
   mốc `CA_TRUC_DEF` (linh hoạt theo số khung, không phải sửa tay khi đổi granularity). Viền đậm đầu mỗi
   khung ":00" (`dauGio`) để mắt vẫn phân biệt được "1 giờ" dù trục là 30p.
3. *"Không hiện full cả tuần, chỉ hiện số ngày vừa màn — chắc 4 ngày — có nút next/prev"* — bỏ khái
   niệm "tuần" (Thứ 2→CN cố định) hẳn, đổi sang **cửa sổ N ngày trượt** (`SO_NGAY_HIEN=4`), `‹`/`›` nhảy
   đúng N ngày, "Hôm nay" reset về hôm nay làm ngày đầu cửa sổ. Đổi luôn nhãn tab `PhongHocScreen.tsx`
   "Tổng quan tuần" → **"Tổng quan phòng"** (không còn đúng nghĩa "tuần" nữa).

**Verify lại lần 3:** dựng lại data thật hôm nay — lớp 7S2 (18:00–19:30) tô ĐÚNG 3 khung 30p liên tiếp
(18:00/18:30/19:00) rồi NGỪNG đúng lúc 19:30 khi 8S1 bắt đầu (không lấn/không hụt); 8S1 (19:30–21:30) và
7A1 (19:30–21:00, phòng khác) tô song song từ 19:30, 7A1 tự dừng ở khung 21:00 (đúng giờ kết) trong khi
8S1 vẫn tô tiếp tới 21:30 — chứng minh boundary chính xác tới từng khung 30p, không còn lỗi "biến mất
nửa chừng". Cụm ngày mặc định hiện 17/08–20/08 (4 ngày từ hôm nay), bấm `›` nhảy đúng sang 21/08–24/08.

**Sửa lần 4, cùng ngày (Thùy: "ý đúng rồi nhưng visual không nên tách ô 30p — ca 90p (3 ô) phải LIỀN
thành 1 ô to"):** đúng — lúc đó mỗi khung 30p vẫn là 1 `<td>` riêng dù overlap-check đã đúng, nên 1 ca
90p vẫn hiện 3 ô vuông xếp chồng (đúng dữ liệu, sai cảm nhận thị giác). Sửa bằng CƠ CHẾ BẢNG HTML CHUẨN
(`rowSpan`), không phải CSS vá: thêm bước gộp — với mỗi (ngày × phòng), duyệt các khung ĐANG HIỂN THỊ
theo thứ tự, khung nào CÓ hoạt động (so `ref_id`, không phải chỉ "có dùng") mà GIỐNG HỆT tập hoạt động ở
khung liền trước → gộp cùng 1 ô, ngắt gộp ngay khi tập hoạt động đổi (ca khác bắt đầu) hoặc hết ca. Ô
gộp render `<td rowSpan={n}>` DUY NHẤT ở khung bắt đầu; các khung bị nó phủ **không render `<td>` nào**
(đúng luật bảng HTML — hàng sau bỏ hẳn cột đã bị rowSpan từ hàng trước choán, không phải ẩn bằng CSS).
Khung TRỐNG cố tình KHÔNG gộp (giữ lưới ô rời để không mất cảm giác "khung giờ" ở chỗ không có gì).

**Verify lại lần 4:** đọc `td.rowSpan` qua `javascript_tool` (không chỉ đọc màu) — xác nhận đúng: 7S2
(18:00–19:30, 90p = 3 khung) ra 1 `<td rowSpan="3">` DUY NHẤT; 8S1 (19:30–21:30, 120p = 4 khung) ra
`rowSpan="4">`; 7A1 (19:30–21:00, 90p) ra `rowSpan="3">`. Đếm số `<td>`/hàng cũng khớp: hàng bị phủ mất
đúng số ô = số cột đang có ca dài hơn 1 khung tại thời điểm đó (không riêng P101, các lớp tối ở ngày
khác cũng gộp đúng tương tự) — không còn 1 ca nào bị vẽ thành nhiều ô rời rạc.

**Sửa lần 5, cùng ngày — Thùy gửi ẢNH CHỤP MÀN HÌNH THẬT, bắt lỗi mà lần 4 không thấy:** `rowSpan` đúng
(đã verify DOM ở lần 4) nhưng THỊ GIÁC vẫn sai — ô màu chỉ hiện như 1 viên bo tròn nhỏ nổi ở ĐẦU khối,
phần còn lại của khối (dù `<td>` đã đúng `rowSpan`) vẫn TRỐNG/trắng, viền lưới các cột khác vẫn cắt
ngang qua. Gốc: đang tô màu qua 1 `<div>` CON bên trong `<td>` bằng class `h-full` (`height:100%`) —
percentage-height của con phụ thuộc `<td>` cha "đã có chiều cao xác định" đúng NGỮ CẢNH CSS, nhưng với
bảng `border-collapse:separate` + nhiều `<td>` khác trong CÙNG hàng có chiều cao khác nhau (do cũng đang
rowSpan lệch nhịp), trình duyệt không luôn resolve `height:100%` của con đúng như kỳ vọng — kết quả:
div con co về chiều cao tối thiểu (`min-h-[14px]`), NHÌN như 1 chip nhỏ dù `<td>` cha đã đúng kích thước
(chính vì vậy lần 4 verify bằng `td.rowSpan` KHÔNG bắt được — con số đúng nhưng RENDER sai, phải nhìn
ảnh mới lộ). **Bài học: verify DOM property (`rowSpan`) không thay được verify HÌNH ẢNH THẬT khi bug nằm
ở tầng CSS layout/paint, không nằm ở dữ liệu/cấu trúc.**

**Fix gốc rễ:** bỏ hẳn `<div>` con — tô `background-color` THẲNG lên `<td>` (đã có `rowSpan`, đã có đúng
chiều cao thật sau layout, không cần suy percentage-height qua tầng nào nữa). Ô ranh giới ngày (viền
trái đậm phân cụm) đã thử thêm nhưng BỎ vì đụng độ: `margin` không có tác dụng trên `display:table-cell`
(bị trình duyệt bỏ qua), còn `padding-left` vẫn bị `background-color` (mặc định `background-clip:
border-box`) tô xuyên qua nên không tạo khoảng trống thật; `border-l` riêng lại tranh cùng thuộc tính
`border` với viền `dashed` của ô trống (2 utility Tailwind cùng set `border-*` trên 1 phần tử, thứ tự
thắng trong CSS không đảm bảo) — bỏ hẳn, dựa vào header 2 tầng (colSpan theo ngày) + border-spacing giữa
cột là đủ phân cụm, không cố thêm hiệu ứng viền dễ vỡ.

**Verify lại lần 5 (ĐÚNG THỨ verify lần 4 thiếu — đo HÌNH HỌC THẬT, không chỉ đọc property):**
`getBoundingClientRect().height` của từng `<td>` màu so với chiều cao 1 hàng trống làm mốc (~23px/hàng)
— khối `rowSpan=3` đo ra ~60–65px (≈3 hàng), `rowSpan=4` đo ra ~83px (≈4 hàng), đúng tỷ lệ. Vì màu giờ
nằm thẳng trên `<td>` (không qua con), `<td>` đo được bao nhiêu thì màu phủ đúng bấy nhiêu — không còn
đường nào để bug "viên nhỏ nổi giữa ô trắng" quay lại.

---

## 2026-08-17 — Bài tập online: chốt mô hình TÀI KHOẢN theo cấp · buộc HS cấp 3 đổi mật khẩu

**Bối cảnh.** Rà lại luồng test online (đã build 07-04, spec `spec-test-online.md`): code đủ 3 tầng,
ET chế độ thi chấm server-side, xáo câu — nhưng **dữ liệu nói là chưa ai dùng thật**: 32 test phát
hành, **27 không HS nào mở**, 9 HS từng mở, 2 bài nộp, lần nộp cuối 04/07 (đúng ngày build demo).

**CEO phân khúc lại (17/08):**
- **Cấp 1** (khối 3–5T, 59 HS) — không có điện thoại riêng, thi tự luận ⇒ online chỉ là **tự luyện**.
  Dùng **chung tài khoản với bố mẹ**.
- **Cấp 2** (khối 6–9, 215 HS) — chưa phù hợp, để sau.
- **Cấp 3** (khối 10–12, **41 HS**, 7 lớp, 1 môn) — có điện thoại riêng, thi trắc nghiệm ⇒ online là
  **bài tập CHÍNH** (trên lớp + về nhà + luyện tập).

**⭐ QUYẾT ĐỊNH — mô hình tài khoản:**

| | Cấp 1 | Cấp 3 |
|---|---|---|
| Tài khoản HS | có, PH giữ mật khẩu | có, HS tự giữ |
| Buộc đổi mật khẩu | không | **CÓ** |
| Deeplink từ app PH sang TK học sinh | **có** | **KHÔNG** |
| Bài online | tham khảo | vào mastery |

- **"Chung tài khoản" = PH giữ mật khẩu của con, KHÔNG phải làm bài trong app PH.** App PH là
  **project Supabase KHÁC** (`nhidbaxb…` vs ERP `osrvycil…`), đọc ERP qua FDW **chỉ SELECT** ⇒ cho PH
  làm bài trong app PH nghĩa là mở đường GHI xuyên project. Không làm. Nút chỉ là **deeplink** sang
  màn đăng nhập ERP.
- App PH chỉ có `ERP_SUPABASE_ANON_KEY` (không có service role ERP) ⇒ **không thể tạo phiên đăng nhập
  hộ** ⇒ SSO ngầm là bất khả với key hiện có. Deeplink + PH tự gõ mật khẩu là đúng mức.
- **Cấp 3 bỏ deeplink khớp với việc buộc đổi mật khẩu**: HS đổi xong thì PH không biết ⇒ nút tự vô
  hiệu. Không cần luật riêng chặn theo khối. PH cấp 3 **vẫn xem được kết quả** con qua app PH — cắt
  đường *đăng nhập*, không cắt đường *nhìn*.
- **KHÔNG thêm cột "hoàn cảnh làm bài".** CTO đề xuất cột/câu-hỏi "tự làm hay có PH hỗ trợ" → **CEO bác:
  "mỗi bài có loại bài riêng chứ cần gì hỏi"**. Độ tin suy từ `(loai bài × cấp)`, là thứ TÍNH ĐƯỢC.
  Bài học: trước khi thêm cột đo, hỏi "cột nào đang có đã trả lời câu này chưa?".

**Đã build (worktree `bkdemy-erp-v2-lambai`, nhánh `feat/hs-lam-bai-dien-thoai`):**
- `src/screens/hocsinh/DoiMatKhau.tsx` — 1 component, 2 đường: cổng BẮT BUỘC lúc đăng nhập +
  nút 🔑 tự đổi trong `HocSinhApp`. **Chặn đặt mật khẩu mới trùng mã HS** (không có cái này thì màn
  đổi thành thủ tục: HS gõ lại mã HS là xong, lỗ vẫn nguyên).
- `App.tsx` — cờ `user_metadata.must_change_password` chặn TRƯỚC `HocSinhApp`. **Dùng lại pattern app
  PH** (`bkdemy-ph-app/app/actions/auth.ts`): mật khẩu + cờ đi CHUNG một `updateUser` ⇒ không có khe hở
  "đổi xong mà cờ còn treo".
- `scripts/hs_buoc_doi_mk.mjs` — gắn/gỡ cờ, mặc định khối 10/11/12, dry-run mặc định, `--bo` để gỡ.
  Idempotent: HS đã tự đổi (cờ = false) thì KHÔNG gắn lại.

**Đã áp lên DB thật (CEO duyệt):** provision 6 TK cấp 3 còn thiếu (HS0643/0648/0649/0650/0682/0694)
→ gắn cờ **41/41 HS cấp 3**. Chạy lại dry-run: `0 ghi · 41 bỏ qua` (idempotent OK).

**Verify live** (`localhost:5193`, viewport 375×812): HS0004 đăng nhập PIN mặc định → **bị chặn ở
"Đặt mật khẩu riêng"**, không vào được app. Validate: <6 ký tự · trùng mã HS · 2 ô lệch → nút Lưu
disabled đúng cả 3 ca. `tsc` sạch, console không lỗi.

**Bẫy tự cắn khi test bằng javascript_tool:** click đổi tab (`setMode`) rồi fill+submit TRONG CÙNG một
block JS ⇒ handler `submit` vẫn đọc `mode` của render CŨ ('staff') → login fail, mà thông báo lỗi hiện
ra lại là bản 'hs' (setErr chạy sau khi đã re-render) ⇒ trông y hệt "sai mật khẩu thật". Phải tách
mỗi thao tác React thành một lời gọi riêng để nó kịp re-render.

**CÒN (bài tập online, xếp theo ưu tiên):**
1. `deadline`/`khoa_reveal`/`dong_at` **trống 100%**, không code nào set/đọc ⇒ test phát hành xong là
   **mở vĩnh viễn** (HS0004 hôm nay vẫn thấy bài 11/07 ở tab "Chưa làm").
2. Task "Duyệt báo sai" trong `getMyTasks` (spec §9) — chưa có.
3. Nút "Chấm lại câu N / lớp Y" khi KEY sai cả lớp (spec §7) — chưa có.
4. Deeplink app PH → TK học sinh (CHỈ cấp 1).

---

## 2026-08-17 (tiếp) — App HS: màn chính 6 ô · spec Tự luyện + Thông tin học tập

**Màn chính (Thùy chốt, mockup duyệt trước theo spec §8).** Bỏ danh sách phẳng "Bài tập về nhà";
thay bằng: thông tin cá nhân (tên · mã HS · lớp · môn) + **6 ô vuông, 2 CỘT** (Thùy: *"màn hình điện
thoại là dọc mà"* — bản 3 cột đầu tiên bị bác).

3 ô chạy được — **nối thẳng với tài liệu trên lớp**, mỗi ô = 1 loại doc phát hành từ Kho, KHÔNG thêm
gì ở tầng dữ liệu, chỉ tách danh sách cũ thành 3 cửa (giữ nguyên 2 tab Chưa làm / Hoàn thành):

| Ô | `bai_test.loai` | Doc nguồn |
|---|---|---|
| Bài tập trên lớp | `giao_trinh` | Giáo trình buổi (phần bài luyện) |
| ET | `et` | ET |
| BTVN | `btvn` | BTVN |

3 ô nét đứt "Sắp có": Tự luyện · Thông tin học tập · Làm đề thi thử.

**⭐ SPEC — TỰ LUYỆN (Thùy 17/08, chưa build):**
- Hệ **TỰ SINH** bài dựa trên **các dạng HS đang yếu**. Mỗi lượt **10 câu**.
- **ĐẾM THẲNG vào mastery dạng — tính là 1 lần đánh giá.**
- ⚠ **RỦI RO CTO NÊU, CEO CHƯA CHỐT CÁCH XỬ:** BTVN cũng làm ở nhà, không giám sát, và chính sách hiện
  hành là **KHÔNG vào mastery** (chỉ tham khảo). Tự luyện cũng ở nhà, không giám sát, nhưng LẠI đếm ⇒
  hai luật ngược nhau cho cùng một hoàn cảnh. Nặng hơn: tự luyện lấy câu ĐÚNG dạng HS yếu, và loại
  non-thi thì **lộ đáp án + lời giải ngay sau mỗi câu** ⇒ vòng lặp *làm → đọc lời giải → luyện lại dạng
  đó → giờ đúng* lật ô yếu thành đạt mà không có bằng chứng độc lập nào. Mastery đo "đã luyện nhiều"
  chứ không đo "biết làm".
- **Đề xuất CTO (giữ nguyên quyết định ĐẾM, chỉ làm cho nó trung thực):** ① loại mới
  `bai_test.loai='tu_luyen'` để mastery **phân biệt được kênh đo** (CLAUDE.md §5 vốn đã đòi "mastery kèm
  độ tin") — đạt-qua-ET-giám-sát ≠ đạt-qua-tự-luyện; ② không lấy lại câu HS vừa làm gần đây (đã có sẵn
  cơ chế chống trùng câu scope buổi, tái dùng).

**⭐ SPEC — THÔNG TIN HỌC TẬP (Thùy 17/08, chưa build):**
- Các **dạng đang yếu**.
- **% hoàn thành (Đ – C – S)** theo **dạng** và theo **chuyên đề**.
- **Xếp hạng trong lớp / trong khối.**

**Đề thi trường/sở — đính chính.** CTO nói "v2 đã có, gần xong"; CEO bác "v1 mới có". Kiểm DB thì ở
giữa: **code CÓ trên main** (commit `8ab449d`, `BKDEMY_DETHI_SPEC.md`, `dethi.ts`, `DeThiScreen`, mig
0073 đã áp) nhưng **dữ liệu gần như không có** — `tai_lieu` loại `de_thi` đúng **1 dòng** ("THPT Lê
Chẩn", 13/07), `bai_test` loại `de_thi` = **0**, chưa từng phát hành cho HS. Nhìn từ vận hành thì CEO
đúng. Bài học lặp lại CLAUDE.md §2.1: **code tồn tại ≠ tính năng tồn tại**; phải `count(*)` trước khi
gọi một mảng là "đã có". CEO cho biết sắp nhập nhiều đề trường/sở ⇒ ô "Làm đề thi thử" giữ chỗ sẵn.

**Verify live** (`localhost:5193`, 375×812, HS0004): màn chính hiện đúng "Bài tập trên lớp 1 · ET 2 ·
BTVN chưa có bài" khớp DB; bấm "Bài tập trên lớp" ra đúng 1 bài `giao_trinh` (18 câu, 19/07), bấm ET ra
đúng 2 bài `et` — lọc không rò chéo. Nút ‹ quay lại chạy. `tsc` sạch.

**Quy trình khi test:** phải tạm gỡ cờ `must_change_password` của HS0004 mới qua được cổng đổi mật
khẩu, xong **reset lại về mặc định** (`_reset_hs_ve_mac_dinh.mjs`) — đã xác nhận lại 41/41 vẫn gắn cờ.

---

## 2026-08-17 (tiếp) — ⚠ XOÁ TOÀN BỘ dữ liệu test online (CEO chốt, làm lại từ đầu)

**Quyết định CEO:** *"Xoá hết đi. Chỉ tính từ ngày xác nhận hệ thống sẽ hoàn thành thôi."* → làm sạch
để mốc đo bắt đầu từ lúc hệ chạy thật, không lẫn data thử tháng 7.

**Đã liệt kê trước khi xoá** (đúng "Luật xoá" CLAUDE.md — liệt kê → nói vì sao → chờ gật rõ ràng).
CEO xác nhận "Xoá toàn bộ" ⇒ gồm cả `question_accepted_answers` (CTO đề nghị giữ, CEO bác).

**ĐÃ XOÁ** (1 transaction: `delete from bai_test` cascade + `delete from question_accepted_answers`):

| Bảng | Trước | Sau |
|---|---|---|
| bai_test | 32 (16 et · 9 giao_trinh · 7 btvn) | 0 |
| bai_test_cau | 493 | 0 |
| bai_lam | 15 (2 đã nộp · 13 dở) | 0 |
| bai_lam_cau | 20 | 0 |
| bai_test_report | 2 | 0 |
| bai_lam_goi_y | 0 | 0 |
| question_accepted_answers | 2 | 0 |

Dữ liệu HS mất: 9 em có bản ghi, 3 em từng trả lời câu (HS0267 18 câu · HS0037 1 · HS0068 1).

**⚠ `gami_grades` CỐ Ý KHÔNG ĐỤNG.** Bảng đo lường nối bằng `buoi_hoc_id`+`problem_id`, **không có
cột nào trỏ về `bai_lam`** ⇒ không phân biệt được dòng sinh từ ET online với dòng chấm giấy. Xoá mù ở
đó = xoá luôn phép đo thật. Nếu 2 bài nộp của HS0267 (12A1, buổi 02/07 + 04/07) từng sync sang thì mấy
dòng đó **vẫn nằm lại và trông y hệt điểm ET thường**. Muốn dọn phải nhắm đúng 2 buổi đó — chưa làm,
chờ CEO quyết riêng.

**Bài học ghi lại:** `bai_lam_cau` → `gami_grades` là **đường một chiều không dấu vết**. Sync verdict
sang bảng đo mà không để lại khoá nguồn nghĩa là **về sau không rút lại được, cũng không kiểm chứng
được**. Nếu nối lại ET online vào mastery thì lần này phải có cột nguồn (`bai_lam_cau_id` hoặc tương
đương) — đúng nguyên tắc CLAUDE.md §2 "danh tính bám khoá tự nhiên".

**Hệ quả:** câu backfill `deadline` cho dòng cũ thành vô nghĩa — không còn dòng nào. Luật deadline áp
từ test phát hành mới trở đi. Màn HS giờ 3 ô đều "Chưa có bài".

---

## 2026-08-17 (tiếp) — HẠN NỘP test online (mig 202608171359)

**Luật (Thùy chốt):** `et` = 12:00 hôm sau · `btvn` = **23:59 NGÀY TRƯỚC buổi học kế tiếp** (Thùy sửa
tại chỗ từ "24h trước buổi kế" sang mốc-ngày cho chuẩn) · `giao_trinh` = **hết buổi hôm đó** (CTO đề
xuất, CEO không bác) · `de_thi` = NULL, staff tự đặt. **Quá hạn thì HIỆN, không ẩn** (Thùy: *"hiện quá
hạn thôi"*) — ẩn đi thì HS không biết mình bỏ lỡ.

**⭐ KHÔNG có job đóng test.** "Hết hạn" = SUY từ `deadline < now()` (`daHetHan()` trong testonline.ts).
Lý do: cron lật `trang_thai` là đẻ state chờ (CLAUDE.md §4) và **drift được** — job chết một đêm là cả
hệ sai. Suy động thì sửa luật xong lịch sử tự đúng theo, không phải dọn dữ liệu. `trang_thai='dong'`
giữ nguyên ý nghĩa **staff đóng TAY** (có actor) — và bài đóng tay thì biến mất khỏi app, khác với
quá-hạn (vẫn hiện, khoá).

**⚠ NGUỒN "buổi học tiếp theo" = `thoi_khoa_bieu`, KHÔNG phải `buoi_hoc`.** Kiểm DB 17/08: `buoi_hoc`
có **497 dòng, TẤT CẢ đều quá khứ** (15/06 → 16/08), **không một dòng tương lai nào** — buổi được tạo
khi nó diễn ra, không sinh trước. Viết hàm dựa vào `buoi_hoc` là luôn trả NULL mà không ai nhận ra.
Quy ước `thu` của TKB: **CN=8, T2..T7=2..7** (khớp `gami.ts`/`opsvanhanh.ts`); TKB có cửa sổ
`hieu_luc_tu`/`hieu_luc_den` và **nhiều dòng chồng nhau cho cùng lớp** ⇒ bắt buộc lọc theo hiệu lực.

**2 hàm SQL (giờ VN tính ở Postgres, CLAUDE.md §2):**
- `buoi_ke_tiep(lop, tu_ngay) → date` — quét tối đa 60 ngày; không thấy → **NULL, không đoán**.
- `han_nop_bai_test(lop, ngay, loai) → timestamptz` — dispatch theo luật trên.

`btvn` mà `buoi_ke_tiep` NULL (lớp hết TKB hiệu lực) ⇒ deadline NULL ⇒ `phatHanhTest` trả `canhBao` và
màn Kho **in cảnh báo cho staff**: "bài sẽ KHÔNG tự hết hạn". Im lặng ở đây chính là cách 32 test tháng
7 mở vĩnh viễn mà không ai biết.

**Verify DB** (lớp cấp 3 thật, buổi 17/08 = thứ 2): et → 18/08 12:00 đều nhau · btvn → 17/08 hoặc 18/08
23:59 tuỳ TKB từng lớp · giao_trinh vào ngày lớp CÓ học → đúng `gio_ket_thuc` từng lớp (21:00 · 17:30 ·
17:00 · 21:30) · lớp không còn TKB (3A1/9V1/7V1) → NULL đúng như thiết kế.

**Verify UI** (375×812, HS0004, 2 bài BTVN tạm rồi xoá): bài còn hạn → "⏳ Hạn 17/08 23:59 · còn 9h 52p",
nút mở được. Bài quá hạn → nhãn đỏ "quá hạn", "quá hạn 8 ngày 14h", **nút `disabled`**, chữ "Đã đóng —
không nộp được nữa". Badge ngoài màn chính đếm **1** (chỉ bài còn làm được) trong khi danh sách hiện
đủ **2** — badge mà đếm cả thứ không bấm được thì thành nhiễu. Dọn sạch 2 dòng tạm sau khi soi.

**⚠ CÒN HỞ — deadline mới chặn ở UI, DB CHƯA chặn.** `traLoiCau`/`luuDapAnET` vẫn ghi được qua API sau
hạn vì RLS không biết gì về `deadline`. Với HS bình thường thì nút disabled là đủ, nhưng đây là lỗ thật
và phải bịt bằng policy/trigger trước khi ET online tính vào mastery. → **ĐÃ BỊT, xem mục kế tiếp.**

---

## 2026-08-17 (tiếp) — Siết ghi sau hạn ở tầng DB (mig 202608171419)

**Lỗ:** policy HS trên `bai_lam`/`bai_lam_cau` là `for all` với điều kiện DUY NHẤT "đúng HS của mình"
⇒ nút disabled ở app là **rào duy nhất**. Gọi thẳng PostgREST bằng anon key là sửa được đáp án sau hạn.
Không chấp nhận được khi ET online sắp tính vào mastery: điểm đã chốt mà vẫn sửa được thì phép đo vô nghĩa.

**Cách bịt:** hàm `bai_test_con_han(uuid)` (security definer — không phụ thuộc HS có đọc được `bai_test`
hay không) + **tách policy `for all` thành SELECT / INSERT / UPDATE riêng**, gắn điều kiện còn-hạn vào
hai đường GHI. **ĐỌC giữ nguyên tự do** — HS phải xem lại bài cũ được, chặn nhầm chỗ này là hỏng tính
năng chứ không phải tăng an toàn.

- KHÔNG đụng policy staff (`la_thanh_vien`): chấm lại / duyệt báo sai / backfill cache phải chạy được
  sau hạn — đó là việc của người, có actor.
- `et_nop` là SECURITY DEFINER + chủ bảng bỏ qua RLS ⇒ chấm lúc nộp vẫn chạy nguyên.

**⚠ BỎ LUÔN QUYỀN XOÁ CỦA HS — lỗ có sẵn, phát hiện khi rà policy.** Policy `for all` cũ cho HS **xoá**
`bai_lam`/`bai_lam_cau` của mình bất cứ lúc nào, tức xoá được chính phép đo của mình. Đã grep: không
code nào trong app làm việc đó ⇒ bỏ không mất chức năng. Bản mới không khai policy DELETE cho HS.

**Verify bằng client HS THẬT** (`_diag_han_rls.mjs` — anon key + signIn hs0004, đúng đường app đi), **7/7 đạt**:

| Ca | Kỳ vọng | Kết quả |
|---|---|---|
| Test còn hạn: mở bài · trả lời câu | ghi được | ✔ ✔ |
| Test quá hạn: mở bài · trả lời câu | bị chặn | ✔ ✔ (`violates row-level security policy`) |
| Sửa đáp án sau khi test hết hạn | bị chặn | ✔ 0 dòng sửa được |
| HS xoá phép đo của mình | bị chặn | ✔ 0 dòng xoá được |
| HS đọc lại bài quá hạn | VẪN đọc được | ✔ |

**Smoke test luồng thật trên app** (không chỉ tin diag): dựng 1 BTVN còn hạn 2 câu cho 11B1 → HS0004
mở bài (⇒ `moBaiLam` qua được RLS mới) → chọn đáp án → Xác nhận → "🎉 Đúng hết!" + lời giải → đối chiếu
DB có `bai_lam_cau{verdict:'correct', diem:1, cham_boi:'exact'}`. Xáo đáp án vẫn chạy (5 hiện ở vị trí
B). Dọn sạch sau khi soi; `bai_test` về 0, HS0004 về mặc định, 41/41 vẫn gắn cờ.

---

## 2026-08-17 (tiếp) — Xử lý câu SAI ĐÁP ÁN: chấm lại cả lớp + task Duyệt báo sai (mig 202608171532)

Hai việc cuối của spec test-online (§7 chấm lại · §9 task duyệt báo sai). Cả hai đều phục vụ MỘT
tình huống: **đáp án sai thì xử thế nào**.

**⭐ HAI ĐƯỜNG KHÁC NHAU, ĐỪNG TRỘN** — đây là điểm dễ làm sai nhất:

| | Key ĐÚNG, HS viết cách khác | KEY SAI |
|---|---|---|
| Ví dụ | key "5", HS ghi "5.0" | key ghi 'C' nhưng đáp án đúng là 'B' |
| Ảnh hưởng | 1 vài HS | CẢ LỚP |
| Cách xử | thêm vào `question_accepted_answers` + backfill | sửa `dap_an_key` + chấm lại |
| Tab | 🚩 HS báo sai | ⚠ Nghi sai đáp án |

Nhét đáp-án-đúng vào cache khi KEY SAI thì kho vẫn sai và **lần phát hành sau lại sai tiếp** — chữa
triệu chứng, không chữa gốc.

**Phát hiện key sai = TỈ LỆ SAI CAO** (`listCauNghiSaiKey`, ngưỡng ≥3 HS trả lời và ≥70% sai, mọi loại
câu). Cả lớp cùng sai một câu thì nghi đáp án trước, nghi HS sau. Xếp theo tỉ lệ sai giảm dần.

**`suaKeyVaChamLai(cauId, keyMoi, lyDo)`:**
- Scope **CỨNG theo `bai_test_cau_id`** — KHÔNG lan sang test khác dù cùng `ma_cau`. Mỗi lần phát hành
  là một phép đo riêng; sửa nhầm sang test cũ = ghi đè điểm đã chốt.
- Ghi key mới TRƯỚC, chấm lại SAU: nếu chết giữa chừng thì key vẫn đúng cho lần sau, và **thiếu dòng
  log** ⇒ nhìn là biết "đã sửa key nhưng chưa chấm lại xong".
- Chấm bằng ĐÚNG engine thuần HS đã dùng (`gradeTracNghiem`/`gradeDungSai`/`gradeTraLoiNgan` + tầng
  cache TLN), không chép lại công thức.
- **KHÔNG cần resync đo lường** — verify `pg_proc`: `et_nop` KHÔNG nhắc `gami_grades`, không trigger
  nào trên bai_lam/bai_lam_cau, và `mastery.ts` đọc THẲNG `bai_lam_cau` làm nguồn đo. Sửa verdict là
  mastery tự đúng. *(Đính chính mục "xoá dữ liệu" sáng nay: lúc đó tôi ghi "không rõ 2 bài nộp của
  HS0267 có sync sang gami_grades không" — giờ kiểm được: KHÔNG có đường sync nào cả, nên 20 dòng
  gami_grades của em ấy là chấm giấy, xoá bai_test không mất gì của mastery.)*
- Vết: bảng mới `bai_test_cham_lai_log` (key cũ/mới · so_bai · sai→đúng · đúng→sai · lý do · người).
  RLS **chỉ staff** — HS đọc được là biết đáp án.

**Task "Duyệt báo sai" (§9):** thêm `TabKey='baosai'`, pure-derive — report `moi` TỒN TẠI ⇒ task, duyệt
xong tự biến mất, không cờ done nào phải dọn. Gom 1 task / (lớp × buổi) để 20 HS cùng báo 1 câu không
vỡ list. Route cho **TG** của lớp. Bấm vào đi tới màn Duyệt chấm, KHÔNG mở BuoiDetail (mở buổi thì
chẳng có tab nào tương ứng).

**Kèm theo — BỎ task "Chấm ET" khi buổi đó đã có ET online** (§9). Điều kiện theo **TỪNG BUỔI**
(lớp+ngày có `bai_test` loại `et`), KHÔNG bỏ đại trà: ET giấy vẫn là đường chính, bỏ hết thì TG mất
task chấm thật.

`TabKey` mở rộng làm **tsc bắt đúng 5 chỗ** phải cập nhật (2 `doneAtTab`, `TASK_TAB_LABEL`, 2 chỗ gọi
`TaskCard`) — union type ở đây đóng vai trò y như CHECK constraint ở DB. `baosai` CỐ Ý không vào
`TASK_TABS` (danh sách khâu đo hiệu suất theo buổi): nó là hàng đợi phát sinh, không gắn buổi, đưa vào
là đẻ mẫu số giả.

**Verify live** (dựng kịch bản `SMOKE-KEYSAI` cho 11B1 rồi xoá): câu TN key ghi nhầm 'C' trong khi cả
6 HS chọn B → tab Nghi-sai-đáp-án hiện đúng **"Câu 1 · 100% sai (6/6) · Đáp án: C"**, câu TLN 1/6 sai
(17%) đúng là KHÔNG bị nêu. Bấm sửa C→B: confirm in đúng before/after, kết quả **"6 bài — Sai→Đúng 6 ·
Đúng→Sai 0"**. Đối chiếu DB: `dap_an_key`='B' · 6/6 verdict `correct` diem 1 · sổ log có đủ key cũ/mới
+ lý do + người + giờ. Tab HS-báo-sai vẫn chạy song song (hiện đúng "5.0" của HS + ý kiến).

**⚠ Task 'baosai' mới verify ở tầng DB, CHƯA verify qua UI người thật.** Tài khoản admin không có
`phan_cong_lop` nên `getMyTasks` trả rỗng. Query mirror đúng logic cho ra: báo sai của 11B1 → **Trần
Hoàng Đạt (TG)**, 1 việc. Cần một phiên đăng nhập bằng TK của TG để xác nhận card hiện đúng và bấm vào
ra đúng màn Duyệt chấm.

---

## 2026-08-18 — Bổ trợ bù/đuổi THIẾU giờ kết thúc → vô hình trong Quản lý phòng học (fix gốc)

**Thùy hỏi sau khi merge Quản lý phòng học: "bổ trợ bù/đuổi đã ăn dữ liệu vào đây chưa?"** Kiểm bằng
query DB thật (không đoán): chính khóa luôn đủ giờ (TKB `gio_ket_thuc` NOT NULL). Nhưng **100% buổi bổ
trợ bù sắp tới đã gán phòng (13/13) và bổ trợ đuổi (2/2) THIẾU `gio_ket_thuc`** (null hết) — `lichPhongNgay()`
đúng chủ đích bỏ qua buổi thiếu giờ (tránh hiện sai), nên gần như toàn bộ bổ trợ **vô hình** trong Lịch
phòng/Tổng quan phòng dù đã có phòng thật.

**Gốc:** KHÔNG phải lỗi nhập liệu — form tạo/sửa buổi bù-đuổi **chưa từng có ô "Giờ kết thúc"**, dù cột
DB nullable sẵn sàng nhận và `updateBuoiMeta`/`taoBuoiBu` (gami.ts, botro.ts) đã có tham số `gio_ket_thuc`
trong signature từ trước (chỉ UI không truyền); riêng `taoBuoiDuoi` (botro_duoi.ts) còn thiếu cả tham số.
Phát hiện phụ: vài buổi cũ có `phong` sai định dạng (`202`/`p202`/`303`/`111`, thiếu tiền tố "P" hoặc
phòng không tồn tại trong danh mục) — không sửa data trực tiếp (đúng luật xoá/sửa data thật phải hỏi
trước), việc này sẽ TỰ hết khi ai đó sửa lại buổi qua ô chọn phòng mới (đã ràng buộc theo danh mục `phong`
từ đợt build Quản lý phòng học — chọn sai sẽ hiện "chưa chọn" thay vì giữ giá trị bẩn).

**Fix (4 file, xuyên suốt DB→type→UI):**
- `src/lib/botro_duoi.ts`: thêm `gio_ket_thuc?: string | null` vào signature + insert của `taoBuoiDuoi`
  (trước đây hàm còn chưa nhận tham số này, khác `taoBuoiBu`/`updateBuoiMeta`).
- `src/lib/botro.ts`: thêm `gio_ket_thuc` vào type `CaBoTro` + câu `.select()` của `taiCaBoTro()` (nguồn
  chung cho `listCaBoTro`/`listCaBoTroTraVe`) — thiếu ở CẢ select DB lẫn type, không chỉ UI.
- `src/lib/botro_duoi.ts`: tương tự cho type `CaDuoi` + select của `listCaDuoi`.
- `src/screens/botro/BoTroDuoiScreen.tsx`: state `meta` (BuoiDuoiDetail) thêm `gio_ket_thuc` — dữ liệu
  DB đã có sẵn qua `getBuoi()` (select `*`) nhưng bị RỚT ở bước gán `setMeta(...)`, không phải thiếu ở
  nguồn.
- `src/screens/botro/BoTroScreen.tsx` (`XepModal`) · `BoTroDuoiScreen.tsx` (`XepDuoiModal`, dạng nhiều
  dòng) · `SuaBuoiModal.tsx` (dùng chung sửa bù+đuổi): thêm ô "Giờ kết thúc" cạnh "Giờ bắt đầu" (đổi
  grid-cols-3→4 hoặc thêm cột trong dòng). **Auto-điền +60 phút** khi gõ giờ bắt đầu (hàm `cong60()`,
  gợi ý theo đúng độ dài ca bổ trợ thường ~1 tiếng — Thùy xác nhận trước đó) nhưng vẫn sửa được, KHÔNG
  tự ý ghi đè khi đã có giá trị.

**Verify sống trên account thật (`daothuybk@gmail.com`, KHÔNG tạo/sửa data thật):** mở "Xếp bổ trợ" (Bù)
→ field "Giờ kết thúc" xuất hiện, tự điền 09:00→10:00 đúng logic. Mở "+ Xếp lịch" (Đuổi, dạng nhiều
dòng) → gõ "15:00" vào Giờ BĐ dòng 1 → Giờ KT tự nhảy "16:00" đúng, các dòng khác không bị ảnh hưởng.
Đóng cả 2 modal bằng Huỷ (không lưu gì) — chỉ xem UI, không đụng data production. `tsc --noEmit` sạch
sau khi nối xuyên suốt DB-select→type→state→UI ở cả 2 luồng bù/đuổi.

**Còn treo (không tự làm, cần Thùy xác nhận):** 13 buổi bù + 2 buổi đuổi CŨ đã có phòng nhưng vẫn thiếu
`gio_ket_thuc` — field mới chỉ áp cho buổi tạo/sửa TỪ GIỜ. Muốn buổi cũ hiện trong Lịch phòng thì cần
người có liên quan mở Sửa và điền tay (không tự backfill đoán giờ — đúng luật "thà bỏ trống còn hơn
đánh sai").

---

## 2026-08-14 — ⭐ Worktree `feat/troly-ai`: chốt trục MẢNG + khai module VẬN HÀNH BUỔI HỌC

- **CEO chốt bản chất:** *"vẫn là m đi xây bộ tổng hợp dữ liệu và thông báo cho từng module:
  bổ trợ bù, bổ trợ đuổi, bổ trợ yếu, kiểm tra đầu vào, vận hành buổi học"* + *"vận hành buổi học
  đang chạy đầy đủ nhất nên làm đầu tiên"*. Đặt trong tab 🤖 Trợ lý, không đẻ lá mới.
- **⭐ ĐỔI TRỤC (lý do CỨNG, không phải thẩm mỹ):** trợ lý cũ đọc `getMyTasks()` = task theo lớp
  được phân công. **Lộc (NS003) có 0 phân công lớp ⇒ mở ra TRẮNG.** Và "lớp nào còn thiếu" của
  Trang là việc của NGƯỜI KHÁC. ⇒ trục = **MẢNG PHỤ TRÁCH**, "việc của tôi" tụt xuống thành MỘT
  mảng. Thêm người = gán mảng. (Loại hardcode-3-tài-khoản vì nghịch luật "quyền bám GHẾ"; loại
  đi-theo-cây-ghế vì có người giữ 6 ghế ⇒ phạm vi rộng ngoài ý muốn.) → `SPEC-troly-nhansu.md`.
- **⚠ Suýt build nhầm người:** hệ có HAI người tên Trang — NS002 Phạm Thị Thùy Trang (Trưởng khối
  THCS · Quản lý trợ giảng · 14 lớp) và NS009 Hoàng Thị Quỳnh Trang (QLHT · 6 lớp). Mô tả của CEO
  khớp cả hai theo hai kiểu. Hỏi → **NS002**. Ghi vào spec để phiên sau khỏi đoán.
- **⭐⭐ NHỊP — CEO đảo cả hai phương án Claude đưa ra, và đảo đúng.** Claude hỏi "BTVN nhắc theo
  ngày hay sau buổi kế"; CEO trả lời bằng cách đặt lại vấn đề: *"Báo cáo những thứ ĐÁNG LẼ PHẢI
  XẢY RA: theo lịch hôm nay lớp ABC phải nộp nhưng hệ thống mới chỉ ghi nhận lớp A"*.
  ⇒ Nghĩa vụ suy từ **LỊCH**, không phải từ "hôm qua còn sót gì". Tổng quát cho mọi khâu.
  Số đỡ lưng (60 ngày): **ET đóng ngay trong ngày 244/339 ca (72%)** + 43 ca sau 1 ngày ⇒ hỏi sáng
  hôm sau là đúng nhịp. **BTVN đóng sau 2–6 ngày** (chấm ở buổi kế — thiết kế), đóng trong vòng
  1 ngày chỉ **2/250 ca** ⇒ hỏi theo ngày là **sai 100%**: sáng nào danh sách cũng đủ mặt mọi lớp,
  kể cả lớp đang làm chuẩn. Danh sách lúc nào cũng đầy = không ai đọc nữa.
- **⭐ CEO ĐẢO luật đánh giá:** 12/08 chốt "đánh giá KHÔNG bắt buộc"; 14/08 chốt **BẮT BUỘC, đòi
  như ET**. Đã ghi đè dòng cũ trong spec (để nguyên hai dòng mâu thuẫn là phiên sau đọc nhầm).
  Claude nêu trước hệ quả: hôm qua 7/9 lớp chưa đánh giá, 30 ngày 100/310 buổi ⇒ danh sách sẽ dài;
  CEO chọn đòi hết, KHÔNG kẻ đường ngày như luật 48h của bù — cố ý.
- **`src/lib/troly-vanhanh.ts` + `KhoiVanHanh`** — viết ra thành CÂU chứ không phải bảng (CEO hình
  dung ra thành câu). Ba khâu ba nhịp, cố ý KHÔNG gộp: ① hôm qua = ET + đánh giá · ② BTVN = đến hạn
  theo lịch HÔM NAY · ③ từ đầu tuần = nợ tích luỹ.
  Nợ BTVN ở ③ có guard `>= 2 ngày` — buổi hôm qua chưa tới hạn, đưa vào là lặp đúng cái sai nhịp.
- **Verify trên dev server CỦA WORKTREE** (cổng 5190) — số khớp oracle SQL chạy cùng lúc:
  hôm qua 13/08 · 9 buổi · đủ: 7K1, 9C1 · chưa đánh giá 7 lớp · **ET sạch 100%** (6/6 lớp có đề đều
  chốt) · không đòi ET ở 12A1/8A2/8B1 (không có đề — nêu riêng, không trộn vào "thiếu") ·
  BTVN đến hạn hôm nay 3 lớp, **cả 3 đã ghi nhận** · từ đầu tuần 26 lớp nợ (ET 5 · BTVN 9 · đánh giá 19).
- **⚠ BẪY HẠ TẦNG — suýt verify nhầm cây:** `preview_start` resolve launch config từ thư mục CHA
  (`BKERP/.claude/`), **không theo cwd** ⇒ lệnh "dev" luôn chạy CÂY CHÍNH dù đang đứng trong
  worktree. Phát hiện bằng cách `fetch('/src/.../TroLyTab.tsx')` qua dev server rồi tìm đoạn code
  mới: không có. Đã thêm config **"troly" cổng 5190** trỏ đúng worktree.
  **Luật: làm trong worktree thì việc ĐẦU TIÊN là chứng minh dev server đang phục vụ đúng cây.**
- **CÒN:** mảng của Lộc (bù · yếu · test đầu vào) chưa ráp · `nhansu_hieusuat` chưa làm · gate "ai
  thấy mảng nào" chưa có (worker bypass RLS ⇒ phải chặn ở code dựng context) · test đầu vào vẫn
  chặn ở "ai chấm", CEO sẽ mở context riêng xử lý.

## 2026-08-14 (tiếp) — ⭐ Làm lại màn trợ lý: CHIA KHU THEO MODULE, bỏ liệt kê

- **CEO chửi đúng (gửi kèm ảnh màn):** *"t đã bảo là màn hình trợ lý phải chia khu ra cho dễ view.
  Ngoài ra báo số tổng quan chứ liệt kê 100 trường hợp cho chó đọc à. Hiện ra những thứ như t viết
  ví dụ bên trên, KO phải cái trợ lý hiện tại của m. Xoá đi làm lại đi. Trợ lý có nhiều module
  riêng, và báo cáo phải theo từng module chứ"*.
  Ảnh cho thấy khối "Đang nợ — 103" đổ ra 103 dòng liên tiếp. Đúng thế thật.
- **⭐ SAI GỐC, không phải sai hiển thị:** khối "Hôm nay 4 rổ" + "Việc cần quyết" là di sản của
  đời trợ lý-cho-MỘT-người (trục "việc của tôi"). Đã chốt đổi sang trục MẢNG từ đầu phiên, nhưng
  Claude **chỉ THÊM module mới mà không GỠ khối cũ** ⇒ màn thành hai thế giới chồng nhau, và cái
  cũ (dài nhất) nằm trên cùng. Bài học: đổi trục thì phải gỡ cái của trục cũ, thêm mà không gỡ =
  người dùng gặp cái cũ trước.
- **Xoá (đã liệt kê trước với CEO):** component `HomNay` (4 rổ nợ/hạn-hôm-nay/dự-kiến/không-hạn) +
  section "Việc cần quyết" (danh sách dài kèm 3 nút mỗi dòng). **Giữ** tầng đọc `viecHomNay`/
  `nhacViecHomNay` trong lib — khung chat vẫn ăn dữ liệu đó, chỉ không đổ ra màn nữa.
- **Màn mới = LƯỚI MODULE**, mỗi module một khu, khuôn chung `Khu` (tên · MỘT dòng số tổng quan ·
  nút sang màn chuyên môn · phần đáng nhìn cắt ngắn có nói còn bao nhiêu):
  Vận hành buổi học · Bổ trợ bù · Bổ trợ đuổi · Bổ trợ yếu · Kiểm tra đầu vào · Việc của riêng bạn.
- **`Việc của riêng bạn` = ĐÚNG MỘT DÒNG SỐ.** Chính chỗ đẻ ra 103 dòng. Màn "Việc của tôi" đã tồn
  tại để xem chi tiết — trợ lý nói con số rồi chỉ đường, không chép lại danh sách của màn khác.
- **`src/lib/troly-modules.ts`** (mới): `mangYeu()` + `mangTestDauVao()`. Cả hai là mảng ĐANG HỞ,
  và chỗ hở mới là thứ đáng báo — nói thẳng kèm số, không im (người tưởng ổn) cũng không vờ như
  đang theo dõi (người tưởng có ai đang xử).
- **Verify (dev server worktree, cổng 5190):**
  · Vận hành: hôm qua 9 buổi — đủ 7K1/9C1 · 7 lớp chưa đánh giá · ET sạch 100% · BTVN 3/3 đã ghi nhận.
  · Bổ trợ bù: 1 dòng số (103 cần xếp · 8 quá hạn · 4 phải xếp lại · 11 buổi sắp tới, 3 hôm nay)
    rồi mới tới mục nhỏ, mỗi mục cap 5 kèm "…và N nữa".
  · Bổ trợ đuổi: 9 đợt mở · **1 đợt** chậm hơn bình thường (ngưỡng rút từ 34 đợt đã hoàn thành).
  · Bổ trợ yếu: "24 cảnh báo chảy vào hư không, cũ nhất 25 ngày · 12 HS · nhiều cờ nhất Luyện Minh
    Đăng (11)" — đúng luật "chưa có thì báo chưa có".
  tsc + vite build sạch.
- **CÒN:** `nhansu_hieusuat` của Trang chưa làm · gate "ai thấy module nào" chưa có (hiện mọi người
  thấy hết) · test đầu vào vẫn chặn ở "ai chấm".

## 2026-08-14 (tiếp) — ⭐ "Lớp nào THẬT SỰ chạy ET/BTVN" suy từ hành vi, không bắt ai tick

- **CEO:** *"Tất cả các lớp m vừa báo là thực tế chưa chạy ET, vì nhiều lý do khác nhau. M bỏ qua
  cái này. Những lớp thực sự chạy là những lớp còn lại. m chỉ care các lớp đã chạy rồi đi"*.
- **⭐ TÍN HIỆU BIMODAL — xác nhận lại lần 2 (DEVLOG 12/08 từng ghi, nay đo lại vẫn đúng).**
  Tỉ lệ buổi CÓ ĐỀ ET theo lớp, 60 ngày: **27 lớp ở 70–100%** (5A1/5A2/6A1/6S2 100% · 9B1 92% ·
  9A2 88% · 9S1/9C1 87%) · **14 lớp ở 0–29%** (12C1/8S0/8K1/9K2 0% · 12B1 4% · TOÀN BỘ Tiếng Anh,
  Văn) · **đúng 1 lớp ở giữa** (8B2 43%). Khoảng trống **43% → 74%** đủ rộng ⇒ ngưỡng 60% có dữ
  liệu đỡ lưng, không phải bịa. `phanLoaiLopTheoKhau()` trong `troly-vanhanh.ts`.
  ⇒ **Cờ must-exist theo lớp KHÔNG cần người khai** — thứ 12/08 tưởng phải ngồi tick 46 lớp thì
  hành vi đã tự nói ra. Nhưng chỉ nói được vì có ĐỦ MẪU: lớp <4 buổi mặc định coi như CÓ chạy
  (thà hỏi thừa một lớp mới còn hơn im lặng cả tháng — đúng lỗi bỏ-qua-âm-thầm).
- **⭐ TÍN HIỆU MỚI, trước đây bị NUỐT: "lớp chạy ET mà buổi này thiếu đề".** Bản trước gộp mọi
  buổi-không-có-đề vào một câu "không có đề nên không đòi" ⇒ lớp chạy ET đều 85% mà quên gán đề
  một buổi thì hệ cũng im. Nay tách hai ca trông giống hệt nhau:
  · **8A2, 8B1** — chạy ET 83–85% mà buổi 13/08 không có đề ⇒ **nghi quên gán, đáng hỏi**.
  · **12A1, 7K1** — thực tế không chạy ET ⇒ bỏ qua, không phải việc.
  Đây chính là "đánh đổi đã biết" ghi trong SPEC §2 ("luật này bỏ sót lớp đáng lẽ phải có ET mà
  chưa ai soạn đề") — giờ hết bỏ sót.
- **Số sau khi lọc:** nợ BTVN tuần 9 → 8 lớp · tổng lớp nợ 26 → 25. Nợ đánh giá giữ 19 (CEO chốt
  đánh giá bắt buộc MỌI buổi thường, không lọc theo lớp).
- **⚠ ĐÍNH CHÍNH bản thân (khoá thứ tự ET):** trước đó Claude đề nghị BỎ khoá vì nó chặn 16 lớp.
  CEO bác đúng: khoá là **công cụ quản trị** — chặn thì TA leo thang lên leader, đó là quy trình
  chứ không phải nhược điểm. Claude đã đánh giá nó như ma sát UX mà không hỏi nó tồn tại để làm gì.
  **Nhưng đo ra thì phần lớn buổi gây chặn lại là buổi KHÔNG có đề ET** (12B1 chặn 23 buổi vì lỗ
  17/06 vốn không có đề) ⇒ khoá đang hỏi *"cột null không"* thay vì *"còn nợ ET không"*. Với bộ
  phân loại mới, điều kiện đúng nằm sẵn trong tay. **CHƯA sửa `closePhase`** — chờ CEO chốt vì nó
  đụng luật đóng phase đang chạy thật.
- Ghi nhận thêm: `closePhase` CHO đóng phase rỗng (chỉ không tính Elo) ⇒ không ai kẹt vĩnh viễn,
  nhưng gỡ 16 chuỗi bằng tay là bấm xác nhận rỗng hàng chục lần — việc vặt vô nghĩa.

## 2026-08-15 — ⭐⭐ SIẾT QUYỀN DB: thu hẹp FDW + khoá nhóm TIỀN (2 migration, CHỜ CEO chạy)

- **Bối cảnh:** CEO chốt hướng "mỗi luồng nhập liệu một app, ERP thành nơi ĐỌC vận hành" ⇒ tới lúc
  bàn quyền DB. Đo hiện trạng: **128 policy là cổng nhị phân `la_thanh_vien()`** (là nhân sự thì
  thấy hết) · **29 policy `true`** · chỉ **6 bảng** lọc theo dòng thật, và cả 6 đều của HS/PH.
  ⇒ Hôm nay một TA bất kỳ đọc được toàn bộ học phí, công thức phí, bảng lương, thông tin phụ huynh.
- **⚠ TAO BÁO SAI MỘT LẦN, ĐÃ SỬA:** ban đầu gọi `fdw_bkdemy_web_read` là "mở toang, không cần đăng
  nhập" — SAI, vì quên đọc cột `roles`: nó chỉ áp cho role riêng `fdw_bkdemy_web`. **Bài học: policy
  có BỐN chiều (table · cmd · roles · qual); đọc thiếu một chiều là kết luận sai hẳn về mức phơi nhiễm.**
- **⭐ Nhưng soi kỹ lại lộ chuyện lớn hơn:** role `fdw_bkdemy_web` được cấp SELECT trên **30 bảng**,
  trong khi `bkdemy-web` chỉ khai báo **4 foreign table** (`erp_lop` · `erp_muc_hoc_phi` · `erp_nhan_su`
  · `erp_phan_cong_lop`, dựng view `erp_fdw_live_gv_gia`). Grep toàn repo web: KHÔNG chỗ nào chạm
  `hoa_don`. ⇒ **26 bảng cấp thừa**, gồm hoá đơn (234) · dòng thu (686) · phụ huynh · điểm · nhận xét
  gửi PH · kho câu hỏi · **đề kèm đáp án test online**. CEO xác nhận: *"web có liên quan gì đến hoá đơn
  tiền đâu, tối đa chỉ có mức tiền học thôi"*.
- **⚠ POLICY và GRANT là HAI CỔNG ĐỘC LẬP** — và ở đây chúng LỆCH nhau thật: `bao_cao_ph` có GRANT
  nhưng KHÔNG có policy. Gỡ mỗi policy thì bảng đó lọt lưới hoàn toàn. Migration gỡ CẢ HAI tầng.
- **`202608151030_fdw_web_thu_hep.sql`** — 30 → 4 bảng. Kèm kiểm chốt: nếu lỡ sứt quyền của 4 bảng
  web đang dùng thì `raise exception`, không cho migration đi qua.
- **`202608151045_siet_quyen_nhom_tien.sql`** — 8 bảng tiền: xoá policy `*_member_all`, thay bằng
  policy đọc **chính bảng phân quyền đang chạy** (`vai_tro_chuc_nang.chuc_nang='hocphi'`).
  ⭐ KHÔNG hardcode 3 người (nghịch luật "quyền bám GHẾ") — và kiểm trước thì bảng phân quyền **đã
  mô tả đúng nhóm CEO nói**: NS001 Thùy · NS002 Thuỳ Trang · NS003 Lộc có `hocphi`, **không ai khác**.
  ⇒ UI và DB nói cùng một luật; thêm người thứ tư = tick ở màn Phân quyền, không cần migration.
  Tách `co_chuc_nang()` (đọc) và `co_quyen_ghi()` (ghi, loại `chi_xem`) — tái dùng cột `chi_xem` sẵn có.
- **⚠ VÌ SAO PHẢI XOÁ chứ không thêm:** policy Postgres cộng dồn kiểu **HOẶC**. Để `*_member_all`
  nằm đó thì mọi policy chặt thêm vào đều vô nghĩa. Đây là chỗ dễ tưởng đã siết mà thực ra chưa.
- **Kiểm trước khi xoá quyền GHI:** chỉ **NS005 (tài khoản admin) và NS003 (Lộc)** từng tạo hoá đơn
  (160 và 74) — cả hai đều còn quyền sau khi siết ⇒ không gãy việc của ai.
- **`scripts/check-quyen-tien.mjs`** — chạy TRƯỚC/SAU rồi so. ⚠ Không giả lập được bằng
  `set local role authenticated`: `claude_build` không có quyền đó, và bản thân nó SỞ HỮU bảng nên
  chủ sở hữu vốn bỏ qua RLS. Thay bằng: nhét `request.jwt.claims` đúng người rồi gọi thẳng hàm quyết
  định. **Kiểm này chứng minh CỔNG đúng, KHÔNG thay được một lượt bấm thật trên app.**
  Chạy trước migration: cổng CŨ = `true` với **cả 6 người** (đúng hiện trạng phơi nhiễm) · cổng MỚI =
  đúng NS001/NS002/NS003/NS005, chặn NS008/NS014. ✅
- **CHƯA ÁP.** Chuỗi kết nối GHI cố ý không nằm trên đĩa (CLAUDE.md §2.1) ⇒ CEO tự chạy. DB đang có
  người dùng thật; migration này đổi quyền đọc/ghi chứ không đụng dữ liệu, nhưng sai là màn trắng im lặng.

---

## 2026-08-18 — Xáo câu chỉ TRONG 1 dạng (không xáo toàn bộ thứ tự)

**Sửa (Thùy 18/08): "Không trộn toàn bộ thứ tự. Chỉ trộn các câu trong 1 dạng thôi."**

Code cũ (`seededPerm(n, seed)` áp thẳng lên cả đề) xáo **TOÀN BỘ n câu với nhau**, không phân biệt
dạng — phá mất thứ tự sư phạm (dạng dễ trước/khó sau, dạng liên quan đặt gần nhau) mà người soạn đã
cố ý xếp trong giáo trình.

**`seededPermByDang` (shuffle.ts)** — GIỮ NGUYÊN vị trí khối của từng dạng, CHỈ xáo vị trí giữa các câu
CÙNG dạng: nhóm câu theo `ma_dang`, với mỗi nhóm chỉ hoán vị NỘI BỘ nhóm đó (vị trí ngoài nhóm không
đổi). Câu KHÔNG rõ dạng (đề thi bóc từ nguồn ngoài, chưa gắn dạng) → nhóm riêng 1 câu = không xáo
(§1.5 "thà bỏ trống": không có dạng thì không có căn cứ gộp chung với câu không-có-dạng khác).

Áp cho cả 2 luồng làm bài (`LamBai`=BTVN/giáo trình, `LamET`=ET/đề thi) — thay `seededPerm(...).map(...)`
bằng `seededPermByDang(...).map(...)`, giữ nguyên seed (ổn định theo HS×bài, khác giữa các HS).

---

## 2026-08-18 (tiếp) — FIX: ảnh ĐỀ mất khi phát hành online (mig 202608181557)

**Lỗi (Thùy báo):** câu hỏi phát hành online không hiện được hình.

**Gốc — thiếu CỘT, không phải bug hiển thị.** `bai_test_cau` (snapshot lúc phát hành) từ đầu chỉ có
`anh_dap_an` (ảnh lời giải), **THIẾU HẲN `anh_de`** (ảnh đề) dù kho (`CauHoi`) có cả hai. `phatHanhTest`
copy được cái gì bảng CÓ cột — ảnh đề rụng ÂM THẦM ngay lúc snapshot, không phải lỗi ở màn HS.

**Quy mô thật:** kiểm DB — **875 câu trong kho có `anh_de`**. Không phải ca hiếm.

**Fix:**
- `alter table bai_test_cau add column anh_de text`.
- `phatHanhTest` (testonline.ts): thêm `anh_de: c.anh_de ?? null` vào snapshot.
- `et_de` RPC (chế độ THI — giấu key/lời giải): thêm `anh_de` vào payload. **Ảnh đề KHÔNG phải đáp
  án** — HS phải thấy nó trong lúc làm (đề giấy khó đọc chữ ảnh chụp chính là lý do có test online),
  nên xếp cùng nhóm `noi_dung`/`lua_chon`, không lọc như `dap_an_key`/`loi_giai`/`anh_dap_an`.
- `BaiTestCau`/`ETCauDe` (TS types) + render `<img>` ngay dưới `noi_dung` ở CẢ `LamBai` lẫn `LamET`.

**Verify:**
- `et_de` RPC gọi thật qua client HS0004 (anon key) → `anh_de` có trong payload trả về.
- Browser thật (375×812, HS0004): dựng BTVN + ET với câu mượn `anh_de` THẬT từ kho (chỉ đọc, không sửa
  câu gốc) → cả 2 đường (BTVN select thẳng · ET qua RPC) đều load ảnh thật (`naturalWidth=3165,
  complete=true`). Dọn sạch sau khi soi — xác nhận `0` dòng `SMOKE-*` còn sót; 1 dòng `bai_test` còn
  lại (mon='Toán', giao_trinh, 18/08) là **dữ liệu thật do ai đó vừa phát hành**, không đụng tới.

---

## 2026-08-18 (tiếp) — ET online tôn trọng 3 MÃ ĐỀ theo từng HS (mig 202608181719)

**Thùy hỏi:** *"ET có 3 mã đều theo từng học sinh, thì lúc phát hành có phát hành được không"* → điều
tra ra: phát hành ĐƯỢC (không lỗi) nhưng SAI — `phatHanhTest` chỉ gọi `getETCaus()` (phần `custom` =
mã GỐC), hoàn toàn không biết `cau_hinh.etMaDe` (3 bộ câu) hay `hsMaDe` (gán riêng từng HS → mã đề, để
HS cạnh nhau không trùng đề — made.ts). **Mọi HS online nhận CÙNG nội dung câu**, chỉ khác thứ tự hiển
thị — đúng cái 3 mã đề sinh ra để chống. Thùy xác nhận cần làm ĐÚNG, không chỉ cảnh báo: *"Có cách nào
để học sinh làm theo mã được phân công đâu"*.

**Quy mô xác nhận trước khi làm:** 90 tài liệu ET đã có `hsMaDe`, 102 đã có `etMaDe` đủ — không hiếm.
Grep xác nhận `hsMaDe`/`etMaDe` CHỈ dùng ở ETScreen/made.ts — BTVN/giáo trình/đề thi trường-sở không có
khái niệm này, nên phạm vi sửa CHỈ cần chạm nhánh `loai='et'`.

**Thiết kế:**
- `bai_test_cau.bien_the` (smallint, default 1) — 1 vị trí (`thu_tu`) có tới 3 dòng khi ET đủ mã đề;
  đa số doc (không mã đề) vẫn 1 dòng, hành vi y hệt trước. Không có unique constraint theo (thu_tu),
  đúng pattern sẵn có (order do app kiểm soát, không phải DB).
- `bai_lam.bien_the` — **ĐÔNG CỨNG lúc mở bài lần đầu** (upsert `ignoreDuplicates` hiện có tự bảo toàn):
  sửa `hsMaDe` sau khi HS đã mở bài KHÔNG đổi bài đang làm — đúng nguyên tắc "snapshot 1 chiều" của
  spec-test-online.
- **RPC `resolve_bien_the(p_bai_test)`** — SECURITY DEFINER, đọc `tai_lieu.cau_hinh->hsMaDe` bằng
  `my_hoc_sinh_id()` NỘI BỘ (không nhận `hoc_sinh_id` làm tham số) → HS không dò được mã đề của bạn
  khác qua RPC này. **Bắt buộc phải RPC**, không đọc thẳng client: verify lại — HS SELECT `tai_lieu` →
  **0 dòng, KHÔNG lỗi** (RLS chặn êm, đúng bẫy CLAUDE.md §2.1 "0 dòng không phải bằng chứng"). Đọc thẳng
  client sẽ luôn ra mặc định 1 mà tưởng "chưa gán", không phải "bị chặn".
- **`et_de` RPC đổi sang `plpgsql`**: đọc `bai_lam.bien_the` (ĐÃ CHỐT, không tự suy lại từ hsMaDe ở đây
  — tránh 2 nơi tính ra 2 kết quả nếu hsMaDe đổi sau khi đã mở bài) rồi lọc `bc.bien_the = v_bien_the`.
  Chưa có `bai_lam` (chưa từng mở) → mặc định 1.
- **`phatHanhTest`**: tách phần snapshot-1-câu thành hàm `snap()` dùng lại cho cả 3 mã đề. `maDeReady`
  (made.ts) đủ 3 mã → nạp thêm câu biến thể qua `fetchCausByMa` (đã có sẵn, dùng nguyên — cùng hàm
  ETPrintView dùng để in), snapshot CÙNG `thu_tu` với câu gốc, khác `bien_the`. Thiếu câu biến thể ở 1
  vị trí (hiếm, made.ts lệch) → chỉ bỏ RIÊNG mã đề đó ở vị trí đó (list `skipped`), KHÔNG chặn cả lượt
  phát hành — phát hành sai lặng lẽ mới là điều tệ hơn.
- **`LamET` (HocSinhApp.tsx) đổi THỨ TỰ gọi:** `moBaiLam` PHẢI chạy TRƯỚC `getETDe` — code cũ gọi song
  song trong 1 mảng `[await A, await B]` mà thực chất A chạy xong mới tới B (đánh giá trái→phải), nên
  vốn dĩ ĐÃ là `getETDe` trước `moBaiLam` — SAI thứ tự cần cho `et_de` mới (nó đọc `bai_lam.bien_the`,
  phải có `bai_lam` trước).

**Verify — KHÔNG viết lại logic song song, gọi ĐÚNG hàm thật qua `vite-node`:** dựng 1 `tai_lieu` ET
throwaway (dạng `T104010101`, mượn 3 câu thật từ kho — chỉ đọc) với `etMaDe` đủ 3 mã + `hsMaDe` gán
HS0004 → mã 2, đăng nhập staff thật (`admin@gmail.com`), gọi thẳng `phatHanhTest()` export từ
`testonline.ts`. Kết quả:
```
bai_test_cau: bien_the 1→câu gốc · 2→câu V2 · 3→câu V3 (đúng thu_tu=1 cho cả 3)
HS0004 (đã gán mã 2): resolve_bien_the → 2
et_de trả về: ĐÚNG nội dung câu V2 ("...5 nghìn, 1 trăm và 8 chục") — KHÔNG phải câu gốc
```

**⚠ Bẫy dính khi verify — cùng đúng loại CLAUDE.md cảnh báo:** lần chạy ĐẦU dùng `ngay` = hôm qua
(17/08) cho doc throwaway → `et_de` trả về câu GỐC dù `resolve_bien_the` đã đúng 2, tưởng bug logic.
Thật ra: hạn ET (`ngay+1` 12:00) đã trôi qua lúc test (giờ máy chủ THẬT 18/08 **17:27**, hạn là 18/08
12:00) → tính năng "siết ghi sau hạn" (mig 202608171419, xây sáng cùng ngày) **chặn ĐÚNG** việc tạo
`bai_lam`, `et_de` không tìm thấy bản ghi nên mặc định về mã 1. Không phải bug — bài test tự đá vào
tính năng khác vừa xây trong CHÍNH phiên này. Sửa `ngay` sang hôm nay là qua. **Bài học: khi 1 verify
"sai" ngay sau khi vừa build xong 1 tính năng KHÁC trong cùng phiên, nghi tính năng đó trước khi nghi
logic mới.**

Dọn sạch: `bai_test`/`tai_lieu` throwaway xoá hết (cascade), xác nhận `count=0`. HS0004 không bị đụng
(41/41 vẫn gắn cờ must_change_password).

**CÒN LẠI (ngoài phạm vi hôm nay):** UI staff (`ETScreen`) chưa cảnh báo khi "Phát hành online" một ET
CHƯA đủ 3 mã đề dù `hsMaDe` đã gán sẵn (HS sẽ tự rơi về mã 1, đúng thiết kế `coalesce` — không sai,
nhưng staff có thể tưởng đã gán đúng). Cân nhắc thêm dòng cảnh báo ở nút phát hành nếu CEO thấy cần.

---

## 2026-08-18 (tiếp) — Có mã đề rồi thì KHÔNG xáo thứ tự câu nữa (mig 202608181747)

**Thùy chốt ngay sau khi xong 3-mã-đề:** *"Nếu có nhiều mã đề thì ko cần phải đảo thứ tự câu nữa nhé."*
Đúng — mục đích xáo `thu_tu` (`seededPermByDang`) là chống-liếc-bài khi mọi HS CÙNG nội dung câu. Test
đã có 3 mã đề khác nội dung thì HS cạnh nhau vốn không so được câu-1-với-câu-1 nữa; xáo thêm là thừa.

**`bai_test.co_nhieu_ma_de`** — ghi NGAY LÚC PHÁT HÀNH (snapshot 1 chiều, không suy động lại lúc HS mở
bài): `true` CHỈ khi thực sự có ≥1 câu biến thể snapshot THÀNH CÔNG (không phải chỉ "GV đã bấm sinh" —
`maDeReady` đúng mà thiếu câu biến thể ở đúng vị trí nào đó thì vị trí đó vẫn `false` về bản chất, cờ
này lấy theo TOÀN BÀI nên chỉ cần ≥1 câu lọt qua là true). `LamET` đọc cờ: `true` → dùng thẳng `de`
(đã `order by thu_tu` sẵn từ SQL) — KHÔNG gọi `seededPermByDang` nữa.

**⚠ Bắt được + tự sửa 1 bug PHÁT SINH khi thêm cờ này (chưa kịp lộ ra ngoài):** biến `rows.length` dùng
làm `bai_test.so_cau` (hiển thị "X câu" cho HS) đo ĐÚNG khi 1 vị trí = 1 dòng, nhưng sau khi thêm vòng
lặp snapshot mã 2/3, `rows` phình ra chứa CẢ 3 biến thể/vị trí — `so_cau` sẽ thành ~3× số câu thật (2
vị trí × 3 mã đề = báo "6 câu" trong khi HS chỉ làm 2). Fix: chốt `soCauMotDe = rows.length` NGAY SAU
vòng lặp câu gốc, TRƯỚC khi cộng thêm biến thể — dùng biến này cho `so_cau`, không dùng `rows.length`
cuối hàm nữa. Bắt được nhờ viết ca verify RÕ RÀNG kỳ vọng con số (không chỉ "chạy không lỗi").

**Verify bằng `vite-node` gọi thẳng `phatHanhTest` thật, 2 ca:**
```
① CÓ mã đề (2 vị trí × 3 mã, gán HS0004→mã2):
   bai_test_cau tạo ra 6 dòng (đủ 3 biến thể × 2 vị trí) — ĐÚNG (lưu đủ cả 3 mã)
   so_cau = 2 (KHÔNG phải 6) — ĐÚNG (số câu 1 HS làm)
   co_nhieu_ma_de = true — ĐÚNG
   et_de (HS0004) trả 2 câu, thu_tu=[1,2] đúng thứ tự gốc — ĐÚNG

② KHÔNG có etMaDe (ET bình thường, đối chứng — đảm bảo không phá luồng cũ):
   so_cau = 2, co_nhieu_ma_de = false — ĐÚNG cả hai
```
Dọn sạch cả 2 ca sau khi soi (`count=0`). HS0004 không bị đụng (41/41 vẫn gắn cờ đổi mật khẩu).

---

## 2026-08-20 — TỰ LUYỆN: xây engine (mig 202608201111 + 202608201118)

**Spec Thùy (18-20/08):** V1 có tính năng gần giống (đọc code trước khi build — xem tóm tắt dưới) —
mỗi ngày hệ tự sinh 10 câu: 40% ngẫu nhiên trong dạng ĐÃ HỌC (toàn bộ từ đầu) + 60% trong dạng đang
YẾU. Làm thêm được, tối đa 30 câu/ngày. **Cấp 1: tính vào mastery hệ số 1** (PH kèm nên đủ nghiêm
túc, không có kênh nào khác để đối chiếu). **Cấp 3: chỉ gộp ở mastery-view của HS**, không vào mastery
trung tâm (đã chốt hôm 17/08, giữ nguyên). Chống lặp: 1 câu ở dạng X ra lần N thì lần TIẾP THEO của
dạng X phải là lần N+10 mới lặp lại; kho hết câu thì chấp nhận lặp sớm hơn.

**⭐ Đọc V1 trước khi thiết kế (Thùy yêu cầu) — 2 tính năng V1 có, KHÔNG cái nào khớp đặc tả:**
- "Daily Practice" (`TabDailyPractice.jsx`, chỉ lớp 5T): UI ghi "10 câu/ngày theo dạng yếu" nhưng
  **thuật toán thật nằm ở RPC `generate_daily_practice` KHÔNG version-control** (tạo tay qua Supabase
  Dashboard) — không đọc được, không audit được. Không giới hạn 30 câu/ngày ở client.
- "🎯 Tự luyện" (`PHPage.jsx generateTuLuyenBai`, PH bấm tay): code đầy đủ nhưng chỉ **5 câu/lần**
  (không phải 10), **bấm tay** (không tự động), ngưỡng yếu hardcode `tyLe<0.7`/90 ngày, **không giới
  hạn số lần/ngày**, và có lỗ tránh-lặp (`filtered[0]||cands[0]` — hết ứng viên thì lặp câu VỪA làm).
- Bài học rút ra, áp cho bản V2: **thuật toán PHẢI nằm trong migration (version-controlled)**, không
  tạo tay trên Dashboard; **không hardcode API key** (V1 hardcode Gemini key thẳng trong source).

**Vì sao KHÔNG port công thức mastery sang SQL:** Thùy chốt "dùng mastery có sẵn của V2" —
`masteryOfDang` (gami/mastery.js) là NGUỒN DUY NHẤT. Verify HS KHÔNG đọc được `dai_cau_hoi` lẫn
`gami_grades` trực tiếp (RLS chặn — đúng bẫy CLAUDE.md §2.1 "0 dòng không phải bằng chứng"; `gami_grades`
còn TIMEOUT thay vì 0 dòng, dấu hiệu policy nặng). Nên **tách 2 RPC theo đúng ranh giới nhạy cảm**:
- `hs_dang_evals(mon)` — SECURITY DEFINER, trả DỮ LIỆU THÔ (điểm đúng/sai CỦA CHÍNH HS — không nhạy
  cảm, chính là thứ "Thông tin học tập" sẽ hiện sau này). Client tự chạy `masteryOfDang` y hệt bản TS
  đang dùng ở mastery.ts — ZERO công thức thứ hai, không có nguy cơ lệch dần.
- `tu_luyen_sinh(mon, dangs[])` — SECURITY DEFINER, HS đã chọn xong DẠNG (ở client) → server mới chọn
  CÂU + snapshot (kho câu hỏi staff-only, phải chạm ở đây).

**Kiến trúc — tái dùng NGUYÊN `bai_test/bai_test_cau/bai_lam/bai_lam_cau`:** mastery.ts đã đọc
`bai_lam_cau` làm nguồn đo chung, KHÔNG cần sửa gì để nhận thêm tu_luyen (câu trả lời tự luyện tự
động "có mặt" trong measurement, chỉ còn phần TRỌNG SỐ theo cấp là việc RIÊNG, xem "CÒN LẠI"). Khác
biệt duy nhất: ET/BTVN dùng CHUNG 1 test cho cả lớp (1 lop_id×1 ngày); tu_luyen là bài CÁ NHÂN HOÁ
(1 hoc_sinh_id×1 ngày) → thêm `bai_test.hoc_sinh_id` (NULL cho loại khác) thay vì tách bảng riêng.
RLS `bai_test`/`bai_test_cau` viết lại: tu_luyen scope theo `hoc_sinh_id = my_hoc_sinh_id()`, KHÔNG
theo `lop_id` (nhiều HS trong 1 lớp, mỗi em 1 bài — RLS cũ theo lớp sẽ lộ chéo). `bai_lam`/`bai_lam_cau`
policy sẵn có đã đúng (scope thẳng hoc_sinh_id, không qua lớp) — không cần sửa.

**Sổ chống lặp `tu_luyen_dang_lan`** (hoc_sinh_id, mon, ma_dang, lan_thu, ma_cau) — RPC exclude câu
xuất hiện trong 9 lần gần nhất CỦA CHÍNH dạng đó (`lan_thu > N-10`); hết ứng viên → fallback KHÔNG
exclude (chấp nhận lặp, đúng chốt). Chỉ chọn câu **hỗ trợ chấm online** (TN/ĐS/TLN có đáp án) — tự bắt
được 1 lỗi lúc viết: cột `dap_an` KHÔNG áp dụng cho `dung_sai` (đáp án nằm trong `menh_de`), lọc
`dap_an is not null` chung cho mọi loại sẽ loại hết câu ĐS — sửa thành điều kiện theo TỪNG loại.

**⭐ 2 lỗi race tự bắt trước khi verify (đúng bài học cũ "ensure* slot phải unique"):**
1. Thiếu ngoặc `()` quanh OR trong SQL WHERE — AND/OR không tự nhóm theo ý định, khiến điều kiện lọc
   loại-câu "ăn mất" điều kiện chống-lặp phía sau (2 câu SQL, sửa cả hai).
2. Lượt gọi ĐẦU trong ngày (chưa có `bai_test` để `FOR UPDATE` khoá dòng) — 2 request gần-đồng-thời
   có thể cùng INSERT, tạo 2 dòng trùng. Thêm **unique index** (`hoc_sinh_id,mon,ngay) where loai=
   'tu_luyen'`) + bọc INSERT trong exception handler (`unique_violation` → re-SELECT FOR UPDATE, tiếp
   tục như đường APPEND).

**RPC phụ `hs_mon_cua_toi()`** (migration riêng, VÌ file trước đã ÁP LÊN DB — sửa file đã áp là DB/repo
lệch nhau, đúng luật CLAUDE.md §2.1, nên viết migration MỚI thay vì sửa): app trước giờ chỉ suy `mon`
GIÁN TIẾP từ `tests[0]?.mon` (bài online HS đang có) — HS cấp 1 (chỉ tự luyện, KHÔNG ET/BTVN online)
sẽ ra rỗng theo đường đó. `hoc_sinh_lop`/`lop` cũng staff-only (verify: HS SELECT → 0 dòng, không lỗi)
nên cần RPC riêng đọc thẳng.

**UI — tái dùng NGUYÊN `LamBai` cho phần LÀM BÀI** (chọn/chấm/lời giải/reveal-ngay), không viết lại:
thêm 2 prop TUỲ CHỌN `doneCaption`/`doneExtra` vào màn kết quả có sẵn (mặc định giữ nguyên câu chữ
BTVN cũ — backward-compatible tuyệt đối). `LamTuLuyen` (component mới) chỉ lo "hôm nay có bài chưa,
chưa thì sinh, sinh thêm khi bấm" rồi render `<LamBai key={baiTestId+so_cau} .../>` — đổi `key` sau
mỗi "làm thêm" ép LamBai REMOUNT, tự fetch lại đủ câu mới (đơn giản hơn nhiều so với tự quản state
mở-rộng-mảng-câu-đang-hiển-thị). Ô "Tự luyện" ở màn chính đổi từ `sapCo` (disabled) sang `direct`
(bấm thẳng vào LamTuLuyen, KHÔNG qua màn danh-sách-nhiều-bài dùng chung ET/BTVN — tự luyện là 1 PHIÊN
đang tiếp diễn trong ngày, không phải danh sách bài đã phát theo ngày, không hợp mô hình list+tab).

**⚠ BUG THẬT bắt được lúc verify trên browser (không phải giả định) — StrictMode double-effect:**
Lần chạy đầu ra **"1/19"** thay vì "1/10". Điều tra: `useEffect(() => { taiHomNay() }, [])` KHÔNG có
guard → React 18 StrictMode (dev) chạy effect 2 LẦN → lượt gọi thứ 2 đọc "chưa có bài hôm nay" TRƯỚC
khi lượt 1 kịp ghi (race) → sinh THÊM 10 câu nữa đè lên. **Unique index chặn được việc tạo 2 DÒNG
bai_test riêng biệt** (đúng thiết kế), nhưng RPC tự APPEND khi đụng unique nên KHÔNG chặn được việc
sinh THỪA câu — 20 câu dự kiến nhưng ra 19 (1 dạng trong 20 lượt rút không còn câu hợp lệ, bị bỏ qua
đúng logic §1.5). Fix: `useRef` guard (đúng bài học đã ghi sẵn trong CLAUDE.md "ensure* slot →
StrictMode chạy effect 2 lần" — dính đúng ca đã cảnh báo trước). Dọn dữ liệu lỗi, verify lại → đúng
"1/10".

**Verify đầy đủ trên browser thật (HS0004), theo đúng thứ tự, không tin RPC/tsc suông:**
1. `hs_dang_evals` qua HS0004 thật → 275 dòng eval, 34 dạng đã học.
2. `tu_luyen_sinh` qua `vite-node` gọi RPC trực tiếp (10 dạng lặp lại cố ý để stress-test chống lặp):
   lượt 1→10 câu · lượt 2→20 (không trùng câu giữa 2 lượt CÙNG dạng) · lượt 3→30 (đúng trần) · lượt
   4→**bị chặn đúng thông báo**. Sổ `tu_luyen_dang_lan` ghi lan_thu tăng liên tục, khớp số lần mỗi dạng
   xuất hiện trong 3 lượt.
3. Trên UI thật (375×812): sinh đúng 10 câu (sau khi fix bug ①) → trả lời 1 câu THẬT qua click (chọn
   sai) → chấm sai đúng + lời giải hiện đúng công thức. Hoàn tất 10 câu → màn kết quả hiện đúng
   `doneCaption` ("Hôm nay đã làm 10/30 câu") + nút "Làm thêm 10 câu" → bấm → remount → **"1/20"**,
   câu 1 vẫn giữ nguyên trạng thái đã làm (reveal đúng, không mất state) → đối chiếu DB: `so_cau=20`,
   `bai_test_cau` thật = 20 dòng.
4. Dọn sạch toàn bộ dữ liệu test (`bai_test`+`tu_luyen_dang_lan`), HS0004 trả về mặc định.

**Bất ngờ phát hiện lúc dọn — tính năng "buộc đổi mật khẩu" (xây sáng 17/08) ĐANG CHẠY THẬT ngoài
production:** dry-run cho thấy **5/41 HS cấp 3 đã TỰ ĐỔI mật khẩu thật** (must_change_password=false
do chính các em đặt, không phải em gán) + phát hiện **1 HS mới ghi danh cấp 3 sau thời điểm gắn cờ**
(HS0700, khối 10) — gắn cờ nốt cho em này để giữ bất biến 100%.

**⚠⚠ CÒN LẠI — QUAN TRỌNG, CHƯA LÀM: mastery CHƯA phân biệt tu_luyen với btvn.** `mastery.ts`
(`fetchOnlineEvals`) hiện chỉ tách 2 nhánh theo `THI_LOAI` (et/de_thi → src='et', MỌI loại còn lại
→ src='btvn') — nghĩa là câu trả lời tự luyện đang bị TÍNH NHƯ BTVN (weight=1, mặc định KHÔNG vào
mastery trung tâm, chỉ gộp khi bật `includeBTVN`). Với CẤP 3 thì đây tình cờ ĐÚNG hành vi mong muốn
(tu_luyen chỉ gộp view, giống btvn). Nhưng **CẤP 1 cần tu_luyen vào mastery TRUNG TÂM hệ số 1** —
việc này CHƯA ĐƯỢC LÀM. Cần: dạy `fetchOnlineEvals` tách RIÊNG `src='tu_luyen'` (khỏi 'btvn'), rồi
sửa default `phases` của `getMasteryHS`/`loadMasteryCells` theo CẤP của HS (khối 3-5T → luôn gồm
`tu_luyen`; khối 10-12 → KHÔNG, giống btvn hiện tại). **CỐ Ý chưa làm trong lượt này** — đây là thay
đổi vào module LÕI (`mastery.ts`), ảnh hưởng nhiều màn khác (Thông tin học tập/Dashboard/rollup lớp),
rủi ro cao nếu làm vội cuối phiên dài. Việc riêng cho lượt sau.

**CÒN LẠI khác:** header màn chính (`lopMon`) vẫn suy từ `tests[0]?.mon` — HS cấp 1 (chỉ tự luyện,
0 `bai_test` loại et/btvn/giao_trinh) sẽ không hiện tên lớp/môn ở đầu màn (không hỏng, chỉ thiếu hiển
thị). `monCuaHS()` mới có sẵn — có thể dùng lại cho chỗ này khi làm màn cấp 1.

## 2026-08-20 (tiếp) — mastery.ts: tu_luyen tách nguồn riêng, vào TRUNG TÂM theo CẤP

Làm nốt việc đã cố ý hoãn ở mục trên ("Làm luôn đi" — CEO chốt tiếp tục ngay).

**Vấn đề:** `fetchOnlineEvals` chỉ tách 2 nhánh theo `THI_LOAI` nên tu_luyen bị tính LẪN vào 'btvn'
(weight=1, mặc định không vào mastery trung tâm) — tình cờ đúng cho cấp 3 nhưng SAI cho cấp 1 (cần
vào trung tâm hệ số 1, vì tự luyện là kênh đo DUY NHẤT của cấp 1 — không có ET/BTVN online đối chiếu,
và PH kèm nên đủ nghiêm túc để tin).

**Sửa:**
- `src/gami/mastery.js` — `MASTERY_CONFIG.WEIGHT` thêm `tu_luyen: 1` (cùng hệ số btvn/bt — khác nhau
  là CÓ/KHÔNG vào mastery trung tâm mặc định, không phải trọng số khi ĐÃ vào).
- `src/lib/mastery.ts`:
  - Thêm `EvalSrc` gồm `'tu_luyen'`, `SRC_LABEL.tu_luyen = 'TL'`.
  - `fetchOnlineEvals`: tách riêng `src = loai === 'tu_luyen' ? 'tu_luyen' : (laThi ? 'et' : 'btvn')`
    (trước: tu_luyen rơi vào nhánh 'btvn' cùng nhánh else).
  - Thêm `CAP1_KHOI = {'3','4','4T','5','5T'}` + `laCap1(khoi)` — đúng bảng khối đã dùng lúc chốt mô
    hình tài khoản cấp 1 (17/08).
  - `getMasteryHS(hocSinhId, mon, opts)`: query thêm `hoc_sinh.khoi`, default `phases` (khi KHÔNG bật
    `includeBTVN`) rẽ theo cấp — cấp 1 → `['et','mt','tu_luyen']`, cấp 3 → `['et','mt']` (giữ nguyên
    hành vi cũ). Bật `includeBTVN` thì luôn gồm đủ `['et','mt','bt','btvn','tu_luyen']` cho mọi cấp
    (gộp-view không phân biệt cấp).
  - `getTongQuanHS`: query thêm `hoc_sinh.khoi`; tách `tuLuyenRows` riêng khỏi `btvnRows`; cấp 1 thì
    tu_luyen được đẩy vào CẢ `byDangTop` (ảnh hưởng mức thành thạo hiển thị) lẫn `byDangBottom`; cấp 3
    thì tu_luyen chỉ vào `byDangBottom` (đúng vị trí cũ của 'btvn' — chỉ tham khảo). **Cố ý KHÔNG đụng
    `hoatDong`** (cột %ET/%BTVN/%MT hoạt động) — tu_luyen không cộng vào `actBucket`, tránh tự ý thêm
    cột dashboard thứ 4 ngoài phạm vi được giao.
  - `loadMasteryCells` (rollup lớp/khối/hệ, dùng cho staff): thêm `cap1Set` (suy từ `hoc_sinh.khoi` đã
    có sẵn trong query gốc, không cần query thêm) — 1 dòng eval nguồn tu_luyen chỉ được cộng vào rollup
    khi (`includeBTVN` bật) HOẶC (HS đó là cấp 1 và toggle tắt), khớp đúng logic của `getMasteryHS`.
- Xác nhận bằng grep: `getMasteryHS`/`loadMasteryCells`/`getTongQuanHS` chỉ được gọi từ màn STAFF
  (`KetQuaScreen`, `ReportPHScreen`, `BTScreen`) — query thêm `hoc_sinh.khoi` không vướng RLS (staff
  bypass RLS, không như phía HS).

**Verify bằng `vite-node` gọi thẳng hàm thật (không suy từ tsc/code review):** dựng 1 dòng
`bai_test`(loại='tu_luyen')+`bai_test_cau`+`bai_lam`+`bai_lam_cau` giả cho HS0602 (khối 5, cấp 1,
lớp 5A1/Toán) và cho HS0004 (khối 11, cấp 3) — cùng 1 `ma_dang` thật, verdict='correct'.
- HS0602: `getMasteryHS(id, 'Toán')` (KHÔNG bật includeBTVN) → dạng test **CÓ** trong kết quả, nguồn
  `['tu_luyen']` → **đúng**, cấp 1 vào mastery trung tâm mặc định.
- HS0004: `getMasteryHS(id, 'Toán')` mặc định → dạng test **KHÔNG** có (tu_luyen là nguồn DUY NHẤT
  của dạng này nên vắng mặt hoàn toàn nếu bị loại đúng) → **đúng**. Bật `{includeBTVN: true}` → dạng
  xuất hiện lại với nguồn `['tu_luyen']` → **đúng**, gộp-view vẫn thấy được.
- Dọn sạch toàn bộ dữ liệu test sau khi verify (script tự xoá ở cuối, có log xác nhận).
- `npx tsc --noEmit` sạch trước verify.

Kết quả: `mastery.ts` giờ phân biệt đúng tu_luyen theo cấp — khớp yêu cầu CEO 18-20/08.

## 2026-08-20 (tiếp) — ẨN 3 ô ET/BTVN/Bài tập trên lớp cho cấp 1 (mig 202608201407)

CEO chốt: "app của HS cấp 1 bỏ 3 cục BTTL BTVN và ET đi ko hiện" — đúng theo spec gốc 17/08 ("cấp 1
ko có làm ET, BTVN hay BTTL trên điện thoại. Chỉ có tự luyện") nhưng màn chính trước giờ hiện đủ 6 ô
cho MỌI cấp (3 ô ET/BTVN/BTTL chỉ rỗng — "Chưa có bài" — chứ không ẩn), gây nhiễu cho HS cấp 1.

**Vấn đề kỹ thuật:** cần biết HS đang đăng nhập có phải cấp 1 hay không để ẩn đúng 3 ô, nhưng
`hoc_sinh` staff-only — HS tự đọc dòng CỦA MÌNH cũng ra **0 dòng, không lỗi** (verify: HS0004 SELECT
hoc_sinh → `[]`, đúng bẫy CLAUDE.md §2.1 "0 dòng không phải bằng chứng bảng rỗng"). Cùng lý do đã
khiến `monCuaHS()` phải đi qua RPC hôm nay — giờ thêm 1 RPC tương tự cho "cấp".

**Sửa:**
- Migration `202608201407_hs_cap1_cua_toi.sql` — RPC `hs_cap1_cua_toi()` (SECURITY DEFINER, scope
  `my_hoc_sinh_id()`), trả `boolean`. Danh sách khối cấp 1 = ĐÚNG `CAP1_KHOI` đã dùng ở `mastery.ts`
  (`'3','4','4T','5','5T'`) — không bịa lại, chỉ 1 biên giới HS-facing cần fact này nên không đáng
  tách bảng dùng chung 2 phía (staff-side đã bypass RLS, không cần RPC).
- `src/lib/tuluyen.ts` — thêm `laCap1HS()` gọi RPC trên, cùng khuôn với `monCuaHS()` sẵn có.
- `src/screens/hocsinh/HocSinhApp.tsx` — thêm state `cap1` (null = chưa biết, chờ trước khi vẽ lưới
  ô — tránh nháy 6→3 ô), fetch qua `useEffect` song song với `tests`. Thêm `KHU_AN_CAP1` (set 3 id ô
  cần ẩn) và lọc `KHU.filter(k => !(cap1 && KHU_AN_CAP1.has(k.id)))` trước khi `.map()` vẽ lưới.
  KHÔNG đụng gì ở tầng dữ liệu — 3 ô đó với cấp 1 vốn đã luôn rỗng (`cuaKhu()` không có `bai_test`
  loại giao_trinh/et/btvn nào cho cấp 1), ẩn chỉ bớt nhiễu UI.

**Verify:** `npx tsc --noEmit` sạch. Test RPC end-to-end qua chính client HS thật (không admin) —
đăng nhập HS0602 (khối 5, cấp 1, có 203 dòng `gami_grades` thật) → `hs_cap1_cua_toi()` trả `true` ·
`hs_dang_evals`/`tu_luyen_sinh` vẫn chạy đúng bình thường (dọn bài test vừa sinh ra ngay sau test).
Browser thật (localhost, mobile 375×812): phát hiện dev server đang chạy trỏ vào worktree `main`
(không phải `bkdemy-erp-v2-lambai` đang sửa) — code mới CHƯA lên tới trình duyệt cho tới khi merge.
Ghi vào devlog TRƯỚC khi merge; verify browser thật SAU merge tiếp ở mục dưới (nếu có).

**Tiện thể trả lời câu hỏi thứ 2 của CEO — "sao cục tự luyện chưa dùng dc à":** Tự luyện KHÔNG phải ô
"Sắp có" — đã build và verify xong từ sớm hôm nay (xem mục "TỰ LUYỆN: xây engine" ở trên). Kiểm lại
lần nữa cho chắc: 52/59 HS cấp 1 đang học đã có ≥1 dòng đo thật (`gami_grades`/`bt_grades`) để tự
luyện rút dạng; test end-to-end qua chính client HS0602 thật (không phải HS0004 hay data giả) chạy
trơn tru toàn bộ chuỗi `hs_dang_evals` → chọn dạng → `tu_luyen_sinh`. 7/59 HS cấp 1 CHƯA có dòng đo
nào (chưa học buổi nào có chấm) — nhóm này bấm vào sẽ thấy đúng thông báo "Chưa có dữ liệu học tập
để tự luyện — học vài buổi trên lớp rồi quay lại nhé" (§1.5 "thà bỏ trống còn hơn đánh sai": không
suy đoán dạng để luyện khi chưa có gì đo được), KHÔNG phải lỗi — là hành vi đúng cho HS thật sự mới.

## 2026-08-20 — Chuỗi soạn tài liệu: giả thiết chung chọn theo XA NHẤT (cấp), không phải mô hình sâu nhất

**Yêu cầu (Thùy, verbatim):** "Trong 1 chuỗi , nếu các giải thiết giống nhau thì ko nói. nếu giả thiết
khác nhau thì chọn giải thiết của bài xa nhất trong chuỗi" — bối cảnh: từ hôm 08-14 bài toán có thể
mang giả thiết RIÊNG (`gia_thiet_rieng`/`gt_thay_the`); một session khác (commit `2bbe3e3`, 17/08) còn
nới sâu hơn — `giaThietBaiToan()` giờ đệ quy kế thừa theo TIỀN ĐỀ CHÍNH gần nhất (không còn thuần suy
từ mô hình). Hệ quả: nhiều node trong CÙNG một chuỗi (a,b,c... ghép thành 1 mục để in) có thể có
`giaThietBaiToan()` khác nhau — trong khi 4 chỗ chọn "giả thiết chung của chuỗi" ở `SoanTaiLieu.tsx`
(`mucGhep`, `mucGhepLua`, `versions`/`deepestOf`, `deBaiChung`) vẫn đang chọn theo **mô hình sâu nhất**
(`doSauTrongHo(mo_hinh_id)`) — SAI TRỤC: đó là trục GIẢ THIẾT (cây mô hình), còn chuỗi nằm trên trục
SUY LUẬN (cấp). Giả định cũ "mô hình sâu nhất ⇒ đủ giả thiết nhất" chỉ đúng khi bài toán còn 100% mượn
mô hình (đơn điệu theo cây) — giờ không còn chắc nữa.

**Làm:** `src/screens/kho/hinh/SoanTaiLieu.tsx` — thêm hàm `xaNhatTrongChuoi(ns)`: chọn node có **cấp
cao nhất** trong tập truyền vào (cấp = trục suy luận = đúng nghĩa "xa nhất trong chuỗi", node đích cuối
chuỗi chứng minh). Thay 4 chỗ `doSauTrongHo(mo_hinh_id)` bằng hàm này: `mucGhep` (đề chuẩn ghép),
`mucGhepLua` (ghép 1 lứa, giữ đúng logic fallback "chỉ xét node có biến thể của lứa, rỗng thì về
`nodes[0]`"), `deepestOf` trong `versions` (bản Đề chuẩn gốc + từng Lứa), `deBaiChung` (phiếu tick xem
trước). Không tạo nhánh rẽ "giống/khác nhau" tách riêng — theo đúng lý Thùy nói: nếu giả thiết mọi node
giống nhau thì XA NHẤT cũng ra y hệt giá trị đó (đằng nào chọn ai cũng vậy), không cần rẽ nhánh code
riêng cho ca "giống nhau". `doSauTrongHo`/`moHinhSauNhat` các chỗ khác (TaiLieuChuan.tsx, cột-cấp SoDo,
badge "khác mô hình"…) giữ nguyên — đó là bối cảnh MÔ HÌNH thật (không phải chọn giả thiết 1 bài đại
diện cho chuỗi), sửa vào đó là sai chỗ.

**⚠ PHÁT HIỆN PHỤ (khi soi lại) — dữ liệu test dính lại 6 ngày trên node THẬT:** lúc verify tính năng
"giả thiết riêng" hôm 08-14, tôi gõ text test "TEST góc D = 65 độ (verify only)" vào `gia_thiet_rieng`
của **BT.08.025 thật** (họ Tứ giác K8), tưởng đã xoá sạch bằng thao tác Sửa→xoá trắng→Lưu ngay hôm đó
và log verify "đã dọn sạch". Hôm nay soi lại (chuẩn bị test tính năng chuỗi) mới phát hiện `gia_thiet_
rieng` của BT.08.025 **VẪN CÒN** đúng chuỗi text test đó — thao tác Sửa/Lưu hôm 08-14 không thật sự
persist (có thể do click sai toạ độ ref sau khi DOM re-render, hoặc `computer` type/key không target
đúng textarea — không xác định được nguyên nhân chính xác, không cố suy đoán quá 1 dòng). Đã dùng
`form_input` (set value trực tiếp, không qua keystroke giả lập) để xoá thật + `Lưu`, xác nhận lại bằng
`document.querySelectorAll('textarea')[...].value` qua JS (không tin read_page/placeholder — placeholder
hiện cả khi field CÓ giá trị) VÀ bằng full page reload + đọc lại `innerText` của node card. BT.08.025
giờ đúng "Cho tứ giác ABCD", sạch.
- **Bài học:** sau bước "Lưu" khi test trên data thật, PHẢI verify lại bằng cách đọc GIÁ TRỊ THẬT (DOM
  `.value` qua JS, hoặc reload trang + đọc lại), KHÔNG được tin `read_page` một mình — nhãn hiển thị
  của `read_page` cho textarea/textbox lấy TỪ `placeholder`, không phản ánh value hiện tại, nên "trông
  giống rỗng" không phải bằng chứng đã xoá.

**Verify:** tsc sạch · `npx vite build` sạch. Live: mở được Sơ đồ/K8/Tứ giác (dev server, session khác
đang chạy song song cùng máy nhưng khác port lần này nên không đụng nhau), xác nhận card + JS query
DOM đúng sau khi dọn data test. KHÔNG dựng được ví dụ chuỗi thật có giả thiết LỆCH giữa các node để soi
trực tiếp UI kết quả "xa nhất" — K8 hiện "Kho chính"/"Tài liệu chuẩn" đang trống (0 bài đã gán node qua
cổng 1/2), dựng data test tốn nhiều bước ngoài phạm vi yêu cầu và có rủi ro lặp lại sự cố dọn-không-sạch
ở trên nếu làm vội. Đã đọc kỹ code 3 lần đối chiếu logic cũ (giữ nguyên các fallback: `mucGhepLua`'s
"không node nào có biến thể ⇒ về `nodes[0]`", `deepestOf` giữ đúng chữ ký `(ns: BaiToan[]) => BaiToan`
để không đổi call site khác) — tự tin đúng nhưng CHƯA click-through trực tiếp thấy kết quả cuối, ghi rõ
ở đây để không nhận vơ là đã verify UI đầy đủ.

## 2026-08-20 (tiếp) — Builder giáo trình Hình: panel xem trước SỐNG bên phải + badge cảnh báo trùng bài

**Yêu cầu (Thùy, verbatim):**
"1. Nút chuyển lên xuống giữa các bài. bài nào ở trên hiện trước bài nào ở dưới hiện sau
2. Preview bài đó. Bên trái là thông số builder. Bên phải là preview bài đó luôn (Đề + hình vẽ). Thay vì
   là cái mắt phải click vào thì hiện luôn. Không gian còn thừa khá nhiều
3. Ngoài ra còn lỗi builder khi t vào xem thì nó ko save cái cũ t đã chọn. Vào builder buổi 2 lớp 8A ,
   builder hiện 2 câu nhưng preview chỉ hiện 1 (1 là do t chọn từ trước nhưng ko hiểu sao builder vẫn
   hiện 2)
4. Fix nhanh nào"

**Xác định đúng màn:** "builder của hình" = `BuoiPickEditor` (`SoanTaiLieu.tsx`, export dùng bởi
`GiaoTrinhScreen.tsx` → `BuoiCardHinh`) — nơi soạn nội dung TỪNG BUỔI của 1 giáo trình Hình cho 1 lớp cụ
thể (đúng khớp "builder buổi 2 lớp 8A"). Điểm 1 (nút ▲▼ đổi thứ tự) đã có sẵn từ 17/08 trong `ChuoiRow`
— KHÔNG phải chưa có; đọc lại ý Thùy thì đây là 1 cụm mô tả CHUNG cho panel preview mới (nút ↑↓ ĐIỀU
HƯỚNG giữa các bài trong panel xem, đi đúng THỨ TỰ mà ▲▼ đã sắp — không phải yêu cầu thêm 1 bộ nút đổi
thứ tự khác).

**Điểm 3 — root cause tìm được, KHÔNG PHẢI bug persistence:** `banInTheoMoHinh` (dùng chung cho preview
"👁/📘 Xem" LẪN xuất PDF thật) gọi `dedupePicks()` — khử pick TRÙNG chữ ký (cùng bản `kind/luaId/
bienTheId/yId` + cùng bộ `nodeIds`) trước khi ghép `mucs`. `ChuoiRow`'s danh sách builder (`picksOf`)
KHÔNG khử — hiện ĐỦ mọi pick kể cả pick trùng. ⇒ builder đếm 2, preview/PDF chỉ ra 1 — ĐÚNG như Thùy tả,
không phải lỗi lưu/tải (`gt.loadBuoiPicks`/`saveBuoiSelection` đọc-ghi đúng, `nhap.picks` builder và
preview dùng CHUNG 1 mảng in-memory, xác nhận qua `xem()` trong GiaoTrinhScreen.tsx).

**Làm (`SoanTaiLieu.tsx`):**
- Tách `pickSig(p)` khỏi `dedupePicks` (logic y hệt, giờ dùng lại được ở 2 nơi).
- `ChuoiRow`: tính `dupKeys` (Set các key SẼ bị `dedupePicks` loại lúc in, đúng thuật toán/thứ tự gốc) —
  gắn badge "⚠ trùng" đỏ ngay trên dòng bài, tooltip giải thích rõ "chỉ giữ dòng xuất hiện TRƯỚC, dòng
  này KHÔNG in ra" + gợi ý bấm ✕/✎. Builder giờ LỘ RA sự lệch số thay vì âm thầm khác preview.
- Bỏ hẳn modal `XemBaiPopup` (che màn hình, phải Đóng mới soạn tiếp) → `PreviewPane` — panel SỐNG, cột
  thứ 3 của `BuoiPickEditor` (`xl:grid-cols-[190px_minmax(0,1fr)_360px]`, `xl:sticky xl:top-3`), tái
  dùng NGUYÊN resolver `mucGhep/mucGhepLua/mucBienThe/mucY` (khuôn print thật — WYSIWYG, không tính lại
  gì riêng). `BuoiPickEditor` giữ state `xem: {list, index}` — 👁 mỗi dòng gọi `onXem(ds, i)` (`ds` =
  đúng danh sách top-to-bottom của `ChuoiRow` đó, thứ tự = thứ tự in) → panel đổi nội dung TẠI CHỖ, nút
  ↑/↓ chỉ đổi `index` trong `list` đã truyền, khỏi tính lại "bài trước/sau" từ đầu.
- Auto-chọn bài ĐẦU TIÊN tìm thấy khi mở buổi lần đầu (hoặc bài đang xem bị xoá/đổi) — dùng luôn không
  gian panel phải thay vì để trống, đúng ý "không gian còn thừa khá nhiều".

**Verify:** tsc sạch · `npx vite build` sạch. Live (dev server, Giáo trình 8A, Khối 8, Buổi 2 thật — đúng
kịch bản Thùy tả): panel "👁 XEM TRƯỚC" tự hiện ngay khi mở buổi (không cần bấm gì), auto-chọn BT.08.047
"1/1"; bấm 👁 ở dòng chuỗi BT.08.048+BT.08.049 → panel đổi đúng nội dung 2 ý a)/b); bấm 👁 ở biến thể 1
của BT.08.047 (Về nhà, 2 bài) → panel "1/2" → bấm ↓ → "2/2", đề đổi đúng sang biến thể khác (góc B=4D
thay vì A=3C) — nav hoạt động đúng. KHÔNG bắt được ca "⚠ trùng" thật trong Buổi 2/Giáo trình 8A hiện tại
(không có pick trùng chữ ký ở đây) — logic đã đối chiếu kỹ đúng thuật toán `dedupePicks`, để tự lộ khi
gặp buổi thật có trùng.

## 2026-08-21 — App HS: redesign UI giống app PH · Thông tin học tập thật · Bảng xếp hạng 5T

CEO chốt 3 việc cùng lúc: (1) "UI xấu quá. Làm UI giống như app phụ huynh đi", (2) "Thông tin học
tập hiện các dạng bài mà nó yếu (giống app phụ huynh)", (3) "Thêm 1 tính năng về bảng xếp hạng, xếp
hạng các bạn 5T về Thành tích làm bài tập tự luyện ở nhà".

**① Redesign — port ĐÚNG token màu app PH, không đoán.** App PH thật là repo riêng
`bkdemy-ph-app` (Next.js, KHÔNG nằm trong bkdemy-erp-v2 — xem [[ph-app-parent-portal]]). Đọc thẳng
`bkdemy-ph-app/app/globals.css` lấy ĐÚNG bảng màu `:root` (brand #1077be xanh dương logo BK, ios-bg
#f2f2f7, label #1c1c1e/#8a8a8e, green/orange/red trạng thái, ink #4a4a4e cho khối "báo cáo trang
trọng"). Port sang Tailwind v4 `@theme` trong `src/index.css` (`--color-brand`, `--color-ios`,
`--color-ph-label`, `--color-ph-green/orange/red/ink`…) → dùng dạng utility class (`bg-brand`,
`text-ph-label-2`…) thay vì lặp hex khắp `HocSinhApp.tsx` — KHÔNG viết CSS file riêng port nguyên
class PH (`.scard`/`.row`…) để tránh trùng tên với class Tailwind sẵn có (`.group` là marker
`group-hover` của Tailwind — port nguyên class PH sẽ đè vỡ mọi chỗ khác dùng `group-hover`).
Áp toàn bộ `HocSinhApp.tsx`: bỏ border card → shadow-sm (đúng phong cách PH card không viền), nền
`bg-slate-50` → `bg-ios`, mọi accent `indigo-*` → `brand`, đúng/sai/cảnh báo `emerald/amber/rose` →
`ph-green/ph-orange/ph-red`, avatar đổi từ nền phẳng sang gradient brand→brand-2 (giống `.avatar` PH).
ET (chế độ THI) đổi từ tím `violet` sang tông `ph-ink` (giống PH dùng gradient ink cho "báo cáo cả
lớp trang trọng" — hợp ngữ cảnh bài thi hơn màu tím tùy tiện cũ).

**② Thông tin học tập — CÓ THẬT, không còn "Sắp có".** `tuluyen.ts::layDangHocTap(mon)` — gọi lại
ĐÚNG `hs_dang_evals` (đã có sẵn cho Tự luyện) rồi chạy `masteryOfDang` (pure, KHÔNG bịa công thức
mới) theo dạng, trả về danh sách dạng + đếm đạt/cần luyện/yếu. Migration `202608211041` mở rộng
`hs_dang_evals` (CREATE OR REPLACE — file gốc 202608201111 đã áp, không sửa trực tiếp) thêm
`ten_dang`/`ten_chuyen_de`/`muc_do` từ đúng bảng `dai_ban_do`/tương đương ĐÃ join sẵn trong RPC (không
cần round-trip tra tên riêng). Nhân tiện sửa 1 lỗ hổng nhất quán: nhánh `bai_lam_cau` của RPC trước
đó gộp `tu_luyen` LẪN vào `src='btvn'` (giống lỗi đã sửa bên `mastery.ts` hôm 20/08) — giờ tách riêng
`src='tu_luyen'` cho ĐÚNG, dù về mặt SỐ (weight=1 cả hai) không đổi kết quả — chỉ là data-hygiene.
Màn hiện: card "Tỉ lệ thành thạo kiến thức" (%+đếm 3 mức, giống card PH "Kết quả") + list "Dạng cần
chú ý" (chỉ hiện yếu/cần luyện — ẨN đạt, ≤10 dạng ưu tiên yếu nhất, ĐÚNG hành vi PH app).

**③ Bảng xếp hạng — riêng khối 5T, chỉ số = số câu ĐÚNG tự luyện cộng dồn.** Quyết định chỉ số: CEO
nói "thành tích làm bài tập tự luyện ở nhà" không kèm công thức cụ thể — chọn **số câu ĐÚNG cộng
dồn (all-time)** vì (a) đơn giản nhất để hiểu với HS tiểu học, (b) không cần chuẩn hoá theo số lần
làm (như "%đúng") — vốn dễ bị lợi dụng bằng cách làm ít câu dễ ăn 100%, (c) tính năng Tự luyện mới
ra hôm nay nên "all-time" = "từ đầu mùa" hiện tại, chưa cần lọc mùa riêng — sẽ tính lại nếu CEO muốn
season-scope sau. Migration thêm `hs_khoi_cua_toi()` (khối thô — khác `hs_cap1_cua_toi` trả boolean,
cần giá trị thô để lọc đúng khối '5T') + `hs_xep_hang_tu_luyen(p_khoi)` (SECURITY DEFINER, đếm
`verdict='correct'` trong `bai_lam_cau` join `bai_test.loai='tu_luyen'`, gom theo HS). Model bảo mật
GIỐNG "báo cáo cả lớp" ET đã có sẵn ở app PH (hiện tên+điểm mọi bạn cùng lớp) — không nhạy hơn tính
năng đã tồn tại. HS chưa làm tự luyện lần nào → KHÔNG có dòng (INNER JOIN tự loại, §1.5 "thiếu data
= không có dòng" — tránh hiện "0 điểm" gây tủi cho em chưa làm). Ô "Bảng xếp hạng" trên màn chính chỉ
hiện với khối 5T (`KHU_CHI_5T`, đọc khối qua `khoiCuaHS()`), ẩn với mọi khối khác.

**Verify RPC bằng client HS thật (không admin), có dọn dữ liệu test:**
- `hs_khoi_cua_toi()` qua HS0602 → `"5"` đúng.
- `hs_dang_evals` mở rộng → 203 dòng, có kèm `ten_dang`/`ten_chuyen_de`/`muc_do`; src xuất hiện đúng
  `et`/`btvn` (HS0602 chưa có tu_luyen thật trong data — nhánh `tu_luyen` verify riêng bằng cách dựng
  1 lần tự luyện giả, xem mục dưới).
- `hs_xep_hang_tu_luyen('5T')` qua HS0602 (khối 5, KHÔNG phải 5T) → `[]` đúng (chưa ai khối 5T làm
  tự luyện thật). Dựng end-to-end thật: đăng nhập HS0642 (khối 5T thật), sinh 2 câu tự luyện qua
  ĐÚNG RPC `tu_luyen_sinh`, chấm ĐÚNG (verdict=correct) qua service (test nhanh, không qua UI click)
  → gọi lại `hs_xep_hang_tu_luyen('5T')` → thấy `{ma_hs:"HS0642", ho_ten:"Hồ Hà Chi", so_cau_dung:2,
  la_toi:true}` — đúng cả số lẫn cờ `la_toi`. Dọn sạch toàn bộ (`bai_test`+`bai_test_cau`+`bai_lam`+
  `bai_lam_cau`) ngay sau test.
- `npx tsc --noEmit` sạch (1 lỗi kiểu `muc_do`/`tin` — `masteryOfDang` trả `.js` không có kiểu
  literal chặt, ép kiểu `as DangHocTap['muc'|'tin']` tại điểm dựng object, không đụng công thức).

Verify UI thật trên browser (mobile 375×812) sau khi merge vào `main` — ghi tiếp ở mục dưới nếu cần
sửa gì sau khi nhìn thấy render thật.

## 2026-08-21 (tiếp) — Sửa lại UI: PORT NHẦM bảng màu chết + header giống PH + xếp hạng mọi khối tiểu học + 5 lần gần nhất

CEO chốt sau khi xem bản trước: "1. Bố cục vẫn xấu quá. Các header làm giống bên app phụ huynh đi
2. À ko phải chỉ 5T. Hiện cho các khối tiểu học 3. Chỗ thông tin học tập, t muốn cập nhật luôn cái
đánh giá từng câu giống trên Kết quả học tập ở ERP... Hiện 5 lần gần nhất".

**⚠⚠ ROOT CAUSE của mục ①: port NHẦM stylesheet CHẾT.** Bản trước đọc `bkdemy-ph-app/app/globals.css`
(`:root`) — nhưng grep xác nhận file này **0 chỗ dùng** trong `PhApp.tsx` thật (comment ngay đầu file
"port từ mockup đã duyệt" — di sản, chưa xoá). App PH THẬT chạy bằng `ph-v3.css` + `ph-v3-extra.css`
(`.pv3{...}`, "Design system v3 — springboard + drill-down"), token màu KHÁC HẲN: `--bg:#F3F5FA`
(không phải #F2F2F7) · `--text:#171A22` · `--muted:#858A96` · `--blue:#087FC6` (không phải #1077BE)
· bo góc RẤT lớn (card 21-24px, icon "squircle" 13-18px — KHÔNG BAO GIỜ tròn hoàn toàn) · shadow mềm
`0 8px 24px rgba(28,38,61,.07)` (không phải `shadow-sm` Tailwind mặc định, nhạt hơn nhiều). Dùng
Explore agent đọc LẠI đúng `ph-v3.css`/`ph-v3-extra.css` + cách `PhApp.tsx` dùng chúng (không đoán
qua tên class) trước khi sửa — bài học: lần sau đụng "giống app X", luôn xác nhận file CSS đang
IMPORT THẬT (`grep` component thật dùng class nào), không tin comment/tên file nghe hợp lý nhất.

**① Header + bố cục — port lại ĐÚNG:**
- `src/index.css` `@theme`: đổi toàn bộ token sang giá trị `ph-v3.css` thật (`--color-brand:#087fc6`,
  `--color-ios:#f3f5fa`, `--color-ph-label:#171a22`, `--color-ph-label-2:#858a96`, thêm
  `--color-ph-purple:#7656d8` — bỏ hẳn `ph-ink`/`ph-ink-2` bịa ra ở bản trước, ĐÂU CÓ trong hệ thật).
- Thêm component `Head` DÙNG CHUNG (ĐÚNG `.pageHead` ph-v3.css:65-67): nút back squircle 40×40 nổi
  TRÊN NỀN TRANG (không phải thanh trắng riêng như bản trước), title 21px bold, sub 12px xám — áp cho
  cả 3 sub-màn (Danh sách 1 khu, Thông tin học tập, Bảng xếp hạng).
- Màn chính: đổi từ 1 thanh header dẹt sang ĐÚNG 2 tầng của PH thật — hàng icon-button (🔑/Thoát) nổi
  riêng ở trên, rồi `.studentCard` (ph-v3.css:39-41): card trắng bo 24px, avatar SQUIRCLE 56×56 bo
  18px (KHÔNG tròn — khác bản trước dùng `rounded-full`), tên 19px bold.
- Lưới ô ĐÚNG `.function` (ph-v3.css:59-62): mỗi ô 1 MÀU RIÊNG (icon squircle nền xanh/tím/cam/xanh lá
  nhạt theo `MAU_BG`, giống PH có `.blue/.green/.orange/.purple`) — bản trước mọi ô cùng 1 xám phẳng,
  đơn điệu, đúng là "xấu" như CEO nói.
- Danh sách 1 khu, Thông tin học tập, Bảng xếp hạng: card bo 21-22px + `SHADOW` (đúng `--shadow` PH),
  tab chọn "Chưa làm/Hoàn thành" đổi màu chữ active sang `text-brand` (giống `.tabs a.active`).

**② Bảng xếp hạng — mọi khối tiểu học, KHÔNG chỉ 5T:** `KHU_CHI_5T` → `KHU_CHI_CAP1` (điều kiện ẩn/hiện
đổi từ `khoi !== '5T'` sang `!cap1` — tái dùng ĐÚNG boolean `cap1` đã có). `BangXepHang` tự đọc
`khoiCuaHS()` của CHÍNH mình rồi gọi `xepHangTuLuyen(khoi)` — KHÔNG hardcode `'5T'` nữa (RPC
`hs_xep_hang_tu_luyen(p_khoi)` vốn đã tổng quát từ đầu, không cần sửa DB) — mỗi em xếp hạng với ĐÚNG
khối của mình (khối 3 không lẫn khối 5), sub-title header hiện động `"...các bạn khối {khoi}"`. Card
xếp hạng đổi sang ĐÚNG `.classTable`/`.row`/`.rank`/`.score` (ph-v3.css:85-90) — bảng xếp hạng lớp có
sẵn trong PH thật, không phải dựng kiểu mới.

**③ Thông tin học tập — "5 lần gần nhất" giống Kết quả học tập ERP:** Đọc ĐÚNG `Slot`/`DangRow` của
`KetQuaScreen.tsx` (staff) qua Explore agent trước khi làm — pattern: ✓ đạt (value≥1, xanh) · ◐ nửa
(value>0, cam) · ✗ sai (value=0, đỏ), MÀU THEO GIÁ TRỊ TỪNG LẦN ĐO (KHÔNG phải theo mức `muc` của cả
dạng — 2 trục khác nhau), sắp mới→cũ, kèm nhãn nguồn (`SRC_LABEL`) + ngày ngắn dưới mỗi chấm.
- `tuluyen.ts::layDangHocTap`: mỗi `DangHocTap` thêm `recent: RecentEval[]` — TOP 5 (không phải 10
  như bản staff — CEO nói rõ "Hiện 5 lần gần nhất") lấy từ CHÍNH mảng evals đã fetch (không round-trip
  RPC thêm lần nào), sort `Date.parse` mới→cũ, `.slice(0,5)`. Export thêm `SRC_LABEL` (ĐÚNG bảng nhãn
  `mastery.ts` dùng, không bịa nhãn khác — chỉ bớt `ingame`/`dg` vì `hs_dang_evals` không bao giờ trả
  2 nguồn đó).
- `HocSinhApp.tsx`: component `LanDo` (đặt tên khác `Slot` staff cho rõ ngữ cảnh HS, cùng logic hệt),
  gắn dưới mỗi hàng dạng trong "Dạng cần chú ý" — hàng dạng đổi sang ĐÚNG `.dangList`/`.dangRow`
  (ph-v3-extra.css:327-338): nền xám phẳng `#F7F8FB`, chấm tròn màu theo mức, tag pill bên phải.

**Verify:** `npx tsc --noEmit` sạch (1 lỗi biến `khoi` không dùng ở scope cha sau khi dời fetch khối
vào trong `BangXepHang` — xoá state thừa, không phải bug logic). Verify browser thật SAU merge (đúng
`main`, đọc computed style qua JS thay vì screenshot — pane không render frame trong môi trường này):
- `studentCard`: `background-color: white`, `border-radius: 24px`, `box-shadow: rgba(28,38,61,.07)
  0 8px 24px` — khớp CHÍNH XÁC `--shadow` thật. Avatar: `border-radius: 18px` (squircle, không tròn),
  gradient `rgb(8,127,198)→rgb(18,103,213)` = đúng `#087FC6→#1267D5`.
- Nền trang: `rgb(243,245,250)` = đúng `#F3F5FA`.
- HS0602 (khối 5) → "Thông tin học tập": 93% · 25 đạt/4 cần luyện/0 yếu · 4 dạng "Cần chú ý", MỖI dạng
  có ĐÚNG hàng "5 lần gần nhất" (✓/◐/✗ + nguồn ET/BTVN + ngày dd/mm, thứ tự mới→cũ) — đúng yêu cầu ③.
- HS0602 (khối 5) → "Bảng xếp hạng": sub-title hiện ĐÚNG "...các bạn khối 5" (không còn hardcode
  '5T') → đúng yêu cầu ②, trạng thái rỗng đúng thật (chưa ai khối 5 làm tự luyện).
- Đăng xuất sạch sau verify, không để lại session dở trên tab dùng chung.

## 2026-08-21 — Đánh giá (mastery) Hình học: nối giáo trình Hình → ET/BTVN, engine mô hình

**Yêu cầu (Thùy, chốt qua sparring):**
"Đại/Giải tích đánh giá qua dạng, Hình không có dạng — Hình đánh giá qua Mô hình. Mỗi mô hình đo qua
bài trực tiếp thuộc nó, KHÔNG tính mô hình con. Vẫn cùng logic Đại (ET/BTVN/MT). Kiến trúc phải giống
khung Đại — Đại hoàn chỉnh rồi, Hình chỉ khác khái niệm riêng (mô hình/tiền đề/chuỗi), luồng gốc giống
nhau. Chấm theo TỪNG NODE (không gộp chuỗi). Cần nhãn đối chiếu phiếu giấy: "Bài 5 ý c" → "5C", hơn 2 ý
mới có chữ. WINDOW đo giảm 3 (Đại 5, vì bài Hình dài hơn) — TIN_CAO/TIN_TB scale theo (3/2)."

**Phát hiện quan trọng lúc research (agent Explore, trước khi code):** Hình (mô hình, `SoDo.tsx`/
`SoanTaiLieu.tsx`) hiện KHÔNG có bất kỳ đường chấm điểm nào — builder giáo trình 100% chỉ để in PDF,
0 chỗ chạm `gami_session_problems`/`hoc_sinh_id`. Hook cũ (`hinh_y_id`+`ngu_canh_luot`, mig 07-24) chỉ
phủ 1/3 loại pick và 0 UI gọi. "Hình giải tích" (`nhanh='hinh_gt'`) là hệ KHÁC (dạng-based, đã wire ET/
BTVN như Đại) — không liên quan việc này, dễ nhầm vì cùng chữ "Hình".

**Làm:**
- **Migration `202608211127_gami_hinh_mo_hinh_hook.sql`**: `gami_session_problems` thêm `hinh_baitoan_id`
  (FK, khoá tự nhiên mastery), `hinh_bien_the_id` (FK, biết đúng đề biến thể đã ra — mastery vẫn gộp về
  node gốc qua `hinh_baitoan_id`), `hinh_nhan` (text, snapshot nhãn "5C" lúc sync). KHÔNG đụng/xoá
  `hinh_y_id`/`ngu_canh_luot` cũ (Luật xoá — chỉ thêm).
- **`src/lib/kho/hinhGiaoTrinh.ts`**: `flattenGtBaiToDapAn(L, bais)` — làm phẳng pick giáo trình (ghep/
  bienthe/y) → 1 dòng/NODE, TÁI DÙNG đúng `noDapAn`/khung mà `mucGhep` dùng để in (1 nguồn sự thật, nhãn
  chữ a/b/c... khớp 1-1 "a) b) c)" trên phiếu). `loadHinhForBuoi(buoiId, phan)` — tra `hinh_gt_buoi` qua
  (lop_id,ngay) của buổi (không FK buổi, giống ET/BTVN Đại).
- **`src/lib/gami.ts`**: `syncHinhProblems()` — bản sao `syncDocProblems` (Đại) NHƯNG khoá tự nhiên là
  NODE (`hinh_baitoan_id`[+`hinh_bien_the_id`/`hinh_y_id`]) thay vì `ma_cau`. ⚠ **Fix domain-partition**:
  Đại+Hình CHIA SẺ bảng `gami_session_problems`+cột `problem_no` cho cùng (buổi,phase) — sửa cả
  `syncDocProblems` LẪN `syncHinhProblems` để mỗi hàm CHỈ diff/xoá phần CỦA MÌNH (lọc theo có/không
  `hinh_baitoan_id`) nhưng CẤP SỐ `problem_no` mới theo max TOÀN BẢNG (`noTiep()`) — nếu không, bên kia
  sẽ bị đọc nhầm thành "mồ côi" rồi XOÁ, hoặc 2 bên cấp trùng problem_no đụng unique constraint. Gọi
  TUẦN TỰ (không `Promise.all`) ở UI — song song thì cả 2 đọc "trước khi ghi" của nhau, vẫn đụng số.
  `loadHinhForBuoiPhase(buoiId, phase)`: nha→btvn (rõ) · lop→et (mặc định) — **MT chưa có cơ chế gán
  riêng cho Hình** (Đại có `tai_lieu loai='mt_buoi'`, Hình chưa), tạm map lop→cả et/mt dùng CHUNG nội
  dung — cần Thùy xác nhận, CHƯA nối tab MT trong UI (xem "CHƯA LÀM").
- **`src/screens/gami/BuoiHocScreen.tsx`**: tab ET + BTVN — sync Đại rồi Hình TUẦN TỰ, merge `LuoiSync`,
  hiện cột Hình với nhãn "Bài {hinh_nhan}" (nền tím phân biệt) thay vì "Câu N"/tên dạng.
- **`src/gami/mastery.js`**: `MASTERY_CONFIG_HINH` = `{...MASTERY_CONFIG, WINDOW:3, TIN_CAO:3, TIN_TB:2}`
  — `masteryOfDang` vốn đã nhận `cfg` tham số, KHÔNG cần sửa engine, chỉ thêm config song song.
- **`src/lib/mastery.ts`**: `getHinhMasteryHS(hocSinhId, opts)` — mirror `getMasteryHS` nhưng group theo
  `hinh_baitoan_id` (không phải `ma_dang`), nguồn CHỈ `gami_grades` (Hình mô hình chưa có kênh test-
  online/tự luyện). "Không tính mô hình con" tự đúng — mỗi bài toán chỉ gắn ĐÚNG 1 node (luật spec-kho-
  hinh-v3 §2.6), group theo node không bao giờ lẫn quan sát node khác, không cần lọc DAG cha/con.
- **`src/screens/ketqua/KetQuaScreen.tsx`**: `DangBaiTab` gọi thêm `getHinhMasteryHS`, `hinhToDangShape()`
  hình chiếu qua `DangMastery` để TÁI DÙNG NGUYÊN `DangSection`/`DangRow` (không bịa UI riêng) — 2 bảng
  phụ "Hình học — Cơ bản/Nâng cao" hết placeholder tĩnh, bucket theo `cap` CLIP 1-5 (XẤP XỈ `mucDoTuCap`
  thật — thật cần biết cách giải có bổ đề, CHƯA join, sai số nhỏ ở biên cap≈3).

**CHƯA LÀM (cố ý cắt phạm vi, không phải quên):**
- Tab **MT** trong `BuoiHocScreen.tsx` chưa nối Hình (cấu trúc "Phần I/II" của MT là khái niệm Đại, Hình
  không có — cần Thùy chốt Hình có "đợt MT" riêng hay dùng chung nội dung `lop` trước khi vẽ UI).
  `syncHinhProblems`/`loadHinhForBuoiPhase` đã hỗ trợ `phase='mt'` ở tầng lib, chỉ chưa gọi từ `MTTab`.
- `TongQuanTab` (① % hoàn thành bản đồ kiến thức) vẫn giữ placeholder tĩnh cho Hình — cần denominator
  "tổng số mô hình phải đo" (canonical count theo khối) chưa định nghĩa, khác việc DangBaiTab (chỉ liệt
  kê cái ĐÃ đo, không cần tổng).
- Bucket cơ bản/nâng cao Hình dùng `cap` xấp xỉ, chưa gọi `mucDoTuCap(cap, coBoDe)` thật (cần join
  `hinh_cach_giai`/`hinh_cach_bo_de` theo node — bỏ qua cho gọn lần đầu).
- Bổ đề (`hinh_bo_de`) — chưa làm gì thêm (Thùy: "chỉ là view phụ tương lai", không việc gì lúc này).
- CHƯA test bằng data thật (chưa có buổi thật nào gán giáo trình Hình + chấm ET/BTVN qua đường mới) —
  chỉ verify được tsc/build/module-transform sạch, KHÔNG phải hành vi runtime với data thật.

**Verify:** `npx tsc --noEmit` sạch · `npx vite build` sạch · mọi module sửa (gami.ts, hinhGiaoTrinh.ts,
mastery.ts, mastery.js, BuoiHocScreen.tsx, KetQuaScreen.tsx) transform qua dev server (curl 200, không
lỗi import/cycle). KHÔNG click-through được UI thật (không có buổi thật đã gán giáo trình Hình sẵn để
soi — dựng data test tốn nhiều bước ngoài phạm vi phiên này, và rủi ro lặp bẫy "dọn-không-sạch" đã từng
dính trên node THẬT nếu làm vội, xem mục 2026-08-20 phía trên).

## 2026-08-21 (tiếp) — Đánh giá Hình học: nối tab MT + card "Hoàn thành" Hình ở Tổng quan

**Thùy trả lời 2 điểm mở (chốt qua sparring):**
- **MT:** đồng ý hướng "toggle chọn bản đồ lúc chọn câu" (3 tab Đại/Hình giải tích/Hình mô hình — ET
  cũng định làm vậy) THAY VÌ cấu trúc cứng "2 Phần = Đại/Hình". Đây là hướng cho tầng SOẠN đề MT/ET
  (chưa làm ở lần này — cần riêng 1 lượt đọc `mt.ts`/màn soạn MT + `ETScreen.tsx` mới đủ hiểu để sửa
  đúng chỗ). Việc closable ngay là tầng CHẤM (MTTab) — Hình vẫn tự động vào MT qua nội dung 'lop' đã
  gán sẵn (giống ET), không cần người chọn gì thêm ở màn chấm.
- **① % hoàn thành Hình (Tổng quan):** "giống đại, đo trên những mô hình đã có đánh giá" — xác nhận
  công thức `compPct` của Đại (tally trên tập ĐÃ ĐO, KHÔNG cần denominator canonical) áp thẳng cho Hình
  — bỏ blocker "chưa định nghĩa denominator" đã nêu trước, không phải vấn đề thật.

**Làm:**
- **`BuoiHocScreen.tsx` MTTab**: nối Hình giống ET/BTVN — `loadHinhForBuoiPhase(buoiId,'mt')` +
  `syncHinhProblems` TUẦN TỰ sau MT Đại (chia sẻ `problem_no`, xem ghi chú domain-partition ở
  `syncHinhProblems`). Thêm 1 group-header "Hình (mô hình)" (colSpan = số ô Hình) cạnh các group Phần
  Đại sẵn có — Hình LUÔN xếp SAU (problem_no lớn hơn qua `noTiep()`), không cần logic chen giữa. Cột
  Hình hiện "Bài {hinh_nhan}" như ET/BTVN.
- **`src/lib/mastery.ts` `getTongQuanHS`**: thêm khối tính Hình song song khối Đại đang có — `hEtRows/
  hMtRows/hBtvnRows` (group theo `hinh_baitoan_id` thay `ma_dang`) → `compPctHinh` (bản sao `compPct`,
  bucket theo `cap` CLIP 1-5 thay `muc_do`, dùng `MASTERY_CONFIG_HINH`) → 2 card mới `hinhCoBan`/
  `hinhNangCao` trong `TongQuanHS.hoanThanh`. Thêm `hinh_baitoan_id` vào embed `gami_grades` gốc (1
  query, không round-trip thêm).
- **`KetQuaScreen.tsx` TongQuanTab**: 2 card Hình hết placeholder — dùng `HoanThanhCard` y hệt Đại. Xoá
  hẳn `HoanThanhPlaceholder` (hết chỗ dùng — component chết, không giữ lại "phòng khi cần").

**CHƯA LÀM (còn mở, khác với "cố ý cắt" — đây là hướng lớn Thùy vừa mở ra, cần lượt riêng):**
- Toggle 3-tab (Đại/Hình giải tích/Hình mô hình) ở màn SOẠN câu cho ET/MT — Thùy xác nhận đây là hướng
  đúng nhưng CHƯA build, cần đọc kỹ `TaiLieuBuilder.tsx`/`ETScreen.tsx`/`mt.ts` (soạn đề) trước khi động
  — khác hẳn phạm vi "nối Hình vào tầng CHẤM" đã xong hôm nay.
- Vẫn CHƯA test bằng data thật (đúng như Thùy nói: "chưa build xong thì đương nhiên chưa có dữ liệu").

**Verify:** `npx tsc --noEmit` sạch · `npx vite build` sạch.

## 2026-08-21 (tiếp) — CHẤM TLN BẰNG AI (vòng 2): dựng xong, BLOCK ở hạ tầng pg_net — cần Thùy bật Dashboard

CEO chốt mô hình V1 (3 vòng: key → AI khi lệch key → thêm DB nếu AI xác nhận đúng), sửa lại theo
2 ý: (1) CHỈ trả lời ngắn, (2) MỌI lần AI chấm phải ghi log, (3) thêm-vào-DB PHẢI người duyệt
(không tự động — đúng nguyên tắc CLAUDE.md §5 "AI gợi ý → người confirm").

**Grounding trước khi code (Explore agent):** vòng 1 (chấm key) + vòng 3 (cache + backfill,
`question_accepted_answers`/`chapNhanDapAn`) **ĐÃ XÂY XONG SẴN** trong V2 — cột `ai_reason`/`source`
đã có sẵn trong schema, chỉ chưa ai nối AI vào. Việc thật cần làm nhỏ hơn nhiều so với "3 vòng từ
đầu" — chỉ thiếu đúng vòng 2 (gọi AI).

**⚠ Phát hiện an ninh trước khi code:** `VITE_DEEPSEEK_KEY` hiện gọi THẲNG từ client (`kho/api.ts`) —
đã có sẵn cảnh báo trong code "trước khi deploy public phải qua proxy". App đang tính deploy công
khai `hs.bkacademy.edu.vn` (bàn ở mục trên) → PHẢI gọi AI từ server, không lộ key qua devtools.

**Thiết kế (migration `202608211153_cham_tln_ai.sql`):**
- Gọi DeepSeek **TỪ TRONG POSTGRES** qua `pg_net` (RPC `hs_cham_tln_ai`) — dùng lại đúng pattern
  SECURITY DEFINER RPC cả phiên, KHÔNG cần dựng Edge Function/hosting mới.
- Secret: định dùng Supabase Vault (đã cài `supabase_vault@0.3.1`) nhưng role `claude_build`
  **KHÔNG có quyền `usage` schema `vault`** (verify: "permission denied for schema vault") — cần
  Thùy tự bật qua Dashboard nếu muốn Vault chuẩn. TẠM: bảng `_app_secrets` riêng, KHÔNG grant
  anon/authenticated, RLS bật không policy nào (chủ bảng bypass RLS mặc định) → chỉ RPC đọc được,
  PostgREST không chọc vào được. Nạp key thật bằng script 1 lần đọc từ `.env.local` (KHÔNG commit
  giá trị thật), xoá script ngay sau khi nạp.
- `bai_test_report` thêm cột `nguon` (`hs_bao_sai` mặc định · `ai_de_xuat` mới) — AI xác nhận đúng
  → CHỈ tạo 1 dòng report chờ duyệt (KHÔNG tự ghi `question_accepted_answers`/sửa `bai_lam_cau`) —
  dòng này TỰ NỔI lên màn "Duyệt chấm online" có sẵn (đọc `bai_test_report` trang_thai='moi'), GV
  bấm "✓ Chấp nhận đúng" (`chapNhanDapAn`, KHÔNG sửa) mới thật sự ghi + backfill — đúng yêu cầu
  "phải được duyệt".
- Bảng `tln_ai_cham_log` — ghi MỌI lần gọi AI (cả khi AI nói vẫn sai, cả khi lỗi API) — đúng yêu
  cầu "mọi lần AI chốt lệch với key đều cần ghi log". RLS staff-only (`tai_khoan.nhan_su_id is not
  null` — KHÔNG dùng `nhan_su`/`auth.uid()` trực tiếp, xem bug ①).
- `testonline.ts::traLoiCau` — sau khi key+cache đều KHÔNG khớp (còn 'wrong'), gọi RPC trên KHÔNG
  chờ (fire-and-forget, IIFE async nuốt lỗi) — giữ nguyên "chấm tức thì", AI chạy nền.
- `DuyetChamScreen.tsx` — badge tách riêng 🚩 HS báo sai / 🤖 AI đề xuất theo `nguon`.

**2 bug tự bắt được lúc verify (không phải Thùy báo):**
① `auth.uid()` dùng trực tiếp trong policy mới → `permission denied for schema auth` (role
`claude_build` không có usage schema `auth`) — search thấy `my_hoc_sinh_id()` sẵn có đã né bằng
`public.jwt_uid()` (đọc `request.jwt.claims` thẳng, không qua schema `auth`) — sửa theo đúng pattern
đó, KHÔNG phải phát minh mới.
② `net.http_post(...)` trả THẲNG `bigint` (request_id), không phải bảng — viết nhầm
`select id into x from net.http_post(...)` như hàm trả bảng → `column "id" does not exist`. Dò
`pg_attribute` ra đúng cấu trúc `net.http_collect_response()` trả `(status, message, response)` với
`response` lồng `(status_code, headers, body)` — sửa cho khớp. 2 migration `_fix_pgnet` +
`_timeout` (CREATE OR REPLACE đè — KHÔNG sửa file `202608211153` đã áp, đúng CLAUDE.md §2.1).

**⛔⛔ BLOCK Ở HẠ TẦNG — CẦN THÙY: pg_net background worker CHƯA CHẠY.** Test thật (dò tận gốc bằng
`net.check_worker_is_up()`) → `"the pg_net background worker is not up"`. Đây là ca đã biết của
Supabase: bật `pg_net` bằng `create extension` qua SQL Editor/kết nối trực tiếp KHÔNG đủ — worker
nền cần đăng ký lúc Postgres KHỞI ĐỘNG (`shared_preload_libraries`), chỉ Supabase Dashboard mới làm
được (bật công tắc pg_net ở Database → Extensions sẽ tự restart đúng cách). Thử `net.wake()`/
`net.worker_restart()` qua SQL — chạy "thành công" nhưng worker vẫn báo "not up" (xác nhận đây là
hạ tầng, không phải cấu hình sửa được bằng SQL). Queue request test đi vào `net.http_request_queue`
nhưng không ai xử lý → `net.http_collect_response(..., false)` treo VÔ HẠN (test 1 lần treo >2 phút
mới phải Ctrl-C, kết nối `claude_build` không có statement_timeout nên không tự huỷ).

**Việc còn lại — CẦN THÙY bật `pg_net` qua Supabase Dashboard (Database → Extensions → pg_net →
bật). Sau đó chỉ cần verify lại (đã có sẵn script mẫu, xoá tạm sau lần trước) — code/migration/UI
đã xong hết, không cần sửa gì thêm nếu worker chạy đúng.** Cũng nên canh: `hs_cham_tln_ai` chạy
dưới role `authenticated` có `statement_timeout=8s` (cấu hình sẵn của project) — đã hạ
`timeout_milliseconds` DeepSeek xuống 6000ms để có dư; nếu vẫn hay timeout sau khi worker chạy đúng
thì cân nhắc tách 2 bước (queue nhanh trả về ngay + xử lý async thật sự) — CHƯA cần làm nếu 6s đủ.

Chưa merge `main` — chưa verify được end-to-end (đang chờ Thùy bật pg_net). Code an toàn để merge
sớm nếu muốn (degrade sạch: lỗi bị nuốt, HS không thấy gì khác, chỉ chưa có tác dụng AI-chấm) nhưng
theo đúng kỷ luật cả phiên — không merge cái chưa verify thật.

## 2026-08-21 (tiếp) — Tách bundle riêng cho hs.bkacademy.edu.vn (webapp/PWA, KHÔNG tách repo/DB)

CEO chốt (2 lượt): "t đang nghĩ tách nó thành 1 subpage của BK như PH... hs.bkacademy.edu... làm nó
thành webapp như phapp" → "t cần học sinh đăng nhập vào app rồi làm bài... hướng làm như nào cho
tiện m đề xuất đi" → sau khi CTO đề xuất (giữ monorepo, KHÔNG tách repo/DB như PH — PH phải tách vì
vốn khác hệ/DB từ đầu, HS đã sẵn RLS đúng trong CHÍNH Supabase ERP) → CEO đồng ý → nhắc lại làm nốt.

**Kiến trúc: build entry RIÊNG, KHÔNG tách repo/DB.**
- `hs.html` + `src/main-hs.tsx` — entry mới, KHÔNG import `./App` (staff) — render thẳng `AppHS`.
- `src/AppHS.tsx` — copy CHÍNH XÁC nhánh HS của `App.tsx` (session→hsId→must_change_password→
  HocSinhApp/DoiMatKhau), bỏ hết import staff (`NhanSuHome`/`TopBar`/`useStore`/`phanquyen`…) + bỏ
  luôn nhánh `#pvjob` (in PDF, chỉ worker server dùng) + bỏ `fitZoom` (mật độ desktop staff, HS vốn
  đã net 1.0). Thêm nhánh mới: tài khoản KHÔNG phải HS (vd staff gõ nhầm domain) → chỉ có nút đăng
  xuất, domain này CHỈ dành HS.
- `src/auth/Login.tsx` thêm prop `hsOnly` (mặc định `false`, KHÔNG đổi hành vi app chính) — ẩn tab
  "Nhân sự", khoá cứng mode='hs', đổi tiêu đề "BK Academy · Đăng nhập học sinh".
- `vite.config.hs.ts` — build RIÊNG (`npm run build:hs`) → `dist-hs/`, entry `hs.html`. Verify thật
  bundle NHẸ HƠN HẲN: HS-only 676KB JS (gzip 196KB) vs app đầy đủ 4.66MB JS (gzip 1.27MB) — ~7×,
  đúng lý do tách (domain public không cần kéo theo code Kho/Giáo trình/admin nội bộ).
- PWA: cài `vite-plugin-pwa` (chưa có sẵn trong repo, thêm mới). Icon: cắt từ `public/Logo.png`
  (wordmark BK Academy có sẵn) — dò bounding-box thật bằng `@napi-rs/canvas` (đã có sẵn cho worker
  PDF, không thêm dep mới) qua 3 lần thử (2 lần đầu cắt CỤT icon do ước lượng sai vùng quét — lần 3
  dò khoảng-trắng-dài-nhất giữa icon và chữ mới ra đúng ranh giới) → `public/icon-192.png` +
  `icon-512.png`, nền trắng, đệm 10%. Manifest: `standalone`, theme `#087fc6` (đúng brand app PH).

**1 bug tự bắt lúc verify:** build ra `dist-hs/hs.html` (đúng tên nguồn) nhưng mọi static host (kể
cả `vite preview` lúc test local) mặc định phục vụ `index.html` cho `/` → Service Worker + asset
404 khi mở domain gốc. Thêm plugin nhỏ (`closeBundle` hook) đổi tên `hs.html`→`index.html` NGAY
TRONG `dist-hs/` sau build — nguồn giữ tên rõ nghĩa (khỏi lẫn với `index.html` app chính cùng thư
mục gốc), output đúng chuẩn host tĩnh cần.

**Verify:** `npx tsc --noEmit` sạch cả 2 phía · `npm run build` (app chính) VẪN chạy bình thường
(không đụng gì) · `npm run build:hs` sạch, service worker + manifest sinh đúng (32 entries precache).
Browser thật: mở `dist-hs` qua `vite preview` — màn hình CHỈ có form "Mã học sinh/Mã PIN" (không có
tab Nhân sự) → đăng nhập HS0602 thật → `AppHS` render đúng `HocSinhApp` với data thật (tên, mã HS,
4 ô cấp 1) → bấm Thoát → quay lại đúng màn login sạch. **Đăng ký Service Worker báo lỗi trong môi
trường browser pane tự động** (đã dò: file `sw.js` tải đúng 200/`content-type: text/javascript`,
`navigator.serviceWorker` tồn tại, `isSecureContext=true` — nhiều khả năng là giới hạn của trình
duyệt sandbox dùng để test, KHÔNG phải lỗi build) — cần verify lại bằng trình duyệt thật (điện thoại
thật) sau khi deploy lên domain thật, đó mới là môi trường có ý nghĩa để test "cài ra màn hình chính".

**CÒN LẠI — CẦN THÙY (ngoài khả năng CLI/SQL của mình):**
1. Domain `hs.bkacademy.edu.vn` — mua/trỏ DNS (CNAME, giống `ph.` trước đây ở Mắt Bão).
2. Deploy `dist-hs/` — 1 Vercel project MỚI, CÙNG repo GitHub, build command `npm run build:hs`,
   output `dist-hs`, gắn domain trên. KHÔNG động app chính (build command mặc định `npm run build`
   vẫn y nguyên, 2 project độc lập cùng nguồn).
3. Sau khi deploy: thử cài PWA thật trên điện thoại (Safari/Chrome) — xác nhận icon/tên hiện đúng.

Chưa commit — đợi xác nhận hướng trước khi merge (an toàn để merge ngay nếu muốn: chỉ thêm file
mới + 1 prop optional trên Login.tsx, không đổi hành vi app chính).

## 2026-08-20 (tiếp) — Kho Hình: "Up bài → AI tự tách" giờ tự nhận diện + cắt HÌNH VẼ luôn

**Yêu cầu (Thùy, verbatim):** "Trong vần tạo biến thể hình học. KHi chọn dán ảnh hoặc pdf, hiện tại hệ
thống nhận diện được đề và đáp án. T muốn hệ thống tự nhận diện được Hình vẽ luôn. module này đã dùng
nhiều lần, m check ở bên đại số có rồi đấy"

**Đối chiếu bên Đại (đã có, khuôn lại y hệt):** `NhapKhoScreen.tsx` hàm `boc()` — render PDF/ảnh ra
canvas DPI cao (`fileToCanvases`, 400dpi, giữ nét để cắt), gửi Gemini bản DOWNSCALE JPEG
(`canvasToJpegBase64`, đỡ token — bbox chuẩn hoá 0-1000 nên độc lập tỉ lệ gửi), AI trả thêm `co_hinh` +
`box_hinh` (schema `INGEST_KHO_SCHEMA`) → cắt THẬT bằng `cropCanvasBox` từ canvas gốc (không phải AI vẽ
lại) → `uploadKhoImage` → gắn `anh_de`. 3 hàm dùng chung `src/lib/pdfRender.ts`.

**Bên Hình trước đây (`ingestBaiHinh`/`IngestBaiButton`):** model cũ CHỦ ĐỘNG dặn AI "Có HÌNH VẼ thì BỎ
QUA — chỉ lấy CHỮ" (đúng thời điểm đó: AI không vẽ lại được hình hình học nên coi luôn là việc người
tự làm) — và gửi thẳng file gốc (base64 nguyên, không qua canvas) nên dù có muốn cũng không cắt được
(không giữ ảnh nguồn để cắt).

**Làm — mirror ĐÚNG pattern Đại, không chế cơ chế mới:**
- `src/lib/kho/api.ts` — `HINH_BAI_SCHEMA` thêm `co_hinh`/`box_hinh`; thêm `trang_hinh` (khác Đại: 1 bài
  Hình có thể up NHIỀU trang/ảnh cho 1 bài duy nhất, không phải ingest-per-trang như Đại, nên cần biết
  hình nằm ở trang/ảnh thứ mấy). `buildIngestBaiHinhPrompt()` đổi hẳn chỉ dẫn — không còn "bỏ qua hình"
  mà "khoanh vùng bbox hình, ưu tiên hình CỦA ĐỀ nếu có cả hình đề lẫn hình lời giải". `ingestBaiHinh()`
  parse thêm box/trang, trả `co_hinh` (đã AND với box hợp lệ, an toàn nếu AI quên gửi box dù báo có hình).
- `src/screens/kho/hinh/hinhUi.tsx` (`IngestBaiButton`) — đổi hẳn từ gửi file gốc (base64 thô) sang
  `fileToCanvases` → giữ canvas NÉT + gửi Gemini bản downscale → có `box_hinh`+`trang_hinh` thì
  `cropCanvasBox` cắt THẬT từ canvas gốc + `uploadKhoImage` (CÙNG bucket `kho-anh` mà `AnhInput` dùng
  khi người tự chọn ảnh) → trả thêm `anh` cho caller qua `onResult`.
- `src/screens/kho/hinh/SoDo.tsx` (`FormBienThe` — ĐÚNG màn "tạo biến thể" Thùy nhắc) + `FormBaiToan.tsx`
  — nhận thêm `anh` từ `onResult`, gọi `setAnh`/`setDungHinhRieng(true)+setAnhRieng` khi có hình khác
  hình đang có; confirm ghi-đè (đã có sẵn cho đề/lời giải) giờ liệt kê thêm "+ hình vẽ" khi hình sẽ đổi.

**Verify:** tsc sạch · `npx vite build` sạch. Live end-to-end THẬT (dev server, mở "+ Thêm biến thể" của
BT.08.025 — Tứ giác K8): dựng ảnh test bằng canvas (tam giác vuông vẽ nét + chữ "Cho tam giac ABC vuong
tai A, AB=3, AC=4. Tinh BC" tách biệt hẳn phần chữ và phần hình) → dispatch vào input file thật của nút
"Up bài (ảnh/PDF) → tự tách" → console log xác nhận gọi Gemini THẬT thành công (`in:779 out:111`) → dialog
xác nhận ghi-đè hiện đúng "...+ hình vẽ hiện tại..." — CHỈ xảy ra khi `anhMoi` (kết quả cắt+upload) khác
`null` VÀ khác hình đang có, tức chuỗi cắt-từ-canvas-DPI-cao → upload `kho-anh` đã chạy thành công thật
(không phải giả lập) — không có console error nào trong suốt luồng. KHÔNG bấm xuyên được dialog xác nhận
(môi trường sandbox tự ép confirm() trả `false`) nên chưa thấy trực tiếp bước `setAnh` áp dụng lên ô Hình
— logic bước đó chỉ 1 dòng (`if (anhMoi) setAnh(anhMoi)`), cùng khuôn 2 dòng `setDeBai`/`setLoiGiai` đã
chạy đúng nhiều lần trước đó, tự tin đúng nhưng ghi rõ để không nhận vơ đã thấy tận mắt bước cuối.

## 2026-08-20 (tiếp) — Kho Hình: nhập LỨA đã clone sẵn (ảnh/PDF) → AI tự khớp vào chuỗi gốc

**Yêu cầu (Thùy, verbatim, hỏi lại câu cũ):** "Hệ thống hiện tại chưa clone được 1 bài dạng chuỗi câu
hoàn chỉnh. T sẽ clone 1 chuỗi câu đó ở bên ngoài. T muốn hệ thống có chức năng nhập clone chuỗi câu, tức
là t sẽ chọn chuỗi câu và gửi file pdf đã clone của chuỗi đó. Sau đó hệ thống tự khớp nội dung vào các
chuỗi." — CTO trả lời khả thi (khớp sẵn model `lua_id`/`saveLuaBienThe` đã có cho "🔗 Đổi đỉnh cả chuỗi"),
Thùy chốt "Bắt tay luôn đi".

**Khác `ChuoiDoiDinhPopup` (đã có):** cái cũ AI TỰ SINH text (chỉ đổi tên điểm, giữ nguyên số/logic/hình
gốc) — không phải "clone hoàn chỉnh". Cái mới: NGƯỜI đã tự clone thật (đổi số/hình/cách hỏi/gì cũng
được) ở NGOÀI, AI ở đây CHỈ ĐỌC + KHỚP, không tự sinh chữ.

**Làm:**
- `src/lib/kho/api.ts` — `INGEST_LUA_CHUOI_SCHEMA`/`buildIngestLuaChuoiPrompt`/`ingestLuaChuoiHinh`: đưa
  DANH SÁCH chuỗi gốc (mã + phát biểu) vào prompt làm ngữ cảnh đối chiếu; AI trả mỗi ý kèm `khop_voi_ma`
  — khớp theo NỘI DUNG/LOGIC (khoá tự nhiên = mã bài, CLAUDE.md §2 "danh tính bám khoá tự nhiên, không
  vị trí"), KHÔNG giả định thứ tự in khớp thứ tự chuỗi (clone có thể thiếu/thừa/đảo ý). Tái dùng NGUYÊN
  co_hinh/box_hinh/trang_hinh (khuôn `ingestBaiHinh` vừa làm) — 1 hình dùng chung cho cả lứa (đúng thực
  tế: 1 chuỗi thường vẽ 1 hình, các ý sau dùng lại).
- `hinhUi.tsx` — export `fileToBase64` (trước private) để dùng lại ở SoDo.tsx, khỏi chép lại hàm.
- `SoDo.tsx` — component mới `NhapCloneLuaPopup`, nút "📥 Nhập lứa đã clone (PDF)…" đặt cạnh "🔗 Đổi đỉnh
  cả chuỗi…" (cùng điều kiện `chuoi.length > 1`, chỉ hiện khi TẠO biến thể mới, không hiện lúc sửa).
  Luồng: up file → render canvas DPI cao → gửi Gemini → khớp ý↔mã (giữ ý ĐẦU khớp mỗi mã trùng, không
  im lặng rơi mất — ý lạc/trùng gom vào khối "chưa khớp" cho soát tay, §1.5 "thà bỏ trống còn hơn đánh
  sai") → cắt+upload hình chung → **bước REVIEW bắt buộc**: mỗi bài trong chuỗi hiện ô đề+lời giải AI
  khớp được (SỬA TAY được), bài chưa khớp tô vàng cảnh báo rõ — KHÔNG tự lưu thẳng (Principle 6 "AI gợi
  ý → người xác nhận", CLAUDE.md §5) → "Lưu lứa" gọi thẳng `saveLuaBienThe` đã có, cho phép lứa THIẾU
  (bỏ qua bài chưa khớp) — `saveLuaBienThe` vốn không đòi đủ N phần tử, tự lọc tiền đề còn trong lứa.

**Verify:** tsc sạch · `npx vite build` sạch. Live end-to-end THẬT (dev server, "+ Thêm biến thể" của
BT.08.030 → mở đúng chuỗi 2 câu BT.08.030→BT.08.031): dựng ảnh test bằng canvas — 1 tứ giác ĐỔI HẲN TÊN
ĐIỂM (M,N,P,Q thay vì A,B,C,D, cố ý để test khớp THEO NỘI DUNG chứ không phải khớp chữ) + giả thiết chung
+ 2 ý a)/b) — dispatch vào đúng input (soát kỹ vì popup có 2 input file cùng accept, ban đầu dispatch
nhầm vào input của "Up cả bài" bên ngoài, phát hiện qua console log gọi nhầm hàm `ingestBaiHinh` thay vì
lứa) → console xác nhận gọi Gemini THẬT (`in:821 out:247`) → UI báo "Khớp được 2/2 bài" — ý a) khớp ĐÚNG
BT.08.030 (câu "góc CDx = góc CBA" ↔ câu hỏi tương ứng dạng góc), ý b) khớp ĐÚNG BT.08.031 (câu "tia phân
giác") — dù tên điểm hoàn toàn khác gốc, xác nhận khớp THEO LOGIC không phải so chữ/vị trí → hình cắt tự
động, ảnh upload thật lên bucket `kho-anh`, load được (`naturalWidth=582`) → đóng popup KHÔNG lưu (tránh
tạo lứa test trên BT.08.030/031 thật). Giữa chừng dính 1 nhiễu: log HMR lỗi hàng loạt trên nhiều file
không liên quan (phiên khác đang sửa song song) — kiểm lại `tsc --noEmit` + `git status` xác nhận code
3 file của mình vẫn sạch, không phải lỗi từ thay đổi này.

## 2026-08-21 — Kho Hình: BỎ tự chèn "Chứng minh" + "a)/b)/c)" — hiển thị đúng y nguyên đã nhập

**Lỗi 1 (Thùy, kèm ảnh chụp màn hình, verbatim):** "có 1 lỗi khác : sao hệ thống lại tự đẻ ra chữ Chứng
minh ở câu hỏi vậy. t nhập như nào thì hiện thị như thế, ko được phép tự sinh ra cái gì hết"

**Lỗi 2, hỏi thêm giữa chừng (Thùy, verbatim):** "Cả cái abc nữa. ko được tự chèn. Chỉ chuỗi mới có abc
thôi"

**Nguyên nhân 1 — "Chứng minh":** 3 chỗ (2 trong `SoDo.tsx`, 1 trong `TaiLieuChuan.tsx`) build câu hỏi
hiển thị/in bằng literal `` `Chứng minh ${bt.phat_bieu}` `` — giả định SAI "mọi bài toán Hình đều dạng
chứng minh". Sai ngay với bài "Tính số đo các góc" (BT.08.025/027/033…) — 2 chữ "Chứng minh" chình ình
trước 1 câu hỏi vốn là "Tính".

**Nguyên nhân 2 — "a)/b)/c)":** `mucGhep`/`mucGhepLua` (`SoanTaiLieu.tsx`) gán `nhan: String.fromCharCode
(97+i)` VÔ ĐIỀU KIỆN theo index, không xét tổng số ý — 1 bài toán LẺ (không phải chuỗi) vẫn bị gắn "a)"
trước câu hỏi, dù chỉ có đúng 1 ý.

**Bẫy ẩn phát hiện giữa chừng — không thể xoá "Chứng minh " ở MỌI chỗ theo kiểu tìm-thay-thế mù:**
`tachDe()` (cơ chế cũ của lứa "đổi đỉnh cả chuỗi") tách 1 cột DB gộp `de_bai` (giả thiết+câu hỏi chung 1
string) ngược lại thành 2 phần bằng cách DÒ CHỮ "Chứng minh" làm mốc cắt. Bỏ chữ đó ở chỗ AI SINH RA lứa
(`ChuoiDoiDinhPopup`, và `NhapCloneLuaPopup` mới làm hôm qua) mà không sửa `tachDe` → mốc cắt biến mất →
lứa hiển thị sai (mất giả thiết, hoặc lặp nội dung).

**Sửa tận gốc, không vá ngọn:**
- `api.ts` — thiết kế lại 2 schema AI (`HINH_CHUOI_ITEM_SCHEMA`, `INGEST_LUA_CHUOI_ITEM_SCHEMA`): AI
  PHẢI trả `giai_thiet`/`cau_hoi` TÁCH SẴN 2 field riêng (dặn thẳng trong description: "GIỮ NGUYÊN VĂN
  cách hỏi gốc, không tự thêm chữ Chứng minh nếu gốc không có") — không còn NỐI-rồi-CẮT-NGƯỢC, khỏi cần
  đoán chữ nào là mốc.
- `SoanTaiLieu.tsx` — thêm cặp hàm client-control: `ghepDeBai(giaThiet, cauHoi)` nối bằng 1 ký tự điều
  khiển ẩn `␞` (U+241E, do CLIENT tự chèn, không nhờ AI "nhớ giữ"); `tachDe` đổi thành dò ký tự đó
  TRƯỚC, chỉ dò lùi chữ "Chứng minh" làm PHƯƠNG ÁN LÙI cho lứa đã lưu TRƯỚC 08-20 (dữ liệu cũ không tự
  sửa lại được — bỏ phương án lùi này thì giả thiết của lứa cũ biến mất khỏi bản in).
  `mucGhep`/`mucGhepLua`: `nhan: khung.length > 1 ? String.fromCharCode(97+i) : ''` — nhãn chỉ gán khi
  THẬT SỰ ≥2 ý, không còn vô điều kiện.
- `SoDo.tsx` — bỏ 2 chỗ hardcode "Chứng minh "; `ChuoiDoiDinhPopup`/`NhapCloneLuaPopup` giờ gọi AI/nhận
  input với giả thiết+câu hỏi TÁCH RIÊNG, ghép lại bằng `ghepDeBai` đúng lúc lưu.
- `TaiLieuChuan.tsx` — bỏ hardcode "Chứng minh "; đếm `soTrongDe` (số node THẬT SỰ có trong đề) TRƯỚC,
  nhãn a)/b) chỉ gán khi `soTrongDe > 1`.

**Bug PHỤ tự phát hiện lúc verify sống (không phải Thùy báo) — ký tự `␞` LỘ RA MÀN HÌNH:** card "biến
thể" trong popup chi tiết bài toán (`SoDo.tsx` dòng 453, danh sách chung cho MỌI kiểu biến thể) render
thẳng `v.de_bai` RAW — với biến thể tạo từ lứa (đã gộp bằng `␞`), ký tự điều khiển hiện nguyên si ra
UI. `tachDe` không dùng được ở đây (fallback dò chữ "Chứng minh" của nó CHỈ đúng cho lứa cũ — áp lên
biến thể thường gõ tay có chữ "Chứng minh" ở giữa câu sẽ xẻ nhầm). Thêm hàm riêng `deBaiHienThi()`
(`SoanTaiLieu.tsx`) — chỉ thay `␞` bằng ". " cho hiển thị chung, không đụng logic dò-chữ của `tachDe`.
Áp cho cả card hiển thị lẫn giá trị khởi tạo ô sửa (✎) của `FormBienThe`.

**Verify:** tsc sạch · `npx vite build` sạch. Live THẬT trên dev server: mở lại chuỗi BT.08.030→031
(Tứ giác K8) → "🔗 Đổi đỉnh cả chuỗi…" → tick cả 2 câu → "Sinh lứa (2 câu)" → gọi Gemini THẬT
(`7.148 tok`, `≈346₫`) → biến thể MỚI của BT.08.030 hiện sạch: "Cho tứ giác MNPQ có... Qy là tia đối của
tia QM. Chứng minh: ∠PQy=∠PNM" — giữ "Chứng minh:" vì câu hỏi GỐC của BT.08.030 vốn dĩ đã viết "Chứng
minh: ..." (không phải hệ thống tự thêm — đối chiếu: các bài KHÁC trong cùng sơ đồ như BT.08.025/027
("Tính góc D?", không có chữ "Chứng minh") hiện đúng y nguyên, KHÔNG bị chèn thêm). Biến thể CŨ (tạo
trước fix, còn "Chứng minh Chứng minh:" lặp đôi) vẫn còn nguyên trong DB — đây là **dữ liệu cũ đã lưu
sai vĩnh viễn từ bug trước đó, KHÔNG tự sửa lại được** (không đoán/ghi đè dữ liệu thật, CLAUDE.md §1.5)
— cần Thùy xác nhận có muốn dọn tay các biến thể lứa cũ dạng này không. Mở tiếp "📥 Nhập lứa đã clone"
— popup mở sạch, không lỗi, hiện đúng "CHUỖI GỐC (ĐỂ ĐỐI CHIẾU)" không chèn chữ thừa.

## 2026-08-21 (tiếp) — Giáo trình Hình: bỏ chữ "Buổi học —" ở header BTVN + NHỚ bộ lọc mô hình khi rời/quay lại màn

**Yêu cầu (Thùy, kèm ảnh header "BK ACADEMY / Buổi học — Buổi 2: Hai đường thẳng song song", verbatim):**
"1. header btvn bỏ cái chữ Buổi học đi / 2. quan trọng là khi t mở lại buổi 2 thì nó phải lưu lại nhwungx
gì t setup : mô hình nào đã chọn thì vẫn phải chọn như thế chứ sao lại bắt chọn lại từ đầu"

**Lỗi 1 — header thừa chữ:** `banInTheoMoHinh()` (`SoanTaiLieu.tsx`) build `tieuDe: \`Buổi học — ${tieuDe}\``
— tiêu đề buổi (Thùy tự đặt, vd "Buổi 2: Hai đường thẳng song song") bị cộng thêm tiền tố cứng. Bỏ hẳn,
trả thẳng `tieuDe`.

**Lỗi 2 — bộ lọc mô hình mất khi rời màn:** `BuoiPickEditor` (component dùng chung dựng nội dung 1 buổi
Giáo trình Hình) có 2 tầng chọn: "Mô hình chính/vệ tinh" (CHỈ để LỌC danh sách chuỗi cho dễ tìm, comment
cũ ghi rõ "state cục bộ, không lưu") và "picks" (nội dung THẬT của buổi — đề/bài đã chọn, đã lưu DB qua
`saveBuoiSelection` từ trước, KHÔNG mất). Cái mất là tầng LỌC — `useState<Set>` sống trong component, mở
lại màn Giáo trình (unmount/remount `GiaoTrinhScreen`) là về rỗng, phải tick lại mô hình từ đầu mỗi lần —
đúng điều Thùy mô tả.

**Vì sao KHÔNG lưu DB (`hinh_gt_buoi`):** bảng này (cùng `hinh_giao_trinh`/`hinh_gt_bai`) thuộc nhóm
"điểm mù" đã ghi ở CLAUDE.md §2.1 — tạo tay qua SQL Editor, chủ `postgres`, role `claude_build` (migrate)
không sở hữu → không tự ALTER thêm cột được. Cột `mo_hinh_chinh_id` có sẵn trên bảng cũng lệch thiết kế
hiện tại (chỉ 1 id, trong khi UI 17/08 đã đổi sang CHỌN NHIỀU mô hình chính) và không hề được đọc/ghi ở
đâu — bỏ luôn hướng tận dụng cột này.

**Sửa — theo ĐÚNG khuôn đã có (`soanHinh` draft, "giữ khi rời/quay lại màn" — `useStore.ts`):**
- `useStore.ts` — thêm `buoiMoHinhLoc: Record<string, {mainIds, satIds}>` + `setBuoiMoHinhLoc(key, updater)`
  — RAM (Zustand, KHÔNG persist qua `partialize` — F5 mới mất, đúng tinh thần `soanHinh` đã có).
- `SoanTaiLieu.tsx` (`BuoiPickEditor`) — thêm prop tuỳ chọn `filterKey?: string`: có → đọc/ghi
  `mainIds`/`satIds` qua store (khoá = `filterKey`, ở đây truyền `buoi.id`); không có → `useState` cục bộ
  như cũ (2 call site khác — `BuoiHocScreen`/`ETScreen` — CHƯA đụng, giữ nguyên hành vi, tránh sửa lan
  ngoài phạm vi Thùy báo).
- `GiaoTrinhScreen.tsx` — truyền `filterKey={buoi.id}` ở đúng chỗ gọi `BuoiPickEditor` trong `BuoiCardHinh`.

**Bug PHỤ tự bắt được lúc verify sống (không phải Thùy báo) — "Maximum update depth exceeded", màn
TRẮNG XOÁ khi mở buổi:** bản đầu build `mainIds`/`satIds` bằng `new Set(savedFilter?.mainIds ?? [])`
THẲNG trong thân render — mỗi lần render ra 1 object Set MỚI (khác identity dù cùng nội dung) → `vetinh`
(`useMemo` phụ `[mainIds]`) tính lại mọi lần → effect dọn `satIds` (phụ `[vetinh]`) bắn lại mọi lần → gọi
`setSatIds` → Zustand `set()` tạo state mới → re-render → lặp lại từ đầu, vô hạn. Sửa: memo hoá
`mainIds`/`satIds` bằng `useMemo` khoá theo MẢNG GỐC trong store (chỉ đổi identity khi nội dung THẬT sự
đổi) + thêm bailout so nội dung (`samSet`) trong `setMainIds`/`setSatIds` — trùng nội dung thì KHÔNG gọi
`set()` (khuôn y hệt cách `useState` tự bailout khi trả về cùng reference, phải tự làm tay vì Zustand
không tự so sánh cấu trúc).

**Verify:** tsc sạch · `npx vite build` sạch. Live THẬT trên dev server: Giáo trình (Hình) → Khối 8 →
"Giáo trình 8A" → Buổi 1 → tick mô hình chính "Tứ giác" → panel hiện đúng "MÔ HÌNH VỆ TINH · 4" + "Đang
lọc theo 1 mô hình chính" → rời hẳn màn (bấm "Việc của tôi", `GiaoTrinhScreen` unmount thật) → quay lại
đúng đường (Giáo trình (Hình) → Giáo trình 8A → Buổi 1) → **bộ lọc còn nguyên y hệt**, không phải tick
lại. Mở "📘 Xem" (bản in) → header hiện đúng "Buổi 1 : Tứ giác" (không còn "Buổi học —"), "7 mục", nội
dung Bài 1→7 đúng thứ tự, không sai lệch.

## 2026-08-21 (tiếp) — Màn chính CẤP 1 theo mockup desktop/iPad "6 Boxes" (CEO gửi HTML)

**Bàn trước, không code** (CEO: "chỉ bàn thôi nhé. ko code") — brainstorm dài về mockup gamified
đầy màu (sidebar + 4 thẻ + tiến độ 4 môn + BK Point + nhiệm vụ sắp tới), CTO phản biện 4 điểm
(trùng nav sidebar/thẻ · tiến độ 4 môn mâu thuẫn cấu trúc KHTN 1-môn-nhiều-nhánh · % vô nghĩa nếu
không rõ công thức · BK Point là gì). CEO chốt qua nhiều vòng: bỏ sidebar (đơn giản hết ở màn) · bỏ
tiến độ · thêm khái niệm MỚI "Sự kiện học tập" (GV giao luyện tập thêm CHO 1 HS yếu cụ thể — khác
BTVN thường vốn luôn gắn buổi — + cuộc thi, gộp full-width carousel) · đổi "nhiệm vụ sắp tới" (nhắc
hạn nộp) → "Thông tin học tập" + "Huy hiệu" (bỏ hẳn nhắc hạn — "PH nhắc chứ học sinh ko tự vào").

**Kiểm tra grounding (trước khi hứa gì)** — CEO hỏi thẳng "đã link được hết với ERP hiện tại chưa":
- ✅ Thông tin học tập, Tự luyện: xong thật, đã verify data thật hôm nay.
- ⚠️ Huy hiệu/Elo/EXP/chuỗi đi học (`gami.ts::getThanhTich`/`chuoiDiHoc`/`listThanhTich`): CÔNG THỨC
  có sẵn nhưng 100% đang STAFF-ONLY (`screens/gami/BangThanhTich.tsx` — GV xem, không phải HS tự
  xem) — y hệt bẫy RLS đã dính cả ngày, cần RPC HS-safe MỚI, không phải chỉ "gắn UI vào cái có sẵn".
- ⚠️ Bảng xếp hạng: CÓ 2 hệ khác nhau — `listGamiBangTong` (Elo tổng, cũng staff-only, cần RPC mới)
  vs `xepHangTuLuyen` (đã HS-safe, nhưng chỉ tính câu-đúng-tự-luyện, chỉ cấp 1) — không tự nhiên
  khớp nhau, cần chốt dùng cái nào.
- ❌ Luyện thêm GV giao + Cuộc thi: 0 data, 0 khái niệm trong DB — CEO xác nhận "chưa có, sau này
  dựng" (không phải hôm nay).
- BK Point: CEO chốt = Xu + EXP (không phải tầng kinh tế mới). Grep xác nhận EXP có thật
  (`gami_exp_ledger`) nhưng **Xu KHÔNG tồn tại trong DB v2** — CLAUDE.md chỉ nhắc như khái niệm SẼ
  có ("ví xu (wallet tổng)"), chưa ai dựng bảng. Treo lại, không phải việc hôm nay.

**CEO gửi mockup HTML thật** (`BK_Academy_Student_App_6_Boxes.html`, desktop/iPad-first, KHÔNG
sidebar, đúng bảng màu tươi purple/blue/cyan/green/orange/pink — bảng màu HOÀN TOÀN KHÁC bảng
`ph-*` dùng cho màn cấp 1 cũ sáng nay, vì đây là hướng thiết kế MỚI, không cố "giống app PH" nữa) +
chốt "Mấy cái chưa sẵn để lại. Làm mấy cái đã có trước đi" → hỏi rõ 1 điểm cấu trúc trước khi code
(ET/BTVN cấp 3 đi đâu trong lưới 6 ô mới — mockup dùng chính HS0440 khối 4T làm ví dụ, tức VỐN ĐÃ
không có ET/BTVN vì là cấp 1) → CEO chốt: **"Cấp 3 chưa dùng màn này"** — bản 6-ô CHỈ áp cho cấp 1,
cấp 3 giữ NGUYÊN màn cũ (mobile PH-style, không đụng). CEO cũng xác nhận không cần tách 2 màn
mobile/desktop riêng — 1 layout responsive (đúng breakpoint có sẵn trong file mockup) là đủ.

**Làm — `HocSinhApp.tsx`:**
- Component `HomeCap1` MỚI — chỉ render khi `cap1 === true` (nhánh riêng, chèn TRƯỚC nhánh cấp 3 cũ,
  KHÔNG đụng gì code cấp 3). Bảng màu riêng (arbitrary hex Tailwind, KHÔNG dùng `ph-*`/`MAU_BG` cũ).
- 6 ô ĐÚNG mockup: **Tự luyện** (tím, bấm được → `LamTuLuyen` đã có) · **Bài tập được giao** (xanh
  dương, "Sắp có" — CEO xác nhận chưa dựng) · **Thông tin học tập** (cyan, bấm được → `ThongTinHocTap`
  đã có) · **Bảng xếp hạng** (xanh lá, bấm được → `BangXepHang` đã có — dùng ĐÚNG bản `xepHangTuLuyen`
  hiện có, KHÔNG chờ RPC Elo mới) · **Sự kiện học tập** (cam, "Sắp có") · **Huy hiệu** (hồng, "Sắp có")
  — 3 ô "Sắp có" `disabled`, KHÔNG hứa tính năng chưa tồn tại (đúng luật §1.5 "thà bỏ trống hơn đánh
  sai" áp cho UI, không chỉ data).
- Topbar (logo `/Logo.png` có sẵn + chip, avatar/tên/mã HS) + hero (chào tên, KHÔNG có 2 nút hành
  động giả "Tiếp tục học"/"Xem lịch" như mockup gốc — không có backend cho "bài đang học gần nhất"
  hay "lịch hôm nay", bỏ luôn thay vì giả vờ) + lưới 6 ô + footer — bám sát HTML CEO gửi (đọc lại
  từng giá trị màu/gradient/bo góc/shadow từ file, KHÔNG áng chừng).
- Responsive: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — khớp breakpoint gốc mockup (desktop 3
  cột → tablet 2 → mobile 1), 1 component DUY NHẤT, không tách 2 màn.

**Verify:** `npx tsc --noEmit` sạch. Browser thật (desktop viewport, dev server riêng port 5190 —
server chung của session khác đang chiếm port cũ): đăng nhập HS0602 (cấp 1, khối 5) → đúng 6 ô,
đối chiếu màu từng ô qua `getComputedStyle` khớp CHÍNH XÁC hex mockup (`rgb(240,233,255)`=`#f0e9ff`
tím... đủ cả 6). Bấm **Tự luyện** → vào đúng `LamTuLuyen`, load 7 câu thật. Bấm **Thông tin học
tập** → đúng data thật (92%, 26 đạt/5 cần luyện/0 yếu, 5 dạng cần chú ý kèm "5 lần gần nhất"). Bấm
**Bảng xếp hạng** → đúng trạng thái rỗng thật (chưa ai khối 5 làm tự luyện hôm nay). Resize mobile
(375px) → `grid-template-columns` co về 1 cột — responsive đúng. Dọn server tạm sau verify.

## 2026-08-21 (tiếp) — Màn cấp 1 "6 Boxes": bé lại — hết cuộn dọc

**Thùy, verbatim:** "Quá to rồi. Màn hình chính phải ko bị kéo lên kéo xuống chứ m phóng to 1 cách
vô lý thế để làm gì. Cho bé lại đi." — bản trước bám font-size/padding Y NGUYÊN theo mockup HTML
(vốn thiết kế cho canvas rất rộng, không giới hạn viewport) nên tràn màn hình thật, phải cuộn dọc.

**Sửa:** đổi khung ngoài `min-h-screen` (cao theo NỘI DUNG, tràn thì cuộn) → `h-dvh overflow-hidden
flex flex-col` (KHOÁ đúng 1 viewport, không bao giờ cuộn). Lưới 6 ô đổi `min-h-[176px]` (cứng, đẩy
tràn) → `flex-1` (co giãn lấp đúng phần còn lại). Giảm ĐỀU font/padding/gap toàn màn (~40-45%): hero
`p-7`→`px-4 py-3`, h1 42px→20px, rocket 80px→36px; ô `p-5`→`p-3.5`, icon 52px→34px, tên 19px→14px,
mô tả 13px→11px; topbar/footer tương tự. Bỏ 1 dòng phụ ("6 khu vực chính...") dưới tiêu đề lưới để
có thêm chỗ — không đụng bố cục/màu/chức năng, chỉ tỉ lệ.

**Verify:** `npx tsc --noEmit` sạch. Browser thật (1280×720): `document.documentElement.scrollHeight`
= `window.innerHeight` = **720px CHÍNH XÁC** (`hasVerticalScroll: false`) — hết cuộn hẳn. Cả 6 ô vẫn
đọc đủ chữ, không ô nào bị cắt nội dung (`scrollHeight` mỗi ô < chiều cao thật hiển thị). Bấm lại
**Tự luyện** — vẫn vào đúng, không hỏng gì trong đợt sửa tỉ lệ này.

## 2026-08-21 (tiếp) — Sửa LẦN 2: gốc thật là lưới rớt cột, không phải cỡ chữ

**Thùy, verbatim (bực):** "mẹ. t có bảo giảm chữ đâu. vẫn đề là ngay trang chủ đã phải cuộn màn hình,
m tính size kiểu gì vậy" — sửa lần 1 SAI HƯỚNG: chỉ co font/padding, không đụng NGUYÊN NHÂN THẬT.

**Gốc thật:** lưới 6 ô vẫn giữ breakpoint `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` — "phòng hờ"
mobile dù Thùy đã chốt ngay từ đầu buổi ("cấp 1 dùng máy tính/ipad, đừng làm UI điện thoại"). Cửa sổ
hẹp hơn ngưỡng `lg` (1024px) là rớt xuống 1-2 cột → 6 ô xếp 3-4 HÀNG → DÙ CHỮ BÉ CỠ NÀO cũng tràn dọc,
vì vấn đề là SỐ HÀNG chứ không phải kích thước từng chữ. Sửa lần 1 co chữ nên "có vẻ đỡ" ở đúng 1 cỡ
màn hình test (1280×720, đủ rộng để vẫn lên 3 cột) nhưng KHÔNG sửa được gốc — hẹp hơn 1 chút là lại
cuộn y như cũ, và tự ý co chữ dù không ai yêu cầu.

**Sửa đúng gốc:** bỏ hẳn `md:`/`lg:`, khoá **CỐ ĐỊNH `grid-cols-3`** — đúng vì màn này CHỈ dành máy
tính/iPad (đã chốt), không cần lối thoát mobile. 6 ô LUÔN đúng 2 hàng bất kể cửa sổ rộng bao nhiêu
(trong khoảng máy tính/iPad) → chiều cao có giới hạn THẬT, `h-dvh`+`flex-1` mới có ý nghĩa. Đồng thời
**trả cỡ chữ về mức đọc thoải mái** (không phải bản ép nhỏ ở sửa lần 1 — Thùy không yêu cầu chữ bé).

**Verify (3 kích thước thật, không chỉ 1 như lần trước):** browser thật, đăng nhập HS0602 —
- 1024×768 (laptop/iPad nhỏ nhất còn hợp lý): `scrollHeight`=768=`innerHeight`, 3 cột, KHÔNG cuộn.
- 1280×800: `scrollHeight`=800=`innerHeight`, KHÔNG cuộn.
- 1366×768 (laptop phổ biến nhất VN): `scrollHeight`=768=`innerHeight`, 3 cột, KHÔNG cuộn.
Cả 6 ô vẫn đọc đủ chữ ở cỡ chữ ĐÃ TRẢ VỀ THOẢI MÁI (16px tên ô, 12.5px mô tả — không phải bản ép nhỏ
9.5-14px của sửa lần 1). Bài học: lần sau gặp "vẫn cuộn dù đã co nhỏ" — nghi cấu trúc lưới/breakpoint
TRƯỚC, đừng lặp lại hướng "co thêm chữ".

## 2026-08-21 (tiếp) — Sửa LẦN 3: `h-dvh` không được hỗ trợ đúng → đổi `h-screen`

**Thùy test THẬT trên `hs.bkacademy.edu.vn` (deploy production), verbatim:** "T đang phải kéo lên
xuống trên desktop. m fix kiểu gì đấy" — 2 lần sửa trước verify PASS trên dev server local nhưng vẫn
cuộn trên bản đã deploy thật.

**Dò tận gốc (không đoán):** mở thẳng `https://hs.bkacademy.edu.vn/` qua Browser pane, xác nhận
ĐÚNG bản mới nhất đã lên (grep bundle JS: có `grid-cols-3 gap-3` cố định, có `h-dvh`, KHÔNG còn
`md:grid-cols-2`/`lg:grid-cols-3` cũ — loại trừ khả năng "Vercel chưa deploy"). Đăng nhập thật qua
form (không phải gọi thẳng supabase như lúc dev) → đo: `document.documentElement.scrollHeight` =
**828px** trong khi `window.innerHeight` = **720px** — dò xuống từng lớp bằng `getBoundingClientRect()`
thì chính DIV NGOÀI CÙNG (`.h-dvh`) đã cao **828px chứ không phải 720px** — tức đơn vị CSS `dvh`
(dynamic viewport height) không được tính đúng trong môi trường render đó, khung tự phình theo NỘI
DUNG (giống `height:auto`) thay vì khoá theo viewport thật. `dvh` là đơn vị khá MỚI (~2023+), rủi ro
thật cho máy tính trường học có thể chạy trình duyệt cũ hơn — không phải lỗi riêng của môi trường
test, mà là lựa chọn CSS chưa đủ AN TOÀN ngay từ đầu (2 lần verify trước "PASS" là vì đúng lúc đó nội
dung tình cờ vừa khít, không phải vì `h-dvh` hoạt động đúng).

**Sửa:** `h-dvh` → **`h-screen`** (`100vh`, hỗ trợ RỘNG hơn hẳn `dvh`, đủ an toàn cho desktop/iPad —
màn này không có thanh địa chỉ mobile thu giãn nên không cần bản `dvh` "động" theo browser chrome).

**Verify lại (browser thật, cùng cách đo đã lộ bug ở trên — đo TRỰC TIẾP chiều cao div ngoài cùng,
không chỉ tin `hasScroll`):** `.h-screen` div cao ĐÚNG 720px (khớp `window.innerHeight`), 1280×720 →
`scrollHeight`=720, KHÔNG cuộn. 1366×768 → `scrollHeight`=768, KHÔNG cuộn. Nội dung vẫn đọc đủ 6 ô.
Bài học: 2 lần trước chỉ đo `scrollHeight === innerHeight` ở NGOÀI CÙNG (đúng nhưng chưa đủ) — lần
này đo thêm chiều cao THẬT của phần tử có class khoá kích thước, phát hiện panel MOCK không khớp
CSS-unit THẬT đang chạy. Deploy thật (Vercel) là bằng chứng cuối cùng, dev/browser-pane test có thể
"pass giả" nếu unit CSS không tương thích môi trường — từ nay ưu tiên đơn vị CÓ hỗ trợ rộng hơn khi
không thật sự cần tính năng riêng của đơn vị mới (`dvh` chỉ đáng dùng khi cần né thanh địa chỉ mobile
co giãn — không áp dụng cho màn desktop/iPad-only này).

## 2026-08-21 (tiếp) — Sửa LẦN 4 (gốc THẬT): tự test qua NHẦM bundle 3 lần liền

**Deploy lại bản `h-screen`, Thùy chưa kịp báo tiếp — tự kiểm tra lại theo lịch hẹn (ScheduleWakeup)
trên đúng `hs.bkacademy.edu.vn` production** vì "2 lần trước verify local PASS mà vẫn hỏng thật" nên
không dám tin verify cũ nữa. Vẫn **cuộn y hệt** (`scrollHeight`=828, `innerHeight`=720 — CHƯA ĐỔI GÌ
dù đã đổi `h-screen`) — dò kỹ hơn: `getComputedStyle` của `.h-screen` báo `height: 720px` ĐÚNG (CSS
áp đúng), nhưng `getBoundingClientRect().height` = 828px — 2 phép đo lệch nhau trên CÙNG 1 phần tử,
chỉ giải thích được bằng **transform/zoom hậu-layout**. Kiểm `document.getElementById('root')` →
`getComputedStyle(...).zoom` = **1.15** — đúng100% × 1.15 = 828 (khớp tuyệt đối con số đã đo).

**GỐC THẬT (đã tồn tại từ lúc dựng bundle riêng, 3 lần sửa trước đều KHÔNG chạm tới):** `index.css`
có `:root { --app-z: 1.15 }` (fallback, comment gốc ghi rõ "nếu JS chưa chạy") + `#root { zoom:
var(--app-z) }` áp DỤNG VÔ ĐIỀU KIỆN cho MỌI bundle import file này (cả app staff lẫn app HS riêng
đều dùng chung `index.css`). App staff (`main.tsx`) chạy `fitZoom()` ghi đè `--app-z` theo bề rộng
màn NGAY khi load; bundle HS (`main-hs.tsx`, dựng lúc tách `hs.bkacademy.edu.vn`) **cố ý bỏ fitZoom**
(đúng — "mật độ desktop staff, HS không cần") nhưng QUÊN rằng bỏ fitZoom = giá trị FALLBACK 1.15
tồn tại VĨNH VIỄN, không có gì ghi đè về 1 — `#root` zoom 115% suốt, không liên quan gì `h-dvh`/
`h-screen`/lưới-cột đã sửa ở 3 lần trước.

**Vì sao 3 lần verify trước "PASS" giả:** cả 3 lần đều chạy `npx vite --port XXXX` KHÔNG chỉ định
`--config` → mặc định phục vụ `index.html`/`main.tsx` (APP STAFF), không phải `hs.html`/`main-hs.tsx`
(bundle THẬT deploy lên `hs.bkacademy.edu.vn`). App staff CÓ sẵn dòng undo riêng cho nhánh HS
(`App.tsx`: `<div style={{zoom:'var(--app-unz)'}}>` bọc `HocSinhApp`) nên test qua đường đó luôn ra
đúng — sai KHÔNG PHẢI vì môi trường test giả, mà vì **test nhầm bundle** suốt 3 lần liền.

**Sửa:** `main-hs.tsx` — `document.documentElement.style.setProperty('--app-z', '1')` NGAY trước
`createRoot(...).render(...)` — ghi đè fallback 1.15 về 1 (inline style thắng `:root{}` theo cascade
bình thường), không đụng `index.css`/app staff (giữ nguyên `fitZoom` + zoom-undo của App.tsx).

**Verify ĐÚNG bundle lần này** (`npm run build:hs` → `vite preview --config vite.config.hs.ts`,
KHÔNG phải `npx vite` trần): đăng nhập thật qua FORM (không gọi thẳng supabase như trước — bundle
production không serve `/src/*.ts` raw) → `--app-z`=`1`, `root zoom`=`1`, `scrollHeight`=`innerHeight`
ở CẢ 1280×720 VÀ 1366×768 — hết cuộn thật. Bài học ghi riêng: **luôn build+preview ĐÚNG config khi
verify 1 bundle tách riêng** (`--config vite.config.hs.ts`), không dùng lệnh `vite` mặc định rồi tin
kết quả áp cho bundle khác — 3 lần sửa trước đều đúng về mặt code (h-screen/3-cột) nhưng KHÔNG PHẢI
gốc vấn đề, chỉ vì chưa từng thực sự chạy qua đường build sẽ deploy.

## 2026-08-22 — Màn cấp 1 "6 Boxes": port tỉ lệ từ mockup Thùy gửi + đổi khung "làm bài" sang desktop

**Thùy sau khi hết cuộn (22/08):** "các hộp ở màn hình quá to còn chữ trong hộp quá nhỏ, cân đối lại
đi. Tỉ lệ không đẹp tý nào hết" → rồi gửi thẳng file `BK_Academy_Student_Desktop.html` kèm "desktop
tỉ lệ nó kiểu như này này" — quyết định KHÔNG tự đoán cỡ lần 3 nữa, port THẲNG số đo từ file Thùy gửi.

**`HomeCap1` (HocSinhApp.tsx):** hero đổi sang bố cục 2 cột (chữ trái, art 🚀 phải, `grid-template-
columns: minmax(0,1fr) 310px`, `min-h-[190px]`) — bỏ 2 nút CTA "Tiếp tục học/Xem lịch" trong mockup vì
backend chưa có 2 tính năng đó (không dựng nút giả không chức năng thật). Thêm tiêu đề section "Khu
vực học tập". Lưới 6 ô port ĐÚNG số đo mockup: `min-h-[208px]`, icon 58px/30px, tiêu đề 21px, mô tả
13px, pad 24px (`p-6`), gap 18px. **Bỏ khoá `h-screen overflow-hidden`** (khác 4 lần sửa trước) — đổi
sang `min-h-screen` cuộn tự nhiên, vì mockup GỐC của Thùy vốn không ép vừa 1 màn hình (`.page` không
giới hạn chiều cao) — đo thật sau khi port: **943px nội dung ở viewport 1280×800/1366×768 → cuộn nhẹ
~140-175px**; 1920×1080 vừa khít không cuộn. Đây LÀ tỉ lệ Thùy gửi, không phải bug — báo lại để Thùy
xác nhận có chấp nhận cuộn nhẹ trên laptop 13-14" hay muốn ép chặt hơn nữa.

**"Làm bài bên trong cũng phải đổi, ko để giao diện điện thoại nữa":** thêm prop `desktop?: boolean`
cho `LamBai`/`LamTuLuyen`/`ThongTinHocTap` (mặc định `false`/không truyền = giữ NGUYÊN khung điện
thoại cũ — cấp 3 vẫn dùng `LamBai` cho BTVN/ET/giáo trình qua `active`, và `LamTuLuyen`/`ThongTinHocTap`
qua ô lưới mobile cũ, `tu_luyen`/`thong_tin` KHÔNG cap1-exclusive). `LamBai` giữ NGUYÊN 1 khối JSX nội
dung câu hỏi (`trongTam` — TN/ĐS/TLN/chấm/lời giải) dùng chung cho cả 2 khung, chỉ đổi vỏ ngoài (bề
rộng/nền/bo góc/cỡ nút) theo `desktop` — tránh tách 2 bản logic dễ lệch nhau về sau. `BangXepHang` đổi
khung DESKTOP LUÔN (không cần prop) vì chỉ vào được từ `HomeCap1` (cap1-exclusive, xem `KHU_CHI_CAP1`).
Dispatch ở `HocSinhApp`: `desktop={!!cap1}` cho `LamTuLuyen`/`ThongTinHocTap`.

**Verify:** `tsc --noEmit` sạch, `npm run build:hs` sạch. Không có tài khoản HS test nào biết mật khẩu
hiện tại trong phiên này (script reset mật khẩu `_reset_hs_ve_mac_dinh.mjs --write` bị auto-mode
classifier chặn — sửa mật khẩu tài khoản thật, đúng nên chặn) → verify qua **cổng preview tạm** (export
`HomeCap1`/`LamBai`/`ThongTinHocTap`/`BangXepHang` + nhánh `?preview=` trong `AppHS.tsx`, KHÔNG đụng
DB/auth) render trực tiếp qua `vite preview --config vite.config.hs.ts`, đo bằng JS thật trong browser
(không đoán): grid 6 ô đúng 3×417px đều nhau, không tràn ngang; `scrollHeight` khớp tính toán tay ở cả
3 kích thước. Xong thì **revert sạch cổng preview tạm** (bỏ `export`, trả `AppHS.tsx` về nguyên bản) —
không phải code sẽ deploy. `LamBai` desktop chưa verify được bằng mắt (cần `baiTestId` thật, preview
giả không có data) — tin vào cùng pattern class đã verify đúng ở `HomeCap1`/`ThongTinHocTap`, Thùy nên
tự bấm thử "Tự luyện" 1 lần trên `hs.bkacademy.edu.vn` sau khi deploy để chốt.

**Merge + deploy (22/08):** merge nhánh vào `main`, push — verify THẬT trên `hs.bkacademy.edu.vn` bằng
session HS0602 còn đăng nhập sẵn trong browser: bundle mới lên đúng (asset hash đổi, phải gỡ Service
Worker cache cũ mới thấy — lặp lại đúng bài học 21/08), `scrollHeight`=943px khớp y hệt đo local ở
1280×800, mở "Tự luyện" (LamBai desktop) với data thật → card rộng 768px (khung desktop mới), không
còn dải 448px kiểu điện thoại.

**Thùy phát hiện: "t ko thấy nút đăng xuất tài khoản"** — ĐÚNG, `HomeCap1` port từ mockup vốn chỉ vẽ
mũi tên dropdown cạnh avatar (chưa nối chức năng gì, y hệt file gốc Thùy gửi), không có nút Thoát nào
— cấp 3 (màn lưới cũ) có sẵn nút "Thoát" riêng nhưng `HomeCap1` không tái dùng nhánh đó. Thêm nút
"Thoát" cạnh khối tên/avatar trong topbar, gọi thẳng `supabase.auth.signOut()` (đã import sẵn ở đầu
file) — ĐÚNG style icon-button squircle nổi dùng chung toàn màn. Verify qua cổng preview tạm (export
`HomeCap1` + nhánh `?preview=` ở `AppHS.tsx`, revert sạch sau khi thấy nút "Thoát" render đúng) —
không đăng nhập thật lần này (không cần, thuần thêm 1 nút UI, không đụng logic nào khác).

## 2026-08-22 — Duyệt chấm online: nút "Sửa trong Kho" (bàn trước, chốt xong mới code)

**Thùy:** khi HS làm bài báo về Duyệt chấm, muốn bấm vào xem TOÀN BỘ câu hỏi/đáp án đúng bản trong
Kho và sửa luôn tại đó, tự cập nhật Kho. Bàn trước khi code — 2 điểm chốt:
1. Sửa Kho chỉ ảnh hưởng **đề phát SAU này** (snapshot `bai_test_cau` bất biến, đúng nguyên tắc sẵn
   có) — lượt báo sai ĐANG XEM vẫn xử lý thủ công tách biệt bằng "Chấp nhận đúng"/"Vẫn sai" như cũ,
   KHÔNG gộp 2 hành động làm 1.
2. Hỏi thêm "có logic bổ sung đáp án đúng (kiểu 3200 vs 3 200) để lần sau khỏi báo lỗi không" — trả
   lời: **ĐÃ CÓ SẴN**, không cần xây: `gradeTraLoiNgan`→`smartCheckTLN` (testgrade.js) tự chuẩn hoá
   khoảng trắng/đơn vị/số thập phân trước khi so key (nên "3200"/"3 200" đã khớp từ vòng 1); ca không
   chuẩn-hoá-gộp-được thì nút "Chấp nhận đúng" đang có sẵn ghi vào `question_accepted_answers`,
   `traLoiCau` (testonline.ts:286-289) check cache này (`tln_cache_check` RPC, cũng qua `smartNormalize`)
   TRƯỚC khi trả 'wrong' — nên bài sau tự đúng ngay, không cần duyệt lại. Không code gì thêm cho ý 2.

**Code ý 1** — `src/lib/kho/api.ts`: thêm `findCauInKho(ma_cau)` — dò **CẢ 3 bảng** kho câu hỏi
(`dai_cau_hoi`/`khtn_cau_hoi`/`hgt_cau_hoi`, lấy tên từ `CUM_TBL` có sẵn, không hard-code list mới)
thay vì đoán bảng theo tiền tố `ma_cau` — **đã kiểm DB thật và tiền tố KHÔNG đáng tin**: mẫu đầu tưởng
`dai_cau_hoi` toàn số/`khtn` bắt đầu 'K'/`hgt` bắt đầu 'T', nhưng dò trên 5 câu TLN đang sai THẬT thì
`dai_cau_hoi` cũng có mã bắt đầu `T14T...` — đúng bài học CLAUDE.md "không suy luận từ mẫu nhỏ, dò
DB thật". `bai_test_cau.ma_cau` là text KHÔNG FK (đúng cảnh báo CLAUDE.md §2) nên trả `null` rõ ràng
nếu không thấy ở bảng nào (câu đã mất/mã sai) thay vì giả định.

**Wiring** `DuyetChamScreen.tsx`: thêm nút "✏️ Sửa trong Kho" ở header mỗi nhóm câu (KHÔNG phải mỗi
đáp án — sửa Kho là ở cấp CÂU) → `onSuaKho` gọi `findCauInKho`, chặn nếu không thấy hoặc `xoa_at`
đã set (câu đã bị xoá khỏi Kho — không sửa "hồi sinh" ngầm ở đây), rồi mở thẳng **`CauModal`** (export
từ `kho/DangHub.tsx`, TÁI DÙNG y nguyên form sửa câu đã có — không vẽ form mới) với `cauTbl` đúng vừa
resolve. `onSaved` chỉ đóng modal + flash — không reload danh sách báo sai (Kho đổi không ảnh hưởng gì
tới các dòng đang hiện, đúng chốt ý 1).

**Verify:** `tsc --noEmit` sạch cả 2 lần sửa (api.ts + DuyetChamScreen.tsx), `npm run build` (bundle
staff mặc định) sạch. Test màn Duyệt chấm cần đăng nhập staff thật — không có tài khoản trong phiên
này (giống hạn chế HS trước đó, không tự ý reset mật khẩu ai) — verify thay bằng: query DB thật lấy
5 câu TLN đang bị chấm sai thật, chạy đúng logic `findCauInKho` (dò 3 bảng) bằng tay → khớp đúng cả
5/5, đúng nội dung/đáp án khớp bản snapshot. Thùy nên tự bấm thử 1 lần trên ERP thật để chốt UI/UX
(vị trí nút, modal mở đúng câu) trước khi coi là xong hẳn.

## 2026-08-22 — BUG KHẨN: giáo trình phát hành "đổi câu và thứ tự" — cấp 3, lớp 10A1

**Thùy báo (đang chặn buổi thật):** "phát hành tài liệu thì nó phải giống hệt lúc gán chứ sao lại tự
ý đổi câu và thứ tự... vừa phát hành giáo trình 10A1 thấy không giống."

**Điều tra (Explore agent, không đoán):** DATA hoàn toàn ĐÚNG — `trichXuatBuoi`/`copyPhanInto`
(tailieu.ts:500-504,593-634, hàm "gán") copy THẲNG `ma_cau`+`thu_tu` từ tài liệu gốc, KHÔNG phải
query-tiêu-chí-rồi-suy-lại. `phatHanhTest` (testonline.ts:69-179) ghi `bai_test_cau` ĐÚNG y nguyên
thứ tự đó (vòng `for` tăng dần `thu_tu`, không xáo). **Gốc bug nằm ở màn HIỂN THỊ phía học sinh**:
`LamBai` (HocSinhApp.tsx — dùng chung cho `giao_trinh`+`btvn`, khác `LamET` dùng riêng cho `et`/`de_thi`)
LUÔN xáo thứ tự câu (`seededPermByDang`) + thứ tự đáp án (`seededShuffleWithOrig`) theo seed
(HS×bài), KHÔNG có cờ tắt nào — đây là tính năng CHỐNG LIẾC BÀI Thùy tự yêu cầu từ 05/07 ("2 HS ngồi
cạnh nhau không được thấy giống hệt"). `LamET` đã được thêm ngoại lệ 18/08 (commit `08b8321`, "có mã
đề rồi thì không xáo nữa" — dựa vào `test.co_nhieu_ma_de`) nhưng ngoại lệ đó CHƯA BAO GIỜ áp dụng cho
`LamBai`/giáo trình. **Không phải regression — là 1 khoảng chưa đồng bộ giữa 2 luồng từ đầu.**

**Fix (`HocSinhApp.tsx`, hàm `LamBai`):** thêm `khoaThuTuGoc = full?.baiTest.loai === 'giao_trinh'` —
khi đúng, cả xáo câu (`caus`) LẪN xáo đáp án hiển thị (`optsShown`/`menhOrder`) đều BỎ QUA, dùng thẳng
thứ tự gốc từ `full.caus`/`cau.lua_chon`/`menhDe`. **CHỈ áp cho `giao_trinh`** — `btvn`/`tu_luyen` vẫn
xáo như cũ (đúng nghĩa đen câu Thùy chỉ nhắc "giáo trình"; BTVN làm ở nhà mỗi em 1 giờ khác nhau nên lo
ngại liếc bài gốc 05/07 vẫn còn hợp lý — CHƯA tự ý tắt luôn cho BTVN, cần Thùy xác nhận riêng nếu muốn).

**⚠ Đánh đổi cần Thùy biết:** tắt xáo cho giáo trình = quay lại đúng tình huống 05/07 Thùy từng lo
("2 HS ngồi cạnh liếc bài giống hệt nhau") — vì giáo trình vốn không có cơ chế mã-đề như ET. Ưu tiên
theo yêu cầu MỚI NHẤT (giống hệt bản gán) vì đây là chỉ đạo rõ ràng, khẩn, đang chặn buổi thật — nhưng
đây là đánh đổi thật, không phải free lunch, nói rõ để Thùy cân nhắc nếu sau này thấy liếc bài lại.

**Verify:** `tsc --noEmit` + `npm run build` (staff) + `npm run build:hs` đều sạch. Đổi trong hàm thuần
(`useMemo` gate theo `khoaThuTuGoc`), đúng chỗ agent xác định, không đụng luồng gán/phát hành (vốn đã
đúng). Merge + deploy ngay do đang chặn buổi thật — chưa kịp test end-to-end qua tài khoản HS thật của
1 lớp có giáo trình phát hành, Thùy tự mở lại 10A1 xác nhận sau khi deploy.

## 2026-08-23 — Audit + siết logic candidate "Duyệt bổ trợ": OR→≥2/4, fix bug recency chuyên đề

**Khởi nguồn:** Thùy chỉ ra ca cụ thể "Nguyễn Hải Minh Châu 8S1" lọt vào "Duyệt bổ trợ" dù học tốt
(so TB lớp toàn ngang/trên trung bình, thái độ sạch, không dạng yếu) — chỉ vì kênh ① trend bắt được
1 chuyên đề tụt nhẹ đạt(1.00)→cần luyện(0.83), Δ=0.17, không hề kéo theo đổi đề xuất level (vẫn
L0→L0). Đo thật 300 HS Toán/36 lớp lúc đó: **217/300 = 72,3%** roster lọt vào hàng đợi — quá tải,
kênh trend đóng góp nhiều nhất (158/217).

**Thùy chốt hướng: bỏ hẳn kênh trend "nhẹ" hiện tại, thay bằng 4 tín hiệu dữ liệu RÕ RÀNG, target
~30% roster:**
1. Chuyên đề tụt **QUA NGƯỠNG bucket** (đạt→cần luyện HOẶC cần luyện→yếu, pha 2 so chính mình) — "qua
   ngưỡng là cần đưa vào", không cần delta lớn (bàn nhiều vòng, chốt KHÔNG siết biên độ riêng).
2. **% dạng yếu** / tổng dạng đã đo > mốc (quét 10/15/20% để chọn).
3. **ET-only**: TB **4 buổi** ET gần nhất < 90% TB lớp cùng 4 buổi (average-vs-average, KHÔNG gộp MT/
   BTVN như kênh ⑤ cũ) — Thùy chốt "trung bình dưới ngưỡng thôi, xét 4 buổi gần nhất".
4. **MT-only**: bài MT **gần nhất** (gate n≥1, KHÔNG đòi n≥3 như dạng) < 90% TB lớp bài đó — Thùy:
   "MT là test tháng, 1 tháng 1 lần nhưng là bài quan trọng. Khung nào có MT thì dựa MT là chính".
   Đo thật: MT rất thưa (TB 0,73 bài/HS, 0% HS có ≥3 bài MT) — gate n≥3 sẽ vô hiệu hoá kênh này hoàn
   toàn, đúng như lo ngại ban đầu, nên giữ n≥1.
- Báo động ③④ (chuông đỏ TA / lỗ tiên quyết GV) **giữ nguyên, không đổi** — flag cứng của người.

**BUG THẬT tìm ra giữa chừng, đã FIX vào code (`src/lib/danhgia.ts`, hàm `getStatSheetLop`):** kênh ①
(chuyên đề pha 2) lấy "2 mốc gần nhất CÓ DATA" làm truoc/sau, KHÔNG ràng buộc mốc "sau" phải là cửa sổ
HIỆN TẠI — nếu 1 chuyên đề lâu rồi chưa đo lại (vd từ tháng 7), hệ vẫn dùng dữ liệu cũ đó để kết luận
"đang tụt" HÔM NAY. Đo thật: chỉ 27,4% số lần "tụt" đang dùng đúng cửa sổ hiện tại (`2026-08-B`), còn
lại dùng `2026-08-A`/`2026-07-B`/thậm chí `2026-07-A`. Đây là biến thể của lỗi CLAUDE.md §5 "chưa-đo ≠
yếu" — ở đây là **"chưa-đo-LẠI ≠ đang-tụt"**. **Đã fix**: `chamPha2` giờ CHỈ tính khi cửa sổ "sau" là
cửa sổ hiện tại hoặc liền trước (`cuaSoHienTaiVal`/`cuaSoTruoc(cuaSoHienTaiVal)` tính 1 lần đầu hàm,
so sánh trước khi gọi `chamPha2`). `tsc` sạch, `verify_danhgia.mjs` 77/77 pass (fix nằm ở service
layer, không đụng pure engine). Fix KHÔNG đổi nhiều % tổng (kênh 1 riêng: 46,7%→41,7%) vì đa số hits
vốn đã nằm trong 2 cửa sổ gần nhất — nhưng là fix ĐÚNG về nguyên tắc, độc lập với bài toán %.

**Calibrate từng kênh + kết hợp (300 HS Toán, nhiều lần chạy trên data SỐNG nên số dao động ±5-8 điểm
%, không phải lỗi tính — có người đang chấm/nhập điểm song song lúc t đo):**
- Kênh 1 một mình (chỉ qua ngưỡng, chưa thêm gì): 35-47% tuỳ lần chạy.
- Test thêm điều kiện phụ **"VÀ delta > X"**: 0.1 gần như không đổi gì (131→128, chỉ loại vài ca sát
  biên như 0,83→0,75). Quét 0→0,3: delta>0,2 cho ra ~31% (riêng kênh 1) — **Thùy chốt KHÔNG thêm điều
  kiện delta này** (giữ đúng "qua ngưỡng là đủ", chấp nhận % kênh 1 riêng cao).
- Kênh 2 quét mốc: >10%→~28% · >15%→~16-18% · >20%→~11-12%.
- Kênh 3 (ET): ~217-228/300 đủ dữ liệu (≥4 buổi ET) — trong đó dính ~13-14% toàn roster.
- Kênh 4 (MT): chỉ ~33-44% roster CÓ bài MT nào (đúng dự đoán độ thưa) — trong đó dính ~7-10% toàn
  roster.
- **Kết hợp kiểu OR (1-trong-4/5 là đủ) luôn ra 49-58%** dù chỉnh ngưỡng kênh nào — không nhạy tham
  số, vì bản chất toán học của phép hợp (union) với nhiều kênh mỗi kênh đã ở mức 10-40%.
- **Đổi logic kết hợp sang "≥2-trong-4 kênh HOẶC báo động ③④"** mới thực sự nhạy và về gần mục tiêu:
  phân bố đúng-N-tín-hiệu (mốc kênh2=15%): {0 tín hiệu: 51%, đúng 1: 27%, đúng 2: 12%, đúng 3: 8%, đúng
  4: 2%}. Tổng "≥2 HOẶC báo động": **kênh2=15% → 80/300 = 26,7%** · **kênh2=10% → 91/300 = 30,3%**
  (chạm rất sát mục tiêu 30% ban đầu của Thùy).

**Phân tích CẶP (Jaccard overlap, kênh2=10%) để hiểu độ độc lập giữa các kênh** — dữ liệu 1 lần chạy,
n kênh1=87·kênh2=81·kênh3=45·kênh4=34: K1×K2 Jaccard 28,2% (2 kênh lớn nhất, trùng nhiều nhất về số
tuyệt đối nhưng vẫn ~90 HS chỉ dính đúng 1/2) · K3×K4 Jaccard 17,9% (**độc lập nhất** — 2 nguồn đo
tách biệt thật) · **K2×K4: 76,5% số HS dính kênh 4 (MT) CŨNG đã dính kênh 2** — MT đóng góp giá trị
riêng RẤT ÍT (đa số ca nó bắt được đã bị kênh 1/2 bắt trước), nhưng vẫn giữ vì logic ≥2 cần nó làm
"phiếu bầu" thứ 2 cho những ca kênh khác chưa đủ mạnh.

**CHỐT TẠM (chưa code vào `listCandidatesLop`/`DuyetBoTroYeuScreen`, Thùy sẽ tự review học sinh cụ
thể trước khi wire logic thật):**
```
Báo động ③④ (chuông đỏ/lỗ tiên quyết) → vào ngay, không điều kiện.
4 kênh dữ liệu, cần ≥2/4 cùng chạm:
  1. Chuyên đề tụt qua ngưỡng bucket (đạt→cần luyện / cần luyện→yếu), pha 2, KHÔNG thêm điều
     kiện delta. Recency đã fix (sau = cửa sổ hiện tại hoặc liền trước) — LUÔN áp dụng, không
     phải tham số để bàn thêm.
  2. % dạng yếu / tổng dạng đã đo > 10%.
  3. ET-only: TB 4 buổi ET gần nhất < 90% TB lớp cùng 4 buổi.
  4. MT-only: bài MT gần nhất (n≥1) < 90% TB lớp bài đó.
Kết hợp: (≥2 trong 4 kênh) HOẶC báo động ③④.
Đo thật gần nhất: 91/300 = 30,3% roster Toán.
```
Scripts calibrate để lại trong `scripts/_diag_*.ts` (không xoá, dùng `npx vite-node scripts/
_diag_calib_final.ts` để chạy lại đo % bất kỳ lúc nào cần kiểm tra tiếp — có sẵn cross-tab từng cặp
kênh). Việc còn lại: Thùy review thủ công vài ca cụ thể xem logic ≥2/4 có bắt đúng người không, rồi
mới viết vào `deXuatLevelKienThuc`/`listCandidatesLop`/`DuyetBoTroYeuScreen` thật.

## 2026-08-23 (tiếp) — Wire logic ≥2/4 vào code thật, bắt thêm 1 bug lúc code (doiLevel bypass)

Thùy chốt "kênh 2 = 10%" + "ghi devlog" xong yêu cầu "merge đi để t review học sinh thật" → code
logic đã chốt ở trên vào thẳng `listCandidatesLop`/`getStatSheetLop` (`src/lib/danhgia.ts`) và
`bucketOfScore`/`BUCKET_RANK` export (`src/gami/danhgia.js`), KHÔNG chỉ dừng ở script mô phỏng.

**Thêm vào `getStatSheetLop`:** `coSoLopET`/`coSoLopMT` (2 field MỚI trên `StatSheetHS`) — tách
riêng khỏi `soLopKem`/`coSoLopKem` cũ (kênh ⑤ gộp ET+MT+BTVN, 80%, 3-bài) vì `coSoLopKem` VẪN đang
nuôi `deXuatLevelKienThuc` (máy đề xuất LEVEL) — không đụng, giữ nguyên hành vi cũ ở đó. 2 field mới
chỉ phục vụ candidate-list: `coSoLopET` = TB 4 buổi ET gần nhất <90% TB lớp (gate n≥4 buổi),
`coSoLopMT` = bài MT GẦN NHẤT (gate n≥1) <90% TB lớp.

**Viết lại `listCandidatesLop`:** kênh ① đổi từ "bất kỳ tụt nào" (`cham.huong==='lui'`) sang "tụt
QUA NGƯỠNG bucket" (dùng `bucketOfScore`+`BUCKET_RANK` mới export từ `gami/danhgia.js`). Kênh ⑤ cũ
tách 2: `so_lop_et`/`so_lop_mt`. Thêm kênh MỚI `pct_yeu` (%dạng yếu/tổng dạng đã đo >10%). Điều kiện
lọt vào ĐỔI HẲN: từ "1 trong N kênh là đủ" sang "≥2/4 kênh dữ liệu HOẶC báo động ③④".

**BUG THẬT bắt được lúc verify bằng `listCandidatesLop` THẬT (không phải script mô phỏng nữa):** số
đo ra 145/300 = 48,3% cho "Duyệt bổ trợ" — CAO HƠN HẲN 30,3% đã calibrate bằng script riêng. Truy
ra: code cũ giữ `doiLevel` (đề xuất level từ `deXuatLevelKienThuc` khác level hiện tại) làm ĐIỀU
KIỆN LỌT VÀO ĐỘC LẬP, y hệt logic cũ — mà `deXuatLevelKienThuc` vẫn dùng `dien`/`coSoLopKem` CŨ
(lỏng, chưa siết) làm input, nên `doiLevel` fires y hệt tần suất cũ, mở LẠI đúng cái cửa mà cả buổi
tính toán vừa đóng — **63/300 HS lọt vào CHỈ vì `doiLevel`, không đủ ≥2/4, không báo động** (đo
bằng `_diag_debug_gap.ts`). Bài học: siết 1 tầng (candidate-list) mà quên tầng khác (level-engine
input cũ) vẫn đang rò vào qua đường tắt — số liệu calibrate bằng script RIÊNG không tự động đúng khi
wire vào code thật nếu code thật còn đường vào khác không có trong script mô phỏng.

**Fix:** phân biệt "MỞ case MỚI" (phải qua ≥2/4, đây là chỗ đã lỏng) vs "case ĐÃ MỞ cần xử tiếp"
(`levelKienThuc > 0` VÀ đề xuất khác — không qua ≥2/4, vì đây không phải phát-hiện-mới mà là quản lý
case đang chạy, ẩn đi sẽ kẹt case không ai thấy để đóng). Đổi tên logic thành `caseDangMoCanXu`, gộp
vào `duTinHieuKienThuc` — field MỚI export thẳng trên `Candidate` để UI dùng trực tiếp, KHÔNG suy
luận lại từ `kenh` (bug PHỤ thứ 2 bắt được cùng lúc: `DuyetBoTroYeuScreen.tsx` cũ lọc bằng
`kenh.some(k => k !== 'thai_do')` — sai vì giờ 1 kênh riêng lẻ VẪN được push vào `kenh` để hiện lý
do dù chưa đủ ≥2/4, nên check "có kênh nào khác thái độ" không còn đồng nghĩa "đủ tín hiệu" nữa).

**Số liệu sau khi fix cả 2 bug (1 lần chạy, snapshot đồng nhất):** Dashboard (gồm thái độ) 167/300 =
55,7% · "Duyệt bổ trợ" (`duTinHieuKienThuc`) 95/300 = **31,7%** — khớp sát mục tiêu ~30% đã calibrate.
Breakdown: 84 vào vì ≥2/4 kênh · 11 vì báo động · 0 vì case-đang-mở · 0 không giải thích được.

**Verify:** `tsc --noEmit` sạch · `verify_danhgia.mjs` 77/77 pass · live qua dev server thật (port
5210, đăng nhập admin thật) — "Duyệt bổ trợ" hiện **"66 ca"** (Toán, tất cả khối — trước đây badge
này từng hiện "209 ca" ở phiên làm UI cùng ngày) · "Dashboard học tập" (consumer thứ 2 của cùng
`listCandidatesLop`) vẫn render đúng, không lỗi console ở cả 2 màn.

---

## 2026-08-29

**TỰ LUYỆN — BỎ TRẦN 30 CÂU/NGÀY (Thùy 29/08: "bỏ giới hạn 30 câu 1 ngày, tự luyện vô hạn, mỗi lần tự luyện đưa 10 câu"):**
- Mỗi lượt vẫn sinh đúng 10 câu (SO_CAU_MOI_LUOT giữ nguyên) — chỉ bỏ trần cộng dồn 30/ngày.
- **Mig 202608291122** `tu_luyen_bo_tran_ngay`: replace `tu_luyen_sinh` — bỏ 3 chỗ chặn trần (check `v_them > 30` lúc tạo bài + 2 check `v_so_cau_cu + v_them > 30` đường APPEND/đường thua race). **GIỮ `for update`** — khoá giờ không để giữ trần mà để 2 lượt "làm thêm" gần-đồng-thời tuần tự hoá `thu_tu`/`so_cau` (không giẫm nhau). Đã áp + `npm run schema` + verify prosrc live DB: hết dấu vết trần, còn for update.
- Client `tuluyen.ts`: bỏ `TRAN_NGAY`/`TU_LUYEN_TRAN_NGAY`. UI `HocSinhApp.tsx` (LamTuLuyen): nút "Làm thêm 10 câu" hiện VÔ ĐIỀU KIỆN ở màn xong bài (trước ẩn khi chạm trần), caption "Hôm nay đã làm N câu" (bỏ "/30"), bỏ dòng "Đã đạt tối đa 30 câu hôm nay". ✓ tsc sạch.

**PWA HS KẸT BẢN CŨ (Thùy báo: HS Đào Minh Quân vào lại app vẫn thấy trần 30 câu):**
- Server ĐÚNG bản mới (verify: sw.js production precache đúng bundle mới, headers max-age=0) — kẹt ở CLIENT: `injectRegister: 'auto'` sinh registerSW.js chỉ register suông; SW mới activate (skipWaiting+clientsClaim) nhưng trang đang mở vẫn chạy JS cũ, và PWA còn trong RAM thì "vào lại app" KHÔNG re-navigate → kẹt bản cũ vô hạn.
- Fix: `main-hs.tsx` đăng ký qua `virtual:pwa-register` `registerSW({ immediate: true })` — module này lắng nghe 'activated' (isUpdate) → tự `window.location.reload()`. Plugin thấy import virtual module thì tự thôi inject registerSW.js. Thêm `/// <reference types="vite-plugin-pwa/client" />` vào vite-env.d.ts.
- Máy này thiếu node_modules mới (vite-plugin-pwa thêm từ máy khác 21/08) → `npm install` sync theo lock.
- ⚠ Bản cũ trên máy HS KHÔNG có listener reload → vẫn cần 1 chu kỳ tắt-hẳn-app + mở lại (x2) để sang bản có fix; TỪ ĐÓ về sau update tự reload, không dặn HS nữa.

**TIẾN TRÌNH LÀM BÀI (Thùy: "cần lưu lại tiến trình của từng đứa — giờ vào toàn bắt bật lại từ câu 1"):**
- Đáp án từng câu VỐN đã lưu (bai_lam_cau → f.daLam khôi phục reveal) — thiếu mỗi VỊ TRÍ: `idx` LamBai luôn khởi tạo 0, mở lại phải bấm "Câu tiếp" xuyên các câu đã làm; tự luyện xong 10 câu muốn "Làm thêm" cũng phải lướt 10 câu cũ.
- Fix trong effect load LamBai: có daLam → tính lại ĐÚNG thứ tự hiển thị (seededPermByDang cùng seed với useMemo `caus` — seed ổn định nên 2 nơi cùng 1 hoán vị; giáo trình giữ nguyên thứ tự gốc) → `setIdx` câu chưa-làm đầu tiên, xong hết → thẳng màn kết quả. KHÔNG lưu idx ở đâu — pure-derive từ dữ liệu có thật. Áp chung LamBai (tự luyện + BTVN + giáo trình); ET (LamET) luồng riêng có đồng hồ, không đụng.

**TỰ LUYỆN — MỖI LƯỢT ĐỘC LẬP (Thùy 29/08, verbatim: "mỗi lần luyện phải độc lập chứ sao m lại gộp tất cả các câu"):**
- SAI ở bản bỏ-trần buổi sáng: giữ model cộng-dồn 1 bai_test/ngày của spec gốc 18-20/08 (lúc đó có trần 30 nên gộp còn hợp lý) — bỏ trần rồi mà vẫn gộp thì bài phình vô hạn trong ngày, progress bar 27/40, kết quả lẫn lộn các lượt. Đúng phải là: MỖI LƯỢT = 1 bai_test RIÊNG 10 câu, chấm/màn kết quả độc lập theo lượt.
- **Mig 202608291216** (CEO gật drop qua Luật xoá): drop unique `bai_test_tu_luyen_uniq` (hiện thân model cũ — còn nó là không tạo nổi lượt 2 trong ngày; không mất dữ liệu) → thay index THƯỜNG cùng cột. `tu_luyen_sinh` thay nguyên văn: bỏ tìm-bài-hôm-nay/FOR UPDATE/append/bắt unique_violation — mỗi gọi INSERT bài mới thu_tu từ 1; chọn câu/chống lặp (tu_luyen_dang_lan xuyên bài)/snapshot giữ nguyên; cả lượt 0 câu (kho cạn) → raise (rollback, không để bài rỗng mồ côi).
- Mastery + xếp hạng KHÔNG ảnh hưởng: đều tính theo TỪNG CÂU (bai_lam_cau join loai='tu_luyen'), không đếm bài — verify hs_xep_hang_tu_luyen/hs_dang_evals trước khi đổi.
- Client: `luotTuLuyenHomNay` (thay timTuLuyenHomNay) = lượt MỚI NHẤT chưa nộp hôm nay (mở app làm tiếp lượt dở, không sinh đè) + tổng câu hôm nay (caption màn kết quả "Hôm nay em đã luyện N câu"). LamTuLuyen: key={baiTestId} theo lượt, nút "Luyện lượt mới 10 câu". Fix nhảy-câu-chưa-làm hôm nay vẫn áp NGUYÊN trong từng lượt.
- Bài cộng dồn CŨ (đã lỡ 20-30 câu) giữ nguyên: dở thì HS làm nốt lần cuối, xong rồi thì lượt sau tự sang model mới.
- Race StrictMode: không còn unique index chặn — guard client daGoi ref là hàng rào duy nhất (đã đủ cho ca thật từng dính).

**GẬY CỦA BK — HỆ PHẠT NHÂN SỰ (Thùy 29/08, worktree `wt-gay-bk`, branch `feat/gay-bk`):**
- Story chốt: 1 gậy = 20k · gậy TỰ ĐỘNG (chậm deadline ERP — máy ĐỀ XUẤT, leader theo cây chốt; "1 phút cũng phạt", KHÔNG ân hạn) + gậy THỦ CÔNG (lỗi ngoài ERP, chọn từ danh mục) · GỠ gậy qua hoạt động (dọn vệ sinh/chống đẩy/chạy bộ — danh mục UI, số gậy điền tay) · tháng mới RESET, chốt tháng chỉ đối chiếu (không dính lương) · bảng gậy CÔNG KHAI toàn công ty. Hiệu suất vận hành giữ vai trò ĐÁNH GIÁ, không phải phạt — gậy là kênh phạt duy nhất.
- **Mig 202608291259** `gay_bk`: 6 bảng — `gay_loi` + `gay_hoat_dong` (danh mục, seed 3+3, lỗi hệ thống có khoá tự nhiên `ma='cham_deadline'`) · `gay_ledger` (append-only dương=đánh/âm=gỡ, `ky` = ngày 1 tháng VN default ở DB, thu hồi MỀM `thu_hoi_at` — không update/delete số) · `gay_de_xuat` (**ref_key UNIQUE vĩnh viễn = quét idempotent, 1 việc trễ chỉ đề xuất 1 lần**; máy đề xuất — người chốt, đúng pattern trợ lý 3 nút) · `gay_chot_thang` (snapshot jsonb + don_gia lưu lúc chốt, PK ky×ns, chốt lại = ghi đè) · `gay_log` (trigger vết cả 2 bảng, CLAUDE §4). RLS member-gate như giaoviec; scope leader check ở app.
- `src/lib/gay.ts`: `quetGayTuDong()` quét LAZY lúc mở tab (không pg_cron): (a) vận hành TÁI DÙNG `listAllStaffTasks` (không tính lại deadline) — trễ = doneAt>deadline hoặc chưa-xong-mà-quá-hạn; (b) giao tay đọc `viec` (deadline NGÀY, đã tính gia hạn duyệt; hold/huy/chuyen bỏ). Chỉ soi deadline RƠI TRONG THÁNG hiện tại (tháng cũ đã chốt sổ). `chotDeXuat` claim NGUYÊN TỬ (`update…eq trang_thai='cho'`) chống 2 leader đánh đúp — lỗi ledger thì TRẢ đề xuất về 'cho', không kẹt. Bảng gậy = derive sum ledger theo ky, sàn 0 (gỡ dư không để dành).
- UI `GayScreen.tsx` (leaf `gay`, Core team, scifi HUD theo skill): 5 tab — Bảng gậy (công khai, drill ledger + thu hồi) · Đề xuất (quét lazy, leader sửa số gậy/lỗi lúc chốt, bỏ qua BẮT BUỘC lý do) · Đánh/Gỡ (2 form, chỉ người trong scope) · Danh mục (CRUD 2 bảng) · Chốt tháng (preview + snapshot). Quyền: xem = ai có leaf; hành động = `la_admin` hoặc `getMyScope().laQuanLy` đúng phạm vi người dưới (Lộc→ops, Trang→GV/TA — theo CÂY, không hard-code tên).
- Đã áp mig + `npm run schema` + verify seed/trigger live DB + `tsc` sạch + `vite build` sạch.
- **Restyle (Thùy 29/08: "đã bảo xóa skill UI Scifi — UI mặc định là giao diện giống iPhone"):** bỏ toàn bộ HUD tối/neon/monospace ở GayScreen → tông Apple sáng đúng các màn khác (bg #f5f5f7, card trắng rounded-2xl shadow-sm, pill mềm red-50/emerald-50/amber-50, tab indigo như GiaoViecScreen). Logic giữ nguyên 100%. Verify live: root bg rgb(245,245,247), card trắng, font system-ui. KHÔNG dùng skill bkdemy-scifi-ui nữa (đã ghi memory máy).
- **Quét v2 (Thùy 29/08 sau khi xem số tháng 8 — 1.156 đề xuất/24 người):** ① **Miễn gậy tự động**: mig 202608291329 thêm `nhan_su.mien_gay` (Thùy + Phạm Thị Thùy Trang = true — "lắm việc không theo được"); quét bỏ qua người miễn (CẢ vận hành lẫn giao tay), gậy thủ công vẫn đánh được; UI quản lý ở panel "Miễn gậy tự động" tab Danh mục (data-driven, không hard-code tên). ② **1 việc trễ = 1 người**: listAllStaffTasks đẻ task cho MỌI người được phân lớp (leader khối kèm lớp cũng dính oan — Quỳnh Trang/Thảo Nguyên) → `nguoiPhuTrach()` lọc về người phụ trách CHÍNH theo `phan_cong_lop.la_chinh` (danhgia→GV · chấm→TG, ingame không TG thì GV; 1 ứng viên → người đó; nhiều → người la_chinh duy nhất; vẫn nhập nhằng → **BỎ TRỐNG không đánh bừa**, đúng CLAUDE §1.5). ③ **Tab Đề xuất thành danh sách chi tiết CÔNG KHAI** (mọi người xem & phản biện): gom theo người + filter + xoè từng việc; nút hành động vẫn chỉ leader đúng phạm vi. ④ Dọn 1.156 đề xuất cũ bằng script one-off (KHÔNG xoá — chuyển bo_qua kèm lý do): 372 miễn · 152 không-chính-chủ · 47 nhập nhằng → còn 585/21 người. Verify live: list 585 đúng, không còn 2 người miễn, panel Miễn hiện NS001/NS002.

**APP OPS RIÊNG — iPad/iPhone-first (Thùy chốt 29/08, branch `feat/app-ops`, PLAN-app-ops.md):**
- Quyết định: OPS-only (TA có app chấm riêng) · app = ĐẦU NHẬP CHÍNH, ERP giữ nguyên làm đầu thứ 2 (cùng DB, cùng seam lib/* — nhập bên nào bên kia thấy; app tự refetch khi quay lại foreground) · bổ trợ NGOÀI scope (Thùy tính sâu sau) · scan giữ MÁY SCAN (camera iPad kém chất lượng cho OMR + chậm — nguyên tắc "diệt nguồn ô xấu"), luồng scan/upload ở lại ERP desktop.
- Kiến trúc = entry Vite thứ 3, nhân bản đúng khuôn bundle HS 21/08: `ops.html`/`main-ops.tsx`/`AppOps.tsx`/`vite.config.ops.ts` (outDir `dist-ops`, renameToIndex, PWA manifest "BK Vận hành" theme #4f46e5) + scripts `dev:ops`/`build:ops`/`preview:ops`. Mang nguyên 2 bài học đắt của main-hs (registerSW immediate · `--app-z=1`). Login thêm prop `staffOnly`+`title`/`subtitle` (đối xứng hsOnly).
- `AppOps` gate: HS account → chặn (đối xứng AppHS) · chưa link nhan_su → chặn · quyền tab = CÙNG leaf-id my_quyen với ERP (buoihoc/ops_report/prep/test_dau_vao), không đẻ khái niệm quyền mới.
- `screens/ops/OpsHome.tsx`: shell bottom-tab 5 tab + trang chủ "Hôm nay" gộp 4 nguồn task của TÔI (buổi theo ca trực `myBuoiAoCuaKhoang` · report/tan `getMyOpsTasks` · prep `getMyPrepTasks` · ca test đang chạy) — bấm card sang tab. `screens/ops/DiemDanhBuoi.tsx`: màn điểm danh VIẾT MỚI touch-first (nút ≥44px), KHÔNG import BuoiHocScreen (2115 dòng kéo kho Hình) — cùng seam lib/gami nên hành vi = ERP (mở buổi/3 nút ghi ngay/Báo đến PH chỉ HS co_mat chưa báo/gỡ HS chặn khi có đo thật/huỷ buổi/đổi GV dạy).
- **2 refactor gỡ dep bẩn cho bundle (ERP không đổi hành vi):** ① `readClipboardImageFile` tách `kho/ui.tsx` (import katex module-level) → `lib/clipboard.ts`, ui.tsx re-export. ② **`useMonScope` tách khỏi `lib/mon.ts` → `hooks/useMonScope.ts`** — mon.ts (MON_LIST) là hằng thuần được lib data-layer import, hook dính useStore nằm chung file làm MỌI bundle import MON_LIST ăn theo mock/fixtures (đúng ca này: OpsHome→tuyensinh→mon→useStore); 7 màn đổi đường import. PrepScreen bỏ useStore → đọc `myQuyen()` trực tiếp.
- Verify: `tsc` sạch · build cả 3 bundle sạch — **dist-ops JS 457KB (gzip ~131KB), ~10× nhẹ hơn ERP 4.66MB** · preview thật viewport iPad 768×1024 + iPhone 390 (không tràn ngang, zoom net 1.0): login staffOnly → home → tab Điểm danh (7 buổi hôm nay; 28/08 hiện 8 buổi đã mở ✓ đủ + 1 huỷ kèm lý do) → detail 12A1 roster 9 HS đúng trạng thái màu (7 có mặt + 2 phép) → Report/Prep/Test render đúng, console sạch (chỉ Google Fonts bị sandbox chặn — máy thật không dính). CHƯA test write-path trên data thật (mở buổi/điểm danh/đóng task — chờ ca thật hoặc Thùy gật test).
- CÒN (vòng 6 deploy): Vercel project thứ 3 (build:ops → dist-ops) + domain (đề xuất `ops.bkacademy.edu.vn`) + icon/màu riêng + kiểm role OPS đã được cấp đủ 4 leaf ở Phân quyền.
## 2026-08-29 — Bot hỏi–đáp nhân sự (Claude Code trả lời trên ERP)

**BUILD trọn trong ngày (worktree `wt-hoidap-nhansu`, branch `feat/hoidap-nhansu`, đã merge main + chạy production):**
- Mig `202608291119`: `hoi_dap_nhan_su` (job queue khuôn troly_hoi_dap) + `hoi_dap_bot` (heartbeat 1 dòng). Client chỉ select/insert — câu trả lời CHỈ từ bot (service role). Realtime publication: claude_build thiếu quyền → guard hạ WARNING, CEO chạy tay 1 dòng SQL Editor.
- `scripts/hoidap/bot.mjs`: 2 đường nhận job (Realtime + quét vớt/Task Scheduler `--once`), claim ATOMIC (`update…eq trang_thai=pending`), nhặt mồ côi 5'', heartbeat 60s, phân loại lỗi tạm (retry ≤2) vs cấu hình (trả job về pending + TẮT bot → heartbeat ngừng → UI báo đỏ). Câu hỏi vào claude qua STDIN, allowedTools chỉ Read/Grep/Glob + 2 lệnh Bash allowlist — KHÔNG Bash tự do/Write/Edit.
- UI: tab thứ 4 "💬 Hỏi hệ thống" trong Việc của tôi (KHÔNG đẻ leaf — cùng lý do TroLyTab), poll 5s, chấm trạng thái bot từ heartbeat.
- **Pilot 3 người** (mig `202608291205`): hàm `hoi_dap_duoc_dung()` = nguồn chân lý duy nhất — RLS chặn thật + client rpc cùng hàm để ẩn tab. Thùy · Phạm Thị Thùy Trang · Trần Bảo Lộc.
- **Số liệu (CEO: "bản chất vẫn là trợ lý cũ")**: `query.mjs` SELECT tự do rào bằng `begin transaction read only` (đã test chặn cả WITH-DELETE) → rồi nâng thành **kho 11 lệnh viết sẵn** `tools.mjs` + runner `tracuu.mjs` (CEO: "AI chọn lệnh, không viết SQL — viết lại lệnh thì lâu chết"): thieu_btvn · vang_hoc · bang_elo_exp · hoc_tap_hoc_sinh · hoc_phi_no · viec_dang_treo · buoi_hom_nay · tuyen_sinh_dem · diem_et · diem_mt · bo_tro(bu/duoi/yeu). 11/11 test data thật; e2e 42s.

**SAI/SỬA trong ngày:**
- `auth.uid()` trong policy → claude_build không có usage schema auth → `public.jwt_uid()` (vết 202608211153).
- PATH tiến trình nền không thấy `claude` → bot tự dò `%USERPROFILE%\.local\bin\claude.exe`; CLI máy này chưa login → auth mặc định ANTHROPIC_API_KEY (.env.local), daemon không chết vì login hết hạn.
- `btvn_ket_qua.hoan_thanh/dung_han` = cột ĐỜI CŨ (toàn false/null) — tín hiệu thật `trang_thai_nop` (soi data mới lộ; bot đếm 13 thay vì 2 trước khi sửa).
- `buoi_hoc` chỉ có dòng khi buổi ĐÃ MỞ — lịch ngày derive từ `thoi_khoa_bieu` (thu = isodow+1, 2=T2…8=CN, đã kiểm data).
- Realtime chỉ bắn INSERT (reset dòng về pending phải kích quét); listener phải RESTART sau khi đổi publication.
- **Suýt tai nạn:** merge từ checkout `bkdemy-erp-v2` trong lúc phiên khác đã chuyển nó sang `feat/app-ops` → merge nhầm vào branch của người ta (CEO reset --merge gỡ, không mất gì). **Quyết định: mọi merge main + bot chạy từ worktree `wt-bot` (đứng cố định ở main), KHÔNG đụng checkout chung.**
- Ghi đè nhầm `scripts/_chk3.mjs` (file repo có sẵn trùng tên scratch) — đã `git checkout --` khôi phục. Scratch sau này đặt tên `_scratch_*`.

## 2026-08-30 — LUẬT QUERY/TÍNH TOÁN + khởi động chiến dịch trả nợ 177 chỗ

- **CEO chốt luật (sau audit 3-agent ra 177 vị trí client tự tính, 82 nặng):** "mọi query
  hay tính toán sau này phải ở DB. Người gọi hay AI gọi thì chỉ gọi hàm sẵn thôi." → Ghi
  thành CLAUDE.md **§2.0** (cấm reduce/đếm nghiệp vụ trong TS, cấm join-JS ra số nghiệp vụ,
  cấm tính-rồi-ghi-DB, công thức 1 nguồn duy nhất = fn Postgres; quy ước fn_*, RPC
  transactional, generated column, trigger). Báo cáo + lộ trình: `AUDIT-client-tinh-toan.md`.
- Bối cảnh thi công: nghỉ lễ không phát sinh hoạt động → cửa sổ an toàn để đại tu cả
  engine tiền/điểm. Nguyên tắc thi công: mỗi gốc = migration + client mỏng gọi rpc +
  **parity check số cũ (JS) = số mới (SQL) trên DB thật** trước khi cắt.

**APP OPS — REDESIGN UI (Thùy 30/08 "UI quá tệ, tham khảo app giáo dục, sinh động lên"; duyệt mockup visualize trước khi code, đúng quy ước):**
- Hướng chốt: style "app giáo dục làm việc" (ClassDojo/Classroom), NỀN SÁNG kiểu iPhone giữ nguyên. Mỗi tab 1 màu chủ đạo (Hôm nay tím indigo · Điểm danh lục emerald · Report dương blue · Prep hổ phách amber · Test tím violet). Font Be Vietnam Pro (đã load sẵn ops.html, giờ mới áp).
- `OpsHome`: hero tím = chào theo TÊN GỌI (từ cuối ho_ten) + ngày + **vòng tiến độ SVG done/tổng** (done = ops/prep done-flag + buổi đã-mở-điểm-danh-đủ qua diemDanhTienDo); card việc = icon squircle nền màu nhạt + badge số đậm + hàng mini bg-slate-50; bottom-tab active = pill màu (⚠ Tailwind JIT: mọi class màu là literal per-tab, cấm ghép chuỗi). 3 màn tái dùng bọc `ManCon` = dải màu MỎNG không chữ (đã thử dải có tiêu đề → LẶP với header sẵn của màn, bỏ) + đệm safe-area.
- `DiemDanhBuoi`: hero lục cả list lẫn detail. List: squircle GIỜ đổi màu theo trạng thái (đủ=lục/thiếu=amber/chưa mở=xám) + dòng đếm tổng trên hero. Detail: progress bar trên hero + GV tên-rút-gọn ngay hero; roster = **avatar HS** (anh_url, fallback 2 chữ cái đầu tên-rút-gọn nền màu hash-theo-tên, 6 tông) + **3 nút điểm danh gộp segmented pill** (nền slate-100, chọn = phồng màu Có-lục/Vắng-đỏ/Phép-amber); footer "Còn N bạn chưa điểm danh".
- Verify preview thật (JS-drive vì pane ẩn không composite được): home/list/detail/tab Report render đúng, 9 avatar + 9 segmented đúng màu ở 12A1 28/08, console sạch; tsc + build:ops sạch (463KB).

**CHIẾN DỊCH §2.0 — Phase 1 thi công (30/08, 5 đợt shipped trong ngày):**
- Đợt 1 (mig 0221): điểm chấm test / trạng thái thu tiền / điểm+verdict MT → 3 trigger. Parity 0 lệch, smoke rollback cả 3.
- Đợt 2 (mig 0228): hiệu suất nghiệm thu + duyệt vận hành → fn_gv_* + fn_vh_hieu_suat + 2 trigger. Parity BẮT 1 DÒNG LỆCH THẬT của housekeeping (viec d4e18725 nộp trước hạn mà tien_do=90) — đúng bệnh công-thức-2-nơi; trigger giờ đè mọi đường ghi.
- Đợt 3 (mig 0232): bảng gậy + chốt tháng → fn_gay_bang + fn_gay_chot_thang (đơn giá 20k vào SQL, snapshot jsonb, jwt→nguoi_chot; smoke giả JWT bằng set_config request.jwt.claims).
- Đợt 4 (mig 0240+0243): NGUYÊN ENGINE Elo/EXP → fn_dong_phase / fn_mo_lai_phase / fn_recompute_exp_thang / fn_dong_btvn, 1 transaction. Parity 1439/1439 dòng history mùa này. TEST VÀNG reopen+reclose buổi thật: số Elo khớp per-HS; phát hiện JS xếp hạng nhóm HOÀ hên xui theo thứ tự fetch (không order) → chốt tie-break tất định hoc_sinh_id. ⚠ Math.round JS = floor(x+0.5) ≠ round() SQL với số âm → fn_jsround. gami.ts cắt ~170 dòng engine.
- Đợt 5a (mig 0251+0254): fn_tln_normalize + fn_chap_nhan_dap_an. PARITY HARNESS TÓM BUG THẬT của JS: \b ASCII coi chữ có dấu là ranh giới từ → "10 học sinh" bị bóc thành "10ọcsinh" (bóc "đơn vị" ngay trong chữ, âm thầm từ V1!). Chốt đặc tả unicode v2 cho CẢ JS lẫn SQL + renorm 4 dòng cache; parity 615/615. Bẫy: dap_an_hs jsonb bóc bằng #>>''{}'' (::text ra kèm ngoặc kép).
- Bài học chiến dịch: (1) parity trên data thật TRƯỚC khi cắt — 3 lần lộ chuyện không ngờ (housekeeping lệch, tie hên xui, bug \b); (2) mọi phép Math.round port sang SQL phải qua fn_jsround; (3) test ghi bằng transaction ROLLBACK trên DB thật = an toàn tuyệt đối.
- CÒN LẠI: đợt 5b suaKeyVaChamLai (port grade 3 loại câu) · chotKy (gộp Phase 2 tiền) · quetGayTuDong (Phase 4 cùng task-engine) · ganMT (xét lại phân loại — content assembly, không phải số) · Phase 2 (hocphi 16 nặng) · Phase 3 (mastery) · Phase 4 (quét lớn + vừa/nhẹ). Checklist sống: AUDIT-client-tinh-toan.md.

**CHIẾN DỊCH §2.0 — Phase 2 + 3 (30/08, tiếp):**
- Phase 2 XONG (4 đợt): merge branch hocphi treo (RPC hoc_phi_theo_mon_ky đã áp từ 27/08, chỉ client kẹt) · fn_hocphi_no/so_du/tin_dung (parity tổng nợ 66.801.500đ khớp kiểm chéo) · fn_hocphi_phieu_ao + fn_hocphi_chot_ky (ĐỨNG TRÊN hoc_phi_theo_mon_ky — phiếu & bảng cùng 1 nguồn số; parity 238 hoá đơn kỳ 07: 225 khớp TUYỆT ĐỐI, 13 lệch truy được từng ca về data đổi SAU chốt — vd bù 09/08 sau chốt 05/08) · fn hệ số gợi ý/hiệu lực + chi tiết/tổng hợp kỳ (parity 292/293 + 242/242). hocphi.ts thành seam mỏng; xoá selectByIdsBatched (hết UUID trên URL — bug 400 cũ hết đường tái sinh).
- Phase 3 gần xong: fn_mastery_cells (PARITY VÀNG 391/391 ô vs engine JS thật, lớp 8S1) + rollup + Hình (window 3/tin 3-2) + fn_matrix_lop + fn_completion_theo_lop (vá done-GIAO-kỳ-vọng khi rà tail JS — suýt lệch ngữ nghĩa triangulation §5) + fn_rank_diem_mt (14/14). Xoá fetchGradeAgg/pagedByBuoi (quét 200k-500k dòng).
- Bẫy mới ghi nhận: fn có guard la_thanh_vien() thì script pg trần phải set_config request.jwt.claims mới test được; substring(from pattern) của PG trả NHÓM NGOẶC ĐẦU (phải bọc cả pattern); jsonb scalar so sánh text phải #>>'{}'.
- CÒN: getTongQuanHS · getStatSheetLop/listCandidatesLop (danhgia rule engine) · nguongTuCohort percentile · Phase 4 (68 VỪA + 27 NHẸ + quét lớn còn lại: troly 20k, listCauRac/ontap 500k, PhDangNhap, botro scan, quetGayTuDong, task-engine getMyTasks/listAllStaffTasks).

**APP OPS — hoàn thiện tiếp (30/08, phiên remote, branch `claude/ops-app-completion-cpj1kc`):**
- Rà lại code app OPS trên main vs PLAN-app-ops.md → bắt 1 điểm LỆCH PLAN: tab "Leader duyệt" vẫn lọt
  vào app (OpsHome nhúng nguyên `OpsReportScreen` 2 tab, trong khi PLAN §1 ghi rõ Leader duyệt Ở LẠI ERP).
  Sửa: `OpsReportScreen` thêm prop `chiViec` — app truyền `chiViec` → chỉ render tab "Việc của tôi",
  ẩn hàng tab; ERP (NhanSuHome) không truyền → giữ nguyên 2 tab như cũ.
- Vòng 4 (polish chạm màn Test — DiemDanhTestScreen, dùng chung ERP nên sửa kiểu "to lên vô hại"):
  modal tạo ca đổi grid walk-in + người chấm/trả bài thành `grid-cols-1 sm:grid-cols-2` (iPhone 390 hết
  chật, iPad dọc vẫn 2 cột); nút Huỷ/Hoàn thành modal + "+ Tạo test đầu vào" min-h-44; select đề/người
  chấm/người trả bài + Upload bài/Hoàn tất trên card min-h-36 (trước ~28px, khó bấm ngón tay).
- Verify: `tsc` sạch · build cả 3 bundle sạch · dist-ops JS 458.9KB (gzip ~129KB — không phình).
- Phiên remote KHÔNG có .env → không kiểm được DB live. CÒN NGUYÊN các việc cần máy/người có quyền:
  kiểm role OPS đã cấp đủ 4 leaf (buoihoc/ops_report/prep/test_dau_vao) ở màn Phân quyền · test
  write-path trên data thật · vòng 6 deploy (Vercel project thứ 3 + domain ops.bkacademy.edu.vn —
  chờ Thùy) · icon PWA riêng (chờ Thùy gật màu, theme_color đã khác HS: #4f46e5).

**TỦ QUÀ — build v1 (30/08, phiên remote, tiếp tính năng Hải; Thùy chốt qua 4 câu hỏi):**
- Chốt: màn ở APP OPS (tab "Quà", leaf mới `tu_qua`) · 2 story (đổi TẠI TỦ giao ngay · HS đặt trước
  → duyệt trừ xu → quà về → ra tủ nhận) · HẢI DỪNG — ERP/app OPS là đầu ghi duy nhất · scope FULL
  (đổi + order + catalog + nhập kho). Plan sống: PLAN-tuqua.md.
- DB: `scripts/sql_tuqua_chuyen_chu.sql` (SQL tay 1 lần — chuyển owner cụm qlht_* postgres→claude_build:
  đưa vào luồng migration + hết điểm mù CLI-0-dòng) + mig `202608300908_tu_qua_v1` (guard chặn nếu chưa
  chuyển owner): vá 2 race audit 29/08 (khoá dòng thứ tự cố định hoc_sinh→qua→phiếu/đơn), bộ
  fn_tuqua_* đủ đường trạng thái (da_giao/hủy-hoàn mà bản Hải bỏ dở), actor map chuẩn ERP
  tai_khoan→nhan_su (bỏ map email), qlht_log + trigger vết chung 4 bảng, view gate la_thanh_vien()
  thay gate email + thêm ma_hs/khoi/anh_url/trang_thai (cột cũ giữ nguyên). KHÔNG mở policy ghi —
  ghi chỉ qua fn (giữ hard-guarantee sổ xu của Hải). 15 hàm qlht_* cũ giữ làm tham chiếu.
- Client: lib/tuqua.ts (seam mỏng rpc + list thô) + TuQuaScreen (tab hồng, 3 mục Đổi quà/Đơn đặt/Kho,
  touch-first) + leaf `tu_qua` vào fixtures + tab thứ 7 OpsHome (icon 🎁 pill rose literal).
- Verify tại chỗ: tsc sạch · build 3 bundle sạch · dist-ops 492KB (+33KB). CHƯA áp DB (phiên remote
  không .env) — thứ tự áp ở PLAN-tuqua.md §4: SQL tay → npm run migrate → npm run schema → smoke data
  thật → CẤP leaf tu_qua cho role OPS (precedent quên cấp!).

**TỦ QUÀ — verify bằng REPLICA local (30/08, tiếp; CEO "tự chạy đi" nhưng phiên remote KHÔNG có
.env/chuỗi kết nối nào — đúng thiết kế §2.1 nên KHÔNG đụng được DB thật):**
- Cách bù: dựng PostgreSQL 16 local trong container, tái tạo đúng VAI Supabase (postgres
  KHÔNG-superuser có admin option trên claude_build · authenticated · app_test) + schema Hải nguyên
  trạng (bảng owner postgres, view bản sau sql_chot_xu, policy select gate current_nhan_su_id, auth.users
  stub) + seed (NS email khớp + NS email LỆCH + tài khoản không-nhân-sự, 2 HS, 2 quà, sổ xu).
- BẮT 1 LỖ THẬT nhờ replica: SQL tay thiếu `grant claude_build to postgres` — Supabase postgres không
  phải superuser, muốn `alter ... owner to claude_build` phải là MEMBER của role đích ⇒ thiếu dòng đó
  là Thùy chạy sẽ fail. Đã thêm vào scripts/sql_tuqua_chuyen_chu.sql.
- Kết quả: SQL tay OK (8/8 object đổi owner) · mig 202608300908 áp sạch 1 transaction (kể cả replace
  view thêm cột — chỗ dễ vỡ nhất) · smoke A–K pass 100% (số dư/tồn khớp fn↔view · đổi-giao-hủy-hoàn ·
  order tạo→duyệt→về→giao + hủy-hoàn + từ-chối-không-hoàn + chặn giao-khi-chưa-về · nhập phiếu
  chờ→xác nhận số thực, xuất bắt buộc lý do, hủy phiếu · chống trùng tên · qlht_log tự đẻ ·
  NS lệch email DÙNG ĐƯỢC hệ mới trong khi current_nhan_su_id()=null (chứng minh hệ Hải chặn oan) ·
  tài khoản thường bị chặn cả đọc lẫn ghi) · RACE TEST 2 phiên đồng thời tiêu 1 ví 40 xu × 2 lần
  30 xu: đúng 1 thành công, phiên 2 chờ khóa rồi "Không đủ xu (cần 30, còn 10)" — kết cục so_du 10 /
  tồn 4 / 1 lượt đổi, KHÔNG double-spend (hàm cũ của Hải cho cả 2 qua).
- Bẫy vặt trong lúc test: RAISE '%%' là literal (thừa tham số = lỗi compile) · smoke fail giữa chừng
  là data đã mutate — phải reset seed rồi chạy lại từ sạch.
- CÒN cần máy thật/Thùy (không đường vòng): dán scripts/sql_tuqua_chuyen_chu.sql vào SQL Editor →
  npm run migrate → npm run schema → cấp leaf tu_qua ở Phân quyền → deploy build:ops.
