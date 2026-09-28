# Spec — THÀNH TỰU (Achievement) + NHIỆM VỤ NGÀY / TUẦN / THÁNG cho app Học sinh

> **Trạng thái: ĐỀ XUẤT (CTO, 28/09/2026) — CHỜ CEO CHỐT các mục ở §7.** Chưa code, chưa migration.
> Nguồn: 3 nhánh nghiên cứu song song (hiện trạng DB/code BK · ~20 hệ achievement game/app · ~20 hệ quest định kỳ) + lý thuyết động lực.
> **Đích:** HS mở app thấy **danh sách thành tựu + nhiệm vụ + phần thưởng**, biết rõ "còn bao nhiêu nữa", từ đó có lý do quay lại **làm bài thật** trên app.

---

## 0. Tóm tắt 1 trang

| | Thành tựu (Achievement) | Nhiệm vụ (Quest) |
|---|---|---|
| **Trả lời câu** | "Em đã trở thành ai?" (dài hạn, không mất) | "Hôm nay / tuần này em làm gì?" (ngắn hạn, reset) |
| **Cấu trúc** | 6 nhóm · ~26 thành tựu · phần lớn **4 bậc Đồng→Bạc→Vàng→Kim cương** + vài cái **ẩn** | **Ngày:** 3 nhiệm vụ + thanh 100 điểm · **Tuần:** 3 nhiệm vụ (dồn tới hết tháng) + rương tuần chọn 1 · **Tháng:** thẻ 20 tem + 1 thử thách cá nhân |
| **Phần thưởng chính** | Điểm Thành tựu (không tiêu, không giảm) · **danh hiệu** · **khung avatar** · EXP nhỏ ở bậc cao | EXP theo môn (nhiệm vụ học) · xu (mốc thói quen) · huy hiệu tháng |
| **Đo gì** | **Học thật**: dạng yếu→đạt, dạng giữ vững, sửa câu sai, phủ kín chuyên đề — không đo "đăng nhập / số câu trần" | Như bên trái; thời lượng kỳ vọng **10–20 phút/ngày**, tuần chỉ cần **3–4 ngày** |
| **Kỹ thuật** | Điều kiện **suy động** ở Postgres (`fn_*`); chỉ ghi 1 dòng khi **đạt thật** | Tiến độ **suy động** (không bảng `tasks`, không row chờ); chỉ ghi khi **nhận thưởng / reroll / chọn rương** |

Ba câu then chốt rút ra từ nghiên cứu (lý do cho mọi quyết định bên dưới):
1. **Thưởng đếm-số-lượng bị farm** — Khan Academy có hẳn wiki "Energy Point Grinding", Duolingo Leagues bị HS cày bài dễ. ⇒ BK đo trên ô **(HS × dạng)**, không đếm câu trần.
2. **Badge + bảng xếp hạng có thể làm GIẢM điểm thi** (Hanus & Fox 2015, 16 tuần) và thưởng vật chất báo trước làm giảm động lực tự thân (Deci-Koestner-Ryan 1999, 128 nghiên cứu). ⇒ Phần thưởng chủ đạo là **danh hiệu/cosmetic + thông tin tiến bộ**, xu/EXP chỉ vừa phải; không bảng xếp hạng toàn trường trong màn này.
3. **Streak ngày cứng gây áp lực và gãy là bỏ luôn** (Silverman & Barasch 2023); lỡ 1 ngày không ảnh hưởng hình thành thói quen (Lally 2010). ⇒ BK dùng **streak TUẦN** (≥3 ngày học/tuần) như Khan Academy, buổi học ở trung tâm tự tính là 1 ngày.

---

## 1. Hiện trạng BK (đã soi DB + code 28/09) — xây BÁM LÊN, không làm lại

| Có rồi | Ghi chú |
|---|---|
| **EXP** theo môn — `gami_exp_ledger` (source: `exp_et`, `exp_btvn`, `exp_btvn_thang`, `attend_floor`, `exp_tren_lop`) | Chốt tháng → **xu** (`fn_xu_tu_exp` = ceil(EXP/100)) vào `qlht_xu_ledger` |
| **Elo** theo môn · **Level** sát hạch (`ky_thi`/`diem_thi`, tối đa 21) | |
| **Xếp hạng buổi** (`buoi_giai`), **giải thưởng tháng** (`giai_thuong`: xuất sắc/tiến bộ/chăm chỉ), **game trong buổi** (Mở Rương, Chiếm Đất, trà sữa), **May mắn HS** | May mắn: EXP lưu riêng `may_man_hs_luot`, **không** vào sổ EXP |
| **Danh mục thành tích** `thanh_tich_loai` (key, ten, icon, nhom, kieu, nguon, per_mon, trong_so, thu_tu, active) — 12 key seed · bảng ghim `hoc_sinh_thanh_tich_ghim` (≤4) | **Chưa có sổ "HS đạt gì lúc nào"**. Phía staff tính được 6/12 key; `chuoi_di_hoc` tính ở client (vi phạm §2.0) |
| Màn HS `ThanhTuuHS.tsx` | Chỉ hiện giải thưởng tháng; mục Huy hiệu = "Sắp ra mắt" |
| 3 danh hiệu Mythwings (thunder/fire/frost) + `Student badge design.zip` (phượng hoàng) | Placeholder, chưa có điều kiện ⇒ **dùng làm art cho danh hiệu/khung ở §3.4** |

| CHƯA có | Hệ quả |
|---|---|
| Quest / nhiệm vụ, streak HS ở DB | Làm mới toàn bộ, theo engine pure-derive |
| **Tự luyện, Học từ đầu, bổ trợ KHÔNG sinh EXP** | Đây đúng là các việc muốn HS làm thêm ở nhà ⇒ nhiệm vụ là **lần đầu** thưởng cho chúng |

**Dữ liệu đủ để xét điều kiện** (không phải đẻ bảng đo mới): `bai_lam_cau` (verdict từng câu, cham_at) ⋈ `bai_lam` ⋈ `bai_test` (loai, **mon**) ⋈ `bai_test_cau` (**ma_dang**) · `fn_mastery_cells` · `buoi_hoc_hs.diem_danh` · `btvn_nop` / `btvn_ket_qua` · `bo_tro_yeu(_dang)` · `hoc_tu_dau_dang` · `ky_thi`/`diem_thi` · `buoi_giai` · `giai_thuong` · `bai_test_report` (trang_thai `dung`).

---

## 2. Nghiên cứu — rút gọn

### 2.1 Achievement: học được gì từ ai

| Hệ | Lấy | Tránh |
|---|---|---|
| **LoL Challenges** | 5 nhóm cân bằng nhiều kiểu người chơi · bậc thấp = ngưỡng tuyệt đối, bậc đỉnh = **top % (percentile)** · người chơi **tự chọn 3 token khoe** | Hàng trăm challenge → bị bỏ qua |
| **Liên Quân — thông thạo tướng D→S** | HS VN quen sẵn "thông thạo từng đối tượng" ⇒ map sang **thông thạo dạng** | Danh hiệu top 50 toàn server: 99,99% không chạm |
| **Pokémon GO medal** | 4 bậc Đồng/Bạc/Vàng/Bạch kim | Khoảng trống Vàng 200 → Bạch kim 2500 quá dài |
| **Genshin / HSR** | Sao trên icon báo trước số bậc · nhóm "Kỳ quan" **ẩn**, hài hước | Thưởng tiền gacha cho MỌI thành tựu ⇒ biến thành checklist |
| **WoW Feats of Strength** | Thành tựu sự kiện **0 điểm, ẩn nếu chưa có** ⇒ người vắng không thấy "thiếu" | Grind "giết 10.000" |
| **PlayStation Platinum / WoW meta** | **Meta-thành tựu** gom cả nhóm → danh hiệu kể chuyện | Săn cúp vô nghĩa |
| **Steam / Xbox / Roblox** | Độ hiếm **suy từ dữ liệu** ("N bạn đã đạt") · thành tựu hiếm có hiệu ứng mở khác | % nhiễu khi mẫu nhỏ ⇒ BK dùng số tuyệt đối |
| **Minecraft advancement** | Hình dạng khung = độ khó (trẻ đọc hình nhanh hơn chữ) · tab chỉ hiện khi đã có ≥1 | |
| **Duolingo** | **Kỷ lục cá nhân** (so với chính mình) · streak freeze **tăng** retention | Leagues ⇒ farm XP bài dễ, lo âu |
| **Khan Academy** | Ẩn dụ độ hiếm cho trẻ (thiên thạch → hố đen) · streak TUẦN gắn "lên thành thạo 1 kỹ năng" | Energy points bị farm |
| **Brawl Stars Mastery** | *Bài học thất bại:* bị gỡ 06/2025 vì chỉ **11,8%** người chơi từng đạt title, "không hiểu" ⇒ **HS lớp 6 phải hiểu 1 thành tựu trong 1 câu** | |
| **Prodigy** | | Gắn thưởng với trả tiền / membership — bị Fairplay tố |

### 2.2 Taxonomy (dùng làm khung cho BK)

**Theo hành vi:** ① Cột mốc · ② Tích luỹ · ③ **Kỹ năng/đo lường** · ④ Khám phá · ⑤ **Bao phủ/sưu tập** · ⑥ Hợp tác · ⑦ Sự kiện giới hạn · ⑧ Ẩn/bất ngờ · ⑨ Meta · ⑩ **Kỷ lục cá nhân** · ⑪ Thói quen · ⑫ Tiêu cực (**cấm dùng**).
**Theo cấu trúc:** 1 lần · nhiều bậc · cây · meta. **Theo hiển thị:** công khai có tiến độ · biết có nhưng "???" · ẩn hẳn. **Theo độ hiếm:** designer đặt (bậc) · suy từ dữ liệu (N bạn đạt).
**Theo nguồn đo (Lucas Blair, "The Cake Is Not a Lie"):** *measurement* (đo mức — tăng cảm giác "mình giỏi lên", tốt nhất) > *completion* (làm là có). Trong mô hình v2, **"ô (HS × dạng) yếu → đạt" chính là measurement achievement tự nhiên nhất.**

### 2.3 Quest định kỳ: các mô hình và cái BK chọn

| Mô hình | Ví dụ | BK dùng? |
|---|---|---|
| N nhiệm vụ cố định/ngày + bonus trọn bộ | Genshin 4, Duolingo 3 | ✅ Ngày: 3 nhiệm vụ |
| **Thanh điểm hoạt động** (làm gì cũng được, đủ điểm là xong) | Honkai Star Rail 500đ, Liên Quân "năng động" | ✅ **Xương sống** ngày — nhưng điểm tính theo **giá trị học**, không theo thời gian |
| Reroll 1/ngày | Hearthstone | ✅ Chỉ nhiệm vụ phụ; **không** reroll nhiệm vụ sửa sai/dạng yếu |
| Nhiệm vụ dồn được, không hết hạn | Fortnite weekly, PUBG weekly | ✅ Tuần sống tới **hết tháng**; ngày sống **48h** (PUBG 72h) |
| Thẻ tem không cần liên tiếp | Pokémon GO 7 tem | ✅ Tháng: 20 tem |
| **Rương tuần chọn 1** theo mức hoạt động | WoW Great Vault | ✅ Hoạt động nhiều = **thêm lựa chọn**, không nhân thưởng ⇒ không ép 7/7 |
| Mục tiêu cá nhân hoá theo lịch sử | Apple Fitness monthly | ✅ **có kẹp trần** (Apple bị chê leo thang vô hạn) |
| Nhiệm vụ nhóm | Duolingo Friends Quest | ✅ bản **cả LỚP** cộng dồn, không phạt cá nhân |
| Battle pass mùa | Fortnite, Free Fire | ⏸ **Chưa** — BK đã có EXP→xu tháng; thêm 1 track nữa = thêm 1 loại điểm rời (Hearthstone đã phải gộp) |

### 2.4 Nguyên tắc & anti-pattern (áp cho HS 11–15 tuổi)

**Làm:**
- **P1. Chỉ thưởng hành vi học thật.** Đơn vị = câu đúng ở dạng chưa đạt · câu sai đã sửa đúng · dạng lên đạt.
- **P2. Chống farm.** Dạng đã đạt chỉ tính 30% và có trần mỗi ngày. Câu đã làm đúng rồi, làm lại = 0.
- **P3. Công bằng giỏi/yếu.** Có kỷ lục cá nhân, có thành tựu "tiến bộ" tính theo độ tăng (delta), và mục tiêu tháng tương đối theo chính em. HS yếu **có bậc Đồng ngay tuần đầu** (hiệu ứng tiến độ được tặng sẵn — endowed progress: 34% so với 19% hoàn thành).
- **P4. Tên gọi nói VIỆC ĐÃ LÀM, không nói "thông minh".** "Sửa xong 50 câu sai", không phải "Thiên tài Toán" (Mueller & Dweck 1998: khen thông minh làm trẻ bỏ cuộc khi gặp khó).
- **P5. Autonomy.** Cho reroll 1 nhiệm vụ phụ, cho chọn ô trong rương tuần, cho chọn 3 thành tựu khoe.
- **P6. Có chỗ nghỉ.** Streak tính theo tuần, có freeze, có ngày nghỉ hợp lệ. **Không bao giờ phạt âm** (không trừ EXP/xu).
- **P7. Phản hồi thông tin quan trọng hơn con số.** Ví dụ: "Em vừa đưa dạng *Phân tích đa thức* từ yếu lên đạt", chứ không chỉ "+50 EXP".
- **P8. Symmetry 4 môn.** Cùng 1 bộ template, dispatch theo `mon` qua registry (§1.6).

**Cấm:**
- Nhiệm vụ "đăng nhập / mở app / xem video". Clash Royale đã bỏ, Khan Academy từ chối.
- Thành tựu tiêu cực ("vắng 5 buổi").
- Bảng xếp hạng toàn trường trong màn thành tựu.
- Mục tiêu leo thang không trần.
- Thưởng "hết hạn nếu chưa bấm nhận" ⇒ **luôn tự nhận**.
- Bán freeze/skip bằng tiền.
- Thưởng lợi thế học (xem đáp án, bỏ bài) ⇒ làm hỏng phép đo mastery.
- Ra mắt 200 thành tựu cùng lúc ⇒ **bắt đầu ~26**, đo tỉ lệ đạt rồi mới thêm.
- Nhắc sau 21:00, hoặc nhắc >1 lần/ngày.

---

## 3. ĐỀ XUẤT — HỆ THÀNH TỰU BK

### 3.1 Bậc & điểm

| Bậc | Hình khung | Điểm Thành tựu (ĐTT) | EXP thưởng (theo môn) | Tỉ lệ HS đạt mục tiêu* |
|---|---|---|---|---|
| 🥉 Đồng | tròn | 5 | — | 60–90% (đạt trong 1–2 tuần) |
| 🥈 Bạc | tròn viền kép | 10 | — | 30–60% |
| 🥇 Vàng | khiên | 20 | +100 | 10–30% |
| 💎 Kim cương | khiên có cánh (phượng hoàng Mythwings) | 40 | +300 | ≤5–10% |
| ✨ Ẩn / Kỷ niệm | ngôi sao | 0 (không tính tổng, như WoW Feats) | +50 (bất ngờ) | — |

\* Theo gợi ý Trophy.so/Xbox/PS. **Ngưỡng ở bảng §3.3 là ước lượng đầu; sau 4 tuần phải đo tỉ lệ đạt thật rồi chỉnh.** Thay ngưỡng thì chỉ áp cho lần đạt sau, bậc đã đạt không bị thu hồi.

- **ĐTT tổng** → **Hạng Thành tựu** (vòng màu quanh avatar), không bao giờ giảm. Là "danh tính" dài hạn, **không tiêu được**, tách khỏi xu.
- Xu/EXP chỉ cho bậc Vàng trở lên và cho thành tựu ẩn (bất ngờ: Lepper 1973 cho thấy thưởng bất ngờ **không** giết động lực). Bậc thấp thưởng bằng cảm giác (hiệu ứng mở khoá + ĐTT).

### 3.2 Sáu nhóm (tab)

| Nhóm | Ý nghĩa với HS | Loại (taxonomy) | Danh hiệu meta khi có ≥3 thành tựu Vàng trong nhóm |
|---|---|---|---|
| 🎯 **Chinh phục** | Em giỏi lên thật | Kỹ năng / đo lường | "Thợ Lấp Lỗ" |
| 🗺️ **Bản đồ** | Em phủ kín kiến thức | Bao phủ / khám phá | "Nhà Bản Đồ" |
| 🔥 **Bền bỉ** | Em học đều | Thói quen / tích luỹ | "Người Giữ Lửa" |
| 📈 **Vượt lên** | Em tiến bộ so với chính mình | Tiến bộ / thi | "Chiến Binh Vượt Khó" |
| 🏆 **Vinh danh** | Em được lớp/trung tâm ghi nhận | Kết quả có sẵn trong hệ | "Ngôi Sao Lớp" |
| ✨ **Bí ẩn & Kỷ niệm** | Bất ngờ, vui | Ẩn / sự kiện | — (không có bar tổng) |

**Meta tổng:** đủ 5 danh hiệu nhóm → khung avatar **Phượng Hoàng** (art Mythwings có sẵn).

### 3.3 Danh mục khởi đầu (26 thành tựu)

`[M]` = theo môn (mỗi môn HS học có 1 bản, §1.6) · `[C]` = chung (thói quen, không phải dữ liệu học của riêng môn nào — xem quyết định Q2).

**🎯 Chinh phục**

| key | Tên | Điều kiện (1 câu HS hiểu được) | Đồng / Bạc / Vàng / KC | Nguồn |
|---|---|---|---|---|
| `lap_lo` [M] | Lấp Lỗ | Đưa 1 dạng từ **yếu → đạt** | 1 / 5 / 15 / 40 | lịch sử `fn_mastery_cells` |
| `dang_dat` [M] | Kho Dạng | Số dạng **đang đạt** (≥3 câu & ≥75%, cùng định nghĩa `fn_hs_xep_hang_ti_le_dat`) — ghi mức cao nhất từng đạt | 5 / 20 / 50 / 100 | `fn_mastery_cells` |
| `vung_vang` [M] | Vững Vàng | Dạng vẫn đạt sau **≥3 lần đo cách nhau ≥7 ngày** (nhớ lâu, không học vẹt) | 1 / 5 / 20 / 50 | `bai_lam_cau` × `ma_dang` |
| `tron_diem` [M] | Trọn Điểm | Lượt tự luyện / bổ trợ đúng **10/10** | 1 / 5 / 20 / 50 | `bai_lam` loai tu_luyen/bo_tro |
| `chuoi_dung` [M] | Chuỗi Đúng | **Kỷ lục** câu đúng liên tiếp (so với chính mình) | 10 / 20 / 35 / 50 | `bai_lam_cau` theo `cham_at` |

**🗺️ Bản đồ**

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `tham_hiem` [M] | Nhà Thám Hiểm | Số dạng **khác nhau** đã làm ≥3 câu. Đây là thành tựu tham gia, giúp HS yếu có tiến độ (Abramovich 2013) | 10 / 30 / 60 / 120 | `bai_test_cau.ma_dang` |
| `phu_chuyen_de` [M] | Phủ Kín | Chuyên đề mà **mọi dạng đã được đo** và ≥80% dạng đạt | 1 / 3 / 8 / 15 | kho dạng qua registry môn + mastery |
| `hoc_tu_dau` [M] | Xây Nền | Hoàn thành dạng trong Học từ đầu (đọc lý thuyết + nộp test). *Tab chỉ hiện nếu em có case này* | 1 / 5 / 15 / 30 | `hoc_tu_dau_dang` |

**🔥 Bền bỉ**

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `giu_lua` [C] | Giữ Lửa | **Streak tuần học** (tuần có ≥3 ngày học, §4.4) | 2 / 4 / 8 / 16 tuần | view ngày học |
| `ngay_hoc` [C] | Ngày Học | Tổng số ngày học | 7 / 30 / 100 / 200 | view ngày học |
| `sua_sai` [M] | Sửa Sai | Câu sai, **trong 14 ngày** làm đúng lại câu cùng dạng | 10 / 50 / 150 / 400 | `bai_lam_cau` |
| `btvn_dung_han` [M] | Đúng Hẹn | Chuỗi BTVN nộp đúng hạn liên tiếp (thay key cũ `chuoi_btvn`) | 5 / 15 / 30 / 60 | `btvn_ket_qua.trang_thai_nop` |
| `chuyen_can` [M] | Chuyên Cần | Chuỗi buổi có mặt. Thay `chuoi_di_hoc`, **chuyển tính xuống DB** | 10 / 25 / 50 / 100 | `buoi_hoc_hs.diem_danh` |

**📈 Vượt lên**

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `vuot_kho` [M] | Vượt Khó | Ca bổ trợ yếu kết quả **đạt** | 1 / 3 / 8 / 15 | `bo_tro_yeu.ket_qua` |
| `but_pha` [M] | Bứt Phá | Tháng có tỉ lệ dạng đạt **tăng ≥10 điểm %** so tháng trước | 1 / 3 / 6 / 10 tháng | mastery snapshot tháng |
| `level` [M] | Leo Level | Level sát hạch trong mùa | 3 / 7 / 12 / 21 | `ky_thi` + `diem_thi` |
| `len_band` [M] | Vượt Band | Giữ key cũ `len_band` / `vuot_band` | 1 / 3 / 6 / 10 | `diem_thi.vuot_band` |
| `diem_cao` [M] | Điểm Cao | Bài sát hạch ≥9 (Kim cương = 10 tròn). Gộp `diem_9plus` / `diem_10` | 1 / 3 / 8 / (10đ ×3) | `diem_thi` |

**🏆 Vinh danh** (đọc từ kết quả **đã có**; cạnh tranh trong nhóm nhỏ = lớp)

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `nhat_buoi` [M] | Nhất Buổi | Được GV chốt Nhất trong xếp hạng buổi | 1 / 5 / 15 / 30 | `buoi_giai` giai=1 |
| `giai_thang` [M] | Giải Tháng | Nhận giải tháng (xuất sắc / **tiến bộ** / **chăm chỉ** — 2 loại sau HS yếu cũng với tới) | 1 / 3 / 6 / 10 | `giai_thuong` đã công bố |
| `top_et` [M] | Đỉnh ET | Giữ key cũ `top1_et` | 1 / 5 / 15 / 30 | `gami_elo_history` |

**✨ Bí ẩn & Kỷ niệm** (ẩn tới khi đạt · 1 lần · 0 ĐTT · +50 EXP bất ngờ)

| key | Tên hiện sau khi đạt | Điều kiện |
|---|---|---|
| `tham_tu` | Thám Tử Đề | Báo sai đề và được xác nhận `bai_test_report.trang_thai='dung'` |
| `kien_nhan` [M] | Kiên Nhẫn | 1 dạng làm ≥3 lượt mới đạt (từ sai đến đạt). Tôn vinh việc không bỏ cuộc |
| `tro_lai` [C] | Trở Lại | Nghỉ ≥3 tuần rồi có lại 1 tuần học trọn |
| `da_nang` [C] | Đa Năng | Có dạng lên đạt ở ≥2 môn trong cùng 1 tuần |
| `sk_<ma_su_kien>` | Kỷ niệm sự kiện (vd Trung thu 2026) | Tham gia sự kiện — vắng thì không thấy "thiếu" |

### 3.4 Phần thưởng hiển thị

- **Danh hiệu** (1 slot): hiện dưới tên, trên profile và **TV lớp**. Mở từ meta nhóm và từ bậc Kim cương.
- **Khung avatar** (1 slot): Hạng Thành tựu và Phượng Hoàng.
- **Showcase**: HS **tự chọn 3** thành tựu (dùng lại `hoc_sinh_thanh_tich_ghim`), cộng 1 ô tự động "hiếm nhất".

---

## 4. ĐỀ XUẤT — NHIỆM VỤ NGÀY / TUẦN / THÁNG

### 4.1 Điểm Học (ĐH) — đơn vị chung, **theo môn**, suy từ bảng đo

| Hành vi (chỉ tính câu MCQ / bài chấm được) | ĐH |
|---|---|
| Câu **đúng** ở dạng chưa-đo hoặc đang yếu | 10 |
| Câu đúng ở dạng đã đạt (trần 5 câu/ngày/môn — chống farm) | 3 |
| **Sửa sai**: câu sai trong 14 ngày gần nhất, nay làm đúng câu cùng dạng | 15 |
| Một dạng **lên đạt** | 60 |
| Nộp BTVN trên app | 30 |
| **Buổi học ở trung tâm**: có mặt, có ET | = đủ 100 ngày hôm đó (tặng sẵn) |

Câu đã làm đúng rồi mà làm lại = 0 ĐH. Không có ĐH cho thời gian online, đăng nhập hay xem lý thuyết.

### 4.2 NGÀY — "Việc hôm nay" (10–20 phút)

- **Thanh 100 ĐH**, 2 mốc: **50** → +2 xu · **100** → +1 **tem** tháng và **ngày đó là "ngày học"**. Mốc trả dần, không kiểu được ăn cả ngã về không.
- **3 nhiệm vụ gợi ý.** Làm xong nhiệm vụ nào thì điểm đổ vào thanh; không bắt buộc đúng 3 cái. Mỗi nhiệm vụ sống **48h**.
  1. **Sửa sai** — làm lại đúng 2 câu thuộc dạng em vừa sai (bản MCQ khác, cùng dạng). *Không reroll được.*
  2. **Ôn dạng** — 5 câu của 1 dạng **yếu hoặc đến hạn ôn** (dạng đạt nhưng đã ≥7–14 ngày chưa đo, theo spaced repetition), đúng ≥3. Được reroll 1 lần/ngày, **chỉ sang dạng yếu khác**.
  3. **Việc chính** — có BTVN chưa nộp thì là *nộp BTVN*; không có thì là *1 lượt tự luyện ≥7/10*.
- Mỗi nhiệm vụ xong: **+EXP theo môn** của nhiệm vụ (đề xuất 30–50 EXP). EXP này đổ vào sổ EXP ⇒ cuối tháng thành xu như EXP buổi học.
- Câu ra cho nhiệm vụ dùng **đúng** `_kho_dk_mcq_sql` (luật MCQ tuyệt đối của bổ trợ, 19–20/09). Dạng chưa có MCQ thì không vào nhiệm vụ; không nới luật.

### 4.3 TUẦN (Thứ Hai 00:00 VN → Chủ nhật)

- **Rương tuần** (kiểu WoW Great Vault):
  - **3 ngày học** mở ô 1, **4 ngày** mở ô 2, **6 ngày** mở ô 3.
  - HS **chọn 1** trong các ô đã mở, ví dụ: xu · EXP môn tuỳ chọn · khung/sticker · "được chọn ô trước" ở game Chiếm Đất buổi sau.
  - Học nhiều ngày hơn = **nhiều lựa chọn hơn**, không phải nhiều thưởng hơn. Vì vậy không ép học đủ 7/7.
- **3 nhiệm vụ tuần.** Chưa xong thì **dồn sang tuần sau, sống tới hết tháng**.
  1. **Lấp 1 lỗ** — 1 dạng yếu → đạt (theo môn). Đây là nhiệm vụ giá trị nhất.
  2. **Dọn sạch lỗi** — mọi dạng em sai trong tuần đều đã có lần làm đúng sau đó.
  3. **BTVN đủ** — nộp đủ BTVN các buổi trong tuần.
- **Nhiệm vụ LỚP** (GĐ3): cả lớp cộng dồn **N dạng lên đạt** trong tuần (N theo sĩ số). Đạt thì mỗi em +xu nhỏ và TV lớp hiện 🎉. **Không hiện ai góp ít.**
- **Streak tuần** (= thành tựu `giu_lua`): tuần có ≥3 ngày học.
  - Mỗi tháng tự nạp **1 freeze** (tối đa giữ 2).
  - **Earn back**: gãy streak mà tuần sau có ≥4 ngày học thì nối lại.
  - **Tuần nghỉ hợp lệ** (Tết, lịch nghỉ trung tâm, tuần thi học kỳ trường) **không tính**, không tốn freeze.

### 4.4 "Ngày học" (định nghĩa dùng chung cho tem / rương / streak)

Ngày (giờ VN) mà HS **đạt 100 ĐH cộng gộp mọi môn**. Buổi có mặt + có ET tự đủ. ⇒ HS học trung tâm 2 buổi/tuần chỉ cần **thêm 1 ngày tự học ở nhà** là giữ được streak. Đây là mục tiêu thấp có chủ ý, theo Fogg: làm việc dễ trước để thói quen hình thành.

### 4.5 THÁNG (trùng chu kỳ chốt xu `note='YYYY-MM'`)

- **Thẻ 20 tem**: mỗi ngày học = 1 tem. Tem **không cần liên tiếp**. **Tặng sẵn 2 tem** đầu tháng (endowed progress).
  - Đạt **8 / 14 / 20 tem** → **huy hiệu tháng** Đồng / Bạc / Vàng (vd "Tháng 10/2026 — Vàng").
  - Huy hiệu tháng là đồ sưu tập, hiện ở tab Kỷ niệm.
- **Thử thách cá nhân tháng**: "Lấp **K** dạng", với K = clamp(round(1,15 × số dạng em lấp được tháng trước), **2**, **6**).
  - Mục tiêu tương đối theo chính em, có trần (tránh lỗi leo thang vô hạn của Apple).
  - Đạt → +EXP lớn theo môn và 1 tem thưởng.
- **Hết tháng: làm lại từ đầu** — xoá "nợ", thẻ tem mới. Đưa vào bản tin PH (`TIN-PH-*`): số ngày học, dạng đã lên đạt, dạng còn yếu. **Không xếp hạng.**

### 4.6 Ngân sách phần thưởng (tỉ lệ, chốt số ở Q1)

Lấy **1 ngày học trọn = 1 đơn vị**:

| Mốc | Giá trị (đơn vị) |
|---|---|
| Rương tuần ô 1 / ô 2 / ô 3 | 2 / 3 / 4 |
| Huy hiệu tháng Bạc / Vàng | 8 / 12 |
| Thử thách tháng | 10 |

**Trần đề xuất:** tổng xu từ nhiệm vụ + thành tựu **≤ 25% xu HS kiếm từ buổi học** trong tháng. Buổi học ở trung tâm vẫn là nguồn chính, app là phần thêm.

---

## 5. Màn HS (phác)

- **Home**: thêm 1 ô **"Nhiệm vụ"** (kiểu 2, có badge số việc còn lại hôm nay). Ô **"Thành tựu"** có sẵn giờ mở ra màn mới.
- **Màn Nhiệm vụ** (card kiểu 1 — header màu + thân trắng):
  - Trên cùng: thanh ngày 0/100 với 2 mốc, 3 thẻ nhiệm vụ ngày có nút **"Làm ngay"** nhảy thẳng vào bài.
  - Giữa: dải 7 ô ngày trong tuần, rương tuần (ô sáng dần), 3 nhiệm vụ tuần.
  - Dưới: thẻ tem tháng, thử thách cá nhân.
- **Màn Thành tựu**:
  - Header: avatar + khung + danh hiệu + Hạng Thành tựu + 3 thành tựu khoe.
  - **"Sắp đạt"** 3–5 thẻ, sort theo *còn lại / tổng*, chữ **"còn 3 câu nữa"** thay cho "87%".
  - 6 tab nhóm. Mỗi thẻ có 3 trạng thái: *đã đạt* (màu, ngày đạt, "N bạn đã đạt") · *đang tiến* (thanh + "còn X", sao bậc trên icon) · *ẩn* ("???").
  - Mỗi thẻ có 1 dòng **"vì sao đáng"** và nút **"Luyện ngay"** nếu gắn với dạng.
  - Bộ lọc môn ở đầu (thành tựu `[M]`).
  - Tab Bí ẩn/Kỷ niệm không có thanh tổng.
- **Mở khoá**:
  - Bậc thường: toast nhỏ **sau khi nộp bài** (không cắt ngang lúc đang làm).
  - Vàng / Kim cương / ẩn: hiệu ứng lớn kèm âm thanh, cùng họ hiệu ứng trà sữa `bk-tra-sua.js`.
  - Nhiều cái cùng lúc thì gộp 1 thông báo.
- Style: **game** (Fredoka, mascot, gradient tươi — theo memory), không sci-fi.

---

## 6. Kiến trúc (khớp CLAUDE.md — để lập plan khi CEO chốt)

- **Không bảng `tasks`, không row chờ** (§4, §1.5). Tiến độ nhiệm vụ và điều kiện thành tựu là **hàm Postgres suy động**:
  - `fn_hs_nhiem_vu_cua_toi(p_ngay)`
  - `fn_hs_thanh_tuu_cua_toi(p_mon)` (mở rộng hàm cùng tên đang có)
  - view/hàm `ngày học`
- **Chỉ ghi dòng khi có sự kiện thật:**
  - `hs_thanh_tuu_dat` (hoc_sinh_id, **mon** hoặc NULL = "không áp dụng" cho [C], key, bac, dat_at) — **1 dòng/bậc đạt, không bao giờ xoá/thu hồi**. Mastery tụt sau đó thì bậc vẫn giữ.
  - `hs_nhiem_vu_nhan` (thưởng đã phát · unique theo hs+kỳ+nhiệm vụ ⇒ idempotent).
  - `hs_nhiem_vu_reroll`, `hs_ruong_tuan_chon`.
  - `ngay_nghi_hop_le` (OPS quản).
- **Ai ghi:** job DB (pg_cron / gọi sau `nộp bài`) quét điều kiện → ghi đạt + phát thưởng **trong cùng transaction**. Client chỉ gọi RPC đọc (§2.0). HS không đọc được sổ gốc do RLS ⇒ RPC `security definer` theo mẫu `fn_hs_vi_xu_cua_toi`. **Nhớ `revoke execute … from anon`** (bài học 18/09).
- **Catalog:** mở rộng `thanh_tich_loai` (thêm `nguong int[]`, `an bool`, `chung bool` thay ý `per_mon`, `mo_ta_vi_sao`), migrate 12 key cũ sang tên mới. Không đẻ catalog thứ 2.
- **Nguồn EXP mới** `exp_nhiem_vu`, `exp_thanh_tuu` (có `mon`, `note='YYYY-MM'`). Theo bài học HANDOFF, phải:
  - sửa **đủ 4 chỗ đọc** đang viết cứng: `fn_gami_exp_xu_thang`, `fn_gami_exp_chi_tiet_thang`, `fn_hs_vi_xu_cua_toi`, `EXP_NOTE_SOURCES`;
  - **loại khỏi lệnh delete** của `fn_recompute_exp_thang`.
- **Xu trực tiếp** (mốc thanh ngày, rương, huy hiệu tháng) → `qlht_xu_ledger` với `loai='nhiem_vu'`. **Cần migration nới CHECK** `loai` (§2.1 — đã dính 2 lần). `nguoi_tao` đang NOT NULL FK→`nhan_su` ⇒ cần 1 dòng nhân sự "hệ thống" hoặc nới cột. Xử lý lúc làm plan.

---

## 7. CẦN CEO CHỐT (R1: đây là *đích*, CTO không tự quyết)

| # | Câu hỏi | CTO đề xuất |
|---|---|---|
| **Q1** | Ngân sách: thành tựu + nhiệm vụ được chiếm bao nhiêu % xu HS kiếm/tháng? | **≤25%**, số cụ thể tính lại sau khi soi giá quà `qlht_qua.gia_xu` |
| **Q2** | "Ngày học", streak, tem tháng tính **chung mọi môn** hay **riêng từng môn**? | **Chung**: là thói quen, giống ví xu tổng. Còn thành tựu / nhiệm vụ đo năng lực vẫn **theo môn** |
| **Q3** | Hiện "**N bạn đã đạt**" và danh hiệu / showcase trên **TV lớp** không? | Có, **trong khối**, chỉ số tuyệt đối, không xếp hạng |
| **Q4** | Tự luyện / bổ trợ / Học từ đầu **lần đầu được thưởng EXP** (qua nhiệm vụ) — đồng ý? | Có. Đây là mục đích của cả hệ |
| **Q5** | Thứ tự làm | **GĐ1** Thành tựu (dữ liệu có sẵn, rủi ro thấp) → **GĐ2** Nhiệm vụ ngày/tuần + ngày học + streak → **GĐ3** tháng + nhiệm vụ lớp + TV |
| **Q6** | Phạm vi khối | Cấp 2 trước (6–9). Cấp 1/3 bật sau, cùng code |

---

## 8. Nguồn chính

- **Thiết kế achievement:** Lucas Blair — *The Cake Is Not a Lie* ([P1](https://www.gamedeveloper.com/design/the-cake-is-not-a-lie-how-to-design-effective-achievements), [best practices](https://www.gamedeveloper.com/design/feature-four-best-practices-for-achievement-design))
- **Game/app:**
  - [LoL Challenges](https://wiki.leagueoflegends.com/en-us/Challenges)
  - [Brawl Stars gỡ Mastery](https://supercell.com/en/games/brawlstars/blog/news/rip-masteries/)
  - [Minecraft Advancement](https://minecraft.wiki/w/Advancement)
  - [Khan badges](https://support.khanacademy.org/hc/en-us/articles/202487710-What-are-energy-points-badges-and-avatars)
  - [Khan streak tuần](https://blog.khanacademy.org/?p=17224)
  - [Duolingo streak](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/)
  - [Duolingo Friends Quest](https://blog.duolingo.com/friends-quests/)
  - [HSR Daily Training](https://www.icy-veins.com/honkai-star-rail/daily-training)
  - [WoW Great Vault](https://www.icy-veins.com/wow/great-vault-guide)
  - [Fortnite quest](https://gamerant.com/fortnite-daily-weekly-quest-reset-times/)
  - [Pokémon GO Breakthrough](https://www.nintendolife.com/guides/pokemon-go-field-research-and-research-breakthroughs-how-to-complete-them-and-all-rewards)
  - [Battle pass analysis](https://www.deconstructoroffun.com/blog/2022/6/4/battle-passes-analysis)
- **Bằng chứng:**
  - Hanus & Fox 2015 ([link](https://www.semanticscholar.org/paper/dff76a9862467d426113ec530f83942016ae3a97))
  - Deci-Koestner-Ryan 1999 ([PDF](https://www.selfdeterminationtheory.org/SDT/documents/2001_DeciKoestnerRyan.pdf))
  - Abramovich et al. 2013 ([PDF](https://www.lrdc.pitt.edu/SCHUNN/papers/Abramovich-Schunn-Higashi.pdf))
  - Mueller & Dweck 1998 ([PubMed](https://pubmed.ncbi.nlm.nih.gov/9686450/))
  - Hamari 2017 ([link](https://www.sciencedirect.com/science/article/abs/pii/S0747563215002265))
  - Silverman & Barasch 2023 ([link](https://academic.oup.com/jcr/article-abstract/49/6/1095/6623414))
  - Lally 2010 ([link](https://onlinelibrary.wiley.com/doi/abs/10.1002/ejsp.674))
  - Frommel & Mandryk 2022 "Daily Quests or Daily Pests?" ([ACM](https://dl.acm.org/doi/10.1145/3549489))
  - Kivetz 2006 goal-gradient ([link](https://journals.sagepub.com/doi/abs/10.1509/jmkr.43.1.39))
  - Rohrer 2020 interleaving RCT ([PDF](https://gwern.net/doc/psychology/spaced-repetition/2019-rohrer.pdf))
  - ICO Children's Code — nudge ([link](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/age-appropriate-design-a-code-of-practice-for-online-services/13-nudge-techniques/))
- **Lý thuyết đứng trên vai (R7):** Self-Determination Theory · Octalysis CD2 (Yu-kai Chou) · Bartle player types · Fogg B=MAP · Hook model (Nir Eyal) · goal-gradient / endowed progress · overjustification · spaced repetition & interleaving.
