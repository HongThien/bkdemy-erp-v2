# hs-luc-dia-rung-v4 — Lục địa rừng

Nền cập nhật v4: `assets/backdrop/nen_rung_va_duong_mon.png` đã thay bằng bản chibi ít cây, ánh sáng dịu hơn theo yêu cầu người dùng. Giữ nguyên đường dẫn nền.

## 1. Đơn đặt hàng

- App HS; màn `luc-dia-rung`; iPad ngang, khung thiết kế 1672 × 941, không có bảng bên phải.
- Cận cảnh Rừng Phép nhìn chéo từ trên cao; anime fantasy vẽ tay, ánh vàng ấm. Đường uốn lên xuống với các khúc cua khác nhau.
- Đủ 8 công trình hoàn chỉnh. Thứ tự độ phức tạp tăng dần do người dùng chốt: **túp lều → nhà gỗ → tháp canh → cầu dây leo → đền cổ → hầm ngục gốc cây → pháo đài → lâu đài**. Thứ tự 1–2 này thay mô tả ban đầu.
- Mỗi công trình ứng với một dạng bài/chuyên đề; tên, số thứ tự và đúng 5 sao thành thạo do code dựng. Không có chữ hoặc sao trong ảnh nền.
- Biến thể nam/nữ chỉ đổi nhân vật; mỗi giới có đứng, chạy chân trái trước, chạy chân phải trước. Nền và công trình dùng chung.
- Trạng thái động: đã xong, đang học, chưa tới, không có chuyên đề, đang di chuyển; dùng cờ/sương/mũi tên/quái của bộ có sẵn.
- Mỗi thành phần một ảnh riêng, sinh bằng imagegen; không cắt, phóng to hoặc xóa nền từ ảnh toàn cảnh.
- `reference/toan_canh_luc_dia_rung.png` là concept v3 đã chọn. Asset được sinh lại nên chi tiết kiến trúc không trùng từng pixel với concept. Không có ảnh `boss_thuy_dung.png` trong đầu vào phiên này; nhân vật dùng phong cách chibi fantasy thống nhất trong bộ.

## 2. Font & bảng màu theo biến thể

| Vai trò | Nam | Nữ |
|---|---|---|
| Tên dạng bài | Baloo 2, 700, màu #FFF7DA, viền tối #243B25 | Chung |
| Số thứ tự | Baloo 2, 800, trắng; badge xanh #274D35 | Chung |
| Sao đạt | #FFD35A; viền #865519 | Chung |
| Sao chưa đạt | #A9B29A; viền #465545 | Chung |
| Đường đã đi | Lớp sáng #FFE19A, độ mờ 0.35 | Chung |
| Áo choàng nhân vật | Xanh rừng, áo kem, boots nâu | Chung; tóc buộc đuôi ngựa |
| Cảnh | Xanh rừng #315D37, nắng #F8D77A, đá #B9B098 | Chung |

Tên cao khoảng 2% khung; hàng sao cao 2.2%, rộng 9–10%; tên tối đa 2 dòng. Font là chữ thật, không xuất ảnh. Không thêm chức năng hoặc thanh điều hướng mới.

## 3. Bảng kiểm kê

Tọa độ `(x%, y%)` tính từ góc trên trái, theo khung 1672 × 941. **Chân** là điểm giữa vùng tiếp đất của chủ thể, không phải tâm hình. Bề rộng dưới đây tính theo phần kiến trúc nhìn thấy; giữ nguyên tỉ lệ ảnh. PNG có lề trong suốt: code dùng neo tiếp đất của chủ thể để căn, không coi mép hộp PNG là chân.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Cảnh rừng, cây, đá, nước, bãi đất, đường | Phủ 100% khung; dưới mọi đối tượng | BACKDROP | Không | Chung | assets/backdrop/nen_rung_va_duong_mon.png | Không công trình; cây hầm ngục nằm trong asset 06 |
| 02 | body | 1 — Túp lều | Chân (12,72), rộng 10%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/01_tup_leu.png | Đầu chặng, đơn giản nhất |
| 03 | body | 2 — Nhà gỗ | Chân (19,25), rộng 10%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/02_nha_go.png | Mái ngói cam, cửa sáng |
| 04 | body | 3 — Tháp canh | Chân (36,56), rộng 11%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/03_thap_canh.png | Tháp gỗ hoàn chỉnh |
| 05 | body | 4 — Cầu dây leo | Chân (40,31), rộng 13%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/04_cau_day_leo.png | Neo giữa hai chân trụ; điểm tương tác ở lối lên cầu |
| 06 | body | 5 — Đền cổ | Chân (55,77), rộng 13%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/05_den_co.png | Cổng phép xanh và bậc đá |
| 07 | body | 6 — Hầm ngục gốc cây | Chân (63,30), rộng 15%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/06_ham_nguc_goc_cay.png | Có thân/tán/rễ cây; không vẽ thêm cây nền cùng chỗ |
| 08 | body | 7 — Pháo đài | Chân (80,67), rộng 15%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/07_phao_dai.png | Các dải vải xanh trên tường là trang trí cố định |
| 09 | body | 8 — Lâu đài | Chân (90,35), rộng 18%; trên nền | DECOR | Chọn chuyên đề | Chung | assets/decor/08_lau_dai.png | Đích cuối, phức tạp và hoành tráng nhất |
| 10 | body | Tên dạng bài 1 | Tâm x12, y74–77; rộng 12%; trên nền | TEXT | Có | Chung | — | Baloo 2, tên theo dữ liệu |
| 11 | body | 5 sao điểm 1 | Tâm x12, y79; rộng 10%; dưới tên | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Luôn 5 sao |
| 12 | body | Tên dạng bài 2 | Tâm x19, y27–29; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 13 | body | 5 sao điểm 2 | Tâm x19, y31; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 14 | body | Tên dạng bài 3 | Tâm x36, y58–60; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 15 | body | 5 sao điểm 3 | Tâm x36, y62; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 16 | body | Tên dạng bài 4 | Tâm x40, y33–35; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 17 | body | 5 sao điểm 4 | Tâm x40, y37; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 18 | body | Tên dạng bài 5 | Tâm x55, y79–81; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 19 | body | 5 sao điểm 5 | Tâm x55, y83; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 20 | body | Tên dạng bài 6 | Tâm x63, y32–34; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 21 | body | 5 sao điểm 6 | Tâm x63, y36; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 22 | body | Tên dạng bài 7 | Tâm x80, y69–71; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 23 | body | 5 sao điểm 7 | Tâm x80, y73; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 24 | body | Tên dạng bài 8 | Tâm x90, y37–39; rộng 12% | TEXT | Có | Chung | — | Như 10 |
| 25 | body | 5 sao điểm 8 | Tâm x90, y41; rộng 10% | GLYPH | Có | Chung | assets/svg/sao_thanh_thao.svg | Như 11 |
| 26 | body | Số thứ tự 1–8 | Badge trên góc trái mái, đường kính 2.5% ngang | SHAPE+TEXT | Có | Chung | — | Không ghi số vào công trình |
| 27 | body | Nhân vật nam đứng | Chân di chuyển; cao theo bảng độ sâu | CHAR | Có | Nam | assets/characters/nam_dung.png | Hướng phải |
| 28 | body | Nam chạy, chân trái trước | Cùng neo/chiều cao với 27 | CHAR | Có | Nam | assets/characters/nam_chay_chan_trai.png | Frame chạy 1 |
| 29 | body | Nam chạy, chân phải trước | Cùng neo/chiều cao với 27 | CHAR | Có | Nam | assets/characters/nam_chay_chan_phai.png | Frame chạy 2 |
| 30 | body | Nhân vật nữ đứng | Như 27 | CHAR | Có | Nữ | assets/characters/nu_dung.png | Hướng phải |
| 31 | body | Nữ chạy, chân trái trước | Như 27 | CHAR | Có | Nữ | assets/characters/nu_chay_chan_trai.png | Frame chạy 1 |
| 32 | body | Nữ chạy, chân phải trước | Như 27 | CHAR | Có | Nữ | assets/characters/nu_chay_chan_phai.png | Frame chạy 2 |
| 33 | body | Đường đã đi sáng | Theo tâm đường ở dưới, nét rộng bằng mặt đường | SHAPE | Có | Chung | — | Chỉ phủ ánh sáng, đường đất đã có trong nền |
| 34 | body | Cờ hoàn thành | Trên mái; cao 4% khung | ILLUST có sẵn | Có | Chung | Bộ cờ hiện có của app | Không sinh lại trong kit |
| 35 | body | Quái nhỏ | Sát cửa điểm đang đánh, tránh vùng tên/sao | CHAR có sẵn | Có | Chung | Bộ quái hiện có của app | Không có trong concept sạch |
| 36 | body | Sương khóa | Bao công trình chưa tới; không che hàng sao | ILLUST có sẵn | Có | Chung | Bộ sương hiện có của app | Không sinh lại |
| 37 | body | Mũi tên vàng | Cách đỉnh mái 2% cao; cao 3%, nhún 1% | GLYPH có sẵn | Có | Chung | Bộ mũi tên hiện có của app | Không sinh lại |

**Vùng dành riêng cho tên và sao:** tám hình chữ nhật tâm x lần lượt 12,19,36,40,55,63,80,90; rộng 12%; từ y chân +1 đến chân +8. Không đặt cây, quái, số, cờ, nhân vật dừng hoặc lớp sương vào các vùng này. Đây là vùng chừa để đặt chữ, không phải vùng cấm chữ. Đỉnh mái chừa thêm 2–5% cho mũi tên. Vùng thanh trên cùng y0–12%: cấm đặt chữ tương tác/điểm bấm mới; đỉnh cây/lâu đài có thể nằm sau thanh do yêu cầu mới đưa cảnh gần mép ảnh. Đáy y92–100% không đặt nhãn.

## 4. Trạng thái & hành vi

- Có N≤8 chuyên đề: gán theo thứ tự 1→N, giữ đủ 8 công trình; các điểm còn lại tắt bấm, ẩn tên dữ liệu và hiện 5 sao rỗng, không làm công trình đổ nát.
- Thành thạo 0–5: luôn đúng 5 glyph; tô số sao đạt theo dữ liệu, còn lại xám. Không tự suy sao từ trạng thái hoàn thành.
- Đã xong: thêm cờ có sẵn. Đang học: mũi tên vàng và quái theo dữ liệu. Chưa tới: sương và khóa tương tác. Đang tải: giữ bố cục, chưa cho chạy vào điểm.
- Chạm công trình khả dụng: chạy theo tiến độ tuyến đến cửa rồi chuyển màn chặng; co công trình khoảng 2% khi nhấn, không thêm hover.
- Animation chạy mới dùng sáu frame mỗi giới trong `../Animation/nam/` và `../Animation/nu/`, mỗi frame 100ms, vòng 600ms. Giữ cùng tỉ lệ hình và neo chân theo bảng `anchors` trong preview; đi sang trái thì lật ngang sprite. Chi tiết trong `../Animation/ANIMATION.md`; hai frame cũ trong assets vẫn giữ để tương thích.

**Nhân vật theo độ sâu:** y30% cao 4.5% khung; y55% cao 6%; y80% cao 7.5%; nội suy tuyến tính và giới hạn 4–8%. Chiều cao đo tóc→đế boots, bỏ qua lề alpha. Đế chân neo ở điểm di chuyển; giữa các frame dùng cùng baseline, không căn theo tâm hộp ảnh.

**Tuyến đi đề xuất, ≥24 điểm, thứ tự từ trái sang phải theo tiến độ:** các cặp là x%,y%; `M` đánh dấu chân công trình. Đây là tọa độ xấp xỉ để dựng spline, không phải dữ liệu tâm đường đã đo tự động. Đường vẽ tay trong concept/nền có chỗ tiếp cận cửa lệch khỏi tuyến chính; đoạn tới M là tiếp cận cửa trên bãi đất, không nối thẳng qua khe nước. Cần đối chiếu khi tích hợp để spline nằm trên mặt đất.

| Đoạn | Điểm theo thứ tự |
|---|---|
| Vào → M1 | (0,50), (4,52), (7,57), (7,63), (4,70), (5,75), (9,75), **(12,72) M1** |
| M1 → M2 | (16,68), (19,62), (18,53), (15,45), (13,39), (14,34), (17,31), **(19,25) M2** |
| M2 → M3 | (23,31), (27,36), (30,40), (35,42), (42,44), (46,49), (45,54), (40,55), **(36,56) M3** |
| M3 → M4 | (34,49), (32,43), (29,39), (28,34), (29,27), (32,21), (35,22), (37,27), **(40,31) M4** |
| M4 → M5 | (44,37), (46,45), (46,54), (43,64), (43,70), (46,75), (51,75), **(55,77) M5** |
| M5 → M6 | (61,80), (66,83), (68,78), (67,70), (63,60), (60,52), (58,46), (59,41), (62,37), **(63,30) M6** |
| M6 → M7 | (68,37), (71,40), (71,46), (69,52), (72,56), (76,57), (79,61), **(80,67) M7** |
| M7 → M8 → Ra | (85,65), (90,62), (94,57), (94,51), (92,47), (86,44), (84,40), (86,37), **(90,35) M8**, (94,39), (97,46), (100,50) |

Vào/ra cùng y50%, bề rộng đường tại mép khoảng 4% bề ngang khung. Ở xa 3–4%, ở gần 5–6%. Không cho nhân vật nhảy từ đoạn đường này sang đoạn khác chỉ vì chúng gần nhau; dùng chỉ số tiến độ trên tuyến.

**Chủ đề >8:** trang kế dùng cảnh lật ngang và tọa độ x mới=100−x; giữ chỉ số chuyên đề tăng theo tiến độ mới. Hai mép bản vẽ hiện tại cùng cao gần giữa màn nhưng chưa có bằng chứng ghép gương liền tuyệt đối về đá/cây và mặt đường; tính năng nối cảnh cần kiểm tra hình ghép trước khi dùng sản phẩm.

## 5. Thứ tự lớp

1. Nền gồm địa hình, nước, cây/đá phong cảnh và mặt đường.
2. Ánh sáng đoạn đường đã đi, nằm dưới công trình/nhân vật; không tô vào nước.
3. Công trình và nhân vật sắp theo tọa độ chân y tăng dần: phía xa 02→06→04→08, phía gần 03→07→01→05. Ở bố cục này công trình không cần che nhau; tránh tăng kích thước tới mức đè vùng nhãn.
4. Nhân vật phía trước một công trình khi chân y lớn hơn chân công trình; phía sau khi nhỏ hơn. Nền là ảnh phẳng, không có lớp cây tiền cảnh độc lập: tuyến nhân vật tránh cây/đá, không giả vờ chúng có thể che sprite.
5. Quái/cờ/sương dùng bộ có sẵn; nhãn, 5 sao và badge trên cùng; mũi tên nổi trên mái. Thanh UI hiện có của app trên mọi lớp cảnh.

## 6. Danh sách file trong kit

Bổ sung theo yêu cầu animation 2D: `../Animation/nam/` và `../Animation/nu/` mỗi thư mục có 6 PNG riêng; `../Animation/ANIMATION.md` ghi nhịp, neo và cách tích hợp; `../Animation/xem_thu_chay_2d.html` là bản xem thử chạy thật, không phải màn UI của app. Yêu cầu bổ sung này mở rộng cấu trúc kit ban đầu.

`reference/` chứa concept sạch; `assets/backdrop/` chứa nền riêng; `assets/decor/` có đúng 8 ảnh công trình; `assets/characters/` có đúng 6 tư thế; `assets/svg/` có glyph sao gõ tay. Các PNG rời có alpha; không có ảnh ghép nhiều công trình hoặc sprite sheet. Tên file mô tả tiếng Việt không dấu, tiền tố số của công trình là thứ tự trên đường.

Kích thước được ghi trong bảng bên dưới sau kiểm tra file. Không xóa nền bằng khóa màu. Lề và ánh sáng bán trong suốt do công cụ tạo ảnh giữ nguyên; khi đặt sprite cần dùng neo chân thay cho mép canvas.

Neo tiếp đất xấp xỉ trong chính PNG (tỉ lệ 0–1, đo bằng mắt, không phải tọa độ trên màn): lều (0.50,0.90), nhà (0.65,0.90), tháp (0.50,0.90), cầu (0.50,0.90), đền (0.50,0.89), hầm ngục (0.50,0.91), pháo đài (0.50,0.88), lâu đài (0.50,0.95). Neo nhân vật ở giữa hai boots khi đứng và dưới boot thấp nhất khi chạy; dùng cùng trục thân x≈0.55 thay vì tâm bề rộng cape. Các neo này cần tinh chỉnh nhỏ khi ghép trực tiếp; không sửa hoặc cắt file nguồn.

Prompt sinh asset bằng imagegen: từng công trình một ảnh mới, đúng loại/dáng theo concept, góc nhìn chéo trên cao, ánh vàng, PNG alpha thật, không cảnh/chữ/sao; nhân vật cùng mẫu đứng, hai tư thế chạy đổi chân/tay trước–sau, giữ trang phục và baseline. Nền là chỉnh từ concept, bỏ toàn bộ công trình và cây hầm ngục. Không dùng CLI, không crop reference.

| File | Kích thước | Kênh |
|---|---|---|
| assets/backdrop/nen_rung_va_duong_mon.png | 1672 × 941 | RGB |
| assets/characters/nam_chay_chan_phai.png | 1024 × 1536 | RGBA |
| assets/characters/nam_chay_chan_trai.png | 1024 × 1536 | RGBA |
| assets/characters/nam_dung.png | 1024 × 1536 | RGBA |
| assets/characters/nu_chay_chan_phai.png | 1024 × 1536 | RGBA |
| assets/characters/nu_chay_chan_trai.png | 1024 × 1536 | RGBA |
| assets/characters/nu_dung.png | 1024 × 1536 | RGBA |
| assets/decor/01_tup_leu.png | 1536 × 1024 | RGBA |
| assets/decor/02_nha_go.png | 1478 × 1064 | RGBA |
| assets/decor/03_thap_canh.png | 1278 × 1230 | RGBA |
| assets/decor/04_cau_day_leo.png | 1671 × 941 | RGBA |
| assets/decor/05_den_co.png | 1536 × 1024 | RGBA |
| assets/decor/06_ham_nguc_goc_cay.png | 1536 × 1024 | RGBA |
| assets/decor/07_phao_dai.png | 1536 × 1024 | RGBA |
| assets/decor/08_lau_dai.png | 1313 × 1198 | RGBA |
| reference/toan_canh_luc_dia_rung.png | 1672 × 941 | RGB |


## Kiến trúc chibi v4

Đã thay 8 công trình bằng bản chibi mới: mái lớn, thân/cột mập, đá bo tròn, giản lược chi tiết. Cùng style nền v4; giữ nguyên tên file, thứ tự tăng độ phức tạp và vị trí bố cục. Xem `KIEN_TRUC_CHIBI_V4.md`, `xem_thu_kien_truc_chibi.html` và `reference/kien_truc_chibi_v4.png`. Dữ liệu khổ/hộp bao/neo chân trong `assets/decor/kien_truc_chibi_v4.json`; lấy đáy hộp bao để neo, không lấy đáy canvas.
