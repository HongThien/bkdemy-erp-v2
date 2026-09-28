# Spec — RANK · DANH HIỆU TOP DẠNG · THÀNH TỰU · NHIỆM VỤ NGÀY/TUẦN/THÁNG cho Học sinh — v3

> **Trạng thái: ĐỀ XUẤT v3 (CTO, 28/09/2026) — CHỜ CEO CHỐT §9 (quan trọng nhất: THEME / BỘ TÊN).** Chưa code, chưa migration.
>
> **Lịch sử (trong git):**
>
> | Bản | Commit | Nội dung | Thùy nhận xét |
> |---|---|---|---|
> | v1 | `b52a4eb` | Khung app học (Khan/Duolingo) | Bác |
> | v2 | `123fb12` | Khung game, dựa Liên Quân | Sửa 4 ý (dưới) |
>
> **v3 sửa theo 4 ý + 1 luật của Thùy (28/09):**
> 1. **Rank KHÔNG dựa Elo.** Elo chỉ đổi theo ET, ET ít ⇒ không đủ để làm số đo. Rank mới tính điểm từ **MỌI hoạt động học**.
> 2. **Danh hiệu top theo dạng: giữ ý tưởng, KHÔNG dùng tên/cơ chế gọi theo Liên Quân** (HS sẽ bảo trung tâm copy).
> 3. **Thành tựu: mỗi thành tựu tự lên bậc tuần tự** Đồng → Bạc → Vàng → Kim Cương (hết bậc này mới tới bậc kia). Bỏ bậc "Huyền Thoại theo top %".
> 4. **Nhiệm vụ ngày/tuần/tháng: giữ khung, ĐẶT TÊN KHÁC**, không mượn "Sổ Sứ Mệnh".
> 5. **KHÔNG chống cày ảo — cày càng nhiều càng tốt.** Và nhiệm vụ/điểm phải phủ **cả việc học trên lớp, đi thi thử, BTVN…**, không riêng tự luyện trên app.
>
> **Theme:** Thùy chọn "theme khác" (không Mythwings, không trung tính), nhưng chưa nêu theme cụ thể.
> ⇒ Mọi tên trong spec là **[tên tạm]**, gom về **1 bảng §8**. Có theme thì chỉ thay bảng đó, cấu trúc không đổi.
>
> **Đích:** HS thấy **rank, danh hiệu, thành tựu, nhiệm vụ và phần thưởng**, rồi cày: đi học đều, làm bài trên lớp tốt, nộp BTVN, đi thi thử, tự luyện trên app.

---

## 0. Tóm tắt 1 trang

| Trục | HS hỏi | Điểm từ đâu | Lên/xuống | Khoe |
|---|---|---|---|---|
| **① RANK MÙA** (theo môn) | "Em đang bậc gì môn Toán?" | **Điểm Rank** cộng từ **mọi hoạt động**: có mặt · bài trên lớp · lên bảng · BTVN · thi thử/sát hạch · bổ trợ · Học từ đầu · tự luyện · dạng lên đạt · thưởng nhiệm vụ | **Chỉ lên trong mùa** (cày là leo). Reset mềm đầu mùa | Khung avatar · TV lớp |
| **② DANH HIỆU TOP DẠNG** (theo dạng × khối) | "Em là Top mấy dạng *Tỉ lệ thức* khối 8?" | **Điểm Dạng**: mỗi câu đúng của dạng đó, **từ mọi nguồn** (lớp, BTVN, thi, app) | Chốt **mỗi thứ Hai**. Bị vượt là mất. Bỏ luyện lâu thì tụt | Danh hiệu dưới tên |
| **③ THÀNH TỰU** | "Em lên Vàng thành tựu nào rồi?" | Đếm hoạt động | Mỗi thành tựu lên **tuần tự Đồng → Bạc → Vàng → Kim Cương**, không bao giờ mất | 3 huy hiệu khoe |
| **④ NHIỆM VỤ ngày/tuần/tháng** | "Hôm nay em làm gì?" | Việc **trên lớp + ở nhà + thi** | Ngày sống 3 ngày · tuần dồn được · tháng là 1 chặng 30 cấp | Thanh chặng tháng |
| **⑤ ĐUA LỚP** | "Lớp em đứng mấy khối?" | Tổng Điểm Rank tuần của lớp / sĩ số | Tuần + tháng | TV mọi lớp |

**Nguyên tắc cày:** **không có trần, không khoá giờ, không giảm điểm khi làm nhiều.**
- Điểm Rank và Điểm Dạng **không đổi ra xu**.
- Xu chỉ đến từ **số nhiệm vụ cố định** mỗi ngày/tuần/tháng và từ **mốc thành tựu**.
- ⇒ HS cày bao nhiêu cũng được, ngân sách xu vẫn tự có trần. Không phải chặn gì.

---

## 1. Hiện trạng BK (soi DB + code 28/09) — nguồn dữ liệu cho điểm

| Hoạt động | Bảng (có sẵn) | Có `mon`? |
|---|---|---|
| Có mặt / vắng | `buoi_hoc_hs.diem_danh` (`co_mat · vang · vang_phep`) | qua buổi |
| Bài trên lớp (ingame / ET / MT) | `gami_grades` ⋈ `gami_session_problems` (phase, `ma_dang`) | ✓ |
| Lên bảng Nhất/Nhì/Giải 3 | `buoi_giai` (Giải 3 = có mặt, không có dòng) | ✓ |
| Game buổi | `buoi_game_luot` | ✓ |
| BTVN | `btvn_nop` · `btvn_ket_qua` (`trang_thai_nop`, `ti_le_dung`, `thai_do`) | qua buổi |
| **Thi thử / sát hạch / khảo sát tháng** | `ky_thi` (loai `truong · mt_sat_hach · khao_sat_thang`, mùa) ⋈ `diem_thi` (`verdict`, `vuot_band`, `full_diem`) · đề thi trên app `bai_test.loai='de_thi'` (ô "Đề thi thử" đang khoá) | ✓ |
| Bài app từng câu (tự luyện · bổ trợ · Học từ đầu · retest · BTVN app) | `bai_lam_cau` ⋈ `bai_lam` ⋈ `bai_test` (loai, `mon`) ⋈ `bai_test_cau` (`ma_dang`) | ✓ |
| Bổ trợ / Học từ đầu | `bo_tro_yeu(_dang)` · `hoc_tu_dau_dang` | ✓ |
| Mastery dạng | `fn_mastery_cells` | ✓ |
| Giải tháng | `giai_thuong` | ✓ |
| Catalog thành tích (12 key) + ghim khoe | `thanh_tich_loai` · `hoc_sinh_thanh_tich_ghim` | per_mon |
| EXP → xu | `gami_exp_ledger` → `qlht_xu_ledger` | ✓ / ví chung |

**Ghi chú:**
- **Elo** (`gami_elo`) **giữ nguyên** cho việc đang dùng (ghép, xếp hạng ET), **không làm nền cho rank** (ý 1).
- **Chưa có:** rank bậc, danh hiệu, sổ thành tựu đạt, nhiệm vụ.
- Tự luyện, Học từ đầu, bổ trợ hiện **không sinh gì** ⇒ lần đầu được tính.

---

## 2. Mẫu game tham khảo (chỉ lấy CƠ CHẾ, không lấy tên)

| Cơ chế | Game dùng | BK lấy gì |
|---|---|---|
| Thang bậc mùa, thưởng theo **bậc cao nhất trong mùa**, đồ mùa hết mùa là hiếm vĩnh viễn, reset mềm | LoL, Free Fire, PUBG, Valorant, Hearthstone | Rank mùa ① |
| **Ghế top có hạn** cho bậc đỉnh (top N + điểm sàn), chốt hằng ngày | LoL Challenger, PUBG Conqueror, Valorant Radiant | Bậc đỉnh ① |
| **Điểm theo TỪNG đối tượng** (từng nhân vật/lá bài) + danh hiệu top theo phạm vi, chốt tuần | Honor of Kings, Clash Royale Card Mastery | Danh hiệu top dạng ② |
| Mỗi thành tựu **lên bậc tuần tự**, ngưỡng giãn dần ×4–×10 | Pokémon GO medal, LoL Challenges, Genshin | Thành tựu ③ |
| Thành tựu hết mùa khoá vĩnh viễn, không tính tổng | WoW Feats of Strength, LoL Legacy | Kỷ niệm ③ |
| Nhiệm vụ ngày sống nhiều ngày · tuần dồn được · đủ N nhiệm vụ mở rương · chặng tháng nhiều cấp | Genshin, Fortnite, PUBG Royale Pass, Hearthstone | Nhiệm vụ ④ |
| Đua tập thể, mốc quà chung, ai góp cũng nhận | Free Fire quân đoàn, Clash of Clans Clan Games | Đua lớp ⑤ |
| Người chơi **tự chọn** 1 danh hiệu + 3 huy hiệu, hiện ở chỗ người khác thấy | LoL màn loading, Free Fire hồ sơ | Khoe trên TV |

Nguồn chi tiết: §10.

---

## 3. ① RANK MÙA theo môn

### 3.1 Điểm Rank — cộng từ mọi hoạt động (theo môn, trong mùa)

| Hoạt động | Điểm Rank [đề xuất, chỉnh sau 2 tuần chạy thật] |
|---|---|
| Có mặt 1 buổi | 20 |
| Bài trên lớp (ingame + ET) | 0–30 theo tỉ lệ đúng |
| Lên bảng: Nhất / Nhì / Giải 3 | 30 / 20 / 10 |
| BTVN: nộp đúng hạn / nộp muộn | 15 / 5, **+ 0–15** theo tỉ lệ đúng |
| **Thi thử / khảo sát / sát hạch**: dự thi | 40 |
| — đạt / vượt band / điểm 10 | +40 / +60 / +80 |
| Tự luyện / BTVN app / retest: **mỗi câu đúng** | 2 (**không trần**) |
| Bổ trợ: ca kết quả đạt | 40 |
| Học từ đầu: xong 1 dạng (đọc lý thuyết + nộp test) | 20 |
| 1 dạng lên đạt (mastery) | 25 |
| Thưởng nhiệm vụ / thành tựu | theo §5, §6 |

**Ước lượng:** 1 buổi đi học đầy đủ ≈ 60–110 điểm. 1 lượt tự luyện 10 câu đúng 8 ≈ 16 điểm.
⇒ Đi học đều là xương sống, cày app là phần leo thêm **không giới hạn**. Tỉ lệ này là Q3 cho CEO chỉnh.

### 3.2 Bậc

- 7 bậc, mỗi bậc 3 đoàn (III → I). Riêng bậc đỉnh là **ghế có hạn**. **Tên bậc: §8.**
- **Ngưỡng điểm** đặt sau 2–4 tuần chạy thật, theo phân bố thật. Mục tiêu cuối mùa: ~30% HS ở 2 bậc đầu, ~5% ở bậc 6.
- **Bậc đỉnh (bậc 7)** = **Top N Điểm Rank môn trong khối**, N = max(1, 3% HS khối), **và** điểm ≥ sàn bậc 6. Chốt 05:00 hằng ngày.
  - Bị vượt thì rơi về bậc 6. Đây là chỗ **duy nhất** có tụt ⇒ phải cày giữ ghế.
- **Không tụt trong mùa** (trừ ghế đỉnh): điểm chỉ cộng.

### 3.3 Mùa

- **Mùa rank = mùa Level sát hạch** (`ky_thi.mua`) — Q2.
- **Thưởng cuối mùa theo bậc CAO NHẤT đạt được:** khung avatar **mang tên mùa**. Bậc 5 trở lên thêm danh hiệu mùa. Hết mùa không ai lấy được nữa ⇒ đồ hiếm vĩnh viễn.
- **Quà cơ bản mùa** cho mọi em dự đủ K buổi. Bậc chỉ đổi **màu** của quà.
- **Reset mềm:** mùa mới khởi đầu **thấp hơn 2 bậc** so với bậc cuối mùa trước (bậc 1–2 thì về bậc 1).

---

## 4. ② DANH HIỆU TOP DẠNG (dạng × khối × môn)

- **Điểm Dạng** (HS × dạng × môn), tính trọn mùa:
  - Mỗi câu đúng của dạng đó, **từ mọi nguồn**, +1.
  - Bài **trên lớp / BTVN chấm / thi thử** được **×2** (quan trọng hơn bài luyện).
  - Không trần, không khoá giờ.
- **Phạm vi = khối × môn** (dạng gắn theo chương của khối). Nhiều cơ sở thì thêm tầng cơ sở (Q5).

| Danh hiệu [tên tạm — §8] | Điều kiện | Chu kỳ |
|---|---|---|
| Hạng A dạng X | Top **20%** HS khối có đo dạng X, và điểm ≥ sàn A | Chốt 00:00 thứ Hai, giữ 1 tuần |
| Hạng B dạng X | Top **5%**, và điểm ≥ sàn B | Tuần |
| Top 3 dạng X khối 8 | Hạng 1–3, và điểm ≥ sàn | Tuần |
| **Số 1 dạng X khối 8** | Hạng 1 | Tuần |
| **Số 1 môn khối** | Tổng Điểm Dạng mọi dạng của môn cao nhất khối | **Tháng** (trao cùng giải tháng) |

**Luật đi kèm:**
- **Có sàn**, để dạng chỉ 2–3 em làm không ra "Top 1" rẻ.
- Phân vị chỉ tính trên HS **đã có đo** dạng đó (§5 CLAUDE.md: chưa đo ≠ yếu).
- **Giữ ngôi:** dạng không có câu mới trong **14 ngày** ⇒ Điểm Dạng *đua* giảm 5%/tuần tới khi làm lại. Tuần nghỉ chung của trung tâm thì không giảm.
  - Chỉ đụng **điểm đua**. **Mastery không bao giờ giảm** (mastery suy từ đo thật).
- **Bị vượt có thông báo:** "Bạn Minh vừa vượt em ở dạng X — còn 12 điểm để lấy lại". Kèm nút **"Luyện dạng X"** mở thẳng bài.

---

## 5. ③ THÀNH TỰU — mỗi thành tựu tự lên bậc tuần tự

| Bậc | Hình | Ngưỡng | Thưởng |
|---|---|---|---|
| 🥉 Đồng | 1 sao | Dễ — đạt trong 1–2 tuần | +Điểm Rank 20 |
| 🥈 Bạc | 2 sao | ×4–5 | +50 EXP · +Điểm Rank 50 |
| 🥇 Vàng | 3 sao | ×4–5 | +150 EXP · +Điểm Rank 120 |
| 💎 Kim Cương | 4 sao | ×4–10 (cày cả năm) | +400 EXP · +Điểm Rank 300 · khung nhỏ |

- **Hết Đồng mới hiện thanh tiến độ tới Bạc**, hết Bạc mới tới Vàng. Đã đạt thì **không bao giờ mất**.
- Thẻ đã đạt hiện **"N bạn trong khối đã đạt"**. Dưới 10% khối thì gắn nhãn **Hiếm**.
- **Tổng số sao** = "Điểm Sưu tập": khoe trên hồ sơ, không tiêu được.

### 5.1 Danh mục khởi đầu (30 thành tựu, 6 nhóm) — `[M]` theo môn · `[C]` chung

**🏫 Trên lớp**

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `co_mat` [M] | Chuyên Cần | Tổng buổi có mặt | 10 / 40 / 120 / 300 | `buoi_hoc_hs` |
| `chuoi_co_mat` [M] | Không Nghỉ | Chuỗi buổi có mặt liên tiếp (thay `chuoi_di_hoc`, **chuyển xuống DB**) | 5 / 15 / 40 / 100 | `buoi_hoc_hs` |
| `nhat_buoi` [M] | Nhất Buổi | Được chốt Nhất xếp hạng buổi | 1 / 5 / 20 / 60 | `buoi_giai` |
| `len_bang` [M] | Lên Bảng | Vào Nhất/Nhì/Giải 3 | 3 / 15 / 50 / 150 | `buoi_giai` |
| `top_et` [M] | Đỉnh ET | Hạng 1 ET buổi (key cũ `top1_et`) | 1 / 5 / 20 / 60 | `gami_elo_history.rank` |

**📝 Bài tập về nhà**

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `btvn_nop` [M] | Chăm Bài | Tổng bài BTVN đã nộp | 10 / 40 / 120 / 300 | `btvn_ket_qua` |
| `btvn_dung_han` [M] | Đúng Hẹn | Chuỗi BTVN nộp đúng hạn (thay `chuoi_btvn`) | 5 / 15 / 40 / 100 | `btvn_ket_qua` |
| `btvn_gioi` [M] | Bài Đẹp | BTVN tỉ lệ đúng ≥ 90% | 3 / 15 / 50 / 150 | `btvn_ket_qua.ti_le_dung` |

**🎯 Thi cử**

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `di_thi` [M] | Dạn Dày | Số lần dự thi thử / khảo sát / sát hạch | 1 / 5 / 15 / 40 | `diem_thi` |
| `thi_dat` [M] | Qua Ải | Số bài thi `verdict='dat'` | 1 / 5 / 15 / 40 | `diem_thi` |
| `vuot_band` [M] | Vượt Band | Số lần vượt band (key cũ `vuot_band` / `len_band`) | 1 / 3 / 8 / 20 | `diem_thi.vuot_band` |
| `diem_cao` [M] | Điểm Cao | Bài thi ≥ 9 (Kim Cương = 10 tròn ×3) | 1 / 3 / 8 / ×3 | `diem_thi` |
| `level` [M] | Leo Level | Level sát hạch trong mùa | 3 / 7 / 12 / 21 | `ky_thi` / `diem_thi` |

**💪 Tự luyện** (cày không giới hạn)

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `cau_dung` [M] | Ngàn Câu | Tổng câu đúng trên app | 100 / 500 / 2.000 / 10.000 | `bai_lam_cau` |
| `luot_luyen` [M] | Luyện Đều | Số lượt tự luyện hoàn thành | 10 / 50 / 200 / 800 | `bai_lam` |
| `tron_diem` [M] | Trọn Điểm | Lượt 10/10 | 1 / 10 / 50 / 200 | `bai_lam` |
| `chuoi_dung` [M] | Chuỗi Đúng | Kỷ lục câu đúng liên tiếp | 10 / 25 / 50 / 100 | `bai_lam_cau` |
| `sua_sai` [M] | Sửa Sai | Câu sai rồi trong 14 ngày làm đúng lại câu cùng dạng | 10 / 50 / 200 / 800 | `bai_lam_cau` |

**👑 Chinh phục dạng**

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `dang_dat` [M] | Kho Dạng | Số dạng đạt | 5 / 20 / 60 / 150 | `fn_mastery_cells` |
| `lap_lo` [M] | Lật Kèo | Dạng từ yếu → đạt | 1 / 5 / 20 / 50 | lịch sử mastery |
| `vuot_kho` [M] | Vượt Khó | Ca bổ trợ đạt / xong dạng Học từ đầu | 1 / 5 / 15 / 40 | `bo_tro_yeu` · `hoc_tu_dau_dang` |
| `top_dang` [M] | Giữ Top | Số tuần giữ bất kỳ danh hiệu Top 3 / Số 1 dạng | 1 / 5 / 20 / 50 | sổ danh hiệu |
| `so1_dang` [M] | Số 1 | Số **dạng khác nhau** từng giữ Số 1 | 1 / 3 / 10 / 25 | sổ danh hiệu |
| `rank_dinh` [M] | Leo Rank | Bậc rank cao nhất từng đạt: bậc 3 / 4 / 5 / 6 | 1 mốc mỗi bậc | rank mùa |

**🔥 Nhiệm vụ & Bí ẩn / Kỷ niệm**

| key | Tên [tạm] | Điều kiện | Đ / B / V / KC |
|---|---|---|---|
| `nv_tuan` [C] | Siêng Năng | Số tuần mở được rương tuần | 1 / 4 / 12 / 30 |
| `chang_thang` [C] | Về Đích | Số tháng hoàn thành đủ 30 cấp chặng tháng | 1 / 3 / 6 / 10 |

Bí ẩn / Kỷ niệm: 1 lần · ẩn tới khi đạt · kỷ niệm mùa khoá khi hết mùa.

| key | Điều kiện |
|---|---|
| `nguoc_dong` [M] | Từ nửa dưới lớp lên Nhất buổi trong 4 buổi |
| `tham_tu` | Báo sai đề được xác nhận (`bai_test_report.trang_thai='dung'`) |
| `tra_sua` | Trúng trà sữa game buổi (`buoi_game_qua`) |
| `mua_<ma>` | Tham gia mùa rank X |
| `sk_<ma>` | Kỷ niệm sự kiện (vd Trung thu 2026) |

### 5.2 Khoe

- HS **tự chọn 1 danh hiệu** (top dạng / danh hiệu mùa) **và 3 huy hiệu thành tựu**. Dùng lại `hoc_sinh_thanh_tich_ghim`.
- Khung avatar = bậc rank cao nhất đang có.
- **Hiện ở:**
  - TV khi công bố xếp hạng buổi.
  - Thẻ tên trong Mở Rương / Chiếm Đất.
  - Màn thành tích chiếu TV.
  - Header app HS.
- TV chỉ xướng tên người trong top. Hạng thấp chỉ em đó thấy trong app của mình.

---

## 6. ④ NHIỆM VỤ ngày / tuần / tháng — phủ cả lớp, BTVN, thi, app

| Tầng | Số lượng | Sống | Điểm Chặng |
|---|---|---|---|
| **Ngày** | 4 | **3 ngày** (lỡ 1–2 ngày không mất) | 10 / nhiệm vụ |
| **Tuần** | 4 | **Dồn tới hết tháng** | 30 / nhiệm vụ |
| **Rương tuần** | Xong **10 nhiệm vụ** trong tuần (ngày + tuần gộp) | Thứ Hai → Chủ nhật | +50 + rương |
| **Tháng** | **1 chặng 30 cấp × 50 điểm** · 2 nhiệm vụ tháng | Reset đầu tháng (trùng kỳ chốt xu) | 100 / nhiệm vụ tháng |

Không có trần điểm tuần, không khoá giờ. Số nhiệm vụ mỗi kỳ đã cố định nên phần thưởng tự có giới hạn.

**Ngày** (sinh theo HS, mỗi nhiệm vụ gắn `mon`):
1. **Lên lớp** — có mặt buổi hôm đó. Tự hoàn thành khi OPS điểm danh.
2. **Luyện tập** — làm đúng 10 câu trên app, bất kỳ dạng.
3. **Sửa sai** — làm đúng lại 2 câu thuộc dạng em vừa sai (trên lớp hay app đều tính).
4. **Giữ top / Lên top** — +X Điểm Dạng ở dạng em đang giữ danh hiệu, hoặc dạng đang gần lọt top 3 nhất (hệ tự chọn dạng).

Được đổi nhiệm vụ 2 hoặc 4 một lần/ngày.

**Tuần:**
- (a) Nộp đủ BTVN các buổi trong tuần.
- (b) Lên bảng (Nhất/Nhì/Giải 3) ít nhất 1 buổi.
- (c) Đưa 1 dạng yếu lên đạt.
- (d) Lọt Top 3 bất kỳ dạng nào trong khối.

**Tháng:**
- (a) **Dự 1 kỳ thi thử / khảo sát / sát hạch** trong tháng (có lịch thì hiện, không có lịch thì thay bằng "Làm 1 đề thi trên app" khi ô Đề thi thử mở).
- (b) Lên 1 bậc rank.

**Quà theo cấp chặng tháng** (miễn phí, không có bản trả tiền):

| Cấp | Quà |
|---|---|
| Cấp thường | EXP theo môn → xu cuối tháng |
| Mỗi 5 cấp | Xu trực tiếp |
| Cấp 10 | **Thẻ Giữ Ngôi** — hoãn giảm Điểm Dạng 7 ngày, dùng khi ốm/nghỉ |
| Cấp 20 | **Thẻ Nhân Đôi** — ×2 Điểm Rank 1 buổi học tự chọn *(cày càng nhiều càng tốt ⇒ cho phép)* |
| Cấp 25 | Sticker / khung cảm xúc dùng trên TV |
| **Cấp 30** | **Khung tháng** mang tên tháng (đồ sưu tập) + 1 lượt "chọn ô trước" ở Chiếm Đất |

**Rương tuần** gồm xu + Điểm Rank + tỉ lệ nhỏ ra Thẻ Giữ Ngôi / Thẻ Nhân Đôi. **Tỉ lệ công khai** như `game_lop_thuong`.

**Sự kiện cuối tuần** (GĐ sau): "Thử thách dạng X", đúng 10 câu trước khi sai 3. Quà theo số câu đúng. Có bảng top sự kiện của khối.

---

## 7. ⑤ ĐUA LỚP vs LỚP (cùng khối, cùng môn)

- **Điểm lớp tuần** = tổng Điểm Rank kiếm được trong tuần của cả lớp ÷ sĩ số. Chia sĩ số để lớp 8 em và lớp 15 em đua công bằng.
- **Mốc tập thể 1 / 2 / 3:** mọi em có đóng góp đều nhận quà.
- **Tháng:** lớp Nhất khối × môn được vinh danh trên TV mọi lớp, cả lớp nhận thưởng (Q6).
- TV hiện **thanh điểm theo lớp**. Không hiện chi tiết từng em.

---

## 8. BẢNG TÊN [TẠM] — chờ Thùy chọn theme (Q1)

Mọi chỗ trong spec và code sẽ đọc tên từ đây (1 bảng cấu hình trong DB). Đổi theme = đổi bảng này.

| Khái niệm | Key kỹ thuật | Tên tạm trong spec | Theme mới → |
|---|---|---|---|
| Điểm leo rank | `diem_rank` | Điểm Rank | ? |
| 7 bậc rank | `bac_1..bac_7` | Bậc 1 … Bậc 6, bậc 7 = ghế đỉnh | ? |
| Điểm theo dạng | `diem_dang` | Điểm Dạng | ? |
| Danh hiệu dạng | `dh_a · dh_b · dh_top3 · dh_so1 · dh_so1_mon` | Hạng A · Hạng B · Top 3 · Số 1 · Số 1 môn | ? |
| 4 bậc thành tựu | `dong · bac · vang · kim_cuong` | Đồng · Bạc · Vàng · Kim Cương (Thùy dùng từ này ở ý 3) | giữ / ? |
| 6 nhóm thành tựu | `lop · btvn · thi · luyen · dang · nv` | Trên lớp · BTVN · Thi cử · Tự luyện · Chinh phục dạng · Nhiệm vụ | ? |
| Hệ nhiệm vụ | `nhiem_vu` | Nhiệm vụ ngày / tuần / tháng | ? |
| Chặng tháng 30 cấp | `chang_thang` | Chặng tháng | ? |
| Rương tuần | `ruong_tuan` | Rương tuần | ? |
| Đạo cụ | `the_giu_ngoi · the_x2` | Thẻ Giữ Ngôi · Thẻ Nhân Đôi | ? |
| Mùa | `mua` | Mùa 1 2026–27 | ? |

**Nguyên tắc đặt tên:** không dùng từ riêng của game nào (lực chiến, chiến khu, Sổ Sứ Mệnh, Tinh Anh, Cao Thủ, Thách Đấu, Chiến Tướng…).

---

## 9. CẦN CEO CHỐT

| # | Câu hỏi | CTO đề xuất |
|---|---|---|
| **Q1** | **Theme / bộ tên** (m chọn "theme khác") — theme gì? | M nêu. Gợi ý hướng: linh vật riêng BK · vũ trụ/khám phá · học viện/phép thuật · thể thao. Chỉ cần thay bảng §8 |
| **Q2** | Mùa rank dài bao lâu? | Trùng **mùa Level sát hạch** |
| **Q3** | Trọng số Điểm Rank §3.1: đi học vs thi vs app có đúng ưu tiên chưa? | Như bảng. Đi học đều là xương sống, thi thử điểm to, app cộng không giới hạn |
| **Q4** | Ngân sách xu từ nhiệm vụ + thành tựu | Chốt sau khi soi giá quà `qlht_qua.gia_xu`. Tự có trần vì số nhiệm vụ cố định |
| **Q5** | BK có mấy **cơ sở**? | Nếu >1 thì thêm tầng danh hiệu theo cơ sở |
| **Q6** | Thưởng lớp thắng đua lớp | Vd cả lớp thêm 1 lượt game buổi / trà sữa tập thể tháng |
| **Q7** | Thứ tự build | **GĐ1** Điểm Rank + bậc + khoe trên TV (toàn dữ liệu có sẵn) → **GĐ2** Danh hiệu top dạng → **GĐ3** Thành tựu → **GĐ4** Nhiệm vụ → **GĐ5** Đua lớp + sự kiện |

---

## 10. Kiến trúc (khớp CLAUDE.md — để lập plan khi chốt)

- **Tính ở Postgres, client chỉ gọi RPC** (§2.0). Mọi thứ có `mon` (§1.6). Dispatch dạng → bảng kho qua registry.
- **Điểm Rank, Điểm Dạng, tiến độ thành tựu/nhiệm vụ = HÀM SUY ĐỘNG** từ bảng đo (§1.5, §4 — không row chờ, không bảng `tasks`):
  - `fn_diem_rank(hs, mon, mua)`
  - `fn_diem_dang(hs, mon, mua)`
  - `fn_hs_nhiem_vu_cua_toi(ngay)`
  - `fn_hs_thanh_tuu_cua_toi(mon)`
  - Trọng số §3.1 nằm **1 bảng cấu hình**, không rải trong hàm.
- **Chỉ ghi dòng khi có sự kiện thật** (append, không xoá):
  - `hs_thanh_tuu_dat` — hs, mon | NULL, key, bac, dat_at.
  - `hs_danh_hieu_tuan` — kết quả chốt tuần.
  - `hs_rank_ghe_ngay` — ghế đỉnh chốt 05:00.
  - `hs_rank_mua_ket` — bậc đỉnh cuối mùa.
  - `hs_nhiem_vu_nhan` — thưởng đã phát. Unique ⇒ idempotent. Điểm Rank thưởng cũng đọc từ đây.
  - `hs_dao_cu` — nhận + dùng thẻ, kiểu sổ cái.
  - `ten_goi_cau_hinh` — bảng tên §8.
- **Chốt ngày/tuần/mùa** bằng job DB (pg_cron): tính và ghi trong 1 transaction, giờ VN.
- **Catalog thành tựu:** mở rộng `thanh_tich_loai` (thêm `nguong int[4]`, `an`, `chung`) và migrate 12 key cũ. **Không đẻ catalog thứ 2.**
- **RPC cho HS:** `security definer` theo mẫu `fn_hs_vi_xu_cua_toi` + **`revoke execute … from anon`** (bài học 18/09).
- **Nguồn EXP mới** (`exp_nhiem_vu`, `exp_thanh_tuu`):
  - Sửa đủ 4 chỗ đọc viết cứng: `fn_gami_exp_xu_thang`, `fn_gami_exp_chi_tiet_thang`, `fn_hs_vi_xu_cua_toi`, `EXP_NOTE_SOURCES`.
  - Loại khỏi lệnh delete của `fn_recompute_exp_thang`.
- **Xu trực tiếp:** migration nới CHECK `qlht_xu_ledger.loai` và xử `nguoi_tao NOT NULL FK nhan_su`.

---

## 11. Nguồn (cơ chế game)

- **Honor of Kings:** [Hero Power](https://honor-of-kings.fandom.com/wiki/Hero_Power) · [Star Protection](https://honor-of-kings.fandom.com/wiki/Star_Protection)
- **LoL:**
  - [Apex tiers](https://support.riotgames.com/en-us/league-of-legends/gameplay/master-grandmaster-and-challenger-the-apex-tiers)
  - [Challenges FAQ](https://support.riotgames.com/en-us/league-of-legends/gameplay/challenges-faq-league-of-legends)
  - [Rank](https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends))
  - [Victorious](https://turbosmurfs.gg/article/victorious-skins-league-of-legends-rewards)
- **Free Fire:** [Rank](https://freefirehub.com/news/free-fire-rank-system-tiers-rp-season-reset) · [Quân đoàn](https://ff.garena.com/vn/article/1346/)
- **PUBG / Valorant / Hearthstone:**
  - [PUBG ranks](https://www.esports.net/wiki/guides/pubg-mobile-ranks/)
  - [Valorant](https://wecoach.gg/blog/article/valorant-ranks-in-order-distribution-rr-and-act-rank-guide)
  - [Hearthstone Ranked](https://hearthstone.wiki.gg/wiki/Ranked)
- **Supercell:**
  - [Clash Royale Card Mastery](https://clashroyale.fandom.com/wiki/Card_Mastery)
  - [Clash Royale Tournament](https://clashroyale.fandom.com/wiki/Tournament)
  - [CoC Clan Games](https://clashofclans.fandom.com/wiki/Clan_Games)
- **WoW / Genshin / Pokémon GO / Xbox:**
  - [Feats of Strength](https://wowpedia.fandom.com/wiki/Feats_of_Strength_achievements)
  - [Genshin Battle Pass](https://genshin-impact.fandom.com/wiki/Battle_Pass)
  - [Pokémon GO Medals](https://pokemongo.fandom.com/wiki/Medals)
  - [Xbox Achievement](https://xbox.fandom.com/wiki/Achievement)
