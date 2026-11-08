# Brief trạm GÕ ĐỀ — ba đề cương Toán 8 GKI 2026–2027 gửi 24/10

> `<MA>` ∈ `TX-GKI-2026` (THCS Thanh Xuân) · `NTL-GKI-2026` (THCS Nam Từ Liêm) · `DTK8-GKI-2026` (tuyển tập đề cương, tệp "ĐỀ THI GIỮA KÌ 1 K8", không ghi tên trường). `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K8\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm gõ chạy Sonnet; sau đó một trạm Opus ĐỐI CHIẾU ảnh (`brief-doi-chieu.md`) rồi mới đến soạn / soát.

Bạn gõ lại MỘT đề cương ôn tập giữa kì I **Toán 8** (Hà Nội 2026–2027) thành tệp `Repo\kho-rules\dai\lo\k8\de-cuong\<MA>.build.mjs`. Đề cương **không có đáp án / lời giải** — chỉ gõ ĐỀ. KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa tệp ngoài `<MA>.build.mjs` và `<LV>\img\`.

## 1. Đọc trước

1. `Repo\kho-rules\dai\k8.md` (luật khối 8: §1 kiến thức, §3 định dạng — dấu nhân là `\cdot` giữa số với số / số với biểu thức trong ngoặc, viết liền giữa chữ với chữ như `2xy`, `x(x+1)`; `\mathbb{N}`, `\mathbb{Z}`; số trong công thức viết liền). **Chỉ gõ ĐỀ, chưa giải.**
2. `Repo\kho-rules\dai\lo\k8\de-cuong\dc-lib.mjs` (đầu tệp mô tả dữ liệu `CAU` / `PHAN` / `NHOM`; máy kiểm KaTeX, `\cdot`, `\times`, chữ Việt ngoài `\text{}`, thiếu hình).
3. Mẫu cách viết `build.mjs` (K8, cùng khung): `Repo\kho-rules\dai\lo\k8\de-cuong\GV2-GKI-2026.build.mjs` (hàm `tach`, `ca`, `bt`, `R=String.raw`, gọi `dung({...})`). **Khối 8:** `kho` là `'dai'` (đơn thức, đa thức, hằng đẳng thức, phân tích nhân tử, tìm $x$, bài toán thực tế bằng biểu thức) hoặc `'hinh_hoc'` (bài HÌNH: tứ giác, hình thang (cân), hình bình hành, hình chữ nhật, hình thoi, hình vuông — kể cả câu TRẮC NGHIỆM hình); dấu nhân `\cdot` (KHÔNG `\times`, KHÔNG dấu chấm).

## 2. Nguồn đề

- Ảnh trang 130 dpi `<LV>\anh\t-1.png … t-N.png` — **NGUỒN CHÍNH**, mở HẾT bằng công cụ Read. Có thể có trang bìa / lịch kiểm tra (không có đề).
- `<LV>\goc.pdf` có thể có lớp chữ (`pdftotext`) nhưng **công thức trong lớp chữ hỏng** (mất số mũ, dấu trừ, phân số, ký hiệu ⋮ ∈ ⊂). Chỉ dùng làm tham khảo chữ tiếng Việt; **số / số mũ / ký hiệu luôn lấy từ ẢNH**. NQ là bản scan.
- Chỗ không chắc: phóng to `pdftoppm -r 260 -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> -png "<LV>\goc.pdf" "<LV>\z\<tên>"` (toạ độ 260 dpi = 2 × toạ độ ảnh `t-N.png`; tạo `z` nếu chưa có) rồi Read.

## 3. Luật gõ

1. **Gõ ĐỦ và ĐÚNG từng chữ, số, số mũ, dấu ngoặc, dấu trừ, ký hiệu** của đề — không tóm tắt, không chữa, không giải. Đề cương có thể in lỗi: vẫn gõ ĐÚNG như in, thêm `CHƯA CHẮC — …` (xem 5).
2. **Nhãn câu** giữ nguyên cách đánh số của đề (kể cả tiền tố: "Dạng 2 Bài 3a", "Đề 1 Bài 2", "Câu 5"…) — một nhãn duy nhất, dạng `Bài N…` hoặc `Câu N…` (hoặc tiền tố + `Bài N` / `Câu N`) để `dc-lib` đọc được số `N`. Nếu đề đánh số kiểu khác ("Dạng 1 – Ví dụ 3"…), tự đặt tiền tố hợp lý và NÓI trong báo cáo.
3. **Tách ý:** chỉ tách khi mỗi ý có dữ kiện RIÊNG và độc lập (tính từng biểu thức, tìm $x$ từng dòng, viết tập hợp…): mỗi ý một câu `nhan: "Bài 3a"`, `noi_dung = lead + ý`. **Giữ nguyên cả bài** khi: lời văn / bài toán thực tế nhiều ý chung dữ kiện · ý sau dùng kết quả ý trước · chứng minh · bài hình · bài có "a) b)" mà b dựa vào a. Số ý lớn (a…m) của một "Dạng" (CBQ) cùng lệnh "Tính" ⇒ vẫn tách từng ý.
4. **Dấu `:`** trong đề có hai nghĩa: ở bài tập hợp / chia hết là **chia hết** (⋮ — gõ `\vdots`, ví dụ `a\vdots 3`, `n\ \vdots\ 6`); ở bài Tính / Tìm $x$ là **phép chia** (`:`). Ghi `canh_bao` (không phải CHƯA CHẮC): `'Đề cương in dấu ":" cho phép chia hết — đã nhập thành $\\vdots$.'` khi đề dùng `:` mà bạn đổi thành `\vdots`.
5. **Định dạng (dc-lib kiểm):** công thức `$…$`; dấu nhân: `\cdot` giữa số với số / số với ngoặc (`2\cdot 4{,}5`, `3\cdot(x+1)`), viết LIỀN giữa chữ với chữ và hệ số với chữ (`2xy`, `x(x+1)`); CẤM `\times`; đề in dấu chấm giữa hai đơn thức (`5xyz.4x^3y^2`) ⇒ nhân, gõ `\cdot` (ghi chú `'Đề in dấu chấm = dấu nhân.'`); `\dfrac`; số viết liền (`125000`, không dấu cách ngàn); số thập phân `$2{,}5$`; chữ Việt trong công thức bọc `\text{…}`; dấu `|…|` giá trị tuyệt đối gõ `\left|…\right|`; số dấu `$` phải chẵn. Dấu chấm kết câu để NGOÀI công thức (`bt = (e) => \`$${e}$.\``). Xuống dòng trong `noi_dung` dùng ký tự xuống dòng thật (template `R\`…\``) cho từng ý `1)`, `2)` của bài nhiều ý.
6. **Trắc nghiệm** (đề có phần Trắc nghiệm / Câu hỏi nhiều lựa chọn): đặt vào một PHẦN riêng `{thu_tu, ten: 'I. Trắc nghiệm', dang_thuc: 'trac_nghiem'}`; mỗi câu `loai: 'trac_nghiem'`, `noi_dung` = câu hỏi + 4 dòng bắt đầu `A. `, `B. `, `C. `, `D. ` (mỗi phương án một dòng, giữ đúng nội dung). Đề chỉ có 2–3 phương án hay hình ảnh làm phương án ⇒ báo cáo, đừng bịa.
7. **"Điền vào chỗ trống" / "Điền kết quả"** không có phương án A–D ⇒ `loai` mặc định `tu_luan` (trạm sau tự quyết trả lời ngắn). Gõ chỗ trống bằng `…` hoặc `\ldots` đúng như đề.
8. **Phần (PHAN):** theo cấu trúc đề (I. Trắc nghiệm / II. Tự luận hoặc theo "Dạng 1…n" / "Đề 1, Đề 2"). Mỗi `PHAN[i] = {thu_tu, ten[, dang_thuc]}`.
9. **Chia trạm:** gán `nhom: k` (k = 1, 2, …) cho từng câu sao cho mỗi trạm ≤ ~12 câu (đếm CÂU sau khi tách ý), các bài liền nhau cùng trạm, bài NÂNG CAO (chứng minh khó, tìm $n$ đặc biệt) nên ở trạm ít câu hơn. Số trạm ghi trong báo cáo.
10. **Hình trong đề:** bài có hình vẽ sẵn ⇒ cắt hình vào `<LV>\img\de_<tên>.png` bằng `pdftoppm -r 200 -x … -y … -W … -H … -png -singlefile` (xem hình ảnh sau khi cắt để chắc đủ khung, không dính chữ bài khác) rồi khai `anh: ['de_<tên>.png']` ở câu đó. Thêm `canh_bao`: `'Đọc hình: <dữ kiện nhìn thấy trên hình — độ dài, số đo góc, ký hiệu bằng nhau, vuông góc, song song, tên điểm>'` (tóm tắt NGẮN, đủ để soát được nếu mất hình). Bài hình KHÔNG có hình sẵn: không vẽ — trạm sau tự vẽ hình giải.
11. **`canh_bao`:** mảng chuỗi. Chuỗi bắt đầu `'CHƯA CHẮC — '` ⇒ chỗ mờ / hai cách hiểu / đề in lỗi / phải dùng kiến thức ngoài khối 8. Chuỗi khác ⇒ ghi chú thường. Nhớ ghi lại **mọi** chỗ bạn nghi (số mũ nhỏ, dấu trừ mờ, ký hiệu ⊂ ∈ ∉, ô trống). Đừng ghi tràn lan.
12. **Không giải, không đoán đáp án.** Đề có sẵn lời giải mẫu / ví dụ có lời giải trong tệp (đề cương nào in sẵn đáp án / lời giải / dấu khoanh tay của học sinh: BỎ QUA vết viết tay, chỉ gõ chữ in): vẫn gõ phần ĐỀ làm một câu; **KHÔNG chép lời giải mẫu vào `noi_dung`** — ghi một dòng ghi chú `'Đề cương in sẵn lời giải mẫu — đáp số phải giải độc lập; lỗi in (nếu có): …'`.

## 4. Chạy và nộp

1. Viết `Repo\kho-rules\dai\lo\k8\de-cuong\<MA>.build.mjs`. Đầu tệp: comment ghi tên đề cương, trường, số trang, phạm vi kiến thức đề ghi, cấu trúc, những chỗ nghi.
2. Chạy từ Repo: `node kho-rules/dai/lo/k8/de-cuong/<MA>.build.mjs "<LV>"` (cần `<LV>\goc.pdf` và `<LV>\img\` đã có các hình khai). Sửa tới khi in "✔". Nó tạo `<LV>\de.json` và `<MA>.p<N>.soan.md` (khung cho trạm soạn). Tham số `MA/TEN/NGUON/FILE` của `dung()`: `TEN` = tên đề cương đầy đủ ("Đề cương ôn tập giữa kì I Toán 8 năm 2026–2027 — Trường …, Hà Nội"), `NGUON` = tên trường, `FILE` = tên tệp PDF gốc (không dấu).
3. Tự đối chiếu LẠI một lượt cả tệp với ảnh (đọc từng trang, tick từng câu) trước khi nộp.

## 5. Báo cáo cuối (vài dòng)

- Số trang đề thực (không tính bìa) · số phần · số câu (bao nhiêu trắc nghiệm) · số trạm và nhãn từng trạm.
- Danh sách `CHƯA CHẮC` (nhãn + lí do) và các câu có hình.
- Điểm bạn nghi về cách đánh nhãn / cách tách ý để trạm đối chiếu xem.

## 6. Bẫy đã cắn thật

- Số mũ nhỏ (đặc biệt `10^2` / `10^3` / `2^3`), dấu trừ, dấu ngoặc đơn / ngoặc vuông, dấu `:` chia hết vs chia, ký hiệu `⊂ ∈ ∉ ≠ ≤ ≥`, ký hiệu tập hợp `{ }`.
- Lớp chữ PDF thường **mất số mũ và dấu trừ** ⇒ "2 3" thay vì $2^3$; đừng tin.
- Đề in lỗi chính tả / mất số: gõ ĐÚNG như in + `CHƯA CHẮC`.
- Tháp luỹ thừa $a^{b^c}$: gõ `a^{b^{c}}`.
