KẾT LUẬN: ĐẠT

# GKI-13 — Biên bản soát (THCS Quán Toan, phường Hồng An, kiểm tra giữa kì I 2025–2026, Toán 8, đề 2)

- **Số câu:** 22 (12 trắc nghiệm · 3 trả lời ngắn · 7 tự luận) — đề gốc 18 câu (12 trắc nghiệm + 2 đúng sai + 4 trả lời ngắn) + 3 bài tự luận; Bài 1 tách 1a, 1b; Bài 2 (hình) và Bài 3 giữ chung; Câu 13, 14 (đúng sai) và Câu 18 nhập tự luận.
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 22 / 22. Không câu nào lệch đáp số (Câu 18: hai bên cùng ra $AO=5$ cm, cùng ra $5+2\sqrt{3}$ nếu dùng Pythagore, cùng kết luận đề lỗi).
- **Số câu phải sửa:** 6 / 22 (Câu 2, 9, 14, 18, Bài 2, Bài 3) — **không câu nào sai đáp số, không câu nào chép sai đề, không câu nào dùng kiến thức cấm**. 3 câu sửa lập luận (Câu 9, Câu 18, Bài 3), 2 câu gỡ `Chưa chắc` (Câu 2, Câu 14), 2 hình giải vẽ thêm (Câu 14, Câu 18), 1 ghi chú thừa xoá (Bài 2). Bản trước khi sửa: `GKI-13.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (sau khi sửa): 4 phần · 22 câu · 2 hình · 1 chưa chắc.
- **Máy kiểm của trạm soát:** `<LV>\tam\soat-mu.mjs` (Pha 1, viết trước khi mở bản soạn) + `<LV>\tam\soat-pha2.mjs` (tính lại các câu đáng ngờ: Câu 18 dựng toạ độ; Câu 14 dựng cả hình thang cân lẫn hình bình hành; Bài 3 vét cạn $|x|,|y|\le 500$; Bài 2 ba cỡ tam giác vuông).
- **Lượt soát này tiếp nối lượt trước bị ngắt sau Pha 1:** bảng giải mù `GKI-13.kiem.md` giữ nguyên, không ghi đè; đã mở lại hai ảnh trang + ảnh cắt 300 dpi (Câu 15–18, Hình 5) và tính lại bằng máy trước khi làm Pha 2.

## Đã soát gì

- **Đề:** đối chiếu từng câu với hai ảnh trang (đề có lớp chữ, in rõ): số, số mũ, dấu, phương án, tên điểm, đủ ý — khớp, không sót câu, không bỏ câu. Hai lỗi in của đề đã được sửa đúng và có `Ghi chú` (Câu 12 B "Có ai cạnh kề" → "hai"; Câu 14 a "là tứ hình thang" → "là hình thang").
- **Kiến thức:** không có đường trung bình, Thalès, đồng dạng, lượng giác, "phương trình – tập nghiệm" (kể cả dùng ngầm). Hằng đẳng thức dùng ở Câu 7, 17, Bài 1b — đề có hỏi tới (Câu 6, 7, 17). Hình chữ nhật, hình thoi, hình vuông dùng ở Câu 9, 11, 12, 16, Bài 2 — đề có hỏi tới. **Bài 2a** đi đúng luật "ba góc vuông": tổng các góc tứ giác $360^\circ$ ⇒ góc thứ tư vuông ⇒ bốn góc vuông (định nghĩa). **Bài 2b** — chỗ dễ trượt sang đường trung bình — đi qua hình bình hành $AHGC$ (hai đường chéo cắt nhau tại trung điểm mỗi đường) + tiên đề Euclid: đúng phạm vi. Pythagore chỉ xuất hiện trong dòng chú thích của Câu 18 (không dùng làm lời giải).
- **Lời giải:** đọc từng dòng 22 câu; Phần 1 đủ 3–6 bước; Bài 2 Phần 1 viết theo chiều phân tích đi lên ("muốn có …, cần …"), Phần 2 đi ngược lại, khớp từng mắt xích. Dấu nhân `\cdot` đúng.
- **Phân loại:** `kho` đúng (Câu 8–12, 14, 16, 18, Bài 2 = `hinh_hoc`; còn lại `dai`). Trả lời ngắn: Câu 15 ($5$), 16 ($60$), 17 ($1200$) — đúng dạng đề hỏi. Tách ý: chỉ Bài 1 (hai ý độc lập) — đúng luật.
- **Hình:** `p1c8_hang.png` (bốn hình của Câu 8 kèm nhãn Hình 1–4, không cụt) và `p1c9_1.png` (Hình 5, đủ bốn đỉnh và kí hiệu gạch, góc vuông) — đúng hình của câu. `giai_bai2.png` (trạm soạn vẽ bằng code): tam giác vuông tại $A$ dựng đúng ($AH^2=BH\cdot HC$), $D$, $E$ là chân đường vuông góc, $O$ là trung điểm $HC$ và $AG$, đủ 8 điểm, đánh dấu đúng giả thiết, **không nối $HG$** (điều phải chứng minh), nhãn không đè — giữ nguyên nội dung, chỉ nới canvas.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 18 | lập luận + ghi chú | Viết lại `Ghi chú` và `Chưa chắc`: đề **không thiếu dữ kiện** mà **lỗi số liệu** (so với đề 1). Phần 1 Bước 3–4 và `Chú ý`, Phần 2 hai dòng cuối viết lại; thêm dòng trong ngoặc ghi đáp số đúng $5+2\sqrt{3}\approx 8{,}46$ cm kèm chú thích "dùng định lí Pythagore — học ở học kì 2" | Bản soạn viết "đề thiếu dữ kiện", "các dữ kiện còn lại không đủ để tính $BD$" — sai về toán: tam giác $ABC$ biết ba cạnh (7, 5, 10 thoả bất đẳng thức tam giác) nên hình bình hành xác định duy nhất, $BD^2=48$. Cái đúng là: không tính được **bằng kiến thức tới giữa kì 1** |
| Câu 18 | hình | Vẽ thêm `giai_cau18.png` (hình bình hành dựng đúng $AB=7$, $BC=5$, $AC=10$, hai đường chéo cắt nhau tại $O$) | Bài hình nhập tự luận, đề không cho hình. Hình dựng đúng số đo cho thấy ngay đây không phải hình chữ nhật |
| Câu 9 | lập luận | Phần 1 Bước 1 và Phần 2 thêm "Gọi $O$ là giao điểm của $AC$ và $BD$"; `Chú ý` viết lại theo kí hiệu gạch (hai gạch ≠ một gạch nên hình không cho $AC=BD$); dòng hình thoi ghi rõ $AC\perp BD$ lấy từ kí hiệu góc vuông | Hình 5 của đề **không đặt tên** giao điểm hai đường chéo; bản soạn dùng $OA$, $OC$, $OB$, $OD$ mà chưa gọi $O$. `Chú ý` cũ lập luận bằng "trông không bằng nhau" |
| Câu 14 | gỡ `Chưa chắc` + lập luận + hình | Xoá dòng `Chưa chắc` ở ý b). Phần 2 ý b) thêm lí do $\widehat{A}+\widehat{B}=180^\circ$ (vì $AD\parallel BC$) và câu kết "chưa suy ra được hình thang cân". Vẽ thêm `giai_cau14.png` (hai hình cùng thoả giả thiết: hình thang cân và hình bình hành, đều có $\widehat{A}=60^\circ$, $AD=BC$) | Ý b) Sai là chắc chắn về toán: hai lượt giải độc lập + máy dựng cả hai hình cùng thoả giả thiết; đây là bẫy quen thuộc của bài hình thang cân. Cùng cách xử lí với GKI-12 Câu 14 |
| Câu 2 | gỡ `Chưa chắc` | Xoá dòng `Chưa chắc` "có tính $\dfrac{-8}{9}x^2y(2x-3)$ là đa thức không" | Tích của đơn thức với đa thức là một đa thức (nhân ra được tổng hai đơn thức — máy kiểm đồng nhất). Hai lượt giải cùng ra 3 (B); hai biểu thức bị loại đúng là hai biểu thức có biến ở mẫu |
| Bài 3 | lập luận | Phần 1 Mấu chốt + Bước 1–2 và dòng đầu Phần 2: đưa về tích bằng tính chất phân phối hai lần $xy-x+2(y-1)=x(y-1)+2(y-1)=(x+2)(y-1)$; "Ta có bảng:" → "Xét bốn trường hợp:" | Bản soạn tránh đặt thừa số chung nên phải "thử một tích dạng $(x+a)(y-1)$ rồi tìm $a$" — không phải bước nghĩ thật. Đặt thừa số chung theo tính chất phân phối là kiến thức lớp 6–7, luôn được dùng (brief soạn mục 4); đề viết sẵn $2(y-1)$ chính là gợi ý đó |
| Bài 2 | ghi chú + hình | Xoá dòng `Ghi chú` "Đề không cho hình; hình giải vẽ bằng code, không nối $HG$…"; nới canvas `giai_bai2.png` 420 → 430 px | `Ghi chú` chỉ dành cho lỗi của đề gốc / điều người duyệt cần biết. Lề dưới nhãn $G$ chưa đủ 35 px |
| Ghi chú cuối tệp | định dạng | Viết lại các dòng Câu 2, Câu 14, Câu 18, Bài 3 cho khớp bản đã sửa | — |

`<LV>\tam\ve.mjs` giờ vẽ cả ba hình giải (`giai_bai2`, `giai_cau14`, `giai_cau18`).

## Câu còn `Chưa chắc`

- **Câu 18** (đề gốc lỗi số liệu — phân xử theo yêu cầu riêng của lượt soát này):
  - Đọc lại ảnh phóng to 300 dpi: đề in đúng "$AB=7cm$, $BC=5cm$ và $AC=10cm$. Tính độ dài $AO+BO$", không kèm hình. Bản soạn chép đúng đề.
  - Trạm soạn báo "đề thiếu dữ kiện" là **chưa chính xác**. Dữ kiện đủ: hình bình hành xác định duy nhất, $AO=5$ cm, $BD^2=2(AB^2+BC^2)-AC^2=48$, $BO=2\sqrt{3}$ cm, $AO+BO=5+2\sqrt{3}\approx 8{,}46$ cm (hai lượt giải + máy dựng toạ độ ra cùng số; góc $ABC\approx 111{,}8^\circ$).
  - Phần đúng của trạm soạn: **không tính được trong phạm vi kiến thức của đề** — muốn ra $BO$ phải dùng định lí Pythagore (và căn bậc hai), KNTT học ở học kì 2, cả đề không có câu nào khác chạm tới; đáp số lại không gọn cho câu trả lời ngắn.
  - Nguyên nhân: đề 1 cùng trường (GKI-12, Câu 18) cho 8, 6, 10 — bộ ba Pythagore ⇒ hình chữ nhật ⇒ đáp số 10. Đề 2 đổi số thành 7, 5, 10 ($7^2+5^2=74\neq 10^2$) làm hỏng cấu trúc đó. Không biết đáp án của trường (có thể vẫn chấm 10 — sai).
  - Đã làm: giữ nguyên đề, nhập `tu_luan`, lời giải đi tới $AO=5$ cm bằng kiến thức đã học rồi ghi đáp số đúng trong ngoặc; không dựng lời giải bằng Pythagore.
  - **Cần CEO quyết:** (1) bỏ câu này khỏi đề / kho — trạm soát nghiêng về cách này; (2) sửa số liệu về 8, 6, 10 như đề 1 (khi đó trùng GKI-12 Câu 18, và vẫn cần Pythagore đảo); hay (3) giữ như hiện tại.

Hai dòng `Chưa chắc` của trạm soạn đã gỡ sau khi kiểm chắc: **Câu 2** (tích đơn thức với đa thức là đa thức ⇒ 3 đa thức, B) và **Câu 14** ý b) (Sai) — lí do ở bảng trên. Cả hai là chắc về toán; điều không kiểm được là bảng đáp án của trường (đề không in).

## Điều người duyệt nên biết (không phải lỗi)

- **Câu 8:** đề hỏi "tứ giác nào không phải đa giác lồi" nhưng Hình 2 là ngũ giác và Hình 3 có hai cạnh cắt nhau (không phải tứ giác theo định nghĩa SGK). Giữ nguyên chữ của đề, có `Ghi chú` trong câu; đáp án C (Hình 3) vẫn duy nhất.
- **Câu 10:** "Hình thang cân là hình thang…" — đáp án A lấy theo dấu hiệu nhận biết (hai đường chéo bằng nhau); phương án C (hai cạnh bên bằng nhau) là bẫy, cùng ý với Câu 14 b).
- **Câu 14 d):** lời giải xét "nếu $\widehat{A}=90^\circ$" thay cho $60^\circ$ của đầu bài (đúng ý người ra đề), phản ví dụ là hình chữ nhật $4$ cm × $3$ cm.
- **Trùng với đề 1 (GKI-12):** cùng khuôn 18 câu + 3 bài, nhưng gần như mọi câu đều đổi số / đổi tên điểm / đổi câu hỏi (Câu 14, 18 cùng dạng khác số liệu) ⇒ dưới ngưỡng 70% của luật "chỉ nhập mã đầu".
