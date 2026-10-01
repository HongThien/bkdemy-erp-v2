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

## 0. Quyết định thiết kế (Claude đề xuất 01/10 — Thùy bác chỗ nào thì sửa trước khi gửi)

| # | Vấn đề | Chọn | Vì sao |
|---|---|---|---|
| 1 | Tên style trong app | **"Khối vuông"** (id `khoi`), dòng phụ "giống: Minecraft · Roblox" | Minecraft là thương hiệu của Mojang/Microsoft. App chỉ nêu tên để so sánh, như RPG ghi "Genshin · Star Rail" |
| 2 | Mức "giống Minecraft" | **Giống CHẤT (thế giới khối vuông, voxel), KHÔNG giống ĐỒ** | Không Steve/Alex, Creeper, Zombie, Enderman, slime khối xanh, không texture cỏ-đất-đá, logo, font, vật phẩm (bàn chế tạo, cuốc kim cương…) của Minecraft. HS nhận ra là nói trung tâm copy (luật chung của mọi đơn) |
| 3 | Sáng hay tối | **Style SÁNG** (chỉ chế độ sáng) — Thùy 01/10: chưa cần bản tối | RPG chỉ có nền tối ⇒ 2 style phủ 2 nhu cầu. Ảnh mẫu Thùy gửi là ban ngày. Bản đêm (hang mỏ) để sau |
| 4 | Font | Tiêu đề **Handjet** đậm (chữ pixel) · chữ thường **Baloo 2** | Đơn 2 cũ ghi "font pixel mất dấu tiếng Việt". Thử thật 01/10: Press Start 2P, Pixelify Sans, Silkscreen mất dấu; **Handjet, VT323, Bungee đủ dấu**. Handjet ra chất pixel mà vẫn dễ đọc |
| 5 | Dáng thẻ / nút | **"Khối"**: góc vuông, viền tối 3px, vát sáng trên-trái + tối dưới-phải như viên gạch nổi. Nền thẻ = tấm ván/giấy da sáng, hơi trong | Ngôn ngữ khối. Thẻ phải tự đọc được trên nền ảnh |
| 6 | Nhân vật | 2 nhà thám hiểm khối vuông TỰ THIẾT KẾ + bạn đồng hành (cáo / cú) | Hợp đồng style có chỗ `nhanVat {nam, nu}` — Home ngang đứng nửa trái như RPG |
| 7 | Bản đồ + quái (K2) | **CÙNG tên vùng đất + tên quái với Đơn 6 RPG**, chỉ khác hình | DB gán `biome` / `loai_quai` cố định cho từng chủ đề / cụm ⇒ đổi style chỉ đổi thư mục hình (`spec-v1-app-hs.md` §4.4) |

---

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md` → dán khối **PHONG CÁCH CHUNG — KHỐI VUÔNG** (ngay dưới) → dán nguyên khối **ĐƠN ĐẶT HÀNG**.
2. Đính kèm (tất cả ở `design/handoff/hs-skin-khoi-v1/reference/`, riêng ảnh RPG ở `design/bk-ui-src/`):
   - `khong_khi_ho_rung.jpg` — lấy **KHÔNG KHÍ + ÁNH SÁNG** (hồ trong, rừng khối, nắng). Không chép cảnh.
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
Không khí:   thế giới KHỐI VUÔNG (voxel) BAN NGÀY, đẹp như game khối vuông chạy shader: nắng mềm từ trái-trên, trời xanh mây trắng,
             nước hồ trong vắt phản chiếu, cây cối khối xanh mướt, bóng đổ mềm, ánh sáng ấm. Tươi, sáng, phiêu lưu, thân thiện.
             Ảnh đính kèm khong_khi_ho_rung.jpg CHỈ để lấy không khí + ánh sáng — KHÔNG chép cảnh.
THIẾT KẾ GỐC (bắt buộc): KHÔNG vẽ Steve, Alex, Creeper, Zombie, Skeleton, Enderman, slime khối xanh hay bất kỳ nhân vật / quái /
             vật phẩm / texture / logo / font nhận ra được của Minecraft hay Roblox. Khối có texture TỰ THIẾT KẾ, đơn giản.
             Học sinh nhìn ra là đồ của game khác thì coi như hỏng.
Bảng màu:    trời #8ecbf1 → #cfe9fb · cỏ #5fa83a / #3f7d26 · đất #8b5a2b · gỗ ván #c8a46b / #9b7440 · đá #8e8e8e / #5f5f5f
             · nước #2c8fd6 → #47c1c9 · quặng ngọc #3fd4b8 · vàng #f2c94c · đỏ #e04b3c · viền khối #1e1e1e
             · chữ tối #1f2328 · chữ phụ #4b5563.
Thẻ:         "KHỐI": góc VUÔNG (không bo), viền tối #1e1e1e dày 3px, mặt có VÁT sáng 3px ở cạnh trên-trái và tối 3px ở cạnh dưới-phải
             như viên gạch nổi. Nền thẻ = tấm giấy da / ván gỗ SÁNG #f6efdf ~92% đục (nhìn xuyên nhẹ tranh nền). Khung gần VUÔNG —
             KHÔNG thẻ dẹt trải ngang. Dải tiêu đề thẻ (khi có) = tấm ván gỗ #9b7440, chữ trắng có bóng đen 2px.
Nút:         nút chính = khối cỏ xanh #5fa83a (mép trên có dải cỏ sẫm), chữ trắng bóng đen 2px; nút phụ = khối đá xám sáng. Bấm = lún 2px.
             Thanh tiến độ = dãy Ô VUÔNG nhỏ liền nhau (đầy = xanh lá, chưa đầy = xám). Badge số = ô VUÔNG đỏ #e04b3c chữ trắng.
Chữ:         tiêu đề + số to = font Handjet đậm (chữ pixel, đủ dấu tiếng Việt) · chữ thường = Baloo 2. KHÔNG chữ viết tay, KHÔNG Pacifico,
             KHÔNG Press Start 2P / Pixelify / Silkscreen (mất dấu). Chữ chính ≥ 15px ở điện thoại, ≥ 16px ở iPad; tiếng Việt đúng dấu.
             Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (icon, nhân vật, quái, nền) KHÔNG có chữ/số nào — code tự vẽ chữ.
Hình / icon: đồ vật VOXEL 3D: cạnh khối rõ, mỗi mặt 2–3 sắc độ, viền tối mảnh, bóng đổ mềm, cùng nguồn nắng trái-trên, cùng góc nhìn
             3/4 từ trên, cùng độ chi tiết cho cả bộ. Tươi, đọc được rõ ở cỡ 44px trên nền thẻ sáng.
Thiết bị:    iPad NGANG 1180×820 (ảnh chính — làm khổ ngang trước) + điện thoại DỌC 430px. Màn được cuộn.
CẤM:         khẩu hiệu động viên · chữ tiếng Anh trang trí · trái tim / vương miện / doodle trang trí · máu me, đáng sợ.

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#13 khoi_o_tu_luyen".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (15 icon ô, 2 nhân vật, các quái) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context này: giữ góc nhìn, nguồn sáng,
  độ chi tiết, chỉ đổi đồ vật.
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
  - Góc trên trái: TẤM TÊN = avatar vuông (2 chữ "MK") + "Nguyễn Minh Khang" + "HS0412 · 9A1 · Toán" + vạch ngăn + biểu tượng bậc rank
    nhỏ (khiên) + "Captain" + 2 sao.
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
    ho_rung : hồ nước trong ven rừng khối (đúng không khí ảnh mẫu) — mặc định
    dong_co : đồng cỏ hoa khối, làng nhỏ mái đỏ ở xa, cối xay gió khối
    tuyet   : vùng tuyết ban ngày — cây thông khối phủ tuyết, hồ băng, trời xanh nhạt
  2 NHÂN VẬT em tự chọn (KHÔNG gán theo giới tính), cùng phong cách, cùng tư thế đứng:
    nam : nhà thám hiểm khối vuông — áo khoác xanh rêu, khăn quàng cam, ba lô da, tay cầm đèn lồng; bạn đồng hành = CÁO CON cam khối
          ngồi cạnh chân.
    nu  : nhà thám hiểm khối vuông — áo len vàng nghệ dưới áo khoác nâu, mũ len xanh ngọc, tay ôm cuốn sổ bản đồ; bạn đồng hành =
          CÚ MÈO trắng khối đậu trên vai.
    Đầu khối tỉ lệ chibi (đầu ≈ 1/3 chiều cao), mặt vẽ kiểu anime đơn giản trên mặt khối (mắt to có ánh) — KHÁC hẳn mặt pixel 8×8 của
    Steve/Alex; trang phục kín đáo (áo khoác + quần dài). Không vũ khí.

Phiên bản kit:  v3 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ CHUẨN TỪNG LOẠI ══
- ICON (ô, banner): vuông 1254×1254, nền TRONG SUỐT thật (không nền trắng, không ô caro giả), vật thể ở GIỮA chiếm ~80% khung,
  không chữ/số/badge, không khung ô phía sau. Cả bộ cùng góc nhìn 3/4 từ trên, nắng trái-trên, cùng độ chi tiết.
- NHÂN VẬT: dọc 1122×1402, nền TRONG SUỐT, TOÀN THÂN đứng thẳng nghiêng 3/4 về phía người xem, chân chạm mép dưới khung, bạn đồng hành
  nằm TRONG cùng hình.
- NỀN NGANG: 1672×941, nền đặc, KHÔNG nhân vật, KHÔNG chữ. Cảnh chính (cây to, nhà, núi) dồn sang TRÁI; 65% bên PHẢI là trời / mặt
  hồ / đồng cỏ SÁNG, ÍT chi tiết (để đặt thẻ lên, chữ tối phải đọc được).
- NỀN DỌC: 940×1672 (đúng 9:16), nền đặc, KHÔNG nhân vật. Cảnh chính ở 40% TRÊN; 60% DƯỚI phẳng, sáng dịu, ít chi tiết.
- TRANG TRÍ: góc 1254×1254 trong suốt (dây leo lá khối chạy theo 2 cạnh vuông góc, góc trên-trái); gạch phân cách 1672×200 trong suốt
  (1 dải khối mảnh nằm ngang).

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 khoi_man_chinh_ipad — màn chính khổ NGANG, nền ho_rung, nhân vật nam + cáo   → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 khoi_man_chinh_dt   — màn chính khổ DỌC, nền ho_rung, nhân vật nu + cú
   #03 khoi_nhiem_vu_ipad  — màn Nhiệm vụ khổ ngang
   #04 khoi_lam_bai_ipad   — màn Làm bài khổ ngang
B. Nền:
   #05 khoi_bg_ho_rung_ngang · #06 khoi_bg_ho_rung_doc · #07 khoi_bg_dong_co_ngang · #08 khoi_bg_dong_co_doc
   #09 khoi_bg_tuyet_ngang · #10 khoi_bg_tuyet_doc
C. Nhân vật (vẽ đúng như trong #01 / #02 đã duyệt):
   #11 khoi_nv_nam · #12 khoi_nv_nu
D. Icon ô chức năng (mỗi ô 1 ĐỒ VẬT KHÁC NHAU, không trùng hình với nhau):
   #13 khoi_o_tu_luyen      — cây cuốc gỗ cán quấn dây cắm vào tảng đá có mạch quặng xanh ngọc phát sáng
   #14 khoi_o_nhiem_vu      — bảng nhiệm vụ bằng gỗ khối ghim 3 tờ giấy, 1 đèn lồng nhỏ treo góc
   #15 khoi_o_rank          — tấm khiên khối viền sắt, giữa có ngôi sao vàng
   #16 khoi_o_thong_tin     — cuộn bản đồ khối mở ra, đường chấm đỏ + 1 ghim cắm
   #17 khoi_o_so_tay        — cuốn sách khối bìa xanh lá, dây đánh dấu đỏ, bút lông cắm bên cạnh
   #18 khoi_o_thi_thu       — cánh cổng sắt khối có ổ khoá — tông XÁM, không nắng (ô đang khoá)
   #19 khoi_o_bai_tap_giao  — phong thư khối có dấu sáp đỏ
   #20 khoi_o_cup           — cúp vàng khối đặt trên bục đá (dùng cho Thành tựu + Bảng xếp hạng)
   #21 khoi_o_may_man       — rương gỗ khối mở hé, ánh vàng + vài đồng xu VUÔNG bay lên
   #22 khoi_o_vi_xu         — túi da khối buộc dây + chồng đồng xu vuông vàng
   #23 khoi_o_the_gioi      — quả địa cầu khối (đất xanh lá + biển xanh dương) trên chân đế gỗ
   #24 khoi_o_tren_lop      — ba lô khối màu xanh dương + 1 cuốn sách thò ra
   #25 khoi_o_et            — đồng hồ cát khối đứng cạnh 1 tờ bài có dấu tích
   #26 khoi_o_btvn          — ngôi nhà khối nhỏ mái đỏ, cuốn vở mở đặt trước cửa
   #27 khoi_o_hoc_tu_dau    — bậc thang khối uốn lên 1 ngọn đồi nhỏ, lá cờ trên đỉnh
E. Icon banner:
   #28 khoi_b_lich          — tấm lịch gỗ khối có vài ô đánh dấu (thẻ ca bổ trợ)
   #29 khoi_b_kiem_tra_lai  — tờ giấy khối có dấu tích, ánh HỒNG (banner bài kiểm tra lại)
F. Trang trí:
   #30 khoi_tt_goc          — góc dây leo lá khối
   #31 khoi_tt_gach         — dải gạch phân cách khối (cỏ trên đất, mảnh)

LUẬT RIÊNG:
  - Giữ nguyên danh sách ô, tên, thứ tự, số như mô tả. Không thêm tính năng, không thêm chữ.
  - Câu duy nhất có "giọng" = bong bóng thoại của nhân vật, phải có số thật.
  - Chữ trên nền ảnh / nền khối nhiều màu phải đọc được (chữ trắng có viền/bóng đen 2px, hoặc đặt trong thẻ sáng).

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
Phong cách:     theo PHONG CÁCH CHUNG — KHỐI VUÔNG + hình đã duyệt đính kèm. Quái DỄ THƯƠNG – NGỘ NGHĨNH (học sinh lớp 3–12),
                KHÔNG ghê sợ, KHÔNG máu me. Quái là sinh vật khối TỰ THIẾT KẾ — KHÔNG giống Creeper, Zombie, Skeleton, Slime,
                Enderman, Ghast… của Minecraft (vd slime ở đây là giọt thạch khối có tay nhỏ, đội lá, mắt to — không phải khối lập
                phương xanh mặt đơn giản).
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
   #39 co_chinh_phuc (lá cờ khối cắm đất) · #40 ruong_khu_vuc (rương thưởng khối) · #41 cong_khu_vuc (cổng đá khối vào khu)

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
