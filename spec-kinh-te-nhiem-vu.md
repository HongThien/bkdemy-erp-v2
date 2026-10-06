# SPEC — Kinh tế · Nhiệm vụ · Phần thưởng (bản chốt dần từ 06/10/2026)

> Phiên Planning Thùy + CTO, **làm từng phần một**: ① NHIỆM VỤ (file này, đang chốt) → ② THỬ THÁCH & THÀNH TỰU → ③ GAME → ④ ngân sách xu tổng + chống lạm dụng.
> Mỗi dòng gắn nhãn: **[CEO]** Thùy đã chốt · **[ĐỀ XUẤT]** CTO đề xuất, chờ Thùy gật · **[MỞ]** chưa quyết.
> Nguồn hiện trạng: bản đồ kinh tế 06/10 (DEVLOG 06/10). Code/DB là chân lý runtime; file này là ý định thiết kế (Notion là bản gốc khi có — paste-ready).

## 1. Nguyên tắc
- **[CEO] Ba cách kiếm xu:** (a) NHIỆM VỤ · (b) THỬ THÁCH/THÀNH TỰU của app · (c) CHƠI GAME. Mỗi cách thiết kế riêng, có trần riêng.
- **[CEO] NHIỆM VỤ = lặp theo tần suất (ngày / tuần / tháng). THÀNH TỰU = làm một lần** (hạ dạng, chinh phục chuyên đề, qua lục địa… thuộc thành tựu, KHÔNG phải nhiệm vụ).
- **[CEO] Việc BẮT BUỘC (BTVN đúng hạn, ET đạt 80%, MT tăng hạng) KHÔNG nằm trong nhiệm vụ.** Chúng đã được trả bằng EXP lớp. Nhiệm vụ chỉ đo phần TỰ NGUYỆN trên app.
- **[CEO] Rank tạm khoá (ẩn khỏi học sinh).** Database vẫn tính ngầm; không còn là phần thưởng của nhiệm vụ.
- **[CEO] Nhiệm vụ trả 3 thứ:** (i) EXP quy thẳng ra xu · (ii) ĐIỂM HỌC TẬP (ĐHT) làm đầu vào để chơi game · (iii) bộ đếm làm điều kiện nhận HUY HIỆU.

## 2. Ba đồng
| Đồng | Nguồn | Dùng | Trần | Nhãn |
|---|---|---|---|---|
| **EXP (nhiệm vụ)** | việc ngày/tuần/tháng | đổi xu cuối tháng (100 EXP = 1 xu, theo DB hiện tại) | **20 xu/tháng/môn = 2.000 EXP** | [CEO] |
| **ĐHT** | việc ngày (mỗi lượt đạt) | vào chơi / mua trong game (Nông trại: hạt giống, ô, vé…) | **số dư tối đa 4.000 (= 2 tháng × 2.000)** | [CEO] |
| **Xu** | EXP đổi, + nguồn (b), (c) sau | đổi quà ở trung tâm | tổng ngân sách: bước ④ | — |

- **[CEO]** ĐHT tích luỹ được nhưng có giới hạn: **4.000** (2 tháng). Kiếm quá số dư tối đa thì phần dư mất (khuyến khích dùng ở game).
- **[CEO]** Điểm trong Nông trại ("điểm chăm chỉ", thang cũ 30/ngày) **quy đổi lại theo ĐHT** — game đọc ĐHT từ DB, không tự tạo điểm.
- **[ĐỀ XUẤT]** ĐHT **không** đổi ra xu, **không** mua bằng xu (một chiều: học → ĐHT → game). Tránh vòng lặp xu ↔ điểm.
- **[MỞ] Trần KIẾM ĐHT mỗi tháng:** Thùy ghi "tổng là 2.000 ĐHT" và "4.000 = 2 tháng" ⇒ hiểu là **2.000/tháng**. Nhưng 100 ĐHT/lượt × tối đa 4/ngày = 400/ngày ⇒ chạm trần sau 5 ngày. Xem §6 câu hỏi 1.

## 3. Lượt hợp lệ (điều kiện chung của mọi nhiệm vụ)
Một **lượt Luyện dạng yếu** (10 câu) được tính cho nhiệm vụ khi:
- **[CEO]** đúng **≥ 7/10**; và
- **[ĐỀ XUẤT]** thỏa luôn luật "lượt học thật" sẵn có (≥ 5 câu · trung bình ≥ 6 giây/câu · không ra lại câu đã gặp) để chống bấm bừa — nguồn duy nhất `_luot_hoc_that()` ở DB.
Chỉ Luyện dạng yếu tính. Học theo chủ đề / Thử thách / game **không** tính nhiệm vụ (chúng có đường thưởng riêng ở bước ②③).

## 4. Danh sách nhiệm vụ
| Tầng | Việc | Thưởng | Nhãn |
|---|---|---|---|
| Ngày | Đạt 1 lượt hợp lệ — **làm lại tối đa 4 lần/ngày** | mỗi lần: **ĐHT** (số: §6) **+ EXP** (số: §5) | ĐHT/lượt, 4 lần, EXP kèm: [CEO] · số: [ĐỀ XUẤT] |
| Tuần | **W1** — có lượt đạt ở **5 ngày** khác nhau trong tuần | 100 EXP | [ĐỀ XUẤT] |
| Tuần | **W2** — tổng **12 lượt đạt** trong tuần | 100 EXP | [ĐỀ XUẤT] |
| Tháng | **M1** — có lượt đạt ở **20 ngày** trong tháng | 300 EXP | [ĐỀ XUẤT] |
- Tuần = 4 khối như cũ (ngày 1–7, 8–14, 15–21, 22–hết tháng). Mọi việc là **đếm sự kiện lượt hợp lệ**, suy động ở DB, không bảng nhiệm vụ riêng.
- **[CEO] Daily trả CẢ ĐHT lẫn EXP** (không dồn hết vào tuần/tháng).

## 5. Ngân sách EXP → xu (trần 20 xu = 2.000 EXP/tháng)
**[ĐỀ XUẤT]** EXP mỗi lượt ngày = **20**.
| Kiểu học sinh | Ngày | Tuần (W1+W2) | Tháng (M1) | Tổng EXP | Xu |
|---|---|---|---|---|---|
| Nhẹ: 3 ngày/tuần × 1 lượt (~13 ngày) | 260 | 0 (chưa đủ 5 ngày/12 lượt) | 0 | 260 | **2,6** |
| Đều: 1 lượt/ngày (30 ngày) | 600 | 4 × 100 (W1) + 0 (W2 cần 12 lượt/tuần) = 400 | 300 | 1.300 | **13** |
| Chăm: 2 lượt/ngày | 1.200 | 4 × 200 = 800 | 300 | 2.300 → **chặn ở 2.000** | **20** |
⇒ Đều đặn mỗi ngày ≈ 13 xu; chỉ ai làm ≥ 2 lượt/ngày mới chạm trần 20. (Số có thể chỉnh: đổi EXP/lượt hoặc thưởng W/M.)

## 6. Câu hỏi MỞ cần Thùy chốt
1. **Thang ĐHT khớp "2.000/tháng, 4.000 số dư":** 100/lượt × 4 lần/ngày = 400/ngày chạm trần tháng sau **5 ngày**.
   - (A) **[ĐỀ XUẤT] 50 ĐHT/lượt**, trần kiếm 2.000/tháng: 1 lượt/ngày = 1.500/tháng (chưa chạm trần), trên ~1,33 lượt/ngày (40 lượt/tháng) mới chạm.
   - (B) Giữ 100/lượt, trần 2.000/tháng ⇒ chỉ 20 lượt/tháng có ĐHT (≈ 5 lượt/tuần), "4 lần/ngày" gần vô nghĩa.
   - (C) Giữ 100/lượt, KHÔNG trần kiếm tháng, chỉ trần số dư 4.000 (nguồn cung tới 12.000/tháng, game phải hút).
2. ĐHT hết hạn không (cuối tháng mất, hay cộng dồn tới trần 4.000)? **[CEO]**: tích luỹ tới 4.000 ⇒ không hết hạn, chỉ trần.
3. Vòng quay May mắn hiện cần "xong ≥ 2 nhiệm vụ ngày" — với nhiệm vụ mới điều kiện là gì? (đạt ≥ 2 lượt trong ngày?) Và EXP vòng quay còn dùng chung trần không?
4. Huy hiệu: Hercules (đang "vượt Thử thách") đổi thành gì? **[ĐỀ XUẤT]** "hoàn thành nhiệm vụ ngày ≥ N ngày/tháng". Các huy hiệu khác lấy bộ đếm nào từ nhiệm vụ?
5. Trần xu app cũ (30 = nhiệm vụ + vòng quay + huy hiệu, DB `tran_xu_app`) tách thế nào khi nhiệm vụ riêng 20? (bước ④)

## 7. Hệ quả kỹ thuật (làm SAU khi chốt, theo thứ tự)
1. **Ẩn Rank:** cờ `rankBat()` (mặc định tắt) — ẩn thẻ Rank ở Home/Thư viện/Hồ sơ, tin "lên bậc" ở Thế giới, chặng Rank của tutorial, mục Rank của Hướng dẫn chơi, chữ "Điểm Rank" ở Thử thách. DB không đổi.
2. **DB nhiệm vụ:** viết lại `fn_nhiem_vu_hoan_thanh`/`nhiem_vu_cau_hinh` theo §4; bỏ N1–N3, T1–T4, M1–M2, rương, Chặng cũ; **sổ ĐHT** `dht_so_cai` (sự kiện thật: +ĐHT khi lượt đạt, −ĐHT khi game tiêu; số dư = suy ra, trần 4.000 áp ở hàm ghi); trần EXP nhiệm vụ 2.000/tháng/môn (thay phần nhiệm vụ của `tran_xu_app`).
3. **App HS:** màn Nhiệm vụ viết lại; hiện ĐHT ở Home; Hướng dẫn chơi + tutorial sửa theo.
4. **Nông trại:** đọc/tiêu ĐHT qua RPC (hết localStorage cho tiền), đổi thang giá hạt/ô/vé theo ĐHT, chạy lại `tools/gia-lap.mjs` với nguồn cung mới (≈ 1.500–2.000 ĐHT/tháng thay vì ≤ 900 điểm cũ) để cân game.
5. **Huy hiệu:** Hercules + bộ đếm (§6.4).
