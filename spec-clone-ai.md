# spec-clone-ai.md — Luật cho Claude khi CLONE câu đã đặt hàng trong kho (luồng 2)

> Đọc BẮT BUỘC trước khi xử lý hàng đợi clone (`scripts/hangdoi-clone.mjs`). Luồng 1 (giải bài) có spec riêng:
> `spec-giai-bai-ai.md`. Luật trình bày ở đây chép từ prompt clone đang chạy trong ERP (`buildCloneFromGocPrompt`
> + `FMT_RULES`, `src/lib/kho/api.ts`) — nguồn luật là ở đó; sửa luật thì sửa cả 2 nơi.

## 1. Luồng
1. `node scripts/hangdoi-clone.mjs --list --out scripts/_auto_clone_ds.json` → mỗi mục = 1 yêu cầu: câu gốc
   (`noi_dung`, `lua_chon`, `dap_an`, `loi_giai`), `so_bien_the` cần sinh, `ghi_chu` của người đặt, `ten_dang`,
   ≤2 `mau_tham_khao` cùng dạng đã duyệt, cờ `co_hinh` / `goc_da_xoa`, `so_da_co` (nháp đã có cho yêu cầu này).
2. Với MỖI yêu cầu: sinh đúng `so_bien_the − so_da_co` biến thể theo §2–§3, tự kiểm §4.
3. Viết `scripts/_auto_clone_kq.json`:
   ```json
   [ { "yeu_cau_id": "…", "variants": [ { "noi_dung": "…", "lua_chon": ["…","…","…","…"], "dap_an": "B", "loi_giai": "…" } ] } ]
   ```
   `lua_chon` chỉ khi gốc là trắc nghiệm (đúng 4, không kèm "A."), khi đó `dap_an` = chữ cái A–D.
   Câu tự luận / trả lời ngắn: bỏ `lua_chon`, `dap_an` = kết quả cuối (số / phân số `$\dfrac{a}{b}$`), không đơn vị.
4. `node scripts/hangdoi-clone.mjs --ghi scripts/_auto_clone_kq.json` → vào bảng NHÁP chờ người duyệt. Xoá 2 file tạm.
5. Yêu cầu không làm được → `--bo <yeu_cau_id> "<lý do>"`. KHÔNG ghi liều (CLAUDE.md §1.5: thà bỏ trống còn hơn đánh sai).

## 2. Khi nào PHẢI `--bo` (không sinh)
- `co_hinh = true`: câu gốc có ảnh đề → clone đổi số làm hình lệch số. Lý do: "câu gốc có hình".
- `goc_da_xoa = true`: chạy `--don` (script tự đóng).
- Câu đúng/sai có mệnh đề (`loai_cau = dung_sai` hoặc `menh_de` khác null): bảng nháp không có cột mệnh đề.
- Đề gốc sai / thiếu dữ kiện / đáp án gốc mâu thuẫn lời giải: bỏ, nêu rõ chỗ sai trong lý do (người sửa gốc trước).
- Không tìm được bộ số cho kết quả đẹp sau khi đã thử nhiều bộ: bỏ, không hạ chuẩn.

## 3. Luật sinh biến thể (bám gốc tuyệt đối)
- GIỮ NGUYÊN cấu trúc câu, phương pháp giải, SỐ BƯỚC và THỨ TỰ bước. CHỈ thay con số / tên người / bối cảnh.
  Lời giải biến thể phải song ánh từng bước với lời giải gốc, chỉ khác con số.
- CẤM thêm bước, bớt bước, đổi cách giải, thêm dữ kiện/điều kiện không có trong gốc, diễn giải dài hơn gốc.
  Gốc không nói rõ bước nào thì biến thể cũng không bịa bước đó.
- Số liệu thay phải cho KẾT QUẢ ĐẸP (số nguyên hoặc phân số tối giản đơn giản như gốc), CÙNG độ khó, CÙNG độ lớn.
  Ra số xấu → thử bộ số khác cho tới khi đẹp. Giữ "thiết kế" của gốc: gốc có phân số chưa tối giản để HS rút gọn
  thì biến thể cũng vậy; gốc có 2 phân số cùng mẫu sau rút gọn thì biến thể cũng vậy.
- `ghi_chu` của người đặt = RÀNG BUỘC CỨNG, ưu tiên cao nhất, áp cho mọi biến thể.
- Các biến thể trong cùng yêu cầu phải KHÁC nhau và khác gốc (số khác, đáp số khác gốc).
- Trắc nghiệm: đúng 4 phương án, đúng 1 đáp án; 3 phương án sai nên là kết quả của lỗi HS hay mắc (như gốc nếu gốc
  làm vậy), không phải số ngẫu nhiên.
- Trình bày giống `mau_tham_khao` (cùng giọng, cùng độ chi tiết) nếu gốc và mẫu cùng phong cách.

## 4. Tự kiểm TRƯỚC khi ghi (bắt buộc từng biến thể)
- Giải lại độc lập từ đề biến thể (không nhìn lời giải vừa viết) → đáp số phải khớp `dap_an`.
- Đối chiếu từng bước với lời giải gốc: cùng số bước, cùng phép toán ở mỗi bước.
- Kết quả trung gian và cuối đều "đẹp" theo §3. Trắc nghiệm: chỉ đúng 1 phương án trùng đáp số.
- Không đạt bất kỳ điểm nào → sinh lại; sinh lại vẫn không đạt → bớt biến thể đó (ghi ít hơn, script cảnh báo)
  hoặc `--bo` cả yêu cầu nếu không có biến thể nào đạt.

## 5. Trình bày (như kho)
- KHÔNG chép nhãn "Câu N" / "Bài N" đầu đề (hệ thống tự đánh số). KHÔNG thêm nhãn ý con "a)", "b)" nếu gốc không có.
- Trắc nghiệm: `noi_dung` chỉ chứa đề dẫn, 4 phương án chỉ nằm ở `lua_chon`.
- Công thức trong `$…$`; MỖI công thức/phân số bọc riêng; phân số dùng `\dfrac{a}{b}`, không `\frac`, không `a/b`.
- GIỮ bố cục nhiều dòng của đề và lời giải gốc (mỗi ý / mỗi bước 1 dòng, xuống dòng thật, không `<br>`).
- Chia hết `$a \vdots b$`, không chia hết `$a \not\vdots b$`. Số thập phân dùng dấu chấm. Số đơn lẻ không cần `$`.
  Không để tiếng Việt có dấu trong `$…$`.
- Trong file JSON: LaTeX phải double backslash (`"\\dfrac"`), trích dẫn trong chuỗi dùng nháy đơn.

## 6. Ranh giới
- Script chỉ ghi vào `dai_cau_hoi_clone_cho_duyet` (nháp). Người duyệt ở ERP mới đưa vào kho thật. Không bao giờ
  ghi thẳng `dai_cau_hoi`, không sửa câu gốc, không tự duyệt.
- Hàng đợi hiện chỉ có cho kho Đại (`dai_*`). KHTN / Hình giải tích chưa có bảng hàng đợi clone.
