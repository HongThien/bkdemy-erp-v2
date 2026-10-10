KẾT LUẬN: ĐẠT

# Biên bản soát — CKI-23 (Cụm chuyên môn số 14 — kiểm tra học kì I Toán 6, 2025–2026, bộ sách Kết nối tri thức)

- Trạm soát: Opus, 10/10. Pha 1 giải mù từ ảnh trang (ghi `CKI-23.kiem.md` trước khi mở bản soạn); Pha 2 soát `CKI-23.soan.md`.
- Bản soạn nguyên gốc trước khi sửa: `CKI-23.soan.goc.md`.
- **Số câu: 18** (4 trắc nghiệm · 8 trả lời ngắn · 6 tự luận; HGT 3 câu; 4 câu có hình). Đề không có phần tiếng Anh "Hệ T", không câu nào bị bỏ.
- **Khớp đáp án Pha 1 ngay từ đầu: 18 / 18.** Mọi đáp số đã tính lại bằng máy (`node -e`, vét cạn Bài 2, Bài 3.2; Bài 5 kiểm bằng số nguyên lớn $A+1=2^{2026}$).
- **Số câu phải sửa: 4** (Câu 5, Câu 7, Bài 2c, Bài 3.1) + tiêu đề đề — không câu nào sai đáp số, không câu nào sai toán.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng sau khi sửa (18 câu, chưa chắc 0).

## Chép đề — đã đối chiếu từng câu với ảnh trang + ảnh cắt 400 dpi từ `goc.pdf`

Số, dấu âm, số mũ, ngoặc đều khớp: Câu 2 (4 phương án, D có đủ $-1;1;-5;5$), Câu 3 (bảng 4 dòng $18;-3;-13;5$), Câu 6 ($2025-(5-9+2026)$),
Câu 7 ($-3\le x<5$ — dấu $\le$ bên trái, $<$ bên phải), Bài 1a–1d ($(-125)+15+125$ · $(-25).64+36.(-25)$ · $3^5:3^2+(-25).(-4)$ · $500:\{150-[8^2+7.(-2)]\}$),
Bài 2a–2c ($x-12=-7$ · $16:x-2=6$ · $(x-1).(3x+6)=0$), Bài 3.2 (150–200; bó 10, 12, 15), Bài 4 (12 m, 10 m, 30 000 đồng), Bài 5 (số mũ 2024, 2025, 2026).
Đề không có kí hiệu chia hết / không chia hết.

## Hình

- `p1c3_lai.png` (Câu 3): đủ bảng 4 dòng, không cụt.
- `p1c4_lai.png` (Câu 4): đủ 4 hình + nhãn Hình 1–4, không dính chữ câu khác.
- `p1c5_lai.png` (Câu 5 — **cắt lại**): hình thoi $ABCD$ đủ nhãn $A,B,C,D,O$. Ảnh cũ `p2c5_1.png` dính một mẩu dấu chữ của dòng "Phần 3" ở mép dưới.
- `p2c4_lai.png` (Bài 4): đủ hình chữ nhật, 4 nhãn "6 m", nhãn "10 m", "Trồng hoa", 2 chữ "Trồng cỏ", không cụt.

## Phân xử Câu 4 (hình nào không có trục đối xứng)

Cắt riêng từng hình ở 400 dpi từ `goc.pdf`, xem bằng mắt và đo bằng máy (tỉ lệ điểm ảnh nét vẽ trùng với ảnh lật / quay của chính nó, dung sai 6 px):

| Hình | Lật qua trục đứng | Lật qua trục ngang | Quay 180° | Kết luận |
|---|---|---|---|---|
| Hình 1 (con bướm, ảnh màu) | 1,00 | 0,57 | 0,57 | Có trục (đường dọc theo thân) |
| Hình 2 (ngôi sao 5 cánh) | 1,00 | 0,24 | 0,24 | Có trục |
| Hình 3 (hình bình hành) | 0,57 | 0,57 | 1,00 | **Không** có trục, chỉ có tâm đối xứng |
| Hình 4 (trái tim) | 1,00 | 0,22 | 0,22 | Có trục (đường dọc chính giữa) |

Hình 3: cạnh nằm ngang dài khoảng 400 px, cạnh nghiêng khoảng 210 px (lệch ngang 100 px, cao 185 px) ⇒ không phải hình thoi nên cũng không có trục
theo đường chéo; hai cạnh kề không vuông góc nên không phải hình chữ nhật. ⇒ đáp án **C**, không có cách hiểu thứ hai.

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| (tiêu đề đề) | chép đề | "Cụm chuyên môn số 14 (mã đề CKI-23)" → "Cụm chuyên môn số 14, bộ sách Kết nối tri thức (đề không ghi mã đề)" | `CKI-23` là mã nội bộ của bộ đề, không phải mã đề in trên đề; ghi bộ sách để phân biệt với hai đề Cụm 14 khác (CKI-24 Chân trời sáng tạo, CKI-25 Cánh Diều) |
| Câu 5 | hình | `**Hình:** p2c5_1.png` → `p1c5_lai.png` (cắt lại từ trang 1, `-x 858 -y 1230 -W 300 -H 165`) | Ảnh cũ dính mẩu chữ của dòng dưới ở mép dưới |
| Câu 7 | chép đề (ghi chú) | Thêm `Ghi chú`: đề gốc in lỗi phông "ng□yên", đã sửa thành "nguyên" | Brief soạn: sửa lỗi in của đề thì phải ghi chú đã sửa gì |
| Bài 2c | định dạng | Phần 2 viết lại theo cột (mỗi dòng một bước tìm thành phần chưa biết) + thêm dòng "Vì tích bằng 0 nên $x-1=0$ hoặc $3x+6=0$."; Phần 1 Bước 3 nói rõ thành phần nào | Khuôn tìm $x$ của `k6.md` §2 là theo cột; bản soạn dồn cả trường hợp vào một dòng "nên … hay … suy ra …" và thiếu câu lí do tách hai trường hợp. Đáp số không đổi |
| Bài 3.1 | chép đề | Bỏ chữ "(độ $C$)" trạm soạn tự thêm vào câu hỏi; thêm `Ghi chú`: đáp số $-9^\circ C$, ô trả lời ngắn chỉ nhập $-9$ (đơn vị đã có trong đề) | Đề phải chép nguyên văn; đơn vị $^\circ C$ là đơn vị duy nhất của đề nên vẫn là trả lời ngắn (cùng cách làm với CKI-03 Bài 3.1) |

## Đã soát, không sửa

- Câu 1, 2, 3, 4, 6 · Bài 1a–1d · Bài 2a, 2b · Bài 3.2 · Bài 4 · Bài 5: đề đúng ảnh, đáp án khớp Pha 1, lời giải đúng từng dòng, tìm $x$ theo thành phần chưa
  biết (không chuyển vế), số âm trong phép tính để trong ngoặc, dấu nhân là dấu chấm, Phần 1 đủ 3–5 bước nghĩ thật.
- Kiến thức: số đối, ước nguyên, so sánh số nguyên, quy tắc dấu ngoặc, nhân / chia số nguyên, "tích bằng 0 thì có thừa số bằng 0", trục đối xứng,
  diện tích hình thoi / hình bình hành — đều thuộc SGK Kết nối tri thức 6 tập 1 (Ch III–V), đúng phạm vi đề cuối kì 1. Bài 3.2 đúng khuôn BC / BCNN
  (`NNB00925`), Bài 5 đúng khuôn dãy luỹ thừa cùng cơ số (`NNB00902`).
- Phân loại: `kho=hgt` cho Câu 4, Câu 5, Bài 4 — đúng. Trả lời ngắn: $4$, $15$, $127$, $5$, $5$, $2$, $-9$, $180$ đều là một số ≤ 4 ô theo đúng đơn vị đề hỏi.
  Bài 1b ($-2500$ cần 5 ô), Câu 6 (đáp án là một biểu thức), Bài 2c (hai giá trị), Câu 5 (Đúng/Sai), Bài 4 (lời văn 3 ý), Bài 5 (chứng minh) để `tu_luan` — đúng.
- Tách ý: Bài 1, Bài 2 tách từng ý; Bài 3 gom hai bài toán khác hẳn nhau (nhiệt độ · quyên góp sách) ⇒ `Bài 3.1`, `Bài 3.2` — bản soạn đã tách đúng; Bài 4 giữ chung.
- `Ghi chú` còn lại (Câu 5, Câu 6, Bài 1b, Bài 2c) đều là điều người duyệt cần biết — giữ.

## Điều người duyệt nên biết (không phải lỗi)

- Câu 3: đề gốc in câu hỏi "Thành phố nào có nhiệt độ thấp nhất là:" (thừa chữ) — giữ nguyên văn, nghĩa không đổi.
- Câu 3 vừa có bảng chép thành chữ trong đề vừa có ảnh bảng `p1c3_lai.png` — hai nơi cùng một nội dung.
- `k6.md` §1 luật 3 còn ghi "Ch III–V chưa giải tới khi CEO có lý thuyết trên bản đồ" — đề này phần lớn câu thuộc Ch III–V (chỉ Bài 3.2 và Bài 5 thuần Ch I–II), lời giải theo SGK KNTT 6 (như brief soạn cho phép).

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
