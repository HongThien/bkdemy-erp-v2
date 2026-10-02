# Đơn đặt hàng ChatGPT — Style "Khối vuông" (cảm hứng Minecraft) cho app HS

> **Soạn 01/10/2026** theo yêu cầu Thùy: *"dựa vào chủ đề game anime làm một chủ đề thứ 2 tương tự, là chủ đề về minecraft"*.
> - **Thay Đơn 2 cũ** ("Lớp 6–8 · Khối vuông" trong `DON-HANG-SKIN-HS.md`, soạn 28/09 theo khuôn zip, CHƯA gửi) — đừng gửi bản cũ.
> - **Khuôn = y như style Anime RPG đã chạy:** ảnh toàn cảnh duyệt trước → DỪNG chờ Thùy → từng hình riêng, mỗi lượt đúng 1 hình.
> - Kế hoạch dựng code: `spec-giao-dien-hs.md` §10 · luật 1 style gồm gì / thêm style thế nào: `design/STYLE-HS.md`.
> - Ảnh tham chiếu (đã lưu sẵn): `design/handoff/hs-skin-khoi-v1/reference/`.
>
> | Đơn | Nội dung | Số lượt vẽ | Khi nào gửi |
> |---|---|---|---|
> | **K1** | Màn chính + bộ hình của style: 3 nền × 2 khổ · 2 nhân vật · 15 icon ô · 2 icon banner · 2 trang trí | 4 ảnh toàn cảnh + 27 hình | Gửi được ngay (ChatGPT vẽ song song) |
> | **K2** | Bản đồ phiêu lưu + quái vật (bản khối vuông của Đơn 6 RPG) | 1 ảnh toàn cảnh + 40 hình | Sau khi K1 #01 được duyệt |
>
> **Thùy chốt 01/10:** ① V1.0 (06/10) style thứ 2 vẫn là **Thị trấn** ⇒ Khối vuông là **style thứ 3, DỰNG CODE SAU V1** (đơn gửi ChatGPT lúc nào
> cũng được — hình về thì để đó) · ② hình gamification (huy hiệu · biểu tượng bậc · khung avatar · icon nhiệm vụ) **giữ 1 bộ chung** mọi style ⇒
> không nằm trong đơn này · ③ **chưa cần bản tối** ⇒ style chỉ có chế độ sáng.

---

## ✅ KIỂM HÀNG 03/10 — 72 hình về 02–03/10 (tên "ChatGPT Image …", ở GỐC `bk-ui-src/`) ⇒ Claude nhận diện bằng mắt + đổi tên

Đã chuyển vào `design/bk-ui-src/khoi/` (K1) · `design/bk-ui-src/khoi/phieu-luu/` (K2), nhật ký đổi tên `khoi/_doi_ten.log.txt`. Ảnh gốc ngoài git ⇒
**Thùy cất lên Drive** như bộ gami.

| Đơn | Đã về | THIẾU | Ghi chú |
|---|---|---|---|
| **K1** | **30/31** — ⏳ NỢ #29, Thùy vẽ bù 04/10: 4 ảnh toàn cảnh · 6 nền (anh đào · hồ rừng · tuyết × ngang/dọc) · 2 nhân vật · 15 vật phẩm ô · lịch · góc dây leo + đèn lồng · gạch khối cỏ | **#29 `khoi_b_kiem_tra_lai`** (banner bài kiểm tra lại) | Cuốc + sách-bút lông vẽ 2 lần (00:31 và 17:37) ⇒ dùng bản 17:37 (cùng lượt với cả bộ, cùng cỡ điểm ảnh), bản đầu cất `khoi/_thua/`. Banner kiểm tra lại đang TẮT trong app (`RETEST_BAT = false`) ⇒ thiếu #29 KHÔNG chặn dựng style, vẽ bù lúc nào cũng được |
| **K2** | ✅ **41/41**: ảnh toàn cảnh bản đồ · 8 vùng đất · 8 đảo · nền thế giới · 16 quái · 4 boss · cờ · rương · cổng | — | Bọ giáp (#31) bổ sung 03/10 01:21: giáp màu ĐỒNG thay vì xanh lục như đơn — nhận, vì hình bóng khác hẳn các con khác |

Chất lượng: đạt — nền đặc đúng khổ (ngang 1672×941, dọc 941×1672), vật phẩm / nhân vật / quái / đảo nền trong suốt thật, sprite pixel cùng cỡ,
không thấy hình chép của Minecraft (nhân vật không giống Steve/Alex, không mob của game). Ảnh toàn cảnh #01 bám sát bố cục màn chính hiện tại.

**Đơn bổ sung — dán vào ĐÚNG context ChatGPT đã vẽ đơn đó (giữ phong cách đã duyệt):**

K1 (context vẽ màn chính):
```
BỔ SUNG — bạn còn thiếu 1 hình trong danh sách. Vẽ đúng hình dưới, vẫn luật cũ: ĐÚNG 1 HÌNH, dòng đầu ghi số + tên file, cùng cỡ điểm ảnh,
cùng hướng sáng trái-trên, cùng độ chi tiết với #13–#28 đã vẽ.
   #29 khoi_b_kiem_tra_lai — [sprite pixel 16×16 phóng to] TỜ GIẤY có dấu tích + 1 bút lông, viền ánh HỒNG nhạt quanh tờ giấy.
       Vuông 1254×1254, nền TRONG SUỐT thật, vật ở giữa ~80% khung, không chữ/số, không ô túi đồ phía sau.
```

K2 (context vẽ bản đồ + quái):
```
BỔ SUNG — bạn còn thiếu 1 con quái (vẽ ma lửa xong là bỏ qua con này). Vẽ đúng hình dưới, vẫn luật cũ: ĐÚNG 1 HÌNH, dòng đầu ghi số + tên file,
cùng phong cách với #25–#30 đã vẽ.
   #31 quai_bo_giap — bọ cánh cứng khối: giáp lưng xanh lục ánh kim, 1 sừng nhỏ, mắt to dễ thương, 6 chân khối ngắn. 1024×1024, nền TRONG SUỐT,
       toàn thân, giữa khung ~75%, quay 3/4 về người xem, tư thế sẵn sàng chiến đấu vui nhộn. Màu chủ đạo khác các con đã có.
```

---

## 0. Quyết định thiết kế (Claude đề xuất 01/10 — Thùy bác chỗ nào thì sửa trước khi gửi)

| # | Vấn đề | Chọn | Vì sao |
|---|---|---|---|
| 1 | Tên style trong app | **"Khối vuông"** (id `khoi`), dòng phụ "giống: Minecraft · Roblox" | Minecraft là thương hiệu của Mojang/Microsoft. App chỉ nêu tên để so sánh, như RPG ghi "Genshin · Star Rail" |
| 2 | Mức "giống Minecraft" | **Thùy 01/10: giống Minecraft NHẤT CÓ THỂ, từ khung cảnh tới vật phẩm, mà không vi phạm bản quyền** ⇒ giống tối đa về **CÁCH VẼ** (khối lập phương phủ texture pixel 16×16, vật phẩm là sprite pixel như ô túi đồ, giao diện kiểu túi đồ xám vát), KHÔNG chép **TỪNG HÌNH** | Cách vẽ (pixel art, voxel, ô túi đồ) không ai giữ bản quyền — Terraria, Stardew và hàng trăm game khối vuông đều dùng. Cái bị bảo vệ là từng hình cụ thể: texture/sprite vẽ y nguyên, nhân vật & sinh vật riêng (Steve, Creeper, Sniffer…), logo, font, vài đồ chỉ Minecraft có (bàn chế tạo, TNT…). Danh sách ĐƯỢC / CẤM nằm trong PHONG CÁCH CHUNG |
| 3 | Sáng hay tối | **Style SÁNG** (chỉ chế độ sáng) — Thùy 01/10: chưa cần bản tối · **nền mặc định = thung lũng hoa anh đào lúc hoàng hôn** (ảnh Thùy chọn) | RPG chỉ có nền tối ⇒ 2 style phủ 2 nhu cầu. Ảnh mẫu Thùy gửi là ban ngày. Bản đêm (hang mỏ) để sau |
| 4 | Font | Tiêu đề **Handjet** đậm (chữ pixel) · chữ thường **Baloo 2** | Đơn 2 cũ ghi "font pixel mất dấu tiếng Việt". Thử thật 01/10: Press Start 2P, Pixelify Sans, Silkscreen mất dấu; **Handjet, VT323, Bungee đủ dấu**. Handjet ra chất pixel mà vẫn dễ đọc |
| 5 | Dáng thẻ / nút | **Kiểu TÚI ĐỒ game khối**: tấm xám đá vát nổi (sáng trên-trái, tối dưới-phải), viền đen 2px, ô con lõm xám đậm, nút xanh cỏ chữ trắng bóng, thanh tiến độ = thanh kinh nghiệm xanh lá chia vạch | Giao diện túi đồ là dấu hiệu nhận ra "game khối" mạnh nhất sau khung cảnh. Hình chữ nhật vát + ô lõm là hình học cơ bản, không phải tài sản riêng |
| 6 | Nhân vật | 2 nhà thám hiểm **tỉ lệ người khối** (đầu lập phương, thân + tay chân khối, mặt pixel) với **trang phục tự thiết kế** + bạn đồng hành (cáo / cú) | Hợp đồng style có chỗ `nhanVat {nam, nu}`. Tỉ lệ người khối là kiểu chung của thể loại; cái phải khác là "skin": không áo xanh ngọc + quần xanh dương + tóc nâu (Steve), không áo xanh lá + tóc cam (Alex) |
| 8 | Vật phẩm (icon ô) | **Đồ cầm tay = sprite pixel 16×16 phóng to** (như vật phẩm trong ô túi đồ) · **đồ dạng khối = khối 3/4 phủ texture pixel** (rương, giường, cửa) · chọn đồ vật đời thường quen thuộc của thể loại: sách, sách + bút lông, đèn lồng, rương, cuốc, la bàn, đồng hồ, bản đồ, ngọc, khiên, thang, giường | Đúng cách Minecraft vẽ đồ ⇒ HS nhìn là thấy "Minecraft"; nhưng mỗi sprite tự vẽ, không vẽ lại điểm ảnh y hệt |
| 7 | Bản đồ + quái (K2) | **CÙNG tên vùng đất + tên quái với Đơn 6 RPG**, chỉ khác hình | DB gán `biome` / `loai_quai` cố định cho từng chủ đề / cụm ⇒ đổi style chỉ đổi thư mục hình (`spec-v1-app-hs.md` §4.4) |

---

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` → dán khối **PHONG CÁCH CHUNG — KHỐI VUÔNG** (ngay dưới) → dán nguyên khối **ĐƠN ĐẶT HÀNG**.
2. Đính kèm (tất cả ở `design/handoff/hs-skin-khoi-v1/reference/`, riêng ảnh RPG ở `design/bk-ui-src/`):
   - `khong_khi_anh_dao.jpg` — **TRANH NỀN CHÍNH** Thùy chọn 01/10 (thung lũng hoa anh đào lúc hoàng hôn): lấy không khí, màu, ánh sáng,
     bố cục cảnh. Không chép nguyên cảnh, **không vẽ con vật khối trong ảnh** (đó là sinh vật Sniffer của Minecraft).
   - `khong_khi_ho_rung.jpg` — không khí cho nền thứ 2 (hồ trong, rừng khối, nắng ban ngày). Không chép cảnh.
   - `bo_cuc_home_ipad.jpg` · `bo_cuc_home_dt.jpg` · `bo_cuc_nhiem_vu_ipad.jpg` — chụp màn code hiện tại (style RPG), lấy **BỐ CỤC + NỘI DUNG**.
   - `design/bk-ui-src/Nền app HS cấp 3_11.png` — ảnh toàn cảnh style RPG Thùy đã duyệt, để ChatGPT thấy **mức hoàn thiện** cần đạt.
3. ChatGPT vẽ **#01** rồi DỪNG ⇒ Thùy duyệt phong cách. Chưa ưng thì sửa #01; ưng rồi mới gõ "tiếp".
4. **Tải về theo ĐÚNG thứ tự #**, không cần đổi tên (về tên "ChatGPT Image …" cũng được — Claude nhận diện bằng mắt, giờ tải giúp đối chiếu):
   K1 → `design/bk-ui-src/khoi/` · K2 → `design/bk-ui-src/khoi/phieu-luu/`. Hình nào bắt vẽ lại thì ghi chú số # của hình đó.
   *(Bài học 01/10: 72 hình gamification về tên mặc định, 2 hình Zeus đảo thứ tự — gán theo vị trí là gắn nhầm.)*
5. Xong nhóm nào (B, C, D…) báo Claude kiểm nhóm đó, đừng đợi đủ cả đơn.
6. Ảnh gốc KHÔNG lên git (`design/README.md`): Thùy cất bản gốc lên Drive, Claude nén bản app dùng vào `public/bk-ui/hs/skin/khoi/`.

---

## PHONG CÁCH CHUNG — KHỐI VUÔNG (dán kèm MỌI đơn)

```
PHONG CÁCH CHUNG — style "Khối vuông" của app học sinh BK Academy (trung tâm dạy thêm Toán, học sinh lớp 3–12)
MỤC TIÊU:    nhìn vào là thấy NGAY "thế giới Minecraft" — từ khung cảnh, vật phẩm tới giao diện — nhưng MỌI HÌNH ĐỀU TỰ VẼ.
             Giống ở CÁCH VẼ (khối lập phương, texture pixel, sprite pixel, giao diện túi đồ), không chép TỪNG HÌNH của game nào.
Không khí:   game khối vuông chạy shader đẹp. Cảnh CHÍNH = THUNG LŨNG HOA ANH ĐÀO LÚC HOÀNG HÔN (ảnh khong_khi_anh_dao.jpg): cây anh đào
             khối tán hồng, cánh hoa hồng pixel bay, trời pastel hồng-cam-tím, nắng chiều vàng hồng, sông xanh uốn qua thung lũng, đồi cỏ
             khối xanh rải hoa hồng. Ánh sáng shader: nắng ấm, bóng đổ mềm, nước phản chiếu, sương nhẹ ở xa.
KHỐI & CẢNH: MỌI thứ dựng từ KHỐI LẬP PHƯƠNG ĐỀU NHAU 1×1, mỗi mặt phủ TEXTURE PIXEL 16×16 (điểm ảnh to, rõ, không mịn) TỰ VẼ:
             · khối cỏ: mặt trên xanh, mặt bên đất nâu, mép cỏ rủ xuống mặt bên · đất lấm chấm · đá xám lốm đốm · gỗ thân cây vân dọc
             · ván gỗ sọc ngang · lá cây = khối thưa có lỗ thủng · khối lá anh đào hồng
             · hoa, cỏ cao, cây con = sprite PHẲNG cắm đứng (2 tấm bắt chéo chữ X) · nước trong suốt xanh có gợn · mây = khối dẹt phẳng trôi
             · mặt trời vuông · địa hình là BẬC THANG khối, không có dốc trơn, không bo cong.
VẬT PHẨM:    ① đồ CẦM TAY (sách, bút lông, bản đồ, la bàn, đồng hồ, cuốc, khiên, ngọc, đèn lồng, giấy…) = SPRITE PIXEL 16×16 PHÓNG TO,
               như vật phẩm nằm trong ô túi đồ: nhìn thẳng mặt; dụng cụ đặt CHÉO từ dưới-trái lên trên-phải; mỗi điểm ảnh là 1 ô vuông rõ;
               viền tối 1 điểm ảnh; mỗi màu 3–4 sắc độ; KHÔNG khử răng cưa, KHÔNG gradient mịn, KHÔNG bóng mềm.
             ② đồ DẠNG KHỐI (rương, giường, cửa, khối đèn) = khối 3D nhìn 3/4 từ trên (như khối hiện trong túi đồ), mặt phủ texture pixel 16×16.
ĐƯỢC giống:  cách vẽ khối + pixel · bố cục túi đồ / ô vật phẩm · loại đồ vật ĐỜI THƯỜNG (sách, đèn lồng, rương, cuốc, la bàn, đồng hồ, bản đồ,
             ngọc, khiên, thang, giường, cửa) · mặt trời vuông, mây khối, cây khối.
CẤM (bản quyền — có 1 thứ là hỏng cả hình):
             · chép Y NGUYÊN texture / sprite / điểm ảnh của Minecraft (mọi sprite PHẢI tự vẽ: hình dáng, màu, chi tiết khác)
             · nhân vật & sinh vật riêng của Minecraft: Steve, Alex, Creeper, Zombie, Skeleton, Enderman, Villager, Sniffer, Allay, Warden,
               Ghast, Iron Golem, slime khối xanh mặt đơn giản…
             · đồ chỉ Minecraft có: bàn chế tạo, bàn phù phép, TNT, ngọc Ender / mắt Ender, táo vàng, cổng Nether
             · logo / chữ "Minecraft", font Minecraft, giao diện y nguyên của game (thanh máu trái tim, thanh đói đùi gà, hotbar 9 ô ở đáy màn)
             · Roblox: logo, nhân vật mặc định. Học sinh nhìn ra là ĐÚNG đồ của game thì coi như hỏng.
Bảng màu:    hồng anh đào #f5a9c8 / #e57fa8 · trời hoàng hôn #f7c6a3 → #c9a7e8 · nắng #ffe9c7 · cỏ #6dbb45 / #3f7d26 · đất #8b5a2b
             · đá #8e8e8e / #5f5f5f · gỗ ván #b8945f / #8a6a3f · nước #2c8fd6 → #47c1c9 · ngọc xanh lục #37c25a · vàng #f2c94c
             · đỏ #e04b3c · GIAO DIỆN: xám túi đồ #c6c6c6 · vát sáng #ffffff · vát tối #555555 · ô lõm #8b8b8b · viền #1e1e1e
             · chữ tối #2b2b2b · chữ phụ #555555.
Thẻ (giao diện TÚI ĐỒ):
             tấm XÁM ĐÁ #c6c6c6 (~95% đục), góc VUÔNG, viền đen #1e1e1e 2px, VÁT nổi: cạnh trên-trái trắng 2px, cạnh dưới-phải xám đậm 2px.
             Ô con bên trong (ô vật phẩm, ô thông tin) = Ô LÕM xám đậm #8b8b8b, vát ngược (tối trên-trái, sáng dưới-phải), icon đặt giữa ô.
             Dải tiêu đề thẻ (khi có) = tấm ván gỗ pixel, chữ trắng có bóng đen 2px. Khung gần VUÔNG — KHÔNG thẻ dẹt trải ngang.
Nút:         nút chính = khối XANH CỎ #5fa83a vát nổi, chữ trắng có bóng đen 2px; nút phụ = khối xám #8e8e8e vát nổi, chữ trắng bóng. Bấm = lún.
             Thanh tiến độ = THANH KINH NGHIỆM: dải xanh lá sáng chia vạch đều, nền tối. Badge số = ô VUÔNG đỏ #e04b3c chữ trắng.
Chữ:         tiêu đề, tên ô, số, nút = font pixel Handjet đậm (đủ dấu tiếng Việt) · đề bài và đoạn văn dài = Baloo 2 (phải dễ đọc).
             KHÔNG chữ viết tay, KHÔNG Pacifico, KHÔNG Press Start 2P / Pixelify / Silkscreen (mất dấu). Chữ chính ≥ 15px ở điện thoại,
             ≥ 16px ở iPad; tiếng Việt đúng dấu. Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (vật phẩm, nhân vật, quái, nền) KHÔNG có chữ/số nào.
Thiết bị:    iPad NGANG 1180×820 (ảnh chính — làm khổ ngang trước) + điện thoại DỌC 430px. Màn được cuộn.
CẤM thêm:    khẩu hiệu động viên · chữ tiếng Anh trang trí · trái tim / vương miện / doodle trang trí · máu me, đáng sợ.

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#13 khoi_o_tu_luyen".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (15 vật phẩm, 2 nhân vật, các quái) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context này: giữ cỡ điểm ảnh, góc nhìn,
  nguồn sáng, độ chi tiết, chỉ đổi đồ vật.
```

---

## Đơn K1 — Màn chính + bộ hình của style

Đính kèm: 4 ảnh ở "Cách gửi" bước 2.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            style-khoi (màn chính + mọi hình của style "Khối vuông")
Mô tả:          App học sinh trung tâm dạy thêm BK Academy. Thêm style thứ 2 "Khối vuông" bên cạnh style "Anime RPG" đã có: em chọn style
                nào thì TOÀN BỘ app đổi theo (màn chính, mọi màn bên trong, popup). Bố cục giữ y như ảnh bo_cuc_* đính kèm (đó là style
                RPG hiện tại) — CHỈ đổi phong cách sang khối vuông theo PHONG CÁCH CHUNG.

MÀN CHÍNH khổ NGANG (iPad 1180×820) — đúng khối, đúng thứ tự như bo_cuc_home_ipad.jpg (chữ/số do code vẽ; ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Góc trên trái: TẤM TÊN (tấm túi đồ xám) = avatar VUÔNG trong ô lõm (2 chữ "MK") + "Nguyễn Minh Khang" + "HS0412 · 9A1 · Toán" + vạch
    ngăn + biểu tượng bậc rank nhỏ (khiên) + "Captain" + 2 sao.
  - Góc trên phải: nút "Hình nền" (icon bảng màu + chữ) · nút Hòm thư (badge 3) · nút "⋯".
  - Cột TRÁI ≈ 32%: NHÂN VẬT đứng (cao ≈ 80% màn, chân chạm mép dưới) + bạn đồng hành + BONG BÓNG THOẠI: "Hôm nay còn 2 nhiệm vụ đó!".
  - Cột PHẢI: "Chào Minh Khang!" chữ to 2 dòng →
      nhóm "HỌC TẬP": thanh chọn môn [Toán | KHTN] (Toán đang chọn) → thẻ ca bổ trợ "THỨ 5 01/10 · 17:30" / "Bổ trợ yếu · Toán" /
      "Phòng 204 · Cô Lan" + icon lịch → LƯỚI Ô 4 cột, mỗi ô: icon đặt GIỮA + tên + 1 dòng trạng thái + badge vuông đỏ:
        Tự luyện "Luyện theo dạng yếu" · Nhiệm vụ "Hôm nay còn 2 nhiệm vụ" (badge 2) · Rank "Captain ★★ · hạng 12/54" ·
        Thông tin học tập "Xem dạng đang yếu" · Sổ tay kiến thức "Tra lý thuyết & bài mẫu" · Làm đề thi thử "Sắp có" (ô KHOÁ, mờ) ·
        Bài tập được giao "2 bài chưa làm" (badge 2)
      → nhóm "GIẢI TRÍ": thẻ ngang "Thế giới BK" (icon + "Xem học sinh BK đang khoe gì nào!" + 2 dòng tin) → lưới ô: Thành tựu ·
        May mắn "Có 1 lượt quay!" (badge 1) · Ví xu "1.240 xu".
MÀN CHÍNH khổ DỌC (điện thoại 430px) — như bo_cuc_home_dt.jpg: hàng đầu (avatar · huy hiệu bậc · Hình nền · Hòm thư · ⋯) → "Chào Minh
  Khang!" → nhân vật thu nhỏ + bong bóng thoại → HỌC TẬP (môn · thẻ ca · lưới 4 cột ô nhỏ) → GIẢI TRÍ. Được cuộn.
MÀN CON 1 — Nhiệm vụ (iPad ngang) — như bo_cuc_nhiem_vu_ipad.jpg: 4 khối Chặng tháng · Hôm nay · Nhiệm vụ tuần (+ hàng 4 rương) ·
  Nhiệm vụ tháng, đúng chữ + số trong ảnh. Mục đích: chốt dáng THẺ / NÚT / THANH TIẾN ĐỘ cho mọi màn bên trong.
MÀN CON 2 — Làm bài (iPad ngang): đầu trang "Câu 3/10" + thanh tiến độ ô vuông · thẻ đề "Rút gọn biểu thức A = √48 − 2√27 + √75" ·
  4 đáp án A. 3√3  B. 2√3 (đang chọn)  C. √3  D. 0 · nút chính "Câu tiếp" + nút phụ "Câu trước". Bài thật của học sinh ⇒ nghiêm túc,
  gọn, dễ đọc (không trang trí rườm rà).

Biến thể:
  3 TRANH NỀN em tự chọn (ban ngày, phải khác nhau rõ từ xa):
    anh_dao : thung lũng hoa anh đào lúc hoàng hôn — đúng không khí ảnh khong_khi_anh_dao.jpg (Thùy chọn 01/10) — MẶC ĐỊNH
    ho_rung : hồ nước trong ven rừng khối ban ngày — không khí ảnh khong_khi_ho_rung.jpg
    tuyet   : vùng tuyết ban ngày — cây thông khối phủ tuyết, hồ băng, trời xanh nhạt
  2 NHÂN VẬT em tự chọn (KHÔNG gán theo giới tính), cùng phong cách, cùng tư thế đứng:
    nam : nhà thám hiểm khối vuông — tóc đen, áo khoác xanh rêu, khăn quàng cam, ba lô da, quần nâu, tay cầm ĐÈN LỒNG sắt phát sáng;
          bạn đồng hành = CÁO CON khối (khăn quàng nhỏ, đuôi cam-kem, tai to) ngồi cạnh chân.
    nu  : nhà thám hiểm khối vuông — tóc đen dài buộc thấp, mũ len xanh ngọc, áo len vàng nghệ dưới áo khoác nâu, quần xanh rêu đậm,
          tay ôm CUỐN SÁCH bản đồ; bạn đồng hành = CÚ MÈO trắng khối đậu trên vai.
    TỈ LỆ NGƯỜI KHỐI: đầu lập phương, thân hộp chữ nhật, tay chân hộp dài; toàn thân phủ texture pixel ("skin" tự vẽ); mặt pixel đơn giản,
    mắt có ánh sáng. "Skin" PHẢI khác Steve (áo xanh ngọc + quần xanh dương + tóc nâu) và Alex (áo xanh lá + tóc cam). Kín đáo, không vũ khí.

Phiên bản kit:  v3 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- VẬT PHẨM (icon ô, banner): vuông 1254×1254, nền TRONG SUỐT thật (không nền trắng, không ô caro giả), vật ở GIỮA chiếm ~80% khung,
  không chữ/số/badge, KHÔNG vẽ ô túi đồ phía sau (code tự vẽ ô). Đồ cầm tay = sprite pixel 16×16 phóng to (mọi điểm ảnh cùng cỡ, cạnh sắc);
  đồ dạng khối = khối 3/4 texture pixel. CẢ BỘ cùng cỡ điểm ảnh, cùng hướng sáng trái-trên, cùng độ chi tiết — đặt cạnh nhau như 1 túi đồ.
- NHÂN VẬT: dọc 1122×1402, nền TRONG SUỐT, TOÀN THÂN đứng thẳng nghiêng 3/4 về phía người xem, chân chạm mép dưới khung, bạn đồng hành
  nằm TRONG cùng hình.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG chữ. Cảnh chính (cây to, nhà, núi) dồn sang TRÁI (anh_dao: cây anh đào lớn bên trái,
  sông uốn từ giữa ra xa); 65% bên PHẢI là trời / mặt
  hồ / đồng cỏ SÁNG, ÍT chi tiết (để đặt thẻ lên, chữ tối phải đọc được).
- NỀN DỌC: 940×1672 (đúng 9:16), nền đặc, KHÔNG nhân vật. Cảnh chính ở 40% TRÊN; 60% DƯỚI phẳng, sáng dịu, ít chi tiết
  (anh_dao: tán anh đào + mặt trời hoàng hôn + sông ở trên; dưới là đồi cỏ xanh nhạt rải ít cánh hoa).
- TRANG TRÍ: góc 1254×1254 trong suốt (dây leo pixel chạy theo 2 cạnh vuông góc ở góc trên-trái, 1 ĐÈN LỒNG sắt pixel treo trên dây);
  gạch phân cách 1672×200 trong suốt (1 hàng khối cỏ nhìn ngang — mặt bên khối cỏ lặp lại, mảnh).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 khoi_man_chinh_ipad — màn chính khổ NGANG, nền anh_dao, nhân vật nam + cáo   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 khoi_man_chinh_dt   — màn chính khổ DỌC, nền anh_dao, nhân vật nu + cú
   #03 khoi_nhiem_vu_ipad  — màn Nhiệm vụ khổ ngang
   #04 khoi_lam_bai_ipad   — màn Làm bài khổ ngang
B. Nền:
   #05 khoi_bg_anh_dao_ngang · #06 khoi_bg_anh_dao_doc · #07 khoi_bg_ho_rung_ngang · #08 khoi_bg_ho_rung_doc
   #09 khoi_bg_tuyet_ngang · #10 khoi_bg_tuyet_doc
C. Nhân vật (vẽ đúng như trong #01 / #02 đã duyệt):
   #11 khoi_nv_nam · #12 khoi_nv_nu
D. Vật phẩm cho ô chức năng (mỗi ô 1 ĐỒ VẬT KHÁC NHAU; [sprite] = sprite pixel 16×16 phóng to · [khối] = khối 3/4 texture pixel):
   #13 khoi_o_tu_luyen      — [sprite] CUỐC CHIM đặt chéo: đầu sắt xám, cán gỗ nâu
   #14 khoi_o_nhiem_vu      — [sprite] SÁCH VÀ BÚT LÔNG: cuốn sách mở trang giấy kem + 1 bút lông vũ trắng cắm lọ mực
   #15 khoi_o_rank          — [sprite] KHIÊN gỗ viền sắt, giữa có ngôi sao vàng
   #16 khoi_o_thong_tin     — [sprite] TẤM BẢN ĐỒ giấy: địa hình xanh lá / sông xanh dương, 1 chấm đỏ đánh dấu
   #17 khoi_o_so_tay        — [sprite] CUỐN SÁCH bìa da nâu đóng, dây đánh dấu đỏ thò ra
   #18 khoi_o_thi_thu       — [khối] CÁNH CỬA SẮT có ổ khoá — tông XÁM, không nắng (ô đang khoá)
   #19 khoi_o_bai_tap_giao  — [sprite] CUỘN GIẤY buộc dây đỏ
   #20 khoi_o_cup           — [sprite] CÚP VÀNG 2 quai (dùng cho Thành tựu + Bảng xếp hạng)
   #21 khoi_o_may_man       — [khối] RƯƠNG GỖ mở hé, ánh vàng thoát ra (tự vẽ: ván gỗ + đai sắt + khoá tròn — không chép rương của game)
   #22 khoi_o_vi_xu         — [sprite] VIÊN NGỌC XANH LỤC cắt giác + 2 đồng xu vàng nhỏ
   #23 khoi_o_the_gioi      — [sprite] LA BÀN vỏ đồng, kim đỏ
   #24 khoi_o_tren_lop      — [sprite] BA LÔ vải xanh dương, quai da
   #25 khoi_o_et            — [sprite] ĐỒNG HỒ bỏ túi mặt vàng
   #26 khoi_o_btvn          — [khối] CÁI GIƯỜNG gỗ, chăn xanh dương, gối trắng
   #27 khoi_o_hoc_tu_dau    — [sprite] CÁI THANG gỗ
E. Vật phẩm cho banner:
   #28 khoi_b_lich          — [sprite] TỜ LỊCH giấy ghim trên tấm gỗ nhỏ, vài ô đánh dấu đỏ (thẻ ca bổ trợ)
   #29 khoi_b_kiem_tra_lai  — [sprite] TỜ GIẤY có dấu tích + bút lông, viền ánh HỒNG (banner bài kiểm tra lại)
F. Trang trí:
   #30 khoi_tt_goc          — góc dây leo pixel + đèn lồng sắt treo
   #31 khoi_tt_gach         — hàng khối cỏ nhìn ngang (gạch phân cách)

LUẬT RIÊNG:
  - Giữ nguyên danh sách ô, tên, thứ tự, số như mô tả. Không thêm tính năng, không thêm chữ.
  - Câu duy nhất có "giọng" = bong bóng thoại của nhân vật, phải có số thật.
  - Chữ trên nền ảnh / nền khối nhiều màu phải đọc được (chữ trắng có viền/bóng đen 2px, hoặc đặt trong tấm túi đồ xám).
  - Mọi vật phẩm / khối / nhân vật TỰ VẼ theo danh sách ĐƯỢC / CẤM ở PHONG CÁCH CHUNG — không chép sprite hay texture của game nào.

Bắt đầu với #01.
```

---

## Đơn K2 — Bản đồ phiêu lưu + quái vật (bản khối vuông của Đơn 6) — gửi SAU khi K1 #01 được duyệt

> App V1.0 đổi thành "Giải cứu thế giới — đánh quái vật" (`spec-v1-app-hs.md` §4): chủ đề = lục địa · chuyên đề = khu vực · dạng = màn đấu ·
> cụm = quái. Đơn 6 (`DON-HANG-SKIN-HS.md`) vẽ bộ này cho RPG. K2 vẽ **cùng bộ đó, cùng tên file** bằng khối vuông — DB gán vùng/quái
> cố định, đổi style chỉ đổi thư mục hình. Đính kèm thêm: #01 + 2 icon đã duyệt của K1 làm mẫu phong cách.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-khoi (bản đồ phiêu lưu + quái vật, style "Khối vuông")
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Mỗi chủ đề kiến thức là 1 vùng đất, mỗi dạng
                bài là 1 màn đấu, mỗi nhóm bài là 1 con quái. Học sinh làm đúng câu hỏi = tung đòn đánh quái.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     theo PHONG CÁCH CHUNG — KHỐI VUÔNG + hình đã duyệt đính kèm. Vùng đất dựng từ khối lập phương texture pixel 16×16
                y như cảnh K1. Quái = SINH VẬT KHỐI tỉ lệ hộp (đầu/thân/chân là các hộp, phủ texture pixel, mắt pixel) — đúng kiểu
                sinh vật game khối, nhưng LOÀI TỰ THIẾT KẾ, DỄ THƯƠNG – NGỘ NGHĨNH (học sinh lớp 3–12), KHÔNG ghê sợ, KHÔNG máu me.
                KHÔNG giống Creeper, Zombie, Skeleton, Slime, Enderman, Ghast, Sniffer, Allay… của Minecraft (vd slime ở đây là giọt
                thạch khối có tay nhỏ, đội lá, mắt to — không phải khối lập phương xanh mặt đơn giản).
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN ══
- NỀN VÙNG ĐẤT: ngang 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ, KHÔNG đường đi vẽ sẵn. Nhìn từ trên cao chéo (như bản
  đồ game), địa hình khối trải đều cả khung, nhiều khoảng trống bằng phẳng để đặt 6–10 điểm màn đấu. Hơi tối nhẹ ở viền.
- ĐẢO (bản đồ thế giới): 1024×1024, nền TRONG SUỐT, 1 hòn đảo khối nổi nhìn chéo từ trên, đúng vùng đất tương ứng.
- QUÁI: 1024×1024, nền TRONG SUỐT, toàn thân, giữa khung chiếm ~75%, quay 3/4 về người xem, tư thế sẵn sàng chiến đấu vui nhộn.
  Mỗi con 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt được.
- BOSS: như QUÁI nhưng to, oai hơn (vương miện / giáp / hào quang khối), vẫn dễ thương.
- KHÔNG chữ, số, logo, khung, nền phía sau quái.

══ DANH SÁCH (đúng thứ tự ưu tiên — hết thời gian dừng ở đâu cũng dùng được phần đã có) ══
A. Duyệt phong cách
   #01 Ảnh toàn cảnh iPad ngang: 1 màn bản đồ vùng rừng khối, 8 điểm màn đấu nối bằng đường đi, 3 điểm đã cắm cờ, 1 điểm đang sáng có
       1 con quái đứng trên, phần cuối bản đồ phủ sương mù; góc trái là nhân vật nhà thám hiểm (nam + cáo) của K1.   → DỪNG, chờ duyệt.
B. 4 vùng đất CẦN NHẤT
   #02 nen_vung_rung       — rừng khối cổ thụ, hồ nhỏ, nấm khối phát sáng
   #03 nen_vung_bang       — thung lũng băng tuyết khối, tinh thể băng xanh
   #04 nen_vung_nui_lua    — núi lửa khối, dòng dung nham cam, đá đen (vẫn tươi sáng, không u ám)
   #05 nen_vung_bien_dao   — quần đảo khối biển xanh ngọc, bãi cát, san hô khối
C. 8 con quái đầu tiên (mỗi con 1 hệ, sinh vật khối tự thiết kế)
   #06 quai_slime_la   (giọt thạch xanh lá đội lá)        #07 quai_slime_lua (giọt thạch cam đỏ, đốm lửa trên đầu)
   #08 quai_meo_bang   (mèo khối xanh băng, đuôi tinh thể) #09 quai_rua_da   (rùa khối mai đá rêu)
   #10 quai_cu_dem     (cú khối tím, mắt sao)              #11 quai_ca_bong  (cá nóc khối xanh biển, gai mềm)
   #12 quai_nam_ma     (nấm khối hồng tím, mũ chấm sáng)   #13 quai_chim_set (chim khối vàng, mào tia sét)
D. 2 boss
   #14 boss_rong_con       (rồng con khối có vương miện)   #15 boss_golem_pha_le (người khối bằng đá + pha lê)
E. Bản đồ thế giới
   #16 nen_the_gioi    — biển mây ban ngày nhìn từ trên cao, trống để đặt các đảo (ngang 1672×941, nền đặc)
   #17 dao_rung · #18 dao_bang · #19 dao_nui_lua · #20 dao_bien   (đảo khối nổi trong suốt, khớp 4 vùng ở B)
F. Mở rộng (làm nếu còn thời gian)
   #21 nen_vung_sa_mac · #22 nen_vung_dam_lay · #23 nen_vung_thanh_co · #24 nen_vung_troi_sao
   #25–#32 thêm 8 quái: quai_tho_gio · quai_be_nham · quai_sao_bien · quai_ech_doc · quai_dom_dom · quai_soi_bang · quai_bo_giap · quai_ma_lua
   #33 boss_phuong_hoang · #34 boss_bach_tuoc · #35 dao_sa_mac · #36 dao_dam_lay · #37 dao_thanh_co · #38 dao_troi_sao
G. Đồ vật nhỏ (trong suốt, 512×512)
   #39 co_chinh_phuc ([sprite] lá cờ cắm đất) · #40 ruong_khu_vuc ([khối] rương thưởng) · #41 cong_khu_vuc ([khối] cổng đá vào khu)

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

---

## Bảng đổi tên: file ChatGPT giao → file code (Claude làm, Thùy không cần làm)

| ChatGPT giao | Code dùng (`public/bk-ui/hs/skin/khoi/`) | Nén |
|---|---|---|
| #01–#04 `khoi_man_*` · `khoi_nhiem_vu_ipad` · `khoi_lam_bai_ipad` | `design/handoff/hs-skin-khoi-v1/reference/*.jpg` (ảnh chuẩn để dựng màn, không vào app) | JPG q85 |
| `khoi_bg_<nền>_ngang` · `khoi_bg_<nền>_doc` | `bg_<nền>_ngang.jpg` · `bg_<nền>_doc.jpg` | JPG ~q80, ≤ 1672px |
| `khoi_nv_nam` · `khoi_nv_nu` | `nv_nam.png` · `nv_nu.png` | PNG 640×800 |
| `khoi_o_<ô>` | `o_<ô>.png` — `o_tu_luyen` · `o_nhiem_vu` · `o_rank` · `o_thong_tin` · `o_so_tay` · `o_thi_thu` · `o_bai_tap_giao` · `o_cup` · `o_may_man` · `o_vi_xu` · `o_the_gioi` · `o_tren_lop` · `o_et` · `o_btvn` · `o_hoc_tu_dau` | PNG 160px |
| `khoi_b_lich` · `khoi_b_kiem_tra_lai` | `b_lich.png` · `b_kiem_tra_lai.png` | PNG 160px |
| `khoi_tt_goc` · `khoi_tt_gach` | `corner.png` · `divider.png` | PNG 192px · 768×96 |
| K2: `nen_vung_*` · `dao_*` · `quai_*` · `boss_*` · `nen_the_gioi` · `co_chinh_phuc`… | **cùng tên với Đơn 6**, trong thư mục bản đồ phiêu lưu của style `khoi` (cây thư mục do luồng Giao diện chốt khi dựng bản đồ) | nền JPG · quái PNG |

Ô → icon (khai `anhO` trong `skin/styles/khoi.ts`): `giao_trinh → o_tren_lop` · `thanh_tuu`, `xep_hang → o_cup` · còn lại cùng tên ô.

---

## Đã chốt (Thùy 01/10)

1. **V1.0 (06/10):** style thứ 2 = **Thị trấn** (giữ `spec-v1-app-hs.md` §5). Khối vuông = style thứ 3, dựng code **sau V1**, sau Thị trấn.
2. **Hình gamification:** giữ **1 bộ chung** mọi style (8 huy hiệu × 5 sao · 10 biểu tượng bậc · khung avatar · icon nhiệm vụ) — không đặt bản khối vuông.
3. **Bản đêm:** chưa cần — style chỉ có chế độ sáng.
