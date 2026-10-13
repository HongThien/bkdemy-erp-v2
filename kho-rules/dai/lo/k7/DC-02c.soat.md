KẾT LUẬN: ĐẠT

# DC-02c — biên bản SOÁT (Opus, 13/10)

Nguồn: đề cương ôn tập giữa HKI Toán 7 — THCS Tây Mỗ (PDF scan CamScanner, 10 trang). Phần của tệp c = Dạng 3 Bài toán thực tế (Bài 7–12, cuối tr.7 – đầu tr.8)
và Hình học Bài 1–7 (bảng, tr.8–9). Pha 1 giải mù: `DC-02c.kiem.md`. Bản gốc trước khi sửa: `DC-02c.soan.goc.md`.

- Số câu: **13** (6 Đại `tu_luan` + 7 Hình `kho=hinh_hoc`, `tu_luan`).
- Khớp đáp án Pha 1 ngay từ đầu: **13/13** (kể cả Hình Bài 7: hai bên cùng kết luận số in KHÔNG chứng minh được $b\parallel c$ — góc so le trong ở $N$ ra $45^\circ\ne50^\circ$).
- Số câu phải sửa: **1** (Hình Bài 4).
- Hình `c_h1…c_h7.png`: đúng hình từng câu, không cụt, không dính chữ câu khác (chỉ có bóng chữ in xuyên mặt sau trang scan, `c_h6` có chữ "Hình 9" là chú thích gốc của hình). Mọi số đo trên hình đã có trong phần Đề.
- Kiểm nhất quán số đo (đọc 400 dpi + dựng toạ độ trên ảnh): Bài 1 ($35+55=90$, hình ≈90°) · Bài 2 ($53+127=180$; $73=73$; hình không theo tỉ lệ nhưng số tự nhất quán) ·
  Bài 3 ($B$, $A$, $E$ thẳng hàng trên hình) · Bài 4 ($123+57=180$) · Bài 5 (hình ≈75,6° / 61,6°) · Bài 6 ($62+50=112$, hình khớp) — đều nhất quán.
  **Bài 7 in lỗi thật**: $145^\circ$, $145^\circ$, $80^\circ$, $50^\circ$ chỉ cho $a\parallel b$; muốn $b\parallel c$ cần $\widehat{MNP}=85^\circ$ (hoặc góc ở $P$ là $45^\circ$, hoặc hai góc $145^\circ$ là $150^\circ$). Không sửa số đo.
- Kiến thức: chỉ dùng kề bù, đối đỉnh, phân giác, so le trong / đồng vị / trong cùng phía, hai đường thẳng cùng song song đường thứ ba, vuông góc với một trong hai đường song song, góc bẹt — trong whitelist; không dùng tổng ba góc tam giác.
- Cổng: `dung-de-tu-soan.mjs … --khoi 7 --chi-kiem` ⇒ **✔ đạt cổng** (không có `--khoi 7` thì cổng mặc định khối 6 báo `kho=hinh_hoc` sai — đúng lệnh là có `--khoi 7`).

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Hình Bài 4 | chép đề | Đề và Phần 2 ý d): $\widehat{aDC}=90^\circ$ → $\widehat{ADC}=90^\circ$; viết lại `Ghi chú` (đề gốc in $aDc$, đường $c$ không qua $D$, hình có kí hiệu góc vuông giữa $DA$ và $DC$) | "$\widehat{aDC}$" trộn tên đường thẳng với tên điểm; $A$ nằm trên $a$ bên trái $D$ nên viết bằng điểm cho rõ, cùng một góc |
| Hình Bài 4 | (xoá `Chưa chắc`) | Bỏ dòng `Chưa chắc` về "$\widehat{aAc}$ là góc nào" | Đã kiểm chắc: chỉ hai góc tù ở $A$ có thể bằng $123^\circ$, và hai góc đó đối đỉnh nhau, nên $\widehat{BAD}=123^\circ$ với mọi cách hiểu; cách hiểu trong đề (tia về phía nhãn $a$ và tia về phía nhãn $c$) khớp hình |
| GHI CHÚ CHO NGƯỜI DUYỆT | — | Rút danh sách "CẦN CEO XEM" còn Bài 7 Hình; ghi lí do bỏ Bài 4, Bài 3 | Bài 3: $B$, $A$, $E$ thẳng hàng đã kiểm toạ độ trên hình 400 dpi |

Không sửa: 6 bài Dạng 3 (đề, đáp số, lời giải đúng; Bài 9b có cả ước lượng $3,6$ kg lẫn số đúng $3,22$ kg — giữ) · Hình Bài 1, 2, 3, 5, 6, 7.

## Câu còn `Chưa chắc` (gửi CEO)

- **Hình Bài 7** — số đo in trên hình ($145^\circ$, $145^\circ$, $80^\circ$, $50^\circ$) mâu thuẫn với yêu cầu chứng minh $a\parallel b\parallel c$: chỉ chứng minh được $a\parallel b$, còn $b$ KHÔNG song song $c$ ($45^\circ\ne50^\circ$). Lời giải hiện trình bày phần chứng minh được và chỉ rõ chỗ vênh. CEO chốt số đúng (đề xuất $80^\circ\to85^\circ$) rồi soạn lại Phần 2 cho trọn, hoặc bỏ câu.

## ẢNH CHO CEO

| Câu | Ảnh (tên tệp) | Trang trong PDF gốc (đề cương Tây Mỗ) | Vấn đề |
|---|---|---|---|
| Hình Bài 7 | `can-xem/DC-02_HH-Bai7.png` | PDF tr.9 (in 29) | Số đo in sai: với $145^\circ,145^\circ,80^\circ,50^\circ$ không chứng minh được $b\parallel c$ — CEO sửa một số (vd $80^\circ\to85^\circ$) hoặc bỏ câu. |
| Hình Bài 4 | `can-xem/DC-02_HH-Bai4.png` | PDF tr.9 (in 29) | Đề in "$aDc=90^0$" ($c$ không qua $D$) — đã sửa thành $\widehat{ADC}=90^\circ$ theo kí hiệu góc vuông trên hình, CEO chỉ cần gật. |
| Dạng 3 Bài 8 | `can-xem/DC-02_D3-Bai8.png` | PDF tr.7 (in 27) | Đề thiếu dấu "?" cuối câu — đã thêm, CEO chỉ cần gật. |
