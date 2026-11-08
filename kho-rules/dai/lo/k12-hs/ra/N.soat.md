KẾT LUẬN: ĐẠT

Soát lý thuyết NHÓM cây v2 K12 Hàm số — 3 tệp `ra/N1.txt`, `ra/N2.txt`, `ra/N3.txt` · 14 nhóm (P1.2, P1.4, P1.6, P1.9, P3.3 · P2.1, P2.2, P2.3, P2.5, P2.6 · P2.7, P2.8, P2.9, P2.10) · 17 chỗ sửa · bản gốc `ra/N1.goc.txt`, `N2.goc.txt`, `N3.goc.txt`.

- **Đối chiếu dạng:** mỗi nhóm đọc cạnh lý thuyết nhóm v1 liên quan và lý thuyết của từng dạng con (khối `=== H…` trong `ra/J*.txt`, theo trường thứ 5 của `cau-truc.mjs`). Ký hiệu đã thống nhất với dạng: $\Delta'=b^2-3ac$; $y=\alpha x+\beta+\dfrac{\gamma}{x-x_0}$ và tiêu chí $\alpha\gamma$; $p+q$ và $2k+1$; $K,k$ cho $|f+m|$; $y_I+\dfrac{K}{x-x_I}$.
- **Kiểm bằng máy** (`tam/soat-N/kiem-toan.mjs`, độc lập trạm soạn, quét lưới số): số cực trị bậc ba theo $\Delta'$ cùng tâm $x=-\dfrac{b}{3a}$ là trung điểm hai cực trị và Viète (300 bộ hệ số ngẫu nhiên); trùng phương 3/1 cực trị theo dấu $ab$ và chiều cao $\dfrac{b^2}{4|a|}$ (300 bộ); bậc hai/bậc nhất có 2 cực trị ⇔ $\alpha\gamma>0$, hai cực trị nằm hai bên tiệm cận đứng, tâm $I(x_0;\alpha x_0+\beta)$ (200 bộ); $|f|$ có $p+q$ cực trị, $f(|x|)$ có $2k+1$ cực trị; $\max|f+m|$, $\min|f+m|$ (33 giá trị $m$); $d_1d_2=|K|$ và điểm đối xứng qua $I$. Tất cả đều đúng.
- **Khuôn:** `kiem.mjs` cho cả 3 tệp lỗi 0, cảnh báo 0. N2, N3 đã thêm dòng trống giữa các khung (##TC/##PP/##CY) cho giống N1 và mẫu.

| Mã nhóm | Loại lỗi | Sửa gì |
|---|---|---|
| P1.9 | toán | Định nghĩa tiệm cận xiên ghi "$\lim_{x\to\pm\infty}$" (dễ đọc thành cả hai phía) ⇒ "$x\to+\infty$ **hoặc** $x\to-\infty$", khớp nhóm P1.8 |
| P3.3 | toán | ##PP bước 1 chỉ nêu dạng $y_I+\dfrac{K}{x-x_I}$ ⇒ thêm dạng $\alpha x+\beta+\dfrac{K}{x-x_I}$ (bài tiệm cận xiên cũng nằm trong nhóm) |
| P3.3 | toán / lệch dạng | Bẫy "điểm nguyên: $x-x_I$ là ước của $K$" sai khi $K$ không nguyên hoặc mẫu $cx+d$, $c\ne\pm1$ ⇒ viết lại theo dạng P3.3.3: $x+d$ là ước nguyên của số dư $r$, lấy cả ước âm, với $c\ne\pm1$ chỉ là điều kiện cần |
| P2.1 | khớp dạng | Nêu rõ **bốn dáng** đồ thị (theo dấu $a$ × có/không cực trị) như dạng P2.1.1; bỏ ví von "chữ N" |
| P2.1 | toán | Dấu của $b$, $c$ từ vị trí cực trị phải **kết hợp dấu $a$** (dạng P2.1.3) — câu cũ thiếu |
| P2.1 | đặc trưng loại hàm | Thêm "$I$ thuộc đồ thị"; ##PP bước 2 thêm tâm đối xứng khi vẽ; dấu $a$ đọc theo **nhánh bên phải** (thống nhất với dạng) |
| P2.2 | toán | "Số giao điểm với $Ox$: 0, 1, 2 hoặc 3" sai — hàm bậc ba luôn cắt $Ox$ ⇒ "1, 2 hoặc 3", nêu rõ 2 giao điểm là khi tiếp xúc tại cực trị (nghiệm kép) |
| P2.2 | toán | "$y_{\text{CĐ}}>y_{\text{CT}}$ (khi $a>0$)" — điều kiện thừa, sai nghĩa (bảng đếm nghiệm đúng cho cả $a<0$) ⇒ bỏ "(khi $a>0$)" |
| P2.2 | toán | ##PP tâm đối xứng "trung điểm hai điểm đối xứng" ⇒ "trung điểm hai điểm cực trị", thêm tung độ $y\left(-\dfrac{b}{3a}\right)$; ##TC thêm hoành độ $-\dfrac{b}{3a}$ và $I$ nằm trên đồ thị |
| P2.2 | trình bày | Bẫy 2 lặp ý bẫy 1 ⇒ thay bằng bẫy thật "cực đại, cực tiểu không phải GTLN, GTNN; bậc ba trên $\mathbb{R}$ không có GTLN, GTNN" (từ nhóm v1 H5.4) |
| P2.3 | toán | "Vị trí hai cực trị (cùng phía đường thẳng…) quy về tổng, tích" sai — điều kiện về điểm cực trị cần thêm tung độ ⇒ tách: hoành độ quy về $S,P$; vị trí điểm cần $y_1,y_2$ (khớp dạng P2.3.5); ##PP bước 3 sửa theo |
| P2.5 | khớp dạng / đặc trưng loại hàm | Hàm bậc hai/bậc nhất viết lại bằng ký hiệu của dạng P2.5.2 $y=\alpha x+\beta+\dfrac{\gamma}{x-x_0}$, thêm tiêu chí cực trị $\alpha\gamma>0$ / $\alpha\gamma<0$, bốn dáng, tâm $I(x_0;\alpha x_0+\beta)$; hàm bậc nhất/bậc nhất thêm giới hạn ở $\pm\infty$, toạ độ tâm $I$, "hai dáng" |
| P2.5 | trình bày | ##PP nhận dạng mở rộng cho cả bậc hai/bậc nhất (tiệm cận xiên, $\alpha\gamma$); bẫy 3 yếu ⇒ "tâm đối xứng của phân thức không nằm trên đồ thị (khác bậc ba)" |
| P2.6 | toán | "Tử và mẫu có nghiệm chung ⇒ hàm trở thành bậc nhất trên bậc nhất" **sai**: bậc hai/bậc nhất rút gọn thành **hàm bậc nhất** (đường thẳng khuyết một điểm), không tiệm cận đứng, không cực trị — khớp dạng P2.6.3, P2.6.4 |
| P2.6 | thiếu ý | Nhóm có dạng P2.6.3 (bậc hai/bậc nhất đơn điệu) mà lý thuyết chỉ nói nhất biến ⇒ thêm ý "dấu $y'$ là dấu tử số tam thức" vào ##TC và ##PP |
| P2.7 | thiếu ý | Thêm hệ quả "$u$ đồng biến thì $g$ cùng chiều $f$, $u$ nghịch biến thì ngược chiều" — cơ sở cách đặt $t=u(x)$ (dạng P2.7.3) mà brief yêu cầu; bẫy "$u$ bậc hai mỗi $t$ cho hai $x$" sửa: trừ giá trị tại đỉnh |
| P2.8 / P2.10 | toán | P2.8: điều kiện $2k+1$ "f xác định tại 0" ⇒ "$f$ xác định trên $\mathbb{R}$, $x=0$ luôn là cực trị của $f(|x|)$" (khớp dạng P2.8.2). P2.10: thêm ca $|f(x)|=0$ và ca $L+m=0$ không có tiệm cận ngang |

Không sửa: P1.2, P1.4, P1.6 (đúng toán, khớp dạng, ở mức bức tranh chung); P2.9 (công thức $|f+m|$, cô lập tham số, $T$ của $a\sin x+b$ đã kiểm bằng máy).

## Cần CEO xem

- **P2.1.1 (H5.1.1), P2.1.2 (H5.2.1), P2.5.7 (H4.5.1, bẫy):** lý thuyết DẠNG vẫn viết "điểm uốn", "$y''=0$" cho tâm đối xứng bậc ba; nhóm P2.1/P2.2 viết theo brief là $x=-\dfrac{b}{3a}$, không dùng điểm uốn. Hai bên chưa mâu thuẫn về kết quả nhưng khác cách phát biểu — Thùy chốt có bỏ "điểm uốn" khỏi tệp dạng không (trạm soát nhóm không sửa tệp J).
- **P2.2 / P2.5:** dạng P2.2.1 (H5.4.1) và P2.2.3 (H5.4.3) có cả hàm phân thức (đọc tiệm cận, tâm là giao hai tiệm cận) trong khi tên nhóm P2.2 là "Hàm bậc ba"; tâm đối xứng phân thức đã có ở P2.5.7. Có nên lọc ví dụ phân thức khỏi P2.2 không.
- **P2.6:** dạng P2.6.2 (H1.5.3) gồm cả **hàm bậc ba** đơn điệu trên một khoảng, nằm trong nhóm "Hàm phân thức"; nhóm không viết lý thuyết bậc ba ở đây. Có nên tách phần bậc ba sang P2.3.
- **P2.3:** hàm trùng phương không nằm trong danh sách hàm khảo sát của CT 2018 (chỉ bậc ba, bậc nhất/bậc nhất, bậc hai/bậc nhất); nhóm vẫn giữ vì cây có dạng P2.3.6.
