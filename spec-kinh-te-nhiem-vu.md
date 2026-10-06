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
| **EXP (nhiệm vụ)** | việc ngày/tuần/tháng | đổi xu cuối tháng (100 EXP = 1 xu — DB hiện tại) | **20 xu/tháng = 2.000 EXP** | [CEO] |
| **ĐHT** | việc ngày/tuần/tháng | vào chơi / mua trong game (Nông trại: hạt giống, ô, vé…) | kiếm tối đa **3.000/tháng** (do cấu trúc §4); số dư tối đa: §8-1 | [CEO] 3.000 |
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
1. **Số dư ĐHT tối đa:** nguyên tắc Thùy "2 tháng". Thu tối đa nay 3.000/tháng ⇒ 2 tháng = **6.000** (trước đó 4.000 là khi tính 2.000/tháng). **[ĐỀ XUẤT] 6.000**; hay giữ 4.000 (~1,3 tháng)?
2. Huy hiệu: Hercules (đang "vượt Thử thách") đổi thành gì? **[ĐỀ XUẤT]** "hoàn thành nhiệm vụ ngày ≥ N ngày/tháng". Các huy hiệu khác lấy bộ đếm nào từ nhiệm vụ? (bước ②)
3. Trần xu từng nguồn còn lại (huy hiệu, thành tựu, game) và tổng ngân sách/tháng (bước ②③④).
4. Môn KHTN/Anh: nhiệm vụ + vòng quay theo môn thế nào? (vòng quay hiện unique theo HS/ngày, không theo môn — đề xuất giữ 1/ngày/HS.)

## 9. Hệ quả kỹ thuật (làm SAU khi chốt, theo thứ tự)
1. **Ẩn Rank:** cờ `rankBat()` (mặc định tắt) — ẩn thẻ Rank ở Home/Thư viện/Hồ sơ, tin "lên bậc" ở Thế giới, chặng Rank của tutorial, mục Rank của Hướng dẫn chơi, chữ "Điểm Rank" ở Thử thách. DB không đổi.
2. **DB nhiệm vụ:** viết lại `fn_nhiem_vu_hoan_thanh`/`nhiem_vu_cau_hinh` theo §4 (bỏ N1–N3, T1–T4, M1–M2, rương, Chặng cũ); **sổ ĐHT** `dht_so_cai` (sự kiện thật: +ĐHT khi lượt đạt/việc tuần-tháng, −ĐHT khi game tiêu; số dư suy ra; trần số dư áp ở hàm ghi); `xu_tran_nguon` + công thức §7; vòng quay §6 (mở bằng lượt đạt đầu ngày).
3. **App HS:** màn Nhiệm vụ viết lại; vòng quay bật tự động khi hoàn thành việc ngày + bỏ ô May mắn khỏi màn chính; hiện ĐHT ở Home; Hướng dẫn chơi + tutorial sửa theo.
4. **Nông trại:** đọc/tiêu ĐHT qua RPC (hết localStorage cho tiền), đổi thang giá hạt/ô/vé theo ĐHT, chạy lại `tools/gia-lap.mjs` với nguồn cung mới (≈ 1.000–3.000 ĐHT/tháng thay vì ≤ 900 điểm cũ).
5. **Huy hiệu:** Hercules + bộ đếm.
