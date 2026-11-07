# Brief — SOÁT lời giải chuỗi Hình–Luyện K7 "Tam giác bằng nhau" (MH.126 · 130 · 131 · 132 · 133)

Repo = `C:\Users\WBPC\Desktop\BKERP\bkdemy-erp-v2`; thư mục việc = `Repo\kho-rules\hinh\k7-tgbn-mohinh\`. Trạm soạn (Sonnet) đã viết `lg-<…>.json` theo `brief.md` — **đọc HẾT `brief.md` trước** (kiến thức lớp 7 được dùng/cấm, cách viết, định dạng).
Bạn là trạm SOÁT (Opus), người kiểm ≠ người soạn. Mỗi lời giải sai một bước là lỗi nặng: học sinh lớp 7 sẽ chép theo.

## Việc phải làm (theo thứ tự)
1. **Chép bản gốc** `lg-<…>.json` → `lg-<…>.goc.json` (để đo tỉ lệ phải sửa) TRƯỚC khi sửa gì.
2. Mở file đề `de-<…>.json` tương ứng và file lời giải. Với TỪNG bài:
   - **Giải MÙ trước**: tự nghĩ cách chứng minh bằng kiến thức whitelist (chưa nhìn lời giải), ghi chú nhanh hướng đi.
   - **Soát từng dòng** của lời giải: đúng toán · lí do trong ngoặc đúng · **đúng whitelist lớp 7** (không hình bình hành / đường trung bình / Pytago / đồng dạng / trung tuyến cạnh huyền / "đường phân giác của tam giác cân là đường cao" chưa chứng minh / chiều đảo của tính chất trung trực / toạ độ)
     · **thứ tự đỉnh hai tam giác bằng nhau khớp tương ứng** · góc/cạnh đặt đúng tên · tia nằm giữa / điểm nằm giữa có nêu cơ sở · "(theo Bk)" đúng số bài và đúng nội dung bài đó · không dùng tiền đề không có trong `tien_de` mà không tự chứng minh
     · không chứng minh lại điều tiền đề đã có · không dựa vào điều "nhìn hình thấy đúng".
   - **KIỂM BẰNG TOẠ ĐỘ** mọi khẳng định (kể cả trung gian): script `node` ở scratchpad, ≥ 3 bộ toạ độ (điểm "bất kì" thử ≥ 3 vị trí), BigInt/độ chính xác 1e-9. Đặt đúng giả thiết của RIÊNG bài đó (gốc + gia_thiet_them), không lấy giả thiết nhánh khác.
   - **Định dạng**: một mệnh đề một dòng · KHÔNG có `\n\n` · dòng ngắn (≲ 60 ký tự hiển thị — dòng dài thì tách) · mỗi mệnh đề có lí do · mọi công thức trong `$…$`, `\widehat{ABC}`, `\triangle`, `\perp`, `\parallel`, `^\circ` · không markdown · số `$` chẵn.
3. **Sửa THẲNG** vào `lg-<…>.json` những lỗi bạn CHẮC (giữ đúng mã `ma`/`so`). Bài không chứng minh nổi trong whitelist ⇒ `"loi_giai": null` + `ghi_chu` nêu vì sao. Sửa xong chạy lại kiểm toạ độ cho phần đã sửa.
4. Kiểm cuối bằng node: JSON hợp lệ · đủ số bài, đúng thứ tự · không `\n\n` · không `\\n` lộ ra · `$` chẵn · không còn từ cấm (hình bình hành, hình chữ nhật, đường trung bình, Pytago, đồng dạng, Thalès, toạ độ).
5. Ghi biên bản `Repo\kho-rules\hinh\k7-tgbn-mohinh\soat-<…>.md`: dòng đầu `KẾT LUẬN: ĐẠT` hoặc `KẾT LUẬN: CHƯA ĐẠT — <vì sao>`; số bài · số bài đúng ngay từ đầu · số bài phải sửa; bảng `| Bài | Loại lỗi (toán / lí do / kiến thức / thứ tự đỉnh / định dạng / thiếu cơ sở) | Sửa gì | Vì sao |`; danh sách bài `null`.

CẤM: ghi DB, sửa file ngoài phạm vi của bạn. Trả lời cuối ≤ 100 từ: kết luận · số bài sửa theo loại lỗi · bài `null` · số phép kiểm toạ độ và số sai.
