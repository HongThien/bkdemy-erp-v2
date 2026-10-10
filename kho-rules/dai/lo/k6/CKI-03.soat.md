KẾT LUẬN: ĐẠT

# Biên bản soát — CKI-03 (THCS Ngọc Lâm, Long Biên — kiểm tra học kì I Toán 6, 2024–2025, mã đề 601)

- Trạm soát: Opus, 10/10. Pha 1 giải mù từ ảnh trang (ghi `CKI-03.kiem.md` trước khi mở bản soạn); Pha 2 soát `CKI-03.soan.md`.
- Bản soạn nguyên gốc trước khi sửa: `CKI-03.soan.goc.md`.
- **Số câu: 20** (8 trắc nghiệm · 8 trả lời ngắn · 4 tự luận; HGT 3 câu; 2 câu có hình). Đề không có phần tiếng Anh "Hệ T", không câu nào bị bỏ.
- **Khớp đáp án Pha 1 ngay từ đầu: 20 / 20** (Bài 5: cùng một tập nghiệm, bản soạn viết 2 cặp + "đổi vai trò", Pha 1 viết đủ 4 cặp).
- **Số câu phải sửa: 5** (Câu 3, Câu 8, Bài 2c, Bài 2d, Bài 5) — không câu nào sai đáp số, không câu nào chép sai đề.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng sau khi sửa (20 câu, chưa chắc 0).

## Chép đề — đã đối chiếu từng câu với ảnh trang + ảnh cắt 300 dpi từ `goc.pdf`

Số, dấu âm, số mũ đều khớp: Câu 2 (7 số, 4 phương án), Câu 4 ($B=\{2024;-3;0;1\}$ và 4 phương án), Câu 6 ($-(-3+5-7)$), Bài 1c ($5^5:5^3.(2024^0-9)+3.10^2$),
Bài 1d ($[126+(-38)]-[-38-(-126)]$), Bài 2b ($(x-18)-2^3=-23$), Bài 2c ($(x^2-9)(10+5x)=0$), Bài 2d ($60\vdots x$; $90\vdots x$; $x\ge 10$),
Bài 4 (34 m, 56 m, 25 m, 10 m × 15 m, 248 m²), Bài 5 ($a+b=128$, ƯCLN $=16$). Lỗi in của đề gốc "bác Bình một xây ngôi nhà" đã có `Ghi chú`.

## Hình

- `p1c8_chung.png` (Câu 8): đủ 4 hình + nhãn Hình 1–4, không cụt, không dính chữ câu khác.
- `p2c4_lai.png` (Bài 4): đủ hình thang, nhãn 34m / 56 m / 25m, ao 248 m², nhà 15 m × 10 m, không cụt.

## Phân xử Câu 8 (trạm soạn ghi `Chưa chắc`)

Cắt 300 dpi vùng hình (`pdftoppm -r 300 -f 1 -l 1 -x 380 -y 2600 -W 1700 -H 440`), xem bằng mắt và đo bằng máy (tỉ lệ điểm ảnh nét vẽ trùng với ảnh
lật của chính nó, dung sai 5 px):

| Hình | Lật qua trục đứng | Lật qua trục ngang | Quay 180° | Kết luận |
|---|---|---|---|---|
| Hình 1 (chữ N + gạch ngang giữa; khung 197 × 258 px) | 0,73 | 0,73 | 1,00 | **Không** có trục đối xứng, chỉ có tâm đối xứng. Chỉ có MỘT nét chéo (đỉnh trên-trái → chân dưới-phải); khung không vuông nên cũng không có trục chéo |
| Hình 2 (đường tròn có tâm) | 1,00 | 1,00 | 1,00 | Có trục |
| Hình 3 (chữ T) | 0,99 | 0,59 | 0,59 | Có trục (trục đứng) |
| Hình 4 (lục giác đều) | 1,00 | 1,00 | 1,00 | Có trục |

⇒ Hình có trục đối xứng: 2; 3; 4 ⇒ **B**. Ba phương án còn lại đều chứa Hình 1 nên không có cách hiểu thứ hai. Đã xoá dòng `Chưa chắc`.

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 3 | định dạng (Phần 1) | Viết lại Bước 1, Bước 2: bỏ bước "Đọc kĩ yêu cầu: tìm khẳng định sai…", thay bằng hai bước nghĩ thật (kiểm hai khẳng định về số nguyên · kiểm khẳng định chia hết cho 5 theo chữ số tận cùng) | Brief soạn cấm bước kiểu "Đọc kĩ đề"; ý "đề hỏi khẳng định sai" đã nằm ở Mấu chốt |
| Câu 3 | lập luận (Phần 2) | Dòng B: "Các số có hai chữ số chia hết cho 5 lớn nhất là 95" → "Các số $99;98;97;96$ không chia hết cho 5, số 95 chia hết cho 5 nên số lớn nhất có hai chữ số chia hết cho 5 là 95" | Câu cũ sai ngữ pháp và chỉ nhắc lại khẳng định, không có lí do |
| Câu 8 | hình (phân xử) | Xoá `Chưa chắc`; Phần 2 thêm lí do Hình 1 không có trục (gấp theo đường đứng / ngang qua giữa hình thì nét chéo hai nửa không trùng) | Đã kiểm chắc chắn bằng ảnh 300 dpi + đo máy (bảng trên) |
| Bài 2c | định dạng | `$x=-10:5$` → `$x=(-10):5$`; thêm dòng `$x^2=0+9$` trước `$x^2=9$`; Phần 1 Bước 2 "hai phương trình riêng" → "hai bài tìm $x$ riêng" | Số âm trong phép tính phải để trong ngoặc (brief soạn); khuôn tìm thành phần chưa biết ghi đủ dòng (như dòng `$5x=0-10$` của chính câu này); "phương trình" chưa phải từ của lớp 6 |
| Bài 2c | kiến thức (phân xử) | Xoá `Chưa chắc` | "Tích bằng 0 thì có thừa số bằng 0" và "$3^2=(-3)^2=9$" là cách duy nhất ở lớp 6 cho dạng này, chính đề đòi; lời giải đúng toán, đã vét cạn bằng máy: $x\in\{-3;-2;3\}$ |
| Bài 2d | lập luận | Thêm dòng đầu "Vì $x$ là số nguyên và $x\ge 10$ nên $x$ là số tự nhiên khác 0." | Đề cho $x$ là số **nguyên**; phải nói rõ $x$ dương trước khi viết $x\in\text{ƯC}(60;90)$ chỉ gồm ước dương |
| Bài 5 | lập luận (kết luận) | Kết luận viết đủ 4 cặp $(16;112);(112;16);(48;80);(80;48)$ thay cho "2 cặp + đổi vai trò cũng thoả mãn"; `Ghi chú` sửa theo | Lời giải có "Giả sử $a\le b$" thì kết luận phải trả lại đủ các cặp; khớp Pha 1 (máy vét: 4 cặp) |
| Bài 5 | kiến thức (phân xử) | Xoá `Chưa chắc` | Cách đặt $a=16m$, $b=16n$, $(m,n)=1$ là cách chuẩn; lời giải đã tự lập luận vì sao $m$, $n$ nguyên tố cùng nhau (đúng luật `k6.md` §1.2); đúng toán |

## Đã soát, không sửa

- Câu 1, 2, 4, 5, 6, 7 · Bài 1a–1d · Bài 2a, 2b · Bài 3.1, 3.2 · Bài 4: đề đúng ảnh, đáp án khớp Pha 1, lời giải đúng từng dòng, tìm $x$ theo thành phần chưa biết
  (không chuyển vế), dấu nhân là dấu chấm, Phần 1 đủ 3–4 bước nghĩ thật, không lộ đáp số.
- Phân loại: `kho=hgt` cho Câu 7, Câu 8, Bài 4 — đúng. Trả lời ngắn: $-100$, $4000$, $100$, $0$, $-20$, $3$, $360$, $-6$ đều là một số ≤ 4 ô theo đúng
  đơn vị đề hỏi. Bài 2c, 2d, 5 (đáp số là tập hợp / nhiều cặp) và Bài 4 (lời văn 2 ý) để `tu_luan` — đúng.
- Tách ý: Bài 1, Bài 2 tách từng ý; Bài 3 gom hai bài toán khác hẳn nhau ⇒ `Bài 3.1`, `Bài 3.2` — đúng luật; Bài 4 giữ chung.
- `Ghi chú` còn lại đều là điều người duyệt cần biết (đáp số dạng tập hợp, lỗi in của đề, lí do tách Bài 3) — giữ.

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.

Điều chung CEO cần biết (không phải nghi ngờ về đáp số): đề cuối kì có Ch III (số nguyên: Câu 2–6, Bài 1a, 1c, 1d, Bài 2, Bài 3.2) và Ch V (đối xứng: Câu 8)
mà bản đồ K6 chưa có lý thuyết / khuôn (`k6.md` §7 Q5) — lời giải đang theo SGK Kết nối tri thức 6; khuôn trình bày các nhóm này chờ CEO duyệt ở lô thử.
