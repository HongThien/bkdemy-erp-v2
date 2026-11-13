# spec-kien-truc.md — Kiến trúc đích + bộ luật để chịu 1.000 → 2.000 → 10.000 người dùng

> **Trạng thái: THÙY CHỐT 13/11/2026** (đã đối chiếu định hướng BK lần 1; chưa đọc được Notion North Star/Pillars/Principles). **Đợt 0a ĐÃ ÁP 13/11** (mig 202611131750); các đợt sau: nêu phạm vi → Thùy gật → làm.
> Bằng chứng hiện trạng: `reports/audit-scale-13-11.md`.
> Đích (Thùy 13/11, đính chính tối 13/11): 1.000 → 2.000 → 10.000 đều là **HS CỦA TRUNG TÂM**. Không có khối HS ngoài trung tâm. Mốc 1.000 trong 6–12 tháng.
> Nguyên tắc sửa (Thùy 13/11): **không vá từng lỗi — sửa kiến trúc từ trên xuống theo chuẩn ngành, và viết luật để tính năng sau không lặp lại.**

---

## 0. Chẩn đoán một câu

Hệ thống đúng ở tầng *khái niệm* (HS × dạng, mastery suy động, task = invariant, tính ở DB). Nó yếu ở tầng *ranh giới*:
không có ranh giới giữa **ghi và đọc**, giữa **dữ liệu gốc và số suy ra**, giữa **trong và ngoài** (quyền), giữa **màn hình và DB**.
Vì không có ranh giới nên mỗi tính năng tự mở một đường riêng xuống DB, và 4 loại lỗi cứ lặp lại:

| Lỗi lặp lại (bằng chứng ở audit) | Ranh giới bị thiếu |
|---|---|
| Hàm đọc tính cả hệ rồi lọc 1 người; quét lại lịch sử mỗi lượt gọi | Ghi ↔ Đọc (chưa có "mô hình đọc" thống nhất) |
| 6 kiểu bảng tính sẵn, 16 cron chồng nhau | Dữ liệu gốc ↔ Số suy ra |
| anon gọi được 634 hàm, 8 bảng không RLS, view bỏ qua RLS | Trong ↔ Ngoài (quyền mặc định là MỞ) |
| Mở app HS = 30 request, 82 cache tự viết, polling 4–30 s | Màn hình ↔ DB (không có lớp dữ liệu client, không có hợp đồng API) |

## 0b. Định hướng BK — thứ spec này phải PHỤC VỤ (đối chiếu 13/11, sau khi Thùy nhắc)

BK không phải công ty nền tảng học trực tuyến. Chuẩn ngành chỉ là *công cụ*; gốc là định hướng dưới đây
(nguồn: CLAUDE.md §0–§6, `ADR-mon.md`, HANDOFF-ARCHIVE "Quyết định & quy ước" + "Cách làm tối ưu thời gian CEO", DEVLOG phiên lương GV).
**Chưa đọc được** Notion North Star / Strategic Pillars / Principles (kết nối Notion chưa cấp quyền) — mục này phải soát lại khi đọc được.

| Định hướng BK | Khác chuẩn ngành ở đâu | Hệ quả cho kiến trúc |
|---|---|---|
| **Moat = gói dịch vụ + dữ liệu đo (HS × dạng)**, không phải nội dung hay GV. ERP là *hệ điều hành của trung tâm*, không phải sản phẩm bán ra | Khan/Open edX tối ưu cho *phát nội dung tới hàng triệu người lạ* | Thứ phải bảo vệ và phải nhanh nhất là **đường đo → mastery → việc của người chăm** (TA/GV/OPS), không phải đường phát nội dung. "Việc của tôi" là màn lõi |
| **System over Stars** — GV là "người qua đường", hệ thống gánh phán đoán | Ngành dựa vào đội kỹ sư giữ kiến trúc bằng review | Ở BK người viết code là **nhiều phiên Claude song song, không nhớ nhau** ⇒ luật chỉ sống nếu **máy kiểm** (§8) và nằm ở CLAUDE.md. Không luật nào dựa vào "nhớ" |
| **Thời gian CEO là nút thắt** ("đọc HẾT rồi hỏi MỘT LẦN"; chỉ làm khi ra lệnh, nói rõ scope, một bước một lần) | Ngành giả định có người duyệt kỹ thuật toàn thời gian | Mỗi đợt chuyển đổi phải **tự chứng minh bằng số** (so khớp cũ–mới bằng script) — Thùy chỉ nhìn một con số, không phải bấm thử 8 app |
| **Triangulation: lỗi lộ qua mâu thuẫn dữ liệu, không qua người-kiểm-người** (§5) | — | Áp cho chính kiến trúc: bảng tính sẵn luôn có đường tính trực tiếp để **đối chiếu định kỳ**; lệch là cờ tự bật |
| **Pure-derive: task = chênh lệch must-exist vs does-exist; không bảng `tasks`, không dòng chờ; mastery KHÔNG lưu — suy động** | CQRS thuần sẽ coi mô hình đọc là dữ liệu hạng nhất | Mọi bảng tính sẵn là **bản CHIẾU xoá đi dựng lại được**, không bao giờ là nguồn chân lý. Hạn việc, dạng yếu, mastery lưu sẵn = cache, không phải sổ |
| **Chống NULL: chỉ tạo dòng khi có kết quả thật; lịch sử HS = UNION các bảng sự kiện, KHÔNG đẻ bảng "lịch sử" riêng** (quyết định 06) | xAPI/LRS gom mọi sự kiện vào MỘT kho riêng | **Không** dựng bảng sự kiện đo thứ tư. "Một sổ đo" = một CỬA ĐỌC gộp các bảng sự kiện sẵn có (§3) |
| **Mỗi môn = một trung tâm; tầng dưới mỗi nhánh bảng riêng, KHÔNG gộp; dispatch qua 1 registry** (`ADR-mon.md`) | Ngành thường chuẩn hoá một schema nội dung | Không gộp bảng kho. Chỉ gom **hàm vận hành dùng chung** về registry; hàm nội dung của nhánh có cấu trúc riêng (Hình) được phép riêng |
| **AI in the loop: Claude/bot là người LÀM chính ở dây chuyền kho** (giải bài, phân dạng, nhập đề) | Ngành: tải đến từ người dùng cuối | Ở BK "người dùng" nặng nhất của DB là **dây chuyền AI + cron**, không phải HS. Phải **cách ly tải**: việc hàng loạt của máy không được làm chậm giờ HS học |
| **Seam sẵn có: màn không gọi Supabase trực tiếp, chỉ qua `src/lib/*`; màn hàng đợi nhớ trạng thái ở `NHO`** (CLAUDE.md §2) | Ngành: thư viện cache client | Giữ seam và giữ luật `NHO`. Cache/gộp lượt gọi đặt **bên trong seam `src/lib`**, không bắt viết lại 700 file theo thư viện mới |
| **Notion giữ intent/ADR, repo hiện thực hoá** | — | Sau khi chốt: bản này dán lên Notion thành ADR; repo giữ bản làm việc |

## 1. Chuẩn ngành lấy làm công cụ (R7 — đứng trên vai ai)

Quy mô 10.000 người dùng là NHỎ so với ngành. Chuẩn ngành ở cỡ này **không phải** microservices; là một khối thống nhất
(modular monolith) trên một Postgres, có ranh giới rõ. Lấy *nguyên tắc* nào phục vụ §0b, không bê *hạ tầng* hay *mục tiêu* của người khác:

| Nguồn | Họ làm gì | Mình lấy gì |
|---|---|---|
| **Khan Academy — dự án Goliath** ([Go + Services](https://blog.khanacademy.org/go-services-one-goliath-project/), [Incremental Rewrites](https://blog.khanacademy.org/incremental-rewrites-with-graphql), [Beating the odds](https://blog.khanacademy.org/beating-the-odds-khan-academys-successful-monolith→services-rewrite/)) | Tách khối cũ thành các dịch vụ; **mỗi dịch vụ sở hữu dữ liệu của mình, bên khác chỉ đi qua API**; viết lại **từng phần, chạy song song cũ–mới, so kết quả rồi mới chuyển**; giữ nguyên nền tảng lưu trữ | (1) Miền nào sở hữu bảng miền đó, miền khác gọi hàm. (2) Chuyển đổi kiểu *strangler fig*: cũ–mới song song, so khớp, rồi mới cắt. (3) KHÔNG viết lại từ đầu, KHÔNG đổi nền tảng |
| **Open edX** ([quyết định dùng xAPI](https://docs.openedx.org/projects/openedx-aspects/en/latest/technical_documentation/decisions/0002_xapi.html)) | Mọi hoạt động học ghi thành **sự kiện** dạng *ai – làm gì – trên cái gì – kết quả* (chuẩn xAPI), đẩy sang kho riêng cho phân tích; phân tích không chạy trên DB giao dịch | Một **sổ sự kiện đo** duy nhất, chỉ thêm; mọi con số học tập là *mô hình đọc* suy từ sổ đó |
| **CQRS / Event sourcing / Materialized read model** (Fowler, Young) | Tách đường ghi và đường đọc; số tổng hợp được cập nhật tăng dần khi có sự kiện, không tính lại khi đọc | Khuôn "Sổ tính sẵn" duy nhất (§4) |
| **Domain-Driven Design — bounded context** (Evans) | Chia hệ theo miền nghiệp vụ, mỗi miền một ngôn ngữ và một chủ | Bản đồ miền §2 (CLAUDE.md §1.6 "mỗi môn một trung tâm" đã là ý này) |
| **Backend-for-Frontend** (Newman) + **TanStack Query** (chuẩn thực tế của React) | Mỗi màn có một điểm lấy dữ liệu đúng hình màn cần; client có lớp cache/gộp lượt gọi/làm mới nền | 1 màn = 1 RPC cho phần đang hiện; một lớp dữ liệu client (§6) |
| **Supabase Production Checklist** ([docs](https://supabase.com/docs/guides/deployment/going-into-prod)), **OWASP ASVS** (từ chối mặc định, quyền tối thiểu) | RLS trên mọi bảng, index cột dùng trong policy, khoá service không nằm ở client, chạy Security Advisor | Luật quyền §7 |
| **Google SRE — SLO / ngân sách lỗi**; **Evolutionary Architecture — fitness function** (Ford, Parsons) | Mỗi đường có ngưỡng đo được; kiến trúc được giữ bằng kiểm tra tự động, không bằng lời hứa | Cổng tự động §8 |
| **Expand–contract migration**; **ADR** (Nygard) | Đổi schema theo 2 nhịp nới–siết; mỗi quyết định kiến trúc một bản ghi | Đã có nếp (migration bất biến, Notion giữ ADR) — giữ |

## 2. Bản đồ miền (bounded context)

Mỗi bảng thuộc đúng MỘT miền. Miền khác **không đọc/ghi thẳng bảng** — gọi hàm công khai của miền đó.

| Miền | Sở hữu | Ghi chú |
|---|---|---|
| **Danh tính & Quyền** | tai_khoan, nhan_su, vi_tri, team, phân công, quyền, phạm vi | Cửa duy nhất trả lời "tôi là ai, tôi được gì" |
| **Tri thức** (theo môn → nhánh) | bản đồ, dạng, câu, lý thuyết, form TN/điền | Nội dung. Thay đổi chậm, đọc rất nhiều ⇒ đọc qua bản chụp đã xuất bản |
| **Vận hành lớp** | lớp, buổi, điểm danh, giáo trình, tài liệu, đề | Invariant R-ET / R-DG / R-BU |
| **Đo** | sổ sự kiện đo (§3) | Chỉ thêm. Nguồn duy nhất của mọi số học tập |
| **Mô hình đọc** | mọi bảng tính sẵn (§4) | Không ai ghi tay; chỉ bộ làm mới ghi |
| **Bổ trợ** | yếu · bù · đuổi, ca, lịch trực | Đọc mô hình đọc của Đo |
| **Gami & Kinh tế** | xu, EXP, rank, thành tựu, nhiệm vụ, chuỗi, Thế giới BK, game | Sổ cái xu/EXP là sổ chỉ thêm |
| **Tài chính** | học phí, hoá đơn, thu chi, lương | Quyền chặt nhất |
| **Việc & Hiệu suất** | việc phát triển, gậy, hiệu suất, báo cáo | Việc vận hành = derive, không có bảng |

Bảng mới ⇒ tên có tiền tố miền, và spec tính năng ghi rõ bảng thuộc miền nào. Hàm nội bộ của miền (tiền tố `_`) **không cấp quyền gọi cho client**.

## 2b. Gộp theo KHUÔN (Thùy chốt 13/11 — sửa ADR môn)

**Quyết định:** tách theo KHUÔN cấu trúc, không theo môn. Cùng khuôn ⇒ một bảng chung + một bộ hàm, phân biệt bằng cột `kho`. Khác khuôn ⇒ bộ riêng.
Khuôn: **dạng–câu** (Đại · Hình giải tích · KHTN · Lý · Hoá · môn mới cùng cấu trúc) · **mô hình–bài–ý** (Hình học) · **ngôn ngữ** (Anh · Văn, thiết kế theo bản chất môn).

**Vì sao sửa:** 25 họ bảng lặp ở 4–5 nhánh (115 bảng), 17 họ giống hệt từng cột; 45 họ hàm chép 3–5 lần; các bản chép đã lệch nhau (thiếu index ở một nhánh, hàm quên một nhánh); đọc xuyên nhánh phải dựng view UNION 8 nhánh. Mã giữa các nhánh không trùng nhau (đo 13/11: 0 mã trùng) nên gộp không đổi mã gốc.

**Cách gộp (đã thử trên họ mẫu, mig 202611131904):** KHÔNG chép dữ liệu, KHÔNG đổi tên. Mỗi bảng nhánh thêm cột `kho` (hằng + check) rồi **gắn làm một PHẦN** của bảng chung `kho_<họ>` (chia phần theo `kho`).
- Tên cũ vẫn là bảng thật ⇒ hàm, trigger, policy, khoá ngoại, script đang dùng tên cũ chạy nguyên.
- Thêm/sửa cột ở bảng chung áp cho mọi nhánh; DB cấm thêm cột riêng một nhánh ⇒ hết lệch.
- Đọc bảng chung theo một `kho` chỉ quét phần của kho đó. Ghi qua bảng chung tự rơi đúng nhánh; khoá ngoại của nhánh vẫn chặn mã sai nhánh.
- Hoàn tác: `alter table kho_<họ> detach partition <nhánh>_<họ>` rồi bỏ cột `kho`.
- Kiểm bắt buộc mỗi họ: chạy thử trong transaction rồi rollback; số dòng + vân tay nội dung từng nhánh trước–sau; số trigger/khoá/policy/index không đổi; thử thêm · upsert · xoá qua tên cũ.

**Tiến độ (13/11): ✅ XONG 25/25 họ** — mỗi họ có bảng chung `kho_<họ>` (25 bảng chung, 115 phần): ban_do · bdm_cau_thieu_dang · bdm_chu_de · bdm_chuyen_de · bdm_dang_bai · bdm_de_xuat · bdm_gan_cau · bdm_kiem_mau · bdm_log · bdm_nhom · bdm_nhom_tien_de · bdm_o · bdm_tu_choi · cau_form_tn · cau_hoi · cau_hoi_yeu_cau_giai · chuyen_de_ly_thuyet · cum_bai · cum_tien_de · dang_ly_thuyet · dang_tien_de · de_xuat · de_xuat_cau · de_xuat_quyet_dinh · mcq_rule. Công cụ: `node scripts/kien-truc/gop-khuon.mjs <họ>` (dùng lại khi có họ mới / môn mới: thêm một phần = `create table <nhánh>_<họ> partition of kho_<họ> for values in (...)`).
**Việc tiếp theo trên nền này:** (a) đọc xuyên nhánh chuyển từ view UNION sang bảng chung; (b) gom trigger/hàm chép theo nhánh về bảng chung (trigger đặt ở bảng chung tự áp cho mọi phần); (c) index mới tạo ở bảng chung.
**Bẫy đã gặp khi gộp (kiểm cho mọi họ sau):** (1) hàm đọc `alias.*` / `select *` vào khuôn trả cố định; (2) biến/tham số/cột trả trùng tên cột mới (`kho`, cột thêm) — plpgsql báo mơ hồ, sql đổi nghĩa im lặng; (3) cột IDENTITY; (4) áp dồn nhiều migration đúng khe cron.
**Chưa làm ở bước gộp:** trigger và hàm vẫn là bản chép theo nhánh — gom dần về bảng chung sau, không chặn việc gộp.

## 3. Tầng Đo — một sổ sự kiện duy nhất

Hiện trạng: 3 nguồn đo (`gami_grades`, `bai_lam_cau`, `bt_grades`) và 3 bộ đọc lịch sử song song. Đích:

- **Một cửa đọc lịch sử đo** `_do_su_kien` (HS · môn · mã câu · kết quả · kênh · thời điểm · mã nguồn) = hàm/view GỘP các bảng sự kiện sẵn có,
  với index đủ. **Không dựng bảng sự kiện mới** (quyết định BK: lịch sử = UNION các bảng sự kiện; thêm một bảng chép lại là hai nguồn chân lý).
  Mượn của xAPI đúng một thứ: *hình dạng thống nhất* của một lần đo (ai – làm gì – trên gì – kết quả – ngữ cảnh), để 3 bộ đọc hiện nay còn 1.
- **Bảng ánh xạ câu → dạng bài lưu sẵn** (thay view `bdm_cau_dang` 8 nhánh), cập nhật bằng trigger khi gán/đổi/duyệt. Sự kiện đo lưu **mã câu**
  (mã gốc bất biến); dạng tra qua bảng ánh xạ ⇒ đổi bản đồ không phải sửa lịch sử, mastery vẫn "suy động".
- **Cấm** hàm đọc tự quét `gami_grades`/`bai_lam_cau`/`bt_grades`. Mọi thứ suy từ lịch sử đo đi qua mô hình đọc (§4).
- Kỳ đã đóng (tháng, tuần, mùa) = **sổ chốt bất biến**, tính một lần lúc đóng, không tính lại.

## 4. Tầng Mô hình đọc — một khuôn "Sổ tính sẵn" (`ts_*`)

Thay 6 kiểu hiện có bằng MỘT khuôn (chi tiết bảng ở audit §2.4):

- `ts_dang_ky` — danh mục: mã sổ · bảng lưu · **đơn vị tính** (1 HS / HS×môn / lớp / nhân sự / khối) · hàm tính (nhận mảng khoá) · độ ưu tiên ·
  ngân sách ms · trần 1 khoá · phụ thuộc sổ nào · chính sách khi bẩn (`tinh_truc_tiep` cho đơn vị nhỏ, `doc_cu_kem_co` cho đơn vị lớn).
- `ts_ban` — **một hàng đợi bẩn duy nhất** `(mã sổ, khoá)`. Trigger ở bảng nguồn chỉ làm một việc: chèn dòng bẩn. Không còn TTL làm cơ chế chính.
- Bảng lưu nào cũng có: khoá · `tinh_at` · `moc` · phiên bản công thức. Ghi bằng upsert phần khác biệt, **cấm xoá hết chèn lại**.
- **Một bộ điều phối `_ts_chay`**, một job cron: đi theo ưu tiên, cũ nhất trước, kiểm giờ **sau từng khoá**, mỗi khoá có trần riêng và bắt lỗi riêng
  (một khoá hỏng không huỷ cả lượt). Một kết nối thay cho ~9.
- **Đơn vị tính luôn là đơn vị nhỏ nhất** (1 HS, 1 nhân sự). Số cấp trên (lớp, khối, toàn trung tâm, bảng xếp hạng) = GOM từ đơn vị nhỏ, không tính lại từ gốc.
- Hàm đọc giữ chữ ký. Đơn vị lớn **không bao giờ tính trong lượt đọc của người dùng** — trả số cũ kèm "tính lúc HH:MM".
- Quan sát: `ts_chay` (mỗi lượt: số khoá, còn lại, ms lớn nhất, lỗi) + màn admin (độ dài hàng đợi, tuổi khoá cũ nhất).
- Sổ chốt bất biến (chốt tuần, báo cáo kì, ảnh đầu tuần) KHÔNG thuộc khuôn này — đó là dữ liệu gốc.

## 5. Hợp đồng API (ranh giới màn hình ↔ DB)

- Client gọi **hàm**, không đọc bảng nghiệp vụ. Được đọc/ghi thẳng bảng chỉ với CRUD dòng đơn của chính màn đó (như CLAUDE.md §2.0).
- **Một màn = một RPC cho phần đang hiện** (`fn_<miền>_man_<tên>`), trả đúng hình màn cần. Badge, số đếm đi kèm trong RPC đó, không mỗi badge một RPC.
- Mỗi hàm đọc khai **lớp chi phí** trong chú thích đầu hàm và phải đúng:
  - `C1` hằng số / theo khoá · `C2` theo dữ liệu của MỘT người hoặc MỘT lớp · `C3` theo cả khối/cả hệ.
  - Hàm client gọi trực tiếp chỉ được `C1`/`C2`. `C3` ⇒ bắt buộc là sổ tính sẵn.
- **Ngân sách thời gian** (đo bằng tài khoản thật đông dữ liệu nhất): app HS ≤ 300 ms · màn nhân sự ≤ 1 s · thao tác ghi ≤ 500 ms. Vượt ⇒ không được lên màn.
- Tham số khoảng thời gian **bắt buộc có**; cấm mặc định = toàn bộ lịch sử.
- Trong hàm đọc: cấm temp table; cấm gọi hàm plpgsql trên từng dòng của tập lớn (đổi thành join theo tập hoặc cột chụp sẵn).
- Kiểu TypeScript của RPC sinh tự động từ DB (`supabase gen types`), không gõ tay.

## 6. Lớp dữ liệu client

- **Cache và gộp lượt gọi đặt BÊN TRONG seam `src/lib`** (seam đã có từ đầu: màn không gọi Supabase trực tiếp). Một tiện ích chung
  (cache theo khoá, gộp lượt gọi đang bay, giữ số cũ trong lúc làm mới nền) mà các hàm `src/lib` dùng; chữ ký hàm giữ nguyên nên màn không phải sửa.
  Luật `NHO` của CLAUDE.md §2 (màn hàng đợi nhớ filter + list + vị trí cuộn) **giữ nguyên** — đó là luật trải nghiệm, lớp cache này là luật tải.
  Có dùng thư viện (TanStack Query) hay tự viết: quyết ở đợt 4 theo công chuyển đổi, không bắt buộc ở spec.
- **Danh tính và dữ liệu tham chiếu** (`tôi là ai`, lớp, nhân sự, vị trí, team) tải MỘT lần mỗi phiên, giữ 5–10 phút, xoá khi có ghi.
  Hàm trong `src/lib` **không tự gọi `getMyProfile()`**.
- **Về lại màn ≠ tải lại màn.** Dữ liệu còn trong hạn thì dùng; chỉ làm mới khi có mutation liên quan hoặc quá hạn.
- **Polling**: chỉ qua một hook `usePoll` (dừng khi tab ẩn, chỉ chạy khi có việc đang chờ, lùi dần). Nhịp tối thiểu 5 phút cho số tính sẵn;
  nhịp ngắn hơn chỉ cho màn "đang trong ca/đang thi" và có điều kiện dừng. Đã nghe Realtime thì không poll cùng dữ liệu đó.
- **Realtime**: kênh luôn có bộ lọc theo khoá (lớp, phòng, phiên). Cấm kênh chung toàn hệ.
- **Ghi dồn** (lưu trạng thái game…): gom ≥ 20–30 s, đẩy ngay khi rời màn/tiêu xu.
- Danh sách: phân trang thật ở DB. Cấm `limit ≥ 1000` và `select('*')` trên bảng lớn theo số HS.

## 7. Quyền — từ chối mặc định

- **Danh tính chỉ qua `tai_khoan`.** Bỏ nhánh khớp email; nhân sự nghỉ = hết quyền.
- **Project ERP đóng tự đăng ký.** Tài khoản do máy chủ cấp (service role ở serverless), không `signUp` từ trình duyệt.
- **Mọi bảng bật RLS** kể cả bảng kỹ thuật. Không policy `USING (true)` cho ghi.
- **Hàm: thu quyền mặc định, cấp theo danh sách trắng.** `PUBLIC`/`anon` không có EXECUTE trừ danh sách cố ý (ghi trong 1 file, có lý do từng hàm).
  Hàm `_nội_bộ` không cấp cho `authenticated`.
- **Hàm security definer bắt buộc có cổng** ở dòng đầu (là ai, được gì) và không nhận "người thực hiện" từ tham số client.
- **View luôn `security_invoker = on`.**
- **Storage**: ghi/xoá kèm điều kiện vai trò và thư mục theo chủ.
- Endpoint gọi LLM: kiểm quyền trước khi gọi model + hạn mức theo người/ngày.
- **Không có người dùng ngoài trung tâm** ⇒ một project, đóng đăng ký hoàn toàn, mọi tài khoản do hệ thống cấp. Mối lo về quyền ở 10.000 HS là
  người TRONG: 10.000 tài khoản HS (đăng nhập được là gọi được mọi hàm cấp cho `authenticated`) và nhân sự vào–ra nhiều (GV là "người qua đường")
  ⇒ HS chỉ thấy dữ liệu của mình và lớp mình; quyền nhân sự bám ghế + phạm vi, thu ngay khi nghỉ.

### 7b. Hệ quả của đích "10.000 HS của trung tâm" (khác với một app đại chúng)

- **Nhân sự và lớp tăng theo HS** (hiện 51 nhân sự · 51 lớp cho 515 HS ⇒ cỡ 1.000 nhân sự · 1.000 lớp ở 10.000 HS; giả định nhiều cơ sở). Phía nhân sự nặng lên
  ngang phía HS: mọi hàm cho nhân sự nhận **phạm vi** (cơ sở · môn · khối · lớp của tôi) và chỉ tính trong phạm vi đó; số "toàn trung tâm" chỉ đọc sổ tính sẵn.
- **"Việc của tôi" là màn được mở nhiều nhất hệ** (mỗi nhân sự, nhiều lần mỗi ngày) ⇒ chi phí phải theo việc CỦA TÔI, không theo tổng số buổi của trung tâm.
- **Tải dồn theo giờ học**: 10.000 HS cùng vào lớp buổi tối, cả lớp nộp ET/BTVN cùng phút ⇒ đường ghi lúc chấm/nộp phải nhẹ (ghi dòng, đánh bẩn, xong);
  mọi tính toán nặng đẩy ra sau, ngoài lượt ghi.
- **Dữ liệu đo tăng cỡ 20 lần** (lần đo ∝ HS × buổi) ⇒ bảng sự kiện đo cần index theo (HS, thời gian) và kế hoạch chia theo năm học ngay từ đợt 2.
- **Bảng xếp hạng, Thế giới BK "toàn BK"** ở 10.000 HS phải có phạm vi mặc định (lớp → khối → cơ sở); "toàn BK" là sổ tính sẵn, không tính lúc mở.

## 8. Cổng tự động — luật không ai kiểm là luật chết

`npm run check:kien-truc` (chạy sau mỗi `npm run migrate` và trước commit đụng `src/lib`, `src/screens`). Mỗi mục có **số trần chỉ được giảm** (ratchet):
ngày bật cổng ghi lại số hiện tại, từ đó số mới > số cũ là ✗.

| Kiểm | Nguồn | Ngưỡng |
|---|---|---|
| Bảng public không bật RLS | catalog | 0 |
| Hàm anon/PUBLIC gọi được ngoài danh sách trắng | catalog | 0 |
| Hàm security definer không có cổng (regex + danh sách miễn có lý do) | catalog | chỉ giảm |
| View không `security_invoker` | catalog | 0 |
| Khoá ngoại không có index | catalog | chỉ giảm; bảng mới = 0 |
| Index tạo quá 7 ngày mà `idx_scan = 0` | pg_stat | cảnh báo |
| Hàm client gọi có trung bình > ngân sách (§5) | pg_stat_statements | cảnh báo → ✗ sau 2 tuần |
| Job tính sẵn: tuổi khoá cũ nhất, lượt lỗi 24 h | `ts_chay` | cảnh báo |
| `.from(` trên bảng nghiệp vụ trong `src/` | grep | chỉ giảm |
| `setInterval` gọi DB ngoài `usePoll` | grep | 0 với code mới |
| `limit ≥ 1000`, `select('*')` trên bảng lớn | grep | chỉ giảm |
| So sánh môn/nhánh cứng (`=== 'dai'`…) ngoài registry | grep | chỉ giảm |

Thêm: **thử tải trước mỗi mốc** (k6: kịch bản mở app HS, làm bài, chơi game với N người ảo trên bản sao DB) — không qua thì chưa mở mốc.

## 9. Bộ luật (đưa vào CLAUDE.md sau khi Thùy chốt)

Mỗi luật: điều cấm/bắt buộc — *vì sao* — kiểm bằng gì.

- **K1. Miền sở hữu bảng.** Miền khác gọi hàm, không đụng bảng. — *Hết cảnh mỗi tính năng tự mở đường xuống DB.* — Review + tiền tố tên.
- **K2. Hàm client gọi chỉ được chi phí theo MỘT người / MỘT lớp.** Cả khối/cả hệ ⇒ sổ tính sẵn. — *Hết "tính cả hệ rồi lọc".* — Khai `C1/C2/C3` + đo pss.
- **K3. Không quét lịch sử đo trong hàm đọc.** Đi qua mô hình đọc. — *Chi phí tăng theo HS × thời gian.* — grep tên 3 bảng đo trong thân hàm `fn_*`.
- **K4. Một khuôn tính sẵn.** Bảng tính sẵn mới = một dòng `ts_dang_ky`, không cron riêng, không TTL làm cơ chế chính. — *6 kiểu, 16 cron chồng nhau.* — catalog cron.
- **K5. Đơn vị tính nhỏ nhất; cấp trên là gom.** Cấm 1 khoá = mọi HS. — *bxh 280 s/khoá ở 10k.*
- **K6. Kỳ đã đóng thì chốt một lần.** — *Thành tựu, album, ĐHT tính lại cả mùa mỗi lượt.*
- **K7. Mọi khoá ngoại và mọi cột lọc/nối của hàm mới đều có index; tạo xong phải thấy `idx_scan > 0`.** — *4 index sai biểu thức chưa từng được dùng.* — cổng.
- **K8. Cấm hàm plpgsql trên từng dòng của tập lớn; cấm temp table trong hàm đọc.** — *`fn_han_viec`: 31 triệu lượt quét.*
- **K9. Tham số thời gian bắt buộc; phân trang ở DB.** — *Mặc định = toàn bộ lịch sử.*
- **K10. Đo trước khi lên màn** bằng tài khoản đông dữ liệu nhất; vượt ngân sách §5 thì không lên. — *(đã có ở §2.0, giờ có số).*
- **K11. Một màn = một RPC cho phần đang hiện.** — *Mở app HS 30 request.*
- **K12. Màn không gọi Supabase trực tiếp** — đi qua lớp dữ liệu client. — *82 cache tự viết, dữ liệu tham chiếu tải lặp.* — grep.
- **K13. Cấm polling ngoài `usePoll`; nhịp < 5 phút phải có điều kiện dừng.** — *333 lượt/s ở 10k chỉ để hỏi "có cập nhật không".* — grep.
- **K14. Quyền từ chối mặc định**: RLS mọi bảng; hàm cấp theo danh sách trắng; secdef có cổng; view `security_invoker`. — *8 bảng hở, 131 hàm lọt.* — cổng.
- **K15. Danh tính chỉ qua `tai_khoan`; không tin tham số "người thực hiện" từ client.**
- **K16. Mọi thao tác trên Toán chạy y hệt mọi môn** (§1.6). Bảng kho mỗi nhánh vẫn RIÊNG (không gộp). Hàm *vận hành/đo dùng chung* đi qua một registry;
  chỉ nhánh có cấu trúc nội dung khác hẳn (Hình) mới có hàm riêng. Cấm chép nguyên một họ hàm sang nhánh mới khi cấu trúc giống nhau. — *35 họ hàm bản đồ chép y nguyên × 3–5 nhánh.*
- **K17. Dữ liệu chỉ thêm (log, sự kiện) phải khai hạn giữ** hoặc kế hoạch chia theo tháng ngay lúc tạo bảng. — *Log 45 MB không hạn.*
- **K18. Chuyển đổi kiểu song song**: cũ–mới chạy cùng, so khớp từng dòng, rồi mới cắt; đổi schema theo nới–siết. — *(Khan; đã là nếp ở §2.0.)*
- **K19. Sửa xong phải có số trước–sau** (ms, block, số request) ghi vào DEVLOG.
- **K20. Quyết định kiến trúc mới = một ADR** (Notion), không quyết trong commit message.
- **K21. Bảng tính sẵn là bản chiếu, không phải nguồn chân lý.** Xoá đi phải dựng lại được từ dữ liệu gốc; luôn giữ đường tính trực tiếp để đối chiếu
  định kỳ, lệch thì tự bật cờ. Cấm ghi tay, cấm để nghiệp vụ phụ thuộc vào việc "dòng cache đã tồn tại". — *Giữ pure-derive và §1.5 khi thêm cache.*
- **K22. Cách ly tải của máy khỏi giờ học.** Việc hàng loạt (bot kho, phiên Claude ghi nhiều dòng, script, làm mới nặng) chạy theo hàng đợi có ngân sách,
  ngoài 17–22 h, và **không được đánh bẩn số của HS vì thay đổi phía kho** trừ khi kết quả của em thật sự đổi. — *Bot gán câu buổi tối làm bẩn mastery hàng loạt; cron lỗi kết nối đúng giờ HS học.*
- **K23. Luật nào cũng phải có máy kiểm hoặc số đo.** Luật chỉ dựa vào "phiên sau nhớ" coi như không có. — *System over Stars: nhiều phiên Claude song song, không nhớ nhau.*

### Phiếu 10 câu cho MỌI tính năng mới (dán vào đầu spec tính năng)
1. Thuộc miền nào, sở hữu bảng nào? 2. Mã gốc là cột nào, ai cấp? 3. Có nhãn `mon` chưa? 4. Ai được đọc/ghi — policy và cổng hàm là gì?
5. Màn gọi những RPC nào lúc mở (mục tiêu: 1)? 6. Mỗi hàm đọc thuộc lớp chi phí nào, đo được bao nhiêu ms? 7. Có số nào cần tính sẵn — đơn vị tính, cái gì đánh bẩn?
8. Index cho từng cột lọc/nối? 9. Có polling/realtime không — điều kiện dừng? 10. Dữ liệu lớn theo gì, hạn giữ bao lâu?

## 10. Lộ trình chuyển đổi (strangler — không viết lại, không dừng tính năng)

Mỗi đợt: nêu phạm vi → Thùy gật → làm → số trước–sau → DEVLOG. Việc đụng DB chạy ngoài 17–22 h.

| Đợt | Việc | Xong khi |
|---|---|---|
| **0. Bịt lỗ đang hở** | RLS 8 bảng · thu quyền anon/PUBLIC + danh sách trắng · `security_invoker` cho view · cổng cho ~25 hàm · 5 policy ghi mở · storage · bỏ nhánh email, lọc đang làm · chuyển cấp tài khoản sang máy chủ rồi đóng đăng ký | Cổng §8 (4 dòng quyền) = 0; đăng nhập thật 8 app + app PH + game khách vẫn chạy |
| **1. Dựng hàng rào** ✅ 13/11 | `npm run check:kien-truc` (`scripts/check-kien-truc.mjs`) + số trần `scripts/kien-truc/tran.json` + danh sách cho phép `cho-phep.json` · luật vào CLAUDE.md · phiếu 10 câu (§9) | Nợ mới không vào được |
| **2. Nền dữ liệu** | Bộ index (audit §2.2) + tạo lại 4 index sai · bảng ánh xạ câu→dạng thay view 8 nhánh · một cửa đọc lịch sử đo · "Việc của tôi": lọc người trước, có cửa sổ ngày; hạn việc là **cache suy ra** theo (buổi, khâu) — việc vẫn pure-derive, không có dòng việc | Hết seq scan lớn; `fn_viec_buoi_thuong`, họ bốc câu, `_do_o_bdm` trong ngân sách; so khớp cũ–mới từng dòng |
| **3. Khuôn tính sẵn** | `ts_*` + bộ điều phối · chuyển theo thứ tự: tin Thế giới → bxh → mục tiêu tuần/dạng yếu/dạng đã học → mastery (+Hình) → phòng/dashboard → cây bản đồ | 1 job cron; không lượt nào > 30 s; không lỗi kết nối cron |
| **4. Lớp dữ liệu client** | Cache + gộp lượt gọi trong seam `src/lib` (danh tính, tham chiếu trước) · `usePoll` · gộp Home HS thành 1–2 RPC · Home nhân sự · nông trại ghi thưa | Mở app HS ≤ 4 request; về màn chính ≤ 1; 0 polling ngoài hook |
| **5. Trả nợ hàm C3** | `fn_traogiai_thang`, `fn_bc_ky_*` (chốt theo lô), `fn_hs_album`, `fn_xephang_chung`/`fn_tich_luy`, thành tựu, Thế giới (bỏ `_hs_hien` từng dòng) | Không hàm client gọi nào > ngân sách |
| **6. Sức chứa** | Thử tải ở 1.000 / 2.000 · chọn gói máy chủ theo số đo · hạn giữ log · chia bảng đo theo năm học | Qua thử tải mốc kế tiếp với dư 2 lần |

**Thứ tự ưu tiên bên trong mỗi đợt theo moat**: đường đo → mastery → "Việc của tôi" và các màn của người chăm (TA/GV/OPS) trước; game, Thế giới BK, bảng xếp hạng sau.

Thứ tự là theo phụ thuộc: 0 độc lập và gấp; 1 trước để chặn nợ mới; 2 là nền của 3 và 5; 4 chạy song song với 2–3 (khác file).
Dọn nhân bản hàm theo nhánh môn (35 họ × 3) và 137 hàm không ai gọi: làm cuốn chiếu khi chạm tới, không mở đợt riêng.

**Máy chủ theo mốc** — chưa đủ số để chốt; thử tải ở đợt 6 quyết. Tạm tính: sau đợt 2–4, mốc 1.000 HS nhiều khả năng ở gói Small–Medium (15–60 USD/tháng),
2.000 ở Medium–Large (60–110), 10.000 ở Large–XL (110–210) trên cùng một project. Đây là ước lượng, không phải cam kết.

## 11. Chờ Thùy quyết

1. **Chốt bộ luật K1–K23** ⇒ tôi đưa vào CLAUDE.md, có hiệu lực với mọi tính năng mới từ ngày chốt.
2. **Thứ tự**: đợt 0 trước tất cả (đề xuất), hay Thùy muốn ưu tiên khác.
3. Cần Thùy xem giúp trên dashboard Supabase (tôi không đọc được): Authentication → "Allow new users to sign up" và "Confirm email"; API → "Max rows".
