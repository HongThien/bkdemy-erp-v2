KẾT LUẬN: ĐẠT

# Biên bản soát — NSHM-GKI-2026 Phần 10 (Bài 19–22, Hình học) — trạm soát Opus, 12/10

- Số câu: **4** (4 tự luận, kho `hinh_hoc`).
- Khớp lượt giải mù (`NSHM-GKI-2026.p10.kiem.md`) ngay từ đầu: **4/4** — mọi kết luận và hướng chứng minh đều đúng, kiểm lại bằng toạ độ số (`<LV>\tam\soat_p10.mjs`, 3–5 bộ số mỗi bài, gồm cả trường hợp $N$ nằm ngoài đoạn $BC$ ở Bài 21 và $AB=AC$ ở Bài 20).
- Đề chép đúng ảnh (`4.png`, `5.webp`, đã phóng to): 4/4.
- Luật kiến thức: đọc từng dòng, **không có chỗ dùng ngầm đường trung bình / Pythagore / đồng dạng / Thalès**. Bài 19 tự chứng minh $MQ\parallel BC$ qua hình bình hành $AMQK$ (tam giác bằng nhau g.c.g); Bài 21a tự chứng minh $OC=OD$ (vốn là đường trung bình hình thang $ADCN$) qua điểm $F$, tam giác bằng nhau và trung tuyến ứng với cạnh huyền; Bài 20c, 22b đi bằng tam giác cân + góc; mọi chỗ "tam giác vuông" dùng trung tuyến ứng với cạnh huyền và chiều đảo (có trong bài Hình chữ nhật); hình chữ nhật đều qua "ba góc vuông + tổng góc 360° ⇒ bốn góc vuông".
- Số câu phải sửa: **4** (không câu nào sai đáp số / sai toán; sửa lời Phần 1, định dạng, lí do thiếu, hình).

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 19 | lập luận (Phần 1) | Mấu chốt: bỏ "hình chữ nhật … cho $NA=NB=NC$", thay bằng điều hình chữ nhật thật sự cho ($NQ\parallel AM$, $NQ=AM$, $MN=AQ$, hai đường chéo bằng nhau cắt nhau tại trung điểm $O$) | $NA=NB=NC$ là điều dùng ĐỂ chứng minh hình chữ nhật (trung tuyến ứng với cạnh huyền), không phải hệ quả của nó — viết vậy là lập luận vòng |
| Bài 19 | lập luận | Ý c thêm lí do "($I$ không trùng $N$ vì $AB<AC$)" khi kết luận $INQM$ là hình thang | Ý c cần $I\ne N$ mới có tứ giác; bản soạn chỉ nêu ở ý d |
| Bài 19 | hình | Nhãn $O$ dời lên góc trên phải điểm $O$ | Nhãn cũ đè lên đoạn $AN$ (đã phóng to kiểm) |
| Bài 20 | định dạng | `2\cdot IK` → `2IK`, `2\cdot AM` → `2AM` (đề, Phần 1, Phần 2) | k8.md §3: số với chữ viết liền, `\cdot` chỉ giữa hai số; đề in "2.IK" là dấu nhân kiểu tài liệu; cùng tệp Bài 22 đã viết $2AM$, $4EF$ |
| Bài 20 | hình | Nhãn $O$ dời lên trên trái, nhãn $E$ dời lên trên | Nhãn cũ đè đoạn $IK$ (cả $O$ lẫn $E$) |
| Bài 21 | lời Phần 1 | Mấu chốt viết lại: "tam giác vuông có cạnh huyền $AN$ …; chiều ngược lại … ở ý b, và ở ý c sau khi thấy $O$ cũng là trung điểm của $BM$" | Câu cũ nói ý c cũng dùng cạnh huyền $AN$, nhưng tam giác $BKM$ có cạnh huyền $BM$ |
| Bài 21 | hình | Thêm đoạn $BK$ | Hình thiếu cạnh $BK$ của tam giác $BKM$ (ý c) |

Script hình đã sửa: `<LV>\tam\ve_p10.mjs` (bản trước khi sửa: `ve_p10.mjs.goc`), vẽ lại cả 4 hình và mở từng hình kiểm: đúng dữ kiện ($AB<AC$ ở Bài 19, $DI=CK$, $AO=ON$, góc vuông giả thiết), đủ điểm mọi ý, không đánh dấu điều phải chứng minh, nhãn không đè. Bài 22 không phải sửa.

Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: **✔ đạt cổng** (4 tự luận, chưa chắc 1).

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 19** — dữ kiện đúng là bài đường trung bình ($M$, $Q$ trung điểm $AB$, $AC$ ⇒ $MQ\parallel BC$, cần cho ý b và c). Lời giải tự chứng minh bằng hình bình hành $AMQK$, đúng luật; CEO quyết có cho dùng đường trung bình ở đề cương này không (cờ của trạm soạn, giữ nguyên theo brief).
- *(Không thêm cờ)* Bài 21a cũng là kết quả quen thuộc của đường trung bình hình thang (KNTT 8 không dạy ở bất kì bài nào) — lời giải tự chứng minh trọn trong phạm vi, trạm soạn đã ghi ở GHI CHÚ CHO NGƯỜI DUYỆT, không cần cờ riêng.
