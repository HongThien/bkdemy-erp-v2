# Brief — RÀ SOÁT clone DeepSeek trong chuyên đề "Các bài toán nâng cao liên quan đến số tự nhiên" (K6)

Thùy 29/10: các câu CLONE (sinh từ câu gốc bằng DeepSeek) trong chuyên đề này giải sai khá nhiều (ví dụ dạng 5.3: 10/10 clone sai — sao y lời giải gốc, đổi đề làm hỏng lập luận, đáp số sai). Việc của bạn: soát MỘT dạng bài (một file `d3xx.json` / `d232.json`), sửa mọi clone sai — **sửa lời giải; nếu đề của clone vô nghiệm / nhiều nghiệm / lệch khuôn gốc thì ĐỔI ĐỀ** (viết đề mới cùng khuôn).
KHÔNG ghi DB, KHÔNG commit, KHÔNG sửa file nào ngoài file `<f>.fix.json` + `<f>.rasoat.md` của bạn. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Dữ liệu: `Repo\kho-rules\dai\lo\k6\ra-nang-cao\<f>.json` (mảng câu: dòng `parent_ma_cau = null` là câu GỐC của kho, còn lại là clone `nguon='clone'`; có `noi_dung`, `dap_an`, `loi_giai`, `loai_cau`, `lua_chon`).

## Làm
1. Đọc `Repo\kho-rules\dai\k6.md` (luật khối 6: kiến thức được dùng, định dạng — dấu nhân `.`, số mũ `^{}`, `\dfrac`).
2. Với MỖI câu (gốc rồi clone): **tự giải bằng máy trước** (`node -e` / script nhỏ với `BigInt`: tính đúng giá trị tổng/biểu thức, vét cạn nghiệm), RỒI mới so với `dap_an` và đọc `loi_giai` từng dòng. Kiểm: (a) đáp số đúng không; (b) mỗi dòng lời giải đúng toán và đúng thứ tự suy luận (clone hay sao y câu gốc: số mũ/hệ số/dấu cũ sót lại, kết luận không khớp đề); (c) đề có đúng 1 đáp án hợp lệ; (d) đáp số viết đúng dạng khuôn gốc (`$…$`, `\dfrac`); (e) phạm vi lớp 6 (không công thức tổng cấp số nhân có sẵn — lời giải dùng "nhân với cơ số rồi trừ/cộng"; không chuyển vế, không đồng dư, không `(a^m)^n` làm quy tắc).
3. Câu GỐC (`parent_ma_cau` null): chỉ BÁO nếu sai (không tự sửa, ghi vào `.rasoat.md`) — nhưng vẫn là chuẩn để so clone.
4. Clone ĐÚNG hoàn toàn ⇒ không đụng. Clone sai ⇒ viết lại (đề + `dap_an` + `loi_giai`) **cùng khuôn và cùng phong cách lời giải với gốc của nó**, mỗi đề phải có đúng 1 đáp số; cố gắng giữ ĐỀ ban đầu nếu chỉ lời giải sai; đổi đề khi đề hỏng. Đề mới nên khác nhau về cơ số/số mũ/số hạng (không trùng nhau, không trùng gốc). Giữ `loai_cau` và định dạng `dap_an` như gốc (trả lời ngắn/tự luận…).
5. Ghi `Repo\kho-rules\dai\lo\k6\ra-nang-cao\<f>.fix.json`: mảng chỉ gồm clone SỬA, mỗi phần tử `{ "ma_cau", "noi_dung", "dap_an", "loi_giai", "loai_cau", "lua_chon"(nếu có), "ly_do": "ngắn: sai ở đâu / đổi đề vì…", "kiem": ["biểu thức JS trả true — tính lại đáp số cuối từ ĐỀ MỚI độc lập với lời giải (BigInt/vét cạn)"] }` (đủ cả các trường kể cả khi chỉ đổi lời giải: chép lại nguyên noi_dung cũ). Sinh file bằng script Node ở scratchpad (tránh lỗi thoát `\`). Tự kiểm: JSON hợp lệ · mọi `kiem` ra true · số `$` chẵn · không `\cdot` `\times`.
6. Ghi `<f>.rasoat.md`: bảng `| ma_cau | đúng/sai | lỗi | sửa gì |` cho MỌI câu (gốc + clone), và danh sách câu gốc nghi sai.

## Báo cáo cuối (≤ 10 dòng)
Số câu · số clone đúng/sai/đã sửa · loại lỗi hay gặp · câu GỐC nghi sai · điều cần Thùy quyết.
