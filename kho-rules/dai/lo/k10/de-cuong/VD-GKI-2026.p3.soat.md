KẾT LUẬN: ĐẠT

# Biên bản soát VD-GKI-2026 khúc 3 — Đề số 3 (ảnh p-7 … p-9)

- Số câu: 21 (PHẦN 9: 12 TN · PHẦN 10: 2 Đ/S · PHẦN 11: 4 TLN · PHẦN 12: 3 tự luận), đủ, đúng thứ tự, không thừa/thiếu.
- Khớp Pha 1 ngay từ đầu: 21/21 câu (đáp án, đáp số, Đ/S từng ý).
- Câu phải sửa trong `.soan.md`: 1 (định dạng/lập luận làm tròn). Thêm 1 sửa hình giải (không đổi `.soan.md`).
- Đề gõ: đối chiếu từng câu với ảnh — đúng (đề in $R$, $N$ đã gõ thành $\mathbb R$, $\mathbb N$; dấu chấm làm dấu nhân ở Câu 6 thành `\cdot`; hợp lệ).
- Phân loại: mọi câu `kho=dai` (không có câu vectơ) — đúng. TLN: 251, 2, 60, 27 đều ≤ 4 kí tự.
- Cổng: `✔ đạt cổng`.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| PHẦN 11 Câu 1 | lập luận (làm tròn) | Dòng tính $KN^2$ thay số đã làm tròn ($77{,}03^\circ$, $192{,}64$, $0{,}2244$) bằng $\cos\widehat{KAN}$ + ghi dùng giá trị chưa làm tròn | Luật "không tính tiếp từ số đã làm tròn"; thay số tròn ra $\approx 63052{,}6$ chứ không phải $63049{,}9$ như dòng ghi (kết quả 251 không đổi) |
| PHẦN 12 Câu 3 | hình | `ve_p3.mjs`: dời nhãn $25^\circ$, $40^\circ$ của điểm $B$ về sát $B$, $40^\circ$ nằm trong góc giữa $BQ$ và $BP$ | Nhãn $25^\circ$ cũ đứng sát $A$, dễ đọc thành góc tại $A$; nhãn $40^\circ$ cũ nằm ngoài góc |

## Đã kiểm bằng máy (`<LV>\tam\soat_p3.mjs`)

- TN3 $R=10/\sqrt3$; TN5 quét 4001 giá trị; TN9 thử điểm $(-1;1)$, $(1;-1)$… chỉ hệ A khớp miền trắng; TN12 thử $B=50^\circ$.
- Đ/S 1: toạ độ hoá, $BI=\sqrt{13}$, $BC=\sqrt{21}$, tam giác nhọn, $\cos\widehat{BIC}=-\sqrt{13}/13$ ⇒ DSDS. Đ/S 2: quét lưới 0,01 ⇒ max 340 tại $(6;2)$ ⇒ DSDD.
- TLN 1: toạ độ hai tàu ⇒ 251,097 km ⇒ 251. TLN 4: đếm ô ⇒ 27.
- Tự luận 3: dựng toạ độ $B(0;0)$, $A(1;0)$, kiểm góc ngắm từ $A$ đúng $60^\circ$, $35^\circ$; $BP\approx2{,}532$, $BQ\approx3{,}303$, $PQ\approx1{,}079$ ⇒ 1,08 km.
- Hình: `de_P9C9.png` đúng câu, đủ nhãn 3, 2, $O$; `giai_P11C1.png` đúng vị trí (K cao hơn N); `giai_P12C2.png` biên nét đứt, tô nửa mặt phẳng chứa $O$; `giai_P12C3.png` P cao hơn, Q xa hơn, đúng dữ kiện.

## Gửi CEO (Chưa chắc / đề sai)

- Không có câu `Chưa chắc`, không có đề sai.
- Lưu ý (không phải cờ): PHẦN 12 Câu 3 đề không in hình — trạm soạn và trạm soát cùng hiểu $A$ nằm giữa $B$ và chân núi, $A$, $B$, $P$, $Q$ đồng phẳng (cách hiểu duy nhất khớp "góc $BAP$" tù và góc ngắm từ $B$ nhỏ hơn); nếu bản gốc có hình khác thì xem lại.
- Đề số 3 dùng định lí sin/côsin (chương 3) dù đề cương ghi giới hạn C1–C2 — giải theo đề, theo chỉ đạo điều phối.
