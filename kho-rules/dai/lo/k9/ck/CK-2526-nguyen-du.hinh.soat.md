KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-nguyen-du · phần Hình (trạm soát Opus, 03/11/2026)

- **Số câu:** 12 (Bài 20.1–20.4 · 21.1 · 21.2 · 21.3a · 21.3b · 22 · 23 · 24 · 25).
- **Khớp Pha 1 ngay từ đầu:** 12/12 (đáp số + hướng chứng minh; giải mù ở `CK-2526-nguyen-du.hinh.kiem.md`, máy `<LV>\tam\soat_kiem.mjs`, 3000 cấu hình ngẫu nhiên mỗi bài chứng minh).
- **Số câu phải sửa:** 5 (1 định dạng căn cứ · 4 hình) — không câu nào sai toán / sai kiến thức / sai phân loại.
- **Bài sót:** 0 (Pha 0: tự lập danh sách từ ảnh 6 trang trước khi mở bản soạn — Hình chỉ có Bài 20–25 ở trang 3–5; Bài 11 miếng bìa là lập phương trình, đúng là không lấy). **Bài nhập nhầm:** 0.
- Bản gốc trước khi sửa: `CK-2526-nguyen-du.hinh.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (12 câu, 6 TLN, 6 tự luận, 12 hình, 0 chưa chắc).

## Phân xử Bài 23 ý 5 ("$CD=EB$" → "$CD=ED$")

- Ảnh phóng to 400 dpi (`<LV>\z\soat_b23y5.png`) và lớp chữ PDF đều in rõ **"$CD = EB$"** — trạm soạn chép đúng chữ in, không phải đọc nhầm.
- Máy: $CD=EB$ đúng **0/3000** cấu hình; quét liên tục vị trí $C$ trên nửa đường tròn thì $CD=EB$ chỉ xảy ra tại **đúng một vị trí** ($\widehat{COB}\approx53{,}14^\circ$) ⇒ không thể là điều phải chứng minh với "$M$ bất kì". $CD=ED$ đúng **3000/3000** ($D$ là trung điểm $CE$ — bài kinh điển "$CD\perp AB$ và $CD=DE$").
- ⇒ **Trạm soạn đúng**: lỗi in một chữ ($D$→$B$), sửa đề thành $CD=ED$ kèm `Ghi chú` + dòng "Lưu ý" đầu Phần 2 là đúng brief soạn mục 7. Giữ nguyên, không treo `Chưa chắc`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 20.4 | định dạng | "$AB=15$ km và $AC=13$ km (gt)" → "$AB=15$ km (cmt) và $AC=13$ km (gt)" | $AB=15$ km là kết quả vừa tính (vận tốc × thời gian), không phải giả thiết — luật trình bày Hình: căn cứ đúng loại |
| Bài 21.1 | hình | Hình đề: bỏ hai nhãn số đặt cạnh hai bán kính nét đứt; thay bằng hai **đường kích thước** song song bán kính, tách khỏi hình: bên trái tâm → cung trong ghi "4,5 dm", bên phải tâm → cung ngoài ghi "6 dm" | Bản cũ ghi "6 dm" cạnh đoạn nét đứt bên phải — đoạn này dài đúng bằng bán kính nhỏ (4,5 dm) như đoạn bên trái ⇒ hình nói hai đoạn bằng nhau có hai độ dài khác nhau, đọc sai bán kính lớn |
| Bài 22 | hình | Nhãn $O$ dời sang phải–dưới (không chạm đoạn $OD$), cả hình đề và hình giải | nhãn đè lên đường $AD$ |
| Bài 23 | hình | Nhãn $D$ dời xuống phải (khoảng trống giữa $DE$ và $DB$), cả hình đề và hình giải | nhãn nằm đè trên đoạn $CE$ |
| Bài 24 | hình | Hình giải: nhãn $Q$ dời xuống dưới $MN$ (trước đè lên cung tròn và chấm $Q$), kí hiệu góc vuông tại $Q$ chuyển sang phía $N$; nhãn $M$ dời trái (trước chạm đoạn $AN$) | nhãn đè đường / đè điểm |

Script sửa: `<LV>\tam\ve_hinh.mjs` (đã chạy lại, mở từng ảnh kiểm). Các ảnh còn lại (20.1–20.4, 21.2, 21.3a/b, hình đề 24, hình đề + giải 25) đúng dữ kiện, đủ điểm, tiếp tuyến vuông góc bán kính, không ghi số đo ngoài đề, không lộ kết quả.

Đã soát và **giữ nguyên** (đúng): toàn bộ đề chép khớp ảnh (thêm "($D$, $C$ thuộc $MN$)" ở Bài 24 có Ghi chú — hợp lí); lời giải 22–25 không dùng góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / phương tích / đường trung bình / hệ thức đường cao dùng thẳng ($\widehat{ACD}$, $\widehat{AIB}$, $\widehat{ANB}$, $\widehat{CBD}$, $\widehat{CED}=90^\circ$ đều chứng minh bằng tam giác cân; $MA^2=MH\cdot MO$, $AC^2=AE\cdot AD$… đều qua tam giác đồng dạng; $PK^2$, $PM\cdot PN$ qua Pythagore); dấu hiệu tiếp tuyến / tính chất hai tiếp tuyến cắt nhau nêu đúng; làm tròn đúng đề (21.2 dùng $\pi\approx3{,}14$ theo đề; 21.3 $\pi$ máy ⇒ $5{,}24$, Ghi chú nêu $5{,}23$ nếu lấy $3{,}14$); `tra_loi_ngan` đúng 6 câu (2 · 36,8 · 30 · 12,4 · 5,24 · 5,24), 20.3 ($4732{,}4$) và 21.2 ($181{,}3$) quá 4 kí tự ⇒ tự luận đúng.
Lưu ý nhỏ (không sửa): Bài 25 ý 6 dùng "ba đường thẳng song song chắn trên hai cát tuyến các đoạn tỉ lệ" (Thalès mở rộng) — vẫn thuộc nhóm định lí Thalès được phép.

## Phân loại tiếp tuyến (cuối cùng — không đổi so với bản soạn)

| Câu | tt |
|---|---|
| P1 Bài 20.1 | khong_tt |
| P1 Bài 20.2 | khong_tt |
| P1 Bài 20.3 | khong_tt |
| P1 Bài 20.4 | khong_tt |
| P1 Bài 21.1 | khong_tt |
| P1 Bài 21.2 | khong_tt |
| P1 Bài 21.3a | khong_tt |
| P1 Bài 21.3b | khong_tt |
| P1 Bài 22 | hai_tt |
| P1 Bài 23 | ba_tt |
| P1 Bài 24 | tt_khac |
| P1 Bài 25 | hai_tt |

Bài 24: đề có hai tiếp tuyến $PK$, $PH$ nhưng chỉ dùng một tiếp tuyến để tính $PK^2=PA\cdot PB$, không dùng tính chất hai tiếp tuyến cắt nhau ⇒ `tt_khac` đúng theo brief.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
