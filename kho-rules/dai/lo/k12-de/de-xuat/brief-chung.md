# Brief chung — ĐỀ XUẤT BẢN ĐỒ K12 TỪ ĐỀ THI (bước 2, 03/11)

Bối cảnh: Thùy (CEO) chốt 03/11 — bản đồ kiến thức K12 phải **bám vào ĐỀ THI** (giữa kì · cuối kì · thi thử TN · khảo sát · đề cương), không bám sách. Bước 1 đã xong: 10.133 câu đề K12 đã được đọc và gắn chương + dạng (thực đơn `thuc-don.md`, dựng từ sách/bản đồ cũ — chỉ là gợi ý). Bước 2 (việc của bạn): **đề xuất cây dạng bài** cho chương được giao, dựa trên TẦN SUẤT THẬT trong đề. Thùy sẽ duyệt qua HTML.

Bản đồ có 4 tầng: **Chủ đề (= chương, cố định) → Chuyên đề → Nhóm bài → Dạng bài**. Dạng bài = đơn vị chân lý (HS × dạng): một việc cụ thể HS phải biết làm, lặp lại qua nhiều đề.

## Luật đã chốt (không bàn lại)
1. **Câu Đúng–Sai KHÔNG vào dạng.** Chúng đi kho Đ/S cấp chủ đề. Dữ liệu bạn nhận đã loại sẵn câu Đ/S — chỉ còn trắc nghiệm / trả lời ngắn / tự luận.
2. **Bám đề thi.** Dạng nào đề thi hỏi nhiều → có chỗ riêng. Dạng sách có mà đề gần như không hỏi (≤ 3–4 câu trên ~chục nghìn câu) → **gộp vào dạng gần nhất** (không bỏ hẳn: đề mỗi năm đổi), ghi rõ gộp vào đâu và vì sao. Dạng đề hỏi nhiều mà thực đơn không có → **thêm dạng mới** (các câu `NEW`).
3. **Dạng = cách giải khác nhau**, không phải chỉ "đề khác số". Hai kiểu đề cùng một phương pháp giải → một dạng (kiểu đề khác nhau ghi trong mô tả). Hai kiểu đề phương pháp khác hẳn → hai dạng, dù ít câu (nếu ≥ ~12 câu).
4. Cỡ tham khảo: một dạng ~12–200 câu đề. Dưới ~12 câu mà phương pháp riêng thì giữ nếu rõ ràng và ghi "dạng hiếm"; còn không thì gộp. Một nhóm 2–6 dạng. Một chuyên đề 3–8 nhóm.
5. Tên dạng = cách HS nhận ra việc phải làm ("Tìm m để hàm số đồng biến trên khoảng"), tiếng Việt, ≤ 12 từ, không mã sách. Mô tả 1–2 câu: dấu hiệu đề + việc làm.
6. **Mã gốc bất biến**: bạn chỉ đặt mã TẠM (C1.2.3…) cho cây mới. Thực đơn có mã cũ (P1.2.1…) — ghi vào trường `tu` để biết dạng mới kế thừa từ đâu.
7. Chỗ **không chắc** hoặc **là quyết định của chủ** (ranh giới giữa hai chương, tách hay gộp một cụm lớn, thêm dạng chỉ vài chục câu…) → KHÔNG tự quyết: đưa vào `cau_hoi` kèm phương án + 1 phương án "đề xuất". Chỉ hỏi chỗ thật sự cần (≤ 10 câu/chương); chỗ có đáp án rõ thì tự quyết và nêu lý do ngắn.

## Dữ liệu (viết tắt `S` = `C:\Users\Admin\AppData\Local\Temp\claude\C--Users-Admin-Desktop-BKERP-bkdemy-erp-v2\5e42aa3b-8930-4334-a4cb-119870ea66c6\scratchpad`)
- `S\dx\<CH>-thongke.md` — thực đơn kèm số câu / số lượt đề / mức trung bình mỗi dạng + danh sách câu NEW theo mô tả (kèm id mẫu). **Đọc kỹ trước.**
- Xem nội dung câu: `node S\in-cau.cjs <CH> <offset> <limit> [maxlen]` in các câu KHÔNG Đ/S của chương (đúng thứ tự `S\dx\<CH>-ids.txt`). Muốn xem một câu theo id: `grep` id trong `S\k12de\lo-*.jsonl` (có `noi_dung`, `lua_chon`, `dap_an`, `loai_de`, `nam`). Dùng khi cần kiểm kiểu NEW hoặc ranh giới giữa hai dạng. KHÔNG cần đọc hết.
- Cây cũ để tham khảo (dựng từ sách — KHÔNG sao chép, chỉ lấy tên hay): `kho-rules/dai/lo/k12-hs/cau-truc.mjs`.
- Windows: Bash dùng đường dẫn `/c/Users/...`, node cần `C:/Users/...`; không có Python.

## Đầu ra (ghi vào `kho-rules/dai/lo/k12-de/de-xuat/`, repo `C:\Users\Admin\Desktop\BKERP\bkdemy-erp-v2`)
`<CH>.json` hợp lệ theo khuôn:
```
{ "chuong":"HS",
  "chuyen_de":[{"id":"C1","ten":"…","mo_ta":"…",
    "nhom":[{"id":"C1.1","ten":"…",
      "dang":[{"id":"C1.1.1","ten":"…","mo_ta":"…","tu":["P1.1.1","P1.2.1"],"moi":["mô tả NEW chép NGUYÊN VĂN từ thongke.md"],"hiem":false}]}]}],
  "gop":[{"ma":"P2.6.4","vao":"C2.3.1","ly_do":"…"}],     // dạng thực đơn có câu nhưng KHÔNG đứng riêng (đã gộp) — chỉ cần liệt kê nếu nó không nằm trong `tu` của dạng nào
  "bo_moi":[{"mo_ta":"…nguyên văn…","ly_do":"ngoài chương / đề hỏng / quá lẻ"}],   // mô tả NEW không xếp vào dạng nào
  "cau_hoi":[{"ma":"H1","tieu_de":"…","mo_ta":"vì sao hỏi, kèm số liệu (số câu)","chon":[["nhãn ngắn","hệ quả",true],["phương án khác","hệ quả",false]]}]}
```
Quy tắc ràng buộc (máy sẽ kiểm — sai là làm lại): (a) MỌI mã thực đơn có số câu > 0 phải nằm trong `tu` của đúng MỘT dạng (gộp thì ghi vào `tu` của dạng nhận); (b) MỌI mô tả NEW trong thongke.md phải nằm trong `moi` của đúng một dạng hoặc trong `bo_moi`; (c) id dạng duy nhất; (d) JSON parse được (`node -e "JSON.parse(require('fs').readFileSync(…))"`).
Với chương **chưa có dạng** (XS, SDT) làm thêm tệp `<CH>-cau.tsv` (`id⇥id_dạng_mới⇥ghi_chú`, mỗi câu KHÔNG Đ/S đúng một dòng) — xem brief riêng.

## Trả lời cuối (≤ 120 từ)
Số chuyên đề / nhóm / dạng; dạng lớn nhất (số câu); những quyết định lớn bạn đã tự quyết (và lý do 1 dòng); số câu hỏi đưa Thùy; có vấn đề dữ liệu nào đáng báo.
