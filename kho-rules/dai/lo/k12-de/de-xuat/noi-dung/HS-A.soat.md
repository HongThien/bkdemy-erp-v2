KẾT LUẬN: ĐẠT (sau khi sửa)

Trạm soát Opus · 03/11 · tệp `HS-A.txt` (bản gốc trạm soạn: `HS-A.goc.txt`)

- 1 nhóm (C1.1) · 6 dạng (C1.1.1–C1.1.6) · 12 ví dụ kiểm bằng máy · 6 hình kiểm · 13 chỗ sửa.
- Máy kiểm khuôn `kiem-moi.mjs HS … C1.1,C1.1.1…C1.1.6`: lỗi 0 · cảnh báo 0 (trước và sau sửa).
- Script kiểm độc lập: `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad\soat-HS-A\thu.cjs` — y′ bằng sai phân + đối chiếu công thức, quét lưới dấu y′, giá trị cực trị đọc từ hình tính lại từ công thức vẽ, so sánh f(a), f(b) bằng tích phân số của f′. Tất cả khớp lời giải.
- Đối chiếu đề thật: `cau-dang.cjs HS <dạng>` (C1.1.1 118 câu · C1.1.2 26 · C1.1.3 163 · C1.1.4 114 · C1.1.5 86 · C1.1.6 28). Đối chiếu sách: hồ sơ `k12-hs/ho-so/hoso-nbv-1-2.md` (Đ6, Đ16, ghi chú ad−bc), `hoso-pnl-1-2.md`, `hoso-tutam.md`. Thư mục `S\txt\nbv\12-1` rỗng (chưa trích), PNL bài 1 chỉ có Dạng 03 (cực trị) — không có văn bản sách cho phần đơn điệu ngoài hồ sơ.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.1.1 | lý thuyết dạng | bám đề (thiếu) | Thêm $y'=\dfrac{ad-bc}{(cx+d)^2}$ cho hàm bậc nhất/bậc nhất (đề hỏi rất nhiều, vd $\frac{5x-9}{x-2}$) và $y'=2x(2ax^2+b)$ cho trùng phương (đề có $x^4-2x^2$). |
| C1.1.1 | ví dụ 1 | toán (đề sai) | "Biết hàm số nghịch biến trên khoảng $(a;b)$, tính $a+b$" không xác định duy nhất (mọi khoảng con của $(-1;3)$ đều nghịch biến) ⇒ đổi thành "khoảng nghịch biến có độ dài lớn nhất" như đề thật. |
| C1.1.1 | ví dụ 1 | trình bày (chép đề) | Hàm $x^3-3x^2-9x+5$ gần y nguyên câu đề T112010102062 ⇒ đổi sang $x^3-6x^2+9x+1$ (đáp số $a+b=4$); thêm ý b) $y=\frac{2x+1}{x-1}$ (dùng $ad-bc$). |
| C1.1.2 | lý thuyết dạng | bám đề (thiếu) | Đề hỏi nhiều $\log_2(x^2-2x)$, $\log_3(\dots)$, $(3/5)^{u(x)}$ mà lý thuyết chỉ có $\ln u$, $e^u$ ⇒ thêm $(\log_a u)'$, $(a^u)'$, quy tắc dấu theo cơ số; thêm $(\cot x)'$ và ý "tan, cot chỉ đơn điệu trên từng khoảng" (đề có $\cot 2x$). |
| C1.1.2 | ví dụ 1 a | bám đề | $\sqrt{x^2-2x-3}$ → $\sqrt{6x-x^2}$ (đề thật hầu hết là căn tam thức âm: $\sqrt{2024x-x^2}$, $\sqrt{3x-x^2}$, $\sqrt{8+2x-x^2}$). |
| C1.1.2 | ví dụ 1 b | chép đề + bám đề | $\frac12x^2+x-6\ln x$ trùng nguyên đề T112010102049 ⇒ thay bằng $\log_2(x^2-4x)$ (kiểu đề log tam thức, có bẫy tập xác định hai khúc). |
| C1.1.2 | ví dụ 1 c | chép đề | $(x-1)e^{2x}$ trùng nguyên đề T1120000005883 ⇒ $(x-3)e^x$. |
| C1.1.3 | lý thuyết dạng | bám đề (thừa) | Bỏ ý "so sánh $f(a)$, $f(b)$" ở ##TC và ##PP (không câu đề C1.1.3 nào hỏi); thay bằng "giá trị ở đầu mũi tên là $y$, không làm đầu mút khoảng" và "đếm số khoảng" (đề có câu trả lời ngắn "số khoảng nghịch biến"). |
| C1.1.3 | lý thuyết dạng ##CY | bám đề (thừa) | Bỏ vế "giá trị hai nhánh không so sánh"; viết lại bẫy nối khoảng qua cột kẻ đôi. |
| C1.1.3 | ví dụ 2 + hình | bám đề / độ khó | BBT nhất biến 2 nhánh + mệnh đề d) so sánh $f(-3)$, $f(3)$ (đề không hỏi) ⇒ BBT 4 khoảng có cực trị và cột kẻ đôi ở $x=1$ (dựng từ $f=(x-1)+\frac4{x-1}$: CĐ $-4$ tại $-1$, CT $4$ tại $3$), 4 mệnh đề đúng/sai đúng kiểu đề: nối qua kẻ đôi, "các khoảng $(-1;1)$ và $(1;3)$", khoảng vắt qua cực trị, đếm số khoảng. Khó hơn ví dụ 1. |
| C1.1.5 | lý thuyết dạng | lặp nhóm | Bỏ ý "$f'\ge0$, bằng 0 tại điểm rời rạc thì vẫn đồng biến" (đã có ở lý thuyết nhóm); thay bằng ý đề cho công thức $f'(x)$ (đề có $f'(x)=-x+1$). |
| C1.1.6 | ví dụ 2 | độ khó / bám đề | $x(x-1)^2(x+2)^3$ → $x^2(x+2)^3(2-x)$: thêm nhân tử $(a-x)$ (đề thật rất hay có: $(1-x)^2(x+1)^3(3-x)$, $(x-2)^2(1-x)$), hệ số bậc cao âm, nghiệm bội chẵn nằm giữa khoảng đồng biến; b) so sánh $f(-1)$, $f(1)$. |
| — | GHI CHÚ CHO CEO | — | Thêm một dòng tóm tắt việc trạm soát. |

Không sửa: lý thuyết nhóm C1.1 (đúng SGK: định nghĩa, định lí dấu $f'$, mở rộng "bằng 0 tại hữu hạn điểm"); C1.1.1 ví dụ 2; C1.1.2 ví dụ 2; C1.1.3 ví dụ 1; C1.1.4 cả hai ví dụ (hình khớp: CĐ $(0;2)$, CT $(2;-2)$; nhánh trái CĐ $(0;-2)$, nhánh phải CT $(2;2)$, TCĐ $x=1$); C1.1.5 cả hai ví dụ (tiếp xúc tại $-1$, cắt tại $2$, $f(-3)>f(-1)$); C1.1.6 ví dụ 1.

## Cần CEO xem

- C1.1.2: ví dụ 2 b) "chọn hàm đồng biến trên $\mathbb{R}$" trộn đa thức + mũ + log + lượng giác; đề thật xếp kiểu câu này ở cả C1.1.1 và C1.1.2 — giữ ở C1.1.2 như trạm soạn đề xuất.
- C1.1.5: đề có bảng xét dấu với "$f'$ không xác định tại $x=0$" (f liên tục) — lý thuyết chưa nói cách đọc ca này (f vẫn đơn điệu qua điểm đó nếu liên tục); chưa thêm vì chỉ 1 câu, CEO quyết có cần.
- C1.1.4: đề thật gần như toàn đồ thị bậc ba/bậc bốn; ví dụ 2 dùng đồ thị phân thức có tiệm cận đứng (đề có 1 câu kiểu này) — giữ vì là bẫy thật, CEO có thể đổi sang đồ thị bậc bốn.
