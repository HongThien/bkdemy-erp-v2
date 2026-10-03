# hs-luc-dia-nui_lua-v1

## 1. Đơn đặt hàng
App hs · màn luc-dia-nui_lua · vùng Núi lửa · iPad ngang 1672×941 · v1. Toàn cảnh mới đã được duyệt, style **chibi adventure fantasy**: công trình tròn, hoàn chỉnh, thưa; đá tím than, mái đỏ, dung nham cam; đường đá sáng nối liền qua đủ 8 mốc. Không có ô cỏ chừa tên; code đè tên và 5 sao lên cảnh. Sinh từng công trình riêng bằng imagegen, không cắt từ toàn cảnh. Tên file mô tả nội dung, số 01–08 là thứ tự trên đường. Cửa mốc 6 giữ đúng khối núi lửa có cửa và ray như ảnh duyệt.

## 2. Font & bảng màu
Baloo 2 cho tên chuyên đề, số, trạng thái; Pacifico chỉ khi có chữ viết tay. Chung nam/nữ: đá #50495D, nền đất #81717F, mái đỏ #B9493E, dung nham #FF803B, đường #D7C3A5, thực vật #527E7C, chữ kem #FFF0D4. Ánh cam chỉ quanh dung nham/đèn; không phủ màu vàng toàn màn. Chữ có viền/bóng tối để đọc trên cảnh, không xuất chữ thành PNG.

## 3. Bảng kiểm kê
Tọa độ ≈% theo khung, gốc trên trái. Chân = giữa bậc/điểm tiếp đất; neo qua hộp alpha của chủ thể, bỏ qua lề trong suốt.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Địa hình và đường | Toàn khung, sau mọi lớp | BACKDROP | không | chung | assets/backdrop/backdrop_luc_dia_nui_lua.png | Đá, dung nham, tinh thể, cây, đường; không có 8 kiến trúc |
| 02 | body | 1 Nhà đá đen | Chân ≈(9%,51%), rộng ≈10%; trên nền | DECOR | nhấn | chung | assets/decor/decor_01_nha_da_den.png | Nhà nhỏ mái ngói đỏ |
| 03 | body | 2 Lều da | Chân ≈(24%,30%), rộng ≈14%; trên nền | DECOR | nhấn | chung | assets/decor/decor_02_leu_da.png | Da/vải kem, viền cam; thùng và hàng rào gần chân |
| 04 | body | 3 Tháp dung nham | Chân ≈(36%,64%), rộng ≈8%; trên nền | DECOR | nhấn | chung | assets/decor/decor_03_thap_dung_nham.png | Tháp đá tròn, mái đỏ |
| 05 | body | 4 Cầu đá qua dung nham | Tâm mặt cầu ≈(46%,29%), rộng ≈13%; đè đường/nhánh dung nham nền | DECOR | nhấn | chung | assets/decor/decor_04_cau_da_dung_nham.png | Cầu riêng, không kèm dòng dung nham |
| 06 | body | 5 Đền lửa | Chân ≈(65%,37%), rộng ≈12%; trên nền | DECOR | nhấn | chung | assets/decor/decor_05_den_lua.png | Mái vòm đỏ, cột, tinh thể lửa |
| 07 | body | 6 Cửa miệng núi lửa | Chân ≈(57%,71%), rộng ≈16%; trên nền | DECOR | nhấn | chung | assets/decor/decor_06_cua_mieng_nui_lua.png | Khối núi lửa + cửa, đèn, ray ngắn, thùng |
| 08 | body | 7 Pháo đài đá đen | Chân ≈(81%,75%), rộng ≈18%; trên nền | DECOR | nhấn | chung | assets/decor/decor_07_phao_dai_da_den.png | Hai tháp mái đỏ, tường và cổng |
| 09 | body | 8 Lâu đài dung nham | Chân ≈(88%,44%), rộng ≈20%; trên nền | DECOR | nhấn | chung | assets/decor/decor_08_lau_dai_dung_nham.png | Lớn nhất, nhiều tháp, tinh thể lửa |
| 10 | body | Tên chuyên đề | Dưới chân từng mốc, đè cảnh; rộng ≈12–16%, cao ≈3%; trên công trình | TEXT | có | chung | — | Baloo 2 đậm, có viền/bóng |
| 11 | body | 5 sao | Dưới tên, rộng ≈8–10%, cao ≈2.5%; lớp nổi | GLYPH | có | chung | bộ sao dùng chung | Đổi màu/độ đầy theo dữ liệu |
| 12 | body | Số thứ tự | Cạnh tên, cao ≈2.5% | TEXT | có | chung | — | 1–8 do code |
| 13 | body | Cờ hoàn thành | Trên mốc xong, rộng ≈3–4%; lớp nổi | ILLUST | có | chung | bộ cờ dùng chung | Cờ nhỏ sinh thừa trên lều reference không tái tạo trong PNG rời |
| 14 | body | Mũi tên | Trên mốc đang học, cao ≈4%; lớp nổi | GLYPH | có | chung | bộ mũi tên dùng chung | Vàng, nhấp nhô |
| 15 | body | Sương | Theo hộp công trình khóa, trên công trình | ILLUST | có | chung | bộ sương dùng chung | Không vẽ vào nền |
| 16 | body | Quái | Sát mốc đang đánh, cao ≈5–7%, neo chân | CHAR | có | chung | bộ quái dùng chung | Không có trong reference sạch |
| 17 | body | Đường tiến độ | Theo tâm đường, dưới nhân vật | SHAPE | có | chung | — | Đã đi sáng vàng, chưa đi mờ |
| 18 | body | Chibi nam | Neo bàn chân trên đường; cao 5% tại y30, 7% tại y55, 9% tại y80 | CHAR | có | nam | assets/characters/chibi_nam_dung.png; chibi_nam_chay_1.png; chibi_nam_chay_2.png | Bộ nhân vật dùng chung từ kit thanh_co |
| 19 | body | Chibi nữ | Neo/cỡ như nam, lớp theo y chân | CHAR | có | nữ | assets/characters/chibi_nu_dung.png; chibi_nu_chay_1.png; chibi_nu_chay_2.png | Nhận dạng/trang phục không đổi theo khí hậu |

Đường tâm tham khảo ≥24 điểm: (0,51), (5,53), (9,53)[1], (13,51), (15,44), (17,36), (21,33), (24,32)[2], (28,36), (29,44), (29,53), (31,61), (34,65), (36,66)[3], (40,63), (42,57), (42,49), (41,41), (40,35), (43,30), (46,28)[4], (49,31), (52,35), (58,38), (65,39)[5], (69,41), (72,45), (73,51), (72,58), (69,65), (64,71), (57,72)[6], (64,76), (73,78), (81,78)[7], (88,75), (93,69), (95,61), (94,55), (90,49), (88,45)[8], (93,48), (97,50), (100,51). Vào/ra cùng y51%, rộng ≈4% khung. Nội suy mềm không tự cắt, hiệu chỉnh theo tâm đường thật trên backdrop. Mốc là đường sát bậc/chân, không xuyên cửa/tường. Trên cầu, dùng cao độ mặt cầu PNG.

## 4. Trạng thái & hành vi
Luôn đủ 8 kiến trúc hoàn chỉnh. N chuyên đề dùng N mốc đầu; mốc chưa gán không tấn công được. Nhấn hợp lệ: nhân vật chạy theo đường tới mốc rồi vào chặng. Luân phiên hai ảnh chạy và nhún; chạy trái lật ngang. Chuẩn hóa chiều cao và neo bàn chân bằng hộp alpha. Tên/sao/số/cờ/sương/quái/mũi tên do code; không tạo bãi đất trống cho nhãn. >8 chuyên đề: màn tiếp lật ngang, kiểm tra nối hai mép và đảo tọa độ tương ứng. Không bảng bên phải, thanh trên cùng dùng UI hiện có. Không có reference tải/rỗng riêng trong đơn.

## 5. Thứ tự lớp
Nền → đoạn đường sáng/mờ → cầu → kiến trúc còn lại → nhân vật/quái theo y chân → sương → tên/số/sao → cờ/mũi tên → UI. Tám kiến trúc không che nhau. Cầu trên nhánh dung nham, nhân vật đi trên mặt cầu. Cây/đá môi trường thuộc nền; không thêm cây tiền cảnh che đường. Đá/đèn/cây nhỏ sát móng trong PNG cùng lớp kiến trúc. Nhãn luôn ở trên cảnh/nhân vật. Đỉnh núi lửa mốc 6 thuộc PNG rời, không vẽ lặp trong backdrop.

## 6. Danh sách file
Một reference: reference/reference_luc_dia_nui_lua.png. 8 decor và 1 backdrop sinh mới riêng bằng imagegen tích hợp, không crop/resize/xóa nền bằng code. 6 chibi là bộ dùng chung đã sinh và kiểm tra trong kit thanh_co. Bộ trạng thái hiện có không đóng lại. Đã xem từng ảnh mới sinh: đủ kiến trúc, cầu không kèm dòng dung nham, nền không còn kiến trúc/thùng/khối núi lửa của mốc 6. Đã kiểm tra 14 PNG rời: bốn góc alpha = 0, có chủ thể đặc và vùng sáng đặc; cạnh dài công trình ≥1024 px, nhân vật cao 1536 px. Không thay đổi ảnh bằng code.


| File | Kích thước thực |
|---|---|
| assets/backdrop/backdrop_luc_dia_nui_lua.png | 1672×941 |
| assets/characters/chibi_nam_chay_1.png | 1024×1536 |
| assets/characters/chibi_nam_chay_2.png | 1024×1536 |
| assets/characters/chibi_nam_dung.png | 1024×1536 |
| assets/characters/chibi_nu_chay_1.png | 1024×1536 |
| assets/characters/chibi_nu_chay_2.png | 1024×1536 |
| assets/characters/chibi_nu_dung.png | 1024×1536 |
| assets/decor/decor_01_nha_da_den.png | 1402×1122 |
| assets/decor/decor_02_leu_da.png | 1536×1024 |
| assets/decor/decor_03_thap_dung_nham.png | 1295×1214 |
| assets/decor/decor_04_cau_da_dung_nham.png | 1619×971 |
| assets/decor/decor_05_den_lua.png | 1376×1143 |
| assets/decor/decor_06_cua_mieng_nui_lua.png | 1448×1086 |
| assets/decor/decor_07_phao_dai_da_den.png | 1536×1024 |
| assets/decor/decor_08_lau_dai_dung_nham.png | 1330×1183 |
| reference/reference_luc_dia_nui_lua.png | 1672×941 |

