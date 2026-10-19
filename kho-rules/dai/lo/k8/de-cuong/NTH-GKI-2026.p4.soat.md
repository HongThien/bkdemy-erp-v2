KẾT LUẬN: ĐẠT

# NTH-GKI-2026 · Phần 4 (Dạng 4. Hình tổng hợp) — biên bản soát (trạm soát, 19/10)

- Số câu: **4** (Dạng 4 Câu 1 · Bài 1 · Bài 2 · Bài 3), cả 4 tự luận, kho `hinh_hoc`, không tách ý.
- Khớp Pha 1 ngay từ đầu: **4/4** (Câu 1: $BHCK$ hình bình hành, $BK\perp AB$, $\triangle MEF$ cân tại $M$ · Bài 1: hình chữ nhật, hình bình hành, $G$ trọng tâm $\triangle MEH$ · Bài 2: $AMBH$ **hình thoi**, $A$ trung điểm $HK$, $AEMF$ hình vuông · Bài 3: $\triangle AHD=\triangle CKB$, $AHCK$ hình bình hành, $HKCE$ hình chữ nhật, $BCED$ **hình thang cân**). Mọi kết luận kiểm lại bằng toạ độ số.
- Luật kiến thức: không thấy đường trung bình / Thalès / đồng dạng / Pythagore / lượng giác, kể cả ngầm. Bài 1a, 2b dùng tổng góc tứ giác cho góc thứ tư (không dùng "ba góc vuông"). Bài 1c dùng trọng tâm (lớp 7, phụ lục cho phép). Câu 1c, Bài 2a dùng trung tuyến ứng cạnh huyền (được dùng). Bài 2c dùng hình vuông (NTH học tới hình vuông). Phần 1 đi theo chiều "muốn … cần …", Phần 2 đi ngược lại, khớp mắt xích.
- Số câu phải sửa: **3** (2 hình · 1 lập luận nhỏ) + cập nhật dòng `Chưa chắc` ở 2 câu.
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: **✔ đạt cổng** (4 tự luận, chưa chắc 2).

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Dạng 4 Câu 1 | hình | Nhãn $H$ dời từ phải-trên (17, −6) lên ngay trên điểm (−2, −12) trong `tam\ve_p4.mjs`, vẽ lại | Nhãn cũ nằm đè lên đoạn $HE$ (đường cao $BE$) |
| Dạng 4 Bài 2 | hình | Nhãn $E$ dời sang phải-trên (18, −12); nhãn $F$ dời lên trái-trên (−17, −9), vẽ lại | Nhãn $E$ nằm đúng trên đoạn thẳng đứng $HM$; nhãn $F$ bị đoạn $KF$ cắt ngang |
| Dạng 4 Bài 2 | lập luận | Ý b: "$\widehat{EAF}=90^\circ$ (vì … $F\in AC$)" → "(vì $AB\perp AC$, $E$ thuộc $AB$, $F$ thuộc đường thẳng $AC$)" | Theo cách đọc của khung, $F$ nằm trên tia đối của tia $AC$ (ngoài đoạn $AC$), viết $F\in AC$ là sai chỗ |
| Dạng 4 Bài 2 | ghi chú | Viết lại dòng `Chưa chắc` | Dòng cũ nói "cách đọc hợp lí duy nhất là trung tuyến $AH$" — sai: cách giữ trung tuyến $AM$ và đổi chỗ $H$, $M$ ở câu dựng điểm cũng cho đủ ba ý đúng (máy kiểm), và nhiều khả năng là đề gốc |
| Dạng 4 Bài 3 | ghi chú | Thêm vào `Chưa chắc` tiền lệ NSHM Bài 17 (CEO 13/10 thêm $AB>AD$) | Để CEO quyết một lần cho cả hai đề cương |

Hình giải đã mở kiểm cả 4 (`img\giai_dang4_cau1.png`, `_bai1`, `_bai2`, `_bai3`): dựng đúng dữ kiện ($AB<AC$ ở Câu 1, $AC<AB$ ở Bài 1, $AB\ne AC$ ở Bài 2, $AB>AD$ ở Bài 3), đủ điểm mọi ý, chỉ đánh dấu giả thiết (góc vuông cho trước, gạch bằng nhau); không vẽ $MN$ (Bài 1), $HK$ (Bài 2), không đánh dấu $\widehat{EHK}$ (Bài 3). Sau khi dời nhãn: không nhãn đè / cụt.

## Câu còn `Chưa chắc` (gửi CEO)

1. **Dạng 4 Bài 2** — đề in lỗi tên điểm ("trung tuyến $AM$" rồi lại "lấy điểm $M$", $H$ chưa định nghĩa). Hai cách sửa đều đúng mọi ý: (i) $AH$ trung tuyến, $M$ đối xứng $H$ qua $E$ — khung đang theo, lời giải + hình theo cách này; (ii) giữ $AM$ trung tuyến, $H$ đối xứng $M$ qua $E$ — dạng bài quen hơn ($E$, $F$, $M$ là trung điểm ba cạnh), chọn cách này thì phải viết lại ý b, c và hình.
2. **Dạng 4 Bài 3** — đề không cho $AB>AD$: tên $BCED$ (đúng thứ tự đỉnh) chỉ đúng khi $AB>AD$ (máy: $AB<AD$ thì $B,C,E,D$ tự cắt, tên đúng là $BECD$); $AB=AD$ thì $H\equiv K$, ý b, c suy biến. Kết luận "hình thang cân" đúng trong mọi trường hợp $AB\ne AD$. Cùng lỗi NSHM Bài 17.
