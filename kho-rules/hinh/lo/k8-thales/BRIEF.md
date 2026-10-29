# BRIEF — soạn câu Hình–Học K8 (Thales · Đường trung bình · Đường phân giác) — luồng "kho kiểu 1"

Mày là một trong 10 người soạn (G1…G10). Nhóm + danh sách câu của mày ghi ở cuối lời giao việc.
Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<TH>` = `C:\Users\WBPC\AppData\Local\Temp\claude\C--Users-WBPC-Desktop-BKERP-bkdemy-erp-v2\fb8747b7-c80d-4be5-bd47-3c40acf97252\scratchpad\thales`.
**KHÔNG ghi DB, KHÔNG sửa file trong repo** — chỉ ghi file nháp + ảnh dưới `<TH>`. Một khẳng định sai trong lời giải là lỗi nặng; không chắc ⇒ ghi mục nghi vấn, KHÔNG bịa.

## Việc phải làm cho MỖI câu được giao
(1) chốt ĐỀ hoàn chỉnh (đề nháp có sẵn trong `de-nguon.md`, đối chiếu ảnh trang gốc, sửa theo ghi chú "sửa lỗi đề"); (2) LỜI GIẢI 2 phần; (3) VẼ HÌNH bằng code; (4) VERIFY bằng toạ độ số.

## Đọc trước (bắt buộc, theo thứ tự)
1. `<TH>\de-nguon.md` — ĐỌC phần đầu (3 bài đích, whitelist, sửa lỗi đề) + các câu của nhóm mày. Ảnh trang: `<TH>\trang\t-NN.png`.
2. `<TH>\mau_HHC001977.md` — MẪU lời giải 2 phần đã chuẩn của bài chứng minh Hình 8 (sơ đồ phân tích đi lên ⇑ + trình bày theo sơ đồ).
3. `<Repo>\docs\mau-brief-soan-hinh-hoc.md` — luật định dạng R1/R2, vẽ hình, verify, đầu ra, và **"LUẬT TRÌNH BÀY HÌNH 7·8·9" ở cuối file (CEO 27/10: dòng ngắn, chú thích (gt)/(cmt)/tên định lý — ÁP DỤNG)**. Lưu ý mới: khoảng cách dòng +20% do app lo ⇒ trong dữ liệu KHÔNG thêm dòng trống giữa các bước.
4. `<Repo>\kho-rules\dai\k8.md` §1.5, §1.6 và mục "LUẬT TRÌNH BÀY HÌNH 7·8·9" (khuôn Phần 1 / Phần 2 của Hình 8); `<Repo>\kho-rules\README.md` §3 (card các bước: `**Bước k.**`, mọi bài 3–6 bước).
5. `<Repo>\docs\log-giai-hinh-hoc-bai.md`, `<Repo>\spec-giai-bai-ai.md` (ý sau dùng lại kết quả ý trước; verify trước khi chốt).
6. Mẫu vẽ: `<Repo>\scripts\anh\ve_hinh_hh101_102.mjs` + thư viện `<Repo>\scripts\anh\ve_hinh_lib.mjs`.

## Khuôn lời giải (khối 8, k8.md §1.6)
- **Câu CHỨNG MINH** (mọi câu "chứng minh…", "… là hình gì?"): `**Phần 1. Hướng dẫn**` = SƠ ĐỒ PHÂN TÍCH ĐI LÊN (dòng trên cùng = điều phải chứng minh; `$\Uparrow$ (lý do)`; điều có sẵn đánh ✓; `**Nhánh ①:**`…; không câu văn nào ngoài nhãn + lý do), `**Phần 2. Trình bày**` = đúng sơ đồ theo chiều ngược lại, mỗi mũi tên = một bước, cùng lý do. Mỗi ý a) b) c) một sơ đồ, mở bằng `a) ` (chữ thường, không in đậm), dòng trống CHỈ trước `b) `, `c) `… và trước `**Phần 2. Trình bày**`.
- **Câu TÍNH** (tra_loi_ngan / tính độ dài): Phần 1 bằng LỜI theo khuôn card: `**Mấu chốt:**` (1 dòng) · các bước mỗi bước một đoạn mở bằng `**Bước k.**` (3–6 bước, mỗi bước một ý trọn vẹn, đoạn cách nhau MỘT dòng trống) · `**Chú ý:**`; Phần 2 = các dòng tính, mỗi dòng kèm lý do trong ngoặc; kết bằng "Vậy …".
- **Câu "Điền vào chỗ trống"** (TL1a, TL1b của Thales): coi như câu tính — Phần 1 nói cách nhận ra cặp tỉ số (đỉnh chung, song song), Phần 2 viết từng ô một dòng.
- Mọi lý do ghi ĐÚNG tên trong whitelist của bài (k8 + `de-nguon.md`). **Không dùng công cụ ngoài whitelist** (đồng dạng, Pythagore, lượng giác; Thales: cấm đường trung bình + tính chất đường phân giác; Đường trung bình: cấm tính chất đường phân giác). Không giải được trong whitelist ⇒ KHÔNG dùng công cụ ngoài, ghi nghi vấn.
- Tên: viết "định lí Thalès" (bản K8 dùng cả "Thalès"/"Thales" — dùng "Thalès"), lý do ngắn gọn trong ngoặc: `(định lí Thalès)`, `(định lí Thalès đảo)`, `(đường trung bình của tam giác)`, `(tính chất đường trung bình)`, `(tính chất đường phân giác)`, `(tính chất hình bình hành)`, `(dấu hiệu nhận biết hình bình hành)`, `(gt)`, `(cmt)`, `(trung điểm)`…
- Dấu nhân `\cdot`. Phân số `\dfrac`. Số thập phân dấu phẩy: `3{,}5`. Đơn vị trong ngoặc sau kết quả.
- Tách ý (a, b, c…) chỉ cho bài TÍNH/tìm x; bài chứng minh giữ 1 câu nhiều ý (không tách).
- Đề PHẢI TỰ ĐỦ dữ kiện không cần nhìn hình: mọi số đo ghi trên hình đưa vào đề bằng chữ. Hình KHÔNG vẽ sẵn đáp án / điều phải chứng minh (vd không đánh dấu hai đoạn bằng nhau nếu đó là điều cần chứng minh; câu "chứng minh $M$ là trung điểm" thì KHÔNG gạch trung điểm $M$ trên hình).

## Định dạng đề `noi_dung`
KHÔNG dòng trống; câu dẫn, ý a) b) c) mỗi thứ một dòng, nối bằng xuống dòng đơn. Sau dấu chấm xuống dòng (R1). `$…$` bọc từng công thức.

## VẼ HÌNH (BẮT BUỘC mọi câu — kể cả câu chỉ có lời)
- Viết `<TH>\ve_<G>.mjs` (G = tên nhóm của mày, tên script PHẢI chứa nhóm của mày, vì 10 người chạy song song); import `file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs`; chạy `node` từ `<TH>`; ra `<TH>\hinh_<G>\`. Tên file = nhãn câu với dấu chấm đổi thành gạch ngang: `TL2-1a.png` (câu TL2.1a). Câu nhiều hình con ⇒ ghép MỘT ảnh, mỗi hình con kèm nhãn.
- Hình DỰNG ĐÚNG dữ kiện bằng toạ độ (song song, trung điểm, phân giác, tỉ lệ độ dài…); thứ tự điểm/bố cục như ảnh gốc khi câu có hình (A ở đâu, E,F nằm trên cạnh nào…). Câu số liệu: dựng ĐÚNG tỉ lệ các đoạn cho trước; đoạn cần tìm ghi `x` (không ghi đáp án). Trục chung: chừa ≥35px dưới nhãn đáy, cao ≲450px, nhãn không đè nét.
- **Hình lời giải riêng** (đường kẻ thêm dùng ở lời giải, vd điểm phụ): thêm `**hinh_lg:** <tên>_lg.png` (vẽ thêm phần kẻ phụ; hình đề KHÔNG chứa chúng).
- Xem lại bằng bảng: `node C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\scripts\anh\bang_hinh.mjs <TH>\hinh_<G> <TH>\hinh_<G>\_bang.png` rồi Read `_bang.png`; sửa nhãn bị cắt/đè/sai ký hiệu rồi vẽ lại.

## VERIFY (không verify = chưa xong)
Script `<TH>\kiem_<G>.mjs` (tạo bằng Write tool — KHÔNG heredoc cho nội dung có LaTeX): dựng toạ độ số cho từng câu; kiểm TỪNG khẳng định lời giải (song song, bằng nhau, tỉ số, trung điểm, thẳng hàng, số đáp). Điểm "bất kì" thử ≥2 bộ toạ độ. Với câu số: tính lại đáp số từ toạ độ dựng đúng dữ kiện và so với `dap_an`. Lời giải phải khớp từng dòng với phép tính máy làm. Đề tài liệu mâu thuẫn ⇒ ghi nghi vấn nêu đề đúng đã kiểm máy.

## ĐẦU RA — `<TH>\drafts\draft_<MÃ BÀI>_<G>.md` (mỗi câu một khối, đúng thứ tự trong lời giao)
```
### <nhãn, vd TL2.1a> → HH00142
**loai_cau:** tra_loi_ngan            (tu_luan | tra_loi_ngan)   — dòng này và dòng dap_an đặt TRƯỚC **noi_dung:**
**dap_an:** 6                         (chỉ khi tra_loi_ngan; nhiều đáp số: `y=55; z=35`; thập phân dấu phẩy `6,8`; phân số `28/3`)
**noi_dung:**
<đề>
**loi_giai:**
<lời giải 2 phần>
**cấu hình hình / nghi vấn:**
<mô tả hình; chữ in sai đã sửa; câu nào verify; công cụ ngoài whitelist nếu có; chỗ chưa chắc>
**hinh:** TL2-1a.png
**hinh_lg:** TL2-1a_lg.png            (chỉ khi có hình lời giải riêng)
```
Cuối cùng báo ≤200 từ: câu xong / còn nghi vấn / bị chặn bởi whitelist; hình nào chưa chắc; nêu RÕ đã chạy verify chưa (số phép kiểm, FAIL bao nhiêu) và đã mở bảng hình kiểm chưa.
