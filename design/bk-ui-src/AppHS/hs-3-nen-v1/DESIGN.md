# hs-3-nen-v1
## 1. Đơn đặt hàng
App hs; nền cho bang-xep-hang, nhiem-vu, thanh-tuu. Bầu trời đêm chibi tối giản, yên tĩnh và ấm. Sáu nền đặc: ngang 1672×941, dọc 941×1672, JPEG chất lượng 92, mỗi file ≤450KB. Không chữ, thẻ, nhân vật, công trình lớn hoặc biểu tượng game. Theo yêu cầu trực tiếp, kích thước/JPG/tên nen_* thay quy định PNG/backdrop_* của kit chung. Bản màu được duyệt trong chat trước khi xuất.
## 2. Font & bảng màu
Ba mã chủ đạo: navy **#081225**, vàng ấm **#F2DE9A**, xanh ngọc nhạt **#789F9A**. Chàm **#191B3D** là sắc độ chân trời thuộc cùng họ navy/chàm. Đây là màu định hướng, ảnh raster có sắc độ chuyển mịn; xanh ngọc chỉ ở mép mây. Không hồng, cam, đỏ.
Font UI: Baloo 2, chữ trắng #FFFFFF. Nền không chứa chữ. Ảnh kiểm tra dùng Arial 14px hỗ trợ tiếng Việt, thẻ navy #081225 opacity 45%, chỉ minh họa khả năng đọc; ứng dụng dựng chữ/thẻ bằng code.

## 3. Bảng kiểm kê
Mỗi nền là một BACKDROP hoàn chỉnh; sao, mây, ánh sáng và bóng cờ là không khí đã gộp trong file, không cần asset rời. Tất cả tĩnh, không tương tác.

| id | Vùng | Phần tử | Vị trí & cỡ | Loại | Động? | Biến thể | File asset |
|---|---|---|---|---|---|---|---|
| 01 | nền | Bảng xếp hạng ngang | Phủ 100% màn ngang, sau toàn bộ UI; halo ≈(96%,5%); sao mép trên/hai rìa; mây đáy ≈88–97%; bóng cờ góc trái dưới ≈(8%,88%) | BACKDROP | không | ngang | assets/backdrop/nen_bxh_ngang.jpg |
| 02 | nền | Bảng xếp hạng dọc | Phủ 100% màn dọc, sau UI; halo ≈(94%,3%); sao rìa trên; mây ≈91–97%; bóng cờ ≈(12%,92%) | BACKDROP | không | dọc | assets/backdrop/nen_bxh_doc.jpg |
| 03 | nền | Nhiệm vụ ngang | Phủ màn ngang, sau UI; ánh vàng ≈(5%,89%), tỏa mềm ở góc; mây đáy ≈85–95%, sao trên/hai rìa | BACKDROP | không | ngang | assets/backdrop/nen_nhiem_vu_ngang.jpg |
| 04 | nền | Nhiệm vụ dọc | Phủ màn dọc, sau UI; ánh vàng ≈(10%,94%); mây ≈91–97%; sao ở trên/hai rìa | BACKDROP | không | dọc | assets/backdrop/nen_nhiem_vu_doc.jpg |
| 05 | nền | Thành tựu ngang | Phủ màn ngang, sau UI; sao băng ≈x72–92%, y1–7%; đốm sáng ở hai mép ≈2–5%/95–99%; mây ≈86–95% | BACKDROP | không | ngang | assets/backdrop/nen_thanh_tuu_ngang.jpg |
| 06 | nền | Thành tựu dọc | Phủ màn dọc, sau UI; sao băng ≈x74–91%, y2–8%; đốm sáng sát hai mép; mây ≈92–97% | BACKDROP | không | dọc | assets/backdrop/nen_thanh_tuu_doc.jpg |
| 07 | body | Thẻ kiểm tra | Chỉ ảnh kiểm tra: x25%, y42%, rộng 50%, cao 110px; trên nền | SHAPE | không | 6 ảnh kiểm tra | — |
| 08 | body | Hai dòng chữ kiểm tra | Trong thẻ, lề trái 24px; Arial 14px trắng, trên thẻ; không thuộc asset | TEXT | không | 6 ảnh kiểm tra | — |

## 4. Trạng thái & hành vi
Chỉ có nền tĩnh; dữ liệu, loading, rỗng, disabled của ba màn do UI hiện hành xử lý. Dùng bản ngang cho iPad/PC, bản dọc cho điện thoại; không cắt bản ngang thành bản dọc. Khi tỷ lệ thiết bị khác, tránh crop điểm nhấn; giữ UI trong vùng tối.
Vùng đo thống nhất: x10–90%, y12–85% (80% bề ngang; 73% bề cao, diện tích 58,4%). Yêu cầu “≈80% giữa khung” được hiểu là vùng nội dung rộng ở giữa, không cam kết 80% diện tích hình. Trang trí còn xuất hiện ở hai mép ngoài vùng này.
Đo trên JPG cuối: độ sáng B là luma sRGB 0.2126R+0.7152G+0.0722B chia 255; L là relative luminance tuyến tính WCAG. Tương phản trắng tối thiểu =1.05/(L lớn nhất+0.05), xét mọi pixel trong vùng đo. Thẻ = navy 45% trên nền 55%. Chỉ bảo đảm cho cấu hình thẻ này; thẻ màu sáng khác cần đo lại.

| File | Kích thước | KB (1000 byte) | B trung bình giữa | L trung bình giữa | B lớn nhất giữa | Trắng/nền tối thiểu | Trắng/thẻ tối thiểu |
|---|---|---|---|---|---|---|---|
| nen_bxh_ngang.jpg | 1672×941 | 95.1 | 8.62% | 0.887% | 11.56% | 16.47:1 | 17.53:1 |
| nen_bxh_doc.jpg | 941×1672 | 80.6 | 8.39% | 0.877% | 11.75% | 16.27:1 | 17.43:1 |
| nen_nhiem_vu_ngang.jpg | 1672×941 | 93.8 | 9.12% | 1.019% | 17.88% | 13.45:1 | 15.95:1 |
| nen_nhiem_vu_doc.jpg | 941×1672 | 78.3 | 8.37% | 0.871% | 11.36% | 16.55:1 | 17.57:1 |
| nen_thanh_tuu_ngang.jpg | 1672×941 | 98.6 | 8.93% | 0.978% | 13.18% | 15.49:1 | 17.04:1 |
| nen_thanh_tuu_doc.jpg | 941×1672 | 80.3 | 8.01% | 0.815% | 10.63% | 16.80:1 | 17.71:1 |

Đạt: mọi file đúng kích thước, dưới 450KB, B tối đa <22%, tương phản tối thiểu >7:1. Ảnh kiểm tra giữ chữ 14px ở kích thước ảnh thật; xem ở 100% để đánh giá. Đã xem từng ảnh: không chữ/thẻ trong assets; sao băng chỉ trong thành tựu; mây và điểm sáng ở rìa. Những ảnh này cùng bố cục vùng trống, khác điểm nhấn và thích nghi hai khổ.

## 5. Thứ tự lớp
BACKDROP (trời + mây + sao + ánh sáng) → thẻ UI → nội dung chữ → badge/nổi. Không tách hoặc cắt các họa tiết từ nền để dựng asset riêng.

## 6. Danh sách file trong kit
- assets/backdrop/: 6 JPG theo bảng trên; RGB đặc, quality=92, tối ưu progressive.
- reference/reference_3_nen.png: tấm ghép ngang cuối 5016×941, trái BXH → nhiệm vụ → thành tựu, ghép từ ba JPG hoàn chỉnh, không cắt cảnh.
- reference/reference_3_nen_da_duyet.png: bản duyệt màu ban đầu 2167×725; tỷ lệ ô không phải khổ giao.
- reference/kiem_tra_nen_{bxh,nhiem_vu,thanh_tuu}_{ngang,doc}.png: 6 ảnh toàn cảnh kiểm tra đúng hai khổ, có chữ 14px/thẻ navy 45%.
- DESIGN.md: tài liệu này.

Công cụ sinh: built-in imagegen, mỗi nền một lần sinh riêng; chỉnh bằng imagegen khi chi tiết vượt vùng an toàn. Chỉ chuẩn hóa kích thước xuất, mã hóa JPEG và ghép ảnh kiểm tra bằng Pillow, không dùng ảnh ghép để cắt ra asset.

Prompt chung: "Use case stylized-concept. Generate a SINGLE full bleed opaque game UI sky BACKGROUND, no frames, no contact sheet, no text. Match the reference's shared palette and minimalist 2D soft rounded chibi cloud style. Very dark deep navy #081225 to indigo #191B3D smooth horizon, warm pale yellow #F2DE9A stars, faint mint #789F9A cloud rims only. No pink orange red or colorful nebula, no noise, no 3D. Calm quiet adventurous night. Central 80% of width and height MUST be flat dark untextured negative space, brightness max 22%, completely free of stars and clouds. Small sparse stars and 5-8 softly rounded cross sparkle stars only at extreme top and corners. Thin low dark rounded cloud band in bottom 8%, all clouds below y=90%. All light glows strictly in edge corners. No characters buildings game symbols or UI. Maintain same gradient and luminosity for all six backgrounds."
Prompt riêng theo thứ tự 01–06:
1. Landscape 16:9, intended 1672x941. Single gentle dim moonlike warm halo at top RIGHT x96% y5%, no solid moon disc. Larger stars topmost 8%; barely visible tiny DARK distant pennant silhouettes at bottom left, no lit lantern objects.
2. Portrait 9:16, intended 941x1672. Single gentle dim moonlike warm halo at top RIGHT x94% y4%, no solid moon disc. Larger stars topmost 8%; barely visible tiny DARK distant pennant silhouettes at bottom left, no lit lantern objects.
3. Landscape 16:9, intended 1672x941. Single warm pale yellow soft lanternlike glow in extreme bottom LEFT x4% y96%, partially hidden by low dark clouds, glow stays below y90%. No visible lantern or flame, no objects. Sparse top stars.
4. Portrait 9:16, intended 941x1672. Single warm pale yellow soft lanternlike glow in extreme bottom LEFT x5% y96%, partially hidden by low dark clouds, glow stays below y90%. No visible lantern or flame, no objects. Sparse top stars.
5. Landscape 16:9, intended 1672x941. Delicate thin pale yellow diagonal shooting stars only within top 10%, their tails never cross y12%. Tiny dim firefly specks at outermost left and right 4% edges. No other warm halo. Very low dark clouds.
6. Portrait 9:16, intended 941x1672. Delicate thin pale yellow diagonal shooting stars only within top 8%, their tails never cross y10%. Tiny dim firefly specks at outermost left and right 4% edges. No other warm halo. Very low dark clouds.
Ràng buộc bổ sung BXH/nhiệm vụ: no shooting stars, no diagonal streaks; chỉ điểm nhấn đúng màn. Chỉnh BXH ngang: remove all meteor streaks, keep corner halo. Chỉnh nhiệm vụ ngang: stars above top 9% or outermost 5%, central rectangle blank. Chỉnh thành tựu ngang: shooting stars fully in top 8%, no meteor pixel below y10%.

