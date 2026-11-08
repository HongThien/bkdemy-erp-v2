KẾT LUẬN: ĐẠT

# DTK8-GKI-2026 — Phần 2 (Dạng 2. Tìm x: Bài 3a–3d, 4a–4f) — biên bản trạm soát (Opus, 24/10)

- Số câu: **10** (5 TLN: 3a `4,5` · 3b `3,4` · 4c `-1,7` · 4d `-4` · 4e `2`; 5 tự luận: 3c · 3d · 4a · 4b · 4f).
- Khớp Pha 1 ngay từ đầu: **10/10** (đáp số và loại câu). Máy: `<LV>\tam\kiem_soat_p2.mjs` (VT − VP bậc ≤ 2, phân số BigInt, kiểm điểm thứ tư; 4f kiểm nghiệm ±2026).
- Đề: 10/10 chép đúng ảnh `t-1.png` (đối chiếu bản phóng 260 dpi `<LV>\z\soat_p2_b34-1.png`; chữ rõ, không chỗ nào hai cách đọc).
- Phân loại: đúng luật — TLN chỉ khi một số ≤ 4 kí tự (kể cả thập phân hữu hạn ngắn 4,5 · 3,4 · −1,7); 3d $\dfrac{15}{8}=1{,}875$ (5 kí tự), 4a $\dfrac{13}{3}$, 4b $\dfrac{7}{15}$ ⇒ tu_luan; 4f hai giá trị ⇒ tu_luan; 3c không có $x$ ⇒ tu_luan.
- Phạm vi (chỉ Chương I, chưa HĐT): không câu nào dùng hằng đẳng thức, "phương trình", "tập nghiệm". 4f dùng đổi dấu + đặt thừa số chung (được) và "tích bằng 0 thì một thừa số bằng 0" — brief-soan mục 4 cho dùng, tiền lệ TC (chỉ Chương I) đã ghi; k8.md §1.2 ghi dự kiến "chỉ từ bài Phân tích nhân tử" ⇒ không coi là lỗi chắc, giữ (cách khác trong phạm vi: khai triển ra $x^2=2026^2$ rồi căn bậc hai lớp 7).
- Bài 3c "Đề sai": đúng luật 24/10 — có `**Ghi chú:** Đề sai: …`, một dòng `Lưu ý:` đầu Phần 2, không có `**Chưa chắc:**`; giải bình thường, kết luận không có $x$.
- Phải sửa: **3 câu** (không đổi đáp số nào).
- Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: ✔ đạt cổng.

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 3c | định dạng (ghi chú) | `**Ghi chú:** Đề sai: phương trình vô nghiệm (rút gọn ra 3=13)` ⇒ "Đề sai: thu gọn vế trái thì hạng tử chứa $x$ triệt tiêu, ra $3=13$ vô lí ⇒ không có $x$ thoả mãn (có lẽ in sai một hệ số, không đoán được bản đúng)" | Bỏ từ "phương trình / vô nghiệm" (ngoài phạm vi Chương I), công thức bọc `$…$` |
| Bài 4e | lập luận (Phần 1) | Bước 1–2: "nhân $-9x$ …" rồi "dấu trừ đổi dấu cả hai tích" (trùng, mâu thuẫn — nhân với $-9x$ thì đã gồm dấu) ⇒ Bước 1 nhân $3x$; Bước 2 nhân $9x$ rồi đổi dấu vì dấu trừ đứng trước | Bước vụn / tính dấu hai lần |
| Bài 4f | lập luận (Phần 2) | "Do đó $x-2026=0$ hoặc …" ⇒ "Vì tích bằng $0$ nên $x-2026=0$ hoặc …" | Khẳng định thiếu lí do |

## Câu còn Chưa chắc

Không.

## Câu "Đề sai"

- **Bài 3c** — $(5-2x)+2(x-1)=13$ (ảnh đọc rõ) thu gọn ra $3=13$ ⇒ không có $x$; các ý anh em đều ra một số ⇒ nghi in sai một hệ số, không đoán được bản đúng.
