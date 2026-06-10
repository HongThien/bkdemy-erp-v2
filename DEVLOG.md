# DEVLOG — Kho (BKdemy ERP v2) · nhật ký THÔ

> Log thô, **append-only**, theo ngày: *làm gì / sai gì / sửa sao / quyết định gì*.
> **KHÔNG load file này khi làm việc** — chỉ `HANDOFF.md` được đọc đầu phiên.
> File này = **NGUỒN bất biến** để sau truy lại, hoặc tổng hợp lại HANDOFF nếu thấy bản cũ sai logic.
> Quy tắc: trong ngày chỉ THÊM vào đây; **cuối ngày** mới distill các mục durable → cập nhật HANDOFF (① trạng thái ② bài học).
> ⚠ ĐỪNG sửa/xoá mục cũ — chỉ thêm mới (giữ nguyên nguồn).

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
