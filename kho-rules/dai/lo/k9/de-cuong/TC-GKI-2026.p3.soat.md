KẾT LUẬN: ĐẠT

# TC-GKI-2026 · P3 — Biên bản trạm SOÁT (Opus, 29/10)

Phạm vi: A Bài 3a–3r (18 phương trình chứa ẩn ở mẫu) + A Bài 4a–4d (hàm số bậc nhất lớp 8).
Pha 1 giải mù: `TC-GKI-2026.p3.kiem.md`; thử máy `<LV>\tam\soat_p3.mjs` (thay nghiệm vào đề + quét lưới $[-100;100]$ tìm nghiệm sót; 3n thử 4000 điểm ngẫu nhiên; 4d quét $m$). Bản gốc trước khi sửa: `TC-GKI-2026.p3.soan.goc.md`.

- Số câu: **22** (10 trả lời ngắn + 12 tự luận).
- Khớp Pha 1 ngay từ đầu: **22/22** đáp số.
- Số câu phải sửa: **3** (3j, 3n, 4d) + 1 câu thêm ghi chú chép đề (4c). Không đổi đáp số, không đổi phân loại.
- Đề: đối chiếu ảnh 260 dpi (`z/p3a.png`, `p3b.png`, `p3c.png`) — 22/22 chép đúng (số, mũ, dấu, mẫu). Thứ tự 1)–18) ⇒ 3a–3r đúng.
- Luật kiến thức: không Δ / Viète, không `⇔`, không "tập nghiệm S"; nhân tử $x^2\pm x+1$ chứng minh dương bằng hoàn thành bình phương (3q, 3r); đủ ĐKXĐ + đối chiếu ở cả 18 phương trình.
- Phân loại `tra_loi_ngan` (10 câu) kiểm lại — đều đúng một số ≤ 4 kí tự theo đúng câu hỏi: 3c `-4` · 3d `-20` · 3h `-7` · 3i `-1` · 3k `0,25` · 3m `0,5` · 3o `0` · 3q `0,2` · 3r `0,5` · 4d `2`. Nghiệm phân số vô hạn ($\dfrac{10}{3}$, $-\dfrac13$, $\dfrac{47}{7}$, $\dfrac13$), hai nghiệm (3p), vô nghiệm (3f, 3g, 3j), vô số nghiệm (3n), cặp $a,b$ / phương trình đường thẳng / toạ độ (4a–4c) ⇒ `tu_luan` đúng.
- Cổng `--chi-kiem`: ✔ đạt cổng (22 câu · 10 TLN · 12 tự luận · chưa chắc 0).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| 3j | định dạng | Chèn dòng $x^2=1$ giữa $2x^2=2$ và $x^2-1=0$ | Mỗi phép biến đổi một dòng (chia 2 và chuyển vế bị gộp) |
| 3n | lập luận / cờ thừa | Xoá dòng `Chưa chắc`; dòng $0=0$ ⇒ $0x=0$ "đúng với mọi $x$"; Ghi chú cho người duyệt viết lại | Pha 1 giải mù + máy xác nhận vế trái đồng nhất bằng 0 ⇒ nghiệm đúng với mọi $x\ne\pm1$; đề in đúng ảnh, không phải đề sai (quy tắc 24/10: không treo cờ) |
| 4c | chép đề (ghi chú) | Thêm `**Ghi chú:**` đề cương in lặp "giao điểm giao điểm", đã bỏ một chữ | Đề trong tệp lệch ảnh nhưng không có ghi chú |
| 4d | đề sai / cờ thừa | Xoá `Chưa chắc`; thêm `**Ghi chú:**` "đề sai một chỗ — $m=2$ làm $d_3$ trùng $d_2$, ba đường thẳng chỉ còn hai"; thêm dòng "Lưu ý: …" đầu Phần 2; thêm dòng kiểm $d_3$ khi $m=2$ và kết luận "Vậy $m=2$ (khi đó $d_3$ trùng với $d_2$)"; Bước 4 Phần 1 thêm việc thay $m$ vào $d_3$ để kiểm trùng (không lộ đáp số) | Quy tắc Thùy 24/10: đề sai nhưng giải được ⇒ giải bình thường, ghi rõ; quét $m$ bằng máy chỉ có $m=2$ |

## Câu còn `Chưa chắc` (gửi CEO)

Không.
