KẾT LUẬN: ĐẠT

# GKI-02 — Biên bản soát (Phòng GD&ĐT huyện Vụ Bản, khảo sát giữa kì I 2024–2025, Toán 8)

- **Số câu:** 16 (8 trắc nghiệm · 4 trả lời ngắn · 4 tự luận) — đề gốc 8 câu trắc nghiệm + 5 bài tự luận; Bài 1, Bài 3, Bài 5 tách ý, Bài 2 và Bài 4 giữ chung.
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 16 / 16. Không có câu nào lệch đáp số.
- **Số câu phải sửa:** 4 (Câu 1, Câu 8, Bài 4, Bài 5a) — **không câu nào sai đáp số, sai đề hay sai kiến thức**; 2 câu sửa lời (Câu 1, Bài 5a), 1 câu sửa thứ tự lập luận (Câu 8), 1 câu đổi sang cách chứng minh ngắn hơn + vẽ lại hình (Bài 4c — bản gốc KHÔNG sai). Bản trước khi sửa: `GKI-02.soan.goc.md`.
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng (sau khi sửa).
- **Máy kiểm của trạm soát:** `<LV>\tam\s-kiem.mjs` (viết trước khi mở bản soạn): thay số ngẫu nhiên hai vế cho Câu 3, 4, Bài 1a, 1b, 2a, 5a, 5b; thay ngược Bài 3a, 3b; BigInt Câu 5; toạ độ hai cỡ hình vuông cho Bài 4 ($AE=CK$, $DF\perp CE$, $ND=NM$, $MK=KD$, $AM=AD$) và Câu 8.

## Đã soát gì

- **Đề:** đối chiếu từng câu với ảnh trang + ảnh cắt 300 dpi (`s-p1a/b/c.png`, `s-p2a.png`): số, số mũ, dấu, phương án, tên điểm, đủ ý — khớp hết, không sót câu, không bỏ câu.
- **Kiến thức:** không có đường trung bình, Thalès, đồng dạng, Pythagore, "phương trình – tập nghiệm" (kể cả dùng ngầm). Hằng đẳng thức (bình phương, hiệu hai bình phương, lập phương của một hiệu) dùng ở Câu 4, 5, Bài 2, 3b, 5a, 5b — đề có hỏi tới (Câu 4, Câu 5). "Trung tuyến ứng với cạnh huyền" ở Bài 4c — đề có hình chữ nhật, hình vuông (Câu 7, Bài 4) nên trong phạm vi. Bài 1a nhân từng hạng tử, không dùng tổng hai lập phương (đề không chạm tới) — đúng. Câu 8 lấy $HK=AB$ qua hình bình hành $ABKH$ (hai cặp cạnh đối song song), không dùng "ba góc vuông".
- **Phân loại:** `kho` đúng (Câu 6, 7, 8, Bài 4 = `hinh_hoc`; còn lại `dai`). Trả lời ngắn: Bài 1a ($-27$), 3a ($-1$), 5a ($2023$), 5b ($3$) đều là một số nguyên ≤ 4 ô; Bài 3b ($\dfrac{11}{3}$) và Bài 1b (đa thức) để tự luận — đúng luật. Tách ý đúng luật (Bài 5 là hai bài toán khác hẳn nhau, nhãn gốc a, b).
- **Hình:** đề không có hình nào. `giai_bai4.png` đã vẽ lại (xem bảng).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | định dạng (lời Phần 1) | Bước 3: "phương án còn lại có dấu căn" → "hai phương án còn lại, đều có dấu căn" | Sau khi loại B, D còn HAI phương án (A và C) đều có căn; câu cũ đọc như chỉ còn một |
| Câu 8 | lập luận (thứ tự) | Phần 2: đưa dòng "$ABCD$ là hình thang cân nên $\widehat{C}=\widehat{D}=45^\circ$ (hai góc kề một đáy)" lên đầu, bỏ dòng lặp ở dưới | Dòng đầu đã dùng $\widehat{C}=45^\circ$ (để nói $H$, $K$ nằm trong đoạn $CD$) trước khi chứng minh nó |
| Bài 4 (ý c) | lập luận — **cải tiến, bản gốc không sai** | Đổi cách chứng minh ý c: bỏ điểm phụ $G$ (kéo dài $CE$ cắt tia đối tia $AD$, $\triangle EAG=\triangle EBC$, trung tuyến $MA$ của $\triangle DMG$, $\triangle ADM$ cân) → nối $MK$: $\triangle DMC$ vuông tại $M$ (ý b), $MK$ là trung tuyến ứng với cạnh huyền $DC$ ⇒ $MK=KD$ ⇒ $\triangle KDM$ cân tại $K$, đường cao $KN$ là trung tuyến ⇒ $ND=NM$. Phần 1 còn 5 bước (trước 6), Mấu chốt + Chú ý viết lại theo cách mới | Cùng công cụ (trung tuyến ứng với cạnh huyền + tam giác cân) nhưng không cần điểm phụ ngoài hình và một cặp tam giác bằng nhau; dùng thẳng dữ kiện "$K$ là trung điểm $DC$" và kết quả ý b nên bước nghĩ tự nhiên hơn với học sinh. Bản gốc đã kiểm đúng từng dòng (và kiểm toạ độ) — đây là chọn cách, không phải chữa lỗi |
| Bài 4 | hình | Vẽ lại `giai_bai4.png` (`<LV>\tam\ve.mjs`): bỏ $G$ và hai nét đứt $AG$, $EG$; thêm đoạn kẻ thêm $MK$ nét đứt; $M$, $N$ tính bằng giao điểm hai đường thẳng; nhãn $N$ dời khỏi đường $AK$ (bản cũ chữ $N$ đè lên $AK$); sáu nửa cạnh cùng MỘT gạch (bản cũ 1 – 2 – 3 gạch, gợi ý sai rằng chúng khác nhau); canvas 310×330 | Hình phải khớp lời giải mới; nhãn không đè đường; hình vuông có sáu nửa cạnh bằng nhau |
| Bài 4 | định dạng (ghi chú) | Xoá dòng `**Ghi chú:** Hình vẽ ở lời giải có thêm điểm phụ $G$…` | Không còn điểm $G$; dòng Ghi chú chỉ dành cho lỗi đề gốc |
| Bài 5a | định dạng (Phần 1 lộ đáp số) | Bước 2: "$2024=2023+1$" → "tách riêng số $1$ từ số hạng tự do $2024$" | Câu trả lời ngắn có đáp số $2023$; Phần 1 không được ghi đáp số cuối |
| Ghi chú cuối tệp | định dạng | "hai phương trình tìm $x$" → "hai ý tìm $x$"; hai dòng về Bài 4 viết lại theo cách mới ($MK$ thay cho $G$) | Không dùng chữ "phương trình" ở giữa kì 1; khớp lời giải đã sửa |

## Câu còn `Chưa chắc`

Không có. (Bản soạn không có dòng `Chưa chắc` nào; trạm soát không thêm.)

## Điều người duyệt nên biết (không phải lỗi)

- **Bài 1a** nhập trả lời ngắn ($-27$) dù đề hỏi "Thực hiện phép tính" với đa thức: kết quả là hằng số nên vừa 4 ô. Nếu muốn học sinh trình bày thì đổi `tu_luan`.
- **Câu 7, phương án D** bác bỏ bằng "hình chữ nhật cũng là hình thang cân" (theo định nghĩa KNTT: hình thang có hai góc kề một đáy bằng nhau) — đúng theo sách, ghi lại để người duyệt không ngạc nhiên.
- **Bài 4c:** nếu CEO muốn giữ cách điểm phụ $G$ của trạm soạn thì lấy lại từ `GKI-02.soan.goc.md` (kèm hình cũ phải vẽ lại bằng `ve.mjs` bản cũ — hiện `ve.mjs` là bản mới).
