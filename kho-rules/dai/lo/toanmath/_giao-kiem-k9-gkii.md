# GIAO VIỆC TRẠM KIỂM (Opus, ngữ cảnh sạch) — Toán 9 GIỮA KÌ II. Biến: <B> = batch (vd B056), <MA> = mã đề (vd B056-09).

Kiểm đề `<MA>` đã do trạm soạn Sonnet soạn (spec §A13, §C5).

## ĐỌC LUẬT ĐỦ MỘT LẦN
`C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\<B>\brief-soat.md` (~1.600 dòng; Read nhiều lượt tới hết). Mã luật hiện hành `d6889bbc6d49` — tệp soạn mang mã khác ⇒ CHƯA ĐẠT. Mục "Giữa kì II" trong mục Khối 9 là luật đã duyệt từ lô mẫu: soát theo đó.

## TỆP
- soạn `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2\kho-rules\dai\lo\toanmath\batch\<B>\<MA>.soan.md` (đề cương chia khúc: `<MA>.k<N>.soan.md`, kiểm từng khúc, biên bản `.k<N>.kiem.md/.k<N>.soat.md`);
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<B>\<MA>` (ảnh trang `trang\p-N.png`, hình `img\`, script của trạm soạn `tam\`);
- bản đồ K9: `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\_ban-do-k9\`.

## QUY TRÌNH — THỨ TỰ BẮT BUỘC
1. **Pha 0 — đối chiếu đề**: mở ảnh trang gốc; bản soạn không sót bài/ý/phương án, chép đúng từng số, ký hiệu, đơn vị.
2. **Pha 1 — GIẢI MÙ TRƯỚC khi mở lời giải trong tệp soạn**: giải từ ảnh MỌI câu chứng minh / Hình / tự luận lời văn / trả lời ngắn không có nhân chứng máy / đề không có đáp án in, MỌI câu treo `**Chưa chắc:**` hoặc ghi đề sai, cộng ≥ 15% (làm tròn lên) các câu còn lại do bạn bốc ngẫu nhiên (ghi seed). Đề có đáp án in kèm: đáp án in là nhân chứng sau khi tự giải. Dùng script tính độc lập (Write vào `<LV>\tam\kiem-opus-*.mjs`, không heredoc/node -e chứa `\`); ghi bảng đáp án mù riêng. Chỉ SAU ĐÓ mở tệp soạn. **Đề SCAN không có đáp án in ⇒ 100% câu thuộc giải mù.**
3. **Pha 2 — soát**: so đáp số; soát từng câu theo loại lỗi: chép đề · đáp số · lập luận (vòng tròn, thiếu "nằm giữa") · phạm vi kiến thức (cấm: dấu hiệu nhận biết tứ giác nội tiếp, góc tạo bởi tiếp tuyến và dây, định lí sin/côsin, đường trung bình, Cô-si dùng thẳng… — theo mục Khối 9 + mục "Giữa kì II") · định dạng (card Phần 1 3–6 bước không lộ đáp số; Phần 2 các dòng liền; LaTeX `\cdot` `\dfrac`; sơ đồ tư duy cho ý chứng minh Hình; MỘT dòng `**Ghi chú:**` mỗi câu) · phân loại (loại câu, kho, `dang=`/`chac=`, nhãn THIẾU DẠNG đúng, dạng sau thắng) · hình (nhãn nguon=…, mở ảnh từng hình đề và giải: đúng dữ kiện, không lộ đáp án, nhãn không đè nét). Lệch đáp số ⇒ tính lại bằng máy để biết ai sai. Đề Hình không nói "nhọn": thử toạ độ cả cấu hình tù; hình suy biến ⇒ thêm "nhọn" vào đề + Ghi chú (luật giữa kì II).
4. **SAO BẢN GỐC `<MA>.soan.goc.md` TRƯỚC khi sửa bất kì chữ nào.** Chỉ sửa thẳng lỗi CHẮC CHẮN; chỗ không chắc ⇒ giữ + `**Chưa chắc:**`. Cờ `**Chưa chắc:**` đã kiểm chắc ⇒ xoá, ghi biên bản. Sửa liên quan ĐÁP SỐ ghi riêng.
5. **Cổng** (ở `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`, tới "✔ đạt cổng"): `node scripts/kho/de-thi/dung-de-tu-soan.mjs kho-rules/dai/lo/toanmath/batch/<B>/<MA>.soan.md --lam-viec "C:/Users/WBPC/bk-kho-lam-viec/de-thi/toanmath/<B>/<MA>" --khoi 9 --chi-kiem`
6. **Biên bản** vào `kho-rules/dai/lo/toanmath/batch/<B>/`: `<MA>.kiem.md` (câu giải mù, đáp án mù vs soạn, khớp/lệch, seed mẫu 15%) và `<MA>.soat.md` (DÒNG ĐẦU đúng `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`; bảng lỗi theo loại + số câu sửa mỗi loại; số khớp/lệch với đáp án in; cờ đã xoá/thêm; chỗ luật Khối 9 / giữa kì II chưa phủ mà trạm soạn phải chọn quy ước — đồng ý hay nên đổi). Không viết "đã kiểm tra kỹ" chung chung.

## KỶ LUẬT
Chỉ ghi các tệp trên (+ sửa tệp soạn SAU khi sao gốc, script/hình trong `<LV>`). KHÔNG ghi DB, KHÔNG git, KHÔNG xoá tệp, KHÔNG sửa spec/brief/tool. Không tin báo cáo của trạm soạn.

## BÁO CÁO CUỐI (≤ 20 dòng)
KẾT LUẬN · số câu giải mù / tổng · số khớp / lệch · số câu sửa theo loại (có sửa ĐÁP SỐ không) · cổng đạt chưa (dán dòng cuối) · chỗ luật nên ghi thêm · hình mới vẽ lại cần đẩy kho.
