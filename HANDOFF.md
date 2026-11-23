# HANDOFF — BKdemy ERP v2 (bản gọn · đọc đầu phiên)

> **Đọc file này là đủ để vào việc.** Chỉ chứa trạng thái ~2 tuần gần nhất (từ 09/11/2026; dọn lần cuối 23/11).
> Lịch sử cũ: **`HANDOFF-ARCHIVE.md`** — chỉ grep khi đụng mảng đó, không đọc cả file (danh sách tên mục ở cuối file này).
> Bài học còn hiệu lực (đừng đạp lại): **`HANDOFF-BAI-HOC.md`** — đọc mục theo mảng đang làm (mục lục ở đầu file).
> Nhật ký thô: `DEVLOG.md`. Luật distill: CLAUDE.md §0 — cuối ngày đè lại mục tương ứng; mục 14 ngày không đụng thì chuyển sang ARCHIVE.
> Spec: bộ 20 spec đích ở `SPEC-INDEX.md`. Tên spec cũ gặp trong ARCHIVE ⇒ tra bảng B của SPEC-INDEX (file cũ nằm `_luu-tru/`).

---

## ⛔ LUẬT LÀM VIỆC — CHỈ LÀM KHI THÙY RA LỆNH, PHẢI NÓI RÕ SCOPE (Thùy chốt 09/11)

- **Chỉ chạy khi Thùy đã RA LỆNH.** Thùy nêu một yêu cầu ≠ lệnh làm hết. Phương án chưa chốt thì **không** chạy gì: không migration, không script hàng loạt, không ghi DB, không dựng bản nháp cho toàn bộ dữ liệu.
- **Trước khi làm, nói rõ SCOPE rồi chờ Thùy gật.** Scope gồm: làm cái gì · trên **khối/lớp/môn nào** · bao nhiêu bài/câu/bảng · có ghi DB hay không · thứ tự các bước. Thùy chưa nêu phạm vi ⇒ **hỏi**, không tự mở rộng ra "tất cả các khối".
- **Một bước một lần.** Xong bước nào báo bước đó, rồi chờ lệnh cho bước sau. Không tự nối bước 1 → 2 → 3.
- **CHUẨN HOÁ KHO TRƯỚC, XỬ LÝ HÀNG LOẠT SAU.** Kho các khối còn rất nhiều bài thừa không dùng. Chạy máy/agent quét cả kho = đốt token của Thùy vào bài rác. Chỉ xử lý trên tập bài Thùy đã chuẩn hoá / chỉ định.
- *Vì sao:* 09/11 Thùy yêu cầu tách bài nhiều ý trong kho Hình – Học. Phương án chưa chốt, Claude đã tự áp migration (bảng `hinh_hoc_bai_y` + trigger, mig 202611091550) và tự chạy máy cắt cho **cả K7 · K8 · K8T · K9** (746 bài) mà không báo trước. Thùy: *"t mượn m làm hết tất cả các lớp à ??? lần sau làm cái gì phải thông báo trước."*

## ① TRẠNG THÁI HIỆN TẠI

### ⭐⭐⭐⭐ 23/11 — KHOÁ BẢN ĐỒ + PHIẾU · CHI PHÍ AI · BÁO CÁO TUẦN XEM THEO TUẦN · ẢNH ĐẦU TUẦN TỰ CHỤP LẠI (mọi thứ trên `main`, DB đã áp; ERP CHƯA deploy)
- **Phiên Claude của trưởng khối TẮT** (công tắc `phien_claude_truong_khoi` = false; bấm vào thấy "⏸️ Chức năng này tạm dừng"). Thùy chưa cho mở lại.
- **Bản đồ kiến thức khoá ghi** (33 bảng cấu trúc + `hinh_baitoan` insert/delete): người đăng nhập không phải admin hệ thống ⇒ bị chặn; muốn sửa phải gửi **phiếu** (`scripts/phien/ban-do.mjs gui_phieu`) → Thùy duyệt ở khay "📋 Phiếu sửa bản đồ" → cả phiếu chạy trong một giao dịch. KHO câu vẫn làm thẳng. Spec: `spec-quan-ly-chat-luong.md`.
- **💸 Chi phí AI** ở phòng Giám đốc: sổ `ai_luot_dung` (kênh phiên · trợ lý · hỏi đáp · đánh giá · chấm BTVN · Claude Code), giá `ai_bang_gia`, tỷ giá `ai_cau_hinh`. Claude Code nhập từ nhật ký máy (`scripts/ai/nhap-claude-code.mjs`, từ 01/11; bot phiên gọi lúc khởi động + mỗi ngày). **Còn làm:** máy nhà chạy `node scripts/ai/nhap-claude-code.mjs --tu-moc` một lần · khởi động lại bot phiên + bot hỏi đáp · chấm BTVN bằng máy / máy tự giải chưa ghi token (chờ lệnh).
- **Báo cáo tuần — tab "📅 Theo tuần"** (thay "Tuần này", phòng Trưởng bộ môn / Giám đốc): ‹ › đổi tuần; tuần đang chạy đọc `bctk_so_hien_tai_o`, tuần đã đóng đọc **sổ chốt** `bctk_so_tuan_o` (`fn_bctk_tuan` / `fn_bctk_tuan_o`). Hiện chỉ tuần 09/11 có bản chốt; tuần 16/11 sẽ có khi ảnh 23/11 đủ.
- **Ảnh dạng yếu / nhóm yếu đầu tuần — gốc lỗi "nhóm yếu không tự tổng kết":** cron riêng `tu-dong-sang-t2` hết giờ 2 phút đêm 22/11 ⇒ không có ảnh 23/11. Đã chuyển vào bộ điều phối: dòng `chup_dau_tuan` → `_dang_yeu_chup_dau_tuan_lo(80)` chụp từng ô môn × khối (tiến độ `dang_yeu_chup_o`), đủ ⇒ `dang_yeu_chup_xong` + Tổng kết tuần; sổ chốt tuần chỉ chốt khi ảnh đầu VÀ cuối đủ. **Kiểm sáng 24/11:** `dang_yeu_chup_xong` có tuần 23/11 · `bctk_so_tuan_o` có tuần 16/11 · tab Theo tuần tuần 23/11 hết "—". **Thùy chạy SQL Editor** file `202611232133_tat_cron_tu_dong_sang_t2_cron_sql_editor.sql` (tắt cron cũ, không xoá) rồi Claude `--ghi-so`.

### ⭐⭐⭐⭐ 20/11 — KHO CÂU HỎI: LÀM Q3/Q4/Q9/Q10/Q12 + nửa Q11, ĐO DẠNG THIẾU CÂU / THIẾU MCQ (`spec-kho-cau-hoi.md`; mọi thứ trên `main`, DB đã áp)
**Spec đã CHỐT (Thùy 17/11 "chốt theo đề xuất" Q1–Q13). Đầu spec §9 có bảng "Tiến độ thi công" — đọc bảng đó trước, bảng này chỉ tóm.**
- **Đã làm + áp DB** (mig `202611201758`, áp `--only`): trigger dùng chung `_trg_thu_hoi_form_tn()` trên 6 bảng câu — đổi đáp số hoặc câu vào rác ⇒ form MCQ của câu về rác (Q3/L3/L4); dọn 139 form Đại + 15 KHTN nằm trên câu rác; 25 form MCQ Hình chưa duyệt ⇒ rác (Q4). Code: `_kho_insert.mjs` gắn nhãn hình `goc` cùng giao dịch + ghi `giai_method` cho Hình (Q10); `de-thi/ghi.mjs` thêm `--model-lam`, ghi `nguon_giai='ai'` (Q9); `FMT_RULES` thập phân dấu phẩy (Q12); `DangHub.tsx` bỏ ô "Duyệt luôn", clone lưu chưa duyệt (nửa Q11).
- **⏸ Chờ Thùy quyết:** **Q2** — Hình về luật `kho_chuan` chung: 8.159 → 4.467 câu, rời kho 3.692 (chưa viết migration, cố ý, kẻo `npm run migrate` áp nhầm; báo trưởng khối Hình trước) · **3 form MCQ phát đáp số sai** chờ trưởng khối Toán soát: `T105040203061` (36,2 ↔ 36,3), `T105040206002` (14 ↔ 13,8, đã duyệt), `T105100405030` (358,875 ↔ 363) · số phận **5.665 nháp clone cũ** (`dai_cau_hoi_clone_cho_duyet`, 0 duyệt/từ chối) + 3 yêu cầu clone treo · Q13 ghi dấu lượt dùng đường nhập ảnh/PDF ở ERP ở đâu (đừng thêm cột chỉ để đo) · Q6 bỏ vế "câu cũ tạm dùng" khi 353 Đại + 1 HGT đã duyệt/rút xong.
- **Chưa làm (chờ lệnh):** Q7 máy ký form MCQ (chờ: Đại 6.121 · HGT 364 · KHTN 742 · TSA 181 — mở khoá ngay 37 dạng chưa có MCQ) · Q11 đường "Claude kiểm rồi tự duyệt" cho clone (hiện clone từ ERP kẹt ở chưa duyệt) · vá nhãn `nguoi` của 1.124 câu Đại đề thi từ 15/11 (chỉ đề có `.soan.md`) · gắn nhãn hình `goc` cho 189 Đại + 67 Hình sau 15/11 22:55 rồi truy đường ghi lọt (nghi `saveCauBatch`/`saveCauToDang` trong `api.ts`) · 91 báo sai `moi` + màn E3 · L7 (`nextCauSeq` ở client không khoá) · L8 (`fn_mcq_loi_theo_*` join cứng `dai_mcq_rule`) · L11 (CHECK `loai_cau`; Hình thiếu trigger log + `duyet_nguon` rỗng ở 290 câu) · L20–L22.
- **Hai số Thùy hỏi (đo 20/11, bản đồ mới 1.546 dạng, mới chỉ Đại + HGT):** **1.125 dạng chưa đủ 50 câu dùng được** (chỉ 421 đủ) — duyệt nốt câu chờ cứu 43, còn 1.082 dạng thiếu ~35.300 câu; 91 dạng không có câu nào (không clone được, phải nhập gốc), 308 dạng chỉ 1–9 câu · **415 dạng chưa có MCQ** — 37 có form chờ, 182 có trả lời ngắn, ~113 không có đường nào, 112 dạng rỗng. Tệp: `reports/dang-du-cau-2026-11-20.csv`; chạy lại: `node scripts/do-dang-du-cau.mjs <ra.csv>` (chỉ đọc). Chưa đo KHTN/Lý/Hoá, kho bản đồ cũ, Hình–Học; 4T/5T/8T trống có thể là sách chưa nhập, không hẳn thiếu thật.
- **Bẫy:** heredoc bash không viết được chuỗi JS nhiều dòng (dùng `String.fromCharCode(10)` hoặc Write); `ghi.mjs` CRLF — chuẩn hoá trước khi thay; `kho_sua_log` cột thời gian là `sua_at`; `hinh_hoc_cau_hoi` không có cột `khoi`; `tsc` lỗi sẵn ở `src/lib/pdfRender.ts(20,23)` không phải của đợt này. Luôn `migrate --only <file>` (30 mig cũ treo của phiên khác).

### ⭐⭐⭐⭐ 17–20/11 — GỘP SPEC (95 file → 20 spec; 13 đã chốt, đang làm #19 Tài chính) + MASTERY LUẬT MỚI + HS YẾU THEO NHÓM (máy nhà; mọi thứ trên `main`, DB đã áp hết)
**Đọc `SPEC-INDEX.md` trước** — bảng A = bộ **20 spec đích Thùy chốt** (file hiện có rơi vào spec nào); bảng B = tên file cũ → nguồn đúng (file cũ nằm `_luu-tru/`, `git mv`, không xoá).
- **TIẾN ĐỘ GỘP SPEC (cập nhật 20/11) — trạng thái từng dòng xem `SPEC-INDEX.md` bảng A:**
  - **ĐÃ CHỐT (13/20, nguồn đã vào `_luu-tru/`):** #1 kiến trúc · #2 bản đồ Toán · #3 kho câu hỏi · #4 builder · #5 giải bài · #6 quản lý chất lượng · #7 vận hành tuần · #8 vận hành trung tâm ·
    #10 trợ giảng · #11 lương + gậy · #13 app PH · #18 bổ trợ · #20 mastery. CLAUDE.md §7 đã trỏ đủ.
  - **#12 `spec-app-hs.md`:** Thùy chốt 19 câu 18/11; **nguồn CHƯA lưu trữ** — còn rà nốt `spec-thanh-tuu-nhiem-vu` nửa sau + `spec-huy-hieu-build`.
  - **CHƯA LÀM:** #9 web trung tâm · #14 bản đồ KHTN · #15 bản đồ Lý · #16 bản đồ Hoá · #17 bài học tương tác. Anh, Văn gác lại.
  - **Cách làm mỗi spec:** đọc hết nguồn + đối chiếu DB/code → nháp → Thùy trả lời câu hỏi (lời thường, có số, có đề xuất, ≤ ~10 câu) → chốt → `git mv` nguồn vào `_luu-tru/` → sửa SPEC-INDEX + CLAUDE §7 + DEVLOG.
    Đang làm spec thì **không lạc sang việc cụ thể**; việc code/DB sinh ra từ quyết định trong spec ghi vào mục "chờ lệnh" của spec đó, chỉ làm khi Thùy ra lệnh.
- **▶ ĐANG LÀM — #19 `spec-tai-chinh.md` (Thùy đổi hướng 20/11: "đi lại từ đầu — cơ cấu tài chính trước, rồi mới thu chi"):**
  - **⭐ Thùy 21/11: spec tài chính theo ĐÍCH, không theo hiện tại** — số BK chỉ để có insight; luôn so "có đang đi đúng hướng tới đích không". Thứ tự: đích công suất → đích doanh thu → đích cơ cấu chi phí → bảng so đích–thực tế.
    **Phần 0 (mới)** = công suất → doanh thu: 8 phòng 130 chỗ, 163 phòng-ca 1,5 giờ một tuần, dùng 90 = 147. Hiện tại 110 phòng-ca · 8,0 em/ca · 759 lượt em-ca · ~500 tr/tháng. Đích 1 (12 em/ca) ≈ 1.100 tr niêm yết; **Đích 2 = 15 em/ca ≈ 1.375 tr (Thùy chốt 21/11;** 18 em/ca vượt sức chứa, trung bình phòng 16,25 chỗ). **Tối tính đủ 7 ngày (chốt 21/11).** **⛔ Bài học 21/11: KHÔNG suy đích từ hiện tại** (bảng nhân chi tháng 9 lên ra lãi 45–60 — Thùy bác, đã bỏ). **Logic gốc Thùy chốt:** lãi 25 ⇒ chi 75 chia cho N hạng mục (§I.0, 12 hạng mục, đề xuất chờ Thùy sửa) ⇒ soi về hiện tại xem cái nào nhiều / ít (§I.0b) ⇒ hướng điều chỉnh. Lệch hiện tại: vận hành + quản lý +8,9 · mặt bằng +3,0 · tuyển sinh −3,0 · người dạy gần đích. **Bảng đích §I.0 CHƯA chắc** (Thùy hỏi "viết trên logic gì" — thật ra là chép hiện tại + kẹp số ngành + ước chừng cho đủ 75). **Cách dựng đúng ghi ở §I.0a: theo ĐỊNH MỨC ở đích** (số ca × đơn giá · số em ÷ em một người lo · cố định theo cơ sở · đội dùng chung · chính sách), cộng lại rồi so với 75; dòng chưa có định mức để TRỐNG, không điền số ước chừng. Chờ Thùy: 7 định mức §I.0a + §0.6.
  - **Phần I = CƠ CẤU CHI PHÍ** = mỗi khoản chi chiếm bao nhiêu % doanh thu, **đích lợi nhuận 25%**. Bảng §I.1 dựng từ SỐ THẬT tháng 9 trong 3 bảng TOT "Duyệt chi tháng" Thùy gửi
    (file ở Downloads máy công ty, **KHÔNG chép vào repo**; spec chỉ ghi số tổng theo dòng, không ghi tên người kèm tiền, không ghi phần chia lãi).
    Tháng 9: doanh thu 456,7 tr · tổng chi 81,1% · **lợi nhuận 18,9%** — cách đích ~6 điểm, lệch ở 3 dòng: giáo viên 35,9 (đích đề xuất 30) · nhân sự không đứng lớp 18,9 (16) · mặt bằng 9,0 (7).
  - **Luật Thùy chốt 20/11:** **trích quỹ dự phòng KHÔNG phải chi phí** ("tiền vẫn còn đấy"); chỉ khi rút quỹ ra tiêu thật thì khoản tiêu mới là chi, ghi vào đúng dòng của nó. **21/11: bốn quỹ còn lại (học liệu, hackathon, CSVC, tài khoản) cũng tính theo TIÊU THẬT** — đọc theo trung bình nhiều tháng vì quỹ tiêu dồn. **Khoản mua sắm lớn một lần trải đều 12 tháng** (dòng Đầu tư).
  - **Thùy 21/11 — pha PHÁT TRIỂN, chưa phải pha ổn định:** giáo viên đang kiêm học thuật + quản lý chất lượng nên lương giáo viên chưa so thẳng với đích; mô hình nhiều cơ sở: giáo viên tăng theo cơ sở, học thuật + QLCL chỉ tăng nhẹ. Đề xuất ghi ở §I.4 (chờ gật): tách dòng Giáo viên thành Dạy / Học thuật + QLCL, cơ cấu hai tầng (từng cơ sở → biên đóng góp; phần chung của BK), đích 25 là của pha ổn định. Thiếu: tỉ lệ lương giáo viên cho dạy ↔ học thuật + QLCL.
    Cách đọc TOT: lương tháng M trả ở M+1, học phí tháng M thu ở M+1 ⇒ ghép theo "tháng hoạt động".
  - **⏸ CHỜ THÙY trả lời 4 câu còn lại §I.3 (câu 5 đã chốt 21/11):** cách gom dòng (tách "nhân viên full-time"?) · cột đích (giáo viên 30?) · doanh thu tính theo tiền thu hay học phí phát sinh · phần dạy của người sáng lập nằm dòng giáo viên.
    **Chốt xong Phần I mới "break xuống tầng dưới"** (gán danh mục BK Chi / loại lương / dòng TOT vào từng dòng; sắp lại Phần II = bản nháp 19/11 về thu chi; bảng so đích–thực tế).
  - **Lệch chưa giải thích:** thu tháng 10 theo TOT 456,7 tr ↔ `thanh_toan` ERP 474,2 tr · BK Chi "Công đoàn" tháng 9 24,5 tr không có dòng TOT tương ứng · khoản 22.222.222đ ngày 02/09 trong chi kỳ.
  - **Phát hiện ghi trong Phần II, CHƯA sửa (chờ lệnh):** policy ALL cho mọi thành viên trên `thanh_toan` · bảng giá · hệ số học phí · tính tiền ở client (`src/lib/hocphi.ts`, `HocPhiScreen.tsx`) ·
    lá `db_taichinh` không có màn · công cụ bot `hoc_phi_no` đọc nợ theo trạng thái hoá đơn (173,7 tr) ≠ nợ thật (89,6 tr / 53 PH).
  - Khi #19 chốt: `PLAN-thu-chi.md` → `_luu-tru/` + thêm dòng trỏ ở CLAUDE §7. Nhánh `origin/docs/tai-chinh-luong-gv-ta` (benchmark ngành ở §2) **không gộp, không xoá** khi Thùy chưa gật.
- **Việc CHỜ LỆNH sinh ra từ các spec đã chốt (không tự làm):** kho câu hỏi (xem mục 20/11 ngay trên) · giải bài §C10 + Phần E4 (rà đáp án kho — chưa thiết kế) + E3 chỗ báo câu sai cho nhân sự ·
  quy trình Claude tự xử báo sai · lương §9.0b (công thức TA còn trừ phạt gậy, sổ gậy còn mở quyền ghi) · bổ trợ §7.4 Đuổi chờ review · `supabase/cho-ap/*` chưa áp · deploy ERP / app TA.
- **Bài học đợt gộp spec:** nháp do agent dựng hay sai số ⇒ **tự kiểm số chính bằng DB** trước khi đưa Thùy · phân biệt ĐÍCH / HIỆN TẠI (R1) — đặt đích "mò" khi BK đã có bảng số thật là sai (20/11: phải hỏi "BK có bảng chi chưa" trước) ·
  đọc DB để kiểm số chỉ trong `begin read only … rollback` (`.env` chỉ có role ghi).
- **Mastery — Thùy chốt + ĐÃ ÁP 17/11** (`spec-mastery.md` §2, §5, §6, §10, §11):
  - Chỉ **TEST** tính, **luyện không tính** (`bo_tro` · `bu_luyen` · `htd_luyen` · `retest` · ôn thi · thi thử); danh sách loại bài được tính là danh sách CHO PHÉP — loại mới phải quyết tường minh (mig `202611171010`).
  - `bo_tro_test` · `bu_test` · `htd_test` đều tính như ET · **Hình–Luyện đo theo lần** (≤3 lần, 30 ngày, không trọng số) — ô Hình–Luyện 3.586 → 456, yếu 497 → 133 (toàn bộ do cửa sổ 30 ngày).
  - **MỘT mastery = bản CÓ BTVN** (mig `…1038`; client `mastery.ts` luôn true, KQHT bỏ nút "Gộp BTVN").
  - **Đã xoá (Thùy gật A–F):** bộ "chỉ ET+MT" trong cache · bảng `mastery_ban` · `_dy_so_nhom` · `fn_mastery_nhom` · đường lùi theo câu + công tắc `mastery_theo_lan` · màn 🔀 Mastery so sánh bản đồ + `fn_mastery_bdm_so_sanh`.
    *(`_dy_nhom_ds` — hàm "nhóm có chứa dạng yếu" cũ — nay không ai gọi; xoá phải hỏi.)*
- **HS YẾU = em có ≥ 1 NHÓM yếu** (Thùy 17/11, mig `…1134` · `…1135` chụp bù · `…1137`): ảnh `dang_yeu_hien_tai` / `dang_yeu_dau_tuan` có cột `so_nhom_yeu` + `nhom` (hàm một nguồn `_nhom_yeu_tai_lo`);
  Báo cáo tuần `phien_ban` 2 (HS yếu theo nhóm + chỉ số **Nhóm yếu**), QLCL, box trưởng khối (trước đếm "nhóm có chứa dạng yếu" — sai) đều theo nhóm. Toán HS yếu 312 → 261. Báo cáo đã nộp giữ số cũ (màn ghi "bản cũ").
- **🚀 CẦN THÙY DEPLOY:** **ERP** (KQHT bỏ nút Gộp BTVN · gỡ nút 🔀 Mastery · Báo cáo tuần ô/cột Nhóm yếu · QLCL chữ) + **app GV** (mastery có BTVN). Chưa ai mở các màn này bằng tài khoản thật.
- **Sự cố đã gỡ 17/11:** sổ **Mục tiêu tuần** lỗi quyền 15 giờ (16/11 20:22 → 17/11 11:22) vì mig 1713/1844 áp qua SQL Editor ⇒ 4 hàm `_mtt_*` + bảng `mtt_ke_hoach` thuộc `postgres`;
  Thùy dán 3 lệnh (grant 4 hàm + `alter table mtt_ke_hoach owner to claude_build`), lượt 11:22 OK 258 tờ. **Bài học:** lỗi quyền lộ từng chỗ một ⇒ dò cả chuỗi (`has_function_privilege` / `has_table_privilege` + policy RLS) rồi đưa MỘT lệnh; áp mig qua SQL Editor ⇒ cuối file phải đổi chủ về `claude_build` hoặc grant.
- **Còn treo nhỏ:** file ❓ chưa xếp chỗ (xem SPEC-INDEX) · `TIN-PH-K6…K9` chưa commit · `spec-lunar-cherry` để đâu ·
  dọn nhánh chết "công tắc theo lần tắt" trong 5 hàm cũ (vô hại) · Hình–Luyện chưa vào Dashboard theo nhóm.
- Có phiên khác (máy nhà) đang làm Mục tiêu tuần song song: các mig `…_mtt_dang_tinh_trang*` + sửa `spec-van-hanh-tuan.md` là của phiên đó, không phải đợt này.

### ⭐⭐⭐⭐ LUẬT GIẢI BÀI / GIẢI ĐỀ / NHẬP KHO = MỘT FILE `spec-giai-bai.md` (Thùy chốt 15/11) — ĐỌC TRƯỚC mọi việc đưa tài liệu vào kho
- Thay toàn bộ luật cũ: file khối `kho-rules/*/k*.md`, `kho-rules/README.md`, `spec-giai-bai-ai.md`, `spec-luong-kho*.md`, luồng kho kiểu 1, ~180 brief theo lô — **đã XOÁ 15/11** (Thùy gật), còn trong git.
  Mục nào bên dưới còn tả "quy trình 3 bước", "rút luật vào k<khối>.md", "CEO duyệt lô / HTML duyệt", "giải trước — dạng chờ" ⇒ **lịch sử, không làm theo**.
- Chốt 15/11: phân dạng TRƯỚC rồi giải · Sonnet giải, Opus kiểm một phần (§C5) · câu đủ 4 điều kiện máy kiểm tự vào kho, chưa chắc → **trưởng khối** (§C6) · không HTML duyệt ·
  lô mẫu một lần mỗi khối × loại kì (§C3, bảng §C9) · Hình không giãn dòng (UI +20%, nợ code) · "Giải tích" = Hình giải tích (kho `hgt`).
- Brief trạm: `node scripts/kho/cat-luat.mjs <khối>` / toanmath `ghep-brief.mjs <BATCH> <khối>` — không viết luật tay. Toanmath: sổ `kho-rules/dai/lo/toanmath/TINH-TRANG.md`, chạy `tinh-trang.mjs` sau MỖI việc.
- Code còn nợ so với luật (nhãn `nguoi` sai ở `ghi.mjs`, xếp làn 4 điều kiện, cổng kiểm mã luật, rút mẫu 15%…): spec §C10. Cho tới khi xong: câu vẫn ghi `da_duyet=false`.
- 4 chỗ "chờ Thùy xác nhận" trong spec (lượng giác K9, K11, CLC6) · 2 đề toanmath treo (B046-05, B013-07).
- **⭐ 20/11 — (1) KHUNG ĐÁP ÁN KHỐI 3 + LÔ THỬ 50 CÂU (ĐÃ GHI DB).** Nhân sự phản hồi "đáp án K3 chưa có khung như K4, K5": đo kho K3 = 2.866 câu, chỉ 75 có lời giải hai phần (K4 963/4.514 · K5 1.369/5.421); phần còn lại là lời giải một khối từ `kho_cu`. `spec-giai-bai.md` › **Khối 3** giờ có khung hai phần + khuôn Phần 2 / điều Phần 1 phải nói cho 6 chuyên đề đang có trên bản đồ K3 (HK2 chưa có trên bản đồ ⇒ chưa có khuôn) + luật rút từ lô thử (không bước rỗng "Đọc đề…", không đánh số chồng, cách tính theo hàng của đặt tính ở Phần 1, Chú ý không chép kết quả). **Khuôn là bản nháp CTO — chờ trưởng khối 3 duyệt.**
  Lô thử (Thùy cho làm 20/11): 50 câu, 8–9/chuyên đề; máy thử 164 phép tính; Opus giải mù 48/48 khớp kho (2 bài vẽ không so được), ĐẠT, 0 sai lập luận; 19 lỗi khuôn đã sửa TRƯỚC khi ghi (bản đã sửa chưa qua Opus lần hai). Ghi DB: `loi_giai` + `nguon_giai='ai'` + `giai_method='claude_code'`, chỉ khi lời giải còn nguyên; cũ/mới ở `kho_sua_log` và `kho-rules/dai/lo/k3-khuon-thu/` (truoc-sau.json + biên bản Opus). **CHƯA làm ~2.740 câu K3 còn lại** — §E2 đang cấm quét kho cũ hàng loạt, chờ Thùy gật khuôn + lệnh (spec §C10 mục 18). Chờ trưởng khối 3 xem: gán dạng lệch `T1030000001499`, `T1030000001493`, `T103000000280`, `T103000000278`; đáp án `T103000000280` gõ `×` Unicode.
- **⭐ 20/11 — (2) PHIÊN CLAUDE "GIẢI BÀI TỪ ẢNH" (ĐÃ BUILD, CHƯA CHẠY THẬT TRÊN BOT)** — `spec-quan-ly-chat-luong.md` §6.5. Trưởng khối dán/kéo thả ≤5 ảnh đề vào chat (loại phiên `giai_bai`) → Claude đọc luật bằng `cat-luat.mjs <khối>`, phân dạng, giải, thử đáp số → mỗi câu một thẻ ```bkcau: **📋 Copy · 📥 Vào kho** (dạng "cao" ⇒ duyệt luôn, người bấm = người duyệt; "vừa"/không dạng ⇒ hàng duyệt / dạng chờ) **· 🧬 Clone** (K biến thể, thẻ ```bkclone, **duyệt ngay trong chat** — không tự duyệt, siết hơn §C6). DB (mig 202611201553/1556/1603, đã áp `--only`): `claude_phien_anh`, `claude_phien_tin.so_anh`, `fn_phien_gui(…,p_anh)` (≤5 ảnh/tin, 20 tin có ảnh/người/ngày), `fn_phien_chat_vao_kho` (tái dùng `fn_phien_kho_them`/`_duyet`; clone ghi `parent_ma_cau`, `nguon='clone'`, `clone_method='claude_phien'`; đã thử gốc→clone→duyệt rồi ROLLBACK), `fn_phien_anh_don`. Bot: tải ảnh về `scripts/phien/.tam/<phiên>/anh`; lệnh mới `thu` (hộp cát `node --permission`, 10 s) và `anh_cat` (PowerShell System.Drawing); prompt `scripts/phien/loai/giai_bai.md`. UI: `PhienClaudeTab.tsx`, `TheCauPhien.tsx`, `src/lib/phienAnh.ts`.
  **Việc còn lại của Thùy/máy bot:** (a) **khởi động lại `bot.mjs`** (máy nhà + máy công ty) để nhận bản mới; (b) chạy MỘT lần `supabase/migrations/202611201553_phien_anh_don_cron_sql_editor.sql` ở SQL Editor (cron dọn ảnh phiên đóng >30 ngày); (c) thử một phiên thật: dán ảnh → xem Claude có trả đúng thẻ JSON không, bấm Vào kho / Clone / Duyệt; (d) chưa làm: kho **trên lớp** trong chat (đi §C11), câu Đúng/Sai vào kho từ chat, phiên môn chưa có kho (Anh/Văn). Bẫy: hơn 30 mig cũ đang "treo" ở `migrate --status` (của phiên khác) ⇒ luôn `migrate --only <file>`, đừng `npm run migrate` trần.

### ⭐⭐⭐ KIẾN TRÚC ĐỂ CHỊU 1.000 → 10.000 HS (Thùy mở 13/11 · cập nhật 15/11) — ĐỌC `spec-kien-truc.md` TRƯỚC khi thêm bảng / hàm / màn

**Đích (Thùy chốt):** 1.000 → 2.000 → 10.000 đều là HS CỦA TRUNG TÂM (không có HS ngoài). Mốc 1.000 trong 6–12 tháng. Không vá từng lỗi — sửa kiến trúc từ trên + viết luật.
**Nguồn:** `spec-kien-truc.md` (kiến trúc đích, luật K1–K29 — K24–K29 thêm 15/11 —, **§12 danh mục 18 thiết kế sai đã trả giá (ĐỌC TRƯỚC KHI THIẾT KẾ; tóm tắt nằm trong CLAUDE.md §2.0)**, **§13 rà kiến trúc mỗi tháng**, phiếu 10 câu, lộ trình 7 đợt, §2b gộp theo khuôn, §4 khuôn tính sẵn) · bằng chứng `reports/audit-scale-13-11.md` (**chưa commit** — còn tên các lỗ chưa bịt) · nhật ký chi tiết DEVLOG 13 → 15/11.
**⭐ RÀ KIẾN TRÚC MỖI THÁNG (Thùy chốt 15/11):** tuần đầu mỗi tháng, lần đầu tuần đầu 12/2026 — `npm run ra:kien-truc` (lấy số, chỉ đọc) + các bước ở `spec-kien-truc.md` §13 → `reports/ra-kien-truc-YYYY-MM.md`. **Bản gốc để so: `reports/ra-kien-truc-2026-11.md`** (có tổng kết cả đợt sửa 11 → 15/11). Sự cố mới ⇒ thêm dòng vào §12 + mục cổng.
**Tiến độ theo đợt (15/11):** đợt 0 quyền — còn 3 mục · đợt 1 hàng rào — xong · đợt 2 nền dữ liệu — xong phần đã định · đợt 3 tính sẵn — xong khuôn + các sổ nặng · đợt 4 client — xong phần chính · đợt 5 hàm chậm — hết điểm nóng đo được · **đợt 6 thử tải + chọn gói máy — CHƯA** · **gộp bảng theo khuôn — CHƯA bắt đầu**.

**SỐ ĐO HIỆN TẠI (hiệu số hai lần chụp `_audit_pss()`, không phải số cộng dồn):**
- Cả DB dùng 9 % một nhân lúc vắng (trưa 14/11) · 16 % tối cao điểm 21:38–21:50 · 11,9 % sáng Chủ nhật có lớp. **Người dùng thật < 2 %**; phần còn lại là việc nền (bộ điều phối ~6,6 s mỗi lượt 5 phút) và Realtime của Supabase.
- Sổ nền 24 giờ tới 15/11 15:20: **0 lỗi, 0 lượt bị cắt**. Trung bình: bxh 2,5 s · mastery 1,4 s · dạng đã học 1,1 s · tin Thế giới 0,8 s · việc 0,6 s · phòng 0,5 s. Lượt 02:00 tính lại mastery cả 376 em hết 54 s (3 lượt).
- **⭐ GÓI MÁY: Thùy nâng Micro → SMALL 15/11 23:09** (thêm ~5 USD/tháng): `max_connections` 60 → **90** · `shared_buffers` 256 → 512 MB · `effective_cache_size` 768 MB → 1,5 GB · `work_mem` 3,5 → 5 MB. DB khởi động lại 23:09:26; lượt việc nền đầu tiên 23:12 chạy đủ 8 sổ, 0 lỗi; 7 job cron vẫn bật; cổng API + đăng nhập trả lời. Mọi con số "x / 60" bên dưới là của gói CŨ — đỉnh 58 và 45 giờ là trên trần 90. Số đo ms trước 23:09 là của máy 1 GB; chưa đo lại trên máy mới.
- **Kết nối (trần 90 từ khi lên Small):** đỉnh 7 ngày trên gói cũ là 58–59 / 60 (22:00 thứ Tư 11/11 — tối DB nghẽn, TRƯỚC các đợt tối ưu); đỉnh SAU tối ưu 45 (14/11 14:00: Storage 15 · Other roles 12 · PostgREST 9 · Reserved 8). Ai giữ: PostgREST 8 → ~20 theo tải (pool nở ra rồi không co lại) · FDW app phụ huynh 7 (thường trực) · Realtime 6–7 · Storage API 0 → 15 (chỉ khi có người xem / tải file) · Supavisor 2 → 8 · mỗi script / bot `claude_build` 1. `pg_stat_activity` có cả dòng nền (pg_cron, pg_net, Realtime) KHÔNG tính vào trần; `claude_build` không xem được trạng thái kết nối của người khác ⇒ đỉnh thật xem ở dashboard Supabase → Observability → Database. **Đề xuất chưa làm:** `alter role claude_build connection limit 10` (SQL Editor) · giảm FDW app phụ huynh / pool PostgREST / pool Realtime (DEVLOG 15/11 22:35–22:55). Giá gói: Small ~15 USD/tháng · Medium ~60 · Large ~110. DB 1.080 MB.
- Màn nhân sự còn > 0,5 s: ô lịch sử Dashboard học tập của môn KHTN/Lý/Hoá ~0,68 s · `fn_btyeu_de_xuat_dang_moi` 0,5–0,8 s. Mọi hàm Home app HS < 30 ms (thẻ Thế giới ~80 ms); sinh bài tự luyện 185–390 ms.

**ĐÃ CHẠY TRÊN DB (đều đã ghi sổ, đã push):**
- **Đợt 0 — quyền** (mig 202611131750 · 131804 · 131831 · 132159 · 141114 · 141147 · 141237 · 141250): RLS mọi bảng; thu EXECUTE của anon/PUBLIC; 20 view kho `security_invoker`; cổng nhân sự = MỘT nguồn `current_nhan_su_id()`; kho file sửa/xoá chỉ nhân sự; **mặc định mới: hàm/bảng mới KHÔNG cấp cho anon** (CLAUDE.md §2.1).
  - **0d (14/11):** `tai_khoan` · `nhan_su` · `vi_tri` · `vai_tro` · `vai_tro_chuc_nang` trước là ALL cho mọi nhân sự (TA gọi API tự bật admin được). Giờ ghi theo `co_quyen_ghi('ns' | 'hs' | 'phanquyen' | 'orgchart')`; `nhan_su` sửa qua trigger `_trg_nhan_su_chan_ghi` theo cột (cờ admin chỉ admin đổi; người thường chỉ tự sửa SĐT, email, ảnh, STK, giao diện/menu/phím tắt của chính mình; người có `gay` bật/tắt miễn gậy). Trigger chỉ áp cho lượt ghi thẳng của `authenticated`. `_push_bao_cap_nhat` đóng với người đăng nhập (3 trigger gọi nó đổi sang definer).
  - **Miễn gậy chỉ từ trưởng khối trở lên (Thùy 15/11, mig 202611152136):** đổi `nhan_su.mien_gay` phải qua `fn_gay_duoc_doi_mien()` (admin · trưởng/phó QLCL · trưởng/phó core · quản lý môn · trưởng khối; PHÓ khối không được) — xét TRƯỚC lối tắt quyền ghi hồ sơ `ns`, quyền ghi `gay` không còn đủ. 15 người đủ điều kiện, 5 người mất quyền này. Màn Gậy hỏi cùng hàm để ẩn nút.
  - **0e:** xoá phần gửi push của app PT (không ai dùng app PT nữa). **0f:** đóng `_kho_snapshot_cau` với người đăng nhập thường. **0g:** 4 hàm bảng xếp hạng app HS chỉ trả mã HS ở dòng của chính em; bỏ ô tick "Mã HS".
  - Thùy đã xác nhận trên app: TA tự sửa hồ sơ · màn Phân quyền / Sơ đồ tổ chức. **Chưa có bằng chứng:** push app TA còn tới sau khi đổi trigger (xem `net._http_response` sau một buổi được đóng) · Thùy/Trang/Lộc sửa hồ sơ nhân sự, cấp/gỡ tài khoản, cấp tài khoản HS hàng loạt.
- **Đợt 1 — hàng rào:** `npm run check:kien-truc` (`scripts/check-kien-truc.mjs`, số trần `scripts/kien-truc/tran.json`, danh sách cho phép `cho-phep.json`). Mục CỨNG = 0, mục TRẦN chỉ được giảm. Chạy sau mỗi migrate và trước commit đụng src. Dòng cảnh báo "N hàm ≥ 1 giây" đọc số CỘNG DỒN ⇒ là lịch sử, không phải hiện tại.
- **Đợt 2 — nền dữ liệu:** 20 index đường đọc nóng (mig 131843) · bảng tra `kho_cau_dang` + view `bdm_cau_dang` (mig 132043 · 132046 · 132053; đối chiếu `fn_kho_cau_dang_lech()` là mục cứng; **trigger của nó từng làm mỗi dòng gán dạng chậm thêm 128 ms — đã sửa mig 141244, còn 4,8 ms**) · "Việc của tôi" lọc theo người gọi + việc đã xong mặc định 2 tuần (mig 132206 · 132211).
- **Đợt 3 — MỘT khuôn tính sẵn (14/11):** `tinh_san_dang_ky` (danh mục sổ: lệnh, chu kỳ, khung giờ VN, ưu tiên, ngân sách giây) · `tinh_san_chay` (nhật ký từng lượt, giữ 7 ngày; `ms` NULL = lượt bị cắt) · `tinh_san_ban` (nhật ký bẩn CHỈ-CHÈN, chưa sổ nào dùng) · procedure `_tinh_san_chay(100)` chạy bằng **job cron 24 `tinh-san-dieu-phoi` (`2-59/5`)**: sổ đến hạn chạy theo ưu tiên, COMMIT sau từng sổ, lỗi sổ nào bắt riêng sổ đó. (Tiền tố `ts_` là của tuyển sinh ⇒ dùng `tinh_san_`.)
  - **11 sổ:** mastery (10) · mastery lưới đêm 02:02 (5) · dạng đã học (20) · mục tiêu tuần (30) · dạng yếu (40) · tin Thế giới (50) · việc theo người phụ trách (55) · phòng (60) · việc tháng · bxh (80) · số câu tự luyện 05:02 (90). **10 job cron cũ đã TẮT (không xoá)**; cron còn 7 job bật. `xu-dong-bo` cố ý không vào khuôn (ghi sổ xu là dữ liệu gốc). Lệnh quay lại nằm cuối mig 202611140816 và 141055.
  - **Các sổ đã đổi cách tính:** bxh "Tỉ lệ đạt" (A3) chỉ tính lại em có mốc mastery mới — 21,5 s → 0,35 s (mig 140830) · sổ `viec_lh_luu` + cửa đọc `fn_viec_buoi_thuong_lh_nen` cho hàm NỀN — sổ phòng 13 s → 0,4 s (mig 140903; người dùng gọi từ màn vẫn tính trực tiếp) · tin Thế giới và cache mastery **ghi phần khác biệt** thay cho xoá hết chèn lại (mig 140924 · 141012; lượt thường ghi 0 dòng) · `mastery_luu_san.lan_cuoi` (lần đo gần nhất của nút).
  - **Quyết định:** sổ bẩn của mastery GIỮ nguyên (`_mastery_ban_tg`: nhật ký chỉ-chèn + mốc lùi 2 phút + hàm đọc tự kiểm em sạch), không dời sang `tinh_san_ban`. Đánh dấu bẩn bằng upsert trên khoá duy nhất là SAI cho đường ghi nóng (giao dịch dài chặn HS nộp bài) ⇒ `tinh_san_ban` đã đổi thành chỉ-chèn (mig 141028), spec §4 đã sửa.
  - Theo dõi: `select so, max(ms), count(*) filter (where loi is not null), count(*) filter (where ms is null) from tinh_san_chay group by 1`.
- **Đợt 4 — client (đã push):** `getMyProfile()` giữ 5 phút theo uid + `xoaCacheHoSo()` ở 21 hàm ghi · Home app HS: 13 lượt gọi lẻ → 2 RPC `fn_hs_khoi_dong` / `fn_hs_man_chinh` (mig 140027; `src/lib/hs_home.ts`, RPC gộp lỗi thì tự rơi về gọi lẻ) · **MỘT cửa polling `src/lib/poll.ts`** (`batPoll` / `usePoll`: tab ẩn thì dừng, không gọi chồng, lỗi thì lùi dần) — 16 chỗ đã chuyển, `setInterval` trong src 38 → 22 · hỏi ép cập nhật 30 s → 5 phút · màn chính HS không có buổi bổ trợ hôm nay 60 s → 5 phút · thẻ Thế giới giữ 2 phút · `PhienClaudeTab` gỡ đăng ký Realtime vô dụng.
  **Deploy:** ERP + app TA 14/11 tối và 15/11 ~22:16 · app HS + app GV + app OPS 15/11 tối. Sau deploy chưa ai mở màn Gậy (nút miễn gậy) và màn buổi đuổi của TA (hai khối giải thích) ⇒ lần đầu có buổi đuổi của đợt chưa có dạng / đợt đã hoàn thành thì hỏi TA xem màn hiện gì.
- **Đợt 5 — hàm chậm:** `fn_xephang_chung` + `fn_tich_luy` 1.466 → 56 ms (mig 132233) · danh sách dạng tự luyện của HS 143–228 → 7–18 ms (mig 141210 · 141211) · `fn_de_thi_ds` 657 → 298 ms (mig 142201, hàm con chạy 1 lần/đề thay vì 3) · `fn_traogiai_thang` 1,4–3,0 s → 0,5 s (mig 150954, index + analyze cho bảng tạm) · ô lịch sử Dashboard học tập, ô Toán 1,13 s → 0,4 s (mig 151348).
- **Index HẸP cho bảng dòng rộng (15/11 — gốc của mọi con số "nguội gấp nhiều lần ấm"):** `bai_test_cau_id_hep_idx` · `tu_luyen_dang_lan_hs_cau_idx` (mig 151001) · `dai_cau_hoi_ma_cau_hep_idx` · `dai_cau_hoi_dang_hep_idx` (mig 151354; kèm `autovacuum_vacuum_scale_factor` 0,02 cho `dai_cau_hoi`). Không sửa hàm nào. Sinh bài tự luyện đọc đĩa 934 → 52–237 trang · báo sai chờ duyệt 679 → 78–99 ms (số người dùng thật) · lấy câu khối 12 cho builder 17.410 trang heap → 3. Tạo bằng `CREATE INDEX CONCURRENTLY` ngoài `migrate`, file migration chỉ để ghi sổ.
- **15/11 tối:** dashboard OPS đọc bảng tính sẵn như TA/GV (mig 202611151957; so cũ–mới khớp 8/8 ca, lượt đọc sẵn ~45 ms gồm đường truyền) · **đóng ET / BTVN: `fn_recompute_exp_thang` thêm `analyze` cho bảng tạm — 97 → 44 ms khi ấm, hết quét cả `gami_grades` 35 MB mỗi lượt đóng (mig 202611152202; so cũ–mới 66 ca / 6.126 dòng sổ, lệch 0)** · cổng `check:kien-truc` có mục K25 `db_ham_bang_tam_thieu_analyze` (trần 15; lượt soát bằng ĐỌC code từng kết luận sai "0 hàm cần sửa" — bảng tạm thiếu thống kê thì phải `explain` mới thấy) · 12 bảng mới của `claude_build` có policy gọi `la_thanh_vien()` trần đã bọc `(select …)` (mig 202611152146); `thong_bao_ph` (đã về chủ `claude_build`) bọc ở mig 202611152212; 18 policy của 16 bảng `postgres` Thùy chạy ở SQL Editor 22:20 (file 202611152145, đã ghi sổ) ⇒ không còn policy nào gọi hai hàm đó theo từng dòng.
- DB có 5 hàm chỉ đọc cho audit (owner postgres, chỉ `claude_build` gọi): `_audit_pss()`, `_audit_cron_job()`, `_audit_cron_runs()`, **`_audit_ket_noi()`** (kết nối đang mở: ai giữ, chạy hay nằm im, bao lâu) và **`_audit_kho_file_moi(tu, den)`** (file mới trong kho theo 10 phút × bucket, kèm số file do script đẩy) — hai hàm sau thêm 15/11 (file 202611152252, đã ghi sổ). Lúc vắng 22:54 CN: 36 kết nối client, chỉ 1 đang chạy; PostgREST giữ 17 kết nối nằm im (pool nở ra rồi không co lại).

**⛔ SỰ CỐ 13/11 TỐI — ĐỪNG LẶP:** gộp 115 bảng nhánh làm PARTITION của `kho_<họ>` ⇒ PostgREST không lộ bảng là partition ⇒ app báo "Could not find the table … in the schema cache", ET/kho/tài liệu hỏng ~1,5 giờ. Đã gỡ (mig 132053), đã xoá 25 bảng chung rỗng (mig 132100), `gop-khuon.mjs` đã khoá, `check:kien-truc` có mục cứng "bảng là partition = 0". **Đổi cấu trúc bảng app đọc trực tiếp phải thử qua REST + Thùy mở màn xác nhận trước khi nhân rộng.** Còn lại dùng được sau khi gỡ: mọi bảng nhánh có cột `kho` (hằng), cột lệch đã làm khớp, identity đã đổi sang sequence.
**⛔ HAI LẦN LƯỢT THỬ CỦA CLAUDE CHẠM NGƯỜI DÙNG (14/11 trưa · 15/11 sáng):** lượt thử trong rollback có `alter table` giữ khoá độc quyền `mastery_luu_san` ~7 phút (mọi lượt đọc bảng treo tới trần 8 s) · gọi 150+ lần một hàm có bảng tạm trong MỘT giao dịch làm đầy bảng khoá chung. Luật thử ở `HANDOFF-BAI-HOC.md` mục 14→15/11.

**Quyết định kiến trúc đã chốt 13/11:** "riêng theo KHUÔN, chung trong cùng khuôn" (sửa ADR môn) — khuôn dạng–câu (Đại · HGT · KHTN · Lý · Hoá) / mô hình–bài–ý (Hình) / ngôn ngữ (Anh · Văn). Cấm tạo bảng `<nhánh>_<tên>` mới và chép hàm theo nhánh. Hướng gộp CTO chọn: **gộp THẬT từng họ, client đi trước** (bảng chung + đồng bộ hai chiều → chuyển client → thử qua API + Thùy xác nhận → song song vài ngày → mới bỏ bảng nhánh); gom hàm chép theo nhánh trước. Chưa bắt đầu.

**Realtime của Supabase (đo 14/11, giả thuyết đầu của Claude SAI):** bộ đọc nhật ký ghi (`realtime_rls` gọi `list_changes` ~1,9 lượt/giây) chạy suốt khi dự án bật Realtime, **không phụ thuộc có ai nghe** — `realtime.subscription` 0 dòng, 0 lượt chèn từ 11/11 mà vẫn đọc. Chi phí tỉ lệ với lượng GHI của cả DB: 1,3 % một nhân ban đêm · 5,4 % tối · 11 % lúc ghi hàng loạt. Publication chỉ có `hoi_dap_nhan_su` + 5 bảng `sk_*`. Chưa tìm được công tắc tắt riêng; gỡ bảng khỏi publication không dừng việc đọc. Ghi gấp 10 thì khoản này phình theo ⇒ đo trong bài thử tải đợt 6.

**CHỜ THÙY QUYẾT / LÀM:**
- **Mật khẩu mặc định = mã HS**, mã đánh số tuần tự nên đoán được — lỗ gốc còn lại của đợt 0 về phía HS. Buộc đổi mật khẩu khối nào, lúc nào?
- App HS + app GV đã deploy nhưng **chưa ai xem trên màn:** nút "Vào ca" ở màn chính HS khi TA điểm danh · màn theo dõi ca / lịch phòng / buổi học trực tiếp tự cập nhật · "Việc của tôi" nhóm "Đã xong — 2 tuần gần đây".
- **Huy hiệu: Thùy 15/11 "tạm thời chưa dùng"** ⇒ không chốt tháng 7–10, không tối ưu `fn_hs_album` (1,9–3,7 s vì `hs_thanh_tuu_thang` trống ⇒ tính sống cả 5 tháng mỗi lượt mở). HS vẫn mở được Album từ Hồ sơ / Thành tựu. Bật lại ⇒ việc đầu tiên là chốt tháng theo thứ tự.
- Miễn gậy (đã làm 15/11, mig 202611152136): nhánh "trưởng/phó team core" trong `fn_gay_duoc_doi_mien()` là Claude tự xếp vào "trưởng khối trở lên" (1 người — trưởng Vận hành) — Thùy không muốn thì bỏ nhánh đó.
- Dashboard Supabase: "Allow new users to sign up", "Confirm email", API "Max rows" — chưa biết giá trị.

**VIỆC KẾ TIẾP (đo một cửa sổ hiệu số trước khi chọn — memory `toi-uu-do-hieu-so-am-nguoi`):**
1. **Xác nhận bằng số người dùng thật giờ đông** cho các index 15/11 (sinh bài tự luyện, gợi ý lùi buổi, cây bản đồ): script `theo.mjs` / `pss2.mjs` chỉ nằm ở scratchpad phiên 15/11 (có thể đã bị dọn) — cách làm: chụp `_audit_pss()` hai lần (lọc `rolname = 'authenticated'`, `query ~ 'pgrst_call'`, lấy hiệu số 10 phút). Cửa sổ 13:55–14:05 CN quá vắng, mới có 5 lượt.
2. **Đợt 6:** thử tải (k6) + chọn gói máy chủ. Phải đo cả: kết nối (gói Small trần 90 từ 15/11; đỉnh cũ 45–58) · Realtime theo lượng ghi · bộ điều phối khi số em bẩn gấp 10.
3. **Lõi mastery môn một vùng** `_mastery_mon_d` ~0,58 s mỗi em (chuỗi hàm gọi cho từng câu: `_do_o_quy` → `_khtn_la_lan_do`…) — viết lại theo tập là rủi ro cao, cần bộ đối chiếu trước. Ảnh hưởng: ô lịch sử môn KHTN/Lý/Hoá, lượt tính lại đêm.
4. **Đợt 0 còn 3 mục:** chuyển cấp tài khoản về máy chủ rồi đóng signup · `bkdemy-ph-app/lib/admin-auth.ts` coi mọi token ERP là admin · rà ~40 hàm người đăng nhập gọi được có trả `ma_hs` (và 2 hàm `fn_bxh_diem_*_khoi` dùng chung nhân sự + HS).
5. **Đợt 3 còn lại:** "một cửa đọc lịch sử đo" · cây bản đồ vào danh mục · 6 hàm khác còn gọi thẳng `fn_viec_buoi_thuong_lh` (`fn_ta_viec_thang`, `fn_gv_viec_thang`, `_troly_*`, `fn_bctk_so`) — chuyển khi đo thấy cần.
6. **Đợt 4 còn lại:** Home app HS ngoài 2 RPC gộp vẫn còn ~8 lượt gọi (hòm thư, thành tựu, Thế giới, rank + nhiệm vụ, bổ trợ, học từ đầu, may mắn, ghi mở app). Cache dữ liệu tham chiếu cho nhân sự: đề xuất BỎ khỏi lộ trình (lợi cho ~40 người, rủi ro số cũ).
7. **Đã đo, cố ý KHÔNG làm** (đừng làm lại nếu chưa có số mới): gỡ nhánh "chụp bù" trong `fn_mastery_lam_moi` (ấm 184 vs 182 ms) · lưu sẵn số thành tựu chờ nhận · `offset 0` cho 10 hàm khác có mẫu lateral (lợi < 10 %) · index bán phần cho điều kiện chọn câu (ấm 30–50 ms) · bxh A1/A2 tính tăng dần (một vòng 5,25 s / 10 phút).

### ▶ CÁC MẢNG KHÁC ĐANG CHẠY (09 → 18/11)

- **▶ 14–15/11 — VIỆC CỦA CÁC PHIÊN KHÁC chưa có mục riêng trong HANDOFF (chỉ trỏ DEVLOG; phiên nào chốt mảng của mình thì xoá dòng tương ứng):**
  - **Giải tháng 10 (15/11):** lớp 8 có xu 30/giải, đã vá 9 giải (mig 202611151041 ĐÃ ÁP). **Báo app phụ huynh: mig 202611151055 ĐÃ ÁP 15/11 22:11** (Thùy đổi chủ `thong_bao_ph` ở SQL Editor rồi nói "Áp ngay tối nay"): 76 thông báo cá nhân cho 72 em (45 có câu xu), khớp 1–1 với `hs_giai_thuong` tháng 10, hiện tới 15/12; `_giai_ghi_nhan` từ nay ghi kèm thông báo phụ huynh; policy đọc cho `fdw_bkdemy_web`. **Chưa kiểm:** app phụ huynh có hiện + cron push có gửi tới điện thoại không (Claude không vào được app PH).
  - **Lịch khối ↔ Lịch phòng (14/11 tối, `spec-bo-tro.md` §42–§43; mig 202611142221 · 142226 ĐÃ ÁP):** sinh ca không còn bỏ im lặng dòng trùng người/giờ; test đầu vào / phát sinh chung phòng được với ca bổ trợ (cảnh báo), chỉ chính khoá còn chặn. Chờ Thùy: xoá 5 nhóm dòng Lịch khối nhân đôi · bấm Chốt tuần · 2 ca mồ côi đã có em · chưa kiểm trên màn thật.
  - **Bù theo nhóm (14/11, `spec-bo-tro.md` §41; mig 202611140851 · 140855 ĐÃ ÁP):** 1 em 4 đơn vị · 2 em 3/em · 3 em 2/em. Nợ: luật nhóm ≥ 4 em; Dashboard Lấp đầy ≠ Lịch phòng ở buổi vắng và nhóm ≥ 4.
  - **Bổ trợ đuổi — in giấy (14/11, Thùy đã deploy, TA in được):** nút "🖨 Giấy" cho dạng có trắc nghiệm trong buổi có iPad; bài giấy đã in mở lại được để chấm; bản in chỉ có đề. **Hai lỗ màn TA trống đã sửa 15/11 (mig 202611152141; app TA CHƯA deploy):** hàm mới `fn_duoi_buoi_tinh_trang(p_buoi)` ⇒ màn `DuoiCaTA` nói rõ "đợt chưa có dạng mục tiêu — team học thuật chưa chốt" hoặc "đợt đã hoàn thành ngày … x/y dạng — báo Vận hành gỡ em"; `fn_bo_tro_tu_kiem` (banner Lịch phòng) báo thêm hai ca này cho buổi CHƯA dạy. Không tự huỷ buổi, không đổi `fn_duoi_tien_trinh`. Vẫn cho xếp buổi trước khi chốt dạng (thiết kế cũ: "Ops có thể xếp lịch trước").
  - **Test đầu vào chỉ lấy đề MT (14/11):** `LOAI_DE_TEST = ['mt']` + trigger `trg_de_test_chi_nguon_mt` (mig 202611142204 ĐÃ ÁP).
  - **Mảng khác có mục DEVLOG 14–15/11, xem tại đó:** K6 clone (Số chính phương, Số nguyên) · MCQ 4T/5T · bản đồ 4T (87 dạng, phân 1.223 câu, soạn 200 câu) · toanmath cuối kì I K10–K12 (TẠM DỪNG, `kho-rules/dai/lo/toanmath/_hang-doi-14-11.md`) · Nông trại (sân nhà, câu cá, 3 kiểu nhà) · in giáo trình Hình bài nhiều ý thành một khối.

- **⭐⭐⭐⭐ BỘ ĐỀ TOANMATH ĐÃ TẢI — GIẢI PHẦN CÒN LẠI THEO BATCH (12/11; Thùy: "chia từng batch để nắm tình hình vào báo cáo, không giải linh tinh"). B001 ĐÃ GHI DB.** Thư mục `kho-rules/dai/lo/toanmath/` — đọc `KE-HOACH.md` trước, tiến độ ở `so-theo-doi.md` (tự sinh).
  - **Đo:** 2.988 bài đăng (`E:\BK ACADEMY\Tài liệu tham khảo\_toanmath-danh-sach.csv`) · 1.474 đã có (sha256 + kiểm nghi trùng bằng NỘI DUNG, `kiem-nghi-trung.mjs`) · bỏ 96 đề cương K12 (Thùy: thi thử K12 đã quá nhiều) · bỏ 22 bài trùng bộ **Noctorium** (`kiem-noctorium.mjs`: nội dung cụm 6 chữ + tên trường) ⇒ **còn 1.383 bài / 130 batch**.
  - **Thứ tự (Thùy 12/11):** CUỐI KÌ trước, khối **9 → 8 → 7 → 6 → 11 → 10 → 12**; rồi giữa kì cùng thứ tự; rồi thi vào lớp trên (K12 thi thử sau cùng). Trong khối: đề thi (Word đã bóc → PDF → scan nghi trùng) rồi đề cương.
  - **Một batch (đã chạy thật B001):** `do-trung-batch.mjs` (so nội dung với mọi đề thi cùng khối trong kho; scan thì xem ảnh) → viết `batch/<ma>/ds-de.json` tay (trang ĐỀ / trang HƯỚNG DẪN CHẤM / bộ nhiều đề tách theo trang) → `chuan-bi-batch.mjs` → `_dau-brief.md` + `ghep-brief.mjs <ma> k9-cki` (brief gốc đã chạy, chỉ đổi đường dẫn) → Sonnet soạn + Opus soát mù (≤20 trạm song song; soạn 3 đề thử trước) → `tong-hop-batch.mjs` → ghi thử ghi.mjs (rollback) đo trùng câu → `duyet-batch.mjs` (HTML, 11 MB, không commit) → **Thùy nói "ghi"** → vòng ghi `--ghi` tuần tự (dấu `da-ghi.txt`). Không dùng Gemini: trạm soạn gõ lại từ ảnh trang.
  - **B001 (K9 đề thi cuối kì 1/4) — ĐÃ GHI 12/11:** 16 bài → 1 bỏ (phường Hà Đông 25-26 = CKI-02) → 31 đề (13 đơn + bộ ôn tập Cổ Loa 6 + Nghĩa Tân 12) · **259 câu (Đại 193 · Hình 66), da_duyet=false; 256 mới, 3 trỏ câu cũ** · soát 31/31 ĐẠT, lệch 0, sửa 24 đề (không đổi đáp số) · 3 hướng dẫn chấm in sai (04 Bài 2 · 08 IV.1 · 12 Bài V) · bỏ 1 câu thiếu dữ kiện (30 Bài 3.1). Câu Hình **tạm ở HH00108** (`DANG_HINH_K9`) — CHƯA xếp theo chủ đề (`k9/cki/xep-hinh.mjs`), chờ Thùy cho làm.
  - **⏸ Chờ Thùy quyết (7 câu Chưa chắc, trang `batch/B001/duyet-B001.html`):** góc nội tiếp ở đề CKI (03 IV.2, 10 IV.2 — trường có thể dạy Cánh Diều, bộ này có góc nội tiếp HK1) · số liệu đề ra nghiệm vô tỉ (18 Bài 3.3) · đề hai cách hiểu (14 Bài 1.1b, 4.1 · 22 Bài 2.2, 3.1).
  - **13/11 — ĐÃ GHI THÊM (tổng toanmath đã ghi: 8 batch · 1.088 câu):** B002 K9 (15 đề · 138 câu, máy nhà, Hình ở **HH00140** — lệch B001/B005 HH00108) · B005 K9 CKI còn lại (2 · 16, HH00108) · B010 + B011 K8 CKI (33 · 464, Hình 118) · B017 + B018 K7 CKI (5 · 83) · B024 K6 CKI (7 · 128, 34 câu kho hgt). B020/B026 (scan nghi trùng K7/K6) trùng kho hết, bỏ. Luật mới 13/11: câu Chưa chắc ghi `kiem_may='nghi'` (trigger tự duyệt bỏ qua). **Duyệt làm trên màn Kho đề thi — KHÔNG dựng trang HTML duyệt cho toanmath.**
  - **Hai máy:** thư mục làm việc (`goc.pdf`, ảnh trang, **hình cắt + hình giải vẽ**) KHÔNG nằm trong git và KHÔNG nằm trong `E:\…\Tài liệu tham khảo` — máy nhà ở `C:\Users\Admin\bk-kho-lam-viec`, máy công ty `C:\Users\WBPC\bk-kho-lam-viec`. **Hình sống trên KHO, không sống ở máy (Thùy 13/11):** soát xong ⇒ `anh-batch.mjs day <BATCH>` (bucket kho-anh `lam-viec/toanmath/<BATCH>/<MA>/img|tam/`); `ghi-batch.sh` tự `keo` + dựng lại goc/trang nên máy nào cũng ghi được. Đã đẩy B001 B005 B010 B011 B017 B018 B024 (B002 ở máy nhà chưa đẩy). Trước khi có luật này: `chuan-bi-batch.mjs` dựng lại goc/trang/sha từ PDF gốc + trạm Sonnet `_brief-lam-lai-hinh.md` cắt/vẽ lại đúng tên tệp đã khai (13/11 làm lại 140 hình cho 6 batch, ~4 phút/9 trạm). Ghi cả batch: `bash kho-rules/dai/lo/toanmath/ghi-batch.sh <BATCH> <khối> [--ghi]` (K9 đặt `DANG_HINH_K9`).
  - **13/11 chiều — K11 đề thi cuối kì I, CHỈ ĐỀ TRƯỜNG (Thùy):** B031–B034 = 16 đề · 356 câu (Đại 245 · Hình 111) · 318 mới · 38 trỏ cũ · 4 câu nghi, ĐÃ GHI. Bỏ 6 bộ ôn tập 10 đề (~60 đề) — Thùy chỉ lấy đề trường. Brief gốc = đề cương K11 qua `ghep-brief.mjs <B> k11dc` + đầu đè `_brief-chuan-bi-k11-cki.md`. Quy ước lô: "hai đường thẳng trong không gian có mấy vị trí tương đối" = 4 (SGK KNTT). Lỗi máy mới: `	ext`/`
otin` bị ghi thành TAB / xuống dòng thật (cổng không bắt) ⇒ `ghi-batch.sh` chặn.
  - **Đề thi cuối kì I còn lại:** K10 (B041–B042, 6 bài) · K12 (B050–B053, 34 bài). **Chú ý:** B003/B004/B012/B019/B025 là CUỐI KÌ II (tên batch ghi "cuối kì") — Thùy 13/11: làm cuối kì I trước. Rồi đề cương cuối kì I (K9 B006–B009 · K8 B013–B015 · K7 B021–B022 · K6 B027–B029 · K11 B036–B038 · K10 B044–B047). Câu Hình K9 cuối kì chưa xếp theo chủ đề (HH00108 + HH00140). Còn treo: lượt Word 860 câu đã bóc máy (`.nhap-tam/toanmath-word/`, ngoài git) rải trong batch K10–12; 35 file Word bóc lỗi + 15 bài 0 câu đã dồn sang batch PDF.
  - **Bài học:** đo trùng bằng TÊN không đủ (Noctorium tên khác, cùng đề) ⇒ nhân chứng NỘI DUNG + mốc nhiễu (đề đứng nhì); 1 cụm 5 chữ trùng là đủ "khớp" ⇒ nhiễu quá cao, phải cụm 6 + câu khớp ≥50% cụm. Hướng dẫn chấm của trường SAI khá thường (3/8 đề) ⇒ luôn để trạm tự giải trước, HD chỉ là nhân chứng. Đường dẫn Windows trong chuỗi JS: dùng `/` hoặc `String.raw` (đã mất `\` hai lần).

- **⭐⭐⭐ VẬT LÝ 12 — BẢN ĐỒ + LÝ THUYẾT + VÍ DỤ ĐÃ LÊN DB; HÌNH MINH HOẠ ĐANG LÀM (12/11 khuya).** Thư mục `kho-rules/vatly/k12/` (README + cong-cu/).
  - **Đã ghi DB (vatly_bdm_*, khối 12):** cây 4 chủ đề · 17 chuyên đề · 33 nhóm · 67 dạng (từ 90 đề thi thật 2025+, bão hoà). Mô tả 32/33 nhóm · LT chung 25 nhóm · **LT riêng 62/67 dạng** · ví dụ 62/67 dạng (166 VD) — chép từ ebook "Nắm trọn kiến thức VL12" Đỗ Ngọc Hà Tập 1+2 (`E:\BK ACADEMY\Vật Lý\VL12`). Khối viết theo SGK KNTT nằm sau phần chép sách (định nghĩa tesla, Φ max/min, e cuộn N vòng, quy tắc bàn tay phải, so sánh tia phóng xạ).
  - **Còn trống:** nhóm *Thí nghiệm đo c, λ, L* (LT); ví dụ 5 dạng (TN đo c,λ,L · đồ thị đẳng quá trình · TN chất khí · tính B dây thẳng · tính λ,f); LT riêng 5 dạng. Bản đồ chưa có dạng **f = np máy phát** (sách có) — chờ Thùy quyết thêm dạng. Chưa nhập câu hỏi nào.
  - **Hình minh hoạ LT — ĐANG LÀM, chưa ghi:** Thùy chọn "theo đề xuất" (Tập 1 cắt sách · Từ trường + Hạt nhân vẽ lại bằng code · ảnh thật Wikimedia giấy phép tự do). Việc: `hinh-lt/viec.json` (112 khối) chia trạm `viec-<TRAM>.json`, ảnh ở `hinh-lt/anh/`, manifest `hinh-lt/lam-<TRAM>.json`. **Đủ 7 trạm (đã push):** cắt sách 20 · vẽ lại 97 (VE1 10 · VE2 28 · VE3 23 · VE4 12 · VE5 24) · Wikimedia 9 ảnh (H110 chiếu xạ tạo giống bỏ ⇒ nên vẽ lại; H010 thiếu ảnh bay hơi; H103/H109/H112 ảnh yếu). VE5 vẽ theo nội dung, KHÔNG đối chiếu hình sách; H092 đường năng lượng liên kết riêng bỏ đỉnh He-4 ⇒ soát.
  - **Việc kế:** soát hình (CAT báo H025 quá cao, H011/H019/H029 chữ nhỏ, H002/H008 vết chữ nền ⇒ cân nhắc vẽ lại; kiểm đúng vật lí H026 đẳng nhiệt T₁<T₂, H056 Lenz, H060 thanh chuyển động) ⇒ `node kho-rules/vatly/k12/cong-cu/hinh-lt-rap.mjs` dựng `de-xuat-hinh-ly-thuyet.html` cho Thùy duyệt ⇒ Thùy nói "ghi" mới `--ghi` (upload kho-anh/vatly_lt + chèn `![](url)` sau khối; khối bị sửa thì bỏ qua).
  - **Bài học:** điền nội dung cho môn mới ⇒ đối chiếu môn đã chạy (Toán) xem ô nào được dùng (LT có ở cả NHÓM lẫn DẠNG). Sách scan nhiều tập: số trang PDF↔in có thể đổi giữa sách (trang quảng cáo chèn) ⇒ brief bắt trạm dò theo nội dung. Câu chỉ có bảng đáp án ⇒ lời giải đúng "Chọn X.", trạm hay tự thêm giải thích — phải đối chiếu trang sách.
- **⭐⭐⭐⭐ LỊCH PHÒNG MỘT NGUỒN + BỔ TRỢ › LỊCH KHỐI + CHỐT TUẦN (10→12/11; Thùy: "mọi hoạt động xếp lịch của BK phải lấy nguồn từ lịch phòng tổng quan để không conflict"). Mọi thứ trên `main` (055cc2e3 · dc92a566 · 8b43e92d), DB đã áp hết 3 mig; ERP đã lên theo lượt deploy 14–15/11.** Ghi chi tiết: `spec-van-hanh-trung-tam.md` §2–§3 (file cũ `spec-xep-bo-tro-chung.md` đã vào `_luu-tru/`).
  - **Nguồn duy nhất = `fn_phong_lich(tu, den)`** (mig `202611101544`): 8 nguồn — buổi thường / TKB (lớp chưa mở buổi) · buổi bổ trợ lẻ (mọi loại, trừ buổi nằm trong ca CÓ phòng) · `ca_bo_tro` · `ca_bo_tro_nhe` · `lich_truc_bo_tro` chiếu lên ngày chưa sinh ca (cùng luật bỏ dòng trùng TA của `fn_ca_bo_tro_sinh_ngay`) · phát sinh · khung test. `phong_ma` NULL = có giờ chưa có phòng. `src/lib/phong.ts` chỉ gọi RPC (Tổng quan phòng, Lịch phòng, form phát sinh, form xếp yếu tự hưởng). **Thêm nguồn chiếm phòng mới ⇒ thêm 1 nhánh vào hàm này, không gộp ở client.**
  - **Kiểm trùng ở DB:** 1 ngày `fn_phong_kiem_trung` · lịch khối hằng tuần `fn_lich_truc_kiem_trung` (phòng + người, 4 tuần, chặn/cảnh báo; ghép 1 ca bổ trợ = cảnh báo vì luật ≤2 ca/phòng) · TKB `fn_tkb_kiem_trung`/`fn_tkb_luu` (chính khoá là gốc: trùng chính khoá/test/phát sinh chặn, trùng bổ trợ cảnh báo) · `fn_ca_bo_tro_tao` chặn trùng phòng/người (buổi lẻ của chính TA không tính) · `fn_btnhe_tao` vẫn CẢNH BÁO (spec-bo-tro §8.2) nhưng đếm trên lịch chung + `trung_ds`. UI dùng chung `components/TrungPhongList.tsx` + `useKiemTrung`.
  - **Màn Bổ trợ › Lịch khối** (tab cũ "Lịch trực"; `botro/LichTrucScreen.tsx` + `LichKhoiModal.tsx`): lưới = component `TongQuanTuanScreen` (mauTheo 'nguon', bấm ô trống = xếp đúng ngày/phòng/giờ, bấm ô bổ trợ khối = sửa) · nút "+ Thêm lịch bổ trợ" · danh sách + lọc "Chưa có phòng" (12/11: cả ~60 lịch đang chạy CHƯA có phòng — người xếp phải gán). Lưu = `fn_lich_truc_luu` (sửa không đổi giờ/người ⇒ bỏ kiểm người; ca chưa có em đi theo lịch mới).
  - **Xoá (thay Kết thúc, 12/11, mig `202611122233`):** `fn_lich_truc_xoa` — còn ca từ hôm nay có em ⇒ trả `vuong`, popup hỏi; xác nhận ⇒ huỷ ca + buổi (em về hàng chờ). Lịch chưa sinh ca ⇒ delete; đã sinh ⇒ `hieu_luc_den` = hôm qua (ca cũ FK về; mọi hàm đọc lịch trực đều lọc hiệu lực).
  - **Chốt lịch tuần (12/11):** mỗi tuần bấm 1 lần kể cả không đổi. `fn_lich_khoi_chot_tuan` sinh ca các ngày còn lại · ca trống theo lịch hiện tại · huỷ ca trống của lịch đã xoá · lưu bản chụp vào `lich_khoi_chot` (append). `fn_lich_khoi_chot_trang_thai` so NỘI DUNG bản chụp (gồm hiệu lực) ⇒ "đổi sau chốt — chốt lại". Màn: 2 thẻ Tuần này / Tuần sau.
  - **▶ CÒN:** người xếp lịch gán phòng cho lịch cũ + bấm Chốt tuần này lần đầu (chưa ai bấm thật; thử rollback: tuần 09/11 sinh 3 · cập nhật 1 · huỷ 5 ca trống) · chưa có nhắc việc khi tuần chưa chốt (chờ Thùy nói ai chốt ⇒ đưa vào Việc của tôi) · khung test đầu vào + phát sinh chưa chặn khi ghi (phát sinh: CEO chốt cảnh báo mềm) · `LichTrucTab` cũ trong `XepLichBoTroYeuScreen.tsx` không còn chỗ dùng (để nguyên, xoá phải hỏi).

- **⭐⭐⭐⭐⭐ MỤC TIÊU TUẦN — TRẠNG THÁI 18/11 (phiên cloud; mọi code trên `main` cả 2 repo, nhánh `claude/nifty-goldberg-eqp0ha` đã gộp hết, từ 18/11 làm thẳng `main`).**
  **Luật hiện hành: `spec-van-hanh-tuan.md` §4 — đọc §4.6b trước (thắng phụ lục §4.7).** Đạt = chạm MỤC TIÊU TUẦN · tiến độ = số nhóm Đạt ÷ mọi nhóm trên tờ · nhãn thẻ Đạt / Chưa đạt / Chưa đo · xếp hạng % → số việc → điểm tăng, MỖI NGÀY MỘT LẦN từ 05:00 · Phần 1 = buổi theo luật lùi 1 buổi (ET + BTVN đi cùng buổi) · Phần 2 = lượt chốt bổ trợ duyệt TRONG tuần (đồng bộ tự động, không khoá) · công bố khoá Phần 1.
  - **Màn:** ERP = Phòng làm việc › 🎯 Mục tiêu tuần (đồ vật riêng, cột lịch trái: 📅 Giáo trình tuần → 🎯 → 📝 Báo cáo tuần); Dashboard học tập KHÔNG còn tab này · app HS + app PH cùng cấu trúc (3 phần header màu: Bài trên lớp · Ôn tập kiến thức · Hoạt động tuần này) · ERP có 📱 Xem như phụ huynh (trang `/xem-mtt` của app PH) + Chi tiết từng dạng (`fn_mtt_viec_dang`).
  - **Mig của đợt (Thùy áp ở SQL Editor):** 1800 · 1937 · 2310 · 2340 ✅ (Thùy báo xong) · **0010 (cờ `dat_mt`) — Thùy đã chạy, chữ "Đạt" hiện** · **0040 (xếp hạng mỗi ngày + tiêu chí phụ) — sổ migration ghi ĐÃ ÁP (đối chiếu 23/11)**. Sau đổi luật: chạy `scripts/mtt/tinh-lai-toan-bo.sql` lặp tới XONG. `npm run schema` chưa chạy cho các mig này.
  - **Còn mở / chờ Thùy:** ca Luyện Minh Đăng (16 nhóm Yếu, nhiều 0%, Phần 2 trống) — đã đưa câu dò `bo_tro_de_xuat`, chưa có kết quả; nghi chấm "Không làm" thay "Mất bài" · bật lại tự deploy ERP (`vercel.json` `git.deploymentEnabled:false`) hay không — chưa hỏi · số đầu tuần `mtt_dau` thiếu cột `mon` · index khoá ngoại bảng `mtt_*` · giữ `mtt_luu` bao lâu (K17).
  - **⚠ DEPLOY ERP từ phiên CLOUD:** ERP tắt tự deploy ⇒ `npx vercel --prod` đóng gói THƯ MỤC TRÊN MÁY THÙY ⇒ phiên cloud đẩy lên main thì Thùy phải **`git pull` trước khi deploy** (18/11 deploy không thấy nút mới vì quên pull). App PH nối GitHub ⇒ đẩy main là tự deploy.
  - **Bài học còn hiệu lực:** (1) áp mig qua SQL Editor ⇒ cuối file đổi chủ về `claude_build` + revoke anon (sự cố 15 giờ 16–17/11) · (2) vá hàm đang chạy bằng `pg_get_functiondef` + khớp đúng 1 chỗ, **bỏ `\r` trước khi so** (thân hàm áp từ máy Windows mang CRLF — 2340 lần đầu "khớp 0 chỗ") · (3) thử luồng so mốc thời gian thì chạy LỆNH RỜI, một giao dịch thì `now()` đứng yên · (4) "đạt" phải MỘT nghĩa trên cùng màn — nhãn mức 80/50 cạnh tiến độ theo mục tiêu tuần làm Thùy hiểu sai (99% vs 4/6) · (5) tờ cũ chưa tính lại ⇒ hỏi `tinh_at` trước khi kết luận công thức sai · (6) client không tự so p ≥ mt — cờ do DB tính (`dat_mt`).

- **⭐⭐⭐ TIMEOUT TOÀN HỆ — ĐỢT 11/11: ĐÃ ÁP HẾT (việc tiếp nối nằm ở mục KIẾN TRÚC phía trên).** Luật: CLAUDE.md §2.0 "GỌI ĐÚNG CÁI ĐANG HIỆN · SỐ KHÔNG REALTIME THÌ TÍNH SẴN". Chẩn đoán gốc: `reports/audit-timeout-11-11.md` — ERP và app HS chung 1 DB ⇒ DB nghẽn kéo mọi truy vấn.
  - **Trạng thái (đối chiếu sổ migration 23/11):** mọi mig `20261111*` đã áp, kể cả các file bản HANDOFF cũ ghi "CHƯA ÁP / CHƯA commit" (`…2136_toi_uu_phien_kho_them` · `…2136_toi_uu_hs_index_hs` · `…2136_toi_uu_tl_nt_nhip_dht` · `…2152` · `…2211` · `…2212` cron · `…2221`). Các cron riêng của đợt này (BXH, tin Thế giới, việc tháng, dạng yếu) nay chạy trong bộ điều phối `tinh-san-dieu-phoi`. `fn_tich_luy` và `fn_traogiai_thang` đã sửa 13–15/11.
  - **Còn dùng:** `fn_do_truy_van_cham(2000::numeric, 100)` (đọc pg_stat_statements) · bảng chụp `hs_so_luu` + cờ bẩn (trigger `zz_hs_so_ban`; thiếu điều kiện thì tính trực tiếp) · `bxh_luu` · `the_gioi_tin_luu` · `dash_viec_thang_luu` · `_la_tac_vu_nen()` cho hàm nền gặp kiểm quyền người gọi.
  - **Còn mở:** `fn_bdm_cay` (bộ đếm phiên bản `dai_bdm_cay_ban_seq` dùng chung ⇒ bản lưu luôn bị coi là cũ; hướng: phiên bản theo khối) · `check:style-hs` rớt sẵn ở `CaBoTroHS.tsx` (3 màu gõ tay).
  - **Bài học:** tạo index trong transaction vẫn KHOÁ GHI bảng thật suốt lúc chạy dù rollback (11/11 khoá `dai_cau_hoi` ~2 phút × 2) ⇒ đo index bằng bảng bản sao hoặc `CONCURRENTLY` ngoài transaction.

- **⭐⭐⭐ MASTERY THEO LẦN, TỐI ĐA 30 NGÀY + PHÒNG TRƯỞNG KHỐI › CHẤT LƯỢNG (10/11). Loại bài nào được tính: xem "Mastery — Thùy chốt + ĐÃ ÁP 17/11" ở trên, mục đó thắng.**
  - **Luật:** ô = TB ≤5 lần gần nhất (Hình–Học 3) trong 30 ngày tính tới mốc (`p_den` hoặc now()); 30 ngày không có lần nào ⇒ KHÔNG có dòng = chưa đo, không lấy lần cũ. Một chỗ duy nhất: `_mastery_lan_cap` (mig `202611102142`); cache `mastery_luu_san` + lưới đêm 02:00 đánh bẩn tất cả ⇒ lần quá 30 ngày rơi ra theo ngày. Dashboard học tập không còn lọc tuần (`fn_dbht_bang` đọc `_mastery_lan_cap_nhanh`, 4 cấp dạng · nhóm · chuyên đề · chủ đề).
  - **Lịch sử ô:** `fn_dbht_o_lich_su(…, p_so_ngay=30)` + `co_cu` ⇒ nút "Xem thêm 1 tháng trước" gọi lại DB lúc bấm. "Hiện tại" từng dòng = luật 30 ngày tính tới ngày đó (có thể khác ô = tính tới hôm nay).
  - **Chất lượng (trưởng khối):** 4 mục Dashboard học tập · Tình hình chung · Hồ sơ học tập · Danh sách bổ trợ. Tình hình chung = box Nhóm yếu (đầu tuần / hiện tại) + box Học sinh yếu (≥3 · 2 · 1 nhóm), tách nhóm cũ đang xử lý / nhóm mới tuần này (`fn_qlcl_nhom_yeu`, đọc bảng chụp `dang_yeu_hien_tai` / `dang_yeu_dau_tuan`).
  - **Bài học:** đổi TÊN tham số RPC (drop / tạo lại) ⇒ bản web đang chạy chết ngay tới khi deploy (PostgREST khớp theo tên) ⇒ giữ hàm chuyển tiếp nhận tên cũ tới khi deploy xong rồi mới gỡ.
  - **Treo:** gỡ công cụ `bo_tro_retest` ở ô hỏi TBM (Luật xoá, chờ gật).

- **BOT PHIÊN CLAUDE CHẠY TRÊN 2 MÁY** — máy nhà (DESKTOP-EV1E49J) + máy công ty (DESKTOP-HD2484P): mỗi máy 2 tác vụ Windows `BKdemy Phien Claude` + `BKdemy Phien Luoi Vot`, log `scripts/phien/bot.log`; `PHIEN_TAI_LIEU_DIR` máy nhà = `G:\Other computers\My Computer\BK ACADEMY\Tài liệu tham khảo`, máy công ty = `E:\BK ACADEMY\Tài liệu tham khảo`; claude CLI ở `~/.local/bin` (login hết hạn ⇒ `claude` → `/login`). Hai máy nhận việc atomic (không trả lời trùng), chung hạn mức. Sửa `bot.mjs` ⇒ khởi động lại bot ở CẢ HAI máy.

- **⛔ BỔ TRỢ YẾU KHÔNG CÒN RETEST (Thùy nhắc lại nhiều lần, ghi rõ 10/11).** Retest đã HOLD từ 29/09 (mig `202609291037`, công tắc `_btyeu_retest_bat()` = false, hằng client `RETEST_BAT`). Case = học → test cuối ca → xong; **không thiết kế, không đề xuất, không nhắc retest** trong luồng mới (tab "Chờ retest"/📝 Retest, giai đoạn `cho_retest`, mục retest ở các tài liệu cũ dưới đây là DI TÍCH). Nợ dọn: công cụ `bo_tro_retest` của ô hỏi Phòng TBM (mig `202611051749`) và các chữ retest trên màn — chờ Thùy gật mới gỡ (Luật xoá).
- **⭐ DUYỆT BỔ TRỢ YẾU = TRƯỞNG KHỐI ĐỀ XUẤT → TRƯỞNG BỘ MÔN DUYỆT (Thùy 10/11, mig `202611101645` ĐÃ ÁP; THAY HẲN màn Duyệt 2 vòng ngay dưới — màn cũ ẨN, code/bảng giữ).** Phòng làm việc › Chất lượng: trưởng khối 4 mục **Dashboard học tập · Tình hình chung · Hồ sơ học tập · Danh sách bổ trợ**; Dashboard tính ô theo **5 LẦN** (thay 10 câu), cột **Nhóm yếu · dạng** sau tên, 🚨 báo động 30 ngày, nút **Bổ trợ** ⇒ popup 5 nhóm thấp nhất (mastery theo lần, nhóm yếu tick sẵn) + mức L1–3 + ưu tiên + ghi chú ⇒ nháp ⇒ **Chốt & gửi** ⇒ trưởng bộ môn (Chất lượng › Danh sách bổ trợ) **Duyệt = mở case như cũ** (trần 70/20 · hs_level + log · dạng chưa đạt của nhóm tick) / **Trả lại** có lý do. Bảng `bo_tro_de_xuat` (+ `_log` trigger), hàm `fn_btk_*`, đọc mastery qua `_mastery_lan_cap_nhanh` (bảng chụp). Spec `spec-bo-tro.md` §41.

- **⭐⭐ ĐĂNG KÝ LỊCH TEST — PH tự chọn giờ test trên web, Lộc nhập thay (Thùy 15/10, BUILD + ÁP DB + PUSH 15/10; ERP đã lên theo lượt deploy 14–15/11). ĐỌC `spec-dang-ky-test.md` TRƯỚC khi sửa.**
  - **Đích:** Lộc dựng khung test cố định theo tuần, **mỗi khung 1 phòng** → PH vào `https://www.bkacademy.edu.vn/dang-ky-test` chọn lớp (ở trường) · trường (danh mục + "Trường khác") · tích môn · mỗi môn 1 ca: buổi + giờ bắt đầu bước 15' → hệ báo "Bài test dự kiến N phút" + **giờ xong dự kiến để đón con**. Chỉ gõ tên HS + SĐT. Không giới hạn số em. Gửi xong vào phễu Tuyển sinh L5 (mỗi môn 1 `ung_vien`, `nguon='web'`) + hòm thư Lộc (loại `viec`). PH báo thẳng ⇒ Lộc nhập thay cùng hàm ghi `_ts_dang_ky_test`. Đổi lịch: PH nhắn Zalo, Lộc sửa.
  - **Thời lượng (Thùy chốt, ĐÃ NHẬP):** lớp 3–5 = 60' · **Lớp 4 CLC / Lớp 5 CLC** (mã BK 4T/5T, PH thấy chữ "CLC") = 75' · lớp 6–12 = 90'. Tên lớp hiển thị do DB đặt (`_ts_ten_lop`), danh sách khối CLC ở `_ts_lop_cua_khoi` (8T vẫn gộp lớp 8).
  - **Hẹn ≠ ca test:** bảng `dang_ky_test` (hẹn); `ca_test` vẫn chỉ sinh khi em CÓ MẶT (Điểm danh test tự điền thời lượng/giờ từ hẹn). Đã đến / lỡ hẹn = SUY.
  - **Phòng:** khung giữ trọn phòng trên Quản lý phòng học (nhánh test trong `fn_phong_lich` — từ 10/11 lịch phòng gộp ở DB); trùng TKB / khung test khác ⇒ DB chặn; buổi lẻ ⇒ cảnh báo. Chưa chặn chiều ngược (sửa TKB vào phòng đang là khung test).
  - **Web → ERP:** Edge Function `dang-ky-test` (project ERP, đã deploy, Verify JWT tắt; code `supabase/functions/dang-ky-test/index.ts`) — GET dữ liệu form, POST ghi (`fn_ts_dang_ky_test_web`, chỉ service_role, chống spam IP/SĐT + ô bẫy bot). Web (`../bkdemy-web`, đã push) đọc URL ở `NEXT_PUBLIC_DANG_KY_TEST_URL` (Vercel đã đặt); ngoại lệ ghi ở `bkdemy-web/CLAUDE.md`.
  - **Màn ERP:** Tuyển sinh → **📅 Lịch test** (`tuyensinh/LichTestScreen.tsx`): Lịch & hẹn (cần xử lý: lỡ hẹn · trường PH tự gõ · lớp×môn chưa khai) · Cài đặt (khung + phòng, thời lượng, trường) · "Đăng ký test thay PH" (`DangKyTestForm.tsx`). Data layer `lib/dangKyTest.ts`.
  - **DB đã áp:** `202610151355` (bảng + hàm lõi) · `202610151730` (gắn phòng) · `202610151933` (Lớp 4/5 CLC, nới CHECK — Thùy gật).
  - **VIỆC TIẾP THEO:** ② **Lộc tự dựng khung + phòng** (Thùy chốt) — chưa có khung nào thì web hiện "Lịch test online đang được cập nhật" + nút Zalo. ③ Sau khi có khung: thử 1 đăng ký thật trên web, kiểm hòm thư Lộc + phễu L5, rồi xoá/loại lead thử (hỏi Thùy trước — Luật xoá). ④ Chưa có: UI sửa người nhận hòm thư (`tuyen_sinh_nhan_bao`, đang = Lộc).

### ▶ KHỐI 8T — BẢN ĐỒ + KHO HÌNH (cập nhật 14/11) — đọc `spec-giai-bai.md` (Đại) · `kho-rules/hinh/lo/k8T-thales/` (Hình)

**Nguồn:** 7 PDF scan ở `E:\BK ACADEMY\Tài liệu tham khảo\8T\HSG\`; hồ sơ từng quyển `kho-rules/dai/lo/k8T/ho-so/<MÃ>.md`; ảnh trang 150 dpi `C:\Users\WBPC\bk-kho-lam-viec\sach\8T\<MÃ>\trang\p-NNN.png`.
Đã dùng: **Đại** — NĐT phần Đại (619 câu) + TVA §1–3, §8–10 (401 câu); **Hình** — NĐT Hình I §3 + Hình III §1–2, TCHH CĐ5 (lô 1). Chưa đụng: TCDS, VHB1/VHB2 phần Đại, TVA §4–7, phần lớn Hình (NĐT Hình I/II/III còn lại, TCHH CĐ1–4/6/7, VHB). TUHOC không nhập (không lời giải).

**Bản đồ Hình–Học 8T — CHỐT + GHI 14/11** (`scripts/hinh-k8t-ghi-ban-do.mjs`, `scripts/hinh-k8t-len-ban-do-moi.mjs`): **5 chủ đề · 20 bài**, thứ tự học lớp 8:
Tứ giác (NCD00249: HH00089–94) → Định lí Thalès (NCD00250: Thalès HH00127 · Đường trung bình HH00161 · Phân giác HH00128 · Bổ đề hình thang HH00162 · Mê-nê-la-uýt, Xê-va HH00131)
→ Tam giác đồng dạng (NCD00251: HH00129 · HH00163 · HH00164) → Đa giác và diện tích (NCD00252: HH00165 · HH00132 · HH00166) → Cực trị, quỹ tích, dựng hình (NCD00253: HH00134–136).
- ⭐ **Luật chia (Thùy 14/11):** MỘT chiều = KIẾN THỨC (đối tượng / định lí có lý thuyết riêng). "Yêu cầu của đề" (chứng minh vuông góc, tính góc…) KHÔNG là tầng bản đồ. Câu xếp theo kiến thức lời giải thật sự cần ("dạng sau thắng").
  **Mỗi chuyên đề nằm trọn một phía của đồng dạng** — chuyên đề Thalès CẤM đồng dạng / hệ thức lượng / diện tích (Thùy: "không được phép có đồng dạng").
- Bài Hình–Học lên bản đồ mới qua `hinh_hoc_bai.chu_de_id` → `dai_bdm_chu_de` (nhanh `hinh`); `ma_chuyen_de` chỉ là cột bản đồ cũ. Đã xoá 4 bài cũ 0 câu (HH00125/126/130/133, Thùy gật).
- 20 bài mới có mô tả; **CHƯA có lý thuyết + ví dụ** (bài Hình–Học cần đủ 5 phần như Đại).

**Kho Hình 8T — lô 1 ĐÃ GHI 14/11 (đã tự duyệt):** 59 câu — Thalès 37 · Đường trung bình 16 · Mê-nê-la-uýt/Xê-va 4 · Bổ đề hình thang 2; 12 bài nhiều ý (mô hình bài–ý), 47 sơ đồ tư duy, 76 hình vẽ lại 100% bằng code.
Trang xem: https://claude.ai/artifact/ShNsooAeo1xuj5MgsYGPSL (`kho-rules/hinh/k8T-thales-lo1-duyet.html`). Dây chuyền: `BRIEF.md` (trạm Sonnet) → Opus soát đối chiếu ảnh (`SOAT.md`) → `nhap_lo.mjs`
(`--chi-kiem` cổng khuôn + từ cấm theo bài + sơ đồ tư duy · `--html` trang duyệt · `--ghi`). 5 bài DE_SAU (TCHH-5.1/5.8/5.15, NĐT H3.18b/18d) chờ lô Đồng dạng / Diện tích.

**Lô 2 (Thalès + đường trung bình, nguồn còn lại) — ĐANG DỞ, CHƯA GHI DB:** brief `kho-rules/hinh/lo/k8T-thales/BRIEF-lo2.md`; nháp ở scratchpad `…\scratchpad\h8t2\drafts\draft_G10…G21.md`
(máy công ty, thư mục tạm — mất thì chạy lại trạm). Xong nháp: G10 (TCHH CĐ3 VD1–10: 6 bài vào kho), G13 (B19–27: 2), G14 (B28–36: 1), G15 (B37–45: 0 — toàn KHAC).
Đang/chưa: G11 (B1–9), G12 (B10–18), G16–G20 (VHB2 §13–14), G21 (VHB1 đường trung bình). **Việc kế:** soát từng trạm (đối chiếu ảnh) → `nhap_lo.mjs "<h8t2>" --chi-kiem` → `--html … --lo "lô 2" --nguon "…"` → `--ghi`.
Bài `KHAC` (chỉ cần Tứ giác / tam giác lớp 7) ghi riêng trong nháp — làm khi tới lô Tứ giác. Nghi vấn đề sách đã ghi: TCHH CĐ3 B42 thiếu "tam giác nhọn", B38 in sai D/E.

**Đại 8T:** bản đồ 5 chủ đề · 17 chuyên đề · 48 nhóm; **tầng dạng bài hiện = nhóm (1 dạng/nhóm, 07/11)** trừ AM–GM (11 dạng Thùy dựng, nội dung soạn sẵn ở `kho-rules/dai/lo/k8T/amgm/noi-dung-gop.json`,
CHƯA ghi — chờ Thùy "ghi"; phân dạng câu AM–GM chờ theo). **Đề xuất tầng dạng thật 170 dạng** (4 agent đọc hồ sơ sách) ở `kho-rules/dai/lo/k8T/dang/dai-g1…g4.json` + nhóm thiếu
(cấu tạo số ≈32 bài, nguyên lí cực hạn, bất biến – tô màu, cực trị biến nguyên…) — **CHƯA dựng trang, CHƯA ghi**; Thùy bảo làm Hình trước.

## Mảng cũ hơn → đã chuyển `HANDOFF-ARCHIVE.md` (chỉ tên mục; grep tiêu đề để đọc)

**Tách 23/11/2026** (mục không đụng ≥ 14 ngày; nằm đầu `HANDOFF-ARCHIVE.md`). Ràng buộc còn sống trong các mục này: app PH phần Báo cáo học kì **chưa được push khi Thùy chưa nói rõ** (04/11) · 2 CSV có tên học sinh ở gốc repo chờ Thùy cho xoá · thư mục sao lưu `_backup-xoa-cu-k12-0311` (ngoài git) chưa được xoá.

- ⭐⭐⭐⭐⭐ NÔNG TRẠI — NGÂN SÁCH EXP + LỖI PHÂN BÓN (07/11; Thùy: "vấn đề là tỉ trọng exp, không phải trần · khoá trần vô lý, thiết kế để HS chỉ kiếm được…
- ⭐ K12 MT KHẢO SÁT THÁNG 10 (12A1·12B1) — 06/11: đã vào kho MT khối 12 + gán buổi 30/10. 44 câu (28 gán dạng+duyệt, 8 Đ/S, 3 hàng duyệt…); 2 đề MT 10 đ…
- ⭐ K12 BẢN ĐỒ OXYZ ĐỦ + 45 DẠNG ĐỀ XUẤT (HTML) — 05/11 đêm. Oxyz 51/51 dạng đã đủ mô tả+lý thuyết+ví dụ (44 dạng AI viết nháp, Opus soát; mô tả cũ của…
- ⭐ K12 ĐỀ THI HỌC KÌ / KHẢO SÁT — ĐỢT 2 (trả lời ngắn) xong, 05/11 tối. Giải 483 câu trả lời ngắn (Sonnet), nhập 399 (351 Đại + 48 Oxyz vào hgt), chuyể…
- ⭐ K12 ĐỀ THI HỌC KÌ / KHẢO SÁT — ĐỢT 1 xong (05/11 chiều). 1.020 câu TN/TLN chưa đáp án được Sonnet giải chi tiết (K12 chỉ cần giải chi tiết, không hư…
- ⭐⭐⭐⭐ ỐP BẢN ĐỒ 5 CHƯƠNG K12 (Hàm số · NH-TP · Vectơ · XS · SDT) — 05/11 (đã ghi + duyệt). `bdm-b3-xuat-lo 12 --dot k12-op` ⇒ 1.123 câu chưa gán, dich.…
- ⭐⭐⭐⭐ K12 NGUYÊN HÀM–TÍCH PHÂN + XOÁ BẢN CŨ — 04/11 tối (mọi thứ đã ghi DB, đã push). (1) ĐÃ XOÁ bản đồ cũ 4 chương (`xoa-cu.mjs --ghi --giu-diem-thi`,…
- ⭐⭐⭐ BẢN ĐỒ MỚI K10 "HÀM SỐ, ĐỒ THỊ VÀ ỨNG DỤNG" (04/11) — ĐÃ GHI DB (NCD00234): 4 chuyên đề · 18 nhóm · 30 dạng, có mô tả + lý thuyết + 2 ví dụ/dạng.…
- ⭐⭐ SỬA HÀNG LOẠT KaTeX ĐỎ `	ext{ABparallel CD}` (04/11): 789 dòng đã sửa (`scripts/sua-latex-text-lenh-toan.mjs`, đã ghi): lệnh toán (parallel perp in…
- ⭐⭐⭐⭐ BÁO CÁO HỌC KÌ (04/11) — ERP XONG + ĐÃ PUSH (dd8cb9a8, chờ Thùy Create Deployment) · APP PH ĐANG GIỮ. Quyết định: `spec-bao-cao-ky.md` §C (đọc tr…
- ⭐⭐⭐⭐ APP HS + NÔNG TRẠI — ĐỢT 03/11 (mọi thứ trên `main`, DB đã áp hết, game repo `nhip-ngay` đã push `62e2dcb`; ERP CHƯA deploy bản cuối — Thùy bấm C…
- ⭐⭐⭐ K9 ĐỀ CƯƠNG / ĐỀ THI HỌC KÌ 1 — PHẦN HÌNH → HÌNH–LUYỆN + MÔ HÌNH TIẾP TUYẾN (03/11; DB đã ghi, đã push; KHÔNG đụng `src/` ⇒ không cần deploy). Thù…
- ⭐⭐⭐⭐ PHÒNG LÀM VIỆC + BÁO CÁO TUẦN + TASK GIA HẠN — 03/11 (mọi thứ trên `main`, DB đã áp hết; ERP CHƯA deploy bản có phòng Giám đốc — Thùy bấm Create…
- ⭐⭐⭐⭐ BẢN ĐỒ K12 TỪ ĐỀ THI — ĐÃ GHI CÂY MỚI + GẮN CÂU (03/11); XOÁ BẢN CŨ 4 CHƯƠNG ĐÃ XONG 04/11 (xem mục ngay trên). Thùy 03/11: "nguồn bản đồ phải lấ…
- ⭐⭐⭐⭐ DASHBOARD HỌC TẬP (lá `db_hoctap`) — DỰNG LẠI 23/10 (mọi thứ trên `main`, DB đã áp, đã push; Thùy tự bấm deploy). Kênh quan sát SONG SONG với mas…
- ⭐⭐⭐⭐ CHẤM MT - KHẢO SÁT + BẢNG KẾT QUẢ THEO CHUYÊN ĐỀ · trạng thái 23/10 (mọi thứ trên `main`, DB đã áp hết; ERP CHƯA deploy bản cuối — Thùy bấm Creat…
- ⭐⭐⭐ ĐÁNH GIÁ CUỐI CẤP (5T · 9 · 12) — mở + xong 23/10 (mọi thứ trên `main`, DB đã áp; ERP CHƯA deploy — Thùy bấm Create Deployment). Spec: `spec-danh-…
- ⭐⭐⭐⭐ NÔNG TRẠI + APP HS "ĐỢT 13→18/10" · trạng thái 23/10 (mọi thứ trên `main`, DB đã áp; ERP: file game đã sync, CHƯA deploy — Thùy bấm Create Deploy…
- ⭐⭐⭐⭐ KHỐI 7 — bản đồ + kho + đề thi/đề cương · trạng thái 20/10 (mọi thứ đã trên \`main\`; DB đã áp; ERP không cần deploy). Chi tiết quy trình/luật: \…
- ⭐⭐⭐ GIÁO TRÌNH BẢN ĐỒ MỚI PER-CLASS + POPUP KHO FULL MÀN · 28/10 (phiên này, mọi thứ trên `main`, DB đã áp; Thùy bấm Create Deployment).
- ⭐⭐⭐⭐⭐ LÀM TÀI LIỆU THEO BẢN ĐỒ MỚI — đợt 20→21/10 (Thùy: "24h tới bản đồ mới + builder ổn định, xong mới chuyển mastery dạng cũ sang mới"; mọi thứ trê…
- ⭐⭐⭐⭐ BẢN ĐỒ MỚI · DUYỆT KHO · KHO ĐỀ THI — đợt 17→19/10 (mọi thứ đã trên `main`, DB đã áp; ERP CHƯA deploy — Thùy bấm Create Deployment).
- ⭐⭐⭐⭐⭐ DUYỆT BỔ TRỢ 2 VÒNG + CHỐT TUẦN + 1 TUẦN BỔ TRỢ 1 LẦN (Thùy 17/10; BUILD + ÁP DB `202610172355` + PUSH; ERP CHƯA deploy, CHƯA thử Chốt tuần/Duyệ…
- ⭐⭐⭐⭐ BỔ TRỢ HÌNH — LOẠI THỨ 4, ĐỘC LẬP VỚI YẾU ĐẠI (Thùy 17/10; BUILD + ÁP DB `202610171805` + `202610171841` + PUSH; ERP + app TA CHƯA deploy, chưa t…
- ⭐⭐⭐ BỔ TRỢ (yếu · bù · đuổi) — CẬP NHẬT 10→17/10 (phiên worktree `bkdemy-erp-v2-botroyeu`, nhánh `feat/botro-yeu`). MỌI thứ đã trên `main`, DB đã áp;…
- ⭐⭐⭐ TRANG CHÍNH ERP DESKTOP — HOME MỚI + HỆ TASK PHÁT TRIỂN LÀM LẠI (Thùy 14/10, build + áp DB 14/10, CHƯA deploy; ĐANG ĐỔI HƯỚNG "CẢNH" — đọc mục "Ch…
- ⭐⭐⭐ BẢN ĐỒ HÌNH — LUYỆN = CÂY NHÁNH + KHO BÀI (Thùy chốt 14/10, build + áp DB 14/10, CHƯA deploy). ĐỌC `spec-hinh-cay-nhanh.md` (§8–§11) TRƯỚC khi đụn…
- ⭐⭐⭐ CHẤM CÔNG + LƯƠNG TRỢ GIẢNG — Thùy mở 12/10, chốt 13/10, duyệt mockup + BUILD XONG 14/10, ĐÃ DEPLOY app TA 14/10 tối (TA đang dùng thật). ĐỌC `spe…
- ⭐⭐ BOT TELEGRAM CHO TA — Thùy chốt 14/10. ĐỌC `spec-bot-telegram-ta.md` TRƯỚC khi sửa (spec chưa cập nhật các chốt 15/10 bên dưới — chốt 15/10 thắng).…
- ⭐ XU — TỔNG KẾT XU thay CHỐT XU (Thùy 28/10, mig `202610281926` + `202610282149` ĐÃ ÁP, đã push; Thùy tự bấm deploy). Lá id vẫn `chotxu` (2 vai trò đa…
- ⭐ GAMI — THÀNH TỰU + XU (Thùy 16/10, mig `202610161746` ĐÃ ÁP). Thành tựu ghi EXP vào THÁNG ĐẠT (`dat_at`), không phải tháng bấm nhận (`_tt_chot_hs` /…
- ⭐⭐ SƠ ĐỒ TỔ CHỨC = nguồn duy nhất Trưởng/Phó khối (Thùy 15/10: "phân công là PHẠM VI, chức danh về SƠ ĐỒ TỔ CHỨC"). vi_tri team `ta` (cap + khoi_quan_…
- ⭐ DẠY HÌNH 3D — mô hình HTML cho bài tập thể tích K12 (Thùy mở 09/10 tối, chốt hướng 10/10). ĐỌC `spec-day-hinh-3d.md` (Phần A + Phần S) trước khi làm…
- ⭐⭐ CÁCH TÍNH LƯƠNG GV CẤP 1 — NĂM 2026 (Thùy chốt 09/10). Nguồn chuẩn: `SPEC-tai-chinh-luong-gv-ta.md` §3.1b. ĐỌC TRƯỚC khi tính lương cho bất kỳ GV t…
- ⭐⭐⭐ ĐỢT 1 MỞ APP HS + CÔNG TẮC TÍNH NĂNG — chốt 07/10 tối (Thùy: "mở từ từ từng phần, HS đỡ ngợp"). ĐỌC TRƯỚC khi thêm/ẩn bất kỳ ô nào trên app HS.
- ⭐⭐⭐ KINH TẾ APP HS MỚI — build 06/10 khuya, ĐỌC TRƯỚC khi đụng nhiệm vụ / xu / vòng quay / ĐHT. Nguồn thiết kế: `spec-kinh-te-nhiem-vu.md` (§1–§9 nhiệ…
- ▶ CONTEXT 4T + 5T (Thùy mở 07/10 · cập nhật 08/10 tối) — kho tiểu học theo đường đi `spec-giai-bai.md`
- ⭐⭐⭐ 7 SKILL HỌC LIỆU — TOÀN BỘ NHIỆM VỤ (Thùy chốt 06/10) · bản đồ trạng thái + điều kiện đi tiếp · ĐỌC ĐẦU TIÊN khi làm bất cứ gì về kho

**Tách 15/10/2026:**

- **⭐⭐ RELEASE APP HS V1.0 — DEADLINE 06/10/2026 (Thùy chốt 01/10) — ĐỌC `spec-v1-app-hs.md`**
- **⭐⭐ APP HS THEO MÔN + KHO KHTN/ANH — trạng thái hết 03/10 (phiên worktree `home-hs-giai-tri`; mọi t
- **⭐ BOSS RIÊNG (NPC boss cuối, mỗi GV 1 boss) — trạng thái 01/10 đêm: đọc `design/FLOW-NPC-BOSS-CU
- **⭐ BỔ TRỢ (yếu · bù · đuổi) — NỀN 28/09 (mới nhất: mục ⭐⭐⭐ BỔ TRỢ 10→15/10 ở
- **⭐ TRỢ LÝ (tab 🤖 trong Việc của tôi) — trạng thái 29/09: đọc `SPEC-troly-nhansu.md` §6–§7
- **⭐⭐ KHUNG CHẾ ĐỘ GAME HỌC — DÙNG CHUNG MỌI MÔN (Thùy chốt 03/10): "các chế độ cho mọi 
- **⭐⭐ GIAO DIỆN APP HS — CẬP NHẬT CUỐI NGÀY 03/10 (luồng Giao diện) · TRÊN `main` + `thu-nghiem
- **⭐⭐ KHU HỌC TẬP + NHÂN VẬT CHÍNH + CHINH PHỤC BK (luồng Giao diện, chốt hết 03/10) — ĐỌ
- **⭐⭐ GAME BK ("BK World", tên tạm) — trạng thái cuối 02/10 tối (máy công ty). ĐỌC `spec-bk-wor
- ⭐⭐ LUỒNG KHO + ĐỀ THI — trạng thái hết 02/10 · ĐỌC `spec-de-thi.md` §10 (và `spec-luong-kho.m
- Kiến trúc & file chính
- Đã build (nhánh ĐẠI)
- Đã build (NHÂN SỰ + LỚP + HỌC SINH — khối STATIC, 06-11)
- Đã build thêm (06-12)
- Đã build (GAMI GĐ A — buổi học, 06-15)
- Đã build (RBAC + 1 MÀN + GAMI mở rộng + ET — 06-15→16)
- Đã build (06-16 — phiên 2: khép ET, chấm 5-mức/Đ-C-S, mốc hoàn thành, Elo per-môn, màn Điểm s�
- Đã build (BẢNG THÀNH TÍCH + 3 hệ điểm + fix kho tài liệu — 06-17)
- Đã build (06-17 phiên 3 — mobile chấm bài, profile fit+ghim, fix tài liệu, clone Phase 0)
- Đã build (06-20→22 — sửa loạt lỗi release)
- Đã build (06-23 — Việc-của-tôi: tuần + deadline + redesign · fix sĩ số)
- Đã build (06-23/24 — Tuyển sinh (phễu) + Bổ trợ Bù + thống nhất mã)
- Đã build (06-24/25 — KHTN Kho + Tuyển sinh nâng cấp + gỡ HS khỏi buổi + mon.ts)
- Đã build (06-26 — Bổ trợ ĐUỔI luồng · Kho Đúng/Sai · CRUD/gộp buổi bổ trợ · fix BTVN/ET)
- Đã build (06-29 — Tìm câu · mã khi soạn · HS toggle/sort · reorder dạng · CHIỀU MÔN: nhân sự +
- Đã build (06-29 phiên 2 — dọn KHO câu · BẢN IN thông minh · BLOCK model P1 · lý thuyết setting)
- Đã build (07-01 — fix nhân đôi trang lý thuyết · MASTERY engine+service (dashboard kết quả học t�
- Đã build (07-01/02 — MÀN KẾT QUẢ HỌC TẬP đầy đủ: 4 view + Tổng quan + fix khoá-UI)
- Đã build (07-02 — fix vụn: mã HS ở lớp · chống trùng câu giáo trình · "Câu N." cùng dòng · %
- Đã build (07-03 — ⭐ LUỒNG NHẬP KHO ingest-first: bóc PDF → gán dạng → đẩy kho)
- Đã build (07-03 phiên 2–7 — bản GV mọi loại câu · fix clone $ · đếm kho Postgres · Việc-của
- Đã build (07-04 — fix dep · ảnh ET giãn · tên HS 2 từ cuối · Nhập kho dùng lại CauEditor + past
- Đã build (07-04 phiên 2 — ⭐ TEST ONLINE đầy đủ: login HS 321 acc · BTVN/GT reveal-ngay · ET chế đ
- Đã build (07-04 phiên 3 → 07-05 — mastery đọc ET-online · duyệt chấm trả-lời-ngắn · nav theo 
- Đã build (07-22→25 — ⭐ DASHBOARD HỌC TẬP: rule engine phát hiện → AI đề xuất → người duy
- Đã build (26/09 — ⭐ HỆ SỰ KIỆN: Trung thu 26/09 + các sự kiện sau) — ĐỌC `spec-su-kien.md` §
- Game `games-site/` — trạng thái sau Trung thu (26–27/09) — bản SỰ KIỆN (luật: `luat-choi-game.md`,
- Đã build (27–28/09 — ⭐ GAME TRONG BUỔI HỌC: xếp hạng buổi + game bản lớp) — ĐỌC `spec-ga
- Đã build (24–27/09 — ⭐ FORMAT NỘI DUNG LÝ THUYẾT + khung "Bài tập tự luyện" trong PDF) — Đ�
- ⭐ GIAO DIỆN APP HS — STYLE (cập nhật 29/09) — ĐỌC `design/STYLE-HS.md` + `spec-giao-dien-hs.md` (§ 
- ⭐ THẾ GIỚI BK — mạng xã hội KHOE nội bộ của HS — ĐÃ BUILD 29/09: DB đã áp hết · app đ
- ⭐ GAMIFICATION HS — Rank · Thử thách · Nhiệm vụ · Vòng quay · Huy hiệu — ĐÃ BUILD 28/09 (DB �
- ✅ PHA 4 — ĐƯỜNG ỐNG CA YẾU (bổ trợ) — ĐÃ BUILD (09→28/09), khác thiết kế 25/07 ở vài 
- Chưa làm
- 🐞 BUG MỞ (chưa sửa)
- 🔜 HỆ THỐNG AUTO-REPORT — ĐANG LÀM (context riêng, độc lập tính năng khác)
- 🔜 Bài tập hàng ngày (V2) — ĐANG THIẾT KẾ (chưa code, chưa đụng DB)
- Đã build (HỌC PHÍ — leaf `hocphi`, nhóm Core team, 07-05)
- ⭐ HỌC PHÍ — REDESIGN 08-01 (SUPERSEDE phần 07-05 ở trên chỗ nào mâu thuẫn)
- Đã build (GIAO VIỆC & HIỆU SUẤT + DASHBOARD VẬN HÀNH — 07-05, spec `BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md`)
- Quyết định & quy ước (đừng vô tình phá)
- Đã build (07-06 — Dashboard Chất lượng vận hành: tab "Theo người" + fix công thức hiệu suất)
- Đã build (07-06 phiên 2 — Ops vận hành spec: Report/Tan/Prep · mobile shell staff · fix Bổ trợ Đuổ
- Schema (DB live — `npm run schema` ghi `schema.md`, KHÔNG sửa tay)
- Đã build (07-07 — Điểm danh test đầu vào)
- Khởi động ở máy MỚI (về nhà)
- Nguồn intent (Notion)
- Đã build (07-07 tiếp — 3 bugfix rời + tính năng MT)
- Đã build (07-08 tiếp 9 — UX: fix scroll-reset + sticky header toàn app)
- Đã build (07-09/07-10 — Đưa MT vào mọi mastery/dashboard · fix bug Prep/MT-đóng-phase · fix 4 bug OPS)
- Đã build (07-11 — Việc của tôi: deadline/round-robin · XUẤT PDF kiến trúc mới (native print) · Kh
- Đã build (07-12 — ⭐⭐ LINK PDF ĐỜI 2: server-gen bằng worker Chrome thật — thay HẲN client-gen ht
- Đã build (07-14 — Tuyển sinh L8: tách HS mới khỏi list "đang học" + toggle khoảng ngày)
- Nhập đề thi bằng Gemini trong ERP (07-14) — ĐÃ GỠ 01/10
- Đã build (07-21 — ⭐ ET/lưới chấm BÁM ĐỀ · KHO RÁC câu hỏi · fix TKB thiếu lớp)
- Đã build (07-21 tiếp — ⭐ Elo: huỷ phiên KHÔNG CÓ DỮ LIỆU + replay toàn bộ)
- Tồn đọng 07-21
- Đã build (⭐ KHO HÌNH HỌC v3 — 07-24→27 · bổ sung 08-06, nhánh riêng của Toán)
- Đã build (⭐ KHO HÌNH — SOẠN TÀI LIỆU + GIÁO TRÌNH + BIẾN THỂ nâng cao — 08-07)
- Đã build (⭐ KHO HÌNH — SOẠN TÀI LIỆU nâng cao: nở đáp án + giả thiết phụ/van + popup chọn
- Đã build (⭐ KHO HÌNH "CHUYỂN NHÀ" — đúc lại giáo trình theo khuôn Đại 100%, dời nav lên hub 
- Đã build (⭐ NHÁNH MỚI "HÌNH GIẢI TÍCH" — Phase 1: kho + soạn tài liệu — 08-08 tiếp)
- ⭐⭐ TRỢ LÝ (tab 🤖 trong *Việc của tôi*) — trạng thái 29/09 · ĐỌC `SPEC-troly-nhansu.md` §6�
- Chuỗi đã dò xong #1 — TEST ĐẦU VÀO (12/08, chờ 1 câu để kích hoạt)
- ⭐ CÁCH LÀM ĐỂ HOÀN THIỆN DỮ LIỆU — chốt 12/08 (tối ưu THỜI GIAN CỦA CEO)
- 08-14 — Test đầu vào: assign người chấm/trả bài dự kiến (đã merge main)
- Bot hỏi–đáp nhân sự "💬 Hỏi hệ thống" (29/08 — chạy production)
- ⭐ Chiến dịch "hạ tính toán xuống DB" — Phase 1+2 XONG · Phase 3 ~75% (đến hết 30/08)
- ⭐ 4 APP RIÊNG CHO 4 VAI (HS · OPS · TA · GV) — trạng thái đến hết 31/08
- ⭐ BTVN ẢNH end-to-end — ĐÃ CHẠY THẬT TRÊN PROD (09/09)
- Role `claude_ro` THẬT (09/09) — `npm run schema` + dò dữ liệu từ máy Claude
- Bố trí worktree trên máy CEO (ĐỔI 01/09 — CEO chốt)
- Nền repo/DB — CHUẨN HOÁ 01/09 (sau chuỗi phiên làm từ điện thoại)
- ⭐ CÔNG THỨC — PHẦN A (ô ERP không gõ LaTeX) + TOOL SOẠN THẢO riêng `soan` (04–05/09, nhánh `fea
- ⭐ TOOL GIẢI BÀI kho chung `giaibai.bkacademy.edu.vn` (06/09, nhánh `feat/giaibai`, worktree `wt-giaibai`) —
- ⭐ KHO CHUẨN — cửa 1 đã BẬT (08/09, nhánh `worktree-kho-chuan` e2e9d41, spec `spec-kho-chuan.md`) — b
- ⭐ KHẢO SÁT "Bạn của con ở BK" — PWA iPad riêng + tab ERP (08–09/09) — ĐÃ PUSH main `299b044`, V
- ⭐ 08–09/09 — FORM CÂU (TN AI · ĐIỀN Ô chứng minh) + KHO CHUẨN (spec) + NHẬP KHO TỪ FILE — Đ�
- ⭐ TEST ĐẦU VÀO — trạng thái 13/09 (đã push main `8e4aa83`; supersede mục 09/09)
- ⭐ 10/09 (tối) — NHẬP CÂU HGT QUA CLAUDE: 25 câu Phần A Toán Tứ Tâm PT mặt phẳng vào chờ-duy�
- ⭐ 12-13/09 — TRẮC NGHIỆM TỪNG PHẦN (Điền Ô Phase 2 Đại) — kiến trúc ĐÃ XÂY, worktree `mc
- Đã build (18/09 — Chuẩn hoá mã bản đồ Đại + UI chuyển/gộp/xoá)
- Đã build (18–20/09 — SỔ TAY KIẾN THỨC cho app HS: kho tra cứu lý thuyết)
- Đã build (16–27/09 — ⭐ KHO HÌNH HỌC · PHASE HỌC: đơn vị "Bài" phẳng, tái dùng NGUYÊN module
