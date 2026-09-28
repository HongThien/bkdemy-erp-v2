# Đơn đặt hàng ChatGPT — skin app HS theo 3 nhóm khối

> Soạn 28/09/2026. Thùy chốt: **mỗi nhóm khối có bộ skin riêng**.
> - **Lớp 3–5** · gốc **Thị trấn** · iPad/laptop, không có điện thoại riêng → **Đơn 1**
> - **Lớp 6–8** · gốc **Khối vuông** · không có điện thoại riêng → **Đơn 2**
> - **Lớp 9–12** · nhiều skin để HS chọn · có điện thoại riêng. 4 skin (Tối giản, Đấu trường, Y2K, Soft Hàn) Claude dựng bằng code, không cần ChatGPT.
>   Chỉ 2 skin cần hình → **Đơn 3 (Lo-fi đêm)** và **Đơn 4 (Anime RPG)**
>
> Spec tổng: `spec-giao-dien-hs.md`.

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` (như mọi lần).
2. Dán **nguyên khối ĐƠN ĐẶT HÀNG** của đơn đó (kể cả phần "Ghi đè kit" và "Luật riêng").
3. Đính kèm ảnh tham chiếu ghi trong đơn. Ảnh chụp mockup từ trang:
   - Đơn 1–2: https://claude.ai/artifact/M2w9GCJzYAaa1hB1NULg6x (mẫu "Thị trấn", "Khối vuông")
   - Đơn 3–4: https://claude.ai/artifact/LZF11536BxanSuLQcnbWiR (mẫu "Lo-fi đêm", "Anime RPG")
   Ảnh chỉ để lấy **không khí và màu**. Chữ và bố cục theo đơn, không theo ảnh.
4. Đơn 1–2 chạy đủ 4 pha (A→D). Duyệt mockup ở Pha B **trước** khi cho sinh asset.
   Đơn 3–4 bỏ Pha B/C (bố cục đã dựng bằng code), vào thẳng Pha D.
5. Nhận zip → bỏ vào `design/handoff/` → báo Claude.

---

## Đơn 1 — Lớp 3–5 · Thị trấn

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-k35
Mô tả màn:      Màn chính app học sinh LỚP 3–5 (8–11 tuổi) của trung tâm dạy thêm BK Academy. Các em KHÔNG có điện thoại
                riêng: dùng iPad hoặc laptop ở trung tâm/ở nhà, máy dùng chung. Mở app để vào luyện bài, xem lịch bổ trợ,
                quay may mắn, xem thành tựu.
                Thiết bị: iPad NGANG 1180×820 (ảnh chính) + laptop 1440×900 (1 ảnh, cùng bố cục, rộng hơn).
                Màn ĐƯỢC CUỘN nhẹ (không bắt buộc gọn 1 màn).

Phần tử ĐỘNG (mọi thứ đổi theo dữ liệu — vẽ bằng chữ/khối, không vẽ vào ảnh):
  - Thanh trên: avatar nhỏ (ảnh thật hoặc 2 chữ viết tắt trong vòng tròn) · họ tên · mã HS (vd HS0412) · nút Hòm thư có
    badge số tin chưa đọc (0 thì ẩn badge) · nút Thoát.
  - Khu chào: "Chào Minh Khang!" (2 từ cuối của tên) · CẤP (vd "Cấp 12") · thanh XP (vd 640/1000) · số XU (vd 1.240).
  - Linh vật + bong bóng thoại 1 câu CÓ SỐ THẬT, vd "Còn 3 câu nữa là đủ 10 câu hôm nay!", "Em có 1 lượt quay may mắn!".
  - Banner BỔ TRỢ (chỉ hiện khi có lịch): "Bổ trợ yếu · Thứ 5 12/10 · 17:30 · Phòng 204". Khi tới giờ: nút nổi "Vào ca ngay".
  - Banner BÀI KIỂM TRA LẠI (chỉ hiện khi có): "2 bài chờ làm".
  - 8 ô chức năng, đúng thứ tự, mỗi ô: icon + tên + 1 dòng trạng thái + (badge số nếu có):
      1 Tự luyện            — "Luyện theo dạng yếu"
      2 Thông tin học tập   — "Xem dạng đang yếu"
      3 Sổ tay kiến thức    — "Tra lý thuyết & bài mẫu"
      4 Làm đề thi thử      — "Sắp có" (ô xám, khoá, không bấm được)
      5 Bài tập được giao   — "2 bài chưa làm" (badge 2) / "Chưa có bài"
      6 Thành tựu           — "Xem giải thưởng của em"
      7 May mắn             — "Có 1 lượt quay!" (badge 1) / "Luyện 10 câu đúng ≥70%"
      8 Ví xu               — "1.240 xu"

Trạng thái (mỗi cái 1 ảnh, CÙNG bố cục):
  ① thường: có banner bổ trợ, Bài tập được giao có 2 bài, May mắn có lượt
  ② trống: không banner nào, mọi ô ở trạng thái "chưa có"
  ③ tới giờ bổ trợ: banner bổ trợ nổi bật với nút "Vào ca ngay" + có banner bài kiểm tra lại

Biến thể = 3 "làng" HS TỰ CHỌN (KHÔNG có biến thể nam/nữ). Chỉ đổi tranh nền + bảng màu + decor, bố cục y hệt:
  - lang_bien  : làng biển — xanh ngọc, cát vàng, thuyền, hải đăng xa
  - lang_nam   : làng rừng nấm — xanh lá, nấm đỏ chấm trắng, đom đóm
  - lang_keo   : làng kẹo — hồng, vàng bơ, mây bông, nhà bánh quy
Linh vật = 3 con HS TỰ CHỌN, dùng chung cho cả 3 làng: meo (mèo cam), cun (cún trắng tai nâu), rong (rồng con xanh ngọc).
  Mỗi con 1 file CHAR, tư thế vẫy tay, nhìn về phía người xem.

Phong cách: thị trấn ấm áp kiểu Play Together / Animal Crossing / Toca Boca nhưng THIẾT KẾ GỐC (không nhân vật, logo,
  hình dạng nhận ra được của game nào). Khối tròn mập, bo góc lớn; màu kẹo tươi nhưng độ bão hoà vừa phải; nút và ô kiểu
  "thạch": có 1 viền dưới đậm cùng tông (như bóng cứng 5px), bấm được rõ ràng; icon 8 ô là minh hoạ 3D mềm, mỗi ô 1 đồ vật
  của thị trấn (vd Tự luyện = bình tưới cây, Sổ tay = cuốn sổ có dây, May mắn = máy gắp thú, Ví xu = heo đất...).

Giữ nguyên: 8 chức năng, tên và thứ tự như trên. Không thêm chức năng. Không thêm nhân vật người.
Phiên bản kit:  v1

GHI ĐÈ KIT §1 "Nền tảng chung" cho đơn này:
  - Font: Baloo 2 cho MỌI chữ. KHÔNG dùng Pacifico/Itim, KHÔNG có chữ viết tay/doodle.
  - Màn được cuộn; khổ iPad ngang, không phải điện thoại 9:16.
LUẬT RIÊNG (lý do: HS chê bản cũ vì sến và dạy đời):
  - KHÔNG khẩu hiệu động viên ("Cố lên!", "Mỗi ngày tiến bộ", "You can do it"...). KHÔNG chữ tiếng Anh.
  - Câu duy nhất có "giọng" là câu thoại của linh vật, và phải có số thật.
  - Chữ chính ≥ 16px ở khổ iPad; tương phản chữ/nền đủ đọc (chữ tối trên nền sáng).
  - Mọi chữ tiếng Việt đúng dấu.
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

## Đơn 3 — Lớp 9–12 · skin Lo-fi đêm (chỉ tranh nền)

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            skin-lofi
Mô tả màn:      Bộ tranh nền cho skin "Lo-fi đêm" của màn Home app học sinh LỚP 9–12 (14–18 tuổi, có điện thoại riêng),
                điện thoại dọc 430px. Bố cục, chữ, thẻ, nút ĐÃ DỰNG BẰNG CODE (xem ảnh tham chiếu). Bạn CHỈ sinh tranh nền.
Phần tử ĐỘNG:   không có trong asset (toàn bộ chữ/số do code vẽ).
Trạng thái:     không.
Biến thể:       2 tranh nền HS tự chọn: "cửa sổ đêm thành phố" và "cửa sổ mưa".
Phong cách:     lo-fi study aesthetic, tranh nền anime (kiểu Lofi Girl / Makoto Shinkai nhưng TỰ VẼ, không chép), tông chàm
                #1d1b3a → tím mận #3b2b52, một nguồn sáng ấm đèn bàn cam #ffb066 ở góc trên phải.
Giữ nguyên:     không vẽ thẻ/chữ/nhân vật. Code đặt các thẻ bán trong suốt lên 75% phía dưới.
Phiên bản kit:  v1
Bỏ Pha B và C. Vào thẳng Pha D: sinh 2 file dưới, viết DESIGN.md ngắn (bảng 2 dòng loại BACKDROP), đóng zip hs-skin-lofi-v1.zip.
```

```
BACKDROP 1: Generate backdrop_lofi_city.png, 1080×1920 portrait. Cozy teenager's study corner at night seen from inside:
a large window in the upper third showing a distant Vietnamese city skyline with soft bokeh lights, a warm desk lamp glow
entering from the top-right corner, a few plants and a stack of books silhouetted on the windowsill. Lo-fi anime background
painting, soft grain, deep indigo #1d1b3a to plum #3b2b52 palette, warm orange #ffb066 accent light only near the lamp.
The lower 75% must be calm, dark and low-detail (just a softly lit wall/desk surface) so translucent cards on top stay readable.
ABSOLUTELY NO text, NO people, NO characters, NO animals, NO UI, NO frames, NO logos.

BACKDROP 2: Generate backdrop_lofi_rain.png, same size, same palette and same composition rules as backdrop_lofi_city.png,
but the window shows rain: raindrops and streaks on the glass, blurred street lights behind, slightly cooler blue in the window.
Lower 75% calm and dark. ABSOLUTELY NO text, NO people, NO characters, NO animals, NO UI, NO frames, NO logos.
```

---

## Đơn 4 — Lớp 9–12 · skin Anime RPG (tranh nền + hoa văn + 4 icon)

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            skin-rpg
Mô tả màn:      Bộ asset cho skin "Anime RPG" của màn Home app học sinh LỚP 9–12, điện thoại dọc 430px.
                Bố cục, chữ, thẻ, nút ĐÃ DỰNG BẰNG CODE (xem ảnh tham chiếu). Bạn CHỈ sinh: 1 tranh nền, 2 hoa văn, 4 icon ô chức năng.
Phần tử ĐỘNG:   không có trong asset.
Trạng thái:     không.
Biến thể:       không.
Phong cách:     giao diện game anime fantasy cao cấp (cảm hứng Genshin Impact / Honkai: Star Rail) nhưng THIẾT KẾ GỐC — không dùng
                nhân vật, biểu tượng, logo hay hoa văn nhận ra được của game nào. Xanh đêm #141a33 / #2c3a66 + vàng cổ #e9c77b / #f4d98f.
Giữ nguyên:     chữ tiếng Việt do code vẽ bằng font Philosopher, không đưa chữ vào asset.
Phiên bản kit:  v1
Bỏ Pha B và C. Vào thẳng Pha D: sinh 7 file dưới, viết DESIGN.md (bảng 7 dòng), đóng zip hs-skin-rpg-v1.zip.
```

```
BACKDROP: Generate backdrop_rpg_sky.png, 1080×1920 portrait. Fantasy night sky: deep navy #141a33 fading to #2c3a66 at the top,
faint constellations, a few small floating islands with tiny glowing ruins in the upper quarter only, thin gold light rays.
Painterly anime-game style, high polish. The lower 75% must be calm, dark, nearly empty (only faint stars) so cards stay readable.
ABSOLUTELY NO text, NO characters, NO UI panels, NO frames, NO logos.

DECOR 1: Generate decor_rpg_corner.png, 512×512, TRANSPARENT background. One ornate antique-gold filigree corner ornament
(top-left orientation, the two arms run along the top and left edges), fine engraved lines, subtle metallic shading, gold #e9c77b
to #f4d98f with dark bronze #6b5a33 edges. Will be rotated in code for the other 3 corners. Nothing else in the image.

DECOR 2: Generate decor_rpg_divider.png, 1024×128, TRANSPARENT background. A horizontal ornamental divider: thin gold line
with a small four-point star gem in the center and tapered flourishes to both ends, same gold palette as decor_rpg_corner.png.
Nothing else in the image.

ILLUST (×4, each 512×512, TRANSPARENT background, same lighting, same gold+navy+one accent colour, game item icon style,
centered with ~8% margin, no frame, no text):
  ill_rpg_lop.png      — a quill resting on an open parchment scroll with a faint blue glow (bài trên lớp)
  ill_rpg_btvn.png     — a sealed letter with a gold wax seal and a small ribbon (bài tập về nhà)
  ill_rpg_luyen.png    — a floating faceted crystal, cyan core, gold cage (tự luyện)
  ill_rpg_thithu.png   — an ornate closed treasure chest with gold trim and a keyhole glow (thi thử)
If you cannot produce real transparency, say so and use a flat #00FF00 background instead. Never erase white by colour-keying.
```
