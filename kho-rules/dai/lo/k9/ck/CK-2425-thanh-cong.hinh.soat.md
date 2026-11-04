KẾT LUẬN: ĐẠT

# Biên bản soát · CK-2425-thanh-cong · phần Hình (trạm soát Opus, 03/11/2026)

- Số câu: **19** (Phần 1: A.III Bài 1 · Phần 2: B.I Bài 1–10 · Phần 3: B.II Bài 1–8) — 5 `tra_loi_ngan`, 14 `tu_luan`.
- Khớp Pha 1 ngay từ đầu (đáp án / đáp số / hướng chứng minh): **19/19** (P2 Bài 4 khớp theo $n$). Không câu nào lệch đáp số.
- Số câu phải sửa: **5** (P2 Bài 2, 4, 5, 9, 10) — 4 câu sửa hình, 1 câu thêm `Chưa chắc`, 1 câu sửa căn cứ (P2 Bài 5 vừa hình vừa định dạng). Bản gốc trạm soạn: `CK-2425-thanh-cong.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Bài sót: **0**. Bài nhập nhầm: **0**.
  - P1 Bài 1 (trạm phát sóng, đề cương xếp ở A. Đại số – Phần III thực tế): **là bài Hình** theo brief soạn mục 1 — có hình tam giác vuông, nội dung là tính cạnh huyền bằng Pythagore (ý a viết biểu thức chứa căn, nhưng vẫn là tính độ dài trên hình). Giữ, `khong_tt`. A.III Bài 2 (khối lập phương), Bài 3 (hươu cao cổ $h=0{,}4\sqrt[3]{x}$) là căn bậc ba thuần — không lấy, đúng.
- Cổng: `dung-de-tu-soan.mjs --chi-kiem` ⇒ **✔ đạt cổng** (19 câu · hình 19 · chưa chắc 1).
- Kiến thức: không câu nào dùng góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / sin–côsin / đường trung bình (P2 Bài 5 ý c đi bằng tam giác đồng dạng + hình chữ nhật) / hệ thức đường cao / `⇔`. Phần 1 các câu đều 3–5 bước nghĩ, không lộ đáp số.

## Lưu ý (1): P2 Bài 4 — số đo góc ở tâm
Phóng to 520 dpi (`<LV>\z\soat_p7_goc.png`): giữa "vẽ góc ở tâm" và "với C" là **khoảng trắng thật**; `pdftotext` trang 7 cũng không có gì ở đó; trang 7 không có ảnh nhúng ⇒ đối tượng công thức đã mất từ bản PDF gốc, không phục hồi được. Lời giải tổng quát theo $\widehat{AOC}=n^\circ$ của trạm soạn đúng (máy kiểm $n=1\ldots179$, $n\ne90$: $E=-C$, cung nhỏ $BE=n^\circ$). Thêm `**Chưa chắc:**` để CEO chọn số đo — làm giống hệt bản CK-2526-thanh-cong (Bài 7) cho nhất quán.

## Lưu ý (3): so với CK-2526-thanh-cong — **GIAO MỘT PHẦN (khác đề)**
Hai đề cương khác nhau (2526: Đại số là phương trình / bất phương trình / lập hệ…, Hình 30 bài gồm cả tỉ số lượng giác, ba tiếp tuyến, bánh đà…). **9/19 bài Hình của 2425 trùng nguyên văn bài trong 2526:**

| 2425 | 2526 | Nội dung |
|---|---|---|
| P2 Bài 1 | Bài 5 | hai đường vuông góc $OA$, $OB$ cắt tại $M$; $OH\cdot OM$ không đổi |
| P2 Bài 3 | Bài 6 | tam giác đều, đường cao $BM$, $CN$ |
| P2 Bài 4 | Bài 7 | góc ở tâm (cả hai đều mất số đo) |
| P2 Bài 5 | Bài 8 | hình thang vuông $AB=4$, $BC=13$, $CD=9$ |
| P2 Bài 6 | Bài 9 | phân giác $BD$, $DM=DA$ |
| P2 Bài 10 | Bài 10 | tiếp tuyến $AB$, $AC$; $DE$; $CK\parallel AO$ |
| P3 Bài 3 | Bài 26 | hình quạt $2$ dm, $150^\circ$ |
| P3 Bài 5 | Bài 24 | khăn trải bàn $1{,}2$ m, rủ $25$ cm |
| P3 Bài 7 | Bài 29 | hải đăng $18$ dặm, $245^\circ$, dây $28$ dặm |

**10 bài chỉ có ở 2425** (phải nhập): P1 Bài 1 · P2 Bài 2, 7, 8, 9 · P3 Bài 1, 2, 4, 6, 8.
⇒ Đề nghị người ghép: 9 bài trùng chỉ nhập một bản (đáp số hai bản khớp nhau: hình quạt $\dfrac{5\pi}{3}$; khăn $\approx2{,}3$ m²; hải đăng $\approx1793$ km², $\approx11$ dặm). Ngoài lượt Hình: Đại số 2425 Phần II Bài 12, 13, 14, 18 cũng trùng 2526 Bài 24–28.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P2 Bài 2 | hình | `de_P2B2`: bỏ hai dấu góc vuông tại $E$, $F$ (giữ ở `giai_P2B2`); `giai_P2B2`: dời nhãn $H$ sang trái | Hình đề lộ kết quả ý a ($BE\perp MA$, $AF\perp MB$ là điều phải chứng minh); nhãn $H$ ở hình giải bị đoạn $OF$ đè |
| P2 Bài 4 | ghi chú / chưa chắc | Thêm `**Chưa chắc:**` (đề thiếu số đo góc ở tâm) + một câu vào Ghi chú về việc đã phóng to, đối chiếu bản 2526 | Đáp số ý a, c không ra được số; cần CEO bổ sung số đo — nhất quán với CK-2526-thanh-cong Bài 7 |
| P2 Bài 5 | định dạng · hình | Căn cứ $\widehat{CFI}=90^\circ$ ghi "(gt)" ⇒ "($IF\perp DC$ (cách kẻ), $BE\perp DC$ (gt))"; `giai_P2B5`: dời nhãn "13 cm" lên đoạn trên của $BC$ | $IF$ là đường kẻ thêm, không phải giả thiết; nhãn "13 cm" nằm sát điểm $I$ dễ đọc nhầm $I$ = 13 cm |
| P2 Bài 9 | hình | `giai_P2B9`: dời nhãn $H$ sang trái | Nhãn $H$ bị đoạn $HK$ đè |
| P2 Bài 10 | hình | `de_P2B10`, `giai_P2B10`: dời nhãn $E$ (vào trong đường tròn) và nhãn $M$ (xuống dưới $OD$) | Nhãn $E$ bị tiếp tuyến $AB$ đè; nhãn $M$ ở hình giải bị $OA$ đè |

Các hình khác (19 hình đề + 13 hình giải) đã mở từng tấm: đúng dữ kiện, đủ điểm, tiếp tuyến / góc vuông đúng hình học, không lộ kết quả. P3 Bài 8 khớp hình gốc (tường nghiêng che phía bánh xe ⇒ góc $60^\circ$ ở phía bánh xe ⇒ $OC=40$ cm).

## Phân loại tiếp tuyến cuối cùng (không đổi so với trạm soạn)

| Câu | tt |
|---|---|
| P1 Bài 1 | khong_tt |
| P2 Bài 1 | hai_tt |
| P2 Bài 2 | tt_khac |
| P2 Bài 3 | khong_tt |
| P2 Bài 4 | khong_tt |
| P2 Bài 5 | tt_khac |
| P2 Bài 6 | tt_khac |
| P2 Bài 7 | tt_khac |
| P2 Bài 8 | hai_tt |
| P2 Bài 9 | tt_khac |
| P2 Bài 10 | hai_tt |
| P3 Bài 1 | khong_tt |
| P3 Bài 2 | khong_tt |
| P3 Bài 3 | khong_tt |
| P3 Bài 4 | khong_tt |
| P3 Bài 5 | khong_tt |
| P3 Bài 6 | khong_tt |
| P3 Bài 7 | khong_tt |
| P3 Bài 8 | hai_tt |

Đếm: hai_tt 4 · ba_tt 0 · tt_khac 5 · khong_tt 10.
Ghi chú phân loại: P2 Bài 10 có ba tiếp tuyến $AB$, $AC$, $DE$ nhưng lời giải chỉ dùng tính chất hai tiếp tuyến cắt nhau (tại $A$: $AO\perp BC$; tại $D$: $DC=DE$), không có cấu hình "tiếp tuyến thứ ba cắt hai tiếp tuyến kia" ⇒ giữ `hai_tt` (giống 2526 Bài 10). P2 Bài 8: kết quả là hai tiếp tuyến $CA$, $CB$ cắt nhau tại $C$ với $OC\perp AB$ cho sẵn ⇒ `hai_tt`. P3 Bài 8: mặt đất và tường là hai tiếp tuyến cắt nhau tại góc tường, dùng "$CO$ là tia phân giác" ⇒ `hai_tt`.

## Câu còn `Chưa chắc` (gửi CEO)
- **P2 Bài 4** — đề cương mất số đo góc ở tâm $\widehat{AOC}$ (chỗ trống trong PDF gốc, cả bản 2526 Bài 7 cũng vậy). Lời giải tổng quát theo $n^\circ$: cung nhỏ $AC=n^\circ$, cung lớn $BE=360^\circ-n^\circ$. Cần CEO chọn một số đo (vd $60^\circ$) nếu muốn đáp số bằng số.
