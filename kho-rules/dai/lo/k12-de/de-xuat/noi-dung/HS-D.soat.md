KẾT LUẬN: ĐẠT

Trạm soát (Opus) — HS-D · 2 nhóm (C1.4, C1.5) · 8 dạng (C1.4.1–C1.4.6, C1.5.1, C1.5.2) · 16 ví dụ tự giải lại bằng máy (`S\soat\HS-D\kiem.mjs`: giới hạn hai phía/±∞ bằng số, a và b của tiệm cận xiên hai phía, quét dấu y′, cực trị, nghiệm, đối xứng tâm) · 8 hình đã dựng lại và nhìn (`S\soat\HS-D\hinh.png`) · 14 chỗ đã sửa. Máy kiểm `kiem-moi.mjs HS … <10 mã>`: lỗi 0, cảnh báo 0.

Đối chiếu đề thi: `S\soat\HS-D\C1.x.x.txt` (toàn bộ câu đã xếp vào từng dạng: 183 · 43 · 160 · 83 · 102 · 24 · 9 · 3 câu).
Đối chiếu sách: `S\sach\hsd\nbv-tc-lt.md` (NBV 12-4 lý thuyết tiệm cận), `nbv-ct-lt.md` (NBV cực trị), `pnl-tc-1..5.md` (PNL Bài 3), `S\txt\pnl\BAI 1…\Dạng 03_GV` (dùng y″ xét cực trị), hồ sơ `k12-hs/ho-so/hoso-tutam.md`, `hoso-nbv-1-2.md`, `hoso-nbv-5-6-7.md`, `hoso-pnl-3-5.md`.

## Chỗ đã sửa

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.4 | lý thuyết nhóm (##CY) | toán | "TCN và TCX không cùng tồn tại ở cùng một phía của trục Ox" → ở cùng một phía $x\to+\infty$ hoặc $x\to-\infty$ |
| C1.4.1 | lý thuyết dạng (##CY) | toán (thiếu quy ước) | Thêm quy ước $ad-bc=0$: đường thẳng khuyết một điểm, không TCĐ, $y=a/c$ vẫn là TCN theo định nghĩa SGK (NBV, Từ Tâm) |
| C1.4.2 | lý thuyết dạng | trình bày (lặp nhóm) | Bỏ ý "số TCN theo bậc" và "TCĐ sau rút gọn" đã có ở nhóm; thay bằng quy tắc bội $k$/$l$ + mẫu vô nghiệm (đề có $(x-2)(x^2+1)$) |
| C1.4.2 | ##CY | trình bày | Rút gọn bẫy nghiệm bội để không lặp ##TC |
| C1.4.3 | lý thuyết dạng | toán/trình bày | "TCX là $y=px+q$ (cũng là TCĐ $x=-n/m$)" sai nghĩa → tách TCX và TCĐ; thêm quy ước dư $r=0$ |
| C1.4.3 | ##CY | toán | "$a$ ở hai phía thường khác dấu" sai (ví dụ 2b cho $a=3$ và $a=1$) → "khác nhau, có thể có hai TCX" |
| C1.4.4 | lý thuyết dạng | toán | "luôn có một TCĐ và một TCN/TCX" → thêm điều kiện $ad-bc\ne0$, tử không chia hết cho mẫu |
| C1.4.6 | lý thuyết dạng | lạc đề thi | Bỏ ý "tập xác định bị chặn" (đề không hỏi); thêm ý hàm $kf(x)+m$ (đề T1120000006377) |
| C1.4.6 | ##PP, ##CY | lạc đề thi | Bước 3 thay bằng xử lý $kf+m$; bẫy thay bằng "hai giới hạn một phía bằng nhau hữu hạn ⇒ không TCĐ" (đề T1120000005659) |
| C1.4.6 | ví dụ 2a | lạc đề thi | Thay bài tập xác định $(-3;2)$ bằng bài $h=3f-2$ có cả cột hai phía hữu hạn |
| C1.5 | lý thuyết nhóm | trình bày (lặp dạng) | Nhóm chép lại định nghĩa GTLN, định lý dấu y′, cực trị của C1.5.1 → viết lại thành "4 phương diện đọc trên BBT" + ##PP lập BBT |
| C1.5.1 | ##CY + ví dụ 1d | lạc đề thi | Bỏ ý $y=1/x$ nghịch biến trên tập xác định (đề không hỏi) → ý khoảng con (đề T112000000701), phản ví dụ $f=-(x-5)^2$; sửa kết luận a), d) đúng |
| C1.5.2 | lý thuyết dạng | lạc đề thi | Bỏ lý thuyết hàm $\frac{ax+b}{cx+d}$, $\frac{ax^2+bx+c}{mx+n}$ (cả 3 câu đề là bậc ba); thêm vị trí CĐ/CT theo dấu $a$, $I$ là trung điểm hai cực trị, bẫy nghiệm kép |
| C1.5.2 | ví dụ 2 + 2 hình | lạc đề thi | Bậc hai/bậc nhất → $y=-x^3+3x+2$ ($a<0$, cực tiểu nằm trên Ox, nghiệm kép); BBT + đồ thị dựng mới, khớp công thức |

Hình: 8/8 khớp đề và lời giải (C1.4.4: tiệm cận $x=1$, $y=1$; xiên $y=x-1$ qua $(1;0)$, $(3;2)$ · C1.4.5: hai BBT có hàm thật tương ứng, đọc ra 3 và 3 · C1.5.2: CĐ(1;2), CT(3;−2), I(2;0); CT(−1;0), CĐ(1;4), I(0;2), (2;0), (−2;4)). Nhãn "y=f(x)" ở C1.4.4 nằm sát nét đứt — thẩm mỹ, không ảnh hưởng.

## Cần CEO xem
- C1.4.1 / C1.4.3: quy ước $ad-bc=0$ (và dư $r=0$) đã chốt theo định nghĩa SGK — đường thẳng khuyết điểm có TCN/TCX là chính nó, không TCĐ. Một số tài liệu cũ nói "không có tiệm cận"; CEO xác nhận giữ quy ước SGK.
- C1.5.1: câu đề T112000000890 không chặt chẽ — đáp án A ("đạt cực trị thì đạo hàm đổi dấu") không đúng mọi hàm, B ("đạt cực trị thì $f'(x_0)=0$") đúng khi có đạo hàm tại $x_0$. CEO quyết sửa đáp án / thêm ghi chú câu đề.
- C1.5.1: giữ điều kiện đủ qua $f''$ (PNL dùng; đề có phương án "$f''(x_0)\ne0$") — CEO xem có muốn bỏ vì SGK 2018 chủ yếu dùng dấu $f'$.
