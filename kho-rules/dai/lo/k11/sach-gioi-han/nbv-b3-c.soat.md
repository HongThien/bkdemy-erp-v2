KẾT LUẬN: ĐẠT

# Soát nbv-b3-c — NBV Hàm số liên tục, phần C (trắc nghiệm)

- Số câu: **68** (từ 82 câu nguồn), cả 68 câu là `luyen` · `trac_nghiem`, 0 Đ/S, 0 câu chưa có dạng.
- Lệch đáp số so với Pha 1 (giải mù, `nbv-b3-c.kiem.md`): **trước 0 / sau 0**. Câu 56 Pha 1 ghi "A hoặc D" (đề có 2 phương án đúng), bản soạn chọn A theo sách.
- `kiem.mjs` (kể cả bộ quét LaTeX hỏng): ✔ đạt trước và sau khi sửa. Bản gốc: `nbv-b3-c.goc.json`.

## Đối chiếu nguồn (`don-vi/nbv-b3-c.txt`)
- **14 câu BỎ: đã xác nhận đúng.** Cần hình: 6, 14, 31, 43, 49, 68, 72, 73 (đề phụ thuộc đồ thị). Mất công thức (`EQ-FAILED`): 7, 19, 22, 42, 57. Câu 79: $\dfrac{1-\cos x}{x^2}$ cần giới hạn $\dfrac{\sin x}{x}$ (ngoài phạm vi).
  - Ghi chú cho CEO: câu 42 và 57 dựng lại được trọn công thức từ lời giải sách (42: $\dfrac{x^3+8}{4x+8}$ khi $x\ne-2$, $f(-2)=3$; 57: $m^2x^2$ khi $x\le2$, $(6-m)x$ khi $x>2$); câu 7/19 (trùng nhau) và 22 chỉ dựng được một phần (không chắc dấu $<$/$\le$ ở điểm nối) ⇒ để BỎ là đúng luật "thà bỏ trống".
- Câu 23: sách in "liên tục tại $x=1$", lời giải sách xét $x=-1$ (nhánh chứa $a$ là $x\le-1$) ⇒ sửa chữ đề thành $x=-1$ là lỗi in hiển nhiên — ĐỒNG Ý.
- Câu 36: lời giải sách chép phương án D là $\dfrac{1}{\sqrt{2-x}}$, đề in $\dfrac{1}{\sqrt{1-x}}$ — đáp án A không đổi — ĐỒNG Ý.
- Câu 67: xác nhận đề in mệnh đề II KHÔNG có "liên tục" (sách vẫn coi II đúng ⇒ B). Theo đề in chỉ III đúng ⇒ **A** — ĐỒNG Ý.
- Câu 82: sách tô D (Bước 3) nhưng lời giải sách kết "Vậy bước 2 sai" ⇒ **B** — ĐỒNG Ý.
- Trùng đề xác nhận: 17=15, 71=1 (đảo phương án), 74=36 (đảo), 78=37 (đảo), 80=40 (đảo); 82≈24 (đổi tên bạn, đảo phương án).
- Đề chuẩn hoá giữ nghĩa sách (số, dấu, ngoặc, nhánh $<$/$\le$) — soát hết 68 câu, không thấy lệch.

## Phân xử bằng máy (quét từng phương án)
Giới hạn hai phía tại điểm ($x_0\pm10^{-7}$) cho 3, 8, 23, 26, 27, 29, 30, 39, 41, 66; dò dấu đa thức trên lưới cho 16, 34, 59, 35D. Câu tham số: `kiem` thay từng phương án và chỉ phương án đúng cho liên tục. Câu nhiều phương án đúng: `kiem` câu 56 cho `true,false,false,true` (A và D cùng đúng), câu 55 cho thấy $[1;3]$ là tập xác định (nên cả $(1;3)$ cũng đúng), câu 5 cho thấy mẫu luôn dương (cả 4 khoảng đúng).

## Bảng sửa
| id | lỗi | sửa gì |
|---|---|---|
| 1, 11, 15, 17, 28, 36, 44, 48, 54, 64, 70, 71, 74, 76, 81 | lời giải — Phần 1 KHUÔN CHUNG: cả 15 câu cùng Bước 1 "Tìm tập xác định của từng hàm số trong bốn phương án.", Bước 2–3 gần như chép nhau | Viết lại Phần 1 riêng từng câu: gọi đúng biểu thức của câu đó (căn nào, mẫu nào, hàm lượng giác nào, điểm/khoảng nào); không nêu kết luận, không loại trừ thay học sinh |
| 13, 52, 62 | lời giải — Phần 1 khuôn chung ("Tìm điều kiện xác định / Xác định điểm bị loại / Đối chiếu với bốn phương án") | Viết lại theo đúng hàm của câu (tử hằng 2025; tử $x+2$ không ảnh hưởng; liệt kê 4 điểm cần thử) |
| 32, 40, 56, 61, 65, 69, 80 | lời giải — Phần 1 khuôn chung cho bài "khoảng liên tục của phân thức" | Viết lại: phân tích đúng mẫu của câu, liệt kê đúng 4 khoảng, nhắc đầu mút khoảng mở; câu 56 thêm bước "nhiều khoảng cùng thỏa thì chọn khoảng lớn nhất (như sách)" |
| 78, 82 | lời giải — Phần 1 chép y câu trùng (37, 24) | Viết lại riêng (vẫn đúng bài, khác lời) |
| 10 | lời giải — "năng suất cao nhất là 50" trong khi $N(t)<50$ với mọi $t$ | Câu kết đổi thành "tiến dần tới (không vượt quá) 50…; theo đề, cao nhất là 50"; thêm `ghi_chu` |
| 15, 17 | dạng — `dang_bai_ly_do` sai nghĩa ("tan x không xác định tại mọi điểm") | Sửa: "tan x không xác định tại x=π/2+kπ" |
| 66 | dạng — `dang_bai_ly_do` "đề in hơi khó đọc" (không phải lý do dạng) | Sửa thành lý do dạng |

Không sửa: đáp án (0 câu), đề, `vai`, `loai_cau`, mã dạng (đối chiếu `dich.md`: 01187/01188/01191/01193/01195/01196/01197/01198/01199/01200/01185 đều đúng kiểu bài, luật dạng sau thắng đã áp: 12/20/29/38/41 "liên tục trên ℝ" ⇒ 01197; 5 thực tế ⇒ 01198). `kiem` không có tautology: mỗi câu tính lại từ đề (giới hạn số hai phía, `fin()` tại điểm, quét 4 phương án). Phạm vi: không L'Hôpital, không đạo hàm, không $\sin x/x$.

## Quyết định về "Lưu ý" ở câu 5, 55, 56
GIỮ dòng "Lưu ý: đề sai — …" đầu Phần 2 và chọn theo sách (5 → D toàn bộ $\mathbb{R}$; 55 → A $[1;3]$; 56 → A $(1;3)$): đúng luật Thùy 24/10 (giải bình thường, ghi rõ đề sai ở `ghi_chu` + dòng Lưu ý). Lựa chọn của sách là phương án "lớn nhất", nhất quán ở cả ba câu.

## Câu CÒN NGHI cần CEO
| id | lý do | sách | bản soát |
|---|---|---|---|
| 67 | Đề in II thiếu giả thiết "liên tục" | B (2 mệnh đề: II, III) | A (chỉ III) — nếu đề gốc II có "liên tục" thì B |
| 82 | Sách tô D nhưng lời giải sách nói "bước 2 sai" | D | B |
| 5, 55, 56 | Nhiều phương án cùng đúng (5: cả 4; 55: A, B; 56: A, D) | D / A / A | giữ theo sách + Lưu ý; Thùy chọn: giữ trong kho hay bỏ |
| 18 | Cước taxi hiểu theo bậc thang (1 km đầu 20 000 + 2 km × 15 000 = 50 000); hiểu "cả chuyến theo mức 1<x≤25" sẽ ra 45 000 (phương án A) | B | B (giống sách), đề hơi mơ hồ |
| 17, 71, 74, 78, 80 | Trùng đề với 15, 1, 36, 37, 40 | — | giữ cả; Thùy chọn có bỏ bản trùng không |
| 42, 57 (đã BỎ) | Dựng lại được công thức từ lời giải sách | — | đang bỏ; nhập lại nếu Thùy muốn |
