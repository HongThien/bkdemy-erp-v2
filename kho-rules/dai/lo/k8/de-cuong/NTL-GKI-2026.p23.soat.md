KẾT LUẬN: ĐẠT

# Biên bản soát — NTL-GKI-2026 phần 23 (Đề số 04, B. Tự luận Bài 2–5)

- **Số câu:** 8 (1 trả lời ngắn: Bài 3a = $-11$ · 7 tự luận; Đại 7 · Hình 1).
- **Khớp Pha 1 ngay từ đầu:** 8/8 đáp số / kết luận (Pha 1: `NTL-GKI-2026.p23.kiem.md`; máy `<LV>\tam\soat_p23_kiem.mjs`).
- **Đề chép:** 8/8 đúng ảnh `t-15.png` (đã phóng to 260 dpi Bài 2–3 và Bài 5).
- **Câu phải sửa:** 2 (Đề 4 Bài 4, Đề 4 Bài 5) — **KHÔNG câu nào sửa vì lỗi toán** (không đổi đáp số, không có bước sai); cả hai chỉ sửa **trình bày** (định dạng / thiếu chú thích lí do / một bước lập luận viết thiếu chữ) và **hình**.
- Bản trước khi sửa: `NTL-GKI-2026.p23.soan.goc.md`. Cổng `dung-de-tu-soan.mjs --khoi 8 --chi-kiem`: **✔ đạt cổng**.

## Lỗi toán vs lỗi trình bày

| Câu | Lỗi toán? | Ghi rõ |
|---|---|---|
| Đề 4 Bài 2a, 2b, 2c, 3a, 3b, 3c | Không | Không sửa gì |
| Đề 4 Bài 4 | **Không** — chứng minh a–d đúng, đúng phạm vi NTL (chỉ hình bình hành + tam giác bằng nhau; không đường trung bình, không hình chữ nhật / trung tuyến ứng cạnh huyền; ý d tự chứng minh "trung điểm $H$ của $BE$ nằm trên $MN$" qua hai HBH $ANLE$, $ELBN$ — đúng mọi vị trí $E$ trên đường thẳng $AD$, máy kiểm 6 HBH ngẫu nhiên) | Chỉ sửa **trình bày** (luật Hình 7·8·9) + **hình giải** |
| Đề 4 Bài 5 | **Không** — đáp số $(0;0),(1;1),(-1;-1)$ đúng, chứng minh đúng với MỌI số nguyên | Chỉ thêm một dòng nêu lí do chia trường hợp (trình bày) |

## Bảng chỗ đã sửa

| Câu | Loại lỗi | Sửa gì | Vì sao |
|---|---|---|---|
| Đề 4 Bài 4 | định dạng | Phần 2: bỏ HẾT dòng trống giữa các bước (trạm soạn chèn một dòng trống sau mỗi khẳng định); chỉ còn dòng trống trước `b)` `c)` `d)` và trước `**Phần 2. Trình bày**` | Luật Hình 7·8·9 điều 2: giãn dòng +20% là việc hiển thị của app, dữ liệu nối `\n` đơn |
| Đề 4 Bài 4 | định dạng | Tách dòng dài: "hai đường chéo $AC$ và $MN$ / cắt nhau tại trung điểm mỗi đường", tương tự cho $NM$, $IK$; "nên $BE\perp MN$ / (lí do)"; "Qua $E$ kẻ … , / cắt … tại $L$"; lí do "(dấu hiệu nhận biết: một cặp cạnh đối song song và bằng nhau)" → "(dấu hiệu nhận biết hình bình hành)" | Điều 1: dòng ≲ 60 kí tự hiển thị |
| Đề 4 Bài 4 | lập luận (chú thích) | Thêm lí do còn thiếu: $MC=DM$ "(định nghĩa trung điểm)"; $NB=…=DM$ "(cmt)"; "$N$ là trung điểm $AB$ (định nghĩa trung điểm)" (bỏ nhãn "(2)" không dùng); "$H$ thuộc $MN$" thêm "$H\in LN$ và $L\in MN$ (cách kẻ)"; lí do $BE\perp MN$ viết lại thành tên tính chất lớp 7 "(quan hệ giữa vuông góc và song song)" (câu cũ "cùng vuông góc với một đường thẳng trong hai đường song song" sai nghĩa); $EL\parallel NB$ "(vì $EL\parallel AB$, $N,\ B\in AB$)" thay "cùng song song với $AB$" ($NB$ nằm TRÊN $AB$) | Điều 3: mọi kiến thức phải có (gt) / (cmt) / tên định lí |
| Đề 4 Bài 4 | hình | `giai_de4_bai4.png` vẽ lại bằng `<LV>\tam\ve_soat_p23.mjs`: thêm đoạn $ME$ (tam giác $MBE$ của ý d thiếu một cạnh); dời nhãn $O$ (đè lên đường $BD$) lên trên-trái; dời nhãn $I$ xuống dưới (tránh đoạn $ME$ mới). Toạ độ vẫn đúng dữ kiện ($MB=ME$, $I,O,K$ thẳng hàng, $H$ trên $MN$) | Nhãn đè nét; thiếu đoạn của ý cần chứng minh |
| Đề 4 Bài 5 | lập luận (trình bày) | Thêm dòng "Vì $t$ là số nguyên nên $t\ge 1$ hoặc $t\le 0$." trước hai trường hợp | Hai trường hợp chỉ phủ hết khi nói rõ $t$ nguyên (chỗ hở chữ, không phải lỗi toán) |
| (mục GHI CHÚ CHO NGƯỜI DUYỆT) | định dạng | Sửa câu "các bước cách nhau một dòng trống" cho đúng luật, ghi chú phần trạm soát đã sửa | Câu cũ mô tả sai luật 27/10 |

## Kiểm riêng theo yêu cầu

- **Bài 4 — luật trình bày Hình 7·8·9:** sau sửa: dòng ngắn, mỗi khẳng định có (gt) / (cmt) / tên tính chất; không dòng trống giữa các bước. Chỉ dùng hình bình hành + tam giác bằng nhau (+ nền lớp 7: quan hệ vuông góc – song song); KHÔNG đường trung bình (kể cả ngầm: ý b/c/d đều tự chứng minh qua HBH $DNBM$, $NIMK$, $ADMN$, $ANLE$, $ELBN$), KHÔNG hình chữ nhật, KHÔNG trung tuyến ứng cạnh huyền. Phần 1 đi chiều phân tích ("muốn …, cần …"), khớp Phần 2.
- **Bài 5 (nâng cao) — máy vét cạn:** BigInt $|x|,|y|\le 2000$ ra đúng 3 cặp $(-1;-1),(0;0),(1;1)$; đồng nhất thức $6x^2y^2+x^2+y^2-8xy=(x-y)^2+6xy(xy-1)$ kiểm BigInt; bước "$t(t-1)\ge0$ với $t$ nguyên" đúng với mọi $t\in\mathbb{Z}$ (kể cả $t=0$, $t=1$, $t$ âm). Chứng minh không phụ thuộc vét cạn ⇒ đầy đủ.

## Câu "Đề sai" / Chưa chắc

Không có. (Đề 4 Bài 4c in dấu phẩy cuối câu "thẳng hàng," — lỗi chấm câu, giữ nguyên, không ảnh hưởng.)
