KẾT LUẬN: ĐẠT

# NS-GKI-2026 — Phần 1 (A. Đại số · Bài 1a–h, Bài 2b–f) — biên bản trạm SOÁT (Opus, 13/10)

- **Số câu:** 13 (đều `tu_luan`, `kho=dai`).
- **Khớp lượt giải mù (Pha 1, `NS-GKI-2026.p1.kiem.md`) ngay từ đầu:** 13/13 đáp số. Máy kiểm `tam/mu_p1.mjs` (phân số chính xác BigInt): thay nghiệm vào ĐỀ GỐC,
  kiểm phép thu gọn 2d / 2e / 2f bằng 3000 bộ số ngẫu nhiên (0 lần lệch), quét lưới 1h (0 điểm thoả cả hai phương trình), thử 5 giá trị của nghiệm tổng quát 1c.
- **Đề:** đối chiếu ảnh `trang/p-1.png` + phóng to 260 dpi (`z/p1_b1.png`, `z/p1_b2.png`) — 13/13 chép đúng (hệ số, dấu, số thập phân $0{,}3$; $0{,}5$; $1{,}5$, phân số $\dfrac52$).
  Ý "e" của Bài 1 đề cương in nhãn "c)" lần hai — khung gõ `1e` là đúng. Ghi chú Bài 2a (in thiếu vế phải, không nhập) — xác nhận trên ảnh, giữ.
- **Số câu phải sửa:** 10 (không câu nào đổi đáp số): 9 câu chỉ sửa định dạng (tách dòng) · 1 câu (1c) sửa lập luận + định dạng. Ngoài ra bỏ 2 cờ `Chưa chắc` (2c, 2f).
- **Kiến thức:** soát từng câu — chỉ dùng cộng đại số / đặt ẩn phụ (Chương I); không `⇔`, không "tập nghiệm $S$", không định thức / tỉ số hệ số. 2b, 2c đủ điều kiện xác định → đặt ẩn phụ → trả ẩn → đối chiếu.
  1h (vô nghiệm): $0x+0y=20$, kết luận bằng lời đúng khuôn SGK. 1c (vô số nghiệm): đã sửa về khuôn SGK KNTT, có nghiệm tổng quát.
- **Phần 1:** 13/13 có 3–4 bước nghĩ thật, không lộ đáp số cuối (1c, 1h chỉ nói "nếu … thì …", không nêu kết luận).
- **Phân loại:** đúng — nghiệm là cặp số / vô nghiệm / vô số nghiệm ⇒ `tu_luan`, `dap_an=—`.
- **Hình:** không có.
- **Cổng:** `✔ đạt cổng` (sau sửa). Bản gốc trước sửa: `NS-GKI-2026.p1.soan.goc.md`.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 1c | lập luận | Phần 2: thay "hệ đã cho chỉ còn một phương trình độc lập, chẳng hạn $x-3y=-4$. Từ đó $x=3y-4$" bằng khuôn SGK: "Hệ thức này luôn thoả mãn với các giá trị tuỳ ý của $x$ và $y$" → "Với giá trị tuỳ ý của $y$, giá trị của $x$ được tính nhờ phương trình thứ nhất $-2x+6y=8$" → $2x=6y-8$ → $x=3y-4$. Phần 1 Bước 3 bỏ cụm "phương trình độc lập" | "Phương trình độc lập" không phải từ của lớp 9; $x-3y=-4$ xuất hiện không có phép biến đổi nào dẫn tới (nhảy bước) |
| Bài 1a, 1b, 1d, 1e, 1f, 2d | định dạng | Tách "Suy ra $2y=-6$, do đó $y=-3$" (và các dòng cùng kiểu) thành hai dòng | Mỗi phép biến đổi một dòng |
| Bài 1g | định dạng | Tách "Suy ra $10+5y=15$, do đó $5y=5$ và $y=1$" thành ba dòng | Ba phép biến đổi dồn một dòng |
| Bài 2e | định dạng | Tách "Suy ra $-2x+8y=16$, chia hai vế cho $2$ ta được $-x+4y=8$" thành hai dòng | Như trên |
| Bài 2c | định dạng | "Thay $u$ vào $u+v=\dfrac52$, ta được $v=\dfrac52+\dfrac{11}{8}$" → ghi dòng thay số $-\dfrac{11}{8}+v=\dfrac52$ rồi mới "Suy ra $v=…$" | Dòng "ta được" phải là kết quả của phép thế, không phải của phép chuyển vế |
| Bài 2c | chưa chắc (xoá) | Xoá dòng `Chưa chắc` "nghiệm ra phân số xấu" của trạm soạn | Đã phóng to: hệ số $7$; $3$; $2$ / $1$; $1$; $\dfrac52$ in rõ, không nét mờ. Giải mù ra đúng $\left(-\dfrac{30}{11};\dfrac{8}{31}\right)$, thoả đề với phân số chính xác; hệ theo $u,v$ bậc nhất nên nghiệm duy nhất. Nghiệm phân số không phải dấu hiệu in sai |
| Bài 2f | chưa chắc (xoá) | Xoá dòng `Chưa chắc` "nghiệm ra phân số" của trạm soạn | Đã phóng to: các số in rõ. Giải mù ra đúng $\left(\dfrac{37}{5};\dfrac{31}{5}\right)$, thoả cả hai phương trình gốc |

Mục `## GHI CHÚ CHO NGƯỜI DUYỆT` cuối tệp soạn đã cập nhật dòng về 2c, 2f cho khớp.

**Câu còn `Chưa chắc`:** không có.

**Ghi nhận (không phải cờ):** Bài 2c ra nghiệm mẫu $11$ và $31$ — xấu hơn hẳn các ý anh em, nhưng trên ảnh không có gì cho thấy in sai. Máy thử đổi MỘT hệ số (`tam/mu_p1_2c.mjs`, mọi giá trị bội của $0{,}5$ trong $[-12;12]$): chỉ ra nghiệm đẹp với các
phép đổi không giống lỗi in ($7\to-8$, $2\to9{,}5$, $1\to6$, $1\to-4$, $1\to11{,}5$, $\dfrac52\to0$…) ⇒ không có bản sửa "hiển nhiên" nào, giữ nguyên đề.
Bài 2a chưa nhập (đề cương in thiếu vế phải) — chờ bổ sung đề.
