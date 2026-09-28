# Đơn đặt hàng ChatGPT — Gamification app HS

> **Bản 29/09/2026 (Thùy yêu cầu gửi lại).** Đánh số theo đúng 3 mục Thùy yêu cầu:
>
> | Đơn | Nội dung | Loại |
> |---|---|---|
> | **1** | Nhiệm vụ ngày · tuần · tháng + Thành tựu (album huy hiệu) | 2 màn |
> | **2** | Huy hiệu: 8 huy hiệu × 5 sao + bản cứng | bộ hình |
> | **3** | Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank | bộ hình + 1 màn — *MỚI* |
> | 4 | Hồ sơ (profile) học sinh | 1 màn — *gửi sau, dùng hình của Đơn 2 + 3* |
>
> **Nguồn logic** (đã chốt + đã build 28/09): `spec-thanh-tuu-nhiem-vu.md` §0 · `spec-huy-hieu-build.md`.
>
> **Màn đang chạy bằng code** (bản thô, chụp đính kèm để ChatGPT biết NỘI DUNG, không lấy phong cách):
> `src/screens/hocsinh/NhiemVuHS.tsx` · `AlbumHS.tsx` · `RankHS.tsx` · `MayManHS.tsx`.
>
> **Khối áp dụng:** vẽ cho **lớp 6–8** (kit hiện tại: điện thoại dọc 430px + iPad ngang). Lớp 9–12 dùng lại nội dung, reskin theo skin em chọn.

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md`.
2. Dán nguyên khối **ĐƠN ĐẶT HÀNG** của đơn đó (khối trong ``` bên dưới).
3. Đính kèm ảnh chụp màn code hiện tại (ghi trong đơn) — CHỈ để biết nội dung và thứ tự, KHÔNG để lấy phong cách.
4. Chạy đủ 4 pha (A→D). Duyệt mockup ở Pha B trước khi cho sinh asset.
5. Nhận zip → kiểm có `reference/` (ảnh toàn cảnh mọi trạng thái) + DESIGN.md có cột "Vị trí & cỡ" → bỏ vào `design/handoff/` → báo Claude.

**Thứ tự gửi:**
1. **Đơn 2 (Huy hiệu)** và **Đơn 3 (Avatar Rank)** trước — là bộ hình; gửi song song được, 2 context riêng.
2. **Đơn 1 (màn Nhiệm vụ + Thành tựu)** sau, đính kèm hình đã duyệt của Đơn 2.
3. Đơn 4 cuối cùng, đính kèm hình của Đơn 2 + 3.

## ⚠ Luật chung — ĐỪNG LẪN 3 THỨ (Thùy 28/09)

| Thứ | Là gì | Tên | Hình | Nằm ở đâu |
|---|---|---|---|---|
| **Bậc rank** | Hành trình cả năm theo Điểm Rank, "người thường → thần" | Novice · Soldier · Captain · General · Hero · Legend · King · Emperor · God of War · Supreme God | **Đơn 3:** khiên / mũ trụ / vương miện theo 5 chương | Khối Rank + khung avatar |
| **Huy hiệu** | Sưu tầm theo tháng học, 5 sao | Helios · Chronos · Athena · Zeus · Phoenix · Hercules · Hephaestus · Nike | **Đơn 2:** huy chương men màu, mỗi vị thần 1 màu | Album + 3 huy hiệu khoe |
| **Danh hiệu** | Giải thưởng tháng trung tâm trao | Xuất sắc · Tiến bộ · Chăm chỉ (vd "Xuất sắc tháng 9") | Ô chữ nhỏ, không hình | Ô nhỏ ngay dưới tên |

- Không dùng hình / màu / tên của thứ này cho thứ kia.
- Mọi hình là **THIẾT KẾ GỐC**: không giống huy hiệu / rank / nhân vật của game nào (Liên Quân, LoL, Valorant, Genshin…) — HS sẽ nói trung tâm copy.

---

## Đơn 1 — Màn Nhiệm vụ (ngày · tuần · tháng) + Thành tựu (album huy hiệu)

Đính kèm: ảnh chụp `NhiemVuHS` + `AlbumHS` (bản code thô) + hình huy hiệu đã duyệt của Đơn 2.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            nhiem-vu + album-huy-hieu (2 màn, cùng 1 bộ phong cách)
Mô tả màn:      Học sinh lớp 6–8 của trung tâm dạy thêm BK Academy. Thiết bị: điện thoại DỌC 430px (ảnh chính) + iPad NGANG
                1180×820 (1 ảnh mỗi màn, lưới 2 cột). Màn được cuộn.

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
    Nút VÒNG QUAY: chưa đủ = xám "Xong 2 nhiệm vụ hôm nay để quay (1/2)" · đủ = nổi bật "Đã mở lượt quay may mắn!".
  - Khối TUẦN: "Tuần 4" + góc phải "11/12 → rương". 4 nhiệm vụ (+40): Đúng hẹn cả tuần · ET từ 80% · Thử thách 4 ngày ·
    Lấp 1 lỗ. Hàng 4 RƯƠNG (tuần 1–4): đóng "11/12" / mở "+75 EXP"; rương tuần hiện tại được viền.
  - Khối THÁNG: 2 nhiệm vụ (+150): MT bứt phá · Thử thách 15 ngày ("đang 6/15").
  Trạng thái: ① đang giữa tháng (vài cái xong, 1 rương đã mở) · ② đầu tháng (cấp 0, chưa gì xong) ·
              ③ chưa mở ("Nhiệm vụ mở từ ngày 01/10 — hẹn em nhé!").

MÀN 2 — THÀNH TỰU / ALBUM HUY HIỆU (mở từ màn Thành tựu). DÙNG HÌNH HUY HIỆU ĐÍNH KÈM. Phần tử ĐỘNG:
  - Tiêu đề "Huy hiệu Toán" · "Mùa 2026–27 · album 12/40 sao · ★4–★5 được trung tâm tặng bản cứng".
  - Khối SẮP ĐẠT (tối đa 3 dòng): "Helios ★3 — còn 1 tháng đạt chuẩn".
  - Lưới 8 thẻ huy hiệu. Mỗi thẻ: hình huy hiệu theo sao đang có (chưa có = hình KHOÁ) · tên · việc ghi nhận ·
    ★★☆☆☆ · tiến độ tới sao kế "Tới ★3: 3/4 tháng đạt chuẩn" + thanh · "12/54 bạn trong khối có ★2" ·
    nhãn "Hiếm" khi < 10% khối có · ★4–5: "chờ thầy cô trao bản cứng" / "đã nhận bản cứng" · "×2" nếu đạt lại năm sau.
  - Bấm thẻ → MỞ RỘNG tại chỗ: câu chuyện 1 dòng · checklist THÁNG NÀY (✓ đạt / ☐ chưa / – chưa áp dụng) ·
    dải các tháng T7…T4 (✓ đạt chuẩn · ★ hoàn hảo · – chưa áp dụng · * đang tạm tính).
  - Khoảnh khắc ĐẠT SAO MỚI: 1 màn/lớp phủ chúc mừng (hình huy hiệu sao mới to, "Athena ★3", "+100 EXP").
  Trạng thái: ① giữa năm (có sao, 1 thẻ mở rộng) · ② mới vào (0 sao, toàn hình khoá) · ③ lớp phủ đạt sao mới.

Phong cách: CÙNG họ với bộ huy hiệu đính kèm và kit lớp 6–8 hiện tại (thẻ bo lớn, màu tươi vừa phải). Thẻ theo quy ước
  "header màu + thân trắng" (dải màu trên, nội dung trắng bên dưới, khung gần vuông — KHÔNG làm thẻ dẹt trải ngang).
Giữ nguyên: đúng các nhiệm vụ, số, tên như trên. Không thêm tính năng.
Phiên bản kit:  v1
LUẬT RIÊNG:
  - KHÔNG khẩu hiệu động viên, KHÔNG tiếng Anh ngoài tên riêng (tên huy hiệu, tên bậc rank).
  - Mọi con số là chỗ để dữ liệu thật — vẽ bằng chữ, không vẽ vào ảnh.
  - Chữ chính ≥ 15px ở điện thoại; tương phản đủ đọc; tiếng Việt đúng dấu.
```

---

## Đơn 2 — Bộ huy hiệu (8 huy hiệu × 5 sao + bản cứng)

Đính kèm: không bắt buộc. Có thể kèm hình phượng hoàng trong `Student badge design.zip` (Mythwings) làm tham chiếu CHO RIÊNG Phoenix, ghi rõ "chỉ tham chiếu dáng chim, vẽ lại cùng phong cách bộ".

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            asset-huy-hieu (bộ hình, không phải màn)
Mô tả:          Bộ HUY HIỆU sưu tầm của học sinh trung tâm dạy thêm BK Academy (môn Toán, lớp 3–12). Em nhận huy hiệu theo
                THÁNG HỌC: mỗi huy hiệu có 5 SAO (★1–★5 cần 1 / 2 / 4 / 6 / 9 tháng học tốt trong năm). Sao 4–5 trung tâm làm
                BẢN CỨNG (huy hiệu cài áo/cặp thật) để giáo viên trao tận tay — rất ít em đạt, là thứ đáng khoe nhất.
                Bộ tên theo thần thoại Hy Lạp.

8 huy hiệu (tên · ghi nhận việc gì · biểu tượng gợi ý — câu chuyện phải khớp việc):
  1 Helios      — đi học không nghỉ buổi nào        — Thần Mặt Trời: mặt trời mọc mỗi ngày, cỗ xe lửa
  2 Chronos     — nộp bài về nhà đủ, đúng hạn        — Thần Thời Gian: đồng hồ cát, vòng số
  3 Athena      — làm tốt bài kiểm tra trên lớp      — Nữ thần Trí Tuệ: cú mèo, mũ trụ, cành ô liu
  4 Zeus        — thi tháng (MT) top khối            — Vua các vị thần: tia sét, đỉnh Olympus
  5 Phoenix     — thứ hạng thi bứt phá so với đầu năm — Phượng hoàng tái sinh từ tro (chim thần, KHÔNG phải người)
  6 Hercules    — vượt Thử thách trên app mỗi ngày   — 12 kỳ công: chùy, da sư tử
  7 Hephaestus  — lấp lỗ: dạng yếu lên đạt           — Thần thợ rèn: búa, đe, tia lửa
  8 Nike        — top Bảng đua tháng                 — Nữ thần Chiến Thắng: đôi cánh, vòng nguyệt quế
  Mỗi huy hiệu 1 MÀU CHỦ riêng, 8 màu phân biệt rõ khi đứng cạnh nhau.

Mỗi huy hiệu cần các file (PNG nền trong, 512×512, căn giữa, chừa lề 8%):
  - sao1 … sao5 : CÙNG 1 hình, sao càng cao càng hoành tráng (★1 đơn giản, ★3 thêm viền/khung, ★5 lộng lẫy nhất:
                  viền kim loại, tia sáng). Số sao hiện rõ trên huy hiệu (tấm sao gắn dưới hoặc viền sao).
  - khoa        : trạng thái CHƯA ĐẠT — bóng xám mờ của hình ★1 (em vẫn nhận ra hình, để thèm).
  - nho_48      : bản thu nhỏ 48×48 của ★1 (dùng trong danh sách, TV lớp) — phải đọc được ở cỡ nhỏ.
  Thêm 1 file chung: an (huy hiệu BÍ ẨN "???" — phase sau có nhóm ẩn tới khi đạt).

BẢN CỨNG (in/đúc thật — trung tâm đặt xưởng làm):
  - 1 PHÔI cho mỗi huy hiệu (8 phôi), đường kính 45mm, hình tròn hoặc khiên.
  - ★4 và ★5 dùng CHUNG phôi, phân biệt bằng TẤM SAO gắn thêm hoặc MÀU VIỀN (bạc = ★4, vàng = ★5).
  - Giao file vector (SVG/PDF) + mô tả số màu in, để xưởng làm được men/kim loại. Ít chi tiết li ti (đúc được).

Phong cách: huy chương/huy hiệu game hiện đại, 3D mềm, kim loại + men màu, dáng TRÒN / huy chương; THIẾT KẾ GỐC (không giống huy
  hiệu, nhân vật, logo của game nào — không Liên Quân, không Genshin). Hợp cả trẻ lớp 3 lẫn lớp 12.
  KHÁC HẲN bộ biểu tượng RANK (bộ đó dùng khiên / mũ trụ / vương miện — đừng dùng các dáng đó làm khung huy hiệu).
Giữ nguyên: đúng 8 tên, đúng thứ tự. Không vẽ chân dung người thật.
Phiên bản kit:  v1
LUẬT RIÊNG:
  - Tên huy hiệu viết đúng chính tả Latin như trên. KHÔNG chữ nào khác trên hình (không khẩu hiệu, không "Level").
  - Hình ★1 và ★5 cùng 1 huy hiệu phải nhận ra là 1 họ; 8 huy hiệu khác nhau phải phân biệt được chỉ bằng hình bóng.
```

---

## Đơn 3 — Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank (MỚI 29/09)

Đính kèm: ảnh chụp `RankHS` (bản code thô).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            asset-rank (bộ hình) + rank (1 màn chi tiết)
Mô tả:          RANK của học sinh trung tâm dạy thêm BK Academy — theo TỪNG MÔN (Toán, KHTN… mỗi môn 1 rank riêng).
                Mùa = 1 năm học (1/7 → 30/6), hết năm về lại bậc đầu. Điểm Rank cộng dồn cả năm từ bài kiểm tra trên lớp,
                bài về nhà, thi tháng và "Thử thách" trên app. Câu chuyện: từ NGƯỜI THƯỜNG trở thành THẦN.
                Bậc 1–8 mỗi bậc có 3 sao (★ → ★★ → ★★★). Bậc 9–10 là THẦN: rất ít em đạt, có năm không ai —
                phải là thứ oai nhất, đáng khoe nhất.

10 bậc (tên Latin giữ nguyên · chương · biểu tượng gợi ý — KHÔNG vẽ mặt người, để hợp mọi em nam/nữ):
  Chương NGƯỜI THƯỜNG (màu đồng  #B87333 → #8C5523):
   1 Novice       — áo vải, ngọn đèn nhỏ / cuốn sách — khởi đầu khiêm tốn
  Chương CHIẾN BINH (màu bạc-thép #8E9BB3 → #5F6B85):
   2 Soldier      — mũ sắt đơn giản + khiên gỗ
   3 Captain      — mũ có chóp + khiên viền kim loại
   4 General      — mũ tướng có chùm lông + 2 thanh kiếm chéo
  Chương ANH HÙNG (màu vàng #E0B01E → #B8860B):
   5 Hero         — khiên sáng + áo choàng bay
   6 Legend       — khiên + vòng nguyệt quế + hào quang nhẹ
  Chương VƯƠNG GIẢ (màu tím hoàng gia #8B4DE8 → #5B2BB5):
   7 King         — vương miện + quyền trượng
   8 Emperor      — vương miện lớn nhiều tầng + áo choàng hoàng đế
  Chương THẦN (màu lửa #FF7A18 → #D7263D → #7B2FF7):
   9 God of War   — mũ trụ thần chiến tranh + ngọn giáo + lửa
  10 Supreme God  — ngai trên mây + hào quang tối thượng (đỉnh cao nhất, lộng lẫy nhất)
  Bậc càng cao càng hoành tráng; các bậc CÙNG CHƯƠNG nhận ra là 1 họ (chung màu, chung ngôn ngữ hình).

Mỗi bậc cần các file (PNG nền trong):
  - bieu_tuong      : 512×512 — biểu tượng bậc (dáng KHIÊN / MŨ TRỤ / VƯƠNG MIỆN), dùng ở màn Rank, lớp phủ lên bậc.
  - bieu_tuong_64   : 64×64 — cạnh tên trong danh sách / TV lớp — phải đọc được ở cỡ nhỏ.
  - khung_avatar    : 512×512 — vòng KHUNG ôm quanh ảnh đại diện tròn của em; LỖ GIỮA TRONG SUỐT, đường kính lỗ = 62% khung,
                      nằm chính giữa. Khung mang màu + chi tiết của bậc (chóp mũ, cánh, vương miện… đặt quanh viền trên).
  - khung_avatar_96 : 96×96 — bản nhỏ cho danh sách / TV.
  Dùng chung:
  - sao             : 1 ngôi sao nhỏ (code tự xếp 1–3 sao dưới biểu tượng) — KHÔNG vẽ sao dính vào biểu tượng.
  - hao_quang_than  : lớp hào quang riêng cho bậc 9–10, đặt SAU biểu tượng/khung, để code cho xoay chậm bằng CSS.
  - len_bac         : minh hoạ "ánh sáng bùng" dùng chung cho lớp phủ LÊN BẬC (chữ "Lên Captain!" code tự vẽ).

MÀN RANK chi tiết (mockup — mở từ màn Tự luyện / Hồ sơ). Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh):
  - Đầu: biểu tượng bậc hiện tại to + tên "Captain" + ★★☆ · "5.290 Điểm Rank" · thanh "còn 2.585 lên General".
  - HÀNH TRÌNH MÙA: 10 bậc xếp thành đường đi (người thường → thần); bậc đã qua sáng, bậc hiện tại nổi bật,
    bậc chưa tới là bóng mờ; ngưỡng điểm ghi nhỏ dưới mỗi bậc (Novice 0 · Soldier 1.575 · … · Supreme God 30.240).
  - BẢNG ĐUA THÁNG: "Tháng 10 · em #9/52 khối 7" + top 5 (biểu tượng bậc nhỏ + tên ngắn + điểm tháng). KHÔNG hiện cuối bảng.
  - THỬ THÁCH: "420/600 điểm tháng · hôm nay 20/30".
  - TOP KHỐI MÙA: top 5 (biểu tượng nhỏ + tên ngắn + bậc).
  Trạng thái: ① Captain giữa mùa · ② Novice đầu mùa (0 điểm) · ③ God of War (hào quang, nổi bật nhất) ·
              ④ lớp phủ LÊN BẬC (biểu tượng bậc mới to + "Lên Captain!").

Phong cách: biểu tượng rank game hiện đại, 3D mềm, kim loại + ánh sáng; THIẾT KẾ GỐC — KHÔNG giống rank / khung của Liên Quân,
  LoL, Valorant, PUBG, Free Fire (HS nhận ra ngay và nói trung tâm copy). KHÁC HẲN bộ HUY HIỆU (bộ đó là huy chương TRÒN men màu
  theo các vị thần Hy Lạp) — rank dùng KHIÊN / MŨ TRỤ / VƯƠNG MIỆN theo 5 chương. Hợp cả lớp 3 lẫn lớp 12.
Giữ nguyên: đúng 10 tên, đúng thứ tự, đúng 5 chương và màu chương như trên.
Phiên bản kit:  v1
LUẬT RIÊNG:
  - Tên bậc viết đúng chính tả Latin; KHÔNG chữ nào khác trên hình. Không vẽ mặt / chân dung người.
  - Hạng thấp chỉ em tự thấy: danh sách chỉ top, không bao giờ hiện cuối bảng.
  - KHÔNG khẩu hiệu động viên; tiếng Việt đúng dấu; chữ chính ≥ 15px ở điện thoại.
```

---

## Đơn 4 — Hồ sơ (profile) học sinh — GỬI SAU Đơn 2 + 3

Đính kèm: hình đã duyệt của Đơn 2 (huy hiệu) + Đơn 3 (biểu tượng + khung avatar rank).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            ho-so
Mô tả màn:      Hồ sơ KHOE của học sinh lớp 6–8, trung tâm dạy thêm BK Academy. Em BẤM VÀO AVATAR của mình ở màn chính là mở.
                Phase này CHỈ em tự xem (xem hồ sơ bạn khác = phase sau). Thiết bị: điện thoại DỌC 430px + iPad NGANG 1180×820.
                Màn được cuộn. DÙNG HÌNH HUY HIỆU + HÌNH RANK ĐÍNH KÈM.

Phần tử ĐỘNG (vẽ bằng chữ/khối, không vẽ vào ảnh), từ trên xuống:
  1 ĐẦU HỒ SƠ: avatar (ảnh thật hoặc 2 chữ viết tắt) trong KHUNG AVATAR CỦA BẬC RANK (hình đính kèm) · họ tên · "7S2 · khối 7" ·
    ô DANH HIỆU nhỏ dưới tên: "Xuất sắc tháng 9" (không có thì ẩn ô) · nút sửa (chọn huy hiệu khoe).
  2 CHỌN MÔN: chip "Toán" · "KHTN" (mỗi môn rank riêng; em học 1 môn thì ẩn).
  3 KHỐI RANK: biểu tượng bậc + tên bậc to "Captain" + ★★☆ · "5.290 Điểm Rank" · "hạng 12/54 khối" · thanh "còn 2.585 lên General".
    Bấm vào → màn Rank (Đơn 3).
  4 3 HUY HIỆU KHOE: 3 ô tròn lớn (hình huy hiệu + tên + sao), ô trống có dấu +, nút "Đổi".
  5 ALBUM THU GỌN: 8 hình nhỏ (48px) + số sao mỗi cái · "12/40 sao" · bấm → màn Album (Đơn 1).
  6 THÁNG NÀY: 3 ô số: "Đua tháng #9/52" · "Chặng cấp 12" · "Bản cứng 1".
  7 KỶ NIỆM CÁC MÙA: dải kỷ niệm mùa "Mùa 2026–27 · King" (giữ mãi); mùa đầu thì là ô trống có chữ giải thích.
  Thêm 1 ảnh: THẺ NHỎ trên TV lớp (1 dòng: avatar-khung · tên ngắn · biểu tượng bậc · 3 huy hiệu khoe) — dùng khi xướng tên top.

Trạng thái: ① em khá (Captain, 2 huy hiệu khoe, có danh hiệu) · ② em mới (Novice, 0 huy hiệu, không danh hiệu) ·
            ③ em ở bậc thần (God of War — khung thần, nổi bật nhất) · ④ màn chọn 3 huy hiệu khoe (lưới 8, chưa đạt thì khoá).

Phong cách: cùng họ Đơn 1–3; cảm giác "thẻ người chơi" của game, nhưng THIẾT KẾ GỐC (không giống màn hồ sơ game nào).
Giữ nguyên: đúng 7 khối, đúng thứ tự. Không thêm like/bình luận/theo dõi (phase sau).
Phiên bản kit:  v1
LUẬT RIÊNG:
  - Tách bạch BẬC RANK / HUY HIỆU / DANH HIỆU (bảng đầu file) — không dùng màu/khung của thứ này cho thứ kia.
  - Hạng thấp chỉ em tự thấy: thẻ TV chỉ hiện bậc + huy hiệu, KHÔNG hiện hạng.
  - KHÔNG khẩu hiệu động viên; tiếng Việt đúng dấu; chữ chính ≥ 15px ở điện thoại.
```
