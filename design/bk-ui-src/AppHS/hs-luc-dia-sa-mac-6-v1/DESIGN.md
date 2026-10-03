# hs-luc-dia-sa-mac-6-v1

## 1. Đơn đặt hàng
App HS, màn lục địa sa mạc 6 mốc, iPad ngang 1672×941. Góc nhìn chéo từ trên cao; anime fantasy vẽ tay, công trình chibi nổi bật trên nền cát nhạt. Một đường mòn uốn lượn nối thành nhỏ → tháp phép → trại lều → đền cổ → cổng đá → cầu đá. Reference chuẩn: `reference/reference_default_chibi_v2.png`; `reference/reference_default.png` là bản đầu trước chỉnh, chỉ lưu đối chiếu. Không vẽ chữ, sao, cờ, quái, sương trạng thái hoặc mũi tên vào tranh. Không có biến thể 4/8 mốc trong kit này.

## 2. Font & bảng màu
Nhãn do code đặt bằng Baloo 2, đậm, màu nâu #50372D; sao và mũi tên vàng #FFD24A. Nền cát kem #F9DCA2, đá hồng nhạt #DDA58D; công trình đá ngà #FFF0CC, điểm nhấn xanh ngọc #10BDBD, cam đỏ #D75B32. Ánh sáng từ trên trái; bóng đổ về dưới phải.

## 3. Bảng kiểm kê
Tọa độ dưới đây là **tâm chân công trình**, gốc khung ở góc trên trái, khung chuẩn 1672×941. PNG neo giữa đáy; giữ nguyên tỷ lệ khi đặt. Kích thước và vị trí là xấp xỉ, đối chiếu reference chuẩn khi dựng. Các cây/pha lê/đồ nhỏ sát chân được giữ cùng công trình nếu có trong cutout, không đặt thêm lần nữa. PNG sinh mới có viền alpha rất nhỏ dưới chân: mốc 1/2/3/4/5/6 lần lượt 6/0/10/11/11/9 pixel nguồn (đo với alpha >128). Khi neo chân, dịch đáy khung ảnh xuống thêm phần viền này nhân tỷ lệ scale; không crop asset. Dáng và chi tiết là bản vẽ lại theo reference, không phải layer trích xuất chính xác từng pixel.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset | Ghi chú |
|---|---|---|---|---|---|---|---|---|
| 01 | nền | Địa hình, đường mòn, suối, cây, đá | Toàn khung 100% × 100%, sau mọi mốc | BACKDROP | Không | chung | assets/backdrop/backdrop_luc_dia_sa_mac_6.png | Cùng cảnh chuẩn, sáu vị trí công trình trống; không vẽ lại đường bằng code |
| 02 | body | Thành nhỏ | Chân ≈(14%,84%); rộng ≈23% khung; thứ tự 1; trên nền | DECOR | Không | chung | assets/decor/moc_1.png | Thành đá ngà, tháp lùn, mái cam và vòm xanh ngọc |
| 03 | body | Tháp phép | Chân ≈(19%,33%); rộng ≈19%; thứ tự 2; trên nền | DECOR | Không | chung | assets/decor/moc_2.png | Tháp tròn, mái vòm xanh lớn, chóp vàng |
| 04 | body | Trại lều | Chân ≈(41%,85%); rộng ≈21%; thứ tự 3; trên nền | DECOR | Không | chung | assets/decor/moc_3.png | Lều lớn kem-cam, lều phụ xanh; một nhóm asset |
| 05 | body | Đền cổ | Chân ≈(55%,28%); rộng ≈19%; thứ tự 4; trên nền | DECOR | Không | chung | assets/decor/moc_4.png | Đền đá khối vuông, hai tượng, bậc thềm và pha lê xanh |
| 06 | body | Cổng đá | Chân ≈(82%,85%); rộng ≈22%; thứ tự 5; trên nền | DECOR | Không | chung | assets/decor/moc_5.png | Cổng vòm, tinh thể xanh, bệ tròn phép và bậc đá |
| 07 | body | Cầu đá | Chân ≈(88%,34%); rộng ≈20%; thứ tự 6; trên nền | DECOR | Không | chung | assets/decor/moc_6.png | Cầu một vòm, hai trụ mái xanh; không kèm mảng nước lớn |
| 08 | body | Tên chuyên đề | Giữa dưới chân mỗi mốc khoảng 1% chiều cao; rộng bằng mốc; trên nền | TEXT | Có | chung | — | Baloo 2 đậm, cỡ vừa; dữ liệu cung cấp |
| 09 | body | 5 sao | Giữa dưới nhãn; hàng rộng ≈7% khung; trên nền | GLYPH | Có | chung | — | Code dựng 5 sao theo tiến độ, không nằm trong ảnh |
| 10 | body | Cờ hoàn thành | Trên mái mốc hoàn thành; rộng ≈2% khung; trên công trình | GLYPH | Có | chung | — | Code đặt theo trạng thái |
| 11 | body | Quái nhỏ | Gần chân mốc đang đánh; rộng ≈4% khung; trước công trình | CHAR | Có | chung | — | Dùng nhân vật từ hệ quái của app; không thuộc bộ ảnh trạng thái thường này |
| 12 | body | Sương khóa | Phủ vùng mốc chưa tới; rộng ≈24% khung; trên công trình | SHAPE | Có | chung | — | Code tạo lớp sương mờ theo trạng thái, không phủ sẵn nền |
| 13 | body | Mũi tên vàng | Giữa trên mái mốc đang học; rộng ≈3% khung; lớp trên cùng | GLYPH | Có | chung | — | Code dựng, nhấp nhô nhẹ; chừa khoảng trên mái |

## 4. Trạng thái & hành vi
Reference chuẩn là trạng thái thường, cả sáu công trình hiện, không có lớp trạng thái hoặc nhãn. Nhãn và sao luôn được code đặt từ dữ liệu. Đã xong hiện cờ; đang đánh hiện quái nhỏ; chưa tới hiện sương; đang học hiện mũi tên. Nhấn mốc mở chuyên đề; co nhẹ quanh neo chân để không trượt vị trí. Không thêm trạng thái tải/rỗng hoặc ảnh biến thể ngoài đơn. Không kéo giãn khung: scale đồng nhất toàn cảnh và mọi tọa độ, dùng contain khi tỷ lệ thiết bị khác.

## 5. Thứ tự lớp
Backdrop có đường mòn → sáu PNG công trình → tên chuyên đề và sao → quái/cờ → sương khóa → mũi tên mốc đang học. Các vật trang trí thuộc nền đã nằm trong backdrop, không sinh riêng. Bóng tiếp xúc nhỏ thuộc PNG công trình; không thêm bóng lớn trùng lặp.

## 6. Danh sách file trong kit
- `reference/reference_default_chibi_v2.png`: reference chuẩn 1672×941, trạng thái thường.
- `reference/reference_default.png`: reference trước chỉnh 1672×941, chỉ đối chiếu, không dùng dựng.
- `assets/backdrop/backdrop_luc_dia_sa_mac_6.png`: nền PNG 1672×941, không công trình.
- `assets/decor/moc_1.png`: thành nhỏ, PNG alpha 1464×1074.
- `assets/decor/moc_2.png`: tháp phép, PNG alpha 1321×1191.
- `assets/decor/moc_3.png`: trại lều, PNG alpha 1536×1024.
- `assets/decor/moc_4.png`: đền cổ, PNG alpha 1536×1024.
- `assets/decor/moc_5.png`: cổng đá, PNG alpha 1448×1086.
- `assets/decor/moc_6.png`: cầu đá, PNG alpha 1671×941.
- Sáu công trình được sinh từng cái bằng imagegen tích hợp, không crop reference. Prompt chung: vẽ lại đúng loại công trình và dáng chibi theo reference, cùng góc nhìn chéo và ánh sáng trên trái, PNG alpha, loại bỏ cảnh nền/chữ/trạng thái; backdrop giữ địa hình và đường, thay công trình bằng bãi trống.
- `DESIGN.md`: thông số bố cục và cách dựng.
