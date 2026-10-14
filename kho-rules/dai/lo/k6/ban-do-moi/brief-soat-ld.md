# Brief trạm SOÁT — LÝ THUYẾT CẤP DẠNG BÀI bản đồ mới K6 (Thùy 14/10, đợt 2)

> `<N>` = 1–8. Gói: `…\ban-do-moi-k6\goi-ld\goi-<N>.json` · bản soạn: `…\ban-do-moi-k6\out-ld\out-<N>.json` · biên bản: `…\out-ld\soat-<N>.md`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm soát chạy Opus (khác trạm soạn Sonnet). Luật soạn: `brief-soan-ld.md` cùng thư mục. KHÔNG ghi DB, KHÔNG commit.

---

Nội dung sẽ ghi THẲNG vào trường lý thuyết của từng dạng bài mà giáo viên và học sinh đọc.

1. Đọc `Repo\kho-rules\dai\k6.md` (§1 whitelist, §3 định dạng) và `brief-soan-ld.md`.
2. Với TỪNG dạng trong `ly_thuyet_dang` soát:
   - **Toán đúng & đủ điều kiện?** Từng quy tắc / tính chất / công thức / bước phương pháp: có đúng cho MỌI đề của dạng không (thử phản ví dụ bằng `node -e`: vét cạn / số nhỏ), có thiếu điều kiện ("khác 0", "lớn nhất", $n\in\mathbb{N}^*$, số dư < số chia…), nhầm ƯCLN↔BCNN, "chia hết"↔"chia dư".
   - **Khớp ví dụ?** Phương pháp phải trùng cách giải trong `vi_du_hien_co` của dạng; nếu ví dụ giải theo cách khác ⇒ sửa lý thuyết CHO KHỚP (hoặc ghi `ghi_chu` nếu ví dụ mới sai).
   - **Đúng dạng, không lặp nhóm?** Không chép nguyên lý thuyết nhóm; không trượt sang dạng anh em; có dấu hiệu nhận biết riêng.
   - **Kiến thức lớp 6?** k6.md §1: không chuyển vế, không $(a^m)^n$, không hằng đẳng thức, không đồng dư, không dấu hiệu chia hết cho 4/8/11/25.
   - **Định dạng:** dấu chấm nhân, `\text{Ư}`…, không `##VD`; `##PP` mỗi dòng một bước.
3. **Sửa THẲNG** vào `out-<N>.json` chỗ CHẮC CHẮN (trước khi sửa lần đầu chép bản gốc sang `out-<N>.goc.json`). Chỗ không chắc ⇒ giữ nội dung an toàn nhất + `ghi_chu`.
4. Chạy cổng tới khi "✔ đạt cổng": `node kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs "<goi>" "<out>"`.
5. Biên bản `soat-<N>.md`: dòng đầu `KẾT LUẬN: ĐẠT` / `CHƯA ĐẠT — …`; số dạng đã soát; bảng `| NDB | loại lỗi (toán / thiếu điều kiện / không khớp ví dụ / lặp nhóm / kiến thức / định dạng) | sửa gì | vì sao |`; điểm còn nghi gửi CEO.

Trả lời cuối: kết luận · số dạng phải sửa theo loại lỗi · điểm còn nghi.
