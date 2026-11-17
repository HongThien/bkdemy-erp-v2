# spec-van-hanh-trung-tam.md — VẬN HÀNH TRUNG TÂM: TKB · phòng · xếp lịch bổ trợ + báo phụ huynh · đăng ký test · thu học phí · thu chi · sự kiện · tủ quà · app OPS (spec #8 của bộ 20 spec)

> **Trạng thái: THÙY CHỐT 17/11/2026** ("Chốt theo đề xuất" cho 12 câu — bảng §11.0, thắng mọi dòng thân spec còn trái). Spec này là nguồn đúng; `spec-xep-bo-tro-chung.md` · `spec-su-kien.md` · `PLAN-tuqua.md` đã chuyển `_luu-tru/`. GIỮ ở gốc: `spec-dang-ky-test.md` (phần web → #9) · `PLAN-thu-chi.md` (phần số liệu → #19).
> **§5 Học phí dựng lại từ hàm đang chạy** (file `spec-hocphi.md` mà code trỏ tới không còn trong repo) — Thùy nên soát riêng một lượt. Việc code / DB từ các quyết định chỉ làm khi Thùy ra lệnh.
> Luật có ghi `(Thùy dd/mm)` là quyết định có ngày. Dòng ghi **[hiện trạng]** = đang chạy trong code / DB nhưng **không tìm thấy quyết định có ngày** — chưa coi là luật, xem §11.
> **Gộp từ:** `spec-xep-bo-tro-chung.md` (gần trọn) · `_luu-tru/spec-bo-tro-ban-13-11.md` §3 (đơn vị) · §4 (gạch xếp lịch, capacity khối) · §5 (giờ / phòng sau giờ, ảnh báo PH) · §41–§43 ·
> `spec-dang-ky-test.md` (trừ phần web) · `spec-su-kien.md` · `PLAN-tuqua.md` · `PLAN-thu-chi.md` (phần quy trình) · `_luu-tru/BKDEMY_OPS_SPEC_DETAIL.md` · `_luu-tru/PLAN-app-ops.md` ·
> `_luu-tru/BKDEMY_TESTDAUVAO_SPEC_DETAIL.md` · `_luu-tru/luat-choi-game.md` (lịch sử) · HANDOFF (Lịch phòng một nguồn, Lịch khối, đăng ký test, app OPS) · DEVLOG 05/07 → 17/11 · `src/lib/hocphi.ts` + `fn_hocphi_*` (học phí không còn file spec — `spec-hocphi.md` 05/07 đã mất khỏi repo).
> **Đối chiếu DB 17/11** (chỉ đọc: `pg_proc`, `pg_trigger`, `pg_constraint`, `pg_policies`, đếm dòng). Số trong file là số ngày 17/11. Chỗ DB / code lệch nguồn ⇒ **không sửa**, ghi §11.
>
> **Ranh giới (chỉ trỏ, không chép):**
> logic bổ trợ (mức, đề xuất – duyệt, vòng đời case, nội dung ca, kết luận) ⇒ `spec-bo-tro.md` ·
> nhịp tuần · Giáo trình tuần · ca TKB ⇄ buổi builder · Mục tiêu tuần ⇒ `spec-van-hanh-tuan.md` §1, §3, §4 ·
> R-ET / R-DG / R-BU (invariant) ⇒ CLAUDE §4 · luật đo ⇒ `spec-mastery.md` ·
> việc của TA trong ca · app TA · chấm công TA ⇒ **#10 `spec-tro-giang.md`** (đang viết) ·
> trưởng khối · phân quyền phạm vi môn × khối ⇒ #6 · web công khai (form đăng ký test, trang tuyển sinh) ⇒ #9 · app phụ huynh ⇒ #13 ·
> số liệu / cơ cấu tài chính ⇒ #19 · lương, gậy ⇒ #11 · đề test đầu vào (soạn, duyệt) ⇒ `spec-builder.md` §8.

---

## 0. Đích

- Spec này trả lời: **hôm nay ở trung tâm, phòng nào giờ nào có gì · ai đứng · em nào có mặt · tiền thu thế nào · việc vận hành nào chưa làm.**
- **Một lịch phòng** (Thùy 10/11: "mọi hoạt động xếp lịch của BK phải lấy nguồn từ lịch phòng tổng quan để không conflict"). Mọi thứ chiếm phòng đọc và kiểm trùng ở một hàm DB (§2).
- **Pure-derive (CLAUDE §1, §4):** không có bảng việc. Buổi học suy từ TKB tới khi OPS mở buổi. Việc OPS = (phải có theo TKB × ca trực) trừ (đã có bằng chứng). "Cần xếp bù" = vắng mà chưa có buổi bù / chưa ghi không-bù. Hẹn test ≠ ca test. Không tạo dòng chờ (CLAUDE §1.5).
- **Việc ngoài hệ (nhắn Zalo, dọn phòng, thu tiền) phải để lại bằng chứng trong hệ** (ảnh, dòng thu, dấu thời gian do máy chủ đóng). Hệ **không tự gửi** tin cho phụ huynh — chỉ soạn sẵn chữ / ảnh để người gửi.
- **Nhãn môn (CLAUDE §1.6):** TKB, buổi, ca bổ trợ, hẹn test mang `mon`. Phòng, tiền, xu, sự kiện, phân công ca OPS **không** gắn môn.
- Người: **OPS (4 người, trưởng = Lộc)** làm vận hành ngày; **Lộc** xếp lịch bổ trợ, thu học phí, duyệt chi; trưởng khối / TA / GV vào từng khâu theo spec của họ.

## 1. Thời khoá biểu · buổi học · điểm danh

### 1.1 Thời khoá biểu (`thoi_khoa_bieu`)
- Một dòng = lớp × thứ × giờ × phòng, **có hiệu lực từ – đến** (đổi lịch = đóng dòng cũ, mở dòng mới; không sửa đè). Thứ: 2…7, Chủ nhật = 8.
- Lưu qua `fn_tkb_luu` (kiểm trùng + ghi một transaction). **Chính khoá là gốc của lịch phòng:** TKB trùng chính khoá khác / khung test / hoạt động phát sinh ⇒ **chặn**; trùng bổ trợ ⇒ cảnh báo, xác nhận mới lưu (Thùy 10/11).
- Lớp chưa tới ngày khai giảng không sinh buổi, không sinh việc.
- Số: 98 dòng đang hiệu lực / 53 lớp đang học (Toán 43 · KHTN 6 · Tiếng Anh 3 · Văn 1); 1 dòng chưa có phòng; 0 lớp đang học thiếu TKB.
- Ca TKB ⇄ buổi của giáo trình: `spec-van-hanh-tuan.md` §3.

### 1.2 Buổi học (`buoi_hoc`, `buoi_hoc_hs`)
- **Buổi ảo → buổi thật:** trước khi OPS mở, buổi chỉ là phép chiếu TKB lên ngày ("buổi ảo"). Mở buổi mới sinh dòng `buoi_hoc` + danh sách em (`buoi_hoc_hs`) theo sĩ số lúc mở.
- `loai`: `thuong` · `mt` · `bu` · `bo_tro_yeu` · `bo_tro_nhe` (sau giờ) · `bo_tro_duoi` · `bo_tro_on_thi` · `khao_sat` · ~~`bo_tro_hinh`~~ (đã bỏ, Thùy 17/11).
- `trang_thai`: `mo` → `hoan_tat` | `huy` (bắt buộc lý do). Buổi thường **hoàn tất = ET đã đóng + đánh giá xong + BTVN đã đóng** (buổi từ 01/10 không còn khâu trong-giờ, Thùy 28/10); buổi có MT thì hoàn tất khi MT đóng (`fn_buoi_recompute_hoan_tat`).
- Buổi bổ trợ đã học xong thì **không đổi ngày / giờ** — muốn học tiếp phải xếp buổi mới (trigger `trg_buoi_bo_tro_khoa_ngay`).
- Số 30 ngày: buổi thường 413 (hoàn tất 242 · mở 160 · huỷ 11) · bù 149 · sau giờ 146 · yếu ca khối 102 · ôn thi 29 · đuổi 18.

### 1.3 Điểm danh
- **Một người chịu trách nhiệm điểm danh buổi thường = OPS trực ca** (CLAUDE §5). GV không động ô điểm danh; sai lệch lộ qua ET / nhận xét (triangulation), không qua người kiểm người.
- Ba giá trị: `co_mat` · `vang` · `vang_phep`. Bấm là ghi ngay, không có nút Lưu. Ô trống = chưa điểm danh (không phải vắng).
- **Hạn điểm danh = giờ bắt đầu ca + 45 phút** (CEO 07/09).
- Trong màn điểm danh OPS còn: đổi người dạy · gỡ em xếp nhầm · huỷ buổi (có lý do) · **Báo đến PH** (đánh dấu đã nhắn phụ huynh em chưa đến; chữ để copy sang Zalo).
- **Ca bổ trợ: TA đứng ca điểm danh** (chi tiết ⇒ #10). Em vắng ca khối ⇒ buổi huỷ, case về "Cần xếp"; em vắng buổi bù ⇒ lượt nghỉ quay lại "cần xếp bù".
- Hệ quả của điểm danh: R-ET · R-BU (CLAUDE §4) · số buổi tính học phí (§5) · sĩ số lương GV (#11).
- Số 30 ngày (buổi thường): có mặt 3.108 · vắng phép 140 · vắng 81 · chưa điểm danh 6; "Báo đến PH" đánh dấu 11 / 224 lượt vắng.

## 2. Phòng học · Lịch phòng một nguồn

- **Danh mục phòng** (`phong`): 10 phòng đang dùng (P100 · P101 · P102 · P103 · P201 · P202 · P301 · P302 · P303 · P401). Đóng phòng = tắt cờ, không xoá. Buổi / TKB / ca lưu **mã phòng dạng chữ**; hàm lịch tự nêu cờ khi mã không khớp danh mục.
- **⭐ Nguồn duy nhất = `fn_phong_lich(từ, đến)`** (Thùy 10/11). 8 nhánh: ① buổi thường đã mở · ② TKB của lớp chưa mở buổi ngày đó · ③ buổi bổ trợ lẻ (mọi loại, trừ buổi nằm trong ca đã có phòng) · ④ ca bổ trợ · ⑤ ca sau giờ · ⑥ lịch khối chiếu lên ngày chưa sinh ca · ⑦ hoạt động phát sinh · ⑧ khung test đầu vào. Có giờ mà chưa có phòng ⇒ `phong_ma` trống.
  **Thêm nguồn chiếm phòng mới ⇒ thêm một nhánh vào hàm này. Cấm gộp lịch ở client.**
- **Kiểm trùng ở DB** — một ngày: `fn_phong_kiem_trung` · lịch khối hằng tuần (phòng + người, 4 tuần tới): `fn_lich_truc_kiem_trung` · TKB: `fn_tkb_kiem_trung` · khung test: `fn_ts_khung_trung_phong`.

**Luật phòng (Thùy 10/11 → 14/11):**

| Cái đang xếp | Trùng chính khoá | Trùng ca bổ trợ | Trùng test / phát sinh | Trùng người trực |
|---|---|---|---|---|
| TKB chính khoá | chặn | cảnh báo | chặn | — |
| Lịch khối · ca bổ trợ tạo tay | **chặn** | được ghép, **tối đa 2 ca bổ trợ / phòng cùng giờ** (ca thứ 3 chặn) | cảnh báo — chung phòng được, không tính vào 2 ca (Thùy 14/11) | chặn (lịch khối: hai dòng cùng giờ của cùng người chỉ cảnh báo) |
| Ca sau giờ | cảnh báo | cảnh báo | cảnh báo | — |
| Khung test đầu vào | chặn (TKB, khung test khác) | cảnh báo | — | — |
| Hoạt động phát sinh | cảnh báo ("Vẫn lưu") | cảnh báo | cảnh báo | — |

- **Hoạt động phát sinh** (`hoat_dong_phong`: họp nội bộ · học tập ngoài lịch · việc khác): chỉ cảnh báo mềm (CEO chốt). Bảng hiện **0 dòng** — chưa ai dùng.
- **Màn:** Quản lý phòng học (Danh mục · Lịch phòng theo ngày · Tổng quan tuần) · Bổ trợ › Lịch khối dùng chung lưới Tổng quan tuần.
- Số 30 ngày: 134 / 847 buổi không huỷ chưa ghi phòng; 0 mã phòng lệch danh mục.

## 3. Xếp lịch bổ trợ

> Ai được bổ trợ, mức nào, dạy gì, kết thúc thế nào ⇒ `spec-bo-tro.md`. Mục này chỉ nói **xếp vào đâu, lúc nào, ai đứng, tốn bao nhiêu sức TA, báo phụ huynh thế nào.**

### 3.1 Bản đồ xếp theo loại

| Loại | Xếp ở đâu | Ai xếp | Tốn đơn vị ca khối | Báo PH |
|---|---|---|---|---|
| **Yếu L2 · L3 · L4** — ca khối (Thùy 17/11: **cùng một đường xếp**, chỉ khác người dạy: L2 TA · L3 giáo viên · L4 chuẩn bị kỹ + đổi giáo viên) | Lịch phòng bổ trợ › ca khối | Lộc | có (§3.3) | Lộc chốt với PH trước khi xếp |
| **Yếu L1** — sau giờ | Bổ trợ › Sau giờ (ngay sau buổi học, cùng phòng) | GV / OPS khởi tạo | không | ảnh thông báo (§3.7) |
| **Bù** | ca khối | Lộc | có | như ca khối |
| **Đuổi** | ca khối, ca ≥ 60 phút | Lộc (GV chọn nội dung) | có | như ca khối |
| **Ôn thi** | màn Ôn thi, buổi riêng theo đợt | Trang | không | — |
| ~~Hình~~ · ~~Khẩn cấp~~ | **ĐÃ BỎ (Thùy 17/11)** — không có quy trình xếp. Code / DB còn (tab Hình ở Lịch phòng, nhánh `hinh` trong `fn_ca_bo_tro_*`): gỡ theo Luật xoá, danh sách ở `spec-bo-tro.md` §7.5 | | | |

- **Một em: bù riêng, yếu riêng** — không gộp hai loại vào một chỗ; cùng ngày có thể hai ca (Thùy 24/09).
- **Hệ chỉ chặn, không tự xếp** (Thùy 24/09). Máy gợi ý theo "em đi được buổi nào" — để sau.

### 3.2 Lịch khối hằng tuần (`lich_truc_bo_tro` — màn Bổ trợ › Lịch khối)
- Một dòng = **môn × khối × thứ × giờ × phòng × người trực** (1 hoặc 2 người), có hiệu lực từ – đến. Đây là nguồn ca trực — **không lấy từ Phân công** (Thùy 24/09).
- Lưu = `fn_lich_truc_luu` (kiểm trùng theo §2 + ghi một transaction).
- **Xoá** (Thùy 12/11, `fn_lich_truc_xoa`): còn ca từ hôm nay đã có em ⇒ hỏi; xác nhận ⇒ huỷ ca + buổi, em về hàng chờ. Lịch chưa từng sinh ca ⇒ xoá hẳn; đã sinh ⇒ đóng hiệu lực tới hôm qua.
- **Chốt tuần — mỗi tuần bấm một lần, kể cả không đổi gì** (Thùy 12/11, `fn_lich_khoi_chot_tuan`): sinh ca cho các ngày còn lại của tuần · ca chưa có em đi theo lịch hiện tại · huỷ ca chưa có em của lịch đã xoá · lưu bản chụp vào `lich_khoi_chot` (chỉ thêm). Màn so **nội dung** bản chụp với lịch hiện tại ⇒ "đổi sau chốt — chốt lại". Tuần đã qua không chốt lại được.
- **Lịch khối ↔ Lịch phòng đồng bộ: "lưu được thì phải sinh được"** (Thùy 14/11). Sinh ca (`fn_ca_bo_tro_sinh_ngay`) chỉ bỏ dòng **giống hệt** dòng khác (lưu hai lần); không còn bỏ im lặng dòng trùng người / trùng giờ.
- Số: 57 dòng đang hiệu lực, **toàn Toán**, khối 3 → 12 (khối 9: 10 dòng · 7 và 8: 9 dòng · 6: 7 dòng…), tổng 348 đơn vị / tuần; **25 dòng chưa có phòng** (khối 9: 9 / 10); 0 dòng 2 người trực; 0 dòng nhân đôi (5 nhóm nêu 14/11 đã hết). Tuần 16/11 đã chốt (3 lần, 16–17/11). 30 ngày: 264 ca sinh từ lịch, 13 ca huỷ; ca sắp tới 87 (37 chưa phòng).

### 3.3 Đơn vị · suất — sức chứa một ca
- **1 đơn vị = 30 phút × 1 trợ giảng. Đơn vị là TẢI của TA, không phải thời gian thật của em** (Thùy 23/09). Đơn vị ca = `3 × (phút / 30) × số TA` — ca 60′ một TA = 6 · 30′ = 3 · hai TA = 12 (cột tự tính ở DB).
- **Giá cố định theo loại, không sửa từng ca:**

| Lượt | Đơn vị | Nguồn |
|---|---|---|
| Đuổi | 4 — phải đủ 1 tiếng, **không giảm cho vừa** ⇒ chỉ vào ca ≥ 60′ còn ≥ 4 | Thùy 24/09 |
| Bù | 1 em **4** · 2 em cùng lớp cùng buổi nghỉ **3 / em** (nhóm 6) · 3 em **2 / em** (nhóm 6); em vắng không tính vào nhóm | Thùy 14/11 |
| Yếu L2 | **2** | Thùy 11/11 |
| Yếu L3 · L4 | **4** [hiện trạng — thang 11/11; sau 17/11 chưa rõ, §11 câu 1] | |
| Yếu L1 | 1 (chỉ khi lỡ gắn vào ca; L1 đi đường sau giờ) | Thùy 24/09 |

- **Trần tuần của em yếu: một buổi ca khối / tuần** (tuần = thứ Hai → Chủ nhật theo ngày ca; không đếm buổi huỷ, buổi em vắng). Đủ ⇒ không hiện ở ứng viên, hàm xếp chặn (Thùy 12/11). Bù, đuổi không có trần tuần.
- **Suất người:** mỗi TA 3 suất / ca; em lớp bậc **S tính 0,5 · A 0,75 · B / C 1** (Thùy 09/10: "trước một ca tối đa 3 em, giờ toàn S thì 6"). Một em đã có lượt trong ca không tính thêm suất.
- **Ca ĐẦY khi chạm một trong hai:** hết đơn vị hoặc hết suất (Thùy 24/09). Chặn theo **phần tăng thêm** của ca (em bù thứ hai cùng bài +2, em thứ ba +0).
- Em nghỉ / bị gỡ / buổi huỷ ⇒ trả đơn vị, ca mở lại ngay trong ngày.
- **Trần toàn trung tâm 70 em / 20 Cao: ĐÃ BỎ (Thùy 17/11).** Bảng "sức chứa khối" (0,4 × đơn vị lịch khối) chỉ hiển thị, không chặn — còn giữ không: §11 câu 4.

### 3.4 Luồng xếp ở Lịch phòng bổ trợ (Lộc)
```
Chọn NGÀY → các ca của ngày (ca khối sinh từ lịch khối · ca tạo tay · "Lịch riêng" = buổi xếp không khớp ca nào)
  → bấm một ca ⇒ ứng viên đúng MÔN + KHỐI của ca, ba tab ĐUỔI · BÙ · YẾU, đã sắp ưu tiên; em không vừa hiện mờ kèm lý do ("cần 4 · còn 2", "hết suất")
  → "+ Xếp" = ĐÃ CHỐT VỚI PHỤ HUYNH ⇒ trừ đơn vị ngay, sinh buổi của em gắn vào ca
  → gỡ em (khi chưa điểm danh) · huỷ ca (có lý do) ⇒ buổi huỷ, em về hàng chờ
```
- **"Lộc chốt với phụ huynh rồi mới điền; đã điền là đã chốt"** (Thùy 24/09 khuya) — không còn bước "chờ PH → Xác nhận".
- Thứ tự tổng: **ngày → loại (Đuổi → Bù → Yếu) → ưu tiên trong loại.**

| Loại | Ưu tiên trong loại | Điều kiện là ứng viên |
|---|---|---|
| Đuổi | em chưa đuổi buổi nào trước; rồi vào lớp sớm hơn trước (Thùy 24/09) | đợt đang đuổi, đã chốt dạng mục tiêu, chưa có buổi cùng ngày, chưa đủ số buổi dự kiến |
| Bù | buổi nghỉ cũ hơn trước [hiện trạng — Thùy chưa nói, §11 câu 4] | lượt vắng chưa có buổi bù còn hiệu lực, chưa ghi không-bù; **lượt tồn không có hạn, tô đỏ khi quá 14 ngày** (Thùy 17/11 — chưa làm) |
| Yếu | ưu tiên Cao → Thường → Thấp, rồi case mở lâu hơn; **không xét bậc** | case đang mở, mức **≥ L2** (Thùy 17/11), còn dạng cần dạy, chưa có buổi chờ học, chưa đủ trần tuần; case **hết hạn 14 ngày** tự đóng lúc 01h |

- **Người dạy mặc định** (đổi tay được): Yếu ⇒ người trực ca · Bù / Đuổi ⇒ **TA của lớp em** nếu TA đó đang trực ca này, không thì người trực (Thùy 24/09). L3 · L4 phải là giáo viên — hệ chưa ràng buộc (§11 câu 2).
- **Một case yếu tối đa một buổi chờ học** (trigger). Ca đã xếp mà không diễn ra ⇒ buổi tự huỷ, case về Cần xếp.
- Buổi xếp bằng form riêng của từng loại mà trùng người + giao giờ với một ca ⇒ hệ tự gắn vào ca đó và tính đơn vị; không khớp ca nào ⇒ nằm ở khu "Lịch riêng".
- Lịch phòng bổ trợ cũng là **màn "đang diễn ra"** của ca: em yếu hiện trạng thái sống (đang luyện · im lâu · chờ test). Màu chỉ ở thẻ loại: **Yếu đỏ · Đuổi xanh da trời · Bù cam**. Dải đỏ tự kiểm: TA / HS có thấy ca không (`fn_bo_tro_tu_kiem`).
- Buổi đuổi phải gán **mức học đuổi** thì mới tính tiền (§5.2); thiếu ⇒ màn Đuổi nêu cờ.

### 3.5 Sau giờ (L1) — giờ · phòng
- Khởi tạo: chọn lớp → em đã được duyệt L1 **trong tuần của ngày ca** → một buổi học trong 14 ngày tới. **Ca bắt đầu đúng lúc buổi tan, cùng phòng, 20 hoặc 25 phút**; TA đi kèm.
- 1 lần / em / tuần · vắng không bù · không tốn đơn vị · không qua Lộc. Trùng phòng chỉ cảnh báo.
- Reset thứ Hai, in tài liệu, nhập kết quả ⇒ `spec-bo-tro.md` §7.2. 30 ngày: 45 ca mở, 7 ca huỷ.

### 3.6 Ôn thi [hiện trạng]
- Mỗi đợt ôn sinh buổi riêng (`bo_tro_on_thi`), không qua ca khối, không tốn đơn vị; vào Lịch phòng như "bổ trợ lẻ". 28 buổi không huỷ, đều có phòng. Chưa có luật có ngày về giờ / phòng / ai xếp.

### 3.7 Báo phụ huynh
- **Ca khối · bù · đuổi:** Lộc tự liên hệ phụ huynh **trước khi** xếp; hệ không soạn, không gửi tin. Em và phụ huynh thấy **lịch bổ trợ sắp tới** trên app (yếu · bù · đuổi — `fn_hs_lich_bo_tro`; app PH ⇒ #13).
- **Sau giờ:** khởi tạo xong hệ mở **ảnh thông báo** (Thùy 11/11) — logo, tiêu đề "Thông báo Bổ trợ kiến thức", "Buổi học thứ…, ngày… các bạn sau sẽ ở lại bổ trợ kiến thức sau giờ học", tên từng em in đậm, "Các con sẽ về muộn 20–25 phút". Copy / tải, người gửi vào nhóm lớp.
- **Tin của buổi thường** (OPS, §9): report tối hôm trước · báo tan · báo đến.
- **Thông báo trung tâm** trên app phụ huynh (`thong_bao_ph`: chung · lịch · thi · nhắc; gửi toàn bộ / khối / lớp / một em; có ngày hiệu lực) — nhân sự soạn ở ERP.

## 4. Đăng ký lịch test · test đầu vào

### 4.1 Đăng ký lịch test (Thùy 15/10)
- **Lộc dựng khung test cố định theo tuần** (thứ × giờ, giờ tròn 15′), **mỗi khung một phòng**; cần thêm phòng thì thêm khung cùng giờ. Không giới hạn số em. Đóng một buổi cụ thể ⇒ phòng tự trả lại; bỏ khung = đánh dấu xoá (hẹn cũ vẫn trỏ được).
- **Phụ huynh** vào web (form công khai ⇒ #9): chọn lớp, trường, tích môn; **mỗi môn một ca riêng** — chọn buổi + giờ bắt đầu ⇒ hệ báo thời lượng bài và **giờ xong dự kiến để đón con**. Chỉ gõ tên em + số điện thoại. Web: trong 14 ngày tới, cách giờ hiện tại ≥ 60′.
- **Lộc nhập thay** (PH báo qua Zalo / điện thoại / trực tiếp) bằng **cùng hàm ghi** `_ts_dang_ky_test` (60 ngày, không cần cách giờ). Đổi lịch: PH nhắn, Lộc sửa.
- **Thời lượng** (Thùy chốt): lớp 3–5 = 60′ · Lớp 4 CLC / 5 CLC = 75′ · lớp 6–12 = 90′. Môn chỉ hiện khi khối đó đang có lớp **và** đã khai thời lượng.
- Mỗi môn = một ứng viên ở phễu Tuyển sinh (L5). Trùng số điện thoại + tên + môn với hồ sơ đang chạy ⇒ dùng lại, huỷ hẹn cũ. Tối đa một hẹn hiệu lực / ứng viên. Có đăng ký ⇒ hòm thư ERP báo người nhận (Lộc).
- **Hẹn ≠ ca test.** `dang_ky_test` là hẹn; `ca_test` chỉ sinh khi em **có mặt** (CLAUDE §1.5). "Đã đến" / "lỡ hẹn" là suy ra, không lưu.
- Màn: Tuyển sinh › 📅 Lịch test (Lịch & hẹn — cần xử lý: lỡ hẹn, trường PH tự gõ, lớp × môn chưa khai thời lượng · Cài đặt · Đăng ký test thay PH).
- Số: 12 khung đang sống (đều có phòng) · 20 dòng thời lượng · **0 hẹn từ trước tới nay**, trong khi 30 ngày có 24 ca test (§11 câu 11).

### 4.2 Test đầu vào — chuỗi bốn việc nối nhau (build 07/2026)
```
Điểm danh test + scan bài (OPS) → Chấm (học thuật) → Nhận xét + lớp đề xuất (học thuật) → Trả bài: gửi phiếu cho PH (OPS)
```
- **Việc sau chỉ hiện khi việc trước xong** (suy từ mốc trên `ca_test`: chấm xong · nhận xét xong · trả bài xong). Em không đến ⇒ không có ca ⇒ chuỗi không sinh. Huỷ ca = đổi trạng thái có lý do, khôi phục được (CEO 20/09).
- **Không tính mastery** — ứng viên chưa là học sinh. Thang Đ / C / S chỉ để ra điểm (Đ đủ điểm · C nửa điểm · S 0) và biểu đồ trên phiếu. Mỗi ý = một câu.
- Bài test neo **bản chụp đề**; test đầu vào chỉ lấy đề MT (Thùy 14/11) ⇒ `spec-builder.md` §8.
- **Người chấm / người trả bài mặc định theo khối × môn** (`test_dau_vao_phan_cong`, CEO 13/09), tự gán lúc tạo ca, đổi tay được.
- Tệp scan ≤ 50 MB. Phiếu kết quả xuất ảnh; OPS gửi Zalo.
- Phễu: **L5 đăng ký test → L6 đến test → L7 học thử → chính thức** (chuyển thành học sinh; tích "cần đuổi" thì mở đợt đuổi). Hồ sơ chỉ **loại** (có lý do), không xoá.
- Số: `ca_test` hoàn thành 63 · huỷ 19 · đang test 1.

## 5. Học phí — quy trình thu

> Bảng giá, hệ số là **đầu vào**; cơ cấu doanh thu, báo cáo ⇒ #19. Mọi phép tính tiền ở DB (`fn_hocphi_*`, `hoc_phi_theo_mon_ky`); client chỉ gọi (CLAUDE §2.0).

### 5.1 Kỳ và vòng đời
- **Kỳ = tháng dương lịch.** Một phụ huynh × một kỳ = **tối đa một hoá đơn** (DB chặn trùng).
- **Ảo → Thật:** trong tháng phiếu là **phiếu ảo** tính lại mỗi lần mở (không lưu). **Chốt kỳ** (đầu tháng sau, từng phụ huynh) đông cứng thành hoá đơn + các dòng, một transaction. Người bấm chốt — tiền nhạy cảm, không tự động.
```
phiếu ảo ──Chốt kỳ──► hoá đơn (chưa thu) ──ghi thu──► thu một phần ──► đã thu
                          └─ Huỷ chốt ⇒ về phiếu ảo (Thùy 01/08; §11 câu 9)
```
- **Trạng thái thu do trigger suy từ tổng các lần thu** — client chỉ ghi dòng thu (CEO 30/08). `qua_han` · `xet_duyet` · `mien` có trong DB nhưng 0 dòng.
- Thực tế chốt: kỳ 08 chốt 02–06/09 · kỳ 09 chốt 04/10 → 03/11 · kỳ 10 chốt 03–14/11.

### 5.2 Phiếu gồm gì
`Học phí = học chính + bổ trợ đuổi + học liệu + phát sinh − giảm giới thiệu + nợ kỳ trước`

| Dòng | Luật |
|---|---|
| **Học chính** (em × lớp) | đơn giá buổi của lớp × số buổi × hệ số, làm tròn nghìn. **CT1** = mọi buổi của lớp trong thời gian em ghi danh · **CT2** = buổi đi học + buổi bù. Hệ **đề xuất CT2 khi em nghỉ ≥ 30 % số buổi**; người chọn lại được cho từng em × lớp × kỳ (Thùy 13/07, 01/08) |
| **Bù** | tính theo **tháng của buổi gốc**; một buổi vắng tối đa một bù; buổi bù đã xếp chưa học cũng tính (Thùy 01/08) |
| **Bổ trợ đuổi** | mỗi buổi đuổi em có mặt × **mức học đuổi gán trên buổi**; buổi chưa gán mức ⇒ chưa tính (thà bỏ trống) (Thùy 05/07) |
| **Học liệu** | giá theo mức của lớp, **một lần / em / môn / kỳ** |
| **Phát sinh** | theo lớp (mọi em đang học lớp đó) hoặc theo một em; nhập theo kỳ |
| **Giảm giới thiệu** | phụ huynh cũ giới thiệu em mới ⇒ tín dụng (mặc định 500.000đ), hiệu lực trễ một tháng, trừ dần tới hết, không vượt tổng phiếu (01/08) |
| **Nợ kỳ trước** | nợ khởi tạo + Σ hoá đơn đã chốt − Σ đã thu |

- **Hệ số là của học sinh, không của gia đình** (Thùy 05/07). Hệ gợi ý: 1 − 0,05 (học ≥ 2 môn) − 0,05 (có anh chị em cùng môn); **người xác nhận mới ghi**; sửa tay được. **Hệ số có ngày hiệu lực — đủ một tháng mới giảm** (Thùy 01/08).
- Ba bảng mức độc lập: mức học phí (theo buổi) · mức học đuổi (theo buổi đuổi) · mức học liệu (theo tháng); tên mức tự đặt theo giá.

### 5.3 Thông báo và ghi thu
- **Phiếu thông báo** xuất ảnh / PDF từng phụ huynh (chưa chốt thì là bản xem trước).
- **Ba bước thông báo, mỗi bước có sẵn chữ để copy** (Thùy 05/07): ① thông báo lần 1 ("…vui lòng thanh toán trong tuần này") → ② chưa nộp, đang xử lý → ③ đã hoàn thành. Bước ③ **tự nhảy khi thu đủ** (CEO 30/08). Bấm "Đã báo" ghi mốc; **quá 3 ngày chưa thu ⇒ nhắc "Báo lần 2"** (01/08).
- **Ghi thu:** số tiền · ngày · **hình thức bắt buộc chọn Tiền mặt / Chuyển khoản** (Thùy 12/11) · ghi chú · người thu. Thu nhiều lần cho một hoá đơn được.
- **Công nợ** (tab Học phí nợ): mỗi phụ huynh — nợ khởi tạo (điền tay) + nợ hệ thống; phụ huynh không còn con đang học mà còn nợ được đánh dấu rõ (Thùy 03/08).
- **Màn:** Học phí — HS theo môn · Điểm danh (ma trận lớp × buổi, Thùy 13/07) · Danh sách (chốt, báo, thu) · Học đuổi · Nợ · Giới thiệu · Hệ số · Mức · Phát sinh. Quyền: lá `hocphi`.
- Số: kỳ 10 — 298 hoá đơn: đã thu 241 (421,3 triệu) · chưa thu 54 (92,2 triệu) · thu một phần 3 (12,1 triệu). Kỳ 09 — 286: đã thu 277. Kỳ 11 chưa chốt. Lần thu: chuyển khoản 195 · tiền mặt 1 · 790 dòng trước 12/11 không ghi hình thức. Hệ số đang học: 1,0 — 217 em · 0,95 — 127 · 0,9 — 15 · sửa tay 0,5–0,8 — 4.

## 6. Thu chi — hoàn ứng chi tiêu (Thùy 02/09, 03/09)

- **Chỉ CHI** (thu = học phí). Bản chất = **hoàn ứng**: nhân sự chi tiền túi → tạo khoản → Lộc chuyển trả → ghi sổ → chốt kỳ gửi Ngân. Không tạm ứng, không trả thẳng nhà cung cấp, không duyệt tầng hai. Ngân không dùng ERP.
```
nhân sự tạo ─► chờ duyệt ─(Lộc "Đã thanh toán" + ghi sổ, MỘT giao dịch)─► đã thanh toán (+ một dòng sổ chi)
                   ├─(Lộc từ chối, có lý do)─► từ chối          └─(nhân sự huỷ khi còn chờ)─► huỷ
```
- Ba trạng thái sau là **cuối**, không sửa lùi (sai thì tạo khoản mới). Mọi đổi trạng thái tự ghi log (trigger).
- **Ai cũng tạo được** (nhân sự đang làm): số tiền · mục đích · ngày chi · danh mục gợi ý · ảnh chứng từ (không bắt buộc). Sửa / huỷ khi còn chờ duyệt.
- **Lộc trả** theo mã QR sinh từ tài khoản nhân sự tự khai; nội dung chuyển khoản `BK CHI <mã nhân sự> <mã khoản>`. Lộc sửa số tiền được nhưng **phải ghi lưu ý**.
- **Kỳ chốt cắt theo thời điểm Lộc ghi sổ**, không theo ngày nhân sự gửi: chốt "đến bây giờ", kỳ sau bắt đầu đúng từ mốc đó ⇒ không lọt, không đếm hai lần. **Chốt xong khoá** các dòng sổ trong kỳ. Bản chụp số liệu trong DB là chân lý; ảnh phiếu sinh lại được.
- **Quỹ Lộc giữ + công nợ với Ngân** (Thùy 03/09): định mức quỹ (đổi được trên màn) · Lộc ghi mỗi lần nhận tiền từ Ngân (không gắn kỳ) · hệ tính Ngân còn phải chuyển / Lộc đang giữ. Phiếu chốt = **phiếu quyết toán**.
- Danh mục chi: Lộc tự thêm / sửa / ẩn; gợi ý danh mục theo lịch sử. Thông báo chỉ là huy hiệu số trong app.
- **Màn:** app riêng **BK Chi** (nhân sự) · ERP lá `thuchi`: Duyệt chi · Sổ chi · Chốt kỳ · Danh mục · Tài khoản nhân sự.
- Số: 169 khoản — đã thanh toán 138 (143,0 triệu) · từ chối 23 · huỷ 5 · chờ duyệt 3; 9 kỳ đã chốt (gần nhất 02/11), 11 dòng sổ chưa chốt; 14 danh mục; 26 lần nhận tiền.

## 7. Sự kiện (Thùy 25–26/09)

- **Sự kiện nào cũng vận hành như nhau** ⇒ cấu hình theo sự kiện (phòng chơi, vòng quay, số người / lượt, số ván), không viết cứng cho Trung thu. Dữ liệu **không gắn môn**. **Xu sự kiện là tiền riêng, không vào ví xu của em.**
- **Vai (mỗi việc được giao = một tab; không giao thì không thấy gì):** Check-in · Đăng ký game · Bàn quay · Quản trò · Quản lý (mọi tab + cài đặt + giao việc + điều chỉnh xu). DB chặn theo vai ở mọi hàm; giao / gỡ việc tự ghi log. Tạo sự kiện: chỉ admin hệ thống.
- **Check-in:** nhân sự bấm, tìm theo tên — **chỉ học sinh BK**. Khách ngoài: chỉ ghi tên, hệ cấp **số thứ tự** để phân biệt trùng tên; không check-in, không quay, **vẫn đăng ký game và nhận xu**.
- **Vòng quay:** học sinh BK đã check-in, **một lần / sự kiện** (DB chặn lần hai). Kết quả bốc ở DB theo tỉ lệ cấu hình (Trung thu: 15 / 20 / 25 xu — 70 / 20 / 10 %); **tỉ lệ không công bố**, vòng quay vẽ ô đều.
- **Hàng đợi phòng chơi:** mỗi người **một chỗ chờ** tại một thời điểm (DB chặn), chơi xong đăng ký lại không giới hạn. Mỗi lượt tối đa 6 người; quản trò chủ động bắt đầu khi ít hơn. **Vắng lần 1 giữ vị trí; vắng lần 2 loại khỏi hàng.** Đăng ký miễn phí.
- **Một lượt = 3 ván liền; xu trả ngay sau mỗi ván** (Nhất 5 · Nhì 3 · còn lại 2); đủ 3 ván lượt tự kết thúc (Thùy 26/09 chiều). Kết quả lấy từ iPad; khoá chống cộng đúp = (lượt, người, ván). Đã trả xu ván nào thì không huỷ lượt — dùng "Kết thúc sớm". Hỏng tự động ⇒ quản lý điều chỉnh xu tay.
- **Quầy quà đã bỏ khỏi app** (Thùy 26/09: "việc đổi quà không liên quan đến hệ thống này"); vai + hàm còn trong DB, không ai được giao.
- **Màn:** app riêng **BK Sự kiện** (ERP vẫn có lá `su_kien`, cùng component) · TV Vòng quay · TV Hàng chờ.
- **Game Trung thu** (`games-site/`): 5 game iPad (40 giây / trận, Nhất 5 · Nhì 3 · còn lại 2) + 4 game chiếu TV; luật từng game ở `games-site/luat-choi.html`. `_luu-tru/luat-choi-game.md` là lịch sử. Bản buổi học của các game ⇒ #12.
- Bảng `sk_*` do `postgres` sở hữu ⇒ phiên Claude **không đếm được** (0 dòng từ CLI không phải bằng chứng).

## 8. Tủ quà — đổi quà bằng xu (Thùy 30/08)

- **Tiền = xu, một sổ duy nhất** `qlht_xu_ledger` (chỉ thêm). **Số dư = Σ toàn sổ**; **tồn quà = Σ nhập đã vào kho − Σ đổi không huỷ** — không lưu số dư, không lưu tồn. Ví xu **không gắn môn**.
- **App OPS là đầu ghi duy nhất** (tab Quà); mọi ghi qua `fn_tuqua_*`, client không tự viết dòng sổ. Hàm khoá dòng theo thứ tự cố định (em → quà → phiếu) ⇒ hai máy cùng tiêu một ví chỉ một máy thành công.
- **Đổi tại tủ:** chọn em → quà → trừ xu + giao ngay (có "đổi trước — giao sau" cho ca đặc biệt). Huỷ = hoàn xu, bắt buộc lý do; quà tự về tồn.
- **Đơn đặt theo yêu cầu:** tạo đơn (chưa trừ xu) → **duyệt = chốt giá + trừ xu ngay** → hàng về → giao. Từ chối (chưa trừ, không hoàn) / huỷ (đã trừ, hoàn đủ) đều bắt buộc lý do.
- **Kho:** phiếu nhập dương = chờ vào kho → **xác nhận số thực** mới cộng tồn; phiếu âm (xuất / hao hụt) trừ ngay, bắt buộc lý do. Quà ngừng bán = tắt cờ.
- Mọi đổi trạng thái (đổi · đơn · nhập · quà) tự ghi `qlht_log` (trigger). Quyền: lá `tu_qua`.
- Số: 82 quà · 603 lượt đổi (đã giao 585 · huỷ 18; 30 ngày: 255) · 32 đơn đặt (**12 chờ duyệt, từ 08/11**) · 145 phiếu nhập.
- Chưa có: em tự đặt trên app HS · tách quyền duyệt đơn · kiểm kê / cảnh báo tồn thấp.

## 9. App OPS · việc vận hành OPS

- **App OPS** (bundle riêng, iPad / iPhone trước; cùng DB, cùng đăng nhập, quyền theo lá như ERP; tài khoản học sinh bị chặn). Bảy tab: **Hôm nay · Điểm danh · Report · Prep · Test · Tủ quà · Của tôi**. Không scan (máy scan ở PC). Bổ trợ, Lịch phòng, duyệt, phân công ở ERP.
- **Phân công theo CA TRỰC** (Thùy 19/07): ba ca cố định mọi ngày — **Sáng 08:00–12:00 · Chiều 14:00–18:00 · Tối 18:00–21:30**. Mỗi (thứ × ca) một người trực, có hiệu lực từ – đến; **không đóng băng tuần, không bảng ngoại lệ** (Thùy 06/07). Lớp thuộc ca nào suy từ giờ bắt đầu; lớp ngoài ba khung ⇒ nêu cờ. Ca trống người ⇒ cờ đỏ.
- **Việc = invariant, không bảng việc:** việc của tôi = (TKB đang hiệu lực × ca tôi trực) cần bằng chứng, trừ bằng chứng đã có. Dòng chỉ sinh **lúc đóng việc**.

| Việc | Của ai | Hạn | Bằng chứng | Luật |
|---|---|---|---|---|
| **Điểm danh** buổi | người trực ca của buổi | giờ bắt đầu + 45′ (CEO 07/09) | ô điểm danh | §1.3 |
| **Report trước buổi** — mỗi lớp một tin | **người trực ca Tối hôm trước** làm hết (Thùy 19/07) | **20:00 tối hôm trước** (Thùy 06/07) | ảnh chụp tin đã gửi; chưa có ảnh không đóng được | chữ soạn động từ TKB, mẫu cố định (Thùy 08/10): "Các phụ huynh lưu ý, ngày mai, thứ… ngày…, các con sẽ có lịch học từ 19h30 - 21h…" — giờ kiểu 24h |
| **Báo tan** | người trực ca của buổi | giờ tan + **45′** (Thùy 08/10) | ảnh | tin cố định "Lớp đã tan ạ."; một tin cho cả lớp |
| **Prep phòng** | người trực ca | Sáng / Chiều: đóng trong **[giờ ca − 60′, giờ ca − 30′]**; Tối: **15′ trước ca** (Thùy 19/07) | tích Đã dọn phòng + Đã chuẩn bị KIT + **ảnh chụp lúc đóng**; đóng sớm hơn cửa bị chặn | **mỗi ca dọn đủ 7 phòng, không phụ thuộc TKB** (Thùy 19/07) |
| **Coi test đầu vào** · **trả bài** | OPS | — | ca test · mốc trả bài | §4.2 |

- **Tiến độ đo tại mốc hệ thấy được** (lúc đóng / lúc tải lên), so với hạn: đúng hạn · trễ < 12 giờ · 12–24 giờ · ≥ 24 giờ. **Hiệu suất = chất lượng − (100 − tiến độ)**, không nhân.
- **Duyệt gom theo ngày** (Thùy 08/10): trưởng / phó Vận hành (hoặc admin) duyệt một lần cả Report + Báo tan + Prep của ngày; chất lượng mặc định 100, chỉ sửa khi có lỗi (gửi sai nhóm, phòng chưa sạch).
- **"Của tôi"** (CEO 06/09): thanh đạt chuẩn + bốn số + xếp hạng trong team OPS; đọc bảng tính sẵn ≤ 10 phút (15/11). Việc "không đạt" chỉ tính khi gậy còn hiệu lực (⇒ #11).
- **Quy trình học sinh mới** (27/10; Vận hành › Quy trình HS mới): danh mục bước (5 bước, có màu, xoá mềm) × từng em mới — **tick = sinh dòng, bỏ tick = xoá dòng**, tự ghi log; màn Theo dõi lọc em chưa đủ bước.
- **Scan ET bằng máy đọc phiếu** (Story 4 của spec 07/2026): **gác lại, chưa build.**
- Số 30 ngày: report 164 · báo tan 133 (đều có ảnh; đã duyệt 84 và 49) · prep 139 lượt đã mở, 134 đã đóng, leader chốt 91, **GV chấm phòng 0** · 12 dòng phân công ca đang hiệu lực · 100 tick HS mới.

## 10. Bảng · hàm · trigger

**Bảng (giá trị hợp lệ theo CHECK 17/11):**

| Bảng | Vai trò | Giá trị |
|---|---|---|
| `thoi_khoa_bieu` | TKB có hiệu lực | `thu` 2–8 |
| `buoi_hoc` · `buoi_hoc_hs` | Buổi + em trong buổi | `loai` §1.2 · `trang_thai` mo · hoan_tat · huy · `diem_danh` co_mat · vang · vang_phep · `don_vi` 1 · 2 · 3 · 4 |
| `phong` · `hoat_dong_phong` (+ `_log`) | Danh mục phòng · phát sinh | `loai` hop_noi_bo · hoc_tap_ngoai_lich · viec_khac · `trang_thai` xac_nhan · huy |
| `lich_truc_bo_tro` · `lich_khoi_chot` | Lịch khối · bản chụp chốt tuần | `thu` 2–8 · `so_ta` 1–2 · **bắt buộc `khoi` và `bac`** |
| `ca_bo_tro` · `ca_bo_tro_nhe` | Ca của một ngày · ca sau giờ | `trang_thai` mo · huy · `kieu` sau_buoi · khac |
| `bang_khong_bu` | Đóng lượt nghỉ không bù | khong_can_bu (351) · khong_xep_duoc (188) |
| `lich_test_khung` · `lich_test_dong` · `test_dau_vao_thoi_luong` · `truong_hoc_dm` · `dang_ky_test` (+ `_web_log`) · `lich_test_log` · `tuyen_sinh_nhan_bao` | Đăng ký lịch test | khung `thu` **1–7 (ISO)** · thời lượng 45 · 60 · 75 · 90 · 120 · hẹn `trang_thai` hen · huy · `nguon` web · nhap_thay · `kenh` zalo · dien_thoai · truc_tiep · khac |
| `ung_vien` (+ `_log`, `_viec`) · `ca_test` (+ `_cau`, `_cau_kq`, `_log`) · `test_dau_vao_phan_cong` (+ `_log`) | Phễu + test đầu vào | `level` L5 · L6 · L7 · `trang_thai` dang_chay · loai · da_convert · ca `trang_thai` dang_test · hoan_thanh · huy |
| `hoa_don` (+ `_dong`, `_log`) · `thanh_toan` | Hoá đơn kỳ + lần thu | `trang_thai` chua_thu · thu_mot_phan · da_thu · qua_han · xet_duyet · mien · `trang_thai_tb` thong_bao_1 · cho_xu_ly · hoan_thanh · dòng `loai` hoc_phi · hoc_duoi · hoc_lieu · phat_sinh · no_ky_truoc · giam_gioi_thieu · `phuong_thuc` tien_mat · chuyen_khoan |
| `muc_hoc_phi` · `muc_hoc_duoi` · `muc_hoc_lieu` · `hoc_sinh_he_so` · `hoc_phi_cong_thuc` · `hoc_phi_phat_sinh` · `hoc_phi_tin_dung` · `hoc_phi_xet_duyet` (di tích) | Đầu vào học phí | `cong_thuc` ct1 · ct2 · phát sinh `loai` lop · ca_nhan |
| `chi_khoan` (+ `_log`) · `chi_so` · `chi_ky` (+ `_danh_muc`) · `chi_danh_muc` · `chi_nhan_tien` (+ `_log`) · `chi_cau_hinh` | Thu chi | `trang_thai` cho_duyet · da_thanh_toan · tu_choi · huy |
| `sk_su_kien` · `sk_phong` · `sk_nguoi_choi` · `sk_checkin` · `sk_xu` · `sk_dang_ky` (+ `_log`) · `sk_luot` · `sk_phan_cong` (+ `_log`) | Sự kiện | đăng ký cho · co_mat · dang_choi · xong · bo · huy · xu `nguon` vong_quay · game · doi_qua · dieu_chinh · `vai` checkin · dangky · quay · quantro · quaqua · quanly |
| `qlht_xu_ledger` · `qlht_qua` · `qlht_doi_qua` · `qlht_qua_order` · `qlht_qua_nhap` · `qlht_log` | Tủ quà | đổi cho_giao · da_giao · huy · đơn cho_duyet · da_duyet · da_ve · da_giao · tu_choi · huy · nhập cho_vao_kho · da_vao_kho · huy |
| `phan_cong_ca` · `vh_ops_task` · `prep_phong` · `hs_moi_buoc` · `hs_moi_tick` (+ `_log`) · `phan_cong_ops` (ngừng dùng) | Việc OPS | `ca` / `luot` sang · chieu · toi · `tab` report · tan |
| `thong_bao_ph` | Thông báo trên app phụ huynh | `loai` chung · lich · thi · nhac |

**Hàm chính:** lịch phòng `fn_phong_lich` · `fn_phong_kiem_trung` · `fn_tkb_kiem_trung` · `fn_tkb_luu` ·
lịch khối `fn_lich_truc_luu` · `fn_lich_truc_kiem_trung` · `fn_lich_truc_xoa` · `fn_lich_khoi_chot_tuan` · `fn_lich_khoi_chot_trang_thai` ·
ca `fn_ca_bo_tro_ngay` · `fn_ca_bo_tro_tuan` · `fn_ca_bo_tro_sinh_ngay` · `fn_ca_bo_tro_ung_vien` · `fn_ca_bo_tro_xep` · `fn_ca_bo_tro_go` · `fn_ca_bo_tro_huy` · `fn_ca_bo_tro_tao` · đơn vị / suất `_ca_bo_tro_don_vi` · `_ca_bo_tro_dv_bu_*` · `_ca_bo_tro_suc_nguoi` · `_bt_trong_so_lop` · `_btyeu_dv_tuan` · `fn_btyeu_capacity_khoi` ·
bù `fn_bu_lan_nghi_can_xep` · sau giờ `fn_btnhe_tao` · lịch của em `fn_hs_lich_bo_tro` ·
test `fn_ts_dk_form` · `fn_ts_dang_ky_test_web` · `fn_ts_dang_ky_test_nhap` · `_ts_dang_ky_test` · `fn_ts_lich_test_tong_quan` · `fn_ts_hen_doi_lich` · `fn_ts_hen_huy` ·
học phí `hoc_phi_theo_mon_ky` · `fn_hocphi_phieu_ao` · `fn_hocphi_chot_ky` · `fn_hocphi_so_du_no` · `fn_hocphi_no_theo_ph` · `fn_hocphi_tin_dung_con_lai` · `fn_hocphi_he_so_goi_y` · `fn_hocphi_he_so_hieu_luc` · `fn_hocphi_chi_tiet_ky` · `fn_hocphi_tong_hop_ky` ·
thu chi `fn_chi_*` (18) · sự kiện `fn_sk_*` (25) · tủ quà `fn_tuqua_*` (18) ·
OPS `fn_viec_ops_thuong` · `fn_ops_cho_duyet` · `fn_ops_duyet_ngay` · `fn_ops_la_nguoi_duyet` · `fn_ops_dashboard` · `fn_vh_hieu_suat` · `fn_hs_moi_dashboard` · `fn_hs_moi_tick`.

**Trigger (code ẩn — nghi đầu tiên khi ghi bị chặn):**

| Trigger | Bảng | Làm gì |
|---|---|---|
| `trg_ca_bo_tro_phong` | `ca_bo_tro` | chặn ca bổ trợ thứ 3 cùng phòng giao giờ |
| `trg_buoi_bo_tro_gan_ca` | `buoi_hoc` | buổi bổ trợ đổi ngày / giờ / người ⇒ tự gắn lại vào ca khớp |
| `trg_buoi_bo_tro_khoa_ngay` | `buoi_hoc` | buổi bổ trợ đã học xong không đổi ngày / giờ |
| `trg_buoi_dv_bu` · `trg_hh_dv_bu_ins / _upd / _del` | `buoi_hoc` · `buoi_hoc_hs` | tính lại đơn vị bù của cả nhóm khi nhóm đổi |
| `trg_btyeu_mot_buoi_cho_hoc` | `buoi_hoc_hs` | một case yếu tối đa một buổi chờ học |
| `trg_btnhe_dong_case` | `buoi_hoc` | buổi sau giờ xong / huỷ ⇒ đóng case sau giờ |
| `trg_buoi_hoc_phase_log` · `trg_buoi_hoc_online_log` · `trg_buoi_giai_log` | `buoi_hoc` | ghi vết đổi khâu của buổi |
| `trg_lich_test_khung_chan_trung` | `lich_test_khung` | khung test trùng TKB / khung khác cùng phòng ⇒ chặn |
| `trg_log_lich_test_khung` · `_dong` · `trg_log_dang_ky_test` | lịch test | ghi `lich_test_log` |
| `tg_ca_test_phan_cong` · `trg_log_ca_test` · `trg_log_ung_vien` · `trg_ung_vien_doi_khoi_phan_cong` | `ca_test` · `ung_vien` | gán người chấm / trả bài mặc định · ghi log |
| `tg_thanh_toan_trang_thai` | `thanh_toan` | suy trạng thái hoá đơn + bước thông báo từ tổng đã thu |
| `trg_log_hoa_don` | `hoa_don` | ghi `hoa_don_log` |
| `tg_chi_khoan_bf` · `tg_chi_khoan_log` · `tg_chi_so_bf` · `tg_chi_nhan_tien_log` | thu chi | khoá trạng thái cuối · log · khoá sổ đã chốt kỳ |
| `sk_dang_ky_log_trg` · `sk_phan_cong_log_trg` | sự kiện | log |
| `trg_log_qlht_doi_qua` · `_qua` · `_qua_nhap` · `_qua_order` | tủ quà | ghi `qlht_log` |
| `trg_log_hoat_dong_phong` · `trg_log_hoc_sinh_lop` · `hs_moi_tick_log_trg` | — | log |

**Việc chạy theo lịch** (bộ điều phối `tinh_san_dang_ky`, không cron riêng): `sau_gio_reset_tuan` 0h · `btyeu_het_han` 01h · `bt_muc_het_tuan` 01h · `viec_lh` 5′ · `dash_viec_thang` 10′.

**Code:** lib `phong.ts` · `ca_bo_tro.ts` · `botro.ts` · `botro_nhe.ts` · `gami.ts` (buổi, điểm danh) · `opsvanhanh.ts` · `opsdash.ts` · `hsmoi.ts` · `dangKyTest.ts` · `tuyensinh.ts` · `hocphi.ts` · `thuchi.ts` · `sukien.ts` · `tuqua.ts` · `thongbao.ts` ·
màn `phonghoc/*` · `botro/LichPhongScreen` · `LichTrucScreen` · `LichKhoiModal` · `BoTroNheScreen` · `ThongBaoSauGioAnh` · `ops/*` · `vanhanhops/*` · `tuyensinh/*` · `hocphi/*` · `thuchi/*` · `chi/*` · `sukien/*` · Edge Function `supabase/functions/dang-ky-test`.

## 11. Lệch · câu hỏi cho Thùy

### 11.0 THÙY CHỐT 17/11 — "Chốt theo đề xuất"

| Câu | Luật chốt | Việc code / DB (chờ lệnh) |
|---|---|---|
| 1 | Em **L3 / L4 vào ca khối tốn 2 đơn vị như L2** (bỏ "L3, L4 = 4"). | `_ca_bo_tro_don_vi` |
| 2 | **Lịch khối có ca của GIÁO VIÊN**; em L3 / L4 chỉ xếp vào ca giáo viên; em L4 không vào ca của giáo viên đang dạy lớp em. *Ai chọn giáo viên cho em L4: câu hỏi kèm không có đề xuất — CTO chọn tạm **Lộc chọn lúc xếp** (trưởng bộ môn hậu kiểm); Thùy đổi nếu khác.* | cột "loại người trực" ở lịch khối + lọc ứng viên theo mức |
| 3 | Suất ca tính theo **bậc của LỚP EM** (S 0,5 · A 0,75 · B / C 1 — luật 09/10); **bỏ ô "bậc" trên dòng Lịch khối**. | bỏ cột bắt buộc ở màn lịch khối |
| 4 | (i) nhóm bù ≥ 3 em cùng bài luôn tính 6 đơn vị · (ii) ca 30 phút chỉ nhận một em L2 hoặc em thứ 3 của nhóm bù, không nhận đuổi · (iii) bù xếp buổi nghỉ cũ hơn trước · (iv) giữ bảng "sức chứa khối" (0,4 × đơn vị lịch khối, chỉ hiển thị), đếm đủ L2–L4. | `fn_btyeu_capacity_khoi` + luật đơn vị nhóm bù |
| 5 | Lịch phòng có nút **"Copy tin báo PH"** theo mẫu cố định cho ca khối / bù / đuổi (không tự gửi); **ca sau giờ hiện trong lịch trên app** em / phụ huynh. | nút + lịch app |
| 6 | **Lộc chốt tuần Lịch khối trước 12:00 thứ Hai**; chưa chốt ⇒ hiện ở Việc của Lộc. **Lưu Lịch khối bắt buộc có phòng** (25 / 57 dòng đang thiếu phòng phải bổ sung). | invariant việc + chặn lưu thiếu phòng |
| 7 | Điểm danh: buổi thường chỉ tài khoản có quyền điểm danh ghi; ca bổ trợ chỉ người đứng ca; **mọi lần đổi ô điểm danh tự ghi vết** (ai · lúc nào · từ gì sang gì). *Nút "Báo đến PH" (11 / 224 lượt): câu kèm không có đề xuất — giữ nguyên, chưa bắt buộc.* | policy + trigger log `buoi_hoc_hs` |
| 8 | Học phí có **hạn thu = 7 ngày sau ngày báo lần 1** (số gợi ý, Thùy chưa cho số khác); quá hạn ⇒ trạng thái "quá hạn" + hiện ở Việc của Lộc. *"Miễn" / "xét duyệt" (chưa từng dùng): giữ nguyên, chưa gỡ.* | hạn + trạng thái + invariant việc |
| 9 | **Hoá đơn đã có lần thu thì KHÔNG huỷ chốt được**; sai ⇒ thêm dòng điều chỉnh ở kỳ sau. | chặn ở hàm huỷ chốt (đưa xuống DB) |
| 10 | (i) mỗi phòng có cờ "cần prep" (thay danh sách 7 phòng viết cứng) · (ii) **bỏ khâu giáo viên chấm chất lượng phòng**, trưởng Vận hành chốt · (iii) việc OPS chưa duyệt **tự coi là đạt sau 7 ngày**. | cờ phòng · gỡ khâu GV · job tự đạt |
| 11 | Đăng ký lịch test: **bắt đầu gửi link cho phụ huynh + Lộc bắt buộc nhập hẹn thay cho mọi ca**. Phễu: L5 · L6 · L7 rồi chính thức = đã thành học sinh. | invariant "ca test không có hẹn" |
| 12 | (i) Đơn đặt quà: **Lộc duyệt trong 3 ngày**, quá hạn hiện ở Việc của Lộc · (ii) **xu sự kiện đổi quà tại sự kiện, ngoài hệ; hết sự kiện xu mất giá trị**. | invariant việc |

### 11.1 Câu hỏi gốc (ĐÃ TRẢ LỜI ở 11.0 — giữ làm bối cảnh)

1. **Em L3 / L4 vào ca khối thì tốn mấy đơn vị?**
   Thùy 17/11: L3, L4 "xếp giống L2, chỉ khác người dạy". Thang 11/11 đang chạy: L2 tốn 2, L3 và L4 tốn 4 (gấp đôi chỗ trong ca).
   (a) L3 / L4 cũng tốn 2 như L2. (b) Giữ 4 vì em nặng hơn cần nhiều thời gian hơn.
   **Đề xuất: (a)** — đúng chữ "giống L2"; em nào cũng chỉ một buổi / tuần.

2. **Giáo viên dạy L3 / L4 vào ca khối bằng cách nào?**
   Hiện: người dạy mặc định là TA trực ca; hệ không kiểm người dạy L3 / L4 có phải giáo viên không — Lộc phải tự nhớ đổi tay.
   (a) Lịch khối có thêm **ca của giáo viên** (người trực là giáo viên); em L3 / L4 chỉ xếp được vào ca đó, em L4 không xếp được vào ca của chính giáo viên đang dạy lớp em. (b) Em L3 / L4 vẫn vào ca TA, Lộc đổi người dạy sang giáo viên cho riêng buổi của em, hệ chặn nếu chưa đổi.
   **Đề xuất: (a)** — giáo viên có lịch cố định, Lịch phòng thấy được, không lẫn với sức chứa của TA. Kèm: ai chọn giáo viên cho em L4 — trưởng bộ môn lúc duyệt hay Lộc lúc xếp?

3. **Suất của ca còn tính theo bậc lớp không?**
   24/09: "không phân biệt S / A / B / C", mỗi TA tối đa 3 em. 09/10: em lớp S tính 0,5 · A 0,75 · B / C 1 (ca toàn S nhận 6 em). Đang chạy theo 09/10; ứng viên của ca không lọc theo bậc, nhưng mỗi dòng Lịch khối vẫn **bắt buộc chọn bậc** (57 dòng: A 30 · B 18 · S 9) dù bậc đó không dùng để làm gì.
   **Đề xuất: giữ suất theo bậc của LỚP EM (09/10); bỏ ô "bậc" trên dòng Lịch khối.**

4. **Bốn chỗ luật đơn vị còn hở:**
   (i) Nhóm bù **4 em trở lên** cùng bài: đang tạm 2 / em (4 em = 8, vượt ca 6). Đề xuất: nhóm ≥ 3 em luôn tính 6.
   (ii) **Ca 30 phút** (3 đơn vị) nhận được gì? Đề xuất: chỉ một em L2 hoặc em thứ 3 của nhóm bù; không nhận đuổi.
   (iii) **Ưu tiên trong Bù**: đang xếp buổi nghỉ cũ hơn trước. Đề xuất: xác nhận.
   (iv) **Bảng "sức chứa khối" = 0,4 × đơn vị lịch khối** (chỉ hiển thị): sau khi bỏ trần có giữ không, và 0,4 là số ai chốt? Đề xuất: giữ để Lộc thấy khối nào thiếu ca, đếm đủ L2–L4.

5. **Báo phụ huynh cho ca khối và buổi bù: có cần hệ soạn sẵn không?**
   Hiện chỉ Sau giờ có ảnh thông báo. Ca khối / bù / đuổi: Lộc tự nhắn trước khi xếp, hệ không lưu dấu vết đã báo. App em / phụ huynh hiện lịch yếu · bù · đuổi sắp tới nhưng **không hiện ca sau giờ**.
   (a) Giữ như hiện tại. (b) Thêm nút "Copy tin báo PH" theo mẫu cố định ở Lịch phòng (không tự gửi) + đưa ca sau giờ vào lịch trên app.
   **Đề xuất: (b).**

6. **Chốt tuần Lịch khối: ai bấm, trước mấy giờ, quên thì nhắc ai? Lịch khối có bắt buộc có phòng không?**
   Hiện: ai là nhân sự cũng bấm được; chưa có nhắc việc; **25 / 57 dòng lịch khối chưa có phòng** (khối 9: 9 / 10) ⇒ 37 / 87 ca sắp tới không có phòng, không kiểm trùng phòng được.
   **Đề xuất: Lộc chốt trước 12:00 thứ Hai (trước lượt chốt bổ trợ chiều thứ Hai), chưa chốt thì hiện ở Việc của tôi của Lộc; từ nay lưu Lịch khối bắt buộc có phòng.**

7. **Điểm danh: ai được ghi, có cần ghi vết không?**
   Luật: buổi thường chỉ OPS điểm danh; ca bổ trợ TA đứng ca điểm danh. Hiện DB cho **mọi nhân sự** sửa ô điểm danh và **không ghi lại ai sửa, lúc nào, từ gì sang gì** — trong khi điểm danh quyết định học phí, bù và lương.
   **Đề xuất: (i) buổi thường chỉ tài khoản có quyền điểm danh ghi được, ca bổ trợ chỉ người đứng ca; (ii) mọi lần đổi ô điểm danh tự ghi vết.** Kèm: nút **"Báo đến PH"** 30 ngày chỉ dùng 11 / 224 lượt vắng — bỏ, hay thành việc bắt buộc của OPS?

8. **Học phí có hạn thu cứng và trạng thái "quá hạn" không?**
   Hiện: tin lần 1 ghi "thanh toán trong tuần này"; quá 3 ngày sau khi bấm "Đã báo" màn nhắc "Báo lần 2"; không có ngày hạn. Kỳ 10 còn 57 hoá đơn chưa thu đủ (tổng giá trị 57 hoá đơn đó: 104 triệu), cả 57 vẫn ở bước "thông báo lần 1".
   (a) Giữ như hiện tại. (b) Hạn = N ngày sau ngày báo lần 1; quá hạn tự thành "quá hạn" và hiện ở Việc của Lộc.
   **Đề xuất: (b), Thùy cho N (gợi ý 7 ngày).** Kèm: "miễn" và "xét duyệt" có trong hệ nhưng chưa từng dùng — bỏ hay giữ?

9. **Huỷ chốt một hoá đơn đã có tiền thu: có cho không?**
   Hiện (01/08): huỷ chốt **xoá hẳn** hoá đơn, các dòng, các lần thu và nhật ký của nó — phiếu về tạm tính, chốt lại sau; không còn dấu vết đã từng thu.
   (a) Giữ. (b) Hoá đơn đã có lần thu thì không huỷ chốt được — sai thì thêm dòng điều chỉnh vào kỳ sau. (c) Vẫn cho huỷ nhưng không xoá — đánh dấu huỷ, giữ lần thu và chuyển sang hoá đơn chốt lại.
   **Đề xuất: (b)** — tiền đã thu không được biến mất khỏi sổ.

10. **Việc OPS — ba điểm:**
    (i) **Prep dọn phòng nào?** Luật 19/07: mỗi ca đủ 7 phòng (101 → 303). Danh mục nay có 10 phòng (thêm P100, P103, P401). Đề xuất: mỗi phòng có cờ "cần prep", danh sách lấy từ danh mục.
    (ii) **Giáo viên chấm chất lượng phòng**: 30 ngày 0 / 134 lượt. Đề xuất: bỏ khâu giáo viên, trưởng Vận hành chốt.
    (iii) **Duyệt việc OPS**: mới duyệt 133 / 297 report + báo tan, 91 / 134 prep. Việc chưa duyệt có tự coi là đạt sau N ngày không? Đề xuất: tự đạt sau 7 ngày.

11. **Đăng ký lịch test: chưa có hẹn nào trong hệ.**
    12 khung test đã dựng, form web đã chạy, nhưng bảng hẹn **0 dòng** từ 15/10 tới nay, trong khi 30 ngày có 24 ca test — nghĩa là mọi ca đều hẹn ngoài hệ.
    (a) Link chưa gửi cho phụ huynh — bắt đầu gửi. (b) Lộc bắt buộc nhập hẹn thay cho mọi ca (để Lịch phòng thấy số em, điểm danh test tự điền). (c) Bỏ bước hẹn.
    **Đề xuất: (a) + (b).** Kèm: phễu trong hệ chỉ có L5 · L6 · L7 rồi "chính thức" — nguồn cũ ghi L5–L8; xác nhận "L8 = đã chuyển thành học sinh".

12. **Tủ quà và xu sự kiện:**
    (i) **12 đơn đặt quà đang chờ duyệt** (cũ nhất 08/11): ai duyệt, hạn mấy ngày? Hiện ai có quyền tủ quà cũng duyệt được. Đề xuất: Lộc duyệt trong 3 ngày, quá hạn hiện ở Việc của Lộc.
    (ii) **Xu sự kiện** (tiền riêng của từng sự kiện) dùng vào đâu — câu để mở từ 26/09. Đề xuất: đổi quà ngay tại sự kiện, ngoài hệ; hết sự kiện xu mất giá trị.

### 11.2 Lệch kỹ thuật (không cần Thùy quyết — làm khi có lệnh)

1. `fn_phong_lich` nhánh ⑥ (chiếu lịch khối) **còn luật cũ "một TA một ca / khung giờ"** đã gỡ ở `fn_ca_bo_tro_sinh_ngay` 14/11 ⇒ ngày chưa sinh ca, Lịch phòng hiện ít dòng hơn số ca sẽ sinh.
2. `fn_btyeu_capacity_khoi`: vẫn đếm mức 2–3 (thiếu L4), còn cộng Hình, dùng `current_date` (không theo giờ VN).
3. `_ca_bo_tro_don_vi`, `fn_ca_bo_tro_xep`, `fn_ca_bo_tro_ung_vien` còn nhánh `hinh`; chú thích trong `_ca_bo_tro_don_vi` còn ghi "L4 GV riêng ngoài ca khối" (trái Thùy 17/11).
4. `lib/ca_bo_tro.ts` dòng đầu ghi "Yếu L2 4 đơn vị" — DB là 2.
5. `fn_ca_bo_tro_go` **xoá cứng** dòng `buoi_hoc_hs` khi gỡ em khỏi buổi bù — không còn vết lượt xếp (CLAUDE §4).
6. Ô điểm danh: policy `buoi_hoc_hs` cho mọi nhân sự ghi; **không có trigger log** (câu 7).
7. `thanh_toan`: policy cho **mọi nhân sự** ghi / xoá, trong khi `hoa_don` yêu cầu quyền `hocphi`. `lich_truc_bo_tro`, `thoi_khoa_bieu`, `phong` cũng mở ghi cho mọi nhân sự (đường chuẩn là hàm, nhưng ghi thẳng bảng không bị chặn).
8. `hocphi.ts`: huỷ chốt xoá 4 bảng thẳng từ client, không transaction (câu 9); `capNhatTrangThaiTB`, `danhDauDaBao`, `setNoKhoiTao`, mức, phát sinh, tín dụng, công thức ghi thẳng bảng; kỳ hiện tại lấy theo giờ máy.
9. Hoá đơn kỳ cũ đứng mãi ở "chưa thu": nợ được cuộn sang dòng "nợ kỳ trước" của hoá đơn sau và tiền ghi vào hoá đơn sau ⇒ 51 hoá đơn kỳ 07–09 còn `chua_thu` / `thu_mot_phan` dù **tất cả đều có hoá đơn kỳ sau**. Số "chưa thu theo kỳ" vì vậy không đọc thẳng từ `trang_thai` được.
10. `hoc_phi_xet_duyet` (7 dòng) + trạng thái `xet_duyet`: di tích cổng xét duyệt đã bỏ 01/08. `phan_cong_ops` (65 dòng): ngừng dùng từ 19/07, chưa xoá.
11. Việc OPS **hai nơi tính**: `opsvanhanh.ts` (`getMyOpsTasks`, `luotPrepCuaKhoang`, cửa prep, mốc 20:00 / 45′) ở client và `fn_viec_ops_thuong` ở DB — hai bản công thức (CLAUDE §2.0). `DANH_SACH_PHONG` 7 phòng viết cứng ở client.
12. Hai quy ước thứ: TKB / lịch khối 2–8, khung test 1–7 (ISO).
13. 194 buổi thường trước hôm nay còn `mo` (cũ nhất 03/09) — chưa đủ ET + đánh giá + BTVN; chưa có luật tự đóng.
14. `spec-dang-ky-test.md` ghi "chưa chặn chiều ngược (sửa TKB vào phòng đang là khung test)" — DB 17/11 **đã chặn** (`fn_tkb_kiem_trung`, mig 10/11). `spec-su-kien.md` §10: 6 migration sự kiện áp qua SQL Editor, chưa ghi sổ `_migrations`; bảng `sk_*` thuộc `postgres`.
15. `hoa_don.trang_thai` còn `qua_han` · `xet_duyet` · `mien`; `ung_vien.level` CHECK không có L8 nhưng nhãn màn có "L8 Chính thức".
16. 1 / 74 lượt đuổi có mặt 60 ngày thiếu mức học đuổi (xếp qua ca khối — `fn_ca_bo_tro_xep` không gán mức) ⇒ buổi đó chưa tính tiền.

## 12. Đã làm khi Thùy chốt (17/11)

- `spec-xep-bo-tro-chung.md` · `spec-su-kien.md` · `PLAN-tuqua.md` → `_luu-tru/`. `spec-dang-ky-test.md` chờ #9 · `PLAN-thu-chi.md` chờ #19.
- `_luu-tru/spec-bo-tro-ban-13-11.md`: §41–§43 hết ngoại lệ (đã vào §2, §3 spec này). `spec-bo-tro.md` + CLAUDE.md §7 + `SPEC-INDEX.md` trỏ sang.
- **Còn nợ:** Thùy soát §5 Học phí · mọi việc code / DB ở §11.0 + §11.2 chờ lệnh.
