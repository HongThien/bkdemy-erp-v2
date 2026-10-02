# Animation chạy bộ 2D — nam và nữ

PNG của hai nhân vật giữ nguyên phong cách/trang phục từ bộ Lục địa rừng. Mỗi khung là một file riêng có alpha; không dùng một ảnh đứng kéo qua lại để giả chạy.

## Chu kỳ

| Khung | Tên sau tiền tố `nam_` hoặc `nu_` trong thư mục cùng tên | Động tác | Thời gian |
|---|---|---|---|
| 1 | 01_chay_buoc_trai.png | Chân trái ra trước, tay đối diện ra trước | 100 ms |
| 2 | 02_chay_ha_nguoi_trai.png | Gối chịu lực, thân hạ nhẹ | 100 ms |
| 3 | 03_chay_nang_goi_phai.png | Chân sau đưa qua trước, chân trụ đạp đất | 100 ms |
| 4 | 04_chay_buoc_phai.png | Đổi chân và tay trước/sau | 100 ms |
| 5 | 05_chay_ha_nguoi_phai.png | Hạ người trên chân trụ đối diện | 100 ms |
| 6 | 06_chay_nang_goi_trai.png | Chuyển chân để trở lại khung 1 | 100 ms |

Một vòng trái+phải 600 ms, 10 khung/giây. Chuyển khung trực tiếp, không crossfade vì gây hai bóng chân. Vị trí di chuyển được cập nhật 60Hz riêng với hình; tốc độ bước và vận tốc phải tăng/giảm cùng hệ số. Trong preview, nhân vật cao 180 đơn vị màn, mỗi vòng đi 88 đơn vị: vận tốc khoảng 147 đơn vị/giây. Đây là tốc độ xem thử; khi gắn đường bản đồ, chọn độ dài bước theo kích thước nhân vật.

## Căn và hiển thị

- Bản xem thử: `xem_thu_chay_2d.html`, hoạt động khi mở trực tiếp hoặc qua server tĩnh. Có chạy/dừng, từng khung, tốc độ, hướng và chạy tại chỗ.
- File xem nhanh `nam_chay_lien_tuc_2d.png` và `nu_chay_lien_tuc_2d.png` là **APNG động** nền trong suốt, 360×300, sáu khung, lặp vô hạn mỗi 600ms. Đây là bản xuất từ canvas animation, không thay thế PNG nguồn 1024×1536 để dùng trong game. Trình xem không hỗ trợ APNG chỉ hiện khung đầu; dùng HTML để xem chắc chắn.
- Mỗi PNG 1024×1536. Không co giãn ngang/dọc riêng; giữ cùng kích thước canvas cho cả chu kỳ.
- Neo trục thân x≈55% nguồn; neo đất khoảng y96%, điều chỉnh riêng các ảnh cũ theo bảng `anchors` trong preview. Không căn giữa theo áo choàng hoặc trung bình hai chân đang dang.
- Neo y chính xác đang dùng theo khung 1→6: nam `0.947, 0.922, 0.948, 0.954, 0.948, 0.948`; nữ `0.976, 0.967, 0.968, 0.975, 0.971, 0.968`. Các giá trị này áp vào hộp PNG nguồn, x=0.55. Không dùng alpha halo ngoài chủ thể để tính neo.
- Nhún thân tối đa khoảng 0.7% chiều cao; ảnh hạ người đã chứa chuyển động tư thế, không cộng thêm nhún lớn. Shadow nằm trên mặt đất, không nhún theo người.
- Hướng phải là hướng nguồn; hướng trái lật ngang cả sprite tại runtime. Không đổi thứ tự frame khi đổi hướng.
- Khi đi trên bản đồ: lấy độ dài cung đường để tính bước, không nội suy x/y giữa hai công trình bằng đường thẳng. Chiều cao theo độ sâu dùng quy tắc trong DESIGN.md.
- Khi dừng: chuyển về `nam/nam_00_dung_yen.png` hoặc `nu/nu_00_dung_yen.png`, giữ điểm chân. Bắt đầu chạy ở khung 1; dừng ở trạng thái tiếp đất, không treo một boot giữa không trung.
- Frame mới sinh bằng imagegen riêng từng ảnh. Hình vẽ sinh lại có sai khác nhỏ ở chi tiết; preview là bản kiểm tra nhịp, chưa được kiểm thử trong engine AppHS thực tế.

## Tích hợp

Load trước đủ sáu texture mỗi giới để tránh nhấp nháy. Dùng delta thời gian, không đếm requestAnimationFrame để xác định frame. Khi tab bị ẩn thì ngừng đồng hồ hoặc giới hạn delta lúc trở lại. Trong engine, hình và vị trí chia sẻ một tốc độ thời gian; nhân vật scale theo độ sâu nhưng không thay vị trí tiếp đất.

Các PNG gốc trong `assets/characters/` vẫn được giữ để tương thích kit cũ; bộ sáu khung dùng cho chạy mới nằm tại `Animation/nam/` và `Animation/nu/`.

Thư mục giao: AppHS/Animation. Ví dụ file đầy đủ: nam/nam_01_chay_buoc_trai.png, nu/nu_03_chay_nang_goi_phai.png. File 00 là tư thế đứng; file chay_lien_tuc_2d là PNG động xem nhanh. kit_luc_dia_rung_kem_animation_v1.zip là gói lưu cũ trước khi đổi vị trí. animation_nam_nu_v1.zip là gói animation độc lập với tên file mới.
