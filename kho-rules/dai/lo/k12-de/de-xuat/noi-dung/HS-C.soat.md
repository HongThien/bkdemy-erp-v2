KẾT LUẬN: ĐẠT

Lượt HS-C · nhóm C1.3 + dạng C1.3.1–C1.3.6 · trạm soát Opus · 03/11

- 1 nhóm · 6 dạng · 12 ví dụ (17 ý) đã kiểm bằng máy · 4 hình đã kiểm · 11 chỗ đã sửa.
- Bản gốc trạm soạn: `noi-dung/HS-C.goc.txt`.
- Máy kiểm `kiem-moi.mjs HS … C1.3,C1.3.1…C1.3.6`: lỗi 0, cảnh báo 0 (cả trước và sau khi sửa).
- Script soát độc lập: `S\soat\HS-C\kiem.mjs` — quét 2 triệu điểm trên từng miền (đầu mở bị loại để thấy giá trị sát mép không đạt) cho mọi ví dụ, cho cả hai hàm vẽ hình C1.3.5 (gồm khung hình), và cho 9 câu đề thật C1.3.4. Hai ví dụ C1.3.6 chỉ có bảng: dựng hàm khớp bảng (nội suy Hermite đơn điệu qua các cột (−3;1),(−1;5),(2;−2),(4;3), kiểm đúng chiều mũi tên; bảng dấu lấy từ f′=(x+2)(x−1)(x−3), thêm một biến thể khác cùng bảng dấu) rồi đọc lại kết quả. Mọi đáp số khớp.
- Đối chiếu đề thi: `cau-dang.cjs HS <dạng>` — C1.3.1 (120 câu), C1.3.2 (61), C1.3.3 (49, đọc hết), C1.3.4 (20, đọc hết + giải lại bằng số), C1.3.5 (147), C1.3.6 (96, đọc hết).
- Đối chiếu sách: `S\sach\gtln\nbv_A.md` (NBV — lý thuyết + ví dụ SGK: định nghĩa, quy ước "không nói trên tập nào = tập xác định", quy trình trên đoạn gồm điểm f′ không tồn tại), `S\sach\gtln\tutam_P1.md` (Từ Tâm Dạng 1 đoạn, Dạng 2 khoảng), `S\sach\gtln\pnl_D1.md` (PNL Dạng 1 + "Lưu ý quan trọng": đồng biến/nghịch biến trên đoạn ⇒ GTLN, GTNN ở hai đầu mút). Công thức sách là ảnh WMF nên chỉ đối chiếu được phần chữ; lý thuyết khớp SGK.

| Mã | Phần | Loại lỗi | Sửa gì |
|---|---|---|---|
| C1.3.1 | lý thuyết dạng (CY) | trình bày (lặp nhóm) | Bỏ ý "loại nghiệm ngoài đoạn" (đã có ở CY nhóm); thay bằng bẫy đề hay ra: nghiệm vô tỉ $x=\sqrt7$ ($x^3-21x$ trên $[2;4]$, đáp án $-14\sqrt7$). |
| C1.3.2 | lý thuyết dạng (TC) | toán | "Đoạn chứa nghiệm mẫu thì không có GTLN, GTNN" là khẳng định quá (không đúng khi rút gọn được) và đề không hỏi; viết lại: đoạn không chứa nghiệm mẫu ⇒ liên tục ⇒ luôn có GTLN, GTNN. |
| C1.3.3 | ví dụ 2 | lạc đề thi (thiếu kiểu đề hay hỏi) | Thêm ý c) tập giá trị của $y=x+\sqrt{18-x^2}$ (kiểu "căn + bậc nhất", bình phương có điều kiện $x\ge0$) — đề hỏi nhiều ($x+\sqrt{25-x^2}$, $x+\sqrt{4-x^2}$, $\sqrt{x-1}+\sqrt{9-x}$) mà ví dụ chưa có, dù CY đã nhắc. |
| C1.3.4 | lý thuyết dạng (TC) | trình bày (lặp nhóm) | Bỏ 2 ý trùng TC/CY nhóm (khoảng có thể không có GTLN; đầu mở chỉ là cận). |
| C1.3.4 | lý thuyết dạng (TC) | toán | "(với điều kiện hàm cùng chiều biến thiên hai phía)" sai (quanh cực trị hàm đổi chiều); viết lại: hàm liên tục trên khoảng, chỉ một cực trị ⇒ đó là GTLN/GTNN. |
| C1.3.4 | lý thuyết dạng (TC) | lạc đề thi (thiếu) | Thêm: hàm đơn điệu trên khoảng mở thì không có GTLN, GTNN (đúng bẫy câu T112010402145). |
| C1.3.4 | ví dụ 2 b) | trình bày | Viết lại lập luận "không có GTNN" mạch lạc (câu cũ lẫn ngoặc "còn nhỏ hơn y(1)…"). |
| C1.3.5 | lý thuyết dạng (TC) | lạc đề thi (thiếu) | Mô tả gồm "đoạn/khoảng" và đề có nhiều câu trên $(-\infty;0)$, $(-\infty;-1)$, $(-3;4)$, $[0;+\infty)$; thêm ý đọc trên khoảng/nửa khoảng. |
| C1.3.5 | ví dụ 2 | lạc đề thi (thiếu) | Thêm ý b) GTLN, GTNN trên khoảng $(-1;3)$ cùng hình (đầu mở có cùng tung độ với cực trị nhưng GTLN/GTNN vẫn đạt tại $x=0$, $x=2$). |
| C1.3.6 | lý thuyết dạng (TC, PP, CY) | lạc đề thi | Bỏ ý "giả thiết thêm $f(a)<f(b)$" (không câu đề nào hỏi); thêm 3 ý đề hỏi thật: đơn điệu trên đoạn ⇒ GTLN/GTNN ở đầu mút; công thức $f'(x)$ + nghiệm bội chẵn không đổi dấu; mệnh đề "$\min_{(-\infty;-2)}f=f(-2)$" sai vì đầu mở. PP thêm bước cho công thức $f'(x)$. |
| C1.3.6 | ví dụ 1 b), ví dụ 2 | lạc đề thi | VD1 b) đổi đoạn $[2;4]$ (quá dễ) sang nửa khoảng $(-1;4]$ (kiểu đề $[-5;7)$, $(-3;5]$). VD2 viết lại: a) bảng xét dấu $f'$ + đúng/sai 3 mệnh đề max/min trên khoảng (kiểu T112010401112); b) $f'(x)=(x+1)^2(x-2)$, điểm đạt GTNN trên $[-3;3]$ (kiểu T112010401154). Hình bảng dấu đổi theo. |

## Cần CEO xem
- **T112010402145** (C1.3.4): $y=x^3-\dfrac{3x^2}{2}-6x-4$ trên $(-\infty;-1)$, đáp án kho C $=-\dfrac12$ — theo định nghĩa GTLN không tồn tại (hàm đồng biến, $-\dfrac12$ là giá trị tại đầu mở); không phương án nào đúng ⇒ đề nghị sửa đề (đổi thành $(-\infty;-1]$) hoặc thêm phương án "Không tồn tại".
- **T1120000005639** (C1.3.4, bậc ba trên $(-1;3)$) mà ghi chú trạm soạn nghi: đã kiểm, đáp án $x_0=0$ **đúng** — không cần sửa.
- **T1120000006307** (xếp ở C1.3.4) thực chất là hàm đơn điệu trên đoạn — nên chuyển sang C1.3.6.
- C1.3.5: các câu đề trên khoảng mở ($(-\infty;-1)$, $(-3;4)$…) dựa hình nên trạm soát không kiểm được đáp án; nếu muốn soát kiểu lỗi "đáp án = giá trị tại đầu mở" như T112010402145 thì cần người xem hình.
