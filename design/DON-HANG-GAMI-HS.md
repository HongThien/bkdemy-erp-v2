# Đơn đặt hàng ChatGPT — Gamification app HS (theo style Anime RPG)

> **Bản 29/09/2026 v2 — viết lại theo style ANIME RPG** (Thùy: "viết lại theo hướng phù hợp với style anime cho thống nhất").
> App HS giờ chỉ có 1 style dùng thật là **Anime RPG**, áp cho mọi màn, mọi em (`design/STYLE-HS.md`, `skin/styles/rpg.ts`).
> Bản v1 cùng ngày viết theo kit pastel lớp 6–8 cũ ("thân trắng", "3D mềm", "màu tươi") ⇒ BỎ.
>
> | Đơn | Nội dung | Loại |
> |---|---|---|
> | **1** | Nhiệm vụ ngày · tuần · tháng + Thành tựu (album huy hiệu) | 2 màn |
> | **2** | Huy hiệu: 8 huy hiệu × 5 sao + bản cứng | bộ hình |
> | **3** | Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank | bộ hình + 1 màn |
> | 4 | Hồ sơ (profile) học sinh | 1 màn — *gửi sau, dùng hình của Đơn 2 + 3* |
>
> **Nguồn logic** (đã chốt + đã build): `spec-thanh-tuu-nhiem-vu.md` §0 · `spec-huy-hieu-build.md`.

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md`.
2. Dán khối **PHONG CÁCH CHUNG — ANIME RPG** (ngay dưới) + khối **ĐƠN ĐẶT HÀNG** của đơn đó.
3. Đính kèm **ảnh gốc style**: `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png` (màn chính đã duyệt) — để lấy
   PHONG CÁCH, màu, độ sáng, kiểu vẽ icon.
4. Đính kèm **ảnh chụp màn code** (để biết NỘI DUNG + thứ tự; màn code đã chạy style RPG nên cũng cho biết không khí thật):
   mở `hs.html?xem=gami&man=<màn>&tt=<trạng thái>&an` (dữ liệu giả, không cần đăng nhập) — mỗi đơn ghi sẵn link cần chụp.
5. Chạy đủ 4 pha (A→D). Duyệt mockup ở Pha B trước khi cho sinh asset.
6. Nhận zip → kiểm có `reference/` (ảnh toàn cảnh mọi trạng thái) + DESIGN.md có cột "Vị trí & cỡ" → bỏ vào `design/handoff/` → báo Claude.

**Thứ tự gửi:** Đơn 2 + Đơn 3 trước (bộ hình, gửi song song 2 context) → Đơn 1 (đính kèm hình Đơn 2 đã duyệt) → Đơn 4 (đính kèm hình Đơn 2 + 3).

## Code đã dọn đường — kit về thì chỉ ĐỔI VỎ

- **Hình:** mọi đường dẫn ở 1 chỗ `src/screens/hocsinh/gami/hinh.ts`. Chép PNG vào `public/bk-ui/hs/gami/` đúng tên file ghi trong từng
  đơn (mục "TÊN FILE") → bật cờ `KIT.<bộ>` → mở `hs.html?xem=gami&man=bo_hinh` soát (thiếu file = ảnh vỡ ngay ở đó).
  Bộ chưa bật cờ thì app tự vẽ hình tạm.
- **Màu game** (8 màu huy hiệu, 5 màu chương, vàng sao) ở `hinh.ts` — kit về thì chỉnh cho khớp màu đá/men của hình.
  Khung / chữ / nền thẻ theo style (`skin/KhungHS.tsx`) — KHÔNG gõ màu trong màn (`npm run check:style-hs`).
- **Bố cục:** mỗi màn tách VIEW chỉ vẽ (`NhiemVuView` · `AlbumView` · `RankView` · `HoSoView`) ⇒ đổi theo mockup chỉ sửa VIEW, trang xem mẫu đổi theo.
- Trang mẫu: `nhiem_vu` (3 trạng thái) · `album` (3) · `rank` (4) · `ho_so` (4) · `the_tv` · `bo_hinh`.

## ⚠ Luật chung — ĐỪNG LẪN 3 THỨ (Thùy 28/09)

| Thứ | Là gì | Tên | Hình | Nằm ở đâu |
|---|---|---|---|---|
| **Bậc rank** | Hành trình cả năm theo Điểm Rank, "người thường → thần" | Novice · Soldier · Captain · General · Hero · Legend · King · Emperor · God of War · Supreme God | **Đơn 3:** khiên / mũ trụ / vương miện theo 5 chương | Khối Rank + khung avatar |
| **Huy hiệu** | Sưu tầm theo tháng học, 5 sao | Helios · Chronos · Athena · Zeus · Phoenix · Hercules · Hephaestus · Nike | **Đơn 2:** huy chương TRÒN, mỗi vị thần 1 màu đá/men | Album + 3 huy hiệu khoe |
| **Danh hiệu** | Giải thưởng tháng trung tâm trao | Xuất sắc · Tiến bộ · Chăm chỉ (vd "Xuất sắc tháng 9") | Ô chữ nhỏ, không hình | Ô nhỏ ngay dưới tên |

- Không dùng hình / màu / tên của thứ này cho thứ kia.
- Mọi hình là **THIẾT KẾ GỐC**: không giống huy hiệu / rank / nhân vật của game nào (Liên Quân, LoL, Valorant, Genshin, Star Rail…) — HS nhận ra là nói trung tâm copy.

---

## PHONG CÁCH CHUNG — ANIME RPG (dán kèm MỌI đơn)

```
PHONG CÁCH CHUNG — style "Anime RPG" của app học sinh BK Academy (ảnh gốc đính kèm: reference_rpg_ipad.png — đã duyệt, bám sát)
Không khí:   anime fantasy ĐÊM — trời sao, lâu đài thắp đèn lồng, đảo nổi; cảm giác game nhập vai cao cấp nhưng hiền, hợp lớp 3–12.
             THIẾT KẾ GỐC — không chép hình/khung/icon của Genshin, Star Rail hay game nào khác.
Bảng màu:    xanh đêm #141a33 (nền) · #2c3a66 (nền chuyển) · vàng cổ #e9c77b (viền, nhấn, dải tiêu đề) · vàng sáng #f4d98f (ánh kim)
             · đồng viền #6b5a33 · chữ kem #f3ead0 · chữ phụ #bfb08a. Màu riêng (đá quý của huy hiệu, màu chương rank) chỉ nằm TRONG hình.
Nền màn:     tranh lâu đài đêm của app (code đã có — KHÔNG vẽ lại nền). Nửa dưới tranh phủ tối nhẹ để thẻ dễ đọc.
Thẻ:         tấm xanh đêm TRONG MỜ (≈72% đục, làm mờ phía sau), viền vàng cổ mảnh 1px, bo góc 8px, KHÔNG bóng đổ đen dày.
             Thẻ "dải tiêu đề + thân": dải tiêu đề tô vàng cổ #e9c77b chữ xanh đêm (hoặc tô màu riêng của huy hiệu / chương rank, chữ kem),
             thân là tấm trong mờ. Khung gần vuông — KHÔNG thẻ dẹt trải ngang. Có thể dùng hoa văn góc + gạch phân cách vàng có sao 4 cánh
             như ảnh gốc (code đã có file).
Chữ:         tiêu đề + số to = Philosopher (serif cổ điển); chữ thường = Be Vietnam Pro đậm. KHÔNG chữ viết tay, KHÔNG Pacifico.
             Chữ chính ≥ 15px ở điện thoại; tiếng Việt đúng dấu; mọi chữ/số do code vẽ, KHÔNG vẽ vào ảnh.
Hình / icon: vẽ kiểu tranh anime game: nét sạch, tô cel mềm, ánh kim loại vàng/đồng, đá quý phát sáng nhẹ, vài đốm lấp lánh — cùng họ với
             các icon ô chức năng trong ảnh gốc (sách phép, bản đồ cuộn, cầu pha lê, túi xu, cúp vàng…). Nền trong suốt.
             Phải nổi và đọc được trên nền XANH ĐÊM (không làm hình tối/xỉn chìm vào nền).
Thiết bị:    điện thoại DỌC 430px (ảnh chính) + iPad NGANG 1180×820 (lưới 2 cột). Màn được cuộn.
CẤM:         khẩu hiệu động viên · tiếng Anh ngoài tên riêng (tên huy hiệu, tên bậc) · vẽ mặt / chân dung người trong huy hiệu và rank.
```

---

## Đơn 1 — Màn Nhiệm vụ (ngày · tuần · tháng) + Thành tựu (album huy hiệu)

Đính kèm: `reference_rpg_ipad.png` + hình huy hiệu đã duyệt của Đơn 2 + ảnh chụp:
`?xem=gami&man=nhiem_vu&tt=1&an` · `tt=2` · `tt=3` · `?xem=gami&man=album&tt=1&an` · `tt=2` · `tt=3`.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            nhiem-vu + album-huy-hieu (2 màn, cùng style Anime RPG — theo PHONG CÁCH CHUNG)
Mô tả màn:      Học sinh trung tâm dạy thêm BK Academy. Nhiệm vụ = "bảng nhiệm vụ" của game nhập vai; Album = "sảnh trưng bày huy hiệu".

MÀN 1 — NHIỆM VỤ (mở từ màn Tự luyện). Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh):
  - Tiêu đề "Nhiệm vụ Toán" + 1 dòng: "Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP".
  - Khối CHẶNG THÁNG: "Chặng tháng 10" · "Cấp 12/30" · "620 Điểm Chặng" · thanh tiến độ trong cấp · "+475 EXP" đã tích ·
    mốc thưởng kế: "tới cấp 20 thưởng thêm 150 EXP". 3 mốc 10/20/30 thấy được trên thanh.
  - Khối HÔM NAY (nhiệm vụ NGÀY): 3 nhiệm vụ, mỗi dòng: icon · tên · mô tả 1 dòng có số thật · "+10" · trạng thái xong (✓) hay
    chưa · dòng phụ khi còn treo "Còn 2 lượt chờ — làm bù được":
      Vượt 1 Thử thách        — "Đúng từ 80% trở lên trong 1 lượt Thử thách"
      Luyện 20 câu            — "Làm đúng 20 câu trên app — hôm nay 23 câu đúng"
      Sửa sai                 — "Làm đúng 2 câu thuộc dạng em từng sai — hôm nay 1 câu"
    2 nút nhỏ: "Thử thách" · "Tự luyện".
    Nút VÒNG QUAY: chưa đủ = tối, viền mờ "Xong 2 nhiệm vụ hôm nay để quay (1/2)" · đủ = vàng cổ sáng "Đã mở lượt quay may mắn!".
  - Khối TUẦN: "Tuần 4" + góc phải "11/12 → rương". 4 nhiệm vụ (+40): Đúng hẹn cả tuần · ET từ 80% · Thử thách 4 ngày ·
    Lấp 1 lỗ. Hàng 4 RƯƠNG kho báu (tuần 1–4): đóng "11/12" / mở "+75 EXP"; rương tuần hiện tại được viền vàng.
  - Khối THÁNG: 2 nhiệm vụ (+150): MT bứt phá · Thử thách 15 ngày ("đang 6/15").
  Trạng thái: ① giữa tháng (vài cái xong, 1 rương đã mở) · ② đầu tháng (cấp 0, chưa gì xong) ·
              ③ chưa mở ("Nhiệm vụ mở từ ngày 01/10 — hẹn em nhé!").

MÀN 2 — THÀNH TỰU / ALBUM HUY HIỆU (mở từ màn Thành tựu). DÙNG HÌNH HUY HIỆU ĐÍNH KÈM. Phần tử ĐỘNG:
  - Tiêu đề "Huy hiệu Toán" · "Mùa 2026–27 · album 12/40 sao · ★4–★5 được trung tâm tặng bản cứng".
  - Khối SẮP ĐẠT (tối đa 3 dòng): "Helios ★3 — còn 1 tháng đạt chuẩn".
  - Lưới 8 thẻ huy hiệu. Mỗi thẻ: dải tiêu đề tô MÀU RIÊNG của huy hiệu (chưa có sao = xanh đêm xám) · hình huy hiệu theo sao đang có
    (chưa có = hình KHOÁ) · tên · việc ghi nhận · ★★☆☆☆ · tiến độ tới sao kế "Tới ★3: 3/4 tháng đạt chuẩn" + thanh ·
    "12/54 bạn trong khối có ★2" · nhãn "Hiếm" khi < 10% khối có · ★4–5: "chờ thầy cô trao bản cứng" / "đã nhận bản cứng" · "×2" nếu đạt lại năm sau.
  - Bấm thẻ → MỞ RỘNG tại chỗ: câu chuyện 1 dòng · checklist THÁNG NÀY (✓ đạt / ☐ chưa / – chưa áp dụng) ·
    dải các tháng T7…T4 (✓ đạt chuẩn · ★ hoàn hảo · – chưa áp dụng · * đang tạm tính).
  - Khoảnh khắc ĐẠT SAO MỚI: lớp phủ tối toàn màn, hình huy hiệu sao mới to giữa vầng sáng vàng, "Huy hiệu mới" · "Athena ★3" ·
    "+100 EXP" · nút "Tuyệt!".
  Trạng thái: ① giữa năm (có sao, 1 thẻ mở rộng) · ② mới vào (0 sao, toàn hình khoá) · ③ lớp phủ đạt sao mới.

Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG) — cùng không khí ảnh gốc đính kèm, cùng họ bộ huy hiệu Đơn 2.
Giữ nguyên:     đúng các nhiệm vụ, số, tên như trên. Không thêm tính năng.
Phiên bản kit:  v1
TÊN FILE (nếu vẽ icon riêng — PNG nền trong 192×192): nhiem-vu/<mã>.png, mã = N1 N2 N3 T1 T2 T3 T4 M1 M2 · chang ngay tuan thang ·
                ruong_dong ruong_mo · vong_quay thu_thach tu_luyen. + fx/sao_moi_sang.png (vầng sáng sau huy hiệu ở lớp phủ, 1024×1024).
```

---

## Đơn 2 — Bộ huy hiệu (8 huy hiệu × 5 sao + bản cứng)

Đính kèm: `reference_rpg_ipad.png` (để lấy kiểu vẽ + độ sáng trên nền xanh đêm). Có thể kèm hình phượng hoàng trong `Student badge design.zip`
(Mythwings) làm tham chiếu CHO RIÊNG Phoenix, ghi rõ "chỉ tham chiếu dáng chim, vẽ lại cùng phong cách bộ". Ảnh chụp: `?xem=gami&man=bo_hinh&an`
(hình tạm hiện tại — chỉ để biết cỡ + chỗ đặt, KHÔNG lấy phong cách).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            asset-huy-hieu (bộ hình, không phải màn)
Mô tả:          Bộ HUY HIỆU sưu tầm của học sinh trung tâm dạy thêm BK Academy (môn Toán, lớp 3–12), hiện trên app style Anime RPG
                (nền xanh đêm, viền vàng cổ). Em nhận huy hiệu theo THÁNG HỌC: mỗi huy hiệu có 5 SAO (★1–★5 cần 1 / 2 / 4 / 6 / 9 tháng
                học tốt trong năm). Sao 4–5 trung tâm làm BẢN CỨNG (huy hiệu cài áo/cặp thật) để giáo viên trao tận tay — rất ít em đạt,
                là thứ đáng khoe nhất. Bộ tên theo thần thoại Hy Lạp.

8 huy hiệu (tên · ghi nhận việc gì · biểu tượng gợi ý — câu chuyện phải khớp việc · màu đá/men chủ):
  1 Helios      — đi học không nghỉ buổi nào        — Thần Mặt Trời: mặt trời mọc, cỗ xe lửa           — hổ phách cam   (#F57C00)
  2 Chronos     — nộp bài về nhà đủ, đúng hạn        — Thần Thời Gian: đồng hồ cát, vòng số             — lam chàm       (#3949AB)
  3 Athena      — làm tốt bài kiểm tra trên lớp      — Nữ thần Trí Tuệ: cú mèo, cành ô liu              — ngọc lục bảo   (#00796B)
  4 Zeus        — thi tháng (MT) top khối            — Vua các vị thần: tia sét, đỉnh Olympus           — vàng sét       (#F9A825)
  5 Phoenix     — thứ hạng thi bứt phá so với đầu năm — Phượng hoàng tái sinh từ lửa (chim, KHÔNG người) — hồng ngọc lửa  (#D84315)
  6 Hercules    — vượt Thử thách trên app mỗi ngày   — 12 kỳ công: chùy, da sư tử                       — đồng nâu       (#5D4037)
  7 Hephaestus  — lấp lỗ: dạng yếu lên đạt           — Thần thợ rèn: búa, đe, tia lửa                   — thép xám xanh  (#455A64)
  8 Nike        — top Bảng đua tháng                 — Nữ thần Chiến Thắng: đôi cánh, vòng nguyệt quế   — thạch anh tím  (#7B1FA2)
  8 màu đá phân biệt rõ khi đứng cạnh nhau trên nền xanh đêm.

Mỗi huy hiệu cần (PNG nền trong, 512×512, căn giữa, chừa lề 8%):
  - sao1 … sao5 : CÙNG 1 hình. ★1 = huy chương đồng-vàng đơn giản, 1 viên đá; ★3 thêm vành khắc hoa văn + ánh kim; ★5 lộng lẫy nhất:
                  vành vàng sáng #f4d98f nhiều lớp, đá phát sáng, tia sáng + đốm lấp lánh. Số sao hiện rõ (tấm sao gắn dưới hoặc vành sao).
  - khoa        : trạng thái CHƯA ĐẠT — hình ★1 thành bóng XANH ĐÊM mờ, viền bạc nhạt (vẫn nhận ra hình để thèm; đọc được trên nền tối).
  - nho_48      : bản 48×48 của ★1 (danh sách, TV lớp) — bỏ chi tiết li ti, vẫn đọc được.
  Thêm 1 file chung: an.png (huy hiệu BÍ ẨN "???" — phase sau có nhóm ẩn tới khi đạt).

BẢN CỨNG (in/đúc thật — trung tâm đặt xưởng làm):
  - 1 PHÔI cho mỗi huy hiệu (8 phôi), đường kính 45mm, hình tròn.
  - ★4 và ★5 dùng CHUNG phôi, phân biệt bằng TẤM SAO gắn thêm hoặc MÀU VIỀN (bạc = ★4, vàng = ★5).
  - Giao file vector (SVG/PDF) + mô tả số màu in, để xưởng làm được men/kim loại. Ít chi tiết li ti (đúc được).

Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG): huy chương TRÒN kim loại vàng cổ/đồng + đá quý/men màu phát sáng nhẹ, vẽ kiểu anime game
                (tô cel mềm, highlight kim loại, vài đốm lấp lánh) — cùng họ các icon trong ảnh gốc. THIẾT KẾ GỐC (không giống huy hiệu,
                nhân vật, logo của game nào). KHÁC HẲN bộ biểu tượng RANK (bộ đó dùng khiên / mũ trụ / vương miện — đừng dùng các dáng đó).
Giữ nguyên:     đúng 8 tên, đúng thứ tự. Không vẽ chân dung người.
Phiên bản kit:  v1
TÊN FILE:       huy-hieu/<key>/sao1.png … sao5.png · khoa.png · nho_48.png   (key = helios chronos athena zeus phoenix hercules hephaestus nike)
                huy-hieu/an.png · ban-cung/<key>.svg
LUẬT RIÊNG:
  - Tên huy hiệu viết đúng chính tả Latin như trên. KHÔNG chữ nào khác trên hình (không khẩu hiệu, không "Level").
  - Hình ★1 và ★5 cùng 1 huy hiệu phải nhận ra là 1 họ; 8 huy hiệu khác nhau phải phân biệt được chỉ bằng hình bóng.
```

---

## Đơn 3 — Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank

Đính kèm: `reference_rpg_ipad.png` + ảnh chụp `?xem=gami&man=rank&tt=1&an` · `tt=2` · `tt=3` · `tt=4` + `?xem=gami&man=bo_hinh&an` (phần Rank).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            asset-rank (bộ hình) + rank (1 màn chi tiết)
Mô tả:          RANK của học sinh trung tâm dạy thêm BK Academy — theo TỪNG MÔN (Toán, KHTN… mỗi môn 1 rank riêng), hiện trên app
                style Anime RPG. Mùa = 1 năm học (1/7 → 30/6), hết năm về lại bậc đầu. Điểm Rank cộng dồn cả năm từ bài kiểm tra
                trên lớp, bài về nhà, thi tháng và "Thử thách" trên app. Câu chuyện nhập vai: từ NGƯỜI THƯỜNG trở thành THẦN.
                Bậc 1–8 mỗi bậc có 3 sao (★ → ★★ → ★★★). Bậc 9–10 là THẦN: rất ít em đạt, có năm không ai —
                phải là thứ oai nhất, đáng khoe nhất.

10 bậc (tên Latin giữ nguyên · chương · biểu tượng gợi ý — KHÔNG vẽ mặt người, để hợp mọi em nam/nữ):
  Chương NGƯỜI THƯỜNG (đồng  #B87333 → #8C5523):
   1 Novice       — ngọn đèn lồng nhỏ trên cuốn sách — khởi đầu khiêm tốn
  Chương CHIẾN BINH (bạc-thép #8E9BB3 → #5F6B85):
   2 Soldier      — khiên gỗ viền sắt + mũ sắt đơn giản
   3 Captain      — khiên viền kim loại + mũ có chóp
   4 General      — mũ tướng chùm lông + 2 thanh kiếm chéo sau khiên
  Chương ANH HÙNG (vàng #E0B01E → #B8860B):
   5 Hero         — khiên sáng + áo choàng bay
   6 Legend       — khiên + vòng nguyệt quế + hào quang nhẹ
  Chương VƯƠNG GIẢ (tím hoàng gia #8B4DE8 → #5B2BB5):
   7 King         — vương miện + quyền trượng
   8 Emperor      — vương miện lớn nhiều tầng + áo choàng hoàng đế
  Chương THẦN (lửa #FF7A18 → #D7263D → #7B2FF7):
   9 God of War   — mũ trụ thần chiến tranh + ngọn giáo + lửa
  10 Supreme God  — ngai trên mây + hào quang tối thượng (đỉnh cao nhất, lộng lẫy nhất)
  Bậc càng cao càng hoành tráng; các bậc CÙNG CHƯƠNG nhận ra là 1 họ (chung màu, chung ngôn ngữ hình).

Mỗi bậc cần (PNG nền trong):
  - bieu_tuong      : 512×512 — biểu tượng bậc (dáng KHIÊN / MŨ TRỤ / VƯƠNG MIỆN), dùng ở màn Rank, lớp phủ lên bậc.
  - bieu_tuong_64   : 64×64 — cạnh tên trong danh sách / TV lớp — phải đọc được ở cỡ nhỏ trên nền xanh đêm.
  - khung_avatar    : 512×512 — vòng KHUNG ôm quanh ảnh đại diện tròn của em; LỖ GIỮA TRONG SUỐT, đường kính lỗ = 62% khung,
                      nằm chính giữa. Khung mang màu + chi tiết của bậc (chóp mũ, cánh, vương miện… đặt quanh viền trên).
  - khung_avatar_96 : 96×96 — bản nhỏ cho danh sách / TV.
  Dùng chung:
  - sao             : 1 ngôi sao vàng nhỏ (code tự xếp 1–3 sao dưới biểu tượng) — KHÔNG vẽ sao dính vào biểu tượng.
  - hao_quang_than  : vầng hào quang tròn cho bậc 9–10, đặt SAU biểu tượng/khung, để code cho xoay chậm — đối xứng tâm.
  - len_bac         : minh hoạ "ánh sáng bùng" dùng chung cho lớp phủ LÊN BẬC (chữ "Lên Captain!" code tự vẽ).

MÀN RANK chi tiết (mở từ màn Tự luyện / Hồ sơ). Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh):
  - Đầu: thẻ có dải tiêu đề màu CHƯƠNG "Chương Chiến binh" · biểu tượng bậc to + tên "Captain" + ★★☆ · "5.290 Điểm Rank · hạng 12/54 khối"
    · thanh "Còn 2.585 điểm lên General".
  - HÀNH TRÌNH MÙA: 10 bậc xếp thành đường đi (người thường → thần); bậc đã qua sáng, bậc hiện tại nổi bật viền vàng,
    bậc chưa tới là bóng mờ; ngưỡng điểm ghi nhỏ (Novice 0 · Soldier 1.575 · Captain 4.200 · General 7.875 · Hero 12.075 ·
    Legend 18.375 · King 21.000 · Emperor 25.725 · God of War 28.350 · Supreme God 30.240).
  - BẢNG ĐUA THÁNG: "Tháng 10 · em #9/52" · 1.840 điểm, tách ET / BTVN / MT / Thử thách + top 5 (biểu tượng bậc nhỏ + tên ngắn + điểm).
    KHÔNG hiện cuối bảng.
  - THỬ THÁCH: "Hôm nay 20/30 điểm · tháng này 420/600" + nút "Làm Thử thách".
  - TOP KHỐI MÙA: top 5 (biểu tượng nhỏ + tên ngắn + bậc + sao).
  Trạng thái: ① Captain giữa mùa · ② Novice đầu mùa (0 điểm) · ③ God of War (hào quang, nổi bật nhất) ·
              ④ lớp phủ LÊN BẬC (lớp tối toàn màn, biểu tượng bậc mới to giữa ánh sáng bùng + "Lên Captain!" + nút "Tuyệt!").

Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG): biểu tượng kiểu huy hiệu game nhập vai anime — kim loại + ánh sáng, tô cel mềm,
                viền sáng để nổi trên nền xanh đêm. THIẾT KẾ GỐC — KHÔNG giống rank / khung của Liên Quân, LoL, Valorant, PUBG,
                Free Fire, Genshin. KHÁC HẲN bộ HUY HIỆU (huy chương TRÒN đá quý) — rank dùng KHIÊN / MŨ TRỤ / VƯƠNG MIỆN theo 5 chương.
Giữ nguyên:     đúng 10 tên, đúng thứ tự, đúng 5 chương và màu chương như trên.
Phiên bản kit:  v1
TÊN FILE:       rank/<1..10>/bieu_tuong.png · bieu_tuong_64.png · khung_avatar.png · khung_avatar_96.png   (thư mục = số bậc)
                rank/sao.png · rank/hao_quang_than.png · rank/len_bac.png
LUẬT RIÊNG:
  - Tên bậc viết đúng chính tả Latin; KHÔNG chữ nào khác trên hình. Không vẽ mặt / chân dung người.
  - Hạng thấp chỉ em tự thấy: danh sách chỉ top, không bao giờ hiện cuối bảng.
```

---

## Đơn 4 — Hồ sơ (profile) học sinh — GỬI SAU Đơn 2 + 3

Đính kèm: `reference_rpg_ipad.png` + hình đã duyệt của Đơn 2 (huy hiệu) + Đơn 3 (biểu tượng + khung avatar rank) + ảnh chụp
`?xem=gami&man=ho_so&tt=1&an` · `tt=2` · `tt=3` · `tt=4` · `?xem=gami&man=the_tv&an`.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            ho-so
Mô tả màn:      Hồ sơ KHOE của học sinh trung tâm dạy thêm BK Academy — "thẻ nhân vật" của game nhập vai, style Anime RPG.
                Em BẤM VÀO AVATAR của mình ở màn chính là mở. Phase này CHỈ em tự xem (xem hồ sơ bạn khác = phase sau).
                DÙNG HÌNH HUY HIỆU + HÌNH RANK ĐÍNH KÈM.

Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh), từ trên xuống:
  1 ĐẦU HỒ SƠ: avatar (ảnh thật hoặc 2 chữ viết tắt) trong KHUNG AVATAR CỦA BẬC RANK (hình đính kèm), đặt nổi trên tranh nền ·
    họ tên (Philosopher, to) · "7S2 · khối 7" · ô DANH HIỆU nhỏ viền vàng dưới tên: "Xuất sắc tháng 9" (không có thì ẩn ô).
  2 CHỌN MÔN: chip "Toán" · "KHTN" (mỗi môn rank riêng; em học 1 môn thì ẩn).
  3 KHỐI RANK: dải tiêu đề màu chương + "Xem Rank ›" · biểu tượng bậc + tên bậc to "Captain" + ★★☆ · "5.290 Điểm Rank · hạng 12/54 khối"
    · thanh "Còn 2.585 điểm lên General". Bấm vào → màn Rank (Đơn 3).
  4 3 HUY HIỆU KHOE: 3 ô lớn (hình huy hiệu + tên + sao), ô trống có dấu + viền nét đứt, nút "Đổi".
  5 ALBUM THU GỌN: 8 hình nhỏ (48px) + số sao mỗi cái · "14/40 sao ›" · bấm → màn Album (Đơn 1).
  6 THÁNG NÀY: 3 ô số: "Đua tháng #9/52" · "Chặng cấp 12/30" · "Bản cứng 1".
  7 KỶ NIỆM CÁC MÙA: dải kỷ niệm mùa "Mùa 2026–27 · King" (giữ mãi); mùa đầu thì là ô trống viền nét đứt có chữ giải thích.
  Thêm 1 ảnh: THẺ NHỎ trên TV lớp (1 dòng: avatar-khung · tên ngắn · biểu tượng bậc · 3 huy hiệu khoe) — dùng khi xướng tên top.

Trạng thái: ① em khá (Captain, 2 huy hiệu khoe, có danh hiệu) · ② em mới (Novice, 0 huy hiệu, không danh hiệu) ·
            ③ em ở bậc thần (God of War — khung thần + hào quang, nổi bật nhất) · ④ tấm chọn 3 huy hiệu khoe trượt từ dưới lên
            (lưới 8, chưa đạt thì khoá, số thứ tự 1–2–3 ở góc ô đã chọn, nút Huỷ / Lưu).

Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG), cùng họ Đơn 1–3; cảm giác "thẻ nhân vật" game nhập vai, THIẾT KẾ GỐC.
Giữ nguyên:     đúng 7 khối, đúng thứ tự. Không thêm like/bình luận/theo dõi (phase sau).
Phiên bản kit:  v1
LUẬT RIÊNG:
  - Tách bạch BẬC RANK / HUY HIỆU / DANH HIỆU (bảng đầu file) — không dùng màu/khung của thứ này cho thứ kia.
  - Hạng thấp chỉ em tự thấy: thẻ TV chỉ hiện bậc + huy hiệu, KHÔNG hiện hạng.
```
