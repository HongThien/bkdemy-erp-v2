KẾT LUẬN: ĐẠT

# TX-GKI-2026 — phần 1 (Dạng 1 Bài 1–5) — biên bản soát (Opus, 24/10)

- Số câu: **11** (0 TN · 0 TLN · 11 tự luận) · khớp Pha 1 ngay từ đầu: **11/11** đáp số · phải sửa: **4 câu** (không đổi đáp số nào).
- Đề: đối chiếu `anh\t-1.png`, `t-2.png` + phóng to 260 dpi (`z\soat_p1_a…d`): 11/11 câu chép đúng (số mũ Bài 5: $y^{7-n}$, $x^n$, $3x^{n-1}y^{n+1}$, $2x^{n-1}y^7+6x^{n+1}y^8$, $\dfrac{1}{2}x^3y^n$ — khớp khung).
- Máy kiểm Pha 1: `<LV>\tam\soat_p1_kiem.mjs` (phân số BigInt, 8 bộ số ngẫu nhiên; Bài 5 vét $n=0..20$ với điều kiện số mũ không âm ở cả bị chia lẫn chia).
- Kiến thức: Chương I + II đầy đủ (TX) — 4c, 4d dùng HĐT lập phương / bình phương của hiệu: hợp phạm vi. Không dùng kiến thức cấm.
- Bài 5 hai chiều: điều kiện cần (so số mũ từng biến của từng hạng tử, số mũ không âm ⇒ 5b loại $n=0$, 5c điều kiện chia hết tự loại $n=0$) + điều kiện đủ (thử lại ra thương là đa thức) — đủ; quy ước "đơn thức chia hết đơn thức" (số mũ không âm) đúng.
- Phân loại: 11 câu `tu_luan` đúng (Bài 1, 2 nhiều ý; 3a, 3b chứng minh; 4 đa thức; 5 tập hợp).

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Dạng 1 Bài 4c | lập luận / kiến thức | Phần 2: bỏ "Chia hai vế cho $y-x$ ta được…", viết $=\left[-(x-y)^2\right](y-x)$ ⇒ "Do đó $N=-(x-y)^2$" | Chia hai vế cho $y-x$ là chia đa thức cho đa thức (KNTT 8 không có); đọc $N$ từ dạng tích là đủ |
| Dạng 1 Bài 4d | lập luận / kiến thức | Phần 2: bỏ "Chia hai vế cho $y^2-x^2$…", thay "Do đó $N=y^2-x^2$" | Như 4c |
| Dạng 1 Bài 5a | lời Phần 1 | Bước 2: "biến $y$ so hai số mũ đều chứa $n$" ⇒ "so số mũ chứa $n$ với số mũ $3$" | Sai sự thật: số mũ của $y$ ở đơn thức chia là $3$, không chứa $n$ |
| Dạng 1 Bài 5b | lời Phần 1 + lập luận | Bước 1: "từ đó thấy $n$ không thể nhận giá trị nào" ⇒ "cho một điều kiện chặn dưới đối với $n$"; Phần 2: "chia hết … khi" ⇒ "(đã thu gọn) … khi và chỉ khi" (cũng áp cho câu tương tự ở 5c) | Câu cũ đọc thành "không có $n$ nào"; Bài 5 cần cả chiều cần (mọi hạng tử phải chia hết — đúng vì các hạng tử không đồng dạng) |

Ghi chú người duyệt của trạm soạn: cập nhật dòng 4c/4d cho khớp lời giải mới.

Cổng: `dung-de-tu-soan.mjs … --chi-kiem` ⇒ ✔ đạt cổng (11 câu, chưa chắc 0).

**Đề sai:** không có. **Chưa chắc:** không có.
