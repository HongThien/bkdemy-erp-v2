# DEVLOG — Kho (BKdemy ERP v2) · nhật ký THÔ

> Log thô, **append-only**, theo ngày: *làm gì / sai gì / sửa sao / quyết định gì*.
> **KHÔNG load file này khi làm việc** — chỉ `HANDOFF.md` được đọc đầu phiên.
> File này = **NGUỒN bất biến** để sau truy lại, hoặc tổng hợp lại HANDOFF nếu thấy bản cũ sai logic.
> Quy tắc: trong ngày chỉ THÊM vào đây; **cuối ngày** mới distill các mục durable → cập nhật HANDOFF (① trạng thái ② bài học).
> ⚠ ĐỪNG sửa/xoá mục cũ — chỉ thêm mới (giữ nguyên nguồn).

---

## 2026-06-15

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
