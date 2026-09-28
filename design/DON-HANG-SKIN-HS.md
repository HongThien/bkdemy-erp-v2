# Đơn đặt hàng ChatGPT — skin app HS theo 3 nhóm khối

> Soạn 28/09/2026. Thùy chốt: **mỗi nhóm khối có bộ skin riêng**.
> - **Thị trấn** (chuẩn thiết kế lớp 3–5, mở cho mọi khối — Thùy 28/09 tối) → **Đơn 1 v2** (giao không qua zip, như Đơn 3 v3)
> - **Lớp 6–8** · gốc **Khối vuông** · không có điện thoại riêng → **Đơn 2**
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

---

## Đơn 2 — Lớp 6–8 · Khối vuông

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
