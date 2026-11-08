KẾT LUẬN: ĐẠT

# NTL-GKI-2026 — phần 22 (Đề số 04: Trắc nghiệm Câu 1–6 + Tự luận Bài 1a–1c) — biên bản trạm SOÁT (Opus, 27/10)

- Số câu: **9** (6 trắc nghiệm · 1 trả lời ngắn · 2 tự luận).
- Khớp Pha 1 (giải mù, `NTL-GKI-2026.p22.kiem.md`) ngay từ đầu: **9/9** — đáp án TN C1 C · C2 B · C3 C · C4 C · C5 C · C6 A; $A=3x^2-x-20$; $A(3)=4$; $B=-3$.
- Đề chép đúng ảnh `t-14.png`, `t-15.png` (số, dấu, phương án) — 0 lỗi chép đề.
- Câu phải sửa: **5/9** — **0 câu sửa vì lỗi toán ở đáp số**; 1 câu sửa lập luận Phần 2 (Câu 4, phương án D thiếu chứng cứ); 2 câu sửa lời Phần 1 sai sự thật nhỏ (Câu 2, Câu 3); 2 câu chỉ sửa trình bày (Câu 5, Câu 6).
- Bản gốc trước khi sửa: `NTL-GKI-2026.p22.soan.goc.md`. Cổng chạy lại sau sửa: **✔ đạt cổng**.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 4 Câu 2 | lập luận (Phần 1 — lỗi toán trong lời hướng dẫn, đáp án không đổi) | Bước 4: "phương án A chưa phân tích hết (còn hệ số chung 3)" → "phương án A có thừa số $3x-6$ đã mất biến $y$ nên không bằng đa thức đề cho" | $(x-y)(3x-6)\ne 3x(x-y)-6y(y-x)$ — A là kết quả SAI chứ không phải "chưa phân tích hết" (máy: chỉ B trùng đa thức) |
| Đề 4 Câu 3 | lập luận (Phần 1 — lời Chú ý sai chi tiết, đáp án không đổi) | "D sai dấu của nghiệm thứ hai" → "D sai dấu ở giá trị phân số"; "nghiệm" → "giá trị" | Ở D, giá trị sai dấu là $-\tfrac15$ (đứng thứ nhất), không phải thứ hai; tránh từ "nghiệm" (đề cương chưa học phương trình) |
| Đề 4 Câu 4 | lập luận + định dạng (sửa toán ở lí do loại D; phần còn lại chỉ trình bày) | Phần 2 viết lại: **D** — thay câu khẳng định suông "tồn tại tứ giác có $MQ=MP=NP$ mà $MN\ne PQ$" bằng phản ví dụ dựng được: $\triangle MNP$ đều + $\triangle MPQ$ vuông cân tại $M$ ở hai phía $MP$ ⇒ $NP=MP=MQ$ nhưng $MN=MP<PQ$ (đường vuông góc – đường xiên) ⇒ không là hình bình hành. **A** — bỏ chữ "hình chiếc diều" (không có trong whitelist), cho số cụ thể $NM=NP=2$, $QM=QP=3$, khối "Xét … có:" mỗi điều kiện một dòng, (c.c.c), (hai góc tương ứng). **B** — "hình thang cân" → "hình thang" (đủ dùng), thêm (tính chất hình bình hành). Tách dòng dài; bỏ dòng trống giữa các bước | Lí do loại D trước đó không kiểm được (học sinh không biết vì sao tồn tại); phản ví dụ mới đã kiểm toạ độ: $NP=MP=MQ=2$, $MN=2$, $PQ=2\sqrt2$, tứ giác lồi (`kiem_soat_p22.mjs`). Luật trình bày Hình 7·8·9 |
| Đề 4 Câu 5 | định dạng (chỉ trình bày) | Bỏ dòng trống giữa các bước (xuống dòng đơn); tách dòng "nên hai đường chéo … (tính chất hình bình hành)" thành 3 dòng; thêm (định nghĩa trung điểm) cho $AC=2AO$; tách dòng thử lại | Luật trình bày Hình 7·8·9: dòng ≲ 50%, \n đơn, mọi khẳng định có chú thích |
| Đề 4 Câu 6 | định dạng (chỉ trình bày) | Bỏ dòng trống giữa các bước; tách lí do xuống dòng riêng; lí do góc đối ghi "(tính chất hình bình hành: các góc đối bằng nhau)" | Như trên |

Không sửa: Câu 1 (lập phương của một hiệu — NTL học đủ hằng đẳng thức), Bài 1a, 1b, 1c (khai triển trực tiếp, đáp số khớp máy). Phần 1 các câu Hình giữ khuôn card `**Bước k.**` cách một dòng trống (cổng cần), chỉ Phần 2 xuống dòng đơn.

**Tóm tắt (b) theo yêu cầu:** sửa vì **lỗi toán**: Câu 2 (lời Phần 1 nói sai bản chất phương án A), Câu 3 (lời Chú ý chỉ sai vị trí giá trị), Câu 4 (lí do loại phương án D không có chứng cứ → thay bằng phản ví dụ đã kiểm). **Chỉ sửa trình bày**: Câu 5, Câu 6 (và phần A, B, C của Câu 4). Không đáp án nào đổi.

**Kiểm trắc nghiệm (luật mục 3 brief-bo-sung-4):** `dap_an` một chữ cái · 4 dòng A–D · Phần 1 3–6 bước · Phần 2 loại dần bằng lí do, kết "Chọn …" — đạt cả 6 câu. Mỗi câu có đúng một phương án đúng (máy) ⇒ không có câu đề in lỗi.

## Câu còn `Chưa chắc` / "Đề sai"

Không có.
