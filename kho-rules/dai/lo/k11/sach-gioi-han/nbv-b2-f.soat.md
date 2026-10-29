KẾT LUẬN: ĐẠT

- Số câu: 68 (bản soạn) → **75** sau soát (+7 câu bản soạn bỏ nhầm: 11a, 15c, 15d sửa đề hiển nhiên; 25b, 26c, 26d, 27a giải được không cần sin x/x). Tất cả `luyen`, tự luận.
- Lệch đáp số Pha 1 (giải mù 68 câu, node hai phía / x lớn): **trước 0 / sau 0**. 68/68 khớp bản soạn.
- `kiem.mjs` (kể cả bộ quét LaTeX hỏng): ✔ đạt, 0 lỗi LaTeX trước và sau sửa. `kiem` của từng câu đều tính lại từ đề (không tautology).
- Bản gốc trạm soạn: `nbv-b2-f.goc.json`. Script sửa: scratchpad `sua-b2f.mjs`.

## Đối chiếu các điểm trạm soạn nêu

| điểm | phán xử bằng máy | kết luận |
|---|---|---|
| 7a sách +∞ | √((x³+1)/(2x³+5)) tại x=1e6 = 0,70711 | đúng √2/2, giữ LỆCH SÁCH |
| 13c đề mx−1/4, lời giải sách mx+1/4 → m=0 | giới hạn phải = 0,25; theo đề in 2m−1/4=1/4 ⇒ m=1/4 | giữ m=1/4 + cờ (không biết đề hay lời giải in sai) |
| 14 sách c=1 | c=−1: f(1±0,01)≈−0,5; c=1: tử→2, giới hạn vô cực. Lời giải sách chọn nhánh c=−√(−k) rồi lại ghi c=√(−k)=1 | đúng a=2, b=−1, c=−1 |
| 23a lời giải sách làm ở x→−∞ | đề in x→+∞ hợp lệ, f(1e6)≈3,3·10⁵ | +∞, khớp sách |
| 12b, 27b có lượng giác | chỉ dùng 1−cos2x=2sin²x, sin²+cos²=1 | trong phạm vi, giữ |
| trùng 17e≡2e, 19d≡19b | đề giống hệt từng ký tự | giữ cả hai, có ghi_chu — Thùy chọn bỏ 1 hay không |
| 14 → NDB01174 vừa; 11b → NDB01181 | khớp mô tả dạng | giữ |

## Câu bỏ — xét lại (luật 24/10)

| câu | đề in | xét | quyết |
|---|---|---|---|
| 11a | x→4⁻, (4−x)√((2x+1)/(x³−64)) | x<4 ⇒ dưới căn âm (máy: NaN). Sửa 4⁻→4⁺ (hoặc x³−64→64−x³) đều ra 0 = sách | **THÊM, sửa x→4⁺**, NDB01181 vừa, cờ Thùy |
| 15a | x→−∞, −2x³+2x√x−x+1 | √x vô nghĩa; sửa thành +∞ thì ra −∞ ≠ sách +∞ ⇒ không có cách sửa hiển nhiên | bỏ |
| 15c | x→−∞, ∛(3x²+2x√x/5−4) | sửa thành +∞: ra +∞ = sách, lời giải sách chính là cách làm cho x>0 | **THÊM, sửa x→+∞**, NDB01179 vừa |
| 15d | x→−∞, −4/√(x³−4x+3) | x→−∞ thì dưới căn âm; sửa +∞: ra 0 = sách | **THÊM, sửa x→+∞**, NDB01179 vừa |
| 15e | x→−∞, √(2x²−x+1)/(x−√x) | sách cố ý |x|=−x ra −√2; sửa +∞ ra √2 ≠ sách ⇒ không hiển nhiên | bỏ |
| 23c | x→−∞, bản −∞ của 23a | √x vô nghĩa; sửa thành +∞ thì trùng hệt 23a | bỏ |
| 25a, 26a, 26b | sin x/(3x), (1−cos4x)/(2x²), sin²x/(2x²) | mẫu là đa thức x — buộc dùng sin x/x | bỏ (xác nhận ngoài phạm vi) |
| 25b | sin2x / sin(x/2) | = 4cos(x/2)cos x (nhân đôi 2 lần) → 4 = sách | **THÊM**, không dạng |
| 26c | (1−cos3x)/(1−cos5x) | hạ bậc + công thức cộng: (sin3u/sin u)→3, (sin5u/sin u)→5 ⇒ 9/25 = sách | **THÊM**, không dạng |
| 26d | (3−cos x−cos2x−cos3x)/(1−−cosx) | sửa "1−−cosx" → 1−cos x (in thừa dấu); 1+4+9=14 = sách | **THÊM**, không dạng |
| 27a | sin(x−π/3)/(1−2cos x) | mẫu = 1−cos t+√3 sin t, triệt sin(t/2) ⇒ 1/√3 (máy: 0,5773). **Sách ghi 0 — sai** (biến đổi 1−2cos(t+π/3)=2sin²(t/2+π/6) sai) | **THÊM**, LỆCH SÁCH √3/3, không dạng |

## Bảng sửa

| id | lỗi | sửa gì |
|---|---|---|
| 11a | đề (bỏ nhầm) | thêm câu, đề sửa x→4⁺, lời giải giữ dấu trừ khi đưa 4−x vào căn |
| 15c, 15d | đề (bỏ nhầm) | thêm câu, đề sửa x→+∞ |
| 25b, 26c, 26d | phạm vi (bỏ nhầm) | thêm câu, lời giải chỉ dùng công thức nhân đôi / hạ bậc / cộng |
| 27a | phạm vi (bỏ nhầm) + đáp số sách sai | thêm câu, LỆCH SÁCH √3/3 |
| 7a | định dạng | thêm dấu cách "Với $x>0$: $…" |
| 27b | lời giải (chữ) | "(khác 0 khi x gần 0 và khác 0)" → "(khác 0 khi x≠0 gần 0)" |

Dạng: 75 câu, 71 có dạng (khớp mô tả `dich.md`, không đổi câu nào của bản soạn), 4 câu `null` (25b, 26c, 26d, 27a) — **bản đồ THIẾU dạng "0/0 chứa lượng giác (biến đổi lượng giác rồi triệt nhân tử)"**; 27b đang xếp NDB01172 (nhân liên hợp) vừa.

## Còn nghi — cần Thùy

1. **11a / 15c / 15d** — đề đã sửa (4⁻→4⁺; −∞→+∞) vì đề in làm hàm không xác định; đáp số sau sửa khớp sách. Thùy xác nhận cách sửa hay bỏ.
2. **13c** — đề in `mx − 1/4` ⇒ m=1/4; lời giải sách dùng `mx + 1/4` ⇒ m=0. Không biết bên nào in sai; đang theo đề in.
3. **27a** — sách 0, máy √3/3. Đã kiểm 2 phía.
4. **14** — sách c=1, máy c=−1.
5. **Trùng đề 17e≡2e, 19d≡19b** — giữ cả hai hay bỏ một.
6. **4 câu lượng giác không dạng** — cần thêm dạng vào bản đồ, hoặc tạm xếp NDB01171 / bỏ.
