KẾT LUẬN: ĐẠT

# Biên bản soát — NT-GKI-2026 · P6 (PHẦN 5 — Tỉ số lượng giác, bài tập thực hành, Bài 1–3)

- Trạm soát: Opus, giải mù trước (`NT-GKI-2026.p6.kiem.md`, máy `<LV>\tam\soat_p6.mjs`) rồi soát bản soạn.
- Số câu: **3** (3 tự luận, `kho=hinh_hoc`) · khớp Pha 1 ngay từ đầu: **3/3** · phải sửa: **0**.
- Không có chỗ sửa ⇒ không tạo `NT-GKI-2026.p6.soan.goc.md` (bản soạn giữ nguyên).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: **✔ đạt cổng** (3 câu · hình 3 · chưa chắc 2).

## Đối chiếu từng câu

- **Bài 1** — đề khớp ảnh p-09 và Hình 19 (đủ $A,B,C,H,E$, không cần hình giải). Đáp số khớp máy: $BC=5$ cm, $AH=\dfrac{12}{5}=2{,}4$ cm, $\widehat B=53{,}13^\circ\approx53^\circ$, $\widehat C\approx37^\circ$,
  $BE=\dfrac{15}{7}\approx2{,}1$ cm, $CE=\dfrac{20}{7}\approx2{,}9$ cm. $AH$ tính bằng $\sin B$ trên hai tam giác vuông (không dùng hệ thức đường cao); góc dùng định nghĩa tỉ số, $\widehat C$ suy từ góc phụ;
  phân giác dùng tính chất lớp 8. Phần 1 5 bước, không lộ đáp số. Không tách ý, Phần 2 ghi a) b) c).
- **Bài 2** — đề có thêm $AB\perp BC$, $BC=5{,}8$ m, $\widehat{ACB}=60^\circ$ lấy từ hình (Ghi chú của người gõ, đúng hình đề). $AB=5{,}8\cdot\tan60^\circ=5{,}8\sqrt3\approx10{,}05$ m — khớp máy, làm tròn đúng hàng phần trăm theo đề.
  `tu_luan` đúng (10,05 dài 5 kí tự).
- **Bài 3** — đề khớp ảnh p-10; chữ $x$ trên hình đề nằm ở góc giữa tia nắng và thân cây ⇒ hiểu đúng là $\widehat{BAC}$. $\tan\widehat{BAC}=\dfrac{3{,}2}{6}=\dfrac{8}{15}$ ⇒ $28{,}07^\circ\approx28^\circ$ — khớp máy.
  Hình giải `giai_P5B3.png`: tam giác vuông tại $B$, tỉ lệ $6:3{,}2$ đúng, chỉ ghi $6$ m và $3{,}2$ m, không ghi góc phải tìm, nhãn không đè / không cụt.
  Giữ `tu_luan`: đề không nêu cách làm tròn nên đáp số phụ thuộc cách làm tròn tự chọn (28 / 28,1 / 28°4') — chưa đủ chắc để đổi sang trả lời ngắn.

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| — | — | Không sửa | Cả 3 câu đúng đề, đúng đáp số, đúng luật kiến thức khối 9 / `hgt\k9.md`, đúng khuôn |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 1** — đề không nêu cách làm tròn: góc làm tròn tới độ ($53^\circ$, $37^\circ$), $BE$, $CE$ làm tròn 1 chữ số thập phân (giữ cả phân số đúng $\dfrac{15}{7}$, $\dfrac{20}{7}$) theo mặc định `hgt\k9.md`. Đáp số đã kiểm chắc.
- **Bài 3** — đề không nêu cách làm tròn: góc làm tròn tới độ ($\approx28^\circ$); vì vậy để `tu_luan`. Đáp số đã kiểm chắc.
