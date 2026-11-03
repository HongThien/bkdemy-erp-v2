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
