KẾT LUẬN: ĐẠT

# CKI-09 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Phúc Đồng, phường Phúc Lợi — kiểm tra cuối học kì 1 Toán 6, 2025–2026, **mã đề 601** (2 trang, ảnh SCAN; 8 câu trắc nghiệm + 5 bài tự luận; không có phần tiếng Anh "Hệ T").
> Pha 1 giải mù: `CKI-09.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `CKI-09.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (19 câu: 8 TN · 5 TLN · 6 tự luận · HGT 3 · hình 3 · chưa chắc 0).

## Số liệu

- Số câu: **19** (Câu 1–8; Bài 1a, 1b, 1c; Bài 2a, 2b, 2c, 2d; Bài III.1; Bài III.2; Bài IV; Bài V). Không sót, không thừa, không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **19 / 19** (TN: D · A · C · D · A · D · C · C; Bài 1: 51 · −1700 · 400; Bài 2: 4 · 5 · −6 · $\{-2;3\}$;
  III.1: −150 m và 3293 m; III.2: 16 nhóm, mỗi nhóm 3 học sinh 6A và 2 học sinh 6B; IV: 48 m · 96 m² · 1200000 đồng; V: cùng cách chứng minh — khử $b$ ra $a$, khử $a$ ra $b$).
- Số câu phải sửa: **4 / 19** — Câu 2 (hình), Câu 7 (bỏ `Chưa chắc`), Bài 2a (một bước Phần 1), Bài V (khuôn + câu chữ). **Không đổi đáp số nào, không đổi đề nào.**

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 2 | hình | `**Hình:** p1c2_bang.png` ⇒ `p1c2_bang_lai.png` (cắt lại từ `goc.pdf`, 150 dpi, `-x 136 -y 504 -W 990 -H 85`; tệp cũ giữ nguyên) | Ảnh cũ cụt đường viền trên và viền phải của bảng, dính vệt chữ của dòng dưới. Ảnh mới đủ bốn đường viền, đủ 4 cột số liệu |
| Câu 7 | định dạng (dòng `Chưa chắc`) | Xoá dòng `Chưa chắc` của trạm soạn, thay bằng dòng `Ghi chú` ngắn (hình b có vệt sáng lệch nên không có trục đối xứng; hình c là hình duy nhất có) | Đã phân xử — xem mục "Phân xử Câu 7" dưới đây. Đáp án C chắc chắn |
| Bài 2a | lập luận (Phần 1) | Bước 3: "Tính hiệu hai số rồi viết đáp số." ⇒ "Tính hiệu rồi kiểm tra kết quả có là số nguyên như đề yêu cầu, sau đó thay ngược vào đề để thử lại." | Bước cũ là bước vụn (không có ý nghĩ nào ngoài "tính rồi viết") |
| Bài V | định dạng (khuôn Phần 2) + lập luận (câu chữ) | Phần 2: "Gọi $d$ là ước chung của…" ⇒ "Gọi $d=\text{ƯCLN}(5a+2b,7a+3b)$."; dòng "Suy ra $7.(5a+2b)\vdots d$ và $5.(7a+3b)\vdots d$" ⇒ "Lại có $5.(7a+3b)\vdots d$ và $7.(5a+2b)\vdots d$"; Phần 1 (Mấu chốt, Bước 1, Chú ý) sửa theo cho khớp | Khuôn nhóm "nguyên tố cùng nhau" (`k6.md` §2, NNB00916–918) mở bằng `Gọi $d=(\dots)$` tức ƯCLN — đề CKI-05 trong cùng lô cũng viết vậy. Chữ "Suy ra" đặt ngay sau "$a\vdots d$" đọc thành suy từ $a\vdots d$, trong khi dòng đó suy từ giả thiết ban đầu ⇒ "Lại có". Bản cũ vẫn đúng toán; đây là sửa trình bày |

## Phân xử Câu 7 (hình nào có trục đối xứng)

Cắt từng hình ở 400 dpi từ `goc.pdf` và đo bằng máy (nhị phân hoá, so hình với ảnh gương của nó qua trục dọc / trục ngang đi qua tâm khung bao; 1,000 = trùng khít):

| Hình | Mô tả ở 400 dpi | Gương qua trục dọc | Gương qua trục ngang |
|---|---|---|---|
| a | Chiếc lá, gân trắng và cuống cong lệch về bên trái | 0,503 | 0,359 |
| b | Giọt nước, có vệt sáng trắng cong ở góc phải – dưới | 0,719 (chỉ tính viền ngoài: 0,833) | 0,636 |
| c | Hình tròn, vạch ngang sáng nằm chính giữa (biển cấm đi ngược chiều) | **0,952** (chỉ tính viền: 0,990) | **0,951** (chỉ tính viền: 0,991) |
| d | Đầu người nhìn nghiêng (mũi quay sang trái) | 0,773 | 0,819 |

- **Hình c** đối xứng qua cả đường thẳng đứng lẫn đường nằm ngang đi qua tâm (phần lệch 5% là hạt tram của bản scan ở vạch sáng). Không có cách hiểu nào làm hình c mất trục đối xứng.
- **Hình b**: vệt sáng chỉ nằm một bên nên cả hình không có trục đối xứng. Ngay cả khi chỉ xét viền ngoài, viền giọt nước cũng không trùng khít với ảnh gương của nó qua đường thẳng đứng (0,833 — đỉnh nhọn lệch trái so với bầu nước).
- Câu trắc nghiệm chỉ chọn MỘT phương án, hình c chắc chắn có trục đối xứng ⇒ **C là đáp án duy nhất**, không phụ thuộc cách nhìn hình b. Pha 1 (giải mù) cũng ra C.
  ⇒ dòng `Chưa chắc` của trạm soạn đã kiểm là đúng ⇒ xoá; điều cần biết về hình b chuyển thành `Ghi chú` của câu.

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 19 câu đối chiếu ảnh trang và ảnh cắt 400 dpi — đúng số, dấu âm, số mũ, ngoặc, đủ 4 phương án.
  Câu 1: $-10<x\le 10$ (trái $<$, phải $\le$). Câu 2: $-219$ · $-114$ · $-39$ · $-102$. Câu 3: $10^0$ (mũ 0). Câu 4: D là $2^2.3.5$. Câu 5: $a=2^4.3$ (mũ 4), $b=2.3.7$.
  Bài 1c: $407-[(190-170):2^2+3^2]:2$ (`:2` ngoài ngoặc vuông). Bài 2c: $11+2.x=2^3-3^2$. Bài 2d: $(x+2).(x-3)=0$. Bài IV: "4 mét vuông", "50 000 đồng" (viết liền $50000$ trong công thức).
  "tính hợp lý" (ảnh) / "tính hợp lí" (bản soạn) — chỉ khác chính tả i / y, để nguyên.
- **Sửa lỗi in của đề gốc** (trạm soạn đã làm, có `Ghi chú`, đã kiểm đúng): Bài III.2 đề in "chia đều cho các **phòng**" ⇒ "các nhóm"; Bài V đề in thừa dấu ")" sau "(0,5 điểm)." ⇒ bỏ.
- **Nhãn**: đề gốc đánh số KHÔNG đều — trang 1 in "Bài 1.", "Bài 2:", trang 2 in "Bài III", "Bài IV", "Bài V". Bản soạn giữ đúng nhãn gốc (`Bài 1a … Bài 2d`, `Bài III.1`, `Bài III.2`, `Bài IV`, `Bài V`) — đúng luật "nhãn gốc của đề".
- **Tên đề**: "THCS Phúc Đồng, phường Phúc Lợi (mã đề 601)" — ảnh in "UBND PHƯỜNG PHÚC LỢI · TRƯỜNG THCS PHÚC ĐỒNG · Mã đề 601 · Ngày 26/12/2025 · Năm học 2025 – 2026" ⇒ `nam: 2025` đúng. Tệp chỉ có một mã.
- **Đáp số**: tính lại bằng `node -e` — Câu 1: đếm được 20 số · Câu 3: 76 · Câu 5: ƯCLN(48, 42) = 6 = 2.3 · Câu 8: 18 · Bài 1: 51, −1700, 400 · Bài 2: vét cạn $x$ từ −1000 đến 1000 chỉ có 4 · 5 · −6 · $\{-2;3\}$ ·
  III.1: 3293 · III.2: ƯCLN(48, 32) = 16 ⇒ 3 và 2 · IV: 48 · 96 (kiểm cách hai: $16.8-2.(4.8:2)=96$) · 24 cây · 1200000 · V: vét cạn 97355 cặp $(a,b)$ nguyên tố cùng nhau với $a,b\le 400$ — cả 97355 cặp đều có ƯCLN$(5a+2b,7a+3b)=1$.
- **Kiến thức**: tìm $x$ bằng thành phần chưa biết ở cả 2a, 2b, 2c, 2d — không chuyển vế. Bài 1b đặt thừa số chung $(-16)$; Bài 1c phá ngoặc từ trong ra, luỹ thừa trước. Bài III.2 đúng khuôn NNB00921 (gọi ẩn + điều kiện → ƯC → ƯCLN → phân tích → dòng tính phụ → Vậy).
  Bài V chỉ dùng "tổng / hiệu các số chia hết cho $d$ thì chia hết cho $d$" và định nghĩa nguyên tố cùng nhau.
- **Số nguyên (Câu 1, 2; Bài 1a, 1b; Bài 2a–2d; III.1), hình phẳng (Câu 8, Bài IV), đối xứng (Câu 7)** thuộc Ch III–V — bản đồ K6 chưa có lý thuyết (`k6.md` §1 luật 3, Q5 còn mở).
  Bản soạn giải theo SGK KNTT 6: so sánh số nguyên âm theo phần số tự nhiên, tổng hai số đối nhau bằng 0, trừ số nguyên = cộng số đối, chia số nguyên âm cho số dương, "tích bằng 0 thì có thừa số bằng 0" (Bài 2d),
  diện tích hình bình hành = cạnh đáy nhân chiều cao, trục đối xứng = gấp hai nửa trùng khít. Trạm soát đã kiểm đúng toán; **khuôn trình bày của các nhóm này vẫn chờ CEO duyệt** (đã ghi ở "GHI CHÚ CHO NGƯỜI DUYỆT" của bản soạn — việc chung của cả bộ CKI).
  Số âm đứng đầu dòng tính viết không ngoặc (`$=-1600-100$`, `$x=-9+14$`) — cùng cách viết với các đề CKI đã soát (CKI-03, CKI-07), để nguyên.
- **Phân loại**: `kho=hgt` cho Câu 7, Câu 8, Bài IV; còn lại `dai`. Trả lời ngắn: 1a (51), 1c (400), 2a (4), 2b (5), 2c (−6). Tự luận: 1b (−1700 là 5 kí tự, không tô vừa 4 ô — cổng cũng chặn), 2d (hai giá trị), III.1 (hai đáp số), III.2 (ba đáp số), IV (ba đáp số, có 1200000), V (chứng minh).
- **Tách ý**: Bài 1 (Tính) và Bài 2 (Tìm $x$) tách từng ý. Bài III gom hai bài toán khác hẳn nhau (1) tàu ngầm – số nguyên âm · 2) chia nhóm – ƯCLN; mỗi bài một bộ dữ kiện, đề tự đánh số 1) 2)) ⇒ tách `Bài III.1`, `Bài III.2` đúng ngoại lệ của brief.
  Bài IV: 1) và 2) cùng một khu đất ⇒ giữ chung một câu, đúng luật.
- **Phần 1**: mỗi câu 3–5 bước, là bước nghĩ thật, không lộ đáp số cuối, không chép lại Phần 2 (trừ một bước của Bài 2a đã sửa ở trên).
- **Hình**: `p1c7_chung.png` (đủ 4 hình a) b) c) d) kèm nhãn, không cụt, không dính chữ câu khác) · `p2c5_1.png` (hình khu đất đủ nhãn $A$, $M$, $B$, $D$, $N$, $C$ và số đo 16 m, 4 m, 8 m, 4 m — tên tệp do máy đặt lệch "c5" nhưng đúng hình của Bài IV).
- **Câu 2**: bản soạn vừa chép số liệu bảng thành một dòng chữ trong đề, vừa gắn ảnh bảng ⇒ trên app số liệu hiện hai lần. Không sai; người duyệt muốn gọn thì bỏ một trong hai.

## Câu còn `Chưa chắc` (gửi CEO)

Không còn câu nào.

(Điều người duyệt nên biết, không phải `Chưa chắc`: Câu 7 — hình b giọt nước có vệt sáng lệch, đã ghi ở `Ghi chú` của câu, đáp án C không bị ảnh hưởng · Bài III.2 và Bài V — đề gốc in lỗi chữ, đã sửa và có `Ghi chú`.)
