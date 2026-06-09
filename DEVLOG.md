# DEVLOG — Kho (BKdemy ERP v2) · nhật ký THÔ

> Log thô, **append-only**, theo ngày: *làm gì / sai gì / sửa sao / quyết định gì*.
> **KHÔNG load file này khi làm việc** — chỉ `HANDOFF.md` được đọc đầu phiên.
> File này = **NGUỒN bất biến** để sau truy lại, hoặc tổng hợp lại HANDOFF nếu thấy bản cũ sai logic.
> Quy tắc: trong ngày chỉ THÊM vào đây; **cuối ngày** mới distill các mục durable → cập nhật HANDOFF (① trạng thái ② bài học).
> ⚠ ĐỪNG sửa/xoá mục cũ — chỉ thêm mới (giữ nguyên nguồn).

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

**Bắt đầu "Làm tài liệu" (giáo trình):** chốt thiết kế — tài liệu = THAM CHIẾU vào kho (transclusion), xuất mới snapshot; engine dùng chung (loai: giao_trinh|mt|et|bo_tro|daily); HTML→print PDF; 2 bản HS/GV; **thư viện** (lưu, mở lại). Schema migration **0012**: `tai_lieu` + `tai_lieu_phan` (lt_chuyen_de|dang|btvn|custom) + `tai_lieu_cau`. Câu luyện: auto-rule (6 câu/dạng, ưu tiên gốc>clone, trải mức độ, dễ→khó) + sửa tay. Cấu trúc: [LT chuyên đề]→mỗi Dạng:[LT dạng+câu luyện]→[BTVN]. Format: build gu "workbook nhiều màu" trước, xuất PDF thật rồi chỉnh (theme tách riêng). Build order: schema(✓)→print-view+theme→builder.

**Migrations áp hôm nay (DB live):** 0008 bucket `kho-tailieu` (Dashboard), 0009 lý thuyết `noi_dung`, 0010 chuyên đề LT, 0011 cờ `khong_can`, 0012 tài liệu (giáo trình).

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
