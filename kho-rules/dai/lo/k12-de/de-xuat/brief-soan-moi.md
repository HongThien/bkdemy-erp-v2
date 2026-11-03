# Brief trạm SOẠN — lý thuyết nhóm + lý thuyết dạng + ví dụ cho bản đồ K12 MỚI (từ đề thi) — 03/11

> Thùy đã DUYỆT cây dạng (de-xuat/<CH>.json). Bước 3 của quy trình: viết mô tả lý thuyết + ví dụ cho từng nhóm/dạng, **dựa trên ĐỀ THI** (dạng đề hỏi thật thế nào) **và sách tham khảo 3 tác giả** (Từ Tâm · NBV · PNL). Bám đề thi, không bám sách.
> Trạm soạn chạy Sonnet; trạm soát chạy Opus. Repo = `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`; chạy lệnh từ Repo. `S` = `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad`.
> Khuôn, định dạng, mức chi tiết, cú pháp hình = GIỐNG HỆT `kho-rules/dai/lo/k12-hs/brief-soan.md` (mục 2, 3, 5, 6) và mẫu `kho-rules/dai/lo/k12-hs/mau.txt` — ĐỌC CẢ HAI trước. Chỉ khác những điểm dưới đây.

## Khác với brief Hàm số
1. **Cây** lấy từ `kho-rules/dai/lo/k12-de/de-xuat/<CH>.json` (chuyên đề → nhóm → dạng; mỗi dạng có `ten`, `mo_ta` = ĐÍCH). Mã khối theo mã JSON: nhóm `=== N C1.2`, dạng `=== C1.2.3`. Thứ tự: theo thứ tự cây; khối NHÓM đứng ngay trước các dạng của nhóm. Nhóm chỉ có lý thuyết chung; **không lặp** lý thuyết nhóm trong dạng.
2. **Đề thi thật** — xem câu đề đã xếp vào từng dạng: `node S\cau-dang.cjs <CH> <id_dạng> [n] [maxlen]` (chỉ XS, SDT). Ví dụ của bạn phải **cùng loại với câu đề thi thật của dạng** (cùng kiểu dữ kiện, cùng mức độ, cùng cách hỏi), không chép nguyên đề; số liệu đẹp.
3. **Sách tham khảo** nằm ở `G:\Other computers\My Computer\BK ACADEMY\Tài liệu tham khảo\K12\` (thư mục `TOAN 12 NBV NEW FULL`, `TOAN 12 - TOAN TU TAM`, `TOAN 12 PNL - 2026`; chỉ đọc, đừng giải nén `.rar` vào Repo — giải nén vào thư mục riêng dưới `S\sach\` nếu bắt buộc). Chuyển Word sang chữ: `node scripts/docx-doc.mjs "<file.docx>" --out S\sach\<tên>.md`. Lấy kiến thức/lý thuyết SGK, cách trình bày, ý ví dụ; **tự giải lại đầy đủ**, đừng chép lỗi của sách (phát hiện lỗi thì ghi vào GHI CHÚ). Chỉ cần đọc phần của chương mình.
4. **Hình/bảng:** hình dựng bằng `[[HINH {json}]]` (`kho-rules/dai/lo/k12-hs/ve.mjs`: chỉ có `dothi` và `bbt`). Với bảng số liệu (bảng tần số ghép nhóm, bảng hai chiều, sơ đồ cây): viết **bảng ngay trong đề** bằng KaTeX `$\begin{array}{|c|c|…|} \hline … \end{array}$` (một đoạn trong `$…$`, không dòng trống) hoặc kể bằng chữ; máy kiểm vẽ thử KaTeX nên phải dựng được. Sơ đồ cây: mô tả bằng chữ (“Nhánh 1: …”) — đừng cố vẽ.
5. **Máy kiểm khuôn:** `node kho-rules/dai/lo/k12-de/de-xuat/kiem-moi.mjs <CH> <tệp ra.txt> [<danh sách mã giao>]` tới lỗi 0 (`⚠` phải giải quyết hoặc giải thích).
6. **Thử lại bằng máy (bắt buộc):** mọi ví dụ phải được tính lại bằng script node (không có Python) trước khi ghi — tính xác suất bằng phân số chính xác (hoặc số thực), phương sai/tứ phân vị từ bảng, đối chiếu đáp số. Ghi script ở `S\soan\<CH>\`.
7. Tệp ra: `kho-rules/dai/lo/k12-de/de-xuat/noi-dung/<CH>.txt` (tạo thư mục nếu chưa có) bằng công cụ Write (không heredoc). KHÔNG ghi DB, KHÔNG sửa tệp khác.
8. **Mức độ:** ví dụ 1 cơ bản đúng dạng; ví dụ 2 khó hơn một bậc. Dạng `hiem:true` vẫn đủ 2 ví dụ. Đầu ra là TỰ LUẬN (không 4 phương án), trừ khi dạng là "chọn mệnh đề đúng" thì hỏi từng ý a), b)…
9. Phạm vi kiến thức: Toán 12 CT 2018 của chương; không dùng kiến thức ngoài chương.

## Cuối tệp
`## GHI CHÚ CHO CEO`: dạng mô tả mơ hồ / bạn phải tự hiểu; nguồn (sách/đề) có lỗi; chỗ ít chắc. Không có thì ghi "Không".

## Trả lời cuối (≤ 120 từ)
Số nhóm · số dạng · số ví dụ · số hình/bảng · máy kiểm lỗi 0 chưa · đã thử bằng số chưa · các điểm GHI CHÚ CHO CEO (mỗi điểm một dòng ngắn).

## BỔ SUNG (03/11, sau bản thử XS/SDT) — ĐỌC KỸ
A. **Bám ĐỀ THI, không thêm kiến thức đề không hỏi.** Mỗi ý trong lý thuyết dạng phải phục vụ một kiểu câu đề thi THẬT của dạng (xem câu đề bằng `node S\cau-dang.cjs <CH> <id_dạng> 8`; HS/VT đã có `HS-cau.tsv`/`VT-cau.tsv`). Sách có mà đề không hỏi → KHÔNG đưa. Thùy: "không đề nào hỏi thì lấy ở đâu ra".
B. **BẮT BUỘC đọc sách tham khảo** của phần mình (bản thử SDT bỏ qua mục này và bị trả lại): tìm đúng chương/bài trong 3 bộ ở `G:\…\K12\` (NBV NEW FULL, Từ Tâm, PNL), chuyển bằng `scripts/docx-doc.mjs`, lấy kiến thức SGK + cách giải; cuối tệp, mục GHI CHÚ, ghi rõ ĐÃ đọc những file nào. Với Hàm số, văn bản sách đã trích sẵn: `S\txt\nbv\`, `S\txt\tutam\`, `S\txt\pnl\` (đọc bản `_GV` của PNL) và hồ sơ `kho-rules/dai/lo/k12-hs/ho-so/` — dùng trước, khỏi trích lại.
C. **Tái dùng nội dung Hàm số đã duyệt (chỉ HS):** bản v1 đã soát nằm ở `kho-rules/dai/lo/k12-hs/ra/J*.txt` (khối mã H…); mỗi dạng mới có trường `tu` (mã thực đơn P…) → tra `kho-rules/dai/lo/k12-hs/cau-truc.mjs` (trường `cu`) ra mã H… cũ → grep `=== H…` trong `ra/J*.txt`. Có thì lấy làm gốc, viết lại cho ĐÚNG dạng MỚI (mô tả mới, đề thi mới hay hỏi); vẫn phải tự thử lại bằng số mọi ví dụ. Dạng mới tách/gộp từ nhiều dạng cũ thì tổng hợp, không dán nối.
D. **Ranh giới VT / PP toạ độ (Thùy chốt):** chương VT chỉ thao tác quanh vectơ (không phương trình mặt phẳng/đường thẳng/mặt cầu). Dạng C4.3.2 (radar, vùng phủ sóng, định vị) chỉ gồm phần khoảng cách/toạ độ giữa các vật; bài cần phương trình mặt cầu/mặt phẳng/đường thẳng (vùng phủ sóng hình cầu cắt đường bay, GPS giải hệ khoảng cách, mặt phẳng chắn sóng) thuộc chương PP toạ độ, KHÔNG đưa vào VT.
E. **Hình:** Hàm số/hình khối cần hình thì dùng `[[HINH {…}]]` như brief-soan.md mục 3 (dạng nhận dạng đồ thị/BBT bắt buộc có hình). Hình khối không vẽ được → mô tả đủ bằng lời (tên đỉnh, độ dài, góc) để làm được không cần hình.
F. **Khuôn chung toàn chương:** các tệp con của chương sẽ ghép lại theo thứ tự cây; vì vậy mỗi tệp CHỈ chứa các khối của phần mình (nhóm trước dạng của nhóm), không lặp, không lệch mã. Tệp ra của lượt: `noi-dung/<CH>-<JOB>.txt`; chạy `kiem-moi.mjs <CH> <tệp> <danh sách mã giao>`.
G. **Lý thuyết dạng không lặp lý thuyết nhóm; ví dụ 2 khó hơn ví dụ 1 một bậc; số liệu không tạo ca suy biến/biên không chủ ý** (bài học bản thử: trạm soát bắt 31 chỗ).

H. **Đồ thị tỉ lệ 1:1 (Thùy 03/11):** đơn vị hai trục phải bằng nhau — xem mục "LUẬT ĐỒ THỊ" trong `brief-soat-moi.md` và đầu `kho-rules/dai/lo/k12-hs/ve.mjs`. Máy kiểm báo lỗi nếu khoảng quá rộng.
