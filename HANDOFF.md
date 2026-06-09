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

### Đã build (nhánh ĐẠI)
- **Bản đồ**: Chủ đề → Chuyên đề (card) → zoom Dạng (card + filter bậc/độ khó toggle). CRUD dạng thật, mã vị trí gợi ý sửa được.
- **Kho câu hỏi per-dạng** (`DangHub`): **Clone biến thể** + **Nhập chuỗi câu**; method Auto (ảnh/PDF→Gemini) / Manual (dán JSON) / Văn bản (parser). Trắc nghiệm 4 PA. Review 1-câu (Trước/Sau), layout đề+đáp án | lời giải. Sửa câu = preview + ✎.
- **Lý thuyết** (text+LaTeX, render như bài tập — KHÔNG phải file): editor popup to, upload ảnh/PDF → **AI bóc LaTeX**, trái code / phải preview. Cho **dạng** lẫn **chuyên đề**. Lý thuyết chuyên đề có **3 trạng thái: Có / Chưa / Không cần** (cờ `khong_can`); "không cần" loại khỏi tính %.
- **Badge % hoàn thành**: vòng tròn tiến độ (góc card chuyên đề) + pill (chủ đề/header), **5 thang màu**. % = câu(cap chuẩn) 70% + lý thuyết dạng 30%, gộp trục lý thuyết chuyên đề (Có=1/Chưa=0/Không-cần=loại). → liếc thấy chỗ thiếu.
- **Ảnh & file → Supabase Storage** (bucket `kho-anh` ảnh, `kho-tailieu` file đính kèm); DB lưu URL. Nút 📋 Dán clipboard + chọn file.
- **Auth + RLS**: đăng nhập Supabase Auth (email/pass); RLS toàn bộ bảng, chỉ `authenticated`.
- **Làm tài liệu (giáo trình)** — tài liệu = **THAM CHIẾU** vào kho (xuất mới snapshot). Tạo (tên+khối) → **Builder**: **+ Thêm chuyên đề (NHIỀU cái gộp thành 1 tài liệu)**, mỗi dạng có số-câu-theo-loại + Gợi-ý-lại + chọn câu từ kho (KhoPicker) + ↑↓, BTVN cuối; setting chrome (header/footer/watermark/màu); **🖨 xuất PDF 2 bản HS/GV** (HTML→`window.print()`, gu "workbook" 4 màu brand + dải sóng + logo). *(Đang dở — xem "Chưa làm".)*
- **Deploy**: Vercel project v2, nhánh `main` → `bkdemy-erp-v2.vercel.app`.

### Chưa làm
- **Làm tài liệu — đang dở** (ưu tiên tiếp): header/footer **chọn nhiều mẫu** (mới có 1 dải sóng) · running header slim trang ruột · reorder câu trong dạng · áp `cau_hinh.mau` cho dải sóng · gu B (học thuật)/C (SaaS) · custom block · BTVN số-câu-theo-loại.
- Nhánh **Hình** (tab stub "dựng sau"): cây Mảng→Loại→Dạng-hình + Bài/Ý/mô hình/bổ đề (spec §4).
- Quản lý 4 danh mục (thuộc tính/bổ đề Đại, mô hình/bổ đề Hình); gắn thuộc tính cho Dạng.
- `countCauByDang` đếm ở client → chuyển **view Postgres** khi data lớn.
- **Kho tài liệu** (video/pdf/slide tag dạng — resource library, KHÁC "Làm tài liệu"). Theme **Classroom** cho màn Nhân sự.

### Quyết định & quy ước (đừng vô tình phá)
- **3 tầng, BỎ Chương** (Chủ đề→Chuyên đề→Dạng).
- **Bậc lớp S>A>B>C** (`bac_toi_thieu` FK `lop_bac`, thu_tu S=4…C=1): bậc THẤP NHẤT còn học dạng; lớp T học D ⟺ thu_tu(T)≥thu_tu(D). **ĐỘC LẬP `muc_do`(1–5)**. ⚠ Đừng nhầm `bac_toi_thieu` với `khoi`.
- **Mã vị trí**: Chủ đề `0701` · Chuyên đề `070101` · Dạng `07010103` · Câu `07010103001` (STT 3 số, client max+1, append-only). **Chỉ `ma_dang` là FK-target ổn định** → sửa dạng KHOÁ mã. `ma_chu_de`/`ma_chuyen_de` là denormalize — nhưng `dai_chuyen_de_ly_thuyet` GIỜ khoá theo `ma_chuyen_de` → tránh đổi mã chuyên đề đã có lý thuyết.
- **Gu UI**: Admin = SaaS/Linear (indigo, segmented, card). Nhân sự = Classroom (chưa làm). Chọn bậc/độ khó = segmented 1-click.
- **AI import**: 1 prompt/loại câu format-tolerant (KHÔNG multi-prompt-select). **Gemini input ưu tiên PDF** (đa trang + text layer); ảnh chỉ khi 1 trang & nét ≥300DPI; khó đọc → model Pro.

### Schema (DB live — `npm run schema` ghi `schema.md`, KHÔNG sửa tay)
- `lop_bac` (S/A/B/C, thu_tu) seeded.
- `dai_ban_do`: ma_dang(PK)·khoi·ma_chu_de/ten·ma_chuyen_de/ten·ten_dang·muc_do·bac_toi_thieu(FK)·created_at. (DROP ma_chuong.)
- `dai_cau_hoi`: ma_cau(PK)·dang_chinh·loai_cau·noi_dung·dap_an·loi_giai·lua_chon(jsonb)·anh_de·anh_dap_an·nguon·parent_ma_cau·clone_method.
- `dai_dang_ly_thuyet`: ma_dang(PK)·noi_dung·file_url?·ten_file?. `dai_chuyen_de_ly_thuyet`: ma_chuyen_de(PK)·noi_dung·file_url?·ten_file?·**khong_can**.
- **Tài liệu**: `tai_lieu`(id·loai·ten·khoi·ma_chuyen_de?·theme·**cau_hinh** jsonb) · `tai_lieu_phan`(tai_lieu_id·thu_tu·loai_phan[lt_chuyen_de|dang|btvn|custom]·ref_ma·tieu_de·noi_dung) · `tai_lieu_cau`(phan_id·ma_cau·thu_tu).
- `hinh_ban_do` (+bac_toi_thieu) + bảng Hình/danh mục như `spec-kho-v2.md`.
- **Migrations ĐÃ áp vào DB live (ĐỪNG chạy lại):** 0001–0007 (init→bucket kho-anh) · 0008 bucket `kho-tailieu` · 0009 lý thuyết `noi_dung` · 0010 chuyên đề LT · 0011 cờ `khong_can` · 0012 tài liệu · 0013 `tai_lieu.cau_hinh`. **2 bucket Storage đã có trên cloud.**

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

---

## ③ Nhật ký
→ Chuyển sang **`DEVLOG.md`** (log thô append-only, theo ngày, KHÔNG load khi làm). Là nguồn bất biến để truy lại / tổng hợp lại HANDOFF nếu bản này sai logic.
