# hs-luc-dia-thanh_co-v1

## 1. Đơn đặt hàng
App hs · màn luc-dia-thanh_co · vùng 3 thành cổ · v1. Game học Toán trên iPad ngang, khung thiết kế 1672×941. Reference cuối đã được duyệt; chỉ giữ một reference. Anime fantasy chibi vẽ tay, ánh vàng, góc chéo từ trên cao. Một đường liên tục đi qua 8 kiến trúc theo thứ tự. Các kiến trúc hoàn chỉnh, không có chữ, số, sao, nhân vật hay trạng thái trong reference. Theo chỉnh sửa cuối: không chừa ô cỏ cho nhãn; tên và 5 sao được code đè lên cảnh. Giãn công trình, cho phép tiến gần viền trên/dưới hơn yêu cầu ban đầu. Asset được sinh riêng từng lần, không cắt từ reference.

## 2. Font & bảng màu
Baloo 2 cho tên, số, trạng thái; Pacifico chỉ khi cần chữ viết tay. Bảng màu chung nam/nữ: đá kem #E5D2A3, mái xanh #3F628A, ngói cam #C97932, cỏ #809C34, đường #E9BF78, ánh vàng #FFD47C, chữ #3D2C1C. Chữ dùng viền kem hoặc bóng tối để đọc trên nền. Không đưa chữ vào PNG.

## 3. Bảng kiểm kê
Tọa độ phần trăm theo khung thiết kế; chân là giữa bậc/chân công trình. Điểm neo chính xác của PNG nằm ở giữa đáy hộp bao chủ thể; bỏ qua lề alpha khi tính neo.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Địa hình và đường | Phủ 100% khung, sau mọi lớp | BACKDROP | không | chung | assets/backdrop/backdrop_luc_dia_thanh_co.png | Cỏ, cây, đá, nước và đường; không có 8 kiến trúc |
| 02 | body | 1 — Nhà đá cổ | Chân ≈(10.5%,52%), rộng ≈8%; trước nền | DECOR | tương tác | chung | assets/decor/moc_1.png | Nhà ngói cam, điểm đầu |
| 03 | body | 2 — Lều lính | Chân ≈(23.5%,33.5%), rộng ≈12%; trước nền | DECOR | tương tác | chung | assets/decor/moc_2.png | Lều kem viền đỏ, thùng và hàng rào gần chân |
| 04 | body | 3 — Tháp canh | Chân ≈(36%,63%), rộng ≈7%; trước nền | DECOR | tương tác | chung | assets/decor/moc_3.png | Tháp đá mái xanh |
| 05 | body | 4 — Cổng vòm đá | Chân ≈(46%,39%), rộng ≈8%; trước nền | DECOR | tương tác | chung | assets/decor/moc_4.png | Cổng đá độc lập |
| 06 | body | 5 — Đền cột đá | Chân ≈(63%,38%), rộng ≈10%; trước nền | DECOR | tương tác | chung | assets/decor/moc_5.png | Mái vòm xanh, cột đá kem |
| 07 | body | 6 — Hầm ngầm | Chân ≈(60%,69%), rộng ≈14%; trước nền | DECOR | tương tác | chung | assets/decor/moc_6.png | Cửa đá trong khối đá, 2 đuốc |
| 08 | body | 7 — Tường thành | Chân ≈(82%,73%), rộng ≈16%; trước nền | DECOR | tương tác | chung | assets/decor/moc_7.png | Hai tháp mái xanh, cổng và tường |
| 09 | body | 8 — Lâu đài cổ kính | Chân ≈(88%,44%), rộng ≈18%; trước nền | DECOR | tương tác | chung | assets/decor/moc_8.png | Lớn nhất, nhiều tháp mái xanh |
| 10 | body | Tên chuyên đề | Đè lên cảnh, ngay dưới mỗi chân; rộng ≈12–15%, cao ≈3%; lớp trên kiến trúc | TEXT | có | chung | — | Baloo 2 đậm, tên theo dữ liệu, không chừa bãi cỏ |
| 11 | body | 5 sao tiến độ | Ngay dưới tên, rộng ≈8–10%, cao ≈2.5%; lớp trên cảnh | GLYPH | có | chung | bộ sao hiện có | Luôn 5 sao, màu/độ đầy theo tiến độ; không sinh lại |
| 12 | body | Số thứ tự | Gắn cạnh nhãn từng công trình, cao ≈2.5% | TEXT | có | chung | — | Baloo 2, 1–8; không nằm trong PNG |
| 13 | body | Cờ hoàn thành | Trên công trình đã xong, rộng ≈3–4%; lớp nổi | ILLUST | có | chung | bộ cờ hiện có | Không vẽ cờ cố định vào kiến trúc |
| 14 | body | Mũi tên đang học | Trên đỉnh công trình, cao ≈4–5%; lớp nổi | GLYPH | có | chung | bộ mũi tên hiện có | Vàng, nhấp nhô |
| 15 | body | Sương khóa | Đè lên công trình chưa tới, theo hộp công trình | ILLUST | có | chung | bộ sương hiện có | Không nằm trong nền/reference |
| 16 | body | Quái đang đánh | Sát công trình hoạt động, cao ≈5–7%, neo đáy | CHAR | có | chung | bộ quái hiện có | Không có trong reference sạch |
| 17 | body | Đường đã/chưa đi | Bám đường trong nền, rộng theo đường; dưới nhân vật | SHAPE | có | chung | — | Code tô vàng phần đã đi, giảm sáng phần chưa đi |
| 18 | body | Nhân vật nam | Neo bàn chân trên tâm đường; cao 5% tại y30, 7% tại y55, 9% tại y80 | CHAR | có | nam | assets/characters/chibi_nam_dung.png; chibi_nam_chay_1.png; chibi_nam_chay_2.png | Đứng, chạy chân trái trước, chạy chân phải trước; nhìn phải |
| 19 | body | Nhân vật nữ | Neo và cỡ như nam; trước/sau công trình theo độ sâu | CHAR | có | nữ | assets/characters/chibi_nu_dung.png; chibi_nu_chay_1.png; chibi_nu_chay_2.png | Cùng nhân vật/trang phục trong cả 3 tư thế |

Đường tâm tham khảo, ≥24 điểm từ trái sang phải, nội suy spline không tự cắt:
(0,53), (5,54), (10.5,55)[1], (14,52), (16,45), (18,38), (21,34), (23.5,34)[2], (27,38), (28,46), (28,55), (30,61), (33,65), (36,65)[3], (39,63), (41,57), (42,49), (44,43), (46,39)[4], (50,37), (55,37), (60,38), (63,39)[5], (67,40), (70,44), (70,51), (69,58), (67,65), (64,69), (60,71)[6], (64,73), (71,74), (77,75), (82,75)[7], (88,73), (92,68), (94,61), (94,55), (91,49), (88,44)[8], (91,46), (95,51), (100,53). Vào/ra cùng y53%, rộng ≈4% khung. Các mốc chỉ là điểm sát bậc/chân; không cho nhân vật chạy xuyên công trình. Khi dựng, hiệu chỉnh spline theo tâm đường thực trên backdrop; không đổi thứ tự mốc.

## 4. Trạng thái & hành vi
Reference là cảnh sạch duy nhất. Gán N chuyên đề vào N công trình đầu; công trình chưa được gán vẫn hiện hoàn chỉnh và không tấn công được. Nhấn công trình hợp lệ: nhân vật chạy theo tâm đường đến mốc rồi vào chặng. Luân phiên hai ảnh chạy, nhún nhẹ; đi trái thì lật ngang. Giữ chiều cao hiển thị và neo chân thống nhất giữa ảnh đứng/chạy; tính hộp alpha thay vì toàn canvas. Hơn 8 chuyên đề: màn kế dùng nền lật ngang, đảo thứ tự tọa độ phù hợp. Không có bảng bên phải. Thanh trên cùng dùng UI hiện có; nhãn có thể đè lên cảnh theo quyết định cuối, không tạo bãi cỏ riêng. Trạng thái cờ/sương/quái/mũi tên do code và bộ dùng chung quản lý. Không có trạng thái tải/rỗng riêng trong tranh.

## 5. Thứ tự lớp
Nền → đoạn đường sáng/mờ → kiến trúc → nhân vật/quái theo độ sâu chân → sương → tên/số/sao → cờ/mũi tên → UI trên cùng. Tám kiến trúc không cần che nhau. Cây/đá môi trường là một phần nền; đường phải luôn nhìn thấy, nhân vật đi trên lớp nền. Khối đá và cây nhỏ sát nền móng đã nằm trong PNG kiến trúc thì cùng lớp công trình. Không thêm cây tiền cảnh che đường. Khi nhân vật đi sát kiến trúc, so y chân để xếp trước/sau; nhãn luôn trên cả hai.

## 6. Danh sách file trong kit
Một reference: reference/reference_luc_dia_thanh_co.png (1671×941 thực tế; khung thiết kế 1672×941, chênh 1 px chiều ngang do đầu ra công cụ). Tất cả PNG được giữ nguyên đầu ra, không crop/resize/xóa nền bằng code.

Assets: assets/backdrop/backdrop_luc_dia_thanh_co.png; assets/decor/moc_1.png … moc_8.png; assets/characters/chibi_nam_dung.png, chibi_nam_chay_1.png, chibi_nam_chay_2.png, chibi_nu_dung.png, chibi_nu_chay_1.png, chibi_nu_chay_2.png. Đã kiểm tra 14 PNG rời: bốn góc alpha = 0, có nội dung đặc và vùng sáng đặc; công trình có cạnh dài ≥1024 px, nhân vật cao 1536 px. Đã xem từng ảnh; các ảnh chạy 1/2 có dáng chân khác nhau. Không giao bộ dùng chung cờ, sương, sao, quái, mũi tên.


| File | Kích thước thực | Biến thể |
|---|---|---|
| assets/backdrop/backdrop_luc_dia_thanh_co.png | 1672×941 | chung |
| assets/characters/chibi_nam_chay_1.png | 1024×1536 | nam |
| assets/characters/chibi_nam_chay_2.png | 1024×1536 | nam |
| assets/characters/chibi_nam_dung.png | 1024×1536 | nam |
| assets/characters/chibi_nu_chay_1.png | 1024×1536 | nữ |
| assets/characters/chibi_nu_chay_2.png | 1024×1536 | nữ |
| assets/characters/chibi_nu_dung.png | 1024×1536 | nữ |
| assets/decor/moc_1.png | 1313×1198 | chung |
| assets/decor/moc_2.png | 1536×1024 | chung |
| assets/decor/moc_3.png | 1270×1239 | chung |
| assets/decor/moc_4.png | 1448×1086 | chung |
| assets/decor/moc_5.png | 1341×1173 | chung |
| assets/decor/moc_6.png | 1536×1024 | chung |
| assets/decor/moc_7.png | 1536×1024 | chung |
| assets/decor/moc_8.png | 1272×1237 | chung |
| reference/reference_luc_dia_thanh_co.png | 1671×941 | chung |

Prompt dùng công cụ imagegen tích hợp: từng kiến trúc được sinh mới riêng với reference làm hướng dẫn kiểu dáng/góc nhìn/ánh sáng, nền alpha thật; nền được chỉnh từ reference chỉ xóa kiến trúc và giữ đường; nhân vật đứng làm reference nhận dạng cho hai tư thế chạy. Không dùng crop, resize hay xử lý xóa nền bằng code.

