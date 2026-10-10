KẾT LUẬN: ĐẠT

# GKI-19 — biên bản SOÁT (trạm soát, 10/10)

> Đề: THCS Phú Châu — bài kiểm tra giữa học kỳ I Toán 6, 2025–2026, 90 phút (3 trang, không ghi quận / xã, không ghi mã đề, không có phần tiếng Anh).
> **Ba trang là MỘT đề** (đã kiểm): p-1 = trắc nghiệm Câu 1–9 · p-2 = trắc nghiệm Câu 10–12 + tự luận Câu 1–6 · p-3 = tự luận Câu 7 + phần "BÀI LÀM" (dòng chấm để trống). Số câu chạy liền mạch qua ba trang, cùng phông chữ, không có tiêu đề trường nào khác ⇒ không có trang của đề khác bị gộp.
> Pha 1 giải mù: `GKI-19.kiem.md` (ghi trước khi mở bản soạn). Bản soạn trước khi sửa: `GKI-19.soan.goc.md`.
> Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (23 câu: 12 TN · 6 TLN · 5 tự luận · HGT 7 · hình 3 · chưa chắc 1).

## Số liệu

- Số câu: bản soạn **22** (TN Câu 1–12; tự luận Câu 1, 2, 3, 4a–4c, 5a–5b, 6, 7) ⇒ sau soát **23** (Câu 7 tách thành Câu 7.1 và Câu 7.2). Không sót, không thừa, không bỏ câu nào.
- Khớp đáp án / đáp số Pha 1 ngay từ đầu: **22 / 22** (12 TN trùng chữ cái: C D B B B A C B C D A B; 5 TLN trùng số: 100 · 1200 · 2024 · 4 · 55; 5 tự luận trùng kết quả: 8 số nguyên tố · II, XV, XVIII, XXVII · tập $M$ 13 phần tử · 54 m$^2$ và 216 viên · 425000 đồng và 36 học sinh). Số đã tính lại bằng `node -e`.
- Số câu phải sửa: **6 / 22** — không câu nào đổi đáp số, không câu nào đổi nội dung đề. Theo loại lỗi: kiến thức 1 · lập luận 2 · phân loại 1 · hình 3 · định dạng (dòng `Chưa chắc` / tên đề) 3 (một câu có thể dính hơn một loại).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| (đầu tệp) | định dạng | Tên đề: "THCS Phú Châu (đề không ghi quận, không ghi mã đề)" ⇒ "THCS Phú Châu (bộ đề GKI 6, đề 19)" | Tên đề là tên hiển thị trên Kho đề thi, không phải chỗ ghi nhận xét; nhận xét "đề không ghi quận / mã đề" đã có ở mục GHI CHÚ CHO NGƯỜI DUYỆT. Theo cách đặt tên của các đề cùng bộ (Chúc Sơn, Lê Ngọc Hân…) |
| TN Câu 1 | kiến thức | Phần 1 Bước 1: "…gồm các số nguyên dương và số 0" ⇒ "…gồm số 0 và các số đếm $1;2;3;\dots$" | "Số nguyên dương" là khái niệm của Chương III (số nguyên) — học SAU kì kiểm tra giữa kì 1 |
| TN Câu 7 | hình | `**Hình:**` p1c7_1.png ⇒ **p1c7_lai.png** (cắt lại từ `goc.pdf` trang 1, x 110, y 1090, 945 × 205) | Ảnh máy cắt dính nửa trên của dòng phương án "A. Hình a. … D. Hình d." ở mép dưới (chữ bị cắt ngang). Ảnh mới đủ 4 hình + nhãn "hình a … hình d", không dính chữ |
| TN Câu 7 | định dạng (dòng `Chưa chắc`) | Xoá dòng `**Chưa chắc:**` của trạm soạn | Đã kiểm chắc chắn đáp án C: phóng to ảnh — hình c ba góc cùng MỘT cung; hình b ba góc 1 / 2 / 3 cung (khác nhau); hình a có góc vuông; hình d tù, ba cạnh khác hẳn nhau. Đo pixel trên ảnh 150 dpi: hình c đáy 141, hai cạnh bên ≈ 148 (lệch ≈ 5% do ảnh bị kéo giãn nhẹ); hình b ba cạnh 198 / 150 / 174 ⇒ chỉ hình c có thể là tam giác đều. Pha 1 giải mù cũng ra C |
| TN Câu 11 | lập luận | Phần 1 Chú ý: "$MN$ và $NP$ là hai cạnh kề nhau nên không bằng nhau…" ⇒ "đề cho hai cạnh kề $MN$ và $NP$ có độ dài khác nhau ($4\ cm$ và $6\ cm$) nên $PQ$ và $MQ$ cũng khác nhau…" | "Kề nhau nên không bằng nhau" là suy luận sai (hình thoi có hai cạnh kề bằng nhau); lí do đúng là đề cho hai độ dài khác nhau |
| TL Câu 3 | hình | `**Hình:**` p2c3_1.png ⇒ **p2c3_lai.png** (trang 2, x 116, y 682, 996 × 350) | Ảnh máy cắt dính nửa trên của dòng "Hãy viết dưới dạng liệt kê…" ở mép dưới. Ảnh mới đủ ba thùng rác + ba cột chữ |
| TL Câu 3 | định dạng (dòng `Chưa chắc`) | Xoá `**Chưa chắc:**`, thay bằng `**Ghi chú:**` (đáp án là tập 13 phần tử đọc từ hình, mỗi cụm cách nhau bằng dấu phẩy là một phần tử — tự luận, chỉ in); sửa dòng tương ứng ở GHI CHÚ CHO NGƯỜI DUYỆT | Pha 1 giải mù đọc hình độc lập ra đúng 13 phần tử giống hệt (giấy báo; thùng carton; hộp giấy; bì thư; vỏ bao thuốc lá; vỏ lon; hộp đựng trà; kim loại; đồ nhựa; chai nhựa; bình xịt; vải; quần áo cũ). Dấu phẩy trong hình là dấu ngăn các loại rác nên cách tách này là cách đọc tự nhiên duy nhất |
| TL Câu 6 | hình | `**Hình:**` p2c6_1.png ⇒ **p2c6_lai.png** (trang 2, x 752, y 1318, 445 × 287) | Ảnh máy cắt dính mẩu chữ của dòng Câu 5b ở góc trên trái. Ảnh mới đủ nhãn $A, B, C, D, E, F, G$ và 10m · 5m · 7m · 2m |
| TL Câu 6 | định dạng (dòng `Chưa chắc`) | GIỮ `**Chưa chắc:**`, viết lại cho rõ: đề gốc ghi "lát sân" trong khi hình chỉ có hồ bơi; lời giải hiểu là lát kín phần diện tích hồ bơi | Đây là chỗ mơ hồ của ĐỀ GỐC, người duyệt cần quyết có sửa chữ hay không (xem mục dưới) |
| TL Câu 7 | phân loại | Tách thành **Câu 7.1** (tiền gói quà — `tu_luan`, đáp số 425000 có 6 chữ số) và **Câu 7.2** (số học sinh lớp 6A — `tra_loi_ngan`, `dap_an=36`); mỗi câu một Phần 1 riêng (3 bước) + `Ghi chú` nói rõ gốc là ý a / ý b của Câu 7; Câu 7.2 thêm dòng "Thử lại" | "Câu 7 (1,0)" chỉ là cái vỏ gom HAI bài toán khác hẳn nhau, mỗi bài một bộ dữ kiện riêng (a: giá gạo, lạc, gia vị, dầu ăn · b: sĩ số lớp) ⇒ theo luật tách của brief, mỗi bài toán một câu. Bản soạn gộp chung nên Phần 1 phải trộn hai mạch nghĩ không liên quan, và ý b (đáp số 36) mất cơ hội lên app |
| TL Câu 7 (nay là 7.2) | lập luận | Phần 2: "Vì $2$ và $3$ là hai số nguyên tố nên $\text{BCNN}(2,3)=2.3=6$" ⇒ "Ta có $2=2$; $3=3$ nên $\text{BCNN}(2,3)=2.3=6$" | Câu cũ trích một quy tắc không có trong lý thuyết bản đồ K6 (và thiếu chữ "khác nhau"); viết lại đúng khuôn NNB00923–925: phân tích ra thừa số nguyên tố rồi lấy thừa số chung và riêng |

## Đã soát, không sửa (ghi để người duyệt biết)

- **Chép đề**: 22 câu đối chiếu ảnh — đúng số, số mũ ($2^3$ ở Câu 4a; $2^3.5$, $6^2$, bình phương ngoài ngoặc tròn, $2024^0$ ở Câu 4c), ngoặc, đủ 4 phương án ở cả 12 câu TN, đơn vị m / m$^2$ ở Câu 10 đúng từng phương án. TN Câu 6: đề gốc in "Trong các số 0;1;6;8;11.Tập hợp tất cả…" (dấu chấm giữa câu) — bản soạn nối thành một câu bằng dấu phẩy, không đổi nghĩa. Các câu tự luận bỏ ghi điểm ("(1 điểm)"…) như mẫu GKI-01.
- **Đáp số**: tính lại bằng máy — $95+40:2^3=100$ · $12.73+30.12-3.12=1200$ · $2043-[36-(2^3.5-6^2)^2]+2024^0=2024$ · $x=4$ · $x=55$ · $10.5+2.2=54$ · $540000:2500=216$ · $220000+2.50000+5.5000+2.40000=425000$ · số trong khoảng 31–39 chia hết cho cả 2 và 3 chỉ có 36.
- **Kiến thức**: Câu 5a, 5b tìm thành phần chưa biết, không chuyển vế; TN Câu 5 dùng đúng tính chất chia hết của tổng (mỗi phương án sai có đúng một số hạng không chia hết cho 3) và chỉ dấu hiệu chia hết cho 3; Câu 4c phá ngoặc từ trong ra, mỗi dòng một bước; Câu 6 đổi đơn vị sang $cm^2$ rồi chia (gạch $50\ cm$ lát vừa khít cả hai phần $10\times5$ m và $2\times2$ m).
- **Phân loại**: `kho=hgt` cho TN Câu 7–12 và TL Câu 6; còn lại `dai`. TL Câu 1 (dãy 8 số), Câu 2 (4 số La Mã), Câu 3 (tập hợp chữ) ⇒ `tu_luan`. Chỉ Câu 4 (Tính) và Câu 5 (Tìm $x$) tách ý; Câu 6 (một bài toán, hai ý a b chung hình) giữ chung.
- **Nhãn**: đề gốc đánh số "Câu" hai lần (TN Câu 1–12, tự luận Câu 1–7) nên nhãn `Câu 1` … `Câu 7` xuất hiện ở cả hai phần — cổng phân biệt theo phần (P1 / P2), để nguyên theo nhãn gốc.
- TN Câu 8: đề ghi "lục giác $ABCDEF$" (không có chữ "đều"), lời giải nói "lục giác đều" — đúng theo SGK (đường chéo chính chỉ định nghĩa cho lục giác đều), để nguyên. Phần 2 viết $AD, BE, CF$, phương án B viết $AD, FC, EB$ — cùng ba đoạn thẳng.
- TN Câu 7: lời giải suy "ba góc bằng nhau ⇒ tam giác đều" (chiều ngược của tính chất trong SGK) — chấp nhận cho câu nhận biết hình; đề không cho cách nào khác.
- TL Câu 3: tập $M$ viết thành MỘT công thức dài 13 cụm `\text{…}` — đúng, nhưng trên màn hẹp có thể tràn dòng (KaTeX không ngắt trong công thức). Câu `tu_luan` chỉ in nên để nguyên.
- TN Câu 1, Phần 2 viết số thập phân `$2,5$` trong công thức (KaTeX chèn khoảng trắng nhỏ sau dấu phẩy) — vô hại, để nguyên.

## Câu còn `Chưa chắc` (gửi CEO)

| Nhãn | Lí do |
|---|---|
| Tự luận **Câu 6** (ý b) | Đề gốc ghi "Nếu **lát sân** bằng những viên gạch hình vuông có cạnh 50 cm…" trong khi hình chỉ có "Hồ bơi", không có sân nào và không cho kích thước sân. Cả hai trạm đều hiểu là lát kín phần diện tích hồ bơi ở ý a ($54\ m^2$) ⇒ 216 viên — cách hiểu duy nhất tính được. Đáp số không nghi ngờ; cần CEO quyết có sửa chữ "lát sân" thành "lát đáy hồ bơi" khi đưa vào kho hay giữ nguyên văn đề |

(Điểm để CEO biết, không phải nghi ngờ đáp số: TN Câu 7, TL Câu 3 và TL Câu 6 phụ thuộc hoàn toàn vào hình — thiếu hình `p1c7_lai.png` / `p2c3_lai.png` / `p2c6_lai.png` thì không giải được. Ba ảnh máy cắt cũ `p1c7_1.png`, `p2c3_1.png`, `p2c6_1.png` vẫn nằm nguyên trong `img/`, không xoá.)
