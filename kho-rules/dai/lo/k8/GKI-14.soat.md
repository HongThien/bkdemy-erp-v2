KẾT LUẬN: ĐẠT

# GKI-14 — Biên bản soát (trạm soát, 10/10)

Đề: THCS Phương Đông, xã Trà Liên — giữa học kì 1 Toán 8, 2025–2026. Đề gốc không có bảng đáp án nhưng **chữ cái phương án đúng được tô đỏ sẵn** trên ảnh trang.

## Số liệu

- **17 câu** trong tệp soạn (12 trắc nghiệm + 5 tự luận: Bài 1a, Bài 1b, Bài 2, Bài 3, Bài 4) — đủ, không sót, không thừa câu của đề.
- **17 / 17 câu khớp đáp án Pha 1 ngay từ đầu** (giải mù, `GKI-14.kiem.md`; số kiểm bằng `tam/soat-kiem.mjs`).
- Ba nguồn đối chiếu ở phần trắc nghiệm (bản soạn · giải mù · tô đỏ trong đề): khớp cả ba ở 11 câu; **Câu 4 đề tô đỏ cả A và D** — bản soạn và giải mù cùng ra A, máy kiểm $x^2y\cdot xyz^2=x^3y^2z^2$ ⇒ A đúng, D sai (đo điểm ảnh: chữ A 517 điểm đỏ, chữ D 797 điểm đỏ, B và C 0).
- **Số câu phải sửa: 2** (Câu 4, Câu 10) + 1 dòng ở mục ghi chú cuối tệp. Không sửa đáp án, không sửa đề của câu nào.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng sau khi sửa.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 4 | chép đề (thiếu ghi chú về đề gốc) | Thêm `**Ghi chú:**` — bản đề gốc tô đỏ cả A và D, chỉ A đúng | Phần tô đỏ của đề sai ở D; người duyệt đối chiếu với ảnh sẽ thấy hai chữ đỏ nên cần biết đáp án giữ là A |
| Câu 10 | lập luận | Phần 2, dòng xét B: "hai đáy của hình thang cân không bằng nhau" → "hình thang cân có thể có một đáy dài hơn đáy kia, nên hai đáy không nhất thiết bằng nhau" | Câu cũ sai với hình chữ nhật (là hình thang cân có hai đáy bằng nhau); khẳng định B sai vì không đúng với MỌI hình thang cân, không phải vì hai đáy luôn khác nhau |
| Câu 10 | lập luận | Phần 2, dòng xét A: phản ví dụ "hình bình hành" → "hình bình hành có một góc $60^\circ$" kèm lí do hai góc kề một đáy là $60^\circ$, $120^\circ$ | "Hình bình hành không phải là hình thang cân" không đúng với mọi hình bình hành (hình chữ nhật là hình thang cân); phản ví dụ phải cụ thể và nêu được vì sao |
| Câu 10 | lập luận (Phần 1) | Bước 2 viết lại: thử khẳng định không trùng định nghĩa bằng một hình thoả điều kiện mà kết luận không đúng | Bước cũ nói "kiểm tra bằng một hình không phải hình thang cân" — không khớp cách bác khẳng định B (phải lấy chính một hình thang cân) |
| Ghi chú cuối tệp | ghi chú | "trùng với phần tô đỏ ở cả 12 câu" → "ở 11 câu; riêng Câu 4 đề tô đỏ cả A và D" | Câu cũ không đúng với ảnh |

## Đã soát, không phải sửa

- **Đề**: 17 câu chép đúng ảnh (đã phóng 300 dpi các câu có số mũ: Câu 4–7, Bài 1, Bài 2, Bài 4). Câu 8 phương án D in "$AB\equiv CD$" — giữ nguyên là đúng. Bài 3 thêm chữ "là" (đề in thiếu) — ghi chú hợp lệ.
- **Luật kiến thức**: đề chạm Chương I (đơn thức, đa thức, cộng – nhân – chia cho đơn thức) và Chương III tới hình vuông (Câu 12). Không câu nào dùng đường trung bình, Thalès, đồng dạng, Pythagore. **Bài 4** giải bằng nhân đa thức (vế phải → vế trái sau khi thay $2p=a+b+c$), không dùng hằng đẳng thức $(b+c)^2-a^2$ — đúng, vì cả đề không có câu hằng đẳng thức nào khác; trùng hướng giải mù của trạm soát.
- **Bài 3** (hình chứng minh): Phần 1 đi theo phân tích đi lên, Phần 2 đi ngược lại, khớp từng mắt xích; mỗi khẳng định có lí do; dùng dấu hiệu "một cặp cạnh đối song song và bằng nhau" và tính chất cạnh đối của hình bình hành — trong phạm vi.
- **Phân loại**: `kho` đúng (Câu 8–12, Bài 3 = `hinh_hoc`; còn lại `dai`). Bài 1 là vỏ gom hai bài toán khác hẳn nhau (xếp nhóm đồng dạng · phép chia) ⇒ tách Bài 1a / Bài 1b là đúng. Bài 2 ý b dùng kết quả ý a ⇒ giữ một câu, `tu_luan`. Không có câu trả lời ngắn (Bài 1b đáp số là đa thức).
- **Hình giải** `giai_bai3.png`: hình bình hành dựng bằng toạ độ ($C=D+\overrightarrow{AB}$), $E$, $F$ là trung điểm tính bằng phép tính; đủ 6 điểm, nhãn đúng chỗ, không đè, không cụt; gạch bằng nhau chỉ đánh dấu giả thiết ($AE=EB$ một gạch, $DF=FC$ hai gạch), không đánh dấu $AE=CF$ hay $AF=EC$. Không phải vẽ lại.
- **Định dạng**: dấu nhân `\cdot`, số thập phân `0{,}5`, Phần 1 mỗi câu 3–4 bước, không lộ đáp số cuối.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Ghi nhận thêm (không phải `Chưa chắc`): Câu 3 — nếu $A=-B$ thì $A+B$ là đa thức không, không có bậc; đề không xét trường hợp này, B vẫn là phương án đúng duy nhất trong bốn phương án và trùng phần tô đỏ.
