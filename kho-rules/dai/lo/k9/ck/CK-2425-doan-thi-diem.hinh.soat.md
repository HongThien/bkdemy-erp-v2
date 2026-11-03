KẾT LUẬN: ĐẠT

# Biên bản SOÁT — CK-2425-doan-thi-diem · phần Hình (THCS Đoàn Thị Điểm, đề cương HKI 2024–2025)

- Số câu: **13** (P1 Bài 1–13, mục "B. HÌNH HỌC" trang 4–6). Pha 0: không sót bài hình, không bài nhập nhầm (phần A Đại số không có bài hình).
- Khớp Pha 1 ngay từ đầu (đáp số / hướng chứng minh): **13/13**. Không câu nào sai toán.
- Số câu phải sửa: **8** (B6, B7, B8, B9, B10, B11, B12, B13) — đều là lỗi nhẹ: chép đề 4 · hình 5 · phân loại 1 · Phần 1 lộ đáp số 1 (một câu có thể dính nhiều loại). Bản gốc: `CK-2425-doan-thi-diem.hinh.soan.goc.md`; script vẽ gốc: `<LV>/tam/ve_hinh.goc.mjs`.
- Kiểm bằng máy: `<LV>/tam/soat_kiem.mjs` (giải mù, B7–B13 mỗi bài 3000 cấu hình, sai số ≤ 1e-11); cổng `dung-de-tu-soan.mjs --chi-kiem` ✔ đạt (13 câu · 3 TLN · 10 tự luận · 13 hình · chưa chắc 0).
- Các chỗ trạm soạn sửa đề — đã kiểm từng chỗ trên ảnh phóng to: B7c "số đo $\overset{\frown}{AMB}$" ⇒ góc $\widehat{AMB}$ ✔ · B13f "$CD$ với $NO$" ⇒ "$BC$ với $NO$" ✔ (theo chữ thì $HK/R$ trải $0{,}68\to>90$, không hằng) · B13h "$S_{ANNB}$" ⇒ "$S_{AMNB}$" ✔ · B8c: trạm soạn hiểu thành ý c dựng hình + ý d chứng minh — SAI cấu trúc, đã sửa (xem bảng) · B4 "một phẳng" ⇒ "mặt phẳng" ✔.
- **Bài 3 (mơ hồ) — đã phân xử, giữ $R=14$, $S=60\pi\approx188{,}5\ \text{cm}^2$:** ảnh 800 dpi (`<LV>/z/soat_b3_noi.png`) cho thấy tại chỗ nối có hai đầu mũi tên chụm nhau (×) và một đầu mũi tên ở tâm ⇒ hai mũi tên kích thước nối tiếp (tâm→cung nhỏ $4$, cung nhỏ→cung lớn $10$); tỉ lệ đo trên hình $r:R\approx0{,}33$ gần $4:14=0{,}29$ hơn $4:10=0{,}4$. Cách hiểu $R=10$ ($28\pi\approx88{,}0$) bị loại ⇒ không treo Chưa chắc.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 8 | chép đề | Gộp "c) … ($E$ không trùng với $D$)." và "d) Chứng minh $DE\cdot BA=BD\cdot BE$" thành MỘT ý c; bỏ dòng "c) Phần dựng hình…" ở Phần 2, đổi "d)" ⇒ "c)"; Phần 1 "Ý d" ⇒ "Ý c"; viết lại Ghi chú | Ảnh: "( $E$ không trùng với" xuống dòng "d ) Chứng minh…" — "d" đi liền dấu ngoặc đóng (cùng kiểu "( $E$" mở ngoặc) ⇒ là điểm $D$ trong ngoặc, đề chỉ có ba ý. Nội dung toán không đổi |
| P1 Bài 6 | chép đề | "đi chuyển" ⇒ "di chuyển" + Ghi chú | lỗi in hiển nhiên |
| P1 Bài 11 | chép đề | Ghi chú thêm: đề in "các tiếp tuyến $(O')$" thiếu "của" (đề đã bổ sung, chưa ghi) | sửa chữ đề phải có Ghi chú |
| P1 Bài 12 | chép đề | Ghi chú thêm: đề in "đối xứng với $M$ qua $OO$" ⇒ $OO'$ (đề đã sửa, chưa ghi) | sửa chữ đề phải có Ghi chú |
| P1 Bài 13 | lập luận (Phần 1) | Mấu chốt bỏ "$\triangle MON$ vuông tại $O$" ⇒ "tam giác $MON$ có $OC$ là đường cao xuất phát từ $O$" | lộ đáp số ý a ($\widehat{MON}=90^\circ$) ở Phần 1 |
| P1 Bài 7 | hình | Nhãn $C$ (đề + giải) dời vào trong đường tròn, sát điểm | nhãn cũ nằm đè lên tiếp tuyến $MB$ |
| P1 Bài 8 | hình | Nhãn $E$ (đề + giải) dời tương tự | nhãn cũ đè lên $AC$ |
| P1 Bài 9 | hình | Nhãn $H$ (đề + giải) dời lên trái; nhãn $I$ (giải) dời khỏi $DO$ | $H$ cũ đè lên $OE$, $I$ cũ đè lên $DO$ |
| P1 Bài 10 | hình | Nhãn $I$ (giải) dời khỏi $CO$ | đè lên $CO$ |
| P1 Bài 11 | hình | Nhãn $O$ (đề + giải) dời lên trái | đè lên đường tròn $(O')$ |
| B1–B13 | hình | Script vẽ: mọi chữ vẽ SAU các nét + tên điểm có viền trắng | các nét nét đứt vẽ sau (hình giải) từng đè lên nhãn |
| P1 Bài 12 | phân loại | `tt_khac` ⇒ `hai_tt` | ý d dùng đúng tính chất hai tiếp tuyến cắt nhau tại $B$ ($BM=BA$, $BN=BA$) — khớp tiêu chí `hai_tt` của brief (tiền lệ: tiếp tuyến chung KHÔNG có cặp cắt nhau mới là `tt_khac`) |
| P1 Bài 3 | (không phải lỗi) | Ghi chú bổ sung bằng chứng phân xử $R=14$ | để người ghép thấy cơ sở |

Hình đã mở kiểm đủ 21 tệp (13 hình đề + 8 hình giải): đúng dữ kiện (B7 dựng $OM=2R$, B8 $OA=2R$, B3 $r:R=4:14$, B5 $3:5$, B6 cung lớn $245^\circ$), tiếp tuyến vuông góc bán kính, không lộ kết quả phải chứng minh ở hình đề (không đánh dấu góc vuông / đoạn bằng nhau), canvas ≤ 400 px cao.

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P1 Bài 2 | khong_tt |
| P1 Bài 3 | khong_tt |
| P1 Bài 4 | khong_tt |
| P1 Bài 5 | khong_tt |
| P1 Bài 6 | khong_tt |
| P1 Bài 7 | hai_tt |
| P1 Bài 8 | hai_tt |
| P1 Bài 9 | ba_tt |
| P1 Bài 10 | ba_tt |
| P1 Bài 11 | hai_tt |
| P1 Bài 12 | hai_tt |
| P1 Bài 13 | ba_tt |

Đếm: hai_tt 4 · ba_tt 3 · tt_khac 0 · khong_tt 6.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
