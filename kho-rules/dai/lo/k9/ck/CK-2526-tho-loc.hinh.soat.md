KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2526-tho-loc (THCS Thọ Lộc, bản SCAN) · phần Hình · 03/11/2026

- Số câu: **16** (Bài 1a–1f, Bài 2–11; Bài 8 giữ một câu hai ý vì chung tam giác + đường cao).
- Pha 0: tự lập danh sách từ `p-5.png`, `p-6.png` (B. Hình học, Dạng 1–5) = 11 bài / 16 câu — **khớp đủ** bản soạn. Bài sót: 0. Bài nhập nhầm (Đại số thuần): 0.
- Pha 1 (giải mù, `<LV>\tam\soat_mu.mjs`): **16/16 câu khớp đáp số / hướng chứng minh ngay từ đầu.**
- Số câu phải sửa: **5** (không câu nào sai đề / đáp số / toán / kiến thức): 2 câu sửa hình (Bài 3, 5), 3 câu sửa Ghi chú (Bài 2, 4, 7); thêm 1 chữ trong "Ghi chú cho người duyệt".
- Bản gốc trạm soạn giữ ở `CK-2526-tho-loc.hinh.soan.goc.md`; script vẽ gốc ở `<LV>\tam\ve_hinh.goc.mjs`.
- Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng (16 câu · 5 TLN · 11 tự luận · hình 10 · chưa chắc 0).

## Phân xử Bài 4 ("3,65 m" hay "13,65 m")

- Phóng to bản scan trang 5 ở 400 dpi: dòng chữ đề in rõ **"3,65m"**; nhãn dưới hình in rõ **"13,65 m"** — trạm soạn đọc đúng cả hai, mâu thuẫn nằm ở bản gốc.
- Tỉ lệ hình vẽ gốc không theo tỉ lệ thật nên không dùng để phân xử.
- **Nhân chứng độc lập:** đề cương THCS Thăng Long (`CK-2425-thang-long`, lớp chữ `pdftotext`) in đúng bài này: "Một người đứng cách chân tháp 13, 65 m …". ⇒ chữ "3,65" là lỗi in mất chữ số 1.
- Kết luận: giữ cách sửa của trạm soạn ($13{,}65$ m, tháp $\approx23{,}39$ m). Đây là lỗi in hiển nhiên, có đáp án rõ ⇒ sửa chữ đề + Ghi chú theo brief mục 7, **không** treo `Chưa chắc`. Đã thêm nhân chứng vào Ghi chú.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3 | hình | Hình đề: hai cung đánh dấu tia phân giác (bán kính 40 và 52) đổi thành cùng bán kính, có vạch nhỏ trên mỗi cung; nhãn $30^\circ$ dời từ giữa tam giác về sát góc $C$ | Hai cung khác bán kính không cho thấy $\widehat{BAD}=\widehat{DAC}$; nhãn $30^\circ$ nằm xa đỉnh $C$, dễ đọc nhầm |
| Bài 5 | hình | Hình đề: nhãn "80 m" chuyển thành đường kích thước có hai vạch đầu từ $A$ tới $C$ | Nhãn cũ nằm trơ dưới đoạn $AM$, dễ hiểu nhầm $AM=80$ m |
| Bài 4 | định dạng (Ghi chú) | Thêm vào Ghi chú: đã phóng to bản scan + nhân chứng đề cương Thăng Long in "13,65 m" | Củng cố căn cứ sửa chữ đề |
| Bài 7 | định dạng (Ghi chú) | "theo hình đề cương" ⇒ "đề cương không có hình …; hiểu theo cách gọi tên đường cao" | Đề cương Thọ Lộc không có hình cho Bài 7 — Ghi chú cũ nói sai nguồn |
| Bài 2 | định dạng (Ghi chú) | Bỏ cụm "định lý côsin" trong Ghi chú kiểm (thay bằng "toạ độ số") | Tránh để chữ công cụ bị cấm xuất hiện trong dữ liệu câu (lời giải vốn không dùng) |
| (cuối tệp) | định dạng | "10 bài" ⇒ "11 bài" trong Ghi chú cho người duyệt | Phần B có Bài 1–11 |

Đã soát và để nguyên (đúng): đề chép khớp ảnh cả 16 câu (số, góc, tên điểm, đủ ý) · lời giải đúng toán từng dòng, không góc nội tiếp / tứ giác nội tiếp / đường trung bình / định lí sin–côsin / hệ thức đường cao dùng thẳng; Bài 6 không dùng sẵn $\dfrac12ab\sin C$, Bài 9a và 11c chứng minh góc vuông bằng tam giác cân + tổng ba góc · chứng minh tiếp tuyến nêu đúng dấu hiệu, hai tiếp tuyến cắt nhau nêu đúng tính chất · làm tròn đúng đề (Bài 3c, 4, 5 theo đề; Bài 2, 3ab, 11b mặc định) và tính từ giá trị đúng · Phần 1 3–6 bước, không lộ đáp số · `loai`: 1a, 1b, 1d, 1e, 1f `tra_loi_ngan` (0, 0, 1, 0, 4); 1c ($\dfrac38$) để `tu_luan` · hình đề 2, 4, 6–11 và mọi hình giải đúng dữ kiện, không lộ kết quả.
Bài 11d: lời giải dùng "$K$ thuộc tia $PA$" (đề ghi "$K$ thuộc $AP$") — đã kiểm 3000 cấu hình, $K$ luôn trên tia $PA$ (nằm trên đoạn $PA$ khi $PO\ge R\sqrt2$, ngoài $A$ khi $PO<R\sqrt2$); trạm soạn đã ghi rõ ở Ghi chú, chấp nhận.

## Phân loại tiếp tuyến (cuối cùng — không đổi so với trạm soạn)

| Câu | tt |
|---|---|
| Bài 1a | khong_tt |
| Bài 1b | khong_tt |
| Bài 1c | khong_tt |
| Bài 1d | khong_tt |
| Bài 1e | khong_tt |
| Bài 1f | khong_tt |
| Bài 2 | khong_tt |
| Bài 3 | khong_tt |
| Bài 4 | khong_tt |
| Bài 5 | khong_tt |
| Bài 6 | khong_tt |
| Bài 7 | khong_tt |
| Bài 8 | khong_tt |
| Bài 9 | hai_tt |
| Bài 10 | hai_tt |
| Bài 11 | hai_tt |

Đếm: hai_tt 3 · ba_tt 0 · tt_khac 0 · khong_tt 13.

## Câu còn `Chưa chắc` (gửi CEO)

Không có.
