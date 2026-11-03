KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-everest-schools · phần Hình (trạm soát Opus, 03/11/2026)

- Số câu: **23** (8 trắc nghiệm Câu 12–19 · 12 tự luận Bài 29a, 29b, 30–39 · 3 câu Đề thi thử Câu 5a, 5b, 6).
- Pha 0: tự lập danh sách từ 12 ảnh trang ⇒ khớp đủ 23 nhãn. **Bài sót: 0 · bài nhập nhầm (Đại số thuần): 0.**
- Khớp Pha 1 (giải mù, `CK-2425-everest-schools.hinh.kiem.md`) ngay từ đầu: **22/23** — lệch duy nhất Bài 30 (đáp số theo tia nhìn thay vì phương ngang).
  8 câu TN: đáp án A · A · B · D · A · C · B · C đều khớp máy kiểm.
- Số câu phải sửa: **5** (Câu 17, Bài 30, Bài 36, Bài 39, Câu 5b). Bản gốc trạm soạn: `CK-2425-everest-schools.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Kiến thức: không thấy góc nội tiếp / tứ giác nội tiếp (ý a Bài 36 chứng minh bằng định nghĩa đường tròn) / góc tạo bởi tiếp tuyến và dây / sin–côsin / đường trung bình (Bài 36g dùng $IO=IC$ + phân giác ⇒ so le trong, Câu 6c dùng tam giác cân $OBN$ + góc ngoài) / hệ thức đường cao dùng thẳng (Bài 35c, Câu 6b qua đồng dạng) / `⇔`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: **✔ đạt cổng** (23 câu · 8 TN · 3 TLN · 12 tự luận · hình 23 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Câu 17 | chép đề | Đề "để đường thẳng $d$ cắt $(O)$ tại $2$ điểm chung" ⇒ "để đường thẳng $d$ và $(O)$ có $2$ điểm chung"; Ghi chú nói rõ chỉ sửa chữ "đến" thành "và" | Bản soạn viết lại câu thừa chữ ("cắt … tại 2 điểm chung"), lệch nguyên văn hơn mức cần; lỗi in chỉ là chữ "đến" |
| P2 Bài 30 | đáp số | $TB=350:\sin20^\circ\approx1023{,}3$ m ⇒ $FB=350\cdot\cot20^\circ\approx961{,}6$ m; viết lại Mấu chốt, Bước 3, Phần 2, Ghi chú; **xoá `Chưa chắc`** | Phân xử theo ảnh đề (đã phóng to `z/soat_b30.png`): chân đài nằm sát mặt biển, thuyền trên mặt biển, tia nhìn chỉ biểu diễn góc hạ $20^\circ$ — người cứu đi trên mặt biển, không đi theo tia nhìn trong không trung ⇒ quãng đường là khoảng cách ngang. Máy: 961,617 m |
| P2 Bài 36 | định dạng (thiếu căn cứ) | Ý b: thêm "(tính chất đường trung trực của đoạn thẳng)" sau hai kết luận $CO$, $OD$ là trung trực | Luật trình bày Hình 7·8·9 mục 3: mọi kiến thức dùng phải có căn cứ trong ngoặc |
| P2 Bài 39 | định dạng (thiếu căn cứ) + hình | Ý a: tách dòng độ dài cung, thêm "(công thức độ dài cung tròn)". Hình đề + hình giải: dời nhãn "$2R$" vào giữa đoạn $OM$ (trong đường tròn) | Nhãn cũ nằm giữa $AM$ và $OM$, dễ đọc thành $AM=2R$ (sai) |
| P3 Câu 5b | hình | Dời nhãn "5 m" ra dải vành khuyên | Nhãn cũ đè lên nét đường tròn trong |

Không sửa (đã kiểm, đúng): đề chép đúng ảnh ở 22 câu còn lại; đáp số Bài 29a ($BC\approx11{,}3$), 29b ($67^\circ$, $23^\circ$), 31 ($37{,}6$), 32 ($4$; $2{,}8$), 33 ($2{,}4$ km), 37 ($81\pi\approx254{,}5$), 38 ($99\pi\approx311{,}0$), 39 ($\frac{2\pi R}{3}$; $\frac{(3\sqrt3-\pi)R^2}{3}$), 5a ($39^\circ$), 5b ($16\pi\approx50{,}3$), Câu 6 ($MA=8$, $OK=3{,}6$); chứng minh Bài 34, 35, 36, Câu 6 đúng trên 2000 cấu hình ngẫu nhiên (`<LV>\tam\soat_kiem.mjs`). Phân loại `loai`: 3 TLN (Bài 31 `37,6`, Bài 33 `2,4`, Câu 5a `39`) đúng luật ≤ 4 kí tự; còn lại `tu_luan`. Hình: 28 tệp đã mở từng tệp — đúng dữ kiện, không lộ kết quả.

## Phân loại tiếp tuyến cuối cùng (không đổi so với bản soạn)

| Câu | tt |
|---|---|
| P1 Câu 12 | khong_tt |
| P1 Câu 13 | khong_tt |
| P1 Câu 14 | khong_tt |
| P1 Câu 15 | khong_tt |
| P1 Câu 16 | khong_tt |
| P1 Câu 17 | khong_tt |
| P1 Câu 18 | khong_tt |
| P1 Câu 19 | khong_tt |
| P2 Bài 29a | khong_tt |
| P2 Bài 29b | khong_tt |
| P2 Bài 30 | khong_tt |
| P2 Bài 31 | khong_tt |
| P2 Bài 32 | khong_tt |
| P2 Bài 33 | khong_tt |
| P2 Bài 34 | tt_khac |
| P2 Bài 35 | hai_tt |
| P2 Bài 36 | ba_tt |
| P2 Bài 37 | khong_tt |
| P2 Bài 38 | khong_tt |
| P2 Bài 39 | hai_tt |
| P3 Câu 5a | khong_tt |
| P3 Câu 5b | khong_tt |
| P3 Câu 6 | hai_tt |

Đếm: hai_tt 3 · ba_tt 1 · tt_khac 1 · khong_tt 18. (Bài 34: $P$ là giao của hai tiếp tuyến $PC$, $PB$ nhưng bài *chứng minh* $PB$ là tiếp tuyến bằng dấu hiệu, không dùng tính chất hai tiếp tuyến cắt nhau ⇒ giữ `tt_khac`. Bài 39 dùng $MA=MB$ và $OM$ phân giác ⇒ `hai_tt` đúng.)

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào. (`Chưa chắc` duy nhất của trạm soạn — Bài 30 — đã phân xử theo ảnh đề, xem bảng sửa.)
