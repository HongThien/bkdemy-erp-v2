KẾT LUẬN: ĐẠT

# CKI-12 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Tân Triều — kiểm tra đánh giá cuối học kỳ I Toán 6, 2025–2026, 90 phút (2 trang: 8 câu trắc nghiệm + 5 bài tự luận; không có phần tiếng Anh "Hệ T", không ghi mã đề).
> Pha 1 giải mù: `CKI-12.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `CKI-12.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (17 câu: 8 TN · 6 TLN · 3 tự luận · HGT 3 · hình 2 · chưa chắc 0).

## Số liệu

- Số câu: **17** (Câu 1–8; Bài 1a, 1b, 1c; Bài 2a, 2b, 2c; Bài 3; Bài 4; Bài 5). Không sót, không thừa, không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **17 / 17** (TN: A · B · A · B · C · C · C · A; Bài 1: 49 · −5700 · 100; Bài 2: −30 · −20 · 1; Bài 3: 360;
  Bài 4: 100 m, 600 m² · 16 m² · 4160000 đồng; Bài 5: bốn cặp $(0;14)$, $(-1;-10)$, $(1;6)$, $(-2;-2)$).
- Số câu phải sửa: **4 / 17** (Bài 2c — chép đề; Bài 4 — chép đề; Câu 8 — lập luận; Bài 5 — kiến thức + xoá dòng `Chưa chắc`). **Không đổi đáp số nào.**

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2c | chép đề | Đề, Mấu chốt, Bước 1 và dòng đầu Phần 2: $2023^0$ ⇒ $20235^0$. Viết lại dòng `Ghi chú` (bản cũ: "Đề gốc in $2023^0$ — đọc theo lớp chữ của PDF") thành: đề gốc in $20235^0$, giữ nguyên như đề, nhiều khả năng gõ nhầm $2025^0$, đáp số không đổi. Bước 4: "phương trình của số mũ" ⇒ "đẳng thức của hai số mũ" | Ảnh trang cắt 400 dpi in rõ `20235` (năm chữ số, cùng cỡ, trên dòng) rồi số mũ `0`; lớp chữ của PDF cũng là `202350` (= 20235 + mũ 0), **không phải** 2023. Bản soạn chép theo bản máy gõ (`de.json` ghi $2023^0$) và ghi chú sai về nguồn. Giá trị vẫn là 1 nên $x=1$ không đổi. "Phương trình" không phải từ của lớp 6 |
| Bài 4 | chép đề | Đề: "260000 đồng" ⇒ "260 000 đồng" | Đề chép nguyên văn; số viết liền chỉ áp cho số trong công thức (mẫu GKI-01 và các đề khác trong lô giữ "125 000 đồng" ở phần chữ) |
| Câu 8 | lập luận | Mấu chốt: «…hình bình hành không là hình thang cân, hình chữ nhật, hình tròn nên là hình duy nhất không có trục» ⇒ «hình có trục đối xứng là hình gập đôi được theo một đường thẳng sao cho hai nửa trùng khít; cần tìm hình không có đường gập nào như vậy» | Suy luận cũ sai lô-gic: "không là hình thang cân / hình chữ nhật / hình tròn" không kéo theo "không có trục" (hình thoi cũng không là ba hình đó mà có 2 trục). Lí do đúng đã nằm ở Bước 2, Chú ý và Phần 2 — Mấu chốt chỉ cần nêu tiêu chí gập đôi |
| Bài 5 | kiến thức | Phần 1 Bước 2: "rồi **chuyển hằng số sang vế phải** và đặt $(y-2)$ làm thừa số chung" ⇒ "số 2 dư ra là một số hạng của tổng bằng 14 nên phần còn lại bằng tổng trừ đi 2, rồi đặt $(y-2)$ làm thừa số chung" | `k6.md` §1 luật 4: không dùng "chuyển vế" — tìm thành phần chưa biết. Phần 2 vốn đã viết đúng kiểu này (dòng $…+2=14$ ⇒ $…=12$), chỉ lời ở Phần 1 dùng chữ chuyển vế |
| Bài 5 | định dạng (dòng `Chưa chắc`) | Xoá dòng `Chưa chắc` của trạm soạn ("bài nâng cao dùng ước của số nguyên … Chương III chưa có lý thuyết trên bản đồ … cần CEO xem khuôn"); chuyển ý "khuôn Ch III–V chờ CEO duyệt" xuống mục "GHI CHÚ CHO NGƯỜI DUYỆT" (áp cho mọi câu Ch III–V của đề, không riêng Bài 5) | Đã kiểm chắc chắn: máy vét $x,y$ từ −200 đến 200 ra đúng 4 cặp như bản soạn; Pha 1 giải độc lập ra cùng phân tích $(2x+1).(y-2)=12$ và cùng 4 cặp; từng dòng biến đổi đúng; kiến thức dùng (ước của số nguyên, tính chất phân phối) có trong SGK KNTT 6 Chương III. Điều còn mở là **khuôn trình bày** Ch III–V chưa có trên bản đồ — việc chung của cả bộ CKI (Q5 `k6.md`), không phải nghi ngờ về lời giải câu này |

Ngoài ra sửa mục "GHI CHÚ CHO NGƯỜI DUYỆT" cuối tệp: "$2023^0$" ⇒ "$20235^0$", thêm dòng liệt kê các câu Ch III–V chờ CEO duyệt khuôn.

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 17 câu đối chiếu ảnh (số mũ, dấu âm đọc lại ở bản cắt 400 dpi) — Câu 1: $-1\le x<4$, đủ 4 phương án đúng thứ tự; Câu 2: $6^{15}:6^5$, phương án $6^3$, $6^{10}$, $6^{20}$, $10^{20}$;
  Câu 5: $-3$, $-8$, $15$, $0$ (dòng `Ghi chú` "đề gốc thiếu dấu phẩy trước 'ở Phanxipang' — đã thêm" đúng với ảnh, giữ); Câu 6: $-6<x<5$; Câu 7: phương án B là $52\ cm^2$;
  Bài 1c: $120-\{17+[3^2.2:(10-2^5:2^3)]\}$; Bài 2b: $(x+18).(-40)=80$; Bài 3, Bài 4, Bài 5 đúng chữ, đúng số.
- **Tên đề**: ảnh chỉ in "TRƯỜNG THCS TÂN TRIỀU · Năm học 2025 – 2026" ⇒ `nam: 2025` đúng; "Hà Nội" là bản soạn thêm (đề không in), không ảnh hưởng.
- **Đáp số**: tính lại bằng `node -e` — Câu 3 chỉ $660$ chia hết cho cả 2, 3, 5 · Câu 6 tổng $=-5$ · Bài 1: 49, −5700, 100 · Bài 2c: $3^2-1=8=2^4:2$ ·
  Bài 3: vét 300–400 chỉ có 360 chia hết cho 8, 10, 12 · Bài 4: 100, 600, 16, 4160000 · Bài 5: vét cạn ra đúng 4 cặp.
- **Kiến thức**: tìm $x$ bằng thành phần chưa biết ở 2a, 2b, 2c (không chuyển vế); 2c đúng khuôn NNB00899 (đưa về cùng cơ số 3); 1b đặt thừa số chung; 1c phá ngoặc từ trong ra, mỗi dòng một bước;
  Bài 3 đúng khuôn NNB00925 (gọi ẩn + điều kiện → BC → BCNN → B(120) → lọc khoảng → Vậy); Câu 3 chỉ dùng dấu hiệu 2, 5, 3.
- **Chương III–V** (số nguyên: Câu 1, 5, 6, Bài 1a, 1b, 2a, 2b, 5 · hình phẳng: Câu 7, Bài 4 · trục đối xứng: Câu 8): bản đồ K6 chưa có lý thuyết (`k6.md` §1 luật 3, Q5 còn mở).
  Bản soạn giải theo SGK KNTT 6 (so sánh số nguyên, tổng hai số đối bằng 0, nhân / chia hai số khác dấu, ước của số nguyên, chu vi – diện tích hình chữ nhật và hình vuông, trục đối xứng = gập hai nửa trùng khít).
  Trạm soát đã kiểm đúng toán; **khuôn trình bày các nhóm này vẫn chờ CEO duyệt** — việc chung của cả bộ CKI.
- **Phân loại**: `kho=hgt` cho Câu 7, Câu 8, Bài 4; còn lại `dai`. Trả lời ngắn: 1a (49), 1c (100), 2a (−30), 2b (−20), 2c (1), Bài 3 (360 — một số, đúng đơn vị đề hỏi).
  Bài 1b đáp số $-5700$ là 5 kí tự (dấu trừ + 4 chữ số), không tô được 4 ô ⇒ `tu_luan` đúng luật (cổng cũng từ chối nếu để trả lời ngắn). Bài 4 (bốn đáp số, có 4160000), Bài 5 (bốn cặp số) ⇒ `tu_luan`.
- **Tách ý**: Bài 1 (Tính) và Bài 2 (Tìm $x$) tách từng ý; Bài 4 là một bài toán chung dữ kiện ⇒ giữ chung ba ý a) b) c) — đúng luật.
- **Phần 1**: mỗi câu 3–4 bước, là bước nghĩ thật, không chép lại Phần 2. **Phần 2**: câu trắc nghiệm kết bằng `Chọn X.` trùng `dap_an`; dấu nhân là dấu chấm; số âm trong phép tính viết trong ngoặc.
- **Hình**: `p1c8_lai.png` — đủ bốn hình (1) hình bình hành, (2) hình tròn, (3) hình thang cân, (4) hình chữ nhật kèm nhãn (1)–(4), không cụt, không dính chữ câu khác.
  `p2c4_1.png` — sân chữ nhật với bốn ô vuông "Bồn hoa", đủ khung. (Bốn tệp `p1c8_1…4.png` do máy cắt rời không còn được câu nào dùng.)
  Hình (3) của Câu 8 không có kí hiệu "cân" nhưng vẽ cân (đo trên ảnh 400 dpi: trung điểm hai đáy thẳng hàng dọc); hình (1) có cạnh ngang dài hơn hẳn cạnh xiên nên không phải hình thoi ⇒ đáp án A không có cách hiểu thứ hai.

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.

(Điều người duyệt nên biết, không phải `Chưa chắc`: Bài 2c — đề gốc in $20235^0$, nhiều khả năng gõ nhầm $2025^0$; đã giữ nguyên như đề và ghi ở `Ghi chú` của câu; đáp số không bị ảnh hưởng.)
