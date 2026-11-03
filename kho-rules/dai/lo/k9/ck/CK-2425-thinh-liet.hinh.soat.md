KẾT LUẬN: ĐẠT

# CK-2425-thinh-liet · phần Hình — biên bản trạm SOÁT (03/11/2026)

- Số câu: 9 (P3 Bài 20–23 · P4 Bài 24–28) — 4 `tra_loi_ngan` (20, 21, 22, 27), 5 `tu_luan`.
- Pha 0: tự lập danh sách bài Hình từ 6 trang ảnh = Bài 20–28, khớp đủ với bản soạn. **Không sót bài**, **không bài nhập nhầm** (Bài 31 bất đẳng thức ba cạnh tam giác là Đại số thuần — đúng là không lấy).
- Số câu khớp Pha 1 ngay từ đầu (đáp số / hướng chứng minh): **9/9**. Máy kiểm: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\CK\CK-2425-thinh-liet\tam\soat_kiem.mjs` (B20 12,504 · B21 362,05 · B22 58,008 · B23 31,9966 m và 6,04 phút · B24 4 / 4,8 · B25, B26 đúng 3000 cấu hình · B27 12,566 · B28 1897,11).
- Số câu phải sửa: **6** (Bài 23, 24, 25, 26, 27, 28) — không câu nào sai đáp số hay sai kiến thức cấm; lỗi là trình bày (tính tiếp từ số đã làm tròn), Phần 1 lộ đáp án, phân loại tiếp tuyến và hình.
- Bản gốc trạm soạn: `CK-2425-thinh-liet.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (9 câu, hình 9, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P3 Bài 23 | lập luận / định dạng | Ý b: tính thời gian bằng $t_1=AC:4000$, $t_2=CB:19000$ (giữ giá trị chưa làm tròn), ghi $0{,}07653+0{,}02414\approx0{,}10067$ giờ $\approx6{,}04$ phút | Bản soạn đổi $AC$, $CB$ đã làm tròn sang km rồi chia tiếp, và dòng cộng $0{,}0765+0{,}0241\approx0{,}1007$ sai số học (tổng là $0{,}1006$). Đáp số 6 giờ 6 phút không đổi |
| P3 Bài 23 | định dạng | Phần 1 Bước 5: "đổi mét ra kilômét" → "đổi vận tốc ra mét trên giờ" | Khớp Phần 2 mới |
| P3 Bài 23 | hình | Nhãn $6^\circ$, $4^\circ$ chuyển lên phía trên đáy cạnh cung góc (trước nằm dưới đáy, ngoài góc); nhãn $762$ m về giữa $AB$ | Nhãn góc nằm ngoài góc dễ đọc nhầm |
| P4 Bài 24 | chép đề (ghi chú) | Ghi chú thêm: ý a đề gốc mất kí hiệu (ô vuông), đọc là $OA\perp MN$ | Lỗi in hiển nhiên trạm soạn sửa mà không ghi |
| P4 Bài 24 | hình | Nhãn "5 cm" dời khỏi chỗ bị đường kính $NC$ (nét đứt) gạch ngang trong hình giải / đè đường tròn | Nhãn bị đè |
| P4 Bài 25 | hình | Nhãn $O$ dời lên trên phải | Trong hình giải đường kính $AD$ chạy xuyên qua chữ $O$ |
| P4 Bài 25 | ghi chú | Thêm: trạm soát kiểm 3000 tam giác bất kì, hai đẳng thức đúng cả khi tam giác tù (không phải đề sai) | Giải theo hình chuẩn nhọn là đủ, không cần Lưu ý đề sai |
| P4 Bài 26 | phân loại | `tt`: `hai_tt` → `ba_tt` | Hình có ba tiếp tuyến: tại $B$, $C$ (hai đầu đường kính $BC$) và tiếp tuyến tại $A$ cắt chúng ở $D$, $E$ (tiếp tuyến tại $C$ là $EC$ ở ý 2) — đúng mẫu ba tiếp tuyến, $\widehat{DOE}=90^\circ$; cùng cách xếp với các đề khác ("tiếp tuyến thứ ba chứng minh" vẫn là `ba_tt`) |
| P4 Bài 26 | hình | Thêm kí hiệu góc vuông tại $O$ ($OE\perp OD$, giả thiết) ở cả hình đề và hình giải; bỏ chấm + nhãn $N$ trong hình giải (lời giải không có điểm $N$), giữ kí hiệu $EO\perp AC$ | Hình đề thiếu dữ kiện vuông góc; điểm lạ không có trong lời giải |
| P4 Bài 27 | hình | Nhãn "5 dm" trước đặt cạnh nét đứt bán kính trong (dài 3 dm) ⇒ dễ đọc thành đoạn đó dài 5 dm; thêm bán kính giữa nét đứt từ $O$ tới cung ngoài và ghi "5 dm" cạnh nó | Nhãn gây hiểu sai số đo |
| P4 Bài 28 | lập luận (Phần 1) | Bước 5 bỏ cụm "gồm hai bán kính và góc ở tâm" | Lộ đáp án của ý b ngay trong Phần 1 |
| P4 Bài 28 | định dạng | Thêm "(gt)" sau $\triangle OAE=\triangle ODE$ | Thiếu căn cứ |
| P4 Bài 28 | ghi chú | Bỏ câu "hình giải thêm hai cạnh bên của vành khuyên ở Hình 3" | Hình giải không khác hình đề ở Hình 3 (nét đứt chồng lên nét liền) |
| P4 Bài 28 | hình | Nhãn "6 in" dời sát đoạn $PQ$; panel Hình 2 dịch trái để ảnh rộng đúng 560 px (trước 574 px, script cảnh báo quá rộng) | Nhãn xa đoạn nó chỉ; quá khổ |

Các câu soát kĩ, không phải sửa: Bài 20 (đã sửa $\widehat{ABC}\to\widehat{OAN}$ đúng hình, có Ghi chú), Bài 21 (số liệu đọc từ hình đúng: $380$ m, $50^\circ$, $15^\circ$), Bài 22. Kiến thức: không câu nào dùng góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / sin–côsin / đường trung bình / hệ thức đường cao dùng thẳng; Bài 24b, 25, 26 chứng minh góc vuông bằng tam giác cân + tổng ba góc, Bài 25b bằng $\triangle ABH\backsim\triangle ADC$.

## Phân loại tiếp tuyến cuối cùng

| Câu | tt |
|---|---|
| P3 Bài 20 | khong_tt |
| P3 Bài 21 | khong_tt |
| P3 Bài 22 | khong_tt |
| P3 Bài 23 | khong_tt |
| P4 Bài 24 | hai_tt |
| P4 Bài 25 | khong_tt |
| P4 Bài 26 | ba_tt |
| P4 Bài 27 | khong_tt |
| P4 Bài 28 | khong_tt |

Đếm: hai_tt 1 · ba_tt 1 · tt_khac 0 · khong_tt 7.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
