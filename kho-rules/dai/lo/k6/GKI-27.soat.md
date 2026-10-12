KẾT LUẬN: ĐẠT

# GKI-27 — biên bản soát (trạm soát, 10/10)

> THCS Nghĩa Tân, phường Nghĩa Đô — Đề minh hoạ giữa học kì I Toán 6, 2025–2026, đề số 1 (2 trang, không có phần tiếng Anh).
> Pha 1 giải mù: `GKI-27.kiem.md` (ghi xong trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-27.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ "✔ đạt cổng" (2 phần · 20 câu: 8 TN · 6 TLN · 6 tự luận · HGT 6 · hình 1 · chưa chắc 1).

## Số liệu

- Số câu: bản soạn gốc **17** (Câu 1–8; Bài 1a–1c; Bài 2a–2c; Bài 3; Bài 4; Bài 5) ⇒ sau khi tách **20** (Bài 3 ⇒ 3.1, 3.2 · Bài 4 ⇒ 4.1, 4.2 · Bài 5 ⇒ 5.1, 5.2). Không sót, không thừa, không bỏ câu nào.
- Khớp đáp án Pha 1 ngay từ đầu: **16 / 17** câu của bản gốc khớp trọn (tính theo 20 câu sau tách: **19 / 20**). Câu còn lại là Bài 5 ý b: hai trạm **cùng ra năm sinh 1996**, chỉ lệch ở cách hiểu chữ "năm nay" của đề (bản soạn: 2021 ⇒ 25 tuổi; Pha 1: nghiêng về năm làm bài 2025 ⇒ 29 tuổi, có ghi cả hai cách hiểu). Không phân xử được từ đề ⇒ giữ `Chưa chắc`.
- Số câu phải sửa: **3 / 17** câu của bản gốc — Bài 3, Bài 4, Bài 5 (đều là lỗi phân loại: chưa tách hai bài toán khác hẳn nhau; Bài 5 kèm một chữ sai kiến thức và dòng kết luận). **14 câu còn lại (Câu 1–8, Bài 1a–1c, Bài 2a–2c) không sửa chữ nào.** Không sửa đáp số nào, không sửa dòng tính nào của Phần 2.
- Mọi số đã tính lại bằng `node -e` (trạm soạn không dùng máy): 78 · 174 · 2500 (hai cách: cộng thẳng $725+3525+600-2350$ và đặt thừa số chung) · 45 · 6 · 2 · $1750+1870=3620$ · ước của 36 lớn hơn 3 và nhỏ hơn 36 là $4;6;9;12;18$ ⇒ $9;6;4;3;2$ nhóm · $8$ m, $96\ m^2$ · $120$ m, $900\ m^2$, $2700$ kg, $18900$ nghìn đồng · vét cạn $n<1000$ cho $(4n+38)\vdots(2n+1)$ ra đúng $\{0;1;4\}$ · vét cạn $a,b$ cho năm sinh ra đúng 1996. Tất cả khớp bản soạn.

## Chỗ đã sửa

| Câu | Loại lỗi (chép đề / đáp số / lập luận / kiến thức / định dạng / phân loại / hình) | Sửa gì | Vì sao |
|---|---|---|---|
| Tên đề | định dạng | "(mã đề: đề minh hoạ số 1)" → "(đề minh hoạ số 1)" | Dòng `# ĐỀ` thành tên đề trên ERP; đề không có mã đề, "đề số 1" là tên của đề minh hoạ |
| Bài 3 ⇒ Bài 3.1, Bài 3.2 | phân loại | Tách thành 2 câu, đều `dai`, `tu_luan`. `Bài 3.1` (trà sữa hai cửa hàng) · `Bài 3.2` (chia 36 học sinh thành nhóm). Đề bỏ nhãn a) b); Phần 2 bỏ nhãn `a)` `b)`; mỗi câu Phần 1 riêng 3 bước (lấy lại đúng các bước của bản gốc, chỉ chia về từng câu); thêm `Ghi chú` trỏ ý gốc | Bài 3 của đề gom 2 bài toán khác hẳn nhau, mỗi bài một bộ dữ kiện (ngoại lệ tách ý trong brief). Đề gốc đánh a) b) chứ không phải 1) 2) nhưng bản chất là hai bài toán độc lập. Nhãn dùng số `3.1`, `3.2` theo quy ước của GKI-15, CKI-02 |
| Bài 3.1 | phân loại | Để `tu_luan` (không `tra_loi_ngan`), ghi lí do trong `Ghi chú` | Đáp số 3620 nghìn đồng = 3 620 000 đồng; đề không nói đơn vị của đáp số, viết theo đồng thì 7 chữ số không tô được 4 ô |
| Bài 4 ⇒ Bài 4.1, Bài 4.2 | phân loại | Tách thành 2 câu, đều `hgt`, `tu_luan` (mỗi câu 2 đáp số). `Bài 4.1` hình chữ nhật (ý a, b giữ chung, gắn hình `p2c4_1.png`) · `Bài 4.2` vườn rau hình vuông của bác Hòa (ý a, b giữ chung, không hình). Phần 2 đổi nhãn `1) a)` `2) a)` ⇒ `a)` `b)` trong từng câu; mỗi câu Phần 1 riêng 3 bước | Đề gốc đánh số 1) 2), hai bài toán hai bộ dữ kiện khác nhau; các ý a) b) của cùng một bài toán vẫn giữ chung |
| Bài 4 (ghi chú cũ) | định dạng (ghi chú) | Ghi chú cũ chia về hai câu: 4.1 giữ ý "hình chữ nhật không ghi số đo"; 4.2 giữ ý "tranh vườn rau chỉ trang trí, không đính kèm" | Cho khớp cách tách mới |
| Bài 5 ⇒ Bài 5.1, Bài 5.2 | phân loại | Tách thành 2 câu, đều `dai`, `tu_luan`. `Bài 5.1` (tìm $n$ để $4n+38$ chia hết cho $2n+1$; đáp số là tập $\{0;1;4\}$) · `Bài 5.2` (tuổi cầu thủ). Mỗi câu Phần 1 riêng 3 bước; dòng `Thử lại` chia về từng câu | Hai bài toán khác hẳn nhau (chia hết · bài toán cấu tạo số), không chung dữ kiện — đúng ví dụ của người giao việc |
| Bài 5.2 | kiến thức | Phần 1: "lập phương trình" (2 chỗ: `Mấu chốt`, Bước 5 cũ) → "lập một đẳng thức"; `Mấu chốt` viết lại theo ý "tuổi cộng năm sinh bằng 2021" | Lớp 6 chưa có khái niệm "phương trình" (học ở lớp 8) |
| Bài 5.2 | lập luận (dòng kết luận) | "Vậy năm nay cầu thủ đó 25 tuổi." → "Vậy năm nay (năm 2021) cầu thủ đó 25 tuổi." | Dòng cũ ngầm coi "năm nay" là 2021 mà không nói ra; viết rõ giả thiết để người duyệt thấy đúng chỗ phải quyết |
| Bài 5.2 | định dạng (dòng cờ) | Giữ `Chưa chắc` của trạm soạn, viết lại: nêu phần chắc chắn (năm sinh 1996, hai trạm cùng ra), hai cách hiểu (25 / 29 tuổi), vì sao để tự luận, và câu hỏi cần người duyệt chốt | Không phân xử được từ đề; xem mục dưới |
| Mục cuối tệp | định dạng | Cập nhật `GHI CHÚ CHO NGƯỜI DUYỆT` theo cách tách mới (20 câu), thêm dòng đơn vị nghìn đồng của Bài 3.1, 4.2 | Cho khớp nội dung từng câu |

## Đã soát, không phải sửa

- **Chép đề**: 17 câu đối chiếu ảnh `p-1.png`, `p-2.png` — đúng số, số mũ ($3^2.6^2$, $(25-15)^2$, $5^{x+1}$, $cm^2$), ngoặc vuông / tròn của Bài 1b, gạch ngang $\overline{3*7}$ và $\overline{19ab}$, kí hiệu $\mathbb{N}^*$ và dấu $\le$ ở Câu 1, đủ 4 phương án, đủ ý. Câu 7: đề in phương án theo cột (hàng trên A | C, hàng dưới B | D) — bản soạn gán đúng A = "Bốn cạnh bằng nhau", B = "Bốn góc đều là góc vuông", C = "Các cạnh đối song song", D = "Hai đường chéo bằng nhau". Câu 5 phương án A là "$8\ m$" (khác đơn vị) — đúng chữ của đề, là bẫy đơn vị chứ không phải in lỗi. Bài 1c đề in lẫn dấu `·` và `.` cho phép nhân — bản soạn chuẩn về dấu chấm, đúng luật.
- **Lời giải**: mọi dòng tính của Phần 2 đúng. Tìm $x$ theo thành phần chưa biết, không chuyển vế (Bài 2a–2c); Bài 2c đưa về cùng cơ số đúng khuôn `NNB00899`; Bài 1b không dùng luỹ thừa của một tích (có `Chú ý` nhắc); Bài 1c đặt thừa số chung hai lần đúng khuôn `NNB00893`; Bài 5.1 đúng khuôn `NNB00911` (tách bội + lọc ước lẻ); Bài 3.2 gọi ẩn + ước của 36 + lọc điều kiện; Bài 5.2 chặn $11a$ bằng điều kiện chữ số — chỉ dùng kiến thức lớp 6. Dấu nhân là dấu chấm, không có `\cdot` / `\times`.
- **Phần 1**: mỗi câu 3–5 bước, là bước nghĩ thật, không chép lại từng dòng Phần 2. Các câu trắc nghiệm có bước loại phương án (Câu 1, 6) — cùng nếp với mẫu GKI-01 (Câu 2, Câu 8), giữ.
- **Phân loại**: Câu 5–8 và Bài 4.1, 4.2 `kho=hgt` (tam giác đều, lục giác đều, hình chữ nhật, hình thoi, chu vi – diện tích); còn lại `dai`. Bài 1, Bài 2 tách ý đúng luật, 6 câu `tra_loi_ngan` đều là một số ≤ 4 ô.
- **Hình**: `p2c4_1.png` đúng hình chữ nhật (không số đo) của Bài 4.1, đủ, không cụt. `p2c4_2.png` là tranh vườn rau trang trí của Bài 4.2 (bản cắt còn dính mép chữ ở đáy) — không mang dữ kiện, không đính kèm (có `Ghi chú`), cùng cách xử lí với GKI-15 Bài 4.2.

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Bài 5.2 | Đề hỏi "**năm nay** cầu thủ đó bao nhiêu tuổi" nhưng chỉ cho mốc "tính đến năm 2021", trong khi đây là đề năm học 2025–2026 (bài lấy lại từ đề năm 2021, không đổi chữ). **Năm sinh 1996 chắc chắn** (hai trạm giải độc lập + vét cạn bằng máy: nghiệm duy nhất của $11a+2b=111$). Lời giải đang kết luận "năm nay (năm 2021) … 25 tuổi"; hiểu "năm nay" là năm làm bài 2025 thì là 29 tuổi (và mỗi năm sau lại tăng 1). Đang để `tu_luan` (chỉ in). Cần CEO chốt: **(1)** sửa chữ đề thành "Hỏi năm 2021 cầu thủ đó bao nhiêu tuổi?" ⇒ đáp số 25, đổi được sang `tra_loi_ngan` — trạm soát đề nghị cách này vì câu vào kho sẽ được dùng nhiều năm; hay **(2)** giữ nguyên chữ đề. |

## Điều người duyệt nên biết thêm (không phải `Chưa chắc`)

- **Đơn vị nghìn đồng** — Bài 3.1 (3620 nghìn đồng) đang để `tu_luan` vì đề không nói đơn vị của đáp số. Cùng loại với GKI-11 Bài 5 (đang để `tra_loi_ngan`, đáp án 21, chờ CEO quyết) và GKI-28 Bài 3a (`tra_loi_ngan`, 180). CEO chốt một cách cho cả bộ thì ba câu này đổi theo.
- **Nhãn câu tách**: Bài 3 và Bài 5 của đề gốc đánh a) b), Bài 4 đánh 1) 2); bản nhập dùng chung một kiểu số (`Bài 3.1`…`Bài 5.2`) cho bài toán tách từ một "Bài", để không lẫn với ý a b c của bài Tính / Tìm $x$ (`Bài 1a`…`Bài 2c`). Mỗi câu tách có `Ghi chú` trỏ về ý gốc.
- Đề chị em GKI-28 (đề minh hoạ số 2 cùng trường) đang đặt tên "Đề minh hoạ giữa học kì 1 … (đề số 2)" và nhãn `Bài 3a`, `Bài 5a` cho bài toán tách — chưa soát; khi soát nên thống nhất tên đề và kiểu nhãn với đề này.
