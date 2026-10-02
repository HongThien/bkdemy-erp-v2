# hs-luc-dia-and_dao-v4

## 1. Đơn đặt hàng

App HS, vùng 2 `and_dao` (hoa anh đào), iPad ngang 1672×941. Reference cuối được chốt là `reference/reference_luc_dia_and_dao.png`. Cảnh anime fantasy chibi, nắng vàng, góc chéo từ trên cao; đủ 8 công trình theo thứ tự nhà → lều → tháp → cầu → đền → hầm ngục → pháo đài → lâu đài. Đường nối liên tục; các công trình thưa, tên và 5 sao đè trực tiếp lên cảnh, không chừa bãi nhãn riêng. Chỉ giữ một reference. Nền và 8 công trình được sinh riêng bằng công cụ imagegen; không cắt reference. Sáu ảnh nhân vật dùng chung từ kit rừng.

## 2. Font & bảng màu theo biến thể

Baloo 2 cho tên, số và tiến độ; tên màu #362A43, viền sáng #FFF4DD để đọc trên tranh. Sao đạt #FFD25C, sao chưa đạt #9B8D9D. Hoa #F9ABCA, cỏ #91AD48, mái #233B58, torii/cầu #CF3D31, ánh nắng #FFDB91. Nền và công trình chung cho nam/nữ; không đưa chữ vào PNG.

## 3. Bảng kiểm kê

Tọa độ là phần trăm khung, gốc trên trái. Chân là tâm phần nền móng ở đáy công trình; dùng neo giữa–dưới, chỉnh theo bóng mềm của PNG. Cỡ dưới đây đo theo silhouette của reference, không phải kích thước gốc file.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Địa hình, cây, suối, đường | Phủ 100% khung; lớp thấp nhất | BACKDROP | Không | Chung | assets/backdrop/backdrop_luc_dia_and_dao.png | 1672×941; toàn bộ môi trường không tương tác |
| 02 | body | 1 Nhà | Chân ≈(8.5%,42%); rộng ≈14%; bên trái | DECOR | Trạng thái do code | Chung | assets/decor/moc_1.png | Nhà mái hồng và cây hoa gắn liền |
| 03 | body | 2 Lều | Chân ≈(26%,61%); rộng ≈13%; dưới nhà | DECOR | Trạng thái do code | Chung | assets/decor/moc_2.png | Lều hồng, cọc và thùng |
| 04 | body | 3 Tháp canh | Chân ≈(32%,45%); rộng ≈15%; trên lều | DECOR | Trạng thái do code | Chung | assets/decor/moc_3.png | Tháp gỗ, nền đá, hàng rào |
| 05 | body | 4 Cầu đỏ | Chân tâm ≈(47%,47%); rộng ≈10%; phủ mặt đường qua suối | DECOR | Trạng thái do code | Chung | assets/decor/moc_4.png | Giữ thông đường trên mặt cầu |
| 06 | body | 5 Đền torii | Chân ≈(59%,36%); rộng ≈11%; trên đoạn đường giữa | DECOR | Trạng thái do code | Chung | assets/decor/moc_5.png | Cổng, điện nhỏ, đèn đá và bậc thềm |
| 07 | body | 6 Hầm ngục | Chân ≈(69%,67%); rộng ≈19%; dưới đền | DECOR | Trạng thái do code | Chung | assets/decor/moc_6.png | Cây hoa và cửa ngục là một asset |
| 08 | body | 7 Pháo đài | Chân ≈(80%,29%); rộng ≈18%; phía trên bên phải | DECOR | Trạng thái do code | Chung | assets/decor/moc_7.png | Tường trắng, tháp mái xanh |
| 09 | body | 8 Lâu đài | Chân ≈(89%,63%); rộng ≈21%; dưới pháo đài | DECOR | Trạng thái do code | Chung | assets/decor/moc_8.png | Công trình lớn nhất |
| 10 | body | Tên chuyên đề | Neo dưới chân từng mốc; rộng tối đa ≈17%, cao ≈4%; đè cảnh | TEXT | Có | Chung | — | Baloo 2 700, 1–2 dòng, có viền sáng; không làm bãi đất trống |
| 11 | body | Số thứ tự | Gần chân mỗi mốc, cao ≈2.5%; trên công trình | TEXT | Có | Chung | — | Baloo 2 800 |
| 12 | body | Năm sao | Ngay dưới tên; tổng rộng ≈9%, cao ≈2%; đè cảnh | GLYPH | Có | Chung | Bộ sao có sẵn của app | Luôn 5 sao, tô theo tiến độ |
| 13 | body | Cờ hoàn thành | Trên mái/đỉnh mỗi mốc; rộng ≈2.5% | DECOR có sẵn | Có | Chung | Bộ cờ có sẵn của app | Không nằm trong reference |
| 14 | body | Mũi tên học tiếp | Trên mốc đang học, cách đỉnh ≈2%; cao ≈4% | GLYPH có sẵn | Có | Chung | Bộ mũi tên có sẵn của app | Nhấp nhô |
| 15 | body | Sương khóa | Phủ riêng mốc chưa tới, theo silhouette | Hiệu ứng có sẵn | Có | Chung | Bộ sương có sẵn của app | Không vẽ vào nền |
| 16 | body | Quái đang đánh | Sát công trình đang học; cao ≈5–8% theo độ sâu | CHAR có sẵn | Có | Theo dữ liệu | Bộ quái của app | Không sinh thêm trong kit vùng |
| 17 | body | Đường đã đi | Dọc tâm đường, bề rộng khớp nền; dưới nhân vật | SHAPE | Có | Chung | — | Vàng sáng mềm, không che kiến trúc |
| 18 | body | Chibi nam | Neo giữa–dưới trên tâm đường; cao 5%/7%/9% tại y=30%/55%/80% | CHAR | Có | Nam | assets/characters/chibi_nam_dung.png; chibi_nam_chay_1.png; chibi_nam_chay_2.png | Bộ dùng chung kit rừng, nhìn phải |
| 19 | body | Chibi nữ | Cùng neo và cỡ như nam | CHAR | Có | Nữ | assets/characters/chibi_nu_dung.png; chibi_nu_chay_1.png; chibi_nu_chay_2.png | Bộ dùng chung kit rừng, nhìn phải |

Tâm đường theo thứ tự đi, nội suy mềm nhưng không vượt ra ngoài lòng đường: (0,44), (4,44), (8.5,42)[mốc 1], (13,42), (16,45), (18,51), (18,57), (21,62), (26,64)[mốc 2], (30,62), (32,58), (32,52), (33,47)[mốc 3], (36,43), (40,44), (43,45), (47,44)[mốc 4/mặt cầu], (51,43), (54,40), (57,37), (59,36)[mốc 5], (61,39), (62,43), (60,49), (59,54), (61,60), (65,64), (69,67)[mốc 6], (73,65), (75,60), (75,52), (76,43), (78,34), (80,29)[mốc 7], (82,29), (83,33), (83,41), (81,50), (81,56), (84,61), (89,64)[mốc 8], (93,66), (97,65), (100,62).

Reference chốt có điểm vào y≈44%, ra y≈62%, rộng ≈4%. Hai đầu KHÔNG cùng cao; không tự ghép ảnh lật gương như một đoạn nối ngang. Nếu cần màn nối, phải tạo đoạn chuyển tiếp khớp hai cao độ. Giữ nguyên reference đã được người dùng chốt, không tự sửa bố cục nữa.

Tên và sao là lớp phủ; không có vùng nhãn trống bắt buộc. Thanh trên dùng vùng y=0–12%; đáy y=92–100% dành giao diện app. Không có bảng bên phải.

## 4. Trạng thái & hành vi

Luôn hiện cả 8 công trình. Với N<8, chỉ N công trình đầu có chuyên đề; các mốc còn lại hoàn chỉnh nhưng không nhận tương tác. Chạm mốc hợp lệ: nhân vật chạy theo tâm đường đến mốc rồi vào chặng. Không bay ngang qua cảnh. Mốc đã xong có cờ; mốc đang học có mũi tên/quái; mốc chưa tới có sương. Chữ và 5 sao cập nhật bằng code, không đổi nền. Hai frame chạy luân phiên và nhún nhẹ; lật ngang khi chạy về trái. Giữ cùng neo chân giữa các frame, bù khoảng alpha bằng code thay vì crop PNG. Kiểm tra chuyển động hai frame dùng chung khi tích hợp; chúng là biến thể tư thế gần nhau, không phải sprite sheet chuẩn hóa. Khi tải, dùng UI app, không sinh reference khác.

## 5. Thứ tự lớp

Nền → sáng đường → công trình và nhân vật xếp theo y chân → sương/quái → tên, số, sao → cờ/mũi tên → thanh giao diện. Các công trình đứng riêng, không công trình nào buộc che công trình khác. Bậc thềm và hàng rào thuộc asset tương ứng. Cầu đè lên đoạn causeway trong backdrop; nhân vật ở trên mặt cầu. Cây/đá không tương tác đã nằm trong backdrop; không tách thêm PNG. Không đặt nhân vật sau một cây tiền cảnh đã dính nền.

## 6. Danh sách file trong kit

| File | Kích thước | Biến thể |
|---|---|---|
| reference/reference_luc_dia_and_dao.png | 1672×941 | Chung, ảnh cuối |
| assets/backdrop/backdrop_luc_dia_and_dao.png | 1672×941 | Chung |
| assets/decor/moc_1.png | 1402×1122 | Nhà |
| assets/decor/moc_2.png | 1536×1024 | Lều |
| assets/decor/moc_3.png | 1312×1199 | Tháp |
| assets/decor/moc_4.png | 1536×1024 | Cầu |
| assets/decor/moc_5.png | 1429×1100 | Đền |
| assets/decor/moc_6.png | 1536×1024 | Hầm ngục |
| assets/decor/moc_7.png | 1419×1109 | Pháo đài |
| assets/decor/moc_8.png | 1300×1210 | Lâu đài |
| assets/characters/chibi_nam_dung.png | 1024×1536 | Nam đứng |
| assets/characters/chibi_nam_chay_1.png | 1024×1536 | Nam chạy 1 |
| assets/characters/chibi_nam_chay_2.png | 1024×1536 | Nam chạy 2 |
| assets/characters/chibi_nu_dung.png | 1024×1536 | Nữ đứng |
| assets/characters/chibi_nu_chay_1.png | 1024×1536 | Nữ chạy 1 |
| assets/characters/chibi_nu_chay_2.png | 1024×1536 | Nữ chạy 2 |
| DESIGN.md | Văn bản UTF-8 | Hướng dẫn dựng |

Các cutout có alpha thật, góc trong suốt; không chỉnh sửa màu nền bằng script. Nền giữ đường nhưng thay vị trí công trình bằng địa hình tự nhiên. Prompt tạo asset: tái vẽ riêng đúng công trình trong reference, cùng góc/ánh sáng/phong cách, PNG alpha, không scenery, không chữ; nền: bỏ 8 công trình, giữ cảnh và đường. Công cụ: imagegen tích hợp; nhân vật được giữ nguyên từ bộ dùng chung.
