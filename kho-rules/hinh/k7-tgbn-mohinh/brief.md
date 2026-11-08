# Brief — soạn LỜI GIẢI cho chuỗi bài Hình–Luyện KHỐI 7 "Tam giác bằng nhau" (5 mô hình MH.126 · 130 · 131 · 132 · 133)

Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Thư mục việc = `Repo\kho-rules\hinh\k7-tgbn-mohinh\`. Chuỗi bài dựng 07/11 từ các mô hình cũ MH.061–064 (script `scripts/kho/hl-chuoi-k7-tam-giac.mjs`);
hình từng giả thiết đã vẽ (`scripts/anh/ve_hinh_k7_tam_giac.mjs`) — bạn KHÔNG vẽ hình, chỉ viết lời giải. Mẫu lời giải chuỗi Hình–Luyện đã duyệt: `kho-rules/hinh/MH073/lg-1.json` (Hình 8) — lấy nhịp, KHÔNG lấy kiến thức lớp 8.

Đầu vào: file `de-<…>.json` được giao — mảng bài: `ma`, `so` (B1…), `gia_thiet_goc` (giả thiết của mô hình), `gia_thiet_them` (các giả thiết thêm theo nhánh, từ gốc xuống), `cau_hoi` (điều phải chứng minh),
`tien_de` (các bài ĐÃ chứng minh trong cùng chuỗi — được dùng kết quả).
**Đề đầy đủ của bài** = gia_thiet_goc + từng dòng gia_thiet_them + cau_hoi. Giả thiết của bài KHÔNG gồm giả thiết của nhánh khác.

## Kiến thức được dùng — LỚP 7, tới hết bài "Tam giác cân. Đường trung trực của đoạn thẳng" (CHƯA học hình bình hành, đường trung bình, Pytago, đồng dạng)
- Lớp 6 + tiểu học. Góc: hai góc kề bù, đối đỉnh, tia phân giác (tia nằm giữa hai cạnh + hai góc bằng nhau), tổng ba góc của tam giác, góc ngoài của tam giác.
- Song song: dấu hiệu nhận biết (so le trong / đồng vị bằng nhau ⇒ song song) và tính chất (song song ⇒ so le trong / đồng vị bằng nhau); **tiên đề Euclid** và hệ quả (từ một điểm ngoài đường thẳng chỉ có một đường thẳng song song với nó;
  hai đường thẳng phân biệt cùng song song / cùng vuông góc với đường thứ ba thì song song nhau; đường thẳng vuông góc với một trong hai đường thẳng song song thì vuông góc với đường kia).
- Tam giác bằng nhau: **c.c.c, c.g.c, g.c.g**; tam giác vuông: **(cgv - cgv), (cgv - gn), (ch - gn), (ch - cgv)** — viết tắt đúng như vậy. Hai tam giác bằng nhau ⇒ các cạnh, góc tương ứng bằng nhau.
- Tam giác cân / đều / vuông cân: định nghĩa, tính chất hai góc đáy bằng nhau, dấu hiệu nhận biết.
- Đường trung trực của đoạn thẳng: **định nghĩa** (đường thẳng vuông góc với đoạn thẳng tại trung điểm); tính chất "điểm nằm trên đường trung trực thì cách đều hai mút". **Muốn chứng minh một đường là trung trực ⇒ dùng ĐỊNH NGHĨA** (vuông góc + qua trung điểm); KHÔNG dùng chiều đảo.
- **CẤM** (kể cả dùng ngầm, không gọi tên): hình bình hành, hình chữ nhật, hình thoi, hình thang; **đường trung bình của tam giác**; định lí Pytago; tam giác đồng dạng; Thalès; lượng giác; "trung tuyến ứng với cạnh huyền bằng nửa cạnh huyền";
  "trong tam giác cân đường phân giác = đường cao = trung tuyến = trung trực" (muốn dùng phải tự chứng minh ngay bằng tam giác bằng nhau); toạ độ.
  Cần một kết quả chưa học ⇒ **tự chứng minh ngay trong lời giải** bằng cái đã học (vd "đối xứng qua trung điểm" ⇒ hai tam giác bằng nhau c.g.c rồi so le trong). Không làm nổi ⇒ `"loi_giai": null` + giải thích ở `ghi_chu` (đừng bịa).

## Cách viết (máy ghi DB rất chặt)
- **Mỗi mệnh đề MỘT dòng; xuống dòng bằng ĐÚNG MỘT ký tự `\n`. TUYỆT ĐỐI KHÔNG có dòng trống (`\n\n`).** Không đánh số bước, không tiêu đề, không markdown (`**`, `#`, `-`), không chữ nghiêng `*…*`.
- **Dòng ngắn** (CEO 27/10): một dòng ≲ 60 ký tự hiển thị; khẳng định dài tách nhiều dòng ("Vì … (gt)" xuống dòng "nên … (lí do)"). Khối "Xét $\triangle ABD$ và $\triangle EBD$ có:" — mỗi điều kiện MỘT dòng, kết "Do đó $\triangle ABD=\triangle EBD$ (c.g.c)." (hoặc (c.c.c), (g.c.g), (ch - gn)…).
- **Mọi mệnh đề có lí do trong ngoặc** (đúng tên, theo whitelist): dữ kiện đề cho → **(gt)**; kết quả bài tiền đề → **(theo B3)** (đúng số `so` của bài đó); kết quả vừa chứng minh ngay trong bài này → **(cmt)**;
  định nghĩa/tính chất → ghi tên: (hai góc kề bù), (hai góc đối đỉnh), (hai góc so le trong), (hai góc đồng vị), (hai góc tương ứng), (hai cạnh tương ứng), (cạnh chung), (tia phân giác), (trung điểm), (tổng ba góc của tam giác), (tính chất tam giác cân), (dấu hiệu nhận biết tam giác cân), (định nghĩa đường trung trực)…
- Không chứng minh lại điều `tien_de` đã có — cứ dùng, ghi "(theo Bk)". Điều cần mà KHÔNG nằm trong `tien_de` ⇒ tự chứng minh ngắn gọn ngay trong lời giải.
- Ký hiệu: mọi tên điểm / đoạn / góc / biểu thức trong `$…$`; góc `$\widehat{ABC}$`; tam giác `$\triangle ABC$`; `\perp`, `\parallel`, độ `^\circ`; dấu nhân (nếu có) là dấu chấm `.`. Chữ tiếng Việt chỉ nằm NGOÀI `$…$`.
- Cần tia nằm giữa / điểm nằm giữa / thứ tự điểm trên đường thẳng thì NÊU rõ cơ sở ("(D thuộc đoạn AC)", "(tia BD nằm giữa hai tia BA, BC)").
- Chứng minh thẳng hàng: dùng hai góc kề bù cộng bằng $180^\circ$, hoặc tiên đề Euclid (hai đường cùng song song với một đường thì trùng nhau nếu cùng đi qua một điểm), hoặc hai đường thẳng cùng vuông góc… — chọn cách đúng whitelist.
- Câu "tìm / chứng minh" nhiều ý trong một bài (BT.07.126.01–02 của MH.126 có ý a, b, c): lời giải mở bằng "a) …", dòng trống KHÔNG được dùng — viết "a) …" rồi các dòng tiếp, tới "b) …" xuống dòng thường.

## KIỂM bằng toạ độ (bắt buộc — không verify là chưa xong)
Trước khi viết mỗi lời giải, dựng toạ độ số thoả giả thiết (≥ 2 bộ khác nhau; điểm "bất kì" thử ≥ 3 vị trí) bằng script `node` đặt ở scratchpad (tạo bằng công cụ Write, KHÔNG heredoc có LaTeX):
kiểm điều phải chứng minh VÀ từng khẳng định trung gian bạn viết (bằng nhau, song song, vuông góc, thẳng hàng, tương ứng đỉnh khi viết hai tam giác bằng nhau — thứ tự đỉnh PHẢI khớp tương ứng, góc đặt đúng tên).
Phát hiện đề SAI / thiếu điều kiện (không đúng với mọi hình hợp giả thiết) ⇒ `"loi_giai": null` + `ghi_chu`.

## Đầu ra
Ghi file JSON được giao (`lg-<…>.json`) vào thư mục việc bằng công cụ Write: mảng `[{ "ma": "BT.07.126.03", "so": "B3", "loi_giai": "…", "ghi_chu": "" }]`, ĐỦ số bài, đúng thứ tự file đề.
Trong chuỗi JSON nhớ `\\` cho lệnh LaTeX (vd `"$\\widehat{ABC}$"`, `"$\\triangle ABC$"`) và `\n` cho xuống dòng. Sau khi ghi, tự kiểm bằng node: JSON hợp lệ · không có `\n\n` · không có `\\n` lộ ra · mỗi `$` chẵn.
CẤM đọc/sửa file ngoài `brief.md`, các file `de-*.json` và file đầu ra của mình (và script tạm ở scratchpad); cấm ghi DB. Trả lời cuối ≤ 120 từ: số bài đã giải · bài nào `null` · đã chạy verify chưa (bao nhiêu phép, sai bao nhiêu).
