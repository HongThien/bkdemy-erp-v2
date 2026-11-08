# Biên bản ĐỐI CHIẾU ĐỀ — NTL-NC-2026 (THCS Nam Từ Liêm, Phiếu BSNC + Ôn tập GK I Toán 6, 2026–2027)

- Trạm: Opus, đối chiếu độc lập. Ngày 24/10/2026. Người gõ: Sonnet.
- Nguồn: `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K6\NTL-NC-2026\anh\t-01.png … t-16.png` (đã mở đủ 16 trang TRƯỚC khi mở build.mjs) + phóng 260–600 dpi từ `goc.pdf` (ảnh phóng ở `<LV>\z\oc\`).
- Vết bút của người dùng ở trang 1–3 (khoanh đáp án, gạch chân "Bài N", tích ô Đ/S, chấm mực ở T21 Câu 4B): KHÔNG dùng làm đề hay đáp án.
- Số câu: **227 trước → 227 sau** (82 trắc nghiệm, 145 tự luận). Số trạm: **25 trước → 25 sau** (p1–p25, mỗi trạm 7–12 câu). Không có tệp `.soan.md` thừa.
- Nhãn: duy nhất (đã kiểm bằng máy). Chấp nhận `T19 Bài 1` (bảng Đ/S) + `T19 TL Bài N` (tự luận Tiết 19) như caller cho phép.
- Kho: ÔT D5 Bài 1–5 đều `hgt` (Bài 1 là bài lát gạch nền hình chữ nhật, coi là hình học tổng hợp) — chấp nhận.
- Kết quả chạy lại: `✔ … de.json — 227 câu · hình đề 30`.

## Lỗi tìm thấy và sửa

| Câu | Lỗi | Sửa gì |
|---|---|---|
| T20 Câu 2 | **chép thiếu chữ**: phương án B in "Các số tự nhiên có 1 chữ số **là số nguyên tố** là 2;3;5;7." (phóng 300 dpi thấy rõ), người gõ bỏ mất "là số nguyên tố" rồi đặt cờ CHƯA CHẮC | Gõ đủ chữ; bỏ cờ CHƯA CHẮC (bản in đúng, chỉ C sai) |
| TK1 Câu 6 | **ghi chú sai**: ghi "đề in a234 không có gạch ngang" nhưng phóng 400 dpi thấy gạch ngang trên $\overline{a234}$ có in | Bỏ ghi chú (nội dung `\overline{a234}` vẫn đúng) |
| T22 VN Bài 2 | **Đọc hình**: ghi phần dưới là "hình bình hành GDEF" — hình không cho biết như vậy | Sửa: hai hình thang $ABCG$ ($AB\parallel GC$) và $GDEF$ ($GD\parallel FE$); hình không ghi $GC$, $GD$ |
| ÔT D6 Bài 7 | **Đọc hình**: ghi có "đường chéo AC" — hình phóng 400 dpi chỉ vẽ hai cạnh $AN$, $MC$ song song, KHÔNG có $AC$ | Sửa dòng Đọc hình |
| TK1 Câu 7 | **Đọc hình** mơ hồ ("đa giác nhiều cạnh") | Ghi rõ: lục giác ở giữa, mỗi cạnh dựng 1 hình vuông, giữa 2 hình vuông kề là 1 tam giác, viền ngoài 12 cạnh |
| ÔT Câu 16, D6 Bài 4a–c, TK1 Bài 2c, TK3 Bài 2c | **ghi chú sai**: hằng `DK_CHIA_HET` nói đề in dấu ":" — thực tế đề in ký hiệu "⋮" | Đổi chữ ghi chú thành "Đề cương in ký hiệu chia hết ⋮ — đã nhập thành $\vdots$" (nội dung `\vdots` giữ nguyên) |
| T20 Bài 3c | ghi chú: in "98'" có vết nhỏ trên số 8 (phóng 600 dpi), người gõ không ghi | Thêm ghi chú thường (không đổi đáp số: 98 hay "98 có dấu" đều đọc là 98) |
| T21 Câu 4 | ghi chú chưa đủ: nói "vết mực che chữ" | Phóng 600 dpi: chữ in là **"32 cm"** (chữ c đen, chấm bút xanh của người dùng đè lên). Ghi rõ: như in thì không phương án nào đúng (chu vi đúng tính bằng m). Giữ CHƯA CHẮC |
| T22 Bài 2 | ghi chú: MAND vs MANB | **Quyết bằng hình**: hình thoi trên hình là $MANB$ (đường chéo $MN$ ngang, $AB$ dọc; $D$ là đỉnh hình vuông). Đề in lỗi "MAND" (2 lần). Giữ chữ như in + CHƯA CHẮC, dặn trạm soạn hiểu là $MANB$ (dữ kiện đủ, không mâu thuẫn) |
| TK1 Bài 4 | cờ CHƯA CHẮC "có thể là ý c riêng" | **Quyết**: đề không có nhãn c); ý b) in gồm 2 yêu cầu. Cả bài là MỘT câu (bài hình, không tách) nên cách tách không ảnh hưởng. Hạ thành ghi chú thường; đã thử giải nhanh — đủ dữ kiện |
| TK1/TK2/TK3 Bài 5.2 (tiếng Anh) | cờ `KT_NGOAI` "CHƯA CHẮC — có thể ngoài chương trình khối 6" | **Quyết**: 5.2 TK1 (số câu cả 3 bạn cùng đúng ít nhất), TK2 (biểu đồ Ven 3 tập, số liệu nhất quán), TK3 (dãy tuần hoàn) đều trong phạm vi khối 6 nâng cao. Bỏ cờ, giữ ghi chú "đề tiếng Anh, gõ nguyên văn" (đã soát nguyên văn khớp ảnh) |
| T19 Câu 3 | định dạng: phương án `'1'` không bọc `$` (khác mọi câu khác), thiếu dấu chấm như in | `'$1$.'` … `'$4$.'` |

Các câu còn lại (T19–T22, ÔT Câu 1–40, Dạng 1–6, 3 đề tham khảo) đối chiếu từng chữ / số / số mũ / dấu / ngoặc / ký hiệu: **khớp ảnh**. Đã thử giải nhanh các bài Tìm $x$ (D2 Bài 1.1–1.11, TK Bài 2) và các bài hình có số liệu (T21 VN 3, T22 Bài 4*, TK1 Bài 4, TK1 Bài 5.1, TK2 Bài 5.2): đều ra nghiệm tự nhiên / không mâu thuẫn.

## Hình đề (30 tệp `<LV>\img\de_*.png`) — đã mở từng tệp

- Đủ khung, đúng bài, không dính bài khác: cả 30. Dòng "Đọc hình" khớp hình, trừ 3 chỗ đã sửa ở bảng trên (T22 VN 2, ÔT D6 7, TK1 Câu 7).
- `de_t22-c4.png`: đã phóng 400 dpi — lưới 4 cột × 3 hàng, $A$ ở nút 1, $B$ ở nút 3, $D$, $C$ hai góc dưới: Đọc hình đúng.
- `de_t22-bai2.png`: hình thoi $M$–$A$–$N$–$B$, hình vuông $A$–$B$–$C$–$D$ (cạnh $AB$ là đường chéo dọc của hình thoi).
- Lưu ý nhỏ (không sửa ảnh, không ảnh hưởng dữ kiện): `de_t21-bai1.png` mép phải dính một nét cung bút xanh của người dùng; `de_t21-vn2.png` và `de_tk1-bai4.png` mép trên dính mẩu chữ đầu trang "Phiếu BSNC Toán 6". Trạm vẽ lại hình nên bỏ qua các vết này.
- ÔT D4 Bài 2 có ảnh chụp phòng học minh hoạ (không dữ kiện) — đúng là không cắt.

## CHƯA CHẮC cuối cùng (3)

1. **T20 Câu 3** — đề in "Phân tích số ⎵ ra thừa số nguyên tố" mất số cần phân tích (4 phương án đều viết về 18).
2. **T21 Câu 4** — phương án B in "32 cm"; như in không có phương án đúng (đáp số đúng là 32 m).
3. **T22 Bài 2** — đề in "hình thoi MAND", hình cho thấy hình thoi MANB; soạn theo MANB.

## Nghi mà không quyết

- Không có. (Ghi chú thường còn lại: T22 Câu 3 lẫn đơn vị dm/m ở phương án — đúng như in; ÔT Câu 27 "Hìn h 3" lỗi gõ khoảng trắng → "Hình 3"; ÔT Câu 28 "$60^{0}$" như in.)
