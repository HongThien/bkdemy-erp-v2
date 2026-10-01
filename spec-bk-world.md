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

## 4. Chờ CEO

1. **Quái/trứng có bán ra xu được không?** CTO đề xuất **không**: chỉ để nuôi, lai, khoe, làm nhiệm vụ.
2. **HS có đổi/tặng quái cho nhau không?** CTO đề xuất **chưa** (tránh chợ đen, bắt nạt, bị ép đổi). Để sau V1.
3. **Xu từ nhiệm vụ NPC tính chung trần tháng với bán nông sản?** CTO đề xuất **chung**.
4. **Gộp "điểm chăm chỉ" của Nông Trại vào điểm học tập**, tính từ lượt học thật? CTO đề xuất **có**.
5. **Tên game** khác "Thế giới BK".
6. **V1 (06/10) ra phần nào?** CTO đề xuất:
   - **V1 = điểm học tập + trồng cây bán xu** (đường đơn giản; gần xong nhất, chạy thật được).
   - Song song bắt đầu **thú dễ thương bằng code** (loài mẫu) để mở **bắt thú + ấp trứng + lai ở V1.1**.
   - Bắt thú + lai + công thức không kịp chạy thật trước 06/10.
