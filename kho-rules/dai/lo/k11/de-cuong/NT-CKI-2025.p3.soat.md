KẾT LUẬN: ĐẠT

# NT-CKI-2025 · khúc 3 (tr.9–12) — biên bản soát (Opus)

- Số câu: 45 (PHẦN 31: 11 TN + 4 Đ/S; PHẦN 32: 30 tự luận). Đủ câu, đúng thứ tự in, không thừa / thiếu.
- Khớp Pha 1 ngay từ đầu: 45/45 (đáp án TN, chuỗi Đ/S, đáp số tự luận). Đề gõ đúng ảnh: 45/45.
- Số câu phải sửa ngoài định dạng: 4 (Câu 1b, 6, 9, 13b của PHẦN 32). Thêm một lượt định dạng toàn tệp + đổi tên PHẦN 31.
- Bản gốc trạm soạn: `NT-CKI-2025.p3.soan.goc.md`. Giải mù: `NT-CKI-2025.p3.kiem.md` (script `<LV>\tam\mu_p3.mjs`, `mu_p3b.mjs`).
- Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ "✔ đạt cổng" (2 phần · 45 câu · 4 hình đề).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Tiêu đề PHẦN 31 | định dạng | «Phần 1: Bài tập trắc nghiệm — V. Giới hạn, hàm số liên tục» → «V. Giới hạn, hàm số liên tục» | Khớp đúng tên PHẦN 23 của khúc 2 (cùng chương V in trên đề tr.8); điều phối yêu cầu khớp tên |
| Toàn tệp (116 lệnh) | định dạng | Bỏ `\left` / `\right` (thay bằng ngoặc thường) | brief-cki: không `\left` `\right` (khúc 1, 2 đã bỏ) |
| P32 Câu 6 | lập luận | Viết lại ý d: dựng giao tuyến $\Delta$ của $(SAB)$, $(SCD)$ qua $S$ song song $AB$; $P=MC\cap\Delta$, $Q=AN\cap\Delta$ (nêu lí do cắt nhau), rồi thẳng hàng; sửa Bước 5 Phần 1 cho khớp | Đề yêu cầu TÌM giao điểm; bản soạn chỉ đặt tên $P$, $Q$ mà không dựng, cũng không chứng minh tồn tại |
| P32 Câu 9 | hình | Vẽ thêm `giai_P32C9.png` (hình bình hành, 4 tia song song, thiết diện $A'B'C'D'$, $O$, $O_1$) + khai `**Hình giải:**` | Câu hình KG tự luận, lời giải dùng $O$, $\Delta$, $O_1$, hai hình thang — cần hình |
| P32 Câu 1b | lập luận | Câu ĐKXĐ «luôn thỏa vì … có nghĩa» (vòng vo) → nêu điều kiện rồi nói nghiệm của phương trình tự thỏa | Diễn đạt vòng |
| P32 Câu 13b | trình bày | $\sqrt{3\cdot1+1}$ → $\sqrt{3\cdot(-1)^2+1}$ | Thay $x=-1$ phải hiện rõ |
| Hình `giai_P32C5` | hình | Rút ngắn nét $d$, chuyển nhãn $d$ sang đầu trái | Nét $d$ đè lên nhãn $M$ và $N$ |
| Hình `giai_P32C8` | hình | Dời nhãn $G_2$ | Nhãn đè nét $B'C$ |
| Hình `giai_P32C10` | hình | Dời nhãn $I$ | Nhãn đè nét $BK$ |

Đã kiểm, không sửa:
- Câu 20b (PHẦN 31): $\sqrt{3\cdot2-2}-2=0$ ⇒ $f$ không xác định tại $x=2$ ⇒ gián đoạn tại 2 (Đúng) — khớp Pha 1. Câu 20d: $\lim_{x\to1^+}f=2$ (máy: $2{,}0000005$) nên cần $m=3$; $m=1$ ⇒ Sai.
- Câu 21d: $\lim_{x\to1^+}f=\frac14$ (máy: $0{,}2500000$) $=1+m$ ⇔ $m=-\frac34$; TXĐ $\mathbb R\setminus\{4\}$, liên tục trên TXĐ ⇒ Đúng.
- Câu 9 (PHẦN 31): $3\cdot4+14+11=37$ — đã kiểm máy, A.
- Câu 1d: hai họ nghiệm thay lại sai số $<10^{-14}$; quét $[0;28\pi)$ được 77 nghiệm phân biệt = số nghiệm khác nhau của hai họ (hai họ có phần trùng nhau, không sót).
- Hình đề `de_P32C4` (bảng), `de_P32C11` (kệ, đủ nhãn A–L), `de_P32C14`, `de_P32C15`: đúng câu, đủ. `de_P32C4` có vài vết dấu chữ dòng dưới ở mép đáy — cắt lại thì mất viền bảng nên giữ.
- Hình `giai_P32C6`, `giai_P32C7`: đúng dữ kiện (đã kiểm toạ độ trong `ve_p3.mjs`: $P,Q$ trên đường qua $S$ song song $AB$; $AM=BN$, $M'N'\parallel DF$).

## Câu còn «Chưa chắc» / «đề sai»

Không có. (Ghi chú cho CEO: PHẦN 31 và PHẦN 23 cùng tên «V. Giới hạn, hàm số liên tục» nhưng khác số ⇒ khi ghép thành hai PHẦN liền nhau; nếu muốn một PHẦN duy nhất thì phải đổi số PHẦN 31 → 23 — chưa đổi.)
