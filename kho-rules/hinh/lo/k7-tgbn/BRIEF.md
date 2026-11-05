# BRIEF — soạn câu Hình–Học K7 (Tam giác bằng nhau: c.c.c · c.g.c · g.c.g · tam giác vuông · tam giác cân – trung trực)

Mày là một trong 11 người soạn (A1…A11). Nhóm + danh sách câu của mày ghi ở cuối lời giao việc.
Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. `<K7>` = `C:\Users\WBPC\AppData\Local\Temp\claude\0ce3df5438caf103\cba68ff4-ac52-482c-b96e-0577f644be06\scratchpad\k7`.
**KHÔNG ghi DB, KHÔNG sửa file trong repo** — chỉ ghi file nháp + ảnh dưới `<K7>`. Một khẳng định sai trong lời giải là lỗi nặng; không chắc ⇒ ghi mục nghi vấn, KHÔNG bịa.

## Việc phải làm cho MỖI câu được giao
(1) chốt ĐỀ hoàn chỉnh (đề nháp trong `<K7>\de-nguon.md`, ĐỐI CHIẾU ẢNH TRANG GỐC `<K7>\trang\t-NN.png` — mọi kí hiệu trên hình phải đọc từ ảnh, phóng to khi cần); (2) LỜI GIẢI 2 phần; (3) VẼ HÌNH bằng code; (4) VERIFY bằng toạ độ số.

## Đọc trước (bắt buộc, theo thứ tự)
1. `<K7>\de-nguon.md` — phần đầu (5 bài đích, WHITELIST từng bài, khuôn dạng "Viết tam giác bằng nhau và tính chất suy ra") + các câu của nhóm mày.
2. `<Repo>\docs\mau-brief-soan-hinh-hoc.md` — luật R1/R2, cách vẽ hình, verify, đầu ra, mẫu lời giải "Xét … có:" và **"LUẬT TRÌNH BÀY HÌNH 7·8·9" ở cuối (dòng ngắn; chú thích (gt)/(cmt)/tên định lí — BẮT BUỘC)**.
3. `<Repo>\kho-rules\dai\k7.md` §1.5 (lời giải 2 phần, card bước) + dòng "Hình" ở §2; `<Repo>\kho-rules\README.md` §3.
4. `<K7>\kho_hien_co.md` — các câu đã duyệt của 5 bài này (nhịp lời giải "Xét … có:", tên trường hợp, cách nói "hai góc tương ứng").
5. `<Repo>\docs\log-giai-hinh-hoc-bai.md`, `<Repo>\spec-giai-bai-ai.md` (ý sau dùng lại kết quả ý trước; verify trước khi chốt).
6. Mẫu vẽ: `<Repo>\scripts\anh\ve_hinh_hh101_102.mjs` + thư viện `<Repo>\scripts\anh\ve_hinh_lib.mjs` (P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu).
7. Mẫu bản nháp đã chuẩn (khuôn khối, 2 phần — CHỈ lấy khuôn, Phần 1 khối 7 viết bằng LỜI chứ không sơ đồ): `<Repo>\kho-rules\hinh\lo\k8-thales\drafts\draft_HH00142_G3.md`.

## Khuôn lời giải (khối 7)
- `**Phần 1. Hướng dẫn**`: `**Mấu chốt:**` (1–2 dòng: dấu hiệu trong đề ⇒ chọn cặp tam giác nào, trường hợp nào) → **3–6** đoạn `**Bước k.**` (mỗi bước một ý trọn vẹn, đoạn cách nhau MỘT dòng trống, không chép lại Phần 2) → `**Chú ý:**` (tuỳ chọn, bẫy thứ tự đỉnh / góc xen giữa…). Câu nhiều ý: các bước đi theo ý (vd `**Bước 2.** Ý b) …`).
- `**Phần 2. Trình bày**`: cái HS viết vào vở — khuôn "Xét $\triangle ABC$ và $\triangle DEF$ có:" mỗi điều kiện một dòng kèm lý do trong ngoặc, kết "Do đó $\triangle …=\triangle …$ (c.c.c)." ; ý mở bằng `a) ` (chữ thường, không in đậm), dòng trống CHỈ trước `b) `, `c) `… và trước `**Phần 2. Trình bày**`.
- Lý do: `(gt)`, `(cmt)`, `(cạnh chung)`, `(hai góc tương ứng)`, `(hai cạnh tương ứng)`, `(hai góc đối đỉnh)`, `(hai góc kề bù)`, `(hai góc so le trong)`, `(tổng ba góc của tam giác)`, `(trung điểm)`, `(tia phân giác)`, `(c.c.c)`, `(c.g.c)`, `(g.c.g)`, `(ch - gn)`, `(ch - cgv)`, `(cgv - cgv)`, `(cgv - gn)`, `(tính chất tam giác cân)`, `(dấu hiệu nhận biết tam giác cân)`, `(tính chất đường trung trực)`, `(định nghĩa đường trung trực)`… — CHỈ những gì trong WHITELIST của bài.
- Thứ tự đỉnh khi viết hai tam giác bằng nhau PHẢI khớp tương ứng (kiểm bằng toạ độ). Chứng minh tia phân giác: nêu tia nằm giữa (theo hình) + hai góc bằng nhau. Chứng minh song song: so le trong bằng nhau. Chứng minh vuông góc: hai góc kề bù bằng nhau ⇒ mỗi góc $90^\circ$.
- Dấu nhân khối 7 là dấu chấm `.` (hiếm gặp ở bài hình). Góc `\widehat{ABC}`, tam giác `\triangle`, độ `^\circ`, song song `\parallel`, vuông góc `\perp`. Mỗi công thức một cặp `$…$`.
- Câu TÍNH GÓC (HH00104 TL1.1, TL1.2, VN.1, VN.2): `**loai_cau:** tu_luan` (nhiều đáp số); Phần 2 mỗi phép tính một dòng có lý do; kết "Vậy …".
- KHÔNG tách ý: 1 câu = 1 số bài của tài liệu.

## Định dạng đề `noi_dung`
KHÔNG dòng trống; câu dẫn, ý a) b) c) mỗi thứ một dòng, nối bằng xuống dòng đơn. Sau dấu chấm xuống dòng (R1).
Đề "Cho hình vẽ…" PHẢI TỰ ĐỦ dữ kiện: mọi kí hiệu trên hình (gạch bằng nhau, góc bằng nhau, góc vuông, số đo) ghi thẳng vào đề dạng "Biết …" — TRỪ dạng "Viết tam giác bằng nhau và tính chất suy ra" (TL1.k của HH00099/101/102/103) theo khuôn riêng trong `de-nguon.md` (đề KHÔNG ghi đẳng thức, HS đọc từ hình).
Sửa lỗi in hiển nhiên đã nêu ở `de-nguon.md` và ghi vào nghi vấn; lỗi khác phát hiện thêm ⇒ ghi nghi vấn + nêu đề đúng đã kiểm máy.

## VẼ HÌNH (BẮT BUỘC mọi câu)
- Viết `<K7>\ve_<G>.mjs` (G = tên nhóm; 11 người chạy song song nên tên script/thư mục PHẢI chứa nhóm), import `file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs`; chạy `node` từ `<K7>`; ra `<K7>\hinh_<G>\`. Tên file = `<mã bài>_<nhãn, chấm đổi gạch>.png`, vd `HH00099_TL1-3.png`.
- Hình DỰNG ĐÚNG dữ kiện bằng toạ độ (bằng nhau, song song, vuông góc, phân giác, trung điểm, số đo góc); bố cục, tên điểm, vị trí điểm NHƯ ẢNH GỐC; tam giác không cân/đều trừ khi đề buộc. Kí hiệu: số gạch trên cạnh, số cung góc (hai góc kề nhau 2 bán kính khác nhau), góc vuông `rightAngle` — đúng như ảnh gốc, KHÔNG thêm kí hiệu là điều phải chứng minh (vd câu "chứng minh $AH\perp BC$" thì KHÔNG vẽ ô vuông ở $H$; "chứng minh tia phân giác" thì KHÔNG đánh dấu hai góc bằng nhau đó; "chứng minh tam giác cân" thì không gạch hai cạnh đó). Câu tính góc: góc cần tìm ghi `x` hoặc để trống, KHÔNG ghi đáp số.
- Canvas cao ≲450px; chừa ≥35px dưới nhãn đáy; nhãn không đè nét.
- Hình lời giải riêng (đường/điểm kẻ thêm chỉ dùng ở lời giải): thêm `**hinh_lg:** <tên>_lg.png`.
- Xem lại bằng bảng: `node C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\scripts\anh\bang_hinh.mjs <K7>\hinh_<G> <K7>\hinh_<G>\_bang.png` rồi Read `_bang.png`; sửa nhãn cắt/đè, kí hiệu sai/thiếu so với ảnh gốc rồi vẽ lại.

## VERIFY (không verify = chưa xong)
Script `<K7>\kiem_<G>.mjs` (tạo bằng Write tool — KHÔNG heredoc cho nội dung có LaTeX): dựng toạ độ số cho từng câu; kiểm TỪNG khẳng định của lời giải (bằng nhau cạnh/góc, tương ứng đỉnh, song song, vuông góc, trung điểm, thẳng hàng, số đo). Điểm "bất kì" thử ≥2 bộ toạ độ. Câu tính góc: tính lại từ toạ độ dựng đúng dữ kiện và so đáp số.

## ĐẦU RA — `<K7>\drafts\draft_<MÃ BÀI>_<G>.md` (mỗi câu một khối, đúng thứ tự trong lời giao; một nhóm làm 2 bài thì 2 file)
```
### <nhãn, vd TL2.3> → HH00099
**loai_cau:** tu_luan
**noi_dung:**
<đề>
**loi_giai:**
<lời giải 2 phần>
**cấu hình hình / nghi vấn:**
<mô tả hình; chữ in sai đã sửa; đã verify gì; công cụ ngoài whitelist nếu có; chỗ chưa chắc>
**hinh:** HH00099_TL2-3.png
**hinh_lg:** HH00099_TL2-3_lg.png      (chỉ khi có hình lời giải riêng)
```
Cuối cùng báo ≤150 từ: câu xong / còn nghi vấn / bị chặn bởi whitelist; nêu RÕ đã chạy verify chưa (bao nhiêu phép kiểm, FAIL bao nhiêu) và đã mở bảng hình kiểm chưa.
