KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-thinh-liet · lượt ĐẠI SỐ (trạm soát Opus, 13/11)

- **Số câu:** 49 (10 trả lời ngắn + 39 tự luận; 0 trắc nghiệm), 3 phần (Dạng 1 · Dạng 2 · Dạng 5).
- **Khớp Pha 1 (giải mù `CK-2425-thinh-liet.dai.kiem.md`, thử máy `<LV>/tam/soat_dai_mu.mjs`) ngay từ đầu:** 49/49 đáp số. Không đổi đáp số nào.
- **Số câu phải sửa:** 7 (14c, 14d, 17, 18, 19, 30, 31) — không lỗi chép đề, không lỗi đáp số, không lỗi kiến thức, không đổi phân loại.
- **Sót bài:** không (đủ Bài 1–19, 29–31; Bài 2 đề không in ý j). **Bài nhập nhầm / trùng lượt Hình:** không (Bài 20–28 chỉ có trong `.hinh.soan.md`).
- **Đề:** đã đối chiếu ảnh trang + phóng to 260 dpi (`z/soatd_b12|13|14.png`): dấu trừ ở 12a, 13a (bị dấu căn che một phần, chỉ có nét ngang); 14c căn chỉ bao $x^2$; 14d in $\sqrt{16x+6}$ — trạm soạn chép đúng.
- **Tệp:** không có ký tự điều khiển (TAB/FF…), không có `\notin` / `\neq` bị vỡ dòng (kiểm bằng `<LV>/tam/soat_ctrl.mjs`). Bản gốc trước sửa: `CK-2425-thinh-liet.dai.soan.goc.md`. Cổng `--chi-kiem`: ✔ đạt cổng (49 câu, chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 14c | định dạng (cờ) | Bỏ `Chưa chắc`; thêm "Lưu ý: giải theo đúng đề in…" đầu Phần 2; giữ `Ghi chú` nêu cách đọc khác ($x=1553$; $x=-1557$) | Đề in rõ (ảnh 260 dpi: căn chỉ bao $x^2$), giải được, đáp số chắc ⇒ luật đề sai 24/10: không treo cờ |
| Bài 14d | định dạng (cờ) | Như 14c (Ghi chú giữ cách đọc $\sqrt{16x+16}$ ⇒ $x=-1$) | Như trên |
| Bài 19 | định dạng (cờ) | Bỏ `Chưa chắc` ý d | Đề hỏi $x$ nguyên; máy quét $x\le10^5$: chỉ $x=9$ ($P=-2$), $x=121$ ($P=-3$) cho $P$ nguyên ⇒ $x=9$ duy nhất; "cách 2" của trạm soạn không phải cách hiểu hợp lí |
| Bài 17 | lập luận (Phần 1 lộ đáp số) | Bước 3 không còn nêu "$B-\dfrac12$" | Phần 1 không được lộ giá trị nhỏ nhất |
| Bài 18 | lập luận (Phần 1 lộ đáp số) | Mấu chốt + Bước 4 không còn nêu "$P-3$" | Như trên |
| Bài 30 | định dạng (câu chữ) | "Phương trình đã cho xảy ra khi…" ⇒ "Do đó phương trình đã cho chỉ đúng khi…" | Câu sai nghĩa |
| Bài 31 | định dạng | Dòng "Lưu ý:" chuyển lên đầu Phần 2, cuối bài thay bằng câu kết "Vậy …" | Khuôn đề sai: "Lưu ý:" đầu Phần 2 |
| GHI CHÚ CHO NGƯỜI DUYỆT | định dạng | Cập nhật dòng về cờ 14c/14d/19d | Khớp nội dung sau soát |

## Còn `Chưa chắc`

Không còn câu nào. Điều người duyệt nên xem (đã ghi `Ghi chú` trong câu, không treo cờ):
- **Bài 14c, 14d** — đề in có thể nhầm so với đề gốc (đáp số theo đề in: $x=\dfrac{1551}{5}$; vô nghiệm). Nếu CEO muốn sửa đề theo bản gốc dự đoán: 14c $\sqrt{x^2+4x+4}=1555$ ⇒ $x=1553$, $x=-1557$; 14d $\sqrt{16x+16}$ ⇒ $x=-1$.
- **Bài 3** — số liệu phi thực tế (AB = 20 km ⇒ $\dfrac{50}{9}$ km/h), đã ghi "đề sai" + Lưu ý. **Bài 31** — dấu "$>$" sai với tam giác đều, đã ghi đề sai. **Bài 2c, 2h** — hệ vô nghiệm theo đề in. **Bài 12a, 13a** — dấu giữa hai căn đọc là trừ.
