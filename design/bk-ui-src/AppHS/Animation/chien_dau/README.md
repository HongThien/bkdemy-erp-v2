# Animation chiến đấu Nam và Nữ

Cập nhật v3: thiên thạch nổ lớn hơn, hai vòng sóng lan và đất đá văng xa; đã cập nhật cả APNG Nam/Nữ.

Bản v2: sét có chớp nổ, rung và bóng đen–xương trắng; thiên thạch có va chạm, đá vụn, sóng nổ và bụi lan. Xem `HIEU_UNG_VA_CHAM.md`; có4APNG mới cho hai đòn này, mỗi đòn đủ bản Nam/Nữ.

Mở `xem_thu_chien_dau.html` để xem cả hai nhân vật, chọn loại đòn, đổi tốc độ, dừng/chạy lại hoặc xem từng tư thế. Hai kit trong `nam/` và `nu/` có15PNG nhân vật riêng,5FX,1nền và DESIGN.md ghi thời gian, neo ảnh, điểm tay, hộp bao.

`nam_phong_cau_lua_2d.png` và `nu_phong_cau_lua_2d.png` là ảnh động APNG mẫu,27khung ×100ms,836×471. Xem bằng trình duyệt có hỗ trợ APNG; một số ứng dụng xem ảnh chỉ hiển thị khung đầu. Mọi chuỗi còn lại chạy tương tác trong HTML.

`combat-data.json` chứa dữ liệu neo mà bản xem thử dùng. `reference/` của mỗi kit gồm bảng15tư thế5×3 và cảnh1672×941. Ảnh gốc được sinh riêng từng thành phần bằng ImageGen tích hợp. Các bảng/cảnh/APNG là bản render xem thử, không dùng để cắt sprite.

Chưa có ảnh boss_thuy_dung trong đầu vào, nên cảnh tham chiếu giữ chỗ boss. Có thể chọn ảnh boss từ máy trong HTML để xem ghép tại chỗ. PNG gốc chưa có độ cao thân/pivot đồng nhất tuyệt đối; bản xem thử bù bằng dữ liệu neo. Khổ FX và nền thực tế ghi rõ trong DESIGN.md.

Kiểm tra:30/30PNG nhân vật RGBA1024×1536, alpha góc=0;5FX alpha; đủ9chế độ, chạy/dừng hoạt động, gục giữ cuối, không lỗi JavaScript khi xuất tham chiếu. APNG được kiểm tra đủ27khung.
