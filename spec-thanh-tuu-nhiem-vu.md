# Spec — THÀNH TỰU · RANK · DANH HIỆU TOP · SỔ SỨ MỆNH (ngày/tuần/tháng) cho Học sinh — v2

> **Trạng thái: ĐỀ XUẤT v2 (CTO, 28/09/2026) — CHỜ CEO CHỐT §9.** Chưa code, chưa migration.
>
> **v2 thay v1 (cùng ngày).** v1 lấy app học online (Khan/Duolingo) và nghiên cứu giáo dục làm khung ⇒ né cạnh tranh, streak nhẹ. Thùy bác:
> *"Khan vẫn là online, BK là offline… bản chất game thì cày cuốc đua top."* v2 lấy **game** làm khung: Liên Quân · Honor of Kings ·
> LoL · Free Fire · PUBG · Clash Royale/Clash of Clans · Brawl Stars · Hearthstone · Valorant · WoW · Genshin · Pokémon GO. v1 còn trong git (`b52a4eb`).
>
> **Đích:** HS thấy danh sách **thành tựu, rank, danh hiệu top, nhiệm vụ và phần thưởng**, rồi lao vào **cày bài trên app** để leo và để **khoe trước cả lớp**.

---

## 0. Tóm tắt 1 trang — 3 trục như một game ranked

| Trục | Câu hỏi của HS | Mô phỏng từ | Nguồn điểm | Khoe ở đâu |
|---|---|---|---|---|
| ⚔️ **GIỎI — Rank mùa** (theo môn) | "Em đang ở rank gì môn Toán?" | Liên Quân / LoL ranked | **Elo trên lớp** — có sẵn, bài có giám sát | Khung avatar rank · TV lớp |
| 🔨 **CÀY — Lực dạng + Danh hiệu top** (theo dạng) | "Em là Top mấy dạng *Phân tích đa thức* khối 8?" | Liên Quân **lực chiến tướng + danh hiệu chiến khu** | Mọi lần làm bài (**app + lớp**), có trọng số độ khó | Danh hiệu dưới tên |
| 🏅 **SƯU TẬP — Thành tựu** (cày mốc) | "Em có bao nhiêu thành tựu Kim cương?" | LoL Challenges · Pokémon GO medal · WoW | Tích luỹ mọi hoạt động | 3 huy hiệu khoe · Điểm Thành tựu |

**Chất keo nối 3 trục = 📜 Sổ Sứ Mệnh** (mô phỏng Sổ Sứ Mệnh Liên Quân):
- **Ngày:** 4 nhiệm vụ, mỗi nhiệm vụ **sống 3 ngày**.
- **Tuần:** 4 nhiệm vụ, **chưa làm thì dồn sang tuần sau**. Làm đủ 10 nhiệm vụ/tuần thì mở **Rương Chăm Chỉ**.
- **Tháng = 1 mùa Sổ**, 30 cấp, cấp nào cũng có quà.
- Quà đổ về EXP/xu sẵn có, kèm **đạo cụ đua top** (Khiên giữ rank, Thẻ Gửi Ngày giữ danh hiệu).

**Thêm: ⚔️ Đua LỚP vs LỚP** (mô phỏng quân đoàn Free Fire / Clan Games): cùng khối, cùng môn. Điểm lớp tính **best-5 mỗi em**, có trần cá nhân, nên lớp thắng là lớp **đông người cày**.

**Vì sao chạy được ở BK (offline):** game phải tốn công dựng "màn loading" và "chiến khu" cho người chơi khoe. **BK có sẵn cả hai và thật hơn:**
- Có **TV trong lớp**, có Mở Rương/Chiếm Đất, có xếp hạng buổi.
- Có **bạn cùng lớp nhìn thấy nhau mỗi buổi**.

Danh hiệu "Top 1 dạng X khối 8" hiện trên TV trước cả lớp mạnh hơn mọi màn loading.

---

## 1. Hiện trạng BK (soi DB + code 28/09) — xây BÁM LÊN

| Có rồi | Dùng làm |
|---|---|
| **Elo theo môn** `gami_elo` / `gami_elo_history`. Cập nhật ở `fn_dong_phase` phase ET: Δ = clamp(30(A−E)/(N−1), ±20) **+10** | **Trục Rank.** Phần +10 mỗi buổi ⇒ Elo tăng theo cả *đi học đều* lẫn *làm tốt*. Đó đúng là "cày + giỏi" như LP |
| **EXP theo môn** `gami_exp_ledger` → chốt tháng ra **xu** `qlht_xu_ledger` | Nơi đổ thưởng của Sổ và Thành tựu |
| **Level sát hạch theo mùa** (`ky_thi.mua`, tối đa 21) | Mốc đặt **mùa rank** |
| Xếp hạng buổi `buoi_giai`, giải tháng `giai_thuong`, game buổi (Mở Rương, Chiếm Đất, trà sữa), May mắn HS | Nguồn thành tựu + chỗ **khoe trên TV** |
| Catalog `thanh_tich_loai` (12 key) + ghim `hoc_sinh_thanh_tich_ghim` (≤4) | Mở rộng làm catalog thành tựu. **Chưa có sổ "đạt lúc nào"** |
| Dữ liệu từng câu: `bai_lam_cau` ⋈ `bai_lam` ⋈ `bai_test` (loai, **mon**) ⋈ `bai_test_cau` (**ma_dang**) | Nguồn **Lực dạng** |
| 3 danh hiệu Mythwings placeholder + art phượng hoàng (`Student badge design.zip`) | Art khung/danh hiệu |

| CHƯA có | Hệ quả |
|---|---|
| Rank bậc, danh hiệu top, lực dạng, quest, streak | Làm mới |
| Tự luyện, Học từ đầu, bổ trợ **không sinh EXP** | Sổ Sứ Mệnh là lần đầu cho HS cày ở nhà mà có thưởng |
| `chuoi_di_hoc` đang tính ở client (nợ §2.0) | Chuyển xuống DB khi làm thành tựu Chuyên cần |

---

## 2. Nghiên cứu game — 9 cơ chế (rút gọn, nguồn §10)

1. **Danh hiệu top theo đối tượng + khu vực** (Liên Quân / HoK)
   - Mỗi **tướng** có "lực chiến" riêng. Danh hiệu có 4 cấp: top 100 tỉnh → top 100 miền → top 100 quốc gia → **Vô Địch top 10** (chốt theo tháng).
   - Tổng kết **00:00 thứ Hai**, danh hiệu sống 1 tuần. HoK thêm **điểm sàn** (1000/2000/3000) và **danh hiệu phân vị** (Top 20% / 10% / 5% / 1%).
   - Điểm lực chiến **dễ tăng ở thấp, khó ở cao**: vài trăm điểm/trận ở dưới, còn ~1 điểm/2 trận ở đỉnh. Có **bù sau chuỗi thua**.
   - **Không chơi tướng 7 ngày ⇒ bị trừ.** Garena từng xoá điểm "treo" vì người giữ top cả năm làm người mới nản.
   - ⇒ *Mỗi tướng là 1 đường đua. Người không leo nổi rank chung vẫn làm "Top 1 Nakroth tỉnh" được.*
2. **Rank mùa**
   - Liên Quân: Đồng → … → Cao Thủ trở lên cộng dồn sao. **Thách Đấu = top 50 ghế**, chốt 05:00 mỗi ngày. Mùa ~3 tháng. **Thưởng theo rank CAO NHẤT trong mùa.** Reset mềm: bậc thấp giữ nguyên, bậc cao tụt 1–2 bậc.
   - LoL: số ghế Challenger/GM có hạn. Muốn có ghế phải **vừa đủ điểm sàn VỪA hơn người thấp nhất đang ngồi**. Có **decay** khi không chơi. **Khiên 10 trận** khi vừa lên bậc. **Định vị** 5 trận chỉ cộng không trừ.
   - Hearthstone: **sàn mỗi 5 bậc** (qua rồi thì trong mùa không tụt dưới). **Hệ số sao ×N đầu mùa** theo rank mùa trước, để người giỏi về lại chỗ cũ nhanh.
   - LoL 2025: **skin Victorious cho ai thắng 15 trận**, bất kể rank; chroma màu theo rank đỉnh. ⇒ *Ai cũng có quà mùa, người giỏi có màu hiếm.*
3. **Bảng xếp hạng nhiều tầng** — theo địa lý, theo tướng, theo chế độ chơi, theo phân vị; và theo nhịp **tuần / tháng / mùa / trọn đời** chạy song song.
   - ⇒ *Ai cũng có ít nhất 1 tầng mà top nằm trong tầm với.*
4. **Thành tựu cày**
   - Ngưỡng **cấp số nhân**: Pokémon GO 10/50/200/2.500. Bậc 1 có ngay tuần đầu, bậc cuối là cày nhiều năm.
   - LoL Challenges: bậc Iron→Master là **ngưỡng cố định**, bậc Grandmaster/Challenger là **phân vị** trong số người đã đạt Master. **Crystal** = tổng điểm mọi thử thách, thành một "rank cày" riêng.
   - WoW Feats / LoL Legacy: thành tựu **hết mùa là khoá vĩnh viễn**, không tính vào tổng điểm.
   - Xbox: **% người đạt**; dưới 10% là "rare", mở khoá có âm thanh riêng.
5. **Khoe** — LoL cho người chơi **tự chọn 3 token + 1 danh hiệu**, hiện trên màn loading cho cả 10 người thấy. Liên Quân cho chọn danh hiệu hiển thị, có **viền avatar và hiệu ứng loading theo rank mùa**.
   - ⇒ *Động lực đến từ chỗ người khác nhìn thấy. Người trình thấp chọn khoe thứ mình mạnh nhất.*
6. **Nhiệm vụ trong game ranked**
   - Liên Quân **Sổ Sứ Mệnh**: 60 cấp; nhiệm vụ ngày **sống 3 ngày**; 4 nhiệm vụ tuần **dồn được**; **đủ 10 nhiệm vụ/tuần ⇒ rương chăm chỉ**; mùa ~1 tháng.
   - HoK **Bravery Points**: thắng chuỗi tích điểm, điểm tự dùng để bảo vệ sao.
   - Genshin: **trần EXP 10.000/tuần**.
   - ⇒ *Đạo cụ hỗ trợ đua top **không cộng thẳng điểm rank**, chỉ giảm rủi ro (khiên) hoặc tăng tốc về chỗ cũ, nên bảng không méo.*
7. **Sự kiện ngắn** — thể thức "**12 thắng trước 3 thua**" (Clash Royale) và "**15 thắng trước 4 thua**" (Brawl). Clash of Clans Legend League **8 lượt/ngày**.
   - ⇒ *Ai cũng có cùng số lượt, thắng nhờ chất lượng.*
8. **Đua tập thể**
   - Free Fire quân đoàn: **chỉ 5 trận điểm cao nhất mỗi người** được tính.
   - Clash of Clans Clan Games: mốc tập thể, **trần điểm cá nhân**, **ai làm ≥1 việc cũng nhận quà**.
   - Clan War Leagues: nhóm 8 clan, **top 2 lên hạng, đáy 2 xuống; league thấp nhất không xuống**.
9. **Chống cày ảo**
   - Điểm theo **sức đối thủ** (Elo/MMR); lợi ích giảm dần.
   - Trần ngày/tuần (best-5, 8 lượt/ngày, 10k/tuần).
   - Decay khi bỏ chơi; ghế top cần 2 điều kiện.
   - Liên Quân chống buff bẩn: đấu **đơn, ẩn danh**; **quan chiến** người top; cấm, xoá hạng; **uy tín dưới 85 cấm rank**.

**Không chép từ game (lưu ý kỹ thuật):**
- Mọi kiểu **trả tiền thật** để lấy điểm, khiên, x2 hay lượt rương.
- **"N người đầu tiên đạt"**: WoW đã gỡ Realm First vì nó thưởng cho người thức khuya nhất.
- **Hiện đáy bảng** lên TV.
- **Decay trừ vào năng lực thật** (Elo, mastery). Decay chỉ được đụng vào *danh hiệu*.

---

## 3. ⚔️ RANK MÙA theo môn (trục GIỎI)

- **Điểm = Elo môn hiện có**, không thêm điểm mới. Elo chỉ đổi ở **bài ET trên lớp**: làm cá nhân, có giám sát, đúng vai "Đấu Đỉnh Cao đơn" của Liên Quân. ⇒ **App KHÔNG cộng thẳng vào rank.** Cày app thì lên **Lực dạng** (§4), rồi nhờ giỏi lên mà thắng ET ⇒ rank tăng.
- **Bậc** (tên quen với HS, chốt ở Q3):

  | Bậc | Chia đoàn | Điều kiện |
  |---|---|---|
  | Đồng · Bạc · Vàng · Bạch Kim · Kim Cương | IV → I | Ngưỡng Elo cố định |
  | Tinh Anh · Cao Thủ | cộng dồn sao | Ngưỡng Elo |
  | **Thách Đấu** | **ghế có hạn** | **Top N Elo môn trong khối** (N = max(1, 5% HS khối có Elo)) **và** Elo ≥ sàn Cao Thủ. Chốt 05:00 hằng ngày |

  Ngưỡng Elo từng bậc **đặt từ phân bố Elo thật lúc build**. Mục tiêu ban đầu: ~25% Đồng, 25% Bạc, 20% Vàng, 13% Bạch Kim, 8% Kim Cương, 5% Tinh Anh, 3% Cao Thủ, rồi đóng băng cả mùa.
- **Mùa rank = mùa Level sát hạch** (`ky_thi.mua`), để rank, Level và thưởng mùa cùng một nhịp.
- **Chống nản** (mô phỏng game):
  - **Rank hiển thị không tụt dưới sàn**. Có 2 sàn: Vàng và Kim Cương (kiểu Hearthstone). Elo thật vẫn ghi đúng (§2.0).
  - **Khiên 2 buổi** khi vừa lên bậc mới (kiểu LoL).
  - HS mới có **3 buổi định vị**: chỉ cộng, không trừ ở phần hiển thị.
  - Khiên kiếm thêm từ Sổ Sứ Mệnh (§6).
- **Cuối mùa:**
  - **Thưởng theo rank CAO NHẤT trong mùa**: khung avatar mang **tên mùa** ("Kim Cương Toán · Mùa 1 2026–27"), từ Cao Thủ trở lên thêm danh hiệu. Hết mùa thì không ai lấy được nữa ⇒ **đồ hiếm vĩnh viễn**.
  - **Quà cơ bản cho mọi em** đi đủ K buổi trong mùa (kiểu Victorious 15 trận). Rank chỉ đổi **màu** của quà.
  - **Reset mềm**: Đồng/Bạc giữ nguyên, bậc giữa tụt 1 bậc, Kim Cương trở lên tụt 2. Đầu mùa được **hệ số ×1,5 điểm hiển thị** cho tới khi về lại bậc cũ (kiểu Brawl/Hearthstone).
  - Reset chỉ áp cho **thang hiển thị**; Elo gốc không bị đụng. Cách ánh xạ Elo → thang hiển thị chốt khi làm plan.

---

## 4. 🔨 LỰC DẠNG + DANH HIỆU TOP (trục CÀY) — "lực chiến tướng" của BK

**Dạng = tướng.** Mỗi (HS × dạng × môn) có 1 **Lực dạng**. Đây là chỗ HS cày trên app.

### 4.1 Công thức (mô phỏng lực chiến Liên Quân + MMR)

- **Mỗi câu đúng** cộng điểm = `nền × hệ số độ khó câu × hệ số lợi ích giảm dần`.
  - **Độ khó câu** = "sức đối thủ" (như MMR). Tính ở DB từ tỉ lệ đúng lịch sử của câu, hoặc Elo câu khi đủ dữ liệu. Câu khó ×2, câu dễ ×0,5.
  - **Lợi ích giảm dần** theo Lực hiện tại: lực thấp tăng nhanh, lực cao tăng chậm (như lực chiến 4.000 và 7.500).
  - **Câu em đã làm đúng trước đó = 0 điểm.** Không cày lại câu cũ được.
- **Câu sai** trừ nhẹ (thua trận), riêng câu ở dạng em đang mới học (< 5 câu) thì không trừ (vùng định vị).
- **Bài trên lớp** (ET, BTVN chấm) tính **hệ số ×2**, vì có giám sát. Bài app tính ×1.
- **Trần ngày:** mỗi dạng chỉ **10 câu tốt nhất/ngày** được tính (mô phỏng best-5 / 8 lượt của game) ⇒ thắng nhờ chất lượng + đều đặn, không nhờ ngồi 5 tiếng.
- **Khoá giờ:** câu làm sau **22:00** vẫn chấm, vẫn tính mastery, nhưng **không cộng Lực dạng** (không đua thức khuya).
- Chỉ lấy câu thuộc **kho chuẩn MCQ** (`_kho_dk_mcq_sql`) cho phần app, cùng luật với bổ trợ.
- **Lực dạng ≠ mastery.** Mastery (§5 CLAUDE.md) vẫn suy động từ đo thật, **không bị decay, không bị trần**. Lực dạng là **điểm đua** riêng.

### 4.2 Danh hiệu top — tầng + chu kỳ (mô phỏng chiến khu Liên Quân / HoK)

Phạm vi: **khối × môn**. Dạng gắn theo chương của khối, nên đua trong khối là đúng "chiến khu". Nếu có nhiều cơ sở thì thêm tầng cơ sở (Q5).

| Danh hiệu | Điều kiện | Chu kỳ |
|---|---|---|
| **Tinh anh dạng X** | Top **20%** HS khối có đo dạng X, và Lực ≥ sàn | Chốt 00:00 thứ Hai, sống 1 tuần |
| **Cao thủ dạng X** | Top **5%**, và Lực ≥ sàn cao | Tuần |
| **Top 3 dạng X khối 8** | Hạng 1–3, và Lực ≥ sàn | Tuần |
| **👑 Đệ nhất dạng X khối 8** | Hạng 1 | Tuần |
| **👑 Vô Địch Toán khối 8** | Tổng Lực mọi dạng môn cao nhất khối | **Tháng** (trao cùng giải tháng) |

- **Có sàn** vì lớp/khối nhỏ: dạng chỉ 3 em làm thì "Top 1" không được tính nếu dưới sàn.
- Phân vị chỉ tính trên HS **đã có đo** dạng đó (§5: chưa đo ≠ yếu).
- **Giữ ngôi:** dạng không được luyện **14 ngày** thì Lực dạng *đua* giảm dần (mô phỏng Liên Quân trừ sau 7 ngày, LoL decay).
  - Có **Thẻ Gửi Ngày** (từ Sổ) để hoãn decay khi ốm/nghỉ, tối đa 14 ngày như LoL bank.
  - Tuần nghỉ chung của trung tâm (Tết, lịch nghỉ) thì dừng decay toàn bộ.
- Một HS có thể giữ **nhiều danh hiệu** (nhiều dạng) nhưng chỉ **chọn 1 để hiện** dưới tên (§5.3).
- **Mất ngôi có thông báo** ("Bạn Minh vừa vượt em ở dạng X — còn 12 điểm để lấy lại"). Đây là cú kéo quay lại mạnh nhất của game.

---

## 5. 🏅 THÀNH TỰU (trục SƯU TẬP) — mô phỏng LoL Challenges + Pokémon GO medal

### 5.1 Bậc

| Bậc | Ngưỡng | ĐTT (Điểm Thành tựu) | Thưởng |
|---|---|---|---|
| 🥉 Đồng | Cố định — đạt trong 1–2 buổi | 5 | — |
| 🥈 Bạc | Cố định, ×4–5 | 10 | +50 EXP |
| 🥇 Vàng | Cố định, ×4–5 | 25 | +150 EXP |
| 💎 Kim Cương | Cố định, ×4–10 (cày cả năm) | 50 | +400 EXP + khung nhỏ |
| 🔥 **Huyền Thoại** | **Top 5% khối** trong số người đã có Kim Cương (phân vị, tính lại hằng ngày) | 100 | Danh hiệu + hiệu ứng mở khoá riêng |

- **Tổng ĐTT ⇒ "Rank Thành tựu"** (như Crystal của LoL): một thang **cày thuần** song song với rank Elo. HS chưa giỏi vẫn leo được bằng cày.
- Mỗi thẻ đã đạt hiện **"N bạn trong khối đã đạt"**. Dưới 10% khối thì gắn nhãn **Hiếm** (kiểu Xbox rare).

### 5.2 Danh mục khởi đầu (28 thành tựu, 6 nhóm)

`[M]` = theo môn · `[C]` = chung.

**⚔️ Chiến trường** (trên lớp — nơi có giám sát, đối thủ là bạn cùng lớp)

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `nhat_buoi` [M] | Nhất Buổi | Được GV chốt Nhất xếp hạng buổi | 1 / 5 / 20 / 60 | `buoi_giai` |
| `len_bang` [M] | Lên Bảng | Vào Nhất/Nhì/Giải 3 buổi | 3 / 15 / 50 / 150 | `buoi_giai` + có mặt |
| `top_et` [M] | Đỉnh ET | Hạng 1 ET buổi (key cũ `top1_et`) | 1 / 5 / 20 / 60 | `gami_elo_history.rank` |
| `chuoi_thang` [M] | Chuỗi Thắng | Kỷ lục số buổi liên tiếp Elo tăng | 3 / 5 / 8 / 12 | `gami_elo_history.delta` |
| `ha_manh` [M] | Hạ Kẻ Mạnh | Buổi em xếp trên bạn có Elo cao hơn em ≥100 | 1 / 10 / 40 / 120 | `gami_elo_history` |

**🔨 Cày cuốc** (app + lớp — số lượng có trọng số)

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `cau_dung` [M] | Ngàn Câu | Câu đúng **có tính Lực** (sau trần/khoá giờ, không tính câu cũ) | 50 / 250 / 1.000 / 5.000 | Lực dạng |
| `tron_diem` [M] | Trọn Điểm | Lượt tự luyện/bổ trợ 10/10 | 1 / 10 / 50 / 200 | `bai_lam` |
| `chuoi_dung` [M] | Combo | Kỷ lục câu đúng liên tiếp | 10 / 25 / 50 / 100 | `bai_lam_cau` |
| `sua_sai` [M] | Phục Thù | Câu sai, trong 14 ngày làm đúng lại câu cùng dạng | 10 / 50 / 200 / 800 | `bai_lam_cau` |
| `luc_tong` [M] | Lực Chiến | Tổng Lực dạng của môn | mốc theo phân bố thật | Lực dạng |

**👑 Chinh phục** (dạng = tướng)

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `dang_dat` [M] | Kho Tướng | Số dạng **đạt** (mastery) | 5 / 20 / 60 / 150 | `fn_mastery_cells` |
| `lap_lo` [M] | Lật Kèo | Dạng từ **yếu → đạt** | 1 / 5 / 20 / 50 | lịch sử mastery |
| `phu_chuyen_de` [M] | Bình Định | Chuyên đề mà mọi dạng đã đo và ≥80% dạng đạt | 1 / 3 / 8 / 15 | kho + mastery |
| `danh_hieu_top` [M] | Bá Chủ | Số tuần giữ **bất kỳ** danh hiệu Top 3 / Đệ nhất dạng | 1 / 5 / 20 / 50 | sổ danh hiệu |
| `de_nhat` [M] | Đệ Nhất | Số **dạng khác nhau** từng giữ ngôi Đệ nhất | 1 / 3 / 10 / 25 | sổ danh hiệu |

**🔥 Chuyên cần**

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `chuyen_can` [M] | Chuyên Cần | Chuỗi buổi có mặt (thay `chuoi_di_hoc`, chuyển xuống DB) | 10 / 25 / 60 / 120 | `buoi_hoc_hs` |
| `btvn_dung_han` [M] | Đúng Hẹn | Chuỗi BTVN nộp đúng hạn (thay `chuoi_btvn`) | 5 / 15 / 40 / 100 | `btvn_ket_qua` |
| `so_su_menh` [C] | Sứ Giả | Số tuần mở được Rương Chăm Chỉ | 1 / 4 / 12 / 30 | sổ nhiệm vụ |
| `giu_lua` [C] | Giữ Lửa | Chuỗi tuần mở Rương Chăm Chỉ liên tiếp | 2 / 4 / 8 / 16 | sổ nhiệm vụ |

**🏆 Đỉnh cao** (theo mùa / kết quả lớn)

| key | Tên | Điều kiện | Đ / B / V / KC | Nguồn |
|---|---|---|---|---|
| `rank_dinh` [M] | Leo Rank | Rank cao nhất từng đạt: Vàng / Bạch Kim / Kim Cương / Cao Thủ | 1 bậc mỗi mốc | rank mùa |
| `thach_dau` [M] | Thách Đấu | Số ngày giữ ghế Thách Đấu | 1 / 7 / 30 / 90 | rank mùa |
| `level` [M] | Leo Level | Level sát hạch trong mùa | 3 / 7 / 12 / 21 | `ky_thi` / `diem_thi` |
| `diem_cao` [M] | Điểm Cao | Sát hạch ≥9 (Kim Cương = 10 tròn ×3) | 1 / 3 / 8 / ×3 | `diem_thi` |
| `giai_thang` [M] | Giải Tháng | Nhận giải tháng (xuất sắc / tiến bộ / chăm chỉ) | 1 / 3 / 6 / 10 | `giai_thuong` |
| `vo_dich` [M] | Vô Địch | Số tháng giữ Vô Địch môn khối | 1 / 2 / 4 / 8 | sổ danh hiệu |

**✨ Bí ẩn & Kỷ niệm** (ẩn tới khi đạt; kỷ niệm mùa **khoá vĩnh viễn** khi hết mùa; không tính ĐTT — kiểu WoW Feats / LoL Legacy)

| key | Tên | Điều kiện |
|---|---|---|
| `lat_keo_lon` [M] | Lội Ngược Dòng | Từ nửa dưới lớp lên Nhất buổi trong vòng 4 buổi |
| `tham_tu` | Thám Tử Đề | Báo sai đề được xác nhận (`bai_test_report.trang_thai='dung'`) |
| `tra_sua` | Thần May Mắn | Trúng 🧋 trà sữa ở game buổi (`buoi_game_qua`) |
| `mua_<ma>` | Chiến Binh Mùa X | Tham gia mùa rank X (quà cơ bản mùa) |
| `sk_<ma>` | Kỷ niệm sự kiện | Vd Trung thu 2026 |

### 5.3 Khoe — "màn loading" của BK

- Mỗi HS **tự chọn 1 danh hiệu** (danh hiệu top, danh hiệu rank mùa, danh hiệu thành tựu Huyền Thoại) **và 3 huy hiệu** (dùng lại `hoc_sinh_thanh_tich_ghim`).
- Khung avatar = **rank mùa cao nhất đang có**.
- **Hiện ở:**
  - TV khi công bố **xếp hạng buổi** và trong **Mở Rương / Chiếm Đất** (thẻ tên HS).
  - Màn thành tích chiếu TV (`ThanhTichScreen`).
  - Header app HS.
- **TV chỉ hiện top và người được xướng tên**; **không hiện đáy bảng**. Hạng thấp chỉ em đó thấy trong app của mình.

---

## 6. 📜 SỔ SỨ MỆNH — nhiệm vụ ngày / tuần / tháng (mô phỏng Sổ Sứ Mệnh Liên Quân)

### 6.1 Cấu trúc

| Tầng | Nội dung | Sống | Điểm Sổ (ĐS) |
|---|---|---|---|
| **Ngày** | 4 nhiệm vụ (bảng dưới) | **3 ngày** (lỡ 1–2 ngày không mất) | 10 / nhiệm vụ |
| **Tuần** | 4 nhiệm vụ tuần | **Dồn tới hết tháng** | 30 / nhiệm vụ |
| **Rương Chăm Chỉ** | Hoàn thành **đủ 10 nhiệm vụ trong tuần** (ngày + tuần gộp) | Thứ Hai → CN | +50 ĐS + rương |
| **Mùa Sổ = 1 tháng** | **30 cấp × 50 ĐS**, reset đầu tháng, trùng kỳ chốt xu | Tháng | — |
| **Trần** | Tối đa **400 ĐS/tuần** (mô phỏng trần 10k/tuần của Genshin) — chống cày một lèo | | |

**Nhiệm vụ ngày** (sinh theo HS, luôn có nhãn `mon`):
1. **Luyện công** — 1 lượt tự luyện đúng ≥7/10.
2. **Phục thù** — làm đúng lại 2 câu thuộc dạng em vừa sai.
3. **Giữ ngôi / Lên ngôi** — +X Lực ở 1 dạng em đang có danh hiệu, hoặc đang cách top 3 gần nhất. Hệ **tự chọn dạng "sắp lên top"** cho em.
4. **Lên lớp** — có mặt buổi học hôm đó và có bài ET (**tự hoàn thành** khi điểm danh ⇒ ngày đi học là ngày dễ nhất).

**Nhiệm vụ tuần:**
- (a) Nộp đủ BTVN các buổi trong tuần.
- (b) Lật kèo 1 dạng yếu → đạt.
- (c) Lọt Top 3 bất kỳ dạng nào (khối).
- (d) Lên bảng (Nhất/Nhì/Giải 3) 1 buổi.

Đổi 1 nhiệm vụ ngày/ngày (reroll) cho nhiệm vụ 1 và 3; nhiệm vụ Phục thù không đổi được.

### 6.2 Quà theo cấp Sổ (30 cấp/tháng — miễn phí, không có bản trả tiền)

| Cấp | Quà |
|---|---|
| Cấp thường | EXP theo môn (đổ `gami_exp_ledger`, chốt tháng ra xu) |
| Mỗi 5 cấp | Xu trực tiếp |
| Cấp 10 / 20 | **🛡️ Khiên rank** (chặn tụt bậc hiển thị sau 1 buổi ET kém) · **📅 Thẻ Gửi Ngày** (hoãn decay danh hiệu 7 ngày) |
| Cấp 25 | Sticker / khung cảm xúc dùng trên TV |
| **Cấp 30** | **Khung tháng** mang tên tháng (đồ sưu tập, không mua lại được) + 1 lượt "chọn ô trước" Chiếm Đất |

**Rương Chăm Chỉ tuần** gồm ĐS + xu + tỉ lệ nhỏ ra Khiên/Thẻ Gửi Ngày. Tỉ lệ **công khai** như `game_lop_thuong`.

**Đạo cụ chỉ giảm rủi ro, KHÔNG cộng điểm rank hay Lực dạng** (theo mẫu game ở §2.6) ⇒ bảng top không méo. Không có x2 điểm đua.

### 6.3 Sự kiện cuối tuần (tuỳ chọn, GĐ4)

**"Thử thách dạng X":** đúng **10 câu trước khi sai 3** (thể thức Clash Royale). Quà theo số câu đúng đạt được. Bảng top sự kiện theo khối. Ai cũng có cùng số lượt.

---

## 7. ⚔️ ĐUA LỚP vs LỚP (mô phỏng quân đoàn Free Fire + Clan War Leagues)

- **Nhóm đua:** các lớp **cùng khối, cùng môn**.
- **Điểm lớp tuần** = Σ over HS của **best-5 lượt** (Lực dạng tăng) mỗi em, **chia sĩ số**.
  - Có **trần cá nhân** ⇒ 1–2 em giỏi không gánh nổi cả lớp; lớp thắng là lớp **đông người cày**.
- **Mốc tập thể** (kiểu Clan Games): lớp đạt mốc 1/2/3 thì **mọi em có ≥1 đóng góp** đều nhận quà.
- **Bảng tháng:** lớp Nhất khối/môn được vinh danh trên TV mọi lớp, kèm thưởng lớp (chốt Q6).
- Trên TV hiện **thanh đóng góp theo lớp**. **Không hiện em nào góp 0.**

---

## 8. Kinh tế phần thưởng + luật chống cày ảo

**Kinh tế:**
- Mọi thứ quy về **EXP (theo môn) → xu** sẵn có, và **đồ sưu tập không mua được** (khung mùa, khung tháng, danh hiệu).
- Đề xuất trần: thưởng từ Sổ + Thành tựu ≈ **30–40% xu tháng** của 1 HS chăm (chốt Q4 sau khi soi giá quà).

**Chống cày ảo — giải bằng cơ chế game:**

| Rủi ro | Luật |
|---|---|
| Cày câu dễ | Điểm theo **độ khó câu**; câu đã đúng = 0; lợi ích giảm dần |
| Ngồi 5 tiếng spam | **Best-10 câu/dạng/ngày**, trần 400 ĐS/tuần |
| Thức khuya đua top | Sau **22:00** không cộng Lực/ĐS |
| Người khác làm hộ trên app | **Rank chỉ từ bài trên lớp.** Bài lớp ×2 trong Lực dạng. **Cờ lệch** (điểm app cao bất thường so với ET cùng dạng) báo **OPS** (triangulation §5) |
| Giữ top rồi nghỉ | Decay Lực *đua* sau 14 ngày (có Thẻ Gửi Ngày); **không decay mastery/Elo** |
| Khối nhỏ, "top" dễ độc chiếm | Điểm sàn + phân vị + nhiều dạng + chốt lại mỗi tuần |
| Trả tiền | **Không có đường tiền thật** vào bất kỳ điểm, đạo cụ hay rương nào |

---

## 9. CẦN CEO CHỐT

| # | Câu hỏi | CTO đề xuất |
|---|---|---|
| **Q1** | **Rank mùa chỉ theo Elo trên lớp** (app không cộng thẳng vào rank)? | **Có.** App cày Lực dạng + danh hiệu top; rank phải là thứ không làm hộ được |
| **Q2** | Mùa rank dài bao lâu? | Trùng **mùa Level sát hạch** đang có |
| **Q3** | Tên bậc rank | Tên kiểu Liên Quân (Đồng → Thách Đấu): HS hiểu ngay, không phải dạy |
| **Q4** | Trần xu từ Sổ + Thành tựu / tháng | ~30–40% xu tháng HS chăm; chốt số sau khi soi `qlht_qua.gia_xu` |
| **Q5** | Phạm vi danh hiệu top: **khối × môn toàn trung tâm**; có nhiều **cơ sở** không (để thêm tầng)? | CEO trả lời hiện trạng số cơ sở |
| **Q6** | Thưởng lớp thắng đua lớp | Vd thêm 1 lượt game buổi cho cả lớp / trà sữa tập thể theo tháng |
| **Q7** | Thứ tự build | **GĐ1** Rank mùa + khung/khoe trên TV (Elo có sẵn, nhanh nhất ra "chất game") → **GĐ2** Lực dạng + danh hiệu top → **GĐ3** Thành tựu → **GĐ4** Sổ Sứ Mệnh → **GĐ5** Đua lớp + sự kiện |

---

## 10. Kiến trúc (khớp CLAUDE.md — để lập plan khi chốt)

- **Tính ở Postgres, client chỉ gọi RPC** (§2.0). Mọi thứ có `mon` (§1.6), dispatch dạng → bảng kho qua registry.
- **Suy động, không row chờ** (§1.5, §4):
  - Rank hiển thị = f(`gami_elo_history`, sàn, khiên).
  - **Lực dạng** = `fn_luc_dang(hs, mon)` từ `bai_lam_cau`.
  - Tiến độ nhiệm vụ và thành tựu = hàm đọc.
- **Chỉ ghi dòng khi có sự kiện thật** (append, không xoá):
  - `hs_thanh_tuu_dat` (hs, mon|NULL, key, bac, dat_at).
  - `hs_danh_hieu_tuan` (hs, mon, ma_dang|NULL, loai, tuan) — kết quả chốt tuần.
  - `hs_rank_mua_ket` (hs, mon, mua, bac_dinh) — kết quả chốt mùa.
  - `hs_so_nhan` (thưởng đã phát, unique ⇒ idempotent).
  - `hs_dao_cu` (khiên / thẻ: nhận + dùng, dạng sổ cái).
  - `ngay_nghi_hop_le` (OPS quản).
- **Chốt tuần/ngày/mùa** bằng job DB (pg_cron): tính và ghi trong 1 transaction, giờ VN.
- **Độ khó câu** = view / cột suy từ thống kê `bai_lam_cau`, làm mới định kỳ.
- **Catalog:** mở rộng `thanh_tich_loai` (thêm `nguong int[]`, `an`, `chung`, `phan_vi_top`), migrate 12 key cũ. **Không đẻ catalog thứ 2.**
- **RPC cho HS:** `security definer` theo mẫu `fn_hs_vi_xu_cua_toi` + **`revoke execute … from anon`** (bài học 18/09).
- **Thêm nguồn EXP mới** (`exp_so_su_menh`, `exp_thanh_tuu`):
  - Sửa đủ **4 chỗ đọc** viết cứng: `fn_gami_exp_xu_thang`, `fn_gami_exp_chi_tiet_thang`, `fn_hs_vi_xu_cua_toi`, `EXP_NOTE_SOURCES`.
  - Loại nguồn mới khỏi lệnh delete của `fn_recompute_exp_thang`.
- **Xu trực tiếp** ⇒ migration nới CHECK `qlht_xu_ledger.loai`, và xử `nguoi_tao NOT NULL FK nhan_su` (dòng nhân sự "hệ thống").

---

## 11. Nguồn

- **Liên Quân:**
  - [Lực chiến & chiến khu (TGDĐ)](https://www.thegioididong.com/game-app/cach-tinh-diem-hien-thi-doi-chien-khu-trong-lien-quan-mobile-1540499)
  - [Công thức lực chiến (Garena)](https://lienquan.garena.vn/giai-thich-co-che-tinh-diem-luc-chien-trong-pb-mung-sinh-nhat-lien-quan-8-tuoi/)
  - [FAQ chiến khu (Garena)](https://hotro.garena.vn/faq/diem-chien-khu-chien-luc_76/)
  - [Xoá treo điểm](https://cellphones.com.vn/sforum/lien-quan-xoa-treo-diem-chien-luc)
  - [Reset rank S1/2026](https://lienquan.garena.vn/dieu-chinh-reset-rank-mua-moi-tu-s1-2026/)
  - [Bậc rank](https://www.thegioididong.com/game-app/cac-bac-rank-trong-lien-quan-va-bang-reset-rank-lien-1539258)
  - [Sổ Sứ Mệnh](https://cellphones.com.vn/sforum/so-su-menh-trong-lien-quan)
  - [Uy tín](https://quantrimang.com/cong-nghe/cach-tang-uy-tin-lien-quan-198228)
  - [Chống buff bẩn](https://kenh14.vn/lien-quan-mobile-xuat-hien-tinh-nang-moi-giup-chong-ca-buff-ban-lan-hack-map-top-1-thach-dau-rom-nhin-vao-biet-ngay-20220322144153142.chn)
- **Honor of Kings:** [Hero Power](https://honor-of-kings.fandom.com/wiki/Hero_Power) · [Star Protection](https://honor-of-kings.fandom.com/wiki/Star_Protection)
- **LoL:**
  - [Apex tiers](https://support.riotgames.com/en-us/league-of-legends/gameplay/master-grandmaster-and-challenger-the-apex-tiers)
  - [MMR/LP](https://support.riotgames.com/en-us/league-of-legends/gameplay/mmr-rank-and-lp)
  - [Challenges FAQ](https://support.riotgames.com/en-us/league-of-legends/gameplay/challenges-faq-league-of-legends)
  - [Rank](https://leagueoflegends.fandom.com/wiki/Rank_(League_of_Legends))
  - [Victorious](https://turbosmurfs.gg/article/victorious-skins-league-of-legends-rewards)
- **Free Fire:** [Rank](https://freefirehub.com/news/free-fire-rank-system-tiers-rp-season-reset) · [Quân đoàn chiến](https://ff.garena.com/vn/article/1346/)
- **PUBG / Valorant / Hearthstone / Brawl:**
  - [PUBG ranks](https://www.esports.net/wiki/guides/pubg-mobile-ranks/)
  - [Valorant](https://wecoach.gg/blog/article/valorant-ranks-in-order-distribution-rr-and-act-rank-guide)
  - [Hearthstone Ranked](https://hearthstone.wiki.gg/wiki/Ranked)
  - [Brawl ranks](https://trophycoach.com/brawl-stars/guides/brawl-stars-ranks-explained)
  - [Brawl Mega Pig](https://brawlstars.fandom.com/wiki/Mega_Pig)
- **Supercell:**
  - [Clash Royale Ranked](https://clashroyale.fandom.com/wiki/Ranked)
  - [Clash Royale Card Mastery](https://clashroyale.fandom.com/wiki/Card_Mastery)
  - [Clash Royale Tournament](https://clashroyale.fandom.com/wiki/Tournament)
  - [CoC Clan Games](https://clashofclans.fandom.com/wiki/Clan_Games)
  - [CoC Clan War Leagues](https://clashofclans.fandom.com/wiki/Clan_War_Leagues)
  - [Legend League](https://support.supercell.com/clash-of-clans/en/articles/legend-league-4.html)
- **WoW / Genshin / PoGo / Xbox:**
  - [Feats of Strength](https://wowpedia.fandom.com/wiki/Feats_of_Strength_achievements)
  - [Realm First!](https://warcraft.wiki.gg/wiki/Realm_First!)
  - [Gladiator](https://wowpedia.fandom.com/wiki/Gladiator_(title))
  - [Genshin Battle Pass](https://genshin-impact.fandom.com/wiki/Battle_Pass)
  - [Pokémon GO Medals](https://pokemongo.fandom.com/wiki/Medals)
  - [Xbox Achievement](https://xbox.fandom.com/wiki/Achievement)
- **Chưa xác minh:** thông số thẻ x2 của Liên Quân · cơ chế bang hội Liên Quân · mốc Trophy Road Clash Royale · ngưỡng LP GM/Challenger theo server. Không ảnh hưởng thiết kế, vì BK chỉ lấy **mẫu**, không lấy **hằng số**.
