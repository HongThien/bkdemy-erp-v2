KẾT LUẬN: ĐẠT

MH.131 "Tam giác cụng đầu" — soát `lg-131.json` (bản gốc trạm soạn: `lg-131.goc.json`).

- Số bài: 12 · đúng ngay từ đầu: 9 · phải sửa: 3 (B4, B5, B12) · bài `null`: không có.
- Kiểm toạ độ: 340 phép, 0 sai — 8 bộ tam giác (nhọn; tù tại A, B, C; vuông tại A ×2 cho B9/B10 và ca F trùng A; vuông tại C cho ca F trùng C; cân tại A cho ca H trùng M của B5). Kiểm cả khẳng định trung gian (so le trong, khác phía, F' = E, K' = K, thứ tự đỉnh tương ứng).

| Bài | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| B4 | lí do | "(hệ quả của tiên đề Euclid)" → "(tính chất đường vuông góc)" | Qua một điểm chỉ có một đường vuông góc với đường thẳng cho trước là tính chất đường vuông góc, không phải hệ quả tiên đề Euclid. |
| B5 | lí do | Như B4, 2 chỗ (K trùng M; K' trùng K) | Như trên. Phần K' (đối xứng của H qua M) đúng, đã kiểm cả H trong/ngoài đoạn BC và ca H trùng M. |
| B12 | thiếu cơ sở (ca suy biến) + lí do | Thêm 2 trường hợp: F trùng C (∠C = 90° ⇒ E trùng B, AF = AC = DB = DE theo B3) và F trùng A (∠A = 90° ⇒ ∠CDB = 90° theo B3 ⇒ E trùng D, DE = AF = 0); trường hợp chung giữ cách đối xứng F' qua M. Bổ sung lí do còn thiếu cho "DF' ∥ AC", "CF' ∥ BF", "CF' ⊥ AC", "CF' ⊥ BD"; sửa lí do đường vuông góc duy nhất. Xoá ghi_chu. | Trạm soạn để ngỏ ca suy biến: khi F trùng A thì △MAF suy biến, khi F trùng C thì △MBF suy biến — lời giải chung không áp được. Toạ độ xác nhận F' = E ở mọi ca không suy biến (kể cả góc A, góc C tù). |

Ghi chú các bài đạt (không sửa): B1, B2, B3, B6, B7, B8, B9, B10, B11 — đúng toán, đúng whitelist, thứ tự đỉnh khớp (B7/B8: △ABC = △CEA; B10: △ABC = △CDA), cơ sở "khác phía" đã nêu. B8 tự chứng minh lại △AMB = △DMC vì B1 không nằm trong tien_de — hợp lệ. B9/B10 kiểm với ∠A = 90° (2 bộ toạ độ).

Kiểm định dạng cuối: JSON hợp lệ · 12 bài đúng thứ tự · không `\n\n` · không `\\n` lộ · `$` chẵn · không từ cấm · không dòng nào > 62 ký tự hiển thị.
