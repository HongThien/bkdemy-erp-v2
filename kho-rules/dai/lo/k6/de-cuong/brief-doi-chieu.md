# Brief trạm ĐỐI CHIẾU ĐỀ — đề cương Toán 6 GKI Hà Nội (20/10)

> `<MA>` = `TC-GKI-2026` | `CBQ-GKI-2026` | `NQ-GKI-2026` | `NTH-GKI-2026` | `GV2-GKI-2026`. `<LV>` = `C:\Users\WBPC\bk-kho-lam-viec\de-cuong\K6\<MA>`. Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`.
> Trạm này chạy Opus; người gõ là Sonnet (`brief-go-de.md`). Người làm ≠ người kiểm.

Bạn kiểm xem tệp `Repo\kho-rules\dai\lo\k6\de-cuong\<MA>.build.mjs` đã gõ ĐÚNG ĐỀ trong ảnh chưa — **trước khi** có ai soạn lời giải. KHÔNG ghi DB, KHÔNG commit, KHÔNG xoá tệp.

## Việc

1. Đọc `brief-go-de.md` (luật gõ) rồi mở HẾT ảnh `<LV>\anh\t-*.png` bằng công cụ Read (phóng to chỗ mờ bằng `pdftoppm -r 260 … "<LV>\goc.pdf" "<LV>\z\…"`). **Lớp chữ PDF (nếu có) hỏng công thức — không dựa vào.**
2. TRƯỚC khi mở build.mjs, tự ghi nhanh (trong đầu / ghi chú) danh sách bài + số ý theo ảnh. Rồi mở `<MA>.build.mjs` và đối chiếu TỪNG câu: mọi chữ, số, số mũ, dấu trừ, ngoặc, ký hiệu (⋮ / : / ∈ / ⊂ / ≠ / ≤ / ≥), tập hợp, đơn vị. Thiếu ý, thừa ý, nhầm ý sang bài khác, nhầm nhãn.
3. Soát luôn:
   - **Dấu `.`** trong đề (nhân hay thập phân) và `:` (chia hay chia hết): dấu `.` đứng giữa hai số trong bài tính ⇒ dấu nhân; kiểu `1,5` mới là thập phân. Đề lẫn lộn ⇒ `CHƯA CHẮC`.
   - **Đề in lỗi / thiếu dữ kiện / không giải được**: bài nào cho dữ kiện mâu thuẫn hay thiếu (có thể tự giải thử nhanh bằng `node -e`) ⇒ thêm `canh_bao` `'CHƯA CHẮC — …'` nói rõ.
   - **Cách tách ý & nhãn**: theo luật `brief-go-de.md` §3.2–3.3. Sai ⇒ sửa. Nhớ rằng đã tách thì nhãn phải duy nhất.
   - **Trắc nghiệm**: đủ 4 phương án A–D, đúng nội dung.
   - **Hình đề** (`<LV>\img\de_*.png`): mở xem — đủ khung, đúng bài, không dính bài khác; `Đọc hình:` ghi đúng dữ kiện trên hình (số đo, ký hiệu bằng nhau, vuông góc…).
   - **Chia trạm** (`nhom`): mỗi trạm ≤ ~12 câu; bài chứng minh / nâng cao ở trạm gọn.
4. **Sửa thẳng** vào `<MA>.build.mjs` mọi lỗi bạn chắc chắn (sửa tối thiểu), rồi chạy lại từ Repo: `node kho-rules/dai/lo/k6/de-cuong/<MA>.build.mjs "<LV>"` tới khi in "✔". Chú ý: nếu số trạm đổi (ít hơn trước) thì sẽ còn tệp `<MA>.p<N>.soan.md` thừa của lần chạy trước — KHÔNG xoá, ghi vào báo cáo.
5. Ghi biên bản `Repo\kho-rules\dai\lo\k6\de-cuong\<MA>.doichieu.md`: số câu trước/sau · bảng `| Câu | Lỗi (chép số / ký hiệu / thiếu ý / tách ý / nhãn / hình / ghi chú) | Sửa gì |` · danh sách `CHƯA CHẮC` cuối cùng (nhãn + lí do) · mọi điều bạn nghi mà không quyết được.

## Trả lời cuối

Vài dòng: số câu, số lỗi theo loại, danh sách `CHƯA CHẮC`, tệp thừa (nếu có), số trạm cuối cùng.
