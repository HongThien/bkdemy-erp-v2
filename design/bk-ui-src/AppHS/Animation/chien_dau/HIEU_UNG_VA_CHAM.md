# Va chạm sét và thiên thạch · v2

Cập nhật v3 thiên thạch: quầng nổ lớn hơn (bán kính ban đầu290px, kéo dài330ms), hai vòng sóng lan,48mảnh đá lớn và20vụn đất văng quanh điểm nổ. Đất đá được vẽ sau lớp bụi để nhìn rõ; bụi tăng lên28cụm, lan rộng hơn. Thời điểm va chạm giữ nguyên560ms.

Hiệu ứng trong `hieu_ung_va_cham.js`, dùng chung cho Nam/Nữ; bật/tắt bằng checkbox Hiệu ứng của `xem_thu_chien_dau.html`. Tất cả lớp FX dựng bằng canvas, không vẽ vào PNG nhân vật.

## Sét

- Bắt đầu tính từ khi vào `niem_troi_2` (mốc770ms của toàn chuỗi).
- 0–450ms: tia sét dày có lõi trắng, viền xanh, nhánh phụ đổi hình theo thời gian.
- 180ms: đánh trúng; chớp trắng-xanh100ms, quầng nổ220ms, sóng va chạm lan ra.
- 180–660ms: rung sân đấu, biên độ giảm từ12px về0.
- 180–1000ms: giật đối tượng, luân phiên hình bình thường và bóng đen với sọ/xương trắng kiểu hoạt hình, tia điện quanh thân. Nhịp đổi145ms; không có máu.
- Với ảnh boss tải vào: lớp bóng đen lấy alpha chính ảnh đó rồi phủ xương hoạt hình theo hộp boss. Khi chưa có ảnh, dùng hình người chibi giữ chỗ để thấy rõ hiệu ứng. Hình xương là mô hình người chung; cần đổi rig nếu boss có giải phẫu đặc biệt.

## Thiên thạch

- 0–560ms sau khi vào `niem_troi_2`: thiên thạch bay chéo tới chân boss. Đầu đạn đạt điểm va chạm đúng mốc560ms.
- Từ560ms: ngừng vẽ viên thiên thạch, thay bằng ánh nổ230ms và sóng xung kích620ms.
- Rung sân350ms, biên độ giảm từ17px về0.
- 32 mảnh đá văng: mỗi mảnh có góc, vận tốc, xoay và trọng lực riêng; một số mảnh nóng phát màu cam.
- 23 cụm bụi: xuất hiện lệch nhau0–150ms, nở, bốc lên, lan ngang và tan dần trong phần còn lại của đòn. Bụi, đá và rung được giới hạn trong dải sân đấu; khung câu hỏi ổn định.

Thời gian giữ `niem_troi_2` vẫn1600ms, sau đó về đứng. Các hạt dùng công thức xác định theo thời gian nên pause/seek cho cùng kết quả ở cùng mốc.

## Ảnh động riêng

- nam_set_dien_giat_2d.png
- nu_set_dien_giat_2d.png
- nam_thien_thach_va_cham_2d.png
- nu_thien_thach_va_cham_2d.png

Mỗi APNG836×471,27khung ×100ms, bao gồm tích năng → niệm → va chạm → trở về đứng. HTML chạy chuyển động theo từng frame trình duyệt; APNG là bản xem nhanh10fps.

Kiểm tra: cả9chế độ vẫn hoạt động; đủ30sprite và5FX; xuất4APNG mới, giải mã được toàn bộ khung, không lỗi JavaScript. Đã xem ảnh tại mốc sét1110ms và thiên thạch1500ms.
