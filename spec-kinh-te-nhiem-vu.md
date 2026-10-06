# SPEC — Kinh tế · Nhiệm vụ · Phần thưởng (bản chốt dần từ 06/10/2026)

> Phiên Planning Thùy + CTO, **làm từng phần một**: ① NHIỆM VỤ + VÒNG QUAY (file này, đang chốt) → ② THỬ THÁCH & THÀNH TỰU → ③ GAME → ④ ngân sách xu tổng + chống lạm dụng.
> Nhãn: **[CEO]** Thùy đã chốt · **[ĐỀ XUẤT]** CTO đề xuất, chờ Thùy gật · **[MỞ]** chưa quyết.
> Nguồn hiện trạng: bản đồ kinh tế 06/10 (DEVLOG 06/10). Code/DB là chân lý runtime; file này là ý định thiết kế (Notion là bản gốc khi có).

## 1. Nguyên tắc
- **[CEO] Ba cách kiếm xu:** (a) NHIỆM VỤ · (b) THỬ THÁCH/THÀNH TỰU của app · (c) CHƠI GAME. Mỗi cách thiết kế riêng.
- **[CEO] MỖI HOẠT ĐỘNG CÓ TRẦN XU RIÊNG** (thay trần chung "30 xu app" cũ gộp nhiệm vụ + vòng quay + huy hiệu) — xem §7.
- **[CEO] NHIỆM VỤ = lặp theo tần suất (ngày/tuần/tháng). THÀNH TỰU = làm một lần.** Tiến độ bản đồ (hạ dạng, chinh phục chuyên đề, qua lục địa…) thuộc thành tựu.
- **[CEO] Việc BẮT BUỘC (BTVN, ET, MT) KHÔNG nằm trong nhiệm vụ** — đã trả bằng EXP lớp. Nhiệm vụ chỉ đo phần TỰ NGUYỆN.
- **[CEO] Rank tạm khoá (ẩn khỏi học sinh).** Database vẫn tính ngầm.
- **[CEO] Nhiệm vụ trả 3 thứ:** (i) EXP quy thẳng ra xu · (ii) ĐIỂM HỌC TẬP (ĐHT) làm đầu vào chơi game · (iii) bộ đếm làm điều kiện nhận HUY HIỆU.

## 2. Ba đồng
| Đồng | Nguồn | Dùng | Trần | Nhãn |
|---|---|---|---|---|
| **EXP (nhiệm vụ)** | việc ngày/tuần/tháng | đổi xu **ngay, realtime** (Thùy 06/10 — không chốt cuối tháng nữa; 100 EXP = 1 xu tính trên tổng EXP tháng) | **20 xu/tháng = 2.000 EXP** | [CEO] |
| **ĐHT** | việc ngày/tuần/tháng | vào chơi / mua trong game (Nông trại: hạt giống, ô, vé…) | kiếm tối đa **3.000/tháng** (do cấu trúc §4); **số dư tối đa 6.000** (= 2 tháng) | [CEO] |
| **Xu** | EXP đổi + (b) + (c) | đổi quà tại trung tâm | mỗi hoạt động một trần: §7 | — |
- **[CEO]** ĐHT tích luỹ được nhưng có giới hạn số dư; kiếm quá thì phần dư mất.
- **[CEO]** Điểm Nông trại ("điểm chăm chỉ", thang cũ 30/ngày) **quy đổi lại theo ĐHT** — game đọc/tiêu ĐHT từ DB, không tự tạo điểm.
- **[ĐỀ XUẤT]** ĐHT **không** đổi ra xu và **không** mua bằng xu — một chiều: học → ĐHT → game. Tránh vòng lặp xu ↔ điểm.

## 3. Lượt hợp lệ (điều kiện chung của mọi nhiệm vụ)
Một **lượt Luyện dạng yếu** (10 câu) tính cho nhiệm vụ khi:
- **[CEO]** đúng **≥ 7/10**; và
- **[ĐỀ XUẤT]** thỏa luật "lượt học thật" sẵn có (≥ 5 câu · trung bình ≥ 6 giây/câu · không ra lại câu đã gặp) để chống bấm bừa — nguồn duy nhất `_luot_hoc_that()` ở DB.
Chỉ Luyện dạng yếu tính nhiệm vụ. Học theo chủ đề / Thử thách / game có đường thưởng riêng (bước ②③).

## 4. Danh sách nhiệm vụ
| Tầng | Việc | EXP | ĐHT | Nhãn |
|---|---|---|---|---|
| Ngày | Đạt 1 lượt hợp lệ — **làm lại tối đa 4 lần/ngày** | **20**/lần | **20**/lần (tối đa 80/ngày) | [CEO] cấu trúc + 20 ĐHT · EXP 20 [ĐỀ XUẤT] |
| Tuần W1 | có lượt đạt ở **5 ngày** khác nhau trong tuần | 100 | 50 | [ĐỀ XUẤT] |
| Tuần W2 | tổng **12 lượt đạt** trong tuần | 100 | 50 | [ĐỀ XUẤT] |
| Tháng M1 | có lượt đạt ở **20 ngày** trong tháng | 300 | 200 | [ĐỀ XUẤT] |
- Tuần = 4 khối như cũ (ngày 1–7, 8–14, 15–21, 22–hết tháng). Mọi việc là **đếm sự kiện lượt hợp lệ**, suy động ở DB; không bảng nhiệm vụ riêng.
- **ĐHT tối đa/tháng = 4 lượt × 20 × 30 ngày (2.400) + W (4 tuần × 2 × 50 = 400) + M (200) = 3.000** ✓ khớp "3.000 là đẹp".

## 5. Ngân sách (kiểu học sinh)
| Kiểu | Ngày (lượt × 30) | Tuần | Tháng | **EXP** (xu) | **ĐHT** |
|---|---|---|---|---|---|
| Nhẹ: 3 ngày/tuần × 1 lượt (~13 ngày) | 13 lượt → 260 EXP | 0 | 0 | 260 (**2,6 xu**) | 260 |
| Đều: 1 lượt/ngày | 30 lượt → 600 | W1 ×4 = 400 (W2 cần 12 lượt/tuần: chưa) | 300 | 1.300 (**13 xu**) | 600 + 200 + 200 = **1.000** |
| Chăm: 2 lượt/ngày | 60 lượt → 1.200 | W1+W2 ×4 = 800 | 300 | 2.300 → **chặn 2.000 (20 xu)** | 1.200 + 400 + 200 = **1.800** |
| Siêu chăm: 4 lượt/ngày | 120 lượt → 2.400 | 800 | 300 | 3.500 → **chặn 2.000 (20 xu)** | **3.000** (tối đa) |
⇒ Học đều mỗi ngày ≈ 13 xu + 1.000 ĐHT; chỉ ai làm ≥ ~2 lượt/ngày mới chạm trần 20 xu. EXP chặn ở 2.000 nhưng ĐHT vẫn tăng tới 3.000 (game dùng).

## 6. Vòng quay May mắn — thiết kế lại [CEO định hướng, CTO chỉnh số]
- **[CEO]** Chỉ quay được khi **hoàn thành nhiệm vụ ngày**. **Ẩn ô "May mắn" khỏi màn chính**; ngay lúc hoàn thành việc ngày, **vòng quay tự hiện ra** (không phải đi tìm).
- **[CEO]** Tối đa **10 xu/tháng = 30 lần quay** ⇒ **1 lượt quay/ngày** (mở bởi lượt đạt ĐẦU TIÊN trong ngày; lượt đạt thứ 2–4 không thêm lượt quay).
- **[ĐỀ XUẤT]** Lượt quay chưa quay thì giữ đến hết ngày (nút "Quay" trong màn Nhiệm vụ), sang ngày mới mất — không tích.
- **[ĐỀ XUẤT] Bảng giải (EXP), kỳ vọng ≈ 26,5/lần ⇒ 30 lần ≈ 795 EXP ≈ 8 xu (trần cứng 1.000 EXP = 10 xu):**
  | Giải | 10 | 20 | 30 | 50 | 100 | 200 |
  |---|---|---|---|---|---|---|
  | Tỉ lệ | 35% | 30% | 20% | 10% | 4% | 1% |
  Giải thấp nhất vẫn > 0 (không có ô "trượt"). Trần 10 xu tính theo EXP vòng quay (§7), đứng riêng khỏi trần nhiệm vụ. Bảng giải nằm trong bảng cấu hình DB (`may_man_hs_cau_hinh`) — sửa không cần đổi code.
- Kết quả luôn do DB quyết; app chỉ chạy hoạt hình. (Giữ như cũ.)

## 7. Trần xu theo hoạt động (framework)
| Hoạt động | Trần | Nhãn |
|---|---|---|
| Nhiệm vụ | **20 xu/tháng** (2.000 EXP) | [CEO] |
| Vòng quay May mắn | **10 xu/tháng** (1.000 EXP) | [CEO] |
| Huy hiệu (★3/4/5 = 100/200/300 EXP) | [MỞ] — bàn ở bước ② | |
| Thành tựu / Thử thách | [MỞ] — bước ② | |
| Game (Nông trại, Săn quái, Đấu trường…) | [MỞ] — bước ③ | |
| EXP lớp (ET/BTVN/MT/bù/game buổi) | hiện **không trần** — xem lại ở bước ④ | |
- **[ĐỀ XUẤT] Công thức DB:** `xu_app = ceil( Σ_nguồn min(EXP_nguồn, trần_nguồn × 100) / 100 )` — **cộng EXP đã cắt trần của từng nguồn rồi mới `ceil` MỘT lần**. (Làm tròn lên riêng từng nguồn sẽ cộng thêm tối đa 1 xu/nguồn — lỗ hổng bản đồ kinh tế đã chỉ ra.) Trần lưu ở bảng cấu hình `xu_tran_nguon(nguon, mon, tran_xu_thang)`, thay `tran_xu_app` chung.

## 8. Câu hỏi MỞ
1. **Số dư ĐHT tối đa:** nguyên tắc Thùy "2 tháng". Thu tối đa nay 3.000/tháng ⇒ 2 tháng = **6.000** (trước đó 4.000 là khi tính 2.000/tháng). **[CEO 06/10] 6.000** (đã chốt).
2. Huy hiệu: Hercules (đang "vượt Thử thách") đổi thành gì? **[ĐỀ XUẤT]** "hoàn thành nhiệm vụ ngày ≥ N ngày/tháng". Các huy hiệu khác lấy bộ đếm nào từ nhiệm vụ? (bước ②)
3. Trần xu từng nguồn còn lại (huy hiệu, thành tựu, game) và tổng ngân sách/tháng (bước ②③④).
4. Môn KHTN/Anh: nhiệm vụ + vòng quay theo môn thế nào? (vòng quay hiện unique theo HS/ngày, không theo môn — đề xuất giữ 1/ngày/HS.)

## 9. Hệ quả kỹ thuật (làm SAU khi chốt, theo thứ tự)
1. **Ẩn Rank:** cờ `rankBat()` (mặc định tắt) — ẩn thẻ Rank ở Home/Thư viện/Hồ sơ, tin "lên bậc" ở Thế giới, chặng Rank của tutorial, mục Rank của Hướng dẫn chơi, chữ "Điểm Rank" ở Thử thách. DB không đổi.
2. **DB nhiệm vụ:** viết lại `fn_nhiem_vu_hoan_thanh`/`nhiem_vu_cau_hinh` theo §4 (bỏ N1–N3, T1–T4, M1–M2, rương, Chặng cũ); **sổ ĐHT** `dht_so_cai` (sự kiện thật: +ĐHT khi lượt đạt/việc tuần-tháng, −ĐHT khi game tiêu; số dư suy ra; trần số dư áp ở hàm ghi); `xu_tran_nguon` + công thức §7; vòng quay §6 (mở bằng lượt đạt đầu ngày).
3. **App HS:** màn Nhiệm vụ viết lại; vòng quay bật tự động khi hoàn thành việc ngày + bỏ ô May mắn khỏi màn chính; hiện ĐHT ở Home; Hướng dẫn chơi + tutorial sửa theo.
4. **Nông trại:** đọc/tiêu ĐHT qua RPC (hết localStorage cho tiền), đổi thang giá hạt/ô/vé theo ĐHT, chạy lại `tools/gia-lap.mjs` với nguồn cung mới (≈ 1.000–3.000 ĐHT/tháng thay vì ≤ 900 điểm cũ).
5. **Huy hiệu:** Hercules + bộ đếm.

---

## 10. BƯỚC ② — Hiện trạng THÀNH TỰU ↔ HUY HIỆU (kiểm kê 06/10; nguồn `supabase/migrations/202609281846_huy_hieu.sql` seed Toán + `spec-huy-hieu-build.md`)
**Tên gọi trong DB: "thành tựu" (`thanh_tuu`) = 14 CHỈ TIÊU ĐO THEO THÁNG** (lặp mỗi tháng) — KHÔNG phải "thành tựu làm một lần" như định nghĩa Thùy 06/10. Hai thứ khác nhau cùng tên.
Huy hiệu = đếm số THÁNG đạt các chỉ tiêu: tháng **chuẩn** = mọi chỉ tiêu vai `chuẩn` đạt; tháng **hoàn hảo** = chuẩn + mọi chỉ tiêu vai `thêm` đạt. ★1/2/3/4/5 = 1/2/4/6/9 tháng (★4–5 cần tháng hoàn hảo + bản cứng GV trao); EXP ★3/4/5 = 100/200/300.

| Chỉ tiêu (14) | Đo gì | Huy hiệu dùng (chuẩn ● / thêm ○) | Phụ thuộc hệ thống |
|---|---|---|---|
| A1 | không vắng buổi nào | Helios ● · Chronos ○ · Phoenix ○ · Nike ○ | điểm danh (bắt buộc) |
| A2 | nộp đủ, đúng hạn mọi BTVN | Chronos ● · Helios ○ · Athena ○ · Phoenix ○ · Hercules ○ · Hephaestus ○ · Nike ○ (**7/8 huy hiệu**) | BTVN (bắt buộc) |
| A4 | tự luyện ≥ 200 câu đúng/tháng | Chronos ○ | tự luyện (tự nguyện) |
| A5 | vượt Thử thách ≥ 10 ngày | **Hercules ●** · Hephaestus ○ | **Thử thách cũ** |
| A6 | vượt Thử thách ≥ 15 ngày | Helios ○ · Hercules ○ | **Thử thách cũ** |
| B1 | ET ≥ 80% ở ≥ ¾ số bài | **Athena ●** · Zeus ○ | ET (bắt buộc) |
| B2 | MT top 30% khối | **Zeus ●** | MT (bắt buộc) |
| B4 | BTVN đúng TB ≥ 85% | Athena ○ | BTVN |
| B5 | BTVN đúng TB ≥ 90% | Zeus ○ | BTVN |
| B6 | ≥ 5 lượt Thử thách 10/10 | Hercules ○ | **Thử thách cũ** |
| P1 | hạng MT tốt hơn đầu năm (hoặc top 10%) | **Phoenix ●** | MT |
| C3 | lấp ≥ 1 dạng yếu → đạt | **Hephaestus ●** | mastery |
| D30 | top 30% Bảng đua tháng | **Nike ●** | **Điểm Rank** |
| D10 | top 10% Bảng đua tháng | Nike ○ | **Điểm Rank** |

**Bị ảnh hưởng bởi quyết định 06/10:**
- **Rank ẩn ⇒ D30/D10 ⇒ Nike mất cả chỉ tiêu chuẩn lẫn thêm** (Bảng đua tháng xếp theo Điểm Rank).
- **Thử thách đổi ⇒ A5/A6/B6 ⇒ Hercules (chuẩn A5), Helios (thêm A6), Hephaestus (thêm A5)** mất nền đo.
- Chỉ tiêu bắt buộc (A1, A2, B1, B2, B4, B5, P1) vẫn đo bình thường nhưng huy hiệu chỉ phản ánh việc bắt buộc (Helios, Chronos, Athena, Zeus, Phoenix) — 5/8 huy hiệu không có chút tự nguyện nào ở vai chuẩn; A2 là điều kiện "hoàn hảo" của 7/8.

**Các hệ thống KHÁC cũng mang tên thành tựu/thành tích (không nuôi huy hiệu):**
1. **Màn "Thành tựu" (app HS)** = giải thưởng cuối tháng nhân sự công bố (Xuất sắc / Tiến bộ / Chăm chỉ) — bảng `giai_thuong`.
2. **Thành tích chờ khoe** ở Thế giới BK = tin tự sinh (ET điểm cao, 50 câu đúng trong ngày, nhất buổi, mốc chuỗi, lên bậc…), khoe 3/ngày, không thưởng.
3. **Danh mục cũ `thanh_tich_loai`** (12 loại, 0 dòng ghim) đã `active=false`.
4. **"Thành tựu làm một lần" của Thùy (tiến độ bản đồ: hạ dạng, chinh phục chuyên đề, qua lục địa…) — CHƯA có, chưa thiết kế.**

---

## 11. THÀNH TỰU — CHỐT 15 LOẠI (Thùy 06/10; bản ~89 thành tựu cũ đã bỏ)
**[CEO]** Đạt là đạt, không đạt là thôi — không có mức Thấp/Cao. Mỗi bậc/ngưỡng là một thành tựu riêng, **thưởng EXP riêng** (trừ #14 thưởng xu).
**[CEO]** Thành tựu có thể tham chiếu huy hiệu nhưng KHÔNG luôn là điều kiện huy hiệu — quan hệ bàn SAU khi chốt xong thành tựu.
Loại: **THÁNG** (reset mỗi tháng) · **LIÊN TIẾP** (đứt là cày lại) · **TÍCH LUỸ** (cộng dồn) · **MỘT LẦN**.
Dữ liệu: ✅ đã đo được · 🔧 cần hàm/ghi sự kiện mới · ⛔ chờ hệ thống khác. [CEO] = Thùy nêu · [ĐỀ XUẤT] = CTO điền chỗ Thùy để "…".

| # | Thành tựu | Loại | Bậc / ngưỡng → thưởng EXP | Dữ liệu | Nhãn |
|---|---|---|---|---|---|
| 1 | Làm BTVN **7 lần** trong tháng | Tháng | **150** | ✅ | [CEO; thưởng CTO chỉnh 300→150 vì dễ làm] |
| 2 | Làm đủ **7 BTVN** và **trung bình > 80%** trong tháng | Tháng | 300 | ✅ | [CEO] |
| 3 | Làm đủ **7 ET** và **trung bình > 80%** trong tháng | Tháng | 300 | ✅ | [CEO] |
| 4 | **Vào app** liên tiếp | Liên tiếp | 7 / 14 / 30 / 60 / 90 / 150 / 210 / 300 ngày → **30 / 50 / 80 / 100 / 150 / 200 / 250 / 400** | 🔧 chưa có log mở app | [CEO; thưởng CTO hạ từ 100…800 vì mở app chưa phải học] |
| 5 | **Chuỗi làm bài** liên tiếp | Liên tiếp | 7 / 14 / 30 / 60 / 90 / 150 / 210 / 300 ngày → **100 / 200 / 300 / 400 / 500 / 600 / 700 / 800** (giữ) | ✅ `fn_chuoi_cua_toi` | [CEO] |
| 6 | Hoàn thành **Nhiệm vụ ngày** liên tiếp | Liên tiếp | 7 / 14 / 30 ngày → 100 / 200 / 500 (… bậc sau [ĐỀ XUẤT]: 60 / 90 ngày → **600 / 800**) | 🔧 | [CEO] |
| 7 | **Luyện dạng yếu đạt chuẩn** liên tiếp (lượt đúng ≥ 7/10) | Liên tiếp | 3 / 5 / 10 lượt → 200 / 300 / 1.000 | ✅ | [CEO] |
| 8 | **Tổng số câu luyện đạt** (cộng dồn) | Tích luỹ | 1.000 / 2.000 / … → 100 / 200 / 300 / … ([ĐỀ XUẤT] 1.000 / 2.000 / 5.000 / 10.000 → 100 / 200 / 300 / **400**) | ✅ | [CEO] |
| 9 | **Top 5 khối** (MT tháng) | Một lần | **300** | ✅ `fn_mt_hang_thang` | [CEO] |
| 10 | **Top 1 khối** (MT tháng) | Một lần | **700** | ✅ | [CEO] |
| 11 | **ET 10 điểm lần đầu** (trong mùa) | Một lần | 200 | ✅ | [CEO xác nhận 06/10: "10" = 10 ĐIỂM] |
| 12 | **MT 10 điểm lần đầu** (trong mùa) | Một lần | **800** | ✅ | [CEO xác nhận 06/10: 10 ĐIỂM] |
| 13 | **100% TOÀN BỘ dạng bài của khối đều "đạt" TẠI CÙNG MỘT THỜI ĐIỂM** (dạng chưa đo = chưa đạt); chỉ áp dụng khi khối có **> 10 dạng bài** | Một lần | 1.000 | ✅ `fn_mastery_cells` (+ Hình qua registry nhánh) | [CEO xác nhận 06/10] |
| 14 | Có **10 / 20 / … bạn** ở BK | Tích luỹ | mỗi bậc **1 xu** (trả XU thẳng, không qua EXP) | ✅ | [CEO] |
| 15 | **(Ẩn) Master 1 chủ đề kiến thức**: 100% dạng của chủ đề đều "đạt" (dạng CHƯA ĐO = chưa đạt — khác #13) | Một lần / chủ đề | **1.000 EXP mỗi chủ đề, chỉ lần đầu hoàn thành**; danh sách chủ đề khác nhau theo khối | ✅ `fn_ban_do_phieu_luu` | [CEO] |

**Quy tắc chung [ĐỀ XUẤT, chờ gật]:**
- Mỗi bậc thưởng **một lần duy nhất trong đời** — mất chuỗi cày lại tới bậc cũ KHÔNG thưởng lại.
- Thành tựu **ẩn (#15)**: không liệt kê tên trước; hiện thẻ "Thành tựu ẩn · đã mở N/M", đạt xong mới lộ tên chủ đề.
- Thành tựu tháng (#1–3) tính vào **tháng em đạt**, reset tháng sau (đạt lại mỗi tháng thì thưởng lại mỗi tháng).
- Thành tựu không gắn môn (#4, #5, #6, #14) thưởng ghi vào **EXP chung** (không nhãn môn — §1.6: dữ liệu không-học-tập mới được chung; "vào app" và "bạn bè" đúng nhóm này; chuỗi/nhiệm vụ đã chốt chung mọi môn); còn lại ghi theo môn.

### Ngân sách thành tựu THEO NĂM — đã chỉnh về ≈ 300 xu (Thùy 06/10 "tầm 300 một năm là đẹp")
**Nguyên tắc chỉnh [CEO]:** thành tựu **khó nhưng cần chăm chỉ vẫn thưởng cao** ⇒ giữ nguyên/cao: #2, #3, #5, #6, #7, #8, #13, #15. Cắt chỗ **dễ làm** hoặc **dựa vào thứ hạng/may rủi** hơn là chăm: #1 (chỉ cần làm đủ bài), #4 (mở app chưa phải học), Top 5/Top 1, MT 10 điểm.
Mỗi năm reset ⇒ mọi năm cùng ngân sách. 1 năm = 10 tháng tính thành tựu tháng. 100 EXP = 1 xu.

| # | Thành tựu | Thưởng cũ → **MỚI** | Tối đa/năm (xu) |
|---|---|---|---|
| 1 | BTVN 7 lần/tháng | 300 → **150** EXP/tháng | 15 |
| 2 | BTVN đủ 7 + TB > 80% | **300** (giữ) | 30 |
| 3 | ET đủ 7 + TB > 80% | **300** (giữ) | 30 |
| 4 | Vào app liên tiếp 7/14/30/60/90/150/210/300 ngày | 100…800 → **30 / 50 / 80 / 100 / 150 / 200 / 250 / 400** | 12,6 |
| 5 | Chuỗi làm bài liên tiếp (cùng bậc) | **100 / 200 / 300 / 400 / 500 / 600 / 700 / 800** (giữ) | 36 |
| 6 | Nhiệm vụ ngày liên tiếp 7/14/30/60/90 ngày | 100/200/500 (CEO) + **600 / 800** (bậc 60/90 đề xuất, hạ từ 700/1.000) | 22 |
| 7 | Luyện dạng yếu đạt chuẩn liên tiếp 3/5/10 | **200 / 300 / 1.000** (giữ) | 15 |
| 8 | Tổng câu luyện đạt 1.000/2.000/5.000/10.000 | 100 / 200 / 300 / **400** (bậc cuối hạ từ 500) | 10 |
| 9 | Top 5 khối (MT tháng) | 500 → **300** | 3 |
| 10 | Top 1 khối | 1.000 → **700** | 7 |
| 11 | ET 10 điểm lần đầu | **200** (giữ) | 2 |
| 12 | MT 10 điểm lần đầu | 1.000 → **800** | 8 |
| 13 | 100% đạt dạng bài | **1.000** (giữ) | 10 |
| 14 | Bạn bè 10/20/… (mới trong mùa) | **1 xu/bậc** (giữ; tối đa đến 50 bạn) | 5 |
| 15 | (Ẩn) Master 1 chủ đề | **1.000** EXP/chủ đề (giữ; ≤ 10 chủ đề/khối) | 100 |
| **Tối đa/năm** | | | **≈ 305 xu** (≈ 25/tháng) |

| Kiểu học sinh | Xu/năm | Ghi chú |
|---|---|---|
| **Xuất sắc** (hầu hết bậc cao, master ~8 chủ đề) | ≈ 274 | #4 tới 210 ngày, #5 tới 210, #6 tới 90, master 80 |
| **Đều đặn** | ≈ 116 | mỗi tháng #1 + 1 trong #2/#3; chuỗi tới 60–90 ngày; master 3 chủ đề (30) |
| **Nhẹ** | ≈ 24 | 3 tháng #1; vài bậc đầu; master 1 chủ đề |
- So nguồn khác cùng năm (mức tối đa): nhiệm vụ 240 · vòng quay 120 · **thành tựu ≈ 305**. Thành tựu vẫn là nguồn lớn nhất ở học sinh giỏi nhưng phần "dễ nhận" (#1, #4) đã bị cắt, còn lại là việc khó cần bền bỉ.
- **[CEO 06/10] KHÔNG đặt trần xu cho nguồn thành tựu** — thành tựu tính theo NĂM, tổng tối đa tự nhiên ≈ 305/năm đã đủ chặn; không trần tháng, không chuyển tháng. (Kỹ thuật: nguồn `thanh_tuu` trần = không giới hạn trong bảng `xu_tran_nguon`; ví tháng có thể nhận một đợt lớn, ví dụ 3 chủ đề master = 30 xu.)

### Quy tắc RESET THEO MÙA [ĐỀ XUẤT — chờ Thùy gật]
- **Mốc reset = 01/07** (khớp mùa Rank 01/07–30/06 và mùa huy hiệu 07→04; bảng `gami_mua` đã có). Dòng thành tựu đạt mang nhãn `mua` (lịch sử các năm trước vẫn xem được trong album, KHÔNG xoá).
- Reset gồm: cờ "đã đạt" của mọi bậc · bộ đếm tích luỹ (#8) · đếm liên tiếp (#4–#7) · chuỗi master #15 (bộ chủ đề đổi theo khối nên tự mới).
- **Liên tiếp qua ranh giới mùa:** đếm lại từ 0 vào 01/07 (vì cày lại từ đầu mỗi mùa). Hệ quả: bậc **300 ngày** của #4/#5 gần như "không bỏ ngày nào cả mùa" (mùa 365 ngày, kể cả hè) — để làm thành tựu huyền thoại.
- ⚠ **#14 bạn bè KHÔNG reset theo kiểu "đếm lại số bạn hiện có"** — nếu không, năm nào cũng nhận lại xu cho cùng các bạn cũ (xu miễn phí). **[ĐỀ XUẤT]** #14 chỉ tính **bạn kết MỚI trong mùa**.
- ⚠ **#9–#13 (Top 5/Top 1/10 điểm lần đầu/100% dạng):** đã reset thì mỗi mùa nhận lại được — đúng ý Thùy, nhưng #12 MT 10 điểm (1.000 EXP) và #13 là khoản lớn; giữ nguyên số theo Thùy.

### Câu hỏi MỞ
1. ~~#11/#12 "10" là 10 điểm hay 10 lần?~~ **Chốt: 10 ĐIỂM** [CEO].
2. ~~#13 "100% đạt dạng bài"~~ **Chốt [CEO 06/10]:** 100% **TOÀN BỘ** dạng bài của khối đạt **cùng một lúc**; điều kiện > 10 dạng là ngưỡng để thành tựu có nghĩa (khối ít hơn 10 dạng thì chưa áp dụng).
   - Khác #15: #15 = từng chủ đề master (chỉ cần từng lúc, mỗi chủ đề 1.000, nhận dần); #13 = **giữ cả khối đạt đồng thời** (độ nắm tính theo 5 lần đo gần nhất nên dễ tụt) ⇒ rất khó, thưởng 1.000 chỉ là mốc chót. CTO ghi nhận: nếu thấy ít so với độ khó thì tăng (chỉnh số, không đổi cấu trúc).
   - Hiểu "> 10" là số dạng bài CỦA KHỐI (không phải số dạng em đã đo) — báo lại nếu Thùy muốn khác.
3. ~~Trần xu nguồn thành tựu~~ **Chốt [CEO]: KHÔNG trần** (tính theo năm).
4. #6 / #8 bậc sau dấu "…" và 4 quy tắc chung [ĐỀ XUẤT] (thưởng 1 lần/mùa/bậc; thành tựu ẩn hiện "đã mở N/M"; thành tựu tháng thưởng lại mỗi tháng; thành tựu không gắn môn ghi EXP chung): **coi như đã gật** nếu Thùy không sửa.
Sau khi chốt: **bước kế = HUY HIỆU** (quan hệ với thành tựu, EXP sao ★, trần xu), rồi **THỬ THÁCH**.
