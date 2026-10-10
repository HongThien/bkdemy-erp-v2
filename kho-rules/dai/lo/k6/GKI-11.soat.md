KẾT LUẬN: ĐẠT

# GKI-11 — biên bản soát (trạm soát, 10/10)

Đề: THCS Bát Tràng (xã Bát Tràng, Hà Nội) — kiểm tra giữa kì I 2025–2026, Toán 6, đề số 1. Nguồn soát: ảnh `trang/p-1.png`, `p-2.png`.
Bản giải mù: `GKI-11.kiem.md` (ghi xong trước khi mở bản soạn). Bản soạn gốc trước khi sửa: `GKI-11.soan.goc.md`.

- **Số câu:** 22 (12 trắc nghiệm · 7 trả lời ngắn · 3 tự luận; 5 câu kho hình; 1 hình).
- **Khớp đáp án Pha 1 ngay từ đầu:** 22 / 22 (12 chữ cái TN + 10 đáp số / lập luận tự luận). Không có câu nào lệch đáp số.
- **Số câu phải sửa:** 4 / 22 (không câu nào sai toán, không câu nào sai đáp án, không câu nào chép sai đề).
- **Cổng:** `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng.
- **Đề:** đủ 12 câu TN + 6 bài tự luận (Bài 1 tách 4 ý, Bài 2 tách 2 ý — đúng luật tách), không có phần tiếng Anh, không bỏ câu nào.
- **Hình:** `img/p1c9_1.png` đúng hình vuông $ABCD$ của Câu 9, đủ 4 đỉnh, dấu cạnh bằng nhau và dấu góc vuông, không cụt, không dính chữ.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Câu 8 | lập luận (diễn đạt) | Mấu chốt: "ước của 12 là số tự nhiên chia hết 12" ⇒ "…là số tự nhiên mà 12 chia hết cho số đó" | "chia hết 12" không phải cách nói của SGK lớp 6, đọc dễ hiểu ngược (số đó chia hết **cho** 12 = bội) |
| Câu 11 | định dạng + lập luận | Xoá dòng `Chưa chắc`, đổi thành `Ghi chú` (A cũng đúng theo nghĩa rộng; đề yêu cầu chọn phương án **đúng nhất** ⇒ B). Phần 2: thêm ý loại phương án A ("2 cạnh bằng nhau" chưa nêu đủ) | Lời dẫn phần I của đề ghi rõ "chọn phương án trả lời đúng nhất" ⇒ đáp án B chắc chắn, không còn là điều chưa chắc. Lời giải gốc loại C, D mà không nói gì về A |
| Bài 1b | định dạng | `Ghi chú`: xoá câu "Bản máy gõ nhầm dấu nhân thành dấu trừ; ảnh trang ghi…" (giữ phần lí do để tự luận) | `Ghi chú` chỉ dành cho lỗi của đề gốc / điều người duyệt cần biết; lỗi công cụ không ghi vào câu |
| Bài 5 | phân loại | Thêm dòng `Chưa chắc` (đơn vị đáp số) — chưa đổi `loai` | Đề hỏi "trả lại bao nhiêu tiền" không nói đơn vị: 21 (nghìn đồng) vừa 4 ô, 21000 (đồng) không vừa ⇒ trả lời ngắn có hai cách điền; để CEO quyết |
| Mục cuối tệp | định dạng | Xoá dòng "Bản máy gõ (`de.json`) sai ở Bài 1b…"; cập nhật dòng Câu 11, thêm dòng Bài 5 | cùng lí do Bài 1b; đồng bộ với các câu đã sửa |

## Dòng `Chưa chắc` của trạm soạn đã xoá

- **Câu 11** — trạm soạn ghi "phương án A cũng đúng theo nghĩa rộng". Đã kiểm: lời dẫn phần trắc nghiệm của đề là "Hãy chọn phương án trả lời **đúng nhất**"
  ⇒ B ("3 cạnh bằng nhau") là đáp án chắc chắn. Chuyển nội dung sang `Ghi chú` để người duyệt vẫn biết.

## Đã soát, không sửa

- **Bài 4** — đề in "chiều dài $8\ m$, chiều rộng $15\ m$" (dài < rộng). Bản soạn giữ nguyên số của đề và đã có `Ghi chú`; đáp số ($120\ m^2$, $2500\ cm^2$, 480 viên)
  không phụ thuộc cách gọi tên. Kiểm chéo ý c bằng cách xếp: $800:50=16$, $1500:50=30$, $16.30=480$ (xếp vừa khít nên chia diện tích là hợp lệ).
- **Bài 6** — đếm số hạng đúng ($2025$ số hạng, $675$ nhóm 3), nhóm cuối $(5^{2023}+5^{2024}+5^{2025})$ đúng; máy: $A \bmod 31 = 0$.
- **Bài 3** — đúng khuôn nhóm "Thực tế ƯC / ƯCLN"; $252=2^2.3^2.7$, $140=2^2.5.7$, $\text{ƯCLN}=28$ (máy xác nhận).
- Kiến thức: không có chuyển vế, không dùng dấu hiệu chia hết cho 4 / 6 / 8 (Câu 7 chia có dư), dấu nhân toàn dấu chấm.

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 5** — đề không nói đơn vị của đáp số: học sinh có thể điền 21 (nghìn đồng) hoặc 21000 (đồng, 5 chữ số, không vừa 4 ô). Đang để `tra_loi_ngan`, đáp án 21.
  Cần quyết: giữ trả lời ngắn (đáp án 21) hay chuyển tự luận (chỉ in).

## Lỗi công cụ (không ghi vào câu)

- Trạm soạn báo `de.json` (bản máy gõ) sai ở Bài 1b: dấu nhân bị gõ thành dấu trừ. Bản soạn đã chép đúng theo ảnh ($120.33+120.67$).
