KẾT LUẬN: ĐẠT

# Soát nbv-b3-f — NBV Hàm số liên tục, phần F (nâng cao)

- Số câu: **32** (22 bài nguồn, tách ý 1a–d, 2a–d, 6a–b, 13a–b, 21a–b, 22a–b; đủ, không thiếu/thừa) · giảng 0 · luyện 32 · Đ/S 0 · không câu nào bỏ vì hình (nguồn không có `[[img:…]]`).
- Lệch Pha 1 (giải mù `nbv-b3-f.kiem.md`) so với bản soạn: **trước 0 / sau 0**. Mọi kết luận (liên tục / gián đoạn, a = 1/16, không có a, −1/12, 0, 5, m = −2, −2/2019, a = 1, m = 1/6, các chứng minh có nghiệm) trùng bản giải mù, tính bằng máy (`scratchpad/blind.mjs`; câu 19, 20 thử ngẫu nhiên 2·10⁵ bộ hệ số).
- `kiem.mjs` (kể cả bộ quét LaTeX hỏng): ✔ đạt trước và sau sửa.
- Bản gốc: `nbv-b3-f.goc.json`.

## Đối chiếu các điểm trạm soạn nêu (đều xác nhận bằng nguồn `.txt` + máy)
- **6b** đề sách in $\sqrt{x-1}$ ở nhánh $x>0$ (dòng [0062]), lời giải sách dùng $\sqrt{x+1}$ ([0068]–[0070]) ⇒ sửa đề thành $\sqrt{x+1}$ là lỗi in hiển nhiên có đáp án rõ; Phần 2 có dòng "Lưu ý". Giới hạn phải = 3/2 = f(0) (máy). Đồng ý.
- **1d** sách viết lim phải = lim(3x+1) = −2 ([0016]); đúng là −1. Kết luận không đổi. Đồng ý.
- **2b** sách ghi lim trái = −∞ ([0026]); máy: g(1−10⁻⁶) ≈ +1,4·10⁶ ⇒ +∞. Kết luận "không có a" không đổi. Đồng ý.
- **7** sách in $x^2+x+1$ ở dòng xét (1;+∞) ([0079]); bản soạn dùng $x^3+x+1$ theo đề. Đồng ý.
- **11** sách bỏ sót điểm ghép x = 9; bản soạn bổ sung (lim trái = lim phải = f(9) = 1/3, máy xác nhận). Đồng ý.
- **13a** sách kết luận nhầm khoảng (−2;5) ([0131]); **13b** sách in f(0)·f(10) ([0135]). Bản soạn sửa đúng. Đồng ý.
- **22a** sách viết "f(0)·4f(1/2) = a+2b+5c" ([0224]) — đúng phải là TỔNG $f(0)+4f(\frac12)$; bản soạn giải bằng tổng, suy ra $f(\frac12)=-\frac14f(0)$. Đồng ý.
- **15** dùng "phương trình bậc 5 có không quá 5 nghiệm" — đúng như sách ([0157]); câu 18 dùng tương tự cho bậc 3. Kiến thức nền chấp nhận được (định lí số nghiệm đa thức), không thuộc danh mục CẤM; đáp số máy: đếm đổi dấu trên [−3;3] = 5.
- **5** (nặng): thêm bớt $2t+1$, liên hợp bậc ba + bậc hai — kiểm từng dòng: $(6t+1)-(2t+1)^3=-12t^2-8t^3$ ✓, hai giới hạn −4 và 2 ✓, tổng −2 ✓ (máy −1,999 tại t=10⁻⁴). Không L'Hôpital/đạo hàm.

## Bảng lỗi đã sửa
| id | lỗi | sửa gì |
|---|---|---|
| nbv-b3-f-15 | định dạng (Phần 1 Bước 2 dùng `\tfrac`, brief quy định `\dfrac`) | `\tfrac32`, `\tfrac12` → `\dfrac` |
| nbv-b3-f-20 | định dạng (Phần 1 Bước 1 `\tfrac12`) | → `\dfrac12` |

Không có lỗi đáp số / đề / tách ý / dạng / phạm vi.

## Soát thêm (không cần sửa)
- (b) Tách ý đúng luật: các ý a–d mỗi ý một hàm riêng ⇒ tách; `vai` đều `luyen` (phần F không có mục "Ví dụ").
- (c) Dạng: 1a–1d → NDB01188 (hàm nhiều công thức, dạng sau thắng NDB01187) · 2a–2d, 3, 4, 5 → NDB01191 (tham số một nhánh; 2b "vừa") · 6a, 6b, 7, 8 → NDB01196 · 9 → NDB01195 "vừa" · 10, 11 → NDB01197 · 13a, 13b → NDB01199 · 12, 14, 15 → NDB01200 · 16–18, 21a, 21b → NDB01201 · 19, 20, 22a, 22b → NDB01201 "vừa" (ràng buộc giữa hệ số a,b,c — bản đồ không có dạng riêng "phương trình có hệ số thoả hệ thức"; hợp nhất là NDB01201). Hợp lý.
- (d) Phần 1 không lộ đáp số cuối ở các câu tìm tham số (chỉ nêu cách đặt điều kiện); Phần 2 mỗi phép một dòng, kết "Vậy …"; dấu nhân `\cdot`; không `\left`/`\right`, không `\times`.
- (g) `kiem` tính lại từ đề: giới hạn hai phía ở x₀ ± 10⁻⁵, câu tham số quét m ∈ [−10;10], câu 19/20/22a quét lưới (a,b) và kiểm hệ thức + dấu, 15 đếm đổi dấu thật — không tautology.

## Câu CÒN nghi cần CEO
- **nbv-b3-f-19, 20, 22a, 22b** — xếp NDB01201 "vừa": đây là dạng "phương trình có hệ số thoả một hệ thức tuyến tính / hệ số dương đối xứng", khác kiểu "tham số m" của NDB01201. Nếu Thùy muốn tách dạng riêng thì bản đồ đang THIẾU dạng này.
- **nbv-b3-f-15, 18** — dùng "đa thức bậc n có không quá n nghiệm" để chặn trên (giống sách). Nếu Thùy coi đây ngoài whitelist lớp 11 thì cần đổi đề thành "ít nhất 5 / 3 nghiệm".
