KẾT LUẬN: ĐẠT

# NS-GKI-2026 · Phần 9 — BIÊN BẢN SOÁT (13/10)

Phạm vi: phần C. Bài tập tham khảo và nâng cao — Bài 1 (a–e), Bài 2 (a, b) `kho=dai`; Bài 3, Bài 4 `kho=hgt` (nửa dưới trang 4 của đề cương). Cả 9 câu `loai=tu_luan`.
(Bài 5 phần C in lặp nguyên văn Bài 5 phần B — người dựng khung đã gộp, không thuộc tệp này.)
Giải mù: `NS-GKI-2026.p9.kiem.md` · máy: `<LV>/tam/mu_p9.mjs` (mỗi bất đẳng thức ≥ 20 000 bộ số gồm biên, số âm, hai số bằng nhau; bản IN thử riêng để tìm phản ví dụ;
Bài 2: 200 000 bộ số dương + từng bất đẳng thức kẹp; Bài 3 quét lưới; Bài 4 dựng toạ độ) · ảnh phóng to: `<LV>/z/soat9_b1.png`, `soat9_b2.png`, `soat9_b34.png` (260 dpi), `soat9_b1d.png` (400 dpi) ·
bản gốc trước khi sửa: `NS-GKI-2026.p9.soan.goc.md` · cổng: ✔ đạt cổng (9 câu, chưa chắc 6).

- Số câu: **9**
- Khớp Pha 1 ngay từ đầu (hướng chứng minh / đáp số): **9 / 9**
- Số câu phải sửa: **5** — định dạng 3 (Bài 1d, 2a, 2b) · hình 2 (Bài 3, Bài 4). Thêm 1 dòng `Chưa chắc` của trạm soát ở Bài 1e. Không có lỗi chép đề, đáp số, lập luận, kiến thức, phân loại.

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1d | định dạng (Phần 1) | Bước 3: "nhờ hằng đẳng thức hiệu hai số" → "nhờ hằng đẳng thức bình phương của một hiệu" | Gọi sai tên hằng đẳng thức ($2a^2-4a+2=2(a-1)^2$ là bình phương của một hiệu) |
| Bài 2a | định dạng | Hai dòng tiêu đề in đậm trong Phần 2 ("**Chứng minh …**") → câu thường "Trước hết, ta chứng minh … $>1$." / "Tiếp theo, ta chứng minh … $<2$."; phần chứng minh nhận xét $\dfrac{x}{p}<\dfrac{x+y}{p+y}$ tách từ MỘT dòng ba dấu "=" thành mỗi phép biến đổi một dòng | Brief soạn mục 4: chữ đậm chỉ cho nhãn quy định; mỗi phép biến đổi một dòng |
| Bài 2b | định dạng | Như Bài 2a; ngoài ra dòng chứng minh nhận xét của bản soạn nhảy cóc (bỏ bước khai triển tử) và dồn cả kết luận "$>0$ vì …" — viết đủ ba dòng + một dòng xét dấu | Như trên |
| Bài 3 | hình | `giai_C3.png`: dời chữ "15 cm" sát đoạn $AM$ hơn; tăng chiều cao canvas 380 → 395 | Chữ nằm lơ lửng giữa tam giác $ABM$, khó biết là số đo của $AM$; chừa chưa đủ 35 px dưới nhãn đáy (brief soạn mục 3.5) |
| Bài 4 | hình | `giai_C4.png`: tăng chiều cao canvas 340 → 365 | Chừa chưa đủ 35 px dưới nhãn "8 cm" (mới 11 px) |
| Bài 1e | (thêm `Chưa chắc` của trạm soát) | Thêm dòng nói về dấu ngoặc nhọn "$\}$ với $a,\ b,\ c>0$" của bản in | Xem mục "Đề in sai" bên dưới |

## Đề in sai — đã đọc lại ở 260 / 400 dpi và thử bằng máy

| Ý | Đúng như in | Máy | Bản người gõ nhập | Nhận định |
|---|---|---|---|---|
| 1a | $ab\le\dfrac{(a+b)^2}{2}\le\dfrac{a^2+b^2}{2}$ | vế sau SAI ($a=b=1$: $2\le1$); vế đầu đúng | mũ $2$ cho cả phân số | Đúng, là bài gốc quen thuộc. Giữ. |
| 1b | $\dfrac{a^3+b^3}{2}\ge\dfrac{(a+b)^3}{2}$; với $a,\ b\ge0$ | SAI ($a=b=1$: $1\ge4$) | mũ $3$ cho cả phân số | Đúng. Điều kiện $a,\ b\ge0$ là cần (bỏ thì $a=0$, $b=-1$ sai) — lời giải có dùng $a+b\ge0$. |
| 1c | $a^4+b^4\ge a^2b+ab^3$ | SAI ($a=b=\dfrac12$) | $a^3b$ | Đúng. |
| 1d | $a^4+3\ge4a$ | đúng | như in | Không lỗi. |
| (không nhãn, cùng dòng ý d) | $a^2+b^2+c^2>(ab+bc+ca)\ \}$ với $a,\ b,\ c>0$ | dấu ">" SAI khi $a=b=c$ (kể cả dương) | ý e), dấu "$\ge$", mọi số thực | Cách nhập hợp lí và tối thiểu. Tôi KHÔNG thấy cách khôi phục nào chắc hơn; nhưng dấu ngoặc nhọn + điều kiện dương (thừa với bất đẳng thức này) cho thấy có thể một ý khác đã mất khi in (bài cùng chùm: $a^3+b^3+c^3\ge3abc$ với $a,\ b,\ c>0$). Không đổi đề — đã ghi `Chưa chắc`. |
| Bài 2 | lời dẫn "Tính giá trị của biểu thức:", không điều kiện | không dương thì sai: 2a $(1;-2;3)$ cho $-2{,}25$; 2b $(5;-1;-1;1)$ cho $\approx2{,}67$ | "Cho $a,\ b,\ c,\ d$ là các số dương. Chứng minh:" | Đúng bài gốc. Góp ý nhỏ (không sửa): ở ý a chữ $d$ trong lời dẫn là thừa. |
| Bài 4 (hình) | hình vẽ $B$, $C$ ở trên, $A$, $D$ ở dưới, hai đáy $BC$, $AD$, chỉ đánh dấu vuông ở $A$ | — | bỏ hình đề, vẽ theo lời văn | Xác nhận hình lệch lời văn ($\widehat{A}=\widehat{D}=90^\circ$ buộc $AB\parallel CD$, $AD$ vuông góc hai đáy). Bỏ là đúng. |

## Đã soát, không phải sửa

- **Đề** 9 câu khớp ảnh (trừ các chỗ người gõ đã xử lí ở bảng trên). Lời dẫn Bài 1 viết lại cho số ít khi tách ý — đúng luật tách ý.
- **Bài 1**: cả 5 ý xét hiệu rồi đưa về (tổng) bình phương, không dùng Cô-si. Đã tự khai triển lại từng dòng và máy kiểm các đồng nhất thức: 1a hai hiệu cùng bằng $\dfrac{(a-b)^2}{4}$;
  1b hiệu $=\dfrac{3(a-b)^2(a+b)}{8}$, có nêu $a+b\ge0$ từ điều kiện; 1c hiệu $=(a-b)^2(a^2+ab+b^2)$ và $a^2+ab+b^2=\left(a+\dfrac b2\right)^2+\dfrac{3b^2}{4}$;
  1d hiệu $=(a^2-1)^2+2(a-1)^2$; 1e hiệu $=\dfrac12[(a-b)^2+(b-c)^2+(c-a)^2]$. Mỗi bước đúng với mọi số thực (1b: mọi $a,\ b\ge0$). Dấu "=" nêu đủ và đúng ($a=b$; $a=1$; $a=b=c$).
- **Bài 2**: kẹp dưới bằng so sánh hai phân số cùng tử dương, mẫu dương (có nêu mẫu dương ngay dòng đầu); kẹp trên bằng nhận xét $\dfrac{x}{p}<\dfrac{x+y}{p+y}$ với $x,\ y,\ p>0$, $p>x$ — có chứng minh bằng xét hiệu,
  mỗi lần áp dụng đều chỉ ra $p>x$. Máy kiểm từng bất đẳng thức kẹp. Lập luận chặt.
- **Bài 3**: $BC=30$, $AB=18$, $AC=24$; 8 tỉ số khớp Pha 1. Phương trình $AB^2-42AB+432=0$ giải bằng tách hạng tử → phương trình tích, không $\Delta$ / Viète; chọn nghiệm theo $AB<AC$. Tỉ số viết theo định nghĩa, có nêu tam giác vuông tại $A$.
- **Bài 4**: ý a đi đường $\widehat{ABD}=\widehat{DAC}$ (cùng phụ $\widehat{ADB}$) ⇒ $\triangle ABD\backsim\triangle DAC$ (g.g) — đúng thứ tự đỉnh; ý b $OA:OC$ lấy từ $\triangle OAB\backsim\triangle OCD$ + dãy tỉ số bằng nhau, không dùng hệ thức đường cao.
  $OA=3{,}6$; $OC=6{,}4$; $S=37{,}5$ khớp Pha 1 (kiểm chéo $S=\dfrac{AC\cdot BD}{2}$). Số đúng, không làm tròn.
- **Kiến thức**: không `⇔`, không "tập nghiệm", không căn thức chương III (chỉ $AD^2=36$, $AD>0$ ⇒ $AD=6$).
- **Phần 1**: 3–5 bước mỗi câu, là bước nghĩ thật, không lộ kết quả (Bài 3, 4 không ghi số nào của đáp số; dòng Chú ý không lộ).
- **Phân loại**: 9 câu `tu_luan`, `dap_an=—` đúng (chứng minh; Bài 3 tám tỉ số; Bài 4 nhiều ý).
- **Hình giải**: `giai_C3.png` (tỉ lệ 18 : 24, $M$ trung điểm $BC$, ghi 15 cm), `giai_C4.png` (dựng đúng $AB=4{,}5$, $CD=8$, $AD=6$ ⇒ $AC\perp BD$; đánh dấu vuông ở $A$, $D$, $O$; chỉ ghi hai số đo đề cho) — đủ điểm, đúng tên, không ghi kết quả phải tìm.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 1a, 1b, 1c** — đề cương in sai số mũ / vị trí mũ; người gõ nhập dạng đúng (máy xác nhận bản in sai, bản nhập đúng).
- **Bài 1e** — bất đẳng thức in không nhãn, dấu ">" sai, đã nhập "$\ge$" thành ý e); (trạm soát thêm) dấu ngoặc nhọn "với $a,\ b,\ c>0$" có thể là phần sót của một ý khác đã mất khi in.
- **Bài 2a, 2b** — lời dẫn in "Tính giá trị của biểu thức", không điều kiện; người gõ nhập "Cho … là các số dương. Chứng minh" (điều kiện dương là cần).
