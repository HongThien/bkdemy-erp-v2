# spec-tro-giang.md — TRỢ GIẢNG: quy trình TA · chấm · chấm công · hiệu suất · bot Telegram · app TA (spec #10 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** (trả lời 12 câu — bảng §12.0, thắng mọi "đề xuất" ở §12.1 và mọi dòng thân spec còn trái). Spec này là nguồn đúng; `spec-hieu-suat-ta.md` · `spec-bot-telegram-ta.md` · `spec-quy-tac-cham.md` đã chuyển `_luu-tru/`. **`spec-cham-cong-ta.md` GIỮ ở gốc** tới khi spec #11 nhận phần công thức lương.
> Việc code / DB từ các quyết định chỉ làm khi Thùy ra lệnh.
> **Gộp từ:** `spec-cham-cong-ta.md` (trọn, trừ công thức lương ⇒ #11) · `spec-hieu-suat-ta.md` (trọn, sửa theo quyết định 05/11) · `spec-bot-telegram-ta.md` (trọn, sửa theo chốt 15/10) ·
> `spec-quy-tac-cham.md` (trọn — giữ số mục A1–A9 vì lệnh `/cham-btvn-hang-doi` trỏ theo số) · `_luu-tru/PLAN-app-ta.md` · `_luu-tru/spec-test-online.md` (phần chấm, báo sai) ·
> `.claude/commands/cham-btvn-hang-doi.md` · `spec-bo-tro.md` §5–§7, §13 (phần việc của TA trong ca) · `spec-builder.md` §10.2 · HANDOFF (mục chấm công · bot Telegram · sơ đồ tổ chức · app TA) ·
> DEVLOG 06/09 → 17/11 (quyết định có ngày, ghi `(Thùy dd/mm)`) · `_luu-tru/BKDEMY_GIAOVIEC_HIEUSUAT_SPEC.md` (chỉ đọc lịch sử — nghiệm thu chất lượng tay đã thay bằng hiệu suất theo gậy 08/10).
> **Đối chiếu DB 17/11** (chỉ đọc: `pg_proc`, `pg_trigger`, `pg_constraint`, `pg_get_functiondef`, đếm dòng). Số trong file là số ngày 17/11, "30 ngày" = 18/10 → 17/11. Chỗ DB / code lệch nguồn ⇒ **không sửa**, ghi §12.
>
> **Ranh giới (chỉ trỏ, không chép):**
> công thức đo, bài nào tính mastery ⇒ `spec-mastery.md` §2, §4 · mức L1–L4, đề xuất – duyệt, vòng đời case, chọn câu ⇒ `spec-bo-tro.md` ·
> soạn / in / phát hành ET · MT · BTVN, mã đề, nối ô chấm ↔ câu ⇒ `spec-builder.md` §4–§6, §10 ·
> xếp lịch, phòng, ca trực, điểm danh buổi thường (OPS), báo phụ huynh ⇒ **#8** `spec-van-hanh-trung-tam.md` ·
> **đơn giá, công thức lương, bảng gậy, chốt tháng ⇒ #11** `spec-luong-gay.md` (ở đây chỉ ghi điểm nối §7.7, §8.5) ·
> trưởng khối duyệt / hậu kiểm, sơ đồ tổ chức, Phòng làm việc ⇒ **#6** · nhịp tuần, Báo cáo tuần ⇒ `spec-van-hanh-tuan.md` · app PH xem bài chấm ⇒ #13.

---

## 0. Đích

- Một câu spec này phải trả lời được: **buổi X của lớp Y — TA phải làm gì, hạn lúc nào, đã làm chưa, làm có đúng không, và được ghi công thế nào.**
- **Việc không phải là dòng trong bảng** (CLAUDE §1, §4): việc của TA = (thứ phải có) trừ (thứ đã có). Không có bảng việc, không có dòng chờ. Sửa điểm danh / đổi phân công ⇒ việc tự tính lại.
- **Chấm công là lời khai, ERP là bằng chứng, máy đối chiếu, người duyệt chỉ nhìn chỗ lệch** (Thùy 12–13/10; kế toán gọi *three-way match* + *management by exception*).
- **Giao việc cho cấp thấp nhất làm tốt** (CLAUDE §6): máy chấm gợi ý → TA xác nhận → GV / trưởng khối xử lý chỗ khó. Máy **không** tự ghi điểm, không tự đánh gậy.
- Mọi con số (hạn, trễ, hiệu suất, công, giờ) tính ở Postgres; app TA chỉ gọi hàm và vẽ (CLAUDE §2.0).

## 1. TA là ai · phạm vi

- **TA** = nhân sự có dòng `phan_cong_lop` vai `tg`. **TA chính** của lớp = dòng `la_chinh`. Hiện: **23 TA đang làm, 48 lớp**; trong đó **7 người là GV kiêm TA**.
- **GV kiêm TA** (Thùy 15/10; `_la_gv_kiem_ta` = có phân công GV ở ≥ 1 lớp): **không chấm công, không nhận lương TA**, không có dòng chấm công trong bản tin; việc chấm ET / BTVN của lớp mình vẫn tính như TA.
- **Tổ chức** (Thùy 15/10: *"phân công là PHẠM VI, chức danh về SƠ ĐỒ TỔ CHỨC"*): Quản lý trợ giảng → **Trưởng khối** (GV) → **Phó khối** (TA tốt, chỉ xem) → TA. TA có một ô dưới Trưởng của **mỗi khối mình có lớp**. Chi tiết ⇒ #6. Bảng `phan_cong_khoi` không còn ai đọc.
- **Phạm vi của TA = lớp được phân công**, mang nhãn môn của lớp (CLAUDE §1.6). Không có "TA của khối".
- **Hai luật thời gian — hay nhầm:**
  1. **Phân công tính TỪ NGÀY PHÂN CÔNG, không đẻ dữ liệu phía trước** (Thùy 14/10). Mọi chỗ cần "lớp của TA ngày D" đọc `_ta_tg_tai(ngày, lớp, TA)` (dựng từ `phan_cong_lop_log`, trigger `phan_cong_lop_log_trg`). Cấm đọc `phan_cong_lop` hiện tại cho ngày quá khứ.
  2. **Việc đã tới hạn thuộc người phụ trách LÚC HẠN** (Thùy 04/11): mọi chỗ **đánh giá người** (hiệu suất, gậy, Báo cáo tuần, Phòng, Trợ lý) đọc `fn_viec_buoi_thuong_lh` (bản chụp bất biến `viec_phu_trach_snap`). Chỗ **hành động** ("Việc của tôi", push, bản tin Telegram) đọc phân công hiện tại — có chủ ý.
- **Việc KHÔNG phải của TA:** điểm danh buổi thường (OPS, một người chịu trách nhiệm — CLAUDE §5; ⇒ #8) · đánh giá sau buổi thường (GV) · **chấm bài trên lớp** (bỏ hẳn, không còn là việc của ai: TA từ 15/10, GV từ 28/10; áp cho buổi từ 01/10) · chấm MT (Phó / Trưởng khối, §3.4) · soạn tài liệu (GV, builder).

## 2. Việc quanh một buổi · "Việc của tôi" · hạn

### 2.1 Một buổi thường — TA làm gì

| Lúc | Việc | Ghi ở đâu |
|---|---|---|
| Trước buổi | **BTVN của buổi trước phải chấm xong** (hạn = 2 giờ trước giờ vào lớp) · Checkin | §3.5 · §7 |
| Trong buổi | Trợ giảng lớp (ghi công) · thu bài · cho làm ET (mỗi buổi **đúng một** ET — `spec-builder.md` §4) | §7 |
| Sau buổi | **Chấm ET** (36 giờ) · bấm 🚨 nếu em kém hẳn một dạng · Checkout | §3.3 · §5.3 |
| Buổi sau | Thu + **chấm BTVN** của buổi này | §3.5 |

### 2.2 Bảng việc của TA (thuần suy — nguồn buổi thường `fn_viec_buoi_thuong_loc`)

| Việc | Sinh ra khi | Của ai | Hạn | Xong khi |
|---|---|---|---|---|
| **Chấm ET** | Buổi `thuong` không huỷ, **không có MT** | Mọi người vai `tg` của lớp | **36 giờ từ giờ BẮT ĐẦU buổi** (Thùy 06/09) | `buoi_hoc.et_dong_at` có giá trị. Buổi có ET trên app ⇒ nhãn "Xác nhận ET (online)" |
| **Chấm BTVN** | như trên | như trên | **2 giờ trước giờ bắt đầu buổi kế tiếp của lớp** (Thùy 04/09 + 12/11; = hạn nộp của HS; lệch theo lớp × thứ ở `han_nop_ngoai_le`) | `btvn_dong_at`. Khối 10–12 làm trên app: **máy tự đóng đúng giờ hạn** (Thùy 04/11) |
| **Chấm MT** | Buổi có đề MT (`tai_lieu.loai = 'mt_buoi'`) — **thay hẳn** ET · BTVN · đánh giá của buổi đó | Phó khối (không có ⇒ Trưởng khối) theo môn × khối; không có ai ⇒ GV chính của lớp | **72 giờ** từ giờ bắt đầu ca thi (Thùy 06/09) | `mt_dong_at` |
| Chấm ET (bù) · Đánh giá buổi bù | Buổi `bu` còn em có mặt hoặc chưa điểm danh | Người đứng ca (`nguoi_day_tg`, thiếu ⇒ `nguoi_day`) | ET: 12:00 hôm sau · đánh giá: 23:59 ngày ca | `et_dong_at` · `danh_gia_xong_at` |
| Chấm BTVN bù | Em học bù có mặt, buổi mẹ có BTVN, chưa có kết quả | **TA lớp của em** (không phải người đứng ca bù — Thùy 29/09) | `_bu_btvn_han` | Đã chọn trạng thái nộp |
| Hoàn tất ca bổ trợ yếu | Ca `bo_tro_yeu` có em không vắng | Người đứng ca | 23:59 ngày ca | `danh_gia_xong_at` |
| Nhập Đ/C/S sau giờ | Ca `bo_tro_nhe` đã in test | TA của ca (`ca_bo_tro_nhe.ta_id`) | trong tuần (thứ Hai reset) | Nộp test |
| Đánh giá buổi đuổi | Buổi `bo_tro_duoi` | Người đứng ca | 23:59 ngày ca | `danh_gia_xong_at` |
| Điểm danh + hoàn tất ca ôn thi | Ca `bo_tro_on_thi` | Người đứng ca | — | `fn_onthi_ca_hoan_tat` |
| Ghi công · khai giờ ra | Buổi / ca đã kết thúc chưa có phiếu công · ca quên checkout | TA phụ trách **tại ngày đó** | 24 giờ sau khi việc kết thúc | Có phiếu công / có giờ ra (§7) |

- **Buổi 0 em có mặt (đã điểm danh xong) ⇒ không sinh việc** (không áp dụng, không phải "chưa xong") — sửa 16/07 sau ca "HS báo vắng mà việc ET không tự mất".
- **Khoá của một việc** = `ref_key` `vh:<buổi>|<khâu>|<nhân sự>` — sinh ở DB, dùng chung cho Việc của tôi · gậy · hiệu suất · bản tin (không ghép chuỗi lần hai).
- **Trễ đo theo LẦN ĐÓNG ĐẦU TIÊN** (Thùy 08/10; `_viec_dong_dau`, `fn_viec_tien_do`): mở lại để sửa rồi đóng lại **không** thành trễ. Lịch sử đóng / mở do trigger `trg_buoi_hoc_phase_log` ghi vào `buoi_hoc_phase_log` (có từ 23/09).
- **Việc đã xong** mặc định chỉ hiện 2 tuần gần nhất (Thùy 13/11); việc chưa xong luôn hiện đủ.
- **Số hiện tại (17/11, việc tồn tới hết hôm qua):** BTVN 45 việc / 21 TA (cũ nhất 10/10) · BTVN bù 41 / 13 TA · ET 4 · bù 3 · đuổi 3 · ca yếu 2 · **thiếu công 172** (buổi 41 · ca trực 83 · bổ trợ 48; cũ nhất 01/10) · quên checkout 24.
- **30 ngày, buổi thường đã đóng:** ET 392 buổi, **364 đúng hạn** · BTVN 350 buổi, **174 đúng hạn** (tính theo lần đóng cuối); BTVN được **mở lại 399 lần**, ET 26 lần.

### 2.3 Nhắc việc
- **Bubble đỏ** trên app TA = số việc đang nợ từng mục (push cập nhật badge do trigger `trg_ta_buoi_hoc_push_badge` khi buổi đổi mốc đóng).
- **Push 23:30 mỗi tối** (`api/ta-nhac-viec.mjs`, `fn_ta_push_dem`) · **bản tin Telegram 08:00** (§9).

## 3. Chấm ET · MT · BTVN

### 3.1 Lưới chấm — một sự thật, ba giao diện
- **Ô** = một câu của buổi theo khâu: `gami_session_problems` (`phase` `et` · `mt` · `btvn`; `ingame` là di tích). **Nối ô ↔ câu bằng `ma_cau`, không bằng vị trí** — luật + bài học ET 5A2 ở `spec-builder.md` §10.2. Mở tab chấm là hệ tự đối chiếu lưới với đề (`syncDocProblems`): câu mới thêm ô, ô mất câu chưa có điểm thì bỏ, ô mất câu **đã có điểm thì giữ + cảnh báo**; cảnh báo so **nội dung** (bộ mã câu).
- **Kết quả** = `gami_grades`, một dòng = (em × ô), duy nhất theo `(problem_id, hoc_sinh_id)`. **Dòng chỉ ra đời khi có kết quả thật**; bấm lại ô đang chọn = xoá dòng (chưa chấm = không có dòng — CLAUDE §1.5).
- Ba giao diện ghi **cùng** bảng qua cùng seam `src/lib/gami.ts`: ERP `gami/BuoiHocScreen.tsx` · app TA `ta/ChamBuoi.tsx` + `ta/ChamBtvn.tsx` · app GV `gv/ChamBuoiGv.tsx` (GV chỉ **xem** điểm ET).
- Thay đổi ở `gami_grades` tự đánh dấu em cần tính lại mastery (`trg_mastery_ban_*`).

### 3.2 Đ / C / S
- Ba kết quả: **Đ** `correct` · **C** `partial` · **S** `wrong` (CHECK). Định nghĩa + khi nào C ⇒ §3.7 A1.
- ET / BTVN: TA **chỉ chọn Đ/C/S** (một chạm; "Tất cả Đ" cho một em rồi sửa câu sai). Điểm số do DB tính (§3.7 A2).
- 30 ngày: BTVN 26.703 ô (Đ 77 % · C 12 % · S 12 %; 5.003 ô do app tự chấm) · MT 10.103 ô · ET 8.148 ô (Đ 71 % · C 15 % · S 14 %; 542 ô từ ET trên app).

### 3.3 Chấm ET
- ET giấy: TA nhập Đ/C/S từng (em có mặt × câu). ET trên app (30 ngày: 18 buổi): máy chấm, kết quả đổ vào lưới (`fn_et_online_dong_bo` — nối theo `ma_cau`, **không đè ô TA chấm tay**, không đụng khâu đã đóng); TA chỉ bấm xác nhận.
- **Đóng ET** = `fn_dong_phase(buổi, 'et')`, một transaction:
  1. **Đúng thứ tự ngày**: còn buổi trước của lớp chưa đóng ET ⇒ từ chối (Elo tính tuần tự).
  2. **Đủ ô**: mọi em `co_mat` × mọi câu phải có kết quả (trừ buổi ET trên app) ⇒ thiếu thì từ chối, báo số ô thiếu. *30 ngày: 0 ô trống ở ET đã đóng.*
  3. Tính Elo + hạng + EXP (buổi thường); buổi bổ trợ: 250 EXP có mặt, môn theo từng em.
  4. Buổi không có đề ET ⇒ nút "Không có ET — đóng" (đóng để hết treo, không tính Elo).
- **Em vắng không nằm trong việc ET.** Em có mặt mà **không có bài** (mất bài / không nộp): hiện **không có trạng thái riêng** — xem §12 câu 1.

### 3.4 Chấm MT · Khảo sát
- Người chấm: Phó khối / Trưởng khối (§2.2); Phó trở lên chấm được mọi lớp cùng khối (`fn_khoi_cua_toi`). Màn ERP lá **Chấm MT – Khảo sát** (`lib/chamMT.ts`).
- Mỗi (em × câu): Đ/C/S + **điểm đạt** + nhận xét. Điểm do trigger DB đặt (`tg_gami_grades_mt_diem`): Đ = trọn điểm câu · S = 0 · C = người chấm chọn; câu Đúng/Sai khối 12 chấm **từng ý**, DB quy 0,1 / 0,25 / 0,5 / 1 (Thùy 13/11). Tổng bài `tg_gami_grades_mt_tong`; có ô **điểm thật** không chặn 9,75 để so nhất khối (Thùy 11/11).
- Thang điểm theo câu của từng khối ⇒ §3.7 C.

### 3.5 Chấm BTVN
- **Hai đường sống song song** (Thùy 30/08): em nộp ảnh qua app PH (📱) hoặc TA tự thêm ảnh ⇒ chấm trên ảnh; em nộp giấy / Zalo ⇒ nhập tay. Cả hai ghi cùng `gami_grades`.
- Mỗi em một dòng `btvn_ket_qua`: **trạng thái nộp** `nop_dung_han` · `nop_muon` · `xin_phep` · `khong_lam` + **thái độ** `nghiem_tuc` · `chua_het_suc` · `chua_nghiem_tuc` · `chong_doi`. Trạng thái nộp **hệ đề xuất** từ giờ nộp (`fn_btvn_de_xuat_trang_thai`), **TA bấm xác nhận** (Thùy 30/08). 30 ngày: đúng hạn 1.354 · muộn 358 · không làm 259 · xin phép 55.
- Trên ảnh: xoay / đổi chỗ trang, **vẽ đánh dấu thành bản mới** (`path_cham`; ảnh gốc không đè), bỏ ảnh thêm nhầm = kho rác (`bo_at`). Nhận xét chọn từ danh sách mẫu (`btvn_nhan_xet_mau`).
- **Trả bài** (`fn_btvn_tra_bai`) ⇒ phụ huynh thấy bài chấm + đáp án chi tiết; đáp án **chỉ lộ sau khi trả**. Đóng BTVN tự trả nốt bài đã chấm.
- **Đóng BTVN** = `fn_dong_btvn`: mọi em có mặt phải có trạng thái nộp (không đòi đủ ô câu) ⇒ tính lại EXP tháng của lớp ⇒ trả bài. Câu em **bỏ trống** trong bài em có làm (≥ 1 ô đã chấm, không xin phép) được tính 0 sau khi đóng (`_btvn_cau_bo_trong`).
- **BTVN trên app** (khối 10–12): kết quả từng câu đổ vào lưới (`fn_btvn_online_dong_bo`); hết hạn máy tự đóng, giờ đóng = giờ hạn; bỏ trống ⇒ Không làm bài · không điền đủ ⇒ thái độ Chưa nghiêm túc · làm sau hạn vẫn nhận, tính Nộp muộn (Thùy 04/11).
- **BTVN bù** (Thùy 29/09, 03/11, 06/11): em học bù làm BTVN của buổi đã nghỉ; lưới chép riêng cho em ở ca bù (`fn_bu_btvn_seed`); kết quả **gắn về buổi mẹ** (`fn_btvn_bu_theo_buoi_me`) cho báo cáo PH, tỉ lệ làm bài, EXP (từ tháng 11).

### 3.6 Đóng · mở lại · sửa sau đóng
- **Muốn sửa điểm khâu đã đóng ⇒ bấm "↩ Mở lại"** (`fn_mo_lai_phase`: hoàn Elo + EXP của khâu, gỡ mốc đóng; BTVN: tính lại EXP khi đóng lại). Sửa xong đóng lại. Mọi lần đóng / mở có vết (trigger), người / máy (`actor` trống = máy).
- Đề đổi sau khi đã đóng ⇒ lưới **giữ theo lúc chấm** + cảnh báo; muốn bám đề mới thì Mở lại.
- Sửa **đáp án sai của đề** (cả lớp) ⇒ "Chấm lại" có log (`fn_sua_key_va_cham_lai`) — `spec-builder.md` §10.1. Em báo máy chấm sai câu trả lời ngắn ⇒ **Duyệt báo sai** (`duyetcham/DuyetChamScreen.tsx`: chấp nhận đáp án ⇒ lần sau máy chấm đúng + sửa ngược mọi bài cùng đáp án).

### 3.7 QUY TẮC CHẤM (bản v0.1 05/11 — áp cho cả TA lẫn máy; **D1–D9 ĐÃ CHỐT theo cột đề xuất — Thùy 17/11**)
> Giữ nguyên số mục A1–A9 của `spec-quy-tac-cham.md`. Mỗi lần máy chấm ghi phiên bản rule đã dùng (`btvn_ai_lan.rule_version`).

**A1. Ba kết quả.** **Đ** = kết quả đúng, hướng đúng, lập luận đủ (lỗi nhãn / ký hiệu nhỏ không làm sai lập luận vẫn Đ + nhận xét). **C** = hướng đúng nhưng có lỗi thật (sai một bước, thiếu lý do then chốt, thiếu kết luận, làm dở). **S** = sai phương pháp, sai từ đầu, bỏ trống câu có trên bài. Trắc nghiệm · trả lời ngắn · điền đáp số: **chỉ Đ / S**. **"Không có bài" ≠ S**: câu không có trên ảnh (thiếu trang, ảnh cắt) ⇒ **để trống**; chỉ ghi S khi thấy rõ chỗ làm bài mà em bỏ trống.

**A2. Điểm (DB tính; người chấm chỉ chọn Đ/C/S + mức C).** Mọi điểm là **bội 0,25** · câu 0,25 mà C ⇒ **0 điểm** (vẫn ghi C) · câu ≥ 0,5 mà C: lỗi nhẹ trừ ~25 %, sai một bước / làm được nửa trừ ~50 %, làm tròn **xuống** bội 0,25 · tổng tối đa 10, chỉ được 10 khi Đ hết (cộng ≥ 10 mà chưa Đ hết ⇒ 9,75) · ô có ý nhỏ: chấm từng ý, ô = tổng (CEO 03–05/11).

**A3. Chỉ chấm cái nhìn thấy rõ.** Phóng to trước khi kết luận chữ số / dấu / số mũ / đơn vị · **chữ viết tay nhập nhằng không trừ** nếu kết quả cuối đúng và mọi cách đọc hợp lý đều khớp; chỉ trừ khi đọc rõ 100 % là sai · phần em gạch xoá = bỏ qua · nét mờ không phải bằng chứng đã sửa · khoanh 2 đáp án / tẩy xoá không rõ ⇒ cần người xem · soát từng dòng, không dừng ở lỗi đầu · kiểm chỗ ghi ở lề trước khi nhận xét "thiếu".

**A4. Thiếu bài, thiếu trang.** Scan thiếu trang ⇒ để trống + ghi "thiếu trang câu X" · có trang mà em bỏ trống ⇒ S + dòng "Con làm thiếu câu X" · ảnh cắt mất một phần ⇒ không kết luận · nhiều bài trong một file ⇒ xác định trang từng em bằng họ tên + mã đề, **không gán theo thứ tự**. Ảnh BTVN phụ huynh gửi thiếu trang ⇒ chờ chốt (D6).

**A5. Bảng lỗi** (loại lỗi của máy chấm — §4.3): kết quả sai ⇒ S (tự luận: C nếu hướng đúng, chỉ sai bước cuối) · sai phương pháp ⇒ S dù đáp số trùng · sai một bước tính ⇒ C · thiếu kết luận ⇒ C · thiếu điều kiện / không đối chiếu điều kiện ⇒ C · thêm giả thiết ngoài đề ⇒ S nếu lập luận dựa vào đó · lập luận vòng / nhảy bước ⇒ C hoặc S · **không phải lỗi**: viết tắt "(L)", đặt ẩn phụ, lẫn "[" và "{" khi còn nghi. Thiếu lý do · lỗi nhãn · sai thứ tự đỉnh · đơn vị · dòng giữa sai cuối tự đúng · bài lời văn làm tắt ⇒ chờ chốt (D1–D5, D8).

**A6. Theo loại câu.** Trắc nghiệm: theo đáp án đúng mã đề · trả lời ngắn: chấp nhận dạng tương đương trừ khi đề đòi dạng cụ thể · tự luận: chấm theo từng dòng · chứng minh hình: chấm **chuỗi lập luận**, mỗi ý chấm riêng, **ý sau được dùng kết quả ý trước** kể cả khi ý trước sai · toán lời văn: gọi ẩn + điều kiện, lập phương trình, giải, đối chiếu, trả lời có đơn vị · câu nâng cao 0,25: chỉ Đ hoặc 0.

**A7. Đáp án và kiến thức.** Tự giải câu quan trọng trước rồi mới đối chiếu Bản GV (Bản GV có thể sai ⇒ "cần xem") · cách làm khác mà đúng ⇒ Đ · chỉ dùng kiến thức em **đã học tới lúc làm bài** để hạ điểm; em dùng cách ngoài chương trình mà đúng vẫn Đ · chưa có đề gốc ⇒ không kết luận Đ cho câu dễ bẫy.

**A8. Nhận xét và đánh dấu.** Câu đúng: chỉ chữ Đ đỏ · câu C / S: khoanh đúng chỗ sai + **một dòng** "<lỗi> vì: <lý do>. Đúng: <đáp án>" · không đè chữ em · điểm ghi đầu mỗi câu; tổng ghi ô ĐIỂM trang 1 (bài MT) · **BTVN không ghi tổng Đ/C/S vào ô ĐIỂM** (CEO 07/11) · câu thiếu: một dòng ở đầu trang 1.

**A9. Khi nào "cần người xem".** Chữ số / dấu quyết định kết quả mà không đọc chắc · khoanh 2 vòng · Bản GV nghi sai · đề mơ hồ · thiếu trang · bài không rõ của em nào · cách làm lạ chưa chắc đúng. Máy **tô vàng** các ô này.

**B. Theo cấp.** Tiểu học (3–5): chưa có dữ liệu chấm thật của máy — để trống tới đợt chấm đầu · THCS (6–9): áp trọn phần A; MT có phần Nâng cao (câu 0,25), tổng vẫn tối đa 10 · THPT: khối 10–11 Phần I 28 câu × 0,25 + Phần II 6 câu × 0,5; khối 12 theo khuôn tốt nghiệp (12 TN × 0,25 · 4 câu Đúng/Sai × 4 ý: 0,1 / 0,25 / 0,5 / 1 · 6 TLN × 0,5); phiếu tô mờ / tô 2 ô ⇒ cần xem.

**C. Thang MT tháng 10 theo khối** (nguồn `tai_lieu.cau_hinh.diemByCau`; mã đề 2, 3 dùng chung điểm theo số thứ tự câu):

| Khối | Thang theo câu | Đặc thù |
|---|---|---|
| 6 | 1–12: 0,25 · 13–21: 0,5 · 22, 23: 1 · 24–27: 0,25 (nâng cao) | — |
| 7 | 1–12: 0,25 · 13–19: 0,5 · Hình 20–23 = a 1 · b 0,75 · c 0,75 · d 0,5 · 24–27: 0,25 | Đề 7B không có nâng cao |
| 8 | 1–12: 0,25 · 13–19: 0,5 · Hình 20–24 = a 1 · b 0,75 · c 0,75 · d 0,25 · e 0,25 · 25–28: 0,25 | Ý d, e là câu 0,25 ⇒ C = 0 |
| 9 | 1–8: 0,25 · 9–12: 0,5 · 13, 14: 1 · 15: 0,5 · Hình 16 (a) 1 · 17 (b) 1,5 = 2 ý × 0,75 · 18 (c) 0,5 · 19–22: 0,25 | HK1: không dùng góc nội tiếp, tứ giác nội tiếp, Viète, PT bậc hai |
| 10, 11 | 1–28: 0,25 · 29–34: 0,5 | Chỉ Đ / S |
| 12 | xem B | Phiếu tô |

## 4. Chấm BTVN tự động (CEO 05–10/11)

**Luật: máy gợi ý → TA xác nhận mới thành điểm.** Chưa xác nhận thì **chưa có gì** trong `gami_grades` (gợi ý nằm ở bảng nháp `btvn_ai_*`). Máy không đè bài TA đã chấm tay, không đè trang TA đã vẽ tay.

### 4.1 Luồng
1. **TA** (app TA › Chấm BTVN › 🤖 Chấm tự động — **một màn**: chọn lớp → buổi → em → thêm / xoay / đổi chỗ ảnh) bấm **Gửi chấm** (`fn_btvn_ai_yeu_cau` ⇒ hàng đợi `btvn_ai_yeu_cau`).
2. **Máy** — chế độ **hàng đợi** (CEO 07/11, chưa dùng khoá API): máy CEO chạy lệnh `/cham-btvn-hang-doi` (`scripts/btvn-ai/hang-doi.mjs` lấy bài → mỗi bài một trạm chấm **Sonnet 5.5**, không dùng Opus (CEO 08/11) → `ghi.mjs` ghi gợi ý). Đề không có trong kho ⇒ một trạm giải đề trước.
3. Máy ghi: Đ/C/S từng câu (+ từng **ý**) · `chac` (không chắc ≥ 90 % ⇒ **tô vàng**) · loại lỗi (chỉ gán khi chắc) · một dòng nhận xét câu C / S · nhận xét chung gửi phụ huynh · thứ tự + góc xoay ảnh · **bản chấm đỏ** vẽ lên ảnh, có điểm ở góc trên phải trang 1.
4. **TA** xem, sửa, bấm **✓ Xác nhận** (`fn_btvn_ai_chot`) ⇒ ghi `gami_grades` (`graded_by` = TA), đếm số câu TA sửa (`so_cau_sua` — thước đo độ chính xác của máy). BTVN đã đóng ⇒ phải mở lại mới xác nhận được.

### 4.2 Điểm bài BTVN (một công thức — `fn_btvn_ai_diem`, CEO 08/11 + 10/11)
- Mỗi **ý** = 10 ÷ tổng số ý · C = nửa ý, làm tròn xuống bội 0,25 · tổng là bội 0,25 · **tối thiểu 5, tối đa 10** · TA đã xác nhận ⇒ tính theo kết quả TA.
- Số ý của một câu = số ý **nhiều nhất** máy từng ghi cho câu đó trong **cùng buổi** (em thiếu ảnh không được mẫu số nhỏ hơn ⇒ câu thiếu = 0 tới khi có ảnh và gửi chấm lại).

### 4.3 Luật của máy chấm
- Đọc quy tắc §3.7 trước mỗi bài. **Câu không có trên ảnh ⇒ không đưa vào kết quả** (thiếu = không dòng, không ghi S).
- Loại lỗi (12 mã chữ): `ket_qua_sai` · `sai_phuong_phap` · `dong_giua_sai` · `sai_mot_buoc` · `thieu_ly_do` · `thieu_ket_luan` · `chua_phan_tich_het` · `sai_dau` · `nhan_ky_hieu` · `don_vi` · `dieu_kien` · `trinh_bay` — không chắc thì để trống.
- Công tắc `he_thong_cong_tac.btvn_cham_tu_dong` (đang **bật**; tắt = ẩn nút, không cần deploy).
- **Số tới 17/11:** 29 lần chấm / 22 bài · 21 lần TA đã xác nhận · 90 câu máy chấm, 11 câu tô vàng, **TA sửa 9 câu** · **10 bài đang nằm hàng đợi**. Chạy tự động qua API (Edge Function `btvn-cham-ai`) đã viết, **chưa bật** — §12 câu 11.

## 5. Đánh giá · nhận xét · báo động

### 5.1 Đánh giá sau buổi (buổi thường — việc của GV, ghi ở đây vì cùng màn buổi)
- Mỗi em một dòng `buoi_danh_gia`: **mức 1–5 có nhãn** (`muc_ma` 11 mã: 5a · 4a–4c · 3a–3d · 2a–2b · 1a — "số mức nói ĐỘ, mã nhãn nói VÌ SAO", CEO 16/08) + nhận xét + (tuỳ) Đ/C/S theo dạng (`buoi_danh_gia_dang`). Hạn 36 giờ. 30 ngày: 2.105 dòng, 2.096 có mức, 472 có nhận xét.
- Thêm mã nhãn mới ⇒ migration nới CHECK đi kèm.

### 5.2 Nhận xét của TA
- **Buổi bù · đuổi · ca yếu**: người đứng ca nhận xét (bù / đuổi: chữ; ca yếu: nhận xét hoặc mức — bắt buộc mới hoàn tất được, §6.1). 30 ngày: bù 78 · yếu 60 · đuổi 10 dòng.
- **BTVN**: nhận xét mẫu theo bài (`btvn_nop.nhan_xet_ma`) + nhận xét từng câu (`gami_grades.nhan_xet`) — phụ huynh thấy sau khi trả bài.

### 5.3 Báo động 🚨 (chuông)
- **Ai bấm, ở đâu:** TA khi chấm ET · BTVN · BTVN bù · MT; GV ở Đánh giá sau buổi. Một dòng `canh_bao_yeu` = (em × **dạng** × buổi × nguồn `et` · `btvn` · `mt` · `danhgia`) + ghi chú.
- **Luật chung của chuông** (CEO 09/09): luôn bấm được; danh sách dạng để chọn = **dạng có trong tài liệu của khâu đó** (đề ET / phiếu BTVN / giáo trình buổi), theo bản đồ mới; chuông ở Đánh giá bắt buộc ghi chú (CEO 31/08).
- **Đi đâu:** em đang có case bổ trợ cùng môn ⇒ dạng vào thẳng case (trigger `trg_btyeu_bao_dong_vao_case`); em chưa có case ⇒ tín hiệu **theo tuần** ở màn duyệt bổ trợ của trưởng khối (Thùy 17/11 — `spec-bo-tro.md` §2, §12.0 câu 7; màn chưa xây).
- Ca ôn thi có báo động riêng bằng lời văn (`bo_tro_on_thi_bao_dong`, §6.5).
- 30 ngày: 56 lượt — BTVN 31 (9 người bấm) · ET 17 (5) · đánh giá 8 (2).

### 5.4 Hậu kiểm chéo (CLAUDE §5)
- **TA và GV không sửa ô điểm danh.** Em `vang` mà có điểm ET / nhận xét ⇒ cờ cho OPS; em `co_mat` mà không có ET ⇒ việc ET tự treo (cổng "đủ ô" §3.3).
- Soi bất thường dữ liệu chấm của TA (màn Hiệu suất, §8.4).

## 6. TA trong ca bổ trợ

> Luật của từng loại bổ trợ (ai vào, mức, kết thúc) ⇒ `spec-bo-tro.md`. Ở đây chỉ ghi **TA bấm gì, theo thứ tự nào**. Xếp ca, phòng, báo phụ huynh ⇒ #8.
> **Người dạy theo mức (Thùy 17/11):** L1 sau giờ — TA · L2 ca khối — TA trực ca khối · **L3, L4 — GIÁO VIÊN** (L4: đổi giáo viên). Hệ **gợi ý sẵn dạng**, người dạy chủ động sửa. **Bổ trợ Hình và Khẩn cấp đã bỏ.**

**Hai máy, hai vai** (Thùy 03/09): em làm bài bằng **tài khoản của em** trên iPad; TA điều hành bằng tài khoản TA. TA **không** nhập điểm test của ca app. Mọi việc bổ trợ trên app TA hiện **mã HS** (để đăng nhập iPad cho em quên mã — Thùy 15/10).

### 6.1 Ca yếu — ca khối (`ta/CaBoTroTA.tsx`)
1. **Điểm danh ca** (chạm lại để bỏ khi bấm nhầm — `fn_btyeu_bo_diem_danh`). Em vắng ⇒ buổi huỷ, case về "Cần xếp".
2. Chọn **chế độ** cho từng em: 📱 app · 📄 giấy (Thùy 21/09). Giấy: in phiếu luyện + phiếu test (`ta/PhieuGiayYeuTA.tsx`), **giấy và app giống hệt, không xáo** (Thùy 29/09).
3. **Luyện**: xem tiến độ từng dạng (tự cập nhật); khối **"Câu em đang làm"** (`ta/CauCuaEmTA.tsx`, Thùy 16/10) hiện đúng câu em thấy + đáp án + lời giải — đáp án chỉ hiện khi TA bấm. TA quyết lúc chuyển dạng / đóng ca.
4. **Đóng ca & sinh test** (`fn_btyeu_dong_ca`; khoá sau khi có test). Ca không có câu luyện nào ⇒ đóng "không học", không sinh test.
5. Test: app ⇒ máy chấm; giấy ⇒ TA nhập kết quả + nộp (`fn_btyeu_giay_nhap` / `_nop`). Câu trả lời ngắn máy chấm sai ⇒ TA sửa được (`fn_btyeu_ta_sua_ket_qua`, Thùy 19/09).
6. **Em không làm test ⇒ TA phải nhập lý do "không test"** mới hoàn tất được.
7. **Hoàn tất ca** (`fn_btyeu_hoan_tat`): bắt buộc **nhận xét hoặc mức**; hoàn tất ⇒ case kết thúc ngay (1 tuần 1 lần). 30 ngày: 61 lượt có mặt, 60 hoàn tất, **48 có bài test đã nộp**.

### 6.2 Sau giờ — L1 (`ta/SauGioNhapTA.tsx`, `ta/SauGioCa.tsx`; Thùy 11–16/11)
- **TA không mở ca**: GV / trưởng khối đã khởi tạo và in ba thứ riêng (lý thuyết · bài luyện · bài test). TA cho em làm trên giấy rồi **nhập Đ / C / S từng câu test** (lưu từng ô, vá tại chỗ) ⇒ **"Xong" = nộp** (ô trống tính sai) ⇒ em có mặt + ca xong; test tính mastery như ET.
- Công: đầu việc mặc định `bo_tro_sau_gio` (Thùy 12/11) — một ca cả lớp = một việc của TA ca đó.

### 6.3 Bù (`fn_bu_ca_cua_toi`; chấm BTVN bù `ta/ChamBtvnBu.tsx`)
- Người đứng ca: điểm danh trong màn ca → em luyện + test bù trên app (trắc nghiệm trước, hết mới trả lời ngắn) → **Xác nhận ET (bù)** + **đánh giá buổi bù**. Đóng ET của ca bù **không** làm ca thành "hoàn tất" (sửa 05/11 sau ca bù biến mất khỏi ô TA).
- **BTVN bù do TA LỚP của em chấm** (§3.5).

### 6.4 Đuổi (`ta/DuoiCaTA.tsx`, `ta/DuoiGiayTA.tsx`) — luật đuổi **chưa chốt** (`spec-bo-tro.md` §7.4)
- Em tự học ở nhà; đến ca TA làm cùng phần dở: xem tiến trình từng dạng, **mở tay** dạng bị khoá (`fn_duoi_mo_dang`), dạng không có trắc nghiệm / không có thiết bị ⇒ sinh bài giấy, **TA chấm Đ / C / S trực tiếp từng câu** (mỗi câu một dòng), nộp bài test. In giấy cho dạng có trắc nghiệm (Thùy 14/11).
- Màn nói rõ khi đợt chưa có dạng mục tiêu / đợt đã hoàn thành (`fn_duoi_buoi_tinh_trang`). **TA không thấy "Mức học đuổi"** (giá — việc của OPS; Thùy 22/09).
- Cuối ca: nhận xét ⇒ xong.

### 6.5 Ôn thi (`ta/CaOnThiTA.tsx`; Thùy 23/10)
- Không mở ca, không dùng app HS, không đo. TA **điểm danh** em đã đăng ký (em đến mà chưa đăng ký ⇒ thêm tại chỗ) → cuối giờ **báo động bằng lời** nếu cần → **Hoàn tất ca**. Công TA = việc phát sinh (khai ở tab Công).

### 6.6 Hình — ĐÃ BỎ (Thùy 17/11)
- Màn `ta/CaHinhTA.tsx` còn trong tab Bổ trợ app TA (0 ca từ 17/10): **đã bỏ, chờ gỡ** theo Luật xoá (`spec-bo-tro.md` §7.5).

## 7. Chấm công TA (Thùy 12–15/10, 09/11, 12/11)

### 7.1 Nguyên tắc
1. TA **phải chấm công** (đảo quyết định 07/09 "mặc định có mặt"). Làm cho TA part-time theo package trước; full-time / core team để sau.
2. **ERP là nguồn số 1**; ERP không tự biết mới dùng lời khai.
3. **Việc lấy chắc được từ ERP thì KHÔNG chấm công**: chấm BTVN, chấm ET (lấy thẳng từ dữ liệu chấm). Khai thêm = hai nguồn cho một sự thật.
4. Chấm công theo **tài khoản** (thiết bị nào cũng được), không quét QR. Sau này có máy chấm công thì chỉ thay nguồn của lớp "Có mặt".
5. **GV kiêm TA không chấm công** (§1).

### 7.2 Ba lớp

| Lớp | Là gì | Nguồn | Ai xác nhận |
|---|---|---|---|
| **Có mặt** (ca) | Giờ vào – giờ ra thật | TA bấm **Checkin / Checkout** | Người duyệt; chốt lại giờ được (`vao_chot`, `ra_chot` — **giờ gốc không sửa**) |
| **Việc** (phiếu công) | Loại việc · lớp / ca / HS · khung giờ | Hệ gợi ý từ lịch (± 30 phút), TA bấm **"Ghi công"** hoặc thêm việc ngoài lịch | Người duyệt |
| **Bằng chứng** | Dấu vết việc đó trên ERP | ERP tự có | Máy đối chiếu: **"đã khớp"** / *(trống)* + cờ |

- Một ngày: Checkin → ghi công việc theo lịch / thêm việc → Checkout → máy đối chiếu → duyệt cả lô → vào lương (chỉ dòng đã duyệt thuộc ca đã duyệt).
- Chữ trên app (Thùy 14/10): **Checkin / Checkout** · **"Ghi công" / "Đã ghi công"**. Không checkin từ màn chính — bấm vào ô Chấm công mới checkin.
- "Quên checkout" là trạng thái **suy** (chưa có giờ ra mà đã sang ngày khác), không lưu cờ.

### 7.3 Danh mục việc (`ta_loai_viec`, 15 loại; 30 ngày: 538 phiếu)

| Nhóm | Loại việc | Đơn vị | "Đã khớp" khi ERP có | 30 ngày |
|---|---|---|---|---|
| Package | Trợ giảng lớp học | buổi | Buổi `thuong` của lớp đó, ngày đó, không huỷ, trong ca có mặt | 201 |
| | Bổ trợ định kì (trực bổ trợ khối) | giờ | `ca_bo_tro` ngày đó có tên TA (không có em vẫn hợp lệ) | 164 |
| | Bổ trợ bù · yếu · đuổi | giờ | Buổi bổ trợ loại đó, ≥ 1 em có mặt | 39 · 13 · 12 |
| | **Bổ trợ sau giờ** (12/11) | giờ | Ca `ca_bo_tro_nhe` của TA | 18 |
| | Chữa bài cho học sinh | giờ | — (trống) | 0 |
| Ngoài package | Trông thi | giờ | Buổi của lớp hôm đó là buổi thi | 39 |
| | Bổ trợ ôn thi (phát sinh) · Bổ trợ đặc biệt (kèm riêng, theo buổi) | giờ · buổi | — | 37 · 10 |
| | Chấm thi · Họp · Đào tạo · Làm đề thi · Việc khác (đang tắt) | giờ | — | 2 · 0 · 0 · 0 · 3 |
| *Không chấm công* | **Chấm BTVN · chấm ET** (kể cả chấm hộ) | — | Lấy thẳng theo người chấm | — |

- **Làm hộ** (trợ giảng lớp khác, trực hộ ca): TA khai đúng lớp / ca; hệ **tự suy** là làm hộ ai; người được hộ không khai gì.
- Việc chưa có đơn giá vẫn ghi, trả 0đ + cờ "chưa có đơn giá" (đơn giá ⇒ #11).
- Thêm / sửa / tắt loại việc trên màn (`fn_ta_loai_viec_luu` / `_dung`), có log.

### 7.4 Khai · sửa · khai bù
- **Trợ giảng** phải ghi lớp, mặc định lớp chính **tại ngày đó**; trước ngày phân công ⇒ bắt chọn lớp. Khai trợ giảng / trông thi tự gắn buổi của lớp hôm đó; trùng ⇒ "Việc này đã ghi công rồi".
- **Khai bù trong 24 giờ** kể từ khi việc diễn ra, dòng mang nhãn "khai bù", vẫn qua duyệt. Quá 24 giờ ⇒ chỉ người duyệt **nhập hộ** (có vết). Không khai trước cho ngày chưa tới.
- **Đợt khai lùi** (`ta_dot_khai_bu`): hệ mở giữa tháng 10 nên TA được khai mọi ngày 01–31/10 tới hết 03/11. "Thiếu công" tính từ mốc `_ta_moc_cham_cong()` = 01/10/2026.
- **TA tự sửa phần chờ duyệt** (Thùy 15/10): sửa giờ ca khai bù (ca bấm trên app = giờ máy, không sửa) · huỷ ca (ca + việc ⇒ "từ chối — TA tự huỷ", không xoá dòng) · sửa việc.

### 7.5 Bất biến và cờ
- **Mỗi buổi lớp diễn ra phải có một phiếu công trợ giảng**; **mỗi ca trực / ca bổ trợ có em đến phải có phiếu công** của người đứng ca hoặc người làm hộ. Thiếu ⇒ "**thiếu công**" (thuần suy `_ta_buoi_thieu_cong`, chỉ buổi / ca đã kết thúc), giao cho TA phụ trách tại ngày đó.
- Cờ trên dòng: buổi / ca đã huỷ mà có khai · khung giờ ngoài ca có mặt · hai việc trùng giờ · kết thúc ≤ bắt đầu · giờ ngoài 7h–22h30 · hai TA cùng khai một buổi · bổ trợ không có em có mặt · giờ bổ trợ tháng vượt xa chỉ tiêu · lớp được phân công mà cả tháng không hoạt động · việc chưa có đơn giá.

### 7.6 Duyệt
- **Trưởng khối duyệt công TA trong phạm vi môn × khối của mình** (Thùy 09/11 "đưa duyệt công TA về trưởng khối cho đúng flow vận hành"; `fn_ta_cong_duoc_duyet`): mỗi dòng việc suy (môn | khối) từ lớp / ca / buổi; **không duyệt công của chính mình** (trưởng khối cũng là TA ⇒ lên trưởng bộ môn). Ca có mặt duyệt được khi mọi việc trong ca thuộc phạm vi. Khay "DUYỆT CÔNG" ở Phòng làm việc.
- **Người giữ quyền `ta_cong_duyet`** (vai Core team) thấy + duyệt hết = hậu kiểm + phần chung (chấm thi, họp, ôn thi chung, dòng không có khối) + Thiếu công + Nhập hộ.
- Màn `tacong/DuyetCongScreen.tsx`: mỗi dòng **chọn sẵn**, cột Đối chiếu ("đã khớp" / trống), cờ, làm hộ ai ⇒ đọc một lượt, bỏ chọn dòng không duyệt (**bắt buộc lý do**), sửa giờ chốt ngay trên dòng, **duyệt cả lô**. Ca chưa có giờ ra phải chốt giờ trước.
- Mọi thay đổi ca / việc / đơn giá / loại việc tự ghi `ta_cong_log` (trigger `_ta_cong_ghi_log`).
- Hạn chót duyệt / sửa của kỳ: **ngày 3 tháng sau**. *Hạn duyệt hằng ngày của trưởng khối + gậy trễ: chưa chốt — §12 câu 6.*
- **Số 30 ngày:** 310 ca (232 đã duyệt · 47 chờ · 31 từ chối; 68 ca khai bù) · 538 phiếu việc (430 đã duyệt · 61 chờ · 47 từ chối).

### 7.7 Điểm nối sang lương (#11)
- Lương đọc: phiếu trợ giảng **đã duyệt** (⇒ %TG theo lớp, tính trên số buổi cả tháng) · buổi BTVN **chính TA chấm trong hạn** (⇒ %BTVN) · **giờ bổ trợ đã duyệt** (chỉ tiêu 8 giờ × số lớp) · trông thi lớp khác · bổ trợ đặc biệt · sĩ số trung bình tháng (bậc). **Lương không nhân hiệu suất**; sai thì gậy + phạt (Thùy 12/10).
- **Kỳ đã chốt lương ⇒ khoá** thêm / sửa / xoá ca + việc của tháng đó (trigger `_ta_khoa_ky`). Điều kiện chốt: qua hạn duyệt · không còn ca / việc chờ duyệt · không còn ca quên checkout.
- Công thức, đơn giá (`ta_don_gia`, `ta_luong_lop`), chốt kỳ (`ta_luong_ky`), bảng lương (`tacong/LuongTaScreen.tsx`), quyền `ta_luong` ⇒ **#11**. *Hiện chưa kỳ nào được chốt trên ERP (`ta_luong_ky` 0 dòng).*

## 8. Hiệu suất TA (Thùy 08/10, sửa 05/11)

> Thay màn "Chất lượng vận hành" cũ (trưởng nhóm chấm chất lượng tay — `viec_van_hanh_duyet`, lần cuối 29/09). Làm TA trước; GV / OPS dùng lại khung sau.

### 8.1 Công thức

| Đầu việc | Tỉ trọng | Đơn vị |
|---|---|---|
| Chấm BTVN | 50 % | 1 việc / buổi |
| Chấm ET | 15 % | 1 việc / buổi (bỏ buổi ET trên app) |
| Bổ trợ (bù · yếu · đuổi) | 35 % | chỉ tiêu **8 giờ / tháng** — quản lý chốt tay (§8.3) |

- **Điểm một việc chỉ dựa vào HỆ GẬY**: **không có gậy = 100**; **mỗi gậy đã vào sổ = −50** — cả gậy "Chậm deadline" lẫn gậy loại khác (Thùy 05/11: *"gậy trừ quá ít ⇒ hiệu suất quá cao"* → *"cũng trừ 50"*; thay mức −15 và thang −10…−40 theo giờ trễ của 08/10). Sàn 0.
- Gậy còn **chờ chốt** hoặc **đã thu hồi** ⇒ không trừ (việc hiện cờ "có đề xuất gậy chờ chốt"). Không có gậy ⇒ dù số đo cho thấy trễ vẫn 100 — **gậy là nguồn duy nhất** quyết có trừ hay không.
- Gậy ↔ việc khớp bằng `ref_key`. Màn chi tiết có khối **"Gậy của tháng"** liệt kê mọi gậy của TA, gắn việc nào, có vào điểm không và vì sao — đối chiếu 1-1 với màn Gậy.
- Hiệu suất đầu việc = trung bình các việc được tính. **Tổng** = trung bình có trọng số các đầu việc **đang có số** (thiếu đầu việc ⇒ ghi "tạm").

### 8.2 Việc nào được tính
- Việc của **người phụ trách lúc hạn** (§1 luật 2) ở lớp mình là **TA chính** — khớp cách hệ Gậy chọn người chịu.
- Việc chỉ tồn tại khi **buổi có câu của khâu đó** trên hệ; buổi không có câu vẫn hiện dòng nhưng "không tính". **Ngoại lệ:** đã có gậy vào sổ ⇒ việc có thật ⇒ vẫn tính.
- Không tính: TA vắng buổi đó · chưa xác định được hạn. Không xếp hạng người có cờ `an_xep_hang`.
- **Phạm vi khối** (Thùy 03/11): trưởng khối 8 chỉ thấy / tính việc khối 8 của TA dạy cả 8 và 9 (`_hsta_thang_core(kỳ, nhân sự, lớp[])`).

### 8.3 Bổ trợ
- Hệ **không đề xuất điểm** (giờ nhập tay từng sai). Hiện đủ từng ca: ngày · giờ · loại · em có mặt / vắng · giờ bài đầu tiên · giờ đánh giá xong · gậy; giờ tạm tính = **hợp các khoảng giờ** có em (ca chung nhiều em tính một lần), để tham khảo cạnh chỉ tiêu 8 giờ.
- Cờ: không em có mặt · thiếu giờ · kết thúc ≤ bắt đầu · ngoài 7h–22h30 · chồng giờ · chưa đánh giá.

### 8.4 Soi bất thường dữ liệu (đếm số dòng thì luôn đủ ⇒ soi NỘI DUNG)
- **BTVN:** số đúng hạn / muộn / không làm / phép; cờ khi ≥ 40 % muộn + không làm; **nhân chứng độc lập** = tỉ lệ đúng hạn của chính các em đó ở lớp khác (TA khác chấm, ± 90 ngày) — lệch > 30 điểm ⇒ cờ.
- **ET:** ô đã chấm / (em có mặt × câu); cờ em vắng mà có điểm · đóng mà không có dữ liệu.
- Mở lại ⇒ cờ + số lần + giờ đóng cuối.

### 8.5 Chốt · ghi thêm · điểm nối
- **Hệ đề xuất → quản lý chốt** theo TA × tháng × đầu việc (`hsta_chot`, lưu cả số hệ thống lúc chốt; log bằng trigger `trg_hsta_chot_log`). **Ghi thêm** việc ngoài hệ (`hsta_ghi_them`) là căn cứ để chốt, không tự cộng điểm.
- Quyền: xem `db_chatluong`; ghi `co_quyen_ghi('db_chatluong')`. Màn `dashboard/HieuSuatTAScreen.tsx`; Phòng trưởng khối đọc cùng hàm (`fn_hsta_thang`).
- Tham số ở 4 hàm `_hsta_*` (tỉ trọng 50 / 15 / 35 · −50 / gậy · 8 giờ) — đổi số = một migration sửa đúng hàm.
- **Điểm nối #11:** gậy sinh từ máy quét việc trễ theo lần đóng đầu (`gay_de_xuat` → người chốt → `gay_ledger`); hiệu suất **không** vào công thức lương, tiền phạt gậy thì có.
- **Hiện trạng:** `hsta_chot` 0 dòng · `hsta_ghi_them` 0 dòng (chưa ai chốt lần nào) · 314 đề xuất gậy đang chờ quyết (mọi nguồn) · 30 ngày 66 gậy vào sổ. ⇒ §12 câu 5.

### 8.6 Giới hạn đã biết
- Lịch sử đóng / mở chỉ có từ 23/09/2026. Gậy chốt trước 08/10 theo cách đo cũ — màn gắn cờ "có gậy trễ nhưng lần đóng đầu ĐÚNG HẠN", người chốt tự thu hồi.
- Chưa có mốc "mở ca trên iPad" ⇒ chưa đo được "mở ca muộn".

### 8.7 "Tiến trình" trên app TA (để TA tự theo dõi — KHÔNG dùng tính lương, CEO 07/09)
- Mỗi lớp ba ô: Trợ giảng buổi · Chấm BTVN · Chấm ET (thực / chuẩn + Đạt chuẩn / Thiếu N lần); bổ trợ là thẻ riêng theo TA. Chuẩn ở `ta_dinh_muc` (buổi = số buổi / tuần × 4 · BTVN 7 · ET 7 · bổ trợ 8 giờ); số ở `fn_ta_tien_trinh`. Kèm Xếp hạng · điểm tích luỹ · Gậy của tôi · May mắn · Shopping.

## 9. Bot Telegram cho TA (Thùy 14–16/10)

**Vòng lặp:** 08:00 bot đăng bản tin việc tồn → trong ngày TA / trưởng khối trao đổi, bot **ghi mọi tin ngay** → 24:00 máy tổng kết → người duyệt → gậy + bản tin hôm sau. (*Async standup bot* — khác ở chỗ đưa **việc tồn thật từ ERP**, mỗi việc một `ref_key`.) **Hiện mới chạy tới bước bản tin + ghi tin** (§9.5).

### 9.1 Quyết định
- Bản tin **08:00**, tổng kết **24:00** (giờ VN) · **một nhóm chung** mọi TA · kết quả duyệt dùng cho **gậy** + **bản tin hôm sau**.
- **Danh tính = `tg_user_id` nối `nhan_su.id` bằng mã dùng một lần** (app TA › Chấm công › "Kết nối Telegram" → `/start <mã>`; mã hết hạn 30 phút). **Không nối theo tên hiển thị / username.** Đổi tài khoản ⇒ dòng mới, giữ lịch sử.
- **Ghi tin bằng webhook** (`api/tg-webhook.mjs` → `fn_tg_nhan`, có secret): Telegram chỉ giữ tin cho bot 24 giờ và không đọc lại được lịch sử nhóm. Bot phải **tắt privacy mode trước khi vào nhóm**. `tg_tin` **bất biến** (trigger chặn sửa / xoá); tin bị sửa ⇒ thêm phiên bản.
- **Việc đã xong tự biến mất** khỏi bản tin hôm sau (tính lại từ ERP) — không ai "đánh dấu xong trên Telegram".
- **Máy gợi ý → người xác nhận**: máy không tự đánh gậy, không tự kết luận về TA.
- Tin nhắn là dữ liệu vận hành (không nhãn môn); mỗi **việc** mang môn + khối của lớp.

### 9.2 Luật bản tin (Thùy chốt 15/10 — thắng bản 14/10)
- Chỉ đăng việc **ET · BTVN (kể cả bù) CHƯA LÀM và ĐÃ TRỄ tới 08:00**, mỗi mục "trễ N ngày"; cùng lớp + ngày gộp "(N học sinh)", không ghi "×N". Chỉ việc từ 01/10.
- **Chấm công** = một dòng / TA "⏳ Cần hoàn thành chấm công" — **không gọi là trễ**. GV kiêm TA không có dòng này.
- Cảnh báo **"BTVN cần nhắc em"**: hai kết quả gần nhất liên tiếp cùng không làm / cùng nộp muộn (xin phép bỏ qua), bài gần nhất trong 7 ngày.
- **"Phụ trách:" = TRƯỞNG khối** của khối có việc (không tag Phó, không tag chính mình). Bỏ admin. Tiêu đề "BẢN TIN CÔNG VIỆC TRỢ GIẢNG".
- Mỗi TA còn việc **một tin**; tin đầu ghi số TA còn việc / sạch việc. Bản tin đã đăng lưu bất biến (`tg_ban_tin`, một dòng / ngày × nhóm × TA, kèm bản chụp việc + `ref_key`) ⇒ chạy lại không đăng trùng.
- **Định dạng** (Thùy 16/10): danh sách người + số phải là **bảng thẳng cột** (`<pre>`) hoặc mỗi ý một dòng. Gửi giãn ~3 giây / tin.
- Xem thử ⇒ gửi vào chat riêng của Thùy trước, không đăng nhóm khi chưa được bảo.

### 9.3 Tổng kết 24:00 + duyệt (thiết kế 14/10, **chưa xây**)
- Mỗi TA một lượt đọc: việc trong bản tin + trao đổi trong ngày + trạng thái ERP + công đã khai ⇒ theo từng việc: `da_xong` · `hen` (ngày) · `ly_do` · `khong_phan_hoi` · `khac`, kèm trích dẫn, cờ lệch ERP, đề xuất gậy (`danh` · `bo_qua` · `chua_den_luc`). **Không chắc ⇒ `khac`, không gán bừa.**
- Cờ lệch bắt buộc: TA báo xong mà ERP chưa đóng · báo nghỉ mà có checkin · hẹn đã qua mà việc còn mở · khai công việc Y mà việc Y còn tồn.
- Người duyệt xem cả lượt, sửa dòng sai, duyệt hết; quyết định gậy đi **đúng đường quyết định gậy đang có** (không viết đường ghi gậy thứ hai).
- Thực tế 15–16/10: TA **hầu như không trả lời dưới tin bản tin** ⇒ phải gắn tin theo **người gửi + người được tag**, đọc tự do. Mẫu đích = tin "TỔNG KẾT CÔNG VIỆC TRỢ GIẢNG" đăng tay 16/10.

### 9.4 Dữ liệu
`tg_lien_ket` · `tg_ma_lien_ket` · `tg_nhom` (vai `ta_chung` · `test`; cờ `ban_tin_bat`) · `tg_tin` · `tg_ban_tin`. Hàm: `_tg_viec_ton` / `fn_tg_viec_ton` (việc tồn mọi TA, có hạn từng loại) · `_tg_ban_tin_du_lieu` / `fn_tg_ban_tin` · `fn_tg_ghi_ban_tin` · `fn_tg_nhan` · `fn_tg_ma_lien_ket` · `fn_tg_lien_ket_cua_toi`. Code: `api/_tg_lib.mjs` (dựng chữ) · `api/tg-ban-tin.mjs` (cron 01:00 UTC) · `scripts/tg/*` (xem thử, đăng tay, đặt webhook). Secret webhook ở `he_thong_bi_mat`, không ở git.

### 9.5 Hiện trạng (17/11)
- ✅ Bot **@bk_trogiang_bot** trong nhóm TA; **24 người đã nối**; webhook ghi **699 tin / 30 ngày** (1.086 từ đầu).
- ✅ Bản tin 08:00 chạy đều: **32 ngày liên tục từ 15/10, ~20 tin / ngày**.
- ⛔ **Chưa có:** tổng kết 24:00 (`api/tg-tong-ket.mjs`, bảng `tg_tong_ket`, `fn_tg_duyet`) · màn duyệt · nối gậy · lời hẹn trong bản tin hôm sau · nút "Kết nối Telegram" trên ERP cho quản lý · bot tự đăng báo cáo BTVN khi TA đóng BTVN (Thùy 15/10: *"bot phải tự tổng hợp"*) · bộ quy tắc nhắn tin / hashtag (Thùy: "cần nghiên cứu và training"). ⇒ §12 câu 7.

## 10. App TA

- **Bundle riêng** `ta.html` → `src/main-ta.tsx` → `src/AppTa.tsx` (chặn tài khoản HS; quyền = cùng nguồn với ERP `my_quyen()` + phân công lớp, **không đẻ khái niệm quyền mới**). Địa chỉ `ta.bkacademy.edu.vn`, **deploy tay** (Thùy bấm).
- **TA không còn dùng ERP** (Thùy 21/09): mọi thứ TA cần phải có ở app TA.

| Chỗ | Màn | Việc |
|---|---|---|
| Thanh đáy | **Hôm nay** (`TaHome`) | Ô Chấm công (chỉ báo trạng thái) · việc tháng · ô Bổ trợ · mỗi nghiệp vụ một ô có **bubble đỏ** số việc nợ |
| | **Chấm ET** → `ChamBuoi` | §3.3 |
| | **Chấm BTVN** → `ChamBtvn` · `ChamBtvnBu` · 🤖 `ChamBtvnTuDong` / `ChamTuDongBtvn` | §3.5 · §4 |
| | **Bổ trợ** → `CaBoTroTA` · `CaOnThiTA` · (`CaHinhTA` — đã bỏ, chờ gỡ) | §6 |
| | **Của tôi** → `DashTa` · `TienTrinhTa` | §8.7 |
| Từ Hôm nay | **Chấm công** → `CongTA` (Hôm nay · Bảng công · Lương) + `HuongDanCong` (hướng dẫn lần đầu) · thẻ Kết nối Telegram | §7 · §9.1 |
| | **Sau giờ** → `SauGioNhapTA` · bù / đuổi → `DuoiCaTA` · `DuoiGiayTA` · `PhieuGiayYeuTA` · `CauCuaEmTA` | §6 |
| Góc trên | 🐞 `GopY` | dùng lại hệ báo lỗi của ERP |

**Luật giao diện riêng của app TA:**
1. **Không import màn ERP desktop**, `useStore`, `screens/kho` (bundle nhẹ); logic ghi dùng chung seam `src/lib/*` — *một sự thật, hai giao diện*.
2. **Làm cho điện thoại / iPad trước**: nút ≥ 44 px, không hover; **ít chuyển màn** (CEO 08/11: chấm tự động là một màn duy nhất).
3. **Vá tại chỗ sau mỗi thao tác; rời màn quay lại đúng chỗ cũ** (màn hàng đợi nhớ lớp / buổi / em — CLAUDE §2 React). Quét lại ở nền, không trắng màn.
4. Áo "BK" (CEO 07/09): nền trời, thẻ pastel bo tròn, icon PNG, chữ tiêu đề bong bóng; màn "Của tôi" nằm gọn một màn không cuộn.
5. Không `alert()` cho thành công; nút chính chỉ khoá khi **thiếu dữ liệu** (CLAUDE §6).
6. **Không lộ giá / học phí cho TA** (Mức học đuổi là việc của OPS).
7. Số trên app là số DB — app không tự cộng / đếm nghiệp vụ.

## 11. Bảng · hàm · trigger

**Bảng (giá trị hợp lệ theo CHECK 17/11):**

| Bảng | Vai trò | Giá trị |
|---|---|---|
| `gami_session_problems` | Ô của lưới chấm | `phase` ingame · et · mt · btvn |
| `gami_grades` | Kết quả (em × ô) | `result` correct · partial · wrong · `loi` (mảng mã) · `diem_dat` · `y_ket_qua` · `nhan_xet` · `bai_lam_cau_id` (từ app) |
| `buoi_hoc` (cột mốc) | Mốc đóng từng khâu | `et_dong_at` · `btvn_dong_at` · `mt_dong_at` · `danh_gia_xong_at` · `ingame_dong_at` |
| `buoi_hoc_phase_log` | Lịch sử đóng / mở | `su_kien` dong · mo_lai · doi_moc |
| `btvn_ket_qua` | Nộp + thái độ | 4 + 4 giá trị (§3.5) |
| `btvn_nop` · `btvn_nop_anh` · `btvn_nhan_xet_mau` | Lượt nộp ảnh · ảnh · nhận xét mẫu | `nguon` ph_app · ta_app |
| `btvn_ai_yeu_cau` · `btvn_ai_lan` · `btvn_ai_cau` | Hàng đợi · lần chấm · gợi ý từng câu | `result` như trên · `chac` |
| `buoi_danh_gia` · `buoi_danh_gia_dang` | Đánh giá / nhận xét | `muc_ma` 11 mã |
| `canh_bao_yeu` | Báo động | `nguon` btvn · danhgia · et · mt |
| `han_nop_ngoai_le` (+ `_log`) | Lệch hạn theo lớp × thứ | `loai` et · btvn |
| `viec_phu_trach_snap` | Người phụ trách lúc hạn (bất biến) | — |
| `phan_cong_lop` · `phan_cong_lop_log` | Phân công + lịch sử | `vai_tro` gv · tg · `hanh_dong` them · xoa · doi_chinh |
| `ta_cham_cong` | Ca có mặt | `duyet` cho_duyet · da_duyet · tu_choi · `nguon` app · may_cham_cong · nhap_ho · `trang_thai` dang_lam · xong |
| `ta_cong_viec` | Phiếu công | `trang_thai` như trên · `nguon` he_thong · tu_khai · nhap_ho · import_sheet |
| `ta_loai_viec` · `ta_dot_khai_bu` · `ta_cong_log` · `ta_dinh_muc` | Danh mục · đợt khai lùi · log · chuẩn tiến trình | `nhom` package · ngoai_package · `don_vi` buoi · gio · `tinh_vao` tg · bo_tro · bo_tro_dac_biet · trong_thi · cham_thi · khac |
| `hsta_chot` (+ `_log`) · `hsta_ghi_them` | Chốt hiệu suất · ghi thêm | `dau_viec` btvn · et · bo_tro · tong / khac |
| `tg_*` | Bot Telegram (§9.4) | `tg_nhom.vai` ta_chung · test |
| `ta_don_gia` · `ta_luong_lop` · `ta_luong_ky(_dong)` · `gay_*` | **#11** | — |

**Hàm chính:** việc + hạn `fn_viec_buoi_thuong_loc` (vỏ `fn_viec_buoi_thuong`) · `fn_viec_buoi_thuong_lh` · `fn_han_viec` · `han_nop_bai_test` · `_bu_btvn_han` · `fn_viec_tien_do` · `_viec_dong_dau` · `_viec_nguoi_luc_han` ·
chấm `fn_dong_phase` · `fn_mo_lai_phase` · `fn_dong_btvn` · `fn_et_online_dong_bo` · `fn_btvn_online_dong_bo` · `fn_btvn_de_xuat_trang_thai` · `fn_btvn_tra_bai(_buoi)` · `fn_btvn_nop_ta_them` · `fn_btvn_anh_bo` / `_xoay` / `_doi_cho` · `fn_bu_btvn_seed` · `fn_bu_btvn_viec_cua_toi` · `fn_btvn_bu_theo_buoi_me` ·
máy chấm `fn_btvn_ai_yeu_cau` · `fn_btvn_ai_du_lieu` · `fn_btvn_ai_ghi` · `fn_btvn_ai_diem` · `fn_btvn_ai_chot` · `fn_btvn_ai_trang_thai` · `fn_btvn_ai_lop_cua_toi` ·
ca bổ trợ (phía TA) `fn_btyeu_ca_ta` · `fn_btyeu_dong_ca` · `fn_btyeu_hoan_tat` · `fn_btyeu_giay_nhap` / `_nop` · `fn_btnhe_nhap_dcs` · `fn_bu_ca_cua_toi` · `fn_duoi_ca_cua_toi` · `fn_duoi_mo_dang` · `fn_onthi_viec_cua_toi` · `fn_onthi_diem_danh` · `fn_onthi_ca_hoan_tat` · `fn_ta_cau_cua_em` ·
chấm công `fn_ta_hom_nay` · `fn_ta_cham_cong_vao` / `_ra` / `_khai_bu` / `_nhap_ho` · `fn_ta_khai_viec` · `fn_ta_sua_ca` · `fn_ta_huy_ca` · `fn_ta_sua_viec` · `fn_ta_bo_viec` · `fn_ta_nhap_ho_viec` · `fn_ta_chot_gio` · `fn_ta_duyet_cong` · `fn_ta_cong_duoc_duyet` · `fn_ta_doi_chieu` · `fn_ta_cong_cua_toi` · `fn_ta_buoi_thieu_cong` · `_ta_tg_tai` · `_la_gv_kiem_ta` ·
hiệu suất `fn_hsta_thang` · `_hsta_thang_core` · `fn_hsta_task` · `fn_hsta_gay` · `fn_hsta_bo_tro` · `fn_hsta_chot` · `fn_hsta_ghi_them` · `_hsta_ti_trong` · `_hsta_tru_moi_gay` · `_hsta_chi_tieu_gio_bo_tro` · tiến trình `fn_ta_tien_trinh` · `fn_ta_dashboard` · nhắc việc `fn_ta_push_dem`.

**Trigger (code ẩn):**
- `buoi_hoc`: `trg_buoi_hoc_phase_log` (mọi lần đóng / mở khâu ⇒ `buoi_hoc_phase_log`) · `trg_ta_buoi_hoc_push_badge` (đổi mốc đóng ⇒ push badge cho TA lớp) · `trg_buoi_hoc_huy_exp` (huỷ buổi ⇒ gỡ EXP).
- `gami_grades`: `tg_gami_grades_mt_diem` + `tg_gami_grades_mt_tong` (điểm MT theo Đ/C/S, từng ý) · `trg_mastery_ban_*` (đánh dấu tính lại mastery).
- `btvn_ket_qua`: `trg_btvn_bu_exp_buoi_me` (TA ghi trạng thái nộp BTVN bù ⇒ tính lại EXP buổi mẹ).
- `canh_bao_yeu`: `trg_btyeu_bao_dong_vao_case`. `han_nop_ngoai_le`: log. `phan_cong_lop`: `phan_cong_lop_log_trg`.
- `ta_cham_cong` / `ta_cong_viec`: `_ta_khoa_ky` (khoá kỳ đã chốt) · `_ta_cham_cong_kiem_gio` · `_ta_cham_cong_kiem_tu_choi` · `_ta_cong_viec_kiem` · `_ta_cong_ghi_log`. `ta_loai_viec`: kiểm + log.
- `hsta_chot`: `trg_hsta_chot_log`. `tg_tin` / `tg_ban_tin`: `_tg_tin_bat_bien`. `viec_phu_trach_snap`: bất biến.

**Việc chạy theo lịch:** bộ điều phối `tinh_san_dang_ky` — `viec_lh` (5 phút) · `dash_viec_thang` (10 phút); máy tự đóng BTVN app khối 10–12 + khâu trống (30 ngày: máy đóng BTVN 177 lần, ET 140 lần); cron Vercel `tg-ban-tin` 08:00 · `ta-nhac-viec` 23:30.

## 12. Câu hỏi cho Thùy · lệch kỹ thuật

### 12.0 THÙY CHỐT 17/11

| Câu | Thùy trả lời | Luật | Việc code / DB (chờ lệnh) |
|---|---|---|---|
| 1 | OK | Em có mặt mà không có bài ET: hai nút theo em — **"Mất bài"** (lỗi trung tâm, KHÔNG tính mastery, không phải điểm 0) · **"Không làm / không nộp"** (tính Sai). | thêm trạng thái + nút ở lưới chấm; `fn_dong_phase` chấp nhận ô "mất bài" |
| 2 | OK | **D1–D9 chốt theo cột đề xuất** (§3.7). | cập nhật quy tắc trong Edge Function `btvn-cham-ai` nếu lệch |
| 3 | OK | Hạn chấm BTVN: buổi kế vào **thứ Bảy / Chủ nhật ⇒ 23:59 hôm trước**; còn lại 2 giờ trước buổi kế (lớp hai ngày liền vẫn 2 giờ). Trễ tính theo lần đóng đầu. | sửa `fn_han_viec` nhánh btvn |
| 4 | **Bỏ 6 nút** | Gỡ 6 nút mã lỗi E01–E06 khỏi lưới chấm ET. *(Phần "máy gợi ý loại lỗi → TA xác nhận, có lưu" Thùy CHƯA nói — giữ hiện trạng: máy có ghi loại lỗi ở bản chấm của nó, không lưu vào ô chấm.)* | gỡ nút + `ET_LOI` ở client |
| 5 | **"TA về nguyên tắc sẽ thấy BẢNG LƯƠNG REALTIME của mình: đã làm gì – được duyệt – gậy…"** | Màn của TA = **một bảng lương realtime**: việc đã làm · phần đã được duyệt · gậy · ra tiền. Không còn ba bộ số (hiệu suất theo gậy · "Tiến trình" · %TG/%BTVN). Hiệu suất theo gậy là số của quản lý. *(Cách tính phần Bổ trợ 35 % — tự động hay chốt tay — Thùy chưa nói riêng; quyết khi viết #11 Lương + gậy, theo nguyên tắc "cùng một số với lương".)* | dựng bảng lương realtime cho TA (đi cùng #11) |
| 6 | OK | Trưởng khối duyệt công trong **48 giờ** (quá hạn ⇒ về khay Trang + đề xuất gậy trễ) · thiếu công quá **24 giờ** ⇒ trưởng khối nhập hộ hoặc ghi "không có công" · sau **ngày 3 tháng sau**, phần còn thiếu coi như không có công để chốt kỳ. | hạn + khay + chốt kỳ tháng 10 |
| 7 | OK | Bot Telegram: giữ bản tin 08:00 + ghi tin; làm trước **bot tự đăng báo cáo BTVN khi TA đóng BTVN** + nút kết nối Telegram trên ERP cho quản lý. Tổng kết 24:00 → duyệt → gậy: để sau. | — |
| 8 | OK | Người dạy ca bổ trợ: **L1 / L2 = TA hoặc giáo viên kiêm TA; L3 / L4 bắt buộc giáo viên.** Công của giáo viên dạy bổ trợ ghi ở #11. | — |
| 9 | OK | Duyệt báo sai: **bỏ khỏi việc của TA, chuyển trưởng khối** (#6). | sửa `getMyTasks` / `_tg_viec_ton` |
| 10 | OK | Hạn việc ở buổi bù / đuổi / ca yếu: **36 giờ từ giờ bắt đầu ca**, một hàm hạn cho mọi loại. | sửa hàm hạn |
| 11 | **"Tạm thời chưa chạy tự động full. Để người tự trigger. Đang giai đoạn test."** | Chấm BTVN bằng máy: **người bấm chạy** (TA "Gửi chấm" → chạy tay hàng đợi), KHÔNG bật tự động. Đang thử nghiệm. | — |
| 12 | OK | (i) Em chuyển lớp: BTVN bù tính cho **TA lớp hiện tại**. (ii) Nhận xét sau buổi **bắt buộc khi mức ≤ 2**. | sửa hàm việc bù · chặn ở màn đánh giá |

### 12.1 Câu hỏi gốc (ĐÃ TRẢ LỜI ở 12.0 — giữ làm bối cảnh; "đề xuất" là trước khi Thùy chốt)

1. **Em có mặt nhưng không có bài ET (mất bài / không nộp) — ghi gì?**
   Luật gốc: "mất bài ≠ điểm 0". Hiện trạng: hệ **không có** trạng thái "mất bài"; muốn đóng ET thì mọi em có mặt × mọi câu phải có Đ/C/S ⇒ TA buộc bấm S (thành điểm 0 vào mastery của em) hoặc để việc treo.
   (a) Thêm nút theo em: **"Mất bài"** (lỗi của trung tâm — không tính mastery) và **"Không làm / không nộp"** (tính S), có đủ thì đóng được. (b) Giữ: có mặt mà không có bài = S.
   **Đề xuất: (a).**

2. **Chốt 9 điểm còn treo của quy tắc chấm (D1–D9, nháp 05/11)** — máy chấm và TA đang chấm theo cột "đề xuất":
   D1 thiếu lý do: hiển nhiên ⇒ Đ + nhận xét, then chốt ⇒ C · D2 chép sai tên đỉnh / ký hiệu: lập luận vẫn đúng ⇒ Đ · D3 sai thứ tự đỉnh tam giác đồng dạng: tỉ số đúng ⇒ Đ · D4 sai đơn vị: đọc rõ sai ⇒ C · D5 dòng giữa sai, cuối tự đúng ⇒ C · D6 ảnh BTVN thiếu trang: máy đánh dấu "thiếu ảnh", TA chọn "em không làm (S)" hay "gửi thiếu (để trống)" · D7 tự luận chỉ có đáp số: đúng ⇒ C, sai ⇒ S · D8 bài lời văn không gọi ẩn ⇒ C · D9 câu Đúng/Sai THPT giữ thang 0,1 / 0,25 / 0,5 / 1 của Bộ.
   **Đề xuất: chốt cả 9 theo đề xuất** (Thùy chỉ cần gạch mục nào không đồng ý).

3. **Hạn chấm BTVN.** Đang chạy: 2 giờ trước buổi kế tiếp, cho mọi lớp (trùng với hạn nộp của HS). Thùy 12/11 nói thêm: lớp học thứ Bảy / Chủ nhật cả ngày ⇒ xong trước buổi kế **một ngày**; lớp học hai ngày liền nhau chưa rõ. 30 ngày: chỉ 174 / 350 buổi đóng BTVN đúng hạn, 399 lần mở lại.
   (a) Giữ một luật 2 giờ. (b) Lớp có buổi kế vào thứ Bảy / Chủ nhật: hạn 23:59 hôm trước; còn lại 2 giờ. Lớp hai ngày liền: vẫn 2 giờ trước buổi kế.
   **Đề xuất: (b)**, giữ luật "trễ tính theo lần đóng đầu".

4. **"Loại lỗi" khi chấm — có bắt TA gắn không, dùng bộ mã nào?**
   Hiện có hai bộ: ô chấm ET có 6 nút E01–E06 (30 ngày **0 ô** nào được gắn; 90 ngày 200 ô, gần hết là E01); máy chấm BTVN dùng 12 loại lỗi bằng chữ nhưng khi TA xác nhận thì loại lỗi **không được lưu** vào ô chấm.
   (a) Bỏ 6 nút ở lưới chấm tay; loại lỗi do **máy gợi ý → TA xác nhận**, một bộ 12 loại, lưu vào ô chấm. (b) Giữ, bắt TA gắn khi C / S.
   **Đề xuất: (a)** — đúng "thà bỏ trống còn hơn đánh sai", và không ai đang gắn.

5. **Hiệu suất TA — phần Bổ trợ 35 % và việc "quản lý chốt".**
   Thiết kế 08/10: bổ trợ do quản lý chốt tay, mọi số "hệ đề xuất → quản lý chốt". Hiện trạng: **chưa ai chốt lần nào** ⇒ tổng hiệu suất luôn là "tạm", chỉ gồm BTVN + ET. Từ 14/10 đã có giờ bổ trợ **đã duyệt** ở chấm công. Chỉ tiêu cũng lệch: hiệu suất ghi 8 giờ / tháng, lương ghi 8 giờ × số lớp.
   (a) Bổ trợ = giờ bổ trợ đã duyệt ÷ (8 giờ × số lớp), tối đa 100 — cùng số với lương; bỏ bước chốt tay (số hệ thống là số chính thức, quản lý chỉ ghi chú). (b) Giữ chốt tay và giao rõ ai chốt, hạn nào.
   **Đề xuất: (a).** Kèm: TA đang thấy ba bộ số (hiệu suất theo gậy · "Tiến trình" theo chuẩn 7 lần / tháng · %TG / %BTVN của lương) — đề xuất "Tiến trình" trên app TA đọc cùng số với lương, hiệu suất theo gậy chỉ dành cho quản lý.

6. **Duyệt công: hạn của trưởng khối, và phần tồn.**
   13/10 chốt Trang duyệt hằng ngày; 09/11 chuyển về trưởng khối (đã chạy), Trang / Lộc / Thùy hậu kiểm. Chưa có hạn duyệt. Đang tồn: 47 ca + 61 việc chờ duyệt · **172 buổi / ca thiếu công** (cũ nhất 01/10, đã quá hạn 24 giờ tự khai) · 24 ca quên checkout ⇒ tháng 10 chưa chốt được kỳ.
   **Đề xuất:** trưởng khối duyệt trong **48 giờ** sau ngày việc (quá hạn ⇒ hiện ở khay của Trang + đề xuất gậy trễ như báo cáo tuần); thiếu công quá 24 giờ ⇒ trưởng khối nhập hộ hoặc ghi "không có công"; sau ngày 3 tháng sau phần còn thiếu coi như không có công để chốt kỳ.

7. **Bot Telegram: có xây tiếp phần tổng kết 24:00 → duyệt → gậy không?**
   Bản tin 08:00 + ghi tin đã chạy đều 32 ngày. Phần tổng kết / màn duyệt / nối gậy chưa xây; TA hầu như không trả lời dưới bản tin.
   (a) Dừng ở bản tin + ghi tin; gậy vẫn đi đường máy quét → người chốt. (b) Xây tổng kết đọc tự do theo người gửi, người duyệt là Trang. (c) Chỉ làm phần nhỏ: bot tự đăng **báo cáo BTVN khi TA đóng BTVN** (thay việc TA gõ tay) + nút kết nối Telegram trên ERP cho quản lý.
   **Đề xuất: (c) trước, (b) sau khi câu 5 và việc 314 đề xuất gậy chờ quyết (#11) rõ.**

8. **Ai dạy ca bổ trợ — và công của GV dạy bổ trợ ghi ở đâu?**
   Luật 17/11: L1 sau giờ và L2 do TA; L3, L4 do giáo viên. Hiện trạng (buổi từ 18/10, kể cả buổi đã xếp sắp tới): buổi sau giờ, ô "người dạy" đều là GV kiêm TA (151 / 151 buổi); ca yếu 39 / 93 buổi do GV kiêm TA đứng. GV kiêm TA **không chấm công, không lương TA** ⇒ các ca này không có công ở đâu cả.
   (a) Spec ghi "người dạy ca" L1 / L2 = TA **hoặc** GV kiêm TA; L3 / L4 bắt buộc GV; công của GV dạy bổ trợ ⇒ #11. (b) L1 / L2 chỉ TA thuần — hệ chặn GV.
   **Đề xuất: (a)**, và hỏi ở #11 thù lao GV dạy bổ trợ.

9. **Duyệt báo sai (em báo máy chấm sai) là việc của ai?**
   App "Việc của tôi" vẫn giao cho TA lớp (hạn 24 giờ); bản tin Telegram đã bỏ vì "việc của team học thuật" (15/10); 16/10 còn 93 báo sai chờ từ 19/08.
   **Đề xuất: bỏ khỏi việc của TA, chuyển trưởng khối (⇒ #6).**

10. **Hạn của việc ở buổi bù / đuổi / ca yếu.** Buổi thường đã theo 36 giờ (06/09); buổi bù vẫn "ET 12:00 hôm sau, đánh giá 23:59", đuổi / yếu 23:59 — câu "có áp 36 giờ không" treo từ 06/09.
    **Đề xuất: áp 36 giờ từ giờ bắt đầu ca cho mọi loại**, một hàm hạn duy nhất.

11. **Chấm BTVN tự động: chạy thế nào, cho ai?** Đang là hàng đợi chạy tay trên máy Thùy (22 bài; 10 bài đang chờ). Điểm bài có sàn 5.
    (a) Giữ chạy tay. (b) Bật chạy tự động qua API (tốn tiền theo bài, không cần máy Thùy bật). Phạm vi: mọi lớp hay lớp thử? Điểm (sàn 5) có hiện cho phụ huynh không?
    **Đề xuất: giữ (a) tới khi câu 2 chốt, rồi (b) cho cấp 2; điểm hiện cho phụ huynh cùng bản chấm đỏ.**

12. **Câu nhỏ gộp:** (i) em **chuyển lớp** thì BTVN bù tính cho TA lớp cũ hay lớp mới (chờ từ 16/10) — đề xuất **TA lớp hiện tại của em**. (ii) Đánh giá sau buổi của GV: 2.096 / 2.105 dòng có mức nhưng chỉ 472 có nhận xét — nhận xét có bắt buộc khi mức ≤ 2 không — đề xuất **có**.

### 12.2 Lệch kỹ thuật (không cần Thùy quyết — CTO làm khi có lệnh)

1. **CLAUDE §1.5 ghi "dòng grade ra đời là `da_cham` hoặc `mat_bai`" — DB không có hai giá trị này**: `gami_grades.result` chỉ `correct` · `partial` · `wrong`; cả DB lẫn `src` không có chữ `mat_bai`. Sửa câu chữ CLAUDE theo kết quả câu 1.
2. **R-ET chạy bằng mốc đóng + cổng "đủ ô"**, không phải "(em có mặt) trừ (dòng grade)" như CLAUDE §4 mô tả — kết quả tương đương với ET; **BTVN thì không**: đóng chỉ đòi trạng thái nộp (30 ngày 5.102 ô câu trống ở BTVN đã đóng — có chủ ý, em không làm hết).
3. **Việc bù / yếu / đuổi / báo sai tính ở client** (`getMyTasks` trong `gami.ts`: tải `buoi_hoc` + `buoi_hoc_hs` rồi lọc + tính hạn bằng JS) trong khi buổi thường đã ở DB ⇒ **hai bản luật** (`gami.ts` + `_tg_viec_ton`); hạn BTVN bù cũng hai nơi (`fn_bu_btvn_viec_cua_toi` + `_bu_btvn_han`). Trái CLAUDE §2.0.
4. **Ghi thẳng bảng từ client, có tính toán**: `gradeET` / `gradeMuc` / `gradeETBulk` tính `points` ở JS rồi upsert `gami_grades`; `dongDanhGia` / `moLaiDanhGia` / `recomputeHoanTat` cập nhật `buoi_hoc` từ client (DB đã có `fn_buoi_recompute_hoan_tat`).
5. **DB không chặn ghi `gami_grades` khi khâu đã đóng** — chỉ giao diện khoá (riêng `fn_btvn_ai_chot` và đồng bộ từ app tự chặn). Ghi qua API sau khi đóng sẽ lệch Elo / EXP đã tính.
6. `_tg_viec_ton` và `fn_ta_push_dem` còn lọc khâu `ingame` (bỏ từ 01/10 — vô hại vì nguồn không còn sinh) và nhánh retest (đã tắt).
7. `spec-hieu-suat-ta.md` ghi −15 / gậy và thang theo giờ trễ — **lỗi thời từ 05/11** (mig `202611051457`, `202611051505`: mọi gậy −50). `_hsta_tru_tien_do` còn trong DB nhưng không còn dùng để tính điểm.
8. Hiệu suất loại "TA vắng buổi đó" bằng bảng `ta_vang` (0 dòng, không còn màn nào ghi — màn `ChamCongTa.tsx` đã không còn trong `src`; `fn_ta_tien_trinh` cũng còn trừ theo bảng này) — nên đọc phiếu công đã duyệt.
9. `fn_ta_tien_trinh` · `fn_ta_buoi_thang` vẫn đọc phân công **hiện tại** cho ngày quá khứ (treo từ 04/11) — trái §1 luật 1.
10. **Mã lỗi không có danh mục ở DB**: `ET_LOI` khai hai nơi (`ta/ChamBuoi.tsx`, `gami/BuoiHocScreen.tsx`); `fn_btvn_ai_chot` ghi `loi = []` (bỏ `loai_loi` của máy).
11. `gami_grades.graded_by` · `canh_bao_yeu.created_by` lưu mã đăng nhập, **không khoá ngoại tới nhân sự** ⇒ "ai chấm" phải nối qua tài khoản; `canh_bao_yeu_nguon_chk` đang `NOT VALID`.
12. Spec bot cũ ghi người phụ trách lấy từ `phan_cong_khoi` — thực tế từ **sơ đồ tổ chức** (15/10). Các hàm thiết kế `fn_tg_luong_trao_doi` · `fn_tg_ghi_tong_ket` · `fn_tg_tong_ket_ngay` · `fn_tg_duyet` và bảng `tg_tong_ket` **không tồn tại**.
13. `viec_van_hanh_duyet` (+ trigger `tg_vvhd_tinh`, hàm `fn_vh_hieu_suat`) — nghiệm thu chất lượng tay cũ, 6 dòng, lần cuối 29/09; còn nguyên, không màn nào đang dùng làm số chính.
14. `ta/CaHinhTA.tsx` vẫn được vẽ trong tab Bổ trợ app TA (`TaHome`) dù Bổ trợ Hình đã bỏ.
15. Edge Function `btvn-cham-ai` viết sẵn, chưa deploy. Máy chấm: TA đổi kết quả sau khi máy vẽ ⇒ điểm trên app tính lại nhưng **ảnh đỏ vẫn số cũ**; điểm một em phụ thuộc số ý của các em cùng buổi đã chấm.
16. `spec-cham-cong-ta.md` không nhắc bảng `ta_luong_lop` (65 dòng mức lương theo lớp) và quyết định 09/11 (trưởng khối duyệt) — spec cũ lệch DB; phần lương ⇒ #11.
17. Chưa có bằng chứng nhắc việc 23:30 (`ta-nhac-viec`) chạy đều sau khi thêm `CRON_SECRET` (bản tin 08:00 thì có: 32 ngày liên tục).
18. Lớp có hai TA: việc ET / BTVN sinh cho **cả hai** ở "Việc của tôi"; hiệu suất / gậy chỉ tính TA chính — hai chỗ khác nhau có chủ ý, nhưng chưa ghi ở đâu.

## 13. Đã làm khi Thùy chốt (17/11)

- `spec-hieu-suat-ta.md` · `spec-bot-telegram-ta.md` · `spec-quy-tac-cham.md` → `_luu-tru/`. `spec-cham-cong-ta.md` giữ ở gốc tới khi #11 nhận phần lương.
- `.claude/commands/cham-btvn-hang-doi.md` đọc quy tắc chấm ở **spec này §3.7** (số mục A1–A9 giữ nguyên). CLAUDE.md §7 + `SPEC-INDEX.md` dòng #10.
- **Còn nợ:** mọi việc code / DB ở §12.0 + §12.2 chờ lệnh · CLAUDE §1.5 còn ghi `da_cham` / `mat_bai` (DB chưa có — có sau khi làm câu 1).
