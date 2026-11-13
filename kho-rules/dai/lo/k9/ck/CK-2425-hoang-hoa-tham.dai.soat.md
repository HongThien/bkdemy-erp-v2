KẾT LUẬN: ĐẠT

# Biên bản soát — CK-2425-hoang-hoa-tham · lượt Đại số (trạm soát Opus, 13/11/2026)

- **Số câu:** 57 (4 phần · 13 trả lời ngắn · 44 tự luận). Cổng `dung-de-tu-soan.mjs --chi-kiem`: ✔ đạt cổng.
- **Khớp Pha 1 ngay từ đầu (đáp số):** 57/57. Giải mù: `CK-2425-hoang-hoa-tham.dai.kiem.md`, thử máy `<LV>/tam/soat_mu.mjs` (không dòng sai).
- **Số câu phải sửa:** 5 (không câu nào sai đáp số). Bản gốc trước khi sửa: `CK-2425-hoang-hoa-tham.dai.soan.goc.md`.
- **Sót bài:** không. Đủ Bài 1–23, 34–38 (mọi ý). **Bài nhập nhầm / trùng lượt Hình:** không (Bài 24–33, 39, 40 nằm ở tệp Hình, tệp Đại không có).
- **Định dạng:** không có TAB / FF / kí tự điều khiển, không `\notin` / `\neq` / `\ne` vỡ xuống dòng, không dấu `$` lẻ, không `\times`, `\Leftrightarrow`, $\Delta$, Viète, "tập nghiệm S" (`<LV>/tam/soat_dinhdang.mjs`).

## Kiểm các chỗ trạm soạn SỬA CHỮ ĐỀ (đối chiếu ảnh 260 dpi `z/dai_p3b911.png`, `z/dai_p2b78.png`, `z/dai_p6b3638.png`)

| Chỗ sửa | Ảnh in | Kết luận |
|---|---|---|
| Bài 8: biểu thức thứ hai "$P=$" ⇒ "$Q=$" | in "$P=$" hai lần, ý 2 "Chứng minh $Q=…$", ý 3 "$A=P\cdot Q$" | lỗi in hiển nhiên — giữ sửa |
| Bài 10: thêm "$B=$" | biểu thức thứ hai không có tên, ý 2 "Chứng minh $B=…$" | lỗi in hiển nhiên — giữ sửa |
| Bài 11: biểu thức thứ hai "$A=$" ⇒ "$B=$" | in "$A=$" hai lần, ý 2 "$M=B:A$" | lỗi in hiển nhiên — giữ sửa |
| Bài 11: "$x\ne1$" ⇒ "$x\ne25$" | in "$x>0$, $x\ne1$" (chép từ Bài 10) | hiển nhiên: với điều kiện in thì $A$, $B$ không xác định tại $x=25$, và ý 1 ($\lvert x+1\rvert=2$, $x>0$) chỉ cho $x=1$ — bị chính điều kiện in loại. Giữ sửa, Ghi chú đã nói rõ |
| Bài 9: "số nuyên" ⇒ "số nguyên" | đúng ảnh | lỗi chính tả — giữ sửa |
| Bài 38: "$a,b,c$" ⇒ "$x,y,z$" | in "Cho $a,b,c$…" nhưng ba số viết theo $x,y,z$ | lỗi in hiển nhiên — giữ sửa |
| Bài 4d | ảnh phóng to `z/dai_4d.png`: $\dfrac6x-\dfrac{4x}{1-x}>\dfrac{x^2+31}{x^2-1}$ | chép đúng chữ in; tử $3x^3+10x^2-31x-6$ không có nghiệm hữu tỉ (máy: −5,2344; −0,1833; 2,0844) — giữ `Chưa chắc` |

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Bài 2.3 | phân loại | `tra_loi_ngan`, `dap_an=0,25` ⇒ `tu_luan`, `dap_an=—`; bỏ câu "nhập dạng thập phân" trong Ghi chú | đáp số đúng dạng đề hỏi là phân số $m=\dfrac14$ |
| Bài 4d | định dạng | thêm dòng "Lưu ý: …" đầu Phần 2; viết lại `Chưa chắc` (chữ in đã đối chiếu, lí do còn treo) | brief soạn mục 6: đề nghi sai ⇒ có "Lưu ý" đầu Phần 2 |
| Bài 35 | lập luận | thêm câu kết "Vậy tổng giá trị kinh tế còn lại khoảng $87666{,}7$ tỷ USD." | Phần 2 dừng ở dòng tính, thiếu kết luận bằng lời |
| Bài 36.2 | định dạng (Phần 1) | Bước 3 bỏ "$P-\dfrac{13}{2}$" | lộ đáp số cuối trong Phần 1 |
| Bài 37b | định dạng (Phần 1) | Mấu chốt + Bước 1 bỏ "$x=1$" (thay bằng "đoán giá trị làm hai căn cùng là số nguyên") | lộ đáp số cuối trong Phần 1 |

## Câu còn `Chưa chắc` (gửi CEO)

- **Bài 4d** — chữ in đúng ảnh, nhưng tử số bậc ba không nghiệm đẹp (nghi đề in sai) và cách giải (xét dấu bậc ba với nghiệm gần đúng bằng máy tính cầm tay) ngoài phạm vi lớp 9: CEO quyết giữ hay bỏ câu này.

## Ghi chú thêm (không sửa)

- Bài 1a ($\left(\tfrac{18}{11};\tfrac{23}{11}\right)$) và Bài 6j ($x=\dfrac{1008\sqrt5-107198}{58081}$) nghiệm xấu nhưng đúng theo đề in, đã thử máy.
- Bài 9 ý 3 hiểu $x$ nguyên dương ⇒ $x=1$; Bài 11 ý 3 đáp số "mọi $x>0$, $x\ne25$" — khớp giải mù.
