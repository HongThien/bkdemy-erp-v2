# Brief trạm SOÁT — lý thuyết (nhóm) + ví dụ (dạng bài) bản đồ mới K6 (Thùy 14/10)

> `<N>` = số gói (1–8). Gói: `C:\Users\WBPC\bk-kho-lam-viec\ban-do-moi-k6\goi\goi-<N>.json` · bản soạn: `…\ban-do-moi-k6\out\out-<N>.json` · biên bản: `…\ban-do-moi-k6\out\soat-<N>.md`.
> Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`. Trạm soát chạy model KHÁC trạm soạn (Opus soát bản Sonnet) — README §2b: người làm ≠ người kiểm. Luật soạn: `brief-soan.md` cùng thư mục.

---

Bạn là trạm SOÁT. Nội dung đã soạn sẽ GHI THẲNG vào bản đồ kiến thức mà giáo viên và học sinh đọc, nên sai một dòng toán là sai trước mặt học sinh. KHÔNG ghi DB, KHÔNG commit.

## Việc phải làm

1. Đọc `Repo\kho-rules\dai\k6.md` (luật khối 6: §1 whitelist kiến thức, §2 khuôn lời giải theo nhóm, §3 định dạng) và `brief-soan.md`.
2. Mở gói + bản soạn. Với **TỪNG ví dụ** trong `vi_du` và **TỪNG khối** trong `ly_thuyet`:
   - **Toán đúng?** Tự giải lại ví dụ từ ĐỀ (không nhìn lời giải trước), tính bằng `node -e` (BigInt cho số lớn, vét cạn cho ước/bội/tìm $x$/số nguyên tố/chia có dư). So đáp số và TỪNG dòng biến đổi.
     Lý thuyết: từng công thức / điều kiện / phát biểu có đúng và đủ điều kiện không (hay gặp sai: thiếu "khác 0", "lớn nhất/nhỏ nhất", $n\in\mathbb{N}^*$, nhầm ƯCLN ↔ BCNN, nhầm "chia hết" ↔ "chia dư").
   - **Đúng dạng?** Đề khớp `mo_ta` của dạng bài và không thuộc dạng anh em cùng nhóm (đọc danh sách dạng).
   - **Đúng kiến thức lớp 6?** k6.md §1: không chuyển vế / đổi dấu · không $(a^m)^n$, $(ab)^n$ như quy tắc có sẵn · không hằng đẳng thức · không đồng dư · không dấu hiệu chia hết 4, 8, 11, 25.
   - **Đúng khuôn?** Lời giải theo k6.md §2 cho nhóm đó (Tìm $x$ theo cột; tính biểu thức mỗi dòng một bước; thực tế: gọi ẩn + điều kiện → ƯC → ƯCLN → kết luận).
   - **Đúng định dạng?** Dấu nhân là dấu chấm, `\text{Ư}`, `\vdots`…; không `\cdot` / `\times`.
   - **Đề không mơ hồ?** Đủ dữ kiện, một đáp số rõ; không trùng nguyên văn một ví dụ khác trong cùng nhóm.
3. **Sửa THẲNG** vào `out-<N>.json` những lỗi bạn CHẮC CHẮN (trước khi sửa lần đầu, chép bản gốc sang `out-<N>.goc.json`). Ví dụ sai không cứu được ⇒ thay bằng ví dụ đúng (cùng dạng, cùng độ khó).
   Chỗ không chắc (mô tả dạng mâu thuẫn tên, kết quả cần kiến thức ngoài lớp 6, hai cách hiểu) ⇒ GIỮ nội dung an toàn nhất và ghi vào `ghi_chu` của out kèm mã dạng/nhóm.
4. Chạy cổng tới khi "✔ đạt cổng":
   `node kho-rules/dai/lo/k6/ban-do-moi/kiem-goi.mjs "<goi-N.json>" "<out-N.json>"`
5. Ghi biên bản `soat-<N>.md`: dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`; số ví dụ + số khối lý thuyết đã soát; **bảng chỗ đã sửa**
   `| Mã (NDB/NNB) | Loại lỗi (toán / dạng / kiến thức / khuôn / định dạng / đề mơ hồ) | Sửa gì | Vì sao |`; danh sách `ghi_chu` còn lại gửi CEO.

## Trả lời cuối

Vài dòng: kết luận · số ví dụ / khối LT phải sửa theo loại lỗi · các điểm còn nghi.

## Bẫy đã cắn thật

- Ứng viên cũ trong gói là câu "đã duyệt" nhưng có rác / lời giải dùng chuyển vế, $(a^m)^n$, hoặc đáp số sai. Đừng tin vì "đã duyệt".
- Ví dụ dạng "Tìm $x$ thoả điều kiện ƯC / BC": kiểm lại điều kiện khoảng ($x>…$, $x<…$) và tập nghiệm đủ.
- Bài thực tế "có dữ kiện thừa/thiếu": phải trừ/cộng phần dư TRƯỚC khi lấy ƯC/BC, và kiểm số tìm được phải lớn hơn số dư.
- "Tìm số tự nhiên nhỏ nhất chia $a$ dư $m$, chia $b$ dư $n$": kiểm kĩ cách đưa về BCNN (thêm/bớt cùng một số vào mỗi số dư) và điều kiện số dư nhỏ hơn số chia.
