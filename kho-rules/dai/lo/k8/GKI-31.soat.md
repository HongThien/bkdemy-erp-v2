KẾT LUẬN: ĐẠT

# GKI-31 — biên bản SOÁT (Pha 2) — THCS Nguyễn Huy Tưởng, giữa học kì 1 Toán 8 năm 2025-2026

- **Số câu:** 16 (8 trắc nghiệm · 2 trả lời ngắn · 6 tự luận) — đủ mọi câu của đề, không câu nào bị bỏ.
- **Khớp đáp án Pha 1 ngay từ đầu:** 16/16 (bản giải mù `GKI-31.kiem.md`, máy kiểm `<LV>\tam\s_kiem.mjs`). Đề không in bảng đáp án.
- **Số câu phải sửa:** 3 (Câu 8 trắc nghiệm · Câu 4 tự luận · Câu 5 tự luận). Không câu nào sai đáp số, không câu nào vi phạm luật kiến thức.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (2 phần · 16 câu · chưa chắc 0).
- Bản trước khi sửa: `GKI-31.soan.goc.md`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| TN Câu 8 | lập luận | Xoá dòng `Chưa chắc` ("C và D có thể cùng đúng"). Phần 2: dòng "C sai" thay câu khẳng định suông bằng phản ví dụ cụ thể (tứ giác có bốn góc $90^\circ$, $60^\circ$, $90^\circ$, $120^\circ$). | Đã xem ảnh 300 dpi: A, B, C đều in "hai cạnh đối / hai góc đối" (một cặp), riêng D in "các cạnh đối" — đề cố ý đối lập "hai" với "các". "Hai góc đối bằng nhau" = một cặp góc đối ⇒ sai (có phản ví dụ). Chỉ D đúng, không có hai phương án đúng. |
| TL Câu 4 | chép đề (ghi chú) | `Ghi chú` viết "nếu $D$ đối xứng với $A$ qua $M$ thì $N\equiv M$" ⇒ sửa thành "$N$ trùng $E$"; điều kiện thêm vào đề đổi từ "$D$ không phải điểm đối xứng với $A$ qua $M$" thành "$MD\neq MA$". | Khi $MD=MA$: $E\equiv B$, $F\equiv C$, đường thẳng $MF$ là $BC$ và $E$ nằm trên nó ⇒ chân đường vuông góc $N\equiv E$ (không phải $M$) — kiểm bằng toạ độ. "$MD\neq MA$" nói cùng điều kiện mà không cần khái niệm đối xứng tâm. |
| TL Câu 4 | lập luận | a) "Mà $A$, $M$, $D$ thẳng hàng" ⇒ "Mà $D$ thuộc tia $AM$ (vì $D$ nằm trên tia đối của tia $MA$)". c) Thêm lí do cho "$I$ là trung điểm của $AD$, $EF$ và $AD=EF$": hai đường chéo của hình vuông bằng nhau và cắt nhau tại trung điểm của mỗi đường. | Thẳng hàng chưa đủ để $AD$ là tia phân giác của $\widehat{EAF}$ (cần $D$ cùng phía $M$ trên tia $AM$). Ý c bản soạn nêu $I$ là trung điểm mà không có lí do (khuôn vở lớp 8: mỗi khẳng định hình một lí do). |
| TL Câu 4 | hình | `giai_cau4.png`: bỏ hai gạch đánh dấu $AB=AC$; tăng chiều cao canvas 330 → 355 (chừa đủ 35px dưới nhãn $C$). Sửa trong `<LV>\tam\ve.mjs`, đã vẽ lại và mở kiểm. | Gạch đặt ở giữa $AB$, $AC$ rơi đúng vào đoạn $AE$, $AF$ ⇒ người xem đọc thành $AE=AF$ — là điều phải chứng minh ở ý a (hình vuông). Giả thiết "vuông cân" đã có trong đề. |
| TL Câu 5 | kiến thức (ghi chú) | Xoá dòng `Chưa chắc` ("phép chia có dư không nằm trong KNTT 8"). Mấu chốt nói rõ đây là phép chia có dư của đa thức một biến (lớp 7); đổi "số chia", "số dư" thành "đa thức chia", "dư"; thêm "(với $p(x)$, $q(x)$ là thương)". | Phép chia đa thức một biến có dư ($A=B\cdot Q+R$, bậc $R$ nhỏ hơn bậc $B$) là kiến thức lớp 7 KNTT (bài Phép chia đa thức một biến) ⇒ nằm trong nền hợp lệ của `k8.md` §1.2; lời giải không dùng định lí Bézout, chỉ thay $x=1$, $x=2$ vào đẳng thức của phép chia. Đáp số $f(x)=2x^3-7x^2+9x-1$ hai người giải độc lập + máy đều khớp ⇒ không còn gì chưa chắc. |
| Ghi chú cho người duyệt | định dạng | Cập nhật hai gạch đầu dòng nói về Câu 4, Câu 8, Câu 5 cho khớp các sửa trên. | Bản cũ còn ghi "đã ghi Chưa chắc". |

## Đã soát, không sửa

- **Chép đề:** 16/16 câu khớp ảnh (số mũ, dấu, phương án). TN Câu 4 phương án B: dấu giữa hai hạng tử in đứt nét — phóng 600 dpi (`<LV>\tam\s_c4_600.png`) là dấu trừ, bản soạn chép đúng, `Ghi chú` giữ nguyên. TN Câu 5, TL Câu 1.1b: đề in dấu chấm làm dấu nhân, bản soạn viết liền — đúng luật. TN Câu 6, TL Câu 4c: đề in góc không có mũ, bản soạn thêm `\widehat` — đúng. TL Câu 3b: đề in "ở câu 1)", bản soạn sửa "câu a)" kèm `Ghi chú` — đúng.
- **Luật kiến thức:** TL Câu 3a dùng hiệu hai bình phương — đề yêu cầu "viết dưới dạng tích" nên đề có chạm hằng đẳng thức. TL Câu 4 dùng dấu hiệu hình vuông, tính chất đường chéo hình vuông, trung tuyến ứng với cạnh huyền + chiều đảo — đề có hỏi hình chữ nhật (TN Câu 7) và hình vuông (Câu 4a). Hình chữ nhật đi qua tổng các góc $360^\circ$ ⇒ bốn góc vuông (không dùng "ba góc vuông"). Không có đường trung bình, Thalès, đồng dạng, Pythagore, kể cả dùng ngầm. Tìm $x$ không viết "phương trình", "tập nghiệm".
- **Phân loại:** kho, loại, tách ý đều đúng (Câu 1.1a/1.1b và 2a/2b tách; Câu 1.2, Câu 3, Câu 4 giữ chung; 2a, 2b là số nguyên ⇒ trả lời ngắn).
- **Hình:** `p2c3_1.png` đúng hình Câu 3, đủ, không cụt. `giai_cau4.png` (sau khi sửa): toạ độ dựng đúng dữ kiện, $D$ nằm trên tia đối của tia $MA$, đủ $A, B, C, M, D, E, F, N$ + điểm phụ $I$, chỉ đánh dấu giả thiết.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Hai dòng `Chưa chắc` của trạm soạn đã kiểm chắc chắn và xoá:
- **TN Câu 8** — chỉ D đúng (xem bảng).
- **TL Câu 5** — kiến thức lớp 7, đáp số đã có hai nhân chứng (xem bảng). Nếu CEO không muốn câu chia đa thức có dư nằm trong kho khối 8 thì đó là quyết định về phạm vi kho, không phải nghi ngờ về lời giải.

## Tệp tạm của trạm soát

`<LV>\tam\s_*.png` (ảnh phóng to), `s_kiem.mjs` (máy kiểm Pha 1), `s_sua.mjs` (script sửa hàng loạt chạy hỏng, KHÔNG ghi gì — các sửa đã làm tay; tệp bỏ được).
