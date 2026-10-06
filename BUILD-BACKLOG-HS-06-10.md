# BACKLOG BUILD — App HS (lập 06/10/2026, để Thùy kiểm)

> Gồm: (1) mọi thứ đã bàn trong phiên chốt kinh tế/nhiệm vụ/thưởng, (2) 4 việc Thùy vừa nêu, (3) việc dở từ HANDOFF/V1 mà tôi kiểm lại.
> Cỡ: **S** ≤ nửa ngày · **M** 1–2 ngày · **L** 3+ ngày (ước lượng một phiên Claude). Trạng thái: ✅ xong · 🟡 dở · ⬜ chưa làm · ⛔ bị chặn.
> **Cần Thùy quyết** ghi ở cuối mỗi nhóm; số trong ngoặc [Q#] khớp danh sách câu hỏi cuối file.

---

## NHÓM 1 — Giao diện (4 việc Thùy vừa nêu)

| # | Việc | Chi tiết | Cỡ | Phụ thuộc |
|---|---|---|---|---|
| **G1** | **Đưa boss thật vào** (boss của Thùy + Minh Quân) | Hiện chặng thật vẫn dùng quái CC0 tạm; boss chỉ chạy ở trang soi. Việc: ① DB trả **mã boss** cho màn boss mỗi khu vực (hộp thư Số liệu spec §13.6) — gán boss ↔ khu vực/chặng cuối; ② đưa **3 form boss mới** (`final-boss-form-1/2/3`, mỗi form 12 trạng thái PNG 1024×1024) + Minh Quân vào `Skin.boss` qua cùng hợp đồng `ClipBoss/ChieuBoss` (đã có cho MQ); ③ sơ đồ **chiêu ↔ cơ chế** (form 2: "chiêu BTVN"; form 3: "Vô hạn BTVN / Test tháng 12 trang / Vì sao điểm kém" — đang là ý tưởng, chưa gắn luật nào); ④ nén WebP q95 (bài học độ mờ), lời thoại duyệt; ⑤ chuyển cảnh gặp boss (khung hội thoại `HoiThoaiBoss` đã có) | **L** | DB mã boss [Q1] |
| **G2** | **Màn GIỚI THIỆU trước "Luyện dạng yếu"** | Hiện bấm là vào câu hỏi ngay (`onYeu → LamTuLuyen` sinh bài tức thì). Cần màn **"Sẵn sàng chưa?"**: tên chế độ, luật 1 dòng (10 câu · đúng ≥ 7/10 là đạt), **thưởng hôm nay** (lượt còn X/4, mỗi lần +20 EXP +20 ĐHT — sau khi nhiệm vụ mới build), dạng em đang yếu nhất (xem trước), nhân vật + quái, nút **Bắt đầu** / **Quay lại**. Chữ formal gốc, giọng game qua `loi.ts`. Dùng cho cả Học theo chủ đề/Thử thách? [Q2] | **M** | thưởng hiển thị cần B2 |
| **G3** | **Giao diện câu hỏi "Luyện dạng yếu" (hiện là giao diện gốc, chưa trang trí)** | Làm bài dùng `LamBai` thường. Cần khung **theo style**: nền kín, thẻ câu hỏi (`KhungTran`/`Skin.tran`), thanh tiến độ 10 câu, phản hồi đúng/sai, lời giải, **màn kết quả** (đúng x/10, đạt/không, "lượt có được tính", thưởng nhận). Chọn: [Q3] dùng khung đấu 2D có quái (như Học theo chủ đề) hay khung gọn không quái? | **M–L** | G2 |
| **G4** | **Backdrop: chỉ màn NGOÀI dùng tranh; màn TRONG = UI kín màn hình + nền đơn sắc/tối riêng** | `ManHS` hiện đặt tranh nền (`--sk-page`) cho **24 màn**. Đổi: ① thêm biến `--sk-nen-trong` (đơn sắc/tối, mỗi style khai); ② `ManHS` mặc định = **kín màn hình + nền trong**, chỉ màn "ngoài" xin `nen="tranh"`; ③ rà từng màn; ④ cập nhật `check:style-hs` + `STYLE-HS.md`. **Màn NGOÀI [đề xuất]:** Home, khu Học tập (5 đảo), bản đồ thế giới/lục địa/chặng (đã có tranh riêng). **Màn TRONG [đề xuất]:** Nhiệm vụ, Thư viện BK, Hướng dẫn chơi, Hồ sơ, Album, Thành tựu, Ví xu, May mắn, Thông tin học tập, Bảng xếp hạng, Trò chơi (danh sách), Thế giới BK, danh sách ET/BTVN/bài trên lớp, Sổ tay (đã là màn đọc), Cài đặt giao diện [Q4] | **M–L** | duyệt danh sách [Q4] |

---

## NHÓM 2 — Kinh tế · Nhiệm vụ · Phần thưởng (đã bàn, chưa build)

| # | Việc | Chi tiết | Cỡ | Ghi chú |
|---|---|---|---|---|
| **K1** | **Ẩn Rank** | Cờ `rankBat()` mặc định tắt: ẩn thẻ Rank (Home/Thư viện/Hồ sơ), tin "lên bậc", chặng Rank tutorial + mục Hướng dẫn, chữ "Điểm Rank" ở Thử thách, ô "Bảng đua tháng". DB giữ nguyên chạy ngầm | **S** | làm TRƯỚC (rẻ, bỏ rối) |
| **K2** | **Nhiệm vụ mới** (DB) | Viết lại `fn_nhiem_vu_hoan_thanh`: lượt đạt = Luyện dạng yếu đúng ≥7/10 + lượt học thật; ngày ≤4 lần × (20 EXP + 20 ĐHT); tuần W1 (5 ngày)/W2 (12 lượt); tháng M1 (20 ngày). Bỏ N1–N3, T1–T4, M1–M2 cũ, rương, Chặng. Migration + test rollback | **L** | cần [Q5] số bảng W/M |
| **K3** | **Sổ ĐHT** (điểm học tập) | Bảng `dht_so_cai` (sự kiện thật +/−), số dư suy ra, **trần số dư 6.000**, kiếm tối đa 3.000/tháng; RPC cho game tiêu ĐHT | **M** | nền cho Nông trại |
| **K4** | **Trần xu theo nguồn** | Bảng `xu_tran_nguon` thay `tran_xu_app` chung; công thức cộng EXP đã cắt trần rồi `ceil` MỘT lần; nhiệm vụ 20 xu · vòng quay 10 xu · thành tựu không trần · huy hiệu không thưởng | **M** | sửa `fn_gami_exp_xu_thang` |
| **K5** | **App: màn Nhiệm vụ viết lại** + hiển thị ĐHT/xu/lượt còn lại ở Home | | **M** | K2, K3 |
| **K6** | **Vòng quay May mắn mới** | Ẩn ô khỏi Home; **tự bật khi hoàn thành việc ngày**; 1 lượt/ngày (lượt đạt đầu tiên mở), không tích; bảng giải mới (10/20/30/50/100/200, EV≈26,5, trần 10 xu/tháng); sửa `unique(hs,ngay)` giữ | **M** | K2 |
| **K7** | **Thành tựu 15 loại** | DB: bảng thành tựu + sự kiện + **reset mùa 01/07** + thưởng EXP lần-đầu-trong-mùa; thành phần cần dữ liệu mới: **log mở app** (#4), chuỗi nhiệm vụ ngày (#6), tổng câu (#8), bạn **mới** trong mùa (#14), master chủ đề ẩn (#15), 100% dạng của khối >10 dạng (#13); app: màn Thành tựu (có phần ẩn "đã mở N/M") thay màn "Thành tựu = giải thưởng" cũ? [Q6] | **L** | K2 cho #6 |
| **K8** | **Huy hiệu** | Migration đặt EXP sao = 0; chỉ số mới (Phoenix top10/tăng hạng · Hercules % chủ đề · Hephaestus ≥80% & 0 yếu · Nike "Sắp có"); bỏ vai "thêm"; Album + Hướng dẫn sửa | **L** | cần [Q7] 3 điểm |
| **K9** | **Ví xu** | thêm dòng nguồn mới (nhiệm vụ, vòng quay, thành tựu); `exp_huy_hieu` chỉ còn lịch sử | **S** | K4 |
| **K10** | **Thử thách** (bước ②b CHƯA bàn) | Rank ẩn ⇒ Thử thách mất thưởng duy nhất; Đấu trường 3 trận chưa có RPC; thưởng xu mới? Gắn với nhiệm vụ/huy hiệu đã bỏ | **L** | cần phiên thiết kế riêng [Q8] |
| **K11** | **Game kiếm xu** (bước ③ CHƯA bàn) | Nông trại ↔ ĐHT/xu, Săn quái vật, tháp Sinh tồn, thưởng Đấu Từ | **L** | [Q8] |
| **K12** | **Ngân sách tổng + chống lạm dụng** (bước ④) | tổng xu/tháng/năm tối đa, EXP lớp không trần, farm vòng xu | **M** (thiết kế) | sau K10–K11 |

---

## NHÓM 3 — Bảng xếp hạng (đã duyệt 8 bảng)
**Quy tắc mới (Thùy 06/10): bảng đi THEO MÔN như cả giao diện; bảng không gắn môn (A5 chuỗi, E1 huy hiệu) hiện ở MỌI môn.** MT tháng: so thẳng điểm.

| # | Việc | Cỡ |
|---|---|---|
| **X1** | DB: `bxh_loai` (cấu hình) + `fn_bxh(loai, mon, pham_vi, ky)` trả **top 20 + hạng của chính người gọi**; ẩn tài khoản test; cache `bxh_chot` cập nhật 05:00 (không có pg_cron ⇒ gắn quy trình chốt / gọi lười) | **L** |
| **X2** | 7 bảng không-game: A1 Siêng luyện · A2 Tổng câu đúng · A3 Tỉ lệ đạt · A4 Master chủ đề · A5 Chuỗi · B1 MT · E1 Huy hiệu (mỗi bảng: Khối mình + Toàn BK) | **M** |
| **X3** | App: **ô lớn trong lưới** (thay ô cũ, cả cấp 2/3) + màn Bảng xếp hạng (nhóm → bảng → Khối/Toàn BK) + Hướng dẫn + tutorial | **M** |
| **X4** | **C1 tháp Sinh tồn** ⛔ cần hồ sơ Đấu Từ theo tài khoản + máy chủ chấm (xem nhóm 4) | **L** |

---

## NHÓM 4 — Game
| # | Việc | Chi tiết | Cỡ |
|---|---|---|---|
| **P1** | **Đấu Từ: hồ sơ theo TÀI KHOẢN + máy chủ giữ đáp án/chấm điểm** | Hiện hồ sơ theo thiết bị (uid ngẫu nhiên), client tự khai `so_dung/diem`. Cần cho BXH, thưởng, Nike. **Việc nặng nhất của cả backlog** | **L** |
| **P2** | **Nông trại theo tài khoản** | Hiện `localStorage` chung origin ⇒ nhiều em dùng chung 1 máy thấy cùng vườn, đổi máy mất; tiền (xu/EXP lẻ/điểm) do client giữ, sửa được. Cần lưu DB + đọc ĐHT từ K3 + đổi thang giá theo ĐHT + chạy lại `gia-lap.mjs` | **L** |
| **P3** | **Tháp 50 tầng + Hard** | **ĐÓNG/để sau** (Thùy 06/10). Spec `spec-kinh-te-nhiem-vu.md` §13 giữ | — |
| **P4** | **Săn lùng Quái Vật** | thẻ "sắp ra mắt" đã có; game chưa làm | — |
| **P5** | Icon ô "Trò chơi" riêng (RPG/Khối vuông đang mượn) + icon ô Bảng xếp hạng | cần ChatGPT vẽ (Đơn 14) | **S** (khi có hình) |

---

## NHÓM 5 — Việc dở V1 (từ HANDOFF/spec-v1, tôi kiểm lại)
| # | Việc | Trạng thái |
|---|---|---|
| **V1** | **Deploy thử nghiệm + kiểm thật trên iPad/điện thoại**: chuyển cảnh mượt, Đấu trường BK (Tiếng Anh) hết về Home, Trò chơi/Nông trại trong PWA/service worker, hiệu ứng boss. Nhiều thứ đã trên `main` nhưng **chưa deploy/chưa thử máy thật** | 🟡 |
| **V2** | **Góp ý / Báo lỗi cho học sinh** — hạng mục V1 #8: DB + RPC xong, **chưa có màn trong app HS** (form + "Góp ý của em" + chấm đỏ) | ⬜ **M** |
| **V3** | **Chuỗi làm bài — UI**: DB xong; chưa có ngọn lửa trên Home, hoạt cảnh mốc, chặng tutorial | ⬜ **M** |
| **V4** | **Báo "lượt chưa tính"** ở LamBai thường + Thử thách (mới có ở màn đấu Học theo chủ đề) | ⬜ **S** |
| **V5** | **Tutorial** chưa tự mở lần đầu, tiến độ không lưu DB (cần `da_xem_tutorial`); phải **viết lại theo hệ mới** (nhiệm vụ, Rank ẩn, vòng quay, huy hiệu, BXH) | 🟡 **M** |
| **V6** | **Hướng dẫn chơi** sửa theo hệ mới (cùng V5) + 5 chỗ lệch spec/DB đã nêu | 🟡 **S** |
| **V7** | **Tin Thế giới** chữ cho `chuoi`/`len_bac` (bỏ len_bac vì Rank ẩn); nút 👑 Thầy cô khen ở **app GV** | ⬜ **S** |
| **V8** | **Ảnh thiếu:** kit lục địa BĂNG · nền màn dạng bài (Trời sao, Đông gió, Thành cổ) · nền chibi 3 kit cũ · icon ô vẽ riêng | ⛔ chờ ảnh |
| **V9** | **Bật cờ**: `hoctap`/`phieuluu` đang TẮT ở Production — bật khi V1 ra; Ignored Build Step trên Vercel (Thùy) | ⬜ |
| **V10** | **≥ 2 style**: RPG + Khối vuông + Tối giản đã dựng; style "Thị trấn" đang làm; rà lại mọi màn mới (Trò chơi, Hướng dẫn, BXH) đủ icon/ngôn ngữ cho cả 3 | 🟡 |
| **V11** | **Bản dọc không vỡ**, `prefers-reduced-motion`, máy yếu (đồ hoạ Thấp) — rà toàn bộ màn mới | ⬜ **M** |
| ⚠ **V0** | **Deadline V1 = 06/10 (hôm nay)** — trong khi G1–G4, K1–K9, X1–X3, P1–P2 còn nhiều ⇒ **cần Thùy dời ngày hoặc cắt phạm vi** [Q9] | |

---

## THỨ TỰ ĐỀ XUẤT
1. **Nhanh, rẻ, bớt rối:** K1 (ẩn Rank) → G4 (backdrop trong/ngoài, khung chung) → G2 + G3 (màn giới thiệu + giao diện luyện) → V4.
2. **Kinh tế lõi (DB):** K2 → K3 → K4 → K6 → K5 → K9 (đi cùng nhau, 1 đợt migration).
3. **Boss:** G1 (cần mã boss từ DB — làm cùng đợt Số liệu).
4. **Bảng xếp hạng:** X1 → X2 → X3.
5. **Thành tựu + huy hiệu:** K7, K8 (sau khi chốt Q7).
6. **Game theo tài khoản:** P1 → X4 → P2 (nặng, làm song song bởi luồng GAME).
7. **Hoàn thiện V1:** V1 (deploy+thử máy) · V2 · V3 · V5 · V6 · V11.
Thiết kế còn lại song song: K10 (Thử thách), K11 (game kiếm xu), K12 (ngân sách tổng).

## CÂU HỎI CẦN THÙY QUYẾT
- **[Q1]** G1: boss nào ở khu vực nào? 3 form `final-boss-form-1/2/3` + Minh Quân — **form nào là "boss hình Thùy"**? Cách gán: mỗi chuyên đề một boss luân phiên, hay boss riêng theo giáo viên/lớp?
- **[Q2]** G2: màn giới thiệu chỉ cho Luyện dạng yếu, hay làm **khung chung** cho Học theo chủ đề / Thử thách / Chinh phục?
- **[Q3]** G3: câu hỏi Luyện dạng yếu dùng **khung đấu 2D có quái** (như Học theo chủ đề) hay **khung gọn không quái**?
- **[Q4]** G4: duyệt danh sách màn NGOÀI (Home · khu Học tập · bản đồ) và màn TRONG (mọi màn còn lại). Nền màn trong: **tối cho RPG, sáng cho Khối vuông, trơn cho Tối giản**?
- **[Q5]** K2: gật số tuần/tháng đề xuất (W1: 5 ngày → 100 EXP + 50 ĐHT; W2: 12 lượt → 100 EXP + 50 ĐHT; M1: 20 ngày → 300 EXP + 200 ĐHT)?
- **[Q6]** K7: màn Thành tựu mới **thay** màn "Thành tựu = giải thưởng cuối tháng" hiện tại, hay đứng cạnh?
- **[Q7]** K8: thang sao huy hiệu 1/2/4/6/9 · bản cứng ★4–5 giữ/bỏ · Helios/Chronos/Athena/Zeus đổi gì không.
- **[Q8]** K10/K11: bàn tiếp **Thử thách** và **thưởng game** ngay sau đây?
- **[Q9]** V0: dời deadline V1 hay cắt phạm vi? Bản V1 tối thiểu gồm gì?
