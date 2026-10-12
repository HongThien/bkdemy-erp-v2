# Spec — "Làng BK" (tên tạm): thế giới sống kiểu Stardew cho HS khối 4–8

> Thùy ↔ CTO, 11–12/10/2026. **Trạng thái: LOGIC đã chốt phần ghi "CEO chốt" · CHƯA code.** Số liệu ghi **TỰ ĐẶT** = khởi điểm để chạy thử.
> Liên quan: `spec-bk-world.md` (game trồng + bắt thú + ấp trứng — **GỘP vào Làng BK**, CEO chốt 12/10; chiều xu giữ nguyên, xem §5) ·
> `spec-the-gioi-bk.md` (feed khoe — đây là "bảng tin" của làng, KHÔNG trùng tên) · `spec-che-do-game.md` (Đấu trường = một toà nhà trong làng).
> Tên "Làng BK" chỉ là tạm — đặt tên khác hẳn "Thế giới BK" (CEO chốt).

---

# PHẦN A — LOGIC

## 1. Đích và vị trí trong lộ trình (CEO 12/10)

- **Định vị theo PHASE, không phải đổi ý:** khi năng lực chưa đủ ⇒ BK làm game "chơi vì bạn bè + xu". Khi năng lực đủ và có cơ hội ⇒ làm **game thật hay**.
  Làng BK là **đích của phase 2**; phase 1 (BK World, Đấu Từ, Thế giới BK) chuẩn bị đường cho nó.
- **Vòng xu khép kín trong Làng (CEO 12/10):** **nông trại = KIẾM xu** (có trần/tháng như `spec-nong-trai-nhip-ngay.md`), **nhà cửa/đồ khoe = TIÊU xu** ⇒ HS mua đồ trong Làng giúp **cân bằng kinh tế xu của BK**. Muốn có hạt để trồng thì phải học (cổng học, §5).
- **Không làm "Stardew đầy đủ".** Học sinh BK **quen nhau ngoài đời** ⇒ sức hút xã hội do bạn bè gánh, nên cắt: cốt truyện dài, hẹn hò NPC, chiến đấu, hang mỏ, chuỗi chế tác.
- **Khoe nhà, câu cá được con hiếm, xây nhà to để khoe bạn** là trải nghiệm chính — "vừa giống vừa khác Roblox".

## 2. Đối tượng và cấu trúc thế giới

- **Khối 4–8** (~207 HS có tài khoản đo 11/10: K4/4T 25 · K5/5T 32 · K6 41 · K7 55 · K8 54). Đỉnh đồng thời dự kiến **~20–60** người.
- **HAI PHỐ theo khối (CEO chốt 12/10):**
  - **Phố nhỏ = khối 4–5** · **Phố lớn = khối 6–8.**
  - Nối nhau bằng **quảng trường** (sự kiện, giải, khu thi đấu = Đấu trường). Ở quảng trường thấy nhau; khác khối chỉ emote.
- **Nhà lớp: MỌI lớp đều có** (CEO chốt 12/10: "cho mọi lớp, nhưng bọn nó ít chơi" ⇒ lớp ít người chơi vẫn có nhà, đừng bỏ).
  Trang trí bằng thành tích lớp (Nhất buổi, chuỗi, giải). GV mở chiếu TV đầu buổi.
- Mặc định **chỉ thấy rõ bạn cùng lớp/cùng khối**; khác khối chỉ emote, **không tặng/mua trực tiếp** (giảm bắt nạt, giảm áp lực "đồ xịn").

## 3. Vòng chơi

| Việc | Ghi chú |
|---|---|
| Vào làng, **đi lại bằng chạm** (tự tìm đường) | Tap-to-move là chính; bàn phím phụ cho máy tính |
| Chọn đất, dựng nhà, đặt nội thất | Mỗi em 1 lô; 3 bậc nhà; đặt lên lưới |
| Trồng cây, nuôi vật nuôi | Lớn theo **ngày thật**, tính lười ở DB |
| Câu cá ở hồ | 1 hồ, ~15 loài, mini-game bấm đúng nhịp |
| Bán/mua: cửa hàng NPC + **sạp người chơi** | Giá niêm yết cố định, không đấu giá |
| Thăm nhà bạn, emote, bảng tin | Vào "phòng nhà" riêng của bạn |
| Sự kiện hẹn giờ | Dồn người khi làng vắng |

**Luật chung:** mọi thứ chậm (theo ngày); phiên 10–20 phút; có giới hạn giờ chơi/ngày tính ở server.

## 4. Đất, nhà, đồ

- Đất chọn bằng **lô theo khu** (phố nhỏ / phố lớn); lô trống = không có dòng DB (chỉ ghi khi có chủ — CLAUDE §1.5).
- Nhà có 3 bậc; nâng bậc bằng **xu** (đồ xác định, không ngẫu nhiên).
- Đồ nội thất/skin/đồ khoe: **bán giá cố định**; đồ hiếm chỉ có được nhờ chơi (câu được, sự kiện), **không bán bằng xu ngẫu nhiên** (không rương/trứng ngẫu nhiên — tránh cấu trúc cờ bạc).
- Em nghỉ học lâu ⇒ đất đóng băng, sau N ngày thu hồi (**bàn sau**).

## 5. Kinh tế xu — TẠM GÁC, TÍNH SAU (CEO 12/10: "kinh tế tính sau, design game trước"). Giữ lại làm nháp; chiều xu: nông trại kiếm · nhà cửa tiêu

> Thùy: *"Nông trại là kiếm xu, nhà cửa là tiêu xu, giúp cân bằng kinh tế BK qua việc học sinh mua đồ trong Làng BK."*

- **MỘT loại tiền = xu ví BK** (cùng ví với Tủ quà). V1 **không** thêm loại "vàng" riêng — bớt một lớp để cân bằng.
- **Nguồn xu (KIẾM):** nông trại — bán nông sản, nhiệm vụ NPC. Giữ NGUYÊN luật + **trần tháng** của `spec-nong-trai-nhip-ngay.md` (30 xu/tháng, mùa đầu 45; mọi nguồn xu trong Làng dùng chung trần).
- **Chỗ tiêu xu (TIÊU):** nhà bậc cao, đất mở rộng, nội thất, skin, đồ khoe — **đồ xác định, giá cố định, KHÔNG ngẫu nhiên** (không rương/trứng bằng xu).
- **Vì sao cân bằng:** xu từ nông trại (có trần) quay về Làng qua mua đồ, nên xu không chỉ chảy ra Tủ quà (BK tốn tiền thật). Giá đồ đặt sao cho **một món lớn ≈ 1–2 tháng thu nhập nông trại** — **TỰ ĐẶT, chỉnh bằng bot**.
- **Chống "cày xu không học":** hạt giống/vé mua bằng **điểm học tập** (= `_luot_hoc_that`), nên vòng nông trại luôn bắt đầu từ việc học (cổng học — **đề xuất, CEO chưa gật**, Phần C).
- **Hai đầu cần canh:** tiêu < kiếm ⇒ HS tích xu đổi Tủ quà; tiêu > kiếm ⇒ HS chán. Bot đo tỉ lệ xu **tiêu trong Làng / tổng xu kiếm** (mục tiêu: **bàn sau**).
- Mua bán giữa HS qua **sạp** (niêm yết giá, có log). Không chuyển đồ trực tiếp; không đấu giá.
- Mọi phép tính (giá, cây chín, số dư, đổi) ở Postgres `fn_tg_*` transactional (CLAUDE §2.0). Số dư = tổng sổ giao dịch.
- **Bot kinh tế 60 ngày** chạy trước khi mở cho HS (đã có tiền lệ Nông Trại).

## 6. Xã hội và an toàn

- **Chat chỉ emote + câu soạn sẵn.** Không gõ tự do (tuổi 9–14).
- Tên **luôn kèm lớp** hoặc mã HS (giữ luật `spec-the-gioi-bk.md` §6).
- Chặn, báo cáo; admin gỡ được mọi thứ. PH xem được số phút chơi.
- Bạn bè = đồ thị bạn bè đã có ở Thế giới BK (không dựng lại).
- Tin "khoe" ở làng lấy từ nguồn Thế giới BK, không đẻ bảng bài đăng mới.

## 7. Art — QUYẾT ĐỊNH (CEO 12/10): pixel · KHÔNG thuê freelance · AI + mua pack · chấp nhận bớt đẹp

- **Phong cách:** pixel art 16×16 (phóng ×3), top-down. Lý do: chạy nhẹ iPad gen 7; HS đã quen kiểu Roblox/blocky.
- **Ba lớp, theo thứ tự ưu tiên:**
  1. **MUA PACK** (nền, nội thất, nhân vật ghép lớp tóc/áo): chọn **1 bộ cùng tác giả** để đồng nhất. Phủ ~70–80%.
  2. **SINH BẰNG CODE:** biến thể màu từ cùng một sprite (đổi hue: skin nhà, hoa, cá), cây 4 giai đoạn từ thân chung, hiệu ứng. 1 sprite → nhiều biến thể.
  3. **AI SINH + BỘ LỌC:** chỉ cho **vật phẩm tĩnh** (cá, nông sản, nội thất, đồ khoe). Hạ về 16/32 px bằng nearest-neighbor, **ép về palette chung**, sửa viền; mỗi lô 20 món CEO duyệt trên 1 trang xem thử.
     **KHÔNG dùng AI cho nhân vật/animation 4 hướng** (lệch khung, khó nhất quán).
- **Luật nhất quán (kiểm bằng script):** 1 palette chung · 1 kích thước ô · cùng quy ước viền/đổ bóng · ảnh lệch bị loại.
- **Chấp nhận:** ít loại vật phẩm hơn, nhiều biến thể màu; một số món nhìn "thô". Đẹp tăng dần ở các đợt sự kiện.
- **Giấy phép:** kiểm từng pack (dùng thương mại, ghi công), lưu bản giấy phép vào repo; kiểm điều khoản công cụ AI trước khi dùng sản phẩm.
- **Dự phòng:** nếu pack không có nhân vật đủ lớp ⇒ giảm xuống 2 hướng + lật, ít frame.

## 8. Kiến trúc kỹ thuật (CTO quyết — R2)

```
Client: Phaser 3 + TypeScript — nhúng app HS (như Đấu Từ: ?nhung=1), khung ngoài dùng KhungHS
   │ WebSocket (JWT Supabase)
Game server: Colyseus (Node), 1 tiến trình 24/7
   ├─ room "pho_nho" / "pho_lon" / "quang_truong" : vị trí, emote (chỉ RAM)
   └─ room "nha_<id>" : người trong nhà
   │ gọi RPC bằng JWT của chính em (RLS áp dụng)
Postgres: tg_dat · tg_nha · tg_vat · tg_cay · tg_kho (sổ) · tg_sap · tg_danh_muc · tg_log
```

- Server game CHỈ giữ vị trí; mọi thứ có giá trị = `fn_tg_*`.
- Dữ liệu điều khiển bằng bảng `tg_danh_muc` — thêm nội dung không đụng code.
- Không gắn `mon` (dữ liệu không-học-tập), trừ cổng học dùng lượt học thật (đã có `mon`).

## 9. Mốc và cổng go/no-go (1 dev + AI)

| Mốc | Nội dung | Thời gian | Cổng qua mốc |
|---|---|---|---|
| **M0** | Spike: đi lại · thấy nhau · vào nhà (bot 100 client) | 2–3 tuần | 100 bot mượt; iPad gen 7 ≥ 30 FPS |
| **M1** | 2 phố + quảng trường · chọn đất · nhà 3 bậc · nội thất · thăm nhà | 5 tuần | 5 em thật chơi 1 buổi, không mất dữ liệu |
| **M2** | Cây · vật nuôi · bán nông sản (kiếm xu, có trần) · cửa hàng · sạp · tiêu xu · cổng học | 3–4 tuần | Bot kinh tế 60 ngày không lạm phát/nhân đôi |
| **M3** | Câu cá · bảng tin · sự kiện · nhà lớp · quà GV | 3–4 tuần | 1 lớp ≤15 em chơi 2 tuần liền |
| **M4** | Chặn/báo cáo · giới hạn giờ · báo cáo PH · mở theo khối | 3 tuần | 0 lỗi mất đồ; soát kinh tế |
| **Tổng** | | **~16–19 tuần** | |

- **Chỉ bắt đầu M1 khi:** có ≥4–6 tuần số liệu app sau release 10/10 (mốc 0 = 10/10; đo mỗi thứ Hai bằng `scripts/do-gan-bo-app.mjs`)
  **và** vòng lặp BK World bản online đã chạy với 5–10 em thật.

---

# PHẦN B — BÀN SAU (CTO điền mặc định, Thùy sửa)

- Giá đất/nhà/nội thất/hạt giống · số loại cây, cá, vật nuôi · giá đồ so với thu nhập nông trại/tháng · mục tiêu tỉ lệ xu tiêu/kiếm.
- Kích thước phố, số lô, số nhà tối đa/phố · luật thu hồi đất khi nghỉ.
- Danh mục câu soạn sẵn + emote (chung nguồn với `the_gioi_danh_muc`).
- Lịch sự kiện (tuần/tháng) · quà GV.
- Giới hạn phút/ngày.
- Tên game.

# PHẦN C — CHƯA CHỐT (cần CEO)

1. **Nhúng trong app HS** (đề xuất) hay trang riêng?
2. **Cổng học:** mua hạt/năng lượng bằng điểm học tập (như BK World) hay V1 chưa cần?
3. ~~Quan hệ với BK World~~ → **GỘP tất cả game vào Làng BK** (CEO chốt 12/10): nông trại, thú, ấp trứng là hoạt động bên trong Làng.
4. Tên game.

---

# PHẦN D — THIẾT KẾ GAME (CTO đề xuất 12/10 · CEO chưa duyệt · KHÔNG gồm kinh tế/kỹ thuật/art)

> Thùy 12/10: "kinh tế tính sau, cần design game trước". Phần này chỉ trả lời: **em chơi cái gì, cảm thấy gì, mỗi ngày làm gì**.

## D1. Trải nghiệm cốt lõi

**Một câu:** *"Làng nhỏ của lớp em — nhà em ở đó, bạn em ở đó, mỗi ngày ghé 10–15 phút để chăm nhà, câu cá, thăm bạn và khoe."*

**Ba trụ cột (mọi tính năng phải phục vụ ≥1):**
1. **Nhà của em — khoe được.** Em tự sắp, tự chọn; bạn thấy và khen.
2. **Có bạn ở đó.** Thấy nhau đi lại, ngồi cạnh nhau, thăm nhà, cùng câu cá.
3. **Mỗi ngày một ít.** Luôn có 3–4 việc nhỏ làm trong 10–15 phút; bỏ vài ngày không bị phạt.

**Cảm giác:** ấm, thong thả (cozy). **Không có thua, không có "chết", không có áp lực đua.** Đua/thi đấu nằm ở một toà nhà riêng (Đấu trường), em muốn mới vào.

**Khác Stardew:** không cốt truyện, không hang mỏ, không thể lực cứng; sự "sâu" đến từ bạn bè thật.
**Khác Roblox (cái em yêu):** em *sắp đặt* nhà/phòng của mình (UGC nhẹ, không script), người khác vào xem được.

## D2. Không gian

```
                    ┌───────────── QUẢNG TRƯỜNG (chung) ─────────────┐
                    │ Bảng tin · Đài phun nước · Sân sự kiện · Cổng   │
                    │ ĐẤU TRƯỜNG · Chợ phiên (cuối tuần)              │
                    └───────┬─────────────────────────────┬──────────┘
                            │                             │
                  ┌─────────┴────────┐          ┌─────────┴─────────┐
                  │ PHỐ NHỎ (K4–5)   │          │ PHỐ LỚN (K6–8)    │
                  │ nhà HS · nhà lớp │          │ nhà HS · nhà lớp  │
                  │ hồ nhỏ · công viên│          │ hồ lớn · công viên│
                  └─────────┬────────┘          └─────────┬─────────┘
                            └──────── RỪNG (khám phá, chung) ───────┘
```

| Nơi | Là gì | Làm gì ở đó |
|---|---|---|
| **Nhà em** (ngoài + trong) | Mảnh đất riêng: sân + ruộng nhỏ + chuồng; bên trong 1–2 phòng | Trồng, nuôi, sắp đồ, ấp trứng, mời bạn vào |
| **Phố** | Đường có nhà bạn, tiệm tạp hoá, hồ, ghế đá | Đi dạo, thăm nhà, câu cá, ngồi cùng bạn |
| **Nhà lớp** | Một ngôi nhà chung của lớp (mọi lớp có) | Xem thành tích lớp, trang trí chung, mục tiêu tuần |
| **Quảng trường** | Nơi hai phố gặp nhau | Sự kiện, chợ phiên, bảng tin, vào Đấu trường |
| **Rừng** | Khu hoang chung | Khám phá, bắt thú (gộp BK World) |

Một khu **nhỏ vừa đủ thấy 15–25 người cùng lúc**, không rộng ra (vắng thì trông trống).

## D3. Vòng chơi

**Mỗi phiên (10–15 phút):**
1. **Về nhà** (2–3'): thu hoạch, tưới, cho thú ăn, nhặt trứng.
2. **Ra phố** (5'): thấy ai đang online, chào bằng emote, ghé nhà bạn, giúp tưới hộ, để lại lời nhắn soạn sẵn.
3. **Một hoạt động chọn** (5'): câu cá · khám phá Rừng · trang trí nhà · làm nhiệm vụ làng.
4. **Khoe** (1'): đặt cá hiếm/đồ mới lên "phòng khoe", hoặc lên bảng tin.

**Mỗi tuần:** nhiệm vụ chung cả lớp → mở đồ cho nhà lớp · sự kiện cuối tuần ở quảng trường · lên bậc nhà.
**Mỗi mùa:** đồ/cá/thú theo mùa mới, đổi trang phục làng.

## D4. Các hệ thống (thiết kế, chưa số liệu)

**1. Nhân vật & thấy nhau**
- Chọn kiểu (tóc, áo, màu) lúc đầu, đổi được; tên luôn kèm lớp.
- **Chạm là đi** (tự tìm đường). Thấy bạn đang *làm gì* (đang câu, đang tưới, đang ngồi).
- **Emote bánh xe 8 ô** + câu soạn sẵn; không gõ chữ.
- **Ngồi cùng nhau:** ghế đá/ghế nhà, hai người ngồi cạnh nhau hiện biểu tượng "bạn bè".
- Thú đi cùng (1 con) — người khác nhìn thấy.

**2. Nhà** *(trọng tâm của "khoe")*
- Chế độ **Sắp đặt:** đặt, xoay, cất đồ trên lưới; đổi sàn/tường.
- **Phòng khoe:** một bức tường/kệ trưng bày huy hiệu, cá hiếm, thú hiếm, ảnh thành tích.
- **Sổ khách:** bạn ghé thăm để lại 1 lời chào soạn sẵn + icon; em xem "hôm nay ai ghé".
- Khách **chỉ được ngồi/đứng/xem**, không đụng đồ.
- Nhà lớn dần theo bậc (3 bậc); mỗi bậc thêm chỗ và phòng.

**3. Ruộng & vật nuôi**
- Gieo → tưới → thu, lớn theo ngày. Vài loại cây, 2–3 vật nuôi nhỏ.
- **Giúp bạn:** sang nhà bạn tưới hộ (kết nối xã hội hơn là sản xuất).
- Không héo chết (bỏ vài ngày chỉ "ngủ", không mất cây).

**4. Câu cá** *(cảm giác "đã tay" chính)*
- Chọn chỗ nước (hồ phố, hồ rừng, suối), thả phao, **chờ → cá cắn → bấm đúng nhịp**.
- Cá theo giờ/mùa/nơi; có **cá khổng lồ** (kỷ lục lớp, hiện ở nhà lớp).
- **Sổ cá** theo bộ (gần đủ thì muốn đủ).
- Câu cạnh bạn: thấy phao của nhau; khoe cá lên bảng tin.

**5. Thú & khám phá** *(gộp BK World)*
- Rừng có thú hoang; bắt bằng bóng (cảm giác "ném" như bản thử), mang về nhà.
- Lai hai thú → trứng → ấp trong nhà → nở thú mới (công thức, shiny/alpha như BK World).
- Thú đi dạo quanh nhà em, và đi cùng em ra phố.

**6. Sưu tầm**
- 4 sổ: **cá · thú · đồ nhà · khách**. Mỗi sổ chia bộ nhỏ để thấy "gần đủ".
- Mục tiêu: khoe bộ hoàn chỉnh.

**7. Nhiệm vụ & sự kiện**
- **Bác Hai (NPC bảng nhiệm vụ)**: 3 việc nhỏ mỗi ngày (câu 1 cá, tưới nhà bạn, ghé 2 nhà).
- **Mục tiêu tuần của lớp:** cả lớp góp (số cá, số lượt ghé…) → mở đồ nhà lớp.
- **Sự kiện hẹn giờ:** đêm câu cá, chợ phiên, lễ theo lịch.
- **Đấu trường:** toà nhà ở quảng trường (chế độ học/đấu đã có).

**8. Xã hội ngoài đời** *(lợi thế BK)*
- GV chiếu **nhà lớp** lên TV đầu buổi.
- GV "thả quà" xuống quảng trường cho cả lớp.
- Thành tích học (Nhất buổi, chuỗi) thành **đồ trang trí** nhà lớp.

## D5. Màn hình & điều khiển (iPad/PC ngang, khối 4–8)

- **HUD gọn, icon trước chữ:** góc trái = avatar + tên + lớp · góc phải = thông báo · dưới = **túi 5 ô** + nút Emote + nút Về nhà + nút Bản đồ.
- **Chạm vào vật → bong bóng hành động** (Tưới / Vào / Ngồi / Câu).
- Ít chữ, mức đọc lớp 4; mọi hành động có icon + màu.
- Có **nút Về nhà** luôn thấy.

## D6. Người chơi mới — 10 phút đầu

1. Chọn nhân vật → được **một mảnh đất + nhà bậc 1**.
2. Bác Hai dẫn: **gieo 1 hạt → tưới → câu 1 con cá → đặt 1 món đồ vào nhà.**
3. Tự động đưa **sang nhà một bạn cùng lớp** chào bằng emote.
4. Cuối: "Mai quay lại thu hoạch nhé!" (hẹn ngày mai).
Mục tiêu: trong 10 phút em **có nhà của mình + thấy một người thật**.

## D7. Cố ý KHÔNG làm (V1)

Cốt truyện dài · hẹn hò/NPC sâu · chiến đấu/boss · hang mỏ · chế tác nhiều tầng · chat gõ tự do · tặng đồ trực tiếp · đua xếp hạng trong làng (đã có ở Đấu trường) · thể lực cứng · cây chết/phạt khi vắng.

## D8. Câu thiết kế còn mở (chờ CEO)

1. **Ai thấy nhà ai?** Chỉ bạn bè + cùng lớp, hay cả khối, hay mọi người trong phố?
2. **Thú đi theo có hiện cho mọi người không**, hay chỉ bạn bè?
3. **Phòng khoe:** em tự chọn hiện gì, hay hệ thống chọn thứ hiếm nhất?
4. **Nhiều phòng/tầng** ở bậc nhà cao, hay chỉ rộng ra một phòng?
5. **Ngày/đêm theo giờ thật** hay theo chu kỳ riêng ngắn hơn?
6. **Có "thời tiết"** (mưa, tuyết) ở V1 hay để sau?
7. **Nhà lớp:** GV hay HS quyết định trang trí chung?

---

## D9. PHỐ, BIỂN, KIẾN TRÚC (Thùy 12/10 — "phải giống một con phố; nhà ai phải có biển; nhiều loại kiến trúc, nhiều cỡ để phân biệt nhà ai to đẹp")

> Mục này thay các chỗ nói chung chung "lô đất, nhà 3 bậc" ở D2/D4.

**Nguyên tắc:** nhìn từ xa phải đọc được *"nhà ai, to hay nhỏ, đẹp hay thường"* — như đi trên phố thật. **Mặt tiền là thứ được khoe.**

| Yếu tố | Thiết kế |
|---|---|
| **Con phố** | Một đường chính có nhà hai bên, số nhà liên tục; **mỗi lớp một dãy** (bạn cùng lớp ở sát nhau, "dãy 7A1"). Có ngõ nhỏ, ghế đá, đèn đường, cây |
| **Biển nhà** | Mọi nhà BẮT BUỘC có biển: **tên chủ + lớp** (hoặc mã HS) + **tên nhà** chọn từ kho soạn sẵn (không gõ tự do) + biểu tượng + khung biển |
| **Biển nâng cấp** | Khung biển đổi theo thành tích/bậc (gỗ → đồng → bạc → vàng); gắn được 1–3 huy hiệu hiếm lên biển; có bảng "số lượt ghé" |
| **Kiến trúc** | Nhiều **kiểu** (nhà mái ngói, nhà ống phố, nhà gỗ, nhà cây, biệt thự, nhà kính, lâu đài mini…) — kiểu mới mở theo thành tích/mùa/sự kiện |
| **Cỡ** | Lô **nhỏ · vừa · lớn · đại**; khác nhau bởi **số tầng, số gian, sân, vườn, cổng**. Nhà đại thấy từ cuối phố |
| **Trang trí mặt tiền** | Đèn lồng, hoa, hàng rào, cổng, cờ, mái hiên, bảng khuyến mãi… (đây là nơi "to đẹp" phân hoá) |
| **Nhà nổi bật** | Nhà được khen nhiều trong tuần: có đèn/pháo hoa nhẹ, và lên "**Nhà của tuần**" ở quảng trường |
| **Skyline** | Quảng trường nhìn xuống hai phố: nhà to hiện rõ như thành phố có toà cao |

**Khoe là được "nhìn thấy khi đi ngang"**, không chỉ khi bước vào. Vào nhà là tầng khoe thứ hai (phòng khoe, sổ khách).

**Ràng buộc thiết kế (không phải kinh tế):** "to/đẹp" nên là **dấu của sự cố gắng** (học, chăm chỉ, sưu tầm) chứ không chỉ của "ai có nhiều"; có kiểu nhà **nhỏ mà đẹp** để em nhỏ/ít chơi vẫn tự hào (đã có phản ví dụ Prodigy: đồ nhìn thấy được chia HS thành hai tầng lớp).

## D10. 2D hay 2.5D? (CEO đang cân nhắc — CTO phân tích, CHƯA chốt; §7 "pixel" tạm chờ)

Chữ "2.5D" gộp hai thứ khác nhau, nên tách ra:

| | **A. 2D nhìn chếch (kiểu Stardew)** | **B. 2D mặt tiền ngang (phố cuộn)** | **C. 2.5D = 3D low-poly/voxel, camera chếch cố định** |
|---|---|---|---|
| Hình dung | Nhìn từ trên xuống nghiêng, thấy mặt tiền + mái | Con phố nhìn thẳng, đi ngang trái–phải, nhà liền kề | Khối ghép (giống Roblox/Minecraft), camera cố định nghiêng ~45° |
| Đọc biển + mặt tiền | Tốt | **Tốt nhất** | Tốt (biển quay về phía camera) |
| Đọc "to nhỏ" | Tốt | Rất tốt (cao/rộng thấy ngay) | Tốt |
| Nhiều kiểu kiến trúc | Phải vẽ từng kiểu hoặc ghép module sprite | **Ghép module (tầng+mái+cửa+biển) bằng code** → vô hạn biến thể, rẻ | **Ghép khối bằng code** → vô hạn biến thể, rẻ, không cần hoạ sĩ |
| Nội thất trong nhà | Lưới top-down | Cắt ngang như phòng Habbo | Lưới 3D, cần camera trong nhà |
| Art khi không thuê freelance | Pack + AI, phải đồng bộ | Pack + code ghép, dễ nhất | **Code sinh hết** (như thú đã làm bằng code) |
| Nhất quán với BK World hiện có | Phải làm lại thú/cây | Phải làm lại | **Tái dùng thú, cây, ruộng, hoạ cảnh nở (đã three r186)** |
| Cảm giác "Roblox" HS thích | Thấp | Thấp | **Cao** |
| Hiệu năng iPad gen 7 | Nhẹ nhất | Nhẹ nhất | **Rủi ro** — phải đo; đã có luật "bản Nhẹ" |
| Độ khó dựng | Thấp | Thấp | Vừa (camera, chọn vật, sắp đặt 3D) |

**Khuyến nghị CTO: C (3D low-poly, camera chếch cố định)**, vì ba lý do:
1. **Nhà nhiều kiểu + nhiều cỡ** — đúng điều bạn muốn — là bài toán *ghép khối* mà code làm tốt, không cần hoạ sĩ.
2. **Tái dùng tài sản BK World** (thú làm bằng code, ruộng, hoạ cảnh) thay vì làm lại bằng pixel.
3. **Gần Roblox hơn** — thứ HS đã thích.

**Rủi ro cần đo TRƯỚC khi chốt (cổng go/no-go của M0):** cảnh ~60 nhà + ~25 avatar + thú phải chạy **≥30 FPS trên iPad gen 7** ở bản Nhẹ, và tải trang < vài giây. **Nếu trượt ⇒ lùi về B** (2D mặt tiền ngang, nhà ghép module sprite) — vẫn giữ đủ ý "phố có biển, nhà to nhỏ".

**Không chọn A** vì vừa không rẻ như B vừa không tái dùng được như C.

**D10b. Thêm lựa chọn D — "3D đầy đủ" (Thùy 12/10 "hoặc 3D"):** camera xoay tự do, góc nhìn người thứ ba như Roblox. Cùng bộ khối/asset với C, chỉ khác camera + điều khiển.
- Được: cảm giác "thế giới thật" nhất; nhìn nhà từ mọi phía (mặt tiền, sân sau).
- Mất: điều khiển khó hơn với lớp 4–5 trên iPad (xoay + đi); mọi mặt nhà phải đẹp (không chỉ mặt tiền); che khuất (nhà to che nhà nhỏ); tải iPad gen 7 nặng hơn; biển phải đọc được từ nhiều hướng.
- **Đề xuất trung gian:** làm C trước, camera **xoay 4 hướng + zoom** (nút xoay, không kéo tự do). Cùng asset ⇒ nâng lên D sau nếu em thích, không làm lại.
