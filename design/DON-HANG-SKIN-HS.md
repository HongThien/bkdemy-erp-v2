# Đơn đặt hàng ChatGPT — skin app HS theo 3 nhóm khối

> Soạn 28/09/2026. Thùy chốt: **mỗi nhóm khối có bộ skin riêng**.
> - **Thị trấn** (chuẩn thiết kế lớp 3–5, mở cho mọi khối — Thùy 28/09 tối) → **Đơn 1 v2** (giao không qua zip, như Đơn 3 v3)
> - **Lớp 6–8** · gốc **Khối vuông** · không có điện thoại riêng → **Đơn 2** — ⚠ THAY bởi `design/DON-HANG-STYLE-KHOI.md` (01/10)
> - **Lớp 9–12** · nhiều skin để HS chọn · có điện thoại riêng. 4 skin (Tối giản, Đấu trường, Y2K, Soft Hàn) Claude dựng bằng code, không cần ChatGPT.
>   2 skin cần hình → **Đơn 3 v3 (Lo-fi đêm)** và **Đơn 4 v2 (Anime RPG)** — cả 2 theo "BỐ CỤC CHUNG lớp 9–12" (ảnh gốc RPG Thùy đã xem).
>
> Spec tổng: `spec-giao-dien-hs.md`.

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` (như mọi lần).
2. Dán **nguyên khối ĐƠN ĐẶT HÀNG** của đơn đó (kể cả phần "Ghi đè kit" và "Luật riêng").
3. Đính kèm ảnh tham chiếu ghi trong đơn. Ảnh chụp mockup từ trang:
   - Đơn 1–2: https://claude.ai/artifact/M2w9GCJzYAaa1hB1NULg6x (mẫu "Thị trấn", "Khối vuông")
   - Đơn 3–4: https://claude.ai/artifact/LZF11536BxanSuLQcnbWiR (mẫu "Lo-fi đêm", "Anime RPG")
   Đơn 1–2: ảnh chỉ để lấy **không khí và màu**. Đơn 3–4: đính kèm `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png` làm BỐ CỤC GỐC.
4. Đơn 1–2 chạy đủ 4 pha (A→D). Duyệt mockup ở Pha B **trước** khi cho sinh asset.
   Đơn 3–4 cũng chạy đủ 4 pha (luật 28/09: KHÔNG còn đơn "chỉ sinh hình"). Đơn 3–4 dán thêm mục "BỐ CỤC CHUNG lớp 9–12" ngay sau khối đơn. **Đơn 3 v3 giao KHÔNG qua zip** — xem cách gửi riêng trong đơn (bước 5–6 dưới không áp).
5. Kiểm trước khi nhận: zip PHẢI có `reference/` (ảnh toàn cảnh mọi khổ màn + trạng thái) và DESIGN.md có cột "Vị trí & cỡ".
   Thiếu 1 trong 2 → trả lại ngay, chưa cần gửi Claude.
6. Nhận zip → bỏ vào `design/handoff/` (KHÔNG bỏ vào `public/`) → báo Claude.

---

## Đơn 1 v2 — skin Thị trấn (chuẩn thiết kế lớp 3–5, mở cho MỌI khối) — soạn 28/09 tối

> v1 (chưa gửi) viết cho màn riêng cấp 1 (HomeCap1, iPad, 8 ô). Soạn lại vì 2 quyết định mới của Thùy 28/09:
> (1) **mọi skin mở cho mọi em** — nhóm tuổi chỉ là chuẩn để THIẾT KẾ ⇒ Thị trấn là 1 skin trong bộ chung, chạy trên Home chung
> (HomeHS912) ⇒ phải theo "BỐ CỤC CHUNG lớp 9–12" và đủ ô của cả khối 9 lẫn khối 10–12;
> (2) **giao KHÔNG qua zip** (bài học Đơn 4: ảnh vẽ trong chat đẹp, file đóng zip lại là bản dựng bằng code).
> Khác Lo-fi/RPG: Thị trấn là skin **SÁNG** (chữ tối trên nền sáng) và dùng **LINH VẬT** thay nhân vật người.
>
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới + mục "BỐ CỤC CHUNG lớp 9–12" →
> đính kèm `design/bk-ui-src/Nền app HS cấp 3_11.png` (mockup RPG đã duyệt, CHỈ lấy bố cục). Mỗi hình xong: tải về `design/bk-ui-src/`,
> gõ "tiếp". Xong nhóm nào báo Claude kiểm nhóm đó.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-skin-thi-tran
Mô tả màn:      Màn chính app học sinh trung tâm dạy thêm BK Academy, skin "Thị trấn". Skin thiết kế theo chuẩn học sinh LỚP 3–5
                (8–11 tuổi) nhưng em lớn hơn cũng chọn được ⇒ dễ thương nhưng KHÔNG sến, không trẻ con quá.
                Bố cục theo đúng mục "BỐ CỤC CHUNG lớp 9–12" dán kèm + ảnh mockup đính kèm (CHỈ lấy BỐ CỤC, không lấy phong cách).
                Chỗ "nhân vật" trong bố cục = LINH VẬT (không có người).
                2 khổ: iPad NGANG 1180×820 và điện thoại DỌC 430px 9:16.
Phong cách:     thị trấn ấm áp kiểu Play Together / Animal Crossing / Toca Boca nhưng THIẾT KẾ GỐC (không nhân vật, logo, hình dạng
                nhận ra được của game nào). Ban ngày, nắng dịu. Khối tròn mập, bo góc lớn; màu kẹo tươi, độ bão hoà VỪA PHẢI.
                Ô/nút kiểu "thạch": nền trắng kem, 1 viền dưới đậm cùng tông (như bóng cứng 5px), bấm được rõ ràng.
                Icon = minh hoạ 3D mềm, mỗi ô 1 ĐỒ VẬT CỦA THỊ TRẤN, khác nhau.
Biến thể:       3 "làng" HS tự chọn (chỉ đổi tranh nền, bố cục y hệt), PHẢI khác nhau rõ ràng từ xa:
                  lang_bien : làng biển — xanh ngọc, cát vàng, thuyền, hải đăng xa
                  lang_nam  : làng rừng nấm — xanh lá, nấm đỏ chấm trắng, đom đóm
                  lang_keo  : làng kẹo — hồng, vàng bơ, mây bông, nhà bánh quy
                3 linh vật HS tự chọn, dùng chung cho cả 3 làng: meo (mèo cam) · cun (cún trắng tai nâu) · rong (rồng con xanh ngọc).
                KHÔNG có biến thể nam/nữ.
Phiên bản kit:  v2

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#12 ill_town_tu_luyen".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.

══ CHUẨN TỪNG LOẠI ══
- ICON: vuông 1254×1254, nền TRONG SUỐT thật, vật thể ở GIỮA chiếm ~80% khung (chừa lề), không chữ/số/badge, không khung ô phía sau.
  Tất cả icon cùng góc nhìn 3/4 từ trên, cùng nguồn sáng (nắng từ trái-trên), cùng độ chi tiết.
- LINH VẬT: vuông 1254×1254, nền TRONG SUỐT, toàn thân, tư thế vẫy tay, nhìn về phía người xem. 3 con cùng cỡ, cùng nét vẽ.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG linh vật, KHÔNG chữ. Cảnh làng dồn sang TRÁI; 65% bên PHẢI là trời/đồng cỏ SÁNG, ÍT chi tiết
  (để đặt ô lên, chữ tối phải đọc được).
- NỀN DỌC: 940×1672, nền đặc, KHÔNG linh vật. Cảnh làng ở 40% TRÊN; 60% DƯỚI sáng dịu, ít chi tiết (trời/cỏ/cát nhạt).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (mỗi ảnh 1 màn, có chữ + số mẫu, CHỈ để xem bố cục — không cắt ra dùng):
   #01 iPad ngang – trạng thái ① khối 9 thường, làng biển, linh vật mèo   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 điện thoại dọc – trạng thái ① cùng làng + linh vật
B. Nền:      #03 backdrop_town_lang_bien_ngang · #04 backdrop_town_lang_bien_doc · #05 backdrop_town_lang_nam_ngang
             #06 backdrop_town_lang_nam_doc · #07 backdrop_town_lang_keo_ngang · #08 backdrop_town_lang_keo_doc
C. Linh vật: #09 pet_town_meo · #10 pet_town_cun · #11 pet_town_rong
D. Icon ô:   #12 ill_town_tu_luyen (bình tưới cây) · #13 ill_town_thong_tin (bảng tin gỗ ghim giấy) · #14 ill_town_so_tay (cuốn sổ có dây)
             #15 ill_town_thi_thu (cổng trường nhỏ khoá — tông XÁM, không nắng, vì ô đang khoá)
             #16 ill_town_bai_tap_giao (hộp thư có lá thư) · #17 ill_town_cup (cúp vàng trên bục gỗ) · #18 ill_town_may_man (máy gắp thú)
             #19 ill_town_vi_xu (heo đất) · #20 ill_town_bai_tren_lop (cặp sách) · #21 ill_town_et (đồng hồ báo thức + tờ bài)
             #22 ill_town_btvn (chồng vở + bút chì) · #23 ill_town_hoc_tu_dau (con đường đá bậc thang lên đồi)
E. Icon phụ: #24 ill_town_lich (lịch để bàn — thẻ ca bổ trợ) · #25 ill_town_kiem_tra_lai (tờ bài có dấu tích, ánh HỒNG)
             #26 ill_town_sao_cap (ngôi sao kẹo) · #27 ill_town_dong_xu (đồng xu vàng)

GHI ĐÈ KIT §1: font = Baloo 2 cho MỌI chữ. KHÔNG Pacifico/Itim, KHÔNG chữ viết tay/doodle. Màn được cuộn.
LUẬT RIÊNG (lý do: HS chê bản cũ vì sến và dạy đời):
  - KHÔNG khẩu hiệu động viên ("Cố lên!", "Mỗi ngày tiến bộ"...). KHÔNG chữ tiếng Anh. Câu duy nhất có "giọng" = bong bóng thoại
    của linh vật, phải có số thật (vd "Còn 3 câu nữa là đủ 10 câu hôm nay!").
  - Chữ chính ≥ 16px ở khổ iPad; chữ tối trên nền sáng, đủ tương phản. Mọi chữ tiếng Việt đúng dấu.

Bắt đầu với #01.
```

### Đơn 1 v2 — KIỂM HÀNG 29/09 (27 file `design/bk-ui-src/Style_Town/Town_01…27.png`) + ĐƠN BỔ SUNG

Kiểm bằng máy (cỡ + kênh trong suốt) và xem từng hình:

| File | Đơn đặt | Nhận được | Kết luận |
|---|---|---|---|
| Town_01 · 02 | #01 · #02 ảnh toàn cảnh iPad · điện thoại | đúng | ✔ (làm chuẩn dựng màn) |
| Town_03 · 04 | nền làng biển ngang · dọc | đúng, 1672×941 / 940×1672 | ✔ |
| Town_05 · 06 | #05 nấm NGANG · #06 nấm DỌC | 05 = nấm DỌC, 06 = nấm NGANG (đảo thứ tự) | ✔ dùng được, chỉ đổi tên |
| Town_07 | #07 kẹo NGANG | kẹo DỌC nhưng 1024×1536 (tỉ lệ 2:3, không phải 9:16) + kín chi tiết cả khung | ✖ vẽ lại |
| Town_08 | #08 kẹo DỌC | kẹo NGANG 1602×981, kín chi tiết cả khung (không chừa 65% bên phải sáng, ít chi tiết) | ✖ vẽ lại |
| Town_09 · 10 · 11 | linh vật mèo · cún · rồng | đúng, nền trong | ✔ |
| Town_12 … 18 | tự luyện · thông tin · sổ tay · thi thử (khoá) · bài tập giao · cúp · may mắn | đúng | ✔ |
| Town_19 | vi_xu = heo đất | rương đầy xu | ✖ lệch (ảnh toàn cảnh #01 dùng heo đất) |
| Town_20 | bai_tren_lop = cặp sách | cuộn bản đồ + rương | ✖ lệch |
| Town_21 | et = đồng hồ báo thức + tờ bài | rương đá quý | ✖ lệch |
| Town_22 | btvn = chồng vở + bút chì | bản đồ + la bàn | ✖ lệch |
| Town_23 | hoc_tu_dau = đường đá bậc thang lên đồi | cúp có sao (trùng cúp #17) | ✖ lệch |
| Town_24 | lich | cuộn bản đồ kho báu | ✖ lệch |
| Town_25 | kiem_tra_lai | tờ bài dấu tích hồng | ✔ |
| Town_26 | sao_cap | bia bắn cung | ✖ lệch |
| Town_27 | dong_xu | lịch để bàn | ✔ dùng làm `lich` |

Từ #19 ChatGPT trượt khỏi danh sách (vẽ rương / bản đồ / cúp — 3 bản đồ, 2 rương, 2 cúp). `sao_cap` + `dong_xu` code hiện KHÔNG dùng
(hợp đồng style không có chỗ) ⇒ không cần vẽ lại. **Thiếu thật: 5 icon ô + 2 nền kẹo = 7 hình.**

Dán tiếp vào ĐÚNG context ChatGPT đang vẽ Town (giữ phong cách đã duyệt):

```
BỔ SUNG — từ #19 bạn đã vẽ lệch danh sách. Vẽ lại đúng 7 hình dưới, vẫn luật cũ: MỖI LƯỢT ĐÚNG 1 HÌNH, dòng đầu ghi số + tên file,
vẽ xong dừng chờ "tiếp". Cùng phong cách, góc nhìn 3/4, nắng trái-trên, cùng độ chi tiết với #12–#18 đã vẽ.
ICON: vuông 1254×1254, nền TRONG SUỐT thật, vật ở giữa ~80% khung, không chữ/số, không khung ô phía sau.
   #28 ill_town_bai_tren_lop — cặp sách đi học (ba lô) màu xanh dương, quai da nâu, 1 cuốn sách thò ra
   #29 ill_town_btvn         — chồng 3 cuốn vở màu + 1 bút chì vàng đặt chéo trên cùng
   #30 ill_town_et           — đồng hồ báo thức tròn 2 chuông đứng cạnh 1 tờ bài kiểm tra có dấu tích
   #31 ill_town_vi_xu        — heo đất hồng (GIỐNG con heo trong ảnh toàn cảnh #01) + vài đồng xu vàng dưới chân
   #32 ill_town_hoc_tu_dau   — con đường đá bậc thang uốn lên 1 ngọn đồi xanh nhỏ, lá cờ nhỏ trên đỉnh
NỀN làng kẹo (vẽ lại — bản cũ kín chi tiết cả khung, bản dọc sai tỉ lệ):
   #33 backdrop_town_lang_keo_ngang — 1672×941, nền đặc, KHÔNG linh vật, KHÔNG chữ. Nhà bánh quy + kẹo mút dồn sang TRÁI;
       65% bên PHẢI là trời xanh + mây bông hồng + đồi cỏ SÁNG, ÍT chi tiết (để đặt ô lên, chữ tối phải đọc được).
   #34 backdrop_town_lang_keo_doc   — 940×1672 (đúng 9:16), nền đặc. Cảnh làng kẹo ở 40% TRÊN; 60% DƯỚI là đường gạch hồng nhạt /
       bãi cỏ sáng dịu, ít chi tiết.
Bắt đầu với #28.
```

**Bảng đổi tên khi dựng style** (Claude làm): 01–02 → `design/handoff/hs-skin-town-v1/reference/` · 03 `bg_lang_bien_ngang` · 04 `bg_lang_bien_doc` ·
06 `bg_lang_nam_ngang` · 05 `bg_lang_nam_doc` · #33/#34 `bg_lang_keo_ngang/doc` · 09–11 `pet_meo/cun/rong` · 12 `o_tu_luyen` · 13 `o_thong_tin` ·
14 `o_so_tay` · 15 `o_thi_thu` · 16 `o_bai_tap_giao` · 17 `o_cup` · 18 `o_may_man` · #31 `o_vi_xu` · #28 `o_tren_lop` · #30 `o_et` · #29 `o_btvn` ·
#32 `o_hoc_tu_dau` · 27 `b_lich` · 25 `b_kiem_tra_lai` (vào `public/bk-ui/hs/skin/town/`, nền nén JPG như RPG).
Town_19–24, 26 thừa — giữ trong `design/bk-ui-src/`, không đưa vào app.

---

## Đơn 2 — Lớp 6–8 · Khối vuông

> ⚠ **ĐÃ THAY (01/10) bởi `design/DON-HANG-STYLE-KHOI.md`** — khuôn mới (ảnh toàn cảnh → từng hình, không zip), bố cục màn chính hiện tại,
> font pixel có dấu (Handjet). **ĐỪNG gửi bản dưới** — giữ lại chỉ để đối chiếu.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-k68
Mô tả màn:      Màn chính app học sinh LỚP 6–8 (11–14 tuổi) của trung tâm dạy thêm BK Academy. Các em KHÔNG có điện thoại
                riêng: dùng iPad/laptop ở trung tâm hoặc điện thoại của bố mẹ.
                Thiết bị: điện thoại DỌC 430px, tỉ lệ 9:16 (ảnh chính) + iPad NGANG 1180×820 (1 ảnh, cùng thứ tự,
                lưới ô 3 cột thay vì 2).

Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh):
  - Thanh trên: nút Hòm thư có badge số tin chưa đọc (0 thì ẩn) · nút Đổi mật khẩu · nút Thoát.
  - Thẻ người chơi: avatar (ảnh thật hoặc 2 chữ viết tắt) · tên (2 từ cuối, vd "Minh Khang") · "HS0231 · 7A1 · Toán" ·
    CẤP (vd "Cấp 12") · thanh XP (vd 640/1000) · số XU (vd 1.240).
  - Hàng 2 ô nhỏ:  "Bổ trợ" — "Bổ trợ yếu · Thứ 5 12/10 · 17:30 · P.204" / "Chưa có lịch" / khi tới giờ "Vào ca ngay →"
                   "Bài tập được giao" — "2 bài chưa làm" / "Chưa có bài"
  - Banner "Bài kiểm tra lại" (chỉ hiện khi có): "2 bài chờ làm sau ET · nộp 1 lần".
  - Lưới ô chức năng, đúng thứ tự, mỗi ô: icon + tên + 1 dòng trạng thái + (badge nếu có):
      1 Tự luyện            — "Luyện theo dạng yếu"
      2 Thông tin học tập   — "Dạng đang yếu"
      3 Sổ tay kiến thức    — "Tra lý thuyết & bài mẫu"
      4 Làm đề thi thử      — "Sắp có" (ô xám, khoá)
      5 Bài tập được giao   — "Đang phát triển" (ô xám)
      6 Thành tựu           — "Xem giải thưởng của em"
      7 May mắn             — "Có 1 lượt quay!" (badge 1) / "Luyện 10 câu đúng ≥70%"
      8 Ví xu               — "Xem xu & lịch sử"
      9 Học từ đầu          — "Học tuần tự từng dạng" (CHỈ hiện với một số em — vẽ ở trạng thái ①, ẩn ở ②)
  - Bạn đồng hành + bong bóng thoại 1 câu CÓ SỐ THẬT, vd "Còn 360 XP nữa là lên cấp 13!".

Trạng thái (mỗi cái 1 ảnh, CÙNG bố cục):
  ① thường: có lịch bổ trợ, có banner kiểm tra lại, có ô Học từ đầu, May mắn có lượt
  ② trống: chưa có lịch, không banner, không ô Học từ đầu
  ③ tới giờ bổ trợ: ô Bổ trợ nổi bật "Vào ca ngay →"

Biến thể = 3 "vùng đất" HS TỰ CHỌN (KHÔNG có biến thể nam/nữ). Chỉ đổi tranh nền + bảng màu, bố cục y hệt:
  - dong_co   : đồng cỏ ban ngày — trời xanh, cỏ xanh lá, đất nâu
  - hang_mo   : hang mỏ — NỀN TỐI: đá xám đậm, quặng phát sáng xanh ngọc/tím, đuốc cam (đây là bản tối của bộ skin)
  - tuyet     : vùng tuyết — trắng xanh, băng, cây thông phủ tuyết
Bạn đồng hành = 3 con HS TỰ CHỌN, dùng chung mọi vùng: soi (sói con), cao (cáo lửa), cu (cú mèo). Voxel, 1 file CHAR mỗi con.

Phong cách: thế giới khối vuông / voxel (cảm hứng Minecraft, Roblox) nhưng THIẾT KẾ GỐC — TUYỆT ĐỐI không Steve,
  Creeper, logo, texture hay khối nhận ra được của Minecraft/Roblox. Ô và nút là "khối": góc vuông, viền đen 3px, mặt có
  vát sáng trên-trái và tối dưới-phải như viên gạch nổi; thanh XP là dãy ô vuông xanh lá; icon các ô là đồ vật voxel 3D
  (vd Tự luyện = cuốc, Sổ tay = sách phép, Thành tựu = cúp, May mắn = rương, Ví xu = viên ngọc/đồng xu vuông...).

Giữ nguyên: danh sách chức năng, tên và thứ tự như trên. Không thêm chức năng.
Phiên bản kit:  v1

GHI ĐÈ KIT §1 "Nền tảng chung" cho đơn này:
  - Font: tiêu đề (tên ô, tên HS, số cấp) = Bungee · chữ thường = Baloo 2. KHÔNG Pacifico/Itim, KHÔNG chữ viết tay.
    KHÔNG dùng font pixel cho chữ tiếng Việt (mất dấu).
  - Ảnh điện thoại vẫn gọn 1 màn 9:16 như luật kit; ảnh iPad được cuộn.
LUẬT RIÊNG (lý do: HS chê bản cũ vì sến và dạy đời):
  - KHÔNG khẩu hiệu động viên, KHÔNG chữ tiếng Anh trang trí, KHÔNG trái tim/vương miện/doodle.
  - Câu duy nhất có "giọng" là câu thoại của bạn đồng hành, phải có số thật.
  - Chữ chính ≥ 15px ở khổ điện thoại; chữ trên nền khối phải đọc được (chữ trắng có viền/bóng đen 2px nếu nền nhiều màu).
  - Mọi chữ tiếng Việt đúng dấu.
```

---

## BỐ CỤC CHUNG lớp 9–12 (dùng cho Đơn 3, Đơn 4 — và 4 skin code dựng theo)

Gốc = ảnh toàn cảnh ChatGPT vẽ cho skin Anime RPG, Thùy đã xem và muốn đúng như vậy:
`design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png`. Mọi skin lớp 9–12 CHUNG bố cục này, chỉ khác phong cách.

**iPad / laptop NGANG (ảnh chính):**
- **Góc trên trái:** avatar tròn + họ tên + mã HS.
- **Góc trên phải:** nút **Hình nền** (MỚI — ảnh gốc chưa có, bắt buộc thêm: icon bảng màu + chữ "Hình nền") · Hòm thư (badge số) · Thoát.
- **Cột trái ≈ 35% bề ngang:** NHÂN VẬT (cao ≈ 80% màn, chân chạm mép dưới) + BẠN ĐỒNG HÀNH (thú nhỏ trên vai/cạnh người) +
  BONG BÓNG THOẠI 1 câu có số thật, đè lên góc trên vai nhân vật.
- **Cột phải ≈ 65%:** "Chào {tên 2 chữ cuối}!" chữ to 2 dòng → HÀNG VIÊN THUỐC: sao Cấp + thanh XP (640/1000) · đồng xu (1.240 xu)
  · Elo môn (1482 · hạng 3/14) · [khối 12] đếm ngược THPT (còn 286 ngày) → 2 BANNER ngang nhau: "Bổ trợ yếu · Thứ 5 12/10 · 17:30
  · Phòng 204" (tím) và "2 bài kiểm tra lại chờ làm" (hồng) → LƯỚI Ô 4 cột, mỗi ô: icon vẽ riêng đặt GIỮA, tên, 1 dòng trạng thái, badge đỏ.

**Điện thoại DỌC 430px (9:16):** đầu trang 1 hàng (avatar · nút Hình nền · hòm thư · ⋯) → hàng lời chào: chữ "Chào …!" bên trái,
NHÂN VẬT thu nhỏ bên phải (cao ≈ 28% màn, cắt ngang hông) + bong bóng thoại → hàng viên thuốc (xuống 2 dòng nếu chật) →
2 banner XẾP DỌC → lưới ô 2 cột. Được cuộn.

**Ô chức năng theo khối (đúng tên, đúng thứ tự):**
- Khối 9: Tự luyện · Thông tin học tập · Sổ tay kiến thức · Làm đề thi thử (khoá, "Sắp có") · Bài tập được giao · Thành tựu ·
  May mắn · Ví xu  (+ "Học từ đầu" chỉ hiện với một số em).
- Khối 10–12: Bài tập trên lớp · ET · BTVN · Tự luyện · Thông tin học tập · Sổ tay kiến thức · Làm đề thi thử  (+ "Học từ đầu").

**Trạng thái phải vẽ (mỗi cái 1 ảnh, CẢ 2 khổ màn):** ① khối 9 thường — có 2 banner, badge ở 2 ô · ② khối 12 — 7 ô khối 10–12, có viên
thuốc đếm ngược THPT, chỉ banner Bổ trợ · ③ trống — không banner, không badge.

**Nhân vật:** 2 nhân vật HS TỰ CHỌN (KHÔNG gán theo giới tính): `nam` và `nu`, cùng phong cách, cùng tư thế đứng, cùng bạn đồng hành.

---

## Đơn 3 v3 — Lớp 9–12 · skin Lo-fi đêm (làm lại — soạn 28/09 theo bài học Đơn 4)

> v1 bị trả: tranh nền là khối phẳng ghép bằng code, 2 biến thể gần trùng nhau.
> v2 chưa gửi — soạn lại vì Đơn 4 lộ lỗi mới: **ảnh ChatGPT VẼ trong chat thì đẹp, nhưng file nó ĐÓNG ZIP lại là bản dựng bằng code**
> (10/16 icon phẳng kiểu clip-art, 6 ảnh tham chiếu dựng HTML), còn icon đẹp chỉ nằm trong mockup ~100px, cắt ra thì mờ.
> ⇒ v3 **KHÔNG DÙNG ZIP**. Mỗi lượt ChatGPT vẽ ĐÚNG 1 hình, Thùy tải thẳng ảnh đó về `design/bk-ui-src/`. Claude tự kiểm kê.
>
> **Cách gửi v3:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới + mục "BỐ CỤC CHUNG lớp 9–12" →
> đính kèm `design/bk-ui-src/Nền app HS cấp 3_11.png` (mockup RPG đã duyệt, CHỈ lấy bố cục). Mỗi hình xong: tải về, gõ "tiếp".
> Xong nhóm nào báo Claude kiểm nhóm đó (đừng đợi đủ 25 hình).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-912-lofi
Mô tả màn:      Màn chính app học sinh LỚP 9–12 (14–18 tuổi, có điện thoại riêng, hay mở app buổi tối), skin "Lo-fi đêm".
                Bố cục theo đúng mục "BỐ CỤC CHUNG lớp 9–12" dán kèm + ảnh mockup đính kèm (CHỈ lấy BỐ CỤC, không lấy phong cách).
                2 khổ: iPad NGANG 1180×820 và điện thoại DỌC 430px 9:16.
Phong cách:     lo-fi study kiểu tranh nền Lofi Girl / anime (TỰ VẼ, không chép): phòng học ban đêm, đèn bàn ấm cam #ffb066,
                tông chàm #1d1b3a → tím mận #3b2b52, ánh sáng dịu, hạt nhiễu nhẹ. Ô/thẻ nền tối trong mờ, viền mảnh sáng.
                Icon = đồ vật trên bàn học ban đêm, vẽ kiểu tranh anime có đổ bóng mềm + ánh đèn cam hắt lên, MỖI Ô 1 ĐỒ VẬT KHÁC NHAU.
Biến thể:       2 tranh nền HS tự chọn — `thanh_pho` (cửa sổ nhìn ra thành phố đêm, đèn neon xa) và `mua` (cửa sổ mưa, giọt nước chảy
                trên kính, đèn đường nhoè). PHẢI khác nhau rõ ràng từ xa.
                2 nhân vật HS tự chọn — `nam` và `nu`: học sinh cấp 3 mặc hoodie, đeo tai nghe, cầm bút/sách, ngồi hoặc đứng nghiêng 3/4.
                Trang phục KÍN ĐÁO (hoodie + quần dài / váy dài qua gối). Bạn đồng hành = mèo cam ngủ gật.
Phiên bản kit:  v3

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#07 ill_lofi_tu_luyen".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.

══ CHUẨN TỪNG LOẠI ══
- ICON: vuông 1254×1254, nền TRONG SUỐT thật, vật thể ở GIỮA chiếm ~80% khung (chừa lề), không chữ/số/badge, không khung ô phía sau.
  Tất cả icon cùng góc nhìn, cùng nguồn sáng (đèn bàn cam từ trái-trên), cùng độ chi tiết.
- NHÂN VẬT: dọc 1122×1402, nền TRONG SUỐT, nửa người trở lên, mèo cam nằm trên vai hoặc trong lòng.
- MÈO riêng: 1024×1024, nền trong suốt.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG chữ. Nửa PHẢI (65%) tối và ít chi tiết để đặt ô lên; cửa sổ/đèn dồn sang trái.
- NỀN DỌC: 940×1672, nền đặc, KHÔNG nhân vật. Cảnh chính ở 40% TRÊN, 60% DƯỚI tối, ít chi tiết (đặt nội dung app lên).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (mỗi ảnh 1 màn, có chữ + số mẫu, CHỈ để xem bố cục — không cắt ra dùng):
   #01 iPad ngang – trạng thái ① khối 9 thường      → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 điện thoại dọc – trạng thái ①
B. Nền:      #03 backdrop_lofi_thanh_pho_ngang · #04 backdrop_lofi_thanh_pho_doc · #05 backdrop_lofi_mua_ngang · #06 backdrop_lofi_mua_doc
C. Nhân vật: #07 character_lofi_nam · #08 character_lofi_nu · #09 pet_lofi_meo
D. Icon ô:   #10 ill_lofi_tu_luyen (tập nháp + bút chì) · #11 ill_lofi_thong_tin (bảng ghim giấy note) · #12 ill_lofi_so_tay (sổ tay bìa da + bút)
             #13 ill_lofi_thi_thu (tờ đề kẹp bìa + ổ khoá nhỏ — tông XÁM, không ánh cam, vì ô đang khoá)
             #14 ill_lofi_bai_tap_giao (phong bì giấy kraft) · #15 ill_lofi_thanh_tuu (cúp nhỏ trên kệ sách)
             #16 ill_lofi_may_man (quả cầu tuyết phát sáng) · #17 ill_lofi_vi_xu (hũ thuỷ tinh đựng xu)
             #18 ill_lofi_bai_tren_lop (balo + sách giáo khoa) · #19 ill_lofi_et (đồng hồ bấm giờ + tờ bài)
             #20 ill_lofi_btvn (chồng vở + cốc cacao) · #21 ill_lofi_hoc_tu_dau (bậc thang bằng sách)
E. Icon phụ: #22 ill_lofi_lich (lịch để bàn — banner Bổ trợ) · #23 ill_lofi_kiem_tra_lai (tờ bài có dấu tích, ánh HỒNG)
             #24 ill_lofi_sao_cap (ngôi sao giấy gấp phát sáng) · #25 ill_lofi_dong_xu (đồng xu vàng)

GHI ĐÈ KIT §1: font = Nunito (tiêu đề + thân), KHÔNG Baloo 2 / Pacifico, KHÔNG chữ viết tay. Màn được cuộn.
LUẬT RIÊNG:
  - Không khẩu hiệu động viên, không chữ tiếng Anh trang trí. Câu duy nhất có "giọng" = bong bóng thoại, phải có số thật.
  - Mọi chữ tiếng Việt trong ảnh toàn cảnh đúng dấu.

Bắt đầu với #01.
```

---

## Đơn 4 v2 — Lớp 9–12 · skin Anime RPG (bổ sung theo ảnh toàn cảnh đã có)

> v1 giao 7 mảnh rời, không có ảnh toàn cảnh; ảnh toàn cảnh ChatGPT vẽ cùng lúc (nhân vật + mèo, lâu đài ngang, 8 icon khác) không nằm
> trong zip và các mảnh của nó không được sinh ⇒ app dựng ra khác hẳn. Giờ lấy CHÍNH ảnh đó làm gốc.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-912-rpg
Mô tả màn:      Màn chính app học sinh LỚP 9–12, skin "Anime RPG". Ảnh ① iPad ngang ĐÃ DUYỆT = ảnh đính kèm reference_rpg_ipad.png
                (bạn đã vẽ ở context trước). Giữ nguyên ảnh đó, CHỈ thêm nút "Hình nền" ở góc trên phải cạnh Hòm thư.
                Vẽ nốt các ảnh còn lại theo mục "BỐ CỤC CHUNG lớp 9–12" dán kèm: điện thoại DỌC 430px + trạng thái ② ③ ở cả 2 khổ.
Phần tử ĐỘNG:   như "BỐ CỤC CHUNG".
Trạng thái:     ① (đã có, thêm nút Hình nền) ② ③ — mỗi trạng thái cả 2 khổ màn.
Biến thể:       2 nhân vật HS tự chọn: `nam` = pháp sư áo choàng + mèo đen (như ảnh gốc) · `nu` = pháp sư nữ cùng phong cách + cú trắng.
                2 tranh nền HS tự chọn: `lau_dai` (như ảnh gốc) · `dao_troi` (đảo nổi + thác nước, cùng bảng màu).
Phong cách:     đúng như ảnh gốc: anime fantasy đêm, xanh tím + vàng cổ, ô viền vàng trong mờ, banner tím / hồng.
Giữ nguyên:     bố cục ảnh gốc; danh sách ô theo khối.
Phiên bản kit:  v2
Pha B: ảnh ① coi như đã duyệt (thêm nút Hình nền rồi gửi lại để Thùy xem). Vẽ các ảnh còn lại → Pha C kiểm kê có cột "Vị trí & cỡ"
→ Pha D sinh ĐỦ mảnh. File v1 (backdrop_rpg_sky, decor_rpg_corner/divider, 4 ill_rpg_*) KHÔNG dùng lại nếu không có trong ảnh.

GHI ĐÈ KIT §1: font = Be Vietnam Pro đậm cho chữ (tiêu đề có thể Philosopher), KHÔNG Pacifico, KHÔNG chữ viết tay. Màn được cuộn.
LUẬT RIÊNG: như Đơn 3 (mọi hình sinh bằng công cụ tạo ảnh; không khẩu hiệu; cột Vị trí & cỡ; đếm đối chiếu ảnh ↔ assets).

ASSETS TỐI THIỂU (thấy gì trong ảnh toàn cảnh phải có file — đặc biệt MỌI thứ trong reference_rpg_ipad.png):
  backdrop/backdrop_rpg_lau_dai_ngang.png 1920×1080 · backdrop_rpg_lau_dai_doc.png 1080×1920   (lâu đài đêm, đèn lồng, KHÔNG nhân vật)
  backdrop/backdrop_rpg_dao_troi_ngang.png · backdrop_rpg_dao_troi_doc.png
  characters/character_rpg_nam.png (pháp sư + mèo đen + quả cầu sáng, như ảnh gốc) · character_rpg_nu.png   (cao ≥ 1200, trong suốt)
  illustrations/ill_rpg_<id>.png: tu_luyen (sách phép), thong_tin (bản đồ cuộn), so_tay (chồng sách + bút lông), de_thi_thu (cổng đá khoá),
                 bai_tap_giao (cuộn giấy), thanh_tuu (cúp vàng), may_man (cầu pha lê tím), vi_xu (túi xu)   ← đúng như ảnh gốc
                 + bai_tren_lop, et, btvn, hoc_tu_dau (MỚI, cùng phong cách)  + banner: lich (lịch tím), kiem_tra_lai (tờ tài liệu hồng)
                 + sao_cap (ngôi sao cấp), dong_xu (đồng xu)   (≥ 512, nền trong suốt)
```

---

## Đơn 6 — Bản đồ phiêu lưu + quái vật (style Anime RPG) — soạn 01/10 cho release V1.0 (`spec-v1-app-hs.md` §4)

> ⚠ **PHẦN LỚN ĐÃ THAY BỞI "Đơn 6 v2" ở cuối file này (01/10 tối)** — đừng gửi khối đơn dưới. Còn dùng được: #06–#13 (8 quái) và #39 (cờ).

> App HS đổi thành "Giải cứu thế giới — đánh quái vật": chủ đề = lục địa · chuyên đề = khu vực · dạng = màn đấu · cụm = quái.
> Số chủ đề mỗi khối khác nhau (3–24) ⇒ KHÔNG vẽ riêng từng chủ đề. Vẽ **bộ vùng đất (biome) dùng xoay vòng** + **bộ quái dùng chung**,
> code gắn cố định vào chủ đề/cụm. Vị trí khu vực, màn, đường đi, sương mù, máu quái, cờ chinh phục đều do CODE vẽ lên hình.
>
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới → đính kèm 2 ảnh làm mẫu phong cách:
> `design/bk-ui-src/Nền app HS cấp 3_2.png` (nền đảo trời) + `Nền app HS cấp 3_5.png` (icon sách phép). Mỗi hình xong: tải về
> `design/bk-ui-src/Adventure/`, gõ "tiếp". **Làm theo đúng thứ tự — hết thời gian thì dừng ở đâu cũng dùng được phần đã có** (deadline 06/10).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-rpg (bản đồ phiêu lưu + quái vật)
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Mỗi chủ đề kiến thức là 1 vùng đất,
                mỗi dạng bài là 1 màn đấu, mỗi nhóm bài là 1 con quái. Học sinh làm đúng câu hỏi = tung đòn đánh quái.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     đúng phong cách 2 ảnh đính kèm: anime fantasy, ánh vàng cổ, xanh tím, lấp lánh sao, vẽ tay tỉ mỉ.
                Quái vật DỄ THƯƠNG – NGỘ NGHĨNH kiểu slime/thú nhỏ fantasy (học sinh lớp 3–12 đều chơi), KHÔNG ghê sợ, KHÔNG máu me.
Phiên bản kit:  v1

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu ghi số + tên file, vd "#07 quai_slime_lua".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ #01).
- Ảnh vẽ ra trong chat LÀ file giao.

══ CHUẨN ══
- NỀN VÙNG ĐẤT: ngang 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ, KHÔNG đường đi vẽ sẵn. Nhìn từ trên cao chéo
  (như bản đồ game), địa hình trải đều cả khung, có nhiều khoảng trống bằng phẳng để đặt 6–10 điểm màn đấu lên. Hơi tối nhẹ ở viền.
- ĐẢO/LỤC ĐỊA NHỎ (cho bản đồ thế giới): 1024×1024, nền TRONG SUỐT, 1 hòn đảo nổi nhìn chéo từ trên, đúng biome tương ứng.
- QUÁI: 1024×1024, nền TRONG SUỐT, toàn thân, đứng giữa khung, chiếm ~75%, quay 3/4 về phía người xem, tư thế sẵn sàng chiến đấu
  vui nhộn. Mỗi con 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt được.
- BOSS: như QUÁI nhưng to, oai hơn, có vương miện/giáp/hào quang, vẫn dễ thương.
- KHÔNG chữ, số, logo, khung, nền phía sau quái.

══ DANH SÁCH (đúng thứ tự ưu tiên) ══
A. Duyệt phong cách
   #01 Ảnh toàn cảnh iPad ngang: 1 màn bản đồ vùng đất rừng, có 8 điểm màn đấu nối bằng đường đi, 3 điểm đã cắm cờ, 1 điểm đang
       sáng có 1 con quái đứng trên, phần cuối bản đồ phủ sương mù; góc trái là nhân vật pháp sư đồng hành (như ảnh mẫu).
       → DỪNG, chờ Thùy duyệt.
B. 4 vùng đất CẦN NHẤT (bản đồ khu vực)
   #02 nen_vung_rung        — rừng phép thuật, cây khổng lồ, nấm phát sáng
   #03 nen_vung_bang        — thung lũng băng tuyết, pha lê xanh
   #04 nen_vung_nui_lua     — núi lửa, dung nham cam, đá đen (vẫn tươi sáng, không u ám)
   #05 nen_vung_bien_dao    — quần đảo biển xanh ngọc, bãi cát, san hô
C. 8 con quái đầu tiên (mỗi con 1 hệ)
   #06 quai_slime_la   (xanh lá)   #07 quai_slime_lua (cam đỏ)   #08 quai_meo_bang (xanh băng)   #09 quai_rua_da (nâu đá)
   #10 quai_cu_dem (tím)           #11 quai_ca_bong (xanh biển)  #12 quai_nam_ma (hồng tím)    #13 quai_chim_set (vàng)
D. 2 boss
   #14 boss_rong_con   (rồng con có vương miện)      #15 boss_golem_pha_le (người đá pha lê)
E. Bản đồ thế giới
   #16 nen_the_gioi    — biển mây ban đêm nhìn từ trên cao, trống để đặt các đảo (ngang 1672×941, nền đặc)
   #17 dao_rung · #18 dao_bang · #19 dao_nui_lua · #20 dao_bien   (đảo nổi trong suốt, khớp 4 vùng ở B)
F. Mở rộng (làm nếu còn thời gian)
   #21 nen_vung_sa_mac · #22 nen_vung_dam_lay · #23 nen_vung_thanh_co · #24 nen_vung_troi_sao
   #25–#32 thêm 8 quái: quai_tho_gio · quai_be_nham · quai_sao_bien · quai_ech_doc · quai_dom_dom · quai_soi_bang · quai_bo_giap · quai_ma_lua
   #33 boss_phuong_hoang · #34 boss_bach_tuoc · #35 dao_sa_mac · #36 dao_dam_lay · #37 dao_thanh_co · #38 dao_troi_sao
G. Đồ vật nhỏ (trong suốt, 512×512)
   #39 co_chinh_phuc (lá cờ cắm đất) · #40 ruong_khu_vuc (rương thưởng) · #41 cong_khu_vuc (cổng đá vào khu)

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```


---

## Đơn 6 v2 — Chất liệu + sprite cho 3 tầng bản đồ phiêu lưu (style Anime RPG) — soạn 01/10 tối, THAY phần lớn Đơn 6

> ⛔ **ĐÃ HỦY (01/10 khuya, Thùy chốt): bản đồ phiêu lưu dựng 2.5D/3D bằng three.js, hình viết bằng CODE — KHÔNG gửi đơn này cho ChatGPT.**
> Còn lại cho ChatGPT: chỉ icon. Quái vật/boss do Thùy thiết kế riêng (điểm cắm `skin/the3d/nguonQuai.ts`). Xem `spec-v1-app-hs.md` §4.5. Nội dung dưới giữ để tra.

> Lý do đổi: logic phiêu lưu đã chốt qua mockup (`spec-v1-app-hs.md` §4.5, mockup `design/mockup-phieu-luu.html`). **Lục địa, vùng, biên giới, con đường đều do CODE vẽ**
> (số chủ đề/chuyên đề/dạng mỗi khối mỗi khác, thêm dạng là bản đồ tự co giãn) ⇒ ChatGPT **không vẽ hình dạng lục địa nữa**. ChatGPT chỉ vẽ:
> **chất liệu mặt đất (texture)** lấp vào hình code vẽ · **sprite trang trí** · **quái** · **hero chiến đấu** · **nền màn đấu** · vài đồ vật.
>
> **Đơn 6 cũ còn dùng được:** #06–#13 (8 quái, giữ nguyên tên file) · #39 cờ chinh phục. **Bỏ:** #02–#05 nền vùng, #16–#20 nền thế giới + đảo (code vẽ thay),
> #14–#15 boss riêng (boss giờ là quái thường + vương miện; 2 boss đặc biệt để dành cho "boss cuối hành trình" nếu làm).
>
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới → đính kèm 4 ảnh: `Nền app HS cấp 3_2.png` + `Nền app HS cấp 3_5.png` (phong cách) +
> 2 ảnh chụp mockup (mở link mockup, chụp tab **Thế giới** và tab **Chặng đường**) làm **bố cục tham khảo, KHÔNG chép hình tạm trong đó**. Mỗi hình xong: tải về
> `design/bk-ui-src/Adventure/`, gõ "tiếp". **Làm đúng thứ tự — dừng ở đâu cũng dùng được phần đã có** (deadline 06/10, hình tải về hạn 03/10).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-rpg v2 (3 tầng bản đồ + màn đấu)
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Học sinh đi trên bản đồ thế giới → bấm một lục địa →
                bấm một vùng → đi trên con đường các chặng; mỗi chặng có một đội quái, quái cuối (boss) đội vương miện. Làm đúng câu hỏi = tung đòn.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính. LỤC ĐỊA, VÙNG, ĐƯỜNG ĐI do lập trình viên vẽ bằng code,
                bạn CHỈ vẽ chất liệu và sprite theo danh sách dưới.
Phong cách:     đúng phong cách 2 ảnh mẫu: anime fantasy, ánh vàng cổ, xanh tím, lấp lánh sao, vẽ tay tỉ mỉ.
                Quái DỄ THƯƠNG – NGỘ NGHĨNH kiểu slime/thú nhỏ fantasy (học sinh lớp 3–12 đều chơi), KHÔNG ghê sợ, KHÔNG máu me.
Phiên bản kit:  v1

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu ghi số + tên file, vd "#07 dat_bang".
  Vẽ xong dừng, chờ tôi gõ "tiếp". Chỉ #01–#03 và các "tờ sprite" được gộp nhiều thứ trong 1 ảnh.
- Ảnh vẽ ra trong chat LÀ file giao.

══ CHUẨN ══
- TEXTURE MẶT ĐẤT (dat_*): vuông 1024×1024, nền đặc, NHÌN THẲNG TỪ TRÊN XUỐNG (không phối cảnh, không đường chân trời). Mặt đất đồng đều, họa tiết nhỏ rải đều,
  KHÔNG có vật nổi bật ở giữa (sẽ được lặp lại nhiều lần), KHÔNG bóng đổ lớn, KHÔNG chữ. Sáng vừa phải để chữ trắng đặt lên vẫn đọc được.
  (Không cần lặp liền mạch hoàn hảo: lập trình viên sẽ lật gương để nối.)
- BIỂN (bien_*): vuông 1024×1024, nhìn từ trên xuống, nước xanh đậm có ánh sao/ánh trăng lấp lánh nhẹ, đồng đều.
- TỜ SPRITE TRANG TRÍ (trangtri_*): ngang 1536×1024, nền TRONG SUỐT, đúng 6 vật nhỏ xếp lưới 3 cột × 2 hàng, mỗi vật nằm gọn trong ô của nó, cách nhau rộng,
  KHÔNG chạm nhau, nhìn chéo từ trên cao như bản đồ game. Mỗi vật cao khoảng 60% ô.
- QUÁI: 1024×1024, nền TRONG SUỐT, toàn thân, đứng giữa khung, chiếm ~75%, quay 3/4 về phía người xem, tư thế sẵn sàng chiến đấu vui nhộn.
  Mỗi con 1 màu chủ đạo khác nhau, nhìn hình bóng là phân biệt được. MỖI LOÀI 2 HÌNH: bình thường `quai_x` và trúng đòn `quai_x_trung_don`
  (cùng con đó, cùng tư thế, mắt nhắm tít, miệng há, hơi nghiêng về sau). Trạng thái "bị hạ" do code làm.
- HERO: 1024×1536 dọc, nền TRONG SUỐT, nhìn nghiêng 3/4 sang PHẢI, toàn thân, đúng nhân vật + thú đồng hành trong 2 ảnh `nv_nam.png`, `nv_nu.png` (đính kèm).
- NỀN MÀN ĐẤU (nen_dau_*): ngang 1672×941, nền đặc, nhìn NGANG (như sân khấu): trời + xa ở nửa trên, mặt đất bằng phẳng ở 1/3 dưới để đặt nhân vật (trái) và quái (phải).
  KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ. Nửa trên hơi tối nhẹ để thanh máu đặt lên vẫn rõ.
- VẬT/HIỆU ỨNG: 512×512, nền TRONG SUỐT.
- KHÔNG chữ, số, logo, khung trong MỌI hình (trừ chữ trong #01–#03 là không có).

══ DANH SÁCH (đúng thứ tự ưu tiên) ══
A. Duyệt phong cách — 3 ảnh toàn cảnh iPad ngang 1672×941 (mỗi ảnh 1 lượt)
   #01 toan_canh_the_gioi   — bản đồ thế giới ban đêm: biển lớn, 5–6 lục địa hình dạng tự nhiên khác nhau (rừng, băng, núi lửa, sa mạc…), vài lục địa phủ sương mù,
                              bờ biển có bọt sóng, la bàn góc phải dưới. Không chữ.
   #02 toan_canh_chang      — màn chặng đường vùng RỪNG: con đường đất uốn lượn qua ngang màn, 4 bệ đá tròn dọc đường, mỗi bệ 1 đội 3 quái nhỏ đứng quanh 1 quái cuối TO có vương miện;
                              pháp sư (nam) đứng đầu đường; 1 chặng đã cắm cờ, 1 chặng phủ sương. Không chữ.
   #03 toan_canh_man_dau    — cảnh chiến đấu ngang: pháp sư bên trái đang tung phép, quái cuối đội vương miện bên phải, 2 quái nhỏ chờ phía sau, nền rừng phép thuật.
                              → DỪNG, chờ Thùy duyệt cả 3 ảnh.
B. Chất liệu mặt đất — 4 vùng CẦN NHẤT (rồi mới đến 4 vùng sau)
   #04 dat_rung      — cỏ xanh đậm, rêu, lá rụng, nấm nhỏ phát sáng rải rác
   #05 dat_bang      — tuyết xanh nhạt, băng nứt, pha lê nhỏ
   #06 dat_nui_lua   — đá đen, vệt dung nham cam mảnh, tro
   #07 dat_bien_dao  — cát vàng, san hô, vỏ sò, cỏ biển
   #08 bien_dem      — biển ban đêm (dùng cho bản đồ thế giới và viền lục địa)
C. Tờ sprite trang trí — 4 vùng đầu (6 vật/tờ, dùng rải trên lục địa và đường đi)
   #09 trangtri_rung      — cây to, cây nhỏ, bụi cây, nấm phát sáng, khúc gỗ, cụm hoa
   #10 trangtri_bang      — cây thông tuyết, tảng băng, người tuyết nhỏ, pha lê, đống tuyết, đá phủ tuyết
   #11 trangtri_nui_lua   — núi lửa nhỏ, tảng đá đen, cột dung nham, cây khô, đá phát sáng cam, xương cá khô
   #12 trangtri_bien_dao  — cây dừa, vỏ sò lớn, đá ngầm, thuyền buồm nhỏ, san hô, mỏm đá
D. 8 quái đầu tiên (mỗi con 2 hình: thường + trúng đòn) — GIỮ tên file Đơn 6 (loài nào đã vẽ từ Đơn 6 thì chỉ vẽ thêm bản trúng đòn)
   #13 quai_slime_la (xanh lá) · #14 quai_slime_lua (cam đỏ) · #15 quai_meo_bang (xanh băng) · #16 quai_rua_da (nâu đá)
   #17 quai_cu_dem (tím) · #18 quai_ca_bong (xanh biển) · #19 quai_nam_ma (hồng tím) · #20 quai_chim_set (vàng)
   (mỗi số trên là CẢ HAI hình, vẽ liền nhau; dòng đầu ghi "#13a quai_slime_la" rồi "#13b quai_slime_la_trung_don")
E. Hero chiến đấu + hiệu ứng
   #21 hero_nam_dung · #22 hero_nam_phep (tư thế tung phép, tay giơ về bên phải, có quầng sáng trên tay)
   #23 hero_nu_dung  · #24 hero_nu_phep
   #25 vuong_mien       — vương miện vàng nhỏ xinh, nhìn thẳng, gắn lên đầu BẤT KỲ quái nào (512×512 trong suốt)
   #26 fx_chem          — vệt chém/tia phép vàng trắng cong (trong suốt)
   #27 fx_trung_don     — vụ nổ sao lấp lánh vàng (trong suốt)
   #28 fx_hoi_mau       — vòng sáng xanh lục + vài dấu cộng nhỏ bay lên (trong suốt; dấu cộng là hình, không phải chữ)
   #29 be_da            — bệ đá tròn nhìn chéo từ trên cao, có vòng rune vàng mờ, quái đứng trên (trong suốt)
   #30 co_chinh_phuc    — lá cờ đỏ cắm xuống đất (trong suốt) — bỏ qua nếu đã có từ Đơn 6
   #31 may_suong        — 3 đám mây/sương mù trắng xanh, tơi xốp, mép mờ, xếp 3 đám trong 1 ảnh 1536×1024 trong suốt (phủ lên vùng chưa dạy)
F. Nền màn đấu — 4 vùng đầu
   #32 nen_dau_rung · #33 nen_dau_bang · #34 nen_dau_nui_lua · #35 nen_dau_bien_dao
G. Mở rộng (làm nếu còn thời gian)
   #36–#39 dat_sa_mac · dat_dam_lay · dat_thanh_co · dat_troi_sao        #40–#43 trangtri_ cho 4 vùng đó
   #44–#47 nen_dau_ cho 4 vùng đó
   #48–#63 thêm 8 quái × 2 hình: quai_tho_gio · quai_be_nham · quai_sao_bien · quai_ech_doc · quai_dom_dom · quai_soi_bang · quai_bo_giap · quai_ma_lua
   #64 thuyen_buom_the_gioi (thuyền nhỏ trang trí trên biển, trong suốt) · #65 la_ban (la bàn góc bản đồ, trong suốt)

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

> **Khi hình về (Claude làm):** nén vào `public/bk-ui/hs/skin/rpg/phieuluu/` (đặt tên MỚI, không đè tên cũ — luật PWA ở `design/STYLE-HS.md`), khai trong `skin/styles/rpg.ts` (`phieuLuu: { dat, bien, trangTri, quai, hero, fx, nenDau }`),
> thêm vào `check:style-hs` kiểm đủ file. Style 2 **Thị trấn** làm bộ y hệt (cùng danh sách, nét dễ thương hơn) SAU KHI bộ RPG được duyệt.
> **Đổi từ Đơn 6 cũ:** mọi tên quái giữ nguyên nên `_phieu_luu_bo()` (DB) không đổi; biome DB (`rung, bang, nui_lua, bien_dao, sa_mac, dam_lay, thanh_co, troi_sao`) khớp `dat_*`/`trangtri_*`/`nen_dau_*`.


---

## Đơn 7 — Bản đồ phiêu lưu 2D: nền thế giới + bộ lục địa rời + nền vùng/chặng + nền màn đấu (style Anime RPG) — soạn 01/10 khuya, THAY hướng 3D

> **Thùy chốt 01/10 khuya:** thế giới + lục địa dựng 3D "nặng máy không cần thiết và xấu, trong khi không cần tương tác" ⇒ **ChatGPT vẽ ảnh tĩnh, Claude code thêm hiệu ứng.**
> Thế giới = **1 nền world map** + **vài chục lục địa rời** (nhiều dạng địa hình) do code đặt lên. Bố cục vùng trong lục địa và chặng trong vùng: code **làm sẵn
> bố cục 3–10** (đo 01/10: mỗi khối 2–10 chủ đề · 1–8 chuyên đề/chủ đề · thường 3–10 dạng/chuyên đề). **Chặng đường cũng 2D.** Màn đấu **2.5D**
> (nền vẽ + quái/hero là ảnh, code làm rung/chớp/máu/hạt/lớp trượt) — cùng hướng boss 2D. Quái + boss: Thùy thiết kế riêng, KHÔNG nằm trong đơn này.
> Đơn 6 v2 vẫn HUỶ; từ Đơn 6 cũ còn dùng được #39 cờ.
>
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới → đính kèm 3 ảnh phong cách: `design/bk-ui-src/Nền app HS cấp 3_1.png`
> (thành phố đêm) · `Nền app HS cấp 3_2.png` (đảo trời) · `Nền app HS cấp 3_5.png` (icon sách phép). Mỗi hình xong: tải về `design/bk-ui-src/Adventure2D/`,
> gõ "tiếp". **Làm đúng thứ tự — dừng ở đâu cũng dùng được phần đã có** (deadline 06/10). Hình trùng / vẽ lệch danh sách: gõ lại số đó.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-2d (bản đồ phiêu lưu 2D: thế giới → lục địa → chặng đường → màn đấu)
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Học sinh xem BẢN ĐỒ THẾ GIỚI có nhiều lục địa
                (mỗi lục địa = 1 chủ đề kiến thức) → bấm một lục địa → thấy các vùng (chuyên đề) → bấm một vùng → đi trên con đường
                các chặng, mỗi chặng có quái → vào màn đấu, làm đúng câu hỏi = tung đòn.
                Lập trình viên GHÉP các hình bạn vẽ lại với nhau và vẽ thêm nhãn, đường đi, sương mù, cờ, ánh sáng bằng code.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính.
Phong cách:     đúng phong cách 3 ảnh đính kèm: anime fantasy, ánh vàng cổ, xanh tím đêm, lấp lánh sao, vẽ tay tỉ mỉ, sáng sủa dễ nhìn.
                Nhìn từ trên cao CHÉO (kiểu bản đồ game phiêu lưu), KHÔNG nhìn thẳng từ trên xuống.
Phiên bản kit:  v1

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu ghi số + tên file, vd "#05 luc_dia_rung_1".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ #01–#03 ảnh toàn cảnh).
- Ảnh vẽ ra trong chat LÀ file giao.

══ CHUẨN ══
- NỀN THẾ GIỚI (#04): ngang 1672×941, nền đặc: biển đêm xanh tím lấp lánh sao + vài dải mây mỏng ở mép. ĐỂ TRỐNG, KHÔNG có đảo/lục địa nào
  (lục địa vẽ riêng rồi ghép vào). Giữa khung sáng hơn viền một chút.
- LỤC ĐỊA RỜI (luc_dia_*): vuông 1024×1024, nền TRONG SUỐT, ĐÚNG 1 lục địa/hòn đảo nổi giữa biển nhìn chéo từ trên cao, chiếm ~80% khung,
  mép đất có bờ cát/vách đá + 1 vòng bọt sóng mỏng quanh bờ (bọt sóng nằm TRONG hình), KHÔNG nước biển xung quanh ngoài vòng bọt đó.
  Mỗi hình 1 HÌNH DÁNG KHÁC NHAU (dài, tròn, hình lưỡi liềm, nhiều mũi, có vịnh, có hồ giữa…) — không được giống nhau.
  Địa hình trải khắp mặt đất, có 3–5 khoảng đất bằng phẳng rải rác (để đặt cờ/nhãn). KHÔNG chữ, KHÔNG người, KHÔNG quái, KHÔNG lâu đài to.
- NỀN VÙNG ĐẤT (nen_vung_*): ngang 1672×941, nền đặc, cận cảnh MỘT lục địa nhìn chéo từ trên cao, địa hình trải đều cả khung,
  có NHIỀU khoảng đất bằng phẳng rải khắp (để đặt 3–10 điểm mốc lên). KHÔNG đường đi vẽ sẵn, KHÔNG nhân vật, KHÔNG chữ. Viền hơi tối.
- NỀN CHẶNG ĐƯỜNG (nen_chang_*): ngang 1672×941, nền đặc, cận cảnh hơn nữa — một thung lũng/khu rừng trải ngang, nửa dưới là mặt đất
  thoáng rộng (để đặt 3–10 bệ đá có quái dọc đường), KHÔNG đường đi vẽ sẵn, KHÔNG nhân vật, KHÔNG chữ.
- NỀN MÀN ĐẤU (nen_dau_*): ngang 1672×941, nền đặc, nhìn NGANG như sân khấu: trời + cảnh xa ở nửa trên, mặt đất bằng ở 1/3 dưới
  (hero đứng trái, quái đứng phải). KHÔNG nhân vật, KHÔNG quái, KHÔNG chữ. Nửa trên hơi tối nhẹ để thanh máu đặt lên vẫn rõ.
- MỐC (moc_*) + VẬT: 512×512, nền TRONG SUỐT, nhìn chéo từ trên cao, nằm giữa khung chiếm ~70%.
- 8 VÙNG KHÍ HẬU (biome) — mã giữ nguyên: rung (rừng phép, cây khổng lồ, nấm phát sáng) · bang (băng tuyết, pha lê xanh) ·
  nui_lua (núi lửa, dung nham cam — tươi sáng, không u ám) · bien_dao (quần đảo, cát vàng, san hô) · sa_mac (sa mạc, ốc đảo, đá đỏ) ·
  dam_lay (đầm lầy xanh rêu, đom đóm) · thanh_co (tàn tích thành cổ, cột đá, dây leo) · troi_sao (đảo trời, pha lê tím, sao rơi).
- KHÔNG chữ, số, logo, khung trong MỌI hình.

══ DANH SÁCH (đúng thứ tự ưu tiên) ══
A. Duyệt phong cách — 3 ảnh toàn cảnh iPad ngang 1672×941 (mỗi ảnh 1 lượt)  [02/10: THAY bằng Đơn 7-0 (4 hướng để chọn) — gửi Đơn 7 thì bỏ mục A, bắt đầu từ #04]
   #01 toan_canh_the_gioi   — bản đồ thế giới ban đêm: biển lớn, 8 lục địa RỜI NHAU hình dạng khác hẳn nhau (mỗi cái 1 vùng khí hậu ở trên),
                              to nhỏ khác nhau, cách nhau bằng biển; 2 lục địa phủ mây sương; 1 lục địa có lá cờ nhỏ; la bàn góc phải dưới.
   #02 toan_canh_luc_dia    — cận cảnh 1 lục địa RỪNG: 6 điểm mốc (thành nhỏ, tháp, trại, đền, cổng đá, cầu) nối bằng đường mòn đứt nét;
                              2 mốc đã cắm cờ, 2 mốc cuối phủ sương.
   #03 toan_canh_chang      — chặng đường vùng RỪNG: con đường uốn lượn qua ngang màn, 5 bệ đá tròn dọc đường, mỗi bệ có 1 con quái nhỏ dễ thương;
                              bệ cuối có quái to đội vương miện; pháp sư nhỏ đứng đầu đường; 1 bệ đã cắm cờ, 1 bệ phủ sương.
                              → DỪNG, chờ Thùy duyệt cả 3 ảnh.
B. Nền thế giới + lục địa rời đợt 1 (MỖI VÙNG KHÍ HẬU 1 LỤC ĐỊA)
   #04 nen_the_gioi
   #05 luc_dia_rung_1 · #06 luc_dia_bang_1 · #07 luc_dia_nui_lua_1 · #08 luc_dia_bien_dao_1
   #09 luc_dia_sa_mac_1 · #10 luc_dia_dam_lay_1 · #11 luc_dia_thanh_co_1 · #12 luc_dia_troi_sao_1
C. Nền vùng đất + nền chặng đường — 4 vùng CẦN NHẤT
   #13 nen_vung_rung · #14 nen_vung_bang · #15 nen_vung_nui_lua · #16 nen_vung_bien_dao
   #17 nen_chang_rung · #18 nen_chang_bang · #19 nen_chang_nui_lua · #20 nen_chang_bien_dao
D. Mốc + vật nhỏ (512×512 trong suốt)
   #21 moc_thanh (thành nhỏ) · #22 moc_thap (tháp phép) · #23 moc_trai (trại lều) · #24 moc_den (đền cổ) · #25 moc_cong (cổng đá) · #26 moc_cau (cây cầu)
   #27 be_da (bệ đá tròn có vòng rune vàng mờ, để quái đứng lên) · #28 may_suong (1 đám mây sương trắng xanh tơi xốp, mép mờ)
   #29 la_ban (la bàn cổ vàng) · #30 co_chinh_phuc (lá cờ đỏ cắm đất — bỏ qua nếu đã có từ Đơn 6 #39)
E. Nền màn đấu — 4 vùng đầu
   #31 nen_dau_rung · #32 nen_dau_bang · #33 nen_dau_nui_lua · #34 nen_dau_bien_dao
F. Lục địa rời đợt 2 + 3 (MỖI VÙNG THÊM 2 HÌNH DÁNG KHÁC — tổng 24 lục địa, để 1 khối có tới 10 chủ đề vẫn không lặp)
   #35–#42 luc_dia_<vùng>_2 (đủ 8 vùng, theo thứ tự ở mục B) · #43–#50 luc_dia_<vùng>_3
G. 4 vùng còn lại (làm nếu còn thời gian)
   #51–#54 nen_vung_sa_mac · nen_vung_dam_lay · nen_vung_thanh_co · nen_vung_troi_sao
   #55–#58 nen_chang_ cho 4 vùng đó · #59–#62 nen_dau_ cho 4 vùng đó

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

> **Khi hình về (Claude làm):** kiểm từng hình đối chiếu danh sách (ghép tờ liên hoàn, soi hình trùng/lệch — bài học Đơn 1 Nhiệm vụ) · nén vào
> `public/bk-ui/hs/skin/rpg/phieuluu2d/` (lục địa 640², nền 1672×941 JPG q82, mốc 256²) · khai trong `skin/styles/rpg.ts` (`banDo2d`) · bỏ hình tạm.
> Style 2 Thị trấn làm bộ y hệt (cùng danh sách, nét dễ thương) SAU KHI bộ RPG được duyệt.


---

## Đơn 8 — MÀN ĐẤU (combat): khung câu hỏi + nút đáp án + HUD + hiệu ứng chiêu + tư thế nhân vật (style Anime RPG) — soạn 02/10, ĐỘC LẬP với Đơn 7

> **Thùy 02/10:** "combat là cái riêng" ⇒ đơn riêng, gửi ở **context ChatGPT riêng**, chạy song song Đơn 7 được. Nền trận (nen_dau_*) ĐÃ nằm ở Đơn 7 mục E
> (#31–34, #59–62) — đơn này KHÔNG vẽ lại. Quái + boss: Thùy thiết kế riêng, KHÔNG nằm trong đơn này.
> Bố cục màn đấu đã chốt trong code (02/10): thanh HUD mỏng trên cùng (chân dung quái · thanh máu · đội hình · 3 ô combo) — câu hỏi chiếm gần trọn màn
> (để đủ chỗ lời giải chi tiết) — cảnh trận chỉ bung xuống lúc tung chiêu. Mỗi 3 câu tung 1 chiêu: 3/3 TUYỆT KỸ · 2/3 mạnh · 1/3 nhẹ · 0/3 xịt.
> Hiện code đang vẽ tạm bằng CSS (`skin/KhungTran.tsx`); hình về thì thay hình tạm, bố cục giữ nguyên.
>
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới → đính kèm: 3 ảnh phong cách `design/bk-ui-src/Nền app HS cấp 3_1.png`
> · `Nền app HS cấp 3_2.png` · `Nền app HS cấp 3_5.png` + 2 ảnh nhân vật `public/bk-ui/hs/skin/rpg/nv_nam.png` · `nv_nu.png` + hoa văn góc
> `public/bk-ui/hs/skin/rpg/corner.png`. Mỗi hình xong: tải về `design/bk-ui-src/Combat/`, gõ "tiếp". Làm đúng thứ tự — dừng ở đâu cũng dùng được phần đã có.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            combat (màn đấu: trả lời câu hỏi Toán = tung phép đánh quái)
Mô tả:          App học Toán cho học sinh, chủ đề "Giải cứu thế giới — đánh quái vật". Trong màn đấu, học sinh đọc câu hỏi trên một
                BẢNG PHÉP lớn, chọn 1 trong 4 PHIẾN ĐÁP ÁN. Cứ 3 câu thì pháp sư (nhân vật của học sinh) tung 1 chiêu vào quái:
                đúng cả 3 = TUYỆT KỸ rất hoành tráng, đúng 2 = chiêu mạnh, đúng 1 = chiêu nhẹ, sai cả 3 = chiêu xịt.
                Lập trình viên GHÉP các hình bạn vẽ và ĐẶT CHỮ, SỐ, CÔNG THỨC TOÁN lên bằng code.
                Thiết bị chính: iPad NGANG 1180×820 và máy tính. Học sinh đọc chữ trên bảng phép rất lâu ⇒ RUỘT bảng phải YÊN, tối đều, không hoa văn.
Phong cách:     đúng phong cách các ảnh đính kèm: anime fantasy, ánh vàng cổ, xanh tím đêm, lấp lánh sao, vẽ tay tỉ mỉ.
                Khung và nút giống giao diện game nhập vai anime (kiểu Genshin Impact / Honkai Star Rail): viền vàng kim mảnh 2 lớp, góc hoa văn,
                đá quý. Nút bấm có độ dày (gờ dưới) như nút game.
Phiên bản kit:  v1

══ CÁCH GIAO HÀNG (bắt buộc — khác kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / ghép khối.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu ghi số + tên file, vd "#02 khung_cau_hoi".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ #01 ảnh toàn cảnh).
- Ảnh vẽ ra trong chat LÀ file giao.

══ CHUẨN ══
- KHÔNG chữ, số, chữ cái A/B/C/D, logo trong MỌI hình (trừ #01 được có vạch mờ thay chữ). Mọi chữ do code đặt.
- Nền TRONG SUỐT cho mọi hình trừ #01.
- KHUNG + NÚT (#02–#16): vẽ để CẮT 9 MẢNH được — trang trí chỉ nằm ở 4 GÓC (mỗi góc trong ô ~12% cạnh ngắn), 4 CẠNH là đường viền
  TRƠN ĐỀU (kéo dài không vỡ), RUỘT màu ĐỀU (không chuyển màu mạnh, không hoa văn). Hình nằm sát mép khung ảnh, không chừa lề thừa.
- HIỆU ỨNG (#21–#29): một khoảnh khắc đẹp nhất của hiệu ứng, nằm giữa khung, mép tan dần vào trong suốt (code tự phóng to/thu nhỏ/mờ dần).
  Màu phép của pháp sư = xanh tím + vàng kim. KHÔNG nền tối phía sau hiệu ứng.
- NHÂN VẬT (#30–#33): giữ ĐÚNG nhân vật trong 2 ảnh nv_nam / nv_nu đính kèm (mặt, tóc, áo, gậy), cùng tỉ lệ, đứng nghiêng 3/4 quay về
  BÊN PHẢI (quái đứng bên phải), chân chạm đáy khung, 1024×1024.

══ DANH SÁCH (đúng thứ tự ưu tiên) ══
A. Duyệt phong cách — 1 ảnh toàn cảnh
   #01 toan_canh_man_dau — iPad ngang 1672×941: trên cùng 1 THANH HUD MỎNG (chân dung quái nhỏ trong khung tròn, thanh máu đỏ, 3 viên ngọc
                           combo hình thoi); giữa là BẢNG PHÉP lớn chiếm gần hết màn (chữ thay bằng vạch mờ), trong có 4 phiến đáp án xếp 2×2,
                           mỗi phiến có 1 viên ngọc hình thoi bên trái; dưới cùng 1 nút vàng dài. Nền sau bảng: xanh đêm có sao mờ.
                           → DỪNG, chờ Thùy duyệt.
B. Bảng câu hỏi + đáp án (dùng nhiều nhất)
   #02 khung_cau_hoi       — 1600×1000. Bảng phép: viền vàng kim 2 lớp + 4 góc hoa văn (giống corner.png đính kèm), ruột xanh đêm đặc đều.
   #03 phien_dap_an        — 800×180. Phiến đá xanh tím bo góc, viền vàng mảnh, gờ dày phía dưới (nút game), ruột đều.
   #04 phien_dap_an_chon   — như #03, viền vàng sáng rực + hào quang vàng nhẹ quanh mép.
   #05 phien_dap_an_dung   — như #03, viền + hào quang XANH LỤC ngọc.
   #06 phien_dap_an_sai    — như #03, viền + hào quang ĐỎ, vài vết nứt nhỏ ở góc.
   #07 ngoc_thuong         — 256×256. Viên ngọc HÌNH THOI rỗng ruột (để code đặt chữ A/B/C/D), viền vàng, ruột xanh đêm.
   #08 ngoc_chon           — như #07, ruột vàng kim sáng.
   #09 ngoc_dung           — như #07, ruột xanh lục ngọc phát sáng.
   #10 ngoc_sai            — như #07, ruột đỏ ruby.
   #11 nut_tung_phep       — 900×170. Nút vàng kim dài, bo góc, gờ dày dưới, 2 đầu có hoa văn nhỏ, ruột vàng đều (code đặt chữ).
   #12 cuon_loi_giai       — 1600×900. Khung CUỘN GIẤY DA mở ngang (2 đầu cuộn gỗ/vàng), ruột giấy màu kem SÁNG ĐỀU (code đặt chữ tối lên).
C. HUD (thanh trên cùng)
   #13 khung_hud           — 1672×120. Dải ngang mỏng xanh đêm viền vàng mảnh ở cạnh dưới, 2 đầu hoa văn nhỏ, ruột đều.
   #14 khung_chan_dung     — 256×256. Khung TRÒN viền vàng kim có 2 cánh nhỏ 2 bên, ruột TRỐNG trong suốt (code đặt chân dung quái vào).
   #15 thanh_mau_vo        — 1000×70. Vỏ thanh máu: khung vàng mảnh, ruột tối (code đổ máu đỏ vào trong).
   #16 o_combo             — 128×128. Ô combo hình thoi nhỏ RỖNG, viền vàng (code tô xanh/đỏ khi đúng/sai).
D. Hiệu ứng chiêu (code ghép thành chuyển động)
   #21 tia_phep            — 1024×256. Một tia phép bay ngang trái → phải: đầu tia sáng chói, đuôi tan thành sao nhỏ, xanh tím + vàng.
   #22 no_trung            — 768×768. Vụ nổ khi trúng đòn: chớp sáng trắng giữa, tia vàng toả ra, sao nhỏ bắn ra.
   #23 no_tuyet_ky         — 1024×1024. Vụ nổ TUYỆT KỸ: cột sáng vàng–tím, vòng sóng xung kích, rất nhiều sao, hoành tráng nhất bộ.
   #24 vong_tu_luc         — 1024×1024. Vòng tròn phép thuật vàng kim nhìn CHÉO từ trên (hình elip nằm trên mặt đất), có hoa văn rune trang trí
                             (KHÔNG phải chữ thật), vài cột sáng mảnh bốc lên — pháp sư đứng giữa vòng này khi tụ lực tuyệt kỹ.
   #25 chieu_xit           — 512×512. Chiêu xịt: làn khói xám mỏng + vài tia lửa tắt, buồn cười dễ thương (không đáng sợ).
   #26 hoi_mau             — 512×512. Quái hồi máu: hạt sáng xanh lục + lá nhỏ bay lên thành cột.
   #27 sao_hat             — 128×128. MỘT ngôi sao lấp lánh 4 cánh màu vàng trắng (code nhân bản thành mưa sao).
   #28 bang_ten_chieu      — 1200×260. Dải ruy băng vàng kim ngang, RUỘT TRỐNG (code đặt tên chiêu), 2 đầu xoè đuôi én.
   #29 bang_tuyet_ky       — 1400×420. Như #28 nhưng lớn và hoành tráng hơn: có cánh/tia sáng toả sau dải, viên đá quý giữa trên.
E. Tư thế pháp sư (giữ đúng nhân vật đính kèm)
   #30 nv_nam_niem_phep    — pháp sư nam giơ gậy, đầu gậy tụ quả cầu sáng xanh tím, áo choàng tung nhẹ.
   #31 nv_nu_niem_phep     — như #30, pháp sư nữ.
   #32 nv_nam_tung_chieu   — pháp sư nam vung gậy về phía trước (bên phải), tư thế dứt khoát, vệt sáng theo gậy.
   #33 nv_nu_tung_chieu    — như #32, pháp sư nữ.

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #01.
```

> **Khi hình về (Claude làm):** kiểm từng hình đối chiếu danh sách (soi hình trùng/lệch, nhân vật #30–33 có đúng người trong nv_nam/nv_nu không) ·
> cắt 9 mảnh + nén vào `public/bk-ui/hs/skin/rpg/dau/` (khung/nút PNG, hiệu ứng PNG ≤512², nhân vật 512²) · khai vào `skin/styles/rpg.ts` mục `tran`
> (thêm trường ảnh: `border-image` cho khung/phiến/nút, ảnh cho ngọc · HUD · hiệu ứng) · `KhungTran.tsx` đọc ảnh, thiếu ảnh nào thì giữ hình tạm CSS chỗ đó ·
> hiệu ứng #21–#29 vào cảnh trận (sprite quay mặt camera — cùng cách quaiAnh.ts) · đo lại máy yếu (iPad gen 7). Style "Tối giản" KHÔNG cần bộ này
> (tắt hiệu ứng game).


---

## Đơn 7-0 — CHỌN HƯỚNG bản đồ phiêu lưu (thế giới → lục địa → chặng): 4 hướng × 3 tầng = 12 ảnh để Thùy chọn — soạn 02/10, ĐỨNG TRƯỚC Đơn 7

> **Thùy 02/10:** "màn đấu để sau, cần world map trước — chủ đề → chuyên đề → dạng bài; cần đơn prompt thiết kế để t chọn".
> Đơn này THAY mục A của Đơn 7 (3 ảnh toàn cảnh 1 hướng). Chọn xong hướng nào ⇒ Đơn 7 từ mục B vẽ theo hướng đó (tao sửa mô tả phong cách
> trong Đơn 7 cho khớp trước khi gửi). Có thể chọn LAI (vd khung tầng 1 của hướng B + tầng 3 của hướng C) — ghi rõ khi chọn.
> **Cách gửi:** context ChatGPT MỚI → dán `CHATGPT-UI-KIT.md` → dán khối đơn dưới → đính kèm 3 ảnh phong cách `design/bk-ui-src/Nền app HS cấp 3_1.png` ·
> `Nền app HS cấp 3_2.png` · `Nền app HS cấp 3_11.png` (chỉ để hiểu app đang trông thế nào — các hướng KHÔNG bắt buộc giống). Mỗi ảnh tải về
> `design/bk-ui-src/Adventure2D/chon_huong/`, gõ "tiếp". Đặt ảnh 3 tầng của cùng 1 hướng cạnh nhau để so.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            adventure-map-concept (CHỌN HƯỚNG thiết kế bản đồ phiêu lưu — chưa phải hình giao thật)
Mô tả:          App học Toán cho học sinh lớp 4–12, chủ đề "Giải cứu thế giới — đánh quái vật". Kiến thức chia 3 tầng, mỗi tầng 1 màn bản đồ:
                  TẦNG 1 — BẢN ĐỒ THẾ GIỚI: mỗi CHỦ ĐỀ là 1 LỤC ĐỊA / hòn đảo lớn (mỗi khối lớp có 2–10 chủ đề).
                  TẦNG 2 — BẢN ĐỒ LỤC ĐỊA: bấm 1 lục địa ⇒ thấy các VÙNG bên trong; mỗi CHUYÊN ĐỀ là 1 VÙNG có 1 điểm mốc (1–8 vùng/lục địa).
                  TẦNG 3 — CHẶNG ĐƯỜNG: bấm 1 vùng ⇒ thấy con đường đi qua các TRẠM; mỗi DẠNG BÀI là 1 TRẠM có quái canh (3–10 trạm/vùng).
                Trên bản đồ học sinh phải NHÌN RA NGAY: chỗ nào đã chinh phục (cắm cờ, sáng), chỗ nào đang đánh (có quái), chỗ nào chưa tới (sương mù).
                Lập trình viên GHÉP hình và vẽ thêm nhãn tên, số tiến độ, đường đi, sương, cờ bằng code ⇒ trong ảnh KHÔNG có chữ.
                Thiết bị: iPad NGANG 1180×820 và máy tính. Học sinh mở màn này mỗi ngày ⇒ phải đẹp lâu không chán, rõ ràng, không rối mắt.
Phiên bản kit:  v1

══ CÁCH GIAO HÀNG (bắt buộc) ══
- KHÔNG zip, KHÔNG DESIGN.md, KHÔNG dựng bằng code/SVG/HTML. MỖI LƯỢT = ĐÚNG 1 ẢNH vẽ bằng công cụ tạo ảnh, ngang 1672×941.
- Dòng đầu ghi số + tên, vd "#B2 huong_B_luc_dia". Vẽ xong dừng, chờ tôi gõ "tiếp".
- KHÔNG chữ, số, logo trong ảnh (nhãn tên = khung trống nhỏ hoặc vạch mờ).

══ MỖI HƯỚNG VẼ ĐỦ 3 TẦNG — cùng 1 nội dung để so cho công bằng ══
- Tầng 1 (thế giới): ĐÚNG 8 lục địa rời nhau, to nhỏ khác nhau, mỗi cái 1 vùng khí hậu khác (rừng phép · băng tuyết · núi lửa tươi sáng ·
  quần đảo biển · sa mạc ốc đảo · đầm lầy đom đóm · thành cổ đổ nát · đảo trời pha lê). 3 lục địa đã chinh phục (cắm cờ, sáng hơn),
  1 lục địa đang đánh (phát sáng nhẹ + nhân vật pháp sư nhỏ đứng trên), 4 lục địa chưa tới (phủ mây sương). Có chỗ trống quanh mỗi lục địa
  để đặt nhãn tên.
- Tầng 2 (lục địa RỪNG PHÉP cận cảnh): 6 điểm mốc (thành nhỏ · tháp phép · trại lều · đền cổ · cổng đá · cây cầu) nối bằng 1 con đường;
  2 mốc đầu đã cắm cờ, mốc 3 đang có quái, 3 mốc cuối phủ sương.
- Tầng 3 (chặng đường trong vùng rừng): con đường đi qua 7 trạm, mỗi trạm 1 bệ đá có 1 quái nhỏ dễ thương; trạm cuối quái to đội vương miện;
  3 trạm đầu đã hạ (cờ, không còn quái), pháp sư nhỏ đứng ở trạm 4, 3 trạm cuối mờ trong sương.

══ 4 HƯỚNG (mỗi hướng 3 ảnh, vẽ lần lượt A1 A2 A3 → B1 B2 B3 → …) ══
HƯỚNG A — "Đảo trời đêm sao" (anime RPG, giống app hiện tại)
   Lục địa là các đảo NỔI giữa bầu trời đêm xanh tím, dưới đảo là rễ đá + thác nước rơi vào mây, sao lấp lánh, ánh vàng cổ.
   Nhìn chéo từ trên cao. Tham khảo cảm giác: Genshin Impact, Honkai Star Rail. Huyền ảo, lung linh.
   #A1 huong_A_the_gioi · #A2 huong_A_luc_dia · #A3 huong_A_chang
HƯỚNG B — "Bản đồ kho báu giấy da" (vẽ tay màu nước)
   Cả màn là 1 tấm bản đồ giấy da cũ: biển xanh nhạt, lục địa vẽ mực nâu + tô màu nước, núi/rừng vẽ ký hiệu nhỏ, la bàn, đường đi nét đứt đỏ,
   mép giấy sờn. Sáng, sạch, rất dễ đọc. Tham khảo cảm giác: bản đồ trong sách phiêu lưu, Zelda Wind Waker sea chart.
   #B1 huong_B_the_gioi · #B2 huong_B_luc_dia · #B3 huong_B_chang
HƯỚNG C — "Mô hình đồ chơi" (diorama 3D nhìn chéo, màu kẹo)
   Mỗi lục địa như 1 mô hình đồ chơi khối tròn trịa đặt trên mặt nước phẳng, màu pastel tươi, bóng đổ mềm, chi tiết nhỏ xinh (cây kẹo bông,
   nhà nấm). Ánh sáng ban ngày. Tham khảo cảm giác: Monument Valley, Animal Crossing, Mario overworld.
   #C1 huong_C_the_gioi · #C2 huong_C_luc_dia · #C3 huong_C_chang
HƯỚNG D — "Bàn cờ phiêu lưu" (board game)
   Thế giới như 1 bàn cờ: các lục địa là những miếng bản đồ ghép, đường đi là các Ô TRÒN nối nhau như bàn cờ (mỗi trạm 1 ô to có bệ),
   màu tươi đậm, viền rõ, rất "game". Tham khảo cảm giác: Mario Party, Candy Crush saga map, Duolingo path.
   #D1 huong_D_the_gioi · #D2 huong_D_luc_dia · #D3 huong_D_chang

GHI ĐÈ KIT §1: KHÔNG chữ trong mọi hình. KHÔNG khẩu hiệu.
Bắt đầu với #A1.
```

> **Thùy chọn xong (Claude làm):** ghi hướng đã chọn vào `spec-v1-app-hs.md` §4.5 · sửa mô tả phong cách + chuẩn ảnh của Đơn 7 mục B–G theo hướng đó
> (hướng B/D có thể cần thêm: tấm giấy nền / ô bàn cờ thay cho bệ đá) · khung code 2D (`phieuluu/ban2d/`) giữ nguyên, chỉ đổi hình + hiệu ứng cho hợp
> (vd hướng B: sương = vết mực mờ, cờ = ghim đỏ; hướng D: đường = chuỗi ô tròn).
