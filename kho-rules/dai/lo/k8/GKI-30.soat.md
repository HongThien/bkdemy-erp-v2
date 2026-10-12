KẾT LUẬN: ĐẠT

# GKI-30 — THCS Mỹ Tiến (Nam Định), khảo sát giữa học kì I 2024–2025 — biên bản SOÁT

- **Số câu:** 16 (8 trắc nghiệm · 1 Đúng/Sai nhập tự luận · Bài 1.1a, 1.1b, 1.1c, 1.2 · Bài 2 · Bài 3 · Bài 4 trả lời ngắn). Đề gốc 13 câu, không in đáp án.
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 16 / 16 (kể cả bốn mệnh đề Câu 9: Sai – Đúng – Sai – Đúng; Bài 4: $-36$ tại $x=-1$, $y=0$).
- **Số câu phải sửa:** 4 (Câu 3, Câu 6, Bài 3, Bài 4) + 1 dòng ở mục ghi chú cuối tệp. Không có lỗi đáp số, không có lỗi chép đề, không có vi phạm luật kiến thức.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (3 phần · 16 câu · chưa chắc 1).
- Bản gốc trước khi sửa: `GKI-30.soan.goc.md`. Script kiểm của trạm soát: `<LV>\tam\soat_kiem.mjs`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 3 | lập luận | `**Chú ý:**` "không cần quan tâm hệ số $-9$ có chia hết cho 10 hay không" ⇒ "không cần xét hệ số 10 có chia hết cho hệ số $-9$ hay không" | Viết ngược chiều chia hết: đơn thức bị chia có hệ số 10, đơn thức chia có hệ số $-9$ |
| Câu 6 | lập luận | Phần 2: "Hình thang cân có hai cạnh bên không song song nên không phải hình bình hành, hình chữ nhật hay hình vuông" ⇒ "Có những hình thang cân mà hai cạnh bên không song song (hai đáy không bằng nhau): chúng có hai đường chéo bằng nhau nhưng không phải là hình bình hành, hình chữ nhật hay hình vuông" | Câu cũ sai khi phát biểu cho MỌI hình thang cân: hình chữ nhật cũng là hình thang cân và có hai cạnh bên song song. Chỉ cần chỉ ra có hình thang cân không phải ba hình kia |
| Bài 3 | định dạng (dòng ghi chú / chưa chắc) + lập luận | (a) `**Chưa chắc:**` từ 3 ý rút còn 1: bỏ ý (3) "giả thiết giống bài đường trung bình" (đã kiểm: lời giải không dùng, chuyển thành một câu ở mục ghi chú cuối tệp); gộp ý (1), (2) thành đúng điều CEO cần quyết. (b) `**Ghi chú:**` thêm phản ví dụ cụ thể ($AB=5$, $BC=6$, $AC=4$). (c) Phần 2 ý 2b, dòng (3): "Vì $H$ nằm giữa $B$ và $D$ nên…" ⇒ "Vì $AB<AC$ nên điểm $H$ nằm giữa hai điểm $B$ và $D$ (hình vẽ), do đó…" | (a) `Chưa chắc` chỉ để lại chỗ thật sự cần người quyết. (c) Khẳng định vị trí phải nói nó đến từ đâu — đây chính là chỗ dùng điều kiện $AB<AC$ đã thêm vào đề |
| Bài 4 | định dạng (Phần 1 lộ đáp số) | Bước 2 bỏ "$-27=9-36$", Bước 3 bỏ "$2y^2-36$" và "$M$ không nhỏ hơn $-36$", `**Chú ý:**` bỏ "$-36$ mới chỉ là một cận dưới" ⇒ nói bằng "một hằng số" | Phần 1 không được ghi đáp số cuối (câu trả lời ngắn, đáp số chính là $-36$); "cận dưới" cũng không phải chữ của lớp 8 |
| Mục ghi chú cuối tệp | định dạng | "Đề có 13 câu vào kho" ⇒ "13 câu gốc… nhập thành 16 câu" | Đếm sai: sau khi tách Bài 1 có 16 câu |

## Phân xử Bài 3 (lưu ý riêng của đợt giao)

- **Đề in gì:** đọc lại ảnh 300 dpi (`<LV>\tam\s_b3.png`) và lớp chữ của PDF: đúng là "Cho tam giác nhọn $ABC$ có $AB<BC$". Bản soạn chép đúng, giữ nguyên $AB<BC$ và **thêm** "và $AB<AC$".
- **Có thật cần thêm không — dựng toạ độ 7 tam giác** ($B(0;0)$, $C(c;0)$, $A(a;h)$; $M$, $N$, $D$, $H$ tính bằng phép tính): $D$ luôn là trung điểm $BC$, $BH=a$, nên $H$ nằm giữa $B$ và $D$ ⇔ $AB<AC$.
  - 3 tam giác $AB<AC$: $DHMN$ lồi, $\widehat{MHD}=\widehat{NDH}$, là hình thang cân ✔.
  - Tam giác nhọn $AB=5$, $BC=6$, $AC=4$ (**thoả $AB<BC$ của đề in**, nhưng $AB>AC$): $H$ nằm giữa $D$ và $C$, hai cạnh $HM$ và $ND$ cắt nhau ⇒ $DHMN$ theo đúng thứ tự đỉnh **không** là hình thang (hình thang cân lúc này là $HDMN$).
  - Tam giác $AB=AC$: $H\equiv D$, không còn tứ giác.
  ⇒ Điều kiện in trên đề không đủ; thêm $AB<AC$ là **thật cần** (đúng bẫy số 5 mục 7 của brief soạn: thêm điều kiện tối thiểu + `**Ghi chú:**`). Ý 1 và ý 2a đúng với mọi tam giác, không phụ thuộc điều kiện này.
- **Đường trung bình (kể cả dùng ngầm):** không có. Ý 1 chỉ dùng $MN\parallel BC$ và $BD=MN$ (giả thiết). Ý 2a dùng trung tuyến ứng với cạnh huyền — hợp lệ vì chính đề hỏi tính chất này ở Câu 8. Ý 2b đi bằng góc: $\triangle MBH$ cân tại $M$ ⇒ $\widehat{MHB}=\widehat{ABC}$; $DN\parallel BA$ (hình bình hành ở ý 1) ⇒ $\widehat{NDC}=\widehat{ABC}$ (đồng vị); hai góc kề bù ⇒ $\widehat{DHM}=\widehat{HDN}$ ⇒ hình thang có hai góc kề một đáy bằng nhau. Không chỗ nào dùng "$N$ là trung điểm $AC$", "$D$ là trung điểm $BC$", "$MN=\dfrac{1}{2}BC$" hay hai đường chéo $DM=HN$ (cách này mới cần đường trung bình).
- **Hình giải `giai_bai3.png`** (`<LV>\tam\ve.mjs`): $B(0;0)$, $C(11;0)$, $A(3;6)$ ⇒ $AB\approx 6{,}7<AC=10<BC=11$, tam giác nhọn ($121<45+100$); $M$, $N$, $D$, $H$ đúng toạ độ; chỉ đánh dấu giả thiết ($AM=MB$, $BD=MN$, góc vuông tại $H$), không đánh dấu $MA=MH$ hay hai góc bằng nhau; đủ 7 điểm, nhãn không đè, không cụt. Không phải vẽ lại.

## Các mục đã kiểm, không phải sửa

- **Chép đề:** 16 câu so với ảnh trang (Bài 1, 2, 3 phóng to 300 dpi): số mũ, dấu, phương án, tên điểm đều đúng; đủ 4 mệnh đề Câu 9; không sót câu. "1." "2." của Bài 3 viết thành "1)" "2)" theo quy ước các đề khác.
- **Đại số** (thay 6 bộ số ngẫu nhiên): Câu 4, Câu 9, Bài 1.1a–c, Bài 1.2 ($A=28$), Bài 4 ($M=(3x-2y+3)^2+2y^2-36$) đúng từng dòng.
- **Bài 2:** kích thước mảnh đất $x-25$ và $x-15$ đọc đúng từ hình; $4x-80=40\Rightarrow x=30$; $900$ m². Hình `p3c2_1.png` đúng hình của bài, không cụt, không dính chữ. `**Ghi chú:**` nêu dữ kiện chỉ có trên hình — giữ.
- **Luật kiến thức:** đề KNTT, chạm tới hằng đẳng thức (Câu 4, Bài 1.1b, 1.2, Bài 4) và trung tuyến ứng với cạnh huyền (Câu 8) ⇒ dùng hợp lệ. Không Pythagore, Thalès, đường trung bình, phân tích nhân tử, "phương trình – tập nghiệm".
- **Phân loại:** `kho` (Câu 5–8, Bài 3 = `hinh_hoc`; còn lại `dai`, kể cả Bài 2 bối cảnh mảnh vườn) · `loai` (Bài 4 = trả lời ngắn $-36$, vừa 4 ô; Câu 9 Đúng/Sai ⇒ tự luận có `Ghi chú`) · tách ý (chỉ Bài 1.1 "Thực hiện phép tính" tách a, b, c; Bài 1.2 là bài toán riêng; Bài 2, Bài 3 giữ chung) — đều đúng luật.
- **Phần 1:** mọi câu 3–5 bước là bước nghĩ thật; Bài 3 viết theo chiều phân tích đi lên (5 bước) và Phần 2 đi ngược lại, khớp từng mắt xích. `**Thử lại:**` ở Bài 2 dùng $x=30$ (giá trị trung gian, không phải đáp số cuối $900$) — giữ.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 3** — đề in "$AB<BC$": điều kiện này không đủ để $DHMN$ là hình thang cân (cần $AB<AC$) và lời giải cũng không dùng tới; nhiều khả năng đề gõ nhầm $AC$ thành $BC$. Kho đang giữ "$AB<BC$ và $AB<AC$". CEO chọn: giữ như vậy, hay thay hẳn bằng "$AB<AC$". Kèm theo: ý 2b lấy vị trí "$H$ nằm giữa $B$ và $D$" theo hình vẽ (đúng khi $AB<AC$, đã kiểm bằng toạ độ) chứ không chứng minh — muốn chứng minh chặt thì phải thêm một đoạn dài ($N$ là trung điểm $AC$ qua tam giác bằng nhau, rồi so góc), vượt mức một bài giữa kì.
