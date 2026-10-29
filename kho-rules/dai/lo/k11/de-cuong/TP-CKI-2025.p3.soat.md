KẾT LUẬN: ĐẠT

# Biên bản soát — TP-CKI-2025 khúc 3 (trang 9–12)

- Số câu: 31 (Phần I đuôi: Câu 27–31 TN · Phần II: Câu 1–9 Đ/S · Phần III: Câu 1–17 tự luận; tất cả `kho=hinh_hoc`).
- Đề gõ đối chiếu ảnh trang 9–12: đủ câu, đúng chữ / tên điểm / phương án; không lệch.
- Khớp Pha 1 (giải mù, `TP-CKI-2025.p3.kiem.md`, kiểm toạ độ `tam/soat_p3_mu.mjs`) ngay từ đầu: 29/31. Lệch / không chắc: P32 Câu 6 ý d (đáp án đổi), P32 Câu 2 ý d (giữ đáp án, sửa lập luận + cờ).
- Số câu phải sửa: 10 (3 câu nội dung + 7 câu hình giải) và tiêu đề PHẦN của Phần I.
- Phân loại `loai` / `kho` / `dap_an`: đúng (không câu nào có đáp số tô được 4 ô).
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt (31 câu · 4 chưa chắc).

## Tên / số PHẦN (ghép với khúc 2)

Đề in (trang 5): "CHƯƠNG IV: … QUAN HỆ SONG SONG" / "Phần I: Câu trắc nghiệm nhiều phương án lựa chọn" — Câu 1–26 ở khúc 2 (PHẦN 22), Câu 27–31 ở trang 9 là đuôi của cùng mục.
Bản soạn khai `PHẦN 31 | Chương IV. … — Phần I: …` ⇒ KHÁC cả số (31 ≠ 22) lẫn tên (dấu "." / ":") so với p2 ⇒ khi ghép sẽ thành hai PHẦN tách rời. Đã đổi thành `PHẦN 22` với tên + dạng thức chép y hệt p2 (`Chương IV: Đường thẳng và mặt phẳng trong không gian. Quan hệ song song — Phần I. Câu trắc nghiệm nhiều phương án lựa chọn | trac_nghiem`); nhãn Câu 27–31 không trùng Câu 1–26. PHẦN 32, 33 đổi "Chương IV." → "Chương IV:" cho thống nhất (số giữ nguyên).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Tiêu đề Phần I (Câu 27–31) | định dạng | `PHẦN 31` → `PHẦN 22`, tên chép y p2 | để `ghep-k11.mjs` nối vào Phần I của khúc 2 (xem trên) |
| P32 Câu 2 | lập luận | thay câu "vì $ABCD$ lồi … nên $K$ nằm ngoài đoạn $CD$ về phía $C$" bằng lập luận cho đáy hình bình hành ($AB\parallel CK$) | khẳng định cũ SAI với đáy lồi tổng quát: toạ độ đáy lồi $A(0,0)$, $B(4,0)$, $C(4,4)$, $D(-1,1)$, $N(4,1)$ cho $K$ ở phía $D$ và giao điểm nằm TRONG đoạn $KM$ (tham số 0,588 — `tam/soat_p3_c2d.mjs`) |
| P32 Câu 2 | chưa chắc | thêm `**Chưa chắc:**` ý d (đáp án giữ DDDS) | "cạnh $KM$" đoạn ⇒ Sai / đường thẳng ⇒ Đúng; đáy khác cũng đổi kết quả (toạ độ: đáy hbh tham số trên $KM$ = 1,32 — ngoài đoạn) |
| P32 Câu 3 | chưa chắc | thêm `**Chưa chắc:**` ý c | đề in "$AM$, $KN$, $d$": $KN$ đi qua $M$ ⇒ Sai theo chữ in; ba đường đồng quy thật là $AM$, $BN$, $d$ (toạ độ: $AM\cap BN$ nằm trên $d$) — cùng loại với P32 Câu 5b |
| P32 Câu 6 | đáp số + lập luận | `dap_an` DDDS → **DDDD**; Phần 2 ý d kết luận Đúng (hình bình hành là hình thang theo định nghĩa SGK); viết lại dòng Chưa chắc | bản soạn dùng định nghĩa "hình thang = đúng một cặp cạnh đối song song" — không phải định nghĩa SGK (hình thang là tứ giác có hai cạnh đối song song). Vẫn giữ cờ vì ý người ra đề có thể là Sai |
| P32 Câu 9 / P33 Câu 17 (cùng ảnh) | hình | nhãn $C$ đè lên chấm $I$; nhãn $K$ đè nét $C'C$ ⇒ đặt lại nhãn $C$, $I$, $K$ | nhãn chồng gây đọc nhầm $C$ ↔ $I$ |
| P33 Câu 5 | hình | nhãn $F$ nằm sát chấm $B$ (đọc nhầm $B$ ↔ $F$), $H$, $D$ đè nét ⇒ đặt lại | nhãn chồng |
| P33 Câu 6 | hình | đổi toạ độ đáy: $E=AD\cap BC$ cũ chiếu vào TRONG hình chóp, mặt $(SAD)$ gần như suy biến (MN đè SA, SD) ⇒ $E$ nằm hẳn trước đáy, $N$ trên $SD$ rõ | hình cũ đúng toạ độ nhưng không đọc được |
| P33 Câu 12 | hình | đổi toạ độ: $T=AD\cap BC$ cũ chiếu trùng cạnh $SB$ / sát $N$, $ST$ đè $SV$; nhãn $C$, $D$, $E$ chồng ⇒ $T$ ra ngoài bên phải, tách $ST$ khỏi $SV$, đặt lại nhãn $D$ | nhãn + điểm chồng |
| P33 Câu 2 | hình | nhãn $N$, $D$ đè nét ⇒ đặt lại | nhãn chồng |
| P33 Câu 11 | hình | nhãn $D$ dính $O$; ảnh rộng 600 px > 560 ⇒ thu khổ (550 px), đặt lại nhãn $D$ | nhãn chồng + quá khổ |

Hình vẽ lại bằng `<LV>\tam\ve_p3.mjs` (bản trước giữ ở `ve_p3.goc.mjs`); `giai_P32C9.png` chép từ `giai_P33C17.png` (cùng hình lăng trụ). Đã mở kiểm từng ảnh sau khi vẽ. Các hình giải khác (C1, C3, C4, C7–C10, C13–C16) đúng dữ kiện, nét khuất đúng, đủ điểm của lời giải; 4 hình đề (de_P33C4–C7) đúng câu, đủ nhãn.

## Câu còn Chưa chắc / đề sai (gửi CEO)

- P32 Câu 2 ý d — Chưa chắc: "cạnh $KM$" là đoạn hay đường thẳng; đáy không cho. Chọn Sai (DDDS ↔ DDDD).
- P32 Câu 3 ý c — Chưa chắc: in "$AM$, $KN$, $d$" (Sai), nghi in nhầm "$BN$" (Đúng). DSSS ↔ DSDS.
- P32 Câu 5 ý b — Chưa chắc (trạm soạn, giữ): in "song song với $SA$" (Sai), nghi in nhầm "$SB$" (Đúng). DSDS ↔ DDDS.
- P32 Câu 6 ý d — Chưa chắc: thiết diện hình bình hành có là "hình thang" không. Chọn Đúng theo định nghĩa SGK (DDDD ↔ DDDS).
- P33 Câu 17 — đề sai (trạm soạn, đã kiểm toạ độ): $(A'KG)\parallel(AIB)$ sai vì $(AIB)=(ABC)$ và $C\in(A'KG)$; giải theo $(AIB')$ (đúng, toạ độ xác nhận).
- Cần biết (không phải cờ): P32 Câu 6c, Câu 9b dùng điểm $N$ chưa định nghĩa — đã kiểm: 6c Đúng với $N=BD\cap$ giao tuyến ý b; 9b Sai bất kể $N$ vì $\dfrac{AI}{AM}=\dfrac23$.

## Nhận xét chung

Lời giải đúng luật K11 (không vectơ, không đạo hàm); TN xét đủ 4 phương án; Đ/S có căn cứ từng ý; tự luận hình nêu rõ căn cứ giao tuyến / đường trung bình / Thalès. Toạ độ xác nhận: C28 chỉ D song song; C31 $6\sqrt5$; P33 C10 $BK/BC=1/3$; C12 c giao điểm là trung điểm $SB$, d $MK\parallel(SAB)$; C15 $Y$ với $BY=\frac32BB'$, $Z$ trung điểm $HB'$; C16 đúng với mọi tỉ số.
