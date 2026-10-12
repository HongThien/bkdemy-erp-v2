KẾT LUẬN: ĐẠT

# GKI-07 — biên bản SOÁT (THCS Nguyễn Công Trứ, Ba Đình, giữa học kì 1 2024–2025)

- Số câu: **11** (Bài 1 · Bài 2a–2d · Bài 3a–3c · Bài 4 · Bài 5 · Bài 6) — đủ 6 bài của đề, không sót, không thừa.
- Khớp đáp án Pha 1 (giải mù, `GKI-07.kiem.md`) ngay từ đầu: **11 / 11**. Máy kiểm của trạm soát: `<LV>\tam\soat_kiem.mjs` (thay số hai vế; Bài 5 dựng toạ độ 2 bộ) — khớp hết.
- Số câu phải sửa: **3** (Bài 1, Bài 2c, Bài 5) — đều là sửa nhẹ, không câu nào sai đáp số, sai đề hay sai kiến thức. Bản trước khi sửa: `GKI-07.soan.goc.md`.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (trước và sau khi sửa).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1 | lập luận (Phần 1, Chú ý) | "hệ số là phân số âm, nên giá trị cuối cùng cũng âm" → "hệ số âm, còn $2^3$ và $1^5$ đều dương, nên giá trị cuối cùng là số âm" | Hệ số âm chưa đủ để kết luận giá trị âm (còn tuỳ dấu của phần biến) — câu cũ dạy sai cách suy luận |
| Bài 2c | định dạng (Phần 2) | $12x^2y:4xy-8xy^2:4xy+xy:4xy$ → thêm ngoặc $:(4xy)$ ở cả ba phép chia | Đề của chính ý này viết $:(4xy)$; bỏ ngoặc dễ đọc thành chia cho 4 rồi nhân $xy$ |
| Bài 5 | lập luận (Phần 1, Mấu chốt) | Bỏ cụm "$AHCK$ đối xứng qua $I$ … suy ra liên tiếp: nửa cạnh huyền (ý a)"; viết lại: tam giác $AHC$ vuông tại $H$ + $I$ là trung điểm của $AC$ và $HK$ ⇒ lần lượt ý a, b, c, d | Ý a không suy ra từ "$I$ là trung điểm $HK$" (điểm $K$ chưa có ở ý a); "đối xứng qua $I$" không phải ngôn ngữ của bài |
| Bài 5 | hình (Hình giải `giai_bai5.png`) | Sửa `<LV>\tam\ve.mjs`, vẽ lại: bỏ gạch $AB=AC$ đặt gần $A$; bốn nửa cạnh $AG, GB, AI, IC$ cùng một gạch, $IH, IK$ hai gạch; thêm điểm $O$ (giao của $AH$ và $BK$, tính bằng phép giao) | Gạch $AB=AC$ nằm chồng lên đoạn $AG$, $AI$ nên mỗi đoạn con có hai loại gạch — đọc nhầm; lời giải ý d dùng điểm $O$ mà hình chưa có nhãn |

## Đã soát, không sửa

- **Đề**: 11 câu chép đúng ảnh (đã cắt 300 dpi kiểm số mũ Bài 1, 2, 3, 6). Dấu chấm làm dấu nhân của đề được viết liền ngoặc–ngoặc (đúng k8.md §3).
- **Kiến thức**: đề chạm Chương I + Chương III tới hình chữ nhật (Bài 5b) ⇒ được dùng trung tuyến ứng với cạnh huyền (Bài 5a) và tính chất hình chữ nhật. Bài 5d **không** dùng đường trung bình: chứng minh $AGHI$ là hình bình hành ($AG\parallel IH$, $AG=IH$ từ hình bình hành $AKHB$) — hợp lệ, đã kiểm toạ độ. Bài 5c lấy $HB=HC$ bằng hai tam giác vuông bằng nhau (cạnh huyền – cạnh góc vuông). Bài 6 không dùng hằng đẳng thức / phân tích nhân tử: khai triển $(a+b)(b+c)(c+a)$ rồi so với điều kiện — đã kiểm từng hạng tử.
- **Phân loại**: `kho` đúng (Bài 5 `hinh_hoc`, còn lại `dai`, kể cả Bài 4 thực tế). Tách ý đúng: Bài 2, Bài 3 tách; Bài 1 (ý b dùng kết quả ý a), Bài 4, Bài 5 giữ chung. Trả lời ngắn: Bài 3a ($-2$), 3b ($11$), 3c ($-15$), Bài 6 ($0$) — đều một số nguyên ≤ 4 ô.
- **Hình**: `p1b4_hinh.png` đủ hai hình vuông và hai nhãn $x$ (cm), $y$ (cm), không cụt (ảnh máy cắt `p5c4_1.png` bị cụt, đúng là không dùng).
- Phần 1 Bài 5: sáu bước theo chiều phân tích đi lên, khớp từng mắt xích với Phần 2.

## Câu còn `Chưa chắc`

Không có.

## Điều người duyệt nên biết (không phải lỗi)

- Bài 6 (câu nâng cao 0,5 điểm) nhập `tra_loi_ngan`, đáp số $0$ — đúng luật phân loại, nhưng đáp số $0$ dễ đoán; nếu muốn đo đúng năng lực thì cân nhắc đổi `tu_luan`.
- Bài 5d còn một cách khác cùng phạm vi kiến thức (trạm soát giải ở Pha 1): $HG=\dfrac{AB}{2}=AG$, $HI=\dfrac{AC}{2}=AI$ (trung tuyến ứng với cạnh huyền) ⇒ $AGHI$ có các cạnh đối bằng nhau ⇒ hình bình hành. Bản soạn đi qua hình bình hành $AKHB$ — giữ nguyên.
