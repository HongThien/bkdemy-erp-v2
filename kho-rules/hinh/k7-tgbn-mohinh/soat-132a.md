KẾT LUẬN: ĐẠT

Phạm vi: `lg-132a.json` — MH.132 "Tam giác cân", B1–B13 (đề `de-132.json`, chỉ 13 bài đầu). Bản gốc: `lg-132a.goc.json`.

- Số bài: 13
- Đúng toán ngay từ đầu: 13/13 (không bài nào sai toán, sai thứ tự đỉnh hay dùng kiến thức cấm)
- Đúng hẳn, không sửa gì: 5 (B1, B5, B7, B8, B13)
- Phải sửa: 8 (B2, B3, B4, B6, B9, B10, B11, B12), đều là lỗi nhẹ: thiếu lí do/cơ sở hoặc định dạng
- Bài `null`: không có

Kiểm toạ độ: 150 phép trên 5 tam giác cân (từ nhọn đến tù, P ở 3 vị trí trên AD), sai 0. Đã kiểm mọi khẳng định trung gian: M, E, F thuộc tia AB/AC · N thuộc cạnh AC · △KNE = △KCD · E, D khác phía NC · MN ∥ BC · NE ∥ BC · M, N, E thẳng hàng · I, K nằm giữa E, F · AI ⊥ EF, DI ⊥ EF · 2∠AHC = ∠BAC · C, D cùng phía AB · H trùng G.

Các điểm brief nhắc riêng:
- B2 tự chứng minh từ △ABD = △ACD (theo B1): cạnh tương ứng cho D là trung điểm, góc tương ứng + kề bù cho góc vuông. Không dùng tính chất đường phân giác của tam giác cân.
- B6 (tiên đề Euclid): MN ∥ BC qua △AMN cân và góc đồng vị; NE ∥ BC qua △KNE = △KCD và góc so le trong; hai đường cùng qua N nên trùng nhau. Đúng.
- B9 (vuông góc duy nhất): AI ⊥ EF và DI ⊥ EF tại I, nên A, I, D thẳng hàng. Đúng.
- B12 (điểm phụ H): A nằm giữa B và H theo cách dựng; ∠AHC và ∠BAD đồng vị (C, D cùng phía AB) nên HC ∥ AD; theo tiên đề Euclid H trùng G. Cách này tránh phải chứng minh G nằm sau A. Đúng.

| Bài | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| B2 | lí do | Thêm "(cmt)" cho 2 dòng cuối phần góc; "Vậy AD ⊥ BC" thêm "(định nghĩa hai đường thẳng vuông góc)"; tách câu "tức là" | Brief bắt mọi mệnh đề có lí do |
| B3 | định dạng | Tách dòng kết luận (64 ký tự) thành 2 dòng | Dòng dài quá 60 ký tự |
| B4 | định dạng / lí do | Tách dòng "tia BD trùng tia BC…" (dòng dài, "(gt)" đặt sai chỗ); thêm "(cmt)" | Dòng dài; lí do phải gắn vào dữ kiện "D thuộc cạnh BC" |
| B6 | thiếu cơ sở / định dạng | Nêu cơ sở "K thuộc NC và K nằm giữa D, E" cho câu E, D khác phía NC; bỏ lí do kép ở "KN = KC"; tách 3 dòng dài; thêm "(cmt)" cho câu cùng song song | Brief bắt nêu cơ sở cho khác phía; dòng dài |
| B9 | thiếu cơ sở / định dạng | Thêm "I nằm giữa E và F (trung điểm)" trước câu kề bù; thêm "(cmt)" cho câu 90°; bỏ lí do kép; tách dòng lí do dài | Kề bù cần I nằm giữa; mỗi mệnh đề phải có lí do |
| B10 | thiếu cơ sở / lí do | Thêm "K nằm giữa E và F (cmt)" trước câu kề bù; thêm lí do cho câu 90° và câu kết | Như B9 |
| B11 | thiếu cơ sở / định dạng | Câu "K ≠ A" viết `\ne` (máy kiểm đọc nhầm thành `\n` lộ ra) và không có lí do ⇒ viết lại "K thuộc AD (gt), K khác A (theo B10)"; tách dòng kết luận dài | Tránh `\n` giả; nêu cơ sở |
| B12 | định dạng | Tách dòng "Khi đó A nằm giữa B và H…" (72 ký tự) | Dòng dài |

Kiểm cuối bằng node: JSON hợp lệ · 13 bài, đúng `ma`/`so`/thứ tự · không có `\n\n` · không có `\\n` lộ ra · số `$` chẵn · không có từ cấm.

Ghi chú (không sửa): B5/B6/B7/B10 chỉ chứng minh M (E) không thuộc tia đối của tia AB. Trường hợp M ≡ A bị loại ngầm vì ∠BAD < 90°. Đây là mức chặt thường gặp ở lớp 7, nên giữ nguyên.
