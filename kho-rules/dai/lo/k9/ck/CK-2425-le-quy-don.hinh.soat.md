KẾT LUẬN: ĐẠT

# Biên bản trạm SOÁT — CK-2425-le-quy-don (THCS Lê Quý Đôn, 2024–2025) · phần Hình

- Số câu: **14** (P1 Bài 21.1–21.3, 22.1–22.3, 23–29 · P2 Bài 33). Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (2 phần · 14 câu · 0 TLN · 14 tự luận · hình 14 · chưa chắc 0).
- Khớp Pha 1 ngay từ đầu: **14/14** (đáp số và hướng chứng minh đều trùng giải mù `CK-2425-le-quy-don.hinh.kiem.md`; máy kiểm `<LV>\tam\soat_mu.mjs` + `soat_them.mjs`, mỗi bài có tham số 4000 cấu hình, 0 lỗi — gồm cả thứ tự điểm lời giải dựa vào: $T$ trên tia $OQ$, $Q$ ngoài đoạn $AB$ (Bài 24); $J$ trên tia $PN$ và tia $OM$, $JO=JP$ (Bài 25); $T$ trên đoạn $ON$ (Bài 26)).
- Số câu phải sửa: **12** — không câu nào sai đáp số hay sai toán. Lỗi chính là **kiến thức**: 7 bài chứng minh "bốn điểm cùng thuộc một đường tròn" bằng "đường tròn ngoại tiếp tam giác vuông" (Bài 28 KNTT 9, Chương IX, học kì II — ngoài phạm vi; brief soạn mục 6 chỉ cho định nghĩa hoặc trung tuyến ứng với cạnh huyền). Còn lại: hình, Ghi chú thừa. Bản gốc: `CK-2425-le-quy-don.hinh.soan.goc.md`; script vẽ gốc: `<LV>\tam\ve_hinh.goc.mjs`.
- Bài sót: **0**. Bài nhập nhầm (Đại số thuần): **0** (Bài 30–32 là Đại, đúng là không lấy).
- **Bài 24 (đề in thiếu chủ ngữ):** đề in "Kẻ đường kính $AD$ của đường tròn $(O)$, cắt $AB$ tại $H$". Đường kính $AD$ đi qua $A$ nên không thể cắt $AB$ tại điểm $H$ nào khác $A$; ý 2 ($OHBI$ là hình chữ nhật) chỉ đúng khi $H$ là giao của $MO$ và $AB$ (máy: 4000/4000 cấu hình). Sửa chữ đề thành "$MO$ cắt $AB$ tại $H$" + Ghi chú là đúng luật mục 7 (lỗi in hiển nhiên, một cách đọc duy nhất) — giữ, không treo Chưa chắc.
- **Bài 33 (vệ tinh, phần C nâng cao):** hợp lượt Hình — có hình, dữ kiện là đường tròn (mặt cắt qua tâm) và tiếp tuyến kẻ từ điểm ngoài, đáp số là độ dài tiếp tuyến $\sqrt{42186^2-6400^2}\approx41698$ km (khớp Pha 1). Phân loại `tt_khac` (một tiếp tuyến, tính độ dài) đúng; `tu_luan` đúng (đáp số 5 chữ số). Lập luận "xa nhất là tiếp điểm" nêu như nhận xét — chấp nhận được với tầm lớp 9.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| P1 Bài 23 | kiến thức | Ý 1: "đường tròn ngoại tiếp tam giác vuông $OAC$, $OMC$ là đường tròn đường kính $CO$" → gọi $N$ trung điểm $CO$, hai khối "Xét $\triangle$ vuông … có … đường trung tuyến ứng với cạnh huyền nên … (tính chất trung tuyến ứng với cạnh huyền)", kết luận tâm $N$, bán kính $\dfrac{CO}{2}$; Bước 1 Phần 1 sửa theo | Đường tròn ngoại tiếp là kiến thức học kì II; brief mục 6 chỉ cho định nghĩa / trung tuyến ứng cạnh huyền; câu cũ cũng thiếu căn cứ tên định lí |
| P1 Bài 23 | hình | `de_P1B23`, `giai_P1B23`: nhãn $F$ dời xuống dưới điểm (bị đoạn $MB$ cắt ngang); nhãn $I$ dời sang trái (sát nhãn $M$) | Nhãn đè đường / dính nhau |
| P1 Bài 24 | kiến thức | Ý 1 viết lại như Bài 23 (tâm $E$ trung điểm $MO$); Bước 1 Phần 1 sửa theo; Bước 2 bỏ cụm "góc $\widehat{ABD}$ chắn đường kính" → "vuông nhờ hai tam giác cân $OAB$, $OBD$ cùng tổng ba góc" | Như trên; "chắn đường kính" là ngôn ngữ góc nội tiếp (Phần 2 vốn chứng minh bằng tam giác cân) |
| P1 Bài 24 | hình | `de_P1B24`, `giai_P1B24`: nhãn $I$ dời lên trái điểm $I$ | Nhãn bị đường $MD$ cắt ngang |
| P1 Bài 25 | kiến thức | Ý 1 viết lại (tâm $E$ trung điểm $PO$); Bước 1 sửa theo | Như Bài 23 |
| P1 Bài 26 | kiến thức | Ý b (bốn điểm) viết lại (tâm $E$ trung điểm $OM$); Bước 3 sửa theo | Như Bài 23 |
| P1 Bài 27 | kiến thức | Ý a viết lại (tâm $E$ trung điểm $OA$, bán kính $\dfrac{OA}{2}$ — đề hỏi tâm và bán kính); Bước 1 sửa theo | Như Bài 23 |
| P1 Bài 28 | kiến thức | Ý a viết lại (tâm $E$ trung điểm $KO$); Bước 1 sửa theo | Như Bài 23 |
| P1 Bài 28 | hình | `de_P1B28`, `giai_P1B28`: nhãn "2R" dời sát đoạn $KO$, phía trên đường tròn | Nhãn cũ nằm sát $KB$ — đọc thành $KB=2R$ (sai: $OK=2R$) |
| P1 Bài 29 | kiến thức | Ý a viết lại bằng trung tuyến ứng với cạnh huyền, dùng $I$ (trung điểm $OA$, đã có ở (1)); Bước 1 sửa theo | Như Bài 23 |
| P1 Bài 29 | hình | `de_P1B29`, `giai_P1B29`: vẽ đoạn $CE$ (phần kéo dài của $CD$ tới $E$) | $E$ nằm trên đường thẳng $CD$ ngoài đoạn $CD$ — hình cũ để $E$ lơ lửng, không thấy $E\in CD$ |
| P1 Bài 21.2 | hình | `giai_P1B21.2`: nhãn $D$ dời sang trái | Nhãn chạm vạch đỉnh tháp |
| P1 Bài 22.1 | định dạng | Ghi chú bỏ câu "đề không nêu cách làm tròn…" (giữ câu về nhãn 22.1–22.3) | Brief mục 7: không ghi chú chỉ vì đề không nêu làm tròn; Ghi chú dành cho đề lỗi |
| P1 Bài 22.2 | định dạng | Bỏ dòng Ghi chú (chỉ nói về làm tròn) | Như trên |
| P1 Bài 22.3 | định dạng | Ghi chú bỏ vế về làm tròn (giữ phần đọc hình: hai vành 15–18 và 21–24) | Như trên |
| P2 Bài 33 | hình | `de_P2B33`: thêm chấm ở điểm mặt đất gần vệ tinh nhất | Cho thấy $35\,786$ km tính từ mặt đất, không phải từ tâm $O$ |

Soát kiến thức các câu còn lại: không góc nội tiếp / tứ giác nội tiếp / góc tạo bởi tiếp tuyến và dây / định lí sin–côsin / đường trung bình (Bài 23 ý 3 dùng điểm đối xứng $G$ + đồng dạng c.g.c tỉ số $\frac12$; Bài 27 ý c dùng $\triangle CHL\backsim\triangle CBO$); $OH\cdot HA=HB^2$, $BK\cdot BA=BH^2$, $OI\cdot OM=R^2$, $OH\cdot OM=R^2$, $OT\cdot ON=R^2$ đều suy từ tam giác vuông đồng dạng; góc vuông "nhìn đường kính" ($\widehat{AMB}$, $\widehat{ABD}$, $\widehat{ABC}$, $\widehat{BCD}$) chứng minh bằng tam giác cân + tổng ba góc; tiếp tuyến chứng minh bằng dấu hiệu; hai tiếp tuyến cắt nhau nêu đúng tính chất. Lượng giác: nêu tam giác vuông tại đâu, 21.2 tính $250\cdot\tan32^\circ+3{,}2$ rồi mới làm tròn (không tính tiếp từ số đã làm tròn). Không `\times`, `⇔`, "tập nghiệm". Phần 1 không lộ đáp số cuối.

## Phân loại tiếp tuyến cuối cùng (giữ nguyên bản soạn)

| Câu | tt |
|---|---|
| P1 Bài 21.1 | khong_tt |
| P1 Bài 21.2 | khong_tt |
| P1 Bài 21.3 | khong_tt |
| P1 Bài 22.1 | khong_tt |
| P1 Bài 22.2 | khong_tt |
| P1 Bài 22.3 | khong_tt |
| P1 Bài 23 | ba_tt |
| P1 Bài 24 | hai_tt |
| P1 Bài 25 | hai_tt |
| P1 Bài 26 | tt_khac |
| P1 Bài 27 | hai_tt |
| P1 Bài 28 | hai_tt |
| P1 Bài 29 | hai_tt |
| P2 Bài 33 | tt_khac |

Đếm: hai_tt 5 · ba_tt 1 · tt_khac 2 · khong_tt 6.
Ghi về Bài 26: giải mù tôi đánh `hai_tt` (sau ý b có $MA$, $MB$ cùng là tiếp tuyến từ $M$), nhưng đề và lời giải KHÔNG dùng tính chất hai tiếp tuyến cắt nhau — ý b là chứng minh chiều ngược ($MB$ là tiếp tuyến) bằng tam giác bằng nhau; theo đúng tiêu chí brief ("lời giải / đề dùng tính chất đó") thì `tt_khac` của trạm soạn đúng — giữ. Người ghép muốn gom vào mô hình hai tiếp tuyến thì đây là bài sát ranh.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
