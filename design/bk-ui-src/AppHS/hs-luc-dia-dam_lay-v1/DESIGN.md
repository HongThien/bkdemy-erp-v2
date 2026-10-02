# hs-luc-dia-dam_lay-v1

## 1. Đơn đặt hàng

App HS, màn lục địa đầm lầy, iPad ngang 1672 × 941. Công trình chibi nhìn chéo từ trên cao, ánh hoàng hôn vàng, nước xanh ngọc và bóng tím. Các địa điểm cách xa, trải cả trên và dưới; đường uốn bất quy tắc. Phạm vi lần giao này: các thành phần đã nhìn thấy trong toàn cảnh, gồm 8 công trình và nền. Chưa có bộ nhân vật trong lần giao này.

## 2. Font & bảng màu theo biến thể

Tên chuyên đề và số thứ tự dùng TEXT Baloo 2 do code dựng, không nằm trong PNG. Bảng màu chung: xanh rêu, nước xanh ngọc, gỗ nâu, đèn vàng hổ phách, mái cam; lâu đài mái tím mận. Giữ màu và tỉ lệ gốc của ảnh.

## 3. Bảng kiểm kê

Tọa độ dưới đây đo xấp xỉ từ toàn cảnh, theo phần trăm khung. Chân là giữa vùng tiếp đất của chủ thể, không phải mép hộp PNG. Bề rộng tính theo công trình nhìn thấy, bỏ qua lề alpha. Các asset được sinh mới từng ảnh, không cắt từ reference; chi tiết nhỏ có thể khác toàn cảnh.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Đầm lầy và đường | Phủ 100% khung; dưới mọi công trình | BACKDROP | Không | Chung | assets/backdrop/backdrop_luc_dia_dam_lay.png | Cây, đá, nước, hoa và bãi đất đã nằm trong nền |
| 02 | body | 1 — Nhà sàn | Chân ≈(11,38); rộng ≈11%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_01_nha_san.png | Mái lá xanh, đèn vàng, thang bên phải |
| 03 | body | 2 — Lều da | Chân ≈(21,72); rộng ≈14%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_02_leu_da.png | Da be, mái hiên cam, hàng rào gỗ |
| 04 | body | 3 — Tháp canh | Chân ≈(35,40); rộng ≈10%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_03_thap_canh.png | Gỗ, mái cam, bậc thang và cọc nhọn |
| 05 | body | 4 — Cầu ván | Tâm mặt cầu ≈(48,59); rộng ≈15%; trên đường và nước | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_04_cau_van.png | Hai đầu mặt cầu là neo nối đường; không neo đáy chân trụ |
| 06 | body | 5 — Đền rêu | Chân ≈(58,34); rộng ≈14%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_05_den_reu.png | Mái vòm đá, rêu và đèn vàng |
| 07 | body | 6 — Hang bùn | Chân ≈(69,81); rộng ≈19%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_06_hang_bun.png | Gò đá rêu, cửa hang, đuốc, rào gỗ |
| 08 | body | 7 — Pháo đài gỗ | Chân ≈(83,61); rộng ≈17%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_07_phao_dai_go.png | Tường đá gia cố gỗ, hai tháp mái cam |
| 09 | body | 8 — Lâu đài đom đóm | Chân ≈(90,35); rộng ≈17%; trên nền | DECOR | Bấm chuyên đề | Chung | assets/decor/decor_08_lau_dai_dom_dom.png | Tháp mái tím, cửa sáng và cây nhỏ sát chân |

## 4. Trạng thái & hành vi

Reference sạch, không có nhân vật, quái, chữ, số, sao, cờ hoặc mũi tên. Code thêm các trạng thái sau. Luôn giữ đủ 8 công trình hoàn chỉnh; điểm chưa có chuyên đề tắt tương tác. Tên và 5 sao đặt dưới từng công trình, tránh đè đường; cần kiểm tra khoảng trống khi dựng màn. Không xuất chữ thành ảnh.

Nền sinh lại giữ bố cục gần reference; đường gần pháo đài còn có lối nối tạo cảm giác phân nhánh. Mép vào/ra chưa cùng độ cao. Chưa xác nhận khả năng lật gương nối màn, vùng an toàn phía trên của lâu đài hoặc spline di chuyển 1→8. Không coi file này là bộ hành vi đã kiểm chứng.

## 5. Thứ tự lớp

Nền → cầu → công trình sắp theo độ sâu chân → nhân vật và trạng thái động → tên/sao → thanh giao diện. Tám công trình không đè nhau ở bố cục hiện tại. Cây, đá tiền cảnh nằm trong nền phẳng; muốn chúng che nhân vật cần lớp che riêng khi tích hợp.

## 6. Danh sách file trong kit

`reference/reference_luc_dia_dam_lay.png`: 1672 × 941, RGB, toàn cảnh gốc.

`assets/backdrop/backdrop_luc_dia_dam_lay.png`: 1672 × 941, nền đã chỉnh theo phản hồi: màu dịu, giảm cây cối/hoa/lá và chi tiết nhỏ, bãi đặt công trình thoáng hơn cho tên dạng Toán. Giữ bố cục đường và vị trí bãi của nền trước. Reference toàn cảnh vẫn là bản màu cũ; khi dựng dùng nền mới này.

Tám file `assets/decor/` trong bảng trên: PNG RGBA, cạnh dài ít nhất 1024px, nền trong suốt, một công trình mỗi file. Đã chỉnh riêng từng ảnh bằng imagegen theo phản hồi mới: chibi hơn, khối tròn và mập hơn, giảm chi tiết nhỏ và ánh vàng chói; dùng nền dịu mới làm tham chiếu màu và cách tô. Giữ loại công trình, hướng nhìn và tên file. Reference toàn cảnh vẫn mô tả bản kiến trúc cũ; dùng các asset hiện tại khi dựng.
