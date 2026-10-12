KẾT LUẬN: ĐẠT

# GKI-04 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Phúc Lợi, quận Long Biên — giữa học kì 1 Toán 6, 2024–2025, đề số 1 (2 trang, không có phần tiếng Anh).
> Pha 1 giải mù: `GKI-04.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-04.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (19 câu: 8 TN · 9 TLN · 2 tự luận · HGT 3 · hình 2 · chưa chắc 0).

## Số liệu

- Số câu: **19** (Câu 1–8; Bài 1a–1d; Bài 2a–2d; Bài 3; Bài 4; Bài 5). Không sót, không thừa câu; không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **19 / 19** (17 câu có `dap_an` trùng từng chữ / từng số; 2 câu tự luận — Bài 4 gồm 4 m$^2$ · 32 m$^2$ · 128 viên, Bài 5 cách nhóm 3 số hạng ra thừa số 13 — trùng kết quả).
- Số câu phải sửa: **3 / 19** (Câu 3, Câu 5, Bài 4) — không câu nào đổi đáp số.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 3 | lập luận | Phần 2: "Số 17 không chia hết cho 2 và không chia hết cho 3 nên 17 chỉ có hai ước là 1 và 17" ⇒ "Số 17 chỉ chia hết cho 1 và 17 nên 17 chỉ có hai ước là 1 và 17". Phần 1 Bước 3: "thử chia lần lượt cho 2 và 3 rồi kết luận…" ⇒ "tìm các ước của nó bằng cách chia lần lượt cho các số từ 1 đến chính nó, rồi kết luận…" | "Không chia hết cho 2 và 3" không suy ra được "chỉ có hai ước" (25 cũng không chia hết cho 2 và 3 mà là hợp số). Quy tắc chỉ cần thử các số nguyên tố có bình phương không vượt quá số đó không có trong lý thuyết nhóm NNB00908 trên bản đồ; lý thuyết chỉ có định nghĩa "chỉ có hai ước là 1 và chính nó" và cách tìm ước "chia lần lượt cho 1, 2, 3, …" (NNB00904) |
| Câu 5 | chép đề | Đề "Cho các hình vẽ sau (Hình 1, Hình 2, Hình 3, Hình 4). Hình tam giác đều là" ⇒ "Cho các hình vẽ sau. Hình tam giác đều là" | Cụm trong ngoặc không có trong đề gốc; tên bốn hình đã nằm ngay trong ảnh |
| Câu 5 | hình | `**Hình:** p1c5_lai.png` ⇒ `p1c5_lai2.png` (cắt lại bằng `pdftoppm -r 150 … -f 1 -l 1 -x 350 -y 884 -W 700 -H 168`; tệp cũ giữ nguyên, không đè) | Ảnh cũ dính một vệt chữ của dòng "Hình tam giác đều là" ở mép dưới bên trái. Ảnh mới đủ 4 hình và 4 nhãn "Hình 1 … Hình 4", không cụt, không dính chữ |
| Bài 4 | lập luận | Phần 2 ý 1: thêm "Theo hình vẽ," trước "phần sân trồng hoa là hình chữ nhật có chiều dài $4\ m$, chiều rộng $1\ m$" | Kích thước 1 m của phần sẫm màu chỉ có trên hình, đề không nói bằng chữ — phải nêu căn cứ (cùng cách sửa ở GKI-02 Bài 4) |
| Mục "GHI CHÚ CHO NGƯỜI DUYỆT" | định dạng | Xoá câu "(chỉ máy gõ nhầm "phân tử" thành "phần tử", đã đối chiếu ảnh)"; đổi tên ảnh Câu 5 thành `p1c5_lai2.png` | Ghi chú về lỗi của bản máy gõ không thuộc bản soạn. Đã phóng to ảnh 300 dpi: đề gốc in đúng "phần tử" |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 19 câu đối chiếu ảnh — đúng số, số mũ ($4.3^2-75:5^2$, $(15-3)^2$, $2.5^2$, $(13-8)^2-4^2$, $3^{29}+3^{30}$), đủ ba tầng ngoặc ở Bài 1d, đủ 4 phương án. Câu 7: bốn phương án khớp ảnh từng số hạng (A thiếu hàng trăm là đúng đề — chữ số hàng trăm bằng 0). Không có dòng `**Ghi chú:**` nào trong các câu — đề gốc không có lỗi in.
- **Nhãn câu**: đề gốc đánh phần tự luận là "Câu 1 … Câu 5" với các ý "1) 2) 3) 4)"; bản soạn đặt nhãn "Bài 1a–1d, Bài 2a–2d, Bài 3, Bài 4, Bài 5" theo brief soạn và giống các đề khác trong lô (đã ghi ở mục cuối bản soạn). Để nguyên; trong đề Bài 4 vẫn giữ "1)" "2)" như đề gốc.
- **Kiến thức**: không có chuyển vế (Bài 2a–2d đều tìm thành phần chưa biết: số hạng, số trừ, số bị chia, thừa số); Bài 1b đặt thừa số chung 12 sau khi ghép $2.6$ và $3.4$ (khuôn NNB00893); Bài 1d phá từng tầng ngoặc (NNB00900); Bài 3 dùng $\text{Ư}(24)$ rồi lọc $a>2$; Bài 5 đúng khuôn NNB00913 (đếm $30-1+1=30$ số hạng = 10 nhóm 3). Chỉ dùng dấu hiệu chia hết cho 2, 5, 3, 9.
- **Câu 2**: Phần 2 tách $XVII$ thành ba cụm $X$, $V$, $II$ (lý thuyết bản đồ tách $X$ và $VII$ — "thêm $X$ vào bên trái các số từ $I$ đến $X$"). Đúng toán, đúng kiểu câu của khuôn NNB00891 ⇒ để nguyên.
- **Câu 5**: tam giác đều nhận bằng mắt (đề không ghi số đo, không kí hiệu cạnh bằng nhau). Đo trên ảnh trang 150 dpi: hình 1 có cạnh đáy ≈ 142 px, hai cạnh bên ≈ 144 px ⇒ ba cạnh bằng nhau; hình 4 có góc vuông. Đáp án A là phương án duy nhất hợp lí.
- **Bài 2d**: dòng `$(19x+2.25):14=5^2-4^2$` — "2.25" là $2$ nhân $25$ theo quy ước dấu nhân chấm của SGK (không phải số thập phân); dòng kế đã ra $19x+50$.
- **Bài 4**: máy tính lại $9.4=36$, $36-4=32$, $320000:2500=128$; kiểm chéo phần lát gạch $8$ m $\times$ $4$ m xếp $16.8=128$ viên vừa khít. Dòng "Thử lại" ở Phần 1 có ghi 128 — cùng kiểu với "Thử lại" của mẫu GKI-01 (Bài 2a), không nằm trong các bước.
- **Phân loại**: `kho=hgt` cho Câu 5, Câu 8, Bài 4; còn lại `dai`. Bài 3 (lời văn) đáp số một số (8) ⇒ `tra_loi_ngan`; Bài 4 hai ý ⇒ `tu_luan`, giữ chung một câu; Bài 5 chứng minh ⇒ `tu_luan`. Chỉ Bài 1 (Tính) và Bài 2 (Tìm $x$) được tách ý.
- **Hình**: `p2c4_lai.png` (Bài 4) đủ khung sân, phần sẫm màu, ba nhãn "4m", "9m", "1m" — không cụt.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.

(Hai điểm để CEO biết, không phải nghi ngờ đáp số: **Câu 5** và **Bài 4** phụ thuộc vào hình — Câu 5 nhận tam giác đều bằng mắt, Bài 4 lấy kích thước 1 m từ hình; thiếu hình thì không giải được.)
