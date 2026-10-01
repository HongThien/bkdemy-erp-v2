# Đơn đặt hàng ChatGPT — Gamification app HS (style Anime RPG)

> **Bản 29/09/2026 v3.**
> - v2 (cùng ngày) viết lại theo style Anime RPG nhưng mới có MÔ TẢ, thiếu phần đặt từng hình (Thùy: "bình thường phải có ảnh chung
>   và design các phần nhỏ riêng").
> - v3 theo đúng khuôn của đơn skin Lo-fi v3 / Thị trấn v2 (`DON-HANG-SKIN-HS.md`):
>   **A. ảnh toàn cảnh để duyệt → DỪNG chờ Thùy duyệt → B, C, D… mỗi lượt vẽ ĐÚNG 1 hình**, có số thứ tự + tên file. KHÔNG zip.
>   Lý do không zip: ở Đơn 4 skin, ảnh ChatGPT vẽ trong chat thì đẹp, nhưng file nó đóng zip lại là bản dựng bằng code.
> - App HS giờ chỉ có 1 style dùng thật là **Anime RPG**, áp cho mọi màn, mọi em (`design/STYLE-HS.md`, `skin/styles/rpg.ts`).
>
> | Đơn | Nội dung | Số lượt vẽ |
> |---|---|---|
> | **2** | Huy hiệu: 8 huy hiệu × 5 sao + khoá + bí ẩn + phôi bản cứng | 1 ảnh duyệt + 57 hình |
> | **3** | Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank | 6 ảnh toàn cảnh + 23 hình |
> | **1** | Màn Nhiệm vụ (ngày · tuần · tháng) + màn Thành tựu (album huy hiệu) | 8 ảnh toàn cảnh + 17 hình |
> | 4 | Hồ sơ học sinh | 6 ảnh toàn cảnh, không hình mới |
> | **5** | "Thế giới BK" — mạng xã hội khoe (v2 theo mockup chốt): 5 ảnh toàn cảnh + 45 hình vẽ riêng | 5 màn + bộ hình — *gửi sau Đơn 2 + 3* |
>
> **Nguồn logic** (đã chốt + đã build): `spec-thanh-tuu-nhiem-vu.md` §0 · `spec-huy-hieu-build.md`.

## ✅ KIỂM HÀNG 01/10 — 72 hình ChatGPT giao 30/09–01/10 (tên mặc định "ChatGPT Image …", Claude nhận diện bằng mắt + đổi tên)

> ⚠ **Ảnh GỐC (`design/bk-ui-src/gami/`, ~140 MB) KHÔNG lên git** (`.gitignore`, Thùy chốt 01/10) — bản chính cất Google Drive, máy nào cũng
> lấy được. Repo chỉ giữ hình app dùng (`public/bk-ui/hs/gami/`) + ảnh toàn cảnh JPG (`design/handoff/gami-v1/reference/`). Drive (Thùy tải lên 01/10): https://drive.google.com/drive/folders/1SuezN0GRVndmnU25MaDfcR1r12ha3aYA
> Hình về KHÔNG theo `#số + tên file` và nằm ở gốc `bk-ui-src/` ⇒ Claude nhận diện từng hình, đếm sao, rồi mới đổi tên. **Thứ tự giờ tải không
> đáng tin:** 2 file Zeus bị đảo (file 10:37:44 có 3 sao, 10:37:48 có 2 sao) — gán theo số sao, không theo vị trí.

| Đơn | Đã về (đã đổi tên, nằm ở `design/bk-ui-src/gami/`) | CÒN THIẾU (đặt ChatGPT tiếp) | Trong app |
|---|---|---|---|
| **2** Huy hiệu | 40/57: `hh_<key>_sao1..5` × 8 — số sao đúng cả 40 · `hh_<key>_khoa` × 8 do **Claude dựng từ ★1** (bóng xanh đêm + viền bạc, đúng mô tả §KHOÁ — đỡ 8 lượt vẽ) | #50 `hh_an` (bí ẩn — code chưa dùng) · #51–58 `phoi_*` (xưởng, không chặn app) | `KIT.huy_hieu = true` (01/10) |
| **3** Rank | 10/29: `rank_1_novice … rank_10_supreme_god` | #01–06 ảnh toàn cảnh (bảng duyệt + 5 màn Rank) · **#17–26 khung avatar × 10** · #27 `rank_sao` · #28 `rank_hao_quang_than` · #29 `rank_len_bac` | `KIT.rank_bieu_tuong = true`; `rank_khung`/`rank_chung` = false (khung + hào quang vẫn vẽ tạm bằng code) |
| **1** Nhiệm vụ + Album | 8/8 ảnh toàn cảnh → `design/handoff/gami-v1/reference/man_*.jpg` (bản JPG để dựng màn; PNG gốc ở `bk-ui-src/gami/`) · 14 icon vẽ lại `nv_T1..T4 · nv_M1 · nv_M2 · nv_chang · nv_ngay · nv_tuan · nv_thang · nv_ruong_dong · nv_ruong_mo · nv_vong_quay · fx_sao_moi_sang` | bộ mới THIẾU `nv_N1..N3` | Màn Nhiệm vụ + Album + lớp phủ "Huy hiệu mới" dựng lại theo 8 ảnh toàn cảnh (01/10). **Icon vẫn dùng bộ 29/09** — bộ vẽ lại chưa đưa vào vì thiếu N1–N3 (trộn 2 nét vẽ). Muốn thay ⇒ vẽ N1–N3 cùng nét bộ mới rồi báo Claude. |

**Lệch đơn, Claude nhận như ChatGPT vẽ (Thùy chưa bác):** huy hiệu không tròn hết (Helios nửa mặt trời · Phoenix dáng chim · Hercules tấm da sư tử ·
Hephaestus đáy nhọn giống khiên) · vành không theo đồng → vàng → bạc · Hephaestus ★4 ngả cam lửa. Chữ trong ảnh toàn cảnh Nhiệm vụ lệch luật vài chỗ
(M1 "300 câu đúng", T1 "làm bài mỗi ngày", Nike "Leo Rank") — màn dựng dùng chữ đúng luật (spec §0.4), chỉ lấy bố cục.

## Cách gửi (mỗi đơn = 1 context ChatGPT MỚI)

1. Dán nguyên `design/CHATGPT-UI-KIT.md`.
2. Dán khối **PHONG CÁCH CHUNG — ANIME RPG** (ngay dưới), rồi dán **nguyên khối ĐƠN ĐẶT HÀNG** của đơn đó.
3. Đính kèm các ảnh ghi ở đầu mỗi đơn:
   - **ảnh gốc style** `design/handoff/hs-skin-rpg-v1/reference/reference_rpg_ipad.png`: lấy PHONG CÁCH;
   - **ảnh chụp màn code**: chỉ để biết NỘI DUNG + thứ tự khối. Chụp từ `hs.html?xem=gami&man=<màn>&tt=<trạng thái>&an`
     (dữ liệu giả, không cần đăng nhập).
4. ChatGPT vẽ **#01** (ảnh toàn cảnh) rồi DỪNG ⇒ Thùy duyệt phong cách. Chưa ưng thì sửa #01; ưng rồi mới gõ "tiếp".
5. Mỗi hình xong: tải ảnh về `design/bk-ui-src/gami/` giữ đúng tên file ChatGPT ghi ở dòng đầu, rồi gõ "tiếp".
   Xong nhóm nào (B, C…) báo Claude kiểm nhóm đó, đừng đợi đủ cả đơn.

**Thứ tự gửi:**
1. Đơn 2 + Đơn 3 trước (bộ hình, gửi song song 2 context).
2. Đơn 1: đính kèm #01 + 8 hình ★3 đã duyệt của Đơn 2.
3. Đơn 4: đính kèm hình Đơn 2 + 3.

## Code đã dọn đường — hình về thì chỉ ĐỔI VỎ

- **Claude nhận hình** từ `design/bk-ui-src/gami/` và làm các việc:
  - nén PNG;
  - tự làm các bản nhỏ bằng cách thu nhỏ bản to: `nho_48` · `bieu_tuong_64` · `khung_avatar_96`, nên không đặt ChatGPT vẽ các bản này;
  - chép vào `public/bk-ui/hs/gami/` theo cây file đầu `src/screens/hocsinh/gami/hinh.ts`;
  - bật cờ `KIT.<bộ>`;
  - soát ở `hs.html?xem=gami&man=bo_hinh` (thiếu file thì ảnh vỡ ngay ở đó).
- Bộ nào chưa bật cờ thì app tự vẽ hình tạm, nên có 1 nửa hình vẫn chạy được.
- **Màu game** (8 màu huy hiệu, 5 màu chương, vàng sao) ở `hinh.ts`. Hình về thì chỉnh màu ở đó cho khớp màu đá/men trong hình.
- **Bố cục:** mỗi màn đã tách phần VIEW chỉ vẽ (`NhiemVuView` · `AlbumView` · `RankView` · `HoSoView`). Ảnh toàn cảnh được duyệt thì Claude sửa
  VIEW theo ảnh, trang xem mẫu tự đổi theo.

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
             Chữ chính ≥ 15px ở điện thoại; tiếng Việt đúng dấu. Ảnh toàn cảnh có chữ + số mẫu; HÌNH RỜI (icon, huy hiệu, biểu tượng)
             KHÔNG có chữ/số nào — code tự vẽ chữ.
Hình / icon: vẽ kiểu tranh anime game: nét sạch, tô cel mềm, ánh kim loại vàng/đồng, đá quý phát sáng nhẹ, vài đốm lấp lánh — cùng họ với
             các icon ô chức năng trong ảnh gốc (sách phép, bản đồ cuộn, cầu pha lê, túi xu, cúp vàng…).
             Phải nổi và đọc được trên nền XANH ĐÊM (không làm hình tối/xỉn chìm vào nền).
Thiết bị:    điện thoại DỌC 430px (ảnh chính) + iPad NGANG 1180×820 (lưới 2 cột). Màn được cuộn.
CẤM:         khẩu hiệu động viên · tiếng Anh ngoài tên riêng (tên huy hiệu, tên bậc) · vẽ mặt / chân dung người trong huy hiệu và rank.

══ CÁCH GIAO HÀNG (bắt buộc — ghi đè Pha C/D của kit) ══
- KHÔNG đóng zip. KHÔNG viết DESIGN.md. KHÔNG dựng hình bằng code / SVG / HTML / Python-PIL / ghép khối / cắt từ ảnh toàn cảnh.
- MỖI LƯỢT TRẢ LỜI = ĐÚNG 1 HÌNH, vẽ bằng công cụ tạo ảnh. Dòng đầu câu trả lời ghi số thứ tự + tên file, vd "#07 hh_helios_sao1".
  Vẽ xong dừng, chờ tôi gõ "tiếp". KHÔNG gộp nhiều hình vào 1 ảnh (trừ mục A là ảnh toàn cảnh / bảng duyệt).
- Tôi tải chính ảnh bạn vẽ ra — ảnh đó LÀ file giao, nên phải đạt chuẩn ngay trong chat.
- Hình cùng họ (5 sao của 1 huy hiệu, 10 bậc rank) PHẢI vẽ dựa trên hình đã duyệt trước đó trong context này: giữ nguyên dáng, góc nhìn,
  nguồn sáng, chỉ thêm/bớt đúng phần đơn ghi.

══ CHUẨN CHUNG MỌI HÌNH RỜI ══
- Vuông 1254×1254, nền TRONG SUỐT thật (không nền trắng, không ô caro giả), vật thể ở GIỮA chiếm ~80% khung (chừa lề).
- Góc nhìn chính diện hơi nghiêng 3/4, nguồn sáng từ trái-trên, cùng độ chi tiết cho cả bộ.
- Không chữ, không số, không badge, không khung ô phía sau.
```

---

## Đơn 2 — Bộ huy hiệu (8 huy hiệu × 5 sao + khoá + bí ẩn + phôi bản cứng)

Đính kèm: `reference_rpg_ipad.png` · ảnh chụp `?xem=gami&man=album&tt=1&an` (thẻ album hiện tại: chỗ đặt huy hiệu, cỡ 48–64px).
Có thể kèm hình phượng hoàng trong `Student badge design.zip` (Mythwings) làm tham chiếu CHO RIÊNG Phoenix — ghi rõ "chỉ tham chiếu dáng chim".

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            asset-huy-hieu (bộ hình)
Mô tả:          Bộ HUY HIỆU sưu tầm của học sinh trung tâm dạy thêm BK Academy (môn Toán, lớp 3–12), hiện trên app style Anime RPG
                (nền xanh đêm, viền vàng cổ). Em nhận huy hiệu theo THÁNG HỌC: mỗi huy hiệu có 5 SAO (★1–★5 cần 1 / 2 / 4 / 6 / 9 tháng
                học tốt trong năm). Sao 4–5 trung tâm làm BẢN CỨNG (huy hiệu cài áo thật) để giáo viên trao tận tay — rất ít em đạt,
                là thứ đáng khoe nhất. Bộ tên theo thần thoại Hy Lạp. Hình hiện ở cỡ 48–180px trên nền xanh đêm.

8 huy hiệu (key · tên · ghi nhận việc gì · biểu tượng ở GIỮA huy chương · màu đá/men chủ):
  helios      Helios      — đi học không nghỉ buổi nào         — mặt trời mọc toả tia                        — hổ phách cam   #F57C00
  chronos     Chronos     — nộp bài về nhà đủ, đúng hạn         — đồng hồ cát trong vòng số La Mã             — lam chàm       #3949AB
  athena      Athena      — làm tốt bài kiểm tra trên lớp       — cú mèo đậu trên cành ô liu                  — ngọc lục bảo   #00796B
  zeus        Zeus        — thi tháng (MT) top khối             — tia sét trên đỉnh núi Olympus               — vàng sét       #F9A825
  phoenix     Phoenix     — thứ hạng thi bứt phá so với đầu năm — phượng hoàng dang cánh bay lên từ lửa        — hồng ngọc lửa  #D84315
  hercules    Hercules    — vượt Thử thách trên app mỗi ngày    — cây chuỳ bắt chéo trên tấm da sư tử          — đồng nâu       #5D4037
  hephaestus  Hephaestus  — lấp lỗ: dạng yếu lên đạt            — búa gõ trên đe, tia lửa bắn                 — thép xám xanh  #455A64
  nike        Nike        — top Bảng đua tháng                  — đôi cánh ôm vòng nguyệt quế                 — thạch anh tím  #7B1FA2
  8 huy hiệu đứng cạnh nhau phải phân biệt được chỉ bằng HÌNH BÓNG và màu đá.

THANG 5 SAO (cùng 1 huy hiệu = CÙNG hình giữa, chỉ phần vành + trang trí lớn dần; số sao hiện bằng hàng sao gắn dưới vành):
  ★1  huy chương tròn vành ĐỒNG trơn, 1 viên đá màu chủ ở giữa sau biểu tượng, 1 ngôi sao nhỏ dưới vành. Đơn giản, sạch.
  ★2  như ★1, vành đồng có khắc hoa văn mảnh, 2 sao.
  ★3  vành VÀNG CỔ #e9c77b hai lớp, đá sáng hơn, 3 sao, vài đốm lấp lánh.
  ★4  vành BẠC sáng + vàng, 2 dải ruy băng màu chủ rủ dưới, đá phát sáng, 4 sao.  (có bản cứng)
  ★5  vành VÀNG SÁNG #f4d98f nhiều lớp + tia sáng toả sau lưng, ruy băng + cánh nhỏ hai bên, đá rực, 5 sao — lộng lẫy nhất. (có bản cứng)
KHOÁ (chưa đạt): hình ★1 thành BÓNG XANH ĐÊM mờ (#2c3a66 → #3a4670), viền bạc nhạt, không đá, không sao — vẫn nhận ra hình giữa, để em thèm.
BÍ ẨN: huy chương vành đồng, mặt giữa là sương tím mờ với dấu "?" khắc nổi (dấu ? là hình khắc, không phải chữ in).
PHÔI BẢN CỨNG (xưởng đúc men + kim loại, đường kính 45mm): hình PHẲNG nhìn thẳng, ≤ 5 mảng màu đặc (không gradient, không ánh sáng,
                không lấp lánh), nét viền kim loại rõ, ít chi tiết li ti. ★4 và ★5 dùng CHUNG phôi (xưởng đổi màu viền bạc / vàng).
                Xưởng tự vẽ lại vector từ hình này.

Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Bảng duyệt phong cách (1 ảnh ngang, nền xanh đêm #141a33, KHÔNG chữ — chỉ để duyệt, không cắt ra dùng):
   #01 bang_duyet_huy_hieu — hàng trên: Helios ★1 ★2 ★3 ★4 ★5 + Helios khoá · hàng dưới: 8 huy hiệu ★3 đứng cạnh nhau
       → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
B. ★1 của 8 huy hiệu (gốc của cả họ):
   #02 hh_helios_sao1 · #03 hh_chronos_sao1 · #04 hh_athena_sao1 · #05 hh_zeus_sao1
   #06 hh_phoenix_sao1 · #07 hh_hercules_sao1 · #08 hh_hephaestus_sao1 · #09 hh_nike_sao1
C. ★2 → ★5 (vẽ dựa trên ★1 cùng huy hiệu):
   #10 hh_helios_sao2 · #11 hh_helios_sao3 · #12 hh_helios_sao4 · #13 hh_helios_sao5
   #14 hh_chronos_sao2 · #15 hh_chronos_sao3 · #16 hh_chronos_sao4 · #17 hh_chronos_sao5
   #18 hh_athena_sao2 · #19 hh_athena_sao3 · #20 hh_athena_sao4 · #21 hh_athena_sao5
   #22 hh_zeus_sao2 · #23 hh_zeus_sao3 · #24 hh_zeus_sao4 · #25 hh_zeus_sao5
   #26 hh_phoenix_sao2 · #27 hh_phoenix_sao3 · #28 hh_phoenix_sao4 · #29 hh_phoenix_sao5
   #30 hh_hercules_sao2 · #31 hh_hercules_sao3 · #32 hh_hercules_sao4 · #33 hh_hercules_sao5
   #34 hh_hephaestus_sao2 · #35 hh_hephaestus_sao3 · #36 hh_hephaestus_sao4 · #37 hh_hephaestus_sao5
   #38 hh_nike_sao2 · #39 hh_nike_sao3 · #40 hh_nike_sao4 · #41 hh_nike_sao5
D. Khoá (vẽ dựa trên ★1 cùng huy hiệu):
   #42 hh_helios_khoa · #43 hh_chronos_khoa · #44 hh_athena_khoa · #45 hh_zeus_khoa
   #46 hh_phoenix_khoa · #47 hh_hercules_khoa · #48 hh_hephaestus_khoa · #49 hh_nike_khoa
E. Bí ẩn:    #50 hh_an
F. Phôi bản cứng (nền TRẮNG đặc, không trong suốt — để in):
   #51 phoi_helios · #52 phoi_chronos · #53 phoi_athena · #54 phoi_zeus
   #55 phoi_phoenix · #56 phoi_hercules · #57 phoi_hephaestus · #58 phoi_nike

LUẬT RIÊNG:
  - KHÔNG chữ nào trên hình (không tên, không "Level", không số). Số sao = hình ngôi sao.
  - KHÁC HẲN bộ biểu tượng RANK (khiên / mũ trụ / vương miện) — huy hiệu LUÔN là huy chương TRÒN, không dùng dáng khiên.
  - Không vẽ chân dung người (Athena = cú, Nike = đôi cánh, Hercules = chuỳ + da sư tử).

Bắt đầu với #01.
```

---

## Đơn 3 — Avatar của Rank: biểu tượng 10 bậc + khung avatar + màn Rank

Đính kèm: `reference_rpg_ipad.png` · ảnh chụp `?xem=gami&man=rank&tt=1&an` · `tt=2` · `tt=3` · `tt=4` · `?xem=gami&man=ho_so&tt=1&an` (khung avatar đặt ở đâu).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            rank (1 màn chi tiết) + asset-rank (bộ hình)
Mô tả:          RANK của học sinh trung tâm dạy thêm BK Academy — theo TỪNG MÔN (Toán, KHTN… mỗi môn 1 rank riêng), hiện trên app
                style Anime RPG. Mùa = 1 năm học (1/7 → 30/6), hết năm về lại bậc đầu. Điểm Rank cộng dồn cả năm từ bài kiểm tra
                trên lớp, bài về nhà, thi tháng và "Thử thách" trên app. Câu chuyện nhập vai: từ NGƯỜI THƯỜNG trở thành THẦN.
                Bậc 1–8 mỗi bậc có 3 sao (★ → ★★ → ★★★). Bậc 9–10 là THẦN: rất ít em đạt, có năm không ai —
                phải là thứ oai nhất, đáng khoe nhất.

10 bậc (số · tên Latin giữ nguyên · chương · biểu tượng — KHÔNG vẽ mặt người, để hợp mọi em nam/nữ):
  Chương NGƯỜI THƯỜNG (đồng  #B87333 → #8C5523):
   1 Novice       — khiên gỗ tròn nhỏ, trước khiên là ngọn đèn lồng nhỏ đặt trên cuốn sách
  Chương CHIẾN BINH (bạc-thép #8E9BB3 → #5F6B85):
   2 Soldier      — khiên gỗ viền sắt + mũ sắt đơn giản
   3 Captain      — khiên viền kim loại + mũ có chóp
   4 General      — mũ tướng chùm lông + 2 thanh kiếm chéo sau khiên
  Chương ANH HÙNG (vàng #E0B01E → #B8860B):
   5 Hero         — khiên sáng + áo choàng bay phía sau
   6 Legend       — khiên + vòng nguyệt quế + hào quang nhẹ
  Chương VƯƠNG GIẢ (tím hoàng gia #8B4DE8 → #5B2BB5):
   7 King         — vương miện + quyền trượng bắt chéo
   8 Emperor      — vương miện lớn nhiều tầng + áo choàng hoàng đế
  Chương THẦN (lửa #FF7A18 → #D7263D → #7B2FF7):
   9 God of War   — mũ trụ thần chiến tranh + ngọn giáo + lửa
  10 Supreme God  — ngai trên mây + hào quang tối thượng (đỉnh cao nhất, lộng lẫy nhất)
  Bậc càng cao càng hoành tráng; các bậc CÙNG CHƯƠNG nhận ra là 1 họ (chung màu, chung ngôn ngữ hình).

KHUNG AVATAR: vòng khung ôm quanh ảnh đại diện TRÒN của em. LỖ GIỮA hình tròn, đường kính = 62% khung, nằm chính giữa, TRONG SUỐT thật
              (nếu công cụ không làm được lỗ trong suốt thì tô lỗ 1 màu phẳng #FF00FF thuần — Claude sẽ đục). Chi tiết của bậc (chóp mũ,
              cánh, vương miện, lửa…) đặt quanh viền TRÊN, không lấn vào lỗ. Khung mang màu chương.

MÀN RANK chi tiết (mở từ màn Tự luyện / Hồ sơ). Phần tử ĐỘNG (code vẽ chữ; trong ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Thẻ đầu: dải tiêu đề màu CHƯƠNG "Chương Chiến binh" · biểu tượng bậc to + "Captain" + ★★☆ · "5.290 Điểm Rank · hạng 12/54 khối"
    · thanh "Còn 2.585 điểm lên General".
  - BẢNG ĐUA THÁNG 10/2026: "1.840 điểm · hạng 9/52" · 4 ô ET 720 / BTVN 480 / MT 220 / Thử thách 420 · top 5 (biểu tượng bậc nhỏ +
    tên ngắn + điểm). KHÔNG hiện cuối bảng.
  - THỬ THÁCH: "Hôm nay 20/30 điểm · tháng này 420/600" + nút "Làm Thử thách".
  - HÀNH TRÌNH MÙA: 10 bậc thành đường đi (người thường → thần); bậc đã qua sáng, bậc hiện tại viền vàng nổi bật, bậc chưa tới bóng mờ;
    ngưỡng điểm: Novice 0 · Soldier 1.575 · Captain 4.200 · General 7.875 · Hero 12.075 · Legend 18.375 · King 21.000 ·
    Emperor 25.725 · God of War 28.350 · Supreme God 30.240.
  - TOP KHỐI MÙA: top 5 (biểu tượng nhỏ + tên ngắn + bậc + sao).
  Trạng thái: ① Captain giữa mùa · ② Novice đầu mùa (0 điểm, chưa vào bảng đua) · ③ God of War (hào quang, nổi bật nhất) ·
              ④ lớp phủ LÊN BẬC (lớp tối toàn màn, biểu tượng bậc mới to giữa ánh sáng bùng + "Lên Captain!" + nút "Tuyệt!").

Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG): biểu tượng kiểu huy hiệu game nhập vai anime — kim loại + ánh sáng, tô cel mềm,
                viền sáng để nổi trên nền xanh đêm. THIẾT KẾ GỐC — KHÔNG giống rank / khung của Liên Quân, LoL, Valorant, PUBG,
                Free Fire, Genshin. KHÁC HẲN bộ HUY HIỆU (huy chương TRÒN đá quý) — rank dùng KHIÊN / MŨ TRỤ / VƯƠNG MIỆN.
Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục và phong cách — không cắt ra dùng):
   #01 bang_duyet_rank — 1 ảnh ngang nền xanh đêm, 10 biểu tượng bậc xếp thành đường đi từ trái (Novice) sang phải (Supreme God),
       KHÔNG chữ    → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 man_rank_dt_1      — điện thoại dọc, trạng thái ① Captain (cuộn dài, vẽ đủ các khối)
   #03 man_rank_ipad_1    — iPad ngang 1180×820, trạng thái ①, lưới 2 cột
   #04 man_rank_dt_2      — điện thoại, trạng thái ② Novice đầu mùa
   #05 man_rank_dt_3      — điện thoại, trạng thái ③ God of War
   #06 man_rank_dt_4      — điện thoại, trạng thái ④ lớp phủ "Lên Captain!"
B. Biểu tượng bậc (vẽ đúng như trong #01 đã duyệt):
   #07 rank_1_novice · #08 rank_2_soldier · #09 rank_3_captain · #10 rank_4_general · #11 rank_5_hero
   #12 rank_6_legend · #13 rank_7_king · #14 rank_8_emperor · #15 rank_9_god_of_war · #16 rank_10_supreme_god
C. Khung avatar (cùng ngôn ngữ hình với biểu tượng cùng bậc):
   #17 khung_1_novice · #18 khung_2_soldier · #19 khung_3_captain · #20 khung_4_general · #21 khung_5_hero
   #22 khung_6_legend · #23 khung_7_king · #24 khung_8_emperor · #25 khung_9_god_of_war · #26 khung_10_supreme_god
D. Dùng chung:
   #27 rank_sao            — 1 ngôi sao vàng 5 cánh bóng kim loại (code tự xếp 1–3 sao dưới biểu tượng)
   #28 rank_hao_quang_than — vầng hào quang tròn ĐỐI XỨNG TÂM, lửa cam-đỏ-tím + tia sáng, giữa trống (đặt SAU biểu tượng, code xoay chậm)
   #29 rank_len_bac        — vụ "ánh sáng bùng" toả tròn từ tâm, vàng sáng + tia + đốm lấp lánh, giữa trống (sau biểu tượng ở lớp phủ lên bậc)

LUẬT RIÊNG:
  - Hình rời (B, C, D): KHÔNG chữ nào, không vẽ sao dính vào biểu tượng. Không vẽ mặt / chân dung người.
  - Hạng thấp chỉ em tự thấy: danh sách chỉ top, không bao giờ hiện cuối bảng.
  - Tên bậc trong ảnh toàn cảnh viết đúng chính tả Latin.

Bắt đầu với #01.
```

---

## Đơn 1 — Màn Nhiệm vụ (ngày · tuần · tháng) + màn Thành tựu (album huy hiệu)

Đính kèm: `reference_rpg_ipad.png` · **#01 + 8 hình ★3 đã duyệt của Đơn 2** · ảnh chụp
`?xem=gami&man=nhiem_vu&tt=1&an` · `tt=2` · `tt=3` · `?xem=gami&man=album&tt=1&an` · `tt=2` · `tt=3`.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            nhiem-vu + album-huy-hieu (2 màn, cùng style Anime RPG — theo PHONG CÁCH CHUNG)
Mô tả màn:      Học sinh trung tâm dạy thêm BK Academy. Nhiệm vụ = "bảng nhiệm vụ" của game nhập vai; Album = "sảnh trưng bày huy hiệu".
                DÙNG HÌNH HUY HIỆU ĐÍNH KÈM (đã duyệt) — không vẽ lại huy hiệu.

MÀN 1 — NHIỆM VỤ (mở từ màn Tự luyện). Phần tử ĐỘNG (code vẽ chữ; trong ảnh toàn cảnh vẽ chữ mẫu đúng như dưới):
  - Tiêu đề "Nhiệm vụ Toán" + 1 dòng: "Xong nhiệm vụ → Điểm Chặng → lên cấp nhận EXP".
  - Khối CHẶNG THÁNG: "Chặng tháng 10" · "Cấp 12/30" · "620 Điểm Chặng" · thanh tiến độ trong cấp · "+475 EXP" đã tích ·
    "tới cấp 20 thưởng thêm 150 EXP". 3 mốc 10/20/30 thấy được trên thanh.
  - Khối HÔM NAY: 3 nhiệm vụ, mỗi dòng: icon · tên · mô tả 1 dòng có số thật · "+10" · xong (✓) hay chưa ·
    dòng phụ khi còn treo "Còn 2 lượt chờ — làm bù được":
      Vượt 1 Thử thách  — "Đúng từ 80% trở lên trong 1 lượt Thử thách"
      Luyện 20 câu      — "Làm đúng 20 câu trên app — hôm nay 23 câu đúng"
      Sửa sai           — "Làm đúng 2 câu thuộc dạng em từng sai — hôm nay 1 câu"
    2 nút nhỏ: "Thử thách" · "Tự luyện".
    Nút VÒNG QUAY: chưa đủ = tối, viền mờ "Xong 2 nhiệm vụ hôm nay để quay (1/2)" · đủ = vàng cổ sáng "Đã mở lượt quay may mắn!".
  - Khối TUẦN: "Tuần 4" + góc phải "11/12 → rương". 4 nhiệm vụ (+40): Đúng hẹn cả tuần · ET từ 80% · Thử thách 4 ngày · Lấp 1 lỗ.
    Hàng 4 RƯƠNG (tuần 1–4): đóng "11/12" / mở "+75 EXP"; rương tuần hiện tại viền vàng.
  - Khối THÁNG: 2 nhiệm vụ (+150): MT bứt phá · Thử thách 15 ngày ("đang 6/15").
  Trạng thái: ① giữa tháng (vài cái xong, 1 rương đã mở) · ② đầu tháng (cấp 0, chưa gì xong) ·
              ③ chưa mở ("Nhiệm vụ mở từ ngày 01/10 — hẹn em nhé!").

MÀN 2 — THÀNH TỰU / ALBUM HUY HIỆU (mở từ màn Thành tựu). Phần tử ĐỘNG:
  - Tiêu đề "Huy hiệu Toán" · "Mùa 2026–27 · album 12/40 sao · ★4–★5 được trung tâm tặng bản cứng".
  - Khối SẮP ĐẠT (tối đa 3 dòng): "Helios ★3 — còn 1 tháng đạt chuẩn".
  - Lưới 8 thẻ huy hiệu. Mỗi thẻ: dải tiêu đề tô MÀU RIÊNG của huy hiệu (chưa có sao = xanh đêm xám) · hình huy hiệu theo sao đang có
    (chưa có = hình KHOÁ) · tên · việc ghi nhận · ★★☆☆☆ · "Tới ★3: 3/4 tháng đạt chuẩn" + thanh ·
    "12/54 bạn trong khối có ★2" · nhãn "Hiếm" khi < 10% khối có · ★4–5: "chờ thầy cô trao bản cứng" / "đã nhận bản cứng" · "×2".
  - Bấm thẻ → MỞ RỘNG tại chỗ: câu chuyện 1 dòng · checklist THÁNG NÀY (✓ đạt / ☐ chưa / – chưa áp dụng) ·
    dải các tháng T7…T4 (✓ đạt chuẩn · ★ hoàn hảo · – chưa áp dụng · * đang tạm tính).
  - Khoảnh khắc ĐẠT SAO MỚI: lớp phủ tối toàn màn, hình huy hiệu sao mới to giữa vầng sáng vàng, "Huy hiệu mới" · "Athena ★3" ·
    "+100 EXP" · nút "Tuyệt!".
  Trạng thái: ① giữa năm (có sao, 1 thẻ mở rộng) · ② mới vào (0 sao, toàn hình khoá) · ③ lớp phủ đạt sao mới.

ICON NHIỆM VỤ (vật phẩm fantasy, mỗi cái 1 vật KHÁC NHAU; không trùng hình huy hiệu / rank / icon ô Home trong ảnh gốc):
  nv_N1 Vượt 1 Thử thách  — thanh kiếm cắm trên phiến đá phát sáng xanh
  nv_N2 Luyện 20 câu      — cuộn giấy da mở + bút lông ngỗng
  nv_N3 Sửa sai           — bình thuốc hồi phục thuỷ tinh, nước xanh lá phát sáng
  nv_T1 Đúng hẹn cả tuần  — đồng hồ bỏ túi mở nắp, dây xích vàng
  nv_T2 ET từ 80%         — bia bắn cung tròn, mũi tên cắm giữa tâm
  nv_T3 Thử thách 4 ngày  — ngọn đuốc cháy trên giá sắt
  nv_T4 Lấp 1 lỗ          — mảnh pha lê lắp vừa khe trên tảng đá, loé sáng chỗ khớp
  nv_M1 MT bứt phá        — lá cờ vàng cắm trên đỉnh núi nhỏ
  nv_M2 Thử thách 15 ngày — cuốn lịch bìa da mở, trang có nhiều dấu sao nhỏ (không số)
  nv_chang Chặng tháng    — cột mốc đá có dải băng vàng quấn
  nv_ngay  Hôm nay        — đèn lồng thắp sáng
  nv_tuan  Tuần           — sổ nhiệm vụ bìa da đóng dấu sáp đỏ
  nv_thang Tháng          — mặt trăng lưỡi liềm trong vòng sao
  nv_ruong_dong           — rương gỗ viền vàng ĐÓNG, ổ khoá
  nv_ruong_mo             — CÙNG rương đó MỞ, ánh vàng + vài đồng xu bay lên
  nv_vong_quay            — bánh xe may mắn bằng gỗ, nan gắn đá quý nhiều màu
  (nút "Thử thách" dùng lại nv_N1, nút "Tự luyện" dùng lại nv_N2 — không vẽ thêm)
  fx_sao_moi_sang         — vầng sáng vàng toả tròn + đốm lấp lánh, giữa trống (đặt SAU huy hiệu ở lớp phủ sao mới)

Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh để duyệt (có chữ + số mẫu, CHỈ để xem bố cục — không cắt ra dùng):
   #01 man_nhiem_vu_dt_1   — điện thoại dọc, Nhiệm vụ ① giữa tháng (cuộn dài, đủ 4 khối)
       → DỪNG, chờ Thùy duyệt phong cách rồi mới làm tiếp
   #02 man_nhiem_vu_ipad_1 — iPad ngang, Nhiệm vụ ①, lưới 2 cột
   #03 man_nhiem_vu_dt_2   — điện thoại, Nhiệm vụ ② đầu tháng
   #04 man_nhiem_vu_dt_3   — điện thoại, Nhiệm vụ ③ chưa mở
   #05 man_album_dt_1      — điện thoại, Album ① giữa năm, thẻ Athena mở rộng
   #06 man_album_ipad_1    — iPad ngang, Album ①
   #07 man_album_dt_2      — điện thoại, Album ② mới vào (toàn hình khoá)
   #08 man_album_dt_3      — điện thoại, Album ③ lớp phủ "Athena ★3"
B. Icon nhiệm vụ:
   #09 nv_N1 · #10 nv_N2 · #11 nv_N3 · #12 nv_T1 · #13 nv_T2 · #14 nv_T3 · #15 nv_T4 · #16 nv_M1 · #17 nv_M2
C. Icon khối + rương + vòng quay:
   #18 nv_chang · #19 nv_ngay · #20 nv_tuan · #21 nv_thang · #22 nv_ruong_dong · #23 nv_ruong_mo · #24 nv_vong_quay
D. Hiệu ứng:  #25 fx_sao_moi_sang

LUẬT RIÊNG:
  - KHÔNG khẩu hiệu động viên, KHÔNG tiếng Anh ngoài tên riêng. Mọi con số trong ảnh toàn cảnh đúng như đơn.
  - Giữ nguyên: đúng các nhiệm vụ, số, tên như trên. Không thêm tính năng.

Bắt đầu với #01.
```

---

## Đơn 4 — Hồ sơ (profile) học sinh — GỬI SAU Đơn 2 + 3

Đính kèm: `reference_rpg_ipad.png` · hình đã duyệt của Đơn 2 (huy hiệu ★1–★5 + khoá) + Đơn 3 (biểu tượng + khung avatar) · ảnh chụp
`?xem=gami&man=ho_so&tt=1&an` · `tt=2` · `tt=3` · `tt=4` · `?xem=gami&man=the_tv&an`.
Đơn này KHÔNG có hình rời mới — chỉ ảnh toàn cảnh; Claude dựng màn theo ảnh bằng hình của Đơn 2 + 3.

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            ho-so
Mô tả màn:      Hồ sơ KHOE của học sinh trung tâm dạy thêm BK Academy — "thẻ nhân vật" của game nhập vai, style Anime RPG.
                Em BẤM VÀO AVATAR của mình ở màn chính là mở. Phase này CHỈ em tự xem (xem hồ sơ bạn khác = phase sau).
                DÙNG HÌNH HUY HIỆU + BIỂU TƯỢNG BẬC + KHUNG AVATAR ĐÍNH KÈM — không vẽ lại.

Phần tử ĐỘNG (code vẽ chữ; trong ảnh toàn cảnh vẽ chữ mẫu đúng như dưới), từ trên xuống:
  1 ĐẦU HỒ SƠ: avatar (ảnh thật hoặc 2 chữ viết tắt "MA") trong KHUNG AVATAR CỦA BẬC, đặt nổi trên tranh nền ·
    họ tên "Nguyễn Minh Anh" (Philosopher, to) · "7S2 · khối 7" · ô DANH HIỆU nhỏ viền vàng "Xuất sắc tháng 9" (không có thì ẩn ô).
  2 CHỌN MÔN: chip "Toán" · "KHTN" (em học 1 môn thì ẩn).
  3 KHỐI RANK: dải tiêu đề màu chương + "Xem Rank ›" · biểu tượng bậc + "Captain" + ★★☆ · "5.290 Điểm Rank · hạng 12/54 khối"
    · thanh "Còn 2.585 điểm lên General".
  4 3 HUY HIỆU KHOE: 3 ô lớn (hình huy hiệu + tên + sao), ô trống có dấu + viền nét đứt, nút "Đổi".
  5 ALBUM THU GỌN: 8 hình nhỏ + số sao mỗi cái · "14/40 sao ›".
  6 THÁNG NÀY: 3 ô số: "Đua tháng #9/52" · "Chặng cấp 12/30" · "Bản cứng 1".
  7 KỶ NIỆM CÁC MÙA: dải "Mùa 2026–27 · King" (giữ mãi); mùa đầu = ô trống viền nét đứt có chữ giải thích.
Trạng thái: ① em khá (Captain, 2 huy hiệu khoe, có danh hiệu) · ② em mới (Novice, 0 huy hiệu, không danh hiệu) ·
            ③ em bậc thần (God of War — khung thần + hào quang, nổi bật nhất) · ④ tấm chọn 3 huy hiệu khoe trượt từ dưới lên
            (lưới 8, chưa đạt thì khoá, số thứ tự 1–2–3 ở góc ô đã chọn, nút Huỷ / Lưu).
THẺ TV LỚP: 1 dòng: avatar-khung · tên ngắn · biểu tượng bậc · 3 huy hiệu khoe — KHÔNG hiện hạng.

Phiên bản kit:  v1 (giao từng hình — xem CÁCH GIAO HÀNG trong PHONG CÁCH CHUNG)

══ DANH SÁCH GIAO (đúng thứ tự) ══
A. Ảnh toàn cảnh (có chữ + số mẫu):
   #01 man_ho_so_dt_1   — điện thoại dọc, trạng thái ① (cuộn dài, đủ 7 khối)   → DỪNG, chờ Thùy duyệt rồi mới làm tiếp
   #02 man_ho_so_ipad_1 — iPad ngang, trạng thái ①
   #03 man_ho_so_dt_2   — điện thoại, ② em mới
   #04 man_ho_so_dt_3   — điện thoại, ③ em bậc thần
   #05 man_ho_so_dt_4   — điện thoại, ④ tấm chọn huy hiệu khoe
   #06 the_tv_lop       — 3 thẻ TV xếp dọc (God of War · Captain · Novice), khổ ngang 1600×900

LUẬT RIÊNG:
  - Tách bạch BẬC RANK / HUY HIỆU / DANH HIỆU (bảng đầu file) — không dùng màu/khung của thứ này cho thứ kia.
  - Không thêm like/bình luận/theo dõi (phase sau). Đúng 7 khối, đúng thứ tự.

Bắt đầu với #01.
```

---

## Đơn 5 — "Thế giới BK": mạng xã hội KHOE nội bộ — v2 (theo mockup Thùy đã chốt 29/09) — GỬI SAU Đơn 2 + 3

> Logic: `spec-the-gioi-bk.md` (§4 Thế giới không ngập · §6 tên kèm lớp · §6b Bạn bè). **Mockup đã chốt (bấm được):**
> https://claude.ai/artifact/QNDbroHiEMNPctHjS5dWTb — chụp màn hình mockup đính kèm cho ChatGPT làm BỐ CỤC (ChatGPT vẽ lại cho đẹp theo style,
> giữ đúng khối/thứ tự). Cấu trúc đơn: **ẢNH TOÀN CẢNH trước** (5 màn, Pha B — Thùy duyệt) → **vẽ RIÊNG từng phần nhỏ** (Pha D, mỗi hình 1 lượt).
> Thùy 29/09: vị trí = **ô "Thế giới BK" trên màn chính** · 20 icon tương tác = **ChatGPT VẼ theo style** (không mua sticker).

Đính kèm: `reference_rpg_ipad.png` + hình đã duyệt Đơn 2 (huy hiệu) + Đơn 3 (biểu tượng bậc + khung avatar) + ảnh chụp mockup (5 màn dưới).

```
ĐƠN ĐẶT HÀNG
App:            hs
Màn:            the-gioi-bk (5 ảnh toàn cảnh, cùng style Anime RPG — theo PHONG CÁCH CHUNG)
Mô tả:          "Thế giới BK" = mạng xã hội KHOE nội bộ của học sinh trung tâm BK Academy. HS KHÔNG đăng bài, KHÔNG chat, KHÔNG gõ chữ:
                tin do HỆ THỐNG tự sinh từ thành tích thật; bạn bè THẢ CẢM XÚC + BÌNH LUẬN bằng câu/sticker chọn sẵn — thao tác Y HỆT FACEBOOK
                (Thùy 29/09: "UX quen thuộc giống FB, đừng bắt học cái mới"), chỉ vẽ lại theo style. Cảm giác: "bảng tin chiến công" của
                một thành phố game nhập vai — ai cũng thấy bạn mình đang cố gắng. CHỈ tin tốt, không bao giờ hiện điểm kém / hạng thấp.
                BỐ CỤC: bám ảnh chụp mockup đính kèm (đúng khối, đúng thứ tự) — vẽ lại cho đẹp theo style.
LUẬT TÊN:       MỌI tên học sinh đi kèm NHÃN LỚP ngay cạnh (vd "Nguyễn Minh Khang [9A1]" — nhãn nhỏ viền vàng) — trên tin, lời khen,
                danh sách bạn, lời mời, gợi ý. Em chọn "hiện Mã HS" thì thay bằng avatar ẩn danh + mã (HS0412), KHÔNG tên, KHÔNG lớp.

MÀN 1 — TAB 🌏 THẾ GIỚI (mở từ ô "Thế giới BK" ở màn chính). Phần tử ĐỘNG (chữ/khối do code vẽ, không vẽ vào ảnh):
  - Đầu trang: nút quay lại · tiêu đề "Thế giới BK" · công tắc nhỏ "Tên | Mã HS" · thanh 3 TAB có icon: Thế giới · Bạn bè · 9A1 (kênh lớp).
  - Dải "đang học": đèn nhỏ phát sáng + "14 bạn BK đang học · 3 bạn của em".
  - CHỈ TIN TẦNG S hiện RIÊNG (thẻ LỚN viền vàng dày + ruy băng vàng trên đầu, chữ "CỰC PHẨM" code vẽ đè + pháo giấy):
      "Nguyễn Minh Khang [9A1] lên bậc Hero · Toán" (BIỂU TƯỢNG BẬC Hero Đơn 3 to giữa thẻ) + dòng nổi bật 👑 "Cô Lan khen";
      "HS0412 trúng trà sữa 🧋 ở Mở Rương" (em ẩn tên).
  - Mục "Hôm nay ở BK" = THẺ GỘP tin tầng A, mỗi loại 1 thẻ (KHÔNG hiện từng tin A ở Thế giới — tránh ngập):
      "🏆 Hôm nay 11 bạn Nhất buổi · Hà [9A1] · Đức [7S2] · Châu [8A1] · +8" · "🚩 Hôm nay 6 đội thắng game buổi" · "🏅 Tuần này 23 bạn nhận huy hiệu".
      Nút "Xem tất cả · khen" → thẻ MỞ RỘNG: mỗi bạn 1 dòng (avatar · tên [lớp] · việc đạt · nút "Khen" / "Đã khen 🔥").
  - DƯỚI MỖI TIN S: hàng đếm icon "🔥 12 · 👏 8 · 🐐 5" (icon VẼ theo style) · 2 câu mới nhất + người gửi [lớp] · "+14 bạn" · nút "Khen".
  - Tin của người em đã kết bạn có nhãn nhỏ "bạn".
  Trạng thái: ① 2 tin S + 3 thẻ gộp đóng · ② 1 thẻ gộp đang MỞ RỘNG · ③ ít tin (không có S; dải "đang học" thành "Hôm nay 87 bạn đã luyện 1.240 câu").

MÀN 2 — TAB 🤝 BẠN BÈ:
  - Thẻ đầu: "Bạn bè của em · 5 bạn · bạn đồng ý mới thành bạn bè" + nút "+ Kết bạn".
  - Hàng "3 bạn đang học lúc này": avatar tròn có chấm xanh + tên ngắn.
  - "Lời mời kết bạn (2)": mỗi dòng avatar · tên [lớp] · "3 bạn chung" · nút "Đồng ý" (vàng) · "Để sau" (viền).
  - "Bạn bè khoe": tin S + tin A của bạn hiện CHI TIẾT từng tin (thẻ như màn 1).
  - "Bạn bè đang cố gắng": tin nỗ lực tầng B của bạn — DÒNG NHỎ (icon loại tin · tên [lớp] · việc · giờ).
  Trạng thái: ① có lời mời + có bạn đang học · ② chưa có bạn nào (thẻ mời kết bạn to, gợi ý 3 bạn cùng lớp).

MÀN 3 — TẤM KẾT BẠN (trượt từ dưới lên khi bấm "+ Kết bạn"):
  - "Kết bạn · Chỉ học sinh BK · bạn đồng ý mới thành bạn bè" · nút đóng.
  - Ô tìm "Tìm tên, mã HS hoặc lớp" (ô nhập DUY NHẤT của cả tính năng — chỉ để tìm, không gửi chữ cho ai).
  - "Gợi ý cho em": dòng avatar · tên [lớp] · lý do "Cùng lớp 9A1" / "4 bạn chung" · nút "Kết bạn" → "Đã gửi".
  Trạng thái: ① gợi ý (chưa gõ) · ② đang tìm "9A" có kết quả, 1 dòng "Đã gửi".

MÀN 4 — KÊNH LỚP (tab 🏰 9A1) + TẤM THẢ TƯƠNG TÁC:
  - Kênh lớp: tin S + A của lớp CHI TIẾT từng tin · "Nỗ lực hôm nay": dòng nhỏ tầng B · 1 tin của CHÍNH EM có nút "⋯" mở menu
    "Ẩn tin này" · "Ẩn tương tác trên tin".
  - ⚠ SỬA 29/09 (bỏ tấm "Khen" cũ — dùng tương tác kiểu FB): dưới mỗi tin = dòng "👍❤️🔥 Em, Hà [9A1] và 12 người khác · 5 bình luận" ·
    thanh [👍 Thích] [💬 Bình luận] · 1 bình luận xem trước. GIỮ nút Thích ⇒ dải 6 cảm xúc tròn + nút ＋ bật lên trên nút.
    Tấm BÌNH LUẬN trượt lên: bong bóng tên [lớp] + câu, sticker hiện to không bong bóng · đáy "Viết bình luận…" + 🙂 · bàn phím 2 tab Câu | Sticker.
    Trạng thái chụp theo trang xem mẫu hs.html?xem=gami&man=the_gioi&tt=5 · 7 · 8 · 9 · 10 · 11.
  - (CŨ — BỎ) TẤM THẢ TƯƠNG TÁC (trượt lên khi bấm "Khen"): tóm tắt tin · "Chọn 1 icon" lưới 20 icon 5×4 (đang chọn = vòng sáng vàng) ·
    "Chọn 1 câu" 8–10 câu HỢP LOẠI TIN (tin học tập: "Đỉnh nóc, kịch trần, bay phấp phới" · "Idol của em đây rồi" · "Xin vía học giỏi" ·
    "Thua Gia Cát Lượng đúng cây quạt" · "Thần đồng BK xuất hiện" · "10 điểm không có nhưng" · "Stan cậu luôn rồi" · "Gooo!") ·
    xem trước "🔥 Đỉnh nóc… — Minh Anh (em) [9A1]" · nút lớn "Gửi" (đã khen rồi thì "Đổi lời khen").
  Trạng thái: ① kênh lớp, menu "⋯" đang mở · ② tấm thả tương tác đã chọn icon + câu.

MÀN 5 — "ĐANG HỌC CÙNG EM" (dải nhỏ ĐÈ lên màn làm bài có sẵn — chỉ vẽ phần dải) + THÔNG BÁO:
  - Dải mảnh đầu màn làm bài: đèn phát sáng + "14 bạn BK đang học · 3 bạn của em" + dòng tin chạy chậm (bạn bè lên trước):
    "Bạn Hà (9A1) vừa làm xong 10 câu". Lúc vắng: "Hôm nay 87 bạn đã luyện 1.240 câu" — KHÔNG BAO GIỜ hiện "0 bạn".
  - Ô "Thế giới BK" trên màn chính: icon ô + "Thế giới BK" + dòng trạng thái "3 bạn đang học · 2 lời mời" + badge số.

Thiết bị:       điện thoại DỌC 430px (ảnh chính) + iPad NGANG 1180×820 cho màn 1 và 2 (2 cột tin).
Phong cách:     theo PHONG CÁCH CHUNG (Anime RPG), cùng họ ảnh gốc + Đơn 2/3. Khung/màu/hình = thiết kế gốc; CÁCH TƯƠNG TÁC = như Facebook.
Giữ nguyên:     KHÔNG ô gõ chữ gửi đi, KHÔNG chat/nhắn tin/chia sẻ/theo dõi một chiều, KHÔNG số lượt xem. Tin chỉ tốt.
                Bình luận CÓ (29/09) nhưng chỉ câu/sticker chọn sẵn. Bố cục tương tác giống FB để HS không phải học — phần còn lại thiết kế gốc.
Phiên bản kit:  v2

PHẦN VẼ RIÊNG (Pha D — mỗi hình 1 lượt tạo ảnh, PNG nền TRONG SUỐT, cùng họ 13 icon ô trong ảnh gốc; cỡ = cạnh dài).
Tên file PHẲNG, tiền tố tg_ (Claude đổi tên khi đưa vào app — bảng cuối file):
  tg_o_the_gioi            192  icon Ô "Thế giới BK" ở màn chính (quả cầu thế giới pha lê có lâu đài nhỏ, sáng vàng)
  tg_tab_the_gioi          128  icon tab Thế giới (quả cầu / bản đồ thế giới cổ)
  tg_tab_ban_be            128  icon tab Bạn bè (hai bàn tay đeo găng giáp nắm nhau / hai huy hiệu đan nhau)
  tg_tab_lop               128  icon tab Lớp (lâu đài nhỏ / cổng trường cổ)
  tg_ket_ban               128  nút "+ Kết bạn" (cuộn thư mời có dấu cộng vàng)
  tg_loi_moi               128  "Lời mời kết bạn" (phong thư sáp vàng)
  tg_tang_s · tg_tang_a · tg_tang_b    96  dấu tầng tin: viên đá quý VÀNG rực · XANH LAM · ĐỒNG
  tg_ruy_bang_s       1024×160  ruy băng vàng cổ vắt ngang đầu thẻ tin S — KHÔNG chữ, giữa trống
  tg_phao_giay       1024×1024  pháo giấy vàng + đốm sáng rơi, nền trong suốt, phủ lên thẻ tin S
  tg_thay_co_khen          128  "Thầy cô khen" — vương miện vàng đính đá, sang hơn mọi icon tương tác (chỉ GV/TA thả)
  tg_dang_hoc               96  đèn lồng / ngọn lửa ma thuật nhỏ phát sáng ("đang học")
  tg_avatar_an_danh        256  avatar chung khi em chọn hiện Mã HS — áo choàng trùm mũ, KHÔNG thấy mặt, nền tròn xanh đêm
  ICON LOẠI TIN (96): tg_tin_len_bac (mũi tên vàng vút lên) · tg_tin_huy_hieu (huy chương + tia sáng) · tg_tin_nhat_buoi (cúp nhỏ) ·
    tg_tin_game (cờ đội) · tg_tin_tra_sua (ly trà sữa phép thuật) · tg_tin_chuoi_ngay (ngọn lửa) · tg_tin_nhiem_vu (cuộn nhiệm vụ đóng dấu) ·
    tg_tin_xong_bai (sách + dấu tích) · tg_tin_chinh_phuc (lá cờ cắm trên đỉnh núi)
  20 ICON TƯƠNG TÁC (tg_tt_<mã>, 128 — phải ĐỌC RA NGHĨA ở cỡ 28px; giữ nghĩa emoji gốc, vẽ theo style):
    lua 🔥 · vo_tay 👏 · tram_diem 💯 · cup 🏆 · ten_lua 🚀 · set ⚡ · de_goat 🐐 · co_bap 💪 · nao 🧠 · no_nao 🤯 ·
    ngau 😎 · chao 🫡 · bai_su 🙇 · kim_cuong 💎 · ngoi_sao 🌟 · an_mung 🥳 · hong_tam 🎯 · co_4_la 🍀 · tim_tay 🫶 · bat_tay 🤝
    (mặt cười/biểu cảm: vẽ kiểu linh vật tròn dễ thương, KHÔNG mặt người thật; tất cả cùng 1 khung tròn đế đồng nhẹ để đồng bộ)
  Tổng: 45 hình.

LUẬT RIÊNG:
  - Chữ, tên, nhãn lớp, số, câu meme: code vẽ — KHÔNG vẽ vào ảnh.
  - Không icon/câu nào đọc thành mỉa (đã loại 💀 🗿 🤡 😂 🤓…). 👑 chỉ dùng cho "Thầy cô khen".
  - Ảnh toàn cảnh + bảng kiểm kê có cột "Vị trí & cỡ" + đủ 45 hình vẽ riêng (kit §2/§4/§8).
```

---

## Bảng đổi tên: file ChatGPT giao → file code (Claude làm, Thùy không cần làm)

| ChatGPT giao (`design/bk-ui-src/gami/`) | Code dùng (`public/bk-ui/hs/gami/`) |
|---|---|
| `hh_<key>_sao1..5` · `hh_<key>_khoa` · `hh_an` | `huy-hieu/<key>/sao1..5.png` · `khoa.png` (384px) · `huy-hieu/an.png` · **Claude thu nhỏ MỌI mức** → `nho_sao1..5.png` · `nho_khoa.png` (128px, cho chỗ vẽ ≤ 64px — đúng số sao em đang có, không phải luôn ★1; đổi 01/10, thay `nho_48`) |
| `phoi_<key>` | không vào app — gửi xưởng |
| `rank_<n>_<ten>` · `khung_<n>_<ten>` | `rank/<n>/bieu_tuong.png` (384px) · `khung_avatar.png` · **Claude thu nhỏ** → `bieu_tuong_64.png` · `khung_avatar_96.png` (128px) |
| `rank_sao` · `rank_hao_quang_than` · `rank_len_bac` | `rank/sao.png` · `hao_quang_than.png` · `len_bac.png` |
| `nv_<mã>` · `fx_sao_moi_sang` | `nhiem-vu/<mã>.png` · `fx/sao_moi_sang.png` |
| `bang_duyet_*` · `man_*` · `the_tv_lop` | `design/handoff/gami-v1/reference/` (ảnh chuẩn để dựng màn, không vào app) |
| `tg_<tên>` (Đơn 5 Thế giới BK) | `the-gioi/<tên>.png` (bỏ tiền tố `tg_`; `tg_tt_<mã>` → `the-gioi/tuong-tac/<mã>.png`; `tg_tin_<loại>` → `the-gioi/tin/<loại>.png`) |
