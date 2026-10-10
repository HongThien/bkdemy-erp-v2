KẾT LUẬN: ĐẠT

# CKI-02 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS và THPT M.V. Lô-mô-nô-xốp, Nam Từ Liêm — kiểm tra học kì 1 Toán 6, 2024–2025, ĐỀ 02 (2 trang scan, không có phần tiếng Anh).
> Pha 1 giải mù: `CKI-02.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `CKI-02.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (18 câu: 8 TN · 6 TLN · 4 tự luận · HGT 4 · hình 3 · chưa chắc 2).
> Ảnh scan: số mũ đọc lại từ ảnh cắt 300 dpi và 600 dpi (`pdftoppm` từ `goc.pdf`), không dựa vào bản máy gõ.

## Số liệu

- Số câu: **18** (Câu 1–8; Bài 1a, 1b; Bài 2a, 2b, 2c; Bài 3.1, 3.2; Bài 4; Bài 5.1, 5.2). Không sót, không thừa; không bỏ câu nào (đề không có phần "Hệ T").
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **18 / 18** (14 câu có `dap_an` trùng từng chữ / từng số; 4 câu tự luận — Bài 3.1: $-39^\circ C$ và $357^\circ C$; Bài 4: 70 m · 360 m$^2$ · 72 cây · 2160000 đồng; Bài 5.1: cùng cách chứng minh; Bài 5.2: $x=0$, $y=3$ — trùng kết quả).
- Số câu phải sửa lời giải: **3 / 18** (Bài 2c, Bài 5.1, Bài 5.2) — đều là lập luận / kiến thức, **không đổi đáp số, không đổi đề**. Ngoài ra sửa 1 chữ ở tên đề và thêm 1 dòng `Chưa chắc` (Bài 3.1).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Tên đề | chép đề | "(mã đề 02)" ⇒ "(đề 02)" | Ảnh in "ĐỀ 02", không phải mã đề |
| Bài 2c | lập luận | Mấu chốt: "$x$ chia hết cả hai số và lớn nhất…" ⇒ "cả 16 và 28 đều chia hết cho $x$ nên $x$ là ước chung của hai số; $x$ lớn nhất nên $x$ là ƯCLN" | Câu cũ nói ngược quan hệ chia hết (16 và 28 chia hết cho $x$, không phải $x$ chia hết cho chúng) — đúng chỗ học sinh hay lẫn ước với bội |
| Bài 5.1 | lập luận | Phần 2: thêm điều kiện "$m\ge n$" khi viết hiệu $10.(m-n)$ | Không có điều kiện thì $m-n$ có thể âm, hiệu "tổng lớn trừ tổng bé" chưa rõ |
| Bài 5.1 | định dạng (dòng `Chưa chắc`) | Viết lại dòng `Chưa chắc`: giữ ý nguyên lí Đi-rích-lê (ghi rõ trạm soát đã kiểm lập luận đúng) + thêm ý Bài V "chọn một trong hai" đang nhập thành hai câu | Hai điều này là việc người duyệt quyết, không phải nghi ngờ toán |
| Bài 5.2 | kiến thức / lập luận | Phần 2: bỏ lập luận "719 chia 3 dư 2 ⇒ $3^x$ chia 3 dư 1" (phép trừ số dư, viết tắt không giải thích); thay bằng: nếu $x\ge 1$ thì $3^x\vdots 3$ ⇒ hiệu của hai số chia hết cho 3 cũng chia hết cho 3 ⇒ $719\vdots 3$, vô lí vì $7+1+9=17$. Thêm lí do "ba số tự nhiên liên tiếp có một số chia hết cho 3" (xét $t$ chia 3 dư 1, dư 2). Dòng tìm $t$: thay "vì $504<720<990$ nên $t=8$" bằng xét đủ hai phía $t<8$ và $t>8$. Phần 1 (Mấu chốt, Bước 2–4) sửa theo | Chỉ dùng cái có trong lý thuyết K6: tính chất chia hết của một hiệu (NNB00905) và dấu hiệu chia hết cho 3 (NNB00907); k6.md §1 luật 2 — kết quả chưa có trong lý thuyết thì lập luận ngay trong bài. Dòng cũ chỉ loại được $t=7$ và $t=9$, chưa nói vì sao các $t$ khác cũng loại |
| Bài 5.2 | định dạng (dòng `Chưa chắc`) | Xoá dòng `Chưa chắc` của trạm soạn; chuyển ý đọc số mũ vào `Ghi chú`; thêm một dòng ở mục "GHI CHÚ CHO NGƯỜI DUYỆT" | Đã kiểm chắc chắn: (1) ảnh 600 dpi — ba luỹ thừa của 2 cùng một kiểu chữ mũ $y$ (hai chữ đầu hơi nhoè, chữ thứ ba rõ), luỹ thừa của 3 mũ $x$; thử máy cách đọc khác: mũ đầu là $x$ ⇒ vô nghiệm; (2) $\mathbb{N}$ có số 0 theo SGK KNTT nên $x=0$ hợp lệ; vét cạn bằng máy ra nghiệm duy nhất $x=0$, $y=3$ — trùng Pha 1 |
| Bài 3.1 | phân loại (thêm `Chưa chắc`) | Thêm dòng `Chưa chắc` về việc tách Bài III thành Bài 3.1 và Bài 3.2 | Luật chỉ cho tách bài Tính và Tìm $x$; nhưng Bài III là hai bài toán lời văn không chung đề bài, khác hẳn mạch kiến thức — trạm soát không tự quyết được, giữ nguyên cách tách của trạm soạn và nêu ra |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 18 câu đối chiếu ảnh — đúng số, số mũ, ngoặc, đủ 4 phương án. Câu 3: $2025^0+1^{2025}$. Câu 5: $a=2^4.3$; $b=2.3.7$. Bài 1b: $143-[68+8.(27-25)^2]$ (mũ 2 ngoài ngoặc tròn). Bài 2b: $(x+2)^3-15=12$ (mũ 3 — bản máy gõ nhầm mũ 2, trạm soạn đã theo ảnh). Bài 5.2: $2^y.(2^y+1).(2^y+2)-3^x=719$.
- **Câu 2**: đề gốc cho nhiệt độ bằng bảng; bản soạn chép bảng thành một dòng chữ + kèm hình bảng `p1c2_lai.png`, có `Ghi chú` — số liệu đúng ảnh ($-140$, $-120$, $-200$, $-80$).
- **Kiến thức**: tìm $x$ bằng thành phần chưa biết (Bài 2a, 2b), không chuyển vế; Bài 2b đúng khuôn NNB00899 (đưa về cùng số mũ); Bài 2c, Bài 3.2 đúng khuôn ƯCLN / BC–BCNN; Câu 4 chỉ dùng dấu hiệu chia hết cho 2, 5, 9 (và "chia hết cho 9 thì chia hết cho 3"). Số nguyên (Câu 1, 2, Bài 1a, Bài 3.1) và hình (Câu 6–8, Bài 4) giải theo SGK KNTT 6 vì bản đồ chưa có lý thuyết Ch III–V (k6.md §7 Q5 còn mở).
- **Phân loại**: `kho=hgt` cho Câu 6, 7, 8 và Bài 4; còn lại `dai`. Trả lời ngắn: Bài 1a (100), 1b (43), 2a (3), 2b (1), 2c (4), 3.2 (120) — đều một số ≤ 4 ô. Bài 3.1 (hai đáp số), Bài 4 (bốn đáp số), Bài 5.1 (chứng minh), Bài 5.2 (hai đáp số) ⇒ `tu_luan`.
- **Hình**: `p1c2_lai.png` (bảng đủ 2 hàng 5 cột), `p1c6_lai.png` (đủ 4 hình kèm nhãn Hình 1–4), `p2b4_lai.png` (hình thang cân đủ nhãn $A$, $B$, $M$, $N$, $C$, $D$ và 15 m, 20 m, 3 m, 3 m) — đều đúng câu, không cụt.
- **Bài 4**: lời đề "chiều dài 20 m, chiều rộng 15 m" khớp hình ($AD=20$ m, $AB=15$ m). Diện tích kiểm bằng hai cách: $(15+21).20:2=360$ và $20.15+2.(3.20:2)=360$.
- Nhãn câu: đề gốc đánh số La Mã (Bài I–V) và ý 1) 2) 3); bản soạn đổi thành Bài 1a, 1b, 2a, 2b, 2c, 3.1, 3.2, 4, 5.1, 5.2 — để nguyên.
- Câu 7: trong Phần 1, đoạn `Thử lại` đứng trước đoạn `Chú ý` (các câu khác thì ngược lại) — cổng nhận, không ảnh hưởng nội dung, để nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

1. **Bài 3.1** (kéo theo Bài 3.2) — *phân loại, không phải nghi ngờ đáp số*: Bài III của đề là hai bài toán lời văn độc lập (nhiệt độ thủy ngân · bánh dày) đang nhập thành hai câu, trong khi luật chỉ cho tách bài Tính và Tìm $x$. Giữ tách hay gộp một câu? (Gộp thì Bài 3.2 không còn là trả lời ngắn.)
2. **Bài 5.1** — (a) lời giải dùng nguyên lí Đi-rích-lê (11 tổng, 10 số dư), không có trong SGK KNTT 6; lập luận đã kiểm đúng, cần CEO quyết có nhận cách trình bày này cho lớp 6. (b) Bài V cho học sinh **chọn một trong hai câu** nhưng đang nhập cả hai thành hai câu riêng (5.1 và 5.2) — cần quyết cách để trong đề.
