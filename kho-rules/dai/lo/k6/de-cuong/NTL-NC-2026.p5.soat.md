KẾT LUẬN: ĐẠT

# Biên bản soát — NTL-NC-2026 trạm 5 (Tiết 20: Số nguyên tố, hợp số — tiết 2; Bài 4–6 trên lớp + Bài 1–3 về nhà)

- Trạm soát: Opus, 24/10. Pha 1 giải mù từ ảnh `anh\t-02.png` (phóng to `z\p5-t20-02.png`) ⇒ `NTL-NC-2026.p5.kiem.md`. Bản gốc: `NTL-NC-2026.p5.soan.goc.md`.
- **Số câu: 10** (0 TN · 6 trả lời ngắn · 4 tự luận) · **khớp đáp án Pha 1 ngay từ đầu: 10/10** · **phải sửa: 9 câu** (không câu nào sai đáp số; chi tiết dưới bảng).
- Đề: chép đúng ảnh cả 10 câu. Phân loại đúng (Bài 4a, 4b, 5, VN Bài 2 có đáp số là cặp số / tập ⇒ `tu_luan`; Bài 6, VN 1a–d, VN 3 một số ⇒ `tra_loi_ngan`).
- Cổng `dung-de-tu-soan.mjs --khoi 6 --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| T20 Bài 4a | định dạng | `$2.\overline{53}=106$` ⇒ `$2.53=106$` | Gạch ngang trên chỉ dùng cho số có chữ số chưa biết; đã thay số thì viết số thường. |
| T20 Bài 4b | định dạng | `$\overline{13}.\overline{29}$` ⇒ `$13.29=377$ (hoặc $29.13=377$)` | Như trên. |
| T20 Bài 5 | lập luận (Phần 1) | Bước 2 bỏ "phân tích 50 ra thừa số nguyên tố" (Phần 2 không làm bước đó) ⇒ "viết tập Ư(50)" | Phần 1 phải khớp mạch Phần 2, không nêu bước không dùng. |
| T20 VN Bài 1a | kiến thức | Bỏ "ước của 32 có dạng $2^a$, $a\in\{0;\dots;5\}$" ⇒ liệt kê bằng chia lần lượt `$32=1.32=2.16=4.8$` rồi đếm; viết lại Phần 1 (4 bước) | Đếm ước qua "dạng $p^a.q^b$, số ước = tích (số mũ + 1)" không có trong lý thuyết bản đồ K6 (k6.md §1 luật 1–2; khuôn NNB00904 "Ước: chia lần lượt cho 1, 2, 3…") ⇒ không trích như quy tắc. |
| T20 VN Bài 1b | kiến thức | Như 1a: tính $5^2.7=175$, `$175=1.175=5.35=7.25$`, Ư(175) xếp tăng dần; bỏ dòng "số ước là $3.2=6$" | Như 1a; tập ước bản gốc chưa xếp thứ tự. |
| T20 VN Bài 1c | kiến thức | Giữ đáp số 16; bỏ "dạng $2^a.3^b.5^c$" + "số ước là $4.2.2$" ⇒ `$120=1.120=2.60=3.40=4.30=5.24=6.20=8.15=10.12$`; Phần 1 4 bước + Chú ý (không chia hết cho 7, 9) | Như 1a. |
| T20 VN Bài 1d | kiến thức | Như 1a: tính $2^2.5.13=260$, `$260=1.260=2.130=4.65=5.52=10.26=13.20$`, Ư(260) xếp tăng dần | Như 1a. |
| T20 VN Bài 2 | lập luận / kiến thức | Phần 1 Bước 3 bỏ "liệt kê ước theo số mũ" ⇒ chia lần lượt ghép cặp; Phần 2 thay dòng `$48=2^4.3$` bằng `$48=1.48=2.24=3.16=4.12=6.8$` | Cùng lí do 1a; dòng phân tích cũ không dẫn tới tập ước. |
| T20 VN Bài 3 | lập luận | Thêm lí do "$5p$ lẻ (tích hai số lẻ)"; gọn câu "chia hết cho 2 và lớn hơn 2" ⇒ `$5p+7\vdots 2$ mà $5p+7>2$ nên … hợp số` | Câu cũ lặp ý; thiếu lí do $5p$ lẻ. |

Tổng: 9 câu có chỉnh — kiến thức 5 (VN 1a–1d, VN 2) · định dạng 2 (4a, 4b) · lập luận/câu chữ 2 (Bài 5, VN 3). Không câu nào đổi đáp số.

Không sửa: Bài 4a/4b lập luận qua Ư(106), Ư(377) đúng; Bài 6 tự suy ra tổng $1+\dots+a$ bằng viết ngược + ghép cặp (đúng k6.md §1), so sánh $a.(a+1)$ với $40.41$ để loại nghiệm khác — đúng.

## Câu còn `Chưa chắc`

Không có.

## Ghi chú cho người điều phối (ngoài phạm vi trạm, không sửa)

- `NTL-NC-2026.p4.soan.md` T20 Bài 3b, 3c, 3d dùng đúng cách đếm ước "mỗi ước có dạng $3^a.5^b$ … số ước $5.3=15$" mà trạm này đã sửa. Trạm soát p4 nên xử lí cùng hướng (3b: $3^4.5^2=2025$ có 15 ước, liệt kê `$2025=1.2025=3.675=5.405=9.225=15.135=25.81=27.75=45.45$` — 8 cặp, cặp cuối trùng nên 15 ước). Nếu CEO muốn dạy công thức đếm ước cho phiếu nâng cao này thì cần thêm vào lý thuyết bản đồ trước — khi đó cả p4 và p5 viết lại theo công thức.
