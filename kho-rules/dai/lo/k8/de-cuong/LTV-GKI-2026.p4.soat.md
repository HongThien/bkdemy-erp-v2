KẾT LUẬN: ĐẠT

# Biên bản soát — LTV-GKI-2026 Phần 4 (Bài 20–23, Hình học)

- Số câu: **4** (4 tự luận, kho `hinh_hoc`).
- Khớp lượt giải mù (Pha 1, `LTV-GKI-2026.p4.kiem.md`) ngay từ đầu: **4/4**. Hướng chứng minh của bản soạn trùng gần hết với lượt giải mù (Bài 20b qua tam giác cân $OAF$ + $EAC$; Bài 21c qua hình bình hành $AIJE$; Bài 22d qua hình bình hành $KNMC$; Bài 23b qua trung tuyến ứng cạnh huyền + chiều đảo). Mọi khẳng định kiểm lại bằng toạ độ số (3 bộ số mỗi bài): đúng.
- Đề: chép đúng ảnh `trang/p-4.png`, `p-5.png` cả 4 bài.
- Kiến thức: không dùng đường trung bình (kể cả ngầm), Pythagore, đồng dạng, hình thoi / hình vuông. "Ba góc vuông" đều đi qua tổng góc tứ giác $=360^\circ$ rồi định nghĩa. Trung tuyến ứng cạnh huyền + chiều đảo: trong phạm vi (bài Hình chữ nhật).
- Số câu phải sửa: **3** (Bài 21, 22, 23) — không đổi đáp án / hướng giải câu nào.
- Bản gốc trước khi sửa: `LTV-GKI-2026.p4.soan.goc.md`; script hình gốc: `<LV>\tam\ve_p4.goc.mjs`.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 22 | lập luận (Chú ý) | Chú ý Phần 1 viết lại: $K$ luôn cùng phía $C$ (đối xứng $A$ qua $BD$); $AB>AD$ quyết định thứ tự $K$, $C$; nếu $AB<AD$ thì tên đúng là $DBKC$ (bản soạn ghi $DKBC$). Sửa luôn dòng tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Kiểm toạ độ: với $AB<AD$ cả $DKCB$ lẫn $DKBC$ đều không lồi, chỉ $DBKC$ lồi; và "cùng phía với $C$" không phụ thuộc $AB>AD$ |
| Bài 22 | lập luận (dẫn nguồn) | ý d: "$NA=CM$ (câu b)" ⇒ "(câu a)" | $AN=CM$ được chứng minh ở câu a (hai tam giác bằng nhau) |
| Bài 22 | hình | Thêm cạnh $NC$, $AM$ của hình bình hành $ANCM$ (ý b); dời nhãn $N$ (đè lên $BD$) sang trái, nhãn $M$ xuống dưới | Hình thiếu 2 cạnh của tứ giác ý b phải chứng minh; nhãn $N$ nằm đúng trên đường $BD$ |
| Bài 21 | hình | Thêm cạnh $FE$ của hình bình hành $AHFE$ (ý b); dời nhãn $F$ lên trên-trái | Hình thiếu một cạnh của tứ giác ý b; sau khi thêm $FE$ thì nhãn $F$ cũ bị đường cắt |
| Bài 23 | lập luận | Phần 2 ý b: tách hẳn trường hợp $D$ trùng $H$ ($\widehat{MHN}=\widehat{MDN}=90^\circ$ từ hình chữ nhật), rồi "Xét $D$ khác $H$" mới dùng $\triangle AHD$ vuông; Chú ý Phần 1 và GHI CHÚ sửa theo | Bản soạn ghi "(nếu $D$ trùng $H$ thì …)" trong ngoặc rồi dòng sau vẫn dùng "tam giác $AHD$ vuông tại $H$" — tam giác đó không tồn tại khi $D\equiv H$ |

Hình giải đã mở từng tệp kiểm: `giai_bai20.png` (đủ điểm, đúng $AB<AC$, gạch bằng nhau đúng giả thiết — không sửa) · `giai_bai21.png`, `giai_bai22.png` (đã vẽ lại, mở lại kiểm) · `giai_bai23.png` (không sửa).

## Câu còn `Chưa chắc` (gửi CEO)

| Câu | Lí do |
|---|---|
| Bài 20 (ý b, d) | Dòng chuẩn "dữ kiện đúng là bài đường trung bình, lời giải tự chứng minh — CEO quyết…" (giữ của trạm soạn). Nhận xét của trạm soát: thứ tự ý của đề (b chứng minh $DF\parallel BC$ TRƯỚC d "$F$ là trung điểm") cho thấy người ra đề đã định giải KHÔNG qua đường trung bình; đề cương LTV cũng tự ghi phạm vi "Chương 3 đến hết bài 13 (Hình chữ nhật)" — nên câu hỏi này gần như đã có lời đáp là KHÔNG dùng |
| Bài 21 (ý c, $IJ\perp ME$) | Như trên — $I$, $J$ là trung điểm $EH$, $EM$ của $\triangle EMH$; lời giải đi qua hình chữ nhật/hình bình hành $AIJE$ |
