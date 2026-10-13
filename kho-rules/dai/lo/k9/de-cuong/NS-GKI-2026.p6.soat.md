KẾT LUẬN: ĐẠT

# NS-GKI-2026 · Phần 6 — biên bản SOÁT (13/10)

Phạm vi: B. Hình học, Bài 1 (a–d: sắp xếp tỉ số lượng giác tăng dần) và Bài 2 (a–d: tính giá trị biểu thức lượng giác) — trang 3 đề cương. Tất cả `kho=hgt`, không có hình (bài thuần số — `hgt\k9.md` §3).

- Số câu: **8** (2 trả lời ngắn · 6 tự luận).
- Khớp Pha 1 (giải mù, `NS-GKI-2026.p6.kiem.md`) ngay từ đầu: **8 / 8** — cả thứ tự sắp xếp của 4 ý Bài 1 lẫn giá trị của 4 ý Bài 2 ($0$; $3$; $\dfrac12$; $\dfrac72$).
- Số câu phải sửa: **4** (Bài 1a, 1b, 1c, 1d) · thêm `Chưa chắc`: **1** (Bài 2b). Không câu nào sai đáp số, không câu nào chép sai đề.
- Máy: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K9\NS-GKI-2026\tam\soat_p6.mjs` (`Math.sin`… theo độ: sắp xếp 4 dãy, kiểm từng đẳng thức góc phụ nhau và từng chuỗi so sánh trung gian, kiểm $\sin\alpha<\tan\alpha$ với mọi góc nhọn bước $0{,}5^\circ$, tính 4 biểu thức).
- Cổng `dung-de-tu-soan.mjs … --khoi 9 --chi-kiem`: ✔ đạt cổng (8 câu · 2 TLN · 6 tự luận · HGT 8 · chưa chắc 1).
- Bản trước khi sửa: `NS-GKI-2026.p6.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1a | định dạng | `dap_an=$\cos40^\circ<…$` → `dap_an=—` | Câu `tu_luan` thì `dap_an` phải là `—` (brief soạn 3.1, brief soát mục Phân loại); dãy đã sắp vẫn nằm ở câu "Vậy …" |
| Bài 1b | định dạng | `dap_an=$\cos34^\circ<…$` → `dap_an=—` | như trên |
| Bài 1c | định dạng | `dap_an=$\sin40^\circ<…$` → `dap_an=—` | như trên |
| Bài 1c | lập luận | Dòng đầu Phần 2 "Vì $\cot40^\circ=\tan50^\circ$ và … (hai góc phụ nhau)." → "Ta có …"; dòng sau "Ta có $42^\circ<…$ nên" → "Vì … nên" | Câu "Vì …" bị cụt, không có vế kết luận |
| Bài 1c | lập luận | "Cạnh huyền lớn hơn cạnh kề nên $\sin40^\circ<\tan40^\circ$" → nêu đủ: cùng cạnh đối, chia cho cạnh huyền (lớn hơn) thì được số nhỏ hơn chia cho cạnh kề; thêm căn cứ "(góc nhọn tăng thì $\tan$ tăng)" cho $\tan40^\circ<\tan42^\circ$ | Bước so $\sin$ với $\tan$ là chỗ khác loại tỉ số — phải có lí do chặt, không nhảy bước ($\tan42^\circ\approx0{,}90<1$ nên không so qua số $1$ được) |
| Bài 1d | định dạng | `dap_an=$\sin27^\circ<…$` → `dap_an=—` | như Bài 1a |
| Bài 1d | lập luận | Như Bài 1c (câu "Vì …" cụt; nêu đủ lí do $\sin27^\circ<\tan27^\circ$); tách "$\sin27^\circ<\tan27^\circ=\cot63^\circ$" thành hai dòng | như Bài 1c; mỗi phép suy luận một dòng |
| Bài 1d | định dạng (Phần 1 lộ đáp số) | Bước 3 "…rồi nối vào dãy ở vị trí nhỏ nhất" → "…rồi nối kết quả đó vào dãy các $\tan$ đã xếp" | Phần 1 không được lộ kết quả cuối ($\sin27^\circ$ là số nhỏ nhất của dãy) |
| Bài 2b | (thêm `Chưa chắc`) | Thêm dòng `**Chưa chắc:**` về thừa số $\cot30^\circ$ in hai lần | Trạm soạn và người gõ đề đều không ghi chú chỗ bất thường này — xem mục dưới |
| Cuối tệp | — | Sửa mục GHI CHÚ CHO NGƯỜI DUYỆT cho khớp (`dap_an=—`, thêm Bài 2b) | Ghi chú cũ nói `dap_an` ghi nguyên dãy — không còn đúng |

## Đã soát, giữ nguyên

- **Đề**: 8 câu khớp ảnh `trang\p-3.png` (đã phóng to 260 dpi — `z\soat6_b1.png`, `z\soat6_b2.png`): góc, loại tỉ số, số mũ, dấu $+$ / $-$ xen kẽ ở Bài 2c. Bài 1d đề in thừa một dấu phẩy cuối dòng — bản gõ bỏ, đủ 5 tỉ số. Ghi chú của người gõ ở Bài 2d (tên biểu thức $C$ trùng ý c; các góc cách đều $10^\circ$) — đúng, giữ.
- **Bài 1 (sắp xếp)**: cả 4 ý KHÔNG bấm máy lấy giá trị; đều đưa về cùng loại tỉ số bằng hai góc phụ nhau (có ghi căn cứ) rồi dùng "góc nhọn tăng thì $\sin$ / $\tan$ tăng". Chỗ khác loại: 1b so qua số $1$ ($\sin57^\circ<1$ vì cạnh góc vuông nhỏ hơn cạnh huyền; $\tan58^\circ>\tan45^\circ=1$) — chặt; 1c, 1d dùng $\sin\alpha<\tan\alpha$ suy từ định nghĩa (cùng cạnh đối, cạnh huyền lớn hơn cạnh kề) — chặt, đúng phạm vi Bài 11, không cần hệ thức $\tan\alpha=\dfrac{\sin\alpha}{\cos\alpha}$.
- **Bài 2 (tính giá trị)**: hai góc phụ nhau có ghi căn cứ; $\sin^2\alpha+\cos^2\alpha=1$ có ghi căn cứ trong ngoặc như `hgt\k9.md` §1; giá trị góc đặc biệt $\tan45^\circ$, $\cot30^\circ$, $\cos45^\circ$ đúng; $\sqrt3\cdot\sqrt3=3$ và $\left(\dfrac{\sqrt2}{2}\right)^2=\dfrac12$ là định nghĩa căn bậc hai số học lớp 7, không phải phép biến đổi căn thức Chương III. Bài 2d đếm đúng 7 số hạng (3 cặp phụ nhau + $\cos^245^\circ$).
- **Phân loại**: 2a (`0`), 2b (`3`) là `tra_loi_ngan` — đúng. 2c ($\dfrac12$), 2d ($\dfrac72$) để `tu_luan` vì đáp số tự nhiên là PHÂN SỐ (brief soạn 3.1 "phân số ⇒ `tu_luan`"; cùng cách với Bài 6n phần A có nghiệm $\dfrac52$) — giữ. Nếu CEO muốn tính là trả lời ngắn thì đổi `dap_an=0,5` và `3,5` (cổng nhận được).
- **Kiến thức cấm**: không `⇔`, không `\times`, không định lí sin / côsin, không hệ thức đường cao, không dùng giá trị gần đúng.
- **Phần 1**: mỗi câu 3–4 bước, là bước nghĩ thật, không chép Phần 2; sau khi sửa Bài 1d không còn chỗ lộ kết quả cuối.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 2b** — đề cương in $B=\tan45^\circ\cdot\cot30^\circ\cdot\cot30^\circ$, hai lần cùng thừa số $\cot30^\circ$ (đã phóng to, cả hai đều $30^\circ$). Lời giải theo đúng bản in: $B=3$. Viết lặp một thừa số là bất thường, có thể đề gốc định in $\cot30^\circ\cdot\cot60^\circ$ hoặc $\tan30^\circ\cdot\cot30^\circ$ (khi đó $B=1$). Không có căn cứ để tự sửa — CEO quyết giữ bản in hay sửa đề.
