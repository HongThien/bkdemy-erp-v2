KẾT LUẬN: ĐẠT

# GKI-27 — Biên bản soát (trạm soát, 10/10)

Đề: THCS Lý Tự Trọng — kiểm tra giữa kì I Toán 8, 2025–2026, 90 phút. Đề có lớp chữ, in rõ, **không in đáp án** ⇒ hai nguồn đối chiếu: bản soạn · giải mù (`GKI-27.kiem.md`).

## Số liệu

- **18 câu** trong tệp soạn (12 trắc nghiệm + 6 tự luận: Bài 1, Bài 2a, Bài 2b, Bài 3, Bài 4, Bài 5) — đủ, không sót, không thừa câu của đề.
- **18 / 18 câu khớp đáp án Pha 1 ngay từ đầu** (máy kiểm thay 5 bộ số cho Câu 4, Bài 1, 2a, 2b, 3 — đều khớp).
- **Số câu phải sửa: 1** (Bài 5 — chỉ sửa HÌNH GIẢI) + 1 dòng ở mục ghi chú cuối tệp. Không sửa đề, đáp án, lời giải của câu nào.
- Cổng `dung-de-tu-soan.mjs … --khoi 8 --chi-kiem`: ✔ đạt cổng (trước và sau khi sửa).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 5 | hình | `tam/ve.mjs`: vẽ thêm đoạn $IK$; tăng chiều cao canvas 335 → 360 px; vẽ lại `img/giai_bai5.png` | Ý b nói về đoạn $IK$ (đường chéo thứ hai) mà hình không có ⇒ học sinh không thấy hai đường chéo. Vẽ đoạn $IK$ không phải là đánh dấu điều phải chứng minh (không gạch bằng nhau, không ô vuông ở $\widehat{KHI}$). Canvas cũ chỉ chừa 13 px dưới nhãn $I$ (luật ≥ 35 px) |
| Ghi chú cuối tệp | ghi chú | Dòng về hình Bài 5: "không vẽ đoạn $IK$" → "có vẽ đoạn $IK$ … nhưng không đánh dấu $MH=IK$" | Cho khớp hình mới |

## Đã soát, không phải sửa

- **Đề**: 18 câu chép đúng ảnh (đã phóng 400 dpi Câu 3 — phương án D là $\sqrt{x}y^4$, gạch căn chỉ phủ $x$; hình Bài 3; hình Bài 4). Bỏ phần điểm. Không có lỗi in của đề gốc.
- **Đáp án**: trắc nghiệm D D C B · B B A A · A C D A; Bài 1 $C=4x^2y-x-7$, giá trị $-8$; Bài 2a $8x^6y^3-12x^5y^3+4x^4y^2$ và $2x^2y-3xy+1$; Bài 2b $A=-1$; Bài 3 $a^2$, $a^2+4a+4$, $4a+4$; Bài 4 hình thoi; Bài 5 hình chữ nhật, $MH=IK$, tam giác $MNP$ vuông cân tại $M$.
- **Luật kiến thức**: đề chạm Chương I (đơn thức, đa thức, cộng – nhân – chia cho đơn thức) và Chương III tới hình thoi, hình vuông (Câu 10–12, Bài 4, Bài 5). Đề KHÔNG có hằng đẳng thức ⇒ Bài 2b và Bài 3 khai triển bằng nhân đa thức ($(a+2)(a+2)$), đúng. Không câu nào dùng đường trung bình, Thalès, đồng dạng, Pythagore. Bài 5a đi qua tổng góc tứ giác $360^\circ$ rồi định nghĩa (không dùng "ba góc vuông" như dấu hiệu). Bài 5c chỉ dùng hai góc nhọn phụ nhau của tam giác vuông + tam giác có hai góc bằng nhau là tam giác cân (lớp 7) + dấu hiệu "hình chữ nhật có một đường chéo là phân giác của một góc".
- **Lời giải**: Phần 1 mọi câu đủ Mấu chốt + 3–5 bước nghĩ thật; Bài 4, Bài 5 viết theo phân tích đi lên, Phần 2 đi ngược lại, khớp từng mắt xích, mỗi khẳng định hình có lí do. Dấu nhân `\cdot`.
- **Phân loại**: `kho` đúng (Câu 5–12, Bài 4, Bài 5 = `hinh_hoc`; còn lại `dai`, kể cả Bài 3 — bài thực tế viết biểu thức). Bài 2 là vỏ gom hai bài toán khác hẳn dữ kiện (nhân – chia đa thức · chứng tỏ không phụ thuộc biến) ⇒ tách Bài 2a / Bài 2b là đúng. Bài 1, Bài 3 ý sau dùng ý trước ⇒ một câu. Không có câu trả lời ngắn (Bài 1 đáp số gồm đa thức + số).
- **Hình**: `p2c3_1.png` (Bài 3) và `p2c4_1.png` (Bài 4) đúng hình của câu, không cụt. `p2c3_2.png` là bản cắt thừa của hình Bài 4, không dùng — đúng như ghi chú cuối tệp.
- **Ghi chú trong câu**: Bài 3 (hình cho thấy mở rộng cả bốn phía ⇒ cạnh $a+2$) và Bài 4 (dữ kiện chỉ có trên hình) là điều người duyệt cần biết — giữ.

## Nhận xét không sửa

- **Bài 3**: lời đề "mở rộng thêm mỗi bên cạnh 1 mét" đọc riêng có thể hiểu là cạnh dài thêm 1 m ($(a+1)^2$, phần thêm $2a+1$). Hình vẽ phân xử rõ: lưới ô cho thấy viền rộng đúng 1 ô ở CẢ BỐN phía (sân trong 6 ô, sân ngoài 8 ô), nhãn "1m" ghi ở viền ⇒ cạnh mới $a+2$. Hai lượt giải độc lập cùng chọn cách này; đã có `**Ghi chú:**` trong câu nên không gắn `Chưa chắc`.
- **Bài 5c**: Phần 2 chứng minh "đường chéo $MH$ là phân giác ⇔ tam giác cân tại $M$" và dùng dấu hiệu để có hình vuông; chiều "hình vuông ⇒ $MH$ là phân giác" (tính chất đường chéo hình vuông) không viết riêng thành dòng. Mức trình bày này là mức bài kiểm tra lớp 8 cho câu "cần điều kiện gì", mọi dòng đều đúng ⇒ không sửa.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
