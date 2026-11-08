KẾT LUẬN: ĐẠT

# pnl-b2-p1 — biên bản soát (nhân chứng thứ hai)

- Số câu: **97** (79 tự luận đã tách ý · 18 trắc nghiệm · 0 giảng · 0 Đ/S), tất cả `luyen`. `kiem.mjs`: ✔ đạt (trước và sau sửa).
- Lệch đáp số Pha 1 (giải mù, `pnl-b2-p1.kiem.md`) so với bản soạn: **trước 0 / sau 0**. Cả 97 câu được kiểm lại bằng node (hai phía của điểm / x rất lớn), khớp hết.
- Phân xử bằng máy các điểm trạm soạn nêu:
  - **d1bt3e**: x = 2 ± 10⁻⁶ cho −0,25 ở cả hai phía ⇒ **−1/4 đúng**, sách 1/4 sai (lời giải sách bỏ dấu khi giản ước (2−x)/(x−2)). Giữ −1/4.
  - **d3bt1h**: mẫu 2−x²−3x tại x = 1 bằng −2 ≠ 0; x = 1 − 10⁻⁶ cho ≈ −5·10⁻⁷ ⇒ **0 đúng theo đề in**. Lời giải sách phân tích mẫu như (1−x)(x+2) = 2−x−x² (khi đó ra +1/3, sách lại ghi −1/3) ⇒ sách sai cả hai chỗ. Giữ 0 + dòng "Lưu ý".
  - **d4bt10**: d' = df/(d−f), hai phía +∞ / −∞ ⇒ không tồn tại lim tại f; sách ghi "= ∞" (vô cực không dấu, cách viết cũ). Bản soạn đúng.
  - **d1bt3f**: đề in "+x+4" ⇒ x = 1 ± 10⁻⁶ cho ∓1,6·10⁶ (không có giới hạn); với "+x−4" ra −4/15 = −0,2667 khớp lời giải sách (sách tách tử thành √(2x+7)−3+x−1). Sửa chữ đề hợp lệ (lỗi in hiển nhiên, đáp án rõ).
  - **tn3**: tử x⁴+x²+2 ⇒ K = 4/5, H+K = 4/5 không có phương án; lời giải sách dùng x²+2 ⇒ 3/5 (D). Sửa chữ đề hợp lệ.
  - **d1bt1h**: sin(1/2) là hằng ⇒ 0; nếu là sin(1/x) cũng ra 0 (kẹp — ngoài whitelist chương nhưng đáp số không đổi). Giải như in là đúng.
  - **tn7**: lim = 1/4; đề không nói a/b tối giản ⇒ chỉ B (b = 4a) đúng với mọi cặp; A (a+b=3), C, D (a·b=1) sai với (1,4). Chọn B đúng.
  - **tn10**: đề in x → −3 nhưng mẫu giả thiết là x+2 (lạ, nhưng tự nhất quán): lim f = −3 ⇒ đáp số −1 (C) khớp sách.
- Đề chuẩn hoá đối chiếu nguồn `don-vi/pnl-b2-p1.txt`: đủ Dạng 1 BT1–3 (a–l / a–j / a–i), Dạng 2 BT1–2, Dạng 3 BT1–4, Dạng 4 BT1–14, Câu 1–18; số / dấu / mũ giữ đúng. d4bt10 bỏ hình minh hoạ (đề đủ chữ để giải) — đúng.
- Phạm vi: không L'Hôpital / đạo hàm / `\times` / `\left` `\right` (d4bt8 tính bằng phân tích nhân tử, không gọi tên đạo hàm). TN không lộ phương án ở Phần 1. `kiem` đều tính lại từ hàm của đề (không tautology); d1bt1i/j kiểm với n, m đại diện; tn10 kiểm bằng f đại diện.
- Phần 2 nhiều dòng nối chuỗi `= … = …` trong cùng một phép tính giới hạn — giữ như lô pnl-b1-p1 đã duyệt.

## Sửa

| id | lỗi | sửa gì |
|---|---|---|
| d1bt1f | lời giải (Phần 1 khuôn sai) | Phần 1 dùng khuôn "phân thức" (tính tử, mẫu, lập tỉ số) cho biểu thức không có mẫu ⇒ viết lại: kiểm căn lồng nhau không âm → thay từ căn trong ra ngoài → trừ √x. |
| d1bt1h | lời giải (Phần 1 khuôn sai) | Như trên (biểu thức là tích x²·hằng số) ⇒ viết lại theo quy tắc tích với hằng số. |
| tn1 · tn2 | lời giải (Phần 1 khuôn sai) | Bước 2 "tính riêng tử thức và mẫu thức" cho đa thức / trị tuyệt đối không có mẫu ⇒ viết lại cho đúng biểu thức. |
| d3bt1h | lời giải (Phần 1 gần lộ đáp số) | Bước 3 "tử dần về 0 quyết định giới hạn" ngầm nói đáp số 0 ⇒ đổi thành "dùng quy tắc thương: thay x = 1 vào tử và mẫu rồi kết luận". |
| d2bt2e | dạng | NDB01180 → **NDB01184** (vừa): lời giải (cả sách lẫn bản soạn) không liên hợp, mà rút x thành tích x·(√(1−2/x)−√2) với thừa số còn lại → 1−√2 < 0 rồi áp quy tắc tích — đúng mô tả 01184; 01184 đứng sau 01180 ⇒ dạng sau thắng. |

Giữ nguyên (đã xét): **d2bt2c** ở NDB01181 (vừa) — tại x → 0 đúng là dạng 0·∞ (x → 0, 1−1/x → ∞), nhân phân phối đưa về x−1; 01181 đứng sau 01169 ⇒ giữ. d2bt1g/h, tn13 giữ NDB01183 (phân thức tử bậc cao hơn — dạng riêng, không đẩy sang 01184). d3bt1c/d/f, d3bt2b ở 01182; d3bt4 ở 01177 (sau 01174); d1bt3f ở 01172 (một căn); d1bt3h ở 01173 (căn ở cả tử và mẫu).

## Còn nghi — cần CEO

1. **d1bt1k ≡ d2bt1a, d1bt1l ≡ d2bt1b** — sách in lặp y hệt (Dạng 1 BT1 k, l = Dạng 2 BT1 a, b). Bản soạn nhập cả hai (cùng dạng 01178 / 01179) ⇒ kho sẽ có 2 cặp câu trùng. Đề xuất: khi ghi DB chỉ nhập bản ở Dạng 2 (d2bt1a, d2bt1b), bỏ d1bt1k, d1bt1l. Tôi chưa bỏ khỏi JSON.
2. **d1bt3e** — sách 1/4, máy và cả hai bản giải: **−1/4**. Giữ −1/4 + "LỆCH SÁCH".
3. **d3bt1h** — đề in cho **0** (sách −1/3, mà theo chính phân tích của sách phải là +1/3). Không biết đề gốc định viết mẫu gì (x²+x−2 ⇒ −1/3 khớp sách). Thùy chọn: (a) giữ đề in, đáp số 0 (hiện tại — câu thành thay trực tiếp, không còn là bài trị tuyệt đối "thật"); hoặc (b) sửa mẫu thành $x^{2}+x-2$ ⇒ −1/3, khớp đáp số sách.
4. **d4bt10** — sách ghi lim_{d→f} φ(d) = ∞; bản hiện tại: "không tồn tại" (hai phía ±∞). Đúng theo SGK KNTT; chỉ báo để biết.
5. **d2bt2e** — nếu Thùy muốn mọi bài "∞−∞" (kể cả không khử được) ở 01180 thì trả về 01180 (`.goc.json` còn giữ).
