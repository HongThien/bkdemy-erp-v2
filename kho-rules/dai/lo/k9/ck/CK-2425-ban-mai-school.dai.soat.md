KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-ban-mai-school · lượt Đại số (trạm soát Opus, 13/11)

- **Số câu:** 100 (4 phần · 23 trả lời ngắn + 77 tự luận) · Bài 1–68, đề cương không in Bài 54.
- **Khớp Pha 1 ngay từ đầu:** 100/100 đáp số (giải mù: `CK-2425-ban-mai-school.dai.kiem.md`; máy: `<LV>\tam\soat_dai.mjs` — thay nghiệm, rút gọn thử 5 giá trị, BPT hai phía mốc, quét cực trị / giá trị nguyên).
- **Số câu phải sửa:** 10 (không đổi đáp số nào) + dòng đầu tệp `bo_sach`.
- **Sót bài:** không (Pha 0 đã mở p-01…p-09, p-12; p-10, p-11 là Bài 73–82). **Bài nhập nhầm / trùng lượt Hình:** không — Bài 69–89 nằm trong `.hinh.soan.md`, tệp Đại không chứa bài nào trong đó.
- Bản gốc trước khi sửa: `CK-2425-ban-mai-school.dai.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.

## Chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| (đầu tệp) | định dạng | `bo_sach: KNTT` ⇒ `bo_sach: Cánh Diều`; sửa dòng tương ứng ở Ghi chú cho người duyệt | Trang 1 đề cương ghi "Sách giáo khoa, sách bài tập Toán học 9 – bộ Cánh diều" |
| Bài 1d | định dạng (xử lí đề sai) | Bỏ `Chưa chắc`; Ghi chú ghi rõ "đề sai" + hai cách sửa khả dĩ; thêm dòng "Lưu ý:" đầu Phần 2 | Phóng to 260 dpi: in đúng $12x-8$. Không phải lỗi in hiển nhiên (hai cách sửa cho đáp số khác nhau) ⇒ theo brief mục 6: giải theo chữ in, không treo Chưa chắc |
| Bài 41.2 · 41.4 · 41.5 · 43 · 47 | lập luận (trình bày) | Dòng chia hai vế cho số âm ghi rõ "Chia hai vế cho $-k<0$ (đổi chiều), ta được …" | k9.md §2 khuôn BPT: phải ghi chia cho số âm nên đổi chiều |
| Bài 52 | định dạng (Chưa chắc) | Bỏ `Chưa chắc`; Ghi chú nói rõ lỗi in hiển nhiên, lí do | Phóng to: in $3+\sqrt{x}$. Mẫu $x-5\sqrt{x}+6=(\sqrt{x}-2)(\sqrt{x}-3)$ đòi $\sqrt{x}-3$; với chữ in, $M=\dfrac{-3x+2\sqrt{x}+3}{x-9}$ (đã thử máy) làm ý b, c, e vô nghĩa ⇒ sửa $3-\sqrt{x}$ là chắc chắn |
| Bài 57 | định dạng (xử lí đề sai) | Bỏ `Chưa chắc`; Ghi chú "Ý d đề sai" + dạng đúng có nghiệm $x=5$; thêm "Lưu ý:" đầu Phần 2 | Ý d giải được theo chữ in (vô nghiệm, chứng minh đúng — máy quét $x\in[4;200]$: $\min|VT-VP|\approx4{,}05$) ⇒ brief mục 6: không treo Chưa chắc |
| Bài 66.2 | định dạng (xử lí đề sai) | Thêm "Lưu ý:" đầu Phần 2 | Ý b vô nghiệm theo chữ in, Ghi chú đã có; thiếu dòng Lưu ý theo brief mục 6 |

Đã soát, không sửa: đề 100 câu khớp ảnh (số, mũ, căn, dấu, đủ ý) · lời giải đúng toán từng dòng · không $\Delta$ / Viète / Cô-si / `⇔` / tập nghiệm $S$ / kí hiệu khoảng (Bài 11, 22, 24, 36, 40 bậc hai đều phân tích nhân tử hoặc hoàn thành bình phương; GTNN/GTLN Bài 55, 56, 60, 64, 68 đánh giá trực tiếp hoặc bình phương) · dấu nhân `\cdot` · phân loại đúng luật (TLN chỉ khi một số ≤ 4 kí tự) · tách ý đúng (Bài 1–3, 41, 50, 51 tách; bài có ý sau dùng ý trước giữ một câu; Bài 66 tách hai bài toán 66.1, 66.2). Bài 59c (không có $x$ vì $x=4$ bị loại) là đáp số hợp lệ, không phải đề sai.

## Còn `Chưa chắc` (gửi CEO)

- **Bài 53 ý e** — đề in "Tìm $x$ để $Q$ nguyên" (không nói $x$ nguyên). Hiểu $x$ nguyên ⇒ $x\in\{0;4;9\}$ (lời giải theo cách này, giống 52e, 55d); hiểu $x$ thực ⇒ vô số giá trị $x=\left(\dfrac{k+1}{k-1}\right)^2$, $k$ nguyên, $k\ge2$ hoặc $k\le-1$. Hai cách hiểu cho hai đáp số khác nhau.
