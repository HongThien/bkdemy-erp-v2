# spec-app-ph.md — APP PHỤ HUYNH: phụ huynh thấy gì, làm gì, số lấy từ đâu (spec #13 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 18/11/2026** (bảng §12.0). Spec này là nguồn đúng cho app phụ huynh; `spec-bao-cao-ky.md` đã chuyển `_luu-tru/` (nội dung + công thức ở §6; ai nhập / ai công bố ở `spec-quan-ly-chat-luong.md`). Việc code chỉ làm khi Thùy ra lệnh. Repo `bkdemy-ph-app` CHƯA có dòng trỏ sang spec này (việc phải làm).
> Chỗ nguồn mâu thuẫn nhau / nguồn ≠ DB-code / luật không có ngày chốt ⇒ **không tự chọn**, ghi §12.1 (10 câu hỏi). Việc code / DB chỉ làm khi Thùy ra lệnh.
> **Gộp từ:** repo `bkdemy-ph-app` (`HANDOFF.md` 346 dòng · `DEVLOG.md` · `docs/SYNC_CONTRACT.md` · `migrations/0001–0038` · `app/` · `lib/` · `components/ph/`) ·
> `spec-bao-cao-ky.md` (**trọn phần A–F: nội dung · công thức · bố cục · PDF**; phần "ai nhập / ai công bố" đã ở `spec-quan-ly-chat-luong.md` §8) ·
> `spec-van-hanh-tuan.md` §4 (chỉ phần **hiển thị** trên app PH) · `_luu-tru/PLAN-app-ta.md` (role `ph_nop`, view `v_btvn_*`) · `_luu-tru/ket-qua-hoc-tap-tong-quan.md` (chỉ lịch sử) ·
> HANDOFF + DEVLOG của ERP (mục "app PH", "fdw", "ph_nop", "báo cáo kì") · mig ERP `*fdw*`, `*bao_cao_ky*`, `202611151055`, `202611181239`.
> **Đối chiếu DB 18/11 19:20** (chỉ đọc, `begin read only`): **cả hai DB** — ERP (role `claude_build`) và `bkdemy-ph` (chuỗi kết nối trong `.env.local` của repo app PH). Số trong file là số ngày 18/11.
> **Code app PH đọc trên máy này = `main` tại `32370b1` (13/11) — đang SAU `origin/main` 14 commit (16–18/11, đều là màn Mục tiêu tuần).** Phần §5 viết theo `spec-van-hanh-tuan.md` §4.6 + tên commit, chưa đọc được code mới.
>
> **Ranh giới (chỉ trỏ, không chép):** công thức đo, dạng yếu · nhóm yếu · HS yếu ⇒ `spec-mastery.md` · luật Mục tiêu tuần ⇒ `spec-van-hanh-tuan.md` §4 ·
> quy trình thu học phí phía trung tâm ⇒ `spec-van-hanh-trung-tam.md` §5 · xếp lịch bổ trợ, báo phụ huynh phía Lộc ⇒ `spec-van-hanh-trung-tam.md` §3 ·
> ai nhập / ai công bố báo cáo học kì ⇒ `spec-quan-ly-chat-luong.md` §8 · TA chấm bài nộp ảnh, máy chấm ⇒ `spec-tro-giang.md` §3–§4 ·
> web marketing + form đăng ký test công khai ⇒ #9 (chưa viết) · app học sinh ⇒ `spec-app-hs.md`.

---

## 0. Đích + nguyên tắc

- **Phụ huynh mở app để XEM con, không phải để nhận việc** (Thùy 18/09). Việc duy nhất phụ huynh *làm* trên app: **chụp ảnh nộp bài tập về nhà** và **quét mã chuyển khoản học phí**.
- **App không tính gì.** Mọi con số tính ở Postgres (ERP tính sẵn → app đọc). Báo cáo học kì, Mục tiêu tuần: ERP chụp sẵn một gói, app chỉ dựng hình (CLAUDE §2.0).
- **Số phụ huynh thấy phải là số đã công bố / đã chốt** — đúng với Báo cáo học kì (đã công bố + kì đã bật), Mục tiêu tuần (lớp đã công bố), bài chấm ảnh (TA đã trả), hoá đơn (đã chốt kì). **Chưa đúng** với kết quả ET / BTVN hằng buổi (hiện ngay khi nhập) — §12.1 câu 1.
- **Mọi số học tập có nhãn môn** (CLAUDE §1.6); thanh chọn môn ở đầu app khi con học ≥ 2 môn. Học phí, thông báo, tài khoản là dữ liệu chung, không nhãn môn.
- **Phụ huynh KHÔNG thấy:** gậy · lương · hiệu suất TA / GV · thái độ 4 mức gốc trong Mục tiêu tuần · báo cáo đang nháp · Thế giới BK / xu / tủ quà của con (Thùy 28/09 — app HS) · % từng dạng trong Mục tiêu tuần (Thùy 18/11).
- **Điện thoại màn dọc là chính** (Thùy 13/11 "App PH chủ yếu là điện thoại"); mọi màn mới soát ở khổ 390 × 844.
- **Lời chữ formal**, không chữ tắt nội bộ: "Test cuối giờ" (không "ET"), "T8" (không "MT tháng 8"), "KS1" (khảo sát).

## 1. Kiến trúc — hai repo, hai DB, đọc ERP qua FDW

### 1.1 Bức tranh

| | ERP | App phụ huynh |
|---|---|---|
| Repo | `bkdemy-erp-v2` (spec này nằm ở đây) | `bkdemy-ph-app` (Next.js 16 · React 19 · PWA) |
| DB | Supabase `osrvycilwshkzhljuxef` | Supabase **`bkdemy-ph`** `nhidbaxbxxepxiwzqmmg` (dùng chung với web tuyển sinh + Sổ Kèo) |
| Địa chỉ | — | `ph.bkacademy.edu.vn` · Vercel nối GitHub, **đẩy `main` là tự deploy** (từ 09/09) |
| Migration | `npm run migrate` (có sổ) | `node scripts/migrate.mjs migrations/00XX.sql` — **từng file, KHÔNG có sổ** |

- App PH **không ghi gì vào ERP**, trừ đúng một đường: nộp ảnh BTVN (§8).
- DB `bkdemy-ph` đọc ERP **sống** qua `postgres_fdw`: server `erp_server` → đăng nhập ERP bằng role **`fdw_bkdemy_web`** (qua pooler) → bảng ngoại ở schema `erp_live` → view `public.*` → app đọc bằng khoá `service_role` của `bkdemy-ph`, **tự lọc theo `phu_huynh_id`** lấy từ `app_metadata` của phiên đăng nhập (chỉ máy chủ sửa được). Không dùng RLS phía app PH ⇒ **mọi hàm máy chủ đọc theo con phải qua cổng "con này có thuộc phụ huynh đang đăng nhập không"** (`mv_ph_owned` / `hoc_sinh_live`).
- Đường "đồng bộ đẩy ERP → ph" (`buoi_view`, `diem_view`, `lop_view`, `tkb_view` — `docs/SYNC_CONTRACT.md`) **đã chết 22/06**; 4 bảng đó còn nằm trong DB `bkdemy-ph` nhưng app không đọc.

### 1.2 Ba role của ERP dành cho bên ngoài

| Role | Ai dùng | Được gì (đo 18/11) |
|---|---|---|
| `fdw_bkdemy_web` | DB `bkdemy-ph` (app PH + web tuyển sinh) | **SELECT 38 bảng / view** (§11.1) — chỉ đọc |
| `ph_nop` | máy chủ app PH khi phụ huynh nộp ảnh | **không SELECT bảng nào**; gọi `fn_btvn_nop_tao_auto` / `fn_btvn_nop_tao` |
| `web_lead_writer` | web tuyển sinh (#9) | INSERT `ung_vien` |

⚠ Cả ba role còn giữ quyền gọi ~437 hàm khác của ERP (di sản từ thời quyền mặc định mở) — §12.2 mục 1.

### 1.3 LUẬT đổi quyền role FDW (bài học đã trả giá 01–04/09)

Mig ERP `202609012300` thu quyền `fdw_bkdemy_web` trên 10 bảng vì **grep repo không thấy ai dùng** ⇒ 5 bảng app PH đang đọc chết **im lặng**: tab "Cả lớp", kết quả, môn + lớp của con đều trống, app chỉ hiện "Chưa có kết quả" (lỗi thật: `permission denied for table gami_session_problems`). Vá: mig `202609041045` (**đã áp** — kiểm sổ 18/11).

1. **Cấp quyền = HAI cổng, thiếu một là vẫn hở:** `grant select … to fdw_bkdemy_web` **và** policy `fdw_bkdemy_web_read` (`for select to fdw_bkdemy_web`). Bảng mới của ERP **mặc định đóng** với cả ba role (CLAUDE §2.1) ⇒ grant tường minh trong migration, kèm một dòng lý do.
2. **Thu / đổi quyền, đổi tên cột, đổi kiểu cột của bảng app PH đọc ⇒ đo trên DB ĐÍCH (`bkdemy-ph`), không grep repo:** liệt kê `information_schema.foreign_tables` + `pg_depend` (view → bảng ngoại) + thân hàm có chữ `erp_live.` rồi **SELECT thử từng bảng ngoại**. Bảng ngoại tạo tay hoặc mượn của hộ khác không nằm trong chữ `limit to` của repo nào.
3. **"0 dòng" / "chưa có kết quả" trên app PH KHÔNG phải bằng chứng ERP không có dữ liệu** — app nuốt lỗi quyền. Nghi ngờ ⇒ SELECT thẳng bảng ngoại.
4. **Lọc "cái gì được rời ERP" đặt ở ERP (policy), không đặt ở view phía app PH.** Mẫu đúng: `bao_cao_ph_ky` (policy chỉ cho dòng đã công bố **và** kì đã bật) · `mtt_luu` (policy chỉ cho tờ đã công bố). Policy chỉ so cột, không gọi hàm kiểm quyền từng dòng (K27).
5. **View có window / union / join nhiều bảng ngoại ⇒ điều kiện lọc KHÔNG đẩy xuống ERP ⇒ kéo cả bảng** (đáp án: 14–16 s). Cách đúng: ERP tính sẵn thành **một bảng / view hẹp** rồi app đọc đúng dòng của con (mẫu: `mtt_luu`, `bao_cao_ph_ky`, `v_ph_hoc_online`), hoặc hàm `security definer` phía `bkdemy-ph` đẩy điều kiện hằng xuống (mẫu: `get_dap_an`, 14 s → 0,3 s).
6. **Đổi một matview cha ⇒ matview con bị xoá theo, im lặng** (18/09) ⇒ dựng lại cả bộ trong cùng migration.
7. Sau mỗi `create view / function` ở `bkdemy-ph`: `notify pgrst, 'reload schema'`.
8. `sw.js` **không được cache dữ liệu** (app hiện điểm, học phí — số cũ là rủi ro nghiệp vụ; 11/08).

## 2. Đăng nhập + liên kết con

- **Tài khoản = số điện thoại phụ huynh trong ERP** (`phu_huynh.so_dien_thoai`). Số chưa có trong ERP ⇒ "Số điện thoại chưa được đăng ký tại trung tâm".
- Lần đầu: hệ tự tạo tài khoản với **mật khẩu mặc định `123456`**, bắt đổi ngay lần đầu vào (≥ 6 ký tự). — §12.1 câu 10.
- **Liên kết con không có bước nào trên app:** con = mọi học sinh có `hoc_sinh.phu_huynh_id` trỏ về phụ huynh đó ở ERP. Nhiều con ⇒ đổi con ở thẻ học sinh. Sửa liên kết = sửa ở ERP.
- Quên mật khẩu: nhân sự đặt lại ở ERP › **Đăng nhập Phụ huynh** (về `123456`, bắt đổi lại).
- **Xem app như phụ huynh** (nhân sự, từ ERP): đường dẫn có hạn `/xem/<mã>` — thấy đúng dữ liệu học tập phụ huynh thấy; không có học phí; **không nộp bài hộ được**; lượt xem thử không tính vào thống kê.
- **Theo dõi sử dụng:** mỗi lần đổi màn ghi một dòng `ph_xem` (DB `bkdemy-ph`); ERP › Đăng nhập Phụ huynh đọc qua `admin_parent_usage`.
- Cài app: PWA (Android có nút cài; iPhone hướng dẫn Chia sẻ → Thêm vào MH chính). Thanh nhắc cài **cố ý không nhớ lần bấm tắt** (12/08).
- **Số (18/11):** ERP 411 phụ huynh · 503 / 517 học sinh có phụ huynh · 276 tài khoản đã tạo, 275 từng đăng nhập · **157 phụ huynh có mở app trong 30 ngày** (8.216 lượt xem màn) · 13 máy bật thông báo đẩy.

## 3. Buổi học · điểm danh · lịch

- **Trang chủ:** thẻ học sinh · 3 ô nhanh **Điểm danh** (% có mặt tháng này) · **BTVN** · **Học phí** (Đã / Chưa hoàn thành) · thông báo trung tâm (3 tin mới nhất) · buổi mới nhất + nhận xét giáo viên · ô **Mục tiêu tuần** · **Kết quả học tập** · **Nộp bài tập** · nút Zalo trung tâm.
- **Màn Buổi học:** dải các buổi (chấm màu theo cái xấu nhất trong chuyên cần · Mức · BTVN) → tab **Cá nhân**: điểm danh (Có mặt / Vắng có phép / Vắng) · **Đánh giá buổi = Mức 1–5** kèm nhãn giáo viên chọn · nhận xét · tài liệu buổi · nút Đáp án chi tiết. Tab **Cả lớp**: bảng Đ/C/S từng câu + Mức + nhận xét của **mọi bạn trong lớp, có tên** — §12.1 câu 2.
- Điểm danh đọc thẳng ô điểm danh của ERP (ô này từ 17/11 đổi là có vết — `spec-van-hanh-trung-tam.md` §1). Phụ huynh không sửa, không xin phép qua app.
- **Đáp án chi tiết:** Test cuối giờ của buổi này + BTVN của **buổi trước** (đáp án BTVN lộ trễ một buổi); hiển thị như kho (công thức, lời giải, hướng dẫn) + nút Tải PDF / In. **Chỉ có câu Đại số Toán** (`dai_cau_hoi`); Hình, KHTN chưa nối.
- **Lịch — CHƯA CÓ trên app PH:** không có lịch học sắp tới (thời khoá biểu), không có màn lịch bổ trợ riêng. Ca bổ trợ (sau giờ · yếu) chỉ xuất hiện như một dòng trong **Hoạt động tuần này** của Mục tiêu tuần (giờ + phòng), và chỉ khi lớp đã công bố tờ tuần. Thùy 17/11 chốt "ca sau giờ sẽ hiện trong lịch trên app em / phụ huynh" — chưa build, đặt ở đâu trên app PH: §12.1 câu 7.

## 4. Kết quả học tập hằng ngày — số nào lấy từ đâu

Màn **Kết quả học tập** = 5 ô: BTVN · Test cuối giờ · Test tháng · Bài tập online · Báo cáo học kì (§6).

| Ô | Phụ huynh thấy | Nguồn ERP | Tính ở đâu · độ trễ |
|---|---|---|---|
| **BTVN** | TB tháng của con · **hạng trong khối** · từng buổi: % (xanh khi ≥ TB lớp, đỏ khi thấp hơn) | ô chấm BTVN từng câu (`gami_grades` khâu `btvn`) — **không** dùng `btvn_ket_qua.ti_le_dung` (cột chết) | matview ở `bkdemy-ph`, làm mới **5 phút / lần**; giữ 18 tháng |
| **Test cuối giờ** | như trên | ô chấm ET từng câu (`gami_grades` khâu `et`) | như trên |
| **Test tháng** | mỗi tháng một thẻ: điểm tổng · % Cơ bản · % Nâng cao · hạng **Lớp · Hệ · Khối** | `ky_thi` loại `mt_sat_hach` + `diem_thi` — **chưa có Khảo sát** (§12.1 câu 5) | như trên |
| **Bài tập online** | con tự học trên app HS: chuỗi ngày (≥ 5 câu / ngày) · 7 / 30 ngày (số câu, % đúng, số ngày) · theo loại (tự luyện · bổ trợ · retest · học từ đầu) · theo môn | view ERP `v_ph_hoc_online` | hàm `fn_ph_hoc_online` ở `bkdemy-ph`, gọi lúc bấm |

- **% một buổi** = (số câu Đúng + ½ số câu Chưa trọn) ÷ số câu đã chấm. Buổi **bù**: điểm tính vào lớp gốc, so với **TB lớp gốc** (Thùy 12/10).
- Bài tập online là **nhật ký hoạt động**, không phải thước đo: tự luyện **không** tính vào mastery (Thùy 17/11, mọi khối).
- **Mastery / nhóm yếu: hiện KHÔNG có màn nào trên app PH** (màn "Thành thạo" bỏ 18/09). Thứ gần nhất phụ huynh thấy là % từng nhóm trong Mục tiêu tuần (§5) và phần Đánh giá của Báo cáo học kì (§6). Luật đang hiệu lực nếu sau này hiện: **một bản mastery, chỉ bài test, tự luyện không tính; học sinh yếu = có ≥ 1 nhóm yếu** (`spec-mastery.md`) — có làm màn hay không: §12.1 câu 4.
- Thông báo đẩy "Con có kết quả buổi mới": khi buổi được đánh dấu **đánh giá xong** (hiện chỉ lớp Toán — §12.2 mục 6).

## 5. Mục tiêu tuần (chỉ phần hiển thị — luật ở `spec-van-hanh-tuan.md` §4)

- Ô **🎯 Mục tiêu tuần** ở trang chủ, theo môn đang chọn. **Chỉ hiện tờ của lớp đã công bố**; chưa công bố ⇒ "Trung tâm đang chốt mục tiêu tuần" (ERP chặn ở policy: tờ nháp không rời ERP).
- **Cùng cấu trúc với ERP và app HS** (Thùy 17–18/11): 3 phần, đầu mục dải màu chữ trắng — **Bài trên lớp** (xanh dương) · **Ôn tập kiến thức** (cam) · **Hoạt động tuần này** (xanh lá).
- Thẻ nhóm 2 dòng: tên nhóm + nhãn **Đạt / Chưa đạt / Chưa đo** (so với mục tiêu tuần, không so với 80) · thanh ngắn, mọi vạch nằm trong thanh (vạch mục tiêu, vạch đầu tuần nét đứt) + "Mục tiêu x% · Tăng a → b%".
- Hoạt động tuần này: BTVN · Test cuối giờ · Test tháng · Bổ trợ sau giờ · Bổ trợ yếu; nút **Chi tiết** chỉ hiện **tên nhóm** của việc — **không % từng dạng** (Thùy 18/11 "phụ huynh thì không cần"). Không có thẻ "bài tính vào tuần sau". Không có chữ "thái độ".
- Xếp hạng: hạng của con / tổng số em + lên xuống so với hôm qua; bấm ⇒ **Top 20** của môn (tên + lớp + % tiến độ). Hạng tính mỗi ngày một lần.
- **Các tuần đã chốt:** biểu đồ tiến độ + bảng nhóm × tuần, tối đa 8 tuần. *(18/11: sổ chốt tuần chưa có dòng nào.)*
- Phụ huynh không làm bài ⇒ không có nút Luyện tập / Xem lý thuyết; chỉ lời nhắc.
- **Xem như phụ huynh** (ERP, nút trên tờ của em): khung điện thoại nhúng trang `/xem-mtt` của app PH; ERP đưa sẵn tờ (kể cả nháp) vào khung; trang này **không đọc DB**, có dải "Bản xem trước".
- Dữ liệu: `mtt_luu` (tờ đang chạy) · `mtt_chot` (sổ đã chốt) · `mtt_top` → 3 view `muc_tieu_tuan_view / _chot_view / _top_view`. Số (18/11): 429 tờ, **163 đã công bố** (phụ huynh đọc được), 4 bảng top.

## 6. Báo cáo học kì

> Nhận trọn `spec-bao-cao-ky.md`. Dưới đây là **luật đang hiệu lực** (dòng nào bị quyết định sau thay thì đã thay, ghi ngày). Khác hẳn báo cáo tháng: không bảng từng buổi, không ET, không 7 chỉ số.

### 6.1 Kì là một đối tượng
- Bảng `ky_hoc`: tên · từ tháng · đến tháng (không cố định độ dài). **Thùy tạo kì.** Mã gốc = `id`, báo cáo bám `id`, không bám tên / tháng. Đổi khoảng tháng sau khi đã công bố ⇒ báo cáo cũ không đổi. Kì đầu tiên: không so sánh với kì trước.
- **Nguồn số liệu thi: chỉ Test tháng và Khảo sát** (`ky_thi` + `diem_thi`). Một "lần thi" = (loại · tháng thi · khối · môn), gom các lớp; Test tháng thi ngày 1–10 tính cho tháng trước.

### 6.2 Bố cục 5 phần, MỘT cột (Thùy 04/11 — "đa số phụ huynh dùng điện thoại"; khung rộng tối đa ~480 px)

| Phần | Nội dung | Luật |
|---|---|---|
| Đầu trang | tên em · môn · lớp / kì / giáo viên (tách dòng) | — |
| **1. Đánh giá** | thẻ **chủ đề**: tên · % · thanh · số lần đánh giá; nút **"Xem chi tiết (n)"** mới mở chuyên đề (tên + số lần + thanh + %). Viên **Cơ bản / Nâng cao** (chuyên đề Đại số) · viên **"Hạng x/y"** trong khối | §6.3 |
| **2. Kết quả thi** | đồ thị **2 đường**: điểm của em (tím) và **TB khối của chính lần thi đó** (cam) · bảng từng lần thi (điểm · TB khối · chênh · hạng) · **hạng cả kì** | §6.4 |
| **3. Thái độ học tập** | số buổi nghỉ (vắng + vắng phép; buổi thường không huỷ) · BTVN theo **nhóm không trùng**, cộng lại = tổng buổi: Đạt chuẩn · Đúng hạn nhưng chưa nghiêm túc · Nộp muộn · Không làm · (Xin phép / Chưa ghi — chỉ hiện khi có) | Đạt chuẩn = nộp đúng hạn **và** không bị ghi chưa nghiêm túc / chống đối |
| **4. Nhận xét** | kết luận · nhận xét theo thang · kế hoạch cải thiện · **điểm năng lực = điểm dự đoán ± sai số** | §6.5 |
| **5. Phụ lục** | bảng điểm các lần thi của **toàn khối** (tên · lớp · điểm từng lần · hạng TB · hạng) | chỉ em **còn học** môn đó (07/11) |

- Nhãn lần thi: Test tháng = "T8", "T9"… (bỏ chữ MT) · khảo sát = "KS1", "KS2"… theo thứ tự trong kì.
- Điểm **2 chữ số** sau dấu phẩy (9,25); hạng TB 1 chữ số. **Bỏ mọi dòng chú thích nhỏ** (Thùy 04/11).
- Chủ đề / chuyên đề **chưa đo** (0 lần trong 60 ngày) ⇒ **không hiện** (Thùy 06/11; lọc lúc dựng, gói chụp vẫn giữ đủ). Hình chưa gắn chủ đề ⇒ một dòng "Hình". *(App PH chưa áp luật này — §12.2 mục 9.)*

### 6.3 Công thức phần Đánh giá (Thùy 04/11, thay luật "20 / 10 câu, 45 ngày")
- Đếm theo **LẦN đánh giá**: 1 buổi ET / BTVN / Test tháng hay 1 bài trên app = 1 lần; điểm một lần = TB các câu của đơn vị trong lần đó. Nguồn câu = nguồn của Dashboard học tập (mọi kênh, mỗi câu nặng như nhau).
- **Chủ đề: 10 lần gần nhất**, trọng số 6-6-4-4-4-4-3-3-3-3 · **chuyên đề: 5 lần**, trọng số 6-4-4-3-3 (lần gần nhất nặng nhất) · cửa sổ **60 ngày** tính lùi từ cuối kì. Chưa đủ số lần ⇒ tính trên số lần có. Cửa sổ cắt theo từng đơn vị.
- Hạng trong khối của từng chủ đề / chuyên đề: xếp trong các em cùng khối × môn có lần đánh giá ở đơn vị đó.
- Viên Cơ bản / Nâng cao = phía đa số độ khó các dạng của chuyên đề (≤ 3 / ≥ 4); hoà ⇒ nâng cao; không dạng nào có độ khó ⇒ không viên.
- ⚠ Công thức này là **của riêng báo cáo kì** (gồm cả BTVN và bài trên app), khác "mastery một bản, chỉ bài test" của `spec-mastery.md` (Thùy 17/11) — có đổi theo không: §12.3.

### 6.4 Hạng
- Hạng + TB từng lần thi: trong các em **đã thi** lần đó, **cùng khối** (Thùy 04/11). Không thi ⇒ không vào mẫu (không cộng 0 điểm).
- **Hạng cả kì = xếp theo HẠNG TRUNG BÌNH các lần đã thi** (Thùy 04/11 giữ, đã biết hệ quả: bỏ một lần thi khó không bị phạt).
- **Top 10 phải thi đủ** (Thùy 06/11): hạng 1–10 chỉ dành cho em thi **≥ 70 % số lần thi** của khối × môn trong kì; mọi em còn lại xếp tiếp sau. **Ngoại lệ:** khối 4T và 5T xếp đủ mọi em (07/11). Em đã nghỉ bị bỏ trước khi xếp.

### 6.5 Nhận xét · điểm năng lực · kế hoạch (Thùy 05/11, thay "giáo viên nhập tay tự do")
- Nhận xét = quá trình học **cả kì**. Khung 4 mục to · 9 mục nhỏ: **Thái độ** (Trên lớp · Về nhà 🤖 · Chủ động) · **Năng lực** (Tiếp thu · Vận dụng) · **Độ ổn định** (Độ chắc kiến thức · Cẩn thận 🤖) · **Tiến bộ** (Về điểm 🤖 · Về cách học).
- Thang **3 mức Tốt / Ổn / Chưa tốt**, mỗi mức nhiều *loại* (mỗi loại = một câu hiện thẳng cho phụ huynh); hoặc "Chưa đủ quan sát". Ô "Nhận xét thêm" không bắt buộc.
- 🤖 = hệ gợi ý mức, giáo viên duyệt / sửa: **Về nhà** — % lần nộp BTVN đạt chuẩn (Tốt ≥ 90 · Chưa tốt < 70) · **Cẩn thận** — sai số (Tốt ≤ 0,75 · Chưa tốt ≥ 1,75) · **Tiến bộ về điểm** — chênh so TB khối nửa sau kì trừ nửa đầu (Tốt ≥ +0,5 · Chưa tốt ≤ −0,5; luôn trong top 20 % ⇒ Tốt). Em < 2 lần thi ⇒ không gợi ý.
- **Điểm dự đoán + sai số:** hệ gợi ý, giáo viên duyệt; bội 0,25. Dự đoán = TB điểm các lần thi, trọng số lần gần nhất 6-4-3-3; sai số = max(0,75; 1,5 × độ lệch chuẩn của chênh so TB từng lần), 1 lần thi ⇒ 1,0. Ý nghĩa cho phụ huynh: điểm cao = học tốt; sai số nhỏ = cẩn thận.
- **Kế hoạch cải thiện:** phương án mẫu theo mục nhỏ (đưa lên đầu phương án của mục bị chấm Chưa tốt / Ổn) + ô viết thêm.
- Danh mục (mục · loại · ngưỡng · phương án) sửa thẳng trên ERP, chỉ quản trị; xoá = kho rác; báo cáo đã công bố giữ chữ trong gói chụp.

### 6.6 Lưu · đóng băng · quy trình công bố
- Bảng `bao_cao_ph_ky`, khoá (học sinh · môn · kì). **Công bố = chụp một gói jsonb TỰ ĐỦ** (mọi số, nhãn, tên, nhận xét). Mở lại báo cáo đã công bố đọc gói chụp, **không tính lại**. Đổi luật sau đó ⇒ phải Mở lại → công bố lại.
- Điều kiện công bố: có điểm dự đoán + sai số + **mọi** mục nhỏ đã chọn.
- **Quy trình (Thùy 18/11): giáo viên nhập → TRƯỞNG KHỐI công bố (đúng môn × khối của mình) → quản trị bật app phụ huynh cho cả kì.** DB chặn bằng trigger (mig `202611181239`): giáo viên, TA, phó khối không công bố / mở lại được. Chi tiết quyền ⇒ `spec-quan-ly-chat-luong.md` §8.
- **Công tắc theo kì** `ky_hoc.mo_ph` (mặc định tắt; mỗi lần đổi có vết): app PH chỉ đọc được báo cáo **đã công bố của kì đang bật** — chặn ngay ở policy của ERP. Tắt không đụng trạng thái công bố.

### 6.7 Hai đầu ra, MỘT gói chụp
- **App PH:** Kết quả học tập › **Báo cáo học kì** → danh sách kì (mọi môn) → trang kéo dọc 5 phần. Có báo cáo mới chưa xem ⇒ bảng hướng dẫn 3 bước + nút "Xem báo cáo ngay" (06/11).
- **PDF gửi Zalo:** `node scripts/bao-cao-ky/dung-pdf.mjs` — đọc gói chụp đã công bố, khổ hẹp cỡ điện thoại **125 × 220 mm**, một cột; phần 2–5 mỗi phần sang trang mới; chuyên đề mở sẵn; phụ lục in đủ dòng; giữ trọn mỗi thẻ trong một trang. Ghi ra ngoài repo (có tên học sinh). **ERP không tạo PDF** (Thùy 04/11).
- **Số (18/11):** 1 kì "Nửa kì 1" (tháng 7 → 10), **app PH đang bật** (từ 09/11 19:18) · 362 báo cáo, **325 đã công bố** (Toán 274 / 311 · KHTN 51 / 51; còn 37 chưa công bố: khối 3 6 · khối 4 7 · khối 5 21 · khối 6 2 · khối 7 1) · DB `bkdemy-ph` đọc thấy đúng 325 dòng / 284 em · 30 ngày: 108 phụ huynh đã mở xem.

## 7. Báo cáo tháng (Report phụ huynh)

- ERP vẫn có màn nhập + công bố + ảnh gửi phụ huynh (năng lực · 7 chỉ số · kết luận · mục tiêu). Số: tháng 9 — 61 / 165 công bố · tháng 10 — 23 / 99 · tháng 11 — 0 / 21.
- **App PH không còn màn nào hiện báo cáo tháng** (bỏ 18/09 cùng "Hồ sơ học tập"); đường đọc `bao_cao_thang_view` còn chạy mỗi lần mở app nhưng không dùng. Còn dùng báo cáo tháng không, có đưa lại lên app không: §12.1 câu 6.

## 8. Nộp BTVN bằng ảnh

- **Phụ huynh chỉ chụp ảnh, không chọn buổi** (Thùy 30/08): ≤ 12 ảnh / lần → máy tự chuẩn hoá (HEIC → JPEG, cạnh dài ≤ 1600) → tải thẳng lên kho ảnh riêng của ERP → ERP **tự gán buổi gần nhất có phiếu BTVN** (`fn_btvn_nop_tao_auto`) → TA chốt buổi, chấm trên ảnh (vẽ đỏ), **trả bài**.
- Phụ huynh thấy **sau khi TA trả**: ảnh đã chấm · trạng thái nộp · thái độ · Đ/C/S từng câu · nhận xét mẫu · nút mở đáp án. Trước khi trả: "chờ chấm". Đáp án chỉ lộ sau khi trả.
- Thông báo đẩy "Bài tập về nhà buổi dd/mm của <tên> đã được chấm" — một lần / bài.
- Em cũng thấy bài đã trả trong Hòm thư app HS (`spec-app-hs.md`).
- **Chấm bằng máy** (đang thử, người bấm chạy — Thùy 17/11): máy gợi ý, TA xác nhận rồi mới trả. Bản chấm đỏ có **điểm** ở góc trang 1; app PH hiện Đ/C/S, **không có ô điểm riêng** — có hiện điểm không: §12.1 câu 3.
- An toàn: máy chủ kiểm con thuộc phụ huynh · đường dẫn ảnh do máy chủ đặt · ảnh ≤ 6 MB, JPEG · role `ph_nop` không đọc được bảng nào · chế độ xem thử không nộp được.
- **Số (18/11):** 106 lượt / 52 em từ 30/08 (70 qua app PH · 36 TA thêm hộ) · 30 ngày: **61 lượt / 39 em, 59 đã trả**.

## 9. Học phí phía phụ huynh

- Ô nhanh ở trang chủ chỉ 2 trạng thái: **Đã hoàn thành** (đã thu / được miễn) · **Chưa hoàn thành**.
- Màn Học phí: danh sách **hoá đơn đã chốt** theo tháng (phiếu ảo trong tháng không lên app) → từng dòng theo con: học phí "N buổi × đơn giá · hệ số" · học đuổi · học liệu · phát sinh · giảm giới thiệu · nợ kì trước → **mã QR chuyển khoản** (số tiền + nội dung = mã phụ huynh + kì) khi chưa thu xong · báo trước hệ số sẽ đổi ở kì sau.
- Luật phía trung tâm (Thùy 17/11, `spec-van-hanh-trung-tam.md` §5): **hạn thu 7 ngày sau báo lần 1** · hoá đơn đã có lần thu không huỷ chốt. App PH **chưa hiện hạn**, và hoá đơn thu một phần vẫn hiện QR **toàn bộ** số tiền — §12.1 câu 8.
- App không ghi nhận thanh toán; trạng thái đổi khi trung tâm ghi thu ở ERP.
- **Số (18/11):** 1.085 hoá đơn — 980 đã thu · 99 chưa thu · 6 thu một phần; **102 / 105 hoá đơn chưa xong đã quá 7 ngày** sau báo lần 1 · 30 ngày: 95 phụ huynh mở màn Học phí.

## 10. Thông báo

| Loại | Khi nào | Nội dung | Nhịp |
|---|---|---|---|
| **Con đã tới lớp** | ô "báo đến" của em có giờ | "🎒 <tên> đã tới lớp <lớp> lúc HH:MM" | quét 2 phút / lần |
| **Kết quả buổi mới** | buổi được đánh dấu đánh giá xong, em có mặt | "Con có kết quả buổi mới" | 30 phút / lần |
| **Thông báo trung tâm** | nhân sự đăng ở ERP › Thông báo phụ huynh (`thong_bao_ph`: loại chung · lịch · thi · nhắc; gửi toàn bộ / khối / lớp / một em; có ngày hiệu lực) | tiêu đề | 30 phút / lần |
| **Bài đã chấm** | TA trả bài nộp ảnh | §8 | 30 phút / lần |
| **Tóm tắt tối** | 20:00, khi con còn "việc cần làm" | "Con còn N việc cần làm" — §12.1 câu 9 | mỗi ngày |

- Trong app: trang chủ hiện 3 tin mới nhất + số chưa đọc; màn **Thông báo trung tâm** hiện đủ. "Đã đọc" nhớ **trên từng máy**, không lưu DB.
- **Giải thưởng tháng** tự sinh một thông báo cá nhân cho phụ huynh em đạt giải (mig ERP `202611151055`): 76 tin / 72 em tháng 10 — hiện là toàn bộ 76 thông báo trong hệ.
- Phải bật thông báo trong ☰; iPhone phải mở từ biểu tượng đã cài.
- **Hệ không tự nhắn Zalo / SMS.** Tin báo ca bổ trợ, báo vắng, báo học phí là việc của người (Lộc / OPS) — ERP chỉ soạn sẵn chữ; Lịch phòng sẽ có nút **"Copy tin báo PH"** theo mẫu (Thùy 17/11, chưa build) ⇒ `spec-van-hanh-trung-tam.md` §3.7.
- **Không có trên app PH:** đăng ký lịch test (đi qua web công khai ⇒ #9) · tủ quà / xu · chat với giáo viên.

## 11. Bảng · view · hàm · quyền (cả hai phía)

### 11.1 ERP → `fdw_bkdemy_web` (38 đối tượng được SELECT, đủ cả hai cổng)

| Nhóm | Bảng / view ERP | View / hàm phía `bkdemy-ph` đọc nó |
|---|---|---|
| Danh tính | `phu_huynh` · `hoc_sinh` · `hoc_sinh_lop` · `lop` | `phu_huynh_live` · `hoc_sinh_live` · `enroll_live` · `mv_ph_owned` · `mv_ph_roster_khoi` · `ph_find_by_phone` |
| Buổi | `buoi_hoc` · `buoi_hoc_hs` · `buoi_danh_gia` · `btvn_ket_qua` · `tai_lieu` | `buoi_view_live` · `buoi_ke_view` · `btvn_view` · `tai_lieu_view` · `buoi_xong_view` · `baoden_view` |
| Chấm | `gami_grades` · `gami_session_problems` · `dai_ban_do` | `et_lop_view` · `mv_ph_et_*` · `mv_ph_btvn_*` · `mastery_measures_view` |
| Thi | `ky_thi` · `diem_thi` | `mv_ph_mt_list` |
| Đáp án | `tai_lieu_phan` · `tai_lieu_cau` · `dai_cau_hoi` · `bai_test` · `bai_test_cau` | hàm `get_dap_an` / `_ph_dap_an_de` (hai bảng `bai_test*` không còn ai đọc) |
| Nộp ảnh | `v_btvn_nop_ph` · `v_btvn_tra_anh` · `v_btvn_tra_cau` · `v_btvn_tra_ket_qua` | `btvn_nop_view` · `btvn_tra_*_view` |
| Tự học | `v_ph_hoc_online` | hàm `fn_ph_hoc_online` |
| Báo cáo | `bao_cao_ph_ky` (**chỉ dòng đã công bố + kì bật**) · `bao_cao_ph` (mọi dòng) | `bao_cao_ky_view` · `bao_cao_thang_view` |
| Mục tiêu tuần | `mtt_luu` (**chỉ tờ đã công bố**) · `mtt_chot` · `mtt_top` | `muc_tieu_tuan_view` · `_chot_view` · `_top_view` |
| Học phí | `hoa_don` · `hoa_don_dong` · `hoc_sinh_he_so` | `hoa_don_view` · `hoa_don_dong_view` · `hoc_sinh_he_so_view` |
| Thông báo | `thong_bao_ph` | `thong_bao_ph_view` · `fn_ph_thong_bao` · `fn_ph_recipients_of_tb` |
| Web tuyển sinh (#9) | `nhan_su` · `phan_cong_lop` · `thoi_khoa_bieu` (+ `lop`, `hoc_sinh_lop`, `muc_hoc_phi`) | `v_lop_tuyen_sinh` |
| **Cấp mà không ai đọc** | `v_btvn_dap_an` (không có bảng ngoại) · policy trên `giai_thuong` (không có grant) | — |

**Kết quả đối chiếu:** DB `bkdemy-ph` có 42 bảng ngoại; **SELECT thử 39 chạy, 3 lỗi quyền** (`erp_live.bai_lam` · `bai_lam_cau` · `bt_grades` — ERP đã thu quyền 01/09, không view / hàm nào đọc ⇒ bảng ngoại chết, vô hại). **Không có bảng nào app PH cần mà ERP chưa cấp.**

### 11.2 Phía `bkdemy-ph` (riêng của app PH)
- Bảng: `push_subscription` · `push_notified` (chống gửi trùng) · `ph_xem` (nhật ký màn).
- 9 matview `mv_ph_*` + `refresh_ph_matviews()`.
- Lịch (`pg_cron` của `bkdemy-ph`, gọi về app): `refresh_ph_matviews` 5 phút · `bkph-checkin` 2 phút · `bkph-push` 30 phút · `bkph-digest` 20:00.
- Hàm quản trị cho ERP gọi: `admin_parent_usage` · `admin_parent_usage_tong` · `admin_ph_auth_user_id` (đặt lại mật khẩu) + các route `/api/admin/*`.

### 11.3 Phía ERP (phục vụ app PH)
- Báo cáo kì: `ky_hoc` · `ky_hoc_mo_ph_log` · `bao_cao_ph_ky` (+ `_log`) · `fn_bc_ky_*` · `_bc_ky_mo_ph` · trigger `trg_bao_cao_ph_ky_truoc` (khoá sau công bố) · `trg_bao_cao_ph_ky_quyen_cong_bo` (18/11).
- Nộp ảnh: `btvn_nop` · `btvn_nop_anh` · kho ảnh `btvn-nop` · `fn_btvn_nop_tao_auto` · `fn_btvn_tra_bai`.
- Màn ERP: Report phụ huynh (Tháng | Học kì) · Thông báo phụ huynh · Đăng nhập Phụ huynh (kèm Xem app) · Mục tiêu tuần › 📱 Xem như phụ huynh.

## 12. Lệch + câu hỏi

### 12.0 THÙY CHỐT 18/11 (thắng mọi "đề xuất" ở 12.1 và mọi dòng thân spec còn trái)

| Câu | Thùy trả lời | Luật | Việc code (chờ lệnh) |
|---|---|---|---|
| 1 | **"Hiện luôn"** | Điểm Test cuối giờ / BTVN từng buổi **hiện cho phụ huynh ngay khi TA nhập** (như đang chạy) — không chờ buổi đánh giá xong. | — |
| 2 | **"Hiện hết, không cần giấu"** | Tab "Cả lớp" giữ nguyên: hiện tên + kết quả + nhận xét của cả lớp. | — |
| 3 | OK | Điểm BTVN do máy chấm: **chờ hết giai đoạn thử máy chấm rồi quyết**; khi chạy ổn thì hiện điểm cạnh bản chấm đỏ sau khi TA xác nhận + trả. | — |
| 4 | **"Không cần, mục tiêu tuần là đủ"** | KHÔNG làm màn "nhóm kiến thức con đang yếu". | — |
| 5 | OK | Màn "Test tháng" **có hiện bài Khảo sát**, nhãn "KS1". | thêm khảo sát vào màn |
| 6 | **"Có. Có báo cáo là đẩy lên thôi"** | **Báo cáo THÁNG vẫn làm; báo cáo nào đã công bố thì hiện trên app phụ huynh.** (App bỏ màn này từ 18/09 ⇒ phải đưa lại.) Đề xuất "dừng báo cáo tháng" của CTO bị bác. | đưa lại màn báo cáo tháng lên app; ERP chỉ cấp dòng ĐÃ công bố cho FDW (hiện cấp cả nháp) |
| 7 | OK | Trang chủ có ô **"Lịch của con"**: 14 ngày tới — buổi học theo TKB + mọi ca bổ trợ (sau giờ · yếu · bù · đuổi), kèm giờ, phòng. | màn lịch |
| 8 | OK | Học phí hiện **hạn thanh toán** (7 ngày sau báo lần 1), quá hạn tô đỏ; hoá đơn thu một phần hiện **số còn lại** và QR đúng số còn lại. | sửa lỗi QR (6 hoá đơn đang sai số tiền) + hạn |
| 9 | **"Bỏ"** | **Tắt tin đẩy 20:00 "Con còn N việc cần làm".** | tắt job |
| 10 | OK | **Mật khẩu lần đầu = mã riêng từng phụ huynh** (in trên phiếu học phí / Lộc gửi Zalo), bỏ `123456` chung. | sinh mã + đổi luồng tạo tài khoản và reset |
| Báo cáo học kì — phần Đánh giá | **"Chỉ tính test nhé"** | Phần Đánh giá của báo cáo học kì theo đúng luật mastery 17/11: **CHỈ bài TEST** (không BTVN luyện, không bài trên app loại luyện, không tự luyện). Code đang gồm cả BTVN + bài app. | sửa hàm tính báo cáo kì; kì đã công bố giữ bản đã chụp, không tính lại |

### 12.1 Câu hỏi gốc (ĐÃ TRẢ LỜI ở 12.0 — giữ làm bối cảnh)

**1. Điểm Test cuối giờ / BTVN từng buổi: phụ huynh thấy ngay khi TA nhập, hay chờ buổi "xong"?**
Ví dụ: 20:30 TA nhập Test cuối giờ cho em Thao 7B2, lỡ tay 2/5 câu đúng. 5 phút sau mẹ Thao mở app thấy 40 %, chữ đỏ (thấp hơn TB lớp), hạng khối tụt. Sáng hôm sau TA sửa thành 4/5 — app đổi thành 80 %.
(a) Giữ như hiện nay: nhập xong 5 phút là phụ huynh thấy. (b) Chỉ hiện khi buổi đã được đánh dấu **đánh giá xong** (đúng lúc app bắn thông báo "Con có kết quả buổi mới"); trước đó ghi "đang chấm".
Đang chạy: (a). **Đề xuất: (b)** — khớp nguyên tắc "số phụ huynh thấy là số đã chốt", và thông báo với màn nói cùng một lúc.

**2. Tab "Cả lớp": phụ huynh có được thấy tên + kết quả + nhận xét của các bạn khác không?**
Ví dụ: mẹ Thao mở buổi 08/11, tab Cả lớp thấy cả 18 bạn 7B2: họ tên đầy đủ, đúng / sai từng câu, Mức 1–5 và **lời nhận xét giáo viên viết cho từng bạn**.
(a) Giữ nguyên. (b) Giữ bảng nhưng ẩn tên bạn khác ("Bạn 1, Bạn 2…"), bỏ cột nhận xét của bạn khác; chỉ dòng của con hiện đủ. (c) Bỏ tab, chỉ ghi "con đứng thứ x / 18 của lớp".
Đang chạy: (a). **Đề xuất: (b)** — phụ huynh vẫn thấy con so với lớp, không lộ nhận xét riêng của em khác. *(Phụ lục báo cáo học kì có tên toàn khối là Thùy đã chốt 04/11 — không hỏi lại.)*

**3. Bài tập về nhà do máy chấm: có hiện ĐIỂM cho phụ huynh không?**
Ví dụ: bài của em An 6S2 máy chấm 7,5; TA xác nhận rồi trả. Ảnh chấm đỏ đã có số 7,5 ở góc; trong app phụ huynh chỉ thấy đúng / sai từng câu, không có dòng "Điểm: 7,5".
(a) Không hiện ô điểm riêng (như hiện nay) — và bỏ luôn số điểm trên ảnh cho nhất quán. (b) Hiện điểm cạnh bản chấm đỏ, chỉ sau khi TA xác nhận + trả. (c) Chờ hết giai đoạn thử máy chấm rồi quyết.
Đang chạy: ảnh có điểm, app không có ô điểm. **Đề xuất: (c)** — đang thử, TA còn sửa 9 / 90 câu máy chấm; khi chạy ổn thì (b).

**4. Phụ huynh có cần một màn "con đang yếu nhóm kiến thức nào" không?**
Ví dụ: em Nhật 7S2 đang có 2 nhóm yếu (trung tâm thấy ở Dashboard, đã xếp bổ trợ). Bố Nhật mở app: không có chỗ nào ghi 2 nhóm đó, trừ khi tuần này tờ Mục tiêu tuần có chúng.
(a) Không làm — Mục tiêu tuần + Báo cáo học kì là đủ. (b) Thêm màn "Nhóm kiến thức cần củng cố" đọc đúng số trung tâm đang dùng (chỉ bài test, một bản) + ghi con đã được xếp bổ trợ chưa.
Đang chạy: không có màn (bỏ 18/09). **Đề xuất: (a) lúc này**; khi làm lịch bổ trợ trên app (câu 7) thì ghi tên nhóm yếu ngay trong dòng lịch.

**5. Màn "Test tháng" có hiện bài Khảo sát không?**
Ví dụ: 120 ngày qua có 1 bài khảo sát Toán (52 em có điểm). Phụ huynh mở Test tháng chỉ thấy T8, T9, T10; điểm khảo sát chỉ xuất hiện trong Báo cáo học kì (KS1).
(a) Thêm khảo sát vào cùng màn, nhãn "KS1". (b) Giữ: màn này chỉ Test tháng. *(Câu này đã hỏi một lần — HANDOFF ERP ghi "đã hỏi, chưa trả lời".)*
**Đề xuất: (a)** — cùng nhãn với báo cáo kì, phụ huynh không phải chờ cuối kì mới thấy.

**6. Báo cáo THÁNG gửi phụ huynh: còn làm không, có lên app không?**
Ví dụ: tháng 10 giáo viên nhập 99 báo cáo, công bố 23; tháng 11 nhập 21, công bố 0. App phụ huynh từ 18/09 không còn màn nào hiện báo cáo tháng — phụ huynh chỉ nhận ảnh qua Zalo nếu có người gửi.
(a) Dừng báo cáo tháng; phụ huynh theo dõi bằng Mục tiêu tuần (hằng tuần) + Báo cáo học kì. (b) Giữ, chỉ gửi ảnh Zalo, không lên app. (c) Giữ và đưa lại lên app.
**Đề xuất: (a)** — tỉ lệ công bố đang tụt dần (61 → 23 → 0), hai sản phẩm kia đã thay vai trò.

**7. Lịch của con trên app phụ huynh đặt ở đâu?**
Ví dụ: em Thao có ca bổ trợ sau giờ thứ Năm 19:30 phòng 302. Hiện mẹ Thao chỉ thấy dòng đó nếu mở Mục tiêu tuần **và** lớp đã công bố tờ tuần; app không có lịch học thường, không có ca bù / đuổi.
(a) Thêm ô **"Lịch của con"** ở trang chủ: 14 ngày tới — buổi học theo thời khoá biểu + mọi ca bổ trợ (sau giờ · yếu · bù · đuổi) kèm giờ, phòng. (b) Chỉ giữ trong Mục tiêu tuần.
**Đề xuất: (a)** — đúng ý Thùy 17/11 "ca sau giờ hiện trong lịch trên app", và lịch không nên phụ thuộc việc tờ tuần đã công bố hay chưa.

**8. Học phí: có hiện HẠN thanh toán và số CÒN LẠI không?**
Ví dụ: hoá đơn tháng 10 của nhà chị Hạnh 2.400.000 đ, báo lần 1 ngày 03/11, đã chuyển 1.000.000 đ. App hiện "Thu một phần" + mã QR **2.400.000 đ**, không ghi hạn.
(a) Hiện "Hạn: 10/11" (7 ngày sau báo lần 1), quá hạn tô đỏ; hoá đơn thu một phần hiện "Còn lại 1.400.000 đ" và QR đúng số còn lại. (b) Giữ như hiện nay.
Đang chạy: (b); 102 / 105 hoá đơn chưa xong đã quá 7 ngày. **Đề xuất: (a).** *(QR sai số tiền khi đã thu một phần là lỗi, nên sửa dù chọn gì — 6 hoá đơn đang dính.)*

**9. Tin đẩy 20:00 "Con còn N việc cần làm": tắt hay giữ?**
Ví dụ: tối 17/11 phụ huynh nhận "Con còn 2 việc cần làm" (BTVN chưa nộp, làm lại câu Test cuối giờ sai). Bấm vào thì về trang chủ — màn "Việc cần làm" đã bỏ từ 18/09 ("phụ huynh mở app để xem con, không nhận việc"). Tin chỉ tính lớp Toán.
(a) Tắt. (b) Giữ, bấm vào mở thẳng Mục tiêu tuần › Hoạt động tuần này, tính mọi môn.
Đang chạy: vẫn gửi mỗi tối (1.029 tin tới nay). **Đề xuất: (a)**; nếu muốn nhắc thì nhắc theo Mục tiêu tuần sau.

**10. Mật khẩu lần đầu của phụ huynh: giữ `123456` chung, hay phát mã riêng?**
Ví dụ: số điện thoại của một phụ huynh chưa từng mở app (khoảng 135 / 411 người). Bất kỳ ai biết số đó gõ `123456` là vào được, tự đặt mật khẩu mới, xem điểm + học phí của con, và phụ huynh thật bị khoá ngoài.
(a) Giữ như hiện nay. (b) Mật khẩu đầu = mã riêng từng phụ huynh, in trên phiếu thông báo học phí / Lộc gửi qua Zalo.
**Đề xuất: (b).**

### 12.2 Lệch kỹ thuật (không cần Thùy quyết logic — làm khi có lệnh)

1. **Ba role ngoài còn quyền gọi ~437 hàm ERP** (`fdw_bkdemy_web` 437 · `ph_nop` 438 · `web_lead_writer` 436; 127–129 hàm `security definer`). Mig `202611131750` khi đóng quyền PUBLIC đã cấp lại tường minh cho ba role này để "giữ nguyên". Tài liệu ghi "`ph_nop` chỉ gọi được 1–2 hàm" ⇒ **không đúng với DB**. Cần thu về đúng danh sách: `ph_nop` 2 hàm nộp · `fdw_bkdemy_web` chỉ `_bc_ky_mo_ph` · `web_lead_writer` 0.
2. **`lib/admin-auth.ts` coi mọi phiên đăng nhập ERP hợp lệ là quản trị** ⇒ các route đặt lại mật khẩu phụ huynh, tạo đường dẫn xem thử, xem thống kê mở cho mọi tài khoản ERP (kể cả tài khoản học sinh nếu chung hệ đăng nhập). Đã nằm trong nợ "đợt 0" của HANDOFF ERP.
3. **Khoá `service_role` của ERP nằm trên Vercel app PH** (để ký đường dẫn ảnh). Thùy 09/09 chốt giữ trong giai đoạn thử; kế hoạch thay bằng tài khoản máy chỉ đụng kho ảnh `btvn-nop` (~0,5 ngày) chưa làm.
4. **Code chết còn chạy mỗi lần mở app:** `lib/parent-data.ts` vẫn đọc `mastery_measures_view` (tới 20.000 dòng / lượt) + `bao_cao_thang_view`, rồi tính "thành thạo" và "việc cần làm" bằng JS (`lib/ket-qua.ts`, `lib/tasks.ts`) — **không màn nào hiện**. Công thức trong đó là bản cũ (5 lần, trọng số ET 2 / MT 3 / BTVN 1, chỉ bản đồ Đại cũ) — trái `spec-mastery.md` và CLAUDE §2.0. Gỡ.
5. **Công thức % buổi tồn tại hai nơi:** matview (SQL) và JS (`parent-data.ts`, `report.ts` tự đếm chuỗi Đ/C/S). Phải còn một nguồn ở DB.
6. **Gõ cứng môn Toán** (trái CLAUDE §1.6): thông báo "kết quả buổi mới" chỉ lớp Toán · tóm tắt tối chỉ Toán · báo cáo tháng chỉ đọc Toán · đáp án chỉ kho Đại số (Hình, KHTN, Lý, Hoá không có đáp án).
7. **`bao_cao_ph` (báo cáo tháng) cấp cho FDW mọi dòng**, kể cả nháp; chỉ view phía app PH lọc "đã công bố" — ngược luật §1.3 mục 4.
8. **Matview 5 phút đọc thẳng bảng chấm lớn của ERP qua FDW** (288 lượt / ngày, cả giờ 17–22 h học sinh dùng app). Hướng đúng theo `spec-kien-truc.md`: ERP tính sẵn một bảng hẹp (đăng ký bộ điều phối), app PH chỉ đọc — như đã làm với Mục tiêu tuần. Chưa đo chi phí thật phía ERP.
9. **Báo cáo học kì trên app PH còn hiện đơn vị "chưa đo"** — luật 06/11 (không hiện) mới áp ở ERP xem trước + PDF.
10. **Thừa quyền / bảng chết:** ERP cấp `v_btvn_dap_an` + policy `giai_thuong` cho FDW nhưng không ai đọc · `bkdemy-ph` còn 3 bảng ngoại chết + `erp_live.bai_test`, `bai_test_cau` không ai đọc · 4 bảng đồng bộ cũ + bảng `phu_huynh` / `hoc_sinh` cục bộ (298 / 235 dòng) không còn dùng. *Không xoá khi chưa có lệnh (Luật xoá).*
11. **Repo app PH:** migration không có sổ (không biết file nào đã áp nếu không hỏi DB) · hai cặp trùng số (`0024_*` ×2, `0037_*` ×2) · `0024_bao_cao_thang…` + `0025_…` **chưa commit** dù view đã chạy trên DB · bản trên máy công ty sau `origin/main` 14 commit.
12. **Tài liệu cũ nói sai hiện trạng:** HANDOFF app PH ghi "thông báo 1 lần / ngày (Vercel Hobby)" — thật là 30 phút / lần qua `pg_cron`; ghi "tóm tắt tối chưa làm" — thật đang chạy; ghi "mig 0038 chưa áp" — thật đã áp · `spec-van-hanh-tuan.md` dòng "app PH chưa xây (kiểm 17/11)" đã cũ · `spec-van-hanh-trung-tam.md` §3.7 ghi phụ huynh thấy lịch bổ trợ qua `fn_hs_lich_bo_tro` — hàm đó chỉ app HS gọi, app PH chưa có màn lịch.
13. **Sổ chốt tuần `mtt_chot` = 0 dòng** ⇒ "Các tuần đã chốt" trên app PH đang trống (chưa có lượt chốt tuần nào chạy, hay lượt chốt lỗi — cần soát ở phía Vận hành tuần).
14. **Lần mở app đầu chậm 3–5 s** do máy chủ Vercel ngủ (không phải DB) — hai phương án đã nêu 18/09 (gọi giữ ấm miễn phí / nâng gói), chưa chọn.

### 12.3 Còn mở từ `spec-bao-cao-ky.md` mục B (chưa ai chốt — không gấp)
- Phần Đánh giá của báo cáo kì có đổi sang "chỉ bài test" như mastery (Thùy 17/11) không, hay giữ công thức riêng gồm cả BTVN + bài trên app (§6.3).
- Có thêm hạng theo **hệ** vào báo cáo kì không · phụ lục gộp Test tháng và Khảo sát một bảng hay hai · kì kết thúc nhưng công bố muộn thì cửa sổ 60 ngày lùi từ cuối kì hay từ ngày công bố (đang: cuối kì).
- Ai được **bật app phụ huynh cho cả kì** — hiện "quản trị", chưa rà quyền ở DB (`spec-quan-ly-chat-luong.md` §11.2).
- Màn ERP vẫn hiện nút Công bố cho mọi người (bấm sẽ bị DB từ chối) — ẩn nút theo quyền.

## 13. Khi Thùy duyệt

1. Bỏ dòng "BẢN NHÁP", ghi ngày chốt + bảng trả lời 10 câu (§12.0, thắng thân spec).
2. `git mv spec-bao-cao-ky.md _luu-tru/` · thêm dòng vào `SPEC-INDEX.md` bảng B (`spec-bao-cao-ky.md` → `spec-app-ph.md` §6 · `spec-quan-ly-chat-luong.md` §8) · đánh dấu ✅ dòng #13 bảng A.
3. `CLAUDE.md` §7: thêm dòng "`spec-app-ph.md` — ĐỌC BẮT BUỘC trước khi sửa app phụ huynh, báo cáo học kì, hoặc **đổi quyền / cấu trúc bảng mà `fdw_bkdemy_web` · `ph_nop` đọc**".
4. Sửa các chỗ trỏ: `spec-quan-ly-chat-luong.md` (dòng "GIỮ ở gốc: `spec-bao-cao-ky.md`") · `spec-van-hanh-tuan.md` (dòng "app PH chưa xây") · `spec-van-hanh-trung-tam.md` §3.7.
5. **Repo `bkdemy-ph-app` (việc phải làm ở repo đó, chưa làm):** thêm đầu `HANDOFF.md` một dòng "Spec của app phụ huynh nằm ở `bkdemy-erp-v2/spec-app-ph.md` — đọc trước khi sửa; file này chỉ còn ghi trạng thái deploy + cạm bẫy kỹ thuật" · sửa 3 chỗ HANDOFF sai hiện trạng (§12.2 mục 12) · commit 2 file migration đang treo.
6. `docs/SYNC_CONTRACT.md` của repo app PH: ghi rõ "đã thay bằng FDW, chỉ còn giá trị lịch sử".
7. Việc code / DB ở §12.1 + §12.2: **chỉ làm khi có lệnh**, từng mục một.
