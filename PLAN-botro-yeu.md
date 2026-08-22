# PLAN — Bổ trợ yếu, giai đoạn 3→10 (tiếp nối `PLAN-danhgia-hoctap.md`)

> Đọc `PLAN-danhgia-hoctap.md` trước — file đó là NỀN (giai đoạn 1-2: phát hiện + máy đề xuất level +
> duyệt). File này chỉ nói phần TIẾP THEO: khi 1 case bổ trợ yếu đã "mở" (level ≥1), phải làm gì tới
> lúc đóng case + đánh giá hiệu quả. Chốt qua hội thoại Thùy 08-17.
>
> **Ranh giới thật (verify code 08-17):** giai đoạn 1-2 đã build khá sâu (`src/gami/danhgia.js`,
> `src/lib/danhgia.ts`, `DashboardHocTapScreen.tsx` có khối "Duyệt"). Bảng `bo_tro_yeu`/`bo_tro_yeu_dang`
> **chỉ có schema, 0 dòng, chưa code nào INSERT** — toàn bộ phần dưới đây là code MỚI.

---

## 0. Quyết định đã chốt (08-17)

| # | Câu | Chốt | Ảnh hưởng |
|---|---|---|---|
| 1 | Ngưỡng "so lớp" (kênh ⑤, MỚI) | So **điểm TỔNG ET/BTVN** (không phải theo dạng/chuyên đề — 2 cái đó đã có ngưỡng tuyệt đối rồi) với TB lớp CÙNG bài đó. `điểm HS < TB_lớp × 0.8`. Gate độ tin: 3 bài gần nhất, **≥2/3 bài** dưới ngưỡng mới bắn tín hiệu (nhất quán pattern n≥3 toàn hệ, Claude tự chốt theo R2, chưa hỏi lại) | Cần 1 hàm mới tính TB lớp theo bài (ET/BTVN), KHÔNG tái dùng "so-lớp chuyên đề" của kênh ① vì khác đơn vị đo |
| 2 | Xuống level: L2/L3 có dừng ở L1 không | **Bỏ điểm dừng L1** — 2 nhịp diện-rỗng liên tiếp ở BẤT KỲ level nào (kể cả L2/L3) → về thẳng L0. Sửa `danhgia.js:283-285` | Case đóng dứt điểm sau đúng 2 mốc đo (buổi bổ trợ + 1 retest), không lửng lơ thêm 1 vòng |
| 3 | Cửa sổ retest | **3-7 ngày sau buổi bổ trợ, làm trong buổi học thường tiếp theo** (không tách buổi riêng). Lịch tối thiểu 1 buổi/tuần nên buổi tiếp theo tự nhiên rơi trong khung — KHÔNG cần fallback. Riêng bổ trợ MỨC 2 (ngày tự chọn, không gắn buổi có sẵn): khi OPS chọn ngày, hệ gợi ý/validate để buổi học thường tiếp theo của HS rơi đúng 3-7 ngày sau | `KET_NGAY=7` đã có sẵn khớp luôn cận trên, chỉ cần thêm validate cận dưới 3 ngày lúc OPS chọn ngày mức 2 |
| 4 | Level ↔ mức bổ trợ ↔ người dạy | `L0` = hết bổ trợ · `L1` = **mức 1**, trước/sau giờ, TA dạy · `L2` = **mức 2**, buổi riêng, TA dạy · `L3` = **mức 2, đổi người**, buổi riêng, **GV cao cấp** dạy (không phải TA) | `L2→L3` không phải tăng cường độ mà ĐỔI NGƯỜI DẠY — engine hiện tại (chỉ có số level) không biết khái niệm "người dạy", phải thêm ở tầng `bo_tro_yeu`/`buoi_hoc`, không phải ở `hs_level` |
| 5 | 2 tab duyệt (đề xuất hệ thống / đề xuất nhân sự) | KHÔNG phải 2 danh sách case độc lập — là 1 danh sách card, filter bằng **toggle bar theo nguồn tín hiệu** (hệ thống ①②⑤ / nhân sự ③④). Đúng vì `bo_tro_yeu` chỉ cho 1 case đang-xử/HS/môn — 2 nguồn cùng lúc phải gộp vào 1 card | UI: toggle filter, không phải 2 tab-route riêng |
| 6 | Timer "theo dõi thêm" | **14 ngày** kể từ lần duyệt gần nhất mà chưa có quyết định mới (Bổ trợ / Bỏ theo dõi) → tự đẩy case lên đầu hàng đợi + tăng độ ưu tiên hiển thị. Đây là đồng hồ RIÊNG với đồng hồ retest-theo-dạng (mục 3), không đụng nhau | Cần 1 query/job derive "days since last hs_level_log entry" cho HS đang ở level>0 mà chưa mở case |
| 7 | Ai bấm "hoàn thành" phần dạy | Người bổ trợ (TA/GV) tự bấm — **bỏ qua bước `cho_nghiem_thu`** mà `viec` dùng cho việc giao tay khác. "Đạt/không đạt" là phần đánh giá hiệu suất riêng (mục 12), tách khỏi việc "đã dạy xong chưa" | Case bổ trợ yếu là ca ĐẦU TIÊN của `viec` bỏ qua nghiệm thu — ghi rõ trong migration/comment kẻo lẫn với luồng giao việc thường |
| 8 | Sinh tài liệu lúc nào | Bước 4 (duyệt nội dung) chỉ **lưu cấu hình đã chọn** (dạng + số câu), CHƯA xuất file/tạo dòng `tai_lieu`. File thật + gắn ngày tháng chỉ generate ở bước 6 khi đã có ngày bổ trợ | Tránh dòng `tai_lieu` "ngày = null" trôi nổi trong kho |
| 9 | Phòng học | Tách dự án riêng, xây bảng phòng dùng chung cho MỌI loại buổi (lớp thường + bù + đuổi + yếu) — Thùy tự mở worktree khác. Bổ trợ yếu build TRƯỚC bằng chỗ nối tạm (mảng `ROOMS` cứng hiện có, không check trùng), chờ phòng học xong thì đổi API, không block nhau | Mockup dưới đây dùng room-picker giả (6 phòng cứng), sẽ thay API thật sau |
| 10 | Thái độ thuần có đi qua pipeline này không | **KHÔNG.** `bo_tro_yeu` chỉ áp cho `hs_level.loai='kien_thuc'`. Case thái-độ-thuần (đi học đều, hiểu bài, nhưng lười BTVN/nghỉ nhiều) — hệ chỉ HIỆN cảnh báo (máy đề xuất + duyệt level thái độ vẫn chạy như đã có), GV tự nhắc trực tiếp phụ huynh, KHÔNG mở case/không xếp lịch/không builder tài liệu | Level thái độ không tạo dòng `bo_tro_yeu` — chỉ level kiến thức mới mở case. Đường "nhắc PH" cho thái độ chưa cần build gì thêm (GV làm tay ngoài hệ thống) |

---

## 1. Còn treo — cần Thùy trả lời (không tự chốt được)

**B. Case chaining khi "chọn hành vi tiếp theo" mở case mới**
3/5 lựa chọn ở bước đánh giá hiệu suất (xuống mức thấp hơn / đổi người cùng mức / nâng mức) đều phải mở
**case MỚI** vì case cũ đã `hoàn_thành` và bảng chỉ cho 1 case đang-xử/HS/môn. Đề xuất thêm cột
`case_truoc_id uuid references bo_tro_yeu(id)` vào migration mới — để màn "Đánh giá hiệu suất" biết
"HS này đã bổ trợ 2 lần rồi mới đổi GV", không mất lịch sử leo thang. Cần Thùy gật để đưa vào migration
(theo Luật xoá/thêm ở CLAUDE.md — đây là ADD COLUMN, không xoá gì, nhưng vẫn xin xác nhận trước khi viết
migration).

---

## 2. Vòng đời case — PURE-DERIVE, không thêm cột trạng thái con

Theo CLAUDE.md §4 (không bảng `tasks`, không state ảo) — `bo_tro_yeu.trang_thai` GIỮ NGUYÊN chỉ 2 giá
trị (`dang_xu`/`hoan_thanh`). "Đang ở bước nào" (thanh tiến độ mục 10 của chị) **derive** từ dữ liệu con,
không lưu thêm cột:

| Bước hiển thị | Điều kiện derive |
|---|---|
| Chờ chọn nội dung | `bo_tro_yeu_dang` rỗng |
| Chờ xếp lịch | có `bo_tro_yeu_dang`, nhưng chưa buổi nào có `day_buoi_id` |
| Đã xếp | có ≥1 buổi (`buoi_hoc.loai='bo_tro_yeu'`) gắn `bo_tro_yeu_id`, có `ngay`/`gio`/`phong`/`nguoi_day` |
| Đang bổ trợ / chờ đánh giá | buổi đã tới ngày, chưa điểm danh xong hoặc chưa `day_at` |
| Chờ retest | mọi `bo_tro_yeu_dang` đã có `day_at`, chưa đủ `dong_at` |
| Hoàn thành | `trang_thai='hoan_thanh'` (mọi dạng đã `dong_at` HOẶC người duyệt chốt tay) |

Case chuyển "Đã xếp" (buổi có ngày+giờ+phòng+người dạy) → trigger tạo dòng `viec` cho người dạy — đây là
điểm nối vào "Việc của tôi" (P1 cũ, mục 7 quyết định ở trên: tự bấm hoàn thành, bỏ qua `cho_nghiem_thu`).

---

## 3. Reuse map

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Hủy ca + đếm số lần + quay lại "đã xếp" | ✅ Copy từ `botro.ts` (bù) | **KHÔNG** copy từ `botro_duoi.ts` (đuổi) — đuổi không đếm số lần hủy, dễ nhầm vì hình dáng bảng case giống nhau hơn |
| Tick "đã dạy dạng" (`day_at`) | ✅ Copy từ `botro_duoi.ts:145` (`setDangDay`) | Đã verify 07-22: populate 9/12 (75%), cơ chế chạy thật |
| Builder tài liệu theo mastery HS | ✅ Dùng thẳng `src/lib/bt.ts` | Đã chọn câu theo dạng yếu CỦA CHÍNH HS đó (`getMasteryHS`) — gần đúng những gì bước 4 cần, chỉ cần đổi default count (5 câu lớp + 2 câu ET, khác `DEFAULT_LUYEN_COUNTS` hiện tại) và thêm chọn-lớp-khác (xem mục 4) |
| Đề xuất + duyệt level | ✅ Dùng thẳng `duyetLevel`/`hs_level_log` (`danhgia.ts`) | Case `bo_tro_yeu` chỉ mở KHI duyệt xong ở đây — chưa có code nối 2 tầng này, đây là việc chính cần viết (Pha 4 cũ) |
| Phòng trống theo giờ | ❌ Chưa có (dự án riêng) | Dùng tạm mảng `ROOMS` cứng của `TKBScreen.tsx`, không check trùng |
| Bảng phòng dùng chung | ❌ Chưa có | Xem mục 0.9 |

---

## 4. Builder tài liệu — chọn lớp/khối khác (kiến thức năm trước)

`ma_dang` không phân theo khối cứng trong code hiện tại (dùng `khoCuaMon(mon)` để suy bảng theo môn,
không theo khối) — cần verify: catalog dạng có tách theo khối/lớp hay là danh mục phẳng xuyên khối?
**Việc cần làm trước khi code builder**: đọc `dai_ban_do`/`khtn_ban_do` xem có cột khối không. Nếu có,
"chọn lớp khác" = thêm 1 dropdown khối trước khi search dạng (dễ). Nếu catalog phẳng không theo khối,
thì "kiến thức năm trước" chỉ là filter theo `mastery` đo lúc lớp cũ (dữ liệu lịch sử), không cần đổi UI
chọn khối — sẽ verify khi vào code, không chặn viết plan.

---

## 5. Migration cần (chờ duyệt, Claude không tự chạy)

1. `bo_tro_yeu` — thêm `case_truoc_id uuid references bo_tro_yeu(id)` (mục 1.B, cần Thùy gật).
2. `buoi_hoc_hs` hoặc `buoi_hoc` (tuỳ bảng nào giữ phòng/giờ/người dạy cho buổi `loai='bo_tro_yeu'`) —
   verify lại `SuaBuoiModal.tsx` đang ghi cột nào, khả năng KHÔNG cần migration mới (tái dùng cột có sẵn
   cho bù/đuổi).
3. Không cần thêm giá trị `nguon` mới trên `bo_tro_yeu` cho kênh ⑤ — kênh ⑤ chỉ là thêm điều kiện vào
   hàm đề xuất (`deXuatLevelKienThuc`), case vẫn mở với `nguon='ai_de_xuat'` như kênh ①②.

---

## 6. Thứ tự làm (đề xuất)

1. ✅ **XONG 08-18.** Sửa `danhgia.js:283-285` (mục 0.2) + thêm kênh ⑤ vào hàm đề xuất (mục 0.1).
   Test engine 77/77 pass (`scripts/verify_danhgia.mjs`).
2. ✅ **XONG 08-18.** Nối "duyệt xong → mở/gộp case `bo_tro_yeu`" — [botro_yeu.ts](src/lib/botro_yeu.ts)
   `moHoacGopCaseBoTroYeu`, gọi trong `DuyetKhoi.luu()` (DashboardHocTapScreen.tsx). Migration
   `case_truoc_id` đã áp vào DB thật + `schema.md` đã refresh.
3. ✅ **XONG 08-18.** Builder nội dung — [NoiDungBoTroYeuScreen.tsx](src/screens/danhgia/NoiDungBoTroYeuScreen.tsx),
   tái dùng nguyên `DangPicker` (đã tự hỗ trợ chọn khối khác, không cần build search riêng cho "kiến
   thức năm trước"). Chỉ lưu cấu hình (= dòng `bo_tro_yeu_dang`), chưa xuất file (đúng mục 0.8).
4. ✅ **XONG 08-18.** Xếp lịch — [XepLichBoTroYeuScreen.tsx](src/screens/danhgia/XepLichBoTroYeuScreen.tsx),
   room-picker tạm (mục 0.9). **Sửa lại so với plan gốc:** KHÔNG cần bảng `viec` — "Việc của tôi" đã
   pure-derive từ `buoi_hoc.nguoi_day_tg` (như bù/đuổi), chỉ cần thêm 1 khối trong `getMyTasks`
   (gami.ts) đọc `loai='bo_tro_yeu'`, xong luôn, không phải xây cơ chế giao việc riêng.
5. ⏳ **CHƯA LÀM.** Điểm danh/hủy ca (copy `botro.ts` — LƯU Ý copy đúng `botro.ts` có đếm số lần,
   KHÔNG phải `botro_duoi.ts`) + đánh giá sau buổi + retest theo cửa sổ 3-7 ngày (mục 0.3). Cần dựng
   `BuoiBoTroYeuDetail` riêng (đối xứng `BuoiDuoiDetail`) — hiện đang tạm rơi vào `BuoiDetail` chung,
   CHƯA CHẮC render đúng vì `lop_id=null` (xem cảnh báo ở `NhanSuHome.tsx`).
6. ⏳ **CHƯA LÀM.** Màn đánh giá hiệu suất + 5-lựa-chọn hành vi tiếp theo (cần mục 1.B — đã chốt, có
   `case_truoc_id` sẵn sàng để nối chuỗi).

---

## 7. Mockup

Xem file mockup UI màn "Xếp bổ trợ yếu" (OPS) — gửi kèm để chị duyệt trước khi code thật.
