KẾT LUẬN: ĐẠT

Phạm vi: `lg-126.json` (10 bài MH.126, BT.07.126.01–10) đối chiếu `de-126.json`. Bản gốc trạm soạn: `lg-126.goc.json`.

- Số bài: 10
- Đúng ngay từ đầu (không sửa): 5 — B3, B4, B5, B6, B8 (B1/B2 đúng toán, chỉ sửa trình bày — xem bảng)
- Phải sửa: 5 — B1, B2, B7, B9, B10 (không bài nào sai kết luận toán; sửa thiếu cơ sở / trình bày / dòng dài)
- Bài `null`: không có
- Kiểm toạ độ: 132 phép (4 bộ toạ độ tam giác vuông × 33 khẳng định, gồm mọi khẳng định trung gian và phần đã sửa), sai 0.

## Tên điểm B1, B2 (K hay D)
Đề thật của B1/B2 (`cau_hoi`, Thùy gõ) TỰ đặt điểm: "Tia phân giác của góc B cắt cạnh AC tại K", E trên BC với BA = BE, và câu hỏi bắt chứng minh $\triangle ABK=\triangle EBK$, $AK=KE$, $EK\perp BC$, "BK là đường trung trực của AE".
Nếu đổi lời giải sang D thì lời giải không còn khớp chữ của câu hỏi. Vì vậy GIỮ K (K trùng D của giả thiết gốc), ghi rõ ở `ghi_chu`.
Nếu muốn thống nhất tên D thì phải sửa `cau_hoi` của B1/B2 (đổi K → D) trước, rồi thay K → D trong lời giải (thay thuần chữ, không đổi lập luận).

## Bảng sửa
| Bài | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| B1, B2 | định dạng / trình bày | Ý c): gộp "HA=HE" và "góc AHB = góc EHB" ngay sau khi có hai tam giác bằng nhau, rồi mới suy trung điểm; tách dòng dài; bỏ "K thuộc AC" thừa trong ngoặc | Bản gốc viết "Suy ra góc AHB = EHB (hai góc tương ứng)" sau dòng trung điểm — lí do lệch chỗ; dòng > 60 ký tự |
| B7 | định dạng + thiếu cơ sở | Tách 4 dòng ~60–75 ký tự thành dòng ngắn; nêu cơ sở "D thuộc cạnh AC" cho D nằm giữa A, C; tách lập luận khác phía thành từng bước | Dòng dài; điểm nằm giữa phải nêu cơ sở |
| B9 | thiếu cơ sở + định dạng | "D nằm giữa E và Q" bản gốc dựa vào "(Q thuộc tia ED)" — không đủ (Q trên tia ED vẫn có thể nằm trong đoạn ED). Thêm: D, E cùng phía đối với AB (D thuộc cạnh AC, E thuộc cạnh BC) ⇒ đoạn ED không cắt AB ⇒ D nằm giữa E và Q; tách dòng dài | Điểm nằm giữa phải có cơ sở; dòng ~70 ký tự |
| B10 | thiếu cơ sở | Bản gốc dùng "A nằm giữa B và Q" (để BQ = BA + AQ) không nêu cơ sở. Thay đoạn đó bằng $\triangle BEQ=\triangle BAC$ (g.c.g: góc vuông tại E/A, BE = BA theo B8, góc B chung) ⇒ BQ = BC — không cần thứ tự điểm. Phần sau (BM ⊥ QC, DM ⊥ QC ⇒ trùng nhau) giữ nguyên | Tránh khẳng định thứ tự điểm thiếu cơ sở; lời giải ngắn hơn |

Các bài B3, B4, B5, B6, B8: đúng toán, đúng lí do, đúng whitelist (c.g.c, ch - gn, kề bù, định nghĩa trung trực — không dùng chiều đảo), thứ tự đỉnh khớp, dòng ngắn.

## Kiểm cuối (node)
JSON hợp lệ · 10 bài đúng mã và thứ tự file đề · không `\n\n` · không `\\n` lộ ra · số `$` chẵn mọi bài · không từ cấm · không dòng > 60 ký tự hiển thị.
