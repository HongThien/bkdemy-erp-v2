KẾT LUẬN: ĐẠT

# Biên bản soát GKI-30 (THCS Nghĩa Tân, phường Nghĩa Đô — đề minh hoạ giữa học kì 1 số 4, 2025–2026, KNTT)

- Trạm soát giải mù trước (`GKI-30.kiem.md`), sau đó mới mở bản soạn. Bản soạn gốc giữ ở `GKI-30.soan.goc.md`.
- Số câu: **20** (8 trắc nghiệm · 6 trả lời ngắn · 6 tự luận; 6 câu kho hgt: Câu 5, 6, 7, 8, Bài 4.1, Bài 4.2).
- Khớp đáp án Pha 1 ngay từ đầu: **20 / 20** (không câu nào lệch đáp số).
- Số câu phải sửa: **8** (Câu 1, Câu 2, Câu 6, Câu 8, Bài 2c, Bài 3.1, Bài 4.1, Bài 4.2) + 1 dòng ở mục ghi chú cuối tệp — không có lỗi đáp số, lỗi chép đề, lỗi phân loại hay lỗi hình.
- Chép đề: đã so từng số, số mũ, ngoặc trên ảnh `trang-dd` và bản cắt 400 dpi ($\overline{37*}$; $32-2.[(6.4-2.3^2):2-2]$; $96.34+19.4+15.2^2$; $36:(x-5)=2.3^2$; $11+(15-2x^2).5=46$; $64\ cm^2$, $AC=16$ cm; $8$ m, $6$ m, $33\ m^2$, $AC=10$ m; $3^{118}+3^{119}$; $a+b+2$, 29 bước) — bản soạn chép đúng. Không sót câu. Đề không có phần tiếng Anh.
- Tách câu: Bài 1, Bài 2 tách từng ý; Bài 3 (mít · bi), Bài 4 (1) hình thoi · 2) mảnh đất), Bài 5 (chia hết · trò chơi trên bảng) mỗi bài gom hai bài toán khác hẳn nhau ⇒ tách `.1`, `.2` — bản soạn đã tách đúng, trùng dự kiến của Pha 1.
- Hình: đã mở cả 9 tệp `*_lai.png` trong `img\` — đúng hình của câu, không cụt, không dính chữ câu khác (hình Bài 4.1 đủ nhãn $M, B, A, O, C, D$; hình Bài 4.2 đủ nhãn và số đo $8\ m$, $6\ m$).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (20 câu · chưa chắc 0).

## Dấu đáp án trên đề (yêu cầu riêng của lần soát này)

Cắt lại từ `goc.pdf` ở 400 dpi (cả 8 câu) và 600 dpi (Câu 8): **không câu nào có dấu đáp án**.

| Câu | Dấu trên đề | Đáp án (hai lượt giải khớp nhau) |
|---|---|---|
| Câu 1 | không có | A |
| Câu 2 | không có (nét gạch phía trên "37 *" là gạch đầu của số $\overline{37*}$, không phải gạch chân phương án B của Câu 1) | D |
| Câu 3 | không có | B |
| Câu 4 | không có | B |
| Câu 5 | không có | C |
| Câu 6 | không có | A |
| Câu 7 | không có | A |
| Câu 8 | không có — chữ **B.** không hề gạch chân, bốn chữ A. B. C. D. đen đậm như nhau | D |

"Dấu gạch chân B ở Câu 8" là máy bóc (`gemini-danh-dau.json`) nhận nhầm, không có trên ảnh. Về toán: B (hình thoi có bốn cạnh bằng nhau) đúng, chỉ D sai ⇒ đáp án D chắc chắn.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 1 | định dạng (ghi chú) + lập luận (lời Phần 1) | Xoá dòng `Chưa chắc`; Bước 1 đổi "mũi tên" thành "nét dẫn từ chữ $A$ / chữ $B$ chạm vào…" | Ảnh 400 dpi: nét dẫn từ $A$ đi xuyên viền elip ngoài, chạm vòng trong (xanh lá) ⇒ $A=\{a;b;c\}$; nét dẫn từ $B$ chạm viền elip ngoài ⇒ $B=\{m;n;a;b;c\}$ — đúng như bản soạn. Một tập nằm trọn trong tập kia nên gán tên cách nào thì số phần tử chung vẫn là 3 ⇒ đáp án A chắc chắn. Hình không có đầu mũi tên. |
| Câu 2 | định dạng | Chuyển dòng `Thử lại` từ Phần 2 lên cuối Phần 1 | Phần 2 là cái học sinh viết vào bài; theo mẫu GKI-01 dòng `Thử lại` nằm ở Phần 1. |
| Câu 6 | định dạng (ghi chú) | Xoá dòng `Chưa chắc` | Ảnh 400 dpi: 6 hình vuông vàng, 6 tam giác xanh xen giữa, lục giác trong không có nét chia ⇒ không có tam giác nào khác. Máy: góc ở đỉnh mỗi tam giác $360^\circ-120^\circ-90^\circ-90^\circ=60^\circ$, hai cạnh kề bằng cạnh lục giác ⇒ đều. Đáp số 6 chắc chắn; lời giải nhận biết bằng quan sát hình là đúng mức "hình học trực quan" lớp 6 (không cần chứng minh bằng góc). |
| Câu 8 | lập luận (Phần 1) | Viết lại 3 bước: tính chất về cạnh và góc (xét A, B) → tính chất về đường chéo (xét C, D) → đối chiếu từng khẳng định | Bước 1 gốc là bước "Đọc kĩ yêu cầu" (brief cấm bước bịa); Bước 3 gốc lấy ví dụ "hình thoi có hai đường chéo 12 dm và 8 dm" — số liệu của mẫu GKI-01, không thuộc đề này. |
| Bài 2c | kiến thức | `Chú ý` đổi thành "$2x^2$ là 2 nhân với $x^2$, không phải $2x$ nhân với $2x$" | Câu gốc "chỉ nhận giá trị không âm" nhắc tới số âm — học sinh giữa kì 1 chưa học số nguyên âm. |
| Bài 3.1 | định dạng (ghi chú) | `Chưa chắc` → `Ghi chú` (nói rõ cách hiểu và vì sao cách hiểu kia không hợp đề) | Máy: hiểu "cả 3 quả nặng 10 kg" ⇒ vốn $200000$, lãi $70000$, bán $9$ kg, giá $30000$ — tròn, hợp lí. Hiểu "mỗi quả 10 kg" ⇒ vốn $600000>270000$ (lỗ, trái câu hỏi "lợi nhuận") và $270000:29$ không chia hết; hiểu "bỏ 1 kg mỗi quả" ⇒ $270000:7$ không chia hết. Chỉ một cách hiểu cho đáp số có nghĩa ⇒ chắc chắn; câu chữ mơ hồ của đề gốc là điều người duyệt cần biết nên để ở `Ghi chú`. |
| Bài 4.1 | định dạng | `Ghi chú` thêm câu: ý b) dùng tính chất hai đường chéo hình thoi cắt nhau tại trung điểm mỗi đường; đơn vị `($cm$)` → `(cm)` (3 chỗ) | Điều người duyệt cần thấy ngay tại câu (xem mục cuối biên bản); đơn vị theo mẫu GKI-01 `(m)`. |
| Bài 4.2 | định dạng | Đơn vị `($m$)` → `(m)` | Theo mẫu GKI-01. |
| Ghi chú cho người duyệt | định dạng | Thay dòng "Câu 8: file đáp án máy đọc được D, dấu gạch chân máy đọc được B…" bằng dòng "đề không có dấu đáp án, đã soi 400–600 dpi" | Dòng cũ là ghi chú về lỗi công cụ (brief cấm) và mô tả sai sự thật: trên ảnh không có gạch chân nào. |

## Dòng `Chưa chắc` của trạm soạn đã xoá (đã kiểm chắc chắn)

- **Câu 1** — đọc hình 400 dpi rõ: $A$ là vòng trong, $B$ là elip ngoài; đáp số 3 không đổi dù gán ngược.
- **Câu 6** — đếm trên hình 400 dpi được đúng 6 tam giác, máy xác nhận cả 6 đều là tam giác đều.
- **Bài 3.1** — chỉ cách hiểu "tổng 10 kg" cho đáp số có nghĩa (máy thử cả ba cách hiểu); chuyển thành `Ghi chú`.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

## Điều người duyệt nên biết (không phải lỗi)

- **Bài 4.1 ý b)**: lời giải dùng "$O$ là trung điểm của $AC$ và $BD$". Theo trí nhớ của trạm soát (chưa mở sách đối chiếu), SGK KNTT 6 Bài 19 nêu tính chất này cho hình bình hành, còn với hình thoi chỉ nêu "hai đường chéo vuông góc với nhau"; đề của trường (bộ KNTT) rõ ràng đòi dùng $AO=AC:2$. Lý thuyết bản đồ chưa có Chương IV (`k6.md` Q5) nên chưa có khuôn để đối chiếu — đáp số $32\ cm^2$ chắc chắn, chỉ cần CEO chốt cách viết khi có lý thuyết hình.
- **Bài 5.2**: đáp số là một số vừa 4 ô (523) nhưng đề hỏi kèm "Tại sao?" (đòi giải thích) ⇒ bản soạn để `tu_luan`, trạm soát giữ nguyên. Nếu CEO muốn câu này lên app thì đổi sang `tra_loi_ngan`, `dap_an=523`.
- **Câu 4**: đề gốc viết "chở hết chỗ hành khách đó" (chữ "chỗ" dùng theo nghĩa "số") — giữ nguyên như đề in.
- **Bài 3.2**: hình của đề vẽ sẵn 3 hộp nên lộ số hộp — giữ nguyên hình đề gốc.
- Câu 6, Bài 4.1, Bài 4.2 (hình Chương IV) giải theo SGK KNTT 6 vì lý thuyết bản đồ chưa phủ chương này.
