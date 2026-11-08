# ĐƠN ĐẶT HÀNG — EMOJI & STICKER "THẾ GIỚI BK" (Đơn 6)
> Soạn 19/10 theo yêu cầu Thùy. Thay phần "20 icon tương tác" của Đơn 5 (`DON-HANG-GAMI-HS.md`) và thêm sticker bình luận + bản động.
> Mỗi đơn = 1 context ChatGPT MỚI. Dán theo thứ tự: ① `design/CHATGPT-UI-KIT.md` → ② khối **PHONG CÁCH CHUNG — ANIME RPG** (trong `DON-HANG-GAMI-HS.md`)
> → ③ khối **ĐƠN ĐẶT HÀNG** dưới đây. Đính kèm `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png` (lấy PHONG CÁCH).
> Danh mục gốc + lý do chọn/loại từng emoji: `design/THE-GIOI-BK-danh-muc-tuong-tac.md`. Mã = cột `ma` bảng `the_gioi_danh_muc` (DB) — KHÔNG đổi.

---

## KHỐI ĐƠN ĐẶT HÀNG (dán nguyên khối)

```
ĐƠN ĐẶT HÀNG — Đơn 6
App:            hs
Màn:            the-gioi-bk — emoji THẢ CẢM XÚC (icon) + STICKER BÌNH LUẬN
Mô tả:          "Thế giới BK" là mạng xã hội khoe thành tích nội bộ của học sinh BK Academy (lớp 3–12, nhiều nhất lớp 8+).
                Bạn bè thả CẢM XÚC vào tin của nhau (như nút Thích/Cảm xúc của Facebook) và gửi STICKER trong bình luận.
                Chỉ KHEN / cổ vũ MỘT CHIỀU — không hình nào đọc được thành mỉa mai.
                Tất cả là HÌNH RỜI: không chữ, không số trong hình (chữ do code vẽ).
Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG) nhưng là MẶT/VẬT LINH VẬT TRÒN DỄ THƯƠNG, nét sạch, tô cel mềm, vài đốm lấp lánh.
                Cả bộ cùng 1 họ: cùng độ dày nét viền, cùng nguồn sáng (trên-trái), cùng độ bão hoà.
                ICON: mỗi hình nằm trong khung TRÒN đế đồng/vàng cổ nhẹ để đồng bộ cả bộ (khung chiếm ≤ 90% ô vuông, chừa lề trong suốt 5%).
                STICKER: KHÔNG khung tròn — nhân vật/vật thể to, có viền trắng-kem dày quanh hình (kiểu miếng dán), dáng lớn hơn icon, có biểu cảm.
Phải đọc ra NGHĨA ở cỡ 24px (icon) — ít chi tiết nhỏ, tương phản mạnh, nổi trên nền XANH ĐÊM #141a33.
CẤM:            mặt người thật / chân dung · các mặt 💀 🗿 🤡 😂 🙃 🤓 😏 🥶 (teen dùng để mỉa) · chữ/số/dấu câu trong hình · 👑 (dành riêng cho "Thầy cô khen")
                · chép hình emoji của Apple/Google/Meta/Discord · tiếng Anh · máu, vũ khí thật.
Giữ nguyên:     nghĩa của emoji gốc (bảng dưới) — chỉ vẽ lại theo style.
Phiên bản kit:  v1

CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit):
- KHÔNG zip. KHÔNG DESIGN.md. KHÔNG dựng bằng code/SVG/HTML/Python/PIL, KHÔNG cắt từ ảnh ghép. Mỗi hình sinh mới bằng công cụ tạo ảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH. Dòng đầu ghi "#số — tên file". Vẽ xong DỪNG, chờ tôi gõ "tiếp".
- PNG, NỀN TRONG SUỐT THẬT (không bàn cờ giả, không nền trắng/đen). ICON 1024×1024 hoặc lớn hơn, vuông. STICKER 1024×1024, vuông.
- Hình cùng họ phải vẽ DỰA TRÊN hình đã duyệt trước trong context này (giữ khung, dày nét, nguồn sáng).

══ PHẦN 1 — ICON THẢ CẢM XÚC (22 hình · tên file tg_tt_<mã>) ══
#01 là BẢNG THỬ PHONG CÁCH: 1 ảnh gồm 6 icon (lua, vo_tay, de_goat, no_nao, ngau, tim) xếp lưới 3×2 để tôi duyệt họ hình. Chưa ưng thì sửa #01, ưng rồi mới vẽ lẻ.
Sau #01 vẽ LẺ từng hình, theo thứ tự dưới (mã — emoji gốc — nghĩa — gợi ý hình):
 thich      👍  Thích         bàn tay giơ ngón cái, bao tay giáp vàng
 tim        ❤️  Yêu thích      trái tim đỏ phát sáng, có ánh kim
 lua        🔥  Cháy          ngọn lửa tròn cam-vàng, mắt sáng (cháy quá = khen)
 vo_tay     👏  Vỗ tay        hai bàn tay vỗ vào nhau, vài tia sáng bắn ra
 de_goat    🐐  GOAT          dê núi oai vệ, sừng cong vàng, đứng trên mỏm đá
 no_nao     🤯  Nổ não        đầu linh vật toé tia sáng/sao nổ phía trên (sốc kiểu khen)
 cup        🏆  Vô địch       cúp vàng có hai quai, lấp lánh
 tram_diem  💯  100 điểm      VẼ bằng 1 huy hiệu tròn có vạch sao/ngọc, KHÔNG viết số 100
 ten_lua    🚀  Bay cao       tên lửa nhỏ phóng chéo lên, đuôi sao
 set        ⚡  Tốc độ        tia sét vàng, khung xanh điện
 co_bap     💪  Chăm          cánh tay gồng, bao tay giáp
 nao        🧠  Não to        bộ não hồng phát sáng, vài mạch xanh
 ngau       😎  Ngầu          linh vật tròn đeo kính râm
 chao       🫡  Bái phục      linh vật tròn chào kiểu quân đội
 bai_su     🙇  Bái sư        linh vật tròn cúi người chắp tay
 kim_cuong  💎  Hàng hiếm     viên kim cương xanh lam cắt facet, lấp lánh
 ngoi_sao   🌟  Ngôi sao      sao vàng năm cánh, tia sáng quanh
 an_mung    🥳  Ăn mừng       linh vật tròn đội mũ tiệc, pháo giấy
 hong_tam   🎯  Chuẩn xác     bia tròn có mũi tên cắm giữa
 co_4_la    🍀  Xin vía       cỏ bốn lá xanh, sương sáng
 tim_tay    🫶  Thương        hai bàn tay ghép thành hình tim
 bat_tay    🤝  Tôn trọng     hai tay đeo găng bắt nhau

══ PHẦN 2 — STICKER BÌNH LUẬN TĨNH (12 hình · tên file tg_st_<mã>) ══
Sticker là phiên bản LỚN, nhiều biểu cảm hơn icon: nhân vật linh vật chung của bộ (một sinh vật tròn như viên ngọc/linh thú nhỏ — bạn tự chọn 1 dáng
ở #S01 để tôi duyệt, sau đó mọi sticker dùng đúng nhân vật đó). #S01 = bảng thử 4 sticker (s_lua, s_goat, s_cup, s_an_mung) xếp 2×2.
 s_lua      🔥  nhân vật đứng giữa lửa, mắt sáng quắc, tay giơ nắm đấm
 s_goat     🐐  nhân vật cưỡi / đội sừng dê vàng, dáng vương giả
 s_cup      🏆  nhân vật giơ cúp lên đầu
 s_ten_lua  🚀  nhân vật ôm tên lửa bay vút
 s_no_nao   🤯  đầu nhân vật toé tia sáng, mắt sao
 s_chao     🫡  nhân vật chào nghiêm, lưng thẳng
 s_bai_su   🙇  nhân vật cúi rạp chắp tay, có tia sáng "bái phục"
 s_an_mung  🥳  nhân vật nhảy múa, pháo giấy, đội nón tiệc
 s_100      💯  nhân vật giơ huy hiệu tròn lớn có sao (KHÔNG viết số)
 s_co_4_la  🍀  nhân vật cầm cỏ bốn lá, đốm sáng may mắn
 s_tra_sua  🧋  nhân vật ôm ly trà sữa có ống hút, trân châu
 s_co_bap   💪  nhân vật gồng bắp tay, mồ hôi hạnh phúc

══ PHẦN 3 — STICKER ĐỘNG (CHỈ làm sau khi Phần 1–2 đã duyệt xong; Thùy chọn sticker nào) ══
Bạn KHÔNG xuất GIF/video. Mỗi sticker động = 4 KHUNG HÌNH rời, mỗi khung là 1 PNG (vẫn "1 lượt = 1 hình"), tôi ghép thành ảnh động.
Tên file: tg_st_<mã>_f1 · _f2 · _f3 · _f4.   f1 = TƯ THẾ NGHỈ = đúng hình tĩnh đã duyệt (vẽ lại y hệt, nên dùng chính ảnh đó làm gốc).
Luật khung hình (rất quan trọng — hỏng là cả sticker hỏng):
- MỖI khung vẽ DỰA TRÊN khung liền trước: cùng nhân vật, cùng cỡ, cùng vị trí trung tâm, cùng viền/màu — CHỈ đổi đúng phần chuyển động ghi trong bảng.
- Vòng lặp mượt: f4 phải gần giống f1 (chuyển động nhỏ, lặp vô hạn, không có "đầu" và "cuối").
- Không thêm vật mới ngoài khung 1024×1024; không đổi nền; luôn nền trong suốt.
- Nhịp phát sẽ là ~6–8 khung/giây; mỗi khung khác khung trước vừa đủ thấy (đừng nhảy cóc).
Chuyển động đề xuất (Thùy sửa được):
 s_lua      lửa quanh nhân vật đung đưa trái–phải, đầu lửa đổi hình f1→f4
 s_goat     sừng/đầu gật 2 nhịp, vài đốm sáng bay lên
 s_cup      cúp nhấc lên–hạ xuống nhẹ, tia sáng chạy qua cúp
 s_ten_lua  tên lửa rung nhẹ, lửa đuôi dài–ngắn, sao bay ngược xuống
 s_no_nao   tia sáng quanh đầu nở to dần rồi thu lại
 s_an_mung  nhân vật nhún nhảy, pháo giấy rơi ở các vị trí khác nhau
 s_tra_sua  ly lắc nhẹ, trân châu nảy trong ly, hơi bay lên
 s_co_bap   cánh tay gồng–thả, mồ hôi/tia sáng lóe

══ PHẦN 4 — EMOJI MỚI (làm SAU; mã + nghĩa do Thùy chốt trước, không tự thêm) ══
Khi Thùy gửi thêm danh sách mã + nghĩa, vẽ đúng như Phần 1 (icon) và/hoặc Phần 2 (sticker): cùng khung, cùng họ, cùng luật CẤM.
```

---

## Cách nhận hàng (Claude làm, Thùy không cần làm)

| ChatGPT giao | Vào app (`public/bk-ui/hs/gami/`) |
|---|---|
| `tg_tt_<mã>.png` | `the-gioi/tuong-tac/<mã>.png` (thu 3 cỡ: 128 hiển thị, 64 cho cỡ nhỏ) |
| `tg_st_<mã>.png` | `the-gioi/sticker/<mã>.png` — **mã sticker trong DB là `s_...`, file `tg_st_s_goat` ⇒ `s_goat.png`** |
| `tg_st_<mã>_f1..f4.png` | ghép thành `the-gioi/sticker/<mã>.webp` (WebP động, có trong suốt thật, nhẹ) — `<img>` hiện được, không cần thư viện |

- **Không dùng GIF**: GIF chỉ có trong suốt 1 bit ⇒ viền răng cưa trên nền xanh đêm, nặng gấp 3–5 lần WebP.
- Bản động cần 1 chỗ nhỏ trong code (chọn `.webp` nếu có, còn không thì `.png`) — Claude làm khi có file đầu tiên.
- Nghiệm thu: Claude kiểm từng nhóm (nền trong suốt thật, viền, độ rõ ở 24px, mỗi hình vuông) rồi mới bật cờ `KIT.the_gioi` / `KIT.sticker_tg`.
