# hs-luc-dia-dong_gio-v1

## 1. Đơn đặt hàng
App hs · màn luc-dia-dong_gio · Đảo cối xay · iPad ngang, khung 1672×941. Style **chibi adventure fantasy**. Reference được duyệt: bảng màu tươi bản đầu, giảm vàng nhẹ; không dùng bản pastel nhạt. Tám kiến trúc thưa, hoàn chỉnh, trên một đường nối liên tục trái→phải. Tên và 5 sao do code đè lên cảnh, không chừa ô cỏ. Sinh riêng từng kiến trúc bằng imagegen, không cắt từ toàn cảnh. Tên file mô tả nội dung theo yêu cầu cuối. Công trình 2 giữ đúng lều vải trong ảnh đã duyệt, thay yêu cầu lều rơm trước đó.

## 2. Font & bảng màu
Baloo 2: tên chuyên đề, số, trạng thái; Pacifico chỉ nếu có chữ viết tay. Chung nam/nữ: xanh cỏ #7CA546, xanh cây #3E8565, mái ngọc #2696A4, đá kem #E4D7B2, đường cát #E5BD81, lúa #D9B65C, nước #6BAFC2. Ánh sáng ấm vừa, giảm sắc vàng khoảng 15% theo chỉ dẫn tạo ảnh; giữ tương phản và sắc xanh tươi. Không tạo chữ thành PNG.

## 3. Bảng kiểm kê
Chân là giữa bậc/điểm tiếp đất; phần trăm theo khung, gốc trên trái. PNG có lề alpha: khi neo, dùng hộp bao chủ thể thay vì đáy canvas.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Cảnh đồng gió và đường | Phủ toàn khung, sau mọi lớp | BACKDROP | không | chung | assets/backdrop/backdrop_luc_dia_dong_gio.png | Cây, lúa, suối, đá, hoa, đường; không có kiến trúc |
| 02 | body | 1 Nhà cối xay | Chân ≈(9%,51%), rộng ≈11%; trước nền | DECOR | nhấn | chung | assets/decor/decor_01_nha_coi_xay.png | Nhà mái cam, 4 cánh |
| 03 | body | 2 Lều trại | Chân ≈(24%,30%), rộng ≈14%; trước nền | DECOR | nhấn | chung | assets/decor/decor_02_leu_trai.png | Lều vải kem/cam, thùng, hàng rào sát nền móng |
| 04 | body | 3 Tháp gió | Chân ≈(36%,64%), rộng ≈8%; trước nền | DECOR | nhấn | chung | assets/decor/decor_03_thap_gio.png | Tháp đá tròn, mái ngọc |
| 05 | body | 4 Cầu đá | Chân/tâm mặt cầu ≈(46%,29%), rộng ≈13%; đè lên suối và đường nền | DECOR | nhấn | chung | assets/decor/decor_04_cau_da.png | Cầu vòm có mặt đường, không kèm suối |
| 06 | body | 5 Đền gió | Chân ≈(65%,37%), rộng ≈12%; trước nền | DECOR | nhấn | chung | assets/decor/decor_05_den_gio.png | Mái vòm, cột, họa tiết gió |
| 07 | body | 6 Hầm mỏ | Chân ≈(57%,71%), rộng ≈15%; trước nền | DECOR | nhấn | chung | assets/decor/decor_06_ham_mo.png | Khối đá, khung gỗ, đèn, ray ngắn |
| 08 | body | 7 Pháo đài đá | Chân ≈(81%,75%), rộng ≈18%; trước nền | DECOR | nhấn | chung | assets/decor/decor_07_phao_dai_da.png | Cổng và 2 tháp |
| 09 | body | 8 Lâu đài cối xay | Chân ≈(88%,44%), rộng ≈20%; trước nền | DECOR | nhấn | chung | assets/decor/decor_08_lau_dai_coi_xay.png | Lớn nhất; cánh cối xay ở tháp chính |
| 10 | body | Tên chuyên đề | Đè lên cảnh dưới chân từng mốc; rộng ≈12–16%, cao ≈3%; trên công trình | TEXT | có | chung | — | Baloo 2 đậm, viền/bóng tăng tương phản |
| 11 | body | 5 sao | Dưới tên, rộng ≈8–10%, cao ≈2.5%; lớp trên cảnh | GLYPH | có | chung | bộ sao dùng chung | Đổi màu/độ đầy theo tiến độ |
| 12 | body | Số thứ tự | Cạnh tên từng mốc, cao ≈2.5% | TEXT | có | chung | — | 1–8, code vẽ |
| 13 | body | Cờ hoàn thành | Trên mốc đã hoàn thành, rộng ≈3–4%; lớp nổi | ILLUST | có | chung | bộ cờ dùng chung | Cờ trạng thái không nằm trong PNG rời; cờ nhỏ có trong reference là chi tiết sinh thừa, không tái tạo |
| 14 | body | Mũi tên | Trên mốc đang học, cao ≈4%; lớp nổi | GLYPH | có | chung | bộ mũi tên dùng chung | Vàng, nhấp nhô |
| 15 | body | Sương | Theo hộp công trình chưa tới; đè công trình | ILLUST | có | chung | bộ sương dùng chung | Không nằm trong nền |
| 16 | body | Quái | Sát mốc hoạt động, cao ≈5–7%; neo chân | CHAR | có | chung | bộ quái dùng chung | Không vẽ vào reference |
| 17 | body | Đường tiến độ | Bám tâm đường, dưới nhân vật | SHAPE | có | chung | — | Đã đi vàng; chưa đi mờ |
| 18 | body | Chibi nam | Trên tâm đường, neo bàn chân; cao 5% tại y30, 7% tại y55, 9% tại y80 | CHAR | có | nam | assets/characters/chibi_nam_dung.png; chibi_nam_chay_1.png; chibi_nam_chay_2.png | Bộ nhân vật dùng chung từ kit thanh_co, giữ nguyên nhận dạng |
| 19 | body | Chibi nữ | Neo/cỡ như nam; lớp theo độ sâu chân | CHAR | có | nữ | assets/characters/chibi_nu_dung.png; chibi_nu_chay_1.png; chibi_nu_chay_2.png | Bộ dùng chung, không đổi theo khí hậu |

Đường tâm tham khảo (≥24 điểm, nội suy mềm, không tự cắt): (0,53), (5,54), (9,54)[1], (13,51), (15,44), (17,36), (21,33), (24,32)[2], (28,36), (29,44), (29,53), (31,61), (34,65), (36,66)[3], (40,63), (42,57), (42,49), (41,41), (40,35), (43,30), (46,28)[4], (49,31), (52,35), (58,37), (65,39)[5], (69,41), (72,45), (73,51), (72,58), (69,65), (64,71), (57,72)[6], (64,76), (73,78), (81,78)[7], (88,75), (93,69), (95,61), (94,55), (90,49), (88,45)[8], (93,49), (97,53), (100,53). Vào/ra cùng y53%, rộng ≈4% khung. Hiệu chỉnh spline theo tâm đường thực trên backdrop; mốc là đoạn đường sát chân, không cho nhân vật xuyên cửa/tường. Trên cầu, dùng mặt cầu của PNG để tinh chỉnh cao độ.

## 4. Trạng thái & hành vi
Một reference đã duyệt. Luôn hiện đủ 8 kiến trúc; N chuyên đề dùng N mốc đầu, mốc không được gán không tấn công được. Nhấn mốc hợp lệ: chibi chạy dọc đường đến đó; đổi luân phiên 2 ảnh chạy, nhún nhẹ, đi trái lật ngang. Chuẩn hóa chiều cao và bàn chân qua hộp alpha, không stretch ảnh. Sao/tên/số/cờ/sương/quái/mũi tên do code. Không tạo ô trống cho nhãn. Màn kế lật ngang khi có >8 chuyên đề; dùng cùng cao độ/rộng đường tại hai mép, kiểm tra nối cảnh lúc dựng. Không có bảng bên phải, thanh trên cùng dùng UI hiện có. Không tạo reference tải/rỗng riêng vì đơn chỉ yêu cầu cảnh sạch.

## 5. Thứ tự lớp
Nền → đoạn đường sáng/mờ → cầu đá → các kiến trúc khác → nhân vật/quái theo y chân → sương → tên/số/sao → cờ/mũi tên → UI trên cùng. Tám kiến trúc không cần che nhau. Cầu nằm trên đoạn suối/đường nền; nhân vật đi trên mặt cầu. Cây/đá môi trường trong nền; không thêm cây tiền cảnh che đường. Cây/đá nhỏ gắn nền móng trong PNG cùng lớp công trình. Nhãn luôn trên nhân vật và kiến trúc. Không chừa bãi đất nhân tạo dưới tên.

## 6. Danh sách file
reference/reference_luc_dia_dong_gio.png là toàn cảnh duy nhất. 8 PNG decor và backdrop được sinh mới riêng bằng imagegen tích hợp; không crop/resize/xóa nền bằng code. 6 PNG characters là bộ chibi dùng chung đã sinh và kiểm tra ở kit thanh_co. Bộ cờ/sao/sương/quái/mũi tên hiện có không đóng lại. Đã xem từng ảnh mới sinh: đúng loại kiến trúc, không mất chủ thể, cầu không có suối kèm theo, nền không có công trình. Đã kiểm tra 14 PNG rời: bốn góc alpha = 0, có nội dung đặc và vùng sáng đặc; cạnh dài công trình ≥1024 px, nhân vật cao 1536 px. Giữ nguyên kích thước công cụ; không resize/crop bằng code.


| File | Kích thước thực |
|---|---|
| assets/backdrop/backdrop_luc_dia_dong_gio.png | 1672×941 |
| assets/characters/chibi_nam_chay_1.png | 1024×1536 |
| assets/characters/chibi_nam_chay_2.png | 1024×1536 |
| assets/characters/chibi_nam_dung.png | 1024×1536 |
| assets/characters/chibi_nu_chay_1.png | 1024×1536 |
| assets/characters/chibi_nu_chay_2.png | 1024×1536 |
| assets/characters/chibi_nu_dung.png | 1024×1536 |
| assets/decor/decor_01_nha_coi_xay.png | 1295×1214 |
| assets/decor/decor_02_leu_trai.png | 1536×1024 |
| assets/decor/decor_03_thap_gio.png | 1262×1246 |
| assets/decor/decor_04_cau_da.png | 1536×1024 |
| assets/decor/decor_05_den_gio.png | 1346×1168 |
| assets/decor/decor_06_ham_mo.png | 1448×1086 |
| assets/decor/decor_07_phao_dai_da.png | 1536×1024 |
| assets/decor/decor_08_lau_dai_coi_xay.png | 1272×1237 |
| reference/reference_luc_dia_dong_gio.png | 1672×941 |

