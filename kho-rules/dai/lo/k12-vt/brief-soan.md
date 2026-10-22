# Brief trạm SOẠN — lý thuyết nhóm + lý thuyết dạng + ví dụ cho bản đồ đề xuất K12 chương Vectơ (22/10)

> Thùy 22/10: *"với cách làm tương tự (chương Hàm số), làm cho chương Vector trong không gian — từ sách, đề thi và 3 bộ sách tham khảo."* Khuôn giống chương Hàm số đã làm: **mỗi NHÓM có lý thuyết chung; mỗi DẠNG có mô tả + lý thuyết riêng + 2 ví dụ có lời giải.** Trạm soạn chạy Sonnet; trạm soát (`brief-soat.md`) chạy Opus.
> Chạy mọi lệnh từ thư mục repo `C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2`. `<DIR>` = `kho-rules/dai/lo/k12-vt` · `<JOB>` = mã lượt giao (J1…J5).

## Luật cứng (Thùy đã phản hồi ở chương Hàm số — áp dụng ngay)
1. **Mỗi dạng chỉ nói về ĐÚNG bài toán của dạng đó.** Lý thuyết dạng và cả hai ví dụ phải đúng kiểu đề ghi ở **mô tả nhận biết** của dạng trong `<DIR>/cau-truc.mjs`. Không lẫn kiểu của dạng khác (vd dạng "Tổng và hiệu vectơ trong hình hộp" thì ví dụ trên hình hộp, không đưa lăng trụ/chóp).
2. Ví dụ **khác hẳn nhau** về hình và số liệu; ví dụ 1 cơ bản đúng dạng, ví dụ 2 khó hơn một bậc (vẫn đúng dạng). Số liệu cho kết quả đẹp.
3. Bài đơn giản ở nhóm cơ bản, bài khó ở nhóm nâng cao — **đừng nâng độ khó ví dụ vượt khung** của dạng (độ khó đề xuất ghi trong cau-truc.mjs).

## 1. Đọc trước
1. **Giao việc:** các nhóm + dạng của lượt, lấy từ `<DIR>/cau-truc.mjs` (tên, **mô tả nhận biết** = ĐÍCH, mức hình `3d`/`khong`, độ khó).
2. **Mẫu khuôn:** `<DIR>/mau.txt` (một khối NHÓM + hai khối DẠNG của chương Giới hạn lớp 11 + một ví dụ K12) — bắt chước đúng khuôn và mức chi tiết (mẫu là toán khác nhưng khuôn y hệt).
3. **Hồ sơ nguồn (đã đếm sẵn):** `<DIR>/ho-so/hoso-vt-tutam.md` · `hoso-vt-nbv.md` · `hoso-vt-pnl.md` · `de-erp-theo-nhom-cu.txt`. Tìm **KIỂU đề thật** của dạng (mỗi hồ sơ liệt kê kiểu + đề mẫu + bẫy + lỗi in sai của tác giả). Hồ sơ ghi cả **lỗi đáp án nguồn** — đừng chép lỗi.
4. **Chữ gốc của sách** (để tìm ý ví dụ, cách trình bày lý thuyết; Grep trong đó): `C:/Users/WBPC/AppData/Local/Temp/claude/C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2/ba124078-f427-4ed3-9f84-e750417a463f/scratchpad/vt/txt/` — tiền tố `TT__` Từ Tâm · `NBV8__`/`NBV9__`/`NBV10__` · `PNL__`. Hình trong sách là `[[img:…]]` (không đọc được).
5. Luật định dạng nội dung: `spec-format-noidung.md` (đầu file) — khung `##TC ##PP ##CY ##DN ##DL ##NX ##VD`.

## 2. Khuôn tệp ra `<DIR>/ra/<JOB>.txt` (Write tool, không heredoc)
```
=== N P1.1                 ← khối NHÓM (chỉ @ly_thuyet:), đứng ngay trước các dạng của nhóm đó
@ly_thuyet:
##TC <tên khung — tuỳ chọn>
- …
##PP <tên phương pháp>
<bước 1 — mỗi dòng một bước, KHÔNG ghi "Bước 1">
…
##CY
- <bẫy thật>

=== P1.1.1                ← khối DẠNG: @ly_thuyet: + @vi_du:
@ly_thuyet:
##TC …
##PP …
##CY …

@vi_du:
##VD
<đề ví dụ 1>

Bài giải:
<dòng 1>
…
Vậy …

##VD
<đề ví dụ 2>

Bài giải:
…
Vậy …
```
- Lý thuyết gồm các khung (mỗi khung một đoạn; các khung cách nhau MỘT dòng trống; trong khung không có dòng trống): `##TC` (định nghĩa/công thức/tính chất; mỗi ý một dòng, mở bằng "- ") · `##PP <tên>` (**BẮT BUỘC**, 3–6 bước, mỗi dòng một bước trọn ý) · `##CY` (bẫy hay sai thật). Lý thuyết nhóm = bức tranh chung (~1000–1500 ký tự), không chép lại lý thuyết riêng của dạng; lý thuyết dạng = kiến thức + phương pháp + chú ý RIÊNG của dạng.
- Ví dụ: `##VD` + đề (nhiều dòng, không dòng trống) · MỘT dòng trống · `Bài giải:` rồi lời giải **liền dòng** (mỗi phép biến đổi/câu một dòng, KHÔNG dòng trống bên trong), kết bằng `Vậy …`. Lời giải như học sinh viết vào vở. Ví dụ **tự luận** (không bốn phương án); dạng "chọn mệnh đề đúng" thì viết a), b)… hỏi từng ý.
- **Định dạng công thức:** trong `$…$` (KHÔNG `$$`, KHÔNG `\(`) · dấu nhân `\cdot` (không `\times`) · phân số `\dfrac` · thập phân `2{,}5` · vectơ viết `\overrightarrow{AB}` · toạ độ `A(1;2;3)`, `\vec{a}=(1;-2;3)` · chữ Việt trong công thức bọc `\text{}` · không chữ nghiêng `*…*`, chỉ **đậm**.

## 3. HÌNH 3D — quy ước
Máy vẽ chỉ vẽ đồ thị/bảng biến thiên (không vẽ hình khối). Vì vậy **không dùng `[[HINH]]`** và **không viết "như hình vẽ"**: mọi dữ kiện của hình hộp/lăng trụ/chóp/tứ diện phải nói đủ BẰNG LỜI trong đề (tên đỉnh, cạnh bằng nhau, góc, vị trí điểm M, N…) để HS tự dựng hình. Khi dạng thuộc nhóm hình khối, đề nên nói rõ "Cho hình hộp $ABCD.A'B'C'D'$ …". Máy kiểm sẽ không cảnh báo thiếu hình với dạng `3d`.

## 4. Kiến thức — đúng phạm vi
- Chương trình Toán 12 (CT 2018, chương "Vectơ và hệ toạ độ trong không gian"): vectơ trong không gian, tổng–hiệu–tích số, tích vô hướng, ba vectơ đồng phẳng, hệ Oxyz, biểu thức toạ độ các phép toán, **tích có hướng** (chỉ dùng như công cụ tính diện tích/thể tích/vuông góc), lực và công. **KHÔNG** dùng phương trình mặt phẳng/đường thẳng/mặt cầu, góc nhị diện, khoảng cách điểm–mặt (thuộc chương sau).
- Nguồn chỉ dạy **đồng phẳng**, **tâm tỉ cự**, **ứng dụng tích có hướng** qua bài tập (lý thuyết thiếu): lý thuyết nhóm P1.3, P3.5, P3.6 phải bạn **tự viết đủ và đúng**.
- Dạng mô tả mơ hồ ⇒ làm theo cách hiểu hợp lí nhất, ghi vào mục cuối tệp (mục 6), đừng tự đổi đích.
- Bài thực tế: nêu đơn vị, lập hệ trục/vectơ, tính, kết luận bằng ngữ cảnh.

## 5. Thử lại bằng máy (bắt buộc — Toán phải đúng)
Không có Python; dùng **node**. Mọi ví dụ: viết `<DIR>/tam/<JOB>/thu.mjs` kiểm bằng số — với hình khối, **đặt toạ độ cụ thể cho các đỉnh** rồi tính lại tích vô hướng, góc, độ dài, đồng phẳng… để so với đáp số bạn viết. Lời giải "tổng hợp" (không toạ độ) vẫn phải khớp phép tính toạ độ. Chỉ ghi ví dụ đã khớp.
Sau khi ghi tệp ra, chạy:
```
node kho-rules/dai/lo/k12-vt/kiem.mjs kho-rules/dai/lo/k12-vt/ra/<JOB>.txt <danh sách mã, ngăn bằng dấu PHẨY: nhóm viết "P1.1", dạng viết "P1.1.1">
```
phải **lỗi 0** (bỏ qua dòng "No character metrics" của KaTeX).

## 6. Cuối tệp
Thêm mục `## GHI CHÚ CHO CEO` (sau khối cuối): dạng nào mô tả mơ hồ / bạn phải tự hiểu; dạng nào nguồn có lỗi (ghi rõ chỗ sai); dạng nào ít chắc. Không có thì ghi "Không".

## 7. Làm việc & trả lời
KHÔNG ghi DB; KHÔNG sửa tệp ngoài `<DIR>/ra/<JOB>.txt` và thư mục nháp `<DIR>/tam/<JOB>/`. Trả lời cuối ≤ 120 từ: số nhóm · số dạng · số ví dụ · máy kiểm lỗi 0 chưa · đã chạy thử bằng số chưa · các điểm trong GHI CHÚ CHO CEO.

## Giao việc theo lượt
- **J1:** nhóm P1.1, P1.2 (dạng P1.1.1–P1.1.2, P1.2.1–P1.2.6)
- **J2:** nhóm P1.3, P1.4 (P1.3.1–2, P1.4.1–5)
- **J3:** nhóm P1.5, P2.1, P2.2, P2.3 (P1.5.1–2, P2.1.1–3, P2.2.1–3, P2.3.1–2)
- **J4:** nhóm P3.1, P3.2, P3.3 (P3.1.1–3, P3.2.1–4, P3.3.1–3)
- **J5:** nhóm P3.4, P3.5, P3.6, P3.7 (P3.4.1–3, P3.5.1–3, P3.6.1–3, P3.7.1–3)
- **J6 (bổ sung độ phủ):** chỉ các DẠNG MỚI P1.2.7, P1.4.6, P3.2.5 — khối nhóm của P1.2, P1.4, P3.2 đã có trong J1/J2/J4 nên KHÔNG viết lại khối nhóm; chỉ 3 khối dạng (mỗi dạng lý thuyết + 2 ví dụ); đọc J1/J2/J4 để tránh lặp lý thuyết nhóm và để chọn hình/số liệu khác các ví dụ đã có
