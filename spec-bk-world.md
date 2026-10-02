# BK World (tên tạm) — THIẾT KẾ TỔNG của game BK

> **CEO (Thùy) chốt 01/10/2026 chiều.** Đây là file TỔNG: vòng chơi + kinh tế của cả game.
> Luật chi tiết từng hoạt động nằm ở spec con:
> - trồng cây: `spec-nong-trai-nhip-ngay.md`;
> - bắt thú, ấp trứng: `spec-bat-thu.md`.
> Mâu thuẫn giữa các file ⇒ file này thắng. Quyết định mới hơn của CEO thắng và được ghi lại ở đây.
> Code: project riêng `BKGame` (repo `bk-nong-trai`, `bk-bat-thu`, sẽ gộp). DB + hàm `fn_*` ở repo ERP này.

---

## 1. Thiết kế của CEO (01/10, nguyên ý)

1. **Học ra một loại tiền: ĐIỂM HỌC TẬP** (tên tạm).
2. Điểm học tập dùng để chơi game **BK World**, một dạng **RPG mini**.
3. Game có **3 hoạt động chính:** trồng cây · bắt thú · ấp trứng.
4. Dùng điểm học tập **mua hạt giống**. Thu hoạch xong có thể **bán nông sản lấy xu**.
5. HS thích bắt thú thì dùng **nông sản chế tạo (hoặc đổi) ra bóng bắt quái**. **Nhiều loại bóng, giá khác nhau.**
6. **Bắt được quái thì đem về nuôi**, và **lai với nhau** ra loài mới. Có **nhiệm vụ liên quan tới bắt quái**; hoàn thành nhiệm vụ với **NPC** cũng được **xu**.
7. **Lai 2 quái ra trứng; ấp trứng nở ra loài mới** theo **công thức** (giống Palworld nhưng đơn giản hơn).
8. Quái có **shiny** (màu đặc biệt) và **alpha** (to gấp rưỡi), như Palworld.
9. Đi bắt quái phải có **vé vào dungeon**. Vé **rơi khi thu hoạch cây**, hoặc **mua bằng điểm học tập**.
10. Giả định HS thích: **cây để kiếm xu** · **pet hiếm để khoe bạn bè** · **cảm giác mò ra công thức** · **dopamine khi bắt được alpha, shiny**.

**Tóm lại có 2 cách kiếm xu:**
- **Đơn giản:** trồng cây, bán lấy xu.
- **Thích thử thách, phiêu lưu:** chơi thêm bắt thú, ấp trứng (xu đến từ nhiệm vụ NPC).

## 2. Vòng chơi + kinh tế

```
                 ┌──────────── vé dungeon (rơi khi thu hoạch) ───────────┐
                 │                                                        ▼
HỌC ─(lượt học thật)─► ĐIỂM HỌC TẬP ─► hạt giống ─► TRỒNG ─► nông sản ─┬─► bán ─────────────► XU (ví BK)
                              │                                        │                        ▲
                              └──────── vé dungeon ──────────┐         └─► chế/đổi BÓNG ─┐      │
                                                             ▼                           ▼      │
                                                          DUNGEON ─────────────────► BẮT QUÁI ──┤ nhiệm vụ NPC
                                                                                         │      │
                                                              nuôi ◄──────────────────────┤      │
                                                              LAI 2 quái ─► TRỨNG ─► ẤP ─► loài mới / shiny / alpha
                                                                                     (công thức)  └─► khoe Thế giới BK
```

- **Vào (vòi):** chỉ có học ⇒ điểm học tập. Không có đường nào khác tạo ra điểm.
- **Ra (cửa xu):**
  - (a) bán nông sản;
  - (b) thưởng nhiệm vụ NPC.
- **Giữ lại trong game, không đổi ra xu:** quái, trứng, loài mới, shiny/alpha ⇒ để **khoe** (đề xuất §4 câu 1).
- **Phanh thời gian chơi:** vé dungeon (mỗi lượt đi bắt cần 1 vé) + cây lớn theo ngày.

## 3. CTO phân tích

### 3.1 Đứng trên vai ai (R7)

| Ý của CEO | Tiền lệ / lý thuyết |
|---|---|
| Học ra điểm, điểm đổi lấy quyền chơi | **Premack** ("việc ít muốn mở khoá việc thích") · Habitica (việc thật ra vàng trong game) · temptation bundling |
| 2 đường kiếm xu cho 2 kiểu người chơi | **Bartle (1996):** Achiever (cày, sưu tập) · Explorer (khám phá) · Socializer (khoe, kết bạn). Nông trại phục vụ người thích ổn định; dungeon phục vụ người thích khám phá + thử thách |
| Mò ra công thức lai | Cơ chế **khám phá tổ hợp** của Little Alchemy / Doodle God · bảng lai của Palworld · Dragon City lai theo hệ |
| Shiny, alpha | Shiny Pokémon (tỉ lệ ~1/4096) · Lucky Pal + Alpha Pal của Palworld. Tâm lý: **thưởng ngẫu nhiên tỉ lệ biến đổi** (Skinner) — mạnh nhất để giữ chân |
| Vé dungeon | Raid Pass của Pokémon GO · thể lực/năng lượng trong game mobile: giới hạn lượt chơi mỗi ngày |
| Pet hiếm để khoe | Hiệu ứng mạng lưới + vị thế xã hội. Lợi thế BK = bạn cùng lớp ngoài đời (spec-bat-thu §1 #16) |

### 3.2 Chỗ phải cân kỹ

1. **Hai cửa xu, MỘT trần tháng.**
   - Nông Trại đã có trần (30 xu/tháng, mùa đầu 45) cho đường bán nông sản.
   - Xu từ nhiệm vụ NPC phải tính **chung trần này**, nếu không BK chi gấp đôi.
2. **Hai đường phải ngang giá trị kỳ vọng** (CEO 30/09: "bán luôn 3 xu, làm bóng thì 4–5 xu nhưng có thể hụt").
   - Đi đường phiêu lưu không được lời chắc chắn hơn bán nông sản: lời hơn chút nhưng có rủi ro + vui hơn.
   - Nếu không, mọi em sẽ dồn về một đường.
   - Bóng đắt ⇒ tỉ lệ bắt cao hơn, nhưng tỉ lệ hiện công khai.
3. **Quái không bán ra xu** (đề xuất). Nếu bán được thì "lai ra shiny ⇒ bán" thành cửa xu thứ ba khó kiểm soát.
4. **Shiny / alpha là phần thưởng ngẫu nhiên cho trẻ em:**
   - tỉ lệ công khai;
   - KHÔNG cho dùng xu hay điểm mua thêm cơ hội (vd "bóng may mắn trả xu");
   - shiny chỉ để khoe, không mạnh hơn.
   - Giữ vậy để không thành hộp quà may mắn.
5. **Điểm học tập phải có MỘT nguồn duy nhất = "lượt học thật"** (`public._luot_hoc_that()`, đã làm 01/10: ≥5/10 · không lặp câu · ≥6 giây/câu).
   - Nông Trại đang dùng "điểm chăm chỉ" (≥70% đúng) ⇒ **gộp làm một**: đổi tên thành điểm học tập, tính từ lượt học thật, có trần ngày.
   - Đây cũng là "cổng học" của spec-v1-app-hs §2.
6. **Trùng tên:** "BK World" dễ lẫn với **"Thế giới BK"** (mạng xã hội trong app, hạng mục 3 của V1) ⇒ nên đặt tên game khác hẳn.
7. **Lai + công thức là phần thiết kế lớn nhất** (bao nhiêu loài gốc, bao nhiêu loài lai, công thức công khai hay giấu):
   - cần làm **bảng lai riêng** (dữ liệu, không code cứng);
   - cần bot giả lập như Nông Trại để đo "bao lâu mò ra hết".

### 3.3 Khối lượng (để chọn cái gì vào V1 — deadline 06/10)

| Phần | Đã có | Còn thiếu để HS chơi thật |
|---|---|---|
| Điểm học tập | Lượt học thật (01/10) | Hàm số dư điểm (học − tiêu) + trần ngày · đổi Nông Trại sang dùng nó |
| Trồng cây → bán xu | Luật + kinh tế lần 5 + giả lập 5.000 HS · bố cục màn ngang | Bản online `fn_nt_*` (giờ máy chủ, trần xu) · đăng nhập BK · gắn vào app |
| Vé dungeon | — | Rơi khi thu hoạch + mua bằng điểm |
| Bắt thú | Bản thử: đánh yếu + ném bóng, 23 loài Quaternius (chưa dễ thương) | **Thú dễ thương** (làm bằng code) · nhiều loại bóng · dungeon · lưu online |
| Nuôi + lai + trứng + công thức | — | Toàn bộ (bảng lai, vườn nuôi, ấp, hoạt cảnh nở) |
| Shiny / alpha | — | Biến thể màu + phóng 1,5× (dễ, nếu thú làm bằng code) |
| Nhiệm vụ NPC | — | NPC + bảng nhiệm vụ + thưởng xu (chung trần) |

## 4. CEO đã chốt (01/10 chiều)

| # | Câu | CEO |
|---|---|---|
| 1 | Quái, trứng có bán ra xu? | **Không** — chỉ nuôi, lai, khoe, làm nhiệm vụ |
| 2 | HS đổi/tặng quái cho nhau? | **Chưa** |
| 3 | Xu nhiệm vụ NPC tính chung trần tháng với bán nông sản? | **Chung** (30 xu/tháng, mùa đầu 45) |
| 4 | Điểm học tập | **Một nguồn duy nhất** = lượt học thật. "Điểm chăm chỉ" của Nông Trại gộp vào đây |
| 5 | Tên game | CEO: "nghĩ đi" ⇒ CTO đề xuất ở §6 |
| 6 | V1 (06/10) ra phần nào? | **ĐỦ TÍNH NĂNG, số lượng ít.** *"V1 thì phải có đủ tính năng rồi, chỉ là số lượng chưa nhiều thôi."* |
| 7 | Cấu trúc game (02/10) | **3 MÀN CHÍNH: trồng cây · bắt thú · ấp trứng; thú bắt được ĐI DẠO ở trang trại** — xem §7 (thay Trại thú riêng của §5.2) |
| 8 | V1 06/10 online thật hay lưu trên máy? (02/10) | **Đủ 3 màn, LƯU TRÊN MÁY** — online (điểm học tập thật, xu thật) làm ngay SAU 06/10 |
| 9 | Thú huyền thoại trong V1 (02/10) | **Bắt được, CỰC HIẾM** trong dungeon (tỉ lệ công khai, cần bóng xịn) |

## 5. KẾ HOẠCH V1 — đủ 10 tính năng, số lượng ít (deadline 06/10)

### 5.1 Số lượng V1 (TỰ ĐẶT — chỉnh sau khi chơi thật)

| Tính năng (§1) | V1 có |
|---|---|
| Điểm học tập (1, 4) | 1 nguồn = lượt học thật, có trần ngày; mua hạt + vé |
| Trồng cây → bán xu (4) | 4 loại cây đầu của Nông Trại nhịp ngày; ô mở dần như spec Nông Trại |
| Bóng bắt quái (5) | **3 loại** (thường · tốt · xịn), chế từ nông sản ở Xưởng; bóng xịn tỉ lệ cao hơn, tỉ lệ hiện công khai |
| Vé dungeon (9) | Rơi khi thu hoạch (tỉ lệ) + mua bằng điểm học tập |
| Dungeon + bắt quái (5, 6) | **1 dungeon** (đồng cỏ của bản thử), **6 loài gốc**; đánh yếu rồi ném bóng (đã có) |
| Nuôi (6) | Trại thú: thú đi lại, chạm để vuốt ve, xem sổ thú |
| Lai → trứng → ấp → loài mới (6, 7) | **4 loài lai, 6–8 công thức**; sổ công thức mở khi mò ra lần đầu; lò ấp 1 ô, nở sau 1 đêm |
| Shiny + alpha (8) | Mọi loài có bản shiny (bảng màu riêng) + alpha (to 1,5×), tỉ lệ công khai |
| Nhiệm vụ NPC → xu (6) | **1 NPC, 5 nhiệm vụ xoay vòng** (bắt loài X · ấp ra Y · giao nông sản); xu chung trần |
| Khoe (10) | Thú hiếm/shiny/alpha khoe lên Thế giới BK (gửi luồng Số liệu + Giao diện) |

**Ngoài 10 ý, đề xuất để V1.1** (chờ CEO gật):
- giúp / hái trộm vườn bạn;
- gà, bò, lò bánh;
- cưỡi thú;
- thấy người chơi khác;
- boss.

### 5.2 Kiến trúc (CTO quyết — R2)

- **Một game, 3 khu + công trình chung:**
  - khu: Nông trại · Dungeon · Trại thú;
  - công trình: Xưởng (chế bóng) · Lò ấp · NPC;
  - HUD chung: điểm học tập · xu · vé · kho đồ.
- **Code gốc = repo `bk-bat-thu`** (Vite + TS + three r186).
  - Nông Trại (three r128, JS thuần) vào làm khu riêng.
  - V1 cho phép khu Nông trại chạy trang riêng trong cùng game, không viết lại trong 5 ngày; chuyển dần sau.
- **Thú dễ thương làm bằng code:**
  - Chuyển khung xương con chó + bộ nặn khối liền của `dohoa.js` sang module TS r186 làm **khuôn 4 chân**; thêm **khuôn tròn** và **khuôn chim**.
  - 1 loài = 1 dòng tham số. Shiny = bảng màu thứ 2. Alpha = ×1,5.
  - Nguyên tắc dễ thương: spec-bat-thu §3.2.
- **Mọi thứ có giá trị do máy chủ quyết** (Postgres, repo ERP, CLAUDE §2.0):
  - `fn_game_diem_cua_toi`: điểm = lượt học thật có trần − đã tiêu.
  - Kho đồ = sổ giao dịch (chỉ ghi dòng khi có việc thật; số dư = tổng).
  - Ruộng: gieo · tưới · thu theo luật Nông Trại, ngẫu nhiên theo hàm băm. Chỉ chuyển phần V1 dùng.
  - `fn_game_vao_dungeon`: trừ vé, máy chủ gieo danh sách thú kèm shiny/alpha.
  - `fn_game_nem_bong`: trừ bóng, máy chủ tính tỉ lệ + ghi thú.
  - `fn_game_lai` · `fn_game_ap` · `fn_game_nhiem_vu_*`.
  - Xu vào ví BK theo trần chung.
- **Chạy chung tên miền app HS**, dùng chung phiên đăng nhập. Ô vào game trên Home ⇒ gửi luồng Giao diện qua hộp thư (spec-v1-app-hs §13.6).

### 5.3 Lịch

| Ngày | Việc | Cần CEO |
|---|---|---|
| 01/10 tối | Khuôn thú 4 chân bằng code + **2 loài mẫu** (con thường · shiny · alpha) + quả trứng | Duyệt hình |
| 02/10 | DB lõi: điểm học tập · kho đồ · ruộng · xu chung trần · thêm 4 loài gốc | Duyệt hình |
| 03/10 | Dungeon nối DB (vé · ném bóng · shiny/alpha) · Xưởng chế bóng | |
| 04/10 | Trại thú · lai + công thức · lò ấp + hoạt cảnh nở · 4 loài lai | Duyệt hình |
| 05/10 | NPC + nhiệm vụ · gắn vào app HS + đăng nhập · khoe Thế giới BK | Áp migration |
| 06/10 | Soi trên iPad bằng tài khoản HS thật · sửa lỗi | Duyệt trên iPad |

- **Rủi ro:**
  - (1) số vòng duyệt hình thú;
  - (2) chuyển luật Nông Trại sang SQL;
  - (3) iPad gen 7.
- **Dự phòng nếu 05/10 trễ:** giữ ĐỦ tính năng, giảm số lượng (6 → 4 loài gốc, 8 → 4 công thức), không cắt tính năng.

## 6. Tên game — CTO đề xuất (CEO chọn)

| Tên | Vì sao |
|---|---|
| **Làng Bách Thú** (thú trong game gọi là **BKmon**) | "Bách Thú" đọc gần "Bách Khoa"; "làng" bao được cả trồng trọt lẫn nuôi thú; "BKmon" dễ nhớ như Pokémon, dùng để gọi từng con |
| **BKmon** | Ngắn, HS nhớ ngay; nhưng nhấn vào thú, lu mờ phần trồng cây |
| **Thung Lũng BK** | Như Stardew Valley: nông trại + phiêu lưu; hơi "người lớn" |
| **Đảo Mầm** | Mầm cây + trứng nở, rất dễ thương; không có chữ BK |

## 7. CEO CHỐT 02/10 chiều: GAME = 3 MÀN CHÍNH — thú bắt được đi dạo ở trang trại

> CEO 02/10: *"Giờ quay lại chốt game nông trại: 3 màn chính trồng cây – bắt thú – ấp trứng (thú bắt được sẽ đi dạo ở trang trại)."*
> Thay §5.2 "3 khu + Trại thú riêng": **không còn Trại thú riêng** — trang trại CHÍNH LÀ nơi thú sống.

### 7.1 Ba màn

| Màn | Có gì | Nối sang |
|---|---|---|
| **1. TRANG TRẠI** (trồng cây) | Ruộng kiểu Nông trại vui vẻ (spec-nong-trai-nhip-ngay §2.1: 12 ô, màn ngang, góc camera giữ nguyên) · gieo · tưới · thu · bán nông sản lấy xu · **thú đã bắt ĐI DẠO quanh trại** (lang thang, ngủ, ăn, chơi với nhau — bộ 25 động tác có sẵn; thú bơi ở ao, thú bay lượn trên trại) · chạm thú ⇒ vuốt ve + thẻ thú · **Xưởng** (chế bóng từ nông sản) và **bảng nhiệm vụ NPC** đặt ngay trên trại | cổng ra màn 2 (cần vé) · chuồng ấp ⇒ màn 3 |
| **2. BẮT THÚ** | Tốn 1 vé ⇒ vào dungeon đồng cỏ · thú hoang (làm bằng code) đi lại · ném bóng (3 loại, tỉ lệ công khai) · máy chủ gieo shiny/alpha · bắt được ⇒ về trại | về trang trại |
| **3. ẤP TRỨNG** | Chọn 2 thú đang ở trại ⇒ **lai** ⇒ trứng (theo công thức) ⇒ đặt lò ấp ⇒ nở sau 1 đêm (giờ máy chủ) ⇒ hoạt cảnh nở (trứng từng loài đã có) ⇒ loài mới / shiny / alpha ⇒ thả ra trại · **sổ công thức** mở dần khi mò ra | về trang trại |

- **HUD chung** cả 3 màn: điểm học tập · xu · vé · kho đồ + 3 nút chuyển màn.
- **Số lượng V1** giữ như §5.1 (4 cây · 3 bóng · 1 dungeon · 6 loài gốc · 4 loài lai / 6–8 công thức · 1 NPC 5 nhiệm vụ).
  Loài gốc lấy từ thú đã làm bằng code (spec-bat-thu §3.5): Cáo Lửa · Cừu Mây · Khỉ Lá · Sói Nguyệt · Nhím Điện · Cánh Cụt Nước (+ Gà Lửa · Bò Tuyết dự phòng).

### 7.2 Kỹ thuật (CTO quyết — R2)

- **Một app duy nhất = repo `bk-bat-thu`** (Vite + TS + three r186). **Trang trại phải chuyển sang r186**: thú làm bằng code chạy r186, muốn đi dạo trên trại thì phải chung 1 cảnh, 1 bộ vẽ — 2 bản three không vẽ chung cảnh được.
  Phương án "Nông Trại chạy trang riêng" của §5.2 bỏ.
  - Luật Nông Trại (`engine.js`, `data.js`, `nhiemvu.js` — JS thuần) chuyển nguyên sang TS, không đổi luật.
  - Đồ hoạ (`dohoa.js`, `models.js`, `scene.js` ~3.800 dòng r128) chuyển API sang r186 (màu sRGB, cường độ đèn vật lý từ r155).
- **Hiệu năng iPad:** thú trên trại dùng **bản Nhẹ**; tối đa ~8 con đi dạo cùng lúc, con khác nằm trong Sổ thú (chọn con nào ra trại). Thú huyền thoại bản Nhẹ ~32k tam giác — 1 con mỗi trại.
- **Mọi thứ có giá trị do máy chủ quyết** như §5.2 (`fn_game_*`, xu chung trần, điểm học tập 1 nguồn).

### 7.3 Lịch lại (thật): 01–02/10 dồn vào hình thú, hệ thống CHƯA bắt đầu

| Ngày | Việc |
|---|---|
| 03/10 | Khung 1 app 3 màn + HUD + chuyển màn · chuyển Trang trại sang r186 (ruộng, cây, thu, bán) · thú đi dạo trên trại |
| 04/10 | Màn Bắt thú bằng thú code (6 loài gốc) · 3 loại bóng · Xưởng chế bóng · vé |
| 05/10 | Màn Ấp trứng: lai · công thức · lò ấp · hoạt cảnh nở · shiny/alpha · NPC 5 nhiệm vụ |
| 06/10 | Soi iPad · sửa lỗi · (CEO 02/10: V1 lưu trên máy — online làm ngay sau) |

- **CEO 02/10:** V1 = đủ 3 màn LƯU TRÊN MÁY; online + gắn app HS làm ngay sau 06/10. Thú huyền thoại bắt được trong dungeon, cực hiếm.

### 7.4 Đã build 02/10 tối (sớm hơn lịch 7.3) — bản chạy được, LƯU TRÊN MÁY

Repo `bk-bat-thu`, nhánh `game-3-man`, three **r186** (0.186.1). Mở: `trai.html` (Trang trại) · `bat.html` (Bắt thú) · `ap.html` (Ấp trứng). Thú xem thử trên trại khi chưa bắt con nào: `trai.html?thu=6`.

| Màn | Đã có |
|---|---|
| 1. Trang trại | Nông Trại nhịp ngày (r186) · thú đã có ĐI DẠO (lang thang, gặm cỏ, ngồi, nằm, ngáp, rủ nhau chơi, đêm ngủ; chạm = vuốt ve) · nút 📋 Nhiệm vụ · 🔨 Xưởng · 🥚 Ấp trứng · 🎯 Bắt thú (số vé) · vé rơi khi thu hoạch |
| 2. Bắt thú | Đồng cỏ của bản thử, thú hoang = thú code · chọn thú khởi đầu (Cáo Lửa / Cừu Mây / Khỉ Lá) · đánh yếu rồi ném · 3 loại bóng · 1 vé/lượt · bắt được ⇒ về trại |
| 3. Ấp trứng | Chọn 2 bé ⇒ lai ⇒ trứng vào 1 trong 2 lò ⇒ sáng hôm sau (5 giờ VN) chạm để nở ⇒ hoạt cảnh nở ⇒ thả ra trại · sổ công thức mở dần |
| NPC | Bác Hai 5 nhiệm vụ nối tiếp: chế 3 bóng → bắt 1 bé → đủ 3 loài → lai 1 trứng → ấp nở 1 bé |

**Số CTO TỰ ĐẶT để chơi thử — CEO xem, sửa thoải mái:**
- Bóng (Xưởng): thường = 5 lúa mì + 2 cà rốt (×1) · tốt = 8 lúa mì + 6 cà rốt (×1,5) · xịn = 10 lúa mì + 8 cà rốt + 6 ngô (×2,2). Giá trị bán ≈ 16 · 34 · 68 EXP.
- Vé: rơi 10% mỗi ô thu hoạch (12 ô ⇒ ~1,2 vé/ngày) · đổi 1 vé = 10 📘 điểm chăm chỉ · 1 vé = 1 lượt (tải lại trong 30 phút không tốn thêm).
- Quà người mới: 3 vé + 10 bóng thường + 2 bóng tốt.
- Đồng cỏ: 6 loài gốc + Gà Lửa, Bò Tuyết ít gặp · **Băng Thần Mã ≈ 0,2% mỗi lần sinh thú** (1 lượt ~4% được gặp), tỉ lệ bắt gốc 9% (đánh yếu + choáng + bóng xịn ≈ 20%) · shiny 2% · alpha 3% (to ×1,4, +3 cấp).
- Lai: phí 6 lúa mì + 4 cà rốt · mỗi bé lai 1 lần/ngày · 2 lò · cùng loài ⇒ loài đó, khác loài không có công thức ⇒ loài bố hoặc mẹ · shiny 2% (+8% mỗi bố mẹ shiny) · alpha 3% (+10% mỗi bố mẹ alpha) · huyền thoại không lai được.
- 8 công thức ⇒ 4 loài lai: Cáo Lửa + Sói Nguyệt / Gà Lửa + Sói Nguyệt ⇒ **Sư Tử Lửa** · Khỉ Lá + Sói Nguyệt / Bò Tuyết + Khỉ Lá ⇒ **Voi Rừng** · Cáo Lửa + Cánh Cụt Nước / Nhím Điện + Cáo Lửa ⇒ **Gà Lửa** · Cừu Mây + Cánh Cụt Nước / Nhím Điện + Cừu Mây ⇒ **Bò Tuyết**.
- Thưởng 5 nhiệm vụ: 1 vé · 2 bóng tốt · 1 vé + 1 bóng xịn · 2 vé · 1 bóng xịn + 2 bóng tốt, **cộng thêm 50 · 100 · 150 · 150 · 200 EXP** (03/10, tổng 6,5 xu). EXP vào ví Trang trại rồi đổi ra xu bằng đúng hàm đổi xu của Nông Trại ⇒ **chung trần xu tháng** với bán nông sản (CEO đã chốt câu §4.3 từ 01/10: "Chung"); chạm trần thì EXP để dành, sang tháng tự đổi tiếp.

**Còn lại cho 06/10:** soi iPad (FPS, cỡ chữ, chạm) · HS thật chơi thử 1 vòng · chỉnh số theo cảm giác.

## 8. CEO CHỐT 02/10 tối: MÀN BẮT THÚ = DUNGEON RIÊNG TỪNG LOÀI (thay "1 đồng cỏ chung" của §7.1)

> CEO 02/10: *"1. Mỗi con thú sẽ có 1 dungeon riêng. 2. Mỗi con thú sẽ có story riêng. 3. Khi chơi sẽ có cơ hội nhận được vé khi thu hoạch, hoặc làm nhiệm vụ, hoặc mua trong shop. 4 mức pet ứng với 4 loại vé.
> 4. Mỗi lần vào dungeon có 3 cơ hội ném bóng. Pet level càng cao càng khó bắt. 5. Mỗi ngày, hoàn thành nhiệm vụ ngày về học tập được 1 lượt free vào dungeon cấp 1, 2. Mỗi tuần hoàn thành được 1 lượt vào 3, 4."*

**CEO trả lời 4 câu hỏi làm rõ (02/10):**
- Trong dungeon **vẫn đánh cho thú yếu rồi mới có 3 lần ném** (kiểu raid Pokémon GO) — đội thú của em vẫn có việc, vẫn lên cấp.
- Dungeon V1 = **cảnh riêng theo hệ + truyện ngắn ở cửa vào** (3–5 khung), thú chờ ở cuối. Dungeon có màn chơi (đường đi, cửa ải, câu đố) để sau V1.
- Vé mua trong shop bằng **điểm chăm chỉ** (đúng §1 #9: muốn đi bắt nhiều phải học).
- Nhiệm vụ học tập ngày/tuần — V1 **tạm tính trên máy**: ngày = đủ ngưỡng điểm chăm chỉ trong ngày ⇒ 1 lượt free tầng 1–2; tuần = hoàn thành nhiệm vụ ngày 5/7 ngày ⇒ 1 lượt free tầng 3–4. Lên online đổi sang nhiệm vụ thật trên app HS.

**4 tầng thú = 4 loại vé** (tầng theo spec-bat-thu §3.5: 1 thường · 2 săn mồi đỉnh · 3 thần thoại · 4 truyền thuyết). Xếp tầng — CTO đề xuất, CEO sửa thoải mái:

| Tầng | Loài (đã nối vào game) | Cấp thú trong dungeon |
|---|---|---|
| 1 | Cáo Lửa · Cừu Mây · Khỉ Lá · Nhím Điện · Cánh Cụt Nước · Gà Lửa · Bò Tuyết | 2–6 |
| 2 | Sói Nguyệt · Sư Tử Lửa · Voi Rừng | 5–10 |
| 3 | **Eidrolon** (khuôn bay — dungeon *Vực Lửa Tím*, cảnh đêm trăng) · **Ophydia** (khuôn rắn — dungeon *Hồ Sen Cổ*, cảnh nước) — nối vào game 03/10 (BatThu `game-3-man` @ `793eeb1`). Thần thoại **không lai được** (lò ấp hiện khoá kèm lý do) | 9–14 |
| 4 | Băng Thần Mã · Thiên Kình | 12–18 |

**Luật (số CTO tự đặt để chơi thử):**
- Mỗi lượt: 1 vé đúng tầng (hoặc 1 lượt free) ⇒ đọc truyện ⇒ vào cảnh ⇒ đánh cho yếu (thú dungeon không ngất, chỉ choáng ở 1 máu) ⇒ **3 lần ném** (trúng hay trượt đều tính) ⇒ hết 3 lần mà chưa bắt được thì thú bỏ chạy, hết lượt.
- Cấp càng cao càng khó bắt: tỉ lệ × (1 − 2,5% mỗi cấp trên cấp 1, sàn 30%) — tỉ lệ thật vẫn hiện khi ngắm.
- Vé rơi khi thu hoạch (mỗi ô): tầng 1 8% · tầng 2 2,5% · tầng 3 0,6% · tầng 4 0,15%. Shop (điểm chăm chỉ): 10 · 20 · 40 · 80 📘. Nhiệm vụ Bác Hai thưởng vé theo tầng.
- Ngưỡng nhiệm vụ học tập ngày: ≥ 10 điểm chăm chỉ trong ngày nông trại (≈ 1 lượt bài đạt).
- Loài lai (Sư Tử Lửa, Voi Rừng, Gà Lửa, Bò Tuyết) vẫn ra được từ trứng; có thêm dungeon riêng như mọi loài.

**CEO 02/10 (sau khi xem bản cảnh mở):** *"Mỗi con nên có dungeon riêng — kiểu đi bộ qua hang động rồi mới đến khu vực boss chứ."* ⇒ dungeon = **HANG ĐÁ**:
hành lang uốn lượn ~50 m giữa 2 vách (hình đường sinh theo tên loài — 12 dungeon 12 đường khác nhau), tinh thể phát sáng theo hệ dọc vách,
đá tảng + măng đá ⇒ **phòng boss** tròn cuối hang (vòng rune, tinh thể lớn sau lưng boss, vũng nước/dung nham); bước vào phòng ⇒ băng tên boss + boss gầm.
Trong hang V1 chưa có quái nhỏ / cửa ải / câu đố (để sau, nếu CEO muốn).
