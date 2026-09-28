# Đơn đặt hàng ChatGPT — skin app HS theo 3 nhóm khối

> Soạn 28/09/2026. Thùy chốt: **mỗi nhóm khối có bộ skin riêng**.
> - **Lớp 3–5** · gốc **Thị trấn** · iPad/laptop, không có điện thoại riêng → **Đơn 1**
> - **Lớp 6–8** · gốc **Khối vuông** · không có điện thoại riêng → **Đơn 2**
> - **Lớp 9–12** · nhiều skin để HS chọn · có điện thoại riêng. 4 skin (Tối giản, Đấu trường, Y2K, Soft Hàn) Claude dựng bằng code, không cần ChatGPT.
>   2 skin cần hình → **Đơn 3 v2 (Lo-fi đêm)** và **Đơn 4 v2 (Anime RPG)** — cả 2 theo "BỐ CỤC CHUNG lớp 9–12" (ảnh gốc RPG Thùy đã xem).
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
   Đơn 3–4 cũng chạy đủ 4 pha (luật 28/09: KHÔNG còn đơn "chỉ sinh hình"). Đơn 3–4 dán thêm mục "BỐ CỤC CHUNG lớp 9–12" ngay sau khối đơn.
5. Kiểm trước khi nhận: zip PHẢI có `reference/` (ảnh toàn cảnh mọi khổ màn + trạng thái) và DESIGN.md có cột "Vị trí & cỡ".
   Thiếu 1 trong 2 → trả lại ngay, chưa cần gửi Claude.
6. Nhận zip → bỏ vào `design/handoff/` (KHÔNG bỏ vào `public/`) → báo Claude.

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

## Đơn 3 v2 — Lớp 9–12 · skin Lo-fi đêm (làm lại TOÀN BỘ — v1 bị trả)

> v1 bị trả vì: 2 tranh nền là khối hình phẳng ghép bằng code (không phải tranh vẽ bằng công cụ tạo ảnh), 2 biến thể gần trùng nhau
> (lệch trung bình 0,4/255), DESIGN.md thiếu 4/6 mục, không có ảnh toàn cảnh.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            home-912-lofi
Mô tả màn:      Màn chính app học sinh LỚP 9–12 (14–18 tuổi, có điện thoại riêng), skin "Lo-fi đêm". Bố cục theo đúng mục
                "BỐ CỤC CHUNG lớp 9–12" dán kèm bên dưới + ảnh bố cục mẫu reference_rpg_ipad.png (chỉ lấy BỐ CỤC, không lấy phong cách).
                2 khổ: iPad NGANG 1180×820 (ảnh chính) và điện thoại DỌC 430px 9:16.
Phần tử ĐỘNG:   như "BỐ CỤC CHUNG": tên, mã, cấp + XP, xu, Elo + hạng, đếm ngược THPT, 2 banner, badge, trạng thái từng ô, câu thoại.
Trạng thái:     ① ② ③ như "BỐ CỤC CHUNG" — mỗi trạng thái 1 ảnh cho MỖI khổ màn (6 ảnh).
Biến thể:       2 tranh nền HS tự chọn — `thanh_pho` (cửa sổ nhìn ra thành phố đêm) và `mua` (cửa sổ mưa). PHẢI khác nhau rõ ràng.
                2 nhân vật HS tự chọn — `nam` và `nu`.
Phong cách:     lo-fi study aesthetic kiểu tranh nền Lofi Girl / anime (TỰ VẼ, không chép): phòng học ban đêm, đèn bàn ấm cam #ffb066,
                tông chàm #1d1b3a → tím mận #3b2b52. Nhân vật = học sinh cấp 3 mặc hoodie, đeo tai nghe, cầm bút/sách; bạn đồng
                hành = mèo cam ngủ gật. Thẻ/ô nền tối trong mờ, viền mảnh sáng. Icon 11 ô vẽ cùng phong cách (đồ vật trên bàn học
                ban đêm: đèn, sổ, cốc, tai nghe…), mỗi ô 1 đồ vật khác nhau.
Giữ nguyên:     danh sách ô, tên, thứ tự theo khối; không thêm chức năng.
Phiên bản kit:  v2
Chạy đủ 4 pha A→D. Pha B: vẽ ảnh ① iPad ngang trước, chờ Thùy duyệt, rồi mới vẽ các ảnh còn lại.

GHI ĐÈ KIT §1: font chữ = Nunito (tiêu đề + thân), KHÔNG Baloo 2 / Pacifico, KHÔNG chữ viết tay. Màn được cuộn.
LUẬT RIÊNG:
  - MỌI hình (tranh nền, nhân vật, icon) sinh bằng CÔNG CỤ TẠO ẢNH, từng cái một. CẤM vẽ bằng code / SVG / Python-PIL / ghép khối hình.
  - Không khẩu hiệu động viên, không chữ tiếng Anh trang trí. Câu duy nhất có "giọng" = bong bóng thoại, phải có số thật.
  - DESIGN.md: bảng kiểm kê có cột "Vị trí & cỡ" cho TỪNG khổ màn (kit §4). Đếm đối chiếu ảnh ↔ assets trước khi đóng zip (kit §8 câu 9–11).

ASSETS TỐI THIỂU (đếm lại theo ảnh toàn cảnh, thấy gì trong ảnh phải có file):
  backdrop/backdrop_lofi_thanh_pho_ngang.png 1920×1080 · backdrop_lofi_thanh_pho_doc.png 1080×1920
  backdrop/backdrop_lofi_mua_ngang.png 1920×1080 · backdrop_lofi_mua_doc.png 1080×1920
  characters/character_lofi_nam.png · character_lofi_nu.png (cao ≥ 1200, nền trong suốt, CÓ mèo)
  illustrations/ill_lofi_<id>.png × 11 ô: tu_luyen, thong_tin, so_tay, de_thi_thu, bai_tap_giao, thanh_tuu, may_man, vi_xu,
                 bai_tren_lop, et, btvn  + hoc_tu_dau  + 2 icon banner: lich, kiem_tra_lai   (≥ 512, nền trong suốt)
  illustrations/ill_lofi_sao_cap.png · ill_lofi_dong_xu.png (icon nhỏ trong viên thuốc)
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
