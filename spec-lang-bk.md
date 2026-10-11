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

## 5. Kinh tế xu — vòng khép kín kiếm ⇄ tiêu (CEO chốt 12/10)

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
