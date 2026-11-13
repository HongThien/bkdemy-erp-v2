# Brief trạm LÀM LẠI HÌNH cho đề đã soạn + soát xong (13/11)

Bối cảnh: các batch toanmath B005 · B010 · B011 · B017 · B018 · B024 đã soạn + soát ĐẠT ở MÁY NHÀ; tệp soạn (`.soan.md`) có trong git, nhưng
thư mục làm việc (ảnh hình) chỉ nằm ở máy nhà. Máy công ty đã dựng lại `goc.pdf` + `trang\p-N.png` từ PDF gốc. Việc của bạn: **làm lại đúng các
tệp hình mà tệp soạn khai**, để cổng ghi đọc được. KHÔNG sửa tệp soạn, KHÔNG ghi DB, KHÔNG commit.

Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Với mỗi `<MA>` được giao (dạng `B010-03`, batch = phần trước dấu gạch):
- Tệp soạn: `Repo\kho-rules\dai\lo\toanmath\batch\<BATCH>\<MA>.soan.md`
- `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-thi\toanmath\<BATCH>\<MA>` (có `goc.pdf`, `trang\p-*.png` 150 dpi, `img\` RỖNG, `tam\`).

## 1. Hình đề — mỗi dòng `**Hình:** <tệp>` (có thể nhiều tệp, cách nhau dấu phẩy)
- Đọc câu chứa dòng đó (đề + phương án) để biết hình nào. Mở ảnh trang `<LV>\trang\p-*.png` bằng Read, tìm hình của câu đó.
- Cắt từ PDF đúng **tên tệp đã khai** (giữ nguyên tên, đuôi `.png`):
  `pdftoppm -r 150 -png -singlefile -f <trang> -l <trang> -x <X> -y <Y> -W <rộng> -H <cao> "<LV>/goc.pdf" "<LV>/img/<tên không đuôi>"`
  (toạ độ theo ảnh 150 dpi). Mở ảnh vừa cắt kiểm: đủ hình, đủ nhãn điểm, không cụt, không dính chữ câu khác / ảnh trang trí. Sai thì cắt lại.
- Tên tệp gợi ý vị trí (`p2c41` ≈ trang 2, câu 4.1) nhưng NỘI DUNG câu mới là căn cứ.

## 2. Hình giải — mỗi dòng `**Hình giải:** <tệp>`
- Hình chỉ hiện ở LỜI GIẢI (đề không cho hình). Đọc kĩ đề + Phần 2 của câu đó: mọi điểm được nhắc trong lời giải phải có trên hình.
- Vẽ bằng code: viết `<LV>\tam\ve.mjs` (công cụ Write, không heredoc), import
  `import { P, seg, tick, angleMark, rightAngle, ray, dot, label, T, svgDoc, luu } from 'file:///C:/Users/WBPC/Desktop/BKERP/bkdemy-erp-v2/scripts/anh/ve_hinh_lib.mjs'`,
  chạy `node "<LV>/tam/ve.mjs"` với thư mục hiện hành là Repo; mỗi hình `await luu('<LV>/img', '<tên không đuôi>', w, h, svgDoc(w, h, T(dx, dy, body)))`.
  Mẫu: `Repo\scripts\anh\ve_hinh_hh101_102.mjs`.
- **Dựng đúng dữ kiện bằng toạ độ** (trung điểm, vuông góc, tiếp tuyến, giao điểm tính bằng phép tính), chọn số liệu khớp đề nếu đề cho số.
  Đánh dấu GIẢ THIẾT (góc vuông cho trước, đoạn bằng nhau cho trước); **KHÔNG đánh dấu / không vẽ sẵn điều phải chứng minh** (vd không vẽ liền đoạn thẳng
  khi đề bắt chứng minh thẳng hàng, không kí hiệu vuông góc khi đó là điều phải chứng minh). Canvas cao ≤ 450px, nhãn không đè đường, không cụt mép.
- Vẽ xong mở ảnh bằng Read kiểm; sai thì sửa.

## 2b. Đẩy hình lên kho (BẮT BUỘC, xong mới trả lời)
Chạy từ thư mục Repo: `node kho-rules/dai/lo/toanmath/anh-batch.mjs day <BATCH> <MA…>` (các MA bạn được giao). Phải in "⬆ đẩy … tệp" không có LỖI.
Hình chỉ nằm ở máy là CHƯA XONG (Thùy 13/11).

## 3. Trả lời cuối (≤ 120 từ)
Mỗi `<MA>`: số hình đề đã cắt / số hình giải đã vẽ, đủ chưa so với số dòng khai. Hình nào không tìm thấy / không chắc ⇒ nói rõ (MA + nhãn câu).
