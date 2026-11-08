# Brief — nhập SÁCH "Củng cố Toán 6 tập 1, Chương III (Số nguyên)" vào kho: soạn + xếp dạng (một file / một trạm)

Việc: biến MỘT file `C:\Users\WBPC\bk-kho-lam-viec\so-nguyen\cungco\C3. <tên>.txt` thành MỘT file JSON câu hỏi (đề đã chuẩn hoá + lời giải khuôn khối 6 + dạng bài đề xuất). KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa file nào khác ngoài file JSON ra.

## Đọc trước (hết)
1. `Repo\kho-rules\dai\k6.md` — luật khối 6 (§1 kiến thức được dùng, §2 khuôn lời giải, §3 định dạng). `Repo = C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
2. `Repo\kho-rules\dai\lo\k6\de-cuong\brief-soan-dc.md` §3 (cách làm: tự giải rồi kiểm bằng máy, trắc nghiệm "Chọn X.", trả lời ngắn ≤ 4 ký tự, Phần 1 không lộ đáp số cuối) và mẫu `Repo\kho-rules\dai\lo\k6\GKI-01.soan.md` (khuôn **Phần 1. Hướng dẫn** + **Phần 2. Trình bày** thật).
3. `Repo\kho-rules\dai\lo\k6\so-nguyen-sach\dich.md` — bảng đích: các DẠNG BÀI (mã `NDB…`) của chủ đề Số nguyên, theo thứ tự bản đồ.
4. File nguồn của bạn (.txt). Cấu trúc sách: phần LÝ THUYẾT + `Phương pháp giải`; các **Dạng k.** mỗi dạng có bài `nA.` (bài mẫu — CÓ lời giải trong phần "HƯỚNG DẪN GIẢI – ĐÁP SỐ") và `nB.` (bài tương tự — chỉ có đáp số, "Tương tự nA"); cuối bài có `III. BÀI TẬP VỀ NHÀ` (đánh số 5., 6., … chỉ có đáp số). Dấu `[[b]]…[[/b]]` là chữ đậm, `[[mau:…]]` là màu (bỏ). Công thức dạng `$\left( -23 \right)+15$` — **chuẩn hoá** theo k6.md: bỏ `\left` `\right`, viết `(-23)+15`; dấu nhân là DẤU CHẤM `.` (CẤM `\cdot`, `\times`); `\dfrac`; số viết liền; chữ Việt trong công thức bọc `\text{}`.

## Phân loại từng bài (`vai`)
- Bài `nA.` (có lời giải mẫu trong sách) ⇒ `"vai": "giang"` (**kho TRÊN LỚP**, bài giảng).
- Bài `nB.` và mọi bài trong **BÀI TẬP VỀ NHÀ** / **Ôn tập chương** đánh số thường ⇒ `"vai": "luyen"` (**kho VỀ NHÀ**, câu luyện).
- Phần lý thuyết (ví dụ nhỏ trong khung lý thuyết, nếu có) KHÔNG nhập.

## Tách ý
Theo luật Đại (Thùy 21/09): bài nhiều ý a), b), c)… **chỉ tách** khi mỗi ý có dữ kiện RIÊNG, độc lập (tính từng biểu thức, tìm x từng dòng…) ⇒ mỗi ý một câu, `noi_dung = lead + ý` (lead = câu dẫn chung của bài). **Giữ nguyên cả bài** khi: lời văn / thực tế nhiều ý chung dữ kiện · ý sau dùng kết quả ý trước · chứng minh · bảng số · bài có sơ đồ/trục số. `id` mỗi câu: `<tệp>-<nhãn>` ví dụ `B2-1A-a`, `B2-1B-a`, `ÔT-5`.

## Dạng bài (`dang_bai`)
Chọn mã `NDB…` trong `dich.md` theo KIỂU BÀI (đề cho gì, hỏi gì, giải bằng cách nào) đối chiếu mô tả dạng — không theo từ khoá. Luật **DẠNG SAU THẮNG**: câu hợp 2 dạng ⇒ lấy dạng đứng SAU trong `dich.md`. `dang_bai_chac`: `"cao"` (đúng một dạng rõ) | `"vua"` (còn nghi). Không dạng nào khớp ⇒ `"dang_bai": null`, `dang_bai_ly_do` ghi bản đồ thiếu dạng gì. Thà để trống còn hơn gán sai.

## Mỗi câu (JSON)
```json
{ "id": "B2-1A-a", "vai": "giang|luyen", "dang_bai": "NDB01298", "dang_bai_chac": "cao",
  "dang_bai_ly_do": "ngắn ≤ 20 từ", "loai_cau": "tu_luan|trac_nghiem|tra_loi_ngan",
  "noi_dung": "…", "lua_chon": ["A…","B…","C…","D…"] /* chỉ trắc nghiệm */, "dap_an": "…",
  "loi_giai": "**Phần 1. Hướng dẫn**\n…\n\n**Phần 2. Trình bày**\n…",
  "kiem": ["js biểu thức trả về true"], "sach_dap_so": "đáp số in trong sách (nếu có)", "ghi_chu": "" }
```
- `dap_an`: trắc nghiệm = MỘT chữ cái; trả lời ngắn = giá trị ≤ 4 ký tự (không bọc `$`); tự luận = `—` (nhiều đáp số / tập hợp / chứng minh). Đáp số nhiều ý khác nhau ⇒ tự luận.
- **`loi_giai`**: khuôn khối 6 hai phần (Phần 1 = 3–6 bước nghĩ, KHÔNG nêu đáp số cuối; Phần 2 = lời giải ngắn kết bằng "Vậy …", trắc nghiệm kết "Chọn X."). Bài `A` có lời giải trong sách: viết LẠI theo khuôn (không chép nguyên văn), đúng kiến thức khối 6.
- Bài `B`/VN chỉ có đáp số: tự giải, **đáp số của bạn phải khớp `sach_dap_so`**; lệch ⇒ kiểm lại bằng máy; vẫn lệch ⇒ ghi `ghi_chu: "LỆCH SÁCH — …"` (nói rõ vì sao bạn tin kết quả của mình) và giữ kết quả đúng. Bài sách in sai đề/đáp số: ghi `ghi_chu` rõ, giải theo hướng đúng.
- `kiem`: mảng chuỗi JavaScript, mỗi chuỗi tính lại đáp số cuối **từ dữ kiện đề** và trả `true` (vét cạn / `BigInt` nếu cần). Bài chứng minh/giải thích: kiểm ví dụ số cụ thể.

## Phạm vi kiến thức (CỨNG)
SGK KNTT 6 Chương I–III: số nguyên, trục số, số đối, so sánh, cộng/trừ/nhân/chia hết số nguyên, quy tắc dấu ngoặc, giao hoán/kết hợp/phân phối, luỹ thừa số mũ tự nhiên (cơ số âm: viết `(-2)^3` rõ ngoặc), ước/bội của số nguyên, tìm thành phần chưa biết, tích bằng 0. **CẤM:** giá trị tuyệt đối `|x|` · chuyển vế đổi dấu · phân số âm/số hữu tỉ · `(a^m)^n` làm quy tắc (viết "tích của n thừa số") · công thức đếm ước · tổng dãy bằng công thức có sẵn (tự lập luận) · số đo góc. Bài sách dùng kiến thức ngoài ⇒ đừng bỏ: giải bằng cách trong phạm vi nếu được, không được thì `ghi_chu: "NGOÀI PHẠM VI — …"` và `dang_bai_chac: "vua"`.

## Kết quả
Ghi `Repo\kho-rules\dai\lo\k6\so-nguyen-sach\<ten-tep>.json` (mảng JSON các câu, thứ tự như sách) với `<ten-tep>` = `b1` · `b2` · `b3` · `b4` · `b5` · `ot` (Bài 1…5, Ôn tập). Sinh file bằng một script Node nhỏ ở scratchpad (tránh lỗi thoát `\` khi viết tay JSON), tự đọc lại và chạy: JSON hợp lệ · mọi `kiem` ra `true` · không có `\cdot`/`\times`/`\left`/`\right`/`|` giá trị tuyệt đối · số `$` chẵn · mã `NDB…` có trong `dich.md` · đủ `loi_giai` hai phần.

## Báo cáo cuối (≤ 12 dòng)
Số bài (A / B / VN) · số câu `giang` / `luyen` · bao nhiêu câu dạng cao / vừa / để trống (kèm bản đồ thiếu gì) · danh sách `LỆCH SÁCH` / `NGOÀI PHẠM VI` · điều bạn nghi.
