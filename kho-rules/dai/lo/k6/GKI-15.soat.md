KẾT LUẬN: ĐẠT

# GKI-15 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Nghĩa Tân (phường Nghĩa Đô) — kiểm tra giữa học kì 1 Toán 6, 2025–2026, đề chính thức (2 trang, không có phần tiếng Anh "Hệ T").
> Pha 1 giải mù: `GKI-15.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-15.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (20 câu: 8 TN · 8 TLN · 4 tự luận · HGT 6 · hình 3 · chưa chắc 0).
> Số tính lại bằng `node -e`; Bài 5.2 vét cạn chu vi hình ghép trên lưới ô vuông (chỉ có đúng một cặp $a<b$ cho chu vi 30: $a=1$, $b=6$).

## Số liệu

- Số câu: bản soạn gốc **17** (Câu 1–8; Bài 1a–1c; Bài 2a–2c; Bài 3; Bài 4; Bài 5) ⇒ sau khi tách **20** (Bài 3 ⇒ 3.1, 3.2 · Bài 4 ⇒ 4.1, 4.2 · Bài 5 ⇒ 5.1, 5.2). Không sót, không thừa; không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **17 / 17** (8 TN trùng chữ cái; 6 TLN trùng số; Bài 3: 30000 đồng · 63 cây; Bài 4: 40 cm · 96 cm$^2$ · 56 m · 5 kg; Bài 5: cùng cách nhóm 3 số hạng · $a=1$, $b=6$, diện tích 24 cm$^2$). **Không đáp số nào phải đổi, không chữ nào của đề phải đổi.**
- Số câu phải sửa: **4 / 17** câu của bản gốc — Bài 2c (lập luận, 1 dòng Phần 1) và Bài 3, 4, 5 (phân loại: tách mỗi bài thành 2 câu; kèm sửa lập luận Bài 5 ý 2 và cắt lại 2 hình). 13 câu còn lại (Câu 1–8, Bài 1a–1c, 2a, 2b) không sửa chữ nào.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2c | lập luận | Phần 1, Bước 4: "trong đó $x-1$ đóng vai trò số bị trừ" ⇒ "trong đó $x$ là số bị trừ: lấy hiệu cộng với số trừ" | Trong $x-1=5$, số bị trừ là $x$; $x-1$ là hiệu. Câu cũ gọi sai tên thành phần — đúng chỗ luật "tìm thành phần chưa biết" cần chính xác. Phần 2 vốn đã đúng ($x=5+1$) |
| Bài 3 ⇒ Bài 3.1, Bài 3.2 | phân loại | Tách thành 2 câu. `Bài 3.1` (tính tiền): `dai`, `tu_luan` (đáp số 30000 có 5 chữ số, không tô được 4 ô). `Bài 3.2` (số cây): `dai`, **`tra_loi_ngan`, `dap_an=63`**. Mỗi câu viết Phần 1 riêng (3 bước) | Bài III của đề gom 2 bài toán khác hẳn nhau, mỗi bài một bộ dữ kiện (ngoại lệ tách ý trong brief). Gộp chung thì Bài 3.2 mất dạng trả lời ngắn và Phần 1 phải trộn hai mạch nghĩ không liên quan |
| Bài 3.2 | định dạng (khuôn Phần 2) | Dòng gọi ẩn thêm điều kiện: "($x\in\mathbb{N}^*$, $60<x<70$)"; thêm `Chú ý` ($60<x<70$ không lấy 60, 70) và `Thử lại` | Khuôn NNB00925 (`k6.md` §2): gọi ẩn kèm điều kiện |
| Bài 3 (ghi chú cũ) | định dạng (ghi chú) | Xoá ghi chú "nhập chung một câu theo luật chỉ tách bài Tính và Tìm $x$"; thay bằng ghi chú trỏ ý gốc ("Đề gốc là Bài III, ý 1) / ý 2)") | Không còn đúng sau khi tách. Ghi chú cũ còn gọi ý 2 là "bội chung" — thật ra chỉ là bội của một số (9) |
| Bài 4 ⇒ Bài 4.1, Bài 4.2 | phân loại | Tách thành 2 câu, đều `hgt`, `tu_luan` (mỗi câu 2 đáp số). `Bài 4.1` hình thoi (ý a, b giữ chung, có hình). `Bài 4.2` mảnh đất hình chữ nhật (ý a, b giữ chung, không hình). Phần 2 đổi nhãn `1a) 1b) 2a) 2b)` ⇒ `a) b)` trong từng câu; mỗi câu Phần 1 riêng (3 bước) | Hai bài toán khác hẳn nhau (hình thoi $ABCD$ · mảnh đất của anh Bình), mỗi bài một bộ dữ kiện; các ý a) b) của cùng một bài toán vẫn giữ chung |
| Bài 4.1 | hình | Cắt lại hình thoi từ PDF: `p2b4_1_lai.png` thay `p2c7_2.png` | Bản máy cắt dính một vệt dấu chữ của dòng "2) Anh Bình…" ở mép dưới. Hình mới sạch, đủ 4 nhãn $A$, $B$, $C$, $D$ và hai đường chéo |
| Bài 5 ⇒ Bài 5.1, Bài 5.2 | phân loại | Tách thành 2 câu. `Bài 5.1` (chứng tỏ $A\vdots 7$): `dai`, `tu_luan`. `Bài 5.2` (hình ghép): **`kho=hgt`**, **`tra_loi_ngan`, `dap_an=24`**, hình gắn vào đúng câu này | Bản gốc trộn số học với hình trong một câu và ghi `kho=dai` cho cả hai — ý 2 là bài hình (chu vi, diện tích hình ghép) phải vào kho HGT; đáp số là một số ≤ 4 ô |
| Bài 5.1 | định dạng (Phần 1) | Viết lại Phần 1 riêng cho câu chứng minh: 3 bước (đếm 123 số hạng ⇒ 41 nhóm · đặt luỹ thừa đầu nhóm · thay $1+2+2^2=7$, đặt thừa số chung) + `Chú ý` đếm cả số hạng $1=2^0$. Phần 2 giữ nguyên | Bản gốc chỉ dành 2 bước chung cho ý này, Bước 2 dồn ba thao tác vào một câu; theo mẫu Bài 5 của GKI-01 và khuôn NNB00913 (phải đếm số số hạng) |
| Bài 5.2 | lập luận | Phần 2: bỏ cách "dồn các cạnh ngang / dọc lại … bằng hai lần chiều ngang / dọc lớn nhất của hình"; thay bằng **đi một vòng quanh hình, liệt kê 10 đoạn viền** $b$; $a$; $a$; $a$; $b-a$; $b$; $a$; $a$; $a$; $a+b$ rồi cộng: $6a+4b$. Thêm dòng mô tả cách ghép đọc từ hình (đặt sát, không chồng, lệch nhau một đoạn $a$). Phần 1 (Bước 1, 2, `Chú ý`) sửa theo | Cách "dồn cạnh" đúng với hình này nhưng là mẹo không có trong SGK và bản gốc dùng mà không giải thích vì sao dồn được (chính trạm soạn cũng ghi `Chưa chắc`). Cộng trực tiếp từng đoạn viền là lập luận tự đủ, học sinh lớp 6 kiểm được trên hình (`k6.md` §1 luật 2) |
| Bài 5.2 | kiến thức | Phần 2: "$6a+4b=30$ nên $3a+2b=15$" ⇒ viết đủ $2.(3a+2b)=30$ → $3a+2b=30:2$ → $3a+2b=15$. Dòng suy ra $a<3$ viết rõ từng bước ($2a<2b$ ⇒ $3a+2a<3a+2b$ ⇒ $5a<15$). Trường hợp $a=2$ ghi lí do "9 không chia hết cho 2". Phép tính diện tích tách hai dòng $1.6=6$ rồi $6.4=24$ | Tìm thành phần chưa biết (thừa số = tích : thừa số kia), không "chia hai vế"; $4.(1.6)$ dễ bị đọc nhầm thành số thập phân 1,6 |
| Bài 5.2 | hình | Cắt lại: `p2b5_2_lai.png` thay `p2c14_lai.png` | Bản cắt của trạm soạn dính vệt dấu chữ của dòng "Hết" ở mép dưới. Hình mới sạch, đủ hình chữ nhật mẫu (nhãn $a$, $b$) và hình $(A)$ |
| Bài 5.2 | định dạng (xoá `Chưa chắc`) | Xoá dòng `Chưa chắc` của trạm soạn | Đã kiểm chắc chắn: (1) lập luận không còn dùng mẹo "dồn cạnh"; (2) cách ghép đọc từ ảnh 200 dpi — bốn hình áp sát nhau theo cạnh nên độ lệch đúng bằng $a$, không có cách hiểu thứ hai; (3) máy đếm chu vi trên lưới ô vuông ra đúng $6a+4b$ và chỉ có một cặp $a<b$ cho chu vi 30; (4) trùng kết quả Pha 1 |
| Mục "GHI CHÚ CHO NGƯỜI DUYỆT" | định dạng (ghi chú) | Viết lại theo cách tách mới; xoá câu "Đề in $a,b\in N^*$, đã đổi sang $\mathbb{N}^*$"; xoá ý "người duyệt xem có muốn tách riêng ý 2 sang kho hgt không" | Ảnh đề in sẵn $\mathbb{N}^*$ (chữ N rỗng) — không có gì bị đổi; câu hỏi tách đã được trả lời bằng ngoại lệ trong brief |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 20 câu đối chiếu ảnh — đúng số, số mũ, ngoặc, đủ 4 phương án. Bài 1b: $60:(3^2.2+12)$ (mũ 2 ở số 3). Bài 2c: $2^{x-1}=2^3.4$. Bài 5.1: số mũ cuối $2^{120}$, $2^{121}$, $2^{122}$. Đề gốc viết "Tính hợp lý", bản soạn viết "hợp lí" — hai cách viết cùng nghĩa, để nguyên.
- **Kiến thức**: tìm $x$ bằng thành phần chưa biết (Bài 2a, 2b, 2c), không chuyển vế; Bài 2c đưa về cùng cơ số bằng nhân hai luỹ thừa cùng cơ số (NNB00899), không dùng luỹ thừa của luỹ thừa; Câu 3 chỉ dùng dấu hiệu chia hết cho 3; Bài 3.2 đúng khuôn bội (NNB00904 / 00925); Bài 5.1 đúng khuôn NNB00913. Phần hình (Câu 6, 7, 8, Bài 4.1, 4.2, 5.2) giải theo SGK KNTT 6 vì bản đồ chưa có lý thuyết Ch IV (`k6.md` §7 Q5 còn mở).
- **Phân loại**: `kho=hgt` cho Câu 6, 7, 8, Bài 4.1, 4.2, 5.2; còn lại `dai`. Trả lời ngắn: Bài 1a (10), 1b (2), 1c (2526), 2a (85), 2b (80), 2c (6), 3.2 (63), 5.2 (24) — đều một số ≤ 4 ô.
- **Hình**: Câu 7 `p2c7_1.png` (kệ gỗ ba ô lục giác, đủ, không cụt) giữ nguyên. Bài 4.2: tranh cánh đồng khoai của đề chỉ trang trí, không mang dữ kiện, đề không nhắc "hình vẽ" ⇒ không đính kèm (có `Ghi chú`).
- **Bài 4.1**: số đo của đề tự khớp nhau (nửa hai đường chéo 6 và 8, cạnh 10) — hình thoi có thật.
- **Nhãn câu**: đề gốc đánh số La Mã (Bài I–V) và ý 1) 2) 3). Bản nhập: ý của bài Tính / Tìm $x$ dùng chữ (`Bài 1a`…`2c`), bài toán tách từ một "Bài" dùng số (`Bài 3.1`…`5.2`) — cùng quy ước với CKI-02.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

Điều người duyệt nên biết (không phải nghi ngờ đáp số): **Bài 5.2** là câu nâng cao (nửa của Bài V 1,0 điểm) đang để dạng trả lời ngắn (đáp số 24) theo luật "đáp số là một số ≤ 4 ô"; học sinh chỉ tô đáp số, phần lập luận tìm $a=1$, $b=6$ không được chấm trên app.
