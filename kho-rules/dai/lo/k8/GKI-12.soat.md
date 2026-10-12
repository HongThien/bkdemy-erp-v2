KẾT LUẬN: ĐẠT

# GKI-12 — Biên bản soát (THCS Quán Toan, phường Hồng An, kiểm tra giữa kì I 2025–2026, Toán 8)

> Lượt soát này TIẾP NỐI lượt trước bị ngắt giữa Pha 2. Pha 1 (`GKI-12.kiem.md`) và bản gốc của trạm soạn (`GKI-12.soan.goc.md`) do lượt trước ghi — giữ nguyên, không ghi đè.
> Lượt này: mở lại hai ảnh trang đọc đề từ đầu, chạy lại máy kiểm của Pha 1 (`<LV>\tam\soat-kiem.mjs` — mọi dòng khớp bảng giải mù), soát trọn 22 câu trên bản đang có,
> so với bản gốc để biết lượt trước đã sửa gì. Bảng "Chỗ đã sửa" gộp cả hai lượt, cột đầu ghi lượt nào sửa.

- **Số câu:** 22 (12 trắc nghiệm · 4 trả lời ngắn · 6 tự luận) — đề gốc 12 câu nhiều lựa chọn + 2 câu Đúng/Sai (nhập tự luận) + 4 câu trả lời ngắn + 3 bài tự luận; Bài 1 tách thành 1a, 1b (thu gọn / tìm $x$, hai ý độc lập); Bài 2 (hình) giữ chung.
- **Khớp đáp án Pha 1 (giải mù) ngay từ đầu:** 22 / 22. Không câu nào lệch đáp số (kể cả 8 mệnh đề Đúng/Sai của Câu 13, 14 và 4 cặp nghiệm của Bài 3).
- **Số câu phải sửa:** 7 / 22 (Câu 10, 11, 13, 14, 17, 18, Bài 2) + dòng `bo_sach` ở đầu tệp + mục ghi chú cuối tệp. **Không câu nào sai đáp số, không câu nào dùng kiến thức cấm.** Theo loại: lập luận 5 (Câu 10, 11, 13, 14, Bài 2) · định dạng / câu chữ 2 (Câu 17, Câu 18) · chép đề 1 (Câu 13, ghi chú chữ thêm) · hình 1 (Bài 2) · phân loại 1 (`bo_sach`).
- **Cổng:** `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem` ⇒ ✔ đạt cổng: 4 phần · 22 câu · 2 hình · 2 chưa chắc.
- Đề KHÔNG in bảng đáp án ⇒ chỉ có hai nguồn (trạm soạn · trạm soát giải mù) + máy.

## Đã soát gì

- **Đề:** đối chiếu từng câu với `trang\p-1.png`, `p-2.png` (đề có lớp chữ, in rõ; Câu 9–10 xem thêm ảnh cắt 300 dpi `tam\soat-c9c10.png`): số, số mũ, dấu, phương án, tên điểm, đủ ý — khớp, không sót, không bỏ câu.
- **Kiến thức:** không có đường trung bình, Thalès, đồng dạng, "phương trình – tập nghiệm" (kể cả dùng ngầm). Hằng đẳng thức (Câu 6, 7, 17, Bài 1a, 1b) — đề hỏi tới. Hình chữ nhật, hình thoi, hình vuông (Câu 11, 12, 14d, 16, 18, Bài 2a) — đề hỏi tới. Bài 3 nhóm hạng tử rồi đặt thừa số chung — chính đề bắt phải làm thế. **Câu 14d** không dùng "hình thang cân có một góc vuông" mà kẻ $NH\perp PQ$, đi qua hình bình hành $MNHQ$ và quan hệ đường vuông góc – đường xiên (lớp 7) — đúng luật. **Bài 2b** đi qua $\triangle MBK=\triangle MCD$ (g.c.g) rồi ba đường trung tuyến của $\triangle AKD$ (lớp 7), không chạm đường trung bình. **Câu 18** buộc phải dùng định lí Pythagore đảo — xem `Chưa chắc`.
- **Lời giải:** đọc từng dòng 22 câu; Phần 1 đủ 3–6 bước, không lộ đáp số; Bài 2 Phần 1 viết theo chiều phân tích đi lên, Phần 2 đi ngược lại, khớp mắt xích. Dấu nhân `\cdot` đúng.
- **Phân loại:** `kho` đúng (Câu 8–12, 14, 16, 18, Bài 2 = `hinh_hoc`; còn lại `dai`, kể cả Câu 13 mảnh đất). Trả lời ngắn: Câu 15 ($-1$), 16 ($45$), 17 ($1600$), 18 ($10$) — đều là một số nguyên đúng dạng đề hỏi. Bài 1a (đa thức), 1b (phân số), Bài 3 (bốn cặp) là tự luận — đúng.
- **Hình:** `p1c10_1.png` (hình thang cân, Câu 10) và `p2c13_1.png` (mảnh đất – vườn hoa, Câu 13): đúng hình của câu, đủ nhãn, không cụt. `giai_cau14.png`: hai hình cùng thoả giả thiết (hình thang cân · hình bình hành), $\widehat{M}=80^\circ$, gạch $MQ=NP$, nhãn đúng chỗ — giữ nguyên; điểm $H$ của ý d không vẽ vì ý d là phản chứng (hình có $H$ khác $P$ thì không thể thoả $NP=MQ$, vẽ ra là hình sai). `giai_bai2.png`: vẽ lại (bảng dưới).

## Chỗ đã sửa

| Câu | Lượt | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|---|
| Đầu tệp | này | phân loại | `bo_sach: Cánh Diều` → `KNTT` | Trạm soạn ghi Cánh Diều chỉ vì Câu 18 cần Pythagore. Cả đề không có hình chóp, phân thức, không câu nào khác về Pythagore; phần hình đi đúng Chương III của KNTT tới hình thoi, hình vuông; đề 2 cùng trường (GKI-13) ghi KNTT. Lượt trước đã sửa mục ghi chú cuối tệp sang KNTT nhưng chưa kịp sửa dòng đầu ⇒ hai chỗ nói ngược nhau |
| Câu 10 | trước | lập luận | Phần 2: "Vì $ABCD$ là hình thang cân nên $AB\parallel CD$" → "Theo hình vẽ, … có hai đáy là $AB$ và $CD$ nên $AB\parallel CD$"; thêm lí do "(hai góc kề đáy $AB$)" | Đề không nói đáy nào; phải lấy từ hình. Khẳng định hình phải có lí do |
| Câu 11 | này | lập luận | Mấu chốt, Bước 1, Bước 2 và Phần 2: "dấu hiệu nhận biết hình thoi" → "định nghĩa hình thoi" | "Tứ giác có bốn cạnh bằng nhau là hình thoi" là ĐỊNH NGHĨA trong sách (ba dấu hiệu nhận biết đều đi từ hình bình hành) |
| Câu 13 | trước | lập luận | Ý d: "Vì $4x+2\neq x^2+2x$" → nêu thêm một giá trị cụ thể ($x=10$: $42$ và $120$) | Hai biểu thức khác nhau phải chỉ ra được chỗ khác |
| Câu 13 | này | chép đề | `Ghi chú` thêm: ý d) đề gốc in thiếu chữ "là", đã thêm | Bản soạn có thêm chữ vào đề mà chưa ghi chú |
| Câu 14 | trước | lập luận | Ý b: thêm lí do "(hai góc trong cùng phía, $MQ\parallel NP$)" cho $\widehat{N}=100^\circ$. `Chú ý` của Phần 1 viết lại: nói vì sao ý b và ý d không mâu thuẫn nhau | Khẳng định góc thiếu lí do. `Chú ý` cũ nói chuyện "chưa học đường trung bình" — không phải điều học sinh cần |
| Câu 17 | trước | định dạng | Bước 2: "đây là hai phép tính rất nhẩm được" → "cả hai phép tính này đều nhẩm được" | Câu chữ |
| Câu 18 | trước | định dạng | `Chưa chắc` viết lại cho đúng trọng tâm (đáp số chắc, điều cần quyết là câu vượt phạm vi); `Chú ý` cũ "không nên kết luận $EO+FO=EG$" → "phải chứng minh được hình chữ nhật rồi mới có $FH=EG$" | `Chú ý` cũ gây hiểu sai (ở bài này $EO+FO$ đúng bằng $EG$ về số). Lượt này đã kiểm lại câu dẫn GKI-13 Câu 18 (7, 5, 10) — đúng |
| Bài 2 | trước | lập luận | Phần 1 Bước 2: "bằng nhau vì cùng bằng $AB$" → viết đủ chuỗi $MC=ND=\dfrac{1}{2}AD=AB$ và $CD=AB$ | Khớp từng mắt xích với Phần 2 |
| Bài 2 | này | hình | Vẽ lại `giai_bai2.png` (`tam\ve.mjs`): thêm ba đoạn $AM$, $DB$, $KN$; dời gạch đánh dấu trên $BM$ (trung điểm của $BM$ nằm trên $KN$); dời nhãn $60^\circ$ khỏi $AM$. Không chấm giao điểm | Ý b nói về ba đoạn này và Phần 2 gọi chúng là ba đường trung tuyến của $\triangle AKD$ mà hình không có. Vẽ đoạn thẳng không phải là đánh dấu điều phải chứng minh |
| Ghi chú cuối tệp | cả hai | định dạng | Dòng bộ sách (KNTT) và dòng hình Bài 2 viết lại | Khớp bản đã sửa |

## Câu còn `Chưa chắc` (gửi CEO)

- **Câu 9** (trắc nghiệm, đáp án A): đề gốc in **hai phương án A và D cùng là $240^\circ$** (đã phóng to 300 dpi). Giá trị đúng $240^\circ$ là chắc chắn. Bản nhập giữ nguyên chữ của đề, chọn A ⇒ học sinh chọn D sẽ bị chấm sai. **Cần CEO quyết:** sửa D thành một giá trị khác (ví dụ $200^\circ$) hay để nguyên.
- **Câu 18** (trả lời ngắn, đáp số $10$): với số liệu đề in, đáp số chắc chắn (hai nguồn + máy), nhưng **chỉ ra được bằng định lí Pythagore đảo** (6 – 8 – 10 ⇒ hình chữ nhật ⇒ $FH=EG$). Đề là KNTT, Pythagore ở học kì 2 ⇒ câu vượt phạm vi giữa kì 1. Đề 2 cùng trường (GKI-13 Câu 18) hỏi y hệt với 7, 5, 10 thì không ra số đẹp ⇒ nghi người ra đề định hỏi khác. **Cần CEO quyết:** giữ câu với lời giải Pythagore, hay bỏ câu.

Không gỡ dòng `Chưa chắc` nào của trạm soạn (cả hai dòng đều là việc thật cần CEO quyết).

## Điều người duyệt nên biết (không phải lỗi)

- **Câu 14 ý b (sai) và ý d (đúng):** hai đáp án này chắc về toán nhưng dễ bị cãi. Ý b sai vì hình bình hành có $\widehat{M}=80^\circ$ cũng thoả $MN\parallel PQ$, $MQ=NP$ mà không phải hình thang cân. Ý d đúng, nhưng lời giải phải dài (kẻ $NH$, phản chứng $H$ trùng $P$) vì không được nói tắt "hình thang cân có một góc vuông" — tứ giác này chưa chắc là hình thang cân (chính ý b).
- **Bài 2:** giả thiết $\widehat{BAD}=60^\circ$ không dùng tới ở cả hai ý (đã ghi `Ghi chú` trong câu).
- **Bài 3:** lời giải nhóm hạng tử rồi đặt thừa số chung; đề không có câu "phân tích đa thức thành nhân tử" nào khác, nhưng bài này không có cách làm khác.
- Tiêu đề đề không có "(đề 1)" vì đề gốc không ghi; GKI-13 cùng trường đang ghi "(đề 2)".
