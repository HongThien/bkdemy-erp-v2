KẾT LUẬN: ĐẠT

# CKI-29 — biên bản soát (Opus, 14/10)

Đề: Kiểm tra học kì I 2025–2026, UBND xã Đông Anh — Phòng Văn hoá - Xã hội, Toán 7 (KNTT), 90 phút, 1 trang (trang 57 file BỘ-ĐỀ-CKI-7.pdf). 100% tự luận.

- Số câu: **11** (Bài 1a–1d, Bài 2a–2d, Bài 3, Bài 4, Bài 5) — 1 trả lời ngắn (Bài 1b), 10 tự luận; kho: 10 `dai` + 1 `hinh_hoc` (Bài 4).
- Khớp đáp án Pha 1 (`CKI-29.kiem.md`) ngay từ đầu: **11/11**. Không câu nào lệch đáp số.
- Số câu phải sửa: **5** (không câu nào sai đáp số / chép đề; toàn sửa trình bày và chặt lập luận).
- Chép đề: đối chiếu ảnh trang — đủ 5 bài, số / dấu / mũ / giá trị tuyệt đối đúng (Bài 1c đúng là $-\dfrac{-7}{17}$; Bài 1d $\left(\dfrac{-1}{3}\right)^2$). Khung họ tên đã bỏ.
- Hình: `p1b3.png` đúng biểu đồ Bài 3, trọn, không dính chữ; số liệu 25% · 36% · 14% · 25% đã có trong Đề. Bài 4 đề gốc không có hình.
- Phạm vi KNTT cuối HK1: Bài 1–2 Ch I–II · Bài 3 Ch V (biểu đồ hình quạt) · Bài 4 Ch IV (c.g.c, cạnh huyền – góc nhọn, tiên đề Euclid Ch III). Không có kiến thức ngoài phạm vi. Bài 5 (0,5 điểm, nâng cao) dùng biểu thức chứa chữ $x,y$ (biểu thức đại số chính thức thuộc Ch VII – HK2), nhưng lời giải chỉ dùng tính chất phân phối, định nghĩa luỹ thừa, $a^2\ge0$, $|a|\ge0$ cho số hữu tỉ — không cần hằng đẳng thức hay đa thức.
- Phân loại / tách ý: đúng luật (tách Bài 1, Bài 2; Bài 3 chỉ có mục "1)" nên giữ một câu; Bài 4, Bài 5 giữ chung). Bài 1d đáp số $\dfrac{21}{5}$ (= 4,2) để `tu_luan` vì đáp số tự nhiên là phân số.
- Cổng: `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/k7/CKI-29.soan.md --lam-viec "…\K7\CKI-29" --khoi 7 --chi-kiem` ⇒ **✔ đạt cổng** (11 câu · 1 TLN · 10 tự luận · hình 1 · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1d | định dạng | Đưa hai dòng "Ta có $\sqrt{\dfrac{4}{25}}=\dots$", "$\left|-0,75\right|=\dots$" lên trước, thêm "Do đó:" rồi mới chép biểu thức và chuỗi $=\dots$ | Bản soạn chèn hai dòng giải thích giữa dòng biểu thức và dòng "$=\dots$" ⇒ dấu "=" đọc như nối vào $\left(\dfrac{-1}{3}\right)^2=\dfrac19$ |
| Bài 2d | lập luận (Phần 1) | Bước 3: "bình phương hai vế để bỏ dấu căn" ⇒ "dùng định nghĩa căn bậc hai số học ($\sqrt A=b$, $b\ge0$ thì $A=b^2$)" | Đúng cách SGK 7 / khuôn NNB00967, không dùng phép "bình phương hai vế" |
| Bài 3 | định dạng | Phần 2 a): bốn dòng liệt kê ⇒ bảng hai hàng "Thể loại phim: … \| …" / "Tỉ lệ: … \| …" | Đề yêu cầu LẬP BẢNG; thống nhất cách viết bảng với CKI-20 Bài 3.2 |
| Bài 4 | định dạng | c) "$AM=DM$ (giả thiết) (cạnh huyền)" ⇒ "$AM=DM$ (giả thiết) là cạnh huyền" | Hai ngoặc lý do liền nhau |
| Bài 5 | kiến thức / lập luận | a) $(15-6x)^2=9.(2x-5)^2$ viết rõ qua định nghĩa luỹ thừa: $\left[(-3).(2x-5)\right].\left[(-3).(2x-5)\right]=(-3).(-3).(2x-5).(2x-5)$; b) viết lại: "$A=2025$ khi $-8.(2x-5)^2-|x-y-1|=0$; vì hai số hạng đều $\le0$ nên cả hai bằng 0" | a) "luỹ thừa của một tích" không được SGK KNTT 7 dạy thành quy tắc ⇒ tự lập luận bằng định nghĩa (k7.md §1 luật 2). b) bản soạn viết "$8.(2x-5)^2=0$ … (vì hai số hạng đều không dương)" — hai số hạng đã đổi dấu, lý do không khớp vế |

## Câu còn `Chưa chắc`

Không. (Bản soạn không có dòng `Chưa chắc`; soát không phát sinh chỗ nào chưa chắc.)

Ghi chú để CEO biết (không cần sửa): Bài 3 trong đề gốc chỉ có mục "1)", không có "2)" dù Bài 3 = 2 điểm — đề vẫn đủ dữ kiện cho hai ý a), b). Bài 4 c) ngầm giả thiết $H\ne M$ (tam giác không cân tại $A$); bản soạn đã ghi trường hợp $H\equiv K\equiv M$ trong `Ghi chú`.

## ẢNH CHO CEO

Không.
